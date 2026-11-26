// MCV4U 53 Intersection of Lines with Planes: hero (V1 3D view: three lines meet x + y + z = 6 in one point, no point and
// every point), Line meets plane (Explore: V1 3D view with a plane meter and a meter-against-t graph; Free, Three cases and
// Perpendicular-from-a-point modes), Classify before you compute (Part 3: a tap-through decision tree per case, a 3D view
// that confirms, and the substituted equation), Find it / Work backwards (custom point entry) and the "Aim the laser" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, Q = MV.mcv.Q, PI = Math.PI;
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function fill(s, a, b){ return String(s).replace("#1", a).replace("#2", b == null ? "" : b); }

// ---------- vectors (integer arrays stay exact) ----------
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function mul(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len(a){ return Math.sqrt(dot(a, a)); }
function unit(a){ var l = len(a) || 1; return mul(a, 1 / l); }
function isZero(a){ return !a[0] && !a[1] && !a[2]; }
function para(a, b){ return !isZero(a) && !isZero(b) && isZero(cross(a, b)); }
function same(a, b){ return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; }
// the same plane: [A, B, C, D] proportional
function samePlane(P, R){ var k = null; for (var i = 0; i < 4; i++) { if (!P[i] !== !R[i]) return false; if (R[i]) { var r = P[i] / R[i]; if (k === null) k = r; else if (Math.abs(r - k) > 1e-12) return false; } } return k !== null; }

// ---------- exact numbers ----------
function qs(q){ return (q.n < 0 ? "-" : "") + Math.abs(q.n) + (q.d !== 1 ? "/" + q.d : ""); }   // m() source, inline fraction
function ptSrc(arr){ return "(" + arr.map(qs).join(", ") + ")"; }
function ptPlain(arr){ return MV.plain(m(ptSrc(arr))); }
function parseQ(s){
  s = String(s).replace(/[−–]/g, "-").replace(/\s+/g, "");
  var r = /^([+-]?)(\d+(?:\.\d+)?|\.\d+)(?:\/(\d+(?:\.\d+)?))?$/.exec(s);
  if (!r) return null;
  var a = Q.of(parseFloat(r[2])), b = r[3] ? Q.of(parseFloat(r[3])) : Q.of(1);
  if (!a || !b || !b.n) return null;
  var q = Q.div(a, b); return r[1] === "-" ? Q.neg(q) : q;
}
// "(5, 2, 0)", "5, 2, 0", "t = 2", "7/2, 2, −3/2" -> {v:[Q…]} (1 or 3 values), {blank} or {bad}
function parsePt(raw){
  var s = String(raw == null ? "" : raw).trim();
  if (!s) return { blank:true };
  s = s.replace(/^[a-z]\s*=\s*/i, "").replace(/^[A-Z]\s*(?=\()/, "").replace(/^\s*[(\[]\s*/, "").replace(/\s*[)\]]\s*$/, "");
  var parts = /[,;]/.test(s) ? s.split(/[,;]/) : s.trim().split(/\s+/);
  var out = parts.map(parseQ);
  if (out.some(function(q){ return !q; }) || (out.length !== 1 && out.length !== 3)) return { bad:true };
  return { v:out };
}
function qArr(strs){ return strs.map(parseQ); }
function eqPt(a, b){ return a.length === b.length && a.every(function(q, i){ return Q.eq(q, b[i]); }); }

// ---------- equation sources ----------
function coefT(k, v){ return k === 1 ? v : k === -1 ? "-" + v : k + v; }
function lin(c, k){ if (!k) return String(c); if (!c) return coefT(k, "t"); return c + (k > 0 ? " + " : " - ") + coefT(Math.abs(k), "t"); }
function poly(terms, c0){
  var s = "";
  terms.forEach(function(tm){ var k = tm[0], a = Math.abs(k), body; if (!k) return; body = (a === 1 ? "" : a) + tm[1]; s += s ? (k < 0 ? " - " : " + ") + body : (k < 0 ? "-" : "") + body; });
  if (c0) s += s ? (c0 < 0 ? " - " : " + ") + Math.abs(c0) : String(c0);
  return s || "0";
}
var XYZ = ["x", "y", "z"];
function planeSrc(P){ return poly([[P[0], "x"], [P[1], "y"], [P[2], "z"]], P[3]) + " = 0"; }
function planeEq(P){ return poly([[P[0], "x"], [P[1], "y"], [P[2], "z"]], 0) + " = " + (-P[3] || 0); }
function paramSrc(r0, mv){ return XYZ.map(function(v, i){ return v + " = " + lin(r0[i], mv[i]); }).join(", "); }
function vecSrc(v){ return "(" + v.join(", ") + ")"; }
function resultSrc(c0, c1){ return (c1 ? poly([[c1, "t"]], c0) : "0t" + (c0 ? (c0 < 0 ? " - " : " + ") + Math.abs(c0) : "")) + " = 0"; }
function subSrc(P, r0, mv){
  var parts = [];
  for (var i = 0; i < 3; i++) {
    if (!P[i]) continue;
    var L = lin(r0[i], mv[i]), single = !r0[i] || !mv[i], body;
    if (P[i] === 1) body = single ? L : "(" + L + ")";
    else if (P[i] === -1) body = single && L.charAt(0) !== "-" ? "-" + L : "-(" + L + ")";
    else body = P[i] + "(" + L + ")";
    parts.push(body);
  }
  var s = parts.map(function(b, j){ return j === 0 ? b : b.charAt(0) === "-" ? " - " + b.slice(1) : " + " + b; }).join("");
  if (P[3]) s += (P[3] < 0 ? " - " : " + ") + Math.abs(P[3]);
  return s + " = 0";
}
// substitution facts for plane P = [A, B, C, D] and line r0 + t m
function calc(P, r0, mv){
  var n = [P[0], P[1], P[2]], k = { n:n, validN:!isZero(n), validM:!isZero(mv) };
  k.c0 = dot(n, r0) + P[3]; k.c1 = dot(n, mv);
  k.kind = k.c1 ? "one" : k.c0 ? "none" : "in";
  if (k.c1) {
    k.ts = Q.of(-k.c0, k.c1); k.tsv = k.ts.n / k.ts.d;
    k.pt = r0.map(function(x, i){ return Q.add(Q.of(x), Q.mul(k.ts, Q.of(mv[i]))); });
  }
  return k;
}

// =====================================================================================================================
// @component V1 view3d — a 3D view in SVG (orthographic, z up, MCV4U chapters 7–9): the view box’s edges, x/y/z axes with
// unit ticks, planes clipped to the box (translucent --pen fill), polygons (a panel), lines clipped to the box (the part
// behind a plane drawn faint; a glow for a line lying in a plane), arrows (direction in --pen, normal in --f4), points,
// right-angle marks, 3D and screen labels. Drag or arrow keys rotate (Shift = bigger steps); presets iso/front/side/top.
// View3D(host, {lo, hi, h, az, el, still, aria, onRotate}) -> {set(scene), view(id), redraw(), get()}.
// scene = {planes:[{n, D, cls}], polys:[{pts, cls}], lines:[{p0, m, cls, split:{n, D}, glow, range:[t0, t1]}],
//          segs:[{a, b, cls}], arrows:[{a, b, cls, label}], points:[{p, cls, label, flash, r}], marks:[{at, u, v}],
//          labels:[{p, t, cls, dx, dy}], notes:[{x, y, t, cls, anchor}], describe}
var VIEWS = { iso:{ az:45, el:35.26 }, front:{ az:0, el:0 }, side:{ az:90, el:0 }, top:{ az:-90, el:90 } };
function corners(lo, hi){ var c = []; for (var i = 0; i < 8; i++) c.push([i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]]); return c; }
var EDGES = (function(){ var e = []; for (var i = 0; i < 8; i++) for (var b = 1; b < 8; b <<= 1) if (!(i & b)) e.push([i, i | b]); return e; })();
function planePoly(n, D, lo, hi){
  if (isZero(n)) return null;
  var C = corners(lo, hi), P = [];
  function push(p){ for (var j = 0; j < P.length; j++) if (len(sub(P[j], p)) < 1e-9) return; P.push(p); }
  EDGES.forEach(function(e){
    var p = C[e[0]], q = C[e[1]], fp = dot(n, p) + D, fq = dot(n, q) + D;
    if (Math.abs(fp) < 1e-12) push(p);
    if (Math.abs(fq) < 1e-12) push(q);
    if (fp * fq < 0) push(add(p, mul(sub(q, p), fp / (fp - fq))));
  });
  if (P.length < 3) return null;
  var c = mul(P.reduce(add, [0, 0, 0]), 1 / P.length), e1 = unit(sub(P[0], c)), e2 = cross(unit(n), e1);
  P.sort(function(a, b){ var da = sub(a, c), db = sub(b, c); return Math.atan2(dot(da, e2), dot(da, e1)) - Math.atan2(dot(db, e2), dot(db, e1)); });
  return P;
}
function polyCentroid(P){ return P ? mul(P.reduce(add, [0, 0, 0]), 1 / P.length) : null; }
function clipLine(p0, mv, lo, hi){
  var t0 = -Infinity, t1 = Infinity;
  for (var i = 0; i < 3; i++) {
    if (!mv[i]) { if (p0[i] < lo[i] - 1e-9 || p0[i] > hi[i] + 1e-9) return null; continue; }
    var a = (lo[i] - p0[i]) / mv[i], b = (hi[i] - p0[i]) / mv[i];
    t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
  }
  return t0 <= t1 ? [t0, t1] : null;
}
function inBox(p, lo, hi){ for (var i = 0; i < 3; i++) if (p[i] < lo[i] - 1e-9 || p[i] > hi[i] + 1e-9) return false; return true; }
function rightMark(F, mv, n, toward){
  var a = mul(unit(mv), 0.75 * (toward < 0 ? -1 : 1)), e = cross(n, [0, 0, 1]);
  if (isZero(e)) e = cross(n, [1, 0, 0]);
  return { at:F, u:a, v:mul(unit(e), 0.75) };
}
function View3D(host, o){
  var W = 400, H = o.h || 360, lo = o.lo, hi = o.hi, C = mul(add(lo, hi), 0.5), R = 0.5 * len(sub(hi, lo)), s = (Math.min(W, H) / 2 - 16) / R;
  var st = { az:o.az == null ? VIEWS.iso.az : o.az, el:o.el == null ? 28 : o.el }, sc = null, U, VV, DD;
  host.innerHTML = '<svg class="lp3' + (o.still ? "" : " lp3-live") + '" viewBox="0 0 ' + W + " " + H + '" role="img"' + (o.still ? "" : ' tabindex="0"') + ' aria-label="' + MV.esc(o.aria || "") + '"></svg>';
  var svg = host.querySelector("svg");
  function basis(){
    var a = st.az * PI / 180, e = st.el * PI / 180;
    U = [-Math.sin(a), Math.cos(a), 0]; VV = [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)];
    DD = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
  }
  function P2(p){ var q = sub(p, C); return [W / 2 + s * dot(q, U), H / 2 - s * dot(q, VV)]; }
  function r1(v){ return Math.round(v * 10) / 10; }
  function pts(arr){ return arr.map(function(p){ var q = P2(p); return r1(q[0]) + "," + r1(q[1]); }).join(" "); }
  function seg(a, b, cls){ var p = P2(a), q = P2(b); return '<line class="' + cls + '" x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(q[0]) + '" y2="' + r1(q[1]) + '"/>'; }
  function txt(x, y, t, cls, anchor){ return '<text class="lp-lab' + (cls ? " " + cls : "") + '" x="' + r1(x) + '" y="' + r1(y) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + MV.esc(t) + "</text>"; }
  function label3(p, t, cls, dx, dy){ var q = P2(p); return txt(q[0] + (dx == null ? 8 : dx), q[1] + (dy == null ? -8 : dy), t, cls); }
  function arrow(a, b, cls, label){
    var p = P2(a), q = P2(b), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), out = "";
    if (L < 2) return '<circle class="' + cls + ' lp-ah" cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="4"/>' + (label ? txt(q[0] + 8, q[1] - 8, label, cls + "-t lp-it") : "");
    var ux = dx / L, uy = dy / L, hl = Math.min(11, L * 0.6), bx = q[0] - ux * hl, by = q[1] - uy * hl;
    out += '<line class="' + cls + '" x1="' + r1(p[0]) + '" y1="' + r1(p[1]) + '" x2="' + r1(bx) + '" y2="' + r1(by) + '"/>';
    out += '<polygon class="' + cls + ' lp-ah" points="' + r1(q[0]) + "," + r1(q[1]) + " " + r1(bx - uy * 5) + "," + r1(by + ux * 5) + " " + r1(bx + uy * 5) + "," + r1(by - ux * 5) + '"/>';
    if (label) out += txt(q[0] + ux * 10 + (ux >= 0 ? 4 : -4), q[1] + uy * 10 + 4, label, cls + "-t lp-it", ux >= 0 ? "start" : "end");
    return out;
  }
  function draw(){
    if (!sc) return;
    basis();
    var out = "", CN = corners(lo, hi);
    EDGES.forEach(function(e){ out += seg(CN[e[0]], CN[e[1]], "lp-box"); });
    // axes through the origin (or the low corner when the origin is outside the box)
    var O = [0, 1, 2].map(function(i){ return lo[i] <= 0 && hi[i] >= 0 ? 0 : lo[i]; });
    for (var i = 0; i < 3; i++) {
      var a = O.slice(), b = O.slice(); a[i] = lo[i]; b[i] = hi[i];
      out += arrow(a, b, "lp-axis", "");
      for (var k = Math.ceil(lo[i]); k <= Math.floor(hi[i]) - 0.5; k++) { if (!k) continue; var tp = O.slice(); tp[i] = k; var q = P2(tp); out += '<circle class="lp-tick" cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="1.6"/>'; if (k % 5 === 0) out += txt(q[0] + 5, q[1] + 13, String(k).replace("-", MV.MINUS), "lp-tn"); }
      var e = P2(b); out += txt(e[0] + 6, e[1] - 6, XYZ[i], "lp-axl lp-it");
    }
    (sc.planes || []).forEach(function(pl){ var P = planePoly(pl.n, pl.D, lo, hi); if (P) out += '<polygon class="' + (pl.cls || "lp-plane") + '" points="' + pts(P) + '"/>'; });
    (sc.polys || []).forEach(function(pg){ out += '<polygon class="' + (pg.cls || "lp-panel") + '" points="' + pts(pg.pts) + '"/>'; });
    (sc.lines || []).forEach(function(L){
      var r = clipLine(L.p0, L.m, lo, hi); if (!r) return;
      if (L.range) { r = [Math.max(r[0], L.range[0]), Math.min(r[1], L.range[1])]; if (r[0] >= r[1]) return; }
      var cuts = [r[0]], sp = L.split, nd = sp ? dot(sp.n, DD) : 0;
      if (sp) { var c1 = dot(sp.n, L.m), c0 = dot(sp.n, L.p0) + sp.D; if (c1) { var tt = -c0 / c1; if (tt > r[0] && tt < r[1]) cuts.push(tt); } }
      cuts.push(r[1]);
      if (L.glow) out += seg(add(L.p0, mul(L.m, r[0])), add(L.p0, mul(L.m, r[1])), "lp-glow");
      for (var j = 0; j + 1 < cuts.length; j++) {
        var A = add(L.p0, mul(L.m, cuts[j])), B = add(L.p0, mul(L.m, cuts[j + 1])), mid = mul(add(A, B), 0.5);
        var behind = sp && !L.glow && (dot(sp.n, mid) + sp.D) * nd < -1e-9;
        out += seg(A, B, (L.cls || "lp-line") + (behind ? " lp-behind" : ""));
      }
    });
    (sc.segs || []).forEach(function(g){ out += seg(g.a, g.b, g.cls); });
    (sc.marks || []).forEach(function(k){ out += '<polyline class="lp-mark" points="' + pts([add(k.at, k.u), add(add(k.at, k.u), k.v), add(k.at, k.v)]) + '"/>'; });
    (sc.arrows || []).forEach(function(a){ out += arrow(a.a, a.b, a.cls, a.label); });
    (sc.points || []).forEach(function(p){
      var q = P2(p.p);
      if (p.flash) out += '<circle class="lp-flash" cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="13"/>';
      out += '<circle class="' + (p.cls || "lp-pt") + '" cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="' + (p.r || 6) + '"/>';
      if (p.label) out += txt(q[0] + 10, q[1] - 10, p.label, "lp-plab");
    });
    (sc.labels || []).forEach(function(L){ out += label3(L.p, L.t, L.cls, L.dx, L.dy); });
    (sc.notes || []).forEach(function(nt){ out += txt(nt.x, nt.y, nt.t, nt.cls || "lp-note", nt.anchor); });
    svg.innerHTML = out;
    svg.setAttribute("aria-label", sc.describe || o.aria || "");
  }
  if (!o.still) {
    var drag = null;
    svg.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
    svg.addEventListener("pointermove", function(e){
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x:e.clientX, y:e.clientY };
      st.az = (st.az - dx * 0.5) % 360; st.el = clamp(st.el + dy * 0.5, -89, 90); draw(); if (o.onRotate) o.onRotate(st);
    });
    var end = function(){ drag = null; };
    svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
    svg.addEventListener("keydown", function(e){
      var k = e.key, step = e.shiftKey ? 15 : 5;
      if (k === "ArrowLeft") st.az = (st.az - step) % 360; else if (k === "ArrowRight") st.az = (st.az + step) % 360;
      else if (k === "ArrowUp") st.el = clamp(st.el + step, -89, 90); else if (k === "ArrowDown") st.el = clamp(st.el - step, -89, 90); else return;
      e.preventDefault(); draw(); if (o.onRotate) o.onRotate(st);
    });
  }
  return {
    set:function(scene){ sc = scene; draw(); },
    view:function(id){ var v = VIEWS[id]; if (v) { st.az = v.az; st.el = v.el; draw(); if (o.onRotate) o.onRotate(st); } },
    setAngles:function(az, el){ if (typeof az === "number") st.az = az; if (typeof el === "number") st.el = clamp(el, -89, 90); draw(); },
    redraw:draw, get:function(){ return st; }, svg:svg
  };
}
function viewBtns(T, pre){
  return '<div class="lp-vctl"><span class="tiny lp-h">' + T.view + '</span><span class="seg" role="group" aria-label="' + MV.esc(T.view) + '">' +
    T.views.map(function(v){ return '<button type="button" class="lp-vb" data-vw="' + v.id + '" data-k="' + pre + "vw" + v.id + '">' + v.t + "</button>"; }).join("") + "</span></div>";
}
// a normal arrow from the middle of the plane’s visible patch
function normalArrow(n, D, lo, hi, size){ var c = polyCentroid(planePoly(n, D, lo, hi)); return c ? { a:c, b:add(c, mul(unit(n), size)), cls:"lp-nrm", label:"n⃗" } : null; }
// ------------------------------------------------------ end of V1 view3d ------------------------------------------------------

