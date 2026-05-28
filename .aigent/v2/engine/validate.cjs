// validate.js — aplica defaults y valida inputs contra el schema declarado en
// `actions.<name>.inputs` del manifiesto.

'use strict';

/**
 * @param {object} actionDef  manifest.actions[<name>]
 * @param {object} provided   inputs aportados por el llamante
 * @returns {{merged: object, errors: string[]}}
 */
function validateInputs(actionDef, provided = {}) {
  const merged = {};
  const errors = [];
  const schema = actionDef.inputs || {};

  // 1. Detectar inputs aportados que no están en el schema.
  for (const key of Object.keys(provided)) {
    if (!Object.prototype.hasOwnProperty.call(schema, key)) {
      errors.push(`Unknown input "${key}" (not declared in action.inputs)`);
    }
  }

  // 2. Aplicar defaults y validar uno por uno.
  for (const [name, def] of Object.entries(schema)) {
    let val = provided[name];

    if (val === undefined || val === null) {
      if (def.default !== undefined) {
        val = def.default;
      } else if (def.required) {
        errors.push(`Missing required input "${name}"`);
        continue;
      } else {
        // Opcional sin default: lo dejamos undefined. El template decide qué hacer.
        continue;
      }
    }

    const typeError = checkType(name, val, def.type);
    if (typeError) {
      errors.push(typeError);
      continue;
    }

    if (def.enum && !def.enum.includes(val)) {
      errors.push(
        `Input "${name}" must be one of ${JSON.stringify(def.enum)} (got ${JSON.stringify(val)})`
      );
      continue;
    }

    merged[name] = val;
  }

  return { merged, errors };
}

function checkType(name, val, type) {
  if (!type) return null; // sin type declarado, no validamos
  switch (type) {
    case 'string':
      if (typeof val !== 'string') {
        return `Input "${name}" must be string (got ${typeof val})`;
      }
      return null;
    case 'integer':
      if (typeof val !== 'number' || !Number.isInteger(val)) {
        return `Input "${name}" must be integer (got ${typeof val} ${JSON.stringify(val)})`;
      }
      return null;
    case 'number':
      if (typeof val !== 'number' || Number.isNaN(val)) {
        return `Input "${name}" must be number (got ${typeof val})`;
      }
      return null;
    case 'boolean':
      if (typeof val !== 'boolean') {
        return `Input "${name}" must be boolean (got ${typeof val})`;
      }
      return null;
    case 'array':
      if (!Array.isArray(val)) {
        return `Input "${name}" must be array (got ${typeof val})`;
      }
      return null;
    default:
      // Type desconocido: lo aceptamos pero lo registramos en error.
      return `Input "${name}" has unknown type "${type}" (allowed: string, integer, number, boolean, array)`;
  }
}

module.exports = { validateInputs, checkType };