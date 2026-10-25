# Revisión previa a producción — 24 de octubre de 2026

## Fallos corregidos

- El enlace de la página 404 a `/#beneficios` terminaba en contenido oculto por la experiencia interactiva. Ahora apunta al explorador visible `/#paseos`.
- Sin JavaScript, el menú móvil y el configurador opcional ofrecían controles inoperantes. Se ofrece navegación HTML alternativa y el configurador solo se muestra tras completar su inicialización. Los enlaces directos de WhatsApp siguen disponibles.
- Una pestaña abierta durante horas o durante el cambio de fecha podía conservar fechas u horas ya pasadas. La selección se revalida al abrir el calendario, al volver a la pestaña y al preparar la consulta; se actualizan también el calendario y el mensaje de WhatsApp.

## Verificación

- `npm run build`: aprobado.
- `npm run astro -- check`: sin errores ni advertencias.
- `npm run test:seo`: 4 pruebas aprobadas.
- `npm run test:production`: 3 pruebas del HTML generado (referencias ARIA e identificadores, enlaces y anclas, recursos locales y destinos WhatsApp) y 3 regresiones de calendario aprobadas.
- Navegador Chromium integrado: inicio a 320 px; `/paseos/` a 320, 768 y 1440 px; sin desbordamientos ni imágenes rotas en las mediciones. Alternativa sin JavaScript comprobada a 390 px con navegación disponible y configurador oculto.
- Configurador: selección grupal, sincronización del explorador, calendario con domingos deshabilitados, horas entre 07:00 y 18:00 y mensaje de consulta actualizado. No se envió ningún mensaje.

## Límites

La revisión de navegador se realizó contra el servidor de desarrollo. El servidor de vista previa del build anunció disponibilidad pero no se mantuvo accesible en el navegador; por tanto no se confirma una prueba interactiva sobre el build servido. El HTML y los recursos compilados sí pasan las comprobaciones automáticas. No se verificaron Safari/iOS, Android físicos ni el comportamiento de los encabezados HTTP en el alojamiento final. No se desplegó a producción.
