---
name: "software-runbook"
user-invocable: true
description: >
  Skill for producing a structured operational runbook for a service in
  production: deployment, monitoring (metrics, alerts, dashboards), on-call
  procedures, common incidents with mitigation steps, escalation paths, recovery
  playbooks, dependencies. Stack-agnostic.
---

# Skill: Runbook

**Entregable:** archivo `.md` con runbook operacional completo para un servicio o sistema, listo para uso por el equipo on-call. Vive en `<proyecto>/software/architecture/runbooks/<servicio-slug>.md`.

---

## Cuándo usar esta skill

- Hay que documentar la operativa de un servicio que va o está en producción.
- Hay que onboarding a un nuevo dev/SRE al on-call de un sistema.
- Se rediseña el sistema y conviene actualizar el runbook.
- Tras un incident, parte del post-mortem es incorporar el aprendizaje al runbook.

**Cuándo NO usar:**

- Para documentación de API o contract (eso es `api-spec`).
- Para arquitectura general del sistema (eso es un design doc o ADR — `software-architecture`).
- Para code-level documentation (README del repo cubre eso).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Servicio | Nombre, propósito en una frase |
| Stack | Lenguaje, framework, runtime, base de datos, infra (cloud, on-prem) |
| Repos | URLs de los repos relevantes |
| Entornos | Dev / staging / production — y URLs o cómo se accede |
| Owner / on-call rotation | ¿Quién es responsable? ¿Hay rotación? |
| SLO / SLA | Targets de availability, latencia, throughput |
| Dependencias | Servicios upstream/downstream, terceros (APIs externas, DB, cola, etc.) |
| Observability stack | ¿Logs (CloudWatch, Datadog, ELK)? ¿Metrics (Prometheus, Grafana, Datadog)? ¿Tracing? |
| Incidentes históricos | ¿Hay incidentes recurrentes conocidos? |

---

## Plantilla del entregable

Nombre del archivo: `<servicio-slug>.md` (ej. `payment-api.md`, `user-auth-service.md`).

```markdown
---
type: "runbook"
service: "<Nombre del servicio>"
service_purpose: "<una línea>"
stack: "<lenguaje + framework + runtime>"
owner: "<rol / equipo>"
on_call_rotation: "<link a la rotación / herramienta>"
slo_availability: "<99.9% | etc>"
slo_latency_p99: "<X ms>"
status: "active | deprecated | sunset"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
version: "<vX.Y>"
---

# Runbook — <Servicio>

## 0. TL;DR — para el on-call a las 3 AM

> Lo que el on-call necesita en 30 segundos cuando le suena el pager.

- **Qué hace este servicio:** <una línea>
- **Stack y entry-point:** <ej. "FastAPI en ECS Fargate, behind ALB">
- **Health endpoint:** <URL>
- **Dashboard principal:** <URL>
- **Alertas activas:** <link al panel de alertas>
- **Comando para ver logs en tiempo real:** `<comando>`
- **Escalado de emergencia:** <a quién llamar si no se puede resolver>

---

## 1. Visión general del servicio

### Qué hace

<2-4 líneas. Para qué existe el servicio, qué problema resuelve.>

### Arquitectura de alto nivel

```
[Diagrama ASCII o link a Mermaid/Figma]

[Client] --> [ALB] --> [Service] --> [DB]
                          |
                          v
                    [External API]
