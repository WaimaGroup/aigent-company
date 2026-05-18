---
name: "software-tech-spec"
user-invocable: true
description: >
  Skill for producing a technical specification document that bridges a PRD/ADR
  to actual implementation: data model changes, API endpoints (or changes),
  service-level design, integration points, migrations, dependencies, edge cases,
  testing strategy, rollout plan. Operative spec for the engineer who will build
  it. Stack-agnostic.
---

# Skill: Tech Spec

**Entregable:** archivo `.md` con la spec técnica de una iniciativa concreta, lista para que un ingeniero (o equipo) la implemente sin ambigüedad. Vive en `<proyecto>/software/architecture/tech-specs/<feature-slug>.md`.

---

## Cuándo usar esta skill

- Se aprobó un PRD/ADR y hay que pasarlo a implementación concreta.
- Una feature requiere coordinar cambios en varios servicios/módulos y conviene una sola spec consolidada.
- El cambio tiene riesgo técnico no trivial (migración, API change, performance) y conviene pensarlo antes de codear.
- Va a haber implicados varios desarrolladores y hay que alinear approach.

**Cuándo NO usar:**

- Para una decisión de arquitectura aislada (es ADR — `adr`).
- Para un bug fix simple (no hace falta tech spec; basta con el bug report + PR).
- Para documentar un sistema ya existente (eso es design doc o runbook).
- Para una feature trivial de cambio menor (el PRD basta).

> **Diferencia vs `adr`:** ADR documenta *una* decisión técnica con opciones y trade-offs. Tech spec documenta *cómo* construir algo aprobado, incluyendo data model, endpoints, migraciones, etc.

> **Diferencia vs `feature-prd`:** feature-PRD es qué + por qué (Product). Tech spec es cómo (Software).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Feature / iniciativa | Nombre y descripción en una frase |
| PRD link | ¿Existe PRD asociado? |
| ADRs relacionados | ¿Hay decisiones de arquitectura previas que aplican? |
| Stack | Lenguaje, framework, base de datos, infra |
| Servicios afectados | ¿Qué servicios / módulos se tocan? |
| Cambios en API | ¿Nuevos endpoints, breaking changes, deprecations? |
| Cambios en BD | ¿Nuevas tablas, migrations, índices? |
| Integraciones externas | ¿Llamadas a servicios de terceros? |
| Plazo / sprint target | ¿Cuándo se necesita en producción? |
| Tech lead / autor | Quién la redacta y revisa |

---

## Plantilla del entregable

Nombre del archivo: `<feature-slug>.md` (ej. `webhook-retry.md`, `tenant-data-migration.md`).

```markdown
---
type: "tech-spec"
feature_name: "<Nombre>"
status: "draft | review | approved | in-build | shipped"
prd_link: "<URL al feature-prd>"
adrs_related: ["<adr-001>", "<adr-007>"]
sprint_target: "<Sprint Xn / YYYY-MM>"
author: "<tech lead / engineer>"
reviewers: ["<persona1>", "<persona2>"]
date_created: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
---

# Tech Spec — <Feature Name>

## 0. TL;DR

> 4-6 líneas. Qué construimos, áreas tocadas, riesgo principal, sprint target.

**Áreas tocadas:** <Service A, Service B, DB schema, frontend app>

**Riesgo principal:** <ej. "migración de datos en tabla con 50M registros — backfill estratégico requerido">

---

## 1. Background

> Por qué construimos esto. Referencia al PRD; no duplicar contenido — solo lo mínimo para que un ingeniero entienda.

- **PRD:** <link>
- **Outcome objetivo:** <métrica + delta>
- **ADRs aplicables:** <listado de decisiones previas que esta spec implementa>

---

## 2. Goals y non-goals técnicos

### Goals

- <Goal técnico 1: ej. "endpoint nuevo POST /webhooks que acepta payload X y publica evento Y">
- <Goal 2: ej. "retry con backoff exponencial">
- <Goal 3>

### Non-goals (explícitamente fuera)

- <Out-of-scope técnico: ej. "no implementamos dead-letter queue en esta iteración (V2)">
- <Out-of-scope: ej. "no cambiamos la auth del webhook receiver">

---

## 3. Arquitectura propuesta

### Visión general

```
[Diagrama ASCII o link a Mermaid/Lucidchart]

