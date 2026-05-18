---
name: "legal-nda-template"
user-invocable: true
description: >
  Skill for producing a Non-Disclosure Agreement (NDA): mutual or unilateral,
  with definition of confidential information, exceptions, duration, return of
  materials, remedies, jurisdiction. The most-signed contract in any company —
  this skill makes the workflow fast and consistent. NOT legal advice.
---

# Skill: NDA Template

**Entregable:** archivo `.md` con borrador de NDA listo para envío a la contraparte tras revisión humana legal. Vive en `<proyecto>/legal/contracts/nda/<contraparte-slug>-nda-<YYYY-MM>.md`.

---

## Cuándo usar esta skill

- Conversación con potencial inversor, cliente, partner, candidato senior o vendor que requiere intercambio de información sensible.
- Diligence pre-deal donde una o ambas partes comparten información.
- Onboarding de un contractor / consultor externo que accederá a datos confidenciales.
- Producir el NDA "standard" reusable de la empresa para velocidad de cierre.

**Cuándo NO usar:**

- Para un MSA o SOW completo (eso es `contract-template` — NDA se anexa o referencia).
- Para DPA de tratamiento de datos personales (eso es `dpa-template`).
- Para acuerdos donde no hay información confidencial real (ej. demo pública del producto).

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Tipo | Mutual (ambas partes comparten) / Unilateral (solo una parte revela) |
| Contraparte | Razón social, jurisdicción, NIF/VAT |
| Propósito | ¿Para qué conversación / proyecto / evaluación es? |
| Duración del NDA | ¿2 años, 5 años, indefinido? (típicamente 3-5) |
| Duración de la obligación post-relación | ¿Cuánto tiempo se mantiene la confidencialidad tras terminar la conversación? |
| Tipo de información | ¿Técnica, comercial, financiera, datos de clientes, IP, todas? |
| Jurisdicción | ¿Ley aplicable y tribunales? |
| Idioma | ¿Español, inglés, ambos? |
| Trade secrets | ¿Hay información que sea trade secret formal con protección extendida? |

---

## Plantilla del entregable

Nombre del archivo: `<contraparte-slug>-nda-<YYYY-MM>.md`.

