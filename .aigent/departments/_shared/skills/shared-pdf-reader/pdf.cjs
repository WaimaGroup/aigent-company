#!/usr/bin/env node
/**
 * shared-pdf-reader/pdf.cjs
 *
 * Zero-dependency PDF READER — the read-side counterpart of shared-office-writer.
 * Extracts text, metadata and page counts from digital PDFs using only Node
 * stdlib (fs, path, zlib). A PDF is a graph of indirect objects whose content
 * streams are normally FlateDecode-compressed; Node's `zlib` inflates them, so
 * no external package is ever installed.
 *
 *   text    extract text (per page or concatenated, with --pages range).
 *   meta    Info dictionary (Title/Author/…) + total page count.
 *   count   total page count only (lightweight).
 *   search  find a term across pages, return page numbers + snippets.
 *
 * Contract documented in SKILL.md alongside this file. If behavior here and the
 * prose there diverge, THIS SCRIPT is the source of truth — adjust the prose.
 *
 * Robustness strategy: the file is indexed by brute-force scanning for
 * `N G obj` (so a broken/compressed xref never blocks us), object streams
 * (/Type /ObjStm) are decompressed to recover the page tree, and everything is
 * wrapped so a malformed corner degrades gracefully instead of crashing.
 *
 * Known ceiling (zero-dependency): no OCR (scanned/image-only PDFs yield no
 * text → NO_TEXT), and Type0/CID fonts without a /ToUnicode map cannot be
 * decoded to Unicode (their glyphs are skipped rather than emitted as garbage).
 * Encrypted PDFs are detected and reported (ENCRYPTED), not decrypted.
 *
 * No dependencies beyond Node stdlib. Compatible with Node 18+.
 *
 * Usage:
 *   node pdf.cjs text   --input <f.pdf> [--pages <spec>] [--max-pages N]
 *                       [--by-page] [--out <f.txt>] [--raw]
 *   node pdf.cjs meta   --input <f.pdf>
 *   node pdf.cjs count  --input <f.pdf>
 *   node pdf.cjs search --input <f.pdf> --query <str> [--pages <spec>]
 *                       [--ignore-case] [--context N]
 *
 * Exit codes:
 *   0 = success (JSON `{ ok: true, ... }` on stdout; or raw text with --raw)
 *   1 = error   (JSON `{ ok: false, error: {...} }` on stdout + human line on stderr)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---------------------------------------------------------------------------
// CLI plumbing (mirrors shared-office-writer / shared-base64 conventions)
// ---------------------------------------------------------------------------

function emitError(code, message) {
  process.stdout.write(JSON.stringify({ ok: false, error: { code, message } }) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + message + '\n');
  process.exit(1);
}
function emitOk(data) {
  process.stdout.write(JSON.stringify(Object.assign({ ok: true }, data)) + '\n');
  process.exit(0);
}

function help() {
  process.stdout.write([
    'Usage:',
    '  node pdf.cjs text   --input <f.pdf> [--pages <spec>] [--max-pages N]',
    '                      [--by-page] [--out <f.txt>] [--raw]',
    '  node pdf.cjs meta   --input <f.pdf>',
    '  node pdf.cjs count  --input <f.pdf>',
    '  node pdf.cjs search --input <f.pdf> --query <str> [--pages <spec>]',
    '                      [--ignore-case] [--context N]',
    '',
    'Commands:',
    '  text    Extract text. Default: JSON with a `text` field (pages joined).',
    '          --by-page   return an array `pages:[{page,text}]` instead.',
    '          --out <f>   write plain text to a file, return only stats.',
    '          --raw       print plain text to stdout (no JSON). Good for | head.',
    '  meta    Info dict (Title/Author/Subject/Creator/Producer/dates) + pages.',
    '  count   Total page count only.',
    '  search  Locate a term; returns matching pages with snippets.',
    '  fonts   Diagnose fonts per page (subtype, encoding, ToUnicode, FontFile,',
    '          embedded cmap, and whether text is recoverable).',
    '',
    '--pages <spec>: page selection, 1-based. Examples: "all" (default), "3",',
    '                "1-15", "2-", "-10", "1,4,7-9".',
    '',
    'Output: JSON to stdout. Exit 0 on success, 1 on error.',
    '',
  ].join('\n'));
  process.exit(0);
}

function parseArgs(argv) {
  const out = { byPage: false, raw: false, ignoreCase: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { out.help = true; continue; }
    if (a === '--by-page') { out.byPage = true; continue; }
    if (a === '--raw') { out.raw = true; continue; }
    if (a === '--ignore-case') { out.ignoreCase = true; continue; }
    if (!a.startsWith('--')) emitError('BAD_ARGS', "Unexpected positional argument: '" + a + "'");
    const eq = a.indexOf('=');
    let key, val;
    if (eq !== -1) { key = a.substring(2, eq); val = a.substring(eq + 1); }
    else { key = a.substring(2); val = argv[++i]; }
    if (val === undefined || val === null) emitError('BAD_ARGS', 'Missing value for --' + key);
    if (key === 'input') out.input = val;
    else if (key === 'output' || key === 'out') out.out = val;
    else if (key === 'pages') out.pages = val;
    else if (key === 'max-pages') out.maxPages = parseInt(val, 10);
    else if (key === 'query') out.query = val;
    else if (key === 'context') out.context = parseInt(val, 10);
    else emitError('BAD_ARGS', 'Unknown argument: --' + key);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Low-level PDF object parser (recursive descent over a latin1 string view).
// Value representations:
//   name   -> { n: 'Catalog' }
//   ref    -> { r: [num, gen] }
//   string -> { s: Buffer }
//   dict   -> plain object keyed by name (no slash)
//   array  -> JS array
//   number/boolean/null -> native
// ---------------------------------------------------------------------------

function isWs(ch) {
  return ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t' || ch === '\f' || ch === '\x00';
}
function isDelim(ch) { return '()<>[]{}/%'.indexOf(ch) !== -1; }
function isRef(v) { return v && typeof v === 'object' && Array.isArray(v.r); }
function isName(v) { return v && typeof v === 'object' && typeof v.n === 'string'; }
function isDict(v) { return v && typeof v === 'object' && !Array.isArray(v) && !isRef(v) && !isName(v) && !(v.s instanceof Buffer); }

function skipWs(s, i) {
  while (i < s.length) {
    const ch = s[i];
    if (isWs(ch)) { i++; continue; }
    if (ch === '%') { while (i < s.length && s[i] !== '\n' && s[i] !== '\r') i++; continue; }
    break;
  }
  return i;
}

function parseName(s, i) {
  i++; // skip '/'
  let name = '';
  while (i < s.length && !isWs(s[i]) && !isDelim(s[i])) {
    if (s[i] === '#' && i + 2 < s.length) {
      const hex = s.substr(i + 1, 2);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) { name += String.fromCharCode(parseInt(hex, 16)); i += 3; continue; }
    }
    name += s[i]; i++;
  }
  return { v: { n: name }, i };
}

function parseLiteralString(s, i) {
  i++; // skip '('
  let depth = 1, bytes = [];
  while (i < s.length) {
    const ch = s[i];
    if (ch === '\\') {
      const n = s[i + 1];
      if (n === 'n') { bytes.push(10); i += 2; }
      else if (n === 'r') { bytes.push(13); i += 2; }
      else if (n === 't') { bytes.push(9); i += 2; }
      else if (n === 'b') { bytes.push(8); i += 2; }
      else if (n === 'f') { bytes.push(12); i += 2; }
      else if (n === '(') { bytes.push(40); i += 2; }
      else if (n === ')') { bytes.push(41); i += 2; }
      else if (n === '\\') { bytes.push(92); i += 2; }
      else if (n === '\r') { i += 2; if (s[i] === '\n') i++; } // line continuation
      else if (n === '\n') { i += 2; }
      else if (n >= '0' && n <= '7') {
        let oct = '', k = i + 1;
        while (k < s.length && k < i + 4 && s[k] >= '0' && s[k] <= '7') { oct += s[k]; k++; }
        bytes.push(parseInt(oct, 8) & 0xff); i = k;
      } else { bytes.push(n.charCodeAt(0)); i += 2; }
      continue;
    }
    if (ch === '(') { depth++; bytes.push(40); i++; continue; }
    if (ch === ')') { depth--; if (depth === 0) { i++; break; } bytes.push(41); i++; continue; }
    bytes.push(ch.charCodeAt(0) & 0xff); i++;
  }
  return { v: { s: Buffer.from(bytes) }, i };
}

function parseHexString(s, i) {
  i++; // skip '<'
  let hex = '';
  while (i < s.length && s[i] !== '>') { if (!isWs(s[i])) hex += s[i]; i++; }
  i++; // skip '>'
  if (hex.length % 2 === 1) hex += '0';
  const bytes = [];
  for (let k = 0; k < hex.length; k += 2) bytes.push(parseInt(hex.substr(k, 2), 16) & 0xff);
  return { v: { s: Buffer.from(bytes) }, i };
}

function parseArray(s, i) {
  i++; // skip '['
  const arr = [];
  while (i < s.length) {
    i = skipWs(s, i);
    if (s[i] === ']') { i++; break; }
    const pr = parseValue(s, i);
    if (pr.i === i) { i++; continue; } // safety against stalling
    arr.push(pr.v); i = pr.i;
  }
  return { v: arr, i };
}

function parseDict(s, i) {
  i += 2; // skip '<<'
  const dict = {};
  while (i < s.length) {
    i = skipWs(s, i);
    if (s[i] === '>' && s[i + 1] === '>') { i += 2; break; }
    if (s[i] !== '/') { // malformed; bail to avoid infinite loop
      const j = s.indexOf('>>', i);
      i = j === -1 ? s.length : j + 2; break;
    }
    const kp = parseName(s, i); i = kp.i;
    const vp = parseValue(s, i); i = vp.i;
    dict[kp.v.n] = vp.v;
  }
  return { v: dict, i };
}

function parseNumberOrRef(s, i) {
  const start = i;
  if (s[i] === '+' || s[i] === '-') i++;
  while (i < s.length && (s[i] === '.' || (s[i] >= '0' && s[i] <= '9'))) i++;
  const tok = s.substring(start, i);
  const n1 = parseFloat(tok);
  if (Number.isNaN(n1)) return { v: null, i: i + 1 }; // skip a stray char
  // lookahead for "<int> <int> R" reference
  if (Number.isInteger(n1) && n1 >= 0) {
    let j = skipWs(s, i);
    const g0 = j;
    while (j < s.length && s[j] >= '0' && s[j] <= '9') j++;
    if (j > g0) {
      const gen = parseInt(s.substring(g0, j), 10);
      let k = skipWs(s, j);
      if (s[k] === 'R' && (k + 1 >= s.length || isWs(s[k + 1]) || isDelim(s[k + 1]))) {
        return { v: { r: [n1, gen] }, i: k + 1 };
      }
    }
  }
  return { v: n1, i };
}

function parseValue(s, i) {
  i = skipWs(s, i);
  if (i >= s.length) return { v: null, i };
  const ch = s[i];
  if (ch === '<' && s[i + 1] === '<') return parseDict(s, i);
  if (ch === '<') return parseHexString(s, i);
  if (ch === '(') return parseLiteralString(s, i);
  if (ch === '[') return parseArray(s, i);
  if (ch === '/') return parseName(s, i);
  if (ch === 't' && s.substr(i, 4) === 'true') return { v: true, i: i + 4 };
  if (ch === 'f' && s.substr(i, 5) === 'false') return { v: false, i: i + 5 };
  if (ch === 'n' && s.substr(i, 4) === 'null') return { v: null, i: i + 4 };
  if (ch === '+' || ch === '-' || ch === '.' || (ch >= '0' && ch <= '9')) return parseNumberOrRef(s, i);
  return { v: null, i: i + 1 }; // unknown token: advance one char
}

// ---------------------------------------------------------------------------
// Document: index objects, recover object streams, resolve refs.
// ---------------------------------------------------------------------------

function PdfDoc(buf) {
  this.buf = buf;
  this.s = buf.toString('latin1'); // 1 byte = 1 char, offsets align with bytes
  this.index = new Map();
  this._ttCache = {}; // FontFile2 obj num → recovered cmap (parsed once, reused across pages)
  this._indexRaw();
  this._indexObjStreams();
}

PdfDoc.prototype.getObj = function (num) { return this.index.get(num); };

PdfDoc.prototype.deref = function (v) {
  let guard = 0;
  while (isRef(v) && guard++ < 32) { const o = this.index.get(v.r[0]); v = o ? o.value : null; }
  return v;
};
PdfDoc.prototype.dget = function (d, k) {
  d = this.deref(d);
  if (!isDict(d)) return undefined;
  return d[k];
};
PdfDoc.prototype.num = function (v) { v = this.deref(v); return typeof v === 'number' ? v : null; };
PdfDoc.prototype.nameOf = function (v) { v = this.deref(v); return isName(v) ? v.n : (typeof v === 'string' ? v : null); };
PdfDoc.prototype.asArray = function (v) { v = this.deref(v); if (Array.isArray(v)) return v; if (v == null) return []; return [v]; };

PdfDoc.prototype._indexRaw = function () {
  const s = this.s;
  const re = /(\d+)\s+(\d+)\s+obj\b/g;
  let m;
  while ((m = re.exec(s))) {
    const num = parseInt(m[1], 10), gen = parseInt(m[2], 10);
    let pos = re.lastIndex, value = null, isStream = false, streamStart = -1;
    try { const pr = parseValue(s, pos); value = pr.v; pos = pr.i; } catch (e) { value = null; }
    const q = skipWs(s, pos);
    if (s.substr(q, 6) === 'stream') {
      isStream = true;
      let dp = q + 6;
      if (s[dp] === '\r') dp++;
      if (s[dp] === '\n') dp++;
      streamStart = dp;
      const es = s.indexOf('endstream', streamStart);
      re.lastIndex = es >= 0 ? es + 9 : streamStart;
    } else {
      re.lastIndex = pos;
    }
    this.index.set(num, {
      num, gen, value, isStream, streamStart,
      dict: isDict(value) ? value : null,
    });
  }
};

PdfDoc.prototype._indexObjStreams = function () {
  for (const o of [...this.index.values()]) {
    if (!o.isStream || !o.dict) continue;
    if (this.nameOf(o.dict.Type) !== 'ObjStm') continue;
    try {
      const d = this.decodeStream(o);
      if (!d) continue;
      const N = this.num(o.dict.N), First = this.num(o.dict.First);
      if (N == null || First == null) continue;
      const ds = d.toString('latin1');
      const hdr = ds.slice(0, First).trim().split(/\s+/).map(Number);
      for (let k = 0; k < N; k++) {
        const onum = hdr[2 * k], off = hdr[2 * k + 1];
        if (onum == null || off == null || this.index.has(onum)) continue;
        try {
          const pr = parseValue(ds, First + off);
          this.index.set(onum, {
            num: onum, gen: 0, value: pr.v, isStream: false, streamStart: -1,
            dict: isDict(pr.v) ? pr.v : null,
          });
        } catch (e) { /* skip this sub-object */ }
      }
    } catch (e) { /* skip this ObjStm */ }
  }
};

