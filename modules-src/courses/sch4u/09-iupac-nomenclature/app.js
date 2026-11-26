// SCH4U 09 IUPAC Nomenclature: hero (4-hydroxybutan-2-one assembles from its structure), Name machine (Explore:
// Structure → name with C2 chips and live rule checks, Name → structure with the C1 builder, Priority duel), Common names
// and real labels (Part 3: product cards, flavour esters, sour acids), "Name it" and "Name ↔ structure and fix-it"
// activities, "Name designer" task.
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
function art(w){ return (/^[aeiou]/.test(w) ? "an " : "a ") + w; }
function norm(s){ return String(s || "").toLowerCase().replace(/[‐-―−]/g, "-").replace(/\s+/g, " ").trim(); }
var RULES = {};   // misconception sentences from content (explore.rules), filled in at start-up
function rules(){ if (!RULES.m1 && MV.C && MV.C.explore) RULES = MV.C.explore.rules; }

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

// @component C2 nameChips + judge — chip tokens (locants, multipliers, prefixes, ester first word, parent, bonds, suffix),
// compose(tokens) -> name text, parse(tokens) -> structured name, judge(tokens, m, {wrong}) -> {ok, msg, note, rows} where
// rows = {pg, oth, par, num, ord} each {s:"ok"|"bad"|"wait", msg}: the decision tree checked in order (principal group →
// parent → other groups → numbering → prefix order). Accepts older locant-first forms and optional locants with a note.
var C2 = (function(){
  var T = { L:["1", "2", "3", "4", "5", "6", "7", "8", "N"], X:["di", "tri"], P:["methyl", "ethyl", "propyl", "chloro", "bromo", "fluoro", "hydroxy", "amino", "oxo", "methoxy", "ethoxy", "propoxy"],
    A:["methyl ", "ethyl ", "propyl ", "butyl "], S:["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct"], R:["cyclo", "benzene"], U:["an", "en", "yn"], F:["e", "ol", "al", "one", "oic acid", "oate", "amide", "amine"] };
  var TY = {}; Object.keys(T).forEach(function(k){ T[k].forEach(function(t){ TY[t] = k; }); });
  var SK = { e:"", ol:"ol", al:"al", one:"one", "oic acid":"acid", oate:"ester", amide:"amide", amine:"amine" };
  var PC = { methyl:1, ethyl:2, propyl:3 }, XN = { di:2, tri:3 };
  var ORDER = "Build the name in this order: prefixes (with locants), then the parent, then the suffix.";
  var TERM = { al:"An aldehyde carbon is always C1: no number needed.", acid:"The –COOH carbon is always C1: no number needed.",
    ester:"The ester’s C=O carbon is always C1: no number needed.", amide:"The amide’s C=O carbon is always C1: no number needed." };
  var PF = { ol:"hydroxy", one:"oxo", al:"oxo", amine:"amino" }, GF = { acid:"–COOH", ester:"the ester group", amide:"the amide group", al:"the –CHO", one:"the ketone C=O", ol:"–OH", amine:"–NH₂" };
  var LOOK = { hydroxy:"an –OH", oxo:"a second C=O", amino:"an –NH₂", chloro:"a Cl", bromo:"a Br", fluoro:"an F", methoxy:"an –OCH₃", ethoxy:"an –OCH₂CH₃", propoxy:"an –OCH₂CH₂CH₃" };
  function ty(t){ return TY[t] || ""; }
  function compose(tk){
    var s = "", pv = null;
    (tk || []).forEach(function(t){
      var a = ty(t), b = pv == null ? "" : ty(pv);
      if (pv != null) { if (a === "L" && b === "L") s += ","; else if ((a === "L" && b !== "A") || b === "L" || (a === "F" && b === "F" && pv !== "e")) s += "-"; }
      s += t; pv = t;
    });
    return s;
  }
  function parse(tk){
    var r = { alk:null, pre:[], older:[], ring:"", n:0, an:false, un:[], suf:null, nsuf:0, err:"", tail:false }, L = [], X = "", st = 0;
    function err(msg){ if (!r.err) r.err = msg; }
    for (var i = 0; i < tk.length; i++) {
      var t = tk[i], y = ty(t);
      if (y === "L") { L.push(t); continue; }
      if (y === "X") { if (X) err("Use one multiplier (di- or tri-) at a time."); X = t; continue; }
      if (st === 0) {
        if (y === "P") { r.pre.push({ locs:L, mult:X, name:t }); L = []; X = ""; continue; }
        if (y === "A") { if (r.alk) err("An ester name has only one first word."); r.alk = { pre:r.pre, base:t.trim() }; if (L.length || X) err(ORDER); r.pre = []; L = []; X = ""; continue; }
        if (t === "cyclo") { r.ring = "cyclo"; continue; }
        if (y === "S" || t === "benzene") {
          if (X) err("di- and tri- go right before a prefix or a suffix.");
          r.older = L; L = []; X = "";
          if (t === "benzene") { r.ring = "benzene"; r.n = 6; r.an = true; r.suf = { kind:"e", locs:[], mult:"" }; st = 2; }
          else { r.n = T.S.indexOf(t) + 1; st = 1; }
          continue;
        }
        err(ORDER); continue;
      }
      if (st === 1) {
        if (y === "U") { if (t === "an") { if (L.length) err("-an- has no locant: it means single bonds only."); r.an = true; } else r.un.push({ kind:t, locs:L, mult:X }); L = []; X = ""; continue; }
        if (y === "F") {
          if (t === "e" && i + 1 < tk.length && /^[LXF]$/.test(ty(tk[i + 1]))) { if (L.length) err(ORDER); continue; }
          r.suf = { kind:t, locs:L, mult:X }; r.nsuf = 1; L = []; X = ""; st = 2; continue;
        }
        err(ORDER); continue;
      }
      if (y === "F") { r.nsuf++; continue; }
      err("Nothing comes after the suffix.");
    }
    if (L.length || X) r.tail = true;
    return r;
  }
  function pkey(n){ return n.replace(/[^a-z]/g, ""); }
  function cnt(p){ return Math.max(p.locs.length, XN[p.mult] || 1); }
  function alkName(a){ return a.pre.map(function(p){ return (p.locs.length ? p.locs.join(",") + "-" : "") + p.mult + p.name; }).join("-") + a.base; }
  function alkC(a){ return STEM.indexOf(a.base.replace(/yl$/, "")) + a.pre.reduce(function(s, p){ return s + (PC[p.name] || 0) * cnt(p); }, 0); }
  function pgMsg(P, k, has){
    if (!P) return "Nothing in this molecule takes a suffix: halo, alkoxy and alkyl groups are prefixes, so the name ends in -e.";
    if (!k) return "Groups with suffixes win over the parent: find the highest-priority group (acid > ester > amide > aldehyde > ketone > alcohol > amine).";
    if (k === "al" && P === "one") return "A C=O inside the chain is a ketone: -one. -al is for a C=O at the end of a chain.";
    if (k === "one" && P === "al") return "A C=O at the end of a chain is an aldehyde: -al.";
    if (has[k]) return "Only the highest-priority group is a suffix. " + cap1(art(GL[P])) + " outranks " + art(GL[k]) + ", so " + GF[k] + " becomes " + (PF[k] ? PF[k] + "-." : "a prefix.");
    return "-" + SUFX[k] + " means " + art(GL[k]) + ", and this molecule has none. Find the highest-priority group.";
  }
  function whyAlt(c, a, P){
    if (cmpArr(c.pg, a.pg)) return RULES.m2;
    if (cmpArr(c.mb, a.mb) || cmpArr(c.db, a.db)) return P ? "The principal group ties, so the C=C gets the lowest locant next." : "Number so the C=C gets the lowest locant.";
    if (cmpArr(c.locs, a.locs)) return "Number from the end that gives the prefixes the lowest locants (compare them at the first point of difference).";
    return "Both directions give the same locants, so the prefix first in the alphabet gets the lower number.";
  }
  function kstr(k){ var p = {}; Object.keys(k.pre).sort().forEach(function(n){ p[n] = k.pre[n].slice().sort(); }); return JSON.stringify([k.pg.slice().sort(), k.en.slice().sort(), k.yn.slice().sort(), p]); }
  function judge(tk, m, o){
    o = o || {};
    var W = { pg:{ s:"wait" }, oth:{ s:"wait" }, par:{ s:"wait" }, num:{ s:"wait" }, ord:{ s:"wait" } }, res = { ok:false, rows:W, msg:"", note:"" };
    var N = NM.name(m);
    tk = tk || [];
    if (!N.ok) { res.msg = "The machine can’t name this structure."; return res; }
    if (!tk.length) { res.msg = "Build a name with the chips first."; return res; }
    var cp0 = N.parts, P = cp0.P, s = norm(compose(tk)), r = parse(tk), has = NM.roles(m).has, OK = { s:"ok" };
    function bad(row, msg){ W[row] = { s:"bad", msg:msg }; if (!res.msg) res.msg = msg; }
    var wr = (o.wrong || []).filter(function(w){ return norm(w.name) === s; })[0];
    if (wr) res.msg = wr.fb;
    // 1. principal group (the suffix)
    var k = r.suf ? SK[r.suf.kind] : null;
    if (r.nsuf > 1) bad("pg", "Only one suffix: the highest-priority group. Every other group becomes a prefix.");
    else if (k != null) { if (k === P) W.pg = OK; else bad("pg", pgMsg(P, k, has)); }
    // 2. parent chain (and an ester's first word)
    if (r.n) {
      var pe = "";
      if (P === "ester") {
        if (!r.alk) pe = "An ester name has two words: alkyl (from the alcohol) + alkanoate (from the acid).";
        else if (r.n !== cp0.n && alkC(r.alk) === cp0.n && r.n === cp0.alkC) pe = RULES.m5;
        else if (norm(alkName(r.alk)) !== norm(cp0.alk)) pe = "The first word names the alkyl group on the single-bonded O (from the alcohol): count its carbons.";
      } else if (r.alk) pe = "Only an ester’s name has a separate first word (the alkyl group).";
      if (!pe) {
        if (cp0.ring === "benzene" && r.ring !== "benzene") pe = "The parent is a benzene ring: use the benzene chip.";
        else if (cp0.ring === "cyclo" && r.ring !== "cyclo") pe = "The parent is a ring: start the parent with cyclo-.";
        else if (!cp0.ring && r.ring) pe = "There’s no ring in this molecule: leave out " + (r.ring === "cyclo" ? "cyclo-" : "benzene") + ".";
        else if (r.n < cp0.n) pe = cp0.ring ? "Count the ring carbons: there are " + cp0.n + "." : "Parent too short. Trace every path through the carbons: the longest chain" + (P ? " that holds the principal group" : "") + " has " + cp0.n + " carbons.";
        else if (r.n > cp0.n) pe = cp0.ring ? "Count the ring carbons: there are " + cp0.n + "." : "Count again: " + cp0.n + " carbons in the chain.";
      }
      if (!pe && r.ring !== "benzene") {
        var en = r.un.filter(function(u){ return u.kind === "en"; }), yn = r.un.filter(function(u){ return u.kind === "yn"; });
        if (cp0.en.length && !en.length) pe = "The parent chain has a C=C: use -en- with its locant, not -an-.";
        else if (!cp0.en.length && en.length) pe = "There’s no C=C in the parent chain: use -an-.";
        else if (cp0.yn.length && !yn.length) pe = "The parent chain has a C≡C: use -yn- with its locant.";
        else if (!cp0.yn.length && yn.length) pe = "There’s no C≡C in the parent chain.";
        else if (r.an && r.un.length) pe = "Use -an- or -en-, not both.";
        else if (en.length && cnt(en[0]) !== cp0.en.length) pe = "Count the C=C bonds in the parent.";
        else if (r.suf && !r.an && !r.un.length) pe = "Add -an- after the stem: the parent has single bonds only.";
      }
      if (pe) bad("par", pe); else W.par = OK;
    }
    // 3. other groups (the prefix set)
    if (r.n && W.par.s === "ok") {
      var want = {}, got = {}, oe = "";
      cp0.pre.forEach(function(x){ want[x.name] = x.locs.length; });
      r.pre.forEach(function(p){
        if (oe) return;
        if (got[p.name]) oe = "Join identical prefixes with di- or tri-, with a locant for each: 2,2-dimethyl.";
        else if (p.mult && p.locs.length && p.locs.length !== XN[p.mult]) oe = p.mult + "- needs " + XN[p.mult] + " locants, one for each group.";
        else if (!p.mult && p.locs.length > 1) oe = p.locs.length + " locants need " + MULT[p.locs.length] + "-: one prefix for identical groups, as in 2,3-dimethyl.";
        got[p.name] = cnt(p);
      });
      if (!oe) Object.keys(got).forEach(function(n){
        if (oe || want[n]) return;
        var asP = P && PF[P] === n;
        oe = asP ? GF[P] + " is already the suffix (-" + SUFX[P] + "), so it isn’t a prefix too. " + RULES.m6 : "There’s no " + n + " group on this molecule.";
      });
      if (!oe) Object.keys(want).forEach(function(n){
        if (oe) return;
        if (!got[n]) oe = "Every group except the principal one becomes a prefix: one is missing (look for " + (LOOK[n] || "a branch") + ").";
        else if (got[n] !== want[n]) oe = "Count the " + n + " groups: there " + (want[n] > 1 ? "are " + want[n] : "is 1") + ".";
      });
      if (oe) bad("oth", oe); else W.oth = OK;
    }
    // 4. numbering
    if (W.pg.s === "ok" && W.par.s === "ok" && W.oth.s === "ok") {
      var sufL = r.suf.locs.slice(), un = r.un.map(function(u){ return { kind:u.kind, locs:u.locs.slice() }; }), ne = "", note = "";
      var term = P === "acid" || P === "ester" || P === "amide" || P === "al";
      if (r.older.length) {
        var tu = un.filter(function(u){ return !u.locs.length; })[0];
        if (tu && cp0.showMb) { tu.locs = r.older.slice(); note = "older"; }
        else if (!sufL.length && P && !term && (cp0.showSuf || cp0.optSuf)) { sufL = r.older.slice(); note = "older"; }
        else ne = "Put each locant right before the part it numbers.";
      }
      if (!ne && term) { if (sufL.length) ne = TERM[P]; else sufL = cp0.pg.slice(); }
      else if (!ne && P) {
        if (!sufL.length) { if (cp0.showSuf && !cp0.optSuf) ne = "The locant is needed: which carbon carries the " + GSYM[P] + "?"; else { sufL = cp0.pg.slice(); if (cp0.showSuf) note = note || "omit"; } }
        else if (!cp0.showSuf) note = note || "extra";
      }
      un.forEach(function(u){ if (ne) return; if (!u.locs.length) { if (cp0.showMb) ne = "The C=C needs a locant: the lower-numbered carbon of the double bond."; else u.locs = (u.kind === "en" ? cp0.en : cp0.yn).slice(); } else if (!cp0.showMb) note = note || "extra"; });
      var pre = {}, cpre = {};
      cp0.pre.forEach(function(x){ cpre[x.name] = x.locs; });
      r.pre.forEach(function(p){
        if (ne) return;
        var nd = cp0.showPre || (cpre[p.name] || [])[0] === "N", L = p.locs.slice();
        if (!L.length) { if (nd) ne = "Each prefix needs a locant: which " + ((cpre[p.name] || [])[0] === "N" ? "atom (use N for the nitrogen)" : "carbon") + " is it on?"; else L = (cpre[p.name] || []).slice(); }
        else if (!nd) note = note || "extra";
        pre[p.name] = L;
      });
      if (ne) bad("num", ne);
      else {
        var sk = kstr({ pg:sufL, en:un.filter(function(u){ return u.kind === "en"; }).reduce(function(a, u){ return a.concat(u.locs); }, []), yn:un.filter(function(u){ return u.kind === "yn"; }).reduce(function(a, u){ return a.concat(u.locs); }, []), pre:pre });
        if (sk === kstr(NM.keyOf(N.c))) { W.num = OK; res.note = note; }
        else { var alt = N.alts.filter(function(c){ return kstr(NM.keyOf(c)) === sk; })[0]; bad("num", alt ? whyAlt(N.c, alt, P) : "Check the locants: number the parent from the end that gives the principal group the lowest number, then read off where each group sits."); }
      }
    }
    // 5. prefix order
    if (W.num.s === "ok") {
      var ks = r.pre.map(function(p){ return pkey(p.name); });
      if (ks.join() === ks.slice().sort().join()) W.ord = OK; else bad("ord", RULES.m4);
    }
    if (r.err && !res.msg) res.msg = r.err;
    if (!res.msg && (r.tail || !r.n)) res.msg = r.n ? "A locant or multiplier at the end needs a part to go with." : "Add the parent chain (meth- to oct-, or a ring).";
    if (!res.msg && !r.suf) res.msg = "Finish with a suffix: -e if no group takes a suffix.";
    res.ok = !res.msg && !r.err && ["pg", "oth", "par", "num", "ord"].every(function(k2){ return W[k2].s === "ok"; });
    if (res.ok) res.noteHTML = res.note === "older" || res.note === "omit" ? "Accepted. Current IUPAC writes it " + N.name + "." : res.note === "extra" ? "Accepted. The locant isn’t needed here, so it’s usually written " + N.name + "." : "";
    return res;
  }
  return { T:T, ty:ty, compose:compose, parse:parse, judge:judge };
})();
// ===== core end =====

