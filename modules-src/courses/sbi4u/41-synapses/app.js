// SBI4U 41 Synapses: hero (pulse → Ca²⁺ in → three vesicles burst → ACh crosses and binds → Na⁺ in, +10 mV bump → AChE snips),
// Synapse simulator (S4 membraneSim, synapse layout: terminal, cleft, receiving membrane; neuromuscular junction stepped through 6 steps
// with drug toggles; Summation mode with fading EPSP / IPSP triangles on a Plot trace), "Drugs at the synapse" (binding-site zoom,
// reuptake data with a Plot, enzyme-inhibitor / release-blocker cards), "Every input counts" task (steppers + hillock bars).
// Roles: Ca²⁺ --bio-fadh (cerulean), neurotransmitter --bio-h (magenta), Na⁺ --bio-nadh (teal), Cl⁻ --bio-carbon (brown),
// membrane traces --pen, threshold and rest --ink-2 dashed, drug shapes --ink outlines.
(function(){
"use strict";
var $ = MV.$;

// ---------- small SVG helpers (from SBI4U 17 / 06) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function seg(T, a, b){ return clamp((T - a) / (b - a), 0, 1); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "sy-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function op(v){ return v == null || v >= 1 ? null : f1(clamp(v, 0, 1) * 100) / 100; }
function grp(a, inner){ return a <= 0.02 ? "" : a < 0.98 ? '<g opacity="' + f1(a * 100) / 100 + '">' + inner + "</g>" : inner; }
function P(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return P(pts[i], pts[i + 1], k); } d -= segs[i]; }
  return pts[pts.length - 1];
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrow(x1, y1, x2, y2, cls){ var L = Math.hypot(x2 - x1, y2 - y1) || 1; return sv("path", { d:"M" + f1(x1) + " " + f1(y1) + " L" + f1(x2) + " " + f1(y2) + " " + head(x2, y2, (x2 - x1) / L, (y2 - y1) / L), "class":cls || "sy-arr" }); }
function dot(x, y, cls, r, o){ return sv("circle", { cx:x, cy:y, r:r || 3.4, "class":cls, opacity:op(o) }); }
function mV(v){ return MV.num(Math.round(v * 10) / 10); }
function signed(v){ return v >= 0 ? "+" + MV.num(v) : MV.num(v); }

// ---------- @component radioGroup (copied from SBI4U 17 / 13 / MHF4U 25: options may be disabled with dis:true) ----------
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

// ---------- @component stepper — − / + buttons around a live value (number stepper; plan: summation timings and task counts) ----------
// stepper(host, {id, label, min, max, value, fmt(v) -> text, onChange(v)}) -> {set(v), get()}
function stepper(host, o){
  var v = o.value;
  host.innerHTML = '<div class="sy-stp" role="group" aria-labelledby="' + o.id + '-l"><span class="sy-stp-l" id="' + o.id + '-l">' + o.label + '</span><span class="sy-stp-c">' +
    '<button type="button" class="btn ghost sm sy-stp-b" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc(MV.plain(o.label)) + ': less">−</button>' +
    '<output class="sy-stp-v" id="' + o.id + '-v" aria-live="polite"></output>' +
    '<button type="button" class="btn ghost sm sy-stp-b" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc(MV.plain(o.label)) + ': more">+</button></span></div>';
  var out = $("#" + o.id + "-v", host);
  function show(){ out.textContent = o.fmt(v); host.querySelector('[data-d="-1"]').disabled = v <= o.min; host.querySelector('[data-d="1"]').disabled = v >= o.max; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-d]"); if (!b || b.disabled) return;
    var nv = clamp(v + +b.dataset.d, o.min, o.max); if (nv === v) return;
    v = nv; show(); o.onChange(v);
    if (b.disabled) { var other = host.querySelector('[data-d="' + (-b.dataset.d) + '"]'); if (other) other.focus(); }
  });
  show();
  return { set:function(nv){ v = nv; show(); }, get:function(){ return v; } };
}

// ---------- @component S4 membraneSim — synapse layout (course plan S4): axon terminal above, synaptic cleft, receiving membrane below.
// Ca²⁺ channels in the terminal's side walls, vesicles holding ACh, receptor channels with binding cups, Na⁺ entry, acetylcholinesterase
// (ink scissors), drug shapes in --ink outline. nmjSVG(cond, step 0–6, k 0…1 within the step, o) -> SVG markup (viewBox 520 × 300).
// o = {ves:[{hx, hy, dx}], r, spread:[[x, y]], bind:{dotIndex:receptorIndex}, hero, labels, tag, vesHome} ----------
var TX0 = 90, TX1 = 430, TY1 = 134, CL1 = 174, RX = [150, 205, 260, 315, 370], CAY = 104, ACHE = [[110, 156], [410, 156]];
var FLAG = {
  none:{ imp:1 }, ca:{ imp:1, caBlock:1 }, rel:{ imp:1, relBlock:1 }, ant:{ imp:1, ant:1 }, ago:{ imp:0, ago:1 }, ache:{ imp:1, hold:1 }
};
var SIMV = (function(){
  var h = [], i; for (i = 0; i < 5; i++) h.push([160 + 50 * i, 66]); for (i = 0; i < 5; i++) h.push([185 + 50 * i, 98]);
  h.sort(function(a, b){ return a[0] - b[0]; });
  return h.map(function(p, i){ return { hx:p[0], hy:p[1], dx:150 + i * 25.5 }; });
})();
var HEROV = [{ hx:205, hy:76, dx:215 }, { hx:260, hy:64, dx:260 }, { hx:315, hy:76, dx:305 }];
function spreadPts(n, seed){ var r = MV.bio.rng(seed), out = []; for (var i = 0; i < n; i++) out.push([r.range(128, 392), r.range(143, 168)]); return out; }
var SPREAD = spreadPts(30, "sy-cleft"), HSPREAD = spreadPts(9, "sy-hero"), AGOP = spreadPts(6, "sy-ago");
var BIND = { 4:0, 10:1, 16:2, 22:3 }, HBIND = { 1:1, 4:2, 7:3 }, AGOB = { 0:0, 1:2, 2:4 };
var INNER = [[-4, -3], [4, -3], [0, 4]];

