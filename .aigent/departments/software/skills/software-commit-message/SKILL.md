---
name: "software-commit-message"
user-invocable: true
description: >
  Skill for writing a high-quality commit message from a diff. Defaults to
  Conventional Commits (type(scope): subject + body + footer), but adapts to the
  project's convention if declared. Produces a single message ready to paste —
  not multiple variants. Stack agnostic.
---

# Skill: Commit Message — mensaje de commit a partir del diff

**Entregable:** un único bloque de texto con el commit message listo para usar (subject + body + footer). Por defecto se entrega en el chat para que el usuario lo pegue al hacer `git commit`. Si el proyecto pide registrarlos, se guarda en `<proyecto>/software/code/.commits/<short-sha-or-branch>.txt` o donde indique el orquestador.

---

## Cuándo usar esta skill

- Acaba de cerrarse un cambio (feature, fix, refactor, migración) y hay que escribir el mensaje del commit.
- El usuario tiene un diff staged y quiere un commit que respete las convenciones del repo y sea útil para changelog / blame.
- Se va a generar un commit que va a quedar en la historia pública del proyecto (release, branch principal).

**Cuándo NO usar:**

- Para describir un PR completo — eso es `pr-description` (cubre el agregado de todos los commits + contexto del cambio).
- Para una entrada de changelog — eso es `changelog-entry` (orientado a humanos consumidores del producto, no al historial de git).
- Para un commit local "WIP" / "fixup" que va a ser squash-mergeado.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Diff o resumen del cambio | ¿Cuál es el diff (output de `git diff --staged`) o un resumen de los archivos tocados y lo que cambian? |
| Convención del repo | ¿El repo usa Conventional Commits? ¿Otra (gitmoji, custom, ninguna)? Default: Conventional Commits. |
| Scopes válidos | Si Conventional Commits con scopes: ¿qué scopes existen? (ej. `api`, `ui`, `db`, `infra`). Si no se sabe, derivar del path de los archivos tocados. |
| Breaking change | ¿Introduce este cambio una incompatibilidad? (afecta a `!` en subject y footer `BREAKING CHANGE:`) |
| Refs | ¿Hay ticket, issue o PR asociado para referenciar en el footer? (`Refs: #123`, `Closes: ABC-456`) |
| Co-autores | ¿Hay co-autores que añadir como `Co-authored-by:`? |

---

## Plantilla del entregable

### Conventional Commits (default)

```
<type>(<scope>)<!>: <subject en minúsculas, imperativo, < 50 chars, sin punto final>

<Body opcional. Líneas a ≤ 72 chars. Explica QUÉ cambia y POR QUÉ, no el cómo
(eso ya lo dice el diff). Si hay varios puntos, lista con guiones.>

<Footer opcional, separado por línea en blanco. Una clave por línea.>
BREAKING CHANGE: <descripción del breaking change si aplica>
Refs: #<issue>
Closes: #<issue>
Co-authored-by: Name <email@example.com>
```

**Tipos canónicos:**

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva para el usuario final / consumidor de la API. |
| `fix` | Corrección de bug que afecta a usuario / API consumidor. |
| `refactor` | Cambio de código sin cambio de comportamiento externo. |
| `perf` | Mejora de rendimiento medible. |
| `docs` | Solo documentación (README, comentarios, ADRs). |
| `test` | Solo añadir o corregir tests. |
| `build` | Sistema de build, dependencias, package.json/lock. |
| `ci` | Pipeline de CI/CD. |
| `chore` | Tareas auxiliares que no encajan en lo anterior (versionado, limpieza). |
| `style` | Formato, espacios, comas; nunca cambio de lógica. |
| `revert` | Revierte un commit previo. Subject: `revert: <subject del commit revertido>`. |

**Scope:** del path de los archivos tocados o de la lista declarada del repo. Si todos los cambios viven en un módulo (`api/`, `ui/`, `core/auth/`), usa ese. Si son cross-cutting, omitir scope.

**`!`** justo antes de `:` indica breaking change. Combinable con footer `BREAKING CHANGE:` (recomendado para que aparezca en changelog).

### Convención del repo distinta

Si el repo usa otra convención (gitmoji, custom), aplicarla. Mantener las mismas reglas de calidad:

- Subject corto, imperativo, sin punto final.
- Cuerpo separado por línea en blanco, explicando QUÉ y POR QUÉ.
- Footer con referencias a tickets / issues / co-autores.

---

## Reglas de calidad (siempre)

- **Subject < 50 chars** (admite 72 si la herramienta del repo lo permite, pero el default es 50).
- **Imperativo presente** ("add", "fix", "remove") — nunca pasado ("added", "fixed").
- **Minúscula inicial en el subject** tras los dos puntos del Conventional Commit. (Algunos proyectos usan mayúscula — respetar lo establecido si está documentado.)
- **Sin punto final en el subject.**
- **Línea en blanco entre subject y body, y entre body y footer.**
- **Líneas del body ≤ 72 chars.**
- **El body responde "qué" y "por qué", no "cómo".** El cómo está en el diff.
- **Un commit = un cambio lógico.** Si el diff cubre 3 cambios distintos, el output recomienda separar antes de generar.

---

## Proceso

1. **Recopilar** la información (sección anterior). Si solo se aporta diff y no la convención del repo, asumir Conventional Commits y declararlo en el reporte.
2. **Analizar el diff** para identificar:
   - Tipo del cambio (¿añade funcionalidad, arregla bug, refactor sin cambio externo, docs?).
   - Scope (módulo / capa / componente afectado).
   - Si hay breaking change (cambio de API pública, de schema, de comportamiento esperado por consumers).
3. **Validar atomicidad.** Si el diff mezcla 2-3 cambios distintos (feat + refactor en archivos no relacionados), avisar al usuario y proponer separar los commits antes de generar.
4. **Redactar el subject** respetando las reglas de calidad.
5. **Redactar el body** solo si aporta valor (cambio no trivial, motivo no evidente del diff, decisión que el revisor del PR / lector del blame necesita).
6. **Redactar el footer** con refs, closes, breaking change, co-autores según corresponda.
7. **Entregar** el mensaje en bloque de código en el chat, o escribirlo al archivo si el orquestador lo indicó.
8. **Reportar** al usuario:
   - El mensaje generado en bloque listo para copiar.
   - Convención usada (Conventional Commits o la declarada).
   - Si se detectó breaking change, marcarlo en el reporte para que no pase desapercibido.
   - Si se detectó atomicidad rota, recomendación de separar antes de commitear.

---

## Restricciones

- **No inventes contexto.** Si el diff no deja claro el "por qué", pregunta al usuario antes de inventar una razón.
- **No metas múltiples cambios en un solo commit.** El output rechaza generar un mensaje que mezcle `feat` + `refactor` + `fix` cuando son cambios separables — sugiere split.
- **No menciones nombres de personas reales** que no estén ya en el repo (autores de commits previos, reviewers) sin confirmación.
- **No incluyas secretos** (URLs internas, paths privados, datos de clientes) en el mensaje. El historial de git es público dentro del equipo.
- **No uses emojis** salvo que la convención del repo sea gitmoji explícitamente.
- **No firmes el commit** con `Signed-off-by:` salvo que el repo lo requiera (DCO).
- Aplican las reglas de output de `_shared/output-rules.md` — con la matización de que el output principal de esta skill es texto en chat por defecto (para pegar en `git commit`), no archivo en disco salvo que el orquestador lo pida.
