---
name: "software-migration-guide"
user-invocable: true
description: >
  Skill for writing a user-facing migration guide from version X to version Y
  of a project (library, API, CLI, framework). Covers what changed, what
  breaks, step-by-step migration recipes, codemods if applicable, validation
  checklist, and rollback. Audience: consumers of the project, not internal
  devs.
---

# Skill: Migration Guide — guía de migración entre versiones

**Entregable:** archivo `migration-<from>-to-<to>.md` que vive en `<proyecto>/docs/migrations/` (o donde indique el orquestador). Es documentación pública para consumidores de la librería / API / CLI / framework. Acompaña al changelog: el changelog dice "qué cambia"; la guía de migración dice "cómo migrar".

---

## Cuándo usar esta skill

- Se va a publicar una release con breaking changes y los consumidores necesitan saber cómo adaptar su código.
- Se ha cambiado la URL/auth/schema de una API pública y los integradores necesitan instrucciones.
- Se ha renombrado/movido módulos en una librería y los imports rotos necesitan path-of-migration.
- Tras un major bump del propio proyecto que afecta a usuarios externos.

**Cuándo NO usar:**

- Para describir un PR — eso es `pr-description`.
- Para entrada de changelog (es complementaria, no sustitutiva) — eso es `changelog-entry`.
- Para guía de desarrollo del proyecto (audiencia interna) — eso es `dev-guide`.
- Cuando el cambio NO es breaking. Si nada se rompe para el consumidor, la entrada de changelog basta.
- Para migración de schema de BD interna sin impacto externo — eso es operación, no migration guide.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Tipo de proyecto | Library · API REST/GraphQL · CLI · Framework · SaaS · Otro. Determina el formato de los ejemplos. |
| Versiones | ¿De qué versión a qué versión? (ej. `1.x` → `2.0`, `2.3` → `3.0`, `v1` → `v2` de API). |
| Breaking changes | Lista completa de breaking changes que afectan al consumidor. ¿Hay link al changelog? |
| Deprecations | ¿Hay deprecations introducidas en versiones anteriores que ahora se eliminan? Si sí, cuándo se deprecó cada una. |
| Codemod / migration tool | ¿Hay herramienta automatizable? (jscodeshift, modernizer, alembic migration, custom script). |
| Soporte de versión anterior | ¿Hasta cuándo se mantiene la versión anterior? ¿Hay LTS? |
| Audiencia técnica | ¿Devs que usan la librería como dep? ¿Integradores de API? ¿Admins del CLI? |
| Casos comunes | ¿Patrones típicos de uso que vamos a documentar como "antes / después"? |
| Riesgo de la migración | ¿Trivial / moderado / alto? Determina el énfasis en safety nets y rollback. |

---

## Plantilla del entregable

