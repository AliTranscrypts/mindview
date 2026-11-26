// SBI4U 42 Insulin and Glucagon: hero (balance scale + 24-hour storyboard), Blood glucose day (S11 timeline graph + S8 feedback
// view, four modes), A Canadian discovery (ordering, patient data, card match, dish investigation), a "Read the glucose chart"
// set (chips + number entry), and "Plan a model day" (task). All values come from the plan's deterministic model rules.
// VERIFY: the 4.0–7.0 band, the 4.0 hypoglycemia line and the 10 mmol/L kidney limit against Diabetes Canada guidance.
(function(){
"use strict";
var $ = MV.$;
function $$(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function f2(v){ return String(Math.round(v * 100) / 100); }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ig-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function pad(n){ return (n < 10 ? "0" : "") + n; }
function g1(v){ return MV.num(f1(v), 1); }
function near(a, b){ return Math.abs(a - b) < 1e-6; }
function copy(o){ return JSON.parse(JSON.stringify(o)); }
// straight arrow with a filled head; w = stroke width
function arrow(x1, y1, x2, y2, cls, w, op){
  var L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, s = 4 + w * 1.1, bx = x2 - ux * s, by = y2 - uy * s;
  var hd = "M" + f1(x2) + " " + f1(y2) + " L" + f1(bx - uy * s * 0.75) + " " + f1(by + ux * s * 0.75) + " L" + f1(bx + uy * s * 0.75) + " " + f1(by - ux * s * 0.75) + " Z";
  return '<g class="' + cls + '"' + (op != null && op < 0.99 ? ' opacity="' + f2(op) + '"' : "") + ">" + sv("line", { x1:x1, y1:y1, x2:bx, y2:by, "stroke-width":w }) + sv("path", { d:hd }) + "</g>";
}

// ---------- @component radioGroup (copied from SBI4U 07 / 06 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- @component stepper (from SBI4U 19 / 15 / 08 / 10; adds o.step) — − / + buttons around a live value ----------
// stepper(host, {id, label, min, max, step, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label), st = o.step || 1;
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="ig-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="ig-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="ig-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + st * (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}

// ---------- @component switchBtn (from SBI4U 12 / 09 / HFA4U 09) — role="switch" button with a visible On/Off word ----------
function switchHTML(k, label, on, dis){
  return '<button type="button" class="ig-swb" role="switch" aria-checked="' + on + '" data-sw="' + k + '" data-k="igsw' + k + '"' + (dis ? " disabled" : "") + '><span class="ig-swk" aria-hidden="true"></span><span>' + label + '</span><span class="ig-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- @component S11 glucoseDay — the plan's deterministic day model (06:00 → 06:00, 49 half-hour points) ----------
// sim(st) with st = {mode:"normal"|"t1u"|"t1i"|"t2", size:{b,l,d} (r = 2|3|4), dose:{b,l,d}, run:"none"|"b"|"l"|"d"|"r15", t2run, t2med}
// -> {g[], ins[], gcg[], run[] (a run starts at that point), ends:{b,l,d} (3-h values), min, minI}
var MEALS = [{ id:"b", name:"Breakfast", lc:"breakfast", m:2, at:"07:00" }, { id:"l", name:"Lunch", lc:"lunch", m:12, at:"12:00" }, { id:"d", name:"Dinner", lc:"dinner", m:24, at:"18:00" }];
var N = 49, SIZES = [{ id:"2", t:"Small (+2)" }, { id:"3", t:"Medium (+3)" }, { id:"4", t:"Large (+4)" }], SIZEW = { 2:"small", 3:"medium", 4:"large" };
var MODES = [{ id:"normal", t:"Normal" }, { id:"t1u", t:"Type 1, untreated" }, { id:"t1i", t:"Type 1 with insulin" }, { id:"t2", t:"Type 2" }];
function clock(i){ var mins = Math.round(360 + i * 30) % 1440; return pad(Math.floor(mins / 60)) + ":" + pad(mins % 60); }
function hClock(h){ return clock(h * 2); }
function ramp(i, a, b){ return clamp((i - a) / (b - a), 0, 1); }
function knots(i, K){
  if (i <= K[0][0]) return K[0][1];
  for (var j = 1; j < K.length; j++) if (i <= K[j][0]) return lerp(K[j - 1][1], K[j][1], (i - K[j - 1][0]) / (K[j][0] - K[j - 1][0]));
  return K[K.length - 1][1];
}
function insN(g){ return g >= 5 ? 10 + 20 * (g - 5) : 10; }
function gcgN(g){ return g < 5 ? 10 + 20 * (5 - g) : 10; }
function sim(st){
  var mode = st.mode, sz = st.size, ds = st.dose, out = { g:[], ins:[], gcg:[], run:[], ends:{} }, after = {};
  MEALS.forEach(function(m){ after[m.id] = st.run === m.id || (mode === "t2" && !!st.t2run); });
  var carry = {}, totC = 0;
  MEALS.forEach(function(m){ var r = +sz[m.id]; carry[m.id] = (st.t2med ? r / 4 : r / 2) - (after[m.id] ? 1 : 0); totC += carry[m.id]; });
  for (var i = 0; i < N; i++) {
    var v, u;
    if (mode === "normal") {
      v = i <= 2 || i >= 36 ? 4.8 : 5;
      MEALS.forEach(function(m){ var r = +sz[m.id]; if (i > m.m && i <= m.m + 6) v = knots(i, [[m.m, m.m === 2 ? 4.8 : 5], [m.m + 2, 5 + r], [m.m + 4, 5 + r / 2], [m.m + 6, 5]]); });
      if (st.run === "r15" && i === 19) v = 4.5;
      u = insN(v);
      // A run after a meal: the healthy pancreas releases less insulin (plan); the model halves the meal's extra insulin.
      MEALS.forEach(function(m){ if (after[m.id] && i > m.m && i < m.m + 6) u = v >= 5 ? 10 + 10 * (v - 5) : 10; });
    } else if (mode === "t1u") {
      v = 8 + ramp(i, 26, 48);
      MEALS.forEach(function(m){ v += +sz[m.id] * ramp(i, m.m, m.m + 2) - (after[m.id] ? ramp(i, m.m + 2, m.m + 3) : 0); });
      u = 2;
    } else if (mode === "t1i") {
      v = 5; u = 2;
      MEALS.forEach(function(m){
        var r = +sz[m.id], d = +ds[m.id], e = after[m.id] ? 1 : 0;
        v += knots(i, [[m.m, 0], [m.m + 2, r - d / 4], [m.m + 6, r - d / 2 - e]]);
        u += 10 * d * knots(i, [[m.m, 0], [m.m + 2, 1], [m.m + 4, 0.5], [m.m + 6, 0]]);
      });
    } else {
      v = 6.5 - totC * ramp(i, 30, 48);
      MEALS.forEach(function(m){ v += knots(i, [[m.m, 0], [m.m + 2, +sz[m.id]], [m.m + 6, carry[m.id]]]); });
      u = 2 * insN(v);
    }
    out.g.push(v); out.ins.push(u); out.gcg.push(gcgN(v)); out.run.push(false);
  }
  MEALS.forEach(function(m){ out.ends[m.id] = out.g[m.m + 6]; if (after[m.id]) out.run[m.m + 2] = true; });
  if (mode === "normal" && st.run === "r15") out.run[18] = true;
  out.min = Math.min.apply(null, out.g); out.minI = out.g.indexOf(out.min);
  return out;
}
function blend(A, B, k){ var o = { g:[], ins:[], gcg:[], run:B.run }; for (var i = 0; i < N; i++) { o.g.push(lerp(A.g[i], B.g[i], k)); o.ins.push(lerp(A.ins[i], B.ins[i], k)); o.gcg.push(lerp(A.gcg[i], B.gcg[i], k)); } return o; }
function valAt(arr, t){ var a = Math.floor(t), b = Math.min(N - 1, a + 1); return lerp(arr[a], arr[b], t - a); }
function band(g){ return g < 4 - 1e-9 ? "low: below 4.0" : g > 7 + 1e-9 ? "above the 4.0–7.0 band" : "in the 4.0–7.0 band"; }
function states(mode, g, ins, gcg, running){
  var liver = ins > 30 ? "store" : gcg > 12 ? "release" : "steady", take = ins > 30 || running;
  return { liver:liver, take:take, urine:g > 10 + 1e-9 };
}
function feedback(mode, g, ins, gcg, running){
  if (mode === "t1i" && g < 4 - 1e-9) return "Low (hypoglycemia): the dose removed more glucose than the meal added.";
  if (mode === "t1u") return "No insulin: cells can’t take up glucose, so it builds up in the blood" + (g > 10 + 1e-9 ? " and spills into the urine." : ".");
  if (mode === "t2") return g > 7 + 1e-9 ? "Insulin resistance: insulin is high, but cells respond poorly, so glucose stays high." : "Insulin resistance: the pancreas releases twice the usual insulin, yet glucose stays above 5.";
  if (running) return "Running: working muscles take up glucose on their own.";
  if (ins > 30) return mode === "t1i" ? "Injected insulin is acting: cells take up glucose, and the liver stores it as glycogen." : "Glucose is high: beta cells release insulin; cells take up glucose.";
  if (gcg > 12) return "Glucose is low: alpha cells release glucagon; the liver releases glucose.";
  return mode === "t1i" ? "Glucose is steady: no meal or dose is acting now." : "Glucose is at the set point: both hormones are at their resting levels.";
}

// Graph drawing (MV.Plot): glucose (--ink, thick) with the 4.0–7.0 band (--hi-soft) and a dashed 10 mmol/L kidney limit;
// insulin (--pen) and glucagon (--bio-atp, dashed) on a second plot. t = cursor in half-hour steps (may be fractional).
function gTop(list){ var mx = 0; list.forEach(function(d){ mx = Math.max(mx, Math.max.apply(null, d.g)); }); return mx > 11 ? Math.ceil((mx + 2.5) / 2) * 2 : 12; }
function hTop(list){ var mx = 0; list.forEach(function(d){ mx = Math.max(mx, Math.max.apply(null, d.ins), Math.max.apply(null, d.gcg)); }); return mx <= 86 ? 100 : Math.ceil(mx * 1.18 / 50) * 50; }
function eventLabels(st, data, top, css){
  var L = [], P = [];
  if (!st) return { labels:L, points:P };
  MEALS.forEach(function(m){ L.push({ x:m.m / 2, y:top * 0.93, text:m.lc + " +" + st.size[m.id], color:css("--ink"), align:"center", font:"600 11px " + css("--font-ui"), bg:true }); P.push({ x:m.m / 2, y:top * 0.86, r:3.2, color:css("--ink-2") }); });
  data.run.forEach(function(on, i){ if (on) L.push({ x:i / 2, y:top * 0.79, text:"run", color:css("--ink-2"), align:"center", font:"600 11px " + css("--font-ui"), bg:true }); });
  return { labels:L, points:P };
}
function drawG(plot, data, t, top, st, describe){
  var css = MV.css, ev = eventLabels(st, data, top, css), segs = [{ x1:0, y1:10, x2:24, y2:10, color:css("--ink-2"), width:1.5, dash:[8, 6] }], pts = ev.points.slice();
  if (t != null) { segs.push({ x1:t / 2, y1:0, x2:t / 2, y2:top * 0.74, color:css("--ink-2"), width:1.3, dash:[3, 4] }); pts.push({ x:t / 2, y:valAt(data.g, t), r:6, color:css("--ink"), ring:true }); }
  plot.draw({ view:{ xmin:-1.9, xmax:24.5, ymin:-top * 0.07, ymax:top },
    regions:[{ f:function(){ return 7; }, g:function(){ return 4; }, x0:0, x1:24, color:css("--hi-soft") }],
    segments:segs, curves:[{ pts:data.g.map(function(v, i){ return [i / 2, v]; }), color:css("--ink"), width:3.4 }], points:pts,
    labels:ev.labels.concat([{ x:24, y:10, text:"kidney limit", color:css("--ink-2"), align:"right", dy:-9, font:"11px " + css("--font-ui"), bg:true }]),
    xTicks:{ step:3, fmt:hClock }, yTicks:{ step:top > 14 ? 4 : 2 }, xLabel:"time", yLabel:"glucose (mmol/L)", describe:describe });
}
function drawH(plot, data, t, top, describe){
  var css = MV.css, segs = [], pts = [];
  if (t != null) { segs.push({ x1:t / 2, y1:0, x2:t / 2, y2:top, color:css("--ink-2"), width:1.3, dash:[3, 4] }); pts.push({ x:t / 2, y:valAt(data.ins, t), r:5, color:css("--pen"), ring:true }, { x:t / 2, y:valAt(data.gcg, t), r:5, color:css("--bio-atp"), ring:true }); }
  plot.draw({ view:{ xmin:-1.9, xmax:24.5, ymin:-top * 0.07, ymax:top }, segments:segs, points:pts,
    curves:[{ pts:data.ins.map(function(v, i){ return [i / 2, v]; }), color:css("--pen"), width:3 }, { pts:data.gcg.map(function(v, i){ return [i / 2, v]; }), color:css("--bio-atp"), width:3, dash:[7, 4] }],
    xTicks:{ step:3, fmt:hClock }, yTicks:{ step:top / 5 }, xLabel:"time", yLabel:"hormone (AU)", describe:describe });
}
function keyHTML(){
  return '<span><i class="ig-kg"></i>glucose</span><span><i class="ig-ki"></i>insulin</span><span><i class="ig-kc"></i>glucagon (dashed)</span><span><i class="ig-kb"></i>4.0–7.0 band</span><span><i class="ig-kk"></i>kidney limit (10)</span>';
}

// ---------- @component S8 feedbackView — pancreatic islet (alpha and beta cells), blood, liver, muscle and fat; hormone arrows
// thicken with the hormone level; glucose arrows (ink) show uptake, storage and release. viewBox 360 × 214. Static (no motion). ----------
var BETA = [[56, 92], [72, 100], [58, 110], [44, 102], [66, 84]], ALPHA = [[34, 74], [86, 72], [96, 112], [30, 126], [70, 134]];
function fvSVG(o){
  var h = "", dead = o.mode === "t1u" || o.mode === "t1i", s = states(o.mode, o.g, o.ins, o.gcg, o.running), res = o.mode === "t2";
  h += sv("circle", { cx:62, cy:102, r:44, "class":"ig-islet" }) + txt(62, 50, "pancreatic islet", "ig-t ig-ts", "middle");
  BETA.forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:7, "class":"ig-beta" + (dead ? " dead" : "") }); });
  ALPHA.forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:6, "class":"ig-alpha" }); });
  if (dead) h += sv("path", { d:"M44 84 L74 114 M74 84 L44 114", "class":"ig-x" });
  h += txt(4, 166, dead ? "beta cells destroyed" : "beta cells → insulin", "ig-t ig-tin") + txt(4, 181, "alpha cells → glucagon", "ig-t ig-tgl");
  // blood
  h += sv("rect", { x:146, y:14, width:48, height:168, rx:22, "class":"ig-vessel" });
  var n = clamp(Math.round(o.g), 0, 22);
  for (var j = 0; j < n; j++) h += sv("circle", { cx:j % 2 ? 179 : 161, cy:170 - Math.floor(j / 2) * 14, r:4.2, "class":"ig-glc" });
  h += txt(170, 197, "blood glucose", "ig-t ig-ts", "middle") + txt(170, 210, g1(o.g) + " mmol/L", "ig-t", "middle");
  // hormones into the blood
  var wI = clamp(0.8 + o.ins / 25, 0.8, 8), wG = clamp(0.8 + (o.gcg - 8) / 2, 0.8, 8);
  if (o.mode === "t1i") h += arrow(108, 196, 146, 156, "ig-ains", wI, o.ins > 12 ? 1 : 0.35) + txt(110, 210, "injected insulin", "ig-t ig-tin", "end");
  else h += arrow(104, 88, 146, 88, "ig-ains", wI, o.ins > 12 ? 1 : 0.35);
  h += arrow(104, 120, 146, 120, "ig-aglu", wG, o.gcg > 12 ? 1 : 0.35);
  // targets
  var T = [{ n:"liver", y:14 }, { n:o.running ? "muscle (running)" : "muscle", y:80 }, { n:"fat", y:146 }];
  T.forEach(function(b, k){
    var y = b.y, stat;
    h += sv("rect", { x:236, y:y, width:120, height:54, rx:9, "class":"ig-box" }) + txt(296, y + 17, b.n, "ig-t", "middle");
    if (k === 0) stat = s.liver === "store" ? "storing glycogen" : s.liver === "release" ? "releasing glucose" : "steady";
    else if (k === 1) stat = s.take ? (res && !o.running ? "slow uptake (resistant)" : "taking up glucose") : "little uptake";
    else stat = o.ins > 30 ? (res ? "slow uptake (resistant)" : "taking up glucose") : "little uptake";
    h += txt(296, y + 46, stat, "ig-t ig-ts", "middle");
    if (o.ins > 30) h += arrow(196, y + 22, 234, y + 22, "ig-ains", wI);
    else if (k === 0 && o.gcg > 12) h += arrow(196, y + 22, 234, y + 22, "ig-aglu", wG);
    var inn = k === 0 ? s.liver === "store" : k === 1 ? s.take : o.ins > 30, outw = k === 0 && s.liver === "release";
    if (inn) h += arrow(196, y + 38, 234, y + 38, "ig-aglc", 1.6) + sv("circle", { cx:210, cy:y + 38, r:3.4, "class":"ig-glc" });
    if (outw) h += arrow(234, y + 38, 196, y + 38, "ig-aglc", 1.6) + sv("circle", { cx:220, cy:y + 38, r:3.4, "class":"ig-glc" });
  });
  return h;
}
function fvAria(o){
  var s = states(o.mode, o.g, o.ins, o.gcg, o.running);
  return "Feedback view. Blood glucose " + g1(o.g) + " millimoles per litre. Insulin " + Math.round(o.ins) + " AU" + (o.mode === "t1i" ? " (injected)" : "") + ", glucagon " + Math.round(o.gcg) + " AU. Liver " +
    (s.liver === "store" ? "storing glucose as glycogen" : s.liver === "release" ? "releasing glucose" : "steady") + ". Muscle and fat cells " + (s.take ? "taking up glucose" : "taking up little glucose") + ".";
}

