#!/usr/bin/env node
// =============================================================================
// shared-docx-rich — Word (.docx) RICO vía librería `docx` (npm)
//
// Skill HÍBRIDA: a diferencia de `shared-office-writer` (cero-dependencias,
// OOXML a mano, alcance "Práctico"), esta skill instala y usa la librería
// `docx` para romper el techo de formato: IMÁGENES embebidas, header/footer
// con numeración de página, saltos de página, colores y tamaños de fuente,
// tablas con estilo (cabecera sombreada, zebra, anchos de columna, márgenes
// de celda), secciones apaisadas y un ESTILO DE CASA por defecto (tipografía
// legible, interlineado, headings con color corporativo).
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

// --- dependencia declarada (pin) --------------------------------------------
const DEP = { name: 'docx', version: '9.7.1' };

// --- estilo de casa (theme por defecto; sobreescribible vía spec.theme) -----
const THEME = {
  primary: '1F4E79',     // azul oscuro — headings H1, cabeceras de tabla
  secondary: '2E74B5',   // azul medio  — H2, hipervínculos, reglas
  text: '262626',        // texto base
  gray: '595959',        // texto secundario (header/footer, notas)
  lightGray: 'D9D9D9',   // bordes de tabla y reglas de header/footer
  zebra: 'EDF3F9',       // relleno de filas alternas
  font: 'Calibri',
  headingFont: 'Calibri Light',
  baseSize: 11,          // pt
  lineSpacing: 300,      // 1.25 (240 = sencillo)
  paragraphAfter: 160    // twips de espacio tras párrafo
};

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
    'Spec: ver SKILL.md. Aplica un estilo de casa por defecto (theme) con',
    'tipografía legible, headings con color, tablas con cabecera sombreada,',
    'zebra y anchos de columna, y soporta secciones apaisadas (spec.sections).',
    '',
    'Output: JSON a stdout. Exit 0 si ok, 1 si error.'
  ].join('\n') + '\n');
}

