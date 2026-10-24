# SEO local y acceso de rastreadores

## Contenido preparado en la rama local

- Portada: título «Paseos de perros en Foresta, Metepec | Happy Paws» y H1 «Paseos de perros en Foresta, Metepec».
- Página de modalidades: paseo individual o grupal en Foresta Dream Lagoons.
- H2 y preguntas: comparación individual/grupal, contratación, precio, horarios y requisitos. La redacción conserva la cobertura exclusiva dentro de Foresta.
- Nombre, teléfono, zona, horarios y modalidades coherentes entre contenido, JSON-LD y resumen público.
- JSON-LD con `LocalBusiness`, `WebSite`, `WebPage` y servicios enlazados mediante IDs estables. Se retiró el tipo no estándar `PetService`, un precio simbólico no publicado y coordenadas/dirección de calle no verificadas. La zona de servicio es Foresta, no todo Metepec.
- `llms.txt` se genera durante el build desde la configuración de contacto; no mantiene otra copia manual del teléfono. El resumen sirve como documento auxiliar, no como mecanismo de indexación.
- Las páginas comerciales permiten indexación y snippets; el 404 mantiene `noindex`.

Las consultas se orientan a intención observada en resultados públicos (paseos/paseadores de perros en Metepec, servicio en Foresta y modalidad individual/grupal). No se dispone de datos privados de Search Console ni de volúmenes de búsqueda: no se presentan estimaciones como búsquedas reales medidas. Para priorizar con datos propios hace falta revisar consultas, impresiones y clics en Search Console.

## Auditoría del sitio publicado

Resultado reproducible en `docs/auditoria-rastreo-produccion.json`:

- 25 solicitudes GET, todas HTTP 200.
- Portada y `robots.txt` con diez identificadores: navegador, OAI-SearchBot, ChatGPT-User, GPTBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot y Bingbot.
- Adicionalmente: página de paseos, alias de sitemap, índice, sitemap de URLs y llms.txt.
- Tipos MIME correctos; sin `X-Robots-Tag` restrictivo ni los indicadores de desafío buscados por el script.
- Servidor observado: Vercel.
- El robots publicado ya permitía el acceso a través del grupo `*`. Los nuevos grupos explícitos documentan búsqueda y recuperación, separadas de los permisos de entrenamiento ya existentes.

**Límite:** cambiar el User-Agent no reproduce las IP verificadas ni la huella de red de los proveedores. Esta auditoría no prueba acceso desde las IP reales, visitas registradas, indexación, posición o menciones en respuestas de IA. No se cambiaron reglas de firewall ni seguridad del hosting. Los cambios del repositorio requieren despliegue para llegar al dominio público.

## Política de rastreo

- Búsqueda y recuperación: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot, Bingbot y Applebot tienen permiso explícito.
- Se conserva el permiso anterior para GPTBot, ClaudeBot, Google-Extended y Applebot-Extended. El permiso de entrenamiento no es necesario para aparecer en ChatGPT Search.
- No se bloquean CSS, imágenes ni fuentes. La política CSP existente se conserva.
- El acceso real debe contrastarse con logs del hosting y los rangos IP vigentes publicados por cada proveedor. No conviene crear excepciones de seguridad basadas únicamente en un User-Agent, que cualquiera puede copiar.

## Comprobaciones y reproducción

```bash
npm run build
npm run test:seo
python3 scripts/audit-crawl.py --url https://www.happypawsmetepec.me --out docs/auditoria-rastreo-produccion.json
```

Los cuatro grupos de pruebas locales verifican HTML estático sin JavaScript, H1 y metadatos, schema/contacto, permisos de robots para páginas y recursos, sitemap y 404.

Para fortalecer Maps y presencia local fuera de la web se necesita el perfil auténtico de Google Business y sus datos verificados. No se crearon perfiles, reseñas ni domicilios ficticios.

## Fuentes oficiales consultadas

- OpenAI: https://developers.openai.com/api/docs/bots
- Claude: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Google: https://developers.google.com/search/docs/appearance/ai-features
- Schema.org: https://schema.org/LocalBusiness
