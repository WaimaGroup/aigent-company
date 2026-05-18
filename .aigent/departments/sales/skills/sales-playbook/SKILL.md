---
name: "sales-playbook"
user-invocable: true
description: >
  Skill for building a complete sales playbook that documents the end-to-end commercial
  process. Always creates a .md file covering: ICP definition, pipeline stages and
  criteria, scripts per stage, qualification framework, objection handling summary,
  tools stack, and KPIs.
---

# Skill: Sales Playbook

**Entregable:** archivo `.md` con el playbook completo del proceso de ventas, listo para usar como referencia del equipo y para onboarding de nuevos reps

---

## Cuándo usar esta skill

Cuando el usuario quiera documentar o estandarizar el proceso comercial del equipo: ya sea porque hay nuevos reps que incorporar, porque el proceso ha evolucionado y no estaba escrito, o porque se quiere mejorar la consistencia y los resultados del equipo.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Producto / servicio | ¿Qué vendemos? (descripción breve) |
| ICP | ¿A qué tipo de empresa/persona vendemos? |
| Ciclo de venta | ¿Cuánto dura aproximadamente el proceso desde el primer contacto hasta el cierre? |
| Etapas del pipeline | ¿Cuántas etapas tiene el funnel comercial y cómo se llaman? |
| Equipo | ¿Hay SDRs y AEs separados, o el mismo rep hace todo el proceso? |
| CRM usado | ¿Qué CRM utiliza el equipo? |
| Métricas clave | ¿Qué métricas sigue el equipo? (cuota, win rate, ciclo...) |

---

## Plantilla de entregable

