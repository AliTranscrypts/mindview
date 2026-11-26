// MCV4U 39 Operations with Vectors in R³: hero (u⃗ and v⃗ as component staircases, tip-to-tail, sum flattens to (3, 3, 0)),
// 3D tip-to-tail (Explore: V1 3D view with Operate / Staircase / Points modes, view presets, readouts, Record D for the
// three fourth vertices), Prove it with components (Part 3: N15 two-column proof chips, sphere-and-line unknown, parallel
// lock and midpoint slide), Compute it / Unknowns and geometry (V8 component boxes) and the "Square in space" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function near(a, b, t){ return Math.abs(a - b) <= (t == null ? 1e-9 : t); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
var D2R = Math.PI / 180, O3 = [0, 0, 0];

// ---------- vector helpers ----------
function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function scl(a, k){ return [a[0] * k, a[1] * k, a[2] * k]; }
function n2(a){ return a[0] * a[0] + a[1] * a[1] + a[2] * a[2]; }
function len(a){ return Math.sqrt(n2(a)); }
function same(a, b, t){ return near(a[0], b[0], t) && near(a[1], b[1], t) && near(a[2], b[2], t); }
function isZero(a){ return same(a, O3); }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function r6(v){ v = Math.round(v * 1e6) / 1e6; return Object.is(v, -0) ? 0 : v; }
function srcN(v){ return String(r6(v)); }                                   // m() source (hyphen becomes −)
function txtN(v){ return srcN(v).replace("-", MINUS); }                      // plain text
function tup(a){ return "(" + a.map(srcN).join(", ") + ")"; }
function tupTxt(a){ return "(" + a.map(txtN).join(", ") + ")"; }
function ijk(a){
  var L = ["vec{i}", "vec{j}", "vec{k}"], s = "";
  a.forEach(function(c, i){
    c = r6(c); if (!c) return;
    var mag = Math.abs(c), co = mag === 1 ? "" : srcN(mag);
    s += s ? (c < 0 ? " - " : " + ") + co + L[i] : (c < 0 ? "-" : "") + co + L[i];
  });
  return s || "vec{0}";
}
function sqfree(N){ var s = 1, f = N; for (var k = 2; k * k <= f; k++) while (f % (k * k) === 0) { f /= k * k; s *= k; } return [s, f]; }
// exact length of a vector whose components are multiples of 0.5: {src, val, rat:Q or null}
function lenEx(a){
  var sq = n2(a), D = near(sq, Math.round(sq), 1e-9) ? 1 : 4, N = Math.round(sq * D), sf = sqfree(N), s = sf[0], f = sf[1], den = D === 4 ? 2 : 1;
  var q = Q.of(s, den), val = Math.sqrt(sq);
  if (f === 1) return { src:Q.src(q), val:val, rat:q, s:s, f:f, den:den };
  var core = (q.n === 1 ? "" : String(q.n)) + "√{" + f + "}";
  return { src:q.d === 1 ? core : "{" + core + "}/{" + q.d + "}", val:val, rat:null, s:s, f:f, den:den };
}
function lenTxt(a){ var L = lenEx(a); return m(L.src) + (L.rat ? "" : " ≈ " + num(L.val, 2)); }
function unitSrc(a){
  var L = lenEx(a);
  if (L.rat) return "(" + a.map(function(c){ return Q.src(Q.div(Q.of(c), L.rat)); }).join(", ") + ")";
  var root = (L.s === 1 ? "" : String(L.s)) + "√{" + L.f + "}";
  return "{" + L.den + "}/{" + root + "}" + tup(a);
}
function approxTup(a){ return "(" + a.map(function(c){ return num(c, 2); }).join(", ") + ")"; }
function parInfo(r, u){                                                     // is r a multiple of u?
  if (isZero(u)) return { txt:"No direction: " + m("vec{u} = vec{0}") };
  if (isZero(r)) return { txt:"The zero vector: " + m("0vec{u}") };
  if (same(cross(r, u), O3, 1e-7)) {
    var i = Math.abs(u[0]) > 1e-9 ? 0 : Math.abs(u[1]) > 1e-9 ? 1 : 2, q = Q.of(r6(r[i] / u[i]));
    return { yes:true, txt:"Yes: result = " + m("@a{m}vec{u}") + " with " + m("@a{m} = " + (q ? Q.src(q) : srcN(r[i] / u[i]))) };
  }
  var rs = r.map(function(c, j){
    var a = r6(c), b = r6(u[j]);
    if (!b) return srcN(a) + "/0";
    if (!a) return "0/" + (b < 0 ? "(" + srcN(b) + ")" : srcN(b));
    var q = Q.of(a / b); return q ? (q.n < 0 ? "-" : "") + Math.abs(q.n) + (q.d > 1 ? "/" + q.d : "") : srcN(a / b);
  });
  return { txt:"No (ratios " + rs.map(function(s){ return m(s); }).join(", ") + " differ)" };
}
var RS = [6, 8, 10, 12, 15, 20, 25, 30, 40, 50];
function niceR(pts){ var mx = 0; pts.forEach(function(p){ if (p) mx = Math.max(mx, len(p)); }); for (var i = 0; i < RS.length; i++) if (RS[i] >= mx * 1.08) return RS[i]; return RS[RS.length - 1]; }
function stairPts(a, d, frac){
  var pts = [a.slice()], cur = a.slice();
  for (var i = 0; i < 3; i++) { var f = clamp(frac * 3 - i, 0, 1); if (f <= 0) break; var nx = cur.slice(); nx[i] += d[i] * f; pts.push(nx); cur = nx; if (f < 1) break; }
  return pts;
}
function stairCorners(a, d){ return [a, add(a, [d[0], 0, 0]), add(a, [d[0], d[1], 0]), add(a, d)]; }

