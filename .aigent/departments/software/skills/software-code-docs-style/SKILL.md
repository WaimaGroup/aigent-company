---
name: "software-code-docs-style"
user-invocable: true
description: >
  Skill for producing a project's canonical inline documentation style — what
  to comment vs not, docstring format (JSDoc / Google / NumPy / Javadoc /
  rustdoc / godoc / KDoc / phpDoc / …), naming conventions for docs, examples
  policy. Output is a reference doc the team uses; not a rewrite of existing
  code.
---

# Skill: Code Docs Style — guía canónica de documentación inline del proyecto

**Entregable:** archivo `code-docs-style.md` que vive en `<proyecto>/software/architecture/` (junto a los ADRs y designs) — es una guía de estilo, no un ADR. Documenta qué se comenta, qué no, cómo se escriben docstrings, ejemplos y convenciones para que el código del proyecto tenga documentación consistente.

---

## Cuándo usar esta skill

- El proyecto no tiene guía de docs inline y los comentarios/docstrings son inconsistentes entre archivos.
- Onboarding repetido genera la misma pregunta "¿cómo se documenta aquí?" → conviene cerrarlo por escrito.
- Se va a integrar una herramienta de generación de docs (TypeDoc, Sphinx, Doxygen, JSDoc, godoc, …) y hace falta formato canónico.
- Tras revisión de código se repite el comentario "esto necesita un docstring" — la guía corta la discusión.

**Cuándo NO usar:**

- Para reescribir los comentarios del código existente — eso es trabajo de `software-coding` siguiendo esta guía, no del documento mismo.
- Para una guía de estilo del lenguaje completa (linter, formatter, naming de variables) — esa es otra disciplina; aquí solo se cubre documentación.
- Para documentación de usuario / dev-guide / migration-guide — son otros documentos con otras audiencias.

---

## Información a recopilar

Si no se ha proporcionado, preguntar en una sola tanda:

