# Vídeo del hero

## Archivo

- **Fuente:** Pixabay — "Children, Dog, Friends, Field, Animal" (ID 77640)
- **Licencia:** Pixabay Content License — uso comercial permitido, sin atribución obligatoria
- **Página:** https://pixabay.com/videos/children-dog-friends-field-animal-77640/
- **Original:** 1920×1080, 24 fps, 18 s, 11.8 MB
- **Entregado:** 1920×1080, H.264, sin audio, 4.7 MB, `+faststart`

## Proceso

Descargado del CDN de Pixabay como `_large.mp4`, recodificado con
`libopenh264` (el build de ffmpeg del entorno no trae `libx264`) y verificado:

- `moov` al inicio (faststart): el navegador empieza a mostrar sin descargar todo
- Decodifica sin errores
- Sirve rangos parciales (`206`)

## Por qué este clip

De 5 candidatos descargados, se eligió por métrica objetiva: **desviación
estándar de luminancia en el tercio central = 25**, la más baja del grupo, es
decir la zona más limpia para superponer texto. Brillo medio 159 (el más alto),
lo que favorece el texto blanco del hero.

Alternativas descartadas:

| Clip | Motivo |
|---|---|
| Border Collie (4727) | sujeto justo en el centro, tapa el texto |
| Shiba Inu 4K (205717) | sin espacio negativo, luz plana |
| Caniche 4K (115897) | zona central muy cargada (sd 78) |
| Cachorro 4K (71018) | solo 5 s, plano muy movido |

## Notas de integración

- `hero-poster.jpg` es el respaldo inmediato mientras el vídeo carga
- La foto original (`heroWalk`) sigue debajo como fallback si el mp4 falla
- `@media (prefers-reduced-data: reduce)` oculta el vídeo para no gastar datos
- El overlay necesita `z-index: 3` para quedar por encima del vídeo (z-index 2);
  con `auto` el degradado no se aplica y el texto pierde contraste
