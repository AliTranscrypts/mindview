// SBI4U 17 Chemiosmosis: hero (pumps fill the intermembrane space, H⁺ streams back through ATP synthase, ATP pops out, dam sketch),
// Gradient and turbine (S4 membraneSim of the inner mitochondrial membrane, S3 energyLedger split bar, dam-analogy inset),
// "Two chemiosmosis machines" (S1 diagramExplorer label builders for a mitochondrion, a chloroplast and a bacterium, comparison table,
// Mitchell evidence cards), "Gradient arithmetic and evidence" (N4 numbers + chips), "Warm and working" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 06 / 03) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "cm-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrowPath(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " cm-ah" });
}
// wavy line (photons in ink; heat in ink-2)
function wavy(x1, y1, x2, y2, amp, wl){
  amp = amp == null ? 3 : amp; wl = wl || 9;
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, n = Math.max(2, Math.round(L / 2)), d = "";
  for (var i = 0; i <= n; i++) { var s = L * i / n, o = amp * Math.sin(s / wl * 2 * Math.PI); d += (i ? "L" : "M") + f1(x1 + ux * s - uy * o) + " " + f1(y1 + uy * s + ux * o); }
  return d;
}
function photonSVG(x1, y1, x2, y2){ var L = Math.hypot(x2 - x1, y2 - y1) || 1; return sv("path", { d:wavy(x1, y1, x2, y2) + " " + head(x2, y2, (x2 - x1) / L, (y2 - y1) / L), "class":"cm-photon" }); }
// stateless particle stream: particles spawn every 1/rate s and live `life` s; fn(k 0…1, index) -> svg
function stream(rate, life, t, fn){
  if (!(rate > 0)) return "";
  var per = 1 / rate, h = "";
  for (var i = Math.floor((t - life) / per) + 1, n1 = Math.floor(t / per); i <= n1; i++) { var k = (t - i * per) / life; if (k >= 0 && k <= 1) h += fn(k, i); }
  return h;
}
function pm(i, n){ return ((i % n) + n) % n; }
function fade(k){ return k < 0.12 ? k / 0.12 : k > 0.85 ? (1 - k) / 0.15 : 1; }
function op(v){ return v == null || v >= 1 ? null : f1(clamp(v, 0, 1) * 100) / 100; }
function hDot(x, y, o){ return sv("circle", { cx:x, cy:y, r:3.7, "class":"cm-h", opacity:op(o) }); }
// molecule token pill, role colour from the course tokens (ATP orange; ADP and Pᵢ ink-2; NADH teal; FADH₂ cerulean; O₂/H₂O blue; food brown)
var TOKC = { ATP:"--bio-atp", ADP:"--ink-2", "Pᵢ":"--ink-2", NADH:"--bio-nadh", "FADH₂":"--bio-fadh", "O₂ → H₂O":"--bio-o2", "H₂O":"--bio-o2", "NADP⁺ → NADPH":"--bio-nadh", "fuel from food":"--bio-carbon" };
function tok(lab, x, y, o){
  var w = Math.max(24, lab.length * 6.5 + 12);
  return '<g transform="translate(' + f1(x) + "," + f1(y) + ')"' + (op(o) == null ? "" : ' opacity="' + op(o) + '"') + '><rect x="' + f1(-w / 2) + '" y="-8.5" width="' + f1(w) + '" height="17" rx="8.5" style="fill:var(' + (TOKC[lab] || "--ink") + ')"/><text y="4" text-anchor="middle" class="cm-tokt">' + lab + "</text></g>";
}
function grp(a, inner){ return a <= 0.02 ? "" : a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + inner + "</g>" : inner; }
// lipid bilayer band across the width
function bandSVG(W, y0, y1){
  var g = "";
  for (var x = 5; x < W; x += 9) g += sv("circle", { cx:x, cy:y0 + 4, r:3.1 }) + sv("circle", { cx:x, cy:y1 - 4, r:3.1 });
  return sv("rect", { x:0, y:y0, width:W, height:y1 - y0, "class":"cm-mem" }) + sv("g", { "class":"cm-lip" }, g) + sv("line", { x1:0, y1:y0, x2:W, y2:y0, "class":"cm-edge" }) + sv("line", { x1:0, y1:y1, x2:W, y2:y1, "class":"cm-edge" });
}

