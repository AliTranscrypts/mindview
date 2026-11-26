// HFA4U 07 Infant & Toddler Nutrition: hero (six dishes on an age line), First foods timeline (Explore: F6-style life-stage
// switcher with Timeline / Safe plate / Mealtime coach modes and persona chips; the TC1 day planner lives inside its challenge
// card), Products for the youngest (Part 3: F13-style product cards with "Check it with data"), and "Sasha's day" (task:
// F2-style toddler day planner with a Food Guide plate per meal, plus the kitchen card). Plan wording lives in content.mjs;
// this file adds control labels only.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ return (list || []).filter(function(x){ return x.id === id; })[0]; }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function G(x, y, s, inner, op){ return '<g transform="translate(' + f1(x) + " " + f1(y) + ") scale(" + f1(s * 100) / 100 + ')"' + (op != null && op < 1 ? ' opacity="' + f1(op * 100) / 100 + '"' : "") + ">" + inner + "</g>"; }
function T(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 04 / 03; adds a per-option class) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="it-rgw">' + (o.label ? '<span class="it-rgl">' + o.label + "</span>" : "") + '<span class="it-rg ' + (o.cls === "chips" ? "it-chipset" : "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), k = ids.indexOf(val);
    choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : (k + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- @component itDishes — the seven feeding-stage dishes (64 × 64 box centred on 0, 0); --ink outlines in both themes,
// milk in blue (fluids), Food Guide sections in --leaf / brown / magenta ----------
function finger(x1, y1, x2, y2){ var d = "M" + x1 + " " + y1 + "L" + x2 + " " + y2; return '<path class="it-fo" d="' + d + '"/><path class="it-fi" d="' + d + '"/>'; }
function bowl(){ return '<path class="it-o" d="M-26 -4H26C25 12 14 22 0 22C-14 22 -25 12 -26 -4Z"/><path class="it-o" d="M-8 22h16v3h-16Z"/>'; }
var DISH = [
  // 0: bottle and a breastfeeding icon
  function(o){
    o = o || {};
    var bottle = '<path class="it-o" d="M-25 -6h16v26a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4Z"/><path class="it-milk" d="M-25 6h16v14a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4Z"/>' +
      '<path class="it-ln" d="M-25 2h4M-25 10h4M-25 18h4"/><rect class="it-o" x="-26" y="-11" width="18" height="5" rx="1.5"/><path class="it-o" d="M-21 -11C-21 -20 -13 -20 -13 -11Z"/>';
    var bf = '<path class="it-o" d="M5 24C5 4 9 -5 16 -5C23 -5 27 4 27 24Z"/><circle class="it-o" cx="16" cy="-12" r="5.5"/>' +
      '<ellipse class="it-milk" cx="16" cy="10" rx="8.5" ry="4.6" transform="rotate(-18 16 10)"/><circle class="it-o" cx="9" cy="7" r="3.8"/><path class="it-ln" d="M7 15C12 19 21 18 26 11"/>';
    return (o.fadeBottle != null ? '<g opacity="' + f1(1 - 0.65 * o.fadeBottle) + '">' + bottle + "</g>" : bottle) + bf;
  },
  // 1: a spoon of mashed lentils
  function(){
    return '<path class="it-o" d="M6 3L29 18L27 21.5L4 7.5Z"/><ellipse class="it-o" cx="-9" cy="0" rx="18" ry="10.5"/>' +
      '<path class="it-pr" d="M-23 1C-21 -7 -13 -8.5 -8 -6.5C-3 -9.5 4 -6.5 5 -1C2 5.5 -17 6.5 -23 1Z"/>' +
      [[-16, -2], [-11, -4.5], [-5, -3.5], [-1, -1], [-12, 1.5], [-6, 1.5]].map(function(p){ return '<circle class="it-prd" cx="' + p[0] + '" cy="' + p[1] + '" r="1.5"/>'; }).join("");
  },
  // 2: a bowl of mashed, lumpy food
  function(){
    return '<path class="it-vf" d="M-23 -4C-21 -12 -15 -10 -11 -12C-7 -15 -3 -10 1 -12C5 -15 9 -10 13 -12C17 -13 21 -9 23 -4Z"/>' + bowl() +
      [[-13, -8], [-3, -9.5], [8, -8.5], [15, -6.5], [-18, -6]].map(function(p){ return '<circle class="it-vfd" cx="' + p[0] + '" cy="' + p[1] + '" r="2"/>'; }).join("");
  },
  // 3: soft finger foods, one lifted in a pincer grasp (grasp 0 = on the plate, 1 = lifted)
  function(o){
    o = o || {}; var g = o.grasp == null ? 1 : o.grasp, y = 7 - 15 * g;
    return '<ellipse class="it-o" cx="-3" cy="13" rx="27" ry="11"/><ellipse class="it-ln" cx="-3" cy="13" rx="20" ry="7.5"/>' +
      '<rect class="it-vf" x="-21" y="9" width="11" height="6" rx="3"/><rect class="it-pr" x="-8" y="13" width="10" height="6" rx="3"/><rect class="it-gr" x="7" y="10" width="9" height="6" rx="3"/>' +
      '<g transform="translate(2 ' + f1(y) + ')"><rect class="it-vf" x="-3.5" y="-2.5" width="7" height="5" rx="2.5"/>' + finger(13, -12, 2.5, -3.6) + finger(16, -4, 3, 3.6) + '<circle class="it-o" cx="17" cy="-10" r="6.5"/></g>';
  },
  // 4: an open cup of milk (the cup replaces the bottle)
  function(){
    return '<path class="it-of" d="M-13 -10C-22 -10 -22 5 -11.5 5"/><path class="it-of" d="M13 -10C22 -10 22 5 11.5 5"/>' +
      '<path class="it-o" d="M-14 -18H14L11 20C6 24 -6 24 -11 20Z"/><path class="it-milk" d="M-13.2 -6H13.2L11 20C6 24 -6 24 -11 20Z"/>';
  },
  // 5: a toddler's bowl with a spoon
  function(){
    return '<path class="it-o" d="M5 -3L23 -24L26.5 -21L9 0Z"/><path class="it-gr" d="M-23 -4C-17 -11 -6 -9 0 -11C8 -13 16 -9 23 -4Z"/>' + bowl() +
      [[-12, -7], [-4, -9], [10, -8]].map(function(p){ return '<circle class="it-vfd" cx="' + p[0] + '" cy="' + p[1] + '" r="2.2"/>'; }).join("") +
      '<ellipse class="it-o" cx="4" cy="-6" rx="7" ry="3.2" transform="rotate(-40 4 -6)"/>';
  },
  // 6: a toddler's divided plate: half vegetables and fruits, a quarter whole grains, a quarter protein foods
  function(o){
    o = o || {}; var p = o.fill == null ? 1 : o.fill;
    return '<circle class="it-o" cx="0" cy="0" r="28"/>' +
      '<g opacity="' + f1(p) + '"><path class="it-vf" d="M0 -22A22 22 0 0 0 0 22Z"/><path class="it-gr" d="M0 0V-22A22 22 0 0 1 22 0Z"/><path class="it-pr" d="M0 0H22A22 22 0 0 1 0 22Z"/>' +
      [[-12, -7], [-8, 4], [-14, 9], [-6, -13], [-15, -1]].map(function(q){ return '<circle class="it-vfd" cx="' + q[0] + '" cy="' + q[1] + '" r="2.6"/>'; }).join("") +
      [[7, -8], [12, -12], [6, -15], [14, -5], [10, -4]].map(function(q){ return '<circle class="it-grd" cx="' + q[0] + '" cy="' + q[1] + '" r="1.3"/>'; }).join("") +
      '<rect class="it-prd" x="6" y="5" width="9" height="5" rx="2"/><rect class="it-prd" x="4" y="12" width="7" height="4" rx="2"/></g>' +
      '<circle class="it-ln" cx="0" cy="0" r="22"/><path class="it-ln" d="M0 -22V22M0 0H22"/>';
  }
];
function dishSVG(i, cls, label){ return '<svg class="' + cls + '" viewBox="-32 -32 64 64"' + (label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true"') + ">" + DISH[i]() + "</svg>"; }

// small inline icons (text always sits next to them)
var ICO = {
  milk:'<svg class="it-ico" viewBox="0 0 16 16" aria-hidden="true"><path class="it-milk" d="M8 1.5C5 6 3.5 8.5 3.5 10.5a4.5 4.5 0 0 0 9 0C12.5 8.5 11 6 8 1.5Z"/></svg>',
  allg:'<svg class="it-ico" viewBox="0 0 16 16" aria-hidden="true"><circle class="it-of" cx="8" cy="8" r="6.2"/><path class="it-ln" d="M8 4.6v4.4"/><circle class="it-dot" cx="8" cy="11.4" r="1"/></svg>',
  no:'<svg class="it-ico" viewBox="0 0 16 16" aria-hidden="true"><circle class="it-of" cx="8" cy="8" r="6.2"/><path class="it-ln" d="M3.7 12.3L12.3 3.7"/></svg>',
  hz:'<svg class="it-ico" viewBox="0 0 16 16" aria-hidden="true"><path class="it-hz" d="M8 1.8L15 14H1Z"/><path class="it-ln" d="M8 6v4"/><circle class="it-dot" cx="8" cy="12" r=".9"/></svg>',
  ok:'<svg class="it-ico" viewBox="0 0 16 16" aria-hidden="true"><circle class="it-of" cx="8" cy="8" r="6.2"/><path class="it-ln" d="M5 8.3l2 2 4-4.3"/></svg>'
};
function ironTag(t){ return '<span class="it-tag it-iron">' + (t || "iron-rich") + "</span>"; }
function allgTag(t){ return '<span class="it-tag it-allg">' + ICO.allg + (t || "allergen") + "</span>"; }

// ---------- hero: six dishes appear as an age marker slides from 0 to 36 months ----------
var H_AGE = [0, 6, 7.5, 9, 12, 24], H_LAB = ["0–6 mo", "6 mo", "7–8 mo", "9 mo", "12 mo", "2 yr"], H_DISH = [0, 1, 2, 3, 4, 6];
function hx(m){ return 20 + m / 36 * 320; }
function heroSVG(m, rm){
  var h = "", dx = function(i){ return 32 + i * 59.2; }, Y = 82, AX = 172;
  function on(a, w){ return rm ? 1 : seg01(m, a, a + (w || 1.2)); }
  // age line with the milk-only stretch and month ticks
  h += '<path class="it-axis" d="M20 ' + AX + 'H340"/><path class="it-milkbar" d="M' + f1(hx(0)) + " " + AX + "H" + f1(hx(6)) + '"/>';
  for (var k = 0; k <= 36; k += 6) h += '<path class="it-ln" d="M' + f1(hx(k)) + " " + (AX - 4) + "v8" + '"/>' + T(hx(k), AX + 18, String(k), "it-hlab");
  h += T(340, AX + 34, "age (months)", "it-hlab", "end") + T(hx(3), AX - 9, "milk only", "it-hmilk");
  H_AGE.forEach(function(a, i){
    var p = on(a), x = dx(i);
    if (p <= 0) return;
    h += '<path class="it-lead" opacity="' + f1(p) + '" d="M' + f1(x) + " " + (Y + 40) + "L" + f1(hx(a)) + " " + (AX - 6) + '"/>';
    var o = {};
    if (i === 0) o.fadeBottle = on(12, 1.5);
    if (i === 3) o.grasp = on(9.4, 1.6);
    if (i === 5) o.fill = on(24, 3);
    h += G(x, Y, 0.78 * (0.7 + 0.3 * p), DISH[H_DISH[i]](o), p) + T(x, Y + 36, H_LAB[i], "it-hlab b", "middle");
  });
  // tags: iron at 6 months, pincer grasp at 9, cup at 12, Food Guide plate at 24
  var iron = on(6.3, 0.9);
  if (iron > 0) h += G(dx(1), 37, 0.6 + 0.4 * iron, '<rect class="it-irbg" x="-27" y="-9" width="54" height="17" rx="8.5"/>' + T(0, 3.5, "iron-rich", "it-irt"), iron);
  var pin = on(9.6, 1.2);
  if (pin > 0) h += G(dx(3), 37, 1, '<rect class="it-tgbg" x="-37" y="-9" width="74" height="17" rx="8.5"/>' + T(0, 3.5, "pincer grasp", "it-tgt"), pin);
  var cup = on(12.3, 1.4);
  if (cup > 0) h += G(dx(4), 14, 1, '<rect class="it-tgbg" x="-56" y="-9" width="112" height="17" rx="8.5"/>' + T(0, 3.5, "cup replaces bottle", "it-tgt"), cup);
  var pl = on(25, 3);
  if (pl > 0) h += '<g opacity="' + f1(pl) + '"><rect class="it-sw-vf" x="166" y="' + (AX + 42) + '" width="10" height="10" rx="2"/>' + T(181, AX + 51, MV.C.explore.plateGuide.split(",")[0] + " at 2 years", "it-hlab", "start") + "</g>";
  // the age marker
  if (!rm) h += '<path class="it-mark" d="M' + f1(hx(m) - 6) + " " + (AX - 16) + "h12l-6 9Z" + '"/>';
  return h;
}
function hero(f){
  var host = $("#it-hero"); if (!host) return;
  var H = MV.C.hero;
  host.innerHTML = '<svg class="it-hsvg" viewBox="0 0 360 230" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild;
  function cap(){ if (f.cap) f.cap.textContent = H.caption; }
  if (MV.reduceMotion) { svg.innerHTML = heroSVG(36, true); cap(); return; }
  svg.innerHTML = heroSVG(0, false);
  MV.wait(500, function(){ MV.tween({ dur:6400, ease:function(t){ return t; }, step:function(t){ svg.innerHTML = heroSVG(t * 36, false); }, done:function(){ svg.innerHTML = heroSVG(36, true); cap(); } }); });
}

// ---------- safe-plate drawings (top view; foods in their Food Guide colours, every food labelled) ----------
function rep(n, fn){ var s = ""; for (var i = 0; i < n; i++) s += fn(i); return s; }
var FOODART = {
  grapes:function(p){
    if (p === "whole") return rep(5, function(i){ var a = i * 1.26; return '<circle class="it-vf" cx="' + f1(9 * Math.cos(a)) + '" cy="' + f1(9 * Math.sin(a)) + '" r="7.5"/>'; });
    if (p === "half") return rep(6, function(i){ var a = i * 1.05, x = 11 * Math.cos(a), y = 9 * Math.sin(a); return '<path class="it-vf" d="M' + f1(x - 7) + " " + f1(y) + "A7 7 0 0 1 " + f1(x + 7) + " " + f1(y) + 'Z"/>'; });
    return rep(10, function(i){ var a = i * 0.63, x = 12 * Math.cos(a), y = 10 * Math.sin(a); return '<path class="it-vf" d="M' + f1(x) + " " + f1(y) + "l7 0a7 7 0 0 1-7 7Z" + '" transform="rotate(' + (i * 37) + " " + f1(x) + " " + f1(y) + ')"/>'; });
  },
  popcorn:function(p){
    if (p === "remove") return '<circle class="it-gone" cx="0" cy="0" r="17"/>' + T(0, 4, "removed", "it-flab2");
    return '<ellipse class="it-o" cx="0" cy="4" rx="19" ry="12"/>' + rep(7, function(i){ var a = i * 0.9; return '<circle class="it-gr" cx="' + f1(9 * Math.cos(a)) + '" cy="' + f1(2 + 6 * Math.sin(a)) + '" r="4.4"/>'; });
  },
  hotdog:function(p){
    if (p === "rounds") return rep(5, function(i){ var x = -20 + i * 10; return '<circle class="it-pr" cx="' + x + '" cy="' + (i % 2 ? 4 : -4) + '" r="6.5"/><circle class="it-ln" cx="' + x + '" cy="' + (i % 2 ? 4 : -4) + '" r="3.4"/>'; });
    if (p === "strips") return rep(4, function(i){ return '<rect class="it-pr" x="-24" y="' + (-10 + i * 6) + '" width="48" height="4.2" rx="2"/>'; });
    return '<rect class="it-pr" x="-28" y="-7" width="56" height="14" rx="7"/>';
  },
  carrot:function(p){
    if (p === "grated" ) return rep(16, function(i){ var x = -15 + (i * 7) % 30, y = -9 + Math.floor(i / 4) * 5.5; return '<path class="it-shred" d="M' + x + " " + y + "l6 " + (i % 2 ? 2 : -2) + '"/>'; });
    if (p === "cooked" || p === "soft") return rep(4, function(i){ var y = -10 + i * 6.5; return '<path class="it-vf" d="M-20 ' + y + "C-8 " + (y - 3) + " 6 " + (y + 3) + " 20 " + y + "a2.6 2.6 0 0 1 0 5.2C6 " + (y + 8) + " -8 " + (y + 2) + " -20 " + (y + 5.2) + 'a2.6 2.6 0 0 1 0-5.2Z"/>'; });
    return rep(4, function(i){ return '<rect class="it-vf" x="-21" y="' + (-11 + i * 6.5) + '" width="42" height="5" rx="1"/>'; });
  },
  pb:function(p){
    if (p === "spread") return '<rect class="it-gr" x="-17" y="-15" width="34" height="30" rx="5"/><rect class="it-pr" x="-13" y="-11" width="26" height="22" rx="3"/>';
    return '<path class="it-o" d="M6 2L26 14L24 17L4 6Z"/><ellipse class="it-o" cx="-6" cy="-1" rx="15" ry="10"/><path class="it-pr" d="M-17 -1C-17 -12 4 -12 4 -2C4 6 -17 8 -17 -1Z"/>';
  },
  peanut:function(p){
    if (p === "thinned") return '<ellipse class="it-o" cx="0" cy="3" rx="20" ry="12"/><ellipse class="it-gr" cx="0" cy="1" rx="15" ry="8"/><path class="it-swirl" d="M-8 1C-6 -4 6 -4 6 1C6 5 -4 5 -3 1"/>';
    return rep(4, function(i){ var x = -16 + (i % 2) * 18, y = i < 2 ? -6 : 7; return '<path class="it-pr" d="M' + x + " " + y + "a5 5 0 0 1 8 -1a5 5 0 1 1 0 6a5 5 0 0 1-8-5Z" + '"/>'; });
  },
  almond:function(p){
    if (p === "remove") return '<circle class="it-gone" cx="0" cy="0" r="17"/>' + T(0, 4, "removed", "it-flab2");
    return rep(4, function(i){ var x = -12 + (i % 2) * 16, y = i < 2 ? -6 : 7; return '<path class="it-pr" d="M' + (x - 7) + " " + y + "Q" + x + " " + (y - 9) + " " + (x + 8) + " " + y + "Q" + x + " " + (y + 6) + " " + (x - 7) + " " + y + 'Z"/>'; });
  }
};
var PLATE_POS = { 5:[[-58, -38], [12, -48], [70, -2], [10, 46], [-62, 28]], 3:[[-52, -22], [44, -22], [0, 42]] };
function plateSVG(foods, sel){
  var pos = PLATE_POS[foods.length] || PLATE_POS[5], h = '<ellipse class="it-o" cx="150" cy="112" rx="132" ry="100"/><ellipse class="it-ln" cx="150" cy="112" rx="112" ry="82"/>';
  foods.forEach(function(f, i){
    var p = byId(f.preps, sel[f.id]) || f.preps[0], x = 150 + pos[i][0], y = 108 + pos[i][1], art = FOODART[f.id] || FOODART.carrot;
    h += G(x, y, 1, art(p.id)) + T(x, y + 30, f.t, "it-flab");
    if (!MV.ok(p)) h += G(x + 27, y - 17, 1.2, hzMark());
  });
  return h;
}
function hzMark(){ return '<path class="it-hz" d="M0 -7L7 6H-7Z"/><path class="it-ln" d="M0 -2v3.5"/><circle class="it-dot" cx="0" cy="3.6" r=".9"/>'; }

// ---------- mealtime scenes (objects and speech bubbles only: no bodies) ----------
function sceneSVG(pers, m){
  var h = '<path class="it-ln" d="M10 168H290"/>';
  function plate(x, y, inner){ return G(x, y, 1, '<ellipse class="it-o" cx="0" cy="0" rx="62" ry="24"/><ellipse class="it-ln" cx="0" cy="0" rx="50" ry="18"/>' + inner); }
  function broc(x, y, s){ return G(x, y, s || 1, '<path class="it-stem" d="M0 10V0"/><circle class="it-vf" cx="-5" cy="-2" r="5"/><circle class="it-vf" cx="5" cy="-2" r="5"/><circle class="it-vf" cx="0" cy="-7" r="5.5"/>'); }
  function pasta(x, y, n){ return G(x, y, 1, rep(n, function(i){ return '<path class="it-pasta" d="M' + (-14 + (i % 4) * 8) + " " + (-6 + Math.floor(i / 4) * 6) + 'q3-4 6 0t6 0"/>'; })); }
  function bubble(x, y, s){ return '<path class="it-bub" d="M' + (x - 44) + " " + (y - 18) + "h88a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-60l-12 12v-12h-16a8 8 0 0 1-8-8v-20a8 8 0 0 1 8-8Z" + '"/>' + T(x, y + 4, s, "it-bubt"); }
  if (pers === "ayo") {
    h += G(150, 132, 1, '<path class="it-o" d="M-70 0H70L62 28H-62Z"/>') + G(136, 118, 1, '<ellipse class="it-o" cx="0" cy="0" rx="34" ry="13"/><ellipse class="it-pr" cx="0" cy="-2" rx="26" ry="8"/>') +
      G(200, 104, 1, '<path class="it-o" d="M-6 -2L30 -24L32 -20L-3 3Z"/><ellipse class="it-o" cx="-12" cy="2" rx="13" ry="7.5"/><ellipse class="it-pr" cx="-12" cy="1" rx="9" ry="4.5"/>') +
      '<path class="it-turn" d="M232 58C262 40 262 92 236 80"/><path class="it-turnh" d="M242 86L235 79.5L244 76"/>' + bubble(110, 46, "turns away");
    return h;
  }
  if (m === 0) {
    h += plate(130, 130, pasta(-14, 0, 8) + broc(30, 4, 0.9) + broc(42, -6, 0.8)) + '<path class="it-push" d="M196 130H236"/><path class="it-pushh" d="M230 124L238 130L230 136"/>' + bubble(150, 52, "pushes it away");
  } else if (m === 1) {
    h += '<rect class="it-o" x="22" y="34" width="70" height="62" rx="6"/><path class="it-cal" d="M22 52H92"/>' + T(57, 47, "tomorrow", "it-calt") + T(57, 82, "dinner", "it-calt2") +
      plate(190, 126, pasta(-26, 0, 8) + broc(18, 2, 0.9) + broc(30, -6, 0.8) + broc(38, 4, 0.75));
  } else {
    h += plate(150, 132, pasta(-14, -2, 5) + broc(30, 2, 0.85)) + bubble(150, 52, "“full!”");
  }
  return h;
}

// ---------- Explore: First foods timeline (@component F6 lifeStageSwitcher, module-specific modes) ----------
function explore(host, api){
  var D = api.content, S = api.S, AG = D.ages, CH = {}, RK = ["milk", "supp", "iron", "tex", "allerg", "skills", "not"];
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  S.mode = ["time", "plate", "coach"].indexOf(S.mode) >= 0 ? S.mode : "time";
  S.age = clamp(Math.round(+S.age) || 0, 0, AG.length - 1);
  S.pers = S.pers === "ayo" ? "ayo" : "sasha";
  S.plate = S.plate || {}; S.food = S.food || {}; S.coach = S.coach || {}; S.cm = S.cm || {};
  ["sasha", "ayo"].forEach(function(k){
    var P = S.plate[k] || (S.plate[k] = {});
    D.plates[k].foods.forEach(function(f){ if (!byId(f.preps, P[f.id])) P[f.id] = f.preps[0].id; });
    var n = D.coach[k].moments.length;
    if (!Array.isArray(S.coach[k]) || S.coach[k].length !== n) S.coach[k] = D.coach[k].moments.map(function(){ return null; });
    S.cm[k] = clamp(+S.cm[k] || 0, 0, n - 1); S.food[k] = clamp(+S.food[k] || 0, 0, D.plates[k].foods.length - 1);
  });
  var t1 = S.tc1 = S.tc1 || {};
  t1.vitD = !!t1.vitD; t1.cur = clamp(+t1.cur || 0, 0, 3);
  if (!Array.isArray(t1.times) || t1.times.length !== 4) t1.times = [[], [], [], []];
  t1.times = t1.times.map(function(a){ return (Array.isArray(a) ? a : []).filter(function(id){ return byId(D.tc1.cards, id); }).slice(0, 2); });
  var fx = { hide:[], hl:[], hlNot:[], iron:1, p3:null }, anim = null, pend = null, msg1 = "";

  host.innerHTML = '<div class="it-ex"><div class="it-ctl"><div id="it-mode"></div><div id="it-pers"></div></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="it-stage" data-mv="graph">' +
    // Timeline
    '<div class="it-panel" id="it-p-time"><div class="it-agerow"><label for="it-age">Age</label><input type="range" id="it-age" min="0" max="' + (AG.length - 1) + '" step="1"><output id="it-agev" for="it-age"></output></div>' +
    '<div class="it-stops" id="it-stops" role="group" aria-label="Age steps"></div>' +
    '<div class="it-tgrid"><div class="it-card"><div id="it-big"></div><p class="it-cardt" id="it-cardt"></p><div class="it-badges" id="it-badges" aria-live="polite"></div><div id="it-tally"></div></div>' +
    '<dl class="read it-read" id="it-read" aria-live="polite"></dl></div></div>' +
    // Safe plate
    '<div class="it-panel" id="it-p-plate" hidden><div class="it-pgrid"><div class="it-platecol"><h4 class="it-h4" id="it-plt"></h4><svg class="it-plate" id="it-plate" viewBox="0 0 300 228" role="img"></svg><p class="it-psum" id="it-psum" aria-live="polite"></p></div>' +
    '<div class="it-foodcol"><div class="it-fpick" id="it-fpick"></div><div id="it-foods"></div></div></div></div>' +
    // Mealtime coach
    '<div class="it-panel" id="it-p-coach" hidden><div class="it-cgrid"><div class="it-scenecol"><svg class="it-scene" id="it-scene" viewBox="0 0 300 180" role="img"></svg><div id="it-moms"></div></div>' +
    '<div class="it-coachcol"><h4 class="it-h4" id="it-ct"></h4><p class="it-mtext" id="it-mt"></p><div class="it-copts" id="it-copts" role="radiogroup" aria-label="Responses"></div><div id="it-cfb" aria-live="polite"></div>' +
    '<h4 class="it-h4">Who decides?</h4><div class="it-meter" id="it-meter"></div></div></div></div>' +
    "</div></div>";

  var modeRG = radios($("#it-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; commit(); } });
  var persRG = radios($("#it-pers"), { label:"Persona", cls:"chips", options:D.personas.map(function(p){ return { id:p.id, t:"<strong>" + p.t + "</strong> <small>" + p.sub + "</small>" }; }), value:S.pers,
    onChange:function(v){ cancelAnim(); S.pers = v; buildFoods(); commit(); } });

  // ===== Timeline =====
  var age = $("#it-age");
  $("#it-stops").innerHTML = AG.map(function(a, i){ return '<button type="button" class="it-stop" data-age="' + i + '" data-k="age' + i + '">' + dishSVG(a.dish, "it-sdish") + '<span class="it-slab">' + a.t + "</span></button>"; }).join("");
  age.addEventListener("input", function(){ cancelAnim(); S.age = +age.value; commit(); });
  $("#it-stops").addEventListener("click", function(e){ var b = e.target.closest("[data-age]"); if (!b) return; cancelAnim(); S.age = +b.dataset.age; commit(); });
  function rowVal(k, a){
    var r = a.rows[k];
    if (k === "not") return '<span class="it-nos">' + r.map(function(id){ return '<span class="it-no' + (fx.hlNot.indexOf(id) >= 0 ? " it-nohl" : "") + '">' + ICO.no + D.notYet[id] + "</span>"; }).join("") + "</span>";
    var pre = k === "milk" ? ICO.milk : k === "iron" && S.age > 0 ? ironTag("iron") + " " : k === "allerg" && S.age > 0 ? allgTag() + " " : "";
    return pre + r + (D.rules[k] ? '<small class="it-rule">Rule: ' + D.rules[k] + "</small>" : "");
  }
  function paintTime(){
    var a = AG[S.age];
    age.value = S.age; age.setAttribute("aria-valuetext", a.t); $("#it-agev").textContent = a.t;
    $$("#it-stops [data-age]").forEach(function(b){ var on = +b.dataset.age === S.age; b.classList.toggle("it-on", on); b.setAttribute("aria-pressed", on); });
    $("#it-big").innerHTML = '<svg class="it-bigdish" viewBox="-36 -36 72 72" role="img" aria-label="' + esc("Feeding at " + a.t) + '">' + DISH[a.dish]() + "</svg>";
    $("#it-cardt").textContent = a.t;
    var b = [];
    if (S.age >= 1 && S.age <= 3 && fx.iron > 0) b.push('<span class="it-pop" style="transform:scale(' + f1(fx.iron) + ')">' + ironTag("iron-rich first") + "</span>");
    if (S.age >= 1 && S.age <= 2 && fx.hide.indexOf("allerg") < 0) b.push(allgTag("allergens start"));
    if (S.age === 3) b.push('<span class="it-tag">pincer grasp</span>');
    if (S.age === 4) b.push('<span class="it-tag">' + ICO.milk + "cup replaces bottle</span>");
    if (S.age === 6) b.push('<span class="it-tag it-vftag">' + D.plateGuide + "</span>");
    $("#it-badges").innerHTML = b.join("");
    $("#it-read").innerHTML = RK.map(function(k){
      var hid = fx.hide.indexOf(k) >= 0, hl = fx.hl.indexOf(k) >= 0;
      return '<div class="it-row' + (hl ? " it-hl" : "") + '" data-row="' + k + '"><dt>' + D.rowNames[k] + "</dt><dd>" + (hid ? '<span class="it-q">?</span> <span class="muted">Make your prediction first.</span>' : rowVal(k, a)) + "</dd></div>";
    }).join("");
    tallyPaint();
  }
  function tallyPaint(){
    var box = $("#it-tally"), show = fx.p3 != null || (S.age >= 5 && MV.S.preds && MV.S.preds.p3);
    if (!show) { box.innerHTML = ""; return; }
    var n = fx.p3 != null ? fx.p3 : D.tally.max, Y = D.tally, h = '<svg class="it-tsvg" viewBox="0 0 250 64" role="img" aria-label="' + esc(Y.title + ": " + n + " of " + Y.max + " tries shown; " + Y.band + ".") + '">';
    var X = function(i){ return 12 + i * 15 + Math.floor(i / 5) * 6; };
    h += '<rect class="it-band" x="' + f1(X(7) - 6) + '" y="4" width="' + f1(X(14) - X(7) + 12) + '" height="38" rx="5"/>';
    for (var i = 0; i < Y.max; i++) { var x = X(i); h += i < n ? (i % 5 === 4 ? '<path class="it-tm" d="M' + f1(X(i - 4) - 4) + " 34L" + f1(x - 4) + ' 12"/>' : '<path class="it-tm" d="M' + f1(x) + " 10V36" + '"/>') : '<path class="it-tm0" d="M' + f1(i % 5 === 4 ? x - 4 : x) + " 10V36" + '"/>'; }
    h += T(f1((X(7) + X(14)) / 2), 56, Y.band, "it-blab") + "</svg>";
    box.innerHTML = '<p class="it-tt">' + Y.title + ": <strong>" + n + "</strong></p>" + h;
  }

  // ===== Safe plate =====
  var foodRG = [], pickRG = null;
  function buildFoods(){
    var P = D.plates[S.pers], box = $("#it-foods");
    box.innerHTML = P.foods.map(function(f, i){ return '<div class="it-food" data-food="' + f.id + '"><h5>' + f.t + ' <span class="it-risk">' + ICO.hz + "risk: " + D.riskNames[f.risk] + '</span></h5><div class="it-prep" id="it-prep-' + i + '"></div><p class="it-fread" aria-live="polite"></p></div>'; }).join("");
    foodRG = P.foods.map(function(f, i){
      return radios($("#it-prep-" + i, box), { label:"", aria:f.t + ": preparation", cls:"chips", options:f.preps.map(function(p){ return { id:p.id, t:p.t }; }), value:S.plate[S.pers][f.id],
        onChange:function(v){ cancelAnim(); S.plate[S.pers][f.id] = v; S.food[S.pers] = i; commit(); } });
    });
    var pk = $("#it-fpick"); pk.innerHTML = "<div></div>";
    pickRG = radios(pk.firstChild, { label:"Food", cls:"chips", options:P.foods.map(function(f, i){ return { id:String(i), t:f.t }; }), value:String(S.food[S.pers]), onChange:function(v){ S.food[S.pers] = +v; api.save(); paintPlate(); } });
  }
  function paintPlate(){
    var P = D.plates[S.pers], sel = S.plate[S.pers], safe = 0;
    $("#it-plt").textContent = P.title;
    P.foods.forEach(function(f, i){
      var p = byId(f.preps, sel[f.id]), ok = MV.ok(p), row = $('#it-foods [data-food="' + f.id + '"]');
      if (ok) safe++;
      foodRG[i].set(sel[f.id]);
      row.classList.toggle("it-fcur", i === S.food[S.pers]);
      row.querySelector(".it-fread").innerHTML = (ok ? ICO.ok + "<strong>Safe.</strong> " : ICO.hz + "<strong>Choking risk.</strong> ") + p.fb;
    });
    pickRG.set(String(S.food[S.pers]));
    var svg = $("#it-plate");
    svg.innerHTML = plateSVG(P.foods, sel);
    svg.setAttribute("aria-label", P.title + ": " + P.foods.map(function(f){ var p = byId(f.preps, sel[f.id]); return f.t + ", " + lc(p.t) + (MV.ok(p) ? " (safe)" : " (choking risk)"); }).join("; ") + ".");
    $("#it-psum").innerHTML = "Prepared safely: <strong>" + safe + " of " + P.foods.length + "</strong>" + (safe === P.foods.length ? " " + ICO.ok + "the whole plate is safe." : ".");
  }
  buildFoods();

  // ===== Mealtime coach =====
  var momHost = $("#it-moms"), momRG = null, momFor = null;
  function sideOf(o){ return MV.ok(o) ? "ok" : o.side; }
  function paintCoach(){
    var C = D.coach[S.pers], k = S.pers, mi = S.cm[k], mom = C.moments[mi], ch = S.coach[k][mi];
    if (momFor !== k) { momFor = k; momHost.innerHTML = "<div></div>"; momRG = C.moments.length > 1 ? radios(momHost.firstChild, { label:"Moment", options:C.moments.map(function(x, i){ return { id:String(i), t:String(i + 1) }; }), value:String(mi), onChange:function(v){ S.cm[k] = +v; api.save(); paintCoach(); } }) : null; }
    if (momRG) momRG.set(String(mi));
    $("#it-ct").textContent = C.title;
    $("#it-mt").innerHTML = (C.moments.length > 1 ? "<strong>Moment " + (mi + 1) + " of " + C.moments.length + ":</strong> " : "") + mom.t;
    var box = $("#it-copts");
    MV.keepFocus(box, function(){
      box.innerHTML = mom.options.map(function(o, i){ var on = ch === i; return '<button type="button" class="it-copt' + (on ? " it-chosen" : "") + '" role="radio" aria-checked="' + on + '" tabindex="' + (on || (ch == null && i === 0) ? 0 : -1) + '" data-co="' + i + '" data-k="co' + k + mi + i + '">' + o.t + "</button>"; }).join("");
    });
    var o = ch != null ? mom.options[ch] : null, side = o ? sideOf(o) : null;
    $("#it-cfb").innerHTML = o ? '<p class="it-cfbp">' + o.fb + "</p>" : '<p class="tiny muted">Choose a response.</p>';
    var M = D.coach.meter, pos = side === "adult" ? 10 : side === "child" ? 90 : 50;
    $("#it-meter").innerHTML = '<div class="it-mtrack" aria-hidden="true"><span class="it-mz it-mza"></span><span class="it-mz it-mzm"></span><span class="it-mz it-mzc"></span>' + (side ? '<span class="it-mneedle" style="left:' + pos + '%"></span>' : "") + "</div>" +
      '<div class="it-mends" aria-hidden="true"><span>' + M.ends[0] + "</span><span>Shared</span><span>" + M.ends[1] + "</span></div>" +
      '<p class="it-mread" aria-live="polite">' + (side ? "<strong>" + (side === "ok" ? M.ok : M[side]) + "</strong>" : '<span class="muted">The meter moves when you choose a response.</span>') + "</p>" +
      '<p class="tiny muted">Moments answered: ' + S.coach[k].filter(function(x){ return x != null; }).length + " of " + C.moments.length + "</p>";
    var svg = $("#it-scene"); svg.innerHTML = sceneSVG(k, mi); svg.setAttribute("aria-label", MV.plain(C.title + " " + mom.t));
  }
  $("#it-copts").addEventListener("click", function(e){ var b = e.target.closest("[data-co]"); if (!b) return; cancelAnim(); S.coach[S.pers][S.cm[S.pers]] = +b.dataset.co; commit(); });
  $("#it-copts").addEventListener("keydown", function(e){
    var b = e.target.closest("[data-co]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var n = $$("[data-co]", e.currentTarget).length, i = (+b.dataset.co + d + n) % n; S.coach[S.pers][S.cm[S.pers]] = i; commit();
    var nb = $('[data-co="' + i + '"]', e.currentTarget); if (nb) nb.focus();
  });

  // ===== paint / commit =====
  function paint(){
    modeRG.set(S.mode); persRG.set(S.pers);
    $("#it-pers").hidden = S.mode === "time";
    $("#it-p-time").hidden = S.mode !== "time"; $("#it-p-plate").hidden = S.mode !== "plate"; $("#it-p-coach").hidden = S.mode !== "coach";
    if (S.mode === "time") paintTime(); else if (S.mode === "plate") paintPlate(); else paintCoach();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function clearFx(){ fx.hide = []; fx.hl = []; fx.hlNot = []; fx.iron = 1; fx.p3 = null; }
  function cancelAnim(){ if (anim) { anim(); anim = null; } clearFx(); if (pend) { var d = pend; pend = null; d(); } }
  function finish(keepHl){ anim = null; var hl = fx.hl, hn = fx.hlNot; clearFx(); if (keepHl) { fx.hl = hl; fx.hlNot = hn; } paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  paint();

  // ===== TC1 day planner (lives inside its challenge card; re-added whenever the toolkit repaints the cards) =====
  var chal = $("#chal"), TC = D.tc1;
  function solved(id){ return !!(MV.S.chal && MV.S.chal[id] && MV.S.chal[id].solved); }
  function flagsHTML(c){
    var f = [];
    if (c.iron) f.push(ironTag());
    if (c.allergen) f.push(allgTag("allergen (" + c.allergen + ")"));
    if (c.finger) f.push('<span class="it-tag">finger food</span>');
    if (c.notYet) f.push('<span class="it-tag it-notag">' + ICO.no + c.notYet + "</span>");
    return f.length ? '<span class="it-flags">' + f.join("") + "</span>" : "";
  }
  function cxHTML(){
    var done = solved("tc1"), dis = done ? " disabled" : "", cur = t1.times[t1.cur], h = '<p class="how">' + CH.tc1.how + "</p>";
    h += '<div class="it-vd"><button type="button" class="it-vdb' + (t1.vitD ? " it-von" : "") + '" aria-pressed="' + t1.vitD + '" data-tc="vitd" data-k="tcvd"' + dis + ">" + ICO.milk + TC.vitD + ": <strong>" + (t1.vitD ? "on" : "off") + "</strong></button></div>";
    h += '<div class="it-times" role="radiogroup" aria-label="Feeding times">' + TC.times.map(function(t, i){
      var on = i === t1.cur, list = t1.times[i];
      return '<div class="it-time' + (on ? " it-tcur" : "") + '"><button type="button" class="it-tsel" role="radio" aria-checked="' + on + '" data-tc="time" data-i="' + i + '" data-k="tct' + i + '"' + dis + ">" + t + "</button>" +
        '<div class="it-tcards">' + (list.length ? list.map(function(id){ var c = byId(TC.cards, id); return '<button type="button" class="it-placed" data-tc="rm" data-i="' + i + '" data-id="' + id + '" data-k="tcr' + i + id + '"' + dis + ' aria-label="' + esc("Take " + MV.plain(c.t) + " out of " + t) + '">' + c.t + ' <span aria-hidden="true">×</span></button>'; }).join("") : '<span class="tiny muted">empty</span>') + "</div></div>";
    }).join("") + "</div>";
    h += '<p class="it-libh">Add to <strong>' + TC.times[t1.cur] + "</strong> (" + cur.length + " of 2):</p>";
    h += '<div class="it-lib" role="group" aria-label="Food cards">' + TC.cards.map(function(c){
      var inCur = cur.indexOf(c.id) >= 0;
      return '<button type="button" class="it-fcard' + (inCur ? " it-in" : "") + '" aria-pressed="' + inCur + '" data-tc="add" data-id="' + c.id + '" data-k="tca' + c.id + '"' + dis + "><span>" + c.t + "</span>" + flagsHTML(c) + "</button>";
    }).join("") + "</div>";
    var st = tc1Stats();
    h += '<p class="tiny it-tcsum" aria-live="polite">Iron-rich at <strong>' + st.ironTimes + "</strong> feeding time" + (st.ironTimes === 1 ? "" : "s") + " · allergen cards: <strong>" + st.allg + "</strong> · “not yet” cards: <strong>" + st.notYet + "</strong> · vitamin D: <strong>" + (t1.vitD ? "on" : "off") + "</strong>" + (msg1 ? '<br><span class="it-cxmsg">' + msg1 + "</span>" : "") + "</p>";
    return h;
  }
  function tc1Stats(){
    var ironTimes = 0, allg = 0, notYet = 0, empty = 0;
    t1.times.forEach(function(list){
      var c = list.map(function(id){ return byId(TC.cards, id); });
      if (c.some(function(x){ return x.iron; })) ironTimes++;
      allg += c.filter(function(x){ return x.allergen; }).length; notYet += c.filter(function(x){ return x.notYet; }).length;
      if (!list.length) empty++;
    });
    return { ironTimes:ironTimes, allg:allg, notYet:notYet, empty:empty };
  }
  function stamp(){ return JSON.stringify(t1) + msg1 + (solved("tc1") ? "|s" : ""); }
  function inject(){
    if (!chal) return;
    var card = chal.querySelector('[data-c="tc1"]'); if (!card) return;
    var box = card.querySelector(".it-cx"); if (box && box.dataset.v === stamp()) return;
    if (!box) { box = document.createElement("div"); box.className = "it-cx"; var head = card.querySelector(".q-head"); card.insertBefore(box, head ? head.nextSibling : card.firstChild); }
    box.dataset.v = stamp();
    MV.keepFocus(box, function(){ box.innerHTML = cxHTML(); });
  }
  if (chal) {
    new MutationObserver(inject).observe(chal, { childList:true });
    chal.addEventListener("click", function(e){
      var b = e.target.closest("[data-tc]"); if (!b) return;
      e.stopImmediatePropagation(); // the toolkit's card handler would look up a button this repaint is about to replace
      if (b.disabled) return;
      var a = b.dataset.tc; msg1 = "";
      if (a === "vitd") t1.vitD = !t1.vitD;
      else if (a === "time") t1.cur = +b.dataset.i;
      else if (a === "rm") { var L = t1.times[+b.dataset.i]; L.splice(L.indexOf(b.dataset.id), 1); }
      else if (a === "add") { var C = t1.times[t1.cur], k = C.indexOf(b.dataset.id); if (k >= 0) C.splice(k, 1); else if (C.length >= 2) msg1 = CH.tc1.msgs.full; else C.push(b.dataset.id); }
      api.save(); inject(); MV.liveChallenges();
    });
    chal.addEventListener("keydown", function(e){
      var b = e.target.closest && e.target.closest('[data-tc="time"]'); if (!b) return;
      var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
      e.preventDefault(); t1.cur = (t1.cur + d + 4) % 4; api.save(); inject();
      var nb = chal.querySelector('[data-tc="time"][data-i="' + t1.cur + '"]'); if (nb) nb.focus();
    });
  }
  inject();

  // ===== challenge tests (the plan's exact tests and named wrong states) =====
  function test(id){
    var c = CH[id], M = c.msgs || {};
    if (id === "tc1") {
      var all = [].concat.apply([], t1.times), st = tc1Stats();
      var bad = ["honey", "juice", "almonds", "cowmilk"].filter(function(k){ return all.indexOf(k) >= 0; })[0];
      if (bad) return { ok:false, msg:M[bad] };
      if (st.ironTimes < 2) return { ok:false, msg:M.iron };
      if (!t1.vitD) return { ok:false, msg:M.vitD };
      if (!st.allg) return { ok:false, msg:M.allergen };
      if (st.empty) return { ok:false, msg:M.times };
      return { ok:true };
    }
    if (id === "tc2") {
      var P = D.plates.sasha, sel = S.plate.sasha, named = { grapes:"half", hotdog:"rounds", pb:"spoon" }, first = null;
      P.foods.forEach(function(f){ var p = byId(f.preps, sel[f.id]); if (!MV.ok(p) && named[f.id] === p.id && !first) first = p.fb; });
      if (!first) P.foods.forEach(function(f){ var p = byId(f.preps, sel[f.id]); if (!MV.ok(p) && !first) first = p.fb; });
      return first ? { ok:false, msg:first } : { ok:true };
    }
    if (id === "tc3") {
      var Cs = D.coach.sasha, chs = S.coach.sasha;
      if (chs.some(function(x){ return x == null; })) return { ok:false, msg:M.open };
      for (var i = 0; i < Cs.moments.length; i++) { var o = Cs.moments[i].options[chs[i]]; if (!MV.ok(o)) return { ok:false, msg:"Moment " + (i + 1) + ": " + o.fb }; }
      return { ok:true };
    }
    return { ok:false };
  }

  // ===== predictions =====
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); S.mode = "time"; S.age = p.age; fx.hide = (p.hide || []).slice();
        if (p.id === "p1") fx.iron = 0;
        if (p.id === "p3") fx.p3 = 0;
        api.save(); paint();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal($("#it-badges"));
          anim = MV.tween({ dur:2400, ease:function(t){ return t; }, step:function(t){
            fx.iron = t < 0.3 ? seg01(t, 0, 0.3) * 1.25 : 1.25 - 0.25 * seg01(t, 0.3, 0.42);
            if (t >= 0.45) { fx.hide = fx.hide.filter(function(k){ return k !== "iron"; }); fx.hl = ["iron"]; }
            if (t >= 0.7) { fx.hide = []; fx.hl = ["iron", "not"]; fx.hlNot = ["juice", "cowmilk"]; }
            paintTime();
          }, done:function(){ fx.iron = 1; finish(true); } });
          return;
        }
        if (p.id === "p2" || p.id === "p4") {
          var row = p.id === "p2" ? "allerg" : "milk";
          reveal($("#it-read"));
          anim = MV.tween({ dur:2200, ease:function(t){ return t; }, step:function(t){
            if (t >= 0.3 && S.age !== p.to) { S.age = p.to; }
            if (t >= 0.6) { fx.hide = []; fx.hl = [row]; }
            paintTime();
          }, done:function(){ api.save(); finish(true); } });
          return;
        }
        if (p.id === "p3") {
          reveal($("#it-tally"));
          anim = MV.tween({ dur:3600, ease:function(t){ return t; }, step:function(t){ fx.p3 = Math.round(t * D.tally.max); tallyPaint(); }, done:function(){ finish(false); } });
          return;
        }
        finish(false);
      }
    },
    challenge:function(id){ return test(id); }
  };
}

// ---------- Part 3: Products for the youngest (@component F13 productCards — practice-model packages, a verdict per card,
// then "Check it with data": the label excerpt beside the guidance) ----------
var PACK = {
  box:'<rect class="it-o" x="-17" y="-26" width="34" height="50" rx="2"/><path class="it-ln" d="M-17 -14H17"/><ellipse class="it-gr" cx="0" cy="6" rx="11" ry="6"/><path class="it-ln" d="M10 0L19 -9"/>',
  juice:'<path class="it-o" d="M-15 -18L-11 -24H11L15 -18V26H-15Z"/><path class="it-ln" d="M-15 -18H15"/><path class="it-of" d="M6 -24L10 -34H16"/><circle class="it-vf" cx="0" cy="5" r="8"/>',
  tin:'<path class="it-o" d="M-16 -20V22A16 5 0 0 0 16 22V-20Z"/><ellipse class="it-o" cx="0" cy="-20" rx="16" ry="5"/><path class="it-ln" d="M-16 -8A16 5 0 0 0 16 -8"/><path class="it-milk" d="M-8 6a8 8 0 0 0 16 0c0-5-8-12-8-12s-8 7-8 12Z"/>',
  pouch:'<path class="it-o" d="M-16 -14C-16 -16 -8 -18 0 -18C8 -18 16 -16 16 -14V20C16 25 -16 25 -16 20Z"/><rect class="it-o" x="-5" y="-27" width="10" height="9" rx="2"/><circle class="it-vf" cx="-4" cy="5" r="6"/><circle class="it-vf" cx="5" cy="9" r="4"/>',
  biscuit:'<rect class="it-o" x="-22" y="-18" width="44" height="36" rx="5"/><circle class="it-gr" cx="-7" cy="0" r="9"/><circle class="it-gr" cx="9" cy="2" r="7"/><circle class="it-grd" cx="-9" cy="-2" r="1.2"/><circle class="it-grd" cx="-4" cy="3" r="1.2"/>',
  bag:'<path class="it-o" d="M-18 -22H18L16 24H-16Z"/><path class="it-ln" d="M-18 -15H18"/><rect class="it-vf" x="-10" y="-4" width="8" height="8" rx="2"/><rect class="it-vf" x="2" y="4" width="8" height="8" rx="2"/><rect class="it-vf" x="-6" y="10" width="7" height="7" rx="2"/>'
};
function part3(host, api){
  var D = api.content, S = api.S, V = D.verdicts;
  S.v = S.v || {};
  host.innerHTML = '<p class="tiny it-p3note"><span class="hfa-model">Practice model</span> ' + D.note + '</p><div class="it-prods">' + D.products.map(function(p, i){
    return '<article class="it-prod" data-p="' + p.id + '"><div class="it-pk"><svg viewBox="-30 -36 60 66" aria-hidden="true">' + PACK[p.pack] + "</svg></div>" +
      '<div class="it-pbody"><h4><span class="it-pn">' + (i + 1) + ".</span> <span class=\"it-brand\">" + p.brand + "</span> " + p.name + "</h4>" +
      '<p class="it-claim">On the front: <strong>“' + p.claim + '”</strong></p><div class="it-verd" id="it-v-' + p.id + '"></div><div class="it-pfb" aria-live="polite"></div>' +
      '<details class="alg it-data"><summary>Check it with data</summary><div class="it-dbody"></div></details></div></article>';
  }).join("") + '</div><p class="tiny" id="it-pprog" aria-live="polite"></p>';
  function vt(id){ var v = byId(V, id); return v ? v.t : ""; }
  function labelHTML(p){
    var L = p.label, h = "";
    if (L.rows) h += '<table class="hfa-nft it-nft"><caption>Label excerpt</caption><thead><tr><th scope="col">' + (L.per || "") + '</th><th scope="col">% Daily Value</th></tr></thead><tbody>' + L.rows.map(function(r){ return '<tr class="hi"><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") + "</tbody></table>";
    if (L.ingr) h += '<p class="it-ingr"><strong>Ingredients:</strong> ' + L.ingr + "</p>";
    if (L.text) h += '<p class="it-ingr"><strong>Label:</strong> ' + L.text + "</p>";
    return h;
  }
  function paintCard(p){
    var card = $('[data-p="' + p.id + '"]', host), v = S.v[p.id], ans = MV.ans(p), fb = card.querySelector(".it-pfb"), body = card.querySelector(".it-dbody");
    if (!v) { fb.innerHTML = ""; body.innerHTML = '<p class="tiny muted">Choose a verdict first, then check it with data.</p>'; return; }
    var good = v === ans;
    fb.innerHTML = good ? MV.fbHTML("good", "<strong>✓ Matches the guidance.</strong> Open <em>Check it with data</em> to see why.") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Open <em>Check it with data</em>, compare the label with the guidance, then choose again.");
    body.innerHTML = '<div class="it-dgrid"><div><h5>The label says</h5>' + labelHTML(p) + '</div><div><h5>The guidance says</h5><p>' + p.guide + "</p>" +
      '<p class="it-gv"><strong>Verdict:</strong> ' + (p.gloss || vt(ans) + ".") + "</p></div></div>";
  }
  function prog(){ var n = D.products.filter(function(p){ return S.v[p.id] === MV.ans(p); }).length; $("#it-pprog", host).textContent = "Verdicts that match the guidance: " + n + " of " + D.products.length + "."; }
  D.products.forEach(function(p){
    radios($("#it-v-" + p.id, host), { label:"Your verdict", cls:"chips", options:V, value:S.v[p.id] || "", onChange:function(v){ S.v[p.id] = v; api.save(); paintCard(p); prog(); var fb = $('[data-p="' + p.id + '"] .it-pfb', host); MV.focusFb(fb); } });
    paintCard(p);
  });
  prog();
}

// ---------- Performance task: Sasha's day (@component F2 toddlerPlate — 5 meals and snacks, 1–3 foods each with a cut
// chooser where needed, drinks per meal, a Food Guide plate for the chosen meal; the plan's exact tests) ----------
var task = (function(){
  var api = null, slotRG = null;
  function TK(){ return MV.C.task; }
  function food(id){ return byId(TK().foods, id); }
  function blank(){ return { foods:[], milk:0, water:false, juice:false, pop:false }; }
  function st(){
    var s = api.S; s.slots = s.slots || {};
    TK().slots.forEach(function(sl){
      var x = s.slots[sl.id] || (s.slots[sl.id] = blank());
      x.foods = (Array.isArray(x.foods) ? x.foods : []).filter(function(f){ return f && food(f.id); }).slice(0, 3);
      x.foods.forEach(function(f){ var fd = food(f.id); if (fd.preps && !byId(fd.preps, f.prep)) f.prep = fd.preps[0].id; });
      x.milk = clamp(+x.milk || 0, 0, 3);
    });
    if (!byId(TK().slots, s.cur)) s.cur = TK().slots[0].id;
    return s;
  }
  function read(){ var s = (api && api.S && api.S.slots) ? st() : null; return { slots:TK().slots.map(function(sl){ var x = s ? s.slots[sl.id] : blank(); return { id:sl.id, foods:x.foods.map(function(f){ return { id:f.id, prep:f.prep || "" }; }), milk:x.milk, water:!!x.water, juice:!!x.juice, pop:!!x.pop }; }) }; }
  function unsafe(f){ var fd = food(f.id); if (fd.popcorn) return true; var p = fd.preps && byId(fd.preps, f.prep); return !!(p && p.risk); }
  function counts(d){
    var c = { vf:0, iron:0, milk:0, water:false, sugary:false, safe:true, family:false };
    d.slots.forEach(function(x){
      var fs = x.foods.map(function(f){ return food(f.id); });
      if (fs.some(function(f){ return f.vf; })) c.vf++;
      if (fs.some(function(f){ return f.iron; })) c.iron++;
      if (fs.some(function(f){ return f.group === "family"; })) c.family = true;
      if (x.foods.some(unsafe)) c.safe = false;
      c.milk += x.milk; if (x.water) c.water = true; if (x.juice || x.pop) c.sugary = true;
    });
    return c;
  }
  function checks(d){ var c = counts(d); return [c.vf >= 3, c.iron >= 2, c.milk >= 4 && c.milk <= 6, c.water, !c.sugary, c.safe, c.family]; }
  function foodTxt(f, short){ var fd = food(f.id), p = fd.preps && byId(fd.preps, f.prep); return (short ? fd.short : lc(fd.t)) + (p ? " (" + p.t + ")" : ""); }
  function drinksTxt(x){ var d = []; if (x.milk) d.push("milk ½ cup" + (x.milk > 1 ? " × " + x.milk : "")); if (x.water) d.push("water"); if (x.juice) d.push("apple juice"); if (x.pop) d.push("pop"); return d; }
  function key(d){ return d.slots.map(function(x){ return x.id + ":" + x.foods.map(function(f){ return f.id + (f.prep ? "." + f.prep : ""); }).sort().join(",") + "/" + x.milk + (x.water ? "w" : "") + (x.juice ? "j" : "") + (x.pop ? "p" : ""); }).join(";"); }
  function fromKey(k){
    return { slots:k.split(";").map(function(part){
      var a = part.split(":"), b = (a[1] || "").split("/"), dr = b[1] || "0";
      return { id:a[0], foods:(b[0] ? b[0].split(",") : []).map(function(t){ var q = t.split("."); return { id:q[0], prep:q[1] || "" }; }).filter(function(f){ return food(f.id); }),
        milk:parseInt(dr, 10) || 0, water:dr.indexOf("w") >= 0, juice:dr.indexOf("j") >= 0, pop:dr.indexOf("p") >= 0 };
    }) };
  }
  function slotName(id){ var s = byId(TK().slots, id); return s ? s.t : id; }
  function label(k){ return fromKey(k).slots.map(function(x){ return x.foods.map(function(f){ return food(f.id).short; }).join(" + "); }).join(" · "); }
  function text(k){ return fromKey(k).slots.map(function(x){ return slotName(x.id) + ": " + x.foods.map(function(f){ return foodTxt(f, false); }).concat(drinksTxt(x)).join(", "); }).join("; "); }

  // a Food Guide plate for one meal (sections fill when a food from that group is in the meal; always labelled)
  var PG = { arroz:["grain", "prot"], pancit:["grain", "vf"], sinigang:["vf", "prot"], mango:["vf"], oatmeal:["grain", "vf"], toast:["grain", "prot"], egg:["prot"], patties:["prot", "vf"],
    broccoli:["vf"], grapes:["vf"], yogurt:["prot"], crackers:["grain"], rice:["grain"], popcorn:["grain"], hotdog:["prot"] };   // Food Guide groups (module classification)
  function mealPlate(x){
    var has = {}; x.foods.forEach(function(f){ (PG[f.id] || []).forEach(function(g){ has[g] = 1; }); });
    function sec(g, d, cls, lab, lx, ly){ return '<path class="' + (has[g] ? cls : "it-empty") + '" d="' + d + '"/>' + T(lx, ly, lab, "it-plab" + (has[g] ? "" : " it-plab0")); }
    return '<svg class="it-mplate" viewBox="-60 -50 120 100" role="img" aria-label="' + esc("Food Guide plate for this meal: " + ["vf", "grain", "prot"].filter(function(g){ return has[g]; }).map(function(g){ return { vf:"vegetables and fruits", grain:"whole grains", prot:"protein foods" }[g]; }).join(", ") + (Object.keys(has).length ? "" : "empty")) + '">' +
      '<circle class="it-o" cx="0" cy="0" r="44"/>' + sec("vf", "M0 -38A38 38 0 0 0 0 38Z", "it-vf", "veg &amp;", -19, -2) + T(-19, 8, "fruit", "it-plab" + (has.vf ? "" : " it-plab0")) + sec("grain", "M0 0V-38A38 38 0 0 1 38 0Z", "it-gr", "grains", 17, -12) + sec("prot", "M0 0H38A38 38 0 0 1 0 38Z", "it-pr", "protein", 18, 18) +
      '<path class="it-ln" d="M0 -38V38M0 0H38"/></svg>';
  }
  function edHTML(s){
    var x = s.slots[s.cur], T0 = TK(), h = '<div class="it-ed"><h5>' + slotName(s.cur) + " <small>(" + x.foods.length + " of 3 foods)</small></h5>";
    h += x.foods.length ? '<ul class="it-edl">' + x.foods.map(function(f, i){
      var fd = food(f.id);
      return "<li><span class=\"it-edn\">" + fd.t + "</span>" + (fd.preps ? '<span class="it-cut" role="radiogroup" aria-label="' + esc(MV.plain(fd.t) + ": cut") + '">' + fd.preps.map(function(p){ var on = p.id === f.prep; return '<button type="button" class="it-cutb" role="radio" aria-checked="' + on + '" data-prep="' + i + '" data-v="' + p.id + '" data-k="tp' + s.cur + f.id + p.id + '">' + p.t + "</button>"; }).join("") + "</span>" : "") +
        '<button type="button" class="btn ghost sm it-x" data-rmf="' + i + '" data-k="tx' + s.cur + f.id + '" aria-label="' + esc("Remove " + MV.plain(fd.t)) + '">Remove</button></li>';
    }).join("") + "</ul>" : '<p class="tiny muted">No foods yet: tap foods below to add 1–3.</p>';
    h += '<div class="it-drinks"><span class="it-dl">Drinks:</span><span class="it-milkst"><button type="button" class="btn ghost sm" data-milk="-1" data-k="tm-" aria-label="One less half-cup of milk"' + (x.milk ? "" : " disabled") + '>−</button><span class="it-mv">' + ICO.milk + T0.drinks.milk + " × <strong>" + x.milk + '</strong></span><button type="button" class="btn ghost sm" data-milk="1" data-k="tm+" aria-label="One more half-cup of milk"' + (x.milk < 3 ? "" : " disabled") + ">+</button></span>" +
      ["water", "juice", "pop"].map(function(k){ return '<button type="button" class="chip' + (x[k] ? " on" : "") + '" aria-pressed="' + !!x[k] + '" data-drink="' + k + '" data-k="td' + k + '">' + T0.drinks[k] + "</button>"; }).join("") + "</div></div>";
    return h;
  }
  function libHTML(s){
    var x = s.slots[s.cur], T0 = TK();
    return T0.groups.map(function(g){
      return '<p class="it-libg">' + g.t + '</p><div class="it-tlib" role="group" aria-label="' + esc(g.t) + '">' + T0.foods.filter(function(f){ return f.group === g.id; }).map(function(f){
        var on = x.foods.some(function(q){ return q.id === f.id; }), tags = [];
        if (f.iron) tags.push(ironTag()); if (f.vf) tags.push('<span class="it-tag it-vftag">' + T0.tags.vf + "</span>"); if (f.group === "family") tags.push('<span class="it-tag">' + T0.tags.family + "</span>");
        return '<button type="button" class="it-fcard' + (on ? " it-in" : "") + '" aria-pressed="' + on + '" data-addf="' + f.id + '" data-k="tf' + f.id + '"><span>' + f.t + "</span>" + (tags.length ? '<span class="it-flags">' + tags.join("") + "</span>" : "") + "</button>";
      }).join("") + "</div>";
    }).join("");
  }
  var tmsg = "";
  function paint(){
    var s = st(), inp = $("#tk-ed"); if (!inp) return;
    slotRG.set(s.cur);
    MV.keepFocus(inp, function(){ inp.innerHTML = edHTML(s) + (tmsg ? '<p class="it-cxmsg" role="status">' + tmsg + "</p>" : ""); });
    var lib = $("#tk-lib"); MV.keepFocus(lib, function(){ lib.innerHTML = libHTML(s); });
    var d = read(), c = counts(d), T0 = TK();
    var h = '<div class="it-day"><h5>Sasha’s day</h5><ol class="it-dayl">' + d.slots.map(function(x){
      var bits = x.foods.map(function(f){ return (unsafe(f) ? ICO.hz : "") + esc(foodTxt(f, true)); }).concat(drinksTxt(x));
      return '<li class="' + (x.id === s.cur ? "it-dcur" : "") + '"><strong>' + slotName(x.id) + ":</strong> " + (bits.length ? bits.join(", ") : '<span class="muted">nothing yet</span>') + "</li>";
    }).join("") + "</ol>";
    h += '<div class="it-mealp"><div>' + mealPlate(s.slots[s.cur]) + '</div><p class="tiny">' + slotName(s.cur) + " on Canada’s Food Guide plate. " + MV.C.explore.plateGuide + ".</p></div>";
    h += '<p class="it-mtot">' + ICO.milk + "Milk today: <strong>" + c.milk + "</strong> half-cups (" + MV.num(c.milk / 2) + " cups)</p>" +
      '<div class="it-mbar" aria-hidden="true">' + [1, 2, 3, 4, 5, 6, 7, 8].map(function(i){ return '<span class="' + (i <= c.milk ? "it-mf" : "") + (i >= 4 && i <= 6 ? " it-mok" : "") + '"></span>'; }).join("") + '</div><p class="tiny muted">The shaded cells mark 4–6 half-cups (about 2–3 cups).</p>';
    h += '<p class="tiny">Vegetables or fruits at <strong>' + c.vf + "</strong> time" + (c.vf === 1 ? "" : "s") + " · iron-rich foods at <strong>" + c.iron + "</strong> time" + (c.iron === 1 ? "" : "s") + "</p></div>";
    h += '<div class="it-kc"><p class="it-kct"><strong>Kitchen card:</strong> ' + T0.kitchen.title + '</p><div id="tk-kc"></div></div>';
    var pv = $("#tk-pv"); pv.innerHTML = h;
    MV.kitchenCardButton($("#tk-kc"), { title:T0.kitchen.title, lines:T0.kitchen.lines, label:T0.kitchen.label });
  }
  function onClick(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var s = st(), x = s.slots[s.cur]; tmsg = "";
    if (b.dataset.addf) { var id = b.dataset.addf, k = -1; x.foods.forEach(function(f, i){ if (f.id === id) k = i; }); if (k >= 0) x.foods.splice(k, 1); else if (x.foods.length >= 3) tmsg = "Each meal or snack takes 1–3 foods. Remove one first."; else { var fd = food(id); x.foods.push({ id:id, prep:fd.preps ? fd.preps[0].id : "" }); } }
    else if (b.dataset.rmf != null) x.foods.splice(+b.dataset.rmf, 1);
    else if (b.dataset.prep != null) x.foods[+b.dataset.prep].prep = b.dataset.v;
    else if (b.dataset.milk) x.milk = clamp(x.milk + (+b.dataset.milk), 0, 3);
    else if (b.dataset.drink) x[b.dataset.drink] = !x[b.dataset.drink];
    else return;
    api.save(); paint(); api.update();
  }
  return {
    render:function(inp, pv, a){
      api = a; st();
      inp.innerHTML = '<p class="how">' + TK().how + '</p><div id="tk-slot"></div><div id="tk-ed"></div><div id="tk-lib"></div>';
      slotRG = radios($("#tk-slot"), { label:"Meal", cls:"chips", aria:"Meal or snack", options:TK().slots, value:a.S.cur, onChange:function(v){ a.S.cur = v; tmsg = ""; a.save(); paint(); } });
      inp.addEventListener("click", onClick);
      inp.addEventListener("keydown", function(e){
        var b = e.target.closest && e.target.closest("[data-prep]"); if (!b) return;
        var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
        e.preventDefault(); var sibs = $$("[data-prep]", b.parentNode), n = (sibs.indexOf(b) + d + sibs.length) % sibs.length; sibs[n].focus(); sibs[n].click();
      });
      pv.innerHTML = '<div id="tk-pv" aria-live="polite"></div>';
      paint();
    },
    read:read,
    valid:function(d){ return d.slots.every(function(x){ return x.foods.length >= 1; }) ? true : "Add 1–3 foods to every meal and snack first."; },
    checks:checks,
    key:key,
    label:function(k){ return esc(label(k)); },
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
