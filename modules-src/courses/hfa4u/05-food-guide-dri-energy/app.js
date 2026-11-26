// HFA4U 05 Canada's Food Guide, DRIs & Energy Balance: hero (1942 rules → 1992 rainbow → 2007 chart → 2019 plate and
// habits), Plate and scale (Explore: F2 plate builder, F1 persona DRI analyser with the optional private "My own day",
// F5 energy balance scale with Rui's activity panel, N13-style history and world timeline; predictions; challenges),
// Modify a recipe (Part 3: swap chips, readouts, "Check it with data" panel, kitchen card download), "Evidence, history
// and the world" (custom practice), "Rui's plate" task. Plan wording lives in content.mjs; this file adds control labels.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function byId(list, id){ return (list || []).filter(function(x){ return x.id === id; })[0]; }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function cap1(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function nm(v, dp){ return MV.num(v, dp == null ? 1 : dp); }
function money(c){ return "$" + (c / 100).toFixed(2); }
function T(x, y, s, cls, anchor){ return '<text class="' + (cls || "fg-st") + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }
function pt(cx, cy, r, a){ return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }       // a: radians clockwise from 12 o'clock
function arcD(cx, cy, r, a0, a1){ var p = pt(cx, cy, r, a0), q = pt(cx, cy, r, a1); return "M" + f1(p[0]) + " " + f1(p[1]) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + f1(q[0]) + " " + f1(q[1]); }
function wedgeD(cx, cy, r, a0, a1){ var p = pt(cx, cy, r, a0), q = pt(cx, cy, r, a1); return "M" + cx + " " + cy + " L" + f1(p[0]) + " " + f1(p[1]) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + f1(q[0]) + " " + f1(q[1]) + "Z"; }
var D2R = Math.PI / 180;
// split a label onto at most two lines near the middle space
function two(s){ s = String(s); if (s.length <= 10) return [s]; var m = Math.floor(s.length / 2), a = s.lastIndexOf(" ", m), b = s.indexOf(" ", m), k = a < 0 ? b : b < 0 ? a : (m - a <= b - m ? a : b); return k < 0 ? [s] : [s.slice(0, k), s.slice(k + 1)]; }
function lines(x, y, arr, cls, dy, anchor){ var h = ""; arr.forEach(function(s, i){ h += T(x, y + (i - (arr.length - 1) / 2) * (dy || 10), s, cls, anchor); }); return h; }
// standard normal CDF (Abramowitz–Stegun 7.1.26)
function phi(z){ var t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2); return z >= 0 ? (1 + y) / 2 : (1 - y) / 2; }

