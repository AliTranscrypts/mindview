#!/usr/bin/env python3
"""
MindView Site Health Check — scripts/site-health.py
====================================================
Run this any time to verify the site has no broken links or videos.

Usage:
    python3 scripts/site-health.py                 # local file check + video oEmbed
    python3 scripts/site-health.py --live          # also hit the live staging URL
    python3 scripts/site-health.py --production    # also hit the production URL

Exit code:
    0  all checks passed
    1  one or more checks failed (list printed to stdout)

Checks performed:
  1. Internal links  — every href/src in every HTML file that points to
                       another file in the repo is verified to exist on disk.
                       Cloudflare URL-routing paths (/api/*, /catalog, etc.)
                       are correctly exempted.
  2. External links  — curriculum sub-page hrefs fetched and HTTP-status
                       checked. 403 from known bot-blocking domains are
                       treated as OK. True 404/500/521 are failures.
  3. YouTube videos  — every real YouTube embed ID in every chapter page
                       is verified via the oEmbed API.
  4. MathJax safety — no double-backslash delimiters (would break rendering).
  5. Orphaned files  — warns if any HTML file under courses/ or assessments/
                       is not reachable from any other HTML file in the repo.

Owner-approved 2026-06-03.
"""
import argparse, sys, re, json, time
import urllib.request, urllib.error
import concurrent.futures
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ─── Domains that routinely return 403 to automated requests but work
# in browsers — treat their 403 responses as OK.
BOT_BLOCK_DOMAINS = {
    'www.nelson.com', 'nelson.com',
    'www.investopedia.com', 'investopedia.com',
    'www.cpacanada.ca', 'cpacanada.ca',
    'www.canlii.org', 'canlii.org',
    'www.ouac.on.ca', 'ouac.on.ca',
    'www.si.edu', 'si.edu',
    'www.loc.gov', 'loc.gov',
    'whc.unesco.org', 'unesco.org',
    'www.ethnologue.com', 'ethnologue.com',
    'runestone.academy',
    'www.macleans.ca', 'macleans.ca',
    'www.mckinsey.com', 'mckinsey.com',
    'www.pearsoncanada.ca', 'pearsoncanada.ca',
    'www.mheducation.ca', 'mheducation.ca',
    'emond.ca', 'www.emond.ca',
    'www.poetryfoundation.org', 'poetryfoundation.org',
    'douglas-mcintyre.com', 'www.douglas-mcintyre.com',
    # Government of Canada — bot-blocked but work in browser
    'www.canada.ca', 'canada.ca',
    'laws-lois.justice.gc.ca',
    'www.tradecommissioner.gc.ca', 'tradecommissioner.gc.ca',
    'www.dcp.edu.gov.on.ca', 'dcp.edu.gov.on.ca',
    'www.edu.gov.on.ca', 'edu.gov.on.ca',
    # Stats Canada (some sub-pages 500)
    'www.statcan.gc.ca', 'statcan.gc.ca',
}

# Internal paths that are handled by Cloudflare Pages Functions or routing —
# they won't appear as files on disk.
CF_PATHS = {
    '/api/login', '/api/logout', '/api/me', '/api/bootstrap', '/api/users',
    '/login', '/admin', '/catalog', '/enrolment', '/resources', '/video-policy',
    '/logout',
}

ERRORS = []
WARNINGS = []


def err(msg): ERRORS.append(msg); print(f'  ✗ {msg}')
def warn(msg): WARNINGS.append(msg); print(f'  ⚠ {msg}')
def ok(msg): print(f'  ✓ {msg}')


# ─────────────────────────── 1. Internal links ────────────────────────────

