/**
 * Centralized Configuration for Happy Paws
 * Centralizes brand info, coverage area, schedule, and WhatsApp conversion logic.
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
    areas: string[];
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
      individual: string;
      group: string;
      process: string;
      faq: string;
      general: string;
      paseosPage: string;
      header: string;
      floating: string;
    };
  };
}

// Fallback demo phone if not provided via environment variable
const envPhone = typeof process !== 'undefined' ? process.env?.PUBLIC_WHATSAPP_PHONE : undefined;
const envPhoneDisplay = typeof process !== 'undefined' ? process.env?.PUBLIC_WHATSAPP_PHONE_DISPLAY : undefined;

const rawPhone = envPhone || '525500000000';
const isConfigured = Boolean(envPhone && envPhone !== '525500000000');

export const siteConfig: SiteConfig = {
  name: 'Happy Paws',
  legalName: 'Happy Paws Paseos Residenciales',
  tagline: 'Paseos dedicados y atención personalizada para perros en comunidades residenciales',
  description: 'Servicio de paseos individuales y grupales para perros. Priorizamos el bienestar animal, la exploración consciente y la comunicación transparente con cada dueño.',
  url: 'https://happypaws.mx',
  locale: 'es-MX',
  coverage: {
    title: 'Zona de Cobertura Residencial',
    description: 'Atendemos comunidades residenciales del poniente de la Ciudad de México y área metropolitana.',
    note: 'Verificamos la ruta y disponibilidad exacta de tu condominio o calle directamente en la primera conversación.',
    areas: [
      'Bosques de las Lomas',
      'Santa Fe residencial',
      'Interlomas y Bosque Real',
      'Lomas de Chapultepec',
      'Cuajimalpa residencial',
      'Tecamachalco y La Herradura'
    ]
  },
  schedule: {
    days: 'Lunes a Sábado',
    hours: '7:00 a 19:00 hrs',
    note: 'Paseos programados con antelación en franjas acordadas para evitar prisas.'
  },
  whatsapp: {
    phoneRaw: rawPhone,
    phoneFormatted: envPhoneDisplay || (isConfigured ? rawPhone : '+52 55 0000 0000 (Pendiente de configurar)'),
    isConfigured,
    messages: {
      main: 'Hola, quiero conocer los paseos de Happy Paws y saber si tienen disponibilidad en mi zona.',
      header: 'Hola, me gustaría información general sobre los paseos de Happy Paws.',
      floating: 'Hola, quiero consultar la disponibilidad para pasear a mi perro con Happy Paws.',
      individual: 'Hola, me interesa el paseo individual para mi perro. ¿Me comparten cómo funciona y sus tarifas?',
      group: 'Hola, quiero información sobre los paseos grupales de Happy Paws y cómo evalúan la compatibilidad entre perros.',
      process: 'Hola, me gustaría saber cómo coordinar la primera charla para que conozcan a mi perro.',
      faq: 'Hola, tengo una pregunta sobre la dinámica y seguridad de los paseos de Happy Paws.',
      general: 'Hola, quiero platicar con el equipo de Happy Paws sobre sus paseos.',
      paseosPage: 'Hola, estuve revisando los detalles en su página de paseos y quisiera agendar una evaluación para mi perro.'
    }
  }
};

/**
 * Generates an official WhatsApp click-to-chat URL with properly encoded message.
 */
export function getWhatsAppUrl(
  context: keyof typeof siteConfig.whatsapp.messages = 'main',
  customMessage?: string
): string {
  // Clean phone to only digits
  const cleanPhone = siteConfig.whatsapp.phoneRaw.replace(/\D/g, '');
  const messageText = customMessage || siteConfig.whatsapp.messages[context] || siteConfig.whatsapp.messages.main;
  const encodedText = encodeURIComponent(messageText);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
