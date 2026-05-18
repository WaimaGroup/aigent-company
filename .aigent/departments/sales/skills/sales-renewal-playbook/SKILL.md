---
name: "sales-renewal-playbook"
user-invocable: true
description: >
  Skill for producing a renewal playbook for an existing customer: health
  signals, outreach timing, conversation scripts, expansion opportunities,
  pricing negotiation framework, and churn risk mitigation. Used by sales-ae or
  customer-success roles for SaaS or recurring-revenue businesses.
---

# Skill: Renewal Playbook

**Entregable:** archivo `.md` con el playbook de renovación para una cuenta o segmento, listo para uso operativo en el ciclo de retención. Vive en `<proyecto>/sales/playbooks/renewal-<scope-slug>.md` (puede ser por segmento o por cuenta concreta).

---

## Cuándo usar esta skill

- Hay que diseñar el proceso de renovación de un segmento de clientes (SMB, mid-market, enterprise).
- Hay que preparar la renovación de una cuenta concreta high-value con foco específico.
- Se quiere mejorar la retention rate de la empresa con un playbook reproducible.
- Hay que entrenar al equipo de CS/AE en cómo conducir renovaciones consistentemente.

**Cuándo NO usar:**

- Para un nuevo deal (eso es `discovery-call` + `sales-proposal`).
- Para customer onboarding inicial (eso es responsabilidad de CS, no este playbook).
- Para casos de churn ya consumado (eso es exit interview + post-mortem, no renewal).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | Segmento (SMB / mid-market / enterprise) o cuenta concreta |
| Producto y modelo | ¿Suscripción anual? ¿mensual? ¿multianual? ¿usage-based? |
| Ciclo típico | ¿Cuándo se renueva? (auto-renewal silent / opt-in manual / negotiation activa) |
| Métricas de salud disponibles | ¿Qué señales tenemos? (uso del producto, NPS, tickets de soporte, expansion histórica) |
| Antecedentes | ¿Cuál es la retention rate actual? ¿Hay razones recurrentes de churn? |
| Decisor en la cuenta | ¿Quién firma renovación? ¿Misma persona que firmó la primera vez? |
| Tiempo de outreach | ¿Cuántos días antes de renovación empezamos contacto? |
| Audiencia | AEs, Customer Success Managers, mixto |

---

## Plantilla del entregable

Nombre del archivo: `renewal-<scope-slug>.md` (ej. `renewal-enterprise.md`, `renewal-acme-corp.md`).

