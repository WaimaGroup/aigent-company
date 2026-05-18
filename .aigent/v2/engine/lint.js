// lint.js — validación profunda del manifiesto (más allá del checkeo
// estructural que ya hace parser.js → validateSkill). Devuelve errores
// (bloquean) y warnings (no bloquean pero conviene corregir).
//
// Se usa desde el comando `engine.js validate <skill>`.

'use strict';

const { checkType } = require('./validate');

const VALID_INPUT_TYPES = ['string', 'integer', 'number', 'boolean', 'array'];
const VALID_OUTPUT_TYPES = ['json', 'text'];
const VALID_IMPL_TYPES = ['http', 'bash']; // bash declarado, no implementado todavía

/**
 * Valida en profundidad el manifest de una skill v2.
 * @param {object} manifest      objeto parseado del frontmatter
 * @param {object} blocks        bloques anotados extraídos del body
 * @param {object} [opts]        opciones: { expectedName?: string }
 * @returns {{errors: string[], warnings: string[]}}
 */
function deepValidateSkill(manifest, blocks, opts = {}) {
  const errors = [];
  const warnings = [];

  // ── Metadatos básicos ─────────────────────────────────────────────
  if (!manifest.description || (typeof manifest.description === 'string' && !manifest.description.trim())) {
    warnings.push('manifest.description is missing or empty');
  }
  if (!manifest.version) {
    warnings.push('manifest.version is missing (recommend semver, e.g. "0.1.0")');
  } else if (!/^\d+\.\d+\.\d+/.test(String(manifest.version))) {
    warnings.push(`manifest.version "${manifest.version}" does not look like semver`);
  }

  if (manifest.name && !/^[a-z][a-z0-9-]*$/.test(String(manifest.name))) {
    errors.push(`manifest.name "${manifest.name}" must be kebab-case (lowercase, digits, dashes)`);
  }

  // Convención §4.1: la carpeta lleva el prefijo del dept y `name:` coincide con el dirname.
  if (opts.expectedName && manifest.name && manifest.name !== opts.expectedName) {
    warnings.push(
      `manifest.name "${manifest.name}" does not match the folder name (expected "${opts.expectedName}"). See _shared/conventions.md §4.1.`
    );
  }

  // Convención §7.1: user-invocable: true obligatorio
  if (manifest['user-invocable'] !== true) {
    warnings.push(
      'manifest.user-invocable is missing or not true — all skills in this repo must declare `user-invocable: true` (see _shared/conventions.md §7.1).'
    );
  }

  // ── Config ────────────────────────────────────────────────────────
  for (const [key, def] of Object.entries(manifest.config || {})) {
    if (!def || typeof def !== 'object') {
      errors.push(`config.${key} must be an object`);
      continue;
    }
    if (!def.path) errors.push(`config.${key}.path is required`);
    else if (typeof def.path !== 'string' || !def.path.startsWith('tools.')) {
      warnings.push(`config.${key}.path "${def.path}" should start with "tools." (per conventions §10/§12.9)`);
    }
    if (!def.type) warnings.push(`config.${key}.type is missing`);
    if (!def.description) warnings.push(`config.${key}.description is missing`);
  }

  // ── Secrets ───────────────────────────────────────────────────────
  for (const [i, def] of (manifest.secrets || []).entries()) {
    if (!def || typeof def !== 'object') {
      errors.push(`secrets[${i}] must be an object`);
      continue;
    }
    if (!def.name) errors.push(`secrets[${i}].name is required`);
    else if (!/^[A-Z][A-Z0-9_]*$/.test(String(def.name))) {
      warnings.push(`secrets[${i}].name "${def.name}" should be UPPER_SNAKE_CASE (env var convention)`);
    }
    if (!def.description) warnings.push(`secrets[${def.name || i}].description is missing`);
  }

  // ── Actions ───────────────────────────────────────────────────────
  const actions = manifest.actions || {};
  if (Object.keys(actions).length === 0) {
    errors.push('manifest.actions is empty — a skill must declare at least one action');
  }

  for (const [actionName, action] of Object.entries(actions)) {
    const prefix = `actions.${actionName}`;

    if (!/^[a-z][a-z0-9-]*$/.test(actionName)) {
      warnings.push(`${prefix}: name should be kebab-case`);
    }
    if (!action.description) warnings.push(`${prefix}.description is missing`);

    // impl
    if (action.impl && action.impl.type && !VALID_IMPL_TYPES.includes(action.impl.type)) {
      errors.push(`${prefix}.impl.type "${action.impl.type}" invalid. Allowed: ${VALID_IMPL_TYPES.join(', ')}`);
    }
    if (action.impl && action.impl.type === 'bash') {
      warnings.push(`${prefix}: impl.type=bash is declared but the engine bash runner is not implemented yet — execution will fail with UNSUPPORTED_IMPL`);
    }

    // inputs
    for (const [inputName, input] of Object.entries(action.inputs || {})) {
      const inPrefix = `${prefix}.inputs.${inputName}`;
      if (!input || typeof input !== 'object') {
        errors.push(`${inPrefix} must be an object`);
        continue;
      }

      if (!input.type) {
        warnings.push(`${inPrefix}.type is missing`);
      } else if (!VALID_INPUT_TYPES.includes(input.type)) {
        errors.push(`${inPrefix}.type "${input.type}" invalid. Allowed: ${VALID_INPUT_TYPES.join(', ')}`);
      }

      if (input.default !== undefined && input.type) {
        const err = checkType(`${inPrefix}.default`, input.default, input.type);
        if (err) errors.push(err);
      }

      if (input.enum !== undefined) {
        if (!Array.isArray(input.enum)) {
          errors.push(`${inPrefix}.enum must be an array`);
        } else if (input.type) {
          for (const val of input.enum) {
            const err = checkType(`${inPrefix}.enum item`, val, input.type);
            if (err) errors.push(err);
          }
        }
        if (input.default !== undefined && Array.isArray(input.enum) && !input.enum.includes(input.default)) {
          errors.push(`${inPrefix}.default ${JSON.stringify(input.default)} not in enum ${JSON.stringify(input.enum)}`);
        }
      }

      if (input.required === true && input.default !== undefined) {
        warnings.push(`${inPrefix}: required: true with a default — the default will never apply`);
      }
    }

    // output
    if (!action.output) {
      warnings.push(`${prefix}.output is missing`);
    } else {
      if (action.output.type && !VALID_OUTPUT_TYPES.includes(action.output.type)) {
        warnings.push(`${prefix}.output.type "${action.output.type}" not in [${VALID_OUTPUT_TYPES.join(', ')}]`);
      }
      if (!action.output.description) {
        warnings.push(`${prefix}.output.description is missing`);
      }
    }

    // Comprobaciones cruzadas: tokens del bloque vs schema
    if (action.impl && action.impl.ref) {
      const block = blocks[action.impl.ref];
      if (block) {
        const tokens = extractTokens(block.content);
        const declaredInputs = Object.keys(action.inputs || {});
        const declaredConfig = Object.keys(manifest.config || {});
        const declaredSecrets = (manifest.secrets || []).map((s) => s.name).filter(Boolean);

        for (const tok of tokens) {
          if (tok.scope === 'inputs' && !declaredInputs.includes(tok.key)) {
            errors.push(`${prefix} block references {{inputs.${tok.key}}} but inputs.${tok.key} is not declared`);
          } else if (tok.scope === 'config' && !declaredConfig.includes(tok.key)) {
            errors.push(`${prefix} block references {{config.${tok.key}}} but config.${tok.key} is not declared`);
          } else if (tok.scope === 'secrets' && !declaredSecrets.includes(tok.key)) {
            errors.push(`${prefix} block references {{secrets.${tok.key}}} but secrets[${tok.key}] is not declared`);
          }
        }

        // Inputs declarados pero no usados en el bloque (warning, puede ser legítimo).
        const usedInputs = new Set(tokens.filter((t) => t.scope === 'inputs').map((t) => t.key));
        for (const inputName of declaredInputs) {
          if (!usedInputs.has(inputName)) {
            warnings.push(`${prefix}.inputs.${inputName} declared but not used in block "${action.impl.ref}"`);
          }
        }
      }
    }
  }

  // ── Bloques huérfanos (declarados en body pero ningún action.impl.ref los apunta)
  const referencedRefs = new Set(
    Object.values(actions).map((a) => a.impl && a.impl.ref).filter(Boolean)
  );
  for (const blockName of Object.keys(blocks)) {
    if (!referencedRefs.has(blockName)) {
      warnings.push(`Block name="${blockName}" exists in body but no action references it`);
    }
  }

  return { errors, warnings };
}

/**
 * Extrae todos los tokens {{scope.key}} de un texto.
 */
function extractTokens(text) {
  const re = /\{\{(config|inputs|secrets)\.([A-Za-z_][A-Za-z0-9_]*)(\?)?\}\}/g;
  const tokens = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    tokens.push({ scope: m[1], key: m[2], optional: m[3] === '?' });
  }
  return tokens;
}

module.exports = { deepValidateSkill, extractTokens };
