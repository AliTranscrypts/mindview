// SCH4U 20 Hybridization: hero storyboard, Orbital mixer (Mix / Bond / Count / Build), Part 3 stations, σ/π counting
// practice, four-carbon chain task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, DEG = Math.PI / 180;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function smooth(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function LIN(t){ return t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function md(s){ return MV.md(s); }
function r1(v){ return Math.round(v * 10) / 10; }
var HT = { sp:"sp", sp2:"sp²", sp3:"sp³" };
function hyN(n){ return n === 1 ? "sp" : "sp" + n; }
function plural(k, w){ return k + " " + w + (k === 1 ? "" : "s"); }

// @component radioGroup (from MHF4U 25, via SCH4U 01–15) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled(id)})
// -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){
        var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false;
        return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>";
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

// ===== @component C1 hybridModel — SMILES-lite parser (C, N, O, B, F; = and # bonds; branches; one ring closure), implicit H,
// lone pairs, electron groups and sp / sp² / sp³ from the group count; σ / π totals; canonical form for small trees.
var VAL = { C:4, N:3, O:2, B:3, F:1 }, VE = { C:4, N:5, O:6, B:3, F:7 }, HYB = { 2:"sp", 3:"sp2", 4:"sp3" };
function smiles(s){
  var a = [], b = [], st = [], prev = -1, bo = 1, rg = {}, i = 0, ring = false;
  while (i < s.length) {
    var ch = s[i];
    if (ch === "(") { st.push(prev); i++; continue; }
    if (ch === ")") { prev = st.pop(); i++; continue; }
    if (ch === "=") { bo = 2; i++; continue; }
    if (ch === "#") { bo = 3; i++; continue; }
    if (/\d/.test(ch)) { ring = true; if (rg[ch] != null) { b.push([rg[ch], prev, bo]); delete rg[ch]; } else rg[ch] = prev; bo = 1; i++; continue; }
    a.push({ el:ch }); var k = a.length - 1; if (prev >= 0) b.push([prev, k, bo]); bo = 1; prev = k; i++;
  }
  return { a:a, b:b, ring:ring };
}
function prep(m){
  var n = m.a.length, i;
  m.nb = m.a.map(function(){ return []; });
  m.b.forEach(function(x, k){ m.nb[x[0]].push({ j:x[1], o:x[2], k:k }); m.nb[x[1]].push({ j:x[0], o:x[2], k:k }); });
  m.H = []; m.LP = []; m.hy = []; m.so = [];
  for (i = 0; i < n; i++) {
    var el = m.a[i].el, so = 0; m.nb[i].forEach(function(e){ so += e.o; });
    var h = Math.max(0, (VAL[el] || 0) - so), lp = Math.max(0, Math.round((VE[el] - so - h) / 2));
    m.so.push(so); m.H.push(h); m.LP.push(lp); m.hy.push(HYB[m.nb[i].length + h + lp] || "");
  }
  return m;
}
var MC = {};
function M(smi){ return MC[smi] || (MC[smi] = prep(smiles(smi))); }
function groups(m, i){ return m.nb[i].length + m.H[i] + m.LP[i]; }
function sigPi(m){ var s = m.b.length, p = 0; m.H.forEach(function(h){ s += h; }); m.b.forEach(function(b){ p += b[2] - 1; }); return { s:s, p:p }; }
function canon(m){
  var best = null;
  function f(x, p){ return "(" + m.a[x].el + m.H[x] + m.nb[x].filter(function(e){ return e.j !== p; }).map(function(e){ return e.o + f(e.j, x); }).sort().join("") + ")"; }
  for (var r = 0; r < m.a.length; r++) { var s = f(r, -1); if (best === null || s < best) best = s; }
  return best || "";
}
function toSmi(a, b){ // tree only: depth-first from atom 0
  var nb = a.map(function(){ return []; }); b.forEach(function(x){ nb[x[0]].push([x[1], x[2]]); nb[x[1]].push([x[0], x[2]]); });
  var seen = {};
  function w(x){ seen[x] = 1; var kids = nb[x].filter(function(e){ return !seen[e[0]]; }); kids.forEach(function(e){ seen[e[0]] = 1; }); var s = a[x];
    kids.forEach(function(e, i){ var t = (e[1] === 2 ? "=" : e[1] === 3 ? "#" : "") + w2(e[0]); s += i < kids.length - 1 ? "(" + t + ")" : t; }); return s; }
  function w2(x){ delete seen[x]; return w(x); }
  return a.length ? w(0) : "";
}
function geomT(m, i){
  var hy = m.hy[i], bonded = m.nb[i].length + m.H[i], lp = m.LP[i];
  if (bonded <= 1) return "Terminal atom: its groups point " + (hy === "sp" ? "in a line, 180°" : hy === "sp2" ? "in a plane, 120°" : "to the corners of a tetrahedron, 109.5°");
  if (hy === "sp") return "Linear, 180°";
  if (hy === "sp2") return lp ? "Bent, ≈ 120°" : "Trigonal planar, 120°";
  return lp === 0 ? "Tetrahedral, 109.5°" : lp === 1 ? "Trigonal pyramidal, ≈ 107°" : "Bent, ≈ 104.5°";
}
function orbT(hy){ return hy === "sp3" ? "4 sp³ (no p left over)" : hy === "sp2" ? "3 sp² + 1 unhybridized p" : hy === "sp" ? "2 sp + 2 unhybridized p" : "—"; }
function groupsT(m, i){ var b = m.nb[i].length + m.H[i], lp = m.LP[i]; return groups(m, i) + " " + muted("(" + plural(b, "bond") + ", " + plural(lp, "lone pair") + ")"); }

// Molecules in the picker (plan: 11, plus propyne for Challenge 2). nm = readout name per heavy atom; c = default atom.
var MOLS = [
  { id:"ethane", t:"ethane", smi:"CC", nm:["C (either carbon)", "C (either carbon)"] },
  { id:"ethene", t:"ethene", smi:"C=C", nm:["C (either carbon)", "C (either carbon)"] },
  { id:"ethyne", t:"ethyne", smi:"C#C", nm:["C (either carbon)", "C (either carbon)"] },
  { id:"methane", t:"methane", smi:"C" },
  { id:"co2", t:"CO₂", smi:"O=C=O", c:1, nm:["O (either oxygen)", "C", "O (either oxygen)"] },
  { id:"ch2o", t:"methanal (CH₂O)", smi:"C=O" },
  { id:"hcn", t:"HCN", smi:"C#N" },
  { id:"nh3", t:"NH₃", smi:"N" },
  { id:"h2o", t:"H₂O", smi:"O" },
  { id:"bf3", t:"BF₃", smi:"B(F)(F)F", nm:["B", "F (any fluorine)", "F (any fluorine)", "F (any fluorine)"] },
  { id:"benzene", t:"benzene", smi:"C1=CC=CC=C1", nm:["C (any carbon)", "C (any carbon)", "C (any carbon)", "C (any carbon)", "C (any carbon)", "C (any carbon)"] },
  { id:"propyne", t:"propyne", smi:"C#CC", c:1, nm:["C1 (the CH carbon)", "C2 (middle carbon)", "C3 (the CH₃ carbon)"] }
];
var MOL = {}; MOLS.forEach(function(x){ MOL[x.id] = x; });
function chipNames(m){ var cnt = {}, k = {}; m.a.forEach(function(x){ cnt[x.el] = (cnt[x.el] || 0) + 1; }); return m.a.map(function(x){ k[x.el] = (k[x.el] || 0) + 1; return x.el + (cnt[x.el] > 1 ? " " + k[x.el] : ""); }); }

