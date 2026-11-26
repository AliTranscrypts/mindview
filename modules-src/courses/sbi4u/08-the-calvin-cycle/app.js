// SBI4U 08 The Calvin Cycle: hero (one turn of the wheel), Carbon counter (S2 pathway stepper in cycle form + S3 energy ledger;
// modes Turn the wheel, Factory order, Experiment), Where the sugar goes (¹⁴C labelling table and graph, G3P destinations
// diagram, rubisco zoom), Calvin cycle detective (Practice), "Plan a sugar order" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 04 / 06) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "cc-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrowPath(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " cc-ah" });
}
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/,/g, "").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function plural(n, one, many){ return n + " " + (n === 1 ? one : many); }

// ---------- @component radioGroup (copied from SBI4U 04 / 03 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// number stepper: stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="cc-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="cc-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="cc-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}
// range slider with output (from SBI4U 06): slider(host, {id, label, min, max, step, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function slider(host, o){
  host.innerHTML = '<label class="slider cc-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, disable:function(b){ inp.disabled = b; } };
}

// ---------- @component S2 pathwayStepper — cycle form (course plan S2): the Calvin wheel in the stroma, with pools for RuBP,
// 3-PGA and G3P, an export ("Sugar") box, rubisco at the fixation point and ATP/NADPH arriving from the thylakoid edge.
// Every carbon is a brown dot on its molecule token. wheelSVG(o) draws the static scene; wheelFrame(svg, st, flights, k, o)
// redraws the pools and the tokens in flight (flightsFor(move, n, before) builds the flights for a move). One 400 × 382 layout
// (text stays ≥ 10 px at 390 px wide). ----------
var GW = { w:400, h:382, cx:222, cy:192, r:96 };
var PL = {
  rubp:{ cx:222, cy:50, cols:3, rows:2, dx:46, k:"rubp", lab:"RuBP (5C)" },
  pga:{ cx:330, cy:250, cols:3, rows:4, dx:32, k:"pga", lab:"3-PGA (3C)" },
  g3p:{ cx:114, cy:250, cols:3, rows:4, dx:32, k:"g3p", lab:"G3P (3C)" },
  exp:{ cx:114, cy:356, cols:3, rows:1, dx:32, k:"g3p", lab:"Sugar" }
};
Object.keys(PL).forEach(function(id){ var p = PL[id]; p.w = p.cols * p.dx + 14; p.h = p.rows * 21 + 28; p.top = p.cy - p.h / 2; p.cap = p.cols * p.rows; });
var PT = { fix:[301, 137], red:[222, 288], regen:[143, 137], co2:[390, 9] };
var PATH = { co2:[[390, 9], [301, 137]], feedR:[[10, 318], [222, 318], [222, 288]], feedG:[[10, 137], [143, 137]] };
function slot(id, i){ var p = PL[id]; i = clamp(i, 0, p.cap - 1); var c = i % p.cols, r = Math.floor(i / p.cols); return [p.cx + (c - (p.cols - 1) / 2) * p.dx, p.top + 30 + r * 21]; }
var MOL = { rubp:[42, 5], pga:[28, 3], g3p:[28, 3], c6:[48, 6] };
var CARR = { atp:["ATP", "--bio-atp", 28], nadph:["NADPH", "--bio-nadh", 42], adp:["ADP", "--ink-2", 28], nadp:["NADP⁺", "--ink-2", 40] };
function molSVG(k, x, y, a){
  if (a != null && a <= 0.02) return "";
  var g = "", i;
  if (MOL[k]) { var m = MOL[k]; g = sv("rect", { x:x - m[0] / 2, y:y - 8, width:m[0], height:16, rx:k === "g3p" ? 4 : 8, "class":"cc-mol cc-" + k }); for (i = 0; i < m[1]; i++) g += sv("circle", { cx:x + (i - (m[1] - 1) / 2) * 7, cy:y, r:2.6, "class":"cc-c" }); }
  else if (k === "co2") g = sv("rect", { x:x - 19, y:y - 8, width:38, height:16, rx:8, "class":"cc-mol" }) + sv("circle", { cx:x - 11, cy:y, r:2.6, "class":"cc-c" }) + txt(x + 4, y + 3.4, "CO₂", "cc-tk", "middle");
  else { var t = CARR[k]; g = sv("rect", { x:x - t[2] / 2, y:y - 8, width:t[2], height:16, rx:8, fill:"var(" + t[1] + ")" }) + txt(x, y + 3.4, t[0], "cc-tt", "middle"); }
  return a != null && a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + g + "</g>" : g;
}
function wheelSVG(o){
  o = o || {};
  var W = GW, h = "";
  h += sv("rect", { x:26, y:0, width:W.w - 26, height:W.h, rx:10, "class":"cc-stroma" }) + txt(34, 16, "stroma", "cc-sub");
  h += sv("rect", { x:0, y:0, width:26, height:W.h, rx:6, "class":"cc-thy" }) + '<text class="cc-thyt" text-anchor="middle" transform="translate(17 ' + W.h / 2 + ') rotate(-90)">thylakoid (light reactions)</text>';
  h += arrowPath(PATH.co2, "cc-guide") + arrowPath(PATH.feedR, "cc-guide") + arrowPath(PATH.feedG, "cc-guide") + arrowPath([[114, 306], [114, 330]], "cc-guide");
  h += sv("circle", { cx:W.cx, cy:W.cy, r:W.r, "class":"cc-ring" });
  [-62, -8, 62, 118, 188, 242].forEach(function(d){ var a = d * Math.PI / 180, x = W.cx + W.r * Math.cos(a), y = W.cy + W.r * Math.sin(a); h += sv("path", { d:head(x, y, -Math.sin(a), Math.cos(a), 7), "class":"cc-ringh" }); });
  h += sv("ellipse", { cx:PT.fix[0], cy:PT.fix[1], rx:27, ry:12, "class":"cc-rub" }) + txt(PT.fix[0], PT.fix[1] + 3.5, "rubisco", "cc-rubt", "middle");
  h += txt(322, 172, "1 Fixation", "cc-ph") + txt(W.cx, 272, "2 Reduction", "cc-ph", "middle") + txt(134, 174, "3 Regeneration", "cc-ph", "end");
  h += txt(396, 74, "CO₂ in", "cc-lab", "end") + txt(232, 337, "ATP, NADPH in", "cc-lab") + txt(36, 128, "ATP in", "cc-lab");
  return '<svg viewBox="0 0 ' + W.w + " " + W.h + '" class="cc-svg"' + (o.aria ? ' role="img" aria-label="' + MV.esc(o.aria) + '"' : ' aria-hidden="true"') + ' focusable="false">' + h + '<g class="cc-dyn"></g></svg>';
}
// st: {rubp, pga, g3p, exp}; o: {ctr:[lines], dim:{pool:true}}
function poolsSVG(st, o){
  var h = "";
  ["rubp", "pga", "g3p", "exp"].forEach(function(id){
    var p = PL[id], n = Math.max(0, st[id] || 0);
    h += sv("rect", { x:p.cx - p.w / 2, y:p.top, width:p.w, height:p.h, rx:8, "class":"cc-pool" + (id === "exp" ? " cc-expb" : "") });
    h += txt(p.cx, p.top + 15, p.lab + ": " + (id === "exp" ? n + " G3P" : n), "cc-pl", "middle");
    for (var i = 0; i < Math.min(n, p.cap); i++) { var s = slot(id, i); h += molSVG(p.k, s[0], s[1]); }
  });
  var L = o.ctr || [];
  L.forEach(function(l, i){ h += txt(GW.cx, GW.cy - (L.length - 1) * 9 + i * 18 + 4, l, i ? "cc-ctr2" : "cc-ctr", "middle"); });
  return h + (o.extra || "");
}
function flightSVG(F, k){
  var h = "";
  (F || []).forEach(function(f){
    var u;
    if (k < f.t0) { if (!f.pre) return; u = 0; }
    else if (k > f.t1) { if (!f.stay) return; u = 1; }
    else u = (k - f.t0) / Math.max(1e-6, f.t1 - f.t0);
    var p = polyAt(f.p, MV.ease(u)), a = 1;
    if (f.fade === "out") a = u > 0.75 ? (1 - u) / 0.25 : 1;
    if (f.fade === "in") a = u < 0.2 ? u / 0.2 : u > 0.8 ? (1 - u) / 0.2 : 1;
    h += molSVG(f.k, p[0], p[1], a);
  });
  return h;
}
function wheelFrame(svg, st, F, k, o){ var g = $(".cc-dyn", svg); if (g) g.innerHTML = poolsSVG(st, o || {}) + flightSVG(F, k); }
function flightsFor(mv, n, st){
  var F = [], i, s, fx = PT.fix, rd = PT.red, rg = PT.regen;
  if (mv === "fix") for (i = 0; i < n; i++) {
    var o = (i - (n - 1) / 2) * 8;
    F.push({ k:"rubp", p:[slot("rubp", st.rubp - 1 - i), [fx[0] - 8 + o, fx[1] - 2]], t0:0, t1:0.4, pre:true });
    F.push({ k:"co2", p:[[PT.co2[0] - i * 8, PT.co2[1] + i * 6], [fx[0] + 12 + o, fx[1] - 4]], t0:0, t1:0.4, pre:true });
    F.push({ k:"c6", p:[[fx[0] + o, fx[1]], [fx[0] + o, fx[1]]], t0:0.4, t1:0.58 });
    F.push({ k:"pga", p:[[fx[0] + o, fx[1]], slot("pga", st.pga + 2 * i)], t0:0.58, t1:1, stay:true });
    F.push({ k:"pga", p:[[fx[0] + o, fx[1]], slot("pga", st.pga + 2 * i + 1)], t0:0.62, t1:1, stay:true });
  }
  if (mv === "red") { var sg = Math.min(0.05, 0.25 / n), back = PATH.feedR.slice().reverse(); for (i = 0; i < n; i++) { s = i * sg;
    F.push({ k:"pga", p:[slot("pga", st.pga - 1 - i), rd], t0:s, t1:0.45 + s, pre:true });
    F.push({ k:"atp", p:PATH.feedR, t0:s, t1:0.45 + s, fade:"out" });
    F.push({ k:"nadph", p:PATH.feedR, t0:0.04 + s, t1:0.49 + s, fade:"out" });
    F.push({ k:"g3p", p:[rd, slot("g3p", st.g3p + i)], t0:0.5 + s, t1:0.75 + s, stay:true });
    F.push({ k:"adp", p:back, t0:0.5 + s, t1:Math.min(1, 0.85 + s), fade:"in" });
    F.push({ k:"nadp", p:back, t0:0.55 + s, t1:Math.min(1, 0.9 + s), fade:"in" });
  } }
  if (mv === "exp") for (i = 0; i < n; i++) { var a0 = slot("g3p", st.g3p - 1 - i), b0 = slot("exp", st.exp + i);
    F.push({ k:"g3p", p:[a0, [a0[0], 318], [b0[0], 318], b0], t0:i * 0.1, t1:Math.min(1, 0.8 + i * 0.1), pre:true, stay:true }); }
  if (mv === "regen") { var bk = PATH.feedG.slice().reverse();
    for (i = 0; i < 5; i++) F.push({ k:"g3p", p:[slot("g3p", st.g3p - 1 - i), [rg[0] + (i - 2) * 6, rg[1]]], t0:i * 0.03, t1:0.42 + i * 0.03, pre:true });
    for (i = 0; i < 3; i++) {
      F.push({ k:"atp", p:PATH.feedG, t0:i * 0.05, t1:0.42 + i * 0.05, fade:"out" });
      F.push({ k:"adp", p:bk, t0:0.58 + i * 0.04, t1:0.9 + i * 0.03, fade:"in" });
      F.push({ k:"rubp", p:[rg, slot("rubp", st.rubp + i)], t0:0.55 + i * 0.05, t1:0.9 + i * 0.05, stay:true });
    } }
  return F;
}
// ---------- wheel model (plan: Turn the wheel, exact moves) ----------
function W0(start){ return { start:start, rubp:start, pga:0, g3p:0, exp:0, co2:0, atpR:0, atpG:0, nadph:0, early:false }; }
function doMove(w, mv){
  if (mv === "fix") { if (w.rubp < 1) return "No RuBP left to fix CO₂ onto. Regenerate RuBP first."; w.rubp--; w.pga += 2; w.co2++; }
  else if (mv === "red") { if (w.pga < 1) return "No 3-PGA to reduce yet."; w.pga--; w.g3p++; w.atpR++; w.nadph++; }
  else if (mv === "exp") { if (w.g3p < 1) return "No G3P in the wheel to export yet."; w.g3p--; w.exp++; }
  else if (mv === "regen") { if (w.g3p < 5) return "Regeneration needs 5 G3P; there " + (w.g3p === 1 ? "is" : "are") + " only " + w.g3p + " in the wheel."; w.g3p -= 5; w.rubp += 3; w.atpG += 3; }
  return null;
}
function depart(w, mv, n){ var d = { rubp:w.rubp, pga:w.pga, g3p:w.g3p, exp:w.exp }; if (mv === "fix") d.rubp -= n; if (mv === "red") d.pga -= n; if (mv === "exp") d.g3p -= n; if (mv === "regen") d.g3p -= 5; return d; }
function cIn(w){ return 5 * w.start + w.co2; }
function cOut(w){ return 5 * w.rubp + 3 * w.pga + 3 * w.g3p + 3 * w.exp; }
function atpOf(w){ return w.atpR + w.atpG; }
var MOVES = [
  { id:"fix", t:"Fix a CO₂", done:"Rubisco fixed a CO₂: 1 RuBP (5C) + 1 CO₂ (1C) → 2 3-PGA (3C each)." },
  { id:"red", t:"Reduce a 3-PGA", done:"Reduced a 3-PGA: 1 3-PGA + 1 ATP + 1 NADPH → 1 G3P." },
  { id:"exp", t:"Export a G3P", done:"Exported a G3P: its 3 carbons leave the wheel as sugar." },
  { id:"regen", t:"Regenerate", done:"Regenerated: 5 G3P (15C) + 3 ATP → 3 RuBP (15C)." }
];
var DUR = { fix:1100, red:1100, exp:800, regen:1300 };

