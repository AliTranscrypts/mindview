// SCH4U 12 Chirality, Enantiomers and Diastereomers: hero (two hands at a mirror, then butan-2-ol and its mirror image
// failing three best-fit tries), Mirror lab (Explore: one centre with a slot palette, Reflect / Try to superimpose / Swap /
// Name it; two centres with the AA–BB card grid and the meso chip; polarimeter), Handedness (Part 3: glove test, carvone
// data, medicines), "Find the chiral centres" and "Stereo reasoning" activities, "Build a chiral alcohol" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function ease(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function cp(o){ return JSON.parse(JSON.stringify(o)); }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
var MINUS = "−";
function sgnDeg(v){ v = Math.round(v * 10) / 10; return (v > 0 ? "+" : v < 0 ? MINUS : "") + Math.abs(v) + "°"; }
function sgnNum(v){ return (v < 0 ? MINUS : "") + Math.abs(v); }
function rules(){ return (MV.C && MV.C.explore && MV.C.explore.rules) || {}; }

// ===== core start (no DOM) =====
// @component C1 molecule model — SMILES-lite parser (C, O, N, F, Cl, Br; = and # bonds; branches; one ring with digit
// closures), implicit H, formula (Hill order), ring finder, benzene test. m = {a:[{el}], b:[[i, j, order]], main:[…]}
var VAL = { C:4, O:2, N:3, F:1, Cl:1, Br:1 }, HALO = { F:"fluoro", Cl:"chloro", Br:"bromo" };
function smiles(s){
  var a = [], b = [], st = [], prev = -1, bo = 1, rg = {}, main = [], i = 0;
  while (i < s.length) {
    var ch = s[i];
    if (ch === "(") { st.push(prev); i++; continue; }
    if (ch === ")") { prev = st.pop(); i++; continue; }
    if (ch === "=") { bo = 2; i++; continue; }
    if (ch === "#") { bo = 3; i++; continue; }
    if (/\d/.test(ch)) { if (rg[ch] != null) { b.push([rg[ch], prev, bo]); delete rg[ch]; } else rg[ch] = prev; bo = 1; i++; continue; }
    var el = /^(Cl|Br)/.test(s.substr(i, 2)) ? s.substr(i, 2) : ch; i += el.length;
    a.push({ el:el }); var k = a.length - 1; if (prev >= 0) b.push([prev, k, bo]); bo = 1; prev = k; if (!st.length) main.push(k);
  }
  return { a:a, b:b, main:main };
}
function adj(m){ if (!m._A) { var L = m.a.map(function(){ return []; }); m.b.forEach(function(x){ L[x[0]].push(x[1]); L[x[1]].push(x[0]); }); m._A = L; } return m._A; }
function bondOf(m, i, j){ for (var k = 0; k < m.b.length; k++) { var x = m.b[k]; if ((x[0] === i && x[1] === j) || (x[0] === j && x[1] === i)) return k; } return -1; }
function order(m, i, j){ var k = bondOf(m, i, j); return k < 0 ? 0 : m.b[k][2] || 1; }
function used(m){ var s = m.a.map(function(){ return 0; }); m.b.forEach(function(x){ s[x[0]] += x[2] || 1; s[x[1]] += x[2] || 1; }); return s; }
function hc(m){ if (!m._h) { var s = used(m); m._h = m.a.map(function(x, i){ return Math.max(0, (VAL[x.el] || 0) - s[i]); }); } return m._h; }
function free(m, i){ return (VAL[m.a[i].el] || 0) - used(m)[i]; }
function formula(m){ var f = {}, h = hc(m); m.a.forEach(function(x, i){ f[x.el] = (f[x.el] || 0) + 1; f.H = (f.H || 0) + h[i]; }); return f; }
function fStr(f){ var s = ""; ["C", "H", "Br", "Cl", "F", "N", "O"].forEach(function(e){ if (f[e]) s += e + (f[e] > 1 ? f[e] : ""); }); return s; }
function fText(m){ return fStr(formula(m)); }
function isC(m){ return function(j){ return m.a[j].el === "C"; }; }
function ringOf(m){
  if (m._rg !== undefined) return m._rg;
  var A = adj(m), deg = A.map(function(l){ return l.length; }), gone = {}, q = [], i;
  for (i = 0; i < deg.length; i++) if (deg[i] <= 1) q.push(i);
  while (q.length) { var x = q.pop(); if (gone[x]) continue; gone[x] = 1; A[x].forEach(function(y){ if (!gone[y] && --deg[y] <= 1) q.push(y); }); }
  var R = []; for (i = 0; i < m.a.length; i++) if (!gone[i]) R.push(i);
  if (!R.length) return (m._rg = null);
  var on = {}, cyc = [R[0]]; R.forEach(function(x){ on[x] = 1; });
  while (cyc.length < R.length) { var c = cyc[cyc.length - 1], p = cyc[cyc.length - 2], nx = A[c].filter(function(y){ return on[y] && y !== p && cyc.indexOf(y) < 0; })[0]; if (nx == null) break; cyc.push(nx); }
  return (m._rg = cyc);
}
function isBenz(m, R){ if (!R || R.length !== 6 || !R.every(function(x){ return m.a[x].el === "C"; })) return false; var d = 0; for (var k = 0; k < 6; k++) if (order(m, R[k], R[(k + 1) % 6]) === 2) d++; return d === 3; }

// @component C2 nameBuilder (namer) — IUPAC names for C/H/O/N/halogen molecules: alkanes, alkenes/alkynes, halo, alkoxy
// (ethers), alcohols, amines (N-prefixes), ketones, aldehydes, amides (N-prefixes), esters (alkyl alkanoate) and acids;
// cycloalkane and benzene parents (ring = parent). Course priority acid > ester > amide > aldehyde > ketone > alcohol >
// amine; chain: most principal groups, then longest, then most multiple bonds; lowest locants to the principal group, then
// multiple bonds, then prefixes, then the prefix first in the alphabet. NM.name(m, forceP) -> {ok, name, c (chosen
// candidate), parts, P, alts (other numberings of the same parent)} · NM.roles(m) · NM.str(parts, {older}) · NM.keyOf(c)
var STEM = ["", "meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"], MULT = ["", "", "di", "tri", "tetra"];
var GL = { acid:"carboxylic acid", ester:"ester", amide:"amide", al:"aldehyde", one:"ketone", ol:"alcohol", amine:"amine" };
var PRI = { acid:1, ester:2, amide:3, al:4, one:5, ol:6, amine:7 };
var SUFX = { acid:"oic acid", ester:"oate", amide:"amide", al:"al", one:"one", ol:"ol", amine:"amine" };
var GSYM = { acid:"–COOH", ester:"C=O", amide:"C=O", al:"–CHO", one:"C=O", ol:"–OH", amine:"–NH₂" };
function cmpArr(a, b){ for (var i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }
var NM = (function(){
  var RANK = { acid:8, ester:7, amide:6, al:5, one:4, ol:3, amine:2 };
  function amideN(m, j){ var A = adj(m); return m.a[j].el === "N" && A[j].some(function(c){ return m.a[c].el === "C" && A[c].some(function(o){ return m.a[o].el === "O" && order(m, c, o) === 2; }); }); }
  function roles(m){
    if (m._ro) return m._ro;
    var A = adj(m), h = hc(m), per = m.a.map(function(){ return { dO:-1, oh:[], or:[], n:[] }; });
    m.a.forEach(function(x, i){
      if (x.el !== "C") return;
      A[i].forEach(function(j){
        var e = m.a[j].el, o = order(m, i, j);
        if (e === "O") { if (o === 2) per[i].dO = j; else if (h[j]) per[i].oh.push(j); else per[i].or.push(j); }
        else if (e === "N" && o === 1) per[i].n.push(j);
      });
    });
    var kind = m.a.map(function(x, i){
      if (x.el !== "C") return "";
      var p = per[i], nc = A[i].filter(isC(m)).length;
      if (p.dO >= 0) return p.oh.length ? "acid" : p.or.length ? "ester" : p.n.length ? "amide" : nc <= 1 ? "al" : "one";
      if (p.oh.length) return "ol";
      if (p.n.some(function(j){ return !amideN(m, j); })) return "amine";
      return "";
    });
    var P = "", has = {};
    kind.forEach(function(k){ if (k) { has[k] = 1; if (!P || RANK[k] > RANK[P]) P = k; } });
    return (m._ro = { per:per, kind:kind, P:P, has:has });
  }
  function alkyl(m, r, from){
    var A = adj(m), par = {}, Q = [r], cands = [];
    par[r] = -1;
    while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (z !== from && !(z in par) && m.a[z].el === "C") { par[z] = y; Q.push(z); } }); }
    Object.keys(par).forEach(function(e){ var p = []; for (var z = +e; z !== -1; z = par[z]) p.unshift(z); var c = cand(m, p, "", from, ""); c.str = str(parts(c, true)); cands.push(c); });
    cands.sort(cmp);
    var s = cands[0].str, simple = /^[a-z]+yl$/.test(s) && STEM.indexOf(s.slice(0, -2)) > 0, nc = 0;
    var seen = {}, st = [r]; seen[from] = 1;
    while (st.length) { var x = st.pop(); if (seen[x]) continue; seen[x] = 1; if (m.a[x].el === "C") nc++; A[x].forEach(function(w){ if (!seen[w]) st.push(w); }); }
    return { name:simple ? s : "(" + s + ")", key:s.replace(/[^a-z]/g, ""), plain:s, nc:nc };
  }
  function cand(m, path, P, from, ring){
    var A = adj(m), R = roles(m), on = {}, subs = [], pg = [], mbs = [], alk = null, L = path.length, i;
    path.forEach(function(x){ on[x] = 1; });
    if (from != null) on[from] = 1;
    if (ring !== "benzene") for (i = 0; i < (ring ? L : L - 1); i++) { var o0 = order(m, path[i], path[(i + 1) % L]); if (o0 >= 2) mbs.push({ loc:i + 1, o:o0 }); }
    path.forEach(function(x, k){
      var pr = R.per[x], mine = !!P && R.kind[x] === P, loc = k + 1;
      if (mine) { var cnt = P === "ol" ? pr.oh.length : P === "amine" ? pr.n.filter(function(j){ return !amideN(m, j); }).length : 1; for (var q = 0; q < cnt; q++) pg.push(loc); }
      A[x].forEach(function(j){
        if (on[j]) return;
        var el = m.a[j].el, o = order(m, x, j);
        if (el === "C") { var nm = alkyl(m, j, x); subs.push({ loc:loc, name:nm.name, key:nm.key }); return; }
        if (HALO[el]) { subs.push({ loc:loc, name:HALO[el], key:HALO[el] }); return; }
        if (el === "O") {
          if (o === 2) { if (!mine) subs.push({ loc:loc, name:"oxo", key:"oxo" }); return; }
          if (mine && (P === "acid" || P === "ol") && pr.oh.indexOf(j) >= 0) return;
          var r = A[j].filter(function(y){ return y !== x; })[0];
          if (r == null) { subs.push({ loc:loc, name:"hydroxy", key:"hydroxy" }); return; }
          if (mine && P === "ester") { alk = alkyl(m, r, j); return; }
          var an = alkyl(m, r, j), ox = an.name.replace(/yl(\)?)$/, "oxy$1"); subs.push({ loc:loc, name:ox, key:ox.replace(/[^a-z]/g, "") }); return;
        }
        if (el === "N") {
          var oth = A[j].filter(function(y){ return y !== x; });
          if (mine && (P === "amine" || P === "amide")) { oth.forEach(function(y){ var a2 = alkyl(m, y, j); subs.push({ loc:"N", name:a2.name, key:a2.key }); }); return; }
          if (!oth.length) { subs.push({ loc:loc, name:"amino", key:"amino" }); return; }
          var am = alkyl(m, oth[0], j).plain + "amino"; subs.push({ loc:loc, name:"(" + am + ")", key:am.replace(/[^a-z]/g, "") });
        }
      });
    });
    var c = { path:path, subs:subs, pg:pg.sort(asc), P:P, mbs:mbs, alk:alk, ring:ring };
    c.mb = mbs.map(function(x){ return x.loc; }); c.db = mbs.filter(function(x){ return x.o === 2; }).map(function(x){ return x.loc; });
    var cs = subs.filter(function(s){ return s.loc !== "N"; });
    c.locs = cs.map(function(s){ return s.loc; }).sort(asc);
    c.alpha = cs.slice().sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : a.loc - b.loc; }).map(function(s){ return s.loc; });
    return c;
  }
  function cmp(a, b){
    return (b.pg.length - a.pg.length) || (b.path.length - a.path.length) || (b.mb.length - a.mb.length) || (b.db.length - a.db.length) || (b.subs.length - a.subs.length) ||
      cmpArr(a.pg, b.pg) || cmpArr(a.mb, b.mb) || cmpArr(a.db, b.db) || cmpArr(a.locs, b.locs) || cmpArr(a.alpha, b.alpha) || (a.str < b.str ? -1 : a.str > b.str ? 1 : 0);
  }
  function grp(subs){
    var g = {}, out = [];
    subs.forEach(function(s){ if (!g[s.name]) { g[s.name] = { name:s.name, key:s.key, locs:[] }; out.push(g[s.name]); } g[s.name].locs.push(String(s.loc)); });
    out.forEach(function(x){ x.locs.sort(function(a, b){ return (a === "N" ? 0 : +a) - (b === "N" ? 0 : +b); }); });
    return out.sort(function(a, b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });
  }
  function parts(c, asSub){
    var n = c.path.length, P = c.P, ring = c.ring, nf = c.subs.filter(function(s){ return s.loc !== "N"; }).length;
    var feat = nf + (P === "ol" || P === "one" || P === "amine" ? c.pg.length : 0) + c.mbs.length, one = feat <= 1, term = P === "acid" || P === "ester" || P === "amide" || P === "al";
    var o = { n:n, ring:ring, P:P, pre:grp(c.subs), alk:c.alk ? c.alk.plain : "", alkC:c.alk ? c.alk.nc : 0, sub:!!asSub,
      en:c.mbs.filter(function(x){ return x.o === 2; }).map(function(x){ return String(x.loc); }), yn:c.mbs.filter(function(x){ return x.o === 3; }).map(function(x){ return String(x.loc); }), pg:c.pg.map(String) };
    o.showPre = asSub || (ring ? !one : n > 2 || (n === 2 && !one));
    o.showSuf = !P || term ? false : ring ? !one : n === 1 ? false : n === 2 ? !one : !(n === 3 && P === "one" && one);
    o.showMb = ring ? true : !(n === 2 && one) && !(n === 3 && !P && one);
    o.optSuf = !!P && !term && ((P === "one" && n === 4 && one) || (!!ring && !one && c.pg.length === 1));
    return o;
  }
  function str(o, opt){
    opt = opt || {};
    var out = "";
    o.pre.forEach(function(x){ var sl = o.showPre || x.locs[0] === "N"; out += (out && sl ? "-" : "") + (sl ? x.locs.join(",") + "-" : "") + MULT[x.locs.length] + x.name; });
    if (o.ring === "benzene") return out + "benzene";
    var en = o.en, yn = o.yn;
    if (o.sub) return out + STEM[o.n] + (en.length ? (o.n > 2 ? "-" + en.join(",") + "-" : "") + "en" : "") + "yl";
    var body = (o.ring ? "cyclo" : "") + STEM[o.n], pre = "", older = !!opt.older, showSuf = opt.suf != null ? opt.suf : o.showSuf;
    if (!en.length && !yn.length) body += "an";
    else {
      if (en.length > 1 || yn.length > 1) body += "a";
      [["en", en], ["yn", yn]].forEach(function(z){
        if (!z[1].length) return;
        if (older && !pre && o.showMb) pre = z[1].join(","); else if (o.showMb) body += "-" + z[1].join(",") + "-";
        body += MULT[z[1].length] + z[0];
      });
    }
    var sx = "e";
    if (o.P) {
      var core = (o.pg.length > 1 ? MULT[o.pg.length] : "") + SUFX[o.P], v = /^[aeiouy]/.test(core) ? "" : "e";
      if (older && !pre && showSuf) { pre = o.pg.join(","); sx = v + core; }
      else sx = v + (showSuf ? "-" + o.pg.join(",") + "-" : "") + core;
    }
    var res = out + (pre ? (out ? "-" : "") + pre + "-" : "") + body + sx;
    return o.alk ? o.alk + " " + res : res;
  }
  function keyOf(c){ var g = {}; c.subs.forEach(function(s){ (g[s.name] = g[s.name] || []).push(String(s.loc)); }); return { pg:c.pg.map(String), en:c.db.map(String), yn:c.mb.filter(function(x){ return c.db.indexOf(x) < 0; }).map(String), pre:g }; }
  function name(m, force){
    var key = force == null ? "_nm" : "_nm" + force;
    if (m[key]) return m[key];
    var A = adj(m), R = roles(m), P = force != null ? force : R.P, cands = [], rg = ringOf(m), bad = { ok:false, name:"" }, i;
    if (!m.a.some(function(x){ return x.el === "C"; })) return (m[key] = bad);
    for (i = 0; i < m.a.length; i++) if (free(m, i) < 0) return (m[key] = bad);
    if (rg) {
      var bz = isBenz(m, rg), k = rg.length;
      if (!rg.every(function(x){ return m.a[x].el === "C"; }) || (bz && P) || (P && !rg.some(function(x){ return R.kind[x] === P; }))) return (m[key] = bad);
      for (var s0 = 0; s0 < k; s0++) for (var d = -1; d <= 1; d += 2) { var p = []; for (var t = 0; t < k; t++) p.push(rg[(s0 + d * t + 2 * k) % k]); cands.push(cand(m, p, P, null, bz ? "benzene" : "cyclo")); }
    } else {
      m.a.forEach(function(x, s){
        if (x.el !== "C") return;
        var par = {}, Q = [s]; par[s] = -1;
        while (Q.length) { var y = Q.shift(); A[y].forEach(function(z){ if (m.a[z].el === "C" && !(z in par)) { par[z] = y; Q.push(z); } }); }
        Object.keys(par).forEach(function(e){ var p2 = []; for (var z = +e; z !== -1; z = par[z]) p2.unshift(z); cands.push(cand(m, p2, P, null, "")); });
      });
    }
    cands.forEach(function(c){ c.str = str(parts(c)); });
    cands.sort(cmp);
    var b = cands[0], set = b.path.slice().sort(asc).join();
    if (P && !b.pg.length) return (m[key] = bad);
    var res = { ok:true, name:b.str, c:b, parts:parts(b), P:P, ring:b.ring,
      alts:cands.filter(function(c){ return c !== b && c.path.length === b.path.length && c.path.slice().sort(asc).join() === set; }) };
    res.older = str(res.parts, { older:true });
    return (m[key] = res);
  }
  return { name:name, roles:roles, str:str, keyOf:keyOf, alkyl:alkyl };
})();
// ===== core end (copied from SCH4U 09) =====

