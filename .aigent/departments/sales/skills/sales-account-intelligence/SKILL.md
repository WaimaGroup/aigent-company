---
name: "sales-account-intelligence"
user-invocable: true
description: >
  Skill for producing a complete Sales Intelligence report on a target account.
  Always creates a .md file covering: company profile, technology landscape, evidenced
  pain points mapped to our services, competitive credibility, key stakeholders,
  phased sales sequence, account-specific objection handling, and deal sizing estimates.
  Output mirrors the depth of a pre-engagement research brief prepared by a senior AE.
---

# Skill: Informe de Sales Intelligence

**Entregable:** archivo `.md` con el análisis completo de la cuenta objetivo, listo para usar como brief de la campaña de ventas hacia esa empresa

---

## Cuándo usar esta skill

Cuando el equipo va a iniciar un proceso de venta estratégico en una cuenta concreta y necesita:
- Entender en profundidad quién es el cliente, su stack tecnológico y su contexto actual
- Identificar los pain points con evidencia (no suposiciones)
- Mapear qué servicios propios resuelven qué problemas específicos
- Preparar el primer contacto con contexto real, no mensajes genéricos
- Diseñar la secuencia de fases de la venta antes de empezar

Este informe es el documento base que usa tanto el SDR (para preparar el outreach) como el AE (para preparar las reuniones y la propuesta).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Empresa objetivo | ¿Cuál es el nombre de la empresa? |
| Contacto principal | ¿Hay ya un contacto identificado? (nombre, cargo) |
| Servicios propios | ¿Cuáles son los servicios/productos que Waima / nuestra empresa ofrece? |
| Información disponible | ¿Tienes ya notas, conversaciones anteriores o fuentes sobre la cuenta? |
| Profundidad del análisis | ¿Es un primer acercamiento (análisis ligero) o una cuenta estratégica (análisis completo)? |

Si hay un archivo de contexto previo, leerlo antes de empezar a generar el informe.

---

## Plantilla de entregable

