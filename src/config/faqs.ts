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
    question: '¿El servicio opera exclusivamente dentro de Foresta Dream Lagoons?',
    answer:
      'Sí. Nos enfocamos exclusivamente en Foresta Dream Lagoons. Esto nos permite garantizar máxima puntualidad, conocimiento profundo de las áreas verdes y senderos más seguros del fraccionamiento, y atención vecinal cercana y confiable.'
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
      'En la charla inicial de conocimiento evaluamos la personalidad de tu mascota. Si es tímido, de edad avanzada o prefiere no convivir con otros perros, recomendamos paseo individual. Si es sociable y equilibrado, puede integrarse a un grupo pequeño de máximo 3 a 4 perros con temperamentos compatibles.'
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
