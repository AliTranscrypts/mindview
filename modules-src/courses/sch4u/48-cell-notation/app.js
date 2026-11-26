// SCH4U 48 Cell Notation: hero (a Zn–Cu cell flies apart into its one-line notation), Notation translator (Explore: C10
// in notation mode: Read it / Write it / Fix it, tile builder, parser with named format errors, live cell diagram and
// readout), Batteries and fuel cells (Part 3: three device cards with particle zooms, refuel-or-recharge sort, a Nunavut
// viability judgement), From notation to numbers (custom number and choice items) and One platinum, under a volt (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function r2(v){ return Math.round(v * 100) / 100; }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
var F = MV.chem.f, fx = MV.chem.fx;
function sg(v){ return (v > 0 ? "+" : "") + fx(v, 2); }                 // signed, true minus
function pn(v){ return v < 0 ? "(" + fx(v, 2) + ")" : fx(v, 2); }       // negative values in parentheses
var Ec = "<i>E</i>°<sub>cell</sub>", E0 = "<i>E</i>°";
var uniC = {};
function uni(s){ return uniC[s] || (uniC[s] = MV.plain(F(s))); }        // Unicode text for SVG and aria labels

// @component radioGroup (from MHF4U 25, via SCH4U 01–14) — segmented control or chip row as a real radio group (arrow keys,
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

// ---------- SVG helpers (from SCH4U 14) ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' +
    (o.halo ? ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.2" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function poly(pts, o){ o = o || {}; if (pts.length < 2) return ""; return '<polyline points="' + pts.map(function(p){ return r1(p[0]) + "," + r1(p[1]); }).join(" ") + '" fill="none" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + len * Math.cos(a1)) + " " + r1(y + len * Math.sin(a1)) + " L" + r1(x + len * Math.cos(a2)) + " " + r1(y + len * Math.sin(a2)) + ' Z" fill="' + fill + '"' + opA(op) + "/>";
}
function arrow(x1, y1, x2, y2, c, w, op){ var a = Math.atan2(y2 - y1, x2 - x1); return ln(x1, y1, x2 - 6 * Math.cos(a), y2 - 6 * Math.sin(a), { c:c, w:w || 2, op:op }) + head(x2, y2, a, 10, c, op); }
function grp(h, op, dy){ if (op <= 0) return ""; return "<g" + (dy ? ' transform="translate(0 ' + r1(dy) + ')"' : "") + opA(op) + ">" + h + "</g>"; }

// ===== @component C10 cellModel (notation mode) — half-cell couples with E° from MV.chem.data.E0, species tiles, the
// notation parser with named format errors (one ||; electrodes at the outer ends; | between phases and a comma within one
// solution; Pt only for a half-cell with no metal, at its outer end; the solution next to the bridge), half-reactions,
// the balanced overall reaction and E°cell = E°right − E°left. =====
var D = MV.chem.data;
function e0(k){ for (var i = 0; i < D.E0.length; i++) if (D.E0[i][0] === k) return D.E0[i][1]; console.error("E° missing: " + k); return 0; }
// [id, E0 key, type, reduced form, oxidized form, electrons, word, display name]
var CPD = [
  ["Mg", "Mg^2+ + 2e- -> Mg", "m", "Mg", "Mg2+", 2, "magnesium", "Mg^2+/Mg"],
  ["Al", "Al^3+ + 3e- -> Al", "m", "Al", "Al3+", 3, "aluminium", "Al^3+/Al"],
  ["Zn", "Zn^2+ + 2e- -> Zn", "m", "Zn", "Zn2+", 2, "zinc", "Zn^2+/Zn"],
  ["Fe", "Fe^2+ + 2e- -> Fe", "m", "Fe", "Fe2+", 2, "iron", "Fe^2+/Fe"],
  ["Ni", "Ni^2+ + 2e- -> Ni", "m", "Ni", "Ni2+", 2, "nickel", "Ni^2+/Ni"],
  ["Sn", "Sn^2+ + 2e- -> Sn", "m", "Sn", "Sn2+", 2, "tin", "Sn^2+/Sn"],
  ["Pb", "Pb^2+ + 2e- -> Pb", "m", "Pb", "Pb2+", 2, "lead", "Pb^2+/Pb"],
  ["H", "2H+ + 2e- -> H2", "g", "H2", "H+", 2, "hydrogen", "H^+/H2 (Pt)"],
  ["Cu", "Cu^2+ + 2e- -> Cu", "m", "Cu", "Cu2+", 2, "copper", "Cu^2+/Cu"],
  ["Fe3", "Fe^3+ + e- -> Fe^2+", "i", "Fe2+", "Fe3+", 1, "iron(III)/iron(II)", "Fe^3+/Fe^2+ (Pt)"],
  ["Ag", "Ag+ + e- -> Ag", "m", "Ag", "Ag+", 1, "silver", "Ag^+/Ag"]
];
var CP = {}, CPL = [];
CPD.forEach(function(r){
  var c = { id:r[0], E:e0(r[1]), type:r[2], red:r[3], ox:r[4], n:r[5], word:r[6], name:r[7], pt:r[2] !== "m", cOx:r[0] === "H" ? 2 : 1 };
  if (c.type === "m") { c.left = [c.red, "|", c.ox]; c.right = [c.ox, "|", c.red]; }
  else if (c.type === "g") { c.left = ["Pt", "|", "H2", "|", "H+"]; c.right = ["H+", "|", "H2", "|", "Pt"]; }
  else { c.left = ["Pt", "|", "Fe2+", ",", "Fe3+"]; c.right = ["Fe3+", ",", "Fe2+", "|", "Pt"]; }
  CP[c.id] = c; CPL.push(c.id);
});
// species tiles: formula for MV.chem.f and phase
var SP = {};
[["Mg", "Mg(s)", "s"], ["Mg2+", "Mg^2+(aq)", "aq"], ["Al", "Al(s)", "s"], ["Al3+", "Al^3+(aq)", "aq"], ["Zn", "Zn(s)", "s"], ["Zn2+", "Zn^2+(aq)", "aq"],
 ["Fe", "Fe(s)", "s"], ["Fe2+", "Fe^2+(aq)", "aq"], ["Fe3+", "Fe^3+(aq)", "aq"], ["Ni", "Ni(s)", "s"], ["Ni2+", "Ni^2+(aq)", "aq"], ["Sn", "Sn(s)", "s"],
 ["Sn2+", "Sn^2+(aq)", "aq"], ["Pb", "Pb(s)", "s"], ["Pb2+", "Pb^2+(aq)", "aq"], ["Cu", "Cu(s)", "s"], ["Cu2+", "Cu^2+(aq)", "aq"], ["Ag", "Ag(s)", "s"],
 ["Ag+", "Ag+(aq)", "aq"], ["H2", "H2(g)", "g"], ["H+", "H+(aq)", "aq"], ["Pt", "Pt(s)", "s"]].forEach(function(r){ SP[r[0]] = { f:r[1], ph:r[2] }; });
var SEPS = { "|":1, "||":1, ",":1 };
var ALL_TILES = ["Mg", "Mg2+", "Al", "Al3+", "Zn", "Zn2+", "Fe", "Fe2+", "Fe3+", "Ni", "Ni2+", "Sn", "Sn2+", "Pb", "Pb2+", "Cu", "Cu2+", "Ag", "Ag+", "H2", "H+", "Pt"];
function cleanToks(t){ return Array.isArray(t) ? t.filter(function(x){ return SEPS[x] || SP[x]; }).slice(0, 17) : []; }
function tokH(t){ return t === "||" ? '<span class="cn-dl">||</span>' : SEPS[t] ? t : F(SP[t].f); }
function tokP(t){ return SEPS[t] ? (t === "||" ? "double line" : t === "|" ? "single line" : "comma") : uni(SP[t].f); }
function notP(t){ var s = ""; t.forEach(function(x, i){ s += (i && x !== "," ? " " : "") + (SEPS[x] ? x : uni(SP[x].f)); }); return s; }