PdfDoc.prototype._streamBytes = function (o) {
  let len = this.num(o.dict ? o.dict.Length : null);
  const start = o.streamStart;
  let end;
  if (typeof len === 'number' && len >= 0 && start + len <= this.buf.length) {
    end = start + len;
    // sanity check: 'endstream' should be near here; if not, fall back to search
    const tail = this.s.substr(end, 24);
    if (tail.indexOf('endstream') === -1) end = -1;
  } else {
    end = -1;
  }
  if (end === -1) {
    let es = this.s.indexOf('endstream', start);
    if (es === -1) es = this.buf.length;
    while (es > start && (this.s[es - 1] === '\n' || this.s[es - 1] === '\r')) es--;
    end = es;
  }
  return this.buf.slice(start, end);
};

// --- stream filters -------------------------------------------------------

function inflate(data) {
  const opts = { finishFlush: zlib.constants.Z_SYNC_FLUSH };
  const attempts = [
    () => zlib.inflateSync(data, opts),
    () => zlib.inflateRawSync(data, opts),
  ];
  for (const a of attempts) { try { return a(); } catch (e) { /* next */ } }
  // skip leading whitespace bytes then retry
  let k = 0;
  while (k < data.length && (data[k] === 0x0d || data[k] === 0x0a || data[k] === 0x20 || data[k] === 0x09)) k++;
  if (k > 0) {
    const d2 = data.slice(k);
    for (const a of [() => zlib.inflateSync(d2, opts), () => zlib.inflateRawSync(d2, opts)]) {
      try { return a(); } catch (e) { /* next */ }
    }
  }
  return null;
}

