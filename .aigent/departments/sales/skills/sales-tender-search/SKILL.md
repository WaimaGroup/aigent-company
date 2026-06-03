---
name: "sales-tender-search"
user-invocable: true
description: >
  Search public-sector tenders ("licitaciones") published on ATOM syndication
  feeds — by default the Spanish Plataforma de Contratación del Sector Público
  (PLACSP, contrataciondelestado.es) — filter them by CPV codes (mixed exact +
  prefixes like 722*), publication-date window and tender status (open / in
  submission period), then download the tender documents (pliegos) and produce
  per-tender summaries. **Trigger whenever the user wants to find, monitor or
  triage public tenders / contracts and read what each one asks for.** Activation
  keywords: "licitaciones", "tender", "contratación pública", "PLACSP",
  "contrataciondelestado", "CPV", "pliegos", "buscar concursos públicos",
  "oportunidades de licitación", "perfil del contratante". Ships with
  `atom-search.cjs` (Node 18+, no dependencies) for the search/extraction; chains
  with `shared-http-download` to fetch the pliegos and with `pdf` to summarize.
---

# Skill: Búsqueda de licitaciones (ATOM / PLACSP)

**Entregable:** por cada licitación relevante, sus **pliegos descargados** y un **`resumen.md`** que explique en lenguaje claro qué pide la licitación (objeto, alcance, requisitos, plazos, presupuesto, criterios), todo bajo la ruta de entregables del proyecto. Además, un **`licitaciones.md`** índice con la tabla de coincidencias.

> **Regla canónica del `.md` (obligatoria).** El `.md` (`licitaciones.md` + cada `resumen.md`) es el **único artefacto que esta skill produce siempre y primero**. Cualquier otro formato (Word/`docx`, Excel/`xlsx`, `pdf`…) es **opcional y solo a petición explícita**, y se genera **derivándolo del `.md` ya escrito** — nunca saltándose el `.md` ni generándolo directamente desde el JSON de la búsqueda. Sin petición de formato, el entregable termina en el `.md`.

**Archivos de la skill (fuente de verdad):**

```
sales-tender-search/
├── SKILL.md          ← este archivo (prosa + contrato + flujo)
└── atom-search.cjs    ← script Node 18+ sin dependencias (búsqueda + extracción)
```

El script es **parte del contrato**. Si la prosa diverge del script, gana el script y se ajusta la prosa.

---

## Cuándo usar esta skill

- Detectar oportunidades de negocio en licitaciones públicas filtrando por **CPV** (familias tipo `722*`, o códigos exactos), ventana de fechas y estado.
- Entender qué pide una licitación sin abrir manualmente cada pliego: descargar y resumir.
- Monitorización recurrente (p. ej. una corrida diaria de lo publicado en las últimas 24-48 h).

**Cuándo NO usar:**

- Redactar la oferta/propuesta para una licitación → eso es trabajo de la skill `sales-proposal`, no de esta.
- Datos de contratación que **no** estén en un feed ATOM (portales sin sindicación) → fuera de alcance.

---

## Realidad del feed (importante para entender el comportamiento)

El `.atom` de la PLACSP **no es una API consultable**: es sindicación masiva de **todas** las licitaciones, ordenadas por fecha y paginadas con `<link rel="next">` hacia ficheros `.atom` anteriores. No admite parámetros de CPV ni de fechas. Por eso el filtrado es **client-side** tras descargar: el script baja la página front (~13 MB, ≈ un día de publicaciones de todo el Estado) y, si la ventana de fechas lo exige, sigue paginando hacia atrás hasta `maxPages`. Filtrar por un CPV nicho ⇒ más páginas que bajar para acumular resultados. Cada `<entry>` trae el bloque CODICE (`ContractFolderStatus`) con CPV, estado, presupuesto, órgano, plazo y las URIs de los pliegos.

---

## Flujo

### Paso 1 — Buscar (`atom-search.cjs`)

