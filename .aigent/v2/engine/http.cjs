// http.js — runner para bloques `http`. Parsea, renderiza y ejecuta vía fetch.

'use strict';

const { renderGeneric, renderQuery, renderJson } = require('./template.cjs');

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Parsea el contenido textual de un bloque ```http en sus partes.
 * Formato:
 *   <METHOD> <URL>
 *   Header-1: value
 *   Header-2: value
 *
 *   <body opcional, todo lo que quede después de la primera línea en blanco>
 */
function parseHttpBlock(content) {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) {
    throw new Error('Empty http block');
  }

  const firstLine = lines[0].trim();
  const firstSpace = firstLine.indexOf(' ');
  if (firstSpace === -1) {
    throw new Error(`Invalid first line in http block: "${firstLine}"`);
  }
  const method = firstLine.slice(0, firstSpace).toUpperCase();
  const url = firstLine.slice(firstSpace + 1).trim();

  const headers = {};
  let bodyStart = -1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      bodyStart = i + 1;
      break;
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) {
      throw new Error(`Invalid header line: "${line}"`);
    }
    const name = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    headers[name] = value;
  }

  let body = null;
  if (bodyStart !== -1 && bodyStart < lines.length) {
    body = lines.slice(bodyStart).join('\n').trim();
    if (body === '') body = null;
  }

  return { method, url, headers, body };
}

/**
 * Ejecuta un bloque http renderizando con `scope`.
 * @param {string} blockContent contenido del bloque (sin las líneas ```)
 * @param {{config:object, inputs:object, secrets:object}} scope
 * @param {{timeout_ms?:number}} options
 * @returns {Promise<{ok:boolean, data?:any, error?:object, meta:object}>}
 */
async function executeHttp(blockContent, scope, options = {}) {
  const start = Date.now();
  const timeout = options.timeout_ms || DEFAULT_TIMEOUT_MS;

  let parsed;
  try {
    parsed = parseHttpBlock(blockContent);
  } catch (e) {
    return {
      ok: false,
      error: { code: 'PARSE_ERROR', message: e.message },
      meta: { duration_ms: Date.now() - start },
    };
  }

  // Render.
  const url = renderQuery(parsed.url, scope);
  const headers = {};
  for (const [name, value] of Object.entries(parsed.headers)) {
    const rendered = renderGeneric(value, scope);
    if (rendered !== '') headers[name] = rendered;
  }

  let body = null;
  if (parsed.body !== null) {
    const renderedBody = renderJson(parsed.body, scope);
    // Validar JSON. Si falla, devolvemos error claro antes de la llamada.
    try {
      JSON.parse(renderedBody);
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 'INVALID_BODY_JSON',
          message: `Rendered body is not valid JSON: ${e.message}`,
          details: { body: renderedBody },
        },
        meta: { duration_ms: Date.now() - start },
      };
    }
    body = renderedBody;
  }

  // Llamada.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(url, {
      method: parsed.method,
      headers,
      body,
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    const duration_ms = Date.now() - start;
    if (e.name === 'AbortError') {
      return {
        ok: false,
        error: { code: 'TIMEOUT', message: `Request timed out after ${timeout}ms` },
        meta: { duration_ms },
      };
    }
    return {
      ok: false,
      error: { code: 'NETWORK_ERROR', message: e.message },
      meta: { duration_ms },
    };
  }
  clearTimeout(timer);

  const duration_ms = Date.now() - start;

  // 204 No Content.
  if (res.status === 204) {
    return {
      ok: res.ok,
      data: null,
      meta: { status: res.status, duration_ms },
    };
  }

  const text = await res.text();
  let data = null;
  if (text) {
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    } else {
      data = text;
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      error: {
        code: `HTTP_${res.status}`,
        message: res.statusText || `HTTP ${res.status}`,
        details: data,
      },
      meta: { status: res.status, duration_ms },
    };
  }

  return {
    ok: true,
    data,
    meta: { status: res.status, duration_ms },
  };
}

module.exports = { executeHttp, parseHttpBlock };