var MC = {};
function mol(smi){ return MC[smi] || (MC[smi] = smiles(smi)); }
function longest(m){
  var A = adj(m);
  function far(s){ var d = {}, par = {}, Q = [s], last = s; d[s] = 0; par[s] = -1; while (Q.length) { var x = Q.shift(); if (d[x] > d[last]) last = x; A[x].forEach(function(y){ if (!(y in d)) { d[y] = d[x] + 1; par[y] = x; Q.push(y); } }); } var p = []; for (var v = last; v !== -1; v = par[v]) p.push(v); return p.reverse(); }
  if (!m.a.length) return [];
  var p = far(far(0).slice(-1)[0]);
  return p[0] > p[p.length - 1] ? p.reverse() : p;
}

// ---------- @component C1 moleculeView (from SCH4U 09; picks may be a list of atom indices, o.on marks several) — 2D structural drawing with merged H labels (CH₃, OH, H₂N), chain on a grid or a
// ring on a polygon, plus overlays: parent-chain glow (--hi-soft), a second dashed glow, locant numbers (two directions),
// priority badges (border in the atom colour), tags under atoms, selection, and atom + bond pick buttons (Tab, arrows).
//   layout(m) -> {P, lbl} · fitMol(m, W, H, o) · svgMol(m, fit, o) · molView(host, {w, h, onPick, label}) -> {show(m, o), render(), pos(i)}
//   o = {glow:[i], glow2:[i], nums:[{i, t, side:-1|1, col, op, b}], badges:[{i, t, el, dx, dy, op, b}], tags:[{i, t}], selA, selB:[i, j], picks, op, box, smax, aria}
var U = [0, -1], D = [0, 1], LF = [-1, 0], RT = [1, 0];
function layout(m){
  if (m._L) return m._L;
  var A = adj(m), n = m.a.length, P = new Array(n), rg = ringOf(m), h = hc(m), i;
  function grow(j, from, dir){
    P[j] = [P[from][0] + dir[0], P[from][1] + dir[1]];
    A[j].filter(function(c){ return c !== from && P[c] == null; }).sort(asc).forEach(function(c, q){ grow(c, j, q === 0 ? dir : q === 1 ? [-dir[1], dir[0]] : [dir[1], -dir[0]]); });
  }
  if (rg) {
    var k = rg.length, Rr = 1.3 / (2 * Math.sin(Math.PI / k)), onR = {};
    rg.forEach(function(x, t){ var a = -Math.PI / 2 + t * 2 * Math.PI / k; P[x] = [Rr * Math.cos(a), Rr * Math.sin(a)]; onR[x] = 1; });
    rg.forEach(function(x){
      var d = [P[x][0] / Rr, P[x][1] / Rr], out = A[x].filter(function(j){ return !onR[j]; });
      out.forEach(function(j, q){ var t = out.length > 1 ? (q ? -0.5 : 0.5) : 0, c = Math.cos(t), s = Math.sin(t); grow(j, x, [(d[0] * c - d[1] * s) * 1.15, (d[0] * s + d[1] * c) * 1.15]); });
    });
  } else if (n) {
    var main = m.main && m.main.length ? m.main : longest(m), N = main.length, onMain = {};
    main.forEach(function(x, kk){ onMain[x] = kk; });
    var roots = main.map(function(x){ return A[x].filter(function(j){ return !(j in onMain); }).sort(asc); }), rdir = {}, cb = [];
    main.forEach(function(x, kk){
      var r = roots[kk], single = N === 1, e0 = N > 1 && kk === 0, e1 = N > 1 && kk === N - 1, usedD = [];
      var par = kk % 2 ? [U, D] : [D, U], out = single ? [RT, LF] : e0 ? [LF] : e1 ? [RT] : [];
      var cP = single ? [RT, LF, U, D] : par.concat(out), xP = single ? [RT, LF, U, D] : out.concat(par);
      var take = function(list){ for (var q = 0; q < list.length; q++) if (usedD.indexOf(list[q]) < 0) { usedD.push(list[q]); return list[q]; } return U; };
      r.filter(isC(m)).forEach(function(j){ rdir[j] = take(cP); });
      r.filter(function(j){ return m.a[j].el !== "C"; }).forEach(function(j){ rdir[j] = take(xP); });
      cb[kk] = r.some(function(j){ return rdir[j][0] === 0; }) ? 1 : 0;
    });
    var x0 = 0;
    main.forEach(function(x, kk){ if (kk) x0 += 1.32 + 0.12 * (cb[kk - 1] + cb[kk]); P[x] = [x0, 0]; });
    main.forEach(function(x, kk){ roots[kk].forEach(function(j){ grow(j, x, rdir[j]); }); });
  }
  for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0];
  var lbl = m.a.map(function(x, i2){
    var el = x.el, hh = h[i2]; if (!hh) return el;
    var hs = "H" + (hh > 1 ? hh : "");
    if (el === "C") return "C" + hs;
    var nb = A[i2][0];
    return A[i2].length === 1 && P[nb][0] > P[i2][0] + 0.3 ? hs + el : el + hs;
  });
  return (m._L = { P:P, lbl:lbl });
}
function tsp(t, fs){ var out = "", low = false, d = r1(fs * 0.28);
  String(t).replace(/(\d+|\D+)/g, function(seg){ var dig = /^\d/.test(seg); if (dig && !low) { out += '<tspan dy="' + d + '" font-size="' + r1(fs * 0.72) + '">' + seg + "</tspan>"; low = true; } else if (!dig && low) { out += '<tspan dy="' + (-d) + '">' + seg + "</tspan>"; low = false; } else out += seg; return seg; });
  return out; }
