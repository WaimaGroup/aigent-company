#!/usr/bin/env node
// engine.js — CLI principal del engine v2.
// Comandos: list | describe | validate | doctor | configure | prepare-secrets | dry-run | run
// Output: JSON a stdout. Exit 0 si ok, !=0 si error.

'use strict';

const fs = require('fs');
const path = require('path');

const { parseSkill, validateSkill } = require('./parser');
const { validateInputs } = require('./validate');
const { deepValidateSkill } = require('./lint');
const { auditRepo } = require('./audit');
const { loadConfig, loadSecrets, loadConfigLenient, loadSecretsLenient } = require('./config');
const { executeHttp } = require('./http');
const { dryRunHttp } = require('./dryrun');
const { doctor: doctorCmd, configure: configureCmd, prepareSecrets: prepareSecretsCmd, doctorOne, SECRETS_PATH } = require('./configure');

const V2_ROOT = path.resolve(__dirname, '..');
const AIGENT_ROOT = path.resolve(V2_ROOT, '..');
const DEPARTMENTS_DIR = path.join(AIGENT_ROOT, 'departments');

function enumerateV2Skills() {
  if (!fs.existsSync(DEPARTMENTS_DIR)) return [];
  const out = [];
  const seen = new Map();

  for (const deptEntry of fs.readdirSync(DEPARTMENTS_DIR, { withFileTypes: true })) {
    if (!deptEntry.isDirectory()) continue;
    const dept = deptEntry.name;
    if (dept === '_shared') continue;

    const skillsDir = path.join(DEPARTMENTS_DIR, dept, 'skills');
    if (!fs.existsSync(skillsDir)) continue;

    for (const skillEntry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!skillEntry.isDirectory()) continue;
      const skillMd = path.join(skillsDir, skillEntry.name, 'SKILL.md');
      if (!fs.existsSync(skillMd)) continue;

      let parsed;
      try { parsed = parseSkill(skillMd); }
      catch { continue; }

      if (parsed.manifest.runtime !== 'engine-v2') continue;

      try { validateSkill(parsed.manifest, parsed.blocks, skillMd); }
      catch (e) {
        out.push({ name: parsed.manifest.name || skillEntry.name, dept, path: skillMd, error: e.message });
        continue;
      }

      const name = parsed.manifest.name;
      if (seen.has(name)) {
        const prev = seen.get(name);
        out.push({ name, dept, path: skillMd, error: `Duplicate skill name "${name}" — also defined at ${prev.path}` });
        continue;
      }
      seen.set(name, { dept, path: skillMd });
      out.push({ name, dept, dirname: skillEntry.name, path: skillMd, manifest: parsed.manifest, blocks: parsed.blocks });
    }
  }
  return out;
}

function findSkill(name) {
  return enumerateV2Skills().find((s) => s.name === name && !s.error) || null;
}

function findSkillRaw(name) {
  return enumerateV2Skills().find((s) => s.name === name) || null;
}

function listSkills() {
  const skills = enumerateV2Skills().map((s) => {
    if (s.error) return { name: s.name, dept: s.dept, error: s.error };
    return {
      name: s.name,
      dept: s.dept,
      version: s.manifest.version || null,
      description: typeof s.manifest.description === 'string' ? s.manifest.description.trim() : null,
      actions: Object.keys(s.manifest.actions || {}),
    };
  });
  return { ok: true, data: skills, meta: { departments_dir: DEPARTMENTS_DIR } };
}

function describeSkill(name) {
  if (!name) return errorResult('BAD_ARGS', 'Usage: engine.js describe <skill>');
  const found = findSkill(name);
  if (!found) {
    return errorResult('SKILL_NOT_FOUND', `Skill "${name}" not found in any department under ${DEPARTMENTS_DIR}`);
  }
  const m = found.manifest;
  return {
    ok: true,
    data: {
      name: m.name,
      dept: found.dept,
      version: m.version || null,
      description: typeof m.description === 'string' ? m.description.trim() : null,
      runtime: m.runtime,
      config: m.config || {},
      secrets: (m.secrets || []).map((s) => ({ name: s.name, required: !!s.required, description: s.description || null })),
      actions: Object.fromEntries(Object.entries(m.actions || {}).map(([key, action]) => [
        key,
        {
          description: action.description || null,
          impl: action.impl,
          inputs: action.inputs || {},
          output: action.output || null,
        },
      ])),
    },
    meta: { skill_path: found.path },
  };
}