```markdown
---
type: "account-intelligence"
account: ""
primary_contact: ""
prepared_by: ""
date: "YYYY-MM-DD"
purpose: ""
status: "draft"
---

# [EMPRESA] — Sales Intelligence for [Nuestra Empresa]

**Prepared:** [Fecha]
**Purpose:** [Objetivo del análisis en 1 línea]
**Primary Contact:** [Nombre, Cargo, Empresa]

---

## 1. Quién es [Empresa]

[Párrafo de 3-5 líneas describiendo la empresa: qué hace, posición en el mercado, cómo ha evolucionado recientemente, qué hace relevante hablar con ellos ahora.]

| Campo | Dato |
|---|---|
| **Nombre completo** | |
| **HQ** | |
| **Cotización / ownership** | |
| **Facturación** | |
| **Empleados** | |
| **Proyectos activos** | |
| **Web** | |

---

## 2. Contexto tecnológico actual

Entender dónde están tecnológicamente es esencial para posicionar nuestros servicios con precisión.

### Stack activo

| Capa | Tecnología |
|---|---|
| **Cloud** | |
| **Datos / Analytics** | |
| **ERP / Core** | |
| **IA/ML** | |
| **Frontend / Producto** | |
| **[Otras capas relevantes]** | |

### Eventos de transformación recientes (últimos 12-24 meses)

1. **[Evento 1]** — [descripción y por qué es relevante para nuestra venta]
2. **[Evento 2]** — [ídem]
3. **[Evento 3]** — [ídem]

> Fuente de cada dato: [URL o referencia]. Si no hay fuente verificable, marcar con `[POR VERIFICAR]`.

---

## 3. Pain points detectados

Estos son los puntos de tensión que crean una apertura real. Cada uno está respaldado por evidencia pública o conversaciones directas — no suposiciones.

### 🔴 Pain Point 1 — [Título del problema]

**Evidencia:** [Cita directa o referencia pública que muestra que el problema existe. Si viene de una conversación con el contacto, indicarlo.]

**Por qué importa ahora:** [El contexto que hace urgente resolver esto: evento reciente, crecimiento, cambio regulatorio...]

**→ Nuestra oportunidad:** [Nombre del servicio] — [en 1 línea, por qué nuestro servicio encaja]

---

### 🔴 Pain Point 2 — [Título]

*(mismo formato)*

---

### 🟡 Pain Point 3 — [Título] *(prioridad secundaria)*

*(mismo formato)*

---

> **Nota de uso:** 🔴 = problema activo con evidencia directa, apertura clara. 🟡 = problema probable, apertura existe pero menos urgente. Empezar siempre por los rojos.

---

## 4. Mapeo de servicios — qué vendemos y por qué encaja

Esta es la correspondencia central entre lo que necesitan y lo que ofrecemos.

### 🏆 Prioridad 1 — [Nombre del servicio] *(mayor fit)*

**Qué es:** [Descripción de 2 líneas del servicio]

**Por qué lo necesitan ahora:**
- [Razón 1 — específica de esta cuenta]
- [Razón 2]
- [Razón 3]

**Cómo hacer el pitch:**
> *"[Frase de pitch específica para este cliente, conectando su contexto con nuestra solución. No genérica. Usar datos del análisis.]*"

**Proof point a mencionar:** [Caso de cliente similar o resultado relevante que tenemos]

---

### 🏆 Prioridad 2 — [Nombre del servicio]

*(mismo formato)*

---

### 🥈 Prioridad 3 — [Nombre del servicio]

*(mismo formato)*

---

### 🥉 Prioridad 4 — [Nombre del servicio]

*(mismo formato)*

---

## 5. Por qué nosotros — credibilidad competitiva

Cuando el cliente pregunte "¿por qué vuestra empresa y no otros?", usar estos diferenciadores específicos para este caso:

| Factor | Detalle |
|---|---|
| **[Diferenciador 1]** | [Por qué importa para este cliente concreto] |
| **[Diferenciador 2]** | |
| **[Diferenciador 3]** | |
| **[Diferenciador 4]** | |

---

## 6. Personas clave — a quién involucrar

| Nombre | Cargo | Relevancia para la venta |
|---|---|---|
| [Nombre 1] | [Cargo] | **Champion principal** — [por qué es el interlocutor clave] |
| [Nombre 2] | [Cargo] | **Economic buyer** — [quién aprueba el gasto] |
| [Nombre 3] | [Cargo] | **Validador técnico** — [quién puede bloquear o acelerar] |
| [Nombre 4] | [Cargo] | **Influencer** — [por qué puede importar] |

> Campos desconocidos → marcar con `[IDENTIFICAR]` y cómo encontrarlo (LinkedIn, web de la empresa, preguntarle al champion).

---

## 7. Secuencia de venta recomendada

### Fase 1 — [Nombre de la fase] (Semanas 1–N)

**Objetivo:** [Qué queremos conseguir en esta fase]

**Mensaje de entrada:**
> *"[Mensaje de primer contacto específico para este cliente, basado en los pain points identificados. Usar contexto real del análisis.]*"

**Meta:** [Hito concreto que marca el fin de la fase: demo, identificar budget owner, propuesta, etc.]

---

### Fase 2 — [Nombre] (Semanas N–N)

**Transición:**
> *"[Cómo pivotamos desde la fase 1 a este nuevo tema, con el contexto ya establecido.]*"

**Meta:** [Hito concreto]

---

### Fase 3 — [Nombre] (Meses N–N)

*(mismo formato)*

---

## 8. Manejo de objeciones específicas de esta cuenta

> Estas objeciones son específicas del contexto de [Empresa]. Para la guía general, ver `objection-handler`.

**"[Objeción probable 1]"**
[Respuesta específica para esta cuenta, con argumentos basados en el análisis]

---

**"[Objeción probable 2]"**
[Respuesta específica]

---

**"[Objeción probable 3]"**
[Respuesta específica]

---

## 9. Estimación del deal

| Servicio | Alcance inicial | Valor estimado |
|---|---|---|
| [Servicio 1] | [Descripción del alcance] | [€X–€Y / año o proyecto] |
| [Servicio 2] | | |
| [Servicio 3] | | |
| [Servicio 4] | | |

**Valor potencial Año 1:** €[rango bajo]–€[rango alto]
**Valor potencial Año 2+ (expansión):** €[rango bajo]–€[rango alto]/año

> Estas cifras son estimaciones basadas en [comparables / tarifas conocidas / tamaño de la cuenta]. Confirmar con el equipo comercial antes de usarlas en una propuesta.

---

## 10. Fuentes

- [Nombre de la fuente](URL) — [para qué se usó]
- [Nombre de la fuente](URL) — [para qué se usó]
- [Conversación con [Nombre] — [fecha]] *(si aplica)*
```