var MC = {};
function mol(smi){ return MC[smi] || (MC[smi] = smiles(smi)); }
function longest(m){
  var A = adj(m);
  function far(s){ var d = {}, par = {}, Q = [s], last = s; d[s] = 0; par[s] = -1; while (Q.length) { var x = Q.shift(); if (d[x] > d[last]) last = x; A[x].forEach(function(y){ if (!(y in d)) { d[y] = d[x] + 1; par[y] = x; Q.push(y); } }); } var p = []; for (var v = last; v !== -1; v = par[v]) p.push(v); return p.reverse(); }
  if (!m.a.length) return [];
  var p = far(far(0).slice(-1)[0]);
  return p[0] > p[p.length - 1] ? p.reverse() : p;
}
// builder spec {a:["C", "O", …], b:[[i, j, order], …]} -> molecule (cached by content)
var SPC = {};
function specMol(sp){
  var k = JSON.stringify(sp); if (SPC[k]) return SPC[k];
  var m = { a:sp.a.map(function(el){ return { el:el }; }), b:sp.b.map(function(x){ return x.slice(); }) };
  m.main = longest(m);
  return (SPC[k] = m);
}

// ---------- @component C1 moleculeView — 2D structural drawing with merged H labels (CH₃, OH, H₂N), chain on a grid or a
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
    m.a.forEach(function(_, i){ var p = pos(i); list.push({ k:"a", i:i, x:p[0], y:p[1], on:o.selA === i }); });
    m.b.forEach(function(b, i){ var p = pos(b[0]), q = pos(b[1]); list.push({ k:"b", i:i, x:(p[0] + q[0]) / 2, y:(p[1] + q[1]) / 2, on:!!(o.selB && ((b[0] === o.selB[0] && b[1] === o.selB[1]) || (b[0] === o.selB[1] && b[1] === o.selB[0]))) }); });
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

// ---------- C2 name chips (palette) — rows by type; roving-tabindex grid (arrow keys; Backspace removes the last chip)
var CROWS = [["Locants", C2.T.L], ["Multipliers", C2.T.X], ["Prefixes", C2.T.P], ["Ester first word", C2.T.A], ["Parent", ["cyclo"].concat(C2.T.S, ["benzene"])], ["Bonds in the parent", C2.T.U], ["Suffix", C2.T.F]];
var CLAB = { an:"-an- (single)", en:"-en- (C=C)", yn:"-yn- (C≡C)" };
function chipLab(t){ var y = C2.ty(t); return CLAB[t] || (y === "X" || y === "S" || t === "cyclo" ? t + "-" : y === "F" ? "-" + t : y === "A" ? t.trim() : t); }
var CHU = 0;
function nameChips(host, o){
  var uid = ++CHU, cur = 0;
  host.innerHTML = '<p class="c2-tape" aria-live="polite"></p><div class="c2-grid" role="group" aria-label="Name chips">' + CROWS.map(function(r, ri){
    return '<div class="c2-row"><span class="c2-lab" id="c2l' + uid + ri + '">' + r[0] + "</span>" + r[1].map(function(t, ci){ return '<button type="button" class="chip c2-c" data-t="' + esc(t) + '" data-r="' + ri + '" data-c="' + ci + '" tabindex="-1" aria-describedby="c2l' + uid + ri + '">' + chipLab(t) + "</button>"; }).join("") + "</div>";
  }).join("") + '</div><div class="q-actions c2-act"><button type="button" class="btn ghost sm" data-c2="back" data-k="c2b' + uid + '">⌫ Back</button><button type="button" class="btn ghost sm" data-c2="clear" data-k="c2x' + uid + '">Clear</button></div>';
  var tape = $(".c2-tape", host), btns = $$(".c2-c", host);
  function rove(i, focus){ cur = clamp(i, 0, btns.length - 1); btns.forEach(function(b, k){ b.tabIndex = k === cur ? 0 : -1; }); if (focus) btns[cur].focus(); }
  function paint(){
    var tk = o.get() || [], s = C2.compose(tk), lock = o.locked && o.locked();
    tape.innerHTML = '<span class="c2-tl">' + (o.label || "Your name:") + "</span> " + (s ? '<span class="c2-name">' + esc(s) + "</span>" : '<span class="muted">tap chips to build it</span>');
    btns.forEach(function(b){ b.disabled = !!lock; });
    $$("[data-c2]", host).forEach(function(b){ b.disabled = !!lock || !tk.length; });
  }
  function edit(fn){ var tk = (o.get() || []).slice(); fn(tk); o.set(tk); paint(); if (o.onChange) o.onChange(tk); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.t != null) { rove(btns.indexOf(b)); edit(function(tk){ if (tk.length < 24) tk.push(b.dataset.t); }); }
    else if (b.dataset.c2 === "back") edit(function(tk){ tk.pop(); });
    else if (b.dataset.c2 === "clear") edit(function(tk){ tk.length = 0; });
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest(".c2-c"); if (!b) return;
    var i = btns.indexOf(b), r = +b.dataset.r, c = +b.dataset.c;
    if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); if (!b.disabled) edit(function(tk){ tk.pop(); }); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); rove(i + (e.key === "ArrowRight" ? 1 : -1), true); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); var r2 = clamp(r + (e.key === "ArrowDown" ? 1 : -1), 0, CROWS.length - 1), row = btns.filter(function(x){ return +x.dataset.r === r2; });
      rove(btns.indexOf(row[Math.min(c, row.length - 1)]), true); return;
    }
    if (e.key === "Home" || e.key === "End") { e.preventDefault(); rove(e.key === "Home" ? 0 : btns.length - 1, true); }
  });
  rove(0); paint();
  return { paint:paint };
}