```markdown
# Migration Guide: <from> → <to>

- **Proyecto:** <Project Name>
- **From version:** <from>
- **To version:** <to>
- **Fecha de release de `<to>`:** YYYY-MM-DD
- **Soporte de `<from>`:** hasta <fecha o "indefinido" o "fin de soporte el día de release de <to>">
- **Dificultad estimada:** 🟢 trivial · 🟡 moderada · 🟠 alta
- **Tiempo estimado:** <para un proyecto típico>

---

## TL;DR

<5-8 líneas. Qué cambia en grande, qué se rompe en grande, qué se mantiene
igual, cuánto esfuerzo total razonable. Si hay codemod, mencionarlo aquí
arriba.>

---

## Antes de empezar

- [ ] Estás en la versión `<from>` (no en una anterior). Si vienes de más atrás, sigue primero la guía `<from-2>` → `<from>`.
- [ ] Tu suite de tests pasa en `<from>`. Sin red de tests, la migración va a ciegas.
- [ ] Tienes branch limpia para la migración.
- [ ] Has leído el [changelog](<link>) para ver cambios no breaking que pueden interesarte (features nuevas, mejoras).

---

## Mapa de cambios

> Tabla resumen de cambios que afectan al consumidor. El detalle viene después.

| Categoría | Qué cambia | Impacto | Acción |
|---|---|---|---|
| <Removed> | `<API/módulo/flag>` eliminado | <breaking> | Migrar a `<reemplazo>` |
| <Renamed> | `<old>` → `<new>` | <breaking> | Renombrar imports/llamadas |
| <Signature change> | `<func>` cambia firma | <breaking> | Adaptar llamadas — sección N |
| <Default change> | Default de `<opt>` pasa de A a B | <silent breaking> | Verificar si dependías del default |
| <Deprecation> | `<API>` deprecada (eliminación en `<v+1>`) | warning | Migrar cuando sea cómodo |

---

## Cambios breaking — detalle

### 1. <Breaking change 1>

**Por qué cambia:**
<1-2 líneas explicando la motivación. Ayuda al consumidor a aceptar el coste.>

**Cómo migrar:**

Antes (`<from>`):
```<lenguaje>
<código antes>
```

Después (`<to>`):
```<lenguaje>
<código después>
```

**Casos especiales:**
- Si usas `<patrón A>` → <ajuste extra>
- Si usas `<patrón B>` → <ajuste extra>

**¿Hay codemod?** <Sí / No>. Si sí:
```bash
<comando del codemod>
```

---

### 2. <Breaking change 2>

(mismo formato)

---

### 3. <Breaking change 3>

(mismo formato)

---

## Cambios silenciosos a verificar

> Cambios que no rompen el build pero pueden cambiar comportamiento.
> Imprescindible verificarlos manualmente.

- **<Cambio de default>** — `<opt>` pasa de `<A>` a `<B>`. Si dependías de `<A>`, sé explícito en tu código.
- **<Cambio de comportamiento>** — `<func>` ahora devuelve `<X>` en lugar de `<Y>` cuando `<condición>`. Ejemplo:
  ```<lenguaje>
  <ejemplo>
  ```

---

## Deprecations introducidas

> Lo siguiente NO está eliminado todavía, pero queda deprecado en `<to>`.
> Se eliminará en `<v+1>`. Conviene migrar.

- **`<API>`** — usar `<reemplazo>`.
- **`<API>`** — usar `<reemplazo>`.

---

## Plan de migración paso a paso

1. **Backup / branch.** Asegúrate de poder revertir.
2. **Bump de la dependencia.**
   ```bash
   <comando de bump según ecosistema>
   ```
3. **Ejecuta el codemod (si existe):**
   ```bash
   <comando>
   ```
4. **Corre el linter / typecheck** — los breaking changes salen aquí en buena parte.
   ```bash
   <comando>
   ```
5. **Adapta manualmente** los casos que el codemod no cubre (ver sección "Cambios breaking — detalle").
6. **Corre la suite de tests** completa.
   ```bash
   <comando>
   ```
7. **Verifica los cambios silenciosos** que no salieron en el typecheck.
8. **Smoke test manual** de los caminos críticos de tu app.
9. **Commit** siguiendo Conventional Commits: `chore(deps): migrate to <to>` con body listando breaking changes adaptados.
10. **Rollout** progresivo si el cambio afecta a producción (feature flag / canary).

---

## Validación

- [ ] Build pasa.
- [ ] Typecheck / linter pasa sin warnings nuevos no esperados.
- [ ] Suite de tests pasa.
- [ ] Smoke test manual de caminos críticos.
- [ ] Logs no muestran nuevas excepciones / warnings inesperados.
- [ ] Métricas de error rate / latency dentro de rango esperado tras deploy.

---

## Rollback

Si algo va mal:

1. **Antes de deploy:** revertir el commit, volver a `<from>`.
2. **Tras deploy con feature flag:** toggle del flag.
3. **Tras deploy sin flag:** revertir el release o aplicar hotfix dirigido.

> Para APIs públicas: `<from>` se mantiene operativa hasta `<fecha sunset>`.
> Para librerías: el lockfile preserva la versión antigua hasta que se vuelva a bumpear.

---

## FAQ

### ¿Puedo migrar gradualmente?

<Sí — explicar cómo (uso simultáneo, branch by abstraction) o No — explicar
por qué.>

### ¿Funciona `<from>` y `<to>` en el mismo proyecto?

<Sí/No + condiciones. Para libs típicamente no; para APIs sí durante el periodo
de coexistencia.>

### ¿Qué pasa con los plugins / extensiones de terceros?

<Estado de compatibilidad conocido. Links a issues de tracking si aplica.>

### ¿Dónde reporto problemas?

- Bugs: <link al issue tracker>
- Preguntas: <canal>

---

## Soporte

- **Soporte de `<from>`:** hasta `<fecha>`. Solo security fixes después de release de `<to>`.
- **Próxima versión esperada (`<v+1>`):** <fecha estimada o "TBD">.
- **LTS:** <si aplica, qué versión es LTS y hasta cuándo>.
```