// ===== @component C12 orbitalScene — 3D hybrid-orbital model of a molecule: VSEPR geometry built from the group count
// (tree BFS with anti zigzag, trans by default; benzene ring by hand), unhybridized p vectors passed along each multiple bond so
// π partners stay parallel (allene/CO₂ perpendicular), orientation with the first π's p up, torsion about a bond.
function va(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function vs(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function vm(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function vd(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vx(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function vl(a){ return Math.hypot(a[0], a[1], a[2]); }
function vn(a){ var l = vl(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function vperp(u){ var p = vx(u, [0, 1, 0]); if (vl(p) < 1e-6) p = vx(u, [1, 0, 0]); return vn(p); }
function vrej(a, u){ return vs(a, vm(u, vd(a, u))); }
function vrot(v, k, th){ var c = Math.cos(th), s = Math.sin(th); return va(va(vm(v, c), vm(vx(k, v), s)), vm(k, vd(k, v) * (1 - c))); }
var TET = [vn([1, 1, 1]), vn([1, -1, -1]), vn([-1, 1, -1]), vn([-1, -1, 1])];
var BLT = { CC:[1.54, 1.34, 1.2], CO:[1.43, 1.21, 1.13], CN:[1.47, 1.28, 1.16], BF:[1.31] };
function blen(e1, e2, o){
  if (e1 === "H" || e2 === "H") { var x = e1 === "H" ? e2 : e1; return x === "O" ? 0.96 : x === "N" ? 1.01 : x === "B" ? 1.19 : 1.09; }
  var t = BLT[[e1, e2].sort().join("")] || [1.45, 1.26, 1.15]; return t[Math.min(o, t.length) - 1];
}
function frame(hy, u, pg, r, flip){
  if (!u) {
    if (hy === "sp") return { dirs:[[1, 0, 0], [-1, 0, 0]], ps:[[0, 1, 0], [0, 0, 1]] };
    if (hy === "sp2") return { dirs:[[1, 0, 0], vn([-0.5, 0.866, 0]), vn([-0.5, -0.866, 0])], ps:[[0, 0, 1]] };
    return { dirs:TET, ps:[] };
  }
  var w = r || vperp(u);
  if (hy === "sp") { var p1 = pg[0] || w, p2 = pg[1] || vn(vx(u, p1)); return { dirs:[u, vm(u, -1)], ps:[p1, p2] }; }
  if (hy === "sp2") {
    var nn = pg[0] || vn(vx(u, w)), ww = vn(vx(nn, u));
    if (r && vd(ww, r) < 0) ww = vm(ww, -1);
    if (flip) ww = vm(ww, -1);
    return { dirs:[u, vn(va(vm(u, -0.5), vm(ww, 0.866))), vn(va(vm(u, -0.5), vm(ww, -0.866)))], ps:[nn] };
  }
  var v = vx(u, w), k8 = Math.sqrt(8) / 3, out = [u];
  for (var j = 0; j < 3; j++) { var ph = j * 2 * Math.PI / 3; out.push(vn(va(vm(u, -1 / 3), vm(va(vm(w, Math.cos(ph)), vm(v, Math.sin(ph))), k8)))); }
  return { dirs:out, ps:[] };
}
function bondsOf(m, A){
  var B = m.b.map(function(b, k){ return { a:b[0], b:b[1], o:b[2], k:"b" + k }; });
  A.forEach(function(a, i){ if (a.par != null) B.push({ a:a.par, b:i, o:1, k:a.k }); });
  return B;
}
var GC = {};
function geo3(m, opt){
  opt = opt || {};
  var key = toSmiKey(m) + (opt.flip ? "|f" + Object.keys(opt.flip).join(",") : "") + (opt.axis ? "|x" + opt.axis.join(",") : "");
  if (GC[key]) return GC[key];
  return (GC[key] = m.ring ? ringGeo(m) : treeGeo(m, opt));
}
function toSmiKey(m){ return m.a.map(function(x){ return x.el; }).join("") + "/" + m.b.map(function(b){ return b.join("."); }).join(";"); }
function treeGeo(m, opt){
  var A = m.a.map(function(x){ return { el:x.el, p:[0, 0, 0] }; }), orb = [], st = [], seen = {}, q = [0];
  st[0] = { u:null, pg:[], r:null, par:-1, k:null }; seen[0] = 1;
  while (q.length) {
    var x = q.shift(), s = st[x], fr = frame(m.hy[x], s.u, s.pg, s.r, opt.flip && opt.flip[x]), slots = fr.dirs, si = 0;
    var ob = orb[x] = { hy:m.hy[x], dirs:[], ps:fr.ps.map(function(d, i){ return { d:d, k:i < s.pg.length ? s.k : null }; }) };
    var free = ob.ps.filter(function(p){ return !p.k; }), ref = s.u;
    if (s.u) { ob.dirs.push({ d:s.u, use:"b", to:s.par, k:s.k }); si = 1; }
    m.nb[x].forEach(function(e){
      if (seen[e.j]) return; seen[e.j] = 1;
      var d = slots[si++] || vperp(slots[0]), k = "b" + e.k, pg = free.splice(0, e.o - 1);
      pg.forEach(function(p){ p.k = k; });
      A[e.j].p = va(A[x].p, vm(d, blen(m.a[x].el, m.a[e.j].el, e.o)));
      var rr = null; if (ref) { var rj = vrej(ref, d); if (vl(rj) > 1e-3) rr = vm(vn(rj), -1); }
      st[e.j] = { u:vm(d, -1), pg:pg.map(function(p){ return p.d; }), r:rr, par:x, k:k };
      ob.dirs.push({ d:d, use:"b", to:e.j, k:k }); q.push(e.j);
      if (!ref) ref = d;
    });
    for (var t = 0; t < m.H[x]; t++) { var dh = slots[si++] || vperp(slots[0]), hk = "h" + x + "." + t; A.push({ el:"H", p:va(A[x].p, vm(dh, blen(m.a[x].el, "H", 1))), par:x, k:hk }); ob.dirs.push({ d:dh, use:"h", to:A.length - 1, k:hk }); }
    for (t = 0; t < m.LP[x]; t++) ob.dirs.push({ d:slots[si++] || vperp(slots[0]), use:"lp" });
  }
  return orient({ n:m.a.length, A:A, B:bondsOf(m, A), orb:orb }, opt.axis);
}
function ringGeo(m){
  var R = 1.39, A = [], orb = [], k;
  for (k = 0; k < 6; k++) A.push({ el:"C", p:[R * Math.cos(k * 60 * DEG), 0, R * Math.sin(k * 60 * DEG)] });
  for (k = 0; k < 6; k++) A.push({ el:"H", p:vm(A[k].p, (R + 1.09) / R), par:k, k:"h" + k + ".0" });
  for (k = 0; k < 6; k++) {
    var pk = null, dirs = [];
    m.nb[k].forEach(function(e){ dirs.push({ d:vn(vs(A[e.j].p, A[k].p)), use:"b", to:e.j, k:"b" + e.k }); if (e.o === 2) pk = "b" + e.k; });
    dirs.push({ d:vn(A[k].p), use:"h", to:6 + k, k:"h" + k + ".0" });
    orb.push({ hy:"sp2", dirs:dirs, ps:[{ d:[0, 1, 0], k:pk }] });
  }
  return { n:6, A:A, B:bondsOf(m, A), orb:orb, ring:{ R:R } };
}
function orient(G, axis){
  var A = G.A, n = G.n, X = null, Y = null, pv = null, i, j;
  G.orb.forEach(function(o){ if (o) o.ps.forEach(function(p){ if (!pv && p.k) pv = p.d; }); });
  G.orb.forEach(function(o){ if (o) o.ps.forEach(function(p){ if (!pv) pv = p.d; }); });
  if (n >= 2) {
    var best = -1;
    if (axis) X = vn(vs(A[axis[1]].p, A[axis[0]].p));
    else for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) { var dd = vl(vs(A[j].p, A[i].p)); if (dd > best + 1e-6) { best = dd; X = vn(vs(A[j].p, A[i].p)); } }
    if (pv) Y = vrej(pv, X);
    for (i = 0; i < A.length && (!Y || vl(Y) < 0.3); i++) Y = vrej(vs(A[i].p, A[0].p), X);
    if (!Y || vl(Y) < 0.1) Y = vperp(X);
    Y = vn(Y);
  } else {
    var o0 = G.orb[0], lp = [0, 0, 0];
    o0.dirs.forEach(function(d){ if (d.use === "lp") lp = va(lp, d.d); });
    Y = vn(vl(lp) > 0.1 ? lp : pv || o0.dirs[0].d);
    for (i = 0; i < o0.dirs.length && (!X || vl(X) < 0.3); i++) X = vrej(o0.dirs[i].d, Y);
    X = X && vl(X) > 0.1 ? vn(X) : vperp(Y);
  }
  var Z = vx(X, Y), c = [0, 0, 0];
  A.forEach(function(a){ c = va(c, vm(a.p, 1 / A.length)); });
  function T(v){ return [vd(v, X), vd(v, Y), vd(v, Z)]; }
  A.forEach(function(a){ a.p = T(vs(a.p, c)); });
  G.orb.forEach(function(o){ if (!o) return; o.dirs.forEach(function(d){ d.d = T(d.d); }); o.ps.forEach(function(p){ p.d = T(p.d); }); });
  return G;
}
// turn the side of bond i–j that holds j about the i→j axis by deg
function twistG(G, i, j, deg){
  if (!deg) return G;
  var adj = G.A.map(function(){ return []; }); G.B.forEach(function(b){ adj[b.a].push(b.b); adj[b.b].push(b.a); });
  var side = {}, stk = [j]; side[j] = 1;
  while (stk.length) { var x = stk.pop(); adj[x].forEach(function(y){ if (!side[y] && y !== i) { side[y] = 1; stk.push(y); } }); }
  var P0 = G.A[i].p, k = vn(vs(G.A[j].p, P0)), th = deg * DEG;
  function R(v){ return vrot(v, k, th); }
  return { n:G.n, B:G.B, ring:G.ring,
    A:G.A.map(function(a, q){ if (!side[q]) return a; var o = Object.assign({}, a); o.p = va(P0, R(vs(a.p, P0))); return o; }),
    orb:G.orb.map(function(o, q){ return !o || !side[q] ? o : { hy:o.hy, dirs:o.dirs.map(function(d){ var c = Object.assign({}, d); c.d = R(d.d); return c; }), ps:o.ps.map(function(p){ return { d:R(p.d), k:p.k }; }) }; }) };
}

// ----- canvas renderer: painter-sorted convex silhouettes (hull of sampled ellipsoids), radial shading -----
function rgbOf(c){
  c = String(c || "").trim(); var h = c.charAt(0) === "#" ? c.slice(1) : "";
  if (h.length === 3) h = h.replace(/./g, "$&$&");
  if (h.length === 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  var mm = c.match(/\d+(\.\d+)?/g); return mm && mm.length >= 3 ? [+mm[0], +mm[1], +mm[2]] : [120, 120, 120];
}
function mixc(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function rgba(c, al){ return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (al == null ? 1 : al) + ")"; }
function pal(){
  var c = MV.css;
  return { hyb:rgbOf(c("--p-t")), pa:rgbOf(c("--orb-a")), pb:rgbOf(c("--orb-b")), hi:rgbOf(c("--hi")), hiC:c("--hi"), ink:c("--ink"), ink2:c("--ink-2"), ink2r:rgbOf(c("--ink-2")),
    sheet:c("--sheet"), pen:c("--pen"), ep:c("--e-pair"), red:c("--red"), green:c("--green"), dark:document.documentElement.getAttribute("data-theme") === "dark" || (!document.documentElement.getAttribute("data-theme") && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) };
}
function hull(P){
  var p = P.slice().sort(function(a, b){ return a[0] - b[0] || a[1] - b[1]; });
  function cr(o, a, b){ return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
  var lo = [], up = [], i;
  for (i = 0; i < p.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
  for (i = p.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p[i]) <= 0) up.pop(); up.push(p[i]); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
var RINGT = [-0.96, -0.82, -0.6, -0.3, 0, 0.3, 0.6, 0.82, 0.96];
function ell(c, ax, a, b){
  var e1 = vperp(ax), e2 = vx(ax, e1), out = [va(c, vm(ax, a)), va(c, vm(ax, -a))];
  RINGT.forEach(function(t){ var rr = b * Math.sqrt(1 - t * t), cc = va(c, vm(ax, a * t)); for (var k = 0; k < 20; k++) { var ph = k * Math.PI / 10; out.push(va(cc, va(vm(e1, rr * Math.cos(ph)), vm(e2, rr * Math.sin(ph))))); } });
  return out;
}
function Scene(ctx, rot, s, cx, cy){
  var c0 = Math.cos(rot.y), s0 = Math.sin(rot.y), c1 = Math.cos(rot.x), s1 = Math.sin(rot.x);
  return { ctx:ctx, s:s, P:[], L:[], K:pal(), pj:function(p){ var x = p[0] * c0 + p[2] * s0, z = -p[0] * s0 + p[2] * c0, y = p[1]; return [cx + s * x, cy - s * (y * c1 - z * s1), y * s1 + z * c1]; } };
}
function fillShape(c, Q, st, K){
  if (Q.length < 3) return;
  c.beginPath(); Q.forEach(function(q, i){ if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.closePath();
  if (st.rgb) {
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    Q.forEach(function(q){ x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    var gx = (x0 + x1) / 2, gy = (y0 + y1) / 2, R = Math.max(4, Math.max(x1 - x0, y1 - y0) / 2), g = c.createRadialGradient(gx - 0.35 * R, gy - 0.4 * R, R * 0.08, gx, gy, R * 1.25);
    g.addColorStop(0, rgba(mixc(st.rgb, [255, 255, 255], K.dark ? 0.35 : 0.5))); g.addColorStop(0.6, rgba(st.rgb)); g.addColorStop(1, rgba(mixc(st.rgb, [0, 0, 0], 0.25)));
    c.globalAlpha = st.al == null ? 1 : st.al; c.fillStyle = g; c.fill();
  }
  if (st.line) { c.globalAlpha = st.lal == null ? 1 : st.lal; c.strokeStyle = st.line; c.lineWidth = st.lw || 1.5; c.setLineDash(st.dash || []); c.stroke(); c.setLineDash([]); }
  c.globalAlpha = 1;
}
function addShape(sc, pts, zc, st){ var Q = hull(pts.map(sc.pj)), z = sc.pj(zc)[2]; sc.P.push({ z:z + (st.dz || 0), f:function(c){ fillShape(c, Q, st, sc.K); if (st.after) st.after(c); } }); }
function hybLobe(sc, o, d, L, st){
  var c = va(o, vm(d, L * 0.58)), pts = ell(c, d, L * 0.42, L * 0.25 + 0.03); pts.push(va(o, vm(d, L * 0.02)));
  if (st.dots) { var t = sc.pj(va(o, vm(d, L * 0.66))), e = vperp(d), q1 = sc.pj(va(va(o, vm(d, L * 0.66)), vm(e, 0.09))), q2 = sc.pj(va(va(o, vm(d, L * 0.66)), vm(e, -0.09)));
    st.after = function(cx){ cx.fillStyle = st.dots; [q1, q2].forEach(function(q){ cx.beginPath(); cx.arc(q[0], q[1], Math.max(2, sc.s * 0.05), 0, 2 * Math.PI); cx.fill(); }); void t; }; }
  addShape(sc, pts, c, st);
}
function pLobes(sc, o, d, L, al, st){
  [[d, sc.K.pa], [vm(d, -1), sc.K.pb]].forEach(function(x){
    var c = va(o, vm(x[0], L * 0.52)), pts = ell(c, x[0], L * 0.48, L * 0.27); pts.push(o);
    addShape(sc, pts, c, Object.assign({ rgb:x[1], al:al }, st));
  });
}
function sphere(sc, c, r, rgb, al, st){ var q = sc.pj(c); st = st || {}; sc.P.push({ z:q[2] + (st.dz || 0), f:function(cx){ var R = r * sc.s, Q = []; for (var k = 0; k < 24; k++) Q.push([q[0] + R * Math.cos(k * Math.PI / 12), q[1] + R * Math.sin(k * Math.PI / 12)]); fillShape(cx, Q, Object.assign({ rgb:rgb, al:al }, st), sc.K); } }); }
var RAD = { C:0.3, N:0.28, O:0.28, B:0.3, F:0.26, H:0.17 };
function ball(sc, p, el, r, st){
  st = st || {}; var q = sc.pj(p), K = sc.K;
  sc.P.push({ z:q[2] + 0.01, f:function(c){
    var R = Math.max(4, r * sc.s), fill = MV.css(MV.chem.colorVar(el)), rgb = rgbOf(fill);
    c.globalAlpha = st.al == null ? 1 : st.al;
    if (st.sel) { c.fillStyle = K.hiC; c.beginPath(); c.arc(q[0], q[1], R + 6, 0, 2 * Math.PI); c.fill(); }
    var g = c.createRadialGradient(q[0] - R * 0.35, q[1] - R * 0.4, R * 0.1, q[0], q[1], R * 1.1);
    g.addColorStop(0, rgba(mixc(rgb, [255, 255, 255], el === "H" ? 0 : 0.35))); g.addColorStop(1, rgba(el === "H" ? mixc(rgb, [200, 210, 220], 0.4) : rgb));
    c.fillStyle = g; c.beginPath(); c.arc(q[0], q[1], R, 0, 2 * Math.PI); c.fill();
    if (el === "H") { c.strokeStyle = MV.css("--at-h-line"); c.lineWidth = 1.2; c.stroke(); }
    if (st.sel) { c.strokeStyle = K.ink; c.lineWidth = 2; c.stroke(); }
    if (R >= 7) { c.fillStyle = el === "H" ? MV.css("--at-h-ink") : K.sheet; c.font = "700 " + Math.round(clamp(R * 1.05, 9, 18)) + "px " + (sc.font || "sans-serif"); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(el, q[0], q[1] + 0.5); }
    c.globalAlpha = 1;
  } });
}
function stick(sc, a, b, n, w, col, al){
  var p = sc.pj(a), q = sc.pj(b);
  sc.P.push({ z:(p[2] + q[2]) / 2 - 0.02, f:function(c){
    var dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, gap = w + 2.6;
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.globalAlpha = al == null ? 1 : al;
    for (var k = 0; k < n; k++) { var off = (k - (n - 1) / 2) * gap; c.beginPath(); c.moveTo(p[0] + nx * off, p[1] + ny * off); c.lineTo(q[0] + nx * off, q[1] + ny * off); c.stroke(); }
    c.globalAlpha = 1;
  } });
}
function label(sc, p3, t, st){ sc.L.push({ q:sc.pj(p3), t:t, st:st || {} }); }
function flush(sc, font){
  var c = sc.ctx; sc.font = font;
  sc.P.sort(function(a, b){ return a.z - b.z; }).forEach(function(p){ p.f(c); });
  sc.L.forEach(function(l){
    var st = l.st, fs = st.fs || 13; c.font = (st.w || 700) + " " + fs + "px " + font; c.textAlign = st.align || "center"; c.textBaseline = "middle";
    var x = l.q[0] + (st.dx || 0), y = l.q[1] + (st.dy || 0);
    if (st.box) { var w = c.measureText(l.t).width + 10; c.fillStyle = st.box; c.strokeStyle = st.boxLine || sc.K.ink2; c.lineWidth = 1.2; c.beginPath(); if (c.roundRect) c.roundRect(x - w / 2, y - fs * 0.75, w, fs * 1.5, 5); else c.rect(x - w / 2, y - fs * 0.75, w, fs * 1.5); c.fill(); c.stroke(); }
    if (st.sub) {
      var w1 = c.measureText(l.t).width, f2 = "italic " + (st.w || 700) + " " + Math.round(fs * 0.78) + "px " + font; c.font = f2; var w2 = c.measureText(st.sub).width, x0 = x - (w1 + w2) / 2;
      c.textAlign = "left"; c.lineWidth = 4; c.strokeStyle = sc.K.sheet; c.lineJoin = "round"; c.fillStyle = st.c || sc.K.ink;
      c.strokeText(st.sub, x0 + w1, y + fs * 0.3); c.fillText(st.sub, x0 + w1, y + fs * 0.3);
      c.font = (st.w || 700) + " " + fs + "px " + font; c.strokeText(l.t, x0, y); c.fillText(l.t, x0, y); return;
    }
    if (!st.box) { c.lineWidth = 4; c.strokeStyle = sc.K.sheet; c.lineJoin = "round"; c.strokeText(l.t, x, y); }
    c.fillStyle = st.c || sc.K.ink; c.fillText(l.t, x, y);
  });
}
function fitS(G, W, H, pad){ var R = 0; G.A.forEach(function(a){ R = Math.max(R, vl(a.p)); }); return Math.min(W, H) / (2 * (R + pad)) * 0.97; }
// o: {orbs, grow, sel, sig:"all"|{k:1}, pi:"all"|{k:1}, piF, ringCloud, pOnly, atag:{i:text}, btag:{k:text}, scale, cx, cy, sigLab, al}
function drawMol(ctx, W, H, G, rot, o, font){
  o = o || {};
  var orbs = !!o.orbs, s = o.scale || Math.min(fitS(G, W, H, orbs && !o.pOnly ? 0.8 : 0.6), orbs && !o.pOnly ? 105 : 88), sc = Scene(ctx, rot, s, o.cx != null ? o.cx : W / 2, o.cy != null ? o.cy : H / 2), K = sc.K, A = G.A, g = o.grow == null ? 1 : o.grow;
  sc.font = font;
  G.B.forEach(function(b){ var bs = !orbs || o.pOnly; stick(sc, A[b.a].p, A[b.b].p, bs ? b.o : 1, bs ? 3 : 2.2, K.ink2, bs ? 1 : 0.75); });
  A.forEach(function(a, i){ ball(sc, a.p, a.el, RAD[a.el] * (orbs && !o.pOnly ? 1 : 0.95), { sel:o.sel === i }); });
  if (orbs) {
    G.orb.forEach(function(ob, i){
      if (!ob) return;
      var P = A[i].p, isSel = o.sel === i, st0 = isSel ? { line:K.ink, lw:1.6 } : {};
      var hal = A[i].el === "F";
      if (!o.pOnly && g > 0.02) ob.dirs.forEach(function(dd){
        if (hal && dd.use === "lp") { var q0 = va(P, vm(dd.d, 0.42)), e0 = vperp(dd.d); [1, -1].forEach(function(sg){ sphere(sc, va(q0, vm(e0, 0.08 * sg)), 0.05, rgbOf(K.ep), 1, { dz:0.2 }); }); return; }
        var L = (dd.use === "h" ? 0.74 : dd.use === "lp" ? 0.7 : 0.5 * vl(vs(A[dd.to].p, P)) + 0.14) * g;
        hybLobe(sc, P, dd.d, L, Object.assign({ rgb:K.hyb, al:0.8, dots:dd.use === "lp" && g > 0.9 ? K.ep : null }, st0));
        if (isSel) label(sc, va(P, vm(dd.d, L * 0.62)), HT[ob.hy], { c:K.ink, fs:11 });
      });
      ob.ps.forEach(function(pp){
        var empty = !pp.k, Lp = 0.6 * (o.pOnly ? 1 : g); if (Lp < 0.02) return;
        pLobes(sc, P, pp.d, Lp, empty ? 0.28 : 0.85, empty ? { line:K.ink2, dash:[4, 3] } : st0);
        if (isSel || (empty && orbs)) label(sc, va(P, vm(pp.d, Lp + 0.22)), empty ? "empty p" : "p", { c:K.ink, fs:12 });
      });
    });
    if (!o.pOnly) A.forEach(function(a){ if (a.el === "H") sphere(sc, a.p, 0.38 * g, K.ink2r, 0.2, { dz:-0.05 }); });
  }
  if (o.sig) G.B.forEach(function(b){
    if (o.sig !== "all" && !o.sig[b.k]) return;
    var pa = A[b.a].p, pb = A[b.b].p, ax = vn(vs(pb, pa)), L = vl(vs(pb, pa)), c = A[b.b].el === "H" ? va(pa, vm(ax, L - 0.36)) : va(pa, vm(ax, L / 2));
    addShape(sc, ell(c, ax, 0.17, 0.11), c, { rgb:K.hi, al:o.sigA == null ? 0.92 : o.sigA, line:rgba(mixc(K.hi, [0, 0, 0], 0.35)), lw:1, dz:0.3 });
    if (o.sigLab === "all" || (o.sel != null && (b.a === o.sel || b.b === o.sel))) label(sc, c, "σ", { c:K.ink, fs:12, dy:-12 });
  });
  if (o.pi && !(G.ring && o.ringCloud)) G.B.forEach(function(b){
    if (b.o < 2 || (o.pi !== "all" && !o.pi[b.k])) return;
    var pa = G.orb[b.a] ? G.orb[b.a].ps.filter(function(p){ return p.k === b.k; }) : [], pb = G.orb[b.b] ? G.orb[b.b].ps.filter(function(p){ return p.k === b.k; }) : [];
    var A0 = A[b.a].p, B0 = A[b.b].p, ax = vn(vs(B0, A0)), mid = vm(va(A0, B0), 0.5), half = vl(vs(B0, A0)) / 2;
    pa.forEach(function(p, q){
      var p2 = pb[q]; if (!p2) return;
      var dt = vd(p.d, p2.d), f = Math.abs(dt) * (o.piF == null ? 1 : o.piF); if (f < 0.04) return;
      var nrm = vn(dt >= 0 ? va(p.d, p2.d) : vs(p.d, p2.d));
      [1, -1].forEach(function(sg){ var c = va(mid, vm(nrm, 0.56 * sg)); addShape(sc, ell(c, ax, half + 0.2, 0.2), c, { rgb:K.hi, al:0.3 * f, line:K.hiC, lw:2.6, lal:f, dz:0.4 }); });
      label(sc, va(mid, vm(nrm, 0.98)), "π", { c:K.ink, fs:14 });
    });
  });
  if (G.ring && o.ringCloud) {
    [1, -1].forEach(function(sg){
      var pts = []; for (var k = 0; k <= 48; k++) { var a = k / 48 * 2 * Math.PI; pts.push(sc.pj([G.ring.R * Math.cos(a), 0.56 * sg, G.ring.R * Math.sin(a)])); }
      var zc = sc.pj([0, 0.56 * sg, 0])[2];
      sc.P.push({ z:zc + 0.5, f:function(c){
        c.lineJoin = "round"; c.beginPath(); pts.forEach(function(q, i){ if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); });
        c.strokeStyle = rgba(K.hi, 0.5 * (o.ringF == null ? 1 : o.ringF)); c.lineWidth = Math.max(6, sc.s * 0.42); c.stroke();
        c.strokeStyle = K.hiC; c.globalAlpha = o.ringF == null ? 1 : o.ringF; c.lineWidth = 1.6; c.stroke(); c.globalAlpha = 1;
      } });
    });
    label(sc, [0, 1.05, 0], "π cloud", { c:K.ink, fs:13 });
  }
  if (o.atag) Object.keys(o.atag).forEach(function(i){ label(sc, A[+i].p, o.atag[i], { c:K.ink, fs:12, dx:18, dy:16, box:K.sheet }); });
  if (o.btag) G.B.forEach(function(b){ var t = o.btag[b.k]; if (t) label(sc, vm(va(A[b.a].p, A[b.b].p), 0.5), t, { c:K.ink, fs:12, dy:-17 }); });
  flush(sc, font);
  return sc;
}

// ===== @component C1 lineLabeller — 2D structural drawing (SVG) laid out from the hybridization (sp straight, sp² 120° zigzag,
// sp³ cross), condensed (CH₃, OH) or with every H and lone pair shown; atoms and bonds are real buttons over the drawing.
var U = 64;
function lay2(m, o){
  o = o || {};
  var n = m.a.length, P = [], Hs = [], LPs = [], ex = !!o.exH;
  if (m.ring) {
    for (var k = 0; k < 6; k++) { var a = (90 - k * 60) * DEG; P.push([Math.cos(a), Math.sin(a)]); if (ex) Hs.push({ par:k, t:0, p:[1.85 * Math.cos(a), 1.85 * Math.sin(a)] }); }
    return { P:P, Hs:Hs, LPs:LPs };
  }
  var q = [[0, null, 0]], seen = {}; seen[0] = 1; P[0] = [0, 0];
  function at(x, a, d){ return [P[x][0] + d * Math.cos(a * DEG), P[x][1] + d * Math.sin(a * DEG)]; }
  while (q.length) {
    var it = q.shift(), x = it[0], th = it[1], dep = it[2], hy = m.hy[x] || "sp3", slots, si = 0;
    if (th == null) { var hv = m.nb[x].length; slots = hy === "sp" ? [0, 180] : hy === "sp2" ? (hv === 3 ? [90, 210, 330] : [0, 120, 240]) : hv ? [0, 90, 270, 180] : [180, 0, 270, 90]; }
    else { var z = dep % 2 ? 1 : -1; slots = hy === "sp" ? [th] : hy === "sp2" ? [th + 60 * z, th - 60 * z] : [th, th + 90, th - 90]; }
    m.nb[x].forEach(function(e){ if (seen[e.j]) return; seen[e.j] = 1; var a = slots[si++]; if (a == null) a = (th || 0) + 45; P[e.j] = at(x, a, 1); q.push([e.j, a, dep + 1]); });
    if (ex) {
      for (var t = 0; t < m.H[x]; t++) { var ah = slots[si++]; if (ah == null) ah = (th || 0) + 135; Hs.push({ par:x, t:t, p:at(x, ah, 0.85) }); }
      for (t = 0; t < m.LP[x]; t++) { var al = slots[si++]; if (al == null) al = (th || 0) + 180; LPs.push({ par:x, a:al }); }
    }
  }
  return { P:P, Hs:Hs, LPs:LPs };
}
function tspan(t, fs){ return String(t).replace(/(\d+)/g, '<tspan dy="' + r1(fs * 0.28) + '" font-size="' + r1(fs * 0.72) + '">$1</tspan><tspan dy="' + r1(-fs * 0.28) + '"> </tspan>').replace(/<tspan dy="[^"]*"> <\/tspan>$/, ""); }
function inkOf(el){ return el === "C" ? "var(--ink)" : el === "B" ? "var(--ink-2)" : "var(" + MV.chem.colorVar(el) + ")"; }
// draw(m, L, o): o = {exH, atag:{i:{t, cls}}, btag:{k:text}, selA, selB, hiA:[i]} -> {svg, w, h, pos(x, y), mid(k)}
function draw2(m, L, o){
  o = o || {};
  var xs = [], ys = [];
  L.P.forEach(function(p){ xs.push(p[0]); ys.push(p[1]); }); L.Hs.forEach(function(h){ xs.push(h.p[0]); ys.push(h.p[1]); });
  var pad = o.pad || 0.75, x0 = Math.min.apply(null, xs) - pad - (o.exH ? 0 : 0.35), x1 = Math.max.apply(null, xs) + pad + (o.exH ? 0 : 0.35), y0 = Math.min.apply(null, ys) - pad, y1 = Math.max.apply(null, ys) + pad;
  var W = Math.round((x1 - x0) * U), H = Math.round((y1 - y0) * U), fs = 19, out = "";
  function X(x){ return (x - x0) * U; } function Y(y){ return (y1 - y) * U; }
  var lab = m.a.map(function(a, i){ return o.exH ? a.el : a.el + (m.H[i] ? "H" + (m.H[i] > 1 ? m.H[i] : "") : ""); });
  function hw(i){ return i < 0 ? 0.12 : 0.04 + 0.1 * lab[i].replace(/\d/g, "").length + 0.05 * lab[i].replace(/\D/g, "").length; }
  function seg(p, q, ea, eb, off){
    var dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
    function gap(e){ return Math.min(Math.abs(ux) > 1e-3 ? e / Math.abs(ux) : 9, Math.abs(uy) > 1e-3 ? 0.15 / Math.abs(uy) : 9) + 0.06; }
    var ta = gap(ea), tb = gap(eb);
    return [X(p[0] + ux * ta) - uy * off, Y(p[1] + uy * ta) - ux * off, X(q[0] - ux * tb) - uy * off, Y(q[1] - uy * tb) - ux * off];
  }
  function line(g, cls){ return '<line x1="' + r1(g[0]) + '" y1="' + r1(g[1]) + '" x2="' + r1(g[2]) + '" y2="' + r1(g[3]) + '"' + (cls ? ' class="' + cls + '"' : "") + "/>"; }
  var cx = 0, cy = 0; L.P.forEach(function(p){ cx += p[0] / L.P.length; cy += p[1] / L.P.length; });
  var mids = {};
  m.b.forEach(function(b, k){
    var key = "b" + k, p = L.P[b[0]], q = L.P[b[1]], on = o.selB === key;
    if (on) out += line(seg(p, q, hw(b[0]), hw(b[1]), 0), "hy2-selb");
    for (var j = 0; j < b[2]; j++) out += line(seg(p, q, hw(b[0]), hw(b[1]), (j - (b[2] - 1) / 2) * 7));
    mids[key] = { x:X((p[0] + q[0]) / 2), y:Y((p[1] + q[1]) / 2), p:p, q:q };
  });
  L.Hs.forEach(function(h){ var key = "h" + h.par + "." + h.t, on = o.selB === key, g = seg(L.P[h.par], h.p, hw(h.par), 0.12, 0); if (on) out += line(g, "hy2-selb"); out += line(g); mids[key] = { x:X((L.P[h.par][0] + h.p[0]) / 2), y:Y((L.P[h.par][1] + h.p[1]) / 2), p:L.P[h.par], q:h.p }; });
  // bond tags beside the bond, on the side away from the molecule's centre
  if (o.btag) Object.keys(o.btag).forEach(function(k){
    var mm = mids[k]; if (!mm || !o.btag[k]) return;
    var dx = mm.q[0] - mm.p[0], dy = mm.q[1] - mm.p[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, mx = (mm.p[0] + mm.q[0]) / 2, my = (mm.p[1] + mm.q[1]) / 2;
    if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
    var bt = o.btag[k]; out += '<text class="hy2-bt' + (bt.cls ? " " + bt.cls : "") + '" x="' + r1(X(mx + nx * 0.3)) + '" y="' + r1(Y(my + ny * 0.3)) + '">' + bt.t + "</text>";
  });
  L.LPs.forEach(function(lp){ var p = L.P[lp.par], a = lp.a * DEG, c = [p[0] + 0.36 * Math.cos(a), p[1] + 0.36 * Math.sin(a)], px = -Math.sin(a) * 0.09, py = Math.cos(a) * 0.09;
    out += '<circle class="hy2-lp" cx="' + r1(X(c[0] + px)) + '" cy="' + r1(Y(c[1] + py)) + '" r="3.2"/><circle class="hy2-lp" cx="' + r1(X(c[0] - px)) + '" cy="' + r1(Y(c[1] - py)) + '" r="3.2"/>'; });
  m.a.forEach(function(a, i){
    var x = X(L.P[i][0]), y = Y(L.P[i][1]), on = o.selA === i || (o.hiA && o.hiA.indexOf(i) >= 0);
    if (on) out += '<circle class="hy2-sela" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(fs * 0.5 + lab[i].length * 4.5) + '"/>';
    out += '<text class="hy2-at" x="' + r1(x) + '" y="' + r1(y) + '" fill="' + inkOf(a.el) + '">' + tspan(lab[i], fs) + "</text>";
    var tg = o.atag && o.atag[i]; if (tg) { var tw = tg.t.length * 7 + 12; out += '<g class="hy2-tag' + (tg.cls ? " " + tg.cls : "") + '"><rect x="' + r1(x - tw / 2) + '" y="' + r1(y + 15) + '" width="' + tw + '" height="20" rx="6"/><text x="' + r1(x) + '" y="' + r1(y + 25.5) + '">' + tg.t + "</text></g>"; }
  });
  L.Hs.forEach(function(h){ out += '<text class="hy2-at" x="' + r1(X(h.p[0])) + '" y="' + r1(Y(h.p[1])) + '" fill="var(--ink)">H</text>'; });
  return { svg:out, w:W, h:H + (o.atag ? 14 : 0), pos:function(i){ return [X(L.P[i][0]), Y(L.P[i][1])]; }, mids:mids };
}
// wrap: SVG at its natural size in a horizontal scroller, with atom (and bond) buttons over it
function labHTML(m, L, o, uid, label){
  var d = draw2(m, L, o), btn = "";
  (o.atoms || m.a.map(function(_, i){ return i; })).forEach(function(i){ var p = d.pos(i); btn += '<button type="button" class="hy2-pk" style="left:' + r1(p[0]) + "px;top:" + r1(p[1]) + 'px" data-pa="' + i + '" data-k="' + uid + "a" + i + '" aria-pressed="' + (o.selA === i) + '" aria-label="' + esc(label("a", i)) + '"></button>'; });
  if (o.bonds) Object.keys(d.mids).forEach(function(k){ var p = d.mids[k]; btn += '<button type="button" class="hy2-pk bd" style="left:' + r1(p.x) + "px;top:" + r1(p.y) + 'px" data-pb="' + k + '" data-k="' + uid + "b" + k + '" aria-pressed="' + (o.selB === k) + '" aria-label="' + esc(label("b", k)) + '"></button>'; });
  return '<div class="hy2-scroll"><div class="hy2-box" style="width:' + d.w + "px;height:" + d.h + 'px"><svg class="hy2-svg" width="' + d.w + '" height="' + d.h + '" viewBox="0 0 ' + d.w + " " + d.h + '" aria-hidden="true">' + d.svg + "</svg>" + btn + "</div></div>";
}
function bondName(m, k){
  if (k.charAt(0) === "h") return m.a[+k.slice(1).split(".")[0]].el + "–H bond";
  var b = m.b[+k.slice(1)]; return m.a[b[0]].el + (b[2] === 3 ? "≡" : b[2] === 2 ? "=" : "–") + m.a[b[1]].el + " bond";
}
function bondsList(m){ var L = m.b.map(function(b, k){ return { k:"b" + k, o:b[2], a:b[0], b:b[1] }; }); m.H.forEach(function(h, i){ for (var t = 0; t < h; t++) L.push({ k:"h" + i + "." + t, o:1, a:i, b:-1 }); }); return L; }

// shared pointer/keyboard rotation for a 3D canvas; onPick(x, y) for a tap without a drag
function spin(cv, rot, redraw, save, onPick){
  var drag = null;
  cv.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY, x0:e.clientX, y0:e.clientY }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
  cv.addEventListener("pointermove", function(e){ if (!drag) return; rot.y += (e.clientX - drag.x) * 0.012; rot.x = clamp(rot.x + (e.clientY - drag.y) * 0.012, -1.55, 1.55); drag.x = e.clientX; drag.y = e.clientY; redraw(); });
  function end(e){ if (!drag) return; var moved = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0); drag = null; if (save) save(); if (moved < 6 && onPick) { var r = cv.getBoundingClientRect(); onPick(e.clientX - r.left, e.clientY - r.top); } }
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", function(){ drag = null; });
  cv.addEventListener("keydown", function(e){
    var k = e.key, d = 15 * DEG;
    if (k === "ArrowLeft") rot.y -= d; else if (k === "ArrowRight") rot.y += d; else if (k === "ArrowUp") rot.x = clamp(rot.x - d, -1.55, 1.55); else if (k === "ArrowDown") rot.x = clamp(rot.x + d, -1.55, 1.55); else return;
    e.preventDefault(); if (save) save(); redraw();
  });
}
var PRESET = { tilt:{ x:0.42, y:-0.3 }, side:{ x:0, y:0 }, top:{ x:1.45, y:0 } };

// ---------- energies (course table) ----------
function bondE(b){ var r = MV.chem.data.bond.filter(function(x){ return x[0] === b; })[0]; return r ? r[1] : 0; }
var E_PI = bondE("C=C") - bondE("C–C");   // ≈ 267 kJ/mol: the π part of C=C, from the course bond energies
var E_ETH = 12;                            // VERIFY: ethane's staggered → eclipsed barrier ≈ 12 kJ/mol (course table addition)
function twistE(id, deg){ return id === "ethene" ? E_PI * Math.pow(Math.sin(deg * DEG), 2) : E_ETH / 2 * (1 - Math.cos(3 * deg * DEG)); }
function miscVal(name){ var r = MV.chem.data.misc.filter(function(x){ return x[0].indexOf(name) >= 0; })[0]; return r ? r[1] : ""; }

// ===== Mix mode: carbon's 2s and 2p orbitals before mixing, the hybrids after; energy diagram with boxes
var OLDP = [{ ax:[1, 0, 0], s:"x" }, { ax:[0, 0, 1], s:"z" }, { ax:[0, 1, 0], s:"y" }];
function hybDirs(n){
  if (n === 1) return [[1, 0, 0], [-1, 0, 0]];
  if (n === 2) return [0, 120, 240].map(function(a){ return [Math.cos(a * DEG), 0, Math.sin(a * DEG)]; });
  var k8 = Math.sqrt(8) / 3; return [[0, 1, 0]].concat([30, 150, 270].map(function(a){ return [k8 * Math.cos(a * DEG), -1 / 3, k8 * Math.sin(a * DEG)]; }));
}
function rotY(v, a){ var c = Math.cos(a), s = Math.sin(a); return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; }
// st = {n, mt (mix 0–1), hp (H approach 0–1)}
function drawMix(ctx, W, H, st, rot, font, o){
  o = o || {};
  var s = o.scale || Math.min(W, H) / 3.8, sc = Scene(ctx, rot, s, o.cx != null ? o.cx : W / 2, o.cy != null ? o.cy : H / 2), K = sc.K, n = st.n, t = st.mt, O = [0, 0, 0];
  sc.font = font;
  ball(sc, O, "C", 0.3, {});
  var sw = (1 - t) * 70 * DEG, sw0 = t * 70 * DEG;
  if (t < 1 && !o.noOld) {
    var f = 1 - t;
    sphere(sc, O, 0.62 * f, K.pa, 0.42, { dz:-0.4 });
    OLDP.forEach(function(p, i){
      var mixes = i < n, sz = mixes ? f : 1; if (sz < 0.03) return;
      var ax = mixes ? rotY(p.ax, sw0) : p.ax; pLobes(sc, O, ax, 0.95 * sz, 0.85, {});
      if (!t && !o.noLab) label(sc, vm(ax, 1.2), "2p", { fs:14, sub:p.s });
    });
    if (!t && !o.noLab) label(sc, [0, -0.8, 0.45], "2s", { fs:14 });
  }
  if (t > 0) {
    hybDirs(n).forEach(function(d){
      var dd = rotY(d, -sw); hybLobe(sc, O, dd, 1.08 * t, { rgb:K.hyb, al:0.8 });
      if (t >= 1 && !o.noLab && !o.noHyb && !(st.hp > 0)) label(sc, vm(dd, 1.34), HT[hyN(n)], { fs:13 });
    });
    OLDP.forEach(function(p, i){ if (i < n) return; pLobes(sc, O, p.ax, 0.95, 0.85, {}); if (t >= 1 && !o.noLab) label(sc, vm(p.ax, 1.2), "p", { fs:13 }); });
  }
  if (n === 3 && st.hp > 0) {
    hybDirs(3).forEach(function(d){
      var dist = lerp(2.7, 1.42, smooth(st.hp)), hp = vm(d, dist);
      sphere(sc, hp, 0.42, K.ink2r, 0.22, { dz:-0.05 }); ball(sc, hp, "H", 0.17, {});
      if (st.hp >= 1) { var c = vm(d, 1.42 - 0.36); addShape(sc, ell(c, d, 0.17, 0.11), c, { rgb:K.hi, al:0.92, line:rgba(mixc(K.hi, [0, 0, 0], 0.35)), lw:1, dz:0.3 }); if (!o.noLab) label(sc, c, "σ", { fs:12, dy:-12 }); }
    });
  }
  flush(sc, font);
}
// energy diagram SVG: st {n, pr (promotion 0–1), mt}
function eDiag(st){
  var n = st.n, pr = st.pr, mt = smooth(st.mt), ys = 166, yp = 70, yh = (ys + n * yp) / (n + 1), bw = 28, gap = 34, x0 = 96, out = "";
  var src = [{ id:"s", x:x0, y:ys }, { id:"p1", x:x0, y:yp }, { id:"p2", x:x0 + gap, y:yp }, { id:"p3", x:x0 + 2 * gap, y:yp }];
  var boxes = src.map(function(b, i){
    var mixes = i <= n, tx = mixes ? x0 + i * gap : x0 + (n + 1) * gap + 14 + (i - n - 1) * gap, ty = mixes ? yh : yp;
    return { x:lerp(b.x, tx, mt), y:lerp(b.y, ty, mt), i:i, mixes:mixes };
  });
  out += '<line class="hy-eax" x1="34" y1="196" x2="34" y2="22"/><path class="hy-eah" d="M28 30 L34 18 L40 30Z"/><text class="hy-elab" x="20" y="110" transform="rotate(-90 20 110)">energy</text>';
  var lv = function(y, t, al){ return al > 0.02 ? '<g opacity="' + r1(al) + '"><line class="hy-elv" x1="' + (x0 - 6) + '" y1="' + r1(y + bw / 2) + '" x2="' + (x0 + 3 * gap + bw + 6) + '" y2="' + r1(y + bw / 2) + '"/><text class="hy-elab" x="' + (x0 - 12) + '" y="' + r1(y + bw / 2 + 5) + '" text-anchor="end">' + t + "</text></g>" : ""; };
  out += lv(ys, "2s", 1 - mt) + lv(yp, "2p", n === 3 ? 1 - mt : 1);
  if (mt > 0) out += lv(yh, HT[hyN(n)], mt);
  // electrons: ground s↑↓ p↑ p↑; promoted s↑ p↑ p↑ p↑ (the moving ↓ flies from s to p3 and flips)
  boxes.forEach(function(b){
    out += '<rect class="hy-ebox' + (b.mixes && mt > 0 ? " hyb" : "") + '" x="' + r1(b.x) + '" y="' + r1(b.y) + '" width="' + bw + '" height="' + bw + '" rx="3"/>';
    var arr = b.i === 0 ? (pr < 1 ? ["↑", "↓"] : ["↑"]) : b.i < 3 ? ["↑"] : pr >= 1 ? ["↑"] : [];
    if (b.i === 0 && pr > 0 && pr < 1) arr = ["↑"];
    arr.forEach(function(a, k){ out += '<text class="hy-eel" x="' + r1(b.x + bw / 2 + (arr.length === 2 ? (k ? 6 : -6) : 0)) + '" y="' + r1(b.y + bw / 2 + 6) + '">' + a + "</text>"; });
  });
  if (pr > 0 && pr < 1) { var a0 = boxes[0], a3 = boxes[3], e = smooth(pr); out += '<text class="hy-eel fly" x="' + r1(lerp(a0.x + bw / 2 + 6, a3.x + bw / 2, e)) + '" y="' + r1(lerp(a0.y, a3.y, e) + bw / 2 + 6) + '">' + (e < 0.5 ? "↓" : "↑") + "</text>"; }
  return '<svg class="hy-esvg" viewBox="0 0 320 210" role="img" aria-label="' + esc(eDesc(st)) + '">' + out + "</svg>";
}
function eDesc(st){
  if (st.mt >= 1) { var k = st.n + 1, h = HT[hyN(st.n)]; return "Energy diagram: " + k + " " + h + " orbitals at one level, one electron each" + (st.n < 3 ? ", and " + (3 - st.n) + " unhybridized 2p orbital" + (st.n === 1 ? "s" : "") + " above, one electron each." : "."); }
  return st.pr >= 1 ? "Energy diagram: promoted carbon, 2s1 2p3: one electron in the 2s box and one in each 2p box. 4 unpaired electrons." : "Energy diagram: ground-state carbon, 2s2 2p2: a pair in the 2s box, single electrons in two 2p boxes, one 2p box empty. 2 unpaired electrons.";
}

// ---------- hero: 2s + three 2p on an energy diagram → four sp³ lobes → four σ bonds → ethene's π ----------
function hero(f){
  var cv = $("#hy-hxc"), ctr = $("#hy-hxctr"), rep = $("#hy-hxreplay"), cap = f.cap;
  if (!cv) return;
  var TT = 10, t = TT, run = 0, EG = geo3(M("C=C"));
  var hp = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  hp.render = function(){
    hp.draw({ grid:false, axes:false, ticks:false, describe:cv.getAttribute("aria-label"), after:function(ctx, p){
      var W = p.W, H = p.H, font = p.fontUI, K = pal();
      var e = smooth((t - 1.4) / 2.4), dia = 1 - clamp((t - 3.9) / 0.7, 0, 1), grow = smooth((t - 3.9) / 1.1), hpz = clamp((t - 5.1) / 1.5, 0, 1), d = smooth((t - 6.8) / 1.3), pi = smooth((t - 8.2) / 1.2);
      // energy diagram: 2s low, three 2p higher; they swirl to one sp³ level as four equal teardrops
      if (dia > 0) {
        var xL = W * 0.08, xR = W * 0.92, ys = H * 0.84, yp = H * 0.32, yh = (ys + 3 * yp) / 4, isz = H * 0.1;
        ctx.save(); ctx.strokeStyle = K.ink2; ctx.lineWidth = 1.6; ctx.fillStyle = K.ink; ctx.font = "700 15px " + font; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
        [[ys, "2s", 1 - e], [yp, "2p", 1 - e], [yh, "sp³", e]].forEach(function(l){ if (l[2] < 0.02) return; ctx.globalAlpha = dia * l[2]; ctx.beginPath(); ctx.moveTo(xL, l[0]); ctx.lineTo(xR, l[0]); ctx.stroke(); ctx.fillText(l[1], xL, l[0] - 4); });
        ctx.globalAlpha = dia; ctx.textAlign = "right"; ctx.font = "13px " + font; ctx.fillStyle = K.ink2; ctx.fillText("energy ↑", xR, H * 0.12);
        var slots = [0.3, 0.47, 0.64, 0.81].map(function(f0){ return W * f0; }), sw = e * 2.6, fade = 1 - smooth((e - 0.35) / 0.4);
        if (fade > 0) {
          var s1 = Scene(ctx, { x:0.3, y:-0.5 + sw }, isz * (1 - e * 0.5), slots[0], lerp(ys, yh, e) - isz * 0.75); sphere(s1, [0, 0, 0], 0.62, K.pa, 0.55 * fade, {}); flush(s1, font);
          OLDP.forEach(function(op, i){ var s2 = Scene(ctx, { x:0.3, y:-0.5 + sw }, isz * (1 - e * 0.5), slots[i + 1], lerp(yp, yh, e) - isz * 1.0); pLobes(s2, [0, 0, 0], op.ax, 0.95, 0.85 * fade, {}); flush(s2, font); });
        }
        var gv = smooth((e - 0.4) / 0.6);
        if (gv > 0) slots.forEach(function(x){ var s3 = Scene(ctx, { x:0.3, y:-0.5 }, isz, x, yh - 2); hybLobe(s3, [0, 0, 0], [0, 1, 0], 1.15 * gv, { rgb:K.hyb, al:0.85 * dia }); flush(s3, font); });
        ctx.restore();
      }
      // CH₄: the sp³ set forms, four H atoms approach head-on and each overlap glows σ; then it slides left for ethene
      if (grow > 0) {
        var mx = lerp(W * 0.5, W * 0.25, d), sc2 = Math.min(W, H) / 4.4 * lerp(1, 0.82, d);
        drawMix(ctx, W, H, { n:3, mt:grow, hp:hpz }, { x:0.32, y:-0.5 + t * 0.04 }, font, { cx:mx, cy:H * 0.5, scale:sc2, noHyb:true, noOld:true, noLab:hpz < 1 });
      }
      if (d > 0) {
        ctx.save(); ctx.globalAlpha = d;
        drawMol(ctx, W, H, EG, { x:0.38, y:-0.4 }, { orbs:true, sig:pi > 0.5 ? "all" : null, sigA:clamp((pi - 0.5) * 2, 0, 1) * 0.92, pi:pi > 0 ? "all" : null, piF:pi, cx:W * 0.73, cy:H * 0.48, scale:Math.min(W, H) / 4.8 }, font);
        ctx.restore();
        ctx.fillStyle = K.ink; ctx.font = "700 15px " + font; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.globalAlpha = d; ctx.fillText("CH₄", W * 0.25, H - 6); ctx.fillText("ethene", W * 0.73, H - 6); ctx.globalAlpha = 1;
      }
    } });
  };
  function final(){ t = TT; hp.render(); ctr.textContent = "Head-on overlap makes σ bonds; sideways p overlap makes a π bond."; cap.textContent = "Methane’s four sp³ σ bonds, and ethene’s double bond: σ plus π."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; cap.textContent = ""; t = 0; hp.render();
    MV.tween({ dur:TT * 1000, ease:LIN, step:function(q){
      if (id !== run) return; t = q * TT; hp.render();
      ctr.textContent = t < 1.4 ? "Carbon’s 2s and three 2p orbitals sit at different energies." : t < 5.1 ? "They mix and level out into four equal sp³ orbitals." : t < 6.8 ? "Four H atoms overlap head-on: four σ bonds." : "Ethene: side-by-side p orbitals overlap above and below the axis: a π bond.";
    }, done:function(){ if (id === run) final(); } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ===== Explore: Orbital mixer =====
function explore(host, api){
  var S = api.S, C = api.content, FB = C.fb;
  if (["mix", "bond", "count", "build"].indexOf(S.mode) < 0) S.mode = "mix";
  if (!MOL[S.mol]) S.mol = "ethene";
  var rot = S.rot = S.rot && isFinite(S.rot.x) && isFinite(S.rot.y) ? { x:clamp(+S.rot.x, -1.55, 1.55), y:+S.rot.y } : { x:PRESET.tilt.x, y:PRESET.tilt.y };
  S.sel = S.sel && typeof S.sel === "object" ? S.sel : {};
  S.tw = Math.round(clamp(+S.tw || 0, 0, 90) / 15) * 15;
  var mx = S.mx = S.mx && typeof S.mx === "object" ? S.mx : {}; mx.n = [1, 2, 3].indexOf(+mx.n) >= 0 ? +mx.n : 3; mx.promo = !!mx.promo; mx.mixed = !!mx.mixed && mx.promo; mx.h = !!mx.h && mx.mixed && mx.n === 3;
  S.lab = S.lab && typeof S.lab === "object" ? S.lab : {};
  var bd = S.bd = S.bd && Array.isArray(S.bd.a) && S.bd.a.length && Array.isArray(S.bd.b) ? S.bd : { a:["C"], b:[] };
  bd.a = bd.a.filter(function(e){ return e === "C" || e === "N" || e === "O"; }).slice(0, 8); if (!bd.a.length) bd.a = ["C"];
  bd.b = bd.b.filter(function(x){ return Array.isArray(x) && x[0] < bd.a.length && x[1] < bd.a.length && x[2] >= 1 && x[2] <= 3; });
  if (bd.b.length !== bd.a.length - 1) { bd.a = ["C"]; bd.b = []; }
  S.bo = [1, 2, 3].indexOf(+S.bo) >= 0 ? +S.bo : 1;
  var bsel = { k:"a", i:0 }, csel = null, locked = false, busy = false, tw = null, run = 0, an = null, grow = 1, cMsg = null, bMsg = "";

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="hy-modes"></div><div class="hy-molp"></div>' +
    '<div class="hy-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="hy-stage"><canvas class="hy-cv" tabindex="0" role="img" aria-label=""></canvas></div>' +
    '<div class="hy-pre" role="group" aria-label="3D view"><button type="button" class="btn ghost sm" data-pre="tilt" data-k="hyptilt">Tilted</button><button type="button" class="btn ghost sm" data-pre="side" data-k="hypside">Side</button><button type="button" class="btn ghost sm" data-pre="top" data-k="hyptop">Top</button><span class="tiny muted hy-turn">Drag the view or use the arrow keys to turn it.</span></div>' +
    '<p class="hy-legend"><span><i class="hy-sw" style="background:var(--p-t)"></i>hybrid orbital</span><span><i class="hy-sw" style="background:var(--orb-a)"></i><i class="hy-sw" style="background:var(--orb-b)"></i>p orbital (two phases)</span><span><i class="hy-sw" style="background:var(--hi)"></i>σ overlap</span><span><i class="hy-sw ring"></i>π overlap</span></p>' +
    '<p class="hy-cap" aria-live="polite"></p></div>' +
    '<div class="hy-grid"><div class="hy-ctrl">' +
    '<div class="hy-c" data-for="mix"><div class="hy-mixc"></div><div class="q-actions hy-mixb"></div><div class="hy-ed"></div><p class="hy-edcap" aria-live="polite"></p><p class="tiny muted">' + C.modelNote + "</p></div>" +
    '<div class="hy-c" data-for="bond"><div class="hy-atoms"></div><div class="hy-tw"><div class="hy-twsl"></div><div class="hy-meters"></div><p class="tiny muted hy-twnote"></p></div></div>' +
    '<div class="hy-c" data-for="count"><div class="hy-lab"></div><div class="hy-csel" aria-live="polite"></div><p class="hy-tally" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn primary sm" data-q="cchk" data-k="hycchk">Check my labels</button><button type="button" class="btn ghost sm" data-q="cclr" data-k="hycclr">Clear labels</button></div><div class="hy-cfb" aria-live="polite"></div></div>' +
    '<div class="hy-c" data-for="build"><div class="hy-bdraw"></div><div class="hy-bsel" aria-live="polite"></div><div class="hy-bord"></div><div class="q-actions hy-badd"></div><p class="hy-bcount" aria-live="polite"></p><p class="tiny muted">' + C.buildNote + "</p></div>" +
    '</div><div class="hy-right"><dl class="read hy-read" aria-live="polite"></dl></div></div>';
  var cv = $(".hy-cv", host);

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".hy-modes", host), { label:"Mode", aria:"Mixer mode", options:C.modes, value:S.mode, onChange:function(v){ stopAnim(); S.mode = v; csel = null; cMsg = null; MV.banner("", ""); api.save(); paint(); } });
  RG.mol = radios($(".hy-molp", host), { label:"Molecule", aria:"Molecule", cls:"chips", options:MOLS.map(function(x){ return { id:x.id, t:x.t }; }), value:S.mol, onChange:function(v){ stopAnim(); S.mol = v; csel = null; cMsg = null; grow = 1; MV.banner("", ""); api.save(); paint(); } });
  RG.mx = radios($(".hy-mixc", host), { label:"Mix", aria:"Orbitals to mix", cls:"chips", options:C.mixes, value:String(mx.n), onChange:function(v){ stopAnim(); mx.n = +v; mx.mixed = false; mx.h = false; api.save(); paint(); } });
  RG.bo = radios($(".hy-bord", host), { label:"Bond", aria:"Bond type", cls:"chips", options:[{ id:"1", t:"single –" }, { id:"2", t:"double =" }, { id:"3", t:"triple ≡" }], value:String(S.bo), onChange:function(v){ setOrder(+v); } });
  var SL = MV.sliders($(".hy-twsl", host), [{ id:"hytw", label:"Twist one end", min:0, max:90, step:15, value:S.tw, fmt:function(v){ return Math.round(v) + "°"; } }], function(id, v){ S.tw = Math.round(v / 15) * 15; api.save(); twistNote(); paint(); });
  function twistNote(){ if (S.mol === "ethene" && S.tw > 0) MV.banner("", C.twistBanner); else MV.banner("", ""); }

  // ----- geometry for the current view -----
  function mol(){ return S.mode === "build" ? prep({ a:bd.a.map(function(e){ return { el:e }; }), b:bd.b.map(function(x){ return x.slice(); }) }) : M(MOL[S.mol].smi); }
  function geo(){ var m = mol(), G = geo3(m); return (S.mode === "bond" && (S.mol === "ethene" || S.mol === "ethane") && S.tw) ? twistG(G, 0, 1, S.tw) : G; }
  function selAtom(){ if (S.mode === "build") return bsel.k === "a" ? bsel.i : null; var v = S.sel[S.mol], m = mol(); return v != null && v >= 0 && v < m.a.length ? v : (MOL[S.mol].c || 0); }
  function lab(id){ var L = S.lab[id || S.mol]; if (!L || typeof L !== "object") L = S.lab[id || S.mol] = {}; L.a = L.a && typeof L.a === "object" ? L.a : {}; L.l = L.l && typeof L.l === "object" ? L.l : {}; return L; }

  // ----- main canvas -----
  var lastSc = null, lastG = null;
  var mp = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 });
  mp.render = function(){ mp.draw({ grid:false, axes:false, ticks:false, describe:describe(), after:function(ctx, p){
    lastSc = null;
    if (S.mode === "mix") { var st = an || { n:mx.n, pr:mx.promo ? 1 : 0, mt:mx.mixed ? 1 : 0, hp:mx.h ? 1 : 0 }; drawMix(ctx, p.W, p.H, st, rot, p.fontUI, {}); return; }
    var G = lastG = geo(), m = mol(), o;
    if (S.mode === "count") {
      var L = lab(), sg = {}, pi = {}, at = {}, bt = {};
      Object.keys(L.l).forEach(function(k){ var a = L.l[k] || []; if (a.indexOf("s") >= 0) sg[k] = 1; if (a.indexOf("p") >= 0) pi[k] = 1; var t = a.map(function(x){ return x === "s" ? "σ" : x === "p" ? "π" : "·"; }).join(" "); if (/[σπ]/.test(t)) bt[k] = t; });
      Object.keys(L.a).forEach(function(i){ if (L.a[i]) at[i] = HT[L.a[i]]; });
      o = { orbs:false, sig:sg, pi:pi, atag:at, btag:bt, sel:csel && csel.k === "a" ? csel.i : null };
    } else o = { orbs:true, sig:"all", pi:"all", ringCloud:true, grow:grow, sel:selAtom(), sigLab:m.a.length <= 2 && sigPi(m).s <= 5 ? "all" : null };
    lastSc = drawMol(ctx, p.W, p.H, G, rot, o, p.fontUI);
  } }); };
  function pickAt(x, y){
    if (locked || !lastSc || !lastG || (S.mode !== "bond" && S.mode !== "build" && S.mode !== "count")) return;
    var best = -1, bd2 = 30;
    for (var i = 0; i < lastG.n; i++) { var q = lastSc.pj(lastG.A[i].p), d = Math.hypot(q[0] - x, q[1] - y); if (d < bd2) { bd2 = d; best = i; } }
    if (best < 0) return;
    if (S.mode === "bond") S.sel[S.mol] = best; else if (S.mode === "build") bsel = { k:"a", i:best }; else csel = { k:"a", i:best };
    api.save(); paint();
  }
  spin(cv, rot, function(){ mp.render(); }, function(){ api.save(); }, pickAt);
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pre]"); if (!b) return; rot.x = PRESET[b.dataset.pre].x; rot.y = PRESET[b.dataset.pre].y; api.save(); mp.render(); });

  // ----- Mix mode -----
  function paintMix(){
    var hb = $(".hy-mixb", host), dis = locked || busy;
    MV.keepFocus(hb, function(){
      hb.innerHTML = '<button type="button" class="btn ghost sm" data-q="promo" data-k="hypromo"' + (dis || mx.promo ? " disabled" : "") + ">Promote</button>" +
        '<button type="button" class="btn primary sm" data-q="mix" data-k="hymix"' + (dis || mx.mixed ? " disabled" : "") + ">Mix</button>" +
        (mx.n === 3 ? '<button type="button" class="btn ghost sm" data-q="hyd" data-k="hyhyd"' + (dis || !mx.mixed || mx.h ? " disabled" : "") + ">Bond four H atoms</button>" : "") +
        '<button type="button" class="btn ghost sm" data-q="reset" data-k="hyreset"' + (dis || (!mx.promo && !mx.mixed) ? " disabled" : "") + ">Reset</button>";
    });
    var st = an || { n:mx.n, pr:mx.promo ? 1 : 0, mt:mx.mixed ? 1 : 0 };
    $(".hy-ed", host).innerHTML = eDiag(st);
    $(".hy-edcap", host).innerHTML = edCap();
  }
  function edCap(){
    if (mx.mixed) { var k = mx.n + 1, h = HT[hyN(mx.n)]; return md(C.rule) + ": " + (mx.n === 1 ? "s + p" : "s + " + mx.n + "p") + " gives " + k + " " + h + ", one electron each" + (mx.n < 3 ? ", plus " + (3 - mx.n) + " unhybridized p." : ". Each is ready for one bond."); }
    return mx.promo ? "Promoted, 2s¹ 2p³: 4 unpaired electrons, but one is in 2s and three are in 2p, so the bonds wouldn’t be identical." : "Ground state, 2s² 2p²: only 2 unpaired electrons.";
  }
  function animMix(steps, cb){
    // steps: list of "promo" | "mix" | "hyd"; animates each in turn, then saves
    stopAnim(); var id = run; busy = true; paint();
    an = { n:mx.n, pr:mx.promo ? 1 : 0, mt:mx.mixed ? 1 : 0, hp:mx.h ? 1 : 0 };
    (function next(i){
      if (id !== run) return;
      if (i >= steps.length) { an = null; busy = false; tw = null; api.save(); paint(); if (cb) cb(); return; }
      var k = steps[i], key = k === "promo" ? "pr" : k === "mix" ? "mt" : "hp";
      tw = MV.tween({ dur:k === "mix" ? 1500 : 900, step:function(q){ if (id !== run) return; an[key] = q; mp.render(); $(".hy-ed", host).innerHTML = eDiag(an); }, done:function(){
        if (id !== run) return; an[key] = 1; if (k === "promo") mx.promo = true; else if (k === "mix") mx.mixed = true; else mx.h = true;
        paint(); MV.wait(250, function(){ next(i + 1); });
      } });
    })(0);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-q]"); if (!b || b.disabled || locked) return;
    var q = b.dataset.q;
    if (q === "promo") animMix(["promo"]);
    else if (q === "mix") animMix(mx.promo ? ["mix"] : ["promo", "mix"]);
    else if (q === "hyd") animMix(["hyd"]);
    else if (q === "reset") { stopAnim(); mx.promo = mx.mixed = mx.h = false; api.save(); paint(); }
    else if (q === "cchk") checkLabels();
    else if (q === "cclr") { S.lab[S.mol] = {}; cMsg = null; api.save(); paint(); }
    else if (q === "lab") applyLab(b.dataset.v);
    else if (q === "add") addAtom(b.dataset.v);
    else if (q === "rem") removeAtom();
    else if (q === "bnew") { bd.a = ["C"]; bd.b = []; bsel = { k:"a", i:0 }; bMsg = ""; api.save(); paint(); }
  });

  // ----- Bond mode: atom chips, twist slider and meters -----
  function paintBond(){
    var m = mol(), sel = selAtom(), nm = chipNames(m), ah = $(".hy-atoms", host);
    MV.keepFocus(ah, function(){
      ah.innerHTML = '<span class="rg-wrap"><span class="rg-lab">Atom</span><span class="hy-chips" role="group" aria-label="Choose an atom to read">' + m.a.map(function(a, i){ return '<button type="button" class="chip" data-atom="' + i + '" data-k="hyat' + i + '" aria-pressed="' + (sel === i) + '"' + (locked ? " disabled" : "") + ">" + nm[i] + "</button>"; }).join("") + "</span></span>";
    });
    var twOn = S.mol === "ethene" || S.mol === "ethane";
    $(".hy-tw", host).hidden = !twOn;
    if (twOn) {
      var f = S.mol === "ethene" ? Math.abs(Math.cos(S.tw * DEG)) : 1, E = twistE(S.mol, S.tw), pct = Math.round(f * 100);
      $(".hy-meters", host).innerHTML = meter(S.mol === "ethene" ? "π overlap" : "σ overlap (C–C)", pct, pct + "%", "") + meter("Energy to twist", E / 300 * 100, "≈ " + Math.round(E) + " kJ/mol", "en");
      $(".hy-twnote", host).innerHTML = S.mol === "ethene" ? "π bond energy ≈ C=C (" + bondE("C=C") + ") − C–C (" + bondE("C–C") + ") = " + E_PI + " kJ/mol, from the course table." : "Twisting ethane only nudges its H atoms past each other: about " + E_ETH + " kJ/mol at most.";
    }
  }
  function meter(lab0, w, val, cls){ return '<div class="hy-meter"><span class="hy-ml">' + lab0 + '</span><span class="hy-bar ' + cls + '" aria-hidden="true"><i style="width:' + r1(clamp(w, 0, 100)) + '%"></i></span><span class="hy-mv">' + val + "</span></div>"; }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-atom]"); if (!b || b.disabled) return; S.sel[S.mol] = +b.dataset.atom; api.save(); paint(); });

  // ----- Count mode: tap a bond, then σ or π; tap an atom, then sp, sp² or sp³ -----
  function lineCounts(m, L){ var s = 0, p = 0, left = 0; bondsList(m).forEach(function(b){ var a = L.l[b.k] || []; for (var j = 0; j < b.o; j++) { if (a[j] === "s") s++; else if (a[j] === "p") p++; else left++; } }); return { s:s, p:p, left:left }; }
  function paintCount(){
    var m = mol(), L = lab(), Lo = lay2(m, { exH:true }), at = {}, bt = {};
    Object.keys(L.a).forEach(function(i){ if (L.a[i]) at[i] = { t:HT[L.a[i]] }; });
    Object.keys(L.l).forEach(function(k){ var a = L.l[k] || []; if (a.some(Boolean)) bt[k] = { t:a.map(function(x){ return x === "s" ? "σ" : x === "p" ? "π" : "·"; }).join(" ") }; });
    var hl = $(".hy-lab", host);
    MV.keepFocus(hl, function(){
      hl.innerHTML = labHTML(m, Lo, { exH:true, bonds:true, atag:at, btag:bt, selA:csel && csel.k === "a" ? csel.i : null, selB:csel && csel.k === "b" ? csel.k2 : null }, "hyc", function(k, i){ if (k === "a") { return "Atom " + chipNames(m)[i] + (L.a[i] ? ", labelled " + HT[L.a[i]] : ", not labelled"); } var a = L.l[i] || []; return bondName(m, i) + ": " + (a.some(Boolean) ? a.map(function(x){ return x === "s" ? "sigma" : x === "p" ? "pi" : "unlabelled"; }).join(", ") : "not labelled"); });
      $$(".hy2-pk", hl).forEach(function(b){ b.disabled = locked; });
    });
    var cs = $(".hy-csel", host), t = "";
    if (csel && csel.k === "a") t = "<span>Selected: atom <strong>" + chipNames(m)[csel.i] + '</strong></span><span class="hy-labb" role="group" aria-label="Hybridization label">' + ["sp", "sp2", "sp3"].map(function(h, i){ return '<button type="button" class="chip" data-q="lab" data-v="' + h + '" data-k="hyl' + h + '"' + (locked ? " disabled" : "") + ">" + HT[h] + ' <kbd>' + (i + 1) + "</kbd></button>"; }).join("") + "</span>";
    else if (csel && csel.k === "b") { var bl = bondsList(m).filter(function(b){ return b.k === csel.k2; })[0]; t = "<span>Selected: <strong>" + bondName(m, csel.k2) + "</strong> (" + plural(bl.o, "line") + ')</span><span class="hy-labb" role="group" aria-label="Bond label">' + '<button type="button" class="chip" data-q="lab" data-v="s" data-k="hyls"' + (locked ? " disabled" : "") + '>σ <kbd>S</kbd></button><button type="button" class="chip" data-q="lab" data-v="p" data-k="hylp"' + (locked ? " disabled" : "") + '>π <kbd>P</kbd></button><button type="button" class="chip" data-q="lab" data-v="x" data-k="hylx"' + (locked ? " disabled" : "") + ">Clear</button></span>"; }
    else t = '<span class="muted">Tap a bond, then σ or π. Tap any atom except H, then its hybridization.</span>';
    MV.keepFocus(cs, function(){ cs.innerHTML = t; });
    var c = lineCounts(m, L);
    $(".hy-tally", host).innerHTML = "Your labels: <strong>" + c.s + " σ</strong> · <strong>" + c.p + " π</strong>" + (c.left ? muted(" · " + plural(c.left, "bond line") + " still unlabelled") : muted(" · every bond line labelled"));
    $(".hy-cfb", host).innerHTML = cMsg ? MV.fbHTML(cMsg.ok ? "good" : "bad", cMsg.t) : "";
    $$('[data-q="cchk"], [data-q="cclr"]', host).forEach(function(b){ b.disabled = locked; });
  }
  function applyLab(v, keyTarget){
    var sel = keyTarget || csel; if (!sel) return;
    var L = lab(), m = mol();
    if (sel.k === "a") { if (["sp", "sp2", "sp3", "x"].indexOf(v) < 0) return; if (v === "x") delete L.a[sel.i]; else L.a[sel.i] = v; }
    else {
      var bl = bondsList(m).filter(function(b){ return b.k === sel.k2; })[0]; if (!bl) return;
      var a = (L.l[sel.k2] || []).slice(0, bl.o);
      if (v === "x") a = []; else { var j = -1; for (var q = 0; q < bl.o; q++) if (!a[q]) { j = q; break; } if (j < 0) { a = []; j = 0; } a[j] = v; }
      L.l[sel.k2] = a;
    }
    L.ok = false; cMsg = null; api.save(); paint();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest(".hy2-pk"); if (!b || b.disabled || !b.closest(".hy-lab")) return;
    csel = b.dataset.pa != null ? { k:"a", i:+b.dataset.pa } : { k:"b", k2:b.dataset.pb }; paint();
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest(".hy2-pk"); if (!b || !b.closest(".hy-lab") || locked) return;
    var tgt = b.dataset.pa != null ? { k:"a", i:+b.dataset.pa } : { k:"b", k2:b.dataset.pb }, k = e.key.toLowerCase(), v = null;
    if (tgt.k === "b") v = k === "s" ? "s" : k === "p" ? "p" : null; else v = k === "1" ? "sp" : k === "2" ? "sp2" : k === "3" ? "sp3" : null;
    if (k === "backspace" || k === "delete") v = "x";
    if (!v) return;
    e.preventDefault(); csel = tgt; applyLab(v, tgt);
  });
  function checkLabels(){
    var m = mol(), L = lab(), c = lineCounts(m, L), miss = 0, bad = null;
    m.a.forEach(function(_, i){ if (!L.a[i]) miss++; });
    if (c.left || miss) { cMsg = { ok:false, t:"Label every bond line and every atom except H first: " + plural(c.left, "bond line") + " and " + plural(miss, "atom") + " left." }; paint(); MV.focusFb($(".hy-cfb", host)); return; }
    bondsList(m).forEach(function(b){
      if (bad) return; var a = L.l[b.k] || [], s = a.filter(function(x){ return x === "s"; }).length;
      if (b.o === 1 && s !== 1) bad = FB.piSingle; else if (b.o > 1 && s > 1) bad = FB.twoSig; else if (b.o > 1 && s === 0) bad = FB.noSig;
    });
    if (!bad) m.a.forEach(function(a, i){ if (!bad && L.a[i] !== m.hy[i]) bad = "Check " + chipNames(m)[i] + ": " + FB.atom; });
    if (bad) { L.ok = false; cMsg = { ok:false, t:"<strong>✗ Not quite.</strong> " + bad }; }
    else { var sp = sigPi(m); L.ok = true; cMsg = { ok:true, t:"<strong>✓ Every label is right:</strong> " + sp.s + " σ and " + sp.p + " π." }; }
    api.save(); paint(); MV.focusFb($(".hy-cfb", host));
  }

  // ----- Build mode -----
  function bm(){ return prep({ a:bd.a.map(function(e){ return { el:e }; }), b:bd.b.map(function(x){ return x.slice(); }) }); }
  function freeV(m, i){ return VAL[m.a[i].el] - m.so[i]; }
  function setOrder(v){
    S.bo = v; bMsg = "";
    if (bsel.k === "b") { var m = bm(), b = bd.b[bsel.i], d = v - b[2]; if (d > 0 && (freeV(m, b[0]) < d || freeV(m, b[1]) < d)) { bMsg = "That would give an atom too many bonds."; RG.bo.set(String(b[2])); } else b[2] = v; }
    api.save(); paint();
  }
  function addAtom(el){
    var m = bm(); if (bsel.k !== "a" || bd.a.length >= 8) return;
    if (freeV(m, bsel.i) < S.bo || VAL[el] < S.bo) { bMsg = "Not enough free bonds on " + chipNames(m)[bsel.i] + " for a " + (S.bo === 1 ? "single" : S.bo === 2 ? "double" : "triple") + " bond."; paint(); return; }
    bd.a.push(el); bd.b.push([bsel.i, bd.a.length - 1, S.bo]); bsel = { k:"a", i:bd.a.length - 1 }; bMsg = ""; api.save(); paint();
  }
  function removeAtom(){
    if (bsel.k !== "a" || bd.a.length < 2) return;
    var i = bsel.i, deg = bd.b.filter(function(x){ return x[0] === i || x[1] === i; });
    if (deg.length !== 1) { bMsg = "Remove an end atom (one with only one bond)."; paint(); return; }
    var nb = deg[0][0] === i ? deg[0][1] : deg[0][0];
    bd.a.splice(i, 1); bd.b = bd.b.filter(function(x){ return x !== deg[0]; }).map(function(x){ return [x[0] > i ? x[0] - 1 : x[0], x[1] > i ? x[1] - 1 : x[1], x[2]]; });
    bsel = { k:"a", i:nb > i ? nb - 1 : nb }; bMsg = ""; api.save(); paint();
  }
  function cCounts(m){ var c = { n:0, sp:0, sp2:0, sp3:0 }; m.a.forEach(function(a, i){ if (a.el === "C") { c.n++; c[m.hy[i]]++; } }); return c; }
  function paintBuild(){
    var m = bm(), Lo = lay2(m), at = {};
    m.a.forEach(function(a, i){ at[i] = { t:HT[m.hy[i]] || "" }; });
    var dh = $(".hy-bdraw", host);
    MV.keepFocus(dh, function(){
      dh.innerHTML = labHTML(m, Lo, { bonds:true, atag:at, selA:bsel.k === "a" ? bsel.i : null, selB:bsel.k === "b" ? "b" + bsel.i : null }, "hyb", function(k, i){ return k === "a" ? "Atom " + chipNames(m)[i] + ", " + HT[m.hy[i]] : bondName(m, i); });
      $$(".hy2-pk", dh).forEach(function(b){ b.disabled = locked; });
    });
    $(".hy-bsel", host).innerHTML = (bsel.k === "a" ? "Selected: <strong>" + chipNames(m)[bsel.i] + "</strong>. Add an atom to it, or remove it." : "Selected: <strong>" + bondName(m, "b" + bsel.i) + "</strong>. Choose a bond type to change it.") + (bMsg ? ' <span class="hy-warn">' + bMsg + "</span>" : "");
    var ba = $(".hy-badd", host), full = bd.a.length >= 8, dis = locked || bsel.k !== "a";
    MV.keepFocus(ba, function(){
      ba.innerHTML = ["C", "N", "O"].map(function(el){ return '<button type="button" class="btn ghost sm" data-q="add" data-v="' + el + '" data-k="hyadd' + el + '"' + (dis || full ? " disabled" : "") + ">Add " + el + "</button>"; }).join("") +
        '<button type="button" class="btn ghost sm" data-q="rem" data-k="hyrem"' + (dis || bd.a.length < 2 ? " disabled" : "") + '>Remove atom</button><button type="button" class="btn ghost sm" data-q="bnew" data-k="hybnew"' + (locked ? " disabled" : "") + ">Start over</button>";
    });
    RG.bo.set(String(bsel.k === "b" ? bd.b[bsel.i][2] : S.bo));
    var c = cCounts(m);
    $(".hy-bcount", host).innerHTML = "Counter: <strong>" + plural(c.n, "carbon") + "</strong> · sp: <strong>" + c.sp + "</strong> · sp²: <strong>" + c.sp2 + "</strong> · sp³: <strong>" + c.sp3 + "</strong> " + muted("(" + toFormula(m) + ")");
  }
  function toFormula(m){ var f = {}; m.a.forEach(function(a, i){ f[a.el] = (f[a.el] || 0) + 1; f.H = (f.H || 0) + m.H[i]; }); return ["C", "H", "N", "O"].filter(function(e){ return f[e]; }).map(function(e){ return e + (f[e] > 1 ? String(f[e]).replace(/\d/g, function(d){ return "₀₁₂₃₄₅₆₇₈₉"[+d]; }) : ""); }).join(""); }
  host.addEventListener("click", function(e){
    var b = e.target.closest(".hy2-pk"); if (!b || b.disabled || !b.closest(".hy-bdraw")) return;
    bsel = b.dataset.pa != null ? { k:"a", i:+b.dataset.pa } : { k:"b", i:+b.dataset.pb.slice(1) }; bMsg = ""; paint();
  });

  // ----- readout, caption, description -----
  function paintRead(){
    var rows = [], dash = muted("—"), md0 = S.mode;
    if (md0 === "mix") {
      var k = mx.n + 1, h = HT[hyN(mx.n)], hy = hyN(mx.n);
      rows.push(["Atom", "C (carbon)"]);
      rows.push(["Electron groups", mx.mixed ? String(k) : muted("mix first")]);
      rows.push(["Hybridization", mx.mixed ? "<strong>" + h + "</strong>" : muted("not mixed yet")]);
      rows.push(["Orbitals on this atom", mx.mixed ? (mx.n === 1 ? "s + p" : "s + " + mx.n + "p") + " in → " + k + " " + h + " out" + (mx.n < 3 ? " + " + (3 - mx.n) + " unhybridized p" : "") + " " + muted("(" + md(C.rule) + ")") : "2s + 2p + 2p + 2p " + muted("(4 orbitals)")]);
      rows.push(["Geometry", mx.mixed ? geomT(M(hy === "sp3" ? "C" : hy === "sp2" ? "C=C" : "C#C"), 0) : dash]);
      rows.push(["σ bonds (whole molecule)", mx.h ? "4 " + muted("(CH₄)") : dash]);
      rows.push(["π bonds (whole molecule)", mx.h ? "0" : dash]);
      rows.push(["Rotation about C=C", dash]);
    } else {
      var m = mol(), i = md0 === "count" ? (csel && csel.k === "a" ? csel.i : null) : selAtom(), sp = sigPi(m), L = md0 === "count" ? lab() : null, solved = L && L.ok;
      var nmA = MOL[S.mol] && MOL[S.mol].nm && md0 !== "build" ? MOL[S.mol].nm : chipNames(m);
      var show = md0 !== "count" || solved, hy = i != null ? m.hy[i] : "";
      rows.push(["Atom", i != null ? nmA[i] : muted(md0 === "count" ? "tap an atom in the drawing" : "tap an atom")]);
      rows.push(["Electron groups", i == null ? dash : show ? groupsT(m, i) : muted("count them: bonds + lone pairs")]);
      rows.push(["Hybridization", i == null ? dash : show ? "<strong>" + HT[hy] + "</strong>" : (L.a[i] ? "your label: " + HT[L.a[i]] : muted("not labelled yet"))]);
      rows.push(["Orbitals on this atom", i == null || !show ? dash : orbT(hy)]);
      rows.push(["Geometry", i == null || !show ? dash : geomT(m, i)]);
      if (md0 === "count" && !solved) { var cc = lineCounts(m, L); rows.push(["σ bonds (whole molecule)", "your labels: " + cc.s]); rows.push(["π bonds (whole molecule)", "your labels: " + cc.p]); }
      else { rows.push(["σ bonds (whole molecule)", String(sp.s)]); rows.push(["π bonds (whole molecule)", String(sp.p)]); }
      rows.push([rotLabel(m), rotText(m)]);
    }
    $(".hy-read", host).innerHTML = rows.map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
  }
  function hasCC(m, o){ return m.b.some(function(b){ return b[2] === o && m.a[b[0]].el === "C" && m.a[b[1]].el === "C"; }); }
  function rotLabel(m){ return !hasCC(m, 2) && hasCC(m, 1) && !m.ring ? "Rotation about C–C" : "Rotation about C=C"; }
  function rotText(m){
    if (S.mode === "count" && !lab().ok) return muted("—");
    if (m.ring) return C.lockedT + muted(" (the ring’s π cloud keeps it flat)");
    if (hasCC(m, 2)) return C.lockedT;
    if (hasCC(m, 1)) return C.freeT;
    return muted("— (no C=C here)");
  }
  function paintCap(){
    var t = "", m;
    if (S.mode === "mix") t = mx.h ? "Four sp³ orbitals, four head-on overlaps with H 1s orbitals: four identical σ bonds." : mx.mixed ? "Mixed: the hybrids are identical in shape and energy." : "Carbon’s 2s (sphere) and three 2p orbitals (dumbbells), before mixing.";
    else if (S.mode === "bond") { m = mol(); var sp = sigPi(m); t = MOL[S.mol].t.charAt(0).toUpperCase() + MOL[S.mol].t.slice(1) + ": " + plural(sp.s, "σ bond") + " (highlighted along each axis)" + (sp.p ? " and " + plural(sp.p, "π bond") + (m.ring ? ", shared around the ring" : " (outlined above and below)") : "") + ". Tap an atom to read it."; }
    else if (S.mode === "count") t = "Label every bond line σ or π, and each atom except H with its hybridization. The model shows your labels.";
    else { var c = cCounts(bm()); t = "Your molecule: " + plural(c.n, "carbon") + ". Tap an atom in the drawing below, then add to it."; }
    $(".hy-cap", host).innerHTML = t;
  }
  function describe(){
    if (S.mode === "mix") return "3D view of a carbon atom. " + (mx.mixed ? (mx.n + 1) + " hybrid orbitals, equal teardrop lobes" + (mx.n < 3 ? ", plus " + (3 - mx.n) + " unhybridized p orbitals with two phases" : " pointing to the corners of a tetrahedron") + (mx.h ? ", each overlapping head-on with an H atom: four sigma bonds" : "") : "A spherical 2s orbital and three 2p dumbbells along the x, y and z axes") + ". Drag or use the arrow keys to turn it.";
    var m = mol(), sp = sigPi(m), nm = S.mode === "build" ? "your molecule" : MOL[S.mol].t;
    if (S.mode === "count") return "Ball-and-stick model of " + nm + " showing your labels: " + lineCounts(m, lab()).s + " sigma and " + lineCounts(m, lab()).p + " pi so far.";
    return "3D orbital model of " + nm + ": hybrid lobes in one tint, unhybridized p orbitals in two phases, " + sp.s + " sigma overlaps highlighted on the bond axes" + (sp.p ? " and " + sp.p + " pi overlaps outlined above and below" : "") + (S.mode === "bond" && S.tw && (S.mol === "ethene" || S.mol === "ethane") ? ". One end is twisted by " + S.tw + " degrees" + (S.mol === "ethene" ? ", so the pi overlap is " + Math.round(Math.abs(Math.cos(S.tw * DEG)) * 100) + " percent" : "") : "") + ".";
  }
  function paint(){
    var md0 = S.mode;
    $$(".hy-c", host).forEach(function(p){ p.hidden = p.dataset.for !== md0; });
    $(".hy-molp", host).hidden = md0 === "mix" || md0 === "build";
    $(".hy-legend", host).hidden = md0 === "count";
    if (md0 === "mix") paintMix(); else if (md0 === "bond") paintBond(); else if (md0 === "count") paintCount(); else paintBuild();
    var si = $(".hy-twsl input", host); if (si) { SL.set("hytw", S.tw); si.disabled = locked; }
    mp.render(); paintRead(); paintCap();
    MV.changed();
  }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paint(); }
  function stopAnim(){ run++; if (tw) { tw(); tw = null; } busy = false; an = null; grow = 1; }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      stopAnim(); csel = null; cMsg = null;
      if (p.id === "p1") { S.mode = "mix"; mx.n = 3; mx.promo = mx.mixed = mx.h = false; RG.mx.set("3"); }
      else if (p.id === "p2") { S.mode = "count"; S.mol = "ethene"; S.lab.ethene = {}; }
      else if (p.id === "p3") { S.mode = "bond"; S.mol = "h2o"; S.sel.h2o = 0; grow = 0; }
      else { S.mode = "bond"; S.mol = "ethene"; S.tw = 0; S.sel.ethene = 0; }
      RG.mode.set(S.mode); RG.mol.set(S.mol); api.save(); lock(true);
    },
    run:function(p, done){
      var id = run;
      function fin(){ if (id !== run) return; busy = false; tw = null; grow = 1; api.save(); lock(false); twistNote(); MV.wait(120, done); }
      function step(ms, fn){ MV.wait(ms, function(){ if (id === run) fn(); }); }
      if (p.id === "p1") {
        $(".hy-edcap", host).innerHTML = "Ground state, 2s² 2p²: only 2 unpaired electrons.";
        step(1100, function(){ animMix(["promo", "mix", "hyd"], fin); id = run; });
      } else if (p.id === "p2") {
        var seq = ["h0.0", "h0.1", "h1.0", "h1.1", "b0", "b0"], L = lab("ethene");
        (function next(i){
          if (id !== run) return;
          if (i >= seq.length) { L.ok = true; fin(); return; }
          var k = seq[i]; L.l[k] = k === "b0" ? (i === 4 ? ["s"] : ["s", "p"]) : ["s"]; csel = { k:"b", k2:k }; paint();
          step(i === 4 ? 700 : 420, function(){ next(i + 1); });
        })(0);
      } else if (p.id === "p3") {
        busy = true;
        tw = MV.tween({ dur:1600, step:function(q){ if (id !== run) return; grow = q; mp.render(); }, done:function(){ if (id !== run) return; grow = 1; step(300, fin); } });
      } else {
        busy = true;
        if (MV.reduceMotion) { S.tw = 45; paint(); step(400, function(){ S.tw = 90; paint(); step(300, fin); }); return; }
        tw = MV.tween({ dur:2600, ease:LIN, step:function(q){ if (id !== run) return; S.tw = Math.round(q * 6) * 15; paint(); }, done:function(){ if (id !== run) return; S.tw = 90; paint(); step(400, fin); } });
      }
    }
  };

  // ----- challenges -----
  function chal(id){
    var T = {}; C.challenges.forEach(function(c){ T[c.id] = c; });
    if (id === "tc1") {
      var L = S.lab.hcn && S.lab.hcn.a ? S.lab.hcn.a : {}, c = L[0], n = L[1];
      if (n === "sp3") return { ok:false, msg:T.tc1.wrongN };
      if (c === "sp2") return { ok:false, msg:T.tc1.wrongC };
      if (!c || !n) return { ok:false, msg:"In Count mode, choose HCN, then label both C and N (tap an atom, then sp, sp² or sp³)." };
      if (c === "sp" && n === "sp") return { ok:true };
      return { ok:false, msg:"Count the groups on each atom: 2 → sp, 3 → sp², 4 → sp³." };
    }
    if (id === "tc2") {
      var m = M("C#CC"), L2 = S.lab.propyne && S.lab.propyne.l ? lab("propyne") : null;
      if (!L2 || !Object.keys(L2.l).length) return { ok:false, msg:"In Count mode, choose propyne and label every bond line σ or π." };
      var cc = lineCounts(m, L2);
      if (cc.s === 8 && cc.p === 0) return { ok:false, msg:T.tc2.wrong8 };
      if (cc.p === 3) return { ok:false, msg:T.tc2.wrong3 };
      if (cc.left) return { ok:false, msg:"Label every bond line first: " + plural(cc.left, "line") + " left." };
      var okB = bondsList(m).every(function(b){ var a = L2.l[b.k] || []; return a.filter(function(x){ return x === "s"; }).length === 1; });
      if (cc.s === 6 && cc.p === 2 && okB) return { ok:true };
      if (cc.s === 6 && cc.p === 2) return { ok:false, msg:"The totals match, but check each bond: every single bond is σ, and each multiple bond has exactly one σ." };
      return { ok:false, msg:"Every single bond is σ, and each multiple bond has one σ; the rest are π." };
    }
    if (id === "tc3") {
      var b = bm(), c3 = cCounts(b), all = c3.sp && c3.sp2 && c3.sp3, key = canon(b);
      if (key === canon(M("C#CC"))) return { ok:false, msg:T.tc3.wrongPropyne };
      if (key === canon(M("C=CC#N"))) return { ok:false, msg:T.tc3.wrongAcrylo };
      if (c3.n === 2) return { ok:false, msg:T.tc3.wrongTwo };
      if (c3.n < 2) return { ok:false, msg:"Build in Build mode first: you need at least three carbons." };
      if (all && c3.n === 3) return { ok:true };
      if (all) return { ok:false, msg:"All three types, but with " + c3.n + " carbons. Can you do it with fewer?" };
      var miss = ["sp", "sp2", "sp3"].filter(function(h){ return !c3[h]; }).map(function(h){ return HT[h]; });
      return { ok:false, msg:"The counter shows no " + miss.join(" and no ") + " carbon yet." };
    }
    return { ok:false };
  }
  lock(false); twistNote();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ===== Part 3: Hybridization in organic molecules =====
function part3(host, api){
  var S = api.S, P = MV.C.part3, s1 = P.s1;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {};
  S.pair = S.pair === "eth" ? "eth" : "but"; S.tw = Math.round(clamp(+S.tw || 0, 0, 180) / 15) * 15; S.bz = S.bz === "p" ? "p" : "pi";
  var sel = {}, rot2 = { x:0.4, y:-0.25 }, rot3 = { x:0.45, y:-0.4 };
  var ang = miscVal("ethene H–C–H");
  host.innerHTML =
    '<div class="part hy-st"><h3>' + s1.title + '</h3><p class="how">' + s1.intro + '</p><div class="hy-s1"></div>' +
    '<details class="alg"><summary>Check it with data</summary><p>' + s1.data + '</p><div class="tbl-wrap"><table class="vt"><thead><tr><th>Angle</th><th>Measured</th><th>Hybridization</th></tr></thead><tbody>' +
    "<tr><td>H–C–H in methane</td><td>109.5°</td><td>sp³ (109.5°)</td></tr><tr><td>H–C–H in ethene</td><td>" + ang + " (close to 120°)</td><td>sp² (120°)</td></tr><tr><td>H–C–C in ethyne</td><td>180°</td><td>sp (180°)</td></tr></tbody></table></div></details></div>" +
    '<div class="part hy-st"><h3>' + P.s2.title + '</h3><p class="how">' + P.s2.intro + '</p><div class="hy-s2p"></div><div class="hy-s2sl"></div>' +
    '<div class="hy-s2g"><figure class="hy-s2f"><canvas class="hy-s2c" data-i="0" tabindex="0" role="img" aria-label=""></canvas><figcaption class="hy-s2t" aria-live="polite"></figcaption></figure><figure class="hy-s2f"><canvas class="hy-s2c" data-i="1" tabindex="0" role="img" aria-label=""></canvas><figcaption class="hy-s2t" aria-live="polite"></figcaption></figure></div><p>' + P.s2.text + "</p></div>" +
    '<div class="part hy-st"><h3>' + P.s3.title + '</h3><div class="hy-s3c"></div><div class="hy-pre" role="group" aria-label="Benzene view"><button type="button" class="btn ghost sm" data-bv="tilt" data-k="hybvt">Tilted</button><button type="button" class="btn ghost sm" data-bv="edge" data-k="hybve">Edge-on</button><button type="button" class="btn ghost sm" data-bv="top" data-k="hybvo">Top</button></div>' +
    '<div class="hy-stage sm"><canvas class="hy-s3cv" tabindex="0" role="img" aria-label=""></canvas></div><p>' + P.s3.text + "</p></div>";

  // Station 1
  function st1(id){ var x = S.s1[id]; if (!x || typeof x !== "object") x = S.s1[id] = {}; x.l = x.l && typeof x.l === "object" ? x.l : {}; return x; }
  function paint1(){
    var h = $(".hy-s1", host);
    MV.keepFocus(h, function(){
      h.innerHTML = s1.mols.map(function(mo){
        var m = M(mo.smi), x = st1(mo.id), ans = MV.ans(mo), at = {}, sa = sel[mo.id];
        m.a.forEach(function(_, i){ if (x.l[i]) at[i] = { t:HT[x.l[i]], cls:x.chk ? (x.l[i] === ans[i] ? "ok" : "no") : "" }; });
        var out = '<div class="hy-s1m" data-m="' + mo.id + '"><h4>' + mo.name + (x.done ? ' <span class="hy-done">✓</span>' : "") + "</h4>" +
          labHTML(m, lay2(m), { atag:at, selA:sa }, "hys1" + mo.id, function(k, i){ return "Atom " + chipNames(m)[i] + (x.l[i] ? ", labelled " + HT[x.l[i]] : ", not labelled"); });
        if (!x.done) out += '<div class="hy-s1bar">' + (sa != null ? "<span>" + chipNames(m)[sa] + ':</span><span class="hy-labb" role="group" aria-label="Hybridization">' + ["sp", "sp2", "sp3"].map(function(hh){ return '<button type="button" class="chip" data-s1l="' + hh + '" data-k="hys1' + mo.id + hh + '" aria-pressed="' + (x.l[sa] === hh) + '">' + HT[hh] + "</button>"; }).join("") + "</span>" : '<span class="muted">Tap an atom.</span>') +
          '<button type="button" class="btn primary sm" data-s1c="1" data-k="hys1c' + mo.id + '">Check</button></div>';
        if (x.msg) out += MV.fbHTML(x.done ? "good" : "bad", x.msg);
        return out + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var box = e.target.closest("[data-m]"); if (!box) return;
    var mo = s1.mols.filter(function(z){ return z.id === box.dataset.m; })[0], x = st1(mo.id), m = M(mo.smi), b = e.target.closest("button"); if (!b) return;
    if (b.dataset.pa != null) { if (x.done) return; sel[mo.id] = +b.dataset.pa; paint1(); return; }
    if (b.dataset.s1l) { if (sel[mo.id] != null) { x.l[sel[mo.id]] = b.dataset.s1l; x.chk = false; x.msg = ""; api.save(); paint1(); } return; }
    if (b.dataset.s1c) {
      var ans = MV.ans(mo), miss = m.a.filter(function(_, i){ return !x.l[i]; }).length;
      if (miss) { x.msg = "Label every C, N and O first: " + plural(miss, "atom") + " left."; x.chk = false; }
      else {
        var wrong = m.a.map(function(_, i){ return i; }).filter(function(i){ return x.l[i] !== ans[i]; });
        x.chk = true;
        if (!wrong.length) { x.done = true; x.msg = "<strong>✓ All correct.</strong> " + m.a.map(function(a, i){ return chipNames(m)[i] + " " + HT[ans[i]] + " (" + groups(m, i) + " groups)"; }).join(", ") + "."; sel[mo.id] = null; }
        else x.msg = "<strong>✗ Not quite.</strong> Look again at " + wrong.map(function(i){ return chipNames(m)[i]; }).join(" and ") + ": count its electron groups, lone pairs included (2 → sp, 3 → sp², 4 → sp³).";
      }
      api.save(); paint1(); MV.focusFb(box);
    }
  });

  // Station 2
  var PAIRS = { but:[{ smi:"CCCC", i:1, j:2, t:"butane", alk:false }, { smi:"CC=CC", i:1, j:2, t:"but-2-ene", alk:true }], eth:[{ smi:"CC", i:0, j:1, t:"ethane", alk:false }, { smi:"C=C", i:0, j:1, t:"ethene", alk:true }] };
  radios($(".hy-s2p", host), { label:"Pair", aria:"Model pair", cls:"chips", options:P.s2.pairs, value:S.pair, onChange:function(v){ S.pair = v; api.save(); paint2(); } });
  var SL2 = MV.sliders($(".hy-s2sl", host), [{ id:"hys2", label:"Twist the middle bond", min:0, max:180, step:15, value:S.tw, fmt:function(v){ return Math.round(v) + "°"; } }], function(id, v){ S.tw = Math.round(v / 15) * 15; api.save(); paint2(); });
  var plots2 = $$(".hy-s2c", host).map(function(c){
    var pl = new MV.Plot(c, { xmin:0, xmax:1, ymin:0, ymax:1 }), k = +c.dataset.i;
    pl.render = function(){
      var it = PAIRS[S.pair][k], G = twistG(geo3(M(it.smi), { axis:[it.i, it.j] }), it.i, it.j, S.tw), f = Math.abs(Math.cos(S.tw * DEG));
      pl.draw({ grid:false, axes:false, ticks:false, describe:desc2(it, f), after:function(ctx, p){
        var o = it.alk ? { orbs:true, pOnly:true, pi:"all", sig:{ b1:1, b0:1 } } : { orbs:false, sig:{} };
        if (!it.alk) o.sig["b" + (it.smi === "CC" ? 0 : 1)] = 1; else o.sig = { b0:it.smi === "C=C" ? 1 : 0, b1:it.smi === "C=C" ? 0 : 1 };
        drawMol(ctx, p.W, p.H, G, rot2, o, p.fontUI);
      } });
      void f;
    };
    spin(c, rot2, function(){ plots2.forEach(function(q){ q.render(); }); }, null, null);
    return pl;
  });
  function desc2(it, f){ return it.t + " twisted by " + S.tw + " degrees about its middle bond. " + (it.alk ? "Pi overlap " + Math.round(f * 100) + " percent." : "The sigma overlap is unchanged."); }
  function paint2(){
    SL2.set("hys2", S.tw);
    var f = Math.abs(Math.cos(S.tw * DEG));
    PAIRS[S.pair].forEach(function(it, k){
      var t = "<strong>" + it.t + "</strong>: ";
      if (!it.alk) t += "σ overlap 100% at every angle. Free rotation: still " + it.t + ".";
      else {
        t += "π overlap " + Math.round(f * 100) + "%. ";
        t += S.tw === 0 ? (it.t === "but-2-ene" ? "trans-but-2-ene; the π bond holds it." : "the π bond holds it flat.") : S.tw < 90 ? "The π bond is stretching apart." : S.tw === 90 ? "The π bond is broken (≈ " + E_PI + " kJ/mol)." : S.tw < 180 ? "Only possible after breaking the π bond at 90°." : (it.t === "but-2-ene" ? "cis-but-2-ene: a different compound, reached only by breaking the π bond at 90°." : "the same molecule again, but only after breaking the π bond at 90°.");
      }
      $$(".hy-s2t", host)[k].innerHTML = t;
    });
    plots2.forEach(function(q){ q.render(); });
  }

  // Station 3
  radios($(".hy-s3c", host), { label:"Show", aria:"What to show", cls:"chips", options:[{ id:"p", t:"the six p orbitals" }, { id:"pi", t:"the π cloud" }], value:S.bz, onChange:function(v){ S.bz = v; api.save(); p3.render(); } });
  var c3 = $(".hy-s3cv", host), p3 = new MV.Plot(c3, { xmin:0, xmax:1, ymin:0, ymax:1 });
  p3.render = function(){ p3.draw({ grid:false, axes:false, ticks:false, describe:"Benzene: six sp2 carbons in one flat ring with six H atoms" + (S.bz === "p" ? ", each carbon with one unhybridized p orbital standing up out of the ring" : ", with a continuous pi cloud above and below the ring") + ".", after:function(ctx, p){
    var G = geo3(M("C1=CC=CC=C1"));
    drawMol(ctx, p.W, p.H, G, rot3, S.bz === "p" ? { orbs:true, pOnly:true, sig:"all" } : { orbs:true, pOnly:true, sig:"all", ringCloud:true }, p.fontUI);
  } }); };
  spin(c3, rot3, function(){ p3.render(); }, null, null);
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-bv]"); if (!b) return; var v = { tilt:{ x:0.45, y:-0.4 }, edge:{ x:0, y:0 }, top:{ x:1.5, y:0 } }[b.dataset.bv]; rot3.x = v.x; rot3.y = v.y; p3.render(); });
  paint1(); paint2(); p3.render();
}

// @component N4 pairEntry — σ and π number boxes per molecule (first try = right on the first Check without the worked
// solution), plus chip items; known wrong σ counts get their own feedback (adapted from SCH4U 15's countAct)
function countAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { s:"", p:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "sp") h += '<div class="hy-sprow"><label for="ri-' + it.id + 's">σ bonds</label><input class="numin" id="ri-' + it.id + 's" data-rin="' + it.id + '" data-f="s" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.s) + '"' + dis + '><label for="ri-' + it.id + 'p">π bonds</label><input class="numin" id="ri-' + it.id + 'p" data-rin="' + it.id + '" data-f="p" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.p) + '"' + dis + "></div>";
    else h += '<div class="chips hy-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(op, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + op.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) { var an = MV.ans(it); h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "pick" ? it.options[x.pick].t : an[0] + " σ and " + an[1] + " π") + ".</strong> " + (it.kind === "pick" ? it.options[x.pick].why || "" : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>')); }
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var t = String(s || "").replace(/[σπ]|bonds?|sigma|pi/gi, "").trim(); return /^\d+$/.test(t) ? +t : null; }
  function judge(it, x){
    if (it.kind === "sp") {
      var s = one(x.s), p = one(x.p), an = MV.ans(it); if (s == null || p == null) return { bad:"Enter a whole number in both boxes." };
      if (s === an[0] && p === an[1]) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return z.s === s; })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.rin) return; ist(d.rin)[d.f] = e.target.value.slice(0, 12); api.save(); });
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

// ---------- Performance task: four-carbon chain ----------
var task = (function(){
  var S = null, api = null, T = null, R = [];
  var SYM = { 1:"", 2:"=", 3:"#" };
  function read(){ return { b:[0, 1, 2].map(function(k){ var v = S ? +S["b" + k] : 0; return v >= 1 && v <= 3 ? v : null; }) }; }
  function chainM(b){ return M("C" + SYM[b[0]] + "C" + SYM[b[1]] + "C" + SYM[b[2]] + "C"); }
  function off(k, v){ var b = read().b, l = k > 0 ? b[k - 1] : null, r = k < 2 ? b[k + 1] : null; return (l != null && l + v > 4) || (r != null && r + v > 4) ? "too many bonds" : ""; }
  function preview(){
    var d = read(), pv = $("#hy-tkpv"), cap = $("#hy-tkcap"); if (!pv) return;
    if (d.b.some(function(x){ return x == null; })) { pv.innerHTML = '<p class="muted hy-tkempty">Choose all three bonds to see the chain.</p>'; cap.innerHTML = ""; return; }
    var m = chainM(d.b), at = {}, sp = sigPi(m);
    m.a.forEach(function(_, i){ at[i] = { t:HT[m.hy[i]] }; });
    pv.innerHTML = labHTML(m, lay2(m), { atag:at, atoms:[] }, "hytk", function(){ return ""; });
    cap.innerHTML = "Counter: <strong>" + sp.s + " σ</strong> · <strong>" + sp.p + " π</strong> · carbons " + m.hy.map(function(h){ return HT[h]; }).join(", ");
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      [0, 1, 2].forEach(function(k){ if ([1, 2, 3].indexOf(+S["b" + k]) < 0) S["b" + k] = ""; });
      inp.innerHTML = '<div class="hy-tin">' + [0, 1, 2].map(function(k){ return '<div class="hy-tb' + k + '"></div>'; }).join("") + "</div>";
      function up(k){ return function(v){ S["b" + k] = +v; api.save(); R.forEach(function(r){ r.paint(); }); preview(); api.update(); }; }
      R = [0, 1, 2].map(function(k){ return radios($(".hy-tb" + k, inp), { label:"C" + (k + 1) + "–C" + (k + 2), aria:"Bond between carbon " + (k + 1) + " and carbon " + (k + 2), cls:"chips", options:[{ id:"1", t:"single" }, { id:"2", t:"double" }, { id:"3", t:"triple" }], value:S["b" + k], onChange:up(k), disabled:function(id){ return off(k, +id); } }); });
      pv.innerHTML = '<h4 class="hy-h4">Your chain</h4><div id="hy-tkpv"></div><p class="hy-tkcap" id="hy-tkcap" aria-live="polite"></p>';
      preview();
    },
    read:read,
    valid:function(d){ return d.b.every(function(x){ return x != null; }) ? true : "Choose all three bonds first."; },
    checks:function(d){
      if (d.b.some(function(x){ return x == null; })) return [false, false, false];
      var m = chainM(d.b), p = d.b.reduce(function(s, x){ return s + x - 1; }, 0);
      return [m.hy.indexOf("sp3") >= 0, m.hy.indexOf("sp") >= 0, p === 2];
    },
    key:function(d){ var a = d.b.join(","), b = d.b.slice().reverse().join(","); return T.answers[a] ? a : T.answers[b] ? b : (a < b ? a : b); },
    label:function(k){ return T.answers[k] || k; },
    text:function(k){ var v = MV.plain(T.answers[k] || k), mm = v.match(/^(.*?), (?=[A-Z])/); return mm ? mm[1] : v; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ count:countAct },
  task:task
});
})();
