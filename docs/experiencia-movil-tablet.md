# Explorador de paseos para móvil y tablet

La portada ofrece un recorrido interactivo hasta 1100 px. Se explora en tres momentos (antes, durante y después), con selección independiente entre individual y grupal. Cambiar modalidad actualiza la escena del paseo, el texto, la explicación de compatibilidad y la consulta de WhatsApp. El ejemplo de reporte es ilustrativo y se identifica como tal.

La fotografía cambia con un fundido breve. El reporte aparece con un movimiento de entrada limitado a ese momento. No hay autoplay de escenas, desplazamiento forzado ni gestos necesarios: todos los controles funcionan por toque y teclado. Un deslizador nativo de tres posiciones (Antes, Durante y Después) permite arrastrar o tocar la pista. Flechas izquierda/derecha, Inicio y Fin ajustan el valor, que se anuncia con `aria-valuetext`. Cada cambio sincroniza imagen, texto, progreso y panel visible. El deslizador sustituye a las pestañas y al botón de avance. La preferencia de movimiento reducido elimina animaciones de la escena.

La información ampliada sigue en `/paseos/`. En escritorio se conserva el contenido editorial. Sin JavaScript se muestra el recorrido clásico completo, también en móvil. La versión compacta se activa únicamente tras inicializar los controles.

Comprobaciones: tamaños emulados de móvil y tablet, deslizador y radio buttons, mensaje de WhatsApp y navegación por teclado. La emulación no sustituye pruebas físicas en iOS/Android.

Se verificó el arrastre con puntero de extremo a extremo, el toque en el centro de la pista y la navegación por teclado. No se simuló un dispositivo físico con Safari/iOS.
