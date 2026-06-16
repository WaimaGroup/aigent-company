#!/usr/bin/env node
/**
 * shared-logger — registro de trabajo (debug) por proyecto.
 *
 * Escribe un log estructurado en JSON Lines (un evento JSON por línea) bajo
 * `.context/<proyecto>/logger/session-<unixts>.jsonl`. Cada evento documenta un
 * paso del trabajo del sistema: delegaciones, skills ejecutadas, entregables
 * generados, imputaciones, subidas, errores. Sirve como traza auditable que se
 * puede subir tal cual para depurar un flujo.
 *
 * Sin dependencias externas: solo Node stdlib (fs, path). Compatible con Node 18+.
 * Invocación SIEMPRE vía el launcher: `.aigent/IDE/bin/run node <ruta>/logger.cjs ...`
 * (nunca `node` a secas — convenciones §12.7-bis).
 *
 * Subcomandos: init | log | end | export | list
 * Contrato de salida: JSON a stdout. exit 0 si ok:true, exit 1 si ok:false.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Errores
// ---------------------------------------------------------------------------
class LoggerError extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details || undefined;
  }
}

function fail(code, message, details) {
  throw new LoggerError(code, message, details);
}

// ---------------------------------------------------------------------------
// Parseo de argumentos
//   primer positional = comando. Resto: --key value | --flag (booleano)
// ---------------------------------------------------------------------------
const BOOLEAN_FLAGS = new Set(['end', 'help', 'h']);

function parseArgs(argv) {
  const out = { _cmd: null, _flags: {} };
  let i = 0;
  // primer token que no empieza por "--" es el comando
  if (argv[i] && !argv[i].startsWith('--')) {
    out._cmd = argv[i];
    i++;
  }
  for (; i < argv.length; i++) {
    const tok = argv[i];
    if (!tok.startsWith('--')) {
      fail('BAD_ARGS', `Argumento inesperado: "${tok}". Usa --clave valor.`);
    }
    const key = tok.slice(2);
    if (BOOLEAN_FLAGS.has(key)) {
      out._flags[key] = true;
      continue;
    }
    const val = argv[i + 1];
    if (val === undefined || val.startsWith('--')) {
      fail('BAD_ARGS', `Falta el valor para --${key}.`);
    }
    out._flags[key] = val;
    i++;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Resolución de proyecto (conventions §10.1)
// ---------------------------------------------------------------------------
function listProjects(contextDir) {
  if (!fs.existsSync(contextDir)) return [];
  return fs
    .readdirSync(contextDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();
}

function resolveProject(flags, contextDir, { mustExist = true } = {}) {
  const projects = listProjects(contextDir);
  let project = flags.project;

  if (project) {
    const dir = path.join(contextDir, project);
    if (mustExist && !fs.existsSync(dir)) {
      fail(
        'PROJECT_NOT_FOUND',
        `El proyecto "${project}" no existe en ${contextDir}/. ` +
          `Proyectos disponibles: ${projects.length ? projects.join(', ') : '(ninguno)'}.`,
        { project, available: projects }
      );
    }
    return project;
  }

  if (projects.length === 1) return projects[0];
  if (projects.length === 0) {
    fail(
      'NO_PROJECT',
      `No hay proyectos en ${contextDir}/. Crea uno (BOSS lo hace en el bootstrap) ` +
        `o pasa --project <nombre>.`,
      { available: [] }
    );
  }
  fail(
    'NO_PROJECT_SPECIFIED',
    `Hay ${projects.length} proyectos en ${contextDir}/. Indica cuál con --project <nombre>.`,
    { available: projects }
  );
}

// ---------------------------------------------------------------------------
// Rutas y sesiones
// ---------------------------------------------------------------------------
function loggerDir(contextDir, project) {
  return path.join(contextDir, project, 'logger');
}

function ensureLoggerDir(contextDir, project) {
  const dir = loggerDir(contextDir, project);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    fail('WRITE_FAILED', `No se pudo crear ${dir}: ${e.message}`);
  }
  return dir;
}

function sessionFilePath(dir, sessionId) {
  return path.join(dir, `${sessionId}.jsonl`);
}

function listSessionFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^session-\d+\.jsonl$/.test(f))
    .map((f) => path.join(dir, f))
    .sort(); // el nombre incluye el unixts → orden cronológico
}

function latestSessionFile(dir) {
  const files = listSessionFiles(dir);
  return files.length ? files[files.length - 1] : null;
}

// Normaliza --session a una ruta de fichero existente dentro de dir.
// Acepta: "session-123", "123", "session-123.jsonl" o una ruta directa.
function resolveSessionFile(dir, sessionRef) {
  let id = sessionRef;
  if (id.endsWith('.jsonl')) id = path.basename(id, '.jsonl');
  if (/^\d+$/.test(id)) id = `session-${id}`;
  const file = sessionFilePath(dir, id);
  if (!fs.existsSync(file)) {
    fail('SESSION_NOT_FOUND', `No existe la sesión "${sessionRef}" en ${dir}.`, {
      session: sessionRef,
      file,
    });
  }
  return file;
}

function countEvents(file) {
  if (!fs.existsSync(file)) return 0;
  const txt = fs.readFileSync(file, 'utf8');
  if (!txt.trim()) return 0;
  return txt.split('\n').filter((l) => l.trim().length > 0).length;
}

function sessionIdFromFile(file) {
  return path.basename(file, '.jsonl');
}

// ---------------------------------------------------------------------------
// Construcción y escritura de eventos
// ---------------------------------------------------------------------------
const KNOWN_LEVELS = new Set(['debug', 'info', 'warn', 'error']);

function buildEvent(flags, { sessionId, seq, defaultType }) {
  const level = flags.level || 'info';
  if (!KNOWN_LEVELS.has(level)) {
    fail('BAD_ARGS', `--level inválido: "${level}". Usa: debug, info, warn, error.`);
  }

  let data;
  if (flags.data !== undefined) {
    try {
      data = JSON.parse(flags.data);
    } catch (e) {
      fail('BAD_JSON', `--data no es JSON válido: ${e.message}`);
    }
  }

  const ev = {
    ts: new Date().toISOString(),
    session_id: sessionId,
    seq,
    level,
    type: flags.type || defaultType,
  };

  // Campos opcionales: solo se incluyen si vienen.
  const optional = {
    agent: flags.agent,
    task: flags.task,
    action: flags.action,
    skill: flags.skill,
    deliverable: flags.deliverable,
    target: flags.target,
    status: flags.status,
    message: flags.message,
  };
  for (const [k, v] of Object.entries(optional)) {
    if (v !== undefined) ev[k] = v;
  }
  if (data !== undefined) ev.data = data;

  return ev;
}

function appendEvent(file, ev) {
  try {
    fs.appendFileSync(file, JSON.stringify(ev) + '\n', 'utf8');
  } catch (e) {
    fail('WRITE_FAILED', `No se pudo escribir en ${file}: ${e.message}`);
  }
}

// ---------------------------------------------------------------------------
// Comandos
// ---------------------------------------------------------------------------
function cmdInit(flags, contextDir) {
  const project = resolveProject(flags, contextDir);
  const dir = ensureLoggerDir(contextDir, project);

  const ts = Math.floor(Date.now() / 1000);
  const sessionId = `session-${ts}`;
  const file = sessionFilePath(dir, sessionId);

  const ev = buildEvent(flags, { sessionId, seq: 1, defaultType: 'session_start' });
  ev.project = project;
  appendEvent(file, ev);

  return {
    ok: true,
    op: 'init',
    project,
    session_id: sessionId,
    session_file: file,
    seq: 1,
  };
}

function cmdLog(flags, contextDir) {
  const project = resolveProject(flags, contextDir);
  const dir = ensureLoggerDir(contextDir, project);

  let file;
  let autoInited = false;
  if (flags.session) {
    file = resolveSessionFile(dir, flags.session);
  } else {
    file = latestSessionFile(dir);
    if (!file) {
      // No hay sesión abierta → arrancar una implícitamente.
      const ts = Math.floor(Date.now() / 1000);
      file = sessionFilePath(dir, `session-${ts}`);
      const start = {
        ts: new Date().toISOString(),
        session_id: sessionIdFromFile(file),
        seq: 1,
        level: 'info',
        type: 'session_start',
        project,
        message: 'Sesión iniciada automáticamente por el primer log.',
      };
      appendEvent(file, start);
      autoInited = true;
    }
  }

  const sessionId = sessionIdFromFile(file);
  const seq = countEvents(file) + 1;
  const ev = buildEvent(flags, { sessionId, seq, defaultType: 'note' });
  appendEvent(file, ev);

  return {
    ok: true,
    op: 'log',
    project,
    session_id: sessionId,
    session_file: file,
    seq,
    events: seq,
    auto_inited: autoInited,
  };
}

function cmdEnd(flags, contextDir) {
  const project = resolveProject(flags, contextDir);
  const dir = ensureLoggerDir(contextDir, project);

  const file = flags.session
    ? resolveSessionFile(dir, flags.session)
    : latestSessionFile(dir);
  if (!file) fail('NO_SESSION', `No hay ninguna sesión que cerrar en ${dir}.`);

  const sessionId = sessionIdFromFile(file);
  const seq = countEvents(file) + 1;
  const ev = buildEvent(flags, { sessionId, seq, defaultType: 'session_end' });
  appendEvent(file, ev);

  return {
    ok: true,
    op: 'end',
    project,
    session_id: sessionId,
    session_file: file,
    seq,
    events: seq,
  };
}

function cmdExport(flags, contextDir) {
  const project = resolveProject(flags, contextDir);
  const dir = ensureLoggerDir(contextDir, project);

  const file = flags.session
    ? resolveSessionFile(dir, flags.session)
    : latestSessionFile(dir);
  if (!file) fail('NO_SESSION', `No hay ninguna sesión que exportar en ${dir}.`);

  // Opcional: cerrar la sesión antes de exportar.
  if (flags.end) {
    const sId = sessionIdFromFile(file);
    const seqEnd = countEvents(file) + 1;
    const endEv = buildEvent(flags, { sessionId: sId, seq: seqEnd, defaultType: 'session_end' });
    appendEvent(file, endEv);
  }

  const sessionId = sessionIdFromFile(file);
  const raw = fs.readFileSync(file, 'utf8');
  const events = [];
  raw.split('\n').forEach((line, idx) => {
    const t = line.trim();
    if (!t) return;
    try {
      events.push(JSON.parse(t));
    } catch (e) {
      fail('BAD_JSON', `Línea ${idx + 1} del log no es JSON válido: ${e.message}`, {
        file,
        line: idx + 1,
      });
    }
  });

  const out =
    flags.out || path.join(dir, `${sessionId}.json`);
  try {
    fs.writeFileSync(out, JSON.stringify(events, null, 2) + '\n', 'utf8');
  } catch (e) {
    fail('WRITE_FAILED', `No se pudo escribir ${out}: ${e.message}`);
  }

  return {
    ok: true,
    op: 'export',
    project,
    session_id: sessionId,
    source: file,
    export_file: out,
    events: events.length,
  };
}

function cmdList(flags, contextDir) {
  const project = resolveProject(flags, contextDir);
  const dir = loggerDir(contextDir, project);
  const files = listSessionFiles(dir);

  const sessions = files.map((f) => {
    let started = null;
    try {
      const first = fs.readFileSync(f, 'utf8').split('\n').find((l) => l.trim());
      if (first) started = JSON.parse(first).ts || null;
    } catch (_) {
      /* tolerante */
    }
    let modified = null;
    try {
      modified = fs.statSync(f).mtime.toISOString();
    } catch (_) {
      /* tolerante */
    }
    return {
      session_id: sessionIdFromFile(f),
      file: f,
      events: countEvents(f),
      started,
      modified,
    };
  });

  return { ok: true, op: 'list', project, sessions };
}

