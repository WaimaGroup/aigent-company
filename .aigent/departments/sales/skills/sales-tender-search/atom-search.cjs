#!/usr/bin/env node
/**
 * sales-tender-search/atom-search.cjs
 * Buscador genérico sobre feeds ATOM. Núcleo reutilizable: descarga (o lee de
 * disco) un feed .atom, sigue la paginación rel="next", aplica una ventana de
 * fechas sobre <updated>, y delega la extracción a un "perfil" enchufable.
 * Perfil inicial: placsp-codice (Contratación del Estado — CODICE/UBL).
 * Fuente de verdad = este script. Sin dependencias. Node 18+ (fetch global).
 */
'use strict';
const fs = require('fs');

const PROFILES = {
  'placsp-codice': {
    label: 'PLACSP (Contratación del Estado) — CODICE/UBL',
    extract: extractPlacsp,
    defaultEstados: ['PUB'],
  },
};

function firstText(scope, tag) {
  if (!scope) return null;
  const m = scope.match(new RegExp('<' + tag + '\\b[^>]*>([\\s\\S]*?)<\\/' + tag + '>'));
  return m ? decodeEntities(m[1].trim()) : null;
}
function allText(scope, tag) {
  if (!scope) return [];
  const re = new RegExp('<' + tag + '\\b[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'g');
  const out = []; let m;
  while ((m = re.exec(scope)) !== null) out.push(decodeEntities(m[1].trim()));
  return out;
}
function subtree(scope, tag) {
  if (!scope) return '';
  const open = scope.search(new RegExp('<' + tag + '\\b'));
  if (open < 0) return '';
  const close = scope.indexOf('</' + tag + '>', open);
  if (close < 0) return '';
  return scope.slice(open, close + ('</' + tag + '>').length);
}
function attr(scope, tag, attrName) {
  if (!scope) return null;
  const m = scope.match(new RegExp('<' + tag + '\\b[^>]*\\b' + attrName + '="([^"]*)"'));
  return m ? m[1] : null;
}
function decodeEntities(s) {
  if (s == null) return s;
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

function extractPlacsp(entry) {
  const cfs = subtree(entry, 'cac-place-ext:ContractFolderStatus') || entry;
  const pp = subtree(cfs, 'cac:ProcurementProject');
  const lcp = subtree(cfs, 'cac-place-ext:LocatedContractingParty');
  const ba = subtree(pp, 'cac:BudgetAmount');
  const deadline = subtree(cfs, 'cac:TenderSubmissionDeadlinePeriod');
  const cpv = dedupe(allText(cfs, 'cbc:ItemClassificationCode'));
  const documentos = extractDocs(cfs);
  return {
    expediente: firstText(cfs, 'cbc:ContractFolderID'),
    objeto: firstText(pp, 'cbc:Name'),
    tipoContrato: firstText(pp, 'cbc:TypeCode'),
    organo: firstText(subtree(lcp, 'cac:PartyName'), 'cbc:Name'),
    cpv,
    presupuesto: numOrNull(firstText(ba, 'cbc:TotalAmount')),
    presupuestoSinIva: numOrNull(firstText(ba, 'cbc:TaxExclusiveAmount')),
    valorEstimado: numOrNull(firstText(ba, 'cbc:EstimatedOverallContractAmount')),
    moneda: attr(ba, 'cbc:TotalAmount', 'currencyID') || 'EUR',
    estado: firstText(cfs, 'cbc-place-ext:ContractFolderStatusCode'),
    lugar: firstText(subtree(cfs, 'cac:RealizedLocation'), 'cbc:CountrySubentity'),
    fechaLimite: firstText(deadline, 'cbc:EndDate'),
    horaLimite: firstText(deadline, 'cbc:EndTime'),
    documentos,
  };
}
function extractDocs(scope) {
  const docs = []; const seen = new Set();
  const re = /<((?:cac|cac-place-ext):[A-Za-z]*DocumentReference)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(scope)) !== null) {
    const ext = subtree(m[2], 'cac:ExternalReference');
    const uri = firstText(ext, 'cbc:URI');
    if (!uri || seen.has(uri)) continue;
    seen.add(uri);
    docs.push({
      tipo: m[1].split(':').pop().replace(/DocumentReference$/, '') || 'Documento',
      titulo: firstText(ext, 'cbc:FileName') || firstText(m[2], 'cbc:ID') || null,
      url: uri,
    });
  }
  return docs;
}

function dedupe(arr) { return Array.from(new Set(arr.filter(Boolean))); }
function numOrNull(s) {
  if (s == null || s === '') return null;
  const n = Number(s); return Number.isFinite(n) ? n : s;
}
function isoDate(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}
function todayISO() { return daysAgoISO(0); }
function daysAgoISO(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  const p = (x) => String(x).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
function cpvMatches(codes, filters) {
  if (!filters || !filters.length) return true;
  return filters.some((f) => codes.some((c) => f.endsWith('*') ? c.indexOf(f.slice(0, -1)) === 0 : c === f));
}

async function loadPage({ url, file, timeoutMs }) {
  if (file) return { text: fs.readFileSync(file, 'utf8'), source: file };
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ac.signal, headers: { Accept: 'application/atom+xml, application/xml, text/xml' } });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    return { text: buf.toString('utf8'), source: url };
  } finally { clearTimeout(to); }
}
function findNextLink(text) {
  let m = text.match(/<link\b[^>]*\brel="next"[^>]*\bhref="([^"]+)"/);
  if (m) return decodeEntities(m[1]);
  m = text.match(/<link\b[^>]*\bhref="([^"]+)"[^>]*\brel="next"/);
  return m ? decodeEntities(m[1]) : null;
}
function splitEntries(text) { return text.match(/<entry\b[\s\S]*?<\/entry>/g) || []; }
function entryUpdated(entry) { return isoDate(firstText(entry, 'updated')); }
function entryLink(entry) {
  const m = entry.match(/<link\b[^>]*\bhref="([^"]+)"/);
  return m ? decodeEntities(m[1]) : null;
}
function clampInt(v, min, max, def) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}
function err(code, message) { const e = new Error(message); e.code = code; return e; }

