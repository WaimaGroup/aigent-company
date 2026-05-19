// config.js — carga de configuración (.context/) y resolución de secretos.
//
// Modelo: la estructura de `.context/` es la fuente de verdad. Cada carpeta
// directa dentro de `.context/` (que no empiece por `.`) es un proyecto.
// El proyecto a usar se especifica con el parámetro `projectName` (que el
// engine recibe vía --project <name>). Si no se pasa:
//   - 0 proyectos → solo se usa el config global.
//   - 1 proyecto → autodetectado.
//   - >1 proyectos → error NO_PROJECT_SPECIFIED.

'use strict';

const fs = require('fs');
const path = require('path');

const V2_ROOT = path.resolve(__dirname, '..');
const AIGENT_ROOT = path.resolve(V2_ROOT, '..');
const PROJECT_ROOT = path.resolve(AIGENT_ROOT, '..');
const CONTEXT_DIR = path.join(PROJECT_ROOT, '.context');
const GLOBAL_CONFIG = path.join(CONTEXT_DIR, 'config.json');

/**
 * Lista los proyectos en `.context/`: carpetas directas que no empiezan por `.`.
 */
function listProjects() {
  if (!fs.existsSync(CONTEXT_DIR)) return [];
  return fs.readdirSync(CONTEXT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
}

/**
 * Resuelve el proyecto activo según la regla del modelo:
 *  - Si `projectName` se pasa explícitamente, valida que exista y lo devuelve.
 *  - Si no, autodetecta: 0 → null, 1 → ese, >1 → throw con NO_PROJECT_SPECIFIED.
 */
function resolveProject(projectName) {
  const projects = listProjects();
  if (projectName) {
    if (!projects.includes(projectName)) {
      const err = new Error(
        `Project "${projectName}" not found in ${CONTEXT_DIR}. ` +
        `Available: ${projects.length ? projects.join(', ') : '(none)'}.`
      );
      err.code = 'PROJECT_NOT_FOUND';
      throw err;
    }
    return projectName;
  }
  if (projects.length === 0) return null;
  if (projects.length === 1) return projects[0];
  const err = new Error(
    `Multiple projects exist in ${CONTEXT_DIR} (${projects.join(', ')}). ` +
    `Pass --project <name> to disambiguate.`
  );
  err.code = 'NO_PROJECT_SPECIFIED';
  err.projects = projects;
  throw err;
}

function loadContextConfig(projectName) {
  if (!fs.existsSync(GLOBAL_CONFIG)) {
    throw new Error(`Config not found: ${GLOBAL_CONFIG}`);
  }
  let global;
  try {
    global = JSON.parse(fs.readFileSync(GLOBAL_CONFIG, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid JSON in ${GLOBAL_CONFIG}: ${e.message}`);
  }

  const active = resolveProject(projectName);
  if (!active) return global;

  const projectConfig = path.join(CONTEXT_DIR, active, 'config.json');
  if (!fs.existsSync(projectConfig)) return global;

  let project;
  try {
    project = JSON.parse(fs.readFileSync(projectConfig, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid JSON in ${projectConfig}: ${e.message}`);
  }

  return deepMerge(global, project);
}

function deepMerge(base, override) {
  if (override === null || override === undefined) return base;
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return override;
  if (typeof override !== 'object' || Array.isArray(override)) return override;
  const out = { ...base };
  for (const k of Object.keys(override)) {
    out[k] = deepMerge(base[k], override[k]);
  }
  return out;
}

function getByPath(obj, dotPath) {
  if (!obj || typeof obj !== 'object') return undefined;
  return dotPath.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    return acc[key];
  }, obj);
}

function loadConfig(manifest, projectName) {
  const declared = manifest.config || {};
  const declaredEntries = Object.entries(declared);
  if (declaredEntries.length === 0) return {};

  const raw = loadContextConfig(projectName);

  const resolved = {};
  const missing = [];

  for (const [key, def] of declaredEntries) {
    if (!def.path) {
      missing.push(`config.${key}.path is required in manifest`);
      continue;
    }
    const value = getByPath(raw, def.path);
    if (value === undefined || value === '' || value === null) {
      if (def.required) {
        missing.push(`Required config "${def.path}" not found in ${GLOBAL_CONFIG}`);
      }
      continue;
    }
    resolved[key] = value;
  }

  if (missing.length) {
    throw new Error(`Config errors:\n  - ${missing.join('\n  - ')}`);
  }
  return resolved;
}