// ---------- @component C1 moleculeBuilder — tap an atom or a bond, then: add C / O / N / Cl / Br (single bond; heteroatoms
// bond to carbon only), change C ⇄ O ⇄ N, remove an end atom, single ⇄ double (C=C, C=O only); valence checked, H filled in.
// builder(viewHost, menuHost, {get() -> spec, set(spec), els:[…], max:{C, O, N, all}, onChange, locked}) -> {paint(), mol()}
var ELN = { C:"carbon", O:"oxygen", N:"nitrogen", Cl:"chlorine", Br:"bromine" };
function builder(vh, mh, o){
  var sel = null, msg = "", els = o.els || ["C", "O", "N", "Cl", "Br"], mx = o.max || { all:10 };
  mh.innerHTML = '<p class="nm-bmsg" aria-live="polite"></p><div class="nm-menu" role="group" aria-label="Builder buttons"></div>';
  var V = molView(vh, { w:520, h:250, phone:0.62, onPick:function(k, i){ if (o.locked && o.locked()) return; sel = { k:k, i:i }; msg = ""; paint(); }, label:label });
  function m(){ return specMol(o.get()); }
  function label(k, i){
    var mm = m(), L = layout(mm);
    if (k === "a") return "Atom " + (i + 1) + ": " + L.lbl[i] + (sel && sel.k === "a" && sel.i === i ? ", selected" : "") + ". Select it for the builder buttons.";
    var b = mm.b[i]; return "Bond between atom " + (b[0] + 1) + " (" + mm.a[b[0]].el + ") and atom " + (b[1] + 1) + " (" + mm.a[b[1]].el + "), " + (b[2] === 2 ? "double" : "single") + ". Select it for the builder buttons.";
  }
  function count(sp, el){ return sp.a.filter(function(x){ return x === el; }).length; }
  function room(sp, el){ if (sp.a.length >= (mx.all || 10)) return "The builder holds up to " + (mx.all || 10) + " atoms (not counting H)."; if (mx[el] != null && count(sp, el) >= mx[el]) return "Up to " + mx[el] + " " + ELN[el] + " atom" + (mx[el] > 1 ? "s" : "") + " here."; return ""; }
  function set(sp, note, ns){ o.set(sp); sel = ns === undefined ? sel : ns; if (sel && ((sel.k === "a" && sel.i >= sp.a.length) || (sel.k === "b" && sel.i >= sp.b.length))) sel = null; msg = note || ""; paint(); if (o.onChange) o.onChange(); }
  function act(a){
    var sp = cp(o.get()), mm = m(), A = adj(mm);
    if (a === "reset") { set(o.fresh ? o.fresh() : { a:["C"], b:[] }, "Started again.", null); return; }
    if (!sel) return;
    if (sel.k === "a") {
      var i = sel.i;
      if (a.indexOf("add") === 0) { var el = a.slice(3); sp.a.push(el); sp.b.push([i, sp.a.length - 1, 1]); set(sp, "Added " + el + " to atom " + (i + 1) + ".", { k:"a", i:sp.a.length - 1 }); return; }
      if (a === "rm") { sp.b = sp.b.filter(function(b){ return b[0] !== i && b[1] !== i; }).map(function(b){ return [b[0] > i ? b[0] - 1 : b[0], b[1] > i ? b[1] - 1 : b[1], b[2]]; }); sp.a.splice(i, 1); set(sp, "Removed atom " + (i + 1) + ".", null); return; }
      if (a.indexOf("to") === 0) { sp.a[i] = a.slice(2); set(sp, "Atom " + (i + 1) + " is now " + sp.a[i] + "."); return; }
    } else {
      var b = sp.b[sel.i];
      if (a === "single" || a === "double") { b[2] = a === "double" ? 2 : 1; set(sp, "The bond is now " + a + "."); }
    }
  }
  function btn(a, t, why){ return '<button type="button" class="btn ghost sm" data-bk="' + a + '" data-k="bk' + a + '"' + (why ? ' disabled title="' + esc(why) + '"' : "") + ">" + t + "</button>"; }
  function paintMenu(){
    var sp = o.get(), mm = m(), A = adj(mm), h = "", why = [], lock = o.locked && o.locked();
    if (sel && sel.k === "a") {
      var i = sel.i, el = mm.a[i].el, fr = free(mm, i), leaf = A[i].length <= 1;
      h += '<p class="nm-sub">Atom ' + (i + 1) + ": " + ELN[el] + "</p>";
      els.forEach(function(e2){ var w = !fr ? "no free bond" : el !== "C" && e2 !== "C" ? "bond it to a carbon" : room(sp, e2); h += btn("add" + e2, "Add " + e2, w); });
      h += btn("rm", "Remove this atom", leaf && sp.a.length > 1 ? "" : "only an end atom");
      els.filter(function(e2){ return e2 !== el && VAL[e2] > 1; }).forEach(function(e2){
        var nbC = A[i].every(function(j){ return mm.a[j].el === "C"; }), w = used(mm)[i] > VAL[e2] ? ELN[e2] + " makes only " + VAL[e2] + " bonds" : e2 !== "C" && !nbC ? "bond it to carbons only" : e2 !== "C" && mm.b.some(function(b){ return (b[0] === i || b[1] === i) && b[2] > 1; }) && e2 === "N" ? "no N double bonds here" : room(sp, e2);
        h += btn("to" + e2, "Change to " + e2, w);
      });
      if (!fr) why.push("This atom has no free bond left: C makes 4 bonds, N 3, O 2, Cl and Br 1.");
    } else if (sel && sel.k === "b") {
      var b = mm.b[sel.i], e1 = mm.a[b[0]].el, e2b = mm.a[b[1]].el, okP = (e1 === "C" && e2b === "C") || (e1 === "C" && e2b === "O") || (e1 === "O" && e2b === "C");
      var ok2 = free(mm, b[0]) >= 1 && free(mm, b[1]) >= 1;
      h += '<p class="nm-sub">Bond: atom ' + (b[0] + 1) + " (" + e1 + ")–atom " + (b[1] + 1) + " (" + e2b + ")</p>";
      h += btn("single", "Single", b[2] === 1 ? "already single" : "") + btn("double", "Double", b[2] === 2 ? "already double" : !okP ? "only C=C or C=O" : ok2 ? "" : "no free bond");
      if (b[2] === 1 && okP && !ok2) why.push("A double bond needs a free bond on both atoms.");
    } else h += '<p class="tiny muted">Tap an atom or a bond in the drawing.</p>';
    h += '<div class="nm-bk-r">' + btn("reset", "Start again", "") + "</div>";
    if (lock) h = h.replace(/<button /g, "<button disabled ");
    MV.keepFocus($(".nm-menu", mh), function(){ $(".nm-menu", mh).innerHTML = h + (why.length ? '<p class="tiny muted">' + why.join(" ") + "</p>" : ""); });
    $(".nm-bmsg", mh).textContent = msg;
  }
  function paint(extra){
    var mm = m(), N = NM.name(mm), L = layout(mm);
    V.show(mm, Object.assign({ picks:!(o.locked && o.locked()), selA:sel && sel.k === "a" ? sel.i : null, selB:sel && sel.k === "b" ? mm.b[sel.i].slice(0, 2) : null, smax:56,
      aria:"Your structure: " + L.lbl.join(", ") + ". Formula " + MV.plain(F(fText(mm))) + "." }, extra || (o.overlay ? o.overlay(mm, N) : {})));
    paintMenu();
  }
  mh.addEventListener("click", function(e){ var b = e.target.closest("[data-bk]"); if (!b || b.disabled) return; act(b.dataset.bk); var f = $('[data-k="' + b.dataset.k + '"]', mh); if (f && !f.disabled) f.focus({ preventScroll:true }); });
  return { paint:paint, mol:m, clear:function(){ sel = null; msg = ""; } };
}

// ---------- analysis rows (readout) ----------
var PD = { hydroxy:"–OH", oxo:"C=O", amino:"–NH₂", chloro:"–Cl", bromo:"–Br", fluoro:"–F", methoxy:"–OCH₃", ethoxy:"–OCH₂CH₃", propoxy:"–OCH₂CH₂CH₃", methyl:"–CH₃", ethyl:"–CH₂CH₃", propyl:"–CH₂CH₂CH₃" };
var ROWS = [["pg", "Principal group"], ["oth", "Other groups"], ["par", "Parent chain"], ["num", "Numbering"], ["ord", "Prefix order"], ["name", "Name"], ["f", "Formula"]];
function sideWord(m, path, first){ var L = layout(m), a = L.P[path[0]], b = L.P[path[path.length - 1]]; return Math.abs(a[0] - b[0]) < 0.3 ? (first ? "from the top" : "from the bottom") : (a[0] < b[0]) === first ? "from the left" : "from the right"; }
function locDesc(c){
  if (c.P) return GSYM[c.P] + " at " + c.pg.join(", ");
  if (c.mbs.length) return "C=C at " + c.mb.join(", ");
  return c.subs.filter(function(s){ return s.loc !== "N"; }).sort(function(a, b){ return a.loc - b.loc; }).map(function(s){ return (PD[s.name] || s.name) + " at " + s.loc; }).join(", ");
}
function info(m){
  var N = NM.name(m); if (!N.ok) return null;
  var R = NM.roles(m), c = N.c, pp = N.parts, P = N.P, o = {};
  var comp = Object.keys(R.has).filter(function(k){ return k !== P; }).sort(function(a, b){ return PRI[a] - PRI[b]; }).map(function(k){ return GL[k] + " (" + PRI[k] + ")"; });
  if (m.b.some(function(b){ return b[2] > 1 && m.a[b[0]].el === "C" && m.a[b[1]].el === "C"; }) && N.ring !== "benzene") comp.push("alkene (8)");
  o.pg = P ? cap1(GL[P]) + " (priority " + PRI[P] + ") → suffix -" + SUFX[P] + (comp.length ? "; it outranks " + comp.join(", ") : "") : "None: no group takes a suffix, so the name ends in -e" + (c.mbs.length ? " (the C=C goes into the parent as -en-)" : "");
  o.oth = pp.pre.length ? pp.pre.map(function(x){ var nN = x.locs[0] === "N"; return (x.locs.length > 1 ? x.locs.length + " × " : "") + (PD[x.name] || "branch") + (nN ? " on N" : "") + " → " + (nN ? x.locs.join(",") + "-" : "") + MULT[x.locs.length] + x.name + "-"; }).join("; ") : "none";
  var sat = pp.en.length ? (pp.en.length > 1 ? pp.en.length + " C=C (-" + MULT[pp.en.length] + "en-)" : "one C=C (-en-)") : pp.yn.length ? "one C≡C (-yn-)" : "saturated (-an-)";
  o.par = N.ring === "benzene" ? "benzene ring (6 carbons)" : (N.ring ? "ring of " + pp.n + " carbons (cyclo" + STEM[pp.n] + "-), " : pp.n + " carbon" + (pp.n > 1 ? "s" : "") + " (" + STEM[pp.n] + "-), ") + (N.ring === "benzene" ? "" : sat) + (pp.alk ? "; first word from the alcohol: " + pp.alk : "");
  if (N.ring) o.num = "C1 " + (P ? "carries the " + GSYM[P] : "is chosen") + "; then around the ring the way that gives the lowest locants: " + (locDesc(c) || "no locants needed");
  else if (pp.n < 2 || (!P && !c.mbs.length && !c.subs.filter(function(s){ return s.loc !== "N"; }).length)) o.num = "no locants needed";
  else { var alt = N.alts[0]; o.num = sideWord(m, c.path, true) + ": " + locDesc(c) + (alt ? " (" + sideWord(m, c.path, false) + " it would be " + (P ? alt.pg.join(", ") : locDesc(alt)) + ")" : ""); }
  o.ord = pp.pre.length ? pp.pre.map(function(x){ return x.name; }).join(", ") + (pp.pre.length > 1 ? " (alphabetical, ignoring di-/tri-)" : "") : "—";
  o.name = "<strong>" + N.name + "</strong>" + (N.older !== N.name ? ' <span class="muted">(older form ' + N.older + " also accepted)</span>" : "");
  o.f = F(fText(m));
  return o;
}
function readRows(m, mask){
  var o = info(m);
  if (!o) return MV.readoutHTML([["Name", "The machine can’t name this structure yet. Add carbon, or remove an extra ring."], ["Formula", m.a.length ? F(fText(m)) : "—"]]);
  return MV.readoutHTML(ROWS.map(function(r){ var k = r[0]; return [r[1], mask && mask[k] != null ? mask[k] : o[k]]; }));
}
// mask from a judge result (Structure → name mode): decisions show when they're right on the student's tape
function maskOf(j, m){
  var o = info(m), mk = {};
  ["pg", "oth", "par", "num", "ord"].forEach(function(k){ var w = j.rows[k]; mk[k] = w.s === "ok" ? "✓ " + o[k] : w.s === "bad" ? '<span class="nm-bad">✗ ' + w.msg + "</span>" : '<span class="muted">?</span>'; });
  mk.name = j.ok ? "✓ " + o.name : '<span class="muted">? (build it with the chips)</span>';
  return mk;
}

