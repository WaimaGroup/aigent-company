// configure.js — diagnóstico y onboarding de skills v2.
//
// Tres funciones:
//   doctor(skill?)         → reporta estado config + secrets (sin ejecutar nada)
//   configure(skill, sets) → escribe valores en .context/config.json
//   prepareSecrets(skill)  → garantiza placeholders en .context/.secrets.json
//
// Secrets viven en .context/.secrets.json (gitignored vía .context/.gitignore).
// El engine crea .context/, .context/.gitignore y .context/.secrets.json si no existen.

'use strict';

const fs = require('fs');
const path = require('path');

const {
  loadContextConfig,
  resolveProject,
  getByPath,
  GLOBAL_CONFIG,
  CONTEXT_DIR,
} = require('./config');

const SECRETS_PATH = path.join(CONTEXT_DIR, '.secrets.json');
const CONTEXT_GITIGNORE = path.join(CONTEXT_DIR, '.gitignore');

// ── Helpers ───────────────────────────────────────────────────────────────

function setByPath(obj, dotPath, value) {
  const keys = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] === undefined || cur[k] === null || typeof cur[k] !== 'object' || Array.isArray(cur[k])) {
      cur[k] = {};
    }
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

function isPlaceholderValue(val) {
  return typeof val === 'string' && /^<.*>$/.test(val.trim());
}

function isSecretSet(name, fileSecrets) {
  const fromEnv = process.env[name];
  const fromFile = fileSecrets[name];
  let val = fromEnv ?? fromFile;
  if (isPlaceholderValue(val)) val = undefined;
  return val !== undefined && val !== '';
}

function secretSource(name, fileSecrets) {
  if (process.env[name] && !isPlaceholderValue(process.env[name])) return 'env';
  if (fileSecrets[name] && !isPlaceholderValue(fileSecrets[name])) return 'file';
  return null;
}

function coerceValue(raw, type) {
  if (type === 'string' || !type) return { value: String(raw) };
  if (type === 'integer') {
    const n = Number(raw);
    if (!Number.isInteger(n)) return { error: `cannot coerce "${raw}" to integer` };
    return { value: n };
  }
  if (type === 'number') {
    const n = Number(raw);
    if (Number.isNaN(n)) return { error: `cannot coerce "${raw}" to number` };
    return { value: n };
  }
  if (type === 'boolean') {
    const s = String(raw).toLowerCase().trim();
    if (s === 'true') return { value: true };
    if (s === 'false') return { value: false };
    return { error: `cannot coerce "${raw}" to boolean (use "true" or "false")` };
  }
  if (type === 'array') {
    try {
      const v = JSON.parse(raw);
      if (!Array.isArray(v)) return { error: `value "${raw}" is not a JSON array` };
      return { value: v };
    } catch (e) {
      return { error: `value "${raw}" is not valid JSON: ${e.message}` };
    }
  }
  return { error: `unknown type "${type}"` };
}

