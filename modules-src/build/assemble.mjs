// Stitch the toolkit + one module's content.mjs/app.js/app.css into one self-contained page.
// Usage: node build/assemble.mjs <course> [NN ...]     (no NN = every module that has sources)
//        node build/assemble.mjs --all
// Output: <repo>/courses/<site>/modules/NN-slug.html
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { SRC, TOOLKIT, VERSION, FONTS, loadCourse, courses, moduleId, srcDir, outDir, outFile, hasSource, storageKey, progressKey,
  pickModules, loadContent, fnv, encodeAnswers, readIf, minJS, minCSS, kb } from "./lib.mjs";

// terser (devDependency) shrinks the inlined JS a lot; without it we fall back to the light whitespace/comment stripper.
let terser = null;
try { terser = createRequire(import.meta.url)("terser"); } catch (e) { terser = null; }
async function shrink(code, label){
  if (!code.trim()) return "";
  if (!terser) return minJS(code);
  try { const r = await terser.minify(code, { compress:{ passes:1 }, mangle:true, format:{ comments:false, ascii_only:false } }); return r.code; }
  catch (e) { throw new Error(label + ": JavaScript syntax error: " + e.message + (e.line ? " (line " + e.line + ", col " + e.col + ")" : "")); }
}
const coreJS = () => fs.readdirSync(path.join(TOOLKIT, "core")).filter(f => f.endsWith(".js")).sort().map(f => fs.readFileSync(path.join(TOOLKIT, "core", f), "utf8")).join("\n");
const baseCSS = () => ["tokens.css", "base.css"].map(f => fs.readFileSync(path.join(TOOLKIT, "css", f), "utf8")).join("\n");

// Components in toolkit/components/<name>.js are included when app.js mentions MV.<name> or content uses type:"<name>".
function components(appJS, contentJSON){
  const dir = path.join(TOOLKIT, "components");
  if (!fs.existsSync(dir)) return { js:"", css:"", names:[] };
  const names = fs.readdirSync(dir).filter(f => f.endsWith(".js")).map(f => f.slice(0, -3)).filter(n =>
    new RegExp("\\bMV\\." + n + "\\b").test(appJS) || contentJSON.includes('"type":"' + n + '"') || new RegExp("@uses\\s+.*\\b" + n + "\\b").test(appJS));
  // a component may declare others it needs:  // @needs other1 other2
  const all = new Set(names);
  let grew = true;
  while (grew) {
    grew = false;
    for (const n of [...all]) {
      const src = fs.readFileSync(path.join(dir, n + ".js"), "utf8"), m = src.match(/@needs\s+([\w\s]+)/);
      if (m) for (const d of m[1].trim().split(/\s+/)) if (!all.has(d) && fs.existsSync(path.join(dir, d + ".js"))) { all.add(d); grew = true; }
    }
  }
  const list = [...all].sort();
  return { names:list, js:list.map(n => fs.readFileSync(path.join(dir, n + ".js"), "utf8")).join("\n"), css:list.map(n => readIf(path.join(dir, n + ".css"))).join("\n") };
}

export async function assemble(course, m, opts = {}){
  const cj = loadCourse(course);
  const dir = srcDir(course, m), id = moduleId(m);
  if (!hasSource(course, m)) throw new Error(`${course} ${id}: no content.mjs in ${dir}`);
  const content = await loadContent(course, m);
  if (!content || typeof content !== "object") throw new Error(`${course} ${id}: content.mjs must export default an object`);
  if (content.id && content.id !== id) throw new Error(`${course} ${id}: content.id is "${content.id}", expected "${id}"`);
  const group = cj.groups.find(g => g.id === m.group) || { label:cj.groupLabel, name:"" };
  const appJS = readIf(path.join(dir, "app.js")), appCSS = readIf(path.join(dir, "app.css"));
  const salt = fnv(cj.course + ":" + id + ":mv");
  const meta = { id, nn:m.nn, slug:m.slug, course:cj.course, site:cj.site, code:cj.code, kind:content.kind || m.kind,
    groupLabel:group.label, groupName:group.name, trivium:m.trivium || "", size:m.size,
    storageKey:storageKey(cj, m, content), progressKey:progressKey(cj, m), toolkit:VERSION };
  const coursePayload = { course:cj.course, site:cj.site, code:cj.code, title:cj.title,
    modules:cj.modules.map(x => ({ nn:x.nn, slug:x.slug, title:x.title, kind:x.kind, group:x.group })) };
  const encoded = encodeAnswers({ ...content, kind:content.kind || m.kind, title:content.title || m.title }, salt);
  const payload = JSON.stringify({ meta, course:coursePayload, salt, content:encoded })
    .replace(/</g, "\\u003c").split(String.fromCharCode(0x2028)).join("\\u2028").split(String.fromCharCode(0x2029)).join("\\u2029");
  const comp = components(appJS, JSON.stringify(content));
  const courseCSS = readIf(path.join(TOOLKIT, "courses", cj.course + ".css")), courseJS = readIf(path.join(TOOLKIT, "courses", cj.course + ".js"));
  const title = (content.title || m.title).replace(/`/g, "").replace(/<[^>]+>/g, "");
  const themeKey = cj.course + "-theme";
  const toolJS = await shrink(coreJS() + "\n" + comp.js + "\n" + courseJS, "toolkit");
  const appMin = await shrink(appJS, id + "/app.js");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}: ${cj.code} Learning Module</title>
<!-- MindView module toolkit ${VERSION} | ${cj.course} ${id} | built from modules-src/ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<script>try{var t=localStorage.getItem("${themeKey}");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
<style>
${minCSS(baseCSS() + "\n" + comp.css + "\n" + courseCSS)}
${appCSS}
</style>
</head>
<body>
<div id="mv-root"><noscript><p>This module needs JavaScript turned on to work.</p></noscript></div>
<script>
${toolJS}
</script>
<script>window.MV_PAYLOAD=${payload};</script>
<script>
${appMin}
</script>
<script>MV.start();</script>
</body>
</html>
`;
  const out = outFile(cj, m);
  fs.mkdirSync(outDir(cj), { recursive:true });
  fs.writeFileSync(out, html);
  return { out, bytes:Buffer.byteLength(html), components:comp.names };
}

async function main(){
  const args = process.argv.slice(2);
  if (!args.length) { console.error("Usage: node build/assemble.mjs <course> [NN ...] | --all"); process.exit(2); }
  const jobs = [];
  if (args[0] === "--all") for (const c of courses()) { const cj = loadCourse(c); for (const m of cj.modules) if (hasSource(c, m)) jobs.push([c, m]); }
  else { const cj = loadCourse(args[0]); for (const m of pickModules(cj, args.slice(1))) if (hasSource(args[0], m) || args.length > 1) jobs.push([args[0], m]); }
  let fail = 0;
  for (const [c, m] of jobs) {
    try {
      const r = await assemble(c, m);
      console.log(`✓ ${c} ${moduleId(m)} → ${path.relative(path.resolve(SRC, ".."), r.out)} (${kb(r.bytes)}${r.components.length ? ", components: " + r.components.join(" ") : ""})${r.bytes > 300 * 1024 ? "  ⚠ over 300 KB" : ""}`);
    } catch (e) { fail++; console.error(`✗ ${c} ${moduleId(m)}: ${e.message}`); }
  }
  if (!jobs.length) console.log("Nothing to assemble (no module sources found).");
  process.exit(fail ? 1 : 0);
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) main();
