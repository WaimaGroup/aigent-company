---
name: "shared-deploy-checklist"
user-invocable: true
description: >
  Pre/during/post-deploy checklist for a service release. Covers code & tests
  readiness, env vars, schema migrations, feature flags, rollback plan,
  monitoring & alerts, smoke tests and post-deploy verification. Adapts to
  deploy strategy (instant, canary, blue-green, progressive) and risk level.
  Stack and infra agnostic. Shared skill: used by software (planning side) and
  devops (execution side).
---

# Skill: Deploy Checklist — checklist de deploy de un servicio o release

**Entregable:** archivo `deploy-checklist-<release-or-date>.md` en la carpeta de operaciones del proyecto. Por defecto vive en `<proyecto>/software/architecture/` cuando lo redacta software (antes de pasar a operación). Si DevOps lo ejecuta, copia a `<proyecto>/devops/deploys/` (cuando el dept esté activo). Si no, el archivo se queda en software y se enlaza desde el PR / release notes.

---

## Cuándo usar esta skill

- Se va a deployar un release (feature mayor, bugfix, hotfix, dep bump grande).
- Se va a hacer un cambio operativo no trivial (migración de schema, cambio de infra, rotación de secretos, switch de proveedor).
- Se quiere protocolizar deploys recurrentes y reducir el "se nos olvida X" tras un incidente.
- Se quiere preparar un cliente / equipo nuevo dándole el checklist para que aprenda el proceso.

**Cuándo NO usar:**

- Para el procedimiento operativo permanente del servicio (qué se hace cada día, alertas estándar) — eso es `runbook`.
- Para una decisión técnica de cómo se deploya — eso es ADR (`adr`).
- Para tests automatizados pre-deploy — eso es `test-plan` (la checklist se apoya en que existen, no los diseña).
- Para deploys triviales y rutinarios cubiertos al 100% por CI/CD — usar el checklist genera ruido innecesario.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Release identifier | ¿Versión / tag / branch / fecha del deploy? |
| Servicio o sistema afectado | ¿Qué servicio o qué partes del sistema entran en este deploy? |
| Tipo de cambio | Feature / fix / migración / hotfix / infra / dependency bump. Determina los chequeos críticos. |
| Stack y entorno destino | Lenguaje, runtime, infra (k8s / serverless / VM / on-prem). Entornos a tocar (staging / prod). |
| Estrategia de deploy | Instant · Canary · Blue-green · Progressive · Rolling. Determina la sección de monitoring activo. |
| Hay schema migration | ¿Sí/No? ¿Es reversible? ¿Backfill requerido? |
| Hay feature flag | ¿Sí/No? ¿Estado inicial (off/canary)? ¿Criterio de retirada? |
| Variables de entorno / secrets nuevos | ¿Hay nuevos? ¿Están aprovisionados en el entorno destino? |
| Dependencias externas | ¿El deploy depende de orden con otro deploy / otro servicio / un proveedor externo? |
| Audiencia afectada | Internos / clientes / partners / todos. Determina la comunicación. |
| Plan de rollback | ¿Cómo se revierte? ¿Es trivial? |
| Riesgo del deploy | 🟢 bajo / 🟡 medio / 🟠 alto / 🔴 crítico. Determina nivel de control (ej. dual-control para crítico). |

---

## Plantilla del entregable