function baseSVG(o){
  var h = sv("rect", { x:0, y:0, width:520, height:300, "class":"sy-bg" });
  h += sv("path", { d:"M238 -2 L238 26 L120 26 Q90 26 90 56 L90 134 L430 134 L430 56 Q430 26 400 26 L282 26 L282 -2 Z", "class":"sy-cell" });
  h += sv("rect", { x:TX0, y:129, width:TX1 - TX0, height:6, "class":"sy-memb" });
  h += sv("rect", { x:TX0, y:136, width:TX1 - TX0, height:38, "class":"sy-cleft" });
  h += sv("rect", { x:0, y:CL1, width:520, height:12, "class":"sy-memb" }) + sv("rect", { x:0, y:186, width:520, height:114, "class":"sy-musc" });
  if (!o.hero) for (var x = 12; x < 520; x += 22) h += sv("line", { x1:x, y1:194, x2:x, y2:300, "class":"sy-stri" });
  return h;
}
function receptorSVG(x, open, lig){
  var g = 8 * clamp(open, 0, 1);
  var h = sv("rect", { x:x - 8 - g / 2, y:166, width:8, height:26, rx:2, "class":"sy-prot" }) + sv("rect", { x:x + g / 2, y:166, width:8, height:26, rx:2, "class":"sy-prot" });
  return h + sv("path", { d:"M" + (x - 11) + " 155 Q" + (x - 11) + " 168 " + x + " 168 Q" + (x + 11) + " 168 " + (x + 11) + " 155", "class":"sy-cup" }) + (lig || "");
}
function diamond(x, y, o){ return sv("path", { d:"M" + f1(x) + " " + f1(y - 6) + " L" + f1(x + 6) + " " + f1(y) + " L" + f1(x) + " " + f1(y + 6) + " L" + f1(x - 6) + " " + f1(y) + " Z", "class":"sy-drug", opacity:op(o) }); }
function antag(x, y){ return sv("rect", { x:x - 9, y:y - 7, width:18, height:13, rx:3, "class":"sy-drug2" }); }
function scissors(x, y, inh){
  var h = '<g class="sy-sc">' + sv("circle", { cx:x - 9, cy:y - 5, r:3.4 }) + sv("circle", { cx:x - 9, cy:y + 5, r:3.4 }) + sv("path", { d:"M" + (x - 6) + " " + (y - 3) + " L" + (x + 10) + " " + (y + 4) + " M" + (x - 6) + " " + (y + 3) + " L" + (x + 10) + " " + (y - 4) }) + "</g>";
  if (inh) h += sv("rect", { x:x - 3, y:y - 6, width:10, height:10, rx:2, "class":"sy-drug2" });
  return h;
}
function frag(x, y, f){ var o = op(1 - f), d = 2 + 6 * f; return sv("circle", { cx:x - d, cy:y + 3 * f, r:2, "class":"sy-nt", opacity:o }) + sv("circle", { cx:x + d, cy:y + 3 * f, r:2, "class":"sy-nt", opacity:o }); }
function caPath(c, j){
  var p = [[50 - j * 11, 90 + j * 13], [TX0 - 6, CAY], [TX0 + 10, CAY], [112 + j * 11, 110 + (j % 2) * 10]];
  return c ? p.map(function(q){ return [520 - q[0], q[1]]; }) : p;
}
function naPath(x, j){ return [[x + (j - 1) * 7, 146], [x, 166], [x, 194], [x + (j - 1) * 11, 210 + j * 12]]; }

function nmjSVG(cond, s, k, o){
  o = o || {};
  var F = FLAG[cond], V = o.ves || SIMV, R = o.r || 11, SP = o.spread || SPREAD, BD = o.bind || BIND;
  var caIn = F.imp && !F.caBlock, fuse = caIn && !F.relBlock, h = baseSVG(o);
  var opened = []; Object.keys(BD).forEach(function(i){ opened.push(BD[i]); });
  function after(n){ return s > n || (s === n && k >= 1); }
  // receptor openness
  function openOf(r){
    if (F.ago) { var bound = [0, 2, 4].indexOf(r) >= 0; if (!bound) return 0; return s === 5 ? seg(k, 0.4, 0.7) : s === 6 ? 1 - seg(k, 0.3, 0.7) : 0; }
    if (!fuse || F.ant || opened.indexOf(r) < 0) return 0;
    return s === 5 ? seg(k, 0.35, 0.6) : s === 6 ? (F.hold ? 1 : 1 - seg(k, 0.4, 0.8)) : 0;
  }
  RX.forEach(function(x, r){ h += receptorSVG(x, openOf(r), F.ant ? antag(x, 160) : ""); });
  ACHE.forEach(function(p){ h += scissors(p[0], p[1], F.hold); });
  // Ca²⁺ channels (side walls) and their plugs
  var caOpen = caIn ? (s > 2 ? 1 : s === 2 ? seg(k, 0, 0.3) : 0) : 0;
  [TX0, TX1].forEach(function(x){
    var g = 8 * caOpen;
    h += sv("rect", { x:x - 8, y:CAY - 8 - g / 2, width:16, height:8, rx:2, "class":"sy-prot" }) + sv("rect", { x:x - 8, y:CAY + g / 2, width:16, height:8, rx:2, "class":"sy-prot" });
    if (F.caBlock) h += sv("rect", { x:x < 260 ? x - 22 : x + 8, y:CAY - 7, width:14, height:14, rx:3, "class":"sy-drug2" });
  });
  // vesicles and the ACh they hold
  var dots = [];
  V.forEach(function(v, vi){
    var pos = [v.hx, v.hy], rr = R, f = 0, dockY = TY1 - 3 - R;
    if (!o.vesHome && caIn) {
      if (s === 3) pos = P([v.hx, v.hy], [v.dx, dockY], seg(k, 0, 0.5));
      else if (s > 3) pos = [v.dx, dockY];
      if (fuse && (s > 3 || (s === 3 && k > 0.5))) { f = s > 3 ? 1 : seg(k, 0.5, 1); rr = R * (1 - f); pos = [pos[0], pos[1] + 6 * f]; }
    }
    if (rr > 0.6) h += sv("circle", { cx:pos[0], cy:pos[1], r:rr, "class":"sy-ves" });
    if (F.relBlock && caIn && s >= 3 && !o.vesHome) h += sv("line", { x1:v.dx - 6, y1:TY1 - 1, x2:v.dx + 6, y2:TY1 - 1, "class":"sy-clamp", opacity:op(s === 3 ? seg(k, 0.4, 0.7) : 1) });
    INNER.forEach(function(d, j){
      var inside = [pos[0] + d[0] * R / 11, pos[1] + d[1] * R / 11], idx = vi * 3 + j;
      if (o.vesHome) { h += dot(v.hx + d[0] * R / 11, v.hy + d[1] * R / 11, "sy-nt", 2.6); if (fuse) dots.push(idx); return; }
      if (!fuse || s < 3 || (s === 3 && k <= 0.5)) { h += dot(inside[0], inside[1], "sy-nt", 2.6); return; }
      dots.push(idx);
    });
  });
  // released ACh: release point → spread in the cleft → receptor cups (or hovering, if blocked) → fragments
  dots.forEach(function(i){
    var v = V[Math.floor(i / 3)], j = i % 3, rel = [v.dx + (j - 1) * 7, 141], sp = SP[i], bnd = BD[i], p, q;
    var cup = bnd != null ? [RX[bnd], 162] : null, hover = [RX[i % 5] + ((Math.floor(i / 5) % 3) - 1) * 7, 148];
    if (o.vesHome && s < 4) return;
    if (s === 3) { var f = seg(k, 0.5, 1); p = P([v.dx + INNER[j][0] * R / 11, TY1 - 3 - R + INNER[j][1] * R / 11], rel, f); h += dot(p[0], p[1], "sy-nt", 3); return; }
    if (s === 4) { p = P(rel, sp, k); h += dot(p[0], p[1], "sy-nt", 3); return; }
    if (s === 5) { p = F.ant ? P(sp, hover, seg(k, 0, 0.6)) : cup ? P(sp, cup, seg(k, 0, 0.45)) : sp; h += dot(p[0], p[1], "sy-nt", 3); return; }
    q = F.ant ? hover : cup || sp;
    if (F.hold) { h += dot(q[0], q[1], "sy-nt", 3); return; }
    var ff = seg(k, 0.12 + (i % 5) * 0.07, 0.55 + (i % 5) * 0.07);
    h += ff <= 0 ? dot(q[0], q[1], "sy-nt", 3) : frag(q[0], q[1], ff);
  });
  // agonist shapes (nicotine-like): free in the cleft, three bind at step 5, drift off at step 6
  if (F.ago) AGOP.forEach(function(p, i){
    var b = AGOB[i], tgt = b != null ? [RX[b], 160] : null, q = p;
    if (tgt && s === 5) q = P(p, tgt, seg(k, 0, 0.45));
    else if (tgt && s === 6) q = P(tgt, p, seg(k, 0.3, 0.8));
    h += diamond(q[0], q[1]);
  });
  // Ca²⁺
  for (var c = 0; c < 2; c++) for (var j = 0; j < 3; j++) {
    var path = caPath(c, j), pr = !caIn ? 0 : s > 2 ? 1 : s === 2 ? seg(k, 0.15 + j * 0.1, 0.75 + j * 0.08) : 0, cp = polyAt(path, pr);
    if (F.caBlock && s === 2) cp = P(path[0], [c ? 452 : 68, CAY], Math.sin(k * Math.PI) * 0.6);
    h += dot(cp[0], cp[1], "sy-ca", 3.6);
  }
  // Na⁺ through the receptors that opened
  RX.forEach(function(x, r){
    var was = F.ago ? [0, 2, 4].indexOf(r) >= 0 : fuse && !F.ant && opened.indexOf(r) >= 0;
    if (!was || s < 5) return;
    for (var jn = 0; jn < 3; jn++) {
      var pa = naPath(x, jn), qq;
      if (s === 5) { qq = seg(k, 0.4 + jn * 0.08, 0.84 + jn * 0.08); if (qq <= 0) continue; var pt = polyAt(pa, qq); h += dot(pt[0], pt[1], "sy-na", 3.2); continue; }
      var end = pa[pa.length - 1]; h += dot(end[0], end[1], "sy-na", 3.2, F.hold ? 1 : 1 - 0.5 * k);
      if (F.hold) { qq = seg(k, jn * 0.15, 0.6 + jn * 0.15); if (qq > 0 && qq < 1) { var p2 = polyAt(pa, qq); h += dot(p2[0], p2[1], "sy-na", 3.2); } }
    }
  });
  // action potential pulse
  if (F.imp && s === 1) {
    var y = lerp(-8, 118, k);
    if (y < 32) h += sv("rect", { x:240, y:y - 7, width:40, height:14, rx:6, "class":"sy-pulse" });
    else h += sv("ellipse", { cx:260, cy:y, rx:lerp(24, 165, seg(y, 32, 118)), ry:8, "class":"sy-pulse" });
  }
  if (o.labels) h += labelsSVG(o);
  return h;
}
function labelsSVG(o){
  var h = txt(8, 72, "Ca²⁺", "sy-tb sy-halo") + txt(8, 86, "channels", "sy-tb sy-halo") + txt(8, 152, "synaptic", "sy-tb sy-halo") + txt(8, 166, "cleft", "sy-tb sy-halo");
  h += txt(422, 48, "vesicles", "sy-tb sy-halo", "end") + txt(384, 208, "receptors", "sy-tb sy-halo") + arrow(382, 204, 374, 196, "sy-lead");
  if (o.hero) h += txt(436, 152, "acetylcholin-", "sy-ts sy-halo") + txt(436, 165, "esterase", "sy-ts sy-halo") + txt(10, 292, "receiving cell", "sy-tb sy-halo");
  else {
    h += txt(292, 16, "axon terminal", "sy-tb sy-halo") + txt(436, 160, "AChE", "sy-tb sy-halo") + txt(10, 292, "muscle fibre", "sy-tb sy-halo");
    if (o.tag) h += txt(512, 292, o.tag, "sy-ts sy-halo sy-tag", "end");
  }
  return h;
}

