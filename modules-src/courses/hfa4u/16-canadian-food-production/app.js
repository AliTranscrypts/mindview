// HFA4U 16 Canadian Food Production: hero (map of Canada + lunch tray, August → January), Farm-to-table Canada (Explore: F9 food
// system map in three modes — region explorer, meal trace, shock mode — with a meal card, a readout and the P4 tomato emissions
// bars), Where did this meal come from? (Part 3: origin-claim cards with "Check it with data", a local vs national-and-global
// evaluation grid, an Ontario seasonal wheel) and "Canadian plate, any season" (task: month + 5 ingredients on a mini map).
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }
function arrowKeys(e){ return (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; }

// ---------- @component radioGroup (copied from HFA4U 12 / 09; "cf-" classes; options may carry an inline style `st`) ----------
//   radios(host, {label, aria, options:[{id, t, cls, st}], value, cls:"seg"|"chips"|<custom → class cf-<custom>>, onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "cf-chipset" : o.cls && o.cls !== "seg" ? "cf-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="cf-rgw">' + (lab ? '<span class="cf-rgl">' + lab + "</span>" : "") + '<span class="cf-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (x.st ? ' style="' + x.st + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- model data helpers (content.explore tables) ----------
function EX(){ return MV.C.explore; }
function ing(id){ return byId(EX().ingredients, id); }
function isCa(o){ return o !== "us"; }
function regT(id){ var r = byId(EX().regions, id); return r ? r.short : ""; }
function secT(id){ var s = byId(EX().sections, id); return s ? s.t : ""; }
function monthT(m){ var x = byId(EX().months, m); return x ? x.t : ""; }
function shockOf(id){ return byId(EX().shocks, id) || EX().shocks[0]; }
var REG_ORDER = ["pac", "pra", "cen", "atl", "nor"];
var ORIG_SHORT = { ca:"Canada", stored:"stored", frozen:"frozen", us:"US" };
// mealStats: the plan's readout and checklist rules (regions count Canadian ingredients in the chosen month only)
function mealStats(ids, m){
  var list = ids.map(ing).filter(Boolean), ca = list.filter(function(x){ return isCa(x[m]); }), imp = list.filter(function(x){ return !isCa(x[m]); });
  var regs = REG_ORDER.filter(function(r){ return ca.some(function(x){ return x.reg === r; }); }), secs = {};
  list.forEach(function(x){ secs[x.sec] = 1; });
  return { list:list, ca:ca, imp:imp, regs:regs, secs:secs, pra:list.filter(function(x){ return x.reg === "pra"; }), all3:!!(secs.vf && secs.grain && secs.protein) };
}
// effOf: the shock's model % change for one ingredient in month m, or null (see content: when "imported" / "aug")
function effOf(sh, it, m){
  if (!sh || !sh.eff) return null;
  var e = byId(sh.eff, it.id); if (!e) return null;
  if (sh.when === "imported" && isCa(it[m])) return null;
  if (sh.when === "aug" && m !== "aug") return null;
  return e;
}

// ---------- @component F9 foodMap — schematic map of Canada's five food regions plus a US band for imports (700 × 400 box;
// the hero adds a lunch tray at the right). Origin lines run from each ingredient's origin to the meal: solid = grown in
// Canada, dashed = imported, orange = hit by the shock. Regions: --ink-2 outlines with labels; selected or represented
// regions get the --hi-soft tint. Colour is never alone: line style, labels and the meal card carry the same facts. ----------
var GEO = {
  nor:{ d:"M30 118L28 78L58 60L96 66L128 46L170 54L204 36L246 46L280 30L318 40L352 22L392 32L428 16L468 28L506 20L540 34L566 56L582 84L580 118Z", lab:[305, 80] },
  pac:{ d:"M32 126H130V262H96L70 246L50 222L38 196L28 162Z", lab:[80, 146] },
  pra:{ d:"M138 126H318V262H138Z", lab:[228, 146] },
  cen:{ d:"M326 126H476V230L456 242L428 246L408 258L396 280L380 300L364 296L356 276L340 266L326 262Z", lab:[401, 146] },
  atl:{ d:"M484 150L536 136L578 150L580 226L556 256L508 262L486 244Z", lab:[532, 160] }
};
var USB = { x:30, y:316, w:452, h:72 };
var ANC = { bread:[206, 208], oats:[292, 188], lentils:[244, 236], beef:[166, 196], chicken:[350, 202], eggs:[388, 186], yogurt:[444, 208],
  salmon:[64, 206], potatoes:[522, 200], apples:[402, 232], blueberries:[548, 230], lettuce:[386, 276], strawberries:[364, 262], maple:[456, 176] };
var ANC_US = { lettuce:[62, 362], strawberries:[150, 352], oranges:[250, 372], rice:[346, 358] };
var PLATE = [650, 208];
var RICON = {
  pac:'<path d="M2 8c2.5-3 5-3 8 0s5.5 3 8 0M2 14c2.5-3 5-3 8 0s5.5 3 8 0"/>',
  pra:'<path d="M10 18V6M10 9C7 8 6 6 6 3c3 1 4 3 4 6zm0 0c3-1 4-3 4-6-3 1-4 3-4 6zm0 5c-3-1-4-3-4-6 3 1 4 3 4 6zm0 0c3-1 4-3 4-6-3 1-4 3-4 6z"/>',
  cen:'<path d="M3 18V9l7-5 7 5v9zM8 18v-5h4v5"/>',
  atl:'<path d="M2 10c3-4 8-4 11 0-3 4-8 4-11 0zM13 10l5-3v6z"/>',
  nor:'<path d="M10 2v16M3 6l14 8M3 14l14-8M8 3l2 2 2-2M8 17l2-2 2 2"/>'
};
function ricon(r){ return '<svg class="cf-ri" viewBox="0 0 20 20" aria-hidden="true">' + RICON[r] + "</svg>"; }
function qPt(a, c, e, t){ var u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * e[0], u * u * a[1] + 2 * u * t * c[1] + t * t * e[1]]; }
// quadratic origin line from a to e, drawn up to fraction p (de Casteljau split)
function lineD(a, e, p){
  var c = [(a[0] + e[0]) / 2, Math.min(a[1], e[1]) - 40];
  if (p >= 1) return "M" + f1(a[0]) + " " + f1(a[1]) + "Q" + f1(c[0]) + " " + f1(c[1]) + " " + f1(e[0]) + " " + f1(e[1]);
  var q = [lerp(a[0], c[0], p), lerp(a[1], c[1], p)], r = qPt(a, c, e, p);
  return "M" + f1(a[0]) + " " + f1(a[1]) + "Q" + f1(q[0]) + " " + f1(q[1]) + " " + f1(r[0]) + " " + f1(r[1]);
}
// o: {sel, lit:{reg:1}, glow (0..1), labels (region names as text), lines:[{a, e, imp, shock, p, label, tag, pulse}], plate:{n, max}, big}
function mapSVG(o){
  var h = "", fs = o.big ? 1.45 : 1;
  REG_ORDER.forEach(function(r){ h += '<path class="cf-reg' + (o.sel === r ? " sel" : o.lit && o.lit[r] ? " lit" : "") + '" d="' + GEO[r].d + '"/>'; });
  if (o.glow) REG_ORDER.forEach(function(r){ h += '<path class="cf-glow" style="opacity:' + f1(o.glow) + '" d="' + GEO[r].d + '"/>'; });
  h += '<rect class="cf-us" x="' + USB.x + '" y="' + USB.y + '" width="' + USB.w + '" height="' + USB.h + '" rx="10"/>' + svgT(USB.x + 10, USB.y + 17 * fs, "United States (imports)", "cf-ulab", "start", ' style="font-size:' + f1(13 * fs) + 'px"');
  if (o.labels) REG_ORDER.forEach(function(r){ h += svgT(GEO[r].lab[0], GEO[r].lab[1], regT(r), "cf-mlab", "middle", ' style="font-size:' + f1(14 * fs) + 'px"'); });
  var boxes = [], labs = "";
  (o.lines || []).forEach(function(L){
    var w = L.shock ? 3.4 + (L.pulse ? 3 * Math.sin(Math.PI * L.pulse) : 0) : 2.4;
    h += '<path class="cf-ln' + (L.imp ? " imp" : "") + (L.shock ? " shock" : "") + '" style="stroke-width:' + f1(w) + '" d="' + lineD(L.a, L.e, L.p == null ? 1 : L.p) + '"/>';
    h += '<circle class="cf-dot' + (L.imp ? " imp" : "") + (L.shock ? " shock" : "") + '" cx="' + f1(L.a[0]) + '" cy="' + f1(L.a[1]) + '" r="' + f1(5.5 * (o.big ? 1.3 : 1)) + '"/>';
    if (!L.label) return;
    // greedy placement: move a label down until it clears earlier labels
    var txt = L.label + (L.tag ? " " + L.tag : ""), wpx = txt.length * 7.4 * fs + 6, hp = 15 * fs, x = L.a[0] + 9, y = L.a[1] + 5, k = 0;
    if (x + wpx > 600) x = L.a[0] - 9 - wpx;
    function hit(){ return boxes.some(function(b){ return x < b[0] + b[2] && x + wpx > b[0] && y - hp < b[1] && y > b[1] - b[3]; }); }
    while (hit() && k < 5) { y += hp; k++; }
    boxes.push([x, y, wpx, hp]);
    labs += '<text class="cf-alab" x="' + f1(x) + '" y="' + f1(y) + '" style="font-size:' + f1(13 * fs) + 'px">' + esc(L.label) + (L.tag ? ' <tspan class="cf-tagt' + (L.shock ? " up" : "") + '">' + L.tag + "</tspan>" : "") + "</text>";
  });
  h += labs;
  if (o.plate) {
    var P = PLATE;
    h += '<circle class="cf-plate" cx="' + P[0] + '" cy="' + P[1] + '" r="32"/><circle class="cf-plate in" cx="' + P[0] + '" cy="' + P[1] + '" r="22"/>' +
      svgT(P[0], P[1] + 54 * (o.big ? 1.1 : 1), "Your meal", "cf-mlab", "middle", ' style="font-size:' + f1(14 * fs) + 'px"') + svgT(P[0], P[1] + 72 * (o.big ? 1.2 : 1), o.plate.n + " of " + o.plate.max, "cf-ulab", "middle", ' style="font-size:' + f1(13 * fs) + 'px"');
  }
  return h;
}
function plateEnd(i){ return [PLATE[0] - 34, PLATE[1] + (i - 2) * 9]; }
// lines for a meal (ids) in month m; fx = {prog:{id:0..1}, swing:{id, t}, pulse, hideTags, tagT}; sh = shock or null
function mealLines(ids, m, sh, fx){
  fx = fx || {};
  return ids.map(function(id, i){
    var it = ing(id), o = it[m], imp = !isCa(o), a = imp ? ANC_US[id] : ANC[id];
    if (fx.swing && fx.swing.id === id) a = [lerp(ANC[id][0], ANC_US[id][0], fx.swing.t), lerp(ANC[id][1], ANC_US[id][1], fx.swing.t)];
    var e = sh ? effOf(sh, it, m) : null, tag = "";
    if (sh && sh.id !== "none" && !fx.hideTags) tag = e ? "+" + Math.round(e.v * (fx.tagT == null ? 1 : fx.tagT)) + "%" : "0%";
    return { id:id, a:a, e:plateEnd(i), imp:imp, shock:!!e, p:fx.prog && fx.prog[id] != null ? fx.prog[id] : 1, pulse:fx.pulse || 0,
      label:it.short + (o === "stored" ? " (stored)" : o === "frozen" ? " (frozen)" : ""), tag:tag };
  });
}
function mapDescribe(ids, m, sh){
  if (!ids.length) return "No ingredients chosen yet.";
  return ids.map(function(id){
    var it = ing(id), o = it[m], e = sh ? effOf(sh, it, m) : null;
    return it.t + ": " + (isCa(o) ? EX().origins[o] + ", " + regT(it.reg) + ", solid line" : "imported from the United States, dashed line") + (sh && sh.id !== "none" ? ", model price change " + (e ? "+" + e.v + "%" : "0%") : "");
  }).join("; ") + ".";
}
function lineKeyHTML(withShock){
  function g(cls){ return '<svg class="cf-lk" viewBox="0 0 30 10" aria-hidden="true"><path class="cf-ln ' + cls + '" d="M1 5H29"/></svg>'; }
  return g("") + " grown in Canada · " + g("imp") + " imported" + (withShock ? " · " + g("shock") + " hit by the shock" : "");
}