function estW(t, fs){ var w = 0; String(t).split("").forEach(function(ch){ w += /\d/.test(ch) ? 0.42 : /[a-z ]/.test(ch) ? 0.52 : 0.68; }); return w * fs; }
function inkOf(el){ return el === "C" ? "var(--at-c)" : el === "O" ? "var(--at-o)" : el === "N" ? "var(--at-n)" : HALO[el] ? "var(--at-x)" : "var(--ink)"; }
function fitMol(m, W, H, o){
  var L = layout(m), x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, bx = typeof o.box === "function" ? o.box(W, H) : o.box || { x0:0, y0:0, x1:W, y1:H };
  L.P.forEach(function(p){ x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
  var w = bx.x1 - bx.x0, h = bx.y1 - bx.y0, s = Math.min((w - 24) / (x1 - x0 + 1.7), (h - 20) / (y1 - y0 + (o.padY || 1.9)), o.smax || 64);
  return { s:s, ox:bx.x0 + w / 2 - (x0 + x1) / 2 * s, oy:bx.y0 + h / 2 - (y0 + y1) / 2 * s };
}
function svgMol(m, fit, o){
  o = o || {};
  var L = layout(m), s = fit.s, fs = clamp(s * 0.38, 11, 22), out = "", n = m.a.length;
  function X(i){ return fit.ox + L.P[i][0] * s; } function Y(i){ return fit.oy + L.P[i][1] * s; }
  var gop = o.op == null ? 1 : o.op, OP = gop < 0.999 ? ' opacity="' + r1(gop) + '"' : "";
  function glow(list, dash){
    var on = {}; (list || []).forEach(function(i){ on[i] = 1; });
    m.b.forEach(function(b){ if (on[b[0]] && on[b[1]]) out += '<line x1="' + r1(X(b[0])) + '" y1="' + r1(Y(b[0])) + '" x2="' + r1(X(b[1])) + '" y2="' + r1(Y(b[1])) + '" stroke="var(--hi-soft)" stroke-width="' + r1(fs * 1.5) + '" stroke-linecap="round"/>'; });
    (list || []).forEach(function(i){ out += '<circle cx="' + r1(X(i)) + '" cy="' + r1(Y(i)) + '" r="' + r1(fs * (L.lbl[i].length > 1 ? 1.05 : 0.8)) + '" fill="var(--hi-soft)"' + (dash ? ' stroke="var(--pen)" stroke-width="1.6" stroke-dasharray="4 3"' : "") + "/>"; });
  }
  if (o.glow2) glow(o.glow2, true);
  if (o.glow) glow(o.glow, false);
  if (o.selB) m.b.forEach(function(b){ if ((b[0] === o.selB[0] && b[1] === o.selB[1]) || (b[0] === o.selB[1] && b[1] === o.selB[0])) out += '<line x1="' + r1(X(b[0])) + '" y1="' + r1(Y(b[0])) + '" x2="' + r1(X(b[1])) + '" y2="' + r1(Y(b[1])) + '" stroke="var(--hi)" stroke-width="' + r1(fs * 1.2) + '" stroke-linecap="round" opacity=".85"/>'; });
  if (o.selA != null && o.selA < n) out += '<circle cx="' + r1(X(o.selA)) + '" cy="' + r1(Y(o.selA)) + '" r="' + r1(fs * 1.05) + '" fill="var(--hi)" opacity=".85"/>';
  var ext = L.lbl.map(function(t){ return [estW(t, fs) / 2 + 2, fs * 0.5]; });
  out += "<g" + OP + ">";
  m.b.forEach(function(b){
    var ax = X(b[0]), ay = Y(b[0]), bx = X(b[1]), by = Y(b[1]), dx = bx - ax, dy = by - ay, Ln = Math.hypot(dx, dy) || 1, ux = dx / Ln, uy = dy / Ln;
    var ta = Math.min(ux ? ext[b[0]][0] / Math.abs(ux) : 1e9, uy ? ext[b[0]][1] / Math.abs(uy) : 1e9), tb = Math.min(ux ? ext[b[1]][0] / Math.abs(ux) : 1e9, uy ? ext[b[1]][1] / Math.abs(uy) : 1e9);
    if (ta + tb >= Ln - 2) return;
    (b[2] === 2 ? [-3, 3] : b[2] === 3 ? [-5, 0, 5] : [0]).forEach(function(d){ out += '<line x1="' + r1(ax + ux * ta - uy * d) + '" y1="' + r1(ay + uy * ta + ux * d) + '" x2="' + r1(bx - ux * tb - uy * d) + '" y2="' + r1(by - uy * tb + ux * d) + '" stroke="var(--ink)" stroke-width="' + r1(clamp(s * 0.034, 1.5, 2.3)) + '" stroke-linecap="round"/>'; });
  });
  for (var i = 0; i < n; i++) { var el = m.a[i].el; out += '<text x="' + r1(X(i)) + '" y="' + r1(Y(i)) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="' + (el === "C" ? 400 : 700) + '" fill="' + inkOf(el) + '">' + tsp(L.lbl[i], fs) + "</text>"; }
  out += "</g>";
  function spot(i, side){
    var angs = [], P = Math.PI, best = null, A = adj(m);
    A[i].forEach(function(j){ angs.push(Math.atan2(Y(j) - Y(i), X(j) - X(i))); });
    (side > 0 ? [P / 2, P / 4, 3 * P / 4, 0, P] : [-P / 2, -P / 4, -3 * P / 4, 0, P]).some(function(t){ if (angs.every(function(x){ return Math.abs(Math.atan2(Math.sin(t - x), Math.cos(t - x))) > 0.55; })) { best = t; return true; } return false; });
    if (best == null) best = side > 0 ? P / 4 : -P / 4;
    var r = Math.abs(Math.sin(best)) > 0.9 ? fs * 1.15 : Math.max(fs * 1.25, ext[i][0] + fs * 0.45);
    return [X(i) + Math.cos(best) * r, Y(i) + Math.sin(best) * r];
  }
  (o.nums || []).forEach(function(q){
    if (q.i >= n || q.op === 0) return;
    var p = spot(q.i, q.side || -1);
    out += '<text x="' + r1(p[0]) + '" y="' + r1(p[1]) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.68) + '" font-weight="700" fill="var(' + (q.col || "--ink-2") + ')"' + (q.op != null && q.op < 1 ? ' opacity="' + r1(q.op) + '"' : "") + ">" + q.t + "</text>";
  });
  (o.tags || []).forEach(function(q){ if (q.i < n) out += '<text x="' + r1(X(q.i) + (q.dx || 0)) + '" y="' + r1(Y(q.i) + (q.dy || fs * 1.9)) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs * 0.7) + '" font-weight="700" fill="var(--ink)" stroke="var(--sheet)" stroke-width="4" paint-order="stroke">' + q.t + "</text>"; });
  (o.badges || []).forEach(function(q){
    if (q.i >= n || q.op === 0) return;
    var bx = q.x != null ? q.x : X(q.i) + (q.dx || 0), by = q.y != null ? q.y : Y(q.i) + (q.dy == null ? -fs * 1.7 : q.dy), f2 = fs * 0.66, w = estW(q.t, f2) + 14, hh = f2 + 10;
    out += '<g' + (q.op != null && q.op < 1 ? ' opacity="' + r1(q.op) + '"' : "") + '><rect x="' + r1(bx - w / 2) + '" y="' + r1(by - hh / 2) + '" width="' + r1(w) + '" height="' + r1(hh) + '" rx="' + r1(hh / 2) + '" fill="var(--sheet)" stroke="var(' + MV.chem.colorVar(q.el || "O") + ')" stroke-width="' + (q.b ? 3 : 1.8) + '"/><text x="' + r1(bx) + '" y="' + r1(by) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(f2) + '" font-weight="' + (q.b ? 700 : 400) + '" fill="var(--ink)">' + q.t + "</text></g>";
  });
  return out;
}
function molView(host, opts){
  opts = opts || {};
  var W = opts.w || 560, H = opts.h || 300, aspect = H / W, st = { m:null, o:{}, fit:null };
  host.innerHTML = '<div class="c1-wrap"><svg class="c1-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Molecule"></svg><div class="c1-ov"></div></div>';
  var svg = $(".c1-svg", host), ov = $(".c1-ov", host);
  function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 500 ? Math.max(aspect, opts.phone || 0.72) : aspect)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0) render(); }).observe(svg);
  function render(){
    size();
    if (!st.m || !st.m.a.length) { svg.innerHTML = ""; ov.innerHTML = ""; return; }
    var o = st.o, m = st.m, fit = st.fit = fitMol(m, W, H, o), L = layout(m);
    svg.innerHTML = svgMol(m, fit, o) + (o.extra ? o.extra(fit, W, H) : "");
    svg.setAttribute("aria-label", o.aria || "Molecule");
    if (!o.picks) { ov.innerHTML = ""; return; }
    var pos = function(i){ return [fit.ox + L.P[i][0] * fit.s, fit.oy + L.P[i][1] * fit.s]; }, list = [];
    m.a.forEach(function(_, i){ if (Array.isArray(o.picks) && o.picks.indexOf(i) < 0) return; var p = pos(i); list.push({ k:"a", i:i, x:p[0], y:p[1], on:o.on ? o.on.indexOf(i) >= 0 : o.selA === i }); });
    if (!Array.isArray(o.picks)) m.b.forEach(function(b, i){ var p = pos(b[0]), q = pos(b[1]); list.push({ k:"b", i:i, x:(p[0] + q[0]) / 2, y:(p[1] + q[1]) / 2, on:!!(o.selB && ((b[0] === o.selB[0] && b[1] === o.selB[1]) || (b[0] === o.selB[1] && b[1] === o.selB[0]))) }); });
    var html = list.map(function(x){ return '<button type="button" class="c1-b' + (x.k === "b" ? " bd" : "") + '" style="left:' + r1(x.x / W * 100) + "%;top:" + r1(x.y / H * 100) + '%" data-k="pk' + x.k + x.i + '" data-pk="' + x.k + '" data-pi="' + x.i + '" aria-pressed="' + x.on + '" aria-label="' + esc(opts.label ? opts.label(x.k, x.i) : "Select") + '"></button>'; }).join("");
    MV.keepFocus(ov, function(){ ov.innerHTML = html; });
  }
  ov.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b && opts.onPick) opts.onPick(b.dataset.pk, +b.dataset.pi); });
  ov.addEventListener("keydown", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$("button", ov), i = all.indexOf(b); all[(i + d + all.length) % all.length].focus();
  });
  return { show:function(m, o){ st.m = m; st.o = o || {}; render(); }, render:render, svg:svg,
    pos:function(i){ var L = layout(st.m); return [st.fit.ox + L.P[i][0] * st.fit.s, st.fit.oy + L.P[i][1] * st.fit.s]; }, fs:function(){ return clamp(st.fit.s * 0.38, 11, 22); } };
}
// small static structure (Part 3 cards, practice items)
function miniSVG(m, w, h, o){
  o = o || {}; var fit = fitMol(m, w, h, { smax:o.smax || 34, padY:1.6 });
  return '<svg class="nm-mini" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(o.aria || "Structure") + '">' + svgMol(m, fit, o) + "</svg>";
}

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–06) — segmented control or chip row as a real radio group
// (arrow keys, roving tabindex, lock). radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id)}) -> {set, get, lock, paint}
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && !i) ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = 0; else i = (i + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ===== groups on a tetrahedral centre =====
// Whole groups (plan palette). el: the attaching atom (its colour, course plan §4); n: element counts; smi: SMILES branch
// for the C2 namer; r: ball radius in bond lengths. Keys double as ASCII labels (digits become subscripts).
var GR = {
  H:{ t:"H", el:"H", n:{ H:1 }, smi:"", r:0.27 },
  CH3:{ t:"CH₃", el:"C", n:{ C:1, H:3 }, smi:"C", r:0.38 },
  C2H5:{ t:"C₂H₅", el:"C", n:{ C:2, H:5 }, smi:"CC", r:0.43 },
  C3H7:{ t:"C₃H₇", el:"C", n:{ C:3, H:7 }, smi:"CCC", r:0.45 },
  OH:{ t:"OH", el:"O", n:{ O:1, H:1 }, smi:"O", r:0.34 },
  Cl:{ t:"Cl", el:"Cl", n:{ Cl:1 }, smi:"Cl", r:0.36 },
  Br:{ t:"Br", el:"Br", n:{ Br:1 }, smi:"Br", r:0.38 },
  NH2:{ t:"NH₂", el:"N", n:{ N:1, H:2 }, smi:"N", r:0.38 },
  COOH:{ t:"COOH", el:"C", n:{ C:1, O:2, H:1 }, smi:"C(=O)O", r:0.45 },
  CH2OH:{ t:"CH₂OH", el:"C", n:{ C:1, H:3, O:1 }, smi:"CO", r:0.48 },
  OCH3:{ t:"OCH₃", el:"O", n:{ O:1, C:1, H:3 }, smi:"OC", r:0.45 }
};
var PAL = ["H", "CH3", "C2H5", "C3H7", "OH", "Cl", "Br", "NH2", "COOH", "CH2OH", "OCH3"];      // palette order (plan)
var LIST = ["H", "OH", "CH2OH", "OCH3", "NH2", "COOH", "Cl", "Br", "CH3", "C2H5", "C3H7"];     // listing order (plan's group lists)
var CIP = ["Br", "Cl", "OCH3", "OH", "NH2", "COOH", "CH2OH", "C3H7", "C2H5", "CH3", "H"];      // ranking that labels form 1 / form 2
var PNAME = { C3H7:"C₃H₇ (propyl)" };
var SLOTS = ["w", "d", "l", "r"], SLN = { w:"wedge", d:"dash", l:"left", r:"right" };
// slot directions in the drawing: left and right in the page, wedge and dash below them (toward / away from you)
var TD = { w:[0, -0.5774, 0.8165], d:[0, -0.5774, -0.8165], l:[-0.8165, 0.5774, 0], r:[0.8165, 0.5774, 0] };
var SUBD = "₀₁₂₃₄₅₆₇₈₉", NW = ["no", "one", "two", "three", "four"];
function subs(s){ return String(s).replace(/\d/g, function(d){ return SUBD[+d]; }); }
function byList(a, b){ return LIST.indexOf(a) - LIST.indexOf(b); }
function gsOf(g){ return SLOTS.map(function(s){ return g[s]; }); }
function gList(g){ return gsOf(g).sort(byList).map(function(k){ return GR[k].t; }).join(" · "); }
function isChiral(g){ var a = gsOf(g); return a.every(function(x, i){ return a.indexOf(x) === i; }); }
function counts(g){ var c = {}; gsOf(g).forEach(function(k){ c[k] = (c[k] || 0) + 1; }); return c; }
function dupText(g){ var c = counts(g); return Object.keys(c).filter(function(k){ return c[k] > 1; }).sort(byList).map(function(k){ return NW[c[k]] + " " + (k === "H" ? "H atoms" : GR[k].t + " groups"); }).join(" and "); }
function tFormula(g){ var n = { C:1 }; gsOf(g).forEach(function(k){ var c = GR[k].n; Object.keys(c).forEach(function(e){ n[e] = (n[e] || 0) + c[e]; }); }); return n; }
function tF(g){ return fStr(tFormula(g)); }
function tSmi(g){ var gs = gsOf(g).filter(function(k){ return k !== "H"; }).sort(byList).map(function(k){ return GR[k].smi; }); return gs.length ? "C" + gs.slice(0, -1).map(function(s){ return "(" + s + ")"; }).join("") + gs[gs.length - 1] : "C"; }
function tName(g){ var N = NM.name(mol(tSmi(g))); return N.ok ? N.name : ""; }
function formOf(g, dirs){ if (!isChiral(g)) return 0; dirs = dirs || TD; var s = SLOTS.slice().sort(function(a, b){ return CIP.indexOf(g[a]) - CIP.indexOf(g[b]); }); return det3(dirs[s[0]], dirs[s[1]], dirs[s[2]]) < 0 ? 1 : 2; }
var LEFTF = { H:"H", CH3:"H₃C", C2H5:"C₂H₅", C3H7:"C₃H₇", OH:"HO", Cl:"Cl", Br:"Br", NH2:"H₂N", COOH:"HOOC", CH2OH:"HOCH₂", OCH3:"CH₃O" };
var CARB = ["CH3", "C2H5", "C3H7", "CH2OH", "COOH"], HET = ["OH", "OCH3", "NH2", "Cl", "Br"];
// condensed formula around the centre, e.g. H₃C–C*H(OH)–C₂H₅
function condensed(g, star){
  var gs = gsOf(g), nH = gs.filter(function(k){ return k === "H"; }).length;
  var cs = gs.filter(function(k){ return CARB.indexOf(k) >= 0; }).sort(function(a, b){ return CARB.indexOf(a) - CARB.indexOf(b); });
  var hs = gs.filter(function(k){ return HET.indexOf(k) >= 0; }).sort(function(a, b){ return HET.indexOf(a) - HET.indexOf(b); });
  var c = "C" + (star ? "*" : "") + (nH ? "H" + (nH > 1 ? subs(nH) : "") : ""), order2 = cs.concat(hs);
  if (!order2.length) return "CH₄";
  if (order2.length === 1) return c + "–" + GR[order2[0]].t;
  var left = order2.shift(), right = cs.length >= 2 ? cs[cs.length - 1] : order2[order2.length - 1];
  order2.splice(order2.lastIndexOf(right), 1);
  return LEFTF[left] + "–" + c + order2.map(function(k){ return "(" + GR[k].t + ")"; }).join("") + "–" + GR[right].t;
}

// ===== 3D math (row-major 3×3 matrices, quaternions [w, x, y, z]) =====
var I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
function mm(A, B){ var C = []; for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) C[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]; return C; }
function mv(A, v){ return [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]]; }
function rx(a){ var c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, c, -s, 0, s, c]; }
function ry(a){ var c = Math.cos(a), s = Math.sin(a); return [c, 0, s, 0, 1, 0, -s, 0, c]; }
function det3(a, b, c){ return a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]); }
function cols(u, v, w){ return [u[0], v[0], w[0], u[1], v[1], w[1], u[2], v[2], w[2]]; }
function inv3(A){
  var a = A[0], b = A[1], c = A[2], d = A[3], e = A[4], f = A[5], g = A[6], h = A[7], k = A[8];
  var D = a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g);
  return [(e * k - f * h) / D, (c * h - b * k) / D, (b * f - c * e) / D, (f * g - d * k) / D, (a * k - c * g) / D, (c * d - a * f) / D, (d * h - e * g) / D, (b * g - a * h) / D, (a * e - b * d) / D];
}
function qOf(M){
  var t = M[0] + M[4] + M[8], s, q;
  if (t > 0) { s = Math.sqrt(t + 1) * 2; q = [0.25 * s, (M[7] - M[5]) / s, (M[2] - M[6]) / s, (M[3] - M[1]) / s]; }
  else if (M[0] > M[4] && M[0] > M[8]) { s = Math.sqrt(1 + M[0] - M[4] - M[8]) * 2; q = [(M[7] - M[5]) / s, 0.25 * s, (M[1] + M[3]) / s, (M[2] + M[6]) / s]; }
  else if (M[4] > M[8]) { s = Math.sqrt(1 + M[4] - M[0] - M[8]) * 2; q = [(M[2] - M[6]) / s, (M[1] + M[3]) / s, 0.25 * s, (M[5] + M[7]) / s]; }
  else { s = Math.sqrt(1 + M[8] - M[0] - M[4]) * 2; q = [(M[3] - M[1]) / s, (M[2] + M[6]) / s, (M[5] + M[7]) / s, 0.25 * s]; }
  var n = Math.hypot(q[0], q[1], q[2], q[3]); return q.map(function(v){ return v / n; });
}
function mOf(q){ var w = q[0], x = q[1], y = q[2], z = q[3]; return [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]; }
function slerp(a, b, t){
  var d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  if (d < 0) { b = b.map(function(v){ return -v; }); d = -d; }
  if (d > 0.9995) { var r = a.map(function(v, i){ return v + (b[i] - v) * t; }), n = Math.hypot(r[0], r[1], r[2], r[3]); return r.map(function(v){ return v / n; }); }
  var th = Math.acos(d), sn = Math.sin(th), wa = Math.sin((1 - t) * th) / sn, wb = Math.sin(t * th) / sn;
  return a.map(function(v, i){ return v * wa + b[i] * wb; });
}
function rotAxis(ax, ang){ var n = Math.hypot(ax[0], ax[1], ax[2]), s = Math.sin(ang / 2); return mOf([Math.cos(ang / 2), ax[0] / n * s, ax[1] / n * s, ax[2] / n * s]); }
function ortho(M){ return mOf(qOf(M)); }
var Q0 = [1, 0, 0, 0];
var R0 = mm(rx(0.2), ry(0.42));
// Best-fit try: the proper rotation Q that lays the mirror image (Mm·R) onto the original with the groups in slots a and b
// traded (a tetrahedral transposition). Q·Mm·R·v_a = R·v_b, Q·Mm·R·v_b = R·v_a, the other two land on their own slots.
function tryRot(R, Mm, a, b){
  var c = SLOTS.filter(function(s){ return s !== a && s !== b; })[0];
  var A = cols(mv(Mm, mv(R, TD[a])), mv(Mm, mv(R, TD[b])), mv(Mm, mv(R, TD[c]))), B = cols(mv(R, TD[b]), mv(R, TD[a]), mv(R, TD[c]));
  return ortho(mm(B, inv3(A)));
}
function bestPairs(g){
  for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) if (g[SLOTS[i]] === g[SLOTS[j]]) return [[SLOTS[i], SLOTS[j]]];
  return [["w", "d"], ["l", "r"], ["l", "d"]];
}

// ===== @component C1 mirrorView — group-ball 3D models (a chiral centre with whole groups as labelled balls in their atom
// colours), wedge / hashed / plain bonds chosen from depth, mismatch rings in --hi, a mirror plane in --ink-2 at 30%.
// sceneSVG(scene, cx, cy, s, {rings:[atom idx], op}) · tetraAtoms(g, R, {star}) · twoAtoms(mol, f, R, {star}) · mirrorPlane(G)
var GD = 1.4;
function tetraAtoms(g, R, o){
  o = o || {};
  var at = [{ p:[0, 0, 0], lab:"C", el:"C", r:0.27, star:!!o.star }];
  SLOTS.forEach(function(s){ var k = g[s]; at.push({ p:mv(R, TD[s]).map(function(v){ return v * GD; }), lab:k, el:GR[k].el, r:GR[k].r, slot:s }); });
  return { atoms:at, bonds:[[0, 1], [0, 2], [0, 3], [0, 4]] };
}
// two-centre molecule (CH₃–C*H(X)–C*H(Cl)–CH₃) as a zigzag chain in the page with X and H on a wedge and a dash at each
// centre. Form A (the same handedness at both centres) puts X on the wedge at C2 and at C3, so AB (X wedge at C2, dash at
// C3) is the meso arrangement: it has a centre of symmetry, and its mirror image BA is the same molecule.
var TW = (function(){ var L = 1.05, D = 1.12, c2 = TD.r.map(function(v){ return -v * L / 2; }), c3 = TD.r.map(function(v){ return v * L / 2; });
  function add(c, d){ return [c[0] + d[0] * D, c[1] + d[1] * D, c[2] + d[2] * D]; }
  return { c2:c2, c3:c3, C1:add(c2, TD.l), C4:add(c3, [0.8165, -0.5774, 0]), w2:add(c2, TD.w), d2:add(c2, TD.d), w3:add(c3, [0, 0.5774, 0.8165]), d3:add(c3, [0, 0.5774, -0.8165]) }; })();
