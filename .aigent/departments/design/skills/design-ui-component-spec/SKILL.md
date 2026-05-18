---
name: "design-ui-component-spec"
user-invocable: true
description: >
  Skill for producing a UI specification (component or screen) ready for
  engineering handoff: anatomy, props/variants, complete states, responsive
  behavior, design tokens consumed, accessibility notes, and acceptance criteria.
  Design-system-aware.
---

# Skill: UI Component Spec

**Entregable:** archivo `.md` con la spec lista para handoff a engineering, guardado en `<proyecto>/design/ui/components/<componente-slug>.md` (componente) o `<proyecto>/design/ui/screens/<flow>/<pantalla-slug>.md` (pantalla).

---

## Cuándo usar esta skill

- Hay que especificar un componente individual (button, input, modal, table row…) para handoff.
- Hay que especificar una pantalla concreta con sus componentes, estados y comportamiento.
- Hay que documentar variantes A/B con la misma estructura para testing.

**Cuándo NO usar:**

- Para documentar un componente que entra al **design system** oficial (eso es `design-design-system` + skill `design-token-set` o documentación canónica del DS — más exhaustiva, con guidelines de uso, do/don't, audit a11y formal).
- Para un mockup visual sin specs estructurales (eso vive en Figma, esta skill produce el documento de soporte al frame).
- Para un prototipo interactivo (eso es un link a Figma + notas, no la spec completa).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Scope | ¿Componente individual o pantalla? Nombre concreto |
| Objetivo / propósito | Qué tiene que hacer el usuario al ver/usar esto |
| Plataforma(s) | Web responsive / iOS / Android / desktop |
| Design system | ¿Existe DS vigente? ¿Qué componentes/tokens usa? |
| Estados a cubrir | Default es obligatorio. ¿Cuáles otros? (hover, focus, active, disabled, loading, error, empty, selected) |
| Responsive | Breakpoints relevantes y cómo cambia |
| Variantes | ¿Hay variantes (size, color/theme, density) o es una sola spec? |
| Datos | ¿Qué datos consume? (mínimo, máximo, longitud, formato) |
| Edge cases | ¿Qué hace con texto largo, datos vacíos, errores de red, permisos? |
| Figma link | URL al frame en Figma (si existe) |
| Accesibilidad | ¿Hay decisiones particulares (modal, autocomplete, table) que requieran patrón a11y específico? |

---

## Plantilla del entregable

```markdown
---
type: "ui-spec"
spec_type: "component | screen"
name: "<Nombre humano>"
platform: ["web", "ios", "android"]
status: "draft | ready-for-handoff | in-build | shipped"
date: "YYYY-MM-DD"
owner: "<diseñador>"
figma_link: "<URL al frame>"
design_system_version: "<vX.Y.Z si aplica>"
related_screens: ["<otras specs relacionadas>"]
---

# Spec: <Nombre> · <component | screen>

## 0. Objetivo

> 1-2 líneas. Qué tiene que hacer el usuario al ver/usar este componente o pantalla.

---

## 1. Anatomía

> Para componente: las partes visuales (label, icon, content, action area).
> Para pantalla: las regiones (header, primary content, secondary, footer).

```
[Diagrama ASCII opcional o descripción textual]

┌─────────────────────────────────────┐
│  [Icon] Label                       │
│  ┌─────────────────────────────┐    │
│  │ Content area                │    │
│  └─────────────────────────────┘    │
│                       [Action]      │
└─────────────────────────────────────┘
```

- **<Parte 1>:** <descripción>
- **<Parte 2>:** <descripción>

## 2. Props / Variantes *(solo si componente)*

| Prop | Valores válidos | Default | Descripción |
|---|---|---|---|
| `size` | `sm` / `md` / `lg` | `md` | Tamaño del componente |
| `variant` | `primary` / `secondary` / `ghost` | `primary` | Estilo visual |
| `disabled` | `true` / `false` | `false` | Si está deshabilitado |
| `loading` | `true` / `false` | `false` | Si muestra spinner |
| <prop 4> | ... | ... | ... |

## 3. Estados

> Todos los estados aplicables. No omitir loading/error/empty.

### 3.1 Default
<Descripción del estado por defecto, qué se ve, qué se puede hacer.>

### 3.2 Hover *(si plataforma soporta)*
<Cambios visuales, tokens implicados.>

### 3.3 Focus
<Estilo de focus visible (no eliminar `outline` sin reemplazo). Tokens implicados.>

### 3.4 Active / Pressed
<Cambios visuales.>

### 3.5 Disabled
<Tokens de opacidad, cursor, interacción bloqueada.>

### 3.6 Loading
<Skeleton / spinner / progress, posición, blocking comportamiento.>

### 3.7 Error
<Mensaje, color, recuperación.>

### 3.8 Empty *(si pantalla / lista)*
<Mensaje, illustration, CTA primario.>

### 3.9 <Otros estados aplicables>
<...>

## 4. Comportamiento responsive

| Breakpoint | Comportamiento |
|---|---|
| Mobile (<640px) | <Descripción: layout, jerarquía, ajustes> |
| Tablet (640-1024px) | <Descripción> |
| Desktop (>1024px) | <Descripción> |

## 5. Design tokens consumidos

> Tokens del DS usados. Si una decisión requiere un valor ad-hoc, marcarla explícitamente como `[DS PENDIENTE]`.

### Color
- `<token.color.surface.primary>` — fondo principal
- `<token.color.text.primary>` — texto principal
- ...

### Spacing
- `<token.spacing.md>` — padding interno
- ...

### Typography
- `<token.typography.body.md>` — texto del contenido
- ...

### Radius / Shadow / Motion
- `<token.radius.md>` — bordes
- ...

## 6. Accesibilidad (mínima)

- **Contraste:** texto regular ≥ 4.5:1 / texto grande ≥ 3:1 / UI elements ≥ 3:1 (WCAG AA).
- **Focus visible:** outline de focus o equivalente con contraste suficiente sobre todos los backgrounds posibles.
- **Tamaño táctil:** mín. 44×44 pt (iOS) / 48×48 dp (Android) / equivalente en web.
- **Alt text:** imágenes informativas con alt descriptivo; decorativas con `alt=""`.
- **Roles ARIA:** <si aplica>.
- **Keyboard:** orden de focus razonable, todas las interacciones accesibles por teclado.
- **Screen reader:** etiquetas significativas; anuncio de cambios de estado (loading → success / error).

> Para audit formal pre-handoff coordinar con `design-accessibility` (skill `accessibility-audit`).

## 7. Edge cases

| Caso | Comportamiento esperado |
|---|---|
| Texto muy largo | <Truncación con ellipsis / wrap / tooltip> |
| Datos vacíos | <Empty state (ver sección 3.8)> |
| Error de red | <Estado error + reintento> |
| Permisos insuficientes | <Estado bloqueado + mensaje> |
| <Otro caso> | <...> |

## 8. Componentes hijos / dependencias

> Si la spec usa otros componentes del DS o specs previas, listarlos aquí.

- `<componente-A>` (del DS, vX.Y)
- `<componente-B>` ([DS PENDIENTE] — propuesto a `design-design-system`)

## 9. Datos consumidos / API contract *(si aplica)*

> Forma mínima de los datos que el componente necesita. Útil para handoff a engineering.

```json
{
  "id": "string",
  "label": "string",
  "status": "active | inactive | pending",
  "count": "number"
}
```

## 10. Criterios de aceptación

- [ ] El componente respeta tokens del DS vX.Y.Z.
- [ ] Todos los estados de la sección 3 están implementados.
- [ ] El comportamiento responsive coincide con la sección 4.
- [ ] Pasa contraste WCAG AA.
- [ ] Navegable por teclado.
- [ ] Funciona con screen reader (anuncios correctos en cambios de estado).
- [ ] Tests del componente cubren los estados clave.

## 11. Notas para engineering

- <Decisiones intencionales: por qué un padding asimétrico, por qué un color custom>
- <Trade-offs aceptados>
- <Sugerencias de implementación si aplica>

## 12. Links

- **Figma:** <URL al frame>
- **Specs relacionadas:** <links a otras pantallas/componentes>
- **Research que ancla la decisión:** <link si existe>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin objetivo, plataforma y DS de referencia, parar.
2. **Validar** que el componente o pantalla no exista ya en el DS. Si existe, usar lo existente; si requiere extensión, coordinar con `design-design-system`.
3. **Definir anatomía** primero, luego variantes, luego estados — en ese orden. Saltarse al revés crea inconsistencias.
4. **Cubrir todos los estados** aplicables. Si un estado no aplica (ej. hover en mobile), marcarlo explícito en lugar de omitirlo.
5. **Mapear tokens del DS.** Cada decisión visual va con su token canónico. Cualquier valor ad-hoc `[DS PENDIENTE]` y propuesta de evolución del DS.
6. **Accesibilidad mínima desde el inicio.** Sección 6 no es opcional. Para audit formal: `design-accessibility`.
7. **Edge cases explícitos.** Sección 7 distingue una spec mediocre de una buena.
8. **Marcar `[FIGMA LINK]`** si el frame aún no está subido, `[DS PENDIENTE]` lo que extiende el DS, `[A11Y REVIEW]` lo que conviene auditar formalmente.
9. **Guardar** en `<proyecto>/design/ui/components/<slug>.md` o `<proyecto>/design/ui/screens/<flow>/<slug>.md`.
10. **Reportar** al usuario:
    - Ruta del archivo.
    - Resumen: componente/pantalla, estados cubiertos, plataforma, dependencias.
    - Items pendientes (`[DS PENDIENTE]`, `[A11Y REVIEW]`, `[FIGMA LINK]`).
    - Próximo paso: handoff a engineering, audit a11y, iteración tras research.

---

## Restricciones

- **No omitas estados.** Una spec con solo "default" es spec incompleta.
- **No introduzcas valores hardcoded.** Cada decisión visual va por token del DS (si existe) o se marca como deuda.
- **No olvides accesibilidad.** Mínimos de la sección 6 son obligatorios.
- **No saltes el design system.** Si el componente existe en el DS, úsalo. Si no encaja, propón evolución, no reemplazo silencioso.
- **No prometas píxel-perfect.** Indica intención, comportamiento y tokens. Engineering puede ajustar precisión final.
- **No copies specs de otros productos.** Tu producto tiene sus tokens, su DS, su comportamiento.
- Aplican las reglas de output de `_shared/output-rules.md`.
