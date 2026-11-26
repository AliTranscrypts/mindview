// SCH4U 04 Aldehydes and Ketones: hero (propanal → propanone, then [O] meets each), Carbonyl explorer (Explore: C1 view
// with δ labels and a dipole arrow, boiling-point bars, dipole and water particle box, everyday-molecule gallery, pin to
// compare), Tell them apart (Part 3: Tollens’ and Benedict’s test bench, controls, C2 naming chips), "Identify the unknown"
// set and the "Ketone factory" task (alcohol builder + C2 chips).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function isC(m){ return function(j){ return m.a[j].el === "C"; }; }
function degC(v){ return MV.chem.fx(v, 0) + " °C"; }
function cp(o){ return JSON.parse(JSON.stringify(o)); }

// Module data table (plan §4 Explore; §6 risk 1): boiling points (°C). Course table additions: MV.chem.data.bp doesn't hold
// them yet, so they're defined here until the shared table absorbs them. The 11 carbonyl values, propan-1-ol and butan-1-ol
// are this plan's table; methanol, ethanol, pentan-1-ol and hexan-1-ol repeat SCH4U 03's module table (the comparison bars
// need a primary alcohol for every chain length). Alkane boiling points come from MV.chem.data.bp.
var BP = { methanal:-19, ethanal:20, propanal:48, butanal:75, "2-methylpropanal":64, pentanal:103, propanone:56, butanone:80, "pentan-2-one":102,
  "pentan-3-one":102, "3-methylbutan-2-one":94, "propan-1-ol":97, "butan-1-ol":118, methanol:65, ethanol:78, "pentan-1-ol":138, "hexan-1-ol":157 };
var PLAN_TABLE = ["methanal", "ethanal", "propanal", "butanal", "2-methylpropanal", "pentanal", "propanone", "butanone", "pentan-2-one", "pentan-3-one", "3-methylbutan-2-one", "butane", "pentane", "propan-1-ol", "butan-1-ol"];
function bpOf(nm){ return BP[nm] != null ? BP[nm] : MV.chem.bpOf(nm); }
function molarMass(f){ var M = MV.chem.data.M; return (f.C || 0) * M.C + (f.H || 0) * M.H + (f.O || 0) * M.O; }
var STEM = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];

