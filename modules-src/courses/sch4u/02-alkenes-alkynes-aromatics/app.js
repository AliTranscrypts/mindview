// SCH4U 02 Alkenes, Alkynes and Aromatics: hero (ethene + Br₂, then benzene), Multiple-bond lab (Explore: C1 + C2 + C3),
// bromine-water test stations (Part 3), "Name it" and "Predict the product" sets, "Tertiary target" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, num = MV.num, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }

// @component radioGroup (from MHF4U 25, via SCH4U 01) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock). Here options may be disabled: radios(host, {…, disabled(id) -> reason | ""}).
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

// @component C1 moleculeView — molecule model with bond orders (single, double, triple, aromatic = 4), implicit H, iso check
// that compares bond orders, condensed formulas with = and ≡, 2D full structural layout (double and triple lines), a 3D
// ball-and-stick model with VSEPR geometry (sp³ 109.5°, sp² 120° and planar, sp 180° and linear), angle markers, torsion about
// a bond (rotation test), morphs, and tap-to-select atom AND bond buttons over the drawing (Tab, arrow keys, Enter).
// Extends SCH4U 01's C1 (alkanes) with multiple bonds; 01's line/condensed 2D views and H-environment symmetry are left out here.
//   C1.mol({n, bo:[orders of chain bonds], me:null | carbon index for one methyl}) -> {a:[{el, root?, add?, open?}], b:[[i, j, order]], main}
//   C1.clone · adj · bondOf(m, i, j) · order(m, i, j) · hc(m) · formula(m) · fText(m) · iso(m1, m2) · over(m) (index of an over-bonded atom, or −1)
//   C1.geo(m, i) 1 linear | 2 trigonal | 3 tetrahedral · C1.condensed(m, path) "CH2=CHCH3" (for MV.chem.f)
//   C1.layout2d(m) / C1.scene3(m) scenes; C1.svg2d / C1.svg3d strings; C1.morph(A, B) -> t => scene; C1.fit2 / fit3
//   C1.view(host, {w, h, rotate, onPick(kind "a"|"b", index, keyboard), label(kind, index)}) -> {show(m, o), render(), stop(), rot}
//     o = {view:"st"|"3d", scene (optional prebuilt), atoms:[pickable atom idx], bonds:[pickable bond idx], selA, selB, path (locants),
//          mark (atom idx outlined in --pen), newIds:{sceneId:1}, angle:[atom idx], tor:{i, j, deg}, aria}
var C1 = (function(){
  var VAL = { C:4, H:1, F:1, Cl:1, Br:1, I:1, O:2 };
  function val(o){ return o === 4 ? 1.5 : o; }
  function mol(sp){
    var m = { a:[], b:[], main:[] }, i;
    for (i = 0; i < sp.n; i++) { m.a.push({ el:"C" }); m.main.push(i); if (i) m.b.push([i - 1, i, (sp.bo && sp.bo[i - 1]) || 1]); }
    if (sp.me != null) { m.a.push({ el:"C", root:sp.me, sub:0 }); m.b.push([sp.me, sp.n, 1]); }
    return m;
  }
  function clone(m){ return { a:m.a.map(function(x){ return Object.assign({}, x); }), b:m.b.map(function(x){ return x.slice(); }), main:m.main.slice() }; }
  function adj(m){ if (!m._A) { var L = m.a.map(function(){ return []; }); m.b.forEach(function(b){ L[b[0]].push(b[1]); L[b[1]].push(b[0]); }); m._A = L; } return m._A; }
  function bondOf(m, i, j){ for (var k = 0; k < m.b.length; k++) { var b = m.b[k]; if ((b[0] === i && b[1] === j) || (b[0] === j && b[1] === i)) return k; } return -1; }
  function order(m, i, j){ var k = bondOf(m, i, j); return k < 0 ? 0 : (m.b[k][2] || 1); }
  function used(m){ var s = m.a.map(function(a){ return a.open || 0; }); m.b.forEach(function(b){ s[b[0]] += val(b[2] || 1); s[b[1]] += val(b[2] || 1); }); return s; }
  function hc(m){ if (!m._h) { var s = used(m); m._h = m.a.map(function(a, i){ return Math.max(0, Math.round((VAL[a.el] || 0) - s[i])); }); } return m._h; }
  function over(m){ var s = used(m); for (var i = 0; i < m.a.length; i++) if (s[i] > (VAL[m.a[i].el] || 0) + 1e-9) return i; return -1; }
  function formula(m){ var f = { C:0, H:0 }, h = hc(m); m.a.forEach(function(a, i){ f[a.el] = (f[a.el] || 0) + 1; f.H += h[i]; }); return f; }
  function fText(m){ var f = formula(m), s = ""; ["C", "H", "Br", "Cl", "F", "I", "O"].forEach(function(e){ if (f[e]) s += e + (f[e] > 1 ? f[e] : ""); }); return s; }
  function geo(m, i){
    if (m.a[i].el !== "C") return 3;
    var d = 0, t = false; m.b.forEach(function(b){ if (b[0] === i || b[1] === i) { if (b[2] === 3) t = true; if (b[2] === 2) d++; if (b[2] === 4) d += 0.5; } });
    return t || d >= 2 ? 1 : d >= 1 ? 2 : 3;
  }

  // ---------- iso (colour refinement + individualization; bond orders count) ----------
  function rank(arr){ var u = arr.slice().sort(), map = {}, k = 0; u.forEach(function(s){ if (!(s in map)) map[s] = k++; }); return arr.map(function(s){ return map[s]; }); }
  function refine(G, col){
    var k = Math.max.apply(null, col);
    for (;;) {
      var nc = rank(col.map(function(c, i){ return c + "|" + G[i].map(function(e){ return col[e[0]] + "." + e[1]; }).sort().join(","); })), k2 = Math.max.apply(null, nc);
      if (k2 === k) return nc; col = nc; k = k2;
    }
  }
  function search(G, col, n1){
    col = refine(G, col);
    var cnt = {}, i, c, best = -1;
    for (i = 0; i < col.length; i++) { var e = cnt[col[i]] || (cnt[col[i]] = [0, 0]); e[i < n1 ? 0 : 1]++; }
    for (c in cnt) { if (cnt[c][0] !== cnt[c][1]) return false; if (cnt[c][0] > 1 && (best < 0 || cnt[c][0] < cnt[best][0])) best = +c; }
    if (best < 0) {
      var pos = {}; for (i = n1; i < col.length; i++) pos[col[i]] = i;
      for (i = 0; i < n1; i++) for (var k = 0; k < G[i].length; k++) { var ed = G[i][k], pj = pos[col[ed[0]]]; if (!G[pos[col[i]]].some(function(f){ return f[0] === pj && f[1] === ed[1]; })) return false; }
      return true;
    }
    var u = col.indexOf(best), fresh = Math.max.apply(null, col) + 1;
    for (var v = n1; v < col.length; v++) if (col[v] === best) { var c2 = col.slice(); c2[u] = fresh; c2[v] = fresh; if (search(G, c2, n1)) return true; }
    return false;
  }
  function graph(m, off){ var L = m.a.map(function(){ return []; }); m.b.forEach(function(b){ var o = b[2] || 1; L[b[0]].push([b[1] + off, o]); L[b[1]].push([b[0] + off, o]); }); return L; }
  function iso(m1, m2){
    var n1 = m1.a.length; if (n1 !== m2.a.length) return false;
    var h1 = hc(m1), h2 = hc(m2), G = graph(m1, 0).concat(graph(m2, n1));
    return search(G, rank(m1.a.map(function(a, i){ return a.el + h1[i]; }).concat(m2.a.map(function(a, i){ return a.el + h2[i]; }))), n1);
  }

  // ---------- condensed formula along a path ----------
  function condensed(m, path){
    if (!path || !path.length) return null;
    var A = adj(m), h = hc(m), on = {};
    function hasOH(i){ return A[i].some(function(j){ return m.a[j].el === "O"; }); }
    path = path.slice(); if (path.length > 1 && hasOH(path[0]) && !hasOH(path[path.length - 1])) path.reverse();
    path.forEach(function(i){ on[i] = 1; });
    var cBr = m.a.some(function(a, i){ return a.el === "C" && !on[i]; });
    function hs(i){ return h[i] ? "H" + (h[i] > 1 ? h[i] : "") : ""; }
    function branch(r, from){ var s = "", prev = from, cur = r; for (;;) { s += "C" + hs(cur); var nx = A[cur].filter(function(y){ return y !== prev; }); if (!nx.length) return s; if (nx.length > 1) return s + "…"; prev = cur; cur = nx[0]; } }
    return path.map(function(i, k){
      var hal = {}, br = {}, brOrder = [], oh = 0, inner = k > 0 && k < path.length - 1;
      A[i].forEach(function(j){ if (on[j]) return; var el = m.a[j].el; if (el === "C") { var t = branch(j, i); if (!br[t]) { br[t] = 0; brOrder.push(t); } br[t]++; } else if (el === "O") oh++; else hal[el] = (hal[el] || 0) + 1; });
      var s = (k ? ({ 2:"=", 3:"≡" }[order(m, path[k - 1], i)] || "") : "") + "C" + hs(i), hl = Object.keys(hal).sort().map(function(e){ return e + (hal[e] > 1 ? hal[e] : ""); });
      if ((cBr || oh) && inner) s += hl.map(function(x){ return "(" + x + ")"; }).join(""); else s += hl.join("");
      brOrder.forEach(function(t){ s += "(" + t + ")" + (br[t] > 1 ? br[t] : ""); });
      if (oh) s += inner || (k === 0 && path.length > 1) ? "(OH)" : "OH";
      return s;
    }).join("");
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
  function parOf(m, i){ var a = m.a[i]; if (a.root != null) return a.root; var l = adj(m)[i].filter(function(j){ return j < i; }); return l.length ? l[0] : -1; }
  function layout2d(m){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main, N = main.length, onMain = {}, i;
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
    for (i = 0; i < n; i++) atoms.push({ id:"a" + i, el:m.a[i].el, x:P[i][0], y:P[i][1], i:i, par:parOf(m, i), add:m.a[i].add });
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

  // ---------- 3D coordinates (VSEPR: tetrahedral, trigonal planar, linear), main chain zig-zag, then aligned ----------
  function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function crs(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a){ return Math.hypot(a[0], a[1], a[2]); }
  function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function perp(u){ var p = crs(u, [0, 0, 1]); if (len(p) < 1e-6) p = crs(u, [0, 1, 0]); return nrm(p); }
  var TET = [nrm([1, 1, 1]), nrm([1, -1, -1]), nrm([-1, 1, -1]), nrm([-1, -1, 1])];
  var CC = { 1:1.54, 2:1.34, 3:1.2, 4:1.4 }, XL = { H:1.09, Br:1.94, Cl:1.77, F:1.35, I:2.14, O:1.43 };
  function pair(u1, u2){ var b = nrm(add(u1, u2)), c = nrm(crs(u1, u2)); return [add(mul(b, -0.5774), mul(c, 0.8165)), add(mul(b, -0.5774), mul(c, -0.8165))]; }
  function scene3(m, opt){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main, onMain = {}, done = {}, q = [], Hs = [], i;
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
    function bl(x, j){ var e1 = m.a[x].el, e2 = m.a[j].el; if (e1 === "C" && e2 === "C") return CC[order(m, x, j)] || 1.54; return XL[e1 === "C" ? e2 : e1] || 1.5; }
    var s0 = main.length ? main[0] : 0;
    P[s0] = [0, 0, 0]; done[s0] = 1; q.push(s0);
    while (q.length) {
      var x = q.shift(), ds = dirs(x), fr = Ad[x].filter(function(j){ return !done[j]; }).sort(function(a, b){ return ((onMain[b] != null) - (onMain[a] != null)) || a - b; });
      fr.forEach(function(j, k){ P[j] = add(P[x], mul(ds[k] || TET[k % 4], bl(x, j))); done[j] = 1; q.push(j); });
      for (var t = 0; t < h[x]; t++) Hs.push({ par:x, k:t, p:add(P[x], mul(ds[fr.length + t] || TET[t % 4], m.a[x].el === "O" ? 0.96 : 1.09)) });
    }
    for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0, 0];
    // align: first → last main-chain atom along x; a reference atom in the xy-plane, on the −y side (up on screen)
    var all = P.concat(Hs.map(function(o){ return o.p; })), c = [0, 0, 0];
    all.forEach(function(p){ c = add(c, mul(p, 1 / all.length)); });
    var X = main.length > 1 ? nrm(sub(P[main[main.length - 1]], P[main[0]])) : [1, 0, 0], Y = null;
    var refs = main.slice(1, -1).map(function(j){ return P[j]; }).concat(P.filter(function(_, j){ return onMain[j] == null; }), Hs.map(function(o){ return o.p; }));
    if (opt && opt.refFirst) refs = P.filter(function(_, j){ return onMain[j] == null; }).concat(refs);
    for (i = 0; i < refs.length && !Y; i++) { var w = sub(sub(refs[i], P[main[0]]), mul(X, dot(sub(refs[i], P[main[0]]), X))); if (len(w) > 0.2) Y = mul(nrm(w), -1); }
    if (!Y) Y = perp(X);
    var Z = crs(X, Y);
    function tf(p){ var d = sub(p, c); return [dot(d, X), dot(d, Y), dot(d, Z)]; }
    var atoms = [], bonds = [];
    for (i = 0; i < n; i++) { var p0 = tf(P[i]); atoms.push({ id:"a" + i, el:m.a[i].el, x:p0[0], y:p0[1], z:p0[2], i:i, par:parOf(m, i), add:m.a[i].add }); }
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    Hs.forEach(function(o){ var p1 = tf(o.p); bonds.push({ a:o.par, b:atoms.length, o:1 }); atoms.push({ id:"h" + o.par + "." + o.k, el:"H", x:p1[0], y:p1[1], z:p1[2], i:-1, par:o.par, isH:true }); });
    return { atoms:atoms, bonds:bonds, view:"3d" };
  }

  // ---------- morph (atoms matched by id, then by parent) ----------
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
  var RAD = { C:0.36, H:0.24, F:0.33, Cl:0.45, Br:0.5, I:0.56, O:0.36 };
  function tsp(t, fs){ var out = "", low = false, d = r1(fs * 0.28);
    String(t).replace(/(\d+|\D+)/g, function(seg){ var dig = /^\d/.test(seg); if (dig && !low) { out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.72) + '">' + seg + "</tspan>"; low = true; } else if (!dig && low) { out += '<tspan dy="' + (-d) + '">' + seg + "</tspan>"; low = false; } else out += seg; return seg; });
    return out; }
  function estW(t, fs){ var w = 0; String(t).split("").forEach(function(ch){ w += /\d/.test(ch) ? 0.42 : /[a-z]/.test(ch) ? 0.5 : 0.66; }); return w * fs; }
  function atomByI(sc, i){ for (var k = 0; k < sc.atoms.length; k++) if (sc.atoms[k].i === i) return k; return -1; }
  function fit2(sc, W, H, smx){
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    sc.atoms.forEach(function(a){ x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
    var s = Math.min((W - 24) / (x1 - x0 + 1.3), (H - 24) / (y1 - y0 + 1.3), smx || 70);
    return { s:s, ox:W / 2 - (x0 + x1) / 2 * s, oy:H / 2 - (y0 + y1) / 2 * s };
  }
  function fit3(sc, W, H){
    var R = 0.5; sc.atoms.forEach(function(a){ R = Math.max(R, Math.hypot(a.x, a.y, a.z || 0) + (RAD[a.el] || 0.3)); });
    return { s:Math.min(Math.min(W, H) * 0.48 / R, 96), ox:W / 2, oy:H / 2 };
  }
  function lerpFit(a, b, t){ return { s:lerp(a.s, b.s, t), ox:lerp(a.ox, b.ox, t), oy:lerp(a.oy, b.oy, t) }; }
  function lab(a){ if (a.lbl) return a.lbl; return a.el; }
  function inkOf(el){ return el === "C" ? "var(--at-c)" : el === "H" ? "var(--ink-2)" : el === "O" ? "var(--at-o)" : "var(--at-x)"; }
  function arrowPath(x1, y1, x2, y2, bend){
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, cx = mx - dy / L * bend * L, cy = my + dx / L * bend * L;
    var ex = x2 - cx, ey = y2 - cy, el = Math.hypot(ex, ey) || 1, ux = ex / el, uy = ey / el, hs = 9;
    return '<path d="M' + r1(x1) + " " + r1(y1) + " Q" + r1(cx) + " " + r1(cy) + " " + r1(x2) + " " + r1(y2) + '" fill="none" stroke="var(--e-pair)" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M' + r1(x2) + " " + r1(y2) + " L" + r1(x2 - ux * hs - uy * hs * 0.5) + " " + r1(y2 - uy * hs + ux * hs * 0.5) + " L" + r1(x2 - ux * hs + uy * hs * 0.5) + " " + r1(y2 - uy * hs - ux * hs * 0.5) + 'Z" fill="var(--e-pair)"/>';
  }
  function svg2d(sc, fit, o){
    var s = fit.s, fs = clamp(s * 0.4, 11, 22), out = "", X = function(a){ return fit.ox + a.x * s; }, Y = function(a){ return fit.oy + a.y * s; };
    o = o || {};
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
    sc.atoms.forEach(function(a, k){
      var t = lab(a), x = r1(X(a)), y = r1(Y(a)), op = a.op == null ? 1 : a.op, nw = o.newIds && o.newIds[a.id];
      if (o.mark != null && a.i === o.mark) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(fs * 0.92) + '" fill="none" stroke="var(--pen)" stroke-width="3"/>';
      if (nw) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(fs * (t.length > 1 ? 0.95 : 0.72)) + '" fill="var(--hi-soft)" stroke="var(--pen)" stroke-width="1.6" stroke-dasharray="3 2"/>';
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * (a.isH ? 0.9 : 1)) + '" font-weight="' + (a.el !== "C" && a.el !== "H" || nw ? 700 : 400) + '" fill="' + inkOf(a.el) + '"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + ">" + tsp(t, fs) + "</text>";
    });
    if (o.path) o.path.forEach(function(i, q){
      var k = atomByI(sc, i); if (k < 0) return;
      var a = sc.atoms[k], angs = [], P = Math.PI, best = null;
      sc.bonds.forEach(function(b){ var j = b.a === k ? b.b : b.b === k ? b.a : -1; if (j >= 0) angs.push(Math.atan2(sc.atoms[j].y - a.y, sc.atoms[j].x - a.x)); });
      [P / 4, 3 * P / 4, -P / 4, -3 * P / 4, P / 2, -P / 2, 0, P].some(function(t){ if (angs.every(function(x){ return Math.abs(Math.atan2(Math.sin(t - x), Math.cos(t - x))) > 0.5; })) { best = t; return true; } return false; });
      if (best == null) best = P / 4;
      out += '<text x="' + r1(X(a) + Math.cos(best) * fs * 1.22) + '" y="' + r1(Y(a) + Math.sin(best) * fs * 1.22) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.58) + '" font-weight="700" fill="var(--pen)">' + (q + 1) + "</text>";
    });
    (sc.arrows || []).forEach(function(ar){ out += arrowPath(fit.ox + ar.from[0] * s, fit.oy + ar.from[1] * s, fit.ox + ar.to[0] * s, fit.oy + ar.to[1] * s, ar.bend == null ? 0.35 : ar.bend); });
    return out;
  }
  function proj(p, rot){
    var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
    var x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
    return [x, y * cx - z * sx, y * sx + z * cx];
  }
  // torsion: turn the side of bond (i, j) that holds j about the i→j axis by deg
  function twist(sc, i, j, deg){
    var a = atomByI(sc, i), b = atomByI(sc, j); if (a < 0 || b < 0 || !deg) return sc;
    var L = sc.atoms.map(function(){ return []; }); sc.bonds.forEach(function(e){ L[e.a].push(e.b); L[e.b].push(e.a); });
    var side = {}, st = [b]; side[b] = 1;
    while (st.length) { var x = st.pop(); L[x].forEach(function(y){ if (!side[y] && !(x === b && y === a)) { side[y] = 1; st.push(y); } }); }
    if (side[a]) return sc;
    var P0 = [sc.atoms[a].x, sc.atoms[a].y, sc.atoms[a].z], k = nrm(sub([sc.atoms[b].x, sc.atoms[b].y, sc.atoms[b].z], P0)), th = deg * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
    return { view:sc.view, bonds:sc.bonds, atoms:sc.atoms.map(function(at, q){
      if (!side[q]) return at;
      var v = sub([at.x, at.y, at.z], P0), r = add(add(mul(v, c), mul(crs(k, v), s)), mul(k, dot(k, v) * (1 - c))), o = Object.assign({}, at);
      o.x = P0[0] + r[0]; o.y = P0[1] + r[1]; o.z = P0[2] + r[2]; return o;
    }) };
  }
  // angle marker at atom spec (index, or {i, side:−1 up | 1 down} to pick the H on that side as the second arm)
  function angleArc(sc, spec, rot, fit, txt){
    var ci = typeof spec === "object" ? spec.i : spec, k = atomByI(sc, ci); if (k < 0) return "";
    var c = sc.atoms[k], C0 = [c.x, c.y, c.z], nb = [];
    sc.bonds.forEach(function(b){ var o = b.a === k ? b.b : b.b === k ? b.a : -1; if (o >= 0) nb.push(sc.atoms[o]); });
    nb.sort(function(p, q){ return (p.isH ? 1 : 0) - (q.isH ? 1 : 0); });
    if (spec.side) { var hs = nb.filter(function(a){ return a.isH; }).sort(function(p, q){ return (p.y - q.y) * spec.side; }); if (hs.length) nb = [nb[0], hs[hs.length - 1]]; }
    if (nb.length < 2) return "";
    var u1 = nrm(sub([nb[0].x, nb[0].y, nb[0].z], C0)), u2 = nrm(sub([nb[1].x, nb[1].y, nb[1].z], C0)), d = clamp(dot(u1, u2), -1, 1), ang = Math.acos(d);
    var w = ang > Math.PI - 1e-3 ? perp(u1) : nrm(sub(u2, mul(u1, d))), pts = [], R = 0.52;
    for (var t = 0; t <= 18; t++) { var a = ang * t / 18, p = proj(add(C0, mul(add(mul(u1, Math.cos(a)), mul(w, Math.sin(a))), R)), rot); pts.push(r1(fit.ox + p[0] * fit.s) + "," + r1(fit.oy + p[1] * fit.s)); }
    var mp = proj(add(C0, mul(add(mul(u1, Math.cos(ang / 2)), mul(w, Math.sin(ang / 2))), R * 2.1)), rot), fs = clamp(fit.s * 0.3, 12, 17);
    return '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>' +
      '<text x="' + r1(fit.ox + mp[0] * fit.s) + '" y="' + r1(fit.oy + mp[1] * fit.s) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="700" fill="var(--ink)" stroke="var(--sheet)" stroke-width="4" paint-order="stroke">' + txt + "</text>";
  }
  function angTxt(sc, ci){ var a = sc.atoms[atomByI(sc, ci)]; return a && a.geo ? ({ 1:"180°", 2:"120°", 3:"109.5°" })[a.geo] : ""; }
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
        var A = sc.atoms[it.b.a], B = sc.atoms[it.b.b], on = o.selB && A.i >= 0 && B.i >= 0 && ((A.i === o.selB[0] && B.i === o.selB[1]) || (A.i === o.selB[1] && B.i === o.selB[0])), op = Math.min(A.op == null ? 1 : A.op, B.op == null ? 1 : B.op);
        var pa = pr[it.b.a], pb = pr[it.b.b], dx = (pb[0] - pa[0]) * s, dy = (pb[1] - pa[1]) * s, L = Math.hypot(dx, dy) || 1, ra = (RAD[A.el] || 0.3) * s * 0.8, rb = (RAD[B.el] || 0.3) * s * 0.8;
        if (L <= ra + rb) return;
        var ox = -dy / L, oy = dx / L, n = it.b.o === 4 ? 1 : it.b.o, sp = s * (n === 3 ? 0.11 : 0.085), wd = s * (n > 1 ? 0.07 : 0.12) * (on ? 1.5 : 1);
        for (var q = 0; q < n; q++) {
          var d = (q - (n - 1) / 2) * sp * 2;
          out += '<line x1="' + r1(fit.ox + pa[0] * s + dx / L * ra + ox * d) + '" y1="' + r1(fit.oy + pa[1] * s + dy / L * ra + oy * d) + '" x2="' + r1(fit.ox + pb[0] * s - dx / L * rb + ox * d) + '" y2="' + r1(fit.oy + pb[1] * s - dy / L * rb + oy * d) + '" stroke="var(' + (on ? "--pen" : "--ink-2") + ')" stroke-width="' + r1(wd) + '" stroke-linecap="round"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + "/>";
        }
        return;
      }
      var a = sc.atoms[it.k], p = pr[it.k], r = (RAD[a.el] || 0.3) * s * (1 + 0.07 * p[2] / Rm), col = MV.chem.atom(a.el), op2 = a.op == null ? 1 : a.op, x = r1(fit.ox + p[0] * s), y = r1(fit.oy + p[1] * s);
      out += "<g" + (op2 < 1 ? ' opacity="' + r1(op2) + '"' : "") + ">";
      if (o.selA != null && a.i === o.selA) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r + 5) + '" fill="none" stroke="var(--hi)" stroke-width="5"/>';
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.5"' : "") + '/><circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="url(#' + g + ')"/>';
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(r * (a.el.length > 1 ? 0.82 : 1.05)) + '" font-weight="700" fill="' + col.ink + '">' + a.el + "</text></g>";
    });
    (o.angle || []).forEach(function(ci){ out += angleArc(sc, ci, rot, fit, o.angTxt || angTxt(sc, ci)); });
    return out;
  }
  // geometry tags on 3D scenes (for angle labels)
  function scene3g(m, opt){ var sc = scene3(m, opt); sc.atoms.forEach(function(a){ if (a.i >= 0) a.geo = geo(m, a.i); }); return sc; }

  // ---------- view widget ----------
  var UID = 0;
  function view(host, opts){
    opts = opts || {};
    var uid = ++UID, W = opts.w || 640, H = opts.h || 400, aspect = H / W;
    host.innerHTML = '<div class="c1-wrap"><svg class="c1-svg" viewBox="0 0 ' + W + " " + H + '" role="img"></svg><div class="c1-ov"></div></div>' +
      (opts.rotate ? '<div class="c1-rot" hidden><span class="tiny muted">Turn the model:</span><button type="button" class="btn ghost sm" data-rot="l" aria-label="Turn left">⟲</button><button type="button" class="btn ghost sm" data-rot="r" aria-label="Turn right">⟳</button><button type="button" class="btn ghost sm" data-rot="u" aria-label="Tilt up">↑</button><button type="button" class="btn ghost sm" data-rot="d" aria-label="Tilt down">↓</button><span class="tiny muted">or drag it</span></div>' : "");
    var svg = $(".c1-svg", host), ov = $(".c1-ov", host), rb = $(".c1-rot", host);
    var st = { m:null, o:{ view:"st" }, rot:{ x:-0.45, y:0.55 }, cache:{}, cm:null, busy:false };
    function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 500 ? Math.max(aspect, 0.74) : aspect)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
    if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0 && !st.busy) render(); }).observe(svg);
    function sceneOf(m, v){ if (st.cm !== m) { st.cm = m; st.cache = {}; } return st.cache[v] || (st.cache[v] = v === "3d" ? scene3g(m) : layout2d(m)); }
    function scr(sc, fit, a){ if (sc.view === "3d") { var p = proj([a.x, a.y, a.z || 0], st.rot); return [fit.ox + p[0] * fit.s, fit.oy + p[1] * fit.s]; } return [fit.ox + a.x * fit.s, fit.oy + a.y * fit.s]; }
    function paint(sc, fit, o){
      svg.innerHTML = sc.view === "3d" ? svg3d(sc, st.rot, fit, o, uid) : svg2d(sc, fit, o);
      svg.setAttribute("aria-label", o.aria || "Molecule");
      if (rb) rb.hidden = sc.view !== "3d";
      var list = [];
      (o.atoms || []).forEach(function(ai){ var k = atomByI(sc, ai); if (k >= 0) { var p = scr(sc, fit, sc.atoms[k]); list.push({ k:"a", i:ai, x:p[0], y:p[1], on:o.selA === ai }); } });
      (o.bonds || []).forEach(function(bi){ var b = st.m.b[bi], ka = atomByI(sc, b[0]), kb = atomByI(sc, b[1]); if (ka < 0 || kb < 0) return; var p = scr(sc, fit, sc.atoms[ka]), q = scr(sc, fit, sc.atoms[kb]);
        list.push({ k:"b", i:bi, x:(p[0] + q[0]) / 2, y:(p[1] + q[1]) / 2, on:!!(o.selB && b[0] === o.selB[0] && b[1] === o.selB[1]) }); });
      var html = list.map(function(x){ return '<button type="button" class="c1-b' + (x.k === "b" ? " bd" : "") + '" style="left:' + r1(x.x / W * 100) + "%;top:" + r1(x.y / H * 100) + '%" data-k="c1' + uid + x.k + x.i + '" data-pk="' + x.k + '" data-pi="' + x.i + '" aria-pressed="' + x.on + '" aria-label="' + esc(opts.label ? opts.label(x.k, x.i) : "Select") + '"></button>'; }).join("");
      MV.keepFocus(ov, function(){ ov.innerHTML = html; });
    }
    function render(){
      if (!st.m || st.busy) return; size();
      var o = st.o, sc = o.scene || sceneOf(st.m, o.view);
      if (sc.view === "3d" && o.tor && o.tor.deg) sc = twist(sc, o.tor.i, o.tor.j, o.tor.deg);
      var fit = sc.view === "3d" ? fit3(o.scene || sceneOf(st.m, "3d"), W, H) : fit2(sc, W, H, o.smax);
      paint(sc, fit, o);
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
    return { show:function(m, o){ st.m = m; st.o = o || st.o; render(); }, render:render, rot:st.rot };
  }
  return { mol:mol, clone:clone, adj:adj, bondOf:bondOf, order:order, hc:hc, over:over, formula:formula, fText:fText, fHTML:function(m){ return F(fText(m)); }, geo:geo, iso:iso,
    condensed:condensed, layout2d:layout2d, scene3:scene3g, morph:morph, svg2d:svg2d, svg3d:svg3d, fit2:fit2, fit3:fit3, lerpFit:lerpFit, atomByI:atomByI, arrowPath:arrowPath, view:view };
})();