// ---------- @component radioGroup (copied from SBI4U 13 / 08 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + (o.key || "") + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
// on/off switches (role="switch", from SBI4U 06): switches(host, {items:[[id, label]], get(id) -> bool, onChange(id, on)}) -> {paint()}
function switches(host, o){
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = o.items.map(function(it){ var on = !!o.get(it[0]); return '<button type="button" class="cm-swb" role="switch" aria-checked="' + on + '" data-sw="' + it[0] + '" data-k="sw' + it[0] + '"><span class="cm-swk" aria-hidden="true"></span><span>' + it[1] + '</span><span class="cm-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>"; }).join(""); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (b) o.onChange(b.dataset.sw, !o.get(b.dataset.sw)); });
  paint();
  return { paint:paint };
}
// range slider with output (from SBI4U 06): slider(host, {id, label, min, max, step, value, unit(v), short(v), onChange(v)}) -> {set(v)}
function slider(host, o){
  host.innerHTML = '<label class="slider cm-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.short ? o.short(v) : o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); } };
}

// ---------- @component S4 membraneSim — inner mitochondrial membrane in cross-section (intermembrane space above, matrix below):
// three grey ETC pumps (I, III, IV), an uncoupler / thermogenin pore, ATP synthase (rotor in the membrane, head in the matrix);
// H⁺ dots by gradient level; live particle flows (stream()) or a still frame with arrows (reduced motion, or H⁺ dots hidden);
// heat as --ink-2 wavy lines. Deterministic count model (plan §4 Explore). ----------
// s = {mode:"set"|"resp"|"brown", P (pumping, set), L (leak 0/4/8), T (thermogenin 0–16), D (ATP demand 0–5), syn (true = on)}
function model(s){
  var set = s.mode === "set", leak = s.mode === "brown" ? +s.T || 0 : +s.L || 0, D = +s.D || 0;
  var want = set ? +s.P || 0 : 4 * D + leak, r = { mode:s.mode, leakSet:leak, want:want, syn:s.syn !== false };
  if (!r.syn) {
    r.pump = Math.min(want, leak); r.thru = 0; r.heat = r.pump;
    r.grad = want === 0 && set ? "none" : leak && leak >= want ? "coll" : leak ? "maxl" : "max";
  } else {
    r.pump = want; r.heat = Math.min(leak, want); r.thru = want - r.heat;
    r.grad = want === 0 ? (set ? "none" : "steady") : r.thru === 0 && set ? "coll" : "steady";
  }
  r.atp = r.thru / 4; r.o2 = r.pump / 2; r.spin = r.thru > 0;
  r.lvl = LVL[r.grad];
  return r;
}
var LVL = { none:4, coll:4, steady:22, maxl:34, max:40 };
var GRAD = {
  steady:"Intermembrane space ≈ pH 7, matrix ≈ pH 8 (model)",
  max:"Maximum: pumps stalling",
  maxl:"Maximum: pumps slowed to the leak rate",
  none:"None: nothing is pumped (pH 8 on both sides)",
  coll:"Collapsed: every pumped H⁺ leaks back (pH 8 on both sides)"
};
function imsPH(g){ return g === "steady" ? "pH 7 (model)" : g === "max" || g === "maxl" ? "below pH 7: maximum gradient" : "pH 8"; }

// geometry (viewBox 520 × 290): intermembrane space 0–112, membrane 112–160, matrix 160–290
var VW = 520, VH = 290, MT = 112, MB = 160, PX = [70, 140, 210], LX = 300, SX = 420;
var POOL = (function(){                                                                                    // intermembrane-space H⁺ spots
  var r = MV.bio.rng("cm-ims"), out = [], n = 0;
  while (out.length < 40 && n < 9000) {
    n++; var x = r.range(12, 508), y = r.range(32, 104);
    if (PX.some(function(p){ return Math.abs(x - p) < 30 && y > 88; }) || (x > 384 && x < 456 && y > 84) || (Math.abs(x - LX) < 18 && y > 90)) continue;
    if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 13.5; })) continue;
    out.push([x, y]);
  }
  return out;
})();
var MAT_H = [[40, 236], [252, 214], [176, 254], [488, 282]];
var SYNP = [[402, 70], [410, 104], [410, 168], [388, 198], [356, 214]];
var LEAKP = [[294, 66], [300, 104], [300, 168], [300, 204]];
var ATPP = [[454, 228], [498, 254]];
function pumpPath(i, tgt){ var x = PX[i]; return [[x + 10, 266], [x, 178], [x, 96], tgt]; }
// o = {lvl, pore:"uncoupler"|"thermogenin"|null, blocked, grad, dots, pH:true}
function sceneSVG(o){
  var g = o.grad || "steady", h = sv("rect", { x:0, y:0, width:VW, height:MT, "class":"cm-ims" }) + sv("rect", { x:0, y:MB, width:VW, height:VH - MB, "class":"cm-mat" });
  var tint = { none:0, coll:0, steady:0.06, maxl:0.1, max:0.12 }[g] || 0;
  if (o.lvl != null) tint = clamp((o.lvl - 4) / 36, 0, 1) * 0.12;
  if (tint) h += sv("rect", { x:0, y:0, width:VW, height:MT, "class":"cm-tint", opacity:f1(tint * 100) / 100 });
  h += bandSVG(VW, MT, MB);
  if (o.pore) h += sv("rect", { x:LX - 11, y:MT - 1, width:22, height:MB - MT + 2, rx:4, "class":"cm-pore" }) + txt(LX, 192, o.pore, "cm-tb cm-halo", "middle");
  if (o.dots !== false) {
    var n = clamp(Math.round(o.lvl == null ? LVL[g] : o.lvl), 0, POOL.length);
    h += POOL.slice(0, n).map(function(p){ return hDot(p[0], p[1]); }).join("") + MAT_H.map(function(p){ return hDot(p[0], p[1]); }).join("");
  }
  // pumps (grey), ATP synthase: membrane rotor housing, stalk, stator, head in the matrix
  ["I", "III", "IV"].forEach(function(l, i){ h += sv("rect", { x:PX[i] - 22, y:98, width:44, height:76, rx:10, "class":"cm-pump" }) + txt(PX[i], 141, l, "cm-tc", "middle"); });
  h += txt(140, 194, "ETC pumps", "cm-tb cm-halo", "middle");
  h += sv("rect", { x:SX - 24, y:106, width:48, height:60, rx:9, "class":"cm-fo" }) + sv("rect", { x:SX - 5, y:164, width:10, height:40, rx:3, "class":"cm-stalk" }) + sv("path", { d:"M446 122 Q462 170 450 212", "class":"cm-stator" });
  h += sv("ellipse", { cx:SX, cy:222, rx:30, ry:20, "class":"cm-head" }) + sv("path", { d:"M398 216 Q420 208 442 216 M398 230 Q420 238 442 230", "class":"cm-lobe" });
  h += txt(386, 230, "ADP + Pᵢ", "cm-ts cm-halo", "end") + txt(SX, 268, "ATP synthase", "cm-tb cm-halo", "middle");
  if (o.blocked) h += sv("rect", { x:SX - 28, y:97, width:56, height:12, rx:3, "class":"cm-plug" }) + txt(SX, 90, "blocked (oligomycin)", "cm-tb cm-halo", "middle");
  if (g === "max") h += txt(140, 88, "pumps stalling", "cm-tb cm-halo", "middle");
  // compartment labels
  if (o.pH !== false) h += txt(8, 20, "Intermembrane space · " + imsPH(g), "cm-tb cm-halo") + txt(8, 284, "Matrix · pH 8" + (g === "steady" ? " (model)" : ""), "cm-tb cm-halo");
  else h += txt(8, 20, "Intermembrane space", "cm-tb cm-halo") + txt(8, 284, "Matrix", "cm-tb cm-halo");
  return h;
}
function rotorSVG(rot){
  var h = "";
  for (var k = 0; k < 6; k++) { var a = (rot + k * 60) * Math.PI / 180, c = Math.cos(a); if (c <= 0) continue; h += sv("rect", { x:SX + 19 * Math.sin(a) - 3, y:111, width:6, height:50, rx:3, "class":"cm-rot", opacity:f1((0.45 + 0.55 * c) * 100) / 100 }); }
  return h;
}
function heatSVG(k, i){
  var ang = [-0.5, 0, 0.5][pm(i, 3)] + Math.PI / 2, r0 = 12 + k * 30, ux = Math.cos(ang), uy = Math.sin(ang);
  return sv("path", { d:wavy(LX + ux * r0, 206 + uy * r0, LX + ux * (r0 + 16), 206 + uy * (r0 + 16), 2.4, 6), "class":"cm-heat", opacity:op(fade(k)) });
}
// live particles at time t (s); r = model(); n = visible intermembrane dots (targets for pumped H⁺); dots = show moving H⁺
function flowSVG(r, t, rot, n, dots){
  var h = rotorSVG(rot), m = Math.max(1, n);
  function tgt(i){ return POOL[pm(i * 7, m)] || [260, 60]; }
  if (dots) {
    [0, 1, 2].forEach(function(p){ h += stream(r.pump * 0.07, 1.4, t + p * 0.31, function(k, i){ var q = polyAt(pumpPath(p, tgt(i * 3 + p)), k); return hDot(q[0], q[1], k < 0.1 ? k / 0.1 : 1); }); });
    h += stream(r.thru * 0.2, 1.6, t, function(k){ var q = polyAt(SYNP, k); return hDot(q[0], q[1], k > 0.8 ? (1 - k) / 0.2 : 1); });
    h += stream(r.heat * 0.2, 1.4, t, function(k){ var q = polyAt(LEAKP, k); return hDot(q[0], q[1], k > 0.8 ? (1 - k) / 0.2 : 1); });
  } else h += flowArrows(r);
  h += stream(r.heat * 0.18, 1.3, t, heatSVG);
  h += stream(r.atp * 0.35, 1.5, t, function(k){ var q = polyAt(ATPP, k); return tok("ATP", q[0], q[1], fade(k)); });
  return h;
}
function flowArrows(r){
  var h = "";
  if (r.pump) PX.forEach(function(x){ h += arrowPath([[x + 30, 252], [x + 30, 186], [x + 30, 84]], "cm-hpath"); });
  if (r.thru) h += arrowPath(SYNP, "cm-hpath");
  if (r.heat) h += arrowPath(LEAKP, "cm-hpath");
  return h;
}
// still frame (reduced motion, hero end, task preview)
function flowStaticSVG(r){
  var h = rotorSVG(20) + flowArrows(r);
  if (r.heat) [0, 1, 2].forEach(function(i){ h += heatSVG(0.45, i); });
  if (r.atp) h += tok("ATP", 486, 248);
  h += txt(SX - 30, 140, r.spin ? "↻ spinning" : "stopped", "cm-tb cm-halo", "end");
  return h;
}
var LEGEND = '<span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="4.6" class="cm-h"/></svg>H⁺</span><span class="cm-lg-t" style="--c:var(--bio-atp)">ATP</span>' +
  '<span><svg viewBox="0 0 22 14" aria-hidden="true"><path d="M2 7 Q5 2 8 7 T14 7 T20 7" class="cm-heat"/></svg>heat</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="10" height="12" rx="3" class="cm-pump"/></svg>ETC pump</span>';

// ---------- @component S3 energyLedger (split-bar form) — where the pumped H⁺ go: through ATP synthase (→ ATP) or leaking (→ heat) ----------
function ledgerHTML(r, hide){
  var max = 36, wT = hide ? 0 : r.thru / max * 100, wH = hide ? 0 : r.heat / max * 100;
  return '<div class="cm-ledger" role="img" aria-label="' + MV.esc(hide ? "Where the pumped H⁺ go: hidden until you predict." : "Where the pumped H⁺ go: " + r.thru + " through ATP synthase, making " + MV.num(r.atp) + " ATP; " + r.heat + " leaking as heat.") + '">' +
    '<p class="cm-lgh">Where the pumped H⁺ go (per tick)</p><div class="cm-lbar"><i class="cm-lth" style="width:' + f1(wT) + '%"></i><i class="cm-lhe" style="width:' + f1(wH) + '%"></i></div>' +
    '<p class="cm-lkey tiny"><span><i class="cm-lsw cm-lth" aria-hidden="true"></i>through ATP synthase → ATP: <b>' + (hide ? "?" : r.thru + " H⁺ → " + MV.num(r.atp) + " ATP") + '</b></span><span><i class="cm-lsw cm-lhe" aria-hidden="true"></i>leak → heat: <b>' + (hide ? "?" : r.heat + " H⁺") + "</b></span></p></div>";
}

