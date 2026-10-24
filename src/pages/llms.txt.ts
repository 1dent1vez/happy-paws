import type { APIRoute } from 'astro';
import { siteConfig, getWhatsAppUrl } from '../config/site';

export const GET: APIRoute = () => {
  const site = siteConfig.url;
  const text = `# Happy Paws Metepec

> Paseos de perros exclusivamente dentro de Foresta Dream Lagoons, Metepec, Estado de México.

## Información del servicio
- Marca: ${siteConfig.name}.
- Zona de servicio: ${siteConfig.coverage.community}, ${siteConfig.coverage.city}, ${siteConfig.coverage.state}, México.
- No se anuncia cobertura fuera de Foresta ni un local abierto al público.
- Individual: atención exclusiva y recorrido adaptado al perro.
- Grupal: hasta 4 perros por paseador, con compatibilidad revisada previamente.
- Duración: de 45 a 60 minutos, adaptada a sus necesidades.
- Recogida y regreso en la puerta del residente.
- Reporte por WhatsApp al terminar; fotografía con autorización.
- Horario: ${siteConfig.schedule.days}, ${siteConfig.schedule.hours}, con cita previa.
- Precio: se cotiza según modalidad y frecuencia. No hay una tarifa publicada.
- Es un servicio de paseo; no ofrece diagnóstico veterinario ni modificación conductual clínica.

## Fuentes oficiales
- [Portada y cobertura local](${site}/): propuesta y contacto.
- [Paseos individuales y grupales](${site}/paseos/): modalidades, requisitos, horarios y cuidado.
- [Preguntas frecuentes](${site}/#faq): precios, funcionamiento y condiciones.
- [Términos del servicio](${site}/terminos-del-servicio/).
- [Aviso de privacidad](${site}/aviso-de-privacidad/).

## Contacto
- WhatsApp: ${siteConfig.whatsapp.phoneFormatted}.
- [Consultar por WhatsApp](${getWhatsAppUrl('general')}).
- Instagram: ${siteConfig.instagram.url}.

## Rastreo
- [robots.txt](${site}/robots.txt).
- [Sitemap](${site}/sitemap-index.xml).

Este documento resume el contenido público. No garantiza indexación ni aparición en respuestas de IA.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
