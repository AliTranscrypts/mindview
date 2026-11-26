// Automatic checks for built module pages (04-shared-toolkit.md §6.3, adapted to the MindView site).
// Usage: node build/check.mjs <course> [NN ...] [--static-only] [--keep-going]
//        node build/check.mjs --all [--static-only]
// Static checks need plain Node only (CI runs them with no npm install). Browser checks lazily import playwright
// and use the installed Google Chrome (channel "chrome"); screenshots go to modules-src/.artifacts/<course>/<id>/.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { SRC, ROOT, VERSION, loadCourse, courses, moduleId, outFile, pickModules, fnv } from "./lib.mjs";

const args = process.argv.slice(2);
const STATIC = args.includes("--static-only");
const ALL = args.includes("--all");
const pos = args.filter(a => !a.startsWith("--"));
const LEGACY_KEYS = { "mhf4u/01-power-functions":"mhf4u-power-functions-v1" };
const US = [["color", "colour"], ["colors", "colours"], ["center", "centre"], ["centers", "centres"], ["behavior", "behaviour"], ["favorite", "favourite"], ["meter", "metre"], ["meters", "metres"], ["liter", "litre"], ["liters", "litres"],
  ["analyze", "analyse"], ["analyzed", "analysed"], ["analyzing", "analysing"], ["modeling", "modelling"], ["labeled", "labelled"], ["traveled", "travelled"], ["neighbor", "neighbour"], ["defense", "defence"], ["fiber", "fibre"], ["gray", "grey"], ["organize", "organise"]];
// "organise" is acceptable Canadian too, but Canadian usage prefers "organize"; don't flag it.
US.pop();

