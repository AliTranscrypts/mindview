// SCH4U 05 Carboxylic Acids and Esters: hero (ethanoic acid + ethanol → ethyl ethanoate + water), Esterification station
// (Explore: C1 esterStage with C3 step-through, name halves, scent card, Reverse mode for hydrolysis and saponification,
// Properties bars), Acids in the kitchen (Part 3: conductivity + particle zoom, H-bonded pairs + data, soap stepper),
// "Predict and reverse" chips, "Balanced flavour" task (acid / alcohol chips + C2 name chips).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function degC(v){ return MV.chem.fx(v, 0) + " °C"; }
function muted(t){ return '<span class="muted">' + t + "</span>"; }

// ---------- the shelf (plan §4 Explore) ----------
// R = the acid's group on the C=O carbon, written left of it; for an alcohol, the alkyl group written right of its O.
var ACIDS = [
  { id:"methanoic", nm:"methanoic acid", common:"formic acid", n:1, R:"H", st:"methanoate", cond:"HCOOH" },
  { id:"ethanoic", nm:"ethanoic acid", common:"acetic acid", n:2, R:"CH3", st:"ethanoate", cond:"CH3COOH" },
  { id:"propanoic", nm:"propanoic acid", n:3, R:"CH3CH2", st:"propanoate", cond:"CH3CH2COOH" },
  { id:"butanoic", nm:"butanoic acid", common:"butyric acid", n:4, R:"CH3CH2CH2", st:"butanoate", cond:"CH3CH2CH2COOH" },
  { id:"pentanoic", nm:"pentanoic acid", common:"valeric acid", n:5, R:"CH3(CH2)3", st:"pentanoate", cond:"CH3(CH2)3COOH" },
  { id:"benzoic", nm:"benzoic acid", n:7, R:"C6H5", st:"benzoate", cond:"C6H5COOH", aro:true }
];
var ALCS = [
  { id:"methanol", nm:"methanol", n:1, R:"CH3", yl:"methyl", cond:"CH3OH" },
  { id:"ethanol", nm:"ethanol", n:2, R:"CH2CH3", yl:"ethyl", cond:"CH3CH2OH" },
  { id:"propan-1-ol", nm:"propan-1-ol", n:3, R:"CH2CH2CH3", yl:"propyl", cond:"CH3CH2CH2OH" },
  { id:"propan-2-ol", nm:"propan-2-ol", n:3, R:"CH(CH3)2", yl:"1-methylethyl", cond:"CH3CH(OH)CH3", br:true, sec:true },
  { id:"butan-1-ol", nm:"butan-1-ol", n:4, R:"CH2CH2CH2CH3", yl:"butyl", cond:"CH3CH2CH2CH2OH" },
  { id:"pentan-1-ol", nm:"pentan-1-ol", n:5, R:"(CH2)4CH3", yl:"pentyl", cond:"CH3(CH2)4OH" },
  { id:"3-methylbutan-1-ol", nm:"3-methylbutan-1-ol", n:5, R:"CH2CH2CH(CH3)2", yl:"3-methylbutyl", cond:"(CH3)2CHCH2CH2OH", br:true },
  { id:"octan-1-ol", nm:"octan-1-ol", n:8, R:"(CH2)7CH3", yl:"octyl", cond:"CH3(CH2)7OH" }
];
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function acidOf(id){ return byId(ACIDS, id); }
function alcOf(id){ return byId(ALCS, id); }

// Module data table (plan §4 Explore and §6 risk 1): boiling points (°C) and model scents. These are course table
// additions: MV.chem.data.bp holds only hydrocarbons, so they're defined here until the shared table absorbs them.
// Local addition, not in this plan's list: pentan-1-ol 138 °C (the value module 03 uses), for the 88 g/mol comparison.
// Ethyl ethanoate's "sweet, fruity" comes from the plan's hero storyboard.
var BP = { "methanoic acid":101, "ethanoic acid":118, "propanoic acid":141, "butanoic acid":164, "methyl methanoate":32, "ethyl methanoate":54,
  "methyl ethanoate":57, "ethyl ethanoate":77, "3-methylbutyl ethanoate":142, "propan-1-ol":97, "butan-1-ol":118, "pentan-1-ol":138 };
var SCENT = { "ethyl methanoate":"rum/raspberry", "methyl butanoate":"apple", "ethyl butanoate":"pineapple", "pentyl ethanoate":"pear/banana",
  "3-methylbutyl ethanoate":"banana", "octyl ethanoate":"orange", "methyl benzoate":"fruity/floral", "ethyl ethanoate":"sweet, fruity" };
var MM = MV.chem.data.M;
function molar(c, h, o){ return Math.round(c * MM.C + h * MM.H + o * MM.O); }
function acidF(a){ return a.aro ? { c:7, h:6 } : { c:a.n, h:2 * a.n }; }
function info(acidId, alcId){
  var a = acidOf(acidId), b = alcOf(alcId), nC = a.n + b.n, nH = acidF(a).h + 2 * b.n;
  return { a:a, b:b, name:b.yl + " " + a.st, nC:nC, nH:nH, f:"C" + nC + "H" + nH + "O2", M:molar(nC, nH, 2), cond:a.R + "COO" + b.R };
}
// Same-mass comparisons for Properties mode, keyed by the ester's carbon count (aliphatic esters only)
var TRIO = { 2:{ acid:"ethanoic", alc:"propan-1-ol", ex:["methanoic", "methanol"] }, 3:{ acid:"propanoic", alc:"butan-1-ol", ex:["methanoic", "ethanol"] },
  4:{ acid:"butanoic", alc:"pentan-1-ol", ex:["ethanoic", "ethanol"] } };
// Reverse mode: esters from the module data table
var REV = [["methanoic", "methanol"], ["methanoic", "ethanol"], ["ethanoic", "methanol"], ["ethanoic", "ethanol"], ["butanoic", "methanol"], ["butanoic", "ethanol"],
  ["ethanoic", "pentan-1-ol"], ["ethanoic", "3-methylbutan-1-ol"], ["ethanoic", "octan-1-ol"], ["benzoic", "methanol"]];
function bpTxt(nm){ return BP[nm] != null ? degC(BP[nm]) : muted("not in the data table"); }
function scentTxt(nm){ return SCENT[nm] ? SCENT[nm] : muted("not listed in the module table"); }

// @component radioGroup (from MHF4U 25, via SCH4U 01–03) — segmented control or chip row as a real radio group (arrow keys,
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