function asciiHexDecode(data) {
  let hex = data.toString('latin1').replace(/[^0-9A-Fa-f]/g, '');
  if (hex.length % 2 === 1) hex += '0';
  return Buffer.from(hex, 'hex');
}

function ascii85Decode(data) {
  let s = data.toString('latin1').replace(/\s/g, '');
  if (s.startsWith('<~')) s = s.slice(2);
  const end = s.indexOf('~>');
  if (end !== -1) s = s.slice(0, end);
  const out = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === 'z') { out.push(0, 0, 0, 0); i++; continue; }
    let tuple = 0, count = 0;
    for (; count < 5 && i < s.length; count++, i++) {
      tuple = tuple * 85 + (s.charCodeAt(i) - 33);
    }
    const pad = 5 - count;
    for (let p = 0; p < pad; p++) tuple = tuple * 85 + 84;
    const bytes = [(tuple >>> 24) & 0xff, (tuple >>> 16) & 0xff, (tuple >>> 8) & 0xff, tuple & 0xff];
    for (let b = 0; b < 4 - pad; b++) out.push(bytes[b]);
  }
  return Buffer.from(out);
}

function lzwDecode(data) {
  // PDF LZWDecode, EarlyChange = 1 (default).
  const out = [];
  let bitBuf = 0, bitCnt = 0, codeWidth = 9, nextCode = 258;
  let dict = [];
  const reset = () => { dict = []; for (let i = 0; i < 256; i++) dict[i] = [i]; nextCode = 258; codeWidth = 9; };
  reset();
  let prev = null;
  for (let i = 0; i < data.length; i++) {
    bitBuf = (bitBuf << 8) | data[i]; bitCnt += 8;
    while (bitCnt >= codeWidth) {
      const code = (bitBuf >> (bitCnt - codeWidth)) & ((1 << codeWidth) - 1);
      bitCnt -= codeWidth;
      if (code === 256) { reset(); prev = null; continue; }
      if (code === 257) return Buffer.from(out); // EOD
      let entry;
      if (dict[code]) entry = dict[code];
      else if (code === nextCode && prev) entry = prev.concat(prev[0]);
      else return Buffer.from(out); // corrupt
      for (const b of entry) out.push(b);
      if (prev) { dict[nextCode++] = prev.concat(entry[0]); }
      prev = entry;
      if (nextCode + 1 >= (1 << codeWidth) && codeWidth < 12) codeWidth++;
    }
  }
  return Buffer.from(out);
}

function applyPredictor(doc, data, parms) {
  const predictor = doc.num(parms.Predictor) || 1;
  if (predictor <= 1) return data;
  const colors = doc.num(parms.Colors) || 1;
  const bpc = doc.num(parms.BitsPerComponent) || 8;
  const columns = doc.num(parms.Columns) || 1;
  const bpp = Math.max(1, Math.ceil((colors * bpc) / 8));
  const rowLen = Math.max(1, Math.ceil((colors * bpc * columns) / 8));
  if (predictor === 2) { // TIFF predictor 2
    const out = Buffer.from(data);
    for (let r = 0; r * rowLen < out.length; r++) {
      const off = r * rowLen;
      for (let i = bpp; i < rowLen && off + i < out.length; i++) out[off + i] = (out[off + i] + out[off + i - bpp]) & 0xff;
    }
    return out;
  }
  // PNG predictors (>=10): each row prefixed with a filter-type byte
  const rows = [];
  let prev = Buffer.alloc(rowLen);
  let p = 0;
  while (p < data.length) {
    const ft = data[p++];
    const row = Buffer.from(data.slice(p, p + rowLen)); p += rowLen;
    for (let i = 0; i < row.length; i++) {
      const a = i >= bpp ? row[i - bpp] : 0;
      const b = prev[i] || 0;
      const c = i >= bpp ? (prev[i - bpp] || 0) : 0;
      let v = row[i];
      switch (ft) {
        case 1: v = (v + a) & 0xff; break;
        case 2: v = (v + b) & 0xff; break;
        case 3: v = (v + ((a + b) >> 1)) & 0xff; break;
        case 4: {
          const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
          const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
          v = (v + pr) & 0xff; break;
        }
        default: break; // 0 = none
      }
      row[i] = v;
    }
    rows.push(row); prev = row;
  }
  return Buffer.concat(rows);
}

