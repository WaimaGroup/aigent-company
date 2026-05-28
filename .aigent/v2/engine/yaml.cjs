// yaml.js — parser del subset YAML que usan los SKILL.md de v2.
// Subset soportado:
//   - Mappings con indentación (cualquier nivel, debe ser consistente)
//   - Scalars: string (con/sin comillas), integer, float, boolean, null
//   - Arrays con `- item` (item escalar, mapping o nested)
//   - Folded scalar `>` (líneas siguientes se unen con espacios)
//   - Literal scalar `|` (líneas siguientes se preservan con \n)
//   - Flow style `{ k: v, ... }` y `[a, b, ...]`
//   - Comentarios `#` (líneas completas o al final de línea, fuera de comillas)
//
// NO soportado (intencionalmente): anchors/aliases (&/*), tags (!!), múltiples
// documentos (---), claves complejas (?), strings multilínea con `"..."`.
// Si necesitas algo de eso, haz un PR o usa js-yaml de nuevo.

'use strict';

function parse(text) {
  const lines = preprocess(text);
  if (lines.length === 0) return null;
  return parseBlock(lines, 0).value;
}

// ─── Preprocess ────────────────────────────────────────────────────────────

function preprocess(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const stripped = stripInlineComment(raw);
    if (stripped.trim() === '') continue;        // línea vacía
    if (/^\s*#/.test(stripped)) continue;         // línea solo de comentario
    out.push(stripped);
  }
  return out;
}

function stripInlineComment(line) {
  let inS = false, inD = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && !inS) inD = !inD;
    else if (c === "'" && !inD) inS = !inS;
    else if (c === '#' && !inS && !inD) {
      if (i === 0 || /\s/.test(line[i - 1])) {
        return line.slice(0, i).trimEnd();
      }
    }
  }
  return line;
}

function indentOf(line) {
  let n = 0;
  while (n < line.length && line[n] === ' ') n++;
  return n;
}

// ─── Bloques ───────────────────────────────────────────────────────────────

function parseBlock(lines, startIdx) {
  if (startIdx >= lines.length) return { value: null, nextIdx: startIdx };
  const indent = indentOf(lines[startIdx]);
  const trimmed = lines[startIdx].trim();
  if (trimmed.startsWith('- ') || trimmed === '-') {
    return parseArray(lines, startIdx, indent);
  }
  return parseMapping(lines, startIdx, indent);
}

function parseMapping(lines, startIdx, indent) {
  const result = {};
  let i = startIdx;

  while (i < lines.length) {
    const line = lines[i];
    const lineIndent = indentOf(line);

    if (lineIndent < indent) break;
    if (lineIndent > indent) {
      // Sublíneas que ya fueron procesadas por una entrada anterior.
      // No deberíamos llegar aquí en condiciones normales.
      i++;
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith('-')) break; // hemos cambiado a array, no es nuestro nivel

    const colonIdx = findKeyColon(trimmed);
    if (colonIdx === -1) {
      throw new Error(`yaml: invalid mapping line at line "${line}"`);
    }

    const key = unquote(trimmed.slice(0, colonIdx).trim());
    const after = trimmed.slice(colonIdx + 1).trim();

    if (after === '') {
      // Valor en sublíneas
      const next = lines[i + 1];
      if (!next || indentOf(next) <= indent) {
        result[key] = null;
        i++;
      } else {
        const sub = parseBlock(lines, i + 1);
        result[key] = sub.value;
        i = sub.nextIdx;
      }
    } else if (after === '>') {
      const f = parseFolded(lines, i + 1, indent);
      result[key] = f.value;
      i = f.nextIdx;
    } else if (after === '|') {
      const lit = parseLiteral(lines, i + 1, indent);
      result[key] = lit.value;
      i = lit.nextIdx;
    } else {
      result[key] = parseScalar(after);
      i++;
    }
  }

  return { value: result, nextIdx: i };
}