// @component V1 view3d — MCV4U 3D axes view (SVG orthographic projection; MCV4U 39, reusable for 37–52). Colours are tokens
// written as CSS variables, so theme changes need no redraw. view3d(host, {phi, th (degrees), interactive, label, onRotate(end),
// locked()}) -> {draw(scene), setCam(phi, th), tweenCam(phi, th, dur, done) -> cancel, cam()}. A scene is {R (axis half-length;
// use niceR(points)), grid:false?, items:[…], describe}; items: {k:"arrow", a, b, col:"--pen", w, dash, label},
// {k:"seg", a, b, col, w, dash, op}, {k:"stair", a, d, frac, col, w, dash}, {k:"pt", p, col, r, ring, label, dx, dy},
// {k:"sphere", c, r, col, a (fill opacity)}, {k:"lab", p, text, col, dx, dy}. Interactive views rotate by drag (touch: horizontal
// drags; vertical drags scroll the page) and by arrow keys on the focused view (10° a press).
function view3d(host, o){
  o = o || {};
  var cam = { phi:(o.phi == null ? 45 : o.phi) * D2R, th:(o.th == null ? 30 : o.th) * D2R }, sc = null, R = 6;
  host.innerHTML = '<div class="v3-wrap' + (o.interactive ? " v3-int" : "") + '"' + (o.interactive ? ' tabindex="0" role="group" aria-label="' + MV.esc(o.label || "3D view: drag, or use the arrow keys, to rotate") + '"' : "") +
    '><svg class="v3" viewBox="0 0 400 400" role="img" aria-label="3D view"></svg></div>';
  var wrap = host.querySelector(".v3-wrap"), svg = wrap.querySelector("svg");
  function K(){ return 170 / R; }
  function P(p){
    var cp = Math.cos(cam.phi), sp = Math.sin(cam.phi), ct = Math.cos(cam.th), st = Math.sin(cam.th), k = K();
    var sx = -p[0] * sp + p[1] * cp, sy = -p[0] * st * cp - p[1] * st * sp + p[2] * ct;
    return [200 + sx * k, 200 - sy * k];
  }
  function f(v){ return Math.round(v * 10) / 10; }
  function sty(col, w, dash, op){ return 'style="stroke:var(' + col + ");stroke-width:" + w + (dash ? ";stroke-dasharray:" + dash : "") + (op != null ? ";stroke-opacity:" + op : "") + '"'; }
  function line(a, b, col, w, dash, op){ return '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '" ' + sty(col, w, dash, op) + "/>"; }
  function arrowS(p, q, col, w, dash){
    var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); if (L < 0.6) return "";
    var ux = dx / L, uy = dy / L, hl = Math.min(8 + 1.7 * w, L * 0.55), hw = hl * 0.42, bx = q[0] - ux * hl, by = q[1] - uy * hl;
    return line(p, [bx + ux * 0.8, by + uy * 0.8], col, w, dash) + '<polygon points="' + f(q[0]) + "," + f(q[1]) + " " + f(bx - uy * hw) + "," + f(by + ux * hw) + " " + f(bx + uy * hw) + "," + f(by - ux * hw) + '" style="fill:var(' + col + ')"/>';
  }
  function text(x, y, s, cls, col, anchor){ return '<text x="' + f(x) + '" y="' + f(y) + '" class="' + cls + '" text-anchor="' + (anchor || "middle") + '" style="fill:var(' + (col || "--ink") + ')">' + MV.esc(s) + "</text>"; }
  function draw(scene){
    if (scene) sc = scene; if (!sc) return;
    R = sc.R || 6;
    var h = "", c, tk = R <= 8 ? 1 : R <= 15 ? 2 : R <= 25 ? 5 : 10, lab = R <= 8 ? 2 : R <= 15 ? 4 : R <= 25 ? 10 : 20, o0 = P(O3);
    if (sc.grid !== false) for (c = -Math.floor(R / tk) * tk; c <= R + 1e-9; c += tk) { h += line(P([c, -R, 0]), P([c, R, 0]), "--plot-grid", 1) + line(P([-R, c, 0]), P([R, c, 0]), "--plot-grid", 1); }
    ["x", "y", "z"].forEach(function(nm, ax){
      var e = [0, 0, 0]; e[ax] = R; var pos = P(e), neg = P(scl(e, -1));
      h += line(neg, o0, "--ink-2", 1.2, "4 4") + arrowS(o0, pos, "--ink-2", 1.4);
      var dx = pos[0] - o0[0], dy = pos[1] - o0[1], L = Math.hypot(dx, dy);
      if (L < 14) return;
      var ux = dx / L, uy = dy / L;
      h += text(pos[0] + ux * 13, pos[1] + uy * 13 + 5, nm, "v3-ax", "--ink-2");
      for (c = tk; c < R - 1e-9; c += tk) {
        var t = P(scl(e, c / R));
        h += line([t[0] - uy * 3.5, t[1] + ux * 3.5], [t[0] + uy * 3.5, t[1] - ux * 3.5], "--ink-2", 1.1);
        if (L > 70 && Math.abs(c % lab) < 1e-9) h += text(t[0] - uy * 12, t[1] + ux * 12 + 4, String(c), "v3-tk", "--ink-2");
      }
    });
    (sc.items || []).forEach(function(it){
      if (!it) return;
      var col = it.col || "--ink", q;
      if (it.k === "sphere") {
        var cc = P(it.c || O3), rr = it.r * K(), eq = [];
        h += '<circle cx="' + f(cc[0]) + '" cy="' + f(cc[1]) + '" r="' + f(rr) + '" style="fill:var(' + col + ");fill-opacity:" + (it.a || 0.1) + ";stroke:var(" + col + ');stroke-opacity:.5;stroke-width:1.2"/>';
        for (var j = 0; j <= 48; j++) { var an = j / 48 * 2 * Math.PI, pp = P(add(it.c || O3, [it.r * Math.cos(an), it.r * Math.sin(an), 0])); eq.push(f(pp[0]) + "," + f(pp[1])); }
        h += '<polyline points="' + eq.join(" ") + '" style="fill:none;stroke:var(' + col + ');stroke-opacity:.45;stroke-width:1;stroke-dasharray:3 3"/>';
      } else if (it.k === "seg") h += line(P(it.a), P(it.b), col, it.w || 2, it.dash, it.op);
      else if (it.k === "stair") {
        var sp = stairPts(it.a, it.d, it.frac == null ? 1 : it.frac).map(P);
        h += '<polyline points="' + sp.map(function(z){ return f(z[0]) + "," + f(z[1]); }).join(" ") + '" style="fill:none;stroke:var(' + col + ");stroke-width:" + (it.w || 2) + ";stroke-linejoin:round" + (it.dash ? ";stroke-dasharray:" + it.dash : "") + '"/>';
      } else if (it.k === "arrow") {
        var pa = P(it.a), pb = P(it.b); h += arrowS(pa, pb, col, it.w || 3, it.dash);
        if (it.label) { var ddx = pb[0] - pa[0], ddy = pb[1] - pa[1], LL = Math.hypot(ddx, ddy) || 1; h += text(pb[0] + ddx / LL * 15, pb[1] + ddy / LL * 15 + 5, it.label, "v3-lb", col); }
      } else if (it.k === "pt") {
        q = P(it.p); var r = it.r || 5;
        if (it.ring) h += '<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="' + (r + 5) + '" style="fill:none;stroke:var(' + col + ');stroke-width:2"/>';
        h += '<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="' + r + '" style="fill:var(' + col + ');stroke:var(--sheet);stroke-width:1.5"/>';
        if (it.label) h += text(q[0] + (it.dx == null ? 9 : it.dx), q[1] + (it.dy == null ? -9 : it.dy), it.label, "v3-lb", col, it.anchor || "start");
      } else if (it.k === "lab") { q = P(it.p); h += text(q[0] + (it.dx || 0), q[1] + (it.dy || 0), it.text, "v3-lb v3-big", col, it.anchor || "middle"); }
    });
    svg.innerHTML = h; svg.setAttribute("aria-label", sc.describe || "3D view");
  }
  function setCam(phi, th){ cam.phi = phi * D2R; cam.th = clamp(th, -15, 90) * D2R; draw(); }
  function rot(dp, dt){ setCam(cam.phi / D2R + dp, cam.th / D2R + dt); if (o.onRotate) o.onRotate(false); }
  if (o.interactive) {
    var drag = null;
    wrap.addEventListener("pointerdown", function(e){ if (o.locked && o.locked()) return; drag = { x:e.clientX, y:e.clientY, id:e.pointerId }; try { wrap.setPointerCapture(e.pointerId); } catch (er) {} });
    wrap.addEventListener("pointermove", function(e){
      if (!drag || e.pointerId !== drag.id) return;
      var s = 400 / (wrap.clientWidth || 400) * 0.6; rot(-(e.clientX - drag.x) * s, (e.clientY - drag.y) * s); drag.x = e.clientX; drag.y = e.clientY;
    });
    var end = function(){ if (drag) { drag = null; if (o.onRotate) o.onRotate(true); } };
    wrap.addEventListener("pointerup", end); wrap.addEventListener("pointercancel", end);
    wrap.addEventListener("keydown", function(e){
      var d = { ArrowLeft:[10, 0], ArrowRight:[-10, 0], ArrowUp:[0, 10], ArrowDown:[0, -10] }[e.key];
      if (!d || (o.locked && o.locked())) return; e.preventDefault(); rot(d[0], d[1]); if (o.onRotate) o.onRotate(true);
    });
  }
  return {
    draw:draw, setCam:setCam,
    cam:function(){ return { phi:r6(cam.phi / D2R), th:r6(cam.th / D2R) }; },
    tweenCam:function(phi, th, dur, done){
      var p0 = cam.phi / D2R, t0 = cam.th / D2R, dp = ((phi - p0) % 360 + 540) % 360 - 180;
      return MV.tween({ dur:dur, step:function(t){ setCam(p0 + dp * t, t0 + (th - t0) * t); }, done:function(){ setCam(p0 + dp, th); if (done) done(); } });
    }
  };
}
var VIEWS = { iso:[45, 35.26], front:[0, 0], side:[-90, 0], top:[-90, 90] };

// ---------- hero: u⃗ = (2, −1, 3) and v⃗ = (1, 4, −3) as staircases, tip-to-tail; the sum (3, 3, 0) lies flat ----------
function hero(f){
  var host = f.canvas; if (!host) return;
  var v = view3d(host, { phi:35, th:24 }), U = [2, -1, 3], W = [1, 4, -3], S = add(U, W), st = { s:0 };
  function draw(){
    var s = st.s, it = [];
    it.push({ k:"stair", a:O3, d:U, frac:clamp(s, 0, 1), col:"--pen", w:2, dash:"5 4" });
    if (s >= 1) it.push({ k:"arrow", a:O3, b:U, col:"--pen", w:3, label:"u⃗" });
    if (s > 1) it.push({ k:"stair", a:U, d:W, frac:clamp(s - 1, 0, 1), col:"--f3", w:2, dash:"5 4" });
    if (s >= 2) it.push({ k:"arrow", a:U, b:S, col:"--f3", w:3, label:"v⃗" });
    if (s > 2) { var t = clamp(s - 2, 0, 1); it.push({ k:"stair", a:O3, d:S, frac:t, col:"--ink", w:2, dash:"2 4" }); if (t > 0.02) it.push({ k:"arrow", a:O3, b:scl(S, t), col:"--ink", w:3.6, label:t >= 1 ? "u⃗ + v⃗" : "" }); }
    v.draw({ R:6, items:it, describe:"3D axes. u = (2, −1, 3) is drawn from the origin as a staircase: 2 along x, −1 along y, 3 up z. v = (1, 4, −3) is drawn from the tip of u. Their sum (3, 3, 0) lies flat in the xy-plane: the z-steps 3 and −3 cancel." });
  }
  function cap(n){
    if (!f.cap) return;
    var L = [m("vec{u} = (2, -1, 3)"), m("vec{v} = (1, 4, -3)"), m("(2, -1, 3) + (1, 4, -3) = (3, 3, 0)") + ' <span class="muted">' + m("z") + ": " + m("3 + (-3) = 0") + "</span>"];
    f.cap.innerHTML = n >= 3 ? L[2] : L.slice(0, n).join(" · ");
  }
  if (MV.reduceMotion) { st.s = 3; draw(); cap(3); return; }
  draw(); cap(0);
  function phase(i, cb){ MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){ st.s = i + t; draw(); }, done:function(){ st.s = i + 1; draw(); cap(i + 1); MV.wait(450, cb); } }); }
  MV.wait(300, function(){ phase(0, function(){ phase(1, function(){ phase(2, function(){}); }); }); });
}

