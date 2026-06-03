#!/usr/bin/env node
/**
 * shared-office-writer/office.cjs
 *
 * Zero-dependency writer for OOXML documents: minimal-but-valid .docx and .xlsx,
 * built by hand from a JSON spec. No npm packages — a .docx/.xlsx is just an OPC
 * package (a ZIP of XML parts), and Node's zlib (deflateRawSync) is all we need to
 * build the ZIP container ourselves.
 *
 * This is a WRITER only — it creates new files, it does not read or edit existing
 * ones. Scope ("Práctico"):
 *   docx: paragraphs, headings (1-6), bold/italic/underline runs, simple tables.
 *   xlsx: multiple sheets, text/number/bool/date cells, formulas, column widths,
 *         bold header row.
 *
 * Contract documented in SKILL.md alongside this file. If behavior here and prose
 * there diverge, the script is the source of truth — adjust the prose.
 *
 * No dependencies beyond Node stdlib (fs, path, zlib). Compatible with Node 18+.
 *
 * Usage:
 *   node office.cjs docx --spec <spec.json> --output <file.docx>
 *   node office.cjs xlsx --spec <spec.json> --output <file.xlsx>
 *   node office.cjs <docx|xlsx> --stdin   --output <file>     (read spec from stdin)
 *
 * Exit codes:
 *   0 = success (JSON `{ ok: true, ... }` on stdout)
 *   1 = error   (JSON `{ ok: false, error: {...} }` on stdout + human line on stderr)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---------------------------------------------------------------------------
// IO helpers
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
    '  node office.cjs docx --spec <spec.json> --output <file.docx>',
    '  node office.cjs xlsx --spec <spec.json> --output <file.xlsx>',
    '  node office.cjs <docx|xlsx> --stdin --output <file>',
    '',
    'Commands:',
    '  docx   build a Word document from a JSON spec.',
    '  xlsx   build an Excel workbook from a JSON spec.',
    '',
    'Args:',
    '  --spec <path>   Path to the JSON spec file.',
    '  --stdin         Read the JSON spec from stdin instead of --spec.',
    '  --output <path> Destination .docx/.xlsx path. Unrestricted.',
    '  --help, -h      Show this help.',
    '',
    'Output: JSON to stdout. Exit 0 on success, 1 on error.',
    '',
  ].join('\n'));
  process.exit(0);
}

function parseArgs(argv) {
  const out = { stdin: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { out.help = true; continue; }
    if (a === '--stdin') { out.stdin = true; continue; }
    if (!a.startsWith('--')) emitError('BAD_ARGS', "Unexpected positional argument: '" + a + "'");
    const eq = a.indexOf('=');
    let key, val;
    if (eq !== -1) { key = a.substring(2, eq); val = a.substring(eq + 1); }
    else { key = a.substring(2); val = argv[++i]; }
    if (val === undefined || val === null) emitError('BAD_ARGS', 'Missing value for --' + key);
    if (key === 'spec') out.spec = val;
    else if (key === 'output') out.output = val;
    else emitError('BAD_ARGS', 'Unknown argument: --' + key);
  }
  return out;
}

function ensureDirRecursive(absPath) {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
}

function readSpec(args) {
  let raw;
  if (args.stdin) {
    try { raw = fs.readFileSync(0, 'utf8'); }
    catch (e) { emitError('INTERNAL', 'Failed to read stdin: ' + (e && e.message ? e.message : String(e))); }
  } else {
    if (!args.spec) emitError('BAD_ARGS', 'Missing --spec (or use --stdin)');
    const abs = path.resolve(args.spec);
    if (!fs.existsSync(abs)) emitError('SPEC_NOT_FOUND', 'Spec file does not exist: ' + args.spec);
    try { raw = fs.readFileSync(abs, 'utf8'); }
    catch (e) { emitError('INTERNAL', 'Failed to read spec: ' + (e && e.message ? e.message : String(e))); }
  }
  let spec;
  try { spec = JSON.parse(raw); }
  catch (e) { emitError('BAD_SPEC_JSON', 'Spec is not valid JSON: ' + (e && e.message ? e.message : String(e))); }
  if (!spec || typeof spec !== 'object') emitError('BAD_SPEC', 'Spec must be a JSON object');
  return spec;
}

// ---------------------------------------------------------------------------
// XML escaping
// ---------------------------------------------------------------------------

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // strip XML-1.0-illegal control chars (keep \t \n \r)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

// ---------------------------------------------------------------------------
// Minimal ZIP writer (no dependencies). Uses raw DEFLATE via zlib.
// ---------------------------------------------------------------------------

const CRC_TABLE = (function () {
  const t = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Build a ZIP archive from a list of { name, data:Buffer } entries.
 * Each entry is DEFLATE-compressed (method 8). Returns a Buffer.
 */
