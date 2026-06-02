# Changelog

Todas las versiones notables del sistema Aigent se documentan aquí.
Formato: `## X.Y.Z — YYYY-MM-DD` seguido de cambios por departamento.

---
## 3.12.0 — 2026-06-01

### Nueva utility-skill compartida `shared-office-writer` — generación de .docx/.xlsx sin dependencias

Utilidad transversal para **producir** documentos Office desde un spec JSON, sin ningún paquete externo. Un `.docx`/`.xlsx` es un paquete OPC (un ZIP de partes XML); el script lo ensambla con `zlib` de stdlib (DEFLATE crudo + CRC32 + central directory propios). Misma filosofía zero-dependencia que `b64.cjs`, `download.cjs` y el parser YAML del engine.

**Capacidades (alcance "Práctico"):**
- **docx:** párrafos (texto o *runs* con `bold`/`italic`/`underline`), encabezados H1-H6, tablas simples con bordes y cabecera opcional en negrita.
- **xlsx:** varias hojas (nombres saneados a reglas de Excel), celdas texto/número/booleano/fecha (`yyyy-mm-dd`), fórmulas (con valor cacheado opcional), ancho de columna, cabecera en negrita.

**Contrato:** `node office.cjs <docx|xlsx> --spec <spec.json> --output <fichero>` (o `--stdin`). Output JSON `{ ok, op, path, bytes, ... }`. Errores: `BAD_ARGS`, `SPEC_NOT_FOUND`, `BAD_SPEC_JSON`, `BAD_SPEC`, `WRITE_FAILED`, `INTERNAL`.

**Limitaciones declaradas:** solo escribe (no lee/edita ficheros existentes); sin imágenes, headers/footers, TOC, comentarios, control de cambios (docx) ni colores/bordes/merges/gráficos/pivots/formato condicional (xlsx); las fórmulas las recalcula Office al abrir. Ampliar = editar `office.cjs` + SKILL.md de forma deliberada.

**Verificación:** ficheros generados validados de tres formas independientes — integridad ZIP (`unzip -t`), lectura con python-docx/openpyxl (estilos de encabezado, negrita de cabecera, fechas como `datetime` reales, fórmulas, escape XML de `&`/`<`), y conversión a PDF con LibreOffice headless (prueba estricta de validez OOXML). Rutas de error probadas.

**Categoría:** utility-skill (§7.1 conventions) — autodescubrimiento vía `description` rica en triggers, no se lista en agentes. `install.sh`/`install.ps1` la propagan automáticamente como cualquier `_shared/skill`.

### Documentación de casos de uso (para usuarios no técnicos)
- `_shared/README.md`: nueva sección **"Skills utility compartidas"** que documenta las tres utility (`shared-office-writer`, `shared-base64`, `shared-http-download`) con ejemplos en lenguaje natural, aclarando que base64/http-download son fontanería autodescubierta (no se piden por nombre). Tres filas añadidas a la tabla "Cuándo invocar".
- READMEs de dept con nota **"¿En Word o Excel?"** (ejemplos propios de cada dominio) donde el entregable Office es natural: `marketing` (extiende la nota de formato existente), `sales`, `finance`, `hr`, `legal`. Los demás depts no se tocan (Office no es su entregable habitual; la skill sigue disponible vía autodescubrimiento).

### Plantillas de permisos del instalador (Claude Code + OpenCode)
Retoques genéricos a `IDE/settings.local.json` y `IDE/opencode.json` (las plantillas que el instalador copia). Motivados por permisos hiper-específicos que se auto-capturaban en Windows; se sustituyen por patrones genéricos:
- **Paridad PowerShell.** La plantilla solo tenía `powershell:*`/`pwsh:*` (estilo unix). Añadidos los binarios Windows `powershell.exe`/`pwsh.exe` y cmdlets equivalentes a los allow unix ya existentes: lectura (`Get-ChildItem`, `Get-Content`, `Get-Item`, `Get-Location`, `Test-Path`, `Select-String`) y escritura (`New-Item`, `Copy-Item`, `Move-Item`, `Set-Content`, `Add-Content`, `Out-File`) en allow; `Remove-Item` en ask (espejo de `rm`). Resuelve genéricamente los prompts de `New-Item`/`Test-Path`/`powershell.exe` sin rutas hardcodeadas.
- **`office.cjs`** de `shared-office-writer` añadido a la lista de scripts permitidos (paridad con `b64.cjs`), en ambos ficheros.
- **Claude:** añadidos `WebSearch` y `Read(/tmp/**)` + `Read(.context/.temp/**)` (staging). En OpenCode no aplican (webfetch ya es allow global y Read no se gatea por patrón).
- **No** se añadieron al repo permisos MCP con UUID de conector (instancia-específicos → van en el `.claude/settings.local.json` real del usuario), ni el dominio WebFetch de PLACSP (específico del flujo `sales-tender-search`).

### Archivos tocados
`.aigent/departments/_shared/skills/shared-office-writer/{SKILL.md, office.cjs}` (nuevos), `.aigent/README.md` (catálogo: estado `_shared` 2→3 utility, tabla utility-skills ×2, conteo de skills compartidas 12→13), `.aigent/departments/_shared/README.md`, `.aigent/departments/{marketing,sales,finance,hr,legal}/README.md`, `.aigent/IDE/settings.local.json`, `.aigent/IDE/opencode.json`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.11.0 — 2026-06-01

### Utility-skill `shared-base64` — ahora bidireccional (encode + decode) y renombrada

La antigua `shared-base64-to-file` se generaliza a una utilidad **base64 ↔ fichero** en ambos sentidos y se renombra para reflejarlo.

**Rename:**
- Carpeta `_shared/skills/shared-base64-to-file/` → `_shared/skills/shared-base64/`.
- `name:` del frontmatter `shared-base64-to-file` → `shared-base64`.
- Script `decode.cjs` → `b64.cjs` (un solo script con subcomandos).

**Nueva capacidad — `encode` (fichero → base64):**
- `node b64.cjs encode --input <fichero> [--output <path.b64>] [--format <fmt>] [--data-uri] [--emit-string]`.
- Escribe directamente un fichero `.b64` de texto con todo el base64 (default: alongside con extensión `.b64`; el caller puede apuntarlo a `.context/.temp/<dept>/` para un snapshot transitorio).
- `--data-uri` prefija el contenido con `data:<mime>;base64,`. `--emit-string` incluye el base64 completo en el JSON de stdout (para blobs pequeños; default `null`).
- `--format` (opcional) verifica los magic bytes del origen antes de codificar. Sin `--format`, el mime se infiere de la extensión y un formato fuera de catálogo cae a `application/octet-stream` (`format: null`).
- Gestiona `.context/.temp/.gitignore` con `*` si el `.b64` cae bajo `.context/.temp/`.
- Output JSON: `{ ok, op:"encode", b64_path, source_path, source_bytes, b64_chars, mime, format, data_uri, base64 }`.

**`decode` — comportamiento preservado** (mismo contrato que `decode.cjs`): input bajo `.context/.temp/`, verificación de magic bytes obligatoria, copia `.b64` alongside, borrado del intermedio, errores idénticos. Se añade `op:"decode"` al JSON de salida.

**Back-compat:** si el primer argumento empieza por `--` (sin subcomando), el comando es `decode` — preserva la CLI histórica `decode.cjs --input ...`. Verificado round-trip byte-idéntico (png/pdf) y guard `INPUT_OUT_OF_SCOPE`.

**Sigue sin dependencias** (solo `fs`, `path`; Node 18+).

### Referencias actualizadas (rename)
- `conventions.md` §7.1 (tabla de categorías de skills): ejemplo de utility-skill `shared-base64-to-file` → `shared-base64`.
- `_shared/skills/shared-http-download/SKILL.md`: dos referencias cruzadas.
- `IDE/settings.local.json` y `IDE/opencode.json`: rutas allow de Bash `decode.cjs` → `b64.cjs`.
- `.aigent/README.md`: líneas de catálogo (estado `_shared`, tabla utility-skills ×2) renombradas y redactadas como bidireccionales.

### Aviso — corrupción preexistente en `.aigent/README.md` (no corregida en este bump)
Al editar el README se detectó que su **última línea (774) está corrupta**: `- \`v2/README.m` truncado, seguido de un relleno de espacios y un bloque de **980 bytes NUL** al final del fichero (mismo tipo de defecto que se limpió en `decode.js` en una versión previa). La edición de este bump **preservó** la corrupción intacta (no la agravó). Pendiente: reconstruir el final del README en un PATCH dedicado una vez se confirme qué contenido se perdió.

### Archivos tocados
`.aigent/departments/_shared/skills/shared-base64/{SKILL.md, b64.cjs}` (nuevos; reemplazan `shared-base64-to-file/{SKILL.md, decode.cjs}`, eliminados), `.aigent/departments/_shared/conventions.md`, `.aigent/departments/_shared/skills/shared-http-download/SKILL.md`, `.aigent/IDE/settings.local.json`, `.aigent/IDE/opencode.json`, `.aigent/README.md`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.10.1 — 2026-06-01

### Consistencia documental: corrección de incoherencias preexistentes detectadas en la revisión

Correcciones de documentación (sin cambio de contrato ni de comportamiento) destapadas al revisar el trabajo de 3.9.0/3.10.0.

**`conventions.md`:**
- **§7.1 Naming (contradicción real corregida):** la subsección decía que las skills compartidas **no** llevan prefijo (`competitive-analysis`, "no llevan `shared-`"), contradiciendo §4.1 y la realidad (las 12 son `shared-*`). Reescrita para afirmar el prefijo `shared-` obligatorio. Riesgo evitado: que `skill-scaffold` generara una shared-skill mal nombrada.
- **Rutas de scaffolds:** §1 (diagrama) mostraba `skills/skill-scaffold/` y §5.1 escribía `shared/skills/agent-scaffold`; corregidas a `_shared/skills/shared-{skill,agent}-scaffold/`.

**`output-rules.md`:** el ejemplo de estructura mostraba `posts/` y `landing-pages/` como carpetas separadas, contradiciendo la convención unificada `posts/` (framework 3.2.0). Actualizado a `posts/` (todo el contenido publicable) + `strategy/`.

**`.aigent/README.md` (totales corregidos a la realidad del repo):**
- Agentes especialistas: `33` → **29** (el catálogo lista 8 deptos implementados = 29; el `35`/`33` previo estaba inflado).
- Skills dept-específicas v1: `70` → **71** (suma real de los 8 deptos; la skill v2 `operations-redmine` se cuenta aparte).
- Tabla de estado: Sales `11` → **12** skills (`sales-tender-search` no se había reflejado en la fila).

### README de la raíz: adelgazado a índice-puntero
El `README.md` de la raíz era un relicto de una época anterior (hablaba de "63 skills dept-específicas", "9 compartidas", convención sin prefijo, los 5 agentes viejos de Marketing, y "Software (7)" cuando son 19). Reescrito como **índice-puntero**: conserva intro, "qué resuelve", instalación y "cómo extender"; sustituye los catálogos duplicados de agentes y skills por una tabla de estado por departamento con **enlace al README de casos de uso de cada dept**, y delega el inventario y los conteos en `.aigent/README.md` (única fuente de verdad), evitando mantener dos catálogos en paralelo. De paso se corrigió "skill compartida sin prefijo" → "con prefijo `shared-`" y `skill-scaffold`/`agent-scaffold` → `shared-skill-scaffold`/`shared-agent-scaffold`.

### Naming doblado en Sales corregido
`sales-sales-proposal` / `sales-sales-playbook` → `sales-proposal` / `sales-playbook` (carpetas reales; §4.1, no doblar prefijo). 8 ocurrencias: 6 en `.aigent/README.md` y —más importante— 2 en las tablas "Skills disponibles" de `sales-ae.md` y `sales-enablement.md`, donde eran referencias a un nombre de skill inexistente (bug funcional latente).

### Archivos tocados
`.aigent/departments/_shared/conventions.md`, `.aigent/departments/_shared/output-rules.md`, `.aigent/README.md`, `README.md` (raíz del repo), `.aigent/departments/sales/agents/{sales-ae.md, sales-enablement.md}`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.10.0 — 2026-06-01

### Convenciones: el bloque de readiness de skills v2 pasa a ser condicional (antes obligatorio)

Continuación del refactor de Marketing (3.9.0), ahora promovido a `_shared/` y aplicado a todo el framework.

**Convención (`conventions.md §6`):** el bloque "Manejo de skills v2 — readiness" deja de ser una sección obligatoria de *todo* orquestador. Ahora se incluye **solo si el departamento tiene al menos una skill v2** (`runtime: engine-v2`). Los departamentos cuyas skills son todas v1 prosa lo sustituyen por una nota de una línea. Motivo: evitar ~80 líneas de instrucciones inejecutables en orquestadores sin v2.

**Plantilla (`orchestrator-template.md`):** el bloque v2 se conserva como referencia canónica, pero ahora va precedido de un aviso "Sección CONDICIONAL" con la nota de una línea a usar cuando el dept no tiene skills v2.

**Orquestadores limpiados (7):** se eliminó el bloque v2 muerto de `sales`, `software`, `hr`, `product`, `finance`, `legal` y `design` (sustituido por la nota "Skills v2 — no aplica en este departamento"). `operations` lo conserva (tiene `operations-redmine`, v2). `marketing` ya se había limpiado en 3.9.0; se actualizó su nota y su sección de excepciones (el bloque v2 ya no figura como excepción local, solo el default de archivo único).

### Documentación: referencias a los nombres antiguos de Marketing actualizadas en `_shared/`

Tras el renombrado de agentes/skills de Marketing en 3.9.0, se corrigieron las referencias obsoletas que quedaban fuera del departamento:
- **Descripciones de skills compartidas** (consumidores documentados): `shared-case-study` (`marketing-content`→`marketing-creative`), `shared-competitive-analysis`, `shared-okr-set`, `shared-stakeholder-map` (`marketing-strategy`→`marketing-planning`), `shared-kpi-dashboard` (`marketing-seo`→`marketing-planning`).
- **`_shared/README.md`**: los 5 "Prompt: (desde …)" de las skills compartidas.
- **Ejemplos de naming** en `conventions.md` (§4 y §4.1: `marketing-social.md`→`marketing-creative.md`, `marketing-blog-post`→`marketing-copy`, `[Marketing] Social Media`→`[Marketing] Creative`; se quitó `marketing-plan` del ejemplo de "no doblar prefijo").
- **Scaffolds**: `shared-agent-scaffold` (ejemplos `marketing-content`/`marketing-social`→`marketing-creative`/`marketing-web`) y `shared-skill-scaffold` (referencias canónicas v1: multi-archivo→`marketing-elementor-content`, archivo único→`marketing-copy`, brief→`marketing-strategy`).
- **`software-changelog-entry`**: `marketing-content`→`marketing-creative`.

### Archivos tocados
`.aigent/departments/_shared/conventions.md`, `.aigent/departments/_shared/orchestrator-template.md`, `.aigent/departments/_shared/README.md`, `.aigent/departments/_shared/skills/{shared-case-study,shared-competitive-analysis,shared-kpi-dashboard,shared-okr-set,shared-stakeholder-map,shared-agent-scaffold,shared-skill-scaffold}/SKILL.md`, `.aigent/departments/{sales,software,hr,product,finance,legal,design}/<dept>-orchestrator.md`, `.aigent/departments/marketing/marketing-orchestrator.md`, `.aigent/departments/software/skills/software-changelog-entry/SKILL.md`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.9.0 — 2026-06-01

### Marketing: simplificación del departamento (5 agentes → 3, 14 skills → 8) + default de archivo único

Refactor de usabilidad del departamento de Marketing. Objetivo: menos piezas, menos archivos por entregable, más fácil de pedir. **No se tocó `_shared/`** (decisión de alcance): las dos reglas nuevas viven como excepción local documentada en el orquestador de Marketing.

> **Aviso de migración para deployments:** los nombres de agentes y skills de Marketing han cambiado. Cualquier deployment que referencie los nombres antiguos (`marketing-content`, `marketing-strategy`, `marketing-seo`, `marketing-social` como agentes; `marketing-blog-post`, `marketing-ad-copy`, `marketing-email-campaign`, `marketing-editorial-calendar`, `marketing-platform-adapter`, `marketing-linkedin-audit`, `marketing-keyword-research`, `marketing-seo-on-page`, `marketing-marketing-plan`, `marketing-campaign-brief` como skills) debe actualizar las referencias (ver mapa abajo).

**Agentes (5 → 3):**
- `marketing-creative` (nuevo) = fusión de `marketing-content` + `marketing-social`. Copy + redes + voz de marca.
- `marketing-planning` (nuevo) = fusión de `marketing-strategy` + `marketing-seo`. Estrategia + SEO/analytics.
- `marketing-web` (se mantiene, reescrito y aligerado; referencias de skills actualizadas).
- Eliminados: `marketing-content.md`, `marketing-strategy.md`, `marketing-seo.md`, `marketing-social.md`.

**Skills (14 → 8), multi-modo cuando aplica:**
- `marketing-copy` (nueva) = `marketing-blog-post` + `marketing-ad-copy` + `marketing-email-campaign`. Formatos `blog`/`email`/`anuncio`/`prensa`.
- `marketing-social` (nueva) = `marketing-editorial-calendar` + `marketing-platform-adapter` + `marketing-linkedin-audit`. Modos `adaptar`/`calendario`/`linkedin-audit`.
- `marketing-seo` (nueva) = `marketing-keyword-research` + `marketing-seo-on-page`. Modos `research`/`on-page`.
- `marketing-strategy` (nueva) = `marketing-marketing-plan` + `marketing-campaign-brief`. Modos `plan`/`brief`.
- Se mantienen: `marketing-landing-page`, `marketing-elementor-content`, `marketing-publish-checklist`, `marketing-brand-voice-guide`.
- Eliminadas (fusionadas): las 10 skills de origen listadas arriba.

**Nueva regla de output (local de Marketing): default de archivo único.** Por defecto cada entregable es **un solo `.md`**; los formatos extra (`.html`, `_content.html`, `assets/`, `analytics/`) solo se generan a petición. Excepción documentada: `marketing-elementor-content` (entregable técnico multi-archivo por naturaleza). Aplicado en todas las skills de Marketing y en el orquestador.

**Orquestador (`marketing-orchestrator.md`):**
- Eliminado el bloque "Manejo de skills v2 — readiness" (~80 líneas): Marketing no tiene skills v2, era código muerto.
- Nueva tabla de decisión y secciones de delegación para 3 agentes.
- Nueva sección "Excepciones documentadas respecto a `_shared/`" que registra como intencionales las dos divergencias: (1) sin bloque v2 readiness (diverge de `conventions.md §6`), (2) default de archivo único (extiende `output-rules.md`). **Pendiente de promover a `_shared/` si se decide aplicarlo a todos los departamentos.**
- Se conservan intactos Paso 0, Paso 0.5 (init de proyecto), gestión de tareas y PRD.

### Índice (`.aigent/README.md`)
- Tabla de estado: Marketing `5 / 5` → `3 / 3` agentes, `14` → `8` skills.
- Sección "Detalle por departamento → Marketing" reescrita (3 agentes + 8 skills).
- Catálogo global: "Agentes especialistas" `35` → `33`; "Skills dept-específicas" `76` → `70`; subsección Marketing actualizada.
- Referencias de "consumidores documentados" en skills compartidas actualizadas a los nuevos nombres (`marketing-creative`/`marketing-planning`).
- `departments/marketing/README.md` (casos de uso) reescrito para la nueva estructura.

### Pendiente (fuera del alcance de esta versión)
- Referencias a los nombres antiguos de agentes de Marketing que aún viven en `_shared/` (descripciones de `shared-case-study`, `shared-competitive-analysis`, `shared-kpi-dashboard`, `shared-okr-set`, `shared-stakeholder-map`; ejemplos en `conventions.md`, `shared-agent-scaffold`, `shared-skill-scaffold`, `_shared/README.md`) y una en `software-changelog-entry`. No se tocaron por decisión de alcance (solo Marketing, sin `_shared`).

### Archivos tocados
`.aigent/departments/marketing/marketing-orchestrator.md`, `.aigent/departments/marketing/README.md`, `.aigent/departments/marketing/agents/{marketing-creative.md (nuevo), marketing-planning.md (nuevo), marketing-web.md}` (eliminados `marketing-content.md`, `marketing-strategy.md`, `marketing-seo.md`, `marketing-social.md`), `.aigent/departments/marketing/skills/` (nuevas `marketing-copy/`, `marketing-social/`, `marketing-seo/`, `marketing-strategy/`; actualizadas `marketing-landing-page/`, `marketing-publish-checklist/`, `marketing-brand-voice-guide/`, `marketing-elementor-content/`; eliminadas 10 skills fusionadas), `.aigent/README.md`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.8.0 — 2026-05-29

### Sales: nueva skill `sales-tender-search` (búsqueda de licitaciones ATOM/PLACSP)

Skill v1 con script propio para buscar licitaciones públicas en feeds ATOM de sindicación (por defecto la PLACSP, `contrataciondelestado.es`), filtrarlas client-side y preparar su triaje. El feed no es una API consultable (sindicación masiva paginada con `rel="next"`), así que el script descarga, pagina sobre la ventana de `<updated>` y filtra en local.

- **`sales/skills/sales-tender-search/atom-search.cjs`** (Node 18+, sin deps, `fetch` global): núcleo genérico de búsqueda ATOM con extractor enchufable por perfil (`placsp-codice` el primero, leyendo CODICE/UBL). Filtros: CPV mixto (exactos + prefijos tipo `722*`), ventana de fechas de publicación, estado (`PUB`/abiertas por defecto) y plazo de presentación ≥ hoy. Inputs por `--inputs '<json>'`; soporta `file` para pruebas offline; progreso por stderr; salida JSON con `results[]` (expediente, objeto, órgano, CPV, presupuesto, estado, plazo, enlace, documentos[]).
- **`sales/skills/sales-tender-search/SKILL.md`**: prosa + contrato CLI + flujo de 3 pasos (buscar → descargar pliegos con `shared-http-download` → resumir con `pdf`) y ruta de entregables según `output-rules`. El Paso 3 exige que cada `resumen.md` incluya **siempre** una sección "Documentos originales" enlazando la ficha PLACSP (`results[i].enlace`) y cada pliego por su `url` original, y que el índice `licitaciones.md` enlace de forma navegable a cada `resumen.md` (`<expediente>/resumen.md`).

### _shared: nueva utility-skill `shared-http-download`

- **`_shared/skills/shared-http-download/download.cjs`** (Node 18+, sin deps): descarga binaria por GET HTTP(S) a un `outDir`, con resolución segura de nombre (título → `Content-Disposition` → segmento de URL → `Content-Type`), aislamiento de errores por URL (un 404 no aborta el lote), tope `maxBytes` y reporte JSON.
- **`_shared/skills/shared-http-download/SKILL.md`**: prosa + contrato CLI, códigos de error y convención de `outDir` (output-rules). Reutilizable por cualquier departamento.

### Sales: cableado de la skill en el departamento

Para que la skill sea alcanzable desde el orquestador (y no solo por invocación manual):

- **`sales/agents/sales-sdr.md`**: `sales-tender-search` añadida a su tabla "Skills disponibles" (la asociación skill→agente vive en el agente, por convención).
- **`sales/sales-orchestrator.md`**: nueva señal de delegación a `sales-sdr` (licitaciones / concursos públicos / CPV / pliegos / PLACSP / tender), fila en la tabla de decisión rápida, carpeta `licitaciones/` añadida a la estructura de outputs por defecto (Paso 0.5 + árbol + tabla "carpeta destino por agente").

### Índice

- `README.md`: añadidas ambas skills a los catálogos (`_shared` utility 1→2, sales 11→12, dept-específicas 75→76, compartidas 11→12) y actualizado el resumen de `_shared`.

### Archivos tocados

`.aigent/departments/sales/skills/sales-tender-search/{atom-search.cjs,SKILL.md}`, `.aigent/departments/_shared/skills/shared-http-download/{download.cjs,SKILL.md}`, `.aigent/departments/sales/agents/sales-sdr.md`, `.aigent/departments/sales/sales-orchestrator.md`, `.aigent/README.md`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.7.1 — 2026-05-28

### Instalador: prompt interactivo para activar `--clean` / `-Clean`

Mejora UX retro-compatible del flag declarativo `--clean` introducido en 3.5.0. Hasta ahora la única forma de activarlo era pasando el flag por CLI; quien usaba el modo interactivo (el flujo `./install.sh` sin argumentos) no veía la opción y tenía que conocer la existencia del flag para usarla.

**Nuevo prompt en `ask_interactive` (bash) e `Invoke-Interactive` (PowerShell):** justo después de la selección de departamentos y antes del prompt de MCPs, si la selección NO incluye todos los departamentos del repo, se pregunta:

```
¿Quitar los departamentos no seleccionados si ya estaban instalados?
Modo --clean: borra agentes y skills de: <lista>
shared-* y carpetas personalizadas NUNCA se tocan.
##OPTIONS:["s","n","Salir"]##
[s/N] (h=ayuda, q=salir):
```

**Lógica condicional del prompt:**

- Solo aparece en instalación completa (no en `--sync`, donde `--clean` es incompatible).
- Solo aparece si hay candidatos a limpiar: si el usuario eligió "Todos", el prompt se omite.
- Lista explícita los departamentos que se borrarían — el usuario ve qué consecuencias tiene decir "s".
- `s` → activa `CLEAN=true`. `n` o `Enter` → `CLEAN=false` (default seguro).
- Emite el marcador `##OPTIONS:` para que los wrappers (Cowork) muestren botones nativos.

**Verificado end-to-end** con tres escenarios:

| Escenario | Resultado |
|---|---|
| Selección parcial + respuesta `s` | Prompt aparece, clean se ejecuta, borra los depts no seleccionados que estaban instalados |
| Selección parcial + respuesta `n` | Prompt aparece, clean NO se ejecuta, los demás depts se mantienen intactos |
| Selección "Todos" | Prompt omitido (no hay candidatos), comportamiento de siempre |

**Archivos editados:**
- `.aigent/IDE/install.sh` — sección "4. Clean (modo declarativo)" insertada entre depts y MCPs en `ask_interactive`.
- `.aigent/IDE/install.ps1` — sección "4. Clean (modo declarativo)" insertada entre depts y MCPs en `Invoke-Interactive`.

