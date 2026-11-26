// MCV4U 50 Equations of lines in R³: hero (a line traced through space, its xy-plane crossing and the three forms), 3D line
// tracer (Explore: V1 3D view with Trace / Two points / Equations modes and a V12 readout of the three forms and the plane
// crossings), Two points, one line (Part 3: four stations of number boxes beside the 3D view), Find it in space (Practice 2:
// coordinate boxes) and the "Through P, tilted just right" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }

// ---------- vectors ----------
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function scl(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function lerp(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function zero(v){ return near(v[0], 0) && near(v[1], 0) && near(v[2], 0); }
function same(a, b){ return near(a[0], b[0]) && near(a[1], b[1]) && near(a[2], b[2]); }
function par(a, b){ return zero(cross(a, b)); }
function onLine(p, r0, d){ return par(sub(p, r0), d); }
function at(p, d, t){ return add(p, scl(d, t)); }
function unit(v){ var l = Math.sqrt(dot(v, v)) || 1; return scl(v, 1 / l); }

// ---------- numbers ----------
function nf(v){ return MV.frac(r9(v), 12); }                       // whole numbers and simple fractions, true minus
function dec(v){ return num(r9(v), 2); }
function ptT(p){ return "(" + p.map(nf).join(", ") + ")"; }
function ptD(p){ return "(" + p.map(dec).join(", ") + ")"; }
function qT(q){ return Q.txt(q); }
function qPt(p){ return "(" + p.map(qT).join(", ") + ")"; }
// typed numbers: whole numbers, decimals or fractions such as −5/2 (no eval)
function parseQ(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/[−–]/g, "-").replace(/\s+/g, "");
  if (!s) return null;
  var r = /^([+-]?)(\d+(?:\.\d+)?|\.\d+)(?:\/(\d+(?:\.\d+)?))?$/.exec(s);
  if (!r) return NaN;
  var v = +r[2]; if (r[3] != null) { if (+r[3] === 0) return NaN; v /= +r[3]; }
  return r[1] === "-" ? -v : v;
}

// =====================================================================================================================
// @component V12 lineForms — vector, parametric and symmetric equations of a line in R³ from a point r0 and a direction d
// (numbers; fractions print as 5/2). Symmetric form follows the zero-component rule: a coordinate whose direction component is
// 0 is written separately ("(x − 1)/3 = (z + 2)/4, y = 2"); with two zero components the line is "x = 1, y = 2" and parallel
// to the third axis. Returns m() sources: { vec, par:[x, y, z], sym, axis (index of the parallel axis, or −1) }.
var NAMES = ["x", "y", "z"];
function affSrc(a, k){
  if (near(k, 0)) return nf(a);
  var ak = Math.abs(k), term = (near(ak, 1) ? "" : nf(ak)) + "t";
  if (near(a, 0)) return (k < 0 ? "-" : "") + term;
  return nf(a) + (k > 0 ? " + " : " - ") + term;
}
function symTop(a, n){ return near(a, 0) ? n : "(" + n + (a > 0 ? " - " + nf(a) : " + " + nf(-a)) + ")"; }
function lineForms(r0, d){
  var I = [], Z = [];
  [0, 1, 2].forEach(function(i){ (near(d[i], 0) ? Z : I).push(i); });
  var fr = I.map(function(i){ return symTop(r0[i], NAMES[i]) + "/" + (d[i] > 0 ? nf(d[i]) : "(" + nf(d[i]) + ")"); });
  var zs = Z.map(function(i){ return NAMES[i] + " = " + nf(r0[i]); });
  var sym = I.length >= 2 ? fr.join(" = ") + (zs.length ? ", " + zs.join(", ") : "") : zs.join(", ");
  return { vec:"vec{r} = " + ptT(r0) + " + t" + ptT(d), par:NAMES.map(function(n, i){ return n + " = " + affSrc(r0[i], d[i]); }), sym:sym, axis:I.length === 1 ? I[0] : -1 };
}
function symHTML(F){ return m(F.sym) + (F.axis >= 0 ? " (a line parallel to the " + m(NAMES[F.axis]) + "-axis)" : ""); }
// where the line r0 + t d crosses the coordinate planes (integers in, exact rationals out): xy (z = 0), yz (x = 0), xz (y = 0)
var PLANES = [{ k:2, nm:"xy" }, { k:0, nm:"yz" }, { k:1, nm:"xz" }];
function crossings(p, d){
  return PLANES.map(function(P){
    var k = P.k;
    if (d[k] === 0) return { k:k, nm:P.nm, none:true, lies:p[k] === 0 };
    var tq = Q.of(-p[k], d[k]), pt = [0, 1, 2].map(function(i){ return Q.add(Q.of(p[i], 1), Q.mul(tq, Q.of(d[i], 1))); });
    return { k:k, nm:P.nm, t:tq, pt:pt, v:pt.map(Q.val) };
  });
}
function crossRow(c){
  var lab = "Crosses " + m(c.nm) + "-plane (" + m(NAMES[c.k] + " = 0") + ")";
  if (c.none) return [lab, c.lies ? "lies in it" : "never: parallel to the " + m(c.nm) + "-plane"];
  return [lab, "at " + m("t = " + qT(c.t)) + ": " + qPt(c.pt)];
}

// =====================================================================================================================
// @component V1 view3d — SVG 3D view for points, lines and planes in R³ (MCV4U 50; meant for 51–59). z up; the start view is
// the textbook one (x toward you and down-left, y to the right). Everything is clipped to the box |x|, |y|, |z| ≤ R (default 6).
// Depth cue: lines fade with distance (farther = fainter), so lines that pass behind each other don't look like they cross.
// Colours come from CSS classes (tokens only), so theme switches need no redraw. With rotate:true the view turns by dragging
// (sideways: turn; up/down: tilt) or with the arrow keys when focused.
//   var V = view3d(host, { rotate:true, onView:function(vw){} })
//   V.draw(scene): scene = { planes:[{n:[a,b,c], d, cls:"pl1"|"pl2", alpha}], lines:[{p, d, cls, t0, t1, w}] (clipped to the box),
//     segs:[{a, b, cls}], arrows:[{a, b, cls}], dots:[{p, cls, r}], rings:[{p, flash}], labels:[{p, text, dx, dy, anchor}], describe }
//   line/seg classes: ink, ink2, pen, hiseg, guide (dashed), shadow (dashed); dot classes: ink, pen, ink2, f3, hi.
//   V.view() -> {az, el} (radians); V.setView(vw); V.preset("iso"|"front"|"top"|"side", animate, done)
var PRE = { iso:{ az:Math.PI / 6, el:0.38 }, front:{ az:-Math.PI / 2, el:0 }, top:{ az:0, el:Math.PI / 2 }, side:{ az:0, el:0 } };
var PRESETS = [{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"top", t:"Top" }, { id:"side", t:"Side" }];
function view3d(host, o){
  o = o || {};
  var R = o.R || 6, K = 17.5, D = R * Math.sqrt(3), scene = null, vw = { az:PRE.iso.az, el:PRE.iso.el }, B, anim = null;
  if (o.view && typeof o.view.az === "number" && typeof o.view.el === "number") vw = { az:o.view.az, el:clamp(o.view.el, -0.1, Math.PI / 2) };
  host.innerHTML = '<svg class="l3-svg" viewBox="-200 -200 400 400" role="img"' + (o.rotate ? ' tabindex="0"' : "") + ' aria-label="3D view"></svg>';
  var svg = host.firstChild;
  var CV = [], CE = [], i, b;
  for (i = 0; i < 8; i++) CV.push([i & 1 ? R : -R, i & 2 ? R : -R, i & 4 ? R : -R]);
  for (i = 0; i < 8; i++) for (b = 0; b < 3; b++) if (!(i & (1 << b))) CE.push([i, i | (1 << b)]);
  function basis(){ var ca = Math.cos(vw.az), sa = Math.sin(vw.az), ce = Math.cos(vw.el), se = Math.sin(vw.el);
    B = { r:[-sa, ca, 0], u:[-se * ca, -se * sa, ce], v:[ce * ca, ce * sa, se] }; }
  function pr(p){ return [K * dot(p, B.r), -K * dot(p, B.u), dot(p, B.v)]; }
  function al(dep){ return (0.34 + 0.66 * clamp((dep + D) / (2 * D), 0, 1)).toFixed(2); }
  function f(v){ return (Math.round(v * 10) / 10).toFixed(1); }
  function clip(p, d, lo, hi){
    if (zero(d)) return null;
    var t0 = -Infinity, t1 = Infinity;
    for (var k = 0; k < 3; k++) {
      if (Math.abs(d[k]) < 1e-12) { if (p[k] < -R - 1e-9 || p[k] > R + 1e-9) return null; continue; }
      var a = (-R - p[k]) / d[k], c = (R - p[k]) / d[k]; if (a > c) { var s = a; a = c; c = s; }
      t0 = Math.max(t0, a); t1 = Math.min(t1, c);
    }
    if (lo != null) t0 = Math.max(t0, lo); if (hi != null) t1 = Math.min(t1, hi);
    return t1 > t0 + 1e-9 ? [t0, t1] : null;
  }
  function seg3(a, c, cls, w, split){
    var out = "", n = split ? 26 : 1;
    for (var k = 0; k < n; k++) {
      var P = pr(lerp(a, c, k / n)), P2 = pr(lerp(a, c, (k + 1) / n));
      out += '<line class="l3-' + cls + '" x1="' + f(P[0]) + '" y1="' + f(P[1]) + '" x2="' + f(P2[0]) + '" y2="' + f(P2[1]) + '" stroke-opacity="' + al((P[2] + P2[2]) / 2) + '"' + (w ? ' style="stroke-width:' + w + 'px"' : "") + "/>";
    }
    return out;
  }
  function head(a, c, cls, size){
    var P = pr(a), P2 = pr(c), dx = P2[0] - P[0], dy = P2[1] - P[1], L = Math.sqrt(dx * dx + dy * dy);
    if (L < 2) return "";
    var ux = dx / L, uy = dy / L, s = size || 11, w = s * 0.48, bx = P2[0] - ux * s, by = P2[1] - uy * s;
    return '<polygon class="l3-h' + cls + '" fill-opacity="' + al(P2[2]) + '" points="' + f(P2[0]) + "," + f(P2[1]) + " " + f(bx - uy * w) + "," + f(by + ux * w) + " " + f(bx + uy * w) + "," + f(by - ux * w) + '"/>';
  }
  function poly(n, d){
    var pts = [];
    CE.forEach(function(e){
      var a = CV[e[0]], c = CV[e[1]], fa = dot(n, a) - d, fc = dot(n, c) - d;
      if (Math.abs(fa) < 1e-9) pts.push(a); if (Math.abs(fc) < 1e-9) pts.push(c);
      if (fa * fc < 0) pts.push(lerp(a, c, fa / (fa - fc)));
    });
    var u = [];
    pts.forEach(function(p){ if (!u.some(function(q){ return same(p, q); })) u.push(p); });
    if (u.length < 3) return null;
    var c0 = scl(u.reduce(add, [0, 0, 0]), 1 / u.length), e1 = unit(Math.abs(n[0]) < 0.9 * Math.sqrt(dot(n, n)) ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0])), e2 = unit(cross(n, e1));
    u.sort(function(p, q){ var a = sub(p, c0), c = sub(q, c0); return Math.atan2(dot(a, e2), dot(a, e1)) - Math.atan2(dot(c, e2), dot(c, e1)); });
    return u;
  }
  function txt(p, s, dx, dy, anchor, cls){
    var P = pr(p);
    return '<text class="l3-lab' + (cls ? " l3-" + cls : "") + '" x="' + f(P[0] + (dx || 0)) + '" y="' + f(P[1] + (dy || 0)) + '" text-anchor="' + (anchor || "middle") + '">' + MV.esc(s) + "</text>";
  }
  function axes(){
    var s = "", E = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (var k = -R; k <= R; k += 2) s += seg3([k, -R, 0], [k, R, 0], "grid") + seg3([-R, k, 0], [R, k, 0], "grid");
    E.forEach(function(e, j){
      s += seg3(scl(e, -R), scl(e, R + 0.5), "axis", 0, true) + head(scl(e, R), scl(e, R + 1), "axis", 10);
      for (var t = -R; t <= R; t++) if (t) {                        // integer ticks, drawn across the axis on screen
        var P = pr(scl(e, t)), P2 = pr(scl(e, t + 0.01)), dx = P2[0] - P[0], dy = P2[1] - P[1], L = Math.sqrt(dx * dx + dy * dy);
        if (L < 1e-4) continue;
        var nx = -dy / L * (t % 5 ? 2.5 : 4.5), ny = dx / L * (t % 5 ? 2.5 : 4.5);
        s += '<line class="l3-tick" x1="' + f(P[0] - nx) + '" y1="' + f(P[1] - ny) + '" x2="' + f(P[0] + nx) + '" y2="' + f(P[1] + ny) + '" stroke-opacity="' + al(P[2]) + '"/>';
      }
      s += txt(scl(e, R + 1.7), NAMES[j], 0, 5, "middle", "ax");
    });
    return s;
  }
  function draw(sc){
    if (sc) scene = sc;
    sc = scene || {};
    basis();
    var s = "";
    (sc.planes || []).forEach(function(P){
      var pts = poly(P.n, P.d); if (!pts) return;
      s += '<polygon class="l3-' + (P.cls || "pl1") + '"' + (P.alpha != null ? ' style="opacity:' + P.alpha.toFixed(2) + '"' : "") + ' points="' + pts.map(function(p){ var q = pr(p); return f(q[0]) + "," + f(q[1]); }).join(" ") + '"/>';
    });
    s += axes();
    (sc.lines || []).forEach(function(L){
      var T = clip(L.p, L.d, L.t0, L.t1); if (!T) return;
      var dash = L.cls === "shadow" || L.cls === "guide";
      s += seg3(at(L.p, L.d, T[0]), at(L.p, L.d, T[1]), L.cls || "ink", L.w, !dash);
    });
    (sc.segs || []).forEach(function(G){ s += seg3(G.a, G.b, G.cls || "guide", G.w, false); });
    (sc.arrows || []).forEach(function(A){ var L = Math.sqrt(dot(sub(A.b, A.a), sub(A.b, A.a))); if (L < 1e-9) return;
      var c = sub(A.b, scl(sub(A.b, A.a), Math.min(0.5, 0.45 * L) / L));
      s += seg3(A.a, c, A.cls || "pen", A.w, A.cls !== "pos") + head(A.a, A.b, A.cls || "pen"); });
    (sc.rings || []).forEach(function(G){ var P = pr(G.p); s += '<circle class="l3-ring' + (G.flash && !MV.reduceMotion ? " l3-flash" : "") + '" cx="' + f(P[0]) + '" cy="' + f(P[1]) + '" r="8"/>'; });
    (sc.dots || []).forEach(function(G){ var P = pr(G.p); s += '<circle class="l3-d' + (G.cls || "ink") + '" cx="' + f(P[0]) + '" cy="' + f(P[1]) + '" r="' + (G.r || 5.5) + '"/>'; });
    (sc.labels || []).forEach(function(G){ s += txt(G.p, G.text, G.dx, G.dy == null ? -12 : G.dy, G.anchor, G.cls); });
    svg.innerHTML = s;
    svg.setAttribute("aria-label", (sc.describe || "3D view") + (o.rotate ? " Drag the view, or focus it and use the arrow keys, to turn it." : ""));
  }
  function setView(v, quiet){ vw = { az:v.az, el:clamp(v.el, -0.1, Math.PI / 2) }; draw(); if (!quiet && o.onView) o.onView(vw); }
  function preset(id, animate, done){
    var P = PRE[id] || PRE.iso, a0 = vw.az, e0 = vw.el, da = P.az - a0;
    while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    if (anim) { anim(); anim = null; }
    if (!animate) { setView({ az:P.az, el:P.el }); if (done) done(); return; }
    anim = MV.tween({ dur:1200, step:function(t){ setView({ az:a0 + da * t, el:e0 + (P.el - e0) * t }, true); }, done:function(){ anim = null; setView({ az:P.az, el:P.el }); if (done) done(); } });
  }
  if (o.rotate) {
    var drag = null;
    svg.addEventListener("pointerdown", function(e){ if (o.locked && o.locked()) return; drag = { x:e.clientX, y:e.clientY, az:vw.az, el:vw.el }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
    svg.addEventListener("pointermove", function(e){ if (!drag) return; setView({ az:drag.az - (e.clientX - drag.x) * 0.012, el:drag.el + (e.clientY - drag.y) * 0.012 }); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function(ev){ svg.addEventListener(ev, function(){ drag = null; }); });
    svg.addEventListener("keydown", function(e){
      if (o.locked && o.locked()) return;
      var st = Math.PI / 36, k = e.key;
      if (k === "ArrowLeft") setView({ az:vw.az + st, el:vw.el }); else if (k === "ArrowRight") setView({ az:vw.az - st, el:vw.el });
      else if (k === "ArrowUp") setView({ az:vw.az, el:vw.el + st }); else if (k === "ArrowDown") setView({ az:vw.az, el:vw.el - st });
      else return;
      e.preventDefault();
    });
  }
  return { draw:draw, view:function(){ return { az:vw.az, el:vw.el }; }, setView:setView, preset:preset, svg:svg };
}
function presetBtns(dis){
  return '<div class="l3-pre" role="group" aria-label="View presets"><span class="tiny muted">View:</span>' + PRESETS.map(function(p){
    return '<button type="button" class="btn ghost sm" data-vp="' + p.id + '" data-k="vp' + p.id + '"' + (dis ? " disabled" : "") + ">" + p.t + "</button>"; }).join("") + "</div>";
}
// box guides from a point down to the floor and across to the x- and y-axes (dashed)
function guides(p){
  var f0 = [p[0], p[1], 0];
  return [{ a:p, b:f0, cls:"guide" }, { a:f0, b:[p[0], 0, 0], cls:"guide" }, { a:f0, b:[0, p[1], 0], cls:"guide" }];
}
function sentence(p, d){
  var c = crossings(p, d), out = "Line r = " + MV.plain(ptT(p)) + " + t" + MV.plain(ptT(d)) + ".";
  var bits = c.map(function(x){ return x.none ? (x.lies ? "lies in the " + x.nm + "-plane" : "never meets the " + x.nm + "-plane") : "meets the " + x.nm + "-plane at " + ptD(x.v); });
  return out + " It " + bits.join(", ") + ".";
}

// ---------- hero ----------
function hero(f){
  var host = $("#l3-hero"); if (!host) return;
  var V = view3d(host, {}), r0 = [1, 2, 3], d = [2, -1, 1];
  var F = lineForms(r0, d);
  if (f.cap) f.cap.innerHTML = '<span class="l3-hforms">' + ['<span class="l3-hk">Vector</span> ' + m(F.vec), '<span class="l3-hk">Parametric</span> ' + F.par.map(m).join(", "),
    '<span class="l3-hk">Symmetric</span> ' + symHTML(F)].map(function(h){ return '<span class="l3-hform">' + h + "</span>"; }).join("") + "</span>";
  var forms = f.cap ? f.cap.querySelectorAll(".l3-hform") : [];
  var st = { pt:0, arrow:0, t:null, full:false, ring:false, flash:false };
  function draw(){
    var sc = { lines:[], segs:[], arrows:[], dots:[], rings:[], labels:[] };
    if (st.full) sc.lines.push({ p:r0, d:d, cls:"ink" });
    else if (st.t != null && st.t > -3) sc.lines.push({ p:r0, d:d, cls:"ink", t0:-3, t1:st.t });
    if (st.pt) { sc.segs = sc.segs.concat(guides(r0)); sc.dots.push({ p:r0, cls:"ink2", r:5 }); sc.labels.push({ p:r0, text:"(1, 2, 3)", dx:-10, dy:-10, anchor:"end" }); }
    if (st.arrow > 0) sc.arrows.push({ a:r0, b:at(r0, d, st.arrow), cls:"pen" });
    if (st.ring) { sc.rings.push({ p:[-5, 5, 0], flash:st.flash }); sc.labels.push({ p:[-5, 5, 0], text:"(−5, 5, 0)", dx:0, dy:24 }); }
    if (st.t != null) sc.dots.push({ p:at(r0, d, st.t), cls:"ink" });
    sc.describe = "3D axes with the line r = (1, 2, 3) + t(2, −1, 1): the blue arrow m = (2, −1, 1) starts at (1, 2, 3), and the line pierces the xy-plane at (−5, 5, 0).";
    V.draw(sc);
  }
  function showForms(n){ for (var k = 0; k < forms.length; k++) forms[k].classList.toggle("l3-on", k < n); }
  function finish(){ st = { pt:1, arrow:1, t:3, full:true, ring:true, flash:false }; draw(); showForms(3); }
  if (MV.reduceMotion) { finish(); return; }
  MV.wait(14000, function(){ showForms(3); });                       // safety: never leave the forms hidden
  showForms(0); draw();
  MV.wait(500, function(){
    st.pt = 1; draw();
    MV.wait(700, function(){
      MV.tween({ dur:900, step:function(t){ st.arrow = t; draw(); }, done:function(){
        st.arrow = 1; st.t = -3; draw();
        MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){ st.t = -3 + 6 * t; draw(); }, done:function(){
          st.t = 3; st.full = true; draw();
          MV.wait(400, function(){
            st.ring = true; st.flash = true; draw();
            MV.wait(900, function(){ showForms(1); MV.wait(700, function(){ showForms(2); MV.wait(700, function(){ showForms(3); st.flash = false; draw(); }); }); });
          });
        } });
      } });
    });
  });
}

