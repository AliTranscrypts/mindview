// MCV4U 55 Systems of Equations (Matrices): hero (three equations collapse into an augmented matrix; row operations swing the
// planes while their common point stays put), Row-reduction stepper (Explore: V13 matrix stepper linked to a V1 3D view, or a 2D
// graph for 2 × 2, with a Back-substitute panel and Build mode), How many solutions? (Part 3: read the final matrix, a parameter
// slider along a line of solutions, back to R²), Row-reduce and solve (Practice 2: a stepper and solution boxes per item) and
// the "Third plane in the sheaf" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
var SUBD = "₀₁₂₃₄₅₆₇₈₉", VARS = ["x", "y", "z"], ROWC = ["--pen", "--f3", "--f5"];
function Rn(i){ return "R" + SUBD[i + 1]; }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mfont(px){ return "italic " + (px || 15) + "px " + (css("--font-math") || "serif"); }
function isDark(){
  var c = String(css("--sheet") || "").trim(), r, g, b, k;
  if ((k = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(c))) { r = parseInt(k[1] + k[1], 16); g = parseInt(k[2] + k[2], 16); b = parseInt(k[3] + k[3], 16); }
  else if ((k = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c))) { r = parseInt(k[1], 16); g = parseInt(k[2], 16); b = parseInt(k[3], 16); }
  else if ((k = /rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(c))) { r = +k[1]; g = +k[2]; b = +k[3]; }
  else return false;
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}
// vectors
function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function unit(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
// exact numbers
function qv(q){ return q.n / q.d; }
function qParse(s){ s = String(s == null ? "" : s).trim(); if (!s) return null; var r = Q.raw(s); return r ? Q.of(r.n, r.d) : null; }
function qT(q){ return Q.txt(q); }
function MN(v){ return String(v).replace(/-/g, MINUS); }
function isOne(q){ return q.n === 1 && q.d === 1; }

// =====================================================================================================================
// @component V13 matrixMath — augmented matrices with exact entries (MV.mcv.Q): MX.of(rows) (numbers, or {n, d}), MX.apply(M, op)
// for op {t:"swap", i, j} | {t:"scale", i, k} | {t:"comb", i, a, j, b} (Rᵢ → aRᵢ + bRⱼ) | {t:"zero", i} (the illegal demo);
// opLabel(op) "R₂ → R₂ − 2R₁"; opSteps(op) the combined operation as its two allowed steps; rowSrc(row, nv) m() source of the
// equation; refInfo(M, nv) -> {ref, brk:{t:"under"|"left"|"zeroAbove", i, p, v}, contra:[rows], zeros:[rows]}; solveSys(M, nv)
// -> {kind:"one", pt} | {kind:"line", p0, d} (one free variable = t) | {kind:"plane"|"all"} | {kind:"none"}; solSrc(sol) m() source.
var MX = {
  of:function(rows){ return rows.map(function(r){ return r.map(function(v){ return typeof v === "object" ? Q.of(v.n, v.d) : Q.of(v); }); }); },
  copy:function(M){ return M.map(function(r){ return r.map(function(q){ return { n:q.n, d:q.d }; }); }); },
  apply:function(M, op){
    var N = MX.copy(M), t;
    if (op.t === "swap") { t = N[op.i]; N[op.i] = N[op.j]; N[op.j] = t; }
    else if (op.t === "scale") N[op.i] = N[op.i].map(function(q){ return Q.mul(q, op.k); });
    else if (op.t === "comb") N[op.i] = M[op.i].map(function(q, c){ return Q.add(Q.mul(op.a, q), Q.mul(op.b, M[op.j][c])); });
    else if (op.t === "zero") N[op.i] = N[op.i].map(function(){ return Q.of(0); });
    return N;
  },
  nums:function(M){ return M.map(function(r){ return r.map(qv); }); }
};
function qa(v){ return typeof v === "number" ? Q.of(v) : qParse(v); }
function decodeOp(a){
  if (a[0] === "swap") return { t:"swap", i:a[1], j:a[2] };
  if (a[0] === "scale") return { t:"scale", i:a[1], k:qa(a[2]) };
  if (a[0] === "zero") return { t:"zero", i:a[1] };
  return { t:"comb", i:a[1], a:qa(a[2]), j:a[3], b:qa(a[4]) };
}
function coefT(q){ var a = Q.abs(q); return { neg:q.n < 0, s:isOne(a) ? "" : a.d === 1 ? String(a.n) : "(" + a.n + "/" + a.d + ")" }; }
function opLabel(op){
  if (op.t === "swap") return Rn(op.i) + " ↔ " + Rn(op.j);
  if (op.t === "zero") return Rn(op.i) + " → 0" + Rn(op.i);
  if (op.t === "scale") { var c = coefT(op.k); return Rn(op.i) + " → " + (c.neg ? MINUS : "") + c.s + Rn(op.i); }
  var A = coefT(op.a), B = coefT(op.b);
  return Rn(op.i) + " → " + (A.neg ? MINUS : "") + A.s + Rn(op.i) + (B.neg ? " " + MINUS + " " : " + ") + B.s + Rn(op.j);
}
function opSteps(op){
  if (op.t !== "comb" || isOne(op.a)) return null;
  return [opLabel({ t:"scale", i:op.i, k:op.a }), opLabel({ t:"comb", i:op.i, a:Q.of(1), j:op.j, b:op.b })];
}
function rowSrc(r, nv){
  var s = "";
  for (var k = 0; k < nv; k++) {
    var q = r[k]; if (!q.n) continue;
    var a = Q.abs(q), co = isOne(a) ? "" : Q.src(a);
    s += s ? (q.n < 0 ? " - " : " + ") : (q.n < 0 ? "-" : "");
    s += co + VARS[k];
  }
  return (s || "0") + " = " + Q.src(r[nv]);
}
function leadOf(r, upto){ for (var c = 0; c < upto; c++) if (r[c].n) return c; return Infinity; }
function refInfo(M, nv){
  var leads = M.map(function(r){ return leadOf(r, nv + 1); }), info = { ref:true, brk:null, contra:[], zeros:[] };
  M.forEach(function(r, i){ if (leadOf(r, nv) === Infinity) { if (r[nv].n) info.contra.push(i); else info.zeros.push(i); } });
  for (var i = 1; i < M.length && info.ref; i++) {
    if (leads[i] === Infinity) continue;
    for (var p = 0; p < i; p++) {
      if (leads[p] === Infinity) { info.ref = false; info.brk = { t:"zeroAbove", i:i, p:p }; break; }
      if (leads[p] >= leads[i]) { info.ref = false; info.brk = { t:leads[p] === leads[i] ? "under" : "left", i:i, p:p, v:M[p][leads[p]] }; break; }
    }
  }
  return info;
}
function solveSys(M, nv){
  var A = MX.copy(M), rows = A.length, piv = [], r = 0, i, c;
  for (c = 0; c < nv && r < rows; c++) {
    var p = -1; for (i = r; i < rows; i++) if (A[i][c].n) { p = i; break; }
    if (p < 0) continue;
    var t = A[p]; A[p] = A[r]; A[r] = t;
    var inv = Q.div(Q.of(1), A[r][c]); A[r] = A[r].map(function(q){ return Q.mul(q, inv); });
    for (i = 0; i < rows; i++) if (i !== r && A[i][c].n) { var f = A[i][c], Rr = A[r]; A[i] = A[i].map(function(q, k){ return Q.sub(q, Q.mul(f, Rr[k])); }); }
    piv.push(c); r++;
  }
  for (i = r; i < rows; i++) if (A[i][nv].n) return { kind:"none" };
  if (r === nv) return { kind:"one", pt:piv.map(function(_, k){ return A[k][nv]; }) };
  var free = []; for (c = 0; c < nv; c++) if (piv.indexOf(c) < 0) free.push(c);
  if (free.length === 1) {
    var f0 = free[0], p0 = [], d = [];
    for (c = 0; c < nv; c++) { p0.push(Q.of(0)); d.push(Q.of(0)); }
    d[f0] = Q.of(1);
    piv.forEach(function(pc, k){ p0[pc] = A[k][nv]; d[pc] = Q.neg(A[k][f0]); });
    return { kind:"line", p0:p0, d:d };
  }
  return { kind:r === 0 ? "all" : "plane" };
}
function linSrc(p, q){
  var s = p.n ? Q.src(p) : "";
  if (q.n) { var a = Q.abs(q), co = isOne(a) ? "" : Q.src(a); s = s ? s + (q.n < 0 ? " - " : " + ") + co + "t" : (q.n < 0 ? "-" : "") + co + "t"; }
  return s || "0";
}
function solSrc(sol){
  if (sol.kind === "one") return "(" + sol.pt.map(Q.src).join(", ") + ")";
  if (sol.kind === "line") return "(" + sol.p0.map(function(p, k){ return linSrc(p, sol.d[k]); }).join(", ") + "), t ∈ ℝ";
  return "";
}
function satisfies(M, pt, nv){ return M.every(function(r){ var s = Q.of(0); for (var k = 0; k < nv; k++) s = Q.add(s, Q.mul(r[k], pt[k])); return Q.eq(s, r[nv]); }); }
function parallel(a, b){ for (var i = 0; i < a.length; i++) for (var j = i + 1; j < a.length; j++) if (!Q.eq(Q.mul(a[i], b[j]), Q.mul(a[j], b[i]))) return false; return true; }
// forward elimination only (row-echelon form, no scaling): used for previews
function refOf(M, nv){
  var A = MX.copy(M), r = 0;
  for (var c = 0; c < nv && r < A.length; c++) {
    var p = -1; for (var i = r; i < A.length; i++) if (A[i][c].n) { p = i; break; }
    if (p < 0) continue;
    var t = A[p]; A[p] = A[r]; A[r] = t;
    for (i = r + 1; i < A.length; i++) if (A[i][c].n) { var f = Q.div(A[i][c], A[r][c]), Rr = A[r]; A[i] = A[i].map(function(q, k){ return Q.sub(q, Q.mul(f, Rr[k])); }); }
    r++;
  }
  return A;
}
// augmented matrix HTML (entries may be Q or numbers); fl = rows to flash
function cellT(q){ return typeof q === "object" ? qT(q) : MN(q); }
function matSaid(M, nv){ return "matrix " + M.map(function(r){ return "[" + r.slice(0, nv).map(cellT).join(" ") + " | " + cellT(r[nv]) + "]"; }).join(", "); }
function matHTML(M, nv, fl, cls){
  var flc = MV.reduceMotion ? "sy-ol" : "sy-fl";
  return '<span class="sy-mx c' + (nv + 1) + (cls ? " " + cls : "") + '"><span class="vh">' + matSaid(M, nv) + '</span><span class="sy-mxg" aria-hidden="true">' +
    M.map(function(r, i){ var f = fl && fl.indexOf(i) >= 0; return r.map(function(q, j){ var c = (j === nv ? "sy-b" : "") + (f ? " " + flc : ""); c = c.trim(); return "<span" + (c ? ' class="' + c + '"' : "") + ">" + cellT(q) + "</span>"; }).join(""); }).join("") + "</span></span>";
}

// =====================================================================================================================
// @component V1 view3d — orthographic 3D view (course plan V1) on a canvas, sized, themed and redrawn by MV.Plot. Drag or arrow
// keys turn it (Shift for big steps; touch drags turn it sideways and let the page scroll); presets Isometric, Front (xz),
// Side (yz), Top (xy) through view3d.presets(host, v, labels). Draws the axes (negative halves dashed, letters at the positive
// ends), planes clipped to the box ±L as translucent polygons in their row colour (fill 14% light / 18% dark, edge 60%, a row
// label at one corner), lines clipped to the box (glow: a --hi band under an --ink core; part grows them out from p) and points
// (--hi with an --ink outline). scene() -> {L, planes:[{n, d, color, label, alpha}], lines:[{p, d, glow, part}],
// points:[{p, label}], describe}. -> {render(), set(th, ph)}
function clipPlane(n, d, L){
  var pts = [], V = [-L, L], k, i, j, U = [];
  for (k = 0; k < 3; k++) {
    var a = (k + 1) % 3, b = (k + 2) % 3;
    if (Math.abs(n[k]) < 1e-12) continue;
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) {
      var t = (d - n[a] * V[i] - n[b] * V[j]) / n[k];
      if (t < -L - 1e-9 || t > L + 1e-9) continue;
      var p = [0, 0, 0]; p[k] = t; p[a] = V[i]; p[b] = V[j]; pts.push(p);
    }
  }
  pts.forEach(function(p){ if (!U.some(function(q){ return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-7; })) U.push(p); });
  if (U.length < 3) return [];
  var c = [0, 0, 0]; U.forEach(function(p){ c[0] += p[0] / U.length; c[1] += p[1] / U.length; c[2] += p[2] / U.length; });
  var N = unit(n), e1 = unit(Math.abs(N[0]) < 0.9 ? cross(N, [1, 0, 0]) : cross(N, [0, 1, 0])), e2 = cross(N, e1);
  function ang(p){ var v = sub(p, c); return Math.atan2(dot(v, e2), dot(v, e1)); }
  return U.sort(function(p, q){ return ang(p) - ang(q); });
}
function clipLine(p, d, L){
  var t0 = -Infinity, t1 = Infinity;
  for (var k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-12) { if (Math.abs(p[k]) > L + 1e-9) return null; continue; }
    var a = (-L - p[k]) / d[k], b = (L - p[k]) / d[k]; if (a > b) { var t = a; a = b; b = t; }
    t0 = Math.max(t0, a); t1 = Math.min(t1, b);
  }
  return t0 <= t1 ? [t0, t1] : null;
}
var V3PRE = { iso:[45, 35.26], front:[-90, 0], side:[0, 0], top:[-90, 90] };
function view3d(canvas, scene, o){
  o = o || {};
  var cam = { th:o.th != null ? o.th : 32, ph:o.ph != null ? o.ph : 22 }, P = new MV.Plot(canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  function paint(ctx, pl, sc){
    var L = sc.L || 5, W = pl.W, H = pl.H, th = cam.th * Math.PI / 180, ph = cam.ph * Math.PI / 180;
    var R = [-Math.sin(th), Math.cos(th), 0], U = [-Math.sin(ph) * Math.cos(th), -Math.sin(ph) * Math.sin(th), Math.cos(ph)];
    var s = Math.min(W, H) / (2 * L * 1.62), cx = W / 2, cy = H / 2;
    function pj(p){ return [cx + s * dot(p, R), cy - s * dot(p, U)]; }
    var dark = isDark(), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), O = pj([0, 0, 0]);
    function tag(x, y, text, col, al){
      ctx.font = ui(13, 700); var w = ctx.measureText(text).width + 8;
      var x0 = al === "right" ? x - w : al === "center" ? x - w / 2 : x;
      ctx.globalAlpha = 0.88; ctx.fillStyle = sheet; ctx.fillRect(x0, y - 10, w, 20); ctx.globalAlpha = 1;
      ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x0 + 4, y + 0.5);
    }
    ctx.save();
    // axes
    ctx.lineWidth = 1.5; ctx.strokeStyle = ink2;
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function(e, k){
      var pos = pj([e[0] * L, e[1] * L, e[2] * L]), neg = pj([-e[0] * L, -e[1] * L, -e[2] * L]);
      ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(pos[0], pos[1]); ctx.stroke();
      ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(neg[0], neg[1]); ctx.stroke();
      var dx = pos[0] - O[0], dy = pos[1] - O[1], len = Math.hypot(dx, dy);
      if (len > 8) { ctx.setLineDash([]); ctx.fillStyle = ink2; ctx.font = mfont(16); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(VARS[k], pos[0] + dx / len * 12, pos[1] + dy / len * 12); }
    });
    ctx.setLineDash([]);
    // planes
    var DIRS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    (sc.planes || []).forEach(function(q, idx){
      var poly = clipPlane(q.n, q.d, L); if (poly.length < 3) return;
      var al = q.alpha == null ? 1 : q.alpha; if (al <= 0.01) return;
      var col = css(q.color), S2 = poly.map(pj);
      ctx.beginPath(); S2.forEach(function(p, i){ if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
      ctx.globalAlpha = (dark ? 0.18 : 0.14) * al; ctx.fillStyle = col; ctx.fill();
      ctx.globalAlpha = 0.6 * al; ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
      if (q.label && al > 0.5) {
        var D = DIRS[idx % 4], best = S2[0], bv = -Infinity, mx0 = 0, my0 = 0;
        S2.forEach(function(p){ mx0 += p[0] / S2.length; my0 += p[1] / S2.length; var v = D[0] * p[0] + D[1] * p[1]; if (v > bv) { bv = v; best = p; } });
        var lx = best[0] + (mx0 - best[0]) * 0.14, ly = best[1] + (my0 - best[1]) * 0.14;
        tag(clamp(lx, 4, W - 34), clamp(ly, 12, H - 12), q.label, col, "center");
      }
    });
    // lines
    (sc.lines || []).forEach(function(ln){
      var tt = clipLine(ln.p, ln.d, L); if (!tt) return;
      var part = ln.part == null ? 1 : ln.part; if (part <= 0) return;
      var a = pj([ln.p[0] + ln.d[0] * tt[0] * part, ln.p[1] + ln.d[1] * tt[0] * part, ln.p[2] + ln.d[2] * tt[0] * part]);
      var b = pj([ln.p[0] + ln.d[0] * tt[1] * part, ln.p[1] + ln.d[1] * tt[1] * part, ln.p[2] + ln.d[2] * tt[1] * part]);
      if (ln.glow) { ctx.globalAlpha = 0.9; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.globalAlpha = 1; }
      ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    });
    // points
    (sc.points || []).forEach(function(pt){
      var q = pj(pt.p);
      ctx.beginPath(); ctx.arc(q[0], q[1], 6.5, 0, 2 * Math.PI); ctx.fillStyle = css("--hi"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
      if (pt.label) { var right = q[0] > W - 150; tag(right ? q[0] - 12 : q[0] + 12, q[1] - 16, pt.label, ink, right ? "right" : "left"); }
    });
    ctx.restore();
  }
  P.render = function(){ var sc = scene(); P.draw({ grid:false, axes:false, ticks:false, after:function(ctx, pl){ paint(ctx, pl, sc); }, describe:sc.describe }); };
  canvas.tabIndex = 0;
  var drag = null;
  canvas.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, th:cam.th, ph:cam.ph }; try { canvas.setPointerCapture(e.pointerId); } catch (err) {} });
  canvas.addEventListener("pointermove", function(e){ if (!drag) return; cam.th = drag.th - (e.clientX - drag.x) * 0.5; cam.ph = clamp(drag.ph + (e.clientY - drag.y) * 0.5, -89, 90); P.render(); });
  function end(){ drag = null; }
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
  canvas.addEventListener("keydown", function(e){
    var st = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") cam.th += st; else if (e.key === "ArrowRight") cam.th -= st;
    else if (e.key === "ArrowUp") cam.ph = clamp(cam.ph + st, -89, 90); else if (e.key === "ArrowDown") cam.ph = clamp(cam.ph - st, -89, 90);
    else return;
    e.preventDefault(); P.render();
  });
  P.render();
  return { render:function(){ P.render(); }, set:function(th, ph){ cam.th = th; cam.ph = ph; P.render(); } };
}
view3d.presets = function(host, v, G){
  host.innerHTML = '<span class="seg sy-views" role="group" aria-label="' + MV.esc(MV.plain(G.views)) + '">' + ["iso", "front", "side", "top"].map(function(k){
    return '<button type="button" data-v3="' + k + '">' + G[k] + "</button>"; }).join("") + "</span>";
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-v3]"); if (!b) return; var p = V3PRE[b.dataset.v3]; v.set(p[0], p[1]); });
};

