// SCH4U 11 Stereoisomers: hero (ethane spins, ethene's C=C snaps back, cis and trans but-2-ene slide apart), Isomer explorer
// (Explore: C1 builder with a 2D drawing and a 3D model, the rotation test with a π band and energy bar, a cis–trans mode with
// four places, compare mode, a C₄H₈ list), Same formula, different properties (Part 3: data cards with particle zooms, cis vs
// trans effects, a fats sorter), "Isomer puzzles" (number entry + choices) and the "Isomer family" card task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, D = MV.chem.data;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function asc(a, b){ return a - b; }
function r1(v){ return Math.round(v * 10) / 10; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function ease(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function LIN(t){ return t; }

// ---------- module data (plan §4 data list; course table additions, plan §6 risk 1) ----------
// Boiling points (°C): butane, 2-methylpropane, pentane, 2-methylbutane and 2,2-dimethylpropane come from MV.chem.data.bp
// (module 01); the others below are course table additions (rounded literature values). Melting points: all additions.
var BPX = { ethanol:78, methoxymethane:-24, "propan-1-ol":97, "propan-2-ol":82, propanal:49, propanone:56, "cis-but-2-ene":4, "trans-but-2-ene":1,
  "cis-1,2-dichloroethene":60, "trans-1,2-dichloroethene":48, "1,1-dichloroethene":32 };
var MPX = { butane:-138, "2-methylpropane":-160, pentane:-130, "2-methylbutane":-160, "2,2-dimethylpropane":-17, ethanol:-114, methoxymethane:-141,
  "propan-1-ol":-126, "propan-2-ol":-89, propanal:-80, propanone:-95, "cis-but-2-ene":-139, "trans-but-2-ene":-106, "cis-1,2-dichloroethene":-80,
  "trans-1,2-dichloroethene":-50, "1,1-dichloroethene":-122 };
var FATS = { sat:70, cis:13, trans:44 };   // 18-carbon fatty acid melting points (°C), course table additions
var PI_BARRIER = 270;                       // ≈ kJ/mol to twist a C=C until the π bond breaks, course table addition

// @component radioGroup (from MHF4U 25, via SCH4U 01–07) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}


// ===== C1 molecule core (no DOM) =====
// @component C1 moleculeView/moleculeBuilder core (from SCH4U 09's SMILES-lite parser, ring finder and C2 namer; local fixes:
// no ene locant on 2- and 3-carbon alkene parents, and no locant on a single prefix of ethene) plus, new here: z flags on C=C
// bonds (cis/trans), canonical branch keys, the cis–trans test, a stereo-aware identity check, isomer relationships
// (same / structural: chain, position, functional group / stereoisomer / not isomers), a bond-dipole polarity sum, a 2D
// zigzag layout that honours z, and a 3D model with explicit H, VSEPR directions and z-placed C=C groups.
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
    o.showPre = asSub || (ring ? !one : n > 2 || (n === 2 && nf + (P === "ol" || P === "one" || P === "amine" ? c.pg.length : 0) > 1));   // SCH4U 11: chloroethene, methoxyethene
    o.showSuf = !P || term ? false : ring ? !one : n === 1 ? false : n === 2 ? !one : !(n === 3 && P === "one" && one);
    o.showMb = ring ? !one : n === 2 ? false : !(n === 3 && !P);   // SCH4U 11: no ene locant on 2- and 3-carbon alkene parents (1,1-dichloroethene, 2-methylpropene, 3-chloropropene)
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

// ---------- spec (saved state) <-> molecule. Bonds are [i, j, order, z]; z on a C=C: 1 when the lowest-index heavy
// neighbours of its two carbons sit on the same side (cis-like), 0 when opposite. ----------
function molOf(sp){ return { a:sp.a.map(function(el){ return { el:el }; }), b:sp.b.map(function(x){ return [x[0], x[1], x[2] || 1, x[3] ? 1 : 0]; }), main:[] }; }
function specOf(m){ return { a:m.a.map(function(x){ return x.el; }), b:m.b.map(function(x){ return [x[0], x[1], x[2] || 1, x[3] ? 1 : 0]; }) }; }
function mk(smi, z){ var m = smiles(smi); m.b.forEach(function(x){ x[2] = x[2] || 1; x[3] = 0; }); if (z != null) m.b.forEach(function(x){ if (x[2] === 2 && m.a[x[0]].el === "C" && m.a[x[1]].el === "C") x[3] = z; }); return specOf(m); }

// ---------- iso (from SCH4U 02's C1: colour refinement + individualization; bond orders count) ----------
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
  var n1 = m1.a.length; if (n1 !== m2.a.length || !n1) return n1 === m2.a.length;
  var h1 = hc(m1), h2 = hc(m2), G = graph(m1, 0).concat(graph(m2, n1));
  return search(G, rank(m1.a.map(function(a, i){ return a.el + h1[i]; }).concat(m2.a.map(function(a, i){ return a.el + h2[i]; }))), n1);
}
// carbon skeleton (C atoms, C–C bonds as single bonds): same skeleton = position isomers, different = chain isomers
function skel(m){
  var map = {}, a = [], b = [];
  m.a.forEach(function(x, i){ if (x.el === "C") { map[i] = a.length; a.push({ el:"C" }); } });
  m.b.forEach(function(x){ if (x[0] in map && x[1] in map) b.push([map[x[0]], map[x[1]], 1, 0]); });
  return { a:a, b:b, main:[] };
}

// ---------- groups on a C=C, cis–trans test, stereo descriptor ----------
// bkey: canonical key of the branch at r (away from `from`); glabel: its formula text for readouts ("CH3", "C2H5", "OH", "Cl")
function bkey(m, r, from){
  var A = adj(m), h = hc(m), seen = {}; seen[from] = 1;
  function k(x){ seen[x] = 1; var ch = A[x].filter(function(y){ return !seen[y]; }).map(function(y){ return (order(m, x, y) > 1 ? "=" : "") + k(y); }).sort(); return m.a[x].el + h[x] + (ch.length ? "(" + ch.join(",") + ")" : ""); }
  return k(r);
}
function glabel(m, r, from){
  var A = adj(m), h = hc(m), seen = {}, cnt = { C:0, H:0, O:0, Cl:0 }, st = [r]; seen[from] = 1;
  while (st.length) { var x = st.pop(); if (seen[x]) continue; seen[x] = 1; cnt[m.a[x].el] = (cnt[m.a[x].el] || 0) + 1; cnt.H += h[x]; A[x].forEach(function(y){ if (!seen[y]) st.push(y); }); }
  if (cnt.C && !cnt.O && !cnt.Cl && cnt.H === 2 * cnt.C + 1) return cnt.C === 1 ? "CH3" : "C" + cnt.C + "H" + cnt.H;
  var s = "", prev = from, cur = r;
  for (var g = 0; g < 6; g++) {
    s += m.a[cur].el + (h[cur] ? "H" + (h[cur] > 1 ? h[cur] : "") : "");
    var nx = A[cur].filter(function(y){ return y !== prev; }); if (!nx.length) break; if (nx.length > 1) { s += "…"; break; }
    prev = cur; cur = nx[0];
  }
  return s;
}
function dbInfo(m){
  if (m._db) return m._db;
  var A = adj(m), h = hc(m), R = ringOf(m), inR = {}, out = [];
  (R || []).forEach(function(x){ inR[x] = 1; });
  m.b.forEach(function(b, k){
    if ((b[2] || 1) !== 2 || m.a[b[0]].el !== "C" || m.a[b[1]].el !== "C") return;
    var d = { k:k, c:[b[0], b[1]], ring:!!(inR[b[0]] && inR[b[1]]), z:b[3] ? 1 : 0 };
    d.g = [0, 1].map(function(s){
      var i = d.c[s], j = d.c[1 - s], g = A[i].filter(function(y){ return y !== j; }).sort(asc).map(function(y){ return { a:y, key:bkey(m, y, i), lbl:glabel(m, y, i) }; });
      for (var t = 0; t < h[i]; t++) g.push({ a:-1, key:"H", lbl:"H" });
      return g;
    });
    d.same = [0, 1].map(function(s){ return d.g[s].length === 2 && d.g[s][0].key === d.g[s][1].key; });
    d.stereo = !d.ring && d.g[0].length === 2 && d.g[1].length === 2 && !d.same[0] && !d.same[1];
    if (!d.ring) {
      d.g[0].forEach(function(g, q){ g.side = q ? -1 : 1; });
      d.g[1].forEach(function(g, q){ g.side = (q ? -1 : 1) * (d.z ? 1 : -1); });
    }
    if (d.stereo) {
      var ct = null;
      d.g[0].forEach(function(p){ d.g[1].forEach(function(q){ if (ct == null && p.key === q.key) ct = p.side === q.side ? "cis" : "trans"; }); });
      d.ct = ct;
      var hi = [0, 1].map(function(s){ var g = d.g[s]; return g[0].key > g[1].key ? g[0] : g[1]; });
      d.desc = [0, 1].map(function(s){ return d.g[s].map(function(g){ return g.key; }).sort().join("/"); }).sort().join("|") + (hi[0].side === hi[1].side ? "Z" : "E");
    }
    out.push(d);
  });
  return (m._db = out);
}
function sdesc(m){ return dbInfo(m).filter(function(d){ return d.stereo; }).map(function(d){ return d.desc; }).sort().join(";"); }
function same(m1, m2){ return fText(m1) === fText(m2) && iso(m1, m2) && sdesc(m1) === sdesc(m2); }

// ---------- names (09's namer + a cis/trans prefix from the matching pair) ----------
function nameInfo(m){
  if (m._ni) return m._ni;
  if (!m.a.length) return (m._ni = { ok:false, name:"" });
  var N = NM.name(m), st = dbInfo(m).filter(function(d){ return d.stereo; }), pre = "", note = "";
  if (!N.ok) return (m._ni = { ok:false, name:"" });
  if (st.length === 1) { if (st[0].ct) pre = st[0].ct + "-"; else note = "nopair"; }
  else if (st.length > 1) note = "several";
  var loc = {}; N.c.path.forEach(function(x, k){ loc[x] = k + 1; });
  return (m._ni = { ok:true, name:pre + N.name, base:N.name, ct:pre ? pre.slice(0, -1) : "", note:note, loc:loc });
}
function nameOf(m){ var n = nameInfo(m); return n.ok ? n.name : ""; }
function family(m){
  var R = NM.roles(m); if (R.P) return R.P;
  if (m.a.some(function(x){ return x.el === "O"; })) return "ether";
  if (m.b.some(function(b){ return b[2] === 3; })) return "alkyne";
  if (dbInfo(m).length) return "alkene";
  return ringOf(m) ? "cyclo" : "alkane";
}
// relationship of m to a reference molecule r
function relation(m, r){
  var f1 = fText(m), f2 = fText(r);
  if (f1 !== f2) return { k:"not", f1:f1, f2:f2 };
  if (iso(m, r)) return sdesc(m) === sdesc(r) ? { k:"same" } : { k:"stereo" };
  return { k:"struct", sub:family(m) !== family(r) ? "functional group" : iso(skel(m), skel(r)) ? "position" : "chain" };
}

// ---------- 2D layout: zigzag tree (120° at each atom, a quaternary carbon as a cross), a ring as a polygon, C=C
// substituents placed by the bond's z flag; explicit H on C=C carbons; H positions on O for the dipole sum ----------
var DEG = Math.PI / 180;
function longestPath(m){
  var A = adj(m), n = m.a.length, best = null, bs = null;
  if (n <= 1) return n ? [0] : [];
  for (var s = 0; s < n; s++) {
    if (A[s].length > 1) continue;
    var par = {}, q = [s]; par[s] = -1;
    while (q.length) { var x = q.shift(); A[x].forEach(function(y){ if (!(y in par)) { par[y] = x; q.push(y); } }); }
    for (var t = 0; t < n; t++) {
      if (t === s || A[t].length > 1 || !(t in par)) continue;
      var p = []; for (var z = t; z !== -1; z = par[z]) p.unshift(z);
      var dbl = 0, nc = 0; for (var k = 0; k < p.length; k++) { if (m.a[p[k]].el === "C") nc++; if (k && order(m, p[k - 1], p[k]) === 2) dbl++; }
      var sc = [p.length, dbl, nc, -p[0], -p[p.length - 1]];
      if (!bs || cmpArr(bs, sc) < 0) { bs = sc; best = p; }
    }
  }
  return best || [0];
}
function linAt(m, i){ var d = 0, t = false; m.b.forEach(function(b){ if (b[0] === i || b[1] === i) { if (b[2] === 3) t = true; if (b[2] === 2) d++; } }); return t || d >= 2; }
function sideOf(o, d, p){ var s = (d[0] - o[0]) * (p[1] - o[1]) - (d[1] - o[1]) * (p[0] - o[0]); return s > 1e-9 ? 1 : s < -1e-9 ? -1 : 0; }
function layout2d(m){
  if (m._L) return m._L;
  if (m.fix) return (m._L = { P:m.fix.P.map(function(p){ return p.slice(); }), H:m.fix.H.map(function(x){ return { par:x.par, x:x.x, y:x.y }; }), expH:m.fix.expH });
  var n = m.a.length, P = new Array(n), A = adj(m), h = hc(m), R = ringOf(m), info = {}, main = {}, db = {}, Hs = [], expH = {}, i;
  dbInfo(m).forEach(function(d){ if (!d.ring) { db[d.c[0] + "," + d.c[1]] = d; db[d.c[1] + "," + d.c[0]] = d; expH[d.c[0]] = expH[d.c[1]] = 1; } });
  function pt(x, a, l){ return [P[x][0] + Math.cos(a) * (l || 1), P[x][1] + Math.sin(a) * (l || 1)]; }
  function place(x, from, inA, t){
    info[x] = { inA:inA, t:t, from:from };
    var ch = A[x].filter(function(y){ return y !== from && P[y] == null; });
    if (!ch.length) return;
    ch.sort(function(a, b){ return ((main[b] ? 1 : 0) - (main[a] ? 1 : 0)) || a - b; });
    var angs = linAt(m, x) ? [inA, inA + 90 * DEG, inA - 90 * DEG] : ch.length === 1 ? [inA + 60 * DEG * t] : ch.length === 2 ? [inA + 60 * DEG * t, inA - 60 * DEG * t] : [inA, inA + 90 * DEG, inA - 90 * DEG];
    var d = from != null ? db[from + "," + x] : null;
    if (d && ch.length <= 2 && !linAt(m, x)) {
      var refF = A[from].filter(function(y){ return y !== x; }).sort(asc)[0];
      if (refF != null && P[refF]) {
        var want = d.z ? sideOf(P[from], P[x], P[refF]) : -sideOf(P[from], P[x], P[refF]), low = ch.slice().sort(asc)[0];
        var a1 = inA + 60 * DEG, a2 = inA - 60 * DEG, s1 = sideOf(P[from], P[x], pt(x, a1));
        angs = ch.map(function(c){ return (c === low) === (s1 === want) ? a1 : a2; });
      }
    }
    ch.forEach(function(c, q){ P[c] = pt(x, angs[q]); });
    ch.forEach(function(c, q){ var tr = Math.round((angs[q] - inA) / (60 * DEG)); place(c, x, angs[q], tr > 0 ? -1 : tr < 0 ? 1 : t); });
  }
  if (R) {
    var k = R.length, rad = 1 / (2 * Math.sin(Math.PI / k)), a0 = -Math.PI / 2 - (k % 2 ? 0 : Math.PI / k);
    R.forEach(function(x, q){ var a = a0 + q * 2 * Math.PI / k; P[x] = [rad * Math.cos(a), rad * Math.sin(a)]; info[x] = { ring:true }; });
    R.forEach(function(x){
      var out = A[x].filter(function(y){ return P[y] == null; }), rho = Math.atan2(P[x][1], P[x][0]), angs = out.length === 1 ? [rho] : [rho - 35 * DEG, rho + 35 * DEG];
      out.forEach(function(c, q){ P[c] = pt(x, angs[q]); });
      out.forEach(function(c, q){ place(c, x, angs[q], 1); });
    });
  } else if (n) {
    var path = longestPath(m); path.forEach(function(x){ main[x] = 1; });
    P[path[0]] = [0, 0]; place(path[0], null, 30 * DEG, -1);
  }
  for (i = 0; i < n; i++) if (!P[i]) P[i] = [0, 0];
  for (i = 0; i < n; i++) {
    if (!h[i]) continue;
    var el = m.a[i].el, us = A[i].map(function(j){ return Math.atan2(P[j][1] - P[i][1], P[j][0] - P[i][0]); }), dirs = [];
    if (expH[i]) {
      if (us.length === 2) { var vx = -(Math.cos(us[0]) + Math.cos(us[1])), vy = -(Math.sin(us[0]) + Math.sin(us[1])); dirs = [Math.atan2(vy, vx)]; }
      else if (us.length === 1) dirs = [us[0] + 120 * DEG, us[0] - 120 * DEG];
    } else if (el === "O" && us.length === 1) {
      var inf = info[i] || {};
      dirs = [inf.from == null || inf.ring ? us[0] + 180 * DEG : inf.inA + 60 * DEG * (inf.t || 1)];
    }
    dirs.slice(0, h[i]).forEach(function(a){ Hs.push({ par:i, x:P[i][0] + Math.cos(a) * 0.78, y:P[i][1] + Math.sin(a) * 0.78 }); });
  }
  return (m._L = { P:P, H:Hs, expH:expH });
}

// ---------- polarity: bond-dipole sum in the drawing's plane (course EN values; C–H counts as nonpolar, ΔEN < 0.5).
// Model term: an alkyl carbon on a C=C carbon pushes a little electron density toward it (0.2), so cis-but-2-ene comes out
// slightly polar and trans-but-2-ene nonpolar. ----------
var EN = D.EN, ALKY = 0.2;
function polarity(m){
  var L = layout2d(m), P = L.P, v = [0, 0], sp2 = {}, bonds = [], polar = false;
  dbInfo(m).forEach(function(d){ if (!d.ring) { sp2[d.c[0]] = 1; sp2[d.c[1]] = 1; } });
  function add(p, q, w, show){ var dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1; v[0] += dx / l * w; v[1] += dy / l * w; if (show) bonds.push({ p:p, q:q, w:w }); }
  m.b.forEach(function(b){
    var e1 = m.a[b[0]].el, e2 = m.a[b[1]].el, d = (EN[e2] || 0) - (EN[e1] || 0);
    if (Math.abs(d) >= 0.5) { polar = true; if (d > 0) add(P[b[0]], P[b[1]], d, true); else add(P[b[1]], P[b[0]], -d, true); }
    else if (e1 === "C" && e2 === "C" && (b[2] || 1) === 1) { if (sp2[b[0]] && !sp2[b[1]]) add(P[b[1]], P[b[0]], ALKY); else if (sp2[b[1]] && !sp2[b[0]]) add(P[b[0]], P[b[1]], ALKY); }
  });
  L.H.forEach(function(x){ var d = (EN[m.a[x.par].el] || 0) - EN.H; if (d >= 0.5) { polar = true; add([x.x, x.y], P[x.par], d, true); } });
  var mag = Math.hypot(v[0], v[1]);
  return { v:v, mag:mag, bonds:bonds, polarBonds:polar, cls:mag < 0.05 ? "nonpolar" : mag < 0.5 ? "slightly" : "polar" };
}

// ---------- 3D model: explicit H, VSEPR directions (from SCH4U 02's scene3), small rings flat, C=C groups placed by z ----------
function v3add(a, b){ return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function v3sub(a, b){ return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function v3mul(a, s){ return [a[0] * s, a[1] * s, a[2] * s]; }
function dot3(a, b){ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function crs3(a, b){ return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function len3(a){ return Math.hypot(a[0], a[1], a[2]); }
function nrm3(a){ var l = len3(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function perp3(u){ var p = crs3(u, [0, 0, 1]); if (len3(p) < 1e-6) p = crs3(u, [0, 1, 0]); return nrm3(p); }
function rot3(v, k, th){ var c = Math.cos(th), s = Math.sin(th); return v3add(v3add(v3mul(v, c), v3mul(crs3(k, v), s)), v3mul(k, dot3(k, v) * (1 - c))); }
var TET = [nrm3([1, 1, 1]), nrm3([1, -1, -1]), nrm3([-1, 1, -1]), nrm3([-1, -1, 1])];
function pair3(u1, u2){ var b = nrm3(v3add(u1, u2)), c = nrm3(crs3(u1, u2)); return [v3add(v3mul(b, -0.5774), v3mul(c, 0.8165)), v3add(v3mul(b, -0.5774), v3mul(c, -0.8165))]; }
function blen(e1, e2, o){
  if (e1 === "H" || e2 === "H") return e1 === "O" || e2 === "O" ? 0.96 : 1.09;
  var k = [e1, e2].sort().join("");
  return k === "CC" ? (o === 3 ? 1.2 : o === 2 ? 1.34 : 1.54) : k === "CO" ? (o === 2 ? 1.23 : 1.43) : k === "CCl" ? 1.77 : 1.5;
}
function scene3(m){
  if (m._S3) return m._S3;
  var n = m.a.length, h = hc(m), at = [], nb = [], R = ringOf(m), i, t;
  for (i = 0; i < n; i++) { at.push({ id:"a" + i, el:m.a[i].el, i:i }); nb.push([]); }
  m.b.forEach(function(b){ nb[b[0]].push([b[1], b[2] || 1]); nb[b[1]].push([b[0], b[2] || 1]); });
  for (i = 0; i < n; i++) for (t = 0; t < h[i]; t++) { var k0 = at.length; at.push({ id:"h" + i + "." + t, el:"H", i:-1, par:i, isH:true }); nb.push([[i, 1]]); nb[i].push([k0, 1]); }
  var N = at.length, P = new Array(N), done = {}, q = [], db = {};
  dbInfo(m).forEach(function(d){ if (!d.ring) { db[d.c[0] + "," + d.c[1]] = d; db[d.c[1] + "," + d.c[0]] = d; } });
  function ord(x, y){ for (var k = 0; k < nb[x].length; k++) if (nb[x][k][0] === y) return nb[x][k][1]; return 0; }
  function geo(x){ if (at[x].el !== "C") return 3; var d = 0, tr = false; nb[x].forEach(function(e){ if (e[1] === 3) tr = true; if (e[1] === 2) d++; }); return tr || d >= 2 ? 1 : d ? 2 : 3; }
  function ref(x, p, u){
    var g = nb[p].map(function(e){ return e[0]; }).filter(function(j){ return j !== x && done[j]; })[0];
    var a = g != null ? nrm3(v3sub(P[p], P[g])) : perp3(u), pa = v3sub(a, v3mul(u, dot3(a, u)));
    return len3(pa) < 1e-6 ? perp3(u) : nrm3(pa);
  }
  function dirs(x){
    var pl = nb[x].map(function(e){ return e[0]; }).filter(function(j){ return done[j]; }), us = pl.map(function(j){ return nrm3(v3sub(P[j], P[x])); }), g = geo(x);
    if (g === 1) return us.length ? [v3mul(us[0], -1)] : [[1, 0, 0], [-1, 0, 0]];
    if (g === 2) {
      if (!us.length) return [[1, 0, 0], [-0.5, 0.866, 0], [-0.5, -0.866, 0]];
      if (us.length === 1) { var pa = ref(x, pl[0], us[0]); return [v3add(v3mul(us[0], -0.5), v3mul(pa, 0.866)), v3add(v3mul(us[0], -0.5), v3mul(pa, -0.866))]; }
      return [nrm3(v3mul(v3add(us[0], us[1]), -1))];
    }
    if (!us.length) return TET;
    if (us.length === 1) { var u = us[0], a2 = ref(x, pl[0], u); a2 = v3add(v3mul(u, -1 / 3), v3mul(a2, 0.9428)); var two = pair3(u, a2); return [a2, two[0], two[1]]; }
    if (us.length === 2) return pair3(us[0], us[1]);
    if (us.length === 3) return [nrm3(v3mul(v3add(v3add(us[0], us[1]), us[2]), -1))];
    return [];
  }
  var onMain = {};
  if (R) {
    var k = R.length, rad = 1.54 / (2 * Math.sin(Math.PI / k));
    R.forEach(function(x, j){ var a = -Math.PI / 2 + j * 2 * Math.PI / k; P[x] = [rad * Math.cos(a), rad * Math.sin(a), 0]; done[x] = 1; q.push(x); });
  } else if (n) {
    var path = longestPath(m); path.forEach(function(x, j){ onMain[x] = j; });
    P[path[0]] = [0, 0, 0]; done[path[0]] = 1; q.push(path[0]);
  }
  while (q.length) {
    var x = q.shift(), ds = dirs(x), fr = nb[x].map(function(e){ return e[0]; }).filter(function(j){ return !done[j]; });
    fr.sort(function(a, b){ return ((at[a].isH ? 1 : 0) - (at[b].isH ? 1 : 0)) || ((onMain[b] != null ? 1 : 0) - (onMain[a] != null ? 1 : 0)) || a - b; });
    // C=C stereo: x's lowest-index heavy neighbour goes to the side of its partner's lowest-index heavy neighbour (z = 1) or across (z = 0)
    var pd = nb[x].map(function(e){ return e[0]; }).filter(function(j){ return done[j] && j < n && db[j + "," + x]; })[0];
    if (pd != null && ds.length === 2 && fr.length === 2) {
      var d = db[pd + "," + x], refP = nb[pd].map(function(e){ return e[0]; }).filter(function(j){ return j !== x && j < n; }).sort(asc)[0], low = fr.filter(function(j){ return j < n; }).sort(asc)[0];
      if (refP != null && low != null) {
        var u3 = nrm3(v3sub(P[x], P[pd])), w = v3sub(P[refP], P[pd]); w = v3sub(w, v3mul(u3, dot3(w, u3)));
        var s0 = dot3(ds[0], w) > 0 ? 1 : -1, want = d.z ? 1 : -1, oth = fr.filter(function(j){ return j !== low; })[0];
        fr = [low, oth]; ds = s0 === want ? [ds[0], ds[1]] : [ds[1], ds[0]];
      }
    }
    fr.forEach(function(j, k2){ P[j] = v3add(P[x], v3mul(ds[k2] || TET[k2 % 4], blen(at[x].el, at[j].el, ord(x, j)))); done[j] = 1; q.push(j); });
  }
  for (i = 0; i < N; i++) if (!P[i]) P[i] = [0, 0, 0];
  // orientation: along the first open-chain C=C (its plane facing the viewer, the 2D drawing's "up" group up), else the longest path
  var c = [0, 0, 0]; P.forEach(function(p){ c = v3add(c, v3mul(p, 1 / N)); });
  var X = [1, 0, 0], Y = null, d0 = dbInfo(m).filter(function(d){ return !d.ring; })[0];
  if (d0) {
    X = nrm3(v3sub(P[d0.c[1]], P[d0.c[0]]));
    var g0 = nb[d0.c[0]].map(function(e){ return e[0]; }).filter(function(j){ return j !== d0.c[1]; }).sort(asc)[0];
    if (g0 != null) {
      var w0 = v3sub(P[g0], P[d0.c[0]]); w0 = v3sub(w0, v3mul(X, dot3(w0, X)));
      if (len3(w0) > 0.1) {
        Y = v3mul(nrm3(w0), -1);
        if (g0 < n) { var L2 = layout2d(m); if (sideOf(L2.P[d0.c[0]], L2.P[d0.c[1]], L2.P[g0]) > 0) Y = v3mul(Y, -1); }
        else { var L3 = layout2d(m), hh = L3.H.filter(function(o){ return o.par === d0.c[0]; })[0]; if (hh && sideOf(L3.P[d0.c[0]], L3.P[d0.c[1]], [hh.x, hh.y]) > 0) Y = v3mul(Y, -1); }
      }
    }
  } else if (!R && n > 1) {
    var lp = longestPath(m); X = nrm3(v3sub(P[lp[lp.length - 1]], P[lp[0]]));
  }
  if (!Y) {
    var refs = P.slice(0, n).concat(P.slice(n));
    for (i = 0; i < refs.length && !Y; i++) { var w2 = v3sub(refs[i], c); w2 = v3sub(w2, v3mul(X, dot3(w2, X))); if (len3(w2) > 0.3) Y = v3mul(nrm3(w2), -1); }
    if (!Y) Y = perp3(X);
  }
  var Z = crs3(X, Y);
  var atoms = at.map(function(a, j){ var dd = v3sub(P[j], c), o = Object.assign({}, a); o.x = dot3(dd, X); o.y = dot3(dd, Y); o.z = dot3(dd, Z); return o; });
  var bonds = [];
  m.b.forEach(function(b){ bonds.push({ a:b[0], b:b[1], o:b[2] || 1 }); });
  atoms.forEach(function(a, j){ if (a.isH) bonds.push({ a:a.par, b:j, o:1 }); });
  return (m._S3 = { atoms:atoms, bonds:bonds });
}
// torsion: turn the side of bond (i, j) that holds j about the i→j axis by deg (null when a ring holds the bond)
function twist(sc, i, j, deg){
  var L = sc.atoms.map(function(){ return []; }); sc.bonds.forEach(function(e){ L[e.a].push(e.b); L[e.b].push(e.a); });
  var side = {}, st = [j]; side[j] = 1;
  while (st.length) { var x = st.pop(); L[x].forEach(function(y){ if (!side[y] && !(x === j && y === i)) { side[y] = 1; st.push(y); } }); }
  if (side[i]) return null;
  if (!deg) return sc;
  var P0 = [sc.atoms[i].x, sc.atoms[i].y, sc.atoms[i].z], k = nrm3(v3sub([sc.atoms[j].x, sc.atoms[j].y, sc.atoms[j].z], P0)), th = deg * DEG;
  return { bonds:sc.bonds, atoms:sc.atoms.map(function(at, q){
    if (!side[q]) return at;
    var r = rot3(v3sub([at.x, at.y, at.z], P0), k, th), o = Object.assign({}, at);
    o.x = P0[0] + r[0]; o.y = P0[1] + r[1]; o.z = P0[2] + r[2]; return o;
  }) };
}
function proj(p, rot){
  var cy = Math.cos(rot.y), sy = Math.sin(rot.y), cx = Math.cos(rot.x), sx = Math.sin(rot.x);
  var x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy, y = p[1];
  return [x, y * cx - z * sx, y * sx + z * cx];
}

// ---------- cis–trans mode molecule: a fixed C=C with four places (top left, bottom left, top right, bottom right) ----------
var CTD = [-120, 120, -60, 60];
function ctMol(ct){
  var a = [{ el:"C" }, { el:"C" }], b = [[0, 1, 2, 0]], P = [[-0.65, 0], [0.65, 0]], H = [], first = [null, null], up = [false, false];
  ct.forEach(function(g, s){
    var c = s < 2 ? 0 : 1, ang = CTD[s] * DEG, base = P[c], p1 = [base[0] + Math.cos(ang), base[1] + Math.sin(ang)];
    if (g === "H") { H.push({ par:c, slot:s, x:base[0] + Math.cos(ang) * 0.78, y:base[1] + Math.sin(ang) * 0.78 }); return; }
    var k = a.length; a.push({ el:g === "Cl" ? "Cl" : "C", slot:s }); P.push(p1); b.push([c, k, 1, 0]);
    if (first[c] == null) { first[c] = k; up[c] = s % 2 === 0; }
    if (g === "C2H5") { a.push({ el:"C", slot:s }); P.push([p1[0] + (c ? 1 : -1), p1[1]]); b.push([k, k + 1, 1, 0]); }
  });
  if (first[0] != null && first[1] != null) b[0][3] = up[0] === up[1] ? 1 : 0;
  var m = { a:a, b:b, main:[] }; m.fix = { P:P, H:H, expH:{ 0:1, 1:1 } };
  return m;
}

// ---------- SVG text helpers (from SCH4U 07) ----------
function tw(t, fs){
  var w = 0, prev = "";
  String(t).replace(/\d+|[\s\S]/g, function(s){
    if (/^\d/.test(s)) w += s.length * (/[A-Za-z)]$/.test(prev) ? 0.42 : 0.56) * fs;
    else w += (/[A-Z]/.test(s) ? 0.64 : /[a-z]/.test(s) ? 0.5 : /[()]/.test(s) ? 0.34 : s === " " ? 0.28 : 0.56) * fs;
    prev = s; return s;
  });
  return w;
}
function tsp(t, fs){
  var out = "", base = 0, d = fs * 0.3, prev = "";
  String(t).replace(/\d+|[^\d]+/g, function(s){
    var sub = /^\d/.test(s) && /[A-Za-z)]$/.test(prev), dy = sub ? d - base : -base;
    base = sub ? d : 0;
    out += "<tspan" + (Math.abs(dy) > 0.01 ? ' dy="' + r1(dy) + '"' : "") + (sub ? ' font-size="' + r1(fs * 0.72) + '"' : "") + ">" + esc(s) + "</tspan>";
    prev = s; return s;
  });
  return out;
}
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function T(x, y, s, o){ o = o || {}; var fs = o.fs || 15; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + r1(fs) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" paint-order="stroke"' : "") + opA(o.op) + ">" + (o.raw ? s : tsp(s, fs)) + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + r1(o.w || 2.4) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function inkOf(el){ return el === "C" || el === "H" ? "var(--ink)" : "var(" + MV.chem.colorVar(el) + ")"; }
// dipole arrow (crossed tail at δ+, head at δ−)
function dArrow(x1, y1, x2, y2, o){
  o = o || {};
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hs = o.hs || 9, w = o.w || 2.2, c = o.c || "var(--ink)", cx = x1 + ux * Math.min(10, L * 0.2), cy = y1 + uy * Math.min(10, L * 0.2), k = o.k || 6;
  return '<g' + opA(o.op) + ">" + Ln(x1, y1, x2 - ux * hs * 0.6, y2 - uy * hs * 0.6, { c:c, w:w }) + Ln(cx - uy * k, cy + ux * k, cx + uy * k, cy - ux * k, { c:c, w:w }) +
    '<path d="M' + r1(x2) + " " + r1(y2) + " L" + r1(x2 - ux * hs - uy * hs * 0.55) + " " + r1(y2 - uy * hs + ux * hs * 0.55) + " L" + r1(x2 - ux * hs + uy * hs * 0.55) + " " + r1(y2 - uy * hs - ux * hs * 0.55) + 'Z" fill="' + c + '"/></g>';
}

// ---------- C1 2D drawing: condensed labels (CH₃, CH₂, OH), explicit H on C=C carbons, selection, dipole arrows ----------
function lbl2(m, i, L){ var el = m.a[i].el, h = hc(m)[i]; return L.expH[i] ? el : el + (h ? "H" + (h > 1 ? h : "") : ""); }
function fit2(m, W, H, o){
  var L = layout2d(m), fx = o.flip ? -1 : 1, xs = [], ys = [];
  L.P.forEach(function(p){ xs.push(fx * p[0]); ys.push(p[1]); });
  L.H.forEach(function(x){ if (L.expH[x.par]) { xs.push(fx * x.x); ys.push(x.y); } });
  var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), pad = o.pad == null ? 16 : o.pad;
  var nar = W < 420, Wa = W - (o.dip && !nar ? 104 : 0), Ha = H - (o.dip && nar ? 112 : 0), s = Math.min((Wa - 2 * pad) / (x1 - x0 + 1.5), (Ha - 2 * pad) / (y1 - y0 + 1.3), o.smax || 64);
  return { s:s, fx:fx, ox:Wa / 2 - (x0 + x1) / 2 * s, oy:Ha / 2 - (y0 + y1) / 2 * s, W:W, H:H, nar:nar };
}
function svg2d(m, fit, o){
  o = o || {};
  var L = layout2d(m), s = fit.s, fs = clamp(s * 0.4, 11, 21), out = "", n = m.a.length, sw = o.swap;
  function sy(y, slot){ if (!sw || slot == null || (slot < 2 ? 0 : 1) !== sw.c) return y; return y * Math.cos(Math.PI * sw.t); }
  var pts = L.P.map(function(p, i){ return [fit.ox + fit.fx * p[0] * s, fit.oy + sy(p[1], m.a[i].slot) * s]; });
  var hs = L.H.filter(function(x){ return L.expH[x.par]; }).map(function(x){ return { par:x.par, p:[fit.ox + fit.fx * x.x * s, fit.oy + sy(x.y, x.slot) * s] }; });
  var lab = m.a.map(function(_, i){ return lbl2(m, i, L); }), ext = lab.map(function(t){ return [tw(t, fs) / 2 + 3, fs * 0.55]; }), hext = [fs * 0.36, fs * 0.55];
  var bw = r1(clamp(s * 0.035, 1.6, 2.4));
  function seg(p, q, ea, eb, off){
    var dx = q[0] - p[0], dy = q[1] - p[1], Lh = Math.hypot(dx, dy) || 1, ux = dx / Lh, uy = dy / Lh;
    var ta = Math.min(ux ? ea[0] / Math.abs(ux) : 1e9, uy ? ea[1] / Math.abs(uy) : 1e9), tb = Math.min(ux ? eb[0] / Math.abs(ux) : 1e9, uy ? eb[1] / Math.abs(uy) : 1e9);
    if (ta + tb >= Lh - 2) return null;
    return [p[0] + ux * ta - uy * off, p[1] + uy * ta + ux * off, q[0] - ux * tb - uy * off, q[1] - uy * tb + ux * off];
  }
  if (o.selB) { var p0 = pts[o.selB[0]], q0 = pts[o.selB[1]]; out += Ln(p0[0], p0[1], q0[0], q0[1], { c:"var(--hi)", w:fs * 1.25, op:0.85 }); }
  if (o.selA != null && pts[o.selA]) out += '<circle cx="' + r1(pts[o.selA][0]) + '" cy="' + r1(pts[o.selA][1]) + '" r="' + r1(Math.max(fs * 0.95, ext[o.selA][0] + 3)) + '" fill="var(--hi)" fill-opacity=".85"/>';
  if (o.hiC != null) o.hiC.forEach(function(i){ out += '<circle cx="' + r1(pts[i][0]) + '" cy="' + r1(pts[i][1]) + '" r="' + r1(fs * 1.05) + '" fill="var(--hi-soft)"/>'; });
  m.b.forEach(function(b){
    var ord = b[2] || 1, offs = ord === 2 ? [-3.4, 3.4] : ord === 3 ? [-5, 0, 5] : [0];
    offs.forEach(function(d){ var g = seg(pts[b[0]], pts[b[1]], ext[b[0]], ext[b[1]], d); if (g) out += Ln(g[0], g[1], g[2], g[3], { w:bw }); });
  });
  hs.forEach(function(x){ var g = seg(pts[x.par], x.p, ext[x.par], hext, 0); if (g) out += Ln(g[0], g[1], g[2], g[3], { w:bw }); });
  lab.forEach(function(t, i){ out += T(pts[i][0], pts[i][1], t, { fs:fs, w:m.a[i].el === "C" ? 400 : 700, c:o.selA === i ? "var(--hi-ink)" : inkOf(m.a[i].el) }); });
  hs.forEach(function(x){ out += T(x.p[0], x.p[1], "H", { fs:fs * 0.92 }); });
  // dipoles: bond dipoles beside polar bonds, then the net arrow from the molecule's centre
  if (o.dip && (o.dip.b > 0 || o.dip.n > 0)) {
    var pol = polarity(m), cx = 0, cy = 0;
    pts.forEach(function(p){ cx += p[0] / n; cy += p[1] / n; });
    var nb = o.dip.b || 0;
    if (nb > 0) pol.bonds.forEach(function(bd){
      var p = [fit.ox + fit.fx * bd.p[0] * s, fit.oy + bd.p[1] * s], q = [fit.ox + fit.fx * bd.q[0] * s, fit.oy + bd.q[1] * s], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
      var nx = -uy, ny = ux; if (nx * ((p[0] + q[0]) / 2 - cx) + ny * ((p[1] + q[1]) / 2 - cy) < 0) { nx = -nx; ny = -ny; }
      var off = fs * 0.85, a = [p[0] + ux * l * 0.2 + nx * off, p[1] + uy * l * 0.2 + ny * off], z = [p[0] + ux * l * (0.2 + 0.6 * nb) + nx * off, p[1] + uy * l * (0.2 + 0.6 * nb) + ny * off];
      out += dArrow(a[0], a[1], z[0], z[1], { w:1.8, hs:7, k:4.5, op:Math.min(1, nb * 1.5) });
      if (nb >= 1) { out += T(a[0] + nx * fs * 0.62 - ux * 4, a[1] + ny * fs * 0.62 - uy * 4, "δ+", { fs:fs * 0.66, w:700, c:"var(--dl-pos)", raw:true, halo:true }) + T(z[0] + nx * fs * 0.62 + ux * 2, z[1] + ny * fs * 0.62 + uy * 2, "δ−", { fs:fs * 0.66, w:700, c:"var(--dl-neg)", raw:true, halo:true }); }
    });
    var nn = o.dip.n || 0;
    if (nn > 0) {
      var bx = fit.nar ? fit.W / 2 : fit.W - 54, by = fit.H - 62;
      out += '<rect x="' + r1(bx - 46) + '" y="' + r1(by - 46) + '" width="92" height="106" rx="8" fill="var(--paper)" stroke="var(--rule)" stroke-width="1.5"' + opA(nn) + "/>" + T(bx, fit.H - 16, "net dipole", { fs:12, w:700, raw:true, op:nn });
      if (pol.cls !== "nonpolar") {
        var vx = fit.fx * pol.v[0], vy = pol.v[1], vl = Math.hypot(vx, vy) || 1, len = (pol.cls === "polar" ? 72 : 44) * nn;
        out += dArrow(bx - vx / vl * len / 2, by - vy / vl * len / 2, bx + vx / vl * len / 2, by + vy / vl * len / 2, { w:pol.cls === "polar" ? 3.4 : 2.4, hs:pol.cls === "polar" ? 12 : 9, k:7 });
      } else out += T(bx, by - 8, "0", { fs:20, w:700, raw:true, op:nn }) + T(bx, by + 16, pol.polarBonds ? "dipoles cancel" : "none", { fs:11, raw:true, c:"var(--ink-2)", op:nn });
    }
  }
  return out;
}

// 2D view widget with tap-to-select atom and bond buttons over the drawing (Tab, arrow keys, Enter)
var UID = 0;
function view2d(host, opts){
  opts = opts || {};
  var uid = ++UID, W = opts.w || 520, H = opts.h || 300, asp = H / W;
  host.innerHTML = '<div class="si-vw"><svg class="si-svg" viewBox="0 0 ' + W + " " + H + '" role="img"></svg><div class="si-ov"></div></div>';
  var svg = $(".si-svg", host), ov = $(".si-ov", host), st = { m:null, o:{} };
  function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 400 ? Math.max(asp, opts.phone || 0.7) : asp)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0) render(); }).observe(svg);
  function render(){
    if (!st.m) return; size();
    var m = st.m, o = st.o, fit = fit2(m, W, H, o);
    svg.innerHTML = m.a.length ? svg2d(m, fit, o) : "";
    svg.setAttribute("aria-label", o.aria || "Molecule drawing");
    if (!o.picks) { if (ov.innerHTML) ov.innerHTML = ""; return; }
    var L = layout2d(m), list = [];
    function sp(p){ return [fit.ox + fit.fx * p[0] * fit.s, fit.oy + p[1] * fit.s]; }
    m.a.forEach(function(_, i){ var p = sp(L.P[i]); list.push({ k:"a", i:i, x:p[0], y:p[1], on:o.selA === i }); });
    m.b.forEach(function(b, i){ var p = sp(L.P[b[0]]), q = sp(L.P[b[1]]); list.push({ k:"b", i:i, x:(p[0] + q[0]) / 2, y:(p[1] + q[1]) / 2, on:!!(o.selB && o.selB[0] === b[0] && o.selB[1] === b[1]) }); });
    var html = list.map(function(x){ return '<button type="button" class="si-pk' + (x.k === "b" ? " bd" : "") + '" style="left:' + r1(x.x / W * 100) + "%;top:" + r1(x.y / H * 100) + '%" data-k="pk' + uid + x.k + x.i + '" data-pk="' + x.k + '" data-pi="' + x.i + '" aria-pressed="' + x.on + '" aria-label="' + esc(opts.label ? opts.label(x.k, x.i) : "Select") + '"></button>'; }).join("");
    MV.keepFocus(ov, function(){ ov.innerHTML = html; });
  }
  ov.addEventListener("click", function(e){ var b = e.target.closest("button"); if (b && opts.onPick) opts.onPick(b.dataset.pk, +b.dataset.pi); });
  ov.addEventListener("keydown", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$("button", ov), i = all.indexOf(b); all[(i + d + all.length) % all.length].focus();
  });
  return { show:function(m, o){ st.m = m; st.o = o || {}; render(); }, render:render };
}