```bash
.aigent/IDE/bin/run .aigent/departments/sales/skills/sales-tender-search/atom-search.cjs \
  --inputs '{
    "feedUrl": "https://contrataciondelestado.es/sindicacion/sindicacion_643/licitacionesPerfilesContratanteCompleto3.atom",
    "filters": { "cpv": ["722*", "48000000"] }
  }'
```

Devuelve JSON por stdout con `results[]` (ver contrato abajo). El progreso de descarga va por stderr. Leer `results` y quedarse con las licitaciones que interesen (el agente puede afinar por presupuesto, órgano, lugar, etc.).

### Paso 2 — Descargar pliegos (`shared-http-download`)

Para cada licitación elegida, pasar su `documentos[]` (los `{ url, titulo, tipo }` que ya trae el resultado) a la skill compartida, con `outDir` apuntando a la carpeta de esa licitación (ver "Ruta de entregables"):

```bash
.aigent/IDE/bin/run .aigent/departments/_shared/skills/shared-http-download/download.cjs \
  --inputs '{ "outDir": "<proyecto>/sales/licitaciones/<expediente>", "documentos": <results[i].documentos> }'
```

### Paso 3 — Resumir (skill `pdf`)

Leer los pliegos descargados con la skill `pdf` y escribir un `resumen.md` por licitación: objeto y alcance, requisitos de solvencia, criterios de adjudicación, plazo de presentación, presupuesto/valor estimado, y cualquier condición destacable. No reproducir el pliego entero: resumir en lenguaje claro y accionable para decidir si presentarse.

**Obligatorio en cada `resumen.md` — enlaces a los documentos originales.** Todo `resumen.md` debe terminar con una sección que enlace **siempre** a las fuentes originales, porque esas URLs vienen siempre en el resultado de la búsqueda (`results[i].enlace` y `results[i].documentos[]`). Nunca omitir esta sección aunque el resumen sea breve:

```markdown
## Documentos originales

- **Ficha de la licitación (PLACSP):** <results[i].enlace>
- **Pliegos / documentos:**
  - [<doc.titulo>](<doc.url>) — <doc.tipo>      ← una línea por cada documento de results[i].documentos[]
```

Usar la `url` original de cada documento (la del feed), no solo la copia local descargada — así el resumen siempre apunta a la fuente oficial vigente.

**Finalmente, escribir/actualizar el índice `licitaciones.md`** con la tabla de coincidencias (expediente, objeto, órgano, CPV, presupuesto, plazo, ficha PLACSP) y, **obligatorio**, en cada fila un enlace navegable al `resumen.md` de esa licitación (ruta relativa `<expediente>/resumen.md`). El objetivo es poder abrir el índice y saltar a cualquier resumen y de ahí a los documentos originales:

```markdown
| Expediente | Objeto | Órgano | CPV | Presupuesto | Plazo | Resumen | Ficha |
|---|---|---|---|---|---|---|---|
| 2026000435 | Servicios de… | Consejería… | 72227000 | 21.567.143 € | 2026-06-14 | [Ver resumen](2026000435/resumen.md) | [PLACSP](https://…) |
```

### Paso 4 — Otros formatos (opcional, solo a petición)

El `.md` (`licitaciones.md` + cada `resumen.md`) es la **fuente canónica**. El flujo de la skill **termina aquí por defecto**: sin una petición explícita, no se produce ningún otro formato.

Si —y solo si— el usuario pide explícitamente otro formato (Word/`docx`, Excel/`xlsx`, `pdf`…), se genera **derivándolo del `.md` ya escrito** con la skill correspondiente: `shared-office-writer` para `docx`/`xlsx` (writer nativo del framework, sin dependencias) y `pdf` para PDF. Reglas:

- **Nunca** generar `docx`/`xlsx`/etc. directamente desde los `results[]` de la búsqueda saltándose el `.md`. El `.md` se escribe siempre primero.
- El documento derivado **refleja el contenido del `.md`** (típicamente: el índice `licitaciones.md` → tabla `xlsx`; un `resumen.md` → `docx`). Si el `.md` cambia, se regenera el derivado.
- El derivado se guarda junto al `.md` de origen, no lo reemplaza: el `.md` permanece como fuente.