PdfDoc.prototype.decodeStream = function (o) {
  let data = this._streamBytes(o);
  const filters = this.asArray(o.dict ? (o.dict.Filter || o.dict.F) : null).map((f) => this.nameOf(f));
  const parmsArr = this.asArray(o.dict ? (o.dict.DecodeParms || o.dict.DP) : null);
  for (let k = 0; k < filters.length; k++) {
    const f = filters[k];
    const p = this.deref(parmsArr[k]);
    if (f === 'FlateDecode' || f === 'Fl') {
      data = inflate(data);
      if (!data) return null;
      if (isDict(p) && (this.num(p.Predictor) || 1) > 1) data = applyPredictor(this, data, p);
    } else if (f === 'ASCIIHexDecode' || f === 'AHx') {
      data = asciiHexDecode(data);
    } else if (f === 'ASCII85Decode' || f === 'A85') {
      data = ascii85Decode(data);
    } else if (f === 'LZWDecode' || f === 'LZW') {
      data = lzwDecode(data);
      if (isDict(p) && (this.num(p.Predictor) || 1) > 1) data = applyPredictor(this, data, p);
    } else if (!f) {
      // no filter: raw bytes
    } else {
      return null; // DCTDecode / CCITTFax / JBIG2 / JPX → image data, not text
    }
  }
  return data;
};

// ---------------------------------------------------------------------------
// Page tree + per-page text extraction
// ---------------------------------------------------------------------------

PdfDoc.prototype.isEncrypted = function () {
  // Look for /Encrypt in any trailer dict or XRef stream dict.
  const tre = /trailer\b/g; let m;
  while ((m = tre.exec(this.s))) {
    try { const pr = parseValue(this.s, skipWs(this.s, m.index + 7)); if (isDict(pr.v) && pr.v.Encrypt !== undefined) return true; } catch (e) { /* */ }
  }
  for (const o of this.index.values()) {
    if (o.dict && this.nameOf(o.dict.Type) === 'XRef' && o.dict.Encrypt !== undefined) return true;
  }
  return false;
};

PdfDoc.prototype.findCatalog = function () {
  let root = null;
  const tre = /trailer\b/g; let m;
  while ((m = tre.exec(this.s))) {
    try { const pr = parseValue(this.s, skipWs(this.s, m.index + 7)); if (isDict(pr.v) && pr.v.Root) root = pr.v.Root; } catch (e) { /* */ }
  }
  for (const o of this.index.values()) {
    if (o.dict && this.nameOf(o.dict.Type) === 'XRef' && o.dict.Root) root = o.dict.Root;
  }
  let cat = root ? this.deref(root) : null;
  if (isDict(cat) && cat.Pages) return cat;
  let last = null;
  for (const o of this.index.values()) {
    if (o.dict && this.nameOf(o.dict.Type) === 'Catalog' && o.dict.Pages) last = o.dict;
  }
  return last;
};

PdfDoc.prototype.collectPages = function () {
  const self = this;
  const cat = this.findCatalog();
  const pages = [];
  const seen = new Set();
  function rec(node, inheritedRes, depth) {
    if (depth > 80) return;
    node = self.deref(node);
    if (!isDict(node)) return;
    const res = node.Resources !== undefined ? node.Resources : inheritedRes;
    const type = self.nameOf(node.Type);
    const kids = node.Kids;
    if (type === 'Pages' || (kids !== undefined && type !== 'Page')) {
      for (const kid of self.asArray(kids)) {
        const key = isRef(kid) ? kid.r[0] : null;
        if (key != null) { if (seen.has(key)) continue; seen.add(key); }
        rec(kid, res, depth + 1);
      }
    } else {
      node.__res = res;
      pages.push(node);
    }
  }
  if (isDict(cat) && cat.Pages) rec(cat.Pages, undefined, 0);

  if (pages.length === 0) { // fallback: every /Type /Page object, by object number
    const arr = [...this.index.values()].filter((o) => o.dict && this.nameOf(o.dict.Type) === 'Page').sort((a, b) => a.num - b.num);
    for (const o of arr) { o.value.__res = o.value.Resources; pages.push(o.value); }
  }
  if (pages.length === 0) { // last resort: content-bearing streams in object order
    const arr = [...this.index.values()].filter((o) => o.isStream).sort((a, b) => a.num - b.num);
    for (const o of arr) {
      try {
        const d = this.decodeStream(o);
        if (d) {
          const t = d.toString('latin1');
          if (t.indexOf('BT') !== -1 && (t.indexOf('Tj') !== -1 || t.indexOf('TJ') !== -1)) {
            pages.push({ Contents: { r: [o.num, 0] }, __res: undefined });
          }
        }
      } catch (e) { /* skip */ }
    }
  }
  return pages;
};

// --- /ToUnicode CMap parsing (best effort) --------------------------------

function hexUnitsToStr(hex) {
  let r = '';
  if (hex.length % 4 === 0) {
    for (let k = 0; k < hex.length; k += 4) r += String.fromCharCode(parseInt(hex.substr(k, 4), 16));
  } else if (hex.length === 2) {
    r = String.fromCharCode(parseInt(hex, 16));
  } else {
    for (let k = 0; k + 4 <= hex.length; k += 4) r += String.fromCharCode(parseInt(hex.substr(k, 4), 16));
  }
  return r;
}

function parseToUnicode(s) {
  const map = {};
  let m;
  const charRe = /beginbfchar([\s\S]*?)endbfchar/g;
  while ((m = charRe.exec(s))) {
    const pr = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g; let mm;
    while ((mm = pr.exec(m[1]))) map[parseInt(mm[1], 16)] = hexUnitsToStr(mm[2]);
  }
  const rangeRe = /beginbfrange([\s\S]*?)endbfrange/g;
  while ((m = rangeRe.exec(s))) {
    const pr = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(\[[^\]]*\]|<[0-9A-Fa-f]+>)/g; let mm;
    while ((mm = pr.exec(m[1]))) {
      const lo = parseInt(mm[1], 16), hi = parseInt(mm[2], 16), dst = mm[3];
      if (hi - lo > 65535) continue;
      if (dst[0] === '[') {
        const items = dst.slice(1, -1).match(/<([0-9A-Fa-f]+)>/g) || [];
        for (let c = lo, idx = 0; c <= hi && idx < items.length; c++, idx++) map[c] = hexUnitsToStr(items[idx].replace(/[<>]/g, ''));
      } else {
        const base = dst.replace(/[<>]/g, '');
        const baseNum = parseInt(base, 16);
        const width = base.length;
        for (let c = lo; c <= hi; c++) {
          const h = (baseNum + (c - lo)).toString(16).padStart(width, '0');
          map[c] = hexUnitsToStr(h);
        }
      }
    }
  }
  return map;
}