// 2D graph of rows a x + b y = c (S1, Station 3): lines in the row colours, labelled R₁ and R₂, with an optional point
function draw2d(P, o){
  var V = o.view || { xmin:-3, xmax:7, ymin:-2.5, ymax:6 }, curves = [], segs = [], labels = [], pts = [];
  o.rows.forEach(function(r, i){
    var a = r[0], b = r[1], c = r[2]; if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) return;
    var col = css(o.colors ? o.colors[i] : ROWC[i]), w = o.widths ? o.widths[i] : 3, dash = o.dash && o.dash[i] ? [9, 7] : null;
    if (Math.abs(b) > 1e-12) {
      curves.push({ f:function(x){ return (c - a * x) / b; }, color:col, width:w, dash:dash });
      var lx = null;
      for (var x = V.xmax - 0.6; x > V.xmin; x -= 0.25) { var y = (c - a * x) / b; if (y > V.ymin + 0.5 && y < V.ymax - 0.5) { lx = x; break; } }
      if (lx != null) labels.push({ x:lx, y:(c - a * lx) / b, text:o.labels ? o.labels[i] : Rn(i), color:col, dy:i ? 16 : -16, align:"right", bg:true });
    } else {
      segs.push({ x1:c / a, y1:V.ymin - 1, x2:c / a, y2:V.ymax + 1, color:col, width:w, dash:dash });
      labels.push({ x:c / a, y:V.ymax - 0.6, text:o.labels ? o.labels[i] : Rn(i), color:col, dx:8, align:"left", bg:true });
    }
  });
  if (o.point) pts.push({ x:o.point[0], y:o.point[1], r:6, color:css("--ink"), label:o.pointLabel });
  P.draw({ view:V, equal:true, xTicks:{ step:1 }, yTicks:{ step:1 }, xLabel:"x", yLabel:"y", curves:curves, segments:segs, labels:labels, points:pts, describe:o.describe });
}