// ---------- Explore: Blood glucose day ----------
var DEF = { mode:"normal", i:4, size:{ b:3, l:3, d:3 }, dose:{ b:4, l:4, d:4 }, run:"none", t2run:false, t2med:false };
function explore(host, api){
  var C = api.content, S = api.S;
  Object.keys(DEF).forEach(function(k){ if (S[k] == null) S[k] = copy(DEF[k]); });
  var anim = null, pend = null, tf = null, morph = null, holdRead = false, what = "";
  host.innerHTML = '<div class="pg ig-pg">' +
    '<div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<canvas class="plot wide" id="ig-gplot" role="img" aria-label="Blood glucose over 24 hours"></canvas>' +
      '<canvas class="plot wide ig-hcv" id="ig-hplot" role="img" aria-label="Insulin and glucagon over 24 hours"></canvas>' +
      '<p class="ig-key tiny">' + keyHTML() + "</p>" +
      '<div class="ig-fv"><svg id="ig-fv" viewBox="0 0 360 214" role="img" focusable="false"></svg></div>' +
      '<p class="ig-cap" id="ig-cap" aria-live="polite"></p>' +
      '<details class="alg"><summary>Table of values (every hour)</summary><div id="ig-tab"></div></details></div>' +
    '<div class="pg-ctrl"><div id="ig-mode"></div>' +
      '<div class="ig-panel"><label class="slider ig-sl"><span class="slider-top"><span>Time</span><output id="ig-tout" for="ig-t"></output></span>' +
        '<input type="range" id="ig-t" min="0" max="48" step="1" value="' + S.i + '"></label>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="ig-play" data-k="igplay">Play</button><span class="tiny muted">06:00 to 06:00 the next day, in 30-minute steps</span></div></div>' +
      '<div class="ig-panel"><p class="ig-ph">Meal sizes</p><div class="ig-grid">' + MEALS.map(function(m){ return '<div id="ig-sz-' + m.id + '"></div>'; }).join("") + "</div></div>" +
      '<div class="ig-panel" id="ig-dosep"><p class="ig-ph">Insulin dose at each meal (model units)</p><div class="ig-grid">' + MEALS.map(function(m){ return '<div id="ig-ds-' + m.id + '"></div>'; }).join("") + "</div></div>" +
      '<div class="ig-panel"><div id="ig-run"></div></div>' +
      '<div class="ig-panel" id="ig-t2p"><p class="ig-ph">Type 2 options</p><div class="ig-sws" id="ig-sws"></div></div></div>' +
    '<div class="pg-read"><div id="ig-warn" aria-live="polite"></div><dl class="read" id="ig-read" aria-live="polite"></dl><p class="tiny muted ig-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var tIn = $("#ig-t"), svg = $("#ig-fv");
  var gp = new MV.Plot($("#ig-gplot"), { xmin:-1.9, xmax:24.5, ymin:-1, ymax:12 }), hp = new MV.Plot($("#ig-hplot"), { xmin:-1.9, xmax:24.5, ymin:-7, ymax:100 });
  gp.render = drawPlots; hp.render = drawPlots;
  function runOpts(){ var o = [{ id:"none", t:"None" }].concat(MEALS.map(function(m){ return { id:m.id, t:"After " + m.lc }; })); if (S.mode === "normal") o.push({ id:"r15", t:"15:00 run" }); if (S.mode === "t2" && S.t2run) o = o.map(function(x){ return { id:x.id, t:x.t, dis:true }; }); return o; }
  var R = {
    mode:radios($("#ig-mode"), { label:"Mode", options:MODES, value:S.mode, onChange:function(v){ change(function(){ S.mode = v; if (v !== "normal" && S.run === "r15") S.run = "none"; }, "Mode: " + byId(MODES, v).t); } }),
    run:radios($("#ig-run"), { label:"Run (30 minutes)", cls:"chips", options:runOpts(), value:S.run, onChange:function(v){ change(function(){ S.run = v; }, "Run: " + byId(runOpts(), v).t); } }),
    size:{}, dose:{}
  };
  MEALS.forEach(function(m){
    R.size[m.id] = radios($("#ig-sz-" + m.id), { label:m.name + " " + m.at, cls:"chips", options:SIZES, value:String(S.size[m.id]), onChange:function(v){ change(function(){ S.size[m.id] = +v; }, m.name + ": " + SIZEW[v] + " meal"); } });
    R.dose[m.id] = stepper($("#ig-ds-" + m.id), { id:"ig-dose-" + m.id, label:m.name, min:0, max:10, step:2, value:S.dose[m.id], unit:function(v){ return v + " units"; }, onChange:function(v){ change(function(){ S.dose[m.id] = v; }, m.name + " dose: " + v + " units"); } });
  });
  $("#ig-sws").addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b || b.disabled) return; var k = b.dataset.sw; change(function(){ S[k] = !S[k]; }, (k === "t2run" ? "Run after each meal" : "Medication") + ": " + (S[k] ? "off" : "on")); });
  tIn.addEventListener("input", function(){ stop(); S.i = +tIn.value; what = ""; api.save(); paint(); MV.changed(); });
  $("#ig-play").addEventListener("click", function(){
    if (anim) { stop(); paint(); return; }
    stop();
    var from = S.i >= 48 ? 0 : S.i; what = "";
    play(from, 48, (48 - from) * 110, null);
  });
  function cur(){ return sim(S); }
  function setText(){ return byId(MODES, S.mode).t + ", " + clock(S.i); }
  function sync(){
    R.mode.set(S.mode); R.run.setOptions(runOpts()); R.run.set(S.run);
    MEALS.forEach(function(m){ R.size[m.id].set(String(S.size[m.id])); R.dose[m.id].set(S.dose[m.id]); });
    $("#ig-dosep").hidden = S.mode !== "t1i"; $("#ig-t2p").hidden = S.mode !== "t2";
    MV.keepFocus($("#ig-sws"), function(){ $("#ig-sws").innerHTML = switchHTML("t2run", "Run after each meal", !!S.t2run) + switchHTML("t2med", "Medication that improves insulin response", !!S.t2med); });
    var ti = tf != null ? Math.round(tf) : S.i;
    tIn.value = ti; $("#ig-tout").textContent = clock(ti); tIn.setAttribute("aria-valuetext", clock(ti));
    $("#ig-play").textContent = anim && !pend ? "Pause" : "Play";
  }
  function tNow(){ return tf != null ? tf : S.i; }
  function dataNow(){ return morph ? blend(morph.A, morph.B, morph.k) : cur(); }
  function describeDay(d){
    var hrs = []; for (var i = 0; i < N; i += 2) hrs.push(clock(i) + " " + g1(d.g[i]));
    return byId(MODES, S.mode).t + ". Glucose by hour: " + hrs.join(", ") + ".";
  }
  function drawPlots(){
    var d = dataNow(), t = tNow(), list = morph ? [morph.A, morph.B] : [d];
    drawG(gp, d, t, gTop(list), S, "Blood glucose over 24 hours with the 4.0 to 7.0 band and the 10 kidney limit. Cursor at " + clock(Math.round(t)) + ": " + g1(valAt(d.g, t)) + " millimoles per litre. " + describeDay(d));
    drawH(hp, d, t, hTop(list), "Insulin and glucagon over 24 hours. Cursor at " + clock(Math.round(t)) + ": insulin " + Math.round(valAt(d.ins, t)) + " AU, glucagon " + Math.round(valAt(d.gcg, t)) + " AU.");
  }
  function paintRead(){
    var d = cur(), i = tf != null ? Math.round(tf) : S.i, g = d.g[i], u = d.ins[i], c = d.gcg[i], running = d.run[i], s = states(S.mode, g, u, c, running);
    var low = S.mode === "t1i" && g < 4 - 1e-9;
    $("#ig-read").innerHTML = MV.readoutHTML([
      ["Time", clock(i)],
      ["Blood glucose", g1(g) + " mmol/L (" + band(g) + ")" + (low ? ' <strong class="ig-low">Low (hypoglycemia)</strong>' : "")],
      ["Insulin / glucagon", Math.round(u) + " AU / " + Math.round(c) + " AU" + (S.mode === "t1i" ? " (insulin injected)" : "")],
      ["Liver", s.liver === "store" ? "Storing glucose as glycogen" : s.liver === "release" ? "Releasing glucose" : "Steady"],
      ["Muscle and fat cells", s.take ? (S.mode === "t2" && !running ? "Taking up glucose, slowly (insulin resistance)" : "Taking up glucose") : "Taking up little glucose"],
      ["Glucose in urine", s.urine ? "Yes" : "No"],
      ["Feedback now", feedback(S.mode, g, u, c, running)]]);
    var w = "";
    if (S.mode === "t1i" && d.min < 4 - 1e-9) w = '<p class="ig-warn" role="status"><strong>Low (hypoglycemia)</strong> at ' + clock(d.minI) + ": " + g1(d.min) + " mmol/L. A dose removed more glucose than its meal added.</p>";
    $("#ig-warn").innerHTML = w;
  }
  function paintFv(){
    var d = dataNow(), t = tNow(), i = Math.round(t), o = { mode:morph ? morph.mode : S.mode, g:valAt(d.g, t), ins:valAt(d.ins, t), gcg:valAt(d.gcg, t), running:!!d.run[i] };
    svg.innerHTML = fvSVG(o); svg.setAttribute("aria-label", fvAria(o));
  }
  function paintTab(){
    var d = cur(), rows = [];
    for (var i = 0; i < N; i += 2) rows.push([clock(i), g1(d.g[i]), Math.round(d.ins[i]), Math.round(d.gcg[i]), d.g[i] > 10 + 1e-9 ? "yes" : "no"]);
    $("#ig-tab").innerHTML = MV.tableHTML({ caption:"Blood glucose day, every hour", head:["Time", "Glucose (mmol/L)", "Insulin (AU)", "Glucagon (AU)", "Glucose in urine"], rows:rows, hiRow:Math.round(tNow()) % 2 ? null : Math.round(tNow()) / 2 });
  }
  function paint(){ sync(); drawPlots(); paintFv(); if (!holdRead) paintRead(); paintTab(); $("#ig-cap").textContent = what || (setText() + "."); }
  function stop(){
    if (anim) { anim(); anim = null; }
    if (tf != null) { S.i = Math.round(tf); tf = null; }
    morph = null; holdRead = false;
    if (pend) { var d = pend; pend = null; d(); }
  }
  // callers run stop() first; a tween that finishes synchronously (reduced motion) never leaves a stale stop function
  function play(from, to, dur, done){
    var fin = false, last = -1;
    tf = from; S.i = from; paint();
    var h = MV.tween({ dur:Math.max(dur, 400), ease:lin, step:function(k){ tf = lerp(from, to, k); S.i = Math.round(tf); if (S.i !== last) { last = S.i; paint(); } else { drawPlots(); paintFv(); } },
      done:function(){ fin = true; anim = null; tf = null; S.i = to; api.save(); paint(); MV.changed(); if (done) done(); } });
    if (!fin) { anim = h; sync(); }
  }
  function change(fn, label){
    stop();
    var a = cur(), i = S.i; fn(); var b = cur();
    what = label + ". At " + clock(i) + ": glucose " + g1(a.g[i]) + " → " + g1(b.g[i]) + " mmol/L, insulin " + Math.round(a.ins[i]) + " → " + Math.round(b.ins[i]) + " AU.";
    api.save(); paint(); MV.changed();
  }
  paint();

  function chal(id){
    var d = cur();
    if (id === "tc1") {
      if (S.mode !== "normal") return { ok:false, msg:"Switch to Normal mode first." };
      if (S.i === 4) return { ok:true };
      if (S.i === 2) return { ok:false, msg:"That’s the meal; glucose hasn’t risen yet." };
      if (S.i === 8) return { ok:false, msg:"By then glucose is back to 5." };
      return { ok:false, msg:"At " + clock(S.i) + " insulin is " + Math.round(d.ins[S.i]) + " AU. Find the time after breakfast when it is highest." };
    }
    if (S.mode !== "t1i") return { ok:false, msg:"Switch to Type 1 with insulin first." };
    var med = MEALS.every(function(m){ return +S.size[m.id] === 3; });
    if (id === "tc2") {
      if (!med) return { ok:false, msg:"Use medium meals (+3) for this challenge." };
      if (S.run !== "none") return { ok:false, msg:"Set the run to None for this challenge." };
      for (var k = 0; k < 3; k++) {
        var m = MEALS[k], ds = +S.dose[m.id];
        if (ds === 6) continue;
        if (ds === 4) return { ok:false, msg:m.name + " (4 units): that meal ends at 6.0." };
        if (ds === 8) return { ok:false, msg:m.name + " (8 units): that meal ends at 4.0: in band, but not the 5.0 target." };
        if (ds === 10) return { ok:false, msg:m.name + " (10 units): 3.0 mmol/L: hypoglycemia." };
        return { ok:false, msg:m.name + " (" + ds + " units): that meal ends at " + g1(8 - ds / 2) + ". Each 2 units lower the 3-h value by 1." };
      }
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.run !== "l") return { ok:false, msg:"Set the run to After lunch first." };
      if (+S.size.l !== 3) return { ok:false, msg:"Keep lunch medium (+3) for this challenge." };
      var dl = +S.dose.l;
      if (dl === 6) return { ok:false, msg:"The run lowers glucose too: 5 + 3 − 3 − 1 = 4.0. Too low for the target." };
      if (dl === 2) return { ok:false, msg:"5 + 3 − 1 − 1 = 6.0." };
      if (dl !== 4) return { ok:false, msg:"Lunch ends at " + g1(5 + 3 - dl / 2 - 1) + " on its own. The meal adds 3 and the run removes 1." };
      if (!near(d.ends.b, 5)) return { ok:false, msg:"The lunch dose is right, but breakfast ends at " + g1(d.ends.b) + ", so lunch starts there. Bring breakfast back to 5.0 first." };
      if (d.min < 4 - 1e-9) return { ok:false, msg:"Lunch works, but glucose drops to " + g1(d.min) + " at " + clock(d.minI) + ": below 4.0. Check the other doses." };
      return { ok:true };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop();
        S.size = copy(DEF.size); S.run = "none"; S.t2run = false; S.t2med = false;
        S.mode = p.start.mode; S.i = p.start.i;
        what = "Start: " + setText() + ".";
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        stop();
        pend = done;
        function release(){ var d2 = pend; pend = null; what = "Now " + setText() + "."; paint(); if (d2) MV.wait(250, d2); }
        if (p.to.i != null) {
          var from = S.i, to = p.to.i;
          what = "Playing from " + clock(from) + " to " + clock(to) + ".";
          play(from, to, Math.max(1600, (to - from) * 380), release);
          return;
        }
        var A = cur(), oldMode = S.mode; S.mode = p.to.mode; var B = cur(), fin = false;
        what = "Switched from " + byId(MODES, oldMode).t + " to " + byId(MODES, S.mode).t + " at " + clock(S.i) + ".";
        morph = { A:A, B:B, k:0, mode:S.mode }; holdRead = true; api.save(); paint(); MV.changed();
        var h = MV.tween({ dur:2200, ease:lin, step:function(k){ if (morph) { morph.k = MV.ease(k); drawPlots(); paintFv(); } },
          done:function(){ fin = true; anim = null; morph = null; holdRead = false; what = "Switched from " + byId(MODES, oldMode).t + " to " + byId(MODES, S.mode).t + " at " + clock(S.i) + "."; paint(); var d2 = pend; pend = null; if (d2) MV.wait(250, d2); } });
        if (!fin) anim = h;
      }
    },
    challenge:chal
  };
}