// @component radioGroup (from MHF4U 25, via SCH4U 01/02) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); options may be disabled: radios(host, {…, disabled(id) -> reason | ""}).
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val);
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// @component C1 moleculeView (from SCH4U 03; adds the dipole overlay) — molecule model (C and O, H implicit; bond orders 1–3), 2D full structural layout, 3D
// ball-and-stick model (VSEPR geometry), morphs, and tap-to-select atom AND bond buttons over the drawing (Tab, arrow keys,
// Enter). From SCH4U 02's C1, extended for oxygen (–OH, –O– in a chain, C=O) and with highlight options for classes and
// oxidation: glow (the C–OH carbon), numbered neighbour badges, ringed H atoms, notes, rings by scene id; view.anim morphs.
//   C1.clone · adj · bondOf(m, i, j) · order · hc(m) · free(m, i) · formula · fText · geo · layout2d(m) · scene3(m) · morph(A, B)
//   C1.view(host, {w, h, rotate, onPick(kind "a"|"b", index, keyboard), label(kind, index)}) -> {show(m, o), render(), anim(A, B, o, dur, done)}
//     o = {view:"st"|"3d", scene, atoms:[pickable atom idx], bonds:[pickable bond idx], selA, selB:[i, j], path (locants),
//          glow (atom idx), count:[atom idx] (numbered badges), hRing (atom idx: ring its H atoms), note:{i, t}, ring:{sceneId:"s"|"d"},
//          dip:{c, o} (SCH4U 04: δ+ on the carbonyl C, δ− on the O, crossed-tail dipole arrow), smax, aria}
var C1 = (function(){
  var VAL = { C:4, H:1, O:2 };
  function clone(m){ return { a:m.a.map(function(x){ return Object.assign({}, x); }), b:m.b.map(function(x){ return x.slice(); }), main:(m.main || []).slice() }; }
  function adj(m){ if (!m._A) { var L = m.a.map(function(){ return []; }); m.b.forEach(function(b){ L[b[0]].push(b[1]); L[b[1]].push(b[0]); }); m._A = L; } return m._A; }
  function bondOf(m, i, j){ for (var k = 0; k < m.b.length; k++) { var b = m.b[k]; if ((b[0] === i && b[1] === j) || (b[0] === j && b[1] === i)) return k; } return -1; }
  function order(m, i, j){ var k = bondOf(m, i, j); return k < 0 ? 0 : (m.b[k][2] || 1); }
  function used(m){ var s = m.a.map(function(a){ return a.open || 0; }); m.b.forEach(function(b){ s[b[0]] += b[2] || 1; s[b[1]] += b[2] || 1; }); return s; }
  function hc(m){ if (!m._h) { var s = used(m); m._h = m.a.map(function(a, i){ return Math.max(0, (VAL[a.el] || 0) - s[i]); }); } return m._h; }
  function free(m, i){ return (VAL[m.a[i].el] || 0) - used(m)[i]; }
  function formula(m){ var f = { C:0, H:0, O:0 }, h = hc(m); m.a.forEach(function(a, i){ f[a.el] = (f[a.el] || 0) + 1; f.H += h[i]; }); return f; }
  function fText(m){ var f = formula(m), s = ""; ["C", "H", "O"].forEach(function(e){ if (f[e]) s += e + (f[e] > 1 ? f[e] : ""); }); return s; }
  function geo(m, i){
    if (m.a[i].el !== "C") return 3;
    var d = 0, t = false; m.b.forEach(function(b){ if (b[0] === i || b[1] === i) { if (b[2] === 3) t = true; if (b[2] === 2) d++; } });
    return t || d >= 2 ? 1 : d >= 1 ? 2 : 3;
  }

  // ---------- 2D full structural layout (grid, chain left to right) ----------
  var U = [0, -1], D = [0, 1], LF = [-1, 0], RT = [1, 0];
  function gapAngles(angs, k){
    if (k <= 0) return [];
    var T2 = 2 * Math.PI, out = [], i;
    if (!angs.length) { for (i = 0; i < k; i++) out.push(-Math.PI / 2 + i * T2 / k); return out; }
    var a = angs.map(function(x){ return ((x % T2) + T2) % T2; }).sort(asc), G = [];
    for (i = 0; i < a.length; i++) G.push({ s:a[i], w:(i + 1 < a.length ? a[i + 1] : a[0] + T2) - a[i], n:0 });
    for (var j = 0; j < k; j++) {
      var best = null;
      G.forEach(function(g){ var sc = g.w / (g.n + 1); if (!best || sc > best.sc + 1e-6 || (Math.abs(sc - best.sc) <= 1e-6 && g.w > best.g.w + 1e-6)) best = { g:g, sc:sc }; });
      best.g.n++;
    }
    G.forEach(function(g){ for (var t = 1; t <= g.n; t++) out.push(g.s + g.w * t / (g.n + 1)); });
    return out;
  }
  function parOf(m, i){ var l = adj(m)[i].filter(function(j){ return j < i; }); return l.length ? l[0] : -1; }
  function layout2d(m){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main.length ? m.main : [0], N = main.length, onMain = {}, i;
    main.forEach(function(x, k){ onMain[x] = k; });
    var roots = main.map(function(x){ return Ad[x].filter(function(j){ return !(j in onMain); }).sort(asc); }), rdir = {}, cb = [];
    main.forEach(function(x, k){
      var r = roots[k], single = N === 1, e0 = N > 1 && k === 0, e1 = N > 1 && k === N - 1, usedD = [];
      var par = k % 2 ? [U, D] : [D, U], out = single ? [RT, LF] : e0 ? [LF] : e1 ? [RT] : [];
      var cP = single ? [RT, LF, U, D] : par.concat(out), xP = single ? [RT, LF, U, D] : out.concat(par);
      var take = function(list){ for (var q = 0; q < list.length; q++) if (usedD.indexOf(list[q]) < 0) { usedD.push(list[q]); return list[q]; } return U; };
      r.filter(function(j){ return m.a[j].el === "C"; }).forEach(function(j){ rdir[j] = take(cP); });
      r.filter(function(j){ return m.a[j].el !== "C"; }).forEach(function(j){ rdir[j] = take(xP); });
      cb[k] = r.some(function(j){ return rdir[j][0] === 0; }) ? 1 : 0;
    });
    var x0 = 0;
    main.forEach(function(x, k){ if (k) x0 += 1.05 + 0.3 * (cb[k - 1] + cb[k]); P[x] = [x0, 0]; });
    function grow(j, from, dir){
      P[j] = [P[from][0] + dir[0], P[from][1] + dir[1]];
      Ad[j].filter(function(c){ return c !== from && P[c] == null; }).sort(asc).forEach(function(c, q){ grow(c, j, q === 0 ? dir : q === 1 ? [-dir[1], dir[0]] : [dir[1], -dir[0]]); });
    }
    main.forEach(function(x, k){ roots[k].forEach(function(j){ grow(j, x, rdir[j]); }); });
    for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0];
    var atoms = [], bonds = [];
    for (i = 0; i < n; i++) atoms.push({ id:"a" + i, el:m.a[i].el, x:P[i][0], y:P[i][1], i:i, par:parOf(m, i) });
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    for (i = 0; i < n; i++) {
      if (h[i] <= 0) continue;
      gapAngles(Ad[i].map(function(j){ return Math.atan2(P[j][1] - P[i][1], P[j][0] - P[i][0]); }), h[i]).forEach(function(t, q){
        bonds.push({ a:i, b:atoms.length, o:1 });
        atoms.push({ id:"h" + i + "." + q, el:"H", x:P[i][0] + 0.62 * Math.cos(t), y:P[i][1] + 0.62 * Math.sin(t), i:-1, par:i, isH:true });
      });
    }
    return { atoms:atoms, bonds:bonds, view:"st" };
  }

  // ---------- 3D coordinates (VSEPR), main chain zig-zag, then aligned ----------
  function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function crs(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a){ return Math.hypot(a[0], a[1], a[2]); }
  function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function perp(u){ var p = crs(u, [0, 0, 1]); if (len(p) < 1e-6) p = crs(u, [0, 1, 0]); return nrm(p); }
  var TET = [nrm([1, 1, 1]), nrm([1, -1, -1]), nrm([-1, 1, -1]), nrm([-1, -1, 1])];
  var CC = { 1:1.54, 2:1.34, 3:1.2 };
  function pair(u1, u2){ var b = nrm(add(u1, u2)), c = nrm(crs(u1, u2)); return [add(mul(b, -0.5774), mul(c, 0.8165)), add(mul(b, -0.5774), mul(c, -0.8165))]; }
  function scene3(m){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main.length ? m.main : [0], onMain = {}, done = {}, q = [], Hs = [], i;
    main.forEach(function(x, k){ onMain[x] = k; });
    function ref(x, p, u){
      var g = Ad[p].filter(function(j){ return j !== x && done[j]; })[0];
      var a = g != null ? nrm(sub(P[p], P[g])) : perp(u), pa = sub(a, mul(u, dot(a, u)));
      return len(pa) < 1e-6 ? perp(u) : nrm(pa);
    }
    function dirs(x){
      var pl = Ad[x].filter(function(j){ return done[j]; }), us = pl.map(function(j){ return nrm(sub(P[j], P[x])); }), g = geo(m, x);
      if (g === 1) return us.length ? [mul(us[0], -1)] : [[1, 0, 0], [-1, 0, 0]];
      if (g === 2) {
        if (!us.length) return [[1, 0, 0], [-0.5, 0.866, 0], [-0.5, -0.866, 0]];
        if (us.length === 1) { var pa = ref(x, pl[0], us[0]); return [add(mul(us[0], -0.5), mul(pa, 0.866)), add(mul(us[0], -0.5), mul(pa, -0.866))]; }
        return [nrm(mul(add(us[0], us[1]), -1))];
      }
      if (!us.length) return TET;
      if (us.length === 1) { var u = us[0], a2 = ref(x, pl[0], u); a2 = add(mul(u, -1 / 3), mul(a2, 0.9428)); var two = pair(u, a2); return [a2, two[0], two[1]]; }
      if (us.length === 2) return pair(us[0], us[1]);
      if (us.length === 3) return [nrm(mul(add(add(us[0], us[1]), us[2]), -1))];
      return [];
    }
    function bl(x, j){ var e1 = m.a[x].el, e2 = m.a[j].el, o = order(m, x, j); if (e1 === "C" && e2 === "C") return CC[o] || 1.54; return o === 2 ? 1.23 : 1.43; }
    var s0 = main[0];
    P[s0] = [0, 0, 0]; done[s0] = 1; q.push(s0);
    while (q.length) {
      var x = q.shift(), ds = dirs(x), fr = Ad[x].filter(function(j){ return !done[j]; }).sort(function(a, b){ return ((onMain[b] != null) - (onMain[a] != null)) || a - b; });
      fr.forEach(function(j, k){ P[j] = add(P[x], mul(ds[k] || TET[k % 4], bl(x, j))); done[j] = 1; q.push(j); });
      for (var t = 0; t < h[x]; t++) Hs.push({ par:x, k:t, p:add(P[x], mul(ds[fr.length + t] || TET[t % 4], m.a[x].el === "O" ? 0.96 : 1.09)) });
    }
    for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0, 0];
    var all = P.concat(Hs.map(function(o){ return o.p; })), c = [0, 0, 0];
    all.forEach(function(p){ c = add(c, mul(p, 1 / all.length)); });
    var X = main.length > 1 ? nrm(sub(P[main[main.length - 1]], P[main[0]])) : [1, 0, 0], Y = null;
    var refs = main.slice(1, -1).map(function(j){ return P[j]; }).concat(P.filter(function(_, j){ return onMain[j] == null; }), Hs.map(function(o){ return o.p; }));
    for (i = 0; i < refs.length && !Y; i++) { var w = sub(sub(refs[i], P[main[0]]), mul(X, dot(sub(refs[i], P[main[0]]), X))); if (len(w) > 0.2) Y = mul(nrm(w), -1); }
    if (!Y) Y = perp(X);
    var Z = crs(X, Y);
    function tf(p){ var d = sub(p, c); return [dot(d, X), dot(d, Y), dot(d, Z)]; }
    var atoms = [], bonds = [];
    for (i = 0; i < n; i++) { var p0 = tf(P[i]); atoms.push({ id:"a" + i, el:m.a[i].el, x:p0[0], y:p0[1], z:p0[2], i:i, par:parOf(m, i) }); }
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    Hs.forEach(function(o){ var p1 = tf(o.p); bonds.push({ a:o.par, b:atoms.length, o:1 }); atoms.push({ id:"h" + o.par + "." + o.k, el:"H", x:p1[0], y:p1[1], z:p1[2], i:-1, par:o.par, isH:true }); });
    return { atoms:atoms, bonds:bonds, view:"3d" };
  }

  // ---------- morph (atoms matched by id) ----------
  function lerp(a, b, t){ return a + (b - a) * t; }
  function morph(A, B){
    var bi = {}, usedB = {}, pairs = [], leftA = [], leftB = [];
    B.atoms.forEach(function(x, k){ bi[x.id] = k; });
    A.atoms.forEach(function(x, k){ if (x.id in bi && !usedB[bi[x.id]]) { pairs.push([k, bi[x.id]]); usedB[bi[x.id]] = 1; } else leftA.push(k); });
    B.atoms.forEach(function(x, k){ if (!usedB[k]) leftB.push(k); });
    return function(t){
      var atoms = [], ia = {}, ib = {};
      pairs.forEach(function(p){ var a = A.atoms[p[0]], b = B.atoms[p[1]], o = Object.assign({}, t < 0.5 ? a : b);
        o.x = lerp(a.x, b.x, t); o.y = lerp(a.y, b.y, t); o.z = lerp(a.z || 0, b.z || 0, t); ia[p[0]] = ib[p[1]] = atoms.length; atoms.push(o); });
      leftA.forEach(function(k){ var o = Object.assign({}, A.atoms[k]); o.op = 1 - t; ia[k] = atoms.length; atoms.push(o); });
      leftB.forEach(function(k){ var o = Object.assign({}, B.atoms[k]); o.op = t; ib[k] = atoms.length; atoms.push(o); });
      var src = t < 0.5 ? A : B, ix = t < 0.5 ? ia : ib;
      return { atoms:atoms, bonds:src.bonds.map(function(b){ return { a:ix[b.a], b:ix[b.b], o:b.o }; }), view:src.view };
    };
  }

  // ---------- SVG renderers ----------
  var RAD = { C:0.36, H:0.24, O:0.36 };
  function tsp(t, fs){ var out = "", low = false, d = r1(fs * 0.28);
    String(t).replace(/(\d+|\D+)/g, function(seg){ var dig = /^\d/.test(seg); if (dig && !low) { out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.72) + '">' + seg + "</tspan>"; low = true; } else if (!dig && low) { out += '<tspan dy="' + (-d) + '">' + seg + "</tspan>"; low = false; } else out += seg; return seg; });
    return out; }
  function estW(t, fs){ var w = 0; String(t).split("").forEach(function(ch){ w += /\d/.test(ch) ? 0.42 : /[a-z]/.test(ch) ? 0.5 : 0.66; }); return w * fs; }
  function atomByI(sc, i){ for (var k = 0; k < sc.atoms.length; k++) if (sc.atoms[k].i === i) return k; return -1; }
  function fit2(sc, W, H, smx){
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    sc.atoms.forEach(function(a){ x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
    var s = Math.min((W - 24) / (x1 - x0 + 1.3), (H - 24) / (y1 - y0 + 1.5), smx || 70);
    return { s:s, ox:W / 2 - (x0 + x1) / 2 * s, oy:H / 2 - (y0 + y1) / 2 * s };
  }
  function fit3(sc, W, H){
    var R = 0.5; sc.atoms.forEach(function(a){ R = Math.max(R, Math.hypot(a.x, a.y, a.z || 0) + (RAD[a.el] || 0.3)); });
    return { s:Math.min(Math.min(W, H) * 0.48 / R, 96), ox:W / 2, oy:H / 2 };
  }
  function lerpFit(a, b, t){ return { s:lerp(a.s, b.s, t), ox:lerp(a.ox, b.ox, t), oy:lerp(a.oy, b.oy, t) }; }
  function lab(a){ return a.lbl || a.el; }
  function inkOf(el){ return el === "C" ? "var(--at-c)" : el === "H" ? "var(--ink-2)" : el === "O" ? "var(--at-o)" : "var(--ink)"; }
  function svg2d(sc, fit, o){
    var s = fit.s, fs = clamp(s * 0.4, 11, 22), out = "", X = function(a){ return fit.ox + a.x * s; }, Y = function(a){ return fit.oy + a.y * s; };
    o = o || {};
    if (o.glow != null) { var kg = atomByI(sc, o.glow); if (kg >= 0) out += '<circle cx="' + r1(X(sc.atoms[kg])) + '" cy="' + r1(Y(sc.atoms[kg])) + '" r="' + r1(fs * 1.3) + '" fill="var(--hi)" opacity=".85"/><circle cx="' + r1(X(sc.atoms[kg])) + '" cy="' + r1(Y(sc.atoms[kg])) + '" r="' + r1(fs * 1.3) + '" fill="none" stroke="var(--hi-ink)" stroke-width="1.5"/>'; }
    if (o.selB != null) sc.bonds.forEach(function(b){ var A = sc.atoms[b.a], B = sc.atoms[b.b]; if (A.i >= 0 && B.i >= 0 && ((A.i === o.selB[0] && B.i === o.selB[1]) || (A.i === o.selB[1] && B.i === o.selB[0]))) out += '<line x1="' + r1(X(A)) + '" y1="' + r1(Y(A)) + '" x2="' + r1(X(B)) + '" y2="' + r1(Y(B)) + '" stroke="var(--hi)" stroke-width="' + r1(fs * 1.3) + '" stroke-linecap="round" opacity=".8"/>'; });
    if (o.selA != null) { var ks = atomByI(sc, o.selA); if (ks >= 0) out += '<circle cx="' + r1(X(sc.atoms[ks])) + '" cy="' + r1(Y(sc.atoms[ks])) + '" r="' + r1(fs * 0.95) + '" fill="var(--hi)" fill-opacity=".8"/>'; }
    var ext = sc.atoms.map(function(a){ var t = lab(a); return [estW(t, fs) / 2 + 2, fs * 0.48]; });
    sc.bonds.forEach(function(b){
      var A = sc.atoms[b.a], B = sc.atoms[b.b]; if (!A || !B) return;
      var ax = X(A), ay = Y(A), bx = X(B), by = Y(B), dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      var ta = Math.min(ux ? ext[b.a][0] / Math.abs(ux) : 1e9, uy ? ext[b.a][1] / Math.abs(uy) : 1e9), tb = Math.min(ux ? ext[b.b][0] / Math.abs(ux) : 1e9, uy ? ext[b.b][1] / Math.abs(uy) : 1e9);
      if (ta + tb >= L - 2) return;
      var op = Math.min(A.op == null ? 1 : A.op, B.op == null ? 1 : B.op), offs = b.o === 2 ? [-3.2, 3.2] : b.o === 3 ? [-5, 0, 5] : [0];
      offs.forEach(function(d){ out += '<line x1="' + r1(ax + ux * ta - uy * d) + '" y1="' + r1(ay + uy * ta + ux * d) + '" x2="' + r1(bx - ux * tb - uy * d) + '" y2="' + r1(by - uy * tb + ux * d) + '" stroke="var(--ink)" stroke-width="' + r1(clamp(s * 0.035, 1.5, 2.3)) + '" stroke-linecap="round"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + "/>"; });
    });
    sc.atoms.forEach(function(a){
      var t = lab(a), x = r1(X(a)), y = r1(Y(a)), op = a.op == null ? 1 : a.op, rg = (o.ring && o.ring[a.id]) || (o.hRing != null && a.isH && a.par === o.hRing ? "d" : "");
      if (rg && op > 0.05) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(fs * (t.length > 1 ? 1 : 0.7)) + '" fill="var(--hi-soft)" stroke="var(--pen)" stroke-width="1.8"' + (rg === "d" ? ' stroke-dasharray="3 2"' : "") + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + "/>";
      var gl = o.glow != null && a.i === o.glow;
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * (a.isH ? 0.9 : 1)) + '" font-weight="' + (a.el === "O" || a.el === "W" || gl ? 700 : 400) + '" fill="' + (gl ? "var(--hi-ink)" : inkOf(a.el)) + '"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + ">" + tsp(t, fs) + "</text>";
    });
    (o.count || []).forEach(function(ai, q){
      var k = atomByI(sc, ai); if (k < 0) return;
      var cx = X(sc.atoms[k]) + fs * 0.78, cy = Y(sc.atoms[k]) - fs * 0.78;
      out += '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r1(fs * 0.48) + '" fill="var(--pen)"/><text x="' + r1(cx) + '" y="' + r1(cy) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.62) + '" font-weight="700" fill="var(--sheet)">' + (q + 1) + "</text>";
    });
    if (o.path) o.path.forEach(function(i, q){
      var k = atomByI(sc, i); if (k < 0) return;
      var a = sc.atoms[k], angs = [], P = Math.PI, best = null;
      sc.bonds.forEach(function(b){ var j = b.a === k ? b.b : b.b === k ? b.a : -1; if (j >= 0) angs.push(Math.atan2(sc.atoms[j].y - a.y, sc.atoms[j].x - a.x)); });
      [P / 4, 3 * P / 4, -P / 4, -3 * P / 4, P / 2, -P / 2, 0, P].some(function(t){ if (angs.every(function(x){ return Math.abs(Math.atan2(Math.sin(t - x), Math.cos(t - x))) > 0.5; })) { best = t; return true; } return false; });
      if (best == null) best = P / 4;
      out += '<text x="' + r1(X(a) + Math.cos(best) * fs * 1.22) + '" y="' + r1(Y(a) + Math.sin(best) * fs * 1.22) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.58) + '" font-weight="700" fill="var(--pen)">' + (q + 1) + "</text>";
    });
    if (o.note) { var kn = atomByI(sc, o.note.i); if (kn >= 0) out += '<text x="' + r1(X(sc.atoms[kn])) + '" y="' + r1(Y(sc.atoms[kn]) + fs * 2) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.8) + '" font-weight="700" fill="var(--ink)" stroke="var(--sheet)" stroke-width="4" paint-order="stroke">' + o.note.t + "</text>"; }
    // dipole overlay (SCH4U 04): o.dip = {c, o} draws δ+ on the carbonyl C, δ− on the O and a crossed-tail dipole arrow (--ink) beside the C=O
    if (o.dip && o.dip.c >= 0 && o.dip.o >= 0) {
      var kc = atomByI(sc, o.dip.c), ko = atomByI(sc, o.dip.o);
      if (kc >= 0 && ko >= 0) {
        var segD = function(x, y, ax, ay, bx, by){ var vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1, t = clamp(((x - ax) * vx + (y - ay) * vy) / l2, 0, 1); return Math.hypot(x - ax - t * vx, y - ay - t * vy); };
        var clr = function(x, y, skip, extra){ var d = 1e9; sc.atoms.forEach(function(a, k){ if (skip.indexOf(k) < 0) d = Math.min(d, Math.hypot(X(a) - x, Y(a) - y)); });
          sc.bonds.forEach(function(b){ var A = sc.atoms[b.a], B = sc.atoms[b.b]; if (A && B) d = Math.min(d, segD(x, y, X(A), Y(A), X(B), Y(B)) + 4); });
          (extra || []).forEach(function(e){ d = Math.min(d, e.length > 2 ? segD(x, y, e[0], e[1], e[2], e[3]) : Math.hypot(x - e[0], y - e[1])); }); return d; };
        var Ca = sc.atoms[kc], Oa = sc.atoms[ko], cx = X(Ca), cy = Y(Ca), qx = X(Oa), qy = Y(Oa), Ld = Math.hypot(qx - cx, qy - cy) || 1, ux = (qx - cx) / Ld, uy = (qy - cy) / Ld, px = -uy, py = ux;
        var off = fs * 1.2, mx = (cx + qx) / 2, my = (cy + qy) / 2, sd = clr(mx + px * off, my + py * off, [kc, ko]) >= clr(mx - px * off, my - py * off, [kc, ko]) ? 1 : -1;
        var ax = px * off * sd, ay = py * off * sd, x1 = cx + ax + ux * Ld * 0.2, y1 = cy + ay + uy * Ld * 0.2, x2 = qx + ax + ux * 6, y2 = qy + ay + uy * 6, hw = 5.5;
        out += '<g stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"><line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2 - ux * 9) + '" y2="' + r1(y2 - uy * 9) + '"/><line x1="' + r1(x1 + ux * 7 + px * hw) + '" y1="' + r1(y1 + uy * 7 + py * hw) + '" x2="' + r1(x1 + ux * 7 - px * hw) + '" y2="' + r1(y1 + uy * 7 - py * hw) + '"/></g>';
        out += '<polygon points="' + r1(x2) + "," + r1(y2) + " " + r1(x2 - ux * 12 + px * hw) + "," + r1(y2 - uy * 12 + py * hw) + " " + r1(x2 - ux * 12 - px * hw) + "," + r1(y2 - uy * 12 - py * hw) + '" fill="var(--ink)"/>';
        var arrow = [x1, y1, x2, y2];
        var spot = function(a, k, ex){ var best = null; for (var q = 0; q < 16; q++) { var t = q * Math.PI / 8, x = X(a) + Math.cos(t) * fs * 1.2, y = Y(a) + Math.sin(t) * fs * 1.2, c = clr(x, y, [k], [arrow].concat(ex || [])); if (!best || c > best.c + 0.5) best = { x:x, y:y, c:c }; } return best; };
        var sn = spot(Oa, ko), spp = spot(Ca, kc, [[sn.x, sn.y]]);
        [[sn, "δ−", "--dl-neg"], [spp, "δ+", "--dl-pos"]].forEach(function(l){ out += '<text x="' + r1(l[0].x) + '" y="' + r1(l[0].y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.8) + '" font-weight="700" fill="var(' + l[2] + ')" stroke="var(--sheet)" stroke-width="3.5" paint-order="stroke">' + l[1] + "</text>"; });
      }
    }
    return out;
  }
  function proj(p, rot){
    var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
    var x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
    return [x, y * cx - z * sx, y * sx + z * cx];
  }
  function svg3d(sc, rot, fit, o, uid){
    o = o || {};
    var s = fit.s, pr = sc.atoms.map(function(a){ return proj([a.x, a.y, a.z || 0], rot); }), Rm = 0.1, items = [], out = "", g = "c1g" + uid;
    pr.forEach(function(p){ Rm = Math.max(Rm, Math.abs(p[2])); });
    sc.bonds.forEach(function(b){ if (pr[b.a] && pr[b.b]) items.push({ z:(pr[b.a][2] + pr[b.b][2]) / 2 - 0.05, b:b }); });
    sc.atoms.forEach(function(a, k2){ items.push({ z:pr[k2][2], k:k2 }); });
    items.sort(function(p, q){ return p.z - q.z; });
    out += '<defs><radialGradient id="' + g + '" cx=".3" cy=".27" r=".42"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
    items.forEach(function(it){
      if (it.b) {
        var A = sc.atoms[it.b.a], B = sc.atoms[it.b.b], on = o.selB && A.i >= 0 && B.i >= 0 && ((A.i === o.selB[0] && B.i === o.selB[1]) || (A.i === o.selB[1] && B.i === o.selB[0]));
        var pa = pr[it.b.a], pb = pr[it.b.b], dx = (pb[0] - pa[0]) * s, dy = (pb[1] - pa[1]) * s, L = Math.hypot(dx, dy) || 1, ra = (RAD[A.el] || 0.3) * s * 0.8, rb = (RAD[B.el] || 0.3) * s * 0.8;
        if (L <= ra + rb) return;
        var ox = -dy / L, oy = dx / L, n = it.b.o, sp = s * (n === 3 ? 0.11 : 0.085), wd = s * (n > 1 ? 0.07 : 0.12) * (on ? 1.5 : 1);
        for (var q = 0; q < n; q++) {
          var d = (q - (n - 1) / 2) * sp * 2;
          out += '<line x1="' + r1(fit.ox + pa[0] * s + dx / L * ra + ox * d) + '" y1="' + r1(fit.oy + pa[1] * s + dy / L * ra + oy * d) + '" x2="' + r1(fit.ox + pb[0] * s - dx / L * rb + ox * d) + '" y2="' + r1(fit.oy + pb[1] * s - dy / L * rb + oy * d) + '" stroke="var(' + (on ? "--pen" : "--ink-2") + ')" stroke-width="' + r1(wd) + '" stroke-linecap="round"/>';
        }
        return;
      }
      var a = sc.atoms[it.k], p = pr[it.k], r = (RAD[a.el] || 0.3) * s * (1 + 0.07 * p[2] / Rm), col = MV.chem.atom(a.el), x = r1(fit.ox + p[0] * s), y = r1(fit.oy + p[1] * s);
      if (o.selA != null && a.i === o.selA) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r + 5) + '" fill="none" stroke="var(--hi)" stroke-width="5"/>';
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.5"' : "") + '/><circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="url(#' + g + ')"/>';
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(r * 1.05) + '" font-weight="700" fill="' + col.ink + '">' + a.el + "</text>";
    });
    return out;
  }

  // ---------- view widget ----------
  var UID = 0;
  function view(host, opts){
    opts = opts || {};
    var uid = ++UID, W = opts.w || 640, H = opts.h || 380, aspect = H / W;
    host.innerHTML = '<div class="c1-wrap"><svg class="c1-svg" viewBox="0 0 ' + W + " " + H + '" role="img"></svg><div class="c1-ov"></div></div>' +
      (opts.rotate ? '<div class="c1-rot" hidden><span class="tiny muted">Turn the model:</span><button type="button" class="btn ghost sm" data-rot="l" aria-label="Turn left">⟲</button><button type="button" class="btn ghost sm" data-rot="r" aria-label="Turn right">⟳</button><button type="button" class="btn ghost sm" data-rot="u" aria-label="Tilt up">↑</button><button type="button" class="btn ghost sm" data-rot="d" aria-label="Tilt down">↓</button><span class="tiny muted">or drag it</span></div>' : "");
    var svg = $(".c1-svg", host), ov = $(".c1-ov", host), rb = $(".c1-rot", host);
    var st = { m:null, o:{ view:"st" }, rot:{ x:-0.45, y:0.55 }, cache:{}, cm:null, busy:false };
    function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 500 ? Math.max(aspect, 0.74) : aspect)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
    if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0 && !st.busy) render(); }).observe(svg);
    function sceneOf(m, v){ if (st.cm !== m) { st.cm = m; st.cache = {}; } return st.cache[v] || (st.cache[v] = v === "3d" ? scene3(m) : layout2d(m)); }
    function scr(sc, fit, a){ if (sc.view === "3d") { var p = proj([a.x, a.y, a.z || 0], st.rot); return [fit.ox + p[0] * fit.s, fit.oy + p[1] * fit.s]; } return [fit.ox + a.x * fit.s, fit.oy + a.y * fit.s]; }
    function paint(sc, fit, o){
      svg.innerHTML = sc.view === "3d" ? svg3d(sc, st.rot, fit, o, uid) : svg2d(sc, fit, o);
      svg.setAttribute("aria-label", o.aria || "Molecule");
      if (rb) rb.hidden = sc.view !== "3d";
      var list = [];
      (o.atoms || []).forEach(function(ai){ var k = atomByI(sc, ai); if (k >= 0) { var p = scr(sc, fit, sc.atoms[k]); list.push({ k:"a", i:ai, x:p[0], y:p[1], on:o.selA === ai }); } });
      (o.bonds || []).forEach(function(bi){ var b = st.m.b[bi], ka = atomByI(sc, b[0]), kb = atomByI(sc, b[1]); if (ka < 0 || kb < 0) return; var p = scr(sc, fit, sc.atoms[ka]), q = scr(sc, fit, sc.atoms[kb]);
        list.push({ k:"b", i:bi, x:(p[0] + q[0]) / 2, y:(p[1] + q[1]) / 2, on:!!(o.selB && ((b[0] === o.selB[0] && b[1] === o.selB[1]) || (b[0] === o.selB[1] && b[1] === o.selB[0]))) }); });
      var html = list.map(function(x){ return '<button type="button" class="c1-b' + (x.k === "b" ? " bd" : "") + '" style="left:' + r1(x.x / W * 100) + "%;top:" + r1(x.y / H * 100) + '%" data-k="c1' + uid + x.k + x.i + '" data-pk="' + x.k + '" data-pi="' + x.i + '" aria-pressed="' + x.on + '" aria-label="' + esc(opts.label ? opts.label(x.k, x.i) : "Select") + '"></button>'; }).join("");
      MV.keepFocus(ov, function(){ ov.innerHTML = html; });
    }
    function render(){
      if (!st.m || st.busy) return; size();
      var o = st.o, sc = o.scene || sceneOf(st.m, o.view);
      var fit = sc.view === "3d" ? fit3(sc, W, H) : fit2(sc, W, H, o.smax);
      paint(sc, fit, o);
    }
    function anim(A, B, o, dur, done){
      size();
      var mf = morph(A, B), fA = fit2(A, W, H, o.smax), fB = fit2(B, W, H, o.smax);
      st.busy = true; ov.innerHTML = ""; if (rb) rb.hidden = true;
      svg.setAttribute("aria-label", o.aria || "Molecule");
      MV.tween({ dur:dur, step:function(t){ svg.innerHTML = svg2d(mf(t), lerpFit(fA, fB, t), o.during || {}); }, done:function(){ st.busy = false; if (done) done(); } });
    }
    ov.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b && opts.onPick) opts.onPick(b.dataset.pk, +b.dataset.pi, e.detail === 0); });
    ov.addEventListener("keydown", function(e){
      var b = e.target.closest("button"); if (!b) return;
      var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
      e.preventDefault(); var all = $$("button", ov), i = all.indexOf(b); all[(i + d + all.length) % all.length].focus();
    });
    if (rb) rb.addEventListener("click", function(e){ var b = e.target.closest("[data-rot]"); if (!b) return; var r = b.dataset.rot; if (r === "l") st.rot.y -= 0.35; else if (r === "r") st.rot.y += 0.35; else if (r === "u") st.rot.x -= 0.3; else st.rot.x += 0.3; render(); });
    var drag = null;
    svg.addEventListener("pointerdown", function(e){ if (st.o.view !== "3d" || st.busy) return; drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
    svg.addEventListener("pointermove", function(e){ if (!drag) return; st.rot.y += (e.clientX - drag.x) * 0.012; st.rot.x = clamp(st.rot.x - (e.clientY - drag.y) * 0.012, -1.5, 1.5); drag = { x:e.clientX, y:e.clientY }; render(); });
    svg.addEventListener("pointerup", function(){ drag = null; }); svg.addEventListener("pointercancel", function(){ drag = null; });
    return { show:function(m, o){ st.m = m; st.o = o || st.o; render(); }, render:render, anim:anim, busy:function(){ return st.busy; } };
  }
  return { clone:clone, adj:adj, bondOf:bondOf, order:order, hc:hc, free:free, formula:formula, fText:fText, geo:geo,
    layout2d:layout2d, scene3:scene3, morph:morph, svg2d:svg2d, fit2:fit2, atomByI:atomByI, view:view };
})();

