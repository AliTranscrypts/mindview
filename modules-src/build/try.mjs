// Run your own interaction test against a built module page, in headless Chrome, with the site's scripts injected.
// Usage: node build/try.mjs <course> <NN> <test.mjs>
// test.mjs:  export default async function(page, t){ await page.click(…); t.log("…"); t.expect(cond, "message"); }
//   t = { url, log(msg), expect(cond, msg), hash(view), shot(name) }   (page is a Playwright Page at 1280×900, already loaded)
// Keep test files in modules-src/.artifacts/ (git-ignored). Exit code 1 if any expect failed or the page threw an error.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { pathToFileURL } from "node:url";
import { ROOT, SRC, loadCourse, pickModules, moduleId } from "./lib.mjs";

const [course, nn, testFile] = process.argv.slice(2);
if (!testFile) { console.error("Usage: node build/try.mjs <course> <NN> <test.mjs>"); process.exit(2); }
const cj = loadCourse(course), m = pickModules(cj, [nn])[0], id = moduleId(m);
const INJ = '<script src="/js/content-protection.js" defer></script><script src="/js/role-gated.js" defer></script><script src="/js/page-nav.js" defer></script><script src="/js/assessment-workflow.js" defer></script>';
const srv = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404, { "content-type":"application/json" }); res.end("{}"); return; }
  let b = fs.readFileSync(f); if (f.endsWith(".html")) b = Buffer.from(b.toString().replace("</head>", INJ + "</head>"));
  res.writeHead(200, { "content-type":f.endsWith(".html") ? "text/html; charset=utf-8" : f.endsWith(".js") ? "text/javascript" : "application/octet-stream" }); res.end(b);
});
await new Promise(r => srv.listen(0, "127.0.0.1", r));
const { chromium } = await import("playwright");
const browser = await chromium.launch({ channel:"chrome" }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport:{ width:1280, height:900 } });
const errs = [], fails = [];
page.on("pageerror", e => errs.push(e.message)); page.on("dialog", d => d.accept().catch(() => {}));
page.on("console", msg => { if (msg.type() === "error" && !/Failed to load resource/.test(msg.text())) errs.push(msg.text()); });
const url = `http://127.0.0.1:${srv.address().port}/courses/${cj.site}/modules/${id}.html`;
await page.goto(url); await page.waitForTimeout(600);
const shots = path.join(SRC, ".artifacts", course, id); fs.mkdirSync(shots, { recursive:true });
// Test scripts run with cwd = modules-src, so a screenshot path written from the repo root
// ("modules-src/.artifacts/…") would land in modules-src/modules-src/. Re-anchor such paths.
{ const shot0 = page.screenshot.bind(page);
  page.screenshot = (o = {}) => { if (o.path && !path.isAbsolute(o.path) && /^modules-src[\\/]/.test(o.path)) o = { ...o, path:path.join(ROOT, o.path) }; return shot0(o); }; }
const t = {
  url, log:(...a) => console.log("  ", ...a),
  expect:(c, msg) => { console.log(c ? "   ✓ " + msg : "   ✗ " + msg); if (!c) fails.push(msg); },
  hash:async v => { await page.evaluate(v => { location.hash = v; }, v); await page.waitForTimeout(300); },
  shot:async name => { const f = path.join(shots, "try-" + name + ".png"); await page.screenshot({ path:f }); console.log("   screenshot: " + path.relative(ROOT, f)); }
};
try { await (await import(pathToFileURL(path.resolve(testFile)).href)).default(page, t); }
catch (e) { fails.push("test threw: " + e.message.split("\n")[0]); console.log("   ✗ test threw: " + e.message.split("\n")[0]); }
errs.forEach(e => console.log("   ✗ page error: " + e));
await browser.close(); srv.close();
console.log(fails.length || errs.length ? `\n✗ ${fails.length} failed expectation(s), ${errs.length} page error(s)` : "\n✓ all expectations met, no page errors");
process.exit(fails.length || errs.length ? 1 : 0);
