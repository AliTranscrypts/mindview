// SCH4U 06 Amines and Amides: hero (ammonia → amines → amide), Nitrogen family builder (Explore: Build / Compare / Condense
// with the C1 view, N lone pair, ghost neighbours and hydrogen bonds, C2 name chips, pH meter, boiling-point bars), Amides
// everywhere (Part 3: peptide joiner, nylon preview, group finder), "Classify and name" and "Property puzzles" activities,
// "Design an amide" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function degC(v){ return MV.chem.fx(v, 0) + " °C"; }
function cp(o){ return JSON.parse(JSON.stringify(o)); }

// ---------- data ----------
// Boiling points (°C): the plan's data table (§4 Explore; rounded literature values, labelled "data") plus propan-2-amine
// (32 °C, from the plan's P5). MV.chem.data.bp holds only hydrocarbons and alkyl halides (module 01), so these are course
// table additions, defined here until the shared table absorbs them. Propane and butane come from MV.chem.data.bp.
var BP = { ammonia:-33, methanamine:-6, ethanamine:17, "N-methylmethanamine":7, "propan-1-amine":48, "propan-2-amine":32, "N-methylethanamine":36,
  "N,N-dimethylmethanamine":3, methanamide:210, ethanamide:221, "N-methylethanamide":206, "N,N-dimethylmethanamide":153, propanamide:213,
  ethanol:78, "propan-1-ol":97, methoxymethane:-24 };
var SOLID = { ethanamide:"solid at room temperature" };
function bpOf(nm){ return BP[nm] != null ? BP[nm] : MV.chem.bpOf(nm); }
var COMMON = { methanamine:"methylamine", ethanamine:"ethylamine", "propan-1-amine":"propylamine", "propan-2-amine":"isopropylamine",
  "N-methylmethanamine":"dimethylamine", "N-methylethanamine":"ethylmethylamine", "N,N-dimethylmethanamine":"trimethylamine",
  "N-ethylethanamine":"diethylamine", "N,N-diethylethanamine":"triethylamine", "N-propylpropan-1-amine":"dipropylamine",
  methanamide:"formamide", ethanamide:"acetamide", propanamide:"propionamide", "N,N-dimethylmethanamide":"dimethylformamide",
  "N-methylethanamide":"N-methylacetamide", "N,N-dimethylethanamide":"N,N-dimethylacetamide" };
var MM = MV.chem.data.M;
function molar(f){ return (f.C || 0) * MM.C + (f.H || 0) * MM.H + (f.N || 0) * MM.N + (f.O || 0) * MM.O; }
function kbOf(nm){ var r = MV.chem.data.Kb.filter(function(x){ return x[0] === nm; })[0]; return r ? r[2] : null; }

