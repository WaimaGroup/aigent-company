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
//   · Resolución de npm SYSTEM-FIRST (coherente con el launcher `run`): primero
//     el npm del sistema (PATH); si no hay, el bundled junto al Node del launcher
//     (.aigent/IDE/bin/deps/node_modules/npm). El launcher `run` es la fuente
//     canónica de resolución de runtime; este helper espeja el MISMO algoritmo
//     en proceso (execFileSync directo, sin shell) por seguridad cross-platform:
//     lanzar un .cmd desde Node con rutas que llevan espacios es frágil en Windows.
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

// SYSTEM-FIRST: el npm del sistema tiene prioridad; si no hay, el bundled (node +
// npm-cli.js del runtime); si ninguno, null (no hay forma de instalar).
function resolveNpm() {
  const sys = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  try {
    execFileSync(sys, ['--version'], { stdio: 'ignore' });
    return { kind: 'system', run: (a) => execFileSync(sys, a, { stdio: ['ignore', 'ignore', 'pipe'] }) };
  } catch (_) { /* sin npm en el sistema → probar bundled */ }
  const node = bundledNode();
  const cli = path.join(process.cwd(), '.aigent', 'IDE', 'bin', 'deps', 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (node && fs.existsSync(cli)) {
    return { kind: 'bundled', run: (a) => execFileSync(node, [cli].concat(a), { stdio: ['ignore', 'ignore', 'pipe'] }) };
  }
  return null;
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

// Lee la versión instalada de un módulo de la caché (o null si no hay/ilegible).
function installedVersion(modPath) {
  try { return JSON.parse(fs.readFileSync(path.join(modPath, 'package.json'), 'utf8')).version || null; }
  catch (_) { return null; }
}
// require() defensivo: devuelve el módulo o null si la carga falla (build roto).
function tryRequire(modPath) {
  try { return require(modPath); } catch (_) { return null; }
}

// Asegura que `dep` ({name, version}) está disponible EN LA VERSIÓN DEL PIN y la
// devuelve. La detección es robusta (no basta con que exista la carpeta):
//   1) package.json presente, 2) versión == pin, 3) el módulo carga de verdad.
// Si la caché tiene una versión distinta, parcial o rota → (re)instala el pin.
//   opts.autoInstall (default true) — si false y no está usable, DEP_MISSING.
//   opts.skillRef — ruta del script caller, para el hint de DEP_MISSING.
// Devuelve { module, installed, cache, via }.
function ensureDep(dep, opts) {
  opts = opts || {};
  const autoInstall = opts.autoInstall !== false;
  if (!dep || !dep.name || !dep.version) emitDepError('DEP_MISSING', 'ensureDep requiere { name, version } con versión fijada (pin).');
  const cache = libCacheDir();
  const modPath = path.join(cache, 'node_modules', dep.name);

  // ── ¿ya está usable? (presente + versión del pin + cargable) ──────────────
  const present = installedVersion(modPath);
  if (present === dep.version) {
    const mod = tryRequire(modPath);
    if (mod) return { module: mod, installed: false, cache, via: null };
    // versión correcta pero no carga → caché corrupta; cae a reinstalar
  }

  if (!autoInstall) {
    const why = present === null
      ? 'no está en la caché (.context/libs) o está incompleta'
      : 'tiene la versión ' + present + ' (≠ pin ' + dep.version + ')';
    const hint = opts.skillRef ? '.aigent/IDE/bin/run node ' + opts.skillRef + ' deps' : 'instalar la dependencia';
    emitDepError('DEP_MISSING', 'La librería `' + dep.name + '` ' + why + ', y --no-install impide instalarla.',
      { dependency: dep, installed_version: present, cache_dir: cache, next: [hint] });
  }

  const npm = resolveNpm();
  if (!npm) emitDepError('DEP_UNAVAILABLE',
    'No hay npm disponible (ni bundled en .aigent/IDE/bin/deps/ ni en el sistema); no se puede instalar `' + dep.name + '`. ' +
    'El launcher garantiza Node, no npm. Conserva npm en el runtime bundled (instalador) o pre-puebla .context/libs/.',
    { dependency: dep, cache_dir: cache, next: ['npm install ' + dep.name + '@' + dep.version + ' --prefix "' + cache + '"'] });

  // ── (re)instalar exactamente el pin ───────────────────────────────────────
  ensureContextGitignore();
  fs.mkdirSync(cache, { recursive: true });
  try {
    // install <name>@<version> sobreescribe lo que hubiera (versión vieja/parcial)
    npm.run(['install', dep.name + '@' + dep.version, '--prefix', cache, '--no-audit', '--no-fund', '--silent']);
  } catch (e) {
    emitDepError('DEP_INSTALL_FAILED', 'Fallo instalando `' + dep.name + '@' + dep.version + '` (' + npm.kind + '): ' + (e.stderr ? e.stderr.toString().slice(-400) : e.message),
      { dependency: dep, cache_dir: cache });
  }

  // ── verificar el resultado: versión correcta Y cargable ──────────────────
  const after = installedVersion(modPath);
  if (after !== dep.version) {
    emitDepError('DEP_INSTALL_FAILED', 'Tras instalar, la versión en caché es ' + (after || 'desconocida') + ' (esperaba ' + dep.version + ').',
      { dependency: dep, installed_version: after, cache_dir: cache });
  }
  const mod = tryRequire(modPath);
  if (!mod) emitDepError('DEP_INSTALL_FAILED', 'Instalado `' + dep.name + '@' + dep.version + '` pero el módulo no carga (posible build roto en esa versión; prueba otro pin).',
    { dependency: dep, cache_dir: cache });
  return { module: mod, installed: true, cache, via: npm.kind };
}

module.exports = { contextDir, libCacheDir, resolveNpm, ensureContextGitignore, ensureDep, installedVersion };