// --- Embedded TrueType cmap parsing (fallback for CID fonts sans /ToUnicode) --
// Recovers Unicode from a CIDFontType2 + FontFile2 when no /ToUnicode map is
// present (e.g. iText / Spanish public-administration PLACSP tenders) by reading
// the embedded font's own `cmap` table and reversing it (Unicode→GID → GID→Unicode).
// This is the deterministic path real extractors (pdfminer) use; it works as long
// as the subsetted font still ships a cmap table. CFF (FontFile3) is not covered.

function parseCmapSubtable(buf, o, pid, eid) {
  const fmt = buf.readUInt16BE(o);
  const map = {}; // unicode codepoint -> gid
  if (fmt === 0) {
    for (let i = 0; i < 256 && o + 6 + i < buf.length; i++) { const g = buf.readUInt8(o + 6 + i); if (g) map[i] = g; }
  } else if (fmt === 4) {
    const segX2 = buf.readUInt16BE(o + 6); const segCount = segX2 / 2;
    const endO = o + 14, startO = endO + segX2 + 2, deltaO = startO + segX2, rangeO = deltaO + segX2;
    for (let s = 0; s < segCount; s++) {
      const end = buf.readUInt16BE(endO + s * 2), start = buf.readUInt16BE(startO + s * 2);
      const delta = buf.readUInt16BE(deltaO + s * 2), ro = buf.readUInt16BE(rangeO + s * 2);
      if (start > end) continue;
      for (let c = start; c <= end && c !== 0xffff; c++) {
        let g;
        if (ro === 0) { g = (c + delta) & 0xffff; }
        else { const gi = rangeO + s * 2 + ro + (c - start) * 2; if (gi + 1 >= buf.length) continue; g = buf.readUInt16BE(gi); if (g !== 0) g = (g + delta) & 0xffff; }
        if (g) { let cp = c; if (pid === 3 && eid === 0 && c >= 0xf000) cp = c - 0xf000; map[cp] = g; }
      }
    }
  } else if (fmt === 6) {
    const first = buf.readUInt16BE(o + 6), count = buf.readUInt16BE(o + 8);
    for (let i = 0; i < count; i++) { const g = buf.readUInt16BE(o + 10 + i * 2); if (g) map[first + i] = g; }
  } else if (fmt === 12) {
    const nGroups = buf.readUInt32BE(o + 12);
    for (let i = 0; i < nGroups; i++) {
      const g = o + 16 + i * 12;
      const sc = buf.readUInt32BE(g), ec = buf.readUInt32BE(g + 4), sg = buf.readUInt32BE(g + 8);
      if (ec - sc > 70000) continue;
      for (let c = sc; c <= ec; c++) map[c] = sg + (c - sc);
    }
  } else { return null; }
  return map;
}

function parseTrueTypeCmap(buf) {
  try {
    if (!buf || buf.length < 12) return null;
    let off = 0;
    if (buf.toString('latin1', 0, 4) === 'ttcf') off = buf.readUInt32BE(12); // collection → first font
    const numTables = buf.readUInt16BE(off + 4);
    let cmapOff = -1;
    for (let i = 0; i < numTables; i++) {
      const rec = off + 12 + i * 16;
      if (buf.toString('latin1', rec, rec + 4) === 'cmap') { cmapOff = buf.readUInt32BE(rec + 8); break; }
    }
    if (cmapOff < 0) return null;
    const nSub = buf.readUInt16BE(cmapOff + 2);
    let best = null, bestScore = -1;
    for (let i = 0; i < nSub; i++) {
      const rec = cmapOff + 4 + i * 8;
      const pid = buf.readUInt16BE(rec), eid = buf.readUInt16BE(rec + 2), so = buf.readUInt32BE(rec + 4);
      let score = 0;
      if (pid === 3 && eid === 10) score = 5; else if (pid === 3 && eid === 1) score = 4;
      else if (pid === 0) score = 3; else if (pid === 3 && eid === 0) score = 2; else if (pid === 1 && eid === 0) score = 1;
      if (score > bestScore) { bestScore = score; best = { pid, eid, sub: cmapOff + so }; }
    }
    if (!best) return null;
    return parseCmapSubtable(buf, best.sub, best.pid, best.eid);
  } catch (e) { return null; }
}

// Recover a code→Unicode map for a CIDFontType2 descendant via its FontFile2 cmap.
// Returns { cmap: <bool, font had a cmap>, map: <code→string or null> }.
PdfDoc.prototype.recoverCidTrueType = function (cidFont, ff2ref) {
  const cacheKey = isRef(ff2ref) ? ff2ref.r[0] : null;
  if (cacheKey != null && this._ttCache[cacheKey]) return this._ttCache[cacheKey];
  let result = { cmap: false, map: null };
  try {
    const o = isRef(ff2ref) ? this.getObj(ff2ref.r[0]) : null;
    if (!o || !o.isStream) { if (cacheKey != null) this._ttCache[cacheKey] = result; return result; }
    const data = this.decodeStream(o);
    const uniToGid = parseTrueTypeCmap(data);
    if (!uniToGid) { if (cacheKey != null) this._ttCache[cacheKey] = result; return result; }
    result.cmap = true;
    // reverse: gid → unicode codepoint (keep the lowest codepoint per gid)
    const gidToUni = {};
    for (const uStr of Object.keys(uniToGid)) {
      const gid = uniToGid[uStr], u = Number(uStr);
      if (gidToUni[gid] === undefined || u < gidToUni[gid]) gidToUni[gid] = u;
    }
    // CIDToGIDMap: Identity (default) → cid==gid; stream → 2 bytes per cid
    const c2g = cidFont.CIDToGIDMap;
    const map = {};
    if (isRef(c2g)) {
      const co = this.getObj(c2g.r[0]);
      const cd = co && co.isStream ? this.decodeStream(co) : null;
      if (cd) {
        const n = Math.floor(cd.length / 2);
        for (let cid = 0; cid < n; cid++) {
          const gid = (cd[2 * cid] << 8) | cd[2 * cid + 1];
          const u = gidToUni[gid];
          if (u !== undefined) map[cid] = String.fromCodePoint(u);
        }
      }
    } else {
      // Identity: code == cid == gid
      for (const gStr of Object.keys(gidToUni)) map[Number(gStr)] = String.fromCodePoint(gidToUni[gStr]);
    }
    result.map = map;
  } catch (e) { /* leave result as-is */ }
  if (cacheKey != null) this._ttCache[cacheKey] = result;
  return result;
};

