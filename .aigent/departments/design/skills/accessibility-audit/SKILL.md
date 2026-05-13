---
name: "accessibility-audit"
description: >
  Skill for producing a structured WCAG accessibility audit (2.1/2.2 levels A,
  AA, AAA): scope, criteria evaluated with pass/fail/partial/N-A, findings with
  severity and remediation recommendations, score by level, executive summary.
  Default standard is WCAG 2.2 AA.
---

# Skill: Accessibility Audit

**Entregable:** archivo `.md` con la auditoría completa, guardado en `<proyecto>/design/accessibility/audits/<scope-slug>-audit-<YYYY-MM>.md`.

---

## Cuándo usar esta skill

- Hay que auditar una pantalla, un flow, un módulo o el producto entero frente a WCAG.
- Hay que producir un report previo a release (gate de a11y).
- Hay que documentar el estado de a11y para un accessibility statement público.
- Hay que auditar el design system entero como base reutilizable.

**Cuándo NO usar:**

- Para definir un patrón accesible canónico (eso es un `pattern.md` en `accessibility/patterns/`).
- Para un remediation plan (eso viene tras la auditoría, en `accessibility/remediation/`).
- Para training material (otro formato).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | ¿Qué se audita? (pantalla X, flow Y, módulo Z, producto entero, DS) |
| Nivel WCAG objetivo | A / AA / AAA — por defecto WCAG 2.2 AA |
| Versión WCAG | 2.1 / 2.2 (por defecto 2.2 — incluye nuevos SC) |
| Plataforma(s) | Web / iOS / Android — afecta a SC aplicables y a tecnología asistiva |
| Tecnología asistiva probada | VoiceOver / NVDA / JAWS / TalkBack / lupa / dictado / etc. |
| Modo de auditoría | Solo visual + keyboard / + screen reader / + auditoría de implementación con axe / Lighthouse |
| Audiencia del report | Engineering (para fix), leadership (para roadmap), externo (para statement) |
| Contexto | ¿Hay audits previos? ¿Backlog conocido? ¿Reclamación o normativa que motiva el audit? |

---

## Plantilla del entregable

```markdown
---
type: "a11y-audit"
scope: "<descripción del scope>"
wcag_version: "2.2"
wcag_target_level: "AA"
date: "YYYY-MM-DD"
auditor: "<persona>"
platforms: ["web", "ios", "android"]
assistive_tech_tested: ["VoiceOver (iOS)", "NVDA (Win)", "Keyboard only"]
status: "draft | reviewed | finalized"
audit_mode: "manual + axe | manual only | full + screen-readers"
---

# Audit a11y — <Scope> · WCAG <versión> <nivel>

## 0. Resumen ejecutivo

> 5-7 líneas. Veredicto, score por nivel, top issues, recomendación general.

**Veredicto:**
- ✅ Cumple WCAG <versión> <nivel> sin issues bloqueantes / críticos.
- 🟠 Cumple con issues mayores: <N> issues a resolver antes de claim de cumplimiento.
- 🔴 No cumple: <N> issues bloqueantes / críticos.

**Score por nivel:**

| Nivel | SC aplicables | Pass | Fail | Partial | N/A | % Pass |
|---|---|---|---|---|---|---|
| A | <X> | <Y> | <Z> | <W> | <V> | <%> |
| AA | <X> | <Y> | <Z> | <W> | <V> | <%> |
| AAA | <X> | <Y> | <Z> | <W> | <V> | <%> |

**Top 5 issues a atender primero:**
1. <Issue + ubicación + severidad>
2. ...

---

## 1. Scope auditado

- **Qué se audita:** <pantallas / flows / componentes específicos>
- **Qué NO se audita:** <fuera de scope explícito>
- **Versión del producto / commit / build:** <referencia>
- **Fecha de auditoría:** <fecha>

## 2. Metodología

- **Manual visual + keyboard:** sí / no
- **Screen reader:** <plataformas probadas> sí / no
- **Tooling automatizado:** <axe, Lighthouse, Wave, NU HTML Checker> sí / no
- **Casos edge probados:** zoom 200%, reduced motion, high contrast mode, RTL <si aplica>.

## 3. Criterios evaluados (resumen tabular)

> Tabla maestra de cada SC aplicable del nivel objetivo.

| SC | Título | Nivel | Aplicable | Estado |
|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | Sí | ✅ Pass |
| 1.3.1 | Info and Relationships | A | Sí | 🟠 Partial — ver Issue #3 |
| 1.4.3 | Contrast (Minimum) | AA | Sí | 🔴 Fail — ver Issue #1 |
| 1.4.10 | Reflow | AA | Sí | ✅ Pass |
| 1.4.11 | Non-text Contrast | AA | Sí | 🟠 Partial — ver Issue #5 |
| 2.1.1 | Keyboard | A | Sí | ✅ Pass |
| 2.4.7 | Focus Visible | AA | Sí | 🔴 Fail — ver Issue #2 |
| 2.5.7 | Dragging Movements (2.2) | AA | Sí | N/A — no hay drag-drop |
| 3.3.7 | Redundant Entry (2.2) | A | Sí | ✅ Pass |
| 4.1.2 | Name, Role, Value | A | Sí | 🟠 Partial — ver Issue #4 |
| ... | | | | |

> Para listado canónico de criterios WCAG 2.2, consultar https://www.w3.org/WAI/WCAG22/quickref/

## 4. Hallazgos detallados

> Cada issue independiente con severidad y remediación.

### 🔴 Issue #1 — Contraste insuficiente en texto secundario

- **SC infringido:** WCAG 2.2 — 1.4.3 Contrast (Minimum) (AA)
- **Severidad:** **Crítico**
- **Ubicación:** <pantalla / componente / selector>
- **Descripción factual:** El texto `color.text.subtle` (#9CA3AF) sobre `color.background.canvas` (#FFFFFF) tiene un ratio de 2.84:1, por debajo del mínimo 4.5:1 (texto regular) o 3:1 (texto grande).
- **Impacto en usuario:** usuarios con baja visión no pueden leer cómodamente este texto, especialmente en condiciones de luz adversas.
- **Evidencia:** <screenshot / link Figma>
- **Recomendación:** sustituir `color.text.subtle` por un token con ratio ≥4.5:1 sobre canvas (sugerencia: `#6B7280` → 4.7:1). Aplica al DS, no solo a esta pantalla.
- **Esfuerzo estimado:** Bajo (cambio de token en el DS, propagación automática a consumidores).
- **Categoría:** `[DS FIX]` — fix se aplica en el DS.