// builder spec: {a: carbons in the acyl group (0 = amine), g:[slot 1, slot 2, slot 3]}; groups H, me, et, pr, ip (propan-2-yl).
// With a > 0 the acyl group takes slot 1 (g[0] is ignored).
var GC = { H:0, me:1, et:2, pr:3, ip:3 }, GN = { me:"methyl", et:"ethyl", pr:"propyl", ip:"propan-2-yl" };
var STEM = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct"];
var ACIDN = ["", "methanoic acid", "ethanoic acid", "propanoic acid", "butanoic acid"];
var AL = ["", "HCO", "CH3CO", "CH3CH2CO", "CH3CH2CH2CO"];
var GL = { me:"CH3", et:"CH3CH2", pr:"CH3CH2CH2", ip:"(CH3)2CH" }, GR = { me:"CH3", et:"CH2CH3", pr:"CH2CH2CH3", ip:"CH(CH3)2" };
function bySize(a, b){ return (GC[b] - GC[a]) || ((a === "ip") - (b === "ip")); }
function nonH(sp){ return (sp.a ? sp.g.slice(1) : sp.g).filter(function(x){ return x && x !== "H"; }); }
function onN(sp){ return nonH(sp).length + (sp.a ? 1 : 0); }
function nNH(sp){ return 3 - onN(sp); }
function nCarb(sp){ return (sp.a || 0) + nonH(sp).reduce(function(s, g){ return s + GC[g]; }, 0); }
function fOf(sp){ var n = nCarb(sp); return { C:n, H:sp.a ? 2 * n + 1 : 2 * n + 3, N:1, O:sp.a ? 1 : 0 }; }
function fText(f){ return "C" + (f.C > 1 ? f.C : "") + "H" + f.H + "N" + (f.O ? "O" : ""); }
function fTextOf(sp){ return nCarb(sp) ? fText(fOf(sp)) : "NH3"; }
function condensed(sp){
  var s = nonH(sp).sort(bySize);
  if (sp.a) {
    var h = AL[sp.a] + "N";
    if (!s.length) return h + "H2";
    if (s.length === 1) return h + "H" + GR[s[0]];
    if (s[0] === s[1]) return h + "(" + GR[s[0]] + ")2";
    return h + "(" + GR[s[1]] + ")" + GR[s[0]];
  }
  if (!s.length) return "NH3";
  if (s.length === 1) return GL[s[0]] + "NH2";
  if (s.length === 2) return s[0] === s[1] ? "(" + GL[s[0]] + ")2NH" : GL[s[0]] + "NH" + GR[s[1]];
  if (s[0] === s[1] && s[1] === s[2]) return "(" + GL[s[0]] + ")3N";
  if (s[1] === s[2]) return "(" + GL[s[1]] + ")2N" + GR[s[0]];
  if (s[0] === s[1]) return "(" + GL[s[0]] + ")2N" + GR[s[2]];
  return GL[s[0]] + "N(" + GR[s[2]] + ")" + GR[s[1]];
}
function clsOf(sp){ var k = onN(sp); if (!sp.a && !k) return "ammonia (no carbon groups on N)"; return ["", "primary", "secondary", "tertiary"][k] + (sp.a ? " amide" : " amine"); }
function phOf(sp){
  if (sp.a) return { v:7.0, t:"about 7 (model reading)" };
  var amm = !nonH(sp).length, kb = kbOf(amm ? "ammonia" : "methylamine"), v = 14 + Math.log10(Math.sqrt(kb * 0.10));
  var nm = C2name(sp);
  return { v:v, t:"about " + MV.chem.fx(v, 1) + " (model reading" + (amm || nm === "methanamine" ? "" : ", treated like methanamine") + ")" };
}

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01/02/03) — segmented control or chip row as a real radio group
// (arrow keys, roving tabindex, lock). radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled})
// -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, d = locked || !!off(x.id); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && !i) ? 0 : -1) + '" data-rg="' + x.id + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// ---------- @component C1 moleculeView ----------
// Molecule model (C, N, O; H implicit; bond orders 1–2) with stable atom keys, a 2D structural layout where the H on carbon
// is merged into the label (CH₃, CH₂) and the H on N and O are drawn as bonds, N lone pairs (violet dots), ghost neighbour
// molecules with dashed hydrogen bonds, a lone-pair arrow toward C=O (amides), a 3D ball-and-stick model (VSEPR; planar amide
// N), morphs between scenes (atoms matched by key, so atoms can travel from one frame to the next), rows of scenes for
// reactions, and a view widget (2D or 3D; rotate with buttons, drag or arrow keys). Adapted from SCH4U 03's C1 (N, keys,
// merged labels, pseudo-atoms LP / ARR / TXT and ghosts added; the pick overlay dropped).
//   m = {a:[{el, key}], b:[[i, j, order]], main:[…]}   C1.adj · hc · formula · mainPath(m, firstKey) · layout2d(m)
//   C1.decorate(sc, m, {ghosts, arrow}) · scene3(m) · morph(A, B) · row(parts, gap) · water(idO, idH1, idH2) · shift(sc, dx, dy) · bbox(sc)
//   C1.view(host, {w, h, rotate}) -> {show(scene, o), anim(A, B, o, dur, done), render(), busy()}; o = {smax, ring:{id:"s"|"d"}, aria}
var C1 = (function(){
  var VAL = { C:4, H:1, O:2, N:3 };
  function adj(m){ if (!m._A) { var L = m.a.map(function(){ return []; }); m.b.forEach(function(b){ L[b[0]].push(b[1]); L[b[1]].push(b[0]); }); m._A = L; } return m._A; }
  function bondOf(m, i, j){ for (var k = 0; k < m.b.length; k++) { var b = m.b[k]; if ((b[0] === i && b[1] === j) || (b[0] === j && b[1] === i)) return k; } return -1; }
  function order(m, i, j){ var k = bondOf(m, i, j); return k < 0 ? 0 : (m.b[k][2] || 1); }
  function used(m){ var s = m.a.map(function(){ return 0; }); m.b.forEach(function(b){ s[b[0]] += b[2] || 1; s[b[1]] += b[2] || 1; }); return s; }
  function hc(m){ if (!m._h) { var s = used(m); m._h = m.a.map(function(a, i){ return Math.max(0, (VAL[a.el] || 0) - s[i]); }); } return m._h; }
  function formula(m){ var f = { C:0, H:0, N:0, O:0 }, h = hc(m); m.a.forEach(function(a, i){ f[a.el]++; f.H += h[i]; }); return f; }
  function idx(m, key){ for (var i = 0; i < m.a.length; i++) if (m.a[i].key === key) return i; return -1; }
  function mainPath(m, first){
    var A = adj(m), okA = function(j){ var x = m.a[j]; return x.el === "C" || x.el === "N" || (x.el === "O" && /^oh/.test(x.key)); };
    function far(s){
      var d = {}, par = {}, Q = [s], last = s; d[s] = 0; par[s] = -1;
      while (Q.length) { var x = Q.shift(); if (d[x] > d[last]) last = x; A[x].forEach(function(y){ if (!(y in d) && okA(y)) { d[y] = d[x] + 1; par[y] = x; Q.push(y); } }); }
      var p = []; for (var v = last; v !== -1; v = par[v]) p.push(v); return p.reverse();
    }
    var f = first != null ? idx(m, first) : -1;
    if (f >= 0) return far(f);
    var st = 0; for (var i = 0; i < m.a.length; i++) if (okA(i)) { st = i; break; }
    var P = far(far(st).slice(-1)[0]), keys = P.map(function(j){ return m.a[j].key; }), iN = keys.indexOf("n"), iA = keys.indexOf("s0c0"), iO = -1;
    keys.forEach(function(k, q){ if (/^oh/.test(k)) iO = q; });
    if (iA >= 0 && iN >= 0) { if (iA > iN) P.reverse(); }
    else if (iO >= 0) { if (iO === 0 && P.length > 1) P.reverse(); }
    else if (iN >= 0 && iN < P.length - 1 - iN) P.reverse();
    return P;
  }
  function amideN(m, i){ return m.a[i].el === "N" && adj(m)[i].some(function(j){ return m.a[j].el === "C" && adj(m)[j].some(function(k){ return m.a[k].el === "O" && order(m, j, k) === 2; }); }); }

  // ---------- 2D layout (grid, main chain left to right) ----------
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
  function hs(n){ return n ? "H" + (n > 1 ? n : "") : ""; }
  function layout2d(m){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main && m.main.length ? m.main : [0], N = main.length, onMain = {}, i;
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
    main.forEach(function(x, k){ if (k) x0 += 1.2 + 0.2 * (cb[k - 1] + cb[k]); P[x] = [x0, 0]; });
    function grow(j, from, dir){
      P[j] = [P[from][0] + dir[0], P[from][1] + dir[1]];
      Ad[j].filter(function(c){ return c !== from && P[c] == null; }).sort(asc).forEach(function(c, q){ grow(c, j, q === 0 ? dir : q === 1 ? [-dir[1], dir[0]] : [dir[1], -dir[0]]); });
    }
    main.forEach(function(x, k){ roots[k].forEach(function(j){ grow(j, x, rdir[j]); }); });
    for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0];
    var atoms = [], bonds = [];
    for (i = 0; i < n; i++) { var el = m.a[i].el; atoms.push({ id:"a" + m.a[i].key, el:el, x:P[i][0], y:P[i][1], i:i, lbl:el === "C" ? "C" + hs(h[i]) : el }); }
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    for (i = 0; i < n; i++) {
      var e2 = m.a[i].el; if (e2 === "C") continue;
      var k2 = h[i] + (e2 === "N" ? 1 : 0); if (!k2) continue;
      var angs = gapAngles(Ad[i].map(function(j){ return Math.atan2(P[j][1] - P[i][1], P[j][0] - P[i][0]); }), k2);
      if (e2 === "N") {
        var best = 0; angs.forEach(function(t, q){ if (Math.cos(t + Math.PI / 2) > Math.cos(angs[best] + Math.PI / 2) + 1e-6) best = q; });
        var tl = angs.splice(best, 1)[0];
        atoms.push({ id:"lp" + m.a[i].key, el:"LP", x:P[i][0] + 0.42 * Math.cos(tl), y:P[i][1] + 0.42 * Math.sin(tl), ang:tl, par:i, i:-1 });
      }
      angs.forEach(function(t, q){ bonds.push({ a:i, b:atoms.length, o:1 }); atoms.push({ id:"h" + m.a[i].key + "." + q, el:"H", x:P[i][0] + 0.62 * Math.cos(t), y:P[i][1] + 0.62 * Math.sin(t), i:-1, par:i, isH:true }); });
    }
    return { atoms:atoms, bonds:bonds, view:"st" };
  }
  function at(sc, id){ for (var k = 0; k < sc.atoms.length; k++) if (sc.atoms[k].id === id) return k; return -1; }
  // ghost neighbours (when an N–H exists) and the lone-pair arrow (amides)
  function decorate(sc, m, o){
    o = o || {};
    var kN = at(sc, "an"); if (kN < 0) return sc;
    var Nn = sc.atoms[kN], kC = at(sc, "as0c0"), amide = at(sc, "ao") >= 0 && kC >= 0, kLP = at(sc, "lpn"), real = sc.atoms.slice();
    function room(x, y){ var d = 9; real.forEach(function(a){ d = Math.min(d, Math.hypot(a.x - x, a.y - y)); }); return d; }
    function add(a){ sc.atoms.push(a); return sc.atoms.length - 1; }
    if (amide && kLP >= 0 && o.arrow !== false) { var C0 = sc.atoms[kC], L = sc.atoms[kLP]; add({ id:"arr", el:"ARR", x:L.x, y:L.y, tx:(Nn.x + C0.x) / 2, ty:(Nn.y + C0.y) / 2, nx:Nn.x, ny:Nn.y, i:-1 }); }
    var Hs = []; sc.atoms.forEach(function(a, k){ if (a.isH && a.par === kN) Hs.push(k); });
    if (!o.ghosts || !Hs.length) return sc;
    var best = null;
    Hs.forEach(function(k){ var H = sc.atoms[k], dx = H.x - Nn.x, dy = H.y - Nn.y, l = Math.hypot(dx, dy) || 1, gx = H.x + dx / l * 1.35, gy = H.y + dy / l * 1.35, f = room(gx, gy) + 0.3 * room(gx + dx / l, gy + dy / l);
      if (!best || f > best.f + 1e-6) best = { k:k, ux:dx / l, uy:dy / l, gx:gx, gy:gy, f:f }; });
    var gA = add({ id:"gA", el:amide ? "O" : "N", x:best.gx, y:best.gy, gh:true, i:-1 });
    sc.bonds.push({ a:best.k, b:gA, o:1, hb:true });
    if (amide) { var gc = add({ id:"gAc", el:"C", x:best.gx + best.ux * 0.95, y:best.gy + best.uy * 0.95, gh:true, i:-1 }); sc.bonds.push({ a:gA, b:gc, o:2, gh:true }); }
    else add({ id:"gAlp", el:"LP", x:best.gx - best.ux * 0.42, y:best.gy - best.uy * 0.42, ang:Math.atan2(-best.uy, -best.ux), gh:true, i:-1 });
    var H0 = sc.atoms[best.k], mx = (H0.x + best.gx) / 2, my = (H0.y + best.gy) / 2, vert = Math.abs(best.uy) > 0.5;
    add({ id:"hbt", el:"TXT", t:"hydrogen bond", w:0.85, x:mx + (vert ? 1.05 : 0), y:my + (vert ? 0 : -0.32), i:-1 });
    var acc = amide ? at(sc, "ao") : kLP;
    if (acc >= 0) {
      var A0 = sc.atoms[acc], base = amide ? sc.atoms[kC] : Nn, dx2 = A0.x - base.x, dy2 = A0.y - base.y, l2 = Math.hypot(dx2, dy2) || 1, ux = dx2 / l2, uy = dy2 / l2, d0 = amide ? 1.25 : 0.95;
      var gH = add({ id:"gBh", el:"H", x:A0.x + ux * d0, y:A0.y + uy * d0, gh:true, isH:true, i:-1 });
      var gN = add({ id:"gB", el:"N", x:A0.x + ux * (d0 + 0.62), y:A0.y + uy * (d0 + 0.62), gh:true, i:-1 });
      sc.bonds.push({ a:acc, b:gH, o:1, hb:true }); sc.bonds.push({ a:gH, b:gN, o:1, gh:true });
    }
    return sc;
  }

  // ---------- 3D coordinates (VSEPR; amide N planar), main chain zig-zag, then aligned ----------
  function add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function crs(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a){ return Math.hypot(a[0], a[1], a[2]); }
  function nrm(a){ var l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function perp(u){ var p = crs(u, [0, 0, 1]); if (len(p) < 1e-6) p = crs(u, [0, 1, 0]); return nrm(p); }
  var TET = [nrm([1, 1, 1]), nrm([1, -1, -1]), nrm([-1, 1, -1]), nrm([-1, -1, 1])];
  function pair(u1, u2){ var b = nrm(add(u1, u2)), c = nrm(crs(u1, u2)); return [add(mul(b, -0.5774), mul(c, 0.8165)), add(mul(b, -0.5774), mul(c, -0.8165))]; }
  function geo(m, i){
    var el = m.a[i].el;
    if (el === "N") return amideN(m, i) ? 2 : 3;
    if (el !== "C") return 3;
    return m.b.some(function(b){ return (b[0] === i || b[1] === i) && b[2] === 2; }) ? 2 : 3;
  }
  function scene3(m){
    var Ad = adj(m), h = hc(m), n = m.a.length, P = new Array(n), main = m.main && m.main.length ? m.main : [0], onMain = {}, done = {}, q = [], Hs = [], i;
    main.forEach(function(x, k){ onMain[x] = k; });
    function ref(x, p, u){
      var g = Ad[p].filter(function(j){ return j !== x && done[j]; })[0];
      var a = g != null ? nrm(sub(P[p], P[g])) : perp(u), pa = sub(a, mul(u, dot(a, u)));
      return len(pa) < 1e-6 ? perp(u) : nrm(pa);
    }
    function dirs(x){
      var pl = Ad[x].filter(function(j){ return done[j]; }), us = pl.map(function(j){ return nrm(sub(P[j], P[x])); }), g = geo(m, x);
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
    function bl(x, j){ var e = [m.a[x].el, m.a[j].el].sort().join(""), o = order(m, x, j); return e === "CC" ? (o === 2 ? 1.34 : 1.54) : e === "CN" ? 1.47 : e === "CO" ? (o === 2 ? 1.23 : 1.43) : 1.45; }
    var HL = { C:1.09, N:1.01, O:0.96 }, s0 = main[0];
    P[s0] = [0, 0, 0]; done[s0] = 1; q.push(s0);
    while (q.length) {
      var x = q.shift(), ds = dirs(x), fr = Ad[x].filter(function(j){ return !done[j]; }).sort(function(a, b){ return ((onMain[b] != null) - (onMain[a] != null)) || a - b; });
      fr.forEach(function(j, k){ P[j] = add(P[x], mul(ds[k] || TET[k % 4], bl(x, j))); done[j] = 1; q.push(j); });
      for (var t = 0; t < h[x]; t++) Hs.push({ par:x, k:t, p:add(P[x], mul(ds[fr.length + t] || TET[t % 4], HL[m.a[x].el] || 1.05)) });
      if (m.a[x].el === "N" && geo(m, x) === 3 && ds[fr.length + h[x]]) Hs.push({ par:x, lp:true, p:add(P[x], mul(ds[fr.length + h[x]], 0.95)) });
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
    for (i = 0; i < n; i++) { var p0 = tf(P[i]); atoms.push({ id:"a" + m.a[i].key, el:m.a[i].el, x:p0[0], y:p0[1], z:p0[2], i:i }); }
    m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
    Hs.forEach(function(o){
      var p1 = tf(o.p);
      if (o.lp) { atoms.push({ id:"lp" + m.a[o.par].key, el:"LP", x:p1[0], y:p1[1], z:p1[2], i:-1, par:o.par }); return; }
      bonds.push({ a:o.par, b:atoms.length, o:1 }); atoms.push({ id:"h" + m.a[o.par].key + "." + o.k, el:"H", x:p1[0], y:p1[1], z:p1[2], i:-1, par:o.par, isH:true });
    });
    return { atoms:atoms, bonds:bonds, view:"3d" };
  }

  // ---------- morph (atoms matched by id), rows of scenes ----------
  function lerp(a, b, t){ return a + (b - a) * t; }
  function morph(A, B){
    var bi = {}, usedB = {}, pairs = [], leftA = [], leftB = [];
    B.atoms.forEach(function(x, k){ bi[x.id] = k; });
    A.atoms.forEach(function(x, k){ if (x.id in bi && !usedB[bi[x.id]]) { pairs.push([k, bi[x.id]]); usedB[bi[x.id]] = 1; } else leftA.push(k); });
    B.atoms.forEach(function(x, k){ if (!usedB[k]) leftB.push(k); });
    return function(t){
      var atoms = [], ia = {}, ib = {};
      pairs.forEach(function(p){ var a = A.atoms[p[0]], b = B.atoms[p[1]], o = Object.assign({}, t < 0.5 ? a : b);
        o.x = lerp(a.x, b.x, t); o.y = lerp(a.y, b.y, t); o.op = lerp(a.op == null ? 1 : a.op, b.op == null ? 1 : b.op, t);
        if (a.tx != null && b.tx != null) { o.tx = lerp(a.tx, b.tx, t); o.ty = lerp(a.ty, b.ty, t); o.nx = lerp(a.nx, b.nx, t); o.ny = lerp(a.ny, b.ny, t); }
        if (a.ang != null && b.ang != null) o.ang = a.ang + Math.atan2(Math.sin(b.ang - a.ang), Math.cos(b.ang - a.ang)) * t;
        ia[p[0]] = ib[p[1]] = atoms.length; atoms.push(o); });
      leftA.forEach(function(k){ var o = Object.assign({}, A.atoms[k]); o.op = (o.op == null ? 1 : o.op) * (1 - t); ia[k] = atoms.length; atoms.push(o); });
      leftB.forEach(function(k){ var o = Object.assign({}, B.atoms[k]); o.op = (o.op == null ? 1 : o.op) * t; ib[k] = atoms.length; atoms.push(o); });
      var src = t < 0.5 ? A : B, ix = t < 0.5 ? ia : ib;
      return { atoms:atoms, bonds:src.bonds.map(function(b){ return { a:ix[b.a], b:ix[b.b], o:b.o, hb:b.hb, gh:b.gh }; }), view:src.view };
    };
  }
  function bbox(sc){
    var b = { x0:Infinity, x1:-Infinity, y0:Infinity, y1:-Infinity };
    sc.atoms.forEach(function(a){ var w = a.w || 0; b.x0 = Math.min(b.x0, a.x - w); b.x1 = Math.max(b.x1, a.x + w); b.y0 = Math.min(b.y0, a.y); b.y1 = Math.max(b.y1, a.y); });
    return b;
  }
  function shift(sc, dx, dy){ sc.atoms.forEach(function(a){ a.x += dx; a.y += dy; if (a.tx != null) { a.tx += dx; a.ty += dy; a.nx += dx; a.ny += dy; } }); return sc; }
  function combine(parts){
    var out = { atoms:[], bonds:[], view:"st" };
    parts.forEach(function(sc){ var off = out.atoms.length; sc.atoms.forEach(function(a){ out.atoms.push(a); }); sc.bonds.forEach(function(b){ out.bonds.push({ a:b.a + off, b:b.b + off, o:b.o, hb:b.hb, gh:b.gh }); }); });
    return out;
  }
  // parts: scenes, or {t, id} text items (a big "+" or "→"); laid out left to right, centred on y = 0
  function row(parts, gap){
    var x = 0, out = [];
    parts.forEach(function(p){
      if (p.atoms) { var b = bbox(p); shift(p, x - b.x0, -(b.y0 + b.y1) / 2); x += b.x1 - b.x0 + (gap || 0.8); out.push(p); }
      else { out.push({ atoms:[{ id:p.id, el:"TXT", t:p.t, big:true, w:0.25, x:x + 0.1, y:0, i:-1 }], bonds:[] }); x += 0.2 + (gap || 0.8); }
    });
    return combine(out);
  }
  function water(idO, idH1, idH2){
    return { atoms:[{ id:idO, el:"O", x:0, y:0, i:-2, lbl:"O" }, { id:idH1, el:"H", x:-0.55, y:0.38, i:-1, isH:true }, { id:idH2, el:"H", x:0.55, y:0.38, i:-1, isH:true }],
      bonds:[{ a:0, b:1, o:1 }, { a:0, b:2, o:1 }], view:"st" };
  }

  // ---------- SVG renderers ----------
  var RAD = { C:0.36, H:0.24, O:0.36, N:0.36 };
  function tsp(t, fs){ var out = "", low = false, d = r1(fs * 0.28);
    String(t).replace(/(\d+|\D+)/g, function(seg){ var dig = /^\d/.test(seg); if (dig && !low) { out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.72) + '">' + seg + "</tspan>"; low = true; } else if (!dig && low) { out += '<tspan dy="' + (-d) + '">' + seg + "</tspan>"; low = false; } else out += seg; return seg; });
    return out; }
  function estW(t, fs){ var w = 0; String(t).split("").forEach(function(ch){ w += /\d/.test(ch) ? 0.42 : /[a-z ]/.test(ch) ? 0.5 : 0.66; }); return w * fs; }
  function pseudo(a){ return a.el === "LP" || a.el === "ARR" || a.el === "TXT"; }
  function fit2(sc, W, H, smx){
    var b = bbox(sc);
    var s = Math.min((W - 24) / (b.x1 - b.x0 + 1.3), (H - 24) / (b.y1 - b.y0 + 1.4), smx || 70);
    return { s:s, ox:W / 2 - (b.x0 + b.x1) / 2 * s, oy:H / 2 - (b.y0 + b.y1) / 2 * s };
  }
  function fit3(sc, W, H){
    var R = 0.5; sc.atoms.forEach(function(a){ R = Math.max(R, Math.hypot(a.x, a.y, a.z || 0) + (RAD[a.el] || 0.3)); });
    return { s:Math.min(Math.min(W, H) * 0.48 / R, 96), ox:W / 2, oy:H / 2 };
  }
  function lerpFit(a, b, t){ return { s:lerp(a.s, b.s, t), ox:lerp(a.ox, b.ox, t), oy:lerp(a.oy, b.oy, t) }; }
  function lab(a){ return a.lbl || a.el; }
  function inkOf(el){ return el === "C" ? "var(--at-c)" : el === "H" ? "var(--ink-2)" : el === "O" ? "var(--at-o)" : el === "N" ? "var(--at-n)" : "var(--ink)"; }
  function opAttr(op){ return op < 0.999 ? ' opacity="' + (Math.round(op * 100) / 100) + '"' : ""; }
  function svg2d(sc, fit, o){
    var s = fit.s, fs = clamp(s * 0.4, 11, 22), out = "", X = function(a){ return fit.ox + a.x * s; }, Y = function(a){ return fit.oy + a.y * s; };
    o = o || {};
    function opOf(a){ return (a.op == null ? 1 : a.op) * (a.gh ? 0.5 : 1); }
    var ext = sc.atoms.map(function(a){ return pseudo(a) ? [4, 4] : [estW(lab(a), fs) / 2 + 2, fs * 0.5]; });
    sc.atoms.forEach(function(a){
      var rg = o.ring && o.ring[a.id], op = opOf(a); if (!rg || op < 0.05) return;
      out += '<circle cx="' + r1(X(a)) + '" cy="' + r1(Y(a)) + '" r="' + r1(fs * (lab(a).length > 1 ? 1 : 0.72)) + '" fill="var(--hi-soft)" stroke="var(--pen)" stroke-width="1.8"' + (rg === "d" ? ' stroke-dasharray="3 2"' : "") + opAttr(op) + "/>";
    });
    sc.bonds.forEach(function(b){
      var A = sc.atoms[b.a], B = sc.atoms[b.b]; if (!A || !B) return;
      var ax = X(A), ay = Y(A), bx = X(B), by = Y(B), dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      var ta = Math.min(ux ? ext[b.a][0] / Math.abs(ux) : 1e9, uy ? ext[b.a][1] / Math.abs(uy) : 1e9), tb = Math.min(ux ? ext[b.b][0] / Math.abs(ux) : 1e9, uy ? ext[b.b][1] / Math.abs(uy) : 1e9);
      if (ta + tb >= L - 2) return;
      var op = Math.min(A.op == null ? 1 : A.op, B.op == null ? 1 : B.op) * (b.gh ? 0.5 : 1); if (op < 0.02) return;
      if (b.hb) { out += '<line x1="' + r1(ax + ux * ta) + '" y1="' + r1(ay + uy * ta) + '" x2="' + r1(bx - ux * tb) + '" y2="' + r1(by - uy * tb) + '" stroke="var(--ink-2)" stroke-width="2.2" stroke-dasharray="5 4" stroke-linecap="round"' + opAttr(op) + "/>"; return; }
      var offs = b.o === 2 ? [-3, 3] : b.o === 3 ? [-5, 0, 5] : [0];
      offs.forEach(function(d){ out += '<line x1="' + r1(ax + ux * ta - uy * d) + '" y1="' + r1(ay + uy * ta + ux * d) + '" x2="' + r1(bx - ux * tb - uy * d) + '" y2="' + r1(by - uy * tb + ux * d) + '" stroke="var(--ink)" stroke-width="' + r1(clamp(s * 0.035, 1.5, 2.3)) + '" stroke-linecap="round"' + opAttr(op) + "/>"; });
    });
    sc.atoms.forEach(function(a){
      var x = r1(X(a)), y = r1(Y(a)), op = opOf(a); if (op < 0.02) return;
      if (a.el === "LP") {
        var px = -Math.sin(a.ang), py = Math.cos(a.ang), d = Math.max(3.2, fs * 0.24), rr = Math.max(2.3, fs * 0.13);
        out += '<circle cx="' + r1(x + px * d) + '" cy="' + r1(y + py * d) + '" r="' + r1(rr) + '" fill="var(--e-pair)"' + opAttr(op) + '/><circle cx="' + r1(x - px * d) + '" cy="' + r1(y - py * d) + '" r="' + r1(rr) + '" fill="var(--e-pair)"' + opAttr(op) + "/>";
        return;
      }
      if (a.el === "ARR") {
        var sx = X(a), sy = Y(a), ex = fit.ox + a.tx * s, ey = fit.oy + a.ty * s, mx = (sx + ex) / 2, my = (sy + ey) / 2, ddx = ex - sx, ddy = ey - sy, l = Math.hypot(ddx, ddy) || 1;
        var nx = -ddy / l, ny = ddx / l, cx0 = fit.ox + a.nx * s, cy0 = fit.oy + a.ny * s; if ((mx - cx0) * nx + (my - cy0) * ny < 0) { nx = -nx; ny = -ny; }
        var qx = mx + nx * l * 0.55, qy = my + ny * l * 0.55, hx = ex - qx, hy = ey - qy, hl = Math.hypot(hx, hy) || 1, k = Math.max(6, fs * 0.42);
        hx /= hl; hy /= hl;
        out += '<path d="M' + r1(sx) + " " + r1(sy) + " Q" + r1(qx) + " " + r1(qy) + " " + r1(ex - hx * 2) + " " + r1(ey - hy * 2) + '" fill="none" stroke="var(--e-pair)" stroke-width="2"' + opAttr(op) + "/>";
        out += '<path d="M' + r1(ex) + " " + r1(ey) + " L" + r1(ex - hx * k - hy * k * 0.5) + " " + r1(ey - hy * k + hx * k * 0.5) + " L" + r1(ex - hx * k + hy * k * 0.5) + " " + r1(ey - hy * k - hx * k * 0.5) + 'Z" fill="var(--e-pair)"' + opAttr(op) + "/>";
        return;
      }
      if (a.el === "TXT") { out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * (a.big ? 1.25 : 0.62)) + '" font-weight="' + (a.big ? 700 : 400) + '" fill="var(' + (a.big ? "--ink" : "--ink-2") + ')"' + opAttr(op) + ">" + a.t + "</text>"; return; }
      out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * (a.isH ? 0.9 : 1)) + '" font-weight="' + (a.el === "O" || a.el === "N" ? 700 : 400) + '" fill="' + inkOf(a.el) + '"' + opAttr(op) + ">" + tsp(lab(a), fs) + "</text>";
    });
    return out;
  }
  function proj(p, rot){
    var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
    var x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
    return [x, y * cx - z * sx, y * sx + z * cx];
  }
  function svg3d(sc, rot, fit, o, uid){
    var s = fit.s, pr = sc.atoms.map(function(a){ return proj([a.x, a.y, a.z || 0], rot); }), Rm = 0.1, items = [], out = "", g = "c1g" + uid;
    pr.forEach(function(p){ Rm = Math.max(Rm, Math.abs(p[2])); });
    sc.bonds.forEach(function(b){ if (pr[b.a] && pr[b.b]) items.push({ z:(pr[b.a][2] + pr[b.b][2]) / 2 - 0.05, b:b }); });
    sc.atoms.forEach(function(a, k2){ items.push({ z:pr[k2][2], k:k2 }); });
    items.sort(function(p, q){ return p.z - q.z; });
    out += '<defs><radialGradient id="' + g + '" cx=".3" cy=".27" r=".42"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
    items.forEach(function(it){
      if (it.b) {
        var A = sc.atoms[it.b.a], B = sc.atoms[it.b.b], pa = pr[it.b.a], pb = pr[it.b.b], dx = (pb[0] - pa[0]) * s, dy = (pb[1] - pa[1]) * s, L = Math.hypot(dx, dy) || 1, ra = (RAD[A.el] || 0.3) * s * 0.8, rb = (RAD[B.el] || 0.3) * s * 0.8;
        if (L <= ra + rb) return;
        var ox = -dy / L, oy = dx / L, n = it.b.o, sp = s * 0.085, wd = s * (n > 1 ? 0.07 : 0.12);
        for (var q = 0; q < n; q++) {
          var d = (q - (n - 1) / 2) * sp * 2;
          out += '<line x1="' + r1(fit.ox + pa[0] * s + dx / L * ra + ox * d) + '" y1="' + r1(fit.oy + pa[1] * s + dy / L * ra + oy * d) + '" x2="' + r1(fit.ox + pb[0] * s - dx / L * rb + ox * d) + '" y2="' + r1(fit.oy + pb[1] * s - dy / L * rb + oy * d) + '" stroke="var(--ink-2)" stroke-width="' + r1(wd) + '" stroke-linecap="round"/>';
        }
        return;
      }
      var a = sc.atoms[it.k], p = pr[it.k], x = fit.ox + p[0] * s, y = fit.oy + p[1] * s;
      if (a.el === "LP") {
        var pp = pr[a.par], vx = p[0] - pp[0], vy = p[1] - pp[1], vl = Math.hypot(vx, vy) || 1, d2 = s * 0.09;
        [-1, 1].forEach(function(sg){ out += '<circle cx="' + r1(x - vy / vl * d2 * sg) + '" cy="' + r1(y + vx / vl * d2 * sg) + '" r="' + r1(Math.max(2.5, s * 0.055)) + '" fill="var(--e-pair)"/>'; });
        return;
      }
      var r = (RAD[a.el] || 0.3) * s * (1 + 0.07 * p[2] / Rm), col = MV.chem.atom(a.el);
      out += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.5"' : "") + '/><circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="url(#' + g + ')"/>';
      out += '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(r * 1.05) + '" font-weight="700" fill="' + col.ink + '">' + a.el + "</text>";
    });
    return out;
  }

  // ---------- view widget ----------
  var UID = 0;
  function view(host, opts){
    opts = opts || {};
    var uid = ++UID, W = opts.w || 640, H = opts.h || 380, aspect = H / W;
    host.innerHTML = '<div class="c1-wrap"><svg class="c1-svg" viewBox="0 0 ' + W + " " + H + '" role="img"></svg></div>' +
      (opts.rotate ? '<div class="c1-rot" hidden><span class="tiny muted">Turn the model:</span><button type="button" class="btn ghost sm" data-rot="l" aria-label="Turn left">⟲</button><button type="button" class="btn ghost sm" data-rot="r" aria-label="Turn right">⟳</button><button type="button" class="btn ghost sm" data-rot="u" aria-label="Tilt up">↑</button><button type="button" class="btn ghost sm" data-rot="d" aria-label="Tilt down">↓</button><span class="tiny muted">or drag it, or tap it and use the arrow keys</span></div>' : "");
    var svg = $(".c1-svg", host), rb = $(".c1-rot", host);
    var st = { sc:null, o:{}, rot:{ x:-0.45, y:0.55 }, busy:false };
    function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 500 ? Math.max(aspect, opts.phone || 0.7) : aspect)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
    if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0 && !st.busy) render(); }).observe(svg);
    function render(){
      if (!st.sc || st.busy) return; size();
      var sc = st.sc, o = st.o, is3 = sc.view === "3d", fit = is3 ? fit3(sc, W, H) : fit2(sc, W, H, o.smax);
      svg.innerHTML = is3 ? svg3d(sc, st.rot, fit, o, uid) : svg2d(sc, fit, o);
      svg.setAttribute("aria-label", o.aria || "Molecule");
      if (rb) rb.hidden = !is3;
      if (is3) svg.setAttribute("tabindex", "0"); else svg.removeAttribute("tabindex");
    }
    function anim(A, B, o, dur, done){
      size();
      var mf = morph(A, B), fA = fit2(A, W, H, o.smax), fB = fit2(B, W, H, o.smax);
      if (o.sameFit) { var fm = fA.s < fB.s ? fA : fB; fA = fB = fm; }
      st.busy = true; if (rb) rb.hidden = true; svg.removeAttribute("tabindex");
      svg.setAttribute("aria-label", o.aria || "Molecule");
      MV.tween({ dur:dur, step:function(t){ svg.innerHTML = svg2d(mf(t), lerpFit(fA, fB, t), o.during || {}); }, done:function(){ st.busy = false; if (done) done(); } });
    }
    function turn(r){ if (r === "l") st.rot.y -= 0.35; else if (r === "r") st.rot.y += 0.35; else if (r === "u") st.rot.x -= 0.3; else st.rot.x += 0.3; render(); }
    if (rb) rb.addEventListener("click", function(e){ var b = e.target.closest("[data-rot]"); if (b) turn(b.dataset.rot); });
    svg.addEventListener("keydown", function(e){
      if (!st.sc || st.sc.view !== "3d" || st.busy) return;
      var r = { ArrowLeft:"l", ArrowRight:"r", ArrowUp:"u", ArrowDown:"d" }[e.key]; if (!r) return;
      e.preventDefault(); turn(r);
    });
    var drag = null;
    svg.addEventListener("pointerdown", function(e){ if (!st.sc || st.sc.view !== "3d" || st.busy) return; drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
    svg.addEventListener("pointermove", function(e){ if (!drag) return; st.rot.y += (e.clientX - drag.x) * 0.012; st.rot.x = clamp(st.rot.x - (e.clientY - drag.y) * 0.012, -1.5, 1.5); drag = { x:e.clientX, y:e.clientY }; render(); });
    svg.addEventListener("pointerup", function(){ drag = null; }); svg.addEventListener("pointercancel", function(){ drag = null; });
    return { show:function(sc, o){ st.sc = sc; st.o = o || {}; render(); }, render:render, anim:anim, busy:function(){ return st.busy; } };
  }
  return { adj:adj, hc:hc, formula:formula, idx:idx, mainPath:mainPath, layout2d:layout2d, decorate:decorate, scene3:scene3, morph:morph,
    row:row, water:water, shift:shift, bbox:bbox, combine:combine, at:at, view:view };
})();

