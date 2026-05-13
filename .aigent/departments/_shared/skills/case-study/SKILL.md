---
name: "case-study"
description: >
  Shared skill for producing a structured customer case study: context, problem,
  solution, implementation, measurable results, and quotes. Used cross-department
  (marketing-content for content marketing, sales-enablement for sales material)
  with the same deliverable structure. Numbers-first, claim-backed.
---

# Skill: Case Study

**Entregable:** archivo `.md` con el caso de éxito completo, listo para conversión a formato externo (PDF, web, slide). Vive en la carpeta del dept que lo solicite — la skill es compartida en `_shared/skills/`, los outputs no.

---

## Cuándo usar esta skill

- Un cliente ha obtenido resultados medibles y consiente compartir su historia.
- Se prepara material para marketing (página web, blog, gated asset) o para sales (referencia en propuesta, pitch).
- Se necesita una historia con estructura repetible para varios canales.

**Cuándo NO usar:**

- Para testimonios cortos (eso es una cita, no un case study).
- Para reseñas en G2/Capterra (formato propio de la plataforma).
- Para casos sin métricas verificables ni consentimiento del cliente — son anécdotas, no estudios.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Cliente | Razón social, sector, tamaño (empleados/revenue), geografía |
| Persona protagonista | Quién cuenta la historia (rol, nombre si autorizado) |
| Consentimiento del cliente | ¿Está autorizado a publicarse? ¿Hay nivel de anonimización requerido? |
| Problema inicial | ¿Cuál era el dolor antes de nosotros? (Con números si los hay) |
| Por qué nos eligieron | ¿Qué decidió la compra/contratación? |
| Solución implementada | Qué se construyó/configuró exactamente |
| Tiempo de implementación | Cuánto tardaron en estar operativos |
| Resultados medibles | Números antes vs después + horizonte temporal |
| Citas | Frases textuales del cliente (verbatim, no parafraseadas) |
| Canal de uso | Marketing (web/blog/PDF), Sales (referencia), ambos |
| Idioma | Español, inglés, ambos |

---

## Plantilla del entregable

Nombre del archivo: `case-study-<cliente-slug>-<YYYY-MM>.md`.

```markdown
---
type: "case-study"
client: "<Razón social>"
client_industry: "<sector>"
client_size: "<empleados o revenue>"
client_geo: "<país/región>"
protagonist: "<rol — nombre si autorizado>"
consent_status: "approved | pending | anonymized"
publication_channels: ["web", "blog", "pdf", "sales-pitch"]
date_created: "YYYY-MM-DD"
last_validated: "YYYY-MM-DD"
language: "es | en | bilingual"
status: "draft | client-review | approved | published"
owner: "<rol/persona>"
---

# Cómo <Cliente> consiguió <resultado principal> con <Producto>

> **Titular alternativo (más sales-oriented):** <Cliente> reduce/aumenta <métrica> un <X%> en <tiempo> tras adoptar <Producto>.

## TL;DR — 30 segundos

> 3-4 líneas. Cliente, problema en una línea, solución en una línea, resultado en números, plazo.

**Resultados destacados:**
- <Métrica 1>: <antes> → <después> (Δ <%>) en <plazo>
- <Métrica 2>: <antes> → <después>
- <Métrica 3>: <antes> → <después>

---

## Sobre <Cliente>

> 2-3 líneas: a qué se dedican, tamaño, mercado. No marketing genérico — datos.

- **Sector:** <sector>
- **Tamaño:** <empleados / revenue / clientes>
- **Geografía:** <país/región>
- **Web:** <URL>

---

## 1. El problema

> El estado inicial. Específico, con métricas si las hay.

<2-3 párrafos. Qué les dolía, cómo se manifestaba en el día a día, qué intentaron antes que no funcionó.>

**Estado inicial medido:**
- <Métrica 1 inicial>
- <Métrica 2 inicial>
- <Coste estimado del problema>: tiempo, dinero, oportunidades perdidas

**Lo que habían intentado antes:** <opciones evaluadas o probadas que no resolvieron>

---

## 2. Por qué nos eligieron

> Decisión de compra. Honesto. Si fue por precio, decirlo; si fue por feature concreta, decirlo.

<2 párrafos. Cómo nos conocieron, qué evaluaron, qué los convenció.>

> *"<Cita textual del cliente sobre la decisión. Verbatim.>"*
> — <Nombre / rol> en <Cliente>

---

## 3. La solución implementada

> Qué se construyó/configuró. Específico. Si fue plug-and-play, decirlo; si requirió integración custom, también.

<2-3 párrafos describiendo el setup, no la oferta genérica de producto. Esta sección distingue un case study de un brochure.>

**Componentes clave del setup:**
- <Componente / feature usado>
- <Integración con <herramienta del cliente>>
- <Configuración custom si aplica>

**Tiempo de implementación:** <X semanas/meses desde firma hasta producción>

**Equipo involucrado:** <X personas del cliente, Y del nuestro>

---

## 4. Resultados

> Lo más importante del case study. Números. Horizonte temporal. Comparación honesta antes/después.

### Métricas duras (cuantitativas)

| Métrica | Antes | Después | Δ | Horizonte |
|---|---|---|---|---|
| <Métrica 1> | <X> | <Y> | <+Z%> | <Q tras lanzamiento> |
| <Métrica 2> | <X> | <Y> | <+Z%> | <...> |
| <Métrica 3> | <X> | <Y> | <-Z%> *(si la métrica baja es buena, ej. churn)* | <...> |

### Resultados blandos (cualitativos)

- <Mejora operativa: ej. "el equipo de soporte gestiona X casos sin sobrecarga">
- <Cambio cultural: ej. "los managers ahora ven datos sin esperar al lunes">
- <Reducción de fricción: ej. "los nuevos hires se incorporan en 2 días en lugar de 2 semanas">

### ROI estimado *(si aplica)*

- **Coste inicial + recurrente:** <€/$ amount>
- **Ahorro / generación anual estimada:** <€/$ amount>
- **Payback period:** <X meses>

---

## 5. La voz del cliente (más citas)

> 2-3 citas adicionales, una sobre el problema, una sobre el proceso, una sobre el resultado. Verbatim.

> *"<Cita 1>"*
> — <Nombre / rol>

> *"<Cita 2>"*
> — <Nombre / rol>

> *"<Cita 3>"*
> — <Nombre / rol>

---

## 6. Próximos pasos del cliente

> Qué van a hacer ahora con nosotros. Útil para reflejar que la relación crece (expansión, casos de uso adicionales).

<1-2 líneas: hacia dónde evoluciona la relación.>

---

## 7. Adaptación a canales

> Notas operativas: cómo se usa este case study en cada canal.

- **Página web:** <link previsto, formato hero + bloques>
- **Blog post:** <título sugerido, fecha de publicación, owner>
- **PDF gated:** <CTA del download, formulario>
- **Sales pitch:** <slide del pitch deck donde aparece, una línea de tip para el AE>

---

## 8. Metadata para SEO / sales tagging

- **Keyword principal:** <para SEO>
- **Industria(s) relevantes:** <tags para targeting>
- **Persona buyer:** <a quién atrae este case>
- **Producto/categoría:** <para filtrar en la web>
- **Tamaño cliente:** <para targeting de ICP>

---

## 9. Aprobaciones y consentimiento

- **Consentimiento del cliente:** ✅ Concedido por <nombre> el <fecha> · firmado en <documento/email>
- **Citas verificadas con el cliente:** ✅
- **Métricas verificadas:** ✅ (por <persona en el cliente>)
- **Aprobación interna:** [PENDIENTE / OK por <nombre> el <fecha>]
- **Nivel de detalle autorizado:** Total / Anonimizado / Solo industria
```

