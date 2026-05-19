// audit.js — Auditoría estructural de TODO el repo: skills (v1 + v2) + agentes
// (orquestadores, especialistas, compartidos).
//
// Comprueba que cada archivo cumple las convenciones de _shared/conventions.md.
// Devuelve errores (bloqueantes) y warnings (no bloquean, pero conviene corregir).
//
// Se usa desde el comando `engine.js audit-repo`.

'use strict';

const fs = require('fs');
const path = require('path');

const SKILL_V1_REQUIRED_SECTIONS = [
  /^#\s+Skill:/m,
  /\*\*Entregable:\*\*/m,
  /^##\s+Cuándo usar esta skill/m,
];

const AGENT_REQUIRED_SECTIONS = [
  /^##\s+Rol\b/m,
  /^##\s+Principios fundamentales\b/m,
  /^##\s+Proceso de trabajo\b/m,
  /^##\s+Skills disponibles\b/m,
  /^##\s+Restricciones\b/m,
  /^##\s+Output esperado\b/m,
];

const AGENT_STUB_SECTIONS = [
  /^##\s+Estado\b/m,
  /^##\s+Qué hacer\b/m,
];

const ORCHESTRATOR_REQUIRED_SECTIONS = [
  /^##\s+Rol\b/m,
  /^##\s+Agentes disponibles\b/m,
];

/**
 * Extrae el frontmatter (entre ---) y body de un .md.
 * Devuelve { fm: object, body: string } o { error: string } si no parsea.
 */
function readFrontmatter(filePath) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch (e) { return { error: `cannot read: ${e.message}` }; }
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { error: 'no frontmatter delimiters' };
  const fmRaw = m[1];
  const body = m[2];
  const fm = {};
  // Parser muy simple: solo extrae scalars y folded `>`
  const lines = fmRaw.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const scalar = line.match(/^([a-zA-Z_-][a-zA-Z0-9_-]*):\s*(.*)$/);
    if (scalar) {
      const key = scalar[1];
      let value = scalar[2].trim();
      if (value === '>' || value === '|') {
        // folded: leer líneas indentadas
        const acc = [];
        i++;
        while (i < lines.length && /^\s+\S/.test(lines[i])) {
          acc.push(lines[i].trim());
          i++;
        }
        fm[key] = acc.join(' ');
        continue;
      }
      value = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      if (value === 'true') fm[key] = true;
      else if (value === 'false') fm[key] = false;
      else fm[key] = value;
    }
    i++;
  }
  return { fm, body };
}