function validateSkillCmd(name) {
  if (!name) return errorResult('BAD_ARGS', 'Usage: engine.js validate <skill>');
  const found = findSkillRaw(name);
  if (!found) {
    return errorResult('SKILL_NOT_FOUND', `Skill "${name}" not found in any department under ${DEPARTMENTS_DIR}`);
  }
  if (found.error) {
    return {
      ok: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: `Skill "${name}" failed structural validation`,
        details: { errors: [found.error], warnings: [] },
      },
      meta: { skill_path: found.path },
    };
  }

  const expectedName = found.dirname || null;
  const { errors, warnings } = deepValidateSkill(found.manifest, found.blocks, { expectedName });

  if (errors.length > 0) {
    return {
      ok: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: `Skill "${name}" has ${errors.length} error(s) and ${warnings.length} warning(s)`,
        details: { errors, warnings },
      },
      meta: { skill_path: found.path },
    };
  }

  return {
    ok: true,
    data: {
      skill: found.manifest.name,
      dept: found.dept,
      version: found.manifest.version || null,
      runtime: found.manifest.runtime,
      actions_count: Object.keys(found.manifest.actions || {}).length,
      actions: Object.keys(found.manifest.actions || {}),
      warnings,
    },
    meta: { skill_path: found.path },
  };
}

function doctorSkill(name, projectName) {
  return doctorCmd(name, enumerateV2Skills(), projectName);
}

function configureSkill(name, sets, scope, projectName) {
  if (!name) return errorResult('BAD_ARGS', "Usage: engine.js configure <skill> --set <path>=<value> [--scope global|project] [--project <name>]");
  const found = findSkill(name);
  if (!found) return errorResult('SKILL_NOT_FOUND', `Skill "${name}" not found in any department`);
  return configureCmd(found, sets, scope || 'global', projectName);
}

function prepareSecretsSkill(name) {
  if (!name) return errorResult('BAD_ARGS', 'Usage: engine.js prepare-secrets <skill>');
  const found = findSkill(name);
  if (!found) return errorResult('SKILL_NOT_FOUND', `Skill "${name}" not found in any department`);
  return prepareSecretsCmd(found);
}

async function dryRunAction(skillName, actionName, providedInputs, projectName) {
  if (!skillName || !actionName) {
    return errorResult('BAD_ARGS', "Usage: engine.js dry-run <skill> <action> [--inputs '{...}']");
  }
  const found = findSkill(skillName);
  if (!found) return errorResult('SKILL_NOT_FOUND', `Skill "${skillName}" not found in any department`);

  const action = (found.manifest.actions || {})[actionName];
  if (!action) {
    return errorResult('ACTION_NOT_FOUND',
      `Action "${actionName}" not found in skill "${skillName}". ` +
      `Available: ${Object.keys(found.manifest.actions || {}).join(', ') || '(none)'}`);
  }

  const { merged, errors } = validateInputs(action, providedInputs);
  if (errors.length) return errorResult('INVALID_INPUTS', 'Input validation failed', errors);

  const { resolved: config, missing: configMissing } = loadConfigLenient(found.manifest, projectName);
  const { resolved: secrets, realValues, missing: secretsMissing } =
    loadSecretsLenient(found.manifest, SECRETS_PATH);

  const warnings = [];
  for (const m of configMissing) warnings.push(`config: ${m}`);
  for (const m of secretsMissing) warnings.push(`secrets: ${m}`);

  if (action.impl.type !== 'http') {
    return errorResult('UNSUPPORTED_IMPL', `dry-run only supports impl.type=http (got "${action.impl.type}")`);
  }

  const block = found.blocks[action.impl.ref];
  const scope = { config, inputs: merged, secrets };
  const result = dryRunHttp(block.content, scope, { realSecrets: realValues, warnings });
  if (result.meta) result.meta.skill_path = found.path;
  return result;
}