// ---------------------------------------------------------------------------
// Ayuda
// ---------------------------------------------------------------------------
const HELP = `shared-logger — registro de trabajo (debug) por proyecto

USO
  .aigent/IDE/bin/run node .aigent/departments/_shared/skills/shared-logger/logger.cjs <comando> [opciones]

COMANDOS
  init      Inicia una sesión nueva (escribe un evento session_start). Devuelve session_id.
  log       Anexa un evento a la sesión actual (o a --session). Si no hay sesión, crea una.
  end       Anexa un evento session_end a la sesión.
  export    Consolida la sesión .jsonl en un único .json (array) listo para subir. --end lo cierra antes.
  list      Lista las sesiones del proyecto con su nº de eventos.

OPCIONES COMUNES
  --project <nombre>     Proyecto en .context/. Si solo hay 1, se autodetecta.
  --session <id>         Sesión objetivo (ej. session-1717581600, 1717581600 o el .jsonl). Default: la más reciente.
  --context-dir <ruta>   Raíz del árbol .context/ (default: ".context").

CAMPOS DEL EVENTO (todos opcionales salvo --type por defecto)
  --type <t>          session_start | session_end | task | delegation | skill | deliverable | upload | imputation | error | note
  --level <l>         debug | info | warn | error   (default: info)
  --agent <a>         Quién produce el evento (ej. marketing-orchestrator).
  --task <t>          Id o descripción de la tarea (ej. MKT-007).
  --action <a>        Acción concreta (ej. delegate, run, write, upload).
  --skill <s>         Skill implicada (ej. marketing-copy, operations-redmine).
  --deliverable <p>   Ruta del entregable generado.
  --target <t>        Sistema destino al imputar/subir (ej. redmine, drive).
  --status <s>        ok | error | pending | ...
  --message <m>       Texto libre.
  --data <json>       Objeto JSON arbitrario (payload estructurado).

EXPORT
  --out <ruta>        Ruta del .json de salida (default: <logger>/<session-id>.json).
  --end               Escribe session_end antes de exportar.

SALIDA
  JSON a stdout. exit 0 si ok:true; exit 1 y stderr "[ERROR CODE] msg" si ok:false.
`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const flags = parseArgs(process.argv.slice(2)) ;
  const f = flags._flags;

  if (f.help || f.h || flags._cmd === 'help' || !flags._cmd) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  const contextDir = f['context-dir'] || '.context';

  const handlers = {
    init: cmdInit,
    log: cmdLog,
    end: cmdEnd,
    export: cmdExport,
    list: cmdList,
  };

  const handler = handlers[flags._cmd];
  if (!handler) {
    fail('BAD_ARGS', `Comando desconocido: "${flags._cmd}". Usa init | log | end | export | list.`);
  }

  const result = handler(f, contextDir);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exit(0);
}

try {
  main();
} catch (e) {
  if (e instanceof LoggerError) {
    const payload = { ok: false, error: { code: e.code, message: e.message } };
    if (e.details) payload.error.details = e.details;
    process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
    process.stderr.write(`[ERROR ${e.code}] ${e.message}\n`);
    process.exit(1);
  }
  process.stdout.write(
    JSON.stringify({ ok: false, error: { code: 'INTERNAL', message: e.message } }, null, 2) + '\n'
  );
  process.stderr.write(`[ERROR INTERNAL] ${e.stack || e.message}\n`);
  process.exit(1);
}
