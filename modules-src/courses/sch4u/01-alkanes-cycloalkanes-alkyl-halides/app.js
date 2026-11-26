// SCH4U 01 Alkanes, Cycloalkanes and Alkyl Halides: hero (3D chain growth), chain builder (Explore: C1 + C2),
// reactions stations (Part 3), "Formulas, isomers and boiling points" set, "Three-product heptane" task, small figures.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, num = MV.num, MINUS = MV.MINUS, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function esc(s){ return MV.esc(s); }

// @component radioGroup (from MHF4U 25) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), lock(bool)}
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// @component C1 moleculeView — molecule model (heavy atoms, implicit H), symmetry (isomorphism, atom orbits, H environments),
// 2D condensed / structural / line drawings and a rotatable 3D ball-and-stick model, all as SVG in the course atom colours
// (sch4u.css: C ink, H white with --at-h-line outline, halogens teal), longest-chain highlight with locants, Hₐ/H_b environment
// letters, morph animations between two molecules, and tap-to-select atom buttons over the drawing (Tab, arrow keys, Enter).
//   C1.mol(spec)  spec = {n (main chain), ring, subs:[{at (0-based main-chain carbon), g:"methyl"|"ethyl"|"F"|"Cl"|"Br"|"I"}]}
//                 -> {a:[{el, root?, sub?}], b:[[i, j, order?]], main:[…], ring}; C1.withAtom(m, at, el) adds one atom (substitution)
//   C1.hc(m) H per atom · C1.formula(m) {C, H, Br, Cl, F, I} · C1.fText(m) "C4H9Cl" · C1.fHTML(m) · C1.iso(m1, m2)
//   C1.orbits(m) · C1.env(m) {cls:[[atom idx]], of:[class or −1], count} (topological H environments, stereo ignored)
//   C1.condensed(m, path) one-line condensed formula text for MV.chem.f ("CH3CH(CH3)CH2CH3"), null for rings
//   C1.layout2d(m, "cd"|"st"|"ln") / C1.scene3(m) scenes; C1.svg2d / C1.svg3d strings; C1.morph(A, B, map) -> t => scene
//   C1.view(host, {w, h, rotate, onPick(atomIdx, hId), label(atomIdx, hId)}) -> {show(m, o), anim(m2, o, ms, done, map), render(), stop()}
//     o = {view, pick:"atoms"|"H"|null, path:[atom idx] (highlight + locants), ring, hlUpTo, sel, env:C1.env(m), envPick, mark:{id:1}, aria}
//   C1.svgStatic(m, {view, w, h, path, aria}) whole <svg> string for figures.
var C1 = (function(){
  var VAL = { C:4, H:1, F:1, Cl:1, Br:1, I:1, O:2, N:3 };
  function mol(sp){
    var m = { a:[], b:[], main:[], ring:!!(sp.ring && sp.n >= 3) };
    for (var i = 0; i < sp.n; i++) { m.a.push({ el:"C" }); m.main.push(i); if (i) m.b.push([i - 1, i]); }
    if (m.ring) m.b.push([sp.n - 1, 0]);
    (sp.subs || []).forEach(function(s, k){
      var j = m.a.length, c = s.g === "methyl" || s.g === "ethyl";
      m.a.push({ el:c ? "C" : s.g, root:s.at, sub:k }); m.b.push([s.at, j]);
      if (s.g === "ethyl") { m.a.push({ el:"C", sub:k, tail:true }); m.b.push([j, j + 1]); }
    });
    return m;
  }
  function clone(m){ return { a:m.a.map(function(x){ return Object.assign({}, x); }), b:m.b.map(function(x){ return x.slice(); }), main:m.main.slice(), ring:m.ring }; }
  function withAtom(m, at, el){ var c = clone(m); c.b.push([at, c.a.length]); c.a.push({ el:el, root:at }); return c; }
  function adj(m){ if (!m._A) { var L = m.a.map(function(){ return []; }); m.b.forEach(function(b){ L[b[0]].push(b[1]); L[b[1]].push(b[0]); }); m._A = L; } return m._A; }
  function hc(m){
    if (!m._h) { var s = m.a.map(function(){ return 0; }); m.b.forEach(function(b){ s[b[0]] += b[2] || 1; s[b[1]] += b[2] || 1; }); m._h = m.a.map(function(a, i){ return (VAL[a.el] || 0) - s[i]; }); }
    return m._h;
  }
  function formula(m){ var f = { C:0, H:0, Br:0, Cl:0, F:0, I:0 }, h = hc(m); m.a.forEach(function(a, i){ f[a.el] = (f[a.el] || 0) + 1; f.H += Math.max(0, h[i]); }); return f; }
  function fText(m){ var f = formula(m), s = ""; ["C", "H", "Br", "Cl", "F", "I"].forEach(function(e){ if (f[e]) s += e + (f[e] > 1 ? f[e] : ""); }); return s; }

  // ---------- symmetry: colour refinement + individualization ----------
  function rank(arr){ var u = arr.slice().sort(), map = {}, k = 0; u.forEach(function(s){ if (!(s in map)) map[s] = k++; }); return arr.map(function(s){ return map[s]; }); }
  function refine(G, col){
    var k = Math.max.apply(null, col);
    for (;;) {
      var nc = rank(col.map(function(c, i){ return c + "|" + G[i].map(function(j){ return col[j]; }).sort(asc).join(","); })), k2 = Math.max.apply(null, nc);
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
      for (i = 0; i < n1; i++) for (var k = 0; k < G[i].length; k++) if (G[pos[col[i]]].indexOf(pos[col[G[i][k]]]) < 0) return false;
      return true;
    }
    var u = col.indexOf(best), fresh = Math.max.apply(null, col) + 1;
    for (var v = n1; v < col.length; v++) if (col[v] === best) { var c2 = col.slice(); c2[u] = fresh; c2[v] = fresh; if (search(G, c2, n1)) return true; }
    return false;
  }
  function iso2(m1, m2, u, v){
    var n1 = m1.a.length; if (n1 !== m2.a.length) return false;
    var G = adj(m1).map(function(l){ return l.slice(); }).concat(adj(m2).map(function(l){ return l.map(function(j){ return j + n1; }); }));
    var h1 = hc(m1), h2 = hc(m2);
    var col = rank(m1.a.map(function(a, i){ return a.el + h1[i] + (i === u ? "*" : ""); }).concat(m2.a.map(function(a, i){ return a.el + h2[i] + (i === v ? "*" : ""); })));
    return search(G, col, n1);
  }
  function iso(m1, m2){ return iso2(m1, m2, -1, -1); }
  function orbits(m){
    if (m._o) return m._o;
    var n = m.a.length, p = [], h = hc(m), i, j;
    for (i = 0; i < n; i++) p[i] = i;
    var f = function(x){ while (p[x] !== x) x = p[x] = p[p[x]]; return x; };
    var col = n ? refine(adj(m), rank(m.a.map(function(a, i){ return a.el + h[i]; }))) : [];
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (col[i] === col[j] && f(i) !== f(j) && iso2(m, m, i, j)) p[f(j)] = f(i);
    return (m._o = m.a.map(function(_, k){ return f(k); }));
  }
  function env(m){
    if (m._e) return m._e;
    var o = orbits(m), h = hc(m), idx = {}, cls = [], of = m.a.map(function(){ return -1; });
    m.a.forEach(function(a, i){ if (a.el !== "C" || h[i] <= 0) return; if (!(o[i] in idx)) { idx[o[i]] = cls.length; cls.push([]); } of[i] = idx[o[i]]; cls[of[i]].push(i); });
    return (m._e = { cls:cls, of:of, count:cls.length });
  }

  // ---------- one-line condensed formula along a path ----------
  function condensed(m, path){
    if (!path || m.ring) return null;
    var A = adj(m), h = hc(m), on = {}, cBr = m.a.some(function(a, i){ return a.el === "C" && path.indexOf(i) < 0; });
    path.forEach(function(i){ on[i] = 1; });
    function hs(i){ return h[i] ? "H" + (h[i] > 1 ? h[i] : "") : ""; }
    function branch(r, from){ var s = "", prev = from, cur = r; for (;;) { s += "C" + hs(cur); var nx = A[cur].filter(function(y){ return y !== prev; }); if (!nx.length) return s; if (nx.length > 1) return s + "…"; prev = cur; cur = nx[0]; } }
    return path.map(function(i){
      var hal = {}, br = {}, brOrder = [];
      A[i].forEach(function(j){ if (on[j]) return; if (m.a[j].el === "C") { var t = branch(j, i); if (!br[t]) { br[t] = 0; brOrder.push(t); } br[t]++; } else hal[m.a[j].el] = (hal[m.a[j].el] || 0) + 1; });
      var s = "C" + hs(i), hl = Object.keys(hal).sort().map(function(e){ return e + (hal[e] > 1 ? hal[e] : ""); });
      var inner = path.indexOf(i) > 0 && path.indexOf(i) < path.length - 1;
      if (cBr && inner) s += hl.map(function(x){ return "(" + x + ")"; }).join(""); else s += hl.join("");
      brOrder.forEach(function(t){ s += "(" + t + ")" + (br[t] > 1 ? br[t] : ""); });
      return s;
    }).join("");
  }

  // ---------- 2D layouts ----------
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
  function dist(p, q){ return Math.hypot(p[0] - q[0], p[1] - q[1]); }
  function parOf(m, i){ var a = m.a[i]; if (a.root != null) return a.root; var l = adj(m)[i].filter(function(j){ return j < i; }); return l.length ? l[0] : -1; }
  function hlab(k){ return k ? "H" + (k > 1 ? k : "") : ""; }
  function layout2d(m, view){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main, N = main.length, onMain = {}, i;
    main.forEach(function(x, k){ onMain[x] = k; });
    var grid = view !== "ln", ringM = m.ring && N >= 3, LH = view === "cd" ? 1.85 : 1, LV = view === "cd" ? 1.2 : 1;
    var roots = main.map(function(x){ return Ad[x].filter(function(j){ return !(j in onMain); }).sort(asc); }), rdir = {};
    if (ringM) {
      var side = view === "cd" ? 1.9 : view === "st" ? 1.15 : 1, R = side / (2 * Math.sin(Math.PI / N));
      main.forEach(function(x, k){ var t = -Math.PI / 2 + 2 * Math.PI * k / N; P[x] = [R * Math.cos(t), R * Math.sin(t)]; });
    } else if (grid) {
      var cb = [];
      main.forEach(function(x, k){
        var r = roots[k], single = N === 1, e0 = N > 1 && k === 0, e1 = N > 1 && k === N - 1, used = [];
        var par = k % 2 ? [U, D] : [D, U], out = single ? [RT, LF] : e0 ? [LF] : e1 ? [RT] : [];
        var cP = single ? [RT, LF, U, D] : par.concat(out), xP = single ? [RT, LF, U, D] : out.concat(par);
        var take = function(list){ for (var q = 0; q < list.length; q++) if (used.indexOf(list[q]) < 0) { used.push(list[q]); return list[q]; } return U; };
        r.filter(function(j){ return m.a[j].el === "C"; }).forEach(function(j){ rdir[j] = take(cP); });
        r.filter(function(j){ return m.a[j].el !== "C"; }).forEach(function(j){ rdir[j] = take(xP); });
        cb[k] = r.some(function(j){ return m.a[j].el === "C" && rdir[j][0] === 0; }) ? 1 : 0;
      });
      var x0 = 0, ext = view === "st" ? 0.4 : 0.15;
      main.forEach(function(x, k){ if (k) x0 += LH + ext * (cb[k - 1] + cb[k]); P[x] = [x0, 0]; });
    } else main.forEach(function(x, k){ P[x] = [k * 0.866, k % 2 ? -0.5 : 0]; });
    var cen = [0, 0]; main.forEach(function(x){ cen[0] += P[x][0] / N; cen[1] += P[x][1] / N; });
    main.forEach(function(x, k){
      var r = roots[k]; if (!r.length || (grid && !ringM)) return;
      var nb = Ad[x].filter(function(j){ return j in onMain; }).map(function(j){ return Math.atan2(P[j][1] - P[x][1], P[j][0] - P[x][0]); }), angs;
      if (!grid && !ringM && N > 1 && (k === 0 || k === N - 1) && r.length === 1) { var o2 = P[main[k === 0 ? 1 : N - 2]]; angs = [Math.atan2(-(P[x][1] - o2[1]), P[x][0] - o2[0])]; }
      else angs = gapAngles(nb, r.length + (view === "st" ? h[x] : 0)).slice(0, r.length);
      r.forEach(function(j, q){ rdir[j] = [Math.cos(angs[q]), Math.sin(angs[q])]; });
    });
    function grow(j, from, dir){
      var len = grid && !ringM ? (dir[0] === 0 ? LV : LH) : (view === "cd" ? 1.5 : 1);
      P[j] = [P[from][0] + dir[0] * len, P[from][1] + dir[1] * len];
      Ad[j].filter(function(c){ return c !== from && P[c] == null; }).sort(asc).forEach(function(c, q){
        var d2;
        if (grid) d2 = q === 0 ? dir : q === 1 ? [-dir[1], dir[0]] : [dir[1], -dir[0]];
        else {
          var a = Math.atan2(dir[1], dir[0]), s1 = a + Math.PI / 3, s2 = a - Math.PI / 3;
          var far = dist([P[j][0] + Math.cos(s1), P[j][1] + Math.sin(s1)], cen) >= dist([P[j][0] + Math.cos(s2), P[j][1] + Math.sin(s2)], cen) ? s1 : s2;
          var t = q === 0 ? far : (far === s1 ? s2 : s1); d2 = [Math.cos(t), Math.sin(t)];
        }
        grow(c, j, d2);
      });
    }
    main.forEach(function(x, k){ roots[k].forEach(function(j){ grow(j, x, rdir[j]); }); });
    for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0];
    var atoms = [], bonds = [];
    for (i = 0; i < n; i++) atoms.push({ id:"a" + i, el:m.a[i].el, x:P[i][0], y:P[i][1], i:i, par:parOf(m, i) });
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    if (view === "st") for (i = 0; i < n; i++) {
      if (h[i] <= 0) continue;
      gapAngles(Ad[i].map(function(j){ return Math.atan2(P[j][1] - P[i][1], P[j][0] - P[i][0]); }), h[i]).forEach(function(t, q){
        bonds.push({ a:i, b:atoms.length, o:1 });
        atoms.push({ id:"h" + i + "." + q, el:"H", x:P[i][0] + 0.62 * Math.cos(t), y:P[i][1] + 0.62 * Math.sin(t), i:-1, par:i, isH:true });
      });
    }
    atoms.forEach(function(a){
      if (a.isH) { a.lbl = "H"; return; }
      var k = a.i;
      if (a.el !== "C") a.lbl = a.el;
      else if (view === "st") a.lbl = "C";
      else if (view === "cd") { var nb = Ad[k], lw = nb.length === 1 && P[nb[0]][0] > P[k][0] + 0.3; a.lbl = lw && h[k] ? hlab(h[k]) + "C" : "C" + hlab(h[k]); }
      else a.lbl = Ad[k].length ? "" : "C" + hlab(h[k]);
    });
    return { atoms:atoms, bonds:bonds, view:view };
  }

  // ---------- 3D coordinates (tetrahedral, anti zig-zag) ----------
  function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function crs(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function nrm(a){ var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  var BL = { CC:1.54, CH:1.09, CF:1.35, CCl:1.77, CBr:1.94, CI:2.14 };
  function bl(e1, e2){ return BL[e1 === "C" ? "C" + e2 : "C" + e1] || 1.5; }
  var TET = [nrm([1, 1, 1]), nrm([1, -1, -1]), nrm([-1, 1, -1]), nrm([-1, -1, 1])];
  function pair(u1, u2){ var b = nrm(add(u1, u2)), c = nrm(crs(u1, u2)); return [add(mul(b, -0.5774), mul(c, 0.8165)), add(mul(b, -0.5774), mul(c, -0.8165))]; }
  function perp(u){ var p = crs(u, [0, 0, 1]); if (Math.hypot(p[0], p[1], p[2]) < 1e-6) p = crs(u, [0, 1, 0]); return nrm(p); }
  function scene3(m){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main, N = main.length, done = {}, q = [], i;
    if (m.ring && N >= 3) {
      var R = 1.54 / (2 * Math.sin(Math.PI / N));
      main.forEach(function(x, k){ var t = 2 * Math.PI * k / N, z = N === 3 ? 0 : N === 4 ? (k % 2 ? -0.13 : 0.13) : N % 2 ? 0.22 * Math.cos(4 * Math.PI * k / N) : (k % 2 ? -0.25 : 0.25); P[x] = [R * Math.cos(t), z, R * Math.sin(t)]; });
    } else main.forEach(function(x, k){ P[x] = [k * 1.258, k % 2 ? -0.889 : 0, 0]; });
    main.forEach(function(x){ done[x] = 1; q.push(x); });
    var Hs = [];
    function freeDirs(x){
      var pl = Ad[x].filter(function(j){ return done[j]; }), us = pl.map(function(j){ return nrm(sub(P[j], P[x])); });
      if (!us.length) return TET;
      if (us.length === 1) {
        var u = us[0], p = pl[0], g = Ad[p].filter(function(j){ return j !== x && done[j]; })[0];
        var a = g != null ? nrm(sub(P[p], P[g])) : perp(u), pa = sub(a, mul(u, dot(a, u)));
        pa = Math.hypot(pa[0], pa[1], pa[2]) < 1e-6 ? perp(u) : nrm(pa);
        a = add(mul(u, -1 / 3), mul(pa, 0.9428));
        var two = pair(u, a); return [a, two[0], two[1]];
      }
      if (us.length === 2) return pair(us[0], us[1]);
      if (us.length === 3) return [nrm(mul(add(add(us[0], us[1]), us[2]), -1))];
      return [];
    }
    while (q.length) {
      var x = q.shift(), dirs = freeDirs(x), fr = Ad[x].filter(function(j){ return !done[j]; }).sort(asc);
      fr.forEach(function(j, k){ P[j] = add(P[x], mul(dirs[k] || TET[k], bl(m.a[x].el, m.a[j].el))); done[j] = 1; q.push(j); });
      for (var t = 0; t < h[x]; t++) Hs.push({ par:x, k:t, p:add(P[x], mul(dirs[fr.length + t] || TET[t], bl(m.a[x].el, "H"))) });
    }
    for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0, 0];
    var c = [0, 0, 0], all = P.concat(Hs.map(function(o){ return o.p; }));
    all.forEach(function(p){ c = add(c, mul(p, 1 / all.length)); });
    var atoms = [], bonds = [];
    for (i = 0; i < n; i++) { var p0 = sub(P[i], c); atoms.push({ id:"a" + i, el:m.a[i].el, x:p0[0], y:p0[1], z:p0[2], i:i, par:parOf(m, i) }); }
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    Hs.forEach(function(o){ var p1 = sub(o.p, c); bonds.push({ a:o.par, b:atoms.length, o:1 }); atoms.push({ id:"h" + o.par + "." + o.k, el:"H", x:p1[0], y:p1[1], z:p1[2], i:-1, par:o.par, isH:true }); });
    return { atoms:atoms, bonds:bonds, view:"3d" };
  }

  // ---------- morph between two scenes (atoms matched by id, then by parent, then in order) ----------
  function lerp(a, b, t){ return a + (b - a) * t; }
  function morph(A, B, map){
    var bi = {}, used = {}, pairs = [], leftA = [], leftB = [];
    B.atoms.forEach(function(x, k){ bi[x.id] = k; });
    A.atoms.forEach(function(x, k){ var id = (map && map[x.id]) || x.id; if (id in bi && !used[bi[id]]) { pairs.push([k, bi[id]]); used[bi[id]] = 1; } else leftA.push(k); });
    B.atoms.forEach(function(x, k){ if (!used[k]) leftB.push(k); });
    leftA.slice().forEach(function(ka){
      var j = leftB.filter(function(kb){ return B.atoms[kb].par === A.atoms[ka].par; })[0];
      if (j != null && !(map && map[A.atoms[ka].id])) { pairs.push([ka, j]); leftB.splice(leftB.indexOf(j), 1); leftA.splice(leftA.indexOf(ka), 1); }
    });
    return function(t){
      var atoms = [], ia = {}, ib = {};
      pairs.forEach(function(p){ var a = A.atoms[p[0]], b = B.atoms[p[1]], o = Object.assign({}, t < 0.5 ? a : b);
        o.x = lerp(a.x, b.x, t); o.y = lerp(a.y, b.y, t); o.z = lerp(a.z || 0, b.z || 0, t); ia[p[0]] = ib[p[1]] = atoms.length; atoms.push(o); });
      leftA.forEach(function(k){ var o = Object.assign({}, A.atoms[k]); o.op = 1 - t; ia[k] = atoms.length; atoms.push(o); });
      leftB.forEach(function(k){ var b = B.atoms[k], o = Object.assign({}, b); o.op = t; o.x = b.x + (1 - t) * 2.5; ib[k] = atoms.length; atoms.push(o); });
      var src = t < 0.5 ? A : B, ix = t < 0.5 ? ia : ib;
      return { atoms:atoms, bonds:src.bonds.map(function(b){ return { a:ix[b.a], b:ix[b.b], o:b.o }; }), view:src.view };
    };
  }

  // ---------- SVG renderers ----------
  var PAL = ["--pen", "--p-k", "--acol", "--p-c", "--p-b", "--p-t"], LET = "abcdef";
  var RAD = { C:0.36, H:0.24, F:0.33, Cl:0.45, Br:0.5, I:0.56 };
  function r1(v){ return Math.round(v * 10) / 10; }
  function tsp(t, fs, sub){ // digits (or the env letter) as subscripts
    var out = "", low = false, d = r1(fs * 0.28);
    String(t).replace(/(\d+|\D+)/g, function(seg){
      var dig = /^\d/.test(seg);
      if (dig && !low) { out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.72) + '">' + seg + "</tspan>"; low = true; }
      else if (!dig && low) { out += '<tspan dy="' + (-d) + '">' + seg + "</tspan>"; low = false; }
      else out += seg;
      return seg;
    });
    if (sub) out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.7) + '">' + sub + "</tspan>";
    return out;
  }
  function estW(t, fs){ var w = 0; String(t).split("").forEach(function(ch){ w += /\d/.test(ch) ? 0.42 : /[a-z]/.test(ch) ? 0.5 : 0.66; }); return w * fs; }
  function atomByI(sc, i){ for (var k = 0; k < sc.atoms.length; k++) if (sc.atoms[k].i === i) return k; return -1; }
  function fit2(sc, W, H, smx){
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, cd = sc.view === "cd";
    sc.atoms.forEach(function(a){ x0 = Math.min(x0, a.x); x1 = Math.max(x1, a.x); y0 = Math.min(y0, a.y); y1 = Math.max(y1, a.y); });
    var px = cd ? 0.95 : 0.6, py = 0.65, smax = smx || { st:64, cd:50, ln:80 }[sc.view] || 60;
    var s = Math.min((W - 24) / (x1 - x0 + 2 * px), (H - 24) / (y1 - y0 + 2 * py), smax);
    return { s:s, ox:W / 2 - (x0 + x1) / 2 * s, oy:H / 2 - (y0 + y1) / 2 * s };
  }
  function fit3(sc, W, H){
    var R = 0.5; sc.atoms.forEach(function(a){ R = Math.max(R, Math.hypot(a.x, a.y, a.z || 0) + (RAD[a.el] || 0.3)); });
    return { s:Math.min(Math.min(W, H) * 0.48 / R, 96), ox:W / 2, oy:H / 2 };
  }
  function lerpFit(a, b, t){ return { s:lerp(a.s, b.s, t), ox:lerp(a.ox, b.ox, t), oy:lerp(a.oy, b.oy, t) }; }
  function pathPts(sc, o){
    if (!o.path || !o.path.length) return [];
    var L = o.hlUpTo == null ? o.path.length : o.hlUpTo, out = [];
    for (var k = 0; k < Math.min(L, o.path.length); k++) { var q = atomByI(sc, o.path[k]); if (q >= 0) out.push(q); }
    return out;
  }
  function locPos(sc, k, fit, fs){
    var a = sc.atoms[k], angs = [], cd = sc.view === "cd";
    sc.bonds.forEach(function(b){ var o = b.a === k ? b.b : b.b === k ? b.a : -1; if (o >= 0 && sc.atoms[o].op !== 0) angs.push(Math.atan2(sc.atoms[o].y - a.y, sc.atoms[o].x - a.x)); });
    var P = Math.PI, cand = [P / 2, -P / 2, P / 4, 3 * P / 4, -P / 4, -3 * P / 4, 0, P], thr = cd ? 0.75 : 0.6, best = P / 2;
    function far(t){ return angs.every(function(x){ return Math.abs(Math.atan2(Math.sin(t - x), Math.cos(t - x))) > thr; }); }
    for (var i = 0; i < cand.length; i++) if (far(cand[i])) { best = cand[i]; break; }
    if (i === cand.length && angs.length) best = gapAngles(angs, 1)[0];
    var r = fs * (cd ? 0.95 : (Math.abs(Math.cos(best)) > 0.3 && Math.abs(Math.sin(best)) > 0.3 ? 0.62 : 0.85));
    return [fit.ox + a.x * fit.s + Math.cos(best) * r, fit.oy + a.y * fit.s + Math.sin(best) * r];
  }
  function svg2d(sc, fit, o){
    var s = fit.s, fs = clamp(s * (sc.view === "cd" ? 0.44 : 0.44), 11, 23), out = "", X = function(a){ return fit.ox + a.x * s; }, Y = function(a){ return fit.oy + a.y * s; };
    var pp = pathPts(sc, o);
    if (pp.length) {
      var pts = pp.map(function(k){ return r1(X(sc.atoms[k])) + "," + r1(Y(sc.atoms[k])); });
      if (o.ring && pp.length === o.path.length && pp.length > 2) pts.push(pts[0]);
      out += pp.length > 1 ? '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--pen)" stroke-opacity=".28" stroke-width="' + r1(clamp(s * 0.4, 9, 20)) + '" stroke-linecap="round" stroke-linejoin="round"/>' :
        '<circle cx="' + r1(X(sc.atoms[pp[0]])) + '" cy="' + r1(Y(sc.atoms[pp[0]])) + '" r="' + r1(clamp(s * 0.3, 8, 14)) + '" fill="var(--pen)" fill-opacity=".28"/>';
    }
    if (o.sel != null) { var ks = atomByI(sc, o.sel); if (ks >= 0) out += '<circle cx="' + r1(X(sc.atoms[ks])) + '" cy="' + r1(Y(sc.atoms[ks])) + '" r="' + r1(fs * 0.95) + '" fill="var(--hi)" fill-opacity=".75"/>'; }
    var ext = sc.atoms.map(function(a){ var t = labelOf(a, o); return t.txt ? [estW(t.txt, fs) / 2 + 2, fs * 0.45] : null; });
    sc.bonds.forEach(function(b){
      var A = sc.atoms[b.a], B = sc.atoms[b.b]; if (!A || !B) return;
      var ax = X(A), ay = Y(A), bx = X(B), by = Y(B), dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      var ta = ext[b.a] ? Math.min(ux ? ext[b.a][0] / Math.abs(ux) : 1e9, uy ? ext[b.a][1] / Math.abs(uy) : 1e9) : 0, tb = ext[b.b] ? Math.min(ux ? ext[b.b][0] / Math.abs(ux) : 1e9, uy ? ext[b.b][1] / Math.abs(uy) : 1e9) : 0;
      if (ta + tb >= L - 2) return;
      var op = Math.min(A.op == null ? 1 : A.op, B.op == null ? 1 : B.op);
      out += '<line x1="' + r1(ax + ux * ta) + '" y1="' + r1(ay + uy * ta) + '" x2="' + r1(bx - ux * tb) + '" y2="' + r1(by - uy * tb) + '" stroke="var(--ink)" stroke-width="' + r1(clamp(s * 0.045, 1.6, 2.6)) + '" stroke-linecap="round"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + "/>";
    });
    sc.atoms.forEach(function(a, k){
      var t = labelOf(a, o); if (!t.txt) return;
      var x = r1(X(a)), y = r1(Y(a)), op = a.op == null ? 1 : a.op;
      if (t.ring) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(fs * 0.78) + '" fill="none" stroke="' + t.fill + '" stroke-width="2.5"/>';
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * (a.isH ? 0.92 : 1)) + '" font-weight="' + (t.bold ? 700 : 400) + '" fill="' + t.fill + '"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + ">" + tsp(t.txt, fs, t.sub) + "</text>";
    });
    if (o.locants !== false && pp.length) pp.forEach(function(k, q){ var p = locPos(sc, k, fit, fs); out += '<text x="' + r1(p[0]) + '" y="' + r1(p[1]) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.6) + '" font-weight="700" fill="var(--ink-2)">' + (q + 1) + "</text>"; });
    return out;
  }
  function labelOf(a, o){
    if (a.isH) {
      if (o.mark && o.mark[a.id]) return { txt:"H", fill:"var(--p-k)", bold:true, ring:true };
      if (o.env) { var c = o.env.of[a.par]; if (c >= 0) return { txt:"H", sub:LET[c], fill:"var(" + PAL[c % PAL.length] + ")", bold:true, ring:o.envPick === c }; }
      return { txt:"H", fill:"var(--ink-2)" };
    }
    if (!a.lbl) return { txt:"" };
    if (a.el === "C") return { txt:a.lbl, fill:"var(--at-c)" };
    return { txt:a.lbl, fill:"var(--at-x)", bold:true };
  }
  function proj(p, rot){
    var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
    var x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
    return [x, y * cx - z * sx, y * sx + z * cx];
  }
  function svg3d(sc, rot, fit, o, uid){
    var s = fit.s, pr = sc.atoms.map(function(a){ return proj([a.x, a.y, a.z || 0], rot); }), Rm = 0.1, items = [], out = "", g = "c1g" + uid;
    pr.forEach(function(p){ Rm = Math.max(Rm, Math.abs(p[2])); });
    var hl = {}, pp = o.path || [], L = o.hlUpTo == null ? pp.length : o.hlUpTo;
    for (var k = 1; k < Math.min(L, pp.length); k++) { hl[pp[k - 1] + "-" + pp[k]] = hl[pp[k] + "-" + pp[k - 1]] = 1; }
    if (o.ring && L >= pp.length && pp.length > 2) hl[pp[0] + "-" + pp[pp.length - 1]] = hl[pp[pp.length - 1] + "-" + pp[0]] = 1;
    sc.bonds.forEach(function(b){ if (pr[b.a] && pr[b.b]) items.push({ z:(pr[b.a][2] + pr[b.b][2]) / 2 - 0.05, b:b }); });
    sc.atoms.forEach(function(a, k2){ items.push({ z:pr[k2][2], k:k2 }); });
    items.sort(function(p, q){ return p.z - q.z; });
    out += '<defs><radialGradient id="' + g + '" cx=".3" cy=".27" r=".42"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
    var X = function(p){ return r1(fit.ox + p[0] * s); }, Y = function(p){ return r1(fit.oy + p[1] * s); };
    items.forEach(function(it){
      if (it.b) {
        var A = sc.atoms[it.b.a], B = sc.atoms[it.b.b], on = A.i >= 0 && B.i >= 0 && hl[A.i + "-" + B.i], op = Math.min(A.op == null ? 1 : A.op, B.op == null ? 1 : B.op);
        var pa = pr[it.b.a], pb = pr[it.b.b], dx = (pb[0] - pa[0]) * s, dy = (pb[1] - pa[1]) * s, L = Math.hypot(dx, dy) || 1, ra = (RAD[A.el] || 0.3) * s * 0.8, rb = (RAD[B.el] || 0.3) * s * 0.8;
        if (L <= ra + rb) return;   // stick hidden behind the balls (points at the viewer)
        out += '<line x1="' + r1(fit.ox + pa[0] * s + dx / L * ra) + '" y1="' + r1(fit.oy + pa[1] * s + dy / L * ra) + '" x2="' + r1(fit.ox + pb[0] * s - dx / L * rb) + '" y2="' + r1(fit.oy + pb[1] * s - dy / L * rb) + '" stroke="var(' + (on ? "--pen" : "--ink-2") + ')" stroke-width="' + r1(s * (on ? 0.2 : 0.12)) + '" stroke-linecap="round"' + (op < 1 ? ' opacity="' + r1(op) + '"' : "") + "/>";
        return;
      }
      var a = sc.atoms[it.k], p = pr[it.k], r = (RAD[a.el] || 0.3) * s * (1 + 0.07 * p[2] / Rm), col = MV.chem.atom(a.el), op2 = a.op == null ? 1 : a.op, x = X(p), y = Y(p);
      out += "<g" + (op2 < 1 ? ' opacity="' + r1(op2) + '"' : "") + ">";
      if (o.sel != null && a.i === o.sel) out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r + 5) + '" fill="none" stroke="var(--hi)" stroke-width="5"/>';
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.5"' : "") + "/>";
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="url(#' + g + ')"/>';
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(r * (a.el.length > 1 ? 0.82 : 1.05)) + '" font-weight="700" fill="' + col.ink + '">' + a.el + "</text></g>";
    });
    return out;
  }
  function svgStatic(m, o){
    var W = o.w || 320, H = o.h || 200, sc = o.view === "3d" ? scene3(m) : layout2d(m, o.view || "ln"), fit = o.view === "3d" ? fit3(sc, W, H) : fit2(sc, W, H, o.smax);
    return '<svg class="c1-static" viewBox="0 0 ' + W + " " + H + '" ' + (o.aria ? 'role="img" aria-label="' + esc(o.aria) + '"' : 'aria-hidden="true"') + ">" + (o.view === "3d" ? svg3d(sc, o.rot || { x:-0.45, y:0.6 }, fit, o, "s" + (++UID)) : svg2d(sc, fit, o)) + "</svg>";
  }

  // ---------- view widget ----------
  var UID = 0;
  function view(host, opts){
    opts = opts || {};
    var uid = ++UID, W = opts.w || 640, H = opts.h || 400, aspect = H / W;
    host.innerHTML = '<div class="c1-wrap"><svg class="c1-svg" viewBox="0 0 ' + W + " " + H + '" role="img"></svg><div class="c1-ov"></div></div>' +
      (opts.rotate ? '<div class="c1-rot" hidden><span class="tiny muted">Rotate the model:</span><button type="button" class="btn ghost sm" data-rot="l" aria-label="Rotate left">⟲</button><button type="button" class="btn ghost sm" data-rot="r" aria-label="Rotate right">⟳</button><button type="button" class="btn ghost sm" data-rot="u" aria-label="Tilt up">↑</button><button type="button" class="btn ghost sm" data-rot="d" aria-label="Tilt down">↓</button><span class="tiny muted">or drag it</span></div>' : "");
    var svg = $(".c1-svg", host), ov = $(".c1-ov", host), rb = $(".c1-rot", host);
    var st = { m:null, o:{ view:"cd" }, rot:{ x:-0.45, y:0.6 }, cache:{}, cm:null, busy:false, cancel:null };
    // one SVG unit = one CSS pixel, so atom labels keep a readable size on phones
    function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 500 ? Math.max(aspect, 0.72) : aspect)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
    if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0 && !st.busy) render(); }).observe(svg);
    function sceneOf(m, v){ if (st.cm !== m) { st.cm = m; st.cache = {}; } return st.cache[v] || (st.cache[v] = v === "3d" ? scene3(m) : layout2d(m, v)); }
    function fitOf(sc){ return sc.view === "3d" ? fit3(sc, W, H) : fit2(sc, W, H); }
    function scr(sc, fit, a){ if (sc.view === "3d") { var p = proj([a.x, a.y, a.z || 0], st.rot); return [fit.ox + p[0] * fit.s, fit.oy + p[1] * fit.s]; } return [fit.ox + a.x * fit.s, fit.oy + a.y * fit.s]; }
    function paint(sc, fit, o, noOv){
      svg.innerHTML = sc.view === "3d" ? svg3d(sc, st.rot, fit, o, uid) : svg2d(sc, fit, o);
      svg.setAttribute("aria-label", o.aria || "Molecule");
      if (rb) rb.hidden = sc.view !== "3d";
      if (noOv || !o.pick) { ov.innerHTML = ""; return; }
      var list = [];
      if (o.pick === "H") sc.atoms.forEach(function(a){ if (a.isH) list.push({ a:a, ai:a.par, h:a.id }); });
      else { var m = st.m; m.main.forEach(function(i){ list.push({ ai:i }); }); m.a.forEach(function(a, i){ if (a.root != null) list.push({ ai:i }); }); list.forEach(function(x){ x.a = sc.atoms[atomByI(sc, x.ai)]; }); }
      var html = list.filter(function(x){ return x.a; }).map(function(x){
        var p = scr(sc, fit, x.a), on = o.pick === "H" ? (o.envPick != null && o.env && o.env.of[x.ai] === o.envPick) : o.sel === x.ai;
        return '<button type="button" class="c1-b' + (o.pick === "H" ? " h" : "") + '" style="left:' + r1(p[0] / W * 100) + "%;top:" + r1(p[1] / H * 100) + '%" data-k="c1' + uid + "-" + (x.h || x.ai) + '" data-ai="' + x.ai + '"' + (x.h ? ' data-h="' + x.h + '"' : "") + ' aria-pressed="' + on + '" aria-label="' + esc(opts.label ? opts.label(x.ai, x.h) : "Atom") + '"></button>';
      }).join("");
      MV.keepFocus(ov, function(){ ov.innerHTML = html; });
    }
    function render(){ if (!st.m || st.busy) return; size(); var sc = sceneOf(st.m, st.o.view); paint(sc, fitOf(sc), st.o); }
    function stop(){ if (st.cancel) st.cancel(); st.cancel = null; st.busy = false; }
    ov.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b && opts.onPick) opts.onPick(+b.dataset.ai, b.dataset.h || null, e.detail === 0); });
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
    return {
      show:function(m, o){ stop(); st.m = m; st.o = o || st.o; render(); },
      render:render, stop:stop, busy:function(){ return st.busy; }, rot:st.rot,
      // morph from the shown molecule to m2 (same view); map overrides id matching
      anim:function(m2, o2, dur, done, map){
        stop();
        if (!st.m) { st.m = m2; st.o = o2; render(); if (done) done(); return; }
        size(); var v = o2.view, A = sceneOf(st.m, v), B = v === "3d" ? scene3(m2) : layout2d(m2, v), fA = fitOf(A), fB = fitOf(B), mf = morph(A, B, map), oA = st.o;
        st.busy = true; ov.innerHTML = "";
        st.cancel = MV.tween({ dur:dur, step:function(t){ var sc = mf(t); paint(sc, lerpFit(fA, fB, t), t < 0.5 ? Object.assign({}, oA, { view:v }) : o2, true); },
          done:function(){ st.busy = false; st.cancel = null; st.m = m2; st.o = o2; render(); if (done) done(); } });
      },
      // redraw the current molecule with temporary options (no state change), e.g. a highlight that grows step by step
      paintWith:function(o){ if (!st.m) return; var sc = sceneOf(st.m, o.view || st.o.view); paint(sc, fitOf(sc), Object.assign({}, st.o, o), true); }
    };
  }
  return { mol:mol, withAtom:withAtom, adj:adj, hc:hc, formula:formula, fText:fText, fHTML:function(m){ return F(fText(m)); }, iso:iso, orbits:orbits, env:env,
    condensed:condensed, layout2d:layout2d, scene3:scene3, morph:morph, svg2d:svg2d, svg3d:svg3d, fit2:fit2, fit3:fit3, lerpFit:lerpFit, svgStatic:svgStatic, view:view, PAL:PAL, LET:LET };
})();