// ---------- @component radioGroup (copied from HFA4U 04 / 03; adds a per-option class) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, off(ids), repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), offs = {};
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="fg-rgw">' + (lab ? '<span class="fg-rgl">' + lab + "</span>" : "") + '<span class="fg-rg ' + (o.cls === "chips" ? "fg-chipset" : "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (offs[x.id] ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }); if (!ids.length) return;
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : (k + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// ---------- @component guideShapes — schematic food-guide drawings in a 200 × 200 box (hero and history mode) ----------
//   Every section carries a word; colours follow course plan §4 (plate: --leaf, brown, magenta; milk groups cerulean).
var CLS = { vf:"fg-cvf", gr:"fg-cgr", pf:"fg-cpf", mk:"fg-cmk", nt:"fg-cnt", wa:"fg-cwa" };
function cardSVG(title, items){
  var h = '<rect class="fg-ccard" x="28" y="14" width="144" height="172" rx="6"/>' + lines(100, 36, title, "fg-stt", 13);
  h += '<line class="fg-crule" x1="40" y1="56" x2="160" y2="56"/>';
  items.forEach(function(s, i){ var y = 74 + i * 22; h += '<circle class="fg-cdot" cx="46" cy="' + (y - 3) + '" r="3"/>' + T(56, y, s, "fg-st", "start"); });
  return h;
}
function circleSVG(){
  var cx = 100, cy = 108, r = 72, Q = [["mk", ["Milk and", "milk products"]], ["gr", ["Breads and", "cereals"]], ["pf", ["Meat, fish,", "poultry,", "alternates"]], ["vf", ["Fruits and", "vegetables"]]];
  var h = T(100, 22, "Canada’s Food Guide", "fg-stt");
  Q.forEach(function(q, i){ var a0 = i * 90 * D2R, a1 = (i + 1) * 90 * D2R, m = pt(cx, cy, r * 0.52, (a0 + a1) / 2); h += '<path class="' + CLS[q[0]] + '" d="' + wedgeD(cx, cy, r, a0, a1) + '"/>' + lines(m[0], m[1] + 3, q[1], "fg-sts", 10); });
  return h;
}
function rainbowSVG(){
  var cx = 100, cy = 150, B = [["gr", "Grain products"], ["vf", "Vegetables and fruit"], ["mk", "Milk products"], ["pf", "Meat and alternatives"]], h = lines(100, 22, ["Canada’s Food Guide", "to Healthy Eating"], "fg-stt", 13);
  B.forEach(function(b, i){ var ro = 88 - i * 18, ri = ro - 16;
    h += '<path class="' + CLS[b[0]] + '" d="M' + (cx - ro) + " " + cy + " A" + ro + " " + ro + " 0 0 1 " + (cx + ro) + " " + cy + " L" + (cx + ri) + " " + cy + " A" + ri + " " + ri + " 0 0 0 " + (cx - ri) + " " + cy + 'Z"/>';
    var lx = i % 2 ? 106 : 14, ly = 168 + Math.floor(i / 2) * 16; h += '<rect class="' + CLS[b[0]] + '" x="' + lx + '" y="' + (ly - 8) + '" width="9" height="9"/>' + T(lx + 13, ly, b[1], "fg-sts", "start"); });
  return h;
}
function chartSVG(){
  // VERIFY: 2007 servings for women 19–50 (vegetables and fruit 7–8, grain products 6–7, milk and alternatives 2, meat and alternatives 2)
  var R = [["vf", "Vegetables and Fruit", 7, "7–8"], ["gr", "Grain Products", 6, "6–7"], ["mk", "Milk and Alternatives", 2, "2"], ["pf", "Meat and Alternatives", 2, "2"]], h = lines(100, 22, ["Eating Well with", "Canada’s Food Guide"], "fg-stt", 13);
  R.forEach(function(r, i){ var y = 62 + i * 30; h += T(18, y, r[1] + ": " + r[3], "fg-sts", "start"); for (var k = 0; k < r[2]; k++) h += '<circle class="' + CLS[r[0]] + '" cx="' + (24 + k * 15) + '" cy="' + (y + 11) + '" r="5.5"/>'; });
  return h + T(100, 190, "Servings a day: women 19–50", "fg-sts");
}
function plateSVG(o){
  o = o || {}; var cx = o.cx || 88, cy = o.cy || 110, r = o.r || 64, h = o.noTitle ? "" : T(100, 22, "Canada’s Food Guide", "fg-stt");
  h += '<circle class="fg-crim" cx="' + cx + '" cy="' + cy + '" r="' + (r + 7) + '"/>';
  h += '<path class="fg-cvf" d="' + wedgeD(cx, cy, r, Math.PI, 2 * Math.PI) + '"/><path class="fg-cgr" d="' + wedgeD(cx, cy, r, 0, Math.PI / 2) + '"/><path class="fg-cpf" d="' + wedgeD(cx, cy, r, Math.PI / 2, Math.PI) + '"/>';
  h += lines(cx - r * 0.5, cy + 3, ["vegetables", "and fruits"], "fg-st", 11) + lines(cx + r * 0.4, cy - r * 0.38, ["whole", "grains"], "fg-st", 10) + lines(cx + r * 0.4, cy + r * 0.42, ["protein", "foods"], "fg-st", 10);
  if (!o.noGlass) { var gx = o.gx || 172, gy = o.gy || 130; h += glassSVG(gx, gy, "water"); }
  return h;
}
function glassSVG(x, y, label, cls){ return '<path class="' + (cls || "fg-cwa") + '" d="M' + (x - 11) + " " + (y - 20) + " L" + (x + 11) + " " + (y - 20) + " L" + (x + 8) + " " + (y + 18) + " L" + (x - 8) + " " + (y + 18) + 'Z"/><line class="fg-cglass" x1="' + (x - 11) + '" y1="' + (y - 10) + '" x2="' + (x + 11) + '" y2="' + (y - 10) + '"/>' + (label ? T(x, y + 30, label, "fg-st") : ""); }
function topSVG(){
  var h = T(100, 16, "Japan (2005)", "fg-stt") + '<line class="fg-caxis" x1="100" y1="30" x2="100" y2="190"/>', Y = [44, 80, 112, 140, 172];
  function hw(y){ return 72 * (172 - y) / 128; }
  var B = [["gr", ["grain dishes"]], ["vf", ["vegetable dishes"]], ["pf", ["fish, egg and", "meat dishes"]]];
  B.forEach(function(b, i){ var y0 = Y[i], y1 = Y[i + 1]; h += '<path class="' + CLS[b[0]] + '" d="M' + f1(100 - hw(y0)) + " " + y0 + " L" + f1(100 + hw(y0)) + " " + y0 + " L" + f1(100 + hw(y1)) + " " + y1 + " L" + f1(100 - hw(y1)) + " " + y1 + 'Z"/>' + lines(100, (y0 + y1) / 2 + 3, b[1], "fg-sts", 9); });
  var y0 = Y[3], y1 = Y[4];
  h += '<path class="fg-cmk" d="M' + f1(100 - hw(y0)) + " " + y0 + " L100 " + y0 + " L100 " + y1 + 'Z"/><path class="fg-cvf" d="M100 ' + y0 + " L" + f1(100 + hw(y0)) + " " + y0 + " L100 " + y1 + 'Z"/>';
  h += T(74, y0 + 12, "milk", "fg-sts") + T(126, y0 + 12, "fruit", "fg-sts");
  h += '<line class="fg-caxis" x1="100" y1="172" x2="100" y2="190"/>' + T(108, 188, "water or tea (axis)", "fg-sts", "start");
  h += '<path class="fg-cstring" d="M168 46 q 8 -10 16 -2 t 12 -6"/>' + T(178, 30, "snacks", "fg-sts");
  // running figure on top
  h += '<g class="fg-crun"><circle cx="100" cy="23" r="3.2"/><path d="M100 26 L98 34 M99 29 L104 31 M99 29 L95 30 M98 34 L102 40 M98 34 L94 39"/></g>';
  return h;
}
function brazilSVG(){
  var h = T(100, 18, "Brazil (2014)", "fg-stt");
  h += '<rect class="fg-cvf" x="18" y="32" width="164" height="62" rx="6"/>' + lines(100, 63, ["natural or minimally processed", "foods: the basis of meals"], "fg-st", 12);
  h += '<rect class="fg-cnt" x="36" y="102" width="128" height="34" rx="6"/>' + lines(100, 119, ["processed foods:", "limit"], "fg-sts", 10);
  h += '<rect class="fg-cnt fg-cdash" x="54" y="144" width="92" height="26" rx="6"/>' + T(100, 160, "ultra-processed: avoid", "fg-sts");
  return h + T(100, 190, "cook · eat with others · question ads", "fg-sts");
}
function myplateSVG(){
  var cx = 88, cy = 110, r = 64, h = T(100, 18, "MyPlate (2011)", "fg-stt");
  h += '<circle class="fg-crim" cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '"/>';
  var Q = [["gr", "grains", 0], ["pf", "protein", 1], ["vf", "vegetables", 2], ["vf", "fruits", 3]];
  Q.forEach(function(q){ var a0 = q[2] * 90 * D2R, a1 = a0 + 90 * D2R, m = pt(cx, cy, r * 0.5, (a0 + a1) / 2); h += '<path class="' + CLS[q[0]] + '" d="' + wedgeD(cx, cy, r, a0, a1) + '"/>' + T(m[0], m[1] + 3, q[1], "fg-sts"); });
  return h + '<circle class="fg-cmk" cx="172" cy="58" r="16"/>' + T(172, 61, "dairy", "fg-sts");
}
function pyramidSVG(){
  var h = T(100, 14, "Mediterranean pyramid", "fg-stt"), Y = [26, 58, 92, 120, 152, 184];
  function hw(y){ return 84 * (y - 26) / 158; }
  var B = [["pf", null], ["mk", ["poultry, eggs,", "dairy"]], ["pf", ["fish often"]], ["vf", ["vegetables, fruits, whole", "grains, olive oil, beans, nuts"]], ["nt", ["be active; enjoy meals", "with others"]]];
  B.forEach(function(b, i){ var y0 = Y[i], y1 = Y[i + 1]; h += '<path class="' + CLS[b[0]] + '" d="M' + f1(100 - hw(y0)) + " " + y0 + " L" + f1(100 + hw(y0)) + " " + y0 + " L" + f1(100 + hw(y1)) + " " + y1 + " L" + f1(100 - hw(y1)) + " " + y1 + 'Z"/>' + (b[1] ? lines(100, (y0 + y1) / 2 + 3, b[1], "fg-sts", 9) : ""); });
  // the top tier is too narrow for words: label it beside the pyramid
  return h + '<line class="fg-crule" x1="108" y1="46" x2="124" y2="46"/>' + lines(127, 47, ["meats and sweets:", "less often"], "fg-sts", 9, "start");
}
var SHAPE = {
  rules:function(){ return cardSVG(["Canada’s Official", "Food Rules"], ["Milk", "Fruits", "Vegetables", "Cereals and bread", "Meat or fish"]); },
  // VERIFY: 1961 group names on the card
  guide:function(){ return cardSVG(["Canada’s", "Food Guide"], ["Milk", "Fruits", "Vegetables", "Bread and cereals", "Meat and fish"]); },
  circle:circleSVG, rainbow:rainbowSVG, chart:chartSVG, plate:function(){ return plateSVG(); },
  top:topSVG, brazil:brazilSVG, myplate:myplateSVG, pyramid:pyramidSVG
};

// ---------- habit icons (24 × 24 line glyphs in currentColor) ----------
var ICON = {
  pot:'<path d="M4 10h16v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><path d="M2 10h20M10 7h4M2 13h2M20 13h2"/><path d="M9 5c0-1 1-1 1-2M14 5c0-1 1-1 1-2"/>',
  people:'<circle cx="7" cy="6" r="2.4"/><circle cx="17" cy="6" r="2.4"/><path d="M3 14c0-3 2-5 4-5s4 2 4 5M13 14c0-3 2-5 4-5s4 2 4 5M1 15h22M5 15v6M19 15v6"/>',
  label:'<rect x="5" y="2" width="14" height="20" rx="1.5"/><path d="M8 6h8M8 10h8M8 13h5M8 16h8M8 19h4"/>',
  lens:'<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 21 21"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 12V7M12 12l4 2"/>',
  mega:'<path d="M3 10v4h3l10 5V5L6 10z"/><path d="M18.5 9l2.5-1.5M18.5 12H22M18.5 15l2.5 1.5"/>'
};
var HABITS = [["pot", "cook more often"], ["people", "eat with others"], ["label", "use food labels"], ["lens", "be mindful"], ["clock", "enjoy your food"], ["mega", "food marketing"]];
function iconAt(k, x, y, s){ s = s || 1; return '<g class="fg-ico" transform="translate(' + f1(x - 12 * s) + " " + f1(y - 12 * s) + ") scale(" + s + ')">' + ICON[k] + "</g>"; }

// ---------- hero: 1942 card → 1992 rainbow → 2007 servings chart → 2019 plate, then six habit icons ring the plate ----------
function heroSVG(st){
  var k = st.fin ? 3 : st.k, a = st.fin ? 1 : st.a, ic = st.fin ? 1 : st.ic, h = "", YRS = [1942, 1992, 2007, 2019], SH = ["rules", "rainbow", "chart"];
  for (var i = 0; i < 3; i++) { var op = clamp(1 - Math.abs(k - i), 0, 1) * (i === 0 ? a : 1); if (op > 0.01) h += '<g opacity="' + f1(op) + '" transform="translate(30 26)">' + SHAPE[SH[i]]() + "</g>"; }
  var p = clamp(k - 2, 0, 1);
  if (p > 0.01) {
    h += '<g opacity="' + f1(p) + '">' + plateSVG({ cx:125, cy:128, r:58, noTitle:true, noGlass:true }) + glassSVG(222, 128, "water") + "</g>";
    HABITS.forEach(function(hb, j){
      var o = seg01(ic, j / 6, (j + 1) / 6); if (o <= 0.01) return;
      var ang = (-90 + j * 60) * D2R, R = 98, x = 125 + R * Math.cos(ang) * (j === 1 || j === 2 ? 0.95 : 1), y = 128 + R * Math.sin(ang) * 0.98;
      if (j === 0) y = 22; if (j === 3) y = 230;
      h += '<g opacity="' + f1(o) + '">' + iconAt(hb[0], x, y - 4, 0.8) + T(x, y + 17, hb[1], "fg-sts") + "</g>";
    });
  }
  var yr = YRS[clamp(Math.round(k), 0, 3)];
  return h + '<text class="fg-hyr" x="8" y="18">' + yr + "</text>";
}
function hero(f){
  var host = $("#fg-hero"); if (!host) return;
  var H = MV.C.hero, st = { k:0, a:0, ic:0 };
  host.innerHTML = '<svg class="fg-hsvg" viewBox="0 0 250 250" role="img" aria-label="' + esc(MV.plain(H.aria)) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.innerHTML = H.caption; f.cap.classList.add("fg-cap"); } }
  if (MV.reduceMotion) { st.fin = true; draw(); cap(); return; }
  draw();
  function run(key, from, to, dur, next){ MV.tween({ dur:dur, step:function(t){ st[key] = lerp(from, to, t); draw(); }, done:function(){ MV.wait(650, next); } }); }
  MV.wait(300, function(){ run("a", 0, 1, 700, function(){ run("k", 0, 1, 1100, function(){ run("k", 1, 2, 1100, function(){ run("k", 2, 3, 1200, function(){ run("ic", 0, 1, 1800, cap); }); }); }); }); });
}

