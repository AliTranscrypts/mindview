// SCH4U 03 Alcohols and Ethers: hero (ethanol vs methoxymethane flasks), Functional group switchboard (Explore: C1 view,
// namer, boiling-point bars, particle box), Oxidizing alcohols (Part 3: oxidation ladder, C3 dehydration stepper, STSE cases),
// "Predict and name" set, "Branched and oxidizable" task (free C/H/O builder).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function isC(m){ return function(j){ return m.a[j].el === "C"; }; }
function degC(v){ return MV.chem.fx(v, 0) + " °C"; }

// Module data table (plan §4 Explore; §6 risk 1): boiling points (°C) and solubility in water (g per 100 mL at 20 °C;
// "mix" = mixes completely; null = no value given). These are course table additions: MV.chem.data.bp doesn't hold them
// yet, so they're defined here until the shared table absorbs them. Alkane boiling points come from MV.chem.data.bp.
var AO = { methanol:[65, "mix"], ethanol:[78, "mix"], "propan-1-ol":[97, "mix"], "propan-2-ol":[82, "mix"], "butan-1-ol":[118, 8], "butan-2-ol":[100, 12],
  "2-methylpropan-1-ol":[108, 9], "2-methylpropan-2-ol":[82, "mix"], "pentan-1-ol":[138, 2], "hexan-1-ol":[157, 0.6], methoxymethane:[-24, null],
  methoxyethane:[7, null], ethoxyethane:[35, 7], "1-methoxypropane":[39, null], "2-methoxypropane":[32, null], "ethane-1,2-diol":[197, "mix"] };
function bpOf(nm){ return AO[nm] ? AO[nm][0] : MV.chem.bpOf(nm); }
function solOf(nm){ return AO[nm] ? AO[nm][1] : undefined; }
function solTxt(v){ return v === "mix" ? "mixes completely" : "about " + String(v).replace(".", ".") + " g per 100 mL"; }
function molarMass(f){ var M = MV.chem.data.M; return (f.C || 0) * M.C + (f.H || 0) * M.H + (f.O || 0) * M.O; }

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

// @component C1 moleculeView — molecule model (C and O, H implicit; bond orders 1–3), 2D full structural layout, 3D
// ball-and-stick model (VSEPR geometry), morphs, and tap-to-select atom AND bond buttons over the drawing (Tab, arrow keys,
// Enter). From SCH4U 02's C1, extended for oxygen (–OH, –O– in a chain, C=O) and with highlight options for classes and
// oxidation: glow (the C–OH carbon), numbered neighbour badges, ringed H atoms, notes, rings by scene id; view.anim morphs.
//   C1.clone · adj · bondOf(m, i, j) · order · hc(m) · free(m, i) · formula · fText · geo · layout2d(m) · scene3(m) · morph(A, B)
//   C1.view(host, {w, h, rotate, onPick(kind "a"|"b", index, keyboard), label(kind, index)}) -> {show(m, o), render(), anim(A, B, o, dur, done)}
//     o = {view:"st"|"3d", scene, atoms:[pickable atom idx], bonds:[pickable bond idx], selA, selB:[i, j], path (locants),
//          glow (atom idx), count:[atom idx] (numbered badges), hRing (atom idx: ring its H atoms), note:{i, t}, ring:{sceneId:"s"|"d"}, smax, aria}
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
function ladderOf(m){ var L = [m], cur = m; for (var i = 0; i < 2; i++) { var r = oxStep(cur); if (r.none) break; L.push(r.prod); cur = r.prod; } return L; }
function dropAtom(m, x){
  var p = { a:[], b:[], main:[] }, map = {};
  m.a.forEach(function(a, i){ if (i === x) return; map[i] = p.a.length; p.a.push(Object.assign({}, a)); });
  m.b.forEach(function(b){ if (b[0] === x || b[1] === x) return; p.b.push([map[b[0]], map[b[1]], b[2]]); });
  (m.main || []).forEach(function(i){ if (i !== x) p.main.push(map[i]); });
  return p;
}
// dehydration: OH from the C–OH carbon, H from a neighbouring carbon; one path per neighbour that carries H
function dehydrate(m){
  var R = NM.roles(m), A = C1.adj(m), h = C1.hc(m), c = R.kind.indexOf("ol");
  if (c < 0) return null;
  var o = ohOf(m, c), paths = [], seen = {};
  A[c].forEach(function(n){
    if (m.a[n].el !== "C" || !h[n]) return;
    var p = dropAtom(m, o); p.b[C1.bondOf(p, c, n)][2] = 2;
    var nm = NM.name(p).name;
    paths.push({ n:n, prod:p, name:nm, dup:!!seen[nm] }); seen[nm] = 1;
  });
  return { c:c, o:o, paths:paths, names:Object.keys(seen) };
}
// hydration (module 02, Markovnikov): the major alcohol(s) from an alkene
function hydrate(p){
  var k = -1; p.b.forEach(function(b, q){ if (b[2] === 2 && k < 0) k = q; });
  if (k < 0) return [];
  var i = p.b[k][0], j = p.b[k][1], h = C1.hc(p), out = [];
  function add(c){ var q = C1.clone(p); q.b[k][2] = 1; q.b.push([c, q.a.length, 1]); q.a.push({ el:"O" }); return NM.name(q).name; }
  if (h[i] === h[j]) { var a = add(i), b = add(j); out.push(a); if (b !== a) out.push(b); }
  else out.push(add(h[i] < h[j] ? i : j));
  return out;
}

// ---------- switchboard molecules ----------
// spec {n: chain carbons 1–6, me: inner chain carbon with the methyl or null, o: null | {oh:cid} | {eth:[cid, cid]}};
// cid = chain index or "m" (the methyl carbon). Atoms: chain 0…n−1, then the methyl, then O last.
function specMol(sp){
  var m = { a:[], b:[], main:[] }, n = sp.n, i, Me = null;
  for (i = 0; i < n; i++) { m.a.push({ el:"C" }); m.main.push(i); if (i) m.b.push([i - 1, i, 1]); }
  if (sp.me != null) { Me = m.a.length; m.a.push({ el:"C" }); m.b.push([sp.me, Me, 1]); }
  function ix(c){ return c === "m" ? Me : c; }
  if (sp.o && sp.o.oh != null) { var O = m.a.length; m.a.push({ el:"O" }); m.b.push([ix(sp.o.oh), O, 1]); }
  else if (sp.o && sp.o.eth) {
    var x = ix(sp.o.eth[0]), y = ix(sp.o.eth[1]), k = C1.bondOf(m, x, y), O2 = m.a.length;
    m.a.push({ el:"O" }); m.b.splice(k, 1, [x, O2, 1], [O2, y, 1]);
    if (sp.o.eth[0] !== "m" && sp.o.eth[1] !== "m") m.main.splice(Math.max(x, y), 0, O2);
  }
  return m;
}
function specOK(sp){ var m = specMol(sp); for (var i = 0; i < m.a.length; i++) if (C1.free(m, i) < 0) return false; return true; }
function specSpace(){
  var out = [];
  for (var n = 1; n <= 6; n++) {
    var mes = [null]; for (var q = 1; q < n - 1; q++) mes.push(q);
    mes.forEach(function(me){
      var cids = []; for (var i = 0; i < n; i++) cids.push(i); if (me != null) cids.push("m");
      var bonds = []; for (var j = 1; j < n; j++) bonds.push([j - 1, j]); if (me != null) bonds.push([me, "m"]);
      out.push({ n:n, me:me, o:null });
      cids.forEach(function(c){ out.push({ n:n, me:me, o:{ oh:c } }); });
      bonds.forEach(function(b){ out.push({ n:n, me:me, o:{ eth:b } }); });
    });
  }
  return out.filter(specOK);
}
var NAMES = null;
function nameTable(){ if (!NAMES) { NAMES = {}; specSpace().forEach(function(sp){ var nm = NM.name(specMol(sp)).name; if (!(nm in NAMES)) NAMES[nm] = sp; }); } return NAMES; }
function byName(str){
  var t = NM.norm(str), T = nameTable();
  if (!t) return { msg:"Type a name first, such as butan-2-ol." };
  if (T[t]) return { spec:T[t], name:t };
  var c = NM.canon(t);
  if (c.name !== t && T[c.name]) return { spec:T[c.name], name:c.name, msg:c.common ? "Accepted. The IUPAC name is " + c.name + "." : "Accepted. Current IUPAC writes it " + c.name + "." };
  var lo = (c.name || t).match(/^(.*?)(meth|eth|prop|but|pent|hex)an-(\d)-ol$/);
  if (lo) { var n = ["", "meth", "eth", "prop", "but", "pent", "hex"].indexOf(lo[2]), alt = lo[1] + lo[2] + "an-" + (n + 1 - +lo[3]) + "-ol"; if (T[alt]) return { msg:"Number from the end nearer the OH: that molecule is " + alt + "." }; }
  return { msg:"The switchboard can’t build that name. It builds chains of up to 6 carbons with at most one methyl branch and one O (–OH or –O–). Check the spelling, or try a name like 2-methylpropan-1-ol." };
}
var SP = { ethanol:{ n:2, me:null, o:{ oh:1 } }, dme:{ n:2, me:null, o:{ eth:[0, 1] } }, butan1ol:{ n:4, me:null, o:{ oh:0 } }, propan2ol:{ n:3, me:null, o:{ oh:1 } }, tbutanol:{ n:3, me:1, o:{ oh:1 } } };
function famTxt(fm){
  if (fm.fam === "alcohol") return fm.cls ? "alcohol · " + fm.cls + (fm.methanol ? " (methanol: no carbon neighbours, but three H on the C–OH carbon)" : "") : "alcohol (more than one OH)";
  if (fm.fam === "ether") return "ether (no class)";
  return fm.fam + (fm.fam === "alkane" ? " (no oxygen)" : "");
}
var ISO = { 1:[1, 0], 2:[1, 1], 3:[2, 1], 4:[4, 3], 5:[8, 6] };
function isoTxt(f){
  if (f.O !== 1 || f.H !== 2 * f.C + 2) return '<span class="muted">add one O to compare isomers</span>';
  var v = ISO[f.C]; if (!v) return '<span class="muted">counted here for up to 5 carbons</span>';
  return v[0] + " alcohol" + (v[0] > 1 ? "s" : "") + ", " + (v[1] ? v[1] + " ether" + (v[1] > 1 ? "s" : "") : "no ethers");
}

