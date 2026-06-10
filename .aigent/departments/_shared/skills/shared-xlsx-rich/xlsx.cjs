#!/usr/bin/env node
// =============================================================================
// shared-xlsx-rich — Excel (.xlsx) RICO vía librería `exceljs` (npm)
//
// Skill HÍBRIDA: contraparte con-librería de `shared-office-writer` (cero-deps,
// alcance "Práctico"). Rompe el techo de xlsx: colores de celda (fills), celdas
// combinadas (merges), bordes a medida, paneles congelados (freeze), formatos
// numéricos, imágenes embebidas. Desde un spec JSON.
//
// La dependencia se obtiene SIEMPRE por el helper compartido lib-bootstrap.cjs
// (caché .context/libs, npm bundled-or-system, versión fijada). Ver conventions §16.
//
// Contrato: JSON por stdout. Exit 0 si ok:true, 1 si ok:false. Sin TTY.
// Invocar SIEMPRE por el launcher .aigent/IDE/bin/run (nunca `node` a secas).
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

const DEP = { name: 'exceljs', version: '4.4.0' };
const SKILL_REL = '.aigent/departments/_shared/skills/shared-xlsx-rich/xlsx.cjs';

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
    '  run xlsx.cjs build --spec <spec.json> --output <file.xlsx>',
    '  run xlsx.cjs build --stdin --output <file.xlsx>',
    '  run xlsx.cjs deps  [--no-install]',
    '',
    'Output: JSON a stdout. Exit 0 si ok, 1 si error.'
  ].join('\n') + '\n');
}

// Bootstrap de dependencia vía el helper compartido (fuente única).
function loadBootstrap() {
  const p = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'lib-bootstrap.cjs');
  try { return require(p); }
  catch (e) {
    emitError('BOOTSTRAP_NOT_FOUND', 'No se encontró el helper lib-bootstrap.cjs en ' + p +
      '. El cwd debe ser la raíz del proyecto (donde viven .aigent/ y .context/).');
  }
}

// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--stdin') out.stdin = true;
    else if (a === '--no-install') out.noInstall = true;
    else if (a === '--spec') out.spec = argv[++i];
    else if (a === '--output') out.output = argv[++i];
    else if (a.startsWith('--')) emitError('BAD_ARGS', 'Argumento desconocido: ' + a);
    else out._.push(a);
  }
  return out;
}
function readSpec(args) {
  let raw;
  if (args.stdin) { try { raw = fs.readFileSync(0, 'utf8'); } catch (e) { emitError('BAD_ARGS', 'No se pudo leer stdin.'); } }
  else if (args.spec) { if (!fs.existsSync(args.spec)) emitError('SPEC_NOT_FOUND', 'No existe el spec: ' + args.spec); raw = fs.readFileSync(args.spec, 'utf8'); }
  else emitError('BAD_ARGS', 'Falta --spec o --stdin.');
  try { return JSON.parse(raw); } catch (e) { emitError('BAD_SPEC_JSON', 'El spec no es JSON válido: ' + e.message); }
}

// ARGB de 8 dígitos a partir de un hex de 6 (o 8). exceljs usa AARRGGBB.
function argb(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 6) h = 'FF' + h;
  return h.toUpperCase();
}