// @component C2 nameBuilder (namer) — IUPAC names for open-chain C/H/O molecules: alkanes, alkenes, alcohols (-ol, diols),
// ethers (alkoxy prefix on the longer chain: methoxyethane, 2-methoxypropane), aldehydes (-al), ketones (-one; propanone and
// butanone without a locant) and carboxylic acids (-oic acid). Principal group: acid > aldehyde > ketone > alcohol (course
// plan §3); chain: most principal groups, then most multiple bonds, then longest; lowest locants to the principal group, then
// the C=C, then prefixes; prefixes alphabetical. Extends SCH4U 02's C2 namer; older and common names via canon().
//   NM.name(m) -> {name, parent:[atom idx in numbering order], P, pg}   NM.roles(m) -> {per:[{dO, oh:[]}], kind:["acid"|"al"|"one"|"ol"|""], P}
//   NM.fam(m) -> {fam, cls, c (C–OH carbon), nC, hb, eth, methanol, nOH}   NM.canon(str) -> {name, older, common}   NM.norm(str)
var NM = (function(){
  var STEM = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"], MULT = ["", "", "di", "tri", "tetra"];
  var RANK = { acid:4, al:3, one:2, ol:1 };
  function cmpArr(a, b){ for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }
  function roles(m){
    if (m._ro) return m._ro;
    var A = C1.adj(m), h = C1.hc(m), per = m.a.map(function(){ return { dO:-1, oh:[] }; });
    m.a.forEach(function(a, i){
      if (a.el !== "O") return;
      var cs = A[i].filter(isC(m));
      if (cs.length === 1 && C1.order(m, i, cs[0]) === 2) per[cs[0]].dO = i;
      else if (cs.length === 1 && h[i] >= 1) per[cs[0]].oh.push(i);
    });
    var kind = per.map(function(p, i){
      if (m.a[i].el !== "C") return "";
      var cd = A[i].filter(isC(m)).length;
      return p.dO >= 0 && p.oh.length ? "acid" : p.dO >= 0 ? (cd <= 1 ? "al" : "one") : p.oh.length ? "ol" : "";
    });
    var P = ""; kind.forEach(function(k){ if (k && (!P || RANK[k] > RANK[P])) P = k; });
    return (m._ro = { per:per, kind:kind, P:P });
  }
  function cand(m, A, path, excl, P){
    var on = {}, subs = [], pg = [], mbs = [], R = roles(m);
    path.forEach(function(x){ on[x] = 1; });
    for (var i = 0; i + 1 < path.length; i++) { var o = C1.order(m, path[i], path[i + 1]); if (o === 2 || o === 3) mbs.push({ loc:i + 1, o:o }); }
    path.forEach(function(x, k){
      var pr = R.per[x], mine = !!P && R.kind[x] === P;
      if (mine) { if (P === "ol") pr.oh.forEach(function(){ pg.push(k + 1); }); else pg.push(k + 1); }
      A[x].forEach(function(j){
        if (on[j] || j === excl) return;
        var el = m.a[j].el;
        if (el === "C") { var nm = alkyl(m, A, j, x); subs.push({ loc:k + 1, name:nm.name, key:nm.key }); return; }
        if (el !== "O") return;
        if (mine && (j === pr.dO || pr.oh.indexOf(j) >= 0)) return;
        if (C1.order(m, x, j) === 2) { subs.push({ loc:k + 1, name:"oxo", key:"oxo" }); return; }
        var r = A[j].filter(function(y){ return y !== x && m.a[y].el === "C"; })[0];
        if (r != null) { var an = alkyl(m, A, r, j).name.replace(/yl(\)?)$/, "oxy$1"); subs.push({ loc:k + 1, name:an, key:an.replace(/[^a-z]/g, "") }); return; }
        subs.push({ loc:k + 1, name:"hydroxy", key:"hydroxy" });
      });
    });
    var c = { path:path, subs:subs, pg:pg.sort(asc), P:P, mbs:mbs, mb:mbs.map(function(x){ return x.loc; }), db:mbs.filter(function(x){ return x.o === 2; }).map(function(x){ return x.loc; }), locs:subs.map(function(s){ return s.loc; }).sort(asc) };
    c.alpha = subs.slice().sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : a.loc - b.loc; }).map(function(s){ return s.loc; });
    return c;
  }
  function cmp(a, b){
    return (b.pg.length - a.pg.length) || (b.mb.length - a.mb.length) || (b.path.length - a.path.length) || (b.db.length - a.db.length) || (b.subs.length - a.subs.length) ||
      cmpArr(a.pg, b.pg) || cmpArr(a.mb, b.mb) || cmpArr(a.db, b.db) || cmpArr(a.locs, b.locs) || cmpArr(a.alpha, b.alpha) || (a.str < b.str ? -1 : a.str > b.str ? 1 : 0);
  }
  function assemble(c, asSub){
    var n = c.path.length, g = {}, order = [], P = c.P, np = c.pg.length;
    c.subs.forEach(function(s){ if (!g[s.name]) { g[s.name] = { name:s.name, key:s.key, locs:[] }; order.push(g[s.name]); } g[s.name].locs.push(s.loc); });
    order.sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });
    var pc = (P === "ol" || P === "one") ? np : 0, show = asSub || !(n === 1 || (n === 2 && c.subs.length + pc === 1));
    var pre = order.map(function(x){ x.locs.sort(asc); return (show ? x.locs.join(",") + "-" : "") + MULT[x.locs.length] + x.name; }).join(show ? "-" : "");
    if (asSub) return pre + STEM[n] + "yl";
    var en = c.mbs.filter(function(x){ return x.o === 2; }).map(function(x){ return x.loc; }), yn = c.mbs.filter(function(x){ return x.o === 3; }).map(function(x){ return x.loc; });
    var s = STEM[n], showMb = !(!P && n <= 3 && en.length + yn.length === 1);
    if (!en.length && !yn.length) s += "an";
    else {
      if ((en.length ? en : yn).length > 1) s += "a";
      if (en.length) s += (showMb ? "-" + en.join(",") + "-" : "") + MULT[en.length] + "en";
      if (yn.length) s += (showMb ? "-" + yn.join(",") + "-" : "") + MULT[yn.length] + "yn";
    }
    if (P === "acid") s += np > 1 ? "edioic acid" : "oic acid";
    else if (P === "al") s += np > 1 ? "edial" : "al";
    else if (P === "one") s += (np > 1 ? "e" : "") + (n <= 4 && np === 1 && !c.subs.length && !c.mbs.length ? "" : "-" + c.pg.join(",") + "-") + MULT[np] + "one";
    else if (P === "ol") s += (np > 1 ? "e" : "") + (n > 2 || np > 1 ? "-" + c.pg.join(",") + "-" : "") + MULT[np] + "ol";
    else s += "e";
    return pre + s;
  }
  function alkyl(m, A, r, from){
    var seen = {}, st = [r], nodes = [];
    seen[from] = 1;
    while (st.length) { var x = st.pop(); if (seen[x]) continue; seen[x] = 1; nodes.push(x); A[x].forEach(function(y){ if (!seen[y]) st.push(y); }); }
    var linear = nodes.every(function(x){ return m.a[x].el === "C"; }), prev = from, cur = r, cnt = 1;
    while (linear) { var nx = A[cur].filter(function(y){ return y !== prev; }); if (!nx.length) break; if (nx.length > 1 || C1.order(m, cur, nx[0]) !== 1) { linear = false; break; } prev = cur; cur = nx[0]; cnt++; }
    if (linear && cnt === nodes.length) return { name:STEM[cnt] + "yl", key:STEM[cnt] + "yl" };
    var Cn = nodes.filter(function(x){ return m.a[x].el === "C"; }), par = {}, Q = [r], cands = [];
    par[r] = -1;
    while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (z !== from && !(z in par) && m.a[z].el === "C") { par[z] = y; Q.push(z); } }); }
    Cn.forEach(function(e){ if (!(e in par)) return; var p = []; for (var z = e; z !== -1; z = par[z]) p.unshift(z); var c = cand(m, A, p, from, ""); c.str = assemble(c, true); cands.push(c); });
    cands.sort(cmp);
    var inner = cands[0].str;
    return { name:"(" + inner + ")", key:inner.replace(/[^a-z]/g, "") };
  }
  function name(m){
    if (m._nm) return m._nm;
    var A = C1.adj(m), R = roles(m), Cs = [], cands = [], i;
    for (i = 0; i < m.a.length; i++) if (m.a[i].el === "C") Cs.push(i);
    if (!Cs.length) return (m._nm = { name:"", parent:[], P:"", pg:[] });
    Cs.forEach(function(s){
      var par = {}, Q = [s]; par[s] = -1;
      while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (m.a[z].el === "C" && !(z in par)) { par[z] = y; Q.push(z); } }); }
      Cs.forEach(function(t){ if (!(t in par)) return; var p = []; for (var z = t; z !== -1; z = par[z]) p.unshift(z); cands.push(cand(m, A, p, null, R.P)); });
    });
    cands.forEach(function(c){ c.str = assemble(c); });
    cands.sort(cmp);
    var b = cands[0];
    return (m._nm = { name:b.str, parent:b.path, P:R.P, pg:b.pg });
  }
  function fam(m){
    if (m._fm) return m._fm;
    var R = roles(m), A = C1.adj(m), h = C1.hc(m), o = { hb:false, eth:false, P:R.P, nOH:0 };
    m.a.forEach(function(a, i){ if (a.el !== "O") return; if (h[i] >= 1) o.hb = true; if (A[i].filter(isC(m)).length === 2) o.eth = true; });
    R.per.forEach(function(p){ o.nOH += p.oh.length; });
    var cc = m.b.some(function(b){ return b[2] > 1 && m.a[b[0]].el === "C" && m.a[b[1]].el === "C"; });
    if (R.P === "ol") {
      var c = R.kind.indexOf("ol"), nC = A[c].filter(isC(m)).length;
      o.fam = "alcohol"; o.c = c; o.nC = nC; o.cls = o.nOH > 1 ? "" : nC <= 1 ? "primary" : nC === 2 ? "secondary" : "tertiary"; o.methanol = nC === 0 && o.nOH === 1;
    }
    else if (R.P === "acid") o.fam = "carboxylic acid";
    else if (R.P === "al") o.fam = "aldehyde";
    else if (R.P === "one") o.fam = "ketone";
    else if (o.eth) o.fam = "ether";
    else if (cc) o.fam = "alkene";
    else o.fam = "alkane";
    return (m._fm = o);
  }
  var COMMON = { isopropylalcohol:"propan-2-ol", isopropanol:"propan-2-ol", ethylalcohol:"ethanol", methylalcohol:"methanol", propylalcohol:"propan-1-ol",
    "n-propanol":"propan-1-ol", butylalcohol:"butan-1-ol", "tert-butylalcohol":"2-methylpropan-2-ol", "t-butylalcohol":"2-methylpropan-2-ol", "tert-butanol":"2-methylpropan-2-ol",
    isobutylalcohol:"2-methylpropan-1-ol", "sec-butylalcohol":"butan-2-ol", diethylether:"ethoxyethane", dimethylether:"methoxymethane", ethylmethylether:"methoxyethane",
    methylethylether:"methoxyethane", methylpropylether:"1-methoxypropane", propylmethylether:"1-methoxypropane", isopropylmethylether:"2-methoxypropane", methylisopropylether:"2-methoxypropane" };
  function norm(s){ return String(s || "").toLowerCase().replace(/\s+/g, "").replace(/[‐-―−]/g, "-"); }
  function canon(s){
    var t = norm(s);
    if (COMMON[t]) return { name:COMMON[t], common:true };
    var mo = t.match(/^(.*?)(\d+(?:,\d+)*)-(meth|eth|prop|but|pent|hex|hept)an(e)?(di)?ol$/);
    if (mo) return { name:mo[1].replace(/-$/, "") + mo[3] + "an" + (mo[5] ? "e" : "") + "-" + mo[2] + "-" + (mo[5] || "") + "ol", older:true };
    return { name:t };
  }
  return { name:name, roles:roles, fam:fam, canon:canon, norm:norm };
})();

// ---------- structure helpers ----------
function longestHeavy(m){
  var A = C1.adj(m);
  function far(s){ var d = {}, par = {}, Q = [s], last = s; d[s] = 0; par[s] = -1; while (Q.length) { var x = Q.shift(); last = x; A[x].forEach(function(y){ if (!(y in d)) { d[y] = d[x] + 1; par[y] = x; Q.push(y); } }); } return { t:last, par:par }; }
  if (!m.a.length) return [];
  var u = far(0).t, r = far(u), p = [];
  for (var z = r.t; z !== -1; z = r.par[z]) p.push(z);
  return p;
}
// condensed formula: the naming parent chain (or the longest C–O–C chain of an ether); OH, CHO and COOH ends go last
function condensed(m){
  if (!m.a.length) return "";
  var A = C1.adj(m), h = C1.hc(m), R = NM.roles(m), fm = NM.fam(m), path = fm.eth && !R.P ? longestHeavy(m) : NM.name(m).parent.slice(), on = {};
  function endGrp(i){ return m.a[i].el === "C" && (R.per[i].oh.length > 0 || R.per[i].dO >= 0) && A[i].filter(isC(m)).length <= 1; }
  if (path.length > 1 && endGrp(path[0]) && !endGrp(path[path.length - 1])) path.reverse();
  if (fm.eth && !R.P) { var oi = -1; path.forEach(function(x, k){ if (m.a[x].el === "O" && oi < 0) oi = k; }); if (oi > path.length - 1 - oi) path.reverse(); }
  path.forEach(function(x){ on[x] = 1; });
  function hs(i){ return h[i] ? "H" + (h[i] > 1 ? h[i] : "") : ""; }
  function group(texts){ var cnt = {}, ord = []; texts.forEach(function(t){ if (!cnt[t]) { cnt[t] = 0; ord.push(t); } cnt[t]++; }); return ord.map(function(t){ return "(" + t + ")" + (cnt[t] > 1 ? cnt[t] : ""); }).join(""); }
  function branch(r, from){
    if (m.a[r].el === "O") { var nx = A[r].filter(function(y){ return y !== from; }); return "O" + (h[r] ? "H" : "") + nx.map(function(y){ return branch(y, r); }).join(""); }
    var s = "C" + hs(r), kids = A[r].filter(function(y){ return y !== from; }), cs = kids.filter(isC(m));
    kids.forEach(function(y){ if (m.a[y].el === "O") s += C1.order(m, r, y) === 2 ? "O" : "(" + branch(y, r) + ")"; });
    if (cs.length === 1) s += branch(cs[0], r); else s += group(cs.map(function(y){ return branch(y, r); }));
    return s;
  }
  return path.map(function(i, k){
    var last = k === path.length - 1, bs = k ? ({ 2:"=", 3:"≡" }[C1.order(m, path[k - 1], i)] || "") : "";
    if (m.a[i].el === "O") return bs + "O" + (h[i] ? "H" : "");
    var kids = A[i].filter(function(y){ return !on[y]; }), s = "C" + hs(i), pre = "", tail = "";
    if (path.length === 1 && R.per[i].dO >= 0 && h[i]) { pre = "H"; s = "C" + (h[i] > 1 ? "H" : ""); }   // HCHO, HCOOH
    s += group(kids.filter(isC(m)).map(function(y){ return branch(y, i); }));
    kids.forEach(function(y){
      if (m.a[y].el !== "O") return;
      if (C1.order(m, i, y) === 2) { s += "O"; return; }
      if (h[y] && (last || k === 0) && path.length > 1 && k === 0 && !last) { pre = "HO"; return; }
      if (h[y] && last) { tail += "OH"; return; }
      s += "(" + branch(y, i) + ")";
    });
    return bs + pre + s + tail;
  }).join("");
}

// ---------- reactions ----------
function ohOf(m, c){ var A = C1.adj(m), h = C1.hc(m); return A[c].filter(function(j){ return m.a[j].el === "O" && h[j] >= 1 && C1.order(m, c, j) === 1; })[0]; }
// one [O] step: alcohol → aldehyde or ketone; aldehyde → acid
function oxStep(m){
  var R = NM.roles(m), h = C1.hc(m), c = R.kind.indexOf("ol"), k = "ol";
  if (c < 0) { c = R.kind.indexOf("al"); k = "al"; }
  if (c < 0) return { none:true, why:R.P || (NM.fam(m).eth ? "ether" : "none") };
  if (!h[c]) return { none:true, c:c, why:"tert" };
  var p = C1.clone(m);
  if (k === "ol") { var o = ohOf(m, c); p.b[C1.bondOf(p, c, o)][2] = 2; }
  else { p.b.push([c, p.a.length, 1]); p.a.push({ el:"O" }); }
  return { prod:p, c:c, to:NM.roles(p).kind[c] };
}

// ---------- explorer molecules ----------
// spec {n: chain carbons 1–6, co: chain index of the C=O carbon, me: inner chain index carrying the methyl, or null}.
// Atoms: chain 0…n−1, then the methyl, then the O (double-bonded to chain[co]).
function specMol(sp){
  var m = { a:[], b:[], main:[] }, i;
  for (i = 0; i < sp.n; i++) { m.a.push({ el:"C" }); m.main.push(i); if (i) m.b.push([i - 1, i, 1]); }
  if (sp.me != null) { m.a.push({ el:"C" }); m.b.push([sp.me, m.a.length - 1, 1]); }
  m.a.push({ el:"O" }); m.b.push([sp.co, m.a.length - 1, 2]);
  return m;
}
function specOK(sp){
  if (!sp || !(sp.n >= 1 && sp.n <= 6) || !(sp.co >= 0 && sp.co < sp.n)) return false;
  if (sp.me != null && !(sp.me >= 1 && sp.me <= sp.n - 2)) return false;
  var m = specMol(sp); for (var i = 0; i < m.a.length; i++) if (C1.free(m, i) < 0) return false;
  return true;
}
var SP = { propanal:{ n:3, co:0, me:null }, propanone:{ n:3, co:1, me:null }, butanal:{ n:4, co:0, me:null }, butanone:{ n:4, co:1, me:null }, ethanal:{ n:2, co:0, me:null } };
function oIdx(m){ for (var i = m.a.length - 1; i >= 0; i--) if (m.a[i].el === "O") return i; return -1; }
function coC(m){ var K = NM.roles(m).kind, c = K.indexOf("al"); return c >= 0 ? c : K.indexOf("one"); }
function ft(c, h, o){ return "C" + (c > 1 ? c : "") + "H" + h + (o ? "O" : ""); }
function info(m){
  var nm = NM.name(m), fm = NM.fam(m), f = C1.formula(m), c = coC(m), nC = c >= 0 ? C1.adj(m)[c].filter(isC(m)).length : 0, r = oxStep(m);
  return { name:nm.name, parent:nm.parent, fam:fm.fam, f:f, c:c, nC:nC, M:molarMass(f), bp:bpOf(nm.name),
    bonded:fm.fam === "aldehyde" ? (nC ? "one carbon and one H" : "two H (methanal)") : fm.fam === "ketone" ? "two carbons" : "—",
    ox:fm.fam === "aldehyde" && !r.none ? "yes → carboxylic acid (" + NM.name(r.prod).name + ")" : "no", prod:r.none ? null : r.prod };
}
// morph helpers: B's extra H atoms on a carbon take the ids of A's surplus H atoms on other carbons (nearest first), so a
// morph shows them hopping instead of fading (A and B share heavy-atom indices)
function hopIds(A, B){
  var cA = {}, cB = {};
  A.atoms.forEach(function(a){ if (a.isH) cA[a.par] = (cA[a.par] || 0) + 1; });
  B.atoms.forEach(function(a){ if (a.isH) cB[a.par] = (cB[a.par] || 0) + 1; });
  var pool = A.atoms.filter(function(a){ return a.isH && +a.id.split(".")[1] >= (cB[a.par] || 0); });
  B.atoms.forEach(function(b){
    if (!b.isH || +b.id.split(".")[1] < (cA[b.par] || 0) || !pool.length) return;
    var best = 0; pool.forEach(function(p, k){ if (Math.hypot(p.x - b.x, p.y - b.y) < Math.hypot(pool[best].x - b.x, pool[best].y - b.y)) best = k; });
    b.id = pool[best].id; pool.splice(best, 1);
  });
  return B;
}
// aldehyde + [O] → acid scenes: the new O takes the id of the H it replaces, so the H turns into OH where it sat
function oxScenes(m){
  var r = oxStep(m); if (r.none || NM.fam(m).fam !== "aldehyde") return null;
  var A = C1.layout2d(m), B = C1.layout2d(r.prod), k = r.prod.a.length - 1, nB = B.atoms.filter(function(a){ return a.isH && a.par === r.c; }).length, hid = "h" + r.c + "." + nB;
  B.atoms.forEach(function(a){ if (a.id === "a" + k) a.id = hid; });
  return { A:A, B:B, prod:r.prod, c:r.c, hid:hid };
}

