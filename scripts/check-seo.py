"""Regression checks against the generated, non-JavaScript HTML and crawl files."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import unittest
import urllib.robotparser
import xml.etree.ElementTree as ET

DIST = Path(__file__).resolve().parents[1] / 'dist'
BASE = 'https://www.happypawsmetepec.me'

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.meta, self.canonical, self.headings, self.schemas = {}, None, [], []
        self.heading, self.heading_text, self.json_text = None, '', None
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta': self.meta[attrs.get('name')] = attrs.get('content', '')
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonical = attrs.get('href')
        if tag in ['h1', 'h2']:
            self.heading, self.heading_text = tag, ''
        if tag == 'script' and attrs.get('type') == 'application/ld+json': self.json_text = ''
    def handle_data(self, data):
        if self.heading: self.heading_text += data
        if self.json_text is not None: self.json_text += data
    def handle_endtag(self, tag):
        if tag == self.heading:
            self.headings.append((tag, ' '.join(self.heading_text.split())))
            self.heading = None
        if tag == 'script' and self.json_text is not None:
            self.schemas.append(json.loads(self.json_text))
            self.json_text = None

class SEOChecks(unittest.TestCase):
    def test_local_headings_metadata_and_static_content(self):
        for path, canonical in [('index.html', BASE + '/'), ('paseos/index.html', BASE + '/paseos/')]:
            with self.subTest(path=path):
                page = Page(DIST / path)
                h1 = [text for tag, text in page.headings if tag == 'h1']
                self.assertEqual(len(h1), 1)
                self.assertIn('Foresta', h1[0])
                self.assertIn('paseo', h1[0].lower())
                self.assertIn('Metepec', page.meta['description'])
                self.assertNotIn('noindex', page.meta['robots'])
                self.assertNotIn('nosnippet', page.meta['robots'])
                self.assertEqual(page.canonical, canonical)
                self.assertTrue(any('FAQPage' == schema.get('@type') for schema in page.schemas))
    def test_business_service_area_and_summary_consistency(self):
        page = Page(DIST / 'index.html')
        graph = next(schema['@graph'] for schema in page.schemas if '@graph' in schema)
        business = next(item for item in graph if item.get('@type') == 'LocalBusiness')
        self.assertEqual(business['areaServed']['name'], 'Foresta Dream Lagoons')
        self.assertEqual(business['address']['addressLocality'], 'Metepec')
        self.assertNotIn('geo', business)
        self.assertNotIn('priceRange', business)
        self.assertNotIn('PetService', json.dumps(graph))
        summary = (DIST / 'llms.txt').read_text()
        self.assertIn(business['telephone'], summary)
        self.assertIn('hasta 4 perros por paseador', summary)
        self.assertIn(BASE + '/paseos/', summary)
        self.assertNotIn('cero tirones', summary.lower())
    def test_crawlers_can_fetch_pages_and_assets(self):
        robots = urllib.robotparser.RobotFileParser()
        robots.parse((DIST / 'robots.txt').read_text().splitlines())
        for bot in ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Googlebot', 'Bingbot', 'Applebot', 'UnknownBot']:
            for path in ['/', '/paseos/', '/llms.txt', '/_astro/example.css', '/fonts/brand-fonts.css', '/images/hero-poster.jpg']:
                with self.subTest(bot=bot, path=path): self.assertTrue(robots.can_fetch(bot, BASE + path))
        self.assertIn(BASE + '/sitemap-index.xml', robots.site_maps())
    def test_sitemap_and_error_page(self):
        root = ET.fromstring((DIST / 'sitemap-0.xml').read_text())
        urls = [node.text for node in root.findall('.//{*}loc')]
        self.assertIn(BASE + '/', urls)
        self.assertIn(BASE + '/paseos/', urls)
        self.assertTrue(all(url.startswith(BASE + '/') for url in urls))
        self.assertFalse(any('404' in url or 'localhost' in url for url in urls))
        self.assertIn('noindex', Page(DIST / '404.html').meta['robots'])

if __name__ == '__main__':
    unittest.main()