// ---------- molecules from builder specs ----------
var MOLC = {};
function buildMol(sp, first){
  var a = [{ el:"N", key:"n" }], b = [];
  function add(el, key, to, o){ a.push({ el:el, key:key }); b.push([to, a.length - 1, o || 1]); return a.length - 1; }
  for (var k = 0; k < 3; k++) {
    if (k === 0 && sp.a) { var c = add("C", "s0c0", 0), p = c; add("O", "o", c, 2); for (var i = 1; i < sp.a; i++) p = add("C", "s0c" + i, p); continue; }
    var g = sp.g[k]; if (!g || g === "H") continue;
    var c0 = add("C", "s" + k + "c0", 0);
    if (g === "ip") { add("C", "s" + k + "c1", c0); add("C", "s" + k + "c2", c0); }
    else for (var j = 1, q = c0; j < GC[g]; j++) q = add("C", "s" + k + "c" + j, q);
  }
  var m = { a:a, b:b }; m.main = C1.mainPath(m, first); return m;
}
function molOf(sp, first){ var k = JSON.stringify(sp) + (first || ""); return MOLC[k] || (MOLC[k] = buildMol(sp, first)); }
function acidMol(n){
  var a = [{ el:"C", key:"s0c0" }, { el:"O", key:"o" }, { el:"O", key:"oh" }], b = [[0, 1, 2], [0, 2, 1]];
  for (var i = 1, p = 0; i < n; i++) { a.push({ el:"C", key:"s0c" + i }); b.push([p, a.length - 1, 1]); p = a.length - 1; }
  var m = { a:a, b:b }; m.main = C1.mainPath(m); return m;
}
function scene2(sp, o){ var m = molOf(sp); return C1.decorate(C1.layout2d(m), m, o); }

