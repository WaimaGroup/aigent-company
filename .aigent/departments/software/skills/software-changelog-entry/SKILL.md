---
name: "software-changelog-entry"
user-invocable: true
description: >
  Skill for writing or updating a CHANGELOG.md entry following Keep a Changelog
  conventions, from a list of merged PRs / commits for a release. Produces user-
  facing prose grouped by category (Added/Changed/Deprecated/Removed/Fixed/
  Security) with explicit BREAKING markers. Stack agnostic.
---

# Skill: Changelog Entry — entrada de CHANGELOG para release

**Entregable:** bloque markdown de una entrada `## [X.Y.Z] — YYYY-MM-DD` listo para insertar en `CHANGELOG.md` del repo, o el archivo `CHANGELOG.md` completo creado/actualizado con la nueva entrada en cabecera. La ruta exacta la facilita el orquestador o el agente — por defecto, el `CHANGELOG.md` raíz del proyecto.

---

## Cuándo usar esta skill

- Se va a publicar una release y hace falta la entrada del changelog correspondiente.
- Hay un set de PRs merged desde la última versión y se quiere consolidar el changelog antes del tag.
- Se quiere mantener un `[Unreleased]` actualizado a medida que entran PRs en main, para tener siempre el changelog listo.

**Cuándo NO usar:**

- Para describir un PR individual — eso es `pr-description` (orientado a reviewers, mucho más detalle técnico).
- Para escribir release notes de marketing / blog post de release — eso pertenece a `marketing-content` (audiencia distinta, tono de marca).
- Para el mensaje de un commit — eso es `commit-message`.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Versión a registrar | ¿Qué versión? (ej. `1.4.0`, `2.0.0-beta.1`). Si aún no se ha decidido, ¿major/minor/patch según semver? |
| Fecha | ¿Fecha de release? Default: hoy en formato `YYYY-MM-DD`. |
| PRs / commits del release | Lista de PRs merged o `git log v<previous>..HEAD --oneline` desde la última versión. |
| Versión anterior | ¿Cuál fue la última versión publicada? (necesaria para el link de comparación). |
| Convención del repo | ¿Keep a Changelog (default), conventional-changelog, custom? |
| Producto / audiencia | ¿Quién lee este changelog? (devs consumidores de una librería, usuarios finales de SaaS, ops, auditores). El tono y el nivel cambian. |
| Breaking changes | ¿Hay breaking changes a destacar? (afecta a sección `BREAKING` y subiría versión a major). |
| Existe `CHANGELOG.md` | ¿Existe el archivo? ¿Cumple Keep a Changelog? Si no existe, ¿se crea desde cero con esta entrada como primera? |

---

## Plantilla del entregable

### Formato Keep a Changelog (default)

```markdown
## [<X.Y.Z>] — YYYY-MM-DD

<Opcional: 1-3 líneas de resumen ejecutivo del release. Solo si el release tiene un tema claro (ej. "Migración a Postgres 16", "Soporte para webhooks"). Si es un release misceláneo, omitir.>

### ⚠️ BREAKING CHANGES

<Sólo si hay breaking changes. Cada uno con descripción + path de migración. Si no hay, omitir la sección entera.>

- **<área afectada>** — <qué cambia y cómo migrar>. Ver migration guide: <link si existe>.

### Added

- <Nueva funcionalidad descrita desde la perspectiva del consumidor. 1-2 líneas máx por bullet. Refs: #PR o ticket.>

### Changed

- <Cambio de comportamiento existente, no breaking. Si afecta a defaults, decirlo explícitamente.>

### Deprecated

- <Funcionalidad marcada como deprecada que se retirará en una versión futura. Indicar versión objetivo de retirada.>

### Removed

- <Funcionalidad eliminada. Si era previamente deprecated, mencionar desde qué versión.>

### Fixed

- <Bug fix descrito desde la perspectiva del usuario que lo sufría ("X ya no falla cuando Y"), no desde la perspectiva del código ("se ha cambiado la función Z").>

### Security

- <Vulnerabilidad parcheada. Si tiene CVE, referenciarla. No dar detalles que faciliten explotación retroactiva en versiones aún vulnerables.>

---
```

**Reglas de orden y omisión de secciones:**

- Si una sección queda vacía, **se omite**. No dejar `### Added` con "ninguno".
- Orden canónico: BREAKING → Added → Changed → Deprecated → Removed → Fixed → Security.
- `BREAKING CHANGES` siempre arriba y con el marcador `⚠️`, aunque sea Keep a Changelog estricto que no lo incluye (la práctica del ecosistema lo añade).

### Cabecera del archivo (si se crea desde cero)

```markdown
# Changelog

Todas las versiones notables de este proyecto se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

<Entradas para el próximo release, mismas secciones que una versión normal.>

---

<Aquí van las versiones publicadas en orden cronológico inverso.>
```