// ---------- Explore: 3D line tracer ----------
var EQS = [
  { id:"a", n:[1, 1, 0], d:3, src:"x + y = 3" }, { id:"b", n:[0, 0, 1], d:3, src:"z = 3" }, { id:"c", n:[1, -1, 0], d:-1, src:"x - y = -1" },
  { id:"d", n:[1, 1, 1], d:6, src:"x + y + z = 6" }, { id:"e", n:[0, 1, 1], d:5, src:"y + z = 5" }, { id:"f", n:[2, 2, 0], d:6, src:"2x + 2y = 6" },
  { id:"g", n:[1, 0, 0], d:1, src:"x = 1" }, { id:"h", n:[1, 2, -1], d:4, src:"x + 2y - z = 4" }
];
function eqById(id){ return EQS.filter(function(e){ return e.id === id; })[0]; }
// where two planes n·x = d meet: {kind:"line", p:[Q], d:[int]} (point with a zero coordinate, direction reduced), "same" or "par"
function meet(e1, e2){
  var dir = cross(e1.n, e2.n), i;
  if (zero(dir)) {
    for (i = 0; i < 3 && !e1.n[i]; i++);
    var k = e2.n[i] / e1.n[i];
    return { kind:near(e2.d, k * e1.d) ? "same" : "par" };
  }
  var g = gcd(gcd(dir[0], dir[1]), dir[2]) || 1; dir = scl(dir, 1 / g);
  for (i = 0; i < 3 && !dir[i]; i++);
  if (dir[i] < 0) dir = scl(dir, -1);
  dir = dir.map(function(v){ return v + 0; });
  var j = (i + 1) % 3, l = (i + 2) % 3, det = e1.n[j] * e2.n[l] - e1.n[l] * e2.n[j], p = [];
  p[i] = Q.of(0, 1); p[j] = Q.of(e1.d * e2.n[l] - e1.n[l] * e2.d, det); p[l] = Q.of(e1.n[j] * e2.d - e1.d * e2.n[j], det);
  return { kind:"line", p:p, d:dir };
}
function explore(host, api){
  var S = api.S, C = api.content, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  function ints(a, lo, hi, def){ return Array.isArray(a) && a.length === 3 && a.every(function(v){ return Number.isInteger(v) && v >= lo && v <= hi; }) ? a : def; }
  if (["trace", "two", "eq"].indexOf(S.mode) < 0) S.mode = "trace";
  S.r0 = ints(S.r0, -5, 5, [1, 2, 3]); S.md = ints(S.md, -4, 4, [2, -1, 1]); if (zero(S.md)) S.md = [2, -1, 1];
  S.A = ints(S.A, -5, 5, [1, 0, 2]); S.B = ints(S.B, -5, 5, [3, 4, 0]);
  if (!(typeof S.t === "number" && S.t >= -4 && S.t <= 4)) S.t = 0;
  if (!(typeof S.tt === "number" && S.tt >= 0 && S.tt <= 1)) S.tt = 0;
  if (S.cross == null) S.cross = true; S.cross = !!S.cross; S.shadow = !!S.shadow;
  if (!Array.isArray(S.eq)) S.eq = []; S.eq = S.eq.filter(eqById).slice(0, 2);
  var busy = false, mark = null, anim = null, play = null, planeA = null, msg = "";

  host.innerHTML = '<div class="l3-ex"><div class="l3-colL"><div class="l3-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="l3-vwrap" id="l3-v"></div>' + presetBtns() + '</div><dl class="read l3-forms" id="l3-forms" aria-live="polite"></dl></div>' +
    '<div class="l3-colR"><div class="seg-wrap" id="l3-mode"></div><p class="tiny muted l3-how" id="l3-how"></p><div id="l3-ctl"></div>' +
      '<p class="tiny l3-msg" id="l3-msg" aria-live="polite"></p><dl class="read l3-cross" id="l3-cross" aria-live="polite"></dl></div></div>';
  var V = view3d($("#l3-v", host), { rotate:true, view:S.vw, locked:function(){ return busy; }, onView:function(vw){ S.vw = vw; api.save(); } });

  function stepper(g, i, lab, lo, hi){
    return '<label class="l3-st"><span>' + lab + '</span><input type="number" class="numin l3-num" min="' + lo + '" max="' + hi + '" step="1" data-g="' + g + '" data-i="' + i + '" data-k="' + g + i + '" aria-label="' + MV.esc(MV.plain(lab)) + ", whole number from " + lo + " to " + hi + '"></label>';
  }
  function trio(g, labs, lo, hi, title){ return '<div class="l3-grp"><p class="l3-gt">' + title + '</p><div class="l3-trio">' + labs.map(function(l, i){ return stepper(g, i, l, lo, hi); }).join("") + "</div></div>"; }
  function tSlider(id, lo, hi, step, aria){
    return '<div class="l3-trow"><label class="slider l3-sl"><span class="slider-top"><span>Parameter ' + m("t") + '</span><output id="l3-' + id + 'o" style="color:var(--ink)"></output></span>' +
      '<input type="range" id="l3-' + id + '" min="' + lo + '" max="' + hi + '" step="' + step + '" style="accent-color:var(--ink)" aria-label="' + aria + '"></label>' +
      '<button type="button" class="btn ghost sm l3-play" data-play="' + id + '" data-k="play' + id + '">Play</button></div>';
  }
  $("#l3-ctl", host).innerHTML = '<fieldset class="l3-fs" id="l3-fs"><legend class="vh">Line controls</legend>' +
    '<div data-pane="trace">' + trio("r0", [m("x_0"), m("y_0"), m("z_0")], -5, 5, "Point " + m("vec{r}_0")) +
      trio("md", [m("m_1"), m("m_2"), m("m_3")], -4, 4, 'Direction <span class="l3-pen">' + m("vec{m}") + "</span> (not all 0)") +
      tSlider("t", -4, 4, 0.25, "Parameter t, from −4 to 4 in steps of 0.25") +
      '<div class="chips l3-tg"><button type="button" class="chip" data-tg="cross" data-k="tgcross" aria-pressed="false">Show plane crossings</button>' +
      '<button type="button" class="chip" data-tg="shadow" data-k="tgshadow" aria-pressed="false">Show shadow on the floor</button></div></div>' +
    '<div data-pane="two">' + trio("A", [m("x"), m("y"), m("z")], -5, 5, "Point A") + trio("B", [m("x"), m("y"), m("z")], -5, 5, "Point B") +
      '<p class="tiny muted">' + m("vec{m} = B - A") + " automatically; " + m("t") + " runs from 0 (at A) to 1 (at B).</p>" +
      tSlider("tt", 0, 1, 0.05, "Parameter t, from 0 to 1 in steps of 0.05") +
      '<div class="chips l3-tg"><button type="button" class="chip" data-tg="cross" data-k="tgcross2" aria-pressed="false">Show plane crossings</button></div></div>' +
    '<div data-pane="eq"><p class="l3-gt">Equations (at most two)</p><div class="chips l3-eqc" role="group" aria-label="Equation chips">' +
      EQS.map(function(e){ return '<button type="button" class="chip" data-eq="' + e.id + '" data-k="eq' + e.id + '" aria-pressed="false">' + m(e.src) + "</button>"; }).join("") + "</div></div></fieldset>";
  var HOW = { trace:"Set the point and the direction with the boxes (arrows step by 1), then slide or play " + m("t") + ". Drag the view to turn it.",
    two:"Set A and B. The direction is B − A, and the highlighted piece is the segment from A to B.",
    eq:"Choose one chip to draw its plane, or two to see where their planes meet. A third chip replaces the first." };

  function cur(){ return S.mode === "two" ? { p:S.A, d:sub(S.B, S.A), t:S.tt } : { p:S.r0, d:S.md, t:S.t }; }
  function syncCtrl(){
    MV.keepFocus($("#l3-mode", host), function(){
      $("#l3-mode", host).innerHTML = '<span class="seg" role="group" aria-label="Mode">' + [{ id:"trace", t:"Trace" }, { id:"two", t:"Two points" }, { id:"eq", t:"Equations" }].map(function(o){
        return '<button type="button" data-mode="' + o.id + '" data-k="mode' + o.id + '" aria-pressed="' + (S.mode === o.id) + '"' + (busy ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span>";
    });
    $("#l3-how", host).innerHTML = HOW[S.mode];
    $("#l3-fs", host).disabled = busy;
    host.querySelectorAll("[data-pane]").forEach(function(p){ p.hidden = p.dataset.pane !== S.mode; });
    host.querySelectorAll("[data-vp]").forEach(function(b){ b.disabled = busy; });
    host.querySelectorAll("input[data-g]").forEach(function(inp){ if (document.activeElement !== inp) inp.value = S[inp.dataset.g][+inp.dataset.i]; });
    $("#l3-t", host).value = S.t; $("#l3-to", host).textContent = num(S.t, 2);
    $("#l3-tt", host).value = S.tt; $("#l3-tto", host).textContent = num(S.tt, 2);
    host.querySelectorAll("[data-tg]").forEach(function(b){ b.setAttribute("aria-pressed", String(!!S[b.dataset.tg])); b.classList.toggle("on", !!S[b.dataset.tg]); });
    host.querySelectorAll("[data-eq]").forEach(function(b){ var on = S.eq.indexOf(b.dataset.eq) >= 0; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); });
    host.querySelectorAll("[data-play]").forEach(function(b){ b.textContent = play ? "Pause" : "Play"; });
    $("#l3-msg", host).innerHTML = msg;
  }
  function eqResult(){
    if (!S.eq.length) return null;
    var e1 = eqById(S.eq[0]);
    if (S.eq.length === 1) return { one:true, e1:e1 };
    var e2 = eqById(S.eq[1]); return { e1:e1, e2:e2, r:meet(e1, e2) };
  }
  function lineSrc(r){ return "vec{r} = " + qPt(r.p) + " + t" + ptT(r.d); }
  function paintRead(){
    var rows = [], rows2 = [];
    if (S.mode === "eq") {
      var R = eqResult();
      if (!R) rows.push(["Planes", "Choose a chip to draw its plane."]);
      else if (R.one) rows.push(["Plane", m(R.e1.src) + ": one equation, so a <strong>plane</strong>. Choose a second chip to see two planes meet."]);
      else {
        rows.push(["Planes", '<span class="l3-sw l3-sw1" aria-hidden="true"></span>' + m(R.e1.src) + ' and <span class="l3-sw l3-sw2" aria-hidden="true"></span>' + m(R.e2.src)]);
        if (R.r.kind === "line") rows.push(["Where they meet", m(R.e1.src) + " and " + m(R.e2.src) + " meet in the line " + m(lineSrc(R.r))]);
        else rows.push(["Where they meet", R.r.kind === "same" ? "Same plane: no single line" : "Parallel planes: no intersection"]);
      }
      $("#l3-forms", host).innerHTML = MV.readoutHTML(rows);
      $("#l3-cross", host).innerHTML = "";
      $("#l3-cross", host).hidden = true;
      return;
    }
    $("#l3-cross", host).hidden = false;
    var L = cur();
    if (zero(L.d)) {
      $("#l3-forms", host).innerHTML = MV.readoutHTML([["Line", "A and B are the same point: choose two different points."]]);
      $("#l3-cross", host).innerHTML = ""; return;
    }
    var F = lineForms(L.p, L.d);
    rows.push(["Vector equation", m(F.vec)], ["Parametric", F.par.map(m).join(", ")], ["Symmetric", symHTML(F)]);
    $("#l3-forms", host).innerHTML = MV.readoutHTML(rows);
    rows2.push(["Current point", m("t = " + num(L.t, 2)) + ": " + ptD(at(L.p, L.d, L.t))]);
    if (S.mode === "two") rows2.push(["Segment AB", m("0 ≤ t ≤ 1") + ", from A" + ptT(S.A) + " to B" + ptT(S.B)]);
    crossings(L.p, L.d).forEach(function(c){ rows2.push(crossRow(c)); });
    $("#l3-cross", host).innerHTML = MV.readoutHTML(rows2);
  }
  function draw(){
    var sc = { planes:[], lines:[], segs:[], arrows:[], dots:[], rings:[], labels:[] }, desc;
    if (S.mode === "eq") {
      var R = eqResult();
      desc = "3D axes.";
      if (R) {
        sc.planes.push({ n:R.e1.n, d:R.e1.d, cls:"pl1", alpha:planeA });
        desc = "3D view of the plane " + MV.plain(m(R.e1.src)) + (R.one ? "." : "");
        if (!R.one) {
          sc.planes.push({ n:R.e2.n, d:R.e2.d, cls:"pl2" });
          desc += " and the plane " + MV.plain(m(R.e2.src)) + ". ";
          if (R.r.kind === "line") { var pv = R.r.p.map(Q.val); sc.lines.push({ p:pv, d:R.r.d, cls:"ink", w:3.6 }); desc += "They meet in the line r = " + ptD(pv) + " + t" + MV.plain(ptT(R.r.d)) + "."; }
          else desc += R.r.kind === "same" ? "They are the same plane." : "They are parallel.";
        }
      }
      sc.describe = desc;
    } else {
      var L = cur(), P = at(L.p, L.d, L.t), two = S.mode === "two";
      if (!zero(L.d)) {
        if (two) sc.lines.push({ p:S.A, d:L.d, cls:"hiseg", t0:0, t1:1 });
        sc.lines.push({ p:L.p, d:L.d, cls:"ink" });
        if (S.shadow && !two) { if (L.d[0] || L.d[1]) sc.lines.push({ p:[L.p[0], L.p[1], 0], d:[L.d[0], L.d[1], 0], cls:"shadow" }); else sc.dots.push({ p:[L.p[0], L.p[1], 0], cls:"ink2", r:4 }); }
        if (S.cross) crossings(L.p, L.d).forEach(function(c){ if (!c.none && c.v.every(function(v){ return Math.abs(v) <= 6 + 1e-9; })) sc.rings.push({ p:c.v, flash:mark && mark.flash === c.nm }); });
      }
      sc.arrows.push({ a:[0, 0, 0], b:L.p, cls:"pos" });
      if (!zero(L.d) && !two) sc.arrows.push({ a:L.p, b:add(L.p, L.d), cls:"pen", w:3.4 });
      if (two) { sc.arrows.push({ a:S.A, b:S.B, cls:"pen", w:3.4 }); sc.dots.push({ p:S.A, cls:"ink2", r:5 }, { p:S.B, cls:"ink2", r:5 }); sc.labels.push({ p:S.A, text:"A", dx:-10, dy:-8, anchor:"end" }, { p:S.B, text:"B", dx:10, dy:-8, anchor:"start" }); }
      sc.segs = sc.segs.concat(guides(P));
      sc.dots.push({ p:P, cls:"ink", r:6 });
      sc.labels.push({ p:P, text:"P(t)", dx:10, dy:-10, anchor:"start" });
      sc.describe = zero(L.d) ? "A and B are the same point." : sentence(L.p, L.d) + " The point at t = " + num(L.t, 2) + " is " + ptD(P) + ".";
    }
    (mark && mark.labels || []).forEach(function(q){ sc.labels.push({ p:q.p, text:q.text, dx:q.dx || 0, dy:q.dy == null ? 26 : q.dy, anchor:q.anchor, cls:"mk" }); });
    V.draw(sc);
  }
  function after(how){
    if (how !== "anim") { mark = null; api.save(); }
    paintRead(); syncCtrl(); draw();
    if (how !== "anim") MV.changed();
  }
  function stopPlay(){ if (play) { play(); play = null; } }
  function startPlay(id){
    var two = id === "tt", lo = two ? 0 : -4, hi = two ? 1 : 4, key = two ? "tt" : "t", st = two ? 0.25 : 1;
    if (S[key] >= hi - 1e-9) S[key] = lo;
    if (MV.reduceMotion) {                                           // reduced motion: t moves in jumps of 1 (a quarter of AB in Two points)
      var live = true, tick = function(){ if (!live) return; S[key] = r9(Math.min(hi, Math.floor(S[key] / st + 1e-9) * st + st)); after("anim");
        if (S[key] >= hi - 1e-9) { play = null; after("set"); return; } setTimeout(tick, 600); };
      play = function(){ live = false; }; syncCtrl(); setTimeout(tick, 300); return;
    }
    var a = S[key];
    play = MV.tween({ dur:(hi - a) / (hi - lo) * 4200, ease:function(t){ return t; }, step:function(t){ S[key] = r9(a + (hi - a) * t); after("anim"); },
      done:function(){ play = null; S[key] = hi; after("set"); } });
    syncCtrl();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.vp) { V.preset(b.dataset.vp, true); return; }
    if (busy) return;
    if (b.dataset.mode) { stopPlay(); S.mode = b.dataset.mode; msg = ""; after("set"); return; }
    if (b.dataset.play) { if (play) { stopPlay(); after("set"); } else startPlay(b.dataset.play); return; }
    if (b.dataset.tg) { S[b.dataset.tg] = !S[b.dataset.tg]; after("set"); return; }
    if (b.dataset.eq) {
      var id = b.dataset.eq, k = S.eq.indexOf(id); msg = "";
      if (k >= 0) S.eq.splice(k, 1); else { S.eq.push(id); if (S.eq.length > 2) { S.eq.shift(); msg = "Two at most: the first chip switched off."; } }
      after("set");
    }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "l3-t" || t.id === "l3-tt") { stopPlay(); S[t.id === "l3-t" ? "t" : "tt"] = r9(+t.value); after("set"); return; }
    if (!t.dataset || !t.dataset.g) return;
    var v = parseInt(t.value, 10); if (isNaN(v) || String(v) !== t.value.trim().replace(/^\+/, "")) return;
    var g = t.dataset.g, i = +t.dataset.i, lo = g === "md" ? -4 : -5, hi = -lo;
    v = clamp(v, lo, hi);
    var nv = S[g].slice(); nv[i] = v;
    if (g === "md" && zero(nv)) { msg = "The direction can’t be (0, 0, 0): keep at least one component non-zero."; syncCtrl(); return; }
    msg = ""; S[g] = nv; after("set");
  });
  host.addEventListener("change", function(e){ var t = e.target; if (t.dataset && t.dataset.g) { t.value = S[t.dataset.g][+t.dataset.i]; } });
  paintRead(); syncCtrl(); draw();

  // ---- predictions ----
  var START = { p1:{ mode:"trace", r0:[1, 2, 3], md:[2, -1, 1], t:0 }, p2:{ mode:"eq", eq:[] }, p3:{ mode:"trace", r0:[1, 2, -2], md:[3, 0, 4], t:0 }, p4:{ mode:"two", A:[1, 0, 2], B:[3, 4, 0], tt:0 } };
  function tw(dur, step, cb){ anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:function(){ anim = null; cb(); } }); }
  function chal(id){
    var M = MS[id], d = S.md, p = S.r0;
    if (id === "tc1") {
      if (S.mode !== "trace") return { ok:false, msg:M.mode };
      var A = [2, -1, 3], dir = [1, 2, -1];
      if (par(d, dir)) return onLine(p, A, dir) ? { ok:true } : { ok:false, msg:M.off };
      if (same(d, [2, 4, 2])) return { ok:false, msg:M.m242 };
      if (same(d, [3, 1, 2])) return { ok:false, msg:M.m312 };
      return { ok:false, msg:M.other };
    }
    if (id === "tc2") {
      if (S.mode !== "trace") return { ok:false, msg:M.mode };
      if (same(d, [0, 0, 1])) return { ok:false, msg:M.up };
      if (d[2] !== 0) return { ok:false, msg:M.zc };
      if (onLine([1, 2, -2], p, d)) return { ok:true };
      if (p[2] === 0) return { ok:false, msg:M.lies };
      return { ok:false, msg:M.miss };
    }
    if (id === "tc3") {
      if (S.mode !== "eq") return { ok:false, msg:M.mode };
      if (!S.eq.length) return { ok:false, msg:M.none };
      if (S.eq.length === 1) return { ok:false, msg:M.one };
      var set = S.eq.slice().sort().join(""), good = ["a", "b", "d", "f"];
      if (set === "af") return { ok:false, msg:M.same };
      if (good.indexOf(S.eq[0]) >= 0 && good.indexOf(S.eq[1]) >= 0) return { ok:true };
      if (set === "bc") return { ok:false, msg:M.xy };
      if (set === "eg") return { ok:false, msg:M.yz };
      var r = meet(eqById(S.eq[0]), eqById(S.eq[1]));
      if (r.kind === "line") return { ok:false, msg:tpl(M.other, { line:m(lineSrc(r)) }) };
      return { ok:false, msg:r.kind === "same" ? M.same : M.par };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        stopPlay(); busy = true; mark = null; planeA = null; msg = "";
        var s = START[p.id] || START.p1;
        S.mode = s.mode;
        if (s.r0) { S.r0 = s.r0.slice(); S.md = s.md.slice(); S.t = s.t; S.cross = true; }
        if (s.A) { S.A = s.A.slice(); S.B = s.B.slice(); S.tt = s.tt; }
        if (s.eq) S.eq = s.eq.slice();
        V.preset("iso", false);
        api.save(); paintRead(); syncCtrl(); draw();
      },
      run:function(p, done){
        function fin(){ busy = false; planeA = null; api.save(); paintRead(); syncCtrl(); draw(); MV.changed(); done(); }
        function hold(mk, ms){ mark = mk; draw(); MV.wait(ms || 1300, fin); }
        if (p.id === "p1") tw(2200, function(t){ S.t = r9(-3 * t); after("anim"); }, function(){
          S.t = -3; after("anim"); hold({ flash:"xy", labels:[{ p:[-5, 5, 0], text:"(−5, 5, 0): z = 3 + t = 0 at t = −3" }] }, 1500); });
        else if (p.id === "p2") { S.eq = ["h"]; planeA = 0; after("anim"); tw(1600, function(t){ planeA = t; draw(); }, function(){ planeA = null; after("anim");
          hold({ labels:[{ p:[0, 0, 6], text:"a tilted plane fills the box", dy:-14 }] }); }); }
        else if (p.id === "p3") V.preset("front", true, function(){ tw(1600, function(t){ S.t = r9(-1 + 2 * t); after("anim"); }, function(){
          S.t = 1; after("anim"); hold({ labels:[{ p:[4, 2, 2], text:"y = 2 at every point", dx:12, dy:-14, anchor:"start" }] }, 1500); }); });
        else if (p.id === "p4") tw(1600, function(t){ S.tt = r9(0.5 * t); after("anim"); }, function(){
          S.tt = 0.5; after("anim"); hold({ labels:[{ p:[2, 2, 1], text:"midpoint (2, 2, 1)", dx:12, dy:22, anchor:"start" }] }); });
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Two points, one line (four stations of number boxes beside the 3D view) ----------
var A3 = [1, 3, -4], B3 = [3, 1, 0], M3 = [1, -1, 2];
function box(id, aria, val, dis){
  return '<input class="numin l3-bx" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-b="' + id + '" data-k="b' + id + '" aria-label="' + MV.esc(aria) + '" value="' + MV.esc(val == null ? "" : val) + '"' + (dis ? " disabled" : "") + ">";
}
function part3(host, api){
  var S = api.S, C = api.content, SL = C.stations, fb = {};
  if (!SL.some(function(s){ return s.id === S.st; })) S.st = "s1";
  S.v = S.v && typeof S.v === "object" ? S.v : {}; S.ok = S.ok && typeof S.ok === "object" ? S.ok : {}; S.vd = S.vd || {};
  var st = {}; SL.forEach(function(s){ st[s.id] = s; });
  function V_(id){ return S.v[id] == null ? "" : S.v[id]; }
  function B_(id, aria){ return box(id, aria, V_(id), false); }
  function job(id, inner, extra){
    return '<div class="l3-job" data-job="' + id + '">' + inner + '<div class="q-actions"><button type="button" class="btn primary sm" data-chk="' + id + '" data-k="chk' + id + '">Check</button></div>' + (extra || "") + '<div class="l3-jfb" aria-live="polite"></div></div>';
  }
  var T = "<span class=\"m\"><i>t</i></span>";
  var h1 = '<p class="l3-jt">a. Direction</p>' + job("m", '<p class="l3-row">' + m("vec{m} = B - A =") + " (" + B_("m0", "m, x-component") + ", " + B_("m1", "m, y-component") + ", " + B_("m2", "m, z-component") + ")</p>") +
    '<p class="l3-jt">b. Vector form</p>' + job("v", '<p class="l3-row">' + m("vec{r} =") + " (" + B_("v0", "point x") + ", " + B_("v1", "point y") + ", " + B_("v2", "point z") + ") + " + T + "(" + B_("v3", "direction x") + ", " + B_("v4", "direction y") + ", " + B_("v5", "direction z") + ")</p>") +
    '<p class="l3-jt">c. Parametric form</p>' + job("p", [0, 1, 2].map(function(i){ return '<p class="l3-row">' + m(NAMES[i] + " =") + " " + B_("p" + (2 * i), NAMES[i] + " constant term") + " + " + B_("p" + (2 * i + 1), NAMES[i] + " coefficient of t") + " " + T + "</p>"; }).join("")) +
    '<p class="l3-jt">d. Symmetric form</p>' + job("s", '<p class="l3-row l3-symrow">' + [0, 1, 2].map(function(i){ return '<span class="l3-fr"><span class="l3-frt">(' + m(NAMES[i]) + " − " + B_("s" + (2 * i), NAMES[i] + " coordinate of the point") + ')</span><span class="l3-frb">' + B_("s" + (2 * i + 1), "denominator under " + NAMES[i]) + "</span></span>"; }).join(" = ") + "</p>" +
      '<p class="tiny muted">Type the point’s coordinate: for ' + m("(z + 4)") + ", type −4. You’ll see your equations here:</p><p class=\"l3-echo\" id=\"l3-echo\" aria-live=\"polite\"></p>");
  var s2 = st.s2, h2 = s2.pts.map(function(P, k){
    var id = "o" + P.id;
    return '<p class="l3-jt">Point ' + (k + 1) + ": " + ptT(P.p) + "</p>" + job(id, '<p class="l3-row">' + NAMES.map(function(n, i){ return "<span class=\"l3-lb\">from " + m(n) + ": " + m("t =") + " " + B_(id + i, "t from the " + n + "-coordinate") + "</span>"; }).join(" ") + "</p>" +
      '<div class="chips l3-vd" role="group" aria-label="Verdict for point ' + (k + 1) + '"><button type="button" class="chip" data-vd="' + id + '|on" data-k="vd' + id + 'on" aria-pressed="false">On the line</button><button type="button" class="chip" data-vd="' + id + '|off" data-k="vd' + id + 'off" aria-pressed="false">Not on the line</button></div>');
  }).join("");
  var h3 = st.s3.rows.map(function(r){
    var id = "c" + r.id;
    return '<p class="l3-jt">' + r.lab + "</p>" + job(id, '<p class="l3-row">' + m("t =") + " " + B_(id + "t", "t for the " + r.id + "-plane") + ' <span class="l3-lb">point (' + B_(id + "0", "x") + ", " + B_(id + "1", "y") + ", " + B_(id + "2", "z") + ")</span></p>");
  }).join("");
  var h4 = st.s4.eqs.map(function(q){
    var id = "q" + q.id;
    return '<p class="l3-jt">' + q.from + "</p>" + job(id, '<p class="l3-row">' + B_(id + "0", "coefficient of " + q.vars[0]) + " " + m(q.vars[0]) + " + " + B_(id + "1", "coefficient of " + q.vars[1]) + " " + m(q.vars[1]) + " + " + B_(id + "2", "constant") + " = 0</p>");
  }).join("") + '<details class="alg l3-alg"><summary>Check it with algebra</summary><ol>' + st.s4.alg.map(function(l){ return "<li>" + l + "</li>"; }).join("") + "</ol></details>";
  var BODY = { s1:h1, s2:h2, s3:h3, s4:h4 };
  host.innerHTML = '<div class="chips l3-stc" id="l3-stc" role="group" aria-label="Choose a station"></div><div class="l3-p3"><div class="l3-p3L">' +
    SL.map(function(s, k){ return '<div class="l3-stn" data-st="' + s.id + '"><h3>' + s.title + "</h3><p>" + s.text + "</p>" + BODY[s.id] +
      (k < SL.length - 1 ? '<div class="q-actions"><button type="button" class="btn ghost sm" data-next="' + s.id + '" data-k="nx' + s.id + '">Next station</button></div>' : "") + "</div>"; }).join("") +
    '</div><div class="l3-p3R"><div class="l3-vwrap" id="l3-p3v"></div>' + presetBtns() + '<p class="tiny muted l3-cap" id="l3-p3cap" aria-live="polite"></p></div></div>';
  var V = view3d($("#l3-p3v", host), { rotate:true, view:S.vw, onView:function(vw){ S.vw = vw; api.save(); } });

  function vals(ids){ return ids.map(function(id){ return parseQ(S.v[id]); }); }
  function bad(a){ return a.some(function(v){ return v == null || isNaN(v); }); }
  function judge(id){
    var M, a, P, D, i;
    if (id === "m") {
      M = st.s1.msgs; a = vals(["m0", "m1", "m2"]); if (bad(a)) return { msg:M.empty };
      if (same(a, [2, -2, 4]) || same(a, [1, -1, 2])) return { ok:true, msg:M.ok };
      if (same(a, [4, 4, -4])) return { msg:M.sum }; if (same(a, [-2, 2, -4])) return { msg:M.rev };
      return { msg:M.dir };
    }
    if (id === "v" || id === "p" || id === "s") {
      M = st.s1.msgs;
      if (id === "v") { a = vals(["v0", "v1", "v2", "v3", "v4", "v5"]); if (bad(a)) return { msg:M.empty }; P = a.slice(0, 3); D = a.slice(3); }
      else { a = vals([0, 1, 2, 3, 4, 5].map(function(k){ return id + k; })); if (bad(a)) return { msg:M.empty }; P = [a[0], a[2], a[4]]; D = [a[1], a[3], a[5]]; }
      if (id === "s" && D.some(function(v){ return near(v, 0); })) return { msg:M.zero };
      if (zero(D)) return { msg:M.par };
      if (par(P, M3) && !zero(P) && onLine(D, A3, M3)) return { msg:M.swap };
      if (!par(D, M3)) return { msg:M.par };
      if (!onLine(P, A3, M3)) return { msg:M.pt };
      return { ok:true, msg:M.formOk };
    }
    if (id.charAt(0) === "o") {
      M = s2.msgs; var Pt = s2.pts.filter(function(q){ return "o" + q.id === id; })[0];
      a = vals([id + 0, id + 1, id + 2]); if (bad(a) || !S.vd[id]) return { msg:M.empty };
      for (i = 0; i < 3; i++) if (!near(a[i], Pt.ts[i])) return { msg:"Solve the " + m(NAMES[i]) + "-coordinate for " + m("t") + ": " + m(affSrc(A3[i], M3[i]) + " = " + nf(Pt.p[i])) + "." };
      if ((S.vd[id] === "on") !== Pt.on) return { msg:M.verdict };
      return { ok:true, msg:"✓ Correct. " + Pt.why };
    }
    if (id.charAt(0) === "c") {
      M = st.s3.msgs; var R = st.s3.rows.filter(function(r){ return "c" + r.id === id; })[0];
      a = vals([id + "t", id + 0, id + 1, id + 2]); if (bad(a)) return { msg:M.empty };
      if (!near(a[0], R.t)) return { msg:st.s3.rows.some(function(r){ return r !== R && near(a[0], r.t); }) ? M.plane : M.t };
      if (!same(a.slice(1), R.p)) return { msg:M.pt };
      return { ok:true, msg:"✓ Correct. " + m("t = " + nf(R.t)) + ": " + ptT(R.p) + (R.note ? ", " + R.note : "") + "." };
    }
    if (id.charAt(0) === "q") {
      M = st.s4.msgs; var E = st.s4.eqs.filter(function(q){ return "q" + q.id === id; })[0];
      a = vals([id + 0, id + 1, id + 2]); if (bad(a)) return { msg:M.empty }; if (zero(a)) return { msg:M.zero };
      if (par(a, E.n)) return { ok:true, msg:M.ok + " " + E.show + "." };
      return { msg:M.bad };
    }
    return { msg:"" };
  }
  function paintJob(id){
    var el = $('[data-job="' + id + '"]', host); if (!el) return;
    var ok = !!S.ok[id], f = fb[id];
    el.querySelectorAll("input").forEach(function(inp){ inp.disabled = ok; });
    el.querySelectorAll("[data-chk]").forEach(function(b){ b.hidden = ok; });
    el.querySelectorAll("[data-vd]").forEach(function(b){ var p = b.dataset.vd.split("|"), on = S.vd[p[0]] === p[1]; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); b.disabled = ok; });
    var out = $(".l3-jfb", el);
    if (ok) out.innerHTML = MV.fbHTML("good", (f && f.ok ? f.msg : judge(id).msg));
    else out.innerHTML = f ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + f.msg + " Try again.") : "";
    if (f && !f.ok && f.soft) out.innerHTML = MV.fbHTML("", f.msg);
  }
  function echo(){
    var el = $("#l3-echo", host); if (!el) return;
    var a = vals(["s0", "s1", "s2", "s3", "s4", "s5"]);
    if (bad(a)) { el.innerHTML = '<span class="muted">(fill in all six boxes)</span>'; return; }
    el.innerHTML = m([0, 1, 2].map(function(i){ return symTop(a[2 * i], NAMES[i]) + "/" + (a[2 * i + 1] >= 0 ? nf(a[2 * i + 1]) : "(" + nf(a[2 * i + 1]) + ")"); }).join(" = "));
  }
  function draw(){
    var id = S.st, sc = { planes:[], lines:[], segs:[], arrows:[], dots:[], rings:[], labels:[] }, desc = "3D view with A(1, 3, −4) and B(3, 1, 0).";
    var lineOn = id !== "s1" || S.ok.v || S.ok.p || S.ok.s;
    if (id === "s4" && S.ok.qe1 && S.ok.qe2) sc.lines.push({ p:A3, d:M3, cls:"hiseg" });
    if (id === "s4") st.s4.eqs.forEach(function(q, k){ if (S.ok["q" + q.id]) { var n = q.vars[1] === "y" ? [q.n[0], q.n[1], 0] : [q.n[0], 0, q.n[1]]; sc.planes.push({ n:n, d:-q.n[2], cls:k ? "pl2" : "pl1" }); } });
    if (lineOn) { sc.lines.push({ p:A3, d:M3, cls:"ink" }); desc += " The line through them, r = (1, 3, −4) + t(1, −1, 2), is drawn."; }
    if (id === "s1" && S.ok.m) { sc.arrows.push({ a:A3, b:B3, cls:"pen", w:3.4 }); desc += " The blue arrow is m = B − A = (2, −2, 4)."; }
    sc.dots.push({ p:A3, cls:"ink2", r:5 }, { p:B3, cls:"ink2", r:5 });
    sc.labels.push({ p:A3, text:"A", dx:-10, dy:-6, anchor:"end" }, { p:B3, text:"B", dx:10, dy:-6, anchor:"start" });
    if (id === "s2") s2.pts.forEach(function(P){
      sc.dots.push({ p:P.p, cls:P.on ? "pen" : "f3", r:6 }); sc.labels.push({ p:P.p, text:ptT(P.p), dx:10, dy:P.on ? -8 : -10, anchor:"start" });
      if (!P.on && S.ok["o" + P.id]) { var q = [2, 2, -2]; sc.dots.push({ p:q, cls:"ink", r:5 }); sc.segs.push({ a:q, b:P.p, cls:"guide" }); sc.labels.push({ p:q, text:"(2, 2, −2) on the line", dx:10, dy:16, anchor:"start" }); desc += " (2, 2, −2) is on the line, just below (2, 2, −1)."; }
    });
    if (id === "s3") st.s3.rows.forEach(function(r){ if (S.ok["c" + r.id]) { sc.rings.push({ p:r.p }); sc.labels.push({ p:r.p, text:ptT(r.p), dx:12, dy:18, anchor:"start" }); desc += " Ring at " + ptT(r.p) + " on the " + r.id + "-plane."; } });
    if (id === "s4") { var n4 = st.s4.eqs.filter(function(q){ return S.ok["q" + q.id]; }).map(function(q){ return MV.plain(q.show); }); if (n4.length) desc += " Planes drawn: " + n4.join(" and ") + (n4.length === 2 ? "; they meet in the line." : "."); }
    sc.describe = desc;
    V.draw(sc);
    $("#l3-p3cap", host).textContent = desc;
  }
  function show(){
    MV.keepFocus($("#l3-stc", host), function(){
      $("#l3-stc", host).innerHTML = SL.map(function(s){ var on = s.id === S.st; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-stc="' + s.id + '" data-k="stc' + s.id + '" aria-pressed="' + on + '">' + s.chip + "</button>"; }).join("");
    });
    SL.forEach(function(s){ $('[data-st="' + s.id + '"]', host).hidden = s.id !== S.st; });
    draw();
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.b) return; S.v[t.dataset.b] = t.value; api.save(); if (/^s\d$/.test(t.dataset.b)) echo(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.b) return; var j = e.target.closest("[data-job]"), b = j && j.querySelector("[data-chk]"); if (b && !b.hidden) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.vp) { V.preset(b.dataset.vp, true); return; }
    if (b.dataset.stc) { S.st = b.dataset.stc; api.save(); show(); return; }
    if (b.dataset.next) { var i = SL.map(function(s){ return s.id; }).indexOf(b.dataset.next); S.st = SL[i + 1].id; api.save(); show(); var c = $('[data-stc="' + S.st + '"]', host); if (c) c.focus(); return; }
    if (b.dataset.vd) { var p = b.dataset.vd.split("|"); S.vd[p[0]] = p[1]; api.save(); MV.keepFocus($('[data-job="' + p[0] + '"]', host), function(){ paintJob(p[0]); }); return; }
    if (b.dataset.chk) {
      var id = b.dataset.chk, r = judge(id);
      fb[id] = r; if (r.ok) S.ok[id] = true;
      if (!r.ok && /Fill in/.test(r.msg)) fb[id] = { msg:r.msg, soft:true };
      api.save(); paintJob(id); draw();
      MV.focusFb($('[data-job="' + id + '"]', host));
    }
  });
  host.querySelectorAll("[data-job]").forEach(function(el){ paintJob(el.dataset.job); });
  echo(); show();
  return {};
}

