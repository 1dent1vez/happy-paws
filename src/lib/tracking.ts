/**
 * Instrumentación de conversión.
 *
 * El único KPI del sitio es "clics a WhatsApp", así que cada enlace de
 * conversión emite un evento con su contexto (dónde estaba el botón, qué
 * mensaje precargado llevaba). Sin esto no hay forma de saber qué sección
 * convierte ni de dónde viene el tráfico.
 *
 * El diseño es agnóstico al proveedor: se empuja a `window.dataLayer`
 * (compatible con GA4/GTM sin configuración extra) y se despacha un
 * CustomEvent para cualquier listener propio. Para activar GA4 basta con
 * cargar su snippet; los eventos ya tienen el formato que espera.
 */

export type ConversionContext =
  | 'main'
  | 'header'
  | 'floating'
  | 'individual'
  | 'group'
  | 'process'
  | 'faq'
  | 'general'
  | 'paseosPage'
  | 'omnibar';

export interface ConversionEvent {
  event: 'whatsapp_click';
  context: ConversionContext;
  /** Ruta de la página donde ocurrió el clic. */
  page: string;
  /** Texto visible del botón, para saber qué copy convierte. */
  label: string;
  /** 'omnibar' lleva además la configuración elegida en la barra del hero. */
  detail?: string;
  timestamp: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Empuja el evento a dataLayer y lo despacha como CustomEvent. */
export function trackConversion(
  context: ConversionContext,
  label: string,
  detail?: string
): void {
  const payload: ConversionEvent = {
    event: 'whatsapp_click',
    context,
    page: window.location.pathname,
    label,
    ...(detail ? { detail } : {}),
    timestamp: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  window.dispatchEvent(new CustomEvent('hp:conversion', { detail: payload }));
}

/**
 * Delegación global: un solo listener captura todos los clics a wa.me,
 * incluidos los que se añadan después (el del hero se genera por JS).
 * Se marca el enlace con `data-hp-track` para no depender de atributos frágiles.
 */
export function initConversionTracking(): void {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;

      const context = (link.dataset.hpContext || 'general') as ConversionContext;
      const label = link.getAttribute('aria-label') || link.textContent?.trim() || '';
      const detail = link.dataset.hpDetail;

      trackConversion(context, label, detail);
    },
    { capture: true }
  );
}
