---
name: "design-token-set"
description: >
  Skill for defining or evolving a design token set by category (color, spacing,
  typography, radii, shadow, motion) with semantic naming, value mapping, and
  governance metadata (status, version, owner, deprecations). DS-versioned.
---

# Skill: Design Token Set

**Entregable:** archivo `.md` con el token set documentado, guardado en `<proyecto>/design/design-system/tokens/<categoría>.md`. Cuando engineering lo consuma, acompañar `.json` (o equivalente del stack) con los tokens en formato máquina.

---

## Cuándo usar esta skill

- Hay que crear el token set inicial de una categoría (color, spacing, typography, radius, shadow, motion).
- Hay que evolucionar un set existente (añadir tokens, renombrar, deprecar).
- Hay que documentar el versioning y la política de deprecation de tokens.

**Cuándo NO usar:**

- Para diseñar un componente concreto que consume tokens (eso es `ui-component-spec`).
- Para foundations conceptuales (principios, voz visual) — esas viven en `<proyecto>/design/design-system/foundations/`.
- Para fixes ad-hoc de color en una pantalla — el token vive en el DS; las pantallas lo consumen.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Categoría | Color / spacing / typography / radius / shadow / motion |
| Versión actual del DS | Si existe DS, qué versión |
| Brand de referencia | ¿Existe brand book de marketing? Coordinar |
| Plataforma(s) | Tokens pueden traducirse distinto: web (CSS vars), iOS (Color Asset), Android (color resources) |
| Modos soportados | Light only / light + dark / +high contrast |
| Nombrado | Convención: jerárquico (`color.background.primary`) / plano (`bg-primary`) / mixto |
| Granularidad | Tokens base + tokens semánticos, solo semánticos, solo base |
| Stack engineering | Tailwind, CSS variables, SwiftUI, Compose — afecta al formato de salida |

---

## Plantilla del entregable

```markdown
---
type: "design-tokens"
category: "color | spacing | typography | radius | shadow | motion"
ds_version: "<vX.Y.Z>"
status: "draft | approved | in-use | deprecated"
date: "YYYY-MM-DD"
owner: "<DS lead>"
platforms: ["web", "ios", "android"]
modes: ["light", "dark"]
naming_convention: "<jerárquico | plano | mixto>"
---

# Design Tokens — <Categoría> · DS v<X.Y.Z>

## 0. Resumen

> 3-5 líneas: alcance del set, principios de naming, decisiones de modos.

**Cambios respecto a la versión anterior:** <si aplica>

---

## 1. Principios de naming

- **Nivel 1 — Base / Primitives:** valores absolutos sin propósito (ej. `color.blue.500`, `space.4`, `radius.8`).
- **Nivel 2 — Semantic:** mapean propósito a primitive (ej. `color.background.canvas`, `space.layout.gap`, `radius.button`).
- **Componentes consumen semánticos** salvo casos justificados.

**Reglas:**
- kebab-case o dot-case según convención adoptada y consistente.
- Nunca mezclar idiomas dentro del nombre.
- Evitar nombres descriptivos del valor (`color.gray-light`); preferir semánticos (`color.text.subtle`).

---

## 2. Tokens base / Primitives

> Valores absolutos. La fuente de verdad numérica.

### 2.1 *(Si categoría = color)* Paleta base

| Token | Valor (hex) | Notas |
|---|---|---|
| `color.blue.50` | `#EBF4FF` | |
| `color.blue.100` | `#D6E8FF` | |
| `color.blue.500` | `#2563EB` | Brand primary |
| `color.blue.900` | `#10256B` | |
| `color.neutral.0` | `#FFFFFF` | |
| `color.neutral.50` | `#F8FAFC` | |
| ... | | |

### 2.2 *(Si categoría = spacing)* Escala

| Token | Valor (px) | Uso típico |
|---|---|---|
| `space.0` | `0` | Reset |
| `space.1` | `4` | Fine adjustments |
| `space.2` | `8` | Inline gaps |
| `space.3` | `12` | Component padding sm |
| `space.4` | `16` | Component padding md |
| `space.5` | `24` | Section gap sm |
| `space.6` | `32` | Section gap md |
| `space.8` | `48` | Section gap lg |
| `space.10` | `64` | Layout regions |

### 2.3 *(Si categoría = typography)* Escala