function readJsonOrDefault(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid JSON in ${filePath}: ${e.message}`);
  }
}

function writeJsonAtomic(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, filePath);
}

/**
 * Garantiza que .context/ exista y tenga .gitignore con .secrets.json dentro.
 * Devuelve { context_created, gitignore_created } para reporting.
 */
function ensureContextWithGitignore() {
  let context_created = false;
  let gitignore_created = false;

  if (!fs.existsSync(CONTEXT_DIR)) {
    fs.mkdirSync(CONTEXT_DIR, { recursive: true });
    context_created = true;
  }

  if (!fs.existsSync(CONTEXT_GITIGNORE)) {
    const content = [
      '# Secretos locales — nunca commiteados',
      '.secrets.json',
      '*.local.json',
      '',
    ].join('\n');
    fs.writeFileSync(CONTEXT_GITIGNORE, content);
    gitignore_created = true;
  } else {
    // Asegurar que .secrets.json está listado si el .gitignore ya existe.
    const current = fs.readFileSync(CONTEXT_GITIGNORE, 'utf8');
    if (!current.split('\n').some(l => l.trim() === '.secrets.json')) {
      fs.appendFileSync(CONTEXT_GITIGNORE, '\n# Secretos locales — nunca commiteados\n.secrets.json\n');
    }
  }

  return { context_created, gitignore_created };
}

// ── doctor ────────────────────────────────────────────────────────────────

function doctorOne(skillObject) {
  const m = skillObject.manifest;
  const declaredConfig = m.config || {};
  const declaredSecrets = m.secrets || [];

  // Config status.
  let raw = {};
  try { raw = loadContextConfig(); } catch { raw = {}; }

  const configStatus = [];
  for (const [key, def] of Object.entries(declaredConfig)) {
    const value = def.path ? getByPath(raw, def.path) : undefined;
    const set = !(value === undefined || value === '' || value === null);
    configStatus.push({
      key,
      path: def.path || null,
      type: def.type || null,
      required: !!def.required,
      set,
      description: def.description || null,
    });
  }

  // Secrets status.
  let fileSecrets = {};
  if (fs.existsSync(SECRETS_PATH)) {
    try { fileSecrets = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8')); }
    catch { fileSecrets = {}; }
  }

  const secretsStatus = [];
  for (const def of declaredSecrets) {
    if (!def.name) continue;
    const set = isSecretSet(def.name, fileSecrets);
    secretsStatus.push({
      name: def.name,
      required: !!def.required,
      set,
      source: set ? secretSource(def.name, fileSecrets) : null,
      description: def.description || null,
    });
  }

  const missingConfig = configStatus.filter(c => c.required && !c.set);
  const missingSecrets = secretsStatus.filter(s => s.required && !s.set);
  const ready = missingConfig.length === 0 && missingSecrets.length === 0;

  return {
    skill: m.name,
    dept: skillObject.dept,
    ready,
    config: configStatus,
    secrets: secretsStatus,
    missing_count: missingConfig.length + missingSecrets.length,
  };
}

function doctor(skillName, allSkills) {
  const usable = allSkills.filter(s => !s.error && s.manifest);

  if (skillName) {
    const found = usable.find(s => s.name === skillName);
    if (!found) {
      return {
        ok: false,
        error: { code: 'SKILL_NOT_FOUND', message: `Skill "${skillName}" not found or has structural errors` },
        meta: {},
      };
    }
    const report = doctorOne(found);
    return {
      ok: true,
      data: { skills: [report] },
      meta: {
        ready: report.ready,
        global_config: GLOBAL_CONFIG,
        secrets_file: SECRETS_PATH,
      },
    };
  }

  const reports = usable.map(doctorOne);
  return {
    ok: true,
    data: { skills: reports },
    meta: {
      total: reports.length,
      ready: reports.filter(r => r.ready).length,
      pending: reports.filter(r => !r.ready).length,
      secrets_file: SECRETS_PATH,
    },
  };
}

// ── configure ─────────────────────────────────────────────────────────────

function configure(skillObject, sets, scope, projectName) {
  // Las skills se configuran normalmente en `.context/config.json` global. Si el
  // agente determina que el valor debe vivir en el config de un proyecto concreto
  // (override puntual, ej. proyecto piloto que usa staging), pasa --scope project
  // y --project <name>.
  if (!Array.isArray(sets) || sets.length === 0) {
    return { ok: false, error: { code: 'BAD_ARGS', message: 'configure requires at least one --set <path>=<value>' }, meta: {} };
  }
  if (scope !== 'global' && scope !== 'project') {
    return { ok: false, error: { code: 'BAD_ARGS', message: `Invalid scope "${scope}", use "global" or "project"` }, meta: {} };
  }

  const m = skillObject.manifest;
  const declared = m.config || {};
  const pathToDef = {};
  for (const [key, def] of Object.entries(declared)) {
    if (def.path) pathToDef[def.path] = { key, ...def };
  }

  const errors = [];
  const coerced = [];
  for (const { path: p, value } of sets) {
    const def = pathToDef[p];
    if (!def) {
      errors.push(`path "${p}" is not declared in skill ${m.name}'s manifest.config (declared: ${Object.keys(pathToDef).join(', ') || 'none'})`);
      continue;
    }
    const c = coerceValue(value, def.type);
    if (c.error) {
      errors.push(`${p}: ${c.error}`);
      continue;
    }
    coerced.push({ path: p, value: c.value, type: def.type });
  }
  if (errors.length) {
    return { ok: false, error: { code: 'INVALID_SET', message: 'one or more --set entries are invalid', details: errors }, meta: {} };
  }

  let target;
  if (scope === 'project') {
    let proj;
    try {
      proj = resolveProject(projectName);
    } catch (e) {
      return {
        ok: false,
        error: {
          code: e.code || 'PROJECT_RESOLVE_ERROR',
          message: e.message,
          details: e.projects ? { available: e.projects } : undefined,
        },
        meta: {},
      };
    }
    if (!proj) {
      return {
        ok: false,
        error: { code: 'NO_PROJECT_AVAILABLE', message: `scope=project requires at least one project folder in ${CONTEXT_DIR}` },
        meta: {},
      };
    }
    target = path.join(CONTEXT_DIR, proj, 'config.json');
  } else {
    target = GLOBAL_CONFIG;
  }

  let data;
  try {
    if (scope === 'global') {
      data = readJsonOrDefault(target, {
        company: { name: '', industry: '', tone: '', audience: '', value_proposition: '' },
        mcps: [],
        tools: {},
        decisions: [],
      });
    } else {
      data = readJsonOrDefault(target, {
        description: '',
        tone_override: '',
        mcps: [],
        tools: {},
        paths: {},
        decisions: [],
      });
    }
  } catch (e) {
    return { ok: false, error: { code: 'CONFIG_READ_ERROR', message: e.message }, meta: {} };
  }

  for (const { path: p, value } of coerced) {
    setByPath(data, p, value);
  }

  try {
    writeJsonAtomic(target, data);
  } catch (e) {
    return { ok: false, error: { code: 'CONFIG_WRITE_ERROR', message: `Could not write ${target}: ${e.message}` }, meta: {} };
  }

  return {
    ok: true,
    data: {
      skill: m.name,
      scope,
      target,
      applied: coerced.map(c => ({ path: c.path, value: c.value, type: c.type })),
    },
    meta: {},
  };
}