```markdown
---
type: "nda"
nda_type: "mutual | unilateral"
parties: ["<Razón social A>", "<Razón social B>"]
purpose: "<motivo del intercambio de información>"
duration_years: "<X>"
post_term_confidentiality_years: "<Y>"
jurisdiction: "<país/región>"
governing_law: "<ley aplicable>"
forum: "<tribunales o arbitraje>"
language: "es | en | bilingual"
status: "draft | counterparty-review | signed"
date_drafted: "YYYY-MM-DD"
effective_date: "YYYY-MM-DD"
counsel_review: "[REVISAR LEGAL]"
---

# Acuerdo de Confidencialidad (NDA) <Mutual | Unilateral>

> **[REVISAR LEGAL]** Este borrador requiere validación por counsel humano antes de firma.

## Comparecientes

**De una parte, <Razón social A>**, con domicilio en <dirección>, NIF/VAT <NIF>, representada por <nombre representante> en su calidad de <cargo>, en adelante "**<Apodo A>**".

**De otra parte, <Razón social B>**, con domicilio en <dirección>, NIF/VAT <NIF>, representada por <nombre representante> en su calidad de <cargo>, en adelante "**<Apodo B>**".

(en adelante, las "**Partes**" o, individualmente, "**Parte**").

Las Partes reconocen tener capacidad legal suficiente para contratar y, en su virtud, acuerdan suscribir el presente Acuerdo de Confidencialidad sujeto a las siguientes:

---

## Cláusulas

### 1. Propósito

Las Partes desean explorar **<descripción del propósito: posible colaboración / inversión / contratación / partnership / due diligence>**, lo cual requiere el intercambio de **Información Confidencial** (según se define más abajo).

> *Si Unilateral:* Únicamente **<Parte Reveladora>** divulgará Información Confidencial. **<Parte Receptora>** asume las obligaciones de confidencialidad establecidas.

> *Si Mutual:* Ambas Partes podrán divulgar y recibir Información Confidencial mutuamente; las obligaciones aplican recíprocamente.

### 2. Definición de Información Confidencial

A efectos del presente Acuerdo, se considera **"Información Confidencial"** toda información, en cualquier formato (verbal, escrito, electrónico, visual), que:

a) Sea marcada o identificada como confidencial al momento de la divulgación, o

b) Por su naturaleza, una persona razonable consideraría confidencial dadas las circunstancias.

Incluye, sin limitación: información técnica (código fuente, especificaciones, diseños, prototipos, know-how), información comercial (clientes, prospects, pricing, márgenes, estrategias, planes de roadmap), información financiera (cuentas, forecasts, presupuestos, métricas), información de personas (empleados, contractors, candidatos), información de terceros recibida bajo obligación de confidencialidad.

### 3. Exclusiones

No se considera Información Confidencial aquella que:

a) Ya era de dominio público al momento de la divulgación, o pasa a serlo posteriormente sin culpa de la Parte Receptora;

b) La Parte Receptora ya conocía sin obligación de confidencialidad, demostrable mediante registros anteriores a la divulgación;

c) Se recibe de un tercero sin obligación de confidencialidad y sin violación de derechos de terceros;

d) Es desarrollada independientemente por la Parte Receptora sin uso de la Información Confidencial.

### 4. Obligaciones de la Parte Receptora

La Parte Receptora se obliga a:

a) **No divulgar** la Información Confidencial a terceros sin consentimiento previo y escrito de la Parte Reveladora;

b) **Limitar el acceso** a empleados, contractors y asesores que necesiten conocerla para el Propósito ("need-to-know"), siempre que estén bajo obligación de confidencialidad equivalente;

c) **No utilizar** la Información Confidencial para fines distintos al Propósito declarado en la cláusula 1;

d) **Aplicar el mismo nivel de cuidado** que aplica a su propia información confidencial, no inferior a un estándar razonable;

e) **No copiar ni reproducir** la Información Confidencial salvo lo estrictamente necesario para el Propósito;

f) **Notificar de inmediato** a la Parte Reveladora cualquier uso o divulgación no autorizada de la Información Confidencial.

### 5. Divulgación obligatoria por ley

Si la Parte Receptora se ve obligada legalmente (orden judicial, requerimiento de autoridad) a divulgar Información Confidencial:

a) Notificará a la Parte Reveladora con la mayor antelación posible (salvo prohibición legal);

b) Cooperará razonablemente con la Parte Reveladora para limitar el alcance de la divulgación y obtener protección apropiada (protective order, etc.);

c) Divulgará únicamente la parte de Información estrictamente requerida.

### 6. Duración del Acuerdo y de la obligación

- **Duración del Acuerdo:** **<X años>** desde la fecha de firma, o hasta la conclusión del Propósito, lo que ocurra primero.
- **Obligación de confidencialidad post-terminación:** **<Y años>** desde la terminación del Acuerdo.

> Para **trade secrets** identificados explícitamente como tales, la obligación se mantiene mientras conserven su carácter de secreto comercial bajo la legislación aplicable.

### 7. Devolución o destrucción

A solicitud de la Parte Reveladora o al cesar el Propósito, la Parte Receptora:

a) **Devolverá** todos los documentos, archivos y soportes físicos que contengan Información Confidencial; o

b) **Destruirá** dichos materiales (incluidas copias y derivados) y certificará por escrito su destrucción.

**Excepción:** copias archivadas por requisitos legales o de auditoría podrán retenerse, sujetas a las obligaciones de confidencialidad de este Acuerdo de forma continuada.

### 8. Ausencia de licencia o derechos

Este Acuerdo no concede a la Parte Receptora licencia, derecho de uso, propiedad intelectual ni ningún otro derecho sobre la Información Confidencial salvo el limitado uso para el Propósito.

### 9. Sin obligación de continuar

Este Acuerdo no obliga a ninguna Parte a continuar con el Propósito, firmar acuerdos adicionales, ni mantener la relación comercial. Cualquier acuerdo definitivo derivado del Propósito requerirá contrato separado.

### 10. Remedios **[REVISAR LEGAL]**

Las Partes reconocen que el incumplimiento de este Acuerdo puede causar daños irreparables. Por tanto, la Parte Reveladora tendrá derecho a:

a) Solicitar **medidas cautelares** (injunctive relief) sin necesidad de demostrar daño concreto ni prestar caución;

b) Reclamar **daños y perjuicios** conforme a derecho;

c) Recuperar los **costes razonables de defensa**, incluidos honorarios de abogados, si prevalece en litigio.

### 11. Ley aplicable y resolución de disputas **[REVISAR LEGAL]**

- **Ley aplicable:** Ley de **<jurisdicción>**.
- **Resolución de disputas:** las Partes someten cualquier disputa a los **<tribunales de [ciudad]>** o, alternativamente, a **<arbitraje en [institución]>**.
- **Idioma del procedimiento:** <idioma>.

### 12. Disposiciones generales

- **Cesión:** ninguna Parte podrá ceder este Acuerdo sin consentimiento previo y escrito de la otra, salvo en operaciones corporativas (fusión, adquisición) con notificación.

- **Acuerdo completo:** este documento constituye el acuerdo completo entre las Partes respecto al Propósito; sustituye a cualquier acuerdo verbal o escrito anterior sobre la misma materia.

- **Modificaciones:** cualquier modificación requiere acuerdo por escrito firmado por ambas Partes.

- **Renuncia:** la falta de ejercicio de un derecho no implica renuncia al mismo.

- **Divisibilidad:** si una cláusula se declara inválida, las demás permanecen en vigor.

- **Notificaciones:** las notificaciones se realizarán por escrito a las direcciones indicadas en el preámbulo o por email a los contactos designados (sección 13).

### 13. Contactos para notificaciones

**Por <Razón social A>:**
- Email: <email>
- Persona de contacto: <nombre>

**Por <Razón social B>:**
- Email: <email>
- Persona de contacto: <nombre>

---

## Firma

Y en prueba de conformidad, las Partes firman el presente Acuerdo de Confidencialidad en <X> ejemplares originales, en el lugar y fecha indicados.

**Por <Razón social A>:**
___________________________
Nombre: <Nombre>
Cargo: <Cargo>
Fecha: <fecha>

**Por <Razón social B>:**
___________________________
Nombre: <Nombre>
Cargo: <Cargo>
Fecha: <fecha>
```