| Campo | Pregunta |
|---|---|
| Lenguajes | ¿Qué lenguajes hay en el repo? (Python, TypeScript, Go, Rust, Java, C#, PHP, …) |
| Generador de docs | ¿Se va a generar documentación a partir del código? (Sphinx, TypeDoc, JSDoc, godoc, rustdoc, Doxygen, Javadoc, ninguno). Determina el formato obligatorio. |
| Audiencia de la doc | ¿Devs internos / consumidores externos de la librería / ambos? |
| Convenciones actuales | ¿Hay ya algún patrón parcial en el repo? (mirar archivos existentes para no romper lo que ya funciona) |
| Naming language | ¿Identificadores en inglés? (recomendado). ¿Comentarios y docstrings en inglés o español? El proyecto decide y la guía registra. |
| Idiomatic style del lenguaje | ¿Se respeta la convención idiomática (PEP 257 en Python, JSDoc tags en JS/TS, rustdoc markdown en Rust, godoc estilo `Func ...` en Go)? |
| Política de TODO/FIXME/XXX | ¿Cómo se usan? ¿Se asocian a tickets? ¿Se prohíben en main? |

---

## Plantilla del entregable

```markdown
# Code Documentation Style — <Project Name>

- **Versión:** <semver simple>
- **Fecha:** YYYY-MM-DD
- **Lenguajes cubiertos:** <list>
- **Generador de docs:** <nombre o "ninguno">
- **Idioma de la doc inline:** <inglés / español / mixto + regla>

---

## Principios

1. **Documenta el "por qué" y la "intención", no el "qué".** El código dice lo que hace; el comentario dice por qué. Un docstring que parafrasea la firma no aporta.
2. **Doc pública obligatoria, doc interna por excepción.** Toda función exportada / método público / endpoint expuesto tiene docstring. Los privados solo si su intención no es obvia desde la firma.
3. **Ejemplo ejecutable > párrafo descriptivo.** Un ejemplo `<lenguaje>` que muestre uso típico ahorra 5 líneas de prosa.
4. **Mantener vs eliminar.** Comentario desfasado es peor que ningún comentario. Si cambias la función, actualiza su doc o bórrala.
5. **TODO / FIXME / XXX siempre con dueño y ticket.** Sin ticket asociado no se mergea.

---

## Reglas por lenguaje

### <Lenguaje 1> (ej. TypeScript / JavaScript)

**Formato obligatorio:** JSDoc / TSDoc.

**Tags admitidos:**

| Tag | Cuándo |
|---|---|
| `@param` | Cada parámetro no obvio desde el tipo. Tipo entre `{}` solo si no es TypeScript. |
| `@returns` | Si el return no es obvio o tiene casos especiales. |
| `@throws` | Cada error documentado que la función lanza. |
| `@example` | Recomendado en API pública. |
| `@deprecated` | Con versión y reemplazo. |
| `@see` | Para enlazar funciones / docs / RFCs relacionadas. |

**Ejemplo canónico:**

```ts
/**
 * Resuelve la dirección del proxy efectivo dado un patrón de URL.
 *
 * El orden de resolución es: env-var explícita → config del proyecto → default.
 *
 * @param url - URL a resolver. Debe incluir protocolo.
 * @param opts - Overrides opcionales.
 * @returns URL del proxy efectivo, o `null` si no aplica.
 * @throws {InvalidUrlError} Si `url` no es una URL válida.
 *
 * @example
 * resolveProxy("https://example.com")
 * // → "http://proxy.internal:8080"
 */
export function resolveProxy(url: string, opts?: Opts): string | null {
  ...
}
```

**Anti-patrones a evitar:**
- Documentar `@param x - the x parameter` (no aporta).
- Tipo en `@param {string}` cuando ya es TypeScript.
- Comentario sobre línea trivial (`i++; // increment i`).

### <Lenguaje 2> (ej. Python)

**Formato obligatorio:** docstring estilo <Google / NumPy / reStructuredText>.

**Estructura para funciones públicas:**

```python
def resolve_proxy(url: str, opts: Opts | None = None) -> str | None:
    """Resuelve la dirección del proxy efectivo dado un patrón de URL.

    El orden de resolución es: variable de entorno → config del proyecto → default.

    Args:
        url: URL a resolver. Debe incluir protocolo.
        opts: Overrides opcionales.

    Returns:
        URL del proxy efectivo, o None si no aplica.

    Raises:
        InvalidUrlError: Si url no es una URL válida.

    Example:
        >>> resolve_proxy("https://example.com")
        'http://proxy.internal:8080'
    """
    ...
```

**Convenciones:**
- Docstring obligatorio en toda función / clase / módulo público.
- Primera línea: resumen imperativo en una línea.
- Cuerpo separado de la primera línea por una línea en blanco.

### <Lenguaje 3> (ej. Go)

**Formato obligatorio:** comentarios godoc — primera línea empieza con el nombre del símbolo documentado.

```go
// ResolveProxy resuelve la dirección del proxy efectivo dado un patrón de URL.
//
// El orden de resolución es: variable de entorno → config del proyecto → default.
// Devuelve cadena vacía si no aplica.
func ResolveProxy(url string, opts *Opts) (string, error) {
    ...
}
```

**Reglas godoc-específicas:**
- Toda función/tipo exportado (mayúscula inicial) lleva comentario godoc.
- Empezar la frase con el nombre del símbolo.
- Sin tags estilo JSDoc — godoc usa prosa estructurada.

### <Otros lenguajes que estén en el repo>

Añadir bloque por cada uno con el formato idiomático del lenguaje.

---

## Convenciones transversales

### Idioma

- Identificadores en inglés (estándar de facto).
- Comentarios y docstrings en **<idioma decidido>**. Si el proyecto es para audiencia internacional o se publica como librería, **inglés siempre**.

### Naming dentro de la doc

- Nombres de tipos / funciones referenciados con backticks: `` `MyType` ``.
- Versiones referenciadas con `vX.Y.Z`.
- Links a RFCs / standards en formato `RFC 7807`, `WCAG 2.2 AA`, etc.

### Ejemplos

- Cada ejemplo debe ser **ejecutable copy-paste**. Si requiere setup, indicarlo antes del bloque.
- Output esperado debajo del comando, con `// → ...` (JS), `# → ...` (Python), `// → ...` (Go).

### Comentarios `TODO` / `FIXME` / `XXX`

- Formato: `// TODO(<author or team>): <descripción + link al ticket>`.
- Sin author o ticket → bloquea en review.
- `FIXME` se reserva para bugs conocidos no parchéables ahora. `TODO` para mejora futura. `XXX` no se usa (ambiguo).

### Comentarios de licencia / copyright

- <Política: cabecera obligatoria en todo archivo, solo en archivos generados, no se usa…>

### Comentarios autogenerados

- Tooling (formatters, codegen) que añade comentarios `// generated, do not edit` se respeta.
- Comentarios estilo `/** auto-generated */` van marcados claramente y nadie los edita a mano.

---

## Política de doc generada

<Aplicable solo si el proyecto genera docs automáticamente:>

- **Comando de generación:** `<command>`.
- **Output:** `<path>`.
- **CI check:** la generación de docs forma parte del pipeline. Si rompe, el PR no mergea.
- **Hosting:** <GitHub Pages / Read the Docs / interno / …>.

---

## Excepciones

- Tests unitarios: docstring opcional. El nombre del test es la documentación.
- Scripts ad-hoc (one-off): documentación mínima al principio del archivo, no en cada función.
- Código generado: respetar lo que el generador produzca.

---

## Cómo aplicar esta guía

- **En review:** los reviewers usan esta guía como referencia. Si un docstring no la sigue, comentario con link a esta sección.
- **En onboarding:** lectura en día 1.
- **En linter / CI:** si existe `eslint-plugin-jsdoc`, `pydocstyle`, `golint`, configurarlos para enforce las reglas de esta guía.
```

---

## Proceso

1. **Recopilar** información (sección anterior).
2. **Inspeccionar el repo** para detectar las prácticas que ya funcionan. No romper lo que está bien por capricho.
3. **Determinar formato obligatorio por lenguaje** según el generador de docs (si lo hay) o la convención idiomática.
4. **Redactar las secciones por lenguaje** con un ejemplo canónico real (no inventado de cero — adaptar uno del repo si es posible).
5. **Cerrar las convenciones transversales** con decisiones explícitas (idioma, TODO/FIXME, ejemplos, copyright).
6. **Definir cómo se enforce** (review, CI, linter). Sin enforcement, la guía decae en 6 meses.
7. **Guardar** en `<proyecto>/software/architecture/code-docs-style.md`.
8. **Reportar al usuario:**
   - Ruta del archivo.
   - Lenguajes cubiertos y formato obligatorio por cada uno.
   - Decisiones de calado tomadas (idioma de la doc, política TODO/FIXME, etc.).
   - Próximos pasos sugeridos: integración con linter / CI, comunicación al equipo, sprint de cleanup para alinear código existente.

---

## Restricciones

- **No imponer el estilo idiomático de un lenguaje a otro.** JSDoc-style en Python o Google-style en Go se ven mal — cada ecosistema tiene su convención y se respeta.
- **No inventar tags propios.** Si JSDoc no tiene `@author`, no lo introduzcas. Si lo necesitas, justifícalo en la guía.
- **No exigir docstring en TODO el código.** El balance correcto: público sí, privado solo si la intención no es obvia.
- **No mezclar esta guía con el linter del lenguaje.** La guía habla de "qué documentar y cómo redactar". El linter cubre formato sintáctico (longitud de línea, naming de variables). Son docs distintos.
- **No congelar la guía como sagrada.** Versionarla. Cuando una regla genera más fricción que valor, ajustarla.
- **No documentar lo obvio** ni en la guía ni en el código. La guía no debe llenarse de ejemplos triviales.
- Aplican las reglas de output de `_shared/output-rules.md`.
