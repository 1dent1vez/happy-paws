"""Genera la portada social (og:image) 1200x630 de Happy Paws.

WhatsApp y Facebook esperan 1.91:1. La foto del hero es 1200x1798 (2:3), así
que servía recortada por el propio canal. Esta portada se compone a medida:
recorte de la foto real + velo degradado + tipografía de marca, de modo que el
texto siempre tenga contraste sobre cualquier fondo.

Uso: python3 scripts/make-og-cover.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public/images/hero-walk.jpg')
OUT = os.path.join(ROOT, 'public/images/og-cover.jpg')

W, H = 1200, 630
PRIMARY = (238, 93, 26)
WHITE = (255, 255, 255)
CREAM = (245, 239, 235)
MUTED = (214, 203, 192)
VEIL = (24, 21, 19)
LANCZOS = Image.Resampling.LANCZOS

FONT_CANDIDATES = [
    '/usr/share/fonts/julietaula-montserrat-fonts/Montserrat-Bold.otf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf',
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def build_veil():
    """Máscara opaca a la izquierda (donde va el texto) y transparente a la
    derecha, para que se siga viendo la fotografía."""
    mask = Image.new('L', (W, H), 0)
    md = ImageDraw.Draw(mask)
    for x in range(W):
        # 240 de opacidad en el borde izquierdo, 90 en el derecho
        alpha = int(240 - 150 * (x / W))
        md.line([(x, 0), (x, H)], fill=alpha)
    return mask


def main():
    src = Image.open(SRC).convert('RGB')
    sw, sh = src.size

    # Cubrir 1200x630 y recortar sesgado hacia ARRIBA. La foto original es un
    # retrato 1200x1798 cuyo tercio inferior contiene un juguete con la marca
    # "chewy.com" impresa: encuadrar ahí colaría una marca de tercero en la
    # portada de Happy Paws. Con 0.08 el recorte se queda en el tercio
    # superior/central, donde está el perro y no hay texto ajeno.
    scale = max(W / sw, H / sh)
    rw, rh = int(sw * scale + 0.5), int(sh * scale + 0.5)
    resized = src.resize((rw, rh), LANCZOS)
    left = (rw - W) // 2
    top = int((rh - H) * 0.08)
    base = resized.crop((left, top, left + W, top + H))

    img = Image.composite(Image.new('RGB', (W, H), VEIL), base, build_veil())

    d = ImageDraw.Draw(img)

    # Barra de marca superior
    d.rectangle([0, 0, W, 10], fill=PRIMARY)

    # Distintivo de zona
    f_badge = load_font(25)
    badge = 'EXCLUSIVO EN FORESTA DREAM LAGOONS'
    tw = d.textlength(badge, font=f_badge)
    bx, by = 72, 92
    d.rounded_rectangle([bx, by, bx + tw + 44, by + 50], radius=25, fill=WHITE)
    d.text((bx + 22, by + 11), badge, font=f_badge, fill=PRIMARY)

    # Titular
    f_h1 = load_font(76)
    d.text((70, 196), 'El paseo que', font=f_h1, fill=WHITE)
    d.text((70, 288), 'tu perro merece.', font=f_h1, fill=WHITE)

    # Apoyo
    f_sub = load_font(31)
    d.text((74, 404), 'Atención personalizada y reporte directo', font=f_sub, fill=CREAM)
    d.text((74, 448), 'en tu teléfono en cada salida.', font=f_sub, fill=CREAM)

    # Marca al pie
    f_brand = load_font(29)
    brand = 'Happy Paws'
    d.text((72, H - 76), brand, font=f_brand, fill=PRIMARY)
    tw2 = d.textlength(brand, font=f_brand)
    d.text((72 + tw2 + 18, H - 76), '·  Metepec, Estado de México', font=f_brand, fill=MUTED)

    img.save(OUT, 'JPEG', quality=86, optimize=True, progressive=True)
    print(f'{OUT}  {img.size[0]}x{img.size[1]}  {os.path.getsize(OUT) / 1024:.0f}KB')


if __name__ == '__main__':
    main()
