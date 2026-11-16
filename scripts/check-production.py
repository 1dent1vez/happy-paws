"""Check the built site's internal navigation, assets and accessibility references."""
from collections import Counter
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import unittest

DIST = Path(__file__).resolve().parents[1] / 'dist'
HOST = 'www.happypawsmetepec.me'

class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.nodes = []
        self.feed(path.read_text())
        self.ids = [a['id'] for _, a in self.nodes if 'id' in a]
    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

def resolve(path):
    result = DIST / unquote(path).lstrip('/')
    return result / 'index.html' if result.is_dir() else result

class ProductionChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {p: Document(p) for p in DIST.rglob('*.html')}
        assert cls.pages, 'Run npm run build first'

    def test_footer_author_credit(self):
        for path, page in self.pages.items():
            with self.subTest(page=path.relative_to(DIST)):
                credits = re.findall(r'<div\b[^>]*\bclass="footer-credit"[^>]*>(.*?)</div>', path.read_text(), re.S)
                self.assertEqual(len(credits), 1, 'Expected one footer author credit')
                self.assertEqual(' '.join(unescape(re.sub(r'<[^>]+>', '', credits[0])).split()), 'Hecho por Brilint')
                links = [attrs for tag, attrs in page.nodes if tag == 'a' and attrs.get('class') == 'footer-credit-link']
                self.assertEqual(len(links), 1)
                self.assertEqual(links[0].get('href'), 'https://brilinr.dpdns.org/servicios/landing-page/')
                self.assertEqual(links[0].get('target'), '_blank')
                self.assertEqual(set(links[0].get('rel', '').split()), {'noopener', 'noreferrer'})
                self.assertEqual(links[0].get('aria-label'), 'Brilint (se abre en una pestaña nueva)')
                link_text = re.findall(r'<a\b[^>]*>(.*?)</a>', credits[0], re.S)
                self.assertEqual([text.strip() for text in link_text], ['Brilint'])

    def test_unique_ids_and_aria_targets(self):
        for path, page in self.pages.items():
            with self.subTest(page=path.relative_to(DIST)):
                self.assertEqual([i for i,n in Counter(page.ids).items() if n>1], [])
                for _,attrs in page.nodes:
                    for name in ('aria-controls','aria-labelledby','aria-describedby'):
                        for target in attrs.get(name,'').split():
                            self.assertIn(target,page.ids, f'{path}: {name}={target}')

    def test_internal_links_and_fragments(self):
        for path,page in self.pages.items():
            for tag,attrs in page.nodes:
                if tag != 'a' or 'href' not in attrs: continue
                url=urlsplit(attrs['href'])
                if url.netloc and url.netloc != HOST: continue
                if url.scheme and url.scheme not in ('http','https'): continue
                target=resolve(url.path) if url.path else path
                with self.subTest(page=path.relative_to(DIST),href=attrs['href']):
                    self.assertTrue(target.exists(), f'Missing {target}')
                    if url.fragment and target in self.pages:
                        self.assertIn(unquote(url.fragment),self.pages[target].ids)

    def test_local_assets_and_whatsapp_destinations(self):
        for path,page in self.pages.items():
            for tag,attrs in page.nodes:
                sources=[]
                if tag in ('img','script','source'): sources.append(attrs.get('src',''))
                if tag == 'link' and attrs.get('rel') in ('stylesheet','icon','preload','manifest','apple-touch-icon'): sources.append(attrs.get('href',''))
                sources.extend(item.strip().split()[0] for item in attrs.get('srcset','').split(',') if item.strip())
                for src in sources:
                    if src.startswith('/'):
                        self.assertTrue(resolve(urlsplit(src).path).is_file(),f'{path}: missing {src}')
                if tag=='a' and urlsplit(attrs.get('href','')).netloc=='wa.me':
                    url=urlsplit(attrs['href'])
                    self.assertRegex(url.path,r'^/[1-9][0-9]{7,14}$')
                    self.assertIn('text=',url.query)
                    self.assertIn('noopener',attrs.get('rel',''))

if __name__ == '__main__': unittest.main()
