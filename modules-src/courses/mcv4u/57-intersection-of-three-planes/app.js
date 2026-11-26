// MCV4U 57 Intersection of Three Planes: hero (three planes meet at a point, the orange one turns until they share a line,
// then slides off into a triangular prism), Three-plane configurator (Explore: Gallery / Adjust / Row-reduce on a V1 3D view
// with the V13 matrix stepper), Algebra meets geometry (Part 3: three row-reduction stations beside the 3D view), Solve the
// system (Practice 2: V8 point boxes and V12 line boxes) and the "Prism through a point" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, MINUS = MV.MINUS, Q = MV.mcv.Q;
var COLS = ["--pen", "--f3", "--f5"], SUB = ["₁", "₂", "₃"], NAMES = ["blue", "teal", "orange"];
var KINDN = { point:"one point", sheaf:"sheaf (a line, 3 distinct planes)", coinCross:"two coincident + one crossing", allSame:"all coincident", prism:"triangular prism", twoPar:"two parallel + one crossing", threePar:"three parallel", coinPar:"two coincident + one parallel", bad:"π₃ isn’t a plane" };
function m(s){ return MV.m(s); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function segBtns(name, opts, val, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (String(val) === String(o.id)) + '">' + o.t + "</button>"; }).join("") + "</span>";
}

