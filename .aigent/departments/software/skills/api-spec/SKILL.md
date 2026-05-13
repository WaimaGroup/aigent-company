---
name: "api-spec"
description: >
  Skill for producing a structured API specification document: endpoints with
  method/path/auth, request/response schemas with field types and examples,
  errors with status codes, pagination/filtering conventions, versioning,
  rate-limiting, deprecation policy. OpenAPI-aware but written in narrative
  markdown for human + LLM consumption.
---

# Skill: API Spec

**Entregable:** archivo `.md` con la especificación del API (un servicio, un endpoint complejo, o un conjunto coherente), listo para handoff a engineering (cliente y servidor) y como contrato compartido entre equipos. Vive en `<proyecto>/software/architecture/api-specs/<servicio-slug>.md`.

---

## Cuándo usar esta skill

- Hay que diseñar un nuevo API antes de implementarlo (design-first).
- Hay que documentar un API existente que no estaba documentado.
- Hay que actualizar la spec porque cambió el API (versión nueva, breaking change, deprecation).
- Hay que exponer un API a un cliente externo y se necesita doc consumible.

**Cuándo NO usar:**

- Para arquitectura de alto nivel del sistema (eso es ADR o design doc).
- Para auto-generar OpenAPI/Swagger desde el código (esta skill produce el documento de diseño/contrato; OpenAPI auto-generado es derivado).
- Para documentación interna de implementación (eso es README del repo).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Servicio / módulo | Nombre y propósito en una frase |
| Audiencia | Engineers internos / partners externos / públicos |
| Estilo de API | REST / GraphQL / gRPC / WebSocket / mixto |
| Base URL | URL base por entorno (prod, staging, dev) |
| Auth scheme | Bearer / API Key / OAuth 2.0 / mTLS / etc. |
| Endpoints / operaciones | Lista inicial de endpoints o operaciones a documentar |
| Modelos de datos clave | Entidades principales con sus campos |
| Pagination / filtering | ¿Hay convención ya elegida? (offset, cursor, ...) |
| Versionado | ¿En URL (`/v1/`), en header, no versionado todavía? |
| Errores | ¿Formato estándar de errores? |
| Rate limiting | ¿Hay límites por consumidor? |

---

## Plantilla del entregable

Nombre del archivo: `<servicio-slug>.md` (ej. `payment-api.md`, `users-api-v2.md`).

```markdown
---
type: "api-spec"
service: "<Nombre del servicio>"
api_style: "REST | GraphQL | gRPC | WebSocket"
audience: "internal | external-partners | public"
version: "<vX.Y>"
base_url_prod: "<URL>"
base_url_staging: "<URL>"
auth_scheme: "Bearer | API-Key | OAuth2 | mTLS"
status: "draft | review | published | deprecated"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<rol/equipo>"
---

# API Specification — <Servicio> · v<X.Y>

## 0. Resumen ejecutivo

> 5-7 líneas. Qué hace el API, qué problemas resuelve, principales endpoints.

**Endpoints principales:**
- `GET /<resource>` — listar
- `POST /<resource>` — crear
- `GET /<resource>/{id}` — detalle
- `PUT /<resource>/{id}` — actualizar
- `DELETE /<resource>/{id}` — eliminar

---

## 1. Información general

### Base URLs

| Entorno | URL |
|---|---|
| Production | `<https://api.empresa.com/v1>` |
| Staging | `<https://staging-api.empresa.com/v1>` |
| Dev (local) | `<http://localhost:3000/v1>` |

### Autenticación

- **Esquema:** <Bearer / API-Key / OAuth 2.0>
- **Header:** `Authorization: Bearer <token>` (o equivalente)
- **Cómo obtener un token:** <flujo: login endpoint, OAuth flow, API key console>
- **Caducidad:** <X horas / no caduca / refresh con `<endpoint>`>
- **Scopes (si OAuth):** <listado>

### Versionado

- **Estrategia:** <URL `/v1/`, header `Api-Version`, sin versión>
- **Política de breaking changes:** <ej. "breaking changes solo en major version; minor y patch son backwards-compatible">
- **Deprecation policy:** versiones marcadas deprecated 6 meses antes de retirarse; aviso en `Sunset` header.

### Formato

- **Content-Type:** `application/json`
- **Charset:** UTF-8
- **Timestamps:** ISO 8601 UTC (ej. `2026-05-13T14:30:00Z`)
- **Booleans:** `true` / `false`
- **Null:** `null` (no `"null"` ni omitir)

---

## 2. Convenciones generales

### Pagination

> Una convención consistente para listados.

**Cursor-based (recomendado para datos cambiantes):**
- Query params: `?limit=<N>&cursor=<opaque-string>`
- Response: `{ "data": [...], "pagination": { "next_cursor": "...", "has_more": true } }`

