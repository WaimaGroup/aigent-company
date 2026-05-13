---
name: "design-handoff-checklist"
description: >
  Skill for producing a pre-handoff checklist for design → engineering: tokens
  used, all states covered, responsive behavior specified, edge cases handled,
  accessibility minimums met, Figma link with frames named, assets exported,
  acceptance criteria written. Reduces back-and-forth between design and eng.
---

# Skill: Design Handoff Checklist

**Entregable:** archivo `.md` con checklist firmada por designer y aceptada por eng, lista para handoff. Vive en `<proyecto>/design/ui/<feature-slug>/handoff-checklist.md` (junto a las specs de la feature).

---

## Cuándo usar esta skill

- Diseñador completa el design de una feature y va a pasarlo a engineering para implementación.
- Equipo notó fricción crónica entre design y eng y conviene formalizar el checkpoint.
- Onboarding de un nuevo dev: enseñar qué se espera en handoff.
- Standard de empresa: cada feature pasa por checklist antes de entrar a sprint.

**Cuándo NO usar:**

- Para spec de componente individual (eso es `ui-component-spec`).
- Para documentación del DS (eso es `ds-component-doc`).
- Para audit de accesibilidad formal (eso es `accessibility-audit`).
- Para revisión post-implementación (eso es code review y QA).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Feature | Nombre y descripción |
| Designer owner | Quién hizo el design |
| Eng owner (receptor) | Tech lead o engineer que va a implementar |
| PM owner | Quién lleva el PRD |
| Figma file / frames | URL al frame principal |
| Plataforma(s) | Web responsive / iOS / Android / multi |
| Design system version | Versión vigente del DS |
| Fecha objetivo de handoff | Cuándo entra a sprint |

---

## Plantilla del entregable

Nombre del archivo: `handoff-checklist.md` (un archivo por feature).