// @component C2 nameBuilder — IUPAC names for open-chain hydrocarbons with C=C and C≡C (chain holds the most multiple bonds, then
// the longest; lowest locants to -ol, then to the multiple bonds, then the double bonds, then prefixes; buta-1,3-diene, -en-…-yne,
// propene/2-methylpropene without a locant), alkyl halides and alcohols (products), name → structure parsing that also reads rings
// (cyclopentene) and benzene names (methylbenzene, 1,4-dimethylbenzene, phenylethane), older forms ("2-pentene" → accepted with
// "Current IUPAC writes it pent-2-ene."), a judge that names the mistake, and the chip palette (rows are configurable).
// Extends SCH4U 01's C2 (alkanes and alkyl halides). Needs C1 (adj, order, hc, iso, formula).
//   C2.name(m) -> {name, parent:[atom idx in numbering order], mb:[locants]}   C2.parse(str) -> {ok, msg | mol, n, ring, arom, mbl, older}
//   C2.judge(str, want, wrong) -> {ok, msg}   C2.canon(str) older → current form   C2.compose(tokens)   C2.chips(host, {rows, get, set, locked, onChange}) -> {paint}
var C2 = (function(){
  var STEM = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
  var MULT = ["", "", "di", "tri", "tetra", "penta", "hexa"], HAL = { F:"fluoro", Cl:"chloro", Br:"bromo", I:"iodo" };
  var M1 = "The multiple bond gets the lowest locant first; substituents come second.";
  function cmpArr(a, b){ for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }
  function cand(m, A, path, excl){
    var on = {}, subs = [], oh = [], mbs = [];
    path.forEach(function(x){ on[x] = 1; });
    for (var i = 0; i + 1 < path.length; i++) { var o = C1.order(m, path[i], path[i + 1]); if (o === 2 || o === 3) mbs.push({ loc:i + 1, o:o }); }
    path.forEach(function(x, k){ A[x].forEach(function(j){
      if (on[j] || j === excl) return;
      var el = m.a[j].el;
      if (el === "O") oh.push(k + 1);
      else if (el === "C") { var nm = alkyl(m, A, j, x); subs.push({ loc:k + 1, name:nm.name, key:nm.key }); }
      else subs.push({ loc:k + 1, name:HAL[el] || el.toLowerCase(), key:HAL[el] || el.toLowerCase() });
    }); });
    var c = { path:path, subs:subs, oh:oh.sort(asc), mbs:mbs, mb:mbs.map(function(x){ return x.loc; }), db:mbs.filter(function(x){ return x.o === 2; }).map(function(x){ return x.loc; }), locs:subs.map(function(s){ return s.loc; }).sort(asc) };
    c.alpha = subs.slice().sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : a.loc - b.loc; }).map(function(s){ return s.loc; });
    return c;
  }
  function cmp(a, b){
    return (b.oh.length - a.oh.length) || (b.mb.length - a.mb.length) || (b.path.length - a.path.length) || (b.db.length - a.db.length) || (b.subs.length - a.subs.length) ||
      cmpArr(a.oh, b.oh) || cmpArr(a.mb, b.mb) || cmpArr(a.db, b.db) || cmpArr(a.locs, b.locs) || cmpArr(a.alpha, b.alpha) || (a.str < b.str ? -1 : a.str > b.str ? 1 : 0);
  }
  function assemble(c, asSub){
    var n = c.path.length, g = {}, order = [], nOH = c.oh.length;
    c.subs.forEach(function(s){ if (!g[s.name]) { g[s.name] = { name:s.name, key:s.key, locs:[] }; order.push(g[s.name]); } g[s.name].locs.push(s.loc); });
    order.sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });
    var show = asSub || !(n === 1 || (n === 2 && c.subs.length + nOH === 1));
    var pre = order.map(function(x){ x.locs.sort(asc); return (show ? x.locs.join(",") + "-" : "") + MULT[x.locs.length] + x.name; }).join(show ? "-" : "");
    if (asSub) return pre + STEM[n] + "yl";
    var en = c.mbs.filter(function(x){ return x.o === 2; }).map(function(x){ return x.loc; }), yn = c.mbs.filter(function(x){ return x.o === 3; }).map(function(x){ return x.loc; });
    var s = STEM[n], showMb = !(nOH === 0 && n <= 3 && en.length + yn.length === 1);
    if (!en.length && !yn.length) s += "an";
    else {
      if ((en.length ? en : yn).length > 1) s += "a";
      if (en.length) s += (showMb ? "-" + en.join(",") + "-" : "") + MULT[en.length] + "en";
      if (yn.length) s += (showMb ? "-" + yn.join(",") + "-" : "") + MULT[yn.length] + "yn";
    }
    if (nOH) s += (nOH > 1 ? "e" : "") + (n > 2 || nOH > 1 ? "-" + c.oh.join(",") + "-" : "") + MULT[nOH] + "ol";
    else s += "e";
    return pre + s;
  }
  function alkyl(m, A, r, from){
    var seen = {}, st = [r], nodes = [];
    seen[from] = 1;
    while (st.length) { var x = st.pop(); if (seen[x]) continue; seen[x] = 1; nodes.push(x); A[x].forEach(function(y){ if (!seen[y]) st.push(y); }); }
    var linear = nodes.every(function(x){ return m.a[x].el === "C"; }), prev = from, cur = r, cnt = 1;
    while (linear) { var nx = A[cur].filter(function(y){ return y !== prev; }); if (!nx.length) break; if (nx.length > 1) { linear = false; break; } prev = cur; cur = nx[0]; cnt++; }
    if (linear && cnt === nodes.length) return { name:STEM[cnt] + "yl", key:STEM[cnt] + "yl" };
    var Cn = nodes.filter(function(x){ return m.a[x].el === "C"; }), par = {}, Q = [r], cands = [];
    par[r] = -1;
    while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (z !== from && !(z in par) && m.a[z].el === "C") { par[z] = y; Q.push(z); } }); }
    Cn.forEach(function(e){ var p = []; for (var z = e; z !== -1; z = par[z]) p.unshift(z); var c = cand(m, A, p, from); c.str = assemble(c, true); cands.push(c); });
    cands.sort(cmp);
    var inner = cands[0].str;
    return { name:"(" + inner + ")", key:inner.replace(/[^a-z]/g, "") };
  }
  function name(m){
    if (m._nm) return m._nm;
    var A = C1.adj(m), isC = function(i){ return m.a[i].el === "C"; }, Cs = [], cands = [], i;
    for (i = 0; i < m.a.length; i++) if (isC(i)) Cs.push(i);
    if (!Cs.length) return { name:"", parent:[], mb:[] };
    Cs.forEach(function(s){
      var par = {}, Q = [s]; par[s] = -1;
      while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (isC(z) && !(z in par)) { par[z] = y; Q.push(z); } }); }
      Cs.forEach(function(t){ if (!(t in par)) return; var p = []; for (var z = t; z !== -1; z = par[z]) p.unshift(z); cands.push(cand(m, A, p)); });
    });
    cands.forEach(function(c){ c.str = assemble(c); });
    cands.sort(cmp);
    var b = cands[0];
    return (m._nm = { name:b.str, parent:b.path, mb:b.mb, locs:b.locs, oh:b.oh });
  }
  // ---------- name → structure ----------
  var MULN = { di:2, tri:3, tetra:4 }, LEN = { methyl:1, ethyl:2, propyl:3, butyl:4 }, EL = { fluoro:"F", chloro:"Cl", bromo:"Br", iodo:"I" };
  var SUBRE = "methyl|ethyl|propyl|butyl|phenyl|fluoro|chloro|bromo|iodo";
  function norm(s){ return String(s || "").toLowerCase().replace(/\s+/g, "").replace(/[‐-―−]/g, "-"); }
  function parse(str){
    var s = norm(str);
    if (!s) return { ok:false, msg:"Build a name first." };
    var n, ring = false, arom = false, mbl = null, mult = 1, suf = "ane", aV = false, older = false, pre;
    if (/benzene$/.test(s)) { arom = ring = true; n = 6; pre = s.slice(0, -7); suf = "benzene"; }
    else {
      var mm = s.match(/(cyclo)?(meth|eth|prop|but|pent|hex|hept|oct)(a)?(?:-(\d+(?:,\d+)*)-)?(di|tri)?(ane|ene|yne)$/);
      if (!mm) return { ok:false, msg:/(ane|ene|yne)$/.test(s) ? "Part of the name isn’t in the right order. Write the prefixes, then the root, then the locants and the suffix: 3-methylbut-1-ene." : "End the name with the root and a suffix (-ane, -ene or -yne), or with benzene." };
      ring = !!mm[1]; n = STEM.indexOf(mm[2]); aV = !!mm[3]; suf = mm[6]; mult = mm[5] ? MULN[mm[5]] : 1;
      if (mm[4]) mbl = mm[4].split(",").map(Number);
      pre = s.slice(0, mm.index);
    }
    pre = pre.replace(/-$/, "");
    var om = pre.match(/(?:^|-)(\d+(?:,\d+)*)$/);
    if (om) { if (arom || suf === "ane") return { ok:false, msg:"A locant needs a group after it, like 2-methyl." }; if (mbl) return { ok:false, msg:"The multiple-bond locants appear twice." }; mbl = om[1].split(",").map(Number); older = true; pre = pre.slice(0, om.index); }
    var groups = [], i = 0;
    while (i < pre.length) {
      var g = { locs:null, mult:1 }, rest = pre.slice(i), lm = rest.match(/^(\d+(?:,\d+)*)-/);
      if (lm) { g.locs = lm[1].split(",").map(Number); i += lm[0].length; rest = pre.slice(i); }
      var mt = rest.match(new RegExp("^(di|tri|tetra)(?=" + SUBRE + ")"));
      if (mt) { g.mult = MULN[mt[1]]; i += mt[0].length; rest = pre.slice(i); }
      var sm = rest.match(new RegExp("^(" + SUBRE + ")"));
      if (!sm) return { ok:false, msg:"Part of the name isn’t in the right order. Write each group as locants, then di- if needed, then the prefix: 1,4-dimethyl." };
      g.sub = sm[1]; i += sm[0].length; if (pre[i] === "-") i++;
      groups.push(g);
    }
    if (ring && n < 3) return { ok:false, msg:"A ring needs at least 3 carbons." };
    if (suf === "ane") { if (aV || mult > 1) return { ok:false, msg:"di- and the ‘a’ go with -diene, not -ane." }; }
    else if (!arom) {
      if (aV && mult === 1) return { ok:false, msg:"The ‘a’ goes with di- or tri-: buta-1,3-diene." };
      if (mult > 1 && !aV) return { ok:false, msg:"Two C=C: -diene, with an ‘a’ added: buta-." };
      if (!mbl) { if (mult === 1 && (ring || n <= 3)) mbl = [1]; else return { ok:false, msg:"A locant is needed: say where the multiple bond starts." }; }
      if (mbl.length !== mult) return { ok:false, msg:mbl.length > mult ? "Two multiple bonds need di-: -diene." : "Each multiple bond needs its own locant." };
    }
    var total = groups.reduce(function(t, x){ return t + x.mult; }, 0), need = !((!ring && n === 1) || (!ring && n === 2 && total === 1) || (ring && total === 1)), seen = {};
    for (var k = 0; k < groups.length; k++) {
      var G = groups[k];
      if (seen[G.sub]) return { ok:false, msg:"Repeated prefixes combine with di-: 1,4-dimethyl, not 1-methyl-4-methyl." };
      seen[G.sub] = 1;
      if (G.locs && G.locs.length > 1 && G.mult === 1) return { ok:false, msg:"Two " + G.sub + " groups need the prefix di-." };
      if (G.locs && G.mult > 1 && G.locs.length !== G.mult) return { ok:false, msg:"Each " + G.sub + " group needs its own locant." };
      if (!G.locs && need) return { ok:false, msg:"Say where each group goes: put its locant in front, like 2-" + G.sub + "." };
    }
    var m = { a:[], b:[], main:[] }, c;
    for (c = 0; c < n; c++) { m.a.push({ el:"C" }); m.main.push(c); if (c) m.b.push([c - 1, c, arom ? 4 : 1]); }
    if (ring) m.b.push([n - 1, 0, arom ? 4 : 1]);
    if (mbl) for (k = 0; k < mbl.length; k++) {
      var L = mbl[k];
      if (L < 1 || L > (ring ? n : n - 1)) return { ok:false, msg:"There’s no bond starting at C" + L + " in a " + n + "-carbon " + (ring ? "ring" : "chain") + "." };
      if (m.b[L - 1][2] !== 1) return { ok:false, msg:"Two multiple bonds can’t start at the same carbon." };
      m.b[L - 1][2] = suf === "yne" ? 3 : 2;
    }
    for (k = 0; k < groups.length; k++) {
      var gg = groups[k], locs = gg.locs || Array.apply(null, Array(gg.mult)).map(function(){ return 1; });
      for (var q = 0; q < locs.length; q++) {
        var Lc = locs[q];
        if (Lc < 1 || Lc > n) return { ok:false, msg:"There’s no carbon " + Lc + " in a " + n + "-carbon " + (ring ? "ring" : "chain") + "." };
        if (EL[gg.sub]) { m.b.push([Lc - 1, m.a.length, 1]); m.a.push({ el:EL[gg.sub] }); }
        else if (gg.sub === "phenyl") { var r0 = m.a.length; for (var t = 0; t < 6; t++) { m.a.push({ el:"C" }); if (t) m.b.push([r0 + t - 1, r0 + t, 4]); } m.b.push([r0 + 5, r0, 4]); m.b.push([Lc - 1, r0, 1]); }
        else { var prev = Lc - 1; for (var t2 = 0; t2 < LEN[gg.sub]; t2++) { m.b.push([prev, m.a.length, 1]); prev = m.a.length; m.a.push({ el:"C" }); } }
      }
    }
    var ob = C1.over(m);
    if (ob >= 0) return { ok:false, msg:"Carbon " + (ob + 1) + " would have more than four bonds." };
    return { ok:true, mol:m, n:n, ring:ring, arom:arom, mbl:mbl, older:older, groups:groups };
  }
  function canon(s){
    var t = norm(s), mo = t.match(/^(.*?)(\d+(?:,\d+)*)-(cyclo)?(meth|eth|prop|but|pent|hex|hept|oct)(a)?(di|tri)?(ene|yne)$/);
    if (mo) t = mo[1].replace(/-$/, "") + (mo[3] || "") + mo[4] + (mo[6] ? "a" : "") + "-" + mo[2] + "-" + (mo[6] || "") + mo[7];
    return t.replace(/(eth|prop)-1-(ene|yne)$/, "$1$2");
  }
  function has(m, o){ return m.b.some(function(b){ return b[2] === o; }); }
  function cnt(m, o){ return m.b.filter(function(b){ return b[2] === o; }).length; }
  function judge(str, want, wrong){
    var s = norm(str), w = norm(want);
    if (!s) return { ok:false, msg:"Build a name first." };
    if (s === w) return { ok:true };
    if (canon(s) === w) return { ok:true, msg:"Accepted. Current IUPAC writes it " + want + "." };
    if (wrong && wrong[s]) return { ok:false, msg:wrong[s] };
    var p = parse(s); if (!p.ok) return { ok:false, msg:p.msg };
    var t = parse(w), pm = p.mol, tm = t.mol;
    if (C1.iso(pm, tm)) {
      if (t.arom && !p.arom) return { ok:false, msg:"Same molecule, but name it as a substituted benzene: the ring is the parent." };
      if (t.ring && !p.ring) return { ok:false, msg:"Same molecule, but the ring is the parent." };
      if (t.arom || t.ring) return { ok:false, msg:p.groups.reduce(function(x, g){ return x + g.mult; }, 0) === 1 && p.groups[0].locs ? "Same molecule. With only one group on the ring, IUPAC leaves out the locant." : "Same molecule: number the ring so the groups get the lowest locants." };
      var tn = name(tm), ls = (p.mbl || []).slice().sort(asc);
      if (p.n < tn.parent.length) return { ok:false, msg:"The parent chain must contain the multiple bond and be as long as possible: count again." };
      if (cmpArr(ls, tn.mb) > 0) return { ok:false, msg:M1 };
      var locs = []; p.groups.forEach(function(g){ (g.locs || []).forEach(function(L){ locs.push(L); }); }); locs.sort(asc);
      if (locs.length && cmpArr(locs, tn.locs) > 0) return { ok:false, msg:"Then number so the substituents get the lowest locants." };
      var order = p.groups.map(function(g){ return g.sub; });
      if (order.slice().sort().join() !== order.join()) return { ok:false, msg:"List the prefixes alphabetically." };
      return { ok:false, msg:"Same molecule, but that isn’t its IUPAC name. Check which locants are needed." };
    }
    if (t.arom && !p.arom) return { ok:false, msg:"It’s an aromatic ring." };
    if (!t.arom && p.arom) return { ok:false, msg:"There’s no benzene ring here." };
    if (t.ring && !p.ring) return { ok:false, msg:"It’s a ring." };
    if (!t.ring && p.ring) return { ok:false, msg:"It’s an open chain, not a ring." };
    if (has(tm, 3) && !has(pm, 3)) return { ok:false, msg:"Triple bond: -yne." };
    if (!has(tm, 3) && has(pm, 3)) return { ok:false, msg:"It’s a double bond: -ene." };
    if (has(tm, 2) && !has(pm, 2)) return { ok:false, msg:"The C=C makes it an alkene." };
    var tf = C1.formula(tm), pf = C1.formula(pm);
    if (tf.C !== pf.C) return { ok:false, msg:"Count the carbons again: this molecule has " + tf.C + ", including any branch." };
    if (cnt(tm, 2) !== cnt(pm, 2)) return { ok:false, msg:"Count the C=C bonds: this molecule has " + cnt(tm, 2) + "." };
    return { ok:false, msg:"Right formula, different structure: check where the multiple bond and each group sit." };
  }
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
  return { name:name, parse:parse, judge:judge, canon:canon, compose:compose, chips:chips, norm:norm, M1:M1 };
})();

