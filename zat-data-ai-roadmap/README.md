# ZAT · Mapa de Servicios Data & AI

Versión estática y portable del mapa interactivo de servicios ZAT. No requiere base de datos ni funciones de servidor.

## Publicación directa

El archivo `zat-data-ai-roadmap-upload.zip` contiene la versión ya compilada. Descomprímelo y carga **el contenido de la carpeta**, incluyendo `index.html`, los recursos gráficos y la carpeta `assets`, en la raíz pública del hosting.

Es compatible con hosting estático como Netlify, Cloudflare Pages, Amazon S3, Azure Static Web Apps, GitHub Pages o un servidor tradicional con cPanel.

## Editar y volver a compilar

Requisitos: Node.js 22 o superior.

```bash
npm install
npm run dev
```

Para producir una nueva versión:

```bash
npm run build
```

Los archivos publicables quedarán en `dist/`.

## Incorporarlo mediante iframe

Una vez publicado, puede insertarse en otra web con:

```html
<iframe
  src="https://URL-DE-TU-SITIO/"
  title="Mapa de servicios Data & AI de ZAT"
  loading="lazy"
  style="width:100%; height:950px; border:0; border-radius:16px;"
></iframe>
```

La interactividad, los paneles de detalle, los enlaces de LinkedIn y el modo oscuro funcionan en la versión estática.
