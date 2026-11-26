// Build a course's module home page: <repo>/courses/<site>/modules/index.html
// Usage: node build/hub.mjs <course> | --all
// A module is listed as available iff course.json marks it built/live (set by the orchestrator via
// tools/progress.py) AND its page courses/<site>/modules/NN-slug.html exists. In-progress pages that
// parallel builders have assembled are therefore never linked.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { TOOLKIT, VERSION, FONTS, ROOT, loadCourse, courses, moduleId, outDir, outFile, minCSS, minJS, kb } from "./lib.mjs";

let terser = null;
try { terser = createRequire(import.meta.url)("terser"); } catch (e) {}

export async function buildHub(course){
  const cj = loadCourse(course);
  const read = f => fs.readFileSync(path.join(TOOLKIT, f), "utf8");
  const css = minCSS(read("css/tokens.css") + read("css/base.css") + read("hub/hub.css"));
  let js = read("hub/hub.js");
  js = terser ? (await terser.minify(js, { mangle:true, compress:true })).code : minJS(js);
  const data = {
    course:cj.course, site:cj.site, code:cj.code, title:cj.title, art:cj.course === "eng4u",
    groups:cj.groups.map(g => ({ id:g.id, label:g.label, name:g.name })),
    modules:cj.modules.map(m => ({ nn:m.nn, slug:m.slug, title:m.title, kind:m.kind, group:m.group, prereqs:m.prereqs || [], built:(m.status === 'built' || m.status === 'live') && fs.existsSync(outFile(cj, m)) }))
  };
  const nBuilt = data.modules.filter(m => m.built).length;
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${cj.code} ${cj.title}: Interactive Modules</title>
<!-- MindView module toolkit ${VERSION} | ${cj.course} course home | built from modules-src/ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<script>try{var t=localStorage.getItem("${cj.course}-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
<style>
${css}
</style>
</head>
<body>
<header class="top hub-top"><div class="top-inner" style="padding-bottom:10px"><div class="top-row">
<a class="btn ghost sm home-link" href="/courses/${cj.site}.html"><span aria-hidden="true">←</span><span class="home-t">&nbsp;${cj.code} course page</span></a>
<div class="brand hub-title"><b>${cj.code} ${cj.title}</b><span>Interactive self-study modules</span></div>
<div class="prog"><span class="prog-bar" aria-hidden="true"><i id="hub-bar"></i></span><span id="hub-count" class="prog-text">0 of ${data.modules.length} done</span></div>
<div class="hd-btns"><button type="button" class="btn ghost sm theme-btn" id="theme-btn"></button></div>
</div></div></header>
<main>
<section class="sheet nextup" id="nextup" aria-label="Next up"></section>
${data.art ? '<section class="sheet" aria-labelledby="art-h"><h2 id="art-h">My Art of Language</h2><div id="art"></div></section>' : ""}
<div id="groups"></div>
<section class="sheet hub-foot"><p>Your progress is saved in this browser only. It isn’t sent anywhere. To move it to another device, or to keep it safe before clearing your browser, save a backup file.</p>
<div class="q-actions"><button type="button" class="btn ghost sm" id="bk-save">Save a backup file</button><button type="button" class="btn ghost sm" id="bk-load">Load a backup file</button><input type="file" id="bk-file" accept=".json,application/json" hidden><button type="button" class="linkbtn" id="bk-clear">Clear all progress on this device</button></div>
<p class="tiny muted" id="bk-msg" aria-live="polite" style="margin:10px 0 0"></p></section>
</main>
<script>window.HUB=${payload};</script>
<script>
${js}
</script>
</body>
</html>
`;
  fs.mkdirSync(outDir(cj), { recursive:true });
  const out = path.join(outDir(cj), "index.html");
  fs.writeFileSync(out, html);
  return { out, bytes:Buffer.byteLength(html), nBuilt, total:data.modules.length };
}
async function main(){
  const a = process.argv.slice(2);
  if (!a.length) { console.error("Usage: node build/hub.mjs <course> | --all"); process.exit(2); }
  const list = a[0] === "--all" ? courses() : [a[0]];
  for (const c of list) { const r = await buildHub(c); console.log(`✓ ${c} hub → ${path.relative(ROOT, r.out)} (${kb(r.bytes)}; ${r.nBuilt} of ${r.total} modules available)`); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) main();
