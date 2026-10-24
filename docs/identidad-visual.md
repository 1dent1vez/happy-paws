# Happy Paws: tipografía y paleta

## Tipografías

| Rol | Familia | Uso |
| --- | --- | --- |
| Titulares | Fraunces, peso 600 | Hero y encabezados de sección. Serif expresiva y cálida. |
| Lectura | Manrope, pesos 400–500 | Párrafos, descripciones e información práctica. |
| Interfaz | Manrope, pesos 600–700 | Navegación, botones, etiquetas y preguntas frecuentes. |

Las dos familias variables se sirven localmente, con subconjuntos latino y latino extendido para español. Los archivos y licencias SIL OFL están en `public/fonts/`. Para regenerarlos: `python3 scripts/fetch-brand-fonts.py`.

## Uso contenido de la paleta

La paleta oficial se conserva como referencia, sin obligación de mostrar todos sus colores:
crema `#FCF4F0`, rosa `#FFD5FB`, azul `#C0D6FF`, naranja `#F86C2F`, vino `#6D0101`.

La interfaz usa blanco y neutros cálidos, texto carbón y divisores discretos. La fotografía del hero conserva su color natural, con una sombra neutra para facilitar la lectura. El naranja se reserva para la acción principal del hero; el vino se limita a acciones pequeñas y enlaces. El cierre usa un crema suave y el footer vuelve al carbón. Rosa y azul no se usan como fondos de secciones.

El texto pequeño sobre naranja usa vino oscuro `#500101` para contraste. El ejemplo del reporte mantiene los colores propios de WhatsApp.

## CTA flotante

Se oculta mientras el hero está visible y aparece cuando su borde inferior alcanza la base del encabezado fijo. Al volver arriba, se oculta otra vez. Las páginas sin hero conservan el botón visible. El botón propio del hero permanece disponible.

Se sincronizan visibilidad, `inert` y `aria-hidden`; el CTA oculto no recibe foco. Se contemplan el scroll restaurado al volver a una página y el cambio de tamaño de ventana.