// Resolve a font dict to { twoByte, toUnicode, diag } — diag drives the `fonts` command.
PdfDoc.prototype.fontDetails = function (fobj) {
  const sub = this.nameOf(fobj.Subtype);
  const isType0 = sub === 'Type0';
  const encName = this.nameOf(fobj.Encoding);
  const diag = {
    subtype: sub || null,
    base_font: this.nameOf(fobj.BaseFont) || null,
    encoding: encName || (fobj.Encoding !== undefined ? 'custom' : null),
    to_unicode: false,
    cid_subtype: null,
    cid_to_gid: null,
    font_file: null,
    embedded_cmap: null,
    recovered_via: null,
  };
  let toUni = null;
  const tu = fobj.ToUnicode;
  if (isRef(tu)) {
    const o = this.getObj(tu.r[0]);
    if (o && o.isStream) { const d = this.decodeStream(o); if (d) { toUni = parseToUnicode(d.toString('latin1')); diag.to_unicode = true; diag.recovered_via = 'ToUnicode'; } }
  }
  if (isType0) {
    const df = this.asArray(fobj.DescendantFonts);
    const cid = df.length ? this.deref(df[0]) : null;
    if (isDict(cid)) {
      diag.cid_subtype = this.nameOf(cid.Subtype);
      diag.cid_to_gid = isRef(cid.CIDToGIDMap) ? 'stream' : (this.nameOf(cid.CIDToGIDMap) || 'Identity');
      const fd = this.deref(cid.FontDescriptor);
      let ff2 = null;
      if (isDict(fd)) {
        ff2 = fd.FontFile2;
        diag.font_file = isRef(ff2) ? 'FontFile2' : (isRef(fd.FontFile3) ? 'FontFile3' : (isRef(fd.FontFile) ? 'FontFile' : null));
      }
      // Fallback when /ToUnicode missing: read the embedded TrueType cmap.
      const encOk = !encName || /Identity/.test(encName);
      if (!toUni && diag.cid_subtype === 'CIDFontType2' && isRef(ff2) && encOk) {
        const rec = this.recoverCidTrueType(cid, ff2);
        diag.embedded_cmap = rec.cmap;
        if (rec.map && Object.keys(rec.map).length) { toUni = rec.map; diag.recovered_via = 'truetype-cmap'; }
      }
    }
  }
  diag.recoverable = !!toUni || !isType0; // simple fonts decode via WinAnsi/Latin1
  return { twoByte: isType0, toUnicode: toUni, diag };
};

PdfDoc.prototype.buildFontMap = function (resources) {
  const map = {};
  try {
    const res = this.deref(resources);
    const fontDict = this.deref(this.dget(res, 'Font'));
    if (!isDict(fontDict)) return map;
    for (const k of Object.keys(fontDict)) {
      try {
        const fobj = this.deref(fontDict[k]);
        if (!isDict(fobj)) continue;
        const det = this.fontDetails(fobj);
        map[k] = { twoByte: det.twoByte, toUnicode: det.toUnicode };
      } catch (e) { /* skip font */ }
    }
  } catch (e) { /* no resources */ }
  return map;
};

// --- content stream → text ------------------------------------------------

// WinAnsiEncoding (CP1252) overrides for 0x80–0x9F, where it diverges from
// Latin1. Covers €, smart quotes, en/em dashes, … — pervasive in real docs.
const WIN_ANSI = {
  0x80: '€', 0x82: '‚', 0x83: 'ƒ', 0x84: '„', 0x85: '…',
  0x86: '†', 0x87: '‡', 0x88: 'ˆ', 0x89: '‰', 0x8A: 'Š',
  0x8B: '‹', 0x8C: 'Œ', 0x8E: 'Ž', 0x91: '‘', 0x92: '’',
  0x93: '“', 0x94: '”', 0x95: '•', 0x96: '–', 0x97: '—',
  0x98: '˜', 0x99: '™', 0x9A: 'š', 0x9B: '›', 0x9C: 'œ',
  0x9E: 'ž', 0x9F: 'Ÿ',
};

function decodeSimpleBytes(bytes) {
  let r = '';
  for (let k = 0; k < bytes.length; k++) {
    const b = bytes[k];
    r += (b >= 0x80 && b <= 0x9f && WIN_ANSI[b]) ? WIN_ANSI[b] : String.fromCharCode(b);
  }
  return r;
}

function decodeShownString(strVal, fontName, fonts) {
  if (!strVal || !(strVal.s instanceof Buffer)) return '';
  const bytes = strVal.s;
  const f = (fonts && fontName) ? fonts[fontName] : null;
  if (f && f.toUnicode) {
    const step = f.twoByte ? 2 : 1;
    let r = '';
    for (let k = 0; k < bytes.length; k += step) {
      const code = step === 2 ? ((bytes[k] << 8) | (bytes[k + 1] || 0)) : bytes[k];
      const u = f.toUnicode[code];
      r += (u !== undefined) ? u : (step === 2 ? '' : decodeSimpleBytes(bytes.slice(k, k + 1)));
    }
    return r;
  }
  if (f && f.twoByte) return ''; // CID font without ToUnicode: avoid emitting garbage
  return decodeSimpleBytes(bytes);
}