// ---------- Summation model (plan §4): EPSP +10 mV and IPSP −5 mV, each fading evenly to 0 over 10 ms; hillock = −70 + what remains ----------
function events(st){
  var e = [{ t:0, a:10, n:"E1" }];
  if (st.g >= 0) e.push({ t:st.g, a:10, n:"E1" });
  if (st.t2 >= 0) e.push({ t:st.t2, a:10, n:"E2" });
  if (st.ti >= 0) e.push({ t:st.ti, a:-5, n:"I1" });
  return e;
}
function vAt(ev, t, incl){ var v = -70; ev.forEach(function(e){ var d = t - e.t; if (d > 0 || (incl && d === 0)) v += e.a * Math.max(0, 1 - d / 10); }); return v; }
function peakOf(ev, T){
  T = T == null ? 20 : T;
  var ts = [0, T]; ev.forEach(function(e){ ts.push(e.t, e.t + 10); });
  var best = null;
  ts.filter(function(t){ return t <= T + 1e-9; }).sort(function(a, b){ return a - b; }).forEach(function(t){ var v = vAt(ev, t, true); if (!best || v > best.v + 1e-9) best = { v:v, t:t }; });
  return best;
}
function sumPts(ev){
  var ts = [0, 20]; ev.forEach(function(e){ ts.push(e.t); if (e.t + 10 <= 20) ts.push(e.t + 10); });
  ts = ts.filter(function(t, i){ return ts.indexOf(t) === i; }).sort(function(a, b){ return a - b; });
  var pts = [];
  ts.forEach(function(t){ var jump = ev.some(function(e){ return e.t === t; }); if (jump) pts.push([t, vAt(ev, t, false)]); pts.push([t, vAt(ev, t, true)]); });
  return pts;
}
function cut(pts, tv){
  var out = [];
  for (var i = 0; i < pts.length; i++) {
    if (pts[i][0] <= tv + 1e-9) { out.push(pts[i]); continue; }
    if (i > 0 && pts[i - 1][0] < tv) out.push(P(pts[i - 1], pts[i], (tv - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])));
    break;
  }
  return out;
}
// neuromuscular junction: muscle-membrane trace (model: −40 mV peak; held with the enzyme inhibitor; agonist −45 mV)
var VM = {
  none:[[0, -70], [1, -70], [1.5, -40], [3, -70], [20, -70]],
  ache:[[0, -70], [1, -70], [1.5, -40], [20, -40]],
  ago:[[0, -70], [1, -70], [1.5, -45], [6, -70], [20, -70]],
  flat:[[0, -70], [20, -70]]
};
var TSTEP = [0, 0.3, 0.6, 0.9, 1.0, 2.0, 20];

