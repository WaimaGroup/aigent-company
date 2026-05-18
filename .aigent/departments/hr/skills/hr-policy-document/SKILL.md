---
name: "hr-policy-document"
user-invocable: true
description: >
  Skill for writing an individual internal policy with the standard structure:
  purpose, scope, definitions, rules, procedure, exceptions, consequences, owner
  and review date. Plain language, enforceable, jurisdiction-aware.
---

# Skill: Policy Document

**Entregable:** archivo `.md` con la política individual, listo para vivir en `<proyecto>/hr/policies/<policy-slug>.md` (o como sección de un handbook agregado).

---

## Cuándo usar esta skill

- Hay que redactar una política interna nueva (remoto, vacaciones, parental leave, expense, equipment, código de conducta, anti-harassment, DEI, communication, security…).
- Hay que reescribir una política existente porque cambió la decisión de empresa, la jurisdicción o el contexto.
- Hay que producir una sección concreta del employee handbook con estructura estandarizada.

**Cuándo NO usar:**

- Para una guía operativa interna (cómo abrir tickets en X, cómo solicitar acceso a Y). Eso es documentación de procesos, no política.
- Para un contrato individual. Aunque el handbook puede tener fuerza vinculante según jurisdicción, es distinto del contrato.
- Para una comunicación puntual al empleado (eso es un announcement, no una política).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Política | ¿Qué política exactamente? (remote-work, parental-leave, expense, code-of-conduct…) |
| Decisión de empresa | ¿Cuál es la decisión que ancla esta política? (la política refleja una decisión, no la inventa) |
| Jurisdicción | ¿Qué país/región aplica? ¿Hay legislación específica que la política debe respetar? |
| Scope | ¿A quién aplica? (todo empleado, según país, según seniority, según modalidad de contrato) |
| Owner | ¿Quién es responsable de mantener y aplicar la política? |
| Quién aprueba excepciones | Para los casos límite, ¿quién decide? |
| Fecha de entrada en vigor | ¿Desde cuándo aplica? |
| Frecuencia de revisión | ¿Cuándo se vuelve a revisar? (típicamente anual) |
| Benchmark / referencia | ¿Hay políticas de referencia (empresas similares, sectoriales)? |

---

## Plantilla del entregable

```markdown
---
type: "policy"
policy_slug: "<kebab-case>"
title: "<Título humano>"
version: "1.0"
status: "draft | approved | in-force | retired"
effective_date: "YYYY-MM-DD"
last_review: "YYYY-MM-DD"
next_review: "YYYY-MM-DD"
owner: "<Rol / persona>"
jurisdiction: "<país-región / global>"
applies_to: "<todo empleado / subset>"
---

# Política: <Título humano>

## 1. Propósito

<Un párrafo. Por qué esta política existe. Qué problema previene o qué valor habilita. Sin jerga.>

## 2. Scope

**Aplica a:** <descripción precisa del grupo>

**No aplica a:** <excepciones de grupo, si las hay>

**Jurisdicción:** <país/región o "global, con variantes locales según anexo">

## 3. Definiciones

> Solo si hay términos no obvios o con significado específico en esta política.

- **<Término 1>:** <definición operativa>
- **<Término 2>:** <definición>

## 4. Reglas

> Qué se permite, qué se espera, qué se prohíbe. Lenguaje directo, sin ambigüedad. Bullets, no párrafos largos.

- <regla 1>
- <regla 2>
- <regla 3>
- ...

## 5. Procedimiento

> Cómo se solicita, autoriza, ejecuta o invoca la política. Quién hace qué, en qué orden, con qué plazos.

1. <Paso 1: quién lo inicia y cómo>
2. <Paso 2: quién aprueba y con qué criterio>
3. <Paso 3: cómo se ejecuta>
4. <Paso 4: cómo se documenta / registra>

## 6. Excepciones

> Casos en que la regla general no aplica y quién decide.

- **<Tipo de excepción 1>:** decide <rol>, con qué criterio.
- **<Tipo de excepción 2>:** ...

> Si la política no admite excepciones, decirlo explícitamente.

## 7. Consecuencias del incumplimiento

> Qué pasa si no se cumple. Proporcional a la severidad. Vinculado al código de conducta general.

- <consecuencia 1 — nivel suave>
- <consecuencia 2 — nivel medio>
- <consecuencia 3 — nivel severo>

## 8. Cómo plantear dudas o quejas

<Canal específico para esta política: persona, equipo, email, herramienta. Si la política es sensible (harassment, DEI), añadir canal alternativo confidencial.>

## 9. Anexos

- **Comunicación al empleado:** <link a announcement asociado al lanzar / cambiar la política>
- **Política previa que sustituye (si aplica):** <slug + fecha>
- **Marco legal de referencia:** <referencia, sin transcribir texto legal completo>
- **FAQ:** <preguntas frecuentes si aplica>

---

## Historial

| Versión | Fecha | Cambios | Autor |
|---|---|---|---|
| 1.0 | YYYY-MM-DD | Versión inicial | <nombre> |
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). La jurisdicción y la decisión de empresa son críticas — sin ellas no se redacta nada con peso.
2. **Validar** que la decisión de empresa es clara y aprobada. Si no lo está, la política sale como `status: draft` con `[DECISION DE EMPRESA]` marcando lo pendiente.
3. **Buscar la política previa** si la hay (en `<proyecto>/hr/policies/`). Si la nueva sustituye a una anterior, marcarlo en "Anexos > Política previa".
4. **Redactar en plain language.** Cada vez que una frase necesite leerla dos veces para entenderla, reformular.
5. **Identificar dependencias legales** y marcarlas con `[VERIFICAR JURISDICCIÓN]` o `[REVISAR LEGAL]`. La política se entrega, pero con esos campos visibles para que legal valide antes de aprobar.
6. **Comprobar coherencia con políticas existentes:** una política de remote ≠ política de vacaciones; pero ambas deben dejar claro cómo interactúan (¿quién avisa primero? ¿qué pasa con un vacacional desde otro país?).
7. **Definir owner y fecha de revisión.** Sin owner una política se vuelve huérfana; sin fecha de revisión queda desfasada.
8. **Guardar** en `<proyecto>/hr/policies/<policy-slug>.md`.
9. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen: política, scope, owner, jurisdicción.
   - Campos `[VERIFICAR JURISDICCIÓN]`, `[REVISAR LEGAL]`, `[DECISION DE EMPRESA]` pendientes.
   - Próximo paso: revisión con leadership, validación legal, preparación del announcement al empleado.

---

## Restricciones

- **No copies legislación verbatim.** Cita marco, no transcribas. El handbook no es ley; refiere a la ley aplicable.
- **No uses ambigüedad estratégica.** "Se evaluará caso por caso" sin criterios = inequidad por diseño.
- **No mezcles política con marketing.** El handbook no vende; explica.
- **No publiques sin owner, fecha de entrada en vigor y fecha de revisión.** Esos tres campos son obligatorios.
- **No omitas el canal de duda/queja.** Toda política dice dónde preguntar.
- **No prometas más de lo que la empresa cumplirá.** Una política que la empresa no aplica consistentemente es peor que no tener política.
- Aplican las reglas de output de `_shared/output-rules.md`.