// @component C2 nameBuilder — IUPAC names for alkanes, cycloalkanes and alkyl halides from a C1 molecule (longest chain, most
// substituents, lowest locants, alphabetical citation and tie-break, di/tri/tetra, no locant for methane, monosubstituted ethane
// and rings), name → structure parsing, a judge that names the mistake, and the chip palette (locants, multiplying prefixes,
// substituent prefixes, cyclo, parent stems, -ane). Needs C1 (mol, adj, hc, iso, formula).
//   C2.name(m) -> {name, parent:[atom idx in numbering order], ring, n, locs}   C2.parse(str) -> {ok, msg | n, ring, groups, mol}
//   C2.judge(str, m) -> {ok, msg, same (same molecule)}   C2.compose(tokens) "2-chloro-3-methylpentane"
//   C2.chips(host, {subs:[…], get(), set(tokens), locked(), onChange(str)}) -> {paint()}
//   C2.alt: [{re, msg}] older forms to accept (none for alkanes; later modules add "2-butene" → but-2-ene and so on).
var C2 = (function(){
  var STEM = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec", "undec", "dodec", "tridec", "tetradec", "pentadec"];
  var MULT = ["", "", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa"], HAL = { F:"fluoro", Cl:"chloro", Br:"bromo", I:"iodo" };
  var M1 = "Bends don’t make branches. Trace every path and count the longest continuous chain.";
  var M2 = "Number from the end that gives the substituents the lowest set of locants.";
  var M3 = "List prefixes alphabetically, ignoring di-, tri-: chloro before methyl, ethyl before methyl.";
  function cmpArr(a, b){ for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }
  function assemble(c, sub){
    var g = {}, order = [];
    c.subs.forEach(function(s){ if (!g[s.name]) { g[s.name] = { name:s.name, key:s.key, locs:[] }; order.push(g[s.name]); } g[s.name].locs.push(s.loc); });
    order.sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });
    var n = c.path.length, show = sub || !((!c.ring && n === 1) || (!c.ring && n === 2 && c.subs.length === 1) || (c.ring && c.subs.length === 1));
    return order.map(function(x){ x.locs.sort(asc); return (show ? x.locs.join(",") + "-" : "") + MULT[x.locs.length] + x.name; }).join(show ? "-" : "") + (c.ring ? "cyclo" : "") + STEM[n] + (sub ? "yl" : "ane");
  }
  function cand(m, A, path, ring, excl){
    var subs = [], on = {}; path.forEach(function(i){ on[i] = 1; });
    path.forEach(function(i, k){ A[i].forEach(function(j){ if (on[j] || j === excl) return; var nm = m.a[j].el === "C" ? alkyl(m, A, j, i) : { name:HAL[m.a[j].el] || m.a[j].el.toLowerCase(), key:HAL[m.a[j].el] || m.a[j].el.toLowerCase() }; subs.push({ loc:k + 1, name:nm.name, key:nm.key, atom:j }); }); });
    var c = { path:path, ring:ring, subs:subs, locs:subs.map(function(s){ return s.loc; }).sort(asc) };
    c.alpha = subs.slice().sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : a.loc - b.loc; }).map(function(s){ return s.loc; });
    return c;
  }
  function cmpCand(a, b){ return (b.path.length - a.path.length) || (b.subs.length - a.subs.length) || cmpArr(a.locs, b.locs) || cmpArr(a.alpha, b.alpha) || (a.str < b.str ? -1 : a.str > b.str ? 1 : 0); }
  function alkyl(m, A, r, from){
    var seen = {}, st = [r], nodes = [];
    seen[from] = 1;
    while (st.length) { var x = st.pop(); if (seen[x]) continue; seen[x] = 1; nodes.push(x); A[x].forEach(function(y){ if (!seen[y]) st.push(y); }); }
    var linear = nodes.every(function(x){ return m.a[x].el === "C"; }), prev = from, cur = r, cnt = 1;
    while (linear) { var nx = A[cur].filter(function(y){ return y !== prev; }); if (!nx.length) break; if (nx.length > 1) { linear = false; break; } prev = cur; cur = nx[0]; cnt++; }
    if (linear && cnt === nodes.length) return { name:STEM[cnt] + "yl", key:STEM[cnt] + "yl" };
    var C = nodes.filter(function(x){ return m.a[x].el === "C"; }), par = {}, Q = [r], cands = [];
    par[r] = -1;
    while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (z !== from && !(z in par) && m.a[z].el === "C") { par[z] = y; Q.push(z); } }); }
    C.forEach(function(e){ var p = []; for (var z = e; z !== -1; z = par[z]) p.unshift(z); var c = cand(m, A, p, false, from); c.str = assemble(c, true); cands.push(c); });
    cands.sort(cmpCand);
    var inner = cands[0].str;
    return { name:"(" + inner + ")", key:inner.replace(/[^a-z]/g, "") };
  }
  function name(m){
    if (m._nm) return m._nm;
    var A = C1.adj(m), isC = function(i){ return m.a[i].el === "C"; }, C = [], i;
    for (i = 0; i < m.a.length; i++) if (isC(i)) C.push(i);
    if (!C.length) return { name:"", parent:[], ring:false, n:0, locs:[] };
    var deg = {}, alive = {}, q = [];
    C.forEach(function(x){ alive[x] = 1; deg[x] = A[x].filter(isC).length; if (deg[x] <= 1) q.push(x); });
    while (q.length) { var x = q.pop(); if (!alive[x]) continue; alive[x] = 0; A[x].forEach(function(y){ if (isC(y) && alive[y]) { deg[y]--; if (deg[y] <= 1) q.push(y); } }); }
    var ring = C.filter(function(x){ return alive[x]; }), cands = [];
    if (ring.length) {
      var ord = [ring[0]], prev = -1, cur = ring[0];
      while (ord.length < ring.length) { var nx = A[cur].filter(function(y){ return alive[y] && y !== prev && ord.indexOf(y) < 0; })[0]; if (nx == null) break; ord.push(nx); prev = cur; cur = nx; }
      for (var s = 0; s < ord.length; s++) for (var d = -1; d <= 1; d += 2) { var path = []; for (var k = 0; k < ord.length; k++) path.push(ord[((s + d * k) % ord.length + ord.length) % ord.length]); cands.push(cand(m, A, path, true)); }
    } else {
      var ends = C.filter(function(x){ return A[x].filter(isC).length <= 1; }), best = 0, paths = [];
      ends.forEach(function(e){
        var par = {}, dist = {}, Q = [e]; par[e] = -1; dist[e] = 1;
        while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (isC(z) && !(z in par)) { par[z] = y; dist[z] = dist[y] + 1; Q.push(z); } }); }
        ends.forEach(function(f){ if (dist[f] >= best) { if (dist[f] > best) { best = dist[f]; paths = []; } var p = []; for (var z = f; z !== -1; z = par[z]) p.unshift(z); paths.push(p); } });
      });
      paths.forEach(function(p){ cands.push(cand(m, A, p, false)); });
    }
    cands.forEach(function(c){ c.str = assemble(c); });
    cands.sort(cmpCand);
    var b = cands[0];
    return (m._nm = { name:b.str, parent:b.path, ring:b.ring, n:b.path.length, locs:b.locs, subs:b.subs });
  }
  // ---------- name → structure ----------
  var SUBS = ["methyl", "ethyl", "propyl", "butyl", "fluoro", "chloro", "bromo", "iodo"], MUL = { di:2, tri:3, tetra:4, penta:5, hexa:6 };
  var EL = { fluoro:"F", chloro:"Cl", bromo:"Br", iodo:"I" }, LEN = { methyl:1, ethyl:2, propyl:3, butyl:4 };
  function norm(s){ return String(s || "").toLowerCase().replace(/\s+/g, "").replace(/[‐-―−]/g, "-"); }
  function parse(str){
    var s = norm(str);
    if (!s) return { ok:false, msg:"Build a name first." };
    var mm = s.match(/(cyclo)?(meth|eth|prop|but|pent|hex|hept|oct|non|dec|undec|dodec|tridec|tetradec)(ane)?$/);
    if (!mm) return { ok:false, msg:"End the name with the parent chain (meth, eth, prop, …) and the suffix -ane." };
    if (!mm[3]) return { ok:false, msg:"Finish with the suffix -ane: alkanes end in -ane." };
    var ring = !!mm[1], n = STEM.indexOf(mm[2]), pre = s.slice(0, mm.index).replace(/-$/, ""), groups = [], i = 0;
    if (ring && n < 3) return { ok:false, msg:"A ring needs at least 3 carbons." };
    while (i < pre.length) {
      var g = { locs:null, mult:1 }, rest = pre.slice(i), lm = rest.match(/^(\d+(?:,\d+)*)-/);
      if (lm) { g.locs = lm[1].split(",").map(Number); i += lm[0].length; rest = pre.slice(i); }
      var mt = rest.match(/^(di|tri|tetra|penta|hexa)(?=methyl|ethyl|propyl|butyl|fluoro|chloro|bromo|iodo)/);
      if (mt) { g.mult = MUL[mt[1]]; i += mt[0].length; rest = pre.slice(i); }
      var sm = rest.match(/^(methyl|ethyl|propyl|butyl|fluoro|chloro|bromo|iodo)/);
      if (!sm) return { ok:false, msg:"Part of the name isn’t in the right order. Each group is written locants, then di-/tri- if needed, then the prefix: 2,3-dimethyl." };
      g.sub = sm[1]; i += sm[0].length; if (pre[i] === "-") i++;
      groups.push(g);
    }
    var total = groups.reduce(function(t, x){ return t + x.mult; }, 0), need = !((!ring && n === 1) || (!ring && n === 2 && total === 1) || (ring && total === 1));
    var seen = {};
    for (var k = 0; k < groups.length; k++) {
      var G = groups[k];
      if (seen[G.sub]) return { ok:false, msg:"Repeated prefixes combine with di-: 2,3-dimethyl, not 2-methyl-3-methyl." };
      seen[G.sub] = 1;
      if (G.locs && G.locs.length > 1 && G.mult === 1) return { ok:false, msg:"Two " + G.sub + " groups need the prefix di- (three need tri-)." };
      if (G.locs && G.mult > 1 && G.locs.length !== G.mult) return { ok:false, msg:"Each " + G.sub + " group needs its own locant: " + (G.mult === 2 ? "di- takes two locants, like 2,2-." : "the number of locants must match the multiplying prefix.") };
      if (!G.locs && need) return { ok:false, msg:"Say where each group goes: put its locant in front, like 2-" + G.sub + "." };
    }
    var m = { a:[], b:[], main:[], ring:ring }, c;
    for (c = 0; c < n; c++) { m.a.push({ el:"C" }); m.main.push(c); if (c) m.b.push([c - 1, c]); }
    if (ring) m.b.push([n - 1, 0]);
    for (k = 0; k < groups.length; k++) {
      var gg = groups[k], locs = gg.locs || Array.apply(null, Array(gg.mult)).map(function(){ return 1; });
      for (var q = 0; q < locs.length; q++) {
        var L = locs[q];
        if (L < 1 || L > n) return { ok:false, msg:"There’s no carbon " + L + " in a " + n + "-carbon " + (ring ? "ring" : "chain") + "." };
        if (EL[gg.sub]) { m.b.push([L - 1, m.a.length]); m.a.push({ el:EL[gg.sub] }); }
        else { var prev = L - 1; for (var t = 0; t < LEN[gg.sub]; t++) { m.b.push([prev, m.a.length]); prev = m.a.length; m.a.push({ el:"C" }); } }
      }
    }
    var h = C1.hc(m);
    for (c = 0; c < n; c++) if (h[c] < 0) return { ok:false, msg:"Carbon " + (c + 1) + " would have more than four bonds." };
    return { ok:true, n:n, ring:ring, groups:groups, mol:m };
  }
  function compose(tk){
    var s = "", prev = null;
    (tk || []).forEach(function(t){ var isL = /^\d+$/.test(t); if (prev !== null) { var pL = /^\d+$/.test(prev); if (isL && pL) s += ","; else if (isL !== pL) s += "-"; } s += t; prev = t; });
    return s;
  }
  function judge(str, target){
    var want = name(target).name, s = norm(str);
    if (s === want) return { ok:true, same:true };
    for (var a = 0; a < C2.alt.length; a++) if (C2.alt[a].re.test(s) && C2.alt[a].to === want) return { ok:true, same:true, msg:C2.alt[a].msg };
    var p = parse(s); if (!p.ok) return { ok:false, msg:p.msg };
    var tn = name(target);
    if (C1.iso(p.mol, target)) {
      var r = { ok:false, same:true };
      if (!p.ring && p.n < tn.n) { r.msg = M1; return r; }
      var locs = [], order = [];
      p.groups.forEach(function(g){ (g.locs || [1]).forEach(function(L){ locs.push(L); }); order.push(g.sub); });
      locs.sort(asc);
      var hasLoc = p.groups.some(function(g){ return g.locs; }), wantLoc = /\d/.test(want);
      if (hasLoc !== wantLoc) { r.msg = wantLoc ? "Same molecule, but say where each group goes with locants." : "Same molecule. With only one group on a ring (or on methane, or one group on ethane), IUPAC leaves out the locant."; return r; }
      if (cmpArr(locs, tn.locs) > 0) { r.msg = M2; return r; }
      var sorted = order.slice().sort();
      if (sorted.join() !== order.join()) { r.msg = M3; return r; }
      r.msg = "Tie in locants: the prefix that comes first alphabetically gets the lower number.";
      return r;
    }
    var fa = C1.fText(p.mol), fb = C1.fText(target);
    if (fa !== fb) return { ok:false, msg:"That name describes a different molecule: " + F(fa) + ", but this structure is " + F(fb) + "." + (!tn.ring && !p.ring && p.n !== tn.n ? " Count the longest chain again: it has " + tn.n + " carbons." : "") };
    return { ok:false, msg:"That name gives the right formula but a different structure. Check where each group sits." };
  }
  function chips(host, o){
    var rows = [["Locants", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]], ["Multiplying prefixes", ["di", "tri", "tetra"]], ["Substituent prefixes", o.subs || ["methyl", "ethyl", "fluoro", "chloro", "bromo", "iodo"]],
      ["Ring", ["cyclo"]], ["Parent chain", STEM.slice(1, 11)], ["Suffix", ["ane"]]];
    host.innerHTML = '<p class="c2-tape" aria-live="polite"></p><div class="c2-rows">' + rows.map(function(r){
      return '<div class="c2-row" role="group" aria-label="' + r[0] + '"><span class="c2-lab">' + r[0] + "</span>" + r[1].map(function(t){ return '<button type="button" class="chip c2-c" data-t="' + t + '" data-k="c2' + t + '">' + t + "</button>"; }).join("") + "</div>";
    }).join("") + '</div><div class="q-actions c2-act"><button type="button" class="btn ghost sm" data-c2="back" data-k="c2back">⌫ Back</button><button type="button" class="btn ghost sm" data-c2="clear" data-k="c2clear">Clear</button></div>';
    var tape = $(".c2-tape", host);
    function paint(){
      var tk = o.get() || [], s = compose(tk), lock = o.locked && o.locked();
      tape.innerHTML = s ? '<span class="c2-lab">Your name:</span> <span class="c2-name">' + s + "</span>" : '<span class="c2-lab">Your name:</span> <span class="muted">tap chips to build it</span>';
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
  var C2 = { name:name, parse:parse, judge:judge, compose:compose, chips:chips, alt:[], M1:M1, M2:M2, M3:M3 };
  return C2;
})();