// @component hbondBox — liquid / solution particle view for intermolecular forces: molecule glyphs from C1.layout2d (C, O and
// O–H hydrogens; H on carbon left out), H-bonded chains for a pure liquid, water on a jittered hex grid, a top layer for
// partly soluble liquids, violet dotted O–H···O lines (--e-pair) that flicker (static with reduced motion), moveTo() glides
// between layouts. pLayout(m, water, W, H) -> layout; particleBox(svg) -> {draw(layout), start(), stop(), fadeHB(dur, done), moveTo(L2, dur, done)}
// ---------- particle box glyphs (heavy atoms and O–H hydrogens; H on carbon left out) ----------
var PU = 16;   // water: px per bond length in the box (organic molecules scale with their size: see pLayout)
function glyphOf(m, U){
  var sc = C1.layout2d(m), at = [], map = {};
  sc.atoms.forEach(function(a, k){ if (a.isH && m.a[a.par].el !== "O") return; map[k] = at.length; at.push({ el:a.el, x:a.x * U, y:a.y * U, h:!!a.isH }); });
  var bonds = []; sc.bonds.forEach(function(b){ if ((b.a in map) && (b.b in map)) bonds.push([map[b.a], map[b.b], b.o]); });
  var oi = -1; at.forEach(function(a, k){ if (a.el === "O" && oi < 0) oi = k; });
  var an = oi >= 0 ? oi : 0, ax = at[an].x, ay = at[an].y, hi = -1, cx = 0, cy = 0, nc = 0;
  at.forEach(function(a, k){ a.x -= ax; a.y -= ay; if (a.h) hi = k; });
  at.forEach(function(a){ if (a.el === "C") { cx += a.x; cy += a.y; nc++; } });
  return { at:at, bonds:bonds, oi:oi, hi:hi, tail:nc ? Math.atan2(cy / nc, cx / nc) : 0, U:U };
}
function placeGlyph(g, x, y, tau, eta){
  var rot = tau - g.tail, c = Math.cos(rot), s = Math.sin(rot);
  var loc = g.at.map(function(a){ return { el:a.el, x:a.x * c - a.y * s, y:a.x * s + a.y * c }; });
  if (g.hi >= 0) { loc[g.hi].x = loc[g.oi].x + 0.62 * g.U * Math.cos(eta); loc[g.hi].y = loc[g.oi].y + 0.62 * g.U * Math.sin(eta); }
  return { x:x, y:y, loc:loc, bonds:g.bonds, don:g.hi >= 0 ? [g.hi] : [], acc:g.oi >= 0 ? [g.oi] : [] };
}
function waterAt(x, y, th, sgn, U){
  var d = 0.62 * U, t2 = th + sgn * 1.82;
  return { x:x, y:y, loc:[{ el:"O", x:0, y:0 }, { el:"H", x:d * Math.cos(th), y:d * Math.sin(th) }, { el:"H", x:d * Math.cos(t2), y:d * Math.sin(t2) }], bonds:[[0, 1, 1], [0, 2, 1]], don:[1, 2], acc:[0], water:true };
}
function rnd(i){ var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
function atomSVG(a, x, y, r, fsz){
  var c = MV.chem.atom(a.el), rr = a.el === "H" ? r * 0.75 : r;
  return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(rr) + '" fill="' + c.fill + '"' + (a.el === "H" ? ' stroke="' + c.line + '" stroke-width="1.2"' : "") + '/><text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(a.el === "H" ? fsz * 0.85 : fsz) + '" font-weight="700" fill="' + c.ink + '">' + a.el + "</text>";
}
function glyphSVG(it, ox, oy, r, fsz){
  var s = "";
  it.bonds.forEach(function(b){ var p = it.loc[b[0]], q = it.loc[b[1]]; s += '<line x1="' + r1(ox + p.x) + '" y1="' + r1(oy + p.y) + '" x2="' + r1(ox + q.x) + '" y2="' + r1(oy + q.y) + '" stroke="var(--ink-2)" stroke-width="' + (b[2] > 1 ? 3.4 : 2) + '"/>'; });
  it.loc.forEach(function(a){ s += atomSVG(a, ox + a.x, oy + a.y, r, fsz); });
  return s;
}
// H-bond pairs at rest: each donor H to its nearest acceptor O (another molecule), at most 2 donors per acceptor
function hbPairs(items, maxD){
  var cand = [];
  items.forEach(function(d, di){ if (d.hide) return; d.don.forEach(function(hk){
    var hx = d.x + d.loc[hk].x, hy = d.y + d.loc[hk].y, best = null;
    items.forEach(function(a, ai){ if (ai === di || a.hide) return; a.acc.forEach(function(ok){ var dd = Math.hypot(a.x + a.loc[ok].x - hx, a.y + a.loc[ok].y - hy); if (dd < maxD && (!best || dd < best.d)) best = { a:ai, k:ok, d:dd }; }); });
    if (best) cand.push([di, hk, best.a, best.k, best.d]);
  }); });
  cand.sort(function(p, q){ return p[4] - q[4]; });
  var load = {};
  return cand.filter(function(c){ var key = c[2] + ":" + c[3]; load[key] = (load[key] || 0) + 1; return load[key] <= 2; });
}
// layout of the box: organics in H-bond chains (pure liquid or a top layer) or spread through water
function chainSpots(N, W, H, band){
  var C = [], out = [];
  if (!band) C = N > 8 ? [[0.25, 0.3, -0.2], [0.75, 0.32, 0.22], [0.5, 0.72, 0.06]] : [[0.5, 0.28, -0.12], [0.5, 0.72, 0.12]];
  else { var k = Math.max(1, Math.ceil(N / 4)); for (var i = 0; i < k; i++) C.push([(i + 0.5) / k, band / H / 2, i % 2 ? 0.1 : -0.1]); }
  var per = Math.ceil(N / C.length), D = clamp(W / C.length / (per + 0.6), 38, 50);
  C.forEach(function(c){ var cnt = Math.min(per, N - out.length); for (var j = 0; j < cnt; j++) { var off = (j - (cnt - 1) / 2) * D; out.push({ x:c[0] * W + off * Math.cos(c[2]), y:c[1] * H + off * Math.sin(c[2]), phi:c[2], s:j % 2 ? 1 : -1 }); } });
  return out;
}
function mixLevel(m){
  var fm = NM.fam(m), nm = NM.name(m).name, v = solOf(nm), f = C1.formula(m);
  if (fm.fam === "alkane" || fm.fam === "alkene") return "none";
  if (v === "mix") return "mix";
  if (typeof v === "number") return v >= 5 ? "part" : "low";
  if (fm.fam === "alcohol") return f.C <= 3 ? "mix" : f.C === 4 ? "part" : "low";
  return "part";
}
function pLayout(m, water, W, H){
  var N = W < 480 ? 8 : 12, nC = C1.formula(m).C, U = clamp(19 - 1.3 * (nC - 2), 12.5, 19), g = glyphOf(m, U), mix = water ? mixLevel(m) : "pure", items = [], i;
  var nIn = mix === "mix" ? N : mix === "part" ? (N > 8 ? 3 : 2) : mix === "low" ? 1 : 0, nLay = N - nIn, layerY = (mix === "part" || mix === "low" || mix === "none") ? Math.round(H * 0.46) : 0;
  // water sites (hex grid)
  var sx = 48, sy = 42, sites = [], row = 0;
  for (var y = 24; y < H - 12; y += sy, row++) for (var x = 22 + (row % 2) * sx / 2; x < W - 12; x += sx) sites.push({ x:x + (rnd(sites.length) - 0.5) * 8, y:y + (rnd(sites.length + 99) - 0.5) * 8, used:false });
  // layer (or pure liquid) chains
  chainSpots(nLay, W, H, mix === "pure" ? 0 : layerY).forEach(function(sp){
    var tau = sp.phi + sp.s * (Math.PI / 2 + 0.3);
    items.push(placeGlyph(g, sp.x, sp.y, tau, sp.phi));
  });
  // dissolved organics at spread-out water sites
  if (nIn) {
    var pool = sites.filter(function(s){ return s.y > layerY + 30 && s.x > 40 && s.x < W - 40 && s.y < H - 30; }), step = pool.length / nIn;
    for (i = 0; i < nIn; i++) {
      var s = pool[Math.floor((i + 0.5) * step) % pool.length]; s.used = true;
      var tau = rnd(i + 7) * Math.PI * 2, eta = tau + (i % 2 ? 1 : -1) * 1.9;
      items.push(placeGlyph(g, s.x, s.y, tau, eta));
    }
  }
  var orgN = items.length;
  // water molecules
  sites.forEach(function(s, k){
    var hide = !water || s.used || s.y < layerY + 14;
    if (!hide) for (var q = 0; q < orgN && !hide; q++) { var it = items[q]; for (var a = 0; a < it.loc.length; a++) if (Math.hypot(it.x + it.loc[a].x - s.x, it.y + it.loc[a].y - s.y) < 19) { hide = true; break; } }
    var near = null; sites.forEach(function(t, k2){ if (k2 === k) return; var d = Math.hypot(t.x - s.x, t.y - s.y) + rnd(k * 31 + k2) * 9; if (!near || d < near.d) near = { d:d, t:t }; });
    var th = near ? Math.atan2(near.t.y - s.y, near.t.x - s.x) : 0, w = waterAt(s.x, s.y, th, k % 2 ? 1 : -1, PU);
    w.hide = hide; w.site = k; items.push(w);
  });
  // dissolved organics: point the O–H toward the nearest water O
  for (i = nLay; i < orgN; i++) (function(it){
    if (!it.don.length) return; var o = it.loc[it.acc[0]], best = null;
    items.forEach(function(w){ if (!w.water || w.hide) return; var d = Math.hypot(w.x - it.x - o.x, w.y - it.y - o.y); if (d > 14 && (!best || d < best.d)) best = { d:d, w:w }; });
    if (best) { var e = Math.atan2(best.w.y - it.y - o.y, best.w.x - it.x - o.x), hk = it.don[0]; it.loc[hk] = { el:"H", x:o.x + 0.62 * U * Math.cos(e), y:o.y + 0.62 * U * Math.sin(e) }; }
  })(items[i]);
  return { W:W, H:H, N:N, orgN:orgN, mix:mix, layerY:layerY, water:water, items:items, pairs:hbPairs(items, 42), name:NM.name(m).name, r:clamp(U * 0.46, 6.2, 8.6) };
}

// particle box renderer: one <g> per molecule (translate-only jiggle), pooled H-bond lines
function particleBox(svg){
  var L = null, gs = [], lines = [], on = false, raf = 0, last = 0, hbK = 1, frozenT = 0;
  function build(){
    var W = L.W, H = L.H, s = '<defs><clipPath id="ao-pclip"><rect x="0" y="0" width="' + W + '" height="' + H + '" rx="10"/></clipPath></defs><g clip-path="url(#ao-pclip)">';
    if (L.water) s += '<rect x="0" y="' + L.layerY + '" width="' + W + '" height="' + (H - L.layerY) + '" fill="var(--info-bg)"/>' + (L.layerY ? '<line x1="0" y1="' + L.layerY + '" x2="' + W + '" y2="' + L.layerY + '" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="6 5"/>' : "");
    s += '<g class="ao-hb"></g>';
    L.items.forEach(function(it, k){ s += '<g data-pi="' + k + '"' + (it.hide ? ' opacity="0"' : "") + ">" + glyphSVG({ loc:it.loc, bonds:it.bonds }, 0, 0, it.water ? 6.4 : L.r, it.water ? 8 : L.r * 1.2) + "</g>"; });
    if (L.water) {
      s += '<text x="' + (W - 10) + '" y="' + (H - 10) + '" text-anchor="end" font-size="13" font-weight="700" fill="var(--ink-2)" stroke="var(--sheet)" stroke-width="3" paint-order="stroke">' + (L.mix === "mix" ? "mixed with water" : "water") + "</text>";
      if (L.layerY) { var lw = (L.name.length + 6) * 7.4 + 12; s += '<rect x="' + r1(W - 6 - lw) + '" y="' + (L.layerY - 24) + '" width="' + r1(lw) + '" height="20" rx="5" fill="var(--sheet)" opacity=".9"/><text x="' + (W - 12) + '" y="' + (L.layerY - 9) + '" text-anchor="end" font-size="13" font-weight="700" fill="var(--ink-2)">' + esc(L.name) + " layer</text>"; }
    }
    s += '</g><rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="10" fill="none" stroke="var(--rule)" stroke-width="2"/>';
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.innerHTML = s;
    gs = $$("g[data-pi]", svg); lines = [];
  }
  function off(k, t){ var a = L.items[k].water ? 2.2 : 1.7; return [a * Math.sin(t * (1.3 + rnd(k) * 0.9) + k * 1.7), a * Math.cos(t * (1.1 + rnd(k + 5) * 0.8) + k * 2.3)]; }
  function frame(t, pos){
    if (!L) return;
    var P = L.items.map(function(it, k){ var o = off(k, t), b = pos ? pos[k] : it; return [b.x + o[0], b.y + o[1]]; });
    gs.forEach(function(g, k){ g.setAttribute("transform", "translate(" + r1(P[k][0]) + "," + r1(P[k][1]) + ")"); });
    var hb = $(".ao-hb", svg); if (!hb) return;
    while (lines.length < L.pairs.length) { var ln = document.createElementNS("http://www.w3.org/2000/svg", "line"); ln.setAttribute("stroke", "var(--e-pair)"); ln.setAttribute("stroke-width", "2.2"); ln.setAttribute("stroke-dasharray", "2 3"); ln.setAttribute("stroke-linecap", "round"); hb.appendChild(ln); lines.push(ln); }
    lines.forEach(function(ln, q){
      var p = L.pairs[q];
      if (!p || hbK <= 0.01) { ln.setAttribute("opacity", "0"); return; }
      var d = L.items[p[0]], a = L.items[p[2]], x1 = P[p[0]][0] + d.loc[p[1]].x, y1 = P[p[0]][1] + d.loc[p[1]].y, x2 = P[p[2]][0] + a.loc[p[3]].x, y2 = P[p[2]][1] + a.loc[p[3]].y;
      var dist = Math.hypot(x2 - x1, y2 - y1), fl = MV.reduceMotion ? 1 : 0.55 + 0.45 * Math.sin(t * 2.4 + q * 1.9);
      ln.setAttribute("x1", r1(x1)); ln.setAttribute("y1", r1(y1)); ln.setAttribute("x2", r1(x2)); ln.setAttribute("y2", r1(y2));
      ln.setAttribute("opacity", dist < 46 ? r1(hbK * fl * 100) / 100 : "0");
    });
  }
  function tick(ts){ if (!on) return; if (ts - last > 66) { last = ts; frozenT = ts / 1000; frame(frozenT); } raf = requestAnimationFrame(tick); }
  return {
    draw:function(layout){ L = layout; hbK = 1; build(); frame(frozenT); },
    start:function(){ if (on || MV.reduceMotion || !L) return; on = true; raf = requestAnimationFrame(tick); },
    stop:function(){ on = false; cancelAnimationFrame(raf); },
    layout:function(){ return L; },
    fadeHB:function(dur, done){ MV.tween({ dur:dur, step:function(t){ hbK = 1 - t; frame(frozenT); }, done:function(){ hbK = 0; if (done) done(); } }); },
    // move to a new layout with the same molecule count: organics glide, water molecules fade in or out
    moveTo:function(L2, dur, done){
      var L1 = L, from = L1.items.map(function(it){ return { x:it.x, y:it.y }; });
      L = L2; hbK = 0; build();
      gs.forEach(function(g, k){ var it = L2.items[k]; if (it.water) g.setAttribute("opacity", L1.items[k] && !L1.items[k].hide ? "1" : "0"); });
      MV.tween({ dur:dur, step:function(t){
        var pos = L2.items.map(function(it, k){ var a = from[k] || it; return { x:a.x + (it.x - a.x) * t, y:a.y + (it.y - a.y) * t }; });
        gs.forEach(function(g, k){ var it = L2.items[k]; if (!it.water) return; var v0 = L1.items[k] && !L1.items[k].hide ? 1 : 0, v1 = it.hide ? 0 : 1; g.setAttribute("opacity", r1(v0 + (v1 - v0) * t)); });
        frame(frozenT, pos);
      }, done:function(){ MV.tween({ dur:500, step:function(t){ hbK = t; frame(frozenT); }, done:function(){ hbK = 1; frame(frozenT); if (done) done(); } }); } });
    }
  };
}

// ---------- hero: two flasks, a thermometer, H-bonds only between ethanol molecules ----------
function hero(){
  var svg = $("#ao-hx-svg"), cap = $("#ao-hx-cap"), rep = $("#ao-hx-replay");
  if (!svg) return;
  var U = 19, gE = glyphOf(specMol(SP.ethanol), U), gD = glyphOf(specMol(SP.dme), U), FL = [{ cx:160, g:gE, bp:78, nm:"ethanol" }, { cx:480, g:gD, bp:-24, nm:"methoxymethane" }];
  FL.forEach(function(f){
    f.mols = [];
    [[f.cx, 312, -0.06], [f.cx, 366, 0.06]].forEach(function(c){ for (var j = 0; j < 3; j++) { var off = (j - 1) * 46, s = j % 2 ? 1 : -1; f.mols.push(placeGlyph(f.g, c[0] + off, c[1] + off * Math.sin(c[2]), c[2] + s * (Math.PI / 2 + 0.3), c[2])); } });
  });
  function wHalf(y){ return y < 214 ? 20 : 20 + (y - 214) / 190 * 96; }
  function flask(cx, lvl){
    var top = 150, neck = 214, bot = 404, path = "M" + (cx - 20) + " " + top + " L" + (cx - 20) + " " + neck + " L" + (cx - 116) + " " + bot + " L" + (cx + 116) + " " + bot + " L" + (cx + 20) + " " + neck + " L" + (cx + 20) + " " + top;
    var liq = lvl < bot ? '<path d="M' + r1(cx - wHalf(lvl)) + " " + r1(lvl) + " L" + (cx - 116) + " " + bot + " L" + (cx + 116) + " " + bot + " L" + r1(cx + wHalf(lvl)) + " " + r1(lvl) + 'Z" fill="var(--info-bg)"/>' : "";
    return liq + '<path d="' + path + '" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/><path d="M' + (cx - 27) + " " + top + " H" + (cx + 27) + '" stroke="var(--ink-2)" stroke-width="3" stroke-linecap="round"/>';
  }
  function ty(T){ return 372 - (T + 40) * (282 / 140); }
  function thermo(T){
    var x = 320, s = '<rect x="' + (x - 9) + '" y="70" width="18" height="306" rx="9" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2.4"/><circle cx="' + x + '" cy="392" r="17" fill="var(--pen)" stroke="var(--ink-2)" stroke-width="2.4"/>';
    s += '<rect x="' + (x - 4.5) + '" y="' + r1(ty(T)) + '" width="9" height="' + r1(392 - ty(T)) + '" fill="var(--pen)"/>';
    [[-24, "−24 °C", 1], [78, "78 °C", -1]].forEach(function(k){ var y = r1(ty(k[0])); s += '<line x1="' + (x - 14) + '" y1="' + y + '" x2="' + (x + 14) + '" y2="' + y + '" stroke="var(--ink)" stroke-width="2"/><text x="' + (x + k[2] * 20) + '" y="' + y + '" text-anchor="' + (k[2] > 0 ? "start" : "end") + '" dominant-baseline="central" font-size="18" font-weight="700" fill="var(--ink)">' + k[1] + "</text>"; });
    s += '<text x="' + x + '" y="52" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink)">' + degC(Math.round(T)) + "</text>";
    return s;
  }
  // esc: escape progress 0–1 per molecule; hbOn: flicker time for ethanol H-bonds
  function lvl(es){ return 262 + 142 * es.reduce(function(a, b){ return a + Math.min(1, b * 1.6); }, 0) / 6; }
  function draw(T, escE, escD, t, gas){
    var s = flask(160, lvl(escE)) + flask(480, lvl(escD)) + thermo(T);
    var P = [];
    FL.forEach(function(f, fi){
      var es = fi ? escD : escE;
      f.mols.forEach(function(it, k){ var e = es[k], dx = MV.reduceMotion ? 0 : 1.6 * Math.sin(t * 1.7 + k * 2.1 + fi), dy = MV.reduceMotion ? 0 : 1.6 * Math.cos(t * 1.3 + k * 1.3 + fi); P.push({ it:it, x:it.x + dx + (f.cx - it.x) * Math.min(1, e * 2) + e * (k % 2 ? 30 : -30) * Math.sin(e * 3), y:it.y + dy - e * (it.y - 40), op:1 - e * e, fi:fi, k:k }); });
    });
    // H-bonds between neighbouring ethanol molecules in each chain (O–H … O)
    for (var c = 0; c < 2; c++) for (var j = 0; j < 2; j++) {
      var a = P[c * 3 + j], b = P[c * 3 + j + 1];
      if (a.op < 0.6 || b.op < 0.6) continue;
      var h = a.it.loc[gE.hi], o = b.it.loc[gE.oi], fl = MV.reduceMotion ? 1 : 0.55 + 0.45 * Math.sin(t * 2.6 + c * 2 + j * 1.3);
      s += '<line x1="' + r1(a.x + h.x) + '" y1="' + r1(a.y + h.y) + '" x2="' + r1(b.x + o.x) + '" y2="' + r1(b.y + o.y) + '" stroke="var(--e-pair)" stroke-width="2.8" stroke-dasharray="2.5 3.5" stroke-linecap="round" opacity="' + r1(fl) + '"/>';
    }
    if (gas) P.forEach(function(p){ if (!p.fi) return; p.x = 480 + (p.k - 2.5) * 36; p.y = 48 + (p.k % 3) * 30; p.op = 0.6; });
    P.forEach(function(p){ if (p.op <= 0.02) return; s += '<g opacity="' + r1(p.op) + '">' + glyphSVG(p.it, p.x, p.y, 9.5, 11.5) + "</g>"; });
    FL.forEach(function(f){ s += '<text x="' + f.cx + '" y="430" text-anchor="middle" font-size="21" font-weight="700" fill="var(--ink)">' + f.nm + "</text>"; if (T >= f.bp || gas) s += '<text x="' + f.cx + '" y="456" text-anchor="middle" font-size="' + (gas ? 17 : 19) + '" fill="var(--ink)">boils at ' + degC(f.bp) + (gas ? (T >= f.bp ? ": gas at " : ": liquid at ") + degC(T) : "") + "</text>"; });
    svg.innerHTML = s;
  }
  var Z6 = [0, 0, 0, 0, 0, 0];
  if (MV.reduceMotion) {
    draw(20, Z6, [1, 1, 1, 1, 1, 1], 0, true);
    cap.textContent = "At 20 °C, methoxymethane (boils at −24 °C) is a gas, but ethanol (boils at 78 °C) is still a liquid: its molecules hydrogen-bond to each other.";
    return;
  }
  var run = 0;
  function escP(t0, t, k){ return clamp((t - t0 - k * 0.22) / 1.3, 0, 1); }
  function play(){
    var id = ++run; rep.hidden = true;
    cap.textContent = "Both flasks hold C₂H₆O. Violet dotted lines are hydrogen bonds: only ethanol forms them.";
    var D = 12.3, T0 = -40, T1 = 88, rise0 = 2, rise1 = 11, ph = 0;
    MV.tween({ dur:D * 1000, ease:function(x){ return x; }, step:function(u){
      if (id !== run) return;
      var t = u * D, T = t < rise0 ? T0 : t > rise1 ? T1 : T0 + (T1 - T0) * (t - rise0) / (rise1 - rise0);
      var tD = rise0 + (-24 - T0) / (T1 - T0) * (rise1 - rise0), tE = rise0 + (78 - T0) / (T1 - T0) * (rise1 - rise0);
      var eD = Z6.map(function(_, k){ return escP(tD, t, k); }), eE = Z6.map(function(_, k){ return escP(tE, t, k); });
      draw(T, eE, eD, t);
      var p2 = T < -24 ? 0 : T < 60 ? 1 : T < 78 ? 2 : 3;
      if (p2 !== ph) { ph = p2; cap.textContent = ["", "−24 °C: methoxymethane boils. With no hydrogen bonds, its molecules escape easily.", "Ethanol stays liquid: its hydrogen bonds hold the molecules together.", "78 °C: now ethanol boils too."][p2]; }
    }, done:function(){ if (id === run) rep.hidden = false; } });
  }
  rep.addEventListener("click", play);
  play();
}

// @component bpBars — boiling-point columns on a fixed −100 to 200 °C scale (data bars --pen; the current molecule solid,
// comparisons translucent) with HTML labels below (role, name, formula · molar mass). barsHTML(set, W, vals)
// ---------- boiling-point bars (Properties mode) ----------
function barSet(m){
  var fm = NM.fam(m), f = C1.formula(m), nm = NM.name(m).name, nC = f.C, ft = C1.fText(m), Mv = Math.round(molarMass(f));
  var out = [{ role:"this molecule", nm:nm, f:ft, M:Mv, v:bpOf(nm) }];
  if (f.O === 1 && (fm.fam === "alcohol" || fm.fam === "ether")) {
    var iso = fm.fam === "alcohol" ? { 2:"methoxymethane", 3:"methoxyethane", 4:"ethoxyethane" }[nC] : { 2:"ethanol", 3:"propan-1-ol", 4:"butan-1-ol", 5:"pentan-1-ol", 6:"hexan-1-ol" }[nC];
    out.push({ role:"functional-group isomer", nm:iso || "", f:ft, M:Mv, v:iso ? bpOf(iso) : null, none:iso ? "" : fm.fam === "alcohol" ? (nC === 1 ? "none: CH₄O has no ether isomer" : "no C" + nC + " ether in the data table") : "no C" + nC + " alcohol in the data table" });
    var an = ["", "methane", "ethane", "propane", "butane", "pentane", "hexane", "heptane", "octane", "nonane", "decane"][nC + 1], af = { C:nC + 1, H:2 * nC + 4, O:0 };
    out.push({ role:"alkane of similar mass", nm:an, f:"C" + (nC + 1) + "H" + (2 * nC + 4), M:Math.round(molarMass(af)), v:bpOf(an) });
  }
  return out;
}
function barsHTML(set, W, vals){
  var H = 210, top = 28, bot = 188, lo = -100, hi = 200, L = 46, n = 3, cw = (W - L - 6) / n;
  function Y(v){ return bot - (clamp(v, lo, hi) - lo) / (hi - lo) * (bot - top); }
  var s = "";
  [-100, 0, 100, 200].forEach(function(v){ var y = r1(Y(v)); s += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - 4) + '" y2="' + y + '" stroke="var(' + (v === 0 ? "--ink-2" : "--plot-grid") + ')" stroke-width="' + (v === 0 ? 1.6 : 1) + '"' + (v === 0 ? ' stroke-dasharray="5 4"' : "") + '/><text x="' + (L - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="central" font-size="12" fill="var(--ink-2)">' + MV.chem.fx(v, 0) + "</text>"; });
  s += '<text x="4" y="12" font-size="12" font-weight="700" fill="var(--ink-2)">°C</text>';
  set.forEach(function(b, i){
    var v = vals ? vals[i] : b.v, cx = L + cw * (i + 0.5), bw = Math.min(48, cw * 0.46);
    if (v == null) { s += '<text x="' + r1(cx) + '" y="' + r1((top + bot) / 2) + '" text-anchor="middle" font-size="13" fill="var(--ink-2)">no data</text>'; return; }
    var y = Y(v);
    s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(y) + '" width="' + r1(bw) + '" height="' + r1(Math.max(2, bot - y)) + '" rx="5" fill="var(--pen)"' + (i ? ' fill-opacity=".45" stroke="var(--pen)" stroke-width="1.5"' : "") + "/>";
    s += '<text x="' + r1(cx) + '" y="' + r1(y - 9) + '" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">' + degC(Math.round(v)) + "</text>";
  });
  var aria = "Boiling points: " + set.map(function(b, i){ var v = vals ? vals[i] : b.v; return (b.nm || b.role) + " " + (v == null ? "no data" : MV.plain(degC(Math.round(v)))); }).join("; ") + ".";
  var labs = '<div class="ao-blabs" style="padding-left:' + L + 'px">' + set.map(function(b, i){ return '<div class="ao-blab' + (i ? "" : " cur") + '"><span class="tiny muted">' + b.role + "</span><strong>" + (b.nm || "—") + "</strong>" + (b.none ? '<span class="tiny muted">' + b.none + "</span>" : '<span class="tiny">' + F(b.f) + " · " + b.M + " g/mol</span>") + "</div>"; }).join("") + "</div>";
  return '<svg class="ao-bsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>" + labs;
}

// ---------- Explore: Functional group switchboard ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (!S.spec || !specOK(S.spec)) S.spec = JSON.parse(JSON.stringify(SP.ethanol));
  S.mode = S.mode || "prop"; S.view = S.view || "st"; S.water = !!S.water;
  var sel = null, pv = null, msg = "", nmsg = "", T = { busy:false }, mc = { k:"", m:null }, barW = 0, barOverride = null;
  host.innerHTML = '<p class="how ao-how">' + C.how + '</p><div class="ao-grid"><div class="ao-left" data-mv="graph"><div class="eq-cap ao-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ao-molbox"><div class="ao-mol"></div><div class="ao-views"></div><p class="ao-note" aria-live="polite"></p></div>' +
    '<div class="ao-pbox" hidden><svg class="ao-psvg" role="img" aria-label=""></svg><p class="ao-pcap" aria-live="polite"></p><p class="tiny muted ao-pleg">Shown: C, O and the H on O. The H atoms on carbon are left out. <span class="ao-hbkey" aria-hidden="true"></span> violet dotted line: a hydrogen bond (O–H ··· O).</p></div>' +
    '<div class="ao-bars"></div></div>' +
    '<div class="ao-ctrl"><div class="ao-modes"></div><label class="slider ao-sl"><span class="slider-top"><span>Carbons in the chain</span><output class="ao-n"></output></span><input type="range" class="ao-rng" min="1" max="6" step="1" aria-label="Carbons in the chain"></label>' +
    '<p class="ao-msg" aria-live="polite"></p><div class="ao-menu" role="group" aria-label="Actions for the selected atom or bond"></div>' +
    '<div class="q-actions ao-oxrow"><button type="button" class="btn ghost sm" data-ox="go" data-k="oxgo">Try [O] (preview of Part 3)</button><button type="button" class="btn ghost sm" data-ox="back" data-k="oxback" hidden>Back to the molecule</button></div>' +
    '<label class="ao-water"><input type="checkbox" class="ao-win"> Water box: add water</label>' +
    '<form class="ao-nf"><label for="ao-nin">Build from a name</label><span class="ao-nfr"><input type="text" id="ao-nin" class="ao-nin" autocomplete="off" spellcheck="false" placeholder="e.g. butan-2-ol"><button type="submit" class="btn ghost sm">Build</button></span></form><p class="ao-nmsg tiny" aria-live="polite"></p></div>' +
    '<div class="ao-right"><dl class="read ao-read" aria-live="polite"></dl><div class="ao-tab"></div></div></div>';
  var V = C1.view($(".ao-mol", host), { rotate:true, onPick:pick, label:pickLabel });
  var viewRG = radios($(".ao-views", host), { label:"View", aria:"Structure view", options:[{ id:"st", t:"Structural (2D)" }, { id:"3d", t:"3D model" }], value:S.view, onChange:function(v){ S.view = v; api.save(); paint(); } });
  var modeRG = radios($(".ao-modes", host), { label:"Mode", aria:"Switchboard mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var rng = $(".ao-rng", host), win = $(".ao-win", host), PB = particleBox($(".ao-psvg", host));
  win.checked = S.water;
  // data tables: the module table (course table additions) and the C13 boiling-point panel
  (function(){
    var rows = Object.keys(AO).map(function(nm){ var v = AO[nm]; return [nm, MV.chem.fx(v[0], 0), v[1] == null ? "—" : v[1] === "mix" ? "mixes completely" : "≈ " + v[1]]; });
    var d = document.createElement("details"); d.className = "chem-tab";
    d.innerHTML = "<summary>Data table: alcohols and ethers</summary>" + MV.tableHTML({ head:["Compound", "Boiling point (°C)", "Solubility (g per 100 mL water, 20 °C)"], rows:rows, caption:"Boiling points and solubilities of alcohols and ethers" }) + '<p class="tiny muted" style="margin:8px 0 0">Course table additions from this module. — means no value is given.</p>';
    $(".ao-tab", host).appendChild(d);
    MV.chem.tablePanel($(".ao-tab", host), "bp", { title:"Course data table: boiling points of hydrocarbons (°C)" });
  })();

  function mol(){ var k = JSON.stringify(S.spec); if (mc.k !== k) mc = { k:k, m:specMol(S.spec) }; return mc.m; }
  function nameOf(){ return NM.name(mol()).name; }
  function meIdx(){ return S.spec.me != null ? S.spec.n : -1; }
  function oIdx(){ return S.spec.o ? mol().a.length - 1 : -1; }
  function cidOf(i){ return i < S.spec.n ? i : i === meIdx() ? "m" : null; }
  function idxOf(c){ return c === "m" ? meIdx() : c; }
  function selIdx(){ if (!sel) return null; if (sel.t === "o") return oIdx(); if (sel.t === "c") return idxOf(sel.c); return null; }
  function selPair(){ return sel && sel.t === "b" ? [idxOf(sel.p[0]), idxOf(sel.p[1])] : null; }
  function same(p, q){ return p && q && ((p[0] === q[0] && p[1] === q[1]) || (p[0] === q[1] && p[1] === q[0])); }
  function cLabel(c){ return c === "m" ? "the methyl carbon" : "C" + (c + 1); }
  function pick(kind, i){
    if (T.busy) return;
    pv = null;
    if (kind === "a") { var c = cidOf(i); sel = c != null ? { t:"c", c:c } : { t:"o" }; }
    else { var b = mol().b[i]; sel = { t:"b", p:[cidOf(b[0]), cidOf(b[1])] }; }
    msg = ""; paint();
  }
  function pickLabel(kind, i){
    var m = mol(), h = C1.hc(m);
    if (kind === "a") {
      if (m.a[i].el === "O") return "The oxygen atom" + (h[i] ? " (–OH)" : " (between two carbons)") + ". Select it to remove the O.";
      var c = cidOf(i); return (c === "m" ? "Methyl carbon" : "Carbon " + (c + 1)) + ", C" + (h[i] ? "H" + (h[i] > 1 ? h[i] : "") : "") + (sel && sel.t === "c" && sel.c === c ? ", selected" : "") + ". Select it to put the –OH here or add the methyl.";
    }
    var b = m.b[i]; return "Bond between " + cLabel(cidOf(b[0])) + " and " + cLabel(cidOf(b[1])) + ". Select it to put the O between these carbons.";
  }
  function setSpec(sp, note){ S.spec = sp; pv = null; msg = note || ""; api.save(); paint(); }
  function cp(){ return JSON.parse(JSON.stringify(S.spec)); }
  rng.addEventListener("input", function(){
    var n = +rng.value, sp = cp(); if (n === sp.n || T.busy) { rng.value = S.spec.n; return; }
    var note = "Chain: " + n + " carbon" + (n > 1 ? "s" : "") + ".";
    sp.n = n;
    if (sp.me != null && sp.me > n - 2) { sp.me = null; note += " The methyl was on a removed or end carbon, so it was taken off."; }
    if (sp.o) {
      var ok = sp.o.oh != null ? (sp.o.oh === "m" ? sp.me != null : sp.o.oh < n) : sp.o.eth.every(function(c){ return c === "m" ? sp.me != null : c < n; });
      if (!ok) { sp.o = null; note += " The O was on a removed carbon, so it was taken off."; }
    }
    if (!specOK(sp)) { sp.me = null; note += " The methyl was taken off (too many bonds)."; }
    if (sel && ((sel.t === "c" && sel.c !== "m" && sel.c >= n) || (sel.t === "c" && sel.c === "m" && sp.me == null) || sel.t === "b")) sel = null;
    if (sel && sel.t === "o" && !sp.o) sel = null;
    setSpec(sp, note);
  });
  win.addEventListener("change", function(){ S.water = win.checked; api.save(); paint(); });
  $(".ao-menu", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || T.busy) return;
    var a = b.dataset.act, sp = cp();
    if (a === "oh") { sp.o = { oh:sel.c }; setSpec(sp, "–OH on " + cLabel(sel.c) + "."); }
    else if (a === "rmo") { sp.o = null; sel = null; setSpec(sp, "O removed: back to a hydrocarbon."); }
    else if (a === "me") { sp.me = sel.c; setSpec(sp, "Methyl branch on " + cLabel(sel.c) + "."); }
    else if (a === "rmme") {
      var was = sp.me; sp.me = null;
      var drop = sp.o && (sp.o.oh === "m" || (sp.o.eth && sp.o.eth.indexOf("m") >= 0));
      if (drop) sp.o = null;
      sel = { t:"c", c:was }; setSpec(sp, "Methyl removed." + (drop ? " The O was on the methyl, so it went too." : ""));
    }
    else if (a === "eth") { sp.o = { eth:sel.p.slice() }; sel = { t:"o" }; setSpec(sp, "O placed between " + cLabel(sp.o.eth[0]) + " and " + cLabel(sp.o.eth[1]) + ": an ether."); }
    var f = $('.ao-menu [data-k="' + b.dataset.k + '"]', host) || $(".ao-menu button", host); if (f) f.focus({ preventScroll:true });
  });
  $(".ao-oxrow", host).addEventListener("click", function(e){ var b = e.target.closest("[data-ox]"); if (!b || T.busy) return; if (b.dataset.ox === "go") previewOx(); else { pv = null; paint(); } });
  $(".ao-nf", host).addEventListener("submit", function(e){
    e.preventDefault(); if (T.busy) return;
    var r = byName($(".ao-nin", host).value);
    if (r.spec) { sel = null; setSpec(JSON.parse(JSON.stringify(r.spec)), ""); nmsg = r.msg || "Built " + r.name + "."; }
    else nmsg = r.msg;
    $(".ao-nmsg", host).textContent = nmsg;
  });
  function setMode(v){ S.mode = v; modeRG.set(v); pv = null; api.save(); paint(); }

  // ---------- [O] preview (Part 3 preview) ----------
  function previewOx(cb){
    var m = mol(), r = oxStep(m), fm = NM.fam(m), nm = NM.name(m).name;
    if (S.view === "3d") { S.view = "st"; viewRG.set("st"); api.save(); }
    if (r.none) {
      pv = { m:m, glow:r.c != null ? r.c : null, note:r.why === "tert" ? { i:r.c, t:"no H here" } : null,
        cap:F(condensed(m)) + " + [O]: no reaction", txt:r.why === "tert" ? "Tertiary: the C–OH carbon has no H, so [O] can’t remove one. No reaction." : r.why === "ether" ? "Ethers have no C–OH carbon: no reaction with mild [O]." : r.why === "none" ? "No OH on the chain: nothing for [O] to act on here." : "A " + fm.fam + " doesn’t react further with mild [O]." };
      paint(); if (cb) MV.wait(900, cb); return;
    }
    var p = r.prod, pn = NM.name(p).name, word = { al:"an aldehyde", one:"a ketone", acid:"a carboxylic acid" }[r.to];
    pv = { m:p, from:m, glow:null, hRing:r.c, cap:F(condensed(m)) + " + [O] → " + F(condensed(p)) + " + " + F("H2O"),
      txt:"<strong>" + nm + "</strong> → <strong>" + pn + "</strong>, " + word + ". " + (r.to === "al" ? "Primary → aldehyde. In Part 3, a second [O] goes on to the carboxylic acid." : r.to === "one" ? "Secondary → ketone: the C–OH carbon lost its H and the O–H lost its H." : "Aldehyde → carboxylic acid.") };
    T.busy = true; paintCtrl();
    $(".ao-cap", host).innerHTML = pv.cap; $(".ao-note", host).innerHTML = pv.txt;
    V.anim(C1.layout2d(m), C1.layout2d(p), { smax:62, aria:"Oxidation: " + nm + " becomes " + pn + "." }, 1500, function(){ T.busy = false; paint(); if (cb) MV.wait(400, cb); });
  }

  // ---------- painting ----------
  function paintView(){
    var m = mol(), nm = NM.name(m), fm = NM.fam(m), atoms = m.a.map(function(_, i){ return i; }), bonds = [];
    m.b.forEach(function(b, i){ if (m.a[b[0]].el === "C" && m.a[b[1]].el === "C") bonds.push(i); });
    var sp = selPair(), si = selIdx(), ftx = MV.plain(F(C1.fText(m)));
    if (pv) {
      V.show(pv.m, { view:"st", glow:pv.glow, hRing:pv.hRing, note:pv.note, smax:62, aria:"Structure after [O]: " + MV.plain(pv.txt) });
      return;
    }
    if (S.mode === "cls") {
      var cnt = fm.fam === "alcohol" && fm.cls ? C1.adj(m)[fm.c].filter(isC(m)) : [];
      V.show(m, { view:"st", atoms:atoms, bonds:bonds, selA:si, selB:sp, glow:fm.fam === "alcohol" ? fm.c : null, count:cnt, smax:62,
        aria:"Full structural formula of " + nm.name + ", " + ftx + (fm.fam === "alcohol" ? ". The C–OH carbon glows; its " + fm.nC + " carbon neighbour" + (fm.nC === 1 ? " is" : "s are") + " numbered." : ".") });
    } else {
      V.show(m, { view:S.view, atoms:atoms, bonds:bonds, selA:si, selB:sp, path:S.view === "st" ? nm.parent : null, smax:62,
        aria:(S.view === "3d" ? "3D ball-and-stick model of " : "Full structural formula of ") + nm.name + ", " + ftx + "." });
    }
  }
  function clsNote(){
    var m = mol(), fm = NM.fam(m);
    if (fm.fam === "alcohol") {
      if (!fm.cls) return "More than one OH: classify each C–OH carbon separately.";
      if (fm.methanol) return "The C–OH carbon (glowing) has <strong>no</strong> carbon neighbours, but three H. Methanol is treated as <strong>primary</strong>: it oxidizes like one.";
      return "The C–OH carbon (glowing) is bonded to <strong>" + fm.nC + "</strong> carbon" + (fm.nC > 1 ? "s" : "") + " (numbered): <strong>" + fm.cls + "</strong> alcohol.";
    }
    if (fm.fam === "ether") return "An ether has no C–OH carbon, so it has <strong>no class</strong>.";
    return "No O yet: tap a carbon and put the –OH there.";
  }
  function paintBars(vals){
    var box = $(".ao-bars", host), W = Math.round(box.getBoundingClientRect().width) || 600; barW = W;
    box.innerHTML = '<p class="ao-sub">Boiling points compared</p>' + barsHTML(barOverride ? barOverride.set : barSet(mol()), W, vals || (barOverride ? barOverride.vals : null)) +
      (NM.fam(mol()).fam === "alkane" ? '<p class="tiny muted">Put an O on the chain to compare an alcohol and an ether.</p>' : "");
  }
  function pCaption(L){
    var m = mol(), nm = NM.name(m).name, bp = bpOf(nm), v = solOf(nm), fm = NM.fam(m), gas = bp != null && bp < 20;
    var s = L.N + " molecules of " + nm + (fm.hb ? ": each O–H can hydrogen-bond to an O nearby." : fm.eth ? ": no O–H, so no hydrogen bonds between them." : ": no O–H, so no hydrogen bonds.");
    if (L.water) s += " " + (L.mix === "mix" ? "In water: it mixes completely." : L.mix === "none" ? "In water: it doesn’t mix (nonpolar), so it floats as a layer." : typeof v === "number" ? "In water: about " + v + " g dissolves in 100 mL; the rest forms a layer on top." : fm.eth ? "In water: water molecules can H-bond to the ether’s O, so some dissolves. (No value in the data table.)" : "In water: only partly (no value in the data table).");
    if (gas) s += " (" + nm + " boils at " + degC(bp) + ", so at room temperature it’s a gas. The box shows the cooled liquid.)";
    return s;
  }
  function paintBox(){
    var svgEl = $(".ao-psvg", host), W = Math.round($(".ao-pbox", host).getBoundingClientRect().width) || 600, H = W < 480 ? 300 : 340;
    var L = pLayout(mol(), S.water, W, H); PB.draw(L);
    svgEl.setAttribute("aria-label", "Particle view: " + MV.plain(pCaption(L)));
    $(".ao-pcap", host).textContent = pCaption(L);
    return L;
  }
  function paintRead(){
    var m = mol(), nm = NM.name(m).name, f = C1.formula(m), fm = NM.fam(m), bp = bpOf(nm), v = solOf(nm);
    var sol = v === "mix" || typeof v === "number" ? solTxt(v) : fm.fam === "alkane" ? '<span class="muted">doesn’t mix (nonpolar); no value in the data table</span>' : '<span class="muted">not in the data table</span>';
    $(".ao-read", host).innerHTML = MV.readoutHTML([["Name", "<strong>" + nm + "</strong>"], ["Formula", F(C1.fText(m))], ["Family and class", famTxt(fm)],
      ["H-bonds to itself?", fm.hb ? "yes (O–H)" : fm.eth ? "no: no O–H" : "no: no O–H (no O at all)"], ["Boiling point", bp != null ? degC(bp) : '<span class="muted">not in the data table</span>'],
      ["Solubility in water", sol], ["Isomers with this formula", isoTxt(f)]]);
  }
  function btn(act, label, why){ return '<button type="button" class="btn ghost sm" data-act="' + act + '" data-k="mn' + act + '"' + (why ? " disabled" : "") + ">" + label + "</button>" + (why ? '<span class="tiny muted ao-why">' + why + "</span>" : ""); }
  function paintMenu(){
    var m = mol(), h = C1.hc(m), sp = S.spec, n = sp.n, html = "";
    if (sel && sel.t === "c") {
      var c = sel.c, ai = idxOf(c), hasOH = sp.o && sp.o.oh === c;
      html += '<p class="ao-sub">' + (c === "m" ? "The methyl carbon" : "Carbon C" + (c + 1)) + "</p>";
      html += hasOH ? btn("rmo", "Remove the –OH") : btn("oh", sp.o ? "Move the O here as –OH" : "–OH here", h[ai] ? "" : "This carbon has no H left.");
      if (c === "m") html += btn("rmme", "Remove the methyl");
      else if (c > 0 && c < n - 1) html += sp.me === c ? btn("rmme", "Remove the methyl") : btn("me", sp.me != null ? "Move the methyl here" : "Methyl branch here", h[ai] ? "" : "This carbon has no H left for a methyl.");
      else html += '<p class="tiny muted">The methyl goes on an inner carbon: on an end carbon it would just make the chain longer.</p>';
    } else if (sel && sel.t === "o") {
      html += '<p class="ao-sub">The oxygen</p>' + btn("rmo", "Remove the O");
    } else if (sel && sel.t === "b") {
      html += '<p class="ao-sub">Bond ' + cLabel(sel.p[0]) + "–" + cLabel(sel.p[1]).replace("the ", "") + "</p>" + btn("eth", sp.o ? "Move the O here (ether)" : "O here (ether)");
    }
    MV.keepFocus($(".ao-menu", host), function(){ $(".ao-menu", host).innerHTML = html; });
    $(".ao-msg", host).textContent = msg || (!sel ? "Tap a carbon, a C–C bond or the O in the drawing." : "");
  }
  function paintCtrl(){
    var md = S.mode, oxOK = md !== "part";
    $(".ao-oxrow", host).hidden = !oxOK;
    $('[data-ox="go"]', host).hidden = !!pv; $('[data-ox="back"]', host).hidden = !pv;
    $$(".ao-oxrow button", host).forEach(function(b){ b.disabled = T.busy; });
    $(".ao-water", host).hidden = md !== "part";
    rng.value = S.spec.n; rng.disabled = T.busy; $(".ao-n", host).textContent = S.spec.n + " C";
  }
  function paint(){
    var md = S.mode, m = mol();
    $(".ao-molbox", host).hidden = md === "part"; $(".ao-pbox", host).hidden = md !== "part"; $(".ao-bars", host).hidden = md !== "prop" || !!pv;
    $(".ao-views", host).hidden = md !== "prop" || !!pv;
    paintCtrl();
    if (!pv) $(".ao-cap", host).innerHTML = F(condensed(m));
    if (md === "part") { PB.stop(); paintBox(); if (visible()) PB.start(); }
    else {
      PB.stop(); paintView();
      if (pv) { $(".ao-cap", host).innerHTML = pv.cap; $(".ao-note", host).innerHTML = pv.txt; }
      else $(".ao-note", host).innerHTML = md === "cls" ? clsNote() : "";
      if (md === "prop" && !pv) paintBars();
    }
    paintMenu(); paintRead();
    MV.changed();
  }
  function visible(){ var v = host.closest(".view"); return !v || !v.hidden; }
  if (window.ResizeObserver) new ResizeObserver(function(){
    if (T.busy) return;
    var w = Math.round($(".ao-left", host).getBoundingClientRect().width);
    if (!w) return;
    if (S.mode === "prop" && !pv && Math.abs(w - barW) > 4) paintBars();
    if (S.mode === "part") { var L = PB.layout(); if (L && Math.abs(L.W - w) > 4) paintBox(); }
  }).observe($(".ao-left", host));

  // ---------- predictions ----------
  function setState(sp, mode, o){
    o = o || {}; T.busy = false; pv = null; barOverride = null; S.spec = JSON.parse(JSON.stringify(sp)); S.mode = mode; modeRG.set(mode);
    if (o.water != null) { S.water = o.water; win.checked = o.water; }
    if (S.view === "3d") { S.view = "st"; viewRG.set("st"); }
    sel = null; msg = ""; api.save(); paint();
  }
  function tweenBars(a, b, dur, done){ MV.tween({ dur:dur, step:function(t){ paintBars(a.map(function(v, i){ return v == null || b[i] == null ? b[i] : v + (b[i] - v) * t; })); }, done:done }); }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState(SP.ethanol, "part", { water:false });
      else if (p.id === "p2") setState(SP.ethanol, "part", { water:true });
      else if (p.id === "p3") setState(SP.propan2ol, "cls");
      else setState(SP.tbutanol, "cls");
    },
    run:function(p, done){
      if (p.id === "p1") {
        var before = barSet(mol()).map(function(b){ return b.v; });
        T.busy = true; paintCtrl();
        PB.fadeHB(1000, function(){
          S.spec = JSON.parse(JSON.stringify(SP.dme)); api.save(); T.busy = false; paint(); T.busy = true; paintCtrl();
          MV.wait(900, function(){
            var set = barSet(mol()), after = set.map(function(b){ return b.v; });
            barOverride = { set:set, vals:before };
            T.busy = false; setMode("prop"); T.busy = true; paintCtrl();
            tweenBars(before, after, 1400, function(){ barOverride = null; T.busy = false; paint(); MV.wait(200, done); });
          });
        });
      } else if (p.id === "p2") {
        T.busy = true; paintCtrl();
        S.spec = JSON.parse(JSON.stringify(SP.butan1ol)); api.save();
        var W = PB.layout() ? PB.layout().W : 600, H = PB.layout() ? PB.layout().H : 340, L2 = pLayout(mol(), true, W, H);
        $(".ao-cap", host).innerHTML = F(condensed(mol()));
        PB.moveTo(L2, 1800, function(){ T.busy = false; paint(); MV.wait(200, done); });
      } else previewOx(done);
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var m = mol(), nm = NM.name(m).name, fm = NM.fam(m), f = C1.formula(m);
    if (id === "tc1") {
      if (nm === "butan-2-ol") return { ok:true };
      if (nm === "butan-1-ol" || nm === "2-methylpropan-1-ol") return { ok:false, msg:"Primary: the C–OH carbon is bonded to only one carbon." };
      if (nm === "2-methylpropan-2-ol") return { ok:false, msg:"Tertiary: bonded to three." };
      if (fm.fam !== "alcohol") return { ok:false, msg:"You built " + nm + ", which isn’t an alcohol. Put the O on a carbon as –OH." };
      return { ok:false, msg:"You built " + nm + ": " + f.C + " carbon" + (f.C > 1 ? "s" : "") + " in all. Use 4 carbons, and put the OH on a carbon bonded to two others." };
    }
    if (id === "tc2") {
      if (nm === "2-methoxypropane") return { ok:true };
      if (nm === "ethoxyethane") return { ok:false, msg:"Close. A branched ether is more compact." };
      if (nm === "2-methylpropan-2-ol") return { ok:false, msg:"The lowest alcohol, but any ether is lower: no H-bonds." };
      if (nm === "1-methoxypropane") return { ok:false, msg:"Straight-chain ether: higher than the branched one." };
      if (f.C !== 4 || f.O !== 1 || f.H !== 10) return { ok:false, msg:"That’s " + MV.plain(F(C1.fText(m))) + ", not C₄H₁₀O. Use 4 carbons in all and one O." };
      return { ok:false, msg:"An alcohol: its O–H hydrogen-bonds, so any ether boils lower. " + "(" + nm + " boils at " + MV.plain(degC(bpOf(nm))) + ".)" };
    }
    if (id === "tc3") {
      if (nm === "3-methylbutan-2-ol") return { ok:true };
      if (nm === "pentan-2-ol" || nm === "pentan-3-ol") return { ok:false, msg:"Ketone, yes, but the chain isn’t branched." };
      if (nm === "2-methylbutan-2-ol") return { ok:false, msg:"Tertiary: no oxidation." };
      if (nm === "3-methylbutan-1-ol" || nm === "2-methylbutan-1-ol" || nm === "pentan-1-ol") return { ok:false, msg:"Primary: you’d get an aldehyde." };
      if (fm.fam !== "alcohol") return { ok:false, msg:"You built " + nm + ", which isn’t an alcohol. Put the O on a carbon as –OH." };
      return { ok:false, msg:"You built " + nm + ": " + f.C + " carbon" + (f.C > 1 ? "s" : "") + " in all, counting the methyl. Use 5." };
    }
    return { ok:false };
  }
  MV.APP.onShow = (function(prev){ return function(v){ if (prev) prev(v); if (v === "explore" && S.mode === "part" && !T.busy) PB.start(); else PB.stop(); }; })(MV.APP.onShow);
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); }, repaint:paint };
}