function parseArray(lines, startIdx, indent) {
  const result = [];
  let i = startIdx;

  while (i < lines.length) {
    const line = lines[i];
    const lineIndent = indentOf(line);

    if (lineIndent < indent) break;
    if (lineIndent > indent) { i++; continue; }

    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) break;

    const after = trimmed.length > 1 ? trimmed.slice(1).trimStart() : '';

    if (after === '') {
      const next = lines[i + 1];
      if (!next || indentOf(next) <= indent) {
        result.push(null);
        i++;
      } else {
        const sub = parseBlock(lines, i + 1);
        result.push(sub.value);
        i = sub.nextIdx;
      }
    } else if (findKeyColon(after) !== -1) {
      // Item es un mapping inline: `- key: value` y posibles sublíneas
      const itemIndent = indent + 2;
      const tempLines = [' '.repeat(itemIndent) + after];
      let j = i + 1;
      while (j < lines.length && indentOf(lines[j]) > indent) {
        tempLines.push(lines[j]);
        j++;
      }
      const sub = parseMapping(tempLines, 0, itemIndent);
      result.push(sub.value);
      i = j;
    } else {
      result.push(parseScalar(after));
      i++;
    }
  }

  return { value: result, nextIdx: i };
}

// ─── Scalars compuestos ────────────────────────────────────────────────────

function parseFolded(lines, startIdx, baseIndent) {
  const parts = [];
  let i = startIdx;
  while (i < lines.length) {
    if (indentOf(lines[i]) <= baseIndent) break;
    parts.push(lines[i].trim());
    i++;
  }
  return { value: parts.join(' '), nextIdx: i };
}

function parseLiteral(lines, startIdx, baseIndent) {
  const parts = [];
  let i = startIdx;
  // La indentación del bloque la determina la primera sublínea
  let blockIndent = -1;
  while (i < lines.length) {
    const ind = indentOf(lines[i]);
    if (ind <= baseIndent) break;
    if (blockIndent === -1) blockIndent = ind;
    parts.push(lines[i].slice(blockIndent));
    i++;
  }
  return { value: parts.join('\n'), nextIdx: i };
}

// ─── Scalar y flow ─────────────────────────────────────────────────────────

function parseScalar(text) {
  text = text.trim();
  if (text === '' || text === 'null' || text === '~') return null;
  if (text === 'true') return true;
  if (text === 'false') return false;

  if (text.startsWith('{') && text.endsWith('}')) {
    return parseFlowMapping(text.slice(1, -1));
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    return parseFlowArray(text.slice(1, -1));
  }
  if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
    return text.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (text.startsWith("'") && text.endsWith("'") && text.length >= 2) {
    return text.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+$/.test(text)) return parseInt(text, 10);
  if (/^-?\d+\.\d+$/.test(text)) return parseFloat(text);
  if (/^-?\d+\.\d+[eE][-+]?\d+$/.test(text)) return parseFloat(text);
  return text;
}

function parseFlowMapping(text) {
  const result = {};
  for (const item of splitFlow(text, ',')) {
    if (!item.trim()) continue;
    const colonIdx = findKeyColon(item);
    if (colonIdx === -1) throw new Error(`yaml: invalid flow mapping item "${item}"`);
    const key = unquote(item.slice(0, colonIdx).trim());
    result[key] = parseScalar(item.slice(colonIdx + 1).trim());
  }
  return result;
}

function parseFlowArray(text) {
  const items = splitFlow(text, ',');
  if (items.length === 0 || (items.length === 1 && items[0].trim() === '')) return [];
  return items.map((it) => parseScalar(it));
}

function splitFlow(text, sep) {
  const result = [];
  let depth = 0, inS = false, inD = false, current = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && !inS) inD = !inD;
    else if (c === "'" && !inD) inS = !inS;
    else if (!inS && !inD) {
      if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') depth--;
      else if (c === sep && depth === 0) {
        result.push(current);
        current = '';
        continue;
      }
    }
    current += c;
  }
  if (current.length) result.push(current);
  return result;
}

function findKeyColon(text) {
  let depth = 0, inS = false, inD = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && !inS) inD = !inD;
    else if (c === "'" && !inD) inS = !inS;
    else if (!inS && !inD) {
      if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') depth--;
      else if (c === ':' && depth === 0) {
        const nxt = text[i + 1];
        if (nxt === undefined || nxt === ' ' || nxt === '\t') return i;
      }
    }
  }
  return -1;
}

function unquote(s) {
  if (s.length >= 2) {
    if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
    if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  }
  return s;
}

module.exports = { parse, load: parse };
