# Marketing — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Marketing.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`marketing-orchestrator.md`](./marketing-orchestrator.md).

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): hablar al `marketing-orchestrator`. Analiza la petición y delega al especialista correcto.
2. **Directo a agente**: cuando ya sabes a quién (ej. "redactor de blog" → `marketing-content`).
3. **Skill directa**: para tareas concretas (ej. "genérame un editorial-calendar de junio").

---

## Agentes

### `marketing-content` — Content & Copy

Posts de blog, emails, anuncios, comunicados, copy persuasivo de marca.

**Caso de uso:** post de blog SEO.

**Prompt:**
> "Necesito un post de blog sobre 'cómo elegir CRM para PYMEs', dirigido a CEOs de empresas 10-50 empleados, tono profesional pero accesible. Keyword principal: 'crm para pyme'. ~1500 palabras."

**Output esperado:**
- Ruta: carpeta `<proyecto>/marketing/posts/como-elegir-crm-para-pymes/`
  - `como-elegir-crm-para-pymes.md` — post completo
  - `como-elegir-crm-para-pymes.html` — preview con estilos
  - `_content.html` — fragmento para pegar en WordPress
  - `assets/` — placeholders de imágenes destacada/inline
  - `analytics/` — frontmatter con title, slug, meta_description, OG tags
- Estructura del .md:
  ```markdown
  ---
  title: Cómo elegir un CRM para PYMEs sin morir en el intento
  slug: como-elegir-crm-para-pyme
  meta_description: Guía práctica para CEOs de empresas 10-50 empleados...
  focus_keyword: crm para pyme
  ---

  # Cómo elegir un CRM para PYMEs sin morir en el intento

  ## El problema real: no es elegir, es no equivocarte
  Si llevas más de dos semanas comparando CRMs, ya sabes que el problema...

  ## Las 5 preguntas que tu equipo no quiere hacerse
  1. ¿Cuál es nuestro proceso de venta hoy (de verdad)?...
  ```

---

### `marketing-strategy` — Strategy

Planes de marketing, briefings, análisis competitivo, KPIs, lanzamientos.

**Caso de uso:** plan de marketing trimestral.

**Prompt:**
> "Plan de marketing para Q3 2026 de nuestra empresa SaaS B2B. Objetivo: +30% MQLs vs Q2. Presupuesto 80k€. Canales activos: SEO, LinkedIn ads, content, eventos."

**Output esperado:**
- Ruta: `<proyecto>/marketing/strategy/marketing-plan-q3-2026.md`
- Contenido:
  ```markdown
  # Plan de Marketing Q3 2026

  ## Resumen ejecutivo
  Objetivo: +30% MQLs (de 850 a 1100). Foco en SEO de fondo + 2 webinars de
  alta intención. Presupuesto 80k€ con 50% pago, 50% contenido + eventos.

  ## Contexto y aprendizajes de Q2
  - SEO empezó a convertir tras 5 meses: 18% del pipeline en jun-2026.
  - LinkedIn ads: CAC bajó 22% optimizando por cargo + sector.
  - Eventos: ROI bajo en presenciales, alto en webinars (3x).

  ## Objetivos
  | Métrica | Q2 actual | Q3 target |
  | MQLs | 850 | 1100 (+30%) |
  | SQLs | 220 | 290 |
  | CAC | 1.200€ | 1.000€ |

  ## Canales y presupuesto
  | Canal | Presupuesto | Target |
  | SEO + content | 25k€ | 400 MQLs |
  | LinkedIn ads | 30k€ | 400 MQLs |
  | Webinars | 15k€ | 200 MQLs |
  | Email nurture | 5k€ | 100 MQLs |
  | Contingencia | 5k€ | — |

  ## Calendario
  Julio: kickoff webinar serie. Agosto: SEO sprint top-of-funnel.
  Septiembre: lanzamiento campaña producto X.

  ## Riesgos
  - Equipo de content reducido en agosto (vacaciones)...
  ```

---

### `marketing-seo` — SEO

Keyword research, optimización on-page, auditorías, lectura de Analytics/Search Console.

**Caso de uso:** keyword research para nicho.

**Prompt:**
> "Investigación de keywords para nuestro pillar de 'gestión de proyectos para agencias'. Quiero priorizar las que mejor combinen volumen + intención comercial."