// ---------- @component C2 nameBuilder (amines and amides) ----------
// Names from a builder spec (amides: parent from the acyl chain + -amide; amines: the longest group on N is the parent,
// propan-1-/propan-2-amine with a locant; other N groups as alphabetical N-prefixes, N,N-di… for a pair), a chip palette
// (N-prefixes, parent stems, suffixes) that composes a name, and a judge that names the mistake (M5, suffix, locant, prefixes,
// order). C2.name(sp) · C2.compose(tokens) · C2.judge(tokens, sp) -> {ok, msg} · C2.chips(host, {get, set, locked}) -> {paint}
function prefixList(list){
  var cnt = {}; list.forEach(function(g){ cnt[g] = (cnt[g] || 0) + 1; });
  return Object.keys(cnt).sort(function(a, b){ return GN[a] < GN[b] ? -1 : 1; }).map(function(g){
    var nm = g === "ip" ? "(propan-2-yl)" : GN[g]; return cnt[g] > 1 ? "N,N-di" + nm : "N-" + nm;
  });
}
function C2name(sp){
  var subs = nonH(sp);
  if (sp.a) return prefixList(subs).join("-") + STEM[sp.a] + "anamide";
  if (!subs.length) return "ammonia";
  subs.sort(bySize);
  var p = subs[0];
  return prefixList(subs.slice(1)).join("-") + (p === "pr" ? "propan-1-amine" : p === "ip" ? "propan-2-amine" : STEM[GC[p]] + "anamine");
}
var C2 = (function(){
  var PRE = ["N-methyl", "N-ethyl", "N-propyl", "N-(propan-2-yl)", "N,N-dimethyl", "N,N-diethyl", "N,N-dipropyl", "N,N-di(propan-2-yl)"];
  var PAR = ["methan", "ethan", "propan", "butan", "pentan"], SUF = ["-amine", "-1-amine", "-2-amine", "-amide"];
  var ROWS = [["N-groups", PRE], ["Parent", PAR], ["Suffix", SUF]];
  var PREC = { "N-methyl":1, "N-ethyl":2, "N-propyl":3, "N-(propan-2-yl)":3, "N,N-dimethyl":2, "N,N-diethyl":4, "N,N-dipropyl":6, "N,N-di(propan-2-yl)":6 };
  var M5 = "Carbons on the N are N-prefixes. The parent chain is the one with the C=O (amide) or bonded to N (amine).";
  function kind(t){ return /^N/.test(t) ? "p" : /^-/.test(t) ? "s" : "r"; }
  function compose(tk){
    var s = "", prev = null;
    (tk || []).forEach(function(t){ var k = kind(t); if (k === "p" && prev === "p") s += "-"; s += k === "s" ? (/\d/.test(t) ? t : t.slice(1)) : t; prev = k; });
    return s;
  }
  function judge(tk, sp){
    tk = tk || [];
    if (!tk.length) return { ok:false, msg:"Build a name with the chips first." };
    var want = C2name(sp);
    if (compose(tk) === want) return { ok:true };
    var ks = tk.map(kind).join(""), pre = tk.filter(function(t){ return kind(t) === "p"; }), par = tk.filter(function(t){ return kind(t) === "r"; }), suf = tk.filter(function(t){ return kind(t) === "s"; });
    if (par.length !== 1 || suf.length !== 1 || !/^p*rs$/.test(ks)) return { ok:false, msg:"A name is built in order: N-prefixes (if any), then one parent stem, then one suffix." };
    var amideS = suf[0] === "-amide", pc = PAR.indexOf(par[0]) + 1, subs = nonH(sp).sort(bySize), nCarbN = subs.reduce(function(s, g){ return s + GC[g]; }, 0);
    if (sp.a && !amideS) return { ok:false, msg:"There’s a C=O next to the N: the suffix is -amide." };
    if (!sp.a && amideS) return { ok:false, msg:"No C=O next to the N: the suffix is -amine." };
    var rest = subs;
    if (sp.a) {
      if (pc !== sp.a) return { ok:false, msg:pc > sp.a && pc <= sp.a + nCarbN ? M5 : "The parent comes from the acid side: count the carbons in the chain that holds the C=O (" + sp.a + ")." };
    } else {
      if (!subs.length) return { ok:false, msg:"This is ammonia: no carbon groups, so no amine name." };
      var top = subs[0], wc = GC[top], ws = top === "pr" ? "-1-amine" : top === "ip" ? "-2-amine" : "-amine";
      if (pc !== wc) return { ok:false, msg:pc > wc ? M5 : "The parent is the longest carbon group on the N (" + wc + " carbons)." };
      if (suf[0] !== ws) return { ok:false, msg:wc < 3 ? "Methanamine and ethanamine need no locant: the N can only be on C1." : suf[0] === "-amine" ? "With three carbons, say which carbon holds the N: propan-1-amine or propan-2-amine." : "Check which carbon of the parent chain the N is on." };
      rest = subs.slice(1);
    }
    var wantPre = prefixList(rest);
    if (pre.slice().sort().join("|") === wantPre.slice().sort().join("|")) return { ok:false, msg:"List the N-prefixes in alphabetical order: ethyl before methyl, propan-2-yl before propyl." };
    var pc2 = pre.reduce(function(s, t){ return s + PREC[t]; }, 0), want2 = rest.reduce(function(s, g){ return s + GC[g]; }, 0);
    if (!pre.length && rest.length) return { ok:false, msg:"Every carbon group on the N that isn’t the parent needs an N- prefix." };
    if (pc2 < want2) return { ok:false, msg:"A carbon group on the N is missing from your prefixes. Use N,N-di… when the same group appears twice." };
    return { ok:false, msg:"Check the N-prefixes: each one must match a carbon group on the N (other than the parent). Use N,N-di… for two of the same group." };
  }
  function chips(host, o){
    host.innerHTML = '<p class="c2-tape" aria-live="polite"></p><div class="c2-rows">' + ROWS.map(function(r){
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
      if (b.dataset.t) { if (tk.length >= 8) return; tk.push(b.dataset.t); } else if (b.dataset.c2 === "back") tk.pop(); else if (b.dataset.c2 === "clear") tk = [];
      o.set(tk); paint();
      if (b.disabled) { var f = host.querySelector(".c2-c"); if (f) f.focus({ preventScroll:true }); }
    });
    paint();
    return { paint:paint };
  }
  return { name:C2name, compose:compose, judge:judge, chips:chips };
})();

// ---------- readouts ----------
function info(sp){
  var nm = C2.name(sp), f = fOf(sp), M = nCarb(sp) ? molar(f) : MM.N + 3 * MM.H, nh = nNH(sp);
  return { name:nm, common:COMMON[nm] || "", cls:clsOf(sp), nh:nh, base:!sp.a, M:Math.round(M), bp:bpOf(nm), f:f, amide:sp.a > 0 };
}
function readRows(sp, o){
  o = o || {};
  var I = info(sp), bpT = I.bp == null ? '<span class="muted">not in the data table</span>' : degC(I.bp) + " (data)" + (SOLID[I.name] ? "; " + SOLID[I.name] : "");
  var rows = [["Name", o.hideName ? '<span class="muted">hidden while you build a name (it shows when your name is right)</span>' : "<strong>" + I.name + "</strong>" + (I.common ? " (" + I.common + ")" : "")],
    ["Class", MV.cap(I.cls)], ["N–H bonds", String(I.nh)], ["Can hydrogen-bond to itself?", I.nh ? "Yes (N–H)" : "No: no N–H"],
    ["Acts as a base?", I.amide ? "No: the lone pair is pulled toward C=O" : "Yes (lone pair free)"], ["Molar mass", I.M + " g/mol"], ["Boiling point", bpT]];
  if (o.first) rows.unshift(o.first);
  return MV.readoutHTML(rows);
}

// ---------- Compare list (16 compounds, 44–73 g/mol) and the boiling-point bars ----------
var CMP = [
  { id:"propane", fam:"alkane", f:{ C:3, H:8 }, cf:"CH3CH2CH3", hb:"" }, { id:"butane", fam:"alkane", f:{ C:4, H:10 }, cf:"CH3CH2CH2CH3", hb:"" },
  { id:"methoxymethane", fam:"ether", f:{ C:2, H:6, O:1 }, cf:"CH3OCH3", hb:"" },
  { id:"ethanol", fam:"alcohol", f:{ C:2, H:6, O:1 }, cf:"CH3CH2OH", hb:"O–H···O" }, { id:"propan-1-ol", fam:"alcohol", f:{ C:3, H:8, O:1 }, cf:"CH3CH2CH2OH", hb:"O–H···O" },
  { id:"ethanamine", sp:{ a:0, g:["et", "H", "H"] } }, { id:"N-methylmethanamine", sp:{ a:0, g:["me", "me", "H"] } }, { id:"propan-1-amine", sp:{ a:0, g:["pr", "H", "H"] } },
  { id:"propan-2-amine", sp:{ a:0, g:["ip", "H", "H"] } }, { id:"N-methylethanamine", sp:{ a:0, g:["et", "me", "H"] } }, { id:"N,N-dimethylmethanamine", sp:{ a:0, g:["me", "me", "me"] } },
  { id:"methanamide", sp:{ a:1, g:["H", "H", "H"] } }, { id:"ethanamide", sp:{ a:2, g:["H", "H", "H"] } }, { id:"N-methylethanamide", sp:{ a:2, g:["H", "me", "H"] } },
  { id:"N,N-dimethylmethanamide", sp:{ a:1, g:["H", "me", "me"] } }, { id:"propanamide", sp:{ a:3, g:["H", "H", "H"] } }];
