# Adaptación responsive con Impeccable

Impeccable instalada desde pbakaus/impeccable en ~/.codex/skills/impeccable.

Se conservan Fraunces, Manrope, fotografía y paleta oficial. La portada móvil reduce la altura de imagen y ajusta título y espacios para acercar la consulta principal. El encabezado conserva el logo a 320 px; Instagram sigue disponible en el menú móvil. El menú incorpora Conócenos y admite desplazamiento en pantallas bajas.

El explorador conserva su deslizador y añade botones accesibles para los tres momentos, sincronizados con panel, fotografía, estado y valor del control. En móvil, los controles preceden a la imagen. En tablet se mantiene la composición de dos columnas. Se recupera Conócenos, que antes quedaba oculto junto con el contenido alternativo, y se incorpora una foto a esa sección.

Validación: npm run build; npm run astro -- check (0 errores, 0 advertencias); npm run test:seo (4 pruebas). Revisión en navegador integrado Chromium con marcos de 320, 390, 768 y 1440 px, incluidos navegación móvil, selección grupal, reporte, teclado y arrastre completo del deslizador. Sin desbordamiento del documento en los anchos medidos de 320, 768 y 1440 px. También se revisó /paseos/ en tablet. No se probaron dispositivos físicos, Safari ni gestos táctiles sintetizados. Los marcos temporales de prueba se eliminaron.

## Nueva dirección móvil

A petición del usuario, se reemplaza la composición móvil por una portada editorial: título grande, retrato asimétrico y frase superpuesta. El explorador usa fotografía, selección subrayada de momentos y texto sobre blanco; el cierre vuelve a crema. Todos estos estilos se limitan a un máximo de 699 px. Tablet y escritorio conservan su composición. Revisado visualmente a 390 y 768 px y comprobada la selección del reporte en el navegador.

## Estilo editorial en todos los tamaños

El usuario aprobó la dirección móvil y solicitó extenderla a tablet y escritorio. La portada usa ahora el retrato con frase superpuesta en todas las pantallas: secuencia vertical en móvil y dos columnas desde 700 px. Se elimina el video anterior de la portada. El explorador interactivo se habilita también en escritorio y conserva el contenido clásico como alternativa sin JavaScript. Los fondos blancos, botones de esquinas suaves, selección subrayada y cierre crema unifican la experiencia.

Validación final: build satisfactorio, Astro check sin errores ni advertencias y cuatro pruebas SEO aprobadas. Revisión visual de la portada a 768 y 1440 px. Se retiró la página temporal de revisión.

## Vista /paseos/

Se rediseña la página de servicios con la dirección editorial aprobada: portada con retrato y anotación superpuesta, modalidades en secciones con fotografía y detalles nativos desplegables, proceso en dos columnas, requisitos sin tarjetas elevadas y cierre crema. En móvil, el orden pasa a título, fotografía, consulta y descripción, con modalidades apiladas. Se conserva el contenido de servicio y los enlaces de consulta.

Validación: build aprobado, Astro check sin errores ni advertencias y cuatro pruebas SEO correctas. Revisión visual de portada a 390, 768 y 1440 px, comparación en escritorio y apertura del detalle individual. Página temporal de revisión retirada.