// ---------- Explore: Plate and scale (F2 plate builder + F1 persona analyser + F5 energy balance scale + history) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = {}, PL = D.plate, DR = D.dri, EN = D.energy, HI = D.history;
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  var FOOD = {}, DRINK = {}, NUT = {}, PER = {}, CATV = { vf:"--leaf", gr:"--plate-grain", pr:"--nu-protein" }, CATN = { vf:"vegetables and fruits", gr:"grain foods", pr:"protein foods" };
  PL.shelves.forEach(function(sh){ sh.foods.forEach(function(fd){ FOOD[fd.id] = { id:fd.id, t:fd.t, cat:sh.id, whole:!!fd.whole }; }); });
  PL.drinks.forEach(function(d){ DRINK[d.id] = d; });
  DR.nutrients.forEach(function(n){ NUT[n.id] = n; });
  EN.personas.forEach(function(p){ PER[p.id] = p; });
  var MODES = D.modes.map(function(m){ return m.id; });
  // ===== state =====
  S.mode = MODES.indexOf(S.mode) >= 0 ? S.mode : "plate";
  S.wedges = Array.isArray(S.wedges) && S.wedges.length === 8 ? S.wedges.map(function(x){ return FOOD[x] ? x : ""; }) : ["", "", "", "", "", "", "", ""];
  S.drink = DRINK[S.drink] ? S.drink : "";
  S.habits = Array.isArray(S.habits) ? S.habits.filter(function(i){ return i >= 0 && i < PL.habits.length; }) : [];
  S.serv = S.serv || {}; DR.foods.forEach(function(fd){ S.serv[fd.id] = clamp(Math.round(+S.serv[fd.id] || 0), 0, fd.max); });
  S.nut = NUT[S.nut] ? S.nut : "fe"; S.bell = !!S.bell;
  S.per = PER[S.per] ? S.per : "adaeze"; S.meal = S.meal || {}; S.acts = S.acts || {};
  EN.personas.forEach(function(p){ if (!byId(p.meals, S.meal[p.id])) S.meal[p.id] = p.meals[0].id; var a = S.acts[p.id] || (S.acts[p.id] = {}); p.acts.forEach(function(x){ if (typeof a[x.id] !== "boolean") a[x.id] = !!x.on; }); });
  var WT = {}; EN.week.tiles.forEach(function(t){ WT[t.id] = t; });
  S.week = Array.isArray(S.week) ? S.week.slice(0, EN.week.slots).map(function(x){ return WT[x] ? x : null; }) : [];
  while (S.week.length < EN.week.slots) S.week.push(null);
  S.hsub = S.hsub === "world" ? "world" : "canada";
  S.year = clamp(Math.round(+S.year || 0), 0, HI.timeline.length - 1);
  S.world = byId(HI.world, S.world) ? S.world : HI.world[0].id;
  var fx = { p1:null, bell:null, ride:null, morph:null }, anim = null, sel = null, drag = null, noClick = false, ang = 0, angAnim = null, booting = true, focusW = -1;
  var SELF = { on:false, picks:{} };   // "My own day": memory only, never saved, scored or summarized

  // ===== layout =====
  host.innerHTML = '<div class="fg-ex"><div id="fg-mode" class="fg-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p><div data-mv="graph" class="fg-main">' +
    '<section class="fg-panel" data-p="plate" aria-label="Plate mode"></section><section class="fg-panel" data-p="dri" aria-label="DRI mode"></section>' +
    '<section class="fg-panel" data-p="energy" aria-label="Energy balance mode"></section><section class="fg-panel" data-p="history" aria-label="History and world mode"></section></div></div>';
  function panel(id){ return $('.fg-panel[data-p="' + id + '"]', host); }
  var modeRG = radios($("#fg-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ S.mode = v; api.save(); showMode(); } });
  function showMode(){ $$(".fg-panel", host).forEach(function(p){ p.hidden = p.dataset.p !== S.mode; }); modeRG.set(S.mode); if (S.mode === "energy") paintEnergy(true); }

  // =====================================================================================================
  // Mode 1: plate builder (F2)
  // =====================================================================================================
  var WR = 118 / 300 * 100;
  function wedgePoly(i){ var p = ["50% 50%"]; for (var k = 0; k <= 8; k++) { var a = (i + k / 8) * Math.PI / 4; p.push(f1(50 + (WR + 0.6) * Math.sin(a)) + "% " + f1(50 - (WR + 0.6) * Math.cos(a)) + "%"); } return "polygon(" + p.join(",") + ")"; }
  panel("plate").innerHTML = '<p class="how">' + PL.how + '</p><div class="fg-grid"><div class="fg-vis"><div class="fg-platew"><div class="fg-plate" id="fg-plate">' +
    [0, 1, 2, 3, 4, 5, 6, 7].map(function(i){ return '<button type="button" class="fg-wedge" data-w="' + i + '" data-k="fgw' + i + '" style="clip-path:' + wedgePoly(i) + '"></button>'; }).join("") +
    '<svg class="fg-povl" viewBox="0 0 300 300" aria-hidden="true"></svg></div><div class="fg-glassw"><svg class="fg-gsvg" viewBox="0 0 60 92" aria-hidden="true"></svg><p class="fg-badge" id="fg-badge"></p></div></div>' +
    '<p class="tiny fg-ringkey"><span><i class="fg-rk in"></i>inner ring: your plate</span> <span><i class="fg-rk out"></i>outer ring: the guide’s proportions</span></p>' +
    '<p class="fg-pstat" id="fg-pstat" aria-live="polite"></p></div>' +
    '<div class="fg-side"><h4 class="fg-h4">Food shelves</h4><div class="fg-shelves">' + PL.shelves.map(function(sh){
      return '<p class="fg-shl"><i class="hfa-sw" style="background:var(' + CATV[sh.id] + ')"></i>' + sh.t + '</p><div class="fg-shelf" role="group" aria-label="' + esc(sh.t) + '">' +
        sh.foods.map(function(fd){ return '<button type="button" class="fg-tile c-' + sh.id + '" data-f="' + fd.id + '" data-k="fgt' + fd.id + '" aria-pressed="false">' + fd.t + "</button>"; }).join("") + "</div>";
    }).join("") + '</div><div id="fg-drink"></div><h4 class="fg-h4">Habits with this meal</h4><div class="fg-habits">' +
    PL.habits.map(function(hb, i){ return '<button type="button" class="fg-hab" data-h="' + i + '" data-k="fgh' + i + '" aria-pressed="false"><span class="fg-box" aria-hidden="true"></span>' + hb + "</button>"; }).join("") +
    '</div><div class="q-actions"><button type="button" class="btn ghost sm" id="fg-pclear">Clear the plate</button></div><h4 class="fg-h4">Readout</h4><dl class="read" id="fg-pread" aria-live="polite"></dl></div></div>';
  var drinkRG = radios($("#fg-drink"), { label:"Drink", cls:"chips", options:PL.drinks.map(function(d){ return { id:d.id, t:d.t }; }), value:S.drink,
    onChange:function(v){ S.drink = v; fx.p1 = null; api.save(); paintPlate(); MV.changed(); } });
  function counts(){ var c = { vf:0, gr:0, pr:0, empty:0, whole:0, refined:[] }; S.wedges.forEach(function(id){ var fd = FOOD[id]; if (!fd) { c.empty++; return; } c[fd.cat]++; if (fd.cat === "gr") { if (fd.whole) c.whole++; else if (c.refined.indexOf(fd.t) < 0) c.refined.push(fd.t); } }); return c; }
  function plateOvl(){
    var h = "", c = counts(), cx = 150, cy = 150;
    // outer ring: the guide (left half vegetables and fruits, top-right whole grains, bottom-right protein foods)
    [["vf", 180, 360], ["gr", 0, 90], ["pr", 90, 180]].forEach(function(s){ h += '<path class="fg-ring g-' + s[0] + '" d="' + arcD(cx, cy, 138, s[1] * D2R, s[2] * D2R - 0.001) + '"/>'; });
    // inner ring: this plate's proportions, sorted into the same order (lines up with the guide only at 4/2/2)
    var a = 180;
    [["vf", c.vf], ["gr", c.gr], ["pr", c.pr], ["empty", c.empty]].forEach(function(s){ if (!s[1]) return; var b = a + s[1] * 45; h += '<path class="fg-ring y-' + s[0] + '" d="' + arcD(cx, cy, 127, a * D2R, b * D2R - (b - a >= 360 ? 0.001 : 0)) + '"/>'; a = b; });
    // wedge outlines and labels
    h += '<circle class="fg-wout" cx="150" cy="150" r="118"/>';
    for (var i = 0; i < 8; i++) { var p = pt(cx, cy, 118, i * Math.PI / 4); h += '<line class="fg-wline" x1="150" y1="150" x2="' + f1(p[0]) + '" y2="' + f1(p[1]) + '"/>'; }
    if (fx.p1 != null) {
      for (var j = 4; j < 8; j++) h += '<path class="fg-glow" style="opacity:' + f1(fx.p1) + '" d="' + wedgeD(cx, cy, 118, j * Math.PI / 4, (j + 1) * Math.PI / 4) + '"/>';
    }
    S.wedges.forEach(function(id, i){
      var m = pt(cx, cy, 74, (i + 0.5) * Math.PI / 4), fd = FOOD[id], ax = i === 0 || i === 3 || i === 4 || i === 7, right = i === 0 || i === 3;
      // the four wedges beside the vertical axis anchor their labels away from it, so neighbours never collide
      if (fd) h += ax ? lines(cx + (right ? 8 : -8), pt(cx, cy, 80, (i + 0.5) * Math.PI / 4)[1] + 4, two(fd.t), "fg-wl", 13, right ? "start" : "end") : lines(m[0], m[1] + 4, two(fd.t), "fg-wl", 13);
      else if (fx.p1 == null || i < 4) h += T(m[0], m[1] + 4, String(i + 1), "fg-wn");
    });
    if (focusW >= 0) h += '<path class="fg-wfocus" d="' + wedgeD(cx, cy, 116, focusW * Math.PI / 4, (focusW + 1) * Math.PI / 4) + '"/>';
    if (fx.p1 != null && fx.p1 > 0.2) h += '<g style="opacity:' + f1(seg01(fx.p1, 0.2, 0.7)) + '"><rect class="fg-glowbg" x="44" y="136" width="100" height="30" rx="6"/>' + lines(94, 155, ["Vegetables and", "fruits: half"], "fg-wl", 12) + "</g>";
    return h;
  }
  function glassPaint(){
    var d = DRINK[S.drink], cls = { water:"fg-cwa", milk:"fg-cmilk", soy:"fg-csoy", juice:"fg-cjuice", cola:"fg-ccola" }[S.drink] || "fg-cempty";
    $(".fg-gsvg", host).innerHTML = '<path class="' + cls + '" d="M10 8 L50 8 L45 76 L15 76Z"/><line class="fg-cglass" x1="10" y1="22" x2="50" y2="22"/>';
    $("#fg-badge").innerHTML = d ? "<strong>" + d.t + "</strong><br>" + (d.id === "water" ? "the drink of choice" : d.rec ? "fits the guide" : PL.drinkNo) : '<span class="muted">No drink yet</span>';
  }
  function propText(c){
    var g = c.refined.length ? "grain foods " + c.gr + "/8 (whole grains " + c.whole + "/8)" : "whole grains " + c.gr + "/8";
    var s = "Vegetables and fruits " + c.vf + "/8 · " + g + " · protein foods " + c.pr + "/8" + (c.empty ? " · empty " + c.empty + "/8" : "");
    return s + (c.vf === 4 && c.gr === 2 && c.pr === 2 ? " <strong>(" + PL.match + ")</strong>" : "");
  }
  function paintPlate(){
    var c = counts();
    $$(".fg-wedge", host).forEach(function(b){
      var i = +b.dataset.w, fd = FOOD[S.wedges[i]];
      b.className = "fg-wedge" + (fd ? " c-" + fd.cat : "") + (sel ? " ready" : "");
      b.setAttribute("aria-label", "Wedge " + (i + 1) + " of 8: " + (fd ? fd.t + " (" + CATN[fd.cat] + ")" : "empty") + (sel ? ". Place " + FOOD[sel].t + " here" : fd ? ". Tap to clear" : ""));
    });
    $$(".fg-tile", host).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.f === sel)); });
    $$(".fg-hab", host).forEach(function(b){ b.setAttribute("aria-pressed", String(S.habits.indexOf(+b.dataset.h) >= 0)); });
    $(".fg-povl", host).innerHTML = plateOvl();
    glassPaint(); drinkRG.set(S.drink);
    var gt = !c.gr ? "No grain yet" : c.refined.length ? (c.whole ? "Whole grain: partly (" : "Whole grain: no (") + c.refined.join(" and ") + " " + (c.refined.length > 1 ? "are" : "is") + " refined)" : "Whole grain: yes";
    var d = DRINK[S.drink];
    $("#fg-pread").innerHTML = MV.readoutHTML([["Plate proportions", propText(c)], ["Grain type", gt],
      ["Drink", d ? d.t + (d.rec ? "" : ": " + PL.drinkNo) : "not chosen yet"], ["Habits", S.habits.length + " of " + PL.habits.length + ' <span class="muted">(never scored)</span>']]);
    $("#fg-pstat").textContent = sel ? "Selected: " + FOOD[sel].t + ". Tap a wedge to place it (tap " + FOOD[sel].t + " again to put it down)." : "Tap a food, then tap a wedge.";
  }
  function place(i, id){ S.wedges[i] = id || ""; fx.p1 = null; api.save(); paintPlate(); MV.changed(); }
  var pl = panel("plate");
  pl.addEventListener("click", function(e){
    if (noClick) return;
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.f) { sel = sel === b.dataset.f ? null : b.dataset.f; paintPlate(); return; }
    if (b.dataset.w != null) { var i = +b.dataset.w; if (sel) place(i, sel); else if (S.wedges[i]) place(i, ""); else $("#fg-pstat").textContent = "Tap a food first, then tap a wedge."; return; }
    if (b.dataset.h != null) { var h = +b.dataset.h, k = S.habits.indexOf(h); if (k >= 0) S.habits.splice(k, 1); else S.habits.push(h); api.save(); paintPlate(); return; }
    if (b.id === "fg-pclear") { S.wedges = ["", "", "", "", "", "", "", ""]; fx.p1 = null; api.save(); paintPlate(); MV.changed(); }
  });
  pl.addEventListener("keydown", function(e){
    var b = e.target.closest(".fg-wedge"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var n = $('.fg-wedge[data-w="' + ((+b.dataset.w + d + 8) % 8) + '"]', host); if (n) n.focus();
  });
  pl.addEventListener("focusin", function(e){ var b = e.target.closest(".fg-wedge"); focusW = b ? +b.dataset.w : -1; $(".fg-povl", host).innerHTML = plateOvl(); });
  pl.addEventListener("focusout", function(){ focusW = -1; $(".fg-povl", host).innerHTML = plateOvl(); });
  // mouse or pen drag from a shelf tile onto a wedge (touch uses tap-then-tap so the shelves can scroll)
  pl.addEventListener("pointerdown", function(e){ var t = e.target.closest(".fg-tile"); if (!t || e.pointerType === "touch" || e.button !== 0) return; drag = { id:t.dataset.f, x:e.clientX, y:e.clientY, on:false, g:null }; });
  document.addEventListener("pointermove", function(e){
    if (!drag) return;
    if (!drag.on && Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 8) { drag.on = true; drag.g = document.createElement("div"); drag.g.className = "fg-ghost"; drag.g.textContent = FOOD[drag.id].t; document.body.appendChild(drag.g); }
    if (drag.on) { drag.g.style.left = e.clientX + "px"; drag.g.style.top = e.clientY + "px"; }
  });
  document.addEventListener("pointerup", function(e){
    if (!drag) return; var d = drag; drag = null; if (!d.on) return;
    d.g.remove(); noClick = true; setTimeout(function(){ noClick = false; }, 0);
    var el = document.elementFromPoint(e.clientX, e.clientY), w = el && el.closest && el.closest(".fg-wedge");
    if (w) place(+w.dataset.w, d.id);
  });
  document.addEventListener("pointercancel", function(){ if (drag && drag.g) drag.g.remove(); drag = null; });

  // =====================================================================================================
  // Mode 2: DRI analyser (F1), persona Nour, with the optional private "My own day"
  // =====================================================================================================
  var MKL = { ear:"EAR", rda:"RDA", ai:"AI", ul:"UL", cdrr:"CDRR" };
  function markers(n){
    return ["ear", "rda", "ai", "cdrr", "ul"].filter(function(k){ return n[k] != null; }).map(function(k){
      var off = n[k] > n.max, x = off ? 100 : n[k] / n.max * 100;
      return '<span class="fg-mk m-' + k + (off ? " off" : "") + '" style="left:' + f1(x) + '%"><span class="fg-ml">' + MKL[k] + " " + nm(n[k]) + (off ? " →" : "") + "</span></span>";
    }).join("");
  }
  panel("dri").innerHTML = '<div class="fg-grid"><div class="fg-vis"><p class="fg-pcard">' + DR.persona + ' <span class="hfa-model">Persona model values</span></p>' +
    '<div class="fg-bars" id="fg-bars">' + DR.nutrients.map(function(n){
      return '<button type="button" class="fg-bar k-' + n.kind + '" data-nut="' + n.id + '" data-k="fgn' + n.id + '" aria-pressed="false"><span class="fg-bt"><span>' + n.t + '</span><b class="fg-bv"></b></span>' +
        '<span class="fg-track"><span class="fg-bell" aria-hidden="true"></span><span class="fg-fill"></span>' + markers(n) + "</span></button>";
    }).join("") + '</div><p class="tiny muted fg-bkey">Tap a bar for its details. Markers: EAR, RDA or AI, and UL (CDRR for sodium). An arrow means the marker is off the scale.</p>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="fg-bellb" aria-pressed="false">' + DR.bellLabel + "</button></div>" +
    '<details class="alg"><summary>DRI definitions card</summary>' + DR.card + "</details></div>" +
    '<div class="fg-side"><h4 class="fg-h4">Food sliders</h4><p class="tiny">' + DR.baseNote + ' <span class="hfa-model">Model data</span></p><div id="fg-sl" class="fg-sl"></div>' +
    '<details class="alg"><summary>Check it with data: iron absorption</summary><p>' + DR.absorb + "</p></details>" +
    '<h4 class="fg-h4">Readout</h4><dl class="read" id="fg-dread" aria-live="polite"></dl><div class="fg-self" id="fg-self"></div></div></div>';
  function fmtServ(fd){ return function(v){ return v + " " + (fd.unit === "cup" ? (v === 1 ? "cup" : "cups") : (v === 1 ? "serving" : "servings")); }; }
  var sl = MV.sliders($("#fg-sl"), DR.foods.map(function(fd){ return { id:fd.id, label:fd.t, min:0, max:fd.max, step:1, value:S.serv[fd.id], fmt:fmtServ(fd) }; }),
    function(id, v){ S.serv[id] = v; api.save(); paintDri(); MV.changed(); });
  function intake(k){ var v = DR.base[k] || 0; DR.foods.forEach(function(fd){ v += (S.serv[fd.id] || 0) * (fd[k] || 0); }); return Math.round(v * 10) / 10; }
  function status(n, v){
    var s = nm(v) + " " + n.unit + ": ";
    if (n.ear != null) {
      if (n.ul != null && v > n.ul) return s + "above UL (" + nm(n.ul) + ")";
      s += v < n.ear ? "below EAR (" + nm(n.ear) + ")" : v < n.rda ? "between EAR (" + nm(n.ear) + ") and RDA (" + nm(n.rda) + ")" : "at or above RDA (" + nm(n.rda) + ")";
      return s + (n.ul != null ? "; not above the UL (" + nm(n.ul) + ")" : "; no UL is set");
    }
    s += v < n.ai ? "below AI (" + nm(n.ai) + ")" : "at or above AI (" + nm(n.ai) + ")";
    if (n.cdrr != null) return s + (v > n.cdrr ? "; above CDRR (" + nm(n.cdrr) + ")" : "; not above the CDRR (" + nm(n.cdrr) + ")");
    return s + "; no UL is set";
  }
  function shortStatus(n, v){ return status(n, v).replace(/^[^:]*: /, "").split(";")[0]; }
  function bellSVG(n, v, t){
    var W = 1000, Hh = 100, a = n.ear - 3.6 * n.sd, b = n.ear + 3.6 * n.sd, pts = [], sh = [];
    for (var i = 0; i <= 60; i++) { var x = lerp(a, b, i / 60), z = (x - n.ear) / n.sd, y = Hh - 92 * Math.exp(-z * z / 2) * t, px = x / n.max * W; pts.push(f1(px) + " " + f1(y)); if (x <= v) sh.push([px, y]); }
    var h = '<svg viewBox="0 0 1000 100" preserveAspectRatio="none">';
    if (sh.length > 1) { var last = sh[sh.length - 1]; h += '<path class="fg-bsh" d="M' + f1(sh[0][0]) + " " + Hh + " L" + sh.map(function(p){ return f1(p[0]) + " " + f1(p[1]); }).join(" L") + " L" + f1(last[0]) + " " + Hh + 'Z"/>'; }
    return h + '<path class="fg-bcur" vector-effect="non-scaling-stroke" d="M' + pts.join(" L") + '"/></svg>';
  }
  function paintDri(){
    DR.nutrients.forEach(function(n){
      var b = $('.fg-bar[data-nut="' + n.id + '"]', host), v = intake(n.id), on = S.nut === n.id;
      b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on);
      $(".fg-bv", b).textContent = nm(v) + " " + n.unit;
      $(".fg-fill", b).style.width = f1(clamp(v / n.max, 0, 1) * 100) + "%";
      b.setAttribute("aria-label", n.t + ", " + nm(v) + " " + n.unit + ": " + shortStatus(n, v));
      var bellT = on && n.sd ? (fx.bell != null ? fx.bell : S.bell ? 1 : 0) : 0, bl = $(".fg-bell", b);
      b.classList.toggle("bell", bellT > 0);
      bl.innerHTML = bellT > 0 ? bellSVG(n, v, bellT) : "";
    });
    var n = NUT[S.nut], v = intake(n.id), bb = $("#fg-bellb");
    bb.disabled = !n.sd; bb.setAttribute("aria-pressed", String(!!(n.sd && S.bell)));
    bb.textContent = DR.bellLabel + (n.sd ? " (" + lc(n.t) + ")" : " (calcium, vitamin D or protein)");
    var rows = [["DRI status (Nour, " + lc(n.t) + ")", status(n, v)], ["Typical Canadian intake", DR.typLabel.replace("{n}", lc(n.t)).replace("{v}", nm(n.typ) + " " + n.unit) + ' <span class="hfa-model">Model data</span>']];
    if (n.sd && (S.bell || fx.bell != null)) rows.push(["Spread of needs", "This intake meets the needs of about " + Math.round(phi((v - n.ear) / n.sd) * 100) + "% of healthy women 31–50. " + '<span class="tiny muted">' + DR.bellNote + "</span>"]);
    $("#fg-dread").innerHTML = MV.readoutHTML(rows);
  }
  var dp = panel("dri");
  dp.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.nut) { S.nut = b.dataset.nut; api.save(); paintDri(); return; }
    if (b.id === "fg-bellb") { S.bell = !S.bell; api.save(); paintDri(); }
  });
  // --- optional private "My own day" (memory only) ---
  var X = DR.self;
  $("#fg-self").innerHTML = '<h4 class="fg-h4"><span class="hfa-private">Optional and private</span> My own day</h4><p class="tiny">' + X.privacy + '</p><div class="q-actions" id="fg-sgate"><button type="button" class="btn ghost sm" id="fg-sgo">' + X.start + "</button></div>" +
    '<div id="fg-sbody" hidden><p class="tiny">' + X.intro + ' <span class="hfa-model">Model data</span></p><div class="fg-sfoods" role="group" aria-label="Foods you ate yesterday">' +
    X.foods.map(function(fd){ return '<button type="button" class="fg-hab" data-sf="' + fd.id + '" data-k="fgsf' + fd.id + '" aria-pressed="false"><span class="fg-box" aria-hidden="true"></span>' + fd.t + "</button>"; }).join("") +
    '</div><div id="fg-sbars" aria-live="polite"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="fg-sclr">Clear my marks</button><button type="button" class="btn ghost sm" id="fg-send">Close “My own day”</button></div><p class="tiny"><strong>' + X.advice + "</strong></p></div>";
  function paintSelf(){
    $("#fg-sgate").hidden = SELF.on; $("#fg-sbody").hidden = !SELF.on;
    $$("[data-sf]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(!!SELF.picks[b.dataset.sf])); });
    var tot = {}; X.bars.forEach(function(b){ tot[b.id] = 0; }); X.foods.forEach(function(fd){ if (SELF.picks[fd.id]) X.bars.forEach(function(b){ tot[b.id] += fd[b.id] || 0; }); });
    $("#fg-sbars").innerHTML = '<div class="fg-sb">' + X.bars.map(function(b){
      var v = tot[b.id];
      return '<div class="fg-sbr"><p><strong>' + b.t + ":</strong> about " + Math.round(v) + "% of the general reference, " + (v >= 100 ? X.reach : X.below) + '.</p><span class="fg-strack" aria-hidden="true"><span class="fg-sfill" style="width:' + f1(clamp(v / 150, 0, 1) * 100) + '%"></span><span class="fg-sref"></span></span></div>';
    }).join("") + '<p class="tiny muted">The dashed line marks the general reference.</p></div>';
  }
  $("#fg-self").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "fg-sgo") { SELF.on = true; paintSelf(); var f = $("[data-sf]", host); if (f) f.focus(); return; }
    if (b.id === "fg-sclr") { SELF.picks = {}; paintSelf(); return; }
    if (b.id === "fg-send") { SELF.on = false; SELF.picks = {}; paintSelf(); $("#fg-sgo").focus(); return; }
    if (b.dataset.sf) { SELF.picks[b.dataset.sf] = !SELF.picks[b.dataset.sf]; paintSelf(); }
  });
  paintSelf();

  // =====================================================================================================
  // Mode 3: energy balance scale (F5), adult personas only, plus Rui's activity panel (MET-minutes)
  // =====================================================================================================
  panel("energy").innerHTML = '<div class="fg-grid"><div class="fg-vis"><p class="fg-pcard"><span class="hfa-model">' + EN.note + '</span></p>' +
    '<svg class="fg-scale" id="fg-scale" viewBox="0 0 320 176" role="img"></svg><p class="fg-slab" id="fg-slab" aria-live="polite"></p>' +
    '<div class="fg-ebars" id="fg-ebars"></div><p class="tiny muted">' + EN.adapt + "</p></div>" +
    '<div class="fg-side"><div id="fg-per"></div><div id="fg-mealw"></div><div class="fg-acts" id="fg-acts"></div><h4 class="fg-h4">Readout</h4><dl class="read" id="fg-eread" aria-live="polite"></dl><p class="tiny muted">' + EN.rule + "</p></div></div>" +
    '<div class="fg-week" id="fg-week"></div>';
  var perRG = radios($("#fg-per"), { label:"Persona", cls:"chips", options:EN.personas.map(function(p){ return { id:p.id, t:"<strong>" + p.name + "</strong>, " + p.age + ", " + p.role }; }), value:S.per,
    onChange:function(v){ S.per = v; api.save(); buildPer(); paintEnergy(); } });
  var mealRG = null;
  function buildPer(){
    var p = PER[S.per], w = $("#fg-mealw"); w.innerHTML = "<div></div>";
    mealRG = radios(w.firstChild, { label:"Eating", cls:"chips", options:p.meals.map(function(m){ return { id:m.id, t:m.t }; }), value:S.meal[p.id],
      onChange:function(v){ S.meal[p.id] = v; api.save(); paintEnergy(); } });
    $("#fg-acts").innerHTML = '<p class="fg-rgl">Activity today</p>' + p.acts.map(function(a){ return '<button type="button" class="fg-hab" data-pa="' + a.id + '" data-k="fga' + a.id + '" aria-pressed="false"><span class="fg-box" aria-hidden="true"></span>' + a.t + ", " + a.min + " min (" + a.met + " MET)</button>"; }).join("");
  }
  $("#fg-acts").addEventListener("click", function(e){ var b = e.target.closest("[data-pa]"); if (!b) return; var a = S.acts[S.per]; a[b.dataset.pa] = !a[b.dataset.pa]; api.save(); paintEnergy(); });
  function energyOf(pid){
    var p = PER[pid], meal = byId(p.meals, S.meal[pid]), rate = p.bmr / 1440, list = [], act = p.everyday;
    p.acts.forEach(function(a){
      var on = !!S.acts[pid][a.id], k = 1;
      if (fx.ride != null && pid === "adaeze" && a.id === "ride") { on = true; k = fx.ride; }
      if (!on) return;
      var mm = a.min * a.met, kc = Math.round(mm * rate); list.push({ a:a, mm:mm, kc:kc }); act += kc * k;
    });
    act = Math.round(act);
    var tef = Math.round(meal.kcal * 0.1), out = p.bmr + act + tef, diff = (meal.kcal - out) / out;
    return { p:p, meal:meal, list:list, act:act, tef:tef, out:out, inK:meal.kcal, diff:diff, lab:Math.abs(diff) <= 0.05 ? "even" : diff > 0 ? "more" : "less" };
  }
  function scaleSVG(e, a){
    var cx = 160, cy = 64, L = 104, c = Math.cos(a), s = Math.sin(a), lx = cx - L * c, ly = cy + L * s, rx = cx + L * c, ry = cy - L * s, h = "";
    h += '<path class="fg-sbase" d="M160 64 L140 162 L180 162Z"/><rect class="fg-sbase" x="112" y="160" width="96" height="8" rx="3"/>';
    h += '<line class="fg-sbeam" x1="' + f1(lx) + '" y1="' + f1(ly) + '" x2="' + f1(rx) + '" y2="' + f1(ry) + '"/><circle class="fg-spiv" cx="160" cy="64" r="5"/>';
    function pan(x, y, lab, val, cls){ return '<line class="fg-sstr" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x - 30) + '" y2="' + f1(y + 40) + '"/><line class="fg-sstr" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x + 30) + '" y2="' + f1(y + 40) + '"/>' +
      '<path class="fg-span ' + cls + '" d="M' + f1(x - 40) + " " + f1(y + 40) + " Q" + f1(x) + " " + f1(y + 82) + " " + f1(x + 40) + " " + f1(y + 40) + 'Z"/>' + T(x, y + 32, lab, "fg-stt") + T(x, y + 53, val, "fg-st"); }
    h += pan(lx, ly, "In", nm(e.inK, 0) + " kcal", "in") + pan(rx, ry, "Out", nm(e.out, 0) + " kcal", "out");
    return h;
  }
  function angleOf(e){ return clamp(e.diff * 0.7, -0.17, 0.17); }
  function paintEnergy(instant){
    var e = energyOf(S.per), p = e.p, target = angleOf(e), svg = $("#fg-scale");
    function drawAt(a){ ang = a; svg.innerHTML = scaleSVG(e, a); }
    if (angAnim) { angAnim(); angAnim = null; }
    if (instant || booting || fx.ride != null || MV.reduceMotion || Math.abs(target - ang) < 0.002) drawAt(target);
    else { var a0 = ang; angAnim = MV.tween({ dur:450, step:function(t){ drawAt(lerp(a0, target, t)); }, done:function(){ angAnim = null; } }); }
    var lab = EN.labels[e.lab];
    svg.setAttribute("aria-label", "Balance scale for " + p.name + ": energy in " + e.inK + " kcal, energy out " + e.out + " kcal: " + lab + ".");
    $("#fg-slab").innerHTML = "The scale shows <strong>" + lab + "</strong>.";
    var MX = 3600, W = function(v){ return f1(clamp(v / MX, 0, 1) * 100) + "%"; };
    $("#fg-ebars").innerHTML = '<div class="fg-eb"><span class="fg-ebl">Energy in</span><span class="fg-ebt"><span class="fg-seg s-in" style="width:' + W(e.inK) + '"><span>intake ' + e.inK + "</span></span></span></div>" +
      '<div class="fg-eb"><span class="fg-ebl">Energy out</span><span class="fg-ebt"><span class="fg-seg s-bmr" style="width:' + W(p.bmr) + '"><span>BMR ' + p.bmr + '</span></span><span class="fg-seg s-act" style="width:' + W(e.act) + '"><span>activity ' + e.act + '</span></span><span class="fg-seg s-tef" style="width:' + W(e.tef) + '"><span>' + e.tef + "</span></span></span></div>" +
      '<div class="fg-eax" aria-hidden="true"><span style="left:0">0</span><span style="left:' + W(1000) + '">1000</span><span style="left:' + W(2000) + '">2000</span><span style="left:' + W(3000) + '">3000 kcal</span></div>' +
      '<p class="tiny fg-elg"><span><i class="fg-ek s-in"></i>intake</span><span><i class="fg-ek s-bmr"></i>BMR (basal metabolism)</span><span><i class="fg-ek s-act"></i>activity</span><span><i class="fg-ek s-tef"></i>thermic effect of food</span></p>';
    $$("#fg-acts [data-pa]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(!!S.acts[p.id][b.dataset.pa] || (fx.ride != null && p.id === "adaeze" && b.dataset.pa === "ride"))); });
    var acts = e.list.map(function(x){ return x.a.t + " " + x.a.min + " min × " + x.a.met + " MET = " + x.mm + " MET-minutes (≈ " + x.kc + " kcal for " + p.name + ")"; });
    $("#fg-eread").innerHTML = MV.readoutHTML([
      ["Energy balance (" + p.name + ")", "Intake " + e.inK + " · BMR " + p.bmr + " · activity " + e.act + " · thermic effect " + e.tef + " → <strong>" + lab + "</strong>"],
      ["Activity data", (acts.length ? acts.join("; ") + "; " : "No planned activity today; ") + "plus " + EN.everydayT + " ≈ " + p.everyday + " kcal"]]);
  }
  // --- Rui's active week (TC3) ---
  var WK = EN.week;
  $("#fg-week").innerHTML = '<h4 class="fg-h4">' + WK.title + '</h4><p class="tiny">' + WK.how + ' <span class="hfa-model">Model MET values</span></p>' +
    '<div class="fg-wt" role="group" aria-label="Activities, 30 minutes each">' + WK.tiles.map(function(t){ return '<button type="button" class="fg-wtile" data-wt="' + t.id + '" data-k="fgwt' + t.id + '"><strong>' + t.t + "</strong><span>" + t.met + " MET × " + WK.min + " min = " + t.met * WK.min + " MET-minutes</span></button>"; }).join("") + "</div>" +
    '<ol class="fg-ws">' + S.week.map(function(_, i){ return '<li><button type="button" class="fg-wslot" data-ws="' + i + '" data-k="fgws' + i + '"></button></li>'; }).join("") + "</ol>" +
    '<div class="fg-wbar" aria-hidden="true"><span class="fg-wfill"></span><span class="fg-wtgt" style="left:' + f1(WK.target / 900 * 100) + '%"><span>' + WK.target + "</span></span></div>" +
    '<p class="fg-wsum" id="fg-wsum" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn ghost sm" id="fg-wclr">Clear the week</button></div>';
  function weekStats(){ var s = { n:0, tot:0, c:{} }; S.week.forEach(function(x){ if (!x) return; s.n++; s.tot += WT[x].met * WK.min; s.c[x] = (s.c[x] || 0) + 1; }); return s; }
  var wkNote = "";
  function paintWeek(){
    var s = weekStats();
    $$(".fg-wslot", host).forEach(function(b){ var x = S.week[+b.dataset.ws]; b.innerHTML = "<span>Session " + (+b.dataset.ws + 1) + "</span>" + (x ? "<strong>" + WT[x].t + "</strong><small>" + WT[x].met * WK.min + " MET-min</small>" : '<em class="muted">free day</em>'); b.classList.toggle("on", !!x); b.setAttribute("aria-label", "Session " + (+b.dataset.ws + 1) + ": " + (x ? WT[x].t + ", " + WT[x].met * WK.min + " MET-minutes. Tap to clear" : "free day")); });
    $(".fg-wfill", host).style.width = f1(clamp(s.tot / 900, 0, 1) * 100) + "%";
    $("#fg-wsum").innerHTML = "Total <strong>" + s.tot + " MET-minutes</strong> (at least " + WK.target + " wanted) · sessions " + s.n + " of " + WK.slots + " · gardening " + (s.c.garden || 0) + " · swims " + (s.c.swim || 0) + (wkNote ? ". " + wkNote : "");
  }
  $("#fg-week").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return; wkNote = "";
    if (b.dataset.wt) { var i = S.week.indexOf(null); if (i < 0) wkNote = "All 5 days are planned. Tap a day to clear it."; else S.week[i] = b.dataset.wt; }
    else if (b.dataset.ws != null) S.week[+b.dataset.ws] = null;
    else if (b.id === "fg-wclr") S.week = S.week.map(function(){ return null; });
    api.save(); paintWeek(); MV.changed();
  });

  // =====================================================================================================
  // Mode 4: history and world (N13-style timeline)
  // =====================================================================================================
  var TL = HI.timeline;
  panel("history").innerHTML = '<div id="fg-hsub"></div><div class="fg-grid"><div class="fg-vis"><div id="fg-hcan"><div id="fg-years"></div><div id="fg-hpl"></div></div><div id="fg-hwld" hidden><div id="fg-wsel"></div></div>' +
    '<div class="fg-hfig"><svg class="fg-hsv" id="fg-hsv" viewBox="0 0 200 200" role="img"></svg></div></div><div class="fg-side"><div class="fg-hcard" id="fg-hcard" aria-live="polite"></div><h4 class="fg-h4">Readout</h4><dl class="read" id="fg-hread"></dl></div></div>';
  var hsubRG = radios($("#fg-hsub"), { label:"Show", options:[{ id:"canada", t:"Canada’s guides, 1942–2019" }, { id:"world", t:"Around the world" }], value:S.hsub, onChange:function(v){ S.hsub = v; api.save(); paintHist(); } });
  var yearRG = radios($("#fg-years"), { label:"Year", cls:"chips", options:TL.map(function(c, i){ return { id:String(i), t:String(c.year) }; }), value:String(S.year), onChange:function(v){ player.go(+v); } });
  var plBoot = true;
  var player = MV.player($("#fg-hpl"), { count:TL.length, interval:1700, label:function(i){ return TL[i].year + ": " + TL[i].title; },
    render:function(i){ if (plBoot) return; S.year = i; fx.morph = null; api.save(); yearRG.set(String(i)); paintHist(); } });
  plBoot = false;
  radios($("#fg-wsel"), { label:"Guide", cls:"chips", options:HI.world.map(function(w){ return { id:w.id, t:w.t }; }), value:S.world, onChange:function(v){ S.world = v; api.save(); paintHist(); } });
  function paintHist(){
    var can = S.hsub === "canada", svg = $("#fg-hsv"), c, h;
    $("#fg-hcan").hidden = !can; $("#fg-hwld").hidden = can;
    if (can) {
      c = TL[S.year];
      if (fx.morph != null) svg.innerHTML = '<g opacity="' + f1(1 - fx.morph) + '">' + SHAPE.chart() + '</g><g opacity="' + f1(fx.morph) + '">' + SHAPE.plate() + "</g>";
      else svg.innerHTML = SHAPE[c.shape]();
      svg.setAttribute("aria-label", c.year + ": " + c.title + ". " + c.points.join(". ") + ".");
      h = '<h4 class="fg-h4">' + c.year + ": " + c.title + '</h4><ul class="fg-pts">' + c.points.map(function(p){ return "<li>" + p + "</li>"; }).join("") + "</ul><p><strong>What changed and why:</strong> " + c.why + "</p>";
      $("#fg-hread").innerHTML = MV.readoutHTML([["History card", c.short]]);
    } else {
      c = byId(HI.world, S.world);
      svg.innerHTML = SHAPE[c.shape]();
      svg.setAttribute("aria-label", c.t + ". " + c.points.join(". ") + ".");
      h = '<h4 class="fg-h4">' + c.t + " (" + c.year + ')</h4><ul class="fg-pts">' + c.points.map(function(p){ return "<li>" + p + "</li>"; }).join("") + "</ul><p><strong>Similar evidence:</strong> " + c.similar + '</p><p class="tiny">' + HI.worldNote + "</p>";
      $("#fg-hread").innerHTML = MV.readoutHTML([["Guide card", c.t + " (" + c.year + ")"]]);
    }
    $("#fg-hcard").innerHTML = h;
  }

  // ===== practice: the DRI definitions card above the "Which DRI?" sorter =====
  var ad = document.getElementById("act-dri");
  if (ad && !document.getElementById("fg-dricard2")) ad.insertAdjacentHTML("beforebegin", '<details class="alg fg-dcard" id="fg-dricard2"><summary>DRI definitions card</summary>' + DR.card + "</details>");

  // ===== first paint =====
  buildPer(); player.go(S.year);
  paintPlate(); paintDri(); paintEnergy(true); paintWeek(); paintHist(); showMode();
  booting = false;

  // ===== challenges =====
  function ironTotal(){ return intake("fe"); }
  function test(id){
    var c = CH[id], M = c.msgs;
    if (id === "tc1") {
      var n = counts(), ws = S.wedges;
      if (n.vf !== 4) return { ok:false, msg:M.half };
      if (n.gr !== 2 || n.pr !== 2) return { ok:false, msg:M.quarters };
      if (ws.indexOf("whiterice") >= 0) return { ok:false, msg:M.white };
      if (ws.indexOf("whitebread") >= 0) return { ok:false, msg:M.bread };
      if (!S.drink) return { ok:false, msg:M.noDrink };
      if (!DRINK[S.drink].rec) return { ok:false, msg:M.drink };
      return { ok:true };
    }
    if (id === "tc2") {
      var fe = ironTotal(), N = NUT.fe;
      if (fe >= N.ul) return { ok:false, msg:M.high };
      if (fe < N.rda) return { ok:false, msg:M.low };
      return { ok:true };
    }
    if (id === "tc3") {
      var s = weekStats(), g = s.c.garden || 0;
      if ((s.c.swim || 0) >= 2) return { ok:false, msg:M.swims };
      if (g >= 4) return { ok:false, msg:M.gardens };
      if (s.n < WK.slots) return { ok:false, msg:M.count };
      if (g < 2) return { ok:false, msg:M.garden2 };
      if (s.tot < WK.target) return { ok:false, msg:g === 2 && s.c.walk === 3 ? M.walks : M.short };
      return { ok:true };
    }
    return { ok:false };
  }

  // ===== predictions =====
  var pend = null;
  function finish(){ anim = null; var d = pend; pend = null; if (d) d(); }
  function stopAnim(){ if (anim) { anim(); anim = null; } }
  function go(m){ S.mode = m; showMode(); }
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        stopAnim(); fx.p1 = null; fx.bell = null; fx.ride = null; fx.morph = null;
        if (p.id === "p1") { go("plate"); sel = null; S.wedges = ["", "", "", "", "", "", "", ""]; paintPlate(); }
        if (p.id === "p2") { DR.foods.forEach(function(fd){ S.serv[fd.id] = fd.id === "milk" ? 1 : 0; sl.set(fd.id, S.serv[fd.id]); }); S.nut = "ca"; S.bell = false; go("dri"); paintDri(); }
        if (p.id === "p3") { S.per = "adaeze"; S.meal.adaeze = "rest"; S.acts.adaeze.ride = false; go("energy"); perRG.set("adaeze"); buildPer(); paintEnergy(true); }
        if (p.id === "p4") { S.hsub = "canada"; go("history"); hsubRG.set("canada"); player.go(5); }
        api.save(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") { reveal($("#fg-plate")); anim = MV.tween({ dur:1800, step:function(t){ fx.p1 = t; $(".fg-povl", host).innerHTML = plateOvl(); }, done:finish }); return; }
        if (p.id === "p2") { reveal($("#fg-bars")); anim = MV.tween({ dur:2200, step:function(t){ fx.bell = t; paintDri(); }, done:function(){ fx.bell = null; S.bell = true; api.save(); paintDri(); finish(); } }); return; }
        if (p.id === "p3") { reveal($("#fg-scale")); fx.ride = 0; anim = MV.tween({ dur:2000, step:function(t){ fx.ride = t; paintEnergy(true); }, done:function(){ fx.ride = null; S.acts.adaeze.ride = true; api.save(); paintEnergy(true); finish(); } }); return; }
        if (p.id === "p4") { reveal($("#fg-hsv")); fx.morph = 0; paintHist(); anim = MV.tween({ dur:1800, step:function(t){ fx.morph = t; paintHist(); }, done:function(){ fx.morph = null; player.go(6); finish(); } }); return; }
        finish();
      }
    },
    challenge:function(id){ return test(id); }
  };
}