// ── prepare-secrets ───────────────────────────────────────────────────────

/**
 * Garantiza que .context/.secrets.json existe (creándolo si no) y contiene un
 * placeholder visible para cada secret declarado en la skill que aún no esté
 * set (ni en env ni con valor real en el fichero).
 *
 * También garantiza que .context/ y .context/.gitignore existan, con .secrets.json
 * en el .gitignore. Nunca acepta valores como input — el usuario los rellena a mano.
 */
function prepareSecrets(skillObject) {
  const m = skillObject.manifest;
  const declared = m.secrets || [];

  // Asegurar .context/ y .context/.gitignore.
  let ensured;
  try {
    ensured = ensureContextWithGitignore();
  } catch (e) {
    return { ok: false, error: { code: 'CONTEXT_PREP_ERROR', message: e.message }, meta: {} };
  }

  // Cargar estado actual del fichero (o {} si no existe).
  let current = {};
  let secrets_file_created = false;
  if (fs.existsSync(SECRETS_PATH)) {
    try { current = JSON.parse(fs.readFileSync(SECRETS_PATH, 'utf8')); }
    catch (e) {
      return { ok: false, error: { code: 'SECRETS_READ_ERROR', message: `Invalid JSON in ${SECRETS_PATH}: ${e.message}` }, meta: {} };
    }
  } else {
    secrets_file_created = true;
  }

  if (declared.length === 0) {
    // Skill sin secrets — sólo asegurar el fichero base si no existe.
    if (secrets_file_created) {
      try { writeJsonAtomic(SECRETS_PATH, current); }
      catch (e) { return { ok: false, error: { code: 'SECRETS_WRITE_ERROR', message: e.message }, meta: {} }; }
    }
    return {
      ok: true,
      data: { skill: m.name, file: SECRETS_PATH, secrets: [], pending: [], file_created: secrets_file_created, ...ensured },
      meta: {},
    };
  }

  const result = [];
  let modified = secrets_file_created;
  for (const def of declared) {
    if (!def.name) continue;
    const set = isSecretSet(def.name, current);
    if (!set) {
      const placeholder = `<replace_me_${def.name}>`;
      if (!current[def.name]) {
        current[def.name] = placeholder;
        modified = true;
      }
      result.push({
        name: def.name,
        required: !!def.required,
        set: false,
        description: def.description || null,
      });
    } else {
      result.push({
        name: def.name,
        required: !!def.required,
        set: true,
        source: secretSource(def.name, current),
        description: def.description || null,
      });
    }
  }

  if (modified) {
    try {
      writeJsonAtomic(SECRETS_PATH, current);
    } catch (e) {
      return { ok: false, error: { code: 'SECRETS_WRITE_ERROR', message: `Could not write ${SECRETS_PATH}: ${e.message}` }, meta: {} };
    }
  }

  const pending = result.filter(s => !s.set);
  return {
    ok: true,
    data: {
      skill: m.name,
      file: SECRETS_PATH,
      secrets: result,
      pending,
      file_created: secrets_file_created,
      ...ensured,
    },
    meta: {
      hint: pending.length > 0
        ? `Edita ${SECRETS_PATH} y reemplaza los placeholders <replace_me_*>. Alternativa: define las variables de entorno correspondientes.`
        : 'Todos los secretos requeridos están configurados.',
    },
  };
}

module.exports = { doctor, configure, prepareSecrets, doctorOne, SECRETS_PATH };