```markdown
# Deploy Checklist — <Release identifier>

- **Servicio:** <name>
- **Versión / tag:** <X.Y.Z / commit / branch>
- **Fecha planeada:** YYYY-MM-DD · HH:MM <TZ>
- **Tipo de cambio:** Feature · Fix · Migración · Hotfix · Infra · Dep bump
- **Entorno destino:** Staging → Prod (o el flow que aplique)
- **Estrategia:** Instant · Canary · Blue-green · Progressive · Rolling
- **Riesgo evaluado:** 🟢 bajo · 🟡 medio · 🟠 alto · 🔴 crítico
- **Owner del deploy:** <persona o rol>
- **Aprobador (si crítico):** <persona o rol>
- **Spec de referencia:** <link al PRD/ADR/tech-spec/release-plan>

---

## 1. Pre-deploy — readiness

### 1.1 Código y tests

- [ ] PR(s) mergeados a `main` (o a la branch de release).
- [ ] CI verde en el commit a deployar.
- [ ] Suite completa de tests pasa (unit + integration + e2e).
- [ ] Linter / typecheck pasa.
- [ ] Cobertura no degrada por debajo del threshold del repo.
- [ ] Tag de release creado: `<tag>`.
- [ ] Artefacto del release publicado en el registry (`<registry/repo:tag>`).

### 1.2 Especificación y documentación

- [ ] El cambio sigue el spec (`<link al spec>`). Si hay desviación, ADR creado.
- [ ] Documentación actualizada: README, dev-guide, api-spec, runbook (según aplique).
- [ ] Entrada de `CHANGELOG.md` añadida (skill `changelog-entry`).
- [ ] Migration guide redactada si hay breaking change para consumidores (skill `migration-guide`).
- [ ] Release notes preparadas para audiencias externas si aplica.

### 1.3 Configuración del entorno destino

- [ ] Variables de entorno nuevas declaradas y aprovisionadas en el entorno destino.
- [ ] Secretos rotados / añadidos en el secret manager (sin pegarlos por chat ni en el checklist).
- [ ] Permisos / roles / policies necesarios aplicados (IAM, RBAC, …).
- [ ] Conexión a servicios dependientes (DB, cache, queue, API externa) verificada en staging.

### 1.4 Schema y datos

- [ ] Migration scripts revisados y testeados en staging contra dataset realista.
- [ ] Migration es reversible (o, si no lo es, plan documentado y aprobado por owner).
- [ ] Backup pre-migración programado.
- [ ] Backfill plan documentado (si aplica).
- [ ] Orden de despliegue acordado: <schema first / code first / dual-write / expand-contract>.

### 1.5 Feature flags

- [ ] Flag creado: `<flag>`.
- [ ] Estado inicial: <off / canary 1% / staff only / on>.
- [ ] Targeting rules configuradas.
- [ ] Criterio de promoción documentado: <métrica · umbral · tiempo de observación>.
- [ ] Criterio de retirada del flag: <cuándo y por quién>.

### 1.6 Comunicación

- [ ] Anuncio interno en `<canal>` con ventana, owner y impacto esperado.
- [ ] Comunicación al equipo de soporte / customer success si hay impacto al cliente.
- [ ] Comunicación pública preparada (status page, mailing) si el deploy es disruptivo.
- [ ] Stakeholders aprobaron la ventana de deploy.

### 1.7 Personas y roles

- [ ] Owner del deploy presente en la ventana.
- [ ] Backup en caso de incidente: `<persona>`.
- [ ] Para deploys 🟠 / 🔴: aprobador / dual-control identificado y disponible.
- [ ] Canal de incidentes definido: `<#incident-channel o war room>`.

---

## 2. Durante el deploy — execution

> Ejecutar en orden, marcando timestamps reales.

| Paso | Acción | Resultado esperado | Timestamp real |
|---|---|---|---|
| 1 | <comando o paso 1> | <output esperado / health check> | <hora> |
| 2 | <comando o paso 2> | ... | ... |
| 3 | <comando o paso 3> | ... | ... |
| 4 | Smoke test post-paso (sección 3) | Todos los smoke tests verde | ... |

**Si algún paso da resultado inesperado:** parar, escalar al backup, evaluar rollback. NO continuar para "ver si se arregla solo".

---

## 3. Smoke tests — verificación inmediata

> Tests rápidos (segundos / minutos) que confirman que el deploy no rompió lo básico.

### 3.1 Health checks

- [ ] `/health` o equivalente devuelve 200 en todas las instancias.
- [ ] Métricas básicas vivas (request rate, latency p50, error rate).
- [ ] Logs sin spike de errores en los primeros 5 minutos.

### 3.2 Caminos críticos manuales

- [ ] <Camino crítico 1> funciona (ej. login + acción principal).
- [ ] <Camino crítico 2> funciona.
- [ ] <Camino crítico 3> funciona.

### 3.3 Caminos automatizados

- [ ] Suite de e2e contra el entorno acabado de deployar pasa.
- [ ] Synthetic monitoring no dispara alerta en los primeros 15 min.

---

## 4. Post-deploy — verificación extendida

### 4.1 Métricas a vigilar (ventana de observación)

> Vigilar los siguientes <30 min · 1h · 24h> según riesgo del deploy.

| Métrica | Umbral aceptable | Acción si se cruza |
|---|---|---|
| Error rate (5xx) | < <X>% | Investigar / rollback |
| Latency p99 | < <X> ms | Investigar |
| Throughput | ± <X>% del baseline | Investigar |
| Saturación CPU/mem | < <X>% | Escalar / investigar |
| Cola del queue (si aplica) | < <X> | Investigar |
| <Métrica de negocio crítica> | <umbral> | <acción> |

### 4.2 Confirmaciones funcionales

- [ ] Feature flag funcionando como se esperaba (si aplica).
- [ ] Migration completada con éxito (rows afectadas confirmadas).
- [ ] Sin reports nuevos en soporte / customer success en la ventana.
- [ ] Logs estructurados / trazas distribuidas muestran el flow esperado.

### 4.3 Comunicación de cierre

- [ ] Anuncio en `<canal>` de "deploy completado".
- [ ] Status page actualizada si se publicó algo.
- [ ] Release marcada como published en la forja (GitHub/GitLab releases).

---

## 5. Rollback plan

> Preparado antes del deploy. Si llega el momento, no se inventa sobre la marcha.

### 5.1 Punto sin retorno

<Tras qué paso el rollback deja de ser trivial. Identificar explícitamente.>

