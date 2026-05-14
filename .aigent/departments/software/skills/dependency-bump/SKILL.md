---
name: "dependency-bump"
description: >
  Workflow skill for upgrading a project dependency (library, framework,
  runtime). Produces an assessment + migration plan BEFORE touching code:
  changelog diff, breaking changes, blast radius, migration steps, validation,
  rollback. Then the upgrade follows. Language and ecosystem agnostic (npm,
  pip, gradle, go.mod, cargo, …).
---

# Skill: Dependency Bump — workflow para subir una dependencia

**Entregable:** archivo de plan + reporte en `<proyecto>/software/code/.reports/dep-bump-<lib>-<from>-to-<to>.md` que documenta el assessment, el plan de migración y, tras ejecutarlo, el resultado. Los cambios al código del repo se realizan con `Edit`/`Write` siguiendo el plan.

---

## Cuándo usar esta skill

- Hay que subir de versión una dependencia (minor, mayor o runtime entero) y se quiere hacer con red.
- Se ha publicado un security advisory que obliga a patch / minor bump.
- Una feature nueva exige una versión más reciente de una librería.
- Se está consolidando dependencias dispersas en varias versiones a una sola.

**Cuándo NO usar:**

- Para un bump trivial de patch (`1.2.3` → `1.2.4`) sin breaking — eso suele ir directo con `commit-message` + `pr-description`, sin todo este workflow.
- Para introducir una dependencia NUEVA (no existe en el repo) — eso es decisión de arquitectura, pasar primero por ADR vía `software-architecture`.
- Para retirar una dependencia (deprecation interna) — eso encaja con `refactor-plan` cambiando el approach.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Dependencia | ¿Qué librería / framework / runtime se va a subir? Nombre exacto del package. |
| Versión actual | ¿Qué versión hay declarada y qué versión está realmente resuelta en el lockfile? |
| Versión objetivo | ¿A qué versión queremos ir? ¿Por qué esa y no otra (security, compatibilidad, feature)? |
| Motivo del bump | Security advisory · feature nueva · alineación · mantenimiento · runtime forzado · …  |
| Tipo de bump | Patch / Minor / Major según semver declarado por el upstream. |
| Ecosistema | npm / pip / gradle / cargo / go.mod / nuget / composer / brew / ... |
| Lockfile | ¿Hay lockfile (package-lock.json, poetry.lock, Gemfile.lock, go.sum, Cargo.lock)? |
| Acoplamiento | ¿Dónde se usa la dependencia en el código? (imports, paths, módulos). Si no se sabe, parte del assessment es localizarlo. |
| Constraint de versión | ¿La declaración es estricta (`==1.2.3`), por rango (`^1.2.3`, `~1.2.3`, `>=1.2,<2.0`) o latest? |

---

## Plantilla del entregable

### Plan + reporte de dependency bump (`dep-bump-<lib>-<from>-to-<to>.md`)