var MSG = {
  bridge:"|| must appear exactly once: it is the salt bridge, and every other boundary is a single |.",
  comma:"Only species in the same solution share a comma. Same phase → comma. Different phases → |.",
  barSame:"Both ions are in the same solution: use a comma.",
  feMetal:"There’s no iron metal in Fe³⁺ + e⁻ → Fe²⁺; use Pt.",
  noPt:"No metal in the half-reaction? Add Pt at the outer end.",
  extraPt:"Pt is needed only when a half-cell has no metal of its own.",
  ptInside:"Pt goes at the outer end.",
  outer:"Electrodes go at the outer ends.",
  solBridge:"The solution goes next to the salt bridge, ||.",
  mixed:"Each side is one half-cell: all its species must come from one half-reaction."
};
function sepCheck(t){
  if (SEPS[t[0]] || SEPS[t[t.length - 1]]) return { code:"sepEnd", msg:"Start and end with a species, not a line or a comma." };
  for (var i = 1; i < t.length; i++) {
    if (SEPS[t[i]] && SEPS[t[i - 1]]) return { code:"sepDouble", msg:"Put exactly one separator between two species." };
    if (!SEPS[t[i]] && !SEPS[t[i - 1]]) return { code:"sepMissing", msg:"Put a separator (|, || or a comma) between two species." };
  }
  return null;
}
function missingMsg(z){
  if (z === "H2" || z === "H+") return "The hydrogen half-cell needs both H₂(g) and H⁺(aq), with Pt.";
  if (z === "Fe3+") return "The iron(III)/iron(II) half-cell needs both Fe³⁺(aq) and Fe²⁺(aq), with Pt.";
  if (z === "Fe2+") return "Fe²⁺(aq) needs a partner: Fe(s), or Fe³⁺(aq) with Pt.";
  if (z === "Pt") return "Pt is only the electrode. Add the species of the half-reaction.";
  for (var i = 0; i < CPL.length; i++) { var c = CP[CPL[i]]; if (c.type !== "m") continue;
    if (c.red === z) return "The " + c.word + " half-cell needs its solution: " + uni(SP[c.ox].f) + ".";
    if (c.ox === z) return "The " + c.word + " half-cell needs its electrode: " + uni(SP[c.red].f) + "."; }
  return MSG.mixed;
}
// one side of a notation (s = 0 left, 1 right) -> {cp} or {code, msg}
function sideParse(t, s){
  function er(c, m){ return { code:c, msg:m }; }
  if (!t.length) return er("missing", "Each side needs a half-cell: its electrode and its solution.");
  var sc = sepCheck(t); if (sc) return sc;
  if (t.indexOf("||") >= 0) return er("twoBridge", MSG.bridge);
  var ph = [[]], sp = [];
  t.forEach(function(x){ if (x === "|") ph.push([]); else if (x !== ",") { ph[ph.length - 1].push(x); sp.push(x); } });
  for (var i = 0; i < ph.length; i++) if (ph[i].length > 1 && ph[i].some(function(z){ return SP[z].ph !== "aq"; })) return er("commaPhase", MSG.comma);
  for (i = 1; i < ph.length; i++) if (SP[ph[i][0]].ph === "aq" && SP[ph[i - 1][0]].ph === "aq") return er("barSame", MSG.barSame);
  for (i = 0; i < sp.length; i++) if (sp.indexOf(sp[i]) !== i) return er("dup", "Each species appears only once on its side.");
  var hasPt = sp.indexOf("Pt") >= 0, rest = sp.filter(function(z){ return z !== "Pt"; }), cp = null;
  CPL.forEach(function(id){ var c = CP[id]; if (!cp && rest.length === 2 && rest.indexOf(c.red) >= 0 && rest.indexOf(c.ox) >= 0) cp = id; });
  if (!cp) {
    if (rest.indexOf("Fe3+") >= 0 && rest.indexOf("Fe") >= 0) return er("feMetal", MSG.feMetal);
    if (rest.length <= 1) return er("missing", missingMsg(rest.length ? rest[0] : "Pt"));
    return er("mixed", MSG.mixed);
  }
  var c = CP[cp];
  if (c.pt && !hasPt) return er("noPt", MSG.noPt);
  if (!c.pt && hasPt) return er("extraPt", MSG.extraPt);
  var elec = c.pt ? "Pt" : c.red, outer = s ? ph[ph.length - 1] : ph[0], inner = s ? ph[0] : ph[ph.length - 1];
  if (!(outer.length === 1 && outer[0] === elec)) return er(hasPt ? "ptInside" : "outer", hasPt ? MSG.ptInside : MSG.outer);
  if (SP[inner[0]].ph !== "aq") return er("solBridge", MSG.solBridge);
  return { cp:cp };
}
function parse(t){
  t = t || [];
  if (!t.length) return { ok:false, code:"empty", msg:"Tap tiles to build a notation." };
  var sc = sepCheck(t); if (sc) return { ok:false, code:sc.code, msg:sc.msg };
  var nb = t.filter(function(x){ return x === "||"; }).length;
  if (nb !== 1) return { ok:false, code:nb ? "twoBridge" : "noBridge", msg:MSG.bridge };
  var k = t.indexOf("||"), a = sideParse(t.slice(0, k), 0);
  if (a.code) return { ok:false, code:a.code, msg:a.msg, side:0 };
  var b = sideParse(t.slice(k + 1), 1);
  if (b.code) return { ok:false, code:b.code, msg:b.msg, side:1 };
  return { ok:true, code:"", msg:"Valid", L:a.cp, R:b.cp };
}
// drawable halves of a (possibly unfinished) notation
function model(t){
  var p = parse(t), k = t.indexOf("||"), L = null, R = null;
  if (p.ok) { L = p.L; R = p.R; }
  else {
    var lt = k < 0 ? t : t.slice(0, k), rt = k < 0 ? [] : t.slice(k + 1);
    if (lt.length) { var a = sideParse(lt, 0); if (a.cp) L = a.cp; }
    if (rt.length) { var b = sideParse(rt, 1); if (b.cp) R = b.cp; }
  }
  return { p:p, L:L, R:R, bridge:k >= 0, E:L && R ? r2(CP[R].E - CP[L].E) : null };
}
function canon(L, R){ return CP[L].left.concat(["||"], CP[R].right); }
function cellE(L, R){ return r2(CP[R].E - CP[L].E); }
function termH(c, which, m){ var k = (which === "ox" ? c.cOx : 1) * (m || 1); return F((k > 1 ? k : "") + SP[c[which]].f); }
function eH(n){ return F((n > 1 ? n : "") + "e-"); }
function halfOx(a){ return termH(a, "red") + " → " + termH(a, "ox") + " + " + eH(a.n); }
function halfRed(c){ return termH(c, "ox") + " + " + eH(c.n) + " → " + termH(c, "red"); }
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
function overall(a, c){
  if (a.id === c.id) return "No net reaction: both half-cells are the same.";
  var n = a.n * c.n / gcd(a.n, c.n), ma = n / a.n, mc = n / c.n;
  return termH(a, "red", ma) + " + " + termH(c, "ox", mc) + " → " + termH(a, "ox", ma) + " + " + termH(c, "red", mc);
}
function eCalc(L, R){ return fx(CP[R].E, 2) + " − " + pn(CP[L].E) + " = " + sg(cellE(L, R)) + " V"; }
function ptRow(L, R){ var a = CP[L].pt, b = CP[R].pt; return a && b ? "Pt (both sides)" : a ? "Pt (anode side)" : b ? "Pt (cathode side)" : "None needed"; }
function readRows(p){
  if (!p.ok) return [["Format check", '<span class="cn-no">✗ ' + p.msg + "</span>"], ["Half-reactions, " + Ec, '<span class="muted">They appear when the notation is valid.</span>']];
  var a = CP[p.L], c = CP[p.R], E = cellE(p.L, p.R);
  return [["Anode half-reaction (left)", halfOx(a)], ["Cathode half-reaction (right)", halfRed(c)], ["Overall (balanced)", overall(a, c)],
    [Ec + " as written", eCalc(p.L, p.R)], ["Spontaneous as written?", E > 0 ? "Yes" : E < 0 ? "No: swap sides to get the spontaneous cell" : "No: " + Ec + " = 0.00 V"],
    ["Inert electrode", ptRow(p.L, p.R)], ["Format check", '<span class="cn-yes">✓ Valid</span>']];
}
// notation HTML from tokens: o.under (colour the sides), o.tap (tokens are buttons), o.glow (token index)
function notH(t, o){
  o = o || {};
  var k = t.indexOf("||");
  function one(x, i){
    var side = k < 0 ? "" : i < k ? " cn-l" : i > k ? " cn-r" : " cn-b";
    var cls = "cn-tk" + (o.under ? side : "") + (o.glow === i ? " cn-glow" : "") + (x === "," ? " cn-cm" : "");
    if (o.tap) return '<button type="button" class="' + cls + ' cn-tap" data-ti="' + i + '" data-k="cnti' + i + '" aria-label="' + esc(tokP(x)) + '">' + tokH(x) + "</button>";
    return '<span class="' + cls + '">' + tokH(x) + "</span>";
  }
  function run(a, b){ var s = ""; for (var i = a; i < b; i++) s += (i > a && t[i] !== "," ? " " : "") + one(t[i], i); return s; }
  if (k < 0) return '<span class="cn-n">' + run(0, t.length) + "</span>";
  return '<span class="cn-n"><span class="cn-h">' + run(0, k) + "</span> " + one("||", k) + ' <span class="cn-h">' + run(k + 1, t.length) + "</span></span>";
}
function trayHTML(list, pre){
  return '<div class="cn-tray" role="group" aria-label="Tiles">' + list.map(function(x){ return '<button type="button" class="cn-tile" data-tile="' + x + '" data-k="' + pre + x + '" aria-label="Tile ' + esc(tokP(x)) + '">' + tokH(x) + "</button>"; }).join("") +
    ["|", "||", ","].map(function(x){ return '<button type="button" class="cn-tile cn-sep" data-tile="' + x + '" data-k="' + pre + (x === "," ? "cm" : x === "|" ? "b1" : "b2") + '" aria-label="Tile ' + tokP(x) + '">' + tokH(x) + "</button>"; }).join("") + "</div>";
}

