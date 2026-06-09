#!/usr/bin/env node
// =============================================================================
// shared-pdf-toolkit — ESCRIBIR/EDITAR PDF vía librería `pdf-lib` (npm)
//
// Skill HÍBRIDA y contraparte ESCRITORA de `shared-pdf-reader` (cero-deps, solo
// lee). Aquí se MANIPULA el PDF: merge (unir), split (extraer páginas) y stamp
// (estampar texto / sello / watermark). El reader cero-deps no puede hacer nada
// de esto; juntas cubren leer + editar.
//
// Bootstrap de dependencia: `pdf-lib` se instala on-demand en la caché compartida
// .context/libs/ (gitignored) y se reutiliza. No se reinstala ni se borra entre usos.
//
// Contrato: JSON por stdout. Exit 0 si ok:true, 1 si ok:false. Sin TTY.
// Invocar SIEMPRE por el launcher: .aigent/IDE/bin/run ... (nunca `node` a secas)
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DEP = { name: 'pdf-lib', version: '1.17.1' };

// ---------------------------------------------------------------------------
function emitOk(data) { process.stdout.write(JSON.stringify(Object.assign({ ok: true }, data)) + '\n'); }
function emitError(code, message, details) {
  const err = { code, message }; if (details) err.details = details;
  process.stdout.write(JSON.stringify({ ok: false, error: err }) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + message + '\n');
  process.exit(1);
}
function help() {
  process.stdout.write([
    'Usage:',
    '  run pdf.cjs merge --files a.pdf,b.pdf,c.pdf --output out.pdf',
    '  run pdf.cjs split --input in.pdf --pages 1-3,5 --output out.pdf',
    '  run pdf.cjs stamp --input in.pdf --text "REVISADO" --output out.pdf',
    '                    [--pages all|N|1-3] [--x 40] [--y 40] [--size 12] [--color C00000] [--opacity 1]',
    '  run pdf.cjs deps  [--no-install]',
    '',
    'Output: JSON a stdout. Exit 0 si ok, 1 si error.'
  ].join('\n') + '\n');
}

// --- bootstrap de dependencia — vía el helper compartido (convención §16) ----
const SKILL_REL = '.aigent/departments/_shared/skills/shared-pdf-toolkit/pdf.cjs';

// Toda skill híbrida obtiene su librería por el helper único lib-bootstrap.cjs
// (caché .context/libs, npm bundled-or-system, gitignore). No se duplica aquí.
function ensureDep(autoInstall) {
  const boot = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'lib-bootstrap.cjs');
  let lib;
  try { lib = require(boot); }
  catch (e) { emitError('BOOTSTRAP_NOT_FOUND', 'No se encontró el helper lib-bootstrap.cjs en ' + boot + '. El cwd debe ser la raíz del proyecto (donde viven .aigent/ y .context/).'); }
  return lib.ensureDep(DEP, { autoInstall: autoInstall, skillRef: SKILL_REL });
}

// --- args -------------------------------------------------------------------
function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--no-install') out.noInstall = true;
    else if (a === '--files') out.files = argv[++i];
    else if (a === '--input') out.input = argv[++i];
    else if (a === '--output') out.output = argv[++i];
    else if (a === '--pages') out.pages = argv[++i];
    else if (a === '--text') out.text = argv[++i];
    else if (a === '--x') out.x = argv[++i];
    else if (a === '--y') out.y = argv[++i];
    else if (a === '--size') out.size = argv[++i];
    else if (a === '--color') out.color = argv[++i];
    else if (a === '--opacity') out.opacity = argv[++i];
    else if (a.startsWith('--')) emitError('BAD_ARGS', 'Argumento desconocido: ' + a);
    else out._.push(a);
  }
  return out;
}

// 1-based page spec -> array de índices 0-based. "all" | "3" | "1-3" | "2-" | "-4" | "1,3,5-7"
function resolvePages(spec, total) {
  if (!spec || spec === 'all') return Array.from({ length: total }, (_, i) => i);
  const idx = new Set();
  for (const part of String(spec).split(',')) {
    const s = part.trim(); if (!s) continue;
    let m;
    if ((m = s.match(/^(\d+)$/))) { add(+m[1], +m[1]); }
    else if ((m = s.match(/^(\d+)-(\d+)$/))) { add(+m[1], +m[2]); }
    else if ((m = s.match(/^(\d+)-$/))) { add(+m[1], total); }
    else if ((m = s.match(/^-(\d+)$/))) { add(1, +m[1]); }
    else emitError('BAD_ARGS', 'Spec de páginas inválido: ' + s);
  }
  function add(a, b) { for (let p = a; p <= b; p++) if (p >= 1 && p <= total) idx.add(p - 1); }
  return Array.from(idx).sort((a, b) => a - b);
}