| Token | Family | Weight | Size (px) | Line height | Letter spacing |
|---|---|---|---|---|---|
| `typography.display.lg` | <font> | 700 | 56 | 1.1 | -0.5 |
| `typography.display.md` | <font> | 700 | 44 | 1.15 | -0.4 |
| `typography.headline.lg` | <font> | 600 | 32 | 1.2 | -0.2 |
| `typography.title.md` | <font> | 600 | 20 | 1.3 | 0 |
| `typography.body.md` | <font> | 400 | 16 | 1.5 | 0 |
| `typography.body.sm` | <font> | 400 | 14 | 1.5 | 0 |
| `typography.label.sm` | <font> | 500 | 12 | 1.4 | 0.2 |

### 2.4 *(Si categoría = radius)* Escala

| Token | Valor (px) |
|---|---|
| `radius.none` | `0` |
| `radius.sm` | `4` |
| `radius.md` | `8` |
| `radius.lg` | `12` |
| `radius.xl` | `20` |
| `radius.full` | `9999` |

### 2.5 *(Si categoría = shadow)* Elevación

| Token | Valor CSS / equivalente |
|---|---|
| `shadow.0` | `none` |
| `shadow.1` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow.2` | `0 2px 4px rgba(0,0,0,0.08)` |
| `shadow.3` | `0 4px 8px rgba(0,0,0,0.1)` |
| `shadow.4` | `0 8px 16px rgba(0,0,0,0.12)` |
| `shadow.5` | `0 16px 32px rgba(0,0,0,0.16)` |

### 2.6 *(Si categoría = motion)* Duración y easing

| Token | Valor |
|---|---|
| `motion.duration.instant` | `0ms` |
| `motion.duration.fast` | `150ms` |
| `motion.duration.medium` | `250ms` |
| `motion.duration.slow` | `400ms` |
| `motion.easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `motion.easing.accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |
| `motion.easing.decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |

---

## 3. Tokens semánticos

> Mapean propósito a base. Lo que típicamente consumen los componentes.

### Light mode

| Token semántico | → Base | Uso |
|---|---|---|
| `color.background.canvas` | `color.neutral.0` | Fondo principal de la app |
| `color.background.surface` | `color.neutral.50` | Tarjetas, paneles |
| `color.background.muted` | `color.neutral.100` | Fondo secundario |
| `color.text.primary` | `color.neutral.900` | Texto principal |
| `color.text.secondary` | `color.neutral.600` | Texto secundario |
| `color.text.subtle` | `color.neutral.400` | Texto terciario / placeholders |
| `color.text.inverse` | `color.neutral.0` | Texto sobre fondos oscuros |
| `color.border.default` | `color.neutral.200` | Bordes neutros |
| `color.border.strong` | `color.neutral.400` | Bordes énfasis |
| `color.action.primary.bg` | `color.blue.500` | Botón primario fondo |
| `color.action.primary.text` | `color.neutral.0` | Botón primario texto |
| `color.action.primary.bg-hover` | `color.blue.600` | Hover botón primario |
| `color.status.success` | `color.green.500` | Mensajes positivos |
| `color.status.warning` | `color.amber.500` | Mensajes de aviso |
| `color.status.danger` | `color.red.500` | Mensajes de error |
| ... | | |

### Dark mode *(si aplica)*

| Token semántico | → Base | Uso |
|---|---|---|
| `color.background.canvas` | `color.neutral.950` | |
| `color.text.primary` | `color.neutral.50` | |
| ... | | |

> Para spacing/typography/radius/shadow/motion, los tokens semánticos pueden ser opcionales o más simples. Adaptar la tabla a la categoría.

---

## 4. Reglas de uso

- Los componentes del DS y las specs de UI **consumen tokens semánticos** salvo justificación documentada.
- Cualquier color/spacing/typography fuera del set requiere proponer un token nuevo, no hardcodear.
- Tokens deprecated **no se eliminan** hasta cumplir el plazo de la política de versioning (ver sección 6).

## 5. Adopción por plataforma

> Cómo se consumen los tokens en cada plataforma soportada.

### Web (CSS variables / Tailwind / etc.)

```css
:root {
  --color-action-primary-bg: #2563EB;
  --color-action-primary-text: #FFFFFF;
  --space-4: 16px;
  --radius-md: 8px;
  ...
}
```