// =====================================================================================================================
// ---------- hero: x + y + z = 6 and three lines: one point, no point, every point ----------
var HERO = { lo:[-1, -1, -1], hi:[7, 7, 7], n:[1, 1, 1], D:-6,
  L:[{ r0:[0, 0, 0], m:[1, 2, 3], a:-0.6, b:1, lab:"`6t - 6 = 0` → `t = 1`: one point", short:"one point" },
     { r0:[1, 1, 1], m:[1, -1, 0], a:-1.9, b:1.9, lab:"`0t - 3 = 0`: no point", short:"no point" },
     { r0:[2, 2, 2], m:[1, -1, 0], a:-2.8, b:2.8, lab:"`0t = 0`: every point", short:"every point" }] };
function heroScene(i, t, fin){
  var L = HERO.L[i], k = calc([1, 1, 1, -6], L.r0, L.m), P = add(L.r0, mul(L.m, t)), hit = i === 0 && fin;
  var sc = { planes:[{ n:HERO.n, D:HERO.D }], arrows:[normalArrow(HERO.n, HERO.D, HERO.lo, HERO.hi, 2.2)],
    lines:[{ p0:L.r0, m:L.m, split:{ n:HERO.n, D:HERO.D }, glow:k.kind === "in" }],
    points:[{ p:P, cls:"lp-pt" + (hit ? " lp-hit" : ""), label:hit ? "(1, 2, 3)" : "", flash:hit }] };
  sc.describe = "3D view of the plane x + y + z = 6 with its normal and the line " + MV.plain(m("vec{r} = " + vecSrc(L.r0) + " + t" + vecSrc(L.m))) + ": " +
    (i === 0 ? "it pierces the plane at (1, 2, 3) when t = 1." : i === 1 ? "it runs parallel to the plane and never touches it; substituting gives 0t − 3 = 0." : "it lies in the plane; substituting gives 0t = 0.");
  return sc;
}
function hero(f){
  var host = $("#lp-hero"); if (!host) return;
  if (MV.reduceMotion) {
    host.classList.add("lp-hero3");
    host.innerHTML = HERO.L.map(function(L, i){ return '<div class="lp-hf"><div class="lp-hv" id="lp-hv' + i + '"></div><p class="tiny lp-hc">' + md(L.lab) + "</p></div>"; }).join("");
    HERO.L.forEach(function(L, i){ var v = View3D($("#lp-hv" + i), { lo:HERO.lo, hi:HERO.hi, still:true, h:340 }); v.set(heroScene(i, i === 0 ? 1 : L.b * 0.4, true)); });
    if (f.cap) f.cap.innerHTML = "One equation in " + m("t") + ", three endings: one point, no point, every point.";
    return;
  }
  var V = View3D(host, { lo:HERO.lo, hi:HERO.hi, still:true, h:340 });
  function cap(h){ if (f.cap) f.cap.innerHTML = h; }
  function stage(i, cb){
    var L = HERO.L[i];
    cap(md(L.lab.split(":")[0]) + " …");
    V.set(heroScene(i, L.a, false));
    MV.wait(500, function(){
      MV.tween({ dur:i === 0 ? 1700 : 2400, ease:function(t){ return t; }, step:function(t){ V.set(heroScene(i, L.a + (L.b - L.a) * t, false)); },
        done:function(){ V.set(heroScene(i, L.b, true)); cap(md(L.lab)); MV.wait(1700, cb); } });
    });
  }
  function fin(){
    var sc = { planes:[{ n:HERO.n, D:HERO.D }], arrows:[normalArrow(HERO.n, HERO.D, HERO.lo, HERO.hi, 2.2)], lines:[], points:[], labels:[] };
    HERO.L.forEach(function(L, i){
      sc.lines.push({ p0:L.r0, m:L.m, split:{ n:HERO.n, D:HERO.D }, glow:i === 2 });
      sc.labels.push({ p:add(L.r0, mul(L.m, i === 0 ? 1.6 : 1.9)), t:L.short, cls:"lp-plab" });
    });
    sc.points.push({ p:[1, 2, 3], cls:"lp-pt lp-hit" });
    sc.describe = "3D view of the plane x + y + z = 6 with three lines: one pierces it at (1, 2, 3), one runs parallel and never touches it, one lies in it.";
    V.set(sc);
    cap("One equation in " + m("t") + ", three endings: one point, no point, every point.");
  }
  V.set(heroScene(0, HERO.L[0].a, false));
  MV.wait(700, function(){ stage(0, function(){ stage(1, function(){ stage(2, fin); }); }); });
}