function twoAtoms(mol2, f, R, o){
  o = o || {};
  var X1 = mol2 === "cb" ? "OH" : "Cl", x2w = f[0] === "A", x3w = f[1] === "A";
  function at(p, k){ return { p:p.slice(), lab:k, el:GR[k].el, r:GR[k].r }; }
  var A = [{ p:TW.c2.slice(), lab:"C", el:"C", r:0.27, star:!!o.star }, { p:TW.c3.slice(), lab:"C", el:"C", r:0.27, star:!!o.star },
    at(TW.C1, "CH3"), at(x2w ? TW.w2 : TW.d2, X1), at(x2w ? TW.d2 : TW.w2, "H"),
    at(TW.C4, "CH3"), at(x3w ? TW.w3 : TW.d3, "Cl"), at(x3w ? TW.d3 : TW.w3, "H")];
  A.forEach(function(a){ a.p = mv(R, a.p); });
  return { atoms:A, bonds:[[0, 1, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7]] };
}
function boundR(sc){ var m = 0; sc.atoms.forEach(function(a){ m = Math.max(m, Math.hypot(a.p[0], a.p[1], a.p[2]) + a.r); }); return m; }
function xfScene(sc, M){ return { atoms:sc.atoms.map(function(a){ return Object.assign({}, a, { p:mv(M, a.p) }); }), bonds:sc.bonds }; }
function bondSVG(A, B, ra, rb, st, s){
  var dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy); if (L < (ra + rb) * 0.9 + 2) return "";
  var ux = dx / L, uy = dy / L, px = -uy, py = ux, x1 = A[0] + ux * ra * 0.8, y1 = A[1] + uy * ra * 0.8, x2 = B[0] - ux * rb * 0.85, y2 = B[1] - uy * rb * 0.85, w = clamp(s * 0.2, 8, 18);
  if (st === "w") return '<polygon points="' + [x1 + px, y1 + py, x2 + px * w / 2, y2 + py * w / 2, x2 - px * w / 2, y2 - py * w / 2, x1 - px, y1 - py].map(r1).join(" ") + '" fill="var(--ink)"/>';
  if (st === "h") { var n = 7, h = ""; for (var k = 0; k < n; k++) { var t = (k + 0.7) / n, cx = x1 + (x2 - x1) * t, cy = y1 + (y2 - y1) * t, hw = 1.2 + (w / 2 - 1.2) * t; h += '<line x1="' + r1(cx + px * hw) + '" y1="' + r1(cy + py * hw) + '" x2="' + r1(cx - px * hw) + '" y2="' + r1(cy - py * hw) + '"/>'; } return '<g stroke="var(--ink)" stroke-width="2" stroke-linecap="round">' + h + "</g>"; }
  return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="var(--ink)" stroke-width="' + r1(clamp(s * 0.05, 2.2, 3.4)) + '" stroke-linecap="round"/>';
}
function ballSVG(a, X, Y, r, ring){
  var col = MV.chem.atom(a.el), h = "", fs = Math.min(r * 0.98, r * 1.74 / estW(a.lab, 1));
  if (ring) h += '<circle cx="' + r1(X) + '" cy="' + r1(Y) + '" r="' + r1(r + 5) + '" fill="none" stroke="var(--hi)" stroke-width="4.5"/>';
  h += '<circle cx="' + r1(X) + '" cy="' + r1(Y) + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.6"' : "") + "/>";
  h += '<text x="' + r1(X) + '" y="' + r1(Y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="700" fill="' + col.ink + '">' + tsp(a.lab, fs) + "</text>";
  if (a.star) h += '<text x="' + r1(X + r * 0.9) + '" y="' + r1(Y - r * 0.55) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(Math.max(15, r * 1.25)) + '" font-weight="700" fill="var(--ink)" stroke="var(--sheet)" stroke-width="3.5" paint-order="stroke">*</text>';
  return h;
}
function sceneSVG(sc, cx, cy, s, o){
  o = o || {};
  var at = sc.atoms, P = at.map(function(a){ return [cx + a.p[0] * s, cy - a.p[1] * s]; }), R = at.map(function(a){ return a.r * s * (1 + 0.07 * a.p[2]); }), items = [], out = "", rg = {};
  (o.rings || []).forEach(function(i){ rg[i] = 1; });
  sc.bonds.forEach(function(b){ items.push({ z:(at[b[0]].p[2] + at[b[1]].p[2]) / 2 - 0.02, b:b }); });
  at.forEach(function(a, i){ items.push({ z:a.p[2], i:i }); });
  items.sort(function(p, q){ return p.z - q.z; });
  items.forEach(function(it){
    if (it.b) {
      var a = at[it.b[0]], b = at[it.b[1]], d = Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1], b.p[2] - a.p[2]) || 1, rz = (b.p[2] - a.p[2]) / d;
      out += bondSVG(P[it.b[0]], P[it.b[1]], R[it.b[0]], R[it.b[1]], it.b[2] ? "p" : rz > 0.5 ? "w" : rz < -0.5 ? "h" : "p", s);
    } else out += ballSVG(at[it.i], P[it.i][0], P[it.i][1], R[it.i], rg[it.i]);
  });
  return o.op != null && o.op < 0.999 ? '<g opacity="' + r1(Math.max(0, o.op) * 100) / 100 + '">' + out + "</g>" : out;
}
function screenOf(sc, i, cx, cy, s){ var a = sc.atoms[i]; return [cx + a.p[0] * s, cy - a.p[1] * s, a.r * s * (1 + 0.07 * a.p[2])]; }
function mirrorPlane(G, W, H){
  if (G.side) { var x = G.mx, y0 = 10, y1 = H - 10; return '<polygon points="' + [x - 7, y0 + 18, x + 7, y0, x + 7, y1 - 18, x - 7, y1].join(" ") + '" fill="var(--ink-2)" opacity=".3"/><text x="' + r1(x + 11) + '" y="20" font-size="12" fill="var(--ink-2)">mirror</text>'; }
  var y = G.my, x0 = 8, x1 = W - 8;
  return '<polygon points="' + [x0 + 18, y - 7, x1, y - 7, x1 - 18, y + 7, x0, y + 7].join(" ") + '" fill="var(--ink-2)" opacity=".3"/><text x="' + r1(x0 + 4) + '" y="' + r1(y - 12) + '" font-size="12" fill="var(--ink-2)">mirror</text>';
}