// ---------- Explore: 3D tip-to-tail ----------
var OPS = ["add", "sub", "mu", "muv", "unit"], PTS = ["A", "B", "C", "D"];
var TC3 = { A:[1, 2, -1], B:[4, 0, 1], C:[2, 5, 3] };
function vecOK(a, lo, hi){ return Array.isArray(a) && a.length === 3 && a.every(function(c){ return typeof c === "number" && c >= lo && c <= hi; }); }
function explore(host, api){
  var S = api.S, C = api.content, U = C.ui, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["op", "st", "pt"].indexOf(S.mode) < 0) S.mode = "op";
  if (OPS.indexOf(S.op) < 0) S.op = "add";
  if (!vecOK(S.u, -5, 5)) S.u = [2, -1, 3];
  if (!vecOK(S.v, -5, 5)) S.v = [1, 4, -3];
  if (!(typeof S.m === "number" && S.m >= -3 && S.m <= 3)) S.m = 2;
  S.pts = S.pts || {};
  PTS.forEach(function(k, i){ if (!vecOK(S.pts[k], -12, 12)) S.pts[k] = [[1, 0, 2], [3, 1, 5], [5, 2, 8], [0, 0, 0]][i].slice(); });
  if (PTS.indexOf(S.sel) < 0) S.sel = "A";
  if (!Array.isArray(S.found)) S.found = [];
  if (!S.cam || typeof S.cam.phi !== "number") S.cam = { phi:45, th:35.26 };
  var busy = false, pv = null, mark = null, anim = null, recMsg = null;

  host.innerHTML = '<div class="ops-ex"><div class="ops-colL" data-mv="graph"><p class="eq-cap ops-eq" id="ops-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="ops-view"></div><div class="chips ops-vw" id="ops-vw" role="group" aria-label="View presets"></div><p class="tiny muted ops-rh">' + U.rotateHow + "</p></div>" +
    '<div class="ops-colR"><div id="ops-mode"></div><p class="tiny muted ops-how" id="ops-how"></p>' +
      '<div id="ops-opw"><div class="chips ops-opc" id="ops-opc" role="group" aria-label="Operation"></div>' +
        '<div class="ops-uv"><div class="ops-ucol">' + [1, 2, 3].map(function(i){ return sl("u" + i, m("u_" + i), -5, 5, 1, "--pen", "u component " + i + ", from −5 to 5"); }).join("") + "</div>" +
        '<div class="ops-vcol">' + [1, 2, 3].map(function(i){ return sl("v" + i, m("v_" + i), -5, 5, 1, "--f3", "v component " + i + ", from −5 to 5"); }).join("") + "</div></div>" +
        '<div class="ops-mw" id="ops-mw">' + sl("m", m("@a{m}"), -3, 3, 0.5, "--acol", "Scalar m, from −3 to 3 in steps of 0.5") + '<p class="tiny muted">' + U.mNote + "</p></div></div>" +
      '<div id="ops-ptw" hidden><div class="chips" id="ops-pc" role="group" aria-label="Point to set"></div>' +
        '<div class="ops-pxyz">' + ["x", "y", "z"].map(function(c, i){ return sl("p" + (i + 1), m(c), -12, 12, 1, "--ink", c + "-coordinate of the chosen point, from −12 to 12"); }).join("") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="ops-rec" data-k="opsrec">Record D</button></div><div id="ops-recfb" aria-live="polite"></div></div>' +
      '<dl class="read ops-read" id="ops-read" aria-live="polite"></dl></div></div>';
  function sl(id, label, min, max, step, col, aria){
    return '<label class="slider ops-sl" style="--ops-edge:var(' + col + ')"><span class="slider-top"><span>' + label + '</span><output id="ops-' + id + 'out" style="color:var(' + col + ')"></output></span>' +
      '<input type="range" id="ops-' + id + '" data-sl="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(aria) + '"></label>';
  }
  var view = view3d($("#ops-view", host), { interactive:true, phi:S.cam.phi, th:S.cam.th, locked:function(){ return busy; },
    onRotate:function(end){ S.cam = view.cam(); if (end) api.save(); } });
  var seg = MV.seg($("#ops-mode", host), { label:"Mode", options:U.modes, value:S.mode, onChange:function(id){ if (busy) { seg.set(S.mode); return; } S.mode = id; recMsg = null; after(); } });

  // ---- maths of the current state ----
  function opRes(){
    var u = S.u, v = S.v, k = S.m, L = len(u), A = "@a{" + srcN(k) + "}";
    if (S.op === "add") return { r:add(u, v), nm:"vec{u} + vec{v}", rhs:tup(u) + " + " + tup(v), say:"u plus v", legs:[u, v] };
    if (S.op === "sub") return { r:sub(u, v), nm:"vec{u} - vec{v}", rhs:tup(u) + " - " + tup(v), say:"u minus v", legs:[u, v] };
    if (S.op === "mu") return { r:scl(u, k), nm:"@a{m}vec{u}", rhs:A + tup(u), say:"m times u, with m = " + txtN(k) };
    if (S.op === "muv") return { r:add(scl(u, k), v), nm:"@a{m}vec{u} + vec{v}", rhs:A + tup(u) + " + " + tup(v), say:"m u plus v, with m = " + txtN(k), legs:[scl(u, k), v] };
    return { r:L ? scl(u, 1 / L) : null, nm:"vec{u}/|vec{u}|", rhs:L ? unitSrc(u) : "", say:"the unit vector of u", unit:true };
  }
  function hidden(){ return pv && pv.hide && pv.grow < 1; }
  function P3(k){ return S.pts[k]; }
  function fourth(){ var A = P3("A"), B = P3("B"), Cc = P3("C"); return [{ d:sub(add(A, Cc), B), nm:"ABCD", sides:["A", "B", "C", "D"] }, { d:sub(add(A, B), Cc), nm:"ACBD", sides:["A", "C", "B", "D"] }, { d:sub(add(B, Cc), A), nm:"ABDC", sides:["A", "B", "D", "C"] }]; }
  function tc3Set(){ return PTS.slice(0, 3).every(function(k){ return same(P3(k), TC3[k]); }); }

  // ---- drawing ----
  function draw(){
    var it = [], pts = [], d, desc;
    if (S.mode === "pt") {
      var A = P3("A"), B = P3("B"), Cc = P3("C"), D = P3("D"), mid = scl(add(A, B), 0.5), fit = fourth().filter(function(q){ return same(q.d, D); })[0];
      var side = fit ? fit.sides : ["A", "B", "C", "D"];
      if (!(pv && pv.hideD)) for (var i = 0; i < 4; i++) it.push({ k:"seg", a:P3(side[i]), b:P3(side[(i + 1) % 4]), col:"--ink-2", w:1.6, dash:"6 5" });
      it.push({ k:"seg", a:A, b:B, col:"--ink", w:2.4 }, { k:"seg", a:A, b:Cc, col:"--ink", w:2.4 });
      it.push({ k:"pt", p:mid, col:"--ink-2", r:3.5, label:"M", dx:8, dy:14 });
      it.push({ k:"pt", p:A, col:"--ink", label:"A" }, { k:"pt", p:B, col:"--ink", label:"B" }, { k:"pt", p:Cc, col:"--ink", label:"C" });
      if (!(pv && pv.hideD)) it.push({ k:"pt", p:D, col:"--f5", label:"D", ring:!!fit });
      pts = [A, B, Cc, D];
      desc = "Points A" + tupTxt(A) + ", B" + tupTxt(B) + ", C" + tupTxt(Cc) + (pv && pv.hideD ? "" : " and your D" + tupTxt(D)) + ", with segments AB and AC and the midpoint M of AB.";
    } else {
      var o = opRes(), u = S.u, v = S.v, stair = S.mode === "st", r = o.r, g = pv && pv.hide ? pv.grow : 1;
      var vec = function(a, dv, col, w, lab, dash){
        if (isZero(dv)) return;
        if (stair) it.push({ k:"stair", a:a, d:dv, col:col, w:2, dash:"5 4" });
        it.push({ k:"arrow", a:a, b:add(a, dv), col:col, w:stair ? w - 0.8 : w, label:lab, dash:dash });
        pts = pts.concat(stairCorners(a, dv));
      };
      if (S.op === "add") { vec(O3, u, "--pen", 3, "u⃗"); vec(u, v, "--f3", 3, "v⃗"); }
      else if (S.op === "sub") { vec(O3, u, "--pen", 3, "u⃗"); vec(u, scl(v, -1), "--f3", 3, MINUS + "v⃗"); }
      else if (S.op === "mu") vec(O3, u, "--pen", 2.4, "u⃗");
      else if (S.op === "muv") { vec(O3, scl(u, S.m), "--acol", 2.6, "mu⃗", "7 4"); vec(scl(u, S.m), v, "--f3", 3, "v⃗"); }
      else { it.push({ k:"sphere", r:1, col:"--pen", a:0.12 }); vec(O3, u, "--pen", 3, "u⃗"); }
      if (r && g > 0.02 && !isZero(r)) {
        if (stair && g >= 1) it.push({ k:"stair", a:O3, d:r, col:"--ink", w:2, dash:"2 4" });
        it.splice(S.op === "mu" ? 0 : it.length, 0, { k:"arrow", a:O3, b:scl(r, g), col:"--ink", w:S.op === "unit" ? 3 : 3.6, label:g >= 1 ? (S.op === "mu" ? "mu⃗" : S.op === "unit" ? "unit" : "result") : "" });
        pts = pts.concat(stairCorners(O3, r));
      }
      desc = hidden() ? "3D view of the vectors before the result is drawn." : "3D view: " + o.say + (r ? " equals " + tupTxt(r.map(function(c){ return r6(Math.round(c * 100) / 100); })) + ", length " + MV.plain(m(lenEx(r).src)) + (near(r[2], 0) && !isZero(r) ? ", parallel to the xy-plane" : "") : " is undefined, because u is the zero vector") + ".";
    }
    (mark || []).forEach(function(q){ it.push({ k:"lab", p:q.p, text:q.text, col:"--ink", dy:q.dy == null ? -16 : q.dy }); });
    view.draw({ R:niceR(pts.length ? pts : [[5, 5, 5]]), items:it, describe:desc });
  }
  // ---- readouts ----
  function paintEq(){
    var el = $("#ops-eq", host);
    if (S.mode === "pt") { el.innerHTML = m("vec{AB} = B - A = " + tup(sub(P3("B"), P3("A")))) + " · " + m("vec{AC} = " + tup(sub(P3("C"), P3("A")))); return; }
    var o = opRes();
    if (!o.r) { el.innerHTML = m("vec{u} = vec{0}") + ": it has no direction, so it has no unit vector."; return; }
    if (o.unit) { el.innerHTML = m(o.nm + " = " + o.rhs) + (lenEx(S.u).rat ? "" : " ≈ " + m(approxTup(o.r))); return; }
    el.innerHTML = m(o.nm + " = " + o.rhs + " = " + (hidden() ? "?" : tup(o.r)));
  }
  function paintRead(){
    var rows = [], el = $("#ops-read", host);
    if (S.mode === "pt") {
      var A = P3("A"), B = P3("B"), Cc = P3("C"), D = P3("D"), AB = sub(B, A), AC = sub(Cc, A), par = parInfo(AC, AB), f4 = fourth(), fit = f4.filter(function(q){ return same(q.d, D); })[0];
      rows.push(["A, B, C", m("A" + tup(A)) + ", " + m("B" + tup(B)) + ", " + m("C" + tup(Cc))]);
      rows.push([m("vec{AB}") + ", " + m("vec{AC}") + ", " + m("vec{BC}"), m(tup(AB)) + ", " + m(tup(AC)) + ", " + m(tup(sub(Cc, B)))]);
      var i0 = Math.abs(AB[0]) > 1e-9 ? 0 : Math.abs(AB[1]) > 1e-9 ? 1 : 2, kq = isZero(AB) ? null : Q.of(r6(AC[i0] / AB[i0]));
      rows.push(["Collinear? (" + m("vec{AC} = mvec{AB}") + "?)", isZero(AB) ? "A and B are the same point." : isZero(AC) ? "C is the same point as A." : par.yes ? "Yes: " + m("vec{AC} = " + (kq ? Q.src(kq) : "m") + "vec{AB}") + ", sharing A" : "No: " + m("vec{AC}") + " isn’t a multiple of " + m("vec{AB}")]);
      rows.push(["Midpoint of AB", m("A + ½vec{AB} = " + tup(scl(add(A, B), 0.5)))]);
      rows.push(["Parallelogram ABCD", m("D = A + C - B = " + tup(f4[0].d))]);
      rows.push(["Your D", m(tup(D)) + (fit ? " ✓ completes parallelogram " + fit.nm : ' <span class="muted">(not a fourth vertex yet)</span>')]);
    } else {
      var o = opRes(), u = S.u, v = S.v, useV = S.op !== "mu" && S.op !== "unit", hid = hidden();
      rows.push([m("vec{u}"), m(tup(u) + " = " + ijk(u))]);
      rows.push([m("vec{v}"), m(tup(v) + " = " + ijk(v)) + (useV ? "" : ' <span class="muted">(not used)</span>')]);
      if (S.op === "mu" || S.op === "muv") rows.push([m("@a{m}"), m("@a{" + srcN(S.m) + "}")]);
      if (hid) rows.push(["Result " + m(o.nm), "?"]);
      else if (!o.r) rows.push(["Result", "None: " + m("vec{0}") + " has no direction."]);
      else if (o.unit) rows.push(["Result " + m(o.nm), m(unitSrc(u)) + (lenEx(u).rat ? "" : " ≈ " + m(approxTup(o.r)))]);
      else rows.push(["Result " + m(o.nm), m(tup(o.r) + " = " + ijk(o.r))]);
      rows.push([m("|vec{u}|") + ", " + m("|vec{v}|"), lenTxt(u) + ", " + lenTxt(v)]);
      if (!hid && o.r) {
        var extra = "";
        if (o.legs) { var a = lenEx(o.legs[0]), b = lenEx(o.legs[1]); extra = ' <span class="ops-grey">compare ' + m("|" + (S.op === "muv" ? "@a{m}vec{u}" : "vec{u}") + "| + |vec{v}|") + " = " + (a.rat && b.rat ? num(a.val + b.val, 2) : m(a.src + " + " + b.src) + " ≈ " + num(a.val + b.val, 2)) + "</span>"; }
        rows.push(["|result|", lenTxt(o.r) + extra]);
        rows.push(["Parallel to " + m("vec{u}") + "?", parInfo(o.r, u).txt]);
      }
    }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function paintRec(){
    var el = $("#ops-recfb", host), h = "";
    if (recMsg) h += MV.fbHTML(recMsg.good ? "good" : "bad", recMsg.html);
    if (tc3Set() && S.found.length) h += '<p class="tiny ops-found">Fourth vertices found: ' + S.found.map(function(k){ return m("D" + tup(k.split("|").map(Number))) + " ✓"; }).join(", ") + "</p>";
    el.innerHTML = h;
  }
  function sync(){
    var pt = S.mode === "pt";
    $("#ops-how", host).innerHTML = U.modeHow[S.mode];
    $("#ops-opw", host).hidden = pt; $("#ops-ptw", host).hidden = !pt;
    MV.keepFocus($("#ops-opc", host), function(){
      $("#ops-opc", host).innerHTML = U.ops.map(function(x){ var on = S.op === x.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-op="' + x.id + '" data-k="op' + x.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + x.t + "</button>"; }).join("");
    });
    MV.keepFocus($("#ops-pc", host), function(){
      $("#ops-pc", host).innerHTML = PTS.map(function(k){ var on = S.sel === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-pt="' + k + '" data-k="pt' + k + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">Point " + k + (k === "D" ? " (yours)" : "") + "</button>"; }).join("");
    });
    MV.keepFocus($("#ops-vw", host), function(){
      $("#ops-vw", host).innerHTML = U.views.map(function(x){ return '<button type="button" class="chip" data-vw="' + x.id + '" data-k="vw' + x.id + '"' + (busy ? " disabled" : "") + ">" + x.t + "</button>"; }).join("");
    });
    $("#ops-mw", host).hidden = !(S.op === "mu" || S.op === "muv");
    [1, 2, 3].forEach(function(i){ setSl("u" + i, S.u[i - 1]); setSl("v" + i, S.v[i - 1]); });
    setSl("m", S.m);
    var P = S.pts[S.sel], dStep = S.sel === "D" ? 0.5 : 1;
    [1, 2, 3].forEach(function(i){ var el = $("#ops-p" + i, host); el.step = dStep; el.setAttribute("aria-label", ["x", "y", "z"][i - 1] + "-coordinate of point " + S.sel + ", from −12 to 12"); setSl("p" + i, P[i - 1]); });
    $("#ops-rec", host).disabled = busy;
    $$sl().forEach(function(el){ el.disabled = busy; });
  }
  function $$sl(){ return Array.prototype.slice.call(host.querySelectorAll("input[type=range]")); }
  function setSl(id, v){ var el = $("#ops-" + id, host); if (!el) return; el.value = v; $("#ops-" + id + "out", host).textContent = txtN(Math.round(v * 100) / 100); }
  function after(how){
    if (how !== "anim") { mark = null; api.save(); }
    if (how !== "anim") sync();
    else { [1, 2, 3].forEach(function(i){ setSl("u" + i, S.u[i - 1]); setSl("v" + i, S.v[i - 1]); }); setSl("m", S.m); }
    paintEq(); paintRead(); paintRec(); draw();
    if (how !== "anim") MV.changed();
  }
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id) return;
    if (busy) { sync(); return; }
    var v = +e.target.value;
    if (id === "m") S.m = v;
    else if (id[0] === "u") S.u[+id[1] - 1] = v;
    else if (id[0] === "v") S.v[+id[1] - 1] = v;
    else if (id[0] === "p") { S.pts[S.sel][+id[1] - 1] = v; recMsg = null; }
    after();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.op) { S.op = b.dataset.op; after(); return; }
    if (b.dataset.pt) { S.sel = b.dataset.pt; after(); return; }
    if (b.dataset.vw) { var q = VIEWS[b.dataset.vw]; if (anim) anim(); anim = view.tweenCam(q[0], q[1], 700, function(){ anim = null; S.cam = view.cam(); api.save(); }); return; }
    if (b.id === "ops-rec") { record(); return; }
  });
  // ---- Record D (TC3: the first D recorded is the first try) ----
  function record(){
    var D = P3("D"), f4 = fourth(), fit = f4.filter(function(q){ return same(q.d, D); })[0], key = D.map(r6).join("|"), set = tc3Set(), M = MS.tc3;
    if (set && S.rec0 == null) {
      S.rec0 = !!fit;
      if (!fit && MV.S && MV.S.chal) { var cs = MV.S.chal.tc3 || (MV.S.chal.tc3 = { tries:0, hint:0, solved:false, first:null }); if (!cs.solved) cs.tries++; }
    }
    if (fit) {
      if (!set) recMsg = { good:true, html:"✓ D" + m(tup(D)) + " completes parallelogram " + fit.nm + "." };
      else if (S.found.indexOf(key) >= 0) recMsg = { good:false, html:tpl(M.again, { p:m(tup(D)) }) };
      else { S.found.push(key); recMsg = { good:true, html:tpl(M.found, { p:m(tup(D)), n:S.found.length }) }; }
    } else {
      var Cc = P3("C"), B = P3("B"), A = P3("A");
      if (same(D, sub(Cc, B))) recMsg = { good:false, html:M.cb };
      else if (same(D, scl(add(A, Cc), 0.5))) recMsg = { good:false, html:M.mid };
      else recMsg = { good:false, html:tpl(M.wrong, { p:m(tup(D)) }) };
    }
    api.save(); paintRec(); paintRead(); draw(); MV.changed(); MV.focusFb($("#ops-ptw", host));
  }
  // ---- challenges ----
  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.mode === "pt" || S.op !== "add") return { ok:false, msg:M.mode };
      if (!same(S.u, [2, -4, 1])) return { ok:false, msg:M.u };
      if (same(S.v, [-2, 4, 2])) return { ok:true };
      if (same(S.v, [0, 0, 3])) return { ok:false, msg:M.target };
      if (same(S.v, [2, -4, 2])) return { ok:false, msg:M.zonly };
      return { ok:false, msg:tpl(M.other, { r:m(tup(add(S.u, S.v))) }) };
    }
    if (id === "tc2") {
      if (S.mode === "pt" || (S.op !== "mu" && S.op !== "unit")) return { ok:false, msg:M.mode };
      if (!same(S.u, [1, -2, 2])) return { ok:false, msg:M.u };
      if (S.op === "unit") return { ok:false, msg:M.unit };
      if (near(S.m, 2)) return { ok:true };
      if (near(S.m, 6)) return { ok:false, msg:M.m6 };
      if (near(S.m, -2)) return { ok:false, msg:M.mneg };
      if (near(S.m, 1 / 3, 1e-6)) return { ok:false, msg:M.unit };
      return { ok:false, msg:tpl(M.other, { L:txtN(Math.abs(S.m) * 3) }) + (S.m < 0 ? " A negative " + m("@a{m}") + " also reverses the direction." : "") };
    }
    if (id === "tc3") {
      if (S.mode !== "pt" || !tc3Set()) return { ok:false, msg:M.abc };
      if (S.found.length >= 3) return { ok:true };
      if (!S.found.length) return { ok:false, msg:M.none };
      return { ok:false, msg:tpl(M.some, { n:S.found.length }) };
    }
    return { ok:false };
  }
  // ---- predictions ----
  var START = {
    p1:{ mode:"op", op:"add", u:[2, -1, 3], v:[1, 4, -3], hide:true },
    p2:{ mode:"op", op:"mu", u:[1, 2, 2], m:1 },
    p3:{ mode:"op", op:"add", u:[1, 2, 2], v:[2, -2, 1], hide:true },
    p4:{ mode:"pt", A:[1, 0, 2], B:[3, 1, 5], C:[7, 3, 11], hideD:true }
  };
  function tw(dur, step, cb){ anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:function(){ anim = null; cb(); } }); }
  after();
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; }
        var s = START[p.id] || START.p1;
        busy = true; mark = null; recMsg = null;
        S.mode = s.mode; seg.set(S.mode);
        if (s.op) S.op = s.op; if (s.u) S.u = s.u.slice(); if (s.v) S.v = s.v.slice(); if (s.m != null) S.m = s.m;
        if (s.A) { S.pts.A = s.A.slice(); S.pts.B = s.B.slice(); S.pts.C = s.C.slice(); }
        pv = { hide:!!s.hide, hideD:!!s.hideD, grow:s.hide ? 0 : 1 };
        view.setCam(45, 35.26); S.cam = view.cam();
        api.save(); sync(); paintEq(); paintRead(); paintRec(); draw();
      },
      run:function(p, done){
        function fin(){ busy = false; pv = null; S.cam = view.cam(); api.save(); sync(); paintEq(); paintRead(); draw(); MV.changed(); done(); }
        function show(mk, ms){ mark = mk; draw(); MV.wait(ms || 1300, fin); }
        function grow(cb){ tw(1500, function(t){ pv.grow = t; draw(); }, function(){ pv.grow = 1; after("anim"); cb(); }); }
        if (p.id === "p1") grow(function(){ anim = view.tweenCam(45, 0, 1500, function(){ anim = null; show([{ p:[3, 3, 0], text:"(3, 3, 0): no height" }]); }); });
        else if (p.id === "p2") tw(2200, function(t){ S.m = 1 - 3 * t; after("anim"); }, function(){ S.m = -2; after("anim"); show([{ p:[-2, -4, -4], text:"|" + MINUS + "2u⃗| = 2 × 3 = 6", dy:22 }]); });
        else if (p.id === "p3") grow(function(){ show([{ p:[3, 0, 3], text:"|u⃗ + v⃗| = 3√2 ≈ 4.2" }]); });
        else if (p.id === "p4") { var c0 = view.cam(); tw(3200, function(t){ view.setCam(c0.phi + 360 * t, c0.th); }, function(){ view.setCam(c0.phi, c0.th); show([{ p:[7, 3, 11], text:"AC⃗ = 3AB⃗", dy:-18 }], 1500); }); }
        else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Prove it with components (station stepper) ----------
var MIDA = [-1, 2, 4], MIDB = [3, -2, 6], PARW = [2, -3, 4];
function part3(host, api){
  var S = api.S, C = api.content, SL = C.stations, s1 = SL[0];
  if (["s1", "s2", "s3"].indexOf(S.st) < 0) S.st = "s1";
  S.pf = S.pf || {};
  s1.proofs.forEach(function(p){ var x = S.pf[p.id]; if (!x || !Array.isArray(x.sel) || x.sel.length !== p.lines.length) S.pf[p.id] = { sel:p.lines.map(function(){ return null; }), act:0, res:null, done:false }; });
  if (!(typeof S.c === "number" && S.c >= -8 && S.c <= 8)) S.c = 0;
  if (!Array.isArray(S.hits)) S.hits = [];
  if (!(typeof S.p === "number" && S.p >= -10 && S.p <= 10)) S.p = 4;
  if (!(typeof S.q === "number" && S.q >= -10 && S.q <= 10)) S.q = 2;
  if (!(typeof S.s === "number" && S.s >= 0 && S.s <= 1)) S.s = 0;
  if (S.sub !== "mid") S.sub = "par";
  var anim = null;
  host.innerHTML = '<div class="chips ops-stc" id="ops-stc" role="group" aria-label="Choose a station"></div>' +
    '<div class="ops-st" data-st="s1"><h3>' + s1.title + "</h3><p>" + s1.text + "</p>" + s1.proofs.map(function(p){
      return '<div class="ops-pf" data-pf="' + p.id + '"><p class="ops-claim"><strong>Claim:</strong> ' + p.claim + '</p><ol class="ops-lines"></ol>' +
        '<p class="tiny muted ops-bl">Reasons</p><div class="chips ops-bank" role="group" aria-label="Reasons"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-act="pfcheck" data-k="' + p.id + 'chk">Check proof</button><button type="button" class="btn ghost sm" data-act="pfclear" data-k="' + p.id + 'clr">Clear</button></div><div class="ops-pffb"></div></div>';
    }).join("") + '<div class="q-actions"><button type="button" class="btn ghost sm" data-next="s1" data-k="opsnx1">Next station</button></div></div>' +
    '<div class="ops-st" data-st="s2"><h3>' + SL[1].title + "</h3><p>" + SL[1].text + '</p><div class="sym ops-stg"><div><div class="ops-v3" id="ops-v2"></div>' +
      stSl("c", m("c"), -8, 8, 0.5, "--ink", "c, the middle component, from −8 to 8") + '</div><div><dl class="read" id="ops-r2" aria-live="polite"></dl><div id="ops-h2" aria-live="polite"></div>' +
      alg(SL[1]) + '</div></div><div class="q-actions"><button type="button" class="btn ghost sm" data-next="s2" data-k="opsnx2">Next station</button></div></div>' +
    '<div class="ops-st" data-st="s3"><h3>' + SL[2].title + "</h3><p>" + SL[2].text + '</p><div id="ops-sub"></div><div class="sym ops-stg"><div><div class="ops-v3" id="ops-v3"></div>' +
      '<div id="ops-par3">' + stSl("p", m("p"), -10, 10, 1, "--f3", "p, from −10 to 10") + stSl("q", m("q"), -10, 10, 1, "--f3", "q, from −10 to 10") + "</div>" +
      '<div id="ops-mid3" hidden>' + stSl("s", "Fraction of " + m("vec{AB}"), 0, 1, 0.05, "--ink", "Fraction s of the way from A to B, from 0 to 1") +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="slide" data-k="opsslide">Slide to the midpoint</button></div></div>' +
      '</div><div><dl class="read" id="ops-r3" aria-live="polite"></dl>' + alg(SL[2]) + "</div></div></div>";
  function stSl(id, label, min, max, step, col, aria){
    return '<label class="slider ops-sl" style="--ops-edge:var(' + col + ')"><span class="slider-top"><span>' + label + '</span><output id="ops-' + id + 'o" style="color:var(' + col + ')"></output></span>' +
      '<input type="range" id="ops-' + id + 'i" data-ps="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" style="accent-color:var(' + col + ')" aria-label="' + MV.esc(aria) + '"></label>';
  }
  function alg(st){ return '<details class="alg"><summary>Check it with algebra</summary><ol class="ops-steps" aria-live="polite"></ol><div class="ops-pl"></div></details>'; }
  [SL[1], SL[2]].forEach(function(st){
    var box = $('[data-st="' + st.id + '"]', host);
    MV.player($(".ops-pl", box), { count:st.alg.length, interval:1500, label:function(i){ return "Step " + (i + 1) + " of " + st.alg.length; },
      render:function(i){ $(".ops-steps", box).innerHTML = st.alg.map(function(l, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '">' + l + "</li>" : ""; }).join(""); } });
  });
  var v2 = view3d($("#ops-v2", host), { interactive:true, phi:35, th:22, label:"3D view of the sphere and the line: drag, or use the arrow keys, to rotate" });
  var v3 = view3d($("#ops-v3", host), { interactive:true, phi:40, th:25, label:"3D view for station 3: drag, or use the arrow keys, to rotate" });
  var sub3 = MV.seg($("#ops-sub", host), { label:"Part", options:[{ id:"par", t:"Parallel vectors" }, { id:"mid", t:"Midpoint" }], value:S.sub, onChange:function(id){ S.sub = id; api.save(); paint3(); } });

  // ---- station 1: proof chips ----
  function paintPf(p){
    var x = S.pf[p.id], box = $('[data-pf="' + p.id + '"]', host), ch = {};
    s1.chips.forEach(function(c){ ch[c.id] = c.t; });
    MV.keepFocus($(".ops-lines", box), function(){
      $(".ops-lines", box).innerHTML = p.lines.map(function(l, i){
        var on = x.act === i && !x.done, r = x.res ? x.res[i] : null, mk = r === true ? '<span class="ops-ok" aria-label="correct">✓</span>' : r === false ? '<span class="ops-no" aria-label="not right">✗</span>' : "";
        return '<li><button type="button" class="ops-line' + (on ? " on" : "") + (r === false ? " bad" : "") + '" data-ln="' + i + '" data-k="' + p.id + "ln" + i + '" aria-pressed="' + on + '"' + (x.done ? " disabled" : "") + '><span class="ops-ls">' + l.s + '</span><span class="ops-lr">' +
          (x.sel[i] ? ch[x.sel[i]] : '<span class="muted">Choose a reason</span>') + mk + "</span></button></li>";
      }).join("");
    });
    MV.keepFocus($(".ops-bank", box), function(){
      $(".ops-bank", box).innerHTML = s1.chips.map(function(c){ return '<button type="button" class="chip" data-ch="' + c.id + '" data-k="' + p.id + "ch" + c.id + '"' + (x.done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("");
    });
  }
  function pfFb(p, html, good){ $(".ops-pffb", $('[data-pf="' + p.id + '"]', host)).innerHTML = html ? MV.fbHTML(good ? "good" : "bad", html) : ""; }
  function checkPf(p){
    var x = S.pf[p.id];
    if (x.sel.some(function(s){ return !s; })) { pfFb(p, "Give every line a reason first.", false); return; }
    x.res = p.lines.map(function(l, i){ return x.sel[i] === l.k; });
    var bad = []; p.lines.forEach(function(l, i){ if (!x.res[i]) bad.push("Line " + (i + 1) + ": " + (x.sel[i] === "ex" ? s1.trap : l.fb + " Which reason fits?")); });
    if (!bad.length) { x.done = true; pfFb(p, "<strong>✓ Proof complete.</strong> " + s1.done, true); }
    else pfFb(p, "<strong>✗ Not quite.</strong> " + bad.join(" "), false);
    api.save(); paintPf(p); MV.focusFb($('[data-pf="' + p.id + '"]', host));
  }
  s1.proofs.forEach(function(p){ paintPf(p); if (S.pf[p.id].done) pfFb(p, "<strong>✓ Proof complete.</strong> " + s1.done, true); });

  // ---- station 2: sphere of radius 7 and the line (2, t, 6) ----
  function paint2(){
    var c = S.c, P = [2, c, 6], sq = 40 + c * c, on = near(sq, 49);
    if (on && S.hits.indexOf(c) < 0) S.hits.push(c);
    $("#ops-ci", host).value = c; $("#ops-co", host).textContent = txtN(c);
    var it = [{ k:"sphere", r:7, col:"--pen", a:0.1 }, { k:"seg", a:[2, -9, 6], b:[2, 9, 6], col:"--ink-2", w:2 }, { k:"seg", a:O3, b:P, col:"--ink-2", w:1.4, dash:"4 4" }];
    S.hits.forEach(function(h){ it.push({ k:"pt", p:[2, h, 6], col:"--pen", r:4.5, label:"c = " + txtN(h), dy:18 }); });
    it.push({ k:"pt", p:P, col:"--ink", r:6, ring:on, label:on ? "" : "(2, " + txtN(c) + ", 6)" });
    v2.draw({ R:12, items:it, describe:"A translucent sphere of radius 7 about O and the line of points (2, t, 6). The point (2, " + txtN(c) + ", 6) is " + num(Math.sqrt(sq), 2) + " from O" + (on ? ", on the sphere." : ".") + (S.hits.length ? " Hits found: c = " + S.hits.map(txtN).join(" and ") + "." : "") });
    var Lx = lenEx(P);
    $("#ops-r2", host).innerHTML = MV.readoutHTML([["Point", m(tup(P))], [m("|(2, c, 6)|"), m("√{4 + c^2 + 36} = " + Lx.src) + (Lx.rat ? "" : " ≈ " + num(Lx.val, 2))],
      ["On the sphere?", on ? "<strong>Yes ✓</strong> length 7" : Lx.val < 7 ? "No: inside (shorter than 7)" : "No: outside (longer than 7)"]]);
    var both = S.hits.indexOf(3) >= 0 && S.hits.indexOf(-3) >= 0;
    $("#ops-h2", host).innerHTML = both ? MV.fbHTML("good", "<strong>✓ Both hits found:</strong> " + m("c = 3") + " or " + m("c = -3") + ". The line meets the sphere twice.") :
      S.hits.length ? MV.fbHTML("", "One hit found. The line meets the sphere twice: find the other.") : "";
  }
  // ---- station 3: parallel lock, then the midpoint slide ----
  function paint3(){
    var par = S.sub === "par";
    $("#ops-par3", host).hidden = !par; $("#ops-mid3", host).hidden = par;
    var rows, it = [], desc;
    if (par) {
      var W = [S.p, 6, S.q], lock = near(S.p, -4) && near(S.q, -8);
      ["p", "q"].forEach(function(k){ $("#ops-" + k + "i", host).value = S[k]; $("#ops-" + k + "o", host).textContent = txtN(S[k]); });
      it.push({ k:"seg", a:scl(PARW, -2.6), b:scl(PARW, 2.6), col:"--ink-2", w:1.2, dash:"3 5" });
      it.push({ k:"arrow", a:O3, b:PARW, col:"--pen", w:3, label:"(2, " + MINUS + "3, 4)" });
      it.push({ k:"arrow", a:O3, b:W, col:lock ? "--ink" : "--f3", w:lock ? 3.6 : 3, label:"(p, 6, q)" });
      var rat = function(a, b){ var q = Q.of(a / b); return m(srcN(a) + "/" + (b < 0 ? "(" + srcN(b) + ")" : srcN(b)) + " = " + Q.src(q)); };
      rows = [["Ratios", rat(S.p, 2) + ", " + rat(6, -3) + ", " + rat(S.q, 4)],
        ["Parallel?", lock ? "<strong>Locked ✓</strong> " + m("(-4, 6, -8) = -2(2, -3, 4)") + ": every component scales by " + m("m = -2") : "Not yet: the three ratios must all equal the same " + m("m") + "."]];
      desc = "The vector (2, −3, 4) in blue and (" + txtN(S.p) + ", 6, " + txtN(S.q) + ")" + (lock ? ", locked parallel to it with m = −2." : ", not parallel to it yet.");
      v3.draw({ R:niceR([W, scl(PARW, 2.6)]), items:it, describe:desc });
    } else {
      var AB = sub(MIDB, MIDA), P = add(MIDA, scl(AB, S.s)), half = near(S.s, 0.5, 1e-6);
      $("#ops-si", host).value = S.s; $("#ops-so", host).textContent = num(S.s, 2);
      it.push({ k:"seg", a:MIDA, b:MIDB, col:"--ink-2", w:2 }, { k:"arrow", a:MIDA, b:P, col:"--pen", w:3 });
      it.push({ k:"pt", p:MIDA, col:"--ink", label:"A" }, { k:"pt", p:MIDB, col:"--ink", label:"B" }, { k:"pt", p:P, col:"--pen", r:6, ring:half, label:half ? "M" : "", dx:10, dy:16 });
      rows = [["A, B", m("A" + tup(MIDA)) + ", " + m("B" + tup(MIDB))], [m("vec{AB}"), m(tup(AB))], [m("A + s vec{AB}"), m(tup(P.map(function(c){ return Math.round(c * 100) / 100; })))],
        ["Midpoint?", half ? "<strong>Yes ✓</strong> " + m("M = A + ½vec{AB} = (1, 0, 5)") : "Not yet: the midpoint is " + m("s = ½") + " of the way."]];
      desc = "Segment AB from A(−1, 2, 4) to B(3, −2, 6), with the point A + s·AB at s = " + num(S.s, 2) + (half ? ": the midpoint (1, 0, 5)." : ".");
      v3.draw({ R:niceR([MIDA, MIDB]), items:it, describe:desc });
    }
    $("#ops-r3", host).innerHTML = MV.readoutHTML(rows);
  }
  function show(){
    MV.keepFocus($("#ops-stc", host), function(){
      $("#ops-stc", host).innerHTML = SL.map(function(st){ var on = st.id === S.st; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-stc="' + st.id + '" data-k="stc' + st.id + '" aria-pressed="' + on + '">' + st.chip + "</button>"; }).join("");
    });
    SL.forEach(function(st){ $('[data-st="' + st.id + '"]', host).hidden = st.id !== S.st; });
    paint2(); paint3();
  }
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.ps; if (!k) return;
    if (k === "s" && anim) { anim(); anim = null; }
    S[k] = +e.target.value; api.save();
    if (k === "c") paint2(); else paint3();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var pfb = b.closest("[data-pf]");
    if (pfb) {
      var p = s1.proofs.filter(function(z){ return z.id === pfb.dataset.pf; })[0], x = S.pf[p.id];
      if (b.dataset.ln != null) { x.act = +b.dataset.ln; api.save(); paintPf(p); return; }
      if (b.dataset.ch) {
        x.sel[x.act] = b.dataset.ch; x.res = null; pfFb(p, "", true);
        for (var i = 1; i <= x.sel.length; i++) { var j = (x.act + i) % x.sel.length; if (!x.sel[j]) { x.act = j; break; } }
        api.save(); paintPf(p); return;
      }
      if (b.dataset.act === "pfcheck") { checkPf(p); return; }
      if (b.dataset.act === "pfclear") { S.pf[p.id] = { sel:p.lines.map(function(){ return null; }), act:0, res:null, done:false }; api.save(); pfFb(p, "", true); paintPf(p); return; }
    }
    if (b.dataset.stc) { S.st = b.dataset.stc; api.save(); show(); return; }
    if (b.dataset.next) { var n = SL.map(function(s){ return s.id; }).indexOf(b.dataset.next); S.st = SL[n + 1].id; api.save(); show(); var c = $('[data-stc="' + S.st + '"]', host); if (c) c.focus(); return; }
    if (b.dataset.act === "slide") {
      if (anim) anim();
      var s0 = S.s; b.disabled = true;
      anim = MV.tween({ dur:1200, step:function(t){ S.s = s0 + (0.5 - s0) * t; paint3(); }, done:function(){ anim = null; S.s = 0.5; api.save(); paint3(); var bb = $('[data-act="slide"]', host); if (bb) bb.disabled = false; } });
    }
  });
  show();
  return {};
}

// @component V8 compBoxes — component answer boxes (MCV4U 39): rows of "( □, □, □ )" vector boxes, single number boxes and
// list boxes (order-free, ±4 accepted); fractions such as 2/7 accepted, decimals for non-terminating values rejected as
// approximations; named wrong answers (partial key match); boxes marked ✗ after a check; first-try scoring.
function compBoxes(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, bad = {};
  function ist(id){ return S.it[id] || (S.it[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  function keys(it){ var k = []; it.rows.forEach(function(r){ if (r.t === "vec") k.push(r.k + "1", r.k + "2", r.k + "3"); else k.push(r.k); }); return k; }
  function kind(it, key){ var r = it.rows.filter(function(z){ return z.k === key || (z.t === "vec" && key.indexOf(z.k) === 0 && key.length === z.k.length + 1); })[0]; return r ? r.t : "num"; }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it, i){
    return '<div class="q ops-bq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="ops-bin"></div><div class="ops-bcl"></div></div>';
  }).join("");
  function box(it, key, aria, wide){
    var x = ist(it.id), b = bad[it.id] && bad[it.id][key];
    return '<input class="numin ' + (wide ? "ops-wide" : "short") + (b ? " ops-bad" : "") + '" data-bx="' + key + '" data-k="' + it.id + key + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(aria) + '"' + (b ? ' aria-invalid="true"' : "") + ' value="' + MV.esc(x.v[key] || "") + '"' + (x.solved ? " disabled" : "") + ">";
  }
  function paintIn(it){
    var el = $('[data-q="' + it.id + '"] .ops-bin', host);
    MV.keepFocus(el, function(){
      el.innerHTML = it.rows.map(function(r){
        var pre = '<span class="ops-pre">' + (r.pre || "") + "</span>", nm = MV.plain(r.pre || "").replace(/\s*=\s*$/, "") || "Answer";
        if (r.t === "vec") return '<div class="ops-brow">' + pre + '<span class="ops-par">(</span>' + [1, 2, 3].map(function(j){ return box(it, r.k + j, nm + " component " + j); }).join('<span class="ops-par">,</span>') + '<span class="ops-par">)</span></div>';
        return '<div class="ops-brow">' + pre + box(it, r.k, nm, r.t === "list") + (r.post ? "<span>" + r.post + "</span>" : "") + "</div>";
      }).join("");
    });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .ops-bcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function parse(raw, list){
    var s = String(raw == null ? "" : raw).trim(); if (!s) return null;
    if (list) { var L = MV.parseList(s); if (!L) return { err:true }; var out = []; L.forEach(function(v){ out.push(v); }); out.sort(function(p, q){ return p - q; }); return { v:out }; }
    var r = MV.parseNum(s); if (!r || r.length !== 1) return { err:true };
    return { v:[r[0]], dec:/\.\d{3,}/.test(s) };
  }
  function eqv(p, q){ if (p.length !== q.length) return false; for (var i = 0; i < p.length; i++) if (!near(p[i], q[i], 1e-9)) return false; return true; }
  function judge(it){
    var x = ist(it.id), A = MV.ans(it), K = keys(it), got = {}, wrongK = {}, anyDec = false, approx = true, k, i;
    for (i = 0; i < K.length; i++) {
      k = K[i]; var p = parse(x.v[k], kind(it, k) === "list");
      if (!p) return { err:"Fill in every box first." };
      if (p.err) return { err:"Type numbers such as 4, −3 or 2/7" + (kind(it, k) === "list" ? ", separated by commas" : "") + "." };
      got[k] = p.v; if (p.dec) anyDec = true;
    }
    var ok = true;
    K.forEach(function(k){
      var want = parse(A[k], kind(it, k) === "list").v;
      if (!eqv(got[k], want)) { ok = false; wrongK[k] = true; if (!(got[k].length === want.length && got[k].every(function(v, j){ return near(v, want[j], 0.006 * Math.max(1, Math.abs(want[j]))); }))) approx = false; }
    });
    if (ok) return { ok:true };
    var W = it.wrong || [];
    for (i = 0; i < W.length; i++) {
      var hit = Object.keys(W[i].v).every(function(k){ var w = parse(W[i].v[k], kind(it, k) === "list"); return w && !w.err && got[k] && eqv(got[k], w.v); });
      if (hit) return { ok:false, msg:W[i].fb, bad:wrongK };
    }
    if (approx && anyDec) return { ok:false, msg:"Keep it exact: type fractions such as 2/7, not rounded decimals.", soft:true, bad:wrongK };
    return { ok:false, msg:(it.wrongDefault ? it.wrongDefault + " " : "") + (K.length > 1 ? "Check the boxes marked ✗." : ""), bad:wrongK };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) { msgs[it.id] = { bad:false, html:r.err }; bad[it.id] = null; }
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; bad[it.id] = null; }
    else { if (!r.soft) x.tries++; bad[it.id] = K1(it).length > 1 ? r.bad : null; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    paintIn(it); api.save(); paintCl(it); MV.focusFb(q);
  });
  function K1(it){ return keys(it); }
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Square in space ----------
var task = (function(){
  var api, v3, Uu = [2, -1, 2];
  function read(){ var s = api ? api.S : {}; var d = { a:+s.a, b:+s.b, c:+s.c }; d.valid = [d.a, d.b, d.c].every(function(z){ return Number.isInteger(z) && z >= -6 && z <= 6; }); return d; }
  function vv(d){ return [d.a, d.b, d.c]; }
  function draw(){
    var d = read(); if (!v3) return;
    if (!d.valid) { v3.draw({ R:6, items:[], describe:"Set the components of v." }); return; }
    var V = vv(d), F = add(Uu, V), Df = sub(Uu, V), it = [];
    it.push({ k:"seg", a:Uu, b:F, col:"--ink-2", w:1.6, dash:"6 5" }, { k:"seg", a:V, b:F, col:"--ink-2", w:1.6, dash:"6 5" });
    it.push({ k:"seg", a:V, b:Uu, col:"--f5", w:2.4, dash:"8 4" }, { k:"arrow", a:O3, b:F, col:"--ink", w:3.2 });
    it.push({ k:"arrow", a:O3, b:Uu, col:"--pen", w:3, label:"u⃗" });
    if (!isZero(V)) it.push({ k:"arrow", a:O3, b:V, col:"--f3", w:3, label:"v⃗" });
    it.push({ k:"pt", p:F, col:"--ink", r:5, label:"far corner", dx:10, dy:-10 });
    it.push({ k:"seg", a:F, b:[F[0], F[1], 0], col:"--ink-2", w:1, dash:"2 3" });
    v3.draw({ R:niceR([F, Df, V, Uu]), items:it, describe:"Parallelogram with vertices O, u = (2, −1, 2), u + v = " + tupTxt(F) + " and v = " + tupTxt(V) + ". Diagonal lengths: |u + v| = " + num(len(F), 2) + " and |u − v| = " + num(len(Df), 2) + ". The far corner is at height " + txtN(F[2]) + "." });
  }
  function readout(){
    var d = read(), el = $("#ops-tread"); if (!el) return;
    if (!d.valid) { el.innerHTML = ""; return; }
    var V = vv(d), F = add(Uu, V), Df = sub(Uu, V);
    el.innerHTML = MV.readoutHTML([[m("vec{v}"), m(tup(V))], [m("|vec{v}|"), lenTxt(V)], [m("|vec{u} + vec{v}|") + " (dark diagonal)", lenTxt(F)], [m("|vec{u} - vec{v}|") + " (orange diagonal)", lenTxt(Df)], ["Far corner " + m("vec{u} + vec{v}"), m(tup(F)) + ", height " + m("2 + c = " + srcN(F[2]))]]);
  }
  function paintIn(inp){ ["a", "b", "c"].forEach(function(k){ $("#ops-t" + k, inp).value = api.S[k]; $("#ops-t" + k + "o", inp).textContent = txtN(api.S[k]); }); }
  return {
    render:function(inp, pv, a){
      api = a; ["a", "b", "c"].forEach(function(k, i){ if (!(Number.isInteger(a.S[k]) && a.S[k] >= -6 && a.S[k] <= 6)) a.S[k] = [1, 0, 0][i]; });
      inp.innerHTML = '<p class="tiny muted">' + m("vec{v} = (a, b, c)") + ", whole numbers from −6 to 6.</p>" + ["a", "b", "c"].map(function(k){
        return '<label class="slider ops-sl" style="--ops-edge:var(--f3)"><span class="slider-top"><span>' + m(k) + '</span><output id="ops-t' + k + 'o" style="color:var(--f3)"></output></span>' +
          '<input type="range" id="ops-t' + k + '" data-tk="' + k + '" min="-6" max="6" step="1" style="accent-color:var(--f3)" aria-label="Component ' + k + ' of v, from −6 to 6"></label>';
      }).join("");
      pv.innerHTML = '<div class="ops-v3" id="ops-tv"></div><dl class="read" id="ops-tread" aria-live="polite" style="margin-top:10px"></dl>';
      v3 = view3d($("#ops-tv", pv), { interactive:true, phi:40, th:25, label:"3D view of your parallelogram: drag, or use the arrow keys, to rotate" });
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = +e.target.value; a.save(); paintIn(inp); draw(); readout(); a.update(); });
      paintIn(inp); draw(); readout();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose whole-number components from −6 to 6."; },
    checks:function(d){
      if (!d.valid) return [false, false, false];
      return [d.a * d.a + d.b * d.b + d.c * d.c === 9, 2 * d.a - d.b + 2 * d.c === 0, 2 + d.c > 0];
    },
    key:function(d){ return d.a + "|" + d.b + "|" + d.c; },
    label:function(k){ return m("vec{v} = (" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "v = (" + k.split("|").map(function(z){ return txtN(+z); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ compute:compBoxes, unknowns:compBoxes },
  task:task
});
})();
