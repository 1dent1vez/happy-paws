"""Read-only HTTP audit. A spoofed User-Agent does not verify genuine crawler IP access."""
import argparse
import concurrent.futures
import json
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime, timezone

AGENTS = ['Mozilla/5.0', 'OAI-SearchBot/1.4', 'ChatGPT-User/1.0', 'GPTBot/1.4', 'Claude-SearchBot/1.0', 'Claude-User/1.0', 'PerplexityBot/1.0', 'Perplexity-User/1.0', 'Googlebot', 'bingbot']

def fetch(job):
    base, path, agent = job
    result = {'path': path, 'user_agent': agent}
    try:
        request = urllib.request.Request(base.rstrip('/') + path, headers={'User-Agent': agent})
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read(500000).decode('utf-8', errors='replace')
            result.update(status=response.status, final_url=response.url, content_type=response.headers.get('Content-Type'), x_robots_tag=response.headers.get('X-Robots-Tag'), server=response.headers.get('Server'), challenge=any(marker in body.lower() for marker in ['vercel security checkpoint', 'cf-chl-', 'verify you are human']))
            if path == '/robots.txt':
                result['robots_text'] = body
    except urllib.error.HTTPError as error:
        result.update(status=error.code, final_url=error.url, error=str(error))
    except Exception as error:
        result.update(status=None, error=str(error))
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    jobs = [(args.url, path, agent) for agent in AGENTS for path in ['/', '/robots.txt']]
    jobs += [(args.url, path, AGENTS[0]) for path in ['/paseos/', '/sitemap.xml', '/sitemap-index.xml', '/sitemap-0.xml', '/llms.txt']]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        results = list(pool.map(fetch, jobs))
    report = {'checked_at_utc': datetime.now(timezone.utc).isoformat(), 'base_url': args.url, 'limitation': 'Requests originate from this machine, not verified crawler IPs.', 'results': results}
    Path(args.out).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    for row in results:
        print(row['status'], row['user_agent'], row['path'], 'challenge=' + str(row.get('challenge', False)), row.get('error', ''))

if __name__ == '__main__':
    main()