// ---------- dam analogy (inset): reservoir = intermembrane space, turbine = ATP synthase, pump = ETC, spillway = uncoupler leak ----------
// damSVG({lvl 0…1, rot, leak, pump, thru, still})
function damSVG(o){
  var top = 104 - 70 * o.lvl, h = sv("rect", { x:0, y:0, width:260, height:122, "class":"cm-ims" });
  h += sv("rect", { x:0, y:top, width:112, height:112 - top, "class":"cm-water" }) + sv("rect", { x:144, y:100, width:116, height:12, "class":"cm-water cm-water2" });
  h += sv("path", { d:"M112 24 L132 24 L148 112 L100 112 Z", "class":"cm-dam" }) + sv("line", { x1:0, y1:112, x2:260, y2:112, "class":"cm-ground" });
  h += sv("rect", { x:100, y:93, width:50, height:13, rx:3, "class":"cm-chan" });
  var c = "";
  for (var i = 0; i < 4; i++) { var a = (o.rot + i * 90) * Math.PI / 180; c += sv("line", { x1:126, y1:99.5, x2:f1(126 + 8 * Math.cos(a)), y2:f1(99.5 + 8 * Math.sin(a)), "class":"cm-blade" }); }
  h += c + sv("circle", { cx:126, cy:99.5, r:2.6, "class":"cm-hub" });
  if (o.thru) h += sv("path", { d:"M150 100 L176 100", "class":"cm-flowln" }) + sv("path", { d:head(178, 100, 1, 0, 5), "class":"cm-flowln" });
  if (o.leak) h += sv("path", { d:"M96 " + f1(top + 4) + " Q118 " + f1(top - 22) + " 150 " + f1(Math.min(96, top + 30)) + " L160 98", "class":"cm-spill" }) + sv("path", { d:wavy(166, 92, 182, 76, 2, 6), "class":"cm-heat" }) + txt(186, 74, "heat", "cm-ts");
  if (o.pump) h += sv("rect", { x:214, y:86, width:22, height:16, rx:3, "class":"cm-pump" }) + sv("path", { d:"M225 86 C 225 6, 60 4, 56 " + f1(top - 4), "class":"cm-pumpln" }) + sv("path", { d:head(56, top - 3, 0, 1, 6), "class":"cm-pumpln" }) + txt(208, 96, "pump", "cm-ts", "end");
  h += txt(8, 18, "reservoir", "cm-ts") + txt(126, 120, "turbine", "cm-ts", "middle");
  return h;
}