[Client] -- POST /webhooks --> [Webhook API]
                                   |
                                   v
                              [Event Queue]
                                   |
                                   v
                              [Worker] --retry on fail--> [Event Queue]
                                   |
                                   v
                              [Destination Service]
```

### Componentes nuevos / modificados

| Componente | Acción | Notas |
|---|---|---|
| `<webhook-api>` | Nuevo endpoint POST /webhooks | Acepta payload con HMAC signature |
| `<event-queue>` (SQS) | Nueva cola dedicada | Visibility timeout 5min, retention 14d |
| `<worker>` | Modificar para consume + retry | Max retries 5 con backoff exponencial |
| `<dlq>` | Nueva dead-letter queue | Manual replay vía script |

### Dependencias

- **Servicios:** SQS, Lambda/ECS, DynamoDB.
- **Internas:** notification-service, audit-log-service.
- **Externas (proveedores):** ninguna nueva.

---

## 4. Cambios en data model

### Nuevas tablas / colecciones

#### `webhook_subscriptions`

```sql
CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id),
  url VARCHAR(2048) NOT NULL,
  secret VARCHAR(64) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  events JSONB NOT NULL, -- array de event types subscribed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subs_account ON webhook_subscriptions(account_id);
CREATE INDEX idx_subs_active ON webhook_subscriptions(active) WHERE active = TRUE;
```

#### `webhook_deliveries`

```sql
CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id),
  event_type VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(16) NOT NULL, -- pending, success, failed, dead
  attempts INT DEFAULT 0,
  last_attempt_at TIMESTAMP,
  next_attempt_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deliveries_status_next ON webhook_deliveries(status, next_attempt_at);