**Output esperado:**
- Ruta: `<proyecto>/marketing/seo/keyword-research-gestion-proyectos-agencias.md`
- Tabla priorizada:
  ```markdown
  # Keyword research — Gestión de proyectos para agencias

  ## Top 10 priorizadas

  | Keyword | Volumen | Dificultad | Intención | Página destino | Prioridad |
  | software gestión proyectos agencia | 1.300 | 38 | comercial | landing producto | P0 |
  | herramientas gestión proyectos creativos | 720 | 28 | comercial | post pilar | P0 |
  | mejor crm agencia marketing | 590 | 42 | comercial | comparativa | P1 |
  | gantt online agencia | 480 | 25 | informacional | post tool | P1 |
  | cómo organizar proyectos en agencia | 880 | 22 | informacional | guía pilar | P0 |
  | facturación proyectos agencia | 320 | 30 | navegacional | landing feature | P2 |
  ...

  ## Clusters identificados
  1. **Software / herramientas** (5 keywords) → landing producto
  2. **Procesos / cómo hacer** (4 keywords) → guía pilar
  3. **Comparativas** (3 keywords) → comparativas vs competidores

  ## Quick wins
  - "gantt online agencia" — KD bajo, intención clara, tenemos contenido
    parcial que adaptar.
  ```

---

### `marketing-social` — Social Media

Copies por plataforma, calendarios, hashtag strategy.

**Caso de uso:** adaptación de un post a múltiples redes.

**Prompt:**
> "Tenemos un nuevo case study de cliente (link al post). Adáptalo a LinkedIn, Instagram, X y TikTok. Tono profesional pero humano."

**Output esperado:**
- Ruta: `<proyecto>/marketing/social/platform-adapter-case-study-acme.md`
- Bloques listos para copiar:
  ```markdown
  ## LinkedIn (post largo, 1200 chars)
  Cuando ACME Corp llegó a nosotros, tardaban 11 días en cerrar un mes
  contable. Hoy lo hacen en 3.

  El cómo no fue magia: fue eliminar 4 hojas de cálculo que vivían en
  emails y reemplazarlas por un único sistema...

  [Read full case study →]

  #FinanceAutomation #SaaS #CFO

  ## Instagram (caption + visual brief)
  Caption (200 chars):
  De 11 días a 3 cerrando el mes. La historia de ACME contada por su CFO.
  Link en bio 👆

  Visual brief: carrusel 4 slides — quote del CFO, métrica before/after,
  workflow simplificado, CTA.

  ## X / Twitter (thread 4 tweets)
  1/ Cierre contable: 11 días → 3 días.
     La historia de @acmecorp 🧵

  2/ El problema no era el equipo. El equipo tenía 4 hojas de cálculo
     viviendo en cadenas de email...

  ## TikTok (script 45s)
  Hook (0-3s): "11 días para cerrar el mes. ¿Os pasa?"
  Body (3-35s): historia con números en pantalla...
  CTA (35-45s): "Link al case study completo en bio"
  ```

---

### `marketing-web` — Web & Landing Pages

Landing pages, contenido WordPress, arquitectura de información, CRO.

**Caso de uso:** landing page de conversión.

**Prompt:**
> "Landing page para nuestra nueva feature 'AI Insights' del producto. Objetivo: que el visitante pida demo. Audiencia: heads of analytics de empresas medianas."

**Output esperado:**
- Ruta: `<proyecto>/marketing/posts/landing-ai-insights/landing-ai-insights.md`
- Estructura:
  ```markdown
  # Landing: AI Insights

  ## Hero
  H1: Encuentra el insight que tu dashboard no te enseña
  Subhead: AI Insights analiza tu data en background y te trae las 3
  cosas que cambiarían tu trimestre — antes de que tú lo pidas.
  CTA primaria: "Pedir demo (15 min)"
  CTA secundaria: "Ver vídeo (2 min)"
  Visual: screenshot animado del producto con highlight

  ## Problem section
  - El 67% de los heads of analytics dicen que su equipo se ahoga en queries
  - Los dashboards muestran lo que pides, no lo que hace falta saber
  - La mayoría de insights críticos llegan tarde

  ## How it works
  3 pasos con iconos:
  1. Conecta tus fuentes (Snowflake, BigQuery, Redshift)
  2. AI Insights aprende los patrones normales en 2 semanas
  3. Recibes alertas y narrativa de los cambios significativos

  ## Social proof
  Quote del CFO de ACME + 3 logos.

  ## FAQ (acordeón)
  ¿Sustituye a mi BI actual? No, lo complementa.
  ¿Cuánto tarda en estar útil? 2 semanas de aprendizaje + uso pleno.
  ¿Qué pasa con la privacidad?...

  ## Cierre
  CTA: "Pedir demo de 15 min"
  ```