// ---------- shared HTML: meal card (origin column) and readout rows ----------
function mealCardHTML(ids, m, sh, opts){
  opts = opts || {};
  if (!ids.length) return '<p class="tiny muted cf-empty">' + (opts.empty || "Tap ingredient chips to build a meal (up to 5).") + "</p>";
  var showSh = sh && sh.id !== "none";
  var h = '<div class="tbl-wrap"><table class="cf-meal"><caption>' + (opts.title || "Your meal") + " in " + monthT(m) + ' <span class="hfa-model">Model data</span></caption><thead><tr><th scope="col">Ingredient</th><th scope="col">Plate section</th><th scope="col">Origin</th>' + (showSh ? '<th scope="col">Price change</th>' : "") + "</tr></thead><tbody>";
  ids.forEach(function(id){
    var it = ing(id), o = it[m], e = showSh ? effOf(sh, it, m) : null, hot = opts.hot === id;
    h += '<tr class="' + it.sec + (hot ? " hot" : "") + (e ? " hit" : "") + '"><th scope="row">' + it.t + "</th><td>" + secT(it.sec) + '</td><td><svg class="cf-lk" viewBox="0 0 30 10" aria-hidden="true"><path class="cf-ln' + (isCa(o) ? "" : " imp") + (e ? " shock" : "") + '" d="M1 5H29"/></svg> ' + EX().origins[o] + (isCa(o) && it.reg ? '<span class="cf-reg-t">' + regT(it.reg) + "</span>" : "") + "</td>" +
      (showSh ? "<td>" + (opts.hideTags ? "…" : e ? "<strong>+" + Math.round(e.v * (opts.tagT == null ? 1 : opts.tagT)) + "%</strong>" + (e.note ? ' <span class="tiny">(' + e.note + ")</span>" : "") : "0%") + "</td>" : "") + "</tr>";
  });
  return h + "</tbody></table></div>";
}
function readRows(ids, m, sh){
  var R = EX().readLabels, st = mealStats(ids, m), n = st.list.length;
  var secs = [["grain", "Whole grains"], ["protein", "Protein foods"], ["vf", "Vegetables and fruits"]].map(function(s){ return secT(s[0]) + (st.secs[s[0]] ? " ✔" : ' <span class="muted">(missing)</span>'); }).join(" · ");
  var rows = [
    [R.ca, n ? st.ca.length + " of " + n : "none chosen yet"],
    [R.imp, st.imp.length ? st.imp.map(function(x){ return x.t + " (US)"; }).join(", ") : "none"],
    [R.regions, st.regs.length ? st.regs.map(regT).join(", ") : "none"],
    [R.secs, secs],
    [R.prairie, st.pra.length + (st.pra.length ? " (" + st.pra.map(function(x){ return x.short; }).join(", ") + ")" : "")]
  ];
  if (sh) {
    var eff = [];
    st.list.forEach(function(it){ var e = effOf(sh, it, m); if (e) eff.push(it.t + " +" + e.v + "%" + (e.note ? " (" + e.note + ")" : "")); });
    rows.push([R.shock, sh.id === "none" ? "none (no shock chosen)" : !n ? "none yet: add ingredients" : eff.length ? eff.join(", ") : (sh.when === "aug" && m !== "aug" ? sh.offNote : "No ingredient in this meal changes price.") ]);
    if (sh.id !== "none") rows.push([R.who, sh.who]);
  }
  return MV.readoutHTML(rows);
}

