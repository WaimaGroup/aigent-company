---
name: "software-readme"
user-invocable: true
description: >
  Skill for writing or refreshing a project README.md — the door of the
  project. Covers purpose, quick start (install + first use), structure,
  configuration, contribution and pointers. Adapts to project type (library,
  CLI, web app, internal tool). Stack agnostic.
---

# Skill: README — README.md del proyecto

**Entregable:** archivo `README.md` en la raíz del repo del proyecto (o donde indique el orquestador). Se crea si no existe, o se actualiza preservando bloques marcados como custom por el usuario.

---

## Cuándo usar esta skill

- El repo no tiene README o lo tiene desactualizado, y se quiere uno que sirva tanto a nuevos integrantes como a usuarios externos.
- Tras un cambio sustancial del proyecto (rename, refactor de la estructura, cambio de stack) que invalida el README actual.
- Para proyectos nuevos: producir el README de día 1 sin entregar un placeholder.

**Cuándo NO usar:**

- Para guía de desarrollo extendida (setup detallado, arquitectura interna, decisiones) — eso es `dev-guide`.
- Para guía de migración entre versiones — eso es `migration-guide`.
- Para documentación de un componente del Design System — eso vive en design (`ds-component-doc`).
- Para una landing page de marketing — eso es responsabilidad de marketing (`landing-page`).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Tipo de proyecto | ¿Library / CLI / web app / API / monorepo / internal tool / framework? El tipo orienta secciones obligatorias. |
| Nombre y "one-liner" | ¿Cuál es el nombre canónico y la frase que lo resume en una línea? |
| Público objetivo | ¿Para quién es este README? (devs externos que evalúan, devs internos que onboardan, ops que despliegan, todos a la vez). |
| Estado / madurez | ¿Alpha · Beta · Stable · Maintenance · Deprecated? |
| Stack principal | Lenguaje · framework · runtime · base de datos · gestor de paquetes. |
| Cómo se ejecuta / instala | Comandos exactos. Si hay varios entornos (dev/prod), declararlos. |
| Cómo se prueba | Comando de tests + cómo verificar localmente. |
| Variables de entorno / config | Lista de las imprescindibles (sin valores). ¿Hay `.env.example`? |
| Links externos | Docs, dashboards, dashboards, issue tracker, design system, slack channel. |
| Licencia | ¿Hay LICENSE? ¿Cuál? |
| Contribución | ¿Hay CONTRIBUTING.md, CODE_OF_CONDUCT.md, plantilla de PR? |

---

## Plantilla del entregable

```markdown
# <Project Name>

<Una sola frase. Qué hace este proyecto y para quién.>

[![Status](badge)](url) [![CI](badge)](url) [![License](badge)](url)
<Badges opcionales, solo los útiles. No saturar.>

---

## Qué resuelve

<2-4 líneas. Por qué existe el proyecto, qué problema cubre, qué lo diferencia de alternativas si las hay.>

---

## Quick start

### Requisitos

- <runtime · versión mínima>
- <herramienta CLI · versión>
- <otra dependencia del entorno>

### Instalación

```bash
# Comandos exactos. Sin abreviar.
<comando 1>
<comando 2>
```

### Primer uso

```bash
<comando o ejemplo mínimo que demuestra que funciona>
```

<3-5 líneas explicando qué hace ese ejemplo y qué se espera ver.>

---

## Uso / API

<Bloque adaptado al tipo de proyecto:>

### Para una library

```<lenguaje>
import { thing } from "<package>";