// @component C1 esterStage — semi-structural reaction stage for acid + alcohol ⇌ ester + water. R groups are condensed
// labels; the –COOH and HO– groups are atoms (C ink, O magenta, H ink-2) with the C=O drawn. A scene holds nodes, bonds
// (double, or H-bonds as violet dotted lines), glows, bond highlights, ¹⁸O rings, charges, part underlines (acid teal,
// alcohol blue, each labelled in words) and tags; scenes morph by id. Wide (one row) or stacked (acid over alcohol)
// layout, chosen from the box width. Kinds: "build", "acid" (hydrolysis), "base" (saponification): 4 frames each;
// "hero": 5 frames; "ester": 1 frame.
//   ES.frames(acid, alc, kind, {stacked, heavy, labels}) -> [scene]    ES.pick(acid, alc, kind, boxWidth, opts) -> [scene]
//   ES.stage(svg, {maxScale, dur, pause}) -> {load(seq), show(i), play(from, to, onStep(i), done), cancel(), busy(), index()}
//   ES.sc() · ES.put(s, id, label, el, [x, y]) · ES.bond(s, a, b, order, hb) · ES.svg(scene) · ES.mix(A, B, t) · ES.bbox([scene]) · ES.tsp · ES.hw
var ES = (function(){
  var FS = 20, B = 22, GAP = 24, HH = 11, LFS = 13;
  var COL = { C:"var(--at-c)", O:"var(--at-o)", H:"var(--ink-2)", R:"var(--ink)", Na:"var(--at-m)", P:"var(--ink-2)" };
  function tw(t, fs){
    var w = 0, prev = "";
    String(t).replace(/\^[+\-−]|\d+|[\s\S]/g, function(s){
      if (s.charAt(0) === "^" && s.length > 1) w += 0.42 * fs;
      else if (/^\d/.test(s)) w += s.length * (/[A-Za-z)]$/.test(prev) ? 0.42 : 0.56) * fs;
      else w += (/[A-Z]/.test(s) ? 0.64 : /[a-z]/.test(s) ? 0.5 : /[()]/.test(s) ? 0.34 : s === " " ? 0.28 : 0.56) * fs;
      prev = s; return s;
    });
    return w;
  }
  function hw(t){ return tw(t, FS) / 2 + 1.5; }
  // label text: digits after a letter or ")" become subscripts; "^+" / "^−" become superscript charges
  function tsp(t, fs){
    var out = "", base = 0, d = fs * 0.3, u = fs * 0.42, prev = "";
    String(t).replace(/\^[+\-−]|\d+|[^\d^]+|\^/g, function(s){
      var dy, body, size = "";
      if (s.charAt(0) === "^" && s.length > 1) { dy = -u - base; base = -u; body = s.charAt(1) === "+" ? "+" : "−"; size = r1(fs * 0.7); }
      else if (/^\d/.test(s) && /[A-Za-z)]$/.test(prev)) { dy = d - base; base = d; body = s; size = r1(fs * 0.72); }
      else { dy = -base; base = 0; body = esc(s); }
      out += "<tspan" + (Math.abs(dy) > 0.01 ? ' dy="' + r1(dy) + '"' : "") + (size ? ' font-size="' + size + '"' : "") + ">" + body + "</tspan>";
      prev = s; return s;
    });
    return out;
  }
  function sc(){ return { n:{}, b:{}, glow:{}, hlb:{}, ring:{}, chg:{}, ul:{}, tag:{} }; }
  function put(s, id, t, el, p, op){ s.n[id] = { t:t, el:el, x:p[0], y:p[1], op:op == null ? 1 : op }; }
  function bond(s, a, b, o, hb){ s.b[a + "|" + b] = { a:a, b:b, o:o || 1, hb:!!hb, op:1 }; }
  function under(s, k, x0, x1, y, col, t){ s.ul[k] = { x0:x0, x1:x1, y:y, col:col, t:t || "", op:1 }; }
  function tag(s, k, t, p, o){ o = o || {}; s.tag[k] = { t:t, x:p[0], y:p[1], col:o.col || "var(--ink)", fs:o.fs || 15, bold:o.bold !== false, op:1 }; }
  function clone(s){ return JSON.parse(JSON.stringify(s)); }
  function shift(s, ids, dx){ ids.forEach(function(id){ if (s.n[id]) s.n[id].x += dx; }); }

  function frames(a, b, kind, o){
    o = o || {};
    var st = !!o.stacked, lab = o.labels !== false, y2 = 96, uy = 22, TEAL = "var(--f3)", BLUE = "var(--pen)";
    var hC = hw("C"), hO = hw("O"), hH = hw("H"), hR = hw(a.R), hRp = hw(b.R), hNa = hw("Na^+");
    var C = [0, 0], R = [-(hR + B + hC), 0], Oc = [0, -42], Oa = [hC + B + hO, 0], Ha = [Oa[0] + hO + B + hH, 0], Hb, Ob, plus0;
    if (!st) { plus0 = [Ha[0] + hH + GAP, 0]; Hb = [plus0[0] + GAP + hH, 0]; Ob = [Hb[0] + hH + B + hO, 0]; }
    else { Ob = [Oa[0], y2]; Hb = [Ob[0] - hO - B - hH, y2]; plus0 = [Hb[0] - hH - GAP, y2]; }
    var Rp = [Ob[0] + hO + B + hRp, Ob[1]], Ob3 = [Oa[0], 0], Rp3 = [Ob3[0] + hO + B + hRp, 0];
    var W2 = st ? [Ha[0] + 36, 46] : [(Ha[0] + Hb[0]) / 2, -68], W3, plus3;
    if (!st) { plus3 = [Rp3[0] + hRp + GAP, 0]; W3 = [plus3[0] + GAP + 38, -8]; }
    else { W3 = [Oa[0] + 8, y2 - 8]; plus3 = [W3[0] - 38 - GAP, y2]; }
    var fromA = "from the acid", fromB = "from the alcohol";
    function water(s, W){ put(s, "Oa", "O", "O", W); put(s, "Ha", "H", "H", [W[0] - 30, W[1] + 16]); put(s, "Hb", "H", "H", [W[0] + 30, W[1] + 16]); bond(s, "Oa", "Ha"); bond(s, "Oa", "Hb"); }
    function acidFrag(s){ put(s, "R", a.R, "R", R); put(s, "C", "C", "C", C); put(s, "Oc", "O", "O", Oc); bond(s, "R", "C"); bond(s, "C", "Oc", 2); }
    function uA(s, x1, t){ under(s, "u1", R[0] - hR, x1, uy, TEAL, lab ? t : ""); }
    function uB(s, x0, x1, y, t){ under(s, "u2", x0, x1, y + uy, BLUE, lab ? t : ""); }
    function heavy(s){ if (o.heavy) s.ring.Ob = 1; }
    // F0 reactants
    var f0 = sc(); acidFrag(f0); put(f0, "Oa", "O", "O", Oa); put(f0, "Ha", "H", "H", Ha); bond(f0, "C", "Oa"); bond(f0, "Oa", "Ha");
    put(f0, "plus0", "+", "P", plus0); put(f0, "Hb", "H", "H", Hb); put(f0, "Ob", "O", "O", Ob); put(f0, "Rp", b.R, "R", Rp); bond(f0, "Hb", "Ob"); bond(f0, "Ob", "Rp");
    uA(f0, Ha[0] + hH, a.nm); uB(f0, Hb[0] - hH, Rp[0] + hRp, Ob[1], b.nm); heavy(f0);
    // F1 the acid's OH and the alcohol's H light up
    var f1 = clone(f0); f1.glow = { Oa:1, Ha:1, Hb:1 };
    // F2 water leaves
    var f2 = sc(); acidFrag(f2); water(f2, W2); put(f2, "Ob", "O", "O", Ob); put(f2, "Rp", b.R, "R", Rp); bond(f2, "Ob", "Rp");
    tag(f2, "w", "H2O", st ? [W2[0] + 74, W2[1] + 8] : [W2[0], W2[1] - 26]);
    uA(f2, C[0] + hC, a.nm); uB(f2, Ob[0] - hO, Rp[0] + hRp, Ob[1], b.nm); heavy(f2);
    // F3 ester + water
    var f3 = sc(); acidFrag(f3); put(f3, "Ob", "O", "O", Ob3); put(f3, "Rp", b.R, "R", Rp3); bond(f3, "C", "Ob"); bond(f3, "Ob", "Rp");
    put(f3, "plus3", "+", "P", plus3); water(f3, W3);
    uA(f3, C[0] + hC, fromA); uB(f3, Ob3[0] - hO, Rp3[0] + hRp, 0, fromB); heavy(f3);
    if (kind === "build") return [f0, f1, f2, f3];
    if (kind === "ester") { var e = clone(f3); ["plus3", "Oa", "Ha", "Hb"].forEach(function(id){ delete e.n[id]; }); delete e.b["Oa|Ha"]; delete e.b["Oa|Hb"]; return [e]; }
    if (kind === "hero") {
      var h0 = clone(f0), D = 30; shift(h0, ["R", "C", "Oc", "Oa", "Ha"], -D); shift(h0, ["Hb", "Ob", "Rp"], D); h0.n.plus0.op = 0;
      h0.ul.u1.x0 -= D; h0.ul.u1.x1 -= D; h0.ul.u2.x0 += D; h0.ul.u2.x1 += D;
      return [h0, f0, f1, f2, f3];
    }
    if (kind === "acid") {
      var r0 = clone(f3), r1_ = clone(f3); r1_.glow = { Oa:1, Ha:1, Hb:1 }; r1_.hlb = { "C|Ob":1 };
      var r2 = clone(f2); r2.ul.u1.t = lab ? fromA : ""; r2.ul.u2.t = lab ? fromB : "";
      return [r0, r1_, r2, clone(f0)];
    }
    // base (saponification): ester + Na⁺ OH⁻ → R–COO⁻ Na⁺ + H–O–R′
    var Na0, Oa0, Hb0, plusB;
    if (!st) { plusB = [Rp3[0] + hRp + GAP, 0]; Na0 = [plusB[0] + GAP + hNa, 0]; }
    else { Na0 = [C[0] + 4, y2]; plusB = [Na0[0] - hNa - GAP, y2]; }
    Oa0 = [Na0[0] + hNa + 12 + hO, Na0[1]]; Hb0 = [Oa0[0] + hO + B + hH, Na0[1]];
    var b0 = sc(); acidFrag(b0); put(b0, "Ob", "O", "O", Ob3); put(b0, "Rp", b.R, "R", Rp3); bond(b0, "C", "Ob"); bond(b0, "Ob", "Rp");
    put(b0, "plus3", "+", "P", plusB); put(b0, "Na", "Na^+", "Na", Na0); put(b0, "Oa", "O", "O", Oa0); put(b0, "Hb", "H", "H", Hb0); bond(b0, "Oa", "Hb"); b0.chg.Oa = 1;
    uA(b0, C[0] + hC, fromA); uB(b0, Ob3[0] - hO, Rp3[0] + hRp, 0, fromB); heavy(b0);
    var b1 = clone(b0); b1.glow = { Oa:1, Hb:1 }; b1.hlb = { "C|Ob":1 };
    var b2 = sc(); acidFrag(b2); put(b2, "Oa", "O", "O", Oa); put(b2, "Hb", "H", "H", Ha); bond(b2, "C", "Oa"); bond(b2, "Oa", "Hb");
    put(b2, "plus0", "+", "P", plus0); put(b2, "Ob", "O", "O", Ob); put(b2, "Rp", b.R, "R", Rp); bond(b2, "Ob", "Rp"); b2.chg.Ob = 1; put(b2, "Na", "Na^+", "Na", W2);
    uA(b2, Ha[0] + hH, fromA); uB(b2, Ob[0] - hO, Rp[0] + hRp, Ob[1], fromB); heavy(b2);
    var NaF = [Oa[0] + hO + 14 + hNa, 0];
    var b3 = sc(); acidFrag(b3); put(b3, "Oa", "O", "O", Oa); bond(b3, "C", "Oa"); b3.chg.Oa = 1; put(b3, "Na", "Na^+", "Na", NaF);
    put(b3, "plus0", "+", "P", plus0); put(b3, "Hb", "H", "H", Hb); put(b3, "Ob", "O", "O", Ob); put(b3, "Rp", b.R, "R", Rp); bond(b3, "Hb", "Ob"); bond(b3, "Ob", "Rp");
    uA(b3, NaF[0] + hNa, "sodium " + a.st); uB(b3, Hb[0] - hH, Rp[0] + hRp, Ob[1], b.nm); heavy(b3);
    return [b0, b1, b2, b3];
  }
  function bbox(list){
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    function inc(a, b, c, d){ x0 = Math.min(x0, a); x1 = Math.max(x1, b); y0 = Math.min(y0, c); y1 = Math.max(y1, d); }
    list.forEach(function(s){
      Object.keys(s.n).forEach(function(k){ var n = s.n[k], h = hw(n.t); inc(n.x - h, n.x + h + (s.chg[k] ? 6 : 0), n.y - HH - (s.ring[k] ? 30 : s.chg[k] ? 14 : 0), n.y + HH); if (s.glow[k] || s.ring[k]) inc(n.x - 16, n.x + 16, n.y - 16, n.y + 16); });
      Object.keys(s.ul).forEach(function(k){ var u = s.ul[k], m = (u.x0 + u.x1) / 2, lw = tw(u.t, LFS) / 2; inc(Math.min(u.x0, m - lw), Math.max(u.x1, m + lw), u.y - 3, u.y + (u.t ? 24 : 4)); });
      Object.keys(s.tag).forEach(function(k){ var g = s.tag[k], w = tw(g.t, g.fs) / 2; inc(g.x - w, g.x + w, g.y - 11, g.y + 11); });
    });
    return { x0:x0, x1:x1, y0:y0, y1:y1 };
  }
  function seg(A, Bn, pad, pa, pb){
    var dx = Bn.x - A.x, dy = Bn.y - A.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, ha = hw(A.t), hb = hw(Bn.t);
    var ta = Math.max(Math.min(ux ? ha / Math.abs(ux) : 1e9, uy ? HH / Math.abs(uy) : 1e9) + pad, pa || 0), tb = Math.max(Math.min(ux ? hb / Math.abs(ux) : 1e9, uy ? HH / Math.abs(uy) : 1e9) + pad, pb || 0);
    return { ax:A.x + ux * ta, ay:A.y + uy * ta, bx:Bn.x - ux * tb, by:Bn.y - uy * tb, ux:ux, uy:uy, ok:ta + tb < L - 2 };
  }
  function opA(op){ return op < 0.99 ? ' opacity="' + r1(op) + '"' : ""; }
  function svgOf(s){
    var out = "", N = s.n;
    Object.keys(s.hlb).forEach(function(k){ var op = s.hlb[k], p = k.split("|"), A = N[p[0]], Bn = N[p[1]]; if (op < 0.02 || !A || !Bn) return;
      out += '<line x1="' + r1(A.x) + '" y1="' + r1(A.y) + '" x2="' + r1(Bn.x) + '" y2="' + r1(Bn.y) + '" stroke="var(--hi)" stroke-width="18" stroke-linecap="round"' + opA(op * 0.85) + "/>"; });
    Object.keys(s.glow).forEach(function(k){ var op = s.glow[k], n = N[k]; if (!n || op * n.op < 0.02) return;
      out += '<circle cx="' + r1(n.x) + '" cy="' + r1(n.y) + '" r="15" fill="var(--hi)" stroke="var(--hi-ink)" stroke-width="1.2"' + opA(op * n.op * 0.9) + "/>"; });
    Object.keys(s.b).forEach(function(k){
      var b = s.b[k], A = N[b.a], Bn = N[b.b]; if (!A || !Bn) return;
      var op = Math.min(b.op, A.op, Bn.op); if (op < 0.02) return;
      var g = seg(A, Bn, b.hb ? 4 : 1.5, (s.ring[b.a] || 0) > 0.5 ? 16 : 0, (s.ring[b.b] || 0) > 0.5 ? 16 : 0); if (!g.ok) return;
      (b.o === 2 ? [-3.4, 3.4] : [0]).forEach(function(d){
        out += '<line x1="' + r1(g.ax - g.uy * d) + '" y1="' + r1(g.ay + g.ux * d) + '" x2="' + r1(g.bx - g.uy * d) + '" y2="' + r1(g.by + g.ux * d) + '" stroke="' + (b.hb ? "var(--e-pair)" : "var(--ink)") + '" stroke-width="' + (b.hb ? 3.2 : 2.2) + '" stroke-linecap="round"' + (b.hb ? ' stroke-dasharray="0.5 6"' : "") + opA(op) + "/>";
      });
    });
    Object.keys(s.ring).forEach(function(k){ var op = s.ring[k], n = N[k]; if (!n || op < 0.02) return;
      out += '<circle cx="' + r1(n.x) + '" cy="' + r1(n.y) + '" r="15" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"' + opA(op) + '/><text x="' + r1(n.x) + '" y="' + r1(n.y - 28) + '" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="var(--ink)"' + opA(op) + ">¹⁸O</text>"; });
    Object.keys(N).forEach(function(k){ var n = N[k]; if (n.op < 0.02) return;
      out += '<text x="' + r1(n.x) + '" y="' + r1(n.y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + FS + '" font-weight="' + (n.el === "O" || n.el === "Na" ? 700 : 400) + '" fill="' + (COL[n.el] || "var(--ink)") + '"' + opA(n.op) + ">" + tsp(n.t, FS) + "</text>"; });
    Object.keys(s.chg).forEach(function(k){ var op = s.chg[k], n = N[k]; if (!n || op * n.op < 0.02) return;
      out += '<text x="' + r1(n.x + hw(n.t) - 1) + '" y="' + r1(n.y - 17) + '" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="var(--ink)"' + opA(op * n.op) + ">−</text>"; });
    Object.keys(s.ul).forEach(function(k){ var u = s.ul[k]; if (u.op < 0.02) return;
      out += '<line x1="' + r1(u.x0) + '" y1="' + r1(u.y) + '" x2="' + r1(u.x1) + '" y2="' + r1(u.y) + '" stroke="' + u.col + '" stroke-width="4" stroke-linecap="round"' + opA(u.op) + "/>";
      if (u.t) out += '<text x="' + r1((u.x0 + u.x1) / 2) + '" y="' + r1(u.y + 15) + '" text-anchor="middle" dominant-baseline="central" font-size="' + LFS + '" fill="var(--ink)"' + opA(u.op) + ">" + esc(u.t) + "</text>"; });
    Object.keys(s.tag).forEach(function(k){ var g = s.tag[k]; if (g.op < 0.02) return;
      out += '<text x="' + r1(g.x) + '" y="' + r1(g.y) + '" text-anchor="middle" dominant-baseline="central" font-size="' + g.fs + '" font-weight="' + (g.bold ? 700 : 400) + '" fill="' + g.col + '"' + opA(g.op) + ">" + tsp(g.t, g.fs) + "</text>"; });
    return out;
  }
  function keys2(a, b){ var k = {}; Object.keys(a).forEach(function(x){ k[x] = 1; }); Object.keys(b).forEach(function(x){ k[x] = 1; }); return Object.keys(k); }
  function mix(A, Bs, t){
    var S = sc();
    keys2(A.n, Bs.n).forEach(function(k){ var a = A.n[k], b = Bs.n[k];
      if (a && b) S.n[k] = { t:t < 0.5 ? a.t : b.t, el:t < 0.5 ? a.el : b.el, x:lerp(a.x, b.x, t), y:lerp(a.y, b.y, t), op:lerp(a.op, b.op, t) };
      else if (a) S.n[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.n[k] = Object.assign({}, b, { op:b.op * t }); });
    keys2(A.b, Bs.b).forEach(function(k){ var a = A.b[k], b = Bs.b[k]; S.b[k] = Object.assign({}, a || b, { op:a && b ? 1 : a ? 1 - t : t }); });
    ["glow", "hlb", "ring", "chg"].forEach(function(f){ keys2(A[f], Bs[f]).forEach(function(k){ S[f][k] = lerp(A[f][k] || 0, Bs[f][k] || 0, t); }); });
    keys2(A.ul, Bs.ul).forEach(function(k){ var a = A.ul[k], b = Bs.ul[k];
      if (a && b) S.ul[k] = { x0:lerp(a.x0, b.x0, t), x1:lerp(a.x1, b.x1, t), y:lerp(a.y, b.y, t), col:a.col, t:t < 0.5 ? a.t : b.t, op:lerp(a.op, b.op, t) };
      else if (a) S.ul[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.ul[k] = Object.assign({}, b, { op:b.op * t }); });
    keys2(A.tag, Bs.tag).forEach(function(k){ var a = A.tag[k], b = Bs.tag[k];
      if (a && b) S.tag[k] = Object.assign({}, b, { x:lerp(a.x, b.x, t), y:lerp(a.y, b.y, t), op:lerp(a.op, b.op, t) });
      else if (a) S.tag[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.tag[k] = Object.assign({}, b, { op:b.op * t }); });
    return S;
  }
  function pick(a, b, kind, cw, o){
    o = Object.assign({}, o || {}); o.stacked = false;
    var w = frames(a, b, kind, o), bw = bbox(w), ww = bw.x1 - bw.x0 + 24;
    if (cw / ww >= 0.8) return w;
    o.stacked = true;
    var s = frames(a, b, kind, o), bs = bbox(s), ws = bs.x1 - bs.x0 + 24;
    return ws < ww ? s : w;
  }
  function stage(svg, o){
    o = o || {};
    var st = { seq:null, i:0, tok:0, cancel:null, busy:false };
    function setVB(){
      var bb = bbox(st.seq), cw = svg.getBoundingClientRect().width || o.w || 560, pad = 12;
      var w = bb.x1 - bb.x0 + 2 * pad, h = bb.y1 - bb.y0 + 2 * pad, VW = Math.max(w, cw / (o.maxScale || 1.25));
      svg.setAttribute("viewBox", [bb.x0 - pad - (VW - w) / 2, bb.y0 - pad, VW, h].map(r1).join(" "));
    }
    function draw(s){ svg.innerHTML = svgOf(s); }
    function cancel(){ st.tok++; if (st.cancel) { st.cancel(); st.cancel = null; } st.busy = false; }
    return {
      load:function(seq){ cancel(); st.seq = seq; st.i = 0; setVB(); },
      show:function(i){ cancel(); st.i = clamp(i, 0, st.seq.length - 1); draw(st.seq[st.i]); },
      play:function(from, to, onStep, done){
        cancel(); var tok = ++st.tok; st.busy = true; st.i = from; draw(st.seq[from]);
        (function next(k){
          if (tok !== st.tok) return;
          if (k >= to) { st.i = to; st.busy = false; if (done) done(); return; }
          if (onStep) onStep(k + 1);
          st.cancel = MV.tween({ dur:o.dur || 950, step:function(t){ if (tok === st.tok) draw(mix(st.seq[k], st.seq[k + 1], t)); },
            done:function(){ if (tok !== st.tok) return; st.i = k + 1; st.cancel = null; MV.wait(o.pause || 450, function(){ next(k + 1); }); } });
        })(from);
      },
      cancel:cancel, busy:function(){ return st.busy; }, index:function(){ return st.i; }
    };
  }
  return { frames:frames, pick:pick, stage:stage, sc:sc, put:put, bond:bond, svg:svgOf, mix:mix, bbox:bbox, tsp:tsp, hw:hw, tw:tw };
})();

// name halves under a structure: [{t, cls:"alk"|"oate", l}] (blue underline for the alcohol part, teal for the acid part)
function halvesHTML(parts){
  return '<span class="ce-name">' + parts.map(function(p, i){ return '<span class="ce-half ' + p.cls + '" data-h="' + i + '"><strong>' + p.t + "</strong><small>" + p.l + "</small></span>"; }).join('<span class="ce-plus" aria-hidden="true"> </span>') + "</span>";
}
function scentHTML(nm){
  var s = SCENT[nm];
  return '<div class="ce-scent"><svg class="ce-sico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21c-2-3 2-5 0-8s2-5 0-8M12 21c-2-3 2-5 0-8s2-5 0-8M18 21c-2-3 2-5 0-8s2-5 0-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
    "<span>Scent (model): <strong>" + (s || "not listed") + "</strong>" + (s ? "" : '<span class="tiny muted"> No scent for this ester in the module table.</span>') + "</span></div>";
}
function fadeHalves(box, done){
  var hs = $$(".ce-half, .ce-scent", box);
  if (MV.reduceMotion || !hs.length) { if (done) done(); return; }
  hs.forEach(function(h){ h.style.opacity = 0; });
  (function nx(i){ if (i >= hs.length) { if (done) done(); return; } MV.tween({ dur:500, step:function(t){ hs[i].style.opacity = t; }, done:function(){ nx(i + 1); } }); })(0);
}

// @component bpBars — boiling-point columns on a 0–200 °C scale (data bars --pen; the current compound solid, the others
// translucent; a hidden bar shows "?") with HTML labels below (role, name, formula · molar mass, O–H note).
// barsHTML(set:[{role, nm, f, M, v, oh, cur}], W, {vals, hide}) (from SCH4U 03's bpBars, adapted)
function barsHTML(set, W, o){
  o = o || {};
  var H = 214, top = 30, bot = 186, hi = 200, L = 42, n = set.length, cw = (W - L - 6) / n, s = "";
  function Y(v){ return bot - clamp(v, 0, hi) / hi * (bot - top); }
  [0, 50, 100, 150, 200].forEach(function(v){ var y = r1(Y(v)); s += '<line x1="' + L + '" y1="' + y + '" x2="' + (W - 4) + '" y2="' + y + '" stroke="var(' + (v === 0 ? "--ink-2" : "--plot-grid") + ')" stroke-width="' + (v === 0 ? 1.6 : 1) + '"/><text x="' + (L - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="central" font-size="12" fill="var(--ink-2)">' + v + "</text>"; });
  s += '<text x="4" y="12" font-size="12" font-weight="700" fill="var(--ink-2)">°C</text>';
  set.forEach(function(b, i){
    var v = o.vals && o.vals[i] != null ? o.vals[i] : b.v, cx = L + cw * (i + 0.5), bw = Math.min(56, cw * 0.46);
    if (o.hide === i) { s += '<rect x="' + r1(cx - bw / 2) + '" y="' + top + '" width="' + r1(bw) + '" height="' + (bot - top) + '" rx="5" fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="' + r1(cx) + '" y="' + r1((top + bot) / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="28" font-weight="700" fill="var(--ink)">?</text>'; return; }
    if (v == null) { s += '<text x="' + r1(cx) + '" y="' + r1((top + bot) / 2) + '" text-anchor="middle" font-size="13" fill="var(--ink-2)">no data</text>'; return; }
    var y = Y(v);
    s += '<rect x="' + r1(cx - bw / 2) + '" y="' + r1(y) + '" width="' + r1(bw) + '" height="' + r1(Math.max(2, bot - y)) + '" rx="5" fill="var(--pen)"' + (b.cur ? "" : ' fill-opacity=".45" stroke="var(--pen)" stroke-width="1.5"') + "/>";
    s += '<text x="' + r1(cx) + '" y="' + r1(y - 10) + '" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">' + degC(Math.round(v)) + "</text>";
  });
  var aria = "Boiling points: " + set.map(function(b, i){ var v = o.vals && o.vals[i] != null ? o.vals[i] : b.v; return b.nm + " " + (o.hide === i ? "hidden: make your prediction" : v == null ? "no data" : MV.plain(degC(Math.round(v)))); }).join("; ") + ".";
  var labs = '<div class="ce-blabs" style="padding-left:' + L + "px;grid-template-columns:repeat(" + n + ',minmax(0,1fr))">' + set.map(function(b){ return '<div class="ce-blab' + (b.cur ? " cur" : "") + '"><span class="tiny muted">' + b.role + "</span><strong>" + b.nm + '</strong><span class="tiny">' + F(b.f) + " · " + b.M + " g/mol</span>" + (b.oh ? '<span class="tiny">' + b.oh + "</span>" : "") + "</div>"; }).join("") + "</div>";
  return '<svg class="ce-bsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>" + labs;
}
function acidBar(id, cur){ var a = acidOf(id), f = acidF(a); return { role:"carboxylic acid", nm:a.nm, f:"C" + f.c + "H" + f.h + "O2", M:molar(f.c, f.h, 2), v:BP[a.nm], oh:"O–H: pairs up (2 H-bonds)", cur:cur }; }
function alcBar(id, cur){ var b = alcOf(id); return { role:"alcohol", nm:b.nm, f:"C" + b.n + "H" + (2 * b.n + 2) + "O", M:molar(b.n, 2 * b.n + 2, 1), v:BP[b.nm], oh:"O–H: H-bonds", cur:cur }; }
function esterBar(I, cur){ return { role:"ester", nm:I.name, f:I.f, M:I.M, v:BP[I.name], oh:"no O–H", cur:cur }; }

// ---------- "Find on the shelf": names, older and common forms (course plan §3) ----------
var SYN = {
  "formic acid":["a", "methanoic", "Accepted: formic acid is the common name. Current IUPAC writes it methanoic acid."],
  "acetic acid":["a", "ethanoic", "Accepted: acetic acid is the common name. Current IUPAC writes it ethanoic acid."],
  "butyric acid":["a", "butanoic", "Accepted: butyric acid is the common name. Current IUPAC writes it butanoic acid."],
  "valeric acid":["a", "pentanoic", "Accepted: valeric acid is the common name. Current IUPAC writes it pentanoic acid."],
  "methyl alcohol":["b", "methanol", "Accepted: methyl alcohol is the common name. Current IUPAC writes it methanol."],
  "ethyl alcohol":["b", "ethanol", "Accepted: ethyl alcohol is the common name. Current IUPAC writes it ethanol."],
  "1-propanol":["b", "propan-1-ol"], "n-propanol":["b", "propan-1-ol"], "propyl alcohol":["b", "propan-1-ol"],
  "2-propanol":["b", "propan-2-ol"], "isopropanol":["b", "propan-2-ol", "iso"], "isopropyl alcohol":["b", "propan-2-ol", "iso"], "isopropyl":["b", "propan-2-ol", "iso"],
  "1-butanol":["b", "butan-1-ol"], "n-butanol":["b", "butan-1-ol"], "butyl alcohol":["b", "butan-1-ol"],
  "1-pentanol":["b", "pentan-1-ol"], "n-pentanol":["b", "pentan-1-ol"], "pentyl alcohol":["b", "pentan-1-ol"],
  "3-methyl-1-butanol":["b", "3-methylbutan-1-ol"], "isoamyl alcohol":["b", "3-methylbutan-1-ol"], "isopentyl alcohol":["b", "3-methylbutan-1-ol"],
  "1-octanol":["b", "octan-1-ol"], "n-octanol":["b", "octan-1-ol"], "octyl alcohol":["b", "octan-1-ol"]
};
function findName(str){
  var q = String(str || "").toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ").trim(), i;
  if (!q) return { msg:"Type the name of an acid or an alcohol." };
  for (i = 0; i < ACIDS.length; i++) if (q === ACIDS[i].nm || q === ACIDS[i].nm.replace(" acid", "")) return { k:"a", id:ACIDS[i].id, msg:"Found " + ACIDS[i].nm + " on the shelf." };
  for (i = 0; i < ALCS.length; i++) if (q === ALCS[i].nm) return { k:"b", id:ALCS[i].id, msg:"Found " + ALCS[i].nm + " on the shelf." };
  var s = SYN[q];
  if (s) { var nm = s[0] === "a" ? acidOf(s[1]).nm : alcOf(s[1]).nm;
    return { k:s[0], id:s[1], msg:s[2] === "iso" ? "Accepted. Current IUPAC writes it propan-2-ol. In an ester, its part is named 1-methylethyl (the common form is isopropyl)." : s[2] || "Accepted. Current IUPAC writes it " + nm + "." }; }
  if (/^3-methylbutanoic( acid)?$/.test(q)) return { msg:"3-methylbutanoic acid isn’t on the shelf. The 3-methylbutyl part comes from the alcohol.", miss:true };
  if (/yl [a-z0-9,\-]*oate$/.test(q)) return { msg:"That’s an ester name. Find its two parts on the shelf: the -yl word is the alcohol, the -oate word is the acid." };
  if (/oic( acid)?$/.test(q)) return { msg:q.replace(/( acid)?$/, " acid") + " isn’t on the shelf. The shelf has methanoic, ethanoic, propanoic, butanoic, pentanoic and benzoic acid." };
  if (/ol$/.test(q)) return { msg:q + " isn’t on the shelf. The shelf has methanol, ethanol, propan-1-ol, propan-2-ol, butan-1-ol, pentan-1-ol, 3-methylbutan-1-ol and octan-1-ol." };
  return { msg:"No match on the shelf. Type an acid (for example, propanoic acid) or an alcohol (for example, propan-1-ol)." };
}

// ---------- hero: ethanoic acid + ethanol drift together, water pops off, the halves snap, the name builds ----------
var HCAP = ["Ethanoic acid and ethanol drift together.", "Ethanoic acid and ethanol drift together.", "The acid’s –OH and the alcohol’s –H glow…",
  "…and pop off together as a water molecule.", "The pieces snap together through the alcohol’s O: ethyl ethanoate."];
function hero(){
  var svg = $("#ce-hx-svg"), nameEl = $("#ce-hx-name"), cap = $("#ce-hx-cap"), rep = $("#ce-hx-replay");
  if (!svg) return;
  var a = acidOf("ethanoic"), b = alcOf("ethanol"), stg = ES.stage(svg, { maxScale:1.35, dur:1000, pause:380 }), seq = null, lastW = 0, playing = false;
  function build(){ lastW = Math.round(svg.getBoundingClientRect().width) || 440; seq = ES.pick(a, b, "hero", lastW, { labels:false }); stg.load(seq); }
  function names(){ nameEl.innerHTML = halvesHTML([{ t:"ethyl", cls:"alk", l:"from the alcohol" }, { t:"ethanoate", cls:"oate", l:"from the acid" }]) + scentHTML("ethyl ethanoate"); }
  var END = "Ethanoic acid + ethanol → ethyl ethanoate + water. The name is built from two halves: ethyl (from the alcohol) and ethanoate (from the acid).";
  build(); names();
  if (MV.reduceMotion) { stg.show(seq.length - 1); cap.textContent = END; }
  else {
    var play = function(){
      playing = true; rep.hidden = true; names(); $$(".ce-half, .ce-scent", nameEl).forEach(function(h){ h.style.opacity = 0; });
      stg.play(0, seq.length - 1, function(i){ cap.textContent = HCAP[i]; }, function(){ cap.textContent = "Ethyl ethanoate smells sweet and fruity. Its name is built from two halves."; fadeHalves(nameEl, function(){ playing = false; rep.hidden = false; }); });
    };
    cap.textContent = HCAP[0];
    rep.addEventListener("click", play);
    play();
  }
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.round(svg.getBoundingClientRect().width); if (!w || Math.abs(w - lastW) < 24 || playing) return; build(); stg.show(seq.length - 1); }).observe(svg);
}

// ---------- Explore: Esterification station ----------
var CAPS = {
  build:function(I, h){ return ["<strong>" + I.a.nm + "</strong> + <strong>" + I.b.nm + "</strong>: the acid is underlined teal, the alcohol blue. Press <strong>React</strong> to join them.",
    "The acid’s OH and the alcohol’s H light up: they will leave together.",
    "They leave as one water molecule, " + F("H2O") + ". Joining two molecules this way, with water released, is a condensation.",
    "The two pieces join through the alcohol’s O: <strong>" + I.name + "</strong>." + (h ? " The heavy ¹⁸O sits in the ester’s C–O–C link." : "")]; },
  acid:function(I){ return ["<strong>" + I.name + "</strong> + water, with an acid catalyst. Press <strong>Split it</strong>.",
    "Water attacks the ester link: the C–O bond between the C=O side and the O–alkyl side.",
    "The link breaks. Water’s OH goes to the C=O side; its H goes to the O–alkyl side.",
    "Hydrolysis, the reverse of esterification: <strong>" + I.a.nm + "</strong> + <strong>" + I.b.nm + "</strong>."]; },
  base:function(I){ return ["<strong>" + I.name + "</strong> + NaOH, a strong base. Press <strong>Split it</strong>.",
    F("OH-") + " from the base attacks the ester link.",
    "The link breaks: the OH joins the C=O side, and the O–alkyl side leaves as a negative ion.",
    "The new acid part hands its H to the O–alkyl ion, so the acid part ends up as a salt. Saponification: <strong>sodium " + I.a.st + "</strong> (" + F(I.a.R + "COO-") + " " + F("Na+") + ") + <strong>" + I.b.nm + "</strong>."]; }
};
function explore(host, api){
  var S = api.S, C = api.content;
  if (!acidOf(S.acid)) S.acid = "ethanoic";
  if (!alcOf(S.alc)) S.alc = "ethanol";
  if (["build", "rev", "prop"].indexOf(S.mode) < 0) S.mode = "build";
  S.cat = S.cat === "base" ? "base" : "acid"; S.heavy = !!S.heavy; S.done = !!S.done;
  var busy = false, msg = "", hideBp = false, miss = false, seq = null, pl = null, lastW = 0, barW = 0, anim = false, estKey = "", estRG = null, barVals = null;
  host.innerHTML = '<p class="how ce-how">' + C.how + '</p><div class="ce-grid"><div class="ce-left" data-mv="graph"><div class="eq-cap ce-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ce-stage"><div class="ce-stagebox"><svg class="ce-svg" role="img" aria-label="Reaction stage"></svg></div><p class="ce-stepcap" aria-live="polite"></p><div class="ce-player"></div><div class="ce-out" aria-live="polite"></div></div>' +
    '<div class="ce-bars"></div></div>' +
    '<div class="ce-ctrl"><div class="ce-modes"></div>' +
    '<div class="ce-pick"><div class="ce-acids"></div><div class="ce-alcs"></div>' +
    '<label class="ce-heavy"><input type="checkbox" class="ce-hin"> Mark the alcohol’s O as heavy oxygen (¹⁸O)</label>' +
    '<form class="ce-find"><label for="ce-fin">Find on the shelf</label><span class="ce-fr"><input type="text" id="ce-fin" class="ce-fin" autocomplete="off" spellcheck="false" placeholder="e.g. propan-1-ol"><button type="submit" class="btn ghost sm" data-k="cefind">Find</button></span></form></div>' +
    '<div class="ce-revc"><div class="ce-esters"></div><div class="ce-cat"></div></div>' +
    '<div class="ce-propc"><p class="ce-sub">Compare at the same molar mass</p><div class="ce-trio">' + [2, 3, 4].map(function(k){ var I = info(TRIO[k].ex[0], TRIO[k].ex[1]); return '<button type="button" class="btn ghost sm" data-trio="' + k + '" data-k="trio' + k + '">' + I.M + " g/mol: " + I.name + "</button>"; }).join("") + "</div></div>" +
    '<div class="q-actions ce-act"><button type="button" class="btn primary ce-go" data-k="cego">React</button></div><p class="ce-msg" aria-live="polite"></p></div>' +
    '<div class="ce-right"><dl class="read ce-read" aria-live="polite"></dl><div class="ce-tab"></div></div></div>';
  var stg = ES.stage($(".ce-svg", host), { maxScale:1.25 }), goBtn = $(".ce-go", host), hin = $(".ce-hin", host);
  var modeRG = radios($(".ce-modes", host), { label:"Mode", aria:"Station mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; S.done = false; hideBp = false; msg = ""; api.save(); refresh(); } });
  var acidRG = radios($(".ce-acids", host), { label:"Acid", aria:"Acid", cls:"chips", options:ACIDS.map(function(a){ return { id:a.id, t:a.nm }; }), value:S.acid, onChange:function(v){ setPair(v, S.alc); } });
  var alcRG = radios($(".ce-alcs", host), { label:"Alcohol", aria:"Alcohol", cls:"chips", options:ALCS.map(function(b){ return { id:b.id, t:b.nm }; }), value:S.alc, onChange:function(v){ setPair(S.acid, v); } });
  var catRG = radios($(".ce-cat", host), { label:"Split with", aria:"Split with an acid catalyst or a base", options:[{ id:"acid", t:"Acid catalyst" }, { id:"base", t:"Base (NaOH)" }], value:S.cat, onChange:function(v){ S.cat = v; S.done = false; api.save(); refresh(); } });
  hin.checked = S.heavy;
  (function(){
    var names = {}; Object.keys(BP).forEach(function(k){ names[k] = 1; }); Object.keys(SCENT).forEach(function(k){ names[k] = 1; });
    var rows = Object.keys(names).sort(function(x, y){ return (BP[x] == null ? 999 : BP[x]) - (BP[y] == null ? 999 : BP[y]); }).map(function(k){ return [k, BP[k] != null ? MV.chem.fx(BP[k], 0) : "—", SCENT[k] || "—"]; });
    var d = document.createElement("details"); d.className = "chem-tab";
    d.innerHTML = "<summary>Data table: boiling points and scents</summary>" + MV.tableHTML({ head:["Compound", "Boiling point (°C)", "Scent (model)"], rows:rows, caption:"Boiling points and model scents of acids, alcohols and esters" }) +
      '<p class="tiny muted" style="margin:8px 0 0">Course table additions from this module; scents are model values. Pentan-1-ol’s boiling point is the value module 03 uses. — means no value is given.</p>';
    $(".ce-tab", host).appendChild(d);
  })();

  function I(){ return info(S.acid, S.alc); }
  function kind(){ return S.mode === "rev" ? S.cat : "build"; }
  function setPair(a, b, note, keepMiss){
    S.acid = a; S.alc = b; S.done = false; hideBp = false; msg = note || ""; if (!keepMiss) miss = false;
    acidRG.set(a); alcRG.set(b); api.save(); refresh();
  }
  function lock(b){
    [modeRG, acidRG, alcRG, catRG, estRG].forEach(function(r){ if (r) r.lock(b); });
    goBtn.disabled = b; hin.disabled = b;
    $$(".ce-find input, .ce-find button, .ce-trio button", host).forEach(function(x){ x.disabled = b; });
  }
  function killPlayer(){ pl = null; $(".ce-player", host).innerHTML = ""; }
  function makePlayer(i){
    var box = $(".ce-player", host), d = document.createElement("div"), mine = seq; box.innerHTML = ""; box.appendChild(d);
    pl = MV.player(d, { count:mine.length, interval:1300, label:function(k){ return "Step " + (k + 1) + " of " + mine.length; }, render:function(k){ if (mine !== seq || busy) return; stg.show(k); stepCap(k); } });
    if (i) pl.go(i);
  }
  function setVis(){
    var md = S.mode;
    $(".ce-pick", host).hidden = md === "rev"; $(".ce-revc", host).hidden = md !== "rev"; $(".ce-propc", host).hidden = md !== "prop";
    $(".ce-heavy", host).hidden = md !== "build"; $(".ce-stage", host).hidden = md === "prop"; $(".ce-bars", host).hidden = md !== "prop"; $(".ce-act", host).hidden = md === "prop";
  }
  function rebuild(keep){
    if (S.mode === "prop") { stg.cancel(); seq = null; killPlayer(); return; }
    var i = keep && seq ? stg.index() : (S.done ? 99 : 0), hadPl = !!pl;
    lastW = Math.round($(".ce-stagebox", host).getBoundingClientRect().width) || 560;
    seq = ES.pick(I().a, I().b, kind(), lastW, { heavy:S.heavy && S.mode === "build" });
    stg.load(seq); i = clamp(i, 0, seq.length - 1); stg.show(i);
    if (keep && hadPl) makePlayer(i); else if (!keep) { killPlayer(); if (S.done) makePlayer(i); }
  }
  function refresh(){ setVis(); rebuild(); paint(); }
  function stepCap(i){
    if (!seq) return;
    var caps = CAPS[kind()](I(), S.heavy && S.mode === "build"), c = caps[clamp(i, 0, caps.length - 1)];
    $(".ce-stepcap", host).innerHTML = c;
    $(".ce-svg", host).setAttribute("aria-label", "Step " + (i + 1) + " of " + caps.length + ": " + MV.plain(c));
  }
  function paintCap(){
    var x = I(), a = x.a, b = x.b, md = S.mode, e;
    if (md === "build") e = F(a.cond + " + " + b.cond + " <=> ") + (S.done ? F(x.cond + " + H2O") : "?") + ' <span class="ce-capn">(acid catalyst)</span>';
    else if (md === "rev") e = S.cat === "base" ? F(x.cond + " + NaOH -> ") + (S.done ? F(a.R + "COONa + " + b.cond) : "?") : F(x.cond + " + H2O <=> ") + (S.done ? F(a.cond + " + " + b.cond) : "?") + ' <span class="ce-capn">(acid catalyst)</span>';
    else e = F(x.cond) + ' <span class="ce-capn">' + x.name + "</span>";
    $(".ce-cap", host).innerHTML = e;
  }
  function paintOut(){
    var box = $(".ce-out", host), x = I(), h = "";
    if (S.done && S.mode === "build") h = halvesHTML([{ t:x.b.yl, cls:"alk", l:"from the alcohol" }, { t:x.a.st, cls:"oate", l:"from the acid" }]) + scentHTML(x.name);
    else if (S.done && S.mode === "rev") h = halvesHTML([{ t:S.cat === "base" ? "sodium " + x.a.st : x.a.nm, cls:"oate", l:S.cat === "base" ? "the acid part, as a salt" : "the acid part" }, { t:x.b.nm, cls:"alk", l:"the alcohol part" }]);
    box.innerHTML = h;
    if (anim && h) { anim = false; fadeHalves(box); }
  }
  function trioSet(cur){
    var x = I();
    if (x.a.aro || !TRIO[x.nC]) return null;
    var T = TRIO[x.nC];
    return [acidBar(T.acid, false), alcBar(T.alc, false), esterBar(x, true)];
  }
  function paintBars(){
    var box = $(".ce-bars", host), W = Math.round(box.getBoundingClientRect().width) || 560, set = trioSet(), x = I();
    barW = W;
    if (!set) { box.innerHTML = '<p class="ce-sub">Boiling points compared</p><p class="ce-nodata">' + x.name + " is " + F(x.f) + ", " + x.M + " g/mol. The data table has no acid and alcohol of that molar mass. Choose a 60, 74 or 88 g/mol ester (buttons on the right), or build one with 2, 3 or 4 carbons in all.</p>"; return; }
    box.innerHTML = '<p class="ce-sub">Boiling points compared: all ' + x.M + " g/mol</p>" + barsHTML(set, W, { vals:barVals, hide:hideBp ? 2 : null }) +
      '<p class="tiny muted ce-bnote">Same molar mass, so the difference is the forces between the molecules. Acids pair up through two hydrogen bonds; alcohols hydrogen-bond; esters have no O–H.</p>';
  }
  function paintRead(){
    var x = I(), md = S.mode, d = S.done, rows, wait = muted("press React");
    var oate = '<span class="ce-u oate">' + x.a.st + "</span> (the C=O side)", alk = '<span class="ce-u alk">' + x.b.yl + "</span> (the O–alkyl side)";
    var bp = hideBp ? "?" : bpTxt(x.name);
    if (md === "build") rows = [["Ester name", d ? "<strong>" + x.name + "</strong>" : wait], ["Formula", d ? F(x.f) + " · " + x.M + " g/mol" : wait], ["From the acid", d ? oate : wait], ["From the alcohol", d ? alk : wait],
      ["By-product", d ? "1 " + F("H2O") : wait], ["Reaction type", "condensation (esterification)"], ["Scent (model)", d ? scentTxt(x.name) : wait], ["Boiling point", d ? bp : wait]];
    else if (md === "rev") {
      var base = S.cat === "base", sw = muted("press Split it");
      rows = [["Ester name", "<strong>" + x.name + "</strong>"], ["Formula", F(x.f) + " · " + x.M + " g/mol"],
        ["From the acid", oate + (d ? " → " + (base ? "sodium " + x.a.st + ", " + F(x.a.R + "COO-") + " " + F("Na+") + " (a salt)" : x.a.nm) : "")],
        ["From the alcohol", alk + (d ? " → " + x.b.nm : "")], [base ? "Base used" : "Water used", d ? (base ? "1 NaOH" : "1 " + F("H2O")) : sw],
        ["Reaction type", base ? "saponification (base hydrolysis)" : "hydrolysis (acid catalyst)"], ["Scent (model)", scentTxt(x.name)], ["Boiling point", bp]];
    } else rows = [["Ester name", "<strong>" + x.name + "</strong>"], ["Formula", F(x.f) + " · " + x.M + " g/mol"], ["From the acid", oate], ["From the alcohol", alk],
      ["By-product", "1 " + F("H2O")], ["Reaction type", "condensation (esterification)"], ["Scent (model)", scentTxt(x.name)], ["Boiling point", bp]];
    $(".ce-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintEsters(){
    var key = S.acid + "|" + S.alc, opts = REV.map(function(p){ return { id:p[0] + "|" + p[1], t:info(p[0], p[1]).name }; });
    if (!opts.some(function(o){ return o.id === key; })) opts.unshift({ id:key, t:I().name + " (yours)" });
    var k = opts.map(function(o){ return o.id; }).join(",");
    if (k === estKey && estRG) { estRG.set(key); return; }
    estKey = k; var box = $(".ce-esters", host), d = document.createElement("div"); box.innerHTML = ""; box.appendChild(d);
    estRG = radios(d, { label:"Ester", aria:"Ester to split", cls:"chips", options:opts, value:key, onChange:function(v){ var p = v.split("|"); setPair(p[0], p[1]); } });
    if (busy) estRG.lock(true);
  }
  function paint(){
    setVis();
    goBtn.textContent = S.done ? "Replay" : S.mode === "rev" ? "Split it" : "React";
    if (S.mode === "rev") paintEsters();
    paintCap();
    if (S.mode !== "prop") { if (!busy) stepCap(stg.index()); paintOut(); } else paintBars();
    paintRead();
    $(".ce-msg", host).innerHTML = msg;
    MV.changed();
  }
  function go(cb){
    if (busy || !seq) { if (cb) cb(); return; }
    busy = true; killPlayer(); S.done = false; lock(true); paintCap(); paintOut(); paintRead();
    goBtn.textContent = S.mode === "rev" ? "Splitting…" : "Reacting…";
    stg.play(0, seq.length - 1, function(i){ stepCap(i); }, function(){
      busy = false; S.done = true; anim = true; api.save(); lock(false); makePlayer(seq.length - 1); paint();
      if (cb) MV.wait(400, cb);
    });
  }
  goBtn.addEventListener("click", function(){ go(); });
  hin.addEventListener("change", function(){ if (busy) return; S.heavy = hin.checked; api.save(); rebuild(true); paint(); });
  $(".ce-pick", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || e.key !== "Enter" || busy) return;
    e.preventDefault(); b.click(); go();
  });
  $(".ce-revc", host).addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || e.key !== "Enter" || busy) return;
    e.preventDefault(); b.click(); go();
  });
  $(".ce-trio", host).addEventListener("click", function(e){ var b = e.target.closest("[data-trio]"); if (!b || busy) return; var T = TRIO[b.dataset.trio]; setPair(T.ex[0], T.ex[1]); var f = $('[data-k="' + b.dataset.k + '"]', host); if (f) f.focus({ preventScroll:true }); });
  $(".ce-find", host).addEventListener("submit", function(e){
    e.preventDefault(); if (busy) return;
    var r = findName($(".ce-fin", host).value);
    if (r.k === "a") setPair(r.id, S.alc, r.msg); else if (r.k === "b") setPair(S.acid, r.id, r.msg);
    else { msg = r.msg; if (r.miss) miss = true; $(".ce-msg", host).innerHTML = msg; MV.changed(); }
  });
  if (window.ResizeObserver) {
    new ResizeObserver(function(){ var w = Math.round($(".ce-stagebox", host).getBoundingClientRect().width); if (!w || busy || Math.abs(w - lastW) < 24 || S.mode === "prop") return; rebuild(true); }).observe($(".ce-stagebox", host));
    new ResizeObserver(function(){ var w = Math.round($(".ce-bars", host).getBoundingClientRect().width); if (!w || busy || S.mode !== "prop" || Math.abs(w - barW) < 4) return; paintBars(); }).observe($(".ce-bars", host));
  }

  // ---------- predictions ----------
  function setState(o){
    stg.cancel(); busy = false; lock(false); barVals = null;
    S.mode = o.mode; S.acid = o.acid; S.alc = o.alc; S.heavy = !!o.heavy; if (o.cat) S.cat = o.cat; S.done = false; hideBp = !!o.hide; miss = false; msg = "";
    modeRG.set(S.mode); acidRG.set(S.acid); alcRG.set(S.alc); catRG.set(S.cat); hin.checked = S.heavy;
    api.save(); refresh();
  }
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState({ mode:"build", acid:"ethanoic", alc:"ethanol" });
      else if (p.id === "p2") setState({ mode:"build", acid:"ethanoic", alc:"ethanol", heavy:true });
      else if (p.id === "p3") setState({ mode:"prop", acid:"methanoic", alc:"methanol", hide:true });
      else setState({ mode:"rev", acid:"ethanoic", alc:"ethanol", cat:"base" });
    },
    run:function(p, done){
      if (p.id !== "p3") { go(done); return; }
      busy = true; lock(true); hideBp = false;
      var set = trioSet(), from = set[0].v, to = set[2].v;
      MV.tween({ dur:1500, step:function(t){ barVals = [set[0].v, set[1].v, lerp(from, to, t)]; paintBars(); }, done:function(){ barVals = null; busy = false; lock(false); paint(); MV.wait(200, done); } });
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var x = I(), a = x.a, b = x.b, nm = x.name;
    if (id === "tc1") {
      if (a.id === "ethanoic" && b.id === "3-methylbutan-1-ol") return { ok:true };
      if (miss) return { ok:false, msg:"The 3-methylbutyl part comes from the alcohol." };
      if (a.id === "pentanoic" && b.id === "ethanol") return { ok:false, msg:"That makes ethyl pentanoate: the acid part has 5 carbons." };
      if (b.id === "3-methylbutan-1-ol") return { ok:false, msg:"That makes " + nm + ". The 3-methylbutyl part is right; now find the acid that gives ethanoate." };
      if (a.id === "ethanoic") return { ok:false, msg:"That makes " + nm + ". The ethanoate part is right; now find the alcohol that gives 3-methylbutyl." };
      return { ok:false, msg:"That makes " + nm + ". In 3-methylbutyl ethanoate, the -yl word is the alcohol part and the -oate word is the acid part." };
    }
    if (id === "tc2") {
      if (!a.aro && x.nC === 4) return { ok:true };
      if (a.id === "propanoic" && b.id === "ethanol") return { ok:false, msg:"One carbon too many: acid C + alcohol C must total 4." };
      if (a.id === "ethanoic" && b.id === "methanol") return { ok:false, msg:"One carbon short." };
      var dC = x.nC - 4;
      return { ok:false, msg:"That makes " + nm + ", " + MV.plain(F(x.f)) + ": " + (dC > 0 ? dC + " carbon" + (dC > 1 ? "s" : "") + " too many" : -dC + " carbon" + (dC < -1 ? "s" : "") + " short") + ". Acid C + alcohol C must total 4." };
    }
    if (id === "tc3") {
      if (a.id === "propanoic" && b.id === "propan-1-ol") return { ok:true };
      if (a.id === "butanoic" && b.id === "ethanol") return { ok:false, msg:"2 + 4: the parts aren’t equal." };
      if (a.id === "ethanoic" && b.id === "butan-1-ol") return { ok:false, msg:"4 + 2: the parts aren’t equal." };
      if (a.id === "propanoic" && b.id === "propan-2-ol") return { ok:false, msg:"Equal, but the alcohol part is branched." };
      if (x.nC === 6 && !a.aro) return { ok:false, msg:b.n + " + " + a.n + ": the parts aren’t equal." };
      return { ok:false, msg:"That makes " + nm + ", with " + x.nC + " carbons. The ester needs 6." };
    }
    return { ok:false };
  }
  refresh();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// @component C3 mechanismStepper (from SCH4U 02 / 03) — step-through with N13 Play / Step / Back. MV.player is rebuilt in a
// fresh child host for every run (calling MV.player twice on one host doubles its listeners). C3.stepper(host, {steps, onStep(i)}) -> {go(i), get(), count}
var C3 = {
  stepper:function(host, o){
    host.innerHTML = ""; var box = document.createElement("div"); host.appendChild(box);
    var pl = MV.player(box, { count:o.steps.length, interval:1500, render:function(i){ o.onStep(i); }, label:function(i){ return "Step " + (i + 1) + " of " + o.steps.length; } });
    return { go:pl.go, get:pl.get, count:o.steps.length };
  }
};

// ---------- Part 3: Acids in the kitchen ----------
function T(x, y, str, o){ o = o || {}; var fs = o.fs || 18; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + fs + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '">' + ES.tsp(str, fs) + "</text>"; }
function L(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2.2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + "/>"; }
function zig(x0, y0, x1, y1, n, amp){
  var pts = [], Ln = Math.hypot(x1 - x0, y1 - y0) || 1, px = -(y1 - y0) / Ln, py = (x1 - x0) / Ln;
  for (var i = 0; i <= n; i++) { var s = i === 0 ? 0 : (i % 2 ? amp : -amp); pts.push(r1(x0 + (x1 - x0) * i / n + px * s) + "," + r1(y0 + (y1 - y0) * i / n + py * s)); }
  return '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--ink-2)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
}
function kaEthanoic(){ var r = MV.chem.data.Ka.filter(function(x){ return x[0] === "ethanoic acid"; })[0]; return r ? r[2] : null; }
// soap stepper frames (station 3): 0 fat, 1 + OH⁻, 2 glycerol + 3 carboxylate salts, 3 soap at work
var ROWS = [62, 150, 238];
function soapSVG(i){
  var s = "", cx = 330, cy = 150;
  if (i < 3) {
    ROWS.forEach(function(y, k){ s += T(46, y, k === 1 ? "HC" : "H2C", { w:700 }); if (k < 2) s += L(46, y + 13, 46, ROWS[k + 1] - 13); });
  }
  if (i <= 1) ROWS.forEach(function(y){
    s += '<rect x="94" y="' + (y - 50) + '" width="76" height="66" rx="10" fill="var(--hi-soft)" stroke="var(--hi)" stroke-width="1.5"/>';
    s += L(72, y, 99, y) + T(108, y, "O", { w:700, c:"var(--at-o)" }) + L(117, y, 141, y) + T(150, y, "C", { c:"var(--at-c)" });
    s += L(146.6, y - 12, 146.6, y - 26) + L(153.4, y - 12, 153.4, y - 26) + T(150, y - 36, "O", { w:700, c:"var(--at-o)" }) + L(159, y, 172, y) + zig(172, y, 600, y, 18, 7);
    if (i === 1) s += '<path d="M206 ' + (y + 28) + " Q180 " + (y + 30) + " 162 " + (y + 12) + '" fill="none" stroke="var(--ab-oh)" stroke-width="2.4"/><path d="M160 ' + (y + 8) + " l9 3 l-7 6 z\" fill=\"var(--ab-oh)\"/>" + T(228, y + 30, "OH^−", { fs:17, w:700, c:"var(--ab-oh)" });
  });
  if (i === 2) {
    ROWS.forEach(function(y){
      s += L(72, y, 99, y) + T(108, y, "O", { w:700, c:"var(--at-o)" }) + L(117, y, 133, y) + T(142, y, "H", { c:"var(--ink-2)" });
      s += T(214, y, "O", { w:700, c:"var(--at-o)" }) + T(227, y - 11, "−", { fs:17, w:700 }) + L(223, y, 247, y) + T(256, y, "C", { c:"var(--at-c)" });
      s += L(252.6, y - 12, 252.6, y - 26) + L(259.4, y - 12, 259.4, y - 26) + T(256, y - 36, "O", { w:700, c:"var(--at-o)" }) + L(265, y, 278, y) + zig(278, y, 600, y, 14, 7);
      s += T(214, y + 28, "Na^+", { fs:16, w:700, c:"var(--at-m)" });
    });
    s += T(96, 288, "glycerol", { fs:15, w:700 }) + T(430, 288, "3 carboxylate salts: soap", { fs:15, w:700 });
  }
  if (i === 3) {
    s += '<rect x="0" y="0" width="640" height="300" rx="10" fill="var(--info-bg)"/>' + T(600, 24, "water", { fs:15, w:700, a:"end" });
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="66" fill="var(--p-b)" fill-opacity=".22" stroke="var(--p-b)" stroke-width="2"/>' + T(cx, cy, "grease", { fs:16, w:700 });
    for (var k = 0; k < 10; k++) {
      var t = k / 10 * 2 * Math.PI + 0.3, c = Math.cos(t), sn = Math.sin(t);
      s += zig(cx + c * 30, cy + sn * 30, cx + c * 80, cy + sn * 80, 6, 4);
      s += '<circle cx="' + r1(cx + c * 92) + '" cy="' + r1(cy + sn * 92) + '" r="11" fill="var(--f3)"/>' + T(cx + c * 92, cy + sn * 92, "−", { fs:17, w:700, c:"var(--sheet)" });
    }
    [[150, 60], [520, 90], [140, 250], [520, 240], [470, 40]].forEach(function(p){ s += T(p[0], p[1], "Na^+", { fs:15, w:700, c:"var(--at-m)" }); });
    s += T(20, 150, "ionic end (–COO⁻):", { fs:14, w:700, a:"start" }) + T(20, 170, "mixes with water", { fs:14, a:"start" }) + L(138, 160, cx - 92 + 10, cy + 20, { c:"var(--ink-2)", w:1.5, d:"4 3" });
    s += T(626, 270, "long tail: mixes with grease", { fs:14, w:700, a:"end" }) + L(470, 258, cx + 40, cy + 30, { c:"var(--ink-2)", w:1.5, d:"4 3" });
  }
  return s;
}
var SOAPCAP = ["A fat: glycerol joined to three long-chain acids by three ester links (highlighted).",
  "Saponification: a strong base, OH⁻ from NaOH, attacks each of the three ester links.",
  "Each link splits: glycerol (propane-1,2,3-triol) and three carboxylate salts, R–COO⁻ Na⁺. That’s soap.",
  "Soap at work: the ionic end (–COO⁻) mixes with water; the long tail mixes with grease, so the grease can be rinsed away."];
var SOAPARIA = ["A fat: a three-carbon glycerol backbone, each carbon joined through an ester link, O–C(=O), to a long zigzag hydrocarbon tail. The three ester links are highlighted.",
  "The same fat with an OH⁻ ion next to each of the three ester links, with arrows to each C=O carbon.",
  "The products: glycerol, with an O–H on each of its three carbons, and three separate carboxylate ions, each with a negative O, a long tail and a sodium ion beside it.",
  "A grease droplet in water, surrounded by ten soap ions: their long tails point into the grease and their negative ionic ends face the water, with sodium ions nearby."];
// pair pictures (station 2): two molecules apart or paired, H-bonds as violet dotted lines
function pairScene(which, paired){
  var s = ES.sc(), P = ES.put, Bd = ES.bond;
  if (which === "acid") {
    var X = paired ? 148 : 214;
    P(s, "R1", "CH3", "R", [-48, 0]); P(s, "C1", "C", "C", [0, 0]); P(s, "Oc1", "O", "O", [30, -34]); P(s, "Oh1", "O", "O", [30, 34]); P(s, "H1", "H", "H", [66, 34]);
    Bd(s, "R1", "C1"); Bd(s, "C1", "Oc1", 2); Bd(s, "C1", "Oh1"); Bd(s, "Oh1", "H1");
    P(s, "C2", "C", "C", [X, 0]); P(s, "R2", "CH3", "R", [X + 48, 0]); P(s, "Oc2", "O", "O", [X - 30, 34]); P(s, "Oh2", "O", "O", [X - 30, -34]); P(s, "H2", "H", "H", [X - 66, -34]);
    Bd(s, "C2", "R2"); Bd(s, "C2", "Oc2", 2); Bd(s, "C2", "Oh2"); Bd(s, "Oh2", "H2");
    if (paired) { Bd(s, "H1", "Oc2", 1, true); Bd(s, "H2", "Oc1", 1, true); }
  } else if (which === "alc") {
    var Y = paired ? 66 : 106, h1 = ES.hw("CH3CH2CH2"), h2 = ES.hw("CH2CH2CH3");
    P(s, "R1", "CH3CH2CH2", "R", [-(h1 + 22 + 7.6), -34]); P(s, "O1", "O", "O", [0, -34]); P(s, "H1", "H", "H", [0, 8]); Bd(s, "R1", "O1"); Bd(s, "O1", "H1");
    P(s, "H2", "H", "H", [-37.2, Y]); P(s, "O2", "O", "O", [0, Y]); P(s, "R2", "CH2CH2CH3", "R", [7.6 + 22 + h2, Y]); Bd(s, "H2", "O2"); Bd(s, "O2", "R2");
    if (paired) Bd(s, "H1", "O2", 1, true);
  } else {
    var dy = paired ? 84 : 124, dx = 24;
    [[0, 0, "1"], [dx, dy, "2"]].forEach(function(m){
      var x = m[0], y = m[1], k = m[2];
      P(s, "Hf" + k, "H", "H", [x - 37.2, y]); P(s, "C" + k, "C", "C", [x, y]); P(s, "Oc" + k, "O", "O", [x, y - 40]); P(s, "O" + k, "O", "O", [x + 37.2, y]); P(s, "Me" + k, "CH3", "R", [x + 37.2 + 7.6 + 22 + ES.hw("CH3"), y]);
      Bd(s, "Hf" + k, "C" + k); Bd(s, "C" + k, "Oc" + k, 2); Bd(s, "C" + k, "O" + k); Bd(s, "O" + k, "Me" + k);
    });
  }
  return s;
}
var PAIR = { acid:{ nm:"ethanoic acid", hb:2, cap:"Two ethanoic acid molecules pair up: each O–H hydrogen-bonds to the other molecule’s C=O. Two hydrogen bonds hold the pair (a dimer)." },
  alc:{ nm:"propan-1-ol", hb:1, cap:"Two propan-1-ol molecules: the O–H of one hydrogen-bonds to the O of the other. One hydrogen bond per pair." },
  ester:{ nm:"methyl methanoate", hb:0, cap:"No O–H, so nothing to hydrogen-bond with. Only weaker dipole–dipole and London forces hold the two molecules." } };
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.tester = !!S.tester; S.zoom = !!S.zoom; if (!PAIR[S.s2]) S.s2 = "acid"; S.paired = !!S.paired; S.soap = clamp(S.soap || 0, 0, 3);
  var Ka = kaEthanoic(), c0 = 0.10, pct = Math.sqrt(Ka * c0) / c0 * 100, nIon = Math.round(pct), zt = S.zoom ? 1 : 0, busy2 = false, soapRun = 0, stp = null;
  function beakerHTML(k){
    var hcl = k === "hcl";
    return '<figure class="ce-bk" data-bk="' + k + '"><figcaption>' + (hcl ? "Hydrochloric acid, " + F("HCl(aq)") : "Ethanoic acid, " + F("CH3COOH(aq)")) + "<br><span class=\"tiny muted\">0.10 mol/L</span></figcaption>" +
      '<svg class="ce-bksvg" viewBox="0 0 300 250" role="img" aria-label=""></svg><div class="ce-zoom"><svg class="ce-zsvg" viewBox="0 0 260 260" role="img" aria-label=""></svg></div><dl class="read ce-bkread" aria-live="polite"></dl></figure>';
  }
  host.innerHTML = '<div class="part ce-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="q-actions"><button type="button" class="btn primary" data-s1="tester" data-k="s1t"></button><button type="button" class="btn ghost" data-s1="zoom" data-k="s1z"></button></div>' +
    '<div class="ce-beakers">' + beakerHTML("hcl") + beakerHTML("eth") + '</div><p class="tiny muted ce-leg" hidden><span class="ce-key h3o" aria-hidden="true">+</span> H₃O⁺ ion (magenta) · <span class="ce-key an" aria-hidden="true">−</span> negative ion: Cl⁻ or CH₃COO⁻ (teal) · <span class="ce-key mol" aria-hidden="true"></span> a whole molecule that hasn’t ionized</p>' +
    '<details class="alg ce-s1d"><summary>Check it with data</summary><p><em>K</em><sub>a</sub>(ethanoic acid) = ' + MV.chem.sci(Ka) + " (course data table). At 0.10 mol/L, this model gives about " + MV.chem.fx(pct, 1) + "% ionized: about " + nIon + " molecule in every 100. Module 40 shows the calculation. Hydrochloric acid is a strong acid: all 100 molecules ionize.</p><p>" + s1.vinegar + '</p><div class="ce-s1tab"></div></details></div>' +
    '<div class="part ce-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="ce-s2pick"></div><div class="ce-stagebox ce-pairbox"><svg class="ce-psvg" role="img" aria-label=""></svg></div>' +
    '<div class="q-actions"><button type="button" class="btn primary" data-s2="pair" data-k="s2p"></button></div><p class="ce-s2cap" aria-live="polite"></p><dl class="read ce-s2read" aria-live="polite"></dl>' +
    '<details class="alg ce-s2d" open><summary>Check it with data</summary><div class="ce-s2bars"></div></details></div>' +
    '<div class="part ce-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="q-actions"><button type="button" class="btn primary" data-s3="go" data-k="s3go">Saponify: add a strong base and heat</button></div>' +
    '<div class="ce-soapbox"><svg class="ce-soapsvg" viewBox="0 0 640 300" role="img" aria-label=""></svg></div><div class="ce-soapstep"></div><p class="ce-soapcap" aria-live="polite"></p><dl class="read ce-soapread" aria-live="polite"></dl></div>';
  MV.chem.tablePanel($(".ce-s1tab", host), "acid", { title:"Course data table: acid and base constants" });

  // station 1: conductivity + particle zoom
  function bulb(on, bright){
    var s = "";
    if (on && bright) for (var k = 0; k < 8; k++) { var t = k / 8 * 2 * Math.PI, c = Math.cos(t), sn = Math.sin(t); s += L(150 + c * 26, 46 + sn * 26, 150 + c * 36, 46 + sn * 36, { c:"var(--ink-2)", w:2.4 }); }
    s += '<circle cx="150" cy="46" r="20" fill="' + (on ? "var(--hi)" : "var(--sheet)") + '"' + (on && !bright ? ' fill-opacity=".3"' : "") + ' stroke="var(--ink-2)" stroke-width="2"/>';
    s += T(196, 46, on ? (bright ? "bright" : "dim") : "off", { fs:18, w:700, a:"start" });
    return s;
  }
  function beakerSVG(k){
    var hcl = k === "hcl", on = S.tester, s = "";
    s += '<path d="M138 50 H112 V150 M162 50 H188 V150" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>' + '<rect x="106" y="120" width="12" height="96" rx="2" fill="var(--ink-2)"/><rect x="182" y="120" width="12" height="96" rx="2" fill="var(--ink-2)"/>';
    s += '<rect x="64" y="136" width="172" height="102" fill="var(--info-bg)"/><path d="M60 92 V232 Q60 242 70 242 H230 Q240 242 240 232 V92" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/>';
    s += bulb(on, hcl);
    return s;
  }
  function zoomSVG(k, t){
    var hcl = k === "hcl", s = "", ion = {};
    if (hcl) for (var q = 0; q < 100; q++) ion[q] = 1; else for (var j = 0; j < nIon; j++) ion[44 + j * 11] = 1;
    s += '<rect x="1" y="1" width="258" height="258" rx="12" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/>';
    for (var i = 0; i < 100; i++) {
      var cx = 17 + (i % 10) * 25, cy = 17 + Math.floor(i / 10) * 25;
      if (ion[i]) {
        var d = 2 + 4 * t;
        if (!hcl) s += '<circle cx="' + cx + '" cy="' + cy + '" r="15" fill="none" stroke="var(--hi-ink)" stroke-width="1.6" stroke-dasharray="3 2"/>';
        s += '<circle cx="' + r1(cx - d) + '" cy="' + r1(cy - d) + '" r="6.4" fill="var(--ab-h3o)"/>' + T(cx - d, cy - d, "+", { fs:11, w:700, c:"var(--sheet)" });
        s += '<circle cx="' + r1(cx + d) + '" cy="' + r1(cy + d) + '" r="6.4" fill="var(--f3)"/>' + T(cx + d, cy + d, "−", { fs:12, w:700, c:"var(--sheet)" });
      } else s += '<rect x="' + (cx - 9) + '" y="' + (cy - 5) + '" width="18" height="10" rx="5" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.6"/>';
    }
    return s;
  }
  function paint1(){
    $('[data-s1="tester"]', host).textContent = S.tester ? "Switch off the tester" : "Switch on the tester";
    $('[data-s1="zoom"]', host).textContent = S.zoom ? "Hide the particles" : "Zoom to the particles";
    $('[data-s1="tester"]', host).setAttribute("aria-pressed", S.tester); $('[data-s1="zoom"]', host).setAttribute("aria-pressed", S.zoom);
    $$(".ce-bk", host).forEach(function(fig){
      var k = fig.dataset.bk, hcl = k === "hcl", sv = $(".ce-bksvg", fig), zs = $(".ce-zsvg", fig), zb = $(".ce-zoom", fig);
      sv.innerHTML = beakerSVG(k);
      sv.setAttribute("aria-label", (hcl ? "Beaker of 0.10 mol/L hydrochloric acid" : "Beaker of 0.10 mol/L ethanoic acid") + " with two electrodes wired to a bulb. The bulb is " + (S.tester ? (hcl ? "bright." : "dim.") : "off."));
      zb.hidden = !S.zoom;
      if (S.zoom) { zs.innerHTML = zoomSVG(k, zt); zs.setAttribute("aria-label", hcl ? "Particle view: 100 HCl molecules, all 100 ionized into H₃O⁺ and Cl⁻ ions." : "Particle view: 100 ethanoic acid molecules. About " + nIon + " is ionized into H₃O⁺ and CH₃COO⁻ ions (ringed); the other " + (100 - nIon) + " stay whole."); }
      $(".ce-bkread", fig).innerHTML = MV.readoutHTML([["Concentration", "0.10 mol/L"], ["Ionized (model)", S.zoom ? (hcl ? "100 of 100 molecules" : "about " + nIon + " of 100 (" + MV.chem.fx(pct, 1) + "%)") : muted("zoom to the particles")],
        ["Bulb", S.tester ? (hcl ? "<strong>bright</strong>: many ions carry the current" : "<strong>dim</strong>: few ions carry the current") : muted("tester off")]]);
    });
    $(".ce-leg", host).hidden = !S.zoom;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-s1]"); if (!b || busy2) return;
    if (b.dataset.s1 === "tester") { S.tester = !S.tester; api.save(); paint1(); return; }
    S.zoom = !S.zoom; api.save();
    if (S.zoom && !MV.reduceMotion) { busy2 = true; zt = 0; paint1(); MV.tween({ dur:1100, step:function(t){ zt = t; $$(".ce-bk", host).forEach(function(fig){ $(".ce-zsvg", fig).innerHTML = zoomSVG(fig.dataset.bk, t); }); }, done:function(){ busy2 = false; zt = 1; paint1(); } }); }
    else { zt = 1; paint1(); }
  });

  // station 2: hydrogen-bonded pairs
  var pst = ES.stage($(".ce-psvg", host), { maxScale:1.1, dur:1100 }), pbusy = false, pW = 0;
  var pickRG = radios($(".ce-s2pick", host), { label:"Compound", aria:"Compound to pair up", cls:"chips", options:[{ id:"acid", t:"ethanoic acid" }, { id:"alc", t:"propan-1-ol" }, { id:"ester", t:"methyl methanoate" }], value:S.s2,
    onChange:function(v){ S.s2 = v; S.paired = false; api.save(); load2(); paint2(); } });
  function load2(){ pW = Math.round($(".ce-pairbox", host).getBoundingClientRect().width) || 560; pst.load([pairScene(S.s2, false), pairScene(S.s2, true)]); pst.show(S.paired ? 1 : 0); }
  function paint2(){
    var P = PAIR[S.s2];
    $('[data-s2="pair"]', host).textContent = S.paired ? "Pull them apart" : "Pair them up"; $('[data-s2="pair"]', host).disabled = pbusy;
    $(".ce-s2cap", host).innerHTML = S.paired ? P.cap : "Two molecules of " + P.nm + ", apart. Press <strong>Pair them up</strong>.";
    $(".ce-psvg", host).setAttribute("aria-label", "Two " + P.nm + " molecules, " + (S.paired ? "paired. " + MV.plain(P.cap) : "apart."));
    $(".ce-s2read", host).innerHTML = MV.readoutHTML([["O–H groups per molecule", S.s2 === "ester" ? "0" : "1"], ["H-bonds holding a pair", S.paired ? "<strong>" + P.hb + "</strong>" : muted("pair them up")], ["Boiling point (60 g/mol)", degC(BP[P.nm])]]);
    var box = $(".ce-s2bars", host), W = Math.round(box.getBoundingClientRect().width) || 520;
    box.innerHTML = barsHTML([acidBar("ethanoic", S.s2 === "acid"), alcBar("propan-1-ol", S.s2 === "alc"), esterBar(info("methanoic", "methanol"), S.s2 === "ester")], W) + '<p class="tiny muted">All three are 60 g/mol. The acid boils highest: its molecules pair up through two hydrogen bonds.</p>';
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-s2]"); if (!b || pbusy) return;
    if (S.paired) { S.paired = false; api.save(); pst.show(0); paint2(); return; }
    pbusy = true; pickRG.lock(true); paint2();
    pst.play(0, 1, null, function(){ pbusy = false; S.paired = true; api.save(); pickRG.lock(false); paint2(); });
  });

  // station 3: soap stepper
  function paint3(i){
    S.soap = i; api.save();
    var sv = $(".ce-soapsvg", host); sv.innerHTML = soapSVG(i); sv.setAttribute("aria-label", SOAPARIA[i]);
    $(".ce-soapcap", host).innerHTML = SOAPCAP[i];
    $(".ce-soapread", host).innerHTML = MV.readoutHTML([["Ester links", i < 2 ? "3" : "0: all split"], ["Products", i < 2 ? muted("step on") : "1 glycerol + 3 carboxylate salts (soap)"], ["Reaction type", "saponification (base hydrolysis)"]]);
  }
  stp = C3.stepper($(".ce-soapstep", host), { steps:SOAPCAP, onStep:paint3 });
  if (S.soap) stp.go(S.soap);
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-s3]"); if (!b) return;
    var id = ++soapRun;
    (function nx(i){ if (id !== soapRun || (i > 0 && stp.get() !== i - 1)) return; if (i < 4) { stp.go(i); MV.wait(1500, function(){ nx(i + 1); }); } })(0);
  });

  if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.round($(".ce-pairbox", host).getBoundingClientRect().width); if (!w || pbusy || Math.abs(w - pW) < 24) return; load2(); paint2(); }).observe($(".ce-pairbox", host));
  paint1(); load2(); paint2();
}