function buildZip(entries) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const DOS_TIME = 0, DOS_DATE = 0x21; // 1980-01-01, deterministic

  for (const e of entries) {
    const nameBuf = Buffer.from(e.name, 'utf8');
    const data = e.data;
    const crc = crc32(data);
    const comp = zlib.deflateRawSync(data, { level: 9 });
    const method = 8;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);   // local file header signature
    local.writeUInt16LE(20, 4);           // version needed
    local.writeUInt16LE(0, 6);            // flags
    local.writeUInt16LE(method, 8);       // compression method
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18); // compressed size
    local.writeUInt32LE(data.length, 22); // uncompressed size
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);           // extra len

    chunks.push(local, nameBuf, comp);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);      // central dir signature
    cd.writeUInt16LE(20, 4);              // version made by
    cd.writeUInt16LE(20, 6);              // version needed
    cd.writeUInt16LE(0, 8);               // flags
    cd.writeUInt16LE(method, 10);
    cd.writeUInt16LE(DOS_TIME, 12);
    cd.writeUInt16LE(DOS_DATE, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(comp.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);              // extra len
    cd.writeUInt16LE(0, 32);              // comment len
    cd.writeUInt16LE(0, 34);              // disk number start
    cd.writeUInt16LE(0, 36);              // internal attrs
    cd.writeUInt32LE(0, 38);              // external attrs
    cd.writeUInt32LE(offset, 42);         // local header offset
    central.push(Buffer.concat([cd, nameBuf]));

    offset += local.length + nameBuf.length + comp.length;
  }

  const centralBuf = Buffer.concat(central);
  const cdOffset = offset;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);      // EOCD signature
  eocd.writeUInt16LE(0, 4);               // disk number
  eocd.writeUInt16LE(0, 6);               // cd start disk
  eocd.writeUInt16LE(entries.length, 8);  // entries on this disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  eocd.writeUInt16LE(0, 20);              // comment len

  return Buffer.concat([Buffer.concat(chunks), centralBuf, eocd]);
}

function part(name, xml) {
  return { name, data: Buffer.from(xml, 'utf8') };
}

// ===========================================================================
// DOCX builder
// ===========================================================================

function buildDocxParagraphXml(runsXml, opts) {
  opts = opts || {};
  let pPr = '';
  if (opts.style) pPr += '<w:pStyle w:val="' + opts.style + '"/>';
  const pPrXml = pPr ? '<w:pPr>' + pPr + '</w:pPr>' : '';
  return '<w:p>' + pPrXml + runsXml + '</w:p>';
}

// Hyperlink relationships collected while building the body. Each run with a
// `link` registers one here; buildDocx emits them into word/_rels/document.xml.rels.
const hyperlinkRels = [];

function registerHyperlink(url) {
  const id = 'hl' + (hyperlinkRels.length + 1);
  hyperlinkRels.push({ id: id, url: String(url) });
  return id;
}