---

### 🔴 Issue #2 — Focus visible eliminado por reset CSS

- **SC infringido:** WCAG 2.2 — 2.4.7 Focus Visible (AA)
- **Severidad:** **Bloqueante**
- **Ubicación:** Toda la app — reset global `*:focus { outline: none; }`
- **Descripción:** El reset CSS elimina el outline de focus sin proveer alternativa visible. Los usuarios que navegan por teclado pierden referencia visual.
- **Impacto en usuario:** usuarios solo teclado, low vision con focus visible, usuarios con discapacidades motoras que no usan ratón.
- **Recomendación:** eliminar el reset y aplicar focus visible con tokens del DS (`outline: 2px solid var(--color.focus.ring)` + `outline-offset: 2px`).
- **Esfuerzo estimado:** Bajo en CSS, requiere verificar todos los componentes.
- **Categoría:** `[ENGINEERING FIX]`.

---

### 🟠 Issue #3 — Encabezados sin jerarquía consistente

- **SC:** WCAG 2.2 — 1.3.1 Info and Relationships (A)
- **Severidad:** Mayor
- **Ubicación:** <pantalla X>
- **Descripción:** La pantalla salta de `<h1>` a `<h3>` sin `<h2>` intermedio. Los screen readers anuncian estructura incorrecta.
- **Recomendación:** restablecer jerarquía: H1 (página) → H2 (secciones) → H3 (subsecciones).
- **Esfuerzo:** Bajo.
- **Categoría:** `[ENGINEERING FIX]`.

---

### 🟠 Issue #4 — Botón icon-only sin label accesible

- **SC:** WCAG 2.2 — 4.1.2 Name, Role, Value (A)
- **Severidad:** Mayor
- **Ubicación:** <componente IconButton>
- **Descripción:** Botones con solo icono no tienen `aria-label` ni texto visible. Screen reader anuncia "button" sin propósito.
- **Recomendación:** añadir `aria-label="<acción>"` o tooltip accesible. Aplica al componente del DS.
- **Esfuerzo:** Bajo.
- **Categoría:** `[DS FIX]`.

---

### 🟠 Issue #5 — Border de input con contraste bajo

- **SC:** WCAG 2.2 — 1.4.11 Non-text Contrast (AA)
- **Severidad:** Mayor
- **Ubicación:** <Input component>
- **Descripción:** Borde del input en estado default tiene ratio 1.8:1 contra background, por debajo de 3:1 requerido para UI elements.
- **Recomendación:** subir tono del border default o reforzar con sombra interior.
- **Categoría:** `[DS FIX]`.

---

### 🟡 Issue #6 — Alt text genérico en imágenes informativas

- **SC:** WCAG 2.2 — 1.1.1 Non-text Content (A)
- **Severidad:** Menor
- **Ubicación:** <varias>
- **Descripción:** Imágenes informativas usan alt="image" o alt="logo".
- **Recomendación:** alt descriptivo basado en el contenido informativo de la imagen.
- **Esfuerzo:** Bajo, individual por imagen.

---

### 🔵 Issue #7 — Tooltip aparece solo en hover (no accesible por teclado)