```

### Stack tecnológico

- **Lenguaje:** <Node, Python, Go, etc. + versión>
- **Framework:** <Express, FastAPI, Gin, etc.>
- **Runtime:** <Lambda, ECS, GKE, Kubernetes, etc.>
- **Base de datos:** <Postgres, MongoDB, DynamoDB + versión>
- **Cache:** <Redis, Memcached, ninguno>
- **Cola / streaming:** <SQS, Kafka, etc.>
- **Infra-as-Code:** <Terraform, CloudFormation, CDK + path al repo>

---

## 2. Entornos

| Entorno | URL / Endpoint | Credenciales (cómo acceder) | Datos |
|---|---|---|---|
| **Production** | <URL> | <herramienta SSO / Vault path> | Producción real, **NO TOUCH sin proceso** |
| **Staging** | <URL> | <herramienta> | Datos sintéticos / anonimizados |
| **Dev** | <URL local> | <docker-compose / similar> | Datos locales |

### Cómo levantar el servicio en local

```bash
# Pasos exactos
git clone <repo>
cd <repo>
cp .env.example .env  # rellenar variables
docker-compose up
# Servicio disponible en http://localhost:<port>
# Health: http://localhost:<port>/health
```

---

## 3. Deploy

### Pipeline

- **Trigger:** <push a main / PR mergeada / manual approve>
- **CI/CD herramienta:** <GitHub Actions / GitLab CI / Jenkins / etc.>
- **Steps:** lint → tests → build → deploy a staging → manual approve → deploy a prod.
- **Link al pipeline:** <URL>

### Rollback

- **Comando para rollback:**
  ```bash
  <comando exacto>
  ```
- **Tiempo aproximado de rollback:** <X min>
- **Riesgos de rollback:** <ej. migrations no reversibles>

### Migrations de base de datos

- **Forward:** <comando o referencia al tooling>
- **Rollback:** <comando si reversible / "no reversible, hacer backup antes" si no>
- **Estrategia para downtime:** <expand-contract pattern, blue-green, etc.>

---

## 4. Observability

### Métricas clave

| Métrica | Qué mide | Target | Dashboard | Alerta umbral |
|---|---|---|---|---|
| **Availability** | % requests 2xx + 3xx / total | > 99.9% | <URL> | < 99% → page |
| **Latency p50** | mediana de latencia | < 100ms | <URL> | > 500ms 5min → warning |
| **Latency p99** | percentil 99 | < 1s | <URL> | > 2s 5min → page |
| **Error rate** | 5xx + timeouts | < 0.1% | <URL> | > 1% 5min → page |
| **Throughput** | RPS | <variable> | <URL> | — |
| **Saturation** | CPU/memoria/disco/conexiones | < 80% | <URL> | > 90% 10min → warning |

### Logs

- **Dónde:** <CloudWatch / Datadog / ELK + paths>
- **Niveles configurados:** <INFO en prod, DEBUG en dev>
- **Búsqueda típica para incidentes:**
  ```
  service:<nombre> AND level:ERROR AND timestamp:[-15m to now]
  ```
- **Logs sensibles:** <qué se redacta, qué no se loguea nunca: PII, secretos, tokens>

### Tracing

- **Herramienta:** <Datadog APM / Jaeger / Honeycomb / nada>
- **Spans relevantes:** <ej. db.query, external.api.call>
- **Cómo enlazar un trace desde un log:** <correlation ID, request ID>

### Alertas activas

> Listar las alertas configuradas con su severidad y a quién notifican.

| Alerta | Condición | Severidad | Canal | Acción típica |
|---|---|---|---|---|
| <Service down> | Health check fail 2/3 | 🔴 Page on-call | PagerDuty | Sección 5.1 |
| <High error rate> | > 1% 5xx en 5 min | 🔴 Page | PagerDuty | Sección 5.2 |
| <DB connection pool exhausted> | conn > 90% 10 min | 🟠 Slack #ops | Slack | Sección 5.3 |
| <Slow queries> | p99 > 2s 10 min | 🟡 Slack #ops | Slack | Sección 5.4 |

---

## 5. Incidentes comunes — playbooks

> Por cada incidente común, un mini-playbook reproducible.

### 5.1 Service down (health check fail)

**Síntomas:**
- Alerta "Service down" en PagerDuty.
- Health endpoint devuelve 5xx o timeout.

**Diagnóstico (5 min):**
1. Comprobar dashboard de availability: <URL>.
2. Comprobar logs últimos 15 min: <query>.
3. Comprobar despliegues recientes: <link al pipeline>.

**Mitigación (en orden):**
1. **Rollback inmediato** si hubo deploy en últimos 30 min: `<comando>`.
2. **Restart del servicio**: `<comando>`.
3. **Scale up** si parece overload: `<comando>`.
4. **Escalado** si nada funciona en 15 min → llamar a <persona/equipo>.

**Post-incident:**
- Crear ticket de post-mortem.
- Actualizar runbook si emerge causa nueva.

---

### 5.2 High error rate (5xx > 1%)

**Síntomas:**
- Alerta "High error rate".
- Spike de 5xx en dashboard.

**Diagnóstico:**
1. Identificar endpoint(s) afectados: <query/dashboard>.
2. Top errores por mensaje: <query>.
3. Comprobar dependencias (DB, external APIs): <links a sus dashboards>.

**Mitigación:**
- Si error de DB → sección 5.3.
- Si error de external API → activar circuit breaker / fallback.
- Si error de código nuevo → rollback.

---

### 5.3 DB connection pool exhausted

**Síntomas:**
- Errores "could not get connection from pool" en logs.

**Diagnóstico:**
1. Ver active connections: `<comando SQL>`.
2. Slow queries: `<comando o dashboard>`.

**Mitigación:**
1. Identificar queries lentas → kill si seguras de matar.
2. Aumentar pool size (cuidado: no resuelve causa).
3. Scale up DB si saturada.

---

### 5.4 Slow queries

(misma estructura)

(repetir por incidente conocido)

---

## 6. Dependencias

### Servicios upstream (lo que llama a este servicio)

| Servicio | Tipo de uso | Owner | Cómo afecta si nuestro servicio cae |
|---|---|---|---|
| <Servicio A> | Sync HTTP | <equipo> | <impacto> |
| <Servicio B> | Async events | <equipo> | <impacto> |

### Servicios downstream (lo que este servicio llama)

| Servicio | Tipo | Owner | Cómo afecta si cae |
|---|---|---|---|
| <DB Postgres> | Sync | Self | Servicio cae |
| <External Payment API> | Sync HTTP | Stripe | Pagos fallan; otros endpoints OK |
| <Notification queue> | Async | <equipo interno> | Notifs se retrasan |

### Circuit breakers / fallbacks

- **External Payment API:** circuit breaker abierto tras 5 fallos en 30s. Fallback: <comportamiento>.
- **Notification queue:** retry exponencial con max 5 intentos. Dead letter queue: <ubicación>.

---

## 7. Mantenimiento periódico

### Tareas recurrentes

| Tarea | Frecuencia | Cómo | Owner |
|---|---|---|---|
| Rotar credenciales DB | Cada 90 días | <link al proceso> | Security |
| Revisar logs de seguridad | Semanal | <query> | <persona> |
| Limpiar tabla X | Mensual | <comando o cron> | Self |
| Audit de alertas | Trimestral | Revisar que sigan siendo útiles | On-call lead |
| Review del runbook | Trimestral | Actualizar con incidentes recientes | Owner |

---

## 8. Escalado de incidentes

```
Severidad 🔴 (down / data loss):
  → On-call inmediato (PagerDuty)
  → Si no resuelve en 30 min → escalar a tech lead
  → Si afecta a clientes en producción → activar incident commander
  → Comunicación externa: status page + email a clientes afectados (sección 9)

