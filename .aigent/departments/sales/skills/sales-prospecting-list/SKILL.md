---
name: "sales-prospecting-list"
user-invocable: true
description: >
  Skill for creating a structured prospect list based on an Ideal Customer Profile (ICP).
  Always creates a .md file with a researched table of target accounts, key contacts,
  and personalization hooks for outreach.
---

# Skill: Lista de Prospectos

**Entregable:** archivo `.md` con tabla estructurada de prospectos investigados, lista para usar en outreach

---

## Cuándo usar esta skill

Cuando el usuario necesite una lista de cuentas o contactos objetivo, ya sea para iniciar una campaña de outreach, preparar una prospección en un nuevo segmento o vertical, o construir el pipeline desde cero.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| ICP — industria | ¿A qué sector o industria nos dirigimos? |
| ICP — tamaño de empresa | ¿Cuántos empleados o qué facturación aproximada? |
| ICP — rol objetivo | ¿A quién contactamos? (cargo, área, nivel de seniority) |
| Geografía | ¿País, región o idioma objetivo? |
| Pain point principal | ¿Qué problema resuelve nuestro producto/servicio para este ICP? |
| Fuentes disponibles | ¿Tiene el usuario una lista parcial, LinkedIn Sales Navigator, o partimos de cero? |
| Número de prospectos | ¿Cuántos necesita? (orientativo) |
| Campos adicionales | ¿Necesita campos especiales? (tecnología usada, financiación, expansión reciente...) |

---

## Plantilla de entregable

```markdown
---
type: "prospecting-list"
icp: ""
vertical: ""
date_created: "YYYY-MM-DD"
total_prospects: 0
status: "draft"
---

# Lista de Prospectos — [Nombre del Segmento / Campaña]

**ICP objetivo:** [descripción de 1 línea: industria + tamaño + rol]
**Pain point hipotético:** [el problema que creemos que tienen]
**Creado:** YYYY-MM-DD

---

## Prospectos

| # | Empresa | Industria | Tamaño | Contacto | Cargo | LinkedIn | Email | Señal / Hook | Notas |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [Nombre empresa] | [Sector] | [X empleados] | [Nombre] | [Cargo] | [URL o @] | [email o [PENDIENTE]] | [noticia, evento, expansión, tech usada...] | |
| 2 | | | | | | | | | |
| ... | | | | | | | | | |

---

## Campos pendientes de verificar

- [ ] Emails marcados como `[PENDIENTE]` → verificar con herramienta de enriquecimiento (Hunter, Apollo, Lusha)
- [ ] Señales marcadas como `[POR VERIFICAR]` → contrastar antes de mencionar en el mensaje
- [ ] Contactos sin LinkedIn → buscar manualmente

---

## Notas de segmentación

[Observaciones sobre el segmento: patrones comunes encontrados, señales de timing, empresas a priorizar y por qué]

---

## Siguiente paso

Usar la skill `outreach-sequence` para crear una secuencia de mensajes personalizada para este segmento.
```

---

## Proceso

1. **Definir el ICP** con los campos mínimos: industria, tamaño, rol, pain point
2. **Investigar las cuentas**: buscar señales de timing (contrataciones recientes, financiación, expansión, cambio de liderazgo, uso de tecnología complementaria)
3. **Identificar el contacto correcto**: no siempre es el más alto en el organigrama — es el que tiene el problema o el que tiene el poder de comprarlo
4. **Rellenar los hooks de personalización**: para cada prospecto, una señal concreta que justifique el contacto ahora (no "vi tu perfil en LinkedIn")
5. **Marcar lo que falta**: emails, datos no verificados → con `[PENDIENTE]` o `[POR VERIFICAR]`
6. **Guardar el archivo** en `<proyecto>/sales/prospects/<nombre-segmento>-prospects-<fecha>.md`
7. **Informar al usuario** de la ruta, el número de prospectos y los campos pendientes

---

## Criterios de calidad de la lista

- Cada prospecto tiene al menos un campo de personalización real (no genérico)
- El contacto identificado es el interlocutor más probable, no el primero que aparece
- Las señales de timing son verificables
- El porcentaje de emails conocidos vs. `[PENDIENTE]` está documentado

---

## Restricciones

- No inventar emails de contacto: si no hay verificación, marcar `[PENDIENTE]` y proponer cómo enriquecerlo (Hunter, Apollo, Lusha, contacto manual).
- No comprar listas externas ni usar bases obtenidas sin consentimiento — además de baja calidad, expone a sanciones (RGPD/CCPA).
- No genérico todos los hooks de personalización: una señal real por prospecto vale más que cien tokens vacíos.
- Marcar siempre lo que falta verificar antes del envío.
- Aplican las reglas de output de `_shared/output-rules.md`.