### iOS (SwiftUI / UIKit)

```swift
extension Color {
  static let actionPrimaryBg = Color("ActionPrimaryBg") // del Asset Catalog
}
```

### Android (Compose / XML)

```kotlin
val ActionPrimaryBg = Color(0xFF2563EB)
```

> El formato exacto depende del stack del proyecto. Engineering implementa la traducción; design garantiza el set canónico.

---

## 6. Versioning y deprecation

- **MAJOR:** breaking change (renombrar token, eliminar, cambiar significado semántico).
- **MINOR:** adición compatible (nuevos tokens, nuevos modos).
- **PATCH:** ajustes de valor sin cambio semántico (corrección de color por accesibilidad, ajuste fino de spacing).

**Política de deprecation:**
- Token deprecated → marcar `status: deprecated` en el changelog del DS.
- Plazo mínimo antes de eliminar: <X meses / Y releases>.
- Comunicar a engineering en el release notes del DS.

## 7. Histórico de cambios *(este set)*

| Versión | Fecha | Cambios |
|---|---|---|
| <X.Y.Z> | <YYYY-MM-DD> | <cambios principales> |
| <X.Y-1.Z> | <YYYY-MM-DD> | <...> |

## 8. Anexos

- Tabla maestra de contraste WCAG entre tokens (recomendable para color):

| Foreground | Background | Ratio | WCAG |
|---|---|---|---|
| `color.text.primary` | `color.background.canvas` | 19.6:1 | AAA |
| `color.text.secondary` | `color.background.canvas` | 7.2:1 | AAA |
| `color.text.subtle` | `color.background.canvas` | 3.6:1 | AA Large only |
| `color.action.primary.text` | `color.action.primary.bg` | 4.8:1 | AA |
| ... | | | |

- **JSON / export para engineering:** <link al fichero `.json` o equivalente>.
```

---

## Proceso

1. **Recopilar** la información mínima. Sin categoría, brand de referencia y stack engineering, el set será genérico.
2. **Decidir granularidad:** base + semántico es el camino recomendado para color; para spacing puede bastar con base; para typography conviene una escala bien acotada.
3. **Construir base primero, semántico después.** Si saltas al revés, los tokens semánticos quedan acoplados a valores absolutos sin base reutilizable.
4. **Validar contraste WCAG** para tokens de color que se usan como texto sobre background. Sección 8 lo hace explícito.
5. **Light + dark si el producto lo soporta.** Los tokens semánticos cambian de mapping según modo; los base permanecen.
6. **Definir la traducción por plataforma.** Engineering ejecuta; design la canoniza.
7. **Versionar:** si es primer set, `0.1.0`. Si evoluciona, decidir bump según semver del DS.
8. **Marcar `[ENGINEERING REVIEW]`** lo que requiere validación de implementación, `[BRAND ALIGN]` lo que necesita ratificar con marketing, `[A11Y CHECK]` los pares foreground/background que requieren auditoría formal.
9. **Guardar** en `<proyecto>/design/design-system/tokens/<categoría>.md`. Si engineering necesita el `.json`, generarlo en paralelo en la misma carpeta.
10. **Reportar** al usuario:
    - Ruta del archivo.
    - Resumen: categoría, número de tokens base y semánticos, modos soportados.
    - Items pendientes (`[A11Y CHECK]`, `[BRAND ALIGN]`, `[ENGINEERING REVIEW]`).
    - Próximo paso: validar contraste con `design-accessibility`, comunicar a engineering, actualizar componentes que consumen tokens deprecados.

---

## Restricciones

- **No introduzcas valores ad-hoc.** Cada decisión visual va por token. Si el valor que necesitas no existe, propón el token.
- **No mezcles base con semántico** en el mismo nivel. Son capas distintas.
- **No omitas validación de contraste** para color cuando los tokens se usan como texto.
- **No prometas dark mode sin haberlo modelado.** Solo declarar soportado lo que está realmente diseñado.
- **No deprezacar sin plazo.** Tokens deprecated tienen ventana de migración explícita.
- **No copies tokens de otro design system** (Material, Carbon, Polaris) sin adaptarlos al brand. Inspirarse, sí; clonar, no.
- **No publiques set sin owner y versión** en el header.
- Aplican las reglas de output de `_shared/output-rules.md`.