```markdown
---
type: "design-handoff-checklist"
feature: "<Nombre>"
feature_slug: "<kebab-case>"
designer: "<nombre>"
eng_lead: "<nombre>"
pm: "<nombre>"
figma_file: "<URL>"
platforms: ["web-responsive", "ios", "android"]
ds_version: "<vX.Y>"
handoff_date_planned: "YYYY-MM-DD"
handoff_date_actual: "YYYY-MM-DD"
status: "in-design | ready-for-handoff | accepted | rejected-back-to-design"
---

# Design Handoff Checklist — <Feature>

> **Firma del designer (estoy listo para handoff):** ⬜ <nombre> · <fecha>
> **Firma del eng (acepto el handoff):** ⬜ <nombre> · <fecha>

## 0. Resumen

- **Feature:** <descripción en una línea>
- **PRD link:** <URL>
- **Figma principal:** <URL>
- **Plataformas:** <listado>

---

## 1. Visual y layout

- [ ] **Figma file con frames organizados y nombrados** (no "Frame 247" — nombres descriptivos: `Settings/Profile/Edit`).
- [ ] **Todas las pantallas / componentes** de la feature están en el file.
- [ ] **Componentes del DS usados** (no diseñados ad-hoc cuando existe equivalente en DS).
- [ ] **Auto-layout aplicado** en componentes responsive.
- [ ] **Spacing usando tokens del DS** (no valores arbitrarios).

**Figma link específico al frame principal:** `<URL>`

---

## 2. Estados completos

> Cada componente y pantalla debe tener todos los estados aplicables.

- [ ] **Default** ✅
- [ ] **Hover** (si plataforma soporta — web)
- [ ] **Focus** (visible para keyboard nav)
- [ ] **Active / Pressed**
- [ ] **Disabled**
- [ ] **Loading** (skeleton, spinner, blocking behavior)
- [ ] **Error** (con mensaje y recovery action)
- [ ] **Empty** (para listas, dashboards, etc.)
- [ ] **Selected** (si aplica)
- [ ] **<Otros estados específicos de la feature>**

**Estados no incluidos y razón:**
- <ej. "Hover no aplica porque feature solo es mobile">

---

## 3. Responsive y plataforma

### Breakpoints cubiertos

- [ ] **Mobile** (<640px) — comportamiento + frame disponible
- [ ] **Tablet** (640-1024px)
- [ ] **Desktop** (>1024px)
- [ ] **Wide** (>1440px) si aplica

### Comportamiento responsive declarado

- [ ] Cambios de layout en cada breakpoint documentados.
- [ ] Imágenes con tratamiento responsive (srcset, cropping rules).
- [ ] Texto: truncation rules, line clamping, font scaling.

### Plataforma-específico (si multi)

- [ ] iOS: HIG patterns respetados (navigation, gestures, system fonts si aplica).
- [ ] Android: Material patterns respetados.
- [ ] Web: keyboard navigation funciona.

---

## 4. Design tokens consumidos

> Token map explícito de todos los tokens del DS usados.

- [ ] **Color tokens** listados (semánticos preferiblemente, no base primitives).
- [ ] **Spacing tokens** mapeados.
- [ ] **Typography tokens** mapeados.
- [ ] **Radius / shadow tokens** mapeados.
- [ ] **Motion / animation tokens** mapeados si hay animación.

**Token map (resumen):**

```
- Background canvas: color.background.canvas
- Texto primario: color.text.primary
- Padding interno: space.4
- Tipografía body: typography.body.md
- Radius del card: radius.md
```

**Valores ad-hoc (no tokens):**
- [ ] Ninguno ✅
- [ ] Hay valores ad-hoc: <listado + justificación + `[DS PENDIENTE]` propuesta de token nuevo>

---

## 5. Edge cases

- [ ] **Texto muy largo:** comportamiento definido (truncation, wrap, tooltip).
- [ ] **Texto vacío / faltante:** comportamiento (placeholder, fallback).
- [ ] **Datos vacíos** (lista sin items, dashboard sin datos): empty state diseñado.
- [ ] **Error de red:** estado error + reintento.
- [ ] **Permisos insuficientes:** estado bloqueado + mensaje.
- [ ] **Loading muy largo (>2s):** progress indicator o feedback.
- [ ] **Multi-byte / internationalization:** texto con caracteres especiales (chinos, árabes, emojis) no rompe layout.
- [ ] **RTL** (si aplica): layout mirror correcto.

---

## 6. Accesibilidad (mínimos)

- [ ] **Contraste WCAG AA** validado en pares foreground/background críticos (≥ 4.5:1 texto regular, ≥ 3:1 large + UI elements).
- [ ] **Focus visible** en todos los elementos interactivos.
- [ ] **Tamaño táctil mínimo** 44×44pt (iOS) / 48×48dp (Android) / equivalente web.
- [ ] **Alt text** definido para imágenes informativas. Imágenes decorativas marcadas como tal.
- [ ] **Aria labels** sugeridos para componentes icon-only o con etiquetas no visuales.
- [ ] **Orden de focus** consciente (no aleatorio).
- [ ] **Screen reader behavior** considerado en cambios de estado dinámicos (loading → success / error).
- [ ] **Reduced motion** respetado en animaciones (no autoplaying motion sin opt-out).

> Para audit a11y formal: coordinar con `design-accessibility` (skill `accessibility-audit`). Esta sección es check mínimo, no audit completo.

---

## 7. Assets

- [ ] **Iconos exportados** (SVG / íconos del DS — referenciados, no duplicados).
- [ ] **Imágenes exportadas** con resoluciones múltiples (1x, 2x, 3x si mobile).
- [ ] **Ilustraciones** en formato vectorial cuando posible (SVG).
- [ ] **Naming convention** consistente para todos los assets.
- [ ] **Compresión optimizada** (no exportar PNGs sin optimizar).

**Carpeta de assets:** `<link>`

---

## 8. Acceptance criteria (Given-When-Then)

> Cada feature con sus criterios de aceptación verificables.

- [ ] **AC1:** <Given X, When Y, Then Z>
- [ ] **AC2:** ...
- [ ] **AC3:** ...

**No olvidar:**
- AC sobre estados (loading, error, empty).
- AC sobre validación de inputs.
- AC sobre accesibilidad mínima.

---

## 9. Decisiones de UX explicadas

> 2-5 decisiones materiales del design que el eng necesita entender.

- **Decisión 1:** <ej. "Usamos modal en lugar de full-page porque el flow es completable en <30s y queremos preservar contexto."> Por qué importa para eng: <ej. "Implementar como overlay con scroll lock; no como nueva ruta">.
- **Decisión 2:** ...

---

## 10. Dependencias y open questions

### Dependencias del eng

- **API endpoints requeridos:** <listado, link a `api-spec` si existe>.
- **Data model implícito:** <esquema mínimo: qué campos consume la UI>.
- **Integraciones con servicios externos:** <listado si aplica>.

### Open questions del design (pendientes de resolver con eng/PM)

- [ ] <Pregunta 1>
- [ ] <Pregunta 2>

> Resolver antes del handoff o marcar para resolver durante implementación con plan claro.

---

## 11. Handoff meeting

### Agenda recomendada (30-45 min)

1. **Walkthrough del Figma** (10-15 min) — designer explica el flow completo.
2. **Q&A técnico** (10-15 min) — eng pregunta sobre estados, edge cases, deps.
3. **Validación de la checklist** (5-10 min) — recorrido item por item.
4. **Decisión:**
   - ✅ Accepted — eng arranca implementación.
   - 🔄 Iteración — design vuelve a pulir items específicos.
   - ❌ Rechazo (raro) — gaps mayores requieren rediseño parcial.

### Decisión final

- **Status:** ✅ Accepted / 🔄 Back to design / ❌ Rejected
- **Items pendientes para eng durante implementación:**
  - <ej. "Decidir copy final del empty state con marketing">
- **Items que design seguirá refinando en paralelo:**
  - <ej. "Animación del modal — design itera la curve esta semana">

---

## 12. Histórico

| Fecha | Estado | Notas |
|---|---|---|
| YYYY-MM-DD | Created | Versión inicial |
| YYYY-MM-DD | Ready for handoff | Designer firma |
| YYYY-MM-DD | Handoff meeting | <decisión> |
| YYYY-MM-DD | Accepted | Eng arranca |
```