// Extract text from a content stream. `resources` is the dict whose /Font and
// /XObject apply to this stream. On the `Do` operator we recurse into Form
// XObjects (the document body in @Firma / VeriFirma / iText signed PDFs lives
// inside a Form XObject, with the page stream holding only the signature overlay
// and a `Do`). Each Form XObject carries its own /Resources. Cycles and runaway
// nesting are bounded by `seen` and `depth`.
PdfDoc.prototype.extractContent = function (data, resources, depth, seen) {
  const fonts = this.buildFontMap(resources);
  const resDeref = this.deref(resources);
  const xobjects = this.deref(this.dget(resDeref, 'XObject'));
  const s = data.toString('latin1');
  const out = [];
  let i = 0;
  const stack = [];
  let curFont = null;
  while (i < s.length) {
    i = skipWs(s, i);
    if (i >= s.length) break;
    const ch = s[i];
    if (ch === '(' || ch === '[' || ch === '/' || ch === '<' ||
        ch === '+' || ch === '-' || ch === '.' || (ch >= '0' && ch <= '9')) {
      const pr = parseValue(s, i);
      if (pr.i <= i) { i++; continue; }
      stack.push(pr.v); i = pr.i; continue;
    }
    // operator token (also catches ' and " which are not delimiters)
    let j = i;
    while (j < s.length && !isWs(s[j]) && !isDelim(s[j])) j++;
    if (j === i) { i++; continue; }
    const op = s.substring(i, j);
    i = j;
    switch (op) {
      case 'Tf': {
        const nm = stack.length >= 2 ? stack[stack.length - 2] : null;
        curFont = isName(nm) ? nm.n : curFont;
        break;
      }
      case 'Tj':
      case 'tj':
        out.push(decodeShownString(stack[stack.length - 1], curFont, fonts));
        break;
      case 'TJ': {
        const arr = stack[stack.length - 1];
        if (Array.isArray(arr)) {
          for (const el of arr) {
            if (el && el.s instanceof Buffer) out.push(decodeShownString(el, curFont, fonts));
            else if (typeof el === 'number' && el < -120) out.push(' ');
          }
        }
        break;
      }
      case "'":
        out.push('\n'); out.push(decodeShownString(stack[stack.length - 1], curFont, fonts));
        break;
      case '"':
        out.push('\n'); out.push(decodeShownString(stack[stack.length - 1], curFont, fonts));
        break;
      case 'Td':
      case 'TD': {
        const ty = stack.length >= 1 ? stack[stack.length - 1] : 0;
        if (typeof ty === 'number' && ty !== 0) out.push('\n');
        break;
      }
      case 'T*':
      case 'ET':
      case 'Tm':
        out.push('\n');
        break;
      case 'Do': {
        const nm = stack[stack.length - 1];
        if (depth < 12 && isName(nm) && isDict(xobjects)) {
          const xref = xobjects[nm.n];
          if (isRef(xref) && !seen.has(xref.r[0])) {
            const xo = this.getObj(xref.r[0]);
            if (xo && xo.isStream && this.nameOf(this.dget(xo.dict, 'Subtype')) === 'Form') {
              const xd = this.decodeStream(xo);
              if (xd) {
                seen.add(xref.r[0]);
                const xres = xo.dict.Resources !== undefined ? xo.dict.Resources : resources;
                out.push('\n');
                out.push(this.extractContent(xd, xres, depth + 1, seen));
                seen.delete(xref.r[0]);
              }
            }
          }
        }
        break;
      }
      default:
        break;
    }
    stack.length = 0; // operands are consumed by their operator
  }
  return out.join('');
};

PdfDoc.prototype.pageText = function (node) {
  const contents = this.dget(node, 'Contents') !== undefined ? node.Contents : node.Contents;
  let refs = [];
  const c = this.deref(contents);
  if (Array.isArray(c)) refs = contents; // array of refs
  else if (contents !== undefined) refs = [contents];
  const parts = [];
  for (const r of refs) {
    let o = null;
    if (isRef(r)) o = this.getObj(r.r[0]);
    if (o && o.isStream) { const d = this.decodeStream(o); if (d) parts.push(d); }
  }
  if (parts.length === 0) return '';
  const text = this.extractContent(Buffer.concat(parts), node.__res, 0, new Set());
  return cleanText(text);
};

