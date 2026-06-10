#!/usr/bin/env node
// =============================================================================
// shared-docx-rich — Word (.docx) RICO vía librería `docx` (npm)
//
// Skill HÍBRIDA: a diferencia de `shared-office-writer` (cero-dependencias,
// OOXML a mano, alcance "Práctico"), esta skill instala y usa la librería
// `docx` para romper el techo de formato: IMÁGENES embebidas, header/footer
// con numeración de página, saltos de página, colores y tamaños de fuente.
//
// El script es la parte determinista del híbrido (spec JSON -> documento);
// la prosa del SKILL.md guía cómo extenderlo cuando el caso excede el spec.
//
// Bootstrap de dependencia: `docx` se instala on-demand en la caché compartida
// .context/libs/ (gitignored) y se reutiliza. No se reinstala ni se borra entre
// usos. Solo se limpian los ficheros temporales (spec), no la lib.
//
// Contrato: JSON por stdout. Exit 0 si ok:true, 1 si ok:false. Sin TTY.
// Invocar SIEMPRE por el launcher: .aigent/IDE/bin/run ... (nunca `node` a secas)
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// --- dependencia declarada (pin) --------------------------------------------
const DEP = { name: 'docx', version: '9.7.1' };

// ---------------------------------------------------------------------------
// Salida JSON
// ---------------------------------------------------------------------------
function emitOk(data) { process.stdout.write(JSON.stringify(Object.assign({ ok: true }, data)) + '\n'); }
function emitError(code, message, details) {
  const err = { code, message };
  if (details) err.details = details;
  process.stdout.write(JSON.stringify({ ok: false, error: err }) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + message + '\n');
  process.exit(1);
}
function help() {
  process.stdout.write([
    'Usage:',
    '  run docx.cjs build --spec <spec.json> --output <file.docx>',
    '  run docx.cjs build --stdin --output <file.docx>',
    '  run docx.cjs deps   [--no-install]      # comprueba/instala la dependencia',
    '',
    'Options:',
    '  --spec <path>    Path al spec JSON.',
    '  --stdin          Lee el spec JSON desde stdin en vez de --spec.',
    '  --output <path>  Destino .docx. Obligatorio en build.',
    '  --no-install     No instala `docx` si falta (falla con DEP_MISSING).',
    '  --help, -h       Esta ayuda.',
    '',
    'Output: JSON a stdout. Exit 0 si ok, 1 si error.'
  ].join('\n') + '\n');
}

// ---------------------------------------------------------------------------
// Bootstrap de dependencia — vía el helper compartido (convención §16)
// ---------------------------------------------------------------------------
const SKILL_REL = '.aigent/departments/_shared/skills/shared-docx-rich/docx.cjs';

// Toda skill híbrida obtiene su librería por el helper único lib-bootstrap.cjs
// (caché .context/libs, npm bundled-or-system, gitignore). No se duplica aquí.
function ensureDep(autoInstall) {
  const boot = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'lib-bootstrap.cjs');
  let lib;
  try { lib = require(boot); }
  catch (e) { emitError('BOOTSTRAP_NOT_FOUND', 'No se encontró el helper lib-bootstrap.cjs en ' + boot + '. El cwd debe ser la raíz del proyecto (donde viven .aigent/ y .context/).'); }
  return lib.ensureDep(DEP, { autoInstall: autoInstall, skillRef: SKILL_REL });
}

// ---------------------------------------------------------------------------
// Args
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
  else if (args.spec) {
    if (!fs.existsSync(args.spec)) emitError('SPEC_NOT_FOUND', 'No existe el spec: ' + args.spec);
    raw = fs.readFileSync(args.spec, 'utf8');
  } else emitError('BAD_ARGS', 'Falta --spec o --stdin.');
  try { return JSON.parse(raw); } catch (e) { emitError('BAD_SPEC_JSON', 'El spec no es JSON válido: ' + e.message); }
}

