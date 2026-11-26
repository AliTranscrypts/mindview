// Shared helpers for assemble.mjs, hub.mjs and check.mjs. Plain Node (no npm packages).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const ROOT = path.resolve(SRC, "..");
export const TOOLKIT = path.join(SRC, "toolkit");
export const VERSION = fs.readFileSync(path.join(TOOLKIT, "VERSION"), "utf8").trim();
export const FONTS = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=STIX+Two+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap";

export function loadCourse(course){
  const f = path.join(SRC, "courses", course, "course.json");
  if (!fs.existsSync(f)) throw new Error(`No course.json for "${course}" (${f})`);
  return JSON.parse(fs.readFileSync(f, "utf8"));
}
export function courses(){
  return fs.readdirSync(path.join(SRC, "courses")).filter(c => fs.existsSync(path.join(SRC, "courses", c, "course.json")));
}
export function moduleId(m){ return `${m.nn}-${m.slug}`; }
export function srcDir(course, m){ return path.join(SRC, "courses", course, moduleId(m)); }
export function outDir(cj){ return path.join(ROOT, "courses", cj.site, "modules"); }
export function outFile(cj, m){ return path.join(outDir(cj), moduleId(m) + ".html"); }
export function hasSource(course, m){ return fs.existsSync(path.join(srcDir(course, m), "content.mjs")); }
export function storageKey(cj, m, content){ return (content && content.storageKey) || `${cj.course}-${moduleId(m)}-v1`; }
export function progressKey(cj, m){ return `${cj.course}-progress-v1:${moduleId(m)}`; }
export function pickModules(cj, args){
  if (!args.length) return cj.modules;
  const want = args.map(a => String(a).padStart(2, "0"));
  const out = cj.modules.filter(m => want.includes(m.nn));
  const missing = want.filter(w => !out.some(m => m.nn === w));
  if (missing.length) throw new Error(`Unknown module number(s) for ${cj.course}: ${missing.join(", ")}`);
  return out;
}
export async function loadContent(course, m){
  const f = path.join(srcDir(course, m), "content.mjs");
  const mod = await import(pathToFileURL(f).href + "?t=" + Date.now() + Math.random());
  return mod.default;
}

// Same FNV-1a as toolkit/core/00-util.js (MV._fnv). Keep them identical.
export function fnv(str){
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return ("0000000" + h.toString(16)).slice(-8);
}
// Decision 7 (answers lightly scrambled): option {ok:true} -> {_n, _k}; item {answer:x} -> {_a: base64(xor(json, salt))}.
export function encodeAnswers(content, salt){
  let counter = 0;
  const enc = v => {
    const bytes = Buffer.from(JSON.stringify(v), "utf8");
    for (let i = 0; i < bytes.length; i++) bytes[i] ^= salt.charCodeAt(i % salt.length);
    return bytes.toString("base64");
  };
  const walk = o => {
    if (Array.isArray(o)) {
      const marks = o.some(x => x && typeof x === "object" && !Array.isArray(x) && Object.prototype.hasOwnProperty.call(x, "ok"));
      return o.map(x => {
        const y = walk(x);
        if (marks && y && typeof y === "object" && !Array.isArray(y)) {
          const flag = !!y.ok; delete y.ok;
          y._n = (counter++).toString(36) + fnv(salt + counter).slice(0, 3);
          y._k = fnv(salt + "|" + y._n + "|" + (flag ? 1 : 0));
        }
        return y;
      });
    }
    if (o && typeof o === "object") {
      const r = {};
      for (const k of Object.keys(o)) {
        if (k === "answer") r._a = enc(o[k]);
        else r[k] = walk(o[k]);
      }
      return r;
    }
    return o;
  };
  return walk(content);
}
export function readIf(f){ return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : ""; }
export function minJS(s){
  return s.split("\n").map(l => l.replace(/^\s+/, "")).filter(l => l && !l.startsWith("//")).join("\n");
}
export function minCSS(s){
  return s.replace(/\/\*[\s\S]*?\*\//g, "").split("\n").map(l => l.trim()).filter(Boolean).join("\n");
}
export function kb(n){ return (n / 1024).toFixed(1) + " KB"; }
