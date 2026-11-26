// HFA4U course helpers (toolkit/courses/hfa4u.js). The assembler adds this file to every HFA4U module (site course HFA4M),
// after the core. Course plan §3 conventions. Calculator-free: these feed readouts; questions still use clean numbers.
// Usage:
//   MV.nutri.KCAL        {carb:4, fat:9, protein:4, alcohol:7} kcal per gram. MV.nutri.KJ = 4.184 (1 kcal = 4.184 kJ).
//   MV.nutri.kcal(carb, fat, protein, alcohol)   energy in kcal from grams (missing or blank values count as 0).
//                        kcal(30, 10, 5) -> 30·4 + 10·9 + 5·4 = 230. Alcohol appears only as a fact, never as a youth context.
//   MV.nutri.pctEnergy(part, total, dp)          % of energy, part and total in kcal, rounded to dp (default 0); null if total is 0.
//   MV.nutri.pctDV(amount, dv, dp)               % Daily Value (amount and dv in the same unit), rounded to dp (default 0).
//   MV.nutri.dvLevel(pct)                        "a little" (5% or less), "a lot" (15% or more) or "" (in between).
//   MV.nutri.amdr(nutrient, age)                 AMDR as [lo, hi] % of energy for "carb" | "fat" | "protein" (course plan §3:
//                        carb 45–65 all ages; fat 25–35 ages 4–18, 20–35 adults; protein 10–30 ages 4–18, 10–35 adults).
//                        Teacher note: values from Health Canada's DRI tables, verify before release.
//   MV.nutri.apa(refs, narrative)                APA 7 in-text citation. refs: {author, year} or an array of them.
//                        apa({author:"Health Canada", year:2019}) -> "(Health Canada, 2019)"; narrative:true -> "Health Canada (2019)";
//                        apa([a, b]) -> "(Davison, 1983; Health Canada, 2019)" (sorted by author, as APA asks).
//   MV.nutri.apaRef(ref)                         APA 7 reference-list entry (HTML) for <ul class="hfa-refs">.
//                        Report or web page: {author, year, title, source}  -> "Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada."
//                        Journal article: {author, year, title, journal, volume, issue, pages}
//                                         -> "Davison, W. P. (1983). The third-person effect in communication. <i>Public Opinion Quarterly, 47</i>(1), 1–15."
//                        Optional url / doi are printed as plain text (pages make no outside connections).
//   MV.kitchenCard(title, lines, opts)           saves a "kitchen card" as a .txt download (printing is blocked on the site).
//                        lines: array of strings; a line starting "## " is a section heading, "- " a bullet. opts: {file, footer}.
//                        Returns true if the download started.
//   MV.kitchenCardButton(host, {title, lines | lines(), label, file, footer})   renders <div class="hfa-kc"> with a download
//                        button and a status line into host; lines may be a function, read at click time. Returns {click()}.
(function(){
"use strict";
var MV = window.MV; if (!MV) return;

// ---------- energy and Daily Values ----------
function n(v){ v = +v; return isFinite(v) ? v : 0; }
function round(v, dp){ var p = Math.pow(10, dp == null ? 0 : dp); return Math.round(v * p) / p; }
var KCAL = { carb:4, fat:9, protein:4, alcohol:7 };
MV.nutri = {
  KCAL:KCAL, KJ:4.184,
  kcal:function(carb, fat, protein, alcohol){ return n(carb) * KCAL.carb + n(fat) * KCAL.fat + n(protein) * KCAL.protein + n(alcohol) * KCAL.alcohol; },
  pctEnergy:function(part, total, dp){ return n(total) ? round(n(part) / n(total) * 100, dp) : null; },
  pctDV:function(amount, dv, dp){ return n(dv) ? round(n(amount) / n(dv) * 100, dp) : null; },
  dvLevel:function(pct){ if (pct == null || !isFinite(pct)) return ""; return pct <= 5 ? "a little" : pct >= 15 ? "a lot" : ""; },
  // Teacher note: AMDR values from course plan §3 (Health Canada DRI tables), verify before release.
  amdr:function(nutrient, age){
    var kid = age != null && age >= 4 && age <= 18;
    if (nutrient === "carb") return [45, 65];
    if (nutrient === "fat") return kid ? [25, 35] : [20, 35];
    if (nutrient === "protein") return kid ? [10, 30] : [10, 35];
    return null;
  }
};

// ---------- APA 7 ----------
MV.nutri.apa = function(refs, narrative){
  var list = (Array.isArray(refs) ? refs : [refs]).filter(Boolean).slice().sort(function(a, b){ return String(a.author).localeCompare(String(b.author)); });
  if (narrative) return list.map(function(r){ return r.author + " (" + (r.year || "n.d.") + ")"; }).join(" and ");
  return "(" + list.map(function(r){ return r.author + ", " + (r.year || "n.d."); }).join("; ") + ")";
};
MV.nutri.apaRef = function(r){
  var e = MV.esc, a = e(r.author || ""), out = a + (/\.$/.test(a) ? " " : ". ") + "(" + e(r.year || "n.d.") + "). ";
  if (r.journal) {
    out += e(r.title) + ". <i>" + e(r.journal) + (r.volume ? ", " + e(r.volume) : "") + "</i>" + (r.issue ? "(" + e(r.issue) + ")" : "") + (r.pages ? ", " + e(String(r.pages).replace(/-/g, "–")) : "") + ".";
  } else {
    out += "<i>" + e(r.title || "") + "</i>." + (r.source && r.source !== r.author ? " " + e(r.source) + "." : "");
  }
  if (r.doi) out += " https://doi.org/" + e(r.doi);
  else if (r.url) out += " " + e(r.url);
  return out;
};

// ---------- kitchen cards (downloads; printing is blocked on the site) ----------
function slug(s){ return String(s || "card").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "card"; }
MV.kitchenCard = function(title, lines, opts){
  opts = opts || {};
  var t = MV.plain(title || "Kitchen card"), rule = new Array(Math.min(60, Math.max(24, t.length + 4))).join("=");
  var body = (lines || []).map(function(l){
    l = MV.plain(String(l == null ? "" : l));
    if (/^##\s*/.test(l)) return "\n" + l.replace(/^##\s*/, "").toUpperCase();
    if (/^-\s+/.test(l)) return "  • " + l.replace(/^-\s+/, "");
    return l;
  });
  var meta = MV.meta || {}, foot = opts.footer != null ? opts.footer :
    "Plan made in " + (meta.code || "HFA4M") + (meta.groupLabel ? ", " + meta.groupLabel : "") + (MV.C && MV.C.title ? ": " + MV.plain(MV.C.title) : "") +
    ". Cook in the school kitchen or at home with an adult, as your teacher arranges.";
  var text = ["KITCHEN CARD", t, rule].concat(body, ["", rule, foot, ""]).join("\n");
  return MV.download(opts.file || ("kitchen-card-" + slug(t) + ".txt"), text);
};
MV.kitchenCardButton = function(host, o){
  o = o || {};
  host.innerHTML = '<div class="hfa-kc"><button type="button" class="btn ghost sm" data-k="hfakc">' + (o.label || "Save the kitchen card") + '</button><span class="tiny muted" aria-live="polite"></span></div>';
  var btn = host.querySelector("button"), st = host.querySelector("span");
  function click(){
    var lines = typeof o.lines === "function" ? o.lines() : o.lines;
    var ok = MV.kitchenCard(typeof o.title === "function" ? o.title() : o.title, lines, { file:o.file, footer:o.footer });
    st.textContent = ok ? "Saved as a text file. Take it to the kitchen." : "Saving didn’t work in this browser.";
    return ok;
  }
  btn.addEventListener("click", click);
  return { click:click };
};
})();