// ---------- Explore: Gradient and turbine ----------
var EXR = null;   // restarts the live loop (onShow)
function explore(host, api){
  var C = api.content, S = api.S;
  var D0 = { mode:"set", P:12, L:0, T:0, D:3, syn:true, dots:true, dam:false };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = D0[k]; });
  var cur = model(S), disp = { pump:cur.pump, thru:cur.thru, heat:cur.heat, atp:cur.atp, o2:cur.o2, lvl:cur.lvl }, hide = false, anim = null, pend = null, raf = null, lastT = 0, lastDraw = 0, rot = 0, what = "", readSig = "";
  host.innerHTML = '<div class="pg cm-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cm-stage"><svg id="cm-svg" viewBox="0 0 520 290" role="img" focusable="false"><g id="cm-gs"></g><g id="cm-gf"></g></svg></div>' +
    '<p class="cm-legend tiny">' + LEGEND + '</p><p class="cm-cap" id="cm-cap" aria-live="polite"></p>' +
    '<figure class="cm-dam-fig" id="cm-damf" hidden><figcaption><strong>' + C.damTitle + '</strong></figcaption><div class="cm-dam-stage"><svg id="cm-dam" viewBox="0 0 260 122" role="img" focusable="false"></svg></div><dl class="cm-damkey">' +
      C.damKey.map(function(k){ return "<div><dt>" + k[0] + "</dt><dd>= " + k[1] + "</dd></div>"; }).join("") + "</dl></figure></div>" +
    '<div class="pg-ctrl"><div id="cm-mode"></div><p class="tiny muted cm-mhelp" id="cm-mhelp"></p><div id="cm-pump"></div><div id="cm-dem"></div><div id="cm-leak"></div><div id="cm-thermo"></div><div id="cm-syn"></div><div class="cm-sws" id="cm-sws"></div></div>' +
    '<div class="pg-read"><dl class="read" id="cm-read" aria-live="polite"></dl><div id="cm-led"></div><p class="tiny cm-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#cm-svg", host), gS = $("#cm-gs", host), gF = $("#cm-gf", host), damSvg = $("#cm-dam", host), damF = $("#cm-damf", host), readEl = $("#cm-read", host);
  var MODEN = {}; C.modes.forEach(function(m){ MODEN[m[0]] = m[1]; });
  var modeR = radios($("#cm-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ change({ mode:v }, "Mode: " + MODEN[v]); } });
  var pumpS = slider($("#cm-pump", host), { id:"cm-p", label:"Pumping rate (H⁺ per tick)", min:0, max:20, step:4, value:S.P, short:String, unit:function(v){ return v + " H⁺ pumped per tick"; }, onChange:function(v){ change({ P:v }, "Pumping rate: " + v + " H⁺ per tick"); } });
  var demS = slider($("#cm-dem", host), { id:"cm-d", label:"ATP demand (ATP per tick)", min:0, max:5, step:1, value:S.D, short:String, unit:function(v){ return v + " ATP per tick"; }, onChange:function(v){ change({ D:v }, "ATP demand: " + v + " per tick"); } });
  var leakR = radios($("#cm-leak", host), { label:"Uncoupler leak (H⁺ per tick)", key:"l", options:C.leaks.map(function(l){ return { id:l[0], t:l[1] }; }), value:S.L, onChange:function(v){ change({ L:+v }, "Uncoupler leak: " + v + " H⁺ per tick"); } });
  var thS = slider($("#cm-thermo", host), { id:"cm-th", label:"Thermogenin (H⁺ leaking per tick)", min:0, max:16, step:4, value:S.T, short:String, unit:function(v){ return v + " H⁺ per tick through thermogenin"; }, onChange:function(v){ change({ T:v }, "Thermogenin: " + v + " H⁺ per tick"); } });
  var synR = radios($("#cm-syn", host), { label:"ATP synthase", key:"s", options:[{ id:"on", t:"On" }, { id:"off", t:"Blocked (oligomycin)" }], value:S.syn ? "on" : "off", onChange:function(v){ change({ syn:v === "on" }, "ATP synthase " + (v === "on" ? "on" : "blocked")); } });
  var sws = switches($("#cm-sws", host), { items:C.toggles, get:function(id){ return S[id]; }, onChange:function(id, on){ S[id] = on; api.save(); sws.paint(); paint(); } });

  function snap(r){ return { pump:r.pump, thru:r.thru, heat:r.heat, atp:r.atp, o2:r.o2, lvl:r.lvl }; }
  function poreName(){ var r = model(S); return r.leakSet > 0 ? (S.mode === "brown" ? "thermogenin" : "uncoupler") : null; }
  function describe(label, b, a){
    var parts = [];
    [["pump", "pumped"], ["thru", "through ATP synthase"], ["heat", "leaking as heat"], ["atp", "ATP"], ["o2", "O₂ per 10 ticks"]].forEach(function(q){ if (b[q[0]] !== a[q[0]]) parts.push(q[1] + " " + MV.num(b[q[0]]) + " → " + MV.num(a[q[0]])); });
    return label + ". " + (parts.length ? "Per tick: " + parts.join(", ") + "." : "No change to the counts.") + (b.grad !== a.grad ? " Gradient: " + GRAD[a.grad] + "." : "");
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    disp = snap(model(S)); readEl.setAttribute("aria-live", "polite");
    if (pend) { var d = pend; pend = null; d(); }
  }
  function change(patch, label){
    stop();
    var b = model(S);
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    hide = false;
    var a = model(S);
    what = describe(label, b, a);
    disp = snap(a); disp.lvl = b.lvl;
    api.save(); sync(); paintRead(); paintLedger(); MV.changed();
    $("#cm-cap", host).textContent = what;
    lvlTo(b.lvl, a.lvl, 900, null);
  }
  function lvlTo(from, to, dur, done){
    if (from === to) { disp.lvl = to; paintStatic(); if (done) done(); return; }
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(k){ disp.lvl = lerp(from, to, k); paintStatic(); }, done:function(){ anim = null; disp.lvl = to; paintStatic(); if (done) done(); } });
  }
  function sync(){
    modeR.set(S.mode); pumpS.set(S.P); demS.set(S.D); leakR.set(S.L); thS.set(S.T); synR.set(S.syn ? "on" : "off"); sws.paint();
    $("#cm-pump", host).hidden = S.mode !== "set"; $("#cm-dem", host).hidden = S.mode === "set";
    $("#cm-leak", host).hidden = S.mode === "brown"; $("#cm-thermo", host).hidden = S.mode !== "brown";
    $("#cm-mhelp", host).textContent = C.modeHelp[S.mode];
    damF.hidden = !S.dam;
  }
  function aria(r){
    return MODEN[S.mode] + " mode. " + r.pump + " H⁺ pumped per tick, " + r.thru + " through ATP synthase, " + r.heat + " leaking as heat. " + MV.num(r.atp) + " ATP per tick. O₂ used: " + MV.num(r.o2) + " per 10 ticks. Gradient: " + GRAD[r.grad] + ". Rotor " + (r.spin ? "spinning" : "stopped") + "." + (S.syn ? "" : " ATP synthase blocked.");
  }
  function paintStatic(){
    var r = model(S);
    gS.innerHTML = sceneSVG({ lvl:disp.lvl, pore:poreName(), blocked:!S.syn, grad:r.grad, dots:S.dots });
    if (MV.reduceMotion) gF.innerHTML = flowStaticSVG(r);
    if (S.dam) paintDam(0);
  }
  function paintDam(rr){
    var r = model(S);
    damSvg.innerHTML = damSVG({ lvl:clamp((disp.lvl - 4) / 36, 0, 1), rot:rr, leak:r.heat > 0, pump:r.pump > 0, thru:r.thru > 0 });
    damSvg.setAttribute("aria-label", "Dam analogy: the reservoir is " + (r.lvl >= 34 ? "full to the top" : r.lvl > 4 ? "high" : "low") + "; the turbine is " + (r.spin ? "turning" : "still") + (r.heat ? "; water also escapes over the spillway, wasting its energy as heat" : "") + (r.pump ? "; a pump lifts water back into the reservoir." : "."));
  }
  function v(n, key){ return hide && (key === "thru" || key === "heat" || key === "atp") ? "? (make your prediction)" : MV.num(Math.round(n * 10) / 10); }
  function paintRead(){
    var r = model(S), d = anim ? disp : snap(r), rows = [];
    var stalled = r.pump < r.want && !anim ? (r.pump === 0 ? " (pumps stalled)" : " (slowed to the leak rate)") : "";
    rows.push(["H⁺ pumped per tick", v(d.pump, "pump") + stalled]);
    rows.push(["H⁺ through ATP synthase", v(d.thru, "thru")]);
    rows.push(["H⁺ leaking (as heat)", v(d.heat, "heat")]);
    rows.push(["ATP made per tick", v(d.atp, "atp")]);
    rows.push(["O₂ used per 10 ticks", v(d.o2, "o2")]);
    rows.push(["Gradient", GRAD[r.grad]]);
    rows.push(["Rotor", hide ? "? (make your prediction)" : r.spin ? "Spinning" : "Stopped"]);
    var sig = JSON.stringify(rows); if (sig !== readSig) { readSig = sig; readEl.innerHTML = MV.readoutHTML(rows); }
    svg.setAttribute("aria-label", hide ? "Membrane simulator: the counts are hidden until you predict." : aria(r));
  }
  function paintLedger(){ $("#cm-led", host).innerHTML = ledgerHTML(anim ? { thru:Math.round(disp.thru), heat:Math.round(disp.heat), atp:Math.round(disp.atp * 4) / 4 } : model(S), hide); }
  function paint(){
    sync(); paintStatic(); paintRead(); paintLedger();
    $("#cm-cap", host).textContent = what || C.capIdle;
    run();
  }
  // live loop (about 30 frames per second, only while the diagram is on screen)
  function visible(){ var b = svg.getBoundingClientRect(); return b.width > 0 && !document.hidden; }
  function frame(now){
    raf = null;
    if (MV.reduceMotion || !visible()) return;
    raf = requestAnimationFrame(frame);
    if (now - lastDraw < 32) return;
    var t = now / 1000, dt = lastT ? Math.min(0.1, t - lastT) : 0; lastT = t; lastDraw = now;
    var r = model(S); if (hide) r = Object.assign({}, r, { atp:0, thru:0, heat:0 });
    rot = (rot + dt * r.thru * 22) % 360;
    gF.innerHTML = flowSVG(r, t, rot, Math.round(disp.lvl), S.dots);
    if (S.dam) paintDam(rot);
  }
  function run(){ if (MV.reduceMotion) return; if (!raf) { lastT = 0; raf = requestAnimationFrame(frame); } }
  EXR = run;
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) run(); });
  paint();

  function chal(id){
    var r = model(S), c = byId(C.challenges, id), W = c.wrong;
    if (id === "tc1") {
      if (S.mode !== "set") return { ok:false, msg:W.mode };
      if (!S.syn) return { ok:false, msg:W.blocked };
      if (S.L !== 0) return { ok:false, msg:W.leak };
      if (S.P === 12) return { ok:true };
      if (S.P === 16) return { ok:false, msg:W.p16 };
      if (S.P === 8) return { ok:false, msg:W.p8 };
      return { ok:false, msg:MV.num(r.atp) + " ATP per tick." };
    }
    if (id === "tc2") {
      if (S.mode !== "set") return { ok:false, msg:W.mode };
      if (!S.syn) return { ok:false, msg:W.blocked };
      if (S.L !== 4) return { ok:false, msg:W.leak };
      if (S.P === 20) return { ok:true };
      if (S.P === 16) return { ok:false, msg:W.p16 };
      return { ok:false, msg:S.P + " − 4 = " + r.thru + " through the turbine: " + MV.num(r.atp) + " ATP." };
    }
    if (id === "tc3") {
      if (S.mode !== "brown") return { ok:false, msg:W.mode };
      if (!S.syn) return { ok:false, msg:W.blocked };
      if (S.D !== 2) return { ok:false, msg:S.D === 3 ? W.d3 : "That’s " + S.D + " ATP." };
      if (S.T === 8) return { ok:true };
      if (S.T === 12 || S.T === 16) return { ok:false, msg:W.more };
      return { ok:false, msg:S.T === 4 ? W.t4 : W.t0 };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        Object.keys(s).forEach(function(k){ S[k] = s[k]; });
        hide = !!p.hide; what = "";
        disp = snap(model(S));
        if (hide) { disp.thru = 0; disp.heat = 0; disp.atp = 0; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        function fin(){ var d = pend; pend = null; readEl.setAttribute("aria-live", "polite"); paintRead(); paintLedger(); if (d) MV.wait(400, d); }
        var b = model(S), lab = [];
        if (p.to) Object.keys(p.to).forEach(function(k){ S[k] = p.to[k]; lab.push(k === "syn" ? (p.to[k] ? "ATP synthase on" : "ATP synthase blocked") : k === "L" ? "Leak: " + p.to[k] + " H⁺ per tick" : k === "T" ? "Thermogenin: " + p.to[k] + " H⁺ per tick" : k + " " + p.to[k]); });
        var a = model(S), from = hide ? Object.assign(snap(b), { thru:0, heat:0, atp:0 }) : snap(b), to = snap(a);
        hide = false;
        what = p.to ? describe(lab.join(", "), b, a) : "Revealed: " + a.thru + " H⁺ pass through the synthase, making " + MV.num(a.atp) + " ATP per tick; the other " + a.heat + " H⁺ leak back as heat.";
        api.save(); sync(); MV.changed();
        $("#cm-cap", host).textContent = what;
        readEl.setAttribute("aria-live", "off");
        anim = MV.tween({ dur:2600, ease:MV.ease, step:function(k){
          Object.keys(to).forEach(function(q){ disp[q] = lerp(from[q], to[q], k); });
          paintStatic(); paintRead(); paintLedger();
        }, done:function(){ anim = null; disp = snap(a); paintStatic(); fin(); } });
      }
    },
    challenge:chal
  };
}

