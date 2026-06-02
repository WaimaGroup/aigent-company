#!/usr/bin/env node
/**
 * sales-tender-search/download.cjs
 * Descarga binaria de documentos (pliegos) por GET a un directorio destino.
 * Pensado para encadenarse tras atom-search.cjs: este recibe documentos[].url
 * y los baja a `outDir` (ruta de entregable que decide el caller, fuera de
 * .aigent/ según output-rules). Fuente de verdad = este script. Sin dependencias.
 * Node 18+ (fetch global). Salida JSON por stdout, progreso por stderr.
 *
 * Uso:
 *   node download.cjs --inputs '{"outDir":"ruta","documentos":[{"url":"...","titulo":"PCAP.pdf"}]}'
 *   node download.cjs --inputs '{"outDir":"ruta","url":"...","titulo":"PCAP.pdf"}'   // atajo 1 doc
 */
'use strict';
const fs = require('fs');
const path = require('path');

const TYPE_EXT = {
  'application/pdf': 'pdf',
  'application/zip': 'zip',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt',
  'text/html': 'html',
  'application/xml': 'xml',
  'text/xml': 'xml',
};

function err(code, message) { const e = new Error(message); e.code = code; return e; }

function sanitize(name) {
  return String(name).replace(/[^\w.\- ]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 180) || 'documento';
}
function hasExt(name) { return /\.[A-Za-z0-9]{1,8}$/.test(name); }

function fromContentDisposition(cd) {
  if (!cd) return null;
  let m = cd.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (m) { try { return decodeURIComponent(m[1].replace(/"/g, '').trim()); } catch (e) { return m[1]; } }
  m = cd.match(/filename="?([^";]+)"?/i);
  return m ? m[1].trim() : null;
}

function pickFilename({ titulo, cd, url, contentType }, idx) {
  if (titulo && hasExt(titulo)) return sanitize(titulo);
  const fromCd = fromContentDisposition(cd);
  if (fromCd && hasExt(fromCd)) return sanitize(fromCd);
  try {
    const seg = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() || '');
    if (seg && hasExt(seg)) return sanitize(seg);
  } catch (e) { /* url no parseable */ }
  const ext = TYPE_EXT[(contentType || '').split(';')[0].trim()] || 'bin';
  const base = titulo ? sanitize(titulo) : 'documento-' + (idx + 1);
  return base + '.' + ext;
}

function uniquePath(dir, name, overwrite) {
  let p = path.join(dir, name);
  if (overwrite || !fs.existsSync(p)) return p;
  const ext = path.extname(name), base = path.basename(name, ext);
  let i = 1;
  while (fs.existsSync(p)) { p = path.join(dir, base + '-' + i + ext); i++; }
  return p;
}

async function downloadOne(doc, idx, { outDir, overwrite, timeoutMs, maxBytes, log }) {
  const url = doc.url;
  log('GET ' + (doc.titulo || url));
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ac.signal, redirect: 'follow' });
    if (!res.ok) throw err('HTTP_' + res.status, 'HTTP ' + res.status + ' en ' + url);
    const cl = parseInt(res.headers.get('content-length') || '', 10);
    if (Number.isFinite(cl) && cl > maxBytes) throw err('TOO_LARGE', 'content-length ' + cl + ' > maxBytes ' + maxBytes);
    const contentType = res.headers.get('content-type') || null;
    const cd = res.headers.get('content-disposition');
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > maxBytes) throw err('TOO_LARGE', 'descargados ' + buf.length + ' bytes > maxBytes ' + maxBytes);
    const name = pickFilename({ titulo: doc.titulo, cd, url, contentType }, idx);
    const dest = uniquePath(outDir, name, overwrite);
    fs.writeFileSync(dest, buf);
    return { ok: true, url, path: dest, bytes: buf.length, contentType, tipo: doc.tipo || null };
  } catch (e) {
    const code = e.code || (e.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR');
    return { ok: false, url, error: { code, message: e.message } };
  } finally { clearTimeout(to); }
}

async function run(inputs) {
  const outDir = inputs.outDir;
  if (!outDir) throw err('BAD_ARGS', 'Falta `outDir`.');
  let docs = Array.isArray(inputs.documentos) ? inputs.documentos.slice() : [];
  if (inputs.url) docs.unshift({ url: inputs.url, titulo: inputs.titulo, tipo: inputs.tipo });
  docs = docs.filter((d) => d && d.url);
  if (!docs.length) throw err('BAD_ARGS', 'No hay documentos con `url` que descargar.');

  const overwrite = inputs.overwrite === true;
  const timeoutMs = Number.isFinite(inputs.timeoutMs) ? inputs.timeoutMs : 60000;
  const maxBytes = Number.isFinite(inputs.maxBytes) ? inputs.maxBytes : 50 * 1024 * 1024;
  const quiet = inputs.quiet === true;
  const log = (m) => { if (!quiet) process.stderr.write('[download] ' + m + '\n'); };

  fs.mkdirSync(outDir, { recursive: true });

  const downloaded = [], errors = [];
  for (let i = 0; i < docs.length; i++) {
    const r = await downloadOne(docs[i], i, { outDir, overwrite, timeoutMs, maxBytes, log });
    if (r.ok) { downloaded.push(r); log('  -> ' + r.path + ' (' + r.bytes + ' bytes)'); }
    else { errors.push(r); log('  x ' + r.error.code + ': ' + r.url); }
  }
  return { ok: true, outDir, requested: docs.length, downloaded, errors };
}

function parseCli(argv) {
  const out = { inputs: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--inputs') { try { out.inputs = JSON.parse(argv[++i]); } catch (e) { throw err('BAD_ARGS', '`--inputs` JSON inválido: ' + e.message); } }
    else throw err('BAD_ARGS', 'Argumento desconocido: ' + a);
  }
  return out;
}

async function main() {
  let cli;
  try { cli = parseCli(process.argv.slice(2)); } catch (e) { return fail(e); }
  if (cli.help) { process.stdout.write('download.cjs --inputs \'{"outDir":"...","documentos":[{"url":"...","titulo":"PCAP.pdf"}]}\'\n'); process.exit(0); }
  try {
    const result = await run(cli.inputs);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(0);
  } catch (e) { return fail(e); }
}
function fail(e) {
  const code = e.code || 'INTERNAL';
  process.stdout.write(JSON.stringify({ ok: false, error: { code, message: e.message } }, null, 2) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + e.message + '\n');
  process.exit(1);
}
main();
