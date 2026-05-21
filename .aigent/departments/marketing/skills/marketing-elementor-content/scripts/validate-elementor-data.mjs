#!/usr/bin/env node
// Validador específico de `_elementor_data.json` para la skill marketing-elementor-content.
//
// Uso:
//   node validate-elementor-data.mjs <path/to/_elementor_data.json> [--strict] [--quiet]
//
// Exit codes:
//   0 — válido (sin errores). Warnings posibles si no se pasa --strict.
//   1 — errores encontrados (estructura, IDs, columnas, widgetType, isInner…).
//   2 — uso incorrecto (path no aportado, archivo no existe, etc.).
//
// Output (stdout): JSON estructurado:
//   { "ok": bool, "errors": [...], "warnings": [...], "stats": {...}, "file": "..." }
//
// Sin dependencias externas. Node 18+ recomendado por `fs/promises`.

import { readFile } from "node:fs/promises";
import { argv, exit, stdout, stderr } from "node:process";

// ─────────────────────────────────────────────────────────────────────────────
// Catálogo de widgets core soportados por la skill marketing-elementor-content.
// Mantener sincronizado con la sección "Catálogo de widgets core" del SKILL.md.
// ─────────────────────────────────────────────────────────────────────────────
const CORE_WIDGETS = new Set([
  "heading", "text-editor", "image", "button",
  "icon-box", "image-box", "icon-list",
  "spacer", "divider", "video",
  "testimonial", "tabs", "accordion", "toggle",
  "social-icons", "counter", "progress", "alert",
  "html", "shortcode", "google_maps",
]);

const VALID_EL_TYPES = new Set(["section", "column", "widget"]);

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argvList) {
  const args = { path: null, strict: false, quiet: false };
  for (const a of argvList.slice(2)) {
    if (a === "--strict") args.strict = true;
    else if (a === "--quiet") args.quiet = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (!a.startsWith("--") && !args.path) args.path = a;
  }
  return args;
}