async function run(inputs) {
  const profileKey = inputs.profile || 'placsp-codice';
  const profile = PROFILES[profileKey];
  if (!profile) throw err('BAD_ARGS', 'Perfil desconocido: ' + profileKey + '. Disponibles: ' + Object.keys(PROFILES).join(', '));

  const today = todayISO();
  const dateFrom = isoDate(inputs.dateFrom) || daysAgoISO(7);
  const dateTo = isoDate(inputs.dateTo) || today;
  const maxPages = clampInt(inputs.maxPages, 1, 50, 3);
  const limit = clampInt(inputs.limit, 1, 500, 20);
  const timeoutMs = clampInt(inputs.timeoutMs, 1000, 120000, 30000);
  const quiet = inputs.quiet === true;
  const log = (m) => { if (!quiet) process.stderr.write('[atom-search] ' + m + '\n'); };

  const filters = inputs.filters || {};
  const cpvFilter = Array.isArray(filters.cpv) ? filters.cpv : [];
  const estados = Array.isArray(filters.estado) ? filters.estado : profile.defaultEstados;
  const minDeadline = filters.minDeadline === null ? null : (isoDate(filters.minDeadline) || today);

  const results = [];
  let scanned = 0, matchedTotal = 0, pagesFetched = 0, truncated = false;
  let url = inputs.feedUrl || null;
  const file = inputs.file || null;
  if (!url && !file) throw err('BAD_ARGS', 'Falta `feedUrl` o `file` en inputs.');

  while (pagesFetched < maxPages) {
    log('descargando página ' + (pagesFetched + 1) + '/' + maxPages + (file ? ' (local)' : '') + '…');
    const t0 = Date.now();
    const { text } = await loadPage({ url, file, timeoutMs });
    pagesFetched++;
    const entries = splitEntries(text);
    let pageOldest = null;
    for (const entry of entries) {
      scanned++;
      const upd = entryUpdated(entry);
      if (upd && (pageOldest === null || upd < pageOldest)) pageOldest = upd;
      if (upd && (upd < dateFrom || upd > dateTo)) continue;
      const data = profile.extract(entry);
      if (!cpvMatches(data.cpv || [], cpvFilter)) continue;
      if (estados && estados.length && estados.indexOf(data.estado) < 0) continue;
      if (minDeadline && (!data.fechaLimite || isoDate(data.fechaLimite) < minDeadline)) continue;
      matchedTotal++;
      if (results.length < limit) results.push(Object.assign({}, data, { fechaPublicacion: upd, enlace: entryLink(entry) }));
      else truncated = true;
    }
    log('página ' + pagesFetched + ': ' + (text.length / 1048576).toFixed(1) + ' MB · ' + entries.length + ' entradas · ' + ((Date.now() - t0) / 1000).toFixed(1) + 's · ' + matchedTotal + ' coincidencias acumuladas');
    if (file) break;
    if (results.length >= limit) break;
    const next = findNextLink(text);
    if (!next) break;
    if (pageOldest && pageOldest < dateFrom) break;
    url = next;
  }

  return {
    ok: true,
    query: { profile: profileKey, dateFrom, dateTo, maxPages, limit, filters: { cpv: cpvFilter, estado: estados, minDeadline }, source: file ? { file } : { feedUrl: inputs.feedUrl } },
    pagesFetched, scannedEntries: scanned, matchedTotal, returned: results.length,
    truncated: truncated || matchedTotal > results.length,
    results,
  };
}

function parseCli(argv) {
  const out = { inputs: {}, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--inputs') {
      try { out.inputs = JSON.parse(argv[++i]); }
      catch (e) { throw err('BAD_ARGS', '`--inputs` no es JSON válido: ' + e.message); }
    } else if (a === '--file') out.file = argv[++i];
    else throw err('BAD_ARGS', 'Argumento desconocido: ' + a);
  }
  return out;
}

const HELP = [
  'atom-search.cjs — buscador genérico sobre feeds ATOM (perfil PLACSP/CODICE)',
  '',
  'Uso:',
  "  node atom-search.cjs --inputs '<json>'",
  '  node atom-search.cjs --file <ruta.atom> --inputs \'<json>\'',
  '',
  'Campos de --inputs: feedUrl | file | profile(placsp-codice) | dateFrom(def hoy-7) |',
  'dateTo(def hoy) | maxPages(def 3) | limit(def 20) | quiet(def false) |',
  'filters.cpv (["722*","48000000"]) | filters.estado (def ["PUB"]) | filters.minDeadline (def hoy, null desactiva)',
  '',
  'Progreso por stderr. Salida JSON por stdout. exit 0 ok / 1 error.',
  '',
].join('\n');

async function main() {
  let cli;
  try { cli = parseCli(process.argv.slice(2)); } catch (e) { return fail(e); }
  if (cli.help) { process.stdout.write(HELP); process.exit(0); }
  const inputs = Object.assign({}, cli.inputs);
  if (cli.file) inputs.file = cli.file;
  try {
    const result = await run(inputs);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(0);
  } catch (e) { return fail(e); }
}
function fail(e) {
  const code = e.code || (e.message && e.message.startsWith('HTTP_') ? e.message : 'INTERNAL');
  process.stdout.write(JSON.stringify({ ok: false, error: { code, message: e.message } }, null, 2) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + e.message + '\n');
  process.exit(1);
}
main();