// ---------- @component S1 diagramExplorer (copied from SBI4U 13 / 03 / 01; buttons at least 44 × 44 px, arrow keys move between them) ----------
// diagramExplorer(host, { levels:[{ id, name, vb:[w, h], draw() -> SVG markup, aria() -> text, hotspots:[{ id, label, zones:[[x, y, w, h]] }] }],
//   level:"id", onTap(id, levelId) }) -> { level(), setLevel(id), over(), svg(), setAria(text), labels(fn), refresh() }
function diagramExplorer(host, o){
  var lvId = o.level || o.levels[0].id;
  host.innerHTML = '<div class="s1"><div class="s1-stage"><svg class="s1-svg" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg><div class="s1-hs" role="group"></div></div></div>';
  var stage = $(".s1-stage", host), svg = $(".s1-svg", host), hsBox = $(".s1-hs", host);
  function L(){ return o.levels.filter(function(x){ return x.id === lvId; })[0]; }
  function p2(v){ return Math.round(v * 100) / 100; }
  function render(){
    var lv = L(), w = lv.vb[0], h = lv.vb[1];
    stage.style.aspectRatio = w + " / " + h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = lv.draw() + '<g class="s1-over"></g>';
    svg.setAttribute("aria-label", lv.aria ? lv.aria() : lv.name);
    hsBox.setAttribute("aria-label", lv.name);
    hsBox.hidden = !lv.hotspots.length;
    var list = [];
    lv.hotspots.forEach(function(hs){ hs.zones.forEach(function(z, zi){ list.push({ hs:hs, z:z, zi:zi, area:z[2] * z[3] }); }); });
    list.slice().sort(function(a, b){ return b.area - a.area; }).forEach(function(it, i){ it.zx = 1 + i; });
    list.sort(function(a, b){ return (a.z[1] - b.z[1]) || (a.z[0] - b.z[0]); });
    hsBox.innerHTML = list.map(function(it){
      var z = it.z, cx = (z[0] + z[2] / 2) / w * 100, cy = (z[1] + z[3] / 2) / h * 100, pw = z[2] / w * 100, ph = z[3] / h * 100;
      return '<button type="button" class="s1-b" data-hs="' + it.hs.id + '" data-k="s1' + lvId + it.hs.id + it.zi + '" aria-label="' + MV.esc(it.hs.label) + '" style="left:calc(' + p2(cx) + "% - max(22px, " + p2(pw / 2) + "%));top:calc(" + p2(cy) + "% - max(22px, " + p2(ph / 2) + "%));width:max(44px, " + p2(pw) + "%);height:max(44px, " + p2(ph) + "%);z-index:" + it.zx + '"></button>';
    }).join("");
  }
  hsBox.addEventListener("click", function(e){ var b = e.target.closest(".s1-b"); if (b && o.onTap) o.onTap(b.dataset.hs, lvId); });
  hsBox.addEventListener("keydown", function(e){
    var b = e.target.closest(".s1-b"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$(".s1-b", hsBox), i = all.indexOf(b); all[(i + d + all.length) % all.length].focus();
  });
  render();
  return {
    level:function(){ return lvId; },
    setLevel:function(id){ if (id !== lvId) { lvId = id; render(); } },
    over:function(){ return $(".s1-over", svg); },
    svg:function(){ return svg; },
    setAria:function(t){ svg.setAttribute("aria-label", t); },
    labels:function(fn){ $$(".s1-b", hsBox).forEach(function(b){ b.setAttribute("aria-label", fn(b.dataset.hs)); }); },
    refresh:render
  };
}

// ---------- Part 3, Station 1: three membrane diagrams with drop zones (tap a label, then tap a zone) ----------
function cplx(x, y, w, h, l){ return sv("rect", { x:x, y:y, width:w, height:h, rx:8, "class":"cm-pump" }) + txt(x + w / 2, y + h / 2 + 4, l, "cm-tcs", "middle"); }
function synthUp(x, yM0, yM1){ // ATP synthase with its head ABOVE the membrane (chloroplast stroma side)
  return sv("rect", { x:x - 15, y:yM0 - 4, width:30, height:yM1 - yM0 + 8, rx:6, "class":"cm-fo" }) + sv("rect", { x:x - 3, y:yM0 - 26, width:6, height:24, rx:2, "class":"cm-stalk" }) + sv("ellipse", { cx:x, cy:yM0 - 38, rx:21, ry:14, "class":"cm-head" });
}
function synthDown(x, yM0, yM1){ // head BELOW the membrane (matrix / cytoplasm side)
  return sv("rect", { x:x - 15, y:yM0 - 4, width:30, height:yM1 - yM0 + 8, rx:6, "class":"cm-fo" }) + sv("rect", { x:x - 3, y:yM1 + 2, width:6, height:24, rx:2, "class":"cm-stalk" }) + sv("ellipse", { cx:x, cy:yM1 + 38, rx:21, ry:14, "class":"cm-head" });
}
var BLD = {
  mit:{ vb:[400, 252],
    draw:function(){
      var h = sv("rect", { x:0, y:0, width:400, height:76, "class":"cm-ims" }) + sv("rect", { x:0, y:108, width:400, height:144, "class":"cm-mat" }) + bandSVG(400, 76, 108);
      h += cplx(22, 66, 34, 52, "I") + cplx(70, 66, 34, 52, "III") + cplx(118, 66, 34, 52, "IV") + synthDown(350, 76, 108);
      h += arrowPath([[39, 138], [39, 124]], "cm-tpath") + arrowPath([[164, 140], [142, 124]], "cm-tpath") + arrowPath([[16, 216], [16, 160], [24, 154]], "cm-tpath");
      h += tok("NADH", 40, 148) + tok("FADH₂", 94, 148) + tok("O₂ → H₂O", 188, 148) + tok("fuel from food", 58, 226);
      return h + txt(8, 18, "Intermembrane space", "cm-tb cm-halo") + txt(396, 70, "inner mitochondrial membrane", "cm-ts cm-halo", "end") + txt(350, 172, "ATP synthase", "cm-ts cm-halo", "middle") + txt(396, 246, "Matrix", "cm-tb cm-halo", "end");
    },
    zones:{ ims:[0, 0, 400, 66], mem:[0, 72, 400, 38], mat:[0, 112, 400, 140], nadh:[12, 134, 112, 28], o2:[150, 134, 76, 28], food:[8, 212, 100, 28] },
    tags:{ ims:[220, 40], mat:[346, 222], nadh:[84, 180], o2:[228, 204], food:[180, 230], mem:[200, 92] } },
  chl:{ vb:[400, 262],
    draw:function(){
      var h = sv("rect", { x:0, y:0, width:400, height:96, "class":"cm-str" }) + sv("rect", { x:0, y:128, width:400, height:134, "class":"cm-lum" }) + bandSVG(400, 96, 128);
      h += sv("circle", { cx:22, cy:22, r:11, "class":"cm-sun" });
      for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; h += sv("line", { x1:f1(22 + 14 * Math.cos(a)), y1:f1(22 + 14 * Math.sin(a)), x2:f1(22 + 19 * Math.cos(a)), y2:f1(22 + 19 * Math.sin(a)), "class":"cm-ray" }); }
      h += photonSVG(38, 36, 64, 80) + photonSVG(44, 24, 166, 80);
      h += cplx(50, 86, 34, 52, "PSII") + cplx(100, 86, 34, 52, "b₆f") + cplx(152, 86, 34, 52, "PSI") + sv("rect", { x:202, y:76, width:28, height:22, rx:6, "class":"cm-pump" }) + synthUp(350, 96, 128);
      h += arrowPath([[222, 76], [240, 64]], "cm-tpath") + tok("NADP⁺ → NADPH", 262, 54) + arrowPath([[67, 158], [67, 144]], "cm-tpath") + tok("H₂O", 67, 168);
      return h + txt(396, 14, "Stroma", "cm-tb cm-halo", "end") + txt(200, 146, "thylakoid membrane", "cm-ts cm-halo", "middle") + txt(350, 148, "ATP synthase", "cm-ts cm-halo", "middle") + txt(396, 256, "Thylakoid lumen", "cm-tb cm-halo", "end");
    },
    zones:{ str:[0, 0, 400, 92], light:[0, 0, 46, 46], mem:[0, 94, 400, 36], lum:[0, 132, 400, 130], h2o:[40, 154, 54, 28], nadp:[210, 40, 104, 28] },
    tags:{ str:[300, 86], lum:[256, 204], h2o:[86, 200], nadp:[250, 22], light:[100, 52], mem:[200, 112] } },
  bac:{ vb:[400, 150],
    draw:function(){
      var h = sv("rect", { x:0, y:0, width:400, height:48, "class":"cm-ims" }) + sv("rect", { x:0, y:80, width:400, height:70, "class":"cm-mat" }) + bandSVG(400, 48, 80);
      h += cplx(70, 40, 40, 48, "ETC") + synthDown(260, 48, 80);
      return h + txt(8, 18, "Outside the cell", "cm-tb cm-halo") + txt(396, 42, "plasma membrane", "cm-ts cm-halo", "end") + txt(396, 142, "Cytoplasm", "cm-tb cm-halo", "end");
    },
    zones:{ out:[0, 0, 400, 44], mem:[0, 46, 400, 36], cyt:[0, 84, 400, 66] },
    tags:{ out:[200, 26], cyt:[150, 118], mem:[170, 64] } }
};
function tagSVG(x, y, t){ var big = window.matchMedia && window.matchMedia("(max-width:560px)").matches, w = t.length * (big ? 7.1 : 6.3) + (big ? 24 : 22), hh = big ? 11 : 10; return '<g class="cm-tag"><rect x="' + f1(x - w / 2) + '" y="' + f1(y - hh) + '" width="' + f1(w) + '" height="' + f1(hh * 2) + '" rx="' + hh + '"/><text x="' + f1(x) + '" y="' + f1(y + (big ? 4.5 : 4)) + '" text-anchor="middle">✓ ' + t + "</text></g>"; }