**Offset-based (alternativa para datos estables):**
- Query params: `?limit=<N>&offset=<N>`
- Response: `{ "data": [...], "pagination": { "total": <N>, "limit": <N>, "offset": <N> } }`

> Definir **una** convención por API y aplicar consistentemente.

### Filtering y sorting

- **Filtros:** `?status=active&created_after=2026-01-01`
- **Sorting:** `?sort=created_at` (asc por defecto), `?sort=-created_at` (desc).
- **Búsqueda full-text:** `?q=<query>` cuando aplica.

### Errores

> Formato estándar para cualquier error.

**Status codes:**
| Código | Significado |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (input inválido) |
| 401 | Unauthorized (token ausente / inválido) |
| 403 | Forbidden (autenticado pero sin permiso) |
| 404 | Not Found |
| 409 | Conflict (estado incompatible) |
| 422 | Unprocessable Entity (validación falla) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

**Body de error:**
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable message",
    "details": {
      "field": "email",
      "reason": "format_invalid"
    },
    "request_id": "<uuid para tracing>"
  }
}
```

### Rate limiting

- **Límite por consumidor:** <ej. 1000 req/min por API key>.
- **Headers de respuesta:**
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 845`
  - `X-RateLimit-Reset: 1715692800` (unix epoch)
- **Respuesta cuando se excede:** 429 con `Retry-After: <seconds>` header.

### Idempotency

> Para operaciones POST que se pueden retry.

- Header: `Idempotency-Key: <uuid>`
- Comportamiento: misma key dentro de <ventana> devuelve la misma respuesta sin re-ejecutar.

### Webhooks (si aplica)

- Eventos disponibles, firma HMAC, retry policy. Sección separada si el API tiene webhooks.

---

## 3. Modelos de datos

> Schemas de las entidades principales. Cada campo con tipo, requerido/opcional, y nota cuando aplica.

### `User`

```json
{
  "id": "string (uuid)",
  "email": "string (email format)",
  "full_name": "string",
  "role": "enum: admin | member | viewer",
  "status": "enum: active | invited | suspended",
  "metadata": "object (opcional, keys arbitrarias)",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)"
}
```

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| id | string (uuid) | sí (read-only) | Generado por el servidor |
| email | string | sí | Único, formato email validado |
| full_name | string | sí | 1-100 chars |
| role | enum | sí | Default: `member` |
| status | enum | sí (read-only) | Cambia vía endpoint específico |
| metadata | object | no | Hasta 16 keys, valores string max 256 chars |
| created_at | string | sí (read-only) | |
| updated_at | string | sí (read-only) | |

### `<Otra entidad>`

(misma estructura)

---

## 4. Endpoints

> Por cada endpoint: método, path, descripción, request, response, errores específicos, ejemplo.

### `GET /users` — Listar usuarios

**Descripción:** Devuelve un listado paginado de usuarios filtrable y ordenable.

**Auth:** Bearer · scope: `users:read`

**Query parameters:**

| Param | Tipo | Requerido | Default | Notas |
|---|---|---|---|---|
| `limit` | integer | no | 50 | Max 100 |
| `cursor` | string | no | — | Opaque cursor de respuesta previa |
| `status` | enum | no | — | Filtro: active / invited / suspended |
| `sort` | string | no | `created_at` | Prefijo `-` para descendente |

**Response 200:**
```json
{
  "data": [
    { "id": "...", "email": "user@example.com", "full_name": "...", "role": "member", "status": "active", "created_at": "...", "updated_at": "..." },
    ...
  ],
  "pagination": {
    "next_cursor": "eyJhYmMiOjEyM30=",
    "has_more": true
  }
}
```

**Errores específicos:**
- `400` `INVALID_FILTER`: filtro con valor no permitido.