// ---------- hero: balance scale + the 24-hour storyboard (plate at 07:00, insulin phase, 02:00 dip and glucagon phase) ----------
var HX0 = 28, HX1 = 250;
function hx(i){ return HX0 + (HX1 - HX0) * i / 48; }
function hgy(g){ return 150 - (g - 3) * 18; }
function hiy(u){ return 178 - u * 1.1; }
function hcy(u){ return 178 - u * 3; }
var HG = (function(){ var g = []; for (var i = 0; i < N; i++) { var v = 5; if (i > 2 && i <= 8) v = knots(i, [[2, 5], [4, 8], [6, 6.5], [8, 5]]); if (i >= 39 && i <= 43) v = knots(i, [[39, 5], [40, 4.8], [42, 4.8], [43, 5]]); g.push(v); } return g; })();
function heroSVG(t, plateK, flow, full){
  var h = sv("line", { x1:HX0, y1:182, x2:HX1, y2:182, "class":"ig-hax" });
  [0, 12, 24, 36, 48].forEach(function(i){ h += sv("line", { x1:hx(i), y1:182, x2:hx(i), y2:186, "class":"ig-hax" }) + txt(hx(i), 198, clock(i), "ig-t ig-ts", "middle"); });
  h += sv("rect", { x:HX0, y:hgy(7), width:HX1 - HX0, height:hgy(4) - hgy(7), "class":"ig-hband" });
  function path(arr, yf, upto){ var d = ""; for (var i = 0; i <= Math.min(48, Math.ceil(upto)); i++) { var ii = Math.min(i, upto), v = valAt(arr, ii); d += (i ? " L" : "M") + f1(hx(ii)) + " " + f1(yf(v)); } return d; }
  var ins = HG.map(insN), gcg = HG.map(gcgN);
  h += sv("path", { d:path(ins, hiy, t), "class":"ig-hins" }) + sv("path", { d:path(gcg, hcy, t), "class":"ig-hglu" }) + sv("path", { d:path(HG, hgy, t), "class":"ig-hglc" });
  // plate at 07:00
  if (plateK > 0) { var py = lerp(20, 168, MV.ease ? MV.ease(plateK) : plateK); h += sv("ellipse", { cx:hx(2), cy:py, rx:9, ry:3.5, "class":"ig-plate" }) + sv("ellipse", { cx:hx(2), cy:py - 1, rx:5, ry:1.8, "class":"ig-plate2" }); }
  // liver and muscle
  h += sv("rect", { x:270, y:40, width:84, height:40, rx:9, "class":"ig-box" }) + txt(312, 64, "liver", "ig-t", "middle");
  h += sv("rect", { x:270, y:110, width:84, height:40, rx:9, "class":"ig-box" }) + txt(312, 134, "muscle", "ig-t", "middle");
  if (flow && flow.a > 0.02) {
    var p = [hx(t), hgy(valAt(HG, t))];
    var tg = flow.kind === "in" ? [[270, 60], [270, 130]] : [[270, 60]];
    tg.forEach(function(q, j){
      var a = flow.kind === "in" ? p : q, b = flow.kind === "in" ? q : p, cls = flow.kind === "in" ? "ig-ains" : "ig-aglu";
      h += arrow(a[0] + (b[0] - a[0]) * 0.08, a[1] + (b[1] - a[1]) * 0.08, b[0] - (b[0] - a[0]) * 0.04, b[1] - (b[1] - a[1]) * 0.04, cls, 2.2, flow.a);
      for (var k = 0; k < 3; k++) { var u = (flow.k * 1.6 + k / 3 + j * 0.15) % 1; h += sv("circle", { cx:lerp(a[0], b[0], u), cy:lerp(a[1], b[1], u), r:3.4, "class":"ig-glc", opacity:f2(flow.a) }); }
    });
  }
  if (full) {
    h += txt(hx(4) + 6, hgy(8) - 4, "glucose", "ig-t ig-tb") + txt(hx(4) + 6, hiy(70) + 14, "insulin", "ig-t ig-tin") + txt(hx(40), hcy(14) - 6, "glucagon", "ig-t ig-tgl", "middle");
    h += txt(hx(2), 176, "meal", "ig-t ig-ts", "middle") + txt(hx(44), hgy(4.8) + 16, "02:00 dip", "ig-t ig-ts", "middle");
    h += txt(HX1, hgy(7) + 12, "4–7 band", "ig-t ig-ts", "end");
  }
  return h;
}
function scaleHTML(){
  return '<div class="ig-scale"><div class="ig-pan ig-panl"><b>glucose high</b> → beta cells → <span class="ig-hins">insulin</span> → glucose into cells, stored as glycogen</div>' +
    '<svg class="ig-beam" viewBox="0 0 120 92" aria-hidden="true" focusable="false">' + sv("rect", { x:30, y:4, width:60, height:22, rx:5, "class":"ig-hband2" }) + txt(60, 19, "4–7 mmol/L", "ig-t ig-ts", "middle") +
      sv("line", { x1:60, y1:30, x2:60, y2:62, "class":"ig-ptr" }) + sv("path", { d:"M60 27 l-4 7 h8z", "class":"ig-ptrh" }) +
      sv("line", { x1:4, y1:62, x2:116, y2:62, "class":"ig-beamb" }) + sv("path", { d:"M60 62 L48 86 H72 Z", "class":"ig-fulc" }) +
      sv("line", { x1:6, y1:62, x2:6, y2:80, "class":"ig-str" }) + sv("line", { x1:114, y1:62, x2:114, y2:80, "class":"ig-str" }) + "</svg>" +
    '<div class="ig-pan ig-panr"><b>glucose low</b> → alpha cells → <span class="ig-hglu">glucagon</span> → liver releases glucose</div></div>';
}
function hero(f){
  var box = $("#ig-hero"); if (!box) return;
  var cap = f && f.cap;
  function setCap(t){ if (cap && cap.textContent !== t) cap.textContent = t; }
  box.innerHTML = scaleHTML() + '<svg class="ig-tl" viewBox="0 0 360 204" aria-hidden="true" focusable="false"></svg>';
  var svg = $(".ig-tl", box);
  if (MV.reduceMotion) { svg.innerHTML = heroSVG(48, 1, null, true); setCap("A meal at 07:00: glucose rises, insulin follows, and glucose returns to 5. At 02:00 glucose dips; glucagon rises, the liver releases glucose, and glucose levels at 5."); return; }
  var steps = [
    { dur:900, cap:"07:00: breakfast.", f:function(k){ return heroSVG(2, k, null); } },
    { dur:3200, cap:"Glucose rises. Beta cells release insulin, and glucose enters muscle and liver cells.", f:function(k){ var t = lerp(2, 8, k); return heroSVG(t, 1, { kind:"in", k:k * 3, a:clamp(Math.min(k * 4, (1 - k) * 3), 0, 1) }); } },
    { dur:2200, cap:"Glucose returns to 5: insulin falls back too.", f:function(k){ return heroSVG(lerp(8, 39, k), 1, null); } },
    { dur:3000, cap:"02:00: glucose dips slightly. Alpha cells release glucagon, and the liver sends glucose out.", f:function(k){ return heroSVG(lerp(39, 43, k), 1, { kind:"out", k:k * 3, a:clamp(Math.min(k * 4, (1 - k) * 3), 0, 1) }); } },
    { dur:1600, cap:"Glucose levels at 5: each hormone switched itself off. Negative feedback.", f:function(k){ return heroSVG(lerp(43, 48, k), 1, null, k > 0.98); } }
  ];
  var i = 0;
  (function next(){
    if (i >= steps.length) { svg.innerHTML = heroSVG(48, 1, null, true); return; }
    var s = steps[i++]; setCap(s.cap);
    MV.tween({ dur:s.dur, ease:lin, step:function(k){ svg.innerHTML = s.f(k); }, done:next });
  })();
}