---

## Skills

### `blog-post` — Post de blog completo con SEO

Carpeta con `.md` + `.html` preview + `_content.html` para CMS + `assets/` + `analytics/`.

**Caso de uso:** post evergreen para SEO.

**Prompt:**
> "Post de blog sobre 'KPIs de customer success que importan en 2026'. Audiencia: heads of CS. Tono experto pero conversacional. ~1800 palabras."

**Output esperado:**
- Ruta: `<proyecto>/marketing/posts/kpis-customer-success-2026/`
- Archivos generados: como en el ejemplo de `marketing-content` arriba.
- Estructura del post: hook con dato sorprendente, contexto, las 7 KPIs con definición + cómo medir + ejemplo + anti-patrón, sección "lo que NO debería ser un KPI" (gancho contrarian), conclusión con plantilla descargable.

---

### `ad-copy` — Copy publicitario

Google/Meta/LinkedIn Ads con variantes A/B y respeto de límites por plataforma.

**Caso de uso:** campaña de remarketing.

**Prompt:**
> "Ad copies para campaña de remarketing en LinkedIn dirigida a quienes visitaron nuestra landing de demo pero no convirtieron. Objetivo: pedir demo. 3 variantes para A/B."

**Output esperado:**
- Ruta: `<proyecto>/marketing/ads/ad-copy-linkedin-remarketing-demo.md`
- 3 variantes con headline (límite 70 chars), description (límite 600), CTA:
  ```markdown
  ## Variante A — "Curiosidad"
  Headline: ¿Te quedaste con dudas?
  Description: La demo dura 15 min y la lleva un product specialist, no
  ventas. Sin presión, solo respuestas...
  CTA: Pedir demo

  ## Variante B — "Prueba social"
  Headline: 124 equipos de CS empezaron así
  Description: "Pedí la demo más como curiosidad. Salí con un caso
  de uso claro y un calendario." — Maria, Head of CS @ ACME
  CTA: Reservar demo

  ## Variante C — "Específico al cargo"
  Headline: Para heads of CS con poco tiempo
  Description: 15 minutos. Solo lo relevante para tu rol. Sin slides
  genéricos.
  CTA: Reservar 15 min
  ```

---

### `campaign-brief` — Brief de campaña

Objetivo, audiencia, canales, presupuesto, KPIs y riesgos.

**Caso de uso:** brief para campaña de lanzamiento.

**Prompt:**
> "Brief para campaña de lanzamiento de nuestra nueva feature de AI Insights. 4 semanas de duración, 35k€, target SaaS mid-market."

**Output esperado:**
- Ruta: `<proyecto>/marketing/campaigns/brief-launch-ai-insights.md`
- Secciones:
  ```markdown
  # Campaign Brief: AI Insights launch

  ## Objetivo
  Generar 300 demos cualificadas en 4 semanas. Target secundario: 50
  artículos/menciones en prensa SaaS.

  ## Audiencia
  Heads of analytics y CFOs de empresas SaaS 50-500 empleados con BI
  ya instalado (Looker, Tableau, Metabase).

  ## Mensaje principal
  "Encuentra el insight que tu dashboard no te enseña."

  ## Canales y mix
  | Canal | % presupuesto | Para qué |
  | LinkedIn ads | 40% | reach + demo signup |
  | Content + SEO | 25% | autoridad + organic |
  | PR / outreach | 20% | menciones + backlinks |
  | Email a base | 10% | reactivación |
  | Eventos | 5% | webinar lanzamiento |

  ## KPIs
  - 300 demos pedidas
  - 50 menciones / artículos
  - CAC < 1.500€

  ## Calendario
  S1: teaser + email base
  S2: webinar de lanzamiento
  S3-4: amplificación + remarketing

  ## Riesgos
  - Competencia X anunció algo similar en mayo
  - Equipo de demo saturado si superamos 80 demos/semana
  ```

---

### `editorial-calendar` — Calendario editorial de redes

Mensual o semanal, con pilares de contenido y mix.

**Caso de uso:** calendario mensual.

**Prompt:**
> "Calendario editorial de redes para julio. LinkedIn (4 posts/sem) e Instagram (3 posts/sem). Pilares: educación CS, casos de cliente, behind-the-scenes."

