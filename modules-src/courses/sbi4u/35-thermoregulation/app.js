// SBI4U 35 Thermoregulation: hero (outdoor thermometer −30 → 40 °C, core locked at 37 °C), Body temperature control room
// (S8 feedback loop: body figure, hypothalamus arrows to the active effectors, core gauge, heat-load bar; Steady day and Fever
// modes), Animals in the cold (endotherm/ectotherm graph, countercurrent leg, brown-fat zoom, hibernation year), heat
// scenarios practice, "Winter hike" (task).
(function(){
"use strict";
var $ = MV.$;

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function f2(v){ return String(Math.round(v * 100) / 100); }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "thr-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function deg(v){ return MV.num(v) + " °C"; }
function signed(v){ return v > 0 ? "+" + v : MV.num(v); }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
// straight arrow with a filled head (from SBI4U 07)
function arrow(x1, y1, x2, y2, cls, w, op){
  var L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, s = 4 + w * 1.2, bx = x2 - ux * s, by = y2 - uy * s;
  var hd = "M" + f1(x2) + " " + f1(y2) + " L" + f1(bx - uy * s * 0.75) + " " + f1(by + ux * s * 0.75) + " L" + f1(bx + uy * s * 0.75) + " " + f1(by - ux * s * 0.75) + " Z";
  return '<g class="' + cls + '"' + (op != null && op < 0.99 ? ' opacity="' + f2(op) + '"' : "") + ">" + sv("line", { x1:x1, y1:y1, x2:bx, y2:by, "stroke-width":w }) + sv("path", { d:hd }) + "</g>";
}
// wavy heat arrow (--ink-2) from (x1, y1) to (x2, y2)
function wavy(x1, y1, x2, y2, op, amp){
  var L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux, a = amp || 2.4, s = 5, run = L - s, n = Math.max(2, Math.round(run / 6)), d = "M" + f1(x1) + " " + f1(y1);
  for (var i = 0; i < n; i++) {
    var t0 = run * i / n, t1 = run * (i + 0.5) / n, t2 = run * (i + 1) / n, sg = i % 2 ? -1 : 1;
    d += " Q" + f1(x1 + ux * t1 + nx * a * sg * 2) + " " + f1(y1 + uy * t1 + ny * a * sg * 2) + " " + f1(x1 + ux * t2) + " " + f1(y1 + uy * t2);
    void t0;
  }
  var bx = x1 + ux * run, by = y1 + uy * run;
  var hd = "M" + f1(x2) + " " + f1(y2) + " L" + f1(bx + nx * 3.4) + " " + f1(by + ny * 3.4) + " L" + f1(bx - nx * 3.4) + " " + f1(by - ny * 3.4) + " Z";
  return '<g class="thr-heat"' + (op != null && op < 0.99 ? ' opacity="' + f2(op) + '"' : "") + ">" + sv("path", { d:d }) + sv("path", { d:hd, "class":"thr-heath" }) + "</g>";
}
function drop(x, y, s, op){ return sv("path", { d:"M" + f1(x) + " " + f1(y - s * 1.3) + " Q" + f1(x + s * 1.05) + " " + f1(y) + " " + f1(x) + " " + f1(y + s * 0.8) + " Q" + f1(x - s * 1.05) + " " + f1(y) + " " + f1(x) + " " + f1(y - s * 1.3) + "Z", "class":"thr-drop", opacity:op != null && op < 0.99 ? f2(op) : null }); }
function tube(x1, x2, y, w, cls){ return sv("path", { d:"M" + f1(x1) + " " + f1(y - w / 2) + " H" + f1(x2) + " M" + f1(x1) + " " + f1(y + w / 2) + " H" + f1(x2), "class":cls || "thr-ves" }) + sv("rect", { x:x1, y:f1(y - w / 2), width:x2 - x1, height:f1(w), "class":"thr-blood" }); }
function shiverMarks(x, y, n, op){
  var h = "";
  for (var i = 0; i < n; i++) { var dx = i * 7; h += sv("path", { d:"M" + f1(x - dx) + " " + f1(y - 8) + " l-3 4 l3 4 l-3 4 l3 4", "class":"thr-shv" }); }
  return '<g class="thr-shiv"' + (op != null && op < 0.99 ? ' opacity="' + f2(op) + '"' : "") + ">" + h + "</g>";
}

// ---------- @component radioGroup (copied from SBI4U 07 / 06 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
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
// ---------- @component stepper (list form; adapted from SBI4U 10) — − / + around a value from a fixed list; arrow keys step ----------
function stepper(host, o){
  var i = Math.max(0, o.values.indexOf(o.value)), dis = false;
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="thr-step" role="group" aria-labelledby="' + o.id + '-l">' +
        '<button type="button" class="thr-stb" data-st="-1" data-k="' + o.id + 'm" aria-label="' + o.down + '"' + (dis || i <= 0 ? " disabled" : "") + ">−</button>" +
        '<output class="thr-sto" aria-live="polite">' + o.fmt(o.values[i]) + "</output>" +
        '<button type="button" class="thr-stb" data-st="1" data-k="' + o.id + 'p" aria-label="' + o.up + '"' + (dis || i >= o.values.length - 1 ? " disabled" : "") + ">+</button></span></span>";
    });
  }
  function go(d){ var j = clamp(i + d, 0, o.values.length - 1); if (j !== i && !dis) { i = j; paint(); o.onChange(o.values[i]); } }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-st]"); if (b && !b.disabled) go(+b.dataset.st); });
  host.addEventListener("keydown", function(e){
    if (!e.target.closest("[data-st]")) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0;
    if (d) { e.preventDefault(); go(d); }
  });
  paint();
  return { set:function(v){ var j = o.values.indexOf(v); if (j >= 0 && j !== i) { i = j; paint(); } }, disable:function(b){ if (b !== dis) { dis = b; paint(); } } };
}

// ---------- the model (plan "The model": integer heat-load units, 1 unit = 1 °C) ----------
var SURRS = [-30, -10, 0, 10, 20, 30, 40], SURRL = { "-30":-6, "-10":-4, "0":-3, "10":-2, "20":-1, "30":0, "40":2 };
var CLOS = [["tee", "T-shirt"], ["sweater", "Sweater"], ["parka", "Winter parka"]], CLOL = { tee:0, sweater:1, parka:3 };
var HATS = [["off", "Off"], ["on", "On"]], ACTS = [["rest", "Resting"], ["walk", "Walking"], ["run", "Running"]], ACTL = { rest:0, walk:1, run:3 };
var WATERS = [["hyd", "Hydrated"], ["dehyd", "Dehydrated"]], WEEKS = [["off", "Off"], ["on", "On"]];
function nameOf(list, id){ for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i][1]; return id; }
function loadOf(s){ return SURRL[String(s.surr)] + CLOL[s.clo] + (s.hat === "on" ? 1 : 0) + ACTL[s.act]; }
function model(s){
  var L = loadOf(s), r = { L:L, vc:0, sh:0, thy:0, vd:0, sw:0, cap:0, used:0, side:0, core:37, set:37 };
  if (L > 0) { var swCap = s.water === "dehyd" ? 1 : 3; r.side = 1; r.vd = 1; r.sw = L >= 2 ? Math.min(L - 1, swCap) : 0; r.cap = 1 + swCap; r.used = r.vd + r.sw; r.core = 37 + (L - r.used); }
  else if (L < 0) { r.side = -1; r.vc = 1; r.sh = L <= -2 ? Math.min(-L - 1, 2) : 0; r.thy = s.weeks === "on" && L <= -4 ? 1 : 0; r.cap = 3 + (s.weeks === "on" ? 1 : 0); r.used = r.vc + r.sh + r.thy; r.core = 37 - (-L - r.used); }
  r.sweat = r.sw * 0.5;
  return r;
}
function status(c){ return c <= 35 ? "Hypothermia" : c === 36 ? "Below normal" : c === 37 ? "Normal" : c === 38 ? "Above normal" : c === 39 ? "Hyperthermia" : "Heat stroke danger"; }
function respList(m){
  var a = [];
  if (m.vc) a.push("vasoconstriction"); if (m.sh) a.push("shivering"); if (m.thy) a.push("extra thyroid hormone");
  if (m.vd) a.push("vasodilation"); if (m.sw) a.push("sweating");
  return a;
}
// Fever mode (plan): 20 °C room, T-shirt, resting. Set point 39 °C from hour 0; while core < set the warming responses run and
// the core rises 1 °C per hour; at hour 4 the set point returns to 37 °C and the cooling responses run.
var FEV = [
  { lab:"Before the fever", set:37, core:37, r:0, cap:"Before the infection: set point 37 °C, core 37 °C. Nothing to correct." },
  { lab:"Hour 0", set:39, core:37, r:-1, cap:"Hour 0: chemicals from the infection reach the hypothalamus and the set point jumps to 39 °C. A core of 37 °C now counts as too cold: vasoconstriction and shivering switch on (chills)." },
  { lab:"Hour 1", set:39, core:38, r:-1, cap:"Hour 1: the core is 38 °C, still below the target of 39 °C, so the chills go on." },
  { lab:"Hour 2", set:39, core:39, r:0, cap:"Hour 2: the core reaches 39 °C and matches the set point. The warming responses stop." },
  { lab:"Hour 3", set:39, core:39, r:0, cap:"Hour 3: the fever holds steady at the new set point. The loop is working normally." },
  { lab:"Hour 4", set:37, core:39, r:1, cap:"Hour 4: the set point returns to 37 °C. A core of 39 °C now counts as too hot: vasodilation and sweating switch on (the fever breaks)." },
  { lab:"Hour 5", set:37, core:38, r:1, cap:"Hour 5: the core is 38 °C, still above the target, so the sweating goes on." },
  { lab:"Hour 6", set:37, core:37, r:0, cap:"Hour 6: the core is back to 37 °C. The cooling responses stop." }];