**Por qué PATCH:** sin cambio de contrato, sin breaking change. El flag CLI sigue funcionando exactamente igual; el flujo no-interactivo no se ve afectado. Solo se añade un prompt nuevo en una rama del flujo interactivo que antes no existía.

---
## 3.7.0 — 2026-05-28

### BOSS.md: bootstrap automático en estado virgen

Nueva rama del flujo de auditoría de BOSS para resolver el caso "primer arranque del proyecto": cuando `.context/` no tiene ninguna carpeta de proyecto **y** `.context/config.json` no existe o está vacío (plantilla por defecto sin `company.name`), BOSS ya no abre el menú de 3 modos (auto/manual/omitir). En su lugar:

1. Anuncia que es la primera ejecución del bootstrap.
2. Pide en un solo mensaje las **dos** cosas que no puede inventar: nombre de la empresa y nombre del primer proyecto (kebab-case).
3. Ejecuta los pasos 1-7 del checklist sin más preguntas (crea `.context/`, `.gitignore`, `.secrets.json`, `config.json` con `company.name` rellenado, `<proyecto>/`, y `<proyecto>/config.json` con plantilla mínima).
4. Resume al usuario exactamente qué se creó y qué quedó pendiente (industria, tono, audiencia, value proposition, paths por dept, MCPs, tools).
5. Pregunta si quiere cambiar algo antes de continuar con su petición.

Si el usuario contesta "no" / "continúa", BOSS procede con la petición original que disparó la sesión.

**Por qué cambiar de comportamiento en virgen:** el menú de 3 modos asume que el usuario *podría* querer omitir el bootstrap. En estado virgen no hay nada que omitir — no hay decisiones previas que respetar — así que ofrecer la opción "omitir" solo añade fricción. La rama nueva entra y sale automáticamente, dejando el sistema utilizable en un mensaje en lugar de dos.

**Archivos editados:**
- `.aigent/BOSS.md` — nueva sección "Si falta TODO (estado virgen)" entre "Si todo está completo → silencio" y "Si falta algo (no virgen) → comunicar y ofrecer 3 modos". Actualizada la regla de oro correspondiente para listar las 3 ramas posibles.

### IDE: plantillas de permisos `allow / ask / deny` para Claude Code y OpenCode

Nueva plantilla `.aigent/IDE/settings.local.json` para Claude Code y bloque `permission` añadido a `.aigent/IDE/opencode.json`. Ambos arrancan con una política sensata:

- **`allow`** — herramientas habituales que no destruyen nada: `bash`, `sh`, `node`, `npm`, `npx`, `yarn`, `pnpm`, `python`, `python3`, `pip`, `pipx`, `uv`, `poetry`, `powershell`, `pwsh`, lectores (`ls`, `cat`, `head`, `tail`, `wc`, `find`, `grep`, `rg`, `tree`, `stat`, `diff`), editores de texto (`sed`, `awk`, `tr`), compresores (`tar`, `zip`, `unzip`), red de lectura (`curl`, `wget`), git read-only + add + commit, y específicamente todos los `.cjs` del engine v2 (incluyendo la skill `shared-base64-to-file/decode.cjs`).
- **`ask`** — acciones potencialmente destructivas pero a veces legítimas: `rm`, `rmdir`, `sudo`, `su`, `chmod`, `chown`, `git push`, `git push --force`, `git reset --hard`, `git rebase`, `git filter-branch`, `npm publish`, `npm install -g`, `pip uninstall`, `docker rm` / `rmi` / `system prune`, `kubectl delete`, `terraform apply` / `destroy`, `curl|sh` / `wget|sh`, `eval`, `crontab`.
- **`deny`** — catastróficas, nunca permitidas: `rm -rf /`, `rm -rf ~`, `rm -rf .`, `dd`, `mkfs*`, `format`, `shutdown`, `reboot`, `halt`, `poweroff`.

El usuario edita la lista a gusto — es un punto de partida, no una recomendación dogmática.

### Instalador: paso `install_permissions` / `Install-Permissions`

`install.sh` y `install.ps1` aprenden a copiar la plantilla de permisos al sitio del IDE como parte del flujo completo (no del `--sync`):

- **Claude Code:** `settings.local.json` → `.claude/settings.local.json` del proyecto, o `%APPDATA%\Claude\settings.local.json` / `~/.claude/settings.local.json` en scope global. **Si ya existe en destino, no se sobreescribe** (el usuario manda — solo se anuncia).
- **OpenCode:** los permisos viven embebidos en `opencode.json` bajo `"permission"`. El instalador solo lo recuerda con un `log_info`; el archivo en sí se instala (cuando se pasa `--mcp` / `-Mcp`) vía `install_mcp` / `Install-McpConfig`.

`install_mcp` (sh) también acepta ahora el flag `--mode global` para OpenCode y copia a `~/.config/opencode/opencode.json` cuando corresponde, alineándose con cómo lo hace `install.ps1`.

**Archivos editados:**
- `.aigent/IDE/install.sh` — nueva función `install_permissions`, llamada en la fase post-MCP del flow completo.
- `.aigent/IDE/install.ps1` — nueva función `Install-Permissions`, llamada en la fase equivalente.
- `.aigent/IDE/settings.local.json` — nuevo fichero (plantilla).
- `.aigent/IDE/opencode.json` — bloque `permission` añadido (y schema ajustado a v3+ de OpenCode: `mcp.<name>` directo en lugar de `mcp.servers.<name>`, `command` como array, `environment` en lugar de `env`).
- `.aigent/IDE/README.md` — tabla de archivos y descripción del flujo actualizadas.

### Por qué MINOR y no PATCH

Dos motivos:

1. **Nueva regla obligatoria en BOSS.md** — el bootstrap automático en virgen cambia cómo se comporta BOSS en primera ejecución. Deployments existentes ya tienen `config.json` y proyectos creados, así que no les afecta, pero la regla está documentada y entra en el contrato del system prompt.
2. **Nuevo paso de instalación** — el instalador ahora copia `settings.local.json` por defecto en el flow completo. Un usuario que reinstale verá un archivo nuevo en su `.claude/` que antes no estaba. La política de "no sobreescribir si existe" garantiza que no se pierde nada del usuario.

Ningún cambio en el contrato de skills v2 (frontmatter, templating, error codes) → no MAJOR.

---
## 3.6.0 — 2026-05-28

### Engine v2 y scripts auxiliares: rename `.js` → `.cjs`

Bug reportado por el usuario: al ejecutar `node .aigent/v2/engine/engine.js ...` en un proyecto host cuyo `package.json` declara `"type": "module"`, Node trata todos los `.js` como ES modules y los `require()` del engine fallan con:

```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and
'C:\workspace\bw\bw-desktop\package.json' contains "type": "module".
```

**Solución elegida:** renombrar todos los scripts a `.cjs`. Node identifica la extensión `.cjs` como CommonJS sin depender de `package.json`. Es la solución oficial de Node y la única que evita añadir cualquier archivo nuevo al árbol `.aigent/` (sin `package.json`, sin dependencias declaradas, sin `node_modules`).

**Archivos renombrados (12):**
- `.aigent/v2/engine/audit.js` → `audit.cjs`
- `.aigent/v2/engine/config.js` → `config.cjs`
- `.aigent/v2/engine/configure.js` → `configure.cjs`
- `.aigent/v2/engine/dryrun.js` → `dryrun.cjs`
- `.aigent/v2/engine/engine.js` → `engine.cjs`
- `.aigent/v2/engine/http.js` → `http.cjs`
- `.aigent/v2/engine/lint.js` → `lint.cjs`
- `.aigent/v2/engine/parser.js` → `parser.cjs`
- `.aigent/v2/engine/template.js` → `template.cjs`
- `.aigent/v2/engine/validate.js` → `validate.cjs`
- `.aigent/v2/engine/yaml.js` → `yaml.cjs`
- `.aigent/departments/_shared/skills/shared-base64-to-file/decode.js` → `decode.cjs`

**Requires internos actualizados:** Node no resuelve automáticamente `require('./xxx')` a `xxx.cjs` (solo a `.js`, `.json`, `.node`). Por eso todos los requires relativos del engine pasan a ser explícitos: `require('./config.cjs')`, `require('./parser.cjs')`, etc.

**Referencias externas actualizadas (24 archivos):** ayuda del instalador, stubs v2 generados, orquestadores de todos los departamentos, `CLAUDE.md`, `BOSS.md`, `_shared/conventions.md`, `_shared/orchestrator-template.md`, `_shared/agents/shared-skill-builder.md`, `_shared/skills/shared-skill-scaffold/SKILL.md`, README del framework y del engine v2. Todo lo que decía `node .aigent/v2/engine/engine.js` ahora dice `node .aigent/v2/engine/engine.cjs`.

**Verificado en sandbox** con un proyecto host que tiene `package.json` con `"type": "module"`: antes del fix `engine.js` revienta con `ReferenceError`, después del fix `engine.cjs` devuelve los JSON estructurados de siempre (`validate`, `describe`, `doctor`, `list`, `configure`, `prepare-secrets`).

### Bug fix: NUL bytes residuales en `decode.cjs`

Independiente al bug de ESM, el archivo `shared-base64-to-file/decode.js` tenía 68 bytes `\0` (NUL) al final, residuo probablemente de una edición previa con codificación rota. Node los rechazaba con `SyntaxError: Invalid or unexpected token`. Archivo limpiado a binario: cualquier `\0` se elimina y el `try { main() } catch ...` queda como única entrada de ejecución.

### Por qué MINOR y no PATCH

Es un fix de bug, pero **renombrar archivos rompe stubs antiguos**: un deployment existente cuyas skills v2 fueron instaladas con una versión anterior tendrá stubs que apuntan a `engine.js`, que ya no existe. La migración es trivial — basta reinstalar con `./install.sh` para que los stubs se regeneren apuntando a `engine.cjs` — pero exige acción del usuario. Por convención: cambios que obligan a reinstalar = MINOR. Ningún cambio en el contrato de skills v2 (frontmatter, templating, error codes) → no MAJOR.

### Por qué descartado el enfoque `.aigent/package.json` con `"type": "commonjs"`

Funcionaba técnicamente (ancla el árbol a CJS sin renombrar nada), pero introducía un `package.json` dentro de `.aigent/` que sugería falsamente que el framework tiene "dependencias" o que es un proyecto Node. El objetivo del framework es no añadir overhead al proyecto host. La extensión `.cjs` consigue lo mismo sin archivos nuevos.

---
## 3.5.0 — 2026-05-28

### Instalador: flag `--clean` / `-Clean` para quitar departamentos del destino

Nueva capacidad **retrocompatible** en `install.sh` e `install.ps1` para resolver el caso "tenía marketing instalado, ahora solo quiero operations". Sin el flag, el comportamiento es exactamente el de siempre (aditivo: lo no seleccionado se queda intacto). Con `--clean` / `-Clean`, el listado `--dept` se interpreta como **estado deseado declarativo**: tras instalar los seleccionados, se barre el destino y se eliminan los artefactos de los departamentos del repo que NO aparecen en la selección.

**Qué borra exactamente** (por cada dept no seleccionado):
- Agentes con prefijo `<dept>-*.md` en la carpeta de agents del IDE (incluido el orquestador).
- Carpetas de skills con prefijo `<dept>-*/` en la carpeta de skills del IDE.

**Qué NO toca, nunca:**
- `shared-*` (siempre permanece, lo necesitan todos los departamentos).
- Archivos/carpetas con prefijos desconocidos (skills de otros sistemas, customs del usuario).
- Cualquier cosa fuera de las carpetas de agents/skills del IDE.

**Comportamiento operativo:**
- Sin prompt de confirmación — la decisión está en el flag, no en interactividad. Pensado para uso scripteable.
- Respeta `--dry-run` / `-DryRun`: muestra qué borraría sin tocar nada.
- Incompatible con `--sync` / `-Sync`: sync no toca agentes, así que mezclar ambos modos sería incoherente. El instalador rechaza la combinación con exit 1.
- Se ejecuta sobre cada IDE seleccionado (claude, opencode, ambos), respetando el scope `--mode` / `-Mode` (global vs project).

**Ejemplos de uso:**

```bash
# Caso típico: tenía marketing + sales, quiero solo marketing
./install.sh --clean --ide all --dept marketing

# Previsualizar qué se borraría
./install.sh --clean --ide all --dept operations --dry-run
.\install.ps1 -Clean -Ide all -Dept marketing,operations -DryRun

# Reinstalar todo y limpiar depts que ya no existen en el repo
./install.sh --clean --ide all --dept all
```

**Archivos tocados:**
- `.aigent/IDE/install.sh` — parámetro `CLEAN`, parseo `--clean`, función `clean_unselected_depts`, banner, validación contra `--sync`, invocación en main, ayuda y atajos rápidos actualizados.
- `.aigent/IDE/install.ps1` — switch `-Clean`, función `Invoke-CleanUnselectedDepts`, banner, validación contra `-Sync`, invocación en main, ayuda y atajos rápidos actualizados.

**Por qué MINOR y no MAJOR:** el comportamiento por defecto sigue siendo aditivo (idéntico al anterior). El flag es opt-in, así que ningún deployment existente cambia salvo que se le añada `--clean` explícitamente. Sin breaking change → MINOR.

---
## 3.4.0 — 2026-05-21

### Nueva utility-skill compartida `shared-base64-to-file`

Primera skill v1 transversal cuya función no es generar contenido (business) ni construir el sistema (meta), sino **proporcionar una utilidad técnica reutilizable** con un script propio al lado del SKILL.md. Inaugura la categoría **utility** en `_shared/skills/`, conviviendo con meta y business sin subcarpetas (se distinguen por dominio, no por ubicación).

**Problema que resuelve:** los MCPs que generan imágenes (DALL·E, Stable Diffusion, Bria, etc.) o descargan assets devuelven el contenido en base64 dentro de su respuesta. Hoy cada agente que recibe ese base64 tiene que improvisar la decodificación a fichero, con riesgo de escribir bytes corruptos sin avisar (porque `Buffer.from(..., 'base64')` es silenciosamente tolerante con basura) y sin coherencia entre departments en cuanto a dónde se escribe el fichero. Esta skill centraliza el procedimiento con verificación de magic bytes y respeta la convención universal `.context/.temp/<dept>/` (introducida en 3.2.0).

**Decisión arquitectónica:** el caso de **MCP devolviendo base64** se resuelve con una skill v1 prosa + script Node, **fuera del engine v2**. El engine no ve la respuesta del MCP (la entrega el IDE directo al agente), así que meter esto en `engine.js` sería un rodeo. Cuando llegue el caso paralelo de **APIs propias HTTP que devuelven base64** (output binario de una skill v2), el camino es distinto: extender el contrato `outputs.file` del engine. Ambas vías conviven sin solaparse.

**Contrato del script (`decode.js`):**

```bash
node .aigent/departments/_shared/skills/shared-base64-to-file/decode.js \
  --input .context/.temp/<dept>/<purpose>-<timestamp>.b64 \
  --format <png|jpg|jpeg|gif|webp|svg|pdf|zip> \
  [--output <path-final-del-depto>] [--keep-input] [--no-b64-copy]
```

Comportamiento:

- Solo Node stdlib (`fs`, `path`) — sin dependencias. Compatible con Node 18+.
- `--input` debe estar bajo `.context/.temp/` (rechazo explícito si no — `INPUT_OUT_OF_SCOPE`). `--output` **es libre**: típicamente apunta a la ruta de outputs del depto (p. ej. `posts/<slug>/assets/hero.png`). El script no impone scope al output.
- Default de `--output`: mismo path que `--input` con la extensión cambiada a `<format>` (queda en `.context/.temp/<dept>/`).
- **Copia `.b64` alongside por defecto:** tras decodificar, el script copia el `.b64` junto al fichero de salida (mismo basename, extensión `.b64`) para conservar el payload original por si en el futuro hay que re-subirlo a un sistema que solo acepte base64. Se suprime con `--no-b64-copy`. Si el alongside coincide con el `.b64` intermedio (caso de `--output` sin override), el script no duplica y preserva el `.b64` automáticamente.
- Valida que el contenido es base64 con regex (`BAD_BASE64` si no), decodifica con `Buffer.from(..., 'base64')`, verifica magic bytes contra `<format>` (`FORMAT_MISMATCH` si no), crea los directorios destino, crea `.context/.temp/.gitignore` con `*` si falta, escribe el binario, copia el `.b64` alongside, y borra el `.b64` intermedio salvo `--keep-input` o que coincida con la copia alongside.
- SVG se verifica como texto (UTF-8 inicial trim → empieza por `<?xml` o `<svg`); WEBP combina `RIFF` en bytes 0-3 + `WEBP` en bytes 8-11; resto, magic bytes clásicos.
- Output JSON a stdout (`{ ok, path, bytes, mime, format, b64_copy }` o `{ ok, error: { code, message } }`), línea humana a stderr en error, exit 0/1. `b64_copy` es `null` cuando se pasa `--no-b64-copy`.
- Códigos de error: `BAD_ARGS`, `INPUT_NOT_FOUND`, `INPUT_OUT_OF_SCOPE`, `BAD_BASE64`, `EMPTY_DECODE`, `MISSING_FORMAT`, `FORMAT_MISMATCH`, `WRITE_FAILED`, `INTERNAL`. (`OUTPUT_OUT_OF_SCOPE` retirado en este mismo bump tras pasar de "staging-only" a "staging + entregable final".)

**Categoría nueva "utility" en `_shared/skills/`.** Antes había dos categorías documentadas (meta + business). Se añade **utility** para utilidades técnicas con script al lado, conviviendo sin subcarpetas con el resto.

### Regla nueva — utility-skills se autodescubren, no se listan en agentes

Esta es **regla obligatoria del framework desde 3.4.0**. Las utility-skills compartidas son la única categoría de skill donde la asociación skill ↔ agente **no se declara en el agente**: el LLM las activa cuando el contexto matchea con la `description` del frontmatter. Listarlas en `## Skills disponibles` de un agente es redundancia (la skill aplica a cualquier agente que reciba el patrón) y a la vez incompleto (siempre faltará algún agente). La solución es invertir el contrato y delegar el descubrimiento en el modelo, vía una `description` rica en triggers semánticos.

Cambios en `_shared/conventions.md`:

- **§7** — nota de excepción tras la regla "La skill no declara qué agentes la usan". Se aclara que para utility-skills **tampoco el agente declara la skill**; el descubrimiento es por LLM vía description.
- **§7.1** — la subsección "Coexistencia con las meta-skills" se rehace como "Tres categorías: meta, business, utility" con tabla comparativa (cómo se invoca y si se lista en agentes). Se añade una nueva subsección "Contrato de las utility-skills (autodescubrimiento)" con los 4 criterios para clasificar una skill como utility, e implicaciones para el `description` y el `audit`.
- **§7.1** — la subsección "Cómo las invocan los agentes" se reescribe para distinguir los tres casos.

**Implicación para `description` de utility-skills:** debe incluir explícitamente vocabulario de activación — palabras gatillo, sinónimos, formatos concretos, MCPs/APIs típicos de origen. No basta con "qué hace la skill"; el LLM la cargará solo si encuentra los términos del problema en su contexto. Aplicado ya a `shared-base64-to-file/SKILL.md` (description reforzada con triggers explícitos como "base64", "b64", "data URI", "MCP returned base64", "save base64 as file", PNG/JPG/SVG/PDF/ZIP, etc.).

**Implicación para `audit`:** una utility-skill **no debe aparecer** en la tabla `## Skills disponibles` de ningún agente. Si aparece, hay drift: o la categoría era equivocada o la referencia sobra.

### Marketing — fixes al orchestrator (drift de 3.2.0 + readiness de 1.5.0)

El `marketing-orchestrator.md` arrastraba dos drifts respecto al estado del repo. Ambos arreglados sin tocar lógica funcional, alineándolo con `_shared/orchestrator-template.md` y con el README del dept (que ya estaban migrados):

- **Convención unificada de `posts/`** (introducida en 3.2.0 y aplicada en el resto del dept). El orchestrator seguía proponiendo `landing-pages/` como carpeta separada en el Paso 0.5.A, en el árbol ASCII de "Estructura de outputs" y en la tabla "Carpeta destino por agente". Migrado: `marketing-web` apunta ahora a `posts/<slug>/` (con prefijos `page-`, `landing-`, `block-` en el slug), igual que `marketing-content` (con prefijo `post-`). Añadida también `seo/` (auditorías SEO independientes y keyword research) que faltaba en la propuesta del Paso 0.5.A.
- **Sección obligatoria "Manejo de skills v2 — readiness"** (introducida en 1.5.0, exigida por `conventions.md` §6 a todos los orquestadores). El orchestrator no la tenía. Añadida textual del template: precheck con `doctor` antes de `run`, red de seguridad reactiva tras `CONFIG_ERROR` / `SECRETS_ERROR` con `details.next`, delegación en `shared-skill-builder configure`, y reglas innegociables sobre secrets nunca por chat y nunca editar `.context/config.json` ni `.context/.secrets.json` a mano.

Ficheros tocados:
- `.aigent/departments/_shared/skills/shared-base64-to-file/SKILL.md` (nuevo + description reforzada con triggers)
- `.aigent/departments/_shared/skills/shared-base64-to-file/decode.js` (nuevo, sin deps)
- `.aigent/departments/_shared/conventions.md` (§7 excepción de utility-skills + §7.1 rehecha con tres categorías + contrato utility)
- `.aigent/departments/marketing/marketing-orchestrator.md` (drift posts/ unificado + sección readiness añadida + tabla agentes ajustada)
- `.aigent/README.md` (estadísticas de `_shared`, tabla de skills compartidas en sección detallada, tabla resumen de skills compartidas — todas actualizadas a 11 = 2 meta + 8 business + 1 utility, y nueva sección "Utility-skills compartidas")
- `.aigent/VERSION` · `.aigent/CHANGELOG.md`

---
## 3.3.0 — 2026-05-20

### Marketing — flujo encadenado `blog-post` → `elementor-content` + validador específico de `_elementor_data.json`

**Quitada la ambigüedad entre `marketing-blog-post` y `marketing-elementor-content`.** Para evitar que un agente o el orquestador dudara qué skill ejecutar primero al pedir un blog post, se fija la regla de forma explícita en cuatro ubicaciones:

- **`marketing-blog-post/SKILL.md`** — añadida sección "Encadenamiento con Elementor": esta skill es **siempre el primer paso** para contenido editorial; tras completarla, si `style.elementor` existe en el config del proyecto, el agente caller invoca `marketing-elementor-content` modo `post` sobre la misma carpeta (sin duplicar el slug folder, sin reescribir el copy). Si el sitio no usa Elementor, blog-post termina ahí.
- **`marketing-elementor-content/SKILL.md`** — la sección "Cuándo usar" ahora abre con una tabla anti-ambigüedad por modo (`post`/`page`/`landing`/`block`) y declara explícitamente que el modo `post` se ejecuta siempre **después** de blog-post leyendo su `.md`. Nunca antes.
- **`marketing-content.md` (agente)** — nueva subsección "Flujo encadenado para contenido editorial" con los 3 pasos canónicos (1: blog-post → 2: detectar Elementor en config → 3: encadenar elementor-content). La skill `marketing-elementor-content` se añade a la tabla "Skills disponibles" con la nota "solo se invoca después de blog-post".
- **`marketing-web.md` (agente)** — nueva tabla "Cómo decidir qué skill usar (sin ambigüedad)" que enumera petición → flujo: pages/landings/blocks van por `marketing-elementor-content` directo; blog posts NO son trabajo de `marketing-web` y se delegan a `marketing-content`.

Resultado: tres archivos de prosa convergen en la misma regla. No hay forma de leer el repo y dudar cuál skill ejecutar primero.

### Nuevo validador específico `scripts/validate-elementor-data.mjs`

Validador Node 18+ sin dependencias que comprueba la estructura del `_elementor_data.json` generado. Vive **dentro de la skill** (`marketing-elementor-content/scripts/`) porque el contrato es 100% específico de Elementor — catálogo de widgets core, jerarquía `section→column→widget`, `isInner` consistency, columnas que suman 100, `icon-list` con `_id` por item, IDs únicos en todo el árbol. No es un validador de JSON genérico (eso ya lo hace `JSON.parse`). Si más adelante varios departments necesitan validadores de outputs estructurados, se promueve al engine v2 con un comando `engine.js validate-output <type> <file>`.

Qué detecta el validador:

| Caso | Severidad |
|---|---|
| JSON inválido / raíz no es array de sections | error |
| Nodo sin `id`/`elType`/`settings`/`elements` (o widget sin `widgetType`) | error |
| IDs duplicados en el árbol | error |
| Columnas de una sección que no suman 100 en `_column_size` | error |
| `widgetType` no está en el catálogo core (rechaza Pro: `form`, `posts`, `slides`, etc.) | error |
| `isInner: true` inconsistente entre section padre y columns hijas | error |
| `isInner: true` en widget (solo aplica a sections y columns) | error |
| Item de `icon-list` sin `_id` único o usando `icon` legacy en lugar de `selected_icon` | error |
| ID que no sigue el patrón habitual (7-8 chars `[a-f0-9]`) | warning |
| Widget `html` con `<script>` (la mayoría de sitios lo strippean) | warning |
| `_column_size` ausente o no numérico | warning |

Contrato CLI:

```bash
node .aigent/departments/marketing/skills/marketing-elementor-content/scripts/validate-elementor-data.mjs \
  <path/to/_elementor_data.json> [--strict] [--quiet]
```

- Exit `0` = válido; `1` = errores (o warnings con `--strict`); `2` = uso incorrecto.
- Output JSON: `{ ok, errors: [...], warnings: [...], stats: { sections, columns, widgets, inner_sections, ids }, file }`.
- Paths JSON-like (`$[0].elements[1].elements[0]`) para localizar cada problema.

Smoke test pasado: 2 fixtures válidos exit 0; 5 fixtures inválidos (IDs duplicados, columnas a 80%, widget `form` Pro, isInner inconsistente, icon-list sin `_id`) exit 1 con mensajes específicos de cada error.

**Integración en el SKILL.md:** Paso 7 del proceso reescrito — ya no dice "Validar el JSON con `JSON.parse`" sino "ejecutar `validate-elementor-data.mjs` y solo continuar si `ok: true`". Añadido al checklist de calidad y a las restricciones (no saltarse el validador, no comentar su exit code). Estructura de archivos de la skill documentada al inicio del body.