**Output esperado:**
- Ruta: `<proyecto>/marketing/social/editorial-calendar-julio-2026.md`
- Tabla mes a mes:
  ```markdown
  # Calendario editorial — Julio 2026

  ## Pilares y mix objetivo
  | Pilar | LinkedIn | Instagram |
  | Educación CS | 50% | 30% |
  | Casos de cliente | 30% | 30% |
  | Behind the scenes | 20% | 40% |

  ## Semana 1 (1-7 julio)
  | Día | Plataforma | Pilar | Tema |
  | Lu 1 | LinkedIn | Educación | "Las 3 métricas de churn que casi nadie usa bien" |
  | Lu 1 | Instagram | BTS | Foto de planning del trimestre |
  | Mi 3 | LinkedIn | Caso | Mini-thread del case study ACME |
  | Mi 3 | Instagram | Caso | Carrusel before/after de ACME |
  | Ju 4 | Instagram | Educación | Reel "1 KPI que estás midiendo mal" |
  | Vi 5 | LinkedIn | Educación | "Cómo NO hablar con un cliente en riesgo" |

  ## Semana 2 (8-14 julio)
  ...
  ```

---

### `email-campaign` — Email de marketing

Asunto (3 variantes), preheader, cuerpo y CTA.

**Caso de uso:** email de lanzamiento.

**Prompt:**
> "Email para nuestra base de leads anunciando AI Insights. Audiencia: 8000 contactos que estuvieron en demo en últimos 12 meses pero no compraron. Objetivo: pedir nueva demo."

**Output esperado:**
- Ruta: `<proyecto>/marketing/emails/email-launch-ai-insights.md`
- Asuntos (3 variantes A/B):
  ```markdown
  ## Asuntos
  A. "Lo que tu dashboard nunca te dijo"
  B. "Aún recuerdas la demo de hace [meses]?"
  C. "Tenemos algo nuevo y queremos enseñártelo (15 min)"

  ## Preheader (todas las variantes)
  "AI Insights ya está en beta para nuestros amigos cercanos"

  ## Cuerpo
  Hola [first_name],

  Cuando hablamos en [mes_demo], tu mayor preocupación era [pain_inferred].
  Nos has acompañado leyendo cosas nuestras desde entonces y queríamos
  contarte algo: esta semana hemos lanzado AI Insights.

  Es la respuesta a esa frase que oíamos en cada demo:
  "Mi dashboard me dice lo que le pido, pero no me dice lo que debería
  saber."

  AI Insights analiza tu data en background y te trae las 3 cosas que
  cambiarían tu trimestre — antes de que tú las preguntes.

  ## CTA
  Botón principal: "Ver demo de 15 min"
  Link secundario: "Leer el blog del lanzamiento"

  ## Firma
  [Sender first name]
  Co-founder @ [Empresa]
  ```

---

### `keyword-research` — Tabla priorizada de keywords

Volumen, dificultad, intención, página destino.

Ver ejemplo en agente `marketing-seo` arriba.

---

### `landing-page` — Estructura + copy de landing de conversión

Ver ejemplo en agente `marketing-web` arriba.

---

### `elementor-content` — Contenido Elementor (JSON `_elementor_data`) para WordPress

Genera la carpeta lista para publicar en WordPress con Elementor: el JSON canónico que va al postmeta `_elementor_data`, el HTML fallback, los metadatos (title, slug, meta description, `_elementor_template_type`), un README con cómo publicar (manual o vía MCP de WordPress conectado al IDE) y, cuando aplique, una subcarpeta `assets/` con los SVGs vectoriales generados (iconos custom, ilustración hero, dividers, blobs, badges, patrones) + sus PNGs @2x. Las fotos reales pendientes se dejan como placeholder externo (`placehold.co`) con brief visual. Cubre páginas, posts de blog, landings de campaña y bloques reutilizables. Solo widgets core de Elementor.

**Prompt:**
> "Necesito una página de servicio para 'Consultoría de datos' construida en Elementor. Hero a sangre con un blob abstracto verde-azulado de fondo, 3 beneficios con iconos custom (no Font Awesome), sección de testimonios con foto de cliente, FAQ y CTA final. Slug: `consultoria-de-datos`. Audiencia: directores financieros."

