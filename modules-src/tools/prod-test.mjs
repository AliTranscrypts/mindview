#!/usr/bin/env node
// Smoke-test the LIVE site after a deploy.
//
//   node modules-src/tools/prod-test.mjs [--base URL] [course:NN ...]
//   e.g. node modules-src/tools/prod-test.mjs mhf4u:01 mhf4u:02
//
// Credentials come from MV_EMAIL / MV_PASSWORD, or from the file named by
// MV_ENV_FILE (default: ../../.prodtest.env next to the repo, never committed).
//
// Checks:
//   1. Logged out: / redirects to the login page; /admin/login loads.
//   2. Logged in: home, catalog, every course landing page that has modules,
//      and every chapter page that links modules load with no page errors;
//      their "Interactive modules" blocks list exactly the built modules.
//   3. Each named module (or, with none named, the hub pages only) loads, renders
//      its step bar and parts, every part opens from the step bar, no page errors.
//   4. Each course hub (courses/<site>/modules/) loads.
// Exits 1 on any failure.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const args = process.argv.slice(2);
let base = 'https://mindview.pages.dev';
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--base') base = args[++i].replace(/\/$/, '');
  else targets.push(args[i]);
}

function loadEnv() {
  const f = process.env.MV_ENV_FILE || path.resolve(repo, '../.prodtest.env');
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
  if (!process.env.MV_EMAIL || !process.env.MV_PASSWORD) {
    console.error('Set MV_EMAIL and MV_PASSWORD (or MV_ENV_FILE).');
    process.exit(2);
  }
}

function courses() {
  const dir = path.join(repo, 'modules-src/courses');
  return fs.readdirSync(dir)
    .filter((c) => fs.existsSync(path.join(dir, c, 'course.json')))
    .map((c) => JSON.parse(fs.readFileSync(path.join(dir, c, 'course.json'), 'utf8')));
}
const built = (c, m) => (m.status === 'built' || m.status === 'live') && fs.existsSync(path.join(repo, 'courses', c.site, 'modules', `${m.nn}-${m.slug}.html`));

const failures = [];
let QUIET = false;
const fail = (what, msg) => { failures.push(`${what}: ${msg}`); if (!QUIET) console.log(`  ✗ ${what}: ${msg}`); };
const ok = (what, msg = '') => console.log(`  ✓ ${what}${msg ? ' — ' + msg : ''}`);

// A failing page is retried once after a pause (fresh deploys can take a few seconds to reach every
// edge); it only counts as a failure if the retry fails too.
async function visit(ctx, url, what, check) {
  const before = failures.length;
  await visitOnce(ctx, url, what, check, true);
  if (failures.length > before) {
    failures.length = before;
    console.log(`    … retrying ${what} in 8 s`);
    await new Promise((r) => setTimeout(r, 8000));
    await visitOnce(ctx, url, what, check, false);
  }
  QUIET = false;
}

async function visitOnce(ctx, url, what, check, quiet) {
  QUIET = quiet;
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const src = (m.location() && m.location().url) || '';
    if (/favicon/i.test(m.text() + src)) return; // the site has no favicon (pre-existing 404)
    errors.push('console: ' + m.text() + (src ? ` [${src}]` : ''));
  });
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    const status = resp ? resp.status() : 0;
    if (status !== 200) { fail(what, `HTTP ${status} at ${page.url()}`); return; }
    if (/\/admin\/login|\/login(\?|$)/.test(new URL(page.url()).pathname + new URL(page.url()).search) && !/login/.test(url)) {
      fail(what, `redirected to login (${page.url()})`); return;
    }
    await page.waitForTimeout(600);
    const extra = check ? await check(page) : '';
    if (errors.length) fail(what, `page errors: ${errors.slice(0, 3).join(' | ')}`);
    else ok(what, extra || '');
  } catch (e) {
    fail(what, String(e.message || e).split('\n')[0]);
  } finally {
    await page.close();
  }
}

async function main() {
  loadEnv();
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const all = courses();

  console.log(`Base: ${base}`);
  console.log('1. Logged out');
  {
    const ctx = await browser.newContext();
    const r = await ctx.request.get(base + '/', { maxRedirects: 0 });
    if (r.status() === 302 && /login/.test(r.headers()['location'] || '')) ok('/ redirects to login');
    else fail('/ (logged out)', `expected 302 to login, got ${r.status()}`);
    const l = await ctx.request.get(base + '/admin/login');
    if (l.status() === 200) ok('/admin/login loads'); else fail('/admin/login', `HTTP ${l.status()}`);
    await ctx.close();
  }

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const login = await ctx.request.post(base + '/api/login', {
    data: { email: process.env.MV_EMAIL, password: process.env.MV_PASSWORD },
  });
  if (login.status() !== 200) { fail('login', `HTTP ${login.status()}`); await browser.close(); return finish(); }
  ok('login');

  console.log('2. Site pages');
  await visit(ctx, base + '/', 'home');
  await visit(ctx, base + '/catalog', 'catalog');
  for (const c of all) {
    const mods = c.modules.filter((m) => built(c, m));
    if (!mods.length) continue;
    await visit(ctx, `${base}/courses/${c.site}`, `courses/${c.site} landing`);
    for (const ch of [...new Set(mods.map((m) => m.siteChapter))]) {
      const expect = mods.filter((m) => m.siteChapter === ch).map((m) => `modules/${m.nn}-${m.slug}.html`);
      await visit(ctx, `${base}/courses/${c.site}/ch${ch}`, `courses/${c.site}/ch${ch}`, async (page) => {
        const hrefs = await page.$$eval('.mv-modules a.mv-module-card', (as) => as.map((a) => a.getAttribute('href')));
        const missing = expect.filter((h) => !hrefs.includes(h));
        if (missing.length || hrefs.length !== expect.length) throw new Error(`modules block lists ${hrefs.length}, expected ${expect.length} (missing ${missing.join(', ')})`);
        return `${hrefs.length} module link(s)`;
      });
    }
    await visit(ctx, `${base}/courses/${c.site}/modules/`, `courses/${c.site}/modules/ (hub)`, async (page) => {
      const n = await page.locator('a[href$=".html"]').count();
      return `${n} links`;
    });
  }

  console.log('3. Modules');
  for (const t of targets) {
    const [cname, nn] = t.split(':');
    const c = all.find((x) => x.course === cname || x.site === cname);
    const m = c && c.modules.find((x) => x.nn === nn.padStart(2, '0'));
    if (!m) { fail(t, 'unknown module'); continue; }
    const url = `${base}/courses/${c.site}/modules/${m.nn}-${m.slug}.html`;
    await visit(ctx, url, `${c.course} ${m.nn} ${m.slug}`, async (page) => {
      const steps = page.locator('nav#steps button.step');
      const n = await steps.count();
      if (n < 5) throw new Error(`step bar has ${n} steps`);
      for (let i = 0; i < n; i++) {
        await steps.nth(i).click();
        await page.waitForTimeout(150);
        const visible = await page.locator('section.view:not([hidden])').count();
        if (visible !== 1) throw new Error(`after step ${i + 1}, ${visible} parts visible`);
      }
      const size = (await page.content()).length;
      return `${n} parts OK, ${(size / 1024).toFixed(0)} KB DOM`;
    });
  }

  await browser.close();
  finish();
}

function finish() {
  console.log(failures.length ? `\nFAILED (${failures.length})` : '\nALL PASSED');
  process.exit(failures.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