CMP.forEach(function(c, i){
  c.ord = i;
  if (c.sp) { c.fam = c.sp.a ? "amide" : "amine"; c.f = fOf(c.sp); c.cf = condensed(c.sp); c.hb = nNH(c.sp) ? (c.sp.a ? "N–H···O=C" : "N–H···N") : ""; c.nh = nNH(c.sp); }
  c.M = Math.round(molar(c.f)); c.bp = bpOf(c.id);
});
function cmpById(id){ return CMP.filter(function(c){ return c.id === id; })[0]; }
var FAMS = [["alkane", "Alkanes"], ["ether", "Ether"], ["alcohol", "Alcohols"], ["amine", "Amines"], ["amide", "Amides"]];
// @component bpBars — boiling-point columns on a fixed −60 to 240 °C scale, sorted by molar mass, with HTML labels (name,
// formula · molar mass, hydrogen-bond badge). barsHTML(list, W, vals, showHB)
function barsHTML(list, W, vals, showHB){
  var H = 250, top = 26, bot = 226, lo = -60, hi = 240, L = 44, n = Math.max(list.length, 1), cw = (W - L - 6) / n;
  function Y(v){ return bot - (clamp(v, lo, hi) - lo) / (hi - lo) * (bot - top); }
  var s = "";
  [-60, 0, 60, 120, 180, 240].forEach(function(v){ var y = r1(Y(v)); s += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - 4) + '" y2="' + y + '" stroke="var(' + (v === 0 ? "--ink-2" : "--plot-grid") + ')" stroke-width="' + (v === 0 ? 1.6 : 1) + '"' + (v === 0 ? ' stroke-dasharray="5 4"' : "") + '/><text x="' + (L - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="central" font-size="12" fill="var(--ink-2)">' + MV.chem.fx(v, 0) + "</text>"; });
  s += '<text x="4" y="12" font-size="12" font-weight="700" fill="var(--ink-2)">°C</text>';
  list.forEach(function(c, i){
    var v = vals ? vals[i] : c.bp, cx = L + cw * (i + 0.5), bw = Math.min(46, cw * 0.5), y0 = Y(0);
    if (v == null) { s += '<text x="' + r1(cx) + '" y="' + r1(y0 - 14) + '" text-anchor="middle" font-size="22" font-weight="700" fill="var(--ink-2)">?</text>'; return; }
    var y = Y(v);
    s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(Math.min(y, y0)) + '" width="' + r1(bw) + '" height="' + r1(Math.max(2, Math.abs(y0 - y))) + '" rx="4" fill="var(' + (c.fam === "amide" ? "--f3" : c.fam === "amine" ? "--pen" : "--ink-2") + ')"/>';
    s += '<text x="' + r1(cx) + '" y="' + r1(v >= 0 ? y - 9 : y + 14) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">' + degC(Math.round(v)) + "</text>";
  });
  var aria = list.length ? "Boiling points (data): " + list.map(function(c, i){ var v = vals ? vals[i] : c.bp; return c.id + " " + (v == null ? "hidden until the reveal" : MV.plain(degC(Math.round(v)))); }).join("; ") + "." : "No compounds chosen.";
  var labs = '<div class="am-blabs" style="padding-left:' + L + "px;grid-template-columns:repeat(" + n + ',minmax(0,1fr))">' + list.map(function(c){
    return '<div class="am-blab"><strong>' + c.id + '</strong><span class="tiny">' + F(c.cf) + "<br>" + c.M + " g/mol</span>" +
      (showHB ? (c.hb ? '<span class="am-hb"><span class="am-hbk" aria-hidden="true"></span> ' + c.hb + " hydrogen bonds</span>" : '<span class="am-hb no">no hydrogen bonds</span>') : "") + "</div>";
  }).join("") + "</div>";
  return '<svg class="am-bsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>" + labs;
}
// @component phMeter — display-only pH gauge (0–14), acidic / neutral / basic bands in the H₃O⁺ and OH⁻ role colours, needle.
function meterSVG(v){
  var x0 = 18, x1 = 402, X = function(p){ return x0 + (x1 - x0) * p / 14; }, s = "";
  s += '<rect x="' + x0 + '" y="30" width="' + r1(X(6.5) - x0) + '" height="18" fill="var(--ab-h3o)" fill-opacity=".22"/><rect x="' + r1(X(7.5)) + '" y="30" width="' + r1(x1 - X(7.5)) + '" height="18" fill="var(--ab-oh)" fill-opacity=".22"/>';
  s += '<rect x="' + x0 + '" y="30" width="' + (x1 - x0) + '" height="18" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>';
  for (var p = 0; p <= 14; p++) s += '<line x1="' + r1(X(p)) + '" y1="48" x2="' + r1(X(p)) + '" y2="' + (p % 7 ? 53 : 57) + '" stroke="var(--ink-2)" stroke-width="1.2"/>' + (p % 7 ? "" : '<text x="' + r1(X(p)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + p + "</text>");
  s += '<text x="' + r1(X(3.2)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">acidic</text><text x="' + r1(X(10.8)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">basic</text>';
  var nx = r1(X(clamp(v, 0, 14)));
  s += '<path d="M' + nx + " 52 L" + r1(nx - 7) + " 22 L" + r1(nx + 7) + ' 22Z" fill="var(--ink)"/><text x="' + nx + '" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">pH ' + MV.chem.fx(v, 1) + "</text>";
  return '<svg class="am-msvg" viewBox="0 0 420 74" role="img" aria-label="pH meter reading ' + MV.chem.fx(v, 1) + ' (model reading)">' + s + "</svg>";
}

// ---------- hero: ammonia → primary → secondary → tertiary amine → amide ----------
function hero(){
  var host = $("#am-hx-mol"), cap = $("#am-hx-cap"), rep = $("#am-hx-replay");
  if (!host) return;
  var V = C1.view(host, { w:620, h:330, phone:0.72 });
  var FR = [
    { sp:{ a:0, g:["H", "H", "H"] }, t:"Ammonia, NH₃: three N–H bonds and one lone pair (violet dots). Dashed lines: hydrogen bonds to neighbouring molecules (faded)." },
    { sp:{ a:0, g:["me", "H", "H"] }, t:"One H swapped for CH₃: methanamine, a <strong>primary</strong> amine (one carbon group on N)." },
    { sp:{ a:0, g:["me", "me", "H"] }, t:"A second CH₃: N-methylmethanamine, a <strong>secondary</strong> amine. One N–H is left, so it still hydrogen-bonds." },
    { sp:{ a:0, g:["me", "me", "me"] }, t:"A third CH₃: N,N-dimethylmethanamine, a <strong>tertiary</strong> amine. No N–H, so the hydrogen bonds disappear." },
    { sp:{ a:0, g:["et", "H", "H"] }, t:"Back to a primary amine: ethanamine, CH₃CH₂NH₂." },
    { sp:{ a:2, g:["H", "H", "H"] }, t:"A C=O clips onto the carbon next to N: ethanamide, an <strong>amide</strong>. The lone pair is pulled toward the C=O (violet arrow), so this N is no longer a base." }];
  function sc(i){ return scene2(FR[i].sp, { ghosts:true }); }
  function aria(i){ return "Structure of " + C2.name(FR[i].sp) + ", " + MV.plain(F(condensed(FR[i].sp))) + ". " + MV.plain(FR[i].t); }
  if (MV.reduceMotion) {
    V.show(sc(5), { smax:64, aria:aria(5) });
    cap.innerHTML = "Ammonia’s hydrogens swapped for carbon groups give primary, secondary and tertiary amines; the tertiary amine has no N–H, so no hydrogen bonds. Shown: ethanamide, an <strong>amide</strong>: the C=O pulls the N’s lone pair (violet arrow), so it isn’t a base.";
    return;
  }
  var run = 0;
  function step(i, id){
    if (id !== run) return;
    cap.innerHTML = FR[i].t;
    if (i === FR.length - 1) { MV.wait(400, function(){ if (id === run) rep.hidden = false; }); return; }
    MV.wait(i === 0 ? 2400 : 2000, function(){
      if (id !== run) return;
      V.anim(sc(i), sc(i + 1), { smax:64, aria:aria(i + 1) }, 1200, function(){ V.show(sc(i + 1), { smax:64, aria:aria(i + 1) }); step(i + 1, id); });
    });
  }
  function play(){ var id = ++run; rep.hidden = true; V.show(sc(0), { smax:64, aria:aria(0) }); step(0, id); }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Nitrogen family builder ----------
var GOPT = [{ id:"H", t:"H" }, { id:"me", t:"methyl" }, { id:"et", t:"ethyl" }, { id:"pr", t:"propyl" }, { id:"ip", t:"propan-2-yl" }];
var AOPT = [{ id:"1", t:"methanoyl (HCO–)" }, { id:"2", t:"ethanoyl (CH₃CO–)" }, { id:"3", t:"propanoyl (CH₃CH₂CO–)" }];
// N-compounds for the condensation (groups go in slots 2 and 3; slot 1 is the H that leaves, or the acyl group in the product)
var AM = { ammonia:[], methanamine:["me"], ethanamine:["et"], "propan-1-amine":["pr"], "N-methylmethanamine":["me", "me"], "N-methylethanamine":["et", "me"] };
function amineSp(id){ var g = AM[id].slice(); while (g.length < 2) g.push("H"); return { a:0, g:["H"].concat(g) }; }
function prodSp(acid, id){ var g = AM[id].slice(); while (g.length < 2) g.push("H"); return { a:acid, g:["H"].concat(g) }; }
function validSp(sp){ return sp && sp.a >= 0 && sp.a <= 3 && Array.isArray(sp.g) && sp.g.length === 3 && sp.g.every(function(g){ return g in GC; }); }
function reactScene(acid, id){
  var A = C1.layout2d(acidMol(acid)), mb = molOf(amineSp(id), "n"), B = C1.layout2d(mb);
  return C1.row([A, { t:"+", id:"plus1" }, B], 0.9);
}
function prodScene(acid, id){
  var sp = prodSp(acid, id), m = molOf(sp), P = C1.decorate(C1.layout2d(m), m, {}), k = nNH(sp);
  return C1.row([P, { t:"+", id:"plus2" }, C1.water("aoh", "hoh.0", "hn." + k)], 0.9);
}
function leaveRing(acid, id){ var r = { aoh:"s", "hoh.0":"s" }; r["hn." + nNH(prodSp(acid, id))] = "s"; return r; }
function eqHTML(acid, id, done){ return F(AL[acid] + "OH") + " + " + F(condensed(amineSp(id))) + " → " + (done ? F(condensed(prodSp(acid, id))) + " + " + F("H2O") : "?"); }

function explore(host, api){
  var S = api.S, C = api.content;
  if (!validSp(S.sp)) S.sp = { a:0, g:["et", "H", "H"] };
  if (["build", "compare", "condense"].indexOf(S.mode) < 0) S.mode = "build";
  S.view = S.view === "3d" ? "3d" : "st";
  S.tape = Array.isArray(S.tape) ? S.tape : [];
  S.cmp = (Array.isArray(S.cmp) ? S.cmp : ["propane", "methoxymethane", "ethanol"]).filter(cmpById).slice(0, 5);
  if ([1, 2, 3].indexOf(S.acid) < 0) S.acid = 2;
  if (["ammonia", "methanamine", "ethanamine", "N-methylmethanamine"].indexOf(S.amine) < 0) S.amine = "methanamine";
  if (S.cdone !== S.acid + "|" + S.amine) S.cdone = null;
  var T = { busy:false }, msg = "", nfb = null, cmsg = "", hideVals = false, phOverride = null, barW = 0;
  host.innerHTML = '<p class="how am-how">' + C.how + '</p><div class="am-grid"><div class="am-left" data-mv="graph"><p class="eq-cap am-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="am-molbox"><div class="am-mol"></div><div class="am-views"></div><p class="tiny muted am-leg"></p><div class="am-ph"></div></div>' +
    '<div class="am-cmp" hidden><p class="am-sub">Boiling points (data), sorted by molar mass</p><div class="am-cwrap"><div class="am-cin"></div></div><p class="tiny muted">Bars: amines blue, amides teal, other families grey. The colour is only a guide: every bar is labelled.</p></div>' +
    '<p class="am-note" aria-live="polite"></p></div>' +
    '<div class="am-ctrl"><div class="am-modes"></div>' +
    '<div class="am-pb"><div class="am-slot" data-s="0"></div><div class="am-slot" data-s="1"></div><div class="am-slot" data-s="2"></div>' +
    '<label class="am-acyl"><input type="checkbox" role="switch" class="am-acin"> Put a C=O on the first carbon group</label><p class="am-msg" aria-live="polite"></p>' +
    '<div class="am-name"><p class="am-sub">Name it</p><div class="am-chips"></div><div class="q-actions"><button type="button" class="btn primary sm" data-nm="check" data-k="nmchk">Check name</button></div><div class="am-nfb" aria-live="polite"></div></div></div>' +
    '<div class="am-pc" hidden><p class="am-sub">Tap up to 5 compounds</p><div class="am-cchips"></div><p class="am-cmsg tiny" aria-live="polite"></p></div>' +
    '<div class="am-pd" hidden><div class="am-acid"></div><div class="am-amine"></div><div class="q-actions"><button type="button" class="btn primary" data-cd="go" data-k="cdgo">Condense</button><button type="button" class="btn ghost sm" data-cd="back" data-k="cdback">Show the reactants</button></div><p class="tiny muted">' + C.condenseNote + "</p></div></div>" +
    '<div class="am-right"><dl class="read am-read" aria-live="polite"></dl><div class="am-tab"></div></div></div>';
  var V = C1.view($(".am-mol", host), { w:640, h:360, rotate:true });
  var modeRG = radios($(".am-modes", host), { label:"Mode", aria:"Builder mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var viewRG = radios($(".am-views", host), { label:"View", aria:"Structure view", options:[{ id:"st", t:"Structure (2D)" }, { id:"3d", t:"3D model" }], value:S.view, onChange:function(v){ S.view = v; api.save(); paint(); } });
  var acidRG = radios($(".am-acid", host), { label:"Acid", cls:"chips", options:[1, 2, 3].map(function(n){ return { id:String(n), t:ACIDN[n] }; }), value:String(S.acid), onChange:function(v){ S.acid = +v; S.cdone = null; api.save(); paint(); } });
  var amineRG = radios($(".am-amine", host), { label:"N-compound", cls:"chips", options:["ammonia", "methanamine", "ethanamine", "N-methylmethanamine"].map(function(id){ return { id:id, t:id }; }), value:S.amine, onChange:function(v){ S.amine = v; S.cdone = null; api.save(); paint(); } });
  var slotRG = [null, null, null], acin = $(".am-acin", host);
  function slotHost(k){ var h = $('.am-slot[data-s="' + k + '"]', host); h.innerHTML = ""; var d = document.createElement("div"); h.appendChild(d); return d; }
  function makeSlot(k){
    var ac = k === 0 && S.sp.a > 0;
    slotRG[k] = radios(slotHost(k), { label:"Group " + (k + 1) + " on N" + (ac ? " (with the C=O)" : ""), aria:"Group " + (k + 1) + " on the nitrogen", cls:"chips", options:ac ? AOPT : GOPT,
      value:ac ? String(S.sp.a) : S.sp.g[k], onChange:function(v){ var sp = cp(S.sp); if (ac) sp.a = +v; else sp.g[k] = v; setSp(sp, ""); } });
  }
  [0, 1, 2].forEach(makeSlot);
  acin.checked = S.sp.a > 0;
  acin.addEventListener("change", function(){
    if (T.busy) { acin.checked = S.sp.a > 0; return; }
    var sp = cp(S.sp), note;
    if (acin.checked) { sp.a = clamp(GC[sp.g[0]] || 1, 1, 3); note = "C=O on: group 1 is now " + AOPT[sp.a - 1].t + ", and the molecule is an amide."; }
    else { sp.g[0] = ["", "me", "et", "pr"][sp.a]; sp.a = 0; note = "C=O off: group 1 is " + GN[sp.g[0]] + " again, and the molecule is an amine."; }
    setSp(sp, note); makeSlot(0);
  });
  var chips = C2.chips($(".am-chips", host), { get:function(){ return S.tape; }, set:function(tk){ S.tape = tk; nfb = null; api.save(); paintRead(); paintNfb(); MV.changed(); }, locked:function(){ return T.busy; } });
  // data table (course table additions from this module, plus propane and butane from the course table)
  (function(){
    var names = ["ammonia", "methanamine"].concat(CMP.map(function(c){ return c.id; }));
    var rows = names.map(function(nm){ var c = cmpById(nm), sp = nm === "ammonia" ? { a:0, g:["H", "H", "H"] } : nm === "methanamine" ? { a:0, g:["me", "H", "H"] } : null;
      var f = c ? c.f : fOf(sp), cf = c ? c.cf : condensed(sp), M = c ? c.M : (nm === "ammonia" ? Math.round(MM.N + 3 * MM.H) : Math.round(molar(f)));
      return [nm, F(cf), String(M), MV.chem.fx(bpOf(nm), 0) + (SOLID[nm] ? " (" + SOLID[nm] + ")" : "")]; });
    var d = document.createElement("details"); d.className = "chem-tab";
    d.innerHTML = "<summary>Data table: boiling points</summary>" + MV.tableHTML({ head:["Compound", "Formula", "<i>M</i> (g/mol)", "Boiling point (°C)"], rows:rows, caption:"Boiling points of amines, amides and compounds of similar molar mass" }) +
      '<p class="tiny muted" style="margin:8px 0 0">Data: rounded literature values. Molar masses from the course table, rounded.</p>';
    $(".am-tab", host).appendChild(d);
  })();

  function setSp(sp, note){ S.sp = sp; msg = note || ""; nfb = null; api.save(); paint(); }
  function setMode(v){ S.mode = v; modeRG.set(v); msg = ""; cmsg = ""; api.save(); paint(); }
  function key(){ return S.acid + "|" + S.amine; }
  function nameHidden(){ return S.tape.length > 0 && C2.compose(S.tape) !== C2.name(S.sp); }

  // ---------- painting ----------
  function paintView(){
    var md = S.mode;
    if (md === "build") {
      var nm = C2.name(S.sp), ft = MV.plain(F(condensed(S.sp)));
      if (S.view === "3d") V.show(C1.scene3(molOf(S.sp)), { aria:"3D ball-and-stick model of " + (nameHidden() ? "your molecule" : nm) + ", " + ft + ". Violet dots: the lone pair on N." });
      else V.show(scene2(S.sp, { ghosts:true }), { smax:60, aria:"Structure of " + (nameHidden() ? "your molecule" : nm) + ", " + ft + ". " + (nNH(S.sp) ? "Its N–H bonds hydrogen-bond to faded neighbouring molecules (dashed lines)." : "No N–H, so no hydrogen bonds to its neighbours.") + (S.sp.a ? " A violet arrow shows the lone pair pulled toward the C=O." : " Violet dots: the lone pair on N.") });
    } else if (md === "condense") {
      var done = S.cdone === key();
      V.show(done ? prodScene(S.acid, S.amine) : reactScene(S.acid, S.amine), { smax:58, ring:done ? null : leaveRing(S.acid, S.amine),
        aria:done ? "Product: " + C2.name(prodSp(S.acid, S.amine)) + " and water." : "Reactants: " + ACIDN[S.acid] + " and " + S.amine + ". The –OH of the acid and one H on the N are ringed: they will leave as water." });
    }
  }
  function paintPH(v){
    var r = phOf(S.sp), val = v == null ? r.v : v;
    $(".am-ph", host).innerHTML = '<p class="am-sub">pH meter: 0.10 mol/L in water · <strong>pH ' + (v == null ? r.t : "about " + MV.chem.fx(val, 1) + " (model reading)") + "</strong></p>" + meterSVG(val);
  }
  function paintBars(vals, showHB){
    var box = $(".am-cin", host), W = Math.max(460, Math.round($(".am-cwrap", host).getBoundingClientRect().width) || 600), list = S.cmp.map(cmpById).sort(function(a, b){ return (a.M - b.M) || (a.ord - b.ord); });
    barW = W; box.style.width = W + "px";
    box.innerHTML = list.length ? barsHTML(list, W, vals || (hideVals ? list.map(function(){ return null; }) : null), showHB == null ? !hideVals : showHB) : '<p class="muted">Tap compounds to compare their boiling points.</p>';
  }
  function paintCmpChips(){
    var html = FAMS.map(function(f){
      return '<div class="am-crow" role="group" aria-label="' + f[1] + '"><span class="c2-lab">' + f[1] + "</span>" + CMP.filter(function(c){ return c.fam === f[0]; }).map(function(c){
        var on = S.cmp.indexOf(c.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cm="' + c.id + '" data-k="cm' + c.id + '"' + (T.busy ? " disabled" : "") + ">" + c.id + "</button>";
      }).join("") + "</div>";
    }).join("");
    MV.keepFocus($(".am-cchips", host), function(){ $(".am-cchips", host).innerHTML = html; });
    $(".am-cmsg", host).textContent = cmsg;
  }
  function paintRead(){
    var md = S.mode, el = $(".am-read", host);
    if (md === "compare") { el.innerHTML = MV.readoutHTML([["Compare mode", "The bars show the data table values for the compounds you choose. Same molar mass, very different boiling points: look at the N–H bonds and the C=O."]]); return; }
    if (md === "condense") {
      var done = S.cdone === key();
      el.innerHTML = done ? readRows(prodSp(S.acid, S.amine), { first:["Showing", "the amide formed"] }) : readRows(amineSp(S.amine), { first:["Showing", "the N-compound (press Condense to make the amide)"] });
      return;
    }
    el.innerHTML = readRows(S.sp, { hideName:nameHidden() });
  }
  function paintNfb(){ $(".am-nfb", host).innerHTML = nfb ? MV.fbHTML(nfb.ok ? "good" : "bad", nfb.html) : ""; }
  function paintCtrl(){
    var b = T.busy;
    modeRG.lock(b); viewRG.lock(b); acidRG.lock(b); amineRG.lock(b); slotRG.forEach(function(r){ r.lock(b); });
    acin.disabled = b; acin.checked = S.sp.a > 0;
    $$(".am-ctrl [data-nm], .am-ctrl [data-cd]", host).forEach(function(x){ x.disabled = b; });
    var done = S.cdone === key(); $('[data-cd="go"]', host).disabled = b || done; $('[data-cd="back"]', host).disabled = b || !done;
    chips.paint();
  }
  function paint(){
    var md = S.mode;
    $(".am-molbox", host).hidden = md === "compare"; $(".am-cmp", host).hidden = md !== "compare";
    $(".am-pb", host).hidden = md !== "build"; $(".am-pc", host).hidden = md !== "compare"; $(".am-pd", host).hidden = md !== "condense";
    $(".am-views", host).hidden = md !== "build"; $(".am-ph", host).hidden = md !== "build";
    slotRG.forEach(function(r, k){ r.set(k === 0 && S.sp.a ? String(S.sp.a) : S.sp.g[k]); });
    var cap = $(".am-cap", host);
    if (md === "build") cap.innerHTML = F(condensed(S.sp)) + ' <span class="am-capf">' + F(fTextOf(S.sp)) + "</span>";
    else if (md === "compare") cap.innerHTML = "Boiling point vs molar mass";
    else cap.innerHTML = eqHTML(S.acid, S.amine, S.cdone === key());
    $(".am-leg", host).innerHTML = md === "build" ? (S.view === "3d" ? "3D model: C dark, N blue, O magenta, H white; violet dots: the N’s lone pair (amines)." : "Violet dots: the N’s lone pair. Faded atoms: neighbouring molecules. Dashed lines: hydrogen bonds.") : md === "condense" ? "Ringed: the –OH of the acid and one H on the N. They leave together as H₂O, and a C–N bond forms." : "";
    if (md !== "compare") paintView();
    if (md === "build") paintPH(phOverride);
    if (md === "compare") { paintBars(); paintCmpChips(); }
    $(".am-msg", host).textContent = msg;
    $(".am-note", host).innerHTML = md === "condense" && S.cdone === key() ? "One C–N bond formed and one H₂O left: a <strong>condensation</strong>." : "";
    paintRead(); paintNfb(); paintCtrl();
    MV.changed();
  }
  if (window.ResizeObserver) new ResizeObserver(function(){ if (T.busy || S.mode !== "compare") return; var w = Math.max(460, Math.round($(".am-cwrap", host).getBoundingClientRect().width)); if (w && Math.abs(w - barW) > 4) paintBars(); }).observe($(".am-cwrap", host));

  // ---------- events ----------
  $(".am-name", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-nm]"); if (!b || b.disabled) return;
    var j = C2.judge(S.tape, S.sp);
    nfb = j.ok ? { ok:true, html:"<strong>✓ Correct: " + C2.name(S.sp) + ".</strong>" } : { ok:false, html:"<strong>✗ Not quite.</strong> " + j.msg };
    paintNfb(); paintRead(); MV.focusFb($(".am-name", host));
  });
  $(".am-cchips", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-cm]"); if (!b || b.disabled || T.busy) return;
    var id = b.dataset.cm, i = S.cmp.indexOf(id);
    if (i >= 0) { S.cmp.splice(i, 1); cmsg = ""; }
    else if (S.cmp.length >= 5) cmsg = "Up to 5 at a time: tap a chosen compound to remove it first.";
    else { S.cmp.push(id); cmsg = ""; }
    hideVals = false; api.save(); paint();
  });
  $(".am-pd", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-cd]"); if (!b || b.disabled || T.busy) return;
    if (b.dataset.cd === "back") { S.cdone = null; api.save(); paint(); return; }
    condense(null);
  });
  function condense(cb){
    var k = key(), acid = S.acid, am = S.amine;
    T.busy = true; paintCtrl();
    $(".am-cap", host).innerHTML = eqHTML(acid, am, false);
    V.show(reactScene(acid, am), { smax:58, ring:leaveRing(acid, am), aria:"Reactants: the ringed –OH and N–H hydrogen are about to leave as water." });
    MV.wait(700, function(){
      V.anim(reactScene(acid, am), prodScene(acid, am), { smax:58, sameFit:true, aria:"Condensation: " + ACIDN[acid] + " and " + am + " give " + C2.name(prodSp(acid, am)) + " and water." }, 1800, function(){
        T.busy = false; S.cdone = k; api.save(); paint(); if (cb) MV.wait(200, cb);
      });
    });
  }

  // ---------- predictions ----------
  var PRED = { p1:["propan-1-amine", "N,N-dimethylmethanamine"], p2:["ethanamine", "ethanol"], p4:["ethanamide", "propan-1-amine"] };
  var hooks = {
    start:function(p){
      T.busy = false; phOverride = null; msg = ""; cmsg = "";
      if (p.id === "p3") { hideVals = false; S.view = "st"; viewRG.set("st"); S.sp = { a:0, g:["me", "H", "H"] }; makeSlot(0); setMode("build"); }
      else { S.cmp = PRED[p.id].slice(); hideVals = true; setMode("compare"); }
    },
    run:function(p, done){
      T.busy = true; paintCtrl();
      if (p.id === "p3") {
        var sp1 = { a:1, g:["me", "H", "H"] }, ph0 = phOf(S.sp).v, ph1 = phOf(sp1).v;
        V.anim(scene2(S.sp, { ghosts:true }), scene2(sp1, { ghosts:true }), { smax:60, aria:"The C=O is switched on: methanamine becomes methanamide." }, 1300, function(){
          S.sp = sp1; api.save(); makeSlot(0); paintCtrl();
          $(".am-cap", host).innerHTML = F(condensed(sp1)) + ' <span class="am-capf">' + F(fTextOf(sp1)) + "</span>"; paintRead();
          MV.tween({ dur:1400, step:function(t){ phOverride = ph0 + (ph1 - ph0) * t; paintPH(phOverride); }, done:function(){ phOverride = null; T.busy = false; paint(); MV.wait(150, done); } });
        });
        return;
      }
      var list = S.cmp.map(cmpById).sort(function(a, b){ return (a.M - b.M) || (a.ord - b.ord); }), vals = list.map(function(c){ return c.bp; });
      MV.tween({ dur:1500, step:function(t){ paintBars(vals.map(function(v){ return v * t; }), false); }, done:function(){ hideVals = false; T.busy = false; paint(); MV.wait(150, done); } });
    }
  };

  // ---------- challenges ----------
  function chal(id){
    var sp = S.sp, nm = C2.name(sp), I = info(sp);
    if (id === "tc1") {
      if (nm === "N-methylethanamine") return { ok:true };
      if (nm === "propan-2-amine") return { ok:false, msg:"One carbon on N: primary. For amines, count carbons on the nitrogen." };
      if (nm === "N,N-dimethylmethanamine") return { ok:false, msg:"Three carbons on N: tertiary." };
      if (nm === "propan-1-amine") return { ok:false, msg:"Primary." };
      if (sp.a) return { ok:false, msg:"That’s an amide (C=O next to the N). Switch the C=O off: you need an amine." };
      if (onN(sp) === 2) return { ok:false, msg:"Secondary, yes, but its molar mass is " + I.M + " g/mol. You need 59 g/mol (C₃H₉N): three carbons in all." };
      return { ok:false, msg:"That’s " + nm + ", " + (onN(sp) ? "a " + I.cls : "ammonia") + " (" + I.M + " g/mol). You need a secondary amine of 59 g/mol." };
    }
    if (id === "tc2") {
      if (!sp.a) return { ok:false, msg:"That’s an amine. Switch on the C=O to make an amide first." };
      var nh = nNH(sp);
      if (nh === 1) return { ok:false, msg:"One N–H is enough for hydrogen bonding." };
      if (nh === 2) return { ok:false, msg:"Two N–H bonds: its molecules hydrogen-bond. Replace both H’s on N." };
      if (!S.tape.length) return { ok:false, msg:"No N–H: good. Now name it with the name chips under the builder." };
      var j = C2.judge(S.tape, sp);
      return j.ok ? { ok:true } : { ok:false, msg:"The structure works (no N–H), but the name isn’t right yet. " + j.msg };
    }
    if (id === "tc3") {
      if (S.cdone !== key()) return { ok:false, msg:"In Condense mode, choose an acid and an N-compound, then press Condense." };
      var p = prodSp(S.acid, S.amine), c = nCarb(p);
      if (c === 3 && nNH(p) >= 1) return { ok:true };
      if (c === 3) return { ok:false, msg:"Right mass, but no N–H left." };
      if (c === 2) return { ok:false, msg:"Two carbons in total; you need three." };
      return { ok:false, msg:(c === 1 ? "One carbon" : c === 4 ? "Four carbons" : c + " carbons") + " in total (" + Math.round(molar(fOf(p))) + " g/mol); you need three." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Amides everywhere ----------
// Peptide station molecules: amino acid u (1, 2, 3) with keys n<u>, c<u>a (α carbon), c<u> (C=O carbon), o<u>, oh<u>, c<u>m (Ala CH₃)
var UNITS = [null, "gly", "ala", "gly"];
function peptide(n, extra){ // first n units joined; extra = index of a separate unit drawn as its own molecule (returned in .sep)
  function unit(u, a, b){
    var base = a.length;
    a.push({ el:"N", key:"n" + u }, { el:"C", key:"c" + u + "a" }, { el:"C", key:"c" + u }, { el:"O", key:"o" + u }, { el:"O", key:"oh" + u });
    b.push([base, base + 1, 1], [base + 1, base + 2, 1], [base + 2, base + 3, 2], [base + 2, base + 4, 1]);
    if (UNITS[u] === "ala") { a.push({ el:"C", key:"c" + u + "m" }); b.push([base + 1, a.length - 1, 1]); }
  }
  var a = [], b = [];
  for (var u = 1; u <= n; u++) unit(u, a, b);
  for (u = 1; u < n; u++) {
    var oh = a.map(function(x){ return x.key; }).indexOf("oh" + u), cc = a.map(function(x){ return x.key; }).indexOf("c" + u), nn = a.map(function(x){ return x.key; }).indexOf("n" + (u + 1));
    b = b.filter(function(x){ return x[0] !== oh && x[1] !== oh; }).map(function(x){ return [x[0] > oh ? x[0] - 1 : x[0], x[1] > oh ? x[1] - 1 : x[1], x[2]]; });
    a.splice(oh, 1); if (cc > oh) cc--; if (nn > oh) nn--;
    b.push([cc, nn, 1]);
  }
  var m = { a:a, b:b }; m.main = C1.mainPath(m, "n1"); return m;
}
function single(u){ var a = [], b = [], m;
  a.push({ el:"N", key:"n" + u }, { el:"C", key:"c" + u + "a" }, { el:"C", key:"c" + u }, { el:"O", key:"o" + u }, { el:"O", key:"oh" + u });
  b.push([0, 1, 1], [1, 2, 1], [2, 3, 2], [2, 4, 1]);
  if (UNITS[u] === "ala") { a.push({ el:"C", key:"c" + u + "m" }); b.push([1, 5, 1]); }
  m = { a:a, b:b }; m.main = C1.mainPath(m, "n" + u); return m;
}
function noLP(sc){
  var keep = [], map = {};
  sc.atoms.forEach(function(a, k){ if (a.el !== "LP") { map[k] = keep.length; keep.push(a); } });
  return { atoms:keep, bonds:sc.bonds.filter(function(b){ return b.a in map && b.b in map; }).map(function(b){ return { a:map[b.a], b:map[b.b], o:b.o }; }), view:"st" };
}
function pepScene(stage){ // 0: Gly + Ala; 1: Gly-Ala (+ water 1); 2: Gly-Ala + Gly (+ water 1); 3: Gly-Ala-Gly (+ waters 1, 2)
  var parts = stage === 0 ? [noLP(C1.layout2d(single(1))), { t:"+", id:"pp1" }, noLP(C1.layout2d(single(2)))] :
    stage === 1 ? [noLP(C1.layout2d(peptide(2)))] : stage === 2 ? [noLP(C1.layout2d(peptide(2))), { t:"+", id:"pp2" }, noLP(C1.layout2d(single(3)))] : [noLP(C1.layout2d(peptide(3)))];
  var sc = C1.row(parts, 0.9), b = C1.bbox(sc), nw = stage === 0 ? 0 : stage === 3 ? 2 : 1, ws = [sc];
  for (var k = 1; k <= nw; k++) ws.push(C1.shift(C1.water("aoh" + k, "hoh" + k + ".0", "hn" + (k + 1) + ".1"), b.x0 + 1.6 + (k - 1) * 2.2, b.y1 + 1.5));
  if (nw) ws.push({ atoms:[{ id:"wlab", el:"TXT", t:"released:", w:0.6, x:b.x0 + 0.1, y:b.y1 + 1.5, i:-1 }], bonds:[] });
  return C1.combine(ws);
}
function resonanceSVG(){
  var N = "var(--at-n)", O = "var(--at-o)", I = "var(--ink)", H = "var(--ink-2)", E = "var(--e-pair)";
  function t(x, y, s, c, w){ return '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="24" font-weight="' + (w || 400) + '" fill="' + c + '">' + s + "</text>"; }
  function l(x1, y1, x2, y2, c){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || I) + '" stroke-width="2.4" stroke-linecap="round"/>'; }
  var s = "";
  // left: C=O, C–N with a lone pair
  s += t(110, 112, "C", I) + t(110, 40, "O", O, 700) + t(180, 112, "N", N, 700) + t(180, 172, "H", H);
  s += l(105, 58, 105, 96) + l(115, 58, 115, 96) + l(124, 112, 166, 112) + l(180, 126, 180, 158) + l(60, 112, 96, 112) + l(194, 112, 232, 112);
  s += '<circle cx="173" cy="90" r="3.4" fill="' + E + '"/><circle cx="187" cy="90" r="3.4" fill="' + E + '"/>';
  s += '<path d="M180 82 Q168 64 148 104" fill="none" stroke="' + E + '" stroke-width="2"/><path d="M148 104 L146 92 L156 97Z" fill="' + E + '"/>';
  s += '<path d="M118 78 Q140 60 124 40" fill="none" stroke="' + E + '" stroke-width="2"/><path d="M124 40 L122 51 L132 46Z" fill="' + E + '"/>';
  s += t(290, 112, "⟷", I, 700);
  // right: C–O⁻, C=N⁺
  s += t(400, 112, "C", I) + t(400, 40, "O⁻", O, 700) + t(470, 112, "N⁺", N, 700) + t(470, 172, "H", H);
  s += l(400, 58, 400, 96) + l(414, 107, 456, 107) + l(414, 117, 456, 117) + l(470, 126, 470, 158) + l(350, 112, 386, 112) + l(488, 112, 522, 112);
  s += '<text x="150" y="206" text-anchor="middle" font-size="14" fill="' + H + '">lone pair on N, C=O</text><text x="440" y="206" text-anchor="middle" font-size="14" fill="' + H + '">C–O⁻ and C=N⁺</text>';
  return '<svg class="am-rsvg" viewBox="0 0 560 220" role="img" aria-label="Resonance in the amide group: on the left, C double-bonded to O and a lone pair on N; curved arrows move the lone pair into the C–N bond and the C=O pi electrons onto O; on the right, C–O minus and C double-bonded to N plus.">' + s + "</svg>";
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, D = C.data;
  S.pj = clamp(S.pj | 0, 0, 2); S.ny = clamp(S.ny | 0, 0, 6); if (!s3.mols.some(function(x){ return x.id === S.gm; })) S.gm = s3.mols[0].id; S.found = S.found || {};
  var busy = false, gmsg = "";
  host.innerHTML = '<div class="part am-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="am-pscroll"><div class="am-pmol"></div></div><p class="am-pcap" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn primary" data-pj="join" data-k="pjjoin">Join</button><button type="button" class="btn ghost sm" data-pj="reset" data-k="pjreset">Start again</button></div><p class="am-count am-pjc" aria-live="polite"></p>' +
    '<details class="alg am-zoom"><summary>Zoom to the particles</summary><p>' + s1.zoom + "</p>" + resonanceSVG() + "</details></div>" +
    '<div class="part am-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="am-ny" aria-live="polite"></div><p class="tiny muted">■ and ● stand for carbon chains. Highlighted: the amide links.</p>' +
    '<div class="q-actions"><button type="button" class="btn primary" data-ny="join" data-k="nyjoin">Join</button><button type="button" class="btn ghost sm" data-ny="reset" data-k="nyreset">Start again</button></div><p class="am-count am-nyc" aria-live="polite"></p><p class="banner am-nyb" aria-live="polite"></p></div>' +
    '<div class="part am-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="am-gpick"></div><div class="am-gform" role="group" aria-label="Parts of the formula"></div><p class="am-gmsg" aria-live="polite"></p><ul class="am-glist"></ul><p class="am-count am-gc" aria-live="polite"></p>' +
    '<details class="alg"><summary>' + D.title + "</summary>" + MV.tableHTML({ head:D.head, rows:D.rows, caption:"Acetaminophen: properties and structure" }) + '<p class="tiny muted" style="margin:8px 0 0">' + D.note + "</p></details></div>";
  var V1 = C1.view($(".am-pmol", host), { w:720, h:300, phone:0.62 });
  var PJ = [
    "Glycine (left) and alanine (right). The ringed –OH and H will leave as water.",
    "A dipeptide: one –CO–NH– (peptide) link, one water released. Another glycine is ready: press Join again.",
    "A tripeptide: two peptide links, two waters released. Proteins are long chains of these amide links."];
  var RING = [{ aoh1:"s", "hoh1.0":"s", "hn2.1":"s" }, { aoh2:"s", "hoh2.0":"s", "hn3.1":"s" }, null];
  function restScene(){ return pepScene(S.pj === 0 ? 0 : S.pj === 1 ? 2 : 3); }
  function paint1(){
    if (!busy) V1.show(restScene(), { smax:52, ring:RING[S.pj], aria:["Glycine and alanine side by side.", "Dipeptide glycylalanine with one water released, and a glycine molecule next to it.", "Tripeptide with two peptide links and two waters released."][S.pj] });
    $(".am-pcap", host).textContent = PJ[S.pj];
    $(".am-pjc", host).textContent = "Links: " + S.pj + " · Water released: " + S.pj;
    $('[data-pj="join"]', host).disabled = busy || S.pj >= 2; $('[data-pj="reset"]', host).disabled = busy || !S.pj;
  }
  function join(){
    busy = true; paint1();
    var st = S.pj;
    if (st === 0) V1.anim(pepScene(0), pepScene(1), { smax:52, aria:"Glycine and alanine join; water leaves." }, 1800, function(){
      V1.anim(pepScene(1), pepScene(2), { smax:52, aria:"Another glycine arrives." }, 600, function(){ busy = false; S.pj = 1; api.save(); paint1(); }); });
    else V1.anim(pepScene(2), pepScene(3), { smax:52, aria:"The dipeptide and glycine join; a second water leaves." }, 1800, function(){ busy = false; S.pj = 2; api.save(); paint1(); });
  }
  // nylon preview
  function paint2(){
    var n = S.ny, h = '<span class="am-u">HOOC–■</span>';
    for (var i = 1; i <= n; i++) h += (i % 2 ? '<span class="am-lk">–CO–NH–</span><span class="am-u">●</span>' : '<span class="am-lk">–NH–CO–</span><span class="am-u">■</span>');
    h += '<span class="am-u">' + (n % 2 ? "–NH₂" : "–COOH") + '</span><span class="am-next">+ ' + (n % 2 ? "HOOC–■–COOH" : "H₂N–●–NH₂") + "</span>";
    $(".am-ny", host).innerHTML = '<p class="am-chain">' + h + "</p>";
    $(".am-nyc", host).textContent = "Amide links: " + n + " · Water released: " + n + (n >= 6 ? " · That’s enough to see the pattern." : "");
    $(".am-nyb", host).textContent = n ? s2.banner : "";
    $('[data-ny="join"]', host).disabled = n >= 6; $('[data-ny="reset"]', host).disabled = !n;
  }
  // group finder
  var gRG = radios($(".am-gpick", host), { label:"Molecule", cls:"chips", options:s3.mols.map(function(x){ return { id:x.id, t:x.name + " (" + x.use + ")" }; }), value:S.gm, onChange:function(v){ S.gm = v; gmsg = ""; api.save(); paint3(); } });
  void gRG;
  function mol3(){ return s3.mols.filter(function(x){ return x.id === S.gm; })[0]; }
  function paint3(){
    var M = mol3(), f = S.found[M.id] || (S.found[M.id] = {}), groups = M.segs.filter(function(g){ return g.g; }), nf = groups.filter(function(g, i){ return f[M.segs.indexOf(g)]; }).length;
    MV.keepFocus($(".am-gform", host), function(){ $(".am-gform", host).innerHTML = M.segs.map(function(g, i){ var on = !!f[i]; return '<button type="button" class="am-seg' + (on ? (g.g ? " on" : " bk") : "") + '" aria-pressed="' + on + '" data-sg="' + i + '" data-k="sg' + M.id + i + '" aria-label="' + esc(g.t + (on ? ": " + (g.g ? MV.plain(g.n || s3.groups[g.g]) : "carbon backbone") : "")) + '">' + g.t + "</button>"; }).join(""); });
    $(".am-glist", host).innerHTML = M.segs.map(function(g, i){ return g.g && f[i] ? "<li><strong>" + g.t + "</strong>: " + (g.n || s3.groups[g.g]) + "</li>" : ""; }).join("");
    $(".am-gmsg", host).innerHTML = gmsg;
    $(".am-gc", host).innerHTML = "Groups found: " + nf + " of " + groups.length + (nf === groups.length ? ". " + M.done : "");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pj) { if (busy) return; if (b.dataset.pj === "reset") { S.pj = 0; api.save(); paint1(); } else join(); return; }
    if (b.dataset.ny) { S.ny = b.dataset.ny === "reset" ? 0 : Math.min(6, S.ny + 1); api.save(); paint2(); return; }
    if (b.dataset.sg != null) {
      var M = mol3(), i = +b.dataset.sg, g = M.segs[i]; S.found[M.id][i] = true;
      gmsg = g.g ? "<strong>" + g.t + "</strong>: " + (g.n || s3.groups[g.g]) + "." : "<strong>" + g.t + "</strong>: " + s3.backbone;
      api.save(); paint3();
    }
  });
  paint1(); paint2(); paint3();
}

// ---------- Practice 1: Classify and name (tap-to-sort into 4 boxes, then pick the name) ----------
function classifyAct(host, api, a){
  var S = api.S; ["placed", "tries", "hint", "nm"].forEach(function(k){ S[k] = S[k] || {}; });
  var sel = null, msg = null, nmsg = {}, ORD = {};
  a.items.forEach(function(it){ ORD[it.id] = MV.shuffle(it.names.map(function(_, i){ return i; }), MV.meta.id + it.id); });
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function nst(id){ return S.nm[id] || (S.nm[id] = { pick:null, tries:0, ok:false }); }
  function bad(it){ return (S.tries[it.id] || 0) > 0 || (S.hint[it.id] || 0) >= 3 || nst(it.id).tries > 0; }
  function boxOf(id){ return a.boxes.filter(function(b){ return b.id === id; })[0]; }
  function nameRow(it){
    var x = nst(it.id), lvl = S.hint[it.id] || 0, h = '<div class="am-nrow" data-nr="' + it.id + '"><p class="am-nt"><strong>' + it.t + "</strong> · " + boxOf(S.placed[it.id]).label + (x.ok ? " · ✓ named" : "") + "</p>";
    h += '<div class="chips am-nchips" role="group" aria-label="' + esc("Names for " + MV.plain(it.t)) + '">' + ORD[it.id].map(function(i){ var o = it.names[i], on = x.pick === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-nm="' + i + '" data-k="' + it.id + "n" + i + '"' + (x.ok ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.ok) h += '<div class="q-actions">' + MV.hintBtn(it.id + "nh", lvl) + "</div>" + MV.hintsHTML(it.hints, lvl);
    if (nmsg[it.id]) h += MV.fbHTML(nmsg[it.id].good ? "good" : "bad", nmsg[it.id].html);
    return h + "</div>";
  }
  function paint(){
    var unplaced = a.items.filter(function(it){ return !S.placed[it.id]; }), placed = a.items.filter(function(it){ return S.placed[it.id]; });
    var h = '<p class="how">' + a.how + "</p>";
    h += '<div class="tray" role="group" aria-label="Compounds to sort">' + (unplaced.length ? unplaced.map(function(it){ return '<button type="button" class="tile txt" aria-pressed="' + (sel === it.id) + '" data-k="t' + it.id + '" data-item="' + it.id + '">' + it.t + "</button>"; }).join("") : '<p class="sort-done">All sorted. Now name each one below.</p>') + "</div>";
    if (sel) { var it = item(sel), lvl = S.hint[sel] || 0; h += '<div class="sel-bar"><span>Selected: ' + it.t + "</span>" + MV.hintBtn("selhint", lvl) + "</div>" + MV.hintsHTML(it.hints, lvl); }
    if (msg) h += MV.fbHTML(msg.type, msg.html);
    h += '<div class="bins">' + a.boxes.map(function(b){
      var inside = a.items.filter(function(x){ return S.placed[x.id] === b.id; });
      return '<button type="button" class="bin' + (sel ? " ready" : "") + '" data-k="b' + b.id + '" data-bin="' + b.id + '"><span class="bin-head"><span><strong>' + b.label + '</strong></span></span><span class="bin-items">' + inside.map(function(x){ return '<span class="chip-in txt">' + x.t + (nst(x.id).ok ? " ✓" : "") + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    if (placed.length) h += '<div class="am-names"><h4 class="am-h4">Name each compound</h4>' + placed.map(nameRow).join("") + "</div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.item) { sel = sel === b.dataset.item ? null : b.dataset.item; msg = null; paint(); return; }
    if (b.dataset.act === "hint") {
      var row = b.closest("[data-nr]"), id = row ? row.dataset.nr : sel; if (!id) return;
      S.hint[id] = Math.min(3, (S.hint[id] || 0) + 1); api.save(); paint(); return;
    }
    if (b.dataset.bin) {
      if (!sel) { msg = { type:"", html:"Tap a compound first, then tap the box it belongs in." }; paint(); return; }
      var it = item(sel), ans = MV.ans(it);
      if (b.dataset.bin === ans) { S.placed[it.id] = ans; msg = { type:"good", html:"<strong>✓ " + it.t + "</strong>: " + it.why + " Now pick its name below." }; sel = null; api.save(); paint(); MV.focusFb(host); }
      else { S.tries[it.id] = (S.tries[it.id] || 0) + 1; var w = (it.wrong && it.wrong[b.dataset.bin]) || a.wrongDefault; msg = { type:"bad", html:"<strong>✗ Not that box.</strong> " + w + " Try another box." }; api.save(); paint(); }
      return;
    }
    if (b.dataset.nm != null) {
      var r = b.closest("[data-nr]"), it2 = item(r.dataset.nr), x = nst(it2.id), o = it2.names[+b.dataset.nm];
      x.pick = +b.dataset.nm;
      if (MV.ok(o)) { x.ok = true; nmsg[it2.id] = { good:true, html:"<strong>✓ " + o.t + ".</strong> " + o.why }; }
      else { x.tries++; nmsg[it2.id] = { good:false, html:"<strong>✗ Not quite.</strong> " + o.why + " Try another name." }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-nr="' + it2.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var ok = S.placed[it.id] && nst(it.id).ok; if (ok) d++; if (ok && !bad(it)) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ if (bad(it)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: Property puzzles (order 4 compounds, or choose 1 of 4) ----------
function puzzleAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { seq:[], pick:null, tries:0, hint:0, solved:false, first:null }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-pz="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "order") {
      var ans = x.solved ? MV.ans(it) : null, seq = x.solved ? ans : x.seq;
      if (!x.solved) h += '<p class="tiny muted am-ordhow">Tap the compounds from lowest to highest boiling point.</p><div class="chips" role="group" aria-label="Compounds to order">' + it.tiles.map(function(t, k){ var used = seq.indexOf(k) >= 0; return '<button type="button" class="chip" data-tl="' + k + '" data-k="' + it.id + "t" + k + '"' + (used ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</div>";
      h += '<ol class="am-seq" aria-label="Your order, lowest boiling point first">' + it.tiles.map(function(_, k){ var t = seq[k]; return '<li class="' + (t == null ? "empty" : "") + '">' + (t == null ? '<span class="muted">' + (k ? "" : "lowest") + (k === it.tiles.length - 1 ? "highest" : "") + "</span>" : it.tiles[t]) + "</li>"; }).join("") + "</ol>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-sq="undo" data-k="' + it.id + 'undo"' + (seq.length ? "" : " disabled") + '>⌫ Undo</button><button type="button" class="btn ghost sm" data-sq="clear" data-k="' + it.id + 'clr"' + (seq.length ? "" : " disabled") + ">Clear</button></div>";
    } else {
      h += '<div class="chips am-pchips" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>";
    h += MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.kind === "order" ? it.why : it.options[x.pick].why) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pz]"); if (!box) return;
    var it = item(box.dataset.pz), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.tl != null) { x.seq.push(+b.dataset.tl); msgs[it.id] = null; api.save(); paint(); if (x.seq.length === it.tiles.length) { var c = host.querySelector('[data-k="' + it.id + 'chk"]'); if (c) c.focus({ preventScroll:true }); } else { var nx = host.querySelector('[data-pz="' + it.id + '"] [data-tl]:not([disabled])'); if (nx) nx.focus({ preventScroll:true }); } return; }
    if (b.dataset.sq) { if (b.dataset.sq === "undo") x.seq.pop(); else x.seq = []; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var ok, fb;
      if (it.kind === "order") {
        if (x.seq.length < it.tiles.length) { msgs[it.id] = "Tap every compound first, lowest boiling point first."; paint(); return; }
        var ans = MV.ans(it); ok = ans.every(function(v, k){ return x.seq[k] === v; });
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return x.seq.indexOf(w.before[0]) < x.seq.indexOf(w.before[1]); })[0]; fb = named ? named.fb : it.general; }
      } else {
        if (x.pick == null) { msgs[it.id] = "Choose an answer first."; paint(); return; }
        ok = MV.ok(it.options[x.pick]); fb = it.options[x.pick].why;
      }
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = fb; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pz="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design an amide ----------
var T_ACIDS = [1, 2, 3, 4], T_AMINES = ["ammonia", "methanamine", "ethanamine", "propan-1-amine", "N-methylmethanamine", "N-methylethanamine"], T_LAB = {};
T_ACIDS.forEach(function(ac){ T_AMINES.forEach(function(am){ T_LAB[C2.name(prodSp(ac, am))] = ACIDN[ac] + " + " + am; }); });
var task = (function(){
  var S = null, api = null, V = null, chips = null;
  function read(){ if (!S) return { sp:prodSp(2, "ammonia"), name:"", nh:2, C:2, tape:[] }; var sp = prodSp(S.acid, S.amine); return { sp:sp, name:C2.name(sp), nh:nNH(sp), C:nCarb(sp), am:S.amine, tape:S.tape.slice() }; }
  function paint(){
    var d = read(), sp = d.sp, m = molOf(sp);
    $("#am-tkeq").innerHTML = F(AL[S.acid] + "OH") + " + " + F(condensed(amineSp(S.amine))) + " → " + F(condensed(sp)) + " + " + F("H2O");
    V.show(C1.decorate(C1.layout2d(m), m, {}), { smax:52, aria:"Your amide: " + MV.plain(F(condensed(sp))) + ", with " + d.nh + " N–H bond" + (d.nh === 1 ? "" : "s") + "." });
    $("#am-tkread").innerHTML = MV.readoutHTML([["Formula", F(fTextOf(sp))], ["N–H bonds", String(d.nh)], ["Carbon atoms", d.C + " (" + S.acid + " from the acid, " + (d.C - S.acid) + " from the N-compound)"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      if (T_ACIDS.indexOf(S.acid) < 0) S.acid = 2; if (T_AMINES.indexOf(S.amine) < 0) S.amine = "ammonia"; if (!Array.isArray(S.tape)) S.tape = [];
      inp.innerHTML = '<h4 class="am-h4">Reactants</h4><div id="am-tka"></div><div id="am-tkn"></div><h4 class="am-h4">Name your amide</h4><div id="am-tkc"></div>';
      pv.innerHTML = '<h4 class="am-h4">Your amide</h4><p class="am-tkeq" id="am-tkeq"></p><div id="am-tkv"></div><dl class="read" id="am-tkread" aria-live="polite"></dl>';
      radios($("#am-tka"), { label:"Acid", cls:"chips", options:T_ACIDS.map(function(n){ return { id:String(n), t:ACIDN[n] }; }), value:String(S.acid), onChange:function(v){ S.acid = +v; a.save(); paint(); a.update(); } });
      radios($("#am-tkn"), { label:"N-compound", cls:"chips", options:T_AMINES.map(function(x){ return { id:x, t:x }; }), value:S.amine, onChange:function(v){ S.amine = v; a.save(); paint(); a.update(); } });
      chips = C2.chips($("#am-tkc"), { get:function(){ return S.tape; }, set:function(tk){ S.tape = tk; a.save(); a.update(); } });
      V = C1.view($("#am-tkv"), { w:460, h:230, phone:0.6 });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.nh >= 1, d.C === 4, d.am !== "ammonia", d.tape.length > 0 && C2.compose(d.tape) === d.name]; },
    key:function(d){ return d.name; }, label:function(k){ return k + " (" + (T_LAB[k] || "") + ")"; }, text:function(k){ return k + " (" + (T_LAB[k] || "") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ classify:classifyAct, puzzles:puzzleAct },
  task:task
});
})();