// ---------- Part 3: A Canadian discovery ----------
// @component S7 dataStation (patient table + MV.Plot with a kidney-limit line and tap-a-day chips), N5 ordering (one sequence),
// N6-style card match, dish bar chart with chip questions.
function dishSVG(dishes){
  var h = "", base = 140, sc = 2.1;
  dishes.forEach(function(d, i){
    var x = 70 + i * 110, bh = d.v * sc;
    h += sv("rect", { x:x - 24, y:base - bh, width:48, height:bh, rx:3, "class":i ? "ig-bar" : "ig-bar0" }) + txt(x, base - bh - 6, d.v + " AU", "ig-t", "middle");
    h += txt(x, base + 16, ["No insulin", "Insulin", "Insulin + blocker"][i], "ig-t ig-ts", "middle");
  });
  return h + sv("line", { x1:20, y1:base, x2:340, y2:base, "class":"ig-hax" }) + txt(20, 14, "glucose taken up in 1 hour (AU)", "ig-t ig-ts");
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  if (!S.ord) S.ord = s1.start.slice();
  S.match = S.match || {}; S.tries = S.tries || 0;
  var sel = null, ordMsg = null, mSel = null, mMsg = null;
  host.innerHTML = '<div class="ig-p3">' +
    '<div class="ig-st"><h3>' + s1.title + '</h3><p class="how">' + s1.how + '</p><div id="ig-ord"></div><p class="ig-note2">' + s1.patent + "</p>" +
      '<details class="alg" open><summary>' + C.panel + ': the first patient</summary><p class="tiny muted"><span class="bio-model">Model data</span> ' + s1.dataNote + "</p>" +
      MV.tableHTML({ caption:"Blood glucose and urine test by day of treatment", head:["Day of treatment"].concat(s1.days.map(function(d){ return d.d === 0 ? "0 (before)" : String(d.d); })), rows:[["Blood glucose (mmol/L)"].concat(s1.days.map(function(d){ return d.g; })), ["Glucose in urine"].concat(s1.days.map(function(d){ return d.u; }))] }) +
      '<canvas class="plot wide ig-pcv" id="ig-pplot" role="img" aria-label="Blood glucose by day of treatment"></canvas>' +
      '<p class="ig-q">' + s1.tapPrompt + '</p><div id="ig-days"></div></details></div>' +
    '<div class="ig-st"><h3>' + s2.title + "</h3>" + s2.text + '<p class="how">' + s2.how + '</p><div id="ig-match"></div></div>' +
    '<div class="ig-st"><h3>' + s3.title + "</h3><p>" + s3.how + ' <span class="bio-model">Model data</span></p>' +
      '<div class="ig-dish"><svg id="ig-dsvg" viewBox="0 0 360 166" role="img" focusable="false"></svg></div>' +
      '<details class="alg"><summary>' + C.panel + ": the dish table</summary>" + MV.tableHTML({ caption:"Glucose uptake by dish", head:["Dish"].concat(s3.dishes.map(function(d){ return d.t; })), rows:[["Glucose uptake (AU)"].concat(s3.dishes.map(function(d){ return d.v; }))] }) + "</details>" +
      '<div id="ig-dq1"></div><div id="ig-dq2"></div></div></div>';
  // Station 1: order
  var ordH = $("#ig-ord", host);
  function ordRight(){ return S.ord.every(function(v, i){ return v === i; }); }
  function paintOrd(){
    MV.keepFocus(ordH, function(){
      var done = !!S.ordDone, h = '<ol class="olist">' + S.ord.map(function(ev, pos){
        var isSel = sel === pos && !done, cls = "ostep" + (done ? " good" : (ordMsg && ordMsg.pos === pos ? " bad" : ""));
        return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="igo' + ev + '" data-pos="' + pos + '"' + (done ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + s1.events[ev] + "</span></button>" +
          (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="igoup"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="igodown"' + (pos === S.ord.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
      }).join("") + "</ol>";
      if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-oact="check" data-k="igochk">Check the order</button></div>';
      if (done) h += MV.fbHTML("good", "<strong>✓ That order works.</strong> " + s1.orderWhy);
      else if (ordMsg) h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> Event " + (ordMsg.pos + 1) + " is out of place. Look at the years in brackets.");
      ordH.innerHTML = h;
    });
  }
  ordH.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel = sel === p ? null : p; paintOrd(); return; }
    if (b.dataset.mv) {
      var i = sel, j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= S.ord.length) return;
      var t = S.ord[i]; S.ord[i] = S.ord[j]; S.ord[j] = t; sel = j; ordMsg = null; api.save(); paintOrd();
      var nb = $('[data-mv="' + b.dataset.mv + '"]', ordH); if (nb && !nb.disabled) nb.focus(); else { var sb = $('[data-pos="' + j + '"]', ordH); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.oact === "check") {
      if (ordRight()) { S.ordDone = true; sel = null; ordMsg = null; }
      else { var pos = 0; while (pos < S.ord.length && S.ord[pos] === pos) pos++; ordMsg = { pos:pos }; }
      api.save(); paintOrd(); MV.focusFb(ordH);
    }
  });
  paintOrd();
  // Station 1: patient data
  var pplot = new MV.Plot($("#ig-pplot", host), { xmin:-0.6, xmax:3.6, ymin:-2, ymax:28 });
  pplot.render = function(){
    var css = MV.css;
    pplot.draw({ view:{ xmin:-0.6, xmax:3.6, ymin:-2, ymax:28 }, segments:[{ x1:-0.5, y1:10, x2:3.5, y2:10, color:css("--ink-2"), width:1.5, dash:[8, 6] }],
      curves:[{ pts:s1.days.map(function(d){ return [d.d, d.g]; }), color:css("--ink"), width:3 }], points:s1.days.map(function(d){ return { x:d.d, y:d.g, r:4.5, color:css("--ink"), label:String(d.g) }; }),
      labels:[{ x:3.5, y:10, text:"kidney limit", align:"right", dy:-9, color:css("--ink-2"), font:"11px " + css("--font-ui"), bg:true }],
      xTicks:{ step:1 }, yTicks:{ step:5 }, xLabel:"day", yLabel:"glucose (mmol/L)", describe:"Blood glucose by day of treatment: day 0, 25; day 1, 15; day 2, 9; day 3, 7. Dashed kidney limit at 10." });
  };
  pplot.render();
  var daysH = $("#ig-days", host);
  function paintDays(){
    MV.keepFocus(daysH, function(){
      var c = S.day, h = '<div class="chips" role="group" aria-label="Day of treatment">' + s1.days.map(function(d, i){ return '<button type="button" class="chip" aria-pressed="' + (c === i) + '" data-day="' + i + '" data-k="igday' + i + '">Day ' + d.d + "</button>"; }).join("") + "</div>";
      if (c != null) h += c === 2 ? MV.fbHTML("good", "<strong>✓ Right.</strong> " + s1.dayRight) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s1.dayFb[c]);
      daysH.innerHTML = h;
    });
  }
  daysH.addEventListener("click", function(e){ var b = e.target.closest("[data-day]"); if (!b) return; S.day = +b.dataset.day; api.save(); paintDays(); MV.focusFb(daysH); });
  paintDays();
  // Station 2: card match
  var mH = $("#ig-match", host);
  function paintMatch(){
    MV.keepFocus(mH, function(){
      var col = function(list, side){ return '<div class="ig-mcol" role="group" aria-label="' + (side === "l" ? "Features" : "Results") + '">' + list.map(function(x){
        var done = side === "l" ? !!S.match[x.id] : Object.keys(S.match).some(function(k){ return S.match[k] && s2.pairs[k] === x.id; });
        return '<button type="button" class="ig-card' + (done ? " done" : "") + '" aria-pressed="' + (side === "l" && mSel === x.id) + '" data-m' + side + '="' + x.id + '" data-k="igm' + x.id + '"' + (done ? " disabled" : "") + ">" + (done ? "✓ " : "") + x.t + "</button>"; }).join("") + "</div>"; };
      var h = '<div class="ig-mgrid">' + col(s2.left, "l") + col(s2.right, "r") + "</div>";
      if (mMsg) h += MV.fbHTML(mMsg.type, mMsg.html);
      if (s2.left.every(function(x){ return S.match[x.id]; })) h += '<p class="tiny muted">All three matched.</p>';
      mH.innerHTML = h;
    });
  }
  mH.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.ml) { mSel = mSel === b.dataset.ml ? null : b.dataset.ml; mMsg = null; paintMatch(); return; }
    if (b.dataset.mr) {
      if (!mSel) { mMsg = { type:"bad", html:"Tap a feature on the left first." }; paintMatch(); return; }
      if (s2.pairs[mSel] === b.dataset.mr) { S.match[mSel] = true; mMsg = { type:"good", html:"<strong>✓ Matched.</strong> " + s2.pairWhy[mSel] }; mSel = null; api.save(); }
      else mMsg = { type:"bad", html:"<strong>✗</strong> " + (mSel === "f3" ? s2.wrong + " " + s2.wrongF3 : s2.wrong) };
      paintMatch(); MV.focusFb(mH);
    }
  });
  paintMatch();
  // Station 3: dishes
  var dsvg = $("#ig-dsvg", host);
  dsvg.innerHTML = dishSVG(s3.dishes);
  dsvg.setAttribute("aria-label", "Bar chart of glucose uptake in 1 hour: no insulin 10, insulin 50, insulin plus a receptor blocker 12.");
  function chipQ(boxId, q, key){
    var box = $("#" + boxId, host);
    function paint(){
      MV.keepFocus(box, function(){
        var c = S[key], h = '<div class="q"><p class="ig-q">' + q.prompt + '</p><div class="chips ig-chips" role="group" aria-label="' + MV.esc(MV.plain(q.prompt)) + '">' + q.choices.map(function(x, i){ return '<button type="button" class="chip" aria-pressed="' + (c === i) + '" data-ch="' + i + '" data-k="' + key + i + '">' + x.t + "</button>"; }).join("") + "</div>";
        if (c != null) h += MV.ok(q.choices[c]) ? MV.fbHTML("good", "<strong>✓ Right.</strong> " + q.right) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + q.wrong);
        box.innerHTML = h + "</div>";
      });
    }
    box.addEventListener("click", function(e){ var b = e.target.closest("[data-ch]"); if (!b) return; S[key] = +b.dataset.ch; api.save(); paint(); MV.focusFb(box); });
    paint();
  }
  chipQ("ig-dq1", s3.q1, "dq1"); chipQ("ig-dq2", s3.q2, "dq2");
}