function feverModel(i){
  var F = FEV[i], r = { L:0, vc:0, sh:0, thy:0, vd:0, sw:0, cap:0, used:0, side:F.r, core:F.core, set:F.set, fever:true };
  if (F.r < 0) { r.vc = 1; r.sh = 1; } else if (F.r > 0) { r.vd = 1; r.sw = 1; }
  r.sweat = r.sw * 0.5;
  return r;
}
function feverStatus(m){ return m.core < m.set ? "Fever rising: below the set point" : m.core > m.set ? "Fever breaking: above the set point" : m.set > 37 ? "Fever: at the raised set point" : "Normal"; }

// ---------- @component S8 feedbackLoop (body form) — line-art person (clothing, hat, pace) with the hypothalamus in the head and
// arrows to whichever effector panels are active: skin arterioles (narrow / normal / wide tube), sweat glands (droplets and
// wavy evaporation arrows), skeletal muscles (shiver marks), thyroid (weeks in the cold). bodySVG(v) with
// v = {clo, hat, act, vc, vd, sh, sw, thy, set} (numbers may be fractional during a tween). viewBox 360 × 250. ----------
var ARMS = { rest:[[[52, 84], [42, 116], [38, 146]], [[88, 84], [98, 116], [102, 146]]], walk:[[[52, 84], [38, 112], [32, 140]], [[88, 84], [102, 112], [110, 138]]],
  run:[[[52, 84], [36, 104], [48, 126]], [[88, 84], [106, 100], [114, 80]]] };
var LEGS = { rest:[[[61, 150], [59, 186], [58, 224]], [[79, 150], [81, 186], [82, 224]]], walk:[[[61, 150], [52, 188], [44, 224]], [[79, 150], [86, 188], [96, 222]]],
  run:[[[61, 150], [44, 180], [24, 196]], [[79, 150], [96, 184], [92, 226]]] };
