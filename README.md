# aigent-company

**Sistema de departamentos agénticos** para automatizar áreas de la empresa con Claude (y otros LLMs vía MCP). Plataforma principal: Claude Code / Cowork. Secundaria: OpenCode.

Cada departamento (marketing, sales, software, …) tiene su propio **orquestador**, **agentes especialistas** y **skills reutilizables**. El usuario habla con un único punto de entrada (`BOSS`) y el sistema enruta la petición al especialista adecuado, coordina varios cuando hace falta, y guarda los entregables como archivos reales fuera del motor.

## Qué resuelve

- **Departamentos completos sin contratar al departamento.** Cada equipo agéntico cubre el rol esencial de su disciplina con disciplina operativa real (rúbricas, frameworks, checklists, plantillas).
- **Independientes pero coordinados.** Instalas solo los departamentos que necesitas; las skills compartidas (`_shared/`) se cargan siempre — si después añades otro dept, ya está integrado.
- **Outputs auditables.** Cada agente produce archivos (`.md`, `.html`, `.xlsx`, …) en la carpeta del proyecto, no respuestas en chat. Lo que se genera se versiona, se comparte, se itera.
- **Una sola fuente de verdad por skill.** Las skills v1 (prosa para LLM) y v2 (ejecutables contra APIs HTTP) viven en un único `SKILL.md`. El instalador las distribuye al IDE que tengas configurado.

## Departamentos

Cada departamento implementado tiene su **README propio** con casos de uso y ejemplos de invocación (enlaces abajo). El **inventario completo y los conteos** —cada agente y cada skill, una frase por cada uno— viven en el índice maestro **[`.aigent/README.md`](./.aigent/README.md)**, única fuente de verdad. Este README no duplica el catálogo a propósito, para que no se desincronice.

| Departamento | Estado | Detalle |
|---|---|---|
| Marketing | ✅ implementado | [casos de uso](./.aigent/departments/marketing/README.md) |
| Sales | ✅ implementado | [casos de uso](./.aigent/departments/sales/README.md) |
| Software | ✅ implementado | [casos de uso](./.aigent/departments/software/README.md) |
| HR | ✅ implementado | [casos de uso](./.aigent/departments/hr/README.md) |
| Product | ✅ implementado | [casos de uso](./.aigent/departments/product/README.md) |
| Finance | ✅ implementado | [casos de uso](./.aigent/departments/finance/README.md) |
| Legal | ✅ implementado | [casos de uso](./.aigent/departments/legal/README.md) |
| Design | ✅ implementado | [casos de uso](./.aigent/departments/design/README.md) |
| Operations | 🚧 parcial | skill v2 `operations-redmine`; agentes stub |
| DevOps | 🚧 TODO | stubs honestos |
| `_shared/` (transversal) | ✅ activo | [skills y agentes compartidos](./.aigent/departments/_shared/README.md) |

## Estructura del repo

```
.aigent/                    ← motor del sistema (definiciones de agentes, skills, orquestadores)
.context/                   ← memoria del proyecto (config global y por proyecto, PRDs, tareas)
<contenido generado>/       ← entregables (fuera de .aigent y .context)
```

## Empezar

1. **Instalar el cableado para tu IDE:**
   ```bash
   bash .aigent/IDE/install.sh           # Unix / macOS
   .\.aigent\IDE\install.ps1             # Windows
   ```
   El instalador detecta qué IDEs tienes configurados (Claude Code, OpenCode, …) y propaga los agentes y skills al sitio correcto. `_shared/` se distribuye siempre.

2. **Abrir la carpeta en tu IDE** (Claude Code / Cowork / OpenCode).

3. **Pedir algo a `BOSS`** ("necesito un post sobre X", "prepara una propuesta para la cuenta Y", "redacta el DPA con el proveedor Z", …). El sistema clasifica la petición, decide qué departamento, qué orquestador, qué especialista, y produce los archivos en la carpeta del proyecto.

## Cómo extender

| Quieres… | Ruta |
|---|---|
| Añadir o auditar un agente | Skill `shared-agent-scaffold` (en `.aigent/departments/_shared/skills/shared-agent-scaffold/`) |
| Añadir o auditar una skill | Agente `shared-skill-builder`, que usa `shared-skill-scaffold` y considera ubicación (dept vs `_shared/`) |
| Añadir un departamento nuevo | Copiar `_shared/orchestrator-template.md` + crear agentes con `shared-agent-scaffold` |
| Crear una skill compartida | Aplicar criterios de `conventions.md` §7.1; vive en `_shared/skills/` con prefijo `shared-` |

Detalle de convenciones de naming, frontmatter, estructura y skills v2 ejecutables: [`.aigent/departments/_shared/conventions.md`](./.aigent/departments/_shared/conventions.md).

Bootstrap, routing y reglas de oro del sistema en runtime: [`.aigent/BOSS.md`](./.aigent/BOSS.md).

## Documentos clave

- [`.aigent/README.md`](./.aigent/README.md) — Inventario completo + catálogo rápido por agente y skill.
- [`.aigent/BOSS.md`](./.aigent/BOSS.md) — Entrada global del sistema en runtime, bootstrap y routing.
- [`.aigent/CHANGELOG.md`](./.aigent/CHANGELOG.md) — Versiones y cambios material por release.
- [`.aigent/VERSION`](./.aigent/VERSION) — Versión actual del framework.
- [`.aigent/departments/_shared/conventions.md`](./.aigent/departments/_shared/conventions.md) — Convenciones del repo (naming, estructura, skills v2).
- [`.aigent/departments/_shared/output-rules.md`](./.aigent/departments/_shared/output-rules.md) — Regla universal de outputs (archivos reales fuera de `.aigent/` y `.context/`).

## Repositorio

GitHub: [`github.com/WaimaGroup/aigent-company`](https://github.com/WaimaGroup/aigent-company)