---

## Reglas de redacción

- **Audiencia primero.** El consumidor no conoce las decisiones internas; explica el "por qué" con foco en su perspectiva, no en la del autor.
- **Ejemplos ejecutables.** "Antes / después" con snippets que copy-paste compila. Sin pseudocódigo abstracto.
- **No marketear breaking changes.** "Cambios emocionantes" → fuera. El consumidor está perdiendo tiempo migrando; respetar eso con tono profesional.
- **Cubrir los casos especiales.** Si un patrón común tiene una migración diferente al canónico, dedicarle subsección — no es opcional, es donde se atascan los usuarios.
- **Codemod si es viable.** Para migraciones mecánicas (renames, signature changes simples), un codemod ahorra horas a la comunidad. Justifica el esfuerzo.
- **Fechas concretas.** "Próximamente" no es una fecha. "Q3 2026" o "TBD" sí lo son.

---

## Proceso

1. **Recopilar** la información (sección anterior).
2. **Leer el changelog** completo entre `<from>` y `<to>`. Identificar todo lo marcado breaking + lo "silent breaking" (cambios de default, cambios de excepción, cambios de timing).
3. **Mapear cada breaking a una sección "Antes / Después"** con código real (no inventado). Si un breaking es trivial, mantén la sección corta — no estirar por estirar.
4. **Decidir si hay codemod posible:**
   - Renames mecánicos → casi siempre vale la pena.
   - Cambios de firma con lógica nueva → solo si el coste del codemod < tiempo total ahorrado a usuarios.
5. **Redactar el plan paso a paso** en imperativo. El consumidor lo va a seguir como receta.
6. **Cubrir validación y rollback** explícitamente — si la migración falla a mitad, el consumidor necesita saber qué hacer.
7. **Rellenar FAQ** con las 3-5 preguntas que prevés se van a repetir.
8. **Guardar** en `<proyecto>/docs/migrations/migration-<from>-to-<to>.md`.
9. **Cruzar con el changelog:** la entrada de changelog `[<to>]` debe linkar a esta guía. Si no, actualizar `changelog-entry`.
10. **Reportar al usuario:**
    - Ruta del archivo.
    - Resumen de breaking changes cubiertos y deprecations registradas.
    - Si hay codemod planeado pendiente de implementar.
    - Próximos pasos: link desde changelog, comunicación pública (blog, mail a usuarios, release notes), monitoring de issues del migration tracker durante las primeras semanas.

---

## Restricciones

- **No omitir breaking changes** aunque sean "edge case". Un único usuario afectado puede dejar 100 issues abiertos si no encuentra el cambio documentado.
- **No subestimar la dificultad** en el TL;DR. Si la migración es 🟠, decirlo. La sorpresa negativa es peor que la advertencia inicial.
- **No documentar "cómo era antes" sin documentar "cómo es ahora".** Cada subsección antes/después es obligatoria juntas.
- **No mezclar la migration guide con marketing.** Las novedades no breaking van al changelog y al blog. Aquí solo lo que afecta a la migración.
- **No prometer codemod si no lo vas a entregar.** Si dices "habrá codemod en próximas semanas" y no llega, perdiste la confianza.
- **No retirar la guía cuando se publica `<v+1>`.** Los usuarios pueden tardar en migrar. Mantenerla accesible mientras la versión `<from>` tenga adopción.
- **No prescribir un workflow que el consumidor no controla.** "Usa feature flags" puede ser buena idea, pero algunos consumidores no tienen infra de flags — dar plan B.
- Aplican las reglas de output de `_shared/output-rules.md`.