function pth(p){ return "M" + p.map(function(q){ return f1(q[0]) + " " + f1(q[1]); }).join(" L"); }
function limb(p, cls){ return sv("path", { d:pth(p), "class":"thr-limbo" }) + sv("path", { d:pth(p), "class":"thr-limbi" + (cls ? " " + cls : "") }); }
function personSVG(v, o){
  o = o || {};
  var h = "", act = v.act || "rest", clo = v.clo || "tee", parka = clo === "parka";
  if (act !== "rest") [[110, 8, 24], [126, 4, 22], [142, 10, 26]].slice(0, act === "run" ? 3 : 2).forEach(function(m){ h += sv("line", { x1:m[1], y1:m[0], x2:m[2], y2:m[0], "class":"thr-motion" }); });
  LEGS[act].forEach(function(p){ h += limb(p); });
  h += sv("path", { d:parka ? "M48 78 Q70 70 92 78 L94 168 L46 168 Z" : "M50 78 Q70 72 90 78 L88 152 L52 152 Z", "class":"thr-torso" + (parka ? " thr-pk" : "") });
  if (parka) h += sv("line", { x1:70, y1:78, x2:70, y2:166, "class":"thr-zip" });
  ARMS[act].forEach(function(p){
    h += limb(p);
    var sl = clo === "tee" ? [p[0], [lerp(p[0][0], p[1][0], 0.6), lerp(p[0][1], p[1][1], 0.6)]] : clo === "sweater" ? [p[0], p[1], [lerp(p[1][0], p[2][0], 0.8), lerp(p[1][1], p[2][1], 0.8)]] : [p[0], p[1], [lerp(p[1][0], p[2][0], 0.86), lerp(p[1][1], p[2][1], 0.86)]];
    h += sv("path", { d:pth(sl), "class":"thr-slvo" + (parka ? " thr-pk" : "") }) + sv("path", { d:pth(sl), "class":"thr-slvi" + (parka ? " thr-pk" : "") });
  });
  h += sv("line", { x1:70, y1:66, x2:70, y2:76, "class":"thr-neck" }) + sv("circle", { cx:70, cy:52, r:16, "class":"thr-head" });
  if (v.hat === "on") h += sv("path", { d:"M53 50 Q53 30 70 30 Q87 30 87 50 Z", "class":"thr-hat" }) + sv("rect", { x:52, y:46, width:36, height:6, rx:3, "class":"thr-hat" }) + sv("circle", { cx:70, cy:28, r:4, "class":"thr-hat" });
  if (!o.noHypo) h += sv("ellipse", { cx:72, cy:54, rx:5, ry:3.6, "class":"thr-hyp" });
  return h;
}
var PANELS = [{ y:6, t:"Skin arterioles" }, { y:66, t:"Sweat glands" }, { y:126, t:"Skeletal muscles" }, { y:186, t:"Thyroid gland (weeks)" }];
function bodySVG(v){
  var h = personSVG(v), x0 = 182, x1 = 354, i;
  h += txt(6, 14, "Hypothalamus", "thr-t thr-tb") + txt(6, 27, "set point " + deg(Math.round(v.set)), "thr-t thr-ts") + sv("path", { d:"M44 31 Q60 36 68 50", "class":"thr-lead" });
  var act = [v.vc + v.vd, v.sw, v.sh, v.thy];
  for (i = 0; i < 4; i++) {
    var P = PANELS[i], on = act[i] > 0.05, y = P.y;
    h += '<g class="thr-pan' + (on ? " on" : "") + '">' + sv("rect", { x:x0, y:y, width:x1 - x0, height:54, rx:6, "class":"thr-pbox" }) + txt(x0 + 8, y + 15, P.t, "thr-t thr-tb");
    var word;
    if (i === 0) {
      var w = 7 + 5 * v.vd - 4 * v.vc;
      h += sv("line", { x1:x0 + 6, y1:y + 24, x2:x1 - 6, y2:y + 24, "class":"thr-skin" }) + tube(x0 + 18, x1 - 18, y + 38, w);
      if (v.vd > 0.05) [x0 + 52, x0 + 116].forEach(function(x){ h += wavy(x, y + 22, x, y + 4 + 18 * (1 - v.vd) + 6, v.vd); });
      word = v.vc > 0.5 ? "narrowed" : v.vd > 0.5 ? "widened" : "normal";
    } else if (i === 1) {
      h += sv("line", { x1:x0 + 6, y1:y + 44, x2:x1 - 6, y2:y + 44, "class":"thr-skin" });
      [x0 + 40, x0 + 86, x0 + 132].forEach(function(x){ h += sv("path", { d:"M" + x + " " + (y + 44) + " v5 q-4 3 0 5 q4 2 0 4", "class":"thr-gland" }); });
      for (var k = 0; k < 3; k++) { var a = clamp(v.sw - k, 0, 1); if (a > 0.05) { var dx = x0 + 40 + k * 46; h += drop(dx, y + 37, 4.4, a) + wavy(dx + 7, y + 31, dx + 14, y + 19, a, 1.8); } }
      word = v.sw > 0.05 ? (Math.round(v.sw) || 1) + (Math.round(v.sw) > 1 ? " units" : " unit") : "off";
    } else if (i === 2) {
      h += sv("ellipse", { cx:268, cy:y + 37, rx:50, ry:9, "class":"thr-musc" });
      [246, 258, 270, 282, 294].forEach(function(x){ h += sv("line", { x1:x, y1:y + 30, x2:x, y2:y + 44, "class":"thr-str" }); });
      var n = Math.round(v.sh * 1.5 + 0.49);
      if (v.sh > 0.05) h += shiverMarks(212, y + 37, n, clamp(v.sh, 0, 1)) + '<g transform="translate(536 0) scale(-1 1)">' + shiverMarks(212, y + 37, n, clamp(v.sh, 0, 1)) + "</g>";
      word = v.sh > 0.05 ? "shivering" : "off";
    } else {
      h += sv("path", { d:"M252 " + (y + 29) + " q-14 2 -12 12 q2 9 12 7 q6 -3 8 -8 q2 5 8 8 q10 2 12 -7 q2 -10 -12 -12 q-6 1 -8 6 q-2 -5 -8 -6 Z", "class":"thr-thy" });
      if (v.thy > 0.05) h += txt(296, y + 42, "+ heat", "thr-t thr-ts");
      word = v.thy > 0.05 ? "more hormone" : "off";
    }
    h += txt(x1 - 8, y + 15, word, "thr-t thr-ts", "end") + "</g>";
  }
  // hypothalamus → active effectors
  for (i = 0; i < 4; i++) if (act[i] > 0.05) { var ty = PANELS[i].y + 27; h += arrow(78, 54, x0 - 2, ty, "thr-arr", 1.6, clamp(act[i], 0, 1)); }
  return h;
}
// ---------- core gauge (--pen mercury, --hi-soft status band, set-point marker); viewBox 170 × 236 ----------
var GLO = 33, GHI = 45;
function gy(t){ return 188 - (clamp(t, GLO, GHI) - GLO) * 176 / (GHI - GLO); }
var BANDS = [[GLO, 35.5], [35.5, 36.5], [36.5, 37.5], [37.5, 38.5], [38.5, 39.5], [39.5, GHI]];
function bandOf(c){ var r = Math.round(c); return r <= 35 ? 0 : r >= 40 ? 5 : r - 34; }
function gaugeSVG(core, set, masked){
  var h = sv("rect", { x:0, y:0, width:170, height:236, rx:8, "class":"thr-gbg" }), t;
  if (!masked) { var b = BANDS[bandOf(core)]; h += sv("rect", { x:34, y:f1(gy(b[1])), width:70, height:f1(gy(b[0]) - gy(b[1])), "class":"thr-band" }); }
  h += sv("rect", { x:46, y:10, width:16, height:182, rx:8, "class":"thr-tubeo" }) + sv("circle", { cx:54, cy:204, r:14, "class":"thr-tubeo" });
  for (t = GLO; t <= GHI; t++) h += sv("line", { x1:62, y1:f1(gy(t)), x2:t % 2 ? 66 : 70, y2:f1(gy(t)), "class":"thr-tick" }) + (t % 2 ? "" : txt(73, gy(t) + 4, MV.num(t), "thr-t thr-ts"));
  if (!masked) h += sv("rect", { x:50, y:f1(gy(core)), width:8, height:f1(200 - gy(core)), rx:4, "class":"thr-merc" }) + sv("circle", { cx:54, cy:204, r:10, "class":"thr-merc" });
  var sy = gy(set);
  h += sv("path", { d:"M44 " + f1(sy) + " l-8 -5 v10 Z", "class":"thr-setm" }) + sv("line", { x1:62, y1:f1(sy), x2:100, y2:f1(sy), "class":"thr-setl" }) + txt(104, sy + 4, "set point", "thr-t thr-ts");
  h += txt(124, 226, masked ? "core ?" : "core " + deg(Math.round(core)), "thr-t thr-tb", "middle");
  return h;
}
// ---------- heat-load bar against the capacity on that side (−9 … +9 units) ----------
function loadBarHTML(m, masked){
  function pc(v){ return f1((v + 9) / 18 * 100); }
  var L = m.L, lo = Math.min(0, L), hi = Math.max(0, L), cap = m.side ? m.cap * m.side : 0;
  var cl = Math.min(0, cap), ch = Math.max(0, cap);
  var aria = "Heat load " + MV.plain(signed(L)) + (m.side ? "; the body can handle " + m.cap + (m.side < 0 ? " warming" : " cooling") + " units on this side" : "; no responses needed");
  return '<div class="thr-lb" role="img" aria-label="' + MV.esc(aria) + '"><p class="thr-lbt">Heat load against the body’s capacity</p><div class="thr-lbtr">' +
    (cap && !masked ? '<i class="thr-lbcap" style="left:' + pc(cl) + "%;width:" + f1(pc(ch) - pc(cl)) + '%"></i>' : "") +
    '<i class="thr-lbfill" style="left:' + pc(lo) + "%;width:" + f1(pc(hi) - pc(lo)) + '%"></i><b class="thr-lb0"></b></div>' +
    '<div class="thr-lbax" aria-hidden="true"><span>' + MV.num(-9) + "</span><span>losing heat · 0 · gaining heat</span><span>+9</span></div>" +
    '<p class="tiny muted thr-lbk"><span class="thr-k1"></span>load <span class="thr-k2"></span>capacity on that side</p></div>';
}