// =====================================================================================================================
// @component V13 matrixStepper — the row-reduction stepper (course plan V13): the augmented matrix (row labels R₁…, the
// changed row flashes, or is outlined with reduced motion) with the system written as equations under it; a Row operation
// chooser (Swap / Scale / Scale and add) whose controls are native selects for rows and multipliers (k from −3 to 3 with
// ±1/2, ±1/3; 0 sits on a separate aria-disabled button that explains why it isn't allowed, with an optional "Try it
// anyway" demo); Apply, Undo (also Ctrl/⌘+Z) and a History list that shows the combined Rᵢ → aRᵢ + bRⱼ as its two allowed
// steps. stepper(host, {st (persisted: {M, h:[{op, prev}], ui}), rows0, nv, C (content ops strings), uid, save(),
// busy(), onOp(op, before, after), onUndo(op, before, after), onZero(i)}) -> {M(), apply(op, silent), paint(), lock(bool)}
var KS = ["-3", "-2", "-1", "-1/2", "-1/3", "1/3", "1/2", "2", "3"], AS = ["-3", "-2", "-1", "-1/2", "-1/3", "1/3", "1/2", "1", "2", "3"];
function stepper(host, o){
  var st = o.st, C = o.C, nv = o.nv, n = o.rows0.length, uid = o.uid || "st", flash = null, locked = false, msg = "", tryI = null, live = "";
  if (!st.M) { st.M = MX.of(o.rows0); st.h = []; }
  st.M = MX.of(st.M); st.h = st.h || [];
  st.ui = st.ui || { t:"comb", i:Math.min(1, n - 1), j:0, k:"2", a:"1", b:"-1" };
  host.innerHTML = '<div class="sy-st"><div class="sy-mwrap"><div class="sy-mbig" data-r="mat"></div><div class="sy-eqs" data-r="eqs"></div><p class="vh" data-r="live" aria-live="polite"></p></div>' +
    '<div class="sy-ops"><div data-r="seg"></div><div class="sy-opc" data-r="opc"></div><div class="sy-opmsg" data-r="msg" aria-live="polite"></div>' +
    '<div class="sy-urow"><button type="button" class="btn ghost sm" data-r="undo" data-k="' + uid + 'undo" aria-keyshortcuts="Control+Z Meta+Z" title="' + MV.esc(C.undoKey) + '">' + C.undo + "</button></div>" +
    '<details class="sy-hist"><summary>' + C.history + ' <span class="tiny muted" data-r="hn"></span></summary><ol data-r="hl"></ol></details></div></div>';
  function el(r){ return host.querySelector('[data-r="' + r + '"]'); }
  var seg = MV.seg(el("seg"), { label:C.label, options:[{ id:"swap", t:C.swap }, { id:"scale", t:C.scale }, { id:"comb", t:C.comb }], value:st.ui.t,
    onChange:function(v){ st.ui.t = v; msg = ""; tryI = null; o.save(); paintOps(); paintMsg(); } });
  function rowOpts(v){ var h = ""; for (var i = 0; i < n; i++) h += '<option value="' + i + '"' + (i === +v ? " selected" : "") + ">" + Rn(i) + "</option>"; return h; }
  function qOpts(list, v){ return list.map(function(s){ return '<option value="' + s + '"' + (s === v ? " selected" : "") + ">" + MN(s) + "</option>"; }).join(""); }
  function sel(name, inner, label){ return '<select class="sy-sel" data-s="' + name + '" data-k="' + uid + "s" + name + '" aria-label="' + MV.esc(label) + '">' + inner + "</select>"; }
  function paintOps(){
    var u = st.ui, h = "", ri = '<span class="sy-ri" data-r="ri">' + Rn(+u.i) + "</span>";
    if (u.t === "swap") h = sel("i", rowOpts(u.i), "First row") + '<span class="sy-sym">↔</span>' + sel("j", rowOpts(u.j), "Second row");
    else if (u.t === "scale") h = sel("i", rowOpts(u.i), "Row to scale") + '<span class="sy-sym">→</span>' + sel("k", qOpts(KS, u.k), "Multiplier k") + ri;
    else h = sel("i", rowOpts(u.i), "Row to replace, Ri") + '<span class="sy-sym">→</span>' + sel("a", qOpts(AS, u.a), "Multiplier a of Ri (not 0)") + ri +
      '<span class="sy-sym">+</span>' + sel("b", qOpts(AS, u.b), "Multiplier b of Rj") + sel("j", rowOpts(u.j), "Row to add, Rj");
    h += '<button type="button" class="btn primary sm" data-r="apply" data-k="' + uid + 'apply"' + (locked ? " disabled" : "") + ">" + C.apply + "</button>";
    if (u.t === "scale") h += '<button type="button" class="btn ghost sm sy-zero" data-r="zero" data-k="' + uid + 'zero" aria-disabled="true" title="' + MV.esc(C.zeroTip) + '">0' + Rn(+u.i) + '<span class="vh"> (not allowed)</span></button>';
    if (u.t === "comb") h += '<p class="tiny muted sy-cnote">' + C.combNote + "</p>";
    MV.keepFocus(el("opc"), function(){ el("opc").innerHTML = h; });
  }
  function paintMsg(){
    var h = msg ? '<p class="fb bad sy-zmsg">' + msg + "</p>" : "";
    if (tryI != null && o.onZero) h += '<button type="button" class="btn ghost sm" data-r="try" data-k="' + uid + 'try">' + C.tryIt + "</button>";
    MV.keepFocus(el("msg"), function(){ el("msg").innerHTML = h; });
  }
  function paint(){
    var M = st.M;
    el("mat").innerHTML = '<span class="sy-rls" aria-hidden="true">' + M.map(function(_, i){ return "<span>" + Rn(i) + "</span>"; }).join("") + "</span>" + matHTML(M, nv, flash, "big");
    el("eqs").innerHTML = M.map(function(r, i){ return '<span class="sy-eq"><span class="sy-eqn" style="--c:var(' + ROWC[i] + ')">' + Rn(i) + "</span> " + m(rowSrc(r, nv)) + "</span>"; }).join("");
    el("live").textContent = live;
    var H = st.h;
    el("hn").textContent = H.length ? "(" + H.length + ")" : "";
    el("hl").innerHTML = H.length ? H.map(function(e){ var two = opSteps(e.op); return "<li>" + opLabel(e.op) + (two ? ' <span class="tiny muted">(' + tpl(C.twoSteps, { a:two[0], b:two[1] }) + ")</span>" : "") + "</li>"; }).join("") : '<li class="muted">' + C.none + "</li>";
    var ub = el("undo"); ub.disabled = locked || !H.length;
    flash = null;
  }
  function apply(op, silent){
    var before = st.M, after = MX.apply(before, op);
    st.h.push({ op:op, prev:before }); st.M = after; msg = ""; tryI = null;
    flash = op.t === "swap" ? [op.i, op.j] : [op.i];
    live = opLabel(op) + ". " + (op.t === "swap" ? "" : "Row " + (op.i + 1) + " is now " + matSaid([after[op.i]], nv).replace("matrix ", "") + ".");
    o.save(); paint(); paintMsg();
    if (!silent && o.onOp) o.onOp(op, before, after);
  }
  function undo(){
    if (locked || (o.busy && o.busy()) || !st.h.length) return;
    var e = st.h.pop(), before = st.M; st.M = MX.of(e.prev); msg = ""; tryI = null;
    flash = e.op.t === "swap" ? [e.op.i, e.op.j] : [e.op.i]; live = "Undid " + opLabel(e.op) + ".";
    o.save(); paint(); paintMsg();
    if (o.onUndo) o.onUndo(e.op, before, st.M);
  }
  host.addEventListener("change", function(e){
    var s = e.target.dataset && e.target.dataset.s; if (!s) return;
    st.ui[s] = (s === "i" || s === "j") ? +e.target.value : e.target.value; o.save();
    if (s === "i") { var ri = el("ri"); if (ri) ri.textContent = Rn(+st.ui.i); var z = el("zero"); if (z) z.innerHTML = "0" + Rn(+st.ui.i) + '<span class="vh"> (not allowed)</span>'; }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var r = b.dataset.r;
    if (r === "undo") { undo(); return; }
    if (r === "zero") { msg = C.zeroMsg; tryI = +st.ui.i; paintMsg(); return; }
    if (r === "try") { var i = tryI; if (o.onZero && !(o.busy && o.busy())) o.onZero(i); return; }
    if (r !== "apply" || locked || (o.busy && o.busy())) return;
    var u = st.ui, op;
    if ((u.t === "swap" || u.t === "comb") && +u.i === +u.j) { msg = C.sameRow; tryI = null; paintMsg(); return; }
    if (u.t === "swap") op = { t:"swap", i:+u.i, j:+u.j };
    else if (u.t === "scale") op = { t:"scale", i:+u.i, k:qParse(u.k) };
    else op = { t:"comb", i:+u.i, a:qParse(u.a), j:+u.j, b:qParse(u.b) };
    apply(op);
  });
  host.addEventListener("keydown", function(e){
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && String(e.key).toLowerCase() === "z" && !(e.target.matches && e.target.matches("input, textarea"))) { e.preventDefault(); undo(); }
  });
  paintOps(); paint(); paintMsg();
  return {
    M:function(){ return st.M; }, apply:apply, paint:paint, seg:seg,
    lock:function(v){ locked = !!v; paintOps(); var ub = el("undo"); ub.disabled = locked || !st.h.length; }
  };
}