**Output esperado:**
- Ruta: `<proyecto>/marketing/posts/consultoria-de-datos/`
- Estructura:
  ```
  consultoria-de-datos/
  ├── _elementor_data.json    ← array de secciones para el postmeta
  ├── content.html            ← fallback HTML semántico
  ├── metadata.md             ← title, slug, meta description, _elementor_template_type=wp-page,
  │                             tabla "Assets generados" + tabla "Assets pendientes"
  ├── README.md               ← cómo publicar (manual o vía MCP WP) + cómo subir los assets
  └── assets/
      ├── hero-blob.svg + hero-blob.png       ← blob abstracto del hero
      ├── icon-data-strategy.svg + .png       ← iconos custom para los 3 beneficios
      ├── icon-cost-optimization.svg + .png
      └── icon-real-time-insights.svg + .png
  ```
- `_elementor_data.json` con la jerarquía `section → column → widget`, IDs únicos de 7-8 caracteres, widgets core (`heading`, `text-editor`, `image` con `url: "assets/icon-data-strategy.svg"`, `testimonial`, `accordion`, `button`).
- En la sección de testimonios, la foto del cliente queda como `https://placehold.co/200x200/0F172A/FFFFFF?text=Cliente` con brief en `metadata.md`.
- `metadata.md` con title SEO ≤60 chars, meta description 140-160 chars, `_elementor_template_type: wp-page`, `_elementor_edit_mode: builder`, inventario de los 4 assets generados y 1 pendiente.

---

### `marketing-plan` — Plan de marketing anual o trimestral

Ver ejemplo en agente `marketing-strategy` arriba.

---

### `platform-adapter` — Adaptación de contenido por red

Ver ejemplo en agente `marketing-social` arriba.

---

### `publish-checklist` — Checklist pre-publicación

SEO + UX + técnico antes de publicar en WordPress.

**Caso de uso:** validar post antes de pegarlo en CMS.

**Prompt:**
> "Aplica `publish-checklist` al post `como-elegir-crm-para-pymes`. Lo tengo listo en `<proyecto>/marketing/posts/`."

**Output esperado:**
- Ruta: `<proyecto>/marketing/posts/como-elegir-crm-para-pymes/publish-checklist.md`
- Checklist con resultado:
  ```markdown
  ## SEO
  - [x] Meta title 50-60 chars ✓ (54)
  - [x] Meta description 150-160 chars ✓ (158)
  - [x] Slug en kebab-case sin stop words ✓
  - [x] H1 único, contiene keyword principal ✓
  - [x] Keyword density 0.5%-2% ✓ (1.1%)
  - [ ] Internal links ≥ 3 ⚠️ solo 2 → añadir uno más
  - [x] Alt text en todas las imágenes ✓
  - [x] OG image 1200x630 ✓

  ## UX
  - [x] H2 cada 200-300 palabras ✓
  - [x] Párrafos < 4 líneas ✓
  - [x] Bullet lists cuando aplica ✓
  - [ ] CTA cada 3 H2 ⚠️ solo CTA final → añadir 1 intermedio

  ## Técnico
  - [x] Imágenes optimizadas < 200KB ✓
  - [x] Sin links rotos ✓
  - [x] Schema markup Article ✓

  ## Veredicto
  🟠 Aprobado tras 2 fixes menores (internal link + CTA intermedio)
  ```

---

### `seo-on-page` — Auditoría + versión optimizada

Auditoría completa + versión optimizada del contenido.

**Caso de uso:** optimizar post existente que no convierte.

**Prompt:**
> "El post `5-señales-cliente-en-riesgo` lleva 6 meses publicado, posiciona en página 2 para varias keywords. Auditalo y propón la versión optimizada."

**Output esperado:**
- Ruta: `<proyecto>/marketing/seo/seo-on-page-5-señales-cliente-en-riesgo.md`
- Auditoría (estado actual) + versión optimizada con cambios marcados:
  ```markdown
  ## Auditoría
  - Title actual: "5 señales de cliente en riesgo" (44 chars, débil)
  - Meta description: ausente
  - H1 igual al title (OK)
  - Keyword "señales cliente en riesgo" densidad 0.3% (baja)
  - Internal links: 1 (insuficiente)
  - Page experience: LCP 3.2s (mejorable)

  ## Versión optimizada
  - Title nuevo: "5 señales de cliente en riesgo (con cómo actuar)" (54 chars)
  - Meta description: "Las 5 señales que indican que un cliente B2B está en
    riesgo de churn, qué dicen los datos y la playbook para retenerlo."
  - Body: subida densidad a 1.2% con reescritura de 2 párrafos
  - Añadidos 4 internal links a: playbook de churn, post de NPS, post de
    QBR, landing producto
  - Sugerencia técnica: defer del JS de chat para mejorar LCP
  ```

---

### `linkedin-audit` — Análisis y optimización de un post de LinkedIn