// ---------- @component S3 energyLedger — tallies of CO₂, ATP and NADPH (Turn the wheel), supply vs need bars (Factory order,
// task preview), supply status (Experiment). tally(n, token) and barsHTML(groups) return html. ----------
function tally(n, col, cap){
  cap = cap || 24; var h = "";
  for (var i = 0; i < Math.min(n, cap); i++) h += "<i></i>";
  return '<span class="cc-tal" style="--c:var(' + col + ')" aria-hidden="true">' + h + (n > cap ? "<b>+" + (n - cap) + "</b>" : "") + "</span>";
}
// groups: [{name, tok, max, mark:[value, label], rows:[[label, value | null, kind "s"|"n"]]}]
function barsHTML(groups){
  return groups.map(function(g){
    return '<div class="cc-lg"><p class="cc-lgh"><span class="bio-tok" style="--tok:var(' + g.tok + ')">' + g.name + "</span>" + (g.status ? " " + g.status : "") + "</p>" +
      g.rows.map(function(r){
        var v = r[1], w = v == null ? 0 : clamp(v / g.max, 0, 1) * 100;
        return '<div class="cc-br"><span class="cc-bl">' + r[0] + '</span><span class="cc-bt">' + (g.mark ? '<b style="left:' + f1(g.mark[0] / g.max * 100) + '%" title="' + MV.esc(g.mark[1]) + '"></b>' : "") +
          (w > 0 ? '<i class="cc-b' + (r[2] || "s") + '" style="width:' + f1(w) + "%;--c:var(" + g.tok + ')"></i>' : "") + '</span><b class="cc-bv">' + (v == null ? "?" : MV.num(v)) + "</b></div>";
      }).join("") + (g.mark ? '<p class="tiny muted cc-mk">Mark: ' + g.mark[1] + "</p>" : "") + "</div>";
  }).join("");
}