function buildDocxRun(run) {
  const isObj = run && typeof run === 'object';
  const text = isObj ? run.text : run;
  let rPr = '';
  if (isObj) {
    if (run.link) rPr += '<w:rStyle w:val="Hyperlink"/>';
    if (run.bold) rPr += '<w:b/>';
    if (run.italic) rPr += '<w:i/>';
    if (run.underline) rPr += '<w:u w:val="single"/>';
  }
  const rPrXml = rPr ? '<w:rPr>' + rPr + '</w:rPr>' : '';
  const runXml = '<w:r>' + rPrXml + '<w:t xml:space="preserve">' + xmlEscape(text == null ? '' : text) + '</w:t></w:r>';
  // A run with `link` is wrapped in <w:hyperlink> pointing at an external relationship.
  if (isObj && run.link) {
    const id = registerHyperlink(run.link);
    return '<w:hyperlink r:id="' + id + '">' + runXml + '</w:hyperlink>';
  }
  return runXml;
}

// A table cell can be: a plain string (text), a single run object
// ({ text, link?, bold?, italic?, underline? }), or an array of strings/run
// objects. Header rows bold the cell unless the cell object overrides `bold`.
function buildCellRuns(cell, isHeader) {
  if (Array.isArray(cell)) {
    return cell.map(function (r) {
      return (r !== null && typeof r === 'object')
        ? buildDocxRun(Object.assign({ bold: isHeader }, r))
        : buildDocxRun({ text: r, bold: isHeader });
    }).join('');
  }
  if (cell !== null && typeof cell === 'object') {
    return buildDocxRun(Object.assign({ bold: isHeader }, cell));
  }
  return buildDocxRun({ text: cell, bold: isHeader });
}

function buildDocxBlock(block) {
  if (block == null) return '';
  // shorthand: a bare string is a plain paragraph
  if (typeof block === 'string') return buildDocxParagraphXml(buildDocxRun(block));

  const type = block.type || 'paragraph';

  if (type === 'heading') {
    const lvl = Math.min(Math.max(parseInt(block.level, 10) || 1, 1), 6);
    return buildDocxParagraphXml(buildDocxRun({ text: block.text }), { style: 'Heading' + lvl });
  }

  if (type === 'paragraph') {
    let runsXml;
    if (Array.isArray(block.runs)) runsXml = block.runs.map(buildDocxRun).join('');
    else runsXml = buildDocxRun({ text: block.text, bold: block.bold, italic: block.italic, underline: block.underline });
    return buildDocxParagraphXml(runsXml);
  }

  if (type === 'table') {
    const rows = Array.isArray(block.rows) ? block.rows : [];
    const header = !!block.header;
    const grid = rows.length ? (rows[0].length || 1) : 1;
    // Fit the table to the page content width (A4 minus 1" margins = 9026 twips).
    // `tblLayout fixed` makes long cell text wrap instead of widening columns and
    // pushing the table off the right edge of the page.
    const CONTENT_WIDTH = 9026;
    // Optional `widths`: relative weights per column (e.g. [1,3,3,1] gives columns
    // 2 and 3 three times the space). If absent or mismatched, columns are equal.
    let colWidths;
    if (Array.isArray(block.widths) && block.widths.length === grid) {
      const sum = block.widths.reduce(function (a, b) { return a + (Number(b) || 0); }, 0) || grid;
      colWidths = block.widths.map(function (w) { return Math.max(1, Math.floor(CONTENT_WIDTH * (Number(w) || 0) / sum)); });
    } else {
      const eq = Math.max(1, Math.floor(CONTENT_WIDTH / grid));
      colWidths = new Array(grid).fill(eq);
    }
    const tableW = colWidths.reduce(function (a, b) { return a + b; }, 0);
    const gridCols = '<w:tblGrid>' + colWidths.map(function (w) { return '<w:gridCol w:w="' + w + '"/>'; }).join('') + '</w:tblGrid>';
    const tblPr =
      '<w:tblPr>' +
      '<w:tblStyle w:val="TableGrid"/>' +
      '<w:tblW w:w="' + tableW + '" w:type="dxa"/>' +
      '<w:tblLayout w:type="fixed"/>' +
      '<w:tblBorders>' +
      '<w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/>' +
      '<w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/>' +
      '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/>' +
      '<w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/>' +
      '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/>' +
      '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/>' +
      '</w:tblBorders>' +
      '</w:tblPr>';
    const rowsXml = rows.map(function (row, ri) {
      const cells = (Array.isArray(row) ? row : [row]).map(function (cell, ci) {
        const isHeader = header && ri === 0;
        const runsXml = buildCellRuns(cell, isHeader);
        const cellPara = buildDocxParagraphXml(runsXml);
        const cw = colWidths[ci] || colWidths[colWidths.length - 1];
        return '<w:tc><w:tcPr><w:tcW w:w="' + cw + '" w:type="dxa"/></w:tcPr>' + cellPara + '</w:tc>';
      }).join('');
      return '<w:tr>' + cells + '</w:tr>';
    }).join('');
    return '<w:tbl>' + tblPr + gridCols + rowsXml + '</w:tbl>';
  }

  emitError('BAD_SPEC', "Unknown docx block type: '" + type + "'");
}