function auditSkill(filePath, dept, folder) {
  const errors = [];
  const warnings = [];
  const prefix = dept === '_shared' ? 'shared' : dept;

  // 1) Carpeta empieza por el prefijo correcto
  if (!folder.startsWith(`${prefix}-`)) {
    errors.push(`folder "${folder}" should start with "${prefix}-" (conventions §4.1)`);
  }

  const parsed = readFrontmatter(filePath);
  if (parsed.error) {
    errors.push(`frontmatter: ${parsed.error}`);
    return { errors, warnings };
  }
  const { fm, body } = parsed;

  // 2) Frontmatter campos obligatorios
  if (!fm.name) errors.push('name is missing in frontmatter');
  else if (fm.name !== folder) {
    errors.push(`name "${fm.name}" must equal folder name "${folder}" (conventions §4.1)`);
  }

  if (fm['user-invocable'] !== true) {
    errors.push('user-invocable: true is required in frontmatter (conventions §7.1)');
  }

  if (!fm.description) warnings.push('description is missing or empty in frontmatter');

  const isV2 = fm.runtime === 'engine-v2';

  // 3) Body — secciones obligatorias
  if (isV2) {
    // v2 lo valida el lint del engine (engine.js validate), aquí solo chequeo mínimo
    if (!/```http\s+name=/.test(body)) {
      warnings.push('v2 skill: no http blocks found in body — engine.js validate will catch this');
    }
  } else {
    for (const re of SKILL_V1_REQUIRED_SECTIONS) {
      if (!re.test(body)) {
        warnings.push(`v1 skill: missing section matching ${re}`);
      }
    }
  }

  return { errors, warnings };
}

function auditAgent(filePath, role) {
  // role: "orchestrator" | "specialist" | "shared" | "stub-candidate"
  const errors = [];
  const warnings = [];
  const parsed = readFrontmatter(filePath);
  if (parsed.error) {
    errors.push(`frontmatter: ${parsed.error}`);
    return { errors, warnings };
  }
  const { fm, body } = parsed;

  if (!fm.name) errors.push('name is missing in frontmatter');
  if (!fm.description) warnings.push('description is missing or empty in frontmatter');

  // mode: §5.1
  const expectedMode = role === 'orchestrator' ? 'primary' : 'subagent';
  if (!fm.mode) {
    errors.push(`mode is missing — must be "${expectedMode}" (conventions §5.1)`);
  } else if (fm.mode !== expectedMode) {
    errors.push(`mode "${fm.mode}" must be "${expectedMode}" (conventions §5.1)`);
  }

  // Detectar stub honesto: description menciona "TODO" o "not yet implemented" Y
  // el body NO tiene "## Rol" (los stubs honestos usan solo "## Estado" + "## Qué hacer").
  // Esto evita falsos positivos cuando un orquestador funcional describe que SUS AGENTES
  // (no él) son stubs.
  const descSignalsStub = typeof fm.description === 'string' &&
    (/\bTODO\b/.test(fm.description) || /not yet implemented/i.test(fm.description));
  const bodyHasRol = /^##\s+Rol\b/m.test(body);
  const isStub = descSignalsStub && !bodyHasRol;

  if (isStub) {
    for (const re of AGENT_STUB_SECTIONS) {
      if (!re.test(body)) warnings.push(`stub agent: missing section matching ${re}`);
    }
  } else if (role === 'orchestrator') {
    for (const re of ORCHESTRATOR_REQUIRED_SECTIONS) {
      if (!re.test(body)) warnings.push(`orchestrator: missing section matching ${re}`);
    }
  } else {
    for (const re of AGENT_REQUIRED_SECTIONS) {
      if (!re.test(body)) warnings.push(`agent body: missing section matching ${re}`);
    }
    // Output esperado debe referenciar output-rules.md
    if (/^##\s+Output esperado\b/m.test(body) && !/output-rules\.md/.test(body)) {
      warnings.push('Output esperado section should reference _shared/output-rules.md (conventions §5)');
    }
  }

  return { errors, warnings };
}

/**
 * Audita todo el repo. Devuelve estructura { ok, data: { skills: [], agents: [] }, summary }.
 */
function auditRepo(departmentsDir) {
  const skills = [];
  const agents = [];

  if (!fs.existsSync(departmentsDir)) {
    return { ok: false, error: { code: 'NOT_FOUND', message: `departments dir not found: ${departmentsDir}` }, meta: {} };
  }

  for (const deptEntry of fs.readdirSync(departmentsDir, { withFileTypes: true })) {
    if (!deptEntry.isDirectory()) continue;
    const dept = deptEntry.name;
    const deptPath = path.join(departmentsDir, dept);

    // Skills
    const skillsDir = path.join(deptPath, 'skills');
    if (fs.existsSync(skillsDir)) {
      for (const sk of fs.readdirSync(skillsDir, { withFileTypes: true })) {
        if (!sk.isDirectory()) continue;
        const skillMd = path.join(skillsDir, sk.name, 'SKILL.md');
        if (!fs.existsSync(skillMd)) continue;
        const res = auditSkill(skillMd, dept, sk.name);
        skills.push({
          path: path.relative(process.cwd(), skillMd),
          dept,
          folder: sk.name,
          errors: res.errors,
          warnings: res.warnings,
        });
      }
    }

    // Orquestador
    if (dept !== '_shared') {
      const orch = path.join(deptPath, `${dept}-orchestrator.md`);
      if (fs.existsSync(orch)) {
        const res = auditAgent(orch, 'orchestrator');
        agents.push({
          path: path.relative(process.cwd(), orch),
          dept,
          role: 'orchestrator',
          errors: res.errors,
          warnings: res.warnings,
        });
      }
    }

    // Agentes especialistas o compartidos
    const agentsDir = path.join(deptPath, 'agents');
    if (fs.existsSync(agentsDir)) {
      for (const f of fs.readdirSync(agentsDir)) {
        if (!f.endsWith('.md')) continue;
        const p = path.join(agentsDir, f);
        const role = dept === '_shared' ? 'shared' : 'specialist';
        const res = auditAgent(p, role);
        agents.push({
          path: path.relative(process.cwd(), p),
          dept,
          role,
          errors: res.errors,
          warnings: res.warnings,
        });
      }
    }
  }

  const skillErrors = skills.reduce((n, s) => n + s.errors.length, 0);
  const skillWarnings = skills.reduce((n, s) => n + s.warnings.length, 0);
  const agentErrors = agents.reduce((n, a) => n + a.errors.length, 0);
  const agentWarnings = agents.reduce((n, a) => n + a.warnings.length, 0);

  const filesWithErrors = [
    ...skills.filter((s) => s.errors.length > 0),
    ...agents.filter((a) => a.errors.length > 0),
  ];

  return {
    ok: skillErrors + agentErrors === 0,
    data: {
      summary: {
        skills_total: skills.length,
        skills_errors: skillErrors,
        skills_warnings: skillWarnings,
        agents_total: agents.length,
        agents_errors: agentErrors,
        agents_warnings: agentWarnings,
      },
      files_with_errors: filesWithErrors,
      files_with_warnings_only: [
        ...skills.filter((s) => s.errors.length === 0 && s.warnings.length > 0),
        ...agents.filter((a) => a.errors.length === 0 && a.warnings.length > 0),
      ],
    },
    meta: { departments_dir: departmentsDir },
  };
}

module.exports = { auditRepo, auditSkill, auditAgent };