// rotation controls for a 3D stage: drag, arrow keys (on the stage or anything in it) and buttons
function turnable(stage, rotHost, svg, o){
  rotHost.innerHTML = '<span class="tiny muted">Turn the model:</span>' + [["l", "⟲", "Turn left"], ["r", "⟳", "Turn right"], ["u", "↑", "Tilt up"], ["d", "↓", "Tilt down"]].map(function(b){ return '<button type="button" class="btn ghost sm" data-rot="' + b[0] + '" data-k="rot' + b[0] + '" aria-label="' + b[2] + '">' + b[1] + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" data-rot="0" data-k="rot0">Reset view</button>';
  function turn(dx, dy){ if (o.busy()) return; o.set(ortho(mm(rx(dy), mm(ry(dx), o.get())))); o.onTurn(); }
  rotHost.addEventListener("click", function(e){ var b = e.target.closest("[data-rot]"); if (!b || b.disabled) return; var r = b.dataset.rot; if (r === "0") { if (!o.busy()) { o.set(o.home()); o.onTurn(); } return; } turn(r === "l" ? -0.3 : r === "r" ? 0.3 : 0, r === "u" ? -0.3 : r === "d" ? 0.3 : 0); });
  stage.addEventListener("keydown", function(e){ var k = e.key, d = k === "ArrowLeft" ? [-0.26, 0] : k === "ArrowRight" ? [0.26, 0] : k === "ArrowUp" ? [0, -0.26] : k === "ArrowDown" ? [0, 0.26] : null; if (!d) return; e.preventDefault(); turn(d[0], d[1]); });
  var drag = null;
  svg.addEventListener("pointerdown", function(e){ if (o.busy()) return; drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
  svg.addEventListener("pointermove", function(e){ if (!drag) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x:e.clientX, y:e.clientY }; turn(dx * 0.012, dy * 0.012); });
  ["pointerup", "pointercancel"].forEach(function(ev){ svg.addEventListener(ev, function(){ drag = null; }); });
  return { lock:function(b){ $$("button", rotHost).forEach(function(x){ x.disabled = !!b; }); } };
}

// ===== hero: two hands at a mirror, then butan-2-ol and its mirror image =====
function handSVG(cx, cy, flip, sc, ring, op){
  var parts = ['<rect x="-30" y="-24" width="60" height="64" rx="18"/>', '<rect x="-28" y="-56" width="13" height="44" rx="6.5"/>', '<rect x="-13.7" y="-70" width="13" height="58" rx="6.5"/>',
    '<rect x="0.7" y="-74" width="13" height="62" rx="6.5"/>', '<rect x="15" y="-66" width="13" height="54" rx="6.5"/>'];
  var thumb = '<rect x="0" y="-7.5" width="42" height="15" rx="7.5" transform="translate(24 22) rotate(-50)"/>';
  var all = parts.join("") + thumb;
  return '<g transform="translate(' + r1(cx) + " " + r1(cy) + ") scale(" + (flip ? -sc : sc) + " " + sc + ')"' + (op != null && op < 0.999 ? ' opacity="' + r1(op * 100) / 100 + '"' : "") + ">" +
    '<g fill="none" stroke="var(--ink)" stroke-width="4.5">' + all + '</g><g fill="var(--sheet)">' + all + "</g>" +
    (ring ? '<g fill="none" stroke="var(--hi)" stroke-width="5">' + thumb + "</g>" : "") + "</g>";
}
function hero(){
  var host = $("#ml-hx-svg"), cap = $("#ml-hx-cap"), rep = $("#ml-hx-replay");
  if (!host) return;
  var W = 520, H = 300, g = { w:"OH", d:"H", l:"CH3", r:"C2H5" }, Mm = [-1, 0, 0, 0, 1, 0, 0, 0, 1], run = 0, DUR = 10200;
  var PAIRS = [["w", "d"], ["l", "r"], ["l", "d"]], QS = PAIRS.map(function(p){ return qOf(tryRot(R0, Mm, p[0], p[1])); });
  function pairTxt(p){ return GR[g[p[0]]].t + " and " + GR[g[p[1]]].t; }
  var CAPS = [[0, "Your left and right hands are mirror images."], [1500, "Lay one on top of the other: the thumbs miss."],
    [3300, "Butan-2-ol and its mirror image: a carbon with four different groups."]];
  PAIRS.forEach(function(p, k){ CAPS.push([4400 + k * 1500, "Try " + (k + 1) + ": turn the mirror image. " + cap1(pairTxt(p)) + " land in the wrong places."]); });
  CAPS.push([8900, "No turn makes all four groups match."], [9600, "<strong>Non-superimposable: enantiomers.</strong>"]);
  host.innerHTML = '<svg class="ml-hsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="A left hand and a right hand meet at a mirror; laid one on the other, the thumbs miss. Then butan-2-ol and its mirror image: three turns of the mirror image each leave two groups in the wrong places. Non-superimposable: enantiomers."></svg>';
  var svg = $("svg", host), sc0 = tetraAtoms(g, R0);
  function frame(t){
    var out = mirrorPlane({ side:true, mx:W / 2 }, W, H), hOp = t < 3300 ? 1 : 1 - ease((t - 3300) / 900), mOp = t < 3300 ? 0 : ease((t - 3300) / 900);
    if (hOp > 0.01) {
      var u = ease(t / 1400), xL = W / 2 - 66 - 120 * (1 - u), xR = W / 2 + 66 + 120 * (1 - u);
      if (t >= 1500) xR = lerp(W / 2 + 66, W / 2 - 66, ease((t - 1500) / 1000));
      var ring = t >= 2500 && t < 3500;
      out += handSVG(xL, 168, false, 1.12, ring, hOp) + handSVG(xR, 168, true, 1.12, ring, hOp * (t >= 1500 ? 0.86 : 1));
    }
    if (mOp > 0.01) {
      var q = Q0, rings = null, k;
      for (k = 0; k < 3; k++) {
        var t0 = 4400 + k * 1500;
        if (t >= t0) { q = slerp(k ? QS[k - 1] : Q0, QS[k], ease((t - t0) / 800)); if (t >= t0 + 800 && t < t0 + 1500) rings = [1 + SLOTS.indexOf(PAIRS[k][0]), 1 + SLOTS.indexOf(PAIRS[k][1])]; }
      }
      if (t >= 8900) q = slerp(QS[2], Q0, ease((t - 8900) / 650));
      var s = 54, img = xfScene(sc0, mm(mOf(q), Mm));
      out += sceneSVG(sc0, W * 0.25, 142, s, { rings:rings, op:mOp }) + sceneSVG(img, W * 0.75, 142, s, { rings:rings, op:mOp });
      out += '<g opacity="' + r1(mOp * 100) / 100 + '" font-size="16" fill="var(--ink-2)" text-anchor="middle"><text x="' + r1(W * 0.25) + '" y="' + (H - 12) + '">butan-2-ol</text><text x="' + r1(W * 0.75) + '" y="' + (H - 12) + '">its mirror image</text></g>';
    }
    svg.innerHTML = out;
  }
  function capAt(t){ var c = CAPS[0][1]; CAPS.forEach(function(x){ if (t >= x[0]) c = x[1]; }); return c; }
  function play(){
    var id = ++run, last = "";
    rep.hidden = true;
    MV.tween({ dur:DUR, ease:function(x){ return x; }, step:function(u){ if (id !== run) return; var t = u * DUR; frame(t); var c = capAt(t); if (c !== last) { last = c; cap.innerHTML = c; } },
      done:function(){ if (id !== run) return; frame(DUR); cap.innerHTML = CAPS[CAPS.length - 1][1]; rep.hidden = false; } });
  }
  rep.addEventListener("click", play);
  play();
}

// ===== Explore: Mirror lab =====
var FORMS = ["AA", "AB", "BA", "BB"];
function flipF(f){ return f.replace(/[AB]/g, function(c){ return c === "A" ? "B" : "A"; }); }
function rel(m2, a, b){ if (a === b) return "id"; var d = (a[0] !== b[0] ? 1 : 0) + (a[1] !== b[1] ? 1 : 0); if (d === 1) return "di"; return m2 === "dcb" && (a === "AB" || a === "BA") ? "id" : "en"; }
var RELN = { id:"identical", en:"enantiomers", di:"diastereomers" };
var TWO = { cb:{ t:"3-chlorobutan-2-ol", smi:"CC(O)C(Cl)C", cf:"CH₃–C*H(OH)–C*H(Cl)–CH₃" }, dcb:{ t:"2,3-dichlorobutane", smi:"CC(Cl)C(Cl)C", cf:"CH₃–C*H(Cl)–C*H(Cl)–CH₃" } };
function rotOf(p){ return 40 * (p - (100 - p)) / 100; }
var POLORD = MV.shuffle(Array.from({ length:24 }, function(_, i){ return i; }), "ml-polarimeter");
// polarimeter drawing: light → polarizer → sample tube → analyser dial (theta in degrees, + clockwise)
function polSVG(W, H, p, theta, two){
  var my = H * 0.44, xL = W * 0.055, xP = W * 0.16, xT0 = W * 0.24, xT1 = W * 0.63, rD = Math.min(W * 0.12, H * 0.3), xD = W - rD - 10, th = H * 0.36, out = "", fsz = clamp(W / 42, 11, 14);
  function plane(x, y, a, col, w){ var L = H * 0.12, s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180), x1 = x - s * L, y1 = y + c * L, x2 = x + s * L, y2 = y - c * L;
    return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="var(' + (col || "--ink") + ')" stroke-width="' + (w || 2.6) + '" stroke-linecap="round"/><circle cx="' + r1(x1) + '" cy="' + r1(y1) + '" r="2.6" fill="var(' + (col || "--ink") + ')"/><circle cx="' + r1(x2) + '" cy="' + r1(y2) + '" r="2.6" fill="var(' + (col || "--ink") + ')"/>'; }
  out += '<rect x="' + r1(xT0) + '" y="' + r1(my - th / 2) + '" width="' + r1(xT1 - xT0) + '" height="' + r1(th) + '" rx="14" fill="var(--info-bg)" stroke="var(--ink-2)" stroke-width="2"/>';
  var nP = Math.round(p / 100 * 24);
  for (var i = 0; i < 24; i++) { var col = i % 8, row = Math.floor(i / 8), gx = lerp(xT0 + 14, xT1 - 14, (col + 0.5) / 8), gy = my - th / 2 + th * (row + 0.5) / 3, plus = POLORD.indexOf(i) < nP;
    out += '<text x="' + r1(gx) + '" y="' + r1(gy) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fsz * 1.05) + '" font-weight="700" fill="var(' + (plus ? "--pen" : "--p-k") + ')" opacity=".55">' + (plus ? "+" : MINUS) + "</text>"; }
  out += '<line x1="' + r1(xL) + '" y1="' + r1(my) + '" x2="' + r1(xD - rD) + '" y2="' + r1(my) + '" stroke="var(--ink)" stroke-width="2.5"/>';
  out += '<circle cx="' + r1(xL) + '" cy="' + r1(my) + '" r="' + r1(Math.max(8, W * 0.026)) + '" fill="var(--hi)" stroke="var(--ink)" stroke-width="2"/>';
  out += '<rect x="' + r1(xP - 5) + '" y="' + r1(my - H * 0.2) + '" width="10" height="' + r1(H * 0.4) + '" rx="3" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>';
  out += plane((xP + xT0) / 2, my, 0);
  if (two) {
    var off = th * 0.22 * (1 - two.m), a1 = 40 * two.t, a2 = -40 * two.t;
    [[-off, a1, "--pen"], [off, a2, "--p-k"]].forEach(function(b){ for (var k = 0; k < 4; k++) out += plane(lerp(xT0 + 30, xT1 - 22, k / 3), my + b[0], b[1] * (k + 1) / 4 * (1 - two.m), b[2], 2.2); });
    out += plane((xT1 + xD - rD) / 2, my, 0);
    if (two.m < 0.5) out += '<text x="' + r1((xT0 + xT1) / 2) + '" y="' + r1(my - th / 2 - 8) + '" text-anchor="middle" font-size="' + r1(fsz) + '" fill="var(--ink)">(+) molecules: ' + sgnDeg(a1) + " · (" + MINUS + ") molecules: " + sgnDeg(a2) + "</text>";
  } else {
    for (var k2 = 0; k2 < 4; k2++) out += plane(lerp(xT0 + 30, xT1 - 22, k2 / 3), my, theta * (k2 + 1) / 4);
    out += plane((xT1 + xD - rD) / 2, my, theta);
  }
  // analyser dial
  out += '<circle cx="' + r1(xD) + '" cy="' + r1(my) + '" r="' + r1(rD) + '" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>';
  for (var d = -90; d <= 90; d += 10) { var sa = Math.sin(d * Math.PI / 180), ca = Math.cos(d * Math.PI / 180), big = d % 40 === 0 && Math.abs(d) <= 40;
    out += '<line x1="' + r1(xD + sa * rD * (big ? 0.76 : 0.86)) + '" y1="' + r1(my - ca * rD * (big ? 0.76 : 0.86)) + '" x2="' + r1(xD + sa * rD) + '" y2="' + r1(my - ca * rD) + '" stroke="var(--ink-2)" stroke-width="' + (big ? 2 : 1.2) + '"/>';
    if (big && rD > 34) out += '<text x="' + r1(xD + sa * rD * 0.56) + '" y="' + r1(my - ca * rD * 0.56) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(fsz * 0.78) + '" fill="var(--ink-2)">' + sgnNum(d) + "</text>"; }
  function needle(a, col, dash){ var sa = Math.sin(a * Math.PI / 180), ca = Math.cos(a * Math.PI / 180); return '<line x1="' + r1(xD) + '" y1="' + r1(my) + '" x2="' + r1(xD + sa * rD * 0.9) + '" y2="' + r1(my - ca * rD * 0.9) + '" stroke="var(' + col + ')" stroke-width="3" stroke-linecap="round"' + (dash ? ' stroke-dasharray="5 4"' : "") + "/>"; }
  if (two) out += needle(40 * two.t * (1 - two.m), "--pen", true) + needle(-40 * two.t * (1 - two.m), "--p-k", true) + (two.m > 0 ? needle(0, "--ink") : "");
  else out += needle(theta, "--ink");
  out += '<circle cx="' + r1(xD) + '" cy="' + r1(my) + '" r="4" fill="var(--ink)"/>';
  var shown = two ? (two.m > 0.5 ? 0 : null) : theta;
  out += '<text x="' + r1(xD) + '" y="' + r1(my + rD + 22) + '" text-anchor="middle" font-size="' + r1(fsz * 1.35) + '" font-weight="700" fill="var(--ink)">' + (shown == null ? "±40°" : sgnDeg(shown)) + "</text>";
  out += '<g font-size="' + r1(fsz) + '" fill="var(--ink-2)" text-anchor="middle"><text x="' + r1(xL + 4) + '" y="' + r1(my - H * 0.27) + '">light</text><text x="' + r1(xP) + '" y="' + r1(my + H * 0.3) + '">polarizer</text><text x="' + r1((xT0 + xT1) / 2) + '" y="' + r1(my + th / 2 + 20) + '">sample tube</text><text x="' + r1(xD) + '" y="' + r1(my - rD - 8) + '">analyser</text></g>';
  return out;
}

function explore(host, api){
  var S = api.S, C = api.content, RU = C.rules, TCS = {};
  C.challenges.forEach(function(c){ TCS[c.id] = c; });
  if (["one", "two", "pol"].indexOf(S.mode) < 0) S.mode = "one";
  if (!S.g || typeof S.g !== "object" || !SLOTS.every(function(s){ return GR[S.g[s]]; })) S.g = cp(C.start);
  S.refl = !!S.refl; S.named = !!S.named; if (!S.res || typeof S.res !== "object") S.res = null;
  var T = S.two = S.two && typeof S.two === "object" ? S.two : {};
  if (T.mol !== "dcb") T.mol = "cb"; if (FORMS.indexOf(T.f) < 0) T.f = "AA"; T.refl = !!T.refl; T.named = !!T.named;
  T.sel = (Array.isArray(T.sel) ? T.sel : []).filter(function(f, i, a){ return FORMS.indexOf(f) >= 0 && a.indexOf(f) === i; }).slice(-2);
  if (!Array.isArray(T.log)) T.log = []; if (FORMS.indexOf(T.meso) < 0) T.meso = null;
  var P = S.pol = S.pol && typeof S.pol === "object" ? S.pol : {}; P.p = +P.p >= 0 ? clamp(Math.round(+P.p / 5) * 5, 0, 100) : 100;
  var ROT = { one:R0.slice(), two:R0.slice() }, busy = false, fx = null, palSlot = null, swapMode = false, swapSel = [], cap = "", cfb = null, mfb = null, mesoMode = false, polAnim = null, polTwo = null;
  function btn(id, t){ return '<button type="button" class="btn ghost sm" data-x="' + id + '" data-k="mlx' + id + '">' + t + "</button>"; }
  host.innerHTML = '<p class="how ml-how">' + C.how + '</p><div class="ml-grid"><div class="ml-left" data-mv="graph"><div class="ml-modes"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ml-stage" tabindex="0" role="group" aria-label="Mirror lab model. Arrow keys turn it."><svg class="ml-svg" viewBox="0 0 560 300" role="img" aria-label="Model"></svg><div class="ml-ov"></div></div>' +
    '<div class="ml-polbox" hidden><svg class="ml-psvg" viewBox="0 0 560 240" role="img" aria-label="Polarimeter"></svg></div>' +
    '<div class="ml-rot"></div><p class="ml-cap" aria-live="polite"></p>' +
    '<div class="ml-p" data-p="one"><div class="ml-btns" role="group" aria-label="Mirror lab buttons">' + btn("refl", "Reflect") + btn("try", "Try to superimpose") + btn("swap", "Swap two groups") + btn("name", "Name it") + '</div><div class="ml-pal"></div><div class="ml-name" aria-live="polite"></div></div>' +
    '<div class="ml-p" data-p="two"><div class="ml-mol2"></div><div class="ml-frow"><div class="ml-f2"></div><div class="ml-f3"></div></div><div class="ml-btns" role="group" aria-label="Two-centre buttons">' + btn("refl2", "Reflect") + btn("name2", "Name it") + '</div><div class="ml-name" data-n="2" aria-live="polite"></div>' +
      '<p class="ml-sub">' + C.twoNote + '</p><div class="ml-cards" role="group" aria-label="Stereoisomer cards"></div><div class="ml-call" aria-live="polite"></div><div class="ml-meso" aria-live="polite"></div></div>' +
    '<div class="ml-p" data-p="pol"><div class="ml-samp"></div><div class="ml-slrow"><label for="ml-sl">(+) form in the sample</label><input type="range" id="ml-sl" class="ml-sl" min="0" max="100" step="5"><output class="ml-slv" for="ml-sl"></output></div><p class="tiny muted">' + C.polNote + "</p></div>" +
    '</div><div class="ml-right"><dl class="read ml-read" aria-live="polite"></dl></div></div>';
  var svg = $(".ml-svg", host), ov = $(".ml-ov", host), psvg = $(".ml-psvg", host), stage = $(".ml-stage", host), W = 560, H = 300, PW = 560, PH = 240;
  var modeRG = radios($(".ml-modes", host), { label:"Mode", aria:"Mirror lab mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; palSlot = null; swapMode = false; swapSel = []; cap = ""; api.save(); paint(); } });
  var mol2RG = radios($(".ml-mol2", host), { label:"Molecule", aria:"Two-centre molecule", cls:"chips", options:[{ id:"cb", t:TWO.cb.t }, { id:"dcb", t:TWO.dcb.t }], value:T.mol, onChange:function(v){ T.mol = v; T.sel = []; cfb = null; mfb = null; mesoMode = false; api.save(); paint(); } });
  var f2RG = radios($(".ml-f2", host), { label:"C2", aria:"Form of C2", options:[{ id:"A", t:"Form A" }, { id:"B", t:"Form B" }], value:T.f[0], onChange:function(v){ T.f = v + T.f[1]; api.save(); paint(); } });
  var f3RG = radios($(".ml-f3", host), { label:"C3", aria:"Form of C3", options:[{ id:"A", t:"Form A" }, { id:"B", t:"Form B" }], value:T.f[1], onChange:function(v){ T.f = T.f[0] + v; api.save(); paint(); } });
  function sampOf(){ return P.p === 100 ? "plus" : P.p === 0 ? "minus" : "mix"; }
  var sampRG = radios($(".ml-samp", host), { label:"Sample", aria:"Polarimeter sample", options:[{ id:"plus", t:"Pure (+)" }, { id:"minus", t:"Pure (" + MINUS + ")" }, { id:"mix", t:"Mixture" }], value:sampOf(),
    onChange:function(v){ setPct(v === "plus" ? 100 : v === "minus" ? 0 : (P.p === 0 || P.p === 100 ? 50 : P.p)); } });
  var turnCtl = turnable(stage, $(".ml-rot", host), svg, { get:function(){ return ROT[S.mode === "two" ? "two" : "one"]; }, set:function(M){ ROT[S.mode === "two" ? "two" : "one"] = M; },
    home:function(){ return R0.slice(); }, busy:function(){ return busy || S.mode === "pol"; }, onTurn:function(){ if (S.mode === "one") fx = null; paintModel(); } });
  var sl = $(".ml-sl", host);
  sl.addEventListener("input", function(){ if (!busy) setPct(clamp(Math.round(+sl.value / 5) * 5, 0, 100)); });
  function setPct(np){
    var old = rotOf(P.p); P.p = np; sampRG.set(sampOf()); api.save();
    var to = rotOf(np); polAnim = { from:polAnim ? lerp(polAnim.from, polAnim.to, polAnim.t) : old, to:to, t:0 };
    var a = polAnim;
    paintCtl(); paintRead(); MV.changed();
    MV.tween({ dur:450, step:function(t){ if (polAnim !== a) return; a.t = t; paintPol(); }, done:function(){ if (polAnim === a) { polAnim = null; paintPol(); } } });
  }

  // ---------- geometry and drawing ----------
  function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60) { var h = Math.round(cw >= 470 ? cw * 0.54 : cw * 1.55); if (cw !== W || h !== H) { W = cw; H = h; svg.setAttribute("viewBox", "0 0 " + W + " " + H); } } }
  function geom(){ var side = W >= 470; return side ? { side:true, o1:[W * 0.25, H * 0.46], o2:[W * 0.75, H * 0.46], mx:W / 2, bw:W / 2 - 18, bh:H - 64, M:[-1, 0, 0, 0, 1, 0, 0, 0, 1] }
    : { side:false, o1:[W / 2, H * 0.235], o2:[W / 2, H * 0.74], my:H * 0.485, bw:W - 20, bh:H / 2 - 50, M:[1, 0, 0, 0, -1, 0, 0, 0, 1] }; }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0 && S.mode !== "pol") paintModel(); }).observe(svg);
  if (window.ResizeObserver) new ResizeObserver(function(){ if (S.mode === "pol") paintPol(); }).observe(psvg);
  function oneScene(gg){
    gg = gg || S.g;
    var sc = tetraAtoms(gg, ROT.one, { star:S.named && isChiral(gg) });
    if (fx && fx.swap && !gg._img) {
      var ia = 1 + SLOTS.indexOf(fx.swap.a), ib = 1 + SLOTS.indexOf(fx.swap.b), pa = sc.atoms[ia].p, pb = sc.atoms[ib].p, t = fx.swap.t;
      function arc(u, v, t2){ var m = [lerp(u[0], v[0], t2), lerp(u[1], v[1], t2), lerp(u[2], v[2], t2)], n = Math.hypot(m[0], m[1], m[2]) || 1, k = GD * (1 + 0.35 * Math.sin(Math.PI * t2)) / n; return m.map(function(x){ return x * k; }); }
      sc.atoms[ia].p = arc(pa, pb, t); sc.atoms[ib].p = arc(pb, pa, t);
    }
    return sc;
  }
  function describe(Gm){
    if (S.mode === "two") return TWO[T.mol].t + ", arrangement " + T.f + " (C2 form " + T.f[0] + ", C3 form " + T.f[1] + ")" + (T.refl ? ". Its mirror image, " + flipF(T.f) + ", is shown across the mirror." : ".");
    var g = S.g, d = SLOTS.map(function(s){ return GR[g[s]].t + " on the " + SLN[s]; }).join(", ");
    return "A carbon with " + d + "." + (S.refl ? " Its mirror image is shown " + (Gm.side ? "to the right of" : "below") + " the mirror." : " Press Reflect to show its mirror image.");
  }
  function paintModel(){
    if (S.mode === "pol") return;
    size();
    var Gm = geom(), two = S.mode === "two", out = mirrorPlane(Gm, W, H);
    var sc = two ? twoAtoms(T.mol, T.f, ROT.two, { star:T.named }) : oneScene(), Rb = 1.9, s = Math.min(Gm.bw, Gm.bh) / (2 * Rb);
    var rings = fx && fx.rings ? fx.rings.map(function(x){ return 1 + SLOTS.indexOf(x); }) : null, o1 = Gm.o1;
    out += sceneSVG(sc, o1[0], o1[1], s, { rings:rings });
    var show = two ? T.refl : (S.refl || (fx && fx.em != null));
    var ly1 = Gm.side ? H - 18 : 22, ly2 = Gm.side ? H - 18 : Gm.my + 32, lab1 = two ? T.f : "Original", lab2 = two ? "Mirror image: " + flipF(T.f) : "Mirror image";
    if (!two && S.named && isChiral(S.g)) { var f1 = formOf(S.g); lab1 += ": form " + f1; lab2 += ": form " + (3 - f1); }
    if (show) {
      var base = two ? sc : (fx && fx.imgG ? tetraAtoms(fx.imgG, ROT.one, { star:S.named && isChiral(fx.imgG) }) : sc);
      var Q = fx && fx.q ? mOf(fx.q) : I3, em = fx && fx.em != null ? fx.em : 1, sl2 = fx && fx.sl || 0;
      var isc = { atoms:base.atoms.map(function(a){ var p = mv(Q, mv(Gm.M, a.p)); if (em < 1) { p = p.slice(); if (Gm.side) p[0] *= em; else p[1] *= em; } return Object.assign({}, a, { p:p }); }), bonds:base.bonds };
      var mp = Gm.side ? [Gm.mx, o1[1]] : [o1[0], Gm.my], c2 = [lerp(mp[0], Gm.o2[0], em), lerp(mp[1], Gm.o2[1], em)];
      if (sl2) c2 = [lerp(c2[0], o1[0], sl2), lerp(c2[1], o1[1], sl2)];
      out += sceneSVG(isc, c2[0], c2[1], s, { rings:rings, op:Math.min(em, 1 - 0.35 * sl2) });
      out += '<text x="' + r1(Gm.side ? Gm.o2[0] : 12) + '" y="' + r1(ly2) + '" text-anchor="' + (Gm.side ? "middle" : "start") + '" font-size="14" fill="var(--ink-2)">' + lab2 + "</text>";
    } else out += '<text x="' + r1(Gm.o2[0]) + '" y="' + r1(Gm.o2[1]) + '" text-anchor="middle" font-size="14" fill="var(--ink-2)">Press Reflect</text>';
    out += '<text x="' + r1(Gm.side ? o1[0] : 12) + '" y="' + r1(ly1) + '" text-anchor="' + (Gm.side ? "middle" : "start") + '" font-size="14" fill="var(--ink-2)">' + lab1 + "</text>";
    svg.innerHTML = out; svg.setAttribute("aria-label", describe(Gm));
    var html = "";
    if (!two && !busy) html = SLOTS.map(function(sl3, k){
      var p = screenOf(sc, k + 1, o1[0], o1[1], s), d = Math.max(36, p[2] * 2), on = swapMode ? swapSel.indexOf(sl3) >= 0 : palSlot === sl3;
      return '<button type="button" class="ml-slot' + (on ? " on" : "") + '" style="left:' + r1(p[0] / W * 100) + "%;top:" + r1(p[1] / H * 100) + "%;width:" + r1(d) + "px;height:" + r1(d) + 'px" data-slot="' + sl3 + '" data-k="slot' + sl3 + '" aria-pressed="' + on + '" aria-label="' + cap1(SLN[sl3]) + " slot: " + esc(MV.plain(GR[S.g[sl3]].t)) + (swapMode ? ". Select it to swap." : ". Press Enter to choose a group.") + '"></button>';
    }).join("");
    MV.keepFocus(ov, function(){ ov.innerHTML = html; });
  }
  function paintPol(){
    if (S.mode !== "pol") return;
    var cw = Math.round(psvg.getBoundingClientRect().width);
    if (cw > 60) { var h = Math.round(Math.max(200, cw * 0.43)); if (cw !== PW || h !== PH) { PW = cw; PH = h; psvg.setAttribute("viewBox", "0 0 " + PW + " " + PH); } }
    var th = polAnim ? lerp(polAnim.from, polAnim.to, ease(polAnim.t)) : rotOf(P.p);
    psvg.innerHTML = polSVG(PW, PH, polTwo ? 50 : P.p, th, polTwo);
    psvg.setAttribute("aria-label", "Polarimeter: light passes a polarizer, then a sample tube holding " + P.p + "% (+) and " + (100 - P.p) + "% (−) molecules. The analyser reads " + sgnDeg(rotOf(P.p)) + ".");
  }
  function pressed(id, on){ var b = host.querySelector('[data-x="' + id + '"]'); if (b) b.setAttribute("aria-pressed", String(!!on)); }
  function mesoFound(){ return T.meso === "AB" || T.meso === "BA"; }
  function paintCtl(){
    var md = S.mode;
    $$(".ml-p", host).forEach(function(p){ p.hidden = p.dataset.p !== md; });
    stage.hidden = md === "pol"; $(".ml-polbox", host).hidden = md !== "pol"; $(".ml-rot", host).hidden = md === "pol";
    modeRG.lock(busy); mol2RG.lock(busy); f2RG.lock(busy); f3RG.lock(busy); sampRG.lock(busy); turnCtl.lock(busy);
    f2RG.set(T.f[0]); f3RG.set(T.f[1]); mol2RG.set(T.mol); sampRG.set(sampOf());
    sl.value = P.p; sl.disabled = busy; sl.setAttribute("aria-valuetext", P.p + "% (+), " + (100 - P.p) + "% (−)");
    $(".ml-slv", host).textContent = P.p + "% (+) · " + (100 - P.p) + "% (" + MINUS + ")";
    $$("[data-x]", host).forEach(function(b){ b.disabled = busy; });
    pressed("refl", S.refl); pressed("swap", swapMode); pressed("name", S.named); pressed("refl2", T.refl); pressed("name2", T.named);
    // palette
    var ph = "";
    if (palSlot && !busy && md === "one") ph = '<div class="ml-palh"><span class="ml-sub">Choose a group for the ' + SLN[palSlot] + ' slot</span><button type="button" class="btn ghost sm" data-palx="1" data-k="palx">Close</button></div><div class="ml-chips" role="group" aria-label="Group palette">' +
      PAL.map(function(k){ var on = S.g[palSlot] === k; return '<button type="button" class="chip ml-chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-pal="' + k + '" data-k="pal' + k + '">' + (PNAME[k] || GR[k].t) + "</button>"; }).join("") + "</div>";
    MV.keepFocus($(".ml-pal", host), function(){ $(".ml-pal", host).innerHTML = ph; });
    // name cards
    var g = S.g, ch = isChiral(g), nh = "";
    if (S.named) { var nm = tName(g); nh = "<p><strong>" + (nm || "—") + "</strong>" + (ch ? " (form " + formOf(g) + ")" : "") + ": " + condensed(g, ch) + " · " + F(tF(g)) + "</p><p class=\"tiny muted\">" + (ch ? "* marks the chiral centre. Form 1 and form 2 label the two enantiomers" + (S.refl ? "; the mirror image is form " + (3 - formOf(g)) : "") + "." : "No chiral centre: " + dupText(g) + ".") + "</p>"; }
    $('.ml-name:not([data-n])', host).innerHTML = nh;
    var n2 = T.named ? "<p><strong>" + NM.name(mol(TWO[T.mol].smi)).name + "</strong>: " + TWO[T.mol].cf + " · " + F(fText(mol(TWO[T.mol].smi))) + '</p><p class="tiny muted">* marks each chiral centre: C2 and C3.</p>' : "";
    $('.ml-name[data-n="2"]', host).innerHTML = n2;
    // two-centre cards
    var cards = FORMS.map(function(f){
      var on = T.sel.indexOf(f) >= 0, ms = T.mol === "dcb" && T.meso === f, same = !ms && T.mol === "dcb" && mesoFound() && (f === "AB" || f === "BA"), sc = twoAtoms(T.mol, f, R0);
      return '<button type="button" class="ml-card' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-card="' + f + '" data-k="card' + f + '"' + (busy ? " disabled" : "") + ' aria-label="Arrangement ' + f + ": C2 form " + f[0] + ", C3 form " + f[1] + (ms ? ", meso chip here" : same ? ", the same molecule as " + T.meso : "") + '"><span class="ml-cl">' + f + '</span><svg viewBox="0 0 150 96" aria-hidden="true">' + sceneSVG(sc, 75, 48, 36) + "</svg>" + (ms ? '<span class="ml-mchip">meso</span>' : same ? '<span class="ml-mchip">= ' + T.meso + "</span>" : "") + "</button>";
    }).join("");
    MV.keepFocus($(".ml-cards", host), function(){ $(".ml-cards", host).innerHTML = cards; });
    var ch2 = "";
    if (T.sel.length === 2) {
      ch2 = '<p class="ml-sub">How are ' + T.sel[0] + " and " + T.sel[1] + ' related?</p><div class="chips">' + [["id", "Identical"], ["en", "Enantiomers"], ["di", "Diastereomers"]].map(function(c){ return '<button type="button" class="chip" data-call="' + c[0] + '" data-k="call' + c[0] + '"' + (busy ? " disabled" : "") + ">" + c[1] + "</button>"; }).join("") + "</div>";
      if (cfb) ch2 += MV.fbHTML(cfb.ok ? "good" : "bad", cfb.html);
    } else ch2 = '<p class="tiny muted">' + (T.sel.length ? "Tap one more card." : "Tap two cards to compare them.") + "</p>";
    MV.keepFocus($(".ml-call", host), function(){ $(".ml-call", host).innerHTML = ch2; });
    var mh = "";
    if (T.mol === "dcb") { mh = '<div class="q-actions"><button type="button" class="btn ghost sm" data-x="meso" data-k="mlxmeso" aria-pressed="' + mesoMode + '"' + (busy ? " disabled" : "") + ">" + (mesoMode ? "Now tap a card for the meso chip" : "Place the meso chip") + "</button>" + (T.meso ? '<span class="tiny muted">The chip is on ' + T.meso + ".</span>" : "") + "</div>"; if (mfb) mh += MV.fbHTML(mfb.ok ? "good" : "bad", mfb.html); }
    MV.keepFocus($(".ml-meso", host), function(){ $(".ml-meso", host).innerHTML = mh; });
  }
  function muted(t){ return '<span class="muted">' + t + "</span>"; }
  function paintRead(){
    var rows, md = S.mode;
    if (md === "one") {
      var g = S.g, ch = isChiral(g), nm = tName(g);
      rows = [["Groups on the centre", gList(g)], ["Four different groups?", ch ? "Yes" : "No: " + dupText(g) + "."],
        ["Mirror image", !S.refl ? muted("Press Reflect to see it.") : !S.res ? muted("Press Try to superimpose.") : S.res.ok ? "Superimposable: the same molecule" : "Not superimposable: an enantiomer"],
        ["Molecule", (nm || "—") + (ch ? " (chiral)" : " (not chiral)")], ["Formula", F(tF(g))],
        ["Swapping two groups gives", ch ? "The other enantiomer" : muted("— (only when chiral)")]];
    } else if (md === "two") {
      var last = null;
      if (T.sel.length === 2) T.log.forEach(function(x){ if (x.mol === T.mol && ((x.a === T.sel[0] && x.b === T.sel[1]) || (x.a === T.sel[1] && x.b === T.sel[0]))) last = x; });
      var mesoView = T.mol === "dcb" && mesoFound() && (T.f === "AB" || T.f === "BA");
      rows = [["Molecule", TWO[T.mol].t + ": two chiral centres (C2 and C3)"], ["Showing", T.f + " (C2 form " + T.f[0] + ", C3 form " + T.f[1] + ")"],
        ["Mirror image", T.refl ? flipF(T.f) + (mesoView ? " (the same molecule: meso)" : "") : muted("Press Reflect to see it.")], ["Maximum stereoisomers", "2² = 4"],
        ["Different stereoisomers", T.mol === "cb" ? "4: AA, AB, BA and BB" : mesoFound() ? "3: AA, BB and the meso form AB = BA" : muted("? Find the arrangement that is its own mirror image.")],
        ["Pair", last ? last.a + " and " + last.b + ": " + RELN[last.rel] + (last.rel === "di" ? " (one centre differs)" : last.rel === "en" ? " (both centres differ)" : " (the same molecule: meso)") : muted(T.sel.length === 2 ? "Say how they’re related." : "Tap two cards.")]];
    } else {
      var p = P.p, q = 100 - p, v = rotOf(p);
      rows = [["Sample", p === 100 ? "Pure (+)" : p === 0 ? "Pure (" + MINUS + ")" : "Mixture"], ["Composition", p + "% (+), " + q + "% (" + MINUS + ")"],
        ["Excess", p === q ? "none: racemic" : Math.abs(p - q) + "% " + (p > q ? "(+)" : "(" + MINUS + ")")],
        ["Polarimeter", "<strong>" + sgnDeg(v) + "</strong> (model value: a pure sample gives 40° in this tube)"], ["Working", "40° × (" + p + " " + MINUS + " " + q + ") ÷ 100 = " + sgnDeg(v)]];
    }
    $(".ml-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var c = cap;
    if (!c && S.mode === "one") c = swapMode ? "Tap two slots to swap their groups." : "";
    if (!c && S.mode === "two") c = mesoMode ? "Tap the card that is identical to its own mirror image." : "";
    $(".ml-cap", host).innerHTML = c;
  }
  function paint(){ paintCtl(); if (S.mode === "pol") paintPol(); else paintModel(); paintRead(); paintCap(); MV.changed(); }
  function resetRes(){ S.res = null; fx = null; }

  // ---------- actions ----------
  function reflect(done){
    busy = true; S.refl = true; S.res = null; fx = { em:0 }; cap = ""; palSlot = null; swapMode = false; paintCtl(); paintCap();
    MV.tween({ dur:800, step:function(t){ fx.em = t; paintModel(); }, done:function(){ fx = null; busy = false; cap = "The mirror image appears on the other side of the mirror."; api.save(); if (done) done(); else paint(); } });
  }
  function tryIt(done){
    if (!S.refl) { reflect(function(){ tryIt(done); }); return; }
    busy = true; palSlot = null; swapMode = false; swapSel = []; paintCtl();
    var g = cp(S.g), Gm = geom(), pairs = bestPairs(g), tries = [], qa = Q0;
    fx = { q:Q0 };
    function txt(){ return tries.map(function(x, k){ return "Try " + (k + 1) + ": " + (x.ok ? "all four groups match." : "2 groups don’t match (" + GR[g[x.a]].t + " and " + GR[g[x.b]].t + ")."); }).join(" "); }
    function finish(ok){ busy = false; S.res = { ok:ok }; cap = txt() + (ok ? " <strong>It lies exactly on the original: superimposable, the same molecule.</strong>" : " <strong>No turn works. Not superimposable: an enantiomer.</strong>"); api.save(); if (done) done(); else paint(); }
    function slideMatch(){
      MV.tween({ dur:700, step:function(t){ fx.sl = t; paintModel(); }, done:function(){
        MV.wait(1000, function(){ MV.tween({ dur:500, step:function(t){ fx.sl = 1 - t; paintModel(); }, done:function(){ fx.sl = 0; finish(true); } }); });
      } });
    }
    function step(k){
      if (k >= pairs.length) { MV.tween({ dur:600, step:function(t){ fx.q = slerp(qa, Q0, t); paintModel(); }, done:function(){ fx = null; finish(false); } }); return; }
      var pr = pairs[k], qb = qOf(tryRot(ROT.one, Gm.M, pr[0], pr[1])), same = g[pr[0]] === g[pr[1]];
      cap = (tries.length ? txt() + " " : "") + "Try " + (k + 1) + ": turning the mirror image…"; paintCap();
      MV.tween({ dur:900, step:function(t){ fx.q = slerp(qa, qb, t); paintModel(); }, done:function(){
        qa = qb; tries.push({ a:pr[0], b:pr[1], ok:same });
        fx.rings = same ? null : [pr[0], pr[1]]; cap = txt(); paintModel(); paintCap();
        MV.wait(same ? 300 : 1100, function(){ fx.rings = null; if (same) slideMatch(); else step(k + 1); });
      } });
    }
    step(0);
  }
  function doSwap(a, b, done){
    busy = true; swapMode = false; swapSel = []; palSlot = null; var ga = S.g[a], gb = S.g[b];
    fx = { swap:{ a:a, b:b, t:0 } }; paintCtl();
    MV.tween({ dur:900, step:function(t){ fx.swap.t = t; paintModel(); }, done:function(){
      S.g[a] = gb; S.g[b] = ga; resetRes(); busy = false;
      cap = ga === gb ? "Both slots held " + GR[ga].t + ", so nothing changed." : "Swapped " + GR[ga].t + " and " + GR[gb].t + "." + (isChiral(S.g) ? " Swapping two groups on a chiral centre gives the other enantiomer." : "");
      api.save(); if (done) done(); else paint();
    } });
  }
  function runP3(done){
    reflect(function(){
      var old = cp(S.g), a = SLOTS.filter(function(s){ return old[s] === "OH"; })[0], b = SLOTS.filter(function(s){ return old[s] === "CH3"; })[0];
      busy = true; fx = { imgG:old, swap:{ a:a, b:b, t:0 } }; paintCtl();
      cap = "Swap the OH and the CH₃ on the original…"; paintCap();
      MV.tween({ dur:900, step:function(t){ fx.swap.t = t; paintModel(); }, done:function(){
        delete fx.swap; S.g[a] = old[b]; S.g[b] = old[a]; S.res = null;
        var qb = qOf(tryRot(ROT.one, geom().M, a, b));
        cap = "Now turn the mirror image of the old molecule…"; paintCap();
        MV.tween({ dur:900, step:function(t){ fx.q = slerp(Q0, qb, t); paintModel(); }, done:function(){
          MV.tween({ dur:700, step:function(t){ fx.sl = t; paintModel(); }, done:function(){
            MV.wait(900, function(){ MV.tween({ dur:500, step:function(t){ fx.sl = 1 - t; paintModel(); }, done:function(){ fx = null; busy = false; cap = "The swapped model matches the mirror image exactly: swapping two groups gives the enantiomer."; api.save(); done(); } }); });
          } });
        } });
      } });
    });
  }
  function runP4(done){
    busy = true; polTwo = { t:0, m:0 }; paintCtl(); cap = "In a 50 : 50 mixture, half the molecules are (+) and half are (" + MINUS + ")…"; paintCap();
    MV.tween({ dur:1600, step:function(t){ polTwo.t = t; paintPol(); }, done:function(){
      cap = "The (+) molecules turn the plane +40°; the (" + MINUS + ") molecules turn it " + MINUS + "40°."; paintCap();
      MV.wait(900, function(){ MV.tween({ dur:900, step:function(t){ polTwo.m = t; paintPol(); }, done:function(){ polTwo = null; busy = false; cap = "Together they make no net turn: 0°. A racemic mixture is optically inactive."; done(); } }); });
    } });
  }
  function focusSlot(s){ var b = ov.querySelector('[data-slot="' + s + '"]'); if (b) b.focus({ preventScroll:true }); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.slot) {
      var s = b.dataset.slot;
      if (swapMode) {
        var i = swapSel.indexOf(s); if (i >= 0) swapSel.splice(i, 1); else swapSel.push(s);
        if (swapSel.length === 2) { doSwap(swapSel[0], swapSel[1]); return; }
        cap = swapSel.length ? "Now tap a second slot to swap with the " + SLN[swapSel[0]] + " slot." : ""; paint(); focusSlot(s); return;
      }
      palSlot = palSlot === s ? null : s; cap = ""; paint();
      if (palSlot) { var c = $('[data-pal="' + S.g[palSlot] + '"]', host); if (c) c.focus({ preventScroll:true }); } else focusSlot(s);
      return;
    }
    if (b.dataset.pal) { var ps = palSlot; S.g[ps] = b.dataset.pal; resetRes(); palSlot = null; cap = GR[b.dataset.pal].t + " is now on the " + SLN[ps] + " slot."; api.save(); paint(); focusSlot(ps); return; }
    if (b.dataset.palx) { var p0 = palSlot; palSlot = null; paint(); focusSlot(p0); return; }
    var x = b.dataset.x;
    if (x === "refl") { if (S.refl) { S.refl = false; resetRes(); cap = ""; api.save(); paint(); } else reflect(); return; }
    if (x === "try") { tryIt(); return; }
    if (x === "swap") { swapMode = !swapMode; swapSel = []; palSlot = null; cap = ""; paint(); return; }
    if (x === "name") { S.named = !S.named; api.save(); paint(); return; }
    if (x === "refl2") { T.refl = !T.refl; api.save(); paint(); return; }
    if (x === "name2") { T.named = !T.named; api.save(); paint(); return; }
    if (x === "meso") { mesoMode = !mesoMode; paint(); return; }
    if (b.dataset.card) {
      var f = b.dataset.card;
      if (mesoMode) {
        T.meso = f; mesoMode = false;
        mfb = f === "AB" || f === "BA" ? { ok:true, html:"<strong>✓ " + f + " is meso.</strong> It has an internal mirror plane, so its mirror image (" + flipF(f) + ") is the same molecule. 2,3-dichlorobutane has 3 stereoisomers, not 4." }
          : { ok:false, html:"<strong>✗ Not quite.</strong> " + (f === "AA" ? TCS.tc3.mesoAA : TCS.tc3.mesoBB) };
        api.save(); paint(); MV.focusFb($(".ml-meso", host)); return;
      }
      var j = T.sel.indexOf(f); if (j >= 0) T.sel.splice(j, 1); else { T.sel.push(f); if (T.sel.length > 2) T.sel.shift(); }
      cfb = null; api.save(); paint(); return;
    }
    if (b.dataset.call && T.sel.length === 2) {
      var A = T.sel[0], B = T.sel[1], r = rel(T.mol, A, B), cl = b.dataset.call, ok = cl === r, why;
      T.log.push({ mol:T.mol, a:A, b:B, rel:r, call:cl, ok:ok }); if (T.log.length > 60) T.log.shift();
      if (r === "en") why = "Both centres differ: " + A + " and " + B + " are mirror images, so they’re enantiomers." + (ok ? "" : " " + RU.m5);
      else if (r === "di") why = ok ? "Only one centre differs, so they aren’t mirror images: diastereomers." : cl === "en" ? TCS.tc3.calledEn + " " + RU.m5 : "Only one centre differs, so they’re different compounds: diastereomers.";
      else why = "AB and BA are mirror images, but AB has an internal mirror plane, so they’re the same molecule (meso).";
      cfb = { ok:ok, html:(ok ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + why };
      api.save(); paint(); MV.focusFb($(".ml-call", host));
    }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Escape" && palSlot && !busy) { var p0 = palSlot; palSlot = null; paint(); focusSlot(p0); } });

  // ---------- challenges ----------
  function chal(id){
    if (id === "tc1") {
      var g = S.g, c = counts(g), f = tF(g), tc = TCS.tc1;
      if (f === "C4H9Cl" && isChiral(g)) return { ok:true };
      if (c.H === 2 && c.Cl === 1 && c.C3H7 === 1) return { ok:false, msg:tc.twoH };
      if (c.CH3 === 3 && c.Cl === 1) return { ok:false, msg:tc.threeMe };
      if (c.H === 1 && c.Cl === 1 && c.CH3 === 1 && c.C3H7 === 1) return { ok:false, msg:tc.c5 };
      if (f !== "C4H9Cl") return { ok:false, msg:"Your molecule is " + F(f) + "; you need C₄H₉Cl (One centre mode)." };
      return { ok:false, msg:"That’s C₄H₉Cl, but it has " + dupText(g) + ": not chiral." };
    }
    if (id === "tc2") {
      var p = P.p, t2 = TCS.tc2;
      if (p === 25) return { ok:true };
      if (p === 75) return { ok:false, msg:t2.p75 }; if (p === 50) return { ok:false, msg:t2.p50 }; if (p === 20) return { ok:false, msg:t2.p20 };
      if (p === 0) return { ok:false, msg:"Pure (" + MINUS + ") gives " + MINUS + "40°. You want half of that: use a mixture." };
      return { ok:false, msg:"That gives 40 × (" + p + " " + MINUS + " " + (100 - p) + ") ÷ 100 = " + sgnDeg(rotOf(p)) + "." };
    }
    if (id === "tc3") {
      var L = T.log, iE = -1, iD = -1, k, t3 = TCS.tc3, lastCb = null;
      L.forEach(function(x){ if (x.mol === "cb") lastCb = x; });
      for (k = 0; k < L.length; k++) if (L[k].mol === "cb" && L[k].ok && L[k].rel === "en") { iE = k; break; }
      if (iE >= 0) for (k = iE + 1; k < L.length; k++) if (L[k].mol === "cb" && L[k].ok && L[k].rel === "di") { iD = k; break; }
      var calledEn = lastCb && lastCb.rel === "di" && lastCb.call === "en";
      if (iE < 0) return { ok:false, msg:calledEn ? t3.calledEn : "In Two centres mode with 3-chlorobutan-2-ol, tap two cards that are enantiomers and call them enantiomers." };
      if (iD < 0) return { ok:false, msg:calledEn ? t3.calledEn : "Now tap a pair of diastereomers in 3-chlorobutan-2-ol and call them diastereomers." };
      if (T.meso === "AA") return { ok:false, msg:t3.mesoAA };
      if (T.meso === "BB") return { ok:false, msg:t3.mesoBB };
      if (!mesoFound()) return { ok:false, msg:"Now switch to 2,3-dichlorobutane and put the meso chip on the arrangement that is identical to its own mirror image." };
      return { ok:true };
    }
    return { ok:false };
  }

  // ---------- predictions ----------
  var pred = {
    start:function(p){
      busy = false; fx = null; palSlot = null; swapMode = false; swapSel = []; cap = ""; polTwo = null; polAnim = null;
      if (p.id === "p4") { S.mode = "pol"; P.p = p.pct; }
      else { S.mode = "one"; S.g = cp(p.g); S.refl = false; S.res = null; S.named = false; ROT.one = R0.slice(); }
      modeRG.set(S.mode); api.save(); paint();
    },
    run:function(p, done){
      function end(){ paint(); MV.wait(150, done); }
      if (p.id === "p1" || p.id === "p2") { reflect(function(){ tryIt(end); }); return; }
      if (p.id === "p3") { runP3(end); return; }
      runP4(end);
    }
  };
  paint();
  return { predict:pred, challenge:function(id){ return chal(id); } };
}

// ===== Part 3: Handedness in taste and medicine =====
// @component receptorGlove — a chiral receptor site (three shaped pockets + a flat wall for H) and a butan-2-ol enantiomer
// that can be moved in, turned (3-fold axis through the wall) and tipped (3-fold axis through the front pocket); counts the
// pockets matched. Form 1 (computed with the same ranking as the mirror lab) fits all three; form 2 matches at most two.
var SITE = { wall:[0, 1, 0], F:[0, -0.3333, 0.9428], RB:[0.8165, -0.3333, -0.4714], LB:[-0.8165, -0.3333, -0.4714] };
var POCK = { LB:"C2H5", F:"CH3", RB:"OH" }, PKEYS = ["LB", "F", "RB"];
var GLOVE = { 1:{ wall:"H", RB:"OH", F:"CH3", LB:"C2H5" }, 2:{ wall:"H", LB:"OH", F:"CH3", RB:"C2H5" } };
var RV = rx(0.5);
function gloveAtoms(form, Rm){
  var base = GLOVE[form], at = [{ p:[0, 0, 0], lab:"C", el:"C", r:0.3, star:true }];
  ["wall", "RB", "F", "LB"].forEach(function(k){ var gid = base[k]; at.push({ p:mv(RV, mv(Rm, SITE[k])).map(function(v){ return v * GD; }), lab:gid, el:GR[gid].el, r:GR[gid].r, home:k }); });
  return { atoms:at, bonds:[[0, 1], [0, 2], [0, 3], [0, 4]] };
}
function gloveFit(form, Rm){
  var base = GLOVE[form], at = {}, n = 0;
  Object.keys(base).forEach(function(k){ var d = mv(Rm, SITE[k]); ["wall", "LB", "F", "RB"].forEach(function(pk){ var s = SITE[pk]; if (d[0] * s[0] + d[1] * s[1] + d[2] * s[2] > 0.9) at[pk] = base[k]; }); });
  PKEYS.forEach(function(pk){ if (at[pk] === POCK[pk]) n++; });
  return { n:n, at:at };
}
function gloveSVG(W, H, st, anim){
  var s = Math.min(W / 6.2, H / 4.6), cx = W / 2, cy = H * 0.5, out = "";
  out += '<path d="M ' + r1(cx - 2.25 * s) + " " + r1(cy - 0.35 * s) + " A " + r1(2.25 * s) + " " + r1(1.85 * s) + " 0 0 0 " + r1(cx + 2.25 * s) + " " + r1(cy - 0.35 * s) + '" fill="none" stroke="var(--ink-2)" stroke-width="3"/>';
  var wy = cy - mv(RV, SITE.wall)[1] * GD * s - 0.5 * s;
  out += '<line x1="' + r1(cx - 1.1 * s) + '" y1="' + r1(wy) + '" x2="' + r1(cx + 1.1 * s) + '" y2="' + r1(wy) + '" stroke="var(--ink-2)" stroke-width="6" stroke-linecap="round"/><text x="' + r1(cx + 1.25 * s) + '" y="' + r1(wy + 5) + '" font-size="13" fill="var(--ink-2)">flat wall (H)</text>';
  var fit = st.form ? gloveFit(st.form, mOf(st.q)) : null, inP = anim && anim.dy ? false : !!st.form;
  PKEYS.forEach(function(pk){
    var p = mv(RV, SITE[pk]), x = cx + p[0] * GD * s, y = cy - p[1] * GD * s, gid = POCK[pk], r = (GR[gid].r + 0.13) * s, ok = inP && fit && fit.at[pk] === gid;
    out += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + (ok ? "var(--hi-soft)" : "none") + '" stroke="var(--ink-2)" stroke-width="2" stroke-dasharray="6 4"/>';
    var lx = x, ly = pk === "F" ? y + r + 16 : y - r - 8;
    out += '<text x="' + r1(lx) + '" y="' + r1(ly) + '" text-anchor="middle" font-size="13" fill="var(--ink-2)">' + GR[gid].t + " pocket" + (ok ? " ✓" : "") + "</text>";
  });
  if (st.form) {
    var Rm = mOf(anim && anim.q ? anim.q : st.q), sc = gloveAtoms(st.form, Rm), dy = anim && anim.dy || 0, rings = [];
    if (inP && fit && !(anim && anim.q)) sc.atoms.forEach(function(a, i){ if (!i) return; var d = a.p; PKEYS.forEach(function(pk){ var pp = mv(RV, SITE[pk]).map(function(v){ return v * GD; }); if (Math.hypot(d[0] - pp[0], d[1] - pp[1], d[2] - pp[2]) < 0.2 && a.lab !== POCK[pk]) rings.push(i); }); });
    out += sceneSVG(sc, cx, cy - dy * s, s, { rings:rings });
  }
  return out;
}

function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  var G = S.st1 = S.st1 && typeof S.st1 === "object" ? S.st1 : {};
  if (G.form !== 1 && G.form !== 2) G.form = 0; if (!Array.isArray(G.q) || G.q.length !== 4) G.q = Q0.slice(); if (!G.best || typeof G.best !== "object") G.best = { 1:-1, 2:-1 };
  S.st2 = S.st2 && typeof S.st2 === "object" ? S.st2 : {}; if (typeof S.stse !== "string") S.stse = "";
  var busy = false, anim = null, msg1 = "", fb2 = {};
  host.innerHTML = '<div class="part ml-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="ml-glove"><svg class="ml-gsvg" viewBox="0 0 520 300" role="img" aria-label="Receptor site"></svg></div>' +
    '<div class="q-actions ml-gbtns" role="group" aria-label="Glove test buttons"><button type="button" class="btn ghost sm" data-gl="in1" data-k="glin1">Move form 1 in</button><button type="button" class="btn ghost sm" data-gl="in2" data-k="glin2">Move form 2 in</button>' +
    '<button type="button" class="btn ghost sm" data-gl="turn" data-k="glturn">Turn ⟳</button><button type="button" class="btn ghost sm" data-gl="tip" data-k="gltip">Tip over</button></div>' +
    '<dl class="read ml-gread" aria-live="polite"></dl><div class="ml-gcap" aria-live="polite"></div>' +
    '<details class="alg"><summary>' + s1.zoom + "</summary>" + s1.zoomHTML + "</details></div>" +
    '<div class="part ml-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="ml-carv"></div><div class="ml-s2"></div></div>' +
    '<div class="part ml-st"><h3>' + s3.title + '</h3><div class="ml-mcards">' + s3.cards.map(function(c){ return '<div class="ml-mcard"><h4>' + c.t + "</h4><p>" + c.html + "</p></div>"; }).join("") + "</div>" +
    '<div class="jq"><label for="ml-stse"><strong>STSE:</strong> ' + s3.stse + '</label><textarea id="ml-stse" rows="4"></textarea><div class="saved" id="ml-stse-saved" aria-live="polite"></div><p class="tiny muted">' + s3.stseNote + "</p></div></div>";
  var gsvg = $(".ml-gsvg", host), GW = 520, GH = 300;
  function gsize(){ var cw = Math.round(gsvg.getBoundingClientRect().width); if (cw > 60) { var h = Math.round(Math.max(260, Math.min(cw * 0.62, 340))); if (cw !== GW || h !== GH) { GW = cw; GH = h; gsvg.setAttribute("viewBox", "0 0 " + GW + " " + GH); } } }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = GW; gsize(); if (GW !== w0) draw1(); }).observe(gsvg);
  function draw1(){
    gsize(); gsvg.innerHTML = gloveSVG(GW, GH, G, anim);
    var f = G.form ? gloveFit(G.form, mOf(G.q)) : null;
    gsvg.setAttribute("aria-label", G.form ? "Receptor site with form " + G.form + " of butan-2-ol: " + f.n + " of 3 pockets hold their own group; " + (f.at.wall === "H" ? "H is on the flat wall." : GR[f.at.wall].t + " is against the flat wall.") : "Empty receptor site: three dashed pockets for OH, CH₃ and C₂H₅, and a flat wall for H.");
  }
  function paint1(){
    draw1();
    $$("[data-gl]", host).forEach(function(b){ b.disabled = busy || ((b.dataset.gl === "turn" || b.dataset.gl === "tip") && !G.form); });
    var f = G.form ? gloveFit(G.form, mOf(G.q)) : null, bst = function(k){ return G.best[k] < 0 ? "not tried yet" : G.best[k] + " of 3"; };
    $(".ml-gread", host).innerHTML = MV.readoutHTML([["In the site", G.form ? "form " + G.form + " of butan-2-ol" : "nothing yet"], ["Pockets matched", f ? "<strong>" + f.n + " of 3</strong>" + (f.n === 3 ? ": it fits" : "") : "—"],
      ["Flat wall", f ? (f.at.wall === "H" ? "H" : GR[f.at.wall].t + " (H belongs here)") : "—"], ["Best so far", "form 1: " + bst(1) + " · form 2: " + bst(2)]]);
    var done = G.best[1] === 3 && G.best[2] >= 0;
    $(".ml-gcap", host).innerHTML = (msg1 ? MV.fbHTML("", msg1) : "") + (done ? MV.fbHTML("good", "<strong>✓ " + s1.caption + "</strong> Form 2’s best is " + G.best[2] + " of 3" + (G.best[2] < 2 ? "; keep turning and tipping it: two can match, never three." : ": two can match, never three.")) : "");
  }
  function moveIn(form){
    busy = true; G.form = form; G.q = Q0.slice(); msg1 = ""; anim = { dy:2.6 };
    MV.tween({ dur:800, step:function(t){ anim.dy = 2.6 * (1 - t); draw1(); }, done:function(){ anim = null; busy = false; after(); } });
    paint1();
  }
  function rotate(axis){
    var Rm = mOf(G.q), Rn = ortho(mm(rotAxis(SITE[axis], 2 * Math.PI / 3), Rm)), qa = G.q.slice(), qb = qOf(Rn);
    busy = true; msg1 = ""; anim = { q:qa }; paint1();
    MV.tween({ dur:700, step:function(t){ anim.q = slerp(qa, qb, t); draw1(); }, done:function(){ G.q = qb; anim = null; busy = false; after(); } });
  }
  function after(){
    var f = gloveFit(G.form, mOf(G.q)); G.best[G.form] = Math.max(G.best[G.form], f.n);
    var wrong = PKEYS.filter(function(pk){ return f.at[pk] !== POCK[pk]; }).map(function(pk){ return GR[f.at[pk]].t + " in the " + GR[POCK[pk]].t + " pocket"; });
    msg1 = f.n === 3 ? "All three pockets match and H is on the flat wall: form " + G.form + " fits like a hand in its glove." : f.n + " of 3 pockets match. " + cap1(wrong.join("; ")) + ".";
    api.save(); paint1(); MV.focusFb($(".ml-gcap", host));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-gl]"); if (!b || b.disabled || busy) return;
    var k = b.dataset.gl;
    if (k === "in1" || k === "in2") moveIn(k === "in1" ? 1 : 2); else rotate(k === "turn" ? "wall" : "F");
  });

  // station 2: carvone
  function carvone(mirror){
    var s = 30, cx = 120, cy = 92, X = function(x){ return cx + (mirror ? -x : x) * s; }, Y = function(y){ return cy + y * s; }, out = "", w = 2.4;
    var R = [[0, -1], [0.866, -0.5], [0.866, 0.5], [0, 1], [-0.866, 0.5], [-0.866, -0.5]];
    function ln(a, b, cls){ return '<line x1="' + r1(X(a[0])) + '" y1="' + r1(Y(a[1])) + '" x2="' + r1(X(b[0])) + '" y2="' + r1(Y(b[1])) + '" stroke="var(--ink)" stroke-width="' + w + '" stroke-linecap="round"' + (cls || "") + "/>"; }
    function inner(a, b){ var mx = (a[0] + b[0]) / 2 * 0.78, my2 = (a[1] + b[1]) / 2 * 0.78, dx = (b[0] - a[0]) * 0.32, dy = (b[1] - a[1]) * 0.32; return ln([mx - dx, my2 - dy], [mx + dx, my2 + dy]); }
    for (var i = 0; i < 6; i++) out += ln(R[i], R[(i + 1) % 6]);
    out += inner(R[1], R[2]);
    out += ln([-0.1, -1], [-0.1, -1.75]) + ln([0.1, -1], [0.1, -1.75]) + '<text x="' + r1(X(0)) + '" y="' + r1(Y(-2.05)) + '" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="var(--at-o)">O</text>';
    out += ln(R[1], [1.73, -1]);
    var c5 = R[4], ca = [-1.73, 1], dxp = (ca[0] - c5[0]), dyp = (ca[1] - c5[1]), L = Math.hypot(dxp, dyp), px = -dyp / L * 0.13, py = dxp / L * 0.13;
    out += '<polygon points="' + [X(c5[0]), Y(c5[1]), X(ca[0] + px), Y(ca[1] + py), X(ca[0] - px), Y(ca[1] - py)].map(r1).join(" ") + '" fill="var(--ink)"/>';
    out += ln([ca[0] - 0.08, ca[1]], [ca[0] - 0.08, ca[1] + 0.95]) + ln([ca[0] + 0.08, ca[1]], [ca[0] + 0.08, ca[1] + 0.95]) + ln(ca, [-2.6, 0.5]);
    out += '<text x="' + r1(X(c5[0] + 0.3)) + '" y="' + r1(Y(c5[1] + 0.05)) + '" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="700" fill="var(--ink)">*</text>';
    return out;
  }
  $(".ml-carv", host).innerHTML = '<div class="ml-carvrow"><figure><svg viewBox="0 0 240 190" role="img" aria-label="Skeletal structure of carvone from spearmint oil: a six-membered ring with a C=O, a methyl on the C=C, and the side group on a solid wedge at the starred chiral centre, lower left.">' + carvone(false) + "</svg><figcaption>Carvone from spearmint oil</figcaption></figure>" +
    '<div class="ml-cmir" aria-hidden="true"></div><figure><svg viewBox="0 0 240 190" role="img" aria-label="Its mirror image: carvone from caraway seed, the same structure reflected left to right.">' + carvone(true) + "</svg><figcaption>Carvone from caraway seed</figcaption></figure></div>";
  function paint2(){
    var h = '<div class="tbl-wrap"><table class="vt ml-ctab"><caption class="vh">Carvone data</caption><thead><tr>' + s2.cols.concat(["Same or differ?"]).map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>";
    s2.rows.forEach(function(r){
      var x = S.st2[r.id];
      h += "<tr><th scope=\"row\">" + r.p + "</th><td>" + r.a + "</td><td>" + r.b + '</td><td><div class="chips">' + [["same", "the same"], ["differ", "differ"]].map(function(c){ var on = x && x.pick === c[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s2="' + r.id + '" data-v="' + c[0] + '" data-k="s2' + r.id + c[0] + '"' + (x && x.ok ? " disabled" : "") + ">" + c[1] + "</button>"; }).join("") + "</div>" +
        (x ? '<p class="tiny ml-s2fb">' + (x.ok ? "✓ " : "✗ ") + (x.ok ? r.fb : (fb2[r.id] || "Not quite. Read the two columns again.")) + "</p>" : "") + "</td></tr>";
    });
    h += "</tbody></table></div>";
    if (s2.rows.every(function(r){ return S.st2[r.id] && S.st2[r.id].ok; })) h += MV.fbHTML("good", "<strong>✓ " + s2.done + "</strong>");
    MV.keepFocus($(".ml-s2", host), function(){ $(".ml-s2", host).innerHTML = h; });
  }
  $(".ml-s2", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-s2]"); if (!b || b.disabled) return;
    var r = s2.rows.filter(function(z){ return z.id === b.dataset.s2; })[0], ok = b.dataset.v === MV.ans(r);
    S.st2[r.id] = { pick:b.dataset.v, ok:ok }; fb2[r.id] = ok ? "" : (MV.ans(r) === "same" ? "Not quite. " + r.fb : "Not quite. Look at the two columns: they don’t match.");
    api.save(); paint2();
  });
  var ta = $("#ml-stse"), tmr = null;
  ta.value = S.stse;
  ta.addEventListener("input", function(){ S.stse = ta.value; clearTimeout(tmr); tmr = setTimeout(function(){ api.save(); $("#ml-stse-saved").textContent = "Saved"; }, 400); });
  paint1(); paint2();
}