// ---------- helpers ----------
function extractPayload(html){
  const m = html.match(/<script>window\.MV_PAYLOAD=([\s\S]*?);<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return { _err:e.message }; }
}
function isOk(opt, salt){ if (!opt) return false; if (opt.ok !== undefined) return !!opt.ok; return opt._k === fnv(salt + "|" + opt._n + "|1"); }
function strings(o, out = [], key = ""){
  if (typeof o === "string") out.push([key, o]);
  else if (Array.isArray(o)) o.forEach(x => strings(x, out, key));
  else if (o && typeof o === "object") for (const k of Object.keys(o)) if (!k.startsWith("_")) strings(o[k], out, k);
  return out;
}
function plain(s){ return s.replace(/`[^`]*`/g, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " "); }

function staticCheck(course, id, file){
  const F = [], W = [];
  const html = fs.readFileSync(file, "utf8");
  const bytes = Buffer.byteLength(html);
  if (bytes > 400 * 1024) F.push(`file is ${(bytes / 1024).toFixed(0)} KB (limit 400 KB; target under 300 KB)`);
  else if (bytes > 300 * 1024) W.push(`file is ${(bytes / 1024).toFixed(0)} KB (target under 300 KB)`);
  const vm = html.match(/MindView module toolkit ([\d.]+)/);
  if (!vm) F.push("missing toolkit version comment"); else if (vm[1] !== VERSION) W.push(`built with toolkit ${vm[1]}, current is ${VERSION} (rebuild)`);
  { const vis = html.replace(/<!--[\s\S]*?-->/g, ""); const mv = vis.match(/\((?:verify|VERIFY)[^)]{0,40}\)|verify before release/); if (mv) F.push(`teacher note visible to students: "${mv[0]}" (move it into a // VERIFY: code comment)`); }
  // outside connections: src/href/url()/fetch to anything but Google Fonts
  const ext = [...html.matchAll(/(?:src|href)\s*=\s*["'](https?:)?\/\/([^/"']+)/gi)].map(m => m[2]).concat([...html.matchAll(/url\(\s*["']?https?:\/\/([^/"')]+)/gi)].map(m => m[1]));
  ext.filter(h => !/^fonts\.(googleapis|gstatic)\.com$/.test(h)).forEach(h => F.push(`outside connection to ${h}`));
  if (/\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/.test(html.replace(/<script>window\.MV_PAYLOAD[\s\S]*?<\/script>/, ""))) F.push("page code makes network requests (fetch/XMLHttpRequest)");
  const P = extractPayload(html);
  if (!P) { F.push("no MV_PAYLOAD found"); return { F, W }; }
  if (P._err) { F.push("MV_PAYLOAD is not valid JSON: " + P._err); return { F, W }; }
  const C = P.content, M = P.meta, salt = P.salt, review = C.kind === "review", ex = C.exceptions || {};
  const want = LEGACY_KEYS[course + "/" + id] || `${course}-${id}-v1`;
  if (M.storageKey !== want && !/-v\d+$/.test(M.storageKey)) F.push(`storage key ${M.storageKey}, expected ${want}`);
  if (M.progressKey !== `${course}-progress-v1:${id}`) F.push(`progress key ${M.progressKey}`);
  const count = (label, n, lo, hi, exKey) => { if ((n < lo || n > hi) && !ex[exKey]) F.push(`${label}: ${n} (expected ${lo === hi ? lo : lo + "–" + hi})`); };
  count("goals", (C.goals || []).length, review ? 6 : 4, review ? 9 : 6, "goals");
  const warm = review ? (C.start && C.start.diagnostic) : (C.start && C.start.warmup);
  const wq = (warm && warm.questions) || [];
  if (review) count("diagnostic questions", wq.length, 6, 18, "diagnostic"); else count("warm-up questions", wq.length, 6, 6, "warmup");
  if (!review) {
    count("predictions", ((C.explore || {}).predictions || []).length, 3, 4, "predictions");
    count("Explore target challenges", ((C.explore || {}).challenges || []).length, 2, 3, "challenges");
    count("practice activities", ((C.practice || {}).activities || []).length, 3, 3, "practice");
    if (!C.part3 || !C.part3.slug) F.push("part3.slug missing");
    const qc = C.part3 && C.part3.quickCheck;
    if (!qc && !ex.quickCheck) F.push("Part 3 has no quick check");
    if (qc) count("quick check items", qc.items.length, 4, 4, "quickCheck");
  } else {
    const mixed = ((C.mixed || {}).activities || []).reduce((n, a) => n + ((a.items || a.problems || a.sequences || a.left || []).length), 0);
    count("mixed practice items", mixed, 12, 18, "mixed");
  }
  count("journal prompts", ((C.reflect || {}).journal || []).length, 4, 4, "journal");
  const fq = (C.final || {}).questions || [];
  count("Final Check questions", fq.length, review ? 15 : 10, review ? 15 : 10, "final");
  const cats = { K:0, T:0, C:0, A:0 }; fq.forEach(q => { cats[q.cat] = (cats[q.cat] || 0) + 1; });
  const wantCat = review ? "4/4/3/4" : "3/3/2/2", gotCat = [cats.K, cats.T, cats.C, cats.A].join("/");
  if (gotCat !== wantCat && !ex.finalSplit) F.push(`Final Check split K/T/C/A is ${gotCat}, expected ${wantCat}`);
  count("flashcards", (C.cards || []).length, review ? 12 : 10, review ? 16 : 12, "cards");
  if (!C.task && !ex.task) F.push("no performance task");
  // multiple choice integrity
  const mcCheck = (label, opts, needWhy) => {
    if (!Array.isArray(opts)) { F.push(`${label}: options missing`); return; }
    const n = opts.filter(o => isOk(o, salt)).length;
    if (n !== 1) F.push(`${label}: ${n} correct options (need exactly 1)`);
    if (needWhy) opts.forEach((o, i) => { if (!o.why) F.push(`${label}: option ${String.fromCharCode(65 + i)} has no feedback (why)`); });
  };
  const hintCheck = (label, h) => { if (h !== undefined && (!Array.isArray(h) || h.length !== 3)) F.push(`${label}: needs exactly 3 hints`); };
  const goalCheck = (label, g) => { if (g === undefined || g === null || g === "") F.push(`${label}: no goal tag`); };
  wq.forEach(q => { mcCheck(`warm-up ${q.id}`, q.options, true); hintCheck(`warm-up ${q.id}`, q.hints); if (!q.hints) F.push(`warm-up ${q.id}: no hints`); goalCheck(`warm-up ${q.id}`, q.goal); if (review && !q.topic) F.push(`diagnostic ${q.id}: no topic tag`); });
  fq.forEach(q => {
    if (!q.a || !q.b) F.push(`final ${q.id}: needs version a and b`);
    ["a", "b"].forEach(v => q[v] && mcCheck(`final ${q.id}${v.toUpperCase()}`, q[v].options, true));
    goalCheck(`final ${q.id}`, q.goal); if (review && !q.topic) F.push(`final ${q.id}: no topic tag`);
    if (!"KTCA".includes(q.cat || "x")) F.push(`final ${q.id}: bad category ${q.cat}`);
  });
  ((C.explore || {}).predictions || []).forEach(p => { mcCheck(`prediction ${p.id}`, p.options, false); if (!p.explain) F.push(`prediction ${p.id}: no explanation`); });
  ((C.explore || {}).challenges || []).forEach(c => { hintCheck(`challenge ${c.id}`, c.hints); if (!c.hints) F.push(`challenge ${c.id}: no hints`); goalCheck(`challenge ${c.id}`, c.goal); });
  ((C.part3 || {}).quickCheck || { items:[] }).items.forEach(q => {
    const n = (q.choices || []).filter(o => isOk(o, salt)).length; if (n !== 1) F.push(`quick check ${q.id}: ${n} correct choices`);
    goalCheck(`quick check ${q.id}`, q.goal);
    (q.choices || []).forEach((c, i) => { if (!c.fb && !(q.right && q.wrong)) F.push(`quick check ${q.id}: choice ${i + 1} has no feedback`); });
  });
  const acts = [].concat((C.practice || {}).activities || [], (C.mixed || {}).activities || [], (C.connect || {}).activities || []);
  acts.forEach(a => {
    const L = `activity ${a.id}`;
    if (!a.title) F.push(`${L}: no title`);
    const items = a.items || a.problems || a.sequences || a.left || [];
    if (a.type === "sorter") items.forEach(it => { if (it._a === undefined && it.answer === undefined) F.push(`${L} ${it.id}: no answer`); hintCheck(`${L} ${it.id}`, it.hints); if (!it.why) F.push(`${L} ${it.id}: no why`); });
    if (a.type === "spot") items.forEach(p => { mcCheck(`${L} ${p.id} fixes`, p.fixes, true); hintCheck(`${L} ${p.id}`, p.hints); if (p._a === undefined && p.answer === undefined) F.push(`${L} ${p.id}: no answer (first wrong step)`); });
    if (a.type === "mc") items.forEach(q => { mcCheck(`${L} ${q.id}`, q.options, true); hintCheck(`${L} ${q.id}`, q.hints); });
    if (a.type === "selectall") items.forEach(q => { if (!q.options.some(o => isOk(o, salt))) F.push(`${L} ${q.id}: no correct option`); hintCheck(`${L} ${q.id}`, q.hints); });
    if (a.type === "numeric") items.forEach(q => { if (q._a === undefined && q.answer === undefined) F.push(`${L} ${q.id}: no answer`); hintCheck(`${L} ${q.id}`, q.hints); });
    if (a.type === "order") items.forEach(q => hintCheck(`${L} ${q.id}`, q.hints));
    if (a.type === "match" && a._a === undefined && a.answer === undefined) F.push(`${L}: no answer map`);
    if (!["custom"].includes(a.type)) {
      const untagged = items.filter(it => it.goal == null && a.goal == null);
      if (untagged.length) F.push(`${L}: ${untagged.length} item(s) with no goal tag (set goal on the activity or each item)`);
    }
    if (review && a.type !== "custom") { const nt = items.filter(it => !it.topic && !a.topic); if (nt.length) W.push(`${L}: ${nt.length} review item(s) with no topic tag`); }
  });
  // writing rules (text outside `math`)
  const txt = strings(C).filter(([k]) => !["id", "skill", "slug", "type", "store", "cat", "topic", "icon", "storageKey"].includes(k)).map(([, s]) => plain(s)).join("\n");
  US.forEach(([us, ca]) => { const re = new RegExp("\\b" + us + "\\b", "i"); const m = txt.match(re); if (m) F.push(`US spelling "${m[0]}" (use "${ca}")`); });
  const verb = txt.match(/\b(to|you|we|they|and|will|can|should|must|then) practice\b|\bpracticed\b|\bpracticing\b/i);
  if (verb) F.push(`"${verb[0]}": practise is the verb in Canadian spelling`);
  const hy = txt.match(/(^|[\s(\[,=])-\d/m);
  if (hy) W.push(`possible hyphen used as a minus outside math: "…${txt.substr(Math.max(0, hy.index - 15), 30).replace(/\n/g, " ")}…" (use − or put it in \`math\`)`);
  return { F, W, P };
}

// ---------- static server injecting the site's four scripts (what students' browsers get) ----------
const INJ = '<script src="/js/content-protection.js" defer></script><script src="/js/role-gated.js" defer></script><script src="/js/page-nav.js" defer></script><script src="/js/assessment-workflow.js" defer></script>';
function serve(){
  const TYPES = { ".html":"text/html; charset=utf-8", ".js":"text/javascript", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml", ".json":"application/json" };
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    let f = path.join(ROOT, p);
    if (!f.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404, { "content-type":"application/json" }); res.end('{"authenticated":false}'); return; }
    let b = fs.readFileSync(f); const ext = path.extname(f);
    if (ext === ".html") b = Buffer.from(b.toString().replace("</head>", INJ + "</head>"));
    res.writeHead(200, { "content-type":TYPES[ext] || "application/octet-stream" }); res.end(b);
  });
  return new Promise(r => srv.listen(0, "127.0.0.1", () => r(srv)));
}
const IGNORE = [/Failed to load resource/i, /favicon/i, /fonts\.g/i];
function watch(page, errs, label){
  page.on("console", m => { if (m.type() === "error" && !IGNORE.some(re => re.test(m.text()))) errs.push(`${label}: console error: ${m.text()}`); });
  page.on("pageerror", e => errs.push(`${label}: page error: ${e.message}` + ((e.stack || "").split("\n").slice(1, 2).join("").replace(/\s+/g, " ").replace(/http:\/\/127\.0\.0\.1:\d+/, "") || "")));
  page.on("dialog", d => d.accept().catch(() => {}));
}
async function overflow(page){ return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); }

async function browserCheck(browser, url, P, shotDir){
  const F = [], W = [], C = P.content, M = P.meta;
  const views = C.kind === "review" ? ["start", "connect", "mixed-practice", "reflect", "final-check"] : ["start", "explore", C.part3.slug, "practice", "reflect", "final-check"];
  fs.mkdirSync(shotDir, { recursive:true });
  // 1. desktop, light
  {
    const ctx = await browser.newContext({ viewport:{ width:1280, height:800 }, colorScheme:"light" });
    const page = await ctx.newPage(); const errs = []; watch(page, errs, "desktop");
    await page.goto(url); await page.waitForSelector("#steps .step", { timeout:10000 }).catch(() => F.push("desktop: step bar never rendered"));
    await page.waitForTimeout(400);
    for (const v of views) {
      await page.click(`#steps [data-view="${v}"]`).catch(() => F.push(`desktop: no step button for ${v}`));
      await page.waitForTimeout(250);
      const vis = await page.evaluate(v => { const s = document.querySelector(`.view[data-view="${v}"]`); return s && !s.hidden && s.textContent.trim().length > 40; }, v);
      if (!vis) F.push(`desktop: part "${v}" not visible or empty`);
      const ov = await overflow(page); if (ov > 1) F.push(`desktop: sideways scroll of ${ov}px in "${v}"`);
    }
    // Continue buttons walk the parts in order
    await page.click('#steps [data-view="start"]');
    for (let i = 0; i < views.length - 1; i++) {
      const btn = page.locator(`.view[data-view="${views[i]}"] [data-continue]`);
      if (await btn.count() === 0) { F.push(`desktop: no Continue button in "${views[i]}"`); continue; }
      await btn.first().click(); await page.waitForTimeout(150);
      const h = await page.evaluate(() => location.hash.slice(1)); if (h !== views[i + 1]) F.push(`desktop: Continue in "${views[i]}" went to "${h}"`);
    }
    const doneCount = await page.locator("#steps .step.done").count();
    if (doneCount < views.length - 1) F.push(`desktop: only ${doneCount} parts marked done after pressing every Continue`);
    // warm-up / diagnostic: answer question 1, then reload and confirm it's restored
    await page.click('#steps [data-view="start"]'); await page.waitForTimeout(150);
    const q1 = page.locator("#warmup .q").first();
    await q1.locator(".opt").first().click(); await q1.locator(".chip").nth(1).click();
    await q1.locator('[data-act="check"]').click(); await page.waitForTimeout(150);
    if (await q1.locator(".fb").count() === 0) F.push("desktop: warm-up feedback did not appear");
    // fuzz: press buttons in each part (skip reset/retake/links) and watch for errors
    for (const v of views.slice(1, -1)) {
      await page.click(`#steps [data-view="${v}"]`); await page.waitForTimeout(150);
      for (let k = 0; k < 45; k++) {
        const btns = page.locator(`.view[data-view="${v}"] button:not([disabled]):not([data-continue]):visible`);
        const n = await btns.count(); if (!n) break;
        await btns.nth((k * 7) % n).click({ timeout:1500 }).catch(() => {});
        if (k % 9 === 8) await page.waitForTimeout(80);
      }
      await page.waitForTimeout(400);
      // type into inputs
      const ins = page.locator(`.view[data-view="${v}"] input[type=text]:visible, .view[data-view="${v}"] input[type=number]:visible, .view[data-view="${v}"] textarea:visible`);
      const ni = Math.min(await ins.count(), 8);
      for (let k = 0; k < ni; k++) await ins.nth(k).fill(k % 2 ? "2" : "-1").catch(() => {});
    }
    // ENG4U: fill the Art of Language principle if present
    if (await page.locator("#art-p").count()) {
      await page.click('#steps [data-view="reflect"]');
      await page.fill("#art-p", "Test principle"); await page.fill("#art-e", "Test example"); await page.fill("#art-i", "Test imitation");
      await page.waitForTimeout(600);
    }
    // Final Check: answer everything, submit, retake (version B)
    await page.click('#steps [data-view="final-check"]'); await page.waitForTimeout(200);
    const firstPromptA = await page.locator("#final-qs .q .q-prompt").first().innerText().catch(() => "");
    const nq = await page.locator("#final-qs .q").count();
    for (let k = 0; k < nq; k++) { const q = page.locator("#final-qs .q").nth(k); await q.locator(".opt").first().click(); await q.locator(".chip").nth(1).click(); }
    const sub = page.locator("#final-submit");
    if (await sub.isDisabled().catch(() => true)) F.push("desktop: Final Check submit stayed disabled after answering every question");
    else {
      await sub.click(); await page.waitForTimeout(300);
      if (await page.locator("#final-results").count() === 0) F.push("desktop: no Final Check results after submitting");
      const sum = await page.locator("#sum-text").innerText().catch(() => "");
      if (!/results summary/.test(sum)) F.push("desktop: results summary missing after submit");
      await page.locator("#final-retake").click().catch(() => F.push("desktop: no Retake button"));
      await page.waitForTimeout(300);
      const firstPromptB = await page.locator("#final-qs .q .q-prompt").first().innerText().catch(() => "");
      if (firstPromptA && firstPromptA === firstPromptB) W.push("retake shows the same first question (is version B identical to A?)");
    }
    // progress record + reload restores state
    const rec = await page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, M.progressKey);
    if (!rec) F.push("desktop: no progress record in localStorage");
    else { for (const f of ["v", "id", "kind", "parts", "partsDone", "last", "started", "updated", "final", "task"]) if (!(f in rec)) F.push(`progress record missing "${f}"`); if (rec.final == null) F.push("progress record has no final after submitting"); }
    await page.reload(); await page.waitForTimeout(500);
    await page.click('#steps [data-view="start"]'); await page.waitForTimeout(150);
    if (await page.locator("#warmup .q").first().locator(".fb").count() === 0) F.push("desktop: warm-up answer not restored after reload");
    // flashcards
    await page.click("#open-fc"); await page.waitForTimeout(150);
    if (!(await page.locator("#fc[open]").count())) F.push("flashcards dialog did not open");
    else { await page.click("#fc-card"); await page.click('[data-fc="next"]'); await page.click('[data-fc="close"]'); }
    // theme switch
    await page.click("#theme-btn"); await page.waitForTimeout(150);
    if (await page.evaluate(() => document.documentElement.getAttribute("data-theme")) !== "dark") F.push("theme switch did not set dark mode");
    for (const v of views) { await page.click(`#steps [data-view="${v}"]`); await page.waitForTimeout(200); await page.screenshot({ path:path.join(shotDir, `d-${v}.png`) }); }
    errs.forEach(e => F.push(e));
    await ctx.close();
  }
  // 2. phone, dark, reduced motion
  {
    const ctx = await browser.newContext({ viewport:{ width:390, height:844 }, colorScheme:"dark", reducedMotion:"reduce", isMobile:true, hasTouch:true });
    const page = await ctx.newPage(); const errs = []; watch(page, errs, "phone");
    await page.goto(url); await page.waitForSelector("#steps .step", { timeout:10000 }).catch(() => {});
    await page.waitForTimeout(400);
    for (const v of views) {
      await page.evaluate(v => { location.hash = v; }, v); await page.waitForTimeout(250);
      const ov = await overflow(page); if (ov > 1) F.push(`phone: sideways scroll of ${ov}px in "${v}"`);
      await page.screenshot({ path:path.join(shotDir, `m-${v}.png`) });
    }
    // again with every step marked done (done steps add hidden "(done)" text to the step bar)
    for (let i = 0; i < views.length - 1; i++) {
      await page.evaluate(v => { location.hash = v; }, views[i]); await page.waitForTimeout(150);
      const btn = page.locator(`.view[data-view="${views[i]}"] [data-continue]`);
      if (await btn.count()) { await btn.first().click().catch(() => {}); await page.waitForTimeout(150); }
    }
    for (const v of views) {
      await page.evaluate(v => { location.hash = v; }, v); await page.waitForTimeout(150);
      const ov = await overflow(page); if (ov > 1) F.push(`phone (steps done): sideways scroll of ${ov}px in "${v}"`);
    }
    errs.forEach(e => F.push(e));
    await ctx.close();
  }
  // 3. storage blocked
  {
    const ctx = await browser.newContext({ viewport:{ width:1024, height:768 } });
    await ctx.addInitScript(() => { Object.defineProperty(window, "localStorage", { get(){ throw new DOMException("blocked", "SecurityError"); } }); });
    const page = await ctx.newPage(); const errs = []; watch(page, errs, "storage-blocked");
    await page.goto(url); await page.waitForSelector("#steps .step", { timeout:10000 }).catch(() => F.push("storage-blocked: page did not render"));
    await page.waitForTimeout(300);
    if (!(await page.locator("#save-off:not([hidden])").count())) F.push("storage-blocked: 'Saving is turned off' notice not shown");
    for (const v of views) { await page.evaluate(v => { location.hash = v; }, v); await page.waitForTimeout(120); }
    errs.filter(e => !/localStorage|SecurityError|blocked/.test(e)).forEach(e => F.push(e));
    await ctx.close();
  }
  return { F, W };
}

async function main(){
  const targets = [];
  if (ALL) {
    for (const c of courses()) { const cj = loadCourse(c); for (const m of cj.modules) { const f = outFile(cj, m); if (fs.existsSync(f)) targets.push([c, cj, m, f]); } }
  } else {
    if (!pos.length) { console.error("Usage: node build/check.mjs <course> [NN ...] [--static-only] | --all"); process.exit(2); }
    const cj = loadCourse(pos[0]);
    for (const m of pickModules(cj, pos.slice(1))) { const f = outFile(cj, m); if (fs.existsSync(f)) targets.push([pos[0], cj, m, f]); else if (pos.length > 1) { console.log(`✗ ${pos[0]} ${moduleId(m)}: not built (${path.relative(ROOT, f)} missing)`); process.exitCode = 1; } }
  }
  if (!targets.length) { console.log("No built module pages to check."); return; }
  let browser = null, srv = null;
  if (!STATIC) {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({ channel:"chrome" }).catch(() => chromium.launch());
    srv = await serve();
  }
  let failed = 0;
  // course home pages for the courses being checked
  const hubCourses = [...new Set(targets.map(t => t[0]))];
  for (const c of hubCourses) {
    const cj = loadCourse(c), hf = path.join(ROOT, "courses", cj.site, "modules", "index.html");
    if (!fs.existsSync(hf)) { console.log(`⚠ ${c} hub: not built (run node build/hub.mjs ${c})`); continue; }
    const F = [], html = fs.readFileSync(hf, "utf8");
    if (!/MindView module toolkit/.test(html)) F.push("missing toolkit version comment");
    [...html.matchAll(/(?:src|href)\s*=\s*["'](https?:)?\/\/([^/"']+)/gi)].map(m => m[2]).filter(h => !/^fonts\.(googleapis|gstatic)\.com$/.test(h)).forEach(h => F.push(`outside connection to ${h}`));
    if (browser) {
      for (const vp of [{ width:1280, height:900, colorScheme:"light" }, { width:390, height:844, colorScheme:"dark" }]) {
        const ctx = await browser.newContext({ viewport:{ width:vp.width, height:vp.height }, colorScheme:vp.colorScheme }); const page = await ctx.newPage(); const errs = []; watch(page, errs, "hub " + vp.width);
        await page.goto(`http://127.0.0.1:${srv.address().port}/courses/${cj.site}/modules/`); await page.waitForTimeout(500);
        const ov = await overflow(page); if (ov > 1) F.push(`hub ${vp.width}px: sideways scroll of ${ov}px`);
        if (await page.locator(".mrow").count() !== cj.modules.length) F.push(`hub ${vp.width}px: ${await page.locator(".mrow").count()} module rows, expected ${cj.modules.length}`);
        fs.mkdirSync(path.join(SRC, ".artifacts", c), { recursive:true }); await page.screenshot({ path:path.join(SRC, ".artifacts", c, `hub-${vp.width}.png`) });
        errs.forEach(e => F.push(e)); await ctx.close();
      }
    }
    if (F.length) failed++;
    console.log(`${F.length ? "✗ FAIL" : "✓ PASS"} ${c} hub (courses/${cj.site}/modules/index.html)`); F.forEach(x => console.log("    ✗ " + x));
  }
  for (const [c, cj, m, f] of targets) {
    const id = moduleId(m), t0 = Date.now();
    const s = staticCheck(c, id, f), F = s.F.slice(), W = s.W.slice();
    if (browser && s.P && !s.P._err) {
      try {
        const url = `http://127.0.0.1:${srv.address().port}/courses/${cj.site}/modules/${id}.html`;
        const b = await browserCheck(browser, url, s.P, path.join(SRC, ".artifacts", c, id));
        F.push(...b.F); W.push(...b.W);
      } catch (e) { F.push("browser check crashed: " + e.message.split("\n")[0]); }
    }
    const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
    const ff = uniq(F), ww = uniq(W);
    if (ff.length) failed++;
    console.log(`${ff.length ? "✗ FAIL" : "✓ PASS"} ${c} ${id} (${((Date.now() - t0) / 1000).toFixed(1)} s${STATIC ? ", static only" : ""})`);
    ff.forEach(x => console.log("    ✗ " + x));
    ww.forEach(x => console.log("    ⚠ " + x));
  }
  if (browser) await browser.close();
  if (srv) srv.close();
  console.log(`\n${targets.length - failed}/${targets.length} passed.` + (STATIC ? "" : ` Screenshots: ${path.relative(ROOT, path.join(SRC, ".artifacts"))}/<course>/<id>/`));
  if (failed) process.exitCode = 1;
}
main().catch(e => { console.error(e); process.exit(1); });