// ---------- @component mealChips — the ingredient chips, grouped by plate section, each with its origin in the chosen
// month; tap to add or remove (up to max). Section names are always shown; the coloured edge is a second signal. ----------
function mealChips(host, o){
  var msg = "";
  function paint(){
    var ids = o.get(), m = o.month(), D = EX();
    var h = '<p class="cf-rgl cf-mc">' + (o.label || "Ingredients") + " (" + ids.length + " of " + o.max + ")</p>" + D.sections.map(function(s){
      return '<div class="cf-sec ' + s.id + '"><span class="cf-sect">' + s.t + '</span><div class="cf-chips" role="group" aria-label="' + esc(s.t) + '">' + D.ingredients.filter(function(x){ return x.sec === s.id; }).map(function(x){
        var on = ids.indexOf(x.id) >= 0;
        return '<button type="button" class="cf-ing" data-ing="' + x.id + '" data-k="' + o.key + x.id + '" aria-pressed="' + on + '"><span aria-hidden="true">' + (on ? "✓" : "+") + "</span> " + x.t + ' <span class="cf-ot">· ' + ORIG_SHORT[x[m]] + "</span></button>";
      }).join("") + "</div></div>";
    }).join("") + '<div class="cf-brow"><button type="button" class="btn ghost sm" data-clear="1" data-k="' + o.key + 'clr"' + (ids.length ? "" : " disabled") + '>Clear meal</button><span class="tiny" aria-live="polite">' + msg + "</span></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.disabled) return;
    var ids = o.get().slice();
    if (b.dataset.clear) { msg = ""; o.set([]); paint(); if (o.onChange) o.onChange(null); var f = host.querySelector("[data-ing]"); if (f) f.focus({ preventScroll:true }); return; }
    var id = b.dataset.ing; if (!id) return;
    var k = ids.indexOf(id);
    if (k >= 0) { ids.splice(k, 1); msg = ""; o.set(ids); paint(); if (o.onChange) o.onChange(null); return; }
    if (ids.length >= o.max) { msg = o.full; paint(); return; }
    ids.push(id); msg = ""; o.set(ids); paint(); if (o.onChange) o.onChange(id);
  });
  paint();
  return { paint:paint };
}

