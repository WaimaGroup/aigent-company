---
name: "pr-description"
description: >
  Skill for writing a Pull Request description from a branch diff plus the
  associated spec (PRD/ADR/tech-spec/ticket). Produces a structured markdown
  block ready to paste in GitHub/GitLab/Bitbucket: problem, change, testing,
  impact, checklist and references. Stack agnostic.
---

# Skill: PR Description — descripción de Pull Request

**Entregable:** un único bloque markdown listo para pegar en el cuerpo del PR (GitHub/GitLab/Bitbucket). Se entrega en el chat por defecto. Si el orquestador lo indica, también puede guardarse en `<proyecto>/software/code/.pr-descriptions/<branch>.md` para historial.

---

## Cuándo usar esta skill

- Se va a abrir un PR / MR y hace falta la descripción que verán los revisores.
- Se quiere actualizar la descripción de un PR existente tras un cambio sustancial en el branch.
- Se quiere preparar la descripción antes de pushear (escribir el "para qué" antes de pedir el review).

**Cuándo NO usar:**

- Para escribir el mensaje del commit individual — eso es `commit-message`.
- Para una entrada de changelog (audiencia distinta: changelog es para consumidores finales del producto, PR es para reviewers internos) — eso es `changelog-entry`.
- Para revisar el código del PR — eso es `code-review-checklist`.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Branch / PR | ¿Nombre del branch o número del PR? |
| Spec asociado | ¿Hay PRD, ADR, tech-spec o ticket de referencia? Ruta o link. Si no hay, ¿cuál es el contexto/problema en 2-3 líneas? |
| Diff del branch | ¿Diff (output de `git diff origin/main...HEAD --stat` + `--unified=0`) o resumen de archivos tocados? |
| Lista de commits | ¿`git log --oneline origin/main..HEAD`? |
| Tipo de cambio | ¿Feature / fix / refactor / migration / chore / docs? (puede inferirse del diff y los commits) |
| Breaking change | ¿Introduce incompatibilidad para consumidores (API, schema, comportamiento esperado)? |
| Testing realizado | ¿Qué tests se han añadido / actualizado? ¿Qué se ha probado manualmente? ¿Quedan tests pendientes? |
| Screenshots / vídeos | Si afecta a UI, ¿hay capturas o vídeo? (rutas o links) |
| Plantilla del repo | ¿El repo tiene `.github/PULL_REQUEST_TEMPLATE.md` u otra plantilla? Si sí, respetarla. |
| Revisores sugeridos | ¿Quién debería revisar (por área / por code ownership)? |

---

## Plantilla del entregable

Si el repo tiene plantilla propia, rellenarla siguiendo su estructura. Si no, usar esta canónica:

```markdown
## Qué cambia

<2-4 líneas. Qué hace el PR ahora que antes no, en lenguaje de impacto, no de implementación. Si añade una feature, en una línea: "Permite al usuario X hacer Y desde Z".>

## Por qué

<Problema que motiva el cambio. Si hay spec asociado, referenciarlo con link/ruta.
Si no hay spec, explicar el contexto en 3-5 líneas.>

**Referencias:**
- Spec / PRD / ADR / Ticket: <ruta o link>
- ADRs relacionados: <ADR-NNN, ADR-NNN>
- Issues: <Closes #123 / Refs #456>

## Cómo (resumen del approach)

<3-6 viñetas describiendo el approach técnico, no el detalle archivo a archivo.
El reviewer debe saber qué buscar en el diff antes de abrirlo.>

- <decisión / approach 1>
- <decisión / approach 2>
- ...

## Cambios principales

| Archivo / módulo | Cambio |
|---|---|
| `<path>` | <una línea> |
| `<path>` | <una línea> |
| ... | ... |

## Testing

**Tests añadidos / modificados:**
- <test 1 — qué cubre>
- <test 2 — qué cubre>

**Tests pendientes (si aplica):**
- [TEST PENDIENTE] <caso no cubierto + razón>

**Probado manualmente:**
- <escenario 1>
- <escenario 2>

## Impacto

**Breaking changes:** <Sí / No>. Si sí, descripción + path de migración / nota para release notes.

**Áreas afectadas:** <módulos, servicios, equipos que deberían estar al tanto>.

**Riesgos asumidos:** <riesgo + mitigación>.

**Rollback:** <pasos para revertir si algo va mal en producción>.

## Screenshots / Vídeo (si aplica)

<imagen/vídeo o "N/A">

## Checklist (autor)

- [ ] El código pasa lint y formatter del repo.
- [ ] Hay tests nuevos cubriendo los caminos críticos.
- [ ] Toda la documentación afectada (README, comentarios, ADRs) está actualizada.
- [ ] Variables de entorno / secrets nuevos están documentados.
- [ ] Si hay breaking change, está marcado y hay nota de migración.
- [ ] El PR es atómico (un cambio lógico, no varios).
- [ ] Self-review: he leído el diff entero antes de pedir review.

## Para el reviewer

<3-5 líneas opcionales: dónde mirar primero, qué partes son las arriesgadas,
qué no es objeto de este PR (para evitar comentarios fuera de alcance).>
```