const result = thing({ key: "value" });
```

<3-5 líneas describiendo casos principales y dónde está la API completa.>

### Para un CLI

```bash
<cli> <command> --flag <value>
```

| Comando | Para qué |
|---|---|
| `<command 1>` | <una línea> |
| `<command 2>` | <una línea> |

### Para una web app / API

- **URL local:** http://localhost:<port>
- **Endpoints principales:** ver `docs/` o `<path al api-spec>`.
- **Health check:** `GET /health`

---

## Configuración

Variables de entorno principales (lista completa en `.env.example`):

| Variable | Default | Para qué |
|---|---|---|
| `<VAR_1>` | <default o "—"> | <una línea> |
| `<VAR_2>` | <default o "—"> | <una línea> |

> Para entornos productivos consultar `<dev-guide o runbook>`.

---

## Estructura del repo

```
<raíz>/
├── <carpeta 1>/   ← <qué hay aquí>
├── <carpeta 2>/   ← <qué hay aquí>
├── tests/         ← tests automatizados
└── docs/          ← documentación extendida
```

---

## Tests

```bash
<comando para correr la suite>
```

- Unit: `<comando>` (rápido, sin red).
- Integration: `<comando>` (requiere `<servicio levantado>`).
- E2E: `<comando>` (más lento, requiere `<entorno>`).

---

## Deploy / Release

> Resumen mínimo. Para el procedimiento operativo completo, ver `<runbook>` o `<dev-guide>`.

- <Tipo de deploy: CI/CD automático on `main`, manual, etc.>
- <Versionado: semver, calendar, otro.>
- <Link al pipeline si aplica.>

---

## Documentación adicional

- 📘 **Dev guide** — setup de desarrollo, arquitectura interna, contribución avanzada: `<path al dev-guide>`.
- 🧭 **Architecture & ADRs** — decisiones de diseño: `<path a architecture/>`.
- 🚦 **Runbook** — operación en producción: `<path al runbook>`.
- 🔄 **Migration guides** — saltos de versión: `<path>`.
- 🌐 **API spec** — si aplica: `<path al api-spec>`.

---

## Contribuir

<Bloque corto. Detalles completos en CONTRIBUTING.md si existe.>

1. Fork / branch desde main.
2. Tests pasan localmente (`<comando>`).
3. PR con descripción usando la plantilla del repo (si existe).
4. CI verde antes de pedir review.

Reportar bugs: <link al issue tracker>.

---

## Licencia

<Tipo de licencia> — ver `LICENSE`.

---

## Mantenedores

- <nombre o equipo> (<rol opcional>)
- <nombre o equipo>
```

---

## Reglas de redacción

- **Sin marketing-speak.** "Blazingly fast", "revolutionary", "next-gen" — fuera. El README convence con ejemplos concretos, no con adjetivos.
- **Primera persona ausente.** Evitar "nosotros / yo". El README habla del proyecto, no de quien lo escribió.
- **Comandos ejecutables tal cual.** Si copy-paste no funciona, el README está roto. Probar todos los comandos antes de cerrar.
- **Versiones explícitas.** "Node 20", no "Node moderno". "Python 3.11+", no "Python reciente".
- **Links relativos en el repo.** `[docs](./docs/)` no `[docs](https://github.com/.../docs/)` (rompe en forks).
- **Sin secciones vacías.** Si una sección no aplica al tipo de proyecto (ej. "Deploy" para una library), omitirla.

---

## Proceso

1. **Recopilar** información (sección anterior).
2. **Leer el README actual** si existe. Identificar bloques con valor a preservar (anuncios, badges custom, mantenedores específicos).
3. **Adaptar la plantilla al tipo de proyecto** (library / CLI / web / API). Eliminar las secciones que no aplican.
4. **Verificar comandos** consultando el repo: ¿el `npm install` propuesto coincide con el `package.json` real? ¿El `pytest` está realmente configurado?
5. **Marcar con `[COMPLETAR]`** lo que el usuario debe rellenar (mantenedores reales, links a issue tracker, badges con URLs específicas).
6. **Cuidar el orden mental del lector:**
   - "¿Qué es?" (one-liner)
   - "¿Por qué me interesa?" (qué resuelve)
   - "¿Cómo lo pruebo en 5 minutos?" (quick start)
   - "¿Cómo lo uso de verdad?" (uso / API)
   - "¿Cómo lo configuro?" (configuración)
   - "¿Cómo lo extiendo?" (estructura + tests + contribuir)
   - "¿A dónde voy si quiero más?" (documentación adicional)
7. **Guardar** en la raíz del repo (`README.md`).
8. **Reportar al usuario:**
   - Ruta del archivo creado/actualizado.
   - Bloques preservados del README original (si aplica).
   - Secciones marcadas `[COMPLETAR]` que necesitan input humano.
   - Próximo paso: `dev-guide` si se quiere documentación extendida, `runbook` si se quiere documentar operación productiva.

---

## Restricciones

- **No incluir secretos** (URLs internas privadas, tokens, datos de clientes) en el README. Para esos, `.env.example` con placeholders.
- **No copiar texto generado por marketing** sin adaptarlo al tono del README (que es informativo, no persuasivo).
- **No prometer features que no existen.** Solo se documenta lo que está implementado y funciona en la versión actual. Para roadmap, link a otro doc.
- **No sustituir documentación profunda por README extenso.** Si el README pasa de 300 líneas, conviene separar el detalle en `docs/` y dejar el README como puerta. Usar `dev-guide` para el detalle.
- **No olvidar el "qué resuelve".** Un README sin esta sección es un manual de instalación, no un README.
- **No marketing-speak.** Insistir: "blazingly fast" es ruido.
- Aplican las reglas de output de `_shared/output-rules.md`. Excepción explícita: el README vive en la raíz del repo del proyecto, no en `<proyecto>/software/...` — porque ése es su sitio canónico.