// ---------- hero (storyboard: the tray appears; lines draw from the bread to the Prairies, the cheese to Ontario and Quebec,
// the apple to the Okanagan Valley and the lettuce to Ontario; the month flips from August to January and the lettuce's line
// swings south to California, dashed and "imported", while the apple's line stays put, "stored"). Reduced motion: the final
// frame, with both months' origins in the caption. ----------
var HT = [
  { t:"Bread", a:[208, 206], aug:"Prairies" },
  { t:"Cheese", a:[430, 212], aug:"Ontario and Quebec" },
  { t:"Apple", a:[98, 228], aug:"Okanagan Valley", jan:"Okanagan · stored" },
  { t:"Salad (lettuce)", a:[386, 276], b:[66, 356], aug:"Ontario", jan:"California · imported" }
];
function heroSVG(st, narrow){
  var h = "", fs = narrow ? 1.45 : 1, lines = [];
  HT.forEach(function(x, i){
    var a = x.b ? [lerp(x.a[0], x.b[0], st.m), lerp(x.a[1], x.b[1], st.m)] : x.a;
    var e = narrow ? [12 + i * 147 + 68, 420] : [612, 96 + i * 72 + 29];
    if (st.l[i] > 0) lines.push({ a:a, e:e, imp:!!x.b && st.m > 0, p:st.l[i] });
  });
  h += mapSVG({ glow:st.glow, labels:true, lines:lines, big:narrow });
  if (st.tray <= 0) return h;
  h += '<g style="opacity:' + f1(st.tray) + '">';
  var mon = function(cx, cy, size){ return '<g class="cf-hmon">' + svgT(cx, cy - 6 * st.m, "August", "cf-hm", "middle", ' style="opacity:' + f1(1 - st.m) + ";font-size:" + size + 'px"') + svgT(cx, cy + 6 * (1 - st.m), "January", "cf-hm", "middle", ' style="opacity:' + f1(st.m) + ";font-size:" + size + 'px"') + "</g>"; };
  if (narrow) {
    HT.forEach(function(x, i){
      var X = 12 + i * 147, sub = st.m > 0.5 && x.jan ? x.jan : x.aug;
      h += '<rect class="cf-tray" x="' + X + '" y="420" width="136" height="64" rx="10"/>' + svgT(X + 68, 446, x.t.replace(" (lettuce)", ""), "cf-ht", "middle", ' style="font-size:19px"') + svgT(X + 68, 472, sub.split(" · ")[0], "cf-hs", "middle", ' style="font-size:' + (sub.length > 14 ? 13.5 : 16) + 'px"');
      if (st.m > 0.5 && x.jan) h += svgT(X + 68, 506, x.jan.split(" · ")[1], "cf-htag", "middle", ' style="font-size:17px"');
    });
    h += mon(300, 546, 24);
  } else {
    h += svgT(682, 22, "Lunch tray", "cf-ht", "middle") + '<rect class="cf-tray mon" x="612" y="34" width="140" height="44" rx="8"/>' + mon(682, 63, 19);
    HT.forEach(function(x, i){
      var Y = 96 + i * 72, sub = st.m > 0.5 && x.jan ? x.jan : x.aug;
      h += '<rect class="cf-tray" x="612" y="' + Y + '" width="140" height="58" rx="8"/>' + svgT(682, Y + 24, x.t, "cf-ht", "middle") + svgT(682, Y + 45, sub, st.m > 0.5 && x.jan ? "cf-htag" : "cf-hs", "middle");
    });
  }
  return h + "</g>";
}
function hero(f){
  var host = $("#cf-hero"); if (!host) return;
  var Hc = MV.C.hero, st = { glow:0, tray:0, l:[0, 0, 0, 0], m:0 };
  host.innerHTML = '<svg class="cf-hsvg" viewBox="0 0 760 400" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function narrow(){ return (host.getBoundingClientRect().width || 760) < 520; }
  function draw(){ var nw = narrow(); svg.setAttribute("viewBox", nw ? "0 0 600 570" : "0 0 760 400"); svg.innerHTML = heroSVG(st, nw); }
  window.addEventListener("resize", draw);
  function cap(){ if (f.cap) { f.cap.textContent = Hc.caption; f.cap.classList.add("cf-cap"); } }
  if (MV.reduceMotion) { st.glow = 0.5; st.tray = 1; st.l = [1, 1, 1, 1]; st.m = 1; draw(); cap(); return; }
  draw();
  function line(i, done){ MV.tween({ dur:650, step:function(t){ st.l[i] = t; draw(); }, done:function(){ MV.wait(150, done); } }); }
  MV.wait(300, function(){
    MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ st.glow = t < 0.5 ? t * 2 : 1 - (t - 0.5); draw(); }, done:function(){
      MV.tween({ dur:500, step:function(t){ st.tray = t; draw(); }, done:function(){
        line(0, function(){ line(1, function(){ line(2, function(){ line(3, function(){
          MV.wait(700, function(){ MV.tween({ dur:1500, step:function(t){ st.m = t; draw(); }, done:cap }); });
        }); }); }); });
      } });
    } });
  });
}

