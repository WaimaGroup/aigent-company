---
name: "job-description"
description: >
  Skill for writing a complete, attractive and structured job description for a
  hiring process: role purpose, responsibilities, must-haves vs nice-to-haves,
  compensation band, hiring process, and EVP. Jurisdiction-aware on pay
  transparency.
---

# Skill: Job Description

**Entregable:** archivo `.md` listo para publicar (o convertir a HTML / formato del ATS), guardado en `<proyecto>/hr/recruitment/jd/<role-slug>.md`.

---

## Cuándo usar esta skill

- Hay que abrir un proceso de hiring nuevo y se necesita la descripción del rol.
- Hay que actualizar un JD previo porque el rol cambió o el anterior no funcionó (pocos candidatos o perfil equivocado).
- Hay que producir variantes del mismo JD para distintos canales (LinkedIn, web propia, agencia).

**Cuándo NO usar:**

- Para describir el rol internamente para roadmap o discusiones de organigrama. Eso es un *role definition*, no un JD.
- Para una oferta concreta a un candidato (la oferta usa la carta de oferta, no el JD).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Título del rol | ¿Cómo se llama exactamente? (función + seniority) |
| Equipo destino y manager | ¿A qué equipo entra y quién es el manager directo? |
| Por qué se contrata | ¿Reemplazo, crecimiento, nueva capacidad? |
| Outcomes esperados | ¿Qué resultados concretos debería lograr esta persona en su primer año? |
| Responsabilidades clave | 4-7 bullets concretos |
| Must-haves | Experiencia, skills y atributos no negociables |
| Nice-to-haves | Lo que suma pero no descarta |
| Compensación | Banda aprobada (mín-máx, fija + variable + equity si aplica) |
| Pay transparency | ¿Se publica la banda en el JD? (depende de jurisdicción y política) |
| Ubicación | Presencial / híbrido / remoto. Jurisdicción de contratación. |
| Proceso | Etapas, evaluadores y duración aproximada |
| EVP | ¿Por qué alguien debería querer este rol? (no copy genérico) |
| Idioma del JD | ¿Español, inglés, ambos? |

---

## Plantilla del entregable

```markdown
---
type: "job-description"
role: ""
seniority: ""
team: ""
location: ""
employment_type: "Full-time / Part-time / Contract"
status: "draft | open | filled | closed"
date_opened: "YYYY-MM-DD"
hiring_manager: ""
recruiter: ""
language: "es | en"
---

# <Título del rol> — <Empresa>

> <Una línea: por qué este rol existe y qué impacto tiene.>

## Sobre <Empresa> (EVP)

<2-4 líneas: qué hace la empresa, en qué momento está, qué la hace un buen sitio. NO marketing genérico — atributos diferenciados (cómo se trabaja, qué problemas se resuelven, qué se aprende).>

## Sobre el rol

**Propósito:** <una frase sobre por qué este rol importa>

**Outcomes esperados en el primer año:**
- <outcome 1, medible si se puede>
- <outcome 2>
- <outcome 3>

## Qué harás

- <responsabilidad 1: verbo de acción + objeto + impacto>
- <responsabilidad 2>
- <responsabilidad 3>
- <responsabilidad 4>
- <responsabilidad 5>

## Qué buscamos (must-haves)

- <must-have 1: experiencia / competencia / conocimiento>
- <must-have 2>
- <must-have 3>

## Suma puntos (nice-to-haves)

- <nice 1>
- <nice 2>

## Cómo trabajamos

- **Ubicación:** <presencial / híbrido X días / remoto desde jurisdicción Y>
- **Modalidad de trabajo:** <síncrono / asíncrono, expectativas de horario>
- **Equipo:** <tamaño, perfil, manager>
- **Stack / herramientas clave:** <listado mínimo si es relevante para el rol>

## Compensación y beneficios

> Solo publicar banda si la política y la jurisdicción lo permiten. Si no, sustituir por "competitivo + beneficios" y la negociación se cierra en proceso.

- **Banda:** <€/$ XX.XXX – XX.XXX [fija] + <variable %> + <equity si aplica>>
- **Beneficios destacados:** <2-4 puntos diferenciados, no la lista genérica>

## Proceso de selección

| Etapa | Quién | Formato | Duración |
|---|---|---|---|
| 1. Screening | <Recruiter> | Llamada | 30 min |
| 2. <Etapa técnica / de rol> | <Hiring manager / panel> | <Formato> | 60 min |
| 3. <Take-home opcional> | Autónomo | <Brief> | ≤4h |
| 4. <Panel / cultura> | <Equipo> | <Formato> | 60 min |
| 5. Final | <Decisor> | Llamada | 30 min |

**Plazo objetivo total:** 2-4 semanas desde primera llamada hasta oferta.

## Cómo aplicar

<Link al ATS, email del recruiter o portal. Si aceptamos referrals, mencionarlo.>

## Equidad

<Empresa> es un empleador que promueve la igualdad de oportunidades. Valoramos la diversidad y consideramos todas las candidaturas sin discriminación por motivos de género, edad, origen, orientación, discapacidad o cualquier otra característica protegida.

[COMPLETAR si la jurisdicción exige texto específico de equal opportunity / accessibility / accommodations.]
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Si la banda salarial o la jurisdicción están claras, perfecto; si no, parar y preguntar.
2. **Validar la coherencia** entre seniority declarado, must-haves, banda salarial y outcomes. Inconsistencias típicas: "junior" con 8 años de experiencia, banda muy por debajo del mercado para los must-haves, outcomes irreales para un primer año.
3. **Redactar** siguiendo la plantilla. Tono coherente con el de la empresa en `config.json`.
4. **Aplicar reglas de pay transparency**: si la jurisdicción la exige (o la política interna), publica la banda. Si no, redactar "competitivo" y dejar la banda en metadata YAML para uso interno.
5. **Revisar sesgos en lenguaje**: evitar palabras con sesgo de género/edad ("rockstar", "ninja", "joven dinámico"), preferir verbos de acción claros.
6. **Marcar `[COMPLETAR]`** lo que requiere validación o no está aún confirmado (proceso, link al ATS, nombre del manager si va público).
7. **Guardar** en `<proyecto>/hr/recruitment/jd/<role-slug>.md`.
8. **Reportar** al usuario:
   - Ruta del archivo.
   - Resumen: rol, seniority, banda (si pública), número de must-haves vs nice-to-haves.
   - Lo que queda `[COMPLETAR]`.
   - Próximo paso (publicar, abrir sourcing, validar con hiring manager).

---

## Restricciones

- **No inventes una banda salarial.** Si el usuario no la facilita, la marca queda como `[BANDA POR APROBAR]`. Nunca un número fabricado.
- **No publiques banda si la política dice que no se publica.** Pay transparency varía por jurisdicción; si hay duda, preguntar antes de exponerla.
- **No uses lenguaje con sesgo** (género, edad, "cultura juvenil"). Si aparece, marcarlo y reescribir.
- **No prometas crecimiento garantizado** ("en 2 años serás manager"). Sí puedes describir la senda posible con `[según desempeño]`.
- **No copies un JD de otra empresa.** Es perezoso y la diferenciación es lo que atrae a buenos candidatos.
- Aplican las reglas de output de `_shared/output-rules.md`.