function loadSecrets(manifest, secretsPath) {
  const declared = manifest.secrets || [];
  if (declared.length === 0) return {};

  let fileSecrets = {};
  if (fs.existsSync(secretsPath)) {
    try {
      fileSecrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    } catch (e) {
      throw new Error(`Invalid JSON in ${secretsPath}: ${e.message}`);
    }
  }

  const resolved = {};
  const missing = [];

  for (const def of declared) {
    if (!def.name) { missing.push('secrets[].name is required'); continue; }
    const fromEnv = process.env[def.name];
    const fromFile = fileSecrets[def.name];
    let val = fromEnv ?? fromFile;
    if (typeof val === 'string' && /^<.*>$/.test(val.trim())) val = undefined;

    if (val === undefined || val === '') {
      if (def.required) {
        missing.push(
          `Required secret "${def.name}" not set ` +
            `(define env var ${def.name} or add it to .secrets.json)`
        );
      }
      continue;
    }
    resolved[def.name] = val;
  }

  if (missing.length) {
    throw new Error(`Secrets errors:\n  - ${missing.join('\n  - ')}`);
  }
  return resolved;
}

// ── Lenient loaders (para dry-run / scaffolding) ─────────────────────────────
// Si una clave no está set, devuelve placeholder visible en lugar de error.

function loadConfigLenient(manifest, projectName) {
  const declared = manifest.config || {};
  const missing = [];
  const resolved = {};

  if (Object.keys(declared).length === 0) return { resolved, missing };

  let raw = {};
  try {
    raw = loadContextConfig(projectName);
  } catch (e) {
    missing.push(`Could not read .context config: ${e.message}`);
  }

  for (const [key, def] of Object.entries(declared)) {
    if (!def.path) {
      resolved[key] = `***CONFIG:${key}:NO_PATH***`;
      missing.push(`config.${key}.path is required in manifest`);
      continue;
    }
    const value = getByPath(raw, def.path);
    if (value === undefined || value === '' || value === null) {
      resolved[key] = `***CONFIG:${def.path}:UNSET***`;
      if (def.required) {
        missing.push(`Required config "${def.path}" not found in ${GLOBAL_CONFIG}`);
      }
      continue;
    }
    resolved[key] = value;
  }

  return { resolved, missing };
}

function loadSecretsLenient(manifest, secretsPath) {
  const declared = manifest.secrets || [];
  const resolved = {};
  const realValues = {};
  const missing = [];

  if (declared.length === 0) return { resolved, realValues, missing };

  let fileSecrets = {};
  if (fs.existsSync(secretsPath)) {
    try {
      fileSecrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    } catch (e) {
      missing.push(`Invalid JSON in ${secretsPath}: ${e.message}`);
    }
  }

  for (const def of declared) {
    if (!def.name) continue;
    const fromEnv = process.env[def.name];
    const fromFile = fileSecrets[def.name];
    let val = fromEnv ?? fromFile;
    if (typeof val === 'string' && /^<.*>$/.test(val.trim())) val = undefined;

    if (val === undefined || val === '') {
      resolved[def.name] = `***SECRET:${def.name}:UNSET***`;
      if (def.required) {
        missing.push(
          `Required secret "${def.name}" not set ` +
            `(define env var ${def.name} or add it to .secrets.json)`
        );
      }
      continue;
    }
    resolved[def.name] = val;
    realValues[def.name] = val;
  }

  return { resolved, realValues, missing };
}

module.exports = {
  loadConfig,
  loadSecrets,
  loadContextConfig,
  loadConfigLenient,
  loadSecretsLenient,
  resolveProject,
  listProjects,
  getByPath,
  GLOBAL_CONFIG,
  CONTEXT_DIR,
};
f.path);
    if (value === undefined || value === '' || value === null) {
      resolved[key] = `***CONFIG:${def.path}:UNSET***`;
      if (def.required) {
        missing.push(`Required config "${def.path}" not found in ${GLOBAL_CONFIG}`);
      }
      continue;
    }
    resolved[key] = value;
  }

  return { resolved, missing };
}

function loadSecretsLenient(manifest, secretsPath) {
  const declared = manifest.secrets || [];
  const resolved = {};
  const realValues = {};
  const missing = [];

  if (declared.length === 0) return { resolved, realValues, missing };

  let fileSecrets = {};
  if (fs.existsSync(secretsPath)) {
    try {
      fileSecrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    } catch (e) {
      missing.push(`Invalid JSON in ${secretsPath}: ${e.message}`);
    }
  }

  for (const def of declared) {
    if (!def.name) continue;
    const fromEnv = process.env[def.name];
    const fromFile = fileSecrets[def.name];
    let val = fromEnv ?? fromFile;
    if (typeof val === 'string' && /^<.*>$/.test(val.trim())) val = undefined;

    if (val === undefined || val === '') {
      resolved[def.name] = `***SECRET:${def.name}:UNSET***`;
      if (def.required) {
        missing.push(
          `Required secret "${def.name}" not set ` +
            `(define env var ${def.name} or add it to .secrets.json)`
        );
      }
      continue;
    }
    resolved[def.name] = val;
    realValues[def.name] = val;
  }

  return { resolved, realValues, missing };
}

module.exports = {
  loadConfig,
  loadSecrets,
  loadContextConfig,
  loadConfigLenient,
  loadSecretsLenient,
  resolveProject,
  listProjects,
  getByPath,
  GLOBAL_CONFIG,
  CONTEXT_DIR,
};