// ---------- Explore: Body temperature control room ----------
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"steady", surr:-10, clo:"sweater", hat:"off", act:"rest", water:"hyd", weeks:"off", fh:0 };
  Object.keys(D).forEach(function(k){ if (S[k] == null) S[k] = D[k]; });
  S.fc = S.fc || { chills:{}, brk:{} };
  var anim = null, pend = null, what = "", masked = false, holdRead = false, silent = false;
  var wide = !window.matchMedia || window.matchMedia("(min-width: 821px)").matches;
  var RESP = [["vc", "Vasoconstriction"], ["sh", "Shivering"], ["vd", "Vasodilation"], ["sw", "Sweating"]];
  function fcBox(ph, title){
    return '<fieldset class="thr-fc"><legend>' + title + "</legend>" + RESP.map(function(r){
      return '<label class="thr-cb"><input type="checkbox" data-fc="' + ph + ":" + r[0] + '"' + (S.fc[ph][r[0]] ? " checked" : "") + "> " + r[1] + "</label>"; }).join("") + "</fieldset>";
  }
  host.innerHTML = '<div class="pg thr-pg">' +
    '<div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="thr-stage"><svg id="thr-svg" viewBox="0 0 360 250" role="img" focusable="false"></svg></div>' +
      '<p class="thr-cap" id="thr-cap" aria-live="polite"></p><div class="thr-fpl" id="thr-fplw"><p class="thr-mt">Fever timeline</p><div id="thr-fpl"></div></div></div>' +
    '<div class="pg-ctrl"><div id="thr-mode"></div>' +
      '<details class="thr-drawer" id="thr-drawer"' + (wide ? " open" : "") + '><summary>Conditions</summary><div class="thr-cgrid">' +
        '<div id="thr-surr"></div><div id="thr-clo"></div><div id="thr-hat"></div><div id="thr-act"></div><div id="thr-water"></div><div id="thr-weeks"></div>' +
        '<p class="tiny muted thr-flock" id="thr-flock">Fever mode uses a 20 °C room, a T-shirt, no hat and resting.</p></div></details>' +
      '<div class="thr-panel" id="thr-fcp"><p class="thr-mt">Your forecast (challenge 3)</p>' + fcBox("chills", "During the chills (hours 1–2)") + fcBox("brk", "During the break (hours 5–6)") + "</div></div>" +
    '<div class="pg-read"><div class="thr-grow"><svg id="thr-gauge" class="thr-gauge" viewBox="0 0 170 236" role="img" focusable="false"></svg><dl class="read" id="thr-read" aria-live="polite"></dl></div>' +
      '<div id="thr-lbar"></div><p class="tiny muted thr-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#thr-svg"), gsv = $("#thr-gauge");
  function opts(list, dis){ return list.map(function(x){ return { id:x[0], t:x[1], dis:!!dis }; }); }
  function setCtl(k, v, label){ change(JSON.parse('{"' + k + '":' + JSON.stringify(v) + "}"), label); }
  var R = {
    mode:radios($("#thr-mode"), { label:"Mode", options:[{ id:"steady", t:"Steady day" }, { id:"fever", t:"Fever" }], value:S.mode, onChange:function(v){ setMode(v); } }),
    clo:radios($("#thr-clo"), { label:"Clothing", options:opts(CLOS), value:S.clo, onChange:function(v){ setCtl("clo", v, "Clothing: " + nameOf(CLOS, v)); } }),
    hat:radios($("#thr-hat"), { label:"Hat", options:opts(HATS), value:S.hat, onChange:function(v){ setCtl("hat", v, "Hat: " + v); } }),
    act:radios($("#thr-act"), { label:"Activity", options:opts(ACTS), value:S.act, onChange:function(v){ setCtl("act", v, "Activity: " + nameOf(ACTS, v)); } }),
    water:radios($("#thr-water"), { label:"Water", options:opts(WATERS), value:S.water, onChange:function(v){ setCtl("water", v, "Water: " + nameOf(WATERS, v)); } }),
    weeks:radios($("#thr-weeks"), { label:"Weeks in the cold", aria:"Weeks in the cold (more thyroid hormone)", options:opts(WEEKS), value:S.weeks, onChange:function(v){ setCtl("weeks", v, "Weeks in the cold: " + v); } })
  };
  var stp = stepper($("#thr-surr"), { id:"thr-surr", label:"Surroundings", values:SURRS, value:S.surr, fmt:deg, down:"Colder", up:"Warmer", onChange:function(v){ setCtl("surr", v, "Surroundings: " + deg(v)); } });
  var pl = MV.player($("#thr-fpl"), { count:FEV.length, interval:1500, label:function(i){ return FEV[i].lab; }, render:function(i){
    if (silent || S.mode !== "fever") return;
    stop(); var A = curView(); S.fh = i; var B = curView();
    what = FEV[i].cap; api.save(); paint(false); MV.changed(); animate(A, B, 900, null);
  } });
  host.addEventListener("change", function(e){
    var k = e.target.dataset && e.target.dataset.fc; if (!k) return;
    var p = k.split(":"); S.fc[p[0]][p[1]] = e.target.checked; api.save(); MV.changed();
  });
  function cur(){ return S.mode === "fever" ? feverModel(S.fh) : model(S); }
  function curView(){
    var m = cur(), fv = S.mode === "fever";
    return { clo:fv ? "tee" : S.clo, hat:fv ? "off" : S.hat, act:fv ? "rest" : S.act, vc:m.vc, vd:m.vd, sh:m.sh, sw:m.sw, thy:m.thy, core:m.core, set:m.set };
  }
  function neutral(v){ var o = {}; Object.keys(v).forEach(function(k){ o[k] = v[k]; }); o.vc = o.vd = o.sh = o.sw = o.thy = 0; o.core = 37; return o; }
  function blend(A, B, k){
    var o = {}, kd = k < 0.5 ? A : B;
    ["clo", "hat", "act"].forEach(function(f){ o[f] = kd[f]; });
    ["vc", "vd", "sh", "sw", "thy", "set"].forEach(function(f){ o[f] = lerp(A[f], B[f], clamp((k - 0.1) / 0.5, 0, 1)); });
    o.core = lerp(A.core, B.core, MV.ease(clamp((k - 0.35) / 0.65, 0, 1)));
    return o;
  }
  function setText(){
    if (S.mode === "fever") return "Fever mode, " + FEV[S.fh].lab.toLowerCase() + ": 20 °C room, T-shirt, resting";
    return deg(S.surr) + ", " + nameOf(CLOS, S.clo).toLowerCase() + ", hat " + S.hat + ", " + nameOf(ACTS, S.act).toLowerCase() + ", " + nameOf(WATERS, S.water).toLowerCase() + (S.weeks === "on" ? ", after weeks in the cold" : "");
  }
  function draw(v){ svg.innerHTML = bodySVG(v); gsv.innerHTML = gaugeSVG(v.core, v.set, masked); }
  function drawStill(){ draw(masked ? neutral(curView()) : curView()); }
  function rowsOf(m){
    var rs = respList(m), q = "?";
    if (m.fever) {
      var gap = m.core - m.set;
      return [["Core vs set point", gap === 0 ? "equal: nothing to correct" : Math.abs(gap) + " °C " + (gap < 0 ? "below (too cold)" : "above (too hot)")],
        ["Responses active", rs.length ? cap1(rs.join(", ")) : "None"], ["Core temperature", deg(m.core)], ["Status", feverStatus(m)],
        ["Sweat loss", MV.num(m.sweat, 1) + " L/h"], ["Set point", deg(m.set)]];
    }
    return [["Heat load", signed(m.L) + (m.L < 0 ? " (losing heat)" : m.L > 0 ? " (gaining heat)" : " (balanced)")],
      ["Responses active", masked ? q : rs.length ? cap1(rs.join(", ")) : "None"],
      ["Capacity used", masked ? q : m.side ? m.used + " of " + m.cap + (m.side < 0 ? " warming" : " cooling") + " units" : "none needed"],
      ["Core temperature", masked ? q : deg(m.core)], ["Status", masked ? q : status(m.core)],
      ["Sweat loss", masked ? q : MV.num(m.sweat, 1) + " L/h"], ["Set point", deg(m.set)]];
  }
  function aria(m){
    if (masked) return setText() + ". Heat load " + MV.plain(signed(m.L)) + ". The responses and core temperature are hidden until you predict.";
    var rs = respList(m);
    return setText() + ". " + (rs.length ? "The hypothalamus calls on " + rs.join(", ") + ". " : "No responses are needed. ") + "Core " + m.core + " degrees Celsius, set point " + m.set + ".";
  }
  function paintRead(){
    var m = cur();
    $("#thr-read").innerHTML = MV.readoutHTML(rowsOf(m));
    $("#thr-lbar").innerHTML = m.fever ? "" : loadBarHTML(m, masked);
    svg.setAttribute("aria-label", "Control room: " + aria(m));
    gsv.setAttribute("aria-label", masked ? "Core temperature gauge: hidden until you predict." : "Core temperature gauge: " + m.core + " degrees Celsius, " + (m.fever ? feverStatus(m) : status(m.core)) + "; set point " + m.set + ".");
  }
  function sync(){
    var fv = S.mode === "fever";
    R.mode.set(S.mode);
    ["clo", "hat", "act", "water", "weeks"].forEach(function(k){ R[k].setOptions(opts({ clo:CLOS, hat:HATS, act:ACTS, water:WATERS, weeks:WEEKS }[k], fv)); R[k].set(fv ? { clo:"tee", hat:"off", act:"rest", water:"hyd", weeks:"off" }[k] : S[k]); });
    stp.set(fv ? 20 : S.surr); stp.disable(fv);
    $("#thr-flock").hidden = !fv; $("#thr-fplw").hidden = !fv;
  }
  function paintCap(){ $("#thr-cap").textContent = what || (S.mode === "fever" ? FEV[S.fh].cap : setText() + "."); }
  function paint(still){ sync(); if (!holdRead) paintRead(); paintCap(); if (still) drawStill(); }
  function stop(){
    if (anim) { anim(); anim = null; }
    holdRead = false;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function describe(label, a, b){
    var ra = respList(a), rb = respList(b), on = rb.filter(function(x){ return ra.indexOf(x) < 0; }), off = ra.filter(function(x){ return rb.indexOf(x) < 0; }), parts = [];
    if (a.L !== b.L) parts.push("Load " + MV.plain(signed(a.L)) + " → " + MV.plain(signed(b.L)));
    if (on.length) parts.push(on.join(" and ") + " switch" + (on.length > 1 ? "" : "es") + " on");
    if (off.length) parts.push(off.join(" and ") + " switch" + (off.length > 1 ? "" : "es") + " off");
    parts.push(a.core !== b.core ? "core " + a.core + " → " + b.core + " °C" : "core stays at " + b.core + " °C");
    return label + ". " + cap1(parts.join("; ")) + ".";
  }
  function animate(A, B, dur, done){
    anim = MV.tween({ dur:dur, ease:lin, step:function(k){ draw(blend(A, B, k)); }, done:function(){ anim = null; drawStill(); if (done) done(); } });
  }
  function change(patch, label){
    stop();
    var A = curView(), a = cur(), wasMasked = masked;
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    masked = false;
    var B = curView(), b = cur();
    what = wasMasked ? "" : describe(label, a, b);
    api.save(); paint(false); MV.changed();
    animate(wasMasked ? neutral(A) : A, B, 1100, null);
  }
  function setMode(v){
    stop();
    var A = curView(); S.mode = v; masked = false;
    if (v === "fever") { silent = true; pl.go(S.fh); silent = false; }
    var B = curView(); what = "";
    api.save(); paint(false); MV.changed(); animate(A, B, 900, null);
  }
  paint(true);
  if (S.mode === "fever") { silent = true; pl.go(S.fh); silent = false; }

  function chal(id){
    var m = model(S);
    if (id === "tc3") {
      if (S.mode !== "fever") return { ok:false, msg:"Switch to Fever mode first: the forecast boxes are under the controls." };
      var c = S.fc.chills, b = S.fc.brk;
      if (c.sw) return { ok:false, msg:"During the chills the target is above the core, so the body tries to warm up." };
      if (b.sh) return { ok:false, msg:"During the break the core is above the new target." };
      if (c.vd || b.vc) return { ok:false, msg:"Vasodilation sheds heat and vasoconstriction keeps it in. Which phase needs which?" };
      if (c.vc && c.sh && b.vd && b.sw) return { ok:true };
      return { ok:false, msg:"Mark every response that runs in each phase: two for the chills and two for the break." };
    }
    if (S.mode !== "steady") return { ok:false, msg:"Switch to Steady day first." };
    if (id === "tc1") {
      if (S.surr !== -10) return { ok:false, msg:"Set the surroundings to −10 °C." };
      if (S.act !== "rest") return { ok:false, msg:"Standing still means Resting. Change the clothing instead." };
      if (m.core === 37 && m.sh === 0) return { ok:true };
      if (m.core === 37 && m.sh >= 2) return { ok:false, msg:"Shivering is working at full effort." };
      if (m.core === 37) return { ok:false, msg:"Core is 37, but shivering is still on." };
      return { ok:false, msg:"Core is " + m.core + " °C: even full shivering can’t keep up. Add clothing." };
    }
    if (id === "tc2") {
      if (S.surr !== 40) return { ok:false, msg:"Set the surroundings to 40 °C." };
      if (S.water !== "dehyd") return { ok:false, msg:"The person is dehydrated: set Water to Dehydrated." };
      if (S.clo !== "tee" || S.hat !== "off") return { ok:false, msg:"Keep the T-shirt and no hat." };
      if (S.act === "rest" && m.core === 37) return { ok:true };
      return { ok:false, msg:"Core " + m.core + ": dehydration caps sweating." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop();
        if (p.fever) { S.mode = "fever"; S.fh = 0; silent = true; pl.go(0); silent = false; masked = false; what = "Start: fever mode, before the fever. Set point 37 °C, core 37 °C."; }
        else { S.mode = "steady"; Object.keys(p.start).forEach(function(k){ S[k] = p.start[k]; }); masked = !!p.mask; what = "Start: " + setText() + "."; }
        api.save(); paint(true); MV.changed();
      },
      run:function(p, done){
        pend = done; holdRead = true;
        function finish(){ holdRead = false; paintRead(); var d = pend; pend = null; if (d) MV.wait(250, d); }
        if (p.fever) {
          var i = 0;
          (function next(){
            if (i >= 3) { finish(); return; }
            var A = curView(); i++; S.fh = i; silent = true; pl.go(i); silent = false;
            var B = curView(); what = FEV[i].cap; api.save(); paintCap(); paintRead(); MV.changed();
            animate(A, B, 1300, next);
          })();
          return;
        }
        var A = curView(), a = cur();
        if (masked) { A = neutral(A); masked = false; what = "Reveal: " + respList(a).join(" and ") + " switch on; the core settles at " + a.core + " °C."; }
        else { Object.keys(p.to).forEach(function(k){ S[k] = p.to[k]; }); what = describe(Object.keys(p.to).map(function(k){ return { act:"Activity → " + nameOf(ACTS, S.act), water:"Water → " + nameOf(WATERS, S.water) }[k]; }).join(", "), a, cur()); }
        var B = curView(); api.save(); paint(false); MV.changed();
        animate(A, B, 2600, finish);
      }
    },
    challenge:chal
  };
}

