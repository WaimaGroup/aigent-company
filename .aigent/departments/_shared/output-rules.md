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
        ├── posts/                 ← todo el contenido publicable (posts, páginas, landings)
        ├── strategy/
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

1. Resolver el proyecto activo (ver `conventions.md` §10.1): listar carpetas en `.context/`. Si hay 1, usarla. Si hay varias, preguntar al usuario. Si hay 0, preguntar para crear una.
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

---

## Archivos temporales (`.context/.temp/<dept>/`)

Algunas skills necesitan archivos transitorios durante su ejecución — buffers de JSON escapado para llamadas MCP, payloads grandes, plantillas intermedias, descargas que se procesan y se descartan. La convención del repo:

```
.context/
└── .temp/
    ├── .gitignore               ← contiene "*" para excluir todo el árbol
    ├── marketing/               ← uno por departamento que lo necesite
    │   └── elementor-eldata-1715900000.tmp
    ├── sales/
    └── software/
```

### Reglas

- **Path canónico:** `.context/.temp/<dept>/<purpose>-<timestamp>.<ext>`. Siempre dentro del subdirectorio del departamento, nunca en la raíz de `.context/.temp/`.
- **Crear el subdirectorio del dept si no existe** antes del primer archivo. Crear también `.context/.temp/.gitignore` con `*` la primera vez para que todo el árbol esté ignorado por git.
- **Naming:** kebab-case + propósito explícito + timestamp Unix. Ej: `elementor-eldata-1715900000.tmp`, `csv-buffer-1715900042.csv`, `screenshot-1715900099.png`.
- **Borrado obligatorio tras uso.** El archivo `.tmp` debe eliminarse antes de cerrar la skill. Si la skill falla a mitad, el siguiente intento puede sobreescribir, pero **nunca dejar `.tmp` huérfanos**.
- **Limpieza periódica:** `.context/.temp/` se asume *transitorio* — cualquier proceso (o el propio motor) puede limpiarlo. No guardar nada que importe ahí.
- **Nunca commitear** archivos de `.context/.temp/`. El `.gitignore` del directorio se encarga.
- **No usar para outputs.** Si el archivo es parte del entregable, va a la ruta de output del proyecto (sección anterior). `.temp/` es exclusivamente para residuos de trabajo.

### Cuándo evitar `.temp/`

Si el dato cabe holgadamente en memoria (un objeto JSON < 100KB), pasarlo por argumento o variable es preferible. `.temp/` solo cuando:

- El tamaño obliga (payloads de Elementor, exports CSV grandes, blobs binarios).
- Hay que invocar un proceso externo (CLI tool) que solo lee de disco.
- Hay que serializar/escapar de forma específica antes de pasarlo a otro tool (MCP que requiere un string ya quoted).
