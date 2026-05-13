---
name: "ds-component-doc"
description: >
  Skill for producing canonical Design System component documentation: anatomy,
  variants matrix, complete states, props/API, do/don't guidelines with examples,
  formal accessibility audit reference, token consumption, versioning,
  deprecation notice when applies. More exhaustive than ui-component-spec — this
  is the canonical reference of the DS.
---

# Skill: Design System Component Documentation

**Entregable:** archivo `.md` con la documentación canónica de un componente del Design System, lista para vivir en el repositorio del DS (Storybook, ZeroHeight, repo de docs, etc.). Vive en `<proyecto>/design/design-system/components/<component-slug>.md`.

---

## Cuándo usar esta skill

- Se añade un componente nuevo al DS oficial.
- Se actualiza un componente existente con cambios materiales (variantes nuevas, props, breaking change).
- Se documenta retroactivamente un componente que estaba sin doc oficial.
- Se prepara la primera versión 1.0 del DS y hay que documentar todos los componentes.

**Cuándo NO usar:**

- Para spec puntual de un componente en una feature (eso es `ui-component-spec` — más ligero, no canónico).
- Para tokens (eso es `design-token-set`).
- Para foundations / principios (eso vive en `<proyecto>/design/design-system/foundations/`).

> **Diferencia vs `ui-component-spec`:** ui-component-spec es para una feature concreta (handoff puntual). ds-component-doc es la canonical reference del DS — más exhaustiva, con guidelines de uso, audit a11y formal, política de versionado.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Componente | Nombre canónico (Button, Modal, Toast, etc.) |
| Estado en DS | Nuevo / evolución / breaking change |
| DS version | Versión del DS donde se introduce / evoluciona |
| Plataformas | Web / iOS / Android / multi |
| Variantes y props | Variants (size, intent), props (disabled, loading, icon), etc. |
| Audit a11y | ¿Ha pasado audit formal con `accessibility-audit`? |
| Implementaciones existentes | ¿Está implementado en React / Vue / SwiftUI / Compose? Links al código |
| Ejemplos de uso | Pantallas donde el componente se usa o se usará |

---

## Plantilla del entregable

Nombre del archivo: `<component-slug>.md` (ej. `button.md`, `modal.md`, `data-table.md`).

```markdown
---
type: "ds-component-doc"
component_name: "<Nombre>"
component_slug: "<kebab-case>"
ds_version_introduced: "<vX.Y>"
current_version: "<vX.Y>"
status: "stable | beta | deprecated"
platforms: ["web", "ios", "android"]
audit_a11y_date: "YYYY-MM-DD"
audit_a11y_wcag_level: "AA"
implementations:
  - { platform: "web", language: "React", version: "vX.Y", repo: "<URL>" }
  - { platform: "ios", language: "SwiftUI", version: "vX.Y", repo: "<URL>" }
owner: "<DS team / persona>"
last_updated: "YYYY-MM-DD"
---

# <Component Name>

> **Status:** ✅ Stable / 🟡 Beta / ⚠️ Deprecated · **DS version:** v<X.Y>
> **Implementaciones:** Web (React v<X.Y>) · iOS (SwiftUI v<X.Y>) · Android (Compose v<X.Y>)

## 0. Resumen

> 2-3 líneas. Qué es este componente, cuándo usarlo, cuándo NO usarlo.

**Usar para:** <propósito principal en una línea>
**NO usar para:** <usos donde otro componente del DS es mejor>

### Ejemplo visual

[Screenshot / mockup del componente en su estado default]

Link a Figma: `<URL al component master>`

---

## 1. Anatomía

```
[Diagrama ASCII o visual de las partes del componente]

