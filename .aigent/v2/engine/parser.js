// parser.js — extrae el manifiesto YAML del frontmatter y los bloques anotados
// del body de un SKILL.md. Sin dependencias externas (usa ./yaml).

'use strict';

const fs = require('fs');
const yaml = require('./yaml');

function parseSkill(skillMdPath) {
  if (!fs.existsSync(skillMdPath)) {
    throw new Error(`SKILL.md not found: ${skillMdPath}`);
  }

  // Leer y limpiar posibles NUL bytes residuales.
  const raw = fs.readFileSync(skillMdPath, 'utf8').replace(/\x00/g, '');

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!fmMatch) {
    throw new Error(`No frontmatter found in ${skillMdPath}`);
  }

  let manifest;
  try {
    manifest = yaml.parse(fmMatch[1]);
  } catch (e) {
    throw new Error(`Invalid YAML in frontmatter of ${skillMdPath}: ${e.message}`);
  }

  if (!manifest || typeof manifest !== 'object') {
    throw new Error(`Frontmatter must be a YAML object in ${skillMdPath}`);
  }

  const blocks = extractBlocks(fmMatch[2]);
  return { manifest, blocks };
}

function extractBlocks(body) {
  const blocks = {};
  const re = /^```(\w+)[ \t]+name="([^"]+)"[ \t]*\r?\n([\s\S]*?)\r?\n^```[ \t]*$/gm;
  let m;
  while ((m = re.exec(body)) !== null) {
    const [, lang, name, content] = m;
    if (blocks[name]) {
      throw new Error(`Duplicate block name="${name}" in body`);
    }
    blocks[name] = { lang, content };
  }
  return blocks;
}

function validateSkill(manifest, blocks, skillMdPath) {
  const errors = [];
  if (!manifest.name) errors.push('manifest.name is required');
  if (!manifest.runtime) errors.push('manifest.runtime is required');
  if (manifest.runtime && manifest.runtime !== 'engine-v2') {
    errors.push(`manifest.runtime must be "engine-v2" (got "${manifest.runtime}")`);
  }
  if (!manifest.actions || typeof manifest.actions !== 'object') {
    errors.push('manifest.actions must be an object');
  }
  for (const [actionName, action] of Object.entries(manifest.actions || {})) {
    if (!action.impl) { errors.push(`actions.${actionName}.impl is required`); continue; }
    if (!action.impl.type) errors.push(`actions.${actionName}.impl.type is required`);
    if (!action.impl.ref) { errors.push(`actions.${actionName}.impl.ref is required`); continue; }
    const block = blocks[action.impl.ref];
    if (!block) {
      errors.push(`actions.${actionName}: block name="${action.impl.ref}" not found in body`);
    } else if (action.impl.type === 'http' && block.lang !== 'http') {
      errors.push(`actions.${actionName}: impl.type=http but block lang="${block.lang}"`);
    } else if (action.impl.type === 'bash' && block.lang !== 'bash') {
      errors.push(`actions.${actionName}: impl.type=bash but block lang="${block.lang}"`);
    }
  }
  if (errors.length) {
    throw new Error(`Invalid skill ${skillMdPath}:\n  - ${errors.join('\n  - ')}`);
  }
}

module.exports = { parseSkill, validateSkill };
