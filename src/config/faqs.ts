/**
 * Preguntas frecuentes — fuente única.
 *
 * El acordeón visual y el schema `FAQPage` leen de aquí. Antes el contenido
 * vivía dentro del componente, así que el markup estructurado no podía
 * generarse sin duplicar el texto (y sin riesgo de que ambas copias
 * divergieran).
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: '¿Cuánto cuesta un paseo de perros en Foresta y qué incluye?',
    answer: 'La tarifa depende de la modalidad y de cuántos paseos necesitas por semana. Te compartimos por WhatsApp las opciones por sesión o paquete mensual. Incluyen recogida y regreso en tu puerta, recorrido dentro de Foresta, pausas de agua y reporte al terminar; la foto se envía con tu autorización.'
  },
  {
    question: '¿Tengo que elegir modalidad antes de escribirles?',
    answer: 'No. Cuéntanos la edad de tu perro, cómo se lleva con otros perros y los horarios que necesitas. Te orientamos entre atención individual y grupo pequeño. Antes de integrarlo a un grupo revisamos su compatibilidad.'
  },
  {
    question: '¿Dónde opera Happy Paws en Metepec?',
    answer:
      'Operamos de forma exclusiva dentro del fraccionamiento residencial Foresta Dream Lagoons en Metepec, Estado de México. Los recorridos se realizan dentro del fraccionamiento y sus áreas verdes, sin traslados en jaulas ni salidas a avenidas de alto tráfico.'
  },
  {
    question: '¿Cómo funcionan los reportes de paseo tras cada salida?',
    answer:
      'Al concluir cada caminata, recibes un reporte directo en tu WhatsApp con la hora exacta de inicio y entrega, duración del recorrido, registro de hidratación y necesidades fisiológicas, además de una foto de tu perro con tu autorización.'
  },
  {
    question: '¿Cuánto tiempo dura cada paseo?',
    answer:
      'Nuestros paseos tienen una duración efectiva de 45 a 60 minutos de caminata y estimulación olfativa dentro de Foresta, adaptados a la edad, condición física y nivel de energía de tu perro.'
  },
  {
    question: '¿En qué horarios realizan las salidas?',
    answer:
      'Operamos de lunes a sábado entre las 7:00 y las 19:00 hrs. Los paseos se programan con antelación en franjas convenientes para evitar las horas de mayor radiación solar y cuidar sus almohadillas.'
  },
  {
    question: '¿Cómo eligen entre paseo individual o grupal?',
    answer:
      'En la charla inicial de conocimiento evaluamos la personalidad de tu mascota. Si es tímido, de edad avanzada o prefiere no convivir con otros perros, recomendamos paseo individual. Si es sociable y equilibrado, puede integrarse a un grupo pequeño de hasta 4 perros por paseador con temperamentos compatibles.'
  },
  {
    question: '¿Qué información solicitan antes del primer paseo?',
    answer:
      'Solicitamos esquema de vacunación básico al día, uso de arnés o pechera ergonómica en buen estado, datos de contacto de emergencia y cualquier observación relevante sobre su comportamiento (reacción a estímulos, hábitos o alergias).'
  },
  {
    question: '¿Qué sucede si llueve o hay clima adverso en Foresta?',
    answer:
      'La seguridad y bienestar de tu perro son prioridad. Ante lluvia intensa o tormenta, pausamos el recorrido en zonas cubiertas o coordinamos contigo por WhatsApp el reagendamiento o reposición del tiempo.'
  },
  {
    question: '¿Cómo solicito disponibilidad o cotización?',
    answer:
      'Solo debes pulsar cualquiera de nuestros botones de WhatsApp. Te responderemos directamente para conocer a tu perrito, resolver dudas y acordar los días y horarios que necesitas.'
  }
];