┌──────────────────────────────────────┐
│  [Icon left] Label                   │ ← Container
│  ┌──────────────────────────────┐    │   - padding: space.4
│  │ Content                      │    │   - bg: color.background.surface
│  └──────────────────────────────┘    │   - border-radius: radius.md
│                          [Icon right]│
└──────────────────────────────────────┘
```

**Partes:**

| Parte | Descripción | Token / propiedad |
|---|---|---|
| Container | El envoltorio principal | `radius.md`, `space.4 padding`, `color.background.surface` |
| Icon left (optional) | Icono al inicio | `space.2 margin-right` |
| Label | Texto principal del componente | `typography.body.md`, `color.text.primary` |
| Content | Contenido interno (slot) | flexible |
| Icon right (optional) | Icono al final | `space.2 margin-left` |

---

## 2. Variantes

> Matriz completa de variantes admitidas.

### Tamaños (size)

| Size | Padding | Height | Typography |
|---|---|---|---|
| sm | space.2 / space.3 | 32px | typography.body.sm |
| md (default) | space.3 / space.4 | 40px | typography.body.md |
| lg | space.4 / space.5 | 48px | typography.body.lg |

### Intenciones (intent / variant)

| Intent | Background | Border | Texto | Hover bg |
|---|---|---|---|---|
| primary (default) | color.action.primary.bg | none | color.action.primary.text | color.action.primary.bg-hover |
| secondary | color.action.secondary.bg | color.border.default | color.text.primary | color.action.secondary.bg-hover |
| ghost | transparent | none | color.text.primary | color.background.muted |
| danger | color.status.danger.bg | none | color.text.inverse | color.status.danger.bg-hover |
| success | color.status.success.bg | none | color.text.inverse | color.status.success.bg-hover |

### Iconografía

- Solo texto: ok.
- Texto + icon (izquierda o derecha): ok.
- Solo icon (icon-only): requiere `aria-label` obligatorio.

> Matriz completa size × intent: hay <N> combinaciones válidas. <Documentar las que NO son válidas si aplica>.

---

## 3. Props / API

### Web (React)

```tsx
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';                    // default: 'md'
  intent?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';  // default: 'primary'
  disabled?: boolean;                           // default: false
  loading?: boolean;                            // default: false
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;                          // default: false
  type?: 'button' | 'submit' | 'reset';         // default: 'button'
  onClick?: (e: MouseEvent) => void;
  children: ReactNode;
  'aria-label'?: string;                        // required if icon-only
}
```

### iOS (SwiftUI)

```swift
Button(
  size: Size = .md,
  intent: Intent = .primary,
  isDisabled: Bool = false,
  isLoading: Bool = false,
  iconLeft: Image? = nil,
  iconRight: Image? = nil,
  action: @escaping () -> Void,
  label: () -> Text
)
```

### Android (Compose)

```kotlin
Button(
  size: Size = Size.Md,
  intent: Intent = Intent.Primary,
  enabled: Boolean = true,
  loading: Boolean = false,
  iconLeft: ImageVector? = null,
  iconRight: ImageVector? = null,
  onClick: () -> Unit,
  text: String
)
```

---

## 4. Estados

### Default

- Background, texto, border según `intent`.
- Cursor: pointer (web).

### Hover (web/desktop)

- Background: `<intent>.bg-hover`
- Transition: `motion.duration.fast` `motion.easing.standard`

### Focus

- Outline: `2px solid color.focus.ring` con offset `2px`.
- Visible siempre — NO eliminar con `outline: none` sin reemplazo.

### Active / Pressed

- Background: `<intent>.bg-active` (typically darker than hover).
- Optional: slight `transform: scale(0.98)` para feedback.

### Disabled

- Opacity: 0.5 (o color.text.disabled / color.background.disabled).
- Cursor: not-allowed (web).
- Eventos: bloqueados (pointer-events: none).
- Aria: `aria-disabled="true"`.

### Loading

- Spinner reemplaza icon left (o se overlay sobre el label).
- Botón mantiene su width (no salta).
- Eventos: bloqueados durante loading.
- Aria: `aria-busy="true"`.

---

## 5. Guidelines de uso — Do / Don't

### ✅ Hacer

- **Una sola acción primaria por pantalla.** El botón primary destaca; saturar primaries diluye la jerarquía.
- **Etiquetas verbales claras.** "Guardar" mejor que "OK"; "Cancelar suscripción" mejor que "Confirmar".
- **Icon left para acciones,** icon right para navegación (siguiente paso, externo).
- **Loading state durante operaciones >300ms.**

### ❌ No hacer

- **No usar `primary` para acciones destructivas.** Usar `danger`.
- **No anidar botones** (un botón dentro de otro).
- **No usar botones para navegación pura.** Para eso, link.
- **No quitar focus visible.** Aunque sea por estética; usar el de DS.
- **No combinar más de 1-2 botones** con misma intent en la misma pantalla.

### Anti-patrones visuales

[Ejemplos con ✅ y ❌ — screenshots o links a Figma con casos correctos e incorrectos]

---

## 6. Accesibilidad

### Nivel objetivo

- **WCAG 2.2 AA** (default del DS).

### Comportamiento esperado

- **Keyboard:**
  - Tab: foco al botón.
  - Enter / Space: activa el `onClick`.
  - Focus visible siempre.
- **Screen reader:**
  - Anuncio: "Button, <label>".
  - Si `disabled`: "Button, <label>, disabled".
  - Si `loading`: "Button, <label>, busy" + `aria-busy="true"`.
  - Si icon-only: `aria-label` requerido como label legible.
- **Contraste:**
  - Texto vs background: ≥ 4.5:1 (text regular) / 3:1 (text grande).
  - Border / focus ring: ≥ 3:1.
  - Verificado en `<token-map.md>` (sección 8 de `design-token-set`).
- **Target size:**
  - Mínimo 44×44pt (iOS) / 48×48dp (Android) / 44×44px (web).
- **Reduced motion:**
  - Animaciones de hover/active respetan `prefers-reduced-motion`.

### Audit a11y formal

- **Fecha último audit:** <YYYY-MM-DD>
- **Auditor:** `design-accessibility` con skill `accessibility-audit`.
- **Link al audit:** `<URL>`
- **Issues abiertos:** <N> (link al remediation plan si > 0).

---

## 7. Ejemplos de uso

### En código (web)

```tsx
// Primary action
<Button intent="primary" onClick={save}>
  Guardar
