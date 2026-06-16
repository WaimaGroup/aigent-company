#!/usr/bin/env node
// =============================================================================
// spec-kit.cjs — ladrillos para COMPONER el spec JSON de las skills híbridas
// de documentos (shared-docx-rich / shared-xlsx-rich).
//
// Idea (lo común, conventions §16/§18): el render es genérico y vive en la skill;
// la COMPOSICIÓN (qué bloques, en qué orden, con qué datos) es lo que cambia entre
// dominios (licitaciones, marketing…). Este kit es el vocabulario común de
// ladrillos — determinista (tipo Local), SIN lógica de dominio — para que el
// agente o un builder de dominio compongan un spec válido sin escribir JSON crudo.
// La composición concreta de cada dominio va FUERA de aquí (en prosa del agente o
// en un builder propio que requiere este kit).
//
// Uso (desde un builder de dominio o el agente):
//   const path = require('path');
//   const { docx, xlsx } = require(path.join(process.cwd(),'.aigent','IDE','bin','spec-kit.cjs'));
//   const spec = docx.doc({ title:'Informe', footer:{ pageNumbers:true } }, [
//     docx.h1('Resumen'),
//     docx.p('Texto...'),
//     docx.kpis([{label:'Presupuesto', value:'120.000 €'}, {label:'Plazo', value:'24 meses'}]),
//     docx.h1('Criterios'),
//     docx.table(['Criterio','Peso'], [['Precio','40%'],['Calidad','60%']]),
//   ]);
//   // -> escribir spec a JSON y pasarlo a docx.cjs build --spec ...
//
// Los ladrillos emiten EXACTAMENTE el spec que aceptan docx.cjs / xlsx.cjs hoy.
// Si esas skills amplían su schema, se añaden ladrillos aquí (no al revés).
// =============================================================================
'use strict';

// Aplana arrays anidados y descarta null/undefined (para componer con .map/condicionales).
function flat(a) {
  if (a == null) return [];
  if (!Array.isArray(a)) return [a];
  return a.reduce((acc, x) => acc.concat(Array.isArray(x) ? flat(x) : (x == null ? [] : [x])), []);
}

// ─── DOCX (shared-docx-rich) ────────────────────────────────────────────────
const docx = {
  // Ensambla el spec final. meta: { title, creator, theme, header, footer, landscape }.
  // blocks: array (anidable) de ladrillos de body.
  doc(meta, blocks) {
    meta = meta || {};
    const spec = { creator: meta.creator || 'Aigent' };
    if (meta.title) spec.title = meta.title;
    if (meta.theme) spec.theme = meta.theme;
    if (meta.header) spec.header = meta.header;   // { image, text, align }
    if (meta.footer) spec.footer = meta.footer;   // { text, pageNumbers, align }
    const body = flat(blocks);
    if (meta.landscape) spec.sections = [{ orientation: 'landscape', body: body }];
    else spec.body = body;
    return spec;
  },
  // Documento multi-sección (mezcla portrait/landscape). secciones = [docx.section(...)].
  docSections(meta, sections) {
    meta = meta || {};
    const spec = { creator: meta.creator || 'Aigent' };
    if (meta.title) spec.title = meta.title;
    if (meta.theme) spec.theme = meta.theme;
    if (meta.header) spec.header = meta.header;
    if (meta.footer) spec.footer = meta.footer;
    spec.sections = (sections || []).map((s) => ({ orientation: s.orientation || 'portrait', body: flat(s.body) }));
    return spec;
  },
  section: (opts, blocks) => ({ orientation: (opts && opts.orientation) || 'portrait', body: flat(blocks) }),

  heading: (level, text) => ({ type: 'heading', level: level, text: String(text) }),
  h1: (t) => ({ type: 'heading', level: 1, text: String(t) }),
  h2: (t) => ({ type: 'heading', level: 2, text: String(t) }),
  h3: (t) => ({ type: 'heading', level: 3, text: String(t) }),

  // Párrafo: texto simple (+opts: align, bold, italic, color, size, spacing, bullet…)
  p: (text, opts) => Object.assign({ type: 'paragraph', text: String(text) }, opts || {}),
  // Párrafo con runs heterogéneos: runs([ 'normal ', docx.bold('fuerte'), docx.link('aquí','http..') ])
  runs: (arr, opts) => Object.assign({ type: 'paragraph', runs: flat(arr) }, opts || {}),

  // Runs (para usar dentro de runs() o en celdas de tabla)
  bold: (text) => ({ text: String(text), bold: true }),
  italic: (text) => ({ text: String(text), italic: true }),
  link: (text, url) => ({ text: String(text), link: url }),
  run: (text, opts) => Object.assign({ text: String(text) }, opts || {}),

  // Tabla con cabecera (primera fila = headers, se estila sola). opts: zebra, widths,
  // headerFill, firstColumnShaded. rows = array de filas; cada celda = string|run|array|{...}.
  table: (headers, rows, opts) => Object.assign(
    { type: 'table', header: true, zebra: true, rows: [headers].concat(rows || []) }, opts || {}),
  // Tabla sin cabecera (datos crudos).
  rowsTable: (rows, opts) => Object.assign({ type: 'table', header: false, rows: rows || [] }, opts || {}),

  // Tira de KPIs → tabla label/value (label sombreado en negrita). items: [{label, value}].
  kpis: (items) => ({
    type: 'table', header: false, firstColumnShaded: true, widths: [4, 6],
    rows: (items || []).map((it) => [String(it.label), String(it.value)])
  }),

  // Imagen: image('logo.png', {width,height,align,format}) o image({path|data, ...}).
  image: (pathOrOpts, opts) => (typeof pathOrOpts === 'string'
    ? Object.assign({ type: 'image', path: pathOrOpts }, opts || {})
    : Object.assign({ type: 'image' }, pathOrOpts || {})),

  pageBreak: () => ({ type: 'pagebreak' })
};

// ─── XLSX (shared-xlsx-rich) ────────────────────────────────────────────────
const xlsx = {
  // Ensambla el spec final. meta: { title, creator, theme }. sheets = [xlsx.sheet(...)].
  book(meta, sheets) {
    meta = meta || {};
    const spec = { creator: meta.creator || 'Aigent' };
    if (meta.title) spec.title = meta.title;
    if (meta.theme) spec.theme = meta.theme;
    spec.sheets = Array.isArray(sheets) ? sheets : [sheets];
    return spec;
  },
  // Hoja con cabecera de casa por defecto. opts: header, zebra, borders, columns,
  // freeze, merges, image. rows = array de filas (la 1ª es la cabecera si header).
  sheet(name, opts, rows) {
    return Object.assign({ name: String(name), header: true, zebra: true }, opts || {}, { rows: rows || [] });
  },

  // Celdas tipadas (para mezclar con primitivos string/number/bool en una fila).
  cell: (value, opts) => Object.assign({ value: value }, opts || {}),
  money: (value, opts) => Object.assign({ value: value, numFmt: '#,##0.00 €', align: 'right' }, opts || {}),
  pct: (value, opts) => Object.assign({ value: value, numFmt: '0.0%', align: 'right' }, opts || {}),
  date: (value, opts) => Object.assign({ value: value, type: 'date' }, opts || {}),
  formula: (f, cached, opts) => Object.assign({ formula: String(f).replace(/^=/, ''), value: cached }, opts || {})
};

module.exports = { docx, xlsx, flat };