// ---------- module data ----------
var GN = { methyl:"methyl", ethyl:"ethyl", F:"fluoro", Cl:"chloro", Br:"bromo", I:"iodo" };
var ISOMERS = { 1:1, 2:1, 3:1, 4:2, 5:3, 6:5, 7:9, 8:18 };        // CₙH₂ₙ₊₂ structural isomer counts (plan: C4–C8)
var NAME_T = [{ n:5, subs:[{ at:1, g:"Cl" }, { at:2, g:"methyl" }] }, { n:5, subs:[{ at:2, g:"methyl" }] }, { n:3, subs:[{ at:1, g:"methyl" }, { at:1, g:"methyl" }] },
  { n:3, subs:[{ at:1, g:"Cl" }] }, { n:4, ring:true, subs:[] }];                 // Name it: structure 1 is TC2's
var DRAW_T = ["2,3-dimethylpentane", "2-methylbutane", "2,3-dimethylbutane", "1-chloropropane", "cyclohexane"];   // Draw it (names from the data table)
var SERIES = ["methane", "ethane", "propane", "butane", "pentane", "hexane", "heptane", "octane", "nonane", "decane"];
function mk(sp){ return C1.mol(sp); }
function info(m){
  var nm = C2.name(m), f = C1.formula(m), hal = f.F + f.Cl + f.Br + f.I, nC = f.C;
  return { m:m, nm:nm, name:nm.name, f:f, hal:hal, nC:nC, ring:nm.ring, bp:MV.chem.bpOf(nm.name), cond:C1.condensed(m, nm.parent) };
}
function famHTML(I){ return I.hal ? "Alkyl halide" + (I.ring ? " (on a ring)" : "") : I.ring ? "Cycloalkane (saturated)" : "Alkane (saturated)"; }
function patHTML(I){ var p = I.ring ? "CₙH₂ₙ" : "CₙH₂ₙ₊₂"; return p + " with <i>n</i> = " + I.nC + (I.hal ? "; " + I.hal + " H replaced by " + (I.hal > 1 ? "halogens" : "a halogen") : ""); }
function chainText(I, m){
  var p = I.nm.parent; if (!p.length) return "";
  if (p.length === 1) return "1 carbon";
  var L = C1.layout2d(m, "cd"), a = L.atoms[p[0]], b = L.atoms[p[1]], z = L.atoms[p[p.length - 1]];
  if (I.ring) { var cx = 0, cy = 0; p.forEach(function(i){ cx += L.atoms[i].x / p.length; cy += L.atoms[i].y / p.length; }); var cr = (a.x - cx) * (b.y - cy) - (a.y - cy) * (b.x - cx); return "Ring of " + p.length + " carbons, numbered " + (cr > 0 ? "clockwise" : "counterclockwise"); }
  var dx = z.x - a.x, dy = z.y - a.y;
  return p.length + " carbons, numbered " + (Math.abs(dx) > 0.3 ? (dx > 0 ? "from the left" : "from the right") : (dy > 0 ? "from the top" : "from the bottom"));
}
function thermo(v){
  if (v == null) return "";
  var h = clamp((v + 180) / 360, 0.04, 1) * 26;
  return '<svg class="ab-th" viewBox="0 0 14 40" aria-hidden="true"><rect x="4.5" y="2" width="5" height="30" rx="2.5" fill="none" stroke="var(--ink-2)" stroke-width="1.2"/><rect x="5.6" y="' + r1(31 - h) + '" width="2.8" height="' + r1(h + 1) + '" fill="var(--pen)"/><circle cx="7" cy="34" r="4.5" fill="var(--pen)"/></svg>';
}
function r1(v){ return Math.round(v * 10) / 10; }
function bpText(v){ return v == null ? "no data" : num(Math.round(v)) + " °C (data)"; }