---

## Contrato de `atom-search.cjs`

### Inputs (`--inputs '<json>'`)

| Campo | Default | Notas |
|---|---|---|
| `feedUrl` | — | URL del feed ATOM. Obligatorio salvo que se use `file`. |
| `file` | — | Ruta local a un `.atom` (modo sin paginación; útil para pruebas/offline). |
| `profile` | `placsp-codice` | Extractor a aplicar. Único disponible por ahora. |
| `dateFrom` | hoy-7 | Ventana sobre `<updated>` (publicación). Fija hasta dónde paginar. |
| `dateTo` | hoy | Fin de la ventana de publicación. |
| `maxPages` | `3` | Tope de paginación (cada página ≈ 13 MB). Subir para más cobertura. |
| `limit` | `20` | Máximo de resultados devueltos. |
| `quiet` | `false` | `true` silencia el progreso por stderr. |
| `filters.cpv` | `[]` | Lista mixta: prefijos (`"722*"`) y/o exactos (`"48000000"`). Vacío = sin filtro CPV. |
| `filters.estado` | `["PUB"]` | Estados a incluir (`ContractFolderStatusCode`). `PUB` = en plazo. |
| `filters.minDeadline` | hoy | Plazo de presentación ≥ esta fecha. `null` lo desactiva. |

### Salida (stdout)

```json
{
  "ok": true,
  "query": { "...": "eco de los filtros aplicados" },
  "pagesFetched": 3,
  "scannedEntries": 1200,
  "matchedTotal": 7,
  "returned": 7,
  "truncated": false,
  "results": [{
    "expediente": "2026000435",
    "objeto": "Servicios de…",
    "organo": "Consejería de…",
    "cpv": ["72227000", "48000000"],
    "presupuesto": 21567143, "presupuestoSinIva": null, "valorEstimado": null, "moneda": "EUR",
    "estado": "PUB", "lugar": "Asturias",
    "fechaPublicacion": "2026-05-28", "fechaLimite": "2026-06-14", "horaLimite": "14:00:00",
    "enlace": "https://contrataciondelestado.es/…",
    "documentos": [{ "tipo": "Legal", "titulo": "PCAP.pdf", "url": "https://…" }]
  }]
}
```

Códigos de error (stdout `ok:false`, exit 1): `BAD_ARGS`, `HTTP_<status>`, `TIMEOUT`, `INTERNAL`.

---

## Ruta de entregables

Según `_shared/output-rules.md`, fuera de `.aigent/` y `.context/`. Estructura sugerida en la raíz del repo:

```
<proyecto>/
└── sales/
    └── licitaciones/
        ├── licitaciones.md                  ← índice/tabla de coincidencias
        └── <expediente>/
            ├── PCAP.pdf, PPT.pdf, …          ← pliegos descargados
            └── resumen.md                    ← resumen accionable de la licitación
```

`<expediente>` se toma de `results[i].expediente` (saneado a nombre de carpeta válido).

---

## Notas y límites

- **Coste de paginación:** CPV nicho + ventana amplia ⇒ más páginas de ~13 MB en serie. Empezar con `maxPages` bajo y subir si hace falta. Para una corrida rápida de prueba, `maxPages: 1`.
- **Codificación:** el script baja bytes y decodifica UTF-8; los textos salen limpios (los `Ã³` que se ven al abrir el feed en un navegador son artefacto del visor, no del script).
- **Histórico amplio:** el feed front solo cubre lo reciente. Para histórico la PLACSP publica ZIP mensuales de datos abiertos — no soportado aún por esta skill.
- **Genérico:** `atom-search.cjs` sirve para otros feeds ATOM añadiendo un `profile` nuevo (extractor) sin tocar el núcleo de fetch/paginación.

Aplican las reglas de output de `_shared/output-rules.md`.