```markdown
---
type: "sales-playbook"
product: ""
team_size: ""
date_created: "YYYY-MM-DD"
version: "1.0"
status: "draft"
---

# Sales Playbook — [Nombre de la Empresa / Producto]

**Versión:** 1.0 | **Fecha:** YYYY-MM-DD | **Próxima revisión:** YYYY-MM-DD

---

## Para qué sirve este playbook

Este documento describe el proceso comercial estándar del equipo de [Empresa]. Está pensado para:
- **Nuevos reps:** entender cómo vendemos, a quién y con qué herramientas
- **Reps activos:** tener una referencia rápida para las situaciones más habituales
- **Dirección comercial:** base para mejorar el proceso y medir resultados

No es un manual rígido — es la forma en que lo hacemos bien la mayoría de las veces. El juicio del rep manda en situaciones no contempladas aquí.

---

## 1. A quién vendemos — ICP

### Perfil de Empresa Ideal

| Criterio | Descripción |
|---|---|
| Industria / Sector | [COMPLETAR] |
| Tamaño (empleados) | [COMPLETAR] |
| Facturación anual | [COMPLETAR] |
| Geografía | [COMPLETAR] |
| Etapa de madurez | [Startup / Scale-up / Enterprise] |
| Señales de fit | [COMPLETAR: tecnologías usadas, comportamientos, señales externas] |

### Perfil del Comprador Ideal (Buyer Persona)

| Criterio | Economic Buyer | Champion | Influencer |
|---|---|---|---|
| Cargo típico | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] |
| Responsabilidades | | | |
| Pain points principales | | | |
| Métricas que le importan | | | |
| Cómo hablar con él/ella | | | |

### Señales de descalificación (salir rápido)

- [Criterio que indica que no es un buen fit]
- [Criterio 2]
- [Criterio 3]

---

## 2. El proceso de ventas

### Visión general del pipeline

```
[Etapa 1] → [Etapa 2] → [Etapa 3] → [Etapa 4] → [Etapa 5] → Cerrado
```

### Etapas en detalle

---

#### Etapa 1: [Nombre] — [% de probabilidad]

**Definición:** [Cuándo entra un deal en esta etapa — criterio de entrada]

**Objetivo:** [Qué queremos conseguir en esta etapa]

**Acciones del rep:**
- [ ] [Acción 1]
- [ ] [Acción 2]
- [ ] [Acción 3]

**Criterio de avance a la siguiente etapa:**
- [Condición 1 que debe cumplirse]
- [Condición 2]

**Duración típica:** [X días]

**Template / script de referencia:**
> [Mensaje o script estándar para esta etapa, si aplica]

---

#### Etapa 2: [Nombre] — [% de probabilidad]

*(mismo formato)*

---

#### Etapa N: Cerrado Ganado / Cerrado Perdido

**Cerrado Ganado:**
- Acción: registrar en CRM, notificar a [equipo de onboarding/customer success], enviar [documento de bienvenida]

**Cerrado Perdido:**
- Registrar razón de pérdida en CRM (obligatorio)
- Si fue close loss reciente: intentar feedback call con el cliente en los 7 días siguientes

---

## 3. Framework de cualificación

Usamos **[BANT / MEDDIC / SPICED]** como framework de cualificación:

### [BANT como ejemplo]

| Criterio | Pregunta para validar | Señal positiva | Señal negativa |
|---|---|---|---|
| **Budget** | "¿Tienen presupuesto asignado para esto?" | "Sí, tenemos X€ para esto" | "No sé / no es prioritario ahora" |
| **Authority** | "¿Quién toma la decisión final?" | Nombra a una persona | "Lo decide el comité / no lo sé" |
| **Need** | "¿Cuál es el problema que queréis resolver?" | Describe un dolor concreto | Descripción vaga o genérica |
| **Timeline** | "¿Cuándo queréis tenerlo funcionando?" | Fecha concreta o driver de urgencia | "Sin prisa / cuando podamos" |

**Regla de cualificación:** si no podemos responder a B, A y N con información directa del cliente, el deal no entra en pipeline activo.

---

## 4. Scripts por etapa

### Primer contacto (cold outreach)

**Por email:**
> Ver skill `outreach-sequence` para la cadencia completa.

**En LinkedIn (mensaje de solicitud de conexión):**
> "Hola [nombre], trabajo con [tipo de empresas] en [resultado que conseguimos]. Vi que [señal de personalización]. ¿Tiene sentido conectar?"

**En llamada en frío (apertura de 30 segundos):**
> "Hola [nombre], soy [tu nombre] de [empresa]. Te llamo porque trabajamos con [tipo de empresas como la suya] y [resultado concreto]. Solo quiero saber si tiene sentido una conversación de 15 minutos. ¿Tienes un momento ahora o te busco mañana?"

---

### Discovery call (preguntas clave)

Objetivo: entender el problema, el impacto y el proceso de decisión

**Preguntas de situación:**
- "¿Cómo estáis resolviendo [problema] ahora mismo?"
- "¿Cuántas personas están implicadas en este proceso?"

**Preguntas de problema:**
- "¿Qué es lo que más os frustra de la solución actual?"
- "¿Cuánto tiempo / dinero os está costando este problema cada mes, aproximadamente?"

**Preguntas de implicación:**
- "Si esto sigue igual en 12 meses, ¿qué impacto tiene en [objetivo de negocio del cliente]?"

**Preguntas de necesidad:**
- "Si pudiérais resolver [problema] de forma ideal, ¿cómo sería?"

**Preguntas de proceso de decisión:**
- "¿Cómo se toman estas decisiones en vuestra empresa?"
- "¿Hay alguien más que debería estar en esta conversación?"

---

### Presentación / Demo

Ver skill `pitch-deck` para la estructura completa de la presentación.

---

### Manejo de objeciones

Ver skill `objection-handler` para la guía completa.

**Top 3 objeciones más frecuentes:**
1. [Objeción 1] → [Respuesta en 1 línea]
2. [Objeción 2] → [Respuesta en 1 línea]
3. [Objeción 3] → [Respuesta en 1 línea]

---

### Cierre

**Señales de compra:**
- Pregunta por precios o condiciones contractuales
- Involucra a más personas internas
- Pide referencias de clientes
- Pregunta por implementación y tiempos

**Técnicas de cierre:**
- **Cierre de alternativa:** "¿Preferís empezar en [fecha A] o en [fecha B]?"
- **Cierre de resumen:** "Hemos hablado de [problema], [solución] y [ROI]. ¿Hay algo que os impida avanzar?"
- **Cierre condicional:** "Si consigo aprobación interna para [condición que piden], ¿podemos firmar esta semana?"

---

## 5. Herramientas del equipo

| Herramienta | Para qué | Acceso |
|---|---|---|
| [CRM] | Gestión de pipeline y contactos | [COMPLETAR] |
| [Email] | Comunicación y secuencias | [COMPLETAR] |
| [LinkedIn / Sales Nav] | Prospección | [COMPLETAR] |
| [Videoconferencia] | Demos y reuniones | [COMPLETAR] |
| [Firma digital] | Contratos | [COMPLETAR] |

---

## 6. Métricas del equipo

| Métrica | Definición | Objetivo | Frecuencia de revisión |
|---|---|---|---|
| Cuota mensual | Facturación cerrada / objetivo | [COMPLETAR] | Mensual |
| Win rate | Deals ganados / total deals cerrados | [COMPLETAR] | Mensual |
| Pipeline coverage | Pipeline total / cuota | Mínimo 3x | Semanal |
| Average deal size | Facturación media por deal | [COMPLETAR] | Trimestral |
| Sales cycle | Días desde creación hasta cierre | [COMPLETAR] | Mensual |
| Activities / rep | Llamadas + emails + reuniones por semana | [COMPLETAR] | Semanal |

---

## 7. Proceso de onboarding de nuevos reps

### Semana 1 — Conocer el producto y el cliente
- [ ] Leer este playbook completo
- [ ] Demo del producto con alguien del equipo (como si fuera un cliente)
- [ ] Leer 5 propuestas cerradas ganadas y 5 cerradas perdidas
- [ ] Escuchar 3 grabaciones de discovery calls
- [ ] Entender la guía de objeciones (`objection-handler`)

### Semana 2 — Aprender el proceso
- [ ] Hacer shadow en 2 discovery calls reales
- [ ] Hacer shadow en 1 demo
- [ ] Configurar el CRM y las herramientas
- [ ] Crear su primera lista de prospectos (skill `prospecting-list`)

### Semana 3 — Primeros contactos supervisados
- [ ] Enviar primeros outreach con revisión del manager
- [ ] Primera discovery call propia (con manager en escucha)
- [ ] Revisar el playbook y anotar preguntas

### A partir de la semana 4
- [ ] Pipeline activo mínimo de [X] deals
- [ ] Reunión semanal 1:1 con manager para review de deals
```