// ---------- hero ----------
function hero(){
  var host = $("#nm-hx-svg"), cap = $("#nm-hx-cap"), rep = $("#nm-hx-replay");
  if (!host) return;
  var m = mol("CC(=O)CCO"), V = molView(host, { w:520, h:330, phone:0.78 }), DUR = 7600, run = 0;
  var CAPS = [[0, "A molecule with two groups: a C=O inside the chain and an –OH at the end."], [700, "Two groups compete. Check the priority list: the ketone is priority 5, the alcohol priority 6."],
    [2200, "The ketone wins: it becomes the suffix -one. The –OH drops into the prefixes as hydroxy-."], [3600, "The parent chain lights up: 4 carbons, all single bonds: but- + -an-."],
    [4600, "Number from the end nearer the principal group: the C=O is on C2, the –OH on C4."], [6200, "The name clicks together: <strong>4-hydroxybutan-2-one</strong>."]];
  var SL = [{ t:"hydroxy", f:"4-hydroxy" }, { t:"but", f:"but" }, { t:"an", f:"an" }, { t:"-one", f:"-2-one" }];
  function frame(t){
    var o = { box:function(W, H){ return { x0:0, y0:4, x1:W, y1:H - 96 }; }, smax:64, aria:"CH₃–CO–CH₂–CH₂–OH. Its name assembles beneath it: 4-hydroxybutan-2-one." };
    o.op = ease(t / 600);
    var gl = t >= 3600 ? ease((t - 3600) / 500) : 0;
    if (gl > 0) o.glow = [0, 1, 3, 4];
    var nn = t >= 4600 ? Math.min(4, Math.floor((t - 4600) / 320) + 1) : 0;
    o.nums = [0, 1, 3, 4].slice(0, nn).map(function(i, k){ return { i:i, t:String(k + 1), side:-1 }; });
    o.extra = function(fit, W, H){
      var fs = clamp(fit.s * 0.38, 11, 22), out = "", y = H - 46, f2 = Math.max(15, Math.min(26, W / 22)), wsl = SL.map(function(s){ return estW(s.f, f2) + 22; }), tot = wsl.reduce(function(a, b){ return a + b; }, 0) + 30;
      var x = (W - tot) / 2, cx = [], P1 = [fit.ox + layout(m).P[2][0] * fit.s, fit.oy + layout(m).P[2][1] * fit.s], P2 = [fit.ox + layout(m).P[5][0] * fit.s, fit.oy + layout(m).P[5][1] * fit.s];
      wsl.forEach(function(w){ cx.push(x + w / 2); x += w + 10; });
      var joined = t >= 6200 ? ease((t - 6200) / 700) : 0;
      if (joined < 1) SL.forEach(function(s, k){
        var show = k === 0 || k === 3 ? t >= 3200 : t >= 4100, txt = (k === 0 && nn >= 4) || (k === 3 && nn >= 2) ? s.f : s.t, w = wsl[k];
        out += '<g opacity="' + r1(1 - joined) + '"><rect x="' + r1(cx[k] - w / 2) + '" y="' + r1(y - 20) + '" width="' + r1(w) + '" height="40" rx="8" fill="' + (show ? "var(--hi-soft)" : "none") + '" stroke="var(--rule)" stroke-dasharray="' + (show ? "0" : "5 4") + '" stroke-width="1.6"/>';
        if (show) out += '<text x="' + r1(cx[k]) + '" y="' + r1(y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(f2) + '" font-weight="700" fill="var(--ink)">' + txt + "</text>";
        out += '<text x="' + r1(cx[k]) + '" y="' + r1(y + 32) + '" text-anchor="middle" font-size="' + r1(f2 * 0.5) + '" fill="var(--ink-2)">' + ["prefix", "parent", "bonds", "suffix"][k] + "</text></g>";
      });
      if (joined > 0) out += '<text x="' + r1(W / 2) + '" y="' + r1(y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(f2 * 1.15) + '" font-weight="700" fill="var(--ink)" opacity="' + r1(joined) + '">4-hydroxybutan-2-one</text>';
      // badges: appear, then fly into their slots
      function badge(p0, target, txt, show, el){
        if (!show) return "";
        var u = ease((t - 2200) / 1000), bx = lerp(p0[0], target[0], u), by = lerp(p0[1], target[1], u), f3 = fs * 0.66, w2 = estW(txt, f3) + 14, h2 = f3 + 10, op = t < 2200 ? ease((t - 700) / 400) : 1 - ease((t - 3000) / 300);
        if (op <= 0.01) return "";
        return '<g opacity="' + r1(op) + '"><rect x="' + r1(bx - w2 / 2) + '" y="' + r1(by - h2 / 2) + '" width="' + r1(w2) + '" height="' + r1(h2) + '" rx="' + r1(h2 / 2) + '" fill="var(--sheet)" stroke="var(' + MV.chem.colorVar(el) + ')" stroke-width="2.4"/><text x="' + r1(bx) + '" y="' + r1(by) + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(f3) + '" fill="var(--ink)">' + txt + "</text></g>";
      }
      if (t >= 700 && t < 2200) { out += '<circle cx="' + r1(P1[0]) + '" cy="' + r1(P1[1]) + '" r="' + r1(fs * 1.2) + '" fill="none" stroke="var(--at-o)" stroke-width="2.5" opacity=".8"/><circle cx="' + r1(P2[0]) + '" cy="' + r1(P2[1]) + '" r="' + r1(fs * 1.4) + '" fill="none" stroke="var(--at-o)" stroke-width="2.5" opacity=".8"/>'; }
      out += badge([P1[0], P1[1] - fs * 1.9], [cx[3], y], "ketone: priority 5", t >= 700, "O");
      out += badge([P2[0], P2[1] + fs * 1.9], [cx[0], y], "alcohol: priority 6", t >= 700, "O");
      return out;
    };
    return o;
  }
  function show(t){ V.show(m, frame(t)); }
  function capAt(t){ var c = CAPS[0][1]; CAPS.forEach(function(x){ if (t >= x[0]) c = x[1]; }); return c; }
  function play(){
    var id = ++run, last = "";
    rep.hidden = true;
    MV.tween({ dur:DUR, step:function(u){ if (id !== run) return; var t = u * DUR; show(t); var c = capAt(t); if (c !== last) { last = c; cap.innerHTML = c; } },
      done:function(){ if (id !== run) return; show(DUR); cap.innerHTML = MV.reduceMotion ? "The ketone (priority 5) outranks the alcohol (priority 6), so it becomes the suffix -one and the –OH becomes hydroxy-. The 4-carbon chain is numbered from the end nearer the C=O: <strong>4-hydroxybutan-2-one</strong>." : CAPS[CAPS.length - 1][1]; rep.hidden = false; } });
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Name machine ----------
function explore(host, api){
  var S = api.S, C = api.content, BANK = {}, GRP = {}, TG = {}, DU = {};
  RULES = C.rules;
  C.bank.forEach(function(g){ g.mols.forEach(function(x){ BANK[x.id] = x; GRP[x.id] = g.id; }); });
  C.targets.forEach(function(t){ TG[t.id] = t; }); C.duels.forEach(function(d){ DU[d.id] = d; });
  if (["s2n", "n2s", "duel"].indexOf(S.mode) < 0) S.mode = "s2n";
  if (!BANK[S.mol]) S.mol = "t1";
  if (!TG[S.tgt]) S.tgt = "tc2";
  if (!DU[S.duel]) S.duel = "d1";
  ["tapes", "rev", "built", "dpick", "drev"].forEach(function(k){ if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
  if (!Array.isArray(S.otape)) S.otape = [];
  var busy = false, fx = null, nfb = null, sfb = null, ofb = null;
  host.innerHTML = '<p class="how nm-how">' + C.how + '</p><div class="nm-grid"><div class="nm-left" data-mv="graph"><p class="eq-cap nm-cap" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="nm-mol"></div><div class="nm-bview"></div><p class="tiny muted nm-leg"></p></div>' +
    '<div class="nm-ctrl"><div class="nm-modes"></div>' +
    '<div class="nm-p" data-p="s2n"><div class="nm-grp"></div><div class="nm-mols"></div><div class="nm-chips"></div><div class="q-actions"><button type="button" class="btn primary sm" data-x="chkN" data-k="xchkN">Check name</button></div><div class="nm-fb" aria-live="polite"></div></div>' +
    '<div class="nm-p" data-p="n2s"><div class="nm-tgts"></div><div class="nm-bmenu"></div><div class="q-actions"><button type="button" class="btn primary sm" data-x="chkS" data-k="xchkS">Check structure</button></div><div class="nm-fb2" aria-live="polite"></div>' +
      '<div class="nm-open"><p class="nm-sub">Name your molecule</p><div class="nm-ochips"></div><div class="nm-fb3" aria-live="polite"></div></div></div>' +
    '<div class="nm-p" data-p="duel"><div class="nm-duels"></div><p class="nm-sub">Which group becomes the suffix?</p><div class="nm-dpick" role="group" aria-label="Choose the suffix group"></div><div class="nm-dfb" aria-live="polite"></div></div></div>' +
    '<div class="nm-right"><dl class="read nm-read" aria-live="polite"></dl></div></div>';
  var V = molView($(".nm-mol", host), { w:560, h:290, phone:0.66 });
  var modeRG = radios($(".nm-modes", host), { label:"Mode", aria:"Name machine mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; fx = null; api.save(); paint(); } });
  var grpRG = radios($(".nm-grp", host), { label:"Bank", aria:"Structure bank group", options:C.bank.map(function(g){ return { id:g.id, t:g.t }; }), value:GRP[S.mol], onChange:function(v){ var g = C.bank.filter(function(x){ return x.id === v; })[0]; setMol(g.mols[0].id); } });
  var molRG = null;
  function paintMols(){ var g = C.bank.filter(function(x){ return x.id === GRP[S.mol]; })[0]; molRG = radios($(".nm-mols", host), { aria:"Structure", cls:"chips", options:g.mols.map(function(x){ return { id:x.id, t:F(x.cf.replace(/[₀-₉]/g, function(c){ return String(c.charCodeAt(0) - 8320); })) }; }), value:S.mol, onChange:function(v){ setMol(v); } }); }
  function setMol(id){ S.mol = id; fx = null; nfb = null; grpRG.set(GRP[id]); paintMols(); api.save(); paint(); }
  paintMols();
  var tgtRG = radios($(".nm-tgts", host), { label:"Target", aria:"Target name", cls:"chips", options:C.targets.map(function(t){ return { id:t.id, t:t.t }; }), value:S.tgt, onChange:function(v){ S.tgt = v; sfb = null; ofb = null; B.clear(); api.save(); paint(); } });
  var duelRG = radios($(".nm-duels", host), { label:"Molecule", aria:"Duel molecule", cls:"chips", options:C.duels.map(function(d){ return { id:d.id, t:F(d.cf.replace(/[₀-₉]/g, function(c){ return String(c.charCodeAt(0) - 8320); })) }; }), value:S.duel, onChange:function(v){ S.duel = v; fx = null; api.save(); paint(); } });
  var chipsS = nameChips($(".nm-chips", host), { get:function(){ return S.tapes[S.mol] || []; }, set:function(tk){ S.tapes[S.mol] = tk; nfb = null; api.save(); }, onChange:function(){ paint(); }, locked:function(){ return busy; } });
  var chipsO = nameChips($(".nm-ochips", host), { get:function(){ return S.otape; }, set:function(tk){ S.otape = tk; ofb = null; api.save(); }, onChange:function(){ paint(); }, locked:function(){ return busy; } });
  var B = builder($(".nm-bview", host), $(".nm-bmenu", host), { get:function(){ return S.built[S.tgt] || { a:["C"], b:[] }; }, set:function(sp){ S.built[S.tgt] = sp; sfb = null; api.save(); },
    onChange:function(){ paint(); }, locked:function(){ return busy; }, overlay:function(m, N){ var open = TG[S.tgt].open && !openNamed(); return N.ok && !open ? { glow:N.c.path, nums:N.c.path.map(function(i, k){ return { i:i, t:String(k + 1) }; }) } : {}; } });

  function cur(){ return mol(BANK[S.mol].smi); }
  function built(){ return specMol(S.built[S.tgt] || { a:["C"], b:[] }); }
  function dmol(){ return mol(DU[S.duel].smi); }
  function openNamed(){ var m = built(); return !!S.otape.length && C2.judge(S.otape, m).ok; }
  function groupsOf(m){
    var R = NM.roles(m), ks = Object.keys(R.has).sort(function(a, b){ return PRI[a] - PRI[b]; });
    if (m.b.some(function(b){ return b[2] === 2 && m.a[b[0]].el === "C" && m.a[b[1]].el === "C"; })) ks.push("ene");
    return ks;
  }
  var DL = { acid:"the –COOH (-oic acid)", al:"the –CHO (-al)", one:"the ketone C=O (-one)", ol:"the –OH (-ol)", amine:"the –NH₂ (-amine)", ene:"the C=C (-ene)" };
  var BT = { acid:"acid: priority 1", al:"aldehyde: priority 4", one:"ketone: priority 5", ol:"alcohol: priority 6", amine:"amine: priority 7", ene:"C=C: priority 8" };
  function anchor(m, k){ // atom a badge for group k sits on
    var R = NM.roles(m), A = adj(m);
    if (k === "ene") { var bb = m.b.filter(function(b){ return b[2] === 2 && m.a[b[0]].el === "C" && m.a[b[1]].el === "C"; })[0]; return { i:bb[0], el:"C" }; }
    var c = R.kind.indexOf(k), p = R.per[c];
    if (k === "ol") return { i:p.oh[0], el:"O" };
    if (k === "amine") return { i:p.n[0], el:"N" };
    return { i:p.dO, el:"O" };
  }
  function duelBadges(m, t, pick){
    var ks = groupsOf(m), win = NM.name(m).P || "ene";
    return ks.map(function(k, q){ var a = anchor(m, k), w = k === win, u = t == null ? 0 : ease(t); return { i:a.i, el:a.el, t:BT[k], dx:0, dy:(q % 2 ? 1 : -1) * 30 + (w ? -u * 22 : u * 14), op:w ? 1 : 1 - u * 0.5, b:w && u > 0.5 }; });
  }

  // ---------- painting ----------
  function paintView(){
    var md = S.mode, o;
    if (md === "s2n") {
      var m = cur(), N = NM.name(m), j = C2.judge(S.tapes[S.mol] || [], m), rv = S.rev[S.mol];
      o = { smax:60, aria:"Structure of " + MV.plain(BANK[S.mol].cf) + "." + (rv ? " Name: " + N.name + "." : "") };
      if (rv || j.rows.par.s === "ok") o.glow = N.c.path;
      if (rv || j.rows.num.s === "ok") o.nums = N.c.path.map(function(i, k){ return { i:i, t:String(k + 1) }; });
      if (fx) o = Object.assign(o, fx);
      V.show(m, o);
    } else if (md === "duel") {
      var dm = dmol(), pk = S.dpick[S.duel];
      o = { smax:58, badges:duelBadges(dm, fx && fx.dt != null ? fx.dt : pk || S.drev[S.duel] ? 1 : null), aria:"Structure of " + MV.plain(DU[S.duel].cf) + " with a priority badge on each group." };
      V.show(dm, o);
    }
  }
  function paintRead(){
    var md = S.mode, el = $(".nm-read", host);
    if (md === "s2n") { var m = cur(); el.innerHTML = readRows(m, S.rev[S.mol] ? null : maskOf(C2.judge(S.tapes[S.mol] || [], m), m)); return; }
    if (md === "n2s") {
      var bm = built(), t = TG[S.tgt], mk = null;
      if (t.open && !openNamed()) mk = { name:'<span class="muted">? (name it with the chips)</span>' };
      el.innerHTML = MV.readoutHTML([["Target", t.open ? "any C₄H₈O₂ with ‘hydroxy’ and ‘-one’ in its name" : "<strong>" + t.t + "</strong>"]]) + readRows(bm, mk);
      return;
    }
    var dm = dmol(), pk = S.dpick[S.duel];
    el.innerHTML = readRows(dm, pk || S.drev[S.duel] ? null : { pg:'<span class="muted">? (choose the suffix group)</span>', oth:'<span class="muted">?</span>', par:'<span class="muted">?</span>', num:'<span class="muted">?</span>', ord:'<span class="muted">?</span>', name:'<span class="muted">?</span>' });
  }
  function paintCtl(){
    var md = S.mode;
    $$(".nm-p", host).forEach(function(p){ p.hidden = p.dataset.p !== md; });
    $(".nm-mol", host).hidden = md === "n2s"; $(".nm-bview", host).hidden = md !== "n2s";
    modeRG.lock(busy); grpRG.lock(busy); if (molRG) molRG.lock(busy); tgtRG.lock(busy); duelRG.lock(busy);
    $$("[data-x]", host).forEach(function(b){ b.disabled = busy; });
    chipsS.paint(); chipsO.paint();
    $(".nm-open", host).hidden = !TG[S.tgt].open;
    $(".nm-fb", host).innerHTML = nfb ? MV.fbHTML(nfb.ok ? "good" : "bad", nfb.html) : "";
    $(".nm-fb2", host).innerHTML = sfb ? MV.fbHTML(sfb.ok ? "good" : "bad", sfb.html) : "";
    $(".nm-fb3", host).innerHTML = ofb ? MV.fbHTML(ofb.ok ? "good" : "bad", ofb.html) : "";
    var dm = dmol(), pk = S.dpick[S.duel], win = NM.name(dm).P || "ene";
    MV.keepFocus($(".nm-dpick", host), function(){ $(".nm-dpick", host).innerHTML = groupsOf(dm).map(function(k){ var on = pk === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-dp="' + k + '" data-k="dp' + k + '"' + (busy ? " disabled" : "") + ">" + DL[k] + "</button>"; }).join(""); });
    var dfb = "";
    if (pk && !busy) {
      var N = NM.name(dm), wrong = pk !== win, alt = wrong ? NM.name(dm, pk === "ene" ? "" : pk) : null;
      dfb = MV.fbHTML(wrong ? "bad" : "good", wrong ? "<strong>✗ Not quite.</strong> " + RULES.m1.replace(/A ketone outranks an alcohol, so –OH becomes hydroxy-\./, cap1(art(win === "ene" ? "C=C" : GL[win])) + " (priority " + (PRI[win] || 8) + ") outranks " + art(pk === "ene" ? "C=C" : GL[pk]) + " (priority " + (PRI[pk] || 8) + ").") +
        (alt && alt.ok ? " With " + DL[pk].replace(/ \(.*\)$/, "") + " as the suffix the name would be " + alt.name + " ✗. The machine renames it: <strong>" + N.name + "</strong>." : " The machine’s name: <strong>" + N.name + "</strong>.")
        : "<strong>✓ Correct.</strong> " + cap1(DL[win].replace(/ \(.*\)$/, "")) + " has the highest priority, so it’s the suffix: <strong>" + N.name + "</strong>.");
    } else if (S.drev[S.duel] && !busy) dfb = MV.fbHTML("", "The machine’s answer: " + DL[win].replace(/ \(.*\)$/, "") + " has the highest priority, so it’s the suffix: <strong>" + NM.name(dm).name + "</strong>. Choose a group above to try it yourself.");
    $(".nm-dfb", host).innerHTML = dfb;
  }
  function paintCap(){
    var md = S.mode, c = $(".nm-cap", host), lg = $(".nm-leg", host);
    if (md === "s2n") { c.innerHTML = F(BANK[S.mol].cf.replace(/[₀-₉]/g, function(x){ return String(x.charCodeAt(0) - 8320); })) + (S.rev[S.mol] ? ' <span class="nm-capn">' + NM.name(cur()).name + "</span>" : ""); lg.textContent = "Glow: the parent chain (shown once your parent is right). Grey numbers: the numbering (shown once your locants are right)."; }
    else if (md === "n2s") { var t = TG[S.tgt], N = NM.name(built()); c.innerHTML = (t.open ? "Open target: C₄H₈O₂, hydroxy and -one" : "Target: <strong>" + t.t + "</strong>") + '<span class="nm-capn">Your structure: ' + (N.ok ? (t.open && !openNamed() ? F(fText(built())) : N.name) : "not nameable yet") + "</span>"; lg.textContent = "Tap an atom or a bond, then use the builder buttons. Glow and numbers: the parent chain of what you drew."; }
    else { c.innerHTML = F(DU[S.duel].cf.replace(/[₀-₉]/g, function(x){ return String(x.charCodeAt(0) - 8320); })); lg.textContent = "Badges: each group’s place on the priority list (1 is highest). Border colour: O magenta, N blue; every badge is labelled."; }
  }
  function paint(){
    paintCtl(); paintCap();
    if (S.mode === "n2s") B.paint(); else paintView();
    paintRead();
    MV.changed();
  }

  // ---------- events ----------
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.x === "chkN") {
      var m = cur(), j = C2.judge(S.tapes[S.mol] || [], m);
      if (j.ok) { S.rev[S.mol] = true; nfb = { ok:true, html:"<strong>✓ Correct: " + NM.name(m).name + ".</strong> " + (j.noteHTML || "") }; }
      else nfb = { ok:false, html:"<strong>✗ Not quite.</strong> " + j.msg };
      api.save(); paint(); MV.focusFb($('[data-p="s2n"]', host));
    }
    if (b.dataset.x === "chkS") {
      var t = TG[S.tgt], bm = built(), N = NM.name(bm);
      if (t.open) { var r = openCheck(); sfb = { ok:r.ok, html:r.ok ? "<strong>✓ That works:</strong> " + N.name + "." : "<strong>✗ Not yet.</strong> " + r.msg }; }
      else {
        var tn = NM.name(mol(MV.ans(t))).name;
        if (N.ok && N.name === tn) sfb = { ok:true, html:"<strong>✓ Match.</strong> Your structure is " + tn + ", " + F(fText(bm)) + "." };
        else sfb = { ok:false, html:"<strong>✗ Not quite.</strong> " + (N.ok ? "Your structure is " + N.name + ". " : "") + "Read the target name from the end: suffix, then parent, then prefixes with their locants." };
      }
      paint(); MV.focusFb($('[data-p="n2s"]', host));
    }
    if (b.dataset.dp) {
      var k = b.dataset.dp; S.dpick[S.duel] = k; api.save();
      busy = true; fx = { dt:0 }; paint();
      MV.tween({ dur:1100, step:function(u){ fx.dt = u; paintView(); }, done:function(){ busy = false; fx = null; paint(); MV.focusFb($('[data-p="duel"]', host)); } });
    }
  });

  // ---------- challenges ----------
  function openCheck(){
    var m = built(), f = fText(m), N = NM.name(m), R = NM.roles(m), tc = C.challenges[2];
    if (f !== "C4H8O2") return { ok:false, msg:"Your molecule is " + F(f) + "; you need C₄H₈O₂." };
    if (!N.ok) return { ok:false, msg:"The machine can’t name that structure. Keep one chain of carbons." };
    if (N.P === "acid") return { ok:false, msg:tc.acid };
    if (N.P === "al") return { ok:false, msg:tc.aldehyde };
    if (N.P === "ester") return { ok:false, msg:"C₄H₈O₂, but it’s an ester (-oate). You need a ketone with an –OH." };
    if (N.P !== "one") return { ok:false, msg:"C₄H₈O₂, but there’s no ketone: put a C=O inside the chain." };
    if (!R.has.ol) return { ok:false, msg:"It has -one, but no hydroxy: make the second O an –OH." };
    return { ok:true };
  }
  function chal(id){
    if (id === "tc1") {
      var tk = S.tapes.g7 || [], m = mol(BANK.g7.smi);
      if (!tk.length) return { ok:false, msg:"In Structure → name, choose (CH₃)₂CHCH₂COCH₃ (One group), then build its name with the chips." };
      var j = C2.judge(tk, m, { wrong:C.challenges[0].wrong });
      return j.ok ? { ok:true } : { ok:false, msg:j.msg };
    }
    if (id === "tc2") {
      var sp = S.built.tc2;
      if (!sp || sp.a.length < 2) return { ok:false, msg:"In Name → structure, choose the target 3-aminopropan-1-ol and build it." };
      var bm = specMol(sp), N = NM.name(bm), A = adj(bm), tc = C.challenges[1];
      if (N.ok && N.name === "3-aminopropan-1-ol") return { ok:true };
      if (bm.a.some(function(x, i){ return x.el === "C" && A[i].some(function(j2){ return bm.a[j2].el === "N"; }) && A[i].some(function(j2){ return bm.a[j2].el === "O"; }); })) return { ok:false, msg:tc.sameC };
      if (N.ok && N.name === "2-aminopropan-1-ol") return { ok:false, msg:tc.onC2 };
      return { ok:false, msg:(N.ok ? "Your structure is " + N.name + ". " : "") + "3-aminopropan-1-ol: a 3-carbon chain, –OH on C1, –NH₂ on C3." };
    }
    if (id === "tc3") {
      if (!S.built.open) return { ok:false, msg:"In Name → structure, choose the open target and build your molecule." };
      var r = openCheck(); if (!r.ok) return r;
      if (!S.otape.length) return { ok:false, msg:"The structure works. Now name it with the chips under the builder." };
      var tc3 = C.challenges[2], j3 = C2.judge(S.otape, built(), { wrong:[{ name:"1-hydroxybutan-3-one", fb:tc3.wrongNum }] });
      return j3.ok ? { ok:true } : { ok:false, msg:"The structure works, but the name isn’t right yet. " + j3.msg };
    }
    return { ok:false };
  }

  // ---------- predictions ----------
  function both(m, N, upTo, pick){ // two numbering directions of the parent: A above (left to right), B below
    var p = N.c.path, alt = N.alts[0] ? N.alts[0].path : p.slice().reverse(), A2 = sideWord(m, p, true) === "from the left" ? p : alt, B2 = A2 === p ? alt : p;
    var out = [];
    A2.forEach(function(i, k){ if (k < upTo[0]) out.push({ i:i, t:String(k + 1), side:-1, col:pick === "B" ? "--ink-2" : "--pen", op:pick === "B" ? 0.45 : 1 }); });
    B2.forEach(function(i, k){ if (k < upTo[1]) out.push({ i:i, t:String(k + 1), side:1, col:pick === "A" ? "--ink-2" : "--pen", op:pick === "A" ? 0.45 : 1 }); });
    return out;
  }
  var hooks = {
    start:function(p){
      busy = false; fx = null; nfb = null;
      if (p.id === "p1") { S.mode = "duel"; S.duel = "d1"; delete S.dpick.d1; delete S.drev.d1; duelRG.set("d1"); }
      else { S.mode = "s2n"; S.mol = p.mol; grpRG.set(GRP[p.mol]); paintMols(); }
      modeRG.set(S.mode); api.save(); paint();
    },
    run:function(p, done){
      busy = true; paint();
      var m, N;
      function end(){ busy = false; fx = null; if (p.id !== "p1") S.rev[p.mol] = true; api.save(); paint(); MV.wait(150, done); }
      if (p.id === "p1") {
        fx = { dt:0 }; paint();
        MV.tween({ dur:1600, step:function(u){ fx.dt = u; paintView(); }, done:function(){ S.drev.d1 = true; end(); } });
        return;
      }
      m = cur(); N = NM.name(m);
      var L = N.c.path.length;
      if (p.id === "p2" || p.id === "p4") {
        MV.tween({ dur:2600, step:function(u){ var a = Math.min(L, Math.floor(u * 2 * L + 0.001)), b2 = Math.max(0, Math.min(L, Math.floor((u - 0.5) * 2 * L + 0.001))); fx = { glow:N.c.path, nums:both(m, N, [a, b2]) }; paintView(); },
          done:function(){ var pick = sideWord(m, N.c.path, true) === "from the left" ? "A" : "B"; fx = { glow:N.c.path, nums:both(m, N, [L, L], pick) }; paintView(); MV.wait(MV.reduceMotion ? 0 : 900, end); } });
        return;
      }
      // p3: the alcohol part and the acid part
      var R = NM.roles(m), c = R.kind.indexOf("ester"), oE = R.per[c].or[0], alc = [], seen = {}, stk = [oE]; seen[c] = 1;
      while (stk.length) { var x = stk.pop(); if (seen[x]) continue; seen[x] = 1; alc.push(x); adj(m)[x].forEach(function(y){ if (!seen[y]) stk.push(y); }); }
      var acid = m.a.map(function(_, i){ return i; }).filter(function(i){ return alc.indexOf(i) < 0; });
      MV.tween({ dur:1800, step:function(u){ fx = { glow:u > 0.2 ? alc : null, glow2:u > 0.6 ? acid : null, tags:[].concat(u > 0.2 ? [{ i:alc[alc.length - 1], t:"from the alcohol" }] : [], u > 0.6 ? [{ i:c, t:"from the acid", dy:52 }] : []) }; paintView(); },
        done:function(){ MV.wait(MV.reduceMotion ? 0 : 700, end); } });
    }
  };
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Common names and real labels ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.m1 = S.m1 || {}; S.l2 = S.l2 || {}; S.a3 = S.a3 || {};
  var sel1 = null, fb1 = null, fb2 = {}, fb3 = {};
  host.innerHTML = '<div class="part nm-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="nm-s1"></div></div>' +
    '<div class="part nm-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="nm-s2"></div></div>' +
    '<div class="part nm-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="nm-s3"></div><details class="alg nm-data"><summary>' + s3.data + '</summary><div class="nm-s3d"></div></details></div>';
  function nameOf(id){ return s1.names.filter(function(n){ return n.id === id; })[0]; }
  var ORD1 = MV.shuffle(s1.names.map(function(_, i){ return i; }), MV.meta.id + "s1");
  function paint1(){
    var done = s1.products.every(function(p){ return S.m1[p.id]; }), taken = {};
    s1.products.forEach(function(p){ if (S.m1[p.id]) taken[MV.ans(p)] = p; });
    var h = '<div class="nm-prods" role="group" aria-label="Product cards">' + s1.products.map(function(p){
      var ok = S.m1[p.id], on = sel1 === p.id;
      return '<button type="button" class="nm-card nm-prod' + (ok ? " done" : "") + '" aria-pressed="' + on + '" data-p1="' + p.id + '" data-k="p1' + p.id + '"' + (ok ? " disabled" : "") + '><span class="nm-pn">' + p.product + '</span><span class="nm-pc">ingredient: ' + p.common + "</span>" + (ok ? '<span class="nm-pm">✓ ' + nameOf(MV.ans(p)).t + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    h += '<p class="nm-sub">' + (sel1 ? "Now tap the IUPAC name and structure for " + s1.products.filter(function(p){ return p.id === sel1; })[0].common + "." : "IUPAC names and structures") + "</p>";
    h += '<div class="nm-names" role="group" aria-label="IUPAC names and structures">' + ORD1.map(function(i){
      var n = s1.names[i], tk = taken[n.id];
      return '<button type="button" class="nm-card nm-nm' + (tk ? " done" : "") + '" data-n1="' + n.id + '" data-k="n1' + n.id + '"' + (tk ? " disabled" : "") + '><span class="nm-pn">' + n.t + "</span>" + miniSVG(mol(n.smi), 150, 84, { smax:30, aria:"Structure of " + n.t }) + (tk ? '<span class="nm-pm">✓ ' + tk.common + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    if (fb1) h += MV.fbHTML(fb1.ok ? "good" : "bad", fb1.html);
    if (done) h += MV.fbHTML("good", "<strong>✓ " + s1.done + "</strong>");
    MV.keepFocus($(".nm-s1", host), function(){ $(".nm-s1", host).innerHTML = h; });
  }
  $(".nm-s1", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.p1) { sel1 = sel1 === b.dataset.p1 ? null : b.dataset.p1; fb1 = null; paint1(); return; }
    if (b.dataset.n1) {
      if (!sel1) { fb1 = { ok:false, html:"Tap a product card first, then its IUPAC name." }; paint1(); return; }
      var p = s1.products.filter(function(x){ return x.id === sel1; })[0], want = MV.ans(p);
      if (b.dataset.n1 === want) { S.m1[p.id] = 1; fb1 = { ok:true, html:"<strong>✓ " + p.common + " → " + nameOf(want).t + ".</strong>" }; sel1 = null; api.save(); }
      else fb1 = { ok:false, html:"<strong>✗ Not that one.</strong> " + nameOf(want).tip + " Try another card." };
      paint1(); MV.focusFb($(".nm-s1", host));
    }
  });
  // station 2
  function lst(id){ return S.l2[id] || (S.l2[id] = { w:null, alc:null, acid:null, ok:false }); }
  function paint2(){
    var h = s2.labels.map(function(L){
      var x = lst(L.id), words = L.name.split(" "), ans = MV.ans(L), ao = MV.shuffle(L.alcohols.slice(), MV.meta.id + L.id + "a"), co = MV.shuffle(L.acids.slice(), MV.meta.id + L.id + "c");
      var r = '<div class="nm-lab" data-l2="' + L.id + '"><p class="nm-ln"><strong>' + L.flavour + ":</strong> " + L.name + (L.common ? ' <span class="muted">(' + L.common + ")</span>" : "") + "</p>";
      r += '<p class="nm-sub">' + s2.split + '</p><div class="chips">' + words.map(function(w, k){ var on = x.w === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-w="' + k + '" data-k="' + L.id + "w" + k + '"' + (x.ok ? " disabled" : "") + ">" + w + "</button>"; }).join("") + "</div>";
      if (x.w === 0) {
        r += '<p class="nm-sub">Parent alcohol</p><div class="chips">' + ao.map(function(t){ var on = x.alc === t; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-alc="' + esc(t) + '" data-k="' + L.id + "a" + esc(t) + '"' + (x.ok ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</div>";
        r += '<p class="nm-sub">Parent acid</p><div class="chips">' + co.map(function(t){ var on = x.acid === t; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-acid="' + esc(t) + '" data-k="' + L.id + "c" + esc(t) + '"' + (x.ok ? " disabled" : "") + ">" + t + "</button>"; }).join("") + "</div>";
        if (!x.ok) r += '<div class="q-actions"><button type="button" class="btn primary sm" data-l2c="1" data-k="' + L.id + 'chk">Check</button></div>';
      }
      if (fb2[L.id]) r += MV.fbHTML(fb2[L.id].ok ? "good" : "bad", fb2[L.id].html);
      if (x.ok) {
        var m = mol(L.smi), R = NM.roles(m), c = R.kind.indexOf("ester"), oE = R.per[c].or[0], alc = [], seen = {}, stk = [oE]; seen[c] = 1;
        while (stk.length) { var y = stk.pop(); if (seen[y]) continue; seen[y] = 1; alc.push(y); adj(m)[y].forEach(function(z){ if (!seen[z]) stk.push(z); }); }
        r += '<div class="nm-zoom">' + miniSVG(m, 340, 170, { smax:30, glow:alc, glow2:m.a.map(function(_, i){ return i; }).filter(function(i){ return alc.indexOf(i) < 0; }), aria:"Structure of " + L.name + ": the alcohol part glows; the acid part has a dashed outline." }) +
          '<p class="tiny muted">Glow: the part from the alcohol (' + ans[0] + "). Dashed outline: the part from the acid (" + ans[1] + ").</p></div>";
      }
      return r + "</div>";
    }).join("");
    MV.keepFocus($(".nm-s2", host), function(){ $(".nm-s2", host).innerHTML = h; });
  }
  $(".nm-s2", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-l2]"), L = s2.labels.filter(function(z){ return z.id === box.dataset.l2; })[0], x = lst(L.id), ans = MV.ans(L);
    if (b.dataset.w != null) { x.w = +b.dataset.w; fb2[L.id] = x.w === 0 ? null : { ok:false, html:"<strong>✗ Not quite.</strong> " + s2.splitFb }; }
    else if (b.dataset.alc != null) { x.alc = b.dataset.alc; fb2[L.id] = null; }
    else if (b.dataset.acid != null) { x.acid = b.dataset.acid; fb2[L.id] = null; }
    else if (b.dataset.l2c) {
      if (!x.alc || !x.acid) fb2[L.id] = { ok:false, html:"Pick a parent alcohol and a parent acid first." };
      else if (x.alc === ans[0] && x.acid === ans[1]) { x.ok = true; fb2[L.id] = { ok:true, html:"<strong>✓ " + ans[0] + " + " + ans[1] + ".</strong> " + s2.done + L.name + " forms from them by esterification." }; }
      else fb2[L.id] = { ok:false, html:"<strong>✗ Not quite.</strong> " + (x.alc !== ans[0] ? "The alcohol has the carbons of the first word (" + L.name.split(" ")[0] + ") and ends in -ol. " : "") + (x.acid !== ans[1] ? "The acid has the carbons of the -oate word, counting the C=O carbon, and ends in -oic acid." : "") };
    }
    api.save(); paint2(); if (b.dataset.l2c) MV.focusFb(box);
  });
  // station 3
  function ast(id){ return S.a3[id] || (S.a3[id] = { c:null, o:null, ok:false, tried:false }); }
  function paint3(){
    var h = s3.acids.map(function(A2){
      var x = ast(A2.id);
      function row(key, lab){ return '<p class="nm-sub">' + lab + '</p><div class="chips" role="group" aria-label="' + esc(lab) + '">' + [0, 1, 2, 3, 4].map(function(v){ var on = x[key] === v; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-' + key + '="' + v + '" data-k="' + A2.id + key + v + '"' + (x.ok ? " disabled" : "") + ">" + v + "</button>"; }).join("") + "</div>"; }
      var r = '<div class="nm-lab" data-a3="' + A2.id + '"><p class="nm-ln"><strong>' + A2.common + ":</strong> " + A2.name + "</p>" + row("c", "How many –COOH groups?") + row("o", "How many –OH groups (not counting the OH inside –COOH)?");
      if (!x.ok) r += '<div class="q-actions"><button type="button" class="btn primary sm" data-a3c="1" data-k="' + A2.id + 'chk">Check</button></div>';
      if (fb3[A2.id]) r += MV.fbHTML(fb3[A2.id].ok ? "good" : "bad", fb3[A2.id].html);
      return r + "</div>";
    }).join("");
    MV.keepFocus($(".nm-s3", host), function(){ $(".nm-s3", host).innerHTML = h; });
    $(".nm-s3d", host).innerHTML = s3.acids.map(function(A2){
      var m = mol(A2.smi), R = NM.roles(m), ac = [], oh = [];
      R.kind.forEach(function(k, i){ if (k === "acid") { ac.push(i, R.per[i].dO, R.per[i].oh[0]); } else if (R.per[i] && R.per[i].oh.length && k !== "acid") oh.push(R.per[i].oh[0]); });
      var x = ast(A2.id);
      return '<div class="nm-zoom"><p><strong>' + A2.common + "</strong>" + (x.tried ? "" : ' <span class="muted">(check your count above first; the structure is here when you want it)</span>') + "</p>" + miniSVG(m, 360, 190, { smax:30, glow:oh, glow2:ac, aria:"Structure of " + A2.name + ": " + MV.ans(A2)[0] + " –COOH groups (dashed outlines) and " + MV.ans(A2)[1] + " –OH (glow)." }) +
        '<p class="tiny muted">Dashed outlines: the –COOH groups (' + MV.ans(A2)[0] + "). Glow: the –OH (" + MV.ans(A2)[1] + ").</p></div>";
    }).join("");
  }
  $(".nm-s3", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-a3]"), A2 = s3.acids.filter(function(z){ return z.id === box.dataset.a3; })[0], x = ast(A2.id), ans = MV.ans(A2);
    if (b.dataset.c != null) x.c = +b.dataset.c; else if (b.dataset.o != null) x.o = +b.dataset.o;
    else if (b.dataset.a3c) {
      if (x.c == null || x.o == null) fb3[A2.id] = { ok:false, html:"Choose both counts first." };
      else { x.tried = true; x.ok = x.c === ans[0] && x.o === ans[1]; fb3[A2.id] = { ok:x.ok, html:(x.ok ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + A2.why + " Open <em>" + s3.data + "</em> below to see the structure." }; var d = $(".nm-data", host); if (d) d.open = true; }
    }
    api.save(); paint3(); if (b.dataset.a3c) MV.focusFb(box);
  });
  paint1(); paint2(); paint3();
}

// ---------- Practice 1: Name it (chip naming) ----------
function itemNav(a, S){
  var i = clamp(S.i || 0, 0, a.items.length - 1);
  return '<div class="nm-nav" role="group" aria-label="Items">' + a.items.map(function(it, k){ var x = S.items[it.id] || {}; return '<button type="button" class="chip nm-dot' + (k === i ? " on" : "") + '" aria-pressed="' + (k === i) + '" data-go="' + k + '" data-k="go' + a.id + k + '" aria-label="Item ' + (k + 1) + (x.solved ? ", solved" : "") + '">' + (it.label || k + 1) + (x.solved ? " ✓" : "") + "</button>"; }).join("") + "</div>";
}
function statsOf(a, S, title){
  var f = 0, d = 0; a.items.forEach(function(it){ var x = S.items[it.id] || {}; if (x.solved) d++; if (x.solved && x.first) f++; });
  return { first:f, total:a.items.length, done:d, line:(title || a.summary) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") };
}
function missedOf(a, S){ var g = []; a.items.forEach(function(it){ var x = S.items[it.id] || {}; if ((x.tries || 0) > 0 || (x.hint || 0) >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
function nameItAct(host, api, a){
  rules();
  var S = api.S; S.items = S.items || {}; S.i = clamp(S.i || 0, 0, a.items.length - 1);
  var fb = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tk:[], tries:0, hint:0, solved:false, first:false }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="nm-navh"></div><div class="nm-item"><div class="nm-iq"></div><div class="nm-ichips"></div><div class="nm-iact"></div></div>';
  var chips = nameChips($(".nm-ichips", host), { get:function(){ return ist(a.items[S.i].id).tk; }, set:function(tk){ ist(a.items[S.i].id).tk = tk; fb[a.items[S.i].id] = null; api.save(); }, onChange:function(){ paintAct(); }, locked:function(){ return ist(a.items[S.i].id).solved; } });
  function paintAct(){
    var it = a.items[S.i], x = ist(it.id), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-a="chk" data-k="nichk">Check</button>' + MV.hintBtn("nih", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (fb[it.id]) h += MV.fbHTML(fb[it.id].ok ? "good" : "bad", fb[it.id].html);
    else if (x.solved) h += MV.fbHTML("good", "<strong>✓ " + MV.ans(it) + (it.common ? " (" + it.common + ")" : "") + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-a="prev" data-k="niprev"' + (S.i ? "" : " disabled") + '>Previous</button><button type="button" class="btn ghost sm" data-a="next" data-k="ninext"' + (S.i < a.items.length - 1 ? "" : " disabled") + ">Next</button></div>";
    MV.keepFocus($(".nm-iact", host), function(){ $(".nm-iact", host).innerHTML = h; });
  }
  function paint(){
    var it = a.items[S.i];
    MV.keepFocus($(".nm-navh", host), function(){ $(".nm-navh", host).innerHTML = itemNav(a, S); });
    $(".nm-iq", host).innerHTML = '<p class="nm-ln"><strong>' + (S.i + 1) + ".</strong> " + it.cf + "</p>" + miniSVG(mol(it.smi), 360, 150, { smax:40, aria:"Structure of " + MV.plain(it.cf) });
    chips.paint(); paintAct();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.go != null) { S.i = +b.dataset.go; api.save(); paint(); return; }
    var it = a.items[S.i], x = ist(it.id);
    if (b.dataset.a === "prev" || b.dataset.a === "next") { S.i = clamp(S.i + (b.dataset.a === "next" ? 1 : -1), 0, a.items.length - 1); api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintAct(); return; }
    if (b.dataset.a === "chk") {
      var j = C2.judge(x.tk, mol(it.smi), { wrong:it.wrong });
      if (j.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; fb[it.id] = { ok:true, html:"<strong>✓ Correct: " + MV.ans(it) + (it.common ? " (" + it.common + ")" : "") + ".</strong> " + (j.noteHTML || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') }; }
      else { x.tries++; fb[it.id] = { ok:false, html:"<strong>✗ Not quite.</strong> " + j.msg + " Try again." }; }
      api.save(); paint(); MV.focusFb($(".nm-iact", host));
    }
  });
  paint();
  return { stats:function(){ return statsOf(a, S); }, missed:function(){ return missedOf(a, S); } };
}

// ---------- Practice 2: Name ↔ structure and fix-it ----------
function parseF(s){
  var t = String(s || "").replace(/[₀-₉]/g, function(c){ return String(c.charCodeAt(0) - 8320); }).replace(/\s+/g, ""), f = {}, re = /(Cl|Br|[CHNOF])(\d*)/g, m, used2 = 0;
  while ((m = re.exec(t))) { f[m[1]] = (f[m[1]] || 0) + (m[2] ? +m[2] : 1); used2 += m[0].length; }
  return used2 === t.length && t.length ? fStr(f) : null;
}
function fixItAct(host, api, a){
  rules();
  var S = api.S; S.items = S.items || {}; S.i = clamp(S.i || 0, 0, a.items.length - 1);
  var fb = {};
  a.items.forEach(function(it, k){ it.label = "F" + (k + 1); });
  function ist(id){ return S.items[id] || (S.items[id] = { sp:{ a:["C"], b:[] }, f:"", tk:[], tries:0, hint:0, solved:false, first:false, found:[] }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="nm-navh"></div><div class="nm-item"><div class="nm-iq"></div><div class="nm-fbld"><div class="nm-fview"></div><div class="nm-fmenu"></div></div>' +
    '<div class="nm-fform"><label class="nm-flab">Molecular formula <input type="text" class="nm-fin" autocomplete="off" spellcheck="false" placeholder="e.g. C3H6O"></label></div><div class="nm-fchips"><p class="nm-sub nm-fct"></p><div class="nm-fch"></div></div><div class="nm-iact"></div></div>';
  var it0 = function(){ return a.items[S.i]; };
  var B = builder($(".nm-fview", host), $(".nm-fmenu", host), { get:function(){ return ist(it0().id).sp; }, set:function(sp){ ist(it0().id).sp = sp; fb[it0().id] = null; api.save(); }, onChange:function(){ paintAct(); }, locked:function(){ return ist(it0().id).solved; } });
  var chips = nameChips($(".nm-fch", host), { get:function(){ return ist(it0().id).tk; }, set:function(tk){ ist(it0().id).tk = tk; fb[it0().id] = null; api.save(); }, onChange:function(){ paintAct(); }, locked:function(){ return ist(it0().id).solved; } });
  var fin = $(".nm-fin", host);
  fin.addEventListener("input", function(){ ist(it0().id).f = fin.value; api.save(); });
  function paintAct(){
    var it = it0(), x = ist(it.id), h = "";
    if (it.kind === "esters") h += '<p class="nm-found"><strong>Found ' + x.found.length + " of 4:</strong> " + (x.found.length ? x.found.join("; ") : "none yet") + "</p>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-a="chk" data-k="fxchk">' + (it.kind === "esters" ? "Add this ester" : "Check") + "</button>" + MV.hintBtn("fxh", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (fb[it.id]) h += MV.fbHTML(fb[it.id].ok ? "good" : "bad", fb[it.id].html);
    else if (x.solved) h += MV.fbHTML("good", "<strong>✓ Solved.</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-a="prev" data-k="fxprev"' + (S.i ? "" : " disabled") + '>Previous</button><button type="button" class="btn ghost sm" data-a="next" data-k="fxnext"' + (S.i < a.items.length - 1 ? "" : " disabled") + ">Next</button></div>";
    MV.keepFocus($(".nm-iact", host), function(){ $(".nm-iact", host).innerHTML = h; });
  }
  function paint(){
    var it = it0(), x = ist(it.id), draw = it.kind !== "fix";
    MV.keepFocus($(".nm-navh", host), function(){ $(".nm-navh", host).innerHTML = itemNav(a, S); });
    $(".nm-iq", host).innerHTML = '<p class="nm-ln"><strong>' + it.label + (it.star ? " ★" : "") + ".</strong> " + it.prompt + "</p>" + (it.kind === "fix" ? '<p class="tiny muted">The structure this name describes:</p>' + miniSVG(mol(it.smi), 360, 150, { smax:40, aria:"Structure that the name " + it.given + " describes" }) : "");
    $(".nm-fbld", host).hidden = !draw; $(".nm-fform", host).hidden = it.kind !== "draw"; $(".nm-fchips", host).hidden = it.kind === "draw";
    $(".nm-fct", host).textContent = it.kind === "fix" ? "Build the correct name" : "Name your ester";
    fin.value = x.f || ""; fin.disabled = x.solved;
    if (draw) { B.clear(); B.paint(); }
    chips.paint(); paintAct();
  }
  function check(){
    var it = it0(), x = ist(it.id), ok = false, msg = "";
    if (it.kind === "draw") {
      var m = specMol(x.sp), N = NM.name(m), tn = NM.name(mol(MV.ans(it))).name, ff = parseF(x.f), wf = (it.wrongF || []).filter(function(w){ return w.f === ff; })[0];
      if (!N.ok || N.name !== tn) msg = (N.ok ? "Your structure is " + N.name + ", not " + tn + ". " : "") + "Read the name: parent chain, then the suffix group, then the prefixes.";
      else if (!x.f.trim()) msg = "The structure is right. Now type its molecular formula.";
      else if (!ff) msg = "Type the formula as element symbols and counts, e.g. C3H6O.";
      else if (ff !== it.formula) msg = wf ? wf.fb : "The structure is right, but count the atoms again: C, then H (from each atom’s bonds), then the rest.";
      else ok = true;
    } else if (it.kind === "fix") {
      var j = C2.judge(x.tk, mol(it.smi), { wrong:it.wrong }); ok = j.ok; msg = j.msg;
    } else {
      var m2 = specMol(x.sp), N2 = NM.name(m2), f2 = fText(m2), list = MV.ans(it);
      if (f2 !== "C4H8O2") msg = "Your molecule is " + F(f2) + "; you need C₄H₈O₂. " + it.fb;
      else if (!N2.ok || N2.P !== "ester") msg = "That isn’t an ester: you need a C=O carbon with a single-bonded O–C on the same carbon.";
      else if (x.found.indexOf(N2.name) >= 0) { fb[it.id] = { ok:false, html:"You’ve already found " + N2.name + ". " + it.fb }; return; }
      else { var j2 = C2.judge(x.tk, m2); if (!j2.ok) msg = "The ester is right; the name isn’t yet. " + j2.msg; else { x.found.push(N2.name); if (list.every(function(n){ return x.found.indexOf(n) >= 0; })) ok = true; else { fb[it.id] = { ok:true, html:"<strong>✓ " + N2.name + " added.</strong> " + it.fb }; x.sp = { a:["C"], b:[] }; x.tk = []; return; } } }
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; fb[it.id] = { ok:true, html:"<strong>✓ Correct.</strong> " + (it.kind === "draw" ? NM.name(mol(MV.ans(it))).name + ": " + F(it.formula) + "." : it.kind === "fix" ? "The correct name is " + MV.ans(it) + "." : "All four: " + x.found.join("; ") + ".") + (x.first ? "" : ' <span class="muted">(not first try)</span>') }; }
    else { x.tries++; fb[it.id] = { ok:false, html:"<strong>✗ Not quite.</strong> " + msg }; }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.closest(".nm-fmenu") || b.closest(".nm-fview") || b.closest(".nm-fch")) return;
    if (b.dataset.go != null) { S.i = +b.dataset.go; api.save(); paint(); return; }
    var x = ist(it0().id);
    if (b.dataset.a === "prev" || b.dataset.a === "next") { S.i = clamp(S.i + (b.dataset.a === "next" ? 1 : -1), 0, a.items.length - 1); api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintAct(); return; }
    if (b.dataset.a === "chk") { check(); api.save(); paint(); MV.focusFb($(".nm-iact", host)); }
  });
  paint();
  return { stats:function(){ return statsOf(a, S); }, missed:function(){ return missedOf(a, S); } };
}

// ---------- Performance task: Name designer (C/O builder, ≤ 5 C and 1 O, plus name chips) ----------
var VALID3 = ["2-methylbutanal", "3-methylbutanal", "3-methylbutan-2-one"];
var task = (function(){
  var S = null, api = null, B = null, chips = null;
  function fresh(){ return { a:["C", "C", "C", "C"], b:[[0, 1, 1], [1, 2, 1], [2, 3, 1]] }; }
  function read(){
    if (!S) return { l:[false, false, false, false] };
    var m = specMol(S.mol), f = fText(m), N = NM.name(m), R = NM.roles(m);
    var carb = N.ok && (N.P === "al" || N.P === "one") && formula(m).O === 1 && !m.a.some(function(x, i){ return x.el === "O" && hc(m)[i] > 0; });
    var len = N.ok && carb ? N.c.path.length : 0;
    return { m:m, N:N, f:f, carb:carb, len:len, l:[f === "C5H10O", carb, carb && len === 4, N.ok && !!S.tk.length && C2.judge(S.tk, m).ok] };
  }
  function paintPv(){
    var d = read(), N = d.N;
    $("#nm-tkread").innerHTML = MV.readoutHTML([["Formula", F(d.f)], ["Family", d.carb ? cap1(GL[N.P]) : N.ok ? (N.P ? cap1(GL[N.P]) + " (not a carbonyl)" : "no C=O group") : "—"], ["Parent chain", N.ok ? N.c.path.length + " carbon" + (N.c.path.length > 1 ? "s" : "") + (d.carb ? " (contains the C=O)" : "") : "—"]]);
  }
  return {
    render:function(inp, pv, a){
      rules(); api = a; S = a.S; if (!S.mol || !S.mol.a || !S.mol.a.length) S.mol = fresh(); if (!Array.isArray(S.tk)) S.tk = [];
      inp.innerHTML = '<h4 class="nm-h4">Builder</h4><div id="nm-tkview"></div><div id="nm-tkmenu"></div><h4 class="nm-h4">Name it</h4><div id="nm-tkchips"></div>';
      pv.innerHTML = '<h4 class="nm-h4">Your molecule</h4><dl class="read" id="nm-tkread" aria-live="polite"></dl>';
      B = builder($("#nm-tkview"), $("#nm-tkmenu"), { get:function(){ return S.mol; }, set:function(sp){ S.mol = sp; api.save(); }, onChange:function(){ paintPv(); api.update(); }, els:["C", "O"], max:{ C:5, O:1, all:6 }, fresh:fresh });
      chips = nameChips($("#nm-tkchips"), { get:function(){ return S.tk; }, set:function(tk){ S.tk = tk; api.save(); }, onChange:function(){ api.update(); } });
      B.paint(); paintPv();
      var chk = document.getElementById("task-check");
      if (chk) chk.addEventListener("click", function(){
        setTimeout(function(){
          var st = MV.taskState(), d = read(), fbx = $("#task-fb .fb");
          if (!fbx || fbx.classList.contains("good")) return;
          if (d.l[0] && d.l[1] && d.l[2] && !d.l[3] && S.tk.length) { var j = C2.judge(S.tk, d.m); fbx.innerHTML += "<p>" + j.msg + "</p>"; }
          void st;
        }, 0);
      });
    },
    read:read,
    valid:function(d){ return d.m ? true : "Build a molecule first."; },
    checks:function(d){ return d.l; },
    key:function(d){ return d.N.name; }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ nameit:nameItAct, fixit:fixItAct },
  task:task
});
})();