// ===== @component C10 cellView — galvanic cell diagram (SVG string, viewBox 520 × 300): two beakers, cerulean metal
// electrodes or a grey Pt plate (hydrogen: gas hood, H₂ inlet and bubbles), the salt bridge, the wire and a voltmeter
// showing E°cell, violet electron arrows in the real direction of flow, and anode / cathode labels by position.
// o = {L, R (couple ids or null), bridge, E, a:{l,b,r,e} (assembly 0–1), lab (0–1, drops in), glowBridge, glowPt:"L"|"R", eT (0–1 marching electrons)} =====
var GX = { L:{ x0:24, x1:204, ex:66, lab:128 }, R:{ x0:316, x1:496, ex:454, lab:392 } };
function beakerSVG(side, cp, o){
  var g = GX[side], x0 = g.x0, x1 = g.x1, ex = g.ex, L = side === "L", h = "";
  var path = "M" + x0 + " 118 L" + x0 + " 258 Q" + x0 + " 268 " + (x0 + 10) + " 268 L" + (x1 - 10) + " 268 Q" + x1 + " 268 " + x1 + " 258 L" + x1 + " 118";
  if (!cp) return '<path d="' + path + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6" stroke-dasharray="5 5"/>' + tx((x0 + x1) / 2, 196, "?", { fs:26, c:"var(--ink-2)" }) + tx((x0 + x1) / 2, 230, L ? "left half-cell" : "right half-cell", { fs:12, c:"var(--ink-2)" });
  var c = CP[cp], la = L ? "start" : "end", lx = L ? ex + 15 : ex - 15;
  h += rect(x0 + 1.5, 150, x1 - x0 - 3, 117, "var(--p-t)", { op:0.14, rx:8 }) + '<path d="' + path + '" fill="none" stroke="var(--ink-2)" stroke-width="2"/>';
  if (c.pt) {
    if (o.glowPt === side) h += rect(ex - 14, 56, 28, 190, "var(--hi)", { rx:7, op:0.75 });
    h += rect(ex - 6, 64, 12, 172, "var(--ink-2)", { rx:2 });
    if (c.id === "H") {
      var ix = L ? ex + 16 : ex - 16, ox = L ? ex + 44 : ex - 44;
      h += rect(ex - 16, 96, 32, 106, "none", { s:"var(--ink-2)", sw:1.6, rx:5 }) + arrow(ox, 112, ix + (L ? 2 : -2), 112, "var(--ink-2)", 1.6);
      h += tx(L ? ox + 4 : ox - 4, 112, "H₂(g)", { a:la, fs:12, w:700 });
      [[-9, 192], [8, 182], [-7, 170], [9, 162], [-1, 156], [6, 196]].forEach(function(b){ h += circ(ex + b[0], b[1], 3.2, "none", { s:o.glowPt === side ? "var(--ink)" : "var(--ink-2)", sw:1.3 }); });
    }
    h += tx(lx, 74, "Pt(s)", { a:la, fs:13, w:700, c:"var(--ink-2)", halo:true });
  } else {
    h += rect(ex - 11, 64, 22, 172, "var(--at-m)", { rx:3 }) + tx(lx, 74, uni(SP[c.red].f), { a:la, fs:13, w:700, halo:true });
  }
  if (c.type === "i") h += tx(g.lab, 204, uni(SP[c.ox].f), { fs:13 }) + tx(g.lab, 226, uni(SP[c.red].f), { fs:13 });
  else h += tx(g.lab, 214, uni(SP[c.ox].f), { fs:13 });
  return h;
}
var BRP = "M176 242 L176 104 Q176 86 194 86 L326 86 Q344 86 344 104 L344 242";
function cellSVG(o){
  var a = o.a || { l:1, b:1, r:1, e:1 }, h = "", lab = o.lab == null ? 1 : o.lab, LX = GX.L.ex, RX = GX.R.ex;
  // wire and voltmeter
  if (o.L) h += grp(poly([[LX, 64], [LX, 30], [212, 30]]), a.l);
  if (o.R) h += grp(poly([[308, 30], [RX, 30], [RX, 64]]), a.r);
  h += rect(212, 12, 96, 36, "var(--sheet)", { s:"var(--ink)", sw:2, rx:8 }) + tx(260, 30, o.E != null && a.e > 0.5 ? sg(o.E) + " V" : "? V", { fs:16, w:700 });
  // bridge
  if (o.bridge) {
    var bh = (o.glowBridge ? '<path d="' + BRP + '" fill="none" stroke="var(--hi)" stroke-width="30"' + opA(o.glowBridge) + "/>" : "") +
      '<path d="' + BRP + '" fill="none" stroke="var(--ink-2)" stroke-width="18"/><path d="' + BRP + '" fill="none" stroke="var(--sheet)" stroke-width="13"/>' +
      rect(168, 234, 16, 10, "var(--rule)", { rx:2 }) + rect(336, 234, 16, 10, "var(--rule)", { rx:2 }) + tx(260, 104, "salt bridge", { fs:12, c:"var(--ink-2)", w:o.glowBridge ? 700 : 400 });
    h += grp(bh, a.b, (1 - a.b) * -16);
  }
  h += grp(beakerSVG("L", o.L, o), o.L ? a.l : 1, o.L ? (1 - a.l) * 18 : 0) + grp(beakerSVG("R", o.R, o), o.R ? a.r : 1, o.R ? (1 - a.r) * 18 : 0);
  // electrons: violet arrows in the real direction of flow (spontaneous direction)
  if (o.L && o.R && o.E && a.e > 0) {
    var d = o.E > 0 ? 1 : -1, ev = "";
    [[98, 194], [326, 422]].forEach(function(s){ var p = d > 0 ? s : [s[1], s[0]]; ev += arrow(p[0], 30, p[1], 30, "var(--ec-e)", 3) + tx((s[0] + s[1]) / 2, 15, "e⁻", { fs:13, w:700, c:"var(--ec-e)" }); });
    h += grp(ev, a.e);
    if (o.eT != null) {
      var tot = 34 + (RX - LX) + 34;
      for (var i = 0; i < 4; i++) {
        var s = ((o.eT + i / 4) % 1) * tot; if (d < 0) s = tot - s;
        var x, y;
        if (s < 34) { x = LX; y = 64 - s; } else if (s < 34 + RX - LX) { x = LX + (s - 34); y = 30; } else { x = RX; y = 30 + (s - 34 - (RX - LX)); }
        if (x > 206 && x < 314 && y < 50) continue;
        h += circ(x, y, 5, "var(--ec-e)");
      }
    }
  }
  if (lab > 0) {
    var dy = (1 - lab) * -30;
    if (o.L) h += tx(114, 287 + dy, "anode (oxidation)", { fs:13, w:700, c:"var(--pen)", op:lab * a.l });
    if (o.R) h += tx(406, 287 + dy, "cathode (reduction)", { fs:13, w:700, c:"var(--f3)", op:lab * a.r });
  }
  return h;
}
function cellAria(m){
  function half(id, side){ if (!id) return "the " + side + " half-cell is not written yet"; var c = CP[id]; return side + " half-cell: " + (c.pt ? "a platinum electrode" + (c.id === "H" ? " with hydrogen gas bubbling over it" : "") : "a " + c.word + " strip") + " in " + (c.type === "i" ? "Fe³⁺(aq) and Fe²⁺(aq)" : uni(SP[c.ox].f)); }
  var s = "Cell diagram. " + half(m.L, "Left (anode)") + ". " + (m.bridge ? "A salt bridge joins the beakers. " : "No salt bridge yet. ") + half(m.R, "Right (cathode)") + ".";
  if (m.E != null) s += " Voltmeter: " + MV.plain(sg(m.E)) + " V." + (m.E > 0 ? " Electrons flow left to right through the wire." : m.E < 0 ? " As written this cell would not run; electrons would really flow right to left." : "");
  return s;
}