// ---------- Practice 2: Find it in space (coordinate boxes; named wrong answers; first-try scoring) ----------
function spaceAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs || {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:[], yn:null, tries:0, hint:0, solved:false, first:null }); }
  function inputs(it){
    var x = ist(it.id), dis = x.solved, v = function(k){ return x.v[k] == null ? "" : x.v[k]; }, bx = function(k, aria){ return box(it.id + "|" + k, aria, v(k), dis); };
    if (it.kind === "pt") return "(" + bx(0, "x-coordinate") + ", " + bx(1, "y-coordinate") + ", " + bx(2, "z-coordinate") + ")";
    if (it.kind === "ab") return '<span class="l3-lb">' + m("a =") + " " + bx(0, "a") + '</span> <span class="l3-lb">' + m("b =") + " " + bx(1, "b") + "</span>";
    if (it.kind === "k") return '<span class="l3-lb">' + m("k =") + " " + bx(0, "k") + "</span>";
    if (it.kind === "two") return '<span class="l3-lb">' + m("x - 2y +") + " " + bx(0, "constant in the first plane") + ' = 0</span> <span class="l3-lb">' + m("3y + z +") + " " + bx(1, "constant in the second plane") + " = 0</span>";
    return '<span class="chips l3-yn" role="group" aria-label="Yes or no">' + ["yes", "no"].map(function(c){ var on = x.yn === c; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-yn="' + c + '" data-k="' + it.id + c + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + (c === "yes" ? "Yes" : "No") + "</button>"; }).join("") +
      '</span> <span class="l3-lb">' + m("t =") + " " + bx(0, "t") + "</span>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q l3-sq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="l3-sin"></div><div class="l3-scl"></div></div>';
  }).join("");
  function paintIn(it){ var el = $('[data-q="' + it.id + '"] .l3-sin', host); MV.keepFocus(el, function(){ el.innerHTML = '<p class="l3-row">' + inputs(it) + "</p>"; }); }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .l3-scl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function judge(it){
    var x = ist(it.id), A = MV.ans(it), n = it.kind === "pt" ? 3 : it.kind === "ab" || it.kind === "two" ? 2 : 1;
    if (it.kind === "yn") {
      if (!x.yn) return { err:TX.yn };
      if (x.yn === "no") return { ok:false, msg:it.wrongDefault };
      var tv = parseQ(x.v[0]); if (tv == null) return { err:TX.empty }; if (isNaN(tv)) return { err:TX.err };
      return near(tv, A[1]) ? { ok:true } : { ok:false, msg:it.wrongDefault };
    }
    var v = [];
    for (var k = 0; k < n; k++) { var q = parseQ(x.v[k]); if (q == null) return { err:TX.empty }; if (isNaN(q)) return { err:TX.err }; v.push(q); }
    if (v.every(function(z, k){ return near(z, A[k]); })) return { ok:true };
    var W = it.wrong || [];
    for (var i = 0; i < W.length; i++) if (W[i].v.every(function(z, k){ return z == null || near(v[k], z); })) return { ok:false, msg:W[i].fb };
    return { ok:false, msg:it.wrongDefault };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.b) return; var p = t.dataset.b.split("|"); ist(p[0]).v[+p[1]] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.b) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.yn) { x.yn = b.dataset.yn; api.save(); paintIn(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Through P, tilted just right ----------
var task = (function(){
  var api, V, P = [2, 1, -1], KEYS = ["a", "b", "c", "d", "e", "f"], LIM = { a:5, b:5, c:5, d:4, e:4, f:4 };
  function read(){
    var s = api ? api.S : {}, o = {}, ok = true;
    KEYS.forEach(function(k){ var v = +s[k]; if (!Number.isInteger(v) || Math.abs(v) > LIM[k]) ok = false; o[k] = v; });
    o.r0 = [o.a, o.b, o.c]; o.m = [o.d, o.e, o.f]; o.valid = ok && !zero(o.m);
    return o;
  }
  function crossZ(d){ if (!d.f) return null; var t = Q.of(-d.c, d.f); return [Q.add(Q.of(d.a, 1), Q.mul(t, Q.of(d.d, 1))), Q.add(Q.of(d.b, 1), Q.mul(t, Q.of(d.e, 1))), Q.of(0, 1)]; }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    var cz = crossZ(d);
    return [onLine(P, d.r0, d.m), !!cz && cz[0].d === 1 && cz[1].d === 1, d.d + d.e + d.f === 0, !!(d.d && d.e && d.f)];
  }
  function draw(){
    if (!V) return;
    var d = read(), sc = { lines:[], segs:[], arrows:[], dots:[], rings:[], labels:[] };
    sc.dots.push({ p:P, cls:"f3", r:6 }); sc.labels.push({ p:P, text:"P(2, 1, −1)", dx:10, dy:16, anchor:"start" });
    if (d.valid) {
      sc.lines.push({ p:d.r0, d:d.m, cls:"ink" });
      sc.arrows.push({ a:d.r0, b:add(d.r0, d.m), cls:"pen", w:3.4 });
      sc.dots.push({ p:d.r0, cls:"ink2", r:4.5 });
      var cz = crossZ(d);
      if (cz) { var v = cz.map(Q.val); if (v.every(function(z){ return Math.abs(z) <= 6; })) { sc.rings.push({ p:v }); sc.labels.push({ p:v, text:qPt(cz), dx:12, dy:18, anchor:"start" }); } }
      sc.describe = sentence(d.r0, d.m) + " P(2, 1, −1) is " + (onLine(P, d.r0, d.m) ? "on" : "not on") + " the line.";
    } else sc.describe = "P(2, 1, −1). Choose a direction that isn’t (0, 0, 0) to draw your line.";
    V.draw(sc);
  }
  function readout(){
    var d = read(), el = $("#l3-tread"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Choose a direction that isn’t (0, 0, 0).</dd></div>'; return; }
    var cz = crossZ(d), s = d.d + d.e + d.f;
    el.innerHTML = MV.readoutHTML([["Your line", m("vec{r} = " + ptT(d.r0) + " + t" + ptT(d.m))],
      [m("vec{m} · (1, 1, 1)"), m(nf(d.d) + " + " + (d.e < 0 ? "(" + nf(d.e) + ")" : nf(d.e)) + " + " + (d.f < 0 ? "(" + nf(d.f) + ")" : nf(d.f)) + " = " + nf(s))],
      ["Crosses the " + m("xy") + "-plane", cz ? "at " + m("t = " + qT(Q.of(-d.c, d.f))) + ": " + qPt(cz) : d.c === 0 ? "lies in it (" + m("f = 0") + ", " + m("c = 0") + ")" : "never (" + m("f = 0") + ")"]]);
  }
  function paintIn(inp){ KEYS.forEach(function(k){ var el = $("#l3-k" + k, inp); if (el && document.activeElement !== el) el.value = api.S[k]; }); }
  function canon(d){ var g = gcd(gcd(d.d, d.e), d.f) || 1, s = d.f < 0 || (!d.f && (d.e < 0 || (!d.e && d.d < 0))) ? -1 : 1; return [d.d, d.e, d.f].map(function(v){ return v / g * s + 0; }); }
  return {
    render:function(inp, pv, a){
      api = a; KEYS.forEach(function(k, i){ if (!(Number.isInteger(+a.S[k]) && Math.abs(+a.S[k]) <= LIM[k])) a.S[k] = [0, 0, 0, 1, 1, 1][i]; });
      if (zero([+a.S.d, +a.S.e, +a.S.f])) a.S.f = 1;
      function st(k, lab){ return '<label class="l3-st"><span>' + m(k) + '</span><input type="number" class="numin l3-num" id="l3-k' + k + '" min="' + -LIM[k] + '" max="' + LIM[k] + '" step="1" aria-label="' + lab + ", whole number from " + -LIM[k] + " to " + LIM[k] + '"></label>'; }
      inp.innerHTML = '<p class="l3-gt">Point (' + m("a, b, c") + ')</p><div class="l3-trio">' + st("a", "a") + st("b", "b") + st("c", "c") + "</div>" +
        '<p class="l3-gt">Direction (' + m("d, e, f") + '), not all 0</p><div class="l3-trio">' + st("d", "d") + st("e", "e") + st("f", "f") + '</div><p class="tiny l3-msg" id="l3-tmsg" aria-live="polite"></p>';
      pv.innerHTML = '<div class="l3-vwrap l3-tv" id="l3-tv"></div><dl class="read" id="l3-tread" aria-live="polite" style="margin-top:10px"></dl>';
      V = view3d($("#l3-tv", pv), { rotate:true });
      inp.addEventListener("input", function(e){
        var t = e.target, k = t.id && t.id.replace("l3-k", ""); if (KEYS.indexOf(k) < 0) return;
        var v = parseInt(t.value, 10); if (isNaN(v) || String(v) !== t.value.trim().replace(/^\+/, "")) return;
        v = clamp(v, -LIM[k], LIM[k]);
        var nm = [+a.S.d, +a.S.e, +a.S.f], idx = "def".indexOf(k);
        if (idx >= 0) { nm[idx] = v; if (zero(nm)) { $("#l3-tmsg", inp).textContent = "The direction can’t be (0, 0, 0)."; return; } }
        $("#l3-tmsg", inp).textContent = "";
        a.S[k] = v; a.save(); draw(); readout(); a.update();
      });
      inp.addEventListener("change", function(e){ var k = e.target.id && e.target.id.replace("l3-k", ""); if (KEYS.indexOf(k) >= 0) e.target.value = a.S[k]; });
      paintIn(inp); draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose a direction that isn’t (0, 0, 0)."; },
    checks:checks,
    key:function(d){ return canon(d).join(","); },
    label:function(k){ return m("vec{r} = (2, 1, -1) + t(" + k.split(",").join(", ") + ")"); },
    text:function(k){ return "r = (2, 1, −1) + t(" + k.split(",").map(function(v){ return nf(+v); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ space:spaceAct },
  task:task
});
})();
