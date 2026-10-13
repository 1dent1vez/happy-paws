"""Auto-aloja Plus Jakarta Sans (subconjuntos latin y latin-ext).

El sitio cargaba la tipografía desde fonts.googleapis.com: una petición a un
tercero dentro de la ruta crítica de render, más implicaciones GDPR. Este
script descarga solo los subconjuntos que el español necesita y reescribe las
URL a rutas locales, de modo que `/fonts/plus-jakarta-sans.css` sirva desde el
propio origen.

Dos detalles de la API de Google Fonts que este script absorbe:

1. Plus Jakarta Sans se sirve como fuente VARIABLE: se emite una regla
   @font-face por peso, pero todas apuntan al MISMO woff2 (que lleva los ejes
   en `fvar`/`gvar`). Descargar un archivo por peso sería bajar cinco veces lo
   mismo. El script detecta URLs repetidas y guarda un solo archivo.
2. La respuesta a veces trae instancias estáticas (una URL por peso). En ese
   caso sí se descarga una por peso.

En ambos casos el CSS resultante es el que Google sirve, con las rutas
locales, de modo que los `font-weight` de `global.css` siguen resolviendo.

Uso: python3 scripts/fetch-fonts.py
"""

import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public/fonts')
CSS_OUT = os.path.join(OUT_DIR, 'plus-jakarta-sans.css')

CSS_URL = (
    'https://fonts.googleapis.com/css2?'
    'family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
)
# Un UA moderno hace que Google sirva woff2 en lugar de formatos antiguos.
UA = (
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
)

KEEP_SUBSETS = ('latin', 'latin-ext')
# Pesos que usa el sistema de diseño (global.css y los <link> de precarga).
REQUIRED_WEIGHTS = {'400', '500', '600', '700', '800'}

BLOCK_RE = re.compile(r'/\*\s*([a-z-]+)\s*\*/\s*(@font-face\s*\{[^}]+\})', re.S)
URL_RE = re.compile(r'url\((https://fonts\.gstatic\.com/[^)]+\.woff2)\)')
WEIGHT_RE = re.compile(r'font-weight:\s*(\d+)')


def fetch(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30
    ).read()


def main():
    css = fetch(CSS_URL).decode('utf-8')

    blocks = [
        (subset, block)
        for subset, block in BLOCK_RE.findall(css)
        if subset in KEEP_SUBSETS and URL_RE.search(block)
    ]
    if not blocks:
        sys.exit('ERROR: la respuesta de Google no trajo bloques utilizables.')

    # ¿Una URL por peso (estáticas) o una URL compartida (variable)?
    urls = []
    for _, block in blocks:
        match = URL_RE.search(block)
        if match:
            urls.append(match.group(1))
    shared = len(set(urls)) < len(urls)

    os.makedirs(OUT_DIR, exist_ok=True)
    url_to_name = {}
    out_blocks = []
    seen_weights = set()

    for subset, block in blocks:
        url_match = URL_RE.search(block)
        if not url_match:
            continue
        url = url_match.group(1)
        weight_match = WEIGHT_RE.search(block)
        weight = weight_match.group(1) if weight_match else '400'
        seen_weights.add(weight)

        if url not in url_to_name:
            # Con fuente variable el nombre no lleva peso: un archivo cubre
            # todos. Con estáticas sí, para no sobrescribir unos con otros.
            suffix = 'variable' if shared else weight
            name = f'plus-jakarta-sans-{subset}-{suffix}.woff2'
            data = fetch(url)
            with open(os.path.join(OUT_DIR, name), 'wb') as fh:
                fh.write(data)
            url_to_name[url] = name
            print(f'{name}  {len(data) / 1024:.1f}KB')

        out_blocks.append(block.replace(url, f'/fonts/{url_to_name[url]}').strip())

    missing = REQUIRED_WEIGHTS - seen_weights
    if missing:
        sys.exit(
            f'ERROR: Google no devolvió instancias para los pesos {sorted(missing)}. '
            'No se genera el CSS: dejar la web sin tipografía sería peor que '
            'seguir con el <link> remoto.'
        )

    kind = 'variable' if shared else 'estáticas'
    header = (
        f'/* Plus Jakarta Sans — auto-alojada, subconjuntos latin y latin-ext\n'
        f'   ({kind}). Generado por scripts/fetch-fonts.py; no editar a mano.\n'
        f'   Licencia: SIL Open Font License 1.1. */\n\n'
    )
    with open(CSS_OUT, 'w', encoding='utf-8') as fh:
        fh.write(header + '\n\n'.join(out_blocks) + '\n')

    total = sum(
        os.path.getsize(os.path.join(OUT_DIR, f))
        for f in os.listdir(OUT_DIR)
        if f.endswith('.woff2')
    )
    print(f'\n{CSS_OUT}')
    print(f'{len(out_blocks)} reglas @font-face · {len(url_to_name)} archivos · '
          f'{total / 1024:.1f}KB')


if __name__ == '__main__':
    main()