// =====================================================================================================================
// @component V8 solEntry — a linear system's solution typed into boxes (course plan V8/N4 coefficient boxes; no free algebra):
// chips One solution / No solution / Infinitely many, then value boxes (x, y, z, or bottom-up z, y, x for back-substitution) or
// parameter boxes "x = □ + □t" (blank = 0). solEntry(host, {st:{k, v, p}, nv, order:"up"|"down", C:{kinds, param, noneNote},
// uid, save(), onChange()}) -> {paint}. judgeSol(entry, M, nv, sol, T, wrongs) -> {ok} | {ok:false, msg} | {err}: exact (Q)
// checks; a parameter form passes when its point satisfies every row and its direction is parallel to the solution line's.
function solEntry(host, o){
  var st = o.st, nv = o.nv, names = VARS.slice(0, nv), ord = o.order === "up" ? names.slice().reverse() : names, uid = o.uid || "se";
  st.v = st.v || {}; st.p = st.p || {};
  function box(key, val, label){ return '<input class="numin short" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-se="' + key + '" data-k="' + uid + key + '" aria-label="' + MV.esc(label) + '" value="' + MV.esc(val || "") + '">'; }
  function paint(){
    MV.keepFocus(host, function(){
      var h = '<div class="chips sy-kinds" role="group" aria-label="How many solutions?">' + ["one", "none", "inf"].map(function(k){
        return '<button type="button" class="chip" data-sek="' + k + '" data-k="' + uid + "k" + k + '" aria-pressed="' + (st.k === k) + '">' + o.C.kinds[k] + "</button>"; }).join("") + "</div>";
      if (st.k === "one") h += '<div class="sy-vals">' + ord.map(function(v){ return '<label class="sy-val">' + m(v + " =") + box("v" + v, st.v[v], v + " =") + "</label>"; }).join("") + "</div>";
      else if (st.k === "inf") h += '<p class="tiny muted">' + o.C.param + '</p><div class="sy-pars">' + names.map(function(v){
        return '<div class="sy-par">' + m(v + " =") + box("p" + v + "0", st.p[v + "0"], v + " equals: the number") + '<span class="m">+</span>' + box("p" + v + "1", st.p[v + "1"], v + " equals: the coefficient of t") + m("t") + "</div>"; }).join("") + "</div>";
      else if (st.k === "none") h += '<p class="tiny muted">' + o.C.noneNote + "</p>";
      host.innerHTML = h;
    });
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-sek]"); if (!b) return; st.k = b.dataset.sek; o.save(); paint(); if (o.onChange) o.onChange(); });
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.se; if (!k) return; if (k[0] === "v") st.v[k.slice(1)] = e.target.value; else st.p[k.slice(1)] = e.target.value; o.save(); if (o.onChange) o.onChange(); });
  paint();
  return { paint:paint };
}
function namedWrong(e, pt, W){
  if (!W) return null;
  for (var i = 0; i < W.length; i++) {
    var w = W[i];
    if (w.pt) { if (pt.length === w.pt.length && pt.every(function(q, k){ return q && Q.eq(q, Q.of(w.pt[k])); })) return w.fb; continue; }
    var keys = VARS.filter(function(v){ return w[v] != null; });
    if (keys.length && keys.every(function(v){ var q = qParse(e.v[v]), t = qParse(w[v]); return q && t && Q.eq(q, t); })) return w.fb;
  }
  return null;
}
function judgeSol(e, M, nv, sol, T, W){
  var names = VARS.slice(0, nv), bad = false;
  if (!e.k) return { err:T.pick };
  if (e.k === "one") {
    var pt = names.map(function(v){ var q = qParse(e.v[v]); if (!q) bad = true; return q; });
    var w = namedWrong(e, pt, W); if (w) return { ok:false, msg:w };
    if (bad) return { err:T.num };
    if (sol.kind === "one") {
      if (pt.every(function(q, k){ return Q.eq(q, sol.pt[k]); })) return { ok:true };
      var rv = pt.slice().reverse();
      if (rv.every(function(q, k){ return Q.eq(q, sol.pt[k]); })) return { ok:false, msg:nv === 3 ? T.rev3 : T.rev2 };
      return { ok:false, msg:T.oneWrong };
    }
    if (sol.kind === "none") return { ok:false, msg:T.isNone };
    return { ok:false, msg:satisfies(M, pt, nv) ? T.onePoint : T.isInf };
  }
  if (e.k === "none") return sol.kind === "none" ? { ok:true } : { ok:false, msg:T.hasSol };
  if (sol.kind === "none") return { ok:false, msg:T.infNone };
  if (sol.kind === "one") return { ok:false, msg:T.infButOne };
  if (sol.kind !== "line") return { ok:false, msg:T.twoParams };
  var p0 = [], d = [], any = false;
  names.forEach(function(v){ [0, 1].forEach(function(j){ var s = String(e.p[v + j] == null ? "" : e.p[v + j]).trim(); if (s) any = true; var q = s ? qParse(s) : Q.of(0); if (!q) bad = true; (j ? d : p0).push(q); }); });
  if (!any || bad) return { err:T.num };
  if (d.every(function(q){ return !q.n; })) return { ok:false, msg:T.noT };
  if (satisfies(M, p0, nv) && parallel(d, sol.d)) return { ok:true };
  return { ok:false, msg:T.infWrong };
}

// =====================================================================================================================
// ---------- Hero: equations collapse into a matrix; four row operations; back-substitution from the bottom ----------
function hero(){
  var hl = $("#sy-hl"), cv = $("#sy-hc"), cap = $("#sy-hcap"); if (!hl || !cv) return;
  var E = [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]], OPS = [["comb", 1, 1, 0, -2], ["comb", 2, 1, 0, -1], ["swap", 1, 2], ["comb", 2, 1, 1, 3]].map(decodeOp);
  var st = { M:MX.of(E), tw:null, mode:"eq", lab:"", fl:null, back:0, moved:false };
  var v = view3d(cv, function(){
    var R = MX.nums(st.M); if (st.tw) R[st.tw.i] = st.tw.row;
    return { L:5, planes:R.map(function(r, i){ return { n:r.slice(0, 3), d:r[3], color:ROWC[i], label:Rn(i) }; }),
      points:[{ p:[1, 2, 3], label:"(1, 2, 3)" + (st.moved ? " unchanged" : "") }],
      describe:"Three planes, " + st.M.map(function(r, i){ return Rn(i) + ": " + MV.plain(m(rowSrc(r, 3))); }).join(", ") + ", meeting at the point (1, 2, 3)." };
  }, { th:32, ph:20 });
  function paintL(){
    if (st.mode === "eq") { hl.innerHTML = '<div class="sy-hsys sy-fade">' + st.M.map(function(r){ return "<span>" + m(rowSrc(r, 3)) + "</span>"; }).join("") + "</div>"; return; }
    var bs = ["z = 3", "y = 2", "x = 1"].slice(0, st.back).map(function(s){ return '<span class="sy-fade">' + m(s) + "</span>"; }).join("");
    if (st.mode === "both") hl.innerHTML = '<div class="sy-hboth">' + matHTML(MX.of(E), 3) + '<span class="sy-harr">⟶</span>' + matHTML(st.M, 3) + "</div>" + '<p class="sy-hbs">' + bs + "</p>";
    else hl.innerHTML = '<p class="sy-hop">' + (st.lab ? '<span class="sy-fade">' + st.lab + "</span>" : "&nbsp;") + "</p>" + matHTML(st.M, 3, st.fl, "big") + '<p class="sy-hbs">' + bs + "</p>";
  }
  function finish(){
    st.mode = MV.reduceMotion ? "both" : "mat"; st.M = MX.of([[1, 1, 1, 6], [0, 1, -2, -4], [0, 0, -7, -21]]); st.tw = null; st.back = 3; st.moved = true; st.lab = ""; st.fl = null;
    paintL(); v.render();
    if (cap) cap.innerHTML = "Each row operation moved a plane, but the three planes still meet at (1, 2, 3). The last row, [0 0 −7 | −21], gives " + m("z = 3") + ", then " + m("y = 2") + " and " + m("x = 1") + ".";
  }
  if (MV.reduceMotion) { finish(); return; }
  paintL(); v.render();
  var k = 0;
  function nextOp(){
    if (k >= OPS.length) { st.lab = ""; paintL(); backStep(); return; }
    var op = OPS[k++], before = st.M; st.lab = opLabel(op); st.M = MX.apply(before, op); st.fl = op.t === "swap" ? [op.i, op.j] : [op.i]; st.moved = true;
    if (op.t === "comb") {
      var bi = before[op.i].map(qv), bj = before[op.j].map(qv), f = qv(op.b) / qv(op.a);
      st.tw = { i:op.i, row:bi }; paintL();
      MV.tween({ dur:1100, step:function(t){ st.tw.row = bi.map(function(x, c){ return x + t * f * bj[c]; }); v.render(); }, done:function(){ st.tw = null; v.render(); MV.wait(900, nextOp); } });
    } else { paintL(); v.render(); MV.wait(1500, nextOp); }
  }
  function backStep(){ if (st.back >= 3) { MV.wait(600, finish); return; } st.back++; paintL(); MV.wait(700, backStep); }
  MV.wait(1300, function(){ st.mode = "mat"; paintL(); MV.wait(1100, nextOp); });
}