// neuron with three input synapses (Summation mode), viewBox 520 × 300
var SYN = { E1:{ b:[206, 110], a:[[0, 52], [194, 102]], lab:[8, 40] }, E2:{ b:[206, 206], a:[[0, 268], [194, 214]], lab:[8, 292] }, I1:{ b:[300, 82], a:[[300, -2], [300, 66]], lab:[312, 20] } };
function sumSVG(ev, t, show, st){
  var h = sv("rect", { x:0, y:0, width:520, height:300, "class":"sy-bg" });
  Object.keys(SYN).forEach(function(n){ var q = SYN[n]; h += sv("line", { x1:q.a[0][0], y1:q.a[0][1], x2:q.a[1][0], y2:q.a[1][1], "class":"sy-axon" }); });
  h += sv("path", { d:"M350 138 L394 152 L520 152 L520 164 L394 164 L350 178 Z", "class":"sy-cell" }) + sv("circle", { cx:300, cy:158, r:58, "class":"sy-cell" });
  h += txt(372, 200, "axon hillock", "sy-tb sy-halo", "middle") + txt(300, 162, "cell body", "sy-ts", "middle");
  var times = { E1:"0 ms" + (st.g >= 0 ? " and " + st.g + " ms" : ""), E2:st.t2 >= 0 ? st.t2 + " ms" : "off", I1:st.ti >= 0 ? st.ti + " ms" : "off" };
  Object.keys(SYN).forEach(function(n){
    var q = SYN[n], ex = n !== "I1", fire = ev.filter(function(e){ return e.n === n && t >= e.t && t <= e.t + 1.6 && t < 20; }), on = fire.length > 0, off = n !== "E1" && times[n] === "off";
    h += sv("circle", { cx:q.b[0], cy:q.b[1], r:15, "class":(ex ? "sy-syn-e" : "sy-syn-i") + (on ? " on" : "") + (off ? " off" : "") });
    h += txt(q.lab[0], q.lab[1], n + (ex ? " (excitatory)" : " (inhibitory)") + ": " + times[n], "sy-tb sy-halo");
    if (on) {
      var kk = (t - fire[0].t) / 1.6, cx = 300, cy = 158;
      for (var j = 0; j < 3; j++) { var p = P([q.b[0] + (j - 1) * 6, q.b[1] + (j - 1) * 4], [lerp(q.b[0], cx, 0.55) + (j - 1) * 6, lerp(q.b[1], cy, 0.55)], kk); h += dot(p[0], p[1], ex ? "sy-na" : "sy-cl", 3.4); }
      h += txt(q.b[0] + (n === "I1" ? 22 : 4), q.b[1] + (n === "I1" ? 4 : n === "E1" ? -22 : 32), ex ? "+10 mV" : MV.MINUS + "5 mV", "sy-tb sy-halo");
    }
  });
  if (show) {
    var v = vAt(ev, Math.min(t, 20), true), pk = peakOf(ev, t), fired = pk.v >= -55 - 1e-9;
    h += txt(372, 128, mV(v) + " mV", "sy-tv sy-halo", "middle");
    if (fired) h += sv("rect", { x:400, y:150, width:112, height:16, rx:7, "class":"sy-pulse" }) + txt(456, 142, "fires!", "sy-tb sy-halo", "middle");
  }
  return h;
}

var LEG = {
  nmj:'<span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="sy-ca"/></svg>Ca²⁺</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="sy-nt"/></svg>ACh (neurotransmitter)</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" class="sy-na"/></svg>Na⁺</span><span><svg viewBox="0 0 22 14" aria-hidden="true"><rect x="2" y="2" width="18" height="10" rx="3" class="sy-drug2"/></svg>drug (outlined)</span><span><svg viewBox="0 0 22 14" aria-hidden="true"><g class="sy-sc"><circle cx="5" cy="4" r="2.6"/><circle cx="5" cy="10" r="2.6"/><path d="M7 5 L19 9 M7 9 L19 5"/></g></svg>AChE = acetylcholinesterase</span>',
  sum:'<span><svg viewBox="0 0 22 14" aria-hidden="true"><path d="M2 12 L2 2 L20 12" class="sy-lg-e"/></svg>EPSP (Na⁺ in)</span><span><svg viewBox="0 0 22 14" aria-hidden="true"><path d="M2 2 L2 12 L20 2" class="sy-lg-i"/></svg>IPSP (Cl⁻ in)</span><span><svg viewBox="0 0 22 14" aria-hidden="true"><path d="M2 7 L20 7" class="sy-lg-s"/></svg>sum at the hillock</span>'
};