```markdown
---
type: "renewal-playbook"
scope: "segment <name> | account <name>"
product_model: "annual-subscription | monthly | multi-year | usage-based"
auto_renewal: true | false
status: "draft | approved | in-use"
date: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<sales / cs lead>"
---

# Renewal Playbook — <Scope>

## 0. Objetivo

> 2-3 líneas. Qué buscamos lograr con cada renovación.

**Outcomes esperados (en orden de preferencia):**
1. **Renewal + expansion** (upsell, cross-sell, multi-year).
2. **Renewal at par** (mismo plan, mismo precio).
3. **Renewal con concesión limitada** (descuento pequeño justificado).
4. **Renewal multianual con descuento** (lock-in a cambio de descuento moderado).
5. **Renewal en downgrade** (cliente baja de plan; mejor downgrade que churn).
6. ❌ **Churn** — qué hacemos para que no llegue aquí.

---

## 1. Health signals — diagnóstico previo

> Antes de cualquier outreach, evaluar la salud de la cuenta.

### 🟢 Healthy account

- Uso del producto: ≥ <umbral activo>
- Login frequency: ≥ <X veces/semana>
- NPS / CSAT: ≥ <umbral>
- Tickets de soporte: < <umbral>
- Champion activo identificado: Sí
- Expansion histórica: Sí (ha comprado más a lo largo del contrato)

### 🟡 At-risk account

- Uso del producto cae > 30% vs trimestre anterior.
- Champion ha dejado la empresa o cambió de rol.
- NPS bajó o no respondió a últimas encuestas.
- Tickets de soporte con tono frustrado.
- Reduced ARR (downgrade voluntario previo).

### 🔴 Churn-likely account

- Uso < 20% del baseline.
- No hay champion identificado o activo.
- Cliente ha pedido pause / discount sin explicación.
- Mencionó al competidor.
- No respuesta a outreach de los últimos 30 días.

**Fuente de las señales:** integraciones con producto (analytics, login events), CRM (interacciones), CS tooling (tickets, NPS).

---

## 2. Timeline de outreach

> Cuándo empezar el contacto antes de renewal. Ajustar según ciclo del producto.

### 90 días antes (T-90)

- **Quick pulse**: enviar NPS o equivalent, revisar señales.
- Identificar champion vigente. Si cambió, identificar nuevo aliado interno.
- **Score health**: 🟢 / 🟡 / 🔴 por la sección 1.

### 60 días antes (T-60)

- **Business review meeting** con la cuenta:
  - Recordar valor entregado (métricas, casos de éxito internos).
  - Entender prioridades del próximo año del cliente.
  - Identificar oportunidades de expansion.
- **Tono:** consultivo, no comercial.

### 45 días antes (T-45)

- **Propuesta de renovación inicial:**
  - Si 🟢: proponer renewal + expansion o multianual con descuento.
  - Si 🟡: proponer renewal at par + plan de éxito para próximo año.
  - Si 🔴: agendar conversación específica sobre el problema; no proponer renovación todavía.

### 30 días antes (T-30)

- **Follow-up activo.** Si no hay respuesta, escalar (mismo champion + decisor).
- Si hay objeciones, abordarlas con `objection-handler`.

### 15 días antes (T-15)

- **Cierre:** firma o committed verbal.
- Si hay riesgo de no llegar a tiempo, evaluar extender con grace period (cuidado: precedente).

### Día 0 — Renovación

- Auto-renewal silent: confirmación administrativa al cliente.
- Manual: firma formal.
- Si hay churn: ejecutar exit process limpio (cancelación, datos, off-boarding).

### T+30 / T+60 / T+90 — Onboarding del nuevo periodo

- Si hubo expansion, asegurar adopción de lo nuevo.
- Reset de KPIs de la cuenta para el nuevo ciclo.

---

## 3. Scripts por situación

### 3.1 Business review meeting (T-60)

**Apertura:**
> *"Quería tener esta conversación contigo antes de empezar a hablar de la renovación, para entender bien dónde estáis ahora y qué viene este año. Te parece bien si revisamos primero qué habéis conseguido con <Producto> y luego hablamos de lo que viene."*

**Preguntas clave:**
- *"¿Qué ha funcionado bien con <Producto> este año?"*
- *"¿Qué te ha frustrado o has echado en falta?"*
- *"¿Cómo se ve el próximo año para tu equipo? ¿Qué objetivos hay?"*
- *"¿Hay cambios en tu equipo o en cómo trabajáis que afecten al uso del producto?"*

**Datos a tener preparados:**
- Métricas de adopción (logins, uso de features clave).
- ROI o impacto medible (si lo tenemos).
- Tickets resueltos, mejoras shippadas que afectan a la cuenta.

---

### 3.2 Conversación de renewal at par (T-45, cuenta 🟢)

**Apertura:**
> *"Como hablamos en el business review, las cosas han ido bien este año. Te traigo la renovación: mismas condiciones que el año pasado más <pequeño valor añadido si lo hay>. ¿Lo revisamos esta semana?"*

**Si quieren descuento:**
- Explorar antes de conceder: *"¿Hay alguna razón específica por la que estás pidiendo ajuste de precio? ¿Hay algo que no te ha funcionado bien?"*
- Si hay justificación real → considerar concesión limitada o cambiar plan.
- Si no hay justificación real → mantener precio, ofrecer valor extra (servicio, training, early access) en lugar de descuento.

---

### 3.3 Conversación de expansion (T-45/T-60, cuenta 🟢 con uso alto)

**Apertura:**
> *"He visto que estáis usando <feature/módulo> de forma intensiva. Hay dos opciones para que esto crezca con vosotros: <Plan superior> o <Add-on específico>. Te explico cada una en 5 min."*

**Foco:** valor incremental, no presión. Si el cliente no ve el valor, no forzar.

---

### 3.4 Conversación de cuenta 🟡 (at-risk)

**Apertura:**
> *"Antes de hablar de renovación quería entender bien cómo os ha ido este año. He visto que el uso ha bajado un poco y quiero asegurarme de que no es porque haya algo que no estemos resolviendo."*

**Plan:**
- Diagnóstico honesto del por qué del bajo uso.
- Si es un problema solucionable (training, feature missing, integration) → plan de éxito antes de renewal.
- Si es un problema estructural (cliente cambió de prioridades, organización) → conversar honesto sobre fit.

---

### 3.5 Conversación de cuenta 🔴 (churn-likely)

**Apertura:**
> *"Antes de pensar en renovación, necesito entender qué está pasando. He visto señales de que algo no está funcionando bien y prefiero ser directo: ¿hay algo concreto que no os esté sirviendo?"*

**Plan:**
- Escuchar primero, defender después.
- Si la razón es producto → ¿podemos resolverlo? ¿en qué plazo?
- Si la razón es presupuesto del cliente → opciones: downgrade, pause, grace period.
- Si la razón es competidor → entender qué ofrecen, decidir si competimos o cerramos limpio.
- Si churn es inevitable → ejecutar exit limpio (sección 5).

---

## 4. Negociación de pricing — framework

### Concessions ladder (de menor a mayor coste)

1. **Servicios añadidos sin coste real** (training extra, early access a feature, dedicated CSM check-ins).
2. **Lock-in multianual con descuento moderado** (10-15%) a cambio de 2-3 años.
3. **Descuento al precio actual** (5-15% según valor del deal y antigüedad).
4. **Pause / freeze** del contrato 1-3 meses (último recurso).
5. **Downgrade a plan inferior** (mejor que churn).

### Reglas

- **Siempre justificar el porqué** del descuento, no concederlo por default.
- **Buscar trade**: si concedes precio, pide algo (multi-year, case study, referral, expansion en otro vector).
- **Documentar la concesión** en CRM con motivo, para no crear precedente sin contexto.

---

## 5. Si llega el churn — exit limpio

> Si el cliente decide no renovar, ejecutar proceso ordenado.

- **Confirmar decisión por escrito** (no dejar que se prolongue ambigua).
- **Exit interview** (5-7 preguntas, sección siguiente).
- **Off-boarding:**
  - Datos del cliente: política de retención + opción de export.
  - Acceso al producto: cuándo se corta.
  - Comunicación al equipo del cliente.
- **Mantener la puerta abierta:** "If anything changes, here's how to reach us."
- **Win-back tracking:** anotar en CRM para outreach futuro (6-12 meses).

### Exit interview — preguntas

1. ¿Cuál fue el motivo principal para no renovar?
2. ¿Qué te hubiera hecho renovar?
3. ¿A qué vais a usar para resolver <problema>?
4. ¿Algo que el producto debería tener que no tiene?
5. ¿Volverías a considerar <Producto> si <X cambia>?
6. ¿Estás dispuesto/a a darnos una breve reseña / case study sobre tu experiencia?

---

## 6. Expansion playbook — cuando hay oportunidad

> Señales y movimiento para crecer la cuenta.

### Señales de oportunidad de expansion

- Uso al límite de plan actual (seats, volume, features).
- Nuevos equipos / departamentos del cliente preguntan por el producto.
- Champion ha sido promovido o pasó a un cargo con más presupuesto.
- Caso de uso adyacente que nuestro producto cubre y no usan aún.

### Mover la conversación

- *"He visto que vuestro equipo de <X> está mirando soluciones para <Y>. ¿Has considerado usar <Producto> también para eso?"*
- Pilot con bajo riesgo en el segundo equipo antes de comprometer expansión grande.

---

## 7. Métricas que vigilamos

| Métrica | Definición | Target | Owner |
|---|---|---|---|
| **Net Revenue Retention (NRR)** | (MRR final - churn + expansion) / MRR inicial | > 110% (saludable SaaS B2B) | CS / Sales |
| **Gross Revenue Retention (GRR)** | (MRR final - churn) / MRR inicial | > 90% | CS |
| **Churn rate** | % accounts que no renovaron | < <umbral> | CS |
| **Expansion rate** | % accounts que aumentaron contrato | > <umbral> | Sales |
| **Cycle de renewal** | Días de outreach hasta firma | < 90 días | Sales |

---

## 8. Recursos

- Battle cards de competidores que aparecen en renewals: <link>
- Case studies del segmento: <link>
- Pricing matrix vigente: <link>
- Playbooks de objeciones específicas de renewal: <link>

---

## 9. Histórico de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| <vX.Y> | <YYYY-MM-DD> | <cambios> |
```