// ---------- builder controls (Explore and task) ----------
// ctl(host, {get(), set(spec, msg), sel(), setSel(s), halogens}) -> {paint(), status(msg)}
function controls(host, o){
  var groups = ["methyl", "ethyl"].concat(o.halogens ? ["F", "Cl", "Br", "I"] : []);
  host.innerHTML = '<label class="slider ab-sl"><span class="slider-top"><span>Main chain length</span><output class="ab-n"></output></span><input type="range" class="ab-rng" min="1" max="10" step="1" aria-label="Main chain length, carbons"></label>' +
    '<div class="ab-shape"></div><p class="ab-msg" aria-live="polite"></p>' +
    '<div class="ab-subs" role="group" aria-label="Add a group to the selected carbon">' + groups.map(function(g){ return '<button type="button" class="chip" data-g="' + g + '" data-k="abg' + g + '">' + GN[g] + "</button>"; }).join("") +
    '<button type="button" class="btn ghost sm" data-rm="1" data-k="abrm">Remove</button></div>';
  var rng = $(".ab-rng", host), out = $(".ab-n", host), msg = $(".ab-msg", host), last = "";
  var shape = radios($(".ab-shape", host), { label:"Shape", options:[{ id:"chain", t:"Open chain" }, { id:"ring", t:"Ring" }], value:o.get().ring ? "ring" : "chain", onChange:function(v){
    var sp = JSON.parse(JSON.stringify(o.get())), note = "";
    sp.ring = v === "ring";
    if (sp.ring && sp.n < 3) { sp.n = 3; note = " A ring needs at least 3 carbons."; }
    if (sp.ring && sp.n > 8) { sp.n = 8; note = " Rings here have 3 to 8 carbons."; }
    sp.subs = fitSubs(sp);
    o.setSel(null); o.set(sp, (sp.ring ? "Ring closed." : "Ring opened.") + note);
  } });
  function fitSubs(sp){ var keep = [], m; sp.subs.forEach(function(s){ if (s.at >= sp.n) return; m = C1.mol({ n:sp.n, ring:sp.ring, subs:keep.concat([s]) }); if (C1.hc(m)[s.at] >= 0) keep.push(s); }); return keep; }
  rng.addEventListener("input", function(){
    var sp = JSON.parse(JSON.stringify(o.get())), v = +rng.value;
    if (sp.ring) v = clamp(v, 3, 8);
    rng.value = v; if (v === sp.n) return;
    var before = sp.subs.length; sp.n = v; sp.subs = fitSubs(sp);
    var sel = o.sel(); if (sel && sel.k === "c" && sel.i >= v) o.setSel(null);
    o.set(sp, "Main chain: " + v + " carbon" + (v > 1 ? "s" : "") + "." + (sp.subs.length < before ? " Groups on removed carbons were taken off." : ""));
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var sp = JSON.parse(JSON.stringify(o.get())), sel = o.sel();
    if (b.dataset.g && sel && sel.k === "c") { sp.subs.push({ at:sel.i, g:b.dataset.g }); o.set(sp, "Added " + GN[b.dataset.g] + " on C" + (sel.i + 1) + " of the main chain."); }
    else if (b.dataset.rm && sel && sel.k === "s") { var g = sp.subs[sel.i]; sp.subs.splice(sel.i, 1); o.setSel(null); o.set(sp, "Removed the " + GN[g.g] + " group from C" + (g.at + 1) + "."); }
  });
  function paint(){
    var sp = o.get(), sel = o.sel(), m = C1.mol(sp), h = C1.hc(m);
    rng.min = sp.ring ? 3 : 1; rng.max = sp.ring ? 8 : 10; rng.value = sp.n; out.textContent = sp.n + " C";
    shape.set(sp.ring ? "ring" : "chain");
    var canAdd = sel && sel.k === "c" && h[sel.i] > 0 && sp.subs.length < 4;
    $$("[data-g]", host).forEach(function(b){ b.disabled = !canAdd; });
    $("[data-rm]", host).disabled = !(sel && sel.k === "s");
    var t = last || (!sel ? "Tap a carbon in the drawing to add a group." : sel.k === "s" ? "Selected: the " + GN[sp.subs[sel.i].g] + " group on C" + (sp.subs[sel.i].at + 1) + ". Press Remove to take it off." :
      "Selected: C" + (sel.i + 1) + " of the main chain. " + (sp.subs.length >= 4 ? "Up to 4 groups: remove one first." : h[sel.i] > 0 ? "Choose a group to add." : "This carbon has no H left to replace."));
    msg.textContent = t; last = "";
  }
  return { paint:paint, status:function(s){ last = s || ""; }, firstChip:function(){ var b = $("[data-g]:not([disabled])", host) || $("[data-rm]:not([disabled])", host); if (b) b.focus(); } };
}
function pickLabel(sp, m, sel, ai){
  var a = m.a[ai], h = C1.hc(m);
  if (a.root != null && a.sub != null) { var s = sp.subs[a.sub]; return GN[s.g] + " group on carbon " + (s.at + 1) + (sel && sel.k === "s" && sel.i === a.sub ? ", selected" : "") + ". Select it to remove it."; }
  return "Carbon " + (ai + 1) + " of the main chain, C" + (h[ai] ? "H" + (h[ai] > 1 ? h[ai] : "") : "") + (sel && sel.k === "c" && sel.i === ai ? ", selected" : "") + ". Select it to add a group.";
}
function onPickSel(sp, m, ai){ var a = m.a[ai]; return a.root != null && a.sub != null ? { k:"s", i:a.sub } : { k:"c", i:ai }; }