// ---------- reactions (addition across a multiple bond) ----------
var RG = { H2:{ a:["H", "H"], nm:"H₂", w:"H" }, Br2:{ a:["Br", "Br"], nm:"Br₂", polar:true, w:"Br" }, Cl2:{ a:["Cl", "Cl"], nm:"Cl₂", polar:true, w:"Cl" },
  HBr:{ a:["H", "Br"], nm:"HBr", mk:true }, HCl:{ a:["H", "Cl"], nm:"HCl", mk:true }, H2O:{ a:["H", "O"], nm:"H₂O", mk:true } };
function addOnce(m, k, rid, round){
  var R = RG[rid], b = m.b[k], i = b[0], j = b[1], h = C1.hc(m), c1 = i, c2 = j;
  if (R.mk && h[j] > h[i]) { c1 = j; c2 = i; }
  function put(mm, c, el){ if (el === "H") return; mm.b.push([c, mm.a.length, 1]); mm.a.push({ el:el, root:c, add:round }); }
  var mid = C1.clone(m); mid.b[k][2]--; put(mid, c1, R.a[0]); mid.a[c2].open = 1;
  var prod = C1.clone(m); prod.b[k][2]--; put(prod, c1, R.a[0]); put(prod, c2, R.a[1]);
  var alt = null; if (R.mk) { alt = C1.clone(m); alt.b[k][2]--; put(alt, c2, R.a[0]); put(alt, c1, R.a[1]); }
  var pn = C2.name(prod).name, an = alt ? C2.name(alt).name : pn;
  return { mid:mid, prod:prod, c1:c1, c2:c2, h1:h[c1], h2:h[c2], tie:h[i] === h[j], single:an === pn, pn:pn, an:an };
}
function firstMB(m){ for (var k = 0; k < m.b.length; k++) if (m.b[k][2] === 2 || m.b[k][2] === 3) return k; return -1; }
function lowOf(m, x){ return x == null ? null : { 2:"=", 3:"≡" }[m.b[x][2]] || "–"; }
// full reaction for the lab: target bond, one or two additions, products and the frames for the stepper
function react(m, rid, twice, selB){
  var k = selB != null && m.b[selB] && m.b[selB][2] >= 2 && m.b[selB][2] <= 3 ? selB : firstMB(m), R = RG[rid], nm = C2.name(m), path = nm.parent;
  var L = function(i){ return path.indexOf(i) + 1; }, out = { k:k, R:R, path:path, name:nm.name, rounds:[], steps:[] };
  if (k < 0) { out.none = true; out.steps.push({ m:m, cap:nm.name + " has no multiple bond, so " + R.nm + " can’t add: no reaction." }); return out; }
  if (rid === "H2O" && m.b[k][2] === 3) { out.blocked = true; out.steps.push({ m:m, cap:"In this lab, water adds to C=C only. Choose another reagent, or make the bond double." }); return out; }
  var n = twice && m.b[k][2] === 3 ? 2 : 1, cur = m;
  for (var r = 0; r < n; r++) {
    var A = addOnce(cur, k, rid, r + 1), bw = cur.b[k][2] === 3 ? "C≡C" : "C=C", w1 = R.a[0] === "O" ? "OH" : R.a[0], w2 = R.a[1] === "O" ? "OH" : R.a[1];
    out.rounds.push(A);
    out.steps.push({ m:cur, reag:{ c1:A.c1, c2:A.c2, atoms:[R.a[0], R.a[1]] }, arrow:!!(R.mk || R.polar), round:r + 1, bond:k,
      cap:(r ? "A second " + R.nm + " adds across the C=C that is left." : C2.name(cur).name + " + " + R.nm + ".") + (R.mk || R.polar ? " The curved arrow shows the π electron pair of the " + bw + " reaching for " + (R.mk ? "the H of " : "") + R.nm + "." : " On the metal catalyst, H₂ adds to the " + bw + ".") });
    out.steps.push({ m:A.mid, reag:{ c1:A.c1, c2:A.c2, atoms:[null, R.a[1]] }, mark:R.mk ? A.c1 : null, round:r + 1, newAt:[A.c1],
      cap:"The π bond breaks. " + (R.mk ? "H adds to C" + L(A.c1) + ", which already had " + A.h1 + " H (Markovnikov’s rule)." : "One " + w1 + " adds to C" + L(A.c1) + ".") });
    out.steps.push({ m:A.prod, mark:R.mk ? A.c1 : null, round:r + 1, newAt:[A.c1, A.c2], cap:w2 + " adds to C" + L(A.c2) + ". " + (r + 1 < n ? "Product so far: " + A.pn + "." : "Product: " + A.pn + ".") });
    cur = A.prod;
  }
  out.prod = cur; out.pname = C2.name(cur).name;
  return out;
}
function frameScene(st){
  var sc = C1.layout2d(st.m);
  sc.arrows = [];
  if (st.reag) {
    var A = sc.atoms[C1.atomByI(sc, st.reag.c1)], B = sc.atoms[C1.atomByI(sc, st.reag.c2)], y = Math.min(A.y, B.y) - 1.6, pos = [[A.x, y], [B.x, y]], ids = [];
    st.reag.atoms.forEach(function(el, q){ if (!el) return; ids.push(sc.atoms.length); sc.atoms.push({ id:"r" + q, el:el, lbl:el === "O" ? "OH" : el, x:pos[q][0], y:pos[q][1], i:-2, par:-1 }); });
    if (ids.length === 2) sc.bonds.push({ a:ids[0], b:ids[1], o:1 });
    if (st.arrow) sc.arrows.push({ from:[(A.x + B.x) / 2, (A.y + B.y) / 2 - 0.1], to:[pos[0][0] + 0.12 * (A.x < B.x ? 1 : -1), y + 0.36], bend:A.x < B.x ? 0.45 : -0.45 });
  }
  return sc;
}