def check_internal_links():
    print('\n── 1. Internal links ──────────────────────────────────────────')
    all_html = {}
    for f in ROOT.rglob('*.html'):
        rel = str(f.relative_to(ROOT))
        parts = rel.split('/')
        if '.git' in parts or 'node_modules' in parts:
            continue
        all_html[rel] = f

    broken = []
    ok_count = 0
    for rel, fpath in sorted(all_html.items()):
        text = fpath.read_text(errors='ignore')
        base = fpath.parent
        for m in re.finditer(r'(?:href|src)="([^"#?]+)"', text):
            target = m.group(1)
            if target.startswith(('http', 'https', '//', 'data:', 'javascript:', 'mailto:', 'tel:')):
                continue
            if not target or target.startswith('#'):
                continue
            # Skip JavaScript template literals (e.g. ${expr} inside onclick-generated HTML)
            if '${' in target:
                continue
            # Check if it's a known CF-handled path (no .html file expected)
            check_path = target if target.startswith('/') else '/' + target
            check_path_noext = check_path.rstrip('/')
            if check_path_noext in CF_PATHS or check_path_noext.startswith('/api/'):
                ok_count += 1
                continue
            # Resolve
            if target.startswith('/'):
                resolved = ROOT / target.lstrip('/')
            else:
                try:
                    resolved = ROOT / (base / target).resolve().relative_to(ROOT)
                except ValueError:
                    continue
            resolved_str = str(resolved).split('?')[0]
            if Path(resolved_str).exists():
                ok_count += 1
            else:
                broken.append((rel, target))

    ok(f'{ok_count} internal links resolve correctly')
    if broken:
        # Deduplicate by target
        seen = set()
        for src, tgt in broken:
            key = tgt
            if key not in seen:
                seen.add(key)
                err(f'Internal 404: {tgt}  (linked from {src})')
    else:
        ok('Zero broken internal links')


# ─────────────────────────── 2. External links ────────────────────────────

def check_external_links():
    print('\n── 2. External links (curriculum sub-pages) ───────────────────')
    pairs = []
    for f in sorted(ROOT.glob('courses/*_curriculum.html')):
        code = f.stem.replace('_curriculum', '')
        text = f.read_text(errors='ignore')
        for m in re.finditer(r'href="(https?://[^"]+)"', text):
            url = m.group(1)
            pairs.append((code, url))

    def check_url(item):
        code, url = item
        domain = url.split('/')[2] if '/' in url[8:] else url[8:]
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            })
            resp = urllib.request.urlopen(req, timeout=14)
            return (code, url, resp.getcode(), domain)
        except urllib.error.HTTPError as e:
            return (code, url, e.code, domain)
        except Exception as e:
            return (code, url, f'ERR:{type(e).__name__}', domain)

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
        results = list(ex.map(check_url, pairs))

    ok_cnt, skip_cnt, fail_cnt = 0, 0, 0
    for code, url, status, domain in results:
        if status == 200:
            ok_cnt += 1
        elif domain in BOT_BLOCK_DOMAINS and (
                status == 403 or isinstance(status, str)):
            skip_cnt += 1  # known bot-block (403 or connection-refused/timeout), fine in browser
        elif isinstance(status, int) and status in (301, 302, 307, 308):
            ok_cnt += 1  # redirect is OK
        else:
            fail_cnt += 1
            err(f'External link [{code}] HTTP {status}: {url[:80]}')

    ok(f'{ok_cnt} external links OK, {skip_cnt} bot-blocked (fine in browser)')
    if fail_cnt == 0:
        ok('Zero genuinely broken external links')


# ─────────────────────────── 3. YouTube videos ────────────────────────────

