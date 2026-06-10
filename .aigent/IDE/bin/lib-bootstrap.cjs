#!/usr/bin/env node
// =============================================================================
// Aigent — bootstrap de dependencias para SKILLS HÍBRIDAS (fuente única)
//
// Toda skill híbrida (las que usan una librería npm en vez de ser cero-deps)
// DEBE obtener su librería a través de este módulo, nunca con su propio bloque
// copiado. Así el contrato es idéntico para todas: misma caché, mismos códigos
// de error, misma resolución de npm. Si hay que cambiar el mecanismo, se cambia
// AQUÍ y todas las skills lo heredan.
//
// Contrato para el script caller:
//   const path = require('path');
//   const BOOT = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'lib-bootstrap.cjs');
//   const { ensureDep } = require(BOOT);
//   const { module: LIB, installed, cache, via } = ensureDep(
//     { name: 'docx', version: '9.7.1' },
//     { autoInstall: true, skillRef: '.aigent/.../mi-skill/mi.cjs' }
//   );
//
// Reglas (ver conventions.md §16):
//   · Las librerías viven en  .context/libs/node_modules/  (caché compartida,
//     gitignored, basada en process.cwd() = raíz del proyecto donde vive .context/).
//   · El script de la skill NO se copia ahí: vive en su carpeta y se ejecuta in situ;
//     sólo hace require() de la librería por ruta absoluta a la caché.
//   · npm preferido: el bundled junto al Node del launcher
//     (.aigent/IDE/bin/deps/node_modules/npm); si no, el del sistema.
//   · Versión SIEMPRE fijada (pin) por el caller en `dep.version` → reproducibilidad.
//
// En error de dependencia emite el JSON de contrato y sale con exit 1 (mismos
// códigos para todas las skills): DEP_MISSING | DEP_UNAVAILABLE | DEP_INSTALL_FAILED.
// =============================================================================
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function contextDir() { return path.join(process.cwd(), '.context'); }
function libCacheDir() { return path.join(contextDir(), 'libs'); }

function emitDepError(code, message, details) {
  const err = { code, message };
  if (details) err.details = details;
  process.stdout.write(JSON.stringify({ ok: false, error: err }) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + message + '\n');
  process.exit(1);
}

// Node bundled junto al launcher (node en unix/mac, node.exe en win).
function bundledNode() {
  for (const c of [path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'deps', 'node'),
                   path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'deps', 'node.exe')]) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// npm bundled (node + npm-cli.js del runtime) tiene prioridad; si no, npm del
// sistema; si ninguno, null (no hay forma de instalar).
function resolveNpm() {
  const node = bundledNode();
  const cli = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'deps', 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (node && fs.existsSync(cli)) {
    return { kind: 'bundled', run: (a) => execFileSync(node, [cli].concat(a), { stdio: ['ignore', 'ignore', 'pipe'] }) };
  }
  const sys = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try { execFileSync(sys, ['--version'], { stdio: 'ignore' }); } catch (_) { return null; }
  return { kind: 'system', run: (a) => execFileSync(sys, a, { stdio: ['ignore', 'ignore', 'pipe'] }) };
}

// Garantiza que .context/.gitignore ignora libs/ (las librerías no se commitean).
function ensureContextGitignore() {
  try {
    fs.mkdirSync(contextDir(), { recursive: true });
    const gi = path.join(contextDir(), '.gitignore');
    const cur = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : '';
    if (!cur.split(/\r?\n/).some((l) => l.trim() === 'libs/' || l.trim() === '/libs/')) {
      fs.writeFileSync(gi, cur + (cur && !cur.endsWith('\n') ? '\n' : '') + 'libs/\n');
    }
  } catch (_) { /* best-effort; no bloquea la instalación */ }
}

// Asegura que `dep` ({name, version}) está disponible y lo devuelve.
//   opts.autoInstall (default true) — si false y falta, DEP_MISSING.
//   opts.skillRef — ruta del script caller, para el hint de DEP_MISSING.
// Devuelve { module, installed, cache, via }.
function ensureDep(dep, opts) {
  opts = opts || {};
  const autoInstall = opts.autoInstall !== false;
  if (!dep || !dep.name || !dep.version) emitDepError('DEP_MISSING', 'ensureDep requiere { name, version } con versión fijada (pin).');
  const cache = libCacheDir();
  const modPath = path.join(cache, 'node_modules', dep.name);

  if (fs.existsSync(modPath)) return { module: require(modPath), installed: false, cache, via: null };

  if (!autoInstall) {
    const hint = opts.skillRef ? '.aigent/IDE/bin/run ' + opts.skillRef + ' deps' : 'instalar la dependencia';
    emitDepError('DEP_MISSING', 'La librería `' + dep.name + '` no está en la caché (.context/libs) y --no-install impide instalarla.',
      { dependency: dep, cache_dir: cache, next: [hint] });
  }

  const npm = resolveNpm();
  if (!npm) emitDepError('DEP_UNAVAILABLE',
    'No hay npm disponible (ni bundled en .aigent/IDE/bin/deps/ ni en el sistema); no se puede instalar `' + dep.name + '`. ' +
    'El launcher garantiza Node, no npm. Conserva npm en el runtime bundled (instalador) o pre-puebla .context/libs/.',
    { dependency: dep, cache_dir: cache, next: ['npm install ' + dep.name + '@' + dep.version + ' --prefix "' + cache + '"'] });

  ensureContextGitignore();
  fs.mkdirSync(cache, { recursive: true });
  try {
    npm.run(['install', dep.name + '@' + dep.version, '--prefix', cache, '--no-audit', '--no-fund', '--silent']);
  } catch (e) {
    emitDepError('DEP_INSTALL_FAILED', 'Fallo instalando `' + dep.name + '` (' + npm.kind + '): ' + (e.stderr ? e.stderr.toString().slice(-400) : e.message),
      { dependency: dep, cache_dir: cache });
  }
  if (!fs.existsSync(modPath)) emitDepError('DEP_INSTALL_FAILED', 'Instalación reportada pero el módulo no aparece.', { dependency: dep, cache_dir: cache });
  return { module: require(modPath), installed: true, cache, via: npm.kind };
}

module.exports = { contextDir, libCacheDir, resolveNpm, ensureContextGitignore, ensureDep };