// ---------- hero ----------
function hero(f){
  var svg = $("#hx-svg"), th = $("#hx-th"), cap = $("#hx-name"), rep = $("#hx-replay");
  if (!svg) return;
  var SP = { me:{ n:1 }, et:{ n:2 }, pr:{ n:3 }, bu:{ n:4 }, mp:{ n:3, subs:[{ at:1, g:"methyl" }] }, cb:{ n:4, ring:true }, cl:{ n:4, subs:[{ at:0, g:"Cl" }] } };
  var W = 640, H = 420, rot = { x:-0.42, y:0.5 };
  function lab(k){ var m = mk(SP[k]); return C2.name(m).name + ", " + C1.fHTML(m); }
  function therm(v, show){
    if (!show) { th.style.opacity = 0; return; }
    th.style.opacity = 1;
    var h = clamp((v + 20) / 40, 0.05, 1) * 100;
    th.innerHTML = '<rect x="27" y="12" width="16" height="112" rx="8" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/><rect x="31" y="' + r1(120 - h) + '" width="8" height="' + r1(h + 8) + '" fill="var(--pen)"/><circle cx="35" cy="140" r="15" fill="var(--pen)"/>' +
      '<text x="35" y="164" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">' + num(Math.round(v)) + " °C</text>";
  }
  if (MV.reduceMotion) {
    var cells = [["bu", "butane (−1 °C)"], ["mp", "2-methylpropane (−12 °C)"], ["cb", "cyclobutane, C₄H₈"], ["cl", "1-chlorobutane"]], h2 = "";
    cells.forEach(function(c, i){
      var sc = C1.scene3(mk(SP[c[0]])), fit = C1.fit3(sc, 320, 175); fit.ox += (i % 2) * 320; fit.oy += Math.floor(i / 2) * 210 + 8;
      h2 += C1.svg3d(sc, rot, fit, {}, "hxr" + i) + '<text x="' + ((i % 2) * 320 + 160) + '" y="' + (Math.floor(i / 2) * 210 + 202) + '" text-anchor="middle" font-size="17" font-weight="700" fill="var(--ink)">' + c[1] + "</text>";
    });
    svg.innerHTML = h2; therm(0, false);
    cap.textContent = "Four related structures: butane, 2-methylpropane, cyclobutane and 1-chlorobutane.";
    return;
  }
  var seq = [{ k:"me", hold:1100 }, { k:"et", ms:900, map:{ "h0.3":"h1.2" }, hold:700 }, { k:"pr", ms:900, map:{ "h1.2":"h2.2" }, hold:700 },
    { k:"bu", ms:900, map:{ "h2.2":"h3.2" }, hold:900, th:[-1, -1] }, { k:"mp", ms:1400, hold:1700, th:[-1, -12] }, { k:"bu", ms:1000, hold:400 },
    { k:"cb", ms:1300, hold:1700 }, { k:"bu", ms:1000, hold:400 }, { k:"cl", ms:1100, hold:300 }];
  var cancel = null, t0 = 0, run = 0;
  function draw(sc, fit){ rot.y = 0.5 + (performance.now() - t0) * 0.00022; svg.innerHTML = C1.svg3d(sc, rot, fit, {}, "hx"); }
  function play(){
    var id = ++run, i = 0, curSc = null, curFit = null;
    t0 = performance.now(); rep.hidden = true;
    function step(){
      if (id !== run) return;
      if (i >= seq.length) { rep.hidden = false; return; }
      var s = seq[i++], B = C1.scene3(mk(SP[s.k])), fB = C1.fit3(B, W, H);
      cap.innerHTML = lab(s.k);
      if (!curSc) { curSc = B; curFit = fB; draw(B, fB); therm(0, false); hold(s); return; }
      var mf = C1.morph(curSc, B, s.map), fA = curFit;
      cancel = MV.tween({ dur:s.ms, step:function(t){ if (id !== run) return; draw(mf(t), C1.lerpFit(fA, fB, t)); if (s.th) therm(s.th[0] + (s.th[1] - s.th[0]) * t, true); else therm(0, false); },
        done:function(){ curSc = B; curFit = fB; hold(s); } });
    }
    function hold(s){ cancel = MV.tween({ dur:s.hold, ease:function(t){ return t; }, step:function(){ if (id === run) draw(curSc, curFit); }, done:step }); }
    step();
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: chain builder ----------
function explore(host, api){
  var S = api.S;
  S.spec = S.spec || { n:4, ring:false, subs:[] }; S.view = S.view || "cd"; S.mode = S.mode || "build";
  S.ni = S.ni || 0; S.di = S.di || 0; S.tape = S.tape || {}; S.nok = S.nok || {}; S.dok = S.dok || {};
  var sel = null, T = {}, fb = { name:{}, draw:{} }, drawShown = false, bpOverride = null, plot = null, cache = { key:null };   // T: transient prediction state
  host.innerHTML = '<p class="how ab-how">' + api.content.how + '</p><div class="ab-grid"><div class="ab-left" data-mv="graph"><div class="eq-cap ab-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ab-mol"></div><div class="ab-views"></div><div class="ab-prod" aria-live="polite"></div></div>' +
    '<div class="ab-ctrl"><div class="ab-modes"></div><div class="ab-panel"></div><div class="ab-build"></div></div>' +
    '<div class="ab-right"><dl class="read ab-read" aria-live="polite"></dl><div class="ab-lab" hidden><details class="ab-bpd"><summary>Show graph</summary><canvas class="plot" role="img" aria-label="Boiling point graph"></canvas></details><div class="ab-tab"></div></div></div></div>';
  var V = C1.view($(".ab-mol", host), { rotate:true, onPick:function(ai, h, kb){
      var m = cur().m; sel = onPickSel(S.spec, m, ai); clearT(); paint(); if (kb) ctl.firstChip();
    }, label:function(ai){ return pickLabel(S.spec, cur().m, sel, ai); } });
  var viewRG = radios($(".ab-views", host), { label:"View", aria:"Structure view", options:[{ id:"cd", t:"Condensed" }, { id:"st", t:"Structural" }, { id:"ln", t:"Line" }, { id:"3d", t:"3D" }], value:S.view,
    onChange:function(v){ S.view = v; api.save(); paint(); } });
  var modeRG = radios($(".ab-modes", host), { label:"Mode", aria:"Chain builder mode", cls:"chips", options:[{ id:"build", t:"Build" }, { id:"name", t:"Name it" }, { id:"draw", t:"Draw it" }, { id:"lab", t:"Boiling-point lab" }], value:S.mode,
    onChange:function(v){ setMode(v); } });
  var ctl = controls($(".ab-build", host), { halogens:true, get:function(){ return S.spec; }, set:function(sp, msg){ S.spec = sp; drawShown = false; clearT(); api.save(); ctl.status(msg); paint(); },
    sel:function(){ return sel; }, setSel:function(s){ sel = s; } });
  var panel = $(".ab-panel", host), tabDone = false;
  function setMode(v){ S.mode = v; sel = null; clearT(); api.save(); modeRG.set(v); paintPanel(); paint(); }
  function clearT(){ T = {}; $(".ab-prod", host).innerHTML = ""; bpOverride = null; }
  function cur(){
    var m = S.mode === "name" ? mk(NAME_T[S.ni]) : mk(S.spec), key = S.mode === "name" ? "n" + S.ni : JSON.stringify(S.spec);
    if (cache.key !== key) { cache = { key:key, I:info(m) }; }
    return cache.I;
  }
  function drawTarget(){ var p = C2.parse(DRAW_T[S.di]); return p.mol; }
  function paintPanel(){
    if (S.mode === "name") {
      panel.innerHTML = '<p class="ab-tgt"><strong>Name it.</strong> Structure ' + (S.ni + 1) + " of " + NAME_T.length + ": assemble its IUPAC name with the chips.</p><div class=\"ab-chips\"></div>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-a="ncheck" data-k="abnc">Check name</button><button type="button" class="btn ghost sm" data-a="nprev" data-k="abnp">Previous</button><button type="button" class="btn ghost sm" data-a="nnext" data-k="abnn">Next structure</button></div><div class="ab-fb" aria-live="polite"></div>';
      C2.chips($(".ab-chips", panel), { get:function(){ return S.tape[S.ni] || []; }, set:function(tk){ S.tape[S.ni] = tk; fb.name[S.ni] = null; api.save(); paintFb(); MV.changed(); }, locked:function(){ return !!S.nok[S.ni]; } });
    } else if (S.mode === "draw") {
      panel.innerHTML = '<p class="ab-tgt"><strong>Draw it.</strong> Name ' + (S.di + 1) + " of " + DRAW_T.length + ": build <strong>" + DRAW_T[S.di] + "</strong>.</p>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-a="dcheck" data-k="abdc">Check my structure</button><button type="button" class="btn ghost sm" data-a="dprev" data-k="abdp">Previous</button><button type="button" class="btn ghost sm" data-a="dnext" data-k="abdn">Next name</button></div><div class="ab-fb" aria-live="polite"></div>';
    } else if (S.mode === "lab") panel.innerHTML = '<p class="ab-tgt"><strong>Boiling-point lab.</strong> Build any molecule: its boiling point is plotted against the straight-chain series.</p>';
    else panel.innerHTML = '<p class="ab-tgt"><strong>Build.</strong> Free building with the live IUPAC name.</p>';
    $(".ab-build", host).hidden = S.mode === "name";
    paintFb();
  }
  function paintFb(){
    var box = $(".ab-fb", panel); if (!box) return;
    var q = $$("button[data-a]", panel);
    if (S.mode === "name") {
      var ok = S.nok[S.ni], f2 = fb.name[S.ni];
      box.innerHTML = ok ? MV.fbHTML("good", "<strong>✓ Correct: " + cur().name + ".</strong>") : f2 ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + f2) : "";
      q.forEach(function(b){ if (b.dataset.a === "ncheck") b.disabled = !!ok; if (b.dataset.a === "nprev") b.disabled = S.ni === 0; if (b.dataset.a === "nnext") b.disabled = S.ni === NAME_T.length - 1; });
    } else if (S.mode === "draw") {
      var f3 = fb.draw[S.di];
      box.innerHTML = f3 ? MV.fbHTML(f3.ok ? "good" : "bad", f3.html) : "";
      q.forEach(function(b){ if (b.dataset.a === "dprev") b.disabled = S.di === 0; if (b.dataset.a === "dnext") b.disabled = S.di === DRAW_T.length - 1; });
    }
  }
  panel.addEventListener("click", function(e){
    var b = e.target.closest("button[data-a]"); if (!b || b.disabled) return;
    var a = b.dataset.a;
    if (a === "nprev" || a === "nnext") { S.ni = clamp(S.ni + (a === "nnext" ? 1 : -1), 0, NAME_T.length - 1); api.save(); paintPanel(); paint(); return; }
    if (a === "dprev" || a === "dnext") { S.di = clamp(S.di + (a === "dnext" ? 1 : -1), 0, DRAW_T.length - 1); drawShown = false; api.save(); paintPanel(); paint(); return; }
    if (a === "ncheck") {
      var r = C2.judge(C2.compose(S.tape[S.ni]), cur().m);
      if (r.ok) S.nok[S.ni] = true; else fb.name[S.ni] = r.msg;
      api.save(); paintPanel(); paint(); MV.focusFb(panel); return;
    }
    if (a === "dcheck") {
      var I = cur(), tg = drawTarget(), msg;
      if (C1.iso(I.m, tg)) { S.dok[S.di] = true; drawShown = true; msg = { ok:true, html:"<strong>✓ That’s " + DRAW_T[S.di] + ".</strong> " + F(C1.fText(tg)) + (I.cond ? ": " + F(I.cond) : "") + "." }; }
      else { drawShown = true; var tf = C1.fText(tg); msg = { ok:false, html:"<strong>✗ Not quite.</strong> You built " + I.name + " (" + F(C1.fText(I.m)) + "). " + (C1.fText(I.m) === tf ? "Right formula, wrong structure: read the name again for the parent chain and the locants." : DRAW_T[S.di] + " is " + F(tf) + ". Count the carbons in the parent name and the prefixes.") }; }
      fb.draw[S.di] = msg; api.save(); paintFb(); paint(); MV.focusFb(panel);
    }
  });
  function readRows(I){
    var hideName = (S.mode === "name" && !S.nok[S.ni]) || (S.mode === "draw" && !drawShown);
    var bp = bpOverride != null ? bpOverride : I.bp;
    return [["IUPAC name", hideName ? '<span class="muted">' + (S.mode === "name" ? "Hidden: assemble it with the chips." : "Hidden until you check your structure.") + "</span>" : "<strong>" + I.name + "</strong>"],
      ["Molecular formula", F(C1.fText(I.m))], ["Family", famHTML(I)], ["Formula pattern", patHTML(I)], ["Longest chain", chainText(I, I.m)],
      ["Boiling point", '<span class="ab-bp">' + thermo(bp) + "<span>" + bpText(bp) + "</span></span>"],
      ["Structural isomers with this formula", !I.hal && !I.ring && ISOMERS[I.nC] ? String(ISOMERS[I.nC]) : '<span class="muted">not listed</span>']];
  }
  function viewOpts(I){
    var o = { view:S.view, pick:S.mode === "name" ? null : "atoms", path:T.noHl ? null : I.nm.parent, ring:I.ring, hlUpTo:T.hlUpTo, env:T.env ? C1.env(I.m) : null, mark:T.mark,
      sel:sel && S.mode !== "name" ? (sel.k === "c" ? sel.i : atomOfSub(I.m, sel.i)) : null };
    o.aria = ({ cd:"Condensed structural formula", st:"Full structural formula", ln:"Line (skeletal) formula", "3d":"3D ball-and-stick model" })[S.view] + " of " + ((S.mode === "name" && !S.nok[S.ni]) || (S.mode === "draw" && !drawShown) ? "the molecule" : I.name) + ", " + MV.plain(F(C1.fText(I.m))) + (o.path ? ". The longest chain is highlighted and numbered." : ".");
    return o;
  }
  function atomOfSub(m, k){ for (var i = 0; i < m.a.length; i++) if (m.a[i].sub === k && m.a[i].root != null) return i; return null; }
  function paintRead(I){ $(".ab-read", host).innerHTML = MV.readoutHTML(readRows(I)); }
  function paintCap(I){ $(".ab-cap", host).innerHTML = F(I.cond || C1.fText(I.m)); }   // one-line condensed formula (chains) or the molecular formula (rings)
  function paintLab(I){
    var lab = $(".ab-lab", host); lab.hidden = S.mode !== "lab";
    if (S.mode !== "lab") return;
    var d = $(".ab-bpd", lab);
    if (!plot) { plot = new MV.Plot($("canvas", lab), { xmin:0, xmax:11, ymin:-200, ymax:200 }); d.open = window.innerWidth >= 700; d.addEventListener("toggle", function(){ if (plot && plot.render) plot.render(); }); }
    if (!tabDone) { MV.chem.tablePanel($(".ab-tab", lab), "bp"); tabDone = true; }
    var pts = SERIES.map(function(nm, k){ return [k + 1, MV.chem.bpOf(nm)]; }), bp = bpOverride != null ? bpOverride : I.bp;
    plot.render = function(){
      plot.draw({ view:{ xmin:0, xmax:11, ymin:-200, ymax:200 }, xTicks:{ step:1 }, yTicks:{ step:50 }, xLabel:"carbons", yLabel:"boiling point (°C)",
        curves:[{ pts:pts, color:MV.css("--ink-2"), width:2, dash:[6, 6] }],
        data:pts.map(function(p){ return { x:p[0], y:p[1], r:3, color:MV.css("--ink-2") }; }),
        points:bp != null ? [{ x:I.nC, y:bp, r:7, color:MV.css("--pen"), label:I.name + " (" + num(Math.round(bp)) + " °C)" }] : [],
        describe:"Boiling point against number of carbons. Dashed line: the straight-chain alkanes from methane (−162 °C) to decane (174 °C). " + (bp != null ? "Your molecule, " + I.name + ", " + I.nC + " carbons, " + num(Math.round(bp)) + " °C." : "Your molecule has no boiling-point data in the table.") });
    };
    plot.render();
  }
  function paint(){
    var I = cur();
    ctl.paint();
    paintCap(I); paintRead(I); paintLab(I);
    V.show(I.m, viewOpts(I));
    MV.changed();
  }
  // ---------- predictions ----------
  function setState(sp, view){ V.stop(); S.mode = "build"; modeRG.set("build"); S.spec = sp; S.view = view; viewRG.set(view); sel = null; clearT(); api.save(); paintPanel(); }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState({ n:4, ring:false, subs:[] }, "3d");
      else if (p.id === "p2") { setState({ n:4, ring:false, subs:[{ at:3, g:"methyl" }] }, "cd"); T.noHl = true; }
      else if (p.id === "p3") setState({ n:6, ring:false, subs:[] }, "st");
      else setState({ n:3, ring:false, subs:[] }, "st");
      paint();
    },
    run:function(p, done){
      var I = cur();
      if (p.id === "p1") {
        var sp1 = { n:3, ring:false, subs:[{ at:1, g:"methyl" }] }, m1 = mk(sp1), I1 = info(m1);
        var stopBp = MV.tween({ dur:1650, step:function(t){ bpOverride = -1 - 11 * t; paintRead(I); } });
        V.anim(m1, Object.assign(viewOpts(I), { path:I1.nm.parent, pick:null }), 1700, function(){ stopBp(); S.spec = sp1; bpOverride = null; api.save(); paint(); done(); });
      } else if (p.id === "p2") {
        var path = I.nm.parent, k = 0;
        (function trace(){ k++; V.paintWith({ path:path, hlUpTo:k }); if (k < path.length) MV.wait(380, trace); else MV.wait(500, straighten); })();
        function straighten(){
          var sp2 = { n:5, ring:false, subs:[] }, m2 = mk(sp2);
          V.anim(m2, Object.assign(viewOpts(I), { path:info(m2).nm.parent, pick:null }), 1100, function(){ S.spec = sp2; T = {}; api.save(); paint(); done(); });
        }
      } else if (p.id === "p3") {
        T.mark = { "h0.2":1, "h5.2":1 }; V.paintWith({ mark:T.mark, pick:null });
        MV.wait(900, function(){
          var sp3 = { n:6, ring:true, subs:[] }, m3 = mk(sp3);
          V.anim(m3, Object.assign(viewOpts(I), { mark:null, path:info(m3).nm.parent, ring:true, pick:null }), 1500, function(){ S.spec = sp3; T = {}; api.save(); paint(); done(); });
        });
      } else {
        T.env = true; paint();
        MV.wait(900, function(){
          var m4 = I.m, e = C1.env(m4);
          $(".ab-prod", host).innerHTML = '<p class="ab-prodh">Replace one H with Cl:</p><div class="ab-prods">' + e.cls.map(function(c, q){
            var pm = C1.withAtom(m4, c[0], "Cl"), nm = C2.name(pm);
            return '<figure class="ab-pr">' + C1.svgStatic(pm, { view:"cd", w:300, h:150, path:null }) + "<figcaption>H<sub>" + C1.LET[q] + "</sub> → <strong>" + nm.name + "</strong></figcaption></figure>";
          }).join("") + "</div>";
          MV.wait(700, done);
        });
      }
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var I = cur(), nm = I.name, f = C1.fText(I.m);
    if (id === "tc1") {
      if (S.mode === "name") return { ok:false, msg:"Switch to Build, Draw it or the Boiling-point lab, then build the molecule." };
      if (nm === "2,3-dimethylpentane") return { ok:true };
      if (nm === "2,4-dimethylpentane") return { ok:false, msg:"Your methyls are on C2 and C4. Put them on neighbouring carbons." };
      if (nm === "2,3-dimethylhexane") return { ok:false, msg:"The main chain should have 5 carbons, not 6." };
      if (f === "C7H16") return { ok:false, msg:"Right formula, wrong structure: you need two methyl branches on a 5-carbon chain." };
      return { ok:false, msg:"You built " + nm + ". Start with 5 carbons in a row, then add two methyl groups." };
    }
    if (id === "tc2") {
      var tape = C2.compose(S.tape[0] || []);
      if (S.mode !== "name" || S.ni !== 0) return { ok:false, msg:"Switch to Name it mode and go to structure 1: CH₃CH(Cl)CH(CH₃)CH₂CH₃." };
      if (!tape) return { ok:false, msg:"Assemble the name with the chips first." };
      if (tape === "2-chloro-3-methylpentane") return { ok:true };
      if (tape === "3-methyl-2-chloropentane") return { ok:false, msg:"Prefixes go alphabetically: chloro before methyl." };
      if (tape === "4-chloro-3-methylpentane") return { ok:false, msg:"Numbering from the left gives {2, 3}, lower than {3, 4}." };
      if (tape === "2-chloro-3-methylbutane") return { ok:false, msg:"Count again: the longest chain has 5 carbons." };
      return { ok:false, msg:C2.judge(tape, mk(NAME_T[0])).msg || "Check the longest chain, the numbering and the order of the prefixes." };
    }
    if (id === "tc3") {
      if (S.mode === "name") return { ok:false, msg:"Switch to the Boiling-point lab (or Build) and build the molecule yourself." };
      if (nm === "2,2-dimethylbutane") return { ok:true };
      if (nm === "2,3-dimethylbutane") return { ok:false, msg:"Low (58 °C), but two carbons carry branches." };
      if (nm === "2-methylpentane" || nm === "3-methylpentane") return { ok:false, msg:"One branch point, but the molecule is still long and floppy (" + num(I.bp) + " °C)." };
      if (nm === "hexane") return { ok:false, msg:"No branching: the highest of the five (69 °C)." };
      return { ok:false, msg:"Build one of the five isomers of C₆H₁₄: six carbons in all, no ring, no halogens." };
    }
    return { ok:false };
  }
  paintPanel(); paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: reactions of alkanes ----------
var COMB = [{ eq:"C3H8 + 2O2 -> 3C + 4H2O", out:"Incomplete combustion: soot (C) and water", per:{ C:6, H2O:8 } },
  { eq:"4C3H8 + 11O2 -> 6CO + 6C + 16H2O", out:"Incomplete combustion: CO, soot (C) and water", per:{ CO:3, C:3, H2O:8 } },
  { eq:"2C3H8 + 7O2 -> 6CO + 8H2O", out:"Incomplete combustion: carbon monoxide (CO) and water", per:{ CO:6, H2O:8 } },
  { eq:"4C3H8 + 17O2 -> 6CO2 + 6CO + 16H2O", out:"Incomplete combustion: CO₂, CO and water", per:{ CO2:3, CO:3, H2O:8 } },
  { eq:"C3H8 + 5O2 -> 3CO2 + 4H2O", out:"Complete combustion: CO₂ and water", per:{ CO2:6, H2O:8 } }];
var O2PER = [2, 2.75, 3.5, 4.25, 5];
var ALK = [["propane", { n:3 }], ["butane", { n:4 }], ["2-methylpropane", { n:3, subs:[{ at:1, g:"methyl" }] }], ["pentane", { n:5 }], ["2-methylbutane", { n:4, subs:[{ at:1, g:"methyl" }] }],
  ["2,2-dimethylpropane", { n:3, subs:[{ at:1, g:"methyl" }, { at:1, g:"methyl" }] }], ["cyclohexane", { n:6, ring:true }]];
function atomCount(side){
  var tot = {};
  side.split(" + ").forEach(function(term){ var mm = term.trim().match(/^(\d*)(.*)$/), k = +(mm[1] || 1), re = /([A-Z][a-z]?)(\d*)/g, x; while ((x = re.exec(mm[2]))) tot[x[1]] = (tot[x[1]] || 0) + k * (+(x[2] || 1)); });
  return tot;
}
function products(m){
  var e = C1.env(m), h = C1.hc(m);
  return e.cls.map(function(c, q){ var pm = C1.withAtom(m, c[0], "Cl"), nm = C2.name(pm); return { q:q, nH:c.reduce(function(t, i){ return t + h[i]; }, 0), name:nm.name, cond:C1.condensed(pm, nm.parent), m:pm, grp:"C" + (h[c[0]] ? "H" + (h[c[0]] > 1 ? h[c[0]] : "") : "") }; });
}
function part3(host, api){
  var S = api.S, C = api.content; S.o2 = S.o2 == null ? 4 : S.o2; S.alk = S.alk || 0; S.pick = S.pick == null ? -1 : S.pick;
  host.innerHTML = '<div class="part ab-st"><h3>' + C.s1.title + "</h3><p>" + C.s1.intro + '</p><div class="sym"><div><svg class="ab-burner" viewBox="0 0 300 250" role="img"></svg><p class="tiny muted ab-burnlab"></p></div>' +
    '<div><label class="slider"><span class="slider-top"><span>O₂ supply</span><output class="ab-o2out"></output></span><input type="range" class="ab-o2" min="0" max="4" step="1" aria-label="Oxygen supply, from very limited to plenty"></label>' +
    '<p class="ab-outc" aria-live="polite"></p><p class="ab-eq" aria-live="polite"></p><div class="ab-count"></div></div></div>' +
    '<details class="alg"><summary>Check it with data</summary>' + C.s1.data + MV.tableHTML({ head:["Outcome", "Products", "O₂ per mole of propane (mol)"], rows:[["Complete", F("CO2 + H2O"), "5"], ["Incomplete", F("CO + H2O"), "3.5"], ["Incomplete", "C (soot) + " + F("H2O"), "2"]], caption:"Oxygen needed for each outcome" }) + "</details>" +
    '<p class="refresh">' + C.s1.stse + "</p></div>" +
    '<div class="part ab-st"><h3>' + C.s2.title + "</h3><p>" + C.s2.intro + '</p><div class="ab-alks"></div><div class="sym"><div class="ab-p3mol"></div><div><dl class="read ab-p3read" aria-live="polite"></dl><div class="ab-p3prod" aria-live="polite"></div></div></div>' +
    '<details class="alg"><summary>Check it with data</summary>' + C.s2.data + '<div class="ab-p3tab"></div></details></div>';
  var rng = $(".ab-o2", host);
  function paint1(){
    var k = S.o2, c = COMB[k], sides = c.eq.split(" -> "), L = atomCount(sides[0]), R = atomCount(sides[1]);
    rng.value = k; $(".ab-o2out", host).textContent = C.s1.steps[k] + ": " + num(O2PER[k]) + " O₂ per C₃H₈";
    $(".ab-outc", host).innerHTML = "<strong>" + c.out + "</strong>";
    $(".ab-eq", host).innerHTML = F(c.eq);
    $(".ab-count", host).innerHTML = MV.tableHTML({ head:["Atom", "Left side", "Right side", "Balanced?"], rows:["C", "H", "O"].map(function(e){ return [e, String(L[e] || 0), String(R[e] || 0), (L[e] || 0) === (R[e] || 0) ? "✓ yes" : "✗ no"]; }), caption:"Atom count on each side" });
    burner(k, c);
  }
  function burner(k, c){
    var complete = k === 4, svg = $(".ab-burner", host), col = complete ? "var(--pen)" : "var(--p-k)", hgt = complete ? 70 : 95 + (3 - k) * 6, wid = complete ? 26 : 38, out = "";
    out += '<rect x="128" y="182" width="44" height="52" rx="4" fill="var(--ink-2)"/><rect x="100" y="230" width="100" height="12" rx="3" fill="var(--ink-2)"/><rect x="60" y="205" width="68" height="10" rx="3" fill="var(--rule)"/><text x="62" y="200" font-size="12" fill="var(--ink-2)">propane</text>';
    out += '<path d="M150 ' + (182 - hgt) + " C " + (150 + wid) + " " + (182 - hgt * 0.45) + " " + (150 + wid * 0.9) + " 182 150 182 C " + (150 - wid * 0.9) + " 182 " + (150 - wid) + " " + (182 - hgt * 0.45) + " 150 " + (182 - hgt) + ' Z" fill="' + col + '" fill-opacity=".55" stroke="' + col + '" stroke-width="2"/>';
    var icons = [];
    ["CO2", "CO", "C", "H2O"].forEach(function(sp){ for (var q = 0; q < (c.per[sp] || 0); q++) icons.push(sp); });
    icons.forEach(function(sp, q){
      var x = 30 + (q % 7) * 40, y = 24 + Math.floor(q / 7) * 32, g = "";
      if (sp === "CO2") g = ball(x - 11, y, "O", 6) + ball(x, y, "C", 6.5) + ball(x + 11, y, "O", 6);
      else if (sp === "CO") g = ball(x - 5.5, y, "C", 6.5) + ball(x + 5.5, y, "O", 6);
      else if (sp === "C") g = '<circle cx="' + x + '" cy="' + y + '" r="8" fill="var(--ink)"/>';
      else g = ball(x - 8, y + 5, "H", 4.5) + ball(x + 8, y + 5, "H", 4.5) + ball(x, y, "O", 6.5);
      icons[q] = g;
    });
    out += icons.join("");
    svg.innerHTML = out;
    var words = complete ? "blue flame" : "yellow, sooty flame";
    svg.setAttribute("aria-label", "Burner diagram with a " + words + ". Products shown for 2 propane molecules: " + Object.keys(c.per).map(function(sp){ return c.per[sp] + " " + MV.plain(F(sp)); }).join(", ") + ".");
    $(".ab-burnlab", host).innerHTML = "Flame: <strong>" + words + "</strong>. Products drawn for 2 C₃H₈ molecules: dark dots are soot (C); balls follow the atom colours (C ink, O magenta, H white).";
  }
  function ball(x, y, el, r){ var c = MV.chem.atom(el); return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 5) + '" fill="' + c.fill + '"' + (el === "H" ? ' stroke="' + c.line + '" stroke-width="1"' : "") + "/>"; }
  rng.addEventListener("input", function(){ S.o2 = +rng.value; api.save(); paint1(); });
  // station 2
  var alkRG = radios($(".ab-alks", host), { label:"Alkane", aria:"Choose an alkane", cls:"chips", options:ALK.map(function(x, i){ return { id:i, t:x[0] }; }), value:S.alk,
    onChange:function(v){ S.alk = +v; S.pick = -1; api.save(); paint2(); } });
  var V2 = C1.view($(".ab-p3mol", host), { w:520, h:400, onPick:function(ai){ var e = C1.env(mk(ALK[S.alk][1])); S.pick = e.of[ai]; api.save(); paint2(); },
    label:function(ai, hid){ var m = mk(ALK[S.alk][1]), e = C1.env(m); return "H atom on carbon " + (ai + 1) + (S.pick >= 0 ? ", environment " + C1.LET[e.of[ai]] : "") + ". Select it to replace it with Cl."; } });
  function paint2(){
    var m = mk(ALK[S.alk][1]), e = C1.env(m), pr = products(m), f = C1.formula(m), picked = S.pick >= 0;
    V2.show(m, { view:"st", pick:"H", env:picked ? e : null, envPick:picked ? S.pick : null, aria:"Full structural formula of " + ALK[S.alk][0] + (picked ? ", with each H labelled by its environment" : "") + "." });
    $(".ab-p3read", host).innerHTML = MV.readoutHTML([["Alkane", ALK[S.alk][0] + ", " + F(C1.fText(m))], ["H atoms", String(f.H)], ["Different H environments", picked ? String(e.count) : '<span class="muted">tap an H to find out</span>'],
      ["Monochloro products", picked ? String(pr.length) : '<span class="muted">tap an H to find out</span>']]);
    var box = $(".ab-p3prod", host);
    if (!picked) { box.innerHTML = '<p class="tiny muted">Tap any H in the drawing (or Tab to it and press Enter).</p>'; return; }
    var p = pr[S.pick];
    box.innerHTML = '<p class="ab-eq">' + F(C1.fText(m) + " + Cl2 -> " + (p.cond || C1.fText(p.m)) + " + HCl") + "</p><p>Your H is in environment <strong>H<sub>" + C1.LET[S.pick] + "</sub></strong>: the product is <strong>" + p.name + "</strong>.</p>" +
      '<ul class="ab-plist">' + pr.map(function(x){ return '<li class="' + (x.q === S.pick ? "on" : "") + '"><span class="ab-sw" style="background:var(' + C1.PAL[x.q] + ')"></span>H<sub>' + C1.LET[x.q] + "</sub> · " + x.nH + " H on " + F(x.grp) + " → <strong>" + x.name + "</strong></li>"; }).join("") + "</ul>" +
      "<p>" + f.H + " H atoms, but only " + e.count + " different environment" + (e.count > 1 ? "s" : "") + ", so " + pr.length + " product" + (pr.length > 1 ? "s" : "") + ".</p>";
  }
  $(".ab-p3tab", host).innerHTML = MV.tableHTML({ head:["Alkane", "H atoms", "H environments", "Monochloro products"], rows:ALK.map(function(x){ var m = mk(x[1]), pr = products(m); return [x[0], String(C1.formula(m).H), String(pr.length), pr.map(function(p){ return p.name; }).join("; ")]; }), caption:"Monochloro products for each alkane" });
  paint1(); paint2();
}

