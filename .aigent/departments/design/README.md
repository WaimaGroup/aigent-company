# Design — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Design.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`design-orchestrator.md`](./design-orchestrator.md).

> **Primera petición del dept confirma:** plataformas objetivo (web/iOS/Android/responsive), brand de referencia (coordinación con marketing si existe), nivel WCAG objetivo (AA por defecto) e idioma(s) de interfaz.
>
> **Frontera con product:** `product-discovery` investiga *qué problema resolver*; `design-ux-research` investiga *qué tan bien se resuelve con la interfaz*. Ambos coexisten sin pisarse.

---

## Índice

- [Cómo se invoca](#cómo-se-invoca)
- [Agentes](#agentes)
  - [design-ui — UI Design](#design-ui--ui-design)
  - [design-ux-research — UX Research](#design-ux-research--ux-research)
  - [design-design-system — Design System](#design-design-system--design-system)
  - [design-accessibility — Accessibility](#design-accessibility--accessibility)
- [Skills](#skills)
  - [ui-component-spec — Spec UI para handoff](#ui-component-spec--spec-ui-para-handoff)
  - [design-token-set — Set de design tokens multi-plataforma](#design-token-set--set-de-design-tokens-multi-plataforma)
  - [accessibility-audit — Audit WCAG 2.2 con tabla SC](#accessibility-audit--audit-wcag-22-con-tabla-sc)
  - [usability-test-plan — Plan completo de usability test](#usability-test-plan--plan-completo-de-usability-test)
  - [design-handoff-checklist — Checklist pre-handoff a engineering](#design-handoff-checklist--checklist-pre-handoff-a-engineering)
  - [ds-component-doc — Documentación canónica de componente del DS](#ds-component-doc--documentación-canónica-de-componente-del-ds)
- [Skills compartidas usadas en este dept](#skills-compartidas-usadas-en-este-dept)
- [Flujo end-to-end típico](#flujo-end-to-end-típico)

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): `design-orchestrator` enruta a UI / UX research / DS / accesibilidad.
2. **Directo a agente** cuando ya sabes (ej. "audit a11y" → `design-accessibility`).
3. **Skill directa** para outputs concretos (token set, audit, handoff checklist).

---

## Agentes

### `design-ui` — UI Design

Layouts, mockups, prototipos, specs de pantallas/componentes para handoff con estados completos + responsive.

**Caso de uso:** spec de componente para handoff.

**Prompt:**
> "Spec de componente Button para handoff a engineering. Necesitamos los 3 variants (primary, secondary, ghost), 4 sizes (xs, sm, md, lg), todos los estados (default, hover, focus, active, disabled, loading), responsive y accesible AA."

**Output esperado:**
- Ruta: `<proyecto>/design/ui-component-specs/button-spec.md`
- Estructura:
  ```markdown
  # UI Component Spec — Button

  - Componente: Button
  - Versión: 1.0
  - Plataformas: Web (React + native iOS/Android via DS futuro)
  - WCAG target: AA
  - Figma link: [adjunto]

  ## Anatomía
  ```
  ┌────────────────────────────────┐
  │ [icon-left] · Label · [icon-r] │
  └────────────────────────────────┘
  ```
  - Icon-left (opcional, lucide-react)
  - Label (siempre presente)
  - Icon-right (opcional)
  - Loading spinner (sustituye Label cuando loading=true)

  ## Variants
  | Variant | Background | Text | Border |
  | primary | brand-500 | white | none |
  | secondary | white | brand-700 | brand-300 |
  | ghost | transparent | brand-700 | none |
  | danger | red-500 | white | none |

  ## Sizes
  | Size | Height | Padding X | Font | Icon size |
  | xs | 24px | 8px | 12/16 | 12px |
  | sm | 32px | 12px | 14/20 | 16px |
  | md | 40px | 16px | 16/24 | 16px |
  | lg | 48px | 20px | 18/28 | 20px |

  ## Estados (8 mínimos por variant × size)
  - **Default:** estado base
  - **Hover:** background -8% lightness (primary), border accent (secondary)
  - **Focus:** outline 2px brand-300 offset 2px
  - **Active:** background -16% lightness
  - **Disabled:** opacity 50%, cursor not-allowed
  - **Loading:** spinner sustituye label, deshabilitar interacciones
  - **Focus-visible:** solo cuando keyboard focus (no mouse)
  - **Selected** (toggle variant): background invertido

  ## Tokens consumidos
  - color.background.brand.{primary, hover, active}
  - color.text.{onBrand, brand}
  - spacing.{xs, sm, md, lg}
  - radius.{sm, md}
  - shadow.{focus}
  - motion.{duration.fast, easing.standard}

  ## Responsive
  - Mobile (< 768px): default size sm
  - Tablet+: default size md
  - Full-width: prop `block` ocupa 100% del contenedor

  ## Accesibilidad (WCAG 2.2 AA)
  - Contraste AA en todos los variants × estados
  - Focus visible no se elimina (outline o equivalente)
  - aria-disabled cuando disabled=true (no solo disabled prop)
  - Loading state anuncia "Loading" a screen readers (aria-busy)
  - Hit target mínimo 44×44 en mobile (size md cumple, sm no — usar md en mobile)

  ## Edge cases
  - Label muy largo: truncate con tooltip
  - Icon only: aria-label obligatorio
  - Disabled + loading: error, no permitir combinación

  ## Criterios de aceptación
  - [ ] Render correcto de todos los variants × sizes × estados
  - [ ] Keyboard navigation funcional (Tab, Enter, Space)
  - [ ] Contraste AA verificado en herramienta automática
  - [ ] Screen reader anuncia estado loading
  - [ ] Documentación en Storybook
  ```

---

### `design-ux-research` — UX Research

Usability testing, heuristic evaluation, journey mapping, friction analysis, card sorting, tree testing.

**Caso de uso:** plan de usability test.

**Prompt:**
> "Necesito plan de usability test para el nuevo flow de onboarding (4 pasos). Hipótesis: el paso 3 (conexión bancaria) genera abandono. Tenemos prototipo en Figma."

**Output esperado:**
- Ruta: `<proyecto>/design/ux-research/usability-test-plan-onboarding-v2.md`
- Estructura:
  ```markdown
  # Usability Test Plan — Onboarding v2

  ## Hipótesis
  - **Primaria:** el paso 3 (conexión bancaria) genera abandono porque
    no comunicamos qué pasa con las credenciales.
  - **Secundaria:** el flow se entiende como guiado (paso 1→2→3→4)
    sin necesidad de tooltips.

  ## Tareas (objetivos del usuario, no instrucciones)
  1. **T1:** "Acabas de registrarte. Configura tu primera cuenta para
     poder ver tu finanzas en el dashboard."
  2. **T2:** "Necesitas que aigent vea tus extractos bancarios para
     conciliar pagos. Conecta tu banco principal."
  3. **T3:** "Asegúrate de que vuestro equipo verá lo mismo que tú."
  4. **T4:** "Verifica que todo está conectado y entra al dashboard."

  ## Métricas
  - Task completion rate por tarea
  - Time on task (mediana)
  - SUS score post-test
  - Heatmap de clics
  - Quotes verbatim con código por tarea

  ## Participantes
  - N: 8 (suficiente para detectar el 80% de los problemas mayores)
  - Perfil: heads of finance de empresas SaaS B2B 50-300 empleados
  - Screener:
    - Sí: rol decisor de software de finanzas
    - Sí: empresa 50-300 empleados
    - Sí: usado al menos 1 SaaS de finanzas en últimos 12 meses
    - No: trabajado en empresas de SaaS finance (sesgo)

  ## Logística
  - Modalidad: remoto unmoderated en plataforma Maze
  - Duración estimada: 12-15 min
  - Incentive: 50€ Amazon gift card
  - Fechas: 2026-05-20 a 2026-05-27

  ## Script de sesión
  Bienvenida 30s → contexto del producto 1min → 4 tareas → SUS post →
  3 preguntas abiertas (qué les frustró, qué les gustó, qué cambiarían).

  ## SUS — System Usability Scale (10 preguntas Likert post-test)
  Estándar 10 ítems.

  ## Debrief en caliente (script para llamada post-sesión 30 min con 2 participantes)
  - "¿Hubo algún momento donde te sentiste perdido?"
  - "Si tuvieras que recomendar Aigent a un colega, ¿qué le dirías?"

  ## Síntesis
  Por hallazgo: descripción + severidad (Critical/Major/Minor/Cosmetic)
  + nº participantes afectados + recomendación.
  ```

---

### `design-design-system` — Design System

Design tokens, foundations, componentes con guidelines, versionado serio con deprecations.

**Caso de uso:** set de tokens del DS.

**Prompt:**
> "Set inicial de design tokens del DS. Color (base + semánticos light/dark), spacing, typography, radius, shadow, motion. Multi-plataforma (web + futuro mobile)."

**Output esperado:**
- Ruta: `<proyecto>/design/design-system/tokens-v1.md`
- Estructura:
  ```markdown
  # Design Tokens — v1.0

  - Plataformas: Web, iOS, Android
  - Tema soportado: Light, Dark
  - Versionado: semver. Deprecations 6 meses antes de remove.

  ## Color base (no usar directamente en componentes)
  | Token | Light | Dark |
  | color.base.brand.500 | #5B47FB | #7B6CFF |
  | color.base.gray.50 | #FAFAFA | #18181B |
  | color.base.gray.900 | #18181B | #FAFAFA |
  ...

  ## Color semánticos (usar estos en componentes)
  | Token | Light | Dark | Uso |
  | color.text.primary | gray.900 | gray.50 | Texto principal |
  | color.text.secondary | gray.600 | gray.400 | Texto secundario |
  | color.text.onBrand | white | white | Texto sobre brand |
  | color.background.surface | white | gray.900 | Fondo de superficies |
  | color.background.brand.primary | brand.500 | brand.500 | CTA primario |
  | color.border.subtle | gray.200 | gray.700 | Bordes sutiles |
  ...

  ## Contraste WCAG (tabla obligatoria)
  | Combinación | Light | Dark | Status |
  | text.primary on bg.surface | 16.1:1 | 15.8:1 | AAA |
  | text.secondary on bg.surface | 7.4:1 | 7.1:1 | AAA |
  | text.onBrand on bg.brand.primary | 4.6:1 | 4.6:1 | AA |

  ## Spacing
  | Token | Value |
  | spacing.0 | 0px |
  | spacing.xs | 4px |
  | spacing.sm | 8px |
  | spacing.md | 16px |
  | spacing.lg | 24px |
  | spacing.xl | 32px |
  | spacing.2xl | 48px |

  ## Typography
  | Token | Font | Size | Line | Weight |
  | text.display | Inter | 48 | 56 | 700 |
  | text.heading1 | Inter | 32 | 40 | 700 |
  | text.heading2 | Inter | 24 | 32 | 600 |
  | text.body | Inter | 16 | 24 | 400 |
  | text.caption | Inter | 14 | 20 | 400 |

  ## Radius
  | Token | Value |
  | radius.sm | 4px |
  | radius.md | 8px |
  | radius.lg | 16px |
  | radius.full | 9999px |

  ## Shadow
  | Token | Value |
  | shadow.sm | 0 1px 2px rgba(0,0,0,0.05) |
  | shadow.md | 0 4px 6px rgba(0,0,0,0.1) |
  | shadow.lg | 0 10px 15px rgba(0,0,0,0.1) |
  | shadow.focus | 0 0 0 4px rgba(91,71,251,0.3) |

  ## Motion
  | Token | Value |
  | motion.duration.fast | 100ms |
  | motion.duration.standard | 200ms |
  | motion.duration.slow | 400ms |
  | motion.easing.standard | cubic-bezier(0.4, 0, 0.2, 1) |
  | motion.easing.entrance | cubic-bezier(0, 0, 0.2, 1) |
  | motion.easing.exit | cubic-bezier(0.4, 0, 1, 1) |

  ## Output multi-plataforma
  - Web: CSS variables + Tailwind config
  - iOS: Swift constants
  - Android: Compose values
  - Figma: variables sincronizadas

  ## Política de deprecación
  - Anuncio de deprecation: minor version (X.Y.0+1)
  - Mantenimiento: 6 meses post-deprecation
  - Remove: major version siguiente con migration guide
  ```

---

### `design-accessibility` — Accessibility

Audits WCAG 2.2 AA por defecto, ARIA, keyboard, screen readers, contraste, focus management, remediation plans.

**Caso de uso:** audit completo de pantalla crítica.

**Prompt:**
> "Audit WCAG 2.2 AA de la pantalla de checkout. Incluye automated checks + manual review (keyboard, screen reader). Plan de remediation."

**Output esperado:**
- Ruta: `<proyecto>/design/accessibility/audit-checkout-2026-05.md`
- Estructura:
  ```markdown
  # Accessibility Audit — Checkout · WCAG 2.2 AA

  ## Scope
  Pantalla `/checkout` end-to-end (selección plan → datos billing → pago → confirmación).
  Tamaños testeados: mobile 375px, tablet 768px, desktop 1280px.

  ## Metodología
  - Automated: axe-core, Lighthouse, WAVE.
  - Manual: navegación con teclado, screen reader (VoiceOver macOS, NVDA Windows).
  - Tooling: keyboard-only walkthrough, contrast checker manual para texto sobre imágenes.

  ## Tabla de SC (Success Criteria)

  | SC | Nivel | Estado | Notas |
  | 1.1.1 Non-text Content | A | Pass | Alt text en todas las imágenes |
  | 1.3.1 Info and Relationships | A | Partial | Headings inconsistentes en step 2 |
  | 1.4.3 Contrast (Minimum) | AA | Fail | 3 elementos < 4.5:1 |
  | 1.4.11 Non-text Contrast | AA | Pass | Bordes inputs OK |
  | 2.1.1 Keyboard | A | Fail | Modal de cupón no cierra con Esc |
  | 2.4.3 Focus Order | A | Pass | Orden lógico |
  | 2.4.7 Focus Visible | AA | Partial | Focus invisible en botón ghost en dark mode |
  | 3.3.1 Error Identification | A | Pass | Errors anunciados a SR |
  | 3.3.3 Error Suggestion | AA | Partial | Validación numero tarjeta sin sugerencia |
  | 4.1.2 Name, Role, Value | A | Fail | Combobox custom sin aria-* completo |

  ## Hallazgos por severidad

  ### 🔴 Critical (3)
  1. **1.4.3 Contrast** — Texto del placeholder de inputs (#999) sobre
     fondo (#FFF) → 2.8:1. Categoría: **engineering fix** (token semántico).
  2. **2.1.1 Keyboard** — Modal de cupón se abre con click, no cierra
     con Escape. Trap focus inexistente. Categoría: **engineering fix**.
  3. **4.1.2 Name, Role, Value** — Combobox de país tiene role=button
     en el trigger; falta aria-expanded, aria-controls, aria-activedescendant.
     Categoría: **engineering fix**.

  ### 🟠 Major (4)
  4. **1.3.1** — Step 2 usa `<div class="h2">` en lugar de `<h2>`.
     Categoría: **engineering fix**.
  5. **2.4.7** — Focus invisible en botón ghost en dark mode (border 1px
     gray-700 sobre bg gray-900). Categoría: **DS fix** (revisar token).
  6. **3.3.3** — Validación numero tarjeta dice "inválido" sin decir qué.
     Categoría: **engineering fix**.
  7. **Touch target mobile** — botón "Aplicar cupón" 32x24px (target 44x44).
     Categoría: **engineering fix**.

  ### 🟡 Minor (2)
  8. Iconos decorativos sin aria-hidden="true". Categoría: engineering.
  9. Tabindex=0 en `<a>` redundante. Categoría: engineering.

  ### 🔵 Nit (1)
  10. Texto "*" para campos requeridos sin texto adicional "(required)".
      Categoría: engineering.

  ## Score por nivel
  - WCAG 2.2 A: 12/15 SC pass (3 fail) → **Fail**
  - WCAG 2.2 AA: 8/13 SC pass (3 fail + 2 partial) → **Fail**

  ## Casos edge identificados
  - Usuario con TalkBack pierde contexto al cambiar de step (no anuncia)
  - Zoom 200% rompe layout del summary panel (overflow horizontal)
  - High contrast mode Windows no respetado en botones (color forzado)

  ## Remediation plan

  ### Sprint 1 (2 semanas)
  - 🔴 #1, #2, #3
  - 🟠 #4

  ### Sprint 2 (2 semanas)
  - 🟠 #5 (coordinación con DS), #6, #7

  ### Sprint 3
  - 🟡 #8, #9
  - 🔵 #10
  - Edge cases zoom 200% + high contrast

  ## Re-audit
  Post-sprint 2 con foco en SCs que estaban Fail. Si pasa, certificar AA.
  ```

---

## Skills

### `ui-component-spec` — Spec UI para handoff

Anatomía, props/variantes, estados completos, responsive, tokens, AC.

Ver ejemplo en agente `design-ui` arriba.

---

### `design-token-set` — Set de design tokens multi-plataforma

Color/spacing/typography/radius/shadow/motion + tabla contraste WCAG.

Ver ejemplo en agente `design-design-system` arriba.

---

### `accessibility-audit` — Audit WCAG 2.2 con tabla SC

Hallazgos por severidad, casos edge, score, remediation plan.

Ver ejemplo en agente `design-accessibility` arriba.

---

### `usability-test-plan` — Plan completo de usability test

Hipótesis, tasks como objetivos del usuario, N participantes, screener, SUS, debrief.

Ver ejemplo en agente `design-ux-research` arriba.

---

### `design-handoff-checklist` — Checklist pre-handoff a engineering

Tokens, estados, responsive, edge cases, accesibilidad, Figma link, AC, sign-off.

**Caso de uso:** validar handoff antes de pasarlo a engineering.

**Prompt:**
> "Aplica design-handoff-checklist a la feature de export CSV. Lo tengo listo en Figma y voy a pasarlo mañana al equipo de eng."

**Output esperado:**
- Ruta: `<proyecto>/design/ui-component-specs/handoff-checklist-export-csv.md`
- Estructura:
  ```markdown
  # Design Handoff Checklist — Export CSV feature

  - Designer: Marta
  - Eng owner: Carlos (Backend) + Lia (Frontend)
  - Figma: [link]
  - Fecha planeada handoff: 2026-05-15

  ## Visual y layout
  - [x] Frames en Figma agrupados por estado y por viewport (mobile/tablet/desktop)
  - [x] Componentes existentes del DS reutilizados (no duplicados)
  - [x] Naming de capas claro y consistente

  ## Tokens consumidos
  - [x] Solo tokens del DS, sin colores hardcoded
  - [x] Spacing del scale (no valores arbitrarios)
  - [x] Typography del scale
  - [x] Radius/shadow/motion del scale

  ## Estados (8 mínimos por elemento interactivo)
  - [x] Default
  - [x] Hover
  - [x] Focus (con outline visible)
  - [x] Active
  - [x] Disabled
  - [x] Loading (cuando aplica)
  - [x] Selected (cuando aplica)
  - [x] Error (cuando aplica)

  ## Responsive
  - [x] Mobile 375px diseñado
  - [x] Tablet 768px diseñado
  - [x] Desktop 1280px diseñado
  - [x] Comportamiento entre breakpoints clarificado

  ## Edge cases
  - [x] Listado vacío
  - [x] Loading state inicial
  - [x] Error state (API caída)
  - [x] Tamaño grande (>10k filas) — UX de email diferido
  - [x] Permisos insuficientes — mensaje claro

  ## Accesibilidad mínima
  - [x] Contraste AA verificado en todos los estados
  - [x] Hit target mínimo 44×44 en mobile
  - [x] Focus visible en todos los elementos interactivos
  - [x] aria-labels documentados para iconos solos

  ## Assets
  - [x] Iconos exportados SVG en la library Figma
  - [x] Imágenes en 1x, 2x, 3x donde aplique

  ## Acceptance criteria
  - [x] AC listados en el frame de handoff
  - [x] Cada AC verificable (no "rápido", "intuitivo")

  ## Sign-off
  - [x] Designer review (Marta — 2026-05-14)
  - [x] DS guardian review (David — 2026-05-14)
  - [ ] Eng acceptance — pendiente Carlos + Lia (kickoff 2026-05-15)
  ```

---

### `ds-component-doc` — Documentación canónica de componente del DS

Anatomía, variantes, props/API multi-plataforma, do/don't, audit a11y, tokens, versionado.

**Caso de uso:** doc canónica del componente Modal.

**Prompt:**
> "Doc canónica del componente Modal del DS. Plataformas: Web (React). Versiones API documentadas. Do/don't con ejemplos."

**Output esperado:**
- Ruta: `<proyecto>/design/design-system/components/modal.md`
- Estructura:
  ```markdown
  # Modal — Design System Component

  - Versión: 2.1.0
  - Estado: Stable
  - Plataformas: Web (React)
  - Última actualización: 2026-05-14

  ## Anatomía
  ```
  ┌───────────────────────────────────┐
  │ [icon-leading] · Title  · [close]│ ← Header
  ├───────────────────────────────────┤
  │                                   │
  │ Content                           │ ← Body
  │                                   │
  ├───────────────────────────────────┤
  │              [cancel] [confirm]   │ ← Footer
  └───────────────────────────────────┘
                Backdrop
  ```

  ## Variantes
  - **default:** modal estándar centrado
  - **drawer-right:** desliza desde la derecha
  - **drawer-bottom:** desliza desde abajo (mobile-first)
  - **dialog:** modal compacto para confirmaciones

  ## Props / API (React)
  ```ts
  type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'drawer-right' | 'drawer-bottom' | 'dialog';
    children: React.ReactNode;
    footer?: React.ReactNode;
    closeOnBackdropClick?: boolean; // default true
    closeOnEsc?: boolean; // default true
    initialFocus?: React.RefObject<HTMLElement>;
  };
  ```

  ## Estados
  | Estado | Descripción |
  | open | Modal visible con focus trap activo |
  | closed | Modal hidden, sin focus trap |
  | opening | Transición entrada (200ms) |
  | closing | Transición salida (200ms) |

  ## Do / Don't

  ### ✅ Do
  - Usar Modal solo para tareas que requieren atención focal
  - Cerrar con Esc, click en backdrop o botón close
  - Mantener title corto y descriptivo
  - Atrapar focus dentro del modal

  ### ❌ Don't
  - Anidar modals (usar drawer secuencial en su lugar)
  - Cargar contenido lento sin loading state
  - Usar para notificaciones pasivas (usar Toast)
  - Bloquear backdrop click sin razón fuerte (UX hostil)

  ## Audit a11y formal
  - Focus trap implementado y testeado
  - Escape cierra (cumplible solo si closeOnEsc=true)
  - aria-labelledby apunta al título
  - aria-describedby opcional para descripción
  - role="dialog" + aria-modal="true"
  - Initial focus en el primer elemento focusable del modal o ref pasada
  - Return focus al elemento que abrió el modal al cerrar
  - Screen reader anuncia el modal al abrir

  ## Tokens consumidos
  - color.background.surface
  - color.background.backdrop (rgba(0,0,0,0.6))
  - spacing.{md, lg, xl}
  - radius.lg
  - shadow.xl
  - motion.duration.standard (200ms)
  - motion.easing.standard

  ## Versionado y deprecations
  - 1.0.0 → 2.0.0: prop `onOpen` removida (era no-op). Migration: eliminar.
  - 2.0.0 → 2.1.0: nuevo prop `initialFocus`. Backward compatible.
  - Próximo: 3.0.0 (Q4 2026) — añadir variants nuevas. No breaking.
  ```

---

## Skills compartidas usadas en este dept

- `journey-map` (shared) — Customer journeys en UX research. Consumida por `design-ux-research`.

Ver ejemplos en [`_shared/README.md`](../_shared/README.md).

---

## Flujo end-to-end típico

```
Nueva feature visual:
1. design-ux-research → usability-test-plan + journey-map (si discovery)
2. design-ui          → ui-component-spec de componentes nuevos
3. design-design-system → ds-component-doc si componente entra al DS
4. design-accessibility → accessibility-audit del flow completo
5. design-ui          → design-handoff-checklist antes de pasar a eng

Actualización del Design System:
1. design-design-system → design-token-set revisado
2. design-design-system → ds-component-doc actualizada (semver)
3. design-accessibility → audit del componente actualizado
```