// @component C2 nameBuilder chips (chip palette from SCH4U 02) with a carbonyl judge: a name built from chips (locants,
// methyl, parent chain, suffix -al / -one / -ol; current or older forms such as 2-pentanone) is parsed, rebuilt as a molecule
// and named with NM, so a wrong name gets a named mistake (aldehyde locant, lowest locant, family, too short, carbon count).
//   C2.compose(tokens) -> name · C2.chips(host, {rows, get, set, locked, onChange}) -> {paint} · C2.judge(str, target) -> {ok, msg}
var C2 = (function(){
  var ROOT = ["meth", "eth", "prop", "but", "pent", "hex"];
  var M1 = "The CHO carbon is C1 of the chain. Count it, and don’t add a locant.", M3 = "Check the carbonyl carbon: an H on it means aldehyde; two carbons on it means ketone.",
    M5 = "Give the C=O the lowest locant.", M6 = "A ketone’s C=O must sit between two carbons: at least 3 carbons.";
  function compose(tk){
    var s = "", prev = null;
    (tk || []).forEach(function(t){ var isL = /^\d+$/.test(t); if (prev !== null) { var pL = /^\d+$/.test(prev); if (isL && pL) s += ","; else if (isL !== pL) s += "-"; } s += t; prev = t; });
    return s;
  }
  function chips(host, o){
    host.innerHTML = '<p class="c2-tape" aria-live="polite"></p><div class="c2-rows">' + o.rows.map(function(r){
      return '<div class="c2-row" role="group" aria-label="' + r[0] + '"><span class="c2-lab">' + r[0] + "</span>" + r[1].map(function(t){ return '<button type="button" class="chip c2-c" data-t="' + t + '" data-k="c2' + t + '">' + t + "</button>"; }).join("") + "</div>";
    }).join("") + '</div><div class="q-actions c2-act"><button type="button" class="btn ghost sm" data-c2="back" data-k="c2back">⌫ Back</button><button type="button" class="btn ghost sm" data-c2="clear" data-k="c2clear">Clear</button></div>';
    var tape = $(".c2-tape", host);
    function paint(){
      var tk = o.get() || [], s = compose(tk), lock = o.locked && o.locked();
      tape.innerHTML = '<span class="c2-lab">Your name:</span> ' + (s ? '<span class="c2-name">' + s + "</span>" : '<span class="muted">tap chips to build it</span>');
      $$("button", host).forEach(function(b){ b.disabled = !!lock || (!!b.dataset.c2 && !tk.length); });
    }
    host.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      var tk = (o.get() || []).slice();
      if (b.dataset.t) tk.push(b.dataset.t); else if (b.dataset.c2 === "back") tk.pop(); else if (b.dataset.c2 === "clear") tk = [];
      o.set(tk); paint(); if (o.onChange) o.onChange(compose(tk));
    });
    paint();
    return { paint:paint };
  }
  function parse(s){
    var m = s.match(/^(?:(\d+)-methyl)?(meth|eth|prop|but|pent|hex)an(?:-(\d+)-)?(al|one|ol)$/), older = false;
    if (!m) { var o = s.match(/^(?:(\d+)-methyl-?)?(?:(\d+)-)?(meth|eth|prop|but|pent|hex)an(al|one|ol)$/); if (o) { m = [o[0], o[1], o[3], o[2], o[4]]; older = !!o[2]; } }
    if (!m) return null;
    return { me:m[1] ? +m[1] : null, n:ROOT.indexOf(m[2]) + 1, g:m[3] ? +m[3] : null, suf:m[4], older:older };
  }
  function cur(p){ return (p.me ? p.me + "-methyl" : "") + ROOT[p.n - 1] + "an" + (p.suf === "al" ? "al" : (p.n <= 4 && !p.me ? "" : "-" + p.g + "-") + p.suf); }
  function build(p){ var sp = { n:p.n, co:p.suf === "al" ? 0 : p.g - 1, me:p.me ? p.me - 1 : null }; return specOK(sp) ? specMol(sp) : null; }
  function judge(str, target){
    var s = NM.norm(str);
    if (!s) return { ok:false, msg:"Build a name with the chips first." };
    if (s === target) return { ok:true };
    var p = parse(s);
    if (!p) return { ok:false, msg:"Build the name in this order: locant and prefix, then the parent chain, then a locant and the suffix, as in 3-methylbutan-2-one." };
    if (p.suf === "ol") return { ok:false, msg:"-ol means an alcohol. This molecule has a C=O: use -al or -one." };
    if (p.suf === "al" && p.g != null) return { ok:false, msg:M1 };
    if (p.suf === "one" && p.n < 3) return { ok:false, msg:M6 };
    if (p.suf === "one" && p.g == null) { if (p.n > 4 || p.me) return { ok:false, msg:"Say where the C=O is: this ketone needs a locant." }; p.g = 2; }
    if ((p.g && p.g > p.n) || (p.me && p.me > p.n)) return { ok:false, msg:"A locant can’t be larger than the number of carbons in the chain." };
    if (p.suf === "one" && (p.g === 1 || p.g === p.n)) return { ok:false, msg:"A C=O on an end carbon makes an aldehyde: -al. " + M3 };
    if (p.me && (p.me === 1 || p.me === p.n)) return { ok:false, msg:"A methyl on an end carbon just makes the chain longer: count the longest chain." };
    var m = build(p);
    if (!m) return { ok:false, msg:"That carbon already holds the C=O: there’s no room for a methyl there." };
    var nm = NM.name(m).name;
    if (nm === target) {
      if (cur(p) === target) return { ok:true, msg:p.older ? "Accepted. Current IUPAC writes it " + target + "." : "Accepted. The locant isn’t needed here (the C=O can only be on C2), so it’s usually written " + target + "." };
      return { ok:false, msg:p.suf === "one" ? M5 : "Same molecule, but that isn’t its IUPAC name: number from the CHO carbon along the longest chain." };
    }
    var tp = parse(target), tm = null;
    if (tp) { if (tp.suf === "one" && tp.g == null) tp.g = 2; tm = build(tp); }
    if (!tm) return { ok:false, msg:"That name describes a different molecule. Check the structure again." };
    if ((p.suf === "al") !== (tp.suf === "al")) return { ok:false, msg:M3 };
    var a = C1.formula(m).C, b = C1.formula(tm).C;
    if (a !== b) return { ok:false, msg:"Count the carbons again: this molecule has " + b + ", including any branch." };
    return { ok:false, msg:"Right family and number of carbons, but a different structure: check where the C=O and the branch sit." };
  }
  return { compose:compose, chips:chips, judge:judge, parse:parse };
})();
var NAME_ROWS = [["Locants", ["1", "2", "3", "4", "5", "6"]], ["Prefix", ["methyl"]], ["Parent chain", ["methan", "ethan", "propan", "butan", "pentan", "hexan"]], ["Suffix", ["al", "one", "ol"]]];