// ---------- hero: an outdoor thermometer slides from −30 °C to 40 °C; the core stays at 37 °C ----------
function heroSVG(T, both){
  var c = both ? 1 : clamp((5 - T) / 25, 0, 1), hh = both ? 1 : clamp((T - 22) / 14, 0, 1), h = "";
  if (!both) {
    var tx = 40 + (T + 30) * 4;
    h += txt(6, 26, "Outside", "thr-t thr-ts") + sv("line", { x1:56, y1:22, x2:320, y2:22, "class":"thr-otrack" });
    [-30, -10, 10, 30].forEach(function(v){ var x = 56 + (v + 30) * 264 / 70; h += sv("line", { x1:x, y1:18, x2:x, y2:26, "class":"thr-tick" }); });
    var mx = 56 + (T + 30) * 264 / 70; void tx;
    h += sv("circle", { cx:mx, cy:22, r:6, "class":"thr-omark" }) + txt(clamp(mx, 40, 320), 42, deg(Math.round(T)), "thr-t thr-tb", "middle");
  }
  function panel(x, title, on){ return '<g class="thr-pan' + (on ? " on" : "") + '">' + sv("rect", { x:x, y:52, width:130, height:170, rx:8, "class":"thr-pbox" }) + txt(x + 65, 72, title, "thr-t thr-tb", "middle") + "</g>"; }
  h += panel(8, both ? "Too cold (−30 °C)" : "Too cold", c > 0.3) + panel(222, both ? "Too hot (40 °C)" : "Too hot", hh > 0.3);
  // cold panel: skin vessel narrows, muscle shivers
  h += sv("line", { x1:18, y1:100, x2:128, y2:100, "class":"thr-skin" }) + txt(18, 92, "skin", "thr-t thr-ts") + tube(26, 120, 118, 8 - 4.5 * c);
  h += sv("ellipse", { cx:73, cy:168, rx:36, ry:9, "class":"thr-musc" }) + txt(73, 192, "muscle", "thr-t thr-ts", "middle");
  if (c > 0.35) h += shiverMarks(30, 168, 2, clamp((c - 0.35) * 3, 0, 1)) + '<g transform="translate(146 0) scale(-1 1)">' + shiverMarks(30, 168, 2, clamp((c - 0.35) * 3, 0, 1)) + "</g>";
  h += txt(73, 212, c > 0.5 ? "narrow vessels, shivering" : "relaxed", "thr-t thr-ts", "middle");
  // hot panel: skin vessel widens, sweat evaporates
  h += sv("line", { x1:232, y1:100, x2:342, y2:100, "class":"thr-skin" }) + txt(232, 92, "skin", "thr-t thr-ts") + tube(240, 334, 118, 8 + 6 * hh);
  [256, 287, 318].forEach(function(x, k){ var a = clamp(hh * 3 - k * 0.6, 0, 1); if (a > 0.05) h += drop(x, 90, 4.6, a) + wavy(x + 4, 84, x + 10, 66 - 4 * a, a); });
  h += txt(287, 168, hh > 0.5 ? "sweat evaporates" : "", "thr-t thr-ts", "middle") + txt(287, 212, hh > 0.5 ? "wide vessels, sweating" : "relaxed", "thr-t thr-ts", "middle");
  // centre: hypothalamus above a core thermometer locked at 37 °C
  h += sv("path", { d:"M166 66 q0 -12 14 -12 q14 0 14 12 q0 9 -14 9 q-14 0 -14 -9 Z", "class":"thr-brain" }) + sv("ellipse", { cx:181, cy:68, rx:4, ry:3, "class":"thr-hyp" }) + txt(180, 88, "hypothalamus", "thr-t thr-ts", "middle");
  h += txt(180, 108, "core 37 °C", "thr-t thr-tb", "middle") + sv("rect", { x:173, y:114, width:14, height:84, rx:7, "class":"thr-tubeo" }) + sv("circle", { cx:180, cy:206, r:11, "class":"thr-tubeo" });
  h += sv("rect", { x:176, y:140, width:8, height:66, rx:4, "class":"thr-merc" }) + sv("circle", { cx:180, cy:206, r:8, "class":"thr-merc" });
  return h;
}
function hero(f){
  var box = $("#thr-hero"); if (!box) return;
  var cap = f && f.cap;
  function setCap(t){ if (cap && cap.textContent !== t) cap.textContent = t; }
  if (MV.reduceMotion) {
    box.innerHTML = '<svg viewBox="0 0 360 230" aria-hidden="true" focusable="false">' + heroSVG(0, true) + "</svg>";
    setCap("At −30 °C the skin vessels narrow and the muscles shiver; at 40 °C the vessels widen and sweat evaporates. Either way the core stays at 37 °C.");
    return;
  }
  box.innerHTML = '<svg viewBox="0 0 360 230" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var steps = [
    { dur:1600, a:-30, b:-30, cap:"−30 °C: the skin vessels narrow, the muscles shiver, and the core stays at 37 °C." },
    { dur:3200, a:-30, b:15, cap:"Warming up: the vessels relax and the shivering stops." },
    { dur:900, a:15, b:15, cap:"Mild weather: no responses are needed." },
    { dur:3200, a:15, b:40, cap:"40 °C: the vessels widen and sweat evaporates, taking heat away. The core still reads 37 °C." },
    { dur:10, a:40, b:40, cap:"40 °C: the vessels widen and sweat evaporates, taking heat away. The core still reads 37 °C." }];
  var i = 0;
  (function next(){
    if (i >= steps.length) return;
    var s = steps[i++]; setCap(s.cap);
    MV.tween({ dur:s.dur, ease:lin, step:function(k){ svg.innerHTML = heroSVG(lerp(s.a, s.b, MV.ease(k))); }, done:next });
  })();
}

