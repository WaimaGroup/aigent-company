---
name: "marketing-platform-adapter"
user-invocable: true
description: >
  Skill for adapting a single piece of content into optimized versions for each social media platform.
---

# Skill: Adaptador de Contenido por Plataforma

**Entregable:** versiones del mismo contenido adaptadas a cada red social seleccionada

---

## Cuándo usar esta skill

Cuando el usuario tenga un contenido base (idea, artículo, noticia, lanzamiento) y quiera adaptarlo a varias redes sociales sin tener que reescribir todo desde cero para cada una. Esta skill hace el trabajo de transformación respetando el lenguaje, formato y cultura de cada plataforma.

---

## Información a recopilar

| Campo | Pregunta |
|---|---|
| Contenido base | ¿Cuál es el contenido, idea o mensaje original? |
| Plataformas destino | ¿A qué redes hay que adaptar? |
| Objetivo del post | ¿Alcance, engagement, tráfico, conversión? |
| Tono de marca | ¿Cómo suena la marca en redes? |
| Enlace o CTA | ¿Hay URL o acción concreta que incluir? |

---

## Guía de adaptación por plataforma

### LinkedIn
- **Formato:** texto largo con saltos de línea frecuentes
- **Longitud:** 800-1500 caracteres (mostrar "ver más" a partir de ~210 chars)
- **Gancho:** primera línea debe funcionar sola como tuit
- **Estructura:** gancho → desarrollo con valor → reflexión o pregunta al final
- **Hashtags:** 3-5 al final, relacionados con el sector
- **CTA:** invitar a comentar, compartir experiencia o visitar un enlace
- **Tono:** profesional pero personal; primera persona; opinar, no solo informar

### Instagram (feed)
- **Formato:** caption + imagen/carrusel/Reel
- **Longitud:** gancho en los primeros 125 chars (se corta con "más"); total 150-300 words
- **Gancho:** pregunta, dato sorprendente o afirmación polémica
- **Estructura:** gancho → valor → CTA
- **Hashtags:** 8-15 en el primer comentario o al final del caption
- **CTA:** "guarda este post", "etiqueta a alguien", "link en bio"

### Instagram Stories
- **Formato:** visual efímero, muy espontáneo
- **Texto:** mínimo, que apoye la imagen; máx. 2-3 líneas
- **Stickers:** encuesta, pregunta, cuenta regresiva, deslizar para enlace
- **Tono:** el más informal y cercano de todos los formatos

### Twitter / X
- **Formato:** 280 chars o hilo
- **Hilo:** primer tweet = gancho autosuficiente + "🧵" o "Hilo:"
- **Tono:** directo, conciso, con opinión; los matices van en el hilo
- **No usar:** párrafos, exceso de hashtags (máx. 1-2), lenguaje corporativo
- **CTA:** retweet, responder, visitar enlace

### Facebook
- **Formato:** texto + imagen/vídeo
- **Longitud:** 40-80 palabras para posts con imagen; hasta 300 para reflexiones
- **Tono:** cercano, familiar, enfocado a comunidad
- **CTA:** compartir con alguien, comentar opinión

### TikTok
- **Formato:** texto de acompañamiento del vídeo (caption corto)
- **Longitud:** 150 chars máx.; el mensaje real va en el vídeo
- **Tono:** desenfadado, autenticidad por encima de producción
- **Hashtags:** 3-5 relevantes + trending si aplica

---

## Proceso

1. Leer y entender el contenido base
2. Identificar el mensaje central (la idea que debe sobrevivir en todas las versiones)
3. Adaptar plataforma a plataforma respetando el carácter de cada una
4. Entregar en formato agrupado:

```markdown
## ADAPTACIONES — [Tema del contenido]

### LinkedIn
[texto completo]
Hashtags: #tag1 #tag2 #tag3

---

### Instagram (feed)
[texto completo]
Hashtags (primer comentario): #tag1 #tag2 ... #tag15

---

### Instagram Stories
[descripción del visual + texto de apoyo + sticker sugerido]

---

### Twitter / X
Tweet: [texto ≤280 chars]
— Si hilo —
1/ [tweet 1]
2/ [tweet 2]
...

---

### Facebook
[texto]

---

### TikTok
Caption: [texto corto]
Hashtags: #tag1 #tag2 #tag3
Idea de vídeo: [concepto]
```

5. Indicar qué formatos visuales necesita cada versión (imagen estática, carrusel, vídeo corto, etc.)

---

## Restricciones

- No publicar el mismo texto idéntico en plataformas distintas: cada red tiene su propio lenguaje, formato y cultura.
- No exceder los límites de caracteres recomendados aunque la plataforma permita más; lo que se ve sin "ver más" es lo que se lee.
- Adaptar el CTA al canal: lo que funciona en LinkedIn (comentario, conexión) no funciona en TikTok (vídeo, follow).
- Mantener el mensaje central intacto en todas las versiones; la adaptación es de tono y formato, no de contenido.
- Aplican las reglas de output de `_shared/output-rules.md`.