// @component dipoleBox (adapted from SCH4U 03 hbondBox) — particle view for carbonyl compounds: skeletal glyphs (C and O;
// H left out) with δ−/δ+ labels, head-to-tail dipole alignment in the pure liquid, water molecules H-bonding to the C=O
// oxygen (violet dotted lines, --e-pair) in solution, a top layer for less soluble ones, a "poured onto water" start layout;
// translate-only jiggle (static with reduced motion); moveTo() glides between layouts with the same molecule count.
//   pLayout(sp, "pure" | "water" | "pour", W, H) -> layout · dipoleBox(svg) -> {draw(L), start(), stop(), layout(), moveTo(L2, dur, done)}
function rnd(i){ var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
function pGlyph(sp){
  var at = [], bonds = [], i, P = function(k){ return [k * 0.866, (k % 2) * 0.5]; };
  for (i = 0; i < sp.n; i++) { var p = P(i); at.push({ el:"C", x:p[0], y:p[1] }); if (i) bonds.push([i - 1, i, 1]); }
  if (sp.me != null) { var q = P(sp.me); at.push({ el:"C", x:q[0], y:q[1] + (sp.me % 2 ? 1 : -1) }); bonds.push([sp.me, at.length - 1, 1]); }
  var c = P(sp.co), dn = sp.co % 2 ? 1 : -1;
  at.push({ el:"O", x:c[0], y:c[1] + dn * 1.15 }); bonds.push([sp.co, at.length - 1, 2]);
  at.forEach(function(a){ a.x -= c[0]; a.y -= c[1]; if (dn > 0) { a.x = -a.x; a.y = -a.y; } });   // C→O points up
  var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, R = 0.6;
  at.forEach(function(a){ x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
  var bx = (x0 + x1) / 2, by = (y0 + y1) / 2;
  at.forEach(function(a){ a.x -= bx; a.y -= by; R = Math.max(R, Math.hypot(a.x, a.y)); });
  return { at:at, bonds:bonds, ci:sp.co, oi:at.length - 1, R:R + 0.5 };
}
function placeG(g, x, y, th, U){
  var c = Math.cos(th), s = Math.sin(th), loc = g.at.map(function(a){ return { el:a.el, x:(a.x * c - a.y * s) * U, y:(a.x * s + a.y * c) * U }; });
  var C = loc[g.ci], O = loc[g.oi], L = Math.hypot(O.x - C.x, O.y - C.y) || 1, ux = (O.x - C.x) / L, uy = (O.y - C.y) / L, d = U * 0.66;
  return { x:x, y:y, th:th, loc:loc, bonds:g.bonds, ci:g.ci, oi:g.oi, org:true, R:g.R * U, dneg:{ x:O.x + ux * d, y:O.y + uy * d }, dpos:{ x:C.x - ux * d, y:C.y - uy * d } };
}
function waterAt(x, y, th, sgn){ var d = 10, t2 = th + sgn * 1.82; return { x:x, y:y, loc:[{ el:"O", x:0, y:0 }, { el:"H", x:d * Math.cos(th), y:d * Math.sin(th) }, { el:"H", x:d * Math.cos(t2), y:d * Math.sin(t2) }], bonds:[[0, 1, 1], [0, 2, 1]], water:true }; }
function mixLevel(sp){ var f = C1.formula(specMol(sp)); return f.C <= 3 ? "mix" : f.C === 4 ? "part" : "low"; }
function pLayout(sp, mode, W, H){
  var g = pGlyph(sp), items = [], narrow = W < 480, i;
  if (mode === "pure") {
    var cols = narrow ? 3 : 5, N = 10, rows = Math.ceil(N / cols), cw = W / cols, ch = H / rows, pos = [];
    var U = clamp((Math.min(cw, ch) / 2 - 4) / g.R, 9, 26);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { var cc = r % 2 ? cols - 1 - c : c; if (pos.length < N) pos.push([(cc + 0.5) * cw + (rnd(pos.length) - 0.5) * cw * 0.14, (r + 0.5) * ch + (rnd(pos.length + 40) - 0.5) * ch * 0.14]); }
    pos.forEach(function(p, k){
      var q = pos[k + 1] || [2 * p[0] - pos[k - 1][0], 2 * p[1] - pos[k - 1][1]];
      items.push(placeG(g, p[0], p[1], Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2 + (rnd(k + 9) - 0.5) * 0.3, U));
    });
    items.forEach(function(it){   // keep every atom and label inside the box
      var pts = it.loc.concat([it.dneg, it.dpos]), x0 = Math.min.apply(null, pts.map(function(q){ return q.x; })), x1 = Math.max.apply(null, pts.map(function(q){ return q.x; })), y0 = Math.min.apply(null, pts.map(function(q){ return q.y; })), y1 = Math.max.apply(null, pts.map(function(q){ return q.y; }));
      it.x = clamp(it.x, 10 - x0, W - 10 - x1); it.y = clamp(it.y, 10 - y0, H - 10 - y1);
    });
    return { W:W, H:H, mode:mode, items:items, nOrg:N, layerY:0, hb:[], U:U, name:NM.name(specMol(sp)).name };
  }
  var mix = mixLevel(sp), nOrg = narrow ? 5 : 6, nIn = mode === "pour" ? 0 : mix === "mix" ? nOrg : mix === "part" ? 2 : 1, nLay = nOrg - nIn;
  var layerY = nLay ? Math.round(H * 0.3) : 0, U2 = clamp(36 / g.R, 11, 20);
  var sx = narrow ? 44 : 50, sy = sx * 0.87, sites = [], row = 0;
  for (var y = 18; y < H - 10; y += sy, row++) for (var x = 18 + (row % 2) * sx / 2; x < W - 10; x += sx) sites.push({ x:x + (rnd(sites.length) - 0.5) * 7, y:y + (rnd(sites.length + 99) - 0.5) * 7 });
  function thOf(k){ return (k % 2 ? -1 : 1) * Math.PI / 2 + (rnd(k + 3) - 0.5) * 0.5; }
  // dispersed molecules: spread-out sites under the layer (farthest-point picks)
  var mg = Math.max(40, g.R * U2 + 6), pool = sites.filter(function(s){ return s.y > layerY + Math.max(34, mg) && s.x > mg && s.x < W - mg && s.y < H - mg; }), picks = [];
  if (nIn && pool.length) {
    picks.push(pool[Math.floor(pool.length * 0.3)]);
    while (picks.length < Math.min(nIn, pool.length)) {
      var best = null; pool.forEach(function(s){ if (picks.indexOf(s) >= 0) return; var d = Math.min.apply(null, picks.map(function(p){ return Math.hypot(p.x - s.x, p.y - s.y) + (rnd(p.x + s.y) * 4); })); if (!best || d > best.d) best = { s:s, d:d }; });
      picks.push(best.s);
    }
  }
  for (i = 0; i < nOrg; i++) {
    var inW = i >= nLay, k2 = i - nLay;
    if (inW && picks[k2]) items.push(placeG(g, picks[k2].x, picks[k2].y, thOf(i), U2));
    else { var j = inW ? i : i; items.push(placeG(g, (j + 0.5) * W / nOrg, layerY * 0.5 + (j % 2 ? 5 : -5), thOf(i), U2)); }
  }
  var hb = [], used = {};
  sites.forEach(function(s, k){
    var hide = s.y < layerY + 10;
    for (var q = 0; q < nOrg && !hide; q++) { var it = items[q]; for (var a = 0; a < it.loc.length; a++) if (Math.hypot(it.x + it.loc[a].x - s.x, it.y + it.loc[a].y - s.y) < 20) { hide = true; break; } }
    var w = waterAt(s.x, s.y, rnd(k * 7 + 1) * Math.PI * 2, k % 2 ? 1 : -1); w.hide = hide; items.push(w);
  });
  if (mode !== "pour") for (i = nLay; i < nOrg; i++) {
    var it2 = items[i], ox = it2.x + it2.loc[it2.oi].x, oy = it2.y + it2.loc[it2.oi].y, near = [];
    items.forEach(function(w, wi){ if (!w.water || w.hide || used[wi]) return; var d = Math.hypot(w.x - ox, w.y - oy); if (d > 16 && d < 56) near.push({ wi:wi, d:d }); });
    near.sort(function(p, q){ return p.d - q.d; }).slice(0, 2).forEach(function(n){
      var w = items[n.wi]; used[n.wi] = 1;
      var nw = waterAt(w.x, w.y, Math.atan2(oy - w.y, ox - w.x), n.wi % 2 ? 1 : -1); nw.hide = false; items[n.wi] = nw;
      hb.push([n.wi, 1, i, it2.oi]);
    });
  }
  return { W:W, H:H, mode:mode, mix:mix, items:items, nOrg:nOrg, layerY:layerY, hb:hb, U:U2, name:NM.name(specMol(sp)).name };
}
function atomSVG(a, x, y, r, fsz){
  var c = MV.chem.atom(a.el), rr = a.el === "H" ? r * 0.72 : r;
  return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(rr) + '" fill="' + c.fill + '"' + (a.el === "H" ? ' stroke="' + c.line + '" stroke-width="1.2"' : "") + '/><text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(a.el === "H" ? fsz * 0.85 : fsz) + '" font-weight="700" fill="' + c.ink + '">' + a.el + "</text>";
}
function dipoleBox(svg){
  var L = null, gs = [], lines = [], on = false, raf = 0, last = 0, hbK = 1, frozenT = 0;
  function itemSVG(it){
    var s = "", r = it.water ? 6.2 : clamp(L.U * 0.3, 4.6, 6.6), fz = it.water ? 8 : r * 1.3;
    it.bonds.forEach(function(b){
      var p = it.loc[b[0]], q = it.loc[b[1]];
      if (b[2] > 1) { var dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1, nx = -dy / l * 2.4, ny = dx / l * 2.4; [-1, 1].forEach(function(sg){ s += '<line x1="' + r1(p.x + nx * sg) + '" y1="' + r1(p.y + ny * sg) + '" x2="' + r1(q.x + nx * sg) + '" y2="' + r1(q.y + ny * sg) + '" stroke="var(--ink-2)" stroke-width="1.8"/>'; }); }
      else s += '<line x1="' + r1(p.x) + '" y1="' + r1(p.y) + '" x2="' + r1(q.x) + '" y2="' + r1(q.y) + '" stroke="var(--ink-2)" stroke-width="2"/>';
    });
    it.loc.forEach(function(a){ s += atomSVG(a, a.x, a.y, r, fz); });
    if (it.org && L.mode !== "pure") s = '<circle cx="0" cy="0" r="' + r1(it.R * 0.92) + '" fill="var(--hi-soft)" stroke="var(--hi)" stroke-width="1.2"/>' + s;
    if (it.org) { var dz = clamp(L.U * 0.62, 9, 12); s += '<text x="' + r1(it.dneg.x) + '" y="' + r1(it.dneg.y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(dz) + '" font-weight="700" fill="var(--dl-neg)" stroke="var(--sheet)" stroke-width="2.5" paint-order="stroke">δ−</text><text x="' + r1(it.dpos.x) + '" y="' + r1(it.dpos.y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(dz) + '" font-weight="700" fill="var(--dl-pos)" stroke="var(--sheet)" stroke-width="2.5" paint-order="stroke">δ+</text>'; }
    return s;
  }
  function build(){
    var W = L.W, H = L.H, s = '<defs><clipPath id="ak-pclip"><rect x="0" y="0" width="' + W + '" height="' + H + '" rx="10"/></clipPath></defs><g clip-path="url(#ak-pclip)">';
    if (L.mode !== "pure") s += '<rect x="0" y="' + L.layerY + '" width="' + W + '" height="' + (H - L.layerY) + '" fill="var(--info-bg)"/>' + (L.layerY ? '<line x1="0" y1="' + L.layerY + '" x2="' + W + '" y2="' + L.layerY + '" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="6 5"/>' : "");
    s += '<g class="ak-hb"></g>';
    L.items.forEach(function(it, k){ s += '<g data-pi="' + k + '"' + (it.hide ? ' opacity="0"' : "") + ">" + itemSVG(it) + "</g>"; });
    if (L.mode !== "pure") {
      s += '<text x="' + (W - 10) + '" y="' + (H - 10) + '" text-anchor="end" font-size="13" font-weight="700" fill="var(--ink-2)" stroke="var(--sheet)" stroke-width="3" paint-order="stroke">' + (L.mode !== "pour" && L.mix === "mix" ? "mixed with water" : "water") + "</text>";
      if (L.layerY) s += '<text x="' + (W - 10) + '" y="' + (L.layerY - 8) + '" text-anchor="end" font-size="13" font-weight="700" fill="var(--ink-2)" stroke="var(--sheet)" stroke-width="3" paint-order="stroke">' + esc(L.name) + (L.mode === "pour" ? " poured on top" : " layer") + "</text>";
    }
    s += '</g><rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="none" stroke="var(--rule)" stroke-width="2"/>';
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.innerHTML = s; gs = $$("g[data-pi]", svg); lines = [];
  }
  function off(k, t){ var a = L.items[k].water ? 2 : 1.6; return [a * Math.sin(t * (1.3 + rnd(k) * 0.9) + k * 1.7), a * Math.cos(t * (1.1 + rnd(k + 5) * 0.8) + k * 2.3)]; }
  function frame(t, pos){
    if (!L) return;
    var P = L.items.map(function(it, k){ var o = MV.reduceMotion ? [0, 0] : off(k, t), b = pos ? pos[k] : it; return [b.x + o[0], b.y + o[1]]; });
    gs.forEach(function(g, k){ g.setAttribute("transform", "translate(" + r1(P[k][0]) + "," + r1(P[k][1]) + ")"); });
    var hbG = $(".ak-hb", svg); if (!hbG) return;
    while (lines.length < L.hb.length) { var ln = document.createElementNS("http://www.w3.org/2000/svg", "line"); ln.setAttribute("stroke", "var(--e-pair)"); ln.setAttribute("stroke-width", "3"); ln.setAttribute("stroke-dasharray", "2.5 3"); ln.setAttribute("stroke-linecap", "round"); hbG.appendChild(ln); lines.push(ln); }
    lines.forEach(function(ln, q){
      var p = L.hb[q]; if (!p || hbK <= 0.01) { ln.setAttribute("opacity", "0"); return; }
      var w = L.items[p[0]], m = L.items[p[2]];
      ln.setAttribute("x1", r1(P[p[0]][0] + w.loc[p[1]].x)); ln.setAttribute("y1", r1(P[p[0]][1] + w.loc[p[1]].y));
      ln.setAttribute("x2", r1(P[p[2]][0] + m.loc[p[3]].x)); ln.setAttribute("y2", r1(P[p[2]][1] + m.loc[p[3]].y));
      ln.setAttribute("opacity", r1(hbK * (MV.reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(t * 2.4 + q * 1.9)) * 100) / 100);
    });
  }
  function tick(ts){ if (!on) return; if (ts - last > 66) { last = ts; frozenT = ts / 1000; frame(frozenT); } raf = requestAnimationFrame(tick); }
  return {
    draw:function(layout){ L = layout; hbK = 1; build(); frame(frozenT); },
    start:function(){ if (on || MV.reduceMotion || !L) return; on = true; raf = requestAnimationFrame(tick); },
    stop:function(){ on = false; cancelAnimationFrame(raf); },
    layout:function(){ return L; },
    moveTo:function(L2, dur, done){
      var L1 = L, from = L1.items.map(function(it){ return { x:it.x, y:it.y }; });
      L = L2; hbK = 0; build();
      gs.forEach(function(g, k){ var it = L2.items[k]; if (it.water) g.setAttribute("opacity", L1.items[k] && !L1.items[k].hide ? "1" : "0"); });
      MV.tween({ dur:dur, step:function(t){
        var pos = L2.items.map(function(it, k){ var a = from[k] || it; return { x:a.x + (it.x - a.x) * t, y:a.y + (it.y - a.y) * t }; });
        gs.forEach(function(g, k){ var it = L2.items[k]; if (!it.water) return; var v0 = L1.items[k] && !L1.items[k].hide ? 1 : 0, v1 = it.hide ? 0 : 1; g.setAttribute("opacity", r1(v0 + (v1 - v0) * t)); });
        frame(frozenT, pos);
      }, done:function(){ MV.tween({ dur:600, step:function(t){ hbK = t; frame(frozenT); }, done:function(){ hbK = 1; frame(frozenT); if (done) done(); } }); } });
    }
  };
}

// @component bpBars (from SCH4U 03) — boiling-point columns on a fixed −100 to 200 °C scale (data bars --pen; the current
// molecule solid, comparisons translucent) with HTML labels below (role, name, formula · molar mass). barsHTML(set, W, vals, hideI)
function barSet(m){
  var I = info(m), n = I.f.C, alk = STEM[n + 1] + "ane", alc = n <= 2 ? ["", "methanol", "ethanol"][n] : STEM[n] + "an-1-ol";
  return [{ role:"alkane of similar mass", nm:alk, f:ft(n + 1, 2 * n + 4, 0), M:Math.round(molarMass({ C:n + 1, H:2 * n + 4 })), v:bpOf(alk) },
    { role:"this molecule", nm:I.name, f:C1.fText(m), M:Math.round(I.M), v:I.bp, cur:true },
    { role:"primary alcohol of similar mass", nm:alc, f:ft(n, 2 * n + 2, 1), M:Math.round(molarMass({ C:n, H:2 * n + 2, O:1 })), v:bpOf(alc) }];
}
function barsHTML(set, W, vals, hideI){
  var H = 210, top = 28, bot = 188, lo = -100, hi = 200, L = 46, cw = (W - L - 6) / set.length;
  function Y(v){ return bot - (clamp(v, lo, hi) - lo) / (hi - lo) * (bot - top); }
  var s = "";
  [-100, 0, 100, 200].forEach(function(v){ var y = r1(Y(v)); s += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - 4) + '" y2="' + y + '" stroke="var(' + (v === 0 ? "--ink-2" : "--plot-grid") + ')" stroke-width="' + (v === 0 ? 1.6 : 1) + '"' + (v === 0 ? ' stroke-dasharray="5 4"' : "") + '/><text x="' + (L - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="central" font-size="12" fill="var(--ink-2)">' + MV.chem.fx(v, 0) + "</text>"; });
  s += '<text x="4" y="12" font-size="12" font-weight="700" fill="var(--ink-2)">°C</text>';
  set.forEach(function(b, i){
    var v = vals ? vals[i] : b.v, cx = L + cw * (i + 0.5), bw = Math.min(48, cw * 0.46);
    if (i === hideI) { s += '<text x="' + r1(cx) + '" y="' + r1((top + bot) / 2) + '" text-anchor="middle" font-size="26" font-weight="700" fill="var(--ink-2)">?</text>'; return; }
    if (v == null) { s += '<text x="' + r1(cx) + '" y="' + r1((top + bot) / 2) + '" text-anchor="middle" font-size="13" fill="var(--ink-2)">no data</text>'; return; }
    var y = Y(v);
    s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(y) + '" width="' + r1(bw) + '" height="' + r1(Math.max(2, bot - y)) + '" rx="5" fill="var(--pen)"' + (b.cur ? "" : ' fill-opacity=".4" stroke="var(--pen)" stroke-width="1.5"') + "/>";
    s += '<text x="' + r1(cx) + '" y="' + r1(y - 9) + '" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">' + degC(Math.round(v)) + "</text>";
  });
  var aria = "Boiling points: " + set.map(function(b, i){ var v = vals ? vals[i] : b.v; return b.nm + " " + (i === hideI ? "hidden until the reveal" : v == null ? "no data" : MV.plain(degC(Math.round(v)))); }).join("; ") + ".";
  var labs = '<div class="ak-blabs" style="padding-left:' + L + 'px">' + set.map(function(b){ return '<div class="ak-blab' + (b.cur ? " cur" : "") + '"><span class="tiny muted">' + b.role + "</span><strong>" + b.nm + '</strong><span class="tiny">' + F(b.f) + " · " + b.M + " g/mol</span></div>"; }).join("") + "</div>";
  return '<svg class="ak-bsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>" + labs;
}

// ---------- everyday-molecule gallery: hand-placed structures (unit = one bond; ring carbons are skeletal vertices) ----------
// nodes [label, x, y, "o" for oxygen labels]; bonds [i, j, order]; co: [C, O] carbonyl pairs (highlighted); aH: aldehyde H (circled)
var RING6 = [["", 1, 0], ["", 0.5, 0.866], ["", -0.5, 0.866], ["", -1, 0], ["", -0.5, -0.866], ["", 0.5, -0.866]];
var RINGB = [[0, 1, 1], [1, 2, 2], [2, 3, 1], [3, 4, 2], [4, 5, 1], [5, 0, 2]];
var GAL = {
  methanal:{ n:[["C", 0, 0], ["O", 0, -1, "o"], ["H", -0.87, 0.5], ["H", 0.87, 0.5]], b:[[0, 1, 2], [0, 2, 1], [0, 3, 1]], co:[[0, 1]], aH:[2, 3] },
  ethanal:{ n:[["C", 0, 0], ["O", 0, -1, "o"], ["H", 0.87, 0.5], ["CH3", -0.87, 0.5]], b:[[0, 1, 2], [0, 2, 1], [0, 3, 1]], co:[[0, 1]], aH:[2] },
  propanone:{ n:[["C", 0, 0], ["O", 0, -1, "o"], ["CH3", -0.87, 0.5], ["CH3", 0.87, 0.5]], b:[[0, 1, 2], [0, 2, 1], [0, 3, 1]], co:[[0, 1]], aH:[] },
  butanedione:{ n:[["CH3", -0.87, 0.5], ["C", 0, 0], ["O", 0, -1, "o"], ["C", 0.87, 0.5], ["O", 0.87, 1.5, "o"], ["CH3", 1.73, 0]], b:[[0, 1, 1], [1, 2, 2], [1, 3, 1], [3, 4, 2], [3, 5, 1]], co:[[1, 2], [3, 4]], aH:[] },
  benzaldehyde:{ n:RING6.concat([["C", 2, 0], ["O", 2.5, -0.866, "o"], ["H", 2.5, 0.866]]), b:RINGB.concat([[0, 6, 1], [6, 7, 2], [6, 8, 1]]), co:[[6, 7]], aH:[8] },
  cinnamaldehyde:{ n:RING6.concat([["CH", 1.5, -0.866], ["CH", 2.5, -0.866], ["C", 3, 0], ["O", 4, 0, "o"], ["H", 2.5, 0.866]]), b:RINGB.concat([[0, 6, 1], [6, 7, 2], [7, 8, 1], [8, 9, 2], [8, 10, 1]]), co:[[8, 9]], aH:[10] },
  vanillin:{ n:RING6.concat([["C", 2, 0], ["O", 2.5, -0.866, "o"], ["H", 2.5, 0.866], ["HO", -2, 0, "o"], ["O", -1, 1.732, "o"], ["CH3", -2, 1.732]]), b:RINGB.concat([[0, 6, 1], [6, 7, 2], [6, 8, 1], [3, 9, 1], [2, 10, 1], [10, 11, 1]]), co:[[6, 7]], aH:[8] }
};
function tspan(t, fs){ var out = "", low = false, d = r1(fs * 0.28);
  String(t).replace(/(\d+|\D+)/g, function(seg){ var dig = /^\d/.test(seg); if (dig && !low) { out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.72) + '">' + seg + "</tspan>"; low = true; } else if (!dig && low) { out += '<tspan dy="' + (-d) + '">' + seg + "</tspan>"; low = false; } else out += seg; return seg; });
  return out; }
function textW(t, fs){ var w = 0; String(t).split("").forEach(function(ch){ w += /\d/.test(ch) ? 0.42 : /[a-z]/.test(ch) ? 0.5 : 0.66; }); return w * fs; }
function galSVG(d, W, H){
  var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  d.n.forEach(function(p){ x0 = Math.min(x0, p[1]); x1 = Math.max(x1, p[1]); y0 = Math.min(y0, p[2]); y1 = Math.max(y1, p[2]); });
  var s = Math.min((W - 50) / (x1 - x0 + 1), (H - 40) / (y1 - y0 + 1), 64), ox = W / 2 - (x0 + x1) / 2 * s, oy = H / 2 - (y0 + y1) / 2 * s, fs = clamp(s * 0.38, 13, 21), out = "";
  function X(p){ return ox + p[1] * s; } function Y(p){ return oy + p[2] * s; }
  var ext = d.n.map(function(p){ return p[0] ? [textW(p[0], fs) / 2 + 3, fs * 0.55] : [0, 0]; });
  var rc = [0, 0], nr = 0; d.n.forEach(function(p){ if (!p[0]) { rc[0] += X(p); rc[1] += Y(p); nr++; } }); if (nr) { rc[0] /= nr; rc[1] /= nr; }
  d.co.forEach(function(c){ var a = d.n[c[0]], b = d.n[c[1]]; out += '<line x1="' + r1(X(a)) + '" y1="' + r1(Y(a)) + '" x2="' + r1(X(b)) + '" y2="' + r1(Y(b)) + '" stroke="var(--hi)" stroke-width="' + r1(fs * 2) + '" stroke-linecap="round" opacity=".55"/>'; });
  d.aH.forEach(function(i){ var p = d.n[i]; out += '<circle cx="' + r1(X(p)) + '" cy="' + r1(Y(p)) + '" r="' + r1(fs * 0.82) + '" fill="var(--hi-soft)" stroke="var(--pen)" stroke-width="1.8" stroke-dasharray="3 2"/>'; });
  d.b.forEach(function(b){
    var A = d.n[b[0]], B = d.n[b[1]], ax = X(A), ay = Y(A), bx = X(B), by = Y(B), dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    var ta = Math.min(ux ? ext[b[0]][0] / Math.abs(ux) : 1e9, uy ? ext[b[0]][1] / Math.abs(uy) : 1e9), tb = Math.min(ux ? ext[b[1]][0] / Math.abs(ux) : 1e9, uy ? ext[b[1]][1] / Math.abs(uy) : 1e9);
    var p1 = [ax + ux * ta, ay + uy * ta], p2 = [bx - ux * tb, by - uy * tb], ln = function(q1, q2){ return '<line x1="' + r1(q1[0]) + '" y1="' + r1(q1[1]) + '" x2="' + r1(q2[0]) + '" y2="' + r1(q2[1]) + '" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>'; };
    if (b[2] === 2 && !A[0] && !B[0]) {
      var mx = (ax + bx) / 2, my = (ay + by) / 2, vx = rc[0] - mx, vy = rc[1] - my, vl = Math.hypot(vx, vy) || 1, o = 6;
      out += ln(p1, p2) + ln([ax + ux * L * 0.16 + vx / vl * o, ay + uy * L * 0.16 + vy / vl * o], [bx - ux * L * 0.16 + vx / vl * o, by - uy * L * 0.16 + vy / vl * o]);
    } else if (b[2] === 2) { var nx = -uy * 3.2, ny = ux * 3.2; out += ln([p1[0] + nx, p1[1] + ny], [p2[0] + nx, p2[1] + ny]) + ln([p1[0] - nx, p1[1] - ny], [p2[0] - nx, p2[1] - ny]); }
    else out += ln(p1, p2);
  });
  d.n.forEach(function(p){ if (!p[0]) return; out += '<text x="' + r1(X(p)) + '" y="' + r1(Y(p)) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(p[0] === "H" ? fs * 0.9 : fs) + '" font-weight="' + (p[3] ? 700 : 400) + '" fill="' + (p[3] ? "var(--at-o)" : p[0] === "H" ? "var(--ink-2)" : "var(--at-c)") + '">' + tspan(p[0], fs) + "</text>"; });
  return out;
}

// ---------- hero: propanal → propanone, then [O] meets each ----------
function hero(){
  var svg = $("#ak-hx-svg"), cap = $("#ak-hx-cap"), rep = $("#ak-hx-replay");
  if (!svg) return;
  var mA = specMol(SP.propanal), mB = specMol(SP.propanone), sA = C1.layout2d(mA), sB = hopIds(sA, C1.layout2d(mB)), ox = oxScenes(mA), sAc = ox.B;
  // two layouts: side by side (wide figure) or stacked (phones), chosen when the animation starts
  var G = null, fA, fB, fAL, fBR, fAcL;
  var WIDE = { vb:[560, 320], BIG:[30, 8, 500, 252], LB:[0, 22, 280, 226], RB:[280, 22, 280, 226], big:[280, 300], L:[140, 278], R:[420, 278], sub:26, tL:[40, 24], tR:[490, 24], tEnd:[530, 28], sm:60 },
    TALL = { vb:[400, 560], BIG:[10, 60, 380, 300], LB:[0, 6, 400, 226], RB:[0, 276, 400, 226], big:[200, 400], L:[200, 252], R:[200, 522], sub:22, tL:[34, 26], tR:[366, 290], tEnd:[372, 300], sm:62 };
  function setGeom(){
    var w = svg.getBoundingClientRect().width || 560, g = w && w < 460 ? TALL : WIDE;
    if (g === G) return; G = g; svg.setAttribute("viewBox", "0 0 " + G.vb[0] + " " + G.vb[1]);
    fA = fitIn(sA, G.BIG, 86); fB = fitIn(sB, G.BIG, 86); fAL = fitIn(sA, G.LB, G.sm); fBR = fitIn(sB, G.RB, G.sm); fAcL = fitIn(sAc, G.LB, G.sm);
  }
  function fitIn(sc, b, smax){ var f = C1.fit2(sc, b[2], b[3], smax); return { s:f.s, ox:f.ox + b[0], oy:f.oy + b[1] }; }
  function lerp(a, b, t){ return a + (b - a) * t; }
  function lf(a, b, t){ return { s:lerp(a.s, b.s, t), ox:lerp(a.ox, b.ox, t), oy:lerp(a.oy, b.oy, t) }; }
  function txt(p, t, sz, col, dy){ return '<text x="' + p[0] + '" y="' + (p[1] + (dy || 0)) + '" text-anchor="middle" font-size="' + (sz || 21) + '" font-weight="700" fill="var(' + (col || "--ink") + ')">' + t + "</text>"; }
  function tok(x, y, op){ return '<g opacity="' + r1(op) + '"><circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="23" fill="var(--sheet)" stroke="var(--at-o)" stroke-width="2.6"/><text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="var(--at-o)">[O]</text></g>'; }
  function scr(sc, f, i){ var k = C1.atomByI(sc, i), a = sc.atoms[k]; return [f.ox + a.x * f.s, f.oy + a.y * f.s]; }
  var dipA = { dip:{ c:0, o:3 } }, dipB = { dip:{ c:1, o:3 } };
  function draw(ph, u){
    var s = "";
    if (ph === 0) s = C1.svg2d(sA, fA, dipA) + txt(G.big, "propanal (an aldehyde)");
    else if (ph === 1) s = C1.svg2d(C1.morph(sA, sB)(u), lf(fA, fB, u), {}) + txt(G.big, u < 0.5 ? "propanal" : "propanone");
    else if (ph === 2) s = C1.svg2d(sB, fB, dipB) + txt(G.big, "propanone (a ketone)");
    else if (ph === 3) s = '<g opacity="' + r1(1 - u) + '">' + C1.svg2d(sB, fB, {}) + "</g>" + '<g opacity="' + r1(u) + '">' + C1.svg2d(sA, fAL, {}) + C1.svg2d(sB, fBR, {}) + txt(G.L, "propanal", 20) + txt(G.R, "propanone", 20) + "</g>";
    else {
      var cL = scr(sA, fAL, 0), cR = scr(sB, fBR, 1), app = clamp(u / 0.45, 0, 1), m = clamp((u - 0.45) / 0.4, 0, 1);
      var left = u < 0.45 ? C1.svg2d(sA, fAL, {}) : C1.svg2d(C1.morph(sA, sAc)(m), lf(fAL, fAcL, m), {});
      var back = u < 0.45 ? 0 : m, rY = lerp(lerp(G.tR[1], cR[1] - 44, app), G.tEnd[1], back), rX = lerp(lerp(G.tR[0], cR[0] + 36, app), G.tEnd[0], back);
      s = left + C1.svg2d(sB, fBR, u > 0.6 ? { note:{ i:1, t:"no H to replace" } } : {});
      if (u < 0.6) s += tok(lerp(G.tL[0], cL[0] - 30, app), lerp(G.tL[1], cL[1] - 40, app), u < 0.45 ? 1 : 1 - (u - 0.45) / 0.15);
      s += tok(rX, rY, 1);
      s += txt(G.L, u > 0.85 ? "propanoic acid" : "propanal", 20) + txt(G.R, "propanone", 20);
      if (u > 0.85) s += txt(G.L, "propanal + [O] → acid", 17, "--ink-2", G.sub) + txt(G.R, "+ [O]: no reaction", 17, "--ink-2", G.sub);
    }
    svg.innerHTML = s;
  }
  var CAPS = ["Propanal: the C=O sits at the end of the chain, and its carbon carries an H. δ− on the O, δ+ on the C.", "The C=O slides to C2. The H atoms on C2 hop to C1.",
    "Now the carbonyl carbon is bonded to two carbons: propanone, a ketone.", "An oxidizing agent, [O], arrives at each one.",
    "Propanal becomes propanoic acid: an OH appears where its H was. Propanone shrugs [O] off: no H to replace."];
  setGeom();
  if (window.ResizeObserver) new ResizeObserver(function(){ var g = G; setGeom(); if (g !== G && (MV.reduceMotion || !rep.hidden)) draw(4, 1); }).observe(svg);
  if (MV.reduceMotion) { draw(4, 1); cap.textContent = CAPS[4]; return; }
  var run = 0, PH = [[0, 2400], [1, 1700], [2, 1900], [3, 800], [4, 3600]];
  function play(){
    var id = ++run, k = 0; rep.hidden = true; setGeom();
    (function next(){
      if (id !== run) return;
      if (k >= PH.length) { cap.textContent = CAPS[4]; rep.hidden = false; return; }
      var ph = PH[k][0], dur = PH[k][1]; k++;
      cap.textContent = CAPS[ph === 4 ? 3 : ph];
      MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(u){ if (id === run) { draw(ph, ph === 1 || ph === 4 ? MV.ease(u) : u); if (ph === 4 && u > 0.85) cap.textContent = CAPS[4]; } }, done:next });
    })();
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Carbonyl explorer ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (!specOK(S.sp)) S.sp = cp(SP.propanal);
  if (S.pin && !specOK(S.pin)) S.pin = null;
  if (["prop", "pol", "gal"].indexOf(S.mode) < 0) S.mode = "prop";
  S.view = S.view === "3d" ? "3d" : "st"; S.water = !!S.water;
  if (!C.gallery.some(function(g){ return g.id === S.gal; })) S.gal = C.gallery[0].id;
  var T = { busy:false }, pv = null, hl = false, msg = "", barW = 0, bars = null, boxOv = null, galW = 0;
  host.innerHTML = '<p class="how ak-how">' + C.how + '</p><div class="ak-grid"><div class="ak-left" data-mv="graph"><div class="eq-cap ak-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ak-gal" hidden><div class="ak-cards" role="group" aria-label="Everyday molecules"></div><div class="ak-galfig"><svg class="ak-galsvg" role="img" aria-label=""></svg></div><p class="ak-galnote" aria-live="polite"></p></div>' +
    '<div class="ak-molrow"><div class="ak-molbox"><div class="ak-mol"></div><div class="ak-views"></div></div><div class="ak-pin" hidden><p class="ak-sub">Pinned</p><div class="ak-pinmol"></div><p class="ak-pinlab"></p></div></div>' +
    '<p class="ak-note" aria-live="polite"></p>' +
    '<div class="ak-pbox" hidden><svg class="ak-psvg" role="img" aria-label=""></svg><p class="ak-pcap" aria-live="polite"></p><p class="tiny muted ak-pleg">Shown: C and O (the H atoms on carbon are left out); water as O with its two H; in water, a shaded circle marks each aldehyde or ketone molecule. δ− and δ+ mark the partial charges on each C=O. <span class="ak-hbkey" aria-hidden="true"></span> violet dotted line: a hydrogen bond (O–H ··· O).</p></div>' +
    '<div class="ak-bars"></div></div>' +
    '<div class="ak-ctrl"><div class="ak-modes"></div><div class="ak-build">' +
    '<label class="slider ak-sl"><span class="slider-top"><span>Carbons in the chain</span><output class="ak-on"></output></span><input type="range" class="ak-rn" min="1" max="6" step="1" aria-label="Carbons in the chain"></label>' +
    '<label class="slider ak-sl"><span class="slider-top"><span>C=O position, from the left</span><output class="ak-op"></output></span><input type="range" class="ak-rp" min="1" max="6" step="1" aria-label="Carbonyl position, counting from the left"></label>' +
    '<div class="ak-me"></div><p class="ak-msg" aria-live="polite"></p>' +
    '<div class="q-actions ak-acts"><button type="button" class="btn ghost sm" data-x="ox" data-k="xox">Try [O]</button><button type="button" class="btn ghost sm" data-x="back" data-k="xback" hidden>Back to the molecule</button><button type="button" class="btn ghost sm" data-x="pin" data-k="xpin">Pin for comparison</button><button type="button" class="btn ghost sm" data-x="unpin" data-k="xunpin" hidden>Unpin</button></div>' +
    '<label class="ak-water" hidden><input type="checkbox" class="ak-win"> Water box: add water</label></div></div>' +
    '<div class="ak-right"><dl class="read ak-read" aria-live="polite"></dl><div class="ak-tab"></div></div></div>';
  var V = C1.view($(".ak-mol", host), { rotate:true }), VP = C1.view($(".ak-pinmol", host), { w:320, h:240 });
  var viewRG = radios($(".ak-views", host), { label:"View", aria:"Structure view", options:[{ id:"st", t:"Structural (2D)" }, { id:"3d", t:"3D model" }], value:S.view, onChange:function(v){ S.view = v; api.save(); paint(); } });
  var modeRG = radios($(".ak-modes", host), { label:"Mode", aria:"Explorer mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var rn = $(".ak-rn", host), rp = $(".ak-rp", host), win = $(".ak-win", host), PB = dipoleBox($(".ak-psvg", host));
  (function(){
    var tab = $(".ak-tab", host), d = document.createElement("details"); d.className = "chem-tab";
    d.innerHTML = "<summary>Data table: aldehydes and ketones (°C)</summary>" + MV.tableHTML({ head:["Compound", "Boiling point (°C)"], rows:PLAN_TABLE.map(function(nm){ return [nm, MV.chem.fx(bpOf(nm), 0) + (nm === "propanone" ? " (mixes with water)" : "")]; }), caption:"Boiling points of aldehydes, ketones and comparison compounds" }) +
      '<p class="tiny muted" style="margin:8px 0 0">Course table additions from this module; butane and pentane come from the course table.</p>';
    tab.appendChild(d);
    MV.chem.tablePanel(tab, "bp", { title:"Course data table: boiling points of hydrocarbons (°C)" });
    MV.chem.tablePanel(tab, "en", { title:"Course data table: electronegativity" });
  })();

  function mol(){ return specMol(S.sp); }
  function pinMol(){ return S.pin ? specMol(S.pin) : null; }
  function galItem(){ return C.gallery.filter(function(g){ return g.id === S.gal; })[0]; }
  function visible(){ var v = host.closest(".view"); return !v || !v.hidden; }
  function setSp(sp, note, slideFrom){
    var old = S.sp; S.sp = sp; pv = null; hl = false; msg = note || ""; api.save();
    if (slideFrom && S.mode !== "gal" && (S.mode === "pol" || S.view === "st") && !MV.reduceMotion && old.n === sp.n && old.me === sp.me && !V.busy()) {
      var A = C1.layout2d(specMol(old)), B = hopIds(A, C1.layout2d(specMol(sp)));
      V.anim(A, B, { smax:62, aria:"The C=O slides along the chain." }, 380, function(){ paintView(); });
    }
    paint();
  }
  rn.addEventListener("input", function(){
    if (T.busy) { rn.value = S.sp.n; return; }
    var n = +rn.value, sp = cp(S.sp); if (n === sp.n) return;
    var note = "Chain: " + n + " carbon" + (n > 1 ? "s" : "") + ".";
    sp.n = n; if (sp.co > n - 1) { sp.co = n - 1; note += " The C=O moved to the new end carbon."; }
    if (sp.me != null && (sp.me > n - 2 || !specOK(sp))) { sp.me = null; note += " The methyl branch was taken off."; }
    setSp(sp, note);
  });
  rp.addEventListener("input", function(){
    if (T.busy) { rp.value = S.sp.co + 1; return; }
    var co = +rp.value - 1, sp = cp(S.sp); if (co === sp.co) return;
    sp.co = co; var note = "";
    if (sp.me != null && !specOK(sp)) { sp.me = null; note = "The methyl was on that carbon, so it was taken off: the C=O carbon has no H left for it."; }
    setSp(sp, note, note ? null : true);
  });
  win.addEventListener("change", function(){ S.water = win.checked; boxOv = null; api.save(); paint(); });
  // methyl branch: a radio group rebuilt as the chain changes
  var meBox = $(".ak-me", host);
  function meWhy(id){ return id !== "none" && +id === S.sp.co ? "the C=O carbon has no H left for a methyl" : ""; }
  function paintMe(){
    var sp = S.sp, ids = ["none"], val = sp.me == null ? "none" : String(sp.me);
    for (var i = 1; i <= sp.n - 2; i++) ids.push(String(i));
    MV.keepFocus(meBox, function(){
      meBox.innerHTML = '<span class="rg-wrap"><span class="rg-lab">Methyl branch</span><span class="rg chips" role="radiogroup" aria-label="Methyl branch">' + ids.map(function(id){
        var on = id === val, w = meWhy(id);
        return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-me="' + id + '" data-k="me' + id + '"' + (w || T.busy ? " disabled" : "") + (w ? ' title="' + esc(w) + '"' : "") + ">" + (id === "none" ? "none" : "on carbon " + (+id + 1)) + "</button>";
      }).join("") + "</span></span>" + (sp.n < 3 ? '<p class="tiny muted ak-mehint">A branch needs an inner carbon: use 3 or more carbons.</p>' : "");
    });
  }
  function setMe(id){
    if (T.busy || meWhy(id)) return;
    var sp = cp(S.sp), me = id === "none" ? null : +id; if (me === sp.me) return;
    sp.me = me; if (!specOK(sp)) return;
    setSp(sp, me == null ? "Methyl branch removed." : "Methyl branch on carbon " + (me + 1) + " (counting from the left).");
  }
  meBox.addEventListener("click", function(e){ var b = e.target.closest("[data-me]"); if (b && !b.disabled) setMe(b.dataset.me); });
  meBox.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-me]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$("[data-me]", meBox), i = all.indexOf(b);
    for (var s = 0; s < all.length; s++) { i = (i + d + all.length) % all.length; if (!all[i].disabled) { setMe(all[i].dataset.me); var f = $('[data-me="' + all[i].dataset.me + '"]', meBox); if (f) f.focus(); return; } }
  });
  $(".ak-acts", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-x]"); if (!b || b.disabled || T.busy) return;
    var x = b.dataset.x;
    if (x === "ox") previewOx();
    else if (x === "back") { pv = null; paint(); }
    else if (x === "pin") { S.pin = cp(S.sp); pv = null; msg = "Pinned " + NM.name(mol()).name + ". Now build another molecule beside it."; api.save(); paint(); }
    else if (x === "unpin") { S.pin = null; pv = null; msg = "Unpinned."; api.save(); paint(); }
    var f = $('.ak-acts [data-x]:not([hidden])', host); if (b.hidden && f) f.focus({ preventScroll:true });
  });
  $(".ak-cards", host).addEventListener("click", function(e){ var b = e.target.closest("[data-gal]"); if (!b) return; S.gal = b.dataset.gal; api.save(); paint(); });
  function setMode(v){ S.mode = v; modeRG.set(v); pv = null; hl = false; boxOv = null; api.save(); paint(); }

  // ---------- [O] ----------
  function previewOx(cb){
    if (S.view === "3d") { S.view = "st"; viewRG.set("st"); api.save(); }
    var jobs = [{ v:V, m:mol(), k:"cur", smax:62 }], out = {}, parts = [], pending = 0;
    if (S.pin) jobs.push({ v:VP, m:pinMol(), k:"pin", smax:40 });
    jobs.forEach(function(j){
      var I = info(j.m), sc = oxScenes(j.m);
      if (!sc) { out[j.k] = { m:j.m, glow:I.c, note:{ i:I.c, t:"no H to replace" } }; parts.push("<strong>" + I.name + "</strong>: no reaction. Its carbonyl carbon is bonded to two carbons, so there’s no H to replace."); return; }
      var ring = {}; ring[sc.hid] = "s";
      out[j.k] = { m:sc.prod, scene:sc.B, glow:sc.c, ring:ring, anim:sc };
      parts.push("<strong>" + I.name + "</strong> → <strong>" + NM.name(sc.prod).name + "</strong>: the H on the carbonyl carbon became OH (ringed).");
    });
    var r0 = out.cur, m0 = mol();
    out.cap = F(condensed(m0)) + (r0.anim ? " + [O] → " + F(condensed(r0.m)) : " + [O]: no reaction");
    out.txt = parts.join(" ");
    pv = out; T.busy = true; paintCtrl();
    $(".ak-cap", host).innerHTML = out.cap; $(".ak-note", host).innerHTML = out.txt; $(".ak-bars", host).hidden = true; $(".ak-views", host).hidden = true;
    function fin(){ T.busy = false; paint(); if (cb) MV.wait(300, cb); }
    jobs.forEach(function(j){
      var r = out[j.k];
      if (r.anim) { pending++; j.v.anim(r.anim.A, r.anim.B, { smax:j.smax, aria:"Oxidation: " + MV.plain(out.txt) }, 1500, function(){ if (--pending === 0) fin(); }); }
      else j.v.show(r.m, { view:"st", glow:r.glow, note:r.note, smax:j.smax, aria:MV.plain(out.txt) });
    });
    if (!pending) MV.wait(900, fin);
  }

  // ---------- painting ----------
  function noteTxt(){
    var m = mol(), I = info(m), sp = S.sp, par = I.parent, h = "";
    var fwd = par.length === sp.n && par.every(function(x, i){ return x === i; }), rev = par.length === sp.n && par.every(function(x, i){ return x === sp.n - 1 - i; });
    if (hl) h += "The carbonyl carbon (glowing) is bonded to <strong>" + (I.nC === 2 ? "two carbons" : I.nC === 1 ? "one carbon" : "no carbons") + "</strong> (numbered). ";
    if (S.mode === "pol") h += "O (" + MV.chem.fx(MV.chem.data.EN.O, 2) + ") is much more electronegative than C (" + MV.chem.fx(MV.chem.data.EN.C, 2) + "), so the C=O is polar: δ− on O, δ+ on C. The dipole arrow points from δ+ to δ−. ";
    if (!fwd && !rev && sp.n > 1) h += "The longest chain through the C=O carbon runs through the methyl, so the numbering changes (blue numbers).";
    else if (rev && sp.n > 1 && !(I.fam === "ketone" && I.parent.indexOf(sp.co) === sp.co)) h += I.fam === "aldehyde" ? "Renumbered from the right: the CHO carbon is always C1, so the name has no locant for it." : "Renumbered from the right: the C=O gets the lowest locant, so it’s on C" + (par.indexOf(sp.co) + 1) + ".";
    return h;
  }
  function paintView(){
    if (V.busy()) return;
    var m = mol(), I = info(m), pol = S.mode === "pol", o = { view:pol ? "st" : S.view, smax:62 };
    if (pv) { var p = pv.cur; V.show(p.m, { view:"st", scene:p.scene, glow:p.glow, note:p.note, ring:p.ring, smax:62, aria:"After [O]: " + MV.plain(pv.txt) }); return; }
    if (o.view === "st" && !pol) o.path = I.parent;
    if (pol) o.dip = { c:I.c, o:oIdx(m) };
    if (hl) { o.glow = I.c; o.count = C1.adj(m)[I.c].filter(isC(m)); o.path = null; }
    o.aria = (o.view === "3d" ? "3D ball-and-stick model of " : "Full structural formula of ") + I.name + ", " + MV.plain(F(C1.fText(m))) + (pol ? ". δ− on the O and δ+ on the carbonyl C; the dipole arrow points from C to O." : ".");
    V.show(m, o);
  }
  function paintPin(){
    var box = $(".ak-pin", host); box.hidden = !S.pin; $(".ak-molrow", host).classList.toggle("two", !!S.pin);
    if (!S.pin) return;
    var m = pinMol(), I = info(m);
    if (!VP.busy()) {
      if (pv && pv.pin) VP.show(pv.pin.m, { view:"st", scene:pv.pin.scene, glow:pv.pin.glow, note:pv.pin.note, ring:pv.pin.ring, smax:40, aria:"Pinned molecule after [O]." });
      else VP.show(m, { view:"st", smax:40, dip:S.mode === "pol" ? { c:I.c, o:oIdx(m) } : null, aria:"Pinned: full structural formula of " + I.name + "." });
    }
    $(".ak-pinlab", host).innerHTML = "<strong>" + I.name + "</strong> · " + I.fam + "<br>" + F(C1.fText(m)) + (I.bp != null ? " · " + degC(I.bp) : "");
  }
  function paintBars(){
    var box = $(".ak-bars", host), W = Math.round(box.getBoundingClientRect().width) || 600; barW = W;
    box.innerHTML = '<p class="ak-sub">Boiling points compared (similar molar masses)</p>' + barsHTML(barSet(mol()), W, bars && bars.vals, bars ? bars.hide : -1);
  }
  function pCap(L){
    var nm = L.name, bp = bpOf(nm), Nm = nm.charAt(0).toUpperCase() + nm.slice(1), qual = nm === "propanone" ? "" : " (Qualitative: no value in the data table.)";
    if (L.mode === "pure") return L.items.length + " molecules of " + nm + ". Each C=O is a dipole: the δ− O of one molecule points toward the δ+ C of the next. No O–H, so no hydrogen bonds between them: dipole–dipole forces (plus London forces) only." + (bp != null && bp < 20 ? " (" + Nm + " boils at " + degC(bp) + ", so at room temperature it’s a gas. The box shows the cooled liquid.)" : "");
    if (L.mode === "pour") return Nm + " is poured onto water.";
    if (L.mix === "mix") return Nm + " in water: water’s O–H hydrogen-bonds to each C=O oxygen (violet dotted lines), so it " + (nm === "propanone" ? "mixes completely." : "dissolves well.") + qual;
    if (L.mix === "part") return Nm + " in water: water H-bonds to the C=O oxygen, but the longer nonpolar chain limits mixing. Some dissolves; the rest forms a layer on top." + qual;
    return Nm + " in water: only a little dissolves. One C=O can’t carry the long nonpolar chain into the water, so most of it forms a layer on top." + qual;
  }
  function paintBox(){
    var W = Math.round($(".ak-pbox", host).getBoundingClientRect().width) || 600, H = W < 480 ? (S.water ? 300 : 360) : 320;
    var L = boxOv && boxOv.W === W ? boxOv : pLayout(S.sp, S.water ? "water" : "pure", W, H);
    if (boxOv && boxOv.W !== W) boxOv = null;
    PB.draw(L);
    $(".ak-psvg", host).setAttribute("aria-label", "Particle view: " + MV.plain(pCap(L)));
    $(".ak-pcap", host).textContent = pCap(L);
  }
  function paintGal(){
    var g = galItem(), ald = /^aldehyde/.test(g.fam);
    MV.keepFocus($(".ak-cards", host), function(){
      $(".ak-cards", host).innerHTML = C.gallery.map(function(x){ var on = x.id === S.gal; return '<button type="button" class="ak-card' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-gal="' + x.id + '" data-k="gal' + x.id + '"><strong>' + x.name.replace(/ \(.*\)$/, "") + "</strong><span>" + x.use + '</span><span class="ak-fam">' + x.fam.replace(/ \(.*\)$/, "") + "</span></button>"; }).join("");
    });
    var svg = $(".ak-galsvg", host), W = Math.round($(".ak-galfig", host).getBoundingClientRect().width) || 600, H = Math.round(clamp(W * 0.46, 210, 290)); galW = W;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.innerHTML = galSVG(GAL[g.id], W, H);
    svg.setAttribute("aria-label", "Structure of " + g.name + ", " + MV.plain(F(g.cond)) + ": " + g.fam + ". The carbonyl group is highlighted" + (ald ? ", and the H on the carbonyl carbon is circled." : "."));
    $(".ak-cap", host).innerHTML = F(g.cond);
    $(".ak-galnote", host).innerHTML = "<strong>" + g.name + "</strong> · " + g.use + ". " + g.note;
  }
  function paintRead(){
    var rows;
    if (S.mode === "gal") {
      var g = galItem(), b = bpOf(g.id);
      rows = [["Name", "<strong>" + g.name + "</strong>"], ["Family", g.fam], ["Carbonyl carbon bonded to", g.bonded], ["Formula", F(g.f)],
        ["Boiling point", b != null ? degC(b) + (g.id === "propanone" ? " (mixes with water)" : "") : '<span class="muted">not in the data table</span>'], ["Oxidized by [O]?", g.ox]];
    } else {
      var m = mol(), I = info(m);
      rows = [["Name", "<strong>" + I.name + "</strong>"], ["Family", I.fam], ["Carbonyl carbon bonded to", I.bonded], ["Formula", F(C1.fText(m))],
        ["Boiling point", I.bp != null ? degC(I.bp) + (I.name === "propanone" ? " (mixes with water)" : "") : '<span class="muted">not in the data table</span>'], ["Oxidized by [O]?", I.ox]];
    }
    $(".ak-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCtrl(){
    var sp = S.sp;
    rn.value = sp.n; rn.disabled = T.busy; $(".ak-on", host).textContent = sp.n + " C";
    rp.max = sp.n; rp.value = sp.co + 1; rp.disabled = T.busy || sp.n === 1; $(".ak-op", host).textContent = "C" + (sp.co + 1) + " of " + sp.n;
    paintMe();
    $('[data-x="ox"]', host).hidden = !!pv; $('[data-x="back"]', host).hidden = !pv;
    $('[data-x="pin"]', host).textContent = S.pin ? "Pin this one instead" : "Pin for comparison"; $('[data-x="unpin"]', host).hidden = !S.pin;
    $$(".ak-acts button", host).forEach(function(b){ b.disabled = T.busy; });
    win.checked = S.water; win.disabled = T.busy;
    modeRG.lock(T.busy); viewRG.lock(T.busy);
    $(".ak-msg", host).textContent = msg;
  }
  function paint(){
    var md = S.mode, gal = md === "gal";
    $(".ak-build", host).hidden = gal; $(".ak-gal", host).hidden = !gal; $(".ak-molrow", host).hidden = gal; $(".ak-note", host).hidden = gal;
    $(".ak-pbox", host).hidden = md !== "pol"; $(".ak-bars", host).hidden = md !== "prop" || !!pv; $(".ak-views", host).hidden = md !== "prop" || !!pv;
    $(".ak-water", host).hidden = md !== "pol";
    paintCtrl();
    if (gal) { PB.stop(); paintGal(); paintRead(); MV.changed(); return; }
    $(".ak-cap", host).innerHTML = pv ? pv.cap : F(condensed(mol()));
    paintView(); paintPin();
    $(".ak-note", host).innerHTML = pv ? pv.txt : noteTxt();
    if (md === "pol") { PB.stop(); paintBox(); if (visible()) PB.start(); } else PB.stop();
    if (md === "prop" && !pv) paintBars();
    paintRead(); MV.changed();
  }
  if (window.ResizeObserver) new ResizeObserver(function(){
    if (T.busy) return;
    var w = Math.round($(".ak-left", host).getBoundingClientRect().width); if (!w) return;
    if (S.mode === "prop" && !pv && Math.abs(w - barW) > 4) paintBars();
    if (S.mode === "pol") { var L = PB.layout(); if (L && Math.abs(L.W - w) > 4) paintBox(); }
    if (S.mode === "gal" && Math.abs(w - galW) > 4) paintGal();
  }).observe($(".ak-left", host));

  // ---------- predictions ----------
  function setState(sp, mode, o){
    o = o || {}; T.busy = false; pv = null; hl = false; bars = null; boxOv = null;
    S.sp = cp(sp); S.pin = o.pin ? cp(o.pin) : null; S.mode = mode; modeRG.set(mode);
    if (o.water != null) S.water = o.water;
    if (S.view === "3d") { S.view = "st"; viewRG.set("st"); }
    msg = ""; api.save(); paint();
  }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState(SP.propanal, "prop");
      else if (p.id === "p2") { setState(SP.propanal, "prop"); bars = { hide:1 }; paintBars(); }
      else if (p.id === "p3") {
        setState(SP.propanone, "pol", { water:true });
        var W = Math.round($(".ak-pbox", host).getBoundingClientRect().width) || 600;
        boxOv = pLayout(S.sp, "pour", W, W < 480 ? 300 : 320); paintBox();
      }
      else setState(SP.butanal, "prop", { pin:SP.butanone });
    },
    run:function(p, done){
      if (p.id === "p1") {
        T.busy = true; paintCtrl();
        var A = C1.layout2d(specMol(SP.propanal)), B = hopIds(A, C1.layout2d(specMol(SP.propanone)));
        V.anim(A, B, { smax:62, aria:"The C=O slides from C1 to C2." }, 1500, function(){ S.sp = cp(SP.propanone); hl = true; T.busy = false; api.save(); paint(); MV.wait(300, done); });
      } else if (p.id === "p2") {
        T.busy = true; paintCtrl();
        var v = barSet(mol()).map(function(b){ return b.v; });
        MV.tween({ dur:1500, step:function(t){ bars = { vals:[v[0], -100 + (v[1] + 100) * t, v[2]], hide:-1 }; paintBars(); }, done:function(){ bars = null; T.busy = false; paint(); MV.wait(200, done); } });
      } else if (p.id === "p3") {
        T.busy = true; paintCtrl();
        var L1 = PB.layout(), L2 = pLayout(S.sp, "water", L1 ? L1.W : 600, L1 ? L1.H : 320);
        PB.moveTo(L2, 1800, function(){ boxOv = null; T.busy = false; paint(); MV.wait(200, done); });
      } else previewOx(done);
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var m = mol(), I = info(m), nm = I.name, f = I.f;
    if (id === "tc1") {
      if (nm === "pentan-3-one") return { ok:true };
      if (nm === "pentan-2-one") return { ok:false, msg:"C=O on C2: move it to the middle." };
      if (nm === "pentanal") return { ok:false, msg:"C=O at the end makes an aldehyde." };
      if (f.C !== 5) return { ok:false, msg:"You built " + nm + ": " + f.C + " carbon" + (f.C > 1 ? "s" : "") + " in all. Pentan-3-one has 5." };
      return { ok:false, msg:"You built " + nm + ". Pentan-3-one has an unbranched chain of 5 carbons." };
    }
    if (id === "tc2") {
      if (!S.pin) return { ok:false, msg:"You need two molecules: build one, press Pin for comparison, then build the other." };
      var pm = pinMol(), P = info(pm), fs = [[P.f.C, C1.fText(pm)], [f.C, C1.fText(m)]].sort(function(a, b){ return a[0] - b[0]; }).map(function(x){ return MV.plain(F(x[1])); });
      var fams = [P.fam, I.fam].sort().join("+"), iso = C1.fText(pm) === C1.fText(m);
      if (fams !== "aldehyde+ketone") return { ok:false, msg:"You need one of each family." };
      if (!iso) return { ok:false, msg:"Different formulas: " + fs[0] + " and " + fs[1] + "." };
      if (f.C !== 4) return { ok:false, msg:"Isomers, but each needs 4 carbons." };
      return { ok:true };
    }
    if (id === "tc3") {
      if (nm === "3-methylbutan-2-one") return { ok:true };
      if (["2-methylbutanal", "3-methylbutanal", "2,2-dimethylpropanal"].indexOf(nm) >= 0) return { ok:false, msg:"Branched, but aldehydes oxidize." };
      if (nm === "pentan-2-one" || nm === "pentan-3-one") return { ok:false, msg:"Can’t be oxidized, but the chain isn’t branched." };
      if (f.C !== 5) return { ok:false, msg:"You built " + nm + ": " + f.C + " carbon" + (f.C > 1 ? "s" : "") + " in all, counting any branch. C₅H₁₀O has 5." };
      return { ok:false, msg:"Aldehydes oxidize: you need a ketone." };
    }
    return { ok:false };
  }
  MV.APP.onShow = (function(prev){ return function(v){ if (prev) prev(v); if (v === "explore" && S.mode === "pol" && !T.busy) PB.start(); else PB.stop(); }; })(MV.APP.onShow);
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); }, repaint:paint };
}

// ---------- Part 3: Tell them apart ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  // sample families (X is an aliphatic aldehyde, so both tests are positive)
  var FAM = { butanal:"al", butanone:"one", propanone:"one", ethanal:"al", x:"al", water:"" };
  var SPEC = { butanal:SP.butanal, butanone:SP.butanone, propanone:SP.propanone, ethanal:SP.ethanal };
  if (!s1.tests.some(function(t){ return t.id === S.test; })) S.test = "tol";
  if (!(S.smp in FAM)) S.smp = "butanal";
  S.res = S.res || {}; S.ctl = S.ctl || {}; S.nm = S.nm || {}; S.ni = clamp(S.ni || 0, 0, s3.items.length - 1);
  var busy = false, tube = { res:null, t:1, drop:null }, recMsg = {}, ctlMsg = null, nmMsg = {}, dataOx = false;
  host.innerHTML = '<div class="part ak-st"><h3>' + s1.title + "</h3><p>" + s1.intro + "</p>" +
    '<div class="ak-bench"><div class="ak-tubebox"><svg class="ak-tube" viewBox="0 0 300 300" role="img" aria-label=""></svg><p class="ak-obs" aria-live="polite"></p></div>' +
    '<div class="ak-benchctl"><div class="ak-tpick"></div><p class="ak-tdesc"></p><div class="ak-spick"></div><div class="q-actions"><button type="button" class="btn primary" data-b="add" data-k="badd">Add the sample</button></div></div></div>' +
    '<h4 class="ak-h4">Results table</h4><p class="tiny muted">After each test, tap what you saw.</p><div class="tbl-wrap"><table class="ak-res"></table></div>' +
    '<details class="alg ak-data" open><summary>Check it with data</summary><p>' + s1.data + '</p><div class="ak-dmol"></div><p class="ak-deq" aria-live="polite"></p><div class="q-actions ak-dact"></div></details></div>' +
    '<div class="part ak-st"><h3>' + s2.title + "</h3><p>" + s2.q + '</p><div class="ak-ctl"></div><div class="q-actions"><button type="button" class="btn primary sm" data-c2="check" data-k="ctlchk">Check</button></div><div class="ak-ctlfb"></div></div>' +
    '<div class="part ak-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="ak-nnav" role="group" aria-label="Structures"></div><div class="ak-nmol"></div><p class="ak-ncond"></p><div class="ak-nchips"></div><div class="q-actions ak-nact"></div><div class="ak-nfb"></div></div>';
  var V3 = C1.view($(".ak-dmol", host), { w:520, h:240 }), V4 = C1.view($(".ak-nmol", host), { w:560, h:240 });
  var tpick = radios($(".ak-tpick", host), { label:"Test", aria:"Test", options:s1.tests.map(function(t){ return { id:t.id, t:t.t }; }), value:S.test, onChange:function(v){ if (busy) return; S.test = v; tube = { res:null, t:1, drop:null }; api.save(); paint1(); } });
  var spick = radios($(".ak-spick", host), { label:"Sample", aria:"Sample", cls:"chips", options:s1.samples.map(function(x){ return { id:x.id, t:x.t }; }), value:S.smp, onChange:function(v){ if (busy) return; S.smp = v; tube = { res:null, t:1, drop:null }; dataOx = false; api.save(); paint1(); paintData(); } });
  function testOf(){ return s1.tests.filter(function(t){ return t.id === S.test; })[0]; }
  function smpOf(id){ return s1.samples.filter(function(x){ return x.id === id; })[0]; }
  function truth(id){ return FAM[id] === "al" ? "pos" : "neg"; }

  // station 1: the tube
  function tubeSVG(){
    var tc = testOf(), ben = tc.id === "ben", x0 = 64, x1 = 124, top = 40, bot = 262, r = 30, lvl = 150, t = tube.t, res = tube.res;
    var wall = "M" + x0 + " " + top + " V" + (bot - r) + " A" + r + " " + r + " 0 0 0 " + x1 + " " + (bot - r) + " V" + top;
    var liq = "M" + x0 + " " + lvl + " V" + (bot - r) + " A" + r + " " + r + " 0 0 0 " + x1 + " " + (bot - r) + " V" + lvl + " Z";
    var s = '<defs><linearGradient id="ak-silv" x1="0" x2="1"><stop offset="0" stop-color="var(--ak-silver-a)"/><stop offset=".5" stop-color="var(--ak-silver-b)"/><stop offset="1" stop-color="var(--ak-silver-a)"/></linearGradient><clipPath id="ak-tclip"><path d="' + liq + '"/></clipPath></defs>';
    s += '<path d="' + liq + '" fill="var(' + (ben ? "--ak-ben" : "--ak-tol") + ')"/>';
    if (res === "pos" && !ben) s += '<g clip-path="url(#ak-tclip)" opacity="' + r1(t) + '"><path d="' + liq + '" fill="url(#ak-silv)"/><path d="M' + (x0 + 9) + " " + (lvl + 6) + " V" + (bot - r) + " A" + (r - 9) + " " + (r - 9) + " 0 0 0 " + (x1 - 9) + " " + (bot - r) + " V" + (lvl + 6) + ' Z" fill="var(--ak-tol)" opacity=".9"/></g>';
    if (res === "pos" && ben) s += '<g clip-path="url(#ak-tclip)"><rect x="' + x0 + '" y="' + lvl + '" width="' + (x1 - x0) + '" height="' + (bot - lvl) + '" fill="var(--ak-brick)" opacity="' + r1(0.78 * t) + '"/><rect x="' + x0 + '" y="' + r1(bot - 36 * t) + '" width="' + (x1 - x0) + '" height="' + r1(36 * t + 2) + '" fill="var(--ak-brick)"/></g>';
    s += '<path d="' + wall + '" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/><path d="M' + (x0 - 7) + " " + top + " H" + (x1 + 7) + '" stroke="var(--ink-2)" stroke-width="3" stroke-linecap="round"/>';
    if (tube.drop != null) {
      var dy = 20 + tube.drop * (lvl - 24);
      s += '<rect x="86" y="0" width="16" height="22" rx="3" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/>';
      if (tube.drop < 1) s += '<circle cx="94" cy="' + r1(dy) + '" r="5" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.6"/>';
    }
    var lab = res && t > 0.5 ? (res === "pos" ? tc.pos : tc.neg) : tc.before, words = lab.split(" "), half = Math.ceil(words.length / 2);
    var ly = res === "pos" && ben ? bot - 20 : res === "pos" ? lvl + 30 : lvl + 40;
    s += '<line x1="' + (x1 + 4) + '" y1="' + ly + '" x2="' + (x1 + 22) + '" y2="' + ly + '" stroke="var(--ink-2)" stroke-width="1.6"/>';
    s += '<text x="' + (x1 + 28) + '" y="' + (ly - 4) + '" font-size="17" font-weight="700" fill="var(--ink)"><tspan x="' + (x1 + 28) + '" dy="0">' + words.slice(0, half).join(" ") + '</tspan><tspan x="' + (x1 + 28) + '" dy="20">' + words.slice(half).join(" ") + "</tspan></text>";
    s += '<text x="94" y="292" text-anchor="middle" font-size="15" fill="var(--ink-2)">' + tc.t + "</text>";
    return s;
  }
  function obsTxt(){
    var tc = testOf(), sm = smpOf(S.smp);
    if (!tube.res) return tc.t + ": " + tc.before + ". Add a sample of " + sm.t + ".";
    if (tube.t < 1) return "Adding " + sm.t + "…";
    if (tc.id === "tol") return tc.t + " + " + sm.t + ": " + (tube.res === "pos" ? "a silver mirror forms on the glass." : "no change.");
    return tc.t + " + " + sm.t + ": " + (tube.res === "pos" ? "the blue solution gives a brick-red precipitate." : "it stays blue.");
  }
  function paintTube(){ var svg = $(".ak-tube", host); svg.innerHTML = tubeSVG(); svg.setAttribute("aria-label", "Test tube. " + obsTxt()); $(".ak-obs", host).textContent = obsTxt(); }
  function cell(tc, sm){
    var k = tc.id + "|" + sm.id, r = S.res[k];
    if (!r || !r.run) return '<td><span class="muted">not tested</span></td>';
    if (r.rec) return "<td><strong>" + (r.rec === "pos" ? tc.pos : tc.neg) + "</strong> ✓</td>";
    return '<td><span class="ak-rec" role="group" aria-label="Record: ' + esc(MV.plain(tc.t)) + ", " + sm.t + '">' + [["pos", tc.pos], ["neg", tc.neg]].map(function(c){ return '<button type="button" class="chip" data-rec="' + k + '" data-v="' + c[0] + '" data-k="rec' + k + c[0] + '">' + c[1] + "</button>"; }).join("") + "</span>" + (recMsg[k] ? '<span class="ak-bad">' + recMsg[k] + "</span>" : "") + "</td>";
  }
  function famCell(sm){
    var both = s1.tests.every(function(tc){ var r = S.res[tc.id + "|" + sm.id]; return r && r.rec; });
    if (!both) return '<span class="muted">record both tests</span>';
    if (sm.id === "water") return "no carbonyl compound: the blank";
    return FAM[sm.id] === "al" ? "an aldehyde" + (sm.id === "x" ? " (from your results)" : "") : "a ketone";
  }
  function paintTable(){
    MV.keepFocus($(".ak-res", host), function(){
      $(".ak-res", host).innerHTML = '<caption class="vh">Results of the oxidation tests</caption><thead><tr><th scope="col">Sample</th>' + s1.tests.map(function(tc){ return '<th scope="col">' + tc.t + "</th>"; }).join("") + '<th scope="col">So it’s…</th></tr></thead><tbody>' +
        s1.samples.map(function(sm){ return '<tr><th scope="row">' + sm.t + "</th>" + s1.tests.map(function(tc){ return cell(tc, sm); }).join("") + "<td>" + famCell(sm) + "</td></tr>"; }).join("") + "</tbody>";
    });
  }
  function paint1(){
    tpick.set(S.test); spick.set(S.smp); tpick.lock(busy); spick.lock(busy);
    $(".ak-tdesc", host).innerHTML = testOf().desc;
    $('[data-b="add"]', host).disabled = busy;
    paintTube(); paintTable();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-b]");
    if (b && !b.disabled && !busy) {
      var tc = testOf(), id = S.smp, res = truth(id), k = tc.id + "|" + id;
      busy = true; tube = { res:null, t:0, drop:0 }; paint1();
      MV.tween({ dur:700, step:function(u){ tube.drop = u; paintTube(); }, done:function(){
        tube.res = res; tube.drop = 1;
        MV.tween({ dur:1300, step:function(u){ tube.t = u; paintTube(); }, done:function(){
          tube.t = 1; busy = false; S.res[k] = S.res[k] || { run:true, rec:null }; S.res[k].run = true; api.save(); paint1(); paintData();
        } });
      } });
      return;
    }
    var rb = e.target.closest("[data-rec]");
    if (rb) {
      var key = rb.dataset.rec, smId = key.split("|")[1];
      if (rb.dataset.v === truth(smId)) { S.res[key].rec = rb.dataset.v; recMsg[key] = null; api.save(); }
      else recMsg[key] = "✗ That’s not what the tube showed. Run the test again and look closely.";
      paintTable(); var f = $(".ak-res button", host); if (document.activeElement === document.body && f) f.focus({ preventScroll:true });
      return;
    }
    var db = e.target.closest("[data-d]");
    if (db && !db.disabled) { dataOx = true; paintData(true); }
  });
  // "Check it with data"
  function paintData(animate){
    var id = S.smp, fam = FAM[id], dm = $(".ak-dmol", host), act = $(".ak-dact", host), eq = $(".ak-deq", host);
    if (id === "x" || id === "water") {
      dm.hidden = true; act.innerHTML = "";
      var tested = s1.tests.some(function(tc){ var r = S.res[tc.id + "|x"]; return r && r.run; });
      eq.innerHTML = id === "water" ? "Water has no C=O. It’s the blank: it shows that the reagent alone doesn’t change." : tested ? "X gave a positive result, so it has a –CHO group: R–CHO + [O] → R–COOH. The H on its carbonyl carbon becomes OH." : "Test X first, then come back here.";
      return;
    }
    dm.hidden = false;
    var m = specMol(SPEC[id]), I = info(m);
    if (fam === "al") {
      var sc = oxScenes(m), ring = {}; ring[sc.hid] = "s";
      eq.innerHTML = F(condensed(m)) + " + [O] → " + F(condensed(sc.prod)) + "<br>" + I.name + " → " + NM.name(sc.prod).name + ": the H on the carbonyl carbon " + (dataOx ? "became OH (ringed)." : "(ringed) becomes OH.");
      act.innerHTML = '<button type="button" class="btn ghost sm" data-d="ox" data-k="dox">' + (dataOx ? "Show it again" : "Show the oxidation") + "</button>";
      if (animate) V3.anim(sc.A, sc.B, { smax:56, aria:I.name + " + [O] gives " + NM.name(sc.prod).name + "." }, 1400, function(){ V3.show(sc.prod, { view:"st", scene:sc.B, ring:ring, smax:56, aria:"Full structural formula of " + NM.name(sc.prod).name + ". The new OH is ringed." }); });
      else if (dataOx) V3.show(sc.prod, { view:"st", scene:sc.B, ring:ring, smax:56, aria:"Full structural formula of " + NM.name(sc.prod).name + ". The new OH is ringed." });
      else V3.show(m, { view:"st", hRing:I.c, smax:56, aria:"Full structural formula of " + I.name + ". The H on the carbonyl carbon is ringed." });
    } else {
      act.innerHTML = "";
      eq.innerHTML = I.name + " + [O]: no reaction. Its carbonyl carbon is bonded to two carbons and has no H, so there’s nothing to replace.";
      V3.show(m, { view:"st", glow:I.c, note:{ i:I.c, t:"no H here" }, smax:56, aria:"Full structural formula of " + I.name + ". The carbonyl carbon glows: no H here." });
    }
  }

  // station 2: controls
  function paintCtl(){
    var done = !!S.ctlDone;
    MV.keepFocus($(".ak-ctl", host), function(){
      $(".ak-ctl", host).innerHTML = s2.rows.map(function(r){
        return '<div class="ak-crow"><span class="ak-clab">' + r.t + '</span><span class="rg chips" role="radiogroup" aria-label="Role of ' + r.t + '">' + s2.roles.map(function(ro){ var on = S.ctl[r.id] === ro.id; return '<button type="button" role="radio" aria-checked="' + on + '" data-cr="' + r.id + '" data-cv="' + ro.id + '" data-k="cr' + r.id + ro.id + '"' + (done ? " disabled" : "") + ">" + ro.t + "</button>"; }).join("") + "</span></div>";
      }).join("");
    });
    $('[data-c2="check"]', host).hidden = done;
    $(".ak-ctlfb", host).innerHTML = done ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s2.right) : ctlMsg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + ctlMsg) : "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-cr]");
    if (b && !b.disabled) { S.ctl[b.dataset.cr] = b.dataset.cv; ctlMsg = null; api.save(); paintCtl(); return; }
    var c = e.target.closest('[data-c2="check"]');
    if (!c) return;
    if (s2.rows.some(function(r){ return !S.ctl[r.id]; })) { ctlMsg = "Choose a role for each sample first."; paintCtl(); return; }
    var bad = s2.rows.filter(function(r){ return S.ctl[r.id] !== MV.ans(r); });
    if (!bad.length) { S.ctlDone = true; ctlMsg = null; } else ctlMsg = bad.map(function(r){ return r.tip; }).join(" ") + " Try again.";
    api.save(); paintCtl(); MV.focusFb($(".ak-ctlfb", host));
  });
  $(".ak-ctl", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-cr]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d || b.disabled) return;
    e.preventDefault(); var ids = s2.roles.map(function(r){ return r.id; }), i = (ids.indexOf(S.ctl[b.dataset.cr] || b.dataset.cv) + d + ids.length) % ids.length;
    S.ctl[b.dataset.cr] = ids[i]; ctlMsg = null; api.save(); paintCtl(); var f = $('[data-cr="' + b.dataset.cr + '"][data-cv="' + ids[i] + '"]', host); if (f) f.focus();
  });

  // station 3: naming practice (C2 chips)
  function nst(id){ return S.nm[id] || (S.nm[id] = { tape:[], tries:0, hint:0, solved:false, first:null, note:"" }); }
  function cur(){ return s3.items[S.ni]; }
  var chips = C2.chips($(".ak-nchips", host), { rows:NAME_ROWS, get:function(){ return nst(cur().id).tape; }, set:function(tk){ nst(cur().id).tape = tk; nmMsg[cur().id] = null; api.save(); paintNfb(); }, locked:function(){ return nst(cur().id).solved; } });
  function paintNnav(){
    MV.keepFocus($(".ak-nnav", host), function(){ $(".ak-nnav", host).innerHTML = s3.items.map(function(it, i){ var x = nst(it.id); return '<button type="button" class="chip' + (i === S.ni ? " on" : "") + '" aria-pressed="' + (i === S.ni) + '" data-ngo="' + i + '" data-k="ngo' + i + '" aria-label="Structure ' + (i + 1) + (x.solved ? ", named" : "") + '">' + (i + 1) + (x.solved ? " ✓" : "") + "</button>"; }).join(""); });
  }
  function paintNfb(){
    var it = cur(), x = nst(it.id), h = "";
    if (x.solved) h = MV.fbHTML("good", "<strong>✓ Correct: " + MV.ans(it) + ".</strong> " + (x.note || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (nmMsg[it.id]) h = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + nmMsg[it.id] + " Try again.");
    $(".ak-nfb", host).innerHTML = h + MV.hintsHTML(it.hints, x.hint);
    MV.keepFocus($(".ak-nact", host), function(){
      $(".ak-nact", host).innerHTML = (x.solved ? "" : '<button type="button" class="btn primary sm" data-na="check" data-k="nachk">Check name</button>' + MV.hintBtn("nahint", x.hint).replace('data-act="hint"', 'data-na="hint"')) +
        '<button type="button" class="btn ghost sm" data-na="prev" data-k="naprev"' + (S.ni === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ghost sm" data-na="next" data-k="nanext"' + (S.ni === s3.items.length - 1 ? " disabled" : "") + ">Next structure</button>";
    });
  }
  function paint3(){
    var it = cur(), m = specMol(it.sp);
    V4.show(m, { view:"st", smax:54, aria:"Structure " + (S.ni + 1) + ": full structural formula, " + MV.plain(F(condensed(m))) + "." });
    $(".ak-ncond", host).innerHTML = "<strong>Structure " + (S.ni + 1) + " of " + s3.items.length + ":</strong> " + F(condensed(m));
    paintNnav(); chips.paint(); paintNfb();
  }
  host.addEventListener("click", function(e){
    var g = e.target.closest("[data-ngo]"); if (g) { S.ni = +g.dataset.ngo; api.save(); paint3(); return; }
    var b = e.target.closest("[data-na]"); if (!b || b.disabled) return;
    var it = cur(), x = nst(it.id), a = b.dataset.na;
    if (a === "prev" || a === "next") { S.ni = clamp(S.ni + (a === "next" ? 1 : -1), 0, s3.items.length - 1); api.save(); paint3(); return; }
    if (a === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintNfb(); return; }
    if (a === "check") {
      if (!x.tape.length) { nmMsg[it.id] = "Build a name with the chips first."; paintNfb(); return; }
      var r = C2.judge(C2.compose(x.tape), MV.ans(it));
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.note = r.msg || ""; nmMsg[it.id] = null; }
      else { x.tries++; nmMsg[it.id] = r.msg; }
      api.save(); paintNnav(); chips.paint(); paintNfb(); MV.focusFb($(".ak-nfb", host));
    }
  });
  paint1(); paintData(); paintCtl(); paint3();
}