// @component C3 mechanismStepper (from SCH4U 02) — step-through of a reaction with N13 Play / Step / Back: each step is a 2D
// structural frame and a caption. MV.player is rebuilt in a fresh child host for every reaction (calling MV.player twice on
// one host doubles its listeners). C3.stepper(host, {steps:[…], onStep(i)}) -> {go(i), get(), count}
var C3 = {
  stepper:function(host, o){
    host.innerHTML = ""; var box = document.createElement("div"); host.appendChild(box);
    var pl = MV.player(box, { count:o.steps.length, interval:1400, render:function(i){ o.onStep(i); }, label:function(i){ return "Step " + (i + 1) + " of " + o.steps.length; } });
    return { go:pl.go, get:pl.get, count:o.steps.length };
  }
};

// ---------- Part 3: Oxidizing alcohols ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, T = nameTable();
  if (s1.alcohols.indexOf(S.a1) < 0) S.a1 = "ethanol";
  if (s2.alcohols.indexOf(S.a2) < 0) S.a2 = "butan-2-ol";
  S.st1 = S.st1 || 0; S.c3 = S.c3 || s3.cases[0].id;
  var busy = false, l1msg = "", dh = null, step2 = 0, stp = null;
  function molOf(nm){ return specMol(T[nm]); }
  host.innerHTML = '<div class="part ao-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="ao-pick1"></div>' +
    '<div class="ao-lad"><ol class="ao-rungs" aria-label="Oxidation ladder"></ol><div class="ao-l1"><div class="ao-l1mol"></div><p class="ao-eqn" aria-live="polite"></p></div></div>' +
    '<div class="q-actions"><button type="button" class="btn primary" data-l1="ox" data-k="l1ox">[O]</button><button type="button" class="btn ghost sm" data-l1="reset" data-k="l1reset">Start again</button></div>' +
    '<p class="ao-l1msg" aria-live="polite"></p><details class="alg ao-zoom" open><summary>Zoom to the particles</summary><p>' + s1.zoom + '</p><p class="ao-zc" aria-live="polite"></p></details></div>' +
    '<div class="part ao-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="ao-pick2"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary" data-l2="go" data-k="l2go">Acid catalyst + heat</button></div>' +
    '<div class="ao-l2mol"></div><div class="ao-l2step"></div><p class="ao-l2cap" aria-live="polite"></p><dl class="read ao-l2read" aria-live="polite"></dl><p class="refresh">' + s2.reverse + "</p></div>" +
    '<div class="part ao-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="ao-pick3"></div><div class="ao-case" aria-live="polite"></div></div>';
  var V1 = C1.view($(".ao-l1mol", host), { w:560, h:300 }), V2 = C1.view($(".ao-l2mol", host), { w:720, h:270 });
  radios($(".ao-pick1", host), { label:"Alcohol", aria:"Alcohol for the oxidation ladder", cls:"chips", options:s1.alcohols.map(function(a){ return { id:a, t:a }; }), value:S.a1, onChange:function(v){ if (busy) return; S.a1 = v; S.st1 = 0; l1msg = ""; api.save(); paint1(); } });
  radios($(".ao-pick2", host), { label:"Alcohol", aria:"Alcohol to dehydrate", cls:"chips", options:s2.alcohols.map(function(a){ return { id:a, t:a }; }), value:S.a2, onChange:function(v){ S.a2 = v; dh = null; api.save(); paint2(); } });
  radios($(".ao-pick3", host), { aria:"Case", cls:"chips", options:s3.cases.map(function(c){ return { id:c.id, t:c.t }; }), value:S.c3, onChange:function(v){ S.c3 = v; api.save(); paint3(); } });

  // station 1: oxidation ladder
  function lad(){ return ladderOf(molOf(S.a1)); }
  function cls(m){ var fm = NM.fam(m); return fm.cls || ""; }
  function famWord(m){ var fm = NM.fam(m); return fm.fam === "alcohol" ? fm.cls + " alcohol" : fm.fam; }
  function paint1(){
    var L = lad(), st = clamp(S.st1, 0, L.length - 1), m0 = L[0], c = NM.fam(m0).c, cur = L[st], h = C1.hc(cur);
    S.st1 = st;
    var rungs = L.map(function(m, i){
      if (i > st) return i === st + 1 ? '<li class="ao-rung next"><span class="ao-rn">?</span><span>press [O]</span></li>' : "";
      return '<li class="ao-rung' + (i === st ? " cur" : "") + '"><span class="ao-rn">' + (i ? "[O] ×" + i : "start") + "</span><span><strong>" + NM.name(m).name + "</strong> · " + famWord(m) + '<br><span class="ao-cf">' + F(condensed(m)) + "</span></span></li>";
    }).join("");
    if (st === L.length - 1 && S.tried) rungs += '<li class="ao-rung stop"><span class="ao-rn">[O]</span><span>' + (L.length === 1 ? "no reaction: no H on the C–OH carbon" : "stops here: no H left on that carbon") + "</span></li>";
    $(".ao-rungs", host).innerHTML = rungs;
    if (!busy) V1.show(cur, { view:"st", hRing:c, glow:c, smax:60, aria:"Full structural formula of " + NM.name(cur).name + ". The carbon that held the OH glows; its H atoms are ringed: " + h[c] + "." });
    $(".ao-eqn", host).innerHTML = st ? F(condensed(L[st - 1])) + " + [O] → " + F(condensed(cur)) + (st === 1 ? " + " + F("H2O") : "") : F(condensed(cur)) + " (" + cls(m0) + ")";
    $(".ao-zc", host).innerHTML = "H atoms on the " + (st ? "carbon that held the OH" : "C–OH carbon") + " (ringed): <strong>" + h[c] + "</strong>" + (st ? " (it started with " + C1.hc(m0)[c] + ")" : "") + ".";
    $(".ao-l1msg", host).innerHTML = l1msg;
    $$("[data-l1]", host).forEach(function(b){ b.disabled = busy; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-l1]"); if (!b || b.disabled || busy) return;
    if (b.dataset.l1 === "reset") { S.st1 = 0; S.tried = false; l1msg = ""; api.save(); paint1(); return; }
    var L = lad(), st = S.st1, c = NM.fam(L[0]).c;
    if (st >= L.length - 1) {
      S.tried = true; api.save();
      l1msg = L.length === 1 ? "No reaction. " + NM.name(L[0]).name + " is tertiary: the C–OH carbon has no H to lose." : L.length === 2 && NM.fam(L[1]).fam === "ketone" ? "No further reaction. The ketone’s C=O carbon has no H left, so it stops here." : "No further reaction with mild [O]: the carboxylic acid’s carbon has no H left.";
      paint1();
      if (L.length === 1) V1.show(L[0], { view:"st", glow:c, note:{ i:c, t:"no H here" }, smax:60, aria:"No reaction: the C–OH carbon has no H." });
      return;
    }
    busy = true; l1msg = ""; paint1();
    var A = L[st], B = L[st + 1];
    V1.anim(C1.layout2d(A), C1.layout2d(B), { smax:60, aria:NM.name(A).name + " + [O] gives " + NM.name(B).name + "." }, 1300, function(){
      busy = false; S.st1 = st + 1; S.tried = false;
      l1msg = st === 0 ? (NM.fam(B).fam === "ketone" ? "Secondary → ketone: the O–H hydrogen and one C–H hydrogen left as water, and C=O formed in the chain." : "Primary → aldehyde: the O–H hydrogen and one C–H hydrogen left as water. The C=O carbon still has an H, so it can go on.") : "Aldehyde → carboxylic acid: the last C–H became C–OH.";
      api.save(); paint1(); MV.changed();
    });
  });

  // station 2: dehydration (C3 stepper)
  function frames(m, d){
    var A = C1.adj(m), h = C1.hc(m), c = d.c, o = d.o, nm = NM.name(m).name, base = C1.layout2d(m), out = [], L = function(i){ return NM.name(m).parent.indexOf(i) + 1; };
    var nb = A[c].filter(function(j){ return m.a[j].el === "C" && h[j]; });
    var ring0 = {}; ring0["a" + o] = "s"; ring0["h" + o + ".0"] = "s"; nb.forEach(function(j){ for (var q = 0; q < h[j]; q++) ring0["h" + j + "." + q] = "d"; });
    out.push({ sc:base, ring:ring0, cap:nm + ". The OH is on C" + L(c) + ". Its neighbouring carbon" + (nb.length > 1 ? "s " : " ") + nb.map(function(j){ return "C" + L(j); }).join(" and ") + (nb.length > 1 ? " carry" : " carries") + " H (dashed rings)." });
    d.paths.forEach(function(p){
      if (p.dup) return;
      var same = d.paths.filter(function(q){ return q.dup && q.name === p.name; }).map(function(q){ return "C" + L(q.n); });
      var hid = "h" + p.n + "." + (h[p.n] - 1), sc = { atoms:base.atoms.map(function(a){ var x = Object.assign({}, a); if (a.id === "a" + o || a.id === "h" + o + ".0" || a.id === hid) x.op = 0.25; return x; }), bonds:base.bonds, view:"st" };
      var ao = sc.atoms[C1.atomByI(sc, o)], mx = Math.min.apply(null, sc.atoms.map(function(a){ return a.y; }));
      sc.atoms.push({ id:"w", el:"W", lbl:"H2O", x:ao.x, y:mx - 0.9, i:-2, par:-1 });
      var rg = {}; rg[hid] = "s"; rg["a" + o] = "s";
      out.push({ sc:sc, ring:rg, cap:"Water leaves: the OH from C" + L(c) + " and an H from C" + L(p.n) + "." });
      var ps = C1.layout2d(p.prod), rg2 = {}; rg2["a" + c] = "s"; rg2["a" + p.n] = "s";
      out.push({ sc:ps, ring:rg2, cap:"A C=C forms between C" + L(c) + " and C" + L(p.n) + ": <strong>" + p.name + "</strong>." + (same.length ? " An H from " + same.join(" or ") + " gives the same " + p.name + "." : "") });
    });
    return out;
  }
  function paint2(){
    var m = molOf(S.a2), d = dehydrate(m);
    var rows = [["Alcohol", "<strong>" + S.a2 + "</strong> · " + famWord(m)]];
    if (!dh) {
      $(".ao-l2step", host).innerHTML = ""; $(".ao-l2cap", host).innerHTML = "Press <strong>Acid catalyst + heat</strong> to dehydrate it.";
      V2.show(m, { view:"st", smax:60, aria:"Full structural formula of " + S.a2 + "." });
      rows.push(["Possible alkenes", '<span class="muted">dehydrate it to find out</span>']);
    } else {
      var fr = dh.frames[step2];
      V2.show(m, { view:"st", scene:fr.sc, ring:fr.ring, smax:60, aria:"Step " + (step2 + 1) + " of " + dh.frames.length + ": " + MV.plain(fr.cap) });
      $(".ao-l2cap", host).innerHTML = fr.cap;
      var end = step2 === dh.frames.length - 1;
      rows.push(["Possible alkenes", end ? d.names.join(" and ") + (d.names.length === 1 ? " (only one)" : "") : '<span class="muted">step to the end</span>']);
      rows.push(["Reaction type", "elimination (dehydration): " + F(C1.fText(m)) + " → alkene + " + F("H2O")]);
      if (end) rows.push(["Reverse (hydration, module 02)", d.paths.filter(function(p){ return !p.dup; }).map(function(p){ var hy = hydrate(p.prod); return p.name + " + " + F("H2O") + " → " + (hy.length > 1 ? "a mixture of " + hy.join(" and ") : "mainly " + hy[0]) + (hy.indexOf(S.a2) < 0 ? " (Markovnikov: not " + S.a2 + ")" : ""); }).join("<br>")]);
    }
    $(".ao-l2read", host).innerHTML = MV.readoutHTML(rows);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-l2]"); if (!b) return;
    var m = molOf(S.a2), d = dehydrate(m);
    var me = dh = { frames:frames(m, d) }; step2 = 0;
    stp = C3.stepper($(".ao-l2step", host), { steps:dh.frames, onStep:function(i){ step2 = i; paint2(); } });
    (function nx(i){ if (dh !== me || (i > 0 && stp.get() !== i - 1)) return; if (i < me.frames.length) { stp.go(i); MV.wait(1300, function(){ nx(i + 1); }); } })(0);
  });

  // station 3: STSE cases
  function paint3(){
    var c = s3.cases.filter(function(x){ return x.id === S.c3; })[0] || s3.cases[0], L = ladderOf(molOf(c.alc)).slice(0, c.steps + 1);
    $(".ao-case", host).innerHTML = "<p>" + c.html + '</p><ol class="ao-strip" aria-label="Oxidation steps">' + L.map(function(m, i){ return "<li>" + (i ? '<span class="ao-arr" aria-hidden="true">→ [O] →</span>' : "") + "<span><strong>" + NM.name(m).name + "</strong><br>" + F(condensed(m)) + "</span></li>"; }).join("") + "</ol>";
  }
  paint1(); paint2(); paint3();
}