// ---------- Hero: a Zn–Cu cell flies into its notation ----------
function hero(){
  var svg = $("#cn-hx-svg"), ctr = $("#cn-hx-ctr"), rep = $("#cn-hx-replay");
  if (!svg) return;
  var E = cellE("Zn", "Cu"), run = 0, st;
  var P = [["Zn(s)", 117, 111, 120], ["|", 154, 120, 154], ["Zn²⁺(aq)", 205, 159, 165], ["||", 258, 260, 68], ["Cu²⁺(aq)", 312, 362, 165], ["|", 364, 400, 154], ["Cu(s)", 402, 410, 120]];
  var LY = 268;
  function reset(){ st = { dia:0, fly:[0, 0, 0, 0, 0, 0, 0], dim:0, lab:0, arr:0 }; }
  function draw(){
    var h = '<g transform="translate(60 0) scale(0.77)"' + opA(st.dia * (1 - 0.62 * st.dim)) + ">" + cellSVG({ L:"Zn", R:"Cu", bridge:true, E:E, lab:0 }) + "</g>";
    // underlines (anode side --pen, bridge ink, cathode side teal)
    if (st.lab > 0) h += ln(95, LY + 14, 241, LY + 14, { c:"var(--pen)", w:3, op:st.lab }) + ln(252, LY + 14, 264, LY + 14, { c:"var(--ink)", w:3, op:st.lab }) + ln(275, LY + 14, 425, LY + 14, { c:"var(--f3)", w:3, op:st.lab });
    P.forEach(function(p, i){
      var t = st.fly[i]; if (t <= 0) return;
      var x = lerp(p[2], p[1], t), y = lerp(p[3], LY, t), big = p[0].length < 3;
      h += tx(x, y, p[0], { fs:big ? 20 : 18, w:big ? 700 : 600, c:i === 3 ? "var(--ink)" : "var(--ink)", halo:true });
    });
    if (st.lab > 0) {
      var o = st.lab;
      h += tx(117, LY + 30, "anode", { fs:12.5, w:700, c:"var(--pen)", op:o }) + tx(258, LY + 30, "salt bridge", { fs:12.5, w:700, op:o }) + tx(402, LY + 30, "cathode", { fs:12.5, w:700, c:"var(--f3)", op:o });
      h += ln(154, LY + 18, 154, LY + 40, { c:"var(--ink-2)", w:1.2, op:o }) + tx(154, LY + 50, "phase boundary", { fs:12.5, c:"var(--ink-2)", op:o });
      h += tx(402, LY + 52, "<tspan font-style=\"italic\">E</tspan>°<tspan font-size=\"10\" dy=\"4\">cell</tspan><tspan dy=\"-4\"> = " + MV.plain(sg(E)) + " V</tspan>", { fs:14, w:700, op:o });
    }
    if (st.arr > 0) { var x2 = lerp(100, 420, st.arr); h += ln(100, LY - 24, x2, LY - 24, { c:"var(--ec-e)", w:3 }) + head(x2 + 4, LY - 24, 0, 11, "var(--ec-e)") + tx(lerp(100, 420, Math.min(1, st.arr) * 0.5), LY - 38, "e⁻", { fs:14, w:700, c:"var(--ec-e)" }); }
    svg.innerHTML = h;
  }
  function final(){ reset(); st.dia = 1; st.fly = P.map(function(){ return 1; }); st.dim = 1; st.lab = 1; st.arr = 1; draw(); ctr.textContent = "Anode on the left, cathode on the right, one double line for the salt bridge."; rep.hidden = false; }
  function play(){
    var my = ++run; function ok(){ return my === run; }
    reset(); rep.hidden = true; draw(); ctr.textContent = "A zinc–copper galvanic cell…";
    MV.tween({ dur:700, step:function(t){ if (!ok()) return; st.dia = t; draw(); }, done:function(){
      if (!ok()) return; ctr.textContent = "Each part becomes a symbol, in order from left to right.";
      MV.tween({ dur:1900, step:function(t){ if (!ok()) return; st.dim = Math.min(1, t * 1.6); st.fly = P.map(function(_, i){ return clamp((t * 1.9 - i * 0.15) / 0.75, 0, 1); }); draw(); }, done:function(){
        if (!ok()) return; ctr.textContent = "Single lines are phase boundaries; the double line is the salt bridge.";
        MV.tween({ dur:600, step:function(t){ if (!ok()) return; st.lab = t; draw(); }, done:function(){
          if (!ok()) return; MV.wait(500, function(){ if (!ok()) return; ctr.textContent = "Electrons flow from the anode, on the left, to the cathode, on the right.";
            MV.tween({ dur:1100, step:function(t){ if (!ok()) return; st.arr = t; draw(); }, done:function(){ if (ok()) MV.wait(900, function(){ if (ok()) final(); }); } }); });
        } });
      } });
    } });
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) final(); else play(); });
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Notation translator ----------
function explore(host, api){
  var S = api.S, C = api.content, LIST = C.list, FIX = C.fixes;
  if (["read", "write", "fix"].indexOf(S.mode) < 0) S.mode = "read";
  var rd = S.rd = obj(S.rd); if (!byId(LIST, rd.id)) rd.id = "n1"; rd.rev = !!rd.rev;
  var wr = S.wr = obj(S.wr); wr.slot = wr.slot === 1 ? 1 : 0; wr.toks = [cleanToks(wr.toks && wr.toks[0]), cleanToks(wr.toks && wr.toks[1])]; wr.ev = typeof wr.ev === "string" ? wr.ev : "";
  var fs = S.fx = obj(S.fx); if (!byId(FIX, fs.id)) fs.id = "f1"; fs.done = obj(fs.done); fs.rev = !!fs.rev;
  var busy = false, locked = false, seq = 0, V = { a:{ l:1, b:1, r:1, e:1 }, lab:1, glowBridge:0, glowDl:false, glowPt:null, eT:null }, pick = null, fmsg = null, pulse = false, note = "", RG = {};

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="cn-modes"></div><div class="cn-grid">' +
    '<div class="cn-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="cn-box"><svg class="cn-svg" id="cn-svg" viewBox="0 0 520 300" role="img" aria-label=""></svg></div>' +
      '<div class="cn-notbox"><span class="cn-nlab">Notation</span><div class="cn-not" id="cn-not"></div></div><p class="cn-cap" aria-live="polite"></p></div>' +
    '<div class="cn-side">' +
      '<div class="cn-c" data-for="read"><div class="cn-list"></div></div>' +
      '<div class="cn-c" data-for="write"><div class="cn-slot"></div>' + trayHTML(C.tiles, "cnw") +
        '<div class="q-actions cn-wbtns"><button type="button" class="btn ghost sm" data-act="undo" data-k="cnundo">Undo</button><button type="button" class="btn ghost sm" data-act="clear" data-k="cnclear">Clear</button></div>' +
        '<div class="numrow cn-ev"><label for="cn-ev">Your ' + Ec + ' (for challenge 2):</label><input class="numin" id="cn-ev" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span>V</span></div></div>' +
      '<div class="cn-c" data-for="fix"><div class="cn-flist"></div><div class="cn-fbox" aria-live="polite"></div></div>' +
      '<div class="q-actions cn-btns"><button type="button" class="btn ghost sm cn-swap" data-act="swap" data-k="cnswap">⇄ Swap sides</button></div>' +
      '<dl class="read cn-read" aria-live="polite"></dl></div></div><div class="cn-tabs"></div>';
  var svg = $("#cn-svg", host), notEl = $("#cn-not", host), capEl = $(".cn-cap", host), readEl = $(".cn-read", host), fbox = $(".cn-fbox", host), evIn = $("#cn-ev", host);
  evIn.value = wr.ev;
  MV.chem.tablePanel($(".cn-tabs", host), "e0", { title:"Course data table: standard reduction potentials" });

  RG.mode = radios($(".cn-modes", host), { label:"Mode", aria:"Translator mode", options:C.modes, value:S.mode, onChange:function(v){ stop(); S.mode = v; pick = null; fmsg = null; pulse = false; note = ""; api.save(); paint(); } });
  RG.list = radios($(".cn-list", host), { label:"Choose a notation", cls:"chips cn-rlist", aria:"Notation to read", options:LIST.map(function(n){ return { id:n.id, t:notH(n.toks) }; }), value:rd.id,
    onChange:function(v){ rd.id = v; rd.rev = false; pulse = false; note = ""; api.save(); assemble(); } });
  RG.slot = radios($(".cn-slot", host), { label:"Notation slot", aria:"Notation slot", options:[{ id:"0", t:"Slot 1" }, { id:"1", t:"Slot 2" }], value:String(wr.slot),
    onChange:function(v){ wr.slot = +v; note = ""; api.save(); paint(); } });
  RG.fix = radios($(".cn-flist", host), { label:"Notation to fix", cls:"chips", aria:"Notation to fix", options:FIX.map(function(f, i){ return { id:f.id, t:String(i + 1) }; }), value:fs.id,
    onChange:function(v){ fs.id = v; fs.rev = false; pick = null; fmsg = null; api.save(); paint(); } });

  function fixItem(){ return byId(FIX, fs.id); }
  function cur(){
    if (S.mode === "read") { var t = byId(LIST, rd.id).toks.slice(); return rd.rev ? t.reverse() : t; }
    if (S.mode === "write") return wr.toks[wr.slot];
    var f = fixItem(), u = f.toks.slice(); if (fs.done[f.id]) { u[f.bad] = f.fix; if (fs.rev) u.reverse(); } return u;
  }
  function stop(){ seq++; busy = false; V = { a:{ l:1, b:1, r:1, e:1 }, lab:1, glowBridge:0, glowDl:false, glowPt:null, eT:null }; }
  function paintCtl(){
    var off = busy || locked;
    RG.mode.lock(off); RG.list.lock(off); RG.slot.lock(off); RG.fix.lock(off);
    $$("[data-tile], [data-act]", host).forEach(function(b){ b.disabled = off; });
    var sw = $(".cn-swap", host), t = cur();
    sw.disabled = off || !t.length || (S.mode === "fix" && !fs.done[fs.id]);
    sw.classList.toggle("cn-pulse", pulse && !off);
    evIn.disabled = off;
  }
  function caption(m){
    var t = cur(), p = m.p;
    if (note) return note;
    if (S.mode === "write") {
      if (!t.length) return "Tap tiles in order, starting with the anode’s electrode on the left.";
      if (p.code === "sepEnd" && SEPS[t[t.length - 1]]) return "Keep going: add the next species.";
      if (!p.ok) return "Format check: " + p.msg;
    }
    if (S.mode === "fix" && !fs.done[fs.id]) return "One symbol or species breaks a rule. Tap it in the notation, then choose the correction.";
    if (!p.ok) return "Format check: " + p.msg;
    var c = CP[p.L], d = CP[p.R];
    if (m.E < 0) return "Read left to right: " + c.word + " is written as the anode, " + d.word + " as the cathode. As written, " + Ec + " is negative, so this cell wouldn’t run: electrons would really flow right to left. Press <strong>Swap sides</strong>.";
    if (m.E === 0) return "Both sides are the same half-cell, so " + Ec + " = 0.00 V: there is no driving force.";
    return "Read left to right: " + c.word + " is the anode (oxidation), " + d.word + " the cathode (reduction). Electrons flow through the wire from left to right.";
  }
  function paintFix(){
    if (S.mode !== "fix") return;
    var f = fixItem(), h = "";
    if (fs.done[f.id]) h = MV.fbHTML("good", "<strong>✓ Fixed.</strong> " + f.why);
    else {
      if (pick != null) h += '<p class="cn-fq">This part breaks a rule. Choose the correction:</p><div class="chips cn-fch">' + f.choices.map(function(c, i){ return '<button type="button" class="chip" data-fc="' + i + '" data-k="cnfc' + i + '">' + tokH(c) + "</button>"; }).join("") + "</div>";
      else h += '<p class="cn-fq muted">Tap the error in the notation under the diagram.</p>';
      if (fmsg) h += MV.fbHTML(fmsg.k, fmsg.t);
    }
    MV.keepFocus(fbox, function(){ fbox.innerHTML = h; });
  }
  function draw(m){
    svg.innerHTML = cellSVG({ L:m.L, R:m.R, bridge:m.bridge, E:m.E, a:V.a, lab:V.lab, glowBridge:V.glowBridge, glowPt:V.glowPt, eT:V.eT });
    svg.setAttribute("aria-label", cellAria(m));
  }
  function paint(){
    var m = model(cur()), t = cur(), k = t.indexOf("||");
    $$(".cn-c", host).forEach(function(p){ p.hidden = p.dataset.for !== S.mode; });
    draw(m);
    var tap = S.mode === "fix" && !fs.done[fs.id] && !busy && !locked;
    MV.keepFocus(notEl, function(){ notEl.innerHTML = t.length ? notH(t, { under:true, tap:tap, glow:V.glowDl ? k : -1 }) : '<span class="muted">Your notation appears here.</span>'; });
    readEl.innerHTML = MV.readoutHTML(readRows(m.p));
    capEl.innerHTML = caption(m);
    paintFix(); paintCtl();
    MV.changed();
  }
  function paintSvg(){ draw(model(cur())); }
  // assemble the cell beaker by beaker: left, bridge, right, electrons
  function assemble(cb, o){
    o = o || {};
    var my = ++seq; busy = true;
    V = { a:{ l:0, b:0, r:0, e:0 }, lab:o.noLab ? 0 : 1, glowBridge:0, glowDl:false, glowPt:null, eT:null };
    paint();
    var parts = ["l", "b", "r", "e"];
    (function step(i){
      if (my !== seq) return;
      if (i >= parts.length) { busy = false; paint(); if (cb) cb(); return; }
      MV.tween({ dur:i === 3 ? 350 : 450, step:function(t){ if (my !== seq) return; V.a[parts[i]] = t; paintSvg(); }, done:function(){ step(i + 1); } });
    })(0);
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || locked) return;
    if (b.dataset.tile) { var t = wr.toks[wr.slot]; if (t.length < 17) t.push(b.dataset.tile); note = ""; api.save(); paint(); return; }
    var act = b.dataset.act;
    if (act === "undo") { wr.toks[wr.slot].pop(); note = ""; api.save(); paint(); return; }
    if (act === "clear") { wr.toks[wr.slot] = []; note = ""; api.save(); paint(); return; }
    if (act === "swap") {
      pulse = false; note = "";
      if (S.mode === "read") { rd.rev = !rd.rev; api.save(); assemble(); return; }
      if (S.mode === "write") { wr.toks[wr.slot] = wr.toks[wr.slot].slice().reverse(); api.save(); paint(); return; }
      if (fs.done[fs.id]) { fs.rev = !fs.rev; api.save(); assemble(); }
      return;
    }
    if (b.dataset.ti != null) {
      var f = fixItem(); if (fs.done[f.id]) return;
      var i = +b.dataset.ti;
      if (i === f.bad) { pick = i; fmsg = null; } else { pick = null; fmsg = { k:"bad", t:C.wrongTap }; }
      paint(); MV.focusFb(fbox); return;
    }
    if (b.dataset.fc != null) {
      var g = fixItem(), ch = g.choices[+b.dataset.fc];
      if (ch === g.fix) { fs.done[g.id] = true; fs.rev = false; pick = null; fmsg = null; api.save(); assemble(function(){ MV.focusFb(fbox); }); }
      else { fmsg = { k:"bad", t:C.wrongFix }; paint(); MV.focusFb(fbox); }
    }
  });
  evIn.addEventListener("input", function(){ wr.ev = evIn.value; api.save(); MV.changed(); });
  evIn.addEventListener("keydown", function(e){ if (e.key === "Enter") { var b = document.querySelector('#chal [data-k="tc2chk"]'); if (b) b.click(); } });

  // ----- predictions -----
  var hooks = {
    start:function(p){
      stop(); note = ""; pulse = false; S.mode = "read"; RG.mode.set("read");
      rd.id = p.id === "p1" ? "n1" : p.id === "p2" ? "n5" : p.id === "p3" ? "n2" : "n6"; rd.rev = false; RG.list.set(rd.id);
      locked = true; api.save();
      V = { a:{ l:0, b:0, r:0, e:0 }, lab:0, glowBridge:0, glowDl:false, glowPt:null, eT:null };
      paint();
    },
    run:function(p, done){
      var my;
      function fin(n){ if (my !== seq) return; note = n || ""; busy = false; locked = false; paint(); MV.wait(150, done); }
      function tw(dur, f, cb){ MV.tween({ dur:dur, step:function(t){ if (my !== seq) return; f(t); paintSvg(); }, done:function(){ if (my === seq) cb(); } }); }
      assemble(function(){
        my = seq; busy = true; locked = true; paintCtl();
        if (p.id === "p1") {
          V.glowDl = true; paint(); busy = true; locked = true; paintCtl();
          tw(1400, function(t){ V.lab = 1; V.glowBridge = 0.4 + 0.6 * Math.abs(Math.sin(t * Math.PI * 2)); }, function(){ V.glowBridge = 1; fin("The || in the notation and the salt bridge in the diagram are the same thing."); });
        } else if (p.id === "p2") {
          tw(700, function(t){ V.lab = t; }, function(){ tw(1600, function(t){ V.eT = t; }, function(){ V.eT = null; fin("“anode” lands on the left end, and the electrons flow left to right."); }); });
        } else if (p.id === "p3") {
          tw(1000, function(t){ V.lab = 1; V.glowPt = t > 0.15 ? "L" : null; }, function(){ V.glowPt = "L"; fin("The Pt plate carries the electrons; H₂ bubbles over it and gives H⁺."); });
        } else {
          V.lab = 1; pulse = true;
          tw(600, function(){}, function(){ fin("The readout: −0.76 − 0.34 = −1.10 V. Press <strong>Swap sides</strong> to get +1.10 V."); });
        }
      }, { noLab:true });
      my = seq;
    }
  };

  // ----- challenges -----
  function slotP(i){ return parse(wr.toks[i]); }
  function ev(){ var v = MV.parseNum(String(wr.ev || "").replace(/v/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(a, b){ return Math.abs(a - b) <= 0.01 + 1e-9; }
  function has(t, list){ return list.every(function(x){ return t.indexOf(x) >= 0; }); }
  function chal(id){
    var t = wr.toks[wr.slot], p = parse(t), other = slotP(1 - wr.slot);
    if (id === "tc1") {
      if ((p.ok && p.L === "Ni" && p.R === "Ag") || (other.ok && other.L === "Ni" && other.R === "Ag")) return { ok:true };
      if (!t.length) return { ok:false };
      if (p.ok && p.L === "Ag" && p.R === "Ni") return { ok:false, msg:"Ag⁺ has the higher " + E0 + ", so silver is the cathode, on the right." };
      if (p.code === "noBridge" && has(t, ["Ni", "Ag"])) return { ok:false, msg:"The salt bridge needs a double line." };
      if (p.code === "outer") return { ok:false, msg:"Electrodes go at the outer ends." };
      if (!p.ok) return { ok:false, msg:"Format check: " + p.msg };
      return { ok:false, msg:"That’s a " + CP[p.L].word + "–" + CP[p.R].word + " cell. Build the nickel–silver cell." };
    }
    if (id === "tc2") {
      var good = function(q){ return q.ok && q.L === "Cu" && q.R === "Fe3"; }, v = ev();
      if ((good(p) || good(other)) && v != null && near(v, 0.43)) return { ok:true };
      if (p.code === "feMetal") return { ok:false, msg:MSG.feMetal };
      if (p.code === "barSame" && has(t, ["Fe3+", "Fe2+"])) return { ok:false, msg:MSG.barSame };
      if (!good(p) && !good(other)) {
        if (!t.length) return { ok:false };
        if (p.ok && p.L === "Fe3" && p.R === "Cu") return { ok:false, msg:"Cu has the lower " + E0 + ", so copper is the anode, on the left." };
        if (!p.ok) return { ok:false, msg:"Format check: " + p.msg };
        return { ok:false, msg:"That’s a " + CP[p.L].word + "–" + CP[p.R].word + " cell. Build copper with the Fe³⁺/Fe²⁺ couple." };
      }
      if (v == null) return { ok:false, msg:"The notation is right. Now enter " + Ec + " in the box under the tiles." };
      if (near(v, 1.11)) return { ok:false, msg:"Subtract: 0.77 − 0.34." };
      return { ok:false, msg:Ec + " = " + E0 + "<sub>right</sub> − " + E0 + "<sub>left</sub>." };
    }
    if (id === "tc3") {
      var P2 = [slotP(0), slotP(1)];
      var inRange = function(q){ var E = cellE(q.L, q.R); return E > 0 && E >= 0.70 - 1e-9 && E <= 1.00 + 1e-9; };
      var hyd = function(q){ return q.ok && (q.L === "H" || q.R === "H"); };
      var an = P2.some(function(q){ return hyd(q) && q.L === "H" && inRange(q); }), ca = P2.some(function(q){ return hyd(q) && q.R === "H" && inRange(q); });
      if (an && ca) return { ok:true };
      for (var i = 0; i < 2; i++) {
        var q = P2[i], n = "Slot " + (i + 1) + ": ";
        if (!wr.toks[i].length) continue;
        if (q.code === "ptInside") return { ok:false, msg:n + MSG.ptInside };
        if (!q.ok) return { ok:false, msg:n + "format check: " + q.msg };
        if (!hyd(q)) return { ok:false, msg:n + "each cell must include the hydrogen electrode." };
        var E = cellE(q.L, q.R);
        if (E <= 0) return { ok:false, msg:n + "not spontaneous as written (" + MV.plain(sg(E)) + " V). " + M4s };
        if (E < 0.70) return { ok:false, msg:n + MV.plain(fx(E, 2)) + " V. Under 0.70 V." };
        if (E > 1.00) return { ok:false, msg:n + MV.plain(fx(E, 2)) + " V. Over 1.00 V." };
      }
      if (!wr.toks[0].length && !wr.toks[1].length) return { ok:false };
      if (an) return { ok:false, msg:"Hydrogen as the anode: done. Now write one with hydrogen as the cathode, on the right, in the other slot." };
      if (ca) return { ok:false, msg:"Hydrogen as the cathode: done. Now write one with hydrogen as the anode, on the left, in the other slot." };
      return { ok:false };
    }
    return { ok:false };
  }
  var M4s = E0 + "<sub>right</sub> − " + E0 + "<sub>left</sub> must be positive.";

  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Batteries and fuel cells ----------
function devSVG(id){
  var h = "";
  if (id === "alk") {
    h += rect(30, 26, 168, 68, "var(--sheet)", { s:"var(--ink-2)", sw:2, rx:10 }) + rect(198, 46, 12, 28, "var(--ink-2)", { rx:3 });
    h += rect(38, 34, 152, 52, "var(--ink-2)", { rx:7, op:0.3 }) + rect(62, 48, 104, 24, "var(--at-m)", { rx:5, op:0.85 });
    h += tx(114, 60, "Zn (anode)", { fs:12, w:700, c:"var(--sheet)" }) + tx(114, 108, "MnO₂ around it: cathode", { fs:12, c:"var(--ink-2)" }) + tx(220, 60, "+", { fs:16, w:700 });
  } else if (id === "li") {
    h += rect(30, 30, 40, 66, "var(--ink-2)", { rx:4, op:0.45 }) + rect(170, 30, 40, 66, "var(--at-m)", { rx:4, op:0.5 }) + rect(72, 30, 96, 66, "var(--p-t)", { op:0.12 });
    h += tx(50, 108, "anode", { fs:12, w:700, c:"var(--pen)" }) + tx(190, 108, "cathode", { fs:12, w:700, c:"var(--f3)" });
    [[90, 52], [118, 72], [142, 50]].forEach(function(p){ h += circ(p[0], p[1], 8, "var(--ec-cat)") + tx(p[0], p[1], "Li⁺", { fs:8.5, w:700, c:"var(--sheet)" }); });
    h += arrow(84, 88, 156, 88, "var(--ec-cat)", 2) + poly([[50, 30], [50, 12], [190, 12], [190, 30]], { c:"var(--ink)", w:1.6 }) + arrow(92, 12, 150, 12, "var(--ec-e)", 2.6) + tx(120, 22, "e⁻", { fs:11, w:700, c:"var(--ec-e)" });
  } else {
    h += rect(70, 26, 18, 70, "var(--ink-2)", { rx:3 }) + rect(88, 26, 64, 70, "var(--p-t)", { op:0.14 }) + rect(152, 26, 18, 70, "var(--ink-2)", { rx:3 });
    h += arrow(14, 44, 64, 44, "var(--ink-2)", 2) + tx(24, 34, "H₂", { fs:12, w:700 }) + arrow(226, 44, 176, 44, "var(--ink-2)", 2) + tx(216, 34, "O₂", { fs:12, w:700 }) + arrow(176, 80, 226, 80, "var(--ink-2)", 2) + tx(212, 92, "H₂O", { fs:12, w:700 });
    h += arrow(96, 62, 144, 62, "var(--ec-cat)", 2) + tx(120, 52, "H⁺", { fs:11, w:700, c:"var(--ec-cat)" });
    h += poly([[79, 26], [79, 10], [161, 10], [161, 26]], { c:"var(--ink)", w:1.6 }) + arrow(100, 10, 142, 10, "var(--ec-e)", 2.6);
    h += tx(79, 108, "anode (Pt)", { fs:11.5, w:700, c:"var(--pen)" }) + tx(161, 108, "cathode (Pt)", { fs:11.5, w:700, c:"var(--f3)" });
  }
  return h;
}
function zoomSVG(id){
  // particle equation pictures: atoms or ions (balls), electrons (violet dots), arrows
  function ball(x, t, fill, ink){ return circ(x, 40, 16, fill) + tx(x, 40, t, { fs:t.length > 3 ? 10 : 11.5, w:700, c:ink || "var(--sheet)" }); }
  function el(x){ return circ(x, 40, 6, "var(--ec-e)") + tx(x, 58, "e⁻", { fs:10, c:"var(--ec-e)" }); }
  var h = "";
  if (id === "alk") h += ball(34, "Zn", "var(--at-m)") + arrow(58, 40, 96, 40, "var(--ink-2)", 2) + ball(120, "Zn²⁺", "var(--ec-cat)") + tx(146, 40, "+", { fs:14 }) + el(162) + el(180) + tx(210, 40, "to MnO₂", { fs:10.5, a:"start", c:"var(--ink-2)" });
  else if (id === "li") h += ball(34, "Li", "var(--at-m)") + arrow(58, 40, 96, 40, "var(--ink-2)", 2) + ball(120, "Li⁺", "var(--ec-cat)") + tx(146, 40, "+", { fs:14 }) + el(162) + tx(184, 40, "Li⁺ → cathode", { fs:10.5, a:"start", c:"var(--ink-2)" });
  else h += circ(24, 40, 12, "var(--at-h)", { s:"var(--at-h-line)" }) + circ(42, 40, 12, "var(--at-h)", { s:"var(--at-h-line)" }) + tx(33, 40, "H₂", { fs:10.5, w:700, c:"var(--at-h-ink)" }) + arrow(62, 40, 92, 40, "var(--ink-2)", 2) + ball(112, "H⁺", "var(--ec-cat)") + ball(148, "H⁺", "var(--ec-cat)") + tx(172, 40, "+", { fs:14 }) + el(186) + el(204);
  return h;
}
function part3(host, api){
  var S = api.S, C = api.content, CARDS = C.cards, s2 = C.s2, s3 = C.s3;
  S.placed = obj(S.placed); s2.items.forEach(function(it){ if (S.placed[it.id] && S.placed[it.id] !== it.card) delete S.placed[it.id]; });
  S.j = obj(S.j); var sel = null, msg = null, jmsg = null;

  host.innerHTML =
    '<div class="part"><h3>' + C.s1.title + "</h3><p>" + C.s1.intro + '</p><div class="cn-devs">' + CARDS.map(function(c){
      return '<div class="cn-dev"><h4 class="cn-h4">' + c.name + '</h4><svg class="cn-dsvg" viewBox="0 0 240 120" role="img" aria-label="' + esc(MV.plain(c.name + ": anode, " + c.an + " Cathode, " + c.ca)) + '">' + devSVG(c.id) + "</svg>" +
        '<dl class="read cn-dread">' + MV.readoutHTML([["Anode", c.an], ["Cathode", c.ca]]) + "</dl><p>" + c.sum + '</p><details class="alg cn-zoom"><summary>Zoom to the particles</summary><svg class="cn-zsvg" viewBox="0 0 280 72" role="img" aria-label="' + esc(MV.plain(c.zoom)) + '">' + zoomSVG(c.id) + "</svg><p>" + c.zoom + "</p></details></div>";
    }).join("") + "</div></div>" +
    '<div class="part"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="cn-s2"></div></div>' +
    '<div class="part"><h3>' + s3.title + '</h3><p class="cn-scen"><strong>' + s3.scenario + "</strong></p><p>" + s3.intro + '</p><div class="cn-s3"></div><p class="tiny muted cn-note">' + s3.note + '</p><details class="alg"><summary>Check it with data</summary>' + s3.data + "</details></div>";
  var s2h = $(".cn-s2", host), s3h = $(".cn-s3", host);

  function paintS2(){
    var done = s2.items.every(function(it){ return S.placed[it.id]; }), h = '<div class="chips cn-s2items" role="group" aria-label="Statements">';
    s2.items.forEach(function(it){ if (!S.placed[it.id]) h += '<button type="button" class="chip' + (sel === it.id ? " on" : "") + '" aria-pressed="' + (sel === it.id) + '" data-s2i="' + it.id + '" data-k="cns2' + it.id + '">' + it.t + "</button>"; });
    h += '</div><div class="cn-s2box">' + CARDS.map(function(c){
      var inn = s2.items.filter(function(it){ return S.placed[it.id] === c.id; }).map(function(it){ return '<li>✓ ' + it.t + "</li>"; }).join("");
      return '<button type="button" class="cn-s2t" data-s2c="' + c.id + '" data-k="cns2c' + c.id + '"' + (done ? " disabled" : "") + "><strong>" + c.name + "</strong><ul>" + inn + "</ul></button>";
    }).join("") + "</div>";
    if (msg) h += MV.fbHTML(msg.k, msg.t);
    if (done) h += MV.fbHTML("good", "<strong>✓ " + s2.done + "</strong>");
    MV.keepFocus(s2h, function(){ s2h.innerHTML = h; });
  }
  s2h.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s2i) { sel = sel === b.dataset.s2i ? null : b.dataset.s2i; msg = null; paintS2(); return; }
    if (b.dataset.s2c) {
      if (!sel) { msg = { k:"", t:"Tap a statement first, then the device it describes." }; paintS2(); return; }
      var it = byId(s2.items, sel), c = b.dataset.s2c;
      if (it.card === c) { S.placed[it.id] = c; sel = null; msg = { k:"good", t:"<strong>✓ Right.</strong> " + s2.fb[c] }; api.save(); }
      else msg = { k:"bad", t:"<strong>✗ Not that one.</strong> " + s2.fb[c] };
      paintS2(); MV.focusFb(s2h);
    }
  });
  paintS2();

  // station 3: evidence chips and a one-sentence judgement (S12-style sentence builder)
  s3h.innerHTML = '<div class="cn-s3row cn-s3v"></div><div class="cn-s3row cn-s3p"></div><div class="cn-s3row cn-s3c"></div><p class="cn-sent" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn primary sm" data-k="cns3chk" id="cn-s3chk">Check my judgement</button></div><div class="cn-s3fb"></div>';
  function opts(list){ return list.map(function(x){ return { id:x.id, t:x.t }; }); }
  function onCh(k){ return function(v){ S.j[k] = v; jmsg = null; api.save(); paintS3(); }; }
  radios($(".cn-s3v", s3h), { label:"Verdict", cls:"chips", aria:"Verdict", options:opts(s3.verdicts), value:S.j.v || "", onChange:onCh("v") });
  radios($(".cn-s3p", s3h), { label:"Evidence for", cls:"chips", aria:"Evidence for a fuel cell", options:opts(s3.pros), value:S.j.p || "", onChange:onCh("p") });
  radios($(".cn-s3c", s3h), { label:"Evidence against", cls:"chips", aria:"Evidence against a fuel cell", options:opts(s3.cons), value:S.j.c || "", onChange:onCh("c") });
  function blank(t){ return t ? "<strong>" + t + "</strong>" : '<span class="cn-blank">______</span>'; }
  function paintS3(){
    var v = byId(s3.verdicts, S.j.v), p = byId(s3.pros, S.j.p), c = byId(s3.cons, S.j.c);
    $(".cn-sent", s3h).innerHTML = "“A hydrogen fuel cell " + blank(v && v.t) + " for the station, because it offers " + blank(p && p.t) + ", although " + blank(c && c.t) + ".”";
    $(".cn-s3fb", s3h).innerHTML = jmsg ? MV.fbHTML(jmsg.k, jmsg.t) : "";
  }
  $("#cn-s3chk", s3h).addEventListener("click", function(){
    var ok = byId(s3.verdicts, S.j.v) && byId(s3.pros, S.j.p) && byId(s3.cons, S.j.c);
    jmsg = ok ? { k:"good", t:"<strong>✓ " + s3.good + "</strong>" } : { k:"", t:s3.need };
    if (ok) { S.j.done = true; api.save(); }
    paintS3(); MV.focusFb(s3h);
  });
  if (S.j.done) jmsg = { k:"good", t:"<strong>✓ " + s3.good + "</strong>" };
  paintS3();
}

