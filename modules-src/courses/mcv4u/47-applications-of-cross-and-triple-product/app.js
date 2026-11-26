// MCV4U 47 Applications of the Cross Product and Triple Scalar Product: hero (a wrench pushed at 90°, then at 30°, then a
// slanted box assembling from a⃗, b⃗, c⃗), Wrench and torque (Explore: a 2D wrench scene, V1 3D torque with a turning bolt,
// V1 triangle areas with recorded positions for TC3), Volume of a parallelepiped (Part 3: five V1 stations as tabs: build,
// lean, flatten, reorder, four points) and the "Lean the box" task (V1 preview).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
var DEG = Math.PI / 180;

// ---------- vectors and exact numbers ----------
function add(p, q){ return [p[0] + q[0], p[1] + q[1], p[2] + q[2]]; }
function sub(p, q){ return [p[0] - q[0], p[1] - q[1], p[2] - q[2]]; }
function mul(p, k){ return [p[0] * k, p[1] * k, p[2] * k]; }
function dot(p, q){ return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
function cross(p, q){ return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
function len(p){ return Math.sqrt(dot(p, p)); }
function same(p, q){ return p[0] === q[0] && p[1] === q[1] && p[2] === q[2]; }
function rnd(x, dp){ var p = Math.pow(10, dp == null ? 6 : dp), r = Math.round(x * p) / p; return r === 0 ? 0 : r; }
function ns(x, dp){ return String(rnd(x, dp == null ? 2 : dp)); }                 // m() source number (m makes the minus)
function vsrc(v, dp){ return "(" + v.map(function(x){ return ns(x, dp); }).join(", ") + ")"; }
function pp(x){ return x < 0 ? "(" + ns(x) + ")" : ns(x); }
function vtxt(v, dp){ return MV.plain(m(vsrc(v, dp))); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function sqf(n){ var k = 1, r = n; for (var d = 2; d * d <= r; d++) while (r % (d * d) === 0) { r /= d * d; k *= d; } return [k, r]; }
// m() source for √n (n a whole number), or ½√n with half
function rootSrc(n, half){
  n = Math.round(n); if (n <= 0) return "0";
  var kr = sqf(n), k = kr[0], r = kr[1];
  if (!half) return r === 1 ? String(k) : (k === 1 ? "" : k) + "√" + r;
  if (r === 1) return k % 2 ? "{" + k + "}/{2}" : String(k / 2);
  return k % 2 ? "{" + (k === 1 ? "" : k) + "√" + r + "}/{2}" : (k === 2 ? "" : k / 2) + "√" + r;
}
function irr(n){ return sqf(Math.round(n))[1] !== 1; }
function rootHTML(n, half, unit){
  var v = Math.sqrt(Math.max(0, n)) * (half ? 0.5 : 1);
  return m(rootSrc(n, half)) + (unit || "") + (irr(n) ? " ≈ " + num(v, 2) + (unit || "") : "");
}
// T / √N exactly (T, N whole numbers): the signed height of a box
function overRootSrc(T, N){
  T = Math.round(T); N = Math.round(N);
  if (!T) return "0";
  var kr = sqf(N), k = kr[0], r = kr[1], d = k * r, g = gcd(T, d), a = Math.abs(T) / g, b = d / g, s = T < 0 ? "-" : "";
  var top = r === 1 ? String(a) : (a === 1 ? "" : a) + "√" + r;
  return b === 1 ? s + top : s + "{" + top + "}/{" + b + "}";
}

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view in SVG (course plan V1). Drag or arrow keys rotate it (Shift: big steps);
// preset buttons give Isometric, Front (xz), Side (yz) and Top (xy). Draws axes (--ink-2, negative halves dashed, x y z at
// the positive ends), vectors as arrows, segments, polylines, translucent polygons and labelled points, painter-sorted by
// depth; farther strokes are drawn fainter. Colours are token names ("--pen"), applied through style so themes switch live.
// new View3D(host, {aria}) -> {draw(scene), redraw(), set(az, el), svg}; scene = {range, items:[…], describe}.
// Items: {k:"line", pts:[[x,y,z],…], col, w, dash, arrow, label, op} · {k:"poly", pts, col, op} · {k:"pt", pts:[p], col, r, label}
//        · {k:"text", pts:[p], text, col}. With reduced motion nothing eases (there is no inertia anyway).
function v3Proj(az, el, s, cx, cy){
  var ca = Math.cos(az * DEG), sa = Math.sin(az * DEG), ce = Math.cos(el * DEG), se = Math.sin(el * DEG);
  var R = [-sa, ca, 0], U = [-se * ca, -se * sa, ce], D = [ce * ca, ce * sa, se];
  return function(p){ return [cx + s * dot(p, R), cy - s * dot(p, U), dot(p, D)]; };
}
function v3Head(a, b, col, w, op){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy); if (L < 0.5) return "";
  var hl = Math.min(8 + w * 1.6, L * 0.9), hw = hl * 0.45, ux = dx / L, uy = dy / L, bx = b[0] - ux * hl, by = b[1] - uy * hl;
  return '<polygon points="' + [b[0], b[1], bx - uy * hw, by + ux * hw, bx + uy * hw, by - ux * hw].map(function(v){ return v.toFixed(1); }).join(" ") +
    '" style="fill:var(' + col + ');opacity:' + op.toFixed(2) + '"/>';
}
function v3Render(items, pr, dn){
  var list = items.map(function(it, i){
    var P = it.pts.map(pr), d = P.reduce(function(s, q){ return s + q[2]; }, 0) / P.length + (it.k === "poly" ? -0.05 : it.k === "text" ? 50 : 0);
    return { it:it, P:P, d:d, i:i };
  });
  list.sort(function(a, b){ return a.d - b.d || a.i - b.i; });
  return list.map(function(e){
    var it = e.it, P = e.P, col = it.col || "--ink", fade = it.k === "poly" || it.k === "text" ? 1 : 0.62 + 0.38 * clamp((e.d + dn) / (2 * dn), 0, 1);
    var op = (it.op == null ? 1 : it.op) * fade, h = "";
    if (it.k === "poly") return '<polygon points="' + P.map(function(q){ return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" ") + '" style="fill:var(' + col + ');fill-opacity:calc(' + (it.op || 0.14) + ' * var(--ap-face, 1));stroke:none"/>';
    if (it.k === "pt") {
      h = '<circle cx="' + P[0][0].toFixed(1) + '" cy="' + P[0][1].toFixed(1) + '" r="' + (it.r || 4.5) + '" style="fill:var(' + col + ');opacity:' + op.toFixed(2) + '"/>';
      if (it.label) h += '<text class="v3-t" x="' + (P[0][0] + 8).toFixed(1) + '" y="' + (P[0][1] - 8).toFixed(1) + '" style="fill:var(' + col + ')">' + MV.esc(it.label) + "</text>";
      return h;
    }
    if (it.k === "text") return '<text class="v3-t' + (it.ui ? " v3-ui" : "") + '" x="' + (P[0][0] + (it.dx || 0)).toFixed(1) + '" y="' + (P[0][1] + (it.dy || 0)).toFixed(1) + '" text-anchor="' + (it.anchor || "middle") + '" style="fill:var(' + col + ')">' + MV.esc(it.text) + "</text>";
    var w = it.w || 2;
    h = '<polyline points="' + P.map(function(q){ return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" ") + '" style="fill:none;stroke:var(' + col + ');stroke-width:' + w + ';opacity:' + op.toFixed(2) +
      (it.dash ? ";stroke-dasharray:" + it.dash : "") + ';stroke-linecap:round;stroke-linejoin:round"/>';
    if (it.arrow && P.length > 1) h += v3Head(P[P.length - 2], P[P.length - 1], col, w, op);
    if (it.label && P.length > 1) {
      var a = P[0], b = P[P.length - 1], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      h += '<text class="v3-t" x="' + (b[0] + dx / L * 13 - dy / L * 6).toFixed(1) + '" y="' + (b[1] + dy / L * 13 + dx / L * 6 + 5).toFixed(1) + '" text-anchor="middle" style="fill:var(' + col + ')">' + MV.esc(it.label) + "</text>";
    }
    return h;
  }).join("");
}
function v3Axes(R){
  var out = [], E = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], N = ["x", "y", "z"];
  E.forEach(function(e, i){
    out.push({ k:"line", pts:[mul(e, -R), [0, 0, 0]], col:"--ink-2", w:1.5, dash:"5 4", op:0.8 });
    out.push({ k:"line", pts:[[0, 0, 0], mul(e, R)], col:"--ink-2", w:1.5, op:0.9, arrow:true });
    out.push({ k:"text", pts:[mul(e, R + 0.55)], text:N[i], col:"--ink-2", dy:5 });
  });
  return out;
}
var V3PRE = [{ id:"iso", t:"Isometric", az:45, el:35.26 }, { id:"front", t:"Front (xz)", az:-90, el:0 }, { id:"side", t:"Side (yz)", az:0, el:0 }, { id:"top", t:"Top (xy)", az:-90, el:90 }];
function View3D(host, o){
  o = o || {};
  var az = o.az != null ? o.az : 40, el = o.el != null ? o.el : 24, scene = null, drag = null, uid = "v3" + Math.random().toString(36).slice(2, 7);
  host.innerHTML = '<div class="v3"><svg class="v3-svg" viewBox="0 0 360 360" tabindex="0" role="img" aria-label="' + MV.esc(o.aria || "3D view") + '"></svg>' +
    '<div class="v3-bar" role="group" aria-label="View presets">' + V3PRE.map(function(p){ return '<button type="button" class="btn ghost sm" data-v3="' + p.id + '" data-k="' + uid + p.id + '">' + p.t + "</button>"; }).join("") + "</div>" +
    '<p class="tiny muted v3-note">Drag the view, or focus it and use the arrow keys (Shift for big steps), to rotate.</p></div>';
  var svg = $("svg", host);
  function redraw(){
    if (!scene) return;
    var items = v3Axes(scene.range || 5).concat(scene.items || []), R = scene.range || 5;
    items.forEach(function(it){ it.pts.forEach(function(p){ R = Math.max(R, len(p) * (it.k === "text" ? 0.9 : 1)); }); });
    var pr = v3Proj(az, el, 150 / (R + 0.6), 180, 180);
    svg.innerHTML = v3Render(items, pr, R * 1.2);
    svg.setAttribute("aria-label", (scene.describe || "3D view.") + " View from azimuth " + Math.round(((az % 360) + 360) % 360) + "°, elevation " + Math.round(el) + "°. Drag, or use the arrow keys, to rotate.");
  }
  function set(a, e){ az = a; el = clamp(e, -89, 90); redraw(); }
  svg.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, az:az, el:el }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
  svg.addEventListener("pointermove", function(e){ if (!drag) return; var k = 360 / Math.max(120, svg.getBoundingClientRect().width); set(drag.az - (e.clientX - drag.x) * k * 0.6, drag.el + (e.clientY - drag.y) * k * 0.6); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function(t){ svg.addEventListener(t, function(){ drag = null; }); });
  svg.addEventListener("keydown", function(e){
    var st = e.shiftKey ? 15 : 5, k = e.key;
    if (k === "ArrowLeft") set(az - st, el); else if (k === "ArrowRight") set(az + st, el);
    else if (k === "ArrowUp") set(az, el + st); else if (k === "ArrowDown") set(az, el - st); else return;
    e.preventDefault();
  });
  $(".v3-bar", host).addEventListener("click", function(e){ var b = e.target.closest("[data-v3]"); if (!b || b.disabled) return; var p = V3PRE.filter(function(x){ return x.id === b.dataset.v3; })[0]; set(p.az, p.el); });
  return { draw:function(s){ scene = s; redraw(); }, redraw:redraw, set:set, svg:svg };
}
// box on three edges from the origin: corner faces (base darkest), the 9 other edges, the three edge arrows
function boxItems(a, b, c, base, labels){
  var o = [0, 0, 0], ab = add(a, b), bc = add(b, c), ca = add(c, a), abc = add(ab, c), L = labels || ["a⃗", "b⃗", "c⃗"], it = [];
  [["ab", [o, a, ab, b]], ["bc", [o, b, bc, c]], ["ca", [o, c, ca, a]]].forEach(function(f){ it.push({ k:"poly", pts:f[1], col:"--ink-2", op:f[0] === base ? 0.3 : 0.12 }); });
  [[a, ab], [a, ca], [b, ab], [b, bc], [c, bc], [c, ca], [ab, abc], [bc, abc], [ca, abc]].forEach(function(e){ it.push({ k:"line", pts:e, col:"--ink-2", w:1.3, op:0.75 }); });
  it.push({ k:"line", pts:[o, a], col:"--pen", w:3, arrow:true, label:L[0] });
  it.push({ k:"line", pts:[o, b], col:"--f3", w:3, arrow:true, label:L[1] });
  it.push({ k:"line", pts:[o, c], col:"--f5", w:3, arrow:true, label:L[2] });
  return it;
}
// dashed height from the plane of u, v (through the origin) up to the tip of w
function heightItems(u, v, w){
  var n = cross(u, v), nn = dot(n, n); if (nn < 1e-12) return [];
  var foot = sub(w, mul(n, dot(w, n) / nn));
  if (len(sub(w, foot)) < 1e-6) return [];
  return [{ k:"line", pts:[foot, w], col:"--ink", w:2.2, dash:"6 4" }, { k:"text", pts:[mul(add(foot, w), 0.5)], text:"h", col:"--ink", dx:-10, dy:4 }];
}
function boxDescribe(a, b, c, V){ return "Parallelepiped with edges a = " + vtxt(a) + ", b = " + vtxt(b) + ", c = " + vtxt(c) + " from the origin; volume " + num(Math.abs(V), 2) + "."; }
// ---------------------------------------------- end of V1 view3d ----------------------------------------------------

// @component V2 det3 — 3 × 3 determinant layout (course plan V2): rows of m() sources between vertical bars
function detHTML(rows){
  return '<span class="ap-det" role="img" aria-label="determinant with rows ' + MV.esc(rows.map(function(r){ return "(" + r.map(function(x){ return MV.plain(m(x)); }).join(", ") + ")"; }).join(", ")) + '">' +
    rows.map(function(r){ return '<span class="ap-dr">' + r.map(function(x){ return "<span>" + m(x) + "</span>"; }).join("") + "</span>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component wrenchView — 2D side view of a wrench on a bolt (plan §5): the wrench (--pen), the force at its end (--f3), the
// dashed perpendicular part F sin θ, an angle arc, the bolt and a curved --ink torque arrow whose size scales with |τ|.
// wrenchSVG({r (m), F (N), th (deg), dir:"down"|"up", rot (deg), label}) -> SVG markup for viewBox 0 0 440 280.
var SIN = { 0:"0", 30:"1/2", 45:"√2/2", 60:"√3/2", 90:"1", 120:"√3/2", 135:"√2/2", 150:"1/2", 180:"0" };
function svgArrow(x1, y1, x2, y2, col, w, dash){
  return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" style="stroke:var(' + col + ');stroke-width:' + w + (dash ? ";stroke-dasharray:" + dash : "") + ';stroke-linecap:round"/>' + v3Head([x1, y1], [x2, y2], col, w, 1);
}
function wrenchSVG(o){
  var bx = 70, by = 150, L = o.r * 560, ex = bx + L, sg = o.dir === "up" ? -1 : 1, th = o.th * DEG, fl = o.F * 0.55;
  var fx = ex + fl * Math.cos(th), fy = by + sg * fl * Math.sin(th), tq = o.r * o.F * Math.sin(th), fr = clamp(Math.abs(tq) / 80, 0, 1), h = "";
  h += '<line x1="' + bx + '" y1="' + by + '" x2="' + ex.toFixed(1) + '" y2="' + by + '" style="stroke:var(--pen);stroke-width:12;stroke-linecap:round;opacity:.9"/>';
  h += '<circle cx="' + bx + '" cy="' + by + '" r="22" style="fill:none;stroke:var(--pen);stroke-width:9"/>';
  var hex = []; for (var k = 0; k < 6; k++) { var a = (o.rot || 0) * DEG + k * Math.PI / 3; hex.push((bx + 12 * Math.cos(a)).toFixed(1) + "," + (by + 12 * Math.sin(a)).toFixed(1)); }
  h += '<polygon points="' + hex.join(" ") + '" style="fill:var(--ink-2);fill-opacity:.35;stroke:var(--ink-2);stroke-width:1.5"/>';
  h += '<text class="ap-tm" x="' + ((bx + ex) / 2 + 6).toFixed(1) + '" y="' + (by + (sg > 0 ? -16 : 30)) + '" text-anchor="middle" style="fill:var(--pen)">r = ' + num(o.r, 2) + " m</text>";
  if (Math.abs(Math.sin(th)) > 1e-6) {
    var py = by + sg * fl * Math.sin(th);
    h += svgArrow(ex, by, ex, py, "--f3", 2, "6 4");
    h += '<text class="ap-tm" x="' + (ex + (Math.cos(th) < -0.2 ? 10 : -10)).toFixed(1) + '" y="' + ((by + py) / 2 + 5).toFixed(1) + '" text-anchor="' + (Math.cos(th) < -0.2 ? "start" : "end") + '" style="fill:var(--f3)">F sin θ</text>';
  }
  if (o.th > 0 && o.th < 180) {
    var ar = 26, x1 = ex + ar, y1 = by, x2 = ex + ar * Math.cos(th), y2 = by + sg * ar * Math.sin(th);
    h += '<path d="M' + x1.toFixed(1) + " " + y1 + " A" + ar + " " + ar + " 0 0 " + (sg > 0 ? 1 : 0) + " " + x2.toFixed(1) + " " + y2.toFixed(1) + '" style="fill:none;stroke:var(--ink-2);stroke-width:1.5"/>';
    var mx = ex + 38 * Math.cos(th / 2), my = by + sg * 38 * Math.sin(th / 2);
    h += '<text class="ap-tm" x="' + mx.toFixed(1) + '" y="' + (my + 5).toFixed(1) + '" text-anchor="middle" style="fill:var(--ink-2)">' + o.th + "°</text>";
  }
  h += svgArrow(ex, by, fx, fy, "--f3", 3.2);
  h += '<text class="ap-tm" x="' + (fx + (fx >= ex ? 8 : -8)).toFixed(1) + '" y="' + (fy + (sg > 0 ? 16 : -8)).toFixed(1) + '" text-anchor="' + (fx >= ex ? "start" : "end") + '" style="fill:var(--f3)">F = ' + num(o.F, 0) + " N</text>";
  if (fr > 1e-6) {
    var R = 46, sw = 25 + 245 * fr, a0 = -90 - sw / 2, a1 = -90 + sw / 2, cw = sg > 0, w = 2 + 2.6 * fr;
    var P = function(a){ return [bx + R * Math.cos(a * DEG), by + R * Math.sin(a * DEG)]; }, s0 = P(a0), s1 = P(a1);
    h += '<path d="M' + s0[0].toFixed(1) + " " + s0[1].toFixed(1) + " A" + R + " " + R + " 0 " + (sw > 180 ? 1 : 0) + " 1 " + s1[0].toFixed(1) + " " + s1[1].toFixed(1) + '" style="fill:none;stroke:var(--ink);stroke-width:' + w.toFixed(1) + ';stroke-linecap:round"/>';
    var tip = cw ? s1 : s0, ta = (cw ? a1 : a0) * DEG, t = cw ? [-Math.sin(ta), Math.cos(ta)] : [Math.sin(ta), -Math.cos(ta)];
    h += v3Head([tip[0] - t[0] * 12, tip[1] - t[1] * 12], [tip[0] + t[0] * 2, tip[1] + t[1] * 2], "--ink", w, 1);
  }
  if (o.label) h += '<text class="ap-tm ap-big" x="16" y="34" style="fill:var(--ink)">' + MV.esc(o.label) + "</text>";
  return h;
}
function tqSrc(r, F, th){   // exact |τ| = rF sin θ for a chip angle, as m() source
  var rF = rnd(r * F, 4), s = SIN[th];
  if (s === "0") return "0";
  if (s === "1") return ns(rF);
  if (s === "1/2") return ns(rF / 2);
  var c = rnd(rF / 2, 4); return (c === 1 ? "" : ns(c, 4)) + "√" + s.charAt(1);
}

// =====================================================================================================================
// ---------- hero ----------
function hero(){
  var svg = $("#ap-hero"); if (!svg) return;
  svg.setAttribute("viewBox", "0 0 440 300");
  function wrench(th, rot, lab){ svg.innerHTML = wrenchSVG({ r:0.3, F:100, th:th, dir:"down", rot:rot, label:lab }); }
  var A = [2, 0, 0], B = [1, 3, 0], C = [1, 1, 2];
  function box(g, f){
    var pr0 = v3Proj(38, 24, 36, 0, 0), pts = [[0, 0, 0], A, B, C, add(A, B), add(B, C), add(C, A), add(add(A, B), C)].map(pr0);
    var xs = pts.map(function(p){ return p[0]; }), ys = pts.map(function(p){ return p[1]; });
    var pr = v3Proj(38, 24, 36, 220 - (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, 140 - (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2);
    var it = boxItems(mul(A, g), mul(B, g), mul(C, g), "ab");
    if (f < 1) it = it.filter(function(x){ return x.k !== "poly" && !(x.k === "line" && x.col === "--ink-2"); }).concat(f > 0 ? boxItems(A, B, C, "ab").filter(function(x){ return x.col === "--ink-2"; }).map(function(x){ x.op = (x.op || 1) * f; return x; }) : []);
    svg.innerHTML = v3Render(it, pr, 8) + (f >= 1 ? '<text class="ap-tm ap-big" x="220" y="284" text-anchor="middle" style="fill:var(--ink)">V = |a⃗ · (b⃗ × c⃗)| = 12</text>' : "");
  }
  if (MV.reduceMotion) { box(1, 1); return; }
  wrench(90, 0, "");
  MV.wait(700, function(){
    MV.tween({ dur:1500, step:function(t){ wrench(90, -90 * t, ""); }, done:function(){
      wrench(90, -90, "|τ| = 0.3 × 100 × sin 90° = 30 N·m");
      MV.wait(1500, function(){
        MV.tween({ dur:1300, step:function(t){ wrench(90 - 60 * t, -90, ""); }, done:function(){
          wrench(30, -90, "|τ| = 0.3 × 100 × sin 30° = 15 N·m");
          MV.wait(2000, function(){
            MV.tween({ dur:1100, step:function(t){ box(Math.max(0.02, t), 0); }, done:function(){
              MV.tween({ dur:900, step:function(t){ box(1, t * 0.999); }, done:function(){ box(1, 1); } });
            } });
          });
        } });
      });
    } });
  });
}

// =====================================================================================================================
// ---------- shared controls ----------
function stepHTML(key, name, vals, fmt, aria){
  return '<div class="ap-vs"><span class="ap-vn">' + name + '</span><span class="ap-vrow">' + [0, 1, 2].map(function(i){
    var c = "xyz"[i];
    return '<span class="ap-st"><button type="button" class="btn ghost sm" data-st="' + key + '" data-i="' + i + '" data-d="-1" data-k="' + key + i + 'm" aria-label="Decrease the ' + c + '-component of ' + MV.esc(aria) + '">' + MINUS + '</button>' +
      '<output data-o="' + key + i + '" aria-live="polite" aria-label="' + c + '-component of ' + MV.esc(aria) + '">' + fmt(vals[i]) + '</output>' +
      '<button type="button" class="btn ghost sm" data-st="' + key + '" data-i="' + i + '" data-d="1" data-k="' + key + i + 'p" aria-label="Increase the ' + c + '-component of ' + MV.esc(aria) + '">+</button></span>';
  }).join("") + "</span></div>";
}
function syncSteps(host, key, vals, fmt){ for (var i = 0; i < 3; i++) { var o = $('[data-o="' + key + i + '"]', host); if (o) o.textContent = fmt(vals[i]); } }
function intFmt(v){ return num(v, 0); }
function okVec(v, lo, hi){ return Array.isArray(v) && v.length === 3 && v.every(function(x){ return Number.isInteger(x) && x >= lo && x <= hi; }); }
function sliderHTML(id, label, min, max, step, val){
  return '<label class="slider ap-sl"><span class="slider-top"><span>' + label + '</span><output id="' + id + 'o"></output></span>' +
    '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" style="accent-color:var(--ink)"></label>';
}

// =====================================================================================================================
// ---------- Explore: Wrench and torque ----------
function explore(host, api){
  var S = api.S, C = api.content, T = C.txt, MS = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  if (["wrench", "t3d", "area"].indexOf(S.mode) < 0) S.mode = "wrench";
  if (!(S.r >= 10 && S.r <= 60 && S.r % 5 === 0)) S.r = 25;
  if (!(S.F >= 20 && S.F <= 200 && S.F % 10 === 0)) S.F = 80;
  if (C.angles.indexOf(S.th) < 0) S.th = 30;
  if (S.dir !== "up") S.dir = "down";
  if (!okVec(S.rv, -4, 4)) S.rv = [2, 0, 0];
  if (!okVec(S.Fv, -100, 100) || S.Fv.some(function(x){ return x % 10; })) S.Fv = [0, 30, 40];
  ["A", "B", "C"].forEach(function(k, i){ if (!okVec(S[k], -4, 4)) S[k] = [[1, 1, 0], [4, 1, 4], [1, 3, 0]][i]; });
  if (!Array.isArray(S.recs) || !S.recs.every(function(p){ return okVec(p, -4, 4); })) S.recs = [];
  var busy = false, grow = 1, spin = 0, raf = null, recMsg = "", R = T.rows;
  host.innerHTML = '<div class="ap-ex"><div class="ap-mode"></div><div class="ap-grid"><div class="ap-view" data-mv="graph">' +
    '<p class="tiny muted ap-key" id="ap-key"></p><div class="ap-w"><svg class="ap-wsvg" id="ap-wsvg" viewBox="0 0 440 280" role="img" aria-label="Wrench"></svg></div><div class="ap-v3"></div></div>' +
    '<div class="ap-side"><div class="ap-ctl" id="ap-ctl"></div><dl class="read ap-read" id="ap-read" aria-live="polite"></dl></div></div></div>';
  var seg = MV.seg($(".ap-mode", host), { label:T.mode, options:C.modes.map(function(o){ return { id:o.id, t:o.t }; }), value:S.mode,
    onChange:function(id){ if (busy) return; S.mode = id; recMsg = ""; build(); changed(); } });
  var V = View3D($(".ap-v3", host), { aria:"3D view" }), ctl = $("#ap-ctl", host);
  function tqv(){ return S.r / 100 * S.F * Math.sin(S.th * DEG); }
  function tau(){ return cross(S.rv, S.Fv).map(function(x){ return rnd(x / 10); }); }
  function nAB(){ return cross(sub(S.B, S.A), sub(S.C, S.A)); }

  function build(){
    $(".ap-w", host).hidden = S.mode !== "wrench"; $(".ap-v3", host).hidden = S.mode === "wrench";
    $("#ap-key", host).innerHTML = MV.md(S.mode === "wrench" ? T.wrenchKey : S.mode === "t3d" ? T.key3d : T.keyArea);
    var h = "";
    if (S.mode === "wrench") {
      h = sliderHTML("ap-r", MV.md(T.r), 10, S.r > 40 ? 60 : 40, 5, S.r) + sliderHTML("ap-F", MV.md(T.F), 20, 200, 10, S.F) +
        '<p class="tiny ap-h" id="ap-thl">' + T.th + '</p><div class="chips ap-th" role="radiogroup" aria-labelledby="ap-thl">' + C.angles.map(function(a){
          return '<button type="button" class="chip" role="radio" data-th="' + a + '" data-k="th' + a + '">' + a + "°</button>"; }).join("") + "</div>" +
        '<div class="seg-wrap"><span class="tiny" style="font-weight:700">' + T.push + '</span><span class="seg" role="group" aria-label="' + T.push + '">' +
        [["down", T.down], ["up", T.up]].map(function(d){ return '<button type="button" data-dir="' + d[0] + '" data-k="dir' + d[0] + '">' + d[1] + "</button>"; }).join("") + "</span></div>";
    } else if (S.mode === "t3d") {
      h = stepHTML("rv", m("vec{r}") + " (m)", S.rv, function(v){ return num(v / 10, 1); }, "r") + stepHTML("Fv", m("vec{F}") + " (N)", S.Fv, intFmt, "F");
    } else {
      h = stepHTML("A", "A", S.A, intFmt, "A") + stepHTML("B", "B", S.B, intFmt, "B") + stepHTML("C", "C", S.C, intFmt, "C") +
        '<div class="q-actions ap-acts"><button type="button" class="btn primary sm" data-act="rec" data-k="rec">' + T.record + '</button><button type="button" class="btn ghost sm" data-act="clr" data-k="clr">' + T.clear + '</button>' +
        '<button type="button" class="btn ghost sm" data-act="setup" data-k="setup">' + T.setup + '</button></div><div id="ap-recs" aria-live="polite"></div>';
    }
    MV.keepFocus(ctl, function(){ ctl.innerHTML = h; });
    if (S.mode === "t3d") startSpin();
  }
  function sync(){
    if (S.mode === "wrench") {
      var r = $("#ap-r", host), F = $("#ap-F", host);
      if (r) { r.max = S.r > 40 ? 60 : 40; r.value = S.r; $("#ap-ro", host).textContent = num(S.r / 100, 2) + " m"; r.setAttribute("aria-valuetext", num(S.r / 100, 2) + " metres"); }
      if (F) { F.value = S.F; $("#ap-Fo", host).textContent = S.F + " N"; F.setAttribute("aria-valuetext", S.F + " newtons"); }
      $$("[data-th]", ctl).forEach(function(b){ var on = +b.dataset.th === S.th; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
      $$("[data-dir]", ctl).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.dir === S.dir); });
    } else if (S.mode === "t3d") { syncSteps(ctl, "rv", S.rv, function(v){ return num(v / 10, 1); }); syncSteps(ctl, "Fv", S.Fv, intFmt); }
    else {
      ["A", "B", "C"].forEach(function(k){ syncSteps(ctl, k, S[k], intFmt); });
      var rl = $("#ap-recs", host);
      if (rl) rl.innerHTML = '<p class="tiny ap-h">' + T.recH + "</p>" + (S.recs.length ? '<ul class="ap-recl">' + S.recs.map(function(p){
        var n = cross(sub(S.B, S.A), sub(p, S.A)); return "<li>C = " + m(vsrc(p)) + ": area " + rootHTML(dot(n, n), true) + "</li>"; }).join("") + "</ul>" : '<p class="tiny muted">' + T.noRec + "</p>") +
        (recMsg ? '<p class="tiny ap-msg">' + recMsg + "</p>" : "");
    }
  }
  function readRows(){
    if (S.mode === "wrench") {
      var r = S.r / 100, src = tqSrc(r, S.F, S.th), v = tqv(), irrT = /√/.test(src), mx = rnd(r * S.F, 4);
      return [[MV.md(R.tq), m(num(r, 2) + " × " + S.F + " × sin " + S.th + "° = " + src) + " N·m" + (irrT ? " ≈ " + num(v, 1) + " N·m" : "")],
        [R.share, m("sin " + S.th + "° = " + SIN[S.th]) + " of the " + num(mx, 2) + " N·m maximum"],
        [R.turn, Math.abs(v) < 1e-9 ? T.none : S.dir === "down" ? T.cw : T.ccw]];
    }
    if (S.mode === "t3d") {
      var t = tau(), r3 = S.rv.map(function(x){ return x / 10; }), F3 = S.Fv;
      var comp = "(" + pp(r3[1]) + "·" + pp(F3[2]) + " - " + pp(r3[2]) + "·" + pp(F3[1]) + ", " + pp(r3[2]) + "·" + pp(F3[0]) + " - " + pp(r3[0]) + "·" + pp(F3[2]) + ", " + pp(r3[0]) + "·" + pp(F3[1]) + " - " + pp(r3[1]) + "·" + pp(F3[0]) + ")";
      return [[MV.md(R.tv), m(vsrc(t)) + " N·m <details class=\"ap-det-d\"><summary>" + T.formula + "</summary><div>" + m("(r_2 F_3 - r_3 F_2, r_3 F_1 - r_1 F_3, r_1 F_2 - r_2 F_1)") + "</div><div>" + m("= " + comp) + "</div><div>" + m("= " + vsrc(t)) + "</div></details>"],
        [MV.md(R.tm), rootHTML(dot(t, t), false, " N·m")]];
    }
    var u = sub(S.B, S.A), w = sub(S.C, S.A), n = nAB(), N = dot(n, n);
    return [[MV.md(R.ab), m(vsrc(u))], [MV.md(R.ac), m(vsrc(w))], [MV.md(R.cr), m(vsrc(n))], [MV.md(R.par), rootHTML(N)],
      [MV.md(R.tri), m("½ × " + rootSrc(N) + " = " + rootSrc(N, true)) + (irr(N) ? " ≈ " + num(Math.sqrt(N) / 2, 2) : "")]];
  }
  function drawView(){
    if (S.mode === "wrench") {
      var w = $("#ap-wsvg", host), v = tqv();
      w.innerHTML = wrenchSVG({ r:S.r / 100, F:S.F, th:S.th, dir:S.dir, rot:0 });
      w.setAttribute("aria-label", "Wrench " + num(S.r / 100, 2) + " m, force " + S.F + " N at " + S.th + "°, torque " + MV.plain(m(tqSrc(S.r / 100, S.F, S.th))) + " newton-metres" + (Math.abs(v) < 1e-9 ? ", no turning." : S.dir === "down" ? ", clockwise." : ", counterclockwise."));
      return;
    }
    if (S.mode === "t3d") {
      var r = S.rv.slice(), t = tau(), tl = len(t);                 // 1 unit = 0.1 m, 25 N, 2.5 N·m
      var Fd = S.Fv.map(function(x){ return x / 25; }), td = mul(t, grow / 2.5), short = len(td) > 6.5;
      if (short) td = mul(td, 6.5 / len(td));
      var it = [{ k:"line", pts:[[0, 0, 0], r], col:"--pen", w:3, arrow:true, label:"r⃗" }, { k:"line", pts:[r, add(r, Fd)], col:"--f3", w:3, arrow:true, label:"F⃗" },
        { k:"line", pts:[[0, 0, 0], Fd], col:"--f3", w:1.5, dash:"4 4", op:0.6 }];
      if (tl > 1e-9) {
        var a = mul(t, 1 / tl), u = Math.abs(a[0]) < 0.9 ? cross(a, [1, 0, 0]) : cross(a, [0, 1, 0]); u = mul(u, 1 / len(u)); var w2 = cross(a, u), ring = [], hx = [];
        for (var k = 0; k <= 24; k++) { var ph = k / 24 * 1.5 * Math.PI; ring.push(add(mul(u, 1.1 * Math.cos(ph)), mul(w2, 1.1 * Math.sin(ph)))); }
        for (var j = 0; j < 6; j++) { var q = spin + j * Math.PI / 3; hx.push(add(mul(u, 0.55 * Math.cos(q)), mul(w2, 0.55 * Math.sin(q)))); }
        it.push({ k:"poly", pts:hx, col:"--ink-2", op:0.45 }, { k:"line", pts:hx.concat([hx[0]]), col:"--ink-2", w:1.5 });
        it.push({ k:"line", pts:ring, col:"--ink", w:2, arrow:true, op:0.85 });
        if (grow > 0.02) it.push({ k:"line", pts:[[0, 0, 0], td], col:"--ink", w:3.6, arrow:true, label:"τ⃗" + (short ? " (shortened)" : "") });
      }
      V.draw({ range:5, items:it, describe:"r = " + vtxt(S.rv.map(function(x){ return x / 10; })) + " m in blue, F = " + vtxt(S.Fv) + " N in teal, torque τ = r × F = " + vtxt(t) + " N·m in black along the bolt’s axis." });
      return;
    }
    var A = S.A, B = S.B, Cc = S.C, D = sub(add(B, Cc), A), n = nAB();
    var its = [{ k:"poly", pts:[A, B, Cc], col:"--pen", op:0.14 }, { k:"line", pts:[B, D, Cc], col:"--ink-2", w:1.5, dash:"6 5" },
      { k:"line", pts:[A, B], col:"--pen", w:3, arrow:true }, { k:"line", pts:[A, Cc], col:"--f3", w:3, arrow:true },
      { k:"pt", pts:[A], col:"--ink", label:"A" }, { k:"pt", pts:[B], col:"--ink", label:"B" }, { k:"pt", pts:[Cc], col:"--ink", label:"C" }];
    if (len(n) > 1e-9) its.push({ k:"line", pts:[A, add(A, mul(n, 0.5))], col:"--ink", w:3.6, arrow:true, label:"AB⃗ × AC⃗" });
    V.draw({ range:5, items:its, describe:"Triangle with A = " + vtxt(A) + ", B = " + vtxt(B) + ", C = " + vtxt(Cc) + "; AB × AC = " + vtxt(n) + " drawn from A at half length; the parallelogram is completed with dashes." });
  }
  function startSpin(){
    if (raf || MV.reduceMotion) return;
    var last = null;
    function frame(ts){
      raf = null;
      if (S.mode !== "t3d") return;
      if (last != null && host.offsetParent && !document.hidden) { var t = tau(), tl = len(t); if (tl > 1e-9) { spin += (ts - last) / 1000 * (0.5 + Math.min(tl, 60) / 40); drawView(); } }
      last = ts; raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }
  function paint(){ sync(); drawView(); $("#ap-read", host).innerHTML = MV.readoutHTML(readRows()); }
  function changed(){ api.save(); paint(); MV.changed(); }
  function lock(on){ $$("button, input", host).forEach(function(el){ el.disabled = !!on; }); }

  ctl.addEventListener("input", function(e){
    if (busy) return;
    if (e.target.id === "ap-r") { S.r = +e.target.value; if (S.r <= 40) e.target.max = 40; changed(); }
    else if (e.target.id === "ap-F") { S.F = +e.target.value; changed(); }
  });
  ctl.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-th]"); if (!b || busy) return;
    var i = C.angles.indexOf(S.th), k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") i = Math.min(C.angles.length - 1, i + 1); else if (k === "ArrowLeft" || k === "ArrowUp") i = Math.max(0, i - 1); else return;
    e.preventDefault(); S.th = C.angles[i]; changed(); var nb = $('[data-th="' + S.th + '"]', ctl); if (nb) nb.focus();
  });
  var RG = { rv:[-4, 4, 1], Fv:[-100, 100, 10], A:[-4, 4, 1], B:[-4, 4, 1], C:[-4, 4, 1] };
  ctl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.th != null) { S.th = +b.dataset.th; changed(); return; }
    if (b.dataset.dir) { S.dir = b.dataset.dir; changed(); return; }
    if (b.dataset.st) {
      var k = b.dataset.st, i = +b.dataset.i, g = RG[k], v = S[k].slice();
      v[i] = clamp(v[i] + g[2] * +b.dataset.d, g[0], g[1]); S[k] = v;
      if (k === "A" || k === "B") S.recs = [];
      recMsg = ""; changed(); return;
    }
    if (b.dataset.act === "rec") {
      recMsg = "";
      if (!S.recs.some(function(p){ return same(p, S.C); })) { if (S.recs.length >= 4) recMsg = T.recFull; else S.recs.push(S.C.slice()); }
      changed(); return;
    }
    if (b.dataset.act === "clr") { S.recs = []; recMsg = ""; changed(); return; }
    if (b.dataset.act === "setup") { S.A = [2, 0, 0]; S.B = [0, 1, 0]; S.C = [0, 0, 0]; S.recs = []; recMsg = ""; changed(); }
  });

  function chal(id){
    var M = MS[id];
    if (id === "tc1") {
      if (S.r !== 30 || S.th !== 30) return { ok:false, msg:M.setup };
      if (S.F === 100) return { ok:true };
      if (S.F === 50) return { ok:false, msg:M.f50 };
      if (S.F === 200) return { ok:false, msg:M.f200 };
      return { ok:false, msg:"That gives " + MV.plain(m(tqSrc(0.3, S.F, 30))) + " N·m. You need 15 N·m." };
    }
    if (id === "tc2") {
      if (S.F !== 120 || S.r !== 25) return { ok:false, msg:M.setup };
      if (S.th === 45 || S.th === 135) return { ok:true };
      if (S.th === 60 || S.th === 120) return { ok:false, msg:M.s60 };
      if (S.th === 30 || S.th === 150) return { ok:false, msg:M.s30 };
      if (S.th === 90) return { ok:false, msg:M.s90 };
      return { ok:false, msg:M.s0 };
    }
    if (!same(S.A, [2, 0, 0]) || !same(S.B, [0, 1, 0])) return { ok:false, msg:M.setup };
    var g1 = S.recs.some(function(p){ return same(p, [0, 0, 1]); }), g2 = S.recs.some(function(p){ return same(p, [0, 0, -1]); }), Cc = S.C;
    if (g1 && g2) return S.recs.length === 2 ? { ok:true } : { ok:false, msg:M.extra };
    if (Cc[0] || Cc[1]) return { ok:false, msg:M.off };
    if (Cc[2] === 0) return { ok:false, msg:M.flat };
    if (Math.abs(Cc[2]) === 2) return { ok:false, msg:M.two };
    if (Math.abs(Cc[2]) === 1 && !S.recs.some(function(p){ return same(p, Cc); })) return { ok:false, msg:M.rec };
    if (g1 || g2) return { ok:false, msg:M.one };
    if (!S.recs.length) return { ok:false, msg:M.none };
    return { ok:false, msg:M.general };
  }

  build(); paint();
  return {
    predict:{
      start:function(p){
        busy = true; grow = 1;
        if (p.id === "p4") { S.mode = "t3d"; S.rv = [2, 0, 0]; S.Fv = [0, 50, 0]; grow = 0; V.set(45, 35.26); }
        else { S.mode = "wrench"; S.r = 30; S.F = 100; S.dir = "down"; S.th = p.id === "p1" ? 0 : p.id === "p2" ? 30 : 90; }
        seg.set(S.mode); build(); paint(); lock(true);
      },
      run:function(p, done){
        function fin(){ busy = false; grow = 1; lock(false); api.save(); paint(); MV.changed(); done(); }
        function steps(list, ms, cb){ if (!list.length) return cb(); MV.wait(ms, function(){ S.th = list[0]; paint(); steps(list.slice(1), ms, cb); }); }
        if (p.id === "p1") steps([45, 90], 1300, function(){ MV.wait(900, fin); });
        else if (p.id === "p2") steps([45, 60, 90, 120, 135, 150], 600, function(){ MV.wait(900, fin); });
        else if (p.id === "p3") MV.tween({ dur:1800, step:function(t){ S.r = Math.round(30 + 30 * t); S.F = 100 - 50 * t; paint(); },
          done:function(){ S.r = 60; S.F = 50; paint(); MV.wait(900, fin); } });
        else MV.tween({ dur:1400, step:function(t){ grow = t; drawView(); }, done:function(){ grow = 1; drawView(); MV.wait(1200, fin); } });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: Volume of a parallelepiped (five V1 stations as tabs) ----------
function part3(host, api){
  var S = api.S, C = api.content, TB = C.tabs;
  if (!(S.st >= 0 && S.st < 5)) S.st = 0;
  if (!okVec(S.a, -4, 4)) S.a = [2, 0, 0];
  if (!okVec(S.b, -4, 4)) S.b = [1, 3, 0];
  if (!okVec(S.c, -4, 4)) S.c = [1, 1, 2];
  if (!(S.la >= -1 && S.la <= 1)) S.la = 0;
  if (!(S.lb >= -1 && S.lb <= 1)) S.lb = 0;
  if (!(S.fl >= 0 && S.fl <= 1)) S.fl = 1;
  if (!S.ord || typeof S.ord !== "object") S.ord = {};
  ["A", "B", "C", "D"].forEach(function(k, i){ if (!okVec(S[k], -4, 4)) S[k] = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, -1]][i]; });
  host.innerHTML = '<div class="ap-tabs" role="tablist" aria-label="Stations">' + TB.map(function(t, i){
    return '<button type="button" role="tab" id="ap-tab' + i + '" aria-controls="ap-panel" data-tab="' + i + '" data-k="tab' + i + '">' + (i + 1) + ". " + t + "</button>"; }).join("") + "</div>" +
    '<div class="ap-grid ap-p3" id="ap-panel" role="tabpanel"><div class="ap-view ap-v3p"></div><div class="ap-side" id="ap-st"></div></div>';
  var V = View3D($(".ap-v3p", host), { aria:"3D view of the station" }), P = $("#ap-st", host);
  function n0(){ return cross(S.a, S.b); }
  function cLean(){ return add(S.c, add(mul(S.a, S.la), mul(S.b, S.lb))); }
  function cFlat(){ var n = n0(), nn = dot(n, n); if (nn < 1e-12) return S.c.slice(); var foot = sub(S.c, mul(n, dot(S.c, n) / nn)); return add(foot, mul(sub(S.c, foot), S.fl)); }
  function tsp(a, b, c){ return rnd(dot(a, cross(b, c))); }
  function dv(x){ return (Math.abs(x - rnd(x, 2)) > 1e-9 ? "≈ " : "") + num(x, 2); }
  function rows(list){ return MV.readoutHTML(list.map(function(r){ return [MV.md(r[0]), r[1]]; })); }
  function build(){
    var i = S.st, h = "";
    $$("[data-tab]", host).forEach(function(b){ var on = +b.dataset.tab === i; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    $("#ap-panel", host).setAttribute("aria-labelledby", "ap-tab" + i);
    if (i === 0) { var X = C.st1; h = "<h3>" + X.title + "</h3><p>" + MV.md(X.text) + "</p>" + stepHTML("a", m("vec{a}"), S.a, intFmt, "a") + stepHTML("b", m("vec{b}"), S.b, intFmt, "b") + stepHTML("c", m("vec{c}"), S.c, intFmt, "c") +
      '<dl class="read ap-read" id="ap-r3" aria-live="polite"></dl><details class="alg"><summary>' + X.working + '</summary><div class="alg-lines" id="ap-alg"></div></details>'; }
    else if (i === 1) { var Y = C.st2; h = "<h3>" + Y.title + "</h3><p>" + MV.md(Y.text) + "</p>" + sliderHTML("ap-la", MV.md(Y.la), -1, 1, 0.25, S.la) + sliderHTML("ap-lb", MV.md(Y.lb), -1, 1, 0.25, S.lb) +
      '<p class="banner ap-ban">' + MV.md(Y.banner) + '</p><dl class="read ap-read" id="ap-r3" aria-live="polite"></dl>'; }
    else if (i === 2) { var Z = C.st3; h = "<h3>" + Z.title + "</h3><p>" + MV.md(Z.text) + "</p>" + sliderHTML("ap-fl", MV.md(Z.sl), 0, 1, 0.05, S.fl) +
      '<p class="banner ap-ban">' + MV.md(Z.banner) + '</p><p class="ap-flat" id="ap-flat" aria-live="polite"></p><dl class="read ap-read" id="ap-r3" aria-live="polite"></dl>'; }
    else if (i === 3) { var W = C.st4; h = "<h3>" + W.title + "</h3><p>" + MV.md(W.text) + '</p><div class="ap-ords">' + W.orders.map(function(o){
      return '<button type="button" class="btn ghost sm" data-ord="' + o.id + '" data-k="ord' + o.id + '">' + MV.md(o.t) + "</button>"; }).join("") + '</div><dl class="read ap-read" id="ap-r3" aria-live="polite"></dl>' +
      '<div class="refresh ap-rule"><p>' + MV.md(W.rule) + "</p></div>"; }
    else { var Q = C.st5; h = "<h3>" + Q.title + "</h3><p>" + MV.md(Q.text) + "</p>" + ["A", "B", "C", "D"].map(function(k){ return stepHTML(k, k, S[k], intFmt, "point " + k); }).join("") +
      '<dl class="read ap-read" id="ap-r3" aria-live="polite"></dl>'; }
    MV.keepFocus(P, function(){ P.innerHTML = h; });
    paint();
  }
  function noBase(){ return "<p class=\"tiny ap-msg\">" + MV.md("`vec{a}` and `vec{b}` are parallel, so they don’t span a base. Change them in Station 1.") + "</p>"; }
  function paint(){
    var i = S.st, a = S.a, b = S.b, c = S.c, rd = $("#ap-r3", host);
    if (i === 0) {
      ["a", "b", "c"].forEach(function(k){ syncSteps(P, k, S[k], intFmt); });
      var X = C.st1.rows, bc = cross(b, c), N = dot(bc, bc), T0 = tsp(a, b, c);
      rd.innerHTML = rows([[X.bc, m(vsrc(bc))], [X.base, rootHTML(N)], [X.h, N ? m(overRootSrc(T0, N)) + (irr(N) ? " ≈ " + num(T0 / Math.sqrt(N), 2) : "") : "no base: " + m("vec{b} × vec{c} = vec{0}")],
        [X.tsp, m(ns(T0))], [X.vol, m(ns(Math.abs(T0)))]]);
      $("#ap-alg", host).innerHTML = "<div>" + m("vec{b} × vec{c} = (" + pp(b[1]) + "·" + pp(c[2]) + " - " + pp(b[2]) + "·" + pp(c[1]) + ", " + pp(b[2]) + "·" + pp(c[0]) + " - " + pp(b[0]) + "·" + pp(c[2]) + ", " + pp(b[0]) + "·" + pp(c[1]) + " - " + pp(b[1]) + "·" + pp(c[0]) + ") = " + vsrc(bc)) + "</div>" +
        "<div>" + m("vec{a} · " + vsrc(bc) + " = " + pp(a[0]) + "·" + pp(bc[0]) + " + " + pp(a[1]) + "·" + pp(bc[1]) + " + " + pp(a[2]) + "·" + pp(bc[2]) + " = " + ns(T0)) + "</div>" +
        '<div class="ap-detl">' + detHTML([a.map(ns), b.map(ns), c.map(ns)]) + " " + m("= " + pp(a[0]) + "(" + ns(b[1] * c[2] - b[2] * c[1]) + ") - " + pp(a[1]) + "(" + ns(b[0] * c[2] - b[2] * c[0]) + ") + " + pp(a[2]) + "(" + ns(b[0] * c[1] - b[1] * c[0]) + ") = " + ns(T0)) + "</div>" +
        "<div><small>The same number three ways: a cross product, then a dot product, or one 3 × 3 determinant.</small></div>";
      V.draw({ range:5, items:boxItems(a, b, c, "bc").concat(heightItems(b, c, a)), describe:boxDescribe(a, b, c, T0) + " The base spanned by b and c is darkest; the dashed segment is the height." });
    } else if (i === 1) {
      var Y = C.st2.rows, cl = cLean(), n = n0(), NN = dot(n, n), T1 = tsp(a, b, cl);
      $("#ap-lao", host).textContent = num(S.la, 2); $("#ap-lbo", host).textContent = num(S.lb, 2);
      rd.innerHTML = NN ? rows([[Y.c, m(vsrc(cl))], [Y.cl, (Math.abs(len(cl) - Math.round(len(cl))) < 1e-9 ? "" : "≈ ") + num(len(cl), 2)], [Y.base, rootHTML(NN)],
        [Y.h, m(overRootSrc(T1, NN)) + (irr(NN) ? " ≈ " + num(T1 / Math.sqrt(NN), 2) : "")], [Y.vol, m(ns(Math.abs(T1)))]]) : noBase();
      V.draw({ range:5, items:boxItems(a, b, cl, "ab").concat(heightItems(a, b, cl), [{ k:"line", pts:[[0, 0, 0], c], col:"--f5", w:1.5, dash:"4 4", op:0.55 }]),
        describe:boxDescribe(a, b, cl, T1) + " The original c is dashed; the base spanned by a and b is darkest." });
    } else if (i === 2) {
      var Z = C.st3.rows, cf = cFlat(), n2 = n0(), N2 = dot(n2, n2), T2 = dot(a, cross(b, cf)), h2 = N2 ? T2 / Math.sqrt(N2) : 0;
      $("#ap-flo", host).textContent = num(S.fl * 100, 0) + "%";
      $("#ap-flat", host).innerHTML = Math.abs(T2) < 1e-9 && N2 ? "<strong>" + MV.md(C.st3.flat) + "</strong>" : "";
      rd.innerHTML = N2 ? rows([[Z.c, (cf.some(function(x){ return Math.abs(x - rnd(x, 2)) > 1e-9; }) ? "≈ " : "") + m(vsrc(cf))], [Z.h, dv(Math.abs(h2))], [Z.tsp, dv(T2)], [Z.vol, dv(Math.abs(T2))]]) : noBase();
      V.draw({ range:5, items:boxItems(a, b, cf, "ab").concat(heightItems(a, b, cf)), describe:boxDescribe(a, b, cf, T2) + (Math.abs(T2) < 1e-9 ? " The box is flat: the three vectors are coplanar." : "") });
    } else if (i === 3) {
      var W = C.st4, VAL = { abc:tsp(a, b, c), bca:tsp(b, c, a), acb:tsp(a, c, b), cab:tsp(c, a, b) }, done = W.orders.filter(function(o){ return S.ord[o.id]; });
      $$("[data-ord]", host).forEach(function(bt){ bt.setAttribute("aria-pressed", !!S.ord[bt.dataset.ord]); });
      rd.innerHTML = done.length ? rows(done.map(function(o){ return [o.t, m("= " + ns(VAL[o.id]))]; })) : '<p class="tiny muted">' + W.none + "</p>";
      V.draw({ range:5, items:boxItems(a, b, c, "bc"), describe:boxDescribe(a, b, c, VAL.abc) });
    } else {
      ["A", "B", "C", "D"].forEach(function(k){ syncSteps(P, k, S[k], intFmt); });
      var Q = C.st5, A = S.A, B = S.B, Cc = S.C, D = S.D, u = sub(B, A), v = sub(Cc, A), w = sub(D, A), cr = cross(v, w), T5 = dot(u, cr);
      rd.innerHTML = rows([[Q.rows.ab, m(vsrc(u))], [Q.rows.ac, m(vsrc(v))], [Q.rows.ad, m(vsrc(w))], [Q.rows.cr, m(vsrc(cr))], [Q.rows.tsp, m(ns(T5))],
        [Q.rows.verdict, T5 === 0 ? Q.yes : Q.no + num(Math.abs(T5), 0)]]);
      V.draw({ range:5, items:[{ k:"poly", pts:[A, B, Cc], col:"--pen", op:0.14 }, { k:"line", pts:[A, B], col:"--pen", w:3, arrow:true }, { k:"line", pts:[A, Cc], col:"--f3", w:3, arrow:true },
        { k:"line", pts:[A, D], col:"--f5", w:3, arrow:true }].concat(["A", "B", "C", "D"].map(function(k){ return { k:"pt", pts:[S[k]], col:"--ink", label:k }; })),
        describe:"Points A " + vtxt(A) + ", B " + vtxt(B) + ", C " + vtxt(Cc) + ", D " + vtxt(D) + ", with AB in blue, AC in teal and AD in orange from A. AB · (AC × AD) = " + MV.plain(m(ns(T5))) + (T5 === 0 ? ": coplanar." : ": not coplanar.") });
    }
  }
  var RG = [-4, 4];
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.tab != null) { S.st = +b.dataset.tab; api.save(); build(); return; }
    if (b.dataset.st) { var k = b.dataset.st, i = +b.dataset.i, v = S[k].slice(); v[i] = clamp(v[i] + +b.dataset.d, RG[0], RG[1]); S[k] = v; api.save(); paint(); return; }
    if (b.dataset.ord) { S.ord[b.dataset.ord] = true; api.save(); paint(); }
  });
  host.addEventListener("keydown", function(e){
    var t = e.target.closest && e.target.closest("[data-tab]"); if (!t) return;
    var i = S.st;
    if (e.key === "ArrowRight") i = (i + 1) % 5; else if (e.key === "ArrowLeft") i = (i + 4) % 5; else if (e.key === "Home") i = 0; else if (e.key === "End") i = 4; else return;
    e.preventDefault(); S.st = i; api.save(); build(); $("#ap-tab" + i, host).focus();
  });
  host.addEventListener("input", function(e){
    var id = e.target.id;
    if (id === "ap-la") S.la = +e.target.value; else if (id === "ap-lb") S.lb = +e.target.value; else if (id === "ap-fl") S.fl = +e.target.value; else return;
    api.save(); paint();
  });
  build();
  return {};
}

// =====================================================================================================================
// ---------- Performance task: Lean the box ----------
var task = (function(){
  var api, V, A = [2, 0, 0], B = [1, 3, 0], K = ["c1", "c2", "c3"];
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= -4 && v <= 4 ? v : null; }
  function read(){ var c = K.map(gi); return { c:c, valid:c.every(function(x){ return x !== null; }) }; }
  function checks(D){ if (!D.valid) return [false, false, false, false]; var t = dot(A, cross(B, D.c)); return [Math.abs(t) === 12, t > 0, dot(D.c, D.c) === 9, dot(A, D.c) > 0]; }
  function preview(){
    var D = read(), L = api.content.labels, rd = $("#lb-read");
    if (!D.valid) { if (rd) rd.innerHTML = '<p class="tiny muted">' + MV.md(L.invalid) + "</p>"; V.draw({ range:5, items:[], describe:"Empty view: choose c." }); return; }
    var c = D.c, t = dot(A, cross(B, c)), cc = dot(c, c);
    if (rd) rd.innerHTML = '<dl class="read">' + MV.readoutHTML([[MV.md(L.tsp), m("6(" + ns(c[2]) + ") = " + ns(t))], [MV.md(L.cl), rootHTML(cc)], [MV.md(L.ac), m("2(" + ns(c[0]) + ") = " + ns(dot(A, c)))]]) + "</dl>";
    V.draw({ range:5, items:boxItems(A, B, c, "ab").concat(heightItems(A, B, c)), describe:boxDescribe(A, B, c, t) });
  }
  function stepper(k){
    var L = api.content.labels;
    return '<div class="lb-step"><label for="lb-' + k + '"><span class="m">' + MV.md(L[k]) + '</span> <span class="tiny muted">' + L.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="lb' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="lb-' + k + '" data-tk="' + k + '" type="number" min="-4" max="4" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="lb' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; var L = a.content.labels;
      if (a.S.c1 == null) { a.S.c1 = "0"; a.S.c2 = "0"; a.S.c3 = "1"; }
      inp.innerHTML = '<div class="lb-in"><p class="tiny" style="font-weight:700;margin:0">' + m("vec{c} = (c_1, c_2, c_3)") + "</p>" + K.map(stepper).join("") + "</div>";
      pv.innerHTML = '<div id="lb-read" aria-live="polite"></div><p class="tiny lb-gh">' + MV.md(L.view) + '</p><div class="lb-v3"></div>';
      V = View3D($(".lb-v3", pv), { aria:L.view });
      function upd(){ a.save(); preview(); a.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -4, 4)); $("#lb-" + k).value = a.S[k]; upd();
      });
      preview();
    },
    read:read,
    valid:function(D){ return D.valid ? true : MV.md(api.content.labels.invalid); },
    checks:checks,
    key:function(D){ return D.c.join("|"); },
    label:function(k){ return m("vec{c} = (" + k.split("|").join(", ") + ")"); },
    text:function(k){ return "c = (" + k.split("|").map(function(v){ return v.replace("-", MINUS); }).join(", ") + ")"; }
  };
})();

MV.module({ hero:hero, explore:explore, part3:part3, task:task });
})();