// ---------- Practice 2: Identify the unknown (chips) ----------
function unknownAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, tries:0, hint:0, solved:false, first:null }); }
  // 4-option lists are reordered by the build; shorter lists get a fixed display order here
  function order(it){ var ix = it.options.map(function(_, k){ return k; }); return it.options.length === 4 ? ix : MV.shuffle(ix, MV.meta.id + it.id + "x"); }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-pi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="chips ak-pchips" role="radiogroup" aria-label="Choices">' + order(it).map(function(k){
      var o = it.options[k], on = x.pick === k;
      return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>";
    h += MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.options[x.pick].t + ".</strong> " + (it.options[x.pick].why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pi]"); if (!box) return;
    var it = item(box.dataset.pi), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (x.pick == null) { msgs[it.id] = "Choose an answer first."; paint(); return; }
      var ok = MV.ok(it.options[x.pick]);
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = it.options[x.pick].why; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pi="' + it.id + '"]'));
    }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest('[role="radio"][data-op]'); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$('[data-op]', b.parentNode), i = (all.indexOf(b) + d + all.length) % all.length; all[i].focus();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// @component C1 moleculeBuilder (alcohol mode; adapted from SCH4U 03's free mode) — tap an atom, then: add C, put the –OH on
// a carbon (moves the one O), remove an end atom; single bonds only, so every O is an –OH; valence checked (C 4), H filled in;
// main chain = longest heavy-atom path for the 2D layout. Used by the performance task below.
// ---------- Performance task: Ketone factory ----------
var VALID = ["pentan-2-ol", "pentan-3-ol", "3-methylbutan-2-ol"];
var task = (function(){
  var S = null, api = null, V = null, VP = null, sel = null, msg = "", MAXA = 8;
  function fresh(){ return { a:["C", "C", "C", "C", "C"], b:[[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1]] }; }
  function mol(){ var m = { a:S.mol.a.map(function(el){ return { el:el }; }), b:S.mol.b.map(function(b){ return b.slice(); }), main:[] }; m.main = longestHeavy(m); return m; }
  function read(){
    if (!S) return { l:[false, false, false, false] };
    var m = mol(), f = C1.formula(m), nm = NM.name(m).name, fm = NM.fam(m), alc = fm.fam === "alcohol" && fm.nOH === 1;
    var r = alc ? oxStep(m) : { none:true }, prod = r.none ? null : r.prod, pfam = prod ? NM.fam(prod).fam : "", pname = prod ? NM.name(prod).name : "";
    var tape = C2.compose(S.tape || []), j = prod && tape ? C2.judge(tape, pname) : { ok:false };
    return { m:m, name:nm, f:f, fm:fm, alc:alc, prod:prod, pfam:pfam, pname:pname, tape:tape, j:j,
      l:[alc && f.C === 5 && f.H === 12 && f.O === 1, alc && !r.none, pfam === "ketone", !!j.ok] };
  }
  function semOK(){ if (sel && sel.i >= S.mol.a.length) sel = null; }
  function setMol(nm, note, nsel){ S.mol = nm; sel = nsel === undefined ? sel : nsel; msg = note || ""; semOK(); api.save(); paint(); api.update(); }
  function cpy(){ return { a:S.mol.a.slice(), b:S.mol.b.map(function(b){ return b.slice(); }) }; }
  function drop(nm, i){ nm.b = nm.b.filter(function(b){ return b[0] !== i && b[1] !== i; }).map(function(b){ return [b[0] > i ? b[0] - 1 : b[0], b[1] > i ? b[1] - 1 : b[1], b[2]]; }); nm.a.splice(i, 1); return nm; }
  function label(kind, i){
    var m = mol(), h = C1.hc(m), el = m.a[i].el;
    return (el === "C" ? "Carbon " : "Oxygen of the –OH, atom ") + (i + 1) + ", " + el + (h[i] ? "H" + (h[i] > 1 ? h[i] : "") : "") + (sel && sel.i === i ? ", selected" : "") + ". Select it for the builder buttons.";
  }
  function act(a){
    if (a === "reset") { setMol(fresh(), "Started again: a 5-carbon chain (pentane).", null); return; }
    if (!sel) return;
    var m = mol(), nm = cpy(), i = sel.i, oi = nm.a.indexOf("O");
    if (a === "addC") { nm.a.push("C"); nm.b.push([i, nm.a.length - 1, 1]); setMol(nm, "Added a C on carbon " + (i + 1) + ".", { i:nm.a.length - 1 }); return; }
    if (a === "oh") {
      var ci = i;
      if (oi >= 0) { drop(nm, oi); if (ci > oi) ci--; }
      nm.a.push("O"); nm.b.push([ci, nm.a.length - 1, 1]); setMol(nm, (oi >= 0 ? "Moved the –OH to carbon " : "Put an –OH on carbon ") + (ci + 1) + ".", { i:ci }); return;
    }
    if (a === "rm") { drop(nm, i); setMol(nm, m.a[i].el === "O" ? "Removed the –OH." : "Removed atom " + (i + 1) + ".", null); }
  }
  function btn(a, t, why){ return '<button type="button" class="btn ghost sm" data-tk="' + a + '" data-k="tk' + a + '"' + (why ? ' disabled title="' + esc(why) + '"' : "") + ">" + t + "</button>"; }
  function paintMenu(){
    var m = mol(), A = C1.adj(m), n = m.a.length, html = "", why = [];
    if (sel) {
      var i = sel.i, el = m.a[i].el, fr = C1.free(m, i) > 0, leaf = A[i].length <= 1, nC = m.a.filter(function(a){ return a.el === "C"; }).length, oi = S.mol.a.indexOf("O"), hasOH = oi >= 0 && A[i].indexOf(oi) >= 0;
      html += '<p class="ak-sub">' + (el === "C" ? "Carbon " + (i + 1) : "The –OH") + "</p>";
      if (el === "C") {
        html += btn("addC", "Add C here", !fr ? "no free bond" : n >= MAXA ? "atom limit" : "");
        if (!hasOH) html += btn("oh", oi >= 0 ? "Move the –OH here" : "Put the –OH here", fr ? "" : "no free bond");
        html += btn("rm", "Remove this atom", leaf && nC > 1 ? "" : "only an end carbon");
        if (!fr) why.push("This carbon has no free bond left: C makes 4 bonds.");
        if (n >= MAXA) why.push("The builder holds up to " + MAXA + " C and O atoms.");
      } else html += btn("rm", "Remove the –OH", "");
    } else html += '<p class="tiny muted">Tap an atom in the builder.</p>';
    html += '<div class="ak-tkr">' + btn("reset", "Start again", "") + "</div>";
    MV.keepFocus($("#ak-tkmenu"), function(){ $("#ak-tkmenu").innerHTML = html + (why.length ? '<p class="tiny muted">' + why.join(" ") + "</p>" : ""); });
    $("#ak-tkmsg").textContent = msg;
  }
  function paint(){
    var d = read(), m = d.m, atoms = m.a.map(function(_, i){ return i; }), cls = d.alc ? (d.fm.cls || "—") : d.fm.fam === "alkane" ? "not an alcohol yet (no O)" : "—";
    V.show(m, { view:"st", atoms:atoms, bonds:[], selA:sel ? sel.i : null, smax:56, aria:"Your alcohol: " + (d.name || "no carbon") + ", " + MV.plain(F(C1.fText(m))) + "." });
    $("#ak-tkread").innerHTML = MV.readoutHTML([["Alcohol", "<strong>" + (d.name || "—") + "</strong>"], ["Formula", F(C1.fText(m))], ["Class", cls],
      ["Product after one [O] step", d.prod ? F(condensed(d.prod)) : d.alc ? "no reaction" : '<span class="muted">put an –OH on the chain</span>'], ["Product family", d.prod ? d.pfam : "—"]]);
    var pv = $("#ak-tkprod"); pv.hidden = !d.prod;
    if (d.prod) VP.show(d.prod, { view:"st", smax:42, aria:"The product after one [O] step: " + MV.plain(F(condensed(d.prod))) + ", " + d.pfam + "." });
    $("#ak-tknote").textContent = d.j && d.j.ok && d.j.msg ? d.j.msg : "";
    paintMenu();
  }
  return {
    render:function(inp, pvh, a){
      api = a; S = a.S; if (!S.mol || !S.mol.a || !S.mol.a.length) S.mol = fresh(); S.tape = S.tape || [];
      inp.innerHTML = '<h4 class="ak-h4">Builder: the alcohol</h4><div id="ak-tkview"></div><p id="ak-tkmsg" class="ak-msg" aria-live="polite"></p><div id="ak-tkmenu" class="ak-menu" role="group" aria-label="Builder buttons"></div>' +
        '<h4 class="ak-h4">Name the product</h4><div id="ak-tkchips"></div><p id="ak-tknote" class="tiny" aria-live="polite"></p>';
      pvh.innerHTML = '<h4 class="ak-h4">Your alcohol and its product</h4><dl class="read" id="ak-tkread" aria-live="polite"></dl><div id="ak-tkprod"><p class="ak-sub">Product structure</p><div id="ak-tkpv"></div></div>';
      V = C1.view($("#ak-tkview"), { w:520, h:300, onPick:function(kind, i){ sel = { i:i }; msg = ""; paint(); }, label:label });
      VP = C1.view($("#ak-tkpv"), { w:420, h:220 });
      $("#ak-tkmenu").addEventListener("click", function(e){ var b = e.target.closest("[data-tk]"); if (!b || b.disabled) return; act(b.dataset.tk); var f = $('#ak-tkmenu [data-k="' + b.dataset.k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); });
      C2.chips($("#ak-tkchips"), { rows:NAME_ROWS, get:function(){ return S.tape; }, set:function(tk){ S.tape = tk; a.save(); paint(); a.update(); } });
      var chk = document.getElementById("task-check");
      if (chk) chk.addEventListener("click", function(){
        setTimeout(function(){
          var st = MV.taskState(), all = VALID.every(function(v){ return st.found.some(function(k){ return k.indexOf(v + " →") === 0; }); }), fb = $("#task-fb .fb.good");
          if (all && fb) { var ps = fb.querySelectorAll("p"); if (ps[1]) ps[1].innerHTML = "You’ve found all three: " + st.found.join("; ") + "."; }
        }, 0);
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return d.l; },
    key:function(d){ return d.name + " → " + d.pname; }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ unknowns:unknownAct },
  task:task
});
})();
