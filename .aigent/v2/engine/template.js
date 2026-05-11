// template.js — render de plantillas {{config.x}}, {{inputs.x}}, {{inputs.x?}}, {{secrets.X}}
// Tres modos: 'generic' (headers, valores sueltos), 'query' (URL con query string),
// 'json' (body JSON con omisión de claves opcionales ausentes).

'use strict';

const OMIT = '__OMIT_AIGENT_V2__';

const TOKEN_RE = /\{\{(config|inputs|secrets)\.([A-Za-z_][A-Za-z0-9_]*)(\?)?\}\}/g;

/**
 * Substituye tokens. Devuelve string con marcadores OMIT donde corresponda.
 * @param {string} text
 * @param {{config:object, inputs:object, secrets:object}} scope
 */
function substitute(text, scope) {
  return text.replace(TOKEN_RE, (match, ns, key, opt) => {
    const bag = scope[ns];
    const has = bag && Object.prototype.hasOwnProperty.call(bag, key) && bag[key] !== undefined && bag[key] !== null;
    if (!has) {
      if (opt === '?') return OMIT;
      // Sin '?': string vacío. El llamante decide qué hacer si era requerido.
      return '';
    }
    return String(bag[key]);
  });
}

/**
 * Render genérico (headers, valores que no necesitan limpieza).
 */
function renderGeneric(text, scope) {
  const out = substitute(text, scope);
  if (out.includes(OMIT)) {
    // En modo generic, OMIT se traduce a string vacío (header con valor vacío
    // se filtrará en el runner si hace falta).
    return out.split(OMIT).join('');
  }
  return out;
}

/**
 * Render para URL: si un parámetro de query string termina con OMIT, se elimina entero.
 * Soporta `?a=...&b=...&c=...`.
 */
function renderQuery(url, scope) {
  let out = substitute(url, scope);
  if (!out.includes(OMIT)) return out;

  // Separar path de query.
  const qIdx = out.indexOf('?');
  if (qIdx === -1) {
    // No hay query string; OMIT en path es un error de diseño. Sustituimos por vacío.
    return out.split(OMIT).join('');
  }

  const path = out.slice(0, qIdx);
  const query = out.slice(qIdx + 1);

  const params = query.split('&').filter((p) => {
    if (!p) return false;
    // Si el valor contiene OMIT, descartar el parámetro entero.
    const eqIdx = p.indexOf('=');
    if (eqIdx === -1) return true;
    const value = p.slice(eqIdx + 1);
    return !value.includes(OMIT);
  });

  if (params.length === 0) return path;
  return path + '?' + params.join('&');
}

/**
 * Render para body JSON: cualquier línea cuyo valor contenga OMIT se elimina.
 * Después se limpian comas trailing antes de `}` o `]`.
 *
 * Convención: el body JSON tiene un par "key": "value" por línea (formato estándar
 * usado en los SKILL.md de v2). Si necesitas valores complejos en una sola línea,
 * usa input requerido o estructura el body en múltiples líneas.
 */
function renderJson(body, scope) {
  let out = substitute(body, scope);
  if (out.includes(OMIT)) {
    out = out
      .split('\n')
      .filter((line) => !line.includes(OMIT))
      .join('\n');
    // Limpiar comas trailing: `,\n  }` → `\n  }` y `,\n]` → `\n]`.
    out = out.replace(/,(\s*[}\]])/g, '$1');
  }
  return out;
}

module.exports = { renderGeneric, renderQuery, renderJson, OMIT };