// =====================================================================================================================
// @component V13 planeSystem — exact engine for systems of three planes (rows [a, b, c, d] = ax + by + cz = d, entries
// MV.mcv.Q rationals): triple product, rank, solution set (point / line / plane / none, with zero rows handled), the eight
// configurations, an integer row-echelon form and m() sources for equations, points and lines.
function qv(x){ return x && typeof x === "object" ? Q.of(x.n, x.d) : Q.of(x); }
function qrows(R){ return R.map(function(r){ return r.map(qv); }); }
function isZ(x){ return x.n === 0; }
function fv(x){ return x.n / x.d; }
function frows(R){ return R.map(function(r){ return r.map(fv); }); }
function nrm(r){ return r.slice(0, 3); }
function zeroV(u){ return isZ(u[0]) && isZ(u[1]) && isZ(u[2]); }
function cross(u, v){ return [Q.sub(Q.mul(u[1], v[2]), Q.mul(u[2], v[1])), Q.sub(Q.mul(u[2], v[0]), Q.mul(u[0], v[2])), Q.sub(Q.mul(u[0], v[1]), Q.mul(u[1], v[0]))]; }
function dot(u, v){ return Q.add(Q.add(Q.mul(u[0], v[0]), Q.mul(u[1], v[1])), Q.mul(u[2], v[2])); }
function prop(r, s){ for (var i = 0; i < r.length; i++) for (var j = i + 1; j < r.length; j++) if (!Q.eq(Q.mul(r[i], s[j]), Q.mul(r[j], s[i]))) return false; return true; }
function rank(R, cols){
  var A = R.map(function(r){ return r.slice(0, cols); }), rk = 0;
  for (var c = 0; c < cols && rk < A.length; c++) {
    var p = -1, i; for (i = rk; i < A.length; i++) if (!isZ(A[i][c])) { p = i; break; }
    if (p < 0) continue;
    var t = A[p]; A[p] = A[rk]; A[rk] = t;
    for (i = 0; i < A.length; i++) if (i !== rk && !isZ(A[i][c])) { var f = Q.div(A[i][c], A[rk][c]); for (var j = c; j < cols; j++) A[i][j] = Q.sub(A[i][j], Q.mul(f, A[rk][j])); }
    rk++;
  }
  return rk;
}
function cramer(R){
  var N = R.map(nrm), D = dot(N[0], cross(N[1], N[2])), c1 = cross(N[1], N[2]), c2 = cross(N[2], N[0]), c3 = cross(N[0], N[1]);
  return [0, 1, 2].map(function(i){ return Q.div(Q.add(Q.add(Q.mul(R[0][3], c1[i]), Q.mul(R[1][3], c2[i])), Q.mul(R[2][3], c3[i])), D); });
}
function lcmD(v){ var l = 1; v.forEach(function(x){ l = l * x.d / gcd(l, x.d); }); return l; }
function intVec(v){ var l = lcmD(v), w = v.map(function(x){ return x.n * l / x.d; }), g = 0; w.forEach(function(x){ g = gcd(g, x); }); return g ? w.map(function(x){ return x / g + 0; }) : w; }
function lineOf(rows){
  var P = null, i, j;
  for (i = 0; i < rows.length && !P; i++) for (j = i + 1; j < rows.length && !P; j++) if (!prop(nrm(rows[i]), nrm(rows[j]))) P = [rows[i], rows[j]];
  var d = intVec(cross(nrm(P[0]), nrm(P[1]))), last = d[2] || d[1] || d[0];
  if (last < 0) d = d.map(function(x){ return -x + 0; });
  var pt = null;
  [[0, 1], [0, 2], [1, 2]].some(function(tr){
    var a = P[0], b = P[1], det = Q.sub(Q.mul(a[tr[0]], b[tr[1]]), Q.mul(b[tr[0]], a[tr[1]]));
    if (isZ(det)) return false;
    pt = [Q.of(0), Q.of(0), Q.of(0)];
    pt[tr[0]] = Q.div(Q.sub(Q.mul(a[3], b[tr[1]]), Q.mul(b[3], a[tr[1]])), det);
    pt[tr[1]] = Q.div(Q.sub(Q.mul(a[tr[0]], b[3]), Q.mul(b[tr[0]], a[3])), det);
    return true;
  });
  return { p:pt, d:d };
}
// the common points of any rows (rows 0 0 0 | 0 are dropped; 0 0 0 | k ≠ 0 means none)
function solSet(R){
  var rows = [], bad = false;
  R.forEach(function(r){ if (zeroV(nrm(r))) { if (!isZ(r[3])) bad = true; } else rows.push(r); });
  if (bad) return { type:"none" };
  if (!rows.length) return { type:"space" };
  var rc = rank(rows, 3), ra = rank(rows, 4);
  if (rc !== ra) return { type:"none" };
  if (rc === 3) return { type:"point", pt:cramer(rows) };
  if (rc === 2) return { type:"line", line:lineOf(rows) };
  return { type:"plane", plane:rows[0] };
}
// the eight configurations of three planes (all normals non-zero)
function classify(R){
  var N = R.map(nrm), out = { tp:dot(N[0], cross(N[1], N[2])), sol:solSet(R), pairs:[] };
  if (N.some(zeroV)) { out.kind = "bad"; return out; }
  [[0, 1], [0, 2], [1, 2]].forEach(function(p){ if (prop(N[p[0]], N[p[1]])) out.pairs.push({ i:p[0], j:p[1], same:prop(R[p[0]], R[p[1]]) }); });
  var nsame = out.pairs.filter(function(x){ return x.same; }).length, npar = out.pairs.length - nsame, t = out.sol.type;
  out.kind = t === "point" ? "point" : t === "line" ? (nsame ? "coinCross" : "sheaf") : t === "plane" ? "allSame" :
    rank(R, 3) === 2 ? (npar ? "twoPar" : "prism") : (nsame ? "coinPar" : "threePar");
  return out;
}
function parPairs(R){
  var N = R.map(nrm), L = [];
  [[2, 0], [2, 1], [1, 0]].forEach(function(p){ var a = p[0], b = p[1]; if (zeroV(N[a]) || zeroV(N[b]) || !prop(N[a], N[b])) return; L.push({ a:a, b:b, same:prop(R[a], R[b]) }); });
  return L;
}
// integer row-echelon form ("auto mode"): eliminate below each pivot, clear fractions, leading coefficient positive
function refOf(R){
  var A = R.map(function(r){ return r.slice(); }), rk = 0;
  for (var c = 0; c < 3 && rk < 3; c++) {
    var p = -1, i; for (i = rk; i < 3; i++) if (!isZ(A[i][c])) { p = i; break; }
    if (p < 0) continue;
    var t = A[p]; A[p] = A[rk]; A[rk] = t;
    for (i = rk + 1; i < 3; i++) if (!isZ(A[i][c])) { var f = Q.div(A[i][c], A[rk][c]); for (var j = 0; j < 4; j++) A[i][j] = Q.sub(A[i][j], Q.mul(f, A[rk][j])); }
    rk++;
  }
  return A.map(function(r){
    var l = lcmD(r), w = r.map(function(x){ return x.n * l / x.d; }), lead = w.slice(0, 3).filter(function(x){ return x !== 0; })[0];
    if (lead !== undefined) { var g = 0; w.forEach(function(x){ g = gcd(g, x); }); if (lead < 0) g = -g; w = w.map(function(x){ return x / g + 0; }); }
    return w.map(function(x){ return Q.of(x); });
  });
}
function refSay(F){
  var W = ["no", "one", "two", "three"], piv = 0, z = 0, bad = 0;
  F.forEach(function(r){ if (!zeroV(nrm(r))) piv++; else if (isZ(r[3])) z++; else bad++; });
  var ps = W[piv] + (piv === 1 ? " pivot" : " pivots");
  if (bad) return ps + " and a row 0 0 0 | " + m("k") + " with " + m("k ≠ 0") + ": no solution";
  if (piv === 3) return "three pivots: one point";
  return ps + " and " + (z === 1 ? "a row 0 0 0 | 0: a line" : z === 2 ? "two rows 0 0 0 | 0: a plane" : "three rows 0 0 0 | 0");
}
// m() sources
function qa(x){ var a = Q.abs(x); return a.d === 1 ? String(a.n) : "{" + a.n + "}/{" + a.d + "}"; }
function qi(x){ return (x.n < 0 ? "-" : "") + Math.abs(x.n) + (x.d > 1 ? "/" + x.d : ""); }
function ptSrc(p){ return "(" + p.map(qi).join(", ") + ")"; }
function lineSrc(L){ return "vec{r} = " + ptSrc(L.p) + " + t(" + L.d.join(", ") + ")"; }
function eqSrc(r, scalar){
  var V = ["x", "y", "z"], s = "";
  for (var i = 0; i < 3; i++) {
    var c = r[i]; if (isZ(c)) continue;
    var a = Q.abs(c), co = a.n === 1 && a.d === 1 ? "" : qa(c);
    s += (s ? (c.n < 0 ? " - " : " + ") : (c.n < 0 ? "-" : "")) + co + V[i];
  }
  if (!s) return "0 = " + (r[3].n < 0 ? "-" : "") + qa(r[3]);
  if (scalar) { var D = Q.neg(r[3]); if (!isZ(D)) s += (D.n < 0 ? " - " : " + ") + qa(D); return s + " = 0"; }
  return s + " = " + (r[3].n < 0 ? "-" : "") + qa(r[3]);
}
function commonHTML(sol){
  if (!sol) return "?";
  if (sol.type === "point") return "exactly one: " + m(ptSrc(sol.pt));
  if (sol.type === "line") return "a line: " + m(lineSrc(sol.line));
  if (sol.type === "plane") return "a whole plane";
  if (sol.type === "space") return "every point";
  return "none";
}
function cellH(x){ return x.d === 1 ? (x.n < 0 ? MINUS + (-x.n) : String(x.n)) : m(Q.src(x)); }
function matHTML(R, hi, small){
  var lab = "Augmented matrix. " + R.map(function(r, i){ return "Row " + (i + 1) + ": " + r.slice(0, 3).map(function(x){ return MV.plain(cellH(x)); }).join(", ") + " bar " + MV.plain(cellH(r[3])); }).join("; ");
  return '<div class="tp-mw' + (small ? " tp-sm" : "") + '"><div class="tp-rls" aria-hidden="true">' + R.map(function(_, i){ return '<span class="tp-c' + (i + 1) + '">R' + SUB[i] + "</span>"; }).join("") +
    '</div><div class="tp-mat" role="img" aria-label="' + MV.esc(lab) + '">' + R.map(function(r, i){
      return '<span class="tp-mr' + (hi && hi.indexOf(i) >= 0 ? " tp-hi" : "") + '">' + r.slice(0, 3).map(function(x){ return "<span>" + cellH(x) + "</span>"; }).join("") + '<span class="tp-mb">' + cellH(r[3]) + "</span></span>";
    }).join("") + "</div></div>";
}
// R_t ← a·R_t + k·R_s, or a swap {sw:[i, j]}
function applyOp(R, op){
  var N = R.map(function(r){ return r.slice(); });
  if (op.sw) { var t = N[op.sw[0]]; N[op.sw[0]] = N[op.sw[1]]; N[op.sw[1]] = t; return N; }
  var a = qv(op.a == null ? 1 : op.a), k = qv(op.k);
  N[op.t] = R[op.t].map(function(x, j){ return op.s == null ? Q.mul(k, x) : Q.add(Q.mul(a, x), Q.mul(k, R[op.s][j])); });
  return N;
}
// ------------------------------------------------- end of planeSystem -------------------------------------------------

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view drawn on an MV.Plot canvas (so it resizes and follows the theme): translucent
// planes clipped to a box, lines (dashed, thick, glowing, growing), points (glowing or open), normal arrows n⃗₁ n⃗₂ n⃗₃ with
// the parallelepiped they span, axes and a caption. Drag or arrow keys turn it (Home resets). view.multi = [scenes] draws
// still frames side by side (reduced-motion hero).
function d3(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cr(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function nz(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function isDark(){
  var c = String(css("--sheet") || ""), r, g, b, mm = /#([0-9a-f]{6}|[0-9a-f]{3})\b/i.exec(c);
  if (mm) { var h = mm[1].length === 3 ? mm[1].split("").map(function(x){ return x + x; }).join("") : mm[1], v = parseInt(h, 16); r = v >> 16 & 255; g = v >> 8 & 255; b = v & 255; }
  else { var n = c.match(/\d+(\.\d+)?/g); if (!n || n.length < 3) return false; r = +n[0]; g = +n[1]; b = +n[2]; }
  return 0.299 * r + 0.587 * g + 0.114 * b < 110;
}
function clipPlane(p, lo, hi){
  var n = [p[0], p[1], p[2]], nl = Math.hypot(n[0], n[1], n[2]), i, pts = [], cs = [];
  if (nl < 1e-9) return null;
  for (i = 0; i < 8; i++) cs.push([i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]]);
  function f(q){ return (d3(n, q) - p[3]) / nl; }
  for (i = 0; i < 8; i++) [1, 2, 4].forEach(function(bt){
    if (i & bt) return;
    var A = cs[i], B = cs[i | bt], fa = f(A), fb = f(B);
    if (Math.abs(fa) < 1e-9) pts.push(A);
    if (Math.abs(fb) < 1e-9) pts.push(B);
    if (Math.abs(fa) >= 1e-9 && Math.abs(fb) >= 1e-9 && fa * fb < 0) { var t = fa / (fa - fb); pts.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); }
  });
  var U = [];
  pts.forEach(function(q){ if (!U.some(function(r){ return Math.abs(r[0] - q[0]) + Math.abs(r[1] - q[1]) + Math.abs(r[2] - q[2]) < 1e-7; })) U.push(q); });
  if (U.length < 3) return null;
  var G = [0, 1, 2].map(function(c){ return U.reduce(function(s, q){ return s + q[c]; }, 0) / U.length; });
  var un = nz(n), e1 = nz(Math.abs(un[0]) < 0.9 ? cr([1, 0, 0], un) : cr([0, 1, 0], un)), e2 = cr(un, e1);
  function ang(q){ var v = [q[0] - G[0], q[1] - G[1], q[2] - G[2]]; return Math.atan2(d3(v, e2), d3(v, e1)); }
  U.sort(function(a, b){ return ang(a) - ang(b); });
  return U;
}
function clipLine(p0, d, lo, hi){
  var t0 = -1e9, t1 = 1e9;
  for (var k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-12) { if (p0[k] < lo[k] - 1e-9 || p0[k] > hi[k] + 1e-9) return null; continue; }
    var a = (lo[k] - p0[k]) / d[k], b = (hi[k] - p0[k]) / d[k];
    t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
  }
  if (t0 > t1) return null;
  return [t0, t1];
}
// float line of two planes (null when parallel)
function pairLine(r, s){
  var n1 = [r[0], r[1], r[2]], n2 = [s[0], s[1], s[2]], u = cr(n1, n2), uu = d3(u, u);
  if (uu < 1e-9 * Math.max(1, d3(n1, n1) * d3(n2, n2))) return null;
  var a = r[3] * d3(n2, n2) - s[3] * d3(n1, n2), b = s[3] * d3(n1, n1) - r[3] * d3(n1, n2);
  return { p:[0, 1, 2].map(function(c){ return (a * n1[c] + b * n2[c]) / uu; }), d:u };
}
function View3D(canvas, o){
  o = o || {};
  var self = this;
  this.cv = canvas; this.az0 = this.az = o.az != null ? o.az : 32; this.el0 = this.el = o.el != null ? o.el : 20;
  this.C = o.centre || [2, 2, 2]; this.h = o.half || 4; this.sc = {}; this.multi = null; this.onTurn = o.onTurn || null;
  this.plot = new MV.Plot(canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  this.plot.render = function(){ self.draw(); };
  if (o.turn === false) return;
  canvas.tabIndex = 0;
  canvas.addEventListener("keydown", function(e){
    var k = e.key;
    if (k === "ArrowLeft" || k === "ArrowRight") self.az += k === "ArrowLeft" ? 8 : -8;
    else if (k === "ArrowUp" || k === "ArrowDown") self.el = clamp(self.el + (k === "ArrowUp" ? 6 : -6), -10, 80);
    else if (k === "Home") { self.az = self.az0; self.el = self.el0; }
    else return;
    e.preventDefault(); self.draw();
  });
  var drag = null;
  canvas.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, az:self.az, el:self.el }; try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } });
  canvas.addEventListener("pointermove", function(e){ if (!drag) return; self.az = drag.az - (e.clientX - drag.x) * 0.45; self.el = clamp(drag.el + (e.clientY - drag.y) * 0.35, -10, 80); self.draw(); });
  function end(){ drag = null; }
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
}
View3D.prototype.set = function(sc){ this.sc = sc || {}; this.draw(); };
View3D.prototype.draw = function(){
  var self = this, sc = this.sc;
  this.plot.draw({ grid:false, axes:false, ticks:false, describe:(this.multi ? this.multiDescribe : sc.describe) || "3D view of planes",
    after:function(ctx, pl){
      if (self.multi) { var n = self.multi.length, w = pl.W / n; self.multi.forEach(function(s, i){ self.paint(ctx, { x:i * w, y:0, w:w, h:pl.H }, s); }); }
      else self.paint(ctx, { x:0, y:0, w:pl.W, h:pl.H }, sc);
    } });
};
function wrapText(ctx, text, maxW){
  var words = String(text).split(" "), lines = [], cur = "";
  words.forEach(function(w){ var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur);
  return lines;
}
View3D.prototype.paint = function(ctx, R, sc){
  var a = this.az * Math.PI / 180, e = this.el * Math.PI / 180;
  var rv = [-Math.sin(a), Math.cos(a), 0], uv = [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)], fw = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
  var C = sc.centre || this.C, h = sc.half || this.h, fontUI = css("--font-ui") || "sans-serif", fontM = css("--font-math") || "serif";
  var dark = isDark(), ink = css("--ink"), ink2 = css("--ink-2"), hiC = css("--hi"), sheet = css("--sheet");
  ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
  var capLines = [], capF = R.w < 300 ? 12 : 13.5;
  if (sc.caption) { ctx.font = "600 " + capF + "px " + fontUI; capLines = wrapText(ctx, sc.caption, R.w - 20); }
  var capH = capLines.length ? capLines.length * (capF + 4) + 10 : 0, top = sc.tag ? 18 : 0;
  var s = Math.min(R.w, R.h - capH - top) / (2 * h * 1.62), cx = R.x + R.w / 2, cy = R.y + top + (R.h - capH - top) / 2;
  function P(p){ var v = [p[0] - C[0], p[1] - C[1], p[2] - C[2]]; return [cx + s * d3(v, rv), cy - s * d3(v, uv), d3(v, fw)]; }
  function seg(p, q){ ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  function path(pts){ ctx.beginPath(); pts.forEach(function(q, i){ if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath(); }
  function head(p, q, col, sz){
    var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); if (L < 1) return;
    dx /= L; dy /= L; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(q[0], q[1]);
    ctx.lineTo(q[0] - sz * dx - sz * 0.5 * dy, q[1] - sz * dy + sz * 0.5 * dx); ctx.lineTo(q[0] - sz * dx + sz * 0.5 * dy, q[1] - sz * dy - sz * 0.5 * dx); ctx.closePath(); ctx.fill();
  }
  function tag(x, y, text, col, font, align){
    ctx.font = font; var w = ctx.measureText(text).width, x0 = align === "left" ? x : align === "right" ? x - w : x - w / 2;
    ctx.globalAlpha = 0.85; ctx.fillStyle = sheet; ctx.fillRect(x0 - 3, y - 9, w + 6, 18); ctx.globalAlpha = 1;
    ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x0, y);
  }
  var lo = [C[0] - h, C[1] - h, C[2] - h], hi = [C[0] + h, C[1] + h, C[2] + h], i;
  // box
  var cs = []; for (i = 0; i < 8; i++) cs.push(P([i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]]));
  ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1;
  for (i = 0; i < 8; i++) [1, 2, 4].forEach(function(bt){ if (!(i & bt)) seg(cs[i], cs[i | bt]); });
  // axes through the origin
  if (sc.axes !== false) [[1, 0, 0, "x"], [0, 1, 0, "y"], [0, 0, 1, "z"]].forEach(function(ax){
    var tt = clipLine([0, 0, 0], ax, lo, hi); if (!tt) return;
    var p = P([ax[0] * tt[0], ax[1] * tt[0], ax[2] * tt[0]]), q = P([ax[0] * tt[1], ax[1] * tt[1], ax[2] * tt[1]]), col = css("--plot-axis");
    ctx.strokeStyle = col; ctx.lineWidth = 1.3; seg(p, q); head(p, q, col, 7);
    var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
    ctx.fillStyle = ink2; ctx.font = "italic 14px " + fontM; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(ax[3], q[0] + dx / L * 11, q[1] + dy / L * 11);
  });
  // planes: fills far to near, then edges
  var polys = (sc.planes || []).map(function(pl){
    var poly = clipPlane(pl.p, lo, hi); if (!poly) return null;
    var pts = poly.map(P); return { pl:pl, pts:pts, dep:pts.reduce(function(t, q){ return t + q[2]; }, 0) / pts.length };
  }).filter(Boolean).sort(function(x, y){ return x.dep - y.dep; });
  polys.forEach(function(o){ ctx.globalAlpha = (o.pl.alpha == null ? 1 : o.pl.alpha) * (dark ? 0.2 : 0.14); ctx.fillStyle = css(o.pl.col); path(o.pts); ctx.fill(); ctx.globalAlpha = 1; });
  polys.forEach(function(o){
    ctx.globalAlpha = 0.9 * (o.pl.alpha == null ? 1 : o.pl.alpha); ctx.strokeStyle = css(o.pl.col); ctx.lineWidth = 1.8; path(o.pts); ctx.stroke(); ctx.globalAlpha = 1;
    if (o.pl.hatch) {
      ctx.save(); path(o.pts); ctx.clip(); ctx.strokeStyle = ink; ctx.globalAlpha = 0.32; ctx.lineWidth = 1.2;
      var xs = o.pts.map(function(q){ return q[0]; }), ys = o.pts.map(function(q){ return q[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      for (var x = x0 - (y1 - y0); x < x1; x += 9) seg([x, y1], [x + (y1 - y0), y0]);
      ctx.restore();
    }
  });
  // lines
  ctx.lineCap = "round";
  (sc.lines || []).forEach(function(L){
    var tt = clipLine(L.p, L.d, lo, hi); if (!tt) return;
    var f = L.frac == null ? 1 : L.frac; if (f <= 0) return;
    var p = P([L.p[0] + L.d[0] * tt[0] * f, L.p[1] + L.d[1] * tt[0] * f, L.p[2] + L.d[2] * tt[0] * f]), q = P([L.p[0] + L.d[0] * tt[1] * f, L.p[1] + L.d[1] * tt[1] * f, L.p[2] + L.d[2] * tt[1] * f]);
    if (L.glow) { ctx.globalAlpha = 0.8 * L.glow; ctx.strokeStyle = hiC; ctx.lineWidth = 14; seg(p, q); ctx.globalAlpha = 1; }
    ctx.globalAlpha = L.alpha == null ? 1 : L.alpha; ctx.strokeStyle = css(L.col || "--ink"); ctx.lineWidth = L.w || 2; ctx.setLineDash(L.dash || []); seg(p, q); ctx.setLineDash([]); ctx.globalAlpha = 1;
  });
  ctx.lineCap = "butt";
  // normals and their parallelepiped
  if (sc.normals) {
    var NN = sc.normals, A = NN.at, len = NN.len || 2.2, f4 = css("--f4");
    var U = NN.list.map(function(n){ var u = nz(n); return [u[0] * len, u[1] * len, u[2] * len]; });
    if (NN.box && U.length === 3) {
      var V = []; for (var k = 0; k < 8; k++) V.push(P([0, 1, 2].map(function(c){ return A[c] + (k & 1 ? U[0][c] : 0) + (k & 2 ? U[1][c] : 0) + (k & 4 ? U[2][c] : 0); })));
      [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]].forEach(function(fc){
        var pts = fc.map(function(j){ return V[j]; }); ctx.globalAlpha = dark ? 0.12 : 0.08; ctx.fillStyle = f4; path(pts); ctx.fill();
        ctx.globalAlpha = 0.5; ctx.strokeStyle = f4; ctx.lineWidth = 1; path(pts); ctx.stroke(); ctx.globalAlpha = 1;
      });
    }
    if (NN.arrows !== false) U.forEach(function(u, j){
      var p = P(A), q = P([A[0] + u[0], A[1] + u[1], A[2] + u[2]]), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
      ctx.strokeStyle = f4; ctx.lineWidth = 2.4; seg(p, q); head(p, q, f4, 9);
      var lx = q[0] + dx / L * 13, ly = q[1] + dy / L * 13;
      ctx.font = "italic 600 15px " + fontM; ctx.fillStyle = f4; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("n", lx, ly);
      ctx.strokeStyle = f4; ctx.lineWidth = 1.2; seg([lx - 4, ly - 9], [lx + 5, ly - 9]); head([lx - 4, ly - 9], [lx + 6, ly - 9], f4, 3.5);
      ctx.font = "600 11px " + fontUI; ctx.fillText(String(NN.subs ? NN.subs[j] : j + 1), lx + 8, ly + 5);
    });
  }
  // points
  (sc.points || []).forEach(function(pt){
    var p = P(pt.p);
    if (pt.glow) { ctx.globalAlpha = 0.6 * pt.glow; ctx.fillStyle = hiC; ctx.beginPath(); ctx.arc(p[0], p[1], 15, 0, 2 * Math.PI); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.beginPath(); ctx.arc(p[0], p[1], pt.r || 5.5, 0, 2 * Math.PI);
    if (pt.open) { ctx.fillStyle = sheet; ctx.fill(); ctx.strokeStyle = css(pt.col || "--ink"); ctx.lineWidth = 2; ctx.stroke(); }
    else { ctx.fillStyle = css(pt.col || "--ink"); ctx.fill(); }
    if (pt.label) tag(p[0] + 10, p[1] - 14, pt.label, ink, "600 13px " + fontUI, "left");
  });
  // plane labels
  var DIRS = [[-0.7, -0.7], [0.75, -0.66], [0.6, 0.8]];
  polys.forEach(function(o){
    if (!o.pl.label) return;
    var dv = DIRS[o.pl.li || 0], best = null, bd = -1e9;
    o.pts.forEach(function(q){ var v = q[0] * dv[0] + q[1] * dv[1]; if (v > bd) { bd = v; best = q; } });
    var gx = o.pts.reduce(function(t, q){ return t + q[0]; }, 0) / o.pts.length, gy = o.pts.reduce(function(t, q){ return t + q[1]; }, 0) / o.pts.length;
    var dx = gx - best[0], dy = gy - best[1], L = Math.hypot(dx, dy) || 1;
    tag(best[0] + dx / L * 18, best[1] + dy / L * 18, o.pl.label, css(o.pl.col), "italic 700 15px " + fontM, "center");
  });
  if (sc.tag) tag(R.x + 8, R.y + 10, sc.tag, ink2, "600 12px " + fontUI, "left");
  if (capLines.length) {
    ctx.font = "600 " + capF + "px " + fontUI; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top";
    capLines.forEach(function(t, j){ ctx.fillText(t, R.x + R.w / 2, R.y + R.h - capH + 4 + j * (capF + 4)); });
  }
  ctx.restore();
};
// scene for three float rows: planes, optional dashed L, pairwise lines, common points (exact sol), normals, marks, caption
function sceneOf(Rf, o){
  var sc = { planes:[], lines:[], points:[], caption:o.caption || "", tag:o.tag || "" }, good = [];
  Rf.forEach(function(r, i){ if (Math.hypot(r[0], r[1], r[2]) > 1e-9) { good.push(i); sc.planes.push({ p:r, col:COLS[i], label:"π" + SUB[i], li:i, hatch:!!(o.sol && o.sol.type === "plane") }); } });
  if (o.L) sc.lines.push({ p:[4, 2, 0], d:[-1, 0, 1], col:"--ink", w:1.8, dash:[7, 6] });
  if (o.pairs) good.forEach(function(i){ good.forEach(function(j){ if (j <= i) return; var pl = pairLine(Rf[i], Rf[j]); if (pl) sc.lines.push({ p:pl.p, d:pl.d, col:"--ink-2", w:1.5, alpha:o.pairs === true ? 1 : o.pairs }); }); });
  var sol = o.sol;
  if (sol && sol.type === "line") sc.lines.push({ p:sol.line.p.map(fv), d:sol.line.d, col:"--ink", w:4.2, glow:o.glow || 0 });
  if (sol && sol.type === "point") sc.points.push({ p:sol.pt.map(fv), glow:1, label:MV.plain(m(ptSrc(sol.pt))) });
  if ((o.norms || o.box) && good.length) sc.normals = { at:sol && sol.type === "point" ? sol.pt.map(fv) : [2, 2, 2], list:good.map(function(i){ return Rf[i].slice(0, 3); }), subs:good.map(function(i){ return i + 1; }), box:!!o.box && good.length === 3, arrows:!!o.norms };
  (o.marks || []).forEach(function(q){ sc.points.push({ p:q.p, open:true, r:5.5, label:q.label }); });
  return sc;
}
function planesTxt(R){ return R.map(function(r, i){ return "π" + SUB[i] + " (" + NAMES[i] + ") " + MV.plain(m(eqSrc(r, !zeroV(nrm(r))))); }).join("; "); }
// ------------------------------------------------- end of view3d ------------------------------------------------------

// ---------- hero: one point → a line (orange plane turns) → a prism (orange plane slides) ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var V = new View3D(cv, { turn:false, az:28, el:17 }), PT = [1, 2, 3];
  var P1 = [1, 1, 1, 6], P2 = [1, -1, 1, 2], CAP = ["Three planes meet at one point, (1, 2, 3).", "The orange plane turns: the point stretches into a line shared by all three, like pages of a book.", "No common point, and no two planes parallel."];
  function p3(alpha, shift){ var a = Math.atan2(1, 2) + alpha * Math.PI / 180, r = Math.sqrt(5), n = [r * Math.cos(a), r * Math.sin(a), -1]; return [n[0], n[1], n[2], d3(n, PT) + (shift || 0)]; }
  function scene(st){
    var off = (1 - st.slide) * 7, R = [[P1[0], P1[1], P1[2], P1[3] + off * Math.sqrt(3)], [P2[0], P2[1], P2[2], P2[3] - off * Math.sqrt(3)], p3(st.alpha, st.shift + off * 2.4)];
    var sc = { planes:R.map(function(r, i){ return { p:r, col:COLS[i], label:"π" + SUB[i], li:i, alpha:Math.min(1, 0.15 + st.slide) }; }), lines:[], points:[], caption:st.cap || "" };
    if (st.slide >= 1 && st.line <= 0 && st.shift <= 0) sc.points.push({ p:PT, glow:1 });
    if (st.line > 0 && st.shift <= 0) sc.lines.push({ p:PT, d:[-1, 0, 1], col:"--ink", w:4.2, glow:1, frac:st.line });
    if (st.pairs > 0) [[0, 1], [0, 2], [1, 2]].forEach(function(q){ var pl = pairLine(R[q[0]], R[q[1]]); if (pl) sc.lines.push({ p:pl.p, d:pl.d, col:"--ink", w:2.4, alpha:st.pairs }); });
    sc.describe = st.shift > 0 ? "Three planes, blue, teal and orange: each pair meets in a line, the three lines are parallel, and there is no common point." :
      st.line > 0 ? "Three planes, blue, teal and orange, share one line, like pages of a book." : "Three planes, blue, teal and orange, meet at the glowing point (1, 2, 3).";
    return sc;
  }
  var END = [{ slide:1, alpha:0, shift:0, line:0, pairs:0, cap:"one point" }, { slide:1, alpha:90, shift:0, line:1, pairs:0, cap:"a line, like pages" }, { slide:1, alpha:90, shift:3, line:0, pairs:1, cap:"a prism: no common point" }];
  if (MV.reduceMotion) {
    V.multi = END.map(scene); V.multiDescribe = "Three still frames: three planes meeting at the point (1, 2, 3); the same planes sharing a line like pages of a book; and a triangular prism with no common point and no two planes parallel.";
    if (f.cap) f.cap.textContent = CAP.join(" ");
    V.draw(); return;
  }
  var st = { slide:0, alpha:0, shift:0, line:0, pairs:0 };
  function draw(){ V.set(scene(st)); }
  function cap(i){ if (f.cap) f.cap.textContent = CAP[i]; }
  cap(0); draw();
  function tw(dur, step, done){ MV.tween({ dur:dur, step:function(t){ step(t); draw(); }, done:done }); }
  MV.wait(400, function(){
    tw(1300, function(t){ st.slide = t; }, function(){
      MV.wait(1100, function(){
        tw(2600, function(t){ st.alpha = 90 * t; }, function(){
          tw(800, function(t){ st.line = t; }, function(){ cap(1);
            MV.wait(1500, function(){
              tw(1700, function(t){ st.shift = 3 * t; st.pairs = t; if (t > 0) st.line = 0; }, function(){ cap(2); });
            });
          });
        });
      });
    });
  });
}

// ---------- Explore: Three-plane configurator ----------
function explore(host, api){
  var S = api.S, C = api.content, CARDS = C.cards;
  if (["gallery", "adjust", "rr"].indexOf(S.mode) < 0) S.mode = "gallery";
  if (!CARDS.some(function(c){ return c.id === S.card; })) S.card = "one";
  ["A", "B", "C", "D"].forEach(function(k, i){ var lim = k === "D" ? 12 : 3; if (!Number.isInteger(S[k]) || Math.abs(S[k]) > lim) S[k] = [2, 1, -1, -1][i]; });
  if (S.src !== "adjust") S.src = "card";
  if (["swap", "mul", "add"].indexOf(S.op) < 0) S.op = "add";
  if ([0, 1, 2].indexOf(S.rt) < 0) S.rt = 1;
  if ([0, 1, 2].indexOf(S.rs) < 0) S.rs = 0;
  if (typeof S.kv !== "string") S.kv = "−1";
  S.pairs = !!S.pairs; S.norms = !!S.norms; S.box = !!S.box;
  if (!S.rr || !Array.isArray(S.rr.rows) || !Array.isArray(S.rr.orig)) S.rr = null;
  var busy = false, hide = false, glow = 0, marks = [], caption = "", anim = null, stop = null, opMsg = "";
  host.innerHTML = '<div class="tp-ex" id="tx">' +
    '<div class="tp-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap tp-3d"><canvas class="plot square" id="tx-plot" role="img" aria-label="3D view of three planes"></canvas></div>' +
    '<p class="tiny muted tp-vhow">' + C.viewHow + '</p><div class="chips tp-tog" id="tx-tog" role="group" aria-label="Show on the view"></div></div>' +
    '<div class="tp-ctrl"><div class="seg-wrap" id="tx-mode"></div><p class="tiny muted tp-how" id="tx-how"></p><div id="tx-panel"></div></div>' +
    '<div class="tp-readw"><dl class="read tp-read" id="tx-read" aria-live="polite"></dl></div></div>';
  var view = new View3D($("#tx-plot", host), {});
  function card(){ return CARDS.filter(function(c){ return c.id === S.card; })[0]; }
  function adjRows(A, B, Cc, D){ return qrows([[1, 1, 1, 6], [1, -1, 1, 2], [A, B, Cc, -D]]); }
  function srcKey(){ return S.src === "adjust" ? "adjust:" + [S.A, S.B, S.C, S.D].join(",") : "card:" + S.card; }
  function srcRows(){ return S.src === "adjust" ? adjRows(S.A, S.B, S.C, S.D) : qrows(card().rows); }
  function loadRR(force){ if (force || !S.rr || S.rr.base !== srcKey()) { var R = srcRows(); S.rr = { base:srcKey(), orig:R, rows:R, hist:[], stack:[] }; } }
  function rowsNow(){ return S.mode === "rr" ? qrows(S.rr.rows) : S.mode === "adjust" ? adjRows(S.A, S.B, S.C, S.D) : qrows(card().rows); }
  function origNow(){ return S.mode === "rr" ? qrows(S.rr.orig) : rowsNow(); }
  function srcName(){ return S.rr && S.rr.base.indexOf("adjust") === 0 ? "your Adjust-mode system" : "the " + (CARDS.filter(function(c){ return "card:" + c.id === (S.rr && S.rr.base); })[0] || card()).name + " card"; }
  if (S.mode === "rr") loadRR(false);
  function clearFx(){ glow = 0; marks = []; caption = ""; }

  function draw(){
    var R = rowsNow(), sol = hide ? null : solSet(R);
    var sc = sceneOf(anim || frows(R), { sol:sol, L:S.mode === "adjust", pairs:S.pairs, norms:S.norms, box:S.box, glow:glow, marks:marks, caption:caption });
    var cl = classify(origNow());
    sc.describe = "3D view. " + planesTxt(R) + "." + (hide ? "" : " Configuration: " + (cl.kind === "bad" ? "π₃ isn’t a plane" : C.kinds[cl.kind]) + ". Common points: " + MV.plain(commonHTML(sol)) + ".") + (caption ? " " + caption : "");
    view.set(sc);
  }
  function paintRead(){
    var R = rowsNow(), RO = origNow(), cl = classify(RO), sol = solSet(R), K = C.rows, rows = [], tp = dot(nrm(R[0]), cross(nrm(R[1]), nrm(R[2])));
    rows.push([K.planes, R.map(function(r, i){ return '<span class="tp-c' + (i + 1) + '">π' + SUB[i] + "</span>: " + m(eqSrc(r, !zeroV(nrm(r)))); }).join("<br>")]);
    var tpTxt = (S.mode === "adjust" ? m("2A - 2C = " + qi(tp)) : m(qi(tp))) + " (" + (isZ(tp) ? C.tpNo : C.tpYes) + ")";
    rows.push([K.tp, hide ? "?" : tpTxt]);
    var pp = parPairs(R);
    rows.push([K.par, hide ? "?" : pp.length ? pp.map(function(q){ return "π" + SUB[q.a] + (q.same ? " = " : " ∥ ") + "π" + SUB[q.b] + (q.same ? " (coincident)" : " (distinct)"); }).join("; ") : "none"]);
    rows.push([K.config, hide ? "?" : cl.kind === "bad" ? "π₃ isn’t a plane (" + m("A = B = C = 0") + ")" : C.kinds[cl.kind] + (S.mode === "rr" ? ' <span class="tiny muted">(the loaded system)</span>' : "")]);
    rows.push([K.common, hide ? "?" : commonHTML(sol)]);
    var F = refOf(R);
    rows.push([K.red, hide ? "?" : matHTML(F, null, true) + '<span class="tiny tp-rsay">' + refSay(F) + "</span>"]);
    $("#tx-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintTop(){
    var tx = $("#tx", host); tx.classList.toggle("tp-rr", S.mode === "rr");
    MV.keepFocus($("#tx-mode", host), function(){ $("#tx-mode", host).innerHTML = '<span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode"); });
    $("#tx-how", host).innerHTML = C.modeHow[S.mode];
    MV.keepFocus($("#tx-tog", host), function(){
      $("#tx-tog", host).innerHTML = ["pairs", "norms", "box"].map(function(k){ return '<button type="button" class="chip' + (S[k] ? " on" : "") + '" data-tog="' + k + '" data-k="tog' + k + '" aria-pressed="' + S[k] + '">' + C.toggles[k] + "</button>"; }).join("");
    });
  }
  function panelGallery(el){
    if (el.dataset.mode !== "gallery") {
      el.dataset.mode = "gallery";
      el.innerHTML = '<div class="tp-cards" role="group" aria-label="Configuration cards"></div><div class="tp-gsys" id="tx-gsys"></div>';
    }
    var cards = $(".tp-cards", el);
    MV.keepFocus(cards, function(){
      cards.innerHTML = CARDS.map(function(c){ var on = c.id === S.card && S.src === "card"; return '<button type="button" class="tp-card" data-card="' + c.id + '" data-k="card' + c.id + '" aria-pressed="' + on + '"><span class="tp-cn">' + c.name + '</span><span class="tp-cc">' + c.common + "</span></button>"; }).join("");
    });
    var R = qrows(card().rows), F = refOf(R);
    $("#tx-gsys", el).innerHTML = '<p class="tiny tp-lab">System</p><div class="tp-eqs">' + R.map(function(r, i){ return '<span><span class="tp-c' + (i + 1) + '">π' + SUB[i] + "</span>: " + m(eqSrc(r)) + "</span>"; }).join("") + "</div>" +
      '<p class="tiny tp-lab">Reduced matrix</p>' + matHTML(F) + '<p class="tiny tp-rsay">' + refSay(F) + "</p>";
  }
  function panelAdjust(el){
    if (el.dataset.mode !== "adjust") {
      el.dataset.mode = "adjust";
      el.innerHTML = '<p class="tiny tp-fixed"><span><span class="tp-c1">π₁</span>: ' + m("x + y + z - 6 = 0") + ' (fixed)</span><span><span class="tp-c2">π₂</span>: ' + m("x - y + z - 2 = 0") + ' (fixed)</span><span>' + m("L") + ": " + m("(4, 2, 0) + t(-1, 0, 1)") + "</span></p>" +
        '<p class="tp-p3eq" id="tx-p3" aria-live="polite"></p><div class="tp-sls">' + ["A", "B", "C", "D"].map(function(k){
          var lim = k === "D" ? 12 : 3;
          return '<label class="slider"><span class="slider-top"><span class="m"><i>' + k + '</i></span><output data-o="' + k + '"></output></span><input type="range" data-sl="' + k + '" min="' + -lim + '" max="' + lim + '" step="1" style="accent-color:var(--f5)" aria-label="' + k + " in π₃ (" + MINUS + lim + " to " + lim + ')"></label>';
        }).join("") + "</div>";
    }
    ["A", "B", "C", "D"].forEach(function(k){ var inp = $('[data-sl="' + k + '"]', el); if (+inp.value !== S[k]) inp.value = S[k]; $('[data-o="' + k + '"]', el).textContent = S[k] < 0 ? MINUS + -S[k] : String(S[k]); inp.setAttribute("aria-valuetext", (S[k] < 0 ? MINUS + -S[k] : String(S[k]))); });
    $("#tx-p3", el).innerHTML = '<span class="tp-c3">π₃</span>: ' + m(eqSrc(adjRows(S.A, S.B, S.C, S.D)[2], true));
  }
  function kTxt(k){ if (k.d === 1 && Math.abs(k.n) === 1) return k.n < 0 ? MINUS : ""; return k.d === 1 ? (k.n < 0 ? MINUS + -k.n : String(k.n)) : "(" + (k.n < 0 ? MINUS : "") + Math.abs(k.n) + "/" + k.d + ")"; }
  function opLabel(op, k){
    var t = "R" + SUB[S.rt], s = "R" + SUB[S.rs];
    if (op === "swap") return t + " ↔ " + s;
    if (op === "mul") return t + " → " + kTxt(k) + t;
    var a = Q.abs(k); return t + " → " + t + (k.n < 0 ? " − " : " + ") + kTxt(a) + s;
  }
  function panelRR(el){
    if (el.dataset.mode !== "rr") {
      el.dataset.mode = "rr";
      el.innerHTML = '<p class="tiny" id="tx-rrsrc"></p><div id="tx-mat" aria-live="polite"></div>' +
        '<div class="tp-ops"><div class="seg-wrap" id="tx-op"></div><div class="tp-opctl" id="tx-opctl"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-rr="apply" data-k="rrapply">Apply</button><button type="button" class="btn ghost sm" data-rr="undo" data-k="rrundo">Undo</button><button type="button" class="btn ghost sm" data-rr="reload" data-k="rrreload">Start again</button></div>' +
        '<p class="tiny tp-opmsg" id="tx-opmsg" aria-live="polite"></p></div><p class="tiny tp-lab">History</p><ol class="tp-hist" id="tx-hist"></ol>';
    }
    $("#tx-rrsrc", el).innerHTML = "Loaded: " + srcName() + ".";
    var last = S.rr.lastHi || null;
    $("#tx-mat", el).innerHTML = matHTML(qrows(S.rr.rows), last);
    MV.keepFocus($("#tx-op", el), function(){ $("#tx-op", el).innerHTML = '<span class="tiny" style="font-weight:700">Operation</span>' + segBtns("op", C.rrOps, S.op, "Row operation"); });
    var RB = [0, 1, 2].map(function(i){ return { id:i, t:"R" + SUB[i] }; }), kin = '<input class="numin short" id="tx-k" data-k="rrk" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="Multiplier k (not 0)" value="' + MV.esc(S.kv) + '">';
    var ctl = $("#tx-opctl", el), h;
    if (S.op === "swap") h = '<span class="tp-oprow"><span class="tiny">Swap</span>' + segBtns("rt", RB, S.rt, "First row") + '<span class="tiny">and</span>' + segBtns("rs", RB, S.rs, "Second row") + "</span>";
    else if (S.op === "mul") h = '<span class="tp-oprow"><span class="tiny">Row</span>' + segBtns("rt", RB, S.rt, "Row to multiply") + '</span><span class="tp-oprow"><span class="tiny">' + "R" + SUB[S.rt] + " → " + m("k") + " · R" + SUB[S.rt] + ", " + m("k =") + "</span>" + kin + "</span>";
    else h = '<span class="tp-oprow"><span class="tiny">Change</span>' + segBtns("rt", RB, S.rt, "Row to change") + '</span><span class="tp-oprow"><span class="tiny">add</span>' + kin + '<span class="tiny">× row</span>' + segBtns("rs", RB, S.rs, "Row to add") + '</span><span class="tiny muted tp-opform">R' + SUB[S.rt] + " → R" + SUB[S.rt] + " + " + m("k") + " · R" + SUB[S.rs] + "</span>";
    if (ctl.dataset.h !== h) { MV.keepFocus(ctl, function(){ ctl.innerHTML = h; }); ctl.dataset.h = h; }
    $("#tx-opmsg", el).innerHTML = opMsg;
    $("#tx-hist", el).innerHTML = S.rr.hist.length ? S.rr.hist.map(function(t){ return "<li>" + t + "</li>"; }).join("") : '<li class="muted">No operations yet.</li>';
  }
  function paintPanel(){ var el = $("#tx-panel", host); if (S.mode === "gallery") panelGallery(el); else if (S.mode === "adjust") panelAdjust(el); else panelRR(el); }
  function paint(){ paintTop(); paintPanel(); paintRead(); draw(); }
  function lerpRows(A, B, t){ return A.map(function(r, i){ return r.map(function(x, j){ return x + (B[i][j] - x) * t; }); }); }
  function doOp(op, k, dur, cb){
    var R = qrows(S.rr.rows), N, hi;
    if (op === "swap") { if (S.rt === S.rs) { opMsg = "Choose two different rows."; paintPanel(); return; } N = applyOp(R, { sw:[S.rt, S.rs] }); hi = [S.rt, S.rs]; }
    else if (op === "mul") { N = applyOp(R, { t:S.rt, k:k }); hi = [S.rt]; }
    else { if (S.rt === S.rs) { opMsg = "Choose two different rows."; paintPanel(); return; } N = applyOp(R, { t:S.rt, s:S.rs, k:k }); hi = [S.rt]; }
    var label = opLabel(op, k);
    opMsg = ""; busy = op !== "swap" && !MV.reduceMotion;
    function commit(){ anim = null; stop = null; busy = false; S.rr.stack.push(S.rr.rows); S.rr.rows = N; S.rr.hist.push(label); S.rr.lastHi = hi; api.save(); paint(); MV.changed(); if (cb) cb(); }
    if (op === "swap") { commit(); return; }
    var Af = frows(R), Bf = frows(N);
    stop = MV.tween({ dur:dur || 900, step:function(t){ anim = lerpRows(Af, Bf, t); draw(); }, done:commit });
  }
  function readK(){ var raw = Q.raw(S.kv), k = raw ? Q.of(raw.n, raw.d) : null; if (!k) { var p = MV.parseNum(S.kv); if (p && p.length === 1 && isFinite(p[0])) k = Q.of(p[0]); } return k; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.mode) {
      S.mode = b.dataset.mode; if (S.mode !== "rr") S.src = S.mode === "adjust" ? "adjust" : "card"; else loadRR(false);
      clearFx(); opMsg = ""; api.save(); paint(); MV.changed(); return;
    }
    if (b.dataset.tog) { S[b.dataset.tog] = !S[b.dataset.tog]; api.save(); paintTop(); draw(); return; }
    if (b.dataset.card) { S.card = b.dataset.card; S.src = "card"; clearFx(); api.save(); paint(); MV.changed(); return; }
    if (b.dataset.op) { S.op = b.dataset.op; opMsg = ""; api.save(); paintPanel(); return; }
    if (b.dataset.rt != null) { S.rt = +b.dataset.rt; api.save(); paintPanel(); return; }
    if (b.dataset.rs != null) { S.rs = +b.dataset.rs; api.save(); paintPanel(); return; }
    if (b.dataset.rr === "apply") {
      clearFx(); var k = null;
      if (S.op !== "swap") { k = readK(); if (!k) { opMsg = "Type a number such as 2, −1 or 1/2."; paintPanel(); return; } if (isZ(k)) { opMsg = "The multiplier can’t be 0: that would wipe out the equation."; paintPanel(); return; } }
      doOp(S.op, k, 900); return;
    }
    if (b.dataset.rr === "undo") { if (S.rr.stack.length) { S.rr.rows = S.rr.stack.pop(); S.rr.hist.pop(); S.rr.lastHi = null; } clearFx(); opMsg = ""; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.rr === "reload") { loadRR(true); clearFx(); opMsg = ""; api.save(); paint(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "tx-k") { S.kv = t.value; api.save(); return; }
    if (!t.dataset || !t.dataset.sl) return;
    if (busy) { paintPanel(); return; }
    S[t.dataset.sl] = +t.value; S.src = "adjust"; clearFx(); api.save(); paintPanel(); paintRead(); draw(); MV.changed();
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "tx-k") { var b = $('[data-rr="apply"]', host); if (b) b.click(); } });
  paint();

  // ---- predictions ----
  function setABCD(v){ S.A = v[0]; S.B = v[1]; S.C = v[2]; S.D = v[3]; }
  function adjF(v){ return frows(adjRows(v[0], v[1], v[2], v[3])); }
  return {
    predict:{
      start:function(p){
        if (stop) { stop(); stop = null; }
        busy = true; clearFx(); anim = null; hide = true;
        if (p.id === "p1") { S.mode = "adjust"; S.src = "adjust"; setABCD([1, 3, 1, -10]); }
        else if (p.id === "p2") { S.mode = "adjust"; S.src = "adjust"; setABCD([1, 3, 1, -10]); S.pairs = false; }
        else if (p.id === "p3") { S.mode = "rr"; S.card = "one"; S.src = "card"; loadRR(true); S.op = "add"; S.rt = 1; S.rs = 0; S.kv = "−1"; hide = false; }
        else { S.mode = "adjust"; S.src = "adjust"; setABCD([2, 1, -1, -1]); }
        paint();
      },
      run:function(p, done){
        function fin(){ busy = false; hide = false; anim = null; api.save(); paint(); MV.changed(); done(); }
        function glowUp(cb){ stop = MV.tween({ dur:900, step:function(t){ glow = t; draw(); }, done:function(){ stop = null; cb(); } }); }
        if (p.id === "p1") {
          marks = [{ p:[4, 2, 0], label:"(4, 2, 0)" }, { p:[3, 2, 1], label:"(3, 2, 1)" }]; draw();
          MV.wait(900, function(){ hide = false; paintRead(); draw(); glowUp(function(){ MV.wait(500, fin); }); });
        } else if (p.id === "p2") {
          var A0 = adjF([1, 3, 1, -10]), A1 = adjF([1, 3, 1, -12]);
          stop = MV.tween({ dur:1500, step:function(t){ anim = lerpRows(A0, A1, t); draw(); }, done:function(){
            stop = null; anim = null; S.D = -12; S.pairs = true; hide = false; caption = "No common point. No two planes are parallel."; paint(); MV.wait(900, fin);
          } });
        } else if (p.id === "p3") {
          MV.wait(300, function(){
            busy = false; doOp("add", Q.of(-1), 1600, function(){ busy = true; caption = "The teal plane is now −2y = −4 (the plane y = 2), still through (1, 2, 3)."; draw(); MV.wait(900, fin); });
            busy = true;
          });
        } else {
          var B0 = adjF([2, 1, -1, -1]), B1 = adjF([2, 0, 2, -8]);
          stop = MV.tween({ dur:1600, step:function(t){ anim = lerpRows(B0, B1, t); draw(); }, done:function(){
            stop = null; anim = null; setABCD([2, 0, 2, -8]); hide = false; paint(); glowUp(function(){ MV.wait(500, fin); });
          } });
        }
      }
    },
    challenge:function(id){
      var M = (C.challenges.filter(function(c){ return c.id === id; })[0] || {}).msgs || {}, A = S.A, B = S.B, Cc = S.C, D = S.D;
      if (S.mode !== "adjust") return { ok:false, msg:M.mode };
      if (!A && !B && !Cc) return { ok:false, msg:M.zero };
      var onL = 4 * A + 2 * B + D === 0, par = A === Cc;
      if (id === "tc1") {
        if (!par && onL) return { ok:true };
        if (par && onL) return { ok:false, msg:M.line };
        if (!par) return { ok:false, msg:M.other };
        return { ok:false, msg:M.flat };
      }
      if (id === "tc2") {
        if (!par) return { ok:false, msg:M.point };
        if (A === B) return { ok:false, msg:M.p1 };
        if (B === -A) return { ok:false, msg:M.p2 };
        if (onL) return { ok:false, msg:M.sheaf };
        return { ok:true };
      }
      if (id === "tc3") {
        if (par && B === -2 * A && D === 0) return { ok:true };
        if (D === 0 && !par) return { ok:false, msg:M.point };
        if (par && onL) return { ok:false, msg:M.sheaf };
        return { ok:false, msg:M.other };
      }
      return { ok:false };
    }
  };
}

// ---------- Part 3: Algebra meets geometry (stations: V13 Step mode beside the V1 view) ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.stations, ready = false;
  S.view = S.view || {};
  var vhow = "Drag the view, or focus it and use the arrow keys, to turn it.";
  host.innerHTML = ST.map(function(st){
    function pane(id, spec, title){
      return '<div class="tp-stm' + (id === "cmp" ? " tp-cmp" : "") + '" data-pn="' + id + '">' + (title ? "<h4>" + title + "</h4>" : "") + '<div class="tp-mhost"></div><ol class="tp-steps" aria-live="polite"></ol><div class="tp-pl"></div>' +
        (spec.alg ? '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + spec.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details>" : "") + "</div>";
    }
    return '<div class="part tp-st" data-st="' + st.id + '"><h3>' + st.title + "</h3><p>" + st.text + '</p><div class="tp-stg"><div class="tp-stl">' + pane("main", st) + (st.compare ? pane("cmp", st.compare, st.compare.title) : "") +
      '</div><div class="tp-str"><p class="tiny tp-vlab" aria-live="polite"></p><div class="plot-wrap tp-3d"><canvas class="plot square" role="img" aria-label="3D view of the station’s planes"></canvas></div><p class="tiny muted">' + vhow + '</p><dl class="read tp-p3read" aria-live="polite"></dl></div></div></div>';
  }).join("");
  var views = {}, idx = {};
  function specOf(st, pn){ return pn === "cmp" ? st.compare : st; }
  function rowsAt(spec, i){ var R = qrows(spec.rows); for (var j = 1; j <= i; j++) if (spec.steps[j].op) R = applyOp(R, spec.steps[j].op); return R; }
  function drawSt(st){
    var pn = S.view[st.id] === "cmp" && st.compare ? "cmp" : "main", spec = specOf(st, pn), i = idx[st.id + pn] || 0, step = spec.steps[i], box = $('[data-st="' + st.id + '"]', host);
    var showOrig = !!step.normals, R = showOrig ? qrows(spec.rows) : rowsAt(spec, i), sol = solSet(qrows(spec.rows)), notes = [];
    if (!showOrig) R.forEach(function(r, j){ if (zeroV(nrm(r))) notes.push(tpl(isZ(r[3]) ? C.zeroRow : C.badRow, { r:SUB[j], k:MV.plain(cellH(r[3])) })); });
    var sc = sceneOf(frows(R), { sol:sol, norms:showOrig, caption:notes.join(" ") || (sol.type === "none" && i === spec.steps.length - 1 ? "No common point." : "") });
    sc.describe = "3D view. " + planesTxt(R) + ". Common points: " + MV.plain(commonHTML(sol)) + "." + (notes.length ? " " + notes.join(" ") : "");
    views[st.id].set(sc);
    $(".tp-vlab", box).innerHTML = C.labels.view + " " + (pn === "cmp" ? C.labels.cmp : C.labels.main) + (showOrig ? " (the original equations, with their normals)" : ", step " + (i + 1) + " of " + spec.steps.length);
    var cl = classify(qrows(spec.rows)), last = i === spec.steps.length - 1, rows = [[C.labels.common, commonHTML(sol)]];
    if (showOrig) {
      var N = qrows(spec.rows).map(function(r){ return m("(" + nrm(r).map(qi).join(", ") + ")"); }), pp = parPairs(qrows(spec.rows));
      rows.push([C.labels.normals, N.join(", ") + "; " + (pp.length ? pp.map(function(q){ return "π" + SUB[q.a] + (q.same ? " = " : " ∥ ") + "π" + SUB[q.b]; }).join(", ") : "no two parallel")]);
    }
    if (last) rows.push(["Configuration", KINDN[cl.kind]]);
    $(".tp-p3read", box).innerHTML = MV.readoutHTML(rows);
  }
  ST.forEach(function(st){
    var box = $('[data-st="' + st.id + '"]', host);
    views[st.id] = new View3D($("canvas", box), {});
    ["main", "cmp"].forEach(function(pn){
      var spec = specOf(st, pn); if (!spec) return;
      var el = $('[data-pn="' + pn + '"]', box);
      MV.player($(".tp-pl", el), { count:spec.steps.length, interval:1700,
        label:function(i){ return "Step " + (i + 1) + " of " + spec.steps.length; },
        render:function(i){
          idx[st.id + pn] = i;
          var R = rowsAt(spec, i), op = spec.steps[i].op, hi = op ? (op.sw ? op.sw : [op.t]) : null;
          $(".tp-mhost", el).innerHTML = matHTML(R, hi);
          $(".tp-steps", el).innerHTML = spec.steps.map(function(s, j){ return j <= i ? '<li class="' + (j === i ? "cur" : "") + '">' + s.say + "</li>" : ""; }).join("");
          if (ready) { S.view[st.id] = pn; api.save(); }
          if (ready || pn === "main") drawSt(st);
        } });
    });
    S.view[st.id] = "main";
    drawSt(st);
  });
  ready = true;
  return {};
}

// ---------- Practice 2: Solve the system ----------
// @component V8 pointBoxes + V12 lineBoxes (adapted from MCV4U 13 pointBoxes) — exact entry for points (□, □, □), lines
// r⃗ = (□, □, □) + t(□, □, □) (any point on the line, any parallel direction), a k box and chip groups; named wrong states,
// first-try scoring and three-level help where the plan gives hints.
function solveAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, TX = a.msgs;
  function ist(id){ var x = S.it[id] || (S.it[id] = { v:{}, ch:{}, tries:0, hint:0, solved:false, first:null }); x.ch = x.ch || {}; x.v = x.v || {}; return x; }
  host.innerHTML = '<p class="how">' + a.how + '</p><details class="alg tp-flowd"><summary>' + a.flowTitle + "</summary>" + a.flow + "</details>" + a.items.map(function(it, i){
    return '<div class="q tp-pq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="tp-pin"></div><div class="tp-pcl"></div></div>';
  }).join("");
  function inp(it, k, label, x){ return '<input class="numin short" data-bx="' + k + '" data-k="' + it.id + k + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" aria-label="' + MV.esc(label) + '" value="' + MV.esc(x.v[k] || "") + '"' + (x.solved ? " disabled" : "") + ">"; }
  function triple(it, x, pre, label){ return '<span class="m">(</span>' + ["x", "y", "z"].map(function(v, j){ return inp(it, pre + j, label + " " + (pre === "d" ? ["first", "second", "third"][j] + " component" : v + "-coordinate"), x); }).join('<span class="m">,</span>') + '<span class="m">)</span>'; }
  function lineBoxes(it, x){ return '<div class="tp-lbx"><span class="m">' + m("vec{r} =") + "</span>" + triple(it, x, "p", "Point on the line,") + '<span class="m">+ <i>t</i></span>' + triple(it, x, "d", "Direction vector,") + "</div>"; }
  function chipGroup(it, x, gid, label, chips){
    return '<div class="tp-chg"><span class="tiny tp-chl">' + label + '</span><span class="chips" role="group" aria-label="' + MV.esc(MV.plain(label)) + '">' + chips.map(function(c, j){
      var on = x.ch[gid] === j; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ch="' + gid + '" data-j="' + j + '" data-k="' + it.id + gid + j + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
    }).join("") + "</span></div>";
  }
  function kBox(it, x){ return '<div class="tp-kbx"><label><span>' + it.boxLabel + "</span>" + inp(it, "k", MV.plain(it.boxLabel), x) + "</label></div>"; }
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .tp-pin', host), h = "";
    if (it.kind === "pt") h = '<div class="tp-lbx"><span class="m">(<i>x</i>, <i>y</i>, <i>z</i>) =</span>' + triple(it, x, "p", "Solution,") + "</div>";
    else if (it.kind === "line") h = chipGroup(it, x, "share", it.shareLabel, it.chips) + lineBoxes(it, x);
    else if (it.kind === "config") h = chipGroup(it, x, "cfg", "Configuration", it.chips);
    else if (it.kind === "k5") h = kBox(it, x) + it.groups.map(function(g){ return chipGroup(it, x, g.id, g.label, g.chips); }).join("");
    else h = kBox(it, x) + '<p class="tiny tp-chl">The solutions</p>' + lineBoxes(it, x);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .tp-pcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function val(raw){
    var t = String(raw || "").trim(); if (!t) return { empty:true };
    var r = Q.raw(t); if (r && r.d) return { q:Q.of(r.n, r.d) };
    var p = MV.parseNum(t); if (p && p.length === 1 && isFinite(p[0])) return { q:Q.of(p[0]) };
    return { err:true };
  }
  function vec(x, pre){ var out = []; for (var j = 0; j < 3; j++) { var r = val(x.v[pre + j]); if (r.empty) return { err:TX.fill }; if (r.err) return { err:TX.err }; out.push(r.q); } return { v:out }; }
  function lineOk(rows, x){
    var p = vec(x, "p"); if (p.err) return p; var d = vec(x, "d"); if (d.err) return d;
    var R = qrows(rows);
    if (!R.every(function(r){ return Q.eq(dot(nrm(r), p.v), r[3]); })) return { ok:false, msg:TX.lineP };
    if (zeroV(d.v) || !R.every(function(r){ return isZ(dot(nrm(r), d.v)); })) return { ok:false, msg:TX.lineD };
    return { ok:true };
  }
  function chipOf(x, gid, chips){ return x.ch[gid] == null ? null : chips[x.ch[gid]]; }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it) || {}, k, r;
    if (it.kind === "pt") {
      var p = vec(x, "p"); if (p.err) return p;
      if (p.v.every(function(q, j){ return Q.eq(q, Q.of(ans.pt[j])); })) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return z.pt && p.v.every(function(q, j){ return Q.eq(q, Q.of(z.pt[j])); }); })[0];
      if (w) return { ok:false, msg:w.fb };
      var R = qrows(it.rows), bad = -1; R.some(function(rw, j){ if (!Q.eq(dot(nrm(rw), p.v), rw[3])) { bad = j; return true; } return false; });
      return { ok:false, msg:(bad >= 0 ? tpl(TX.fails, { n:bad + 1 }) + " " : "") + TX.pt };
    }
    if (it.kind === "line") {
      var c = chipOf(x, "share", it.chips); if (!c) return { err:TX.chip };
      if (!MV.ok(c)) return { ok:false, msg:c.fb || TX.chipDefault };
      return lineOk(it.rows, x);
    }
    if (it.kind === "config") {
      var c2 = chipOf(x, "cfg", it.chips); if (!c2) return { err:"Choose a configuration first." };
      return MV.ok(c2) ? { ok:true } : { ok:false, msg:c2.fb || TX.config };
    }
    r = val(x.v.k); if (r.empty) return { err:TX.fill }; if (r.err) return { err:TX.err }; k = r.q;
    if (it.kind === "k5") {
      var ch = it.groups.map(function(g){ return chipOf(x, g.id, g.chips); });
      if (ch.some(function(z){ return !z; })) return { err:TX.fill };
      var fbc = ch.filter(function(z){ return !MV.ok(z) && z.fb; })[0];
      if (fbc) return { ok:false, msg:fbc.fb };
      if (!Q.eq(k, Q.of(ans.k))) return { ok:false, msg:TX.kBox };
      if (ch.some(function(z){ return !MV.ok(z); })) return { ok:false, msg:TX.kGroup };
      return { ok:true };
    }
    if (!Q.eq(k, Q.of(ans.k))) { var wk = (it.wrong || []).filter(function(z){ return z.k != null && Q.eq(k, Q.of(z.k)); })[0]; return { ok:false, msg:wk ? wk.fb : TX.kBox }; }
    return lineOk(it.rows, x);
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var q = t.closest("[data-q]"); ist(q.dataset.q).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.ch) { x.ch[b.dataset.ch] = +b.dataset.j; api.save(); paintIn(it); return; }
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