function hexToRgb01(L, hex) {
  const h = String(hex || '000000').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return L.rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
function loadPdf(L, p) {
  if (!fs.existsSync(p)) emitError('INPUT_NOT_FOUND', 'No existe el PDF: ' + p);
  try { return L.PDFDocument.load(fs.readFileSync(p)); }
  catch (e) { return emitError('BAD_PDF', 'No se pudo cargar el PDF (¿cifrado o corrupto?): ' + p); }
}

// --- comandos ---------------------------------------------------------------
async function cmdMerge(L, args) {
  if (!args.files) emitError('BAD_ARGS', 'Falta --files (lista separada por comas).');
  if (!args.output) emitError('BAD_ARGS', 'Falta --output.');
  const files = args.files.split(',').map(s => s.trim()).filter(Boolean);
  if (files.length < 2) emitError('BAD_ARGS', 'merge necesita al menos 2 ficheros en --files.');
  const out = await L.PDFDocument.create();
  let n = 0;
  for (const f of files) {
    const src = await loadPdf(L, f);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach(pg => { out.addPage(pg); n++; });
  }
  const bytes = await out.save();
  writeOut(args.output, bytes);
  return { op: 'merge', inputs: files.length, pages: n, path: args.output, bytes: bytes.length };
}

async function cmdSplit(L, args) {
  if (!args.input) emitError('BAD_ARGS', 'Falta --input.');
  if (!args.output) emitError('BAD_ARGS', 'Falta --output.');
  const src = await loadPdf(L, args.input);
  const total = src.getPageCount();
  const idxs = resolvePages(args.pages, total);
  if (!idxs.length) emitError('BAD_ARGS', 'El rango --pages no selecciona ninguna página (total ' + total + ').');
  const out = await L.PDFDocument.create();
  const pages = await out.copyPages(src, idxs);
  pages.forEach(pg => out.addPage(pg));
  const bytes = await out.save();
  writeOut(args.output, bytes);
  return { op: 'split', source_pages: total, extracted: idxs.map(i => i + 1), path: args.output, bytes: bytes.length };
}

async function cmdStamp(L, args) {
  if (!args.input) emitError('BAD_ARGS', 'Falta --input.');
  if (!args.output) emitError('BAD_ARGS', 'Falta --output.');
  if (args.text == null) emitError('BAD_ARGS', 'Falta --text.');
  const doc = await loadPdf(L, args.input);
  const font = await doc.embedFont(L.StandardFonts.Helvetica);
  const pages = doc.getPages();
  const targets = resolvePages(args.pages, pages.length);
  const size = Number(args.size) || 12;
  const color = hexToRgb01(L, args.color || 'C00000');
  const opacity = args.opacity != null ? Number(args.opacity) : 1;
  for (const i of targets) {
    const pg = pages[i];
    const x = args.x != null ? Number(args.x) : 40;
    const y = args.y != null ? Number(args.y) : 40;
    pg.drawText(String(args.text), { x, y, size, font, color, opacity });
  }
  const bytes = await doc.save();
  writeOut(args.output, bytes);
  return { op: 'stamp', stamped_pages: targets.map(i => i + 1), text: String(args.text), path: args.output, bytes: bytes.length };
}

function writeOut(p, bytes) {
  try { fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true }); fs.writeFileSync(p, bytes); }
  catch (e) { emitError('WRITE_FAILED', 'No se pudo escribir el output: ' + e.message); }
}

// --- main -------------------------------------------------------------------
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args._[0] === undefined) { help(); process.exit(0); }
  const cmd = args._[0];

  if (cmd === 'deps') {
    const { installed, cache, via } = ensureDep(!args.noInstall);
    return emitOk({ op: 'deps', dependency: DEP, cache_dir: cache, installed_now: installed, installed_via: via });
  }
  if (!['merge', 'split', 'stamp'].includes(cmd)) emitError('BAD_ARGS', "Comando desconocido: '" + cmd + "' (merge|split|stamp|deps).");

  const { module: L, installed } = ensureDep(!args.noInstall);
  const run = cmd === 'merge' ? cmdMerge : cmd === 'split' ? cmdSplit : cmdStamp;
  run(L, args).then(function (res) {
    emitOk(Object.assign(res, { dep_installed_now: installed }));
  }).catch(function (e) {
    emitError('INTERNAL', 'Error en ' + cmd + ': ' + (e && e.message ? e.message : String(e)));
  });
}

main();