```markdown
# Dependency Bump: <library> · <from> → <to>

- **Library:** <name>
- **From:** <version actual + lockfile resuelto si difiere>
- **To:** <version objetivo>
- **Tipo de bump:** Patch | Minor | Major | Runtime
- **Ecosistema:** npm | pip | gradle | cargo | go.mod | nuget | composer | brew | otro
- **Motivo:** Security · Feature · Alineación · Mantenimiento · Runtime · Otro: <...>
- **Branch:** <nombre>
- **Fecha:** YYYY-MM-DD
- **Owner:** software-coding (vía skill `dependency-bump`)
- **Estado:** Planned | In progress | Done | Reverted

---

## 1. Assessment

### 1.1 Changelog upstream

**Link al changelog / release notes:** <URL>

**Versiones que se saltan** (si el bump cruza varias):
- `<v intermedia>` — <highlight>
- `<v intermedia>` — <highlight>

**Breaking changes declarados:**
- <breaking 1 + descripción + cómo afecta>
- <breaking 2 + descripción + cómo afecta>
- O: ninguno declarado.

**Deprecations relevantes:**
- <ítem>
- O: ninguna.

**Features nuevas que aprovechamos:**
- <feature 1 si aplica>
- O: ninguna que vayamos a usar ya.

**Security advisories cerrados:**
- <CVE / GHSA + severidad>
- O: ninguno relevante.

### 1.2 Blast radius en el repo

**Paths que importan / usan esta dependencia:**

| Path | Cómo se usa | Afectado por breaking change |
|---|---|---|
| `<path>` | <import + API que consume> | Sí / No / Por verificar |
| `<path>` | ... | ... |

**Dependencias transitivas que también suben:**
- <lib transitiva 1 · old → new>
- <lib transitiva 2 · old → new>

**Compatibilidad con el resto del stack:**
- <runtime 1 · versión mínima requerida vs la nuestra · ¿compatible?>
- <pareja librería A + librería B · ¿siguen compatibles tras el bump?>

### 1.3 Riesgo del bump

| Dimensión | Evaluación |
|---|---|
| Madurez de la nueva versión | beta / RC / estable / LTS |
| Tiempo desde release | <días/meses> |
| Adoption en la comunidad | baja / media / alta |
| Tests upstream | buenos / regulares / inexistentes |
| Reversibilidad | trivial / costosa / irreversible |
| **Riesgo global** | 🟢 bajo / 🟡 medio / 🟠 alto / 🔴 muy alto |

---

## 2. Plan de migración

### 2.1 Pasos

1. **Pre-condiciones:**
   - [ ] Branch creada desde main al día.
   - [ ] Suite de tests pasa en main antes del bump.
   - [ ] Lockfile commiteado para baseline.

2. **Bump:**
   - [ ] Actualizar declaración de versión en `<archivo de manifest>` (package.json / pyproject.toml / build.gradle / go.mod / Cargo.toml).
   - [ ] Regenerar lockfile con el comando del ecosistema (`npm install`, `poetry lock --no-update`, `go mod tidy`, `cargo update -p <lib>`, …).
   - [ ] Verificar que no se actualizan otras dependencias inesperadamente.

3. **Adaptar el código a breaking changes:**
   - [ ] `<path>` — <qué cambia y cómo se adapta>
   - [ ] `<path>` — ...

4. **Adaptar configuración / build:**
   - [ ] <archivo de config / pipeline si aplica>

5. **Tests:**
   - [ ] Actualizar tests que dependen del comportamiento de la dependencia (si lo dependían de manera frágil).
   - [ ] Añadir tests nuevos si el bump expone APIs nuevas que vamos a empezar a usar.

### 2.2 Estrategia de rollout

- [ ] All-at-once (suele ser lo correcto para deps).
- [ ] Feature flag (si la dependencia introduce comportamiento condicional que queremos toggleable).
- [ ] Canary deploy (si es runtime crítico o el bump es major).

---

## 3. Safety nets

**Tests existentes que cubren los paths afectados:**
- <test 1 — qué cubre>
- <test 2 — qué cubre>

**Gaps a reforzar antes del bump:**
- <ítem si los tests no cubren un path crítico>

**Monitoring durante / después del rollout:**
- <métrica de error rate · alert si supera X>
- <latency p50/p99 · alert si degrada>

**Smoke tests post-deploy:**
- <escenario 1 que confirma que la app arranca y la dependencia funciona>

---

## 4. Validación

- [ ] Lockfile regenerado sin cambios inesperados.
- [ ] Build pasa.
- [ ] Linter / formatter pasa.
- [ ] Suite completa de tests pasa.
- [ ] Smoke test manual en local.
- [ ] Self-review del diff.
- [ ] Si hay impacto en producción: plan de rollout acordado.

---

## 5. Rollback

**Punto sin retorno:** <p.ej. tras migración de schema; tras retirar feature flag>

**Plan antes del punto sin retorno:**
- [ ] Revertir el commit del bump.
- [ ] `git restore` del lockfile a la versión anterior.
- [ ] Re-resolver dependencias.

**Plan post-deploy si algo se rompe:**
- [ ] Revertir el PR.
- [ ] Toggle del feature flag si existe.
- [ ] Hotfix dirigido.

---

## 6. Resultado (se completa al cerrar)

> Esta sección se rellena tras ejecutar el bump.

**Estado final:** Done | Reverted | Partial

**Diff stats:**
- Archivos tocados: <N>
- Líneas añadidas: <N>
- Líneas eliminadas: <N>
- Versión final resuelta en lockfile: <version>

**Tests:**
- Existentes: pasan / con N cambios mínimos
- Nuevos: <N>

**Sorpresas durante la ejecución:**
- <breaking change no declarado encontrado · cómo se manejó>
- <dep transitiva que no se esperaba subir · acción>

**Decisiones tomadas:**
- <decisión + justificación si aplica (ej. no migrar API X porque ...)>

**Próximos pasos sugeridos:**
- [ ] **`commit-message`** + **`pr-description`** + **`changelog-entry`** si va en release.
- [ ] **`software-code-review`** — review antes del merge (sobre todo para majors).
- [ ] **ADR** si el bump fuerza decisión arquitectónica nueva.
- [ ] Notas para el equipo / release notes.
```