---

## Proceso

1. **Recopilar** la información mínima. Sin consentimiento del cliente y sin métricas verificables, **parar** — no es un case study.
2. **Validar las métricas con el cliente.** Toda métrica publicada debe estar confirmada por la persona protagonista o un peer en la empresa cliente. Marcar `[VERIFICADO]` cada una.
3. **Recoger citas verbatim**, no parafraseadas. Si no hay cita en bruto, programar 30 min con el cliente o trabajar a partir de un email/transcripción real.
4. **Redactar TL;DR primero.** Es la única parte que muchos leerán. Si no convence en 30 segundos, no convence.
5. **Sección Problema con dolor concreto y medido.** Los problemas vagos ("queríamos mejorar la eficiencia") no convencen.
6. **Sección Solución específica al cliente.** Si esto se podría aplicar a cualquier case study con buscar-y-reemplazar, está mal escrita. Cada implementación tiene matiz.
7. **Resultados con horizonte temporal.** "Aumentamos un 200%" sin plazo es marketing; "Aumentamos un 200% en 6 meses" es dato.
8. **Marcar lo que falta autorización.** `[CITA POR VERIFICAR]`, `[MÉTRICA POR VERIFICAR]`, `[APROBACIÓN PENDIENTE]`.
9. **Adaptar a canal**: una versión más narrativa para blog, una más con bullets para sales pitch, ambos saliendo del mismo .md fuente.
10. **Guardar** en la carpeta del dept que solicita (`<proyecto>/marketing/posts/<slug>/` típicamente, o `<proyecto>/sales/account-intelligence/<slug>/` si es para venta). La skill es compartida; el output vive donde lo consume el agente.
11. **Reportar** al usuario: ruta, TL;DR, métricas destacadas, estado de aprobaciones, próximos pasos por canal.

---

## Restricciones

- **No publiques sin consentimiento explícito del cliente.** Documentar fecha y forma (firma, email, contrato).
- **No infles métricas.** Si la mejora fue del 15%, no lo conviertas en "miles de horas ahorradas" inventando equivalencias.
- **No pongas citas que el cliente no diría.** Verbatim o nada.
- **No mezcles casos**. Un case study = un cliente. Aglomerar dos clientes en un solo case es desinformación.
- **No publiques case study anónimo si el cliente autorizó nombre y viceversa.** Respetar exactamente el nivel autorizado.
- **No omitas la fecha de última validación.** Las métricas envejecen; un case study de hace 3 años puede ser desactualizado.
- **No promitas resultados generalizables.** "Resultados varían según contexto" es honesto.
- Aplican las reglas de output de `_shared/output-rules.md`.