function cleanText(t) {
  return t
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Page selection
// ---------------------------------------------------------------------------

function parsePageSpec(spec, total) {
  if (!spec || spec === 'all') { const a = []; for (let i = 1; i <= total; i++) a.push(i); return a; }
  const set = new Set();
  for (const partRaw of String(spec).split(',')) {
    const part = partRaw.trim();
    if (!part) continue;
    const dash = part.indexOf('-');
    if (dash === -1) {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= total) set.add(n);
    } else {
      let lo = part.slice(0, dash).trim(), hi = part.slice(dash + 1).trim();
      lo = lo === '' ? 1 : parseInt(lo, 10);
      hi = hi === '' ? total : parseInt(hi, 10);
      if (Number.isNaN(lo)) lo = 1;
      if (Number.isNaN(hi)) hi = total;
      lo = Math.max(1, lo); hi = Math.min(total, hi);
      for (let i = lo; i <= hi; i++) set.add(i);
    }
  }
  return [...set].sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

function pdfDateToISO(raw) {
  // D:YYYYMMDDHHmmSS(+|-|Z)... → best-effort ISO-ish string
  const m = /D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?/.exec(raw);
  if (!m) return raw;
  const [, y, mo = '01', d = '01', h = '00', mi = '00', s = '00'] = m;
  return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
}

PdfDoc.prototype.getInfo = function () {
  let infoRef = null;
  const tre = /trailer\b/g; let m;
  while ((m = tre.exec(this.s))) {
    try { const pr = parseValue(this.s, skipWs(this.s, m.index + 7)); if (isDict(pr.v) && pr.v.Info) infoRef = pr.v.Info; } catch (e) { /* */ }
  }
  for (const o of this.index.values()) {
    if (o.dict && this.nameOf(o.dict.Type) === 'XRef' && o.dict.Info) infoRef = o.dict.Info;
  }
  const info = infoRef ? this.deref(infoRef) : null;
  const out = {};
  if (isDict(info)) {
    const keys = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer', 'CreationDate', 'ModDate'];
    for (const k of keys) {
      const v = this.deref(info[k]);
      if (v && v.s instanceof Buffer) {
        let str = decodeTextString(v.s);
        if (k === 'CreationDate' || k === 'ModDate') str = pdfDateToISO(str);
        out[k.toLowerCase()] = str;
      } else if (typeof v === 'string') {
        out[k.toLowerCase()] = v;
      }
    }
  }
  return out;
};

function decodeTextString(buf) {
  // UTF-16BE if BOM present, else PDFDocEncoding ~ latin1
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    let r = '';
    for (let i = 2; i + 1 < buf.length; i += 2) r += String.fromCharCode((buf[i] << 8) | buf[i + 1]);
    return r;
  }
  return buf.toString('latin1');
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function loadDoc(args) {
  if (!args.input) emitError('BAD_ARGS', 'Missing --input');
  const abs = path.resolve(args.input);
  if (!fs.existsSync(abs)) emitError('INPUT_NOT_FOUND', 'Input file does not exist: ' + args.input);
  let buf;
  try { buf = fs.readFileSync(abs); } catch (e) { emitError('INTERNAL', 'Failed to read input: ' + (e && e.message)); }
  if (buf.slice(0, 5).toString('latin1') !== '%PDF-') {
    // some PDFs have leading junk; tolerate up to 1KB
    const head = buf.slice(0, 1024).toString('latin1');
    if (head.indexOf('%PDF-') === -1) emitError('NOT_A_PDF', 'File does not start with %PDF- header: ' + args.input);
  }
  let doc;
  try { doc = new PdfDoc(buf); } catch (e) { emitError('PARSE_ERROR', 'Failed to parse PDF: ' + (e && e.message)); }
  return doc;
}

function buildPagesText(doc, selected, pages) {
  const result = [];
  for (const pnum of selected) {
    const node = pages[pnum - 1];
    let text = '';
    try { text = doc.pageText(node); } catch (e) { text = ''; }
    result.push({ page: pnum, text });
  }
  return result;
}

function cmdText(args) {
  const doc = loadDoc(args);
  const pages = doc.collectPages();
  const total = pages.length;
  if (total === 0) {
    if (doc.isEncrypted()) emitError('ENCRYPTED', 'PDF is encrypted; this zero-dependency reader does not decrypt. Use a tool that supports the password.');
    emitError('NO_TEXT', 'No pages found. The PDF may be image-only (scanned → needs OCR), encrypted, or malformed.');
  }
  let selected = parsePageSpec(args.pages, total);
  if (typeof args.maxPages === 'number' && args.maxPages > 0) selected = selected.slice(0, args.maxPages);
  const perPage = buildPagesText(doc, selected, pages);
  const joined = perPage.map((p) => p.text).join('\n\n');

  if (joined.trim().length === 0) {
    if (doc.isEncrypted()) emitError('ENCRYPTED', 'PDF is encrypted; cannot extract text without the password.');
    emitError('NO_TEXT', 'Pages found but no extractable text (likely scanned/image-only → needs OCR, or fonts without a /ToUnicode map).');
  }

  if (args.raw) {
    process.stdout.write(joined + '\n');
    process.exit(0);
  }
  if (args.out) {
    const outAbs = path.resolve(args.out);
    try { fs.mkdirSync(path.dirname(outAbs), { recursive: true }); fs.writeFileSync(outAbs, joined, 'utf8'); }
    catch (e) { emitError('WRITE_FAILED', 'Failed to write --out: ' + (e && e.message)); }
    emitOk({ op: 'text', input: args.input, total_pages: total, extracted_pages: selected, chars: joined.length, out: args.out });
  }
  if (args.byPage) {
    emitOk({ op: 'text', input: args.input, total_pages: total, extracted_pages: selected, pages: perPage });
  }
  emitOk({ op: 'text', input: args.input, total_pages: total, extracted_pages: selected, chars: joined.length, text: joined });
}

function cmdMeta(args) {
  const doc = loadDoc(args);
  const pages = doc.collectPages();
  const encrypted = doc.isEncrypted();
  // When encrypted, Info strings are ciphertext — decoding them yields garbage,
  // so skip extraction and signal it instead.
  const info = encrypted ? null : doc.getInfo();
  const out = { op: 'meta', input: args.input, total_pages: pages.length, encrypted, info };
  if (encrypted) out.note = 'Info dictionary is encrypted; metadata values are unavailable without the password.';
  emitOk(out);
}

function cmdCount(args) {
  const doc = loadDoc(args);
  const pages = doc.collectPages();
  emitOk({ op: 'count', input: args.input, total_pages: pages.length });
}

function cmdSearch(args) {
  if (!args.query) emitError('BAD_ARGS', 'Missing --query');
  const doc = loadDoc(args);
  const pages = doc.collectPages();
  const total = pages.length;
  if (total === 0) emitError('NO_TEXT', 'No pages found (encrypted, image-only, or malformed PDF).');
  const selected = parsePageSpec(args.pages, total);
  const ctx = typeof args.context === 'number' && args.context >= 0 ? args.context : 40;
  const flags = args.ignoreCase ? 'gi' : 'g';
  const escaped = args.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [];
  let totalHits = 0;
  for (const pnum of selected) {
    let text = '';
    try { text = doc.pageText(pages[pnum - 1]); } catch (e) { text = ''; }
    const re = new RegExp(escaped, flags);
    let m, hits = 0; const snippets = [];
    while ((m = re.exec(text))) {
      hits++; totalHits++;
      if (snippets.length < 5) {
        const start = Math.max(0, m.index - ctx);
        const end = Math.min(text.length, m.index + m[0].length + ctx);
        snippets.push(text.slice(start, end).replace(/\s+/g, ' ').trim());
      }
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    if (hits > 0) matches.push({ page: pnum, hits, snippets });
  }
  emitOk({ op: 'search', input: args.input, query: args.query, total_pages: total, total_hits: totalHits, pages_with_hits: matches.length, matches });
}

// Collect font diagnostics from a resources dict, recursing into Form XObjects
// (so the body font of a signed PDF, which lives inside an XObject, is reported).
// `source` tags where each font was found ("page", "page/Xf1", …).
PdfDoc.prototype.collectFontDiag = function (resources, depth, seen, source, acc) {
  const resD = this.deref(resources);
  const fd = this.deref(this.dget(resD, 'Font'));
  if (isDict(fd)) {
    for (const k of Object.keys(fd)) {
      try {
        const fo = this.deref(fd[k]);
        if (isDict(fo)) { const det = this.fontDetails(fo); acc.push(Object.assign({ key: k, source }, det.diag)); }
      } catch (e) { /* skip font */ }
    }
  }
  if (depth < 12) {
    const xo = this.deref(this.dget(resD, 'XObject'));
    if (isDict(xo)) {
      for (const xk of Object.keys(xo)) {
        const xref = xo[xk];
        if (isRef(xref) && !seen.has(xref.r[0])) {
          const o = this.getObj(xref.r[0]);
          if (o && o.isStream && this.nameOf(this.dget(o.dict, 'Subtype')) === 'Form') {
            seen.add(xref.r[0]);
            const xres = o.dict.Resources !== undefined ? o.dict.Resources : resources;
            this.collectFontDiag(xres, depth + 1, seen, source + '/' + xk, acc);
            seen.delete(xref.r[0]);
          }
        }
      }
    }
  }
};

function cmdFonts(args) {
  const doc = loadDoc(args);
  const pages = doc.collectPages();
  const total = pages.length;
  const selected = parsePageSpec(args.pages, total);
  const report = [];
  for (const pnum of selected) {
    const node = pages[pnum - 1];
    const fonts = [];
    try { doc.collectFontDiag(node.__res, 0, new Set(), 'page', fonts); } catch (e) { /* no resources */ }
    report.push({ page: pnum, fonts });
  }
  emitOk({ op: 'fonts', input: args.input, total_pages: total, pages: report });
}

// ---------------------------------------------------------------------------

function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') help();
  const command = argv[0];
  if (['text', 'meta', 'count', 'search', 'fonts'].indexOf(command) === -1) {
    emitError('BAD_ARGS', "Unknown command: '" + command + "'. Expected text | meta | count | search | fonts.");
  }
  const args = parseArgs(argv.slice(1));
  if (args.help) help();
  if (command === 'text') cmdText(args);
  else if (command === 'meta') cmdMeta(args);
  else if (command === 'count') cmdCount(args);
  else if (command === 'search') cmdSearch(args);
  else if (command === 'fonts') cmdFonts(args);
}

try { main(); } catch (e) { emitError('INTERNAL', e && e.message ? e.message : String(e)); }