---

## Proceso

1. **Recopilar** la información mínima. Sin Figma link y designer/eng owners, parar.
2. **Recorrer la checklist como auto-evaluación.** El designer marca items antes de la meeting.
3. **No firmar como "ready" con items críticos sin marcar.** Es honesto y evita meetings improductivas.
4. **Identificar valores ad-hoc** que no usan tokens (sección 4). Cada uno con `[DS PENDIENTE]` propuesta de extensión del DS.
5. **Edge cases obligatorios.** Sección 5 es el filtro de calidad — si está vacío, hay items por pensar.
6. **Acceptance criteria como input a QA.** Las ACs salen del design hacia QA y eng.
7. **Open questions explícitas** — mejor explicitar lo no resuelto que sorprender al eng en sprint.
8. **Meeting de handoff con agenda.** Sin agenda, las sesiones se alargan o quedan asuntos pendientes.
9. **Marcar `[A RESOLVER EN HANDOFF]`** las dudas que se resolverán en la meeting, `[POST-HANDOFF]` lo que se ajustará tras la meeting, `[A AUDIT FORMAL]` lo que `design-accessibility` debe revisar.
10. **Guardar** en `<proyecto>/design/ui/<feature-slug>/handoff-checklist.md`.
11. **Reportar** al usuario: ruta, items pendientes, fecha de handoff, estado de readiness.

---

## Restricciones

- **No firmes ready-for-handoff con items críticos sin marcar.** Honestidad ahorra meetings.
- **No omitas estados completos.** Default + 6-8 estados más son obligatorios para handoff serio.
- **No introduzcas valores ad-hoc sin marcarlos como deuda.**
- **No prometas accesibilidad WCAG AA completa** sin audit formal con `accessibility-audit`. Sección 6 es mínimo, no audit.
- **No mezcles handoff checklist con design review.** Review es feedback al design; handoff es validación final.
- **No copies checklist de otro feature** sin validar items concretos. Cada feature tiene sus edge cases.
- **No saltes meeting de handoff** salvo features triviales. La meeting evita 80% de back-and-forth.
- **No conviertas la meeting en walkthrough completo + design review combinados.** Walkthrough + Q&A + validación es suficiente; design review debió hacerse antes.
- Aplican las reglas de output de `_shared/output-rules.md`.