---

## Proceso

1. **Recopilar** la información mínima (sección anterior). Sin tipo (mutual/unilateral), partes, propósito y jurisdicción, parar.
2. **Definir si Mutual o Unilateral.** Por defecto, NDA mutuo en B2B; unilateral solo si está claro que una parte revela y la otra no.
3. **Propósito específico y acotado.** No "para colaboraciones futuras" — el propósito vago erosiona la utilidad del NDA. Mejor: "Para evaluar la viabilidad de una posible inversión / partnership / contratación".
4. **Duración razonable.** 3-5 años es estándar; > 10 años puede ser inejecutable en algunas jurisdicciones.
5. **Definición amplia de Información Confidencial** + exclusiones estándar. No omitir exclusiones — son esenciales para ejecutabilidad.
6. **Cláusula de divulgación obligatoria** (orden judicial, autoridad). Protege a quien recibe la información de no estar en violación si la ley lo obliga.
7. **Devolución o destrucción** explícita al final, con excepción para archives legales.
8. **Remedies con injunctive relief** — característico de NDAs para evitar tener que probar daños cuantitativos.
9. **Marcar `[REVISAR LEGAL]`** las cláusulas críticas (remedies, jurisdicción, definición ancha) y `[VERIFICAR JURISDICCIÓN]` lo dependiente de derecho local.
10. **Guardar** en `<proyecto>/legal/contracts/nda/<contraparte-slug>-nda-<YYYY-MM>.md`.
11. **Reportar** al usuario: ruta, tipo (mutual/unilateral), duración, items para counsel humano.

---

## Restricciones

- **No emites opinión legal vinculante.** Borrador → counsel → firma.
- **No firmes ni recomiendes firmar** sin validación humana.
- **No definas Información Confidencial sin exclusiones.** NDA sin exclusiones es inejecutable.
- **No prometas duración perpetua** salvo trade secrets identificados — muchas jurisdicciones limitan obligaciones perpetuas.
- **No omitas el propósito.** NDA sin propósito específico es genérico y débil.
- **No copies NDA de otra empresa sin adaptar.** Cada relación tiene su propósito y su jurisdicción.
- **No asumas mutuo cuando podría ser unilateral** (o viceversa). Pregunta.
- Aplican las reglas de output de `_shared/output-rules.md`.
