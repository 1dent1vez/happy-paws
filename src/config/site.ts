/**
 * Configuración Centralizada de Happy Paws
 * Zona exclusiva: Foresta Dream Lagoons (Metepec)
 * Canal de conversión: WhatsApp
 */

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  coverage: {
    title: string;
    description: string;
    note: string;
    community: string;
  };
  schedule: {
    days: string;
    hours: string;
    note: string;
  };
  whatsapp: {
    phoneRaw: string;
    phoneFormatted: string;
    isConfigured: boolean;
    messages: {
      main: string;
      header: string;
      floating: string;
      individual: string;
      group: string;
      process: string;
      faq: string;
      general: string;
      paseosPage: string;
    };
  };
}

const envPhone = typeof process !== 'undefined' ? process.env?.PUBLIC_WHATSAPP_PHONE : undefined;
const envPhoneDisplay = typeof process !== 'undefined' ? process.env?.PUBLIC_WHATSAPP_PHONE_DISPLAY : undefined;

const rawPhone = envPhone || '525500000000';
const isConfigured = Boolean(envPhone && envPhone !== '525500000000');

export const siteConfig: SiteConfig = {
  name: 'Happy Paws',
  legalName: 'Happy Paws Paseos Residenciales',
  tagline: 'Paseos caninos dedicados en Foresta Dream Lagoons',
  description: 'Servicio de paseo y bienestar canino exclusivo para residentes de Foresta Dream Lagoons. Cuidado atento, exploración a su ritmo y reporte directo en tu teléfono.',
  url: 'https://happypaws.mx',
  locale: 'es-MX',
  coverage: {
    title: 'Zona Exclusiva',
    description: 'Servicio disponible exclusivamente para residentes de Foresta Dream Lagoons.',
    note: 'Paseos seguros y tranquilos dentro del fraccionamiento.',
    community: 'Foresta Dream Lagoons'
  },
  schedule: {
    days: 'Lunes a Sábado',
    hours: '7:00 a 19:00 hrs',
    note: 'Horarios programados con previa cita.'
  },
  whatsapp: {
    phoneRaw: rawPhone,
    phoneFormatted: envPhoneDisplay || (isConfigured ? rawPhone : '+52 55 0000 0000 (Pendiente de configurar)'),
    isConfigured,
    messages: {
      main: 'Hola, quiero conocer los paseos de Happy Paws en Foresta Dream Lagoons y consultar disponibilidad.',
      header: 'Hola, me interesa solicitar informes sobre los paseos de Happy Paws en Foresta.',
      floating: 'Hola, quiero consultar la disponibilidad para pasear a mi perro en Foresta Dream Lagoons.',
      individual: 'Hola, me interesa el paseo individual para mi perro en Foresta. Me comparten tarifas y funcionamiento?',
      group: 'Hola, quiero información sobre los paseos grupales y cómo evalúan la compatibilidad entre perros en Foresta.',
      process: 'Hola, me gustaría agendar la charla de conocimiento inicial para mi perro en Foresta.',
      faq: 'Hola, tengo una pregunta sobre el servicio de paseos en Foresta Dream Lagoons.',
      general: 'Hola, quiero platicar con el equipo de Happy Paws sobre sus paseos en Foresta.',
      paseosPage: 'Hola, estuve revisando los detalles de sus paseos y quisiera agendar una evaluación para mi perro en Foresta.'
    }
  }
};

/**
 * Genera el enlace oficial de WhatsApp sin caracteres especiales ni emojis
 */
export function getWhatsAppUrl(
  context: keyof typeof siteConfig.whatsapp.messages = 'main',
  customMessage?: string
): string {
  const cleanPhone = siteConfig.whatsapp.phoneRaw.replace(/\D/g, '');
  const messageText = customMessage || siteConfig.whatsapp.messages[context] || siteConfig.whatsapp.messages.main;
  const encodedText = encodeURIComponent(messageText);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