// ---------- C1 3D ball-and-stick (from SCH4U 02's svg3d): depth-sorted balls and sticks, a "surface" glow, the π band ----------
var RAD = { C:0.36, H:0.24, O:0.36, Cl:0.45 };
function radius3(sc){ var R = 0.5; sc.atoms.forEach(function(a){ R = Math.max(R, Math.hypot(a.x, a.y, a.z || 0) + (RAD[a.el] || 0.3)); }); return R; }
function fit3(sc, W, H, o){
  o = o || {};
  var R = Math.max(o.R || 0, radius3(sc)) + (o.glow ? 0.55 : 0);
  return { s:Math.min(Math.min(W, H) * 0.47 / R, 92), ox:W / 2, oy:H / 2 };
}
var PRESET = { iso:{ x:-0.5, y:0.62 }, front:{ x:0, y:0 }, top:{ x:-1.45, y:0 } };
function svg3d(sc, rot, fit, o, uid){
  o = o || {};
  var s = fit.s, pr = sc.atoms.map(function(a){ return proj([a.x, a.y, a.z || 0], rot); }), Rm = 0.1, items = [], out = "", g = "si3g" + uid;
  function X(p){ return fit.ox + p[0] * s; } function Y(p){ return fit.oy + p[1] * s; }
  pr.forEach(function(p){ Rm = Math.max(Rm, Math.abs(p[2])); });
  out += '<defs><radialGradient id="' + g + '" cx=".3" cy=".27" r=".42"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
  if (o.glow > 0) sc.atoms.forEach(function(a, k){ out += '<circle cx="' + r1(X(pr[k])) + '" cy="' + r1(Y(pr[k])) + '" r="' + r1((a.el === "H" ? 1.1 : 1.55) * s * 0.72 * o.glow) + '" fill="var(--hi-soft)"/>'; });
  sc.bonds.forEach(function(b){ items.push({ z:(pr[b.a][2] + pr[b.b][2]) / 2 - 0.05, b:b }); });
  sc.atoms.forEach(function(a, k){ items.push({ z:pr[k][2], k:k }); });
  items.sort(function(p, q){ return p.z - q.z; });
  items.forEach(function(it){
    if (it.b) {
      var A = sc.atoms[it.b.a], B = sc.atoms[it.b.b], on = o.selB && ((it.b.a === o.selB[0] && it.b.b === o.selB[1]) || (it.b.a === o.selB[1] && it.b.b === o.selB[0]));
      var pa = pr[it.b.a], pb = pr[it.b.b], dx = (pb[0] - pa[0]) * s, dy = (pb[1] - pa[1]) * s, L = Math.hypot(dx, dy) || 1, ra = (RAD[A.el] || 0.3) * s * 0.8, rb = (RAD[B.el] || 0.3) * s * 0.8;
      if (L <= ra + rb) return;
      var ox = -dy / L, oy = dx / L, n = it.b.o, sp = s * (n === 3 ? 0.11 : 0.085), wd = s * (n > 1 ? 0.07 : 0.12) * (on ? 1.6 : 1);
      for (var q = 0; q < n; q++) {
        var d = (q - (n - 1) / 2) * sp * 2;
        out += Ln(X(pa) + dx / L * ra + ox * d, Y(pa) + dy / L * ra + oy * d, X(pb) - dx / L * rb + ox * d, Y(pb) - dy / L * rb + oy * d, { c:on ? "var(--pen)" : "var(--ink-2)", w:wd });
      }
      return;
    }
    var a = sc.atoms[it.k], p = pr[it.k], r = (RAD[a.el] || 0.3) * s * (1 + 0.07 * p[2] / Rm), col = MV.chem.atom(a.el), x = r1(X(p)), y = r1(Y(p));
    out += '<circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="' + col.fill + '"' + (a.el === "H" ? ' stroke="' + col.line + '" stroke-width="1.5"' : "") + '/><circle cx="' + x + '" cy="' + y + '" r="' + r1(r) + '" fill="url(#' + g + ')"/>';
    if (r > 6) out += '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + r1(r * (a.el.length > 1 ? 0.82 : 1.05)) + '" font-weight="700" fill="' + col.ink + '">' + a.el + "</text>";
  });
  if (o.pi) out += piBand(sc, pr, fit, o.pi, rot);
  return out;
}
// π bond on C=C (i, j): p-orbital lobes on both carbons and the overlap band between them. deg = twist of j's end;
// overlap |cos θ| sets the band's width, the energy sin² θ turns it from --ink-2 to orange.
function piBand(sc, pr, fit, pi, rot){
  var A = sc.atoms[pi.i], B = sc.atoms[pi.j], nb = sc.bonds.filter(function(b){ return (b.a === pi.i || b.b === pi.i) && !(b.a === pi.j || b.b === pi.j); }).map(function(b){ return b.a === pi.i ? b.b : b.a; });
  if (nb.length < 2) return "";
  var Pa = [A.x, A.y, A.z], ax = nrm3(v3sub([B.x, B.y, B.z], Pa)), base = pi.n0 || nrm3(crs3(v3sub([sc.atoms[nb[0]].x, sc.atoms[nb[0]].y, sc.atoms[nb[0]].z], Pa), v3sub([sc.atoms[nb[1]].x, sc.atoms[nb[1]].y, sc.atoms[nb[1]].z], Pa)));
  var th = (pi.deg || 0) * DEG, nB = rot3(base, ax, th), ov = Math.abs(Math.cos(th)), en = Math.pow(Math.sin(th), 2), s = fit.s, out = "", R = 0.5;
  function P2(p){ var q = proj(p, rot); return [fit.ox + q[0] * s, fit.oy + q[1] * s]; }
  [[Pa, base], [[B.x, B.y, B.z], nB]].forEach(function(c){
    [1, -1].forEach(function(sg){ var q = P2(v3add(c[0], v3mul(c[1], R * sg))); out += '<ellipse cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" rx="' + r1(s * 0.2) + '" ry="' + r1(s * 0.2) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6" stroke-dasharray="3 2"/>'; });
  });
  [1, -1].forEach(function(sg){
    var p = P2(v3add(Pa, v3mul(base, R * sg))), q = P2(v3add([B.x, B.y, B.z], v3mul(nB, R * sg))), w = 3 + 9 * ov;
    out += Ln(p[0], p[1], q[0], q[1], { c:"var(--ink-2)", w:w, op:0.75 * (1 - en) + 0.05 }) + (en > 0.01 ? Ln(p[0], p[1], q[0], q[1], { c:"var(--en-dh)", w:w, op:0.9 * en }) : "");
  });
  var mid = P2(v3add(v3add(Pa, v3mul(ax, 0.67)), v3mul(base, R + 0.45)));
  out += T(mid[0], mid[1], "π bond", { fs:clamp(s * 0.24, 11, 15), w:700, c:en > 0.5 ? "var(--en-dh)" : "var(--ink-2)", raw:true, halo:true });
  return out;
}
// 3D view widget: drag or arrow keys to turn; Isometric, Front and Top presets
function view3d(host, opts){
  opts = opts || {};
  var uid = ++UID, W = opts.w || 420, H = opts.h || 300, asp = H / W;
  host.innerHTML = '<div class="si-vw si-v3w"><svg class="si-svg si-3d" tabindex="0" viewBox="0 0 ' + W + " " + H + '" role="img"></svg></div>' +
    (opts.presets === false ? "" : '<div class="si-pre" role="group" aria-label="3D view"><button type="button" class="btn ghost sm" data-pre="iso" data-k="pre' + uid + 'iso">Isometric</button><button type="button" class="btn ghost sm" data-pre="front" data-k="pre' + uid + 'front">Front</button><button type="button" class="btn ghost sm" data-pre="top" data-k="pre' + uid + 'top">Top</button></div>');
  var svg = $(".si-svg", host), st = { sc:null, o:{}, rot:Object.assign({}, PRESET[opts.start || "iso"]) };
  function size(){ var cw = Math.round(svg.getBoundingClientRect().width); if (cw > 60 && cw !== W) { W = cw; H = Math.round(cw * (cw < 400 ? Math.max(asp, 0.72) : asp)); svg.setAttribute("viewBox", "0 0 " + W + " " + H); } }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w0 = W; size(); if (W !== w0) render(); }).observe(svg);
  function render(){
    if (!st.sc) { svg.innerHTML = ""; return; } size();
    var o = st.o, fit = fit3(o.fitScene || st.sc, W, H, o);
    svg.innerHTML = svg3d(st.sc, st.rot, fit, o, uid);
    svg.setAttribute("aria-label", (o.aria || "3D model") + " Drag it or use the arrow keys to turn it.");
  }
  var drag = null;
  svg.addEventListener("pointerdown", function(e){ drag = { x:e.clientX, y:e.clientY }; try { svg.setPointerCapture(e.pointerId); } catch (er) {} });
  svg.addEventListener("pointermove", function(e){ if (!drag) return; st.rot.y += (e.clientX - drag.x) * 0.012; st.rot.x = clamp(st.rot.x - (e.clientY - drag.y) * 0.012, -1.55, 1.55); drag = { x:e.clientX, y:e.clientY }; render(); });
  svg.addEventListener("pointerup", function(){ drag = null; }); svg.addEventListener("pointercancel", function(){ drag = null; });
  svg.addEventListener("keydown", function(e){
    var k = e.key, d = 15 * DEG;
    if (k === "ArrowLeft") st.rot.y -= d; else if (k === "ArrowRight") st.rot.y += d; else if (k === "ArrowUp") st.rot.x = clamp(st.rot.x - d, -1.55, 1.55); else if (k === "ArrowDown") st.rot.x = clamp(st.rot.x + d, -1.55, 1.55); else return;
    e.preventDefault(); render();
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pre]"); if (!b) return; setRot(b.dataset.pre); });
  function setRot(id){ st.rot.x = PRESET[id].x; st.rot.y = PRESET[id].y; render(); }
  return { show:function(sc, o){ st.sc = sc; st.o = o || {}; render(); }, render:render, setRot:setRot, rot:st.rot };
}

// ---------- Explore: Isomer explorer (C1 builder + 3D view, cis–trans places, compare) ----------
// Targets: the plan's five formulas plus C₄H₈ for challenge 3. Each starts from its straight chain.
var TGT = [{ id:"C4H10", smi:"CCCC" }, { id:"C5H12", smi:"CCCCC" }, { id:"C2H6O", smi:"CCO" }, { id:"C3H8O", smi:"CCCO" }, { id:"C3H6O", smi:"CCC=O" }, { id:"C4H8", smi:"C=CCC" }];
var SLOTS = ["H", "CH3", "C2H5", "Cl"], SLOTN = ["Top left", "Bottom left", "Top right", "Bottom right"], MAXA = 6;
var WANT6 = ["but-1-ene", "cis-but-2-ene", "trans-but-2-ene", "2-methylpropene", "cyclobutane", "methylcyclopropane"];
var MC = {}, MCN = 0;
function itemMol(it){ var k = JSON.stringify(it); if (!MC[k]) { if (++MCN > 400) { MC = {}; MCN = 1; } MC[k] = it.ct ? ctMol(it.ct) : molOf(it.sp); } return MC[k]; }
function connected(sp){
  var n = sp.a.length, L = sp.a.map(function(){ return []; }), seen = {}, st = [0], c = 0;
  if (!n) return false;
  sp.b.forEach(function(b){ L[b[0]].push(b[1]); L[b[1]].push(b[0]); });
  while (st.length) { var x = st.pop(); if (seen[x]) continue; seen[x] = 1; c++; L[x].forEach(function(y){ if (!seen[y]) st.push(y); }); }
  return c === n;
}
function validSpec(sp){
  if (!sp || !Array.isArray(sp.a) || !Array.isArray(sp.b) || !sp.a.length || sp.a.length > MAXA) return false;
  if (!sp.a.every(function(e){ return e === "C" || e === "O"; })) return false;
  var n = sp.a.length, seen = {};
  if (!sp.b.every(function(b){ if (!Array.isArray(b) || !(b[0] >= 0 && b[0] < n && b[1] >= 0 && b[1] < n && b[0] !== b[1]) || [1, 2].indexOf(b[2]) < 0) return false; var k = Math.min(b[0], b[1]) + "," + Math.max(b[0], b[1]); if (seen[k]) return false; seen[k] = 1; return true; })) return false;
  var m = molOf(sp); for (var i = 0; i < n; i++) if (free(m, i) < 0) return false;
  return connected(sp) && sp.b.length <= n;
}
function validCt(ct){ return Array.isArray(ct) && ct.length === 4 && ct.every(function(g){ return SLOTS.indexOf(g) >= 0; }); }
function validItem(it){ return !!it && (it.ct ? validCt(it.ct) : validSpec(it.sp)); }
function bpOf(n){ if (!(n in MPX)) return null; var t = MV.chem.bpOf(n); return t != null ? t : BPX[n]; }
function degTxt(v){ return "≈ " + MV.chem.fx(v, 0) + " °C"; }
function relText(r, ref){
  if (r.k === "not") return "Not isomers: " + F(r.f1) + " vs " + F(r.f2);
  if (r.k === "same") return "Same compound" + (ref ? ": " + ref : "");
  if (r.k === "stereo") return "Stereoisomer (cis–trans) of " + (ref || "the saved molecule");
  return "Structural isomer (" + r.sub + ") of " + (ref || "the saved molecule");
}
function nameHTML(m){
  var N = nameInfo(m);
  if (!N.ok) return muted("not named in this module");
  return "<strong>" + N.name + "</strong>" + (N.note === "nopair" ? " " + muted("(no matching pair of groups, so cis and trans can’t name it here)") : "");
}
function grpTxt(g){ return F(g[0].lbl) + " and " + F(g[1].lbl); }
function twoTxt(g){ return g[0].lbl === "H" ? "two H atoms" : "two " + F(g[0].lbl) + " groups"; }
function ctTxt(m){
  var all = dbInfo(m), ds = all.filter(function(d){ return !d.ring; }), N = nameInfo(m);
  if (!ds.length) return "No: there is no C=C" + (all.length ? " outside the ring" : "") + ".";
  var d = ds[0], ends = [0, 1];
  function cl(s){ var i = d.c[s]; return N.ok && N.loc[i] ? "C" + N.loc[i] : s ? "the right carbon" : "the left carbon"; }
  if (N.ok && N.loc[d.c[1]] < N.loc[d.c[0]]) ends = [1, 0];
  if (d.stereo) return "Yes: " + ends.map(function(s){ return cl(s) + " has " + grpTxt(d.g[s]); }).join("; ");
  var s = ends.filter(function(e){ return d.same[e] || d.g[e].length < 2; })[0];
  if (s == null) s = ends[0];
  return "No: " + cl(s) + " has " + (d.g[s].length < 2 ? "only one other group" : twoTxt(d.g[s])) + ".";
}
function polTxt(p){
  if (p.cls === "polar") return "<strong>Polar</strong>: the bond dipoles add up";
  if (p.cls === "slightly") return "<strong>Slightly polar</strong>: small dipoles at the C=C don’t cancel";
  return "<strong>Nonpolar</strong>: " + (p.polarBonds ? "the bond dipoles cancel" : "only C–C and C–H bonds");
}
function ebar(e){ var pc = Math.round(e * 100); return '<span class="si-ebar" role="img" aria-label="Energy for this twist: about ' + Math.round(e * PI_BARRIER) + ' kJ/mol"><i style="width:' + pc + '%"></i></span>'; }

function explore(host, api){
  var S = api.S, C = api.content, RU = C.rules;
  if (["struct", "ct", "cmp"].indexOf(S.mode) < 0) S.mode = "struct";
  if (S.tgt !== "" && !TGT.some(function(t){ return t.id === S.tgt; })) S.tgt = "C5H12";
  if (!validSpec(S.spec)) S.spec = mk((tgtOf(S.tgt) || TGT[1]).smi);
  if (!validCt(S.ct)) S.ct = ["CH3", "H", "CH3", "H"];
  S.flip = !!S.flip;
  S.saved = (Array.isArray(S.saved) ? S.saved : []).filter(validItem).slice(-2);
  S.list = (Array.isArray(S.list) ? S.list : []).filter(validItem).slice(0, 12);
  var sel = null, rot = { k:-1, deg:0 }, piDeg = 0, blockedK = -1, ringK = -1, anim = null, busy = false, msg = "", lmsg = null, hide = {}, glow = 0, dipC = { b:1, n:1 }, swap = null;

  host.innerHTML = '<p class="how si-how">' + C.how + '</p><div class="si-modes"></div>' +
    '<div class="si-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="si-one"><div class="si-pan"><p class="si-ph">Drawing</p><div class="si-v2"></div></div><div class="si-pan"><p class="si-ph">3D model</p><div class="si-v3"></div></div></div>' +
      '<div class="si-two" hidden>' + [0, 1].map(function(c){ return '<div class="si-col" data-col="' + c + '"><p class="si-ph"></p><div class="si-c2"></div><div class="si-c3"></div><dl class="read si-cread"></dl></div>'; }).join("") + "</div></div>" +
    '<div class="si-grid"><div class="si-ctrl"><div class="si-st"><div class="si-tgt"></div><p class="si-sel" aria-live="polite"></p><div class="si-tools" role="group" aria-label="Builder buttons"></div></div>' +
      '<div class="si-ctm"><div class="si-slots"></div><div class="si-tools si-ctb" role="group" aria-label="Cis–trans buttons"></div></div>' +
      '<div class="si-cmpc"><p>' + C.cmpNote + '</p><div class="q-actions"><button type="button" class="btn ghost sm" data-act="cswap" data-k="sicswap">Swap sides</button></div></div>' +
      '<div class="si-com q-actions"></div><p class="si-msg" aria-live="polite"></p><div class="si-list"></div></div>' +
    '<div class="si-right"><dl class="read si-read" aria-live="polite"></dl><p class="tiny muted si-dnote">' + C.dataNote + "</p></div></div>";

  var V2 = view2d($(".si-v2", host), { w:520, h:300, phone:1, onPick:pick, label:pickLabel });
  var V3 = view3d($(".si-v3", host), { w:420, h:300 });
  var CV2 = [0, 1].map(function(c){ return view2d($('[data-col="' + c + '"] .si-c2', host), { w:440, h:220, phone:0.95 }); });
  var CV3 = [0, 1].map(function(c){ return view3d($('[data-col="' + c + '"] .si-c3', host), { w:440, h:250, presets:false }); });
  var modeRG = radios($(".si-modes", host), { label:"Mode", aria:"Explorer mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var tgtRG = radios($(".si-tgt", host), { label:"Target formula", aria:"Target formula", cls:"chips", options:TGT.map(function(t){ return { id:t.id, t:F(t.id) }; }), value:S.tgt,
    onChange:function(v){ S.tgt = v; startTgt(); } });
  var slotBox = $(".si-slots", host), slotRG = SLOTN.map(function(nm, s){
    var d = document.createElement("div"); d.className = "si-slot"; slotBox.appendChild(d);
    return radios(d, { label:nm, aria:nm + " group", cls:"chips", options:SLOTS.map(function(g){ return { id:g, t:g === "H" || g === "Cl" ? g : F(g) }; }), value:S.ct[s],
      onChange:function(v){ S.ct[s] = v; afterChange(); } });
  });

  function tgtOf(id){ return TGT.filter(function(t){ return t.id === id; })[0]; }
  function curItem(){ return S.mode === "ct" ? { ct:S.ct.slice() } : { sp:S.spec }; }
  function cur(){ return itemMol(curItem()); }
  function refItem(){ return S.saved.length ? S.saved[S.saved.length - 1] : null; }
  function stop(){ if (anim) { anim(); anim = null; } busy = false; piDeg = 0; swap = null; }
  function afterChange(note){ rot = { k:-1, deg:0 }; blockedK = -1; ringK = -1; msg = note || ""; api.save(); paint(); }
  function setMode(v){ stop(); lock(false); S.mode = v; modeRG.set(v); sel = null; afterChange(); }
  function startTgt(){
    var t = tgtOf(S.tgt); S.spec = mk((t || TGT[1]).smi); sel = null;
    var m = cur(); afterChange(t ? "Started from " + nameOf(m) + ". Change it into other isomers of " + F(t.id) + "." : "");
  }
  function setSpec(sp, note, ns){ if (!validSpec(sp)) { msg = "That would leave the structure in pieces or break a valence rule."; paint(); return; } S.spec = sp; sel = ns === undefined ? null : ns; afterChange(note); }
  function lock(b){
    busy = b; modeRG.lock(b); tgtRG.lock(b); slotRG.forEach(function(r){ r.lock(b); });
    $$(".si-ctrl button", host).forEach(function(x){ if (!x.closest(".rg")) x.disabled = b || x.hasAttribute("data-off"); });
  }

  // ----- builder (structural mode) -----
  function pick(k, i){ if (busy || S.mode !== "struct") return; sel = { k:k, i:i }; rot = { k:-1, deg:0 }; blockedK = -1; ringK = -1; msg = ""; paint(); }
  function pickLabel(k, i){
    var m = cur(), L = layout2d(m);
    if (k === "a") return "Atom " + (i + 1) + ": " + MV.plain(F(lbl2(m, i, L))) + (sel && sel.k === "a" && sel.i === i ? ", selected" : "") + ". Select it for the builder buttons.";
    var b = m.b[i]; return "Bond between atom " + (b[0] + 1) + " and atom " + (b[1] + 1) + ", " + (b[2] === 2 ? "double" : "single") + (sel && sel.k === "b" && sel.i === i ? ", selected" : "") + ". Select it for the builder buttons.";
  }
  function dist(m, i){ var A = adj(m), d = {}, q = [i]; d[i] = 0; while (q.length) { var x = q.shift(); A[x].forEach(function(y){ if (!(y in d)) { d[y] = d[x] + 1; q.push(y); } }); } return d; }
  function inRing(m, i){ var R = ringOf(m); return !!R && R.indexOf(i) >= 0; }
  function btn(a, t, why, cls){ return '<button type="button" class="btn ' + (cls || "ghost") + ' sm" data-act="' + a + '" data-k="si' + a + '"' + (why ? ' data-off="1" disabled title="' + esc(why) + '"' : "") + ">" + t + "</button>"; }
  function toolsHTML(){
    var m = cur(), A = adj(m), n = m.a.length, h = "", notes = [];
    if (!sel) return '<p class="tiny muted">Tap an atom or a bond in the drawing to see what you can do with it.</p>';
    if (sel.k === "a") {
      var i = sel.i, el = m.a[i].el, fr = free(m, i), full = n >= MAXA ? "6 atoms (not counting H) is the limit here" : "", R = ringOf(m), dd = dist(m, i);
      h += btn("addC", "Add C", !fr ? "no free bond" : full) + btn("addO", "Add O", !fr ? "no free bond" : el === "O" ? "no O–O bonds here" : full);
      m.a.forEach(function(_, j){ if (j !== i && dd[j] >= 2 && dd[j] <= 5 && !R && fr > 0 && free(m, j) > 0 && !(el === "O" && m.a[j].el === "O")) h += btn("ring" + j, "Ring to atom " + (j + 1)); });
      if (R) notes.push("One ring at a time here.");
      var rest = { a:S.spec.a.filter(function(_, j){ return j !== i; }), b:S.spec.b.filter(function(b){ return b[0] !== i && b[1] !== i; }).map(function(b){ return [b[0] > i ? b[0] - 1 : b[0], b[1] > i ? b[1] - 1 : b[1], b[2], b[3]]; }) };
      h += btn("del", "Delete atom", n <= 1 ? "keep at least one atom" : connected(rest) ? "" : "only an end atom or a ring atom");
      if (!fr) notes.push("This atom has no free bond left: C makes 4 bonds and O makes 2.");
    } else {
      var b = m.b[sel.i], e1 = m.a[b[0]].el, e2 = m.a[b[1]].el, okP = e1 === "C" || e2 === "C", ok2 = free(m, b[0]) >= 1 && free(m, b[1]) >= 1, d = dbInfo(m).filter(function(x){ return x.k === sel.i; })[0];
      h += btn("single", "Single", b[2] === 1 ? "already single" : "") + btn("double", "Double", b[2] === 2 ? "already double" : !okP ? "C=C or C=O only" : ok2 ? "" : "no free bond");
      if (d && d.stereo) h += btn("swapz", "Swap top and bottom (cis ⇄ trans)");
      if (inRing(m, b[0]) && inRing(m, b[1])) h += btn("open", "Delete bond (open the ring)");
      h += '<span class="si-rot" role="group" aria-label="Rotate about the selected bond, 30° steps (arrow keys too)"><span class="tiny muted">Rotate:</span>' + btn("rotm", "⟲ 30°") + btn("rotp", "⟳ 30°") + "</span>";
      if (b[2] === 1 && okP && !ok2) notes.push("A double bond needs a free bond on both atoms.");
    }
    return h + (notes.length ? '<p class="tiny muted">' + notes.join(" ") + "</p>" : "");
  }
  function act(a){
    var sp = JSON.parse(JSON.stringify(S.spec)), m = cur();
    if (a === "reset") { startTgt(); return; }
    if (a === "flip") { S.flip = !S.flip; afterChange("The drawing is mirrored. Same atoms, same bonds: " + (nameOf(cur()) || "the same molecule") + " still."); return; }
    if (a === "save") { save(); return; }
    if (a === "add") { addToList(); return; }
    if (a === "clr") { S.list = []; lmsg = null; api.save(); paint(); return; }
    if (a === "cswap") { if (S.saved.length === 2) { S.saved = [S.saved[1], S.saved[0]]; api.save(); paint(); } return; }
    if (a === "ctl" || a === "ctr") { swapSide(a === "ctl" ? 0 : 1); return; }
    if (a === "ctrot") { rotate(0, 30); return; }
    if (!sel) return;
    if (sel.k === "a") {
      var i = sel.i;
      if (a === "addC" || a === "addO") { sp.a.push(a.slice(3)); sp.b.push([i, sp.a.length - 1, 1, 0]); setSpec(sp, "Added " + a.slice(3) + " to atom " + (i + 1) + ".", { k:"a", i:sp.a.length - 1 }); return; }
      if (a.indexOf("ring") === 0) { var j = +a.slice(4); sp.b.push([i, j, 1, 0]); setSpec(sp, "Ring closed between atoms " + (i + 1) + " and " + (j + 1) + ".", null); return; }
      if (a === "del") { sp.b = sp.b.filter(function(b){ return b[0] !== i && b[1] !== i; }).map(function(b){ return [b[0] > i ? b[0] - 1 : b[0], b[1] > i ? b[1] - 1 : b[1], b[2], b[3]]; }); sp.a.splice(i, 1); setSpec(sp, "Deleted atom " + (i + 1) + ".", null); return; }
    } else {
      var k = sel.i, b = sp.b[k];
      if (a === "single" || a === "double") { b[2] = a === "double" ? 2 : 1; b[3] = 0; setSpec(sp, "The bond is now " + a + ".", { k:"b", i:k }); return; }
      if (a === "swapz") { b[3] = b[3] ? 0 : 1; setSpec(sp, "Swapped the groups on one end of the C=C: " + (nameOf(molOf(sp)) || "the other stereoisomer") + ".", { k:"b", i:k }); return; }
      if (a === "open") { sp.b.splice(k, 1); setSpec(sp, "Ring opened.", null); return; }
      if (a === "rotm" || a === "rotp") { rotate(k, a === "rotp" ? 30 : -30); return; }
    }
  }
  // rotation test: single bonds turn freely; a ring holds its bonds; a C=C resists and snaps back
  function rotate(k, step){
    var m = cur(), b = m.b[k]; if (!b || busy) return;
    if (anim) { anim(); anim = null; }
    var sc = scene3(m); msg = "";
    if (twist(sc, b[0], b[1], 0) === null) { ringK = k; blockedK = -1; paint(); return; }
    ringK = -1;
    if ((b[2] || 1) === 1) {
      var from = rot.k === k ? rot.deg : 0, to = from + step; rot = { k:k, deg:from }; blockedK = -1;
      anim = MV.tween({ dur:320, step:function(t){ rot.deg = from + (to - from) * t; paintViews(); }, done:function(){ anim = null; rot.deg = ((to % 360) + 360) % 360; paint(); } });
      return;
    }
    blocked(k);
  }
  function blocked(k, cb){
    stop(); lock(true); rot = { k:-1, deg:0 }; blockedK = k; ringK = -1; paintRead();
    anim = MV.tween({ dur:1900, ease:LIN, step:function(t){
      piDeg = t < 0.55 ? 90 * ease(t / 0.55) : t < 0.7 ? 90 : 90 * (1 - ease((t - 0.7) / 0.3));
      paintViews(); paintRead();
    }, done:function(){ anim = null; piDeg = 0; lock(false); paint(); if (cb) cb(); } });
  }
  // cis–trans mode: swap the two groups on one carbon (an animated flip in the drawing)
  function swapSide(c, cb){
    if (busy) return; lock(true);
    anim = MV.tween({ dur:1100, step:function(t){ swap = { c:c, t:t }; paintViews(); }, done:function(){
      anim = null; swap = null;
      var ct = S.ct.slice(); if (c === 0) { var x = ct[0]; ct[0] = ct[1]; ct[1] = x; } else { var y = ct[2]; ct[2] = ct[3]; ct[3] = y; }
      S.ct = ct; slotRG.forEach(function(r, s){ r.set(ct[s]); });
      lock(false); afterChange("Swapped the top and bottom groups on the " + (c ? "right" : "left") + " carbon."); if (cb) cb();
    } });
  }
  function save(){
    var it = curItem(), m = itemMol(it); if (!m.a.length) return;
    S.saved = S.saved.concat([JSON.parse(JSON.stringify(it))]).slice(-2);
    msg = "Saved: " + (nameOf(m) || MV.plain(F(fText(m)))) + ". The relationship row now compares with it; Compare mode shows your last two saved molecules.";
    api.save(); paint();
  }
  function addToList(){
    var it = curItem(), m = itemMol(it), f = fText(m);
    if (f !== "C4H8") { lmsg = { k:"bad", h:"That’s " + F(f) + ", not " + F("C4H8") + ". Only " + F("C4H8") + " molecules go on this list." }; paint(); return; }
    var dup = S.list.filter(function(x){ return same(itemMol(x), m); })[0];
    if (dup) { lmsg = { k:"bad", h:"That’s " + nameOf(itemMol(dup)) + " again. Trace the bonds." }; paint(); return; }
    S.list.push(JSON.parse(JSON.stringify(it))); lmsg = { k:"good", h:"✓ Added " + (nameOf(m) || "it") + ". Your list has " + S.list.length + "." };
    api.save(); paint();
  }

  // ----- painting -----
  function paintViews(){
    if (S.mode === "cmp") { paintCmp(); return; }
    var m = cur(), md = S.mode, selB = md === "struct" && sel && sel.k === "b" && m.b[sel.i] ? [m.b[sel.i][0], m.b[sel.i][1]] : null, nm = nameOf(m) || MV.plain(F(fText(m)));
    V2.show(m, { flip:S.flip, picks:md === "struct" && !busy, selA:md === "struct" && sel && sel.k === "a" ? sel.i : null, selB:selB, dip:hide.dip ? null : dipC, swap:swap,
      aria:"Drawing of " + nm + ", " + MV.plain(F(fText(m))) + (S.flip ? ", mirrored" : "") + ". " + MV.plain(polTxt(polarity(m))) + "." });
    var sc = scene3(m), k = md === "ct" ? 0 : selB ? sel.i : -1, b = k >= 0 ? m.b[k] : null, d = b ? dbInfo(m).filter(function(x){ return x.k === k && !x.ring; })[0] : null, sc2 = sc;
    if (b && rot.k === k && rot.deg) sc2 = twist(sc, b[0], b[1], rot.deg) || sc;
    if (d && piDeg) sc2 = twist(sc, b[0], b[1], piDeg) || sc;
    V3.show(sc2, { fitScene:sc, selB:b ? [b[0], b[1]] : null, glow:glow, pi:d ? { i:b[0], j:b[1], deg:piDeg } : null,
      aria:"3D ball-and-stick model of " + nm + (d ? ", with the π bond of the C=C drawn as a band above and below it" : "") + "." });
  }
  function rotTxt(m){
    var md = S.mode, k = md === "ct" ? 0 : sel && sel.k === "b" ? sel.i : -1, b = k >= 0 ? m.b[k] : null;
    if (!b) return muted(md === "struct" ? "select a bond, then press Rotate" : "—");
    if (ringK === k) return "Locked: the ring holds this bond, so it can’t turn without breaking the ring";
    if ((b[2] || 1) === 1) return "Rotates freely" + (rot.k === k && rot.deg ? " (turned " + Math.round(rot.deg) + "°: same molecule)" : "");
    if (b[2] !== 2 || m.a[b[0]].el !== "C" || m.a[b[1]].el !== "C") return "Rotating it would break its π bond";
    var e = Math.pow(Math.sin(piDeg * DEG), 2), shown = blockedK === k;
    return (shown ? "<strong>Rotating the C=C would break the π bond</strong>" : "A C=C: press " + (md === "ct" ? "Rotate the C=C" : "Rotate") + " to test it") + ebar(e) +
      '<span class="si-enote">' + (piDeg ? "twisted " + Math.round(piDeg) + "°: overlap " + Math.round(Math.abs(Math.cos(piDeg * DEG)) * 100) + "%" : "") + (shown || piDeg ? " ≈ " + PI_BARRIER + " kJ/mol needed: more than room-temperature collisions supply" : "") + "</span>";
  }
  function paintRead(){
    var rows;
    if (S.mode === "cmp") {
      var A = S.saved[0], B = S.saved[1];
      rows = [["Relationship", !B ? muted("save two molecules to compare them") : relText(relation(itemMol(B), itemMol(A)), nameOf(itemMol(A))).replace(/ of /, " of the left molecule, ").replace(/^Same compound: .*/, "Same compound")]];
      if (A && B) {
        var pa = polarity(itemMol(A)), pb = polarity(itemMol(B)), ba = bpOf(nameOf(itemMol(A))), bb = bpOf(nameOf(itemMol(B)));
        rows.push(["Higher boiling point", hide.bp ? "?" : ba == null || bb == null ? muted("one of them isn’t in the data list") : ba === bb ? "the same" : (ba > bb ? "left" : "right") + ": " + (ba > bb ? nameOf(itemMol(A)) : nameOf(itemMol(B)))]);
        rows.push(["Polar?", hide.pol ? "?" : "left " + pa.cls.replace("slightly", "slightly polar") + " · right " + pb.cls.replace("slightly", "slightly polar")]);
      }
      $(".si-read", host).innerHTML = MV.readoutHTML(rows); return;
    }
    var m = cur(), f = fText(m), ref = refItem(), nm = nameOf(m), b = bpOf(nm), mp = nm in MPX ? MPX[nm] : null;
    rows = [["Formula", F(f) + (S.mode === "struct" && S.tgt ? (f === S.tgt ? " ✓ matches the target" : " " + muted("(target " + F(S.tgt) + ")")) : "")],
      ["Name", nameHTML(m)], ["Can it have cis–trans isomers?", ctTxt(m)],
      ["Relationship to saved molecule", ref ? relText(relation(m, itemMol(ref)), nameOf(itemMol(ref))) : muted("press Save for comparison to keep a molecule, then build another")],
      ["Rotation test", rotTxt(m)], ["Polarity", hide.pol ? "?" : polTxt(polarity(m))],
      ["Boiling point", hide.bp ? "?" : b != null ? degTxt(b) : muted("not in this module’s data list")], ["Melting point", hide.bp ? "?" : mp != null ? degTxt(mp) : muted("not in this module’s data list")]];
    $(".si-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function cmpR(){ return Math.max.apply(null, S.saved.map(function(it){ return radius3(scene3(itemMol(it))); }).concat([1])); }
  function paintCmp(){
    [0, 1].forEach(function(c){
      var col = $('[data-col="' + c + '"]', host), it = S.saved[c];
      $(".si-ph", col).innerHTML = (c ? "Right" : "Left") + ": " + (it ? nameOf(itemMol(it)) || MV.plain(F(fText(itemMol(it)))) : "no saved molecule yet");
      if (!it) { CV2[c].show({ a:[], b:[], main:[] }, {}); CV3[c].show(null); $(".si-cread", col).innerHTML = ""; return; }
      var m = itemMol(it), nm = nameOf(m), b = bpOf(nm), mp = nm in MPX ? MPX[nm] : null;
      CV2[c].show(m, { dip:hide.dip ? null : dipC, aria:"Drawing of " + nm + "." });
      CV3[c].show(scene3(m), { glow:glow, R:cmpR(), aria:"3D model of " + nm + (glow ? ", with its surface shaded" : "") + "." });
      $(".si-cread", col).innerHTML = MV.readoutHTML([["Formula", F(fText(m))], ["Polarity", hide.pol ? "?" : polTxt(polarity(m))], ["Boiling point", hide.bp ? "?" : b != null ? degTxt(b) : muted("not in the data list")], ["Melting point", hide.bp ? "?" : mp != null ? degTxt(mp) : muted("not in the data list")]]);
    });
  }
  function paintCtrl(){
    var md = S.mode, m = cur();
    if (md === "struct") {
      $(".si-sel", host).innerHTML = !sel ? "" : sel.k === "a" ? "Selected: atom " + (sel.i + 1) + " (" + F(lbl2(m, sel.i, layout2d(m))) + ")" : "Selected: the bond between atoms " + (m.b[sel.i][0] + 1) + " and " + (m.b[sel.i][1] + 1) + " (" + (m.b[sel.i][2] === 2 ? "double" : "single") + ")";
      MV.keepFocus($(".si-st .si-tools", host), function(){ $(".si-st .si-tools", host).innerHTML = toolsHTML(); });
    }
    if (md === "ct") MV.keepFocus($(".si-ctb", host), function(){ $(".si-ctb", host).innerHTML = btn("ctl", "Swap top and bottom: left carbon") + btn("ctr", "Swap top and bottom: right carbon") + btn("ctrot", "Rotate the C=C"); });
    MV.keepFocus($(".si-com", host), function(){ $(".si-com", host).innerHTML = md === "cmp" ? "" : btn("flip", "Flip drawing") + (md === "struct" ? btn("reset", "Start again") : "") + btn("save", "Save for comparison", "", "primary"); });
    $('[data-act="cswap"]', host).disabled = busy || S.saved.length < 2;
  }
  function paintList(){
    var box = $(".si-list", host); if (S.mode === "cmp") { box.innerHTML = ""; return; }
    var h = '<p class="si-lh"><strong>My ' + F("C4H8") + " list</strong> (challenge 3): " + S.list.length + " so far</p>" +
      (S.list.length ? '<ol class="si-ol">' + S.list.map(function(it){ return "<li>" + (nameOf(itemMol(it)) || "unnamed") + "</li>"; }).join("") + "</ol>" : "") +
      '<div class="q-actions">' + btn("add", "Add to my " + F("C4H8") + " list") + btn("clr", "Clear the list", S.list.length ? "" : "the list is empty") + "</div>" + (lmsg ? MV.fbHTML(lmsg.k, lmsg.h) : "");
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paint(){
    var md = S.mode;
    $(".si-st", host).hidden = md !== "struct"; $(".si-ctm", host).hidden = md !== "ct"; $(".si-cmpc", host).hidden = md !== "cmp"; $(".si-list", host).hidden = md === "cmp";
    $(".si-one", host).hidden = md === "cmp"; $(".si-two", host).hidden = md !== "cmp";
    paintViews(); paintRead(); paintCtrl(); paintList();
    $(".si-msg", host).innerHTML = msg;
    if (busy) lock(true);
    MV.changed();
  }
  $(".si-ctrl", host).addEventListener("click", function(e){
    var b = e.target.closest("button[data-act]"); if (!b || b.disabled || busy) return;
    var k = b.dataset.k; act(b.dataset.act);
    var f = $('[data-k="' + k + '"]', host); if (f && !f.disabled && document.activeElement !== f) f.focus({ preventScroll:true });
  });
  $(".si-ctrl", host).addEventListener("keydown", function(e){
    var b = e.target.closest('[data-act="rotm"],[data-act="rotp"]'); if (!b || busy) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); act(e.key === "ArrowRight" ? "rotp" : "rotm"); }
  });

  // ----- predictions -----
  var hooks = {
    start:function(p){
      stop(); lock(false); hide = {}; glow = 0; dipC = { b:1, n:1 }; msg = ""; lmsg = null; sel = null; rot = { k:-1, deg:0 }; blockedK = -1; ringK = -1;
      if (p.id === "p1") { S.mode = "struct"; S.tgt = "C4H10"; S.spec = mk("CCCC"); S.saved = [{ sp:mk("CC(C)C") }]; hide.bp = true; }
      else if (p.id === "p2") { S.mode = "struct"; S.tgt = ""; S.spec = mk("CC"); sel = { k:"b", i:0 }; }
      else if (p.id === "p3") { S.mode = "ct"; S.ct = ["H", "H", "H", "C2H5"]; S.saved = [{ ct:S.ct.slice() }]; }
      else { S.mode = "cmp"; S.saved = [{ ct:["Cl", "H", "Cl", "H"] }, { ct:["Cl", "H", "H", "Cl"] }]; hide.bp = true; hide.pol = true; dipC = { b:0, n:0 }; }
      modeRG.set(S.mode); tgtRG.set(S.tgt); slotRG.forEach(function(r, s){ r.set(S.ct[s]); }); api.save(); paint();
    },
    run:function(p, done){
      if (p.id === "p1") {
        S.saved = [{ sp:mk("CCCC") }, { sp:mk("CC(C)C") }]; S.mode = "cmp"; modeRG.set("cmp"); paint(); lock(true);
        anim = MV.tween({ dur:1400, step:function(t){ glow = t; paintCmp(); }, done:function(){ anim = null; glow = 1; hide = {}; lock(false); msg = "Butane’s surface is larger: more contact between molecules, stronger London forces."; paint(); MV.wait(200, done); } });
        return;
      }
      if (p.id === "p2") {
        lock(true); rot = { k:0, deg:0 };
        anim = MV.tween({ dur:1800, ease:LIN, step:function(t){ rot.deg = 360 * t; paintViews(); paintRead(); }, done:function(){
          anim = null; rot = { k:0, deg:0 }; lock(false); msg = "Ethane’s C–C bond turned all the way round.";
          MV.wait(450, function(){ S.spec = mk("C=C"); sel = { k:"b", i:0 }; paint(); blocked(0, function(){ msg = "Ethene’s C=C resisted and snapped back: twisting pulls the p orbitals apart."; paint(); MV.wait(200, done); }); });
        } });
        return;
      }
      if (p.id === "p3") { swapSide(0, function(){ msg = "Swapping C1’s two H atoms gave the same molecule: the relationship row says “Same compound”."; paint(); MV.wait(200, done); }); return; }
      lock(true); dipC = { b:0, n:0 };
      anim = MV.tween({ dur:1300, step:function(t){ dipC = { b:t, n:0 }; paintCmp(); }, done:function(){
        anim = MV.tween({ dur:900, step:function(t){ dipC = { b:1, n:t }; paintCmp(); }, done:function(){ anim = null; dipC = { b:1, n:1 }; hide = {}; lock(false); msg = "Cis: the C–Cl dipoles add to a net dipole. Trans: they cancel."; paint(); MV.wait(200, done); } });
      } });
    }
  };
  // ----- challenges -----
  function chal(id){
    var m = cur(), f = fText(m), nm = nameOf(m);
    if (id === "tc1") {
      if (S.mode !== "struct") return { ok:false, msg:"Switch to Structural isomers mode and build it there." };
      if (f === "C5H10") return { ok:false, msg:"Check the formula: a ring or double bond removes 2 H." };
      if (f !== "C5H12") return { ok:false, msg:"That’s " + F(f) + ". Build a " + F("C5H12") + " molecule: five carbons, all single bonds." };
      if (nm === "2,2-dimethylpropane") return { ok:true };
      if (nm === "2-methylbutane") return { ok:false, msg:MV.chem.fx(bpOf(nm), 0) + " °C: still above 20 °C. Branch more." };
      return { ok:false, msg:"That’s the straight chain: " + MV.chem.fx(bpOf("pentane"), 0) + " °C." };
    }
    if (id === "tc2") {
      if (S.mode !== "ct") return { ok:false, msg:"Switch to Cis–trans mode and choose the four groups there." };
      var ct = S.ct, ncl = ct.filter(function(g){ return g === "Cl"; }).length, nh = ct.filter(function(g){ return g === "H"; }).length;
      if (ncl !== 2 || nh !== 2) return { ok:false, msg:"That’s " + F(f) + ". Use two Cl and two H to make " + F("C2H2Cl2") + "." };
      if ((ct[0] === "Cl" && ct[1] === "Cl") || (ct[2] === "Cl" && ct[3] === "Cl")) return { ok:false, msg:"Both Cl on one carbon: polar, and no cis–trans pair." };
      if ((ct[0] === "Cl" && ct[2] === "Cl") || (ct[1] === "Cl" && ct[3] === "Cl")) return { ok:false, msg:"The Cl dipoles point the same way: polar. " + RU.m5 };
      return { ok:true };
    }
    var names = S.list.map(function(it){ return nameOf(itemMol(it)); }), have = WANT6.filter(function(w){ return names.indexOf(w) >= 0; }), rings = names.filter(function(n){ return n === "cyclobutane" || n === "methylcyclopropane"; }).length;
    var b2 = names.filter(function(n){ return /but-2-ene$/.test(n); }).length;
    if (have.length === 6 && S.list.length === 6) return { ok:true };
    if (!S.list.length) return { ok:false, msg:"Build a " + F("C4H8") + " molecule and press Add to my " + F("C4H8") + " list. Repeat for each new one." };
    if (S.list.length === 5 && b2 === 1) return { ok:false, msg:"But-2-ene has two stereoisomers." };
    if (!rings && S.list.length >= 4) return { ok:false, msg:"Alkenes aren’t the only CₙH₂ₙ molecules: rings have that formula too." };
    if (b2 === 1) return { ok:false, msg:"But-2-ene has two stereoisomers." };
    return { ok:false, msg:"Your list has " + S.list.length + ". Keep going: look for every place the C=C can go, every branch, and every ring." };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- hero: ethane spins, ethene's turn snaps back, cis and trans but-2-ene slide apart ----------
function flipY(sc){ return { bonds:sc.bonds, atoms:sc.atoms.map(function(a){ var o = Object.assign({}, a); o.y = -a.y; o.z = -a.z; return o; }) }; }
function hero(){
  var svg = $("#si-hx-svg"), cap = $("#si-hx-cap"), rep = $("#si-hx-replay"); if (!svg) return;
  var CAPS = MV.C.hero.caps, sE = scene3(molOf(mk("CC"))), sN = scene3(molOf(mk("C=C"))), sC = flipY(scene3(molOf(mk("CC=CC", 1)))), sT = flipY(scene3(molOf(mk("CC=CC", 0))));
  var W = 480, H = 300, RV = { x:-0.22, y:0.38 }, END = 8800, run = 0, ci = -1, uid = 900;
  function one(sc, cx, cy, s, op, o, rv){ return "<g" + opA(op) + ">" + svg3d(sc, rv || RV, { s:s, ox:cx, oy:cy }, o || {}, ++uid) + "</g>"; }
  function frame(t){
    var out = "", k;
    if (t < 3900) {
      var deg = t < 700 ? 0 : t < 3500 ? 720 * ease((t - 700) / 2800) : 720, op = Math.min(1, t / 450) * (t > 3600 ? Math.max(0, 1 - (t - 3600) / 300) : 1);
      out += one(twist(sE, 0, 1, deg) || sE, W / 2, H / 2 - 6, 70, op); k = 0;
    } else if (t < 6700) {
      var u = t - 3900, d2 = u < 400 ? 0 : u < 1300 ? 48 * ease((u - 400) / 900) : u < 1600 ? 48 : u < 1900 ? 48 * (1 - ease((u - 1600) / 300)) : 0;
      var op2 = Math.min(1, u / 300) * (t > 6400 ? Math.max(0, 1 - (t - 6400) / 300) : 1);
      out += one(twist(sN, 0, 1, d2) || sN, W / 2, H / 2 - 6, 74, op2, { pi:{ i:0, j:1, deg:d2 } }); k = 1;
    } else {
      var v = t - 6700, sl = ease(clamp(v / 1300, 0, 1)), dx = 118 * sl, RF = { x:-0.12, y:0.2 }, op3 = Math.min(1, v / 300), lb = clamp((v - 900) / 500, 0, 1), bp = clamp((v - 1400) / 600, 0, 1);
      out += one(sC, W / 2 - dx, H / 2 - 34, 37, op3, null, RF) + one(sT, W / 2 + dx, H / 2 - 34, 37, op3, null, RF);
      out += T(W / 2 - 118, H - 62, "cis", { fs:22, i:true, w:700, raw:true, op:lb }) + T(W / 2 + 118, H - 62, "trans", { fs:22, i:true, w:700, raw:true, op:lb });
      out += T(W / 2 - 118, H - 32, "b.p. " + degTxt(bpOf("cis-but-2-ene")), { fs:17, raw:true, op:bp }) + T(W / 2 + 118, H - 32, "b.p. " + degTxt(bpOf("trans-but-2-ene")), { fs:17, raw:true, op:bp });
      k = 2;
    }
    svg.innerHTML = out;
    if (k !== ci) { ci = k; cap.textContent = CAPS[k]; }
  }
  function play(){
    var id = ++run; rep.hidden = true; ci = -1;
    MV.tween({ dur:END, ease:LIN, step:function(t){ if (id === run) frame(t * END); }, done:function(){ if (id !== run) return; frame(END); rep.hidden = false; } });
  }
  if (MV.reduceMotion) frame(END);
  else { rep.addEventListener("click", play); play(); }
}

// ---------- Part 3: Same formula, different properties ----------
// particle glyphs: [el, x, y] in bond lengths; bonds [i, j, order]
var GLY = {
  pentane:{ a:[["C", 0, 0], ["C", 0.87, -0.5], ["C", 1.73, 0], ["C", 2.6, -0.5], ["C", 3.46, 0]], b:[[0, 1], [1, 2], [2, 3], [3, 4]] },
  neo:{ a:[["C", 0, 0], ["C", -1, 0], ["C", 1, 0], ["C", 0, -1], ["C", 0, 1]], b:[[0, 1], [0, 2], [0, 3], [0, 4]] },
  ethanol:{ a:[["C", 0, 0], ["C", 0.87, -0.5], ["O", 1.73, 0], ["H", 2.45, -0.4]], b:[[0, 1], [1, 2], [2, 3]] },
  dme:{ a:[["C", 0, 0], ["O", 0.87, -0.5], ["C", 1.73, 0]], b:[[0, 1], [1, 2]] },
  p1ol:{ a:[["C", 0, 0], ["C", 0.87, -0.5], ["C", 1.73, 0], ["O", 2.6, -0.5], ["H", 3.32, -0.1]], b:[[0, 1], [1, 2], [2, 3], [3, 4]] },
  p2ol:{ a:[["C", 0, 0], ["C", 0.87, -0.5], ["C", 1.73, 0], ["O", 0.87, -1.5], ["H", 1.57, -1.95]], b:[[0, 1], [1, 2], [1, 3], [3, 4]] },
  cis:{ a:[["C", -0.65, 0], ["C", 0.65, 0], ["Cl", -1.2, -0.95], ["Cl", 1.2, -0.95], ["H", -1.1, 0.68], ["H", 1.1, 0.68]], b:[[0, 1, 2], [0, 2], [1, 3], [0, 4], [1, 5]] },
  trans:{ a:[["C", -0.65, 0], ["C", 0.65, 0], ["Cl", -1.2, -0.95], ["H", 1.1, -0.68], ["H", -1.1, 0.68], ["Cl", 1.2, 0.95]], b:[[0, 1, 2], [0, 2], [1, 3], [0, 4], [1, 5]] }
};
function ball(x, y, el, r){ var c = MV.chem.atom(el), rr = el === "H" ? r * 0.72 : el === "Cl" ? r * 1.15 : r; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(rr) + '" fill="' + c.fill + '"' + (el === "H" ? ' stroke="' + c.line + '" stroke-width="1.3"' : "") + "/>" + T(x, y + 0.5, el, { fs:rr * (el.length > 1 ? 0.95 : 1.15), w:700, c:c.ink, raw:true }); }
function glyph(id, ox, oy, s, o){
  o = o || {};
  var g = GLY[id], P = g.a.map(function(a){ return [ox + (o.mx ? -a[1] : a[1]) * s, oy + a[2] * s]; }), out = "";
  if (o.env) { g.b.forEach(function(b){ out += Ln(P[b[0]][0], P[b[0]][1], P[b[1]][0], P[b[1]][1], { c:"var(--hi-soft)", w:s * 1.25 }); }); g.a.forEach(function(a, i){ if (a[0] !== "H") out += '<circle cx="' + r1(P[i][0]) + '" cy="' + r1(P[i][1]) + '" r="' + r1(s * 0.62) + '" fill="var(--hi-soft)"/>'; }); }
  g.b.forEach(function(b){ var p = P[b[0]], q = P[b[1]]; if (b[2] === 2) { var dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), nx = -dy / l * 3, ny = dx / l * 3; out += Ln(p[0] + nx, p[1] + ny, q[0] + nx, q[1] + ny, { c:"var(--ink-2)", w:2 }) + Ln(p[0] - nx, p[1] - ny, q[0] - nx, q[1] - ny, { c:"var(--ink-2)", w:2 }); } else out += Ln(p[0], p[1], q[0], q[1], { c:"var(--ink-2)", w:2.4 }); });
  g.a.forEach(function(a, i){ out += ball(P[i][0], P[i][1], a[0], s * 0.3); });
  return { svg:out, P:P };
}
function hb(p, q, lab, o){ o = o || {}; return Ln(p[0], p[1], q[0], q[1], { c:"var(--e-pair)", w:o.w || 3, d:"2 5", op:o.op }) + (lab ? T((p[0] + q[0]) / 2 + (o.lx || 0), (p[1] + q[1]) / 2 + (o.ly || -14), lab, { fs:13, w:700, c:"var(--e-pair)", raw:true, halo:true }) : ""); }
function zcap(x, a, b){ return T(x, 180, a, { fs:14, w:700, raw:true }) + T(x, 199, b, { fs:13, raw:true, c:"var(--ink-2)" }); }
function zoomSVG(id){
  var out = "", a, b, i, ar = (ZOOMA[id] || ["", ""]);
  if (id === "chain") {
    a = glyph("pentane", 72, 60, 40, { env:1 }); b = glyph("pentane", 72, 122, 40, { env:1 });
    out += a.svg + b.svg; for (i = 0; i < 5; i++) out += Ln(a.P[i][0], a.P[i][1] + 13, b.P[i][0], b.P[i][1] - 13, { c:"var(--ink-2)", w:1.6, d:"2 4" });
    out += zcap(140, "pentane: long contact", "stronger London forces");
    a = glyph("neo", 372, 96, 30, { env:1 }); b = glyph("neo", 472, 96, 30, { env:1 });
    out += a.svg + b.svg + Ln(a.P[2][0] + 10, 96, b.P[1][0] - 10, 96, { c:"var(--ink-2)", w:1.6, d:"2 4" });
    out += zcap(420, "2,2-dimethylpropane: small contact", "weaker London forces");
  } else if (id === "fg") {
    a = glyph("ethanol", 40, 62, 42); b = glyph("ethanol", 92, 112, 42);
    out += a.svg + b.svg + hb(a.P[3], b.P[2], "hydrogen bond", { lx:52, ly:-6 });
    out += zcap(140, "ethanol", "O–H···O hydrogen bonds");
    a = glyph("dme", 320, 66, 42); b = glyph("dme", 382, 124, 42);
    out += a.svg + b.svg + Ln(a.P[2][0] + 6, a.P[2][1] + 10, b.P[1][0] - 4, b.P[1][1] - 12, { c:"var(--ink-2)", w:1.6, d:"5 4" }) + T(470, 74, "weak dipole–dipole", { fs:12, raw:true, c:"var(--ink-2)" });
    out += zcap(420, "methoxymethane", "no O–H, so no hydrogen bond");
  } else if (id === "pos") {
    a = glyph("p1ol", 26, 66, 36); b = glyph("p1ol", 94, 122, 36);
    out += a.svg + b.svg + hb(a.P[4], b.P[3], "hydrogen bond", { lx:58, ly:-16 });
    out += zcap(140, "propan-1-ol", "the OH at the end is easy to reach");
    a = glyph("p2ol", 318, 120, 36); b = glyph("p2ol", 528, 146, 36, { mx:1 });
    out += a.svg + b.svg + hb(a.P[4], b.P[3], "", { w:2, op:0.55 }) + '<circle cx="' + r1(a.P[3][0]) + '" cy="' + r1(a.P[3][1]) + '" r="30" fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="4 3"/>';
    out += zcap(420, "propan-2-ol", "two CH₃ groups crowd the OH");
  } else if (id === "ct") {
    [[78, 48], [78, 124], [190, 86]].forEach(function(p){ out += glyph("cis", p[0], p[1], 26).svg + dArrow(p[0] + 46, p[1] + 14, p[0] + 46, p[1] - 24, { w:2.4, hs:9, k:5 }); });
    out += zcap(140, "liquid", "cis dipoles line up, δ+ to δ−");
    for (var r = 0; r < 2; r++) for (var c2 = 0; c2 < 3; c2++) out += glyph("trans", 336 + c2 * 72, 58 + r * 70, 22).svg;
    out += zcap(420, "solid", "flat trans molecules stack neatly");
  }
  return '<div class="si-zpair">' + [0, 280].map(function(x0, k){ return '<svg class="si-zsvg" viewBox="' + x0 + ' 0 280 210" role="img" aria-label="' + esc(MV.plain(ar[k] || "")) + '">' + out + "</svg>"; }).join("") + "</div>";
}
var ZOOMA = {};
function skelSVG(m, W, H, o){
  o = o || {};
  var L = layout2d(m), xs = L.P.map(function(p){ return p[0]; }), ys = L.P.map(function(p){ return p[1]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
  var s = Math.min((W - 30) / (x1 - x0 + 0.8), (H - 24) / (y1 - y0 + 0.8), o.smax || 30), ox = W / 2 - (x0 + x1) / 2 * s, oy = H / 2 - (y0 + y1) / 2 * s, out = "", h = hc(m);
  function P(i){ return [ox + L.P[i][0] * s, oy + L.P[i][1] * s]; }
  m.b.forEach(function(b){
    var p = P(b[0]), q = P(b[1]), ea = m.a[b[0]].el === "O" ? 8 : 0, eb = m.a[b[1]].el === "O" ? 8 : 0, dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
    var a = [p[0] + ux * ea, p[1] + uy * ea], z = [q[0] - ux * eb, q[1] - uy * eb];
    out += Ln(a[0], a[1], z[0], z[1], { w:2.2 });
    if (b[2] === 2) { var nx = -uy * 4.5, ny = ux * 4.5; out += Ln(a[0] + nx + ux * 3, a[1] + ny + uy * 3, z[0] + nx - ux * 3, z[1] + ny - uy * 3, { w:2.2, c:o.hiDbl && m.a[b[0]].el === "C" && m.a[b[1]].el === "C" ? "var(--pen)" : "var(--ink)" }); }
  });
  m.a.forEach(function(x, i){ if (x.el === "O") { var p = P(i); out += T(p[0], p[1], h[i] ? "OH" : "O", { fs:13, w:700, c:"var(--at-o)", raw:true }); } });
  return out;
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.zoom = S.zoom || {}; S.eff = S.eff || {}; S.fat = S.fat || {};
  ZOOMA = { chain:s1.cards[0].zaria, fg:s1.cards[1].zaria, pos:s1.cards[2].zaria, ct:[s2.zoomL, s2.zoomR] };
  var fsel = null, fmsg = null, emsg = null;
  function bars(names){
    var lo = -40, hi = 110;
    return names.map(function(n){ var v = bpOf(n); return '<div class="si-bar"><span class="si-bn">' + n + '</span><span class="si-bt" aria-hidden="true"><i style="width:' + r1((v - lo) / (hi - lo) * 100) + '%"></i></span><span class="si-bv">' + MV.chem.fx(v, 0) + " °C</span></div>"; }).join("");
  }
  function zoomBlock(id, txt){ var on = !!S.zoom[id]; return '<button type="button" class="btn ghost sm si-zb" data-zoom="' + id + '" data-k="zm' + id + '" aria-expanded="' + on + '">' + (on ? "Hide the particles" : "Zoom to the particles") + '</button><div class="si-zoom"' + (on ? "" : " hidden") + ">" + (on ? zoomSVG(id) + "<p>" + txt + "</p>" : "") + "</div>"; }
  var DATA = Object.keys(MPX).map(function(n){ return [n, MV.chem.fx(bpOf(n), 0), MV.chem.fx(MPX[n], 0)]; });
  host.innerHTML = '<div class="part si-p3"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="si-cards">' + s1.cards.map(function(c){
      return '<div class="si-c3card" data-card="' + c.id + '"><h4>' + c.title + "</h4>" + bars(c.names) + '<p class="tiny muted">Boiling points (°C). ' + c.note + '</p><div class="si-zw" data-zw="' + c.id + '"></div></div>';
    }).join("") + '</div><details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Compound", "b.p. (°C)", "m.p. (°C)"], rows:DATA, caption:"Boiling and melting points of the isomers in this module (rounded)" }) + '<p class="tiny muted">' + C.dataNote + "</p></details></div>" +
    '<div class="part si-p3"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="si-eff"></div><div class="si-zw" data-zw="ct"></div></div>' +
    '<div class="part si-p3"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="si-fats"></div><p class="si-fnote">' + s3.note + "</p></div>";
  function paintZoom(){ $$("[data-zw]", host).forEach(function(z){ var id = z.dataset.zw, card = s1.cards.filter(function(c){ return c.id === id; })[0]; MV.keepFocus(z, function(){ z.innerHTML = zoomBlock(id, card ? card.zoom : s2.zoomL + " " + s2.zoomR); }); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-zoom]"); if (!b) return; S.zoom[b.dataset.zoom] = !S.zoom[b.dataset.zoom]; api.save(); paintZoom(); });
  // station 2: which effect explains each difference?
  var effBox = $(".si-eff", host);
  function paintEff(){
    var h = s2.rows.map(function(r){ var v = S.eff[r.id] || ""; return '<div class="si-erow"><p class="si-et">' + r.t + '</p><div class="si-eg" data-er="' + r.id + '"></div></div>'; }).join("");
    h += '<div class="q-actions"><button type="button" class="btn primary sm" data-eff="check" data-k="effchk">Check</button></div>' + (emsg ? MV.fbHTML(emsg.k, emsg.h) : "");
    effBox.innerHTML = h;
    s2.rows.forEach(function(r){ radios($('[data-er="' + r.id + '"]', effBox), { label:"explained by", aria:MV.plain(r.t) + ": explained by", cls:"chips", options:s2.choices, value:S.eff[r.id] || "", onChange:function(v){ S.eff[r.id] = v; emsg = null; api.save(); var fb = $(".si-eff .fb", host); if (fb) fb.remove(); } }); });
  }
  effBox.addEventListener("click", function(e){
    var b = e.target.closest("[data-eff]"); if (!b) return;
    if (s2.rows.some(function(r){ return !S.eff[r.id]; })) emsg = { k:"", h:"Choose polarity or packing for both rows first." };
    else {
      var bad = s2.rows.filter(function(r){ return S.eff[r.id] !== MV.ans(r); });
      emsg = bad.length ? { k:"bad", h:"<strong>✗ Not quite.</strong> " + bad.map(function(r){ return r.why; }).join(" ") + " Try again." } : { k:"good", h:"<strong>✓ Right.</strong> " + s2.summary };
    }
    paintEff(); MV.focusFb(effBox);
  });
  // station 3: fats, tap a chain then tap solid or liquid
  var fatBox = $(".si-fats", host), FM = { sat:molOf(mk("CCCCCCCCCCCCCCCCCC(=O)O")), cis:molOf(mk("CCCCCCCCC=CCCCCCCCC(=O)O", 1)), trans:molOf(mk("CCCCCCCCC=CCCCCCCCC(=O)O", 0)) };
  function paintFat(){
    var h = '<div class="si-fgrid" role="group" aria-label="Fatty acid chains">' + s3.items.map(function(it){
      var m = FM[it.id], placed = S.fat[it.id];
      return '<button type="button" class="si-fat" data-fat="' + it.id + '" data-k="fat' + it.id + '" aria-pressed="' + (fsel === it.id) + '"' + (placed ? " disabled" : "") + '><svg viewBox="0 0 300 150" role="img" aria-label="' + esc(MV.plain(it.t)) + ' 18-carbon chain">' + skelSVG(m, 300, 150, { hiDbl:true, smax:20 }) + "</svg><span><strong>" + it.t + "</strong> m.p. " + degTxt(FATS[it.id]) + (placed ? " ✓" : "") + "</span></button>";
    }).join("") + "</div>";
    h += (fmsg ? MV.fbHTML(fmsg.k, fmsg.h) : "") + '<div class="si-bins">' + s3.bins.map(function(bn){
      var inside = s3.items.filter(function(it){ return S.fat[it.id] === bn.id; });
      return '<button type="button" class="si-bin" data-bin="' + bn.id + '" data-k="bin' + bn.id + '"><strong>' + bn.label + '</strong><span class="si-in">' + inside.map(function(it){ return '<span class="chip-in txt">' + it.t + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(fatBox, function(){ fatBox.innerHTML = h; });
  }
  fatBox.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.fat) { fsel = fsel === b.dataset.fat ? null : b.dataset.fat; fmsg = null; paintFat(); return; }
    if (b.dataset.bin) {
      if (!fsel) { fmsg = { k:"", h:"Tap a chain first, then tap where it belongs." }; paintFat(); return; }
      var it = s3.items.filter(function(x){ return x.id === fsel; })[0];
      if (b.dataset.bin === MV.ans(it)) { S.fat[it.id] = b.dataset.bin; fmsg = { k:"good", h:"<strong>✓ " + it.t + ".</strong> " + it.why }; fsel = null; api.save(); }
      else fmsg = { k:"bad", h:"<strong>✗ Not that one.</strong> Compare its melting point with room temperature, about 20 °C. Try the other box." };
      paintFat(); MV.focusFb(fatBox);
    }
  });
  paintZoom(); paintEff(); paintFat();
}

// ---------- Practice 2: Isomer puzzles (number entry + choices; from SCH4U 07's reasonAct) ----------
function puzAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow si-numrow"><label for="ri-' + it.id + '">Your answer:</label><input class="numin" id="ri-' + it.id + '" data-rin="' + it.id + '" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="si-unit">' + it.unit + "</span></div>";
    else h += '<div class="chips" role="radiogroup" aria-label="Choices" style="margin-top:10px">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + (it.kind === "chips" ? it.options[x.pick].why || "" : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "" : "bad", msgs[it.id].bad ? msgs[it.id].bad : "<strong>✗ Not quite.</strong> " + msgs[it.id].fb + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    if (it.kind === "num") {
      var v = MV.parseNum(String(x.val || "").replace(/isomers?\s*$/i, "").replace(/\s+/g, ""));
      if (!v || v.length !== 1) return { bad:"Enter one whole number." };
      if (Math.abs(v[0] - MV.ans(it)) < 1e-9) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return Math.abs(v[0] - z.match) < 1e-9; })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.rin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rin) { var b = host.querySelector('[data-k="' + e.target.dataset.rin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { bad:r.bad }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { fb:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Isomer family (nine cards; line structures, each with a 3D model to turn) ----------
// pts: carbon positions in a 120 × 90 box; d: double bond [i, j]; ring: closed polygon
var CARDS = [
  { n:1, mol:"cis", smi:["CC=CC", 1], pts:[[28, 22], [44, 54], [76, 54], [92, 22]], d:[1, 2], dside:1 },
  { n:2, mol:"trans", smi:["CC=CC", 0], pts:[[16, 62], [44, 46], [72, 62], [100, 46]], d:[1, 2] },
  { n:3, mol:"trans", smi:["CC=CC", 0], pts:[[104, 30], [76, 46], [48, 30], [20, 46]], d:[1, 2] },
  { n:4, mol:"but1", smi:["C=CCC"], pts:[[16, 62], [44, 46], [72, 62], [100, 46]], d:[0, 1] },
  { n:5, mol:"mp", smi:["C=C(C)C"], pts:[[60, 18], [60, 48], [34, 64], [86, 64]], d:[0, 1], bonds:[[0, 1], [1, 2], [1, 3]] },
  { n:6, mol:"cb", smi:["C1CCC1"], pts:[[40, 26], [80, 26], [80, 66], [40, 66]], ring:true },
  { n:7, mol:"mcp", smi:["CC1CC1"], pts:[[30, 64], [62, 64], [46, 36], [92, 50]], bonds:[[0, 1], [1, 2], [2, 0], [1, 3]] },
  { n:8, mol:"butane", smi:["CCCC"], pts:[[16, 62], [44, 46], [72, 62], [100, 46]] },
  { n:9, mol:"but1", smi:["CCC=C"], pts:[[16, 62], [44, 46], [72, 62], [100, 46]], d:[2, 3] }
];
var FAM = { but1:"but-1-ene", mp:"2-methylpropene", cb:"cyclobutane", mcp:"methylcyclopropane" };
function cardSVG(c){
  var P = c.pts, B = c.bonds || (c.ring ? [[0, 1], [1, 2], [2, 3], [3, 0]] : [[0, 1], [1, 2], [2, 3]]), out = "", cx = 0, cy = 0;
  P.forEach(function(p){ cx += p[0] / P.length; cy += p[1] / P.length; });
  B.forEach(function(b){
    var p = P[b[0]], q = P[b[1]]; out += Ln(p[0], p[1], q[0], q[1], { w:2.6 });
    if (c.d && ((b[0] === c.d[0] && b[1] === c.d[1]) || (b[0] === c.d[1] && b[1] === c.d[0]))) {
      var dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), nx = -dy / l * 6, ny = dx / l * 6, mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      if (nx * (cx - mx) + ny * (cy - my) < 0) { nx = -nx; ny = -ny; }
      out += Ln(p[0] + nx + dx * 0.14, p[1] + ny + dy * 0.14, q[0] + nx - dx * 0.14, q[1] + ny - dy * 0.14, { w:2.6 });
    }
  });
  return '<svg viewBox="0 0 120 84" aria-hidden="true">' + out + "</svg>";
}
var task = (function(){
  var S = null, api = null, V = null, CM = {};
  function cm(c){ return CM[c.n] || (CM[c.n] = molOf(mk(c.smi[0], c.smi[1]))); }
  function read(){ return { sel:(Array.isArray(S && S.sel) ? S.sel : []).filter(function(n){ return n >= 1 && n <= 9; }).slice(0, 3).sort(function(a, b){ return a - b; }) }; }
  function has(d, n){ return d.sel.indexOf(n) >= 0; }
  function paint(note){
    var d = read(), inp = $("#si-tkcards");
    MV.keepFocus(inp, function(){ inp.innerHTML = CARDS.map(function(c){ var on = has(d, c.n); return '<div class="si-tk"><button type="button" class="si-tc" data-tc="' + c.n + '" data-k="tc' + c.n + '" aria-pressed="' + on + '" aria-label="Card ' + c.n + (on ? ", chosen" : "") + '">' + cardSVG(c) + "<span>Card " + c.n + (on ? " ✓" : "") + '</span></button><button type="button" class="btn ghost sm si-t3" data-t3="' + c.n + '" data-k="t3' + c.n + '" aria-label="Turn card ' + c.n + '’s 3D model">3D</button></div>'; }).join(""); });
    $("#si-tkmsg").innerHTML = note || "";
    $("#si-tkread").innerHTML = MV.readoutHTML([["Chosen cards", d.sel.length ? d.sel.join(", ") : '<span class="muted">none yet</span>'], ["Cards chosen", d.sel.length + " of 3"]]);
  }
  function show3(n){
    var c = CARDS[n - 1], m = cm(c); S.v3 = n;
    $("#si-tk3cap").textContent = "Card " + n + "’s model. Drag it or use the arrow keys to turn it.";
    V.show(scene3(m), { aria:"3D model of the molecule on card " + n + "." });
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (!Array.isArray(S.sel)) S.sel = [];
      inp.innerHTML = '<p class="si-lab">Tap a card to choose it (exactly three). Press 3D to turn a card’s model.</p><div class="si-tkcards" id="si-tkcards" role="group" aria-label="Molecule cards"></div><p class="si-tkmsg" id="si-tkmsg" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="si-h4">3D model</h4><div id="si-tk3"></div><p class="tiny muted" id="si-tk3cap" aria-live="polite"></p><dl class="read" id="si-tkread" aria-live="polite"></dl>';
      V = view3d($("#si-tk3"), { w:380, h:260 });
      $("#si-tkcards").addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.t3) { show3(+b.dataset.t3); api.save(); return; }
        var n = +b.dataset.tc, d = read(), note = "";
        if (has(d, n)) S.sel = d.sel.filter(function(x){ return x !== n; });
        else if (d.sel.length >= 3) note = "You’ve chosen three cards. Tap a chosen card to take it out first.";
        else S.sel = d.sel.concat([n]);
        api.save(); paint(note); api.update();
      });
      paint(); show3(S.v3 >= 1 && S.v3 <= 9 ? S.v3 : 1);
    },
    read:read,
    valid:function(d){ return d.sel.length === 3 ? true : "Choose exactly three cards (you have " + d.sel.length + ")."; },
    checks:function(d){
      var three = d.sel.length === 3;
      return [three && !has(d, 8), three && has(d, 1) && (has(d, 2) || has(d, 3)), three && d.sel.some(function(n){ return [4, 5, 6, 7, 9].indexOf(n) >= 0; }), three && !(has(d, 2) && has(d, 3)) && !(has(d, 4) && has(d, 9))];
    },
    key:function(d){ var t = d.sel.filter(function(n){ return n > 3; })[0]; return t ? CARDS[t - 1].mol : null; },
    label:function(k){ return "cis- and trans-but-2-ene + " + (FAM[k] || k); },
    text:function(k){ return "cis- and trans-but-2-ene + " + (FAM[k] || k); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ puz:puzAct },
  task:task
});
})();