// @component C3 mechanismStepper — step-through of a reaction with N13 Play / Step / Back: each step is a 2D structural frame
// (C1.layout2d) with reagent atoms placed by the bond, new atoms ringed, the Markovnikov carbon outlined in --pen, and curved
// electron-pair arrows in --e-pair (violet) drawn by C1.arrowPath; a caption per step. MV.player is rebuilt in a fresh child host
// on every new reaction (calling MV.player twice on one host doubles its listeners).
//   C3.stepper(host, {steps:[…], onStep(i)}) -> {go(i), get(), count}   (module 10 can pass mechanism steps with its own arrows)
var C3 = {
  stepper:function(host, o){
    host.innerHTML = ""; var box = document.createElement("div"); host.appendChild(box);
    var pl = MV.player(box, { count:o.steps.length, interval:1300, render:function(i){ o.onStep(i); }, label:function(i){ return "Step " + (i + 1) + " of " + o.steps.length; } });
    return { go:pl.go, get:pl.get, count:o.steps.length };
  }
};

// ---------- ring drawings (skeletal) ----------
// SVG text with lowered subscript digits ("CH₂CH₃" or "CH2CH3")
function subT(t){
  var out = "", low = false;
  String(t).replace(/[₀-₉]/g, function(c){ return String(c.charCodeAt(0) - 8320); }).replace(/(\d+|\D+)/g, function(seg){
    var dig = /^\d/.test(seg);
    if (dig && !low) { out += '<tspan dy="4" font-size="12">' + seg + "</tspan>"; low = true; } else if (!dig && low) { out += '<tspan dy="-4">' + seg + "</tspan>"; low = false; } else out += seg;
    return seg;
  });
  return out;
}
// ringSVG({n, dbl:[edge k = bond k→k+1], arom, subs:[[vertex, label]], w, h, R, aria})
function ringSVG(o){
  var n = o.n, W = o.w || 200, H = o.h || ((o.subs || []).length ? 200 : 160), R = o.R || 44, cx = W / 2, cy = H / 2 + (o.dy || 0), P = [], s = "", k;
  for (k = 0; k < n; k++) { var t = -Math.PI / 2 + 2 * Math.PI * k / n; P.push([cx + R * Math.cos(t), cy + R * Math.sin(t)]); }
  function ln(a, b, w){ return '<line x1="' + r1(a[0]) + '" y1="' + r1(a[1]) + '" x2="' + r1(b[0]) + '" y2="' + r1(b[1]) + '" stroke="var(--ink)" stroke-width="' + (w || 2.2) + '" stroke-linecap="round"/>'; }
  for (k = 0; k < n; k++) {
    var p = P[k], q = P[(k + 1) % n]; s += ln(p, q);
    if ((o.dbl || []).indexOf(k) >= 0) { var ip = [p[0] + (cx - p[0]) * 0.2, p[1] + (cy - p[1]) * 0.2], iq = [q[0] + (cx - q[0]) * 0.2, q[1] + (cy - q[1]) * 0.2]; s += ln([ip[0] + (iq[0] - ip[0]) * 0.14, ip[1] + (iq[1] - ip[1]) * 0.14], [iq[0] + (ip[0] - iq[0]) * 0.14, iq[1] + (ip[1] - iq[1]) * 0.14]); }
  }
  if (o.arom) s += '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r1(R * 0.56) + '" fill="none" stroke="var(--ink-2)" stroke-width="2.2"/>';
  (o.subs || []).forEach(function(sb){
    var p = P[sb[0]], dx = (p[0] - cx) / R, dy = (p[1] - cy) / R, e = [p[0] + dx * R * 0.5, p[1] + dy * R * 0.5], tx = p[0] + dx * R * 0.78, ty = p[1] + dy * R * 0.78;
    var anc = Math.abs(dx) < 0.3 ? "middle" : dx > 0 ? "start" : "end", hal = /^(Br|Cl)$/.test(sb[1]);
    if (anc !== "middle") tx -= dx * R * 0.12;
    s += ln(p, e) + '<text x="' + r1(tx) + '" y="' + r1(ty + (Math.abs(dx) < 0.3 ? dy * 6 : 0)) + '" text-anchor="' + anc + '" dominant-baseline="central" font-size="20" font-weight="' + (hal ? 700 : 400) + '" fill="' + (hal ? "var(--at-x)" : "var(--ink)") + '">' + subT(sb[1]) + "</text>";
  });
  return '<svg class="ae-ring" viewBox="0 0 ' + W + " " + H + '" ' + (o.aria ? 'role="img" aria-label="' + esc(o.aria) + '"' : 'aria-hidden="true"') + ">" + s + "</svg>";
}