// =====================================================================================================================
// ---------- Explore: Line meets plane (V1 3D view + plane meter + meter graph) ----------
var EX = { lo:[-7, -7, -7], hi:[7, 7, 7] };
var KEYS = { A:["P", 0, -5, 5, "A"], B:["P", 1, -5, 5, "B"], C:["P", 2, -5, 5, "C"], D:["P", 3, -15, 15, "D"],
  x0:["r0", 0, -5, 5, "x_0"], y0:["r0", 1, -5, 5, "y_0"], z0:["r0", 2, -5, 5, "z_0"],
  m1:["m", 0, -4, 4, "m_1"], m2:["m", 1, -4, 4, "m_2"], m3:["m", 2, -4, 4, "m_3"],
  qx:["Q", 0, -5, 5, "x"], qy:["Q", 1, -5, 5, "y"], qz:["Q", 2, -5, 5, "z"] };
function stepperHTML(pre, key, val, dis){
  var K = KEYS[key], id = pre + "-" + key;
  return '<div class="lp-st"><label class="lp-stl" for="' + id + '">' + m(K[4]) + "</label>" +
    '<button type="button" class="btn ghost sm lp-sb" data-st="' + key + '" data-dir="-1" data-k="' + id + 'm" aria-label="Decrease ' + MV.esc(MV.plain(m(K[4]))) + '"' + (dis ? " disabled" : "") + ">" + MV.MINUS + "</button>" +
    '<input class="numin lp-sn" id="' + id + '" data-sk="' + key + '" data-k="' + id + '" type="number" min="' + K[2] + '" max="' + K[3] + '" step="1" value="' + val + '"' + (dis ? " disabled" : "") + ">" +
    '<button type="button" class="btn ghost sm lp-sb" data-st="' + key + '" data-dir="1" data-k="' + id + 'p" aria-label="Increase ' + MV.esc(MV.plain(m(K[4]))) + '"' + (dis ? " disabled" : "") + ">+</button></div>";
}
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MSG = {};
  C.challenges.forEach(function(c){ MSG[c.id] = c.msgs || {}; });
  function okArr(a, n, lo, hi){ return Array.isArray(a) && a.length === n && a.every(function(v){ return Number.isInteger(v) && v >= lo && v <= hi; }); }
  if (["free", "three", "perp"].indexOf(S.mode) < 0) S.mode = "free";
  if (!okArr(S.P, 4, -15, 15) || !okArr(S.P.slice(0, 3), 3, -5, 5)) S.P = [1, 1, 1, -6];
  if (!okArr(S.r0, 3, -5, 5)) S.r0 = [0, 0, 0];
  if (!okArr(S.m, 3, -4, 4)) S.m = [1, 2, 3];
  if (!okArr(S.Q, 3, -5, 5)) S.Q = [4, 3, 5];
  if (typeof S.t !== "number" || !(S.t >= -5 && S.t <= 5)) S.t = 0;
  if (typeof S.entry !== "string") S.entry = "";
  if (!C.presets.some(function(p){ return p.id === S.preset; })) S.preset = "pierce";
  var busy = false, stop = null, note = "";
  host.innerHTML = '<div class="lp-ex' + (S.graph ? " lp-gopen" : "") + '"><div class="lp-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="lp-viewrow"><div class="lp-view" id="lp-v"></div>' +
    '<div class="lp-meter" id="lp-meter"><span class="tiny lp-mh">' + md(T.meter) + '</span><div class="lp-mtrack" aria-hidden="true"><span class="lp-mzero"></span><span class="lp-mbar"></span><span class="lp-mdot"></span></div><span class="lp-mval" id="lp-mval" aria-live="polite"></span></div></div>' +
    viewBtns(T, "ex") + '<p class="tiny muted lp-note">' + md(T.rotate) + "</p>" + '<p class="tiny muted lp-key">' + md(T.key) + "</p>" +
    '<button type="button" class="btn ghost sm lp-gbtn" data-act="graph" data-k="exgraph" aria-expanded="' + !!S.graph + '">' + (S.graph ? T.hideGraph : T.showGraph) + "</button>" +
    '<div class="lp-graph"><p class="tiny lp-h">' + md(T.graph) + '</p><div class="plot-wrap"><canvas class="plot lp-gcan" id="lp-g" role="img" aria-label="' + MV.esc(MV.plain(md(T.graph))) + '"></canvas></div></div></div>' +
    '<div class="lp-side"><div id="lp-mode"></div><div id="lp-ctl"></div>' +
    '<label class="slider lp-sl"><span class="slider-top"><span>' + md(T.tLab) + '</span><output id="lp-tout"></output></span>' +
    '<input type="range" id="lp-t" min="-5" max="5" step="0.1" style="accent-color:var(--ink)" aria-label="Parameter t"></label><p class="tiny muted lp-note">' + md(T.tNote) + "</p>" +
    '<div class="q-actions lp-acts"><button type="button" class="btn sm" data-act="snap" data-k="exsnap">' + T.snap + '</button><button type="button" class="btn primary sm" data-act="drop" data-k="exdrop">' + T.drop + "</button></div>" +
    '<p class="tiny lp-msg" id="lp-msg" aria-live="polite"></p><div id="lp-entry"></div>' +
    '<dl class="read lp-read" id="lp-read" aria-live="polite"></dl></div></div>';
  var V = View3D($("#lp-v", host), { lo:EX.lo, hi:EX.hi, aria:"3D view", az:S.az, el:S.el, onRotate:function(st){ S.az = st.az; S.el = st.el; api.save(); } });
  var gp = new MV.Plot($("#lp-g", host), { xmin:-5, xmax:5, ymin:-5, ymax:5 }); gp.render = drawGraph;
  var sl = $("#lp-t", host);
  var modeSeg = MV.seg($("#lp-mode", host), { label:T.mode, options:C.modes, value:S.mode, onChange:function(id){ if (busy) { modeSeg.set(S.mode); return; } setMode(id); changed(true); } });

  function eff(){
    var P = S.mode === "three" ? [1, 1, 1, -6] : S.P;
    return { P:P, r0:S.mode === "perp" ? S.Q : S.r0, m:S.mode === "perp" ? [P[0], P[1], P[2]] : S.m };
  }
  function K(){ var e = eff(); return calc(e.P, e.r0, e.m); }
  function atSol(k){ return !!k.ts && Math.abs(S.t - k.tsv) < 1e-9; }
  function setMode(id){
    S.mode = id; note = "";
    if (id === "three") applyPreset(S.preset);
    if (id === "perp") S.t = 0;
  }
  function applyPreset(id){ var p = C.presets.filter(function(z){ return z.id === id; })[0] || C.presets[0]; S.preset = p.id; S.r0 = p.r0.slice(); S.m = p.m.slice(); S.t = 0; }
  function tQ(){ var k = K(); return atSol(k) ? k.ts : Q.of(Math.round(S.t * 10), 10); }
  function meterQ(k){ return Q.add(Q.of(k.c0), Q.mul(Q.of(k.c1), tQ())); }
  function tSrc(){ return qs(tQ()); }

  // ---- drawing ----
  function describe(e, k){
    var s = "3D view. ";
    if (k.validN) s += "Plane " + MV.plain(m(planeEq(e.P))) + " with its normal (" + e.P.slice(0, 3).join(", ") + "). ";
    if (k.validM) {
      s += "Line " + MV.plain(m(paramSrc(e.r0, e.m))) + ". ";
      var Pt = e.r0.map(function(x, i){ return Q.add(Q.of(x), Q.mul(tQ(), Q.of(e.m[i]))); });
      s += "Point P at t = " + MV.plain(m(tSrc())) + ": " + ptPlain(Pt) + ". ";
      if (k.validN) s += k.kind === "one" ? "The line meets the plane at " + ptPlain(k.pt) + (atSol(k) ? ", where P is now." : ".") : k.kind === "none" ? "The line is parallel to the plane and never meets it." : "The whole line lies in the plane.";
    }
    return s;
  }
  function drawView(){
    var e = eff(), k = K(), sc = { planes:[], lines:[], arrows:[], points:[], marks:[] };
    if (k.validN) { sc.planes.push({ n:k.n, D:e.P[3] }); var na = normalArrow(k.n, e.P[3], EX.lo, EX.hi, 2.6); if (na) sc.arrows.push(na); }
    if (S.mode === "perp") sc.points.push({ p:S.Q, cls:"lp-q", label:"Q", r:5 });
    if (k.validM) {
      sc.lines.push({ p0:e.r0, m:e.m, split:k.validN ? { n:k.n, D:e.P[3] } : null, glow:k.validN && k.kind === "in" });
      if (S.mode !== "perp" && inBox(e.r0, EX.lo, EX.hi)) sc.arrows.push({ a:e.r0, b:add(e.r0, e.m), cls:"lp-dir", label:"m⃗" });
      var Pt = add(e.r0, mul(e.m, S.t)), hit = k.validN && atSol(k);
      if (inBox(Pt, EX.lo, EX.hi)) sc.points.push({ p:Pt, cls:"lp-pt" + (hit ? " lp-hit" : ""), label:hit ? ptPlain(k.pt) : "P", flash:hit });
      if (hit && para(k.n, e.m)) sc.marks.push(rightMark(Pt, e.m, k.n, -S.t || -1));
    }
    sc.describe = describe(e, k);
    V.set(sc);
  }
  function meterRange(k){ return Math.max(Math.abs(k.c0 - 5 * k.c1), Math.abs(k.c0 + 5 * k.c1), 1); }
  function drawMeter(){
    var k = K(), mt = $("#lp-meter", host), val = $("#lp-mval", host);
    if (!k.validN || !k.validM) { mt.style.setProperty("--p", 0.5); mt.style.setProperty("--lo", 0.5); mt.style.setProperty("--hi", 0.5); val.textContent = "—"; return; }
    var R = meterRange(k), v = k.c0 + k.c1 * S.t, p = clamp(0.5 + 0.5 * v / R, 0, 1), vq = meterQ(k), z = vq.n === 0;
    mt.style.setProperty("--p", p.toFixed(4)); mt.style.setProperty("--lo", Math.min(0.5, p).toFixed(4)); mt.style.setProperty("--hi", Math.max(0.5, p).toFixed(4));
    mt.classList.toggle("lp-mz", z);
    val.innerHTML = m(qs(vq)) + (z ? ' <span class="lp-ok">✓</span>' : "");
  }
  function drawGraph(){
    var k = K(), ok = k.validN && k.validM, R = ok ? meterRange(k) : 5, step = R <= 6 ? 1 : R <= 14 ? 2 : R <= 35 ? 5 : 10;
    var sc = { view:{ xmin:-5, xmax:5, ymin:-R * 1.12, ymax:R * 1.12 }, xTicks:{ step:1 }, yTicks:{ step:step }, xLabel:"t", yLabel:"meter", curves:[], points:[] };
    if (ok) {
      sc.curves.push({ f:function(t){ return k.c0 + k.c1 * t; }, color:css("--pen"), width:3 });
      if (k.ts && Math.abs(k.tsv) <= 5) sc.points.push({ x:k.tsv, y:0, r:6, color:css("--green"), ring:true });
      sc.points.push({ x:S.t, y:k.c0 + k.c1 * S.t, r:6, color:css("--ink") });
      sc.describe = "Graph of the meter value against t: a straight line with slope " + k.c1 + (k.c1 ? ", crossing 0 at t = " + MV.plain(m(qs(k.ts))) + "." : k.c0 ? ", stuck at " + k.c0 + ": it never reaches 0." : ", stuck at 0.") + " Current t = " + MV.plain(m(tSrc())) + ".";
    } else sc.describe = "Empty graph: choose a plane and a non-zero direction.";
    gp.draw(sc);
  }
  function readRows(){
    var e = eff(), k = K(), rows = [];
    if (!k.validN) return [[md(T.rows.plane), md(T.zeroN)]];
    if (!k.validM) return [[md(T.rows.plane), m(planeSrc(e.P))], [md(T.rows.line), md(T.zeroDir)]];
    rows.push([md(T.rows.line), m(paramSrc(e.r0, e.m))]);
    rows.push([md(T.rows.plane), m(planeSrc(e.P))]);
    rows.push([md(T.rows.dot), m(String(k.c1)) + (k.c1 ? "" : '<span class="tiny lp-dd"> (' + md(T.dot0) + ")</span>")]);
    rows.push([md(T.rows.meter), "at " + m("t = " + tSrc()) + ": " + m(qs(meterQ(k)))]);
    rows.push([md(T.rows.sub), m(subSrc(e.P, e.r0, e.m)) + "<br>→ " + m(resultSrc(k.c0, k.c1))]);
    var res = k.kind === "one" ? fill(T.onePt, qs(k.ts), ptSrc(k.pt)) : k.kind === "none" ? fill(T.noPt, String(-k.c0)) : T.inPl;
    rows.push([md(T.rows.res), md(res)]);
    if (S.mode === "perp") rows.push(["", md(k.c0 === 0 ? T.onPlane : fill(T.foot, ptSrc(k.pt)))]);
    return rows;
  }
  function drawRead(){ $("#lp-read", host).innerHTML = MV.readoutHTML(readRows()); }
  function syncSlider(){
    var k = K(); sl.value = S.t;
    $("#lp-tout", host).innerHTML = m("t = " + tSrc());
    sl.setAttribute("aria-valuetext", "t = " + MV.plain(m(tSrc())));
    var dr = $('[data-act="drop"]', host), sn = $('[data-act="snap"]', host);
    dr.hidden = S.mode !== "perp"; sn.hidden = S.mode === "perp";
    sl.disabled = busy; dr.disabled = busy || !k.validN; sn.disabled = busy;
    $("#lp-msg", host).innerHTML = note ? md(note) : "";
  }
  function drawCtl(){
    var c = $("#lp-ctl", host), h = "", dis = busy;
    if (S.mode === "three") {
      h += '<p class="tiny lp-h">' + md(T.planeFixed) + "</p>";
      h += '<p class="tiny lp-h">' + T.lines + '</p><div class="chips lp-chips" role="group" aria-label="' + MV.esc(T.lines) + '">' + C.presets.map(function(p){
        return '<button type="button" class="chip" data-pre="' + p.id + '" data-k="expre' + p.id + '" aria-pressed="' + (S.preset === p.id) + '"' + (dis ? " disabled" : "") + ">" + p.t + "</button>"; }).join("") + "</div>";
      h += '<p class="tiny lp-h">' + md(T.point) + " = " + m(vecSrc(S.r0)) + "</p>";
      h += '<p class="tiny lp-h">' + md(T.dir) + '</p><div class="lp-grid">' + ["m1", "m2", "m3"].map(function(kk, i){ return stepperHTML("ex", kk, S.m[i], dis); }).join("") + "</div>";
    } else {
      h += '<p class="tiny lp-h">' + md(T.plane) + '</p><div class="lp-grid">' + ["A", "B", "C", "D"].map(function(kk, i){ return stepperHTML("ex", kk, S.P[i], dis); }).join("") + "</div>";
      if (S.mode === "free") {
        h += '<p class="tiny lp-h">' + md(T.point) + '</p><div class="lp-grid">' + ["x0", "y0", "z0"].map(function(kk, i){ return stepperHTML("ex", kk, S.r0[i], dis); }).join("") + "</div>";
        h += '<p class="tiny lp-h">' + md(T.dir) + '</p><div class="lp-grid">' + ["m1", "m2", "m3"].map(function(kk, i){ return stepperHTML("ex", kk, S.m[i], dis); }).join("") + "</div>";
        h += '<p class="tiny lp-h">' + T.setups + '</p><div class="chips lp-chips" role="group" aria-label="' + MV.esc(T.setups) + '">' + C.setups.map(function(p){
          return '<button type="button" class="chip" data-setup="' + p.id + '" data-k="exsu' + p.id + '"' + (dis ? " disabled" : "") + ">" + p.t + "</button>"; }).join("") + "</div>";
      } else {
        h += '<p class="tiny lp-h">' + md(T.Q) + '</p><div class="lp-grid">' + ["qx", "qy", "qz"].map(function(kk, i){ return stepperHTML("ex", kk, S.Q[i], dis); }).join("") + "</div>";
        h += '<p class="tiny lp-h">' + md(T.dirLocked) + "</p>";
      }
    }
    MV.keepFocus(c, function(){ c.innerHTML = h; });
    var en = $("#lp-entry", host);
    if (S.mode === "free") {
      if (!$("#lp-ent", host)) en.innerHTML = '<label class="lp-entl" for="lp-ent"><span class="tiny lp-h">' + T.entry + '</span><input class="numin lp-ent" id="lp-ent" data-k="exent" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="' + MV.esc(T.entryPh) + '"></label><p class="tiny muted lp-note">' + T.entryNote + "</p>";
      var inp = $("#lp-ent", host); if (inp.value !== S.entry) inp.value = S.entry; inp.disabled = busy;
    } else en.innerHTML = "";
  }
  function drawViewBtns(){ host.querySelectorAll(".lp-vb").forEach(function(b){ b.disabled = busy; }); }
  function paint(){ drawView(); drawMeter(); gp.render(); drawRead(); syncSlider(); }
  function paintAll(){ drawCtl(); paint(); drawViewBtns(); }
  function changed(all){ api.save(); if (all) paintAll(); else paint(); MV.changed(); }
  function lock(on){ busy = on; modeSeg.set(S.mode); paintAll(); }

  // ---- events ----
  function setKey(key, v){ var K0 = KEYS[key]; v = clamp(v, K0[2], K0[3]); S[K0[0]][K0[1]] = v; return v; }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t === sl) {
      if (busy) return;
      var v = parseFloat(sl.value), k = K();
      S.t = k.ts && Math.abs(v - k.tsv) <= 0.05 + 1e-9 && Math.abs(k.tsv) <= 5 ? k.tsv : Math.round(v * 10) / 10;
      note = ""; changed(false); return;
    }
    if (t.id === "lp-ent") { S.entry = t.value; api.save(); MV.changed(); return; }
    var key = t.dataset && t.dataset.sk; if (!key || busy) return;
    var n = Number(String(t.value).replace(/−/g, "-"));
    if (t.value === "" || !Number.isInteger(n)) return;
    setKey(key, n); note = ""; changed(false);
  });
  host.addEventListener("change", function(e){ var t = e.target, key = t.dataset && t.dataset.sk; if (!key) return; var K0 = KEYS[key]; t.value = S[K0[0]][K0[1]]; });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.vw) { V.view(b.dataset.vw); return; }
    if (b.dataset.act === "graph") { S.graph = !S.graph; $(".lp-ex", host).classList.toggle("lp-gopen", !!S.graph); b.textContent = S.graph ? T.hideGraph : T.showGraph; b.setAttribute("aria-expanded", !!S.graph); api.save(); gp.render(); return; }
    if (busy) return;
    if (b.dataset.st) { var K0 = KEYS[b.dataset.st], v = setKey(b.dataset.st, S[K0[0]][K0[1]] + +b.dataset.dir), inp = $("#ex-" + b.dataset.st, host); if (inp) inp.value = v; note = ""; changed(false); return; }
    if (b.dataset.pre) { applyPreset(b.dataset.pre); note = ""; changed(true); return; }
    if (b.dataset.setup) { var su = C.setups.filter(function(z){ return z.id === b.dataset.setup; })[0]; S.P = su.P.slice(); S.r0 = su.r0.slice(); S.m = su.m.slice(); S.t = 0; note = ""; changed(true); return; }
    if (b.dataset.act === "snap") {
      var k = K();
      if (!k.validN || !k.validM || !k.ts) note = T.noSnap; else if (Math.abs(k.tsv) > 5) note = fill(T.outRange, qs(k.ts)); else { S.t = k.tsv; note = ""; }
      changed(false); return;
    }
    if (b.dataset.act === "drop") {
      var kd = K(); if (!kd.validN) return;
      if (Math.abs(kd.tsv) > 5) { note = fill(T.outRange, qs(kd.ts)); changed(false); return; }
      lock(true); S.t = 0; paint();
      stop = MV.tween({ dur:1400, step:function(t){ S.t = kd.tsv * t; paint(); }, done:function(){ stop = null; S.t = kd.tsv; lock(false); changed(false); } });
    }
  });
  if (S.mode === "three") applyPreset(S.preset);
  paintAll();

  // ---- challenges ----
  function chal(id){
    var M = MSG[id], k;
    if (id === "tc1") {
      if (S.mode !== "free" || !samePlane(S.P, [3, -1, 1, -13]) || !same(S.r0, [1, 0, 2]) || !same(S.m, [2, 1, -1])) return { ok:false, msg:M.setup };
      var r = parsePt(S.entry);
      if (r.blank) return { ok:false, msg:M.blank };
      if (r.bad) return { ok:false, msg:M.bad };
      if (r.v.length === 1) return { ok:false, msg:Q.eq(r.v[0], Q.of(2)) ? M.t : M.general };
      if (eqPt(r.v, qArr(["5", "2", "0"]))) return Math.abs(S.t - 2) < 1e-9 ? { ok:true } : { ok:false, msg:M.slide };
      if (eqPt(r.v, qArr(["4", "2", "-2"]))) return { ok:false, msg:M.tm };
      if (eqPt(r.v, qArr(["3", "1", "1"]))) return { ok:false, msg:M.t1 };
      return { ok:false, msg:M.general };
    }
    if (id === "tc2") {
      if (S.mode !== "free" || !samePlane(S.P, [1, 2, -1, -4]) || !same(S.r0, [1, 2, 3])) return { ok:false, msg:M.setup };
      if (isZero(S.m)) return { ok:false, msg:M.zero };
      if (para(S.m, [1, 2, -1])) return { ok:false, msg:M.normal };
      k = K(); return k.c1 ? { ok:false, msg:M.moves } : { ok:true };
    }
    if (id === "tc3") {
      if (S.mode !== "free" || !samePlane(S.P, [2, -1, 3, -6])) return { ok:false, msg:M.setup };
      if (S.r0.concat(S.m).some(function(v){ return Math.abs(v) > 4; })) return { ok:false, msg:M.range };
      if (isZero(S.m)) return { ok:false, msg:M.zero };
      if (para(S.m, [2, -1, 3])) return { ok:false, msg:M.normal };
      k = K();
      if (k.c1) return { ok:false, msg:S.m[2] === 0 ? M.cross : M.moves };
      if (S.m[2] !== 0) return { ok:false, msg:para(S.m, [3, 0, -2]) ? M.tilt302 : M.tilt };
      if (k.c0) return { ok:false, msg:M.off };
      return { ok:true };
    }
    return { ok:false };
  }

  // ---- predictions ----
  var PRED = {
    p1:{ mode:"free", P:[0, 0, 1, -2], r0:[0, 0, 5], m:[0, 0, -1], t0:0, t1:3 },
    p2:{ mode:"three", pre:"hover", t0:-4, t1:4 },
    p3:{ mode:"three", pre:"lie", t0:-4, t1:4 },
    p4:{ mode:"three", r0:[0, 0, 0], m:[1, 1, 1], t0:0, t1:2 }
  };
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        var d = PRED[p.id]; if (!d) return;
        S.mode = d.mode; note = "";
        if (d.P) S.P = d.P.slice();
        if (d.pre) applyPreset(d.pre);
        if (d.r0) { S.r0 = d.r0.slice(); S.m = d.m.slice(); S.preset = null; }
        S.t = d.t0; lock(true); api.save();
      },
      run:function(p, done){
        var d = PRED[p.id];
        if (!d) { lock(false); done(); return; }
        stop = MV.tween({ dur:p.id === "p1" || p.id === "p4" ? 1800 : 3000, ease:function(t){ return t; },
          step:function(t){ S.t = d.t0 + (d.t1 - d.t0) * t; paint(); },
          done:function(){ stop = null; S.t = d.t1; MV.wait(400, function(){ lock(false); api.save(); MV.changed(); done(); }); } });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Classify before you compute (decision tree + 3D view + "Check it with algebra") ----------
var P3 = { lo:[-4, -4, -4], hi:[9, 9, 9] };
function part3(host, api){
  var S = api.S, C = api.content, TR = C.tree, AL = C.alg, CS = C.cases, msg = "";
  S.cs = S.cs || {};
  if (!CS.some(function(c){ return c.id === S.c; })) S.c = CS[0].id;
  function cs(id){ return S.cs[id] || (S.cs[id] = { n1:false, b1:null, n2:false, b2:null, entry:"", done:false }); }
  function cur(){ return CS.filter(function(c){ return c.id === S.c; })[0]; }
  host.innerHTML = '<div class="lp-p3"><div class="chips lp-chips" id="lp-cases" role="group" aria-label="Cases"></div>' +
    '<div class="sym lp-p3g"><div><div class="lp-given" id="lp-given"></div><div class="lp-tree" id="lp-tree"></div></div>' +
    '<div><div class="lp-view" id="lp-v3"></div>' + viewBtns(C.txt || { view:"View", views:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Top" }] }, "p3") + "</div></div>" +
    '<details class="alg" id="lp-alg"><summary>' + AL.title + '</summary><div class="alg-lines" id="lp-algl"></div></details></div>';
  var V = View3D($("#lp-v3", host), { lo:P3.lo, hi:P3.hi, aria:TR.view, az:40, el:24 });
  function k3(c){ return calc(c.P, c.r0, c.m); }
  function paintCases(){
    var h = CS.map(function(c){ var x = cs(c.id); return '<button type="button" class="chip" data-case="' + c.id + '" data-k="p3c' + c.id + '" aria-pressed="' + (S.c === c.id) + '">' + md(c.chip) + (x.done ? " ✓" : "") + "</button>"; }).join("");
    var el = $("#lp-cases", host); MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function nodeBtn(act, label){ return '<button type="button" class="btn sm lp-node" data-tr="' + act + '" data-k="p3' + act + '">' + md(label) + "</button>"; }
  function doneLine(label){ return '<p class="lp-step"><span class="lp-ok">✓</span> ' + md(label) + "</p>"; }
  function paintTree(){
    var c = cur(), x = cs(c.id), k = k3(c), h = "";
    $("#lp-given", host).innerHTML = '<p class="lp-gl"><strong>Line:</strong> ' + md(c.line) + '</p><p class="lp-gl"><strong>Plane:</strong> ' + md(c.plane) + "</p>";
    h += '<ol class="lp-steps">';
    h += "<li>" + (x.n1 ? doneLine(TR.n1 + ": " + c.dot) + '<p class="tiny muted lp-rd">' + md(c.read) + "</p>" : '<p class="tiny muted">' + TR.start + "</p>" + nodeBtn("n1", TR.n1)) + "</li>";
    if (x.n1) {
      h += "<li>" + (x.b1 ? doneLine(x.b1 === "ne" ? TR.ne : TR.eq) : '<div class="lp-br">' + nodeBtn("ne", TR.ne) + nodeBtn("eq", TR.eq) + "</div>") + "</li>";
      if (x.b1 === "ne") {
        h += "<li>" + (x.done ? doneLine(c.done) : '<p class="lp-step">' + TR.solve + '</p><p class="tiny lp-rd">' + md(c.sub) + '</p><div class="lp-solve"><input class="numin lp-ent" id="lp-p3e" data-k="p3ent" type="text" autocomplete="off" spellcheck="false" placeholder="' + MV.esc(TR.entryPh) + '" aria-label="' + MV.esc(TR.solve) + '" value="' + MV.esc(x.entry) + '">' +
          '<button type="button" class="btn primary sm" data-tr="solve" data-k="p3solve">' + TR.check + "</button></div>") + "</li>";
      }
      if (x.b1 === "eq") {
        h += "<li>" + (x.n2 ? doneLine(TR.n2 + ": " + c.test) : nodeBtn("n2", TR.n2)) + "</li>";
        if (x.n2) h += "<li>" + (x.b2 ? doneLine(x.b2 === "on" ? TR.on : TR.off) + doneLine(c.done) : '<div class="lp-br">' + nodeBtn("on", TR.on) + nodeBtn("off", TR.off) + "</div>") + "</li>";
      }
    }
    h += "</ol>";
    if (msg) h += MV.fbHTML(msg.bad ? "bad" : "good", md(msg.html));
    if (x.n1) h += '<p><button type="button" class="btn ghost sm" data-tr="reset" data-k="p3reset">' + TR.reset + "</button></p>";
    var el = $("#lp-tree", host); MV.keepFocus(el, function(){ el.innerHTML = h; });
    // the algebra panel for this case
    $("#lp-algl", host).innerHTML = AL.lines.map(function(l){ return "<div>" + md(l) + "</div>"; }).join("") + "<p>" + AL.end + "</p><div><strong>" + AL.here + "</strong> " +
      m("(vec{n} · vec{r}_0 + D) + (vec{n} · vec{m})t = (" + k.c0 + ") + (" + k.c1 + ")t = 0") + "</div>";
    // 3D view: plane and line; the confirmation once the case is done
    var sc = { planes:[{ n:k.n, D:c.P[3] }], arrows:[], lines:[{ p0:c.r0, m:c.m, split:{ n:k.n, D:c.P[3] }, glow:x.done && k.kind === "in" }], points:[], notes:[] };
    var na = normalArrow(k.n, c.P[3], P3.lo, P3.hi, 2.4); if (na) sc.arrows.push(na);
    if (inBox(c.r0, P3.lo, P3.hi)) sc.arrows.push({ a:c.r0, b:add(c.r0, c.m), cls:"lp-dir", label:"m⃗" });
    if (x.done && k.kind === "one") sc.points.push({ p:k.pt.map(function(q){ return q.n / q.d; }), cls:"lp-pt lp-hit", label:ptPlain(k.pt), flash:true });
    if (x.done && k.kind === "none") sc.notes.push({ x:16, y:28, t:"no intersection", cls:"lp-note" });
    if (x.done && k.kind === "in") sc.notes.push({ x:16, y:28, t:"lies in the plane", cls:"lp-note" });
    sc.describe = "3D view of " + MV.plain(md(c.plane)) + " and the line " + MV.plain(md(c.line)) + "." + (x.done ? " " + MV.plain(md(c.done)) : "");
    V.set(sc);
  }
  function paint(){ paintCases(); paintTree(); }
  host.addEventListener("input", function(e){ if (e.target.id === "lp-p3e") { cs(S.c).entry = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "lp-p3e") { e.preventDefault(); var b = $('[data-tr="solve"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.vw) { V.view(b.dataset.vw); return; }
    if (b.dataset.case) { S.c = b.dataset.case; msg = ""; api.save(); paint(); return; }
    var a = b.dataset.tr; if (!a) return;
    var c = cur(), x = cs(c.id), k = k3(c);
    msg = "";
    if (a === "reset") S.cs[c.id] = null, x = cs(c.id);
    else if (a === "n1") x.n1 = true;
    else if (a === "ne" || a === "eq") {
      if ((a === "ne") === (k.kind === "one")) x.b1 = a;
      else msg = { bad:true, html:a === "eq" ? fill(TR.wrongNe, String(k.c1).replace("-", MV.MINUS)) : TR.wrongEq };
    } else if (a === "n2") x.n2 = true;
    else if (a === "on" || a === "off") {
      if ((a === "on") === (k.kind === "in")) { x.b2 = a; x.done = true; }
      else msg = { bad:true, html:a === "on" ? fill(TR.wrongOn, c.test) : fill(TR.wrongOff, c.test) };
    } else if (a === "solve") {
      var r = parsePt(x.entry);
      if (r.blank || r.bad) msg = { bad:true, html:TR.ptBad };
      else if (r.v.length === 1) msg = { bad:true, html:Q.eq(r.v[0], parseQ(c.t)) ? TR.ptT : TR.ptGen };
      else if (eqPt(r.v, qArr(c.pt))) x.done = true;
      else if (eqPt(r.v, qArr(c.tm)) && !eqPt(qArr(c.tm), qArr(c.pt))) msg = { bad:true, html:TR.ptTm };
      else msg = { bad:true, html:TR.ptGen };
    }
    api.save(); paint();
    if (msg) MV.focusFb($("#lp-tree", host));
    else { var nb = $("#lp-tree .lp-node, #lp-tree #lp-p3e", host); if (nb && a !== "reset") nb.focus({ preventScroll:true }); }
  });
  paint();
  return {};
}

// =====================================================================================================================
// ---------- Practice: Find it / Work backwards (point and number entry, three-way outcome chips, first-try scoring) ----------
function pointAct(host, api, a){
  var S = api.S, TX = a.msgs || {}, msgs = {}, find = !!a.choices; S.it = S.it || {};
  function ist(id){ return S.it[id] || (S.it[id] = { ch:null, v:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = (a.how ? '<p class="how">' + md(a.how) + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q lp-pq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="lp-pin"></div><div class="lp-pcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .lp-pin', host), h = "", dis = x.solved ? " disabled" : "";
    if (find) h += '<div class="chips lp-chips" role="group" aria-label="Outcome">' + a.choices.map(function(c){ return '<button type="button" class="chip" data-ch="' + c.id + '" data-k="' + it.id + c.id + '" aria-pressed="' + (x.ch === c.id) + '"' + dis + ">" + c.t + "</button>"; }).join("") + "</div>";
    var showBox = find ? x.ch === "pt" : true, isK = !find && it.kind === "k";
    if (showBox) h += '<label class="lp-pent"><span class="tiny lp-h">' + md(isK ? TX.kLab : TX.pointLab) + '</span><input class="numin ' + (isK ? "short" : "lp-ent") + '" data-pv="' + it.id + '" data-k="' + it.id + 'v" type="text" autocomplete="off" spellcheck="false" placeholder="' + (isK ? "" : "(x, y, z)") + '" value="' + MV.esc(x.v) + '"' + dis + "></label>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .lp-pcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML((it.hints || []).map(md), x.hint);
    else h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + md(solvedWhy(it)) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    if (!x.solved && msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", md(msgs[it.id].html));
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  function solvedWhy(it){ var A = MV.ans(it); if (find) return A.kind === "pt" ? "The point is " + "`" + ptSrc(qArr(A.p)) + "`." : A.kind === "none" ? "No intersection." : "The line lies in the plane."; return it.kind === "k" ? "`k = " + A.k + "`." : "The point is `" + ptSrc(qArr(A.p)) + "`."; }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function wrongFb(it, test){ var W = it.wrong || []; for (var i = 0; i < W.length; i++) if (test(W[i])) return W[i].fb; return it.fb; }
  function judge(it){
    var x = ist(it.id), A = MV.ans(it), r;
    if (find) {
      if (!x.ch) return { err:TX.choose };
      if (x.ch === "pt") {
        r = parsePt(x.v); if (r.blank || r.bad) return { err:TX.bad };
        if (A.kind === "pt" && r.v.length === 3 && eqPt(r.v, qArr(A.p))) return { ok:true };
        return { msg:wrongFb(it, function(w){ return (w.v != null && r.v.length === 1 && Q.eq(r.v[0], parseQ(w.v))) || (w.pt && r.v.length === 3 && eqPt(r.v, qArr(w.pt))); }) };
      }
      if (x.ch === A.kind) return { ok:true };
      return { msg:wrongFb(it, function(w){ return w.kind === x.ch; }) };
    }
    r = parsePt(x.v); if (r.blank) return { err:TX.blank };
    if (it.kind === "k") {
      if (r.bad || r.v.length !== 1) return { err:TX.badK };
      return Q.eq(r.v[0], parseQ(A.k)) ? { ok:true } : { msg:wrongFb(it, function(w){ return w.v != null && Q.eq(r.v[0], parseQ(w.v)); }) };
    }
    if (r.bad) return { err:TX.bad };
    if (r.v.length === 3 && eqPt(r.v, qArr(A.p))) return { ok:true };
    return { msg:wrongFb(it, function(w){ return (w.v != null && r.v.length === 1 && Q.eq(r.v[0], parseQ(w.v))) || (w.pt && r.v.length === 3 && eqPt(r.v, qArr(w.pt))); }) };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.pv) return; ist(t.dataset.pv).v = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.pv) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q || !host.contains(q)) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.ch) { x.ch = b.dataset.ch; msgs[it.id] = null; api.save(); paintIn(it); paintCl(it); if (x.ch === "pt") { var inp = q.querySelector("[data-pv]"); if (inp) inp.focus({ preventScroll:true }); } return; }
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

// =====================================================================================================================
// ---------- Performance task: Aim the laser (S(0, 0, 6), panel x + y + z = 3 with x, y, z ≥ 0) ----------
var task = (function(){
  var api, V = null, LO = [-1, -1, -1], HI = [7, 7, 7], S0 = [0, 0, 6], RNG = [-4, 4], PN = [1, 1, 1];
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= RNG[0] && v <= RNG[1] ? v : null; }
  function read(){ var a = gi("a"), b = gi("b"), c = gi("c"), ok = a !== null && b !== null && c !== null && !(a === 0 && b === 0 && c === 0); return { a:a, b:b, c:c, valid:ok }; }
  function hit(D){ var k = D.a + D.b + D.c; if (!k) return null; var t = Q.of(-3, k); return { k:k, t:t, p:[D.a, D.b, D.c].map(function(v, i){ return Q.add(Q.of(S0[i]), Q.mul(t, Q.of(v))); }) }; }
  function checks(D){
    if (!D.valid) return [false, false, false, false];
    var H = hit(D); if (!H) return [false, false, false, false];
    return [true, H.k < 0, H.p.every(function(q){ return q.n >= 0; }), H.p.every(function(q){ return q.d === 1; })];
  }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#ls-read"), sc = { planes:[{ n:PN, D:-3, cls:"lp-plane lp-faint" }], polys:[{ pts:[[3, 0, 0], [0, 3, 0], [0, 0, 3]], cls:"lp-panel" }], lines:[], segs:[], points:[], labels:[] };
    sc.points.push({ p:S0, cls:"lp-q", label:"S", r:5 });
    if (!D.valid) {
      if (rd) rd.innerHTML = '<p class="tiny muted">' + md(L.invalid) + "</p>";
      sc.describe = "3D view: the laser at S(0, 0, 6) and the triangular panel with corners (3, 0, 0), (0, 3, 0) and (0, 0, 3). Choose a direction.";
      if (V) V.set(sc); return;
    }
    var mv = [D.a, D.b, D.c], H = hit(D), ck = checks(D), rows = [];
    rows.push([L.dir, m("vec{m} = " + vecSrc(mv))]);
    rows.push([md(L.dot), m([D.a, D.b, D.c].map(function(v, i){ return i === 0 ? String(v) : v < 0 ? " - " + -v : " + " + v; }).join("") + " = " + (H ? H.k : 0)) + (H ? "" : " (" + L.parallel + ")")]);
    if (H) {
      rows.push([L.sub, m("6 + (" + H.k + ")t = 3")]);
      rows.push([md(L.t), m("t = " + qs(H.t)) + " (" + (H.k < 0 ? L.forward : L.behind) + ")"]);
      rows.push([L.hit, m(ptSrc(H.p)) + " (" + (ck[2] ? L.onPanel : L.offPanel) + "; " + (ck[3] ? L.whole : L.notWhole) + ")"]);
    }
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
    // the beam: forward ray solid (stopping at the panel when it hits it), the backward extension dashed
    var r = clipLine(S0, mv, LO, HI), tEnd = r ? r[1] : 0, tv = H ? H.t.n / H.t.d : null;
    if (H && H.k < 0 && ck[2]) tEnd = tv;
    sc.lines.push({ p0:S0, m:mv, cls:"lp-beam", range:[0, tEnd] });
    if (r && r[0] < 0) sc.lines.push({ p0:S0, m:mv, cls:"lp-back", range:[r[0], 0] });
    if (H) { var hp = H.p.map(function(q){ return q.n / q.d; }); if (inBox(hp, LO, HI)) sc.points.push({ p:hp, cls:ck[1] && ck[2] ? "lp-pt lp-hit" : "lp-open", label:ptPlain(H.p), flash:ck[0] && ck[1] && ck[2] && ck[3] }); }
    sc.describe = "3D view: the laser at S(0, 0, 6), the triangular panel in the plane x + y + z = 3, and the beam in the direction (" + mv.join(", ") + ")" +
      (H ? ", which meets the plane at " + ptPlain(H.p) + (H.k < 0 ? "" : " behind the laser") + (ck[2] ? ", on the panel." : ", off the panel.") : ", parallel to the plane.");
    if (V) V.set(sc);
  }
  function stepper(k){
    var L = api.content.labels;
    return '<div class="lp-st"><label class="lp-stl" for="ls-' + k + '">' + md(L[k]) + "</label>" +
      '<button type="button" class="btn ghost sm lp-sb" data-ts="' + k + '" data-dir="-1" data-k="ls' + k + 'm" aria-label="Decrease ' + k + '">' + MV.MINUS + "</button>" +
      '<input class="numin lp-sn" id="ls-' + k + '" data-tk="' + k + '" type="number" min="-4" max="4" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm lp-sb" data-ts="' + k + '" data-dir="1" data-k="ls' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.a == null) { a.S.a = "1"; a.S.b = "1"; a.S.c = "-1"; }
      inp.innerHTML = '<div class="lp-tin"><p class="tiny lp-h">' + md(L.dir) + " " + m("(a, b, c)") + ' <span class="muted">' + L.range + '</span></p><div class="lp-grid">' + stepper("a") + stepper("b") + stepper("c") + "</div></div>";
      pv.innerHTML = '<div id="ls-read" aria-live="polite"></div><div class="lp-view lp-tview" id="ls-v"></div>' + viewBtns({ view:"View", views:[{ id:"iso", t:"Isometric" }, { id:"front", t:"Front" }, { id:"side", t:"Side" }, { id:"top", t:"Top" }] }, "ls");
      V = View3D($("#ls-v"), { lo:LO, hi:HI, aria:L.view, az:30, el:22 });
      pv.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b && b.dataset.vw) V.view(b.dataset.vw); });
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.ts) return;
        var k = b.dataset.ts, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, RNG[0], RNG[1])); $("#ls-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ var H = hit(D); return H ? H.p.map(function(q){ return q.n; }).join("|") : ""; },
    label:function(k){ return m("(" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "(" + k.split("|").join(", ") + ")"; },
    summary:function(ts){ var n = (ts.found || []).length, T = api ? api.content : null, name = (T && (T.summary || T.title)) || "Aim the laser"; return [name + ": " + (n ? "solved (" + n + "/5)" : "not solved yet")]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ find:pointAct, back:pointAct },
  task:task
});

})();