// ---------- Practice 2: Predict and reverse (chips; from SCH4U 03's predictAct) ----------
function predictAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-pi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="chips ce-pchips" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){
      var on = x.pick === k;
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
    var b = e.target.closest("[data-op]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$("[data-op]", b.parentNode), i = all.indexOf(b), n = all[(i + d + all.length) % all.length]; n.focus(); n.click();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// @component C2 nameChips — ester name from two chip rows (first word: -yl alkyl; second word: -oate), used by the task.
// ---------- Performance task: Balanced flavour ----------
var TACIDS = ["methanoic", "ethanoic", "propanoic", "butanoic", "pentanoic"], TALCS = ["methanol", "ethanol", "propan-1-ol", "butan-1-ol", "pentan-1-ol"];
var task = (function(){
  var S = null, api = null, stg = null, lastW = 0;
  function read(){ return S ? { acid:S.acid || "", alc:S.alc || "", w1:S.w1 || "", w2:S.w2 || "" } : { acid:"", alc:"", w1:"", w2:"" }; }
  function paint(){
    var d = read(), box = $("#ce-tkview"), rd = $("#ce-tkread");
    $("#ce-tkname").innerHTML = "Your name: " + (d.w1 || d.w2 ? "<strong>" + (d.w1 || "___") + " " + (d.w2 || "___") + "</strong>" : muted("choose a word from each row"));
    if (!d.acid || !d.alc) { box.hidden = true; rd.innerHTML = MV.readoutHTML([["Ester", muted("choose an acid and an alcohol")]]); return; }
    var x = info(d.acid, d.alc); box.hidden = false;
    lastW = Math.round(box.getBoundingClientRect().width) || 360;
    var seq = ES.pick(x.a, x.b, "ester", lastW); stg.load(seq); stg.show(0);
    $("#ce-tksvg").setAttribute("aria-label", "Structure of your ester, " + MV.plain(F(x.cond)) + ": the acid part " + MV.plain(F(x.a.R)) + "–C(=O)– underlined teal, from the acid; the alcohol part –O–" + MV.plain(F(x.b.R)) + " underlined blue, from the alcohol.");
    rd.innerHTML = MV.readoutHTML([["Condensed formula", F(x.cond)], ["Formula", F(x.f)], ["Carbons in the acid part", String(x.a.n)], ["Carbons in the alcohol part", String(x.b.n)], ["Carbons in all", "<strong>" + x.nC + "</strong>"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="ce-tk"><div class="ce-tka"></div><div class="ce-tkb"></div><h4 class="ce-h4">Name it</h4><div class="ce-tkw1"></div><div class="ce-tkw2"></div><p id="ce-tkname" class="ce-tkname" aria-live="polite"></p></div>';
      pv.innerHTML = '<h4 class="ce-h4">Your ester</h4><div class="ce-stagebox" id="ce-tkview"><svg class="ce-svg" id="ce-tksvg" role="img" aria-label=""></svg></div><dl class="read" id="ce-tkread" aria-live="polite"></dl>';
      stg = ES.stage($("#ce-tksvg"), { maxScale:1.1 });
      function rg(sel, key, label, opts){ radios($(sel, inp), { label:label, aria:label, cls:"chips", options:opts, value:S[key] || "", onChange:function(v){ S[key] = v; api.save(); paint(); api.update(); } }); }
      rg(".ce-tka", "acid", "Acid", TACIDS.map(function(id){ return { id:id, t:acidOf(id).nm }; }));
      rg(".ce-tkb", "alc", "Alcohol", TALCS.map(function(id){ return { id:id, t:alcOf(id).nm }; }));
      rg(".ce-tkw1", "w1", "First word", TALCS.map(function(id){ var y = alcOf(id).yl; return { id:y, t:y }; }));
      rg(".ce-tkw2", "w2", "Second word", TACIDS.map(function(id){ var s = acidOf(id).st; return { id:s, t:s }; }));
      if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.round($("#ce-tkview").getBoundingClientRect().width); if (w && Math.abs(w - lastW) > 24) paint(); }).observe(pv);
      paint();
    },
    read:read,
    valid:function(d){ if (!d.acid || !d.alc) return "Choose an acid and an alcohol first."; if (!d.w1 || !d.w2) return "Name your ester: choose one word from each name row."; return true; },
    checks:function(d){
      if (!d.acid || !d.alc) return [false, false, false];
      var a = acidOf(d.acid), b = alcOf(d.alc);
      return [a.n + b.n === 6, a.n >= b.n, d.w1 === b.yl && d.w2 === a.st];
    },
    key:function(d){ return alcOf(d.alc).yl + " " + acidOf(d.acid).st; }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ reverse:predictAct },
  task:task
});
})();