// ---------- Explore: Farm-to-table Canada (@component F9 foodMap + mealChips + regionCards + tomato emissions bars) ----------
function regionCardHTML(D, S, fx){
  var r = byId(D.regions, S.region), k = 0;
  return '<div class="cf-rcard"><h4 class="cf-h4">' + ricon(r.id) + " " + r.t + ' <span class="hfa-model">Simplified summary</span></h4><p class="cf-lead"><strong>' + r.lead + ":</strong></p><ul class=\"cf-prods\">" +
    r.products.map(function(p){
      var show = false;
      if (p.sm) { show = S.smSeen || (fx.smN != null && k < fx.smN); k++; }
      return "<li" + (show ? ' class="sm"' : "") + ">" + p.t + (show ? ' <span class="cf-sm">' + D.smBadge + "</span>" : "") + "</li>";
    }).join("") + "</ul><p><strong>Why:</strong> " + r.why + "</p>" + (r.risk ? "<p><strong>Risk:</strong> " + r.risk + "</p>" : "") + (r.more ? '<p class="tiny">' + r.more + "</p>" : "") + "</div>";
}
function tomatoHTML(T, t){
  return '<div class="cf-tom"><h4 class="cf-h4">' + T.title + ' <span class="hfa-model">Model data</span></h4>' + T.items.map(function(x){
    var aria = x.t + ": " + (t > 0.5 ? T.parts.grow + " " + x.grow + ", " + T.parts.trans + " " + x.trans + " (model units, longer means more emissions)" : "one " + T.parts.total + " bar, not yet split");
    return '<div class="cf-tb"><p class="cf-tbt">' + x.t + '</p><div class="cf-tbar' + (t > 0 ? " split" : "") + '" role="img" aria-label="' + esc(aria) + '"><i class="g" style="width:' + x.grow + '%"></i><i class="t" style="width:' + x.trans + "%;margin-left:" + f1(6 * t) + 'px"></i></div>' +
      '<p class="tiny cf-tbl" style="opacity:' + f1(t) + '"><span class="cf-sw g" aria-hidden="true"></span>' + T.parts.grow + ' <span class="cf-sw t" aria-hidden="true"></span>' + T.parts.trans + "</p></div>";
  }).join("") + "</div>";
}
function explore(host, api){
  var D = api.content, S = api.S, anim = null, pend = null, timers = [], draws = {}, pulseStop = null;
  S.mode = byId(D.modes, S.mode) ? S.mode : "region";
  S.region = byId(D.regions, S.region) ? S.region : "cen";
  S.month = S.month === "jan" ? "jan" : "aug";
  S.meal = (Array.isArray(S.meal) ? S.meal : []).filter(ing).slice(0, 5);
  S.shock = byId(D.shocks, S.shock) ? S.shock : "none";
  var fx = { prog:{}, pulse:0, swing:null, smN:null, hideTags:false, tagT:1, tomato:null, hot:"" };

  host.innerHTML = '<div id="cf-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cf-lab" id="cf-lab" data-mv="graph"><div class="cf-main"><div class="cf-mapw" id="cf-mapw"><svg class="cf-map" id="cf-map" viewBox="0 0 700 400" role="img" aria-label="Map"></svg><div class="cf-rbtns" id="cf-rbtns"></div></div><p class="tiny cf-key" id="cf-key"></p>' +
    '<div id="cf-tom"></div><div id="cf-card"></div></div>' +
    '<div class="cf-side"><div class="cf-ctl" id="cf-ctl"><div id="cf-month"></div><div id="cf-shock"></div><div id="cf-build"></div></div><div id="cf-rc"></div><div id="cf-readw"><h4 class="cf-h4">Readout</h4><dl class="read" id="cf-read" aria-live="polite"></dl></div></div></div>' +
    '<p class="tiny muted cf-note">' + D.modelNote + "</p>";

  var modeRG = radios($("#cf-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; commit(); } });
  var monRG = radios($("#cf-month"), { label:"Month", options:D.months, value:S.month, onChange:function(v){ cancelAnim(); S.month = v; commit(); } });
  var shRG = radios($("#cf-shock"), { label:"Shock", cls:"chips", options:D.shocks, value:S.shock, onChange:function(v){ cancelAnim(); S.shock = v; commit(); pulse(); } });
  var regRG = radios($("#cf-rbtns"), { label:"", aria:"Region", cls:"rmap", value:S.region,
    options:REG_ORDER.map(function(r){ var g = GEO[r].lab; return { id:r, t:ricon(r) + "<span>" + regT(r) + "</span>", st:"left:" + f1(g[0] / 7) + "%;top:" + f1(g[1] / 4) + "%" }; }),
    onChange:function(v){ cancelAnim(); S.region = v; commit(); } });
  var chips = mealChips($("#cf-build"), { key:"ex", max:5, full:D.msgs.full, label:"Meal",
    get:function(){ return S.meal; }, set:function(ids){ cancelAnim(); S.meal = ids; }, month:function(){ return S.month; },
    onChange:function(added){ commit(); if (added) drawIn(added); } });

  function sh(){ return S.mode === "shock" ? shockOf(S.shock) : null; }
  function paintMap(){
    var reg = S.mode === "region", lit = {};
    if (!reg) mealStats(S.meal, S.month).regs.forEach(function(r){ lit[r] = 1; });
    var lines = reg ? [] : mealLines(S.meal, S.month, sh(), fx);
    if (!reg && fx.tomato) {
      var T = D.tomato;
      lines.push({ a:[378, 296], e:plateEnd(1), imp:false, label:"greenhouse tomatoes, 50 km" }, { a:[200, 340], e:plateEnd(3), imp:true, label:"field tomatoes, trucked 3000 km" });
      void T;
    }
    var svg = $("#cf-map");
    svg.innerHTML = mapSVG({ sel:reg ? S.region : "", lit:lit, labels:!reg, lines:lines, plate:reg ? null : { n:S.meal.length, max:5 } });
    svg.setAttribute("aria-label", reg ? "Map of Canada’s five food regions: Pacific, Prairies, Central, Atlantic and North, with the United States below. Selected: " + byId(D.regions, S.region).t + "." :
      "Map of Canada’s food regions with origin lines to your meal, " + monthT(S.month) + ". " + (fx.tomato ? "Greenhouse tomatoes from 50 km away (solid line) and field tomatoes trucked 3000 km (dashed line). " : "") + mapDescribe(S.meal, S.month, sh()));
  }
  function paintSide(){
    var reg = S.mode === "region";
    $("#cf-tom").innerHTML = !reg && fx.tomato ? tomatoHTML(D.tomato, fx.tomato.t) : "";
    $("#cf-rc").innerHTML = reg ? regionCardHTML(D, S, fx) : "";
    $("#cf-card").innerHTML = reg ? "" : mealCardHTML(S.meal, S.month, sh(), { hot:fx.hot, hideTags:fx.hideTags, tagT:fx.tagT });
    $("#cf-readw").hidden = reg;
    if (!reg) $("#cf-read").innerHTML = readRows(S.meal, S.month, sh());
  }
  function paint(){
    var reg = S.mode === "region";
    modeRG.set(S.mode); monRG.set(S.month); shRG.set(S.shock); regRG.set(S.region);
    $("#cf-month").hidden = reg; $("#cf-shock").hidden = S.mode !== "shock"; $("#cf-build").hidden = reg;
    $("#cf-rbtns").hidden = !reg; $("#cf-mapw").classList.toggle("region", reg); $("#cf-lab").classList.toggle("region", reg); $("#cf-ctl").hidden = reg;
    $("#cf-key").innerHTML = reg ? "Tap a region, or use the arrow keys, to see what it produces." : lineKeyHTML(S.mode === "shock");
    chips.paint(); paintMap(); paintSide();
  }
  function commit(){ fx.swing = null; fx.smN = null; fx.hideTags = false; fx.tagT = 1; fx.tomato = null; fx.hot = ""; api.save(); paint(); MV.changed(); }
  // cosmetic animations (reduced motion: lines appear without drawing, no pulse)
  function drawIn(id){
    if (MV.reduceMotion) return;
    fx.prog[id] = 0;
    draws[id] = MV.tween({ dur:450, step:function(t){ fx.prog[id] = t; paintMap(); }, done:function(){ delete fx.prog[id]; delete draws[id]; paintMap(); } });
  }
  function pulse(){
    if (MV.reduceMotion || S.shock === "none") return;
    if (pulseStop) pulseStop();
    pulseStop = MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ fx.pulse = t; paintMap(); }, done:function(){ pulseStop = null; fx.pulse = 0; paintMap(); } });
  }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  function finish(){ anim = null; timers = []; fx.swing = null; fx.smN = null; fx.hideTags = false; fx.tagT = 1; fx.pulse = 0; fx.hot = ""; api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){
    if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = [];
    Object.keys(draws).forEach(function(k){ draws[k](); delete draws[k]; }); fx.prog = {};
    if (pulseStop) { pulseStop(); pulseStop = null; } fx.pulse = 0;
    fx.swing = null; fx.smN = null; fx.hideTags = false; fx.tagT = 1; fx.hot = "";
    if (pend) { var d = pend; pend = null; d(); }
  }
  paint();

  // ===== target challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var M = D.msgs, ids = S.meal, n = ids.length, r = { ok:false };
    function has(list){ return list.some(function(x){ return ids.indexOf(x) >= 0; }); }
    if (id === "tc1") {
      if (n !== 4) r.msg = fill(M.count4, { n:n });
      else if (has(["lettuce", "strawberries"])) r.msg = M.janImp;
      else if (has(["oranges", "rice"])) r.msg = M.allYear;
      else if (ids.every(function(x){ return isCa(ing(x).jan); })) r = { ok:true };
    } else if (id === "tc2") {
      var salad = ["lettuce", "strawberries", "apples", "potatoes"];
      if (ids.some(function(x){ return salad.indexOf(x) < 0; })) r.msg = M.tc2Other;
      else if (has(["apples"])) r.msg = M.tc2Apples;
      else if (has(["potatoes"])) r.msg = M.tc2Potatoes;
      else if (n === 2) r = { ok:true };
      else r.msg = M.tc2Missing;
    } else if (id === "tc3") {
      var st = mealStats(ids, "jan");
      if (n !== 5) r.msg = fill(M.count5, { n:n });
      else if (has(["bread", "oats"])) r.msg = M.prairieGrain;
      else if (st.pra.length) r.msg = M.prairieOther;
      else if (st.imp.length >= 2) r.msg = M.twoImports;
      else if (!st.all3) r.msg = M.sections;
      else r = { ok:true };
    }
    return r;
  }

  // ===== predictions =====
  function reveal(el){ var b = el && el.getBoundingClientRect(); if (b && b.height && (b.top < 110 || b.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function target(){ var m = $("#cf-mapw"); return m && m.getBoundingClientRect().height ? m : $("#cf-card"); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx.tomato = null;
        if (p.id === "p1") { S.mode = "trace"; S.month = "aug"; S.meal = ["lettuce", "apples"]; S.shock = "none"; }
        else if (p.id === "p2") { S.mode = "region"; S.region = "cen"; S.smSeen = false; }
        else if (p.id === "p3") { S.mode = "shock"; S.meal = ["bread", "lentils", "chicken", "apples", "maple"]; S.shock = "drought"; fx.hideTags = true; }
        else if (p.id === "p4") { S.mode = "trace"; S.meal = []; fx.tomato = { t:0 }; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal(target());
          later(400, function(){
            S.month = "jan"; fx.swing = { id:"lettuce", t:0 }; fx.hot = "lettuce"; paint();
            anim = MV.tween({ dur:1500, step:function(t){ fx.swing.t = t; paintMap(); }, done:function(){ anim = null; later(300, finish); } });
          });
        } else if (p.id === "p2") {
          reveal($("#cf-rc"));
          fx.smN = 0; paintSide();
          var step = function(){ fx.smN++; paintSide(); if (fx.smN < 4) later(450, step); else { S.smSeen = true; later(400, finish); } };
          later(450, step);
        } else if (p.id === "p3") {
          reveal(target());
          later(300, function(){
            fx.hideTags = false; fx.tagT = 0;
            anim = MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ fx.tagT = t; fx.pulse = t; paintMap(); paintSide(); }, done:function(){ anim = null; finish(); } });
          });
        } else {
          reveal($("#cf-tom"));
          later(400, function(){ anim = MV.tween({ dur:1400, step:function(t){ fx.tomato.t = t; paintSide(); }, done:function(){ anim = null; finish(); } }); });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Where did this meal come from? (@component originStations — claim cards with "Check it with data",
// a local vs national-and-global evaluation grid with evidence chips, and @component seasonWheel) ----------
function wheelSVG(W, S){
  var cx = 160, cy = 160, h = "", T = 2 * Math.PI, M = W.msgs.months, pad = 0.02;
  function pol(r, a){ return f1(cx + r * Math.sin(a)) + " " + f1(cy - r * Math.cos(a)); }
  function arc(r, m0, m1){ var a0 = m0 / 12 * T + pad, a1 = (m1 + 1) / 12 * T - pad; if (m1 < m0) a1 += T; return "M" + pol(r, a0) + "A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + pol(r, a1); }
  h += '<circle class="cf-wout" cx="' + cx + '" cy="' + cy + '" r="150"/><circle class="cf-wout" cx="' + cx + '" cy="' + cy + '" r="128"/>';
  for (var k = 0; k < 12; k++) {
    var a = k / 12 * T, am = (k + 0.5) / 12 * T;
    h += '<path class="cf-wtick" d="M' + pol(128, a) + "L" + pol(150, a) + '"/>' + svgT(cx + 139 * Math.sin(am), cy - 139 * Math.cos(am) + 4.5, M[k], "cf-wm");
  }
  W.foods.forEach(function(f, i){
    var r = 114 - i * 17, st = S.wh[f.id], win = byId(W.windows, MV.ans(f));
    h += '<circle class="cf-wring" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
    if (st && st.placed) {
      if (f.ext) h += '<path class="cf-warc ext ' + (f.ext.t === "stored" ? "st" : "dn") + '" d="' + arc(r, f.ext.m[0], f.ext.m[1]) + '"/>';
      h += '<path class="cf-warc" d="' + arc(r, win.m[0], win.m[1]) + '"/>';
    }
    h += '<circle class="cf-wnb" cx="' + cx + '" cy="' + (cy - r) + '" r="7.5"/>' + svgT(cx, cy - r + 4, String(i + 1), "cf-wn");
  });
  return h + svgT(cx, cy + 4, "Ontario", "cf-wc");
}
function part3(host, api){
  var D = api.content, S = api.S, CL = D.claims, GR = D.grid, WH = D.wheel;
  S.st = byId(D.stations, S.st) ? S.st : "claims";
  S.cl = S.cl || {}; CL.cards.forEach(function(c){ S.cl[c.id] = S.cl[c.id] || { pick:"", tries:0, solved:false }; });
  S.gr = S.gr || {};
  S.wh = S.wh || {}; WH.foods.forEach(function(f){ S.wh[f.id] = S.wh[f.id] || { placed:false, tries:0 }; });
  S.wsel = byId(WH.foods, S.wsel) && !S.wh[S.wsel].placed ? S.wsel : "";
  var wmsg = null;
  host.innerHTML = '<div id="cf-stn"></div><p class="tiny" id="cf-stp" aria-live="polite"></p><div class="cf-st" id="cf-st-claims"></div><div class="cf-st" id="cf-st-grid" hidden></div><div class="cf-st" id="cf-st-wheel" hidden></div>';
  function done(id){
    if (id === "claims") return CL.cards.every(function(c){ return S.cl[c.id].solved; });
    if (id === "grid") return GR.criteria.every(function(c){ return !!S.gr[c.id]; });
    return WH.foods.every(function(f){ return S.wh[f.id].placed; });
  }
  function stLabels(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="cf-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  var stRG = radios($("#cf-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#cf-stp", host).textContent = "Stations finished: " + D.stations.filter(function(s){ return done(s.id); }).length + " of " + D.stations.length + ".";
  }

  // ===== Station 1: decode the origin claim =====
  var s1 = $("#cf-st-claims", host);
  s1.innerHTML = '<h4 class="cf-h4">' + CL.title + '</h4><div class="tbl-wrap"><table class="cf-rules"><caption>Origin claims <span class="hfa-model">Simplified rules</span></caption><thead><tr><th scope="col">Claim</th><th scope="col">Rule</th></tr></thead><tbody>' +
    CL.rules.map(function(r){ return "<tr><th scope=\"row\">“" + r.t + "”</th><td>" + r.rule + "</td></tr>"; }).join("") + "</tbody></table></div><p><strong>" + CL.ask + '</strong></p><div class="cf-cards">' +
    CL.cards.map(function(c, i){
      return '<article class="cf-pcard" data-card="' + c.id + '"><h5 class="cf-h5"><span class="cf-pn">' + (i + 1) + "</span> " + c.t + ' <span class="hfa-model">Practice model</span></h5><p>' + c.html + '</p><div class="cf-cq"></div>' +
        '<details class="alg cf-data"><summary>' + CL.msgs.data + '</summary><div class="tbl-wrap"><table class="cf-dtab"><thead><tr><th scope="col">Ingredient or step</th><th scope="col">Origin</th></tr></thead><tbody>' +
        c.data.map(function(d){ return '<tr><th scope="row">' + d[0] + "</th><td>" + d[1] + "</td></tr>"; }).join("") + "</tbody></table></div></details></article>";
    }).join("") + '</div><p class="cf-cdone" id="cf-cdone" aria-live="polite"></p>';
  function paintCard(c){
    var box = $('[data-card="' + c.id + '"] .cf-cq', s1), st = S.cl[c.id], ans = MV.ans(c);
    var h = '<div class="cf-chipset cf-claims" role="radiogroup" aria-label="' + esc("Claim for the " + lc(c.t)) + '">' + CL.rules.map(function(r, k){
      var on = st.pick === r.id, mark = on ? (st.solved ? " right" : " wrong") : "";
      return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!st.pick && k === 0) ? 0 : -1) + '" class="' + mark + '" data-claim="' + r.id + '" data-k="cl' + c.id + r.id + '"' + (st.solved ? " disabled" : "") + ">“" + r.t + "”</button>";
    }).join("") + "</div>";
    if (st.pick) h += st.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.why + (st.tries ? "" : "")) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (c.wrong[st.pick] || "") + " Try another claim.");
    void ans;
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paintClaims(){ CL.cards.forEach(paintCard); $("#cf-cdone", s1).innerHTML = done("claims") ? MV.fbHTML("good", "<strong>✓ " + CL.msgs.done + "</strong>") : ""; }
  s1.addEventListener("click", function(e){
    var b = e.target.closest("[data-claim]"); if (!b || b.disabled) return;
    var c = byId(CL.cards, b.closest("[data-card]").dataset.card), st = S.cl[c.id];
    st.pick = b.dataset.claim;
    if (st.pick === MV.ans(c)) st.solved = true; else st.tries++;
    api.save(); paintCard(c); paintClaims(); stRepaint(); MV.focusFb($('[data-card="' + c.id + '"] .cf-cq', s1));
  });
  s1.addEventListener("keydown", function(e){
    var c = e.target.closest && e.target.closest("[data-claim]"); if (!c) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var sib = $$("[data-claim]", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) nb.focus();
  });

  // ===== Station 2: two ways to get food to people (evaluation grid with evidence chips) =====
  var s2 = $("#cf-st-grid", host);
  s2.innerHTML = '<h4 class="cf-h4">' + GR.title + "</h4><p><strong>" + GR.ask + '</strong></p><div class="cf-sys"><p><span class="cf-sysk">Local</span> ' + GR.systems.local + '</p><p><span class="cf-sysk">National and global</span> ' + GR.systems.global + '</p></div><div class="cf-grid">' +
    GR.criteria.map(function(c){ return '<div class="cf-crit" data-cr="' + c.id + '"><h5 class="cf-h5">' + c.t + '</h5><div id="cf-cr-' + c.id + '"></div><div class="cf-crr" aria-live="polite"></div></div>'; }).join("") + '</div><div id="cf-gkey" aria-live="polite"></div>';
  GR.criteria.forEach(function(c){
    radios($("#cf-cr-" + c.id, s2), { label:"", aria:c.t + ": which system is stronger?", cls:"chips", options:GR.choices, value:S.gr[c.id] || "",
      onChange:function(v){ S.gr[c.id] = v; api.save(); paintGrid(); stRepaint(); } });
  });
  function chT(id){ var x = byId(GR.choices, id); return x ? x.t : ""; }
  function paintGrid(){
    var M = GR.msgs, n = 0, all = true;
    GR.criteria.forEach(function(c){
      var v = S.gr[c.id], box = $('[data-cr="' + c.id + '"] .cf-crr', s2), key = MV.ans(c);
      if (!v) { box.innerHTML = ""; all = false; return; }
      if (v === key) n++;
      box.innerHTML = '<p class="cf-evl"><strong>' + M.ev + ":</strong></p><ul class=\"cf-evs\">" + c.ev.map(function(x){ return '<li class="cf-ev">' + x + "</li>"; }).join("") + "</ul>" +
        (v === key ? MV.fbHTML("good", "<strong>✓ " + M.match + "</strong> " + M.model + ": " + lc(chT(key)) + ".") : MV.fbHTML("", fill(M.differ, { r:lc(chT(key)) })));
    });
    $("#cf-gkey", s2).innerHTML = all ? '<div class="refresh cf-keyidea"><h4>Key idea</h4><p>' + M.key + '</p><p class="tiny">Your ratings match the model ratings on ' + n + " of " + GR.criteria.length + " criteria.</p></div>" : "";
  }

  // ===== Station 3: in season in Ontario (seasonal wheel) =====
  var s3 = $("#cf-st-wheel", host);
  s3.innerHTML = '<h4 class="cf-h4">' + WH.title + "</h4><p><strong>" + WH.ask + '</strong></p><div class="cf-wl"><div class="cf-wctl"><p class="cf-rgl">Food</p><div id="cf-wfood"></div><p class="cf-rgl">Harvest window</p><div class="cf-chipset cf-wwin" id="cf-wwin" role="group" aria-label="Harvest window">' +
    WH.windows.map(function(w){ return '<button type="button" data-win="' + w.id + '" data-k="win' + w.id + '">' + w.t + "</button>"; }).join("") + '</div><div id="cf-wfb" aria-live="polite"></div></div>' +
    '<figure class="cf-wfig"><svg class="cf-wsvg" id="cf-wsvg" viewBox="0 0 320 320" role="img" aria-label="Seasonal wheel"></svg><figcaption class="tiny">Seasonal wheel for Ontario <span class="hfa-model">Model data</span></figcaption><ul class="cf-wleg" id="cf-wleg"></ul>' +
    '<p class="tiny cf-wkey"><svg class="cf-lk" viewBox="0 0 30 10" aria-hidden="true"><path class="cf-warc k" d="M1 5H29"/></svg> harvest · <svg class="cf-lk" viewBox="0 0 30 10" aria-hidden="true"><path class="cf-warc k ext st" d="M1 5H29"/></svg> stored · <svg class="cf-lk" viewBox="0 0 30 10" aria-hidden="true"><path class="cf-warc k ext dn" d="M1 5H29"/></svg> day-neutral varieties</p></figure></div>';
  function winT(id){ var w = byId(WH.windows, id); return w ? w.t : ""; }
  function paintWheel(){
    var fh = $("#cf-wfood", s3);
    MV.keepFocus(fh, function(){
      fh.innerHTML = '<div class="cf-chipset" role="group" aria-label="Food">' + WH.foods.map(function(f, i){
        var st = S.wh[f.id], on = S.wsel === f.id;
        return '<button type="button" data-food="' + f.id + '" data-k="wf' + f.id + '" aria-pressed="' + on + '"' + (st.placed ? " disabled" : "") + ">" + (st.placed ? "✓ " : "") + (i + 1) + ". " + f.t + (st.placed ? '<span class="vh"> (placed)</span>' : "") + "</button>";
      }).join("") + "</div>";
    });
    $$("[data-win]", s3).forEach(function(b){ b.disabled = done("wheel"); });
    $("#cf-wfb", s3).innerHTML = done("wheel") ? MV.fbHTML("good", "<strong>✓ " + WH.msgs.done + "</strong>") : wmsg ? MV.fbHTML(wmsg.kind, wmsg.html) : "";
    var svg = $("#cf-wsvg", s3); svg.innerHTML = wheelSVG(WH, S);
    var placed = WH.foods.filter(function(f){ return S.wh[f.id].placed; });
    svg.setAttribute("aria-label", "Seasonal wheel for Ontario, model data. " + (placed.length ? placed.map(function(f){ return f.t + ": " + winT(MV.ans(f)) + (f.ext ? ", then " + f.ext.t : ""); }).join("; ") + "." : "No foods placed yet."));
    $("#cf-wleg", s3).innerHTML = WH.foods.map(function(f, i){ var st = S.wh[f.id]; return "<li><strong>Ring " + (i + 1) + ":</strong> " + f.t + " — " + (st.placed ? winT(MV.ans(f)) + (f.ext ? " (" + f.ext.t + " shown too)" : "") : '<span class="muted">not placed yet</span>') + "</li>"; }).join("");
  }
  s3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.food) { S.wsel = b.dataset.food; wmsg = null; api.save(); paintWheel(); return; }
    if (b.dataset.win) {
      if (!S.wsel) { wmsg = { kind:"", html:WH.msgs.pick }; paintWheel(); return; }
      var f = byId(WH.foods, S.wsel), st = S.wh[f.id];
      if (b.dataset.win === MV.ans(f)) { st.placed = true; S.wsel = ""; wmsg = { kind:"good", html:"<strong>✓ Correct.</strong> " + f.t + ": " + f.why }; }
      else { st.tries++; wmsg = { kind:"bad", html:"<strong>✗ Not quite.</strong> " + f.hint + " Try another window." }; }
      api.save(); paintWheel(); stRepaint(); MV.focusFb($("#cf-wfb", s3));
    }
  });

  function paintAll(){ stRG.set(S.st); stRepaint(); D.stations.forEach(function(s){ $("#cf-st-" + s.id, host).hidden = s.id !== S.st; }); }
  paintClaims(); paintGrid(); paintWheel(); paintAll();
}