Copy plain-text listo para pegar.

**Caso de uso:** mejorar un post antes de publicarlo.

**Prompt:**
> "Tengo este borrador de post de LinkedIn (pegado). Es para un Head of CS, quiero hook fuerte y CTA hacia nuestro newsletter. Audítalo y dame la versión final."

**Output esperado:**
- Ruta: `<proyecto>/marketing/social/linkedin-audit-<slug>.md`
- Auditoría del borrador:
  ```markdown
  ## Auditoría
  - Hook: el primer renglón habla de la solución, no del problema. ⚠️
  - Estructura: muros de texto. ⚠️
  - CTA: difuso, no específico. ⚠️
  - Hashtags: 0. ⚠️ (recomendado 3-5)
  - Tono: profesional pero distante.

  ## Versión optimizada (plain text para pegar)

  El 73% de los heads of CS detectan al cliente en riesgo demasiado tarde.

  No es por falta de datos. Es por mirar los wrong signals.

  Estas son las 3 señales que sí avisan:

  → Reducción del tiempo en producto -40% (vs su baseline)
  → Cambio de stakeholder principal sin re-onboarding
  → Tickets a soporte sobre "cómo hacer X" tras 6 meses de uso

  Si las miras de aquí a fin de semana, te llevarás dos sorpresas. Una
  buena (cliente que parecía OK), otra mala (cliente que dabas por sano).

  ¿Cuál de las 3 te ha pillado a ti más veces?

  ↓ En mi newsletter mando 1 frame de CS cada semana. Link en perfil.

  #CustomerSuccess #SaaS #B2B
  ```

---

### `brand-voice-guide` — Guía canónica de voz de marca

Atributos de tono, vocabulario do/don't, adaptación por canal.

**Caso de uso:** primera guía formal de tono.

**Prompt:**
> "Creamos guía canónica de voz de marca. Somos SaaS B2B serio pero queremos sonar humano, no corporativo. 3 atributos: experto, directo, cercano."

**Output esperado:**
- Ruta: `<proyecto>/marketing/strategy/brand-voice-guide.md`
- Contenido:
  ```markdown
  # Brand Voice Guide

  ## Atributos del tono

  ### 1. Experto
  Hablamos como gente que ha hecho el trabajo, no como gente que lo ha leído.
  Citamos números reales cuando los tenemos. Aceptamos los límites de
  nuestra perspectiva sin esconderlos.

  Ejemplo OK: "En los 47 clientes que hemos analizado, el churn cayó 23%
  cuando..."
  Ejemplo NO: "Nuestra solución revoluciona la industria"

  ### 2. Directo
  Vamos al punto. Frases cortas. Sin adornos ni rodeos. Si tenemos que
  decir algo incómodo, lo decimos en la primera línea, no en la quinta.

  Ejemplo OK: "Esto no funciona para empresas de menos de 20 personas."
  Ejemplo NO: "Aunque nuestra plataforma es versátil, en ocasiones..."

  ### 3. Cercano
  Hablamos de tú. Hacemos preguntas reales. Reconocemos que la otra
  persona tiene más contexto que nosotros sobre su negocio.

  Ejemplo OK: "¿Te ha pasado eso de cerrar el trimestre sin saber por qué?"
  Ejemplo NO: "Las organizaciones modernas requieren..."

  ## Vocabulario

  ### DO
  problema · resolver · funcionar · medir · decidir · probar · iterar

  ### DON'T
  revolucionar · disruptivo · paradigma · sinergias · ecosistema · solución
  integral · escalabilidad robusta · best-in-class

  ## Adaptación por canal
  - **Web (home, landings):** experto + directo dominan. Cercano en CTAs.
  - **Blog:** los 3 con equilibrio.
  - **LinkedIn:** cercano dominante, experto en data points.
  - **Emails:** cercano + directo. Experto solo cuando hay caso real.
  - **Docs producto:** experto + directo. Cercano fuera.
  ```

---

## Flujo end-to-end típico

Para un lanzamiento de producto, los agentes y skills se encadenan así:

```
1. marketing-strategy            → campaign-brief
2. marketing-strategy            → marketing-plan del trimestre del lanzamiento
3. marketing-content             → blog-post pilar
4. marketing-seo                 → keyword-research + seo-on-page del post
5. marketing-web                 → landing-page de la feature
6. marketing-content             → email-campaign al base de leads
7. marketing-social              → platform-adapter + editorial-calendar
8. marketing-content             → publish-checklist antes de subir el post
```