function printHelp() {
  stdout.write(`validate-elementor-data — validador específico de _elementor_data.json

Uso:
  node validate-elementor-data.mjs <path/to/_elementor_data.json> [--strict] [--quiet]

Flags:
  --strict    Sale con código 1 también si solo hay warnings (sin errores).
  --quiet     No imprime el JSON de resumen; solo exit code.
  --help, -h  Muestra esta ayuda.

Exit codes:
  0 = válido
  1 = errores (o warnings con --strict)
  2 = uso incorrecto
`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Validación
// ─────────────────────────────────────────────────────────────────────────────
function makeResult(file) {
  return {
    ok: false,
    errors: [],
    warnings: [],
    stats: { sections: 0, columns: 0, widgets: 0, inner_sections: 0, ids: 0 },
    file,
  };
}

function pushError(res, path, message, extra) {
  const entry = { path, message };
  if (extra !== undefined) entry.extra = extra;
  res.errors.push(entry);
}
function pushWarning(res, path, message, extra) {
  const entry = { path, message };
  if (extra !== undefined) entry.extra = extra;
  res.warnings.push(entry);
}

/**
 * Recorre el árbol y valida nodo a nodo.
 * @param {object} node      nodo actual
 * @param {string} path      path JSON-like ($[0].elements[1])
 * @param {Set<string>} ids  acumulador global de IDs vistos
 * @param {boolean|null} parentIsInner  flag heredado para validar isInner consistency
 * @param {object} res       resultado
 */
function walk(node, path, ids, parentIsInner, res) {
  // Tipo correcto
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    pushError(res, path, "Nodo no es un objeto");
    return;
  }

  // Claves obligatorias
  for (const key of ["id", "elType", "settings", "elements"]) {
    if (!(key in node)) {
      pushError(res, path, `Falta clave obligatoria '${key}'`);
      return;
    }
  }

  // id
  if (typeof node.id !== "string" || node.id.length === 0) {
    pushError(res, path, "id debe ser string no vacío");
  } else {
    if (ids.has(node.id)) {
      pushError(res, path, `id duplicado: '${node.id}'`);
    } else {
      ids.add(node.id);
      res.stats.ids++;
    }
    if (!/^[a-f0-9]{6,10}$/i.test(node.id) && !/^[a-z0-9_-]{4,16}$/i.test(node.id)) {
      pushWarning(res, path, `id '${node.id}' no sigue el patrón habitual (7-8 chars alfanuméricos)`);
    }
  }

  // elType
  if (!VALID_EL_TYPES.has(node.elType)) {
    pushError(res, path, `elType inválido: '${node.elType}' (esperado: section|column|widget)`);
    return;
  }

  // settings es objeto
  if (node.settings === null || typeof node.settings !== "object" || Array.isArray(node.settings)) {
    pushError(res, path, "settings debe ser un objeto");
  }

  // elements es array
  if (!Array.isArray(node.elements)) {
    pushError(res, path, "elements debe ser un array");
    return;
  }

  // isInner aplica a sections y columns (Elementor lo propaga). NO a widgets.
  const declaredIsInner = node.isInner === true;
  if (declaredIsInner && node.elType === "widget") {
    pushError(res, path, "isInner: true no aplica a widgets, solo a sections y columns");
  }

  // Reglas específicas por elType
  if (node.elType === "section") {
    res.stats.sections++;
    if (declaredIsInner) res.stats.inner_sections++;

    // Columnas hijas: deben sumar 100 en _column_size
    const colSizes = [];
    let colsCount = 0;
    for (const child of node.elements) {
      if (child && typeof child === "object" && child.elType === "column") {
        colsCount++;
        const sz = child.settings && child.settings._column_size;
        if (typeof sz === "number") colSizes.push(sz);
        else if (typeof sz === "string" && !isNaN(parseFloat(sz))) colSizes.push(parseFloat(sz));
        else pushWarning(res, `${path}.elements[${node.elements.indexOf(child)}]`, "_column_size ausente o no numérico");
      }
    }
    if (colsCount > 0 && colSizes.length === colsCount) {
      const total = colSizes.reduce((a, b) => a + b, 0);
      if (Math.abs(total - 100) > 1) {
        pushError(res, path, `Las columnas de esta sección no suman 100 (suman ${total}). Cada _column_size en %.`);
      }
    }

    // isInner consistency: si la section es inner, todas sus columns deben serlo (y viceversa).
    for (let i = 0; i < node.elements.length; i++) {
      const child = node.elements[i];
      const childPath = `${path}.elements[${i}]`;
      if (child && child.elType === "column") {
        if (declaredIsInner && child.isInner !== true) {
          pushError(res, childPath, "Esta column debe tener isInner: true (su section padre lo tiene)");
        }
        if (!declaredIsInner && child.isInner === true) {
          pushError(res, childPath, "Esta column tiene isInner: true pero su section padre NO");
        }
      } else if (child && child.elType !== "column") {
        pushError(res, childPath, `Hijo directo de section debe ser column, no '${child.elType}'`);
      }
    }
  } else if (node.elType === "column") {
    res.stats.columns++;
    for (let i = 0; i < node.elements.length; i++) {
      const child = node.elements[i];
      const childPath = `${path}.elements[${i}]`;
      if (!child || typeof child !== "object") {
        pushError(res, childPath, "Hijo de column inválido");
        continue;
      }
      if (child.elType !== "widget" && child.elType !== "section") {
        pushError(res, childPath, `Hijo de column debe ser widget o section, no '${child.elType}'`);
      }
    }
  } else if (node.elType === "widget") {
    res.stats.widgets++;
    if (!("widgetType" in node)) {
      pushError(res, path, "widget debe declarar widgetType");
    } else if (typeof node.widgetType !== "string" || node.widgetType.length === 0) {
      pushError(res, path, "widgetType debe ser string no vacío");
    } else if (!CORE_WIDGETS.has(node.widgetType)) {
      pushError(res, path, `widgetType '${node.widgetType}' no está en el catálogo core de la skill`, {
        catalog: [...CORE_WIDGETS],
      });
    }
    if (node.elements.length > 0) {
      pushWarning(res, path, "widget tiene 'elements' no vacío — debería ser []");
    }

    // icon-list: cada item necesita _id único y selected_icon (no icon)
    if (node.widgetType === "icon-list") {
      const items = node.settings && Array.isArray(node.settings.icon_list) ? node.settings.icon_list : [];
      const seen = new Set();
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const ip = `${path}.settings.icon_list[${i}]`;
        if (!it || typeof it !== "object") {
          pushError(res, ip, "item de icon-list inválido");
          continue;
        }
        if (!("_id" in it) || !it._id) {
          pushError(res, ip, "item de icon-list sin '_id' único (Elementor mezcla items al editar)");
        } else if (seen.has(it._id)) {
          pushError(res, ip, `_id duplicado en icon-list: '${it._id}'`);
        } else {
          seen.add(it._id);
        }
        if ("icon" in it && !("selected_icon" in it)) {
          pushError(res, ip, "icon-list item usa 'icon' (legacy) en lugar de 'selected_icon' — Elementor moderno espera selected_icon");
        }
      }
    }

    // html widget: warning si lleva <script>
    if (node.widgetType === "html") {
      const html = (node.settings && node.settings.html) || "";
      if (typeof html === "string" && /<script\b/i.test(html)) {
        pushWarning(res, path, "widget html contiene <script> — la mayoría de sitios lo strippearán o lo bloquearán");
      }
    }
  }

  // Recursión a los hijos
  for (let i = 0; i < node.elements.length; i++) {
    walk(node.elements[i], `${path}.elements[${i}]`, ids, declaredIsInner || parentIsInner === true, res);
  }
}

async function validate(filePath, opts) {
  const res = makeResult(filePath);

  let raw;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (e) {
    pushError(res, "$", `No se pudo leer el archivo: ${e.message}`);
    return res;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    pushError(res, "$", `JSON inválido: ${e.message}`);
    return res;
  }

  if (!Array.isArray(parsed)) {
    pushError(res, "$", "El JSON raíz debe ser un array de secciones");
    return res;
  }

  if (parsed.length === 0) {
    pushWarning(res, "$", "El array de secciones está vacío");
  }

  const ids = new Set();
  for (let i = 0; i < parsed.length; i++) {
    const node = parsed[i];
    if (!node || typeof node !== "object") {
      pushError(res, `$[${i}]`, "Elemento del array raíz no es un objeto");
      continue;
    }
    if (node.elType !== "section") {
      pushError(res, `$[${i}]`, `El array raíz solo admite sections, encontrado '${node.elType}'`);
    }
    walk(node, `$[${i}]`, ids, null, res);
  }

  res.ok = res.errors.length === 0 && (!opts.strict || res.warnings.length === 0);
  return res;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(argv);

  if (args.help) {
    printHelp();
    exit(0);
  }

  if (!args.path) {
    stderr.write("Error: falta el path al archivo. Usa --help para ver el uso.\n");
    exit(2);
  }

  const res = await validate(args.path, { strict: args.strict });

  if (!args.quiet) {
    stdout.write(JSON.stringify(res, null, 2) + "\n");
  }

  if (res.errors.length > 0) exit(1);
  if (args.strict && res.warnings.length > 0) exit(1);
  exit(0);
}

main().catch((e) => {
  stderr.write(`fatal: ${e.stack || e.message}\n`);
  exit(2);
});