// ---------- Practice 2: formulas, isomers and boiling points ----------
function parseFormula(s){
  var t = String(s || "").replace(/[₀-₉]/g, function(c){ return String(c.charCodeAt(0) - 8320); }).replace(/\s+/g, ""), mm = t.match(/^c(\d*)h(\d*)$/i);
  return mm ? { C:+(mm[1] || 1), H:+(mm[2] || 1) } : null;
}
function formulasAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", ord:[], pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-fi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "formula" || it.kind === "num") h += '<div class="numrow"><label for="fi-' + it.id + '">' + (it.kind === "formula" ? "Formula (type it like C4H10):" : "Your answer:") + '</label><input class="numin" id="fi-' + it.id + '" data-fin="' + it.id + '" type="text" inputmode="' + (it.kind === "num" ? "numeric" : "text") + '" autocomplete="off" autocapitalize="characters" spellcheck="false" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + "></div>";
    else if (it.kind === "order") {
      h += '<p class="tiny muted" style="margin:8px 0 4px">Tap the compounds from lowest to highest boiling point.</p><div class="chips" role="group" aria-label="Compounds">' + it.tiles.map(function(t, k){ var on = x.ord.indexOf(k) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-ot="' + k + '" data-k="' + it.id + "t" + k + '" aria-pressed="' + on + '"' + (x.solved || on ? " disabled" : "") + ">" + (on ? (x.ord.indexOf(k) + 1) + ". " : "") + t + "</button>"; }).join("") + "</div>" +
        '<p class="ab-ord">Your order: ' + (x.ord.length ? x.ord.map(function(k){ return it.tiles[k]; }).join(" &lt; ") : '<span class="muted">none yet</span>') + "</p>" + (x.solved ? "" : '<button type="button" class="btn ghost sm" data-oclr="1" data-k="' + it.id + 'oc"' + (x.ord.length ? "" : " disabled") + ">Clear order</button>");
    } else h += '<div class="chips" role="radiogroup" aria-label="Choices" style="margin-top:10px">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + (it.kind === "chips" ? it.options[x.pick].why || "" : it.kind === "order" ? it.fb : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "formula") {
      var p = parseFormula(x.val), want = parseFormula(MV.ans(it));
      if (!p) return { bad:"Type a formula such as C4H10 (letters and numbers only)." };
      if (p.C === want.C && p.H === want.H) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ var q = parseFormula(z.match); return q && q.C === p.C && q.H === p.H; })[0];
      return { fb:w ? w.fb : (p.C !== want.C ? "Count the carbons again, including every branch." : "Right number of carbons. Check the H count with the formula pattern.") };
    }
    if (it.kind === "num") {
      var v = MV.parseNum(x.val); if (!v || v.length !== 1) return { bad:"Enter a whole number." };
      if (v[0] === MV.ans(it)) return { ok:true };
      var w2 = (it.wrong || []).filter(function(z){ return z.match === v[0]; })[0];
      return { fb:w2 ? w2.fb : "List the isomers by main-chain length so you don’t miss or repeat one." };
    }
    if (it.kind === "order") { if (x.ord.length < it.tiles.length) return { bad:"Tap all " + it.tiles.length + " compounds first." }; return x.ord.join() === MV.ans(it).join() ? { ok:true } : { fb:it.fb }; }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.fin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.fin) { var b = host.querySelector('[data-k="' + e.target.dataset.fin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-fi]"); if (!box) return;
    var it = item(box.dataset.fi), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.ot != null) { x.ord.push(+b.dataset.ot); msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.oclr) { x.ord = []; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = r.fb; if (it.kind === "order") x.ord = []; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-fi="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Three-product heptane ----------
var task = (function(){
  var S = null, api = null, V = null, ctl = null, sel = null;
  function read(){
    var sp = S ? S.spec : { n:5, subs:[] }, m = mk(sp), nm = C2.name(m), e = C1.env(m);
    return { spec:sp, m:m, name:nm.name, n:nm.n, ring:nm.ring, path:nm.parent, f:C1.formula(m), env:e, tape:C2.compose(S ? S.tape : []), tried:!!(S && S.tried) };
  }
  function paint(){
    var d = read();
    ctl.paint();
    V.show(d.m, { view:"st", pick:"atoms", path:d.path, ring:d.ring, env:d.env, sel:sel ? (sel.k === "c" ? sel.i : subAtom(d.m, sel.i)) : null,
      aria:"Full structural formula of your molecule, " + MV.plain(F(C1.fText(d.m))) + ", with each H labelled by its environment and the longest chain numbered." });
    $("#tk-read").innerHTML = MV.readoutHTML([["Molecular formula", F(C1.fText(d.m))], ["Different H environments", d.env.count + " (" + d.env.cls.map(function(_, q){ return "H<sub>" + C1.LET[q] + "</sub>"; }).join(", ") + ")"],
      ["Longest chain", d.n + " carbon" + (d.n > 1 ? "s" : "") + (d.ring ? " (a ring)" : "")], ["IUPAC name of your structure", d.tried ? "<strong>" + d.name + "</strong>" : '<span class="muted">Hidden until you check a name.</span>']]);
  }
  function subAtom(m, k){ for (var i = 0; i < m.a.length; i++) if (m.a[i].sub === k && m.a[i].root != null) return i; return null; }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; S.spec = S.spec || { n:5, ring:false, subs:[] }; S.tape = S.tape || [];
      inp.innerHTML = '<div id="tk-ctl"></div><h4 class="ab-h4">Name it</h4><div id="tk-chips"></div>';
      pv.innerHTML = '<div id="tk-view"></div><dl class="read" id="tk-read" aria-live="polite"></dl>';
      ctl = controls($("#tk-ctl"), { halogens:false, get:function(){ return S.spec; }, set:function(sp, msg){ S.spec = sp; a.save(); ctl.status(msg); paint(); a.update(); }, sel:function(){ return sel; }, setSel:function(s){ sel = s; } });
      V = C1.view($("#tk-view"), { w:560, h:380, onPick:function(ai, h, kb){ sel = onPickSel(S.spec, mk(S.spec), ai); paint(); if (kb) ctl.firstChip(); }, label:function(ai){ return pickLabel(S.spec, mk(S.spec), sel, ai); } });
      C2.chips($("#tk-chips"), { subs:["methyl", "ethyl"], get:function(){ return S.tape; }, set:function(tk){ S.tape = tk; a.save(); a.update(); } });
      var chk = document.getElementById("task-check");
      if (chk) chk.addEventListener("click", function(){ if (S.tape.length && !S.tried) { S.tried = true; a.save(); paint(); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.f.C === 7 && d.f.H === 16 && !d.ring && !(d.f.F || d.f.Cl || d.f.Br || d.f.I), d.env.count === 3, !d.ring && d.n === 5, !!d.tape && d.tape === d.name]; },
    key:function(d){ return d.name; }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

// ---------- figures (molecule pictures inside content) ----------
function figInsert(c, m, o){
  var nx = c.nextElementSibling;
  if (nx && nx.classList && nx.classList.contains("ab-fig")) return;
  var sp = document.createElement("span"); sp.className = "ab-fig" + (o.cls ? " " + o.cls : ""); sp.innerHTML = C1.svgStatic(m, o);
  c.parentNode.insertBefore(sp, c.nextSibling);
}

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ formulas:formulasAct },
  task:task,
  figures:{
    p2:function(p, c){ figInsert(c, mk({ n:4, subs:[{ at:3, g:"methyl" }] }), { view:"cd", w:420, h:200 }); },
    m4:function(p, c){ figInsert(c, mk({ n:5, ring:true, subs:[{ at:0, g:"methyl" }] }), { view:"ln", w:180, h:170, cls:"sm", smax:56 }); },
    m5:function(p, c){ figInsert(c, mk({ n:6, ring:true, subs:[{ at:0, g:"Cl" }, { at:1, g:"Cl" }] }), { view:"ln", w:180, h:170, cls:"sm", smax:56 }); }
  }
});
})();
