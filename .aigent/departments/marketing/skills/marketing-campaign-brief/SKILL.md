---
name: "marketing-campaign-brief"
user-invocable: true
description: >
  Skill for creating a complete marketing campaign brief from an objective or idea.
---

# Skill: Briefing de Campaña

**Entregable:** documento de briefing completo, listo para distribuir al equipo

---

## Cuándo usar esta skill

Cuando el usuario necesite planificar y documentar una campaña de marketing: lanzamiento de producto, campaña estacional, campaña de generación de leads, campaña de branding o cualquier iniciativa de marketing con un objetivo y plazo definidos.

---

## Información a recopilar

| Campo | Pregunta |
|---|---|
| Nombre de la campaña | ¿Cómo se llamará internamente? |
| Objetivo de negocio | ¿Qué resultado de negocio persigue? |
| KPI principal | ¿Cómo medimos el éxito? ¿Cuál es el objetivo numérico? |
| Presupuesto | ¿Cuánto hay disponible? ¿Hay desglose previsto? |
| Fechas | ¿Cuándo empieza y termina? ¿Hay fechas clave en el medio? |
| Audiencia | ¿A quién va dirigida? ¿Segmento nuevo o base existente? |
| Oferta / gancho | ¿Qué ofrecemos o comunicamos en la campaña? |
| Canales previstos | ¿Qué canales vamos a usar? |
| Equipo / responsables | ¿Quién hace qué? |

---

## Plantilla de briefing

```markdown
# BRIEFING DE CAMPAÑA: [NOMBRE DE LA CAMPAÑA]

**Fecha de creación:** YYYY-MM-DD
**Responsable:** [nombre]
**Estado:** Borrador / Aprobado

---

## 1. Contexto y objetivo

**Objetivo de negocio:**
[Qué resultado de negocio mueve esta campaña]

**Objetivo de marketing (SMART):**
[Específico, medible, con plazo]

**KPI principal:**
[Métrica] → objetivo: [valor] en [plazo]

**KPIs secundarios:**
- [métrica 2]: [objetivo]
- [métrica 3]: [objetivo]

---

## 2. Audiencia objetivo

**Segmento principal:**
[Descripción: perfil, necesidades, momento del funnel]

**Segmento secundario (si aplica):**
[ídem]

**Lo que sabe de nosotros:**
[Frío / conoce la marca / ya es cliente]

---

## 3. Mensaje clave

**Propuesta de valor de la campaña:**
[En una frase: qué ofrecemos y por qué ahora]

**Mensajes de soporte:**
- [mensaje 2]
- [mensaje 3]

**Tono y voz:**
[Cómo queremos sonar: cercano, urgente, aspiracional...]

---

## 4. Canales y formatos

| Canal | Formato | Presupuesto | Responsable |
|---|---|---|---|
| [canal 1] | [formato] | [€] | [nombre] |
| [canal 2] | [formato] | [€] | [nombre] |

---

## 5. Activos necesarios

| Asset | Especificaciones | Responsable | Fecha límite |
|---|---|---|---|
| [asset 1] | [specs] | [nombre] | [fecha] |

---

## 6. Cronograma

| Fase | Descripción | Inicio | Fin |
|---|---|---|---|
| Preparación | Creatividades, copies, configuración | | |
| Lanzamiento | Activación de canales | | |
| Optimización | Seguimiento y ajustes | | |
| Cierre | Informe de resultados | | |

---

## 7. Presupuesto

| Partida | Importe |
|---|---|
| Paid media | [€] |
| Producción creativa | [€] |
| Herramientas / licencias | [€] |
| **TOTAL** | **[€]** |

---

## 8. Aprobaciones necesarias

| Decisión | Responsable | Fecha límite |
|---|---|---|
| Aprobación del brief | [nombre] | [fecha] |
| Aprobación de creatividades | [nombre] | [fecha] |
| Aprobación de inversión | [nombre] | [fecha] |

---

## 9. Riesgos

| Riesgo | Probabilidad | Impacto | Plan de contingencia |
|---|---|---|---|
| [riesgo 1] | Alta/Media/Baja | Alto/Medio/Bajo | [acción] |
```

---

## Proceso

1. Recopilar la información mínima (objetivo, audiencia, fechas, presupuesto)
2. Rellenar la plantilla sección a sección
3. Destacar con ⚠️ los campos que quedan por definir
4. Proponer KPIs si el usuario no los tiene claros
5. Entregar el briefing en Markdown listo para compartir o convertir a documento

---

## Restricciones

- No comprometer presupuesto ni recursos sin la autorización del responsable indicada en la sección de aprobaciones.
- No inventar KPIs ni baseline numéricos: si no hay datos históricos, marcar las celdas con `[BASELINE PENDIENTE]` y proponer cómo obtenerlos.
- No omitir la sección de riesgos aunque la campaña parezca de bajo impacto: el plan de contingencia siempre es valioso.
- Marcar con `⚠️` los campos críticos que queden vacíos y comunicárselos al usuario al cerrar.
- Aplican las reglas de output de `_shared/output-rules.md`.