function buildDocx(spec, outputAbs, outputUserPath) {
  hyperlinkRels.length = 0; // reset collector (defensive; one build per process)
  const body = Array.isArray(spec.body) ? spec.body : [];
  if (body.length === 0 && !spec.title) {
    emitError('BAD_SPEC', 'docx spec has no "body" array (and no title)');
  }

  const bodyXml = body.map(buildDocxBlock).join('');
  // A trailing sectPr is required for a well-formed body.
  const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
    '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>';

  const documentXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<w:body>' + bodyXml + sectPr + '</w:body></w:document>';

  // Styles: Normal + Heading1..6 (mapped to built-in heading style ids).
  let headingStyles = '';
  for (let i = 1; i <= 6; i++) {
    headingStyles +=
      '<w:style w:type="paragraph" w:styleId="Heading' + i + '">' +
      '<w:name w:val="heading ' + i + '"/>' +
      '<w:basedOn w:val="Normal"/>' +
      '<w:next w:val="Normal"/>' +
      '<w:qFormat/>' +
      '<w:pPr><w:keepNext/><w:outlineLvl w:val="' + (i - 1) + '"/></w:pPr>' +
      '<w:rPr><w:b/><w:sz w:val="' + (32 - (i - 1) * 2) + '"/></w:rPr>' +
      '</w:style>';
  }
  const stylesXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
    '<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/></w:style>' +
    '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/></w:style>' +
    '<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr><w:color w:val="0563C1"/><w:u w:val="single"/></w:rPr></w:style>' +
    headingStyles +
    '</w:styles>';

  const contentTypes =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '</Types>';

  const rootRels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
    '</Relationships>';

  const hyperlinkRelsXml = hyperlinkRels.map(function (h) {
    return '<Relationship Id="' + h.id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="' + xmlEscape(h.url) + '" TargetMode="External"/>';
  }).join('');
  const docRels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    hyperlinkRelsXml +
    '</Relationships>';

  const title = spec.title ? xmlEscape(spec.title) : '';
  const coreXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '<dc:title>' + title + '</dc:title>' +
    '<dc:creator>shared-office-writer</dc:creator>' +
    '</cp:coreProperties>';

  const entries = [
    part('[Content_Types].xml', contentTypes),
    part('_rels/.rels', rootRels),
    part('word/document.xml', documentXml),
    part('word/styles.xml', stylesXml),
    part('word/_rels/document.xml.rels', docRels),
    part('docProps/core.xml', coreXml),
  ];

  const zip = buildZip(entries);
  try {
    ensureDirRecursive(outputAbs);
    fs.writeFileSync(outputAbs, zip);
  } catch (e) {
    emitError('WRITE_FAILED', 'Failed to write docx: ' + (e && e.message ? e.message : String(e)));
  }

  emitOk({
    op: 'docx',
    path: outputUserPath,
    bytes: zip.length,
    blocks: body.length,
  });
}

// ===========================================================================
// XLSX builder
// ===========================================================================

// Excel serial date: days since 1899-12-30 (handles the 1900 leap-year quirk).
function excelSerialFromDate(d) {
  const epoch = Date.UTC(1899, 11, 30);
  const utc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
  return (utc - epoch) / 86400000;
}

function colLetter(n) { // 1-based → A, B, ... Z, AA, ...
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}

