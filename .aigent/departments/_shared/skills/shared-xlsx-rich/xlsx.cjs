#!/usr/bin/env node
// =============================================================================
// shared-xlsx-rich — Excel (.xlsx) RICO vía librería `exceljs` (npm)
//
// Skill HÍBRIDA: contraparte con-librería de `shared-office-writer` (cero-deps,
// alcance "Práctico"). Rompe el techo de xlsx: colores de celda (fills), celdas
// combinadas (merges), bordes a medida, paneles congelados (freeze), formatos
// numéricos, imágenes embebidas. Desde un spec JSON.
//
// ESTILO DE CASA por defecto (espejo de shared-docx-rich): con `header: true`
// la primera fila sale sombreada con `theme.primary`, texto blanco en negrita
// e inmovilizada (freeze); `zebra: true` alterna el relleno de filas; los
// bordes finos y el ancho de columna automático se aplican sin pedir nada.
// Todo sobreescribible vía `theme` (mismos nombres de campo que docx).
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

// --- estilo de casa (theme por defecto; sobreescribible vía spec.theme) -----
// Nombres de campo alineados con shared-docx-rich para coherencia entre skills.
const THEME = {
  primary: '1F4E79',     // azul oscuro — relleno de la fila de cabecera
  secondary: '2E74B5',   // azul medio  — reservado (hipervínculos futuros)
  text: '262626',        // texto base
  gray: '595959',        // texto secundario
  lightGray: 'D9D9D9',   // bordes finos
  zebra: 'EDF3F9',       // relleno de filas alternas
  headerText: 'FFFFFF',  // texto de la cabecera
  font: 'Calibri',
  baseSize: 11           // pt
};

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
    'Spec: ver SKILL.md. Aplica estilo de casa por defecto (cabecera sombreada',
    'e inmovilizada con header:true, zebra opcional, bordes finos y anchos de',
    'columna automáticos). Sobreescribible vía spec.theme.',
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
  const theme = Object.assign({}, THEME, spec.theme || {});
  const wb = new E.Workbook();
  wb.creator = spec.creator || 'Aigent';
  if (spec.title) wb.title = spec.title;

  const sheets = spec.sheets || (spec.rows ? [spec] : []);
  if (!sheets.length) emitError('BAD_SPEC', 'El spec necesita `sheets` (o `rows` para una sola hoja).');

  const thinBorder = { style: 'thin', color: { argb: argb(theme.lightGray) } };
  const baseFont = { name: theme.font, size: Number(theme.baseSize) };

  sheets.forEach(function (sh, si) {
    const hasHeader = !!(sh.header && (sh.rows || []).length);
    const zebra = !!sh.zebra;
    const borders = sh.borders !== false;            // por defecto ON
    const ws = wb.addWorksheet(sanitizeName(sh.name, si));

    // freeze: explícito (sh.freeze) o automático de cabecera (header:true)
    let xSplit = 0, ySplit = 0;
    if (sh.freeze) { xSplit = Number(sh.freeze.cols) || 0; ySplit = Number(sh.freeze.rows) || 0; }
    else if (hasHeader) { ySplit = 1; }
    if (xSplit || ySplit) ws.views = [{ state: 'frozen', xSplit: xSplit, ySplit: ySplit }];

    // anchos explícitos (si vienen); si no, se autoajustan al final
    if (Array.isArray(sh.columns)) sh.columns.forEach(function (c, ci) {
      if (c && c.width != null) ws.getColumn(ci + 1).width = Number(c.width);
    });

    const rows = sh.rows || [];
    let nCols = 0;
    rows.forEach(function (row, ri) {
      const cells = Array.isArray(row) ? row : [row];
      if (cells.length > nCols) nCols = cells.length;
      const r = ws.getRow(ri + 1);
      const isHead = hasHeader && ri === 0;
      const zebraRow = zebra && !isHead && ((ri - (hasHeader ? 1 : 0)) % 2 === 1);
      cells.forEach(function (cell, ci) {
        const c = r.getCell(ci + 1);
        applyCell(c, cell, {
          theme: theme, baseFont: baseFont, isHead: isHead,
          zebraFill: zebraRow ? theme.zebra : null,
          border: borders ? thinBorder : null
        });
      });
      r.commit && r.commit();
    });

    // autofiltro sobre la fila de cabecera
    if (hasHeader && nCols > 0) {
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: nCols } };
    }

    // anchos de columna automáticos (solo donde no se fijó explícito)
    const explicit = {};
    if (Array.isArray(sh.columns)) sh.columns.forEach(function (c, ci) { if (c && c.width != null) explicit[ci] = true; });
    for (let ci = 0; ci < nCols; ci++) {
      if (explicit[ci]) continue;
      let max = 0;
      rows.forEach(function (row) {
        const cells = Array.isArray(row) ? row : [row];
        const len = cellTextLength(cells[ci]);
        if (len > max) max = len;
      });
      ws.getColumn(ci + 1).width = Math.min(60, Math.max(9, max + 2));
    }

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

function cellTextLength(cell) {
  if (cell == null) return 0;
  if (typeof cell === 'object' && !Array.isArray(cell)) {
    const v = cell.value != null ? cell.value : (cell.formula != null ? '=' + cell.formula : '');
    return String(v).length;
  }
  return String(cell).length;
}

function applyCell(c, cell, ctx) {
  const theme = ctx.theme;
  let style = {};
  if (cell && typeof cell === 'object' && !Array.isArray(cell)) {
    if (cell.formula != null) c.value = { formula: String(cell.formula).replace(/^=/, ''), result: cell.value };
    else if (cell.type === 'date') c.value = cell.value != null ? new Date(cell.value) : null;
    else c.value = cell.value != null ? cell.value : null;
    style = cell;
    if (cell.type === 'date' && !cell.numFmt) c.numFmt = 'yyyy-mm-dd';
  } else {
    c.value = cell;
  }

  // fuente: base de casa + overrides; cabecera => blanca negrita
  const font = { name: theme.font, size: Number(theme.baseSize) };
  if (ctx.isHead) { font.bold = true; font.color = { argb: argb(theme.headerText) }; }
  if (style.bold) font.bold = true;
  if (style.italic) font.italic = true;
  if (style.color) font.color = { argb: argb(style.color) };
  if (style.size) font.size = Number(style.size);
  c.font = font;

  // relleno: cabecera (primary) > fill explícito de celda > zebra de fila
  let fill = null;
  if (ctx.isHead) fill = theme.primary;
  else if (style.fill) fill = style.fill;
  else if (ctx.zebraFill) fill = ctx.zebraFill;
  if (fill) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: argb(fill) } };

  if (style.numFmt) c.numFmt = String(style.numFmt);

  // alineación: vertical centrada por defecto; horizontal explícita o auto
  const alignment = { vertical: 'middle' };
  if (style.align) alignment.horizontal = style.align;
  alignment.wrapText = style.wrap != null ? !!style.wrap : false;
  c.alignment = alignment;

  // bordes: finos de casa por defecto; `border: true` mantiene compatibilidad
  if (ctx.border) c.border = { top: ctx.border, left: ctx.border, bottom: ctx.border, right: ctx.border };
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
