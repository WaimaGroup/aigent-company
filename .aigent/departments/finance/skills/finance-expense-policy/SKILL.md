---
name: "finance-expense-policy"
user-invocable: true
description: >
  Skill for producing a company expense policy: categories (travel, meals,
  software, equipment, training, client entertainment), per-category limits,
  approval thresholds and workflow, reimbursement process, non-reimbursable
  cases, documentation requirements. Cross-functional with HR (employee
  experience) and Operations (process).
---

# Skill: Expense Policy

**Entregable:** archivo `.md` con la política de gastos de la empresa, lista para incorporar al handbook y al sistema de reembolsos. Vive en `<proyecto>/finance/budgeting/expense-policy-v<X>.md` o como sección del handbook si está integrada en HR. Coordinar con `hr-policies` para incorporación al manual del empleado.

---

## Cuándo usar esta skill

- Es la primera vez que se codifica la política de gastos de la empresa.
- Hay que actualizar la política existente porque cambió el modelo (presencial → remoto, crecimiento de viajes, política de equipment).
- Se detectan ambigüedades o abusos recurrentes en gastos.
- Llega una auditoría externa y la política tiene que estar formalizada.

**Cuándo NO usar:**

- Para la política de viajes específica (puede ser sección, no documento completo).
- Para una política de equipamiento (laptop, monitor, etc.) — puede ser sección o documento aparte.
- Para reembolsos a clientes/proveedores — es otro flujo.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Modalidad de trabajo | Presencial / híbrido / remoto |
| Geografías | ¿En qué países hay empleados? (afecta a moneda, fiscalidad, regulaciones) |
| Tamaño / volumen | ¿Cuántos empleados? ¿Volumen mensual de reembolsos? |
| Categorías relevantes | ¿Cuáles aplican? (travel, meals, software, equipment, training, entertainment, otros) |
| Herramienta de reembolsos | ¿Spendesk, Pleo, Brex, Expensify, manual? |
| Filosofía | ¿Pro-empleado (generosa) / standard / conservadora? |
| Niveles de aprobación | ¿Quién aprueba qué importe? |
| Política previa | ¿Hay versión actual? ¿Qué problemas tiene? |

---

## Plantilla del entregable

Nombre del archivo: `expense-policy-v<X>.md`.