// ---------- Explore: Synapse simulator ----------
function explore(host, api){
  var C = api.content, S = api.S, NM = C.nmj;
  var D0 = { mode:"nmj", drug:"none", step:0, g:-1, t2:-1, ti:-1 };
  Object.keys(D0).forEach(function(q){ if (S[q] === undefined) S[q] = D0[q]; });
  var k = 1, tP = 20, hide = false, anim = null, pend = null, readSig = "";
  host.innerHTML = '<div class="pg sy-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="sy-stage"><svg id="sy-svg" viewBox="0 0 520 300" role="img" focusable="false"></svg></div>' +
    '<p class="sy-legend tiny" id="sy-leg"></p><p class="sy-cap" id="sy-cap" aria-live="polite"></p>' +
    '<div class="plot-wrap sy-trw"><canvas class="plot wide" id="sy-plot" role="img"></canvas></div></div>' +
    '<div class="pg-ctrl"><div id="sy-mode"></div>' +
    '<div id="sy-nc" class="sy-ctl"><div class="sy-btns" role="group" aria-label="Steps"><button type="button" class="btn ghost sm" id="sy-back" data-k="syback">← Back</button><button type="button" class="btn sm" id="sy-step" data-k="systep">Step →</button><button type="button" class="btn primary sm" id="sy-play" data-k="syplay">▶ Play</button></div><div id="sy-drug" class="sy-drugs"></div></div>' +
    '<div id="sy-sc" class="sy-ctl"><p class="tiny sy-e1">E1 fires at 0 ms (always on).</p><div id="sy-g"></div><div id="sy-t2"></div><div id="sy-ti"></div><div class="sy-btns"><button type="button" class="btn primary sm" id="sy-splay" data-k="sysplay">▶ Play</button></div></div></div>' +
    '<div class="pg-read"><dl class="read" id="sy-read" aria-live="polite"></dl><p class="tiny sy-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var svg = $("#sy-svg", host), readEl = $("#sy-read", host), capEl = $("#sy-cap", host);
  function save(){ api.save(); }
  var modeR = radios($("#sy-mode", host), { label:"Mode", key:"m", options:C.modes.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.mode, onChange:function(v){ stop(); S.mode = v; hide = false; save(); paint(); MV.changed(); } });
  var drugR = radios($("#sy-drug", host), { label:"Drug or toxin (one at a time)", key:"d", cls:"chips", options:C.drugs.map(function(m){ return { id:m[0], t:m[1] }; }), value:S.drug, onChange:function(v){ stop(); S.drug = v; save(); paint(); MV.changed(); } });
  function fmtT(v){ return v < 0 ? "off" : v + " ms"; }
  function setSum(key, v){ stop(); S[key] = v; hide = false; save(); paint(); MV.changed(); }
  var stG = stepper($("#sy-g", host), { id:"sy-sg", label:"E1 fires again after a gap of", min:-1, max:10, value:S.g, fmt:fmtT, onChange:function(v){ setSum("g", v); } });
  var stE = stepper($("#sy-t2", host), { id:"sy-se", label:"E2 fires at", min:-1, max:10, value:S.t2, fmt:fmtT, onChange:function(v){ setSum("t2", v); } });
  var stI = stepper($("#sy-ti", host), { id:"sy-si", label:"I1 (inhibitory) fires at", min:-1, max:10, value:S.ti, fmt:fmtT, onChange:function(v){ setSum("ti", v); } });
  function syncCtl(){ modeR.set(S.mode); drugR.set(S.drug); stG.set(S.g); stE.set(S.t2); stI.set(S.ti); }

  var plot = new MV.Plot($("#sy-plot", host), { xmin:0, xmax:20, ymin:-80, ymax:-35 });
  plot.render = function(){ plot.draw(traceScene()); };
  function traceScene(){
    var css = MV.css, pen = css("--pen"), ink2 = css("--ink-2"), na = css("--bio-nadh"), cl = css("--bio-carbon");
    var sc = { view:{ xmin:0, xmax:20, ymin:-80, ymax:-35 }, xTicks:{ step:2 }, yTicks:{ step:5 }, xLabel:"time (ms)", yLabel:"mV",
      segments:[{ x1:0, y1:-55, x2:20, y2:-55, color:ink2, width:1.5, dash:[6, 5] }, { x1:0, y1:-70, x2:20, y2:-70, color:ink2, width:1.5, dash:[6, 5] }],
      labels:[{ x:19.8, y:-55, text:"threshold " + MV.MINUS + "55 mV", color:ink2, align:"right", dy:-9, bg:true }, { x:19.8, y:-70, text:"rest " + MV.MINUS + "70 mV", color:ink2, align:"right", dy:14, bg:true }],
      curves:[], points:[] };
    if (S.mode === "nmj") {
      var tv = S.step ? lerp(TSTEP[S.step - 1], TSTEP[S.step], k) : 0, base = VM[S.drug] || VM.flat;
      if (tv > 0) sc.curves.push({ pts:cut(base, tv), color:pen, width:3 });
      sc.labels.push({ x:0.3, y:-37.5, text:"Postsynaptic (muscle) membrane", color:pen, align:"left", bg:true });
      sc.describe = "Trace of the muscle membrane potential over 20 ms, with dashed lines at threshold (−55 mV) and rest (−70 mV). " + (tv > 0 ? "Drawn up to " + mV(tv) + " ms: " + NM[S.drug].mem + "." : "Nothing has happened yet.");
      return sc;
    }
    if (hide) { sc.describe = "Summation trace, hidden until you make your prediction."; return sc; }
    var ev = events(S), pk = peakOf(ev, tP);
    ev.forEach(function(e){
      if (e.t > tP) return;
      sc.curves.push({ pts:cut([[e.t, -70], [e.t, -70 + e.a], [e.t + 10, -70]], tP), color:e.a > 0 ? na : cl, width:1.8 });
      sc.labels.push({ x:e.t, y:-70 + e.a, text:e.n, color:e.a > 0 ? na : cl, align:"left", dx:4, dy:e.a > 0 ? -6 : 14, bg:true });
    });
    sc.curves.push({ pts:cut(sumPts(ev), tP), color:pen, width:3.4 });
    sc.points.push({ x:pk.t, y:pk.v, r:5, color:pen });
    sc.labels.push({ x:pk.t, y:pk.v, text:"peak " + mV(pk.v) + " mV", color:pen, align:pk.t > 14 ? "right" : "left", dx:pk.t > 14 ? -8 : 8, dy:-8, bg:true });
    sc.describe = "Summation trace from 0 to " + mV(tP) + " ms. Each EPSP is a +10 mV triangle fading over 10 ms, each IPSP a −5 mV triangle. The thick line is their sum at the hillock; it peaks at " + mV(pk.v) + " mV at " + mV(pk.t) + " ms, so the neuron " + (pk.v >= -55 ? "fires." : "doesn’t fire.");
    return sc;
  }
  function caption(){
    if (S.mode === "nmj") return NM[S.drug].caps[S.step];
    if (hide) return C.sumIdle;
    var ev = events(S), pk = peakOf(ev, tP);
    if (tP < 20) return "Playing: " + MV.num(Math.floor(tP)) + " ms. Hillock now " + mV(vAt(ev, tP, true)) + " mV.";
    return "Hillock peak " + mV(pk.v) + " mV at " + mV(pk.t) + " ms: " + (pk.v >= -55 ? "it reaches threshold, so the neuron <strong>fires</strong>." : "below threshold, so the neuron doesn’t fire.");
  }
  function rows(){
    if (S.mode === "nmj") {
      var N = NM[S.drug], s = S.step, D = "—";
      return [["Step", s ? s + " of 6: “" + C.steps[s - 1] + "”" : "Ready (0 of 6)"], ["Ca²⁺ in terminal", s >= 2 ? N.ca : D], ["Vesicles released", s >= 3 ? N.ves : D],
        ["ACh in cleft", s >= 6 ? N.ach6 : s >= 4 ? N.ach : D], ["Receptors bound", s >= 6 && N.rec6 ? N.rec6 : s >= 5 ? N.rec : D],
        ["Postsynaptic membrane", s >= 6 && N.mem6 ? N.mem6 : s >= 5 ? N.mem : D], ["Result", s >= 6 ? N.res : s >= 5 ? (N.res5 || N.res) : D], ["ACh cleared by", s >= 6 ? N.clr : D]];
    }
    var ev = events(S), pk = peakOf(ev, tP), Q = "? (make your prediction)";
    return [["E1 fires at", "0 ms" + (S.g >= 0 ? " and " + S.g + " ms" : "")], ["E2 fires at", fmtT(S.t2)], ["I1 fires at", fmtT(S.ti)],
      ["Time shown", hide ? Q : tP < 20 ? "0 to " + MV.num(Math.floor(tP)) + " ms" : "0 to 20 ms"],
      ["Hillock peak", hide ? Q : mV(pk.v) + " mV at " + mV(pk.t) + " ms: " + (pk.v >= -55 - 1e-9 ? "<strong>fires</strong>" : "doesn’t fire")]];
  }
  function draw(){
    svg.innerHTML = S.mode === "nmj" ? nmjSVG(S.drug, S.step, k, { labels:true, tag:S.drug === "none" ? "" : C.drugTag[S.drug] }) : sumSVG(events(S), tP, !hide, S);
    var c = caption(); if (capEl.innerHTML !== c) capEl.innerHTML = c;
    svg.setAttribute("aria-label", (S.mode === "nmj" ? "Neuromuscular junction: axon terminal above, synaptic cleft, muscle fibre below. " : "A neuron with input synapses E1, E2 (excitatory) and I1 (inhibitory) and an axon hillock. ") + MV.plain(c));
    var r = rows(), sig = JSON.stringify(r); if (sig !== readSig) { readSig = sig; readEl.innerHTML = MV.readoutHTML(r); }
    plot.render();
  }
  function paint(){
    $("#sy-nc", host).hidden = S.mode !== "nmj"; $("#sy-sc", host).hidden = S.mode !== "sum";
    $("#sy-leg", host).innerHTML = LEG[S.mode];
    $("#sy-back", host).disabled = S.step <= 0;
    draw();
  }
  function stop(){
    if (anim) { anim(); anim = null; }
    k = 1; tP = 20; readEl.setAttribute("aria-live", "polite");
    if (pend) { var d = pend; pend = null; d(); }
  }
  function animateStep(cb){
    k = 0; readEl.setAttribute("aria-live", "off"); draw();
    anim = MV.tween({ dur:1400, ease:lin, step:function(kk){ k = kk; draw(); }, done:function(){ anim = null; k = 1; readEl.setAttribute("aria-live", "polite"); paint(); if (cb) cb(); } });
  }
  function playFrom(cb){
    function next(){ if (S.step >= 6) { if (cb) cb(); return; } S.step++; save(); $("#sy-back", host).disabled = false; animateStep(next); }
    next();
  }
  function playSum(cb){
    tP = 0; readEl.setAttribute("aria-live", "off");
    anim = MV.tween({ dur:3400, ease:lin, step:function(kk){ tP = 20 * kk; draw(); }, done:function(){ anim = null; tP = 20; readEl.setAttribute("aria-live", "polite"); paint(); if (cb) cb(); } });
  }
  $("#sy-back", host).addEventListener("click", function(){ stop(); S.step = Math.max(0, S.step - 1); save(); paint(); if (S.step === 0) $("#sy-step", host).focus(); });
  $("#sy-step", host).addEventListener("click", function(){ stop(); if (S.step >= 6) { S.step = 0; save(); paint(); return; } S.step++; save(); paint(); animateStep(null); });
  $("#sy-play", host).addEventListener("click", function(){ stop(); if (S.step >= 6) S.step = 0; save(); paint(); playFrom(null); });
  $("#sy-splay", host).addEventListener("click", function(){ stop(); hide = false; paint(); playSum(null); });
  paint();

  function chal(id){
    var c = byId(C.challenges, id), W = c.wrong;
    if (id === "tc2") {
      if (S.mode !== "nmj") return { ok:false, msg:W.mode };
      var d = S.drug;
      if (d === "ant") return { ok:true };
      if (d === "ca" || d === "rel") return { ok:false, msg:W.noRelease };
      if (d === "ache") return { ok:false, msg:W.ache };
      if (d === "ago") return { ok:false, msg:W.ago };
      return { ok:false, msg:W.none };
    }
    if (S.mode !== "sum") return { ok:false, msg:W.mode };
    if (id === "tc1") {
      if (S.t2 >= 0 || S.ti >= 0) return { ok:false, msg:W.others };
      if (S.g < 0) return { ok:false, msg:W.off };
      if (S.g === 5) return { ok:true };
      if (S.g === 6) return { ok:false, msg:W.g6 };
      if (S.g < 5) return { ok:false, msg:W.short };
      var left = 10 - S.g;
      return { ok:false, msg:"E1 has faded to +" + left + ", so " + left + " + 10 = " + (left + 10) + ": " + MV.num(-70 + left + 10) + " mV, short." };
    }
    if (id === "tc3") {
      if (S.g >= 0) return { ok:false, msg:W.gap };
      if (S.t2 < 0) return { ok:false, msg:W.e2 };
      if (S.ti < 0) return { ok:false, msg:W.i1 };
      if (S.t2 !== S.ti) return { ok:false, msg:W.apart };
      var t = S.t2;
      if (t === 0) return { ok:true };
      if (t === 5) return { ok:false, msg:W.t5 };
      if (t === 1) return { ok:false, msg:W.t1 };
      var l3 = Math.max(0, 10 - t);
      return { ok:false, msg:l3 + " + 10 " + MV.MINUS + " 5 = " + (l3 + 5) + ": " + MV.num(-70 + l3 + 5) + " mV." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop();
        Object.keys(p.start).forEach(function(q){ S[q] = p.start[q]; });
        if (S.mode === "nmj") S.step = 0; else hide = true;
        save(); syncCtl(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.to) Object.keys(p.to).forEach(function(q){ S[q] = p.to[q]; });
        save(); syncCtl(); MV.changed();
        function fin(){ var d = pend; pend = null; paint(); if (d) MV.wait(400, d); }
        if (S.mode === "nmj") { S.step = 0; paint(); playFrom(fin); }
        else { hide = false; paint(); playSum(fin); }
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Drugs at the synapse ----------
// @component bindingZoom — "Zoom to the molecules": a receptor's binding pocket (V notch) over its channel; the transmitter, an agonist and
// an antagonist share the same key tab, so all fit; only the transmitter and agonist open the channel. Placed from a list (Enter works).
function zoomSVG(cur, kk){
  var h = sv("rect", { x:0, y:0, width:360, height:230, "class":"sy-bg" }) + sv("rect", { x:0, y:112, width:360, height:40, "class":"sy-memb" }) + sv("rect", { x:0, y:152, width:360, height:78, "class":"sy-musc" });
  h += txt(8, 18, "outside: the synaptic cleft", "sy-tb sy-halo") + txt(8, 136, "membrane", "sy-ts sy-halo") + txt(8, 222, "inside the receiving cell", "sy-tb sy-halo");
  var seated = cur && kk >= 1, open = seated && cur !== "an" ? 1 : 0, g = 9 * open;
  h += sv("polygon", { points:[[140 - g, 72], [168 - g, 72], [180 - g, 92], [180 - g, 172], [140 - g, 172]].join(" "), "class":"sy-prot" });
  h += sv("polygon", { points:[[192 + g, 72], [220 + g, 72], [220 + g, 172], [180 + g, 172], [180 + g, 92]].join(" "), "class":"sy-prot" });
  h += txt(240, 60, "binding site", "sy-tb sy-halo") + arrow(238, 64, 196, 80, "sy-lead");
  h += txt(240, 192, "channel: " + (open ? "open" : "shut"), "sy-tb sy-halo");
  if (open) { [104, 128, 152, 176].forEach(function(y, i){ h += dot(180, y + (i % 2) * 4, "sy-na", 4); }); h += arrow(180, 186, 180, 212, "sy-arr sy-arr-na") + txt(194, 214, "Na⁺ in", "sy-tb sy-halo"); }
  if (cur) {
    var cx = 180, cy = lerp(-30, 52, kk), tab = sv("polygon", { points:[[cx - 12, cy + 20], [cx + 12, cy + 20], [cx, cy + 40]].join(" "), "class":cur === "tx" ? "sy-ntf" : cur === "an" ? "sy-drug2" : "sy-drug" });
    if (cur === "tx") h += tab + sv("circle", { cx:cx, cy:cy + 4, r:16, "class":"sy-ntf" }) + txt(cx, cy + 9, "ACh", "sy-tw", "middle");
    else if (cur === "ag") h += tab + sv("rect", { x:cx - 14, y:cy - 10, width:28, height:30, rx:3, "class":"sy-drug" }) + txt(cx + 22, cy + 2, "agonist", "sy-tb sy-halo");
    else {
      h += tab + sv("rect", { x:cx - 38, y:cy - 4, width:76, height:24, rx:5, "class":"sy-drug2" }) + txt(cx, cy - 10, "antagonist", "sy-tb sy-halo", "middle");
      if (seated) h += sv("path", { d:"M290 92 l6 6 M296 92 l-6 6", "class":"sy-x" }) + sv("polygon", { points:[[288, 52], [312, 52], [300, 72]].join(" "), "class":"sy-ntf" }) + sv("circle", { cx:300, cy:36, r:16, "class":"sy-ntf" }) + txt(300, 41, "ACh", "sy-tw", "middle") + txt(300, 112, "can’t bind", "sy-tb sy-halo", "middle");
    }
  }
  return h;
}
function part3(host, api){
  var C = api.content, S = api.S, Z = C.zoom, Dd = C.data, M3 = C.more;
  S.z = S.z || { cur:null, tried:{} }; S.q = S.q || {};
  var zk = 1, zanim = null;
  function cardsHTML(list){ return '<div class="sy-cards">' + list.map(function(c){ return '<article class="sy-card"><h4>' + c.t + "</h4>" + (c.step ? '<p class="tiny sy-stepl">' + c.step + "</p>" : "") + "<p>" + c.d + "</p></article>"; }).join("") + "</div>"; }
  host.innerHTML = '<div class="sy-p3">' +
    '<section class="sy-st"><h3>' + Z.title + '</h3><details class="alg" open><summary>' + Z.panel + '</summary><p class="tiny">' + Z.how + '</p><div class="sy-zoom"><div class="sy-zstage"><svg id="sy-zsvg" viewBox="0 0 360 230" role="img" focusable="false"></svg></div>' +
      '<div class="sy-zctl"><ul class="sy-zlist" aria-label="Molecules to place">' + Z.shapes.map(function(s){ return '<li><button type="button" class="btn sm sy-zb" data-z="' + s.id + '" data-k="syz' + s.id + '">' + s.t + "</button></li>"; }).join("") + '</ul><button type="button" class="btn ghost sm" id="sy-zclr" data-k="syzclr">Empty the binding site</button></div></div><div id="sy-zfb" aria-live="polite"></div></details>' + cardsHTML(Z.cards) + "</section>" +
    '<section class="sy-st"><h3>' + Dd.title + '</h3><details class="alg" open><summary>' + Dd.panel + "</summary><p>" + Dd.intro + "</p>" +
      '<p class="tiny"><span class="bio-model">Model data</span> ' + Dd.caption + "</p>" + MV.tableHTML({ caption:Dd.caption, head:["Time after release (ms)"].concat(Dd.times.map(String)), rows:[[Dd.rowN].concat(Dd.normal.map(String)), [Dd.rowI].concat(Dd.inhib.map(String))] }) +
      '<div class="plot-wrap"><canvas class="plot" id="sy-dplot" role="img"></canvas></div><p class="tiny muted">Dashes: normal · solid magenta: with a reuptake inhibitor · dotted line: 50 AU</p><div id="sy-dq"></div><p>' + Dd.text + "</p></details></section>" +
    '<section class="sy-st"><h3>' + M3.title + "</h3>" + cardsHTML(M3.cards) + "</section></div>";

  // Station 1
  var zsvg = $("#sy-zsvg", host);
  function paintZ(){
    zsvg.innerHTML = zoomSVG(S.z.cur, zk);
    var sh = S.z.cur ? byId(Z.shapes, S.z.cur) : null, n = Object.keys(S.z.tried).length;
    zsvg.setAttribute("aria-label", "A receptor in the membrane, with a V-shaped binding site on top and its channel below. " + (sh ? MV.plain(sh.t) + " is in the binding site. " + MV.plain(sh.res) : MV.plain(Z.empty)));
    if (zk >= 1) $("#sy-zfb", host).innerHTML = sh ? MV.fbHTML(S.z.cur === "an" ? "" : "good", sh.res + (n >= 3 ? " <strong>All three tried.</strong> " + Z.all : "")) : '<p class="tiny muted">' + Z.empty + "</p>";
    $$b().forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.z === S.z.cur)); });
  }
  function $$b(){ return Array.prototype.slice.call(host.querySelectorAll("[data-z]")); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-z]");
    if (b) {
      if (zanim) { zanim(); zanim = null; }
      S.z.cur = b.dataset.z; S.z.tried[b.dataset.z] = 1; api.save(); zk = 0; paintZ();
      zanim = MV.tween({ dur:800, step:function(t){ zk = t; paintZ(); }, done:function(){ zanim = null; zk = 1; paintZ(); } });
      return;
    }
    if (e.target.closest("#sy-zclr")) { if (zanim) { zanim(); zanim = null; } zk = 1; S.z.cur = null; api.save(); paintZ(); }
  });
  paintZ();

  // Station 2: plot + two reading questions
  var plot = new MV.Plot($("#sy-dplot", host), { xmin:0, xmax:20, ymin:0, ymax:110 });
  plot.render = function(){
    var css = MV.css, ink2 = css("--ink-2"), nt = css("--bio-h"), ink = css("--ink");
    var pN = Dd.times.map(function(t, i){ return [t, Dd.normal[i]]; }), pI = Dd.times.map(function(t, i){ return [t, Dd.inhib[i]]; });
    plot.draw({ view:{ xmin:0, xmax:20, ymin:0, ymax:110 }, xTicks:{ step:2 }, yTicks:{ step:10 }, xLabel:"time after release (ms)", yLabel:"serotonin (AU)",
      segments:[{ x1:0, y1:50, x2:20, y2:50, color:ink, width:1.4, dash:[2, 4] }],
      curves:[{ pts:pN, color:ink2, width:2.6, dash:[7, 5] }, { pts:pI, color:nt, width:3 }],
      points:pN.map(function(p){ return { x:p[0], y:p[1], r:4, color:ink2 }; }).concat(pI.map(function(p){ return { x:p[0], y:p[1], r:4, color:nt }; })),
      labels:[{ x:19.8, y:50, text:"50 AU", color:ink, align:"right", dy:-8, bg:true }, { x:5, y:10, text:Dd.rowN.toLowerCase(), color:ink2, align:"left", dx:8, dy:-6, bg:true }, { x:10, y:45, text:Dd.rowI.toLowerCase(), color:nt, align:"left", dx:8, dy:-8, bg:true }],
      describe:Dd.describe });
  };
  plot.render();
  var dq = $("#sy-dq", host), qmsg = {};
  function paintQ(){
    MV.keepFocus(dq, function(){
      dq.innerHTML = Dd.qs.map(function(q){
        var x = S.q[q.id] || {}, h = '<div class="q sy-dq" data-dq="' + q.id + '"><p class="q-prompt">' + q.prompt + '</p><div class="chips" role="group" aria-label="Choices">';
        h += q.choices.map(function(c, i){ var on = x.pick === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-qi="' + i + '" data-k="sydq' + q.id + i + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
        if (x.pick != null) { var ch = q.choices[x.pick]; h += MV.fbHTML(MV.ok(ch) ? "good" : "bad", (MV.ok(ch) ? "" : "<strong>✗ Not quite.</strong> ") + ch.fb + (MV.ok(ch) ? "" : " Try again.")); }
        return h + "</div>";
      }).join("");
    });
  }
  dq.addEventListener("click", function(e){
    var b = e.target.closest("[data-qi]"); if (!b || b.disabled) return;
    var box = b.closest("[data-dq]"), q = byId(Dd.qs, box.dataset.dq), x = S.q[q.id] || (S.q[q.id] = { tries:0 });
    x.pick = +b.dataset.qi; if (MV.ok(q.choices[x.pick])) x.solved = true; else x.tries = (x.tries || 0) + 1;
    api.save(); paintQ(); MV.focusFb(dq.querySelector('[data-dq="' + q.id + '"]'));
  });
  paintQ();
}

// ---------- Performance task: Every input counts (two steppers + hillock bars) ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (s.e == null) s.e = 0; if (s.i == null) s.i = 0; return s; }
  function read(){ if (!api) return { e:0, i:0 }; var s = st(); return { e:+s.e, i:+s.i }; }
  function net(e, i){ return 10 * e - 5 * i; }
  function X(v){ return 30 + (clamp(v, -90, -15) + 90) / 75 * 310; }
  function bar(y, v, lab, cls){
    var x0 = X(-70), x1 = X(v);
    return txt(30, y - 6, lab, "sy-tb") + txt(352, y - 6, mV(v) + " mV" + (v >= -55 ? ": fires" : ""), "sy-tb", "end") +
      sv("rect", { x:Math.min(x0, x1), y:y, width:Math.max(1.5, Math.abs(x1 - x0)), height:20, rx:3, "class":cls });
  }
  function draw(){
    var d = read(), n = net(d.e, d.i), v = -70 + n, svgT = $("#sy-tsvg"); if (!svgT) return;
    var h = sv("rect", { x:0, y:0, width:360, height:170, "class":"sy-bg" });
    [-90, -70, -55, -30].forEach(function(t){ h += sv("line", { x1:X(t), y1:152, x2:X(t), y2:158, "class":"sy-tick" }) + txt(X(t), 168, MV.num(t), "sy-ts", "middle"); });
    h += sv("line", { x1:X(-90), y1:152, x2:X(-15), y2:152, "class":"sy-tick" }) + sv("line", { x1:X(-55), y1:18, x2:X(-55), y2:152, "class":"sy-thr" }) + txt(X(-55) + 4, 14, "threshold", "sy-ts");
    h += sv("line", { x1:X(-70), y1:30, x2:X(-70), y2:152, "class":"sy-restl" });
    h += bar(44, v, "All chosen inputs", "sy-bar");
    if (d.e > 0) h += bar(110, -70 + net(d.e - 1, d.i), "One excitatory input silenced", "sy-bar2");
    else h += txt(30, 120, "No excitatory input to silence.", "sy-ts");
    svgT.innerHTML = h;
    svgT.setAttribute("aria-label", "Hillock bars from rest at −70 mV with the threshold at −55 mV. All chosen inputs: " + MV.plain(mV(v)) + " mV." + (d.e > 0 ? " With one excitatory input silenced: " + MV.plain(mV(-70 + net(d.e - 1, d.i))) + " mV." : ""));
    $("#sy-tread").innerHTML = MV.readoutHTML([["Net change", signed(n) + " mV"], ["Hillock", mV(v) + " mV: " + (v >= -55 ? "fires" : "doesn’t fire")],
      ["One excitatory input silenced", d.e > 0 ? mV(v - 10) + " mV: " + (v - 10 >= -55 ? "still fires" : "doesn’t fire") : "—"]]);
  }
  function parse(key){ var m = /e(\d+)-i(\d+)/.exec(key) || [0, 0, 0]; return { e:+m[1], i:+m[2] }; }
  function name(key){ var q = parse(key); return q.e + " excitatory and " + q.i + " inhibitory"; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="sy-tin"><div id="sy-tE"></div><div id="sy-tI"></div></div>';
      function upd(){ a.save(); draw(); a.update(); }
      stepper($("#sy-tE"), { id:"sy-te", label:"Excitatory inputs firing (+10 mV each)", min:0, max:5, value:s.e, fmt:String, onChange:function(v){ s.e = v; upd(); } });
      stepper($("#sy-tI"), { id:"sy-ti2", label:"Inhibitory inputs firing (" + MV.MINUS + "5 mV each)", min:0, max:3, value:s.i, fmt:String, onChange:function(v){ s.i = v; upd(); } });
      pv.innerHTML = '<div class="sy-tpv"><h4>Live readouts</h4><div class="sy-tstage"><svg id="sy-tsvg" viewBox="0 0 360 170" role="img" focusable="false"></svg></div><dl class="read" id="sy-tread" aria-live="polite"></dl></div>';
      draw();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, "You’ve found all three answers.");
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [net(d.e, d.i) >= 15, d.i >= 1, net(d.e - 1, d.i) < 15]; },
    key:function(d){ return "e" + d.e + "-i" + d.i; },
    label:name,
    text:name
  };
})();