// ---------- Performance task: Prism through a point ----------
var task = (function(){
  var api, view, LIM = { A:2, B:2, C:2, D:12 };
  function gi(k){ var t = String(api && api.S[k] != null ? api.S[k] : "").trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && Math.abs(v) <= LIM[k] ? v : null; }
  function read(){ var d = { A:gi("A"), B:gi("B"), C:gi("C"), D:gi("D") }; d.valid = d.A !== null && d.B !== null && d.C !== null && d.D !== null; return d; }
  function rowsOf(d){ return qrows([[1, 1, 1, 6], [1, -1, 1, 2], [d.A, d.B, d.C, -d.D]]); }
  function zeroN(d){ return !d.A && !d.B && !d.C; }
  function checks(d){
    if (!d.valid) return [false, false, false];
    if (zeroN(d)) return [3 * d.C + d.D === 0, false, false];
    var par1 = d.A === d.B && d.B === d.C, par2 = d.A === d.C && d.B === -d.A;
    return [3 * d.C + d.D === 0, !par1 && !par2, solSet(rowsOf(d)).type === "none"];
  }
  function norm(d){ var v = [d.A, d.B, d.C, d.D], g = 0; v.forEach(function(x){ g = gcd(g, x); }); var lead = v.filter(function(x){ return x; })[0]; if (lead < 0) g = -g; return v.map(function(x){ return x / g + 0; }); }
  function eqOf(v){ return eqSrc(qrows([[v[0], v[1], v[2], -v[3]]])[0], true); }
  function draw(){
    var d = read(), ink = "--ink", R = [[1, 1, 1, 6], [1, -1, 1, 2]];
    var ok = d.valid && !zeroN(d), sc;
    if (ok) R.push([d.A, d.B, d.C, -d.D]);
    var Rq = qrows(R), sol = ok ? solSet(Rq) : null;
    sc = sceneOf(R, { sol:sol, L:true, pairs:true, marks:[{ p:[0, 0, 3], label:"Q(0, 0, 3)" }] });
    sc.lines.forEach(function(L){ if (L.col === "--ink-2") L.col = ink; });
    sc.describe = "3D view: π₁ x + y + z − 6 = 0 (blue), π₂ x − y + z − 2 = 0 (teal)" + (ok ? ", π₃ " + MV.plain(m(eqSrc(Rq[2], true))) + " (orange)" : "") + ", the point Q(0, 0, 3), the dashed line L and the pairwise lines." + (ok ? " Common points: " + MV.plain(commonHTML(sol)) + "." : "");
    view.set(sc);
  }
  function readout(){
    var d = read(), el = $("#tp-tread"); if (!el) return;
    var rows = [];
    if (!d.valid || zeroN(d)) rows.push(["π₃", '<span class="muted">' + (d.valid ? "π₃ needs a normal." : "Choose whole numbers in range.") + "</span>"]);
    else {
      var Rq = rowsOf(d), cl = classify(Rq);
      rows.push(['<span class="tp-c3">π₃</span>', m(eqSrc(Rq[2], true))]);
      rows.push([m("vec{n}_1 · (vec{n}_2 × vec{n}_3)"), m("2A - 2C = " + qi(cl.tp))]);
      rows.push(["Configuration", KINDN[cl.kind]]);
      rows.push(["Common points", commonHTML(cl.sol)]);
    }
    el.innerHTML = MV.readoutHTML(rows);
  }
  function stepper(k){
    var lim = LIM[k];
    return '<div class="it-step tp-step"><label for="tp-t' + k + '"><span class="m"><i>' + k + '</i></span> <span class="tiny muted">(' + MINUS + lim + " to " + lim + ")</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="tp' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="tp-t' + k + '" data-tk="' + k + '" type="number" min="' + -lim + '" max="' + lim + '" step="1" autocomplete="off" value="' + MV.esc(api.S[k]) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="tp' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.A == null) { a.S.A = "0"; a.S.B = "0"; a.S.C = "1"; a.S.D = "0"; }
      inp.innerHTML = '<p class="tiny" style="font-weight:700;margin:0">π₃: ' + m("Ax + By + Cz + D = 0") + '</p><div class="tp-steps4">' + ["A", "B", "C", "D"].map(stepper).join("") + "</div>";
      pv.innerHTML = '<div class="plot-wrap tp-3d"><canvas class="plot square" id="tp-tplot" role="img" aria-label="Your three planes"></canvas></div><p class="tiny muted">Drag the view, or focus it and use the arrow keys, to turn it.</p><dl class="read" id="tp-tread" aria-live="polite" style="margin-top:10px"></dl>';
      view = new View3D($("#tp-tplot"), {});
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); readout(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -LIM[k], LIM[k])); $("#tp-t" + k).value = a.S[k];
        a.save(); draw(); readout(); a.update();
      });
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){
        setTimeout(function(){
          var fb = $("#task-fb .fb.good"), T = a.content || {};
          if (fb && T.afterAll && MV.taskState().found.length >= (T.total || 5) && !$(".tp-all", fb)) fb.insertAdjacentHTML("beforeend", '<p class="tp-all">' + MV.md(T.afterAll) + "</p>");
        }, 0);
      });
      draw(); readout();
    },
    read:read,
    valid:function(d){ if (!d.valid) return "Choose whole numbers: " + m("A") + ", " + m("B") + " and " + m("C") + " from " + MINUS + "2 to 2, and " + m("D") + " from " + MINUS + "12 to 12."; if (zeroN(d)) return "π₃ needs a normal: " + m("A") + ", " + m("B") + " and " + m("C") + " can’t all be 0."; return true; },
    checks:checks,
    key:function(d){ return norm(d).join(","); },
    label:function(k){ return m(eqOf(k.split(",").map(Number))); },
    text:function(k){ return MV.plain(m(eqOf(k.split(",").map(Number)))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ solve:solveAct },
  task:task
});
})();
