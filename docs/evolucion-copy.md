# Evolución del contenido de Happy Paws

Rama: `codex/evolucion-copy-confianza`.

La portada prioriza la tranquilidad de la familia y compromisos concretos de cuidado. El recorrido presenta el encuentro previo, modalidades y cotización, ejemplo del reporte, cuidado cotidiano, tres pasos para empezar y preguntas frecuentes. La consulta de WhatsApp funciona sin elegir modalidad ni fecha. El planificador es opcional y aclara que no confirma una reserva.

## Contenido real pendiente

No hay en el repositorio una identidad verificada del paseador, su retrato, formación, testimonios autorizados ni importes de tarifas. No se inventan ni se presentan imágenes existentes como retratos del equipo.

- Completar `walkerProfiles` en `src/config/trust.ts` con nombre, biografía, foto local autorizada y experiencia verificable. La portada mostrará los perfiles junto al primer encuentro.
- Completar `testimonials` en el mismo archivo con citas textuales y atribución autorizadas de familias de Foresta. Se mostrarán antes de las preguntas frecuentes. Sin contenido, no se genera una sección vacía.
- Publicar precios exactos cuando se confirme la tarifa por modalidad, frecuencia e inclusiones. Mientras tanto, portada, página de paseos y FAQ explican las variables de cotización.

El límite grupal se expresa como “hasta 4 perros por paseador”, tomando el extremo superior del rango existente de 3–4. Confirmar este límite operativo antes de publicar.

## Vista local

Iniciar: `npm run dev -- --background`.
Estado: `npx astro dev status`.
Logs: `npx astro dev logs`.
Detener: `npx astro dev stop`.