CREATE INDEX idx_deliveries_subscription ON webhook_deliveries(subscription_id, created_at);
```

### Cambios en tablas existentes

| Tabla | Cambio | Migración |
|---|---|---|
| `accounts` | Añadir columna `webhook_quota_used` (INT DEFAULT 0) | ALTER TABLE + backfill 0 |

### Migrations

- **Forward:** ver `db/migrations/2026_05_15_create_webhook_tables.sql`.
- **Rollback:** `DROP TABLE` (no data perdida porque tablas nuevas).
- **Estrategia para producción:** expand-contract no necesario (solo nuevas tablas).

---

## 5. API changes

### Nuevos endpoints

#### `POST /v1/webhooks`

Crea una subscription nueva. **Auth:** Bearer + scope `webhooks:write`.

Request:
```json
{
  "url": "https://example.com/webhook",
  "events": ["order.created", "order.updated"]
}
```

Response 201:
```json
{
  "id": "uuid",
  "url": "https://example.com/webhook",
  "secret": "wh_abc123...",
  "events": ["order.created", "order.updated"],
  "active": true,
  "created_at": "2026-05-13T14:00:00Z"
}
```

Errors:
- 400 invalid URL
- 409 webhook quota exceeded
- 422 invalid event type

> Spec completa en `<api-spec>`.

#### `GET /v1/webhooks` · `GET /v1/webhooks/:id` · `DELETE /v1/webhooks/:id`

Listar / detalle / eliminar. Forma estándar.

### Cambios en endpoints existentes

- Ninguno en esta spec.

### Versioning / deprecation

- Endpoints nuevos en v1. Sin deprecations.

---

## 6. Algoritmos y flows clave

### Retry policy con backoff exponencial

```
attempts: 1, 2, 3, 4, 5
delay:    1m  5m 30m 2h 12h
```

Cada delivery se reintenta hasta 5 veces. Tras 5 fallos, marcar como `dead` y mover a DLQ.

### HMAC signature

```
signature = HMAC-SHA256(timestamp + "." + payload_body, webhook_secret)
header: X-Signature: t=<timestamp>,v1=<signature>
```

Client valida con su secret almacenado.

### Manejo de duplicados

- `Idempotency-Key` opcional en request: misma key dentro de 24h → no duplica.

---

## 7. Edge cases

| Caso | Comportamiento esperado |
|---|---|
| Endpoint del cliente responde 5xx | Retry con backoff. Tras 5 → DLQ |
| Endpoint del cliente responde 410 Gone | Marcar subscription como `inactive` automáticamente; notificar al cliente |
| Payload demasiado grande (>256KB) | Reject con 413, no encolar |
| Cuenta del cliente suspendida durante delivery pendiente | Marcar deliveries pendientes como `cancelled` |
| Cliente cambia URL pero no `secret` | Permitir; rotación de secret es endpoint separado |
| Webhook quota excedida (subscriptions activas) | 409 al crear; no afecta a las activas |

---

## 8. Performance y escalabilidad

### Targets

- **Throughput:** 10k deliveries/min en P95.
- **Latencia de delivery (p50):** <2s desde event a worker.
- **Latencia (p99):** <10s.

### Consideraciones

- Sharding de `webhook_deliveries` por `created_at` si la tabla crece >100M rows.
- Worker autoscaling basado en queue depth.
- Rate limiting por subscription para evitar overwhelming a clientes con problemas.

---

## 9. Seguridad

- **Auth:** Bearer token con scope `webhooks:write` para crear/modificar, `webhooks:read` para listar.
- **HMAC signature** obligatoria en cada delivery — clientes deben validar.
- **Secret rotation:** endpoint dedicado, secret antiguo válido durante 24h tras rotación.
- **URL validation:** solo HTTPS aceptadas (HTTP rechazadas con 400).
- **SSRF protection:** validar que URL destino no es interna (rangos privados, localhost).
- **PII:** payload puede contener PII; encriptación en reposo en SQS (default AWS) + DB.

> Coordinar con `legal-privacy` para confirmar tratamiento si se trata de DPI.

---

## 10. Testing strategy

> Coordinar con `software-qa` para detalle.

### Unit tests

- Cálculo de HMAC signature.
- Retry backoff calculation.
- Idempotency key matching.

### Integration tests

- Endpoint POST → DB → queue → worker → mock client receiver.
- Retry behavior con mock receiver que devuelve 5xx.
- Dead-letter behavior tras 5 fails.

### E2E tests

- Flow completo: crear subscription → trigger event → verificar delivery a webhook receiver real (test endpoint controlado).

### Load test

- 10k deliveries/min sostenidos durante 30 min — validar throughput.

### Security tests

- Verificar SSRF protection con URLs internas.
- Verificar que payload con secret incorrecto rechaza.

---

## 11. Observability

- **Métricas:**
  - `webhook.delivery.attempt.count` (counter)
  - `webhook.delivery.success.count`, `.failure.count`
  - `webhook.delivery.latency` (histogram)
  - `webhook.queue.depth` (gauge)
  - `webhook.subscription.active.count`
- **Logs:** request_id correlation, redacted payload en log (no PII raw).
- **Alertas:**
  - Queue depth > 10k 10min → page.
  - Failure rate > 5% 10min → warning.
  - DLQ depth > 100 → warning.
- **Dashboard:** ver runbook.

---

## 12. Migrations y backfill

- Sin backfill necesario (tablas nuevas).
- Migration ejecutable durante deploy normal — no requiere maintenance window.

---

## 13. Rollout plan

- **Feature flag:** `webhooks_v1_enabled`.
- **Stage 1:** flag off en producción; deploy infraestructura (queue, DB tables).
- **Stage 2:** flag on internamente, con cuentas de empleados. 1 semana de dogfooding.
- **Stage 3:** flag on para 5% de cuentas (cohort estable). Monitor 3 días.
- **Stage 4:** flag on al 50%. Monitor 3 días.
- **Stage 5:** flag on al 100%.

### Rollback

- Flag off → endpoints rechazan con 503 Service Unavailable.
- Datos en SQS/DB se conservan; al re-activar flag, se procesan.

---

## 14. Open questions

> Lo que aún no está cerrado en el momento de escribir la spec.

- [ ] ¿Permitir múltiples webhooks con misma URL? (Decidir: sí o no, default no.)
- [ ] ¿Quota default por cuenta? (Decidir: 10 active subscriptions per account.)
- [ ] ¿Retención de `webhook_deliveries` en DB? (Decidir: 90 días con archive a S3 después.)

---

## 15. Estimación y ownership

| Componente | Effort estimado | Owner |
|---|---|---|
| Endpoints + handlers | 3 días | <Engineer A> |
| Worker + retry logic | 4 días | <Engineer B> |
| DB migrations + indexes | 1 día | <Engineer B> |
| HMAC signature lib (cliente) | 1 día | <Engineer A> |
| Tests (unit + integration) | 3 días | <Engineer A + B> |
| Load test + security review | 2 días | <SRE> |
| Documentation (API spec + runbook) | 2 días | <Tech Lead> |
| **Total** | **~16 days (3 sprints concurrent work)** | |

---

## 16. Anexos

- PRD: <link>
- ADR-001 (cola SQS vs Kafka): <link>
- ADR-007 (HMAC vs OAuth para webhooks): <link>
- Spec del endpoint en formato OpenAPI: <link a `api-spec`>
- Runbook del webhook-service: <link>
- Diagrama detallado: <link a Figma / Lucidchart>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin PRD aprobado y stack claro, parar.
2. **TL;DR primero.** Áreas tocadas + riesgo principal son lo que un manager / tech lead necesita en 30s.
3. **Goals y non-goals técnicos** explícitos. Out-of-scope es donde se evita scope creep.
4. **Arquitectura con diagrama** (ASCII o link). Sin visualización, los engineers proyectan distinto.
5. **Data model y API changes** con specs ejecutables (DDL, JSON schemas reales).
6. **Edge cases** con comportamiento esperado. Esta sección es donde se filtran bugs antes de existir.
7. **Performance y security** declarados — no asumidos.
8. **Rollout con feature flag** y plan de stages. Especialmente para cambios con riesgo de regresión.
9. **Open questions** — lo que aún no está resuelto. Mejor explicitarlo que esconderlo.
10. **Estimación + ownership** — sin esto, la spec es teoría.
11. **Marcar `[VERIFICAR EN IMPL]`** comportamiento aún no implementado, `[OPEN]` decisiones pendientes, `[COORDINAR]` lo que requiere a otro equipo.
12. **Guardar** en `<proyecto>/software/architecture/tech-specs/<feature-slug>.md`.
13. **Reportar** al usuario: ruta, áreas tocadas, riesgo principal, effort total estimado, open questions.

---

## Restricciones

- **No mezcles tech spec con PRD.** PRD es qué/por qué; tech spec es cómo.
- **No documentes comportamiento sin marcar implementación.** `[VERIFICAR EN IMPL]` es honesto.
- **No omitas edge cases.** Es donde viven los bugs futuros.
- **No prometas performance sin baseline o pruebas.** Si dices "10k/min", al menos referenciar el cálculo.
- **No publiques sin estimación.** "Lo construimos" sin tiempo es promesa vacía.
- **No olvides rollout plan**, especialmente para cambios materiales en producción.
- **No copies tech spec de otra feature**. Cada feature tiene su contexto.
- **No saltes la coordinación con qa, privacy, design** cuando aplica.
- Aplican las reglas de output de `_shared/output-rules.md`.