// ---------- Practice 2: Read the glucose chart (N4 number entry and chips; copied from SBI4U 07 dataAct) ----------
function chartAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = '<p class="ig-rule">' + a.rule + "</p>" + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z].*$/, "").replace(/\s/g, "").replace(/,/g, "."); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function nr(v, t){ return Math.abs(v - t) <= 1e-6 * Math.max(1, Math.abs(t)); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
      h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="ig-unit">' + it.unit + "</span>" : "") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok;
      if (it.kind === "mc") { if (x.choice == null) return; x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else {
        var v = parseVal(x.val);
        if (v == null) { msgs[it.id] = "Enter a number, such as 4 or 10."; paintItem(it); return; }
        ok = nr(v, MV.ans(it));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return nr(v, w.match); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
        else msgs[it.id] = null;
      }
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Plan a model day (meal-size chips, dose steppers, run chips; live 24-hour preview) ----------
var task = (function(){
  var api = null, T = null, plot = null, TD = { size:{ b:3, l:3, d:3 }, dose:{ b:6, l:6, d:6 }, run:"none" };
  function read(){ var s = api ? api.S : {}; return { size:copy(s.size || TD.size), dose:copy(s.dose || TD.dose), run:s.run || TD.run }; }
  function own(d, m){ return 5 + +d.size[m.id] - +d.dose[m.id] / 2 - (d.run === m.id ? 1 : 0); }
  function total(d){ return +d.dose.b + +d.dose.l + +d.dose.d; }
  function runW(r){ return r === "none" ? "no run" : "run after " + byId(MEALS, r).lc; }
  function desc(d){ return MEALS.map(function(m){ return SIZEW[d.size[m.id]]; }).join(", ").replace(/^./, function(c){ return c.toUpperCase(); }) + "; " + runW(d.run) + "; doses " + MEALS.map(function(m){ return d.dose[m.id]; }).join(", ") + " (total " + total(d) + ")"; }
  function draw(){
    if (!plot || !api) return;
    var d = read(), data = sim({ mode:"t1i", size:d.size, dose:d.dose, run:d.run }), top = gTop([data]);
    drawG(plot, data, null, top, d, "Preview of the model day: " + desc(d) + ". 3-hour values: " + MEALS.map(function(m){ return m.lc + " " + g1(data.ends[m.id]); }).join(", ") + ".");
    var box = $("#ig-tsum"); if (!box) return;
    box.innerHTML = '<p class="ig-tot">Total insulin: <strong>' + total(d) + " units</strong> <span class=\"muted\">(at most 14)</span></p>" +
      MV.tableHTML({ caption:"Each meal three hours later", head:["Meal", "Size", "Dose", "Run after?", "3-h value"], rows:MEALS.map(function(m){ var v = own(d, m); return [m.name, SIZEW[d.size[m.id]] + " (+" + d.size[m.id] + ")", d.dose[m.id] + " units", d.run === m.id ? "yes (−1)" : "no", g1(v) + " mmol/L" + (near(v, 5) ? " ✓" : "")]; }) });
  }
  function key(d){ return [d.size.b, d.size.l, d.size.d, d.dose.b, d.dose.l, d.dose.d, d.run].join("|"); }
  function unkey(k){ var p = k.split("|"); return { size:{ b:+p[0], l:+p[1], d:+p[2] }, dose:{ b:+p[3], l:+p[4], d:+p[5] }, run:p[6] }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      Object.keys(TD).forEach(function(k){ if (a.S[k] == null) a.S[k] = copy(TD[k]); });
      inp.innerHTML = '<div class="ig-tin"><div class="ig-panel"><p class="ig-ph">Meal sizes</p><div class="ig-grid">' + MEALS.map(function(m){ return '<div id="ig-tsz-' + m.id + '"></div>'; }).join("") + "</div></div>" +
        '<div class="ig-panel"><p class="ig-ph">Insulin doses (model units)</p><div class="ig-grid">' + MEALS.map(function(m){ return '<div id="ig-tds-' + m.id + '"></div>'; }).join("") + "</div></div>" +
        '<div class="ig-panel"><div id="ig-trun"></div></div></div>';
      MEALS.forEach(function(m){
        radios($("#ig-tsz-" + m.id, inp), { label:m.name, cls:"chips", options:SIZES, value:String(a.S.size[m.id]), onChange:function(v){ a.S.size[m.id] = +v; a.save(); draw(); a.update(); } });
        stepper($("#ig-tds-" + m.id, inp), { id:"ig-tdose-" + m.id, label:m.name, min:0, max:10, step:2, value:a.S.dose[m.id], unit:function(v){ return v + " units"; }, onChange:function(v){ a.S.dose[m.id] = v; a.save(); draw(); a.update(); } });
      });
      radios($("#ig-trun", inp), { label:"Run (30 minutes)", cls:"chips", options:[{ id:"none", t:"None" }].concat(MEALS.map(function(m){ return { id:m.id, t:"After " + m.lc }; })), value:a.S.run, onChange:function(v){ a.S.run = v; a.save(); draw(); a.update(); } });
      pv.innerHTML = '<canvas class="plot wide" id="ig-tplot" role="img" aria-label="Preview of the model day"></canvas><p class="ig-key tiny"><span><i class="ig-kg"></i>glucose</span><span><i class="ig-kb"></i>4.0–7.0 band</span><span><i class="ig-kk"></i>kidney limit (10)</span></p>' +
        '<div id="ig-tsum" aria-live="polite"></div><p class="tiny muted"><span class="bio-model">Model</span> ' + T.model + " Model numbers for learning, not a real treatment plan.</p>";
      plot = new MV.Plot($("#ig-tplot", pv), { xmin:-1.9, xmax:24.5, ymin:-1, ymax:12 }); plot.render = draw;
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [MEALS.every(function(m){ return near(own(d, m), 5); }), d.run !== "none", total(d) <= 14, +d.size.l === 4]; },
    key:key,
    label:function(k){ return desc(unkey(k)); },
    text:function(k){ return desc(unkey(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ chart:chartAct },
  task:task
});
})();