// Resolve a spec cell into a normalized { kind, value|formula }.
function normalizeCell(cell) {
  if (cell === null || cell === undefined || cell === '') return { kind: 'blank' };
  if (typeof cell === 'number') return Number.isFinite(cell) ? { kind: 'number', value: cell } : { kind: 'text', value: String(cell) };
  if (typeof cell === 'boolean') return { kind: 'bool', value: cell };
  if (typeof cell === 'string') return { kind: 'text', value: cell };
  if (typeof cell === 'object') {
    const t = (cell.type || '').toLowerCase();
    if (t === 'number') return { kind: 'number', value: Number(cell.value) };
    if (t === 'text' || t === 'string') return { kind: 'text', value: cell.value == null ? '' : String(cell.value) };
    if (t === 'bool' || t === 'boolean') return { kind: 'bool', value: !!cell.value };
    if (t === 'date') {
      const d = cell.value instanceof Date ? cell.value : new Date(cell.value);
      if (isNaN(d.getTime())) emitError('BAD_SPEC', 'Invalid date value: ' + JSON.stringify(cell.value));
      return { kind: 'date', value: excelSerialFromDate(d) };
    }
    if (t === 'formula') {
      return { kind: 'formula', formula: String(cell.formula || '').replace(/^=/, ''), value: cell.value };
    }
    if ('value' in cell) return normalizeCell(cell.value);
  }
  emitError('BAD_SPEC', 'Unsupported cell spec: ' + JSON.stringify(cell));
}

function buildSheetXml(sheet) {
  const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
  const header = !!sheet.header;

  // Column widths
  let colsXml = '';
  if (Array.isArray(sheet.columns) && sheet.columns.length) {
    const colDefs = sheet.columns.map(function (c, i) {
      const w = c && c.width ? Number(c.width) : null;
      if (!w) return '';
      return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>';
    }).join('');
    if (colDefs) colsXml = '<cols>' + colDefs + '</cols>';
  }

  const rowsXml = rows.map(function (row, ri) {
    const rowNum = ri + 1;
    const cells = (Array.isArray(row) ? row : [row]).map(function (cell, ci) {
      const ref = colLetter(ci + 1) + rowNum;
      const isHeader = header && ri === 0;
      const nc = normalizeCell(cell);

      // style index: 0 default, 1 bold (header), 2 date, 3 date+bold
      let styleIdx = 0;
      if (nc.kind === 'date') styleIdx = isHeader ? 3 : 2;
      else if (isHeader) styleIdx = 1;
      const sAttr = styleIdx ? ' s="' + styleIdx + '"' : '';

      if (nc.kind === 'blank') return '<c r="' + ref + '"' + sAttr + '/>';
      if (nc.kind === 'text') return '<c r="' + ref + '"' + sAttr + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEscape(nc.value) + '</t></is></c>';
      if (nc.kind === 'bool') return '<c r="' + ref + '"' + sAttr + ' t="b"><v>' + (nc.value ? 1 : 0) + '</v></c>';
      if (nc.kind === 'number' || nc.kind === 'date') return '<c r="' + ref + '"' + sAttr + '><v>' + nc.value + '</v></c>';
      if (nc.kind === 'formula') {
        const cached = (nc.value !== undefined && nc.value !== null) ? '<v>' + xmlEscape(nc.value) + '</v>' : '';
        return '<c r="' + ref + '"' + sAttr + '><f>' + xmlEscape(nc.formula) + '</f>' + cached + '</c>';
      }
      return '<c r="' + ref + '"' + sAttr + '/>';
    }).join('');
    return '<row r="' + rowNum + '">' + cells + '</row>';
  }).join('');

  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    colsXml +
    '<sheetData>' + rowsXml + '</sheetData>' +
    '</worksheet>';
}