---

## Proceso

1. **Recopilar información base**: proceso actual del equipo, ICP, etapas del CRM, métricas
2. **Documentar el proceso real** (cómo venden los mejores reps hoy), no el proceso ideal
3. **Escribir los scripts** basándose en conversaciones reales, no en teoría de ventas
4. **Marcar con `[COMPLETAR]`** todo lo que necesita información interna real
5. **Incluir referencias a otras skills**: el playbook orquesta — no duplica lo que ya está en `outreach-sequence`, `pitch-deck` u `objection-handler`
6. **Guardar el archivo** en `<proyecto>/sales/enablement/sales-playbook-v<version>-<fecha>.md`
7. **Recordar al usuario** añadir la fecha de próxima revisión y quién es el dueño del documento

---

## Restricciones

- No documentar el proceso ideal en abstracto: el playbook refleja cómo venden los mejores reps hoy, no la teoría aspiracional.
- No duplicar contenido de otras skills (`outreach-sequence`, `pitch-deck`, `objection-handler`): el playbook orquesta y referencia, no transcribe.
- Marcar con `[COMPLETAR]` todos los campos que requieren información interna (precios, métricas, herramientas concretas) antes de publicar el playbook.
- Indicar siempre fecha de próxima revisión: un playbook sin owner ni revisión queda obsoleto en 6-12 meses.
- Aplican las reglas de output de `_shared/output-rules.md`.