// ---------- Practice 2: From notation to numbers (number entry and choices; adapted from SCH4U 14's calcAct) ----------
function numsAct(host, api, a){
  var S = api.S; S.items = obj(S.items);
  var msgs = {};
  function ist(id){ var x = S.items[id] = obj(S.items[id]); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function chipsHTML(it, x, dis){ return '<div class="chips cn-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>"; }
  function numHTML(it, x, dis){ return '<div class="numrow"><label for="ci-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="' + (it.keypad || "decimal") + '" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="cn-unit">' + (it.unit || "") + "</span></div>"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += numHTML(it, x, dis);
    else if (it.kind === "chips") h += chipsHTML(it, x, dis);
    else h += chipsHTML(it, x, dis) + numHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    else {
      var why = it.kind === "chips" ? (it.options[x.pick] && it.options[x.pick].why) || "" : it.why || it.fb || "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    }
    if (!x.solved && msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return byId(a.items, id); }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-z]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, w, tol){ return Math.abs(v - w) <= (tol || 0) + 1e-9; }
  function judge(it, x){
    if (it.kind === "chips") {
      if (x.pick == null) return { bad:"Choose an answer first." };
      return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
    }
    if (it.kind === "two") {
      if (x.pick == null) return { bad:"Choose an option first, then enter the number." };
      if (!MV.ok(it.options[x.pick])) return { fb:it.options[x.pick].why || it.fb };
    }
    var v = one(x.val);
    if (v == null) return { bad:"Enter one number, such as 0.46." };
    if (near(v, MV.ans(it), it.tol)) return { ok:true };
    var w = (it.wrong || []).filter(function(z){ return near(v, z.match, 0.005); })[0];
    return { fb:w ? w.fb : it.fb };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.cin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: One platinum, under a volt ----------
var task = (function(){
  var S = null, api = null, T = null;
  function read(){ return { L:CP[S.L] ? S.L : "", R:CP[S.R] ? S.R : "", toks:cleanToks(S.toks) }; }
  function tilesOk(d){ var p = parse(d.toks); return p.ok && p.L === d.L && p.R === d.R; }
  function paint(){
    var d = read(), tn = $("#cn-tnot"), m = d.L && d.R ? { L:d.L, R:d.R, bridge:true, E:cellE(d.L, d.R) } : { L:d.L || null, R:d.R || null, bridge:!!(d.L && d.R), E:null };
    if (!tn) return;
    tn.innerHTML = d.L && d.R ? '<p class="cn-tl"><strong>The translator writes:</strong> ' + notH(canon(d.L, d.R), { under:true }) + "</p><dl class=\"read\">" + MV.readoutHTML([[Ec + " as written", eCalc(d.L, d.R)], ["Platinum electrodes", (CP[d.L].pt ? 1 : 0) + (CP[d.R].pt ? 1 : 0)]]) + "</dl>" : '<p class="muted">Choose a left and a right half-cell.</p>';
    var bt = $("#cn-tbuilt"); MV.keepFocus(bt, function(){ bt.innerHTML = d.toks.length ? notH(d.toks, { under:true }) : '<span class="muted">Your tiles appear here.</span>'; });
    var p = parse(d.toks);
    $("#cn-tfmt").innerHTML = !d.toks.length ? "" : !p.ok ? '<span class="cn-no">✗ Format check: ' + p.msg + "</span>" : (p.L === d.L && p.R === d.R) ? '<span class="cn-yes">✓ Valid, and it matches your half-cells.</span>' : '<span class="cn-no">✗ Valid, but it describes a different cell from the half-cells you chose.</span>';
    var sv = $("#cn-tsvg"); sv.innerHTML = cellSVG(m); sv.setAttribute("aria-label", cellAria(m));
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = a.content; S.toks = cleanToks(S.toks); if (!CP[S.L]) S.L = ""; if (!CP[S.R]) S.R = "";
      var opts = CPL.map(function(id){ return { id:id, t:F(CP[id].name) }; });
      inp.innerHTML = '<div class="cn-tsel" id="cn-tL"></div><div class="cn-tsel" id="cn-tR"></div><div id="cn-tnot" aria-live="polite"></div>' +
        '<h4 class="cn-h4">Confirm the notation with tiles</h4><div class="cn-not cn-tbuilt" id="cn-tbuilt"></div>' + trayHTML(ALL_TILES, "cnt") +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-tact="undo" data-k="cntundo">Undo</button><button type="button" class="btn ghost sm" data-tact="clear" data-k="cntclear">Clear</button></div><p class="cn-tfmt" id="cn-tfmt" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="cn-h4">Your cell</h4><div class="cn-box"><svg class="cn-svg" id="cn-tsvg" viewBox="0 0 520 300" role="img" aria-label=""></svg></div>';
      radios($("#cn-tL"), { label:"Left (anode) half-cell", cls:"chips", aria:"Left (anode) half-cell", options:opts, value:S.L, onChange:function(v){ S.L = v; api.save(); paint(); api.update(); } });
      radios($("#cn-tR"), { label:"Right (cathode) half-cell", cls:"chips", aria:"Right (cathode) half-cell", options:opts, value:S.R, onChange:function(v){ S.R = v; api.save(); paint(); api.update(); } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.dataset.tile) { if (S.toks.length < 17) S.toks.push(b.dataset.tile); }
        else if (b.dataset.tact === "undo") S.toks.pop();
        else if (b.dataset.tact === "clear") S.toks = [];
        else return;
        api.save(); paint(); api.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.L && d.R ? true : "Choose a left (anode) and a right (cathode) half-cell first."; },
    checks:function(d){
      if (!d.L || !d.R) return [false, false, false, false];
      var E = cellE(d.L, d.R), npt = (CP[d.L].pt ? 1 : 0) + (CP[d.R].pt ? 1 : 0);
      return [E > 0, npt === 1, E >= 0.40 - 1e-9 && E <= 0.80 + 1e-9, tilesOk(d)];
    },
    tips:function(d, res){
      var out = [];
      res.forEach(function(ok, i){
        if (ok) return;
        if (i === 3) { var p = parse(d.toks); out.push(!d.toks.length ? "Confirm the notation with tiles." : !p.ok ? "Tiles: " + p.msg + " " + T.tips[3] : "Your tiles describe a different cell from the half-cells you chose."); }
        else out.push(T.tips[i]);
      });
      return out;
    },
    key:function(d){ return d.L + ">" + d.R; },
    label:function(k){ var p = k.split(">"); return CP[p[0]] && CP[p[1]] ? notH(canon(p[0], p[1])) + " (" + fx(cellE(p[0], p[1]), 2) + " V)" : k; },
    text:function(k){ var p = k.split(">"); return CP[p[0]] && CP[p[1]] ? notP(canon(p[0], p[1])) + " (" + MV.plain(fx(cellE(p[0], p[1]), 2)) + " V)" : k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ nums:numsAct },
  task:task
});
})();
