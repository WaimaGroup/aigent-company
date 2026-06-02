# Marketing — Casos de uso

> Ejemplos prácticos de cómo invocar cada agente y skill del departamento de Marketing.
> Para visión general del dept, ver [`.aigent/README.md`](../../README.md) o el [`marketing-orchestrator.md`](./marketing-orchestrator.md).

---

## Cómo se invoca

1. **Vía orquestador** (recomendado): hablar al `marketing-orchestrator`. Analiza la petición y delega al especialista correcto. **No necesitas saber qué agente o skill usar.**
2. **Directo a agente**: cuando ya sabes a quién (ej. copy → `marketing-creative`).
3. **Skill directa**: para tareas concretas (ej. "genérame un calendario editorial de junio").

> **Default de archivo único:** por defecto cada entregable es **un solo `.md`**. Pide explícitamente `.html`, fragmento para CMS o maquetación Elementor si los necesitas.

> **¿Lo quieres en Word o Excel?** Si prefieres el entregable como documento de Word o como hoja de Excel en vez de `.md`, solo pídelo en lenguaje normal (p. ej. «el plan de Q3 en Word», «el calendario editorial en Excel»): el sistema genera el `.docx`/`.xlsx` listo para abrir.

---

## El equipo — 3 especialistas

| Agente | Cubre | Skills propias |
|---|---|---|
| `marketing-creative` | Copy (blog, email, anuncios, prensa) y redes sociales | `marketing-copy`, `marketing-social`, `marketing-brand-voice-guide` + `shared-case-study` |
| `marketing-planning` | Estrategia, planes, campañas, SEO y analytics | `marketing-strategy`, `marketing-seo` + `shared-competitive-analysis`, `shared-stakeholder-map`, `shared-okr-set`, `shared-kpi-dashboard` |
| `marketing-web` | Web, landings, WordPress/Elementor, CRO | `marketing-landing-page`, `marketing-elementor-content`, `marketing-publish-checklist` |

---

## `marketing-creative` — Creative

### Caso: post de blog SEO
> "Post de blog sobre 'cómo elegir CRM para PYMEs', para CEOs de empresas de 10-50 empleados, tono profesional pero accesible. Keyword: 'crm para pyme'. ~1500 palabras."

→ skill `marketing-copy` formato `blog` → `posts/como-elegir-crm-para-pyme/como-elegir-crm-para-pyme.md` (frontmatter SEO + cuerpo + prompts `[IMG:]`).

### Caso: email de lanzamiento
> "Email a 8000 leads que estuvieron en demo y no compraron, anunciando AI Insights. Objetivo: pedir nueva demo."

→ skill `marketing-copy` formato `email` → `emails/email-launch-ai-insights.md` (3 asuntos A/B + preheader + cuerpo + CTA).

### Caso: anuncios A/B
> "3 variantes de anuncio de remarketing en LinkedIn para quienes visitaron la landing de demo y no convirtieron."

→ skill `marketing-copy` formato `anuncio` → `ads/ad-copy-linkedin-remarketing-demo.md` (3 variantes respetando límites de LinkedIn).

### Caso: adaptar un contenido a redes
> "Adapta este case study a LinkedIn, Instagram, X y TikTok. Tono profesional pero humano."

→ skill `marketing-social` modo `adaptar` → `social/social-case-study-acme.md`.

### Caso: calendario editorial
> "Calendario editorial de julio. LinkedIn (4/sem) e Instagram (3/sem). Pilares: educación CS, casos de cliente, behind-the-scenes."

→ skill `marketing-social` modo `calendario` → `social/editorial-calendar-julio-2026.md`.

### Caso: auditar un post de LinkedIn antes de publicar
> "Audita este borrador de post de LinkedIn de nuestra página de empresa; objetivo tráfico al newsletter."

→ skill `marketing-social` modo `linkedin-audit` → añade `## MÉTRICAS OBJETIVO` y `## COPY PARA LINKEDIN` (plain-text) al `.md` del post.

### Caso: guía de voz de marca
> "Guía canónica de voz: SaaS B2B serio pero humano. 3 atributos: experto, directo, cercano."

→ skill `marketing-brand-voice-guide` → `strategy/brand-voice-guide.md`.

---

## `marketing-planning` — Planning

### Caso: plan de marketing trimestral
> "Plan Q3 2026 de SaaS B2B. Objetivo: +30% MQLs vs Q2. Presupuesto 80k€. Canales: SEO, LinkedIn ads, content, eventos."

→ skill `marketing-strategy` modo `plan` → `strategy/marketing-plan-q3-2026.md`.

### Caso: brief de campaña
> "Brief para el lanzamiento de la feature AI Insights. 4 semanas, 35k€, target SaaS mid-market."

→ skill `marketing-strategy` modo `brief` → `strategy/brief-launch-ai-insights.md`.

### Caso: keyword research
> "Keyword research para el pillar de 'gestión de proyectos para agencias', priorizando volumen + intención comercial."

→ skill `marketing-seo` modo `research` → `seo/keyword-research-gestion-proyectos-agencias.md`.

### Caso: optimización on-page
> "El post '5-señales-cliente-en-riesgo' posiciona en página 2. Audítalo y dame la versión optimizada."

→ skill `marketing-seo` modo `on-page` → `seo/seo-on-page-5-senales-cliente-en-riesgo.md`.

---

## `marketing-web` — Web & WordPress

### Caso: landing de conversión
> "Landing para la feature 'AI Insights'. Objetivo: pedir demo. Audiencia: heads of analytics de empresas medianas."

→ skill `marketing-landing-page` → `posts/landing-ai-insights/landing-ai-insights.md` (copy en plano). Si se quiere montar en Elementor, encadenar `marketing-elementor-content` modo `landing`.

### Caso: página de servicio en Elementor
> "Página de servicio 'Consultoría de datos' en Elementor, con hero, 3 beneficios con iconos custom, testimonios, FAQ y CTA. Slug: `consultoria-de-datos`."

→ skill `marketing-elementor-content` modo `page` → carpeta con `_elementor_data.json` + `content.html` + `metadata.md` + `README.md` + `assets/` (excepción multi-archivo).

### Caso: checklist pre-publicación
> "Aplica el checklist de publicación al post 'como-elegir-crm-para-pyme'."

→ skill `marketing-publish-checklist` → `posts/como-elegir-crm-para-pyme/publish-checklist.md` (veredicto 🟢/🟠/🔴).

---

## Flujo end-to-end típico (lanzamiento de producto)

```
1. marketing-planning   → marketing-strategy (brief + plan del trimestre)
2. marketing-creative   → marketing-copy (post pilar + email) + marketing-social (redes)
3. marketing-planning   → marketing-seo (keyword research + on-page del post)
4. marketing-web        → marketing-landing-page / marketing-elementor-content (landing)
5. marketing-web        → marketing-publish-checklist (antes de publicar)
```

El orquestador presenta este plan y lo coordina; el usuario solo describe el objetivo.