function buildXlsx(spec, outputAbs, outputUserPath) {
  let sheets = Array.isArray(spec.sheets) ? spec.sheets : null;
  // shorthand: { rows: [...] } → single sheet
  if (!sheets && Array.isArray(spec.rows)) sheets = [{ name: spec.name || 'Sheet1', rows: spec.rows, header: spec.header, columns: spec.columns }];
  if (!sheets || sheets.length === 0) emitError('BAD_SPEC', 'xlsx spec has no "sheets" array (and no top-level "rows")');

  const usedNames = {};
  sheets.forEach(function (s, i) {
    let n = (s.name && String(s.name).trim()) || ('Sheet' + (i + 1));
    n = n.replace(/[\\/?*\[\]:]/g, '_').substring(0, 31); // Excel sheet-name rules
    let base = n, k = 1;
    while (usedNames[n.toLowerCase()]) { n = (base.substring(0, 28) + '_' + (++k)); }
    usedNames[n.toLowerCase()] = true;
    s._name = n;
  });

  // Parts
  const sheetParts = sheets.map(function (s, i) {
    return part('xl/worksheets/sheet' + (i + 1) + '.xml', buildSheetXml(s));
  });

  const sheetsTags = sheets.map(function (s, i) {
    return '<sheet name="' + xmlEscape(s._name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
  }).join('');
  const workbookXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<sheets>' + sheetsTags + '</sheets></workbook>';

  const wbRelsTags = sheets.map(function (s, i) {
    return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
  }).join('');
  const stylesRelId = sheets.length + 1;
  const workbookRels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    wbRelsTags +
    '<Relationship Id="rId' + stylesRelId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '</Relationships>';

  // Styles: 2 fonts (normal, bold), a custom date numFmt (164), 4 cellXfs.
  const stylesXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy\\-mm\\-dd"/></numFmts>' +
    '<fonts count="2">' +
    '<font><sz val="11"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="11"/><name val="Calibri"/></font>' +
    '</fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="4">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +                                  // 0 default
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +                     // 1 bold
    '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +           // 2 date
    '<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>' + // 3 date+bold
    '</cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';

  const contentTypes =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    sheets.map(function (s, i) {
      return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    }).join('') +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '</Types>';

  const rootRels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
    '</Relationships>';

  const title = spec.title ? xmlEscape(spec.title) : '';
  const coreXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
    'xmlns:dc="http://purl.org/dc/elements/1.1/">' +
    '<dc:title>' + title + '</dc:title><dc:creator>shared-office-writer</dc:creator></cp:coreProperties>';

  const entries = [
    part('[Content_Types].xml', contentTypes),
    part('_rels/.rels', rootRels),
    part('xl/workbook.xml', workbookXml),
    part('xl/_rels/workbook.xml.rels', workbookRels),
    part('xl/styles.xml', stylesXml),
    part('docProps/core.xml', coreXml),
  ].concat(sheetParts);

  const zip = buildZip(entries);
  try {
    fs.writeFileSync(outputAbs, zip);
  } catch (e) {
    emitError('WRITE_FAILED', 'Failed to write xlsx: ' + (e && e.message ? e.message : String(e)));
  }

  const totalRows = sheets.reduce(function (acc, s) { return acc + (Array.isArray(s.rows) ? s.rows.length : 0); }, 0);
  emitOk({
    op: 'xlsx',
    path: outputUserPath,
    bytes: zip.length,
    sheets: sheets.length,
    rows: totalRows,
  });
}

// ===========================================================================

function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) help();
  if (argv[0] === '--help' || argv[0] === '-h') help();

  const command = argv[0];
  if (command !== 'docx' && command !== 'xlsx') {
    emitError('BAD_ARGS', "Unknown command: '" + command + "'. Expected 'docx' or 'xlsx'.");
  }
  const args = parseArgs(argv.slice(1));
  if (args.help) help();
  if (!args.output) emitError('BAD_ARGS', 'Missing --output');

  const spec = readSpec(args);
  const outputUserPath = args.output;
  const outputAbs = path.resolve(outputUserPath);

  if (command === 'docx') buildDocx(spec, outputAbs, outputUserPath);
  else buildXlsx(spec, outputAbs, outputUserPath);
}

try {
  main();
} catch (e) {
  emitError('INTERNAL', e && e.message ? e.message : String(e));
}