// ---------- hero: pulse → Ca²⁺ in → three vesicles burst → ACh crosses and binds, Na⁺ in, +10 mV bump → AChE snips → labelled diagram ----------
function traceInset(b){
  var h = sv("rect", { x:400, y:222, width:112, height:72, rx:6, "class":"sy-inset" }) + sv("line", { x1:408, y1:280, x2:506, y2:280, "class":"sy-restl" }) + txt(408, 236, "membrane", "sy-ts");
  var pts = [[408, 280], [436, 280], [444, 254], [482, 280], [506, 280]], n = [];
  var tot = b * 4; for (var i = 0; i < pts.length; i++) { if (i <= tot) n.push(pts[i]); else { n.push(P(pts[i - 1], pts[i], tot - (i - 1))); break; } }
  if (b > 0) h += sv("polyline", { points:n.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":"sy-trace" });
  if (b > 0.45) h += txt(450, 250, "+10 mV", "sy-tb sy-halo");
  return h;
}
function numMark(n, x, y){ return sv("circle", { cx:x, cy:y, r:9, "class":"sy-numc" }) + txt(x, y + 4, String(n), "sy-numt", "middle"); }
function hero(f){
  var box = $("#sy-hero"); if (!box) return;
  var cap = f && f.cap, lastCap = -1;
  box.innerHTML = '<svg viewBox="0 0 520 300" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box), O = { ves:HEROV, r:14, spread:HSPREAD, bind:HBIND, hero:true, labels:true };
  var CAPS = [
    "1. An action potential runs down the axon to the terminal.",
    "2. Ca²⁺ channels open, and Ca²⁺ enters the terminal.",
    "3. Vesicles dock and burst, releasing ACh.",
    "4. ACh drifts across the cleft and locks into receptors; Na⁺ streams in: a +10 mV bump.",
    "5. Acetylcholinesterase snips the ACh, and the receptors empty.",
    "1 An action potential arrives. 2 Ca²⁺ enters. 3 Vesicles release ACh. 4 ACh crosses the cleft and binds receptors, letting Na⁺ in (+10 mV). 5 Acetylcholinesterase clears the ACh."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  function finalFrame(){
    var h = nmjSVG("none", 5, 1, Object.assign({}, O, { vesHome:true })) + traceInset(1);
    h += arrow(260, 0, 260, 40, "sy-arr sy-arr-n") + numMark(1, 300, 14);
    h += arrow(36, 112, 104, 104, "sy-arr sy-arr-n") + numMark(2, 24, 114);
    h += arrow(260, 82, 260, 126, "sy-arr sy-arr-n") + numMark(3, 276, 104);
    h += arrow(236, 140, 236, 166, "sy-arr sy-arr-n") + numMark(4, 222, 150);
    h += numMark(5, 392, 142);
    svg.innerHTML = h; setCap(5);
  }
  if (MV.reduceMotion) { finalFrame(); return; }
  var B = [0, 1.6, 3.2, 5.6, 7.0, 9.4, 11.6];
  function frameAt(T){
    var s = 1; while (s < 6 && T >= B[s]) s++;
    var k = seg(T, B[s - 1], B[s]);
    svg.innerHTML = nmjSVG("none", s, k, O) + traceInset(s < 5 ? 0 : s === 5 ? seg(k, 0.45, 1) : 1);
    setCap(s <= 3 ? s - 1 : s === 4 || s === 5 ? 3 : 4);
  }
  setCap(0); frameAt(0);
  MV.tween({ dur:12600, ease:lin, step:function(kk){ var T = kk * 12.6; if (T >= B[6]) frameAt(B[6] - 1e-6); else frameAt(T); }, done:finalFrame });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