// @component S7 evidenceCards — experiment cards with toggle claim chips and a Check button (multi-answer), each with a small figure
function card1SVG(){
  var h = "";
  [[16, "pH 4 (soak)"], [158, "pH 8 + ADP + Pᵢ"]].forEach(function(b, i){
    var x = b[0];
    h += sv("rect", { x:x, y:30, width:86, height:62, rx:6, "class":"cm-buf" }) + sv("path", { d:"M" + x + " 22 V88 q0 8 8 8 H" + (x + 78) + " q8 0 8 -8 V22", "class":"cm-glass" });
    h += sv("ellipse", { cx:x + 43, cy:62, rx:26, ry:13, "class":"cm-thy" });
    [[-12, -3], [0, 4], [12, -2], [-4, -6], [8, 5]].forEach(function(d){ h += hDot(x + 43 + d[0], 62 + d[1]); });
    h += txt(x + 43, 112, b[1], "cm-ts", "middle");
    if (i) h += tok("ATP", x + 72, 40) + tok("ATP", x + 18, 82);
  });
  return h + arrowPath([[108, 58], [150, 58]], "cm-tpath") + txt(129, 50, "dark", "cm-ts", "middle");
}
function card2SVG(on){
  var h = sv("circle", { cx:120, cy:62, r:44, "class":"cm-ves" });
  h += sv("rect", { x:66, y:50, width:20, height:24, rx:5, "class":"cm-pump" }) + sv("rect", { x:156, y:52, width:16, height:20, rx:4, "class":"cm-fo" }) + sv("rect", { x:172, y:59, width:12, height:6, "class":"cm-stalk" }) + sv("circle", { cx:192, cy:62, r:10, "class":"cm-head" });
  h += txt(54, 108, "light-driven pump", "cm-ts", "middle") + txt(196, 92, "ATP synthase", "cm-ts", "middle");
  if (on) {
    h += photonSVG(14, 18, 62, 50);
    [[100, 44], [118, 74], [134, 50], [110, 90], [140, 82], [124, 34]].forEach(function(p){ h += hDot(p[0], p[1]); });
    h += arrowPath([[48, 62], [92, 62]], "cm-hpath") + arrowPath([[146, 62], [176, 62]], "cm-hpath") + tok("ATP", 224, 40);
  } else h += txt(120, 66, "no gradient", "cm-ts", "middle");
  return h;
}

