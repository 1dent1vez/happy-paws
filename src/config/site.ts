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
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  schedule: {
    days: string;
    hours: string;
    opens: string;
    closes: string;
    note: string;
  };
  whatsapp: {
    phoneRaw: string;
    phoneFormatted: string;
    isConfigured: boolean;
    messages: {
      main: string;
      floating: string;
      individual: string;
      group: string;
      process: string;
      faq: string;
      general: string;
      paseosPage: string;
    };
  };
  instagram: {
    handle: string;
    url: string;
  };
}

const PLACEHOLDER_PHONE = '525500000000';

/**
 * Las variables PUBLIC_* se leen con import.meta.env, que es la vía de Astro.
 *
 * Antes se leían con process.env: eso funciona en `npm run build` (Astro carga
 * .env en el proceso de Node) pero NO en el dev server ni en el bundle del
 * cliente, donde process.env no existe. El resultado era un `astro dev` con
 * error 500 teniendo .env correctamente configurado. import.meta.env resuelve
 * en los tres contextos.
 */
const envPhone = import.meta.env?.PUBLIC_WHATSAPP_PHONE;
const envPhoneDisplay = import.meta.env?.PUBLIC_WHATSAPP_PHONE_DISPLAY;

const rawPhone = envPhone || PLACEHOLDER_PHONE;
const isConfigured = Boolean(envPhone && envPhone !== PLACEHOLDER_PHONE);

/**
 * Guardia de build: sin PUBLIC_WHATSAPP_PHONE el sitio compilaba igual y se veía
 * perfecto, pero TODOS los wa.me apuntaban a un número inexistente. Como .env
 * está en .gitignore, cualquier CI o host que no declare la variable producía
 * un sitio sin conversión y sin ningún aviso.
 *
 * Se rompe el build a propósito: es preferible un deploy fallido y visible que
 * un sitio en producción que pierde cada lead en silencio.
 */
if (!isConfigured) {
  const detalle = envPhone
    ? `PUBLIC_WHATSAPP_PHONE sigue con el valor de ejemplo (${envPhone}).`
    : 'PUBLIC_WHATSAPP_PHONE no está definida.';

  throw new Error(
    `[Happy Paws] No se puede compilar: ${detalle}\n` +
      'Copia .env.example a .env y define el número real de WhatsApp, ' +
      'o declara la variable en el entorno del build.\n' +
      'Sin ella el sitio compila con un número inexistente y pierde todas las conversiones.'
  );
}

export const siteConfig: SiteConfig = {
  name: 'Happy Paws',
  legalName: 'Happy Paws Paseos Residenciales',
  tagline: 'Paseos caninos dedicados en Foresta Dream Lagoons',
  description: 'Servicio de paseo y bienestar canino exclusivo para residentes de Foresta Dream Lagoons. Cuidado atento, exploración a su ritmo y reporte directo en tu teléfono.',
  url: 'https://www.happypawsmetepec.me',
  locale: 'es-MX',
  coverage: {
    title: 'Zona Exclusiva',
    description: 'Servicio disponible exclusivamente para residentes de Foresta Dream Lagoons.',
    note: 'Paseos seguros y tranquilos dentro del fraccionamiento.',
    community: 'Foresta Dream Lagoons',
    city: 'Metepec',
    state: 'Estado de México',
    latitude: 19.2625,
    longitude: -99.6042
  },
  schedule: {
    days: 'Lunes a Sábado',
    hours: '7:00 a 19:00 hrs',
    opens: '07:00',
    closes: '19:00',
    note: 'Horarios programados con previa cita.'
  },
  whatsapp: {
    phoneRaw: rawPhone,
    phoneFormatted: envPhoneDisplay || (isConfigured ? rawPhone : '+52 55 0000 0000 (Pendiente de configurar)'),
    isConfigured,
    messages: {
      main: 'Hola, quiero conocer los paseos de Happy Paws en Foresta Dream Lagoons y consultar disponibilidad.',
      floating: 'Hola, quiero consultar la disponibilidad para pasear a mi perro en Foresta Dream Lagoons.',
      individual: 'Hola, me interesa el paseo individual para mi perro en Foresta. Me comparten tarifas y funcionamiento?',
      group: 'Hola, quiero información sobre los paseos grupales y cómo evalúan la compatibilidad entre perros en Foresta.',
      process: 'Hola, me gustaría agendar la charla de conocimiento inicial para mi perro en Foresta.',
      faq: 'Hola, tengo una pregunta sobre el servicio de paseos en Foresta Dream Lagoons.',
      general: 'Hola, quiero platicar con el equipo de Happy Paws sobre sus paseos en Foresta.',
      paseosPage: 'Hola, estuve revisando los detalles de sus paseos y quisiera agendar una evaluación para mi perro en Foresta.'
    }
  },
  instagram: {
    handle: '@happypawsmetepec',
    url: 'https://www.instagram.com/happypawsmetepec?cplk=MTk2bTAxN3RzamttdQ=='
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