- **SC:** WCAG 2.2 — 2.1.1 Keyboard (A) y 1.4.13 Content on Hover or Focus (AA)
- **Severidad:** Cosmético (no bloqueante porque la info también está disponible en pestaña adjacent, pero recomendable arreglar)
- **Recomendación:** mostrar tooltip también en focus, persistente hasta blur o escape.

---

(Repetir por cada issue identificado.)

## 5. Casos edge evaluados

| Caso | Estado | Notas |
|---|---|---|
| Zoom 200% | ✅ Pass | Reflow correcto |
| Reduced motion | ⚠️ Parcial | Animaciones no respetan `prefers-reduced-motion` en X componentes |
| High contrast mode (Win) | 🟠 Partial | Iconos custom desaparecen en HC |
| RTL *(si aplica)* | N/A | No soportado en esta versión |

## 6. Tecnología asistiva — observaciones

| AT | Versión | Observación |
|---|---|---|
| VoiceOver (iOS 18) | | <comportamiento observado> |
| NVDA (Win 11, last stable) | | <...> |
| Keyboard only (Chrome, Win) | | <...> |

## 7. Recomendaciones globales (no atadas a un SC concreto)

- Adoptar `prefers-reduced-motion` como hook estándar en componentes con animación.
- Documentar patrón accesible para modales / autocompletes en `accessibility/patterns/`.
- Incluir audit a11y como gate en el flow de QA antes de release (coordinar con `software-qa`).

## 8. Próximos pasos

- Generar **remediation plan** con priorización por severidad y owner.
- Issues marcados `[DS FIX]` → coordinar con `design-design-system` para evolución del DS.
- Issues marcados `[ENGINEERING FIX]` → handoff a `software-coding`.
- Issues a verificar con AT real → planificar sesión con dispositivos físicos / cuentas correctas.

## 9. Anexos

- Versión auditada: <referencia commit / build>
- Tooling automatizado usado: <axe-core vX, Lighthouse vY>
- Output crudo del tooling: <link>
- Capturas / evidencia: <link>
- Audits previos: <link al anterior>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin scope y nivel WCAG objetivo, parar.
2. **Construir tabla de SC aplicables** (sección 3). Marcar N/A los SC que no aplican al scope (ej. SC de video si no hay video). El usuario debe ver que no se omitieron.
3. **Evaluar manualmente** lo que tooling no detecta:
   - Contraste de UI elements (axe puede; visualizar también).
   - Orden de focus.
   - Anuncio de screen reader (probar con AT real).
   - Comportamiento responsive y zoom.
   - Reduced motion y high contrast.
4. **Documentar issues con factualidad.** Cada hallazgo:
   - SC infringido + nivel.
   - Severidad explícita (bloqueante / crítico / mayor / menor / cosmético).
   - Descripción factual (lo que pasa, no lo que opinas).
   - Impacto en usuario.
   - Recomendación accionable.
   - Categoría: `[DS FIX]` / `[ENGINEERING FIX]` / `[CONTENT FIX]`.
5. **Casos edge explícitos** (sección 5). Lo que típicamente se olvida.
6. **Score por nivel** en sección 0 con la fórmula: `% pass = pass / (pass + fail + partial)`. N/A no entra al denominador.
7. **Marcar `[VERIFICAR EN SR]`** los issues donde la auditoría es solo visual/keyboard y conviene confirmar con screen reader real.
8. **Distinguir DS fix vs Engineering fix** ahorra repetición y dirige el remediation plan a la fuente correcta.
9. **Guardar** en `<proyecto>/design/accessibility/audits/<scope-slug>-audit-<YYYY-MM>.md`.
10. **Reportar** al usuario:
    - Ruta del archivo.
    - Veredicto y score.
    - Top 5 issues con severidad.
    - Próximo paso: remediation plan, fix en DS, audit con AT real, comunicación a engineering.

---

## Restricciones

- **No declares "fully compliant".** Compliance se mide; no se proclama. Decir "WCAG 2.2 AA evaluado en <fecha> con <X> issues abiertos" es honesto.
- **No omitas el nivel WCAG.** Sin nivel objetivo, "fail" carece de significado.
- **No infieras comportamiento de screen reader sin probarlo.** Marcar `[VERIFICAR EN SR]`.
- **No mezcles severidades.** Marcar todo "alta severidad" anula la priorización.
- **No olvides los SC nuevos de 2.2** si el target es 2.2 (Focus Appearance, Dragging Movements, Target Size, Consistent Help, Redundant Entry, Accessible Authentication).
- **No copies issues de otro audit.** Cada audit es del scope real.
- **No prometas plazos en el audit.** El audit identifica; el remediation plan planifica.
- **No olvides casos edge.** Sección 5 no es opcional.
- Aplican las reglas de output de `_shared/output-rules.md`.