// =====================================================================================================================
// ---------- Explore: row-reduction stepper (V13 linked to V1 / a 2D graph) ----------
function explore(host, api){
  var S = api.S, C = api.content, SY = {};
  C.systems.forEach(function(s){ SY[s.id] = s; });
  if (!SY[S.sys]) S.sys = "S2";
  S.st = S.st || {}; S.bs = S.bs || {}; S.ok = S.ok || {};
  if (S.geo == null) S.geo = true;
  if (!S.build) S.build = [[1, 1, 1, 3], [1, -1, 3, 1], [2, 0, 0, 0]];
  var busy = false, pv = null, tw = null, anim = null, stp = null, sol0 = null, bsMsg = null, v3 = null, p2 = null;
  host.innerHTML = '<div class="sy-ex" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="chips sy-sys" id="sy-sys" role="group" aria-label="Choose a system"></div><div id="sy-build"></div>' +
    '<div class="sy-cols"><div class="sy-left" id="sy-step"></div><div class="sy-right">' +
    '<div class="sy-geobar"><label class="sy-tog"><input type="checkbox" id="sy-geo"> ' + C.geo.show + '</label><span id="sy-views"></span></div>' +
    '<div id="sy-g3"><canvas class="sy-c3" id="sy-c3" role="img" aria-label="3D view of the planes"></canvas><p class="tiny muted sy-ghow">' + C.geo.how + "</p></div>" +
    '<div id="sy-g2"><div class="plot-wrap"><canvas class="plot" id="sy-c2" role="img" aria-label="Graph of the two lines"></canvas></div></div>' +
    '<p class="eq-cap sy-gcap" id="sy-gcap" aria-live="polite"></p>' +
    '<dl class="read sy-read" id="sy-read"></dl><div class="sy-bs" id="sy-bs"></div></div></div></div>';
  function rows0(id){ return id === "B" ? S.build : SY[id].rows; }
  function nv(){ return rows0(S.sys)[0].length - 1; }
  function changed(){ var s = S.st[S.sys]; return !!(s && s.h && s.h.length); }
  // ---- geometry ----
  function curRows(){
    if (pv && pv.orig) return rows0(S.sys).map(function(r){ return r.slice(); });
    var R = MX.nums(stp.M()); if (tw) R[tw.i] = tw.row; return R;
  }
  function exactRows(){ return pv && pv.orig ? MX.of(rows0(S.sys)) : stp.M(); }
  function interPlain(sol){
    var I = C.inter;
    if (sol.kind === "one") return tpl(I.point, { p:MV.plain(m(solSrc(sol))) });
    return sol.kind === "line" ? I.line : sol.kind === "plane" ? I.plane : sol.kind === "all" ? I.all : I.none;
  }
  function capText(){
    if (pv && pv.note) return pv.note;
    var K = C.cap, n = nv(), s;
    if (sol0.kind === "one") s = tpl(n === 3 ? K.one3 : K.one2, { p:m(solSrc(sol0)) });
    else if (sol0.kind === "line") s = n === 3 ? K.line3 : K.line2;
    else if (sol0.kind === "none") s = n === 3 ? K.none3 : K.none2;
    else s = sol0.kind === "plane" ? K.plane : K.all;
    var flat = refInfo(stp.M(), n); flat = flat.contra.concat(flat.zeros).sort();
    if (flat.length) s += " " + tpl(K.flat, { r:flat.map(Rn).join(", ") });
    return s + (changed() ? K.same : "");
  }
  function scene3(){
    if (!stp || nv() !== 3) return { L:5, describe:"3D view (not used for a 2 × 2 system)" };
    var R = curRows(), planes = [], lines = [], pts = [], L = 5, dm = pv && pv.demo;
    if (sol0.kind === "one") L = clamp(Math.ceil(Math.max.apply(null, sol0.pt.map(function(q){ return Math.abs(qv(q)); }))) + 2, 5, 10);
    R.forEach(function(r, i){ if (Math.hypot(r[0], r[1], r[2]) < 1e-9) return; planes.push({ n:r.slice(0, 3), d:r[3], color:ROWC[i], label:Rn(i), alpha:dm && dm.i === i ? dm.alpha : 1 }); });
    if (sol0.kind === "one") pts.push({ p:sol0.pt.map(qv), label:MV.plain(m(solSrc(sol0))) + (changed() || dm ? " " + C.geo.unchanged : "") });
    else if (sol0.kind === "line") lines.push({ p:sol0.p0.map(qv), d:sol0.d.map(qv), glow:true });
    if (dm && dm.grow > 0 && dm.sol.kind === "line") { lines.push({ p:sol0.kind === "one" ? sol0.pt.map(qv) : dm.sol.p0.map(qv), d:dm.sol.d.map(qv), glow:true, part:dm.grow }); if (pts[0]) pts[0].label = ""; }
    var desc = "3D view. " + exactRows().map(function(r, i){ return Rn(i) + ": " + MV.plain(m(rowSrc(r, 3))) + (leadOf(r, 3) === Infinity ? " (no plane)" : ""); }).join("; ") + ". " + MV.plain(capText());
    return { L:L, planes:planes, lines:lines, points:pts, describe:desc };
  }
  function draw2(){
    var R = curRows(), dm = pv && pv.demo, rows = R.map(function(r, i){ return dm && dm.i === i && dm.alpha < 0.5 ? [0, 0, 0] : r; });
    draw2d(p2, { rows:rows, point:sol0.kind === "one" ? sol0.pt.map(qv) : null, pointLabel:sol0.kind === "one" ? MV.plain(m(solSrc(sol0))) + (changed() ? " " + C.geo.unchanged : "") : "",
      describe:"Graph. " + exactRows().map(function(r, i){ return Rn(i) + ": " + MV.plain(m(rowSrc(r, 2))); }).join("; ") + ". " + MV.plain(capText()) });
  }
  function drawGeo(){
    var n = nv();
    $("#sy-g3", host).hidden = !(S.geo && n === 3); $("#sy-g2", host).hidden = !(S.geo && n === 2); $("#sy-views", host).hidden = !(S.geo && n === 3);
    $("#sy-gcap", host).innerHTML = capText();
    if (S.geo && n === 3) v3.render(); else if (S.geo) p2.render();
  }
  function tweenRow(op, before, dur, done){
    if (anim) { anim(); anim = null; }
    var bi = before[op.i].map(qv), bj = before[op.j].map(qv), f = qv(op.b) / qv(op.a);
    tw = { i:op.i, row:bi.slice() };
    anim = MV.tween({ dur:dur, step:function(t){ if (!tw) return; tw.row = bi.map(function(x, c){ return x + t * f * bj[c]; }); drawGeo(); }, done:function(){ anim = null; tw = null; drawGeo(); if (done) done(); } });
  }
  function demo(i, dur, done){
    if (anim) { anim(); anim = null; } tw = null;
    var Z = MX.apply(stp.M(), { t:"zero", i:i }), solD = solveSys(Z, nv());
    pv = { demo:{ i:i, alpha:1, grow:0, sol:solD } };
    if (!S.geo) { S.geo = true; $("#sy-geo", host).checked = true; }
    anim = MV.tween({ dur:dur / 2, step:function(t){ if (pv && pv.demo) { pv.demo.alpha = 1 - t; drawGeo(); } }, done:function(){
      anim = MV.tween({ dur:dur / 2, step:function(t){ if (pv && pv.demo) { pv.demo.grow = t; drawGeo(); } }, done:function(){ anim = null; if (done) done(solD); } });
    } });
  }
  // ---- readout ----
  function paintRead(){
    var M = stp.M(), n = nv(), info = refInfo(M, n), H = S.st[S.sys].h || [], b = info.brk, ok = S.ok[S.sys];
    $("#sy-read", host).innerHTML = MV.readoutHTML([
      [C.rows.last, H.length ? opLabel(H[H.length - 1].op) : C.ops.none],
      [C.rows.ref, info.ref ? C.ref.yes : tpl(C.ref[b.t], { i:b.i + 1, p:b.p + 1, v:b.v ? qT(b.v) : "" })],
      [C.rows.contra, info.contra.length ? info.contra.map(function(i){ return tpl(C.contra.row, { i:i + 1, c:qT(M[i][n]) }); }).join("; ") : C.contra.none],
      [C.rows.zero, info.zeros.length ? info.zeros.map(function(i){ return tpl(C.zeros.row, { i:i + 1 }); }).join("; ") : C.zeros.none],
      [C.rows.sol, ok ? (sol0.kind === "none" ? C.inter.none : sol0.kind === "one" || sol0.kind === "line" ? m(solSrc(sol0)) : interPlain(sol0)) : C.solPending],
      [C.rows.inter, interPlain(sol0) + (changed() ? C.inter.same : "")]
    ]);
  }
  // ---- back-substitute panel ----
  function paintBSfb(){
    var f = $("[data-bs=fb]", host); if (!f) return;
    var id = S.sys;
    f.innerHTML = S.ok[id] ? MV.fbHTML("good", tpl(C.bs.solved, { s:sol0.kind === "none" ? C.inter.none : m(solSrc(sol0)) || interPlain(sol0) })) :
      bsMsg ? MV.fbHTML(bsMsg.bad ? "bad" : "", bsMsg.html) : "";
  }
  function paintBS(force){
    var el = $("#sy-bs", host), n = nv(), info = refInfo(stp.M(), n), id = S.sys;
    if (!info.ref) { el.dataset.open = ""; el.innerHTML = "<h4>" + C.bs.title + '</h4><p class="tiny muted">' + C.bs.locked + "</p>"; return; }
    if (el.dataset.open === id && !force) { paintBSfb(); return; }
    el.dataset.open = id;
    var B = S.bs[id] || (S.bs[id] = { k:"", v:{}, p:{} });
    el.innerHTML = "<h4>" + C.bs.title + '</h4><p class="tiny">' + C.bs.intro + '</p><div data-bs="entry"></div><div class="q-actions"><button type="button" class="btn primary sm" data-bs="check" data-k="exbschk">' + C.bs.check + '</button></div><div data-bs="fb"></div>';
    solEntry($("[data-bs=entry]", el), { st:B, nv:n, order:"up", C:C.bs, uid:"exbs", save:api.save, onChange:function(){ bsMsg = null; paintBSfb(); MV.changed(); } });
    paintBSfb();
  }
  $("#sy-bs", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-bs=check]"); if (!b) return;
    var id = S.sys, r = judgeSol(S.bs[id], stp.M(), nv(), sol0, C.sol, SY[id] ? SY[id].wrong : null);
    if (r.ok) { S.ok[id] = true; bsMsg = null; }
    else bsMsg = r.err ? { bad:false, html:r.err } : { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg };
    api.save(); paintBSfb(); paintRead(); MV.changed(); MV.focusFb($("#sy-bs", host));
  });
  $("#sy-bs", host).addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.se) { var b = $("[data-bs=check]", host); if (b) b.click(); } });
  // ---- system chips and Build ----
  function paintChips(){
    MV.keepFocus($("#sy-sys", host), function(){
      $("#sy-sys", host).innerHTML = C.systems.map(function(s){ return '<button type="button" class="chip" data-sys="' + s.id + '" data-k="sys' + s.id + '" aria-pressed="' + (S.sys === s.id) + '"' + (busy ? " disabled" : "") + ">" + s.chip + "</button>"; }).join("");
    });
  }
  function paintBuild(){
    var el = $("#sy-build", host);
    if (S.sys !== "B") { el.innerHTML = ""; return; }
    el.innerHTML = '<div class="sy-bld"><p class="tiny muted">' + C.buildNote + '</p><div class="sy-bgrid">' + S.build.map(function(r, i){
      return '<div class="sy-brow"><span class="sy-brl">' + Rn(i) + "</span>" + r.map(function(v, j){
        return (j === 3 ? '<span class="sy-bbar" aria-hidden="true"></span>' : "") + '<input type="number" min="-9" max="9" step="1" class="numin short sy-bin" data-b="' + i + "_" + j + '" data-k="b' + i + j + '" value="' + v + '" aria-label="Row ' + (i + 1) + ", " + (j < 3 ? VARS[j] + "-coefficient" : "constant") + '">';
      }).join("") + "</div>"; }).join("") + "</div></div>";
  }
  $("#sy-build", host).addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.b; if (!k || busy) return;
    var t = String(e.target.value).trim().replace(/−/g, "-"), v = Number(t), ij = k.split("_");
    if (t === "" || !Number.isInteger(v) || v < -9 || v > 9) return;
    S.build[+ij[0]][+ij[1]] = v; S.st.B = {}; S.bs.B = {}; S.ok.B = false; pv = null; bsMsg = null;
    mountStepper(); api.save(); MV.changed();
  });
  $("#sy-sys", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-sys]"); if (!b || busy) return;
    if (anim) { anim(); anim = null; } tw = null; pv = null; bsMsg = null;
    S.sys = b.dataset.sys; api.save(); paintChips(); paintBuild(); mountStepper(); MV.changed();
  });
  $("#sy-geo", host).addEventListener("change", function(e){ S.geo = e.target.checked; api.save(); drawGeo(); });
  // ---- stepper ----
  function afterChange(){ paintRead(); paintBS(); drawGeo(); MV.changed(); }
  function mountStepper(){
    var id = S.sys, st = S.st[id] || (S.st[id] = {}), R0 = rows0(id), n = R0[0].length - 1;
    sol0 = solveSys(MX.of(R0), n);
    var box = document.createElement("div"), wrap = $("#sy-step", host); wrap.innerHTML = ""; wrap.appendChild(box);   // fresh host: no stale listeners
    stp = stepper(box, { st:st, rows0:R0, nv:n, C:C.ops, uid:"ex", save:api.save, busy:function(){ return busy; },
      onOp:function(op, before){ pv = null; bsMsg = null; if (op.t === "comb" && S.geo) tweenRow(op, before, 800); else { if (anim) { anim(); anim = null; } tw = null; } afterChange(); },
      onUndo:function(){ pv = null; bsMsg = null; if (anim) { anim(); anim = null; } tw = null; afterChange(); },
      onZero:function(i){ demo(i, 1800, function(solD){ if (!pv) return; pv.note = tpl(C.demoNote, { op:opLabel({ t:"zero", i:i }), n:i + 1, from:interPlain(sol0), to:interPlain(solD) }); drawGeo(); }); } });
    $("#sy-bs", host).dataset.open = "";
    paintRead(); paintBS(); drawGeo();
  }
  v3 = view3d($("#sy-c3", host), function(){ return scene3(); });
  view3d.presets($("#sy-views", host), v3, C.geo);
  p2 = new MV.Plot($("#sy-c2", host), { xmin:-3, xmax:7, ymin:-2.5, ymax:6 }); p2.render = function(){ if (stp && nv() === 2) draw2(); };
  $("#sy-geo", host).checked = !!S.geo;
  paintChips(); paintBuild(); mountStepper();
  // ---- challenges ----
  function stM(id){ var s = S.st[id]; return s && s.M ? MX.of(s.M) : null; }
  function chal(id){
    var c = C.challenges.filter(function(x){ return x.id === id; })[0], Mg = c ? c.msgs : {};
    if (id === "tc1") {
      var M2 = stM("S2"); if (!M2) return { ok:false, msg:Mg.sys };
      if (!refInfo(M2, 3).ref) return { ok:false, msg:S.sys === "S2" ? Mg.ref : Mg.sys };
      var B = S.bs.S2 || {};
      if (B.k !== "one") return { ok:false, msg:B.k ? Mg.kind : Mg.empty };
      var pt = VARS.map(function(v){ return qParse((B.v || {})[v]); });
      if (pt.some(function(q){ return !q; })) return { ok:false, msg:Mg.empty };
      var t = pt.map(qv);
      if (t[0] === 1 && t[1] === 2 && t[2] === 3) return { ok:true };
      if (t[0] === 3 && t[1] === 2 && t[2] === 1) return { ok:false, msg:Mg.rev };
      if (t[0] === 1 && t[1] === 2 && t[2] === -3) return { ok:false, msg:Mg.sign };
      return { ok:false, msg:Mg.other };
    }
    if (id === "tc2") {
      var M3 = stM("S3"); if (!M3) return { ok:false, msg:Mg.sys };
      if (refInfo(M3, 3).contra.length) return { ok:true };
      var B3 = S.bs.S3 || {}, z = qParse((B3.v || {}).z);
      if (B3.k === "one" && z && Q.eq(z, Q.of(1))) return { ok:false, msg:Mg.z1 };
      return { ok:false, msg:Mg.more };
    }
    if (id === "tc3") {
      var b = S.build;
      if (!(b[0].join() === "1,1,1,3" && b[1].join() === "1,-1,3,1" && b[2][0] === 2 && b[2][1] === 0)) return { ok:false, msg:Mg.keep };
      if (b[2][2] === 4 && b[2][3] === 4) return { ok:true };
      return { ok:false, msg:b[2][2] === 4 ? Mg.none : Mg.one };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (anim) { anim(); anim = null; } tw = null; pv = null; bsMsg = null; busy = true;
        S.sys = p.sys; S.st[p.sys] = {}; S.bs[p.sys] = {}; S.ok[p.sys] = false;
        if (!S.geo) { S.geo = true; $("#sy-geo", host).checked = true; }
        paintChips(); paintBuild(); mountStepper();
        p.pre.forEach(function(a){ stp.apply(decodeOp(a), true); });
        stp.lock(true); paintRead(); paintBS(); drawGeo(); api.save();
      },
      run:function(p, done){
        var op = decodeOp(p.run);
        function fin(){ busy = false; stp.lock(false); paintChips(); drawGeo(); api.save(); MV.changed(); done(); }
        if (op.t === "zero") { demo(op.i, 2200, function(){ if (pv) pv.note = p.note; drawGeo(); MV.wait(1000, fin); }); return; }
        var before = stp.M(); stp.apply(op, true); paintRead(); paintBS();
        tweenRow(op, before, 1700, function(){
          pv = p.id === "p1" ? { note:p.note } : { orig:true, note:p.note };
          drawGeo(); MV.wait(1200, fin);
        });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// =====================================================================================================================
// ---------- Part 3: How many solutions? (three stations) ----------
function part3(host, api){
  var S = api.S, C = api.content, A = C.st1, B = C.st2, G = C.st3, CH = {};
  A.choices.forEach(function(c){ CH[c.id] = c.t; });
  S.s1 = S.s1 || {}; if (typeof S.t !== "number") S.t = 1; if (!S.r2) S.r2 = "r3";
  host.innerHTML =
    '<section class="sy-stn"><h3>' + A.title + "</h3><p>" + A.text + '</p><div class="sy-s1"><div class="sy-cards" id="sy-s1c"></div>' +
      '<div class="sy-s1g"><canvas class="sy-c3" id="sy-s1v" role="img" aria-label="3D view"></canvas><p class="eq-cap" id="sy-s1cap" aria-live="polite"></p></div></div></section>' +
    '<section class="sy-stn"><h3>' + B.title + "</h3><p>" + B.text + '</p><div class="sy-s2"><div class="sy-s2c">' +
      '<label class="slider"><span class="slider-top"><span>' + B.slider + '</span><output id="sy-tout"></output></span><input type="range" id="sy-t" min="-1" max="5" step="0.5" value="' + S.t + '" style="accent-color:var(--ink)" aria-label="Parameter t"></label>' +
      '<p class="sy-pt" id="sy-pt" aria-live="polite"></p><div class="sy-chk" id="sy-chk"></div></div>' +
      '<canvas class="sy-c3" id="sy-s2v" role="img" aria-label="3D view of the line of solutions"></canvas></div></section>' +
    '<section class="sy-stn"><h3>' + G.title + "</h3><p>" + G.text + '</p><div class="sy-s3cards" id="sy-s3c" role="group" aria-label="Choose a matrix"></div>' +
      '<div class="sy-s3"><div class="plot-wrap"><canvas class="plot" id="sy-s3p" role="img" aria-label="Graph of two lines"></canvas></div><div id="sy-s3t" aria-live="polite"></div></div></section>';
  // Station 1
  function cardById(id){ return A.cards.filter(function(c){ return c.id === id; })[0]; }
  function paint1(){
    MV.keepFocus($("#sy-s1c", host), function(){
      $("#sy-s1c", host).innerHTML = A.cards.map(function(cd){
        var x = S.s1[cd.id], right = x && x.ok, h = '<div class="sy-card" data-card="' + cd.id + '"><p class="sy-cl">(' + cd.id + ")</p>" + matHTML(cd.rows, 3) +
          '<div class="chips" role="group" aria-label="How many solutions for matrix ' + cd.id + '">' + A.choices.map(function(c){
            return '<button type="button" class="chip" data-ch="' + c.id + '" data-k="s1' + cd.id + c.id + '" aria-pressed="' + (!!x && x.ch === c.id) + '"' + (right ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
        if (x) h += right ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + cd.reveal) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (cd.wrong[x.ch] || "") + " Try again.");
        return h + "</div>";
      }).join("");
    });
  }
  var v1 = view3d($("#sy-s1v", host), function(){
    var cd = cardById(S.s1last), planes = [], lines = [], pts = [];
    if (!cd) return { L:5, describe:"3D view: axes only. Answer a card to see its planes." };
    var M = MX.of(cd.rows), sol = solveSys(M, 3);
    cd.rows.forEach(function(r, i){ if (r[0] || r[1] || r[2]) planes.push({ n:r.slice(0, 3), d:r[3], color:ROWC[i], label:Rn(i) }); });
    if (sol.kind === "one") pts.push({ p:sol.pt.map(qv), label:MV.plain(m(solSrc(sol))) });
    if (sol.kind === "line") lines.push({ p:sol.p0.map(qv), d:sol.d.map(qv), glow:true });
    return { L:5, planes:planes, lines:lines, points:pts, describe:"3D view of matrix (" + cd.id + "): " + cd.rows.map(function(r, i){ return Rn(i) + ": " + MV.plain(m(rowSrc(MX.of([r])[0], 3))); }).join("; ") + ". " + MV.plain(cd.reveal) };
  });
  function cap1(){ var cd = cardById(S.s1last); $("#sy-s1cap", host).innerHTML = cd ? A.fig + " (" + cd.id + ")" : A.fig; }
  $("#sy-s1c", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-ch]"); if (!b || b.disabled) return;
    var cd = cardById(b.closest("[data-card]").dataset.card);
    S.s1[cd.id] = { ch:b.dataset.ch, ok:b.dataset.ch === MV.ans(cd) }; S.s1last = cd.id; api.save();
    paint1(); cap1(); v1.render(); MV.focusFb($('[data-card="' + cd.id + '"]', host));
  });
  paint1(); cap1();
  // Station 2: the line (7 − t, 2 + t, t) of matrix (c)
  var v2 = view3d($("#sy-s2v", host), function(){
    var t = S.t, P = [7 - t, 2 + t, t];
    return { L:8, planes:[{ n:[1, -1, 2], d:5, color:ROWC[0], label:Rn(0) }, { n:[0, 1, -1], d:2, color:ROWC[1], label:Rn(1) }],
      lines:[{ p:[7, 2, 0], d:[-1, 1, 1], glow:true }], points:[{ p:P, label:"t = " + num(t, 1) }],
      describe:"Planes x − y + 2z = 5 and y − z = 2 meet in the glowing line (7 − t, 2 + t, t). The point for t = " + num(t, 1) + " is (" + P.map(function(v){ return num(v, 1); }).join(", ") + ")." };
  });
  function paint2(){
    var t = S.t, P = [7 - t, 2 + t, t], vals = [P[0] - P[1] + 2 * P[2], P[1] - P[2], 0];
    $("#sy-tout", host).textContent = num(t, 1);
    $("#sy-pt", host).innerHTML = m("(x, y, z) = (") + P.map(function(v){ return num(v, 1); }).join(", ") + m(")");
    $("#sy-chk", host).innerHTML = B.eqs.map(function(e, k){ return '<p class="sy-chkl">' + e + " = " + num(vals[k], 1) + " → " + num(vals[k], 1) + " = " + B.rhs[k] + ' <span class="sy-ok">✓</span></p>'; }).join("");
    v2.render();
  }
  $("#sy-t", host).addEventListener("input", function(e){ S.t = Math.round(+e.target.value * 2) / 2; api.save(); paint2(); });
  paint2();
  // Station 3: back to R²
  var p3 = new MV.Plot($("#sy-s3p", host), { xmin:-3, xmax:7, ymin:-2.5, ymax:6 });
  function paint3(){
    MV.keepFocus($("#sy-s3c", host), function(){
      $("#sy-s3c", host).innerHTML = G.cards.map(function(cd){ return '<button type="button" class="sy-mbtn" data-r2="' + cd.id + '" data-k="r2' + cd.id + '" aria-pressed="' + (S.r2 === cd.id) + '">' + matHTML(cd.rows, 2) + "</button>"; }).join("");
    });
    var cd = G.cards.filter(function(c){ return c.id === S.r2; })[0];
    $("#sy-s3t", host).innerHTML = "<p><strong>" + cd.text + '</strong></p><p class="tiny muted">' + cd.caption + "</p>";
    p3.render();
  }
  p3.render = function(){
    var cd = G.cards.filter(function(c){ return c.id === S.r2; })[0], same = cd.id === "r1";
    draw2d(p3, { rows:cd.lines, widths:same ? [6, 2.6] : [3, 3], dash:same ? [false, true] : null, point:cd.id === "r3" ? [1, 2] : null, pointLabel:cd.id === "r3" ? "(1, 2)" : "",
      describe:"Lines " + cd.lines.map(function(r, i){ return Rn(i) + ": " + MV.plain(m(rowSrc(MX.of([r])[0], 2))); }).join(" and ") + ". " + MV.plain(cd.text) });
  };
  $("#sy-s3c", host).addEventListener("click", function(e){ var b = e.target.closest("[data-r2]"); if (!b) return; S.r2 = b.dataset.r2; api.save(); paint3(); });
  paint3();
  return {};
}

// =====================================================================================================================
// ---------- Practice 2: Row-reduce and solve (a V13 stepper and V8 solution boxes per item) ----------
function solveAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, M = a.msgs, T = a.sol;
  function ist(id){ var x = S.it[id] || (S.it[id] = {}); x.e = x.e || { k:"", v:{}, p:{} }; x.st = x.st || {}; x.fv = x.fv || {}; if (x.tries == null) { x.tries = 0; x.hint = 0; x.solved = false; x.first = null; } return x; }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q sy-pq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="sy-pbody"></div><div class="sy-pcl"></div></div>';
  }).join("");
  function qel(it){ return $('[data-q="' + it.id + '"]', host); }
  function mountStep(it, box){
    var x = ist(it.id), n = it.rows[0].length - 1;
    if (it.fill && !x.filled) {
      box.innerHTML = '<p class="tiny">' + M.fill + '</p><div class="sy-bgrid">' + it.rows.map(function(r, i){
        return '<div class="sy-brow"><span class="sy-brl">' + Rn(i) + "</span>" + r.map(function(_, j){
          return (j === n ? '<span class="sy-bbar" aria-hidden="true"></span>' : "") + '<input type="number" step="1" class="numin short sy-bin" data-fv="' + i + "_" + j + '" data-k="' + it.id + "f" + i + j + '" value="' + MV.esc(x.fv[i + "_" + j] || "") + '" aria-label="Row ' + (i + 1) + ", " + (j < n ? VARS[j] + "-coefficient" : "constant") + '">';
        }).join("") + "</div>"; }).join("") + '</div><div class="q-actions"><button type="button" class="btn ghost sm" data-act="usem" data-k="' + it.id + 'usem">' + M.useM + '</button></div><div class="sy-fmsg"></div>';
      return;
    }
    stepper(box, { st:x.st, rows0:it.rows, nv:n, C:a.ops, uid:"p" + it.id, save:api.save });
  }
  function build(it){
    var x = ist(it.id), body = $(".sy-pbody", qel(it));
    if (x.solved) { body.innerHTML = ""; return; }
    if (it.kind === "k") {
      body.innerHTML = '<div class="sy-kq"><label class="sy-val">' + M.k + '<input class="numin short" type="text" inputmode="text" autocomplete="off" data-kk="1" data-k="' + it.id + 'kk" aria-label="k =" value="' + MV.esc(x.kk || "") + '"></label>' +
        '<div class="sy-ever"><span>' + M.ever + '</span><span class="chips" role="group" aria-label="' + MV.esc(MV.plain(M.ever)) + '">' + ["yes", "no"].map(function(v){
          return '<button type="button" class="chip" data-ever="' + v + '" data-k="' + it.id + "ev" + v + '" aria-pressed="' + (x.ever === v) + '">' + M[v] + "</button>"; }).join("") + "</span></div></div>";
      return;
    }
    body.innerHTML = '<details class="sy-pdet"' + (x.open ? " open" : "") + "><summary>" + M.open + '</summary><div class="sy-pst"></div></details><div class="sy-pent"></div>';
    var det = $("details", body), box = $(".sy-pst", body);
    if (x.open) mountStep(it, box);
    det.addEventListener("toggle", function(){ x.open = det.open; api.save(); if (det.open && !box.firstChild) mountStep(it, box); });
    solEntry($(".sy-pent", body), { st:x.e, nv:it.rows[0].length - 1, order:"down", C:a.entry, uid:"pe" + it.id, save:api.save, onChange:function(){ msgs[it.id] = null; } });
  }
  function paintCl(it){
    var x = ist(it.id), el = $(".sy-pcl", qel(it)), h;
    if (x.solved) h = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.display + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else {
      h = '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
      if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function judge(it){
    var x = ist(it.id);
    if (it.kind === "k") {
      var k = String(x.kk || "").trim().replace(/−/g, "-");
      if (!/^-?\d+$/.test(k)) return { err:M.kNum };
      if (!x.ever) return { err:M.pickEver };
      var ans = MV.ans(it);
      return +k === ans.k && x.ever === ans.ever ? { ok:true } : { ok:false, msg:it.wrongDefault };
    }
    var Mx = MX.of(it.rows), n = it.rows[0].length - 1, r = judgeSol(x.e, Mx, n, solveSys(Mx, n), T, it.wrong);
    if (!r.ok && !r.err && it.wrongDefault && r.msg === T.oneWrong) r.msg = it.wrongDefault;
    return r;
  }
  host.addEventListener("input", function(e){
    var t = e.target, q = t.closest && t.closest("[data-q]"); if (!q) return;
    var x = ist(q.dataset.q);
    if (t.dataset.kk) { x.kk = t.value; api.save(); }
    if (t.dataset.fv) { x.fv[t.dataset.fv] = t.value; api.save(); }
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !(e.target.dataset.se || e.target.dataset.kk)) return;
    var q = e.target.closest("[data-q]"), b = q && q.querySelector('[data-act="check"]'); if (b) b.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.ever) { x.ever = b.dataset.ever; msgs[it.id] = null; api.save(); $$("[data-ever]", q).forEach(function(c){ c.setAttribute("aria-pressed", String(c.dataset.ever === x.ever)); }); return; }
    if (b.dataset.act === "usem") {
      var n = it.rows[0].length - 1, okM = true, blank = false, fm = $(".sy-fmsg", q);
      it.rows.forEach(function(r, i){ r.forEach(function(v, j){ var s = String(x.fv[i + "_" + j] == null ? "" : x.fv[i + "_" + j]).trim().replace(/−/g, "-"); if (!/^-?\d+$/.test(s)) blank = true; else if (+s !== v) okM = false; }); });
      if (blank) { fm.innerHTML = MV.fbHTML("", M.fillNum); return; }
      if (!okM) { fm.innerHTML = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + M.fillWrong); MV.focusFb(fm); return; }
      x.filled = true; api.save(); mountStep(it, $(".sy-pst", q)); return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; build(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  a.items.forEach(function(it){ build(it); paintCl(it); });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (" + d + " of " + a.items.length + " solved)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// =====================================================================================================================
// ---------- Performance task: Third plane in the sheaf ----------
var task = (function(){
  var api, v = null, K = ["a", "b", "c", "d"];
  function g(k){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), n = Number(t); return t !== "" && Number.isInteger(n) && n >= -9 && n <= 9 ? n : null; }
  function read(){ var o = {}; K.forEach(function(k){ o[k] = g(k); }); o.valid = K.every(function(k){ return o[k] !== null; }); return o; }
  function eqSrc(a, b, c, d){ return rowSrc(MX.of([[a, b, c, d]])[0], 3); }
  function multOf(u, w){ for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) if (u[i] * w[j] !== u[j] * w[i]) return false; return true; }
  function gcd(x, y){ x = Math.abs(x); y = Math.abs(y); while (y) { var t = x % y; x = y; y = t; } return x; }
  function sysM(d){ return MX.of([[1, 1, 1, 3], [1, -1, 3, 1], [d.a, d.b, d.c, d.d]]); }
  function draw(){
    if (!v) return; v.render();
    var d = read(), T = api.content || {}, el = $("#sy-tref"); if (!el) return;
    if (!d.valid || !(d.a || d.b || d.c)) { el.innerHTML = '<p class="tiny muted">' + (T.pvEnter || "") + "</p>"; return; }
    var A = refOf(sysM(d), 3), info = refInfo(A, 3);
    el.innerHTML = '<p class="tiny">' + (T.pvRef || "") + "</p>" + matHTML(A, 3) + "<p>" + (info.contra.length ? T.pvNone : info.zeros.length ? T.pvInf : T.pvOne) + "</p>";
  }
  function stepperIn(k, val){
    return '<div class="sy-tstep"><label for="sy-t' + k + '">' + m(k) + ' <span class="tiny muted">(−9 to 9)</span></label>' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="syt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="sy-t' + k + '" data-tk="' + k + '" type="number" min="-9" max="9" step="1" autocomplete="off" value="' + MV.esc(val) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="syt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; K.forEach(function(k){ if (a.S[k] == null) a.S[k] = k === "a" ? "1" : "0"; });
      inp.innerHTML = '<p class="sy-teq">' + m("ax + by + cz = d") + "</p>" + K.map(function(k){ return stepperIn(k, a.S[k]); }).join("");
      pv.innerHTML = '<canvas class="sy-c3" id="sy-tv" role="img" aria-label="3D view of the three planes"></canvas><div id="sy-tref" aria-live="polite"></div>';
      v = view3d($("#sy-tv", pv), function(){
        var d = read(), planes = [{ n:[1, 1, 1], d:3, color:ROWC[0], label:Rn(0) }, { n:[1, -1, 3], d:1, color:ROWC[1], label:Rn(1) }], ok = false;
        if (d.valid && (d.a || d.b || d.c)) { planes.push({ n:[d.a, d.b, d.c], d:d.d, color:ROWC[2], label:Rn(2) }); ok = 2 * d.a + d.b === d.d && 2 * d.b + d.c === d.d; }
        return { L:6, planes:planes, lines:[{ p:[2, 1, 0], d:[-2, 1, 1], glow:ok }],
          describe:"Planes x + y + z = 3 (blue) and x − y + 3z = 1 (teal) meet in the line through (2, 1, 0) and (0, 2, 1)" + (planes[2] ? "; your plane " + MV.plain(m(eqSrc(d.a, d.b, d.c, d.d))) + (ok ? " contains that line." : " does not contain the whole line.") : ".") };
      });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); draw(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10); if (!isFinite(cur)) cur = 0;
        a.S[k] = String(clamp(cur + +b.dataset.dir, -9, 9)); $("#sy-t" + k).value = a.S[k];
        a.save(); draw(); a.update();
      });
      draw();
    },
    read:read,
    valid:function(d){ if (!d.valid) return "Enter whole numbers from −9 to 9 for a, b, c and d."; return (d.a || d.b || d.c) ? true : "At least one of a, b and c must be non-zero."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var u = [d.a, d.b, d.c, d.d], nz = !!(d.a || d.b || d.c);
      return [nz && 2 * d.a + d.b === d.d && 2 * d.b + d.c === d.d, nz && !multOf(u, [1, 1, 1, 3]) && !multOf(u, [1, -1, 3, 1]), !!(d.a && d.b && d.c), d.d !== 0];
    },
    key:function(d){ var u = [d.a, d.b, d.c, d.d], gg = u.reduce(gcd, 0) || 1, s = (u.filter(function(x){ return x; })[0] || 1) < 0 ? -1 : 1; return u.map(function(x){ return s * x / gg + 0; }).join("|"); },
    label:function(k){ var u = k.split("|").map(Number); return m(eqSrc(u[0], u[1], u[2], u[3])); },
    text:function(k){ var u = k.split("|").map(Number); return MV.plain(m(eqSrc(u[0], u[1], u[2], u[3]))); }
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