// ---------- Part 3: Animals in the cold ----------
// Station 1: body temperature vs surroundings (model data). x 0–40 °C → 44…344; y 0–45 °C → 204…14.
function gx(t){ return 44 + t * 7.5; }
function gyy(t){ return 204 - t * 190 / 45; }
var MOUSE = [[0, 37], [10, 37.1], [20, 37.2], [30, 37.3], [40, 37.6]];
var SNAKE = [[0, 2], [10, 11], [20, 21], [23, 26], [26, 29], [30, 30], [34, 30.5], [37, 33.5], [40, 38]];
var STRETCH = [[23, 26], [26, 29], [30, 30], [34, 30.5]];
function gpath(pts){ return "M" + pts.map(function(p){ return f1(gx(p[0])) + " " + f1(gyy(p[1])); }).join(" L"); }
function graphSVG(done){
  var h = "", t;
  if (done >= 3) h += sv("rect", { x:gx(23), y:14, width:gx(34) - gx(23), height:190, "class":"thr-hiband" });
  for (t = 0; t <= 40; t += 10) h += sv("line", { x1:gx(t), y1:204, x2:gx(t), y2:209, "class":"thr-tick" }) + txt(gx(t), 221, MV.num(t), "thr-t thr-ts", "middle");
  for (t = 0; t <= 40; t += 10) h += sv("line", { x1:39, y1:gyy(t), x2:44, y2:gyy(t), "class":"thr-tick" }) + txt(35, gyy(t) + 4, MV.num(t), "thr-t thr-ts", "end");
  h += sv("path", { d:"M44 14 V204 H344", "class":"thr-axis" }) + txt(194, 236, "surrounding temperature (°C)", "thr-t thr-ts", "middle");
  h += '<text class="thr-t thr-ts" transform="translate(12 110) rotate(-90)" text-anchor="middle">body temperature (°C)</text>';
  h += sv("path", { d:gpath(MOUSE), "class":"thr-lineA" }) + sv("path", { d:gpath(SNAKE), "class":"thr-lineB" });
  h += txt(gx(40) - 2, gyy(37.6) - 8, done >= 2 ? "A (mouse)" : "A", "thr-t thr-tb", "end") + txt(gx(8), gyy(8) - 10, done >= 2 ? "B (garter snake)" : "B", "thr-t thr-tb");
  h += '<g aria-hidden="true">' + sv("path", { d:gpath(MOUSE), "class":"thr-hit", "data-tap":"A" }) + sv("path", { d:gpath(SNAKE), "class":"thr-hit", "data-tap":"B" }) + sv("path", { d:gpath(STRETCH), "class":"thr-hit", "data-tap":"S" }) + "</g>";
  return h;
}
// @component countercurrentLeg — S1-style station: a duck leg with an artery (down) and a vein (up), side by side or apart;
// wavy heat arrows pass from artery to vein, and the foot's heat-loss arrows into the ice grow when the vessels are apart.
function legSVG(on){
  var ax = on ? 164 : 130, vx = on ? 196 : 230, h = "";
  h += sv("path", { d:"M90 6 Q180 -6 270 6 L270 30 Q180 40 90 30 Z", "class":"thr-duck" }) + txt(180, 24, "body (37 °C)", "thr-t thr-ts", "middle");
  h += sv("path", { d:"M" + (ax - 18) + " 30 V168 M" + (vx + 18) + " 30 V168", "class":"thr-legline" });
  h += sv("path", { d:"M" + (ax - 18) + " 168 L120 196 H240 L" + (vx + 18) + " 168", "class":"thr-legline" }) + sv("rect", { x:40, y:196, width:280, height:20, "class":"thr-ice" }) + txt(48, 211, "ice", "thr-t thr-ts");
  h += sv("line", { x1:ax, y1:34, x2:ax, y2:180, "class":"thr-art" }) + sv("line", { x1:vx, y1:180, x2:vx, y2:34, "class":"thr-vein" });
  [70, 130].forEach(function(y){ h += arrow(ax, y - 14, ax, y + 10, "thr-flowa", 1.4) + arrow(vx, y + 10, vx, y - 14, "thr-flowv", 1.4); });
  h += txt(ax - 24, 60, "artery", "thr-t thr-tb", "end") + txt(ax - 24, 74, "warm blood down", "thr-t thr-ts", "end") + txt(vx + 24, 60, "vein", "thr-t thr-tb") + txt(vx + 24, 74, "blood back up", "thr-t thr-ts");
  if (on) [52, 92, 132, 166].forEach(function(y){ h += wavy(ax + 3, y, vx - 3, y, 1, 1.6); });
  h += txt(ax - 24, 168, on ? "cool at the foot" : "still warm at the foot", "thr-t thr-ts", "end") + txt(vx + 24, 46, on ? "rewarmed" : "cold", "thr-t thr-ts");
  (on ? [180] : [140, 165, 190, 215]).forEach(function(x){ h += wavy(x, 200, x + (on ? 0 : 0), 214, 1, 1.4); });
  return h;
}
// @component brownFatZoom — "Zoom to the molecules": brown-fat cell → mitochondrion → inner membrane with the electron transport
// chain (pumps H⁺, --bio-h), ATP synthase and thermogenin (H⁺ leak back → wavy heat arrows). Steps 0–3.
function fatSVG(i){
  var h = "";
  if (i === 0) {
    h += sv("rect", { x:24, y:12, width:312, height:176, rx:60, "class":"thr-cell" });
    [[90, 70, 18], [140, 140, 16], [210, 120, 20], [270, 70, 14], [80, 140, 13], [280, 140, 15], [170, 60, 12]].forEach(function(c){ h += sv("circle", { cx:c[0], cy:c[1], r:c[2], "class":"thr-fat" }); });
    [[128, 92], [180, 100], [236, 84], [118, 40], [228, 156], [300, 108], [60, 104], [176, 160], [250, 40], [110, 168]].forEach(function(p, k){
      h += sv("ellipse", { cx:p[0], cy:p[1], rx:13, ry:6.5, "class":"thr-mito" + (k === 1 ? " sel" : "") }) + sv("path", { d:"M" + (p[0] - 8) + " " + p[1] + " q2 -4 4 0 q2 4 4 0 q2 -4 4 0 q2 4 4 0", "class":"thr-cris" });
    });
    h += txt(90, 74, "fat", "thr-t thr-ts", "middle") + txt(180, 122, "mitochondrion", "thr-t thr-tb", "middle");
  } else if (i === 1) {
    h += sv("ellipse", { cx:180, cy:100, rx:164, ry:84, "class":"thr-mito" }) + sv("path", { d:"M30 100 Q30 30 180 30 Q330 30 330 100 Q330 170 180 170 Q30 170 30 100 Z M80 36 V96 M130 31 V86 M180 30 V92 M230 31 V86 M280 36 V96 M105 166 V112 M155 170 V116 M205 170 V116 M255 166 V112", "class":"thr-inner" });
    h += txt(180, 124, "matrix", "thr-t thr-tb", "middle") + txt(180, 26, "intermembrane space", "thr-t thr-ts", "middle");
    [[60, 24], [110, 22], [250, 22], [300, 26], [70, 176], [290, 176]].forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:3.6, "class":"thr-hp" }); });
    h += sv("rect", { x:150, y:20, width:60, height:30, rx:4, "class":"thr-zoombox" }) + txt(214, 58, "zoom", "thr-t thr-ts");
  } else {
    h += sv("rect", { x:0, y:0, width:360, height:72, "class":"thr-ims" }) + sv("rect", { x:0, y:72, width:360, height:28, "class":"thr-memb" }) + txt(6, 14, "intermembrane space: high H⁺", "thr-t thr-ts") + txt(6, 194, "matrix: low H⁺", "thr-t thr-ts");
    [[30, 34], [62, 52], [100, 30], [140, 48], [196, 26], [232, 50], [300, 36], [334, 54], [262, 22]].forEach(function(p){ h += sv("circle", { cx:p[0], cy:p[1], r:4, "class":"thr-hp" }); });
    h += sv("rect", { x:44, y:66, width:40, height:40, rx:6, "class":"thr-prot" }) + txt(64, 124, "electron transport", "thr-t thr-ts", "middle") + txt(64, 137, "chain (pumps H⁺ out)", "thr-t thr-ts", "middle") + arrow(64, 92, 64, 44, "thr-harr", 1.6);
    h += '<g class="thr-dim">' + sv("rect", { x:160, y:66, width:24, height:40, rx:4, "class":"thr-prot" }) + sv("rect", { x:166, y:106, width:12, height:16, "class":"thr-prot" }) + sv("circle", { cx:172, cy:136, r:14, "class":"thr-prot" }) + txt(172, 170, "ATP synthase", "thr-t thr-ts", "middle") + txt(172, 183, "(bypassed)", "thr-t thr-ts", "middle") + "</g>";
    h += sv("rect", { x:262, y:66, width:14, height:40, rx:4, "class":"thr-prot" }) + sv("rect", { x:284, y:66, width:14, height:40, rx:4, "class":"thr-prot" }) + txt(280, 124, "thermogenin", "thr-t thr-tb", "middle");
    h += '<g class="thr-flow">' + [0, 1, 2].map(function(k){ return sv("circle", { cx:280, cy:58 + k * 24, r:4, "class":"thr-hp" }); }).join("") + "</g>" + arrow(280, 46, 280, 112, "thr-harr", 1.6);
    var big = i >= 3 ? 1 : 0.8;
    [[306, 150, 340, 176], [280, 146, 286, 186], [252, 150, 222, 176]].forEach(function(w){ h += wavy(w[0], w[1], w[2], w[3], big, 2); });
    h += txt(326, 140, "heat", "thr-t thr-tb");
    if (i >= 3) h += txt(196, 196, "heat without shivering", "thr-t thr-tb", "middle");
  }
  return h;
}
// @component hibernationYear — qualitative year graph: Richardson's ground squirrel (torpor bouts near the burrow temperature,
// brief rewarming spikes) and an optional black bear (drops only a few degrees). No numeric axis except 37 °C (plan risk 3).
// VERIFY: the curve shapes are qualitative (seasons, bout count and drop sizes are illustrative, not measured values).
function hibSVG(bear){
  var y37 = 40, yb = 172, yt = 158, h = "";
  h += sv("path", { d:"M44 14 V184 H348", "class":"thr-axis" }) + '<text class="thr-t thr-ts" transform="translate(14 100) rotate(-90)" text-anchor="middle">body temperature</text>';
  h += sv("line", { x1:44, y1:y37, x2:348, y2:y37, "class":"thr-ref" }) + txt(40, y37 + 4, "37 °C", "thr-t thr-ts", "end");
  h += sv("line", { x1:44, y1:yb, x2:348, y2:yb, "class":"thr-ref" }) + txt(346, yb - 4, "burrow temperature", "thr-t thr-ts", "end");
  ["Summer", "Autumn", "Winter", "Spring", "Summer"].forEach(function(s, k){ h += txt(70 + k * 66, 198, s, "thr-t thr-ts", "middle"); });
  var d = "M44 " + y37 + " L120 " + y37 + " L130 " + yt, x = 130;
  [168, 200, 232, 262].forEach(function(ax){ d += " L" + (ax - 6) + " " + yt + " L" + ax + " " + (y37 + 2) + " L" + (ax + 4) + " " + (y37 + 2) + " L" + (ax + 10) + " " + yt; x = ax + 10; });
  d += " L290 " + yt + " L300 " + y37 + " L348 " + y37; void x;
  h += sv("path", { d:d, "class":"thr-sq" }) + txt(150, yt - 8, "torpor: a few degrees above the burrow", "thr-t thr-ts") + txt(176, y37 - 8, "brief rewarming", "thr-t thr-ts", "middle");
  if (bear) h += sv("path", { d:"M44 " + (y37 + 3) + " L120 " + (y37 + 3) + " L134 " + (y37 + 20) + " L286 " + (y37 + 20) + " L300 " + (y37 + 3) + " L348 " + (y37 + 3), "class":"thr-bear" }) + txt(210, y37 + 34, "black bear: only a few degrees lower", "thr-t thr-ts", "middle");
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4, msg1 = null;
  S.s1 = S.s1 || 0; if (S.ccOn == null) S.ccOn = "on"; if (S.bear == null) S.bear = "off";
  host.innerHTML = '<div class="thr-p3">' +
    '<div class="thr-st"><h3>' + s1.title + "</h3><p>" + s1.how + ' <span class="bio-model">Model data</span></p><div class="thr-stg thr-stg-g"><svg id="thr-g1" viewBox="0 0 360 240" role="img" focusable="false" aria-label="Body temperature against surrounding temperature, 0 to 40 °C. Line A stays flat near 37 °C. Line B rises with the surroundings from about 2 °C, levels off near 30 °C between surroundings of about 24 and 34 °C, then rises to 38 °C."></svg></div>' +
      '<div id="thr-s1q"></div></div>' +
    '<div class="thr-st"><h3>' + s2.title + "</h3><p>" + s2.how + '</p><div id="thr-cct"></div><div class="thr-stg thr-stg-l"><svg id="thr-leg" viewBox="0 0 360 218" role="img" focusable="false"></svg></div><dl class="read" id="thr-ccr" aria-live="polite"></dl><p id="thr-cctx"></p></div>' +
    '<div class="thr-st"><h3>' + s3.title + '</h3><div class="thr-stg thr-stg-z"><svg id="thr-fat" viewBox="0 0 360 200" role="img" focusable="false"></svg></div><p class="thr-cap" id="thr-fcap" aria-live="polite"></p><div id="thr-fpl3"></div></div>' +
    '<div class="thr-st"><h3>' + s4.title + "</h3><p>" + s4.how + '</p><div id="thr-bt"></div><div class="thr-stg thr-stg-h"><svg id="thr-hib" viewBox="0 0 360 206" role="img" focusable="false"></svg></div><p>' + s4.text + '</p><p id="thr-beartx"></p></div></div>';
  // station 1
  var g1 = $("#thr-g1", host);
  function paint1(){
    g1.innerHTML = graphSVG(S.s1);
    var h = s1.steps.map(function(st, k){ return k < S.s1 ? '<p class="thr-ok">' + st.ok + "</p>" : ""; }).join("");
    if (S.s1 < 3) {
      h += '<p class="thr-q"><strong>' + (S.s1 + 1) + " of 3.</strong> " + s1.steps[S.s1].q + '</p><div class="thr-taps" role="group" aria-label="Choose a part of the graph">' +
        [["A", "Line A"], ["B", "Line B"], ["S", "The flat stretch of line B"]].map(function(b){ return '<button type="button" class="btn ghost sm" data-tap="' + b[0] + '" data-k="tap' + b[0] + '">' + b[1] + "</button>"; }).join("") + "</div>";
      if (msg1) h += MV.fbHTML("bad", "<p><strong>✗ Not quite.</strong> " + msg1 + "</p>");
    } else h += MV.fbHTML("good", "<p>" + s1.reveal + "</p>");
    MV.keepFocus($("#thr-s1q", host), function(){ $("#thr-s1q", host).innerHTML = h; });
  }
  function tap(t){
    if (S.s1 >= 3) return;
    var id = s1.steps[S.s1].id, ok = id === "endo" ? t === "A" : id === "ecto" ? t !== "A" : t === "S";
    if (ok) { S.s1++; msg1 = null; api.save(); }
    else msg1 = id === "endo" ? s1.wrong.endo : id === "ecto" ? s1.wrong.ectoA : t === "A" ? s1.wrong.behA : s1.wrong.behB;
    paint1(); MV.focusFb($("#thr-s1q", host));
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-tap]"); if (b && host.contains(b)) tap(b.dataset.tap); });
  paint1();
  // station 2
  function paint2(){
    var on = S.ccOn === "on", L = $("#thr-leg", host);
    L.innerHTML = legSVG(on);
    L.setAttribute("aria-label", "A duck leg standing on ice. The artery carries warm blood down and the vein carries blood back up. " + (on ? "They run side by side, with heat arrows passing from artery to vein all along the leg; the foot loses only a little heat to the ice." : "They run apart, with no heat passing between them; the foot loses a lot of heat to the ice."));
    $("#thr-ccr", host).innerHTML = MV.readoutHTML([["Heat lost from the foot", on ? "low" : "high"], ["Blood reaching the foot", on ? "already cool" : "still warm"], ["Blood returning to the body", on ? "rewarmed" : "cold"]]);
    $("#thr-cctx", host).textContent = on ? s2.on : s2.off;
  }
  radios($("#thr-cct", host), { label:"Vessels side by side", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.ccOn, onChange:function(v){ S.ccOn = v; api.save(); paint2(); } });
  paint2();
  // station 3
  var fz = $("#thr-fat", host), fpl = $("#thr-fpl3", host);
  MV.player(fpl, { count:4, interval:2600, label:function(i){ return "Step " + (i + 1) + " of 4"; }, render:function(i){
    fz.innerHTML = fatSVG(i);
    $("#thr-fcap", host).innerHTML = s3.steps[i];
    fz.setAttribute("aria-label", "Brown fat, step " + (i + 1) + " of 4: " + MV.plain(s3.steps[i]));
  } });
  // station 4
  function paint4(){
    var on = S.bear === "on", H = $("#thr-hib", host);
    H.innerHTML = hibSVG(on);
    H.setAttribute("aria-label", "A Richardson’s ground squirrel’s body temperature over a year: near 37 °C in summer; in winter it falls to a few degrees above the burrow temperature, with brief rewarming spikes back to 37 °C, then returns to 37 °C in spring." + (on ? " Dashed line: a black bear’s temperature drops only a few degrees through the winter." : ""));
    $("#thr-beartx", host).textContent = on ? s4.bear : "";
  }
  radios($("#thr-bt", host), { label:"Show the black bear", options:[{ id:"off", t:"Off" }, { id:"on", t:"On" }], value:S.bear, onChange:function(v){ S.bear = v; api.save(); paint4(); } });
  paint4();
}