// ---------------------------------------------------------------------------
// Bootstrap de dependencia — vía el helper compartido (convención §16)
// ---------------------------------------------------------------------------
const SKILL_REL = '.aigent/departments/_shared/skills/shared-docx-rich/docx.cjs';

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
          ExternalHyperlink, PageBreak, ShadingType, VerticalAlign, PageOrientation } = D;

  const theme = Object.assign({}, THEME, spec.theme || {});
  const hex = c => String(c).replace('#', '');

  const HEADINGS = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3,
                     4: HeadingLevel.HEADING_4, 5: HeadingLevel.HEADING_5, 6: HeadingLevel.HEADING_6 };
  const ALIGN = { left: AlignmentType.LEFT, right: AlignmentType.RIGHT, center: AlignmentType.CENTER, justify: AlignmentType.JUSTIFIED };

  // usable width (twips) según orientación A4 con márgenes de 1" (1440)
  const USABLE = { portrait: 11906 - 2880, landscape: 16838 - 2880 };

  const cellBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.lightGray) },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.lightGray) },
    left: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.lightGray) },
    right: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.lightGray) }
  };
  const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };

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
  function makeRun(r, defaults) {
    if (typeof r === 'string') r = { text: r };
    const opts = { text: r.text != null ? String(r.text) : '' };
    const d = defaults || {};
    if (r.bold || d.bold) opts.bold = true;
    if (r.italic) opts.italics = true;
    if (r.underline) opts.underline = {};
    if (r.color) opts.color = hex(r.color); else if (d.color) opts.color = hex(d.color);
    if (r.size) opts.size = Number(r.size) * 2; else if (d.size) opts.size = Number(d.size) * 2; // half-points
    if (r.link) {
      if (!opts.color) opts.color = hex(theme.secondary);
      opts.underline = opts.underline || {};
      return new ExternalHyperlink({ children: [new TextRun(opts)], link: r.link });
    }
    return new TextRun(opts);
  }
  function paragraphOpts(b) {
    const opts = {};
    if (b.align && ALIGN[b.align]) opts.alignment = ALIGN[b.align];
    if (b.spacing) opts.spacing = {
      before: b.spacing.before != null ? Number(b.spacing.before) * 20 : undefined, // pt -> twips
      after: b.spacing.after != null ? Number(b.spacing.after) * 20 : undefined
    };
    if (b.bullet) opts.bullet = { level: b.bullet === true ? 0 : Number(b.bullet) || 0 };
    if (b.pageBreakBefore) opts.pageBreakBefore = true;
    return opts;
  }
  function makeParagraph(b) {
    const opts = paragraphOpts(b);
    if (b.runs) opts.children = b.runs.map(r => makeRun(r));
    else if (b.image) opts.children = [imageRun(b.image)];
    else {
      const t = { text: b.text != null ? String(b.text) : '' };
      if (b.bold) t.bold = true; if (b.italic) t.italic = true; if (b.underline) t.underline = true;
      if (b.color) t.color = b.color; if (b.size) t.size = b.size;
      opts.children = [makeRun(t)];
    }
    return new Paragraph(opts);
  }
  function makeCell(c, opts) {
    // celda = string | run | array de runs | { runs|text, align, fill }
    let runs, align, fill;
    if (Array.isArray(c)) runs = c.map(r => makeRun(r, opts.runDefaults));
    else if (c && typeof c === 'object' && (c.runs || c.align || c.fill)) {
      runs = (c.runs ? c.runs : [{ text: c.text != null ? c.text : '' }]).map(r => makeRun(r, opts.runDefaults));
      align = c.align; fill = c.fill;
    }
    else runs = [makeRun(c == null ? '' : c, opts.runDefaults)];
    const pOpts = { children: runs };
    if (align && ALIGN[align]) pOpts.alignment = ALIGN[align];
    const shadeFill = fill || opts.fill;
    return new TableCell({
      children: [new Paragraph(pOpts)],
      borders: cellBorders,
      margins: cellMargins,
      verticalAlign: VerticalAlign.CENTER,
      shading: shadeFill ? { type: ShadingType.CLEAR, fill: hex(shadeFill) } : undefined
    });
  }
  function makeTable(b, orientation) {
    const rows = b.rows || [];
    const headerFill = b.headerFill != null ? b.headerFill : theme.primary;
    const trs = rows.map(function (row, ri) {
      const isHead = !!(b.header && ri === 0);
      const cells = (Array.isArray(row) ? row : [row]).map(function (c, ci) {
        const opts = {};
        if (isHead) { opts.fill = headerFill; opts.runDefaults = { bold: true, color: 'FFFFFF' }; }
        else {
          if (b.zebra && (b.header ? ri % 2 === 0 : ri % 2 === 1)) opts.fill = theme.zebra;
          if (b.firstColumnShaded && ci === 0) { opts.fill = theme.zebra; opts.runDefaults = { bold: true, color: theme.primary }; }
        }
        return makeCell(c, opts);
      });
      return new TableRow({ children: cells, tableHeader: isHead });
    });
    const tableOpts = { rows: trs, width: { size: 100, type: WidthType.PERCENTAGE } };
    if (Array.isArray(b.widths) && b.widths.length) {
      const usable = USABLE[orientation === 'landscape' ? 'landscape' : 'portrait'];
      const sum = b.widths.reduce((a, w) => a + Number(w), 0) || 1;
      tableOpts.columnWidths = b.widths.map(w => Math.round(Number(w) / sum * usable));
    }
    return new Table(tableOpts);
  }
  function makeBlock(b, orientation) {
    if (typeof b === 'string') return makeParagraph({ text: b });
    switch (b.type) {
      case 'heading': {
        const opts = paragraphOpts(b);
        opts.heading = HEADINGS[b.level || 1] || HeadingLevel.HEADING_1;
        opts.children = b.runs ? b.runs.map(r => makeRun(r)) : [new TextRun(String(b.text || ''))];
        return new Paragraph(opts);
      }
      case 'paragraph': return makeParagraph(b);
      case 'image': return makeParagraph({ image: b, align: b.align });
      case 'table': return makeTable(b, orientation);
      case 'pagebreak': return new Paragraph({ children: [new PageBreak()] });
      default: emitError('BAD_SPEC', "Tipo de bloque docx desconocido: '" + b.type + "'");
    }
  }

  // header / footer (compartidos por todas las secciones; estilo de casa)
  function makeHeader() {
    if (!spec.header) return null;
    const kids = [];
    if (spec.header.image) kids.push(new Paragraph({ alignment: ALIGN[spec.header.align] || AlignmentType.RIGHT, children: [imageRun(spec.header.image)] }));
    if (spec.header.text) kids.push(new Paragraph({
      alignment: ALIGN[spec.header.align] || AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.lightGray) } },
      children: [new TextRun({ text: String(spec.header.text), color: hex(theme.gray), size: 16 })]
    }));
    return kids.length ? new Header({ children: kids }) : null;
  }
  function makeFooter() {
    if (!spec.footer) return null;
    const runs = [];
    if (spec.footer.text) runs.push(new TextRun({ text: String(spec.footer.text) + (spec.footer.pageNumbers ? '    ·    ' : ''), color: hex(theme.gray), size: 16 }));
    if (spec.footer.pageNumbers) runs.push(
      new TextRun({ text: 'Página ', color: hex(theme.gray), size: 16 }),
      new TextRun({ children: [PageNumber.CURRENT], color: hex(theme.gray), size: 16 }),
      new TextRun({ text: ' de ', color: hex(theme.gray), size: 16 }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], color: hex(theme.gray), size: 16 })
    );
    if (!runs.length) return null;
    return new Footer({ children: [new Paragraph({
      alignment: ALIGN[spec.footer.align] || AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: hex(theme.lightGray) } },
      children: runs
    })] });
  }

  // secciones: spec.sections [{ orientation, body }] o atajo spec.body (1 sección portrait)
  const sectionSpecs = Array.isArray(spec.sections) && spec.sections.length
    ? spec.sections
    : [{ body: spec.body || [] }];
  const hdr = makeHeader(), ftr = makeFooter();
  const sections = sectionSpecs.map(function (s) {
    if (!Array.isArray(s.body)) emitError('BAD_SPEC', 'Cada sección necesita un array `body`.');
    const orientation = s.orientation === 'landscape' ? 'landscape' : 'portrait';
    const sec = { properties: {}, children: s.body.map(b => makeBlock(b, orientation)) };
    if (orientation === 'landscape') sec.properties.page = { size: { orientation: PageOrientation.LANDSCAPE } };
    if (hdr) sec.headers = { default: hdr };
    if (ftr) sec.footers = { default: ftr };
    return sec;
  });

  const doc = new Document({
    creator: spec.creator || 'Aigent',
    title: spec.title || '',
    styles: {
      default: {
        document: {
          run: { font: theme.font, size: Number(theme.baseSize) * 2, color: hex(theme.text) },
          paragraph: { spacing: { after: Number(theme.paragraphAfter), line: Number(theme.lineSpacing) } }
        }
      },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: theme.headingFont, size: 32, bold: true, color: hex(theme.primary) },
          paragraph: { spacing: { before: 360, after: 200 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: hex(theme.secondary) } } } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: theme.headingFont, size: 26, bold: true, color: hex(theme.secondary) },
          paragraph: { spacing: { before: 300, after: 140 } } },
        { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: theme.headingFont, size: 23, bold: true, color: hex(theme.text) },
          paragraph: { spacing: { before: 240, after: 120 } } }
      ]
    },
    sections: sections
  });
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
  if (!Array.isArray(spec.body) && !Array.isArray(spec.sections)) emitError('BAD_SPEC', 'El spec necesita un array `body` o un array `sections`.');

  const { module: D, installed } = ensureDep(!args.noInstall);

  buildDoc(D, spec).then(function (buf) {
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(args.output, buf);
    const blocks = Array.isArray(spec.body) ? spec.body.length
      : spec.sections.reduce((a, s) => a + (Array.isArray(s.body) ? s.body.length : 0), 0);
    emitOk({ op: 'build', path: args.output, bytes: buf.length, blocks: blocks, dep_installed_now: installed });
  }).catch(function (e) {
    emitError('INTERNAL', 'Error generando el .docx: ' + (e && e.message ? e.message : String(e)));
  });
}

main();