**Ejemplo cURL:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.empresa.com/v1/users?status=active&limit=20"
```

---

### `POST /users` — Crear usuario

**Descripción:** Crea un usuario nuevo. Si el `email` ya existe, devuelve 409.

**Auth:** Bearer · scope: `users:write`

**Request body:**
```json
{
  "email": "new@example.com",
  "full_name": "New User",
  "role": "member"
}
```

| Field | Tipo | Requerido | Notas |
|---|---|---|---|
| email | string | sí | Email único |
| full_name | string | sí | 1-100 chars |
| role | enum | no (default `member`) | |

**Response 201:**
```json
{ "id": "...", "email": "new@example.com", "full_name": "New User", "role": "member", "status": "invited", "created_at": "...", "updated_at": "..." }
```

**Errores específicos:**
- `409` `EMAIL_EXISTS`: el email ya está registrado.
- `422` `VALIDATION_FAILED`: `email` o `full_name` no pasan validación.

**Idempotency:** soportado con header `Idempotency-Key`.

---

### `GET /users/{id}` — Obtener usuario por id

(misma estructura)

---

### `PUT /users/{id}` — Actualizar usuario

(misma estructura)

---

### `DELETE /users/{id}` — Eliminar usuario

(misma estructura)

---

(repetir por cada endpoint)

---

## 5. Webhooks (si aplica)

### Eventos disponibles

| Evento | Cuándo se dispara | Payload |
|---|---|---|
| `user.created` | Tras POST exitoso | `{ "event": "user.created", "data": <User> }` |
| `user.deleted` | Tras DELETE | `{ "event": "user.deleted", "data": { "id": "..." } }` |

### Firma HMAC

- Header: `X-Signature: sha256=<hex>`
- Compute: `HMAC-SHA256(payload, webhook_secret)`

### Retry policy

- Hasta 5 intentos en backoff exponencial (1m, 5m, 30m, 2h, 12h).
- Si todos fallan, evento se marca dead-letter; queda accesible vía endpoint `GET /webhooks/dead-letter`.

---

## 6. SDK / Client libraries

| Lenguaje | URL al SDK | Versión |
|---|---|---|
| Node.js | <link> | <ver> |
| Python | <link> | <ver> |
| Go | <link> | <ver> |

(o `[NO HAY SDK OFICIAL — solo HTTP]`).

---

## 7. Changelog

| Versión | Fecha | Cambios |
|---|---|---|
| <vX.Y> | <YYYY-MM-DD> | <cambios>; breaking: <listado> |
| <vX.Y-1> | <YYYY-MM-DD> | <cambios> |

---

## 8. Deprecation y sunset

- **Endpoints / fields deprecated:**
  - `<endpoint o field>` — deprecated en <vX.Y>; será retirado en <vX.Z> (fecha aproximada <YYYY-MM>). Alternativa: `<reemplazo>`.

- **Política general:**
  - Aviso 6 meses antes de sunset.
  - Header `Sunset: <date>` en respuestas de endpoints deprecated.
  - Comunicación al usuario por email + status page.

---

## 9. Diagrama de flujo *(opcional, si ayuda)*

```
[Client] --(POST /users)--> [API] --(insert)--> [DB]
                              |
                              +-(emit)-> [Webhook: user.created]
```

---

## 10. Anexos

- **Repo del API:** <link>
- **OpenAPI / Swagger auto-generado:** <link si existe>
- **Postman collection:** <link>
- **Runbook del servicio:** <link a `<proyecto>/software/architecture/runbooks/...`>
- **ADRs relacionados:** <links>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin estilo de API y auth, parar.
2. **Definir convenciones generales primero** (sección 2): pagination, filtering, errores, rate limiting. Sin esto, cada endpoint inventa la suya y resulta inconsistente.
3. **Modelos de datos antes que endpoints.** Los endpoints consumen entidades; definirlas primero evita reescribir.
4. **Endpoints con ejemplos cURL.** Sin ejemplos, los engineers cliente tienen que adivinar.
5. **Errores específicos por endpoint** además de los genéricos. "400 si el email es inválido" es útil; solo "400 Bad Request" no.
6. **Versionado y deprecation policy** explícitos desde el día 1. Sin esto, todo cambio se vuelve breaking.
7. **Marcar `[VERIFICAR EN IMPL]`** comportamientos del diseño que aún no están implementados, `[BREAKING CHANGE]` cambios respecto a versión previa, `[INTERNAL ONLY]` endpoints no expuestos públicamente.
8. **Cross-link con runbook y ADRs.** La spec en silo se desactualiza; en red de docs se mantiene.
9. **Guardar** en `<proyecto>/software/architecture/api-specs/<servicio-slug>.md`. Si el proyecto auto-genera OpenAPI desde el código, esta spec es el doc de diseño/contrato — OpenAPI es derivado.
10. **Reportar** al usuario: ruta, endpoints documentados, convenciones definidas, items pendientes.

---

## Restricciones

- **No documentes comportamiento no implementado** sin marcar `[VERIFICAR EN IMPL]` o `[FUTURE]`. Específicamente cuidado con errores que el handler aún no devuelve.
- **No mezcles convenciones.** Una sola estrategia de pagination, una sola forma de errores.
- **No omitas errores.** Documentar solo el camino feliz crea sorpresas en producción.
- **No copies docs de otro API** sin adaptar a tu estructura, errors y modelos reales.
- **No publiques versión nueva sin changelog detallado** especialmente para breaking changes.
- **No expongas campos internos** (raw DB IDs sin uso, flags internos) — la spec es contrato del API público o semi-público.
- **No olvides deprecation policy.** APIs sin política de deprecation acumulan endpoints zombi.
- Aplican las reglas de output de `_shared/output-rules.md`.