---

## Proceso

1. **Recopilar** la información mínima. Sin modelo de suscripción y ciclo de renovación claros, parar.
2. **Definir los health signals** específicos del producto. Uso del producto es el más universal, pero cada producto tiene su métrica clave de adopción.
3. **Timeline de outreach** adaptado al ciclo del producto. SaaS anual → 90/60/45/30/15. Suscripciones mensuales → tiempos más comprimidos.
4. **Scripts por situación de salud (🟢/🟡/🔴)** — cada conversación tiene tono y objetivo distinto.
5. **Framework de pricing concessions** documentado y respetado. Sin esto, cada rep concede sin criterio.
6. **Proceso de exit limpio** — incluso el churn debe gestionarse profesionalmente.
7. **Sección de expansion playbook** activa, no opcional.
8. **Métricas vigiladas** con target. NRR > 100% es el indicador maestro de salud del negocio.
9. **Marcar `[ADAPTAR AL PRODUCTO]`** las secciones que dependen del producto concreto y `[BENCHMARK PENDIENTE]` umbrales que requieren validación con históricos.
10. **Guardar** en `<proyecto>/sales/playbooks/renewal-<scope-slug>.md`.
11. **Reportar** al usuario: ruta, segmento cubierto, métricas clave, próxima revisión.

---

## Restricciones

- **No concedas descuento sin justificación.** Cada concesión documentada en CRM con motivo.
- **No prometas features futuras** para cerrar renewal. Es trampa que reventará al lanzamiento.
- **No mezcles new business con renewal.** Son procesos distintos con scripts y métricas distintos.
- **No saltes el business review.** Es donde se construye el valor para justificar precio.
- **No olvides exit interview**. Aprender del churn es más valioso que muchas wins.
- **No publiques playbook estático.** Las tasas de retention / churn cambian; el playbook se revisa al menos anualmente.
- **No copies playbook de otra empresa.** Tu producto, tu ciclo, tu base de clientes.
- Aplican las reglas de output de `_shared/output-rules.md`.