### 5.2 Rollback antes del punto sin retorno

- [ ] Revertir deploy a versión anterior: `<comando o procedimiento>`.
- [ ] Revertir migration (si ya aplicada): `<comando o procedimiento>`.
- [ ] Notificar a `<canal>` de rollback en curso.

### 5.3 Rollback después del punto sin retorno

- [ ] Toggle del feature flag a `off` (si existe).
- [ ] Hotfix dirigido contra el problema concreto.
- [ ] Si data está corrupta: invocar plan de recuperación de `<runbook>`.
- [ ] Escalación a `<persona / equipo>`.

### 5.4 Comunicación de rollback / incidente

- [ ] Anuncio en `<canal>` de incidente con severidad.
- [ ] Status page si afecta a clientes.
- [ ] Postmortem programado (`<plazo>`).

---

## 6. Cierre

- [ ] Checklist marcada como completada con timestamp final.
- [ ] Issues abiertos por el deploy registrados con owner.
- [ ] Notas para el siguiente deploy (qué mejorar en el proceso).
- [ ] Si hubo incidente: postmortem programado, no se cierra el checklist hasta que el postmortem esté agendado.

---

## Anexos

- **Spec / release plan:** <link>
- **PR(s) incluidos:** <links>
- **Changelog entry:** <link>
- **Migration guide:** <link>
- **Runbook:** <link>
- **Dashboards relevantes:** <links>
- **Postmortem (si aplica):** <link>
```

---

## Reglas de redacción y uso

- **Adapta al riesgo.** Un deploy 🟢 no necesita 80 checkboxes — recortar secciones que no aplican. Un deploy 🔴 las necesita todas, con dual-control donde tenga sentido.
- **Marca timestamps reales en la sección 2.** Sin timestamps, no se reconstruye qué pasó en un incidente posterior.
- **No marques una casilla "para que pase".** El checklist solo sirve si se cumple de verdad. Si una casilla no aplica, marcar `N/A` con razón.
- **Si paras, paras.** Si en la sección 2 un paso da resultado inesperado, no improvisar — parar y aplicar el plan de rollback. La regla "voy a ver si en 10 minutos se arregla solo" es responsable de muchos incidentes.

---

## Proceso

### Antes del deploy

1. **Recopilar** información (sección anterior).
2. **Adaptar la plantilla al tipo y riesgo del deploy.** Eliminar secciones que no aplican (ej. si no hay schema migration, fuera la sección 1.4 entera).
3. **Rellenar las casillas de pre-deploy** con responsable real, no genérico.
4. **Confirmar el plan con stakeholders** si riesgo 🟠 o 🔴.
5. **Guardar** el archivo en la ruta acordada (default: `<proyecto>/software/architecture/deploy-checklist-<id>.md`).
6. **Linkar desde el PR / release notes** para que el equipo lo siga.

### Durante el deploy

7. **Ejecutar la sección 2 en orden,** marcando timestamps reales.
8. **Pausar tras cada paso** para verificar resultado esperado antes de continuar.
9. **Si algo desvía:** parar, escalar al backup, decidir continuar o rollback. No improvisar.

### Inmediatamente después

10. **Ejecutar smoke tests (sección 3).** Cualquier fallo → considerar rollback.
11. **Comunicar "completado"** en el canal acordado con resultado.

### Ventana de observación

12. **Vigilar métricas (sección 4.1)** durante la ventana definida.
13. **Confirmaciones funcionales (sección 4.2)** según corresponda al tiempo desde el deploy.

### Cierre

14. **Cerrar el checklist** con timestamp final, issues abiertos, notas para el siguiente deploy.
15. **Reportar al equipo:**
    - Resumen del deploy: tiempo total, smoke tests pasados, métricas dentro de rango.
    - Issues abiertos con owner.
    - Notas para mejorar el proceso.
    - Si hubo incidente: postmortem programado y link al checklist como evidencia.

---

## Restricciones

- **No deployar sin checklist en deploys 🟠 / 🔴.** Para deploys 🟢 / 🟡 puede haber excepciones, nunca para los críticos.
- **No saltarte el rollback plan.** Un deploy sin plan de rollback no es un deploy: es una apuesta.
- **No pegar valores de secretos en el checklist** ni en chat. Si el deploy necesita rotación de secret, indicar el placeholder a actualizar en el secret manager — nunca el valor.
- **No marcar casillas "preventivamente"** antes de verificar el cumplimiento real.
- **No usar este checklist como sustituto del runbook.** El runbook es operación permanente; el checklist es deploy puntual. Se complementan, no se solapan.
- **No mezclar deploys** distintos en el mismo checklist sin razón fuerte. Cada deploy es un evento auditable separado.
- **No omitir comunicación.** Aunque el deploy "sea pequeño", la falta de anuncio es una de las primeras quejas en postmortems.
- Aplican las reglas de output de `_shared/output-rules.md`.
