# Vídeo del hero

## Archivo

- **Fuente:** Pixabay — "Dog, Black, Labrador, Roaming, Stroll" (ID 30518)
- **Licencia:** Pixabay Content License — uso comercial permitido, sin atribución obligatoria
- **Página:** https://pixabay.com/videos/dog-black-labrador-roaming-stroll-30518/
- **Original:** 1920×1080, 14 s, 10.7 MB
- **Entregado:** 1920×1080, H.264, sin audio, **4.2 MB**, `+faststart`

## Contenido

Un perro negro corre y explora solo por un campo abierto al atardecer, con luz
dorada baja y sombras alargadas. **Sin personas en ningún fotograma**, que es el
requisito por el que se descartó el clip anterior (labrador con dos niños).

Verificado en 5 fotogramas (t = 1, 4, 7, 10, 13 s): solo el perro, sin figuras
humanas.

## Proceso

Descargado del CDN de Pixabay como `_large.mp4` y recodificado con
`libopenh264` (el build de ffmpeg del entorno no trae `libx264`). Comprobado:

- `moov` al inicio (faststart): reproduce sin descargar el archivo completo
- Decodifica sin errores
- Sirve rangos parciales (`206`)

## Por qué este clip

De 5 candidatos sin personas, elegido por métrica objetiva: **desviación
estándar de luminancia en el tercio central = 23.1**, la más baja del grupo,
o sea la zona más limpia para superponer el texto del hero.

| Clip | sd central | Motivo del descarte |
|---|---|---|
| **Labrador negro (elegido)** | **23.1** | zona central limpia, luz dorada |
| Border Collie 4K hacia cámara | 61.6 | el perro ocupa el centro y tapa el texto |
| Jack Russell en su cama | 68.7 | interior, no transmite "paseo" |
| Perro corriendo (5 s) | 78.8 | muy corto y plano lavado |
| Pointer en la nieve | 82.7 | escena invernal, no encaja con el servicio |

## Historial

| Fecha | Clip | Motivo del cambio |
|---|---|---|
| — | Children, Dog, Friends, Field (77640) | reemplazado: salían niños |
| — | Dog, Black, Labrador, Roaming (30518) | actual, solo el perro |

## Notas de integración

- `hero-poster.jpg` es el respaldo inmediato mientras el vídeo carga
- La foto original (`heroWalk`) sigue debajo como fallback si el mp4 falla
- `@media (prefers-reduced-data: reduce)` oculta el vídeo para no gastar datos
- El overlay necesita `z-index: 3` para quedar por encima del vídeo (z-index 2);
  con `auto` el degradado no se aplica y el texto pierde contraste

## Limitación de la verificación

El navegador headless de este entorno no decodifica vídeo (`readyState` se
queda en 0 con eventos `abort`/`stalled`), aunque el MP4 es válido y decodifica
bien con ffmpeg. **La reproducción real conviene confirmarla en un móvil.**