// ---------- Explore: Carbon counter ----------
var EXF = null;
function explore(host, api){
  var S = api.S, C = api.content, X = C.exp;
  if (!S.w) S.w = W0(3);
  if (!S.mode) S.mode = "wheel";
  if (!S.f) S.f = { prod:"glucose", qty:1, co2:"", atp:"", nadph:"", run:null };
  if (!S.x) S.x = { cond:"normal", t:0 };
  var busy = false, anim = null, pend = null, seqRest = null, disp = null, fl = null, fk = 0, frun = null, msg = "", bad = false, readSig = "", ledSig = "", liveSig = "", plot = null, svg = null;
  var wide = !window.matchMedia || window.matchMedia("(min-width: 700px)").matches;
  host.innerHTML = '<div class="pg cc-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="cc-stage" id="cc-stage"></div>' +
      '<div class="cc-xstage" id="cc-xs"><div class="plot-wrap"><canvas class="plot" id="cc-xc" role="img" aria-label="Experiment graph"></canvas></div>' +
        '<p class="tiny cc-leg"><span class="cc-sw cc-sw1" aria-hidden="true"></span>RuBP (solid blue) <span class="cc-sw cc-sw2" aria-hidden="true"></span>3-PGA (long dashes). Across: time after the change (s).</p></div>' +
      '<p class="cc-cap" id="cc-cap"></p><p class="vh" id="cc-live" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div class="cc-row" id="cc-mode"></div>' +
      '<div class="cc-panel" id="cc-wp"><div class="cc-row" id="cc-start"></div>' +
        '<div class="cc-moves" role="group" aria-label="Moves">' + MOVES.map(function(m){ return '<button type="button" class="btn ghost cc-mv" data-mv="' + m.id + '" data-k="mv' + m.id + '">' + m.t + "</button>"; }).join("") + "</div>" +
        '<p class="cc-stat" id="cc-stat" role="status"></p><div class="q-actions"><button type="button" class="btn ghost sm" id="cc-reset" data-k="ccreset">Reset</button></div></div>' +
      '<div class="cc-panel" id="cc-fp"><div class="cc-row" id="cc-prod"></div><div class="cc-row" id="cc-qty"></div>' +
        '<fieldset class="cc-sup"><legend>Your supply</legend>' + [["co2", "CO₂"], ["atp", "ATP"], ["nadph", "NADPH"]].map(function(q){
          return '<div class="numrow"><label for="cc-s-' + q[0] + '">' + q[1] + ':</label><input class="numin" id="cc-s-' + q[0] + '" data-sup="' + q[0] + '" type="text" inputmode="numeric" autocomplete="off"></div>'; }).join("") + "</fieldset>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="cc-run" data-k="ccrun">Run the order</button></div><p class="tiny muted cc-note">' + C.factoryNote + "</p></div>" +
      '<div class="cc-panel" id="cc-xp"><div class="cc-row" id="cc-cond"></div><div id="cc-time"></div><p class="tiny muted cc-note"><span class="bio-model">Model data</span> ' + C.expNote + "</p></div></div>" +
    '<div class="pg-read"><dl class="read" id="cc-read"></dl><details class="cc-led" id="cc-led"' + (wide ? " open" : "") + '><summary><span id="cc-ls"></span> <span class="cc-lsd">Show details</span></summary><div id="cc-ledb"></div></details></div></div>';
  var stage = $("#cc-stage", host);
  stage.innerHTML = wheelSVG({ aria:"Calvin cycle wheel" });
  svg = $("svg", stage);
  var modeR = radios($("#cc-mode", host), { label:"Mode", options:[{ id:"wheel", t:"Turn the wheel" }, { id:"factory", t:"Factory order" }, { id:"exp", t:"Experiment" }], value:S.mode,
    onChange:function(m){ stop(); S.mode = m; msg = ""; changed(); if (m === "exp" && plot) plot.render(); } });
  var startR = radios($("#cc-start", host), { label:"Start with", cls:"chips", options:[{ id:3, t:"3 RuBP" }, { id:6, t:"6 RuBP" }], value:S.w.start,
    onChange:function(v){ stop(); S.w = W0(+v); msg = "Reset: the wheel starts with " + v + " RuBP."; bad = false; changed(); announce(); } });
  var prodR = radios($("#cc-prod", host), { label:"Product", cls:"chips", options:C.products.map(function(p){ return { id:p.id, t:p.t }; }), value:S.f.prod,
    onChange:function(v){ stop(); S.f.prod = v; S.f.run = null; changed(); } });
  var qtyS = stepper($("#cc-qty", host), { id:"cc-q", label:"Quantity", min:1, max:20, value:S.f.qty, unit:function(v){ return String(v); }, onChange:function(v){ stop(); S.f.qty = v; S.f.run = null; changed(); } });
  var condR = radios($("#cc-cond", host), { label:"Change", options:[{ id:"lights", t:"Lights off" }, { id:"co2", t:"CO₂ off" }, { id:"normal", t:"Back to normal" }], value:S.x.cond,
    onChange:function(v){ stop(); S.x.cond = v; changed(); announce(); } });
  var timeS = slider($("#cc-time", host), { id:"cc-t", label:"Time after the change", min:0, max:60, step:10, value:S.x.t, unit:function(v){ return v + " s"; },
    onChange:function(v){ stop(); S.x.t = v; changed(); announce(); } });
  $$("[data-sup]", host).forEach(function(inp){ inp.value = S.f[inp.dataset.sup] || ""; });
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.sup; if (!k) return; S.f[k] = e.target.value; S.f.run = null; api.save(); paintRead(); paintLedger(); paintCap(); MV.changed(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.sup) $("#cc-run", host).click(); });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-mv]"); if (b && !b.disabled) userMove(b.dataset.mv); });
  $("#cc-reset", host).addEventListener("click", function(){ if (busy) return; S.w = W0(S.w.start); msg = "Reset: the wheel starts with " + S.w.start + " RuBP."; bad = false; changed(); announce(); });
  $("#cc-run", host).addEventListener("click", function(){ if (!busy) runOrder(null); });

  // ---- wheel moves ----
  function userMove(mv){
    if (busy) return;
    var w = S.w;
    if (mv === "regen" && w.pga > 0) w.early = true;
    var test = Object.assign({}, w), err = doMove(test, mv);
    if (err) { msg = err; bad = true; api.save(); paintStat(); paintCap(); say("Move refused. " + err); MV.changed(); return; }
    msg = byId(MOVES, mv).done; bad = false;
    animMove(mv, 1, null);
  }
  function animMove(mv, n, done){
    var before = Object.assign({}, S.w);
    for (var i = 0; i < n; i++) doMove(S.w, mv);
    api.save();
    disp = depart(before, mv, n); fl = flightsFor(mv, n, before); fk = 0; busy = true; sync(); paintStat();
    anim = MV.tween({ dur:DUR[mv] * (n > 1 ? 1.3 : 1), ease:lin, step:function(k){ fk = k; frame(); }, done:function(){ anim = null; endMove(); if (done) done(); } });
  }
  function endMove(){ busy = false; disp = null; fl = null; paintAll(); announce(); MV.changed(); }
  function runSeq(list, done){
    seqRest = list.slice();
    (function next(){
      if (!seqRest || !seqRest.length) { seqRest = null; if (done) done(); return; }
      var s = seqRest.shift(); msg = byId(MOVES, s[0]).done; bad = false;
      animMove(s[0], s[1], function(){ MV.wait(250, next); });
    })();
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    if (seqRest) { seqRest.forEach(function(s){ for (var i = 0; i < s[1]; i++) doMove(S.w, s[0]); }); seqRest = null; }
    if (frun) { S.f.run = frun.res; frun = null; }
    if (busy) { busy = false; disp = null; fl = null; }
    if (pend) { var d = pend; pend = null; d(); }
  }
  function changed(){ api.save(); paintAll(); MV.changed(); }

  // ---- factory order (plan: carbons, CO₂ = turns, G3P = carbons ÷ 3, ATP = 3 × CO₂, NADPH = 2 × CO₂) ----
  function prodOf(){ return byId(C.products, S.f.prod) || C.products[1]; }
  function bill(){ var p = prodOf(), c = p.c * S.f.qty; return { p:p, q:S.f.qty, c:c, co2:c, turns:c, g3p:c / 3, atp:3 * c, nadph:2 * c }; }
  function orderName(b){ return b.q + " " + (b.q === 1 ? b.p.one : b.p.many); }
  function billText(b){ return orderName(b) + ": " + b.co2 + " CO₂ · " + plural(b.turns, "turn", "turns") + " · " + b.g3p + " G3P · " + b.atp + " ATP · " + b.nadph + " NADPH"; }
  function supply(){ var o = {}; ["co2", "atp", "nadph"].forEach(function(k){ var v = parseVal(S.f[k]); o[k] = v == null ? null : v; }); return o; }
  function outcome(){
    var b = bill(), s = supply(), z = { co2:s.co2 || 0, atp:s.atp || 0, nadph:s.nadph || 0 };
    var lim = [["CO₂", z.co2], ["ATP", Math.floor(z.atp / 3)], ["NADPH", Math.floor(z.nadph / 2)]].sort(function(a, c){ return a[1] - c[1]; })[0];
    var can = Math.max(0, lim[1]), done = Math.min(can, b.turns);
    return { b:b, s:z, done:done, ok:done >= b.turns, lim:lim[0], left:{ co2:z.co2 - done, atp:z.atp - 3 * done, nadph:z.nadph - 2 * done } };
  }
  function resText(r){
    if (!r.ok) return "Stopped after " + r.done + " of " + plural(r.b.turns, "turn", "turns") + ": the cycle ran out of " + r.lim + ".";
    var L = r.left, parts = [];
    if (L.co2) parts.push(L.co2 + " CO₂"); if (L.atp) parts.push(L.atp + " ATP"); if (L.nadph) parts.push(L.nadph + " NADPH");
    return parts.length ? "Order filled, with " + parts.join(", ").replace(/, ([^,]*)$/, " and $1") + " left over." : "Order filled exactly: nothing left over ✓";
  }
  function runOrder(done){
    stop();
    var r = outcome(); S.f.run = null; busy = true; frun = { res:r, k:0 }; pend = done || null; sync(); paintAll();
    anim = MV.tween({ dur:2000, ease:lin, step:function(k){ if (frun) frun.k = k; frame(); paintLedger(); }, done:function(){
      anim = null; busy = false; S.f.run = frun ? frun.res : r; frun = null; api.save(); paintAll(); announce(); MV.changed();
      var d = pend; pend = null; if (d) d();
    } });
  }

  // ---- experiment (plan table, model data) ----
  var CN = { normal:"Normal", lights:"Lights off", co2:"CO₂ off" };
  function lev(cond, key, t){
    if (cond === "normal") return 100;
    var T = X.times, a = X[cond][key];
    if (t <= 0) return a[0];
    for (var i = 1; i < T.length; i++) if (t <= T[i]) return lerp(a[i - 1], a[i], (t - T[i - 1]) / (T[i] - T[i - 1]));
    return a[a.length - 1];
  }
  function ser(cond, key, t){ var pts = []; X.times.forEach(function(tt){ if (tt <= t + 1e-9) pts.push([tt, lev(cond, key, tt)]); }); if (pts[pts.length - 1][0] < t - 1e-9) pts.push([t, lev(cond, key, t)]); return pts; }
  function expLine(t){ t = t == null ? S.x.t : t; return CN[S.x.cond] + ", " + Math.round(t) + " s: RuBP " + Math.round(lev(S.x.cond, "rubp", t)) + ", 3-PGA " + Math.round(lev(S.x.cond, "pga", t)); }
  plot = new MV.Plot($("#cc-xc", host), { xmin:-7, xmax:65, ymin:-24, ymax:212 });
  plot.render = function(){
    if (S.mode !== "exp") return;
    var css = MV.css, t = S.x.t, cond = S.x.cond, r = ser(cond, "rubp", t), g = ser(cond, "pga", t), rv = lev(cond, "rubp", t), gv = lev(cond, "pga", t), font = "700 13px " + css("--font-ui");
    var close = Math.abs(rv - gv) < 24, labs = [
      { x:t, y:rv, text:"RuBP", color:css("--pen"), align:t > 40 ? "right" : "left", dx:t > 40 ? -10 : 10, dy:close ? (rv >= gv ? -13 : 15) : -13, font:font, bg:true },
      { x:t, y:gv, text:"3-PGA", color:css("--ink"), align:t > 40 ? "right" : "left", dx:t > 40 ? -10 : 10, dy:close ? (gv > rv ? -13 : 15) : -13, font:font, bg:true }];
    plot.draw({ curves:[{ pts:g, color:css("--ink"), width:3, dash:[12, 7] }, { pts:r, color:css("--pen"), width:3.2 }],
      points:[{ x:t, y:gv, r:5, color:css("--ink") }, { x:t, y:rv, r:5, color:css("--pen") }], labels:labs,
      xTicks:{ step:10 }, yTicks:{ step:50 }, yLabel:"relative level",
      describe:"Experiment graph, model data. " + CN[cond] + (cond === "normal" ? ": RuBP and 3-PGA both stay at 100." : ". From 0 to " + Math.round(t) + " s: RuBP goes from 100 to " + Math.round(rv) + ", and 3-PGA from 100 to " + Math.round(gv) + ".") });
  };

  // ---- painting ----
  function frame(){
    if (!svg) return;
    if (S.mode === "factory") {
      var r = frun ? frun.res : S.f.run, k = frun ? frun.k : 1, n = r ? Math.round(r.done * k) : 0;
      wheelFrame(svg, { rubp:3, pga:0, g3p:0, exp:Math.floor(n / 3) }, [], 1, { ctr:r ? ["Turns: " + n, "G3P out: " + Math.floor(n / 3)] : ["Factory order", "press Run"] });
      return;
    }
    var w = S.w;
    wheelFrame(svg, disp || w, fl, fk, { ctr:disp ? [] : ["Carbon check", cIn(w) + " = " + cOut(w) + (cIn(w) === cOut(w) ? " ✓" : "")] });
  }
  function carbonText(w){ return 5 * w.start + " + " + w.co2 + " = " + cIn(w) + " carbons; " + (cIn(w) === cOut(w) ? "all accounted for ✓" : "some are missing ✗"); }
  function describe(){
    var w = S.w;
    if (S.mode === "exp") return "Experiment, model data. " + expLine() + ".";
    if (S.mode === "factory") { var b = bill(), r = S.f.run; return "Factory order: " + orderName(b) + ". " + (r ? billText(b) + ". " + resText(r) : "Not run yet."); }
    return plural(w.rubp, "RuBP", "RuBP") + ", " + w.pga + " 3-PGA, " + w.g3p + " G3P in the wheel, " + w.exp + " G3P exported. " + plural(w.co2, "CO₂", "CO₂") + " fixed, " + atpOf(w) + " ATP and " + w.nadph + " NADPH used. " +
      (cIn(w) === cOut(w) ? "All " + cIn(w) + " carbons accounted for." : "Carbons do not balance.");
  }
  function say(t){ var L = $("#cc-live", host); L.textContent = ""; setTimeout(function(){ L.textContent = t; }, 30); }
  function announce(){ var d = describe(); if (svg) svg.setAttribute("aria-label", "Calvin cycle wheel. " + describe()); if (d !== liveSig) { liveSig = d; say((S.mode === "wheel" && msg ? msg + " " : "") + d); } }
  function paintStat(){ var p = $("#cc-stat", host); p.className = "cc-stat" + (bad ? " bad" : ""); p.innerHTML = msg ? (bad ? "<strong>✗ Refused.</strong> " : "") + msg : '<span class="muted">Press a move. Every carbon is a brown dot.</span>'; }
  function capText(){
    if (S.mode === "exp") return S.x.cond === "lights" ? "Lights off: no new ATP or NADPH arrive from the thylakoids." : S.x.cond === "co2" ? "CO₂ off: no CO₂ reaches rubisco." : "Normal: light and CO₂ are both supplied, so the levels stay steady.";
    if (S.mode === "factory") { if (frun) return "Running the order…"; var r = S.f.run; return r ? resText(r) : "Choose a product and a quantity, type your supply, then press Run the order."; }
    var w = S.w;
    return "Carbon check: " + w.rubp + " RuBP × 5 + " + w.pga + " 3-PGA × 3 + " + w.g3p + " G3P × 3 + " + w.exp + " exported × 3 = " + cOut(w) + " carbons.";
  }
  function paintCap(){ $("#cc-cap", host).textContent = capText(); }
  function paintRead(){
    var w = S.w, rows;
    if (S.mode === "wheel") rows = [["RuBP in the wheel", w.rubp], ["3-PGA", w.pga], ["G3P in the wheel", w.g3p], ["G3P exported", w.exp], ["CO₂ fixed", w.co2],
      ["ATP used", atpOf(w) + ' <span class="muted">(' + w.atpR + " in reduction, " + w.atpG + " in regeneration)</span>"], ["NADPH used", w.nadph], ["Carbon check", carbonText(w)]];
    else if (S.mode === "factory") { var b = bill(), s = supply(), r = S.f.run;
      rows = [["Order", orderName(b)], ["Your supply", ["co2", "atp", "nadph"].map(function(k){ return (s[k] == null ? "?" : MV.num(s[k])) + " " + { co2:"CO₂", atp:"ATP", nadph:"NADPH" }[k]; }).join(" · ")],
        ["CO₂ / turns / G3P / ATP / NADPH", frun ? '<span class="muted">running…</span>' : r ? billText(b) : '<span class="muted">Run the order to see the bill.</span>'],
        ["Result", frun ? '<span class="muted">running…</span>' : r ? resText(r) : '<span class="muted">not run yet</span>']]; }
    else rows = [["Change", CN[S.x.cond]], ["Time after the change", Math.round(S.x.t) + " s"], ["RuBP / 3-PGA", expLine()]];
    var sig = JSON.stringify(rows); if (sig === readSig) return; readSig = sig;
    $("#cc-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintLedger(){
    var w = S.w, sum, body;
    if (S.mode === "wheel") {
      sum = "Energy ledger: " + w.co2 + " CO₂ · " + atpOf(w) + " ATP · " + w.nadph + " NADPH";
      body = '<div class="cc-tr"><span class="cc-tn">CO₂ fixed</span>' + tally(w.co2, "--bio-carbon") + "<b>" + w.co2 + "</b></div>" +
        '<div class="cc-tr"><span class="cc-tn">ATP used</span><span class="cc-tg">' + tally(w.atpR, "--bio-atp") + '<span class="tiny muted">reduction</span>' + tally(w.atpG, "--bio-atp") + '<span class="tiny muted">regeneration</span></span><b>' + atpOf(w) + "</b></div>" +
        '<div class="cc-tr"><span class="cc-tn">NADPH used</span>' + tally(w.nadph, "--bio-nadh") + "<b>" + w.nadph + "</b></div>" +
        '<p class="tiny muted">One mark per molecule: brown CO₂, orange ATP, teal NADPH.</p>';
    } else if (S.mode === "factory") {
      var r = frun ? frun.res : S.f.run, k = frun ? frun.k : 1, b = bill(), s = supply(), n = r ? r.done * k : 0;
      sum = "Energy ledger: " + (r && !frun ? "used " + r.done + " CO₂ · " + 3 * r.done + " ATP · " + 2 * r.done + " NADPH" : "supply " + (s.co2 || 0) + " CO₂ · " + (s.atp || 0) + " ATP · " + (s.nadph || 0) + " NADPH");
      body = barsHTML([["CO₂", "--bio-carbon", "co2", 1], ["ATP", "--bio-atp", "atp", 3], ["NADPH", "--bio-nadh", "nadph", 2]].map(function(q){
        var sup = s[q[2]] || 0, need = r ? b[q[2]] : null;
        return { name:q[0], tok:q[1], max:Math.max(1, sup, b[q[2]]), rows:[["Supplied", sup, "s"], ["Used", r ? Math.round(n * q[3]) : 0, "u"], ["Needed", frun ? null : need, "n"]] };
      })) + '<p class="tiny muted">“Needed” shows after you run the order.</p>';
    } else {
      var lo = S.x.cond === "lights", co = S.x.cond === "co2";
      sum = "Energy ledger: " + (lo ? "ATP and NADPH stopped" : co ? "CO₂ stopped" : "everything supplied");
      body = '<div class="cc-tr cc-tw"><span class="cc-tn">ATP and NADPH from the light reactions</span><b class="' + (lo ? "cc-off" : "cc-on") + '">' + (lo ? "✗ stopped" : "✓ arriving") + "</b></div>" +
        '<div class="cc-tr cc-tw"><span class="cc-tn">CO₂ from the air</span><b class="' + (co ? "cc-off" : "cc-on") + '">' + (co ? "✗ stopped" : "✓ arriving") + "</b></div>";
    }
    $("#cc-ls", host).textContent = sum;
    var sig = S.mode + body; if (sig === ledSig) return; ledSig = sig;
    $("#cc-ledb", host).innerHTML = body;
  }
  function sync(){
    modeR.set(S.mode); startR.set(S.w.start); prodR.set(S.f.prod); qtyS.set(S.f.qty); condR.set(S.x.cond); timeS.set(Math.round(S.x.t / 10) * 10);
    $("#cc-wp", host).hidden = S.mode !== "wheel"; $("#cc-fp", host).hidden = S.mode !== "factory"; $("#cc-xp", host).hidden = S.mode !== "exp";
    $("#cc-stage", host).hidden = S.mode === "exp"; $("#cc-xs", host).hidden = S.mode !== "exp";
    $$("[data-mv]", host).forEach(function(b){ b.disabled = busy; });
    $("#cc-reset", host).disabled = busy; $("#cc-run", host).disabled = busy;
    startR.disable(busy); prodR.disable(busy); qtyS.disable(busy); condR.disable(busy); timeS.disable(busy);
    $$("[data-sup]", host).forEach(function(i){ i.disabled = busy; });
  }
  function paintAll(){ sync(); frame(); paintStat(); paintCap(); paintRead(); paintLedger(); if (S.mode === "exp") plot.render(); if (svg) svg.setAttribute("aria-label", "Calvin cycle wheel. " + describe()); }

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    if (id === "tc1") {
      var w = S.w;
      if (w.start === 3 && w.rubp === 3 && w.pga === 0 && w.g3p === 0 && w.exp === 1 && w.co2 === 3 && atpOf(w) === 9 && w.nadph === 6) return { ok:true };
      if (w.start !== 3) return { ok:false, msg:"Start from 3 RuBP: choose “3 RuBP” in Turn the wheel (it resets the wheel)." };
      if (w.co2 > 3) return { ok:false, msg:"That’s more than one turn: " + w.co2 + " CO₂ fixed. Reset and fix only 3 CO₂." };
      if (w.exp >= 2) return { ok:false, msg:"Only 4 G3P (12 C) are left, but 3 RuBP need 15 C." };
      if (w.early) return { ok:false, msg:"Regeneration needs 5 G3P." };
      if (w.co2 < 3) return { ok:false, msg:"Fix 3 CO₂ first: you’ve fixed " + w.co2 + "." };
      if (w.pga > 0) return { ok:false, msg:"There’s still " + plural(w.pga, "3-PGA", "3-PGA") + " left over: reduce every 3-PGA." };
      if (w.exp === 0) return { ok:false, msg:"No G3P has been exported yet." };
      return { ok:false, msg:"Not yet: end with 3 RuBP, no 3-PGA, no G3P in the wheel and 1 G3P exported." };
    }
    if (id === "tc2" || id === "tc3") {
      var s = supply(), want = id === "tc2" ? [6, 18, 12] : [60, 180, 120], got = [s.co2, s.atp, s.nadph];
      if (got.some(function(v){ return v == null; })) return { ok:false, msg:"Type all three numbers in the Factory order supply boxes (CO₂, ATP and NADPH)." };
      function is(a){ return got[0] === a[0] && got[1] === a[1] && got[2] === a[2]; }
      if (is(want)) return { ok:true };
      if (id === "tc2") { if (is([3, 9, 6])) return { ok:false, msg:"That’s one G3P; glucose needs two." }; if (is([1, 3, 2])) return { ok:false, msg:"That’s per CO₂." }; }
      else { if (is([30, 90, 60])) return { ok:false, msg:"That’s one G3P per glucose unit; each unit needs two." }; if (is([10, 30, 20])) return { ok:false, msg:"One CO₂ per glucose? Each glucose has 6 carbons." }; if (is([60, 180, 180])) return { ok:false, msg:"NADPH is 2 per CO₂, not 3." }; }
      if (got[0] !== want[0]) return { ok:false, msg:"Count the carbons first: one CO₂ for each carbon." };
      if (got[1] !== want[1]) return { ok:false, msg:"Your CO₂ is right. ATP is 3 per CO₂." };
      return { ok:false, msg:"Your CO₂ and ATP are right. NADPH is 2 per CO₂." };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (v) { paintAll(); } } };
  paintAll(); announce();
  return {
    predict:{
      start:function(p){
        stop(); msg = ""; bad = false;
        if (p.start.mode === "wheel") { S.mode = "wheel"; S.w = W0(3); if (p.start.pga6) { S.w.rubp = 0; S.w.pga = 6; S.w.co2 = 3; } }
        else { S.mode = "exp"; S.x = { cond:"normal", t:0 }; }
        changed();
      },
      run:function(p, done){
        pend = done;
        function fin(){ var d = pend; pend = null; announce(); if (d) d(); }
        if (p.id === "p1") { runSeq([["fix", 1], ["fix", 1], ["fix", 1]], fin); return; }
        if (p.id === "p2") { runSeq([["red", 6], ["regen", 1], ["exp", 1]], fin); return; }
        S.x.cond = p.to; S.x.t = 0; busy = true; paintAll();
        anim = MV.tween({ dur:3200, ease:lin, step:function(k){ S.x.t = 60 * k; timeS.set(Math.round(S.x.t / 10) * 10); plot.render(); paintRead(); }, done:function(){
          anim = null; busy = false; S.x.t = 60; api.save(); paintAll(); MV.changed(); fin(); } });
      }
    },
    challenge:chal
  };
}