// ---------- Part 3: Modify a recipe (swap chips, readouts, "Check it with data", kitchen card) ----------
function part3(host, api){
  var R = api.content.recipe, S = api.S;
  R.groups.forEach(function(g){ if (!byId(g.opts, S[g.id])) S[g.id] = g.opts[0].id; });
  R.adds.forEach(function(a){ S[a.id] = !!S[a.id]; });
  host.innerHTML = '<div class="fg-grid fg-rgrid"><div class="fg-vis"><div class="fg-rcard"><h4 class="fg-h4">' + R.title + ' <span class="tiny muted" id="fg-rserv"></span></h4><ul class="fg-ing" id="fg-ing"></ul></div>' +
    '<h4 class="fg-h4">Swap chips</h4><div class="fg-swaps">' + R.groups.map(function(g){ return '<div id="fg-sw-' + g.id + '"></div>'; }).join("") +
    '<div class="fg-adds">' + R.adds.map(function(a){ return '<button type="button" class="fg-hab" data-add="' + a.id + '" data-k="fgad' + a.id + '" aria-pressed="false"><span class="fg-box" aria-hidden="true"></span>' + a.t + "</button>"; }).join("") + "</div></div></div>" +
    '<div class="fg-side"><h4 class="fg-h4">Readouts</h4><dl class="read" id="fg-rread" aria-live="polite"></dl>' +
    '<details class="alg" open><summary>Check it with data: per serving, before and after</summary><div id="fg-rdata"></div></details>' +
    '<h4 class="fg-h4">Kitchen card</h4><div id="fg-kc"></div><details class="fg-kprev"><summary>Preview the kitchen card</summary><div id="fg-kcp"></div></details><p class="fg-after"><strong>' + R.after + "</strong></p></div></div>";
  R.groups.forEach(function(g){ radios($("#fg-sw-" + g.id), { label:g.t, cls:"chips", options:g.opts.map(function(o){ return { id:o.id, t:o.t }; }), value:S[g.id], onChange:function(v){ S[g.id] = v; api.save(); paint(); } }); });
  $(".fg-adds", host).addEventListener("click", function(e){ var b = e.target.closest("[data-add]"); if (!b) return; S[b.dataset.add] = !S[b.dataset.add]; api.save(); paint(); });
  function parts(st){
    var list = R.groups.map(function(g){ return byId(g.opts, st[g.id]); });
    list.splice(4, 0, R.fixed[0], R.fixed[1]);
    R.adds.forEach(function(a){ if (st[a.id]) list.push(a); });
    return list;
  }
  function calc(st){
    var P = parts(st), r = { na:0, sf:0, fib:0, cups:0, veg:0, P:P };
    P.forEach(function(x){ r.na += x.na || 0; r.sf += x.sf || 0; r.fib += x.fib || 0; r.cups += x.cups || 0; if (x.veg) r.veg += x.cups || 0; });
    r.serv = r.cups / R.cupsPerServing; r.pna = r.na / r.serv; r.psf = r.sf / r.serv; r.pfib = r.fib / r.serv;
    r.dna = Math.round(r.pna / R.dv.na * 100); r.dsf = Math.round(r.psf / R.dv.sf * 100);
    r.whole = !!P[0].whole; r.type = P[3].type; r.vshare = r.veg / r.cups;
    return r;
  }
  var ORIG = {}; R.groups.forEach(function(g){ ORIG[g.id] = g.opts[0].id; }); R.adds.forEach(function(a){ ORIG[a.id] = false; });
  function naLevel(d){ return d >= 30 ? "high" : d >= 15 ? "medium" : "lower"; }
  function sfLevel(d){ return d >= 15 ? "high" : "lower"; }
  function vLevel(v){ return v >= 0.3 ? "high" : v >= 0.15 ? "medium" : "low"; }
  function srcBar(r){
    var segs = [], other = 0;
    r.P.forEach(function(x){ var v = (x.na || 0) / r.serv; if (v < 25) { other += v; return; } segs.push([x.line.replace(/^[\d½¼¾ ]+(cups? |tbsp )?/, ""), v, R.groups[1].opts.indexOf(x) >= 0]); });
    if (other > 0.5) segs.push(["other ingredients", other, false]);
    var max = 1100;
    return '<span class="fg-srcb">' + segs.map(function(s){ return '<span class="fg-src' + (s[2] ? " soy" : "") + '" style="width:' + f1(s[1] / max * 100) + '%"></span>'; }).join("") + "</span>" +
      '<span class="tiny fg-srcl">' + segs.map(function(s){ return (s[2] ? "<strong>" : "") + s[0] + " " + Math.round(s[1]) + " mg" + (s[2] ? "</strong>" : ""); }).join(" · ") + "</span>";
  }
  function cardLines(){
    var r = calc(S), P = r.P, out = ["Serves about " + Math.round(r.serv) + " (1½ cups each).", "## Ingredients"];
    P.forEach(function(x){ out.push("- " + x.line); });
    out.push("## Steps");
    R.steps.forEach(function(s, i){ out.push((i + 1) + ". " + (i === 2 && S.fat === "butter" ? "Heat the butter." : s)); });
    out.push("## Safety"); R.safety.forEach(function(s){ out.push("- " + s); });
    out.push("## Allergens", "- " + R.allergens);
    if (S.fat === "butter") out.push("- " + R.allergenMore.milk);
    out.push("- " + R.allergenMore.wheat);
    if (S.kimchi) out.push("- " + R.allergenMore.kimchi);
    out.push("", R.after);
    return out;
  }
  MV.kitchenCardButton($("#fg-kc"), { title:R.title + " (my version)", file:"kitchen-card-weeknight-fried-rice.txt", lines:cardLines });
  function paint(){
    var r = calc(S), o = calc(ORIG), P = r.P;
    $("#fg-rserv").textContent = "· makes about " + Math.round(r.serv) + " servings of 1½ cups";
    var origLines = parts(ORIG).map(function(x){ return x.line; });
    $("#fg-ing").innerHTML = P.map(function(x){ var ch = origLines.indexOf(x.line) < 0; return '<li class="' + (ch ? "chg" : "") + '">' + x.line + (ch ? ' <span class="fg-tag">' + (R.adds.indexOf(x) >= 0 ? "added" : "swapped") + "</span>" : "") + "</li>"; }).join("");
    $$(".fg-adds [data-add]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(!!S[b.dataset.add])); });
    $("#fg-rread").innerHTML = MV.readoutHTML([
      ["Whole grain", r.whole ? "yes" : "no"],
      ["Vegetable share", vLevel(r.vshare) + " (" + nm(r.veg) + " of " + nm(r.cups) + " cups)"],
      ["Sodium per serving", "<strong>" + naLevel(r.dna) + "</strong>: " + Math.round(r.pna) + " mg, " + r.dna + "% DV"],
      ["Saturated fat", "<strong>" + sfLevel(r.dsf) + "</strong>: " + nm(r.psf) + " g, " + r.dsf + "% DV"],
      ["Protein type", r.type]]) + '<p class="tiny muted">Sodium: ' + R.levels.na + ". Saturated fat: " + R.levels.sf + '. <span class="hfa-model">Model data</span></p>';
    function row(t, a, b, u, dv){ return "<tr><th scope=\"row\">" + t + "</th><td>" + a + " " + u + (dv ? " (" + dv[0] + "% DV)" : "") + "</td><td>" + b + " " + u + (dv ? " (" + dv[1] + "% DV)" : "") + "</td></tr>"; }
    $("#fg-rdata").innerHTML = '<div class="tbl-wrap"><table class="fg-tbl"><thead><tr><th scope="col">Per serving</th><th scope="col">Original</th><th scope="col">Your version</th></tr></thead><tbody>' +
      row("Sodium", Math.round(o.pna), Math.round(r.pna), "mg", [o.dna, r.dna]) + row("Saturated fat", nm(o.psf), nm(r.psf), "g", [o.dsf, r.dsf]) + row("Fibre", nm(o.pfib), nm(r.pfib), "g") + "</tbody></table></div>" +
      '<p class="fg-srct"><strong>Where the sodium comes from (per serving)</strong></p><div class="fg-srcw"><span class="fg-srcn">Original</span>' + srcBar(o) + '</div><div class="fg-srcw"><span class="fg-srcn">Your version</span>' + srcBar(r) + "</div>" +
      '<p class="tiny muted">Computed from model ingredient values. <span class="hfa-model">Model data</span></p>';
    $("#fg-kcp").innerHTML = '<div class="fg-kcard">' + cardLines().map(function(l){ return /^##\s*/.test(l) ? "<h5>" + l.replace(/^##\s*/, "") + "</h5>" : /^-\s+/.test(l) ? '<p class="b">• ' + l.replace(/^-\s+/, "") + "</p>" : l ? "<p>" + l + "</p>" : ""; }).join("") + "</div>";
  }
  paint();
  return {};
}

// ---------- Practice 2: Evidence, history and the world (custom: chips, number entry N4, multi-set chips) ----------
function evidence(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, val:"", tries:0, hint:0, solved:false, first:null }); }
  function order(it, key, n){ return MV.shuffle(Array.from({ length:n }, function(_, i){ return i; }), "fg-" + it.id + key); }
  function chipsHTML(it, x, list, key, sel, label){
    return '<div class="fg-tchips" role="radiogroup" aria-label="' + esc(MV.plain(label)) + '">' + order(it, key, list.length).map(function(i){
      var on = sel === i, good = x.solved && MV.ok(list[i]);
      return '<button type="button" class="chip' + (on ? " on" : "") + (good ? " fg-right" : "") + '" role="radio" aria-checked="' + on + '" data-set="' + key + '" data-ci="' + i + '" data-k="' + it.id + key + i + '"' + (x.solved ? " disabled" : "") + ">" + list[i].t + "</button>";
    }).join("") + "</div>";
  }
  function qHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">H' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Investigation" : "") + "</span>" : "") + "</div>";
    if (it.kind === "chips") h += chipsHTML(it, x, it.chips, "main", x.pick, "Choices");
    else if (it.kind === "num") h += '<div class="numrow"><label for="fgn-' + it.id + '">' + it.label + ':</label><input class="numin" id="fgn-' + it.id + '" data-tn="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + it.unit + "</span></div>";
    else it.sets.forEach(function(s){ var pk = x.pick || {}; h += '<div class="fg-tset"><p class="fg-tsl">' + s.label + "</p>" + chipsHTML(it, x, s.chips, s.id, pk[s.id], s.label) + "</div>"; });
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].skip ? "" : "bad") + '" role="status"><p>' + msgs[it.id].h + "</p></div>";
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(qHTML).join("");
  function item(id){ return byId(a.items, id); }
  function repaint(it){
    var box = host.querySelector('[data-ti="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ", TA = " Try again.";
    if (it.kind === "chips") {
      if (x.pick == null) return { skip:true, msg:"Tap a choice first." };
      return MV.ok(it.chips[x.pick]) ? { ok:true } : { msg:NQ + it.fb + TA };
    }
    if (it.kind === "num") {
      var r = MV.parseNum(x.val); if (!r) return { skip:true, msg:"Enter a number, such as 25 or 12.5." };
      var v = r[0]; if (Math.abs(v - MV.ans(it)) < 0.51) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 0.51; })[0];
      return { msg:NQ + (w ? w.fb : it.wrongDefault) + TA };
    }
    var pk = x.pick || {};
    if (it.sets.some(function(s){ return pk[s.id] == null; })) return { skip:true, msg:"Choose one answer in each row." };
    return it.sets.every(function(s){ return MV.ok(s.chips[pk[s.id]]); }) ? { ok:true } : { msg:NQ + it.fb + TA };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.tn; if (!id) return; ist(id).val = e.target.value; msgs[id] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.tn) { var b = host.querySelector('[data-k="' + e.target.dataset.tn + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest && e.target.closest("[data-ci]"); if (!c) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var sibs = $$('[data-ci][data-set="' + c.dataset.set + '"]', c.parentNode), k = sibs.indexOf(c), nb = sibs[(k + d + sibs.length) % sibs.length]; if (nb) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ti]"); if (!box) return;
    var it = item(box.dataset.ti), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.ci != null) { var ci = +b.dataset.ci; if (it.kind === "sets") { x.pick = x.pick || {}; x.pick[b.dataset.set] = ci; } else x.pick = ci; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = { h:r.msg, skip:!!r.skip }; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Rui's plate (two vegetables or fruits, one grain, protein and drink; live checklist) ----------
var task = (function(){
  var api = null, rg = {};
  function TK(){ return MV.C.task; }
  function row(id){ return byId(TK().rows, id); }
  function itemOf(rid, id){ return byId(row(rid).items, id); }
  function read(){ var s = (api && api.S) || {}; return { v:(Array.isArray(s.v) ? s.v.slice(0, 2) : []).filter(function(x){ return itemOf("v", x); }), g:s.g || "", p:s.p || "", d:s.d || "" }; }
  function full(d){ return d.v.length === 2 && d.v[0] !== d.v[1] && !!(d.g && d.p && d.d); }
  function cost(d){ var c = 0; d.v.forEach(function(x){ c += itemOf("v", x).c; }); [["g", d.g], ["p", d.p], ["d", d.d]].forEach(function(q){ var it = q[1] && itemOf(q[0], q[1]); if (it) c += it.c; }); return c; }
  function checks(d){
    var g = d.g && itemOf("g", d.g), p = d.p && itemOf("p", d.p), dr = d.d && itemOf("d", d.d);
    return [d.v.length === 2 && d.v[0] !== d.v[1] && d.v.some(function(x){ return itemOf("v", x).veg; }), !!(g && g.whole), !!(p && p.vegn), !!(dr && dr.cad), full(d) && cost(d) <= TK().budget];
  }
  function keyOf(d){ return d.v.slice().sort().join("+") + "|" + d.g + "|" + d.p + "|" + d.d; }
  function fromKey(k){ var p = k.split("|"); return { v:p[0].split("+"), g:p[1], p:p[2], d:p[3] }; }
  function label(k){ var d = fromKey(k), names = d.v.map(function(x){ return lc(itemOf("v", x).t); }).concat([lc(itemOf("g", d.g).t), lc(itemOf("p", d.p).t), lc(itemOf("d", d.d).t)]); return names.join(" + ") + " (" + money(cost(d)) + ")"; }
  function tagsOf(rid, it){
    var tg = TK().tags, b = [];
    if (rid === "v") b.push(it.veg ? tg.veg : tg.fruit);
    if (rid === "g") { b.push(it.whole ? tg.whole : tg.refined); if (it.salty) b.push(tg.salty); }
    if (rid === "p" && it.vegn) b.push(tg.vegetarian);
    if (rid === "d" && it.cad) b.push(tg.cad);
    return b;
  }
  function optT(rid, it){ var b = tagsOf(rid, it); return it.t + ' <span class="fg-tk">' + money(it.c) + (b.length ? " · " + b.join(", ") : "") + "</span>"; }
  function paint(){
    var d = read(), pv = $("#fg-tkpv"); if (!pv) return;
    ["g", "p", "d"].forEach(function(k){ rg[k].set(d[k]); });
    $$("#tk-v [data-tv]").forEach(function(b){ b.setAttribute("aria-pressed", String(d.v.indexOf(b.dataset.tv) >= 0)); });
    var c = cost(d), B = TK().budget, V = d.v.map(function(x){ return itemOf("v", x); }), g = d.g && itemOf("g", d.g), p = d.p && itemOf("p", d.p), dr = d.d && itemOf("d", d.d);
    var cx = 70, cy = 70, r = 54, h = '<svg class="fg-tsvg" viewBox="0 0 190 150" role="img" aria-label="' + esc("Rui’s plate: " + (V.map(function(x){ return x.t; }).concat([g && g.t, p && p.t]).filter(Boolean).join(", ") || "empty") + (dr ? "; drink: " + dr.t : "")) + '">';
    h += '<circle class="fg-crim" cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '"/>';
    [[V[0], Math.PI * 1.5, Math.PI * 2, "fg-cvf"], [V[1], Math.PI, Math.PI * 1.5, "fg-cvf"], [g, 0, Math.PI / 2, "fg-cgr"], [p, Math.PI / 2, Math.PI, "fg-cpf"]].forEach(function(q){
      var m = pt(cx, cy, r * 0.56, (q[1] + q[2]) / 2); h += '<path class="' + (q[0] ? q[3] : "fg-cempty") + '" d="' + wedgeD(cx, cy, r, q[1], q[2]) + '"/>' + (q[0] ? lines(m[0], m[1] + 3, two(lc(q[0].t)), "fg-sts", 9) : "");
    });
    h += glassSVG(160, 78, dr ? lc(dr.t).replace("unsweetened fortified ", "") : "drink?", dr ? (dr.cad ? "fg-cmilk" : dr.id === "D1" ? "fg-cwa" : "fg-cjuice") : "fg-cempty") + "</svg>";
    h += '<p class="fg-tcost"><strong>Cost:</strong> ' + money(c) + " of " + money(B) + '</p><div class="fg-tbar" aria-hidden="true"><span class="fg-tfill' + (c > B ? " over" : "") + '" style="width:' + f1(clamp(c / 400, 0, 1) * 100) + '%"></span><span class="fg-tmark" style="left:' + f1(B / 400 * 100) + '%"></span></div><p class="tiny muted">The dashed line marks the $2.50 budget. <span class="hfa-model">Model prices</span></p>';
    pv.innerHTML = h;
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S; if (!Array.isArray(s.v)) s.v = [];
      var V = row("v");
      inp.innerHTML = '<div class="fg-tin"><div id="tk-v"><p class="fg-rgl">' + V.t + '</p><div class="fg-chipset" role="group" aria-label="' + esc(V.t) + '">' +
        V.items.map(function(it){ return '<button type="button" data-tv="' + it.id + '" data-k="tkv' + it.id + '" aria-pressed="false">' + optT("v", it) + "</button>"; }).join("") + '</div><p class="tiny muted">Choose two. A third choice replaces the first.</p></div>' +
        ["g", "p", "d"].map(function(k){ return '<div id="tk-' + k + '"></div>'; }).join("") + "</div>";
      $("#tk-v").addEventListener("click", function(e){
        var b = e.target.closest("[data-tv]"); if (!b) return; var id = b.dataset.tv, k = s.v.indexOf(id);
        if (k >= 0) s.v.splice(k, 1); else { s.v.push(id); if (s.v.length > 2) s.v.shift(); }
        a.save(); paint(); a.update();
      });
      ["g", "p", "d"].forEach(function(k){
        var r = row(k);
        rg[k] = radios($("#tk-" + k), { label:r.t, cls:"chips", options:r.items.map(function(it){ return { id:it.id, t:optT(k, it) }; }), value:s[k] || "", onChange:function(v){ s[k] = v; a.save(); paint(); a.update(); } });
      });
      pv.innerHTML = '<div id="fg-tkpv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose two different vegetables or fruits, and one item from each other row."; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(label(k)); },
    text:label
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ evidence:evidence },
  task:task
});
})();
