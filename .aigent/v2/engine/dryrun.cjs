// dryrun.js — renderiza una request HTTP sin ejecutarla. Útil para:
//   - Verificar templating tras crear/editar una skill (skill-builder).
//   - Depurar requests sin llamar al endpoint real.
//   - Comprobar que la skill funciona aún antes de configurar config/secrets
//     (devuelve placeholders visibles si faltan).
//
// Output:
//   { ok: true, data: { method, url, headers, body, body_json_valid }, meta: { warnings } }
//
// Seguridad:
//   - Los valores de secrets cargados del entorno/fichero se enmascaran como
//     `***SECRET:<NAME>***` en el output.
//   - Los secrets no configurados aparecen como `***SECRET:<NAME>:UNSET***`
//     (placeholder generado por el cargador lenient — no hay nada que ocultar).

'use strict';

const { renderGeneric, renderQuery, renderJson } = require('./template.cjs');
const { parseHttpBlock } = require('./http.cjs');

/**
 * Reemplaza cada valor real de secret por un marcador legible.
 */
function maskSecrets(str, realSecrets) {
  if (!str) return str;
  let out = String(str);
  for (const [name, value] of Object.entries(realSecrets || {})) {
    if (!value) continue;
    out = out.split(value).join(`***SECRET:${name}***`);
  }
  return out;
}

/**
 * Ejecuta dry-run de un bloque HTTP.
 * @param {string} blockContent
 * @param {{config:object, inputs:object, secrets:object}} scope
 * @param {{realSecrets?:object, warnings?:string[]}} options
 */
function dryRunHttp(blockContent, scope, options = {}) {
  const warnings = options.warnings ? [...options.warnings] : [];
  const realSecrets = options.realSecrets || {};

  let parsed;
  try {
    parsed = parseHttpBlock(blockContent);
  } catch (e) {
    return {
      ok: false,
      error: { code: 'PARSE_ERROR', message: e.message },
      meta: { warnings },
    };
  }

  const url = renderQuery(parsed.url, scope);
  const headers = {};
  for (const [name, value] of Object.entries(parsed.headers)) {
    const rendered = renderGeneric(value, scope);
    if (rendered !== '') headers[name] = rendered;
  }

  let body = null;
  let body_json_valid = null;
  if (parsed.body !== null) {
    body = renderJson(parsed.body, scope);
    try {
      JSON.parse(body);
      body_json_valid = true;
    } catch (e) {
      body_json_valid = false;
      warnings.push(`Rendered body is not valid JSON: ${e.message}`);
    }
  }

  // Mascarar secrets reales en URL, headers y body.
  const maskedHeaders = {};
  for (const [k, v] of Object.entries(headers)) {
    maskedHeaders[k] = maskSecrets(v, realSecrets);
  }

  return {
    ok: true,
    data: {
      method: parsed.method,
      url: maskSecrets(url, realSecrets),
      headers: maskedHeaders,
      body: maskSecrets(body, realSecrets),
      body_json_valid,
    },
    meta: { warnings },
  };
}

module.exports = { dryRunHttp, maskSecrets };