---

## Proceso

1. **Recopilar** información (sección anterior). Si solo se aporta el branch sin spec, intentar leer commits + diff para deducir contexto.
2. **Detectar plantilla del repo** (`.github/PULL_REQUEST_TEMPLATE.md`, `.gitlab/merge_request_templates/`). Si existe, **respetar su estructura** y usar la plantilla canónica como fuente de contenido a mapear.
3. **Analizar commits y diff:**
   - ¿Es atómico? Si mezcla cambios sin relación, recomendar split antes de generar la descripción.
   - ¿Hay archivos sensibles tocados? (config, infra, secrets, schemas) — destacarlos en el "Para el reviewer".
   - ¿Hay breaking change? (cambio de firma pública, schema, comportamiento esperado).
4. **Cruzar con el spec asociado:**
   - ¿El cambio cubre todo el scope del spec o solo parte? Si parte, declararlo.
   - ¿Hay decisiones tomadas en el diff que no están en el spec? Marcarlas y proponer ADR si aplica.
5. **Redactar las secciones** en este orden mental: por qué → qué → cómo → testing → impacto → checklist. Que el reviewer entienda el contexto antes que el código.
6. **Marcar campos pendientes** con `[COMPLETAR]` lo que dependa de info que no tienes (revisores específicos, screenshots, números reales).
7. **Entregar** el bloque markdown en el chat o al archivo si el orquestador lo pidió.
8. **Reportar** al usuario:
   - Bloque completo listo para pegar.
   - Plantilla aplicada (la del repo o la canónica).
   - Atención si se detectó breaking change o falta de atomicidad.
   - Próximo paso sugerido: pegar en el PR + asignar revisores.

---

## Restricciones

- **No inventes el "por qué".** Si no hay spec ni el usuario lo aporta, pídelo. Una descripción que rellena el por qué con suposiciones genera reviews con criterios ambiguos.
- **No mezcles esta skill con `commit-message`.** La descripción del PR es el agregado del cambio; los commit messages son el detalle de cada paso. Solapan en estructura, no en granularidad.
- **No filtres secretos** (API keys, URLs internas privadas, datos de clientes) en la descripción. El PR es público dentro del equipo y a menudo más allá.
- **No metas en la descripción información que pertenece a un ADR.** Si el PR introduce una decisión técnica relevante, propón ADR y referéncialo, no copies el razonamiento entero.
- **No declares breaking change sin marcarlo en negrita arriba.** Un reviewer cansado debe verlo en los primeros 10 segundos.
- **No marques checklist items como `[x]`** sin haberlos verificado. El autor del PR los marca, no la skill.
- Aplican las reglas de output de `_shared/output-rules.md` — con la matización de que el output principal es texto markdown en chat por defecto (para pegar en el PR), no archivo en disco salvo que el orquestador lo pida.