async function runAction(skillName, actionName, providedInputs, projectName) {
  if (!skillName || !actionName) {
    return errorResult('BAD_ARGS', "Usage: engine.js run <skill> <action> [--inputs '{...}']");
  }
  const found = findSkill(skillName);
  if (!found) return errorResult('SKILL_NOT_FOUND', `Skill "${skillName}" not found in any department`);

  const action = (found.manifest.actions || {})[actionName];
  if (!action) {
    return errorResult('ACTION_NOT_FOUND',
      `Action "${actionName}" not found in skill "${skillName}". ` +
      `Available: ${Object.keys(found.manifest.actions || {}).join(', ') || '(none)'}`);
  }

  const { merged, errors } = validateInputs(action, providedInputs);
  if (errors.length) return errorResult('INVALID_INPUTS', 'Input validation failed', errors);

  let config, secrets;
  try { config = loadConfig(found.manifest, projectName); }
  catch (e) { return readinessError('CONFIG_ERROR', e.message, found, projectName); }
  try { secrets = loadSecrets(found.manifest, SECRETS_PATH); }
  catch (e) { return readinessError('SECRETS_ERROR', e.message, found, projectName); }

  const block = found.blocks[action.impl.ref];
  const scope = { config, inputs: merged, secrets };

  if (action.impl.type === 'http') return await executeHttp(block.content, scope);
  return errorResult('UNSUPPORTED_IMPL', `impl.type="${action.impl.type}" not supported yet`);
}

// Construye un error de readiness (CONFIG_ERROR / SECRETS_ERROR) enriquecido con
// el reporte de doctor (qué config y secrets faltan exactamente) y los siguientes
// pasos exactos que el agente caller debe seguir. Importante: nunca pedir secrets
// por chat — el agente sólo indica al usuario dónde rellenarlos.
function readinessError(code, message, found, projectName) {
  let report;
  try { report = doctorOne(found, projectName); }
  catch (e) { report = null; }

  const skill = found.manifest.name;
  const missing_config = report
    ? report.config.filter(c => c.required && !c.set)
        .map(c => ({ key: c.key, path: c.path, type: c.type, description: c.description }))
    : [];
  const missing_secrets = report
    ? report.secrets.filter(s => s.required && !s.set)
        .map(s => ({ name: s.name, description: s.description }))
    : [];

  const next = [];
  if (missing_config.length > 0) {
    next.push(
      'Pide al usuario los valores de config faltantes (no son secretos) y aplica con: ' +
      'node .aigent/v2/engine/engine.js configure ' + skill + ' ' +
      missing_config.map(c => '--set ' + c.path + '=<valor>').join(' ') +
      ' --scope <global|project>'
    );
  }
  if (missing_secrets.length > 0) {
    next.push(
      'Asegura placeholders en .context/.secrets.json con: ' +
      'node .aigent/v2/engine/engine.js prepare-secrets ' + skill
    );
    next.push(
      'Indica al usuario qué secretos rellenar a mano (NUNCA pedirlos por chat). ' +
      'Para cada secret: abrir .context/.secrets.json y reemplazar el placeholder ' +
      '<replace_me_*>, o definir la variable de entorno correspondiente. ' +
      'Pendientes: ' + missing_secrets.map(s => s.name).join(', ') + '.'
    );
  }
  next.push(
    'Verifica readiness con: node .aigent/v2/engine/engine.js doctor ' + skill +
    ' (espera "ready: true" antes de reintentar el run).'
  );

  return {
    ok: false,
    error: {
      code,
      message,
      details: {
        skill,
        missing_config,
        missing_secrets,
        secrets_file: SECRETS_PATH,
        next,
        rule: 'Los secretos NUNCA se aceptan por chat. Solo se le indica al usuario donde ponerlos.',
      },
    },
    meta: { skill_path: found.path },
  };
}

function errorResult(code, message, details) {
  const error = { code, message };
  if (details !== undefined) error.details = details;
  return { ok: false, error, meta: {} };
}