// ---------- Practice 2: Predict and name (chips and N7 select-all) ----------
function predictAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, picks:{}, tries:0, hint:0, solved:false, first:null }); }
  function useBox(it){ return it.useBp ? MV.usesHTML(" C₄H₁₀O boiling points (°C): " + it.useBp.map(function(nm){ return nm + " " + MV.chem.fx(bpOf(nm), 0); }).join(" · ") + ".") : ""; }
  function itemHTML(it, i){
    var x = ist(it.id), all = it.kind === "all", h = '<div class="q" data-pi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + useBox(it) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="chips ao-pchips" role="' + (all ? "group" : "radiogroup") + '" aria-label="' + (all ? "Choices (select all that apply)" : "Choices") + '">' + it.options.map(function(o, k){
      var on = all ? !!x.picks[k] : x.pick === k;
      return '<button type="button" role="' + (all ? "checkbox" : "radio") + '" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + (all ? (on ? "☑ " : "☐ ") : "") + o.t + "</button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>";
    h += MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (all ? "" : ": " + it.options[x.pick].t) + ".</strong> " + (all ? it.why : it.options[x.pick].why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
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
    if (b.dataset.op != null) { var k = +b.dataset.op; if (it.kind === "all") x.picks[k] = !x.picks[k]; else x.pick = k; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var ok, fb;
      if (it.kind === "all") {
        if (!it.options.some(function(_, k){ return x.picks[k]; })) { msgs[it.id] = "Select at least one alkene first."; paint(); return; }
        ok = it.options.every(function(o, k){ return !!x.picks[k] === MV.ok(o); });
        if (!ok) { var bad = it.options.filter(function(o, k){ return x.picks[k] && !MV.ok(o); }).map(function(o){ return o.t + ": " + o.why; }), miss = it.options.some(function(o, k){ return !x.picks[k] && MV.ok(o); }); fb = bad.join(" ") + (miss ? (bad.length ? " " : "") + (it.missing || "One more belongs in your selection.") : ""); }
      } else {
        if (x.pick == null) { msgs[it.id] = "Choose an answer first."; paint(); return; }
        ok = MV.ok(it.options[x.pick]); fb = it.options[x.pick].why;
      }
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = fb; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pi="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// @component C1 moleculeBuilder (free mode) — tap an atom or bond, then: add C / add O, remove an end atom, change C ⇄ O,
// put an O into a C–C bond, take an O out, single ⇄ double; valence checked (C 4, O 2), H filled in; main chain = longest
// heavy-atom path for the 2D layout. Used by the performance task below.
// ---------- Performance task: Branched and oxidizable (free C/H/O builder, valence checked) ----------
var VALID4 = ["2-methylbutan-1-ol", "3-methylbutan-1-ol", "3-methylbutan-2-ol", "2,2-dimethylpropan-1-ol"];
function branched(m){
  var A = C1.adj(m), skel = function(j){ return m.a[j].el === "C" || (m.a[j].el === "O" && A[j].filter(isC(m)).length === 2); };
  return m.a.some(function(a, i){ return a.el === "C" && A[i].filter(skel).length >= 3; });
}
var task = (function(){
  var S = null, api = null, V = null, sel = null, msg = "", MAXA = 9;
  function fresh(){ return { a:["C", "C", "C", "C", "C"], b:[[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1]] }; }
  function mol(){ var m = { a:S.mol.a.map(function(el){ return { el:el }; }), b:S.mol.b.map(function(b){ return b.slice(); }), main:[] }; m.main = longestHeavy(m); return m; }
  function read(){
    if (!S) return { l:[false, false, false, false] };
    var m = mol(), f = C1.formula(m), A = C1.adj(m), h = C1.hc(m), nm = NM.name(m).name, multi = m.b.some(function(b){ return b[2] > 1; });
    var ohs = m.a.map(function(_, i){ return i; }).filter(function(i){ return m.a[i].el === "O" && h[i] >= 1; });
    var l3 = ohs.some(function(o){ return A[o].some(function(c){ return m.a[c].el === "C" && h[c] >= 1 && C1.order(m, o, c) === 1; }); });
    return { m:m, name:nm, f:f, fm:NM.fam(m), l:[f.C === 5 && f.H === 12 && f.O === 1 && !multi, ohs.length > 0, l3, branched(m)] };
  }
  function semOK(){ if (sel && sel.k === "a" && sel.i >= S.mol.a.length) sel = null; if (sel && sel.k === "b" && sel.i >= S.mol.b.length) sel = null; }
  function setMol(nm, note, nsel){ S.mol = nm; sel = nsel === undefined ? sel : nsel; msg = note || ""; semOK(); api.save(); paint(); api.update(); }
  function cpy(){ return { a:S.mol.a.slice(), b:S.mol.b.map(function(b){ return b.slice(); }) }; }
  function label(kind, i){
    var m = mol(), h = C1.hc(m);
    if (kind === "a") { var el = m.a[i].el; return (el === "C" ? "Carbon" : "Oxygen") + " " + (i + 1) + ", " + el + (h[i] ? "H" + (h[i] > 1 ? h[i] : "") : "") + (sel && sel.k === "a" && sel.i === i ? ", selected" : "") + ". Select it for the builder buttons."; }
    var b = m.b[i]; return "Bond between atom " + (b[0] + 1) + " (" + m.a[b[0]].el + ") and atom " + (b[1] + 1) + " (" + m.a[b[1]].el + "), " + (b[2] === 2 ? "double" : "single") + ". Select it for the builder buttons.";
  }
  function act(a){
    var m = mol(), nm = cpy(), A = C1.adj(m);
    if (a === "reset") { setMol(fresh(), "Started again: a 5-carbon chain (pentane).", null); return; }
    if (!sel) return;
    if (sel.k === "a") {
      var i = sel.i, el = m.a[i].el;
      if (a === "addC" || a === "addO") { nm.a.push(a === "addC" ? "C" : "O"); nm.b.push([i, nm.a.length - 1, 1]); setMol(nm, (a === "addC" ? "Added a C" : "Added an O (–OH)") + " on atom " + (i + 1) + ".", { k:"a", i:nm.a.length - 1 }); return; }
      if (a === "rm") {
        var bk = nm.b.filter(function(b){ return b[0] !== i && b[1] !== i; }).map(function(b){ return [b[0] > i ? b[0] - 1 : b[0], b[1] > i ? b[1] - 1 : b[1], b[2]]; });
        nm.a.splice(i, 1); nm.b = bk; setMol(nm, "Removed atom " + (i + 1) + ".", null); return;
      }
      if (a === "toO" || a === "toC") { nm.a[i] = a === "toO" ? "O" : "C"; setMol(nm, "Atom " + (i + 1) + " is now " + (a === "toO" ? "O" : "C") + "."); return; }
      if (a === "outO") {
        var nb = A[i]; var bk2 = nm.b.filter(function(b){ return b[0] !== i && b[1] !== i; }); bk2.push([nb[0], nb[1], 1]);
        bk2 = bk2.map(function(b){ return [b[0] > i ? b[0] - 1 : b[0], b[1] > i ? b[1] - 1 : b[1], b[2]]; });
        nm.a.splice(i, 1); nm.b = bk2; setMol(nm, "O taken out: its two carbons are joined again.", null); return;
      }
    } else {
      var k = sel.i, b = nm.b[k];
      if (a === "single" || a === "double") { b[2] = a === "double" ? 2 : 1; setMol(nm, "The bond is now " + a + "."); return; }
      if (a === "insO") { nm.a.push("O"); var o = nm.a.length - 1; nm.b.splice(k, 1, [b[0], o, 1], [o, b[1], 1]); setMol(nm, "O put into the bond: C–O–C.", { k:"a", i:o }); return; }
    }
  }
  function btn(a, t, why){ return '<button type="button" class="btn ghost sm" data-tk="' + a + '" data-k="tk' + a + '"' + (why ? ' disabled title="' + esc(why) + '"' : "") + ">" + t + "</button>"; }
  function paintMenu(){
    var m = mol(), h = C1.hc(m), A = C1.adj(m), n = m.a.length, html = "", why = [];
    if (sel && sel.k === "a") {
      var i = sel.i, el = m.a[i].el, fr = C1.free(m, i) > 0, leaf = A[i].length <= 1, nC = m.a.filter(function(a){ return a.el === "C"; }).length;
      html += '<p class="ao-sub">Atom ' + (i + 1) + ": " + (el === "C" ? "carbon" : "oxygen") + "</p>";
      html += btn("addC", "Add C here", !fr ? "no free bond" : n >= MAXA ? "atom limit" : "") + btn("addO", "Add O here", !fr ? "no free bond" : n >= MAXA ? "atom limit" : "") + btn("rm", "Remove this atom", leaf && n > 1 && !(el === "C" && nC === 1) ? "" : "only an end atom");
      if (el === "C") html += btn("toO", "Change to O", A[i].length <= 2 && C1.free(m, i) >= 2 && nC > 1 ? "" : "O makes only 2 bonds");
      else html += btn("toC", "Change to C", "");
      if (el === "O" && A[i].length === 2) html += btn("outO", "Take the O out", "");
      if (!fr) why.push("This atom has no free bond left: C makes 4 bonds, O makes 2.");
      if (n >= MAXA) why.push("The builder holds up to " + MAXA + " C and O atoms.");
    } else if (sel && sel.k === "b") {
      var b = m.b[sel.i], ok2 = C1.free(m, b[0]) >= 1 && C1.free(m, b[1]) >= 1;
      html += '<p class="ao-sub">Bond: atom ' + (b[0] + 1) + " (" + m.a[b[0]].el + ")–atom " + (b[1] + 1) + " (" + m.a[b[1]].el + ")</p>";
      html += btn("single", "Single", b[2] === 1 ? "already single" : "") + btn("double", "Double", b[2] === 2 ? "already double" : ok2 ? "" : "valence");
      if (m.a[b[0]].el === "C" && m.a[b[1]].el === "C" && b[2] === 1) html += btn("insO", "Put an O into this bond", n >= MAXA ? "atom limit" : "");
      if (b[2] === 1 && !ok2) why.push("A double bond needs a free bond on both atoms.");
    } else html += '<p class="tiny muted">Tap an atom or a bond in the builder.</p>';
    html += '<div class="ao-tkr">' + btn("reset", "Start again", "") + "</div>";
    MV.keepFocus($("#ao-tkmenu"), function(){ $("#ao-tkmenu").innerHTML = html + (why.length ? '<p class="tiny muted">' + why.join(" ") + "</p>" : ""); });
    $("#ao-tkmsg").textContent = msg;
  }
  function paint(){
    var d = read(), m = d.m, atoms = m.a.map(function(_, i){ return i; }), bonds = m.b.map(function(_, i){ return i; });
    V.show(m, { view:"st", atoms:atoms, bonds:bonds, selA:sel && sel.k === "a" ? sel.i : null, selB:sel && sel.k === "b" ? [m.b[sel.i][0], m.b[sel.i][1]] : null, smax:56,
      aria:"Your molecule: " + (d.name || "no carbon") + ", " + MV.plain(F(C1.fText(m))) + "." });
    $("#ao-tkread").innerHTML = MV.readoutHTML([["Name", "<strong>" + (d.name || "—") + "</strong>"], ["Formula", F(C1.fText(m))], ["Family and class", famTxt(d.fm)],
      ["Carbon skeleton", d.l[3] ? "branched" : "straight"], ["H-bonds to itself?", d.l[1] ? "yes (O–H)" : "no: no O–H"]]);
    paintMenu();
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (!S.mol || !S.mol.a || !S.mol.a.length) S.mol = fresh();
      inp.innerHTML = '<h4 class="ao-h4">Builder</h4><div id="ao-tkview"></div><p id="ao-tkmsg" class="ao-msg" aria-live="polite"></p><div id="ao-tkmenu" class="ao-menu" role="group" aria-label="Builder buttons"></div>';
      pv.innerHTML = '<h4 class="ao-h4">Your molecule</h4><dl class="read" id="ao-tkread" aria-live="polite"></dl>';
      V = C1.view($("#ao-tkview"), { w:520, h:300, onPick:function(kind, i){ sel = { k:kind, i:i }; msg = ""; paint(); }, label:label });
      $("#ao-tkmenu").addEventListener("click", function(e){ var b = e.target.closest("[data-tk]"); if (!b || b.disabled) return; act(b.dataset.tk); var f = $('#ao-tkmenu [data-k="' + b.dataset.k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); });
      var chk = document.getElementById("task-check");
      if (chk) chk.addEventListener("click", function(){
        setTimeout(function(){
          var st = MV.taskState(), all = VALID4.every(function(k){ return st.found.indexOf(k) >= 0; }), fb = $("#task-fb .fb.good");
          if (all && fb) { var ps = fb.querySelectorAll("p"); var p = ps[1] || document.createElement("p"); p.innerHTML = "You’ve found all four: " + VALID4.join("; ") + ". " + a.content.allFound; if (!ps[1]) fb.appendChild(p); }
        }, 0);
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return d.l; },
    key:function(d){ return d.name; }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ predict:predictAct },
  task:task
});
})();