Severidad 🟠 (degraded):
  → On-call durante horario laboral
  → Slack #ops fuera de horario

Severidad 🟡 (warning):
  → Slack #ops, sin pager
```

---

## 9. Comunicación durante incidente

### Status page

- **URL:** <statuspage del proyecto>
- **Quién actualiza:** on-call o incident commander.
- **Plantilla de update inicial:** *"Estamos investigando reports de <síntoma>. Más info en breve."*
- **Plantilla de update durante:** *"Hemos identificado el problema. Trabajando en mitigación. ETA: <X min>."*
- **Plantilla de resolved:** *"Servicio restablecido. Trabajaremos en un post-mortem en las próximas 48h."*

### Email a clientes afectados (si aplica)

- Threshold de notificación: <criterio>.
- Plantilla: <link>.
- Aprobación: <quién firma antes de enviar>.

---

## 10. Anexos

- **ADRs del servicio:** <links a `<proyecto>/software/architecture/adr/`>
- **API spec:** <link a `<proyecto>/software/architecture/<servicio>-api-spec.md`>
- **Post-mortems pasados:** <link>
- **Diagrama detallado:** <link a Figma / Lucidchart>
- **Repos:** <listado>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin owner, SLO claros y stack, parar.
2. **Empezar por el TL;DR.** Lo que el on-call necesita a las 3 AM va primero.
3. **Documentar entornos con cómo levantar local.** Sin esto, onboarding tarda días innecesarios.
4. **Métricas y alertas con umbrales explícitos.** Vagas son inútiles.
5. **Playbooks por incidente común** — el valor del runbook está aquí. Sin estos, el runbook es decorativo.
6. **Dependencias explícitas** — un incidente externo se gestiona distinto si sabes qué depende de qué.
7. **Tareas recurrentes** documentadas — sin esto, mantenimiento se olvida hasta que rompe.
8. **Escalado paths** claros — sin esto, en plena crisis no se sabe a quién llamar.
9. **Marcar `[DASHBOARD URL]`** lo que requiere link real, `[OWNER PENDIENTE]` lo que no tiene dueño asignado, `[VERIFICAR EN PROD]` lo que requiere validación operativa.
10. **Guardar** en `<proyecto>/software/architecture/runbooks/<servicio-slug>.md`.
11. **Reportar** al usuario: ruta, secciones críticas, items pendientes, próxima revisión recomendada.

---

## Restricciones

- **No inventes comandos.** Cada comando del runbook tiene que haber sido probado o estar marcado `[VERIFICAR EN PROD]`.
- **No omitas el TL;DR.** Es lo único que se lee en una emergencia.
- **No documentes hardcoded secrets** ni paths a credenciales sensibles. Referenciar la herramienta (Vault, SSM), nunca el valor.
- **No copies runbooks de otros servicios sin adaptar.** Cada servicio tiene su estack, sus métricas y sus incidentes.
- **No olvides actualizar tras un incident.** Si emerge un caso nuevo, va al runbook antes de cerrar el post-mortem.
- **No mezcles runbook con diseño de arquitectura.** Para diseño hay ADRs y design docs.
- **No omitas las dependencias.** Un servicio sin dependencias documentadas es un servicio cuyos incidents siempre sorprenden.
- Aplican las reglas de output de `_shared/output-rules.md`.