Ficheros tocados:
- `.aigent/departments/marketing/skills/marketing-elementor-content/scripts/validate-elementor-data.mjs` (nuevo, 333 líneas)
- `.aigent/departments/marketing/skills/marketing-elementor-content/SKILL.md` (Paso 7 reescrito, sección "Cuándo usar" con tabla anti-ambigüedad, estructura de archivos documentada, checklist + restricciones ampliados)
- `.aigent/departments/marketing/skills/marketing-blog-post/SKILL.md` (sección "Encadenamiento con Elementor")
- `.aigent/departments/marketing/agents/marketing-content.md` (skill añadida a la tabla + sección "Flujo encadenado")
- `.aigent/departments/marketing/agents/marketing-web.md` (descripción de la skill ampliada + tabla "Cómo decidir qué skill usar")
- `.aigent/VERSION` · `.aigent/CHANGELOG.md`

---
## 3.2.0 — 2026-05-20

### Marketing — unificación de outputs en `posts/` y mejoras en publicación Elementor

**Convención unificada `marketing/posts/`.** Todo el contenido publicable de los agentes `marketing-web` y `marketing-content` (blog posts, páginas WP, landings, contenido Elementor y bloques reutilizables) vive a partir de ahora en una **única carpeta `<proyecto>/marketing/posts/<slug>/`**. Se eliminan/consolidan:

- `marketing/contenido/<YYYY-MM>/<tipo>-<slug>/` (en español, introducida en la skill Elementor) → `marketing/posts/<slug>/`.
- `marketing/blog-posts/` (en `README.md` del dept) → `marketing/posts/`.
- `marketing/landing-pages/` (en el orquestador) y `marketing/web/<file>.md` (en el README) → `marketing/posts/<slug>/`.

Motivación: la distinción `blog-posts` / `landing-pages` / `contenido` era ruido — todos son "post o página publicable" con el mismo árbol de archivos (`.md` + `.html` + opcional `_elementor_data.json` + `assets/`). El `<slug>` describe el tipo cuando ayuda (`landing-launch-q3`, `page-about`, `block-hero-default`, `post-como-elegir-crm`). Otras subcarpetas funcionalmente distintas (`emails/`, `ads/`, `social/`, `press/`, `strategy/`, `seo/`) se mantienen.

Ficheros tocados:
- `.aigent/departments/marketing/marketing-orchestrator.md` — estructura de outputs reescrita; columna "Carpeta destino" de `marketing-web` ahora apunta a `posts/<slug>/`; mapa del árbol incluye los archivos típicos del modo Elementor.
- `.aigent/departments/marketing/skills/marketing-elementor-content/SKILL.md` — Paso 0.1 default actualizado; plantilla del entregable reapuntada.
- `.aigent/departments/marketing/README.md` — todas las rutas migradas (`blog-posts/` → `posts/`, `web/<file>.md` → `posts/<slug>/<file>.md`).

### Convención universal: `.context/.temp/<dept>/`

Promovida a `_shared/output-rules.md`. Las skills que generan archivos transitorios (buffers de JSON escapado para llamadas MCP, payloads grandes, exports binarios) los guardan en `.context/.temp/<dept>/<purpose>-<timestamp>.<ext>`. Reglas: subdir por dept, naming kebab-case con timestamp Unix, borrado obligatorio tras uso, `.context/.temp/.gitignore` con `*` para que todo el árbol esté excluido de git, nunca usar para outputs (eso va a la ruta del proyecto). Antes la skill Elementor escribía en `.context/.temp/` raíz — corregido a `.context/.temp/marketing/`.

Ficheros tocados:
- `.aigent/departments/_shared/output-rules.md` — nueva sección "Archivos temporales (`.context/.temp/<dept>/`)" con reglas y cuándo evitar `.temp/`.
- `.aigent/departments/marketing/skills/marketing-elementor-content/SKILL.md` — paths internos actualizados; sección "Archivos temporales" ahora delega a la regla universal.

### Marketing — fixes técnicos al publicar `_elementor_data` vía MCP/REST

La sección "Publicación" de `marketing-elementor-content/SKILL.md` se reescribe entera con los matices que rompen habitualmente la publicación de contenido Elementor:

- **Storage como string JSON, no array.** Documentado el porqué: si se pasa un objeto/array como `value` del meta, WP lo serializa con `serialize()` PHP (`a:1:{...}`) y Elementor lo rechaza. Hay que aplicar `JSON.stringify` explícito y verificar tras escribir que el meta leído empieza por `[`.
- **Slashes / `wp_slash()`.** Algunos MCPs aplican `wp_slash` automáticamente, otros no. La skill ahora pide que cada `"` interna quede como `\"` y cada `\` como `\\` antes de pasarlo al tool, y verifica con `wp_get_post_meta` que el valor leído coincide con el origen.
- **Caché `_elementor_css`** invalidada tras cada update — antes faltaba; sin ello el front renderiza HTML viejo.
- **Los 4 postmetas siempre presentes** (`_elementor_data`, `_elementor_edit_mode = "builder"`, `_elementor_template_type`, `_elementor_version`) — antes faltaba la versión.
- **Comprobaciones de integridad** tras escribir el meta: empieza por `[`, parsea como JSON, primer `id` coincide, no truncado. Si el meta excede el tamaño del campo BD, se detecta inmediatamente.
- **`isInner` consistency** entre section padre y columns hijas.
- **Vía alternativa REST API** (`POST /wp/v2/pages/<id>` con `meta`) documentada como fallback cuando el MCP no expone `wp_update_post_meta` — incluye precheck (`GET ?context=edit`) para confirmar que el meta `_elementor_data` está expuesto.
- **Tabla de troubleshooting** con 9 síntomas → causa → fix (PHP serialize, slashes, truncado, caché, isInner, revisiones, Unicode, edits humanas, key vs meta_key).

Eliminada la mención específica al nombre "royal-mcp" en la descripción del frontmatter; ahora la skill habla genéricamente del "WordPress MCP available in the IDE", siguiendo la regla §8 de `_shared/conventions.md` (no mencionar MCPs concretos).

Ficheros tocados:
- `.aigent/departments/marketing/skills/marketing-elementor-content/SKILL.md`
- `.aigent/VERSION` · `.aigent/CHANGELOG.md`

---
## 3.1.0 — 2026-05-20

### Marketing — nueva skill `marketing-elementor-content`

Nueva skill v1 prosa para producir contenido maquetado con Elementor en WordPress. Cubre la necesidad real de que Elementor guarda el contenido como **JSON estructurado en el postmeta `_elementor_data`**, no como HTML. La skill genera la carpeta entregable con cuatro archivos:

- `_elementor_data.json` — array canónico de secciones/columnas/widgets listo para pegar en el postmeta.
- `content.html` — HTML semántico de fallback para `post_content`.
- `metadata.md` — title, slug, meta description, `_elementor_template_type`, postmetas auxiliares.
- `README.md` — instrucciones de publicación (manual desde el panel WP / vía MCP de WordPress si el IDE lo tiene conectado).

Cobertura: 4 tipos de contenido (page, post, landing, block reutilizable) × widgets core de Elementor (sin Pro): `heading`, `text-editor`, `image`, `button`, `icon-box`, `image-box`, `icon-list`, `spacer`, `divider`, `video`, `testimonial`, `tabs`, `accordion`, `toggle`, `social-icons`, `counter`, `progress`, `alert`, `html`, `shortcode`, `google_maps`.

Estrategia de generación: best-effort con ejemplos canónicos copy-paste (hero, 3-beneficios, FAQ accordion, testimonial, CTA final) tomados de estructuras observadas en exports reales de Elementor 3.x. La skill obliga a IDs únicos de 7-8 caracteres, columnas que sumen 100 en `_column_size` por sección, y validación `JSON.parse` antes de entregar.

**Decisión de no publicar vía engine v2.** Se evaluó añadir una skill v2 ejecutable contra la REST API de WordPress (`/wp-json/wp/v2/pages` + `meta._elementor_data`), pero se descartó porque el usuario ya tiene un MCP de WordPress conectado al IDE — aplica la regla `_shared/conventions.md` §12.1 ("si ya existe un MCP fiable para la herramienta → MCP, no v2"). El SKILL.md y el README documentan la opción de publicación vía MCP además del flujo manual.

**Generación de assets vectoriales.** La skill incluye una sección dedicada para generar **SVGs custom** (iconos fuera de Font Awesome, ilustraciones planas, dividers, blobs, badges, patrones) directamente como markup XML siguiendo convenciones del repo (viewBox explícito, fuentes agnósticas, IDs de gradient prefijados, sin scripts, sin metadatos de editor). Cada SVG se rasteriza por defecto a **PNG @2x** con `convert -background none -density 192 ...` para sitios donde el upload de SVG está deshabilitado. Decisión: SVG cuando el asset es decorativo/icónico/vectorial; **placeholder externo** (`placehold.co/<W>x<H>/<bg>/<fg>?text=...`) + brief visual en `metadata.md` cuando se necesita foto real o render fotorrealistas. Los assets viven en `assets/` dentro del entregable y se referencian en el JSON con `url` relativa; el upload final lo hace el MCP de WordPress (si soporta `media` con escritura) o el usuario manualmente.

El SKILL.md amplía: `Información a recopilar` con campos `assets_a_generar` y `estilo_visual`; nueva sección `## Generación de assets` con catálogo de casos, convenciones SVG, 5 ejemplos canónicos (icono mono-line, hero blob, divider en ola, badge, patrón de puntos) y comando estándar de rasterización; estructura del entregable con subcarpeta `assets/`; plantilla `metadata.md` con tablas "Assets generados" / "Assets pendientes"; plantilla `README.md` con sección "Cómo subir los assets"; proceso con paso 3 dedicado a generación + paso 9 con sanity check de existencia en disco; checklist con verificaciones específicas (PNG par del SVG, sin scripts, sin metadatos de editor, URLs apuntando a archivos reales); restricciones con prohibición explícita de SVGs fotorrealistas y de scripts/metadatos en el markup.

**Agente consumidor:** `marketing-web` añade `marketing-elementor-content` a su tabla `## Skills disponibles`. No se mencionan MCPs concretos en su system prompt (regla §8).

Ficheros editados/creados:

- `.aigent/departments/marketing/skills/marketing-elementor-content/SKILL.md` (nuevo)
- `.aigent/departments/marketing/agents/marketing-web.md` (skill añadida a la tabla)
- `.aigent/departments/marketing/README.md` (caso de uso de la skill)
- `.aigent/README.md` (índice maestro: contador a 14 skills, fila en agente `marketing-web`, fila en catálogo dept-específicas, fila en sección detalle)
- `.aigent/VERSION` · `.aigent/CHANGELOG.md`

---
## 3.0.4 — 2026-05-19

### Corrección de ficheros corruptos del engine v2

**`engine/config.js`** — el archivo tenía el bloque completo desde `loadConfigLenient` hasta `module.exports` duplicado en texto, seguido de cientos de bytes nulos (`\x00`). El parser de Node fallaba con `SyntaxError: Invalid or unexpected token`. Solucionado truncando el archivo binariamente al cierre limpio del `module.exports` original.

**`engine/engine.js`** — el archivo estaba truncado (le faltaban el cierre de `emit()` y la llamada a `main()`), y los intentos de reparación posteriores apilaron el bloque final tres veces (líneas 425–439 repetidas). Solucionado truncando al primer `main();` correcto.

**`engine/engine.js` + `engine/configure.js` — `doctor` no propagaba `--project`** — el argumento `--project` era parseado por `parseArgv` pero nunca llegaba a `loadContextConfig`. Cadena de fix:
- `configure.js`: `doctorOne(skillObject, projectName)` → pasa `projectName` a `loadContextConfig(projectName)`.
- `configure.js`: `doctor(skillName, allSkills, projectName)` → propaga `projectName` a cada `doctorOne`.
- `engine.js`: `doctorSkill(name, projectName)` → lo recibe y lo pasa a `doctorCmd`.
- `engine.js`: `case 'doctor'` → pasa `args.project`.
- `engine.js`: `readinessError(code, message, found, projectName)` → propaga a su llamada interna a `doctorOne`.
- Help text: `doctor [<skill>] [--project <name>]`.

Ficheros editados: `.aigent/v2/engine/config.js`, `.aigent/v2/engine/engine.js`, `.aigent/v2/engine/configure.js`, `.aigent/VERSION`, `.aigent/CHANGELOG.md`.

---
## 3.0.2 — 2026-05-18

### Reversión de la simplificación de `configure` (deshace 3.0.1)

3.0.1 quitó `--scope project` y `--project` de `engine.js configure` asumiendo que las skills se configuran solo globalmente. **Eso es el patrón habitual pero no el único:** un proyecto puede necesitar un override puntual (ej. piloto que usa staging mientras producción usa otra URL). El agente caller es quien decide.

Restaurado:
- `engine.js configure <skill> --set <path>=<value> [--scope global|project] [--project <name>]`. Default sigue siendo `--scope global`.
- Cuando `--scope project`, el target es `.context/<proyecto>/config.json`. Si no se pasa `--project` y hay solo 1 proyecto, se autodetecta. Si hay varios, error `NO_PROJECT_SPECIFIED` con la lista.
- Re-añadido import de `resolveProject` en `configure.js`. Rama `scope === 'project'` con su lógica de resolución y la plantilla del config de proyecto (description / tone_override / paths / decisions).
- `engine.js`: `--scope` re-añadido al parser. `configureSkill` recupera firma `(name, sets, scope, projectName)`. Help muestra los flags.
- `conventions.md` §12.8: documentado el uso de `configure --scope project --project <name>` con ejemplo del proyecto piloto. §10.1: aclarado que `--project` está disponible también en `configure --scope project`, y que la decisión de qué va al global vs al proyecto la toma el agente.

En `run`/`dry-run` sigue igual: aceptan `--project`, mergean global + proyecto al ejecutar.

---
## 3.0.1 — 2026-05-18

### Simplificación de `engine.js configure`

Las skills se configuran exclusivamente en `.context/config.json` global. El config de proyecto (`.context/<proyecto>/config.json`) es competencia de los orquestadores (paths, decisions, tone_override), no de las skills. Por tanto `--scope project` no aportaba nada útil al `configure` del engine:

- **Eliminado `--scope global|project`** del CLI. `configure` siempre escribe al global.
- **Eliminado `--project`** de `configure`. Sigue presente en `run` y `dry-run` (que sí necesitan saber qué proyecto mergear).
- `configure.js`: borrada toda la rama `scope === 'project'`, errores `NO_PROJECT_AVAILABLE` y la dependencia de `resolveProject`.
- `engine.js`: borrado `--scope` del parser. Help actualizado.
- `conventions.md` §12.8 y §10.1: documentado el nuevo contrato. **`configure` no acepta `--project`.** Si un orquestador necesita escribir en el config de proyecto, edita el JSON directamente (es metadata suya, no de skills).

Ningún cambio funcional sobre `run`/`dry-run`: siguen aceptando `--project` y mergeando global + proyecto.

---
## 3.0.0 — 2026-05-18

### Eliminación de `active_project` — bump MAJOR

La estructura del filesystem `.context/<proyecto>/` es ahora la **única fuente de verdad** del proyecto. Se elimina el campo `active_project` de `config.json` y todo el código que dependía de él.

#### Modelo nuevo

- Cada carpeta directa dentro de `.context/` (que no empiece por `.`) es **un proyecto**.
- BOSS deduce el proyecto del contexto en cada delegación:
  1. Si el usuario menciona un nombre que existe → ése.
  2. Si hay 1 carpeta → ésa (silencioso).
  3. Si hay varias → preguntar al usuario.
  4. Si hay 0 y la tarea lo necesita → preguntar para crear uno.
- El engine v2 expone esto vía `--project <name>` en CLI. Si solo hay 1 proyecto, lo autodetecta. Si hay varios y no se pasa el flag, devuelve `NO_PROJECT_SPECIFIED` con la lista de proyectos disponibles.
- Los orquestadores reciben el nombre del proyecto desde BOSS en la delegación; al invocar skills v2 propagan `--project <name>`.

#### Por qué ahora

`active_project` era estado mutable que tenía que mantenerse sincronizado entre BOSS, orquestadores y filesystem. Causaba dos clases de bug: (a) BOSS arrancaba un proyecto distinto al que el usuario tenía en mente porque el config no se había actualizado, (b) cambiar de proyecto en mid-session requería escribir en config. Con el modelo nuevo el FS es siempre la verdad y el cambio de proyecto es natural: el usuario menciona el nombre o BOSS pregunta.

#### Archivos tocados

- **Engine v2:**
  - `config.js` — nueva función `resolveProject(projectName)` con auto-detección. `loadConfig`/`loadContextConfig` aceptan `projectName` como parámetro. Errores nuevos: `NO_PROJECT_SPECIFIED` (>1 sin flag), `PROJECT_NOT_FOUND` (nombre no existe).
  - `configure.js` — `configure(skill, sets, scope, projectName)`. Elimina `getActiveProject()`. Plantilla del config global ya no incluye `active_project`. Error renombrado: `NO_ACTIVE_PROJECT` → `NO_PROJECT_AVAILABLE`.
  - `engine.js` — `parseArgv` reconoce `--project <name>`. `configure`/`dry-run`/`run` lo propagan a las funciones del engine. Help actualizado.
- **BOSS.md** — secciones `Bootstrap` (checklist sin `active_project`, paso 6 ahora "≥1 carpeta de proyecto"), `Detección de proyecto en cada delegación` (nueva, explica las 4 reglas de resolución), `Lo primero` (sin lectura de `active_project`), plantilla `config.json` global sin el campo.
- **`conventions.md`** — §10 plantilla sin `active_project`. Tabla "Quién escribe qué" sin la fila. **Nueva §10.1**: "El proyecto activo no se guarda — se deduce de la estructura" con las 4 reglas. §12.8 (CLI del engine) actualizada para mencionar `--project`.
- **`orchestrator-template.md`** — Paso 0 reescrito con la lógica de detección desde filesystem.
- **9 orquestadores activos** (marketing, sales, software, hr, product, finance, legal, design, operations) — Paso 0 actualizado vía script idempotente.
- **`output-rules.md`** — sección "Cuando un agente se invoca sin orquestador" actualizada para resolver proyecto desde FS.
- **`marketing-blog-post/SKILL.md`** — referencia a `<proyecto>` actualizada.
- **`v2/README.md`** — diagrama ASCII actualizado.

#### Migración para deployments existentes

1. Pull del repo + `bash .aigent/IDE/install.sh --sync` para regenerar stubs (los stubs no cambian, pero conviene).
2. **Limpiar `.context/config.json`:** quitar el campo `"active_project"` si está. (Si se deja, no rompe nada — el engine lo ignora — pero el config queda más limpio sin él.)
3. **Scripts externos:** si invocas `engine.js configure --scope project` esperando que use `active_project`, ahora hay que pasar `--project <name>`. Lo mismo para `run` / `dry-run` cuando hay varios proyectos en `.context/`. Si solo tienes 1, sigue funcionando sin flag.

#### Verificación

- `engine.js list` → devuelve `operations-redmine` v0.4.0 correctamente sin tocar `active_project`.
- `engine.js validate operations-redmine` → `ok: true`, 0 warnings.
- `engine.js audit-repo` → 0 errores en skills y agentes; 3 warnings legítimos de `shared-prd-agent`.
- `grep -r "active_project" .aigent/v2/engine/` → 0 matches (eliminado del código).
- Las referencias remanentes en BOSS.md, conventions.md y orchestrator-template.md son **explicaciones del cambio** ("No existe ningún campo active_project..."), no usos activos.

---
## 2.4.0 — 2026-05-18

### BOSS: auditoría de bootstrap con modos auto/manual/omitir

Refuerza el comportamiento de BOSS al recibir el control. Antes la sección "Bootstrap (cada arranque)" describía qué crear pero no documentaba el flujo de **detección + comunicación + elección de modo**. Eso causaba dos problemas en la práctica: (a) BOSS asumía estado completo y se quedaba a medias, (b) BOSS arrancaba a preguntar sin avisar de lo que faltaba.

#### Nuevo comportamiento al ser invocado

1. **Auditoría obligatoria** del estado del bootstrap antes de delegar nada. Construye una lista `MISSING[]` recorriendo el checklist (ahora 8 pasos, no 7 — separa `config.json` exista de `config.company.name` con valor).
2. **Si todo está completo** → silencio total, lee contexto y atiende la petición.
3. **Si falta algo** → comunica exactamente qué falta y ofrece 3 modos:
   - **🤖 Automático** — defaults sensatos, placeholders donde haga falta, anota lo pendiente en `decisions[]`.
   - **💬 Manual** — pregunta una cosa a la vez, en orden del checklist.
   - **⏭️ Omitir** — solo crea regla fija (1-3); resto se deja, BOSS avisa si una tarea falla por config faltante.

#### Tabla de decisiones por modo

Documentada explícitamente qué hace cada modo en cada paso del checklist:

| Paso | 🤖 Automático | 💬 Manual | ⏭️ Omitir |
|---|---|---|---|
| 1-3 (regla fija) | crear sin preguntar | crear sin preguntar | crear sin preguntar |
| 4. `config.json` | crear vacío + anotar pendiente | preguntar empresa/industria/tono/audiencia | no crear |
| 5. `company.name` | dejar vacío + entrada en `decisions[]` | preguntar | dejar vacío |
| 6. `active_project` | **siempre preguntar** (sin default razonable) | preguntar | dejar vacío |
| 7-8. proyecto | crear con plantilla mínima | preguntar descripción | crear vacío si hace falta |

**Reglas:** BOSS nunca inventa nombre de empresa ni de proyecto (incluso en automático). Si el usuario no contesta o elige un modo no listado, asume manual. Decisión final = del usuario.

#### Cambios al checklist

Se separó "existe `config.json`" (paso 4) de "tiene `company.name`" (paso 5). El bootstrap anterior los mezclaba implícitamente, lo que dejaba sesiones funcionando con `config.json` creado pero `company.*` totalmente vacío sin avisar.

### Archivos tocados

- `.aigent/BOSS.md` — secciones `Bootstrap` (reescrita), `Lo primero` (referencia al nuevo flujo), `Reglas de oro` (nueva regla al inicio).
- `.aigent/VERSION` — bump a 2.4.0.

---
## 2.3.0 — 2026-05-18

### Limpieza de stubs, Operations activado, routing de BOSS reescrito

Tres cambios coordinados que mejoran cómo BOSS llega a cada orquestador y eliminan inconsistencias visuales en el frontmatter de los stubs.

#### 1. Sufijos "(TODO)" / "(no implementado)" eliminados del `name:`

Los 9 archivos en estado stub llevaban marcadores en el `name:` del frontmatter que ensuciaban el menú del IDE. Ahora el `name:` está limpio y la condición de stub se infiere del `description` (que sigue diciendo "marked as TODO" / "not yet implemented") — el comando `audit-repo` ya detectaba stubs por description, no por name.

| Antes | Ahora |
|---|---|
| `[DevOps] Orchestrator (no implementado)` | `[DevOps] Orchestrator` |
| `[DevOps] Incident (TODO)` | `[DevOps] Incident` |
| `[Operations] Automation (TODO)` | `[Operations] Automation` |
| (4 agentes devops + 4 operations + 1 orquestador devops) | (todos limpios) |

#### 2. Operations pasa a "✅ parcial"

El estado "TODO completo" de Operations era inconsistente: la skill `operations-redmine` (v2 ejecutable) lleva funcional desde 1.x. Ahora se reconoce explícitamente:

- **`operations-orchestrator.md` reescrito** siguiendo `_shared/orchestrator-template.md`. La description ya no menciona TODO. El orquestador documenta sus 10 acciones Redmine, el patrón de invocación directa al engine (sin agente intermedio), readiness con `doctor`, secrets rule, y registro de tareas fuera de Redmine como TODO para los 4 agentes stub.
- Los 4 agentes especialistas (`operations-automation`, `operations-kpis`, `operations-processes`, `operations-suppliers`) **siguen siendo stubs honestos** — su description mantiene "TODO" para que el audit los detecte. El orquestador rechaza delegarles.
- README maestro: Operations pasa de "🚧 parcial" a "✅ parcial" con la nota de los 4 stubs.

#### 3. BOSS.md — tabla de routing canónica + disambiguación

Reescritas las secciones `Departamentos` y `Cómo enrutar`:

- **Tabla canónica de routing**: cada fila lista el `name:` exacto del orquestador (`[Marketing] Orchestrator`, etc.). BOSS delega anunciando `Delegando en <name>` sin inventar alias.
- **Tabla de disambiguación**: 11 filas que resuelven solapamientos típicos (Marketing↔Sales, Marketing↔Product, Marketing↔Design, Sales↔Operations, Product↔Software, Software↔DevOps, Design↔Product, HR↔Operations, Finance↔Operations, Legal+cualquiera, "+PRD" en cualquier dept).
- **Patrón de delegación en 6 pasos**: identificar dept → anunciar → pasar contexto (decisions globales + del dept + PRD) → dejar al orquestador su Paso 0.5 → secuenciar si la petición cruza depts → ofrecer PRD antes si la tarea es grande.
- **Sección "Petición a un dept TODO"**: ahora aplica solo a DevOps (Operations dejó de ser TODO).

### Archivos tocados

- `.aigent/departments/devops/devops-orchestrator.md` + `agents/{devops-incident, devops-infrastructure, devops-monitoring, devops-pipeline}.md` — `name:` limpio.
- `.aigent/departments/operations/operations-orchestrator.md` — **reescrito completo** (de 23 líneas stub a ~250 líneas funcionales).
- `.aigent/departments/operations/agents/{operations-automation, operations-kpis, operations-processes, operations-suppliers}.md` — `name:` limpio.
- `.aigent/BOSS.md` — secciones `Departamentos`, `Petición a un dept TODO`, `Cómo enrutar`, `Reglas de oro` reescritas.
- `.aigent/README.md` — estado de Operations actualizado.

### Verificación

- `node engine.js audit-repo` → 0 errores; sigue detectando los 4 agentes stub de Operations + el orquestador y 4 agentes stub de DevOps como tales (description menciona TODO / not yet implemented).
- BOSS.md y `operations-orchestrator.md` ya usan el `name:` canónico (`[Marketing] Orchestrator`, `operations-redmine`) consistente con el resto del repo.

---
## 2.2.0 — 2026-05-18

### Auditoría estructural del repo + `--prune` del installer

Dos capacidades operativas que blindan futuras iteraciones del framework, sin tocar el contrato de skills/agentes.

#### 1. Comando `engine.js audit-repo`

Auditoría estructural de TODO el repo en una sola llamada (no solo skills v2, también v1 y agentes). Reporta errores (bloquean) y warnings (no bloquean) en JSON estructurado.

```bash
node .aigent/v2/engine/engine.js audit-repo
```

Comprueba:

- **Skills (86):** carpeta empieza por el prefijo correcto (`<dept>-` o `shared-`), `name:` == dirname, `user-invocable: true`, secciones obligatorias del body (v1: `# Skill:`, `**Entregable:**`, `## Cuándo usar esta skill`; v2: presencia de bloques `\`\`\`http name=`).
- **Agentes (51):** `name`, `mode`, `description` en frontmatter; `mode == primary` para orquestadores y `subagent` para resto; secciones del body §5 (Rol, Principios, Proceso de trabajo, Skills disponibles, Restricciones, Output esperado); para stubs honestos: `## Estado` + `## Qué hacer`. Warnings si "Output esperado" no referencia `output-rules.md`.

Resultado actual del repo: **0 errores en skills, 0 errores en agentes, 3 warnings legítimos** (`shared-prd-agent` es un agente atípico cuyo body es la propia plantilla de PRD — el reporte lo visibiliza sin bloquear).

Nuevo archivo: `.aigent/v2/engine/audit.js`. Cableado en `engine.js` como comando `audit-repo`.

#### 2. Flag `--prune` en el installer

Tras el rename de carpetas en 2.1.0, los deployments existentes tienen carpetas obsoletas (`.claude/skills/blog-post/` además de `.claude/skills/marketing-blog-post/`). El nuevo flag `--prune` las elimina al final del install:

```bash
bash .aigent/IDE/install.sh --sync --prune --ide all --dept all
```

**Lógica conservadora.** Solo toca carpetas en destino que cumplan dos condiciones:
1. Su nombre empieza por un prefijo Aigent reconocido (`shared-` o `<dept>-` de algún dept existente en el repo).
2. NO existe la carpeta source equivalente en `.aigent/departments/<dept>/skills/<folder>/`.

Carpetas con otros nombres (skills de otros sistemas, customs del usuario en `.claude/skills/custom-stuff/`) **nunca se tocan**. Compatible con `--dry-run` para previsualizar.

Aplicado a ambos installers: `install.sh` (función `prune_orphans`) e `install.ps1` (función `Invoke-PruneOrphans`).

### Archivos tocados

- `.aigent/v2/engine/audit.js` — nuevo.
- `.aigent/v2/engine/engine.js` — importa `auditRepo`, añade comando `audit-repo` al CLI y al help.
- `.aigent/IDE/install.sh` — flag `--prune`, banner correspondiente, función `prune_orphans`, llamada tras `install_for_ide`, ayuda actualizada.
- `.aigent/IDE/install.ps1` — switch `-Prune`, banner, función `Invoke-PruneOrphans`, llamada análoga.

### Verificación

- `node engine.js audit-repo` → `ok: true`, 0 errores, 3 warnings legítimos (atípicos por diseño).
- `bash install.sh --sync --prune --ide claude --mode project --dept all --dry-run` con 3 carpetas test (`marketing-old-orphan`, `shared-old-orphan`, `custom-noprefix-user`) en `.claude/skills/` → detecta y marca las 2 primeras como huérfanas, ignora la tercera (sin prefijo Aigent).

---
## 2.1.0 — 2026-05-18

### Las carpetas de skills también llevan prefijo del dept

Continuación del bump 2.0.0. La regla anterior decía "carpeta sin prefijo, `name:` con prefijo". Ahora **ambos coinciden** (§4.1 reescrita): la carpeta lleva el prefijo y el `name:` del frontmatter es exactamente el dirname.

| Antes (2.0.0) | Ahora (2.1.0) |
|---|---|
| `marketing/skills/blog-post/` + `name: "marketing-blog-post"` | `marketing/skills/marketing-blog-post/` + `name: "marketing-blog-post"` |
| `_shared/skills/competitive-analysis/` + `name: "shared-competitive-analysis"` | `_shared/skills/shared-competitive-analysis/` + `name: "shared-competitive-analysis"` |
| `operations/skills/redmine/` + `name: "operations-redmine"` | `operations/skills/operations-redmine/` + `name: "operations-redmine"` |

**Excepción "no doblar prefijo".** Si la base ya empezaba por el prefijo del dept (`marketing-plan`, `product-roadmap`, `sales-playbook`, `sales-proposal`, `design-handoff-checklist`, `design-token-set`), la carpeta se queda y el `name:` se ajusta a `marketing-plan` (no `marketing-marketing-plan`). 6 casos detectados y corregidos.

### Archivos tocados

- **80 carpetas renombradas** vía `os.rename`. 6 carpetas se mantienen (ya tenían prefijo) — el `name:` de sus SKILL.md se ajustó para quitar el doble prefijo introducido por 2.0.0.
- **Convenciones**: §4 tabla actualizada (carpeta = `<dept-prefix>-<base>`). §4.1 reescrita con la nueva regla, la excepción de no-doblar, y nota de que `tools.<key>.path` sigue siendo independiente del `name:`.
- **`shared-skill-scaffold/SKILL.md`**: tabla de "Información común" actualizada (`base`, `folder` y `name` derivados). Plantillas v1 y v2 con `name: "<dept-prefix>-<base>"`. Plantilla v2: `path: tools.<base>.base_url` (no `<folder>`, para mantener config sin prefijo).
- **Engine v2**:
  - `engine.js`: `expectedName` para el lint pasa de `<dept>-<dirname>` a `<dirname>` (carpeta == name canónico).
  - `lint.js`: mensaje del warning actualizado ("does not match the folder name").
- **Installer**:
  - `install.sh`: `install_skill` recibe `$skills_base/${skill_name}` directamente (no `$skills_base/${dept_name}-${skill_name}` ni `$skills_base/shared-${skill_name}` — el dirname ya tiene prefijo). Stub generado: `name: __SKILL__` y comandos del cuerpo usan `__SKILL__` (no `__DEPT__-__SKILL__`).
  - `install.ps1`: mismo cambio.
- **READMEs y BOSS.md**: 55 referencias a paths viejos (`<dept>/skills/<base>/`) actualizadas a `<dept>/skills/<new-folder>/` en `CLAUDE.md`, `README.md` raíz, `.aigent/README.md`, `.aigent/BOSS.md`, `.aigent/v2/README.md`, `.aigent/CHANGELOG.md` (la entrada de 2.0.0 también se reescribió para usar los paths nuevos), `_shared/agents/shared-skill-builder.md`, `_shared/skills/shared-skill-scaffold/SKILL.md`.

### Migración para deployments existentes

1. Pull del repo.
2. Re-ejecutar `bash .aigent/IDE/install.sh --sync` (Linux/macOS) o `pwsh .aigent/IDE/install.ps1 -Sync` (Windows). Las carpetas viejas (`.claude/skills/marketing-blog-post/` etc.) ya tenían el nombre canónico desde 2.0.0 — el installer las regenera con el contenido nuevo. Si quedan carpetas duplicadas con nombres viejos (por ejemplo `.claude/skills/blog-post/`), borrarlas manualmente.
3. Si tenías scripts externos referenciando paths como `.aigent/departments/marketing/skills/blog-post/`, actualizarlos a `.aigent/departments/marketing/skills/marketing-blog-post/`.
4. La config en `.context/config.json` (`tools.redmine.base_url`) NO requiere cambios — `config.path` se mantiene como `tools.<base>.<key>`.

### Validación

- `engine.js list` → devuelve `operations-redmine` v0.4.0 (carpeta: `operations/skills/operations-redmine/`).
- `engine.js validate operations-redmine` → `ok: true`, 0 warnings (lint reconoce que `name == dirname`).

---
## 2.0.0 — 2026-05-18

### Cambios de contrato — bump MAJOR

Tres cambios coordinados al frontmatter de skills y agentes. Afectan a **todo** SKILL.md y a todo agente del repo. Los stubs regenerados por el installer ya casan; los deployments existentes deben re-instalar con `install.sh --sync` para refrescar `.claude/skills/` y `.opencode/skills/`. Los usuarios que invocan `engine.js run <skill>` desde scripts externos deben actualizar el nombre — el contrato del CLI cambia.

#### 1. `name:` de skills lleva ahora prefijo de departamento (§4.1)

| Antes | Ahora |
|---|---|
| `name: "blog-post"` (carpeta `marketing/skills/marketing-blog-post/`) | `name: "marketing-blog-post"` |
| `name: "redmine"` (carpeta `operations/skills/operations-redmine/`) | `name: "operations-redmine"` |
| `name: "competitive-analysis"` (carpeta `_shared/skills/shared-competitive-analysis/`) | `name: "shared-competitive-analysis"` |
| `name: "skill-scaffold"` (meta-skill) | `name: "shared-skill-scaffold"` |

La **carpeta no cambia** — sigue siendo `blog-post/`, `redmine/`, etc. Solo el `name:` del frontmatter. Motivación: el engine v2 identifica skills por `manifest.name`, y los stubs en los IDEs ya viven en `<dept>-<skill>/` desde 1.5.x — esto cierra el drift entre source y stub. Engine v2: `engine.js run redmine` pasa a ser `engine.js run operations-redmine`. `config.<key>.path` se mantiene tal cual (independiente de `name:`), así que la config existente en `tools.redmine.base_url` sigue funcionando.

#### 2. `user-invocable: true` obligatorio en frontmatter de skills (§7.1)

Toda skill (v1 prosa, v2 ejecutable, meta-skill) ahora declara `user-invocable: true`. Es la marca que Claude Code y OpenCode usan para decidir si la skill aparece en el menú del usuario o solo cuando un agente la invoca programáticamente. Política del repo: todas son `user-invocable: true` — la barrera de "esto no lo debería usar el usuario" se pone en la `description`, no en el flag.

#### 3. `mode: primary | subagent` obligatorio en frontmatter de agentes (§5.1)

OpenCode lee este campo para clasificar agentes. Claude Code lo ignora.

- **Orquestadores** (`<dept>-orchestrator.md`) → `mode: primary` (10 archivos).
- **Especialistas** (`<dept>-<role>.md` en `agents/`) → `mode: subagent` (39 archivos).
- **Compartidos** (`shared-<role>.md` en `_shared/agents/`) → `mode: subagent` (2 archivos).

Total: 51 agentes con `mode:` añadido.

### Archivos tocados

#### Convenciones y plantillas

- `_shared/conventions.md` — §4 ampliada con §4.1 (regla de naming `<dept>-<folder>`), §5 ampliada con §5.1 (`mode:`), §7 ampliada con §7.1 (`user-invocable:`), §12.3 actualizada (frontmatter v2 con los nuevos campos y aclaración sobre `config.path`).
- `_shared/orchestrator-template.md` — añadido `mode: primary` al ejemplo del frontmatter.
- `_shared/skills/shared-skill-scaffold/SKILL.md` — plantillas v1 y v2 actualizadas con `<dept-prefix>-<folder>` y `user-invocable: true`; tabla de campos a recopilar aclara que el `name:` se deriva de carpeta+dept.
- `_shared/skills/shared-agent-scaffold/SKILL.md` — plantillas `create-specialist` y `create-stub` añaden `mode: subagent`; reglas estrictas actualizadas; checklist ampliado con `mode:`.

#### Skills (86 SKILL.md)

Renombrados de `name:` sin prefijo a `name:` con prefijo de dept (o `shared-` para `_shared/skills/`). `user-invocable: true` añadido tras la línea `name:`. Aplicado vía script idempotente — toda skill v1 y v2 del repo.

#### Agentes (51 .md)

`mode:` añadido tras la línea `name:`. 10 orquestadores → `primary`. 39 especialistas + 2 shared → `subagent`. Aplicado vía script idempotente.

#### Engine v2

- `engine.js` — `enumerateV2Skills()` ahora almacena `dirname` por skill. `validateSkillCmd` calcula `expectedName = <dept>-<dirname>` y se lo pasa al lint para warning de drift.
- `lint.js` — nuevos warnings: (a) si `manifest.name` no casa con `<dept>-<dirname>`, (b) si falta `user-invocable: true`.

#### Installer

- `install.sh` — el stub v2 generado añade `user-invocable: true`; los comandos del cuerpo del stub (`engine.js describe`/`run`) ahora usan `<dept>-<skill>` (no solo `<skill>`), igualando el nuevo contrato. Logs `(engine: ...)` actualizados.
- `install.ps1` — mismos cambios.

### Migración para deployments existentes

1. Pull del repo y re-ejecutar `bash .aigent/IDE/install.sh --sync` (Linux/macOS) o `pwsh .aigent/IDE/install.ps1 -Sync` (Windows) para regenerar stubs.
2. Si tenías scripts externos invocando `engine.js run redmine`, cambiarlos a `engine.js run operations-redmine`. (Solo Redmine en este repo; otras skills v2 que añadas a futuro respetan la regla desde el principio.)
3. La config en `.context/config.json` (`tools.redmine.base_url`) NO requiere cambios — `config.path` se mantiene.

### Notas

- **Doble prefijo "natural" en algunas skills.** Cuando la carpeta de la skill ya empezaba por el nombre del dept (`marketing/skills/marketing-plan/`), el `name:` resultante es `marketing-marketing-plan` — feo pero consistente con la regla. Casos detectados: `marketing-marketing-plan`, `finance-financial-report`. Si en el futuro se decide limpiar, renombrar las carpetas a `plan/`, `report/`, etc. (es un PATCH posterior, no parte de este bump).
- También se han actualizado las menciones de las skills en tablas de "Skills disponibles" de agentes, orquestadores y READMEs (445 reemplazos en 42 archivos) para usar los nombres canónicos con prefijo. Los textos quedan coherentes con el `name:` del frontmatter de cada SKILL.md.

### Validación

- `engine.js list` → devuelve `operations-redmine` (v0.4.0) correctamente.
- `engine.js validate operations-redmine` → `ok: true`, 0 warnings.
- `engine.js validate redmine` → `SKILL_NOT_FOUND` (esperado: el nombre viejo ya no existe).
- Audit estructural: 86/86 SKILL.md con `name:` correcto + `user-invocable: true`; 51/51 agentes con `mode:` correcto (10 primary, 41 subagent).

---
## 1.16.1 — 2026-05-18

### gitignore

Se ha añadido el gitignore

## 1.16.0 — 2026-05-14

### READMEs de casos de uso por departamento (9 nuevos)

Cada dept implementado (8) más `_shared/` ahora tiene un `README.md` con ejemplos completos de cada agente y cada skill: prompt de entrada realista, output esperado (estructura completa simulada con valores, tablas y snippets de 20-40 líneas) y ruta donde se guarda. Sirven como documentación viva para onboarding de usuarios, referencia rápida y como anti-fricción cuando se duda de qué pedir.

Cobertura total: **~130 casos de uso** (35 agentes especialistas + 2 transversales + 75 skills dept + 10 skills compartidas + flujos end-to-end típicos por dept).

---

### 9 READMEs nuevos

| Archivo | Contenido |
|---|---|
| `.aigent/departments/software/README.md` | 4 agentes + 19 skills + 1 shared. 23 ejemplos + flujo feature y bugfix end-to-end. |
| `.aigent/departments/marketing/README.md` | 5 agentes + 13 skills. 18 ejemplos + flujo de lanzamiento. |
| `.aigent/departments/sales/README.md` | 4 agentes + 11 skills + 3 shared referenciadas. 15 ejemplos + flujo del funnel. |
| `.aigent/departments/hr/README.md` | 4 agentes + 7 skills. 11 ejemplos + flujo recruitment→onboarding→evaluation. |
| `.aigent/departments/product/README.md` | 3 agentes + 6 skills + 6 shared referenciadas. 9 ejemplos + flujo discovery→roadmap→ship. |
| `.aigent/departments/finance/README.md` | 3 agentes + 7 skills + 2 shared referenciadas. 10 ejemplos + cierre mensual/trimestral/anual. |
| `.aigent/departments/legal/README.md` | 4 agentes + 6 skills + 2 shared referenciadas. 10 ejemplos + flujo onboarding cliente + audit. |
| `.aigent/departments/design/README.md` | 4 agentes + 6 skills + 1 shared referenciada. 10 ejemplos + flujo feature visual + DS update. |
| `.aigent/departments/_shared/README.md` | 2 agentes transversales (shared-prd-agent, shared-skill-builder) + 10 skills compartidas (2 meta + 8 business). 12 ejemplos + tabla de "cuándo invocar transversales vs depts". |

Estructura canónica de cada README (acordada con el usuario):

1. **Header** — frase + link al orquestador y al `.aigent/README` maestro.
2. **Cómo se invoca** — 3 vías (orquestador / agente / skill directa).
3. **Agentes** — un caso de uso por cada agente, con prompt + output esperado (estructura completa) + ruta.
4. **Skills propias del dept** — un caso de uso por cada skill (las que ya tienen ejemplo en su agente solo referencian).
5. **Skills compartidas usadas** — listado con referencia a `_shared/README.md`.
6. **Flujo end-to-end típico** — diagrama ASCII de cómo se encadenan agentes y skills en escenarios reales.

---

### Cross-reference desde `.aigent/README.md`

Nueva sección "Casos de uso por departamento" en el `.aigent/README.md` con tabla que linka a los 9 nuevos READMEs.

---

### Archivos editados

**READMEs nuevos:**
- `.aigent/departments/software/README.md` (nuevo)
- `.aigent/departments/marketing/README.md` (nuevo)
- `.aigent/departments/sales/README.md` (nuevo)
- `.aigent/departments/hr/README.md` (nuevo)
- `.aigent/departments/product/README.md` (nuevo)
- `.aigent/departments/finance/README.md` (nuevo)
- `.aigent/departments/legal/README.md` (nuevo)
- `.aigent/departments/design/README.md` (nuevo)
- `.aigent/departments/_shared/README.md` (nuevo)

**Cross-ref + versionado:**
- `.aigent/README.md` (sección "Casos de uso por departamento" añadida)
- `.aigent/VERSION` (1.15.0 → 1.16.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.15.0 — 2026-05-14

### Software — iteraciones 2+3+4: workflow coding + docs técnicas + deploy shared (9 skills nuevas)

Segunda tanda de la ampliación del dept Software. Se cierran las tres iteraciones restantes del plan en un solo release: (2) workflow skills agnósticos de lenguaje para `software-coding`, (3) skills de documentación técnica para `software-architecture` con scope ampliado, y (4) `deploy-checklist` como skill compartida usable por software hoy y devops mañana. Aplicación reiterada de la regla "menos agentes ≠ mejor": ningún agente nuevo, todo encaja como skills colgando de los 4 existentes.

**Estado tras esta versión:** 85 skills totales (75 dept-específicas + 8 business compartidas + 2 meta). Software pasa de 11 a 19 skills (+8 propias + 1 shared accesible). El `_shared/` business pasa de 7 a 8 skills.

---

### Iteración 2 — 4 workflow skills nuevas en `software/skills/` (consumidora: `software-coding`)

- **`feature-implementation`** — Workflow estructurado para implementar una feature desde spec. Pre-flight: lectura del spec, lectura del contexto del repo (módulo + ADRs + decisions + tests existentes), planificación (archivos previstos, dependencias nuevas, tests a producir, riesgos), confirmación con el usuario si hay desviaciones. Ejecución: cambios con `Edit/Write`, tests al lado, atomicidad estricta, sin comentarios redundantes. Post-flight: reporte con archivos tocados, AC cubiertos (✅/🟡/❌), tests añadidos / pendientes, TODOs, decisiones tomadas, próximos pasos. Vive el reporte en `<proyecto>/software/code/.reports/feature-<slug>.md`.
- **`bugfix-workflow`** — Workflow para arreglar un bug en 4 pasos: (1) Reproduce — reproducción confirmada local antes de tocar nada. (2) Diagnose — root cause analysis con evidencia, distingue síntoma de causa. (3) Fix — approach + alternativas descartadas + cambio mínimo. (4) Regression test — debe fallar pre-fix y pasar post-fix. Validación: reproducción original deja de reproducirse, suite verde. Comunicación: mensaje para el reporter sin jerga, decisión sobre nota de changelog y postmortem si Critical.
- **`refactor-plan`** — Plan de refactor escrito ANTES de tocar código. Cubre motivación con deuda concreta, scope IN/OUT explícito (anti-creep), approach con alternativas, branch strategy (all-at-once/branch-by-abstraction/feature-flag/strangler-fig), safety nets (tests existentes + characterization a añadir + monitoring + flag), validación, rollback. Tras ejecutar el plan, se cierra el archivo con bloque "Resultado" (diff stats, sorpresas, decisiones, próximos pasos). Estado del archivo: Planned → In progress → Done | Reverted | Partial.
- **`dependency-bump`** — Workflow para subir una dependencia. Assessment: changelog upstream entre versiones (no se saltan versiones intermedias sin leerlas), breaking changes que afectan al repo concretamente (no en abstracto), deps transitivas, compatibilidad con runtime, riesgo global (🟢/🟡/🟠/🔴). Plan: pasos de bump, código a adaptar, configuración/build, tests. Safety nets + validación + rollback. Cierre con resultado. Cubre majors con cuidado (especial atención a `0.x.y` por convenciones laxas de semver en muchos ecosistemas).

### Iteración 3 — 4 docs skills nuevas en `software/skills/` (consumidora: `software-architecture` con scope ampliado)

- **`readme`** — README.md del proyecto adaptado al tipo (library / CLI / web app / API / monorepo / internal tool). Estructura canónica: one-liner + qué resuelve + quick start (requisitos + instalación + primer uso) + uso/API por tipo + configuración (tabla de env vars sin valores) + estructura del repo + tests + deploy resumido + documentación adicional con links + contribuir + licencia + mantenedores. Reglas estrictas: sin marketing-speak, comandos ejecutables tal cual, versiones explícitas, links relativos. Vive en raíz del repo.
- **`code-docs-style`** — Guía canónica de documentación inline del proyecto. Por cada lenguaje en el repo: formato obligatorio (JSDoc/TSDoc, Google/NumPy docstring, godoc, rustdoc, KDoc, phpDoc), tags admitidos, ejemplo canónico real, anti-patrones. Convenciones transversales: idioma de la doc, naming dentro de la doc, política `TODO`/`FIXME`/`XXX` (formato obligatorio con author + ticket, sin author bloquea en review), comentarios autogenerados. Política de doc generada si aplica. Enforcement por linter/CI. Vive en `<proyecto>/software/architecture/code-docs-style.md`.
- **`dev-guide`** — Guía de desarrollo extendida del proyecto. Documento vivo. Cubre visión rápida, setup del entorno (con `cp .env.example .env`, docker compose, smoke test de "el setup funciona"), estructura del repo, cómo corre en local, tests por nivel con tiempos, workflow (branching, commits, PRs, release), **common tasks** ("¿cómo añado un endpoint / migración / test e2e?"), referencias a ADRs (resumen + link), troubleshooting con síntomas/causas comunes. Mantenida por owner identificado. Vive en `<proyecto>/docs/dev-guide.md`.
- **`migration-guide`** — Guía pública de migración de versión X a Y dirigida a CONSUMIDORES (devs que usan la librería, integradores de API, admins del CLI). Audiencia distinta a dev-guide. Cubre TL;DR + pre-requisitos + mapa de cambios + cada breaking change con antes/después (snippet ejecutable) + cambios silenciosos (defaults que cambian) + deprecations + plan paso a paso + validación + rollback + FAQ + soporte de versión anterior. Codemod recomendado si la migración es mecánica. Difícultad explícita (🟢/🟡/🟠) en TL;DR.

### Iteración 4 — 1 skill shared nueva en `_shared/skills/` (consumidora: `software-architecture`, `software-coding`, futura `devops-pipeline`)

- **`deploy-checklist`** — Checklist completa pre/durante/post-deploy de un release adaptado al riesgo (🟢/🟡/🟠/🔴) y a la estrategia (instant/canary/blue-green/progressive/rolling). Pre-deploy: código & tests (CI verde, tag creado, artefacto publicado), especificación & docs (changelog, migration guide, release notes), configuración del entorno (env vars, secrets aprovisionados, permisos), schema & datos (migration reversible, backup, backfill, orden de despliegue), feature flags (estado inicial, criterio de promoción/retirada), comunicación, personas y roles (owner + backup + aprobador para 🟠/🔴). Durante: tabla de pasos con timestamps reales + smoke tests con health checks + caminos críticos manuales + e2e automatizados. Post-deploy: métricas a vigilar con umbrales y acción si se cruzan, confirmaciones funcionales, comunicación de cierre. Rollback con punto sin retorno explícito. Cierre con notas para el siguiente deploy. **Skill compartida**: hoy la consume software, mañana también devops (`devops-pipeline`/`devops-incident`) cuando el dept se active.

---

### Scope ampliado de `software-architecture` (decisión registrada con el usuario)

El agente pasa de "Architecture & Technical Design" a **"Architecture, Technical Design & Documentation"**. Cambios concretos:

- **Frontmatter `description`** ampliada para mencionar explícitamente la documentación técnica como entregable propio.
- **Sección Rol** reescrita: misión dual (decisiones + documentación humana del proyecto).
- **Sección "Tipos de entregables"** suma "Documentación técnica" con un párrafo por cada uno de los 4 nuevos entregables (README, dev-guide, code-docs-style, migration-guide, deploy-checklist).
- **Sección "Skills disponibles"** ahora lista 5 skills propias previas + 5 docs skills nuevas + 2 shared (`risk-matrix` y `deploy-checklist`).

Razonamiento documentado en el plan acordado con el usuario: la doc técnica del proyecto (README, dev guide, migration guide) tiene proceso propio pero está más cerca del autor del sistema que del implementador de código, por lo que encaja mejor en architecture que en coding. Decisión tomada en lugar de crear un agente `software-docs` separado (aplicación de "menos agentes ≠ mejor").

---

### Agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `readme`, `code-docs-style`, `dev-guide`, `migration-guide` + `deploy-checklist` (shared). Total: 5 propias previas + 4 docs nuevas + 2 shared (risk-matrix y deploy-checklist) = **11 skills accesibles**. |
| `software-coding` | `feature-implementation`, `bugfix-workflow`, `refactor-plan`, `dependency-bump` + `deploy-checklist` (shared). Total: 3 git skills previas + 4 workflow nuevas + 1 shared = **8 skills accesibles**. |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar los nuevos workflows y documentos.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para:

- **`software-architecture`** (skills nuevas docs + deploy + scope ampliado): "README", "documenta el proyecto/módulo", "guía de desarrollo", "dev guide", "guía de migración", "migration guide", "guía de docs", "estilo de docstrings", "deploy checklist", "checklist de release".
- **`software-coding`** (workflows + deploy): "feature-implementation", "bugfix", "subir dependencia", "dep bump", "actualiza la versión de", "deploy checklist", "preparar release".
- **Tabla de decisión rápida**: 4 filas nuevas (docs en architecture, deploy-checklist, dep bump en coding, workflows implícitos via las señales de "implementa/fix el bug/refactoriza" ya existentes).

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos": Software 11 → 19 skills. `_shared/` 7 → 8 business compartidas.
- Sección "Detalle por departamento → `_shared/`": tabla business-skills compartidas añade `deploy-checklist` con consumidores documentados.
- Sección "Detalle por departamento → Software": tabla de agentes refleja skills propias actualizadas y compartidas. Tabla de skills pasa de 11 a 19 filas con las 8 nuevas + nota de "más 1 compartida `deploy-checklist`".
- Catálogo rápido: tabla Software pasa de 11 a 19 filas. Tabla "Skills compartidas" pasa de 9 a 10 con `deploy-checklist`. Encabezado "Skills compartidas (9 = 2 meta + 7 business)" → "Skills compartidas (10 = 2 meta + 8 business)". Encabezado "Skills dept-específicas (67)" → "Skills dept-específicas (75)".

**`README.md` raíz**:

- Tabla de estado: Software 11 → 19. `_shared/` 9 → 10 (8 business).
- Total: 76 → 85 skills (75 dept-específicas + 8 business compartidas + 2 meta).

---

### Archivos editados

**Iteración 2 — workflow coding:**
- `.aigent/departments/software/skills/software-feature-implementation/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-bugfix-workflow/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-refactor-plan/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-dependency-bump/SKILL.md` (nuevo)

**Iteración 3 — docs technicas:**
- `.aigent/departments/software/skills/software-readme/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-code-docs-style/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-dev-guide/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-migration-guide/SKILL.md` (nuevo)

**Iteración 4 — deploy shared:**
- `.aigent/departments/_shared/skills/shared-deploy-checklist/SKILL.md` (nueva, compartida)

**Agentes y orquestador:**
- `.aigent/departments/software/agents/software-architecture.md` (scope ampliado + 5 skills nuevas listadas)
- `.aigent/departments/software/agents/software-coding.md` (workflows + deploy listados)
- `.aigent/departments/software/software-orchestrator.md` (señales + tabla de decisión actualizadas)

**Catálogo y versionado:**
- `.aigent/README.md` (tabla estado + sección _shared/ + detalle Software + catálogo rápido + totales)
- `README.md` (raíz) (tabla estado + total)
- `.aigent/VERSION` (1.14.0 → 1.15.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.14.0 — 2026-05-14

### Software — iteración 1: spec-review + git workflow (4 skills nuevas)

Primera tanda de la ampliación del dept Software discutida con el usuario. Se añaden 4 skills v1 prosa que cubren dos huecos identificados: (1) revisión y scoring de specs antes de implementación (`spec-review`), y (2) productos "laterales" del ciclo de implementación que `software-coding` no estaba cubriendo — mensaje de commit, descripción de PR y entrada de changelog. Sin agentes nuevos: aplicación de la regla "menos agentes ≠ mejor" — todo encaja como skills colgando de los agentes existentes.

**Estado tras esta versión:** 76 skills totales (67 dept-específicas + 7 business compartidas + 2 meta). Software pasa de 7 a 11 skills, sigue con 4 agentes. `software-coding` deja de no tener skills propias.

---

### 4 skills dept-específicas nuevas (todas en `software/`)

- **`spec-review`** — Review y scoring de un spec existente (PRD/ADR/tech-spec/api-spec) con rubric de 6 dimensiones (Completeness, Clarity, Testability, Consistency, Risk awareness, Actionability), score 0-5 por dimensión y total /30 con grado (🟢/🟡/🟠/🔴), hallazgos por severidad (🔴/🟠/🟡/🔵), top 3, lo positivo y veredicto (✅ / 🟠 / 🔴). Sirve como gate antes de pasar un spec a implementación. Vive en `<proyecto>/software/reviews/spec-review-<tipo>-<slug>.md`. Consumidora: `software-architecture`.
- **`commit-message`** — Mensaje de commit a partir del diff staged. Default Conventional Commits con tipos canónicos (feat/fix/refactor/perf/docs/test/build/ci/chore/style/revert), scope opcional derivado del path, `!` para breaking, footer con BREAKING CHANGE/Refs/Closes/Co-authored-by. Reglas estrictas: subject < 50 chars, imperativo, sin punto final, atomicidad (rechaza commits que mezclan cambios). Output: bloque en chat para pegar en `git commit`. Consumidora: `software-coding`.
- **`pr-description`** — Descripción de Pull Request cruzando spec asociado + diff + commits. Estructura canónica: Qué cambia / Por qué (con refs) / Cómo (approach) / Cambios principales (tabla archivo→cambio) / Testing (añadidos + pendientes + manual) / Impacto (breaking/áreas/riesgos/rollback) / Screenshots / Checklist autor / Para el reviewer. Respeta plantillas del repo (`.github/PULL_REQUEST_TEMPLATE.md`) si existen. Detecta atomicidad rota y breaking change para alertar. Consumidora: `software-coding`.
- **`changelog-entry`** — Entrada `## [X.Y.Z] — YYYY-MM-DD` Keep a Changelog a partir de PRs merged del release. Mapea Conventional Commits a categorías (Added/Changed/Deprecated/Removed/Fixed/Security) con sección BREAKING CHANGES arriba marcada con ⚠️. Valida coherencia semver (BREAKING → major, Added → minor, Fixed → patch). Filtra commits internos no relevantes para el consumidor. Actualiza también el bloque `[Unreleased]` y los links de comparación al final del archivo. Consumidora: `software-coding`.

---

### 2 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `spec-review` (ahora 5 skills propias + 1 shared) |
| `software-coding` | `commit-message`, `pr-description`, `changelog-entry` (pasa de "sin skills propias" a 3 skills) |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar las nuevas categorías de output.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para las nuevas skills:

- **`software-architecture`**: "revisa este PRD/ADR/spec", "scoring del spec", "spec review", "está bien este PRD".
- **`software-coding`**: "mensaje de commit", "commit message", "descripción de PR", "PR description", "changelog", "release notes técnicas".
- **Tabla de decisión rápida**: 2 filas nuevas (spec-review y skills de git workflow) más afinado el wording de las filas de code-review para evitar colisión con spec-review.

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos" — Software pasa de 7 a 11 skills.
- Sección "Detalle por departamento → Software" — tabla de agentes (4) refleja nuevas skills propias; tabla de skills (11) incluye las 4 nuevas con su entregable.
- Catálogo rápido — "Software (4 agentes activos + 1 implementador sin skill)" → "Software (4)". Tabla Software del catálogo pasa de 7 a 11 filas.
- "Skills dept-específicas (63)" → "Skills dept-específicas (67)".

**`README.md` raíz**:

- Tabla de estado: Software 7 → 11.
- Total: 72 → 76 skills (67 dept-específicas + 7 business + 2 meta).

---

### Archivos editados

- `.aigent/departments/software/skills/software-spec-review/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-commit-message/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-pr-description/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/software-changelog-entry/SKILL.md` (nuevo)
- `.aigent/departments/software/agents/software-architecture.md`
- `.aigent/departments/software/agents/software-coding.md`
- `.aigent/departments/software/software-orchestrator.md`
- `.aigent/README.md`
- `README.md` (raíz)
- `.aigent/VERSION` (1.13.0 → 1.14.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---
## 1.16.1 — 2026-05-18

### gitignore

Se ha añadido el gitignore

## 1.16.0 — 2026-05-14

### READMEs de casos de uso por departamento (9 nuevos)

Cada dept implementado (8) más `_shared/` ahora tiene un `README.md` con ejemplos completos de cada agente y cada skill: prompt de entrada realista, output esperado (estructura completa simulada con valores, tablas y snippets de 20-40 líneas) y ruta donde se guarda. Sirven como documentación viva para onboarding de usuarios, referencia rápida y como anti-fricción cuando se duda de qué pedir.

Cobertura total: **~130 casos de uso** (35 agentes especialistas + 2 transversales + 75 skills dept + 10 skills compartidas + flujos end-to-end típicos por dept).

---

### 9 READMEs nuevos

| Archivo | Contenido |
|---|---|
| `.aigent/departments/software/README.md` | 4 agentes + 19 skills + 1 shared. 23 ejemplos + flujo feature y bugfix end-to-end. |
| `.aigent/departments/marketing/README.md` | 5 agentes + 13 skills. 18 ejemplos + flujo de lanzamiento. |
| `.aigent/departments/sales/README.md` | 4 agentes + 11 skills + 3 shared referenciadas. 15 ejemplos + flujo del funnel. |
| `.aigent/departments/hr/README.md` | 4 agentes + 7 skills. 11 ejemplos + flujo recruitment→onboarding→evaluation. |
| `.aigent/departments/product/README.md` | 3 agentes + 6 skills + 6 shared referenciadas. 9 ejemplos + flujo discovery→roadmap→ship. |
| `.aigent/departments/finance/README.md` | 3 agentes + 7 skills + 2 shared referenciadas. 10 ejemplos + cierre mensual/trimestral/anual. |
| `.aigent/departments/legal/README.md` | 4 agentes + 6 skills + 2 shared referenciadas. 10 ejemplos + flujo onboarding cliente + audit. |
| `.aigent/departments/design/README.md` | 4 agentes + 6 skills + 1 shared referenciada. 10 ejemplos + flujo feature visual + DS update. |
| `.aigent/departments/_shared/README.md` | 2 agentes transversales (shared-prd-agent, shared-skill-builder) + 10 skills compartidas (2 meta + 8 business). 12 ejemplos + tabla de "cuándo invocar transversales vs depts". |

Estructura canónica de cada README (acordada con el usuario):

1. **Header** — frase + link al orquestador y al `.aigent/README` maestro.
2. **Cómo se invoca** — 3 vías (orquestador / agente / skill directa).
3. **Agentes** — un caso de uso por cada agente, con prompt + output esperado (estructura completa) + ruta.
4. **Skills propias del dept** — un caso de uso por cada skill (las que ya tienen ejemplo en su agente solo referencian).
5. **Skills compartidas usadas** — listado con referencia a `_shared/README.md`.
6. **Flujo end-to-end típico** — diagrama ASCII de cómo se encadenan agentes y skills en escenarios reales.

---

### Cross-reference desde `.aigent/README.md`

Nueva sección "Casos de uso por departamento" en el `.aigent/README.md` con tabla que linka a los 9 nuevos READMEs.

---

### Archivos editados

**READMEs nuevos:**
- `.aigent/departments/software/README.md` (nuevo)
- `.aigent/departments/marketing/README.md` (nuevo)
- `.aigent/departments/sales/README.md` (nuevo)
- `.aigent/departments/hr/README.md` (nuevo)
- `.aigent/departments/product/README.md` (nuevo)
- `.aigent/departments/finance/README.md` (nuevo)
- `.aigent/departments/legal/README.md` (nuevo)
- `.aigent/departments/design/README.md` (nuevo)
- `.aigent/departments/_shared/README.md` (nuevo)

**Cross-ref + versionado:**
- `.aigent/README.md` (sección "Casos de uso por departamento" añadida)
- `.aigent/VERSION` (1.15.0 → 1.16.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.15.0 — 2026-05-14

### Software — iteraciones 2+3+4: workflow coding + docs técnicas + deploy shared (9 skills nuevas)

Segunda tanda de la ampliación del dept Software. Se cierran las tres iteraciones restantes del plan en un solo release: (2) workflow skills agnósticos de lenguaje para `software-coding`, (3) skills de documentación técnica para `software-architecture` con scope ampliado, y (4) `deploy-checklist` como skill compartida usable por software hoy y devops mañana. Aplicación reiterada de la regla "menos agentes ≠ mejor": ningún agente nuevo, todo encaja como skills colgando de los 4 existentes.

**Estado tras esta versión:** 85 skills totales (75 dept-específicas + 8 business compartidas + 2 meta). Software pasa de 11 a 19 skills (+8 propias + 1 shared accesible). El `_shared/` business pasa de 7 a 8 skills.

---

### Iteración 2 — 4 workflow skills nuevas en `software/skills/` (consumidora: `software-coding`)

- **`feature-implementation`** — Workflow estructurado para implementar una feature desde spec. Pre-flight: lectura del spec, lectura del contexto del repo (módulo + ADRs + decisions + tests existentes), planificación (archivos previstos, dependencias nuevas, tests a producir, riesgos), confirmación con el usuario si hay desviaciones. Ejecución: cambios con `Edit/Write`, tests al lado, atomicidad estricta, sin comentarios redundantes. Post-flight: reporte con archivos tocados, AC cubiertos (✅/🟡/❌), tests añadidos / pendientes, TODOs, decisiones tomadas, próximos pasos. Vive el reporte en `<proyecto>/software/code/.reports/feature-<slug>.md`.
- **`bugfix-workflow`** — Workflow para arreglar un bug en 4 pasos: (1) Reproduce — reproducción confirmada local antes de tocar nada. (2) Diagnose — root cause analysis con evidencia, distingue síntoma de causa. (3) Fix — approach + alternativas descartadas + cambio mínimo. (4) Regression test — debe fallar pre-fix y pasar post-fix. Validación: reproducción original deja de reproducirse, suite verde. Comunicación: mensaje para el reporter sin jerga, decisión sobre nota de changelog y postmortem si Critical.
- **`refactor-plan`** — Plan de refactor escrito ANTES de tocar código. Cubre motivación con deuda concreta, scope IN/OUT explícito (anti-creep), approach con alternativas, branch strategy (all-at-once/branch-by-abstraction/feature-flag/strangler-fig), safety nets (tests existentes + characterization a añadir + monitoring + flag), validación, rollback. Tras ejecutar el plan, se cierra el archivo con bloque "Resultado" (diff stats, sorpresas, decisiones, próximos pasos). Estado del archivo: Planned → In progress → Done | Reverted | Partial.
- **`dependency-bump`** — Workflow para subir una dependencia. Assessment: changelog upstream entre versiones (no se saltan versiones intermedias sin leerlas), breaking changes que afectan al repo concretamente (no en abstracto), deps transitivas, compatibilidad con runtime, riesgo global (🟢/🟡/🟠/🔴). Plan: pasos de bump, código a adaptar, configuración/build, tests. Safety nets + validación + rollback. Cierre con resultado. Cubre majors con cuidado (especial atención a `0.x.y` por convenciones laxas de semver en muchos ecosistemas).

### Iteración 3 — 4 docs skills nuevas en `software/skills/` (consumidora: `software-architecture` con scope ampliado)

- **`readme`** — README.md del proyecto adaptado al tipo (library / CLI / web app / API / monorepo / internal tool). Estructura canónica: one-liner + qué resuelve + quick start (requisitos + instalación + primer uso) + uso/API por tipo + configuración (tabla de env vars sin valores) + estructura del repo + tests + deploy resumido + documentación adicional con links + contribuir + licencia + mantenedores. Reglas estrictas: sin marketing-speak, comandos ejecutables tal cual, versiones explícitas, links relativos. Vive en raíz del repo.
- **`code-docs-style`** — Guía canónica de documentación inline del proyecto. Por cada lenguaje en el repo: formato obligatorio (JSDoc/TSDoc, Google/NumPy docstring, godoc, rustdoc, KDoc, phpDoc), tags admitidos, ejemplo canónico real, anti-patrones. Convenciones transversales: idioma de la doc, naming dentro de la doc, política `TODO`/`FIXME`/`XXX` (formato obligatorio con author + ticket, sin author bloquea en review), comentarios autogenerados. Política de doc generada si aplica. Enforcement por linter/CI. Vive en `<proyecto>/software/architecture/code-docs-style.md`.
- **`dev-guide`** — Guía de desarrollo extendida del proyecto. Documento vivo. Cubre visión rápida, setup del entorno (con `cp .env.example .env`, docker compose, smoke test de "el setup funciona"), estructura del repo, cómo corre en local, tests por nivel con tiempos, workflow (branching, commits, PRs, release), **common tasks** ("¿cómo añado un endpoint / migración / test e2e?"), referencias a ADRs (resumen + link), troubleshooting con síntomas/causas comunes. Mantenida por owner identificado. Vive en `<proyecto>/docs/dev-guide.md`.
- **`migration-guide`** — Guía pública de migración de versión X a Y dirigida a CONSUMIDORES (devs que usan la librería, integradores de API, admins del CLI). Audiencia distinta a dev-guide. Cubre TL;DR + pre-requisitos + mapa de cambios + cada breaking change con antes/después (snippet ejecutable) + cambios silenciosos (defaults que cambian) + deprecations + plan paso a paso + validación + rollback + FAQ + soporte de versión anterior. Codemod recomendado si la migración es mecánica. Difícultad explícita (🟢/🟡/🟠) en TL;DR.

### Iteración 4 — 1 skill shared nueva en `_shared/skills/` (consumidora: `software-architecture`, `software-coding`, futura `devops-pipeline`)

- **`deploy-checklist`** — Checklist completa pre/durante/post-deploy de un release adaptado al riesgo (🟢/🟡/🟠/🔴) y a la estrategia (instant/canary/blue-green/progressive/rolling). Pre-deploy: código & tests (CI verde, tag creado, artefacto publicado), especificación & docs (changelog, migration guide, release notes), configuración del entorno (env vars, secrets aprovisionados, permisos), schema & datos (migration reversible, backup, backfill, orden de despliegue), feature flags (estado inicial, criterio de promoción/retirada), comunicación, personas y roles (owner + backup + aprobador para 🟠/🔴). Durante: tabla de pasos con timestamps reales + smoke tests con health checks + caminos críticos manuales + e2e automatizados. Post-deploy: métricas a vigilar con umbrales y acción si se cruzan, confirmaciones funcionales, comunicación de cierre. Rollback con punto sin retorno explícito. Cierre con notas para el siguiente deploy. **Skill compartida**: hoy la consume software, mañana también devops (`devops-pipeline`/`devops-incident`) cuando el dept se active.

---

### Scope ampliado de `software-architecture` (decisión registrada con el usuario)

El agente pasa de "Architecture & Technical Design" a **"Architecture, Technical Design & Documentation"**. Cambios concretos:

- **Frontmatter `description`** ampliada para mencionar explícitamente la documentación técnica como entregable propio.
- **Sección Rol** reescrita: misión dual (decisiones + documentación humana del proyecto).
- **Sección "Tipos de entregables"** suma "Documentación técnica" con un párrafo por cada uno de los 4 nuevos entregables (README, dev-guide, code-docs-style, migration-guide, deploy-checklist).
- **Sección "Skills disponibles"** ahora lista 5 skills propias previas + 5 docs skills nuevas + 2 shared (`risk-matrix` y `deploy-checklist`).

Razonamiento documentado en el plan acordado con el usuario: la doc técnica del proyecto (README, dev guide, migration guide) tiene proceso propio pero está más cerca del autor del sistema que del implementador de código, por lo que encaja mejor en architecture que en coding. Decisión tomada en lugar de crear un agente `software-docs` separado (aplicación de "menos agentes ≠ mejor").

---

### Agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `readme`, `code-docs-style`, `dev-guide`, `migration-guide` + `deploy-checklist` (shared). Total: 5 propias previas + 4 docs nuevas + 2 shared (risk-matrix y deploy-checklist) = **11 skills accesibles**. |
| `software-coding` | `feature-implementation`, `bugfix-workflow`, `refactor-plan`, `dependency-bump` + `deploy-checklist` (shared). Total: 3 git skills previas + 4 workflow nuevas + 1 shared = **8 skills accesibles**. |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar los nuevos workflows y documentos.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para:

- **`software-architecture`** (skills nuevas docs + deploy + scope ampliado): "README", "documenta el proyecto/módulo", "guía de desarrollo", "dev guide", "guía de migración", "migration guide", "guía de docs", "estilo de docstrings", "deploy checklist", "checklist de release".
- **`software-coding`** (workflows + deploy): "feature-implementation", "bugfix", "subir dependencia", "dep bump", "actualiza la versión de", "deploy checklist", "preparar release".
- **Tabla de decisión rápida**: 4 filas nuevas (docs en architecture, deploy-checklist, dep bump en coding, workflows implícitos via las señales de "implementa/fix el bug/refactoriza" ya existentes).

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos": Software 11 → 19 skills. `_shared/` 7 → 8 business compartidas.
- Sección "Detalle por departamento → `_shared/`": tabla business-skills compartidas añade `deploy-checklist` con consumidores documentados.
- Sección "Detalle por departamento → Software": tabla de agentes refleja skills propias actualizadas y compartidas. Tabla de skills pasa de 11 a 19 filas con las 8 nuevas + nota de "más 1 compartida `deploy-checklist`".
- Catálogo rápido: tabla Software pasa de 11 a 19 filas. Tabla "Skills compartidas" pasa de 9 a 10 con `deploy-checklist`. Encabezado "Skills compartidas (9 = 2 meta + 7 business)" → "Skills compartidas (10 = 2 meta + 8 business)". Encabezado "Skills dept-específicas (67)" → "Skills dept-específicas (75)".

**`README.md` raíz**:

- Tabla de estado: Software 11 → 19. `_shared/` 9 → 10 (8 business).
- Total: 76 → 85 skills (75 dept-específicas + 8 business compartidas + 2 meta).

---

### Archivos editados

**Iteración 2 — workflow coding:**
- `.aigent/departments/software/skills/feature-implementation/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/bugfix-workflow/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/refactor-plan/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dependency-bump/SKILL.md` (nuevo)

**Iteración 3 — docs technicas:**
- `.aigent/departments/software/skills/readme/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/code-docs-style/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dev-guide/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/migration-guide/SKILL.md` (nuevo)

**Iteración 4 — deploy shared:**
- `.aigent/departments/_shared/skills/deploy-checklist/SKILL.md` (nueva, compartida)

**Agentes y orquestador:**
- `.aigent/departments/software/agents/software-architecture.md` (scope ampliado + 5 skills nuevas listadas)
- `.aigent/departments/software/agents/software-coding.md` (workflows + deploy listados)
- `.aigent/departments/software/software-orchestrator.md` (señales + tabla de decisión actualizadas)

**Catálogo y versionado:**
- `.aigent/README.md` (tabla estado + sección _shared/ + detalle Software + catálogo rápido + totales)
- `README.md` (raíz) (tabla estado + total)
- `.aigent/VERSION` (1.14.0 → 1.15.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.14.0 — 2026-05-14

### Software — iteración 1: spec-review + git workflow (4 skills nuevas)

Primera tanda de la ampliación del dept Software discutida con el usuario. Se añaden 4 skills v1 prosa que cubren dos huecos identificados: (1) revisión y scoring de specs antes de implementación (`spec-review`), y (2) productos "laterales" del ciclo de implementación que `software-coding` no estaba cubriendo — mensaje de commit, descripción de PR y entrada de changelog. Sin agentes nuevos: aplicación de la regla "menos agentes ≠ mejor" — todo encaja como skills colgando de los agentes existentes.

**Estado tras esta versión:** 76 skills totales (67 dept-específicas + 7 business compartidas + 2 meta). Software pasa de 7 a 11 skills, sigue con 4 agentes. `software-coding` deja de no tener skills propias.

---

### 4 skills dept-específicas nuevas (todas en `software/`)

- **`spec-review`** — Review y scoring de un spec existente (PRD/ADR/tech-spec/api-spec) con rubric de 6 dimensiones (Completeness, Clarity, Testability, Consistency, Risk awareness, Actionability), score 0-5 por dimensión y total /30 con grado (🟢/🟡/🟠/🔴), hallazgos por severidad (🔴/🟠/🟡/🔵), top 3, lo positivo y veredicto (✅ / 🟠 / 🔴). Sirve como gate antes de pasar un spec a implementación. Vive en `<proyecto>/software/reviews/spec-review-<tipo>-<slug>.md`. Consumidora: `software-architecture`.
- **`commit-message`** — Mensaje de commit a partir del diff staged. Default Conventional Commits con tipos canónicos (feat/fix/refactor/perf/docs/test/build/ci/chore/style/revert), scope opcional derivado del path, `!` para breaking, footer con BREAKING CHANGE/Refs/Closes/Co-authored-by. Reglas estrictas: subject < 50 chars, imperativo, sin punto final, atomicidad (rechaza commits que mezclan cambios). Output: bloque en chat para pegar en `git commit`. Consumidora: `software-coding`.
- **`pr-description`** — Descripción de Pull Request cruzando spec asociado + diff + commits. Estructura canónica: Qué cambia / Por qué (con refs) / Cómo (approach) / Cambios principales (tabla archivo→cambio) / Testing (añadidos + pendientes + manual) / Impacto (breaking/áreas/riesgos/rollback) / Screenshots / Checklist autor / Para el reviewer. Respeta plantillas del repo (`.github/PULL_REQUEST_TEMPLATE.md`) si existen. Detecta atomicidad rota y breaking change para alertar. Consumidora: `software-coding`.
- **`changelog-entry`** — Entrada `## [X.Y.Z] — YYYY-MM-DD` Keep a Changelog a partir de PRs merged del release. Mapea Conventional Commits a categorías (Added/Changed/Deprecated/Removed/Fixed/Security) con sección BREAKING CHANGES arriba marcada con ⚠️. Valida coherencia semver (BREAKING → major, Added → minor, Fixed → patch). Filtra commits internos no relevantes para el consumidor. Actualiza también el bloque `[Unreleased]` y los links de comparación al final del archivo. Consumidora: `software-coding`.

---

### 2 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `spec-review` (ahora 5 skills propias + 1 shared) |
| `software-coding` | `commit-message`, `pr-description`, `changelog-entry` (pasa de "sin skills propias" a 3 skills) |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar las nuevas categorías de output.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para las nuevas skills:

- **`software-architecture`**: "revisa este PRD/ADR/spec", "scoring del spec", "spec review", "está bien este PRD".
- **`software-coding`**: "mensaje de commit", "commit message", "descripción de PR", "PR description", "changelog", "release notes técnicas".
- **Tabla de decisión rápida**: 2 filas nuevas (spec-review y skills de git workflow) más afinado el wording de las filas de code-review para evitar colisión con spec-review.

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos" — Software pasa de 7 a 11 skills.
- Sección "Detalle por departamento → Software" — tabla de agentes (4) refleja nuevas skills propias; tabla de skills (11) incluye las 4 nuevas con su entregable.
- Catálogo rápido — "Software (4 agentes activos + 1 implementador sin skill)" → "Software (4)". Tabla Software del catálogo pasa de 7 a 11 filas.
- "Skills dept-específicas (63)" → "Skills dept-específicas (67)".

**`README.md` raíz**:

- Tabla de estado: Software 7 → 11.
- Total: 72 → 76 skills (67 dept-específicas + 7 business + 2 meta).

---

### Archivos editados

- `.aigent/departments/software/skills/spec-review/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/commit-message/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/pr-description/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/changelog-entry/SKILL.md` (nuevo)
- `.aigent/departments/software/agents/software-architecture.md`
- `.aigent/departments/software/agents/software-coding.md`
- `.aigent/departments/software/software-orchestrator.md`
- `.aigent/README.md`
- `README.md` (raíz)
- `.aigent/VERSION` (1.13.0 → 1.14.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.16.0 — 2026-05-14

### READMEs de casos de uso por departamento (9 nuevos)

Cada dept implementado (8) más `_shared/` ahora tiene un `README.md` con ejemplos completos de cada agente y cada skill: prompt de entrada realista, output esperado (estructura completa simulada con valores, tablas y snippets de 20-40 líneas) y ruta donde se guarda. Sirven como documentación viva para onboarding de usuarios, referencia rápida y como anti-fricción cuando se duda de qué pedir.

Cobertura total: **~130 casos de uso** (35 agentes especialistas + 2 transversales + 75 skills dept + 10 skills compartidas + flujos end-to-end típicos por dept).

---

### 9 READMEs nuevos

| Archivo | Contenido |
|---|---|
| `.aigent/departments/software/README.md` | 4 agentes + 19 skills + 1 shared. 23 ejemplos + flujo feature y bugfix end-to-end. |
| `.aigent/departments/marketing/README.md` | 5 agentes + 13 skills. 18 ejemplos + flujo de lanzamiento. |
| `.aigent/departments/sales/README.md` | 4 agentes + 11 skills + 3 shared referenciadas. 15 ejemplos + flujo del funnel. |
| `.aigent/departments/hr/README.md` | 4 agentes + 7 skills. 11 ejemplos + flujo recruitment→onboarding→evaluation. |
| `.aigent/departments/product/README.md` | 3 agentes + 6 skills + 6 shared referenciadas. 9 ejemplos + flujo discovery→roadmap→ship. |
| `.aigent/departments/finance/README.md` | 3 agentes + 7 skills + 2 shared referenciadas. 10 ejemplos + cierre mensual/trimestral/anual. |
| `.aigent/departments/legal/README.md` | 4 agentes + 6 skills + 2 shared referenciadas. 10 ejemplos + flujo onboarding cliente + audit. |
| `.aigent/departments/design/README.md` | 4 agentes + 6 skills + 1 shared referenciada. 10 ejemplos + flujo feature visual + DS update. |
| `.aigent/departments/_shared/README.md` | 2 agentes transversales (shared-prd-agent, shared-skill-builder) + 10 skills compartidas (2 meta + 8 business). 12 ejemplos + tabla de "cuándo invocar transversales vs depts". |

Estructura canónica de cada README (acordada con el usuario):

1. **Header** — frase + link al orquestador y al `.aigent/README` maestro.
2. **Cómo se invoca** — 3 vías (orquestador / agente / skill directa).
3. **Agentes** — un caso de uso por cada agente, con prompt + output esperado (estructura completa) + ruta.
4. **Skills propias del dept** — un caso de uso por cada skill (las que ya tienen ejemplo en su agente solo referencian).
5. **Skills compartidas usadas** — listado con referencia a `_shared/README.md`.
6. **Flujo end-to-end típico** — diagrama ASCII de cómo se encadenan agentes y skills en escenarios reales.

---

### Cross-reference desde `.aigent/README.md`

Nueva sección "Casos de uso por departamento" en el `.aigent/README.md` con tabla que linka a los 9 nuevos READMEs.

---

### Archivos editados

**READMEs nuevos:**
- `.aigent/departments/software/README.md` (nuevo)
- `.aigent/departments/marketing/README.md` (nuevo)
- `.aigent/departments/sales/README.md` (nuevo)
- `.aigent/departments/hr/README.md` (nuevo)
- `.aigent/departments/product/README.md` (nuevo)
- `.aigent/departments/finance/README.md` (nuevo)
- `.aigent/departments/legal/README.md` (nuevo)
- `.aigent/departments/design/README.md` (nuevo)
- `.aigent/departments/_shared/README.md` (nuevo)

**Cross-ref + versionado:**
- `.aigent/README.md` (sección "Casos de uso por departamento" añadida)
- `.aigent/VERSION` (1.15.0 → 1.16.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.15.0 — 2026-05-14

### Software — iteraciones 2+3+4: workflow coding + docs técnicas + deploy shared (9 skills nuevas)

Segunda tanda de la ampliación del dept Software. Se cierran las tres iteraciones restantes del plan en un solo release: (2) workflow skills agnósticos de lenguaje para `software-coding`, (3) skills de documentación técnica para `software-architecture` con scope ampliado, y (4) `deploy-checklist` como skill compartida usable por software hoy y devops mañana. Aplicación reiterada de la regla "menos agentes ≠ mejor": ningún agente nuevo, todo encaja como skills colgando de los 4 existentes.

**Estado tras esta versión:** 85 skills totales (75 dept-específicas + 8 business compartidas + 2 meta). Software pasa de 11 a 19 skills (+8 propias + 1 shared accesible). El `_shared/` business pasa de 7 a 8 skills.

---

### Iteración 2 — 4 workflow skills nuevas en `software/skills/` (consumidora: `software-coding`)

- **`feature-implementation`** — Workflow estructurado para implementar una feature desde spec. Pre-flight: lectura del spec, lectura del contexto del repo (módulo + ADRs + decisions + tests existentes), planificación (archivos previstos, dependencias nuevas, tests a producir, riesgos), confirmación con el usuario si hay desviaciones. Ejecución: cambios con `Edit/Write`, tests al lado, atomicidad estricta, sin comentarios redundantes. Post-flight: reporte con archivos tocados, AC cubiertos (✅/🟡/❌), tests añadidos / pendientes, TODOs, decisiones tomadas, próximos pasos. Vive el reporte en `<proyecto>/software/code/.reports/feature-<slug>.md`.
- **`bugfix-workflow`** — Workflow para arreglar un bug en 4 pasos: (1) Reproduce — reproducción confirmada local antes de tocar nada. (2) Diagnose — root cause analysis con evidencia, distingue síntoma de causa. (3) Fix — approach + alternativas descartadas + cambio mínimo. (4) Regression test — debe fallar pre-fix y pasar post-fix. Validación: reproducción original deja de reproducirse, suite verde. Comunicación: mensaje para el reporter sin jerga, decisión sobre nota de changelog y postmortem si Critical.
- **`refactor-plan`** — Plan de refactor escrito ANTES de tocar código. Cubre motivación con deuda concreta, scope IN/OUT explícito (anti-creep), approach con alternativas, branch strategy (all-at-once/branch-by-abstraction/feature-flag/strangler-fig), safety nets (tests existentes + characterization a añadir + monitoring + flag), validación, rollback. Tras ejecutar el plan, se cierra el archivo con bloque "Resultado" (diff stats, sorpresas, decisiones, próximos pasos). Estado del archivo: Planned → In progress → Done | Reverted | Partial.
- **`dependency-bump`** — Workflow para subir una dependencia. Assessment: changelog upstream entre versiones (no se saltan versiones intermedias sin leerlas), breaking changes que afectan al repo concretamente (no en abstracto), deps transitivas, compatibilidad con runtime, riesgo global (🟢/🟡/🟠/🔴). Plan: pasos de bump, código a adaptar, configuración/build, tests. Safety nets + validación + rollback. Cierre con resultado. Cubre majors con cuidado (especial atención a `0.x.y` por convenciones laxas de semver en muchos ecosistemas).

### Iteración 3 — 4 docs skills nuevas en `software/skills/` (consumidora: `software-architecture` con scope ampliado)

- **`readme`** — README.md del proyecto adaptado al tipo (library / CLI / web app / API / monorepo / internal tool). Estructura canónica: one-liner + qué resuelve + quick start (requisitos + instalación + primer uso) + uso/API por tipo + configuración (tabla de env vars sin valores) + estructura del repo + tests + deploy resumido + documentación adicional con links + contribuir + licencia + mantenedores. Reglas estrictas: sin marketing-speak, comandos ejecutables tal cual, versiones explícitas, links relativos. Vive en raíz del repo.
- **`code-docs-style`** — Guía canónica de documentación inline del proyecto. Por cada lenguaje en el repo: formato obligatorio (JSDoc/TSDoc, Google/NumPy docstring, godoc, rustdoc, KDoc, phpDoc), tags admitidos, ejemplo canónico real, anti-patrones. Convenciones transversales: idioma de la doc, naming dentro de la doc, política `TODO`/`FIXME`/`XXX` (formato obligatorio con author + ticket, sin author bloquea en review), comentarios autogenerados. Política de doc generada si aplica. Enforcement por linter/CI. Vive en `<proyecto>/software/architecture/code-docs-style.md`.
- **`dev-guide`** — Guía de desarrollo extendida del proyecto. Documento vivo. Cubre visión rápida, setup del entorno (con `cp .env.example .env`, docker compose, smoke test de "el setup funciona"), estructura del repo, cómo corre en local, tests por nivel con tiempos, workflow (branching, commits, PRs, release), **common tasks** ("¿cómo añado un endpoint / migración / test e2e?"), referencias a ADRs (resumen + link), troubleshooting con síntomas/causas comunes. Mantenida por owner identificado. Vive en `<proyecto>/docs/dev-guide.md`.
- **`migration-guide`** — Guía pública de migración de versión X a Y dirigida a CONSUMIDORES (devs que usan la librería, integradores de API, admins del CLI). Audiencia distinta a dev-guide. Cubre TL;DR + pre-requisitos + mapa de cambios + cada breaking change con antes/después (snippet ejecutable) + cambios silenciosos (defaults que cambian) + deprecations + plan paso a paso + validación + rollback + FAQ + soporte de versión anterior. Codemod recomendado si la migración es mecánica. Difícultad explícita (🟢/🟡/🟠) en TL;DR.

### Iteración 4 — 1 skill shared nueva en `_shared/skills/` (consumidora: `software-architecture`, `software-coding`, futura `devops-pipeline`)

- **`deploy-checklist`** — Checklist completa pre/durante/post-deploy de un release adaptado al riesgo (🟢/🟡/🟠/🔴) y a la estrategia (instant/canary/blue-green/progressive/rolling). Pre-deploy: código & tests (CI verde, tag creado, artefacto publicado), especificación & docs (changelog, migration guide, release notes), configuración del entorno (env vars, secrets aprovisionados, permisos), schema & datos (migration reversible, backup, backfill, orden de despliegue), feature flags (estado inicial, criterio de promoción/retirada), comunicación, personas y roles (owner + backup + aprobador para 🟠/🔴). Durante: tabla de pasos con timestamps reales + smoke tests con health checks + caminos críticos manuales + e2e automatizados. Post-deploy: métricas a vigilar con umbrales y acción si se cruzan, confirmaciones funcionales, comunicación de cierre. Rollback con punto sin retorno explícito. Cierre con notas para el siguiente deploy. **Skill compartida**: hoy la consume software, mañana también devops (`devops-pipeline`/`devops-incident`) cuando el dept se active.

---

### Scope ampliado de `software-architecture` (decisión registrada con el usuario)

El agente pasa de "Architecture & Technical Design" a **"Architecture, Technical Design & Documentation"**. Cambios concretos:

- **Frontmatter `description`** ampliada para mencionar explícitamente la documentación técnica como entregable propio.
- **Sección Rol** reescrita: misión dual (decisiones + documentación humana del proyecto).
- **Sección "Tipos de entregables"** suma "Documentación técnica" con un párrafo por cada uno de los 4 nuevos entregables (README, dev-guide, code-docs-style, migration-guide, deploy-checklist).
- **Sección "Skills disponibles"** ahora lista 5 skills propias previas + 5 docs skills nuevas + 2 shared (`risk-matrix` y `deploy-checklist`).

Razonamiento documentado en el plan acordado con el usuario: la doc técnica del proyecto (README, dev guide, migration guide) tiene proceso propio pero está más cerca del autor del sistema que del implementador de código, por lo que encaja mejor en architecture que en coding. Decisión tomada en lugar de crear un agente `software-docs` separado (aplicación de "menos agentes ≠ mejor").

---

### Agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `readme`, `code-docs-style`, `dev-guide`, `migration-guide` + `deploy-checklist` (shared). Total: 5 propias previas + 4 docs nuevas + 2 shared (risk-matrix y deploy-checklist) = **11 skills accesibles**. |
| `software-coding` | `feature-implementation`, `bugfix-workflow`, `refactor-plan`, `dependency-bump` + `deploy-checklist` (shared). Total: 3 git skills previas + 4 workflow nuevas + 1 shared = **8 skills accesibles**. |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar los nuevos workflows y documentos.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para:

- **`software-architecture`** (skills nuevas docs + deploy + scope ampliado): "README", "documenta el proyecto/módulo", "guía de desarrollo", "dev guide", "guía de migración", "migration guide", "guía de docs", "estilo de docstrings", "deploy checklist", "checklist de release".
- **`software-coding`** (workflows + deploy): "feature-implementation", "bugfix", "subir dependencia", "dep bump", "actualiza la versión de", "deploy checklist", "preparar release".
- **Tabla de decisión rápida**: 4 filas nuevas (docs en architecture, deploy-checklist, dep bump en coding, workflows implícitos via las señales de "implementa/fix el bug/refactoriza" ya existentes).

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos": Software 11 → 19 skills. `_shared/` 7 → 8 business compartidas.
- Sección "Detalle por departamento → `_shared/`": tabla business-skills compartidas añade `deploy-checklist` con consumidores documentados.
- Sección "Detalle por departamento → Software": tabla de agentes refleja skills propias actualizadas y compartidas. Tabla de skills pasa de 11 a 19 filas con las 8 nuevas + nota de "más 1 compartida `deploy-checklist`".
- Catálogo rápido: tabla Software pasa de 11 a 19 filas. Tabla "Skills compartidas" pasa de 9 a 10 con `deploy-checklist`. Encabezado "Skills compartidas (9 = 2 meta + 7 business)" → "Skills compartidas (10 = 2 meta + 8 business)". Encabezado "Skills dept-específicas (67)" → "Skills dept-específicas (75)".

**`README.md` raíz**:

- Tabla de estado: Software 11 → 19. `_shared/` 9 → 10 (8 business).
- Total: 76 → 85 skills (75 dept-específicas + 8 business compartidas + 2 meta).

---

### Archivos editados

**Iteración 2 — workflow coding:**
- `.aigent/departments/software/skills/feature-implementation/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/bugfix-workflow/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/refactor-plan/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dependency-bump/SKILL.md` (nuevo)

**Iteración 3 — docs technicas:**
- `.aigent/departments/software/skills/readme/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/code-docs-style/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/dev-guide/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/migration-guide/SKILL.md` (nuevo)

**Iteración 4 — deploy shared:**
- `.aigent/departments/_shared/skills/deploy-checklist/SKILL.md` (nueva, compartida)

**Agentes y orquestador:**
- `.aigent/departments/software/agents/software-architecture.md` (scope ampliado + 5 skills nuevas listadas)
- `.aigent/departments/software/agents/software-coding.md` (workflows + deploy listados)
- `.aigent/departments/software/software-orchestrator.md` (señales + tabla de decisión actualizadas)

**Catálogo y versionado:**
- `.aigent/README.md` (tabla estado + sección _shared/ + detalle Software + catálogo rápido + totales)
- `README.md` (raíz) (tabla estado + total)
- `.aigent/VERSION` (1.14.0 → 1.15.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.14.0 — 2026-05-14

### Software — iteración 1: spec-review + git workflow (4 skills nuevas)

Primera tanda de la ampliación del dept Software discutida con el usuario. Se añaden 4 skills v1 prosa que cubren dos huecos identificados: (1) revisión y scoring de specs antes de implementación (`spec-review`), y (2) productos "laterales" del ciclo de implementación que `software-coding` no estaba cubriendo — mensaje de commit, descripción de PR y entrada de changelog. Sin agentes nuevos: aplicación de la regla "menos agentes ≠ mejor" — todo encaja como skills colgando de los agentes existentes.

**Estado tras esta versión:** 76 skills totales (67 dept-específicas + 7 business compartidas + 2 meta). Software pasa de 7 a 11 skills, sigue con 4 agentes. `software-coding` deja de no tener skills propias.

---

### 4 skills dept-específicas nuevas (todas en `software/`)

- **`spec-review`** — Review y scoring de un spec existente (PRD/ADR/tech-spec/api-spec) con rubric de 6 dimensiones (Completeness, Clarity, Testability, Consistency, Risk awareness, Actionability), score 0-5 por dimensión y total /30 con grado (🟢/🟡/🟠/🔴), hallazgos por severidad (🔴/🟠/🟡/🔵), top 3, lo positivo y veredicto (✅ / 🟠 / 🔴). Sirve como gate antes de pasar un spec a implementación. Vive en `<proyecto>/software/reviews/spec-review-<tipo>-<slug>.md`. Consumidora: `software-architecture`.
- **`commit-message`** — Mensaje de commit a partir del diff staged. Default Conventional Commits con tipos canónicos (feat/fix/refactor/perf/docs/test/build/ci/chore/style/revert), scope opcional derivado del path, `!` para breaking, footer con BREAKING CHANGE/Refs/Closes/Co-authored-by. Reglas estrictas: subject < 50 chars, imperativo, sin punto final, atomicidad (rechaza commits que mezclan cambios). Output: bloque en chat para pegar en `git commit`. Consumidora: `software-coding`.
- **`pr-description`** — Descripción de Pull Request cruzando spec asociado + diff + commits. Estructura canónica: Qué cambia / Por qué (con refs) / Cómo (approach) / Cambios principales (tabla archivo→cambio) / Testing (añadidos + pendientes + manual) / Impacto (breaking/áreas/riesgos/rollback) / Screenshots / Checklist autor / Para el reviewer. Respeta plantillas del repo (`.github/PULL_REQUEST_TEMPLATE.md`) si existen. Detecta atomicidad rota y breaking change para alertar. Consumidora: `software-coding`.
- **`changelog-entry`** — Entrada `## [X.Y.Z] — YYYY-MM-DD` Keep a Changelog a partir de PRs merged del release. Mapea Conventional Commits a categorías (Added/Changed/Deprecated/Removed/Fixed/Security) con sección BREAKING CHANGES arriba marcada con ⚠️. Valida coherencia semver (BREAKING → major, Added → minor, Fixed → patch). Filtra commits internos no relevantes para el consumidor. Actualiza también el bloque `[Unreleased]` y los links de comparación al final del archivo. Consumidora: `software-coding`.

---

### 2 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `software-architecture` | `spec-review` (ahora 5 skills propias + 1 shared) |
| `software-coding` | `commit-message`, `pr-description`, `changelog-entry` (pasa de "sin skills propias" a 3 skills) |

Se actualiza también la sección "Tipos de entregables" de cada agente para reflejar las nuevas categorías de output.

---

### Orquestador actualizado

`software-orchestrator.md` añade señales/triggers para las nuevas skills:

- **`software-architecture`**: "revisa este PRD/ADR/spec", "scoring del spec", "spec review", "está bien este PRD".
- **`software-coding`**: "mensaje de commit", "commit message", "descripción de PR", "PR description", "changelog", "release notes técnicas".
- **Tabla de decisión rápida**: 2 filas nuevas (spec-review y skills de git workflow) más afinado el wording de las filas de code-review para evitar colisión con spec-review.

---

### READMEs actualizados

**`.aigent/README.md`**:

- Tabla "Estado de los departamentos" — Software pasa de 7 a 11 skills.
- Sección "Detalle por departamento → Software" — tabla de agentes (4) refleja nuevas skills propias; tabla de skills (11) incluye las 4 nuevas con su entregable.
- Catálogo rápido — "Software (4 agentes activos + 1 implementador sin skill)" → "Software (4)". Tabla Software del catálogo pasa de 7 a 11 filas.
- "Skills dept-específicas (63)" → "Skills dept-específicas (67)".

**`README.md` raíz**:

- Tabla de estado: Software 7 → 11.
- Total: 72 → 76 skills (67 dept-específicas + 7 business + 2 meta).

---

### Archivos editados

- `.aigent/departments/software/skills/spec-review/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/commit-message/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/pr-description/SKILL.md` (nuevo)
- `.aigent/departments/software/skills/changelog-entry/SKILL.md` (nuevo)
- `.aigent/departments/software/agents/software-architecture.md`
- `.aigent/departments/software/agents/software-coding.md`
- `.aigent/departments/software/software-orchestrator.md`
- `.aigent/README.md`
- `README.md` (raíz)
- `.aigent/VERSION` (1.13.0 → 1.14.0)
- `.aigent/CHANGELOG.md` (esta entrada)

---

## 1.13.0 — 2026-05-13

### 10 skills "Media" — cobertura completa del análisis previo + READMEs actualizados con catálogo completo

Cierre de las skills identificadas en el análisis con lupa de los 8 departments. Tras 1.12.0 (que cubrió las "Alta"), esta versión añade las "Media" — skills útiles desde día 0 que dan flexibilidad y cobertura. El usuario puede descartar alguna después si no se usa, pero el patrón es "mejor tener que no tener".

**Estado tras esta versión:** 72 skills totales (63 dept-específicas + 7 business compartidas + 2 meta). Todo dept implementado tiene cobertura amplia.

---

### 10 skills dept-específicas nuevas

**Sales (1):**
- `forecasting-report` — Forecast formal del periodo (commit/best/worst) con metodología explícita (weighted/rep-call/historical/combined), segmentación por rep/segmento/vertical, win rates históricos, cycle length, riesgos, reconciliación bottom-up vs top-down. Strategic, board-ready. **Distinto operativamente de `pipeline-review`** (que es deal-by-deal semanal).

**Software (2):**
- `bug-report` — Bug report estructurado con reproducción, expected vs actual, severidad justificada (Critical/Major/Minor/Cosmetic), scope, entorno, regresión status, evidencia (logs/screenshots/traces). Reproducible por cualquiera sin reaching out al reporter.
- `tech-spec` — Spec técnica intermedia entre PRD/ADR e implementación: data model, API changes, edge cases, performance & scalability, security, testing strategy, rollout con feature flag. **Distinta de ADR** (que documenta decisión) y de **feature-prd** (que es qué/por qué).

**HR (1):**
- `exit-interview` — Guion + síntesis estructurada con categorización para people analytics agregado (regrettable / non-regrettable / neutral, motivo principal con etiquetas estandarizadas) y recomendaciones derivadas. Confidencialidad alta.

**Product (1):**
- `release-plan` — Plan de release end-to-end con tier explícito (Silent / Beta / Minor / Major / Flagship), hitos por área (Product, Eng, Design, Marketing, Sales, Support, Legal), feature flag obligatorio, criterios de éxito + guardraíles, kill switch, post-launch review programada.

**Finance (2):**
- `board-deck-financial` — Sección financiera del board deck (5-10 slides equivalentes): highlights, P&L summary, cash + runway, KPIs selectivos, variance vs plan, top riesgos, asks al board. Tono board-audience honesto. **Distinto de `financial-report`** (más granular, broader audience).
- `expense-report` — Submisión de gastos individual con detalle por gasto, totales por categoría/proyecto, justificantes adjuntos, self-check contra `expense-policy`, workflow de aprobación tracking.

**Legal (1):**
- `compliance-checklist` — Checklist estructurada contra un framework específico (GDPR / SOC 2 Type II / ISO 27001:2022 / HIPAA / PCI DSS / sectorial) con metodología, estado por control (Pass/Partial/Fail/N-A), gap analysis con priorización por riesgo, remediation plan en sprints, evidencias preparadas para auditor.

**Design (2):**
- `design-handoff-checklist` — Checklist pre-handoff con sign-off de designer + acceptance del eng. Cubre visual y layout, estados completos (default + 6-8 más), responsive, tokens consumidos, edge cases, accesibilidad mínima, assets, acceptance criteria.
- `ds-component-doc` — Documentación canónica de componente del DS oficial (más exhaustiva que `ui-component-spec`): anatomía, matriz de variantes, props/API por plataforma (React/SwiftUI/Compose), estados, do/don't con ejemplos, audit a11y formal referenciado, tokens consumidos, versionado, deprecation policy.

---

### 10 agentes consumidores actualizados

| Agente | Skills añadidas |
|---|---|
| `sales-crm` | `forecasting-report` (3 skills totales) |
| `software-qa` | `bug-report` |
| `software-architecture` | `tech-spec` (ahora 4 skills) |
| `hr-evaluation` | `exit-interview` |
| `product-strategy-roadmap` | `release-plan` |
| `finance-reporting` | `board-deck-financial`, `expense-report` (5 skills totales) |
| `legal-risk` | `compliance-checklist` (3 skills totales) |
| `design-ui` | `design-handoff-checklist` |
| `design-design-system` | `ds-component-doc` |

---

### READMEs reescritos con catálogo completo

**`.aigent/README.md`** — actualizado con:

- **Tabla "Estado de los departamentos"** con contadores nuevos de skills (Sales 11, Software 7, HR 7, Product 6, Finance 7, Legal 6, Design 6).
- **Tablas detalladas por dept** actualizadas con todas las skills incluyendo las 10 nuevas Media.
- **Nueva sección "Catálogo rápido — una frase por agente y skill"** al final del README (antes de "Reglas básicas"). Cobertura:
  - 8 orquestadores con frase por cada uno.
  - 2 agentes transversales (shared) con frase.
  - 35 agentes especialistas agrupados por departamento, una frase cada uno.
  - 9 skills compartidas (2 meta + 7 business) con frase.
  - 63 skills dept-específicas en 8 tablas por dept, frase por cada una.
  - 1 skill v2 ejecutable de Operations (`redmine`).

**`README.md` raíz** — reescrito completo:

- **Overview** del sistema con value proposition en 4 bullets ("departamentos completos sin contratar al departamento", "independientes pero coordinados", "outputs auditables", "una sola fuente de verdad por skill").
- **Tabla de estado actualizada** con totales: 33 agentes activos + 72 skills.
- **Sección "Agentes — qué hace cada uno (una frase)"** con tabla de los 35 especialistas + 2 transversales + 8 orquestadores nombrados.
- **Sección "Skills — qué entrega cada una (una frase)"** con 9 shared + listado por dept de las 63 dept-específicas (sin tabla para no inflar el README raíz, listado compacto).
- **Estructura del repo + cómo empezar + cómo extender** preservados y actualizados.
- **Aviso** explícito sobre legal/HR ("estructura y borradores, NO asesoría vinculante").

---

### Cambios en archivos transversales

- `.aigent/VERSION` — bump 1.12.0 → 1.13.0 (MINOR: más skills + READMEs reescritos, sin romper contratos).
- `.aigent/CHANGELOG.md` — esta entrada.
- `.aigent/README.md` — actualizado completo (ver arriba).
- `README.md` raíz — reescrito completo (ver arriba).
- `.aigent/BOSS.md` — sin cambios (no lista skills).

### Próximos pasos

- Activar **DevOps** para cerrar el set de 9 depts (último TODO).
- Considerar activación completa de Operations (sigue 🚧 parcial con skill v2 `redmine` pero sin agentes especialistas).
- Aplicar uso real de las skills creadas; descartar las que no aporten valor real tras 1-2 trimestres de uso.

## 1.12.0 — 2026-05-13

### 17 skills nuevas (16 dept-específicas + 1 shared) — los depts pasan a estar plenamente operativos desde día 0

Tras documentar el patrón de skills compartidas en 1.11.0, esta versión llena los gaps esenciales identificados en el análisis con lupa de los 8 departments. Cada agente que estaba sin skill propia recibe una; cada dept añade las skills "Alta" que faltaban para operar end-to-end.

**Estado tras esta versión:** todos los agentes con skill propia (salvo decisiones explícitas como `software-coding` por su naturaleza basada en repo); 60+ skills totales (52 dept + 7 shared business + 2 meta).

---

### 1 skill compartida nueva

| Skill | Consumidores | Justificación |
|---|---|---|
| `_shared/skills/shared-journey-map/` | `design-ux-research` (journey de uso de interfaz) + `product-discovery` (customer journey end-to-end) | Estructura idéntica: fases × acciones × pensamientos × emociones × pain points × oportunidades × touchpoints. Cumple §7.1 |

---

### 16 skills dept-específicas nuevas

**Marketing (1):**
- `brand-voice-guide` — guía canónica de voz de marca con atributos de tono, vocabulario do/don't, adaptación por canal. Documento de referencia para mantener tono consistente entre piezas de content.

**Sales (3):**
- `discovery-call` — script y framework de discovery call B2B con BANT/MEDDIC/SPICED, debrief estructurado, red flags. **Pieza que faltaba del ciclo SDR/AE.**
- `pipeline-review` — revisión operativa deal-by-deal con weighted forecast, health flags, acciones acordadas. **`sales-crm` ahora opera con skill estandarizada.**
- `renewal-playbook` — playbook de renovación con health signals, timing de outreach, scripts por situación (🟢/🟡/🔴), concessions ladder. Cubre la fase post-deal que no estaba.

**Software (2):**
- `runbook` — documento operacional completo para servicio en producción: deploy, monitoring, alertas, playbooks por incidente, escalado, dependencias.
- `api-spec` — especificación de API con endpoints, schemas, errores, pagination, versioning y deprecation policy.

**HR (3):**
- `onboarding-plan` — plan 30/60/90 días estructurado con pre-boarding, día 1 hora a hora, semana 1, plan por etapas (aprender → contribuir → owning), buddy program, evaluación de período de prueba. **`hr-onboarding` deja de operar con plantilla interna.**
- `one-on-one-framework` — framework canónico de 1:1s con principios, agenda recurrente (cómo estás / status / bloqueos / desarrollo / feedback), plantilla de notas, cadencia, anti-patrones.
- `compensation-band` — banda salarial por rol × seniority × geografía con benchmark de mercado, internal equity check, decision matrix para ofertas y promociones. **Confidencialidad alta.**

**Product (2):**
- `feature-prd` — PRD operativo de feature concreta con problema, hipótesis, scope, user stories con acceptance criteria, métricas + guardraíles, rollout plan con feature flag.
- `experiment-design` — plan de A/B test con hipótesis, métrica primaria, guardraíles, MDE, sample size calculado, randomización, decision rules pre-resultado (anti p-hacking).

**Finance (2):**
- `cash-forecast` — 13-week rolling cash forecast con inflows/outflows por categoría, posición semanal, alertas por debajo de mínimo de política, escenarios best/base/worst, FX exposure si multi-moneda. **`finance-treasury` deja de operar con plantilla interna.**
- `expense-policy` — política de gastos cross-funcional con categorías, límites, workflow de aprobación, viajes (per diem por tier), equipamiento, reembolsos, lista no-reembolsable. Coordinada con HR para incorporar al handbook.

**Legal (2):**
- `dpa-template` — Data Processing Agreement GDPR Art. 28 con anexos (objeto, TOMs, subprocesadores), notificación de brechas (48h al controlador / 72h al supervisor), SCCs UE 2021/914 para transferencias internacionales.
- `nda-template` — NDA standalone mutuo o unilateral con definición de Información Confidencial, exclusiones estándar, divulgación obligatoria por ley, remedies con injunctive relief, jurisdicción. La firma más frecuente en cualquier empresa.

**Design (1):**
- `usability-test-plan` — plan completo de usability test con hipótesis, tasks como objetivos del usuario (sin pistas UI), N de participantes, screener, script de sesión, SUS, debrief en caliente, síntesis con severidad. **`design-ux-research` deja de operar con plantilla interna.**

---

### 14 agentes consumidores actualizados

Cada agente añade las skills que consume a su tabla `## Skills disponibles`:

| Agente | Skills añadidas |
|---|---|
| `marketing-content` | brand-voice-guide |
| `sales-ae` | discovery-call, renewal-playbook |
| `sales-crm` | pipeline-review |
| `software-architecture` | runbook, api-spec |
| `hr-onboarding` | onboarding-plan (deja de no tener skill propia) |
| `hr-evaluation` | one-on-one-framework |
| `hr-recruitment` | compensation-band |
| `product-strategy-roadmap` | feature-prd |
| `product-metrics` | experiment-design |
| `product-discovery` | journey-map (shared) |
| `finance-treasury` | cash-forecast (deja de no tener skill propia) |
| `finance-budgeting` | expense-policy |
| `legal-contracts` | nda-template |
| `legal-privacy` | dpa-template |
| `design-ux-research` | usability-test-plan, journey-map (deja de no tener skill propia) |

---

### Agentes que pasan de "sin skill propia" a "con skill"

- `sales-crm` → `kpi-dashboard` (en 1.11.0) + `pipeline-review` (en 1.12.0)
- `legal-risk` → `risk-matrix` + `stakeholder-map` (en 1.11.0)
- `hr-onboarding` → `onboarding-plan` (1.12.0)
- `finance-treasury` → `cash-forecast` (1.12.0)
- `design-ux-research` → `usability-test-plan` (1.12.0)

Quedan sin skill propia por decisión deliberada:
- `software-coding` — trabaja directamente sobre el repo, sin skill estandarizada.

---

### Cambios en archivos transversales

- `.aigent/VERSION` — bump 1.11.0 → 1.12.0 (MINOR: nuevas capacidades sin romper contratos).
- `.aigent/CHANGELOG.md` — esta entrada.
- `.aigent/README.md` — tabla "Estado de los departamentos" con contadores de skills actualizados; secciones por dept con las nuevas skills documentadas.
- `.aigent/BOSS.md` — sin cambios (no lista skills).
- `_shared/conventions.md`, `skill-scaffold/SKILL.md`, `shared-skill-builder.md` — sin cambios (el patrón se aplica, no cambia).

### Cómo se usan a partir de aquí

Las 17 skills nuevas están disponibles inmediatamente tras `bash .aigent/IDE/install.sh --sync --ide all`. Cada agente consumidor las lista en su `## Skills disponibles`; los orquestadores delegan al agente correcto y este invoca la skill que aplique.

Las 5 skills dept-específicas marcadas "Media" en el análisis previo quedan como roadmap para futuras sesiones cuando emerja el uso real:

- `forecasting-report` (Sales — pero parcialmente cubierto por `pipeline-review` ya).
- `bug-report`, `tech-spec` (Software).
- `exit-interview` (HR).
- `release-plan` (Product).
- `board-deck-financial`, `expense-report` (Finance).
- `compliance-checklist` (Legal).
- `design-handoff-checklist`, `ds-component-doc` (Design).

## 1.11.0 — 2026-05-13

### Skills compartidas en `_shared/skills/` — patrón formalizado + 6 skills business cross-dept

Tras la revisión con lupa de los 8 departments implementados, se identifican skills con estructura idéntica entre dos o más departments. Se formaliza el patrón "skills compartidas en `_shared/skills/`" y se crean las primeras 6 business-skills compartidas, separadas explícitamente de las meta-skills que ya viven en esa carpeta (`skill-scaffold`, `agent-scaffold`).

**Estado tras esta versión:** 8 depts implementados, 6 business-skills + 2 meta-skills en `_shared/skills/`, infraestructura preparada para que cualquier instalación parcial de departments tenga acceso a las skills transversales sin trabajo adicional.

---

### Nueva sección §7.1 en `conventions.md` — Skills compartidas

Documenta cuándo una skill vive en `_shared/skills/` vs en un dept. Criterios canónicos:

1. **≥2 departments la usan o la usarán razonablemente.** Si solo uno la consume, va al dept.
2. **El entregable es genuinamente idéntico.** No solo el nombre coincide: plantilla, información a recopilar y proceso son los mismos.
3. **No hay matices fuertes por dept.** Si los hay, duplicar.

**Anti-drift:** una skill compartida que empieza a recibir variantes por dept es señal de que debe duplicarse y vivir en cada dept con su matiz. No se fuerza lo compartido.

**Naming:** sin prefijo (`competitive-analysis`, no `common-competitive-analysis`). La carpeta `_shared/skills/` identifica ubicación; el nombre identifica entregable. Coherente con `skill-scaffold` y `agent-scaffold` actuales.

**Coexistencia:** las business-skills conviven con las meta-skills en `_shared/skills/` sin subcarpetas. Se distinguen por dominio, no por ubicación.

**Distribución:** `install.sh` / `install.ps1` ya propagan `_shared/` siempre (líneas 282-342 del installer). Ninguna skill compartida nueva requiere cambios en el installer — la propagación es automática.

---

### Actualización de `skill-scaffold/SKILL.md` y `shared-skill-builder.md`

Ambas referencias canónicas de creación de skills se actualizan para considerar explícitamente la ubicación (`dept` vs `_shared/`) durante el proceso de creación de cualquier skill nueva.

- **`_shared/skills/shared-skill-scaffold/SKILL.md`** — añadidos:
  - Campo `location` en "Información común a recopilar".
  - Sección nueva "Decidir ubicación: dept o `_shared/`" con criterios y caso de duda explícitos.
  - Paso adicional en "Proceso" (paso 2) para evaluar ubicación antes de decidir modo.
  - Paso 8 nuevo: si la skill es compartida, identificar agentes consumidores y avisar al usuario para que los actualice.
  - Nueva restricción: "No forzar el camino compartido". Empezar específico, promover a compartido si emerge reuso.

- **`_shared/agents/shared-skill-builder.md`** — añadidos:
  - Modo `create-v1` paso 2: decidir ubicación con criterios explícitos antes de recopilar campos.
  - Modo `create-v2` paso 2: decidir ubicación (las skills v2 a menudo son transversales — los MCPs/APIs típicamente sirven a varios depts; `_shared/` es candidato natural).
  - Modo `create-v1` paso 6: si es compartida, identificar agentes consumidores y avisar al usuario.
  - Nueva restricción: "No forzar el camino compartido", con propuesta de duplicar si emerge drift.

---

### 6 business-skills compartidas creadas

Todas v1 prosa, en `_shared/skills/<name>/SKILL.md`:

| Skill | Agentes consumidores documentados | Justificación |
|---|---|---|
| `competitive-analysis` | `marketing-strategy`, `product-strategy-roadmap` | Matriz comparativa con la misma estructura: landscape, comparison matrix, whitespace, threat assessment. Mismo entregable, scope distinto |
| `case-study` | `marketing-content`, `sales-enablement` | Caso de éxito con problema → solución → resultados verificables + citas verbatim. Idéntica estructura para marketing y sales |
| `kpi-dashboard` | `marketing-seo`, `product-metrics`, `finance-reporting`, `sales-crm` | KPI × target × variance × tendencia × commentary. Mismo esqueleto, scope variable por dominio |
| `stakeholder-map` | `product-discovery`, `legal-risk`, `marketing-strategy`, `sales-ae` | Mapa de influencia × interés × posición × plan de engagement. Útil cross-dept con la misma estructura |
| `risk-matrix` | `legal-risk`, `software-architecture` (ADRs), `finance-budgeting` (escenarios), `product-strategy-roadmap` | Probabilidad × impacto × mitigación × residual × owner. Idéntica metodología, dominios distintos |
| `okr-set` | `product-metrics`, `hr-evaluation` (OKRs personales), `marketing-strategy` | 1-3 Os + 2-4 KRs cuantitativos + scoring 0.0-1.0 + cadencia. Patrón uniforme con scope distinto |

---

### Actualización de 14 agentes consumidores

Cada agente lista las skills compartidas que consume en su tabla `## Skills disponibles`, marcándolas con la nota "Compartida — vive en `_shared/skills/`":

- **Marketing**: `marketing-strategy` (3 nuevas), `marketing-content` (1), `marketing-seo` (1)
- **Sales**: `sales-ae` (1), `sales-enablement` (1), `sales-crm` (1) — **`sales-crm` pasa de no tener skills propias a tener `kpi-dashboard`**
- **Software**: `software-architecture` (1, para ADRs)
- **HR**: `hr-evaluation` (1)
- **Product**: `product-strategy-roadmap` (3), `product-metrics` (2), `product-discovery` (1)
- **Finance**: `finance-budgeting` (1), `finance-reporting` (1)
- **Legal**: `legal-risk` (2) — **`legal-risk` pasa de no tener skills propias a tener `risk-matrix` + `stakeholder-map`**

Total: 14 agentes editados, 22 referencias añadidas a skills compartidas.

**No se modifican las skills propias** ni los orquestadores. La regla §7 sigue vigente: las skills no declaran qué agentes las usan; los agentes referencian skills.

---

### Cambios en archivos transversales

- `.aigent/VERSION` — bump 1.10.0 → 1.11.0 (MINOR: nueva categoría de skills + 6 archivos nuevos, sin romper contratos).
- `.aigent/CHANGELOG.md` — esta entrada.
- `.aigent/departments/_shared/conventions.md` — nueva sección §7.1.
- `.aigent/departments/_shared/skills/shared-skill-scaffold/SKILL.md` — proceso ampliado.
- `.aigent/departments/_shared/agents/shared-skill-builder.md` — modos `create-v1` y `create-v2` ampliados.

**`.aigent/BOSS.md` no se modifica** — BOSS no lista skills, solo orquesta a nivel de dept.

**`.aigent/README.md` no se modifica en esta versión** — la sección de departments sigue válida; las skills compartidas son detalle de implementación que no aparece en la tabla de estado.

### Implicaciones para próximas sesiones

- Toda creación nueva de skill **evaluará la ubicación** vía el proceso documentado en `skill-scaffold` y `shared-skill-builder`. Default sigue siendo el dept; `_shared/` solo cuando los criterios de §7.1 se cumplen claramente.
- Toda nueva business-skill compartida sigue el patrón: archivo en `_shared/skills/<name>/SKILL.md` + actualización de agentes consumidores en sus tablas `## Skills disponibles`.
- Si una skill compartida empieza a divergir entre depts, el flujo correcto es **duplicarla y dejarla específica en cada dept**, no añadir condicionales en la skill compartida.

## 1.10.0 — 2026-05-13

### Departamento Design — activado

Octavo departamento implementado tras Marketing, Sales, Software, HR, Product, Finance y Legal. Design pasa de **stub honesto (🚧 TODO)** a **✅ implementado** con orquestador, 4 agentes especialistas y 3 skills v1 prosa.

**Estado tras esta versión:** 8 depts implementados, 1 parcial (Operations) y 1 TODO (DevOps).

**Composición decidida (revaluación de los 4 agentes stub previstos):**

Composición según README sin cambios (`design-ui`, `design-ux-research`, `design-design-system`, `design-accessibility`), pero con una **decisión operativa clave** sobre `design-ux-research`: opera de forma **autónoma como UX puro** sobre interfaces existentes o propuestas, **sin coordinación obligatoria con `product-discovery`**. La frontera operativa es: `product-discovery` investiga *qué problema resolver*; `design-ux-research` investiga *qué tan bien se resuelve con la interfaz*. Decisión documentada en el system prompt del agente para evitar drift futuro.

**Cambios concretos:**

- `.aigent/departments/design/design-orchestrator.md` — sustituye al stub. Paths default: `ui/{screens,components,prototypes}/`, `ux-research/{usability-tests,journey-maps,heuristic-evals,friction}/`, `design-system/{tokens,foundations,components,docs}/`, `accessibility/{audits,remediation,patterns}/`. Paso 0.5 amplía con confirmación de **plataformas objetivo, brand de referencia (coordinación con marketing si existe), nivel WCAG objetivo (AA por defecto), idioma(s) de interfaz**.
- `.aigent/departments/design/agents/design-ui.md` — sustituye al stub. Foco: layouts, mockups, prototipos, specs para handoff con estados completos (default + hover + focus + active + disabled + loading + error + empty) + responsive. Lista skill `ui-component-spec`.
- `.aigent/departments/design/agents/design-ux-research.md` — sustituye al stub. Foco UX puro autónomo (usability tests, heuristic eval, journey maps, friction analysis, card sorting, tree testing). Restricción explícita de no reemplazar a `product-discovery`. Sin skill propia (plantillas internas por método).
- `.aigent/departments/design/agents/design-design-system.md` — sustituye al stub. Foco: tokens, foundations, componentes con guidelines de uso, versioning serio con semver, deprecations planificadas. Lista skill `design-token-set`.
- `.aigent/departments/design/agents/design-accessibility.md` — sustituye al stub. Foco: audits WCAG 2.2 AA por defecto, ARIA, keyboard, screen readers (VoiceOver/NVDA/JAWS/TalkBack), contraste, focus management. Lista skill `accessibility-audit`.

**Skills v1 nuevas (3):**

- `.aigent/departments/design/skills/design-ui-component-spec/SKILL.md` — spec UI para handoff con anatomía, props/variantes, estados completos, responsive, tokens consumidos, accesibilidad mínima, edge cases (texto largo, datos vacíos, errores, permisos), criterios de aceptación.
- `.aigent/departments/design/skills/design-token-set/SKILL.md` — set de design tokens por categoría (color/spacing/typography/radius/shadow/motion) con base + semánticos, soporte light/dark, traducción multi-plataforma (web/iOS/Android), versioning semver + política de deprecation, tabla maestra de contraste WCAG para tokens de color.
- `.aigent/departments/design/skills/design-accessibility-audit/SKILL.md` — audit WCAG 2.2 estructurado con scope, metodología (manual + screen reader + tooling), tabla de SC con pass/fail/partial/N-A, hallazgos individuales con severidad (bloqueante/crítico/mayor/menor/cosmético) y categoría (`[DS FIX]` / `[ENGINEERING FIX]`), casos edge (zoom 200%, reduced motion, high contrast, RTL), score por nivel.

---

### Cambios en archivos transversales

- `.aigent/README.md` — tabla "Estado de los departamentos": Design pasa a ✅ implementado. Nueva sección detallada "### Design — ✅ implementado". Tabla "DevOps...TODO" reducida a solo DevOps. MCPs recomendados añadidos.
- `.aigent/BOSS.md` — tabla "Departamentos": Design pasa a línea de implementados con su disparador.
- `.aigent/VERSION` — bump 1.9.0 → 1.10.0 (MINOR: un dept activado, sin romper contratos previos).
- `.aigent/CHANGELOG.md` — esta entrada.

### Próximos pasos (siguientes sesiones)

- Activar el último dept TODO: **DevOps**.
- Operations sigue ⚠️ parcial (tiene skill v2 `redmine` pero sin agentes especialistas implementados).
- Con 8 de 9 depts implementados, una posible siguiente versión MINOR completaría el set; tras eso, espacio para MAJOR si se rediseña la estructura de orquestación.

## 1.9.0 — 2026-05-13

### Departamentos Finance y Legal — activados

Dos departamentos pasan de **stub honesto (🚧 TODO)** a **✅ implementado** en la misma versión: Finance (3 agentes + 3 skills v1, con fusión deliberada de invoicing) y Legal (4 agentes + 3 skills v1). Sexto y séptimo departamento implementados tras Marketing, Sales, Software, HR y Product.

**Estado tras esta versión:** 7 depts implementados (Marketing, Sales, Software, HR, Product, Finance, Legal), 1 parcial (Operations) y 2 TODO (Design, DevOps).

---

### Finance — 3 agentes (fusión deliberada de invoicing), 3 skills v1

Composición re-evaluada respecto al README: en lugar de 4 agentes (`finance-budgeting`, `finance-invoicing`, `finance-reporting`, `finance-treasury`) se quedan **3** fusionando invoicing en reporting. Invoicing es alta procedural: la skill `invoice-template` cubre el caso de uso, y mantener un agente entero para emitir facturas añadía superficie sin razonamiento exclusivo. `finance-reporting` absorbe el ciclo de AR/AP por encajar con el ciclo contable (issue → record → close).

**Cambios concretos:**

- `.aigent/departments/finance/finance-orchestrator.md` — sustituye al stub. Paths default: `budgeting/{annual,forecasts,scenarios}/`, `reporting/{close,statements,board,kpi,invoices,ap}/`, `treasury/{cash,banking,fx-debt}/`. Paso 0.5 amplía con confirmación de **moneda funcional, marco contable (IFRS/GAAP/PGC), año fiscal y periodicidad de cierre** — datos críticos para cualquier output financiero.
- `.aigent/departments/finance/agents/finance-budgeting.md` — presupuestos anuales/trimestrales, rolling forecasts, scenarios, headcount, capex. Drivers antes que líneas. Lista skill `budget-plan`.
- `.aigent/departments/finance/agents/finance-reporting.md` — cierres mensuales/trimestrales/anuales, P&L/Balance/Cash Flow, KPI dashboard, board reports, AR/AP cycle, conciliaciones. Lista skills `financial-report`, `invoice-template`.
- `.aigent/departments/finance/agents/finance-treasury.md` — cash management, banca, FX exposure, working capital, short-term financing. Restricción explícita de conservadurismo en planificación (cobros tarde, pagos antes).

**Stub pendiente de borrado manual por el usuario** (permiso de delete denegado al agente):
- `.aigent/departments/finance/agents/finance-invoicing.md`

**Skills v1 nuevas (3):**

- `.aigent/departments/finance/skills/finance-budget-plan/SKILL.md` — presupuesto estructurado con drivers, P&L mensualizado, headcount plan, capex plan, escenarios (best/base/worst) + sensibilidades, supuestos trazables y variance framework para futuros ciclos.
- `.aigent/departments/finance/skills/finance-financial-report/SKILL.md` — report financiero con resumen ejecutivo adaptado a audiencia (board / leadership / externo), P&L + Balance + Cash Flow con comparativos, KPI dashboard, variance commentary obligatorio, forecast actualizado opcional.
- `.aigent/departments/finance/skills/finance-invoice-template/SKILL.md` — factura a cliente con campos fiscales del país emisor, numeración consecutiva por serie (factura / rectificativa / proforma), cálculo de impuestos y retenciones, términos de pago, notas legales por jurisdicción.

---

### Legal — 4 agentes, 3 skills v1, con aviso fundamental

Composición según README sin cambios — Privacy lo merece como dominio especializado (GDPR/CCPA/LGPD), risk cubre due diligence y compliance general, policies cubre T&C/AUP externos (distinto de `hr-policies` interno).

**Aviso fundamental añadido a todo el dept:** estos agentes producen **borradores y estructura, NO asesoría legal**. Cada output marca explícitamente `[REVISAR LEGAL]` los pasajes críticos y el orquestador rechaza emitir opinión vinculante. El orquestador y todos los agentes lo recuerdan en sus restricciones.

**Cambios concretos:**

- `.aigent/departments/legal/legal-orchestrator.md` — sustituye al stub. Paths default: `contracts/{nda,msa,sow,licenses,other}/`, `policies/{terms,aup,cookies,sla}/`, `privacy/{policy,dpa,dpia,ropa,transfers,breaches}/`, `risk/{reviews,dd,litigation,ma}/`. Paso 0.5 amplía con confirmación de **jurisdicción principal, jurisdicciones de operación y marcos regulatorios aplicables (GDPR/CCPA/LGPD/sectoriales)** — críticos para cualquier output legal. Nota explícita de solapamiento con `hr-policies` (interno) vs `legal-policies` (externo).
- `.aigent/departments/legal/agents/legal-contracts.md` — NDAs, MSAs, SOWs, licencias, partnerships, term sheets, LOIs, consulting agreements. Equilibrio razonable, cláusulas críticas marcadas, trazabilidad de desviaciones. Lista skill `contract-template`.
- `.aigent/departments/legal/agents/legal-policies.md` — T&C, ToS, AUP, cookies, SLA público, disclaimers. Plain language sin perder rigor, jurisdicción declarada, versionado obligatorio. Lista skill `terms-of-service`.
- `.aigent/departments/legal/agents/legal-privacy.md` — privacy policy, DPAs, DPIAs, ROPA, transferencias internacionales (SCCs/BCRs/adequacy), DSAR, gestión de brechas. Marca regulatorio explícito, plazos de respuesta innegociables (30d DSAR, 72h brecha GDPR). Lista skill `privacy-policy`.
- `.aigent/departments/legal/agents/legal-risk.md` — risk analysis de decisiones, compliance reviews, due diligence, litigation tracking, M&A, whistleblowing channels. Riesgo = probabilidad × impacto, counsel externo en bucle desde día 1 en M&A/litigios.

**Skills v1 nuevas (3):**

- `.aigent/departments/legal/skills/legal-contract-template/SKILL.md` — borrador estructurado de contrato comercial (NDA / MSA / SOW / consulting / partnership) con preámbulo, definiciones, cláusulas (objeto, pricing, IP, confidencialidad, liability cap, indemnización, jurisdicción), resumen ejecutivo para el firmante y marca `[REVISAR LEGAL]` en cláusulas críticas.
- `.aigent/departments/legal/skills/legal-privacy-policy/SKILL.md` — política de privacidad pública compliant con GDPR/CCPA/LGPD: responsable, categorías de datos, finalidades con base legal, plazos, destinatarios, transferencias internacionales, derechos del interesado con plazos, decisiones automatizadas, menores, cambios materiales.
- `.aigent/departments/legal/skills/legal-terms-of-service/SKILL.md` — T&C / ToS estructurados con resumen de 3 minutos, cuenta, pricing & billing, IP del usuario y del servicio, AUP resumido, limitación responsabilidad, indemnización, terminación, modificaciones materiales con plazo de aviso, derechos de consumo si aplican.

---

### Cambios en archivos transversales

- `.aigent/README.md` — tabla "Estado de los departamentos": Finance y Legal pasan a ✅ implementado. Dos nuevas secciones detalladas "### Finance — ✅ implementado" y "### Legal — ✅ implementado". Tabla "Design...TODO" reducida a Design + DevOps. MCPs recomendados añadidos por dept.
- `.aigent/BOSS.md` — tabla "Departamentos": Finance y Legal pasan a líneas de implementados con sus disparadores.
- `.aigent/VERSION` — bump 1.8.0 → 1.9.0 (MINOR: dos depts activados, sin romper contratos previos).
- `.aigent/CHANGELOG.md` — esta entrada.

### Próximos pasos (siguientes sesiones)

- Borrado manual del stub `finance-invoicing.md` (acción del usuario).
- Activar los 2 depts TODO restantes: Design y DevOps.
- Operations sigue ⚠️ parcial (tiene skill v2 `redmine` pero sin agentes especialistas implementados).
- Con 7 de 9 depts implementados, considerar siguiente versión MAJOR si se rediseña la estructura de orquestación o si surge un patrón cross-dept frecuente que justifique extraer al `_shared/`.

## 1.8.0 — 2026-05-13

### Departamentos HR y Product — activados

Dos departamentos pasan de **stub honesto (🚧 TODO)** a **✅ implementado** en la misma versión: HR (4 agentes + 3 skills v1) y Product (3 agentes + 3 skills v1, con fusión deliberada). Cuarto y quinto departamento implementados tras Marketing, Sales y Software.

**Estado tras esta versión:** 5 depts implementados (Marketing, Sales, Software, HR, Product), 1 parcial (Operations) y 4 TODO (Design, DevOps, Finance, Legal).

---

### HR — 4 agentes, 3 skills v1

Composición según README sin cambios. Los 4 stubs originales conservan rol pero se redactan con system prompt completo.

**Cambios concretos:**

- `.aigent/departments/hr/hr-orchestrator.md` — sustituye al stub. Paths default: `recruitment/{jd,interview-kits,candidates,offers}/`, `onboarding/`, `evaluation/{reviews,one-on-ones,pips}/`, `policies/`. Tabla de decisión con disparadores en español. Nota de solapamiento con futuro `legal-policies`.
- `.aigent/departments/hr/agents/hr-recruitment.md` — JDs, sourcing, interview kits, screening, scorecards, ofertas, rejection. Lista skill `job-description`.
- `.aigent/departments/hr/agents/hr-onboarding.md` — plan 30/60/90, day-1 checklist, welcome pack, evaluación de período de prueba, retros de onboarding. Sin skill propia (plantilla interna).
- `.aigent/departments/hr/agents/hr-evaluation.md` — 1:1s, performance reviews, OKRs personales, career growth, PIPs, eNPS. Lista skill `performance-review`. Confidencialidad como restricción explícita.
- `.aigent/departments/hr/agents/hr-policies.md` — handbook, políticas individuales, comunicación de cambios, benchmarks. Lista skill `policy-document`. Marca jurisdicción y coordinación con legal como puntos críticos.

**Skills v1 nuevas (3):**

- `.aigent/departments/hr/skills/hr-job-description/SKILL.md` — JD completo con frontmatter `type`, EVP, responsabilidades, must/nice, banda salarial (con pay-transparency consciente de jurisdicción), proceso, equidad.
- `.aigent/departments/hr/skills/hr-performance-review/SKILL.md` — review estructurado con secciones evidencia → impacto → competencias → rating con calibración → feedback con frases listas → growth plan → feedback bidireccional → decisiones derivadas.
- `.aigent/departments/hr/skills/hr-policy-document/SKILL.md` — política individual con propósito, scope, definiciones, reglas, procedimiento, excepciones, consecuencias, owner y fecha de revisión. Plain language + jurisdicción.

---

### Product — 3 agentes (fusión deliberada), 3 skills v1

Composición re-evaluada respecto al README: en lugar de 4 agentes (`product-discovery`, `product-roadmap`, `product-strategy`, `product-metrics`) se quedan **3** fusionando strategy + roadmap. Aplicación literal de la regla "más agentes ≠ mejor" del CLAUDE.md: strategy decide *qué/por qué* y roadmap decide *cuándo* — son la misma disciplina por dos ejes; mantenerlos separados forzaba al orquestador a coordinarlos casi siempre.

**Cambios concretos:**

- `.aigent/departments/product/product-orchestrator.md` — sustituye al stub. Paths default: `discovery/{interviews,research,personas}/`, `strategy/{vision,competitive,prds,roadmap}/`, `metrics/{definitions,okrs,analysis}/`. Tabla de decisión con disparadores en español.
- `.aigent/departments/product/agents/product-discovery.md` — user interviews, JTBD, opportunity-solution trees, validación de problema y solución, personas, customer journey maps. Lista skill `user-interview-script`. Restricción explícita contra preguntas guiadas, contra personas demográficas vacías, contra declarar problema validado con n=1.
- `.aigent/departments/product/agents/product-strategy-roadmap.md` — agente NUEVO (fusión). Visión, posicionamiento, análisis competitivo, priorización (RICE/MoSCoW/Kano/Cost-of-delay), roadmap por trimestres o now/next/later, bets. Lista skill `product-roadmap`.
- `.aigent/departments/product/agents/product-metrics.md` — north star, OKRs producto, KPI trees, instrumentación, frameworks (AARRR/HEART/Pirate), análisis de experimentos. Lista skill `north-star-metric`. Restricciones explícitas contra métricas vanity, contra confundir correlación con causalidad, contra OKRs sin número.

**Stubs pendientes de borrado manual por el usuario** (permiso de delete denegado al agente):
- `.aigent/departments/product/agents/product-strategy.md`
- `.aigent/departments/product/agents/product-roadmap.md`

**Skills v1 nuevas (3):**

- `.aigent/departments/product/skills/product-user-interview-script/SKILL.md` — script con calentamiento, exploratorias, profundización (5 whys suave), preguntas de comportamiento (no hipotéticas), reacción a propuesta (solo solution-validation), cierre, debrief en caliente, notas para el entrevistador.
- `.aigent/departments/product/skills/product-roadmap/SKILL.md` — roadmap por horizonte (now/next/later o quarterly), fichas por iniciativa con outcome + hipótesis + dependencias + riesgo + criterio de éxito, sección "Lo que NO está en el roadmap (y por qué)", confianza explícita, cadencia de revisión.
- `.aigent/departments/product/skills/product-north-star-metric/SKILL.md` — NSM con candidates evaluados contra 3 criterios (valor, accionabilidad, sostenibilidad), definición operativa precisa, KPI tree de inputs, guardraíles, anti-patrones a evitar, cadencia de revisión.

---

### Cambios en archivos transversales

- `.aigent/README.md` — tabla "Estado de los departamentos": HR y Product pasan a ✅ implementado. Dos nuevas secciones detalladas "### HR — ✅ implementado" y "### Product — ✅ implementado". Tabla "Design...TODO" reducida a Design, DevOps, Finance, Legal. MCPs recomendados añadidos por dept.
- `.aigent/BOSS.md` — tabla "Departamentos": HR y Product pasan a líneas de implementados con sus disparadores.
- `.aigent/VERSION` — bump 1.7.0 → 1.8.0 (MINOR: dos depts activados, sin romper contratos previos).
- `.aigent/CHANGELOG.md` — esta entrada.

### Próximos pasos (siguientes sesiones)

- Borrado manual de los stubs `product-strategy.md` y `product-roadmap.md` (acción del usuario).
- Activar los 4 depts TODO restantes: Design, DevOps, Finance, Legal.
- Operations sigue ⚠️ parcial (tiene skill v2 `redmine` pero sin agentes especialistas implementados).

## 1.7.0 — 2026-05-13

### Departamento Software — activado

Tercer departamento implementado tras Marketing y Sales. El dept Software pasa de **stub honesto (🚧 TODO)** a **✅ implementado** con orquestador, 4 agentes especialistas y 3 skills v1 prosa.

**Composición decidida (revaluación de los 4 agentes stub previstos en el README):**

Los 4 agentes stub originalmente listados eran `software-architecture`, `software-code-review`, `software-qa`, `software-docs`. Tras cuestionar la composición (regla "más agentes ≠ mejor" del CLAUDE.md de este repo):

- Se mantienen `software-architecture`, `software-code-review`, `software-qa`.
- Se elimina `software-docs`: su trabajo se reparte — PRDs van a `shared-prd-agent` (ya existente), ADRs a `software-architecture` (con la nueva skill `adr`), y READMEs/runbooks/API docs quedan como candidatos a skills v1 si aparece la necesidad.
- Se añade **`software-coding`** como cuarto agente (implementador): toma specs (PRD/ADR/ticket) y produce código de producción, agnóstico de stack. Cierra el ciclo *architecture → coding → code-review → qa*.

**Cambios concretos:**

- `.aigent/departments/software/software-orchestrator.md` — sustituye al stub. Sigue `_shared/orchestrator-template.md` literalmente: Paso 0 (proyecto activo), Paso 0.5 (paths default + MCPs), gestión de tareas con prefijo `SW-###`, 4 agentes en "Agentes disponibles", tabla de decisión rápida, manejo de skills v2 readiness, reglas de output con subcarpetas (`architecture/{adr,designs,evaluations}/`, `code/` o repo del proyecto, `reviews/`, `qa/{plans,cases}/`).
- `.aigent/departments/software/agents/software-architecture.md` — sustituye al stub. Foco: ADRs, diseños de sistema, evaluaciones de stack, modelado de dominio. Lista la skill `adr`.
- `.aigent/departments/software/agents/software-coding.md` — agente NUEVO. Foco: implementación, fixes, refactors, migraciones. Stack agnóstico. Sin skills propias por ahora (trabaja directamente sobre el repo).
- `.aigent/departments/software/agents/software-code-review.md` — sustituye al stub. Foco: review estructurado con severidades 🔴/🟠/🟡/🔵, 8 ejes (corrección, seguridad, tests, legibilidad, idiomatic, performance, mantenibilidad, arquitectura). Lista la skill `code-review-checklist`.
- `.aigent/departments/software/agents/software-qa.md` — sustituye al stub. Foco: estrategia de testing, planes por nivel (unit/integration/e2e/perf/security), criterios de aceptación. Lista la skill `test-plan`.
- `.aigent/departments/software/agents/software-docs.md` — **pendiente de borrado manual** por el usuario (el agente carecía de permiso de delete; el archivo ya no aparece referenciado por orquestador ni README).

**Skills v1 nuevas (3):**

- `.aigent/departments/software/skills/software-adr/SKILL.md` — Architecture Decision Record numerado y fechado: contexto, drivers, opciones (mínimo 2), decisión, consecuencias, riesgos. Convención de supersedes para reversiones.
- `.aigent/departments/software/skills/software-code-review-checklist/SKILL.md` — report estructurado: veredicto (✅/🟠/🔴), top 3, hallazgos por severidad con `archivo:línea/categoría/razón/sugerencia/referencias`, análisis por 8 ejes.
- `.aigent/departments/software/skills/software-test-plan/SKILL.md` — plan por niveles (unit/integration/e2e/perf/security) con casos `TC-###`, prioridades P0-P3, criterios de salida verificables, riesgos.

**Cambios en archivos transversales:**

- `.aigent/README.md` — tabla "Estado de los departamentos": Software pasa de 🚧 TODO a ✅ implementado (4/4 agentes, 3 skills). Nueva sección "### Software — ✅ implementado" con tabla de agentes y skills. Tabla "Design...Software TODO" reducida (sin Software). MCPs recomendados para Software añadidos (GitHub, GitLab, filesystem, git, search en código).
- `.aigent/BOSS.md` — tabla "Departamentos": Software pasa a línea de implementados con su disparador.
- `.aigent/VERSION` — bump 1.6.3 → 1.7.0 (MINOR: nueva capacidad del sistema, no rompe contratos existentes).
- `.aigent/CHANGELOG.md` — esta entrada.

**Stack agnóstico.** Todos los agentes y skills del dept se adaptan al lenguaje/framework del proyecto activo. No asumen Node/Python/Go/etc. ni mencionan herramientas concretas en system prompts (regla §8 de conventions).

**Próximos pasos (siguientes sesiones):**

- Borrado físico del stub `software-docs.md` (acción manual del usuario).
- Validar la composición en uso real y, si aparecen patrones repetidos, formalizar skills v1 adicionales: candidatas naturales `runbook`, `api-doc`, `tech-spec`, `bug-report`.
- Considerar skills v2 si Aigent quiere ejecutar contra GitHub/GitLab API directamente (cuando no haya MCP fiable).

## 1.6.3 — 2026-05-11

### Fix `--dept all` / `-Dept all` en los instaladores

El flag CLI para instalar todos los departamentos no funcionaba: pasaba el literal `"all"` como nombre de departamento, e `install_dept` buscaba `departments/all/`, no encontraba nada e imprimía silenciosamente `📁 all` con `0 archivo(s)` sin instalar nada. El modo interactivo (botón "Todos") sí funcionaba porque ya expandía internamente a la lista real.

**Cambios concretos:**

- `.aigent/IDE/install.sh` (línea 693): tras resolver `$DEPT`, si vale `"all"` se expande a la lista real de departamentos vía `list_departments` antes de iterar. Los otros casos (single, csv, interactivo) siguen split por coma/espacio como antes.
- `.aigent/IDE/install.ps1` (línea 759): mismo fix en PowerShell usando `Get-Departments`.

Verificado: los 4 caminos funcionan — `--dept all` (expande), `--dept marketing` (single), `--dept marketing,sales` (csv) y modo interactivo (que nunca pasa "all" literal, sólo nombres reales).

Bump PATCH.

## 1.6.2 — 2026-05-11

### Migración GitLab → GitHub

El repositorio se ha movido de GitLab (`gitlab.com/cloudappi/i-y-d/aigent-company`) a GitHub (`github.com/WaimaGroup/aigent-company`). Se actualizan las referencias textuales en el README de la raíz y en los instaladores; no cambia el comportamiento del motor ni el contrato de skills.

**Cambios concretos:**

- `README.md` (raíz): sección "Repositorio" ahora apunta a GitHub.
- `.aigent/IDE/install.sh`: mensajes de `--update` y error de fetch ahora dicen GitHub (líneas 112, 131, 571, 591).
- `.aigent/IDE/install.ps1`: mismas correcciones para PowerShell (líneas 417, 444, 672, 691).

Cambio puramente textual sin tocar contrato de engine/skills. Bump PATCH.

## 1.6.1 — 2026-05-11

### Skill `linkedin-audit` — copy plain-text listo para pegar en LinkedIn

LinkedIn no acepta sintaxis markdown en el cuerpo del post: `**negrita**`, `## títulos`, listas con `-` y `[texto](url)` aparecen como texto literal. La skill ahora produce, además del análisis de métricas, una versión plain-text del copy lista para copiar y pegar.

**Cambios concretos en `marketing/skills/marketing-linkedin-audit/SKILL.md`:**

- **Entregable ampliado:** ahora son dos secciones añadidas al `.md` del post — `## MÉTRICAS OBJETIVO` (igual que antes) y `## COPY PARA LINKEDIN` (nueva). El copy original en markdown se mantiene intacto como fuente editable.
- **Frontmatter `description`** actualizado para reflejar la nueva capacidad.
- **Nuevo paso 8** en el proceso: "Generar copy plain-text listo para LinkedIn". Incluye tabla de transformaciones (negrita, cursiva, headings, listas, enlaces, código inline, citas) y reglas para saltos de línea, gancho, emojis (2–5 profesionales), enlaces penalizados (movidos a "Pegar en el primer comentario") y hashtags.
- **Plantilla del entregable** ampliada con el bloque `## COPY PARA LINKEDIN`.
- **Restricciones** nuevas: no modificar el copy original al generar la versión plain-text, no saturar con emojis, reflejar en plain-text la penalización de enlace externo si la hubo.
- Paso 9 (antes paso 8): añade recordatorio explícito al usuario de que `## COPY PARA LINKEDIN` es lo que se pega en LinkedIn, no la versión en markdown.

Cambio acotado a una skill v1 prosa; no toca convenciones, orchestrator-template ni engine. Bump PATCH.

## 1.6.0 — 2026-05-11

### Skill nueva - linkedin-audit

Nueva skill para auditar y crear posts de linkedin

## 1.5.0 — 2026-05-08

### Engine v2 — errores de readiness enriquecidos

`engine.js run` ahora devuelve `CONFIG_ERROR` y `SECRETS_ERROR` con `details` estructurado en lugar de sólo un string en `message`. El agente caller no necesita parsear texto: lee directamente qué falta y qué hacer.

**Forma del error:**

```json
{
  "ok": false,
  "error": {
    "code": "CONFIG_ERROR" | "SECRETS_ERROR",
    "message": "...",
    "details": {
      "skill": "<skill>",
      "missing_config":  [{ "key", "path", "type", "description" }],
      "missing_secrets": [{ "name", "description" }],
      "secrets_file": "/abs/path/.context/.secrets.json",
      "next": [ "...comandos exactos a ejecutar..." ],
      "rule": "Los secretos NUNCA se aceptan por chat. Solo se le indica al usuario donde ponerlos."
    }
  }
}
```

Cambios concretos en `engine/engine.js`: nueva función `readinessError(code, message, found)` que reutiliza `doctorOne` (de `configure.js`) para construir el reporte y la lista de pasos siguientes con los comandos exactos (`configure --set ...`, `prepare-secrets`, `doctor`). `runAction` la llama desde los `catch` de `loadConfig` / `loadSecrets`.

### Documentación — precheck proactivo como camino principal

Hasta 1.4.0 la red de seguridad era **reactiva**: el agente llamaba a `run`, recibía el error y entonces delegaba en `shared-skill-builder configure`. El usuario no veía nada hasta que algo fallaba. A partir de 1.5.0 el camino preferido es **proactivo**: ejecutar `doctor <skill>` antes del `run` y, si `ready: false`, lanzar el flujo de configuración antes de pedir inputs reales.

**Archivos actualizados:**

- `_shared/conventions.md`
  - §12.7 — añadido el contrato de los nuevos errores de readiness enriquecidos.
  - §12.8 — dos reglas nuevas en negrita: **Precheck proactivo (regla de oro)** y **Secrets nunca por chat (regla de seguridad)**. La segunda incluye el wording exacto para rechazar al usuario si intenta dictar un secreto.
  - §6 — el título de la sección obligatoria del orquestador pasa de "Manejo de skills v2 no configuradas" a "Manejo de skills v2 — readiness".
- `_shared/orchestrator-template.md` — la sección "Manejo de skills v2 — readiness" se reorganiza en dos caminos (proactivo principal + reactivo fallback) con un único flujo de configuración común y un bloque "Reglas (innegociables)".
- `_shared/skills/shared-skill-scaffold/SKILL.md` — la plantilla v2 ahora obliga a incluir una sección **"Antes de ejecutar (precheck para el agente caller)"** justo después de Requisitos y antes de Acciones. El checklist estructural (paso 0 de la verificación v2) la verifica explícitamente.
- `_shared/agents/shared-skill-builder.md` — el modo `configure` distingue tres disparadores con el mismo proceso: tras `create-v2`, **proactivo** (recomendado: orquestador hace `doctor` y delega antes de `run`), **reactivo** (un `run` ya falló). Refuerzo en el paso 3: la regla "secrets nunca por chat" es **innegociable**, aplica también si el usuario insiste o argumenta entorno de desarrollo.
- `operations/skills/operations-redmine/SKILL.md` — añadida la sección "Antes de ejecutar (precheck)" con el wording específico de la skill (`<replace_me_REDMINE_API_KEY>`, link a `/my/account`).
- `sales/sales-orchestrator.md` — sincronizado con la nueva versión de la plantilla.

### Redmine — nueva acción `update-time-entry` (skill 0.3.0)

Antes la única forma de editar una imputación era ir por web/curl manualmente. Añadida acción `update-time-entry` que mapea a `PUT /time_entries/:id.json`. Inputs: `time_entry_id` (required) + `hours`, `activity_id`, `spent_on`, `comments`, `issue_id`, `project_id` opcionales (sólo se envían si se aportan). Devuelve 204 → `data: null`. La skill pasa de 9 a 10 acciones; `validate` ok con 0 warnings.


## 1.4.0 — 2026-05-08

### Secretos — nueva ubicación: `.context/.secrets.json`

**Cambio limpio (sin retrocompatibilidad — fases iniciales).** Los secretos se mueven de `.aigent/v2/.secrets.json` a `.context/.secrets.json`. Razones:

- `.aigent/` es "el motor", los agentes no escriben ahí. `.context/` sí lo manejan los agentes.
- `.context/` se commitea, pero se añade un `.context/.gitignore` que excluye específicamente `.secrets.json` (el resto de `.context/` sigue commiteándose: config, prd, tasks).
- El engine auto-crea `.context/`, `.context/.gitignore` y `.context/.secrets.json` si no existen al llamar a `prepare-secrets`. Cero setup manual.

### Cambios concretos

- **`engine/configure.js`**: `SECRETS_PATH` apunta a `.context/.secrets.json`. Nueva función `ensureContextWithGitignore()` que se llama desde `prepareSecrets`.
- **`engine/engine.js`**: `SECRETS_PATH` se importa de `configure.js` (ya no se duplica).
- **Eliminado** `.aigent/v2/.secrets.example.json` (innecesario; el engine genera placeholders dinámicamente desde el manifest).
- **Eliminado** `.aigent/v2/.secrets.json` antiguo si existía. `.aigent/v2/.gitignore` simplificado (sólo node_modules y similares).
- **Installers** (`install.sh` / `install.ps1`): nueva función `install_context_secrets` / `Install-ContextSecrets` que crea `.context/.gitignore` y `.context/.secrets.json` vacío en primera pasada (no en `--sync`).
- **Documentación actualizada** en `_shared/conventions.md` (§1, §12.5, §12.8, §12.9), `_shared/agents/shared-skill-builder.md`, `_shared/orchestrator-template.md`, `_shared/skills/shared-skill-scaffold/SKILL.md`, `operations/skills/operations-redmine/SKILL.md`, `v2/README.md`.

### Migración para usuarios existentes

Si tenías `.aigent/v2/.secrets.json` con valores: cópialos manualmente a `.context/.secrets.json` (mismo shape) y bórralo. O ejecuta `prepare-secrets <skill>` y rellena los placeholders. No hay fallback automático del engine (clean cut).

### Triple red de seguridad

El scaffold del fichero (`.context/.gitignore` + `.context/.secrets.json`) lo hacen **tres** sitios independientes para que sea imposible quedarse sin él:

1. **BOSS bootstrap** (al arrancar cada sesión): pasos 2-3 del bootstrap en `BOSS.md`. Si falta, lo crea silenciosamente.
2. **Installer** (`install.sh` / `install.ps1`, primera pasada): función `install_context_secrets`.
3. **Engine** (al llamar `prepare-secrets`): función `ensureContextWithGitignore` en `configure.js`.

Cualquiera de los tres garantiza que la estructura existe. Si el usuario borra el fichero, el siguiente arranque o el siguiente `prepare-secrets` lo restaura.

## 1.3.0 — 2026-05-08

### Orquestadores — red de seguridad para skills v2
- Nueva sección obligatoria en `_shared/orchestrator-template.md`: **"Manejo de skills v2 no configuradas"**.
- Documenta el flujo: cuando un agente reporta `CONFIG_ERROR` o `SECRETS_ERROR` del engine, el orquestador detiene la tarea, delega en `shared-skill-builder configure <skill>`, espera a que la skill esté lista (`doctor` ready), y reintenta el `run` original.
- Refuerza la regla: ni el orquestador ni los agentes aceptan valores de secret por chat. Sólo `shared-skill-builder` toca config/secrets, y vía engine.
- `_shared/conventions.md` §6 (estructura mínima de orquestador) actualizado para incluir esta sección entre las obligatorias.

## 1.2.0 — 2026-05-08

### Engine v2 — onboarding de skills
- Comando `doctor [<skill>]` — reporta estado de config + secrets de una o todas las skills. JSON estructurado: `{ skill, ready, config[], secrets[], missing_count }`.
- Comando `configure <skill> --set <path>=<value> [--scope global|project]` — escribe valores en `.context/config.json` validando contra el manifest. Admite múltiple