// SCH4U 15 Quantum Mechanical Model: hero (Bohr circle → 1s dot cloud → 2p dumbbell with an address strip), Orbital
// viewer (Explore: 3D orbital surfaces from n, l, mₗ, mₛ chips; a standing-wave ring; a "Find the electron" dot cloud
// with a 90% boundary and a radial count), Quantum numbers puzzle (Part 3: a counting table, allowed-or-not flip cards
// and Bader's electron-density map), "Allowed or not?" (sort + rule), "Counting with quantum numbers" (number entry +
// choice) and "Quantum address" (task with a live orbital preview).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, MI = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function num(v){ return MV.num(v, 2); }
function m(s){ return MV.m(s); }
function md(s){ return MV.md(s); }
function LIN(t){ return t; }
function smooth(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function intIn(v, a, b, d){ v = Math.round(+v); return isFinite(v) && v >= a && v <= b ? v : d; }
function sgnT(v){ return v > 0 ? "+" + v : v < 0 ? MI + (-v) : "0"; }
function mlT(v){ return v < 0 ? MI + (-v) : String(v); }
function spinT(s){ return s === "+" ? "+½" : s === "-" ? MI + "½" : ""; }
function plural(k, w){ return k + " " + w + (k === 1 ? "" : "s"); }
var LET = ["s", "p", "d", "f", "g"];
// Bohr radius for distances in Find the electron.
// VERIFY: a₀ = 52.9 pm is not in the SCH4U course data table (MV.chem.data); defined here for this module.
var A0 = 52.9;

// quantum-number rules (plan §4): "" when allowed, else the rule broken
function broken(n, l, ml){ if (n < 1) return "n"; if (l < 0 || l > n - 1) return "l"; if (Math.abs(ml) > l) return "ml"; return ""; }
var RULE_T = { n:"Not allowed: `n` must be at least 1", l:"Not allowed: `l` must be less than `n`", ml:"Not allowed: `m_l` must be between `-l` and `+l`" };
var RULE_P = { n:"Not allowed: n must be at least 1", l:"Not allowed: l must be less than n", ml:"Not allowed: mₗ must be between −l and +l" };
function shapeT(n, l, ml){
  if (l === 0) return n === 1 ? "Sphere" : "Sphere, larger than " + (n - 1) + "s, with " + plural(n - 1, "spherical node") + " inside";
  if (l === 1) return "Dumbbell (one of three, at right angles)";
  if (l === 2) return ml === 0 ? "Dumbbell with a ring (one of five)" : "Four-lobed cloverleaf (one of five)";
  return "Complex, with many lobes (one of seven)";
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–13; adds an extra(id) hook for a class and a small tag) — segmented
// control or chip row as a real radio group (arrow keys, roving tabindex, lock); with no option chosen yet, the first option
// holds the tab stop. radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled(id),
// extra(id) -> {cls, tag}}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){
        var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d), ex = o.extra ? o.extra(String(x.id)) : null; if (!d) first = false;
        return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (ex && ex.cls ? ' class="' + ex.cls + '"' : "") + (d ? " disabled" : "") + ">" + x.t + (ex && ex.tag ? '<small class="qm-tag">' + ex.tag + "</small>" : "") + "</button>";
      }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ id = id == null ? "" : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// @component C12 orbitalView — 3D orbital surfaces on a canvas: angular shape |Y|^1.4 of the real orbital for each (l, mₗ)