// ---------- Performance task: Canadian plate, any season (month toggle + mealChips + a mini F9 map with the readout) ----------
var task = (function(){
  var api = null, mRG = null, chips = null;
  function TK(){ return MV.C.task; }
  function read(){ var s = (api && api.S) || {}; return { m:s.m === "aug" ? "aug" : "jan", meal:(Array.isArray(s.meal) ? s.meal : []).filter(ing).slice(0, 5) }; }
  function checks(d){ var st = mealStats(d.meal, d.m); return [st.ca.length >= 4, st.all3, st.regs.length >= 3, st.pra.length <= 1]; }
  function keyOf(d){ var I = EX().ingredients.map(function(x){ return x.id; }); return d.m + ":" + d.meal.slice().sort(function(a, b){ return I.indexOf(a) - I.indexOf(b); }).join(","); }
  function fromKey(k){ var q = k.split(":"); return { m:q[0], meal:q[1] ? q[1].split(",") : [] }; }
  function text(k){ var d = fromKey(k); return monthT(d.m) + ": " + d.meal.map(function(id){ var x = ing(id); return x ? lc(x.t) : id; }).join(", "); }
  function paint(){
    var d = read(), pv = $("#cf-tkpv"); if (!pv) return;
    mRG.set(d.m); chips.paint();
    var aria = "Map of Canada’s food regions with origin lines to your meal, " + monthT(d.m) + ". " + mapDescribe(d.meal, d.m, null);
    pv.innerHTML = '<div class="cf-tkmap"><svg class="cf-map cf-big" viewBox="0 0 700 400" role="img" aria-label="' + esc(aria) + '">' +
      mapSVG({ lit:(function(){ var o = {}; mealStats(d.meal, d.m).regs.forEach(function(r){ o[r] = 1; }); return o; })(), labels:true, lines:mealLines(d.meal, d.m, null, {}), plate:{ n:d.meal.length, max:5 }, big:true }) +
      '</svg><p class="tiny cf-key">' + lineKeyHTML(false) + "</p></div>" + mealCardHTML(d.meal, d.m, null, { title:"Your plate", empty:"Choose a month and 5 ingredients." }) +
      '<dl class="read cf-tkread">' + readRows(d.meal, d.m, null) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S; s.m = s.m === "aug" ? "aug" : "jan"; s.meal = read().meal;
      inp.innerHTML = '<div class="cf-tin"><div id="cf-tkm"></div><div id="cf-tkc"></div></div>';
      mRG = radios($("#cf-tkm"), { label:"Month", options:EX().months, value:s.m, onChange:function(v){ s.m = v; a.save(); paint(); a.update(); } });
      chips = mealChips($("#cf-tkc"), { key:"tk", max:5, full:EX().msgs.full, label:"Ingredients", get:function(){ return read().meal; }, set:function(ids){ s.meal = ids; }, month:function(){ return read().m; },
        onChange:function(){ a.save(); paint(); a.update(); } });
      pv.innerHTML = '<div class="cf-tpv" id="cf-tkpv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.meal.length === 5 ? true : fill(TK().validMsg, { n:d.meal.length }); },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(text(k)); },
    text:text
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
