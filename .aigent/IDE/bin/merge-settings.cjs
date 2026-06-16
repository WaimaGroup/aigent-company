#!/usr/bin/env node
// =============================================================================
// merge-settings.cjs — fusiona la plantilla de permisos en el fichero del IDE
// SIN pisar lo que el usuario ya tenga. Format-aware: soporta los DOS IDEs.
//
// Uso:  run merge-settings.cjs <template.json> <dest.json>
//
//   · Si <dest> no existe → copia la plantilla tal cual.
//   · Si existe → fusión NO destructiva según el formato detectado:
//       - Claude  (.claude/settings.local.json): UNIÓN de
//         permissions.allow / .ask / .deny (conserva las del usuario, añade las
//         que falten de la plantilla; dedup, sin reordenar).
//       - OpenCode (opencode.json): añade las claves de permission.bash que
//         falten conservando las del usuario y su valor; mantiene el catch-all
//         "*" SIEMPRE el último; fija permission.edit/webfetch si faltan; NO
//         toca mcp / model / $schema ni otras claves del usuario.
//   · Si <dest> existe pero no es JSON válido → no se toca (exit 1).
//
// Hace un .bak antes de escribir si hay cambios. Idempotente.
// Salida: JSON a stdout { ok, action, format, added, backup? }.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');

function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return null; } }
function fail(msg) { process.stdout.write(JSON.stringify({ ok: false, error: msg }) + '\n'); process.stderr.write('[merge-settings] ' + msg + '\n'); process.exit(1); }

function detectFormat(obj) {
  if (obj && obj.permission && typeof obj.permission === 'object' && obj.permission.bash) return 'opencode';
  if (obj && obj.permissions && typeof obj.permissions === 'object') return 'claude';
  return 'unknown';
}

// Claude: unión de arrays allow/ask/deny.
function mergeClaude(dst, tpl) {
  dst.permissions = dst.permissions || {};
  const added = {};
  let changed = false;
  for (const key of ['allow', 'ask', 'deny']) {
    const tArr = (tpl.permissions && tpl.permissions[key]) || [];
    const dArr = Array.isArray(dst.permissions[key]) ? dst.permissions[key] : [];
    const seen = new Set(dArr);
    const missing = tArr.filter((x) => !seen.has(x));
    if (missing.length) { dst.permissions[key] = dArr.concat(missing); changed = true; }
    added[key] = missing.length;
  }
  return { changed, added };
}

// OpenCode: merge del mapa permission.bash (catch-all "*" siempre el último) +
// edit/webfetch si faltan; el resto del fichero (mcp, model, …) intacto.
function mergeOpencode(dst, tpl) {
  dst.permission = dst.permission || {};
  const tp = tpl.permission || {};
  const added = { bash: 0 };
  let changed = false;

  for (const k of ['edit', 'webfetch']) {
    if (dst.permission[k] === undefined && tp[k] !== undefined) { dst.permission[k] = tp[k]; changed = true; }
  }

  const tBash = tp.bash || {};
  const dBash = (dst.permission.bash && typeof dst.permission.bash === 'object') ? dst.permission.bash : {};
  const star = Object.prototype.hasOwnProperty.call(dBash, '*') ? dBash['*'] : tBash['*'];
  const merged = {};
  for (const k of Object.keys(dBash)) if (k !== '*') merged[k] = dBash[k];   // conserva las del usuario (clave y valor)
  for (const k of Object.keys(tBash)) {
    if (k !== '*' && !Object.prototype.hasOwnProperty.call(merged, k)) { merged[k] = tBash[k]; added.bash++; changed = true; }
  }
  if (star !== undefined) merged['*'] = star;                                 // catch-all al final
  dst.permission.bash = merged;
  return { changed, added };
}

const tplPath = process.argv[2];
const destPath = process.argv[3];
if (!tplPath || !destPath) { process.stderr.write('uso: merge-settings.cjs <template.json> <dest.json>\n'); process.exit(2); }

const tpl = readJson(tplPath);
if (!tpl) fail('plantilla ilegible o no es JSON: ' + tplPath);
const format = detectFormat(tpl);
if (format === 'unknown') fail('formato de plantilla no reconocido (ni Claude ni OpenCode): ' + tplPath);

// dest no existe → copiar la plantilla
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, JSON.stringify(tpl, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ ok: true, action: 'created', format }) + '\n');
  process.exit(0);
}

const dst = readJson(destPath);
if (!dst) fail('el destino existe pero no es JSON válido (no se toca): ' + destPath);

const res = format === 'opencode' ? mergeOpencode(dst, tpl) : mergeClaude(dst, tpl);

if (!res.changed) {
  process.stdout.write(JSON.stringify({ ok: true, action: 'up-to-date', format, added: res.added }) + '\n');
  process.exit(0);
}

fs.copyFileSync(destPath, destPath + '.bak');
fs.writeFileSync(destPath, JSON.stringify(dst, null, 2) + '\n');
process.stdout.write(JSON.stringify({ ok: true, action: 'merged', format, added: res.added, backup: destPath + '.bak' }) + '\n');
