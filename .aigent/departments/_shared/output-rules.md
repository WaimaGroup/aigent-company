# Reglas de output — todos los agentes

> Esta regla aplica a **todos** los agentes y orquestadores del repo, sin excepción. Cada agente y orquestador debe contener una línea que referencie este archivo.

---

## Regla universal

**Los entregables se guardan como archivos. Nunca solo como texto en el chat.**

Esto aplica a todo agente, esté invocado por un orquestador o directamente por el usuario, salvo que el output sea claramente conversacional (una pregunta de clarificación, una recomendación rápida, una explicación de orientación general).

### Por qué

- El usuario necesita poder abrir, editar, compartir y versionar el entregable.
- Los outputs que viven solo en chat se pierden al cerrar la conversación.
- Los archivos en disco son auditable, se pueden enlazar entre sí y son la única fuente de verdad para futuras iteraciones.

---

## Qué herramienta usar

| Caso | Herramienta |
|---|---|
| Crear un archivo nuevo | `Write` |
| Modificar un archivo existente (correcciones, optimización SEO, actualización) | `Edit` |
| Listar carpetas | `Bash` (`ls`) — no usar `Read` sobre directorios |
| Leer un archivo antes de modificarlo | `Read` (obligatorio antes de cada `Edit`) |

---

## Dónde guardar el output

> **Regla maestra (no negociable):** los entregables generados nunca se guardan dentro de `.aigent/` ni dentro de `.context/`. Esos dos directorios son del sistema. El contenido real va fuera de ambos.

`.aigent/` es el motor (definiciones de agentes, skills, orquestadores).
`.context/<proyecto>/<departamento>/` solo contiene `prd.md`, `tasks.md` y, en su caso, `config.json` global.
Los entregables van en una tercera ubicación, fuera de los dos anteriores.

### Cómo decidir la ruta del entregable

```
1. ¿El proyecto ya tiene una estructura de carpetas en la raíz del repo?
   └─ Sí → seguirla. Guardar el entregable donde corresponda en esa estructura.
   └─ No → crear `<proyecto>/<departamento>/` en la raíz del repo y guardar ahí.
```

Ejemplo:

```
<root>/
├── .aigent/                       ← motor (no tocar contenido generado aquí)
├── .context/
│   └── website-redesign/
│       └── marketing/
│           ├── prd.md
│           └── tasks.md
└── website-redesign/              ← entregables del proyecto
    └── marketing/
        ├── posts/
        ├── landing-pages/
        └── ...
```

### Reglas universales sobre el archivo

- El nombre de archivo es kebab-case y descriptivo (`landing-page-producto-x.md`, no `output1.md`).
- Si se generan varios formatos para el mismo entregable (`.md` + `.html`), van en la misma subcarpeta.
- Si un agente recibe del orquestador una ruta concreta donde guardar, usa esa ruta sin reinterpretarla.

### Estructura de subcarpetas por departamento

La taxonomía concreta dentro de `<proyecto>/<departamento>/` (qué subcarpetas hay para `posts/`, `emails/`, etc.) está definida en el orquestador de cada departamento. Cada departamento tiene flujos distintos y no tiene sentido forzar una taxonomía común aquí.

---

## Cuando un agente se invoca sin orquestador

Si el usuario invoca a un agente especialista directamente (sin pasar por el orquestador del departamento), el agente debe:

1. Preguntar el proyecto activo si no lo conoce (`.context/config.json` → `active_project`).
2. Comprobar si el proyecto ya tiene una estructura de carpetas en la raíz del repo. Si la tiene, seguirla; si no, crear `<proyecto>/<departamento>/` en la raíz.
3. Inferir la subcarpeta más razonable dentro de esa ruta según el tipo de entregable (consultar el orquestador del departamento si hace falta).
4. Guardar el archivo y comunicar al usuario la ruta exacta donde quedó.

---

## Excepciones explícitas

No es necesario escribir un archivo cuando:

- La respuesta es una pregunta de clarificación.
- La respuesta es una recomendación rápida sobre qué tipo de entregable conviene.
- El usuario pide explícitamente "solo dímelo en el chat".

En cualquier otro caso: archivo.