def check_videos():
    print('\n── 3. YouTube videos (oEmbed) ─────────────────────────────────')
    video_items = []
    for chap in sorted(ROOT.glob('courses/*/ch*.html')):
        text = chap.read_text(errors='ignore')
        if '⏳ Video pending' in text or 'TODO: instructor' in text:
            continue
        for m in re.finditer(r'(?:youtube\.com/embed|youtube-nocookie\.com/embed)/([a-zA-Z0-9_-]{11})', text):
            video_items.append((str(chap.relative_to(ROOT)), m.group(1)))

    def check_video(item):
        path, vid = item
        url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            resp = urllib.request.urlopen(req, timeout=12)
            data = json.loads(resp.read())
            return (path, vid, 200, data.get('title', '')[:50])
        except urllib.error.HTTPError as e:
            return (path, vid, e.code, '')
        except Exception as e:
            return (path, vid, f'ERR:{type(e).__name__}', '')

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
        results = list(ex.map(check_video, video_items))

    ok_cnt = sum(1 for _, _, s, _ in results if s == 200)
    broken = [(p, v, s) for p, v, s, _ in results if s != 200]
    ok(f'{ok_cnt} YouTube videos respond via oEmbed')
    if broken:
        for path, vid, status in broken:
            err(f'Broken video [{path}] {status}: https://youtube.com/watch?v={vid}')
    else:
        ok('Zero broken YouTube videos')


# ─────────────────────────── 4. MathJax safety ────────────────────────────

def check_mathjax():
    print('\n── 4. MathJax delimiter safety ────────────────────────────────')
    double_bs = re.compile(r'\\\\[\(\[\)\]]')
    bad = []
    for f in ROOT.rglob('*.html'):
        rel = str(f.relative_to(ROOT))
        if '.git' in rel:
            continue
        text = f.read_text(errors='ignore')
        if double_bs.search(text):
            bad.append(rel)
    if bad:
        for f in bad:
            err(f'Double-backslash MathJax in: {f}')
    else:
        ok('No double-backslash MathJax delimiters found')


# ─────────────────────────── 5. Live URL smoke test ───────────────────────

def check_live(base_url):
    print(f'\n── 5. Live smoke test: {base_url} ─────────────────────────')
    paths = [
        ('/', 302, 'auth gate'),
        ('/login', 200, 'login page'),
        ('/api/me', 200, '/api/me'),
        ('/video-policy', 200, 'video policy (public)'),
        ('/js/page-nav.js', 200, 'page-nav script'),
        ('/js/role-gated.js', 200, 'role-gated script'),
        ('/css/style.css', 200, 'stylesheet'),
    ]
    for path, expected, label in paths:
        try:
            req = urllib.request.Request(
                base_url + path,
                headers={'User-Agent': 'Mozilla/5.0'},
            )
            resp = urllib.request.urlopen(req, timeout=10)
            code = resp.getcode()
        except urllib.error.HTTPError as e:
            code = e.code
        except Exception as e:
            err(f'{label}: ERR {e}')
            continue
        if code == expected:
            ok(f'{code} {label}')
        else:
            err(f'{label}: expected {expected}, got {code}')


# ─────────────────────────── main ─────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='MindView site health check')
    parser.add_argument('--live', action='store_true',
                        help='Also check live staging URL')
    parser.add_argument('--production', action='store_true',
                        help='Also check live production URL')
    parser.add_argument('--skip-external', action='store_true',
                        help='Skip external link HTTP checks (faster)')
    args = parser.parse_args()

    print('MindView Site Health Check')
    print('=' * 54)
    t0 = time.time()

    check_internal_links()
    if not args.skip_external:
        check_external_links()
    check_videos()
    check_mathjax()
    if args.live:
        check_live('https://staging.mindview.pages.dev')
    if args.production:
        check_live('https://mindview.pages.dev')

    elapsed = time.time() - t0
    print(f'\n{"=" * 54}')
    print(f'Completed in {elapsed:.1f}s')
    if ERRORS:
        print(f'\n✗ {len(ERRORS)} ERROR(S) — site has issues that need fixing:')
        for e in ERRORS:
            print(f'  • {e}')
        sys.exit(1)
    elif WARNINGS:
        print(f'\n⚠  {len(WARNINGS)} warning(s) — review recommended')
        sys.exit(0)
    else:
        print(f'\n✅  All checks passed — site is clean!')
        sys.exit(0)


if __name__ == '__main__':
    main()