// (one representative shape per mₗ), lobe phases --orb-a / --orb-b, Lambert shading, back-face cull + painter's sort;
// spherical nodes, nodal planes and nodal cones as --ink-2 dashed lines; x, y, z axes. Also renders any mesh
// {ni, nj, P (unit xyz), Sg (phase signs) | null, ctr} (used for the 2p 90% boundary lobes and the hero morph).
// View: rot {x: pitch (+ looks from above), y: yaw}; chem z is up, x points at the viewer when rot = {0, 0}.
var PRESET = { iso:{ x:0.45, y:-0.62 }, front:{ x:0, y:0 }, top:{ x:1.55, y:0 } };
function viewer(rot){
  var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
  return function(x, y, z){ var X = y, Y = z, Z = x, X1 = X * cy + Z * sy, Z1 = -X * sy + Z * cy; return [X1, Y * cx - Z1 * sx, Y * sx + Z1 * cx]; };
}
var R5 = Math.sqrt(0.5), S3 = 1 / Math.sqrt(3);
var YF = {
  "0,0":function(){ return 1; },
  "1,0":function(x, y, z){ return z; }, "1,1":function(x){ return x; }, "1,-1":function(x, y){ return y; },
  "2,0":function(x, y, z){ return 3 * z * z - 1; }, "2,1":function(x, y, z){ return x * z; }, "2,-1":function(x, y, z){ return y * z; },
  "2,2":function(x, y){ return x * x - y * y; }, "2,-2":function(x, y){ return x * y; },
  "3,0":function(x, y, z){ return z * (5 * z * z - 3); }, "3,1":function(x, y, z){ return x * (5 * z * z - 1); }, "3,-1":function(x, y, z){ return y * (5 * z * z - 1); },
  "3,2":function(x, y, z){ return z * (x * x - y * y); }, "3,-2":function(x, y, z){ return x * y * z; },
  "3,3":function(x, y){ return x * (x * x - 3 * y * y); }, "3,-3":function(x, y){ return y * (3 * x * x - y * y); }
};
function phiN(d){ var p = d * Math.PI / 180; return [-Math.sin(p), Math.cos(p), 0]; }
// angular nodes: plane normals and nodal-cone cos θ (each double cone counts as 2 nodes)
var NODES = {
  "1,0":{ p:[[0, 0, 1]] }, "1,1":{ p:[[1, 0, 0]] }, "1,-1":{ p:[[0, 1, 0]] },
  "2,0":{ c:[S3] }, "2,1":{ p:[[1, 0, 0], [0, 0, 1]] }, "2,-1":{ p:[[0, 1, 0], [0, 0, 1]] }, "2,2":{ p:[[R5, -R5, 0], [R5, R5, 0]] }, "2,-2":{ p:[[1, 0, 0], [0, 1, 0]] },
  "3,0":{ p:[[0, 0, 1]], c:[Math.sqrt(0.6)] }, "3,1":{ p:[[1, 0, 0]], c:[Math.sqrt(0.2)] }, "3,-1":{ p:[[0, 1, 0]], c:[Math.sqrt(0.2)] },
  "3,2":{ p:[[0, 0, 1], [R5, -R5, 0], [R5, R5, 0]] }, "3,-2":{ p:[[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
  "3,3":{ p:[phiN(30), phiN(90), phiN(150)] }, "3,-3":{ p:[phiN(0), phiN(60), phiN(120)] }
};
var SPH = { 1:[0.45], 2:[0.28, 0.62], 3:[0.2, 0.45, 0.72] };
function nodeCount(n, l, ml){ var nd = NODES[l + "," + ml] || {}; return { sph:n - l - 1, pl:(nd.p || []).length, co:(nd.c || []).length * 2 }; }
function nodesT(n, l, ml){
  var c = nodeCount(n, l, ml), tot = c.sph + c.pl + c.co, parts = [];
  if (!tot) return "0";
  if (c.sph) parts.push(c.sph + " spherical");
  if (c.pl) parts.push(c.pl + " plane" + (c.pl > 1 ? "s" : ""));
  if (c.co) parts.push(c.co + " cone-shaped");
  return tot + " (" + parts.join(", ") + ")";
}
function sz(n){ return 0.52 + 0.12 * n; }
var NT = 34, NP = 44, SHP = 1.4, MESH = {};
function sphereGrid(fn){
  var ni = NT, nj = NP, P = new Float64Array(3 * (ni + 1) * (nj + 1)), Sg = new Int8Array((ni + 1) * (nj + 1)), t = 0;
  for (var i = 0; i <= ni; i++) for (var j = 0; j <= nj; j++, t++) {
    var th = Math.PI * i / ni, ph = 2 * Math.PI * j / nj, x = Math.sin(th) * Math.cos(ph), y = Math.sin(th) * Math.sin(ph), z = Math.cos(th), v = fn(x, y, z);
    P[3 * t] = x * v.r; P[3 * t + 1] = y * v.r; P[3 * t + 2] = z * v.r; Sg[t] = v.s;
  }
  return { ni:ni, nj:nj, P:P, Sg:Sg, ctr:[0, 0, 0] };
}
function orbMesh(l, ml){
  var k = l + "," + ml; if (MESH[k]) return MESH[k];
  var f = YF[k], mx = 0, i, j;
  for (i = 0; i <= NT; i++) for (j = 0; j <= NP; j++) { var th = Math.PI * i / NT, ph = 2 * Math.PI * j / NP; mx = Math.max(mx, Math.abs(f(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)))); }
  var me = sphereGrid(function(x, y, z){ var v = f(x, y, z); return { r:Math.pow(Math.abs(v) / mx, SHP), s:v >= 0 ? 1 : -1 }; });
  if (!l) me.Sg = null;
  return (MESH[k] = me);
}
function rgbOf(c){
  c = String(c || "").trim(); var h = c.charAt(0) === "#" ? c.slice(1) : "";
  if (h.length === 3) h = h.replace(/./g, "$&$&");
  if (h.length === 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  var mm = c.match(/\d+(\.\d+)?/g); return mm && mm.length >= 3 ? [+mm[0], +mm[1], +mm[2]] : [120, 120, 120];
}
var LV = (function(){ var a = [-0.42, 0.62, 0.66], l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; })();
var HV = (function(){ var a = [LV[0], LV[1], LV[2] + 1], l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; })();
// vw = {f: viewer(rot), cx, cy, s (px per unit)}; o = {cols:[rgbA, rgbB], alpha, stroke}
function renderMesh(ctx, me, vw, o){
  var ni = me.ni, nj = me.nj, P = me.P, n = (ni + 1) * (nj + 1), Q = new Float64Array(3 * n), i, j, t;
  for (t = 0; t < n; t++) { var v = vw.f(P[3 * t], P[3 * t + 1], P[3 * t + 2]); Q[3 * t] = v[0]; Q[3 * t + 1] = v[1]; Q[3 * t + 2] = v[2]; }
  var c0 = vw.f(me.ctr[0], me.ctr[1], me.ctr[2]), F = [];
  for (i = 0; i < ni; i++) for (j = 0; j < nj; j++) {
    var a = i * (nj + 1) + j, b = a + nj + 1, c = b + 1, d = a + 1;
    var ux = Q[3 * c] - Q[3 * a], uy = Q[3 * c + 1] - Q[3 * a + 1], uz = Q[3 * c + 2] - Q[3 * a + 2];
    var wx = Q[3 * d] - Q[3 * b], wy = Q[3 * d + 1] - Q[3 * b + 1], wz = Q[3 * d + 2] - Q[3 * b + 2];
    var nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx, len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (len < 1e-10) continue;
    var mx = (Q[3 * a] + Q[3 * b] + Q[3 * c] + Q[3 * d]) / 4, my = (Q[3 * a + 1] + Q[3 * b + 1] + Q[3 * c + 1] + Q[3 * d + 1]) / 4, mz = (Q[3 * a + 2] + Q[3 * b + 2] + Q[3 * c + 2] + Q[3 * d + 2]) / 4;
    if (nx * (mx - c0[0]) + ny * (my - c0[1]) + nz * (mz - c0[2]) < 0) { nx = -nx; ny = -ny; nz = -nz; }
    if (nz <= 0) continue;
    var sg = me.Sg ? (me.Sg[a] + me.Sg[b] + me.Sg[c] + me.Sg[d] >= 0 ? 0 : 1) : 0;
    F.push([mz, a, b, c, d, nx / len, ny / len, nz / len, sg]);
  }
  F.sort(function(p, q){ return p[0] - q[0]; });
  ctx.save(); ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.lineJoin = "round";
  F.forEach(function(f){
    var lam = Math.max(0, f[5] * LV[0] + f[6] * LV[1] + f[7] * LV[2]), sp = Math.pow(Math.max(0, f[5] * HV[0] + f[6] * HV[1] + f[7] * HV[2]), 30) * 0.28, sh = 0.34 + 0.66 * lam, base = o.cols[f[8]];
    var col = "rgb(" + Math.min(255, Math.round(base[0] * sh + 255 * sp)) + "," + Math.min(255, Math.round(base[1] * sh + 255 * sp)) + "," + Math.min(255, Math.round(base[2] * sh + 255 * sp)) + ")";
    ctx.beginPath();
    [f[1], f[2], f[3], f[4]].forEach(function(k, q){ var X = vw.cx + vw.s * Q[3 * k], Y = vw.cy - vw.s * Q[3 * k + 1]; if (q) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    if (o.stroke !== false) { ctx.strokeStyle = col; ctx.lineWidth = 0.8; ctx.stroke(); }
  });
  ctx.restore();
}
function poly3(ctx, vw, pts, closed){ pts.forEach(function(p, i){ var v = vw.f(p[0], p[1], p[2]), X = vw.cx + vw.s * v[0], Y = vw.cy - vw.s * v[1]; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }); if (closed) ctx.closePath(); }
function circle3(nrm, R, z0){
  var n = nrm, u = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], d = u[0] * n[0] + u[1] * n[1] + u[2] * n[2];
  u = [u[0] - d * n[0], u[1] - d * n[1], u[2] - d * n[2]]; var ul = Math.hypot(u[0], u[1], u[2]); u = [u[0] / ul, u[1] / ul, u[2] / ul];
  var v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]], out = [];
  for (var k = 0; k < 64; k++) { var t = k / 64 * 2 * Math.PI, c = Math.cos(t) * R, s = Math.sin(t) * R; out.push([c * u[0] + s * v[0] + n[0] * (z0 || 0), c * u[1] + s * v[1] + n[1] * (z0 || 0), c * u[2] + s * v[2] + n[2] * (z0 || 0)]); }
  return out;
}
function drawAxes(ctx, vw, L, font){
  var ink2 = MV.css("--ink-2");
  ctx.save(); ctx.strokeStyle = ink2; ctx.fillStyle = ink2; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.6; ctx.font = "italic 13px " + font; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  [["x", [1, 0, 0]], ["y", [0, 1, 0]], ["z", [0, 0, 1]]].forEach(function(a){
    var e = a[1]; ctx.beginPath(); poly3(ctx, vw, [[-e[0] * L, -e[1] * L, -e[2] * L], [e[0] * L, e[1] * L, e[2] * L]]); ctx.stroke();
    var v = vw.f(e[0] * L * 1.08, e[1] * L * 1.08, e[2] * L * 1.08); ctx.globalAlpha = 0.9; ctx.fillText(a[0], vw.cx + vw.s * v[0], vw.cy - vw.s * v[1]); ctx.globalAlpha = 0.6;
  });
  ctx.restore();
}
function drawNodes(ctx, vw, n, l, ml, Rn){
  var nd = NODES[l + "," + ml] || {}, sph = SPH[n - l - 1] || [];
  ctx.save(); ctx.strokeStyle = MV.css("--ink-2"); ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]);
  sph.forEach(function(fr){ ctx.beginPath(); ctx.arc(vw.cx, vw.cy, vw.s * Rn * fr, 0, 2 * Math.PI); ctx.stroke(); });
  (nd.p || []).forEach(function(p){ ctx.beginPath(); poly3(ctx, vw, circle3(p, Rn), true); ctx.stroke(); });
  (nd.c || []).forEach(function(c){ var s = Math.sqrt(1 - c * c); [1, -1].forEach(function(g){ ctx.beginPath(); poly3(ctx, vw, circle3([0, 0, 1], Rn * s * 0.9, g * Rn * c * 0.9), true); ctx.stroke(); }); });
  ctx.restore();
}
function orbCols(){ return [rgbOf(MV.css("--orb-a")), rgbOf(MV.css("--orb-b"))]; }
// Orbital (or "Not allowed") scene in a W × H box; st {n, l, ml}; o {small, label, axes}
function drawOrbScene(ctx, W, H, st, rot, o, font){
  o = o || {};
  var mn = Math.min(W, H), cx = W / 2, cy = H / 2 + (o.small ? 0 : 4), br = broken(st.n, st.l, st.ml);
  if (br) {
    ctx.save(); ctx.strokeStyle = MV.css("--ink-2"); ctx.lineWidth = 1.6; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(cx, cy, mn * 0.3, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = MV.css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "700 " + Math.round(clamp(mn * 0.07, 15, 24)) + "px " + font; ctx.fillText("✗ Not allowed", cx, cy - mn * 0.05);
    ctx.font = Math.round(clamp(mn * 0.042, 11.5, 15)) + "px " + font; ctx.fillStyle = MV.css("--ink-2");
    ctx.fillText(RULE_P[br].replace("Not allowed: ", ""), cx, cy + mn * 0.05);
    ctx.restore(); return;
  }
  var R = mn * (o.small ? 0.4 : 0.38) * sz(st.n), vw = { f:viewer(rot), cx:cx, cy:cy, s:R };
  if (o.axes !== false) drawAxes(ctx, { f:vw.f, cx:cx, cy:cy, s:1 }, mn * (o.small ? 0.46 : 0.44), font);
  renderMesh(ctx, orbMesh(st.l, st.ml), vw, { cols:orbCols() });
  drawNodes(ctx, vw, st.n, st.l, st.ml, 1.04);
  ctx.fillStyle = MV.css("--ink"); ctx.beginPath(); ctx.arc(cx, cy, o.small ? 2 : 2.6, 0, 2 * Math.PI); ctx.fill();
  if (o.label) { ctx.font = "700 " + (o.small ? 14 : 20) + "px " + font; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(st.n + LET[st.l], 10, 8); }
}

// @component C12 dotCloud — hydrogen 1s, 2s and 2p (mₗ = 0) position measurements, drawn from the exact radial and angular
// probability (inverse-CDF sampling, seeded, so the same dots every time); 90% boundary (s: the sphere holding 90%;
// 2p: the |ψ|² contour holding 90%, as two lobes of revolution); radial counts in 25 pm bins.
var RADF = { "1s":function(r){ return r * r * Math.exp(-2 * r); }, "2s":function(r){ var u = 2 - r; return r * r * u * u * Math.exp(-r); }, "2p":function(r){ return Math.pow(r, 4) * Math.exp(-r); } };
var SEED = { "1s":1511, "2s":2522, "2p":2533 }, CDF = {}, PTS = {}, B90 = {}, MAXD = 2000;
function cdf(orb){
  if (CDF[orb]) return CDF[orb];
  var dr = 0.01, N = 4000, c = new Float64Array(N + 1), f = RADF[orb], i;
  for (i = 0; i < N; i++) c[i + 1] = c[i] + f((i + 0.5) * dr) * dr;
  for (i = 0; i <= N; i++) c[i] /= c[N];
  return (CDF[orb] = { c:c, dr:dr, N:N });
}
function rAt(orb, u){ var T = cdf(orb), c = T.c, lo = 0, hi = T.N; while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (c[mid] < u) lo = mid; else hi = mid; } return (lo + (u - c[lo]) / ((c[hi] - c[lo]) || 1)) * T.dr; }
function samp(orb, R){ var r = rAt(orb, R()), ct = orb === "2p" ? Math.cbrt(2 * R() - 1) : 2 * R() - 1, ph = 2 * Math.PI * R(), st = Math.sqrt(Math.max(0, 1 - ct * ct)); return [r * st * Math.cos(ph), r * st * Math.sin(ph), r * ct]; }
function dots(orb, n){ var s = PTS[orb] || (PTS[orb] = { a:[], R:rng(SEED[orb]) }); while (s.a.length < n) s.a.push(samp(orb, s.R)); return s.a; }
function revolve(prof, g){
  var ni = prof.length - 1, nj = 40, P = new Float64Array(3 * (ni + 1) * (nj + 1)), t = 0, zc = 0;
  prof.forEach(function(p){ zc += p[1]; }); zc /= prof.length;
  for (var i = 0; i <= ni; i++) for (var j = 0; j <= nj; j++, t++) { var ph = 2 * Math.PI * j / nj; P[3 * t] = prof[i][0] * Math.cos(ph); P[3 * t + 1] = prof[i][0] * Math.sin(ph); P[3 * t + 2] = g * prof[i][1]; }
  return { ni:ni, nj:nj, P:P, Sg:null, ctr:[0, 0, g * zc] };
}
function bound(orb){
  if (B90[orb]) return B90[orb];
  if (orb !== "2p") return (B90[orb] = { r:rAt(orb, 0.9) });
  var R = rng(777), d = [], i;
  for (i = 0; i < 20000; i++) { var p = samp("2p", R); d.push(p[2] * p[2] * Math.exp(-Math.hypot(p[0], p[1], p[2]))); }
  d.sort(function(a, b){ return a - b; });
  var c = d[Math.floor(d.length * 0.1)], k = Math.sqrt(c), thmax = Math.acos(Math.min(1, k * Math.E / 2)), K = 36, prof = [];
  function g(r){ return r * Math.exp(-r / 2); }
  function solve(t, lo, hi, inc){ var target = k / t; for (var it = 0; it < 48; it++) { var mid = (lo + hi) / 2; if ((g(mid) < target) === inc) lo = mid; else hi = mid; } return (lo + hi) / 2; }
  for (i = 0; i <= K; i++) { var th = thmax * Math.min(i / K, 0.999), r = solve(Math.cos(th), 0, 2, true); prof.push([r * Math.sin(th), r * Math.cos(th)]); }
  for (i = K; i >= 0; i--) { var th2 = thmax * Math.min(i / K, 0.999), r2 = solve(Math.cos(th2), 2, 40, false); prof.push([r2 * Math.sin(th2), r2 * Math.cos(th2)]); }
  return (B90[orb] = { c:c, mesh:[revolve(prof, 1), revolve(prof, -1)] });
}
function inside(orb, p){ var r = Math.hypot(p[0], p[1], p[2]), b = bound(orb); return orb === "2p" ? p[2] * p[2] * Math.exp(-r) >= b.c : r <= b.r; }
var BIN = 25, NBIN = 28;
function radial(orb, n){ var h = []; for (var i = 0; i < NBIN; i++) h.push(0); dots(orb, n).slice(0, n).forEach(function(p){ var d = Math.hypot(p[0], p[1], p[2]) * A0; h[Math.min(NBIN - 1, Math.floor(d / BIN))]++; }); return h; }
var CLOUD_EXT = 12.5;   // a₀ from the centre to the nearest edge of the view
function drawCloud(ctx, W, H, orb, cnt, bnd, rot, font, latest){
  var mn = Math.min(W, H), s = mn / 2 / CLOUD_EXT, cx = W / 2, cy = H / 2, vw = { f:viewer(rot), cx:cx, cy:cy, s:s }, ea = MV.css("--e-pair"), oa = MV.css("--orb-a");
  drawAxes(ctx, { f:vw.f, cx:cx, cy:cy, s:1 }, mn * 0.44, font);
  if (bnd) {
    var b = bound(orb);
    if (orb === "2p") {
      b.mesh.forEach(function(me){ renderMesh(ctx, me, vw, { cols:[rgbOf(oa), rgbOf(oa)], alpha:0.3, stroke:false }); });
      ctx.save(); ctx.strokeStyle = MV.css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.beginPath(); poly3(ctx, vw, circle3([0, 0, 1], 9), true); ctx.stroke(); ctx.restore();
    } else {
      ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = oa; ctx.beginPath(); ctx.arc(cx, cy, b.r * s, 0, 2 * Math.PI); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = oa; ctx.lineWidth = 2; ctx.stroke();
      if (orb === "2s") { ctx.strokeStyle = MV.css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(cx, cy, 2 * s, 0, 2 * Math.PI); ctx.stroke(); }
      ctx.restore();
    }
  }
  var P = dots(orb, cnt), last = null;
  ctx.save(); ctx.fillStyle = ea; ctx.globalAlpha = 0.72;
  for (var i = 0; i < cnt; i++) { var v = vw.f(P[i][0], P[i][1], P[i][2]), X = cx + s * v[0], Y = cy - s * v[1]; ctx.beginPath(); ctx.arc(X, Y, 1.7, 0, 2 * Math.PI); ctx.fill(); if (i === cnt - 1) last = [X, Y]; }
  ctx.globalAlpha = 1;
  if (latest && last) { ctx.strokeStyle = ea; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(last[0], last[1], 7, 0, 2 * Math.PI); ctx.stroke(); }
  ctx.fillStyle = MV.css("--ink"); ctx.beginPath(); ctx.arc(cx, cy, 2.6, 0, 2 * Math.PI); ctx.fill();
  // scale bar: 100 pm
  var bl = 100 / A0 * s, x0 = 14, y0 = H - 16;
  ctx.strokeStyle = MV.css("--ink"); ctx.lineWidth = 2.5; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + bl, y0); ctx.moveTo(x0, y0 - 5); ctx.lineTo(x0, y0 + 5); ctx.moveTo(x0 + bl, y0 - 5); ctx.lineTo(x0 + bl, y0 + 5); ctx.stroke();
  ctx.font = "12px " + font; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("100 pm", x0, y0 - 7);
  ctx.font = "700 20px " + font; ctx.textBaseline = "top"; ctx.fillText(orb, 10, 8);
  ctx.restore();
}