---

## Proceso

### Fase 1 — Assessment (antes de tocar nada)

1. **Leer el changelog / release notes** entre la versión actual y la objetivo. No saltar versiones intermedias sin mirar — los breakings se acumulan.
2. **Localizar todos los usos** de la dependencia en el repo (grep de imports, builds que la incluyen, configuración que la referencia).
3. **Identificar breaking changes** que afectan al repo concretamente. No basta con leer "Breaking: removed API X" — hay que verificar si el repo usa X.
4. **Detectar deps transitivas** que también van a subir. A veces el verdadero riesgo está en una transitiva, no en la directa.
5. **Evaluar compatibilidad** con el resto del stack (runtime mínimo, otras libs, build tooling).
6. **Asignar riesgo global** (🟢/🟡/🟠/🔴). Si 🟠 o 🔴, considerar split en pasos más pequeños o feature flag.

### Fase 2 — Planificación

7. **Redactar el plan de migración** con pasos concretos. Si el bump cruza varios majors, dividir en sub-bumps secuenciales (uno por major).
8. **Verificar safety nets** existentes (tests + monitoring). Reforzar gaps críticos antes de bumpear.
9. **Definir rollback** explícito.
10. **Guardar el plan** en `<proyecto>/software/code/.reports/dep-bump-<lib>-<from>-to-<to>.md` con estado `Planned`.
11. **Confirmar el plan con el usuario** si:
    - Es major bump.
    - El riesgo global es 🟠 o 🔴.
    - Afecta a runtime o a dependencia transversal (framework principal, ORM, …).

### Fase 3 — Ejecución

12. **Marcar estado como `In progress`** en el plan.
13. **Aplicar el bump** en el manifest. Regenerar lockfile.
14. **Verificar el lockfile diff:** ¿qué se actualizó realmente? Si se actualizaron deps inesperadas, parar y entender por qué (constraint laxo, transitivas).
15. **Adaptar el código** a los breaking changes según el plan, archivo por archivo. Tests al lado.
16. **Mantener la suite verde** continuamente. Si un test falla, decidir: ¿el código está mal adaptado al bump o el test estaba mal escrito?

### Fase 4 — Cierre

17. **Validar** la checklist de la sección "4. Validación" del plan.
18. **Rellenar la sección "Resultado"** con diff stats, sorpresas, decisiones.
19. **Marcar estado como `Done`** (o `Reverted` / `Partial`).
20. **Reportar al usuario:**
    - Ruta del plan con resultado.
    - Versión final resuelta.
    - Archivos tocados.
    - Sorpresas relevantes (breaking no declarado, transitiva inesperada).
    - Próximos pasos: PR, review (especialmente para majors), ADR si aplica, nota de changelog si va en release.

---

## Restricciones

- **No bumpear sin assessment.** El bump a ciegas funciona hasta que rompe en producción a las 2am.
- **No saltar versiones intermedias sin leerlas.** "De `1.2` a `1.7` es solo minor" — esa frase es famosa por destruir builds.
- **No introducir dependencias nuevas en este flujo.** Para introducir una librería que no estaba, pasar primero por ADR vía `software-architecture`.
- **No retirar dependencias en este flujo.** La retirada es refactor — usar `refactor-plan`.
- **No commitear el bump y otros cambios funcionales** en el mismo PR. Un PR de bump es un PR de bump. La adaptación al breaking change va con el bump, pero ninguna feature nueva se cuela.
- **No prometer reversibilidad** si el bump hace migraciones de datos o de formato persistente. Marcar en rollback y exigir más controles.
- **No bumpear major sobre versión cero (`0.x`) sin extra cuidado.** En `0.x`, cada minor puede tener breaking según semver convention de muchos ecosistemas — leer el changelog igual o más exhaustivamente que un major.
- Aplican las reglas de output de `_shared/output-rules.md`.