---

## Proceso

### 1. Investigar antes de escribir

Antes de rellenar la plantilla, recopilar:

- **Web de la empresa:** productos, clientes, tecnología mencionada
- **LinkedIn:** equipo de liderazgo técnico y comercial, crecimiento reciente de headcount
- **Noticias y press releases:** adquisiciones, expansiones, nuevas contrataciones, proyectos anunciados
- **Casos de éxito publicados por sus proveedores:** SAP, AWS, Azure, Salesforce… suelen revelar el stack real
- **Conversaciones directas disponibles:** notas de llamadas, emails anteriores

Marcar siempre la fuente de cada dato. Si no hay fuente, marcarlo con `[POR VERIFICAR]`.

### 2. Identificar pain points con evidencia

La diferencia entre un buen informe y uno genérico está en los pain points. El estándar es:
- Pain point respaldado por una **cita o publicación pública** de la empresa, o
- Pain point confirmado en una **conversación directa** con alguien de la cuenta

Si solo hay suposición, marcarlo como `[HIPÓTESIS — sin confirmar]` para que el rep lo valide en la primera llamada.

### 3. Escribir el pitch de cada servicio para este cliente

Los mensajes de pitch de la sección 4 deben ser específicos de esta cuenta — no copias del pitch genérico del producto. Usar los datos del análisis para construir el argumento.

### 4. Secuencia de venta = hipótesis de trabajo

La secuencia recomendada es un plan, no un guión rígido. El rep debe ajustarla según lo que descubra en las primeras conversaciones.

### 5. Guardar y referenciar

Guardar en `<proyecto>/sales/prospects/<nombre-cuenta>/<nombre-cuenta>-intelligence-<fecha>.md`

Cuando el AE use este informe para preparar una propuesta o una reunión, debe leer este archivo como contexto antes de ejecutar las skills `sales-proposal` o `pitch-deck`.

---

## Criterios de calidad del informe

- Todos los pain points tienen evidencia citada (o están marcados como hipótesis)
- Los mensajes de pitch son específicos de la cuenta, no genéricos
- La sección de stakeholders identifica al economic buyer (o marca `[IDENTIFICAR]`)
- La secuencia de fases tiene CTAs concretos por fase
- Las objeciones de la sección 8 son diferentes de la guía genérica — son específicas del contexto de esta empresa
- Las estimaciones de deal tienen una base (comparable, tarifa conocida) o están marcadas como `[ESTIMACIÓN ORIENTATIVA]`

---

## Restricciones

- No inventar pain points, citas, eventos de transformación ni stakeholders: si no hay fuente verificable, marcar con `[POR VERIFICAR]` o `[HIPÓTESIS — sin confirmar]`.
- No usar este informe como propuesta comercial: es un documento interno del equipo de ventas. Para una propuesta formal, usar `sales-proposal`.
- No publicar valoraciones de deal sin que el equipo comercial las haya validado.
- No construir mensajes de pitch genéricos del producto: lo que diferencia este informe es la personalización por cuenta.
- Aplican las reglas de output de `_shared/output-rules.md`.