```markdown
---
type: "expense-policy"
version: "<vX.Y>"
status: "draft | approved | in-force"
effective_date: "YYYY-MM-DD"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<CFO / Finance Lead>"
jurisdictions: ["España", "...otras"]
currency_default: "EUR | USD"
tooling: "<Spendesk / Pleo / Brex / Expensify / Manual>"
philosophy: "employee-friendly | standard | conservative"
---

# Política de Gastos — <Empresa> · v<X.Y>

> **Vigente desde <fecha>.** Esta política rige cualquier gasto realizado en nombre de la empresa por empleados/as o reembolsado por la empresa. Se complementa con la política de viajes (sección 4) y la política de equipamiento (sección 7).

## 0. Propósito y principios

> 4-6 líneas. Por qué existe la política y qué la guía.

**Propósito:** establecer claridad sobre qué gastos se cubren, en qué condiciones, y cómo se procesan, para que el equipo pueda hacer su trabajo sin fricción innecesaria y sin riesgos de compliance.

**Principios:**

1. **Confianza:** asumimos buena fe en cada gasto reembolsado.
2. **Sentido común:** si dudas si un gasto encaja, probablemente conviene consultarlo antes de incurrirlo.
3. **Equidad:** mismas reglas para todos, ajustadas por geografía y rol cuando aplica.
4. **Trazabilidad:** todo gasto va con justificante y categoría correcta. Sin esto, no se reembolsa.
5. **Sostenibilidad:** preferimos opciones que no comprometan futuro (cancellation flexible en vuelos, hoteles éticos cuando posible).

---

## 1. Quién está cubierto

- **Empleados/as fijos.**
- **Contractors y freelances:** según condiciones del contrato. Por defecto, gastos NO cubiertos (incluidos en su tarifa).
- **Becarios:** según convenio; clarificar con HR.

---

## 2. Categorías de gasto

### 2.1 Comidas y bebidas

| Sub-categoría | Cubierto | Límite | Notas |
|---|---|---|---|
| Cliente externo (reunión de trabajo) | ✅ | <€/$ 80/persona> | Justificante con asistentes |
| Equipo interno (off-site, celebración) | ✅ | <€/$ 50/persona> | Aprobado por manager |
| Comida individual durante jornada normal | ❌ | — | A cuenta del empleado salvo viaje |
| Comida durante viaje de trabajo | ✅ | Per diem geográfico (sección 4) | |
| Café / snacks de oficina (no individual) | ✅ | <Sin límite individual> | Compra agregada por office manager |

### 2.2 Viajes

Ver sección 4 completa.

### 2.3 Software y herramientas

| Sub-categoría | Cubierto | Límite | Notas |
|---|---|---|---|
| SaaS necesario para el rol | ✅ | <Pre-aprobación si > €100/mes> | Coordinar con IT |
| Books / Kindle profesionales | ✅ | <€/$ 200/año> | Sin pre-aprobación |
| Subscriptions personales (Spotify, Netflix) | ❌ | — | A cargo del empleado |

### 2.4 Equipamiento

Ver sección 7.

### 2.5 Formación y desarrollo profesional

| Sub-categoría | Cubierto | Límite | Notas |
|---|---|---|---|
| Cursos / certificaciones relevantes | ✅ | <€/$ 1.500/año por empleado> | Aprobación de manager |
| Conferencias / eventos profesionales | ✅ | <€/$ 2.000/año> + viaje | Aprobación de manager |
| Coaching (career, leadership) | ✅ con caso | Caso por caso | Coordinar con HR |
| MBA / programas largos | 🟡 | Programa de apoyo aparte | Coordinar con CEO/CHRO |

### 2.6 Entretenimiento con clientes

| Sub-categoría | Cubierto | Límite | Notas |
|---|---|---|---|
| Cena/almuerzo con prospect/cliente | ✅ | <€/$ 100/persona> | Justificante con asistentes y propósito |
| Eventos deportivos / espectáculos | 🟡 | Pre-aprobación CFO | Sensibilidad por compliance y anti-corruption |
| Regalos a clientes | 🟡 | <€/$ 100/regalo> | Coordinar con compliance |

### 2.7 Otros

| Categoría | Cubierto | Notas |
|---|---|---|
| Parking durante reuniones de trabajo | ✅ | Justificante |
| Multas de tráfico / aparcamiento | ❌ | A cargo del empleado |
| Coworking (para remotos) | 🟡 | Caso por caso, máximo <€/$ X/mes> |
| Phone bill profesional | 🟡 | Política de stipend si aplica |
| Home office setup (remoto) | ✅ | Sección 7 |

---

## 3. Aprobaciones — workflow por importe

### Per-transacción

| Importe (sin IVA) | Quién aprueba | Plazo SLA |
|---|---|---|
| < €/$ 100 | Auto-aprobado si categoría OK | Inmediato |
| €/$ 100 - 500 | Manager directo | 2 días |
| €/$ 500 - 2.000 | Manager + Director de área | 5 días |
| €/$ 2.000 - 10.000 | Director + CFO | 10 días |
| > €/$ 10.000 | CEO / Board según delegation matrix | Caso por caso |

### Pre-aprobaciones recurrentes

Algunos gastos pueden tener pre-aprobación recurrente (ej. SaaS subscription mensual):
- Aprobación inicial sigue tabla anterior.
- Renovaciones automáticas no requieren re-aprobación si dentro del importe.
- Revisión anual: ¿sigue siendo necesario?

### Excepciones

- **Emergencia operativa:** ej. compra urgente para servicio crítico. Documentar después con justificación.
- **Decisión del responsable:** el manager puede exceder el límite de su categoría si firma justificación.

---

## 4. Política de viajes

### Cuándo viaje de trabajo

- Cliente externo, conferencia, off-site interno, training presencial, hire onboarding.

### Modalidad

- **Aprobación previa:** sí. Viaje sin aprobación no es reembolsable.
- **Plan de viaje:** booked vía la herramienta corporativa (si existe) o presupuesto previo a leadership.

### Transporte

| Modo | Política |
|---|---|
| Avión | Economy domestic y short-haul. Premium economy si >6h. Business solo para C-level o casos de health. |
| Tren | Preferred sobre avión cuando viable. |
| Coche propio | Reembolso por km según tabla del país. |
| Taxis / Uber | Para tramos cortos, urgentes o sin transporte público viable. |
| Transporte público | Reembolsable si es necesario para el viaje. |

### Alojamiento

| Ciudad tier | Límite por noche (sin IVA) |
|---|---|
| Tier 1 (Madrid, Barcelona, Berlin) | <€/$ 180> |
| Tier 2 (resto de capitales europeas) | <€/$ 150> |
| Tier 3 (resto) | <€/$ 120> |
| Premium (SF, NYC, London, Zurich) | <€/$ 280> |

### Per diem (comidas durante viaje)

- **España:** <€60/día>
- **Europa occidental:** <€/$ 75/día>
- **Premium cities:** <€/$ 100/día>

### Lo NO cubierto en viaje

- Alcohol no asociado a comida de trabajo.
- Entretenimiento personal (cine, spa, gym).
- Multas, daños no cubiertos por seguros.
- Acompañantes (excepto casos justificados pre-aprobados).

---

## 5. Reembolsos — cómo se procesan

### Para gastos pagados por el empleado

1. Sube el gasto a la herramienta <Spendesk / Pleo / etc.> dentro de los <30 días> siguientes al gasto.
2. Adjunta justificante: ticket / factura nominativa cuando aplica.
3. Selecciona categoría correcta.
4. Asigna proyecto / centro de coste si aplica.
5. Aprobación según workflow (sección 3).
6. Reembolso vía nómina del mes siguiente / transferencia separada según política.

### Para gastos pagados directamente por la empresa

- Tarjeta corporativa: gasto auto-cargado al CFO/contabilidad; mismo workflow de aprobación si supera umbral.
- PO/Factura directa: a través del departamento financiero.

### Plazos

- **Submisión:** ≤30 días desde el gasto. Pasado el plazo, requiere justificación adicional.
- **Aprobación:** SLA según tabla sección 3.
- **Reembolso:** en la nómina del mes siguiente a la aprobación.

---

## 6. No reembolsable — lista explícita

> Aunque la regla general sea reembolso por defecto bajo categoría OK, estos casos NO se reembolsan nunca:

- ❌ Multas de tráfico, aparcamiento (salvo emergencia médica).
- ❌ Daños a propiedad personal durante viajes (excepto cobertura por seguro).
- ❌ Compras personales no relacionadas con trabajo.
- ❌ Gastos de acompañantes en viaje (salvo pre-aprobado).
- ❌ Suscripciones personales (música, video, gimnasio).
- ❌ Alcohol fuera del contexto de comida de trabajo.
- ❌ Regalos a empleados (otras herramientas para reconocimiento).
- ❌ Gastos sin justificante o con justificante ilegible.
- ❌ Gastos > 90 días sin justificación de retraso.

---

## 7. Política de equipamiento

### Setup inicial (al incorporarse)

| Item | Cubierto | Notas |
|---|---|---|
| Laptop | ✅ — modelo según rol | Inventario corporativo, propiedad de la empresa |
| Monitor externo | ✅ | 1 unidad |
| Teclado + ratón ergonómicos | ✅ | |
| Headphones (para calls) | ✅ | <€/$ 200 max sin pre-aprobación> |
| Webcam (si laptop no la tiene buena) | ✅ | <€/$ 100 max> |
| Silla ergonómica (para remoto) | ✅ | <€/$ 400 max> |
| Escritorio (para remoto) | 🟡 | Pre-aprobación; <€/$ 500 max> |

### Renovación / sustitución

- Laptop: renovación cada <3 años> o avería irreparable.
- Otros: caso por caso.

### Devolución al salir

- Todo equipamiento corporativo se devuelve al cesar la relación laboral.
- Coordinar logística con IT + HR.

---

## 8. Stipend para remoto *(si aplica)*

- **Internet stipend:** <€/$ 50/mes> para empleados remotos.
- **Coworking stipend:** <€/$ 150/mes> opcional.
- **Home office setup:** ver sección 7.

---

## 9. Excepciones y casos especiales

### Acceso temprano a presupuesto

- **Hiring crítico** que requiere gasto extraordinario: pre-aprobación CFO.
- **Emergencias de cliente** (viaje urgente, etc.): documentar, aprobar después.

### Concesiones por rol / nivel

- C-level y board members tienen política de viaje y entertainment más permisiva. Documentar en addendum aparte.

### Compliance y anti-corruption

- Cualquier gasto vinculado a entes públicos, reguladores o funcionarios requiere pre-aprobación legal/CFO.
- Regalos > <€/$ 100> requieren registro en CRM / herramienta de compliance.

---

## 10. Auditoría y revisión

- **Auditoría interna:** trimestral, sample aleatorio de gastos para verificar cumplimiento.
- **Auditoría externa:** anual si la empresa la realiza (financial audit).
- **Revisión de política:** anual, con input de HR y employees representatives.

### Consecuencias del incumplimiento

- **No reembolso** del gasto.
- **Devolución** del importe si ya se reembolsó indebidamente.
- **Acción disciplinaria** según handbook y jurisdicción para casos de fraude/abuso recurrente.

---

## 11. Contacto y dudas

- **Email finance:** <finance@empresa.com> · cuestiones sobre la política, casos límite.
- **Helpdesk de la herramienta:** <link>
- **Documentación adicional:** policy de viajes, FAQ, ejemplos.

---

## 12. Historial de versiones

| Versión | Fecha | Cambios principales |
|---|---|---|
| <vX.Y> | <YYYY-MM-DD> | <cambios> |
| <vX.Y-1> | <YYYY-MM-DD> | <cambios> |

---

## 13. Anexos

- **Tabla de per diem por país completo:** <link>
- **Lista de SaaS aprobados sin pre-aprobación:** <link>
- **Política de equipamiento detallada:** <sección 7 expandida si necesario>
- **FAQ:** <link>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin geografías, modalidad y filosofía, parar.
2. **Definir filosofía explícita.** Employee-friendly vs conservative cambia toda la política.
3. **Categorías concretas y completas.** No omitir categorías "incómodas" (alcohol, regalos a clientes, multas). La transparencia evita disputas.
4. **Límites por categoría con cifras reales.** "Razonable" no es cifra.
5. **Workflow de aprobación por importe** con SLA. Sin SLA, los reembolsos son fuente de fricción crónica.
6. **Lista NO reembolsable explícita.** Las ambigüedades se resuelven en favor del empleado si la política no es clara, lo cual está bien — pero la política previene la ambigüedad.
7. **Adaptar a geografías.** Per diem en España ≠ per diem en SF. Tiers explícitos.
8. **Política de equipamiento como sección o documento separado** según volumen del tema.
9. **Coordinar con HR (handbook) y Operations (proceso)** explícitamente.
10. **Marcar `[VERIFICAR JURISDICCIÓN]`** lo que depende de fiscalidad local, `[DECISIÓN LIDERAZGO]` umbrales que requieren ratificación.
11. **Guardar** en `<proyecto>/finance/budgeting/expense-policy-v<X>.md`.
12. **Reportar** al usuario: ruta, categorías cubiertas, próxima revisión, items pendientes de aprobación.

---

## Restricciones

- **No omitas categorías incómodas** (alcohol, multas, regalos, acompañantes). La política gana en claridad cuando es completa.
- **No uses "razonable" sin cifras.** Cada límite con número.
- **No copies política de otra empresa sin adaptar.** Cada empresa tiene su modalidad, su tamaño, su cultura.
- **No omitas el plazo de submisión.** Sin plazo, los reembolsos se acumulan caóticamente.
- **No olvides la consecuencia del incumplimiento.** Política sin enforcement es decorativa.
- **No publiques sin coordinar** con HR (handbook) y, si aplica, con Legal (compliance, anti-corruption).
- **No prometas reembolsos rápidos sin SLA realista** que finance pueda cumplir.
- Aplican las reglas de output de `_shared/output-rules.md`.