function part3(host, api){
  var C = api.content, S = api.S, B = C.builder, E = C.evidence;
  S.b = S.b || {}; S.ev = S.ev || {}; if (S.light == null) S.light = true;
  var LAB = {}; B.labels.forEach(function(l){ LAB[l[0]] = l[1]; });
  function ob(id){ return S.b[id] || (S.b[id] = { placed:{}, tries:0 }); }
  var sel = { org:null, lab:null }, msgs = {}, ex = {};
  host.innerHTML = '<div class="cm-p3"><div class="cm-st"><h3>' + B.title + "</h3><p>" + B.how + '</p><div class="cm-blds">' +
    B.orgs.map(function(o){ return '<section class="cm-bld cm-bld-' + o.id + '" data-org="' + o.id + '" aria-labelledby="cm-bh-' + o.id + '"><h4 id="cm-bh-' + o.id + '">' + o.name + ' <span class="tiny muted">' + o.sub + '</span></h4><div class="cm-labs" id="cm-labs-' + o.id + '" role="group" aria-label="Labels for the ' + MV.esc(o.name.toLowerCase()) + '"></div><div id="cm-d-' + o.id + '"></div><div class="cm-bfb" id="cm-fb-' + o.id + '" aria-live="polite"></div><div class="cm-bra" id="cm-ra-' + o.id + '"></div></section>'; }).join("") +
    '</div><div class="tbl-wrap"><table class="cm-tbl"><caption>The comparison table</caption><thead><tr>' + B.table.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + '</tr></thead><tbody id="cm-tb"></tbody></table></div><div id="cm-rule" aria-live="polite"></div></div>' +
    '<div class="cm-st cm-ev"><h3>' + E.title + '</h3><details class="alg" open><summary>' + E.panel + "</summary><p>" + E.intro + '</p><p class="tiny">' + E.how + '</p><div class="cm-cards">' +
      E.cards.map(function(c, i){ return '<article class="cm-card" data-card="' + c.id + '" aria-labelledby="cm-ch-' + c.id + '"><div class="cm-cfig" id="cm-cf-' + c.id + '"></div><div class="cm-cbody"><h4 id="cm-ch-' + c.id + '">' + (i + 1) + ". " + c.title + (c.from ? ' <span class="tiny muted">' + c.from + "</span>" : "") + "</h4><p>" + c.text + '</p><div id="cm-cq-' + c.id + '"></div></div></article>'; }).join("") +
    "</div></details></div></div>";

  // ---- Station 1 ----
  function done(o){ var st = ob(o.id); return o.labels.every(function(l){ return st.placed[l]; }); }
  function zoneLabel(o, z){ var st = ob(o.id), on = Object.keys(st.placed).filter(function(l){ return st.placed[l] === z; })[0]; return o.zones[z] + (on ? " (labelled: " + LAB[on] + ")" : ""); }
  function paintLabs(o){
    var st = ob(o.id), box = $("#cm-labs-" + o.id, host);
    MV.keepFocus(box, function(){
      box.innerHTML = o.labels.map(function(l){ var p = !!st.placed[l], on = sel.org === o.id && sel.lab === l; return '<button type="button" class="cm-lab' + (p ? " placed" : "") + '" aria-pressed="' + on + '" data-lab="' + l + '" data-k="cmlab' + o.id + l + '"' + (p ? " disabled" : "") + '><span aria-hidden="true">' + (p ? "✓ " : on ? "● " : "") + "</span>" + LAB[l] + (p ? '<span class="vh"> (placed)</span>' : "") + "</button>"; }).join("");
    });
    var ra = $("#cm-ra-" + o.id, host);
    MV.keepFocus(ra, function(){ ra.innerHTML = Object.keys(st.placed).length ? '<button type="button" class="btn ghost sm" data-reset="1" data-k="cmreset' + o.id + '">Start this diagram again</button>' : ""; });
  }
  function paintOver(o){
    var st = ob(o.id), G = BLD[o.id], h = "";
    Object.keys(st.placed).forEach(function(l){ var z = st.placed[l], p = G.tags[z]; h += tagSVG(p[0], p[1], LAB[l]); });
    ex[o.id].over().innerHTML = h;
    ex[o.id].labels(function(z){ return zoneLabel(o, z); });
    ex[o.id].setAria(o.name + " diagram (" + o.sub + "): " + Object.keys(o.zones).map(function(z){ return zoneLabel(o, z); }).join("; ") + ".");
  }
  function paintFb(o){ var m = msgs[o.id]; $("#cm-fb-" + o.id, host).innerHTML = m ? MV.fbHTML(m[0], m[1]) : (done(o) && o.id === "bac" ? MV.fbHTML("good", "<strong>✓ Complete.</strong> " + B.bacDone) : ""); }
  function paintTable(){
    var mit = byId(B.orgs, "mit"), chl = byId(B.orgs, "chl"), sm = ob("mit"), sc = ob("chl");
    function cell(o, st, row, val){ var shown = row[3] === null || (row[3] === "all" ? done(o) : !!st.placed[row[3]]); return "<td" + (shown ? "" : ' class="cm-q"') + ">" + (shown ? val : '?<span class="vh"> (not placed yet)</span>') + "</td>"; }
    $("#cm-tb", host).innerHTML = B.table.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th>" + cell(mit, sm, r, r[1]) + cell(chl, sc, r, r[2]) + "</tr>"; }).join("");
    $("#cm-rule", host).innerHTML = done(mit) && done(chl) ? MV.fbHTML("good", "<strong>Both machines built.</strong> " + B.rule + (done(byId(B.orgs, "bac")) ? "" : " Now try the bacterium.")) : "";
  }
  function paintOrg(o){ paintLabs(o); paintOver(o); paintFb(o); }
  B.orgs.forEach(function(o){
    var G = BLD[o.id];
    ex[o.id] = diagramExplorer($("#cm-d-" + o.id, host), { levels:[{ id:o.id, name:o.name + " diagram: places to label", vb:G.vb, draw:G.draw,
      hotspots:Object.keys(o.zones).map(function(z){ return { id:z, label:o.zones[z], zones:[G.zones[z]] }; }) }],
      onTap:function(z){ tapZone(o, z); } });
    $("#cm-ra-" + o.id, host).addEventListener("click", function(e){
      var b = e.target.closest("[data-reset]"); if (!b) return;
      S.b[o.id] = { placed:{}, tries:0 }; if (sel.org === o.id) sel = { org:null, lab:null }; msgs[o.id] = null; api.save(); paintOrg(o); paintTable();
      var f = $('[data-k="cmlab' + o.id + o.labels[0] + '"]', host); if (f) f.focus();
    });
    $("#cm-labs-" + o.id, host).addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      var l = b.dataset.lab, prev = sel.org;
      sel = sel.org === o.id && sel.lab === l ? { org:null, lab:null } : { org:o.id, lab:l };
      msgs[o.id] = sel.lab ? ["", "Now tap the place on the " + o.name.toLowerCase() + " diagram for “" + LAB[l] + "”."] : null;
      if (prev && prev !== o.id) { msgs[prev] = null; paintOrg(byId(B.orgs, prev)); }
      paintLabs(o); paintFb(o);
    });
    paintOrg(o);
  });
  function tapZone(o, z){
    var st = ob(o.id);
    if (sel.org !== o.id || !sel.lab) { msgs[o.id] = ["", "That’s the <strong>" + o.zones[z] + "</strong>. Choose a label above first, then tap here."]; paintFb(o); return; }
    var l = sel.lab, ans = MV.ans(o);
    if (ans[l] === z) {
      st.placed[l] = z; sel = { org:null, lab:null };
      msgs[o.id] = ["good", "<strong>✓ Correct.</strong> " + LAB[l] + ": " + o.zones[z] + "." + (done(o) ? " This diagram is complete." + (o.id === "bac" ? " " + B.bacDone : "") : "")];
    } else {
      st.tries++;
      msgs[o.id] = ["bad", "<strong>✗ Not there.</strong> " + B.rule + (B.labelHints[l] ? " " + B.labelHints[l] : "") + " Try another place."];
    }
    api.save(); paintOrg(o); paintTable();
  }
  paintTable();

  // ---- Station 2: evidence cards ----
  function cs(id){ return S.ev[id] || (S.ev[id] = { sel:[], solved:false, tries:0 }); }
  var cmsg = {};
  function paintCard(c){
    var st = cs(c.id), box = $("#cm-cq-" + c.id, host), h = '<p class="tiny cm-cask">What does it show? Choose every claim that fits.</p><div class="cm-claims" role="group" aria-label="Claims for card ' + MV.esc(c.title) + '">';
    h += E.claims.map(function(cl){ var on = st.sel.indexOf(cl[0]) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cl="' + cl[0] + '" data-k="cmcl' + c.id + cl[0] + '"' + (st.solved ? " disabled" : "") + '><span aria-hidden="true">' + (on ? "✓ " : "") + "</span>" + cl[1] + "</button>"; }).join("") + "</div>";
    if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="cmck' + c.id + '"' + (st.sel.length ? "" : " disabled") + ">Check</button></div>";
    if (st.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.right + (st.tries ? ' <span class="muted">(not first try)</span>' : ""));
    else if (cmsg[c.id]) h += MV.fbHTML("bad", cmsg[c.id]);
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  E.cards.forEach(function(c){
    var box = $("#cm-cq-" + c.id, host);
    box.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      var st = cs(c.id);
      if (b.dataset.cl) { var k = st.sel.indexOf(b.dataset.cl); if (k >= 0) st.sel.splice(k, 1); else st.sel.push(b.dataset.cl); cmsg[c.id] = null; api.save(); paintCard(c); return; }
      if (b.dataset.act === "check") {
        var ans = MV.ans(c), extra = st.sel.filter(function(x){ return ans.indexOf(x) < 0; }), miss = ans.filter(function(x){ return st.sel.indexOf(x) < 0; });
        if (!extra.length && !miss.length) { st.solved = true; cmsg[c.id] = null; }
        else { st.tries++; cmsg[c.id] = "<strong>✗ Not quite.</strong> " + (extra.length ? c.wrong[extra[0]] : c.missing) + " Change your choice and check again."; }
        api.save(); paintCard(c); MV.focusFb(box);
      }
    });
    paintCard(c);
  });
  // card figures
  $("#cm-cf-x1", host).innerHTML = '<svg viewBox="0 0 260 120" role="img" focusable="false" aria-label="Thylakoids soak in a pH 4 beaker, then move in the dark to a pH 8 beaker with ADP and Pᵢ, where ATP appears."></svg>';
  $("svg", $("#cm-cf-x1", host)).innerHTML = card1SVG();
  $("#cm-cf-x2", host).innerHTML = '<div class="cm-vstage"><svg viewBox="0 0 260 120" role="img" focusable="false" id="cm-ves"></svg></div><div id="cm-lt"></div><p class="tiny cm-vcap" id="cm-vcap" aria-live="polite"></p>';
  function paintVes(){
    var svgV = $("#cm-ves", host); svgV.innerHTML = card2SVG(S.light);
    svgV.setAttribute("aria-label", "A membrane vesicle with a light-driven pump and ATP synthase whose head faces outward. " + MV.plain(S.light ? E.vesicle.on : E.vesicle.off));
    $("#cm-vcap", host).innerHTML = '<span class="bio-model">Model</span> ' + (S.light ? E.vesicle.on : E.vesicle.off);
  }
  radios($("#cm-lt", host), { label:"Light", key:"lt", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.light ? "on" : "off", onChange:function(v){ S.light = v === "on"; api.save(); paintVes(); } });
  paintVes();
  var G3 = E.graph;
  $("#cm-cf-x3", host).innerHTML = '<div class="plot-wrap"><canvas class="plot" id="cm-g3" role="img"></canvas></div><p class="tiny muted cm-g3leg"><span class="cm-key cm-key-o2" aria-hidden="true"></span> ' + G3.o2 + ', solid · <span class="cm-key cm-key-atp" aria-hidden="true"></span> ' + G3.atp + ', dashes · ' + G3.yLabel + ' · <span class="bio-model">Model data</span></p>';
  var plot = new MV.Plot($("#cm-g3", host), { xmin:0, xmax:10, ymin:0, ymax:20 });
  plot.render = function(){
    var css = MV.css, o2c = css("--bio-o2"), atpc = css("--bio-atp"), ink2 = css("--ink-2");
    plot.draw({ view:{ xmin:0, xmax:10, ymin:0, ymax:20 }, xTicks:{ step:2, fmt:function(v){ return v + " min"; } }, yTicks:{ step:4 },
      segments:[{ x1:5, y1:0, x2:5, y2:19.5, color:ink2, width:1.5, dash:[6, 5] }],
      curves:[{ pts:[[0, 8], [5, 8], [5.6, 16], [10, 16]], color:o2c, width:3 }, { pts:[[0, 8.2], [5, 8.2], [5.6, 0.25], [10, 0.25]], color:atpc, width:3, dash:[10, 6] }],
      labels:[{ x:5, y:11, text:G3.added, color:ink2, align:"left", dx:6, bg:true }, { x:9.8, y:16, text:G3.o2, color:o2c, align:"right", dy:14, bg:true }, { x:9.8, y:3, text:G3.atp, color:atpc, align:"right", bg:true }],
      describe:G3.describe });
  };
  plot.render();
}