// ===== Practice 1: Find the chiral centres (N8 tap-a-carbon) =====
function itemNav(a, S, done){
  var i = clamp(S.i || 0, 0, a.items.length - 1);
  return '<div class="ml-nav" role="group" aria-label="Structures">' + a.items.map(function(it, k){ var d = done(it); return '<button type="button" class="chip ml-dot' + (k === i ? " on" : "") + '" aria-pressed="' + (k === i) + '" data-go="' + k + '" data-k="go' + a.id + k + '" aria-label="Structure ' + (k + 1) + (d ? ", solved" : "") + '">' + (k + 1) + (d ? " ✓" : "") + "</button>"; }).join("") + "</div>";
}
function centresAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {}; S.i = clamp(+S.i || 0, 0, a.items.length - 1);
  var fb = {};
  function ist(id){ var x = S.items[id]; if (!x || typeof x !== "object") x = S.items[id] = { pick:[], tries:0, hint:0, solved:false, first:false }; if (!Array.isArray(x.pick)) x.pick = []; return x; }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="ml-navh"></div><div class="ml-item"><p class="ml-ln"></p><div class="ml-cv"></div><div class="ml-iact"></div></div>';
  function cur(){ return a.items[S.i]; }
  function carbons(m){ return m.a.map(function(x, i){ return x.el === "C" ? i : -1; }).filter(function(i){ return i >= 0; }); }
  var V = molView($(".ml-cv", host), { w:520, h:200, phone:0.62, onPick:function(k, i){
    var it = cur(), x = ist(it.id); if (x.solved) return;
    var j = x.pick.indexOf(i); if (j >= 0) x.pick.splice(j, 1); else x.pick.push(i);
    fb[it.id] = null; api.save(); paint();
  }, label:function(k, i){ var it = cur(), L = layout(mol(it.smi)), on = ist(it.id).pick.indexOf(i) >= 0; return "Carbon " + it.locs[i] + " (" + L.lbl[i] + ")" + (on ? ", starred as a chiral centre" : "") + ". Select to " + (on ? "remove the star." : "star it."); } });
  function why(m, i, L){
    var h = hc(m)[i], A = adj(m), RU = rules();
    if (A[i].some(function(j){ return order(m, i, j) > 1; })) return "C" + L + " has a C=O: only three groups. " + RU.m7;
    if (h >= 2) return "C" + L + " has " + NW[h] + " H atoms.";
    return "C" + L + " has two identical groups. " + RU.m1;
  }
  function paintView(){
    var it = cur(), x = ist(it.id), m = mol(it.smi), show = x.solved ? MV.ans(it) : x.pick;
    V.show(m, { picks:x.solved ? false : carbons(m), on:x.pick, smax:54, glow:show,
      nums:m.a.map(function(_, i){ return it.locs[i] != null ? { i:i, t:String(it.locs[i]), side:-1 } : null; }).filter(Boolean).concat(show.map(function(i){ return { i:i, t:"*", side:1, col:"--ink" }; })),
      aria:"Structure of " + MV.plain(it.name) + ", " + MV.plain(it.cf) + ". Starred: " + (show.length ? show.map(function(i){ return "C" + it.locs[i]; }).join(", ") : "none") + "." });
  }
  function paintAct(){
    var it = cur(), x = ist(it.id), h = "", hints = a.hintsAll.concat([it.reason]);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-a="done" data-k="cdone">Done</button><button type="button" class="btn ghost sm" data-a="none" data-k="cnone">None</button>' +
      '<button type="button" class="btn ghost sm" data-a="clear" data-k="cclr"' + (x.pick.length ? "" : " disabled") + ">Clear stars</button>" + MV.hintBtn("chint", x.hint) + "</div>" + MV.hintsHTML(hints, x.hint);
    if (fb[it.id]) h += MV.fbHTML(fb[it.id].ok ? "good" : "bad", fb[it.id].html);
    else if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.reason + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-a="prev" data-k="cprev"' + (S.i ? "" : " disabled") + '>Previous</button><button type="button" class="btn ghost sm" data-a="next" data-k="cnext"' + (S.i < a.items.length - 1 ? "" : " disabled") + ">Next</button></div>";
    MV.keepFocus($(".ml-iact", host), function(){ $(".ml-iact", host).innerHTML = h; });
  }
  function paint(){
    var it = cur();
    MV.keepFocus($(".ml-navh", host), function(){ $(".ml-navh", host).innerHTML = itemNav(a, S, function(z){ return ist(z.id).solved; }); });
    $(".ml-ln", host).innerHTML = "<strong>" + (S.i + 1) + ".</strong> " + it.name + ", " + it.cf;
    paintView(); paintAct();
  }
  function check(none){
    var it = cur(), x = ist(it.id), ans = MV.ans(it).slice().sort(asc), m = mol(it.smi);
    if (!none && !x.pick.length) { fb[it.id] = { ok:false, html:"Tap the chiral centres first, or press None if there aren’t any." }; return; }
    if (none) x.pick = [];
    var pk = x.pick.slice().sort(asc);
    if (ans.join() === pk.join()) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; fb[it.id] = { ok:true, html:"<strong>✓ Correct.</strong> " + it.reason + (x.first ? "" : ' <span class="muted">(not first try)</span>') }; return; }
    x.tries++;
    var extra = pk.filter(function(i){ return ans.indexOf(i) < 0; }), miss = ans.filter(function(i){ return pk.indexOf(i) < 0; }), msg;
    if (extra.length) msg = (it.tap && it.tap[extra[0]]) || why(m, extra[0], it.locs[extra[0]]);
    else msg = (it.miss && it.miss[miss[0]]) || (none ? "Look again: at least one carbon has four different groups." : "Look again: another carbon has four different groups too.");
    fb[it.id] = { ok:false, html:"<strong>✗ Not quite.</strong> " + msg + " Try again." };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.closest(".ml-cv")) return;
    if (b.dataset.go != null) { S.i = +b.dataset.go; api.save(); paint(); return; }
    var it = cur(), x = ist(it.id), act = b.dataset.a;
    if (act === "prev" || act === "next") { S.i = clamp(S.i + (act === "next" ? 1 : -1), 0, a.items.length - 1); api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintAct(); return; }
    if (act === "clear") { x.pick = []; fb[it.id] = null; api.save(); paint(); return; }
    if (act === "done" || act === "none") { check(act === "none"); api.save(); paint(); MV.focusFb($(".ml-iact", host)); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.solved && x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ===== Practice 2: Stereo reasoning (number entry and one choice item) =====
function stereoAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ var x = S.items[id]; if (!x || typeof x !== "object") x = S.items[id] = { val:"", tries:0, hint:0, solved:false, first:false }; return x; }
  function byId(id){ return a.items.filter(function(it){ return it.id === id; })[0]; }
  function itemHTML(it, i){
    var x = ist(it.id), h;
    if (it.kind === "mc") return MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tags"><span class="tag">★</span></span>' : "") + "</div>";
    h += '<div class="numrow"><label for="st-' + it.id + '">Your answer:</label><input class="numin" id="st-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="m">' + it.unit + "</span>" : "") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    return h;
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q" data-si="' + it.id + '"></div>'; }).join("");
  function paintQ(it){ var box = host.querySelector('[data-si="' + it.id + '"]'); MV.keepFocus(box, function(){ box.innerHTML = itemHTML(it, a.items.indexOf(it)); }); }
  a.items.forEach(paintQ);
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (id) { ist(id).val = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-si]"); if (!box) return;
    var it = byId(box.dataset.si), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paintQ(it); return; }
    if (it.kind === "mc") {
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
      else if (b.dataset.act === "check" && x.choice != null) { x.checked = true; if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++; }
      api.save(); paintQ(it); if (b.dataset.act === "check") MV.focusFb(box); return;
    }
    if (b.dataset.act === "check") {
      var raw = String(x.val || "").replace(/°\s*C?/g, "").replace(/\s+/g, ""), vals = raw ? MV.parseNum(raw) : null;
      if (!vals || vals.length !== 1 || !isFinite(vals[0])) { msgs[it.id] = "Enter a number, such as 4 or 92."; paintQ(it); return; }
      var v = vals[0], ans = MV.ans(it);
      if (Math.abs(v - ans) < 1e-6) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; var w = (it.wrong || []).filter(function(z){ return Math.abs(z.match - v) < 1e-6; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : it.general || "Check your reasoning and try again.") + " Try again."; }
      api.save(); paintQ(it); MV.focusFb(box);
    }
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.solved && x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ===== Performance task: Build a chiral alcohol =====
var task = (function(){
  var S = null, api = null, T = null, svg = null, Rt = R0.slice(), W = 320, H = 250;
  function read(){
    if (!S) return { l:[false, false, false] };
    var gg = S.g, f = tF(gg), ch = isChiral(gg), gs = gsOf(gg), alc = gs.some(function(k){ return k === "OH" || k === "CH2OH"; }) && gs.indexOf("OCH3") < 0;
    return { g:cp(gg), f:f, chiral:ch, name:tName(gg), form:formOf(gg), l:[f === "C5H12O", ch, alc] };
  }
  function nameOf(k){ var p = String(k).split("|"); return p[0] + (+p[1] ? " (form " + p[1] + ")" : ""); }
  function draw(){
    if (!svg) return;
    var cw = Math.round(svg.getBoundingClientRect().width);
    if (cw > 60) { var h = Math.round(clamp(cw * 0.75, 220, 300)); if (cw !== W || h !== H) { W = cw; H = h; svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
    var gg = S.g, ch = isChiral(gg), sc = tetraAtoms(gg, Rt, { star:ch }), s = Math.min(W, H) / (2 * 1.8) * 0.96;
    svg.innerHTML = sceneSVG(sc, W / 2, H / 2, s);
    svg.setAttribute("aria-label", "Your molecule: a carbon with " + SLOTS.map(function(x){ return GR[gg[x]].t + " on the " + SLN[x]; }).join(", ") + ".");
  }
  function paintRead(){
    var d = read();
    $(".ml-tread").innerHTML = MV.readoutHTML([["Formula", F(d.f)], ["Name", (d.name || "—") + (d.chiral ? " (form " + d.form + ")" : "")], ["Chiral-centre test", d.chiral ? "Four different groups: a chiral centre" : "No: " + dupText(d.g) + "."]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = a.content;
      if (!S.g || typeof S.g !== "object" || !SLOTS.every(function(x){ return T.groups.indexOf(S.g[x]) >= 0; })) S.g = cp(T.start);
      inp.innerHTML = '<div class="ml-tslots">' + SLOTS.map(function(x){ return '<label class="ml-tsl"><span>' + cap1(SLN[x]) + ' slot</span><select data-ts="' + x + '">' + T.groups.map(function(k){ return '<option value="' + k + '"' + (S.g[x] === k ? " selected" : "") + ">" + (PNAME[k] || GR[k].t) + "</option>"; }).join("") + "</select></label>"; }).join("") + "</div>";
      pv.innerHTML = '<div class="ml-tstage" tabindex="0" role="group" aria-label="Your molecule. Arrow keys turn it."><svg class="ml-tsvg" viewBox="0 0 320 250" role="img" aria-label="Your molecule"></svg></div><div class="ml-trot"></div><dl class="read ml-tread" aria-live="polite"></dl>';
      svg = $(".ml-tsvg", pv);
      turnable($(".ml-tstage", pv), $(".ml-trot", pv), svg, { get:function(){ return Rt; }, set:function(M){ Rt = M; }, home:function(){ return R0.slice(); }, busy:function(){ return false; }, onTurn:draw });
      if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; draw(); void w0; }).observe(svg);
      inp.addEventListener("change", function(e){ var x = e.target.dataset && e.target.dataset.ts; if (!x) return; S.g[x] = e.target.value; api.save(); draw(); paintRead(); api.update(); });
      draw(); paintRead();
    },
    read:read,
    valid:function(d){ return d.g ? true : "Fill every slot first."; },
    checks:function(d){ return d.l; },
    key:function(d){ return d.name + "|" + d.form; }, label:nameOf, text:nameOf
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ centres:centresAct, stereo:stereoAct },
  task:task
});
})();