// ---------- colours (bromine water: true orange-brown and colourless, always named in words) ----------
function hexRGB(c){ c = String(c || "").trim(); var m = c.match(/^#([0-9a-f]{6})$/i); if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)]; m = c.match(/(\d+),\s*(\d+),\s*(\d+)/); return m ? [+m[1], +m[2], +m[3]] : [200, 120, 40]; }
function mixVar(v1, v2, t){ var a = hexRGB(MV.css(v1)), b = hexRGB(MV.css(v2)); return "rgb(" + a.map(function(x, i){ return Math.round(x + (b[i] - x) * t); }).join(",") + ")"; }
function flaskSVG(fill, o){
  o = o || {};
  return '<svg class="ae-flask' + (o.cls ? " " + o.cls : "") + '" viewBox="0 0 120 130" aria-hidden="true"><path d="M30 104 L50 62 L70 62 L90 104 Q92 112 84 112 L36 112 Q28 112 30 104Z" fill="' + fill + '"/>' +
    '<path d="M48 10 L48 56 L22 106 Q18 118 32 118 L88 118 Q102 118 98 106 L72 56 L72 10" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/><path d="M44 10 H76" stroke="var(--ink-2)" stroke-width="3" stroke-linecap="round"/>' + (o.gas ? '<g fill="none" stroke="var(--ink-2)" stroke-width="1.6"><circle cx="58" cy="40" r="3"/><circle cx="64" cy="28" r="2.4"/><circle cx="57" cy="18" r="2"/></g>' : "") + "</svg>";
}
function tubeSVG(fill){
  return '<svg class="ae-tube-g" viewBox="0 0 40 110" aria-hidden="true"><path d="M11 46 V92 Q11 102 20 102 Q29 102 29 92 V46Z" fill="' + fill + '"/><path d="M9 6 V92 Q9 105 20 105 Q31 105 31 92 V6" fill="none" stroke="var(--ink-2)" stroke-width="2.6"/><path d="M6 6 H34" stroke="var(--ink-2)" stroke-width="2.6" stroke-linecap="round"/></svg>';
}
// Boiling points (°C). hexane and cyclohexane come from MV.chem.data.bp. The rest are this module's course table additions
// (plan §6, risk 1): MV.chem.data.bp doesn't hold them yet, so they're defined here until the shared table absorbs them.
var BP_ADD = { ethene:-104, ethyne:-84, propene:-48, "but-1-ene":-6, "cis-but-2-ene":4, "trans-but-2-ene":1, "hex-1-ene":63, cyclohexene:83, benzene:80 };
var BP_LIST = ["ethene", "ethyne", "propene", "but-1-ene", "cis-but-2-ene", "trans-but-2-ene", "hex-1-ene", "hexane", "cyclohexene", "cyclohexane", "benzene"];
function bpOf(nm){ var v = MV.chem.bpOf(nm); return v != null ? v : (BP_ADD[nm] != null ? BP_ADD[nm] : null); }
function famOf(m){
  var d = 0, t = 0; m.b.forEach(function(b){ if (b[2] === 2) d++; if (b[2] === 3) t++; });
  var fam = !d && !t ? "alkane (saturated)" : t && d ? "has C=C and C≡C (unsaturated)" : t ? (t > 1 ? "alkyne with 2 C≡C (unsaturated)" : "alkyne (unsaturated)") : d > 1 ? "alkene: a " + (d === 2 ? "diene" : "triene") + " (unsaturated)" : "alkene (unsaturated)";
  return { d:d, t:t, fam:fam, short:2 * d + 4 * t };
}
function shortTxt(f){ if (!f.short) return "0 (saturated: CₙH₂ₙ₊₂)"; var p = []; if (f.d) p.push(f.d + " C=C × 2"); if (f.t) p.push(f.t + " C≡C × 4"); return f.short + " (" + p.join(" + ") + ")"; }
var GEO = { 1:"180° (linear: 2 groups)", 2:"120° (trigonal planar: 3 groups)", 3:"109.5° (tetrahedral: 4 groups)" };

// ---------- hero ----------
function hero(){
  var svg = $("#ae-hx-svg"), cap = $("#ae-hx-cap"), rep = $("#ae-hx-replay");
  if (!svg) return;
  var eth = C1.mol({ n:2, bo:[2] }), dbe = { a:[{ el:"C" }, { el:"C" }, { el:"Br", root:0 }, { el:"Br", root:1 }], b:[[0, 1, 1], [0, 2, 1], [1, 3, 1]], main:[0, 1] };
  var A0 = C1.scene3(eth), B = C1.scene3(dbe, { refFirst:true }), FIT = { s:74, ox:232, oy:222 }, rot = { x:-0.32, y:0.2 };
  function brPair(dy){ var mx = (A0.atoms[0].x + A0.atoms[1].x) / 2; return [{ id:"a2", el:"Br", x:mx - 1.14, y:-2.5 - dy, z:0.4, i:2 }, { id:"a3", el:"Br", x:mx + 1.14, y:-2.5 - dy, z:0.4, i:3 }]; }
  function withBr(sc, dy){ var at = sc.atoms.concat(brPair(dy)), n = sc.atoms.length; return { view:"3d", atoms:at, bonds:sc.bonds.concat([{ a:n, b:n + 1, o:1 }]) }; }
  function beaker(x, t, label, y, sc){
    var fill = t <= 0 ? "var(--ae-bw)" : t >= 1 ? "var(--ae-clear)" : mixVar("--ae-bw", "--ae-clear", t);
    return '<g transform="translate(' + x + "," + (y == null ? 150 : y) + ") scale(" + (sc || 1) + ')"><path d="M8 40 V150 Q8 160 18 160 H92 Q102 160 102 150 V40" fill="none" stroke="var(--ink-2)" stroke-width="3"/><path d="M11 78 H99 V150 Q99 157 92 157 H18 Q11 157 11 150Z" fill="' + fill + '"/>' +
      '<text x="55" y="188" text-anchor="middle" font-size="18" fill="var(--ink-2)">bromine water</text><text x="55" y="212" text-anchor="middle" font-size="21" font-weight="700" fill="var(--ink)">' + label + "</text></g>";
  }
  function benz(cx, cy, R){ var p = []; for (var k = 0; k < 6; k++) { var a = -Math.PI / 2 + k * Math.PI / 3; p.push(r1(cx + R * Math.cos(a)) + "," + r1(cy + R * Math.sin(a))); }
    return '<polygon points="' + p.join(" ") + '" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linejoin="round"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r1(R * 0.56) + '" fill="none" stroke="var(--ink-2)" stroke-width="3"/>'; }
  function br2(x, y, r){ var c = MV.chem.atom("Br"); return '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 2.2 * r) + '" y2="' + y + '" stroke="var(--ink-2)" stroke-width="' + r1(r * 0.4) + '"/>' + [x, x + 2.2 * r].map(function(xx){ return '<circle cx="' + r1(xx) + '" cy="' + y + '" r="' + r + '" fill="' + c.fill + '"/><text x="' + r1(xx) + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(r * 0.85) + '" font-weight="700" fill="' + c.ink + '">Br</text>'; }).join(""); }
  if (MV.reduceMotion) {
    svg.innerHTML = '<line x1="320" y1="30" x2="320" y2="390" stroke="var(--rule)" stroke-width="2"/>' +
      C1.svg3d(B, rot, { s:46, ox:120, oy:185 }, { angle:[0], angTxt:"109.5°" }, "hxr") + beaker(222, 1, "colourless", 92, 0.78) +
      '<text x="160" y="352" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink)">ethene + Br₂: addition</text><text x="160" y="382" text-anchor="middle" font-size="21" fill="var(--ink)">→ 1,2-dibromoethane</text>' +
      benz(445, 210, 62) + br2(455, 82, 16) + beaker(542, 0, "orange-brown", 92, 0.78) +
      '<text x="480" y="352" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink)">benzene + Br₂</text><text x="480" y="382" text-anchor="middle" font-size="21" fill="var(--ink)">No catalyst, no reaction.</text>';
    cap.textContent = "Ethene adds Br₂ and the bromine water turns colourless; benzene with Br₂ and no catalyst doesn’t react, so it stays orange-brown.";
    return;
  }
  var run = 0;
  function play(){
    var id = ++run; rep.hidden = true; var t0 = performance.now();
    function spin(){ return 0.15 + 0.32 * Math.sin((performance.now() - t0) * 0.0007); }
    function draw(sc, o, bw, lb){ rot.y = spin(); svg.innerHTML = C1.svg3d(sc, rot, FIT, o, "hx") + beaker(490, bw, lb); }
    function hold(ms, fn, sc, o, bw, lb){ MV.tween({ dur:ms, ease:function(t){ return t; }, step:function(){ if (id === run) draw(sc, o, bw, lb); }, done:function(){ if (id === run) fn(); } }); }
    cap.innerHTML = "Ethene, C₂H₄: flat, with 120° around each carbon.";
    var start = withBr(A0, 6);
    hold(1900, approach, start, { angle:[{ i:0, side:-1 }, { i:1, side:1 }], angTxt:"120°" }, 0, "orange-brown");
    function approach(){
      cap.innerHTML = "Br₂ approaches the C=C.";
      MV.tween({ dur:1100, step:function(t){ if (id === run) draw(withBr(A0, 6 * (1 - t)), {}, 0, "orange-brown"); }, done:function(){ if (id === run) add(); } });
    }
    function add(){
      cap.innerHTML = "The double bond opens: one Br adds to each carbon.";
      var mf = C1.morph(withBr(A0, 0), B);
      MV.tween({ dur:1600, step:function(t){ if (id === run) draw(mf(t), {}, t, t < 0.6 ? "orange-brown" : "colourless"); }, done:function(){
        if (id !== run) return;
        cap.innerHTML = "1,2-dibromoethane, C₂H₄Br₂: 109.5° around each carbon. The bromine water is now colourless.";
        hold(2200, benzene, B, { angle:[0, 1], angTxt:"109.5°" }, 1, "colourless");
      } });
    }
    function benzene(){
      cap.innerHTML = "Benzene, C₆H₆, with a delocalized ring. Br₂ approaches…";
      MV.tween({ dur:2200, ease:function(t){ return t; }, step:function(t){
        if (id !== run) return;
        var d = t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2, bx = 300 + 150 * d, by = 110 - 70 * d;
        svg.innerHTML = benz(228, 230, 92) + br2(bx, by, 22) + beaker(490, 0, "orange-brown") + (t > 0.5 ? '<text x="228" y="372" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink)">No catalyst, no reaction.</text>' : "");
        if (t > 0.5) cap.innerHTML = "Br₂ bounces off. No catalyst, no reaction.";
      }, done:function(){ if (id === run) rep.hidden = false; } });
    }
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Multiple-bond lab ----------
function explore(host, api){
  var S = api.S, C = api.content;
  S.spec = S.spec || { n:3, bo:[2, 1], me:null }; S.mode = S.mode || "shape"; S.view = S.view || "3d"; S.rg = S.rg || "HBr"; S.twice = !!S.twice; S.bz = S.bz || "plain";
  var sel = { k:"a", i:1 }, tor = 0, step = 0, rx = null, rkey = "", player = null, bz = { added:false, t:0 }, rotMsg = "", bondMsg = "", T = { busy:false }, mc = { key:"", m:null };
  host.innerHTML = '<p class="how ae-how">' + C.how + '</p><div class="ae-grid"><div class="ae-left" data-mv="graph"><div class="eq-cap ae-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ae-molbox"><div class="ae-mol"></div><div class="ae-views"></div><div class="ae-step"></div><p class="ae-stepcap" aria-live="polite"></p></div><div class="ae-bz" hidden></div></div>' +
    '<div class="ae-ctrl"><div class="ae-modes"></div><div class="ae-build"><label class="slider ae-sl"><span class="slider-top"><span>Chain length</span><output class="ae-n"></output></span><input type="range" class="ae-rng" min="2" max="6" step="1" aria-label="Chain length, carbons"></label>' +
    '<p class="ae-msg" aria-live="polite"></p><div class="ae-bondrow"></div><div class="ae-merow"></div><div class="ae-rot" hidden><p class="ae-roth"><strong>Rotation test</strong> about the selected bond</p><label class="slider"><span class="slider-top"><span>Rotation handle (15° steps)</span><output class="ae-rotout">0°</output></span><input type="range" class="ae-rotin" min="-180" max="180" step="15" value="0" aria-label="Rotation handle: turn the right-hand end about the selected bond"></label><p class="ae-rotmsg" aria-live="polite"></p></div></div>' +
    '<div class="ae-react"><p class="ae-sub">Reagent shelf</p><div class="ae-shelf"></div><label class="ae-twice"><input type="checkbox" class="ae-twin"> Add twice (alkynes)</label><p class="ae-rmsg tiny muted" aria-live="polite"></p></div>' +
    '<div class="ae-bzc"><div class="ae-bzr"></div><div class="q-actions"><button type="button" class="btn primary sm" data-bz="add" data-k="bzadd">Add bromine to both flasks</button><button type="button" class="btn ghost sm" data-bz="reset" data-k="bzreset">Fresh flasks</button></div></div></div>' +
    '<div class="ae-right"><dl class="read ae-read" aria-live="polite"></dl><div class="ae-tab"></div></div></div>';
  var V = C1.view($(".ae-mol", host), { rotate:true, onPick:pick, label:pickLabel });
  var viewRG = radios($(".ae-views", host), { label:"View", aria:"Structure view", options:[{ id:"st", t:"Structural (2D)" }, { id:"3d", t:"3D with angles" }], value:S.view, onChange:function(v){ S.view = v; api.save(); paint(); } });
  var modeRG = radios($(".ae-modes", host), { label:"Mode", aria:"Lab mode", cls:"chips", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var shelf = radios($(".ae-shelf", host), { aria:"Reagent", cls:"chips", options:C.reagents, value:S.rg, onChange:function(v){ S.rg = v; api.save(); paint(); }, disabled:function(id){ return id === "H2O" && onlyTriple() ? "Water adds to C=C only here." : ""; } });
  var bzRG = radios($(".ae-bzr", host), { label:"Reagent", aria:"Reagent for both flasks", cls:"chips", options:C.benzReagents, value:S.bz, onChange:function(v){ S.bz = v; bz = { added:false, t:0 }; api.save(); paint(); } });
  var rng = $(".ae-rng", host), rotIn = $(".ae-rotin", host), twin = $(".ae-twin", host);
  twin.checked = S.twice;
  // tables: boiling points (course table additions) and the C13 panel
  (function(){
    var rows = BP_LIST.map(function(nm){ return [nm, MV.chem.fx(bpOf(nm), 0)]; });
    var d = document.createElement("details"); d.className = "chem-tab";
    d.innerHTML = "<summary>Data table: boiling points (°C)</summary>" + MV.tableHTML({ head:["Compound", "Boiling point (°C)"], rows:rows, caption:"Boiling points of the compounds in this module" }) + '<p class="tiny muted" style="margin:8px 0 0">Hexane and cyclohexane are from the course data table; the others are course table additions from this module.</p>';
    $(".ae-tab", host).appendChild(d);
  })();

  function M(){ return C1.mol(S.spec); }
  function mol(){ var k = JSON.stringify(S.spec); if (mc.key !== k) { mc = { key:k, m:M() }; } return mc.m; }
  function onlyTriple(){ var m = mol(), k = curBond(m); return k >= 0 && m.b[k][2] === 3; }
  function curBond(m){ return sel && sel.k === "b" && m.b[sel.i] && m.b[sel.i][2] >= 2 ? sel.i : firstMB(m); }
  function nameOf(m){ return C2.name(m).name; }
  function canOrder(m, bi, o){
    var b = m.b[bi], u = [0, 0];
    m.b.forEach(function(x, k){ if (k === bi) return; [0, 1].forEach(function(s){ if (x[0] === b[s] || x[1] === b[s]) u[s] += x[2]; }); });
    var badI = u[0] + o > 4 ? 0 : u[1] + o > 4 ? 1 : -1;
    return badI < 0 ? "" : "C" + (b[badI] + 1) + " would have more than four bonds";
  }
  function setSpec(sp, msg){ S.spec = sp; tor = 0; rotMsg = ""; bondMsg = msg || ""; api.save(); paint(); }
  function pick(kind, i, kb){
    if (T.busy) return;
    if (S.mode === "react" && step > 0 && player) player.go(0);
    if (kind === "a") sel = { k:"a", i:i };
    else {
      var m = mol();
      if (kb && sel && sel.k === "b" && sel.i === i) { cycle(i); return; }
      sel = { k:"b", i:i };
      if (kb) { cycle(i); return; }
      void m;
    }
    tor = 0; rotMsg = ""; bondMsg = ""; paint();
  }
  function cycle(bi){
    var m = mol(), o = m.b[bi][2];
    for (var s = 1; s <= 3; s++) { var no = (o + s - 1) % 3 + 1; if (!canOrder(m, bi, no)) { setOrder(bi, no); return; } }
  }
  function setOrder(bi, o){
    var sp = JSON.parse(JSON.stringify(S.spec)); sp.bo[bi] = o;
    var word = { 1:"single", 2:"double", 3:"triple" }[o];
    sel = { k:"b", i:bi }; setSpec(sp, "C" + (bi + 1) + "–C" + (bi + 2) + " is now a " + word + " bond.");
  }
  function pickLabel(kind, i){
    var m = mol(), h = C1.hc(m);
    if (kind === "a") return (m.a[i].root != null ? "Methyl carbon on C" + (m.a[i].root + 1) : "Carbon " + (i + 1)) + ", " + (h[i] ? "C" + "H" + (h[i] > 1 ? h[i] : "") : "C") + (sel && sel.k === "a" && sel.i === i ? ", selected" : "") + ". Select it to see its bond angle.";
    var b = m.b[i]; return "Bond C" + (b[0] + 1) + " to C" + (b[1] + 1) + ", " + { 1:"single", 2:"double", 3:"triple" }[b[2]] + (sel && sel.k === "b" && sel.i === i ? ", selected" : "") + ". Enter changes its type.";
  }
  rng.addEventListener("input", function(){
    var n = +rng.value, sp = JSON.parse(JSON.stringify(S.spec)); if (n === sp.n) return;
    var bo = sp.bo.slice(0, n - 1); while (bo.length < n - 1) bo.push(1);
    var note = "";
    if (sp.me != null && sp.me > n - 2) { sp.me = null; note = " The methyl was on a removed or end carbon, so it was taken off."; }
    sp.n = n; sp.bo = bo;
    if (C1.over(C1.mol(sp)) >= 0 && sp.me != null) { sp.me = null; note = " The methyl was taken off (too many bonds)."; }
    if (sel && ((sel.k === "a" && sel.i >= n + (sp.me != null ? 1 : 0)) || (sel.k === "b" && sel.i >= n - 1))) sel = null;
    setSpec(sp, "Chain: " + n + " carbons." + note);
  });
  $(".ae-build", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.bo) { setOrder(sel.i, +b.dataset.bo); return; }
    if (b.dataset.me) {
      var sp = JSON.parse(JSON.stringify(S.spec)), a = b.dataset.me;
      if (a === "rm") { var was = sp.me; sp.me = null; sel = { k:"a", i:was }; setSpec(sp, "Methyl removed from C" + (was + 1) + "."); }
      else { sp.me = +a; setSpec(sp, "Methyl added on C" + (+a + 1) + "."); }
    }
  });
  rotIn.addEventListener("input", function(){
    var m = mol(); if (!sel || sel.k !== "b") return;
    var o = m.b[sel.i][2], v = +rotIn.value;
    if (o === 1) {
      tor = v; rotMsg = v ? "The single bond turns freely: " + v + "°. The groups swing around the C–C axis." : "";
      if (S.view !== "3d") { S.view = "3d"; viewRG.set("3d"); api.save(); rotMsg += " (Switched to 3D to show it.)"; }
      paint();
    } else resist(v);
  });
  function resist(v){
    var m = mol(); T.busy = true; rotMsg = "Rotating would break the π bond.";
    if (S.view !== "3d") { S.view = "3d"; viewRG.set("3d"); api.save(); }
    var top = v || 30, sgn = top < 0 ? -1 : 1;
    MV.tween({ dur:700, step:function(t){ var w = Math.sin(t * Math.PI) * 10 * sgn; tor = w; rotIn.value = Math.round(top * (1 - t) / 15) * 15; $(".ae-rotout", host).textContent = rotIn.value + "°"; paintView(); }, done:function(){ tor = 0; rotIn.value = 0; T.busy = false; paint(); } });
    void m;
  }
  twin.addEventListener("change", function(){ S.twice = twin.checked; api.save(); paint(); });
  $(".ae-bzc", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-bz]"); if (!b || b.disabled) return;
    if (b.dataset.bz === "reset") { bz = { added:false, t:0 }; paint(); return; }
    runBz();
  });
  function runBz(done){
    bz = { added:true, t:0, run:true }; paintBz(); paintRead();
    MV.tween({ dur:1800, step:function(t){ bz.t = t; paintBz(); }, done:function(){ bz.t = 1; bz.run = false; paintBz(); paintRead(); MV.changed(); if (done) done(); } });
  }
  function setMode(v){ S.mode = v; modeRG.set(v); api.save(); if (v === "benz") bz = { added:false, t:0 }; rkey = ""; paint(); }

  // ---------- reaction frames ----------
  function ensureReact(){
    var m = mol(), k = JSON.stringify([S.spec, S.rg, S.twice, sel && sel.k === "b" ? sel.i : null]);
    if (k === rkey && rx) return rx;
    rkey = k; rx = react(m, S.rg, S.twice, sel && sel.k === "b" ? sel.i : null); step = 0;
    player = C3.stepper($(".ae-step", host), { steps:rx.steps, onStep:function(i){ step = i; paintView(); paintRead(); MV.changed(); } });
    return rx;
  }
  function paintView(){
    var m = mol(), nm = C2.name(m), sb = sel && sel.k === "b" ? [m.b[sel.i][0], m.b[sel.i][1]] : null;
    if (S.mode === "react") {
      var r = ensureReact(), st = r.steps[step] || r.steps[0], ids = {};
      if (st.round) st.m.a.forEach(function(a, i){ if (a.add === st.round) ids["a" + i] = 1; });
      if (st.newAt && st.round) { var h = C1.hc(st.m); st.newAt.forEach(function(c){ if ((RG[S.rg].a[st.newAt.indexOf(c)] === "H") && h[c]) ids["h" + c + "." + (h[c] - 1)] = 1; }); }
      V.show(m, { view:"st", scene:frameScene(st), atoms:m.main.concat(S.spec.me != null ? [S.spec.n] : []), bonds:m.b.map(function(_, i){ return i; }).filter(function(i){ return m.b[i][1] < S.spec.n; }),
        selA:step === 0 && sel && sel.k === "a" ? sel.i : null, selB:step === 0 ? sb : null, path:r.path, mark:st.mark, newIds:ids, smax:68,
        aria:"Step " + (step + 1) + " of " + r.steps.length + ": " + MV.plain(st.cap) });
      $(".ae-stepcap", host).innerHTML = st.cap; $(".ae-cap", host).innerHTML = capHTML();
    } else {
      V.show(m, { view:S.view, atoms:m.main.concat(S.spec.me != null ? [S.spec.n] : []), bonds:m.b.map(function(_, i){ return i; }).filter(function(i){ return m.b[i][1] < S.spec.n; }),
        selA:sel && sel.k === "a" ? sel.i : null, selB:sb, path:S.view === "st" ? nm.parent : null, angle:S.view === "3d" && sel && sel.k === "a" ? [sel.i] : [],
        tor:sb && tor ? { i:sb[0], j:sb[1], deg:tor } : null, smax:62,
        aria:(S.view === "3d" ? "3D ball-and-stick model of " : "Full structural formula of ") + nm.name + ", " + MV.plain(F(C1.fText(m))) + (S.view === "3d" && sel && sel.k === "a" ? ". The angle at the selected carbon is marked " + GEO[C1.geo(m, sel.i)].split(" ")[0] + "." : ".") });
    }
  }
  function paintBz(){
    var box = $(".ae-bz", host), fe = S.bz === "fe", t = bz.t, add = bz.added;
    function col(fade, slow){ if (!add) return "var(--ae-clear)"; var u = slow ? clamp((t - 0.35) / 0.65, 0, 1) : clamp(t / 0.6, 0, 1); if (!fade) return "var(--ae-bw)"; return u >= 1 ? "var(--ae-clear)" : u <= 0 ? "var(--ae-bw)" : mixVar("--ae-bw", "--ae-clear", u); }
    var done = add && t >= 1, cx = { mol:done ? ringSVG({ n:6, subs:[[0, "Br"], [1, "Br"]], aria:"1,2-dibromocyclohexane" }) : ringSVG({ n:6, dbl:[0], aria:"cyclohexene" }),
      word:!add ? "colourless liquid (no bromine yet)" : t < 0.6 && !done ? "orange-brown, fading…" : "colourless",
      out:!done ? "" : "Br₂ adds across the C=C: <strong>1,2-dibromocyclohexane</strong>. Reaction type: addition." };
    var bzSub = fe && done, bx = { mol:bzSub ? ringSVG({ n:6, arom:true, subs:[[0, "Br"]], aria:"bromobenzene" }) : ringSVG({ n:6, arom:true, aria:"benzene" }),
      word:!add ? "colourless liquid (no bromine yet)" : !fe ? "orange-brown" : done ? "colourless (Br₂ used up)" : "orange-brown, fading slowly…",
      out:!done ? "" : fe ? "With FeBr₃, one ring H is replaced by Br: <strong>bromobenzene + HBr</strong> (HBr gas is given off). Reaction type: substitution." : "No catalyst, no reaction: the delocalized ring resists addition. Reaction type: no reaction." };
    box.innerHTML = '<div class="ae-flasks"><figure class="ae-fl">' + flaskSVG(col(true, false)) + cx.mol + '<figcaption><strong>Cyclohexene</strong>, ' + F("C6H10") + '<br><span class="ae-word">' + cx.word + "</span><br>" + cx.out + "</figcaption></figure>" +
      '<figure class="ae-fl">' + flaskSVG(col(fe, true), { gas:fe && add && t > 0.4 }) + bx.mol + '<figcaption><strong>Benzene</strong>, ' + F("C6H6") + '<br><span class="ae-word">' + bx.word + "</span><br>" + bx.out + "</figcaption></figure></div>";
    $$("[data-bz]", host).forEach(function(b){ b.disabled = !!bz.run || (b.dataset.bz === "add" && bz.added); });
  }
  function paintRead(){
    var rows, m = mol(), nm = C2.name(m).name, f = famOf(m);
    if (S.mode === "benz") {
      var fe = S.bz === "fe", done = bz.added && bz.t >= 1;
      rows = [["Name", "cyclohexene" + (done ? " → 1,2-dibromocyclohexane" : "") + "<br>benzene" + (done ? (fe ? " → bromobenzene + HBr" : " → no reaction") : "")],
        ["Formula and family", F("C6H10") + " · cycloalkene (unsaturated)<br>" + F("C6H6") + " · aromatic (delocalized ring)"],
        ["H short of saturated", "cyclohexene 4 (ring + C=C)<br>benzene 8 (ring + three C=C as drawn), yet it doesn’t add"],
        ["Angle at a ring carbon", "benzene: 120° at every carbon (flat ring)"],
        ["Rotation about a ring bond", "locked (ring)"],
        ["Markovnikov check", '<span class="muted">not needed: Br₂ adds Br to both carbons</span>'],
        ["Reaction type", !bz.added ? '<span class="muted">add bromine to find out</span>' : !done ? "…" : "cyclohexene: addition<br>benzene: " + (fe ? "substitution" : "no reaction")],
        ["Bromine colour", !bz.added ? "no bromine yet" : !done ? "both orange-brown at first" : "cyclohexene flask: colourless<br>benzene flask: " + (fe ? "colourless (Br₂ used up)" : "orange-brown")]];
    } else {
      var angle = sel && sel.k === "a" ? "C" + (sel.i + 1 > S.spec.n ? "H₃ on C" + (S.spec.me + 1) : sel.i + 1) + ": " + GEO[C1.geo(m, sel.i)] : '<span class="muted">tap a carbon</span>';
      var rot = sel && sel.k === "b" ? (m.b[sel.i][2] === 1 ? "free (single bond)" : "locked: " + (m.b[sel.i][2] === 2 ? "double" : "triple") + " bond (π bond would break)") : '<span class="muted">tap a C–C bond</span>';
      var mk = '<span class="muted">Reactions mode only</span>', rt = '<span class="muted">Reactions mode only</span>', name = "<strong>" + nm + "</strong>";
      if (S.mode === "react") {
        var r = ensureReact(), end = step === r.steps.length - 1;
        if (r.none) { mk = '<span class="muted">no multiple bond</span>'; rt = "no reaction"; }
        else if (r.blocked) { mk = rt = '<span class="muted">choose another reagent</span>'; }
        else if (!end) { name = "<strong>" + nm + "</strong> → ? " + '<span class="muted">(step to the end)</span>'; mk = rt = '<span class="muted">step through to see</span>'; }
        else {
          var A = r.rounds[0], R = r.R, L = function(i){ return r.path.indexOf(i) + 1; };
          name = "<strong>" + nm + "</strong> → <strong>" + r.pname + "</strong>"; rt = "addition";
          if (!R.mk) mk = '<span class="muted">not needed: ' + R.nm + " adds " + R.w + " to both carbons</span>";
          else if (A.single) mk = "not needed: both ends of the " + (lowOf(m, r.k) === "≡" ? "C≡C" : "C=C") + " are the same, so one product";
          else if (A.tie) mk = "both C=C carbons have " + A.h1 + " H: a mixture of " + A.pn + " and " + A.an;
          else if (r.rounds.length > 1) mk = "H added to C" + L(A.c1) + " (had " + A.h1 + " H), then to C" + L(r.rounds[1].c1) + " (had " + r.rounds[1].h1 + " H): " + R.a[1] + " goes to C" + L(A.c2) + " both times";
          else mk = "H added to C" + L(A.c1) + " (had " + A.h1 + " H); minor product: " + A.an;
        }
      }
      rows = [["Name", name], ["Formula and family", F(C1.fText(m)) + " · " + f.fam], ["H short of saturated", shortTxt(f)], ["Angle at selected carbon", angle], ["Rotation about selected bond", rot], ["Markovnikov check", mk], ["Reaction type", rt]];
    }
    $(".ae-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintBuild(){
    var m = mol(), h = C1.hc(m), n = S.spec.n;
    rng.value = n; $(".ae-n", host).textContent = n + " C";
    var bh = "", mh = "";
    if (sel && sel.k === "b" && m.b[sel.i]) {
      var b = m.b[sel.i];
      bh = '<p class="ae-sub">Bond C' + (b[0] + 1) + "–C" + (b[1] + 1) + '</p><div class="chips" role="group" aria-label="Bond type">' + [1, 2, 3].map(function(o){
        var why = canOrder(m, sel.i, o), on = b[2] === o;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-bo="' + o + '" data-k="bo' + o + '"' + (why && !on ? " disabled" : "") + ">" + { 1:"single", 2:"double", 3:"triple" }[o] + "</button>";
      }).join("") + "</div>" + [1, 2, 3].map(function(o){ var why = canOrder(m, sel.i, o); return why && b[2] !== o ? '<p class="tiny muted ae-why">' + { 1:"Single", 2:"Double", 3:"Triple" }[o] + " not possible: " + why + ".</p>" : ""; }).join("");
    } else if (sel && sel.k === "a") {
      var i = sel.i, isMe = i >= n;
      if (isMe) mh = '<button type="button" class="btn ghost sm" data-me="rm" data-k="merm">Remove the methyl</button>';
      else if (i === 0 || i === n - 1) mh = '<p class="tiny muted">The methyl goes on an inner carbon: on an end carbon it would just lengthen the chain.</p>';
      else if (S.spec.me === i) mh = '<button type="button" class="btn ghost sm" data-me="rm" data-k="merm">Remove the methyl from C' + (i + 1) + "</button>";
      else { var full = !(h[i] > 0); mh = '<button type="button" class="btn ghost sm" data-me="' + i + '" data-k="meadd"' + (full ? " disabled" : "") + ">" + (S.spec.me != null ? "Move the methyl to C" : "Add a methyl on C") + (i + 1) + "</button>" + (full ? '<p class="tiny muted ae-why">C' + (i + 1) + " has no H left for a methyl.</p>" : ""); }
    }
    MV.keepFocus($(".ae-bondrow", host), function(){ $(".ae-bondrow", host).innerHTML = bh; });
    MV.keepFocus($(".ae-merow", host), function(){ $(".ae-merow", host).innerHTML = mh; });
    $(".ae-msg", host).textContent = bondMsg || (!sel ? "Tap a carbon or a C–C bond in the drawing." : sel.k === "a" ? "Selected: " + (sel.i >= n ? "the methyl carbon" : "C" + (sel.i + 1)) + "." : "Selected: the C" + (m.b[sel.i][0] + 1) + "–C" + (m.b[sel.i][1] + 1) + " bond.");
    var rb = $(".ae-rot", host); rb.hidden = !(S.mode === "shape" && sel && sel.k === "b");
    if (!rb.hidden) { if (!T.busy) { rotIn.value = m.b[sel.i][2] === 1 ? tor : 0; $(".ae-rotout", host).textContent = rotIn.value + "°"; } $(".ae-rotmsg", host).textContent = rotMsg; }
  }
  function capHTML(){
    var m = mol(), c = F(C1.condensed(m, C2.name(m).parent) || C1.fText(m));
    if (S.mode === "react" && rx && rx.prod && step === rx.steps.length - 1) c += " → " + F(C1.condensed(rx.prod, C2.name(rx.prod).parent) || C1.fText(rx.prod));
    return c;
  }
  function paint(){
    var m = mol(), md = S.mode;
    $(".ae-molbox", host).hidden = md === "benz"; $(".ae-bz", host).hidden = md !== "benz";
    $(".ae-build", host).hidden = md === "benz"; $(".ae-react", host).hidden = md !== "react"; $(".ae-bzc", host).hidden = md !== "benz";
    $(".ae-views", host).hidden = md !== "shape"; $(".ae-step", host).hidden = md !== "react"; $(".ae-stepcap", host).hidden = md !== "react";
    $(".ae-cap", host).innerHTML = md === "benz" ? "cyclohexene and benzene, " + F("Br2") : capHTML();
    if (md === "react") {
      shelf.paint();
      var k = curBond(m), tri = k >= 0 && m.b[k][2] === 3; twin.disabled = !tri; $(".ae-twice", host).classList.toggle("off", !tri);
      $(".ae-rmsg", host).innerHTML = k < 0 ? "No multiple bond: build a C=C or C≡C first." : "Reacting bond: C" + (m.b[k][0] + 1) + lowOf(m, k) + "C" + (m.b[k][1] + 1) + (tri ? (S.twice ? " · adding twice" : " · tick Add twice to add a second molecule") : "") + (S.rg === "H2O" && tri ? " · water adds to C=C only here" : "");
    }
    if (md !== "benz") { paintBuild(); paintView(); } else paintBz();
    paintRead();
    MV.changed();
  }

  // ---------- predictions ----------
  function setState(sp, mode, o){
    o = o || {}; T.busy = false; S.spec = sp; S.mode = mode; modeRG.set(mode); tor = 0; rotMsg = ""; bondMsg = "";
    if (o.rg) { S.rg = o.rg; shelf.set(o.rg); } if (o.twice != null) { S.twice = o.twice; twin.checked = o.twice; }
    if (o.view) { S.view = o.view; viewRG.set(o.view); } if (o.bz) { S.bz = o.bz; bzRG.set(o.bz); }
    sel = o.sel || null; bz = { added:false, t:0 }; rkey = ""; api.save(); paint();
  }
  function playSteps(done){ var n = rx.steps.length; (function nx(i){ player.go(i); if (i < n - 1) MV.wait(1100, function(){ nx(i + 1); }); else MV.wait(600, done); })(0); }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState({ n:3, bo:[2, 1], me:null }, "react", { rg:"HBr", twice:false });
      else if (p.id === "p2") setState(S.spec, "benz", { bz:"plain" });
      else if (p.id === "p3") setState({ n:4, bo:[1, 2, 1], me:null }, "shape", { view:"3d", sel:{ k:"b", i:1 } });
      else setState({ n:2, bo:[3], me:null }, "react", { rg:"H2", twice:true });
    },
    run:function(p, done){
      if (p.id === "p1" || p.id === "p4") playSteps(done);
      else if (p.id === "p2") runBz(function(){ MV.wait(300, done); });
      else { rotIn.value = 30; $(".ae-rotout", host).textContent = "30°"; resist(30); MV.wait(900, done); }
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var m = mol(), nm = nameOf(m);
    if (S.mode === "benz") return { ok:false, msg:"Switch to Name and shape or Reactions mode, then build the molecule." };
    if (id === "tc1") {
      if (nm === "but-2-ene") return { ok:true };
      if (nm === "but-1-ene") return { ok:false, msg:"Your double bond starts at C1. Move it one bond in." };
      if (nm === "but-2-yne") return { ok:false, msg:"That’s a triple bond." };
      return { ok:false, msg:"You built " + nm + ". Start with 4 carbons, then make the C2–C3 bond double." };
    }
    if (id === "tc2") {
      if (S.mode !== "react") return { ok:false, msg:"Switch to Reactions mode, build the alkene and choose the reagent." };
      if (nm === "but-2-ene" && S.rg === "HCl") return { ok:true };
      if (nm === "but-1-ene" && S.rg === "HCl") return { ok:false, msg:"2-chlorobutane is the major product, but a little 1-chlorobutane forms too. Find an alkene where both ends of the C=C are the same." };
      if (nm === "but-2-ene" && S.rg === "Cl2") return { ok:false, msg:"Cl₂ adds two Cl: 2,3-dichlorobutane." };
      var r = react(m, S.rg, S.twice, null);
      if (r.none) return { ok:false, msg:nm + " has no multiple bond, so nothing adds." };
      if (r.blocked) return { ok:false, msg:"Water adds to C=C only here. Build a butene and choose HCl." };
      var A = r.rounds[0];
      return { ok:false, msg:nm + " + " + RG[S.rg].nm + " gives " + r.pname + (RG[S.rg].mk && !A.single ? " (with " + A.an + " as well)" : "") + ", not only 2-chlorobutane." };
    }
    if (id === "tc3") {
      if (nm === "2-methylpropene") return { ok:true };
      if (nm === "but-1-ene") return { ok:false, msg:"That gives butan-2-ol: the chain has no branch." };
      if (nm === "2-methylpropane") return { ok:false, msg:"No double bond, so no addition." };
      if (nm === "but-2-ene") return { ok:false, msg:"That gives butan-2-ol." };
      var k = firstMB(m);
      if (k < 0) return { ok:false, msg:"No double bond, so no addition." };
      if (m.b[k][2] === 3) return { ok:false, msg:"Build an alkene: in this lab water adds to a C=C." };
      return { ok:false, msg:"Water adds to " + nm + " to give " + addOnce(m, k, "H2O", 1).pn + ". You need 2-methylpropan-2-ol." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); }, repaint:paint };
}

// ---------- Part 3: bromine test ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.tested = S.tested || {}; S.rec = S.rec || {}; S.units = S.units || 0;
  var anim = {}, recMsg = {}, ctrlTries = 0, ratioMsg = null;
  host.innerHTML = '<div class="part ae-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="ae-tubes" role="group" aria-label="Samples"></div><div class="ae-obs" aria-live="polite"></div>' +
    '<h4 class="ae-h4">Results table</h4><p class="tiny muted">' + s1.tableNote + '</p><div class="ae-res"></div></div>' +
    '<div class="part ae-st"><h3>' + s2.title + '</h3><p class="ae-q">' + s2.q + '</p><div class="ae-ctrlq"></div><details class="alg"><summary>Check it with data</summary>' + s2.data + '<div class="ae-p3data"></div></details></div>' +
    '<div class="part ae-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="ae-oils"></div><div class="q-actions"><button type="button" class="btn primary sm" data-oil="add" data-k="oiladd">Add 1 unit of bromine to each</button><button type="button" class="btn ghost sm" data-oil="reset" data-k="oilreset">Start again</button></div><div class="ae-oiltab"></div><div class="ae-ratio"></div><p class="refresh">' + s3.stse + "</p></div>";
  function sample(id){ return s1.samples.filter(function(x){ return x.id === id; })[0]; }
  function tubeFill(x){ if (!S.tested[x.id]) return "var(--ae-clear)"; var a = anim[x.id]; if (a != null && a < 1 && x.dec) return mixVar("--ae-bw", "--ae-clear", a); return x.dec ? "var(--ae-clear)" : "var(--ae-bw)"; }
  function paintTubes(){
    MV.keepFocus($(".ae-tubes", host), function(){
      $(".ae-tubes", host).innerHTML = s1.samples.map(function(x){ var t = S.tested[x.id];
        return '<button type="button" class="ae-tube" data-smp="' + x.id + '" data-k="smp' + x.id + '" aria-label="' + esc(x.name + (t ? ", tested" : ", tap to add bromine water")) + '">' + tubeSVG(tubeFill(x)) + '<span class="ae-tn">' + x.name + "</span>" + (x.f ? '<span class="tiny muted">' + F(x.f) + "</span>" : "") + '<span class="tiny">' + (t ? (anim[x.id] != null && anim[x.id] < 1 && x.dec ? "fading…" : x.dec ? "colourless" : "orange-brown") : "not tested") + "</span></button>"; }).join("");
    });
  }
  function obsCard(x){ return '<div class="ae-card"><p><strong>' + x.name + ":</strong> " + (x.dec ? s1.yes : s1.no) + ".</p></div>"; }
  var CONC = { hexane:"no multiple bond: no addition", hexene:"C=C adds Br₂: unsaturated", chx:"no multiple bond: no addition", chxe:"C=C adds Br₂: unsaturated", benz:"aromatic ring: resists addition", oil:"C=C bonds add Br₂: unsaturated" };
  function paintRes(){
    var rows = s1.samples.map(function(x){
      var t = S.tested[x.id], r = S.rec[x.id], ok = r != null && (r === "dec") === x.dec;
      var chips = !t ? '<span class="tiny muted">test it first</span>' : ok ? (x.dec ? "decolourized quickly" : "stayed orange-brown") + " ✓" :
        '<span class="ae-rc">' + [["dec", "decolourized quickly"], ["stay", "stayed orange-brown"]].map(function(c){ return '<button type="button" class="chip' + (r === c[0] ? " on" : "") + '" aria-pressed="' + (r === c[0]) + '" data-rec="' + x.id + '" data-v="' + c[0] + '" data-k="rec' + x.id + c[0] + '">' + c[1] + "</button>"; }).join("") + "</span>" + (recMsg[x.id] ? '<span class="ae-bad">✗ ' + recMsg[x.id] + "</span>" : "");
      return [x.name, chips, ok ? CONC[x.id] : '<span class="muted">…</span>'];
    });
    MV.keepFocus($(".ae-res", host), function(){ $(".ae-res", host).innerHTML = MV.tableHTML({ head:["Sample", "Observation", "Conclusion"], rows:rows, caption:"Results table" }); });
  }
  $(".ae-tubes", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-smp]"); if (!b) return;
    var x = sample(b.dataset.smp), first = !S.tested[x.id];
    S.tested[x.id] = true; api.save();
    $(".ae-obs", host).innerHTML = obsCard(x);
    if (first || x.dec) { anim[x.id] = 0; MV.tween({ dur:1400, step:function(t){ anim[x.id] = t; paintTubes(); }, done:function(){ anim[x.id] = 1; paintTubes(); paintRes(); } }); }
    paintTubes(); paintRes();
  });
  $(".ae-res", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-rec]"); if (!b) return;
    var x = sample(b.dataset.rec); S.rec[x.id] = b.dataset.v; api.save();
    recMsg[x.id] = (b.dataset.v === "dec") === x.dec ? null : "Check the observation card again.";
    paintRes(); var cell = $('.ae-res [data-rec="' + x.id + '"]', host); if (cell) cell.focus(); else MV.focusFb($(".ae-res", host));
  });
  // station 2: negative control
  function paintCtrl(){
    var pick = S.ctrl, o = s2.options, h = '<div class="chips" role="radiogroup" aria-label="Negative control">' + o.map(function(x, i){ var on = pick === i; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-ctl="' + i + '" data-k="ctl' + i + '"' + (pick != null && MV.ok(o[pick]) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</div>";
    if (pick != null) h += MV.fbHTML(MV.ok(o[pick]) ? "good" : "bad", (MV.ok(o[pick]) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + o[pick].why + (MV.ok(o[pick]) ? "" : " Try again."));
    MV.keepFocus($(".ae-ctrlq", host), function(){ $(".ae-ctrlq", host).innerHTML = h; });
  }
  $(".ae-ctrlq", host).addEventListener("click", function(e){ var b = e.target.closest("[data-ctl]"); if (!b || b.disabled) return; S.ctrl = +b.dataset.ctl; ctrlTries++; api.save(); paintCtrl(); MV.focusFb($(".ae-ctrlq", host)); });
  (function(){
    var pos = s1.samples.filter(function(x){ return x.dec; });
    $(".ae-p3data", host).innerHTML = MV.tableHTML({ head:["Positive sample", "Addition product"], rows:pos.map(function(x){ return [x.name, x.prod + (x.eq ? '<br><span class="ae-eqs">' + F(x.eq) + "</span>" : "")]; }), caption:"Addition products" }) +
      MV.tableHTML({ head:["Compound", "Carbons", "Boiling point (°C)"], rows:[["hexane", "6", MV.chem.fx(bpOf("hexane"), 0)], ["hex-1-ene", "6", MV.chem.fx(bpOf("hex-1-ene"), 0)]], caption:"Hexane and hex-1-ene compared" });
  })();
  // station 3: oils
  function paintOils(){
    var u = S.units, cap = s3.cap, a = anim.oil;
    function col(k){ var ex = u > cap[k]; if (!u) return "var(--ae-clear)"; if (ex) return "var(--ae-bw)"; if (a != null && a < 1) return mixVar("--ae-bw", "--ae-clear", a); return "var(--ae-clear)"; }
    $(".ae-oils", host).innerHTML = '<div class="ae-flasks two">' + ["P", "Q"].map(function(k){ var ex = u > cap[k]; return '<figure class="ae-fl">' + flaskSVG(col(k)) + "<figcaption><strong>Oil " + k + "</strong> (1 g)<br>Bromine added: " + u + " unit" + (u === 1 ? "" : "s") + '<br><span class="ae-word">' + (!u ? "no bromine yet" : ex ? "orange-brown stays: C=C bonds used up" : "colourless: every unit absorbed") + "</span></figcaption></figure>"; }).join("") + "</div>";
    $("[data-oil=add]", host).disabled = u >= 3 || (a != null && a < 1);
    var rows = ["P", "Q"].map(function(k){ return ["Oil " + k, String(u), String(Math.min(u, cap[k])), u > cap[k] ? "yes" : u ? "not yet" : "—"]; });
    $(".ae-oiltab", host).innerHTML = MV.tableHTML({ head:["Oil (1 g)", "Units added", "Units absorbed", "Colour stays?"], rows:rows, caption:"Bromine uptake (model data)" }) +
      (u >= 3 ? '<svg class="ae-bars" viewBox="0 0 330 124" role="img" aria-label="Bar chart of bromine absorbed per gram: oil P 2 units, oil Q 1 unit"><text x="50" y="118" font-size="13" fill="var(--ink-2)">bromine absorbed per gram (model data)</text>' + ["P", "Q"].map(function(k, i){ var w = cap[k] * 85; return '<text x="40" y="' + (34 + i * 44) + '" text-anchor="end" font-size="14" fill="var(--ink)">Oil ' + k + '</text><rect x="50" y="' + (18 + i * 44) + '" width="' + w + '" height="26" rx="4" fill="var(--pen)"/><text x="' + (58 + w) + '" y="' + (35 + i * 44) + '" font-size="14" fill="var(--ink)">' + cap[k] + " unit" + (cap[k] > 1 ? "s" : "") + "/g</text>"; }).join("") + "</svg>" : "");
    paintRatio();
  }
  function paintRatio(){
    var box = $(".ae-ratio", host);
    if (S.units < 3) { box.innerHTML = '<p class="tiny muted">Add bromine until the colour stays in both flasks, then compare.</p>'; return; }
    var pick = S.ratio, o = s3.options, h = '<p class="ae-q">' + s3.q + '</p><div class="chips" role="radiogroup" aria-label="Comparison">' + o.map(function(x, i){ var on = pick === i; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-rat="' + i + '" data-k="rat' + i + '"' + (pick != null && MV.ok(o[pick]) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</div>";
    if (pick != null) h += MV.fbHTML(MV.ok(o[pick]) ? "good" : "bad", (MV.ok(o[pick]) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + o[pick].why + (MV.ok(o[pick]) ? "" : " Try again."));
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    void ratioMsg;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-oil],[data-rat]"); if (!b || b.disabled) return;
    if (b.dataset.rat != null) { S.ratio = +b.dataset.rat; api.save(); paintRatio(); MV.focusFb($(".ae-ratio", host)); return; }
    if (b.dataset.oil === "reset") { S.units = 0; S.ratio = null; anim.oil = null; api.save(); paintOils(); return; }
    S.units = Math.min(3, S.units + 1); api.save(); anim.oil = 0;
    MV.tween({ dur:1200, step:function(t){ anim.oil = t; paintOils(); }, done:function(){ anim.oil = 1; paintOils(); } });
  });
  paintTubes(); paintRes(); paintCtrl(); paintOils();
}

// ---------- Practice 1: Name it (C2 chips) ----------
var NAME_ROWS = [["Locants", ["1", "2", "3", "4", "5", "6"]], ["Multiplying prefixes", ["di", "tri"]], ["Substituent prefixes", ["methyl", "ethyl", "phenyl"]], ["Ring", ["cyclo"]],
  ["Root", ["meth", "eth", "prop", "but", "pent", "hex"]], ["Joining vowel (buta-)", ["a"]], ["Suffix", ["ane", "ene", "yne"]], ["Aromatic parent", ["benzene"]]];
function structHTML(it){ return it.ring ? ringSVG({ n:it.ring.n, dbl:it.ring.dbl, arom:it.ring.arom, subs:it.ring.subs, w:220, h:it.ring.subs ? 230 : 170, R:46, aria:MV.plain(it.t) }) : '<p class="ae-cond">' + it.t + "</p>"; }
function namesAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.it = S.it || {};
  var msgs = {}, items = a.items;
  function ist(id){ return S.it[id] || (S.it[id] = { tape:[], tries:0, hint:0, solved:false, first:null, note:"" }); }
  function cur(){ return items[S.i]; }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="ae-nav" role="group" aria-label="Structures"></div><div class="ae-nm"></div><div class="ae-nmchips"></div><div class="q-actions ae-nmact"></div><div class="ae-nmfb"></div>';
  var chips = C2.chips($(".ae-nmchips", host), { rows:NAME_ROWS, get:function(){ return ist(cur().id).tape; }, set:function(tk){ ist(cur().id).tape = tk; msgs[cur().id] = null; api.save(); paintFb(); }, locked:function(){ return ist(cur().id).solved; } });
  function paintNav(){
    MV.keepFocus($(".ae-nav", host), function(){ $(".ae-nav", host).innerHTML = items.map(function(it, i){ var x = ist(it.id); return '<button type="button" class="chip ae-navb' + (i === S.i ? " on" : "") + '" aria-pressed="' + (i === S.i) + '" data-go="' + i + '" data-k="go' + i + '" aria-label="Structure ' + (i + 1) + (x.solved ? ", named" : "") + '">' + (i + 1) + (x.solved ? " ✓" : "") + "</button>"; }).join(""); });
  }
  function paintFb(){
    var it = cur(), x = ist(it.id), h = "";
    if (x.solved) h = MV.fbHTML("good", "<strong>✓ Correct: " + C2.compose(x.tape) + ".</strong> " + (x.note || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    $(".ae-nmfb", host).innerHTML = h + MV.hintsHTML(it.hints, x.hint);
    MV.keepFocus($(".ae-nmact", host), function(){
      $(".ae-nmact", host).innerHTML = (x.solved ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="nmchk">Check name</button>' + (it.hints ? MV.hintBtn("nmhint", x.hint) : "")) +
        '<button type="button" class="btn ghost sm" data-act="prev" data-k="nmprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ghost sm" data-act="next" data-k="nmnext"' + (S.i === items.length - 1 ? " disabled" : "") + ">Next structure</button>";
    });
  }
  function paint(){
    var it = cur();
    $(".ae-nm", host).innerHTML = '<p class="ae-tgt"><strong>Structure ' + (S.i + 1) + " of " + items.length + ".</strong> " + (it.ring ? it.t + "." : "Name this molecule.") + "</p>" + structHTML(it);
    paintNav(); chips.paint(); paintFb();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.go != null) { S.i = +b.dataset.go; api.save(); paint(); return; }
    var act = b.dataset.act; if (!act) return;
    var it = cur(), x = ist(it.id);
    if (act === "prev" || act === "next") { S.i = clamp(S.i + (act === "next" ? 1 : -1), 0, items.length - 1); api.save(); paint(); return; }
    if (act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintFb(); return; }
    if (act === "check") {
      if (!x.tape.length) { msgs[it.id] = "Build a name with the chips first."; paintFb(); return; }
      var r = C2.judge(C2.compose(x.tape), MV.ans(it), it.wrong);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.note = r.msg || ""; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = r.msg; }
      api.save(); paintNav(); chips.paint(); paintFb(); MV.focusFb($(".ae-nmfb", host));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:a.summary + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 2: Predict the product (chips and N7 select-all) ----------
function productsAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, picks:{}, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), all = it.kind === "all", h = '<div class="q" data-pi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="chips ae-pchips" role="' + (all ? "group" : "radiogroup") + '" aria-label="' + (all ? "Choices (select all that apply)" : "Choices") + '">' + it.options.map(function(o, k){
      var on = all ? !!x.picks[k] : x.pick === k;
      return '<button type="button" role="' + (all ? "checkbox" : "radio") + '" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + (all ? (on ? "☑ " : "☐ ") : "") + o.t + "</button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    else h += MV.hintsHTML(it.hints, x.hint);
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
        var any = it.options.some(function(_, k){ return x.picks[k]; });
        if (!any) { msgs[it.id] = "Select at least one alkene first."; paint(); return; }
        ok = it.options.every(function(o, k){ return !!x.picks[k] === MV.ok(o); });
        if (!ok) { var bad = it.options.filter(function(o, k){ return x.picks[k] && !MV.ok(o); }).map(function(o){ return o.t + ": " + o.why; }), miss = it.options.some(function(o, k){ return !x.picks[k] && MV.ok(o); }); fb = bad.join(" ") + (miss ? (bad.length ? " " : "") + "One more alkene belongs in your selection." : ""); }
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

// ---------- Performance task: Tertiary target ----------
var TASK_ROWS = [["Locants", ["1", "2", "3", "4", "5", "6"]], ["Substituent prefix", ["methyl"]], ["Root", ["meth", "eth", "prop", "but", "pent", "hex"]], ["Suffix", ["ane", "ene", "yne"]]];
var task = (function(){
  var S = null, api = null, V = null, rL = null, rP = null, rM = null;
  function norm(){ S.L = S.L || 5; S.p = clamp(S.p || 1, 1, S.L - 1); if (S.me != null && (S.me < 1 || S.me > S.L - 2)) S.me = null; }
  function read(){
    if (!S) return { C:0 };
    norm();
    var bo = []; for (var i = 0; i < S.L - 1; i++) bo.push(i === S.p - 1 ? 2 : 1);
    var m = C1.mol({ n:S.L, bo:bo, me:S.me }), nm = C2.name(m), f = C1.formula(m), k = S.p - 1, ci = m.b[k][0], cj = m.b[k][1], h = C1.hc(m), A = C1.adj(m);
    var deg = function(x){ return A[x].filter(function(y){ return m.a[y].el === "C"; }).length; };
    var hr = addOnce(m, k, "HBr", 1), tape = C2.compose(S.tape || []), jr = tape ? C2.judge(tape, nm.name) : { ok:false };
    var line2 = h[ci] !== h[cj] || hr.single, fewer = h[ci] < h[cj] ? ci : h[cj] < h[ci] ? cj : -1;
    var line3 = fewer >= 0 ? deg(fewer) === 3 : deg(ci) === 3 && deg(cj) === 3;
    var rev = nm.parent[0] !== 0 || nm.parent.length !== S.L;
    return { m:m, name:nm.name, C:f.C, f:f, line2:line2, line3:line3, nameOK:!!jr.ok, tape:tape, rev:rev, through:nm.parent.indexOf(S.L) >= 0, tried:!!S.tried };
  }
  function paint(){
    var d = read();
    V.show(d.m, { view:"st", smax:56, path:null, aria:"Full structural formula of your alkene, " + MV.plain(F(C1.fText(d.m))) + "." });
    $("#tk-read").innerHTML = MV.readoutHTML([["Condensed formula", F(C1.condensed(d.m, C2.name(d.m).parent))], ["Molecular formula", F(C1.fText(d.m)) + " (" + d.C + " carbons)"],
      ["Numbering", d.rev ? (d.through ? "Renamed: the IUPAC chain runs through the methyl." : "Renumbered from the other end, so the C=C gets the lowest locant.") : "as entered"],
      ["IUPAC name of your alkene", d.tried ? "<strong>" + d.name + "</strong>" : '<span class="muted">Hidden until you check a name.</span>']]);
  }
  function opts(a, b, f){ var o = []; for (var i = a; i <= b; i++) o.push({ id:i, t:f(i) }); return o; }
  function fresh(id){ var h = $(id); h.innerHTML = ""; var d = document.createElement("div"); h.appendChild(d); return d; }   // radios add listeners: one host per build
  function build(){
    rL = radios(fresh("#tk-L"), { label:"Main chain", aria:"Main chain length", options:opts(4, 6, function(i){ return i + " C"; }), value:S.L, onChange:function(v){ S.L = +v; norm(); rebuild(); } });
    rP = radios(fresh("#tk-p"), { label:"C=C starts at", aria:"Carbon where the double bond starts", options:opts(1, S.L - 1, function(i){ return "C" + i; }), value:S.p, onChange:function(v){ S.p = +v; changed(); } });
    rM = radios(fresh("#tk-m"), { label:"Methyl", aria:"Methyl group position", options:[{ id:"none", t:"none" }].concat(opts(2, S.L - 1, function(i){ return "on C" + i; })), value:S.me == null ? "none" : S.me + 1, onChange:function(v){ S.me = v === "none" ? null : +v - 1; changed(); } });
  }
  function rebuild(){ build(); changed(); }
  function changed(){ api.save(); paint(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; S.tape = S.tape || []; S.L = S.L || 5; S.p = S.p || 2; if (S.me === undefined) S.me = null;
      inp.innerHTML = '<div class="ae-tkin"><div id="tk-L"></div><div id="tk-p"></div><div id="tk-m"></div></div><h4 class="ae-h4">Name it</h4><div id="tk-chips"></div>';
      pv.innerHTML = '<div id="tk-view"></div><dl class="read" id="tk-read" aria-live="polite"></dl>';
      V = C1.view($("#tk-view"), { w:520, h:300 });
      build();
      C2.chips($("#tk-chips"), { rows:TASK_ROWS, get:function(){ return S.tape; }, set:function(tk){ S.tape = tk; a.save(); a.update(); } });
      var chk = document.getElementById("task-check");
      if (chk) chk.addEventListener("click", function(){ if (S.tape.length && !S.tried) { S.tried = true; a.save(); paint(); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.C === 5 || d.C === 6, !!d.line2, !!d.line3, !!d.nameOK]; },
    key:function(d){ return d.name; }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ names:namesAct, products:productsAct },
  task:task
});
})();