// ---------- Practice 2: Gradient arithmetic and evidence (N4 number entry incl. a two-box item, and chips; adapted from SBI4U 06) ----------
function calc(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { val:"", vals:["", ""], tries:0, hint:0, solved:false, first:null }); if (!x.vals) x.vals = ["", ""]; return x; }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function item(id){ return byId(a.items, id); }
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/%/g, "").replace(/[a-zA-Z].*$/, "").replace(/\s/g, "").replace(/,/g, "."); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function same(a1, b1){ return Math.abs(a1 - b1) <= 1e-6 * Math.max(1, Math.abs(b1)); }
  function inputs(it, x){
    if (it.kind === "pair") return '<div class="cm-pair">' + it.labels.map(function(l, k){ return '<div class="numrow"><label for="li-' + it.id + k + '">' + l + ':</label><input class="numin" id="li-' + it.id + k + '" data-lin="' + it.id + '" data-ix="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[k]) + '"' + (x.solved ? " disabled" : "") + "></div>"; }).join("") + "</div>";
    return '<div class="numrow"><label for="li-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="cm-unit">' + it.unit + "</span></div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chips") {
      h += '<div class="cm-chips" role="group" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.last === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ci="' + k + '" data-k="' + it.id + "c" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
      if (!x.solved && it.hints) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    } else {
      h += inputs(it, x);
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    }
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (x.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; var x = ist(id); if (e.target.dataset.ix != null) x.vals[+e.target.dataset.ix] = e.target.value; else x.val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it.id), ok = null;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.ci != null) {
      var o = it.options[+b.dataset.ci]; x.last = +b.dataset.ci; ok = MV.ok(o);
      msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + o.why + " Try again.";
      if (ok) x.why = o.why;
    } else if (b.dataset.act === "check") {
      if (it.kind === "pair") {
        var vs = x.vals.map(parseVal), ans = MV.ans(it);
        if (vs[0] == null || vs[1] == null) { msgs[it.id] = "Enter a number in both boxes, such as 3 or 1.5."; paintItem(it); return; }
        ok = same(vs[0], ans[0]) && same(vs[1], ans[1]);
        var wp = (it.wrongPair || []).filter(function(w){ return same(vs[0], w.match[0]) && same(vs[1], w.match[1]); })[0];
        msgs[it.id] = ok ? null : "<strong>✗ Not quite.</strong> " + (wp ? wp.fb : it.wrongFb) + " Try again.";
      } else {
        var v = parseVal(x.val), an = MV.ans(it);
        if (v == null) { msgs[it.id] = "Enter a number, such as 10 or 2.5."; paintItem(it); return; }
        if (it.pct && Math.abs(v) <= 1 && v !== 0) v = v * 100;
        ok = same(v, an);
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return same(v, w.match); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : "Check your working against the model and try again.") + " Try again."; }
        else msgs[it.id] = null;
      }
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

// ---------- Performance task: Warm and working (inputs + S4 still frame + live readouts) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (s.P == null) s.P = 0; if (s.L == null) s.L = 0; if (s.syn == null) s.syn = true; return s; }
  function read(){ if (!api) return { P:0, L:0, syn:true }; var s = st(); return { P:+s.P, L:+s.L, syn:!!s.syn }; }
  function tm(d){ return model({ mode:"set", P:d.P, L:d.L, syn:d.syn, D:0, T:0 }); }
  function draw(){
    var d = read(), r = tm(d), svgT = $("#cm-tsvg"); if (!svgT) return;
    svgT.innerHTML = sceneSVG({ pore:d.L > 0 ? "thermogenin" : null, blocked:!d.syn, grad:r.grad }) + flowStaticSVG(r);
    svgT.setAttribute("aria-label", "Brown-fat mitochondrion: " + r.pump + " H⁺ pumped per tick, " + r.thru + " through ATP synthase, " + r.heat + " leaking through thermogenin as heat. " + MV.num(r.atp) + " ATP per tick; O₂ " + MV.num(r.o2) + " per 10 ticks.");
    $("#cm-tread").innerHTML = MV.readoutHTML([["H⁺ pumped per tick", MV.num(r.pump) + (r.pump < r.want ? (r.pump ? " (slowed to the leak rate)" : " (pumps stalled)") : "")], ["H⁺ through ATP synthase", MV.num(r.thru)], ["H⁺ leaking (as heat)", MV.num(r.heat)], ["ATP made per tick", MV.num(r.atp)], ["O₂ used per 10 ticks", MV.num(r.o2)], ["Gradient", GRAD[r.grad]]]);
  }
  function parse(k){ var m = /p(\d+)-l(\d+)/.exec(k) || [0, 0, 0]; return { P:+m[1], L:+m[2] }; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="cm-tin"><div id="cm-tp"></div><div id="cm-tl"></div><div id="cm-ts"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      slider($("#cm-tp"), { id:"cm-tps", label:"Pumping (H⁺ per tick)", min:0, max:40, step:4, value:s.P, short:String, unit:function(v){ return v + " H⁺ pumped per tick"; }, onChange:function(v){ s.P = v; upd(); } });
      slider($("#cm-tl"), { id:"cm-tls", label:"Leak through thermogenin (H⁺ per tick)", min:0, max:16, step:4, value:s.L, short:String, unit:function(v){ return v + " H⁺ leaking per tick"; }, onChange:function(v){ s.L = v; upd(); } });
      radios($("#cm-ts"), { label:"ATP synthase", key:"ts", options:[{ id:"on", t:"On" }, { id:"off", t:"Blocked" }], value:s.syn ? "on" : "off", onChange:function(v){ s.syn = v === "on"; upd(); } });
      pv.innerHTML = '<div class="cm-tpv"><h4>Live readouts</h4><div class="cm-stage"><svg id="cm-tsvg" viewBox="0 0 520 290" role="img" focusable="false"></svg></div><dl class="read" id="cm-tread" aria-live="polite"></dl></div>';
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, "You’ve found all three answers.");
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var r = tm(d); return [r.atp >= 3, r.heat >= 8, r.o2 <= 12]; },
    key:function(d){ return "p" + d.P + "-l" + d.L; },
    label:function(k){ var q = parse(k); return "pumping " + q.P + ", leak " + q.L; },
    text:function(k){ var q = parse(k); return "pumping " + q.P + ", leak " + q.L; }
  };
})();

// ---------- hero: membrane → pumps fill the intermembrane space (pH 7 / pH 8) → ATP synthase turns → ATP pops out → dam sketch ----------
function hero(f){
  var box = $("#cm-hero"); if (!box) return;
  var cap = f && f.cap;
  box.innerHTML = '<svg viewBox="0 0 520 290" aria-hidden="true" focusable="false"><g class="cm-hs"></g><g class="cm-hf"></g><g class="cm-hd"></g></svg>';
  var gS = $(".cm-hs", box), gF = $(".cm-hf", box), gD = $(".cm-hd", box), R = model({ mode:"set", P:12, L:0, syn:true }), lastKey = null, lastCap = -1;
  var CAPS = [
    "The inner mitochondrial membrane: the intermembrane space above, the matrix below.",
    "Pumps push H⁺ up into the intermembrane space until it’s crowded: pH 7 above, pH 8 below.",
    "H⁺ streams back down through ATP synthase, and its rotor turns.",
    "The head joins ADP and Pᵢ: ATP pops out into the matrix.",
    "Like water behind a dam turning a turbine, the H⁺ gradient drives ATP synthase.",
    "Pumps build an H⁺ gradient (pH 7 above, pH 8 below). H⁺ flowing back through ATP synthase turns its rotor, and ATP is made in the matrix."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  function scene(a, lvl, pH){ var k = f1(a) + "|" + Math.round(lvl) + "|" + pH; if (k === lastKey) return; lastKey = k; gS.innerHTML = grp(a, sceneSVG({ lvl:lvl, grad:pH ? "steady" : "none", pH:pH })); }
  function damBox(a, rot){
    if (a <= 0.02) { gD.innerHTML = ""; return; }
    gD.innerHTML = grp(a, '<g transform="translate(300 6) scale(0.82)">' + sv("rect", { x:-4, y:-4, width:268, height:130, rx:8, "class":"cm-dambg" }) + damSVG({ lvl:0.5, rot:rot, leak:false, pump:true, thru:true }) + "</g>");
  }
  function finalFrame(){ lastKey = null; scene(1, 22, true); gF.innerHTML = flowStaticSVG(R); gD.innerHTML = ""; setCap(5); }
  if (MV.reduceMotion) { finalFrame(); return; }
  function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
  function frameAt(T){
    var lvl = lerp(4, 22, seg(T, 1.2, 4)), pH = T >= 3.4, rot = T > 4 ? (T - 4) * 260 : 0;
    scene(seg(T, 0, 0.8), lvl, pH);
    setCap(T < 1 ? 0 : T < 4 ? 1 : T < 5.6 ? 2 : T < 8 ? 3 : T < 12 ? 4 : 5);
    var r = Object.assign({}, R, { thru:T > 4 ? 12 : 0, atp:T > 5.4 ? 3 : 0, pump:T > 1 ? 12 : 0 });
    gF.innerHTML = T < 0.8 ? "" : flowSVG(r, T, rot, Math.round(lvl), true);
    damBox(T < 8 ? 0 : T < 9 ? seg(T, 8, 9) : T < 11 ? 1 : 1 - seg(T, 11, 12), rot);
  }
  setCap(0); frameAt(0);
  MV.tween({ dur:12600, ease:lin, step:function(k){ frameAt(k * 12.6); }, done:finalFrame });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ arith:calc },
  task:task,
  onShow:function(v){ if (v === "explore" && EXR) EXR(); }
});
})();