### Links de comparación al final del archivo

```markdown
[Unreleased]: https://<host>/<org>/<repo>/compare/v<X.Y.Z>...HEAD
[<X.Y.Z>]: https://<host>/<org>/<repo>/compare/v<X.Y.(Z-1)>...v<X.Y.Z>
[<X.Y.(Z-1)>]: https://<host>/<org>/<repo>/releases/tag/v<X.Y.(Z-1)>
```

Si el repo no tiene hosting con `compare/` (ej. repo local), omitir esta sección.

---

## Reglas de redacción

- **Audiencia primero.** El changelog se escribe para quien usa el producto, no para quien lo desarrolla. "Se refactorizó el módulo de auth para usar JWT" → mejor "El login ahora usa tokens JWT con expiración 15 min".
- **Una idea por bullet.** Si un bullet necesita "además, también, y", probablemente son dos.
- **Referenciar PR/issue al final del bullet** entre paréntesis: `(#123)`. Ayuda a navegar.
- **No incluir commits internos** del tipo `chore: lint`, `docs: typo`, `test: add coverage` salvo que sean relevantes para el consumidor. El changelog filtra ruido.
- **Verbo en presente o imperativo, consistente** dentro de la entrada. "Adds support for..." o "Soporte para..." — no mezclar.
- **Versionado.** Antes de redactar, validar que el bump propuesto es coherente con semver:
  - MAJOR si hay BREAKING CHANGES.
  - MINOR si hay Added (sin breaking).
  - PATCH si solo hay Fixed.

---

## Proceso

1. **Recopilar** la información (sección anterior).
2. **Leer el `CHANGELOG.md` actual** del proyecto si existe. Detectar:
   - Formato real (Keep a Changelog, conventional-changelog, custom).
   - Última versión registrada y fecha.
   - Si hay `[Unreleased]` ya con contenido: integrar lo que ya está, no duplicar.
3. **Mapear PRs / commits a categorías:**
   - `feat:` / nueva funcionalidad → Added.
   - `fix:` → Fixed.
   - `refactor:` / `perf:` con cambio observable → Changed. Sin cambio observable → omitir del changelog.
   - `BREAKING CHANGE:` en footer o `!` en commit type → sección BREAKING + categoría correspondiente.
   - Deprecated/Removed: solo si el PR lo declara explícitamente.
   - Security: PRs marcados como security fix o con CVE asociada.
4. **Validar el bump semver** contra el contenido. Si hay BREAKING y la versión propuesta no es major, avisar al usuario.
5. **Redactar cada bullet** desde la perspectiva del consumidor, no del desarrollador. Si un PR es puramente interno y no afecta al consumidor, **omitirlo** del changelog.
6. **Insertar la nueva entrada** justo debajo del separador `---` de Keep a Changelog (o donde el formato del repo lo indique), encima de la versión anterior.
7. **Actualizar `[Unreleased]`** para vaciarlo (los items que estaban se han movido a la nueva versión).
8. **Actualizar los links de comparación** al final si el archivo los usa.
9. **Marcar con `[COMPLETAR]`** lo que el usuario debe completar (links a migration guide pendientes, números de CVE no asignados aún).
10. **Reportar** al usuario:
    - Ruta del archivo modificado / creado.
    - Resumen de bullets por categoría.
    - Si se detectó BREAKING y el bump no coincide, alerta explícita.
    - PRs ignorados por considerarse internos (lista) para que el usuario los revise.
    - Próximo paso: tag de git, release en la forja, publicación del paquete si aplica.

---

## Restricciones

- **No inventes bullets.** Si un PR no tiene contexto suficiente para una línea entendible, marcarlo `[COMPLETAR]` con el número del PR y dejar que el usuario complete.
- **No retoques entries de versiones anteriores.** Las versiones publicadas son inmutables. Si hay un error en una entrada previa, se anota en la entrada actual o en una nota al pie, no se reescribe.
- **No metas detalles de implementación interna** que no afectan al consumidor. "Refactor del servicio X" sin cambio observable → no va al changelog.
- **No reveles vulnerabilidades sin parche distribuible.** En Security, redactar el qué (categoría), no el cómo (vector de explotación), si la versión vulnerable está en uso. Para detalles técnicos completos, esperar embargo o usar advisory aparte (GitHub Security Advisories, CVE database).
- **No mezcles tono.** Una entrada con bullets en español mezclados con inglés se ve descuidada. Respetar el idioma establecido del CHANGELOG.
- **No duplices bullets** entre Added/Changed cuando un PR encaja en ambas. Decidir el más correcto y referenciar desde el otro si hace falta.
- Aplican las reglas de output de `_shared/output-rules.md`.
