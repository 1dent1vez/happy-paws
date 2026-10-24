# Revisión de bugs y experiencia de uso

## Correcciones

- **Hora inválida al cambiar de fecha.** Reproducción: elegir el 26/10/2026 a las 07:00 y cambiar al 24/10/2026 cuando esa hora ya pasó. Antes el mensaje conservaba las 07:00; ahora se borra la hora al cambiar de día y el mensaje indica «Por definir».
- **Foco perdido al regenerar el calendario y las horas.** Se devuelve al control seleccionado después de reconstruir la lista. Los días seleccionados exponen su estado y el día actual se identifica con `aria-current`.
- **Menú móvil.** La etiqueta cambia entre abrir/cerrar; al elegir una sección el foco pasa a ese destino. Escape, clic exterior y cambio a escritorio cierran el menú.
- **CTA flotante.** Se oculta cuando ya hay una acción de consulta visible, durante el uso del planificador y con el menú abierto. El footer móvil reserva espacio para que el control no tape los enlaces finales.
- **Selectores con cierre explícito.** Cada panel tiene botón de cierre. En móvil los paneles tienen altura limitada y desplazamiento interno; al abrirse se llevan a una zona visible.
- **Modalidades confusas y selecciones independientes.** Los controles indican «Individual» y «Grupal · hasta 4». Elegir una modalidad muestra inmediatamente su explicación. Explorador y planificador sincronizan la selección en ambos sentidos, incluyendo el mensaje de WhatsApp.
- **Exploración móvil.** Las pestañas se sitúan antes de la imagen. Los botones dicen «Ver el paseo» y «Ver el reporte». El botón de avance conserva el foco; las flechas, Inicio y Fin permiten recorrer las pestañas.
- **Dudas al elegir.** Se ofrece una consulta directa de orientación por WhatsApp, sin exigir modalidad.
- **Reporte recortado al crecer el texto.** El área de fotografía puede crecer con el contenido del reporte, en lugar de imponer una altura fija que lo recorte.

## Validación realizada

- Reproducción del fallo de fecha antes de corregirlo y comprobación posterior del mensaje generado.
- Elección grupal desde el explorador e individual desde el planificador: sincronización de textos y enlace de consulta.
- Apertura/cierre del calendario, navegación del menú, foco al destino y cierre al pasar a escritorio.
- Navegación por teclado de las pestañas.
- Anchos emulados: 320, 390, 820, 1024 y 1440 px. Sin desbordamiento horizontal, IDs duplicados ni referencias `aria-controls` sin destino.
- `astro check`: sin errores ni advertencias. Build estático correcto.

No se enviaron mensajes de WhatsApp. Las pruebas de layout son con tamaños emulados; no equivalen a pruebas físicas en Safari/iOS o Android ni a una auditoría con lector de pantalla real.