function parseArgv(argv) {
  const args = { positional: [], inputs: {}, sets: [], scope: null, project: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--inputs') {
      const next = argv[++i];
      if (next === undefined) throw new Error('--inputs requires a JSON string argument');
      try { args.inputs = JSON.parse(next); }
      catch (e) { throw new Error(`--inputs is not valid JSON: ${e.message}`); }
      if (typeof args.inputs !== 'object' || Array.isArray(args.inputs) || args.inputs === null) {
        throw new Error('--inputs must be a JSON object');
      }
    } else if (a === '--set') {
      const next = argv[++i];
      if (next === undefined) throw new Error('--set requires <path>=<value>');
      const eqIdx = next.indexOf('=');
      if (eqIdx === -1) throw new Error(`--set "${next}" must be in the form path=value`);
      args.sets.push({ path: next.slice(0, eqIdx).trim(), value: next.slice(eqIdx + 1) });
    } else if (a === '--scope') {
      const next = argv[++i];
      if (next === undefined) throw new Error('--scope requires "global" or "project"');
      args.scope = next.trim();
    } else if (a === '--project') {
      const next = argv[++i];
      if (next === undefined) throw new Error('--project requires a project name');
      args.project = next.trim();
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    } else {
      args.positional.push(a);
    }
  }
  return args;
}

function printHelp() {
  process.stdout.write([
    'Usage:',
    '  engine.js list',
    '  engine.js describe <skill>',
    '  engine.js validate <skill>',
    '  engine.js audit-repo',
    '  engine.js doctor [<skill>] [--project <name>]',
    '  engine.js configure <skill> --set <path>=<value> [--set ...] [--scope global|project] [--project <name>]',
    '  engine.js prepare-secrets <skill>',
    "  engine.js dry-run <skill> <action> [--inputs '{\"k\":\"v\"}'] [--project <name>]",
    "  engine.js run      <skill> <action> [--inputs '{\"k\":\"v\"}'] [--project <name>]",
    '',
    'Commands:',
    '  list             - list all v2 skills found across departments',
    '  describe         - print the skill manifest as JSON',
    '  validate         - deep-validate the manifest WITHOUT executing anything',
    '  audit-repo       - structural audit of ALL skills (v1+v2) and agents in the repo',
    '  doctor           - report config + secrets status (without executing)',
    '  configure        - write declared config values to .context/config.json',
    '  prepare-secrets  - ensure .secrets.json has placeholders for missing secrets',
    '  dry-run          - render the HTTP request without calling fetch',
    '  run              - execute the action and return the response',
    '',
  ].join('\n'));
}

async function main() {
  let args;
  try { args = parseArgv(process.argv.slice(2)); }
  catch (e) { emit(errorResult('BAD_ARGS', e.message)); return; }

  if (args.help || args.positional.length === 0) {
    printHelp();
    process.exitCode = args.help ? 0 : 1;
    return;
  }

  const [cmd, ...rest] = args.positional;
  let result;
  try {
    switch (cmd) {
      case 'list':            result = listSkills(); break;
      case 'describe':        result = describeSkill(rest[0]); break;
      case 'validate':        result = validateSkillCmd(rest[0]); break;
      case 'audit-repo':      result = auditRepo(DEPARTMENTS_DIR); break;
      case 'doctor':          result = doctorSkill(rest[0], args.project); break;
      case 'configure':       result = configureSkill(rest[0], args.sets, args.scope, args.project); break;
      case 'prepare-secrets': result = prepareSecretsSkill(rest[0]); break;
      case 'dry-run':         result = await dryRunAction(rest[0], rest[1], args.inputs, args.project); break;
      case 'run':             result = await runAction(rest[0], rest[1], args.inputs, args.project); break;
      default:                result = errorResult('BAD_CMD', `Unknown command "${cmd}". Use list | describe | validate | doctor | configure | prepare-secrets | dry-run | run.`);
    }
  } catch (e) {
    result = errorResult('INTERNAL', e.message, { stack: e.stack });
  }
  emit(result);
}

function emit(result) {
  const exitCode = result.ok ? 0 : 1;
  if (!result.ok) {
    const err = result.error || {};
    process.stderr.write(`[engine] ${err.code || 'ERROR'}: ${err.message || ''}\n`);
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exitCode = exitCode;
}

main();
