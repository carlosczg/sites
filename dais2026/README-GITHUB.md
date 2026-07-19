# DAIS 2026 Interactive Stack — GitHub Pages

Este paquete está listo para publicarse como un sitio estático en GitHub Pages.

## Publicación rápida

1. Crea un repositorio nuevo en GitHub o abre el repositorio de tu GitHub Pages.
2. Copia **el contenido de esta carpeta** en la raíz del repositorio. El archivo `index.html` debe quedar en la raíz, no dentro de otra carpeta.
3. Sube los cambios a la rama `main`.
4. En GitHub abre **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Selecciona la rama `main`, la carpeta `/(root)` y guarda.
7. GitHub mostrará la URL pública cuando termine el despliegue.

Si el repositorio se llama `dais-2026`, la dirección habitual será:

`https://TU-USUARIO.github.io/dais-2026/`

## Archivos incluidos

- `index.html`: página principal.
- `404.html`: fallback compatible con GitHub Pages.
- `content.js`: catálogo, textos y traducciones.
- `router.js`: navegación por hash, compatible con subrutas de GitHub Pages.
- `ui.js`: portada, fichas y keynotes.
- `simulations.js`: simulaciones interactivas.
- `styles.css` y `landing.css`: estilos generales y del stack.
- `favicon.svg`: favicon y marca de la cabecera.
- `.nojekyll`: evita que Jekyll altere el paquete estático.

## Dependencias externas

El sitio no necesita backend ni proceso de compilación. Requiere conexión a internet para cargar Google Fonts, Chart.js, videos de YouTube y enlaces externos de Databricks.

## Actualizaciones

Después de editar cualquier archivo, vuelve a subirlo a `main`. GitHub Pages actualizará el sitio automáticamente.

Recurso educativo independiente; no es un producto oficial de Databricks.