// ---------- hero: one turn of the wheel (3 CO₂ fixed, 6 reduced, 1 G3P out, 5 G3P → 3 RuBP); reduced motion: still diagram ----------
function hero(f){
  var box = $("#cc-hero"); if (!box) return;
  var cap = f && f.cap, w = W0(3), END = ["18 carbons in,", "18 carbons out", "of the wheel"];
  box.innerHTML = wheelSVG({});
  var svg = $("svg", box);
  var CAPS = ["A wheel in the stroma holds three RuBP: five carbons each.", "Rubisco joins 3 CO₂ to the 3 RuBP: six 3-PGA.",
    "Six ATP and six NADPH arrive from the thylakoid: the six 3-PGA become G3P.", "One G3P rolls out of the wheel: the sugar.",
    "The other five, with three more ATP, are rebuilt into three RuBP.", "Three CO₂ in, one G3P out: 15 + 3 = 18 carbons in, and 15 in RuBP + 3 in the sugar = 18 carbons out."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  if (MV.reduceMotion) {
    var still = molSVG("co2", 372, 34) + molSVG("atp", 46, 318) + molSVG("nadph", 96, 318) + molSVG("atp", 46, 137);
    wheelFrame(svg, { rubp:3, pga:0, g3p:0, exp:1 }, [], 1, { ctr:END, extra:still }); setCap(5); return;
  }
  var seq = [["fix", 3], ["red", 6], ["exp", 1], ["regen", 1]], i = 0;
  wheelFrame(svg, w, [], 0, {}); setCap(0);
  function next(){
    if (i >= seq.length) { wheelFrame(svg, w, [], 1, { ctr:END }); setCap(5); return; }
    var mv = seq[i][0], n = seq[i][1], before = Object.assign({}, w);
    for (var j = 0; j < n; j++) doMove(w, mv);
    var F = flightsFor(mv, n, before), d = depart(before, mv, n); i++; setCap(i);
    MV.tween({ dur:mv === "exp" ? 1200 : 2000, ease:lin, step:function(k){ wheelFrame(svg, d, F, k, {}); }, done:function(){ wheelFrame(svg, w, [], 1, {}); setTimeout(next, 900); } });
  }
  setTimeout(next, 1400);
}

// ---------- Part 3: Where the sugar goes ----------
// Station 1: ¹⁴C data table (S7 data table, tappable rows) + "Check it with data" graph; Station 2: @component S1 diagramExplorer
// (lite) — a leaf cell whose destinations light up when tapped; Station 3: @component rubiscoZoom — rubisco's active site with
// a light switch (pH and Mg²⁺), CO₂ joining RuBP, two 3-PGA leaving (reduced motion: one still frame).
var P3F = null;
function part3(host, api){
  var P = api.content, S = api.S, s1 = P.s1, s2 = P.s2, s3 = P.s3;
  S.s1 = S.s1 || { tries:0 }; S.rev = S.rev || {}; S.dest = S.dest || {}; if (!S.light) S.light = "on";
  var vis = false, zraf = 0, zt0 = null, lplot = null;
  host.innerHTML =
    '<section class="cc-sta" aria-labelledby="cc-s1h"><h3 id="cc-s1h">' + s1.title + "</h3><p>" + s1.text + "</p>" +
      '<div class="tbl-wrap"><table class="cc-tbl"><caption class="vh">Share of the carbon-14 label (%), model data</caption><thead><tr>' + s1.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
      s1.rows.map(function(r){ return '<tr data-tr="' + r.id + '"><th scope="row"><button type="button" class="cc-rowb" data-row="' + r.id + '" data-k="ccrow' + r.id + '" aria-pressed="false">' + r.t + "</button></th>" + r.v.map(function(v){ return "<td>" + v + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div><p class="tiny muted cc-tcap">' + s1.caption + ' <span class="bio-model">Model data</span></p>' +
      '<div class="cc-task"><p class="cc-tp"><span class="tag">Tap a row</span> ' + s1.tap.prompt + '</p><div id="cc-s1fb"></div></div>' +
      s1.prompts.map(function(p){ return '<div class="cc-task" data-rv="' + p.id + '"></div>'; }).join("") +
      '<details class="alg" id="cc-s1d"><summary>' + s1.graphTitle + '</summary><div class="plot-wrap cc-s1g"><canvas class="plot" id="cc-s1c" role="img" aria-label="Labelling graph"></canvas></div><p class="tiny muted">' + s1.graphNote + "</p></details></section>" +
    '<section class="part cc-sta" aria-labelledby="cc-s2h"><h3 id="cc-s2h">' + s2.title + "</h3><p>" + s2.text + '</p><div class="cc-s2"><div class="cc-cell" id="cc-cell"></div><div><div class="cc-dests" role="group" aria-label="Destinations of G3P">' +
      s2.dest.map(function(d){ return '<button type="button" class="btn ghost sm cc-dst" data-dst="' + d.id + '" data-k="ccd' + d.id + '" aria-pressed="false">' + d.t + "</button>"; }).join("") + '</div><div class="cc-dinfo" id="cc-dinfo" aria-live="polite"></div></div></div></section>' +
    '<section class="part cc-sta" aria-labelledby="cc-s3h"><h3 id="cc-s3h">' + s3.title + "</h3><p>" + s3.text + '</p><div class="cc-s3"><div><div class="cc-row" id="cc-lt"></div><div class="cc-zs" id="cc-zs"></div></div><div><dl class="read" id="cc-zr"></dl><p id="cc-zcap"></p></div></div>' +
      '<p class="cc-zslow">' + s3.slow + "</p><p><strong>" + s3.concl + '</strong></p><p class="tiny muted">' + s3.more + "</p></section>";

  // ---- Station 1 ----
  function paintS1(){
    var st = S.s1, fb = $("#cc-s1fb", host);
    $$("[data-row]", host).forEach(function(b){ var on = st.pick === b.dataset.row; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); b.closest("tr").classList.toggle("cc-hit", on); b.disabled = !!st.solved; });
    if (st.solved) fb.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.tap.good + (st.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (st.pick) fb.innerHTML = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s1.tap.bad + " Try another row.");
    else fb.innerHTML = "";
    s1.prompts.forEach(function(p){
      var box = $('[data-rv="' + p.id + '"]', host), on = !!S.rev[p.id];
      MV.keepFocus(box, function(){ box.innerHTML = '<p class="cc-tp"><span class="tag">Think</span> ' + p.q + "</p>" + (on ? MV.fbHTML("", "<strong>Answer:</strong> " + p.a) : '<div class="q-actions"><button type="button" class="btn ghost sm" data-show="' + p.id + '" data-k="ccshow' + p.id + '">Show the answer</button></div>'); });
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.row) { var st = S.s1; st.pick = b.dataset.row; if (st.pick === MV.ans(s1.tap)) { st.solved = true; st.first = !st.tries; } else st.tries = (st.tries || 0) + 1; api.save(); paintS1(); MV.focusFb($("#cc-s1fb", host)); return; }
    if (b.dataset.show) { S.rev[b.dataset.show] = true; api.save(); paintS1(); return; }
    if (b.dataset.dst) { S.dest[b.dataset.dst] = true; S.cur = b.dataset.dst; api.save(); paintS2(); return; }
  });
  var LS = { pga:["--ink", [12, 7], 3], g3p:["--bio-carbon", null, 3], suc:["--ink-2", null, 3.4], aa:["--ink-2", [2, 6], 3] }, LN = { pga:"3-PGA", g3p:"G3P etc.", suc:"sucrose", aa:"amino acids etc." };
  lplot = new MV.Plot($("#cc-s1c", host), { xmin:-0.5, xmax:4.6, ymin:-12, ymax:100 });
  lplot.render = function(){
    var css = MV.css, curves = [], points = [], labels = [], font = "700 12px " + css("--font-ui"), dyv = { pga:-12, g3p:-12, suc:-12, aa:14 };
    s1.rows.forEach(function(r){
      var c = LS[r.id], col = css(c[0]), pts = r.v.map(function(v, i){ return [i + 1, v]; });
      curves.push({ pts:pts, color:col, width:c[2], dash:c[1] || undefined });
      pts.forEach(function(q){ points.push({ x:q[0], y:q[1], r:3.6, color:col }); });
    });
    labels.push({ x:1, y:85, text:"3-PGA", color:css("--ink"), align:"left", dx:8, dy:-4, font:font, bg:true });
    labels.push({ x:4, y:40, text:"sucrose", color:css("--ink-2"), align:"right", dx:-8, dy:-12, font:font, bg:true });
    labels.push({ x:3, y:40, text:"G3P etc.", color:css("--bio-carbon"), align:"right", dx:-8, dy:-10, font:font, bg:true });
    labels.push({ x:2, y:10, text:"amino acids etc.", color:css("--ink-2"), align:"center", dy:-14, font:font, bg:true });
    lplot.draw({ curves:curves, points:points, labels:labels, xTicks:{ step:1, fmt:function(v){ var t = ["", "2 s", "5 s", "30 s", "90 s"][Math.round(v)]; return Math.abs(v - Math.round(v)) < 1e-6 && t ? t : ""; } }, yTicks:{ step:20 },
      yLabel:"share of the label (%)",
      describe:"Model data. Share of the carbon-14 label at 2, 5, 30 and 90 s. " + s1.rows.map(function(r){ return LN[r.id] + ": " + r.v.join(", "); }).join("; ") + ". 3-PGA starts highest and falls; sucrose starts at 0 and rises last." });
  };
  $("#cc-s1d", host).addEventListener("toggle", function(e){ if (e.target.open) lplot.render(); });

  // ---- Station 2: leaf cell (G3P destinations) ----
  function cellSVG(cur, rev){
    var h = "";
    function hl(id, shape){ return '<g class="cc-hl' + (cur === id ? " on" : "") + '">' + shape + "</g>"; }
    function lab(id, x, y, s, anchor){ return rev[id] ? txt(x, y, s, "cc-dl", anchor) : txt(x, y, "?", "cc-dq", anchor); }
    h += hl("cel", sv("rect", { x:2, y:2, width:276, height:206, rx:20, "class":"cc-hls" }));
    h += sv("rect", { x:9, y:9, width:262, height:192, rx:15, "class":"cc-wall" }) + lab("cel", 140, 196, "cell wall: cellulose", "middle");
    h += sv("ellipse", { cx:82, cy:76, rx:64, ry:44, "class":"cc-chl" }) + txt(82, 48, "chloroplast", "cc-sub", "middle") + molSVG("g3p", 56, 76);
    h += hl("sta", sv("ellipse", { cx:116, cy:80, rx:24, ry:21, "class":"cc-hls" }));
    [[108, 70], [124, 80], [110, 92]].forEach(function(q){ h += sv("ellipse", { cx:q[0], cy:q[1], rx:8, ry:5.5, "class":"cc-starch" }); });
    h += lab("sta", 116, 110, "starch", "middle");
    h += arrowPath([[147, 72], [168, 66]], "cc-arr") + txt(212, 60, "glucose +", "cc-lab", "middle") + txt(212, 74, "fructose", "cc-lab", "middle");
    h += hl("fuel", sv("ellipse", { cx:204, cy:148, rx:44, ry:24, "class":"cc-hls" }));
    h += sv("ellipse", { cx:204, cy:148, rx:36, ry:16, "class":"cc-mito" }) + sv("path", { d:"M176 148 q7 -10 14 0 t14 0 t14 0 t14 0", "class":"cc-cris" }) + lab("fuel", 204, 180, "fuel: mitochondrion", "middle");
    h += arrowPath([[204, 82], [204, 128]], "cc-arr");
    h += hl("aa", sv("rect", { x:22, y:134, width:116, height:42, rx:10, "class":"cc-hls" }));
    h += molSVG("pga", 50, 150) + sv("circle", { cx:72, cy:150, r:4, "class":"cc-nit" }) + txt(80, 154, "N", "cc-sub") + lab("aa", 80, 170, "amino acids, fats", "middle");
    h += arrowPath([[62, 118], [56, 138]], "cc-arr");
    h += hl("suc", sv("rect", { x:290, y:2, width:52, height:206, rx:14, "class":"cc-hls" }));
    h += sv("rect", { x:298, y:10, width:36, height:190, rx:10, "class":"cc-phl" }) + '<text class="cc-sub" text-anchor="middle" transform="translate(310 130) rotate(-90)">phloem</text>';
    h += arrowPath([[244, 66], [323, 66], [323, 186]], "cc-arr") + lab("suc", 264, 58, "sucrose", "middle") + lab("suc", 356, 222, "to roots and fruit", "end");
    return '<svg viewBox="0 0 360 230" class="cc-svg" role="img" aria-label="' + MV.esc("A leaf cell. G3P is made in the chloroplast and turned into glucose and fructose. " + s2.dest.map(function(d){ return rev[d.id] ? d.t + ": " + d.d : ""; }).filter(Boolean).join(" ")) + '">' + h + "</svg>";
  }
  function paintS2(){
    var cur = S.cur, n = s2.dest.filter(function(d){ return S.dest[d.id]; }).length, d = cur ? byId(s2.dest, cur) : null;
    $("#cc-cell", host).innerHTML = cellSVG(cur, S.dest);
    $$("[data-dst]", host).forEach(function(b){ var on = b.dataset.dst === cur; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); b.classList.toggle("seen", !!S.dest[b.dataset.dst]); });
    $("#cc-dinfo", host).innerHTML = (d ? "<p><strong>" + d.t + ":</strong> " + d.d + "</p>" : '<p class="muted">Tap a destination.</p>') + '<p class="tiny muted">' + n + " of " + s2.dest.length + " revealed.</p>" + (n === s2.dest.length ? MV.fbHTML("good", s2.done) : "");
  }

  // ---- Station 3: rubisco zoom ----
  radios($("#cc-lt", host), { label:"Light", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.light, onChange:function(v){ S.light = v; api.save(); paintZ(); zdraw(0); zensure(); } });
  function enz(on){
    var top = 92, pw = on ? 58 : 34, pd = on ? 30 : 8;
    return "M58 140 C58 104 86 " + top + " " + (160 - pw / 2 - 20) + " " + top + " L" + (160 - pw / 2) + " " + top + " C" + (160 - pw / 2) + " " + (top + pd) + " " + (160 + pw / 2) + " " + (top + pd) + " " + (160 + pw / 2) + " " + top +
      " L" + (160 + pw / 2 + 20) + " " + top + " C234 " + top + " 262 104 262 140 C262 172 216 184 160 184 C104 184 58 172 58 140Z";
  }
  var ZR = MV.bio.rng("cc-rubisco"), ZP = [0, 1, 2].map(function(){ return { ax:ZR.range(70, 120), ay:ZR.range(8, 20), cy:ZR.range(30, 50), w1:ZR.range(0.6, 1.1), w2:ZR.range(1, 1.7), p1:ZR.range(0, 6.28), p2:ZR.range(0, 6.28) }; });
  function zdraw(t){
    var on = S.light === "on", h = "", site = [160, 110], P2 = 3.2;
    h += sv("rect", { x:0, y:0, width:320, height:200, rx:10, "class":"cc-zbg" }) + txt(10, 18, "stroma", "cc-sub");
    h += sv("rect", { x:10, y:26, width:104, height:22, rx:11, "class":"cc-swi" + (on ? " on" : "") }) + txt(62, 41, on ? "pH ≈ 8 ✓" : "more acidic", "cc-swt", "middle");
    h += sv("rect", { x:206, y:26, width:104, height:22, rx:11, "class":"cc-swi" + (on ? " on" : "") }) + txt(258, 41, on ? "Mg²⁺ high ✓" : "Mg²⁺ low", "cc-swt", "middle");
    h += sv("path", { d:enz(on), "class":"cc-enz" + (on ? "" : " off") }) + txt(160, 160, "rubisco", "cc-ph", "middle") + txt(160, 175, on ? "(switched on)" : "(switched off)", "cc-sub", "middle");
    var u = MV.reduceMotion ? 0.45 : (t % P2) / P2, still = MV.reduceMotion;
    if (on) {
      if (u < 0.38) { var k = MV.ease(u / 0.38); h += molSVG("rubp", site[0], site[1]) + molSVG("co2", lerp(44, 186, k), lerp(64, site[1] - 18, k)); }
      else if (u < 0.55) h += molSVG("c6", site[0], site[1]);
      else { var k2 = MV.ease((u - 0.55) / 0.4), a = u > 0.85 ? (1 - u) / 0.15 : 1; h += molSVG("pga", lerp(site[0], 46, k2), lerp(site[1], 80, k2), a) + molSVG("pga", lerp(site[0], 274, k2), lerp(site[1], 80, k2), a);
        if (u > 0.8) h += molSVG("rubp", site[0], site[1], (u - 0.8) / 0.2); }
      if (still) h += molSVG("pga", 52, 80) + molSVG("pga", 268, 80) + arrowPath([[134, 100], [72, 84]], "cc-arr") + arrowPath([[186, 100], [248, 84]], "cc-arr");
    } else {
      h += molSVG("rubp", site[0], site[1]);
      ZP.forEach(function(q){ h += molSVG("co2", 160 + q.ax * Math.sin(q.w1 * t + q.p1), clamp(q.cy + q.ay * Math.sin(q.w2 * t + q.p2), 60, 76)); });
    }
    $("#cc-zs", host).innerHTML = '<svg viewBox="0 0 320 200" class="cc-svg" role="img" aria-label="' + MV.esc(on ? "Rubisco in the light: switched on by a less acidic stroma (about pH 8) and more Mg²⁺. A CO₂ enters the active site and joins RuBP; the 6-carbon product splits into two 3-PGA." : "Rubisco in the dark: switched off. The stroma is more acidic with less Mg²⁺. CO₂ drifts nearby, but no fixation happens.") + '">' + h + "</svg>";
  }
  function paintZ(){
    var on = S.light === "on";
    $("#cc-zr", host).innerHTML = MV.readoutHTML([["Stroma", on ? "less acidic (about pH 8)" : "more acidic"], ["Mg²⁺ in the stroma", on ? "more" : "less"], ["Rubisco", on ? "switched on" : "switched off"], ["ATP and NADPH", on ? "arriving" : "stopped"]]);
    $("#cc-zcap", host).textContent = on ? s3.on : s3.off;
  }
  function zloop(now){ zraf = 0; if (!vis || MV.reduceMotion) return; if (zt0 === null) zt0 = now; zdraw((now - zt0) / 1000); zraf = requestAnimationFrame(zloop); }
  function zensure(){ if (!zraf && vis && !MV.reduceMotion) zraf = requestAnimationFrame(zloop); }
  paintS1(); paintS2(); paintZ(); zdraw(0);
  P3F = { show:function(v){ vis = v; if (v) { zensure(); if ($("#cc-s1d", host).open) lplot.render(); } } };
  return {};
}

// ---------- Practice 2: Calvin cycle detective (chips and N4 number entry; adapted from SBI4U 06 "Predict and calculate") ----------
function detective(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chips") h += '<div class="sq-c cc-chips" role="group" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.last === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ci="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    else h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="cc-unit">' + it.unit + "</span></div>";
    if (!x.solved) h += '<div class="q-actions">' + (it.kind === "num" ? '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' : "") + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (x.why || it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id), ok = null;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.ci != null) {
      var o = it.options[+b.dataset.ci]; x.last = +b.dataset.ci; ok = MV.ok(o);
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + o.why + " Try again.";
      if (ok) x.why = o.why;
    } else if (b.dataset.act === "check") {
      var v = parseVal(x.val), an = MV.ans(it);
      if (v == null) { msgs[it.id] = "Enter a whole number, such as 12 or 250."; paintItem(it); return; }
      ok = Math.abs(v - an) < 1e-6;
      if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) < 1e-6; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
      else msgs[it.id] = null;
    } else return;
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Plan a sugar order (steppers + sliders; live carbon counter and S3 energy ledger) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; ["g", "s", "co2", "atp", "nadph"].forEach(function(k){ if (s[k] == null) s[k] = 0; }); return s; }
  function read(){ if (!api) return { g:0, s:0, co2:0, atp:0, nadph:0 }; var s = st(); return { g:+s.g, s:+s.s, co2:+s.co2, atp:+s.atp, nadph:+s.nadph }; }
  function units(d){ return d.g + 2 * d.s; }
  function hex(x, y){ var p = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; p += (i ? "L" : "M") + f1(x + 9 * Math.cos(a)) + " " + f1(y + 9 * Math.sin(a)); } return sv("path", { d:p + "Z", "class":"cc-hex" }); }
  function draw(){
    var d = read(), u = units(d), box = $("#cc-tpv"); if (!box) return;
    var icons = "", x = 14, i;
    for (i = 0; i < d.g; i++) { icons += hex(x, 16); x += 24; }
    if (d.g && d.s) x += 8;
    for (i = 0; i < d.s; i++) { icons += hex(x, 16) + hex(x + 17, 16); x += 46; }
    var need = 6 * u;
    box.innerHTML = '<h4 class="cc-th">Your batch</h4><div class="cc-batch">' + (d.g || d.s ? '<svg viewBox="0 0 ' + Math.max(40, x) + ' 32" class="cc-bsvg" aria-hidden="true" focusable="false">' + icons + "</svg>" : "") +
      "<p>" + plural(d.g, "glucose", "glucose") + " + " + plural(d.s, "sucrose", "sucrose") + " = <strong>" + plural(u, "glucose-sized unit", "glucose-sized units") + "</strong> = " + need + " carbons.</p></div>" +
      '<h4 class="cc-th">Carbon counter</h4>' + barsHTML([{ name:"Carbon", tok:"--bio-carbon", max:36, status:d.co2 === need ? "balanced ✓" : "not balanced", rows:[["In the batch", need, "n"], ["CO₂ fixed", d.co2, "s"]] }]) +
      '<h4 class="cc-th">Energy ledger</h4>' + barsHTML([
        { name:"ATP", tok:"--bio-atp", max:108, mark:[72, "budget, 72 ATP"], status:d.atp === 3 * d.co2 ? "matches ✓" : "doesn’t match", rows:[["Supplied", d.atp, "s"], ["Needed (3 × CO₂)", 3 * d.co2, "n"]] },
        { name:"NADPH", tok:"--bio-nadh", max:72, status:d.nadph === 2 * d.co2 ? "matches ✓" : "doesn’t match", rows:[["Supplied", d.nadph, "s"], ["Needed (2 × CO₂)", 2 * d.co2, "n"]] }]);
    box.setAttribute("aria-label", "Batch: " + d.g + " glucose and " + d.s + " sucrose, " + u + " units, " + need + " carbons. CO₂ fixed " + d.co2 + ". ATP supplied " + d.atp + ", needed " + 3 * d.co2 + ", budget 72. NADPH supplied " + d.nadph + ", needed " + 2 * d.co2 + ".");
  }
  function parse(k){ var p = k.split("-").map(Number), u = p[0] + 2 * p[1]; return { g:p[0], s:p[1], co2:6 * u, atp:18 * u, nadph:12 * u }; }
  function lab(k){ var q = parse(k); return plural(q.g, "glucose", "glucose") + " + " + plural(q.s, "sucrose", "sucrose") + ": " + q.co2 + " CO₂, " + q.atp + " ATP, " + q.nadph + " NADPH"; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="cc-tin"><div id="cc-tg"></div><div id="cc-tsu"></div><div id="cc-tco2"></div><div id="cc-tatp"></div><div id="cc-tnad"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      stepper($("#cc-tg", inp), { id:"cc-tgv", label:"Glucose <i>g</i>", min:0, max:4, value:s.g, onChange:function(v){ s.g = v; upd(); } });
      stepper($("#cc-tsu", inp), { id:"cc-tsv", label:"Sucrose <i>s</i>", min:0, max:3, value:s.s, onChange:function(v){ s.s = v; upd(); } });
      slider($("#cc-tco2", inp), { id:"cc-tc", label:"CO₂ fixed", min:0, max:36, step:3, value:s.co2, unit:function(v){ return v + " CO₂"; }, onChange:function(v){ s.co2 = v; upd(); } });
      slider($("#cc-tatp", inp), { id:"cc-ta", label:"ATP supplied", min:0, max:108, step:9, value:s.atp, unit:function(v){ return v + " ATP"; }, onChange:function(v){ s.atp = v; upd(); } });
      slider($("#cc-tnad", inp), { id:"cc-tn", label:"NADPH supplied", min:0, max:72, step:6, value:s.nadph, unit:function(v){ return v + " NADPH"; }, onChange:function(v){ s.nadph = v; upd(); } });
      pv.innerHTML = '<div class="cc-tpv" id="cc-tpv" role="group"></div>';
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 5) return;
        $$("p", g).forEach(function(q){ if (q.innerHTML.indexOf(T.more) >= 0) q.innerHTML = q.innerHTML.replace(T.more, T.allFound); });
        if (!g.querySelector(".cc-all")) { var p = document.createElement("p"); p.className = "cc-all"; p.innerHTML = T.afterAll; g.appendChild(p); }
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var u = units(d); return [u >= 3, d.co2 === 6 * u, d.atp === 3 * d.co2, d.nadph === 2 * d.co2, d.atp <= 72]; },
    key:function(d){ return d.g + "-" + d.s; },
    label:lab,
    text:lab
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ detective:detective },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); if (P3F) P3F.show(v === "sugar"); }
});
})();