// ---------------------------------------------------------------------------
// Construcción del workbook desde el spec (usando exceljs)
// ---------------------------------------------------------------------------
function buildWorkbook(E, spec) {
  const wb = new E.Workbook();
  wb.creator = spec.creator || 'Aigent';
  if (spec.title) wb.title = spec.title;

  const sheets = spec.sheets || (spec.rows ? [spec] : []);
  if (!sheets.length) emitError('BAD_SPEC', 'El spec necesita `sheets` (o `rows` para una sola hoja).');

  sheets.forEach(function (sh, si) {
    const opts = {};
    if (sh.freeze) opts.views = [{ state: 'frozen', xSplit: Number(sh.freeze.cols) || 0, ySplit: Number(sh.freeze.rows) || 0 }];
    const ws = wb.addWorksheet(sanitizeName(sh.name, si), opts);

    if (Array.isArray(sh.columns)) ws.columns = sh.columns.map(function (c) { return { width: Number(c.width) || 12 }; });

    (sh.rows || []).forEach(function (row, ri) {
      const cells = Array.isArray(row) ? row : [row];
      const r = ws.getRow(ri + 1);
      cells.forEach(function (cell, ci) {
        const c = r.getCell(ci + 1);
        applyCell(c, cell, !!(sh.header && ri === 0));
      });
      r.commit && r.commit();
    });

    (sh.merges || []).forEach(function (m) { try { ws.mergeCells(m); } catch (e) { emitError('BAD_SPEC', 'Merge inválido: ' + m); } });

    if (sh.image) {
      const img = sh.image;
      let buf;
      if (img.path) { const p = path.isAbsolute(img.path) ? img.path : path.resolve(process.cwd(), img.path);
        if (!fs.existsSync(p)) emitError('IMAGE_NOT_FOUND', 'No existe la imagen: ' + img.path); buf = fs.readFileSync(p); }
      else if (img.data) buf = Buffer.from(img.data, 'base64');
      else emitError('BAD_SPEC', 'Un `image` necesita path o data.');
      const ext = (img.format || (img.path ? path.extname(img.path).slice(1) : 'png')).toLowerCase();
      const id = wb.addImage({ buffer: buf, extension: ext === 'jpg' ? 'jpeg' : ext });
      ws.addImage(id, img.range || 'A1:B5');
    }
  });
  return wb;
}

function sanitizeName(name, idx) {
  let n = (name || ('Hoja' + (idx + 1))).replace(/[\\\/\?\*\[\]:]/g, '_').slice(0, 31);
  return n || ('Hoja' + (idx + 1));
}

function applyCell(c, cell, headerDefault) {
  let v = cell;
  let style = {};
  if (cell && typeof cell === 'object' && !Array.isArray(cell)) {
    if (cell.formula != null) c.value = { formula: String(cell.formula).replace(/^=/, ''), result: cell.value };
    else if (cell.type === 'date' || (cell.value != null && cell.type === 'date')) c.value = new Date(cell.value);
    else c.value = cell.value != null ? cell.value : null;
    style = cell;
    if (cell.type === 'date' && !cell.numFmt) c.numFmt = 'yyyy-mm-dd';
  } else {
    c.value = v;
  }
  const font = {};
  if (style.bold || headerDefault) font.bold = true;
  if (style.italic) font.italic = true;
  if (style.color) font.color = { argb: argb(style.color) };
  if (style.size) font.size = Number(style.size);
  if (Object.keys(font).length) c.font = font;
  if (style.fill) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(style.fill) } };
  if (style.numFmt) c.numFmt = String(style.numFmt);
  if (style.align) c.alignment = { horizontal: style.align };
  if (style.border) {
    const b = { style: 'thin' };
    c.border = { top: b, left: b, bottom: b, right: b };
  }
}

// ---------------------------------------------------------------------------
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args._[0] === undefined) { help(); process.exit(0); }
  const cmd = args._[0];
  const { ensureDep } = loadBootstrap();

  if (cmd === 'deps') {
    const { installed, cache, via } = ensureDep(DEP, { autoInstall: !args.noInstall, skillRef: SKILL_REL });
    return emitOk({ op: 'deps', dependency: DEP, cache_dir: cache, installed_now: installed, installed_via: via });
  }
  if (cmd !== 'build') emitError('BAD_ARGS', "Comando desconocido: '" + cmd + "' (build|deps).");
  if (!args.output) emitError('BAD_ARGS', 'Falta --output.');

  const spec = readSpec(args);
  if (!spec || typeof spec !== 'object') emitError('BAD_SPEC', 'El spec debe ser un objeto.');

  const { module: E, installed } = ensureDep(DEP, { autoInstall: !args.noInstall, skillRef: SKILL_REL });
  const wb = buildWorkbook(E, spec);

  fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
  wb.xlsx.writeFile(args.output).then(function () {
    const sheets = wb.worksheets.length;
    const rows = wb.worksheets.reduce(function (a, w) { return a + w.rowCount; }, 0);
    emitOk({ op: 'build', path: args.output, sheets: sheets, rows: rows, dep_installed_now: installed });
  }).catch(function (e) {
    emitError('INTERNAL', 'Error generando el .xlsx: ' + (e && e.message ? e.message : String(e)));
  });
}

main();