</Button>

// With icon
<Button intent="primary" iconLeft={<PlusIcon />}>
  Añadir item
</Button>

// Destructive action
<Button intent="danger" onClick={confirmDelete}>
  Eliminar cuenta
</Button>

// Loading state
<Button intent="primary" loading={isSaving}>
  Guardar
</Button>

// Icon-only (with aria-label)
<Button intent="ghost" iconLeft={<CloseIcon />} aria-label="Cerrar diálogo" />
```

### En contexto (mockups)

- **Pantalla A — Settings:** [link a Figma] · primary "Guardar" + secondary "Cancelar".
- **Pantalla B — Modal de confirmación:** [link] · danger "Eliminar" + ghost "Cancelar".

---

## 8. Tokens consumidos

> Lista completa para validar coherencia con el DS.

### Color

- `color.action.primary.bg`, `.text`, `.bg-hover`, `.bg-active`
- `color.action.secondary.bg`, `.text`, `.bg-hover`, `.bg-active`
- `color.action.ghost.text`, `.bg-hover`
- `color.status.danger.bg`, `.text`, `.bg-hover`
- `color.status.success.bg`, `.text`, `.bg-hover`
- `color.text.disabled`, `color.background.disabled`
- `color.focus.ring`

### Spacing

- `space.2`, `space.3`, `space.4`, `space.5` (en padding según size)

### Typography

- `typography.body.sm`, `typography.body.md`, `typography.body.lg`

### Radius

- `radius.md`

### Motion

- `motion.duration.fast`, `motion.easing.standard`

---

## 9. Composability — relación con otros componentes

> Cómo se combina con otros componentes del DS.

- **Modal:** Button como acción principal del modal footer.
- **Toast:** Button como acción inline opcional.
- **Form:** Button submit al final de formularios.
- **Card:** Button puede vivir dentro de un Card como CTA secundario.

> Patrones anti-compose: <ej. "No usar Button dentro de Link — usar Link directamente">.

---

## 10. Versionado

### Política

- **MAJOR:** breaking change — eliminar variante, renombrar prop, cambiar comportamiento.
- **MINOR:** addition compatible — nueva variante, nuevo prop opcional.
- **PATCH:** fix, ajuste visual sin breaking, typo.

### Plan de deprecation

> Si una variante se va a retirar, marcarla.

- **<Variante / prop deprecated>** — desde v<X.Y>; será retirada en v<X+1.0>. Alternativa: `<reemplazo>`.

---

## 11. Histórico de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| <vX.Y> | <YYYY-MM-DD> | <cambios principales> |
| <vX.Y-1> | <YYYY-MM-DD> | <cambios> |

---

## 12. Implementaciones — links a código

| Plataforma | Tech | Repo | Storybook / Showcase |
|---|---|---|---|
| Web | React | <URL repo> | <URL storybook> |
| iOS | SwiftUI | <URL repo> | — |
| Android | Compose | <URL repo> | — |

---

## 13. FAQ

> Preguntas recurrentes de los consumidores del DS.

**¿Por qué no hay variante `outline`?**
- Decisión consciente: `secondary` cubre el caso. Si necesitas algo más sutil, usar `ghost`.

**¿Puedo crear mi propia variante para mi feature?**
- No. Si tu caso no cubre, abrir ticket en repo del DS proponiendo nueva variante.

(añadir según emergen preguntas)
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin audit a11y reciente o implementaciones, parar — o marcar `[PENDIENTE]` claramente.
2. **Anatomía primero**, antes de props y variantes. Sin saber qué partes tiene el componente, las variantes son arbitrarias.
3. **Matriz de variantes completa** (size × intent × otras). Documentar las combinaciones NO válidas también.
4. **Props con tipos exactos** para cada plataforma. No "boolean opcional"; `disabled?: boolean = false`.
5. **Estados completos** con tokens explícitos. Si un estado no aplica (hover en mobile), marcarlo.
6. **Guidelines do/don't con ejemplos visuales.** Texto sin ejemplos visuales tiene poco impacto.
7. **Audit a11y formal** referenciado (no auto-declarado). Si no se ha hecho, marcarlo y planificarlo.
8. **Token map completo.** Permite verificar coherencia con el DS y detectar drift.
9. **Versionado + deprecation policy** declarados. Sin esto, el componente envejece sin control.
10. **Marcar `[A11Y AUDIT PENDIENTE]`** si no hay audit reciente, `[IMPL PENDIENTE]` plataformas sin implementación, `[FAQ PENDIENTE]` cuando no hay preguntas recurrentes aún.
11. **Guardar** en `<proyecto>/design/design-system/components/<component-slug>.md`.
12. **Reportar** al usuario: ruta, estado (stable/beta/deprecated), implementaciones disponibles, audit a11y status.

---

## Restricciones

- **No declares stable sin audit a11y formal.** Beta hasta que esté auditado.
- **No declares stable sin implementación en al menos una plataforma.** Doc sin código es promesa.
- **No introduzcas variantes "porque sí".** Cada variante con caso de uso documentado.
- **No omitas anti-patrones.** Lo que NO hacer es tan importante como lo que sí hacer.
- **No publiques sin versionado declarado.** Componente sin versión es deuda futura.
- **No copies documentación de otros DS** (Material, Carbon, Polaris) literalmente. Inspirarse sí; clonar no.
- **No mezcles ui-component-spec con ds-component-doc.** Esta es canonical del DS; ui-component-spec es spec puntual.
- **No prometas implementación cross-platform** sin que esté hecho. Marcar pending platforms claramente.
- Aplican las reglas de output de `_shared/output-rules.md`.
