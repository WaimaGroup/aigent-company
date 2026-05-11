# aigent-company

Sistema de **departamentos agénticos** para automatizar áreas de la empresa con Claude (y otros LLMs vía MCP). Plataforma principal: Claude Code / Cowork. Secundaria: OpenCode.

Cada departamento (marketing, sales, operations, …) tiene su propio orquestador, agentes especialistas y skills reutilizables. El usuario se dirige a un único punto de entrada (`BOSS`) y el sistema enruta la petición al especialista adecuado, coordina varios cuando hace falta, y guarda los entregables como archivos reales fuera del motor.

## Estado actual

| Dept | Estado |
|---|---|
| Marketing | ✅ implementado (5 agentes, 11 skills) |
| Sales | ✅ implementado (4 agentes, 7 skills) |
| Operations | 🚧 parcial — orquestador stub + skill v2 ejecutable `redmine` |
| Design, DevOps, Finance, HR, Legal, Product, Software | 🚧 TODO — orquestadores y agentes stub honesto |

Inventario completo (agentes y skills por dept) en [`.aigent/README.md`](./.aigent/README.md).

## Estructura

```
.aigent/                    ← motor del sistema (definiciones de agentes, skills, orquestadores)
.context/                   ← memoria del proyecto (config global y por proyecto, PRDs, tareas)
<contenido generado>/       ← entregables (fuera de .aigent y .context)
```

## Empezar

1. Instala el cableado para tu IDE:
   ```bash
   bash .aigent/IDE/install.sh           # Unix / macOS
   .\.aigent\IDE\install.ps1             # Windows
   ```
2. Abre la carpeta en Claude Code / Cowork / OpenCode.
3. Pide algo a `BOSS` ("necesito un post sobre X", "prepara una propuesta para la cuenta Y", …) y el sistema delega.

Detalle del bootstrap, routing y reglas de oro en [`.aigent/BOSS.md`](./.aigent/BOSS.md). Convenciones de naming, frontmatter, estructura y skills v2 en [`.aigent/departments/_shared/conventions.md`](./.aigent/departments/_shared/conventions.md).

## Cómo extender

| Quieres… | Ruta |
|---|---|
| Añadir o auditar un agente | Skill `agent-scaffold` (`.aigent/departments/_shared/skills/agent-scaffold/`) |
| Añadir o auditar una skill | Agente `shared-skill-builder` (`.aigent/departments/_shared/agents/shared-skill-builder.md`), que usa `skill-scaffold` |
| Añadir un departamento | Copiar `_shared/orchestrator-template.md` y crear los agentes con `agent-scaffold` |

## Repositorio

GitHub: `https://github.com/WaimaGroup/aigent-company`