// @component C12 standingRing — de Broglie-style standing wave on a ring: k wavelengths per lap; laps drawn faint, the
// resultant (average of the laps so far) thick; a whole number of wavelengths closes in step and glows (--hi), any other
// number overlaps out of step and cancels.
var LAPS = 4;
function lapAvg(k, mlap, u){ var s = 0; for (var j = 0; j < mlap; j++) s += Math.sin(2 * Math.PI * k * (j + u)); return s / Math.max(1, mlap); }
function ampAfter(k, mlap){ var re = 0, im = 0; for (var j = 0; j < mlap; j++) { re += Math.cos(2 * Math.PI * k * j); im += Math.sin(2 * Math.PI * k * j); } return Math.hypot(re, im) / Math.max(1, mlap); }
function isWhole(k){ return Math.abs(k - Math.round(k)) < 1e-6; }
function drawRing(ctx, W, H, k, prog, font){
  var mn = Math.min(W, H), cx = W / 2, cy = H / 2, R = mn * 0.31, A = mn * 0.075, pen = MV.css("--pen"), full = Math.floor(prog + 1e-9), part = prog - full, N = 240;
  function path(fn, u1){ ctx.beginPath(); for (var q = 0; q <= N; q++) { var u = q / N * u1, th = 2 * Math.PI * u - Math.PI / 2, r = R + A * fn(u); var X = cx + r * Math.cos(th), Y = cy + r * Math.sin(th); if (q) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } }
  ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = MV.css("--rule"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();
  ctx.fillStyle = MV.css("--ink"); ctx.beginPath(); ctx.arc(cx, cy, 3, 0, 2 * Math.PI); ctx.fill();
  // laps so far (faint)
  ctx.strokeStyle = pen; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.32;
  for (var j = 0; j < Math.min(full, LAPS); j++) { (function(jj){ path(function(u){ return Math.sin(2 * Math.PI * k * (jj + u)); }, 1); ctx.stroke(); })(j); }
  ctx.globalAlpha = 1;
  var whole = isWhole(k), head = null;
  if (full < LAPS && part > 0) {   // the lap being drawn
    ctx.lineWidth = 2.6; path(function(u){ return Math.sin(2 * Math.PI * k * (full + u)); }, part); ctx.stroke();
    var th = 2 * Math.PI * part - Math.PI / 2, rr = R + A * Math.sin(2 * Math.PI * k * (full + part)); head = [cx + rr * Math.cos(th), cy + rr * Math.sin(th)];
  }
  if (full >= 1) {   // resultant of the completed laps (blending toward the next lap)
    var m0 = Math.min(full, LAPS), m1 = Math.min(full + 1, LAPS), tb = full < LAPS ? part : 0;
    var amp = lerp(ampAfter(k, m0), ampAfter(k, m1), tb);
    function res(u){ return lerp(lapAvg(k, m0, u), lapAvg(k, m1, u), tb); }
    if (whole) { ctx.strokeStyle = MV.css("--hi"); ctx.globalAlpha = 0.7; ctx.lineWidth = 12; path(res, 1); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.strokeStyle = pen; ctx.lineWidth = 3.2; ctx.globalAlpha = whole ? 1 : clamp(0.25 + amp, 0.25, 1); path(res, 1); ctx.stroke(); ctx.globalAlpha = 1;
  }
  if (head) { ctx.fillStyle = pen; ctx.beginPath(); ctx.arc(head[0], head[1], 5, 0, 2 * Math.PI); ctx.fill(); }
  ctx.fillStyle = MV.css("--ink"); ctx.font = "700 18px " + font; ctx.textAlign = "left"; ctx.textBaseline = "top";
  ctx.fillText(num(k) + " wavelength" + (k === 1 ? "" : "s"), 10, 8);
  ctx.restore();
}

// ---------- hero: Bohr circle → 1s dot cloud → 2p dumbbell with an address strip ----------
function morphMesh(v){
  var e = SHP;
  return sphereGrid(function(x, y, z){ var r = lerp(1, Math.pow(Math.abs(z), e), v); return { r:r, s:z >= 0 ? 1 : -1 }; });
}
function hero(f){
  var cv = $("#qm-hxc"), addr = $("#qm-hxaddr"), ctr = $("#qm-hxctr"), rep = $("#qm-hxreplay"), cap = f.cap;
  if (!cv) return;
  var TT = 8, t = TT, run = 0, cloud = null, last = -1;
  function cloudPts(){ if (!cloud) { var R = rng(4242); cloud = []; for (var i = 0; i < 420; i++) cloud.push(samp("1s", R)); } return cloud; }
  var hp = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  hp.render = function(){
    hp.draw({ grid:false, axes:false, ticks:false, describe:cv.getAttribute("aria-label"), after:function(ctx, p){
      var W = p.W, H = p.H, font = p.fontUI, x1 = W * 0.27, x2 = W * 0.72, cy = H * 0.5, ink = MV.css("--ink"), ea = MV.css("--e-pair");
      var a = clamp(t / 2.4, 0, 1), u = clamp((t - 2.4) / 2.4, 0, 1), v = clamp((t - 4.8) / 3.2, 0, 1), Rb = H * 0.27;
      // Bohr circle and racing electron
      if (u < 1) {
        ctx.save(); ctx.globalAlpha = 1 - u; ctx.strokeStyle = MV.css("--ink-2"); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x1, cy, Rb, 0, 2 * Math.PI); ctx.stroke();
        var ang = t * 2 * Math.PI * 0.9, ex = x1 + Rb * Math.cos(ang), ey = cy + Rb * Math.sin(ang), blur = 4 + u * 26;
        ctx.globalAlpha = (1 - u) * 0.35; ctx.fillStyle = ea; ctx.beginPath(); ctx.arc(ex, ey, blur, 0, 2 * Math.PI); ctx.fill();
        ctx.globalAlpha = 1 - u; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
      }
      // dot cloud
      var nd = Math.round(420 * smooth(u)), P = cloudPts(), s = H * 0.36 / 2.66;
      ctx.save(); ctx.fillStyle = ea; ctx.globalAlpha = 0.7;
      for (var i = 0; i < nd; i++) { ctx.beginPath(); ctx.arc(x1 + s * P[i][1], cy - s * P[i][2], 1.6, 0, 2 * Math.PI); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x1, cy, 2.6, 0, 2 * Math.PI); ctx.fill();
      // 2p morph
      if (v > 0) {
        var gv = smooth(v * 1.6), mv = smooth((v - 0.15) / 0.6), me = morphMesh(mv);
        if (mv < 0.5) me.Sg = null;
        renderMesh(ctx, me, { f:viewer({ x:0.35, y:-0.5 }), cx:lerp(x1, x2, gv), cy:cy, s:H * 0.36 * lerp(0.55, 1, gv) }, { cols:orbCols(), alpha:clamp(v * 3, 0, 1) });
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(lerp(x1, x2, gv), cy, 2.4, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.fillStyle = ink; ctx.font = "700 16px " + font; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      if (u >= 1) ctx.fillText("1s", x1, H - 6);
      if (v >= 1) ctx.fillText("2p", x2, H - 6);
      if (a > 0 && u < 0.5) { ctx.globalAlpha = 1 - u * 2; ctx.fillText("Bohr orbit", x1, H - 6); ctx.globalAlpha = 1; }
    } });
  };
  var CELLS = [["n", "2"], ["l", "1"], ["m_l", "0"], ["m_s", "+½"]];
  function paintAddr(){
    var v = clamp((t - 4.8) / 3.2, 0, 1), k = v >= 1 ? 4 : Math.floor(v / 0.22);
    if (k === last) return; last = k;
    addr.innerHTML = '<span class="qm-hxlab">Address</span>' + CELLS.map(function(c, i){ return '<span class="qm-hxcell' + (i < k ? " on" : "") + '">' + m(c[0]) + " = " + (i < k ? c[1] : "…") + "</span>"; }).join("");
  }
  function frame(){ hp.render(); paintAddr(); }
  function final(){ t = TT; frame(); ctr.textContent = "Four quantum numbers: shell, shape, direction and spin."; cap.textContent = "A 1s cloud beside a 2p orbital, with one 2p electron’s address."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = ""; t = 0; last = -1; frame();
    ctr.textContent = "Bohr: one electron racing around a fixed circle.";
    MV.tween({ dur:TT * 1000, ease:LIN, step:function(q){
      if (id !== run) return; t = q * TT; frame();
      ctr.textContent = t < 2.4 ? "Bohr: one electron racing around a fixed circle." : t < 4.8 ? "Measure where it is, again and again: a cloud, not a path." : "Each electron gets an address: shell, shape, direction and spin.";
    }, done:function(){ if (id === run) final(); } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Orbital viewer ----------
var ORBS = [{ id:"1s", t:"1s" }, { id:"2s", t:"2s" }, { id:"2p", t:"2p" }];
function explore(host, api){
  var S = api.S, C = api.content;
  if (["orb", "ring", "find"].indexOf(S.mode) < 0) S.mode = "orb";
  var o = S.o = S.o && typeof S.o === "object" ? S.o : {};
  o.n = intIn(o.n, 1, 4, 2); o.l = intIn(o.l, 0, 3, 1); o.ml = intIn(o.ml, -3, 3, 0); o.ms = o.ms === "+" || o.ms === "-" ? o.ms : ""; o.row = !!o.row;
  o.cnt = typeof o.cnt === "string" ? o.cnt.slice(0, 12) : "";
  S.seen = S.seen && typeof S.seen === "object" ? S.seen : {};
  S.k = typeof S.k === "number" && S.k >= 1 && S.k <= 6 ? Math.round(S.k * 4) / 4 : 1;
  var fd = S.f = S.f && typeof S.f === "object" ? S.f : {};
  if (!ORBS.some(function(x){ return x.id === fd.orb; })) fd.orb = "1s";
  fd.cnt = fd.cnt && typeof fd.cnt === "object" ? fd.cnt : {}; ORBS.forEach(function(x){ fd.cnt[x.id] = intIn(fd.cnt[x.id], 0, MAXD, 0); }); fd.bnd = !!fd.bnd;
  var rot = S.rot = S.rot && isFinite(S.rot.x) && isFinite(S.rot.y) ? { x:clamp(+S.rot.x, -1.55, 1.55), y:+S.rot.y } : { x:PRESET.iso.x, y:PRESET.iso.y };
  var locked = false, busy = false, tw = null, run = 0, grey = false, lit = null, note = "", prog = LAPS, latest = false, more = false;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="qm-modes"></div>' +
    '<div class="qm-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="qm-stage"><canvas class="plot qm-main" tabindex="0" role="img" aria-label=""></canvas></div>' +
    '<div class="qm-pre" role="group" aria-label="3D view"><button type="button" class="btn ghost sm" data-pre="iso" data-k="qmpiso">Isometric</button><button type="button" class="btn ghost sm" data-pre="front" data-k="qmpfront">Front</button><button type="button" class="btn ghost sm" data-pre="top" data-k="qmptop">Top</button><span class="tiny muted qm-turn">Drag the view or use the arrow keys to turn it.</span></div>' +
    '<div class="qm-v" data-for="orb"><p class="qm-legend"><span><i class="qm-sw" style="background:var(--orb-a)"></i>one phase</span><span><i class="qm-sw" style="background:var(--orb-b)"></i>other phase</span><span><i class="qm-dash"></i>node</span></p><p class="qm-addr" aria-live="polite"></p>' +
    '<div class="qm-rowwrap" hidden><p class="qm-rowh"></p><canvas class="qm-rowc" role="img" aria-label=""></canvas></div></div>' +
    '<div class="qm-v" data-for="find"><p class="qm-hl">Dots at each distance from the nucleus</p><canvas class="qm-histc" role="img" aria-label=""></canvas></div>' +
    '<p class="qm-cap" aria-live="polite"></p><div class="qm-bar"></div></div>' +
    '<div class="qm-grid"><div class="qm-ctrl">' +
    '<div class="qm-c" data-for="orb"><div class="qm-rn"></div><div class="qm-rl"></div><div class="qm-rml"></div><div class="qm-rms"></div>' +
    '<div class="qm-rowbtn"></div><div class="qm-cntrow"><label for="qm-cnt">' + C.cntLabel + '</label><input id="qm-cnt" class="numin" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(o.cnt) + '"></div><p class="tiny muted">' + md(C.orbNote) + "</p></div>" +
    '<div class="qm-c" data-for="ring"><div class="qm-sl"></div><div class="q-actions"><button type="button" class="btn primary sm" data-q="lap" data-k="qmlap">Send the wave around</button></div><p class="tiny muted">' + md(C.ringNote) + "</p></div>" +
    '<div class="qm-c" data-for="find"><div class="qm-ro"></div><div class="q-actions qm-meas"></div><p class="tiny muted">' + md(C.findNote) + "</p></div>" +
    '</div><div class="qm-right"><dl class="read qm-read" aria-live="polite"></dl><button type="button" class="btn ghost sm qm-more" data-q="more" data-k="qmmore" aria-expanded="false">More readouts</button></div></div>';
  var mainC = $(".qm-main", host), rowWrap = $(".qm-rowwrap", host), cntIn = $("#qm-cnt"), meas = $(".qm-meas", host), rowBtn = $(".qm-rowbtn", host);

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".qm-modes", host), { label:"Mode", aria:"Viewer mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; note = ""; api.save(); paint(); } });
  RG.n = radios($(".qm-rn", host), { label:m("n"), aria:"n, the shell", cls:"chips", options:[1, 2, 3, 4].map(function(v){ return { id:String(v), t:String(v) }; }), value:String(o.n),
    onChange:function(v){ o.n = +v; grey = false; userChange(); } });
  RG.l = radios($(".qm-rl", host), { label:m("l"), aria:"l, the shape", cls:"chips", options:[0, 1, 2, 3].map(function(v){ return { id:String(v), t:String(v) }; }), value:String(o.l),
    extra:function(id){ return grey && +id >= o.n ? { cls:"qm-grey", tag:"<i>l</i> &lt; <i>n</i>" } : null; },
    onChange:function(v){ o.l = +v; userChange(); } });
  RG.ml = radios($(".qm-rml", host), { label:m("m_l"), aria:"m sub l, the orientation", cls:"chips", options:[-3, -2, -1, 0, 1, 2, 3].map(function(v){ return { id:String(v), t:sgnT(v) }; }), value:String(o.ml),
    extra:function(id){ return lit && lit.indexOf(+id) >= 0 ? { cls:"qm-lit" } : null; },
    onChange:function(v){ o.ml = +v; userChange(); } });
  RG.ms = radios($(".qm-rms", host), { label:m("m_s"), aria:"m sub s, the spin", cls:"chips", options:[{ id:"+", t:"+½" }, { id:"-", t:MI + "½" }], value:o.ms,
    onChange:function(v){ o.ms = v; userChange(); } });
  RG.fo = radios($(".qm-ro", host), { label:"Orbital", aria:"Orbital to measure", cls:"chips", options:ORBS, value:fd.orb, onChange:function(v){ fd.orb = v; latest = false; note = ""; api.save(); paint(); } });
  var SL = MV.sliders($(".qm-sl", host), [{ id:"qmk", label:"Wavelengths around the ring", min:1, max:6, step:0.25, value:S.k, fmt:function(v){ return num(v); } }], function(id, v){ cancelAnim(); S.k = v; prog = LAPS; note = ""; api.save(); paint(); });
  function userChange(){ if (lit) lit = null; note = ""; RG.l.paint(); RG.ml.paint(); api.save(); paint(); }
  function paintRowBtn(){ MV.keepFocus(rowBtn, function(){ rowBtn.innerHTML = '<button type="button" class="btn ghost sm" data-q="row" data-k="qmrow" aria-pressed="' + o.row + '"' + (locked ? " disabled" : "") + ">" + (o.row ? "Hide the sublevel row" : "Show every orbital in this sublevel") + "</button>"; }); }
  function paintMeas(){
    var c = fd.cnt[fd.orb], full = c >= MAXD, dis = locked || busy;
    MV.keepFocus(meas, function(){
      meas.innerHTML = '<button type="button" class="btn primary sm" data-q="one" data-k="qmone"' + (dis || full ? " disabled" : "") + ">Measure position</button>" +
        '<button type="button" class="btn ghost sm" data-q="500" data-k="qm500"' + (dis || full ? " disabled" : "") + ">Measure 500 times</button>" +
        '<button type="button" class="btn ghost sm" data-q="bnd" data-k="qmbnd" aria-pressed="' + fd.bnd + '"' + (dis ? " disabled" : "") + ">90% boundary</button>" +
        '<button type="button" class="btn ghost sm" data-q="clr" data-k="qmclr"' + (dis || !c ? " disabled" : "") + ">Clear</button>" + (full ? '<p class="tiny muted qm-full">' + num(MAXD) + " measurements is the limit. Clear to start again.</p>" : "");
    });
  }
  function lock(b){
    locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); });
    var si = $(".qm-sl input", host); if (si) si.disabled = b; cntIn.disabled = b;
    var lb = $('[data-q="lap"]', host); if (lb) lb.disabled = b;
    paintRowBtn(); paintMeas();
  }

  // ----- plots -----
  var mp = new MV.Plot(mainC, { xmin:0, xmax:1, ymin:0, ymax:1 });
  mp.render = function(){ mp.draw({ grid:false, axes:false, ticks:false, describe:describe(), after:function(ctx, p){
    if (S.mode === "orb") drawOrbScene(ctx, p.W, p.H, o, rot, { label:true }, p.fontUI);
    else if (S.mode === "ring") drawRing(ctx, p.W, p.H, S.k, prog, p.fontUI);
    else drawCloud(ctx, p.W, p.H, fd.orb, fd.cnt[fd.orb], fd.bnd, rot, p.fontUI, latest);
  } }); };
  var rp = new MV.Plot($(".qm-rowc", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  rp.render = function(){
    if (rowWrap.hidden) return;
    var k = 2 * o.l + 1;
    rp.draw({ grid:false, axes:false, ticks:false, describe:"The " + k + " orbital" + (k > 1 ? "s" : "") + " of the " + o.n + LET[o.l] + " sublevel in a row, m sub l from " + sgnT(-o.l) + " to " + sgnT(o.l) + ".", after:function(ctx, p){
      var cw = p.W / k, hh = p.H - 20;
      for (var i = 0; i < k; i++) {
        var ml = i - o.l; ctx.save(); ctx.translate(i * cw, 0);
        drawOrbScene(ctx, cw, hh, { n:o.n, l:o.l, ml:ml }, rot, { small:true, axes:false }, p.fontUI);
        ctx.fillStyle = MV.css(ml === o.ml ? "--ink" : "--ink-2"); ctx.font = (ml === o.ml ? "700 " : "") + "12.5px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillText("mₗ = " + sgnT(ml), cw / 2, p.H - 3); ctx.restore();
      }
    } });
  };
  var hp = new MV.Plot($(".qm-histc", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  hp.render = function(){
    if (S.mode !== "find") return;
    var orb = fd.orb, c = fd.cnt[orb], h = radial(orb, c), mx = Math.max.apply(null, h.concat([1])), top = Math.max(10, Math.ceil(mx / 10) * 10);
    hp.draw({ grid:false, axes:false, ticks:false, describe:c ? "Radial count for " + orb + ": " + c + " dots in 25 pm bins out to 700 pm; the tallest bin is " + binT(h) + " from the nucleus." + (orb === "2s" ? " There is a gap near 106 pm: the spherical node." : "") : "Radial count: no measurements yet.", after:function(ctx, p){
      var W = p.W, H = p.H, L = 40, Rm = 10, T = 12, B = 30, ph = H - T - B, pw = W - L - Rm, bw = pw / NBIN, fu = p.fontUI, ink2 = MV.css("--ink-2");
      ctx.font = "12px " + fu; ctx.fillStyle = ink2; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      [0, top / 2, top].forEach(function(g){ var y = T + ph - g / top * ph; ctx.strokeStyle = MV.css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Math.round(y) + 0.5); ctx.lineTo(W - Rm, Math.round(y) + 0.5); ctx.stroke(); ctx.fillText(num(g), L - 6, y); });
      ctx.fillStyle = MV.css("--e-pair");
      h.forEach(function(v, i){ var hh = v / top * ph; if (v) ctx.fillRect(L + i * bw + 1, T + ph - hh, Math.max(1, bw - 2), hh); });
      ctx.strokeStyle = MV.css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, T + ph + 0.5); ctx.lineTo(W - Rm, T + ph + 0.5); ctx.stroke();
      ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var d = 0; d <= 700; d += 100) ctx.fillText(String(d), L + d / BIN * bw, T + ph + 5);
      ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("distance (pm)", W - Rm, H - 1);
      function mark(dpm, lab, col){ var x = L + dpm / BIN * bw; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, T + ph); ctx.stroke(); ctx.restore(); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(lab, x + 4, T); }
      if (orb === "2s") mark(2 * A0, "node", ink2);
      if (fd.bnd && orb !== "2p") mark(bound(orb).r * A0, "90%", MV.css("--orb-a"));
    } });
  };
  function binT(h){ var bi = 0; h.forEach(function(v, i){ if (v > h[bi]) bi = i; }); return bi * BIN + "–" + (bi + 1) * BIN + " pm"; }

  // ----- rotation (drag, arrow keys, presets) -----
  var drag = null;
  mainC.addEventListener("pointerdown", function(e){ if (S.mode === "ring") return; drag = { x:e.clientX, y:e.clientY }; try { mainC.setPointerCapture(e.pointerId); } catch (er) {} });
  mainC.addEventListener("pointermove", function(e){ if (!drag) return; rot.y += (e.clientX - drag.x) * 0.012; rot.x = clamp(rot.x + (e.clientY - drag.y) * 0.012, -1.55, 1.55); drag = { x:e.clientX, y:e.clientY }; turned(); });
  function endDrag(){ if (drag) { drag = null; api.save(); } }
  mainC.addEventListener("pointerup", endDrag); mainC.addEventListener("pointercancel", endDrag);
  mainC.addEventListener("keydown", function(e){
    if (S.mode === "ring") return;
    var k = e.key, d = 15 * Math.PI / 180;
    if (k === "ArrowLeft") rot.y -= d; else if (k === "ArrowRight") rot.y += d; else if (k === "ArrowUp") rot.x = clamp(rot.x - d, -1.55, 1.55); else if (k === "ArrowDown") rot.x = clamp(rot.x + d, -1.55, 1.55); else return;
    e.preventDefault(); api.save(); turned();
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pre]"); if (!b) return; rot.x = PRESET[b.dataset.pre].x; rot.y = PRESET[b.dataset.pre].y; api.save(); turned(); });
  function turned(){ mp.render(); rp.render(); }

  // ----- buttons and the count box -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-q]"); if (!b || b.disabled) return;
    var q = b.dataset.q;
    if (q === "more") { more = !more; host.classList.toggle("qm-showmore", more); b.setAttribute("aria-expanded", String(more)); b.textContent = more ? "Fewer readouts" : "More readouts"; return; }
    if (locked) return;
    if (q === "row") { o.row = !o.row; if (lit) lit = null; api.save(); paint(); return; }
    if (q === "lap") { lapAnim(3200, null); return; }
    var c = fd.cnt[fd.orb];
    if (q === "one") { fd.cnt[fd.orb] = Math.min(MAXD, c + 1); latest = true; }
    else if (q === "500") { fd.cnt[fd.orb] = Math.min(MAXD, c + 500); latest = false; }
    else if (q === "bnd") fd.bnd = !fd.bnd;
    else if (q === "clr") { fd.cnt[fd.orb] = 0; latest = false; }
    note = ""; api.save(); paint();
  });
  cntIn.addEventListener("input", function(){ o.cnt = cntIn.value.slice(0, 12); api.save(); MV.changed(); });

  // ----- animations -----
  function cancelAnim(){ run++; if (tw) { tw(); tw = null; } busy = false; prog = LAPS; }
  function lapAnim(dur, cb){
    cancelAnim(); var id = run; busy = true; lock(true); prog = 0; paint();
    tw = MV.tween({ dur:dur, ease:LIN, step:function(t){ if (id !== run) return; prog = t * LAPS; mp.render(); }, done:function(){ if (id !== run) return; tw = null; prog = LAPS; busy = false; lock(false); paint(); if (cb) cb(); } });
  }

  // ----- readouts, caption, address -----
  function rowsHTML(rows){ return rows.map(function(r){ return "<div" + (r[2] ? ' class="qm-ex"' : "") + "><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join(""); }
  function paintRead(){
    var rows = [], md0 = S.mode;
    if (md0 === "orb") {
      var n = o.n, l = o.l, ml = o.ml, br = broken(n, l, ml), subOK = l <= n - 1, k = 2 * l + 1, dash = muted("—");
      rows.push(["Allowed?", br ? "<strong>" + md(RULE_T[br]) + "</strong>" : "Yes"]);
      rows.push(["Notation", !subOK ? dash : n + LET[l] + (br ? muted(" (no orbital with " + m("m_l = " + sgnT(ml)) + ")") : "")]);
      rows.push(["Shape", subOK && !br ? shapeT(n, l, ml) : dash, 1]);
      rows.push(["Orbitals in this sublevel", subOK ? k + " " + muted("(" + m("2l + 1") + ")") : dash]);
      rows.push(["Electrons this sublevel can hold", subOK ? 2 * k + " " + muted("(" + m("2(2l + 1)") + ")") : dash]);
      rows.push(["Orbitals in this shell", n * n + " " + muted("(" + m("n^2") + ")"), 1]);
      rows.push(["Electrons this shell can hold", 2 * n * n + " " + muted("(" + m("2n^2") + ")"), 1]);
      rows.push(["Nodes", br ? dash : nodesT(n, l, ml), 1]);
    } else if (md0 === "ring") {
      var w = isWhole(S.k);
      rows.push(["Wavelengths around the ring", num(S.k)]);
      rows.push(["Ring", w ? plural(S.k, "wavelength") + ": the wave closes: an allowed state" : num(S.k) + " wavelengths: the wave overlaps itself out of step and cancels"]);
      rows.push(["Wave after " + LAPS + " laps", busy ? muted("watch the laps…") : w ? "100%: every lap lands in step, so the wave builds up" : Math.round(ampAfter(S.k, LAPS) * 100) + "%: the laps cancel each other"]);
      rows.push(["Energy", w ? "Allowed" : "Not allowed"]);
    } else {
      var orb = fd.orb, c = fd.cnt[orb], ins = 0;
      dots(orb, c).slice(0, c).forEach(function(p){ if (inside(orb, p)) ins++; });
      rows.push(["Orbital", orb === "2p" ? "2p " + muted("(" + m("m_l = 0") + ")") : orb]);
      rows.push(["Shape", orb === "1s" ? "Sphere" : orb === "2s" ? "Sphere, larger than 1s, with one spherical node inside" : "Dumbbell"]);
      rows.push(["Measurements", num(c)]);
      rows.push(["Inside the 90% boundary", c ? num(ins) + " of " + num(c) + " (" + Math.round(ins / c * 100) + "%)" : dash0()]);
      rows.push(["Most dots found", c >= 20 ? binT(radial(orb, c)) + " from the nucleus" : muted("measure more first")]);
    }
    $(".qm-read", host).innerHTML = rowsHTML(rows);
  }
  function dash0(){ return muted("—"); }
  function paintAddr(){
    var a = $(".qm-addr", host), arrow = o.ms === "+" ? "↑" : o.ms === "-" ? "↓" : "";
    a.innerHTML = '<span class="qm-al">Address</span> ' + m("(n, l, m_l, m_s)") + " = <strong>(" + o.n + ", " + o.l + ", " + mlT(o.ml) + ", " + (o.ms ? spinT(o.ms) : "?") + ")</strong>" +
      ' <span class="qm-box" role="img" aria-label="' + (o.ms ? "Orbital box: one electron, spin " + (o.ms === "+" ? "up" : "down") : "Orbital box: empty until you set the spin") + '">' + arrow + "</span>" + (o.ms ? "" : muted(" set the spin to add the electron"));
  }
  function paintCap(){
    var t = "";
    if (S.mode === "orb") { var br = broken(o.n, o.l, o.ml); t = br ? md(RULE_T[br]) + "." : o.n + LET[o.l] + ", " + m("m_l = " + sgnT(o.ml)) + ": " + shapeT(o.n, o.l, o.ml).charAt(0).toLowerCase() + shapeT(o.n, o.l, o.ml).slice(1) + "."; }
    else if (S.mode === "ring") t = busy ? "The wave travels around the ring, lap after lap…" : isWhole(S.k) ? "Every lap lands in step: the wave closes on itself and glows." : "Each lap lands out of step with the last, so the laps cancel.";
    else { var c = fd.cnt[fd.orb]; t = c ? num(c) + " measurement" + (c > 1 ? "s" : "") + ": " + (c < 50 ? "keep measuring to see the pattern." : "the dots build up a cloud, densest where the electron is most likely to be.") : "Press <strong>Measure position</strong> to find the electron once, or measure 500 times."; }
    $(".qm-cap", host).innerHTML = t + (note ? " " + note : "");
  }
  function describe(){
    if (S.mode === "orb") {
      var br = broken(o.n, o.l, o.ml);
      if (br) return RULE_P[br] + ". No orbital is drawn.";
      var nc = nodeCount(o.n, o.l, o.ml);
      return "3D view of the " + o.n + LET[o.l] + " orbital with m sub l = " + sgnT(o.ml) + ": " + shapeT(o.n, o.l, o.ml).toLowerCase() + (o.l ? ", with lobes in two phases, blue and orange" : "") + ". Nodes drawn as dashed lines: " + (nc.sph + nc.pl + nc.co ? nodesT(o.n, o.l, o.ml) : "none") + ". Drag it or use the arrow keys to turn it.";
    }
    if (S.mode === "ring") return "Standing-wave ring with " + num(S.k) + " wavelengths. " + (isWhole(S.k) ? "Every lap lands in step, so the wave closes on itself and glows." : "The laps overlap out of step and the wave cancels to a flat ring.");
    var c = fd.cnt[fd.orb];
    return "Find the electron, " + fd.orb + ": " + c + " measured positions" + (c ? (fd.orb === "2p" ? " form two lobes above and below the nucleus" : " form a fuzzy ball, densest near the nucleus") : "") + (fd.bnd ? ", with the 90% boundary drawn" : "") + ". A 100 pm scale bar is at the bottom left.";
  }
  function paint(){
    var md0 = S.mode;
    $$(".qm-c", host).forEach(function(p){ p.hidden = p.dataset.for !== md0; });
    $$(".qm-v", host).forEach(function(p){ p.hidden = p.dataset.for !== md0; });
    $(".qm-pre", host).hidden = md0 === "ring";
    host.classList.toggle("qm-orbmode", md0 === "orb");
    mainC.style.touchAction = md0 === "ring" ? "pan-y" : "none";
    if (md0 === "orb") {
      if (!broken(o.n, o.l, o.ml)) { var key = o.n + "," + o.l + "," + o.ml; if (!S.seen[key]) { S.seen[key] = 1; api.save(); } }
      rowWrap.hidden = !o.row || o.l > o.n - 1;
      $(".qm-rowh", host).innerHTML = o.l > o.n - 1 ? "" : "Every orbital in the " + o.n + LET[o.l] + " sublevel: " + plural(2 * o.l + 1, "orbital") + ", " + m("m_l") + " from " + sgnT(-o.l) + " to " + sgnT(o.l) + ".";
      $(".qm-rowc", host).style.aspectRatio = String(Math.max(2.6, (2 * o.l + 1) / 1.25));
      paintAddr(); paintRowBtn();
    }
    if (md0 === "find") paintMeas();
    mp.render(); rp.render(); hp.render();
    paintRead(); paintCap();
    MV.changed();
  }
  function syncRG(){ RG.mode.set(S.mode); RG.n.set(o.n); RG.l.set(o.l); RG.ml.set(o.ml); RG.ms.set(o.ms); RG.fo.set(fd.orb); RG.l.paint(); RG.ml.paint(); SL.set("qmk", S.k); }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancelAnim(); grey = false; lit = null; note = ""; latest = false;
      if (p.id === "p1") { S.mode = "orb"; o.n = 2; o.l = 0; o.ml = 0; o.row = false; }
      else if (p.id === "p2") { S.mode = "ring"; S.k = 2.5; prog = 0; }
      else if (p.id === "p3") { S.mode = "orb"; o.n = 3; o.l = 2; o.ml = 0; o.row = false; }
      else { S.mode = "find"; fd.orb = "1s"; fd.cnt["1s"] = 0; fd.bnd = false; }
      syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      var id = run;
      function fin(n){ if (id !== run) return; note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      function step(ms, fn){ MV.wait(ms, function(){ if (id === run) fn(); }); }
      if (p.id === "p1") {
        step(600, function(){ o.l = 1; RG.l.set("1"); api.save(); paint();
          step(1000, function(){ o.l = 2; grey = true; RG.l.set("2"); RG.l.paint(); api.save(); paint();
            step(900, function(){ fin("In shell 2, " + m("l = 2") + " breaks the rule " + m("l < n") + ": only 2s and 2p exist."); }); }); });
      } else if (p.id === "p2") {
        busy = true; prog = 0;
        tw = MV.tween({ dur:3600, ease:LIN, step:function(t){ if (id !== run) return; prog = t * LAPS; mp.render(); }, done:function(){
          if (id !== run) return; tw = null; prog = LAPS; paint();
          step(500, function(){
            tw = MV.tween({ dur:1400, step:function(t){ if (id !== run) return; S.k = lerp(2.5, 3, t); mp.render(); }, done:function(){
              if (id !== run) return; tw = null; S.k = 3; SL.set("qmk", 3); api.save();
              fin("At 2.5 the laps cancel; at 3.0 every lap lands in step and the wave glows.");
            } });
          });
        } });
      } else if (p.id === "p3") {
        lit = []; var seq = [-2, -1, 0, 1, 2];
        (function next(i){
          if (i < seq.length) { lit.push(seq[i]); RG.ml.paint(); step(380, function(){ next(i + 1); }); return; }
          o.row = true; api.save(); paint();
          step(700, function(){ fin("Five " + m("m_l") + " values, five orbitals: " + m("2l + 1 = 5") + "."); });
        })(0);
      } else {
        busy = true;
        bound("1s");
        tw = MV.tween({ dur:2200, ease:LIN, step:function(t){ if (id !== run) return; fd.cnt["1s"] = Math.round(500 * t); mp.render(); }, done:function(){
          if (id !== run) return; tw = null; fd.cnt["1s"] = 500; fd.bnd = true; api.save();
          fin("A fuzzy ball, densest near the nucleus. About 90% of the dots lie inside the boundary.");
        } });
      }
    }
  };

  // ----- challenges -----
  function chal(id){
    var n = o.n, l = o.l, ml = o.ml;
    if (id === "tc1") {
      if (l === 3 && n < 4) return { ok:false, msg:"Not allowed: " + m("l") + " must be less than " + m("n") + "." };
      if (l === 2) return { ok:false, msg:"That’s a d orbital." };
      if (l === 1) return { ok:false, msg:"That’s a p orbital." };
      if (l === 0) return { ok:false, msg:"That’s an s orbital." };
      if (S.mode !== "orb") return { ok:false, msg:"Switch to Orbital mode to show it." };
      return { ok:true };
    }
    if (id === "tc2") {
      if (n === 3 && l === 2 && ml === -1 && o.ms === "-") return { ok:false, msg:m("l = 2") + " is d." };
      if (n === 3 && l === 1 && ml === -1 && o.ms === "+") return { ok:false, msg:"Spin should be −½." };
      if (n !== 3) return { ok:false, msg:"3p is in the third shell: set " + m("n = 3") + "." };
      if (l !== 1) return { ok:false, msg:"p means " + m("l = 1") + "." };
      if (ml !== -1) return { ok:false, msg:"Set " + m("m_l = -1") + "." };
      if (!o.ms) return { ok:false, msg:"Now set the spin." };
      return { ok:true };
    }
    if (id === "tc3") {
      var raw = String(o.cnt || "").trim(), v = /^\d+$/.test(raw) ? +raw : null;
      if (v == null) return { ok:false, msg:"Enter your count in the Challenge 3 box (Orbital mode) first." };
      if (v === 2) return { ok:false, msg:"More than one sublevel has an " + m("m_l = 0") + " orbital." };
      if (v === 4) return { ok:false, msg:"4 orbitals, but each holds 2 electrons." };
      if (v === 32) return { ok:false, msg:"That’s every electron with " + m("n = 4") + "." };
      if (v !== 8) return { ok:false, msg:"Count the orbitals with " + m("n = 4") + " and " + m("m_l = 0") + ", then double for electrons." };
      var need = ["4,0,0", "4,1,0", "4,2,0", "4,3,0"], got = need.filter(function(k){ return S.seen[k]; }).length;
      if (got < 4) return { ok:false, msg:"8 is right. Now show each orbital they occupy in Orbital mode: " + got + " of 4 shown so far." };
      return { ok:true };
    }
    return { ok:false };
  }
  lock(false); paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Quantum numbers puzzle ----------
function intList(s){
  var t = String(s || "").replace(/[−–]/g, "-").replace(/[;+&]/g, ",").replace(/\band\b/gi, ",").trim(); if (!t) return null;
  var parts = t.split(/[\s,]+/).filter(Boolean), out = [];
  for (var i = 0; i < parts.length; i++) { if (!/^-?\d+$/.test(parts[i])) return null; out.push(+parts[i]); }
  return out;
}
function sameSet(a, b){ if (!a || a.length !== b.length) return false; var x = a.slice().sort(function(p, q){ return p - q; }), y = b.slice().sort(function(p, q){ return p - q; }); return x.every(function(v, i){ return v === y[i]; }); }
function letList(s){ var t = String(s || "").toLowerCase().replace(/[^a-z]/g, ""); if (!t || /[^spdf]/.test(t)) return t ? "bad" : null; return t.split(""); }
function judgeCell(n, id, raw){
  var M2 = "`l` runs from 0 up to `n - 1`. In shell 3: 0, 1, 2 (s, p, d).", M3 = "`m_l` runs from `-l` to `+l`, giving `2l + 1` orbitals.", M7 = "Count orbitals first, then double for electrons.";
  var ls = [], i; for (i = 0; i < n; i++) ls.push(i);
  if (id === "l") { var a = intList(raw); if (!a) return "Type whole numbers separated by commas."; if (sameSet(a, ls)) return ""; return M2; }
  if (id === "let") { var b = letList(raw); if (!b) return "Type the letters, such as s, p."; if (b === "bad") return "Use the letters s, p, d and f."; return sameSet(b.map(function(c){ return LET.indexOf(c); }), ls) ? "" : "Letters follow `l`: 0 is s, 1 is p, 2 is d, 3 is f."; }
  if (id === "orb") { var c = intList(raw), want = ls.map(function(x){ return 2 * x + 1; }); if (!c) return "Type whole numbers separated by commas."; if (sameSet(c, want)) return ""; if (sameSet(c, want.map(function(x){ return 2 * x; }))) return "Those are electrons. " + M7; return M3; }
  var v = intList(raw); if (!v || v.length !== 1) return "Type one whole number.";
  if (id === "sh") return v[0] === n * n ? "" : v[0] === 2 * n * n ? "That’s electrons. " + M7 : "Add the orbitals in every sublevel: `n^2`.";
  return v[0] === 2 * n * n ? "" : (v[0] === 8 && n > 2) ? "8 is the s + p total of the outer shell. Shell `n` holds `2n^2`: 2, 8, 18, 32." : v[0] === n * n ? M7 : "Double the number of orbitals: `2n^2`.";
}
// density map of methanal (model): atoms in Å; the map is drawn mirrored (O on the right)
// (model: each atom's density is a Gaussian bump, tallest for O, then C, then H; the map shows O on the right, the model on the left)
var DM = { atoms:[{ el:"O", x:1.21, y:0, z:8, w:0.42 }, { el:"C", x:0, y:0, z:6, w:0.45 }, { el:"H", x:-0.588, y:0.941, z:1.6, w:0.42 }, { el:"H", x:-0.588, y:-0.941, z:1.6, w:0.42 }],
  view:{ x0:-1.7, x1:2.3, y0:-1.6, y1:1.6 }, ridges:[{ id:"r1", t:"1", a:1, b:2 }, { id:"r2", t:"2", a:0, b:1 }, { id:"r3", t:"3", a:1, b:3 }] };
var BOND_RIDGE = { co:"r2", ch1:"r1", ch2:"r3" };
function dens(x, y){ var s = 0; DM.atoms.forEach(function(a){ var d = Math.hypot(x - a.x, y - a.y) / a.w; s += a.z * Math.exp(-d * d); }); return s; }
var CONT = null;
function contours(){
  if (CONT) return CONT;
  var V = DM.view, NX = 120, NY = 96, gx = [], i, j;
  for (j = 0; j <= NY; j++) { var row = []; for (i = 0; i <= NX; i++) row.push(dens(V.x0 + (V.x1 - V.x0) * i / NX, V.y0 + (V.y1 - V.y0) * j / NY)); gx.push(row); }
  var levels = [], L = [];
  for (var k = 0; k < 12; k++) levels.push(0.1 * Math.pow(1.45, k));
  levels.forEach(function(lv, li){
    var seg = [];
    for (j = 0; j < NY; j++) for (i = 0; i < NX; i++) {
      var v0 = gx[j][i], v1 = gx[j][i + 1], v2 = gx[j + 1][i + 1], v3 = gx[j + 1][i];
      var idx = (v0 > lv ? 1 : 0) | (v1 > lv ? 2 : 0) | (v2 > lv ? 4 : 0) | (v3 > lv ? 8 : 0); if (!idx || idx === 15) continue;
      function e(pa, pb, va, vb){ var tt = (lv - va) / (vb - va); return [pa[0] + (pb[0] - pa[0]) * tt, pa[1] + (pb[1] - pa[1]) * tt]; }
      var P0 = [i, j], P1 = [i + 1, j], P2 = [i + 1, j + 1], P3 = [i, j + 1];
      var eT = e(P0, P1, v0, v1), eR = e(P1, P2, v1, v2), eB = e(P3, P2, v3, v2), eL = e(P0, P3, v0, v3), S2 = {
        1:[[eL, eT]], 2:[[eT, eR]], 3:[[eL, eR]], 4:[[eR, eB]], 5:[[eL, eT], [eR, eB]], 6:[[eT, eB]], 7:[[eL, eB]], 8:[[eB, eL]], 9:[[eB, eT]], 10:[[eT, eR], [eB, eL]], 11:[[eB, eR]], 12:[[eR, eL]], 13:[[eR, eT]], 14:[[eT, eL]] }[idx];
      S2.forEach(function(s){ seg.push([s[0][0] / NX, s[0][1] / NY, s[1][0] / NX, s[1][1] / NY]); });
    }
    L.push({ li:li, seg:seg });
  });
  return (CONT = L);
}
function mapXY(x, y){ var V = DM.view; return [(x - V.x0) / (V.x1 - V.x0), 1 - (y - V.y0) / (V.y1 - V.y0)]; }   // fractions of the box (y up)
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.t = S.t && typeof S.t === "object" ? S.t : {}; S.c = S.c && typeof S.c === "object" ? S.c : {}; S.dm = S.dm && typeof S.dm === "object" ? S.dm : {}; S.dm.m = S.dm.m && typeof S.dm.m === "object" ? S.dm.m : {};
  var msgs = {}, cardMsg = {}, dmMsg = null, dmSel = null;
  function row(n){ var r = S.t[n] || (S.t[n] = {}); s1.cols.forEach(function(c){ if (typeof r[c.id] !== "string") r[c.id] = ""; }); return r; }
  // station 1
  var dt = s1.data;
  host.innerHTML = '<div class="part qm-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="qm-shells"></div><p class="qm-tdone" aria-live="polite"></p>' +
    '<details class="alg"><summary>' + md(dt.summary) + "</summary><p>" + dt.intro + "</p>" +
    MV.tableHTML({ head:["Shell " + m("n"), "1", "2", "3", "4"], rows:[[m("2n^2") + " (electrons)", "2", "8", "18", "32"]], caption:"Shell capacities" }) +
    MV.tableHTML({ head:["Period"].concat(dt.periods.map(function(_, i){ return String(i + 1); })), rows:[["Elements"].concat(dt.periods.map(String))], caption:"Number of elements in each period" }) +
    '<div class="qm-pbars" role="img" aria-label="Bars comparing period lengths 2, 8, 8, 18, 18, 32, 32 with shell capacities 2, 8, 18, 32: the numbers match, but each one after the first appears twice."></div><p><strong>' + md(dt.note) + "</strong></p></details></div>" +
    '<div class="part qm-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="qm-cards"></div></div>' +
    '<div class="part qm-st"><h3>' + s3.title + "</h3>" + s3.html + "<p>" + s3.task + '</p><div class="qm-dmgrid"><div class="qm-dmmod"><p class="qm-hl">Ball-and-stick model</p><svg class="qm-bs" viewBox="0 0 300 220" role="img" aria-label="Ball-and-stick model of methanal: O on the left, joined by a double bond to C; C joined to an H at the top right and an H at the bottom right."></svg><div class="qm-bonds" role="group" aria-label="Bonds"></div></div>' +
    '<div class="qm-dmmap"><p class="qm-hl">Electron density map (flipped)</p><div class="qm-dmbox"><canvas class="qm-dmc" role="img" aria-label="Contour map of methanal’s electron density, flipped left to right: the tallest peak (most rings) on the right, a slightly smaller peak in the middle, and two small peaks on the left, top and bottom. Ridges of density join the middle peak to each of the others; they are marked 1 (top), 2 (between the two big peaks) and 3 (bottom)."></canvas><div class="qm-ridges"></div></div><p class="tiny muted">' + s3.mapNote + '</p></div></div><div class="qm-dmfb"></div></div>';
  var shells = $(".qm-shells", host);
  function shellHTML(n){
    var r = row(n), res = r.res;
    return '<div class="qm-shell" data-sh="' + n + '"><h4>Shell ' + m("n = " + n) + (res === "ok" ? ' <span class="qm-ok">✓</span>' : "") + '</h4><div class="qm-cells">' + s1.cols.map(function(c){
      var bad = msgs[n] && msgs[n].cell === c.id;
      return '<label class="qm-cell"><span>' + md(c.label) + '</span><input class="numin" type="text" inputmode="' + (c.id === "let" ? "text" : "numeric") + '" autocomplete="off" spellcheck="false" data-sh="' + n + '" data-cell="' + c.id + '" value="' + esc(r[c.id]) + '"' + (res === "ok" ? " disabled" : "") + (bad ? ' aria-invalid="true"' : "") + "></label>";
    }).join("") + "</div>" + (res === "ok" ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-shchk="' + n + '" data-k="shchk' + n + '">Check row</button></div>') +
      (msgs[n] ? MV.fbHTML(msgs[n].ok ? "good" : msgs[n].soft ? "" : "bad", msgs[n].html) : "") + "</div>";
  }
  function paintShells(){
    MV.keepFocus(shells, function(){ shells.innerHTML = [1, 2, 3, 4].map(shellHTML).join(""); });
    var all = [1, 2, 3, 4].every(function(n){ return row(n).res === "ok"; });
    $(".qm-tdone", host).innerHTML = all ? "<strong>Table complete.</strong> Each shell has " + m("n^2") + " orbitals and holds " + m("2n^2") + " electrons: 2, 8, 18, 32. Now check it against the periodic table below." : "";
  }
  function checkRow(n, auto){
    var r = row(n), empty = s1.cols.filter(function(c){ return !r[c.id].trim(); });
    if (empty.length) { if (!auto) msgs[n] = { soft:true, html:"Fill in every box in this row first." }; paintShells(); return; }
    var bad = null;
    s1.cols.some(function(c){ var w = judgeCell(n, c.id, r[c.id]); if (w) { bad = { cell:c.id, html:"<strong>✗ Not quite.</strong> " + MV.plain(md(c.label)).replace(/\s*\(.*\)$/, "") + ": " + md(w) }; return true; } return false; });
    if (bad) { r.res = "bad"; msgs[n] = bad; }
    else { r.res = "ok"; msgs[n] = { ok:true, html:"<strong>✓ Shell " + n + ":</strong> " + (n === 1 ? "one sublevel (1s), 1 orbital, 2 electrons." : plural(n, "sublevel") + " (" + LET.slice(0, n).map(function(x){ return n + x; }).join(", ") + "), " + n * n + " orbitals, " + 2 * n * n + " electrons.") }; }
    api.save(); paintShells();
    var box = shells.querySelector('[data-sh="' + n + '"]'); if (box) MV.focusFb(box);
  }
  shells.addEventListener("input", function(e){ var d = e.target.dataset; if (!d.cell) return; var r = row(+d.sh); r[d.cell] = e.target.value.slice(0, 40); if (r.res === "bad") r.res = null; api.save(); });
  shells.addEventListener("change", function(e){ var d = e.target.dataset; if (!d.cell) return; var r = row(+d.sh); if (s1.cols.every(function(c){ return r[c.id].trim(); })) checkRow(+d.sh, true); });
  shells.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset.cell) { e.preventDefault(); checkRow(+e.target.dataset.sh, false); } });
  shells.addEventListener("click", function(e){ var b = e.target.closest("[data-shchk]"); if (b) checkRow(+b.dataset.shchk, false); });
  paintShells();
  // period bars
  (function(){
    var P = dt.periods, cap = [2, 8, 18, 32], h = '<svg viewBox="0 0 420 150" class="qm-pbsvg" aria-hidden="true">', bw = 40, gap = 16, base = 120, sc = 90 / 32;
    P.forEach(function(v, i){ var x = 20 + i * (bw + gap), hh = v * sc, ci = cap.indexOf(v); h += '<rect x="' + x + '" y="' + (base - hh) + '" width="' + bw + '" height="' + hh + '" rx="3" fill="var(--pen)" opacity="' + (i === 0 || P[i - 1] !== v ? 1 : 0.55) + '"/><text x="' + (x + bw / 2) + '" y="' + (base - hh - 6) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">' + v + '</text><text x="' + (x + bw / 2) + '" y="' + (base + 16) + '" text-anchor="middle" font-size="12" fill="var(--ink-2)">P' + (i + 1) + (ci >= 0 && (i === 0 || P[i - 1] !== v) ? " (n=" + (ci + 1) + ")" : "") + "</text>"; });
    $(".qm-pbars", host).innerHTML = h + '<text x="20" y="146" font-size="12" fill="var(--ink-2)">Faded bars repeat the length before them.</text></svg>';
  })();
  // station 2
  var cardsBox = $(".qm-cards", host);
  function paintCards(){
    MV.keepFocus(cardsBox, function(){
      cardsBox.innerHTML = s2.cards.map(function(c){
        var st = S.c[c.id] || {}, ok = MV.ans(c) === "ok";
        if (st.done) return '<div class="qm-card done' + (st.flip ? " qm-flip" : "") + '" data-card="' + c.id + '"><p class="qm-ct">' + c.t + '</p><p class="qm-back"><strong>' + (ok ? "✓ " : "✗ ") + "</strong>" + md(c.back) + "</p></div>";
        return '<div class="qm-card" data-card="' + c.id + '"><p class="qm-ct">' + c.t + '</p><div class="qm-cbtn"><button type="button" class="btn ghost sm" data-cv="ok" data-k="' + c.id + 'ok">Allowed</button><button type="button" class="btn ghost sm" data-cv="no" data-k="' + c.id + 'no">Not allowed</button></div>' +
          (cardMsg[c.id] ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + md(s2.wrong)) : "") + "</div>";
      }).join("");
    });
  }
  cardsBox.addEventListener("click", function(e){
    var b = e.target.closest("[data-cv]"); if (!b) return;
    var id = b.closest("[data-card]").dataset.card, c = s2.cards.filter(function(x){ return x.id === id; })[0], st = S.c[id] || (S.c[id] = { tries:0 });
    if (b.dataset.cv === MV.ans(c)) { st.done = true; cardMsg[id] = false; Object.keys(S.c).forEach(function(k){ if (S.c[k]) S.c[k].flip = k === id; }); }
    else { st.tries = (st.tries || 0) + 1; cardMsg[id] = true; }
    api.save(); paintCards();
    var box = cardsBox.querySelector('[data-card="' + id + '"]'); if (box) { var f = box.querySelector(".fb, .qm-back"); if (f) { f.setAttribute("tabindex", "-1"); f.focus({ preventScroll:true }); } }
  });
  paintCards();
  // station 3: ball-and-stick (O on the left) and the mirrored density map
  var BS = { O:[60, 110], C:[160, 110], H1:[212, 28], H2:[212, 192] };
  (function(){
    var h = "", ink = "var(--ink)";
    function bond(a, b, dbl){ var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 5, ny = dx / L * 5; if (dbl) return '<line x1="' + (a[0] + nx) + '" y1="' + (a[1] + ny) + '" x2="' + (b[0] + nx) + '" y2="' + (b[1] + ny) + '" stroke="var(--ink-2)" stroke-width="5"/><line x1="' + (a[0] - nx) + '" y1="' + (a[1] - ny) + '" x2="' + (b[0] - nx) + '" y2="' + (b[1] - ny) + '" stroke="var(--ink-2)" stroke-width="5"/>'; return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="var(--ink-2)" stroke-width="5"/>'; }
    function ball(el, p, r){ var at = MV.chem.atom(el); return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '" fill="' + at.fill + '"' + (at.line !== "none" ? ' stroke="' + at.line + '" stroke-width="2"' : "") + '/><text x="' + p[0] + '" y="' + (p[1] + 1) + '" text-anchor="middle" dominant-baseline="central" font-size="' + Math.round(r * 0.95) + '" font-weight="700" fill="' + at.ink + '">' + el + "</text>"; }
    h += bond(BS.O, BS.C, true) + bond(BS.C, BS.H1) + bond(BS.C, BS.H2);
    h += '<text x="110" y="92" text-anchor="middle" font-size="13" fill="' + ink + '">C=O</text><text x="200" y="74" text-anchor="start" font-size="13" fill="' + ink + '">C–H</text><text x="200" y="152" text-anchor="start" font-size="13" fill="' + ink + '">C–H</text>';
    h += ball("O", BS.O, 26) + ball("C", BS.C, 24) + ball("H", BS.H1, 16) + ball("H", BS.H2, 16);
    $(".qm-bs", host).innerHTML = h;
  })();
  var dmc = $(".qm-dmc", host), dp = new MV.Plot(dmc, { xmin:0, xmax:1, ymin:0, ymax:1 });
  dp.render = function(){ dp.draw({ grid:false, axes:false, ticks:false, describe:dmc.getAttribute("aria-label"), after:function(ctx, p){
    var W = p.W, H = p.H, col = MV.css("--e-pair"), L = contours();
    ctx.save(); ctx.strokeStyle = col; ctx.lineCap = "round";
    L.forEach(function(lv){ ctx.globalAlpha = 0.35 + 0.65 * lv.li / (L.length - 1); ctx.lineWidth = 1.5; ctx.beginPath(); lv.seg.forEach(function(s){ ctx.moveTo(s[0] * W, (1 - s[1]) * H); ctx.lineTo(s[2] * W, (1 - s[3]) * H); }); ctx.stroke(); });
    ctx.restore();
    ctx.fillStyle = MV.css("--ink"); DM.atoms.forEach(function(a){ var q = mapXY(a.x, a.y); ctx.beginPath(); ctx.arc(q[0] * W, q[1] * H, 2.4, 0, 2 * Math.PI); ctx.fill(); });
  } }); };
  dp.render();
  var bondsBox = $(".qm-bonds", host), ridgeBox = $(".qm-ridges", host);
  function rOf(bid){ return S.dm.m[bid]; }
  function paintDM(){
    var used = {}; Object.keys(S.dm.m).forEach(function(k){ used[S.dm.m[k]] = k; });
    MV.keepFocus(bondsBox, function(){ bondsBox.innerHTML = '<span class="rg-lab">Bonds</span>' + s3.bonds.map(function(b){ var r = rOf(b.id), rt = r ? DM.ridges.filter(function(x){ return x.id === r; })[0].t : ""; return '<button type="button" class="qm-bondb' + (r ? " done" : "") + '" aria-pressed="' + (dmSel === b.id) + '" data-bond="' + b.id + '" data-k="bd' + b.id + '"' + (r ? " disabled" : "") + ">" + b.t + (r ? " ✓ ridge " + rt : "") + "</button>"; }).join(""); });
    MV.keepFocus(ridgeBox, function(){ ridgeBox.innerHTML = DM.ridges.map(function(rd){ var a = DM.atoms[rd.a], b = DM.atoms[rd.b], q = mapXY((a.x + b.x) / 2, (a.y + b.y) / 2), u = used[rd.id]; return '<button type="button" class="qm-ridge' + (u ? " done" : "") + (dmSel && !u ? " ready" : "") + '" style="left:' + (q[0] * 100).toFixed(1) + "%;top:" + (q[1] * 100).toFixed(1) + '%" data-ridge="' + rd.id + '" data-k="rg' + rd.id + '" aria-label="Ridge ' + rd.t + (u ? ", matched" : "") + '"' + (u ? " disabled" : "") + ">" + rd.t + "</button>"; }).join(""); });
    var all = s3.bonds.every(function(b){ return rOf(b.id); });
    $(".qm-dmfb", host).innerHTML = all ? MV.fbHTML("good", "<strong>✓ All three bonds matched.</strong> " + s3.done) : dmMsg ? MV.fbHTML(dmMsg.k, dmMsg.html) : "";
  }
  bondsBox.addEventListener("click", function(e){ var b = e.target.closest("[data-bond]"); if (!b || b.disabled) return; dmSel = dmSel === b.dataset.bond ? null : b.dataset.bond; dmMsg = dmSel ? { k:"", html:"Now tap the ridge on the map that matches " + b.textContent + "." } : null; paintDM(); });
  ridgeBox.addEventListener("click", function(e){
    var b = e.target.closest("[data-ridge]"); if (!b || b.disabled) return;
    if (!dmSel) { dmMsg = { k:"", html:"Tap a bond in the model first, then its ridge." }; paintDM(); return; }
    var rid = b.dataset.ridge, isCH = dmSel !== "co", want = BOND_RIDGE[dmSel], ok = isCH ? rid !== "r2" : rid === want;
    if (ok) { S.dm.m[dmSel] = rid; dmMsg = { k:"good", html:"<strong>✓ Matched.</strong> " + (dmSel === "co" ? "Ridge 2 joins the two biggest peaks: C and O." : "This ridge runs from the middle peak (C) to a small peak (H).") }; dmSel = null; api.save(); }
    else dmMsg = { k:"bad", html:"<strong>✗ Not quite.</strong> " + (isCH ? "Ridge 2 joins the two biggest peaks (C and O): that’s C=O. A C–H ridge runs to one of the small peaks." : "That ridge joins the middle peak to a small peak: a C–H bond. C=O joins the two biggest peaks.") };
    paintDM(); MV.focusFb($(".qm-dmfb", host));
  });
  paintDM();
}

// ---------- Practice 1: Allowed or not? (sort + "which rule does it break?") ----------
// @component ruleSorter — tap-to-sort into two boxes; a card sorted into "Not allowed" then asks which rule it breaks
// (chip question). First try = right box and right rule on the first attempt, without the worked solution.
function allowedAct(host, api, a){
  var S = api.S; S.it = S.it && typeof S.it === "object" ? S.it : {};
  var sel = null, msg = null;
  function ist(id){ return S.it[id] || (S.it[id] = { box:null, rule:null, tries:0, hint:0 }); }
  function parts(it){ var v = String(MV.ans(it)), p = v.split(":"); return { box:p[0], rule:p[1] || null }; }
  function pending(){ return a.items.filter(function(it){ var x = ist(it.id); return x.box === "no" && !x.rule; })[0] || null; }
  function done(it){ var x = ist(it.id), p = parts(it); return x.box === p.box && (p.box === "ok" || x.rule === p.rule); }
  function paint(){
    var pend = pending(), tray = a.items.filter(function(it){ return !ist(it.id).box; }), h = '<p class="how">' + a.how + "</p>";
    h += '<div class="tray" role="group" aria-label="Cards to sort">' + (tray.length ? tray.map(function(it){ return '<button type="button" class="tile" aria-pressed="' + (sel === it.id) + '" data-item="' + it.id + '" data-k="t' + it.id + '"' + (pend ? " disabled" : "") + ">" + it.t + "</button>"; }).join("") :
      (pend ? "" : '<p class="sort-done">All sorted! You got ' + stats().first + " of " + a.items.length + " right on the first try, without the worked solution.</p>")) + "</div>";
    var hi = pend || (sel ? a.items.filter(function(x){ return x.id === sel; })[0] : null);
    if (pend) {
      var px = ist(pend.id);
      h += '<div class="qm-rq"><p><strong>' + pend.t + "</strong> is not allowed. " + a.ruleAsk + '</p><div class="chips" role="group" aria-label="' + esc(a.ruleAsk) + '">' + a.rules.map(function(r){ return '<button type="button" class="chip" data-rule="' + r.id + '" data-k="ru' + r.id + '">' + md(r.t) + "</button>"; }).join("") + "</div>" +
        '<div class="sel-bar"><span>Selected: ' + pend.t + "</span>" + MV.hintBtn("h" + a.id, px.hint) + "</div>" + MV.hintsHTML(pend.hints.map(md), px.hint) + "</div>";
    } else if (hi) {
      var hx = ist(hi.id);
      h += '<div class="sel-bar"><span>Selected: ' + hi.t + "</span>" + MV.hintBtn("h" + a.id, hx.hint) + "</div>" + MV.hintsHTML(hi.hints.map(md), hx.hint);
    }
    if (msg) h += MV.fbHTML(msg.type, msg.html);
    h += '<div class="bins">' + a.boxes.map(function(b){
      var inside = a.items.filter(function(it){ return ist(it.id).box === b.id; });
      return '<button type="button" class="bin' + (sel ? " ready" : "") + '" data-bin="' + b.id + '" data-k="b' + b.id + '"' + (pend ? " disabled" : "") + '><span class="bin-head"><span><strong>' + b.label + '</strong></span></span><span class="bin-items">' + inside.map(function(it){ var x = ist(it.id); return '<span class="chip-in">' + it.t + (b.id === "no" ? (x.rule ? " · " + md(a.rules.filter(function(r){ return r.id === x.rule; })[0].t) : " · rule?") : "") + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var pend = pending();
    if (b.dataset.item) { sel = sel === b.dataset.item ? null : b.dataset.item; msg = null; paint(); return; }
    if (b.dataset.act === "hint") { var tid = pend ? pend.id : sel; if (tid) { var hx = ist(tid); hx.hint = Math.min(3, hx.hint + 1); api.save(); paint(); } return; }
    if (b.dataset.bin) {
      if (!sel) { msg = { type:"", html:"Tap a card first, then tap the box it belongs in." }; paint(); return; }
      var it = a.items.filter(function(x){ return x.id === sel; })[0], x = ist(it.id), p = parts(it);
      if (b.dataset.bin === p.box) {
        x.box = p.box; sel = null;
        msg = p.box === "ok" ? { type:"good", html:"<strong>✓ " + it.t + "</strong>: " + md(it.why) } : { type:"good", html:"<strong>✓ Not allowed.</strong> Now choose the rule it breaks." };
      } else { x.tries++; msg = { type:"bad", html:"<strong>✗ Not that box.</strong> " + md(p.box === "ok" ? a.okWrong : it.wrongFb + " Look again: one rule is broken.") + " Try another box." }; }
      api.save(); paint(); MV.focusFb(host); return;
    }
    if (b.dataset.rule && pend) {
      var px = ist(pend.id), pp = parts(pend);
      if (b.dataset.rule === pp.rule) { px.rule = pp.rule; msg = { type:"good", html:"<strong>✓ " + pend.t + "</strong>: " + md(pend.why) }; }
      else { px.tries++; msg = { type:"bad", html:"<strong>✗ Not quite.</strong> That rule holds for " + pend.t + ". Check another rule." }; }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  function stats(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (done(it)) { d++; if (!x.tries && x.hint < 3) f++; } }); return { first:f, done:d }; }
  paint();
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:a.items.length, done:s.done, line:a.summary + " (first try): " + s.first + "/" + a.items.length + (s.done < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Counting with quantum numbers (number entry + one choice item; from SCH4U 13's reasonAct) ----------
function countAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + md(it.prompt) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow"><label for="ri-' + it.id + '">Your answer:</label><input class="numin" id="ri-' + it.id + '" data-rin="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + "></div>";
    else h += '<div class="chips qm-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(op, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + md(op.t) + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints.map(md), x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? md(it.options[x.pick].t) : it.display) + ".</strong> " + (it.kind === "chips" ? md(it.options[x.pick].why || "") : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + md(msgs[it.id].t) + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var t = String(s || "").replace(/electrons?|orbitals?|nodes?/gi, "").trim(); return /^\d+(\.\d+)?$/.test(t) ? +t : null; }
  function judge(it, x){
    if (it.kind === "num") {
      var v = one(x.val); if (v == null) return { bad:"Enter one whole number." };
      if (v === MV.ans(it)) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return z.match === v; })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.rin) return; ist(d.rin).val = e.target.value.slice(0, 20); api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rin) { var b = host.querySelector('[data-k="' + e.target.dataset.rin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Quantum address ----------
var task = (function(){
  var S = null, api = null, T = null, plot = null, R = {};
  function read(){ function iv(k, a, b){ var v = S ? S[k] : null; return v === "" || v == null || !isFinite(+v) ? null : intIn(v, a, b, null); } return { n:iv("n", 1, 4), l:iv("l", 0, 3), ml:iv("ml", -3, 3), ms:S && (S.ms === "+" || S.ms === "-") ? S.ms : null }; }
  function allowed(d){ return d.n != null && d.l != null && d.ml != null && !!d.ms && !broken(d.n, d.l, d.ml); }
  function addrT(d){ return "(" + d.n + ", " + d.l + ", " + mlT(d.ml) + ", " + spinT(d.ms) + ")"; }
  function paint(){
    if (!plot) return; plot.render();
    var d = read(), cap = $("#qm-tkcap");
    if (!cap) return;
    if (d.n == null || d.l == null || d.ml == null) cap.innerHTML = "Choose " + m("n") + ", " + m("l") + " and " + m("m_l") + " to see the orbital.";
    else { var br = broken(d.n, d.l, d.ml); cap.innerHTML = br ? "<strong>" + md(RULE_T[br]) + ".</strong>" : "<strong>" + d.n + LET[d.l] + "</strong>, " + m("m_l = " + sgnT(d.ml)) + ": " + shapeT(d.n, d.l, d.ml).charAt(0).toLowerCase() + shapeT(d.n, d.l, d.ml).slice(1) + "." + (d.ms ? " Spin " + spinT(d.ms) + "." : " Now choose the spin."); }
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      ["n", "l", "ml"].forEach(function(k){ if (S[k] != null && S[k] !== "" && !isFinite(+S[k])) S[k] = ""; }); if (S.ms !== "+" && S.ms !== "-") S.ms = "";
      inp.innerHTML = '<div class="qm-tin"><div class="qm-tn"></div><div class="qm-tl"></div><div class="qm-tml"></div><div class="qm-tms"></div></div>';
      function up(k){ return function(v){ S[k] = v; api.save(); paint(); api.update(); }; }
      R.n = radios($(".qm-tn", inp), { label:m("n"), aria:"n", cls:"chips", options:[1, 2, 3, 4].map(function(v){ return { id:String(v), t:String(v) }; }), value:S.n == null ? "" : S.n, onChange:up("n") });
      R.l = radios($(".qm-tl", inp), { label:m("l"), aria:"l", cls:"chips", options:[0, 1, 2, 3].map(function(v){ return { id:String(v), t:String(v) }; }), value:S.l == null ? "" : S.l, onChange:up("l") });
      R.ml = radios($(".qm-tml", inp), { label:m("m_l"), aria:"m sub l", cls:"chips", options:[-3, -2, -1, 0, 1, 2, 3].map(function(v){ return { id:String(v), t:sgnT(v) }; }), value:S.ml == null ? "" : S.ml, onChange:up("ml") });
      R.ms = radios($(".qm-tms", inp), { label:m("m_s"), aria:"m sub s", cls:"chips", options:[{ id:"+", t:"+½" }, { id:"-", t:MI + "½" }], value:S.ms, onChange:up("ms") });
      pv.innerHTML = '<h4 class="qm-h4">Orbital viewer preview</h4><canvas class="plot qm-tkc" role="img" aria-label=""></canvas><p class="qm-tcap" id="qm-tkcap" aria-live="polite"></p>';
      var cv = $(".qm-tkc", pv);
      plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
      plot.render = function(){
        var d = read(), ready = d.n != null && d.l != null && d.ml != null, br = ready ? broken(d.n, d.l, d.ml) : "";
        plot.draw({ grid:false, axes:false, ticks:false, describe:!ready ? "Orbital preview: choose n, l and m sub l." : br ? RULE_P[br] + "." : "Preview of the " + d.n + LET[d.l] + " orbital with m sub l = " + sgnT(d.ml) + ": " + shapeT(d.n, d.l, d.ml).toLowerCase() + ".", after:function(ctx, p){
          if (!ready) { ctx.save(); ctx.strokeStyle = MV.css("--rule"); ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(p.W / 2, p.H / 2, Math.min(p.W, p.H) * 0.3, 0, 2 * Math.PI); ctx.stroke(); ctx.restore(); ctx.fillStyle = MV.css("--ink-2"); ctx.font = "14px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("Choose n, l and mₗ", p.W / 2, p.H / 2); return; }
          drawOrbScene(ctx, p.W, p.H, d, PRESET.iso, { label:true }, p.fontUI);
        } });
      };
      paint();
    },
    read:read,
    valid:function(d){ return d.n != null && d.l != null && d.ml != null && d.ms ? true : "Choose a value for each of " + m("n") + ", " + m("l") + ", " + m("m_l") + " and " + m("m_s") + " first."; },
    checks:function(d){ return [allowed(d), d.n === 3, d.l === 1 || d.l === 2, d.ml === 1]; },
    tips:function(d, res){
      var out = [];
      function add(t){ t = md(t); if (out.indexOf(t) < 0) out.push(t); }
      if (!res[0]) { var br = broken(d.n, d.l, d.ml); if (br === "ml") add(T.tips[0]); else if (br === "l") add(d.n === 3 ? T.tips[1] : T.lTip); }
      if (!res[1]) add(T.tips[1]);
      if (!res[2]) add(T.tips[1]);
      if (!res[3]) add(T.tips[2]);
      return out;
    },
    key:function(d){ return [d.n, d.l, d.ml, d.ms].join(","); },
    label:function(k){ var p = k.split(","); return addrT({ n:+p[0], l:+p[1], ml:+p[2], ms:p[3] }); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ allowed:allowedAct, counting:countAct },
  task:task
});
})();