// ---------- Practice 2: heat scenarios (N4 number entry and choices; copied from SBI4U 07's data activity) ----------
function heatAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z°].*$/, "").replace(/\s/g, "").replace(/,/g, "."); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, t){ return Math.abs(v - t) <= 1e-6 * Math.max(1, Math.abs(t)); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    var lab = "S" + (i + 1) + (it.star ? " ★" : "");
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:lab });
    else {
      h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + '</div><span class="tag">' + lab + "</span></div>";
      h += '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="thr-unit">' + it.unit + "</span>" : "") + "</div>";
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
        if (v == null) { msgs[it.id] = "Enter a number, such as 12 or 0.5."; paintItem(it); return; }
        ok = near(v, MV.ans(it));
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return near(v, w.match); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : it.general) + " Try again."; }
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

// ---------- Performance task: Winter hike (−10 °C, hydrated; live control-room view) ----------
var task = (function(){
  var api = null, T = null, DEF = { clo:"tee", hat:"off", act:"rest" };
  function read(){ var s = api ? api.S : {}, d = {}; Object.keys(DEF).forEach(function(k){ d[k] = s[k] || DEF[k]; }); return d; }
  function st(d){ return { surr:-10, clo:d.clo, hat:d.hat, act:d.act, water:"hyd", weeks:"off" }; }
  function word(id, v){ var inp = byId(T.inputs, id); for (var i = 0; i < inp.options.length; i++) if (inp.options[i][0] === v) return inp.options[i][1]; return v; }
  function desc(d){ return word("clo", d.clo) + ", hat " + d.hat + ", " + word("act", d.act).toLowerCase(); }
  function draw(){
    var d = read(), m = model(st(d)), pv = $("#thr-tpv"); if (!pv) return;
    var v = { clo:d.clo, hat:d.hat, act:d.act, vc:m.vc, vd:m.vd, sh:m.sh, sw:m.sw, thy:m.thy, core:m.core, set:37 }, rs = respList(m);
    pv.innerHTML = '<svg viewBox="0 0 360 250" role="img" aria-label="' + MV.esc("Hiker at −10 °C: " + desc(d) + ". " + (rs.length ? "Active: " + rs.join(", ") + ". " : "No responses needed. ") + "Core " + m.core + " °C.") + '">' + bodySVG(v) + "</svg>";
    $("#thr-tread").innerHTML = MV.readoutHTML([["Heat load", signed(m.L)], ["Responses active", rs.length ? cap1(rs.join(", ")) : "None"], ["Core temperature", deg(m.core)], ["Status", status(m.core)]]);
  }
  function key(d){ return [d.clo, d.hat, d.act].join("|"); }
  function unkey(k){ var p = k.split("|"); return { clo:p[0], hat:p[1], act:p[2] }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      Object.keys(DEF).forEach(function(k){ if (!a.S[k]) a.S[k] = DEF[k]; });
      inp.innerHTML = '<div class="thr-tin">' + T.inputs.map(function(x){ return '<div id="thr-ti-' + x.id + '"></div>'; }).join("") + '<p class="tiny muted">Surroundings −10 °C · hydrated</p></div>';
      T.inputs.forEach(function(x){ radios($("#thr-ti-" + x.id, inp), { label:x.label, cls:"chips", options:x.options.map(function(o){ return { id:o[0], t:o[1] }; }), value:a.S[x.id], onChange:function(v){ a.S[x.id] = v; a.save(); draw(); a.update(); } }); });
      pv.innerHTML = '<div class="thr-tpv" id="thr-tpv"></div><dl class="read" id="thr-tread" aria-live="polite"></dl>';
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var m = model(st(d)); return [m.core === 37, m.L >= -1, m.L <= 1, d.act !== "rest", d.clo !== "tee"]; },
    key:key,
    label:function(k){ var d = unkey(k); return word("clo", d.clo) + ", hat " + d.hat + ", " + word("act", d.act).toLowerCase(); },
    text:function(k){ var d = unkey(k), m = model(st(d)); return desc(d) + " (load " + MV.plain(signed(m.L)) + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ heat:heatAct },
  task:task
});
})();