// ---------------------------------------------------------------------------
// Construcción del documento desde el spec (usando la librería `docx`)
// ---------------------------------------------------------------------------
function buildDoc(D, spec) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, Header, Footer,
          AlignmentType, Table, TableRow, TableCell, WidthType, PageNumber, BorderStyle,
          ExternalHyperlink, PageBreak } = D;

  const HEADINGS = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3,
                     4: HeadingLevel.HEADING_4, 5: HeadingLevel.HEADING_5, 6: HeadingLevel.HEADING_6 };
  const ALIGN = { left: AlignmentType.LEFT, right: AlignmentType.RIGHT, center: AlignmentType.CENTER, justify: AlignmentType.JUSTIFIED };

  function imgData(img) {
    if (img.path) {
      const p = path.isAbsolute(img.path) ? img.path : path.resolve(process.cwd(), img.path);
      if (!fs.existsSync(p)) emitError('IMAGE_NOT_FOUND', 'No existe la imagen: ' + img.path);
      return fs.readFileSync(p);
    }
    if (img.data) return Buffer.from(img.data, 'base64');
    emitError('BAD_SPEC', 'Un bloque image necesita `path` o `data` (base64).');
  }
  function imgType(img) {
    const t = (img.format || (img.path ? path.extname(img.path).slice(1) : 'png')).toLowerCase();
    const map = { jpg: 'jpg', jpeg: 'jpg', png: 'png', gif: 'gif', bmp: 'bmp' };
    if (!map[t]) emitError('BAD_SPEC', 'Tipo de imagen no soportado: ' + t + ' (png|jpg|gif|bmp).');
    return map[t];
  }
  function imageRun(img) {
    return new ImageRun({ type: imgType(img), data: imgData(img),
      transformation: { width: Number(img.width) || 200, height: Number(img.height) || 120 } });
  }
  function makeRun(r) {
    if (typeof r === 'string') return new TextRun(r);
    const opts = { text: r.text != null ? String(r.text) : '' };
    if (r.bold) opts.bold = true;
    if (r.italic) opts.italics = true;
    if (r.underline) opts.underline = {};
    if (r.color) opts.color = String(r.color).replace('#', '');
    if (r.size) opts.size = Number(r.size) * 2; // half-points
    const run = new TextRun(opts);
    if (r.link) return new ExternalHyperlink({ children: [new TextRun(Object.assign({}, opts, { style: 'Hyperlink' }))], link: r.link });
    return run;
  }
  function makeParagraph(b) {
    const opts = {};
    if (b.align && ALIGN[b.align]) opts.alignment = ALIGN[b.align];
    if (b.runs) opts.children = b.runs.map(makeRun);
    else if (b.image) opts.children = [imageRun(b.image)];
    else {
      const t = { text: b.text != null ? String(b.text) : '' };
      if (b.bold) t.bold = true; if (b.italic) t.italics = true; if (b.underline) t.underline = {};
      if (b.color) t.color = String(b.color).replace('#', ''); if (b.size) t.size = Number(b.size) * 2;
      opts.children = [new TextRun(t)];
    }
    return new Paragraph(opts);
  }
  function cellRuns(cell) {
    if (Array.isArray(cell)) return cell.map(makeRun);
    if (cell && typeof cell === 'object') return [makeRun(cell)];
    return [new TextRun(String(cell == null ? '' : cell))];
  }
  function makeTable(b) {
    const rows = b.rows || [];
    const trs = rows.map(function (row, ri) {
      const cells = (Array.isArray(row) ? row : [row]).map(function (cell) {
        const runs = cellRuns(cell).map(function (r) {
          if (b.header && ri === 0 && r instanceof TextRun) { return r; }
          return r;
        });
        return new TableCell({ children: [new Paragraph({ children: runs })] });
      });
      return new TableRow({ children: cells, tableHeader: !!(b.header && ri === 0) });
    });
    return new Table({ rows: trs, width: { size: 100, type: WidthType.PERCENTAGE } });
  }
  function makeBlock(b) {
    if (typeof b === 'string') return makeParagraph({ text: b });
    switch (b.type) {
      case 'heading': return new Paragraph({ heading: HEADINGS[b.level || 1] || HeadingLevel.HEADING_1,
                                             children: [new TextRun(String(b.text || ''))] });
      case 'paragraph': return makeParagraph(b);
      case 'image': return makeParagraph({ image: b, align: b.align });
      case 'table': return makeTable(b);
      case 'pagebreak': return new Paragraph({ children: [new PageBreak()] });
      default: emitError('BAD_SPEC', "Tipo de bloque docx desconocido: '" + b.type + "'");
    }
  }

  // header / footer
  const section = { children: (spec.body || []).map(makeBlock) };
  if (spec.header) {
    const kids = [];
    if (spec.header.image) kids.push(new Paragraph({ alignment: ALIGN[spec.header.align] || AlignmentType.RIGHT, children: [imageRun(spec.header.image)] }));
    if (spec.header.text) kids.push(new Paragraph({ alignment: ALIGN[spec.header.align] || AlignmentType.LEFT, children: [new TextRun(String(spec.header.text))] }));
    if (kids.length) section.headers = { default: new Header({ children: kids }) };
  }
  if (spec.footer) {
    const kids = [];
    if (spec.footer.text) kids.push(new Paragraph({ alignment: ALIGN[spec.footer.align] || AlignmentType.CENTER, children: [new TextRun(String(spec.footer.text))] }));
    if (spec.footer.pageNumbers) kids.push(new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun('Página '), new TextRun({ children: [PageNumber.CURRENT] }), new TextRun(' de '), new TextRun({ children: [PageNumber.TOTAL_PAGES] })] }));
    if (kids.length) section.footers = { default: new Footer({ children: kids }) };
  }

  const doc = new Document({ creator: spec.creator || 'Aigent', title: spec.title || '', sections: [section] });
  return Packer.toBuffer(doc);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || args._[0] === undefined) { help(); process.exit(0); }
  const cmd = args._[0];

  if (cmd === 'deps') {
    const { installed, cache, via } = ensureDep(!args.noInstall);
    return emitOk({ op: 'deps', dependency: DEP, cache_dir: cache, installed_now: installed, installed_via: via });
  }
  if (cmd !== 'build') emitError('BAD_ARGS', "Comando desconocido: '" + cmd + "' (build|deps).");
  if (!args.output) emitError('BAD_ARGS', 'Falta --output.');

  const spec = readSpec(args);
  if (!spec || typeof spec !== 'object') emitError('BAD_SPEC', 'El spec debe ser un objeto.');
  if (!Array.isArray(spec.body)) emitError('BAD_SPEC', 'El spec necesita un array `body`.');

  const { module: D, installed } = ensureDep(!args.noInstall);

  buildDoc(D, spec).then(function (buf) {
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(args.output, buf);
    emitOk({ op: 'build', path: args.output, bytes: buf.length, blocks: spec.body.length, dep_installed_now: installed });
  }).catch(function (e) {
    emitError('INTERNAL', 'Error generando el .docx: ' + (e && e.message ? e.message : String(e)));
  });
}

main();
