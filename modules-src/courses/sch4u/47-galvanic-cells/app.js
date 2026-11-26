// SCH4U 47 Galvanic Cells: hero (Zn in Cu²⁺ → split cell → e⁻ and ion flow → 1.10 V and a bulb), Cell builder (Explore:
// C10 cell builder in Build, Hydrogen reference and Will it react? modes), Will it react? (Part 3: strip-in-solution
// prediction cards, the table rule with a highlight bar, etching circuit boards, why hydrogen is zero), Label the cell
// (custom tap-to-place labels on two cells), Cell calculations (custom number / choice items) and A practical cell (task).
// Every E° comes from MV.chem.data.E0. Mystery metals M1–M3 are model values (plan §5), kept local.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function r2(v){ return Math.round(v * 100) / 100; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var D = MV.chem.data, F = MV.chem.f, fx = MV.chem.fx;
var EH = "<i>E</i>°", ECH = "<i>E</i>°<sub>cell</sub>";

// @component radioGroup (from MHF4U 25, via SCH4U 01–19) — segmented control or chip row as a real radio group (arrow keys,
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

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' +
    (o.halo ? ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.5" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function pth(d, o){ o = o || {}; return '<path d="' + d + '" fill="' + (o.f || "none") + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="' + (o.cap || "round") + '" stroke-linejoin="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function head(x, y, ang, len, fill, op){
  var a1 = ang + Math.PI - 0.42, a2 = ang + Math.PI + 0.42;
  return '<path d="M' + r1(x) + " " + r1(y) + " L" + r1(x + len * Math.cos(a1)) + " " + r1(y + len * Math.sin(a1)) + " L" + r1(x + len * Math.cos(a2)) + " " + r1(y + len * Math.sin(a2)) + ' Z" fill="' + fill + '"' + opA(op) + "/>";
}

// ---------- half-cells (course table, MV.chem.data.E0) ----------
function e0(rx){ var r = D.E0.filter(function(x){ return x[0] === rx; })[0]; return r ? r[1] : null; }
function hc(id, el, metal, nm, lab, sol, tint, tn, rx, ox, rd, n, oa, ra, who){
  return { id:id, el:el, metal:metal, gas:id === "h", nm:nm, lab:lab, sol:sol, tint:tint, tn:tn, rx:rx, ox:ox, rd:rd, n:n, oa:oa, ra:ra, who:who || el, bn:"the " + nm + " beaker", E:e0(rx) };
}
var HCL = [
  hc("mg", "Mg", true, "magnesium", "Mg | Mg²⁺", "Mg²⁺(aq)", "", "colourless", "Mg^2+ + 2e- -> Mg", [[1, "Mg^2+(aq)"]], [[1, "Mg(s)"]], 2, "Mg²⁺", "Mg"),
  hc("al", "Al", true, "aluminium", "Al | Al³⁺", "Al³⁺(aq)", "", "colourless", "Al^3+ + 3e- -> Al", [[1, "Al^3+(aq)"]], [[1, "Al(s)"]], 3, "Al³⁺", "Al"),
  hc("zn", "Zn", true, "zinc", "Zn | Zn²⁺", "Zn²⁺(aq)", "", "colourless", "Zn^2+ + 2e- -> Zn", [[1, "Zn^2+(aq)"]], [[1, "Zn(s)"]], 2, "Zn²⁺", "Zn"),
  hc("fe", "Fe", true, "iron", "Fe | Fe²⁺", "Fe²⁺(aq)", "", "colourless", "Fe^2+ + 2e- -> Fe", [[1, "Fe^2+(aq)"]], [[1, "Fe(s)"]], 2, "Fe²⁺", "Fe"),
  hc("ni", "Ni", true, "nickel", "Ni | Ni²⁺", "Ni²⁺(aq)", "", "colourless", "Ni^2+ + 2e- -> Ni", [[1, "Ni^2+(aq)"]], [[1, "Ni(s)"]], 2, "Ni²⁺", "Ni"),
  hc("sn", "Sn", true, "tin", "Sn | Sn²⁺", "Sn²⁺(aq)", "", "colourless", "Sn^2+ + 2e- -> Sn", [[1, "Sn^2+(aq)"]], [[1, "Sn(s)"]], 2, "Sn²⁺", "Sn"),
  hc("pb", "Pb", true, "lead", "Pb | Pb²⁺", "Pb²⁺(aq)", "", "colourless", "Pb^2+ + 2e- -> Pb", [[1, "Pb^2+(aq)"]], [[1, "Pb(s)"]], 2, "Pb²⁺", "Pb"),
  hc("h", "Pt", false, "hydrogen-electrode", "Pt | H₂, H⁺", "H⁺(aq), H₂(g)", "", "colourless", "2H+ + 2e- -> H2", [[2, "H+(aq)"]], [[1, "H2(g)"]], 2, "H⁺", "H₂", "the hydrogen electrode"),
  hc("cu", "Cu", true, "copper", "Cu | Cu²⁺", "Cu²⁺(aq)", "cu", "pale blue", "Cu^2+ + 2e- -> Cu", [[1, "Cu^2+(aq)"]], [[1, "Cu(s)"]], 2, "Cu²⁺", "Cu"),
  // Iodine solution is named "pale brown" (plan §5 lists only Cu²⁺ and Fe³⁺ tints; I₂(aq) is not colourless).
  hc("i", "Pt", false, "iodine", "Pt | I₂, I⁻", "I₂, I⁻(aq)", "i2", "pale brown", "I2 + 2e- -> 2I-", [[1, "I2(aq)"]], [[2, "I-(aq)"]], 2, "I₂", "I⁻", "the Pt (iodine half-cell)"),
  hc("fe3", "Pt", false, "Fe³⁺/Fe²⁺", "Pt | Fe³⁺, Fe²⁺", "Fe³⁺, Fe²⁺(aq)", "fe3", "pale yellow", "Fe^3+ + e- -> Fe^2+", [[1, "Fe^3+(aq)"]], [[1, "Fe^2+(aq)"]], 1, "Fe³⁺", "Fe²⁺", "the Pt (Fe³⁺/Fe²⁺ half-cell)"),
  hc("ag", "Ag", true, "silver", "Ag | Ag⁺", "Ag⁺(aq)", "", "colourless", "Ag+ + e- -> Ag", [[1, "Ag+(aq)"]], [[1, "Ag(s)"]], 1, "Ag⁺", "Ag")
];
// Mystery metals for Hydrogen reference mode: model values (plan, Explore and §5), not course-table data.
function myst(id, E){ return { id:id, el:id.toUpperCase(), metal:true, myst:true, nm:id.toUpperCase(), lab:"Mystery metal " + id.toUpperCase() + " (model value)", sol:id.toUpperCase() + " ions (aq)", tint:"", tn:"colourless", oa:id.toUpperCase() + " ions", ra:id.toUpperCase(), who:id.toUpperCase(), bn:"the " + id.toUpperCase() + " beaker", E:E }; }
var MYS = [myst("m1", -0.40), myst("m2", 0.50), myst("m3", -1.18)];
var HM = {}; HCL.concat(MYS).forEach(function(h){ HM[h.id] = h; });
function HCf(id){ return HM[id] || HM.zn; }
var METALS = ["mg", "al", "zn", "fe", "ni", "sn", "pb", "cu", "ag"];

// ---------- numbers and half-reactions ----------
function sg(v){ v = r2(v); return (v > 0 ? "+" : "") + fx(v, 2); }
function par(v){ return v < 0 ? "(" + fx(v, 2) + ")" : fx(v, 2); }
function subT(c, a){ return fx(c, 2) + " − " + par(a) + " = " + sg(c - a) + " V"; }
function pairT(h){ return h.oa + "/" + h.ra; }
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
function mul(list, k){ return list.map(function(x){ return [x[0] * k, x[1]]; }); }
function sideT(list){ var m = {}, order = []; list.forEach(function(x){ if (!(x[1] in m)) { m[x[1]] = 0; order.push(x[1]); } m[x[1]] += x[0]; }); return order.map(function(s){ return (m[s] === 1 ? "" : m[s]) + s; }).join(" + "); }
function eT(n){ return (n === 1 ? "" : n) + "e-"; }
function redT(h, k){ k = k || 1; return sideT(mul(h.ox, k)) + " + " + eT(h.n * k) + " -> " + sideT(mul(h.rd, k)); }
function oxT(h, k){ k = k || 1; return sideT(mul(h.rd, k)) + " -> " + sideT(mul(h.ox, k)) + " + " + eT(h.n * k); }
function mult(an, ca){ if (an.myst || ca.myst) return { a:1, c:1 }; var L = an.n * ca.n / gcd(an.n, ca.n); return { a:L / an.n, c:L / ca.n }; }
function overallT(an, ca){ var m = mult(an, ca); return sideT(mul(an.rd, m.a).concat(mul(ca.ox, m.c))) + " -> " + sideT(mul(an.ox, m.a).concat(mul(ca.rd, m.c))); }
function cellOf(L, R){
  if (L.id === R.id || L.E === R.E) return { same:true, Ec:0, anSide:null };
  var lo = L.E < R.E ? L : R, hi = lo === L ? R : L;
  return { an:lo, ca:hi, anSide:lo === L ? "L" : "R", caSide:lo === L ? "R" : "L", Ec:r2(hi.E - lo.E) };
}
function reading(c, st){ if (c.same || !st.bridge || !st.wire) return 0; return (st.lead === c.caSide ? 1 : -1) * c.Ec; }
function one(s){ var t = String(s == null ? "" : s).replace(/[a-z]+/gi, "").replace(/\s+/g, "").replace(/^\+/, ""); if (!t) return null; var v = MV.parseNum(t); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
function near(v, w, tol){ return v != null && Math.abs(v - w) <= (tol || 0) + 1e-9; }
function hrHTML(h, dir, k){
  if (h.myst) return dir === "ox" ? h.el + "(s) → " + h.el + " ions(aq) + electrons" : h.el + " ions(aq) + electrons → " + h.el + "(s)";
  return F(dir === "ox" ? oxT(h, k) : redT(h, k)) + (k > 1 ? ' <span class="gc-x" title="Multiplied to match electrons">×' + k + "</span>" : "");
}
function eOf(h){ return h.myst ? "?" : sg(h.E) + " V"; }
function afterT(c){
  var a = c.an, b = c.ca, out = [];
  if (a.metal) out.push(a.el + " electrode lighter"); else if (a.gas) out.push("H₂ used up at the Pt"); else out.push((a.tn.replace("pale ", "")) + " deepens");
  if (b.metal) out.push(b.el + " electrode heavier"); else if (b.gas) out.push("H₂ bubbles form at the Pt");
  if (b.tint) out.push(b.tn.replace("pale ", "") + " fades");
  if (a.tint && a.metal) out.push(a.tn.replace("pale ", "") + " deepens");
  return out.join("; ");
}

// @component C10 cellView — galvanic cell drawing (SVG markup for viewBox 0 0 520 344): two beakers with electrodes (metals
// cerulean, Pt grey with a "Pt" label; the hydrogen electrode has a glass tube, "H₂ in" and bubbles), solution tints named in
// words (1 px surface line keeps colourless ones visible), a KNO₃ salt bridge (in place, lifting, or absent as a dashed ghost),
// a wire (closed, or open with a switch) carrying a voltmeter, a bulb or both, ink + / − lead signs, violet e⁻ / teal NO₃⁻ /
// orange K⁺ flow (static arrows and labels always; moving dots by SMIL only without reduced motion), run-time mass and tint
// change, anode/cathode role lines with E°, P2 charge build-up signs, and quiz tags. For SCH4U 48–52 (cell notation,
// corrosion, electrolytic cells: pass an:"L"|"R" with eDir/ionAn for the run direction).
// cellSVG({L, R (half-cells: el, metal, gas, sol, tint, tn, E, myst), bridge, lift (0–1), wire, dev:"vm"|"bulb"|"both",
//   lead:"L"|"R"|null, read (number, or null for a blank voltmeter), glow (0–1), an:"L"|"R"|null (anode side, for roles), roles,
//   eDir:"L"|"R"|null (side the electrons leave), ionAn:"L"|"R"|null (side the anions move to), ionK (default true), anim,
//   k (0–1 run progress), charge, quiz (solution labels under the beakers), tags:[{x, y, t}]}) -> string
var CV = { xL:100, xR:420, bL:[50, 190], bR:[330, 470], top:160, bot:306, sol:180, elTop:70, elBot:266, wy:36, legL:160, legR:360, by:118, bb:250 };
function tintVar(t){ return t === "cu" ? "var(--gc-cu)" : t === "fe3" ? "var(--gc-fe3)" : t === "i2" ? "var(--gc-i2)" : "var(--gc-water)"; }
function beakerPath(x0, x1){ return "M" + x0 + " " + CV.top + " V" + (CV.bot - 6) + " Q" + x0 + " " + CV.bot + " " + (x0 + 6) + " " + CV.bot + " H" + (x1 - 6) + " Q" + x1 + " " + CV.bot + " " + x1 + " " + (CV.bot - 6) + " V" + CV.top; }
function electrodeSVG(h, x, w, side, coat){
  var s = "", lab = side === "L" ? { x:x - 14, a:"end" } : { x:x + 14, a:"start" };
  if (h.metal) {
    s += rect(x - w / 2, CV.elTop, w, CV.elBot - CV.elTop, "var(--at-m)", { s:"var(--ink)", sw:1 });
    if (coat > 0) s += rect(x - w / 2 - 1.5, CV.sol + 4, w + 3, CV.elBot - CV.sol - 4, "none", { s:"var(--gc-coat)", sw:1 + 2.5 * coat, op:coat });
  } else {
    s += ln(x, CV.elTop, x, 204, { c:"var(--ink)", w:2 }) + rect(x - 7, 204, 14, 58, "var(--gc-pt)", { s:"var(--ink)", sw:1 });
    if (h.gas) {
      s += pth("M" + (x - 17) + " " + (CV.bot - 34) + " V124 H" + (x + 17) + " V" + (CV.bot - 34), { c:"var(--ink-2)", w:1.5 });
      var gx = side === "L" ? x - 17 : x + 17, ox = side === "L" ? -34 : 34;
      s += ln(gx + ox, 132, gx, 132, { c:"var(--ink-2)", w:2 }) + head(gx, 132, side === "L" ? 0 : Math.PI, 7, "var(--ink-2)") + tx(gx + ox, 118, "H₂ in", { fs:11, c:"var(--ink-2)", a:side === "L" ? "start" : "end" });
      [[-4, 244], [5, 232], [-2, 220], [4, 210]].forEach(function(b){ s += circ(x + b[0], b[1], 3, "none", { s:"var(--ink-2)", sw:1.2 }); });
    }
  }
  return s + tx(lab.x, 96, h.el, { fs:14, w:700, a:lab.a });
}
function cellSVG(o){
  var L = o.L, R = o.R, s = "", k = o.k || 0, beak = { L:CV.bL, R:CV.bR }, X = { L:CV.xL, R:CV.xR }, H = { L:L, R:R };
  var anS = o.an || null, caS = anS === "L" ? "R" : anS === "R" ? "L" : null;
  ["L", "R"].forEach(function(sd){
    var h = H[sd], b = beak[sd], base = h.tint ? 0.55 : 1, op = base;
    if (h.tint && k > 0 && anS) op = sd === caS ? base * (1 - 0.6 * k) : Math.min(0.95, base * (1 + 0.6 * k));
    s += rect(b[0] + 1, CV.sol, b[1] - b[0] - 2, CV.bot - CV.sol - 1, tintVar(h.tint), { op:op }) + ln(b[0] + 1, CV.sol, b[1] - 1, CV.sol, { c:"var(--ink-2)", w:1 });
  });
  // salt bridge
  var bp = "M" + CV.legL + " " + CV.bb + " V" + CV.by + " H" + CV.legR + " V" + CV.bb;
  if (o.bridge) {
    var dy = -(o.lift || 0) * 46, bo = 1 - 0.5 * (o.lift || 0);
    s += '<g transform="translate(0 ' + r1(dy) + ')"' + opA(bo) + ">" + pth(bp, { c:"var(--ink-2)", w:24, cap:"butt" }) + pth(bp, { c:"var(--gc-bridge)", w:20, cap:"butt" }) +
      tx(260, CV.by, "KNO₃ salt bridge", { fs:11, c:"var(--ink-2)" }) + "</g>";
  } else s += pth(bp, { c:"var(--ink-2)", w:1.5, d:"5 5" }) + tx(260, CV.by, "no salt bridge", { fs:11, c:"var(--ink-2)", halo:true });
  // electrodes
  ["L", "R"].forEach(function(sd){
    var h = H[sd], w = 16, coat = 0;
    if (h.metal && anS && k > 0) { if (sd === anS) w = 16 - 8 * k; else { w = 16 + 6 * k; coat = k; } }
    s += electrodeSVG(h, X[sd], w, sd, coat);
  });
  ["L", "R"].forEach(function(sd){ s += pth(beakerPath(beak[sd][0], beak[sd][1]), { c:"var(--ink)", w:2 }); });
  // wire
  var wp = "M" + CV.xL + " " + CV.elTop + " V" + CV.wy + " H" + CV.xR + " V" + CV.elTop;
  if (o.wire) s += pth(wp, { c:"var(--ink)", w:2.5 });
  else s += pth("M" + CV.xL + " " + CV.elTop + " V" + CV.wy + " H150", { c:"var(--ink)", w:2.5 }) + pth("M184 " + CV.wy + " H" + CV.xR + " V" + CV.elTop, { c:"var(--ink)", w:2.5 }) +
    ln(150, CV.wy, 178, CV.wy - 18, { w:2.5 }) + circ(150, CV.wy, 3, "var(--ink)") + circ(184, CV.wy, 3, "var(--ink)") + tx(167, CV.wy + 14, "open", { fs:11, c:"var(--ink-2)" });
  // flow: electrons in the wire, ions in the bridge
  if (o.eDir) {
    var eL = o.eDir === "L", ep = eL ? wp : "M" + CV.xR + " " + CV.elTop + " V" + CV.wy + " H" + CV.xL + " V" + CV.elTop;
    [126, 394].forEach(function(x){ s += head(x + (eL ? 8 : -8), CV.wy, eL ? 0 : Math.PI, 10, "var(--ec-e)") + tx(x, CV.wy - 13, "e⁻", { fs:13, w:700, c:"var(--ec-e)" }); });
    if (o.anim) for (var i = 0; i < 5; i++) s += '<circle r="4.5" fill="var(--ec-e)"><animateMotion dur="3s" begin="-' + (i * 0.6) + 's" repeatCount="indefinite" path="' + ep + '"/></circle>';
    else [108, 168, 352, 412].forEach(function(x){ s += circ(eL ? x : 520 - x, CV.wy, 4, "var(--ec-e)"); });
  }
  if (o.ionAn && o.bridge && !o.lift) {
    var aL = o.ionAn === "L", xa = aL ? CV.legL : CV.legR, xc = aL ? CV.legR : CV.legL, ay = 94, dirA = aL ? -1 : 1;
    s += ln(250, ay, 250 + dirA * 64, ay, { c:"var(--ec-an)", w:2.5 }) + head(250 + dirA * 70, ay, aL ? Math.PI : 0, 9, "var(--ec-an)") + tx(250 + dirA * 34, ay - 12, "NO₃⁻", { fs:12, w:700, c:"var(--ec-an)" });
    if (o.ionK !== false) s += ln(270, ay, 270 - dirA * 64, ay, { c:"var(--ec-cat)", w:2.5 }) + head(270 - dirA * 70, ay, aL ? 0 : Math.PI, 9, "var(--ec-cat)") + tx(270 - dirA * 34, ay - 12, "K⁺", { fs:12, w:700, c:"var(--ec-cat)" });
    var pa = "M" + xc + " 240 V" + CV.by + " H" + xa + " V240", pk = "M" + xa + " 240 V" + CV.by + " H" + xc + " V240";
    if (o.anim) for (var j = 0; j < 3; j++) {
      s += '<circle r="4" fill="var(--ec-an)"><animateMotion dur="5s" begin="-' + (j * 1.66) + 's" repeatCount="indefinite" path="' + pa + '"/></circle>';
      if (o.ionK !== false) s += '<circle r="4" fill="var(--ec-cat)"><animateMotion dur="5s" begin="-' + (j * 1.66 + 0.8) + 's" repeatCount="indefinite" path="' + pk + '"/></circle>';
    } else {
      s += circ(xa, 150, 4, "var(--ec-an)") + circ(xa, 180, 4, "var(--ec-an)");
      if (o.ionK !== false) s += circ(xc, 150, 4, "var(--ec-cat)") + circ(xc, 180, 4, "var(--ec-cat)");
    }
  }
  // devices
  var dev = o.dev || "vm", mx = dev === "both" ? 225 : 260, bx = dev === "both" ? 305 : 260;
  if (dev === "vm" || dev === "both") {
    s += circ(mx, CV.wy, 24, "var(--sheet)", { s:"var(--ink)", sw:2 }) + tx(mx, CV.wy - 13, "V", { fs:10, c:"var(--ink-2)", w:700 }) +
      tx(mx, CV.wy + 3, o.read == null ? "" : sg(o.read) + " V", { fs:12, w:700 });
    if (o.lead) {
      var pl = o.lead === "L";
      s += tx(mx - 31, CV.wy - 16, pl ? "+" : "−", { fs:16, w:700 }) + tx(mx + 31, CV.wy - 16, pl ? "−" : "+", { fs:16, w:700 });
    }
  }
  if (dev === "bulb" || dev === "both") {
    var g = o.glow || 0;
    if (g > 0) s += circ(bx, CV.wy - 6, 26, "var(--gc-glow)", { op:0.35 * g });
    s += circ(bx, CV.wy - 6, 14, g > 0 ? "var(--gc-glow)" : "var(--sheet)", { s:"var(--ink)", sw:1.5 }) +
      pth("M" + (bx - 6) + " " + (CV.wy - 2) + " L" + (bx - 3) + " " + (CV.wy - 12) + " L" + bx + " " + (CV.wy - 4) + " L" + (bx + 3) + " " + (CV.wy - 12) + " L" + (bx + 6) + " " + (CV.wy - 2), { c:"var(--ink)", w:1.3 }) +
      rect(bx - 7, CV.wy + 7, 14, 7, "var(--ink-2)", { rx:1.5 });
  }
  // charge build-up without a bridge (P2)
  if (o.charge && anS) {
    s += tx((beak[anS][0] + beak[anS][1]) / 2, 214, "+   +   +", { fs:18, w:700, halo:true });
    s += tx((beak[caS][0] + beak[caS][1]) / 2, 214, "−   −   −", { fs:18, w:700, halo:true });
  }
  // solution labels, roles
  ["L", "R"].forEach(function(sd){
    var h = H[sd], cx = (beak[sd][0] + beak[sd][1]) / 2, y1 = o.quiz ? 322 : 282, y2 = o.quiz ? 337 : 296;
    s += tx(cx, y1, h.sol, { fs:12, w:700, halo:true }) + tx(cx, y2, h.tn, { fs:11, c:"var(--ink-2)", halo:true });
    if (o.roles && !o.quiz) {
      var role = !anS ? "no reaction" : sd === anS ? "anode (−)" : "cathode (+)";
      s += tx(cx, 321, role, { fs:13, w:700 }) + tx(cx, 337, "E° = " + (h.myst ? "?" : MV.plain(sg(h.E)) + " V"), { fs:12, c:"var(--ink-2)" });
    }
  });
  (o.tags || []).forEach(function(t){ s += tx(t.x, t.y, t.t, { fs:12.5, w:700, c:"var(--hi-ink)", halo:true }); });
  return s;
}
function cellDescribe(o, c){
  var L = o.L, R = o.R, t = "Galvanic cell: left beaker " + L.lab + " (" + L.tn + "), right beaker " + R.lab + " (" + R.tn + "). ";
  t += o.bridge ? "Salt bridge in place. " : "No salt bridge. ";
  t += o.wire ? "Wire connected" : "Wire open";
  t += o.read != null ? "; voltmeter reads " + MV.plain(sg(o.read)) + " V. " : ". ";
  if (o.roles && c && !c.same && o.an) t += "Anode: " + (c.an.lab) + "; cathode: " + c.ca.lab + ". ";
  if (o.eDir) t += "Electrons flow through the wire from the " + (o.eDir === "L" ? "left" : "right") + " electrode to the " + (o.eDir === "L" ? "right" : "left") + ". ";
  if (o.ionAn && o.bridge) t += "NO₃⁻ ions move toward the " + (o.ionAn === "L" ? "left" : "right") + " beaker" + (o.ionK === false ? "" : ", K⁺ ions toward the " + (o.ionAn === "L" ? "right" : "left") + " beaker") + ". ";
  if (o.charge) t += "Charge builds up: + in the anode beaker, − in the cathode beaker. ";
  return t;
}

// @component C10 stripBeaker — one beaker with a metal strip dropped into a solution (box 0 0 200 220): the strip lowers,
// then a coating (deposited metal outline in --gc-coat), H₂ bubbles or a fading tint shows the reaction; optional
// thermometer (the hero). stripSVG({m, s (half-cells), drop (0–1), k (0–1), res:"coat"|"gas"|"fade"|"none", therm (0–1 or null), lab})
function stripSVG(o){
  var m = o.m, so = o.s, k = o.k || 0, d = o.drop == null ? 1 : o.drop, off = (1 - d) * 46, h = "";
  var op = so.tint ? (o.res === "fade" || o.res === "coat" ? 0.55 * (1 - 0.6 * k) : 0.55) : 1;
  h += rect(31, 100, 138, 105, tintVar(so.tint), { op:op }) + ln(31, 100, 169, 100, { c:"var(--ink-2)", w:1 });
  h += rect(92, 40 - off, 16, 146, "var(--at-m)", { s:"var(--ink)", sw:1 }) + tx(100, 28 - off, m.el, { fs:14, w:700 });
  if (o.res === "coat" && k > 0) {
    h += rect(90.5, 104, 19, 83 - off, "none", { s:"var(--gc-coat)", sw:1 + 3 * k, op:k });
    [[89, 120], [111, 136], [89, 152], [111, 168], [90, 178], [110, 112]].forEach(function(p){ h += circ(p[0], p[1] - off, 2.6, "var(--gc-coat)", { op:k }); });
  }
  if (o.res === "gas" && k > 0) [[84, 170, 0], [117, 150, 0.2], [82, 130, 0.4], [118, 116, 0.6], [86, 108, 0.8]].forEach(function(p){ var t = clamp((k - p[2]) / 0.2, 0, 1); if (t > 0) h += circ(p[0], p[1] - 10 * t, 3.4, "none", { s:"var(--ink-2)", sw:1.3, op:t }); });
  if (o.therm != null) {
    var ht = 30 + 60 * o.therm;
    h += rect(144, 30, 10, 156, "var(--sheet)", { s:"var(--ink-2)", sw:1.3, rx:5 }) + rect(146.5, 186 - ht, 5, ht, "var(--gc-hot)") + circ(149, 190, 8, "var(--gc-hot)", { s:"var(--ink-2)", sw:1.3 }) + tx(149, 18, "°C", { fs:11, c:"var(--ink-2)" });
  }
  h += pth("M30 70 V200 Q30 206 36 206 H164 Q170 206 170 200 V70", { c:"var(--ink)", w:2 });
  if (o.lab !== false) h += tx(60, 192, so.oa, { fs:12, w:700, halo:true });
  return h;
}
function stripRes(m, so){
  if (m.id === so.id) return { res:"none", Ec:0, same:true };
  var Ec = r2(so.E - m.E);
  if (Ec <= 0) return { res:"none", Ec:Ec };
  return { res:so.gas ? "gas" : so.metal ? "coat" : "fade", Ec:Ec };
}
function stripResT(m, so, r){
  if (r.same) return "Same metal as its own ions: nothing changes.";
  if (r.res === "none") return "Nothing happens: no coating, no bubbles.";
  if (r.res === "gas") return "Bubbles of H₂ form on the " + m.el + " strip.";
  if (r.res === "coat") return "A coating of " + so.ra + " forms on the " + m.el + " strip" + (so.tint ? " and the " + so.tn.replace("pale ", "") + " colour fades." : ".");
  return "The " + m.el + " strip slowly dissolves and the " + so.tn.replace("pale ", "") + " colour fades.";
}
function stripSubT(m, so){ return ECH + " = " + EH + "(" + pairT(so) + ") − " + EH + "(" + pairT(m) + ") = " + subT(so.E, m.E); }

// ---------- hero ----------
function hero(f){
  var svg = $("#gc-hx-svg"), ctr = $("#gc-hx-ctr"), rep = $("#gc-hx-replay"), cap = f.cap;
  if (!svg) return;
  var zn = HM.zn, cu = HM.cu, Ec = cellOf(zn, cu).Ec, run = 0, st;
  function reset(){ st = { a:1, b:0, k:0, fl:0, m:-1 }; }
  function draw(){
    var h = "";
    if (st.a > 0.01) h += '<g' + opA(st.a) + '><g transform="translate(150 40) scale(1.1)">' + stripSVG({ m:zn, s:cu, drop:1, k:st.k, res:"coat", therm:st.k }) + "</g></g>";
    if (st.b > 0.01) h += "<g" + opA(st.b) + ">" + cellSVG({ L:zn, R:cu, bridge:true, wire:true, dev:"both", lead:"R", read:st.m < 0 ? null : r2(Ec * st.m), glow:Math.max(0, st.m), an:"L", roles:st.fl > 0,
      eDir:st.fl ? "L" : null, ionAn:st.fl ? "L" : null, anim:st.fl > 0 && !MV.reduceMotion }) + "</g>";
    svg.innerHTML = h;
  }
  function final(){ st = { a:0, b:1, k:1, fl:1, m:1 }; draw(); ctr.innerHTML = "The voltmeter reads +1.10 V and the bulb glows: the electrons now do work on their way round."; if (cap) cap.textContent = "The anode gives electrons; the cathode takes them."; rep.hidden = false; }
  function play(){
    var id = ++run; reset(); rep.hidden = true; if (cap) cap.textContent = ""; draw();
    function ok(){ return id === run; }
    ctr.innerHTML = "Zinc in pale blue Cu<sup>2+</sup> solution: copper coats the zinc and the thermometer creeps up. The energy is lost as heat.";
    MV.tween({ dur:2600, ease:LIN, step:function(t){ if (!ok()) return; st.k = t; draw(); }, done:function(){
      if (!ok()) return;
      MV.wait(700, function(){
        if (!ok()) return;
        ctr.innerHTML = "Now split the reaction: two beakers, joined by a wire and a salt bridge.";
        MV.tween({ dur:900, step:function(t){ if (!ok()) return; st.a = 1 - t; st.b = t; draw(); }, done:function(){
          if (!ok()) return;
          MV.wait(700, function(){
            if (!ok()) return;
            st.fl = 1; draw();
            ctr.innerHTML = "Violet electrons stream through the wire from Zn to Cu. Teal NO<sub>3</sub><sup>−</sup> ions drift into the zinc beaker and orange K<sup>+</sup> ions into the copper beaker.";
            MV.wait(2800, function(){
              if (!ok()) return;
              MV.tween({ dur:1300, step:function(t){ if (!ok()) return; st.m = t; draw(); }, done:function(){ if (ok()) final(); } });
            });
          });
        } });
      });
    } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Cell builder (C10) ----------
function optList(ids, sel){ return ids.map(function(id){ var h = HM[id]; return '<option value="' + id + '"' + (id === sel ? " selected" : "") + ">" + esc(h.lab + (h.myst ? "" : " (" + MV.plain(sg(h.E)) + " V)")) + "</option>"; }).join(""); }
var ALL = HCL.map(function(h){ return h.id; });
function explore(host, api){
  var S = api.S, C = api.content;
  if (["build", "she", "react"].indexOf(S.mode) < 0) S.mode = "build";
  if (!HM[S.L] || HM[S.L].myst) S.L = "zn"; if (!HM[S.R] || HM[S.R].myst) S.R = "cu";
  if (["cu", "m1", "m2", "m3"].indexOf(S.sheR) < 0) S.sheR = "m1";
  S.bridge = S.bridge !== false; S.wire = S.wire !== false; if (["vm", "bulb"].indexOf(S.dev) < 0) S.dev = "vm"; if (["L", "R"].indexOf(S.lead) < 0) S.lead = "L";
  S.t = clamp(Math.round((+S.t || 0) / 10) * 10, 0, 60);
  S.rx = S.rx && typeof S.rx === "object" ? S.rx : {}; if (METALS.indexOf(S.rx.m) < 0) S.rx.m = "zn"; if (ALL.indexOf(S.rx.s) < 0) S.rx.s = "cu"; S.rx.done = !!S.rx.done;
  S.tc3 = S.tc3 && typeof S.tc3 === "object" ? S.tc3 : {}; ["e", "c", "an"].forEach(function(k){ if (typeof S.tc3[k] !== "string") S.tc3[k] = ""; });
  var busy = false, locked = false, tw = null, lift = 0, rxK = S.rx.done ? 1 : 0, mask = false, note = "", seq = 0;

  host.innerHTML = '<p class="how gc-how">' + C.how + '</p><div class="gc-modes"></div><div class="gc-grid">' +
    '<div class="gc-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="gc-box"><svg class="gc-svg" id="gc-svg" viewBox="0 0 520 344" role="img" aria-label=""></svg></div><p class="gc-cap" aria-live="polite"></p></div>' +
    '<div class="gc-side">' +
      '<div class="gc-c" data-for="build"><div class="gc-picks"><div class="gc-pick"><label for="gc-L">Left beaker</label><select id="gc-L" data-sel="L">' + optList(ALL, S.L) + '</select></div>' +
        '<div class="gc-pick"><label for="gc-R">Right beaker</label><select id="gc-R" data-sel="R">' + optList(ALL, S.R) + '</select></div></div>' +
        '<button type="button" class="btn ghost sm" data-act="swap" data-k="swap">Swap beakers</button></div>' +
      '<div class="gc-c" data-for="she"><p class="tiny muted">' + C.sheNote + '</p><div class="gc-pick"><label for="gc-S">Right beaker</label><select id="gc-S" data-sel="S">' + optList(["cu", "m1", "m2", "m3"], S.sheR) + "</select></div>" +
        '<div class="gc-tc3"><p class="gc-sl"><strong>Challenge 3 answers</strong></p>' +
          '<div class="numrow"><label for="gc-e1">' + EH + '(M1) =</label><input class="numin" id="gc-e1" type="number" step="any" data-tc="e" autocomplete="off"><span>V</span></div>' +
          '<div class="numrow"><label for="gc-e2">' + ECH + ' of an M1–Cu cell =</label><input class="numin" id="gc-e2" type="text" inputmode="decimal" data-tc="c" autocomplete="off" spellcheck="false"><span>V</span></div>' +
          '<div class="gc-tc3an"></div></div></div>' +
      '<div class="gc-c" data-for="cell"><div class="gc-sws"></div><div class="gc-dev"></div><div class="gc-lead"></div>' +
        '<div class="gc-run"><label for="gc-t">Run time: <output id="gc-tout">0 min</output></label><input type="range" id="gc-t" min="0" max="60" step="10" value="' + S.t + '"></div></div>' +
      '<div class="gc-c" data-for="react"><p class="tiny muted">' + C.reactNote + '</p><div class="gc-picks"><div class="gc-pick"><label for="gc-M">Metal strip</label><select id="gc-M" data-sel="M">' +
        METALS.map(function(id){ return '<option value="' + id + '">' + HM[id].el + " metal</option>"; }).join("") + '</select></div>' +
        '<div class="gc-pick"><label for="gc-X">Solution</label><select id="gc-X" data-sel="X">' + ALL.map(function(id){ return '<option value="' + id + '">' + esc(HM[id].oa + "(aq)" + (HM[id].tint ? ", " + HM[id].tn : "")) + "</option>"; }).join("") + "</select></div></div>" +
        '<button type="button" class="btn primary sm" data-act="drop" data-k="drop">Drop the strip</button></div>' +
      '<dl class="read gc-read" aria-live="polite"></dl></div></div><div class="gc-tabs"></div>';
  var svg = $("#gc-svg", host);
  MV.chem.tablePanel($(".gc-tabs", host), "e0", { title:"Course data table: standard reduction potentials" });

  var RG = {};
  RG.mode = radios($(".gc-modes", host), { label:"Mode", aria:"Cell builder mode", options:C.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; mask = false; note = ""; api.save(); paint(); } });
  RG.dev = radios($(".gc-dev", host), { label:"Device", aria:"Device in the wire", options:[{ id:"vm", t:"Voltmeter" }, { id:"bulb", t:"Bulb" }], value:S.dev, onChange:function(v){ S.dev = v; userChange(); } });
  RG.lead = radios($(".gc-lead", host), { label:"Voltmeter leads", aria:"Voltmeter leads", options:[{ id:"L", t:"+ lead on left" }, { id:"R", t:"+ lead on right" }], value:S.lead, onChange:function(v){ S.lead = v; userChange(); } });
  RG.an = radios($(".gc-tc3an", host), { label:"Anode of the M1–Cu cell:", cls:"chips", aria:"Anode of the M1–Cu cell", options:[{ id:"m1", t:"M1" }, { id:"cu", t:"Cu" }], value:S.tc3.an, onChange:function(v){ S.tc3.an = v; api.save(); MV.changed(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.dev.set(S.dev); RG.lead.set(S.lead); }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paintCtl(); }
  function userChange(){ if (mask) mask = false; note = ""; api.save(); paint(); }
  var e1 = $("#gc-e1", host), e2 = $("#gc-e2", host); e1.value = S.tc3.e; e2.value = S.tc3.c;

  function paintCtl(){
    var dis = locked || busy;
    MV.keepFocus($(".gc-sws", host), function(){
      $(".gc-sws", host).innerHTML = [["bridge", "Salt bridge (KNO<sub>3</sub>)"], ["wire", "Wire connected"]].map(function(x){
        var on = !!S[x[0]]; return '<button type="button" class="gc-sw" role="switch" aria-checked="' + on + '" data-sw="' + x[0] + '" data-k="sw' + x[0] + '"' + (dis ? " disabled" : "") + '><span class="gc-track" aria-hidden="true"><span class="gc-knob"></span></span><span>' + x[1] + "</span></button>";
      }).join("");
    });
    $$("select, input, [data-act]", host).forEach(function(el){ if (el.closest(".chem-tab")) return; el.disabled = dis; });
    $("#gc-L", host).value = S.L; $("#gc-R", host).value = S.R; $("#gc-S", host).value = S.sheR; $("#gc-M", host).value = S.rx.m; $("#gc-X", host).value = S.rx.s;
    $("#gc-t", host).value = String(S.t); $("#gc-tout", host).textContent = Math.round(S.t) + " min";
  }
  function pair(){ return S.mode === "she" ? { L:HM.h, R:HM[S.sheR] } : { L:HM[S.L], R:HM[S.R] }; }
  function cellState(){
    var p = pair(), c = cellOf(p.L, p.R), flows = !c.same && S.bridge && S.wire, rd = reading(c, S);
    return { p:p, c:c, flows:flows, rd:rd };
  }
  function drawCell(){
    var z = cellState(), c = z.c, o = { L:z.p.L, R:z.p.R, bridge:S.bridge, lift:lift, wire:S.wire, dev:S.dev, lead:S.lead,
      read:mask || S.dev !== "vm" ? null : r2(z.rd), glow:S.dev === "bulb" && z.flows && !mask ? clamp(c.Ec / 1.2, 0.35, 1) : 0,
      an:mask ? null : c.anSide, roles:!mask, eDir:z.flows && !mask ? c.anSide : null, ionAn:z.flows && !mask ? c.anSide : null,
      anim:z.flows && !mask && !MV.reduceMotion, k:z.flows ? S.t / 60 : 0, charge:!S.bridge && S.wire && !c.same && !mask };
    svg.innerHTML = cellSVG(o); svg.setAttribute("aria-label", cellDescribe(o, c));
  }
  function drawReact(){
    var m = HM[S.rx.m], so = HM[S.rx.s], r = stripRes(m, so);
    svg.innerHTML = '<g transform="translate(150 20) scale(1.4)">' + stripSVG({ m:m, s:so, drop:S.rx.done || busy ? 1 : 0, k:rxK, res:r.res }) + "</g>";
    svg.setAttribute("aria-label", "A " + m.el + " strip " + (S.rx.done ? "in " : "held above ") + MV.plain(so.oa) + "(aq), " + so.tn + ". " + (S.rx.done ? stripResT(m, so, r) : ""));
  }
  function paintRead(){
    var rows = [];
    if (S.mode === "react") {
      var m = HM[S.rx.m], so = HM[S.rx.s], r = stripRes(m, so);
      rows.push(["Metal strip", m.el + "(s)"], ["Solution", so.oa + "(aq), " + so.tn], ["Result", S.rx.done ? stripResT(m, so, r) : muted("drop the strip to find out")],
        ["Check it with data", S.rx.done ? (r.same ? "Same half-cell: no difference." : stripSubT(m, so) + (r.Ec > 0 ? ": spontaneous" : ": not spontaneous")) : muted("—")]);
    } else {
      var z = cellState(), c = z.c, Q = muted("?");
      if (c.same) rows.push(["Half-cells", "Both " + z.p.L.lab], [ECH, "0.00 V: no difference in " + EH + ", so no reaction"], ["Voltmeter reads", "0.00 V"]);
      else {
        var m2 = mult(c.an, c.ca), my = c.an.myst || c.ca.myst;
        rows.push(["Anode (oxidation)", mask ? Q : hrHTML(c.an, "ox", m2.a) + " · negative electrode · " + EH + " = " + eOf(c.an)],
          ["Cathode (reduction)", mask ? Q : hrHTML(c.ca, "red", m2.c) + " · positive electrode · " + EH + " = " + eOf(c.ca) + (m2.c > 1 || m2.a > 1 ? ' <span class="muted">(unchanged by ×' + Math.max(m2.a, m2.c) + ")</span>" : "")],
          [ECH, mask ? Q : my ? fx(c.Ec, 2) + " V (the size of the voltmeter reading); " + EH + "(" + (c.an.myst ? c.an.el : c.ca.el) + ") = ? Use the electron direction." : subT(c.ca.E, c.an.E)]);
        if (S.dev === "vm") rows.push(["Voltmeter reads", mask ? Q : sg(z.rd) + " V" + (z.rd < 0 ? " (leads reversed)" : !z.flows ? " (circuit open)" : "")]);
        else rows.push(["Bulb", mask ? Q : z.flows ? (c.Ec >= 0.5 ? "glows" : "glows dimly") : "off (circuit open)"]);
        rows.push(["Electron flow", mask ? Q : z.flows ? "Through the wire, " + c.an.who + " → " + c.ca.who : "None: " + (!S.bridge ? "no salt bridge, so charge builds up and stops them" : "the wire is open")],
          ["Salt bridge", !S.bridge ? "Removed: no ions can move" : mask ? Q : "NO<sub>3</sub><sup>−</sup> → " + c.an.bn + "; K<sup>+</sup> → " + c.ca.bn],
          ["Overall reaction", mask ? Q : my ? (c.an.myst ? c.an.el + " is oxidized; H<sup>+</sup> is reduced to H<sub>2</sub>" : "H<sub>2</sub> is oxidized to H<sup>+</sup>; " + c.ca.el + " ions are reduced to " + c.ca.el) : F(overallT(c.an, c.ca))],
          ["After run time", !z.flows ? muted("no current, so no change") : S.t === 0 ? muted("run time 0 min: no change yet") : S.t + " min: " + afterT(c)]);
      }
    }
    $(".gc-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var t = "";
    if (S.mode === "react") t = busy ? "The strip goes in…" : S.rx.done ? stripResT(HM[S.rx.m], HM[S.rx.s], stripRes(HM[S.rx.m], HM[S.rx.s])) : "Choose a metal and a solution, then press <strong>Drop the strip</strong>.";
    else {
      var z = cellState(), c = z.c;
      if (mask) t = "Make your prediction.";
      else if (c.same) t = "Both beakers hold the same half-cell: no difference in " + EH + ", so 0.00 V and no reaction.";
      else if (!S.bridge) t = "No salt bridge: charge would build up in each beaker (+ at the anode, − at the cathode), so the electrons stop almost at once. 0.00 V.";
      else if (!S.wire) t = "The wire is open: the electrons have no path. 0.00 V.";
      else t = "Electrons leave " + c.an.who + " (the anode) through the wire; NO<sub>3</sub><sup>−</sup> drifts toward the anode and K<sup>+</sup> toward the cathode.";
    }
    $(".gc-cap", host).innerHTML = t + (note && !busy ? " <strong>" + note + "</strong>" : "");
  }
  function paint(){
    var m = S.mode;
    $$(".gc-c", host).forEach(function(p){ var f = p.dataset.for; p.hidden = !(f === m || (f === "cell" && m !== "react")); });
    if (m === "react") drawReact(); else drawCell();
    paintRead(); paintCap(); paintCtl();
    MV.changed();
  }

  host.addEventListener("change", function(e){
    var sel = e.target.dataset && e.target.dataset.sel; if (!sel || locked || busy) return;
    var v = e.target.value;
    if (sel === "L") S.L = v; else if (sel === "R") S.R = v; else if (sel === "S") S.sheR = v;
    else if (sel === "M") { S.rx.m = v; S.rx.done = false; rxK = 0; } else if (sel === "X") { S.rx.s = v; S.rx.done = false; rxK = 0; }
    userChange();
  });
  host.addEventListener("input", function(e){
    if (e.target.id === "gc-t") { if (locked || busy) return; S.t = +e.target.value; userChange(); return; }
    var k = e.target.dataset && e.target.dataset.tc; if (!k) return;
    S.tc3[k] = e.target.value; api.save(); MV.changed();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy || !host.contains(b)) return;
    if (b.dataset.sw) { S[b.dataset.sw] = !S[b.dataset.sw]; lift = 0; userChange(); return; }
    var a = b.dataset.act;
    if (a === "swap") { var t = S.L; S.L = S.R; S.R = t; S.lead = S.lead === "L" ? "R" : "L"; RG.lead.set(S.lead); userChange(); }
    else if (a === "drop") drop();
  });

  // ----- animations -----
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } busy = false; lift = 0; }
  function begin(){ cancelAnim(); busy = true; lock(true); return seq; }
  function drop(){
    var my = begin(); rxK = 0; S.rx.done = false; paint();
    tw = MV.tween({ dur:1600, ease:LIN, step:function(t){ if (my !== seq) return; rxK = t; drawReact(); }, done:function(){
      if (my !== seq) return; tw = null; busy = false; rxK = 1; S.rx.done = true; api.save(); lock(false); paint();
    } });
  }

  // ----- predictions -----
  function setCell(L, R){ S.mode = "build"; S.L = L; S.R = R; S.bridge = true; S.wire = true; S.dev = "vm"; S.lead = "R"; S.t = 0; }
  var hooks = {
    start:function(p){
      cancelAnim(); note = ""; mask = p.id === "p3" || p.id === "p4";
      if (p.id === "p1" || p.id === "p2") setCell("zn", "cu");
      else if (p.id === "p3") setCell("cu", "ag");
      else { setCell("zn", "cu"); S.mode = "she"; S.sheR = "cu"; }
      syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      var my = begin();
      function fin(n){ if (my !== seq) return; tw = null; note = n || ""; mask = false; busy = false; lift = 0; api.save(); lock(false); paint(); MV.wait(150, done); }
      if (p.id === "p1") tw = MV.tween({ dur:2000, ease:LIN, step:function(t){ if (my !== seq) return; S.t = Math.round(30 * t); drawCell(); $("#gc-t", host).value = String(Math.round(S.t / 10) * 10); $("#gc-tout", host).textContent = S.t + " min"; }, done:function(){ S.t = 30; fin("The Zn strip thinned; the Cu strip grew a fresh coating."); } });
      else if (p.id === "p2") tw = MV.tween({ dur:1400, step:function(t){ if (my !== seq) return; lift = t; drawCell(); }, done:function(){ S.bridge = false; lift = 0; fin("Bridge out: + builds up in the zinc beaker and − in the copper beaker. The voltmeter reads 0.00 V."); } });
      else if (p.id === "p3") { mask = false; paint(); lock(true); MV.wait(900, function(){ fin("0.80 − 0.34 = 0.46 V. The ×2 on silver’s half-reaction leaves its " + EH + " at +0.80 V."); }); }
      else { mask = false; paint(); lock(true); MV.wait(900, function(){ fin("H<sub>2</sub> → 2H<sup>+</sup> + 2e<sup>−</sup> at the Pt; Cu<sup>2+</sup> + 2e<sup>−</sup> → Cu. The voltmeter reads 0.34 V."); }); }
    }
  };

  // ----- challenges -----
  function chal(id){
    if (id === "tc1") {
      if (S.mode !== "build") return { ok:false, msg:"Use Build mode." };
      if ([S.L, S.R].sort().join() !== "cu,zn") return { ok:false, msg:"Check that you chose Zn and Cu." };
      if (!S.bridge || !S.wire) return { ok:false, msg:"0.00 V: the circuit isn’t complete." };
      if (S.dev !== "vm") return { ok:false, msg:"Switch the device to the voltmeter so you can read it." };
      return reading(cellOf(HM[S.L], HM[S.R]), S) > 0 ? { ok:true } : { ok:false, msg:"The + lead belongs on the positive terminal, the cathode." };
    }
    if (id === "tc2") {
      if (S.mode !== "build") return { ok:false, msg:"Use Build mode." };
      if (S.L === S.R) return { ok:false, msg:"Choose two different half-cells." };
      var k = [S.L, S.R].sort().join(), Ec = cellOf(HM[S.L], HM[S.R]).Ec;
      if (k === "cu,zn") return { ok:false, msg:"That’s the Zn–Cu cell. Build a different one." };
      if (Ec >= 1.00 - 1e-9 && Ec <= 1.20 + 1e-9) return { ok:true };
      if (k === "ag,fe") return { ok:false, msg:"Close, but over 1.20 V." };
      if (k === "i,zn") return { ok:false, msg:"Too high." };
      if (k === "al,zn") return { ok:false, msg:"Too low." };
      return { ok:false, msg:(Ec > 1.2 ? "Too high: " : "Too low: ") + fx(Ec, 2) + " V." };
    }
    if (id === "tc3") {
      var T = S.tc3, ev = one(T.e), cv = one(T.c);
      if (ev == null && cv == null && !T.an) return { ok:false };
      if (ev == null) return { ok:false, msg:"Enter " + EH + "(M1) in Hydrogen reference mode." };
      if (near(ev, 0.40, 0.005)) return { ok:false, msg:"Electrons flowed <strong>from</strong> M1 to the hydrogen electrode, so M1 was oxidized: its " + EH + " is below 0." };
      if (!near(ev, -0.40, 0.01)) return { ok:false, msg:"Check " + EH + "(M1): the voltmeter shows how far M1 is from 0.00 V, and the electron direction shows which side." };
      if (cv == null) return { ok:false, msg:"Enter " + ECH + " for the M1–Cu cell." };
      if (near(cv, 0.06, 0.005)) return { ok:false, msg:"Subtract the anode from the cathode: 0.34 − (−0.40)." };
      if (!near(cv, 0.74, 0.01)) return { ok:false, msg:ECH + " = " + EH + "<sub>cathode</sub> − " + EH + "<sub>anode</sub>, using " + EH + "(Cu) = +0.34 V." };
      if (T.an === "cu") return { ok:false, msg:"Cu has the higher " + EH + ", so it’s the cathode." };
      if (T.an !== "m1") return { ok:false, msg:"Choose the anode of the M1–Cu cell." };
      return { ok:true };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Will it react? ----------
function sheSVG(){
  var x = 130, h = "";
  h += rect(61, 100, 138, 105, "var(--gc-water)") + ln(61, 100, 199, 100, { c:"var(--ink-2)", w:1 });
  h += ln(x, 20, x, 140, { w:2 }) + rect(x - 8, 140, 16, 52, "var(--gc-pt)", { s:"var(--ink)", sw:1 }) + tx(x + 14, 166, "Pt", { fs:13, w:700, a:"start", halo:true });
  h += pth("M" + (x - 22) + " 196 V56 H" + (x + 22) + " V196", { c:"var(--ink-2)", w:1.5 });
  h += ln(x - 60, 66, x - 22, 66, { c:"var(--ink-2)", w:2 }) + head(x - 22, 66, 0, 7, "var(--ink-2)") + tx(x - 62, 52, "H₂ in, 100 kPa", { fs:11, a:"start", c:"var(--ink-2)" });
  [[-5, 186], [6, 174], [-3, 160], [5, 148]].forEach(function(b){ h += circ(x + b[0], b[1], 3.2, "none", { s:"var(--ink-2)", sw:1.2 }); });
  h += pth("M60 70 V200 Q60 206 66 206 H194 Q200 206 200 200 V70", { w:2 });
  h += tx(130, 222, "1.0 mol/L H⁺(aq)", { fs:12, w:700 }) + tx(130, 240, "E° = 0.00 V (by agreement)", { fs:12, c:"var(--ink-2)" });
  return h;
}
function part3(host, api){
  var S = api.S, C = api.content, TR = C.trials, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {};
  TR.forEach(function(t){ var x = S.s1[t.id]; S.s1[t.id] = { p:x && (x.p === "y" || x.p === "n") ? x.p : "", w:!!(x && x.w) }; });
  var ROWS = HCL.slice().sort(function(a, b){ return b.E - a.E; });
  S.bar = clamp(Math.round(S.bar == null ? 4 : +S.bar), 0, ROWS.length - 1); S.moves = +S.moves || 0;
  S.s2c = S.s2c && typeof S.s2c === "object" ? S.s2c : {};
  S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {}; if (typeof S.s3.val !== "string") S.s3.val = ""; S.s3.sp = S.s3.sp === "y" || S.s3.sp === "n" ? S.s3.sp : "";
  var anim = {}, s3msg = null;

  host.innerHTML =
    '<div class="part gc-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="gc-trials"></div><p class="gc-score" aria-live="polite"></p>' +
      '<details class="alg"><summary>Check it with data</summary><p class="tiny muted">In every trial the metal’s half-reaction is the anode (it would be oxidized): ' + ECH + " = " + EH + "(solution) − " + EH + '(metal).</p><div class="tbl-wrap"><table class="gc-dt"><thead><tr><th>Trial</th><th>' + ECH + '</th><th>Result</th></tr></thead><tbody>' +
        TR.map(function(t, i){ var m = HM[t.m], so = HM[t.s], r = stripRes(m, so); return "<tr><td>" + (i + 1) + ". " + m.el + " in " + so.oa + "</td><td>" + stripSubT(m, so) + "</td><td>" + (r.Ec > 0 ? "reacts" : "no reaction") + (t.note ? " (" + t.note + ")" : "") + "</td></tr>"; }).join("") +
      "</tbody></table></div></details></div>" +
    '<div class="part gc-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="gc-barc"><label for="gc-bar">Highlight bar</label><input type="range" id="gc-bar" min="0" max="' + (ROWS.length - 1) + '" step="1"></div>' +
      '<div class="tbl-wrap"><table class="gc-et"><thead><tr><th>Oxidizing agent</th><th></th><th>Reducing agent</th><th>' + EH + ' (V)</th></tr></thead><tbody class="gc-etb"></tbody></table></div>' +
      '<p class="gc-barcap" aria-live="polite"></p><div class="gc-rule"></div><div class="gc-cards"></div></div>' +
    '<div class="part gc-st"><h3>' + s3.title + "</h3>" + s3.html + '<div class="gc-s3"></div></div>' +
    '<div class="part gc-st"><h3>' + s4.title + '</h3><div class="gc-s4"><svg class="gc-shesvg" viewBox="0 0 260 250" role="img" aria-label="The standard hydrogen electrode: a platinum foil inside a glass tube in 1.0 mol/L H⁺ solution, with hydrogen gas bubbling in at 100 kPa. Its E° is 0.00 V by agreement.">' + sheSVG() + "</svg><div>" + s4.html + "</div></div></div>" +
    '<div class="gc-tabs3"></div>';
  MV.chem.tablePanel($(".gc-tabs3", host), "e0", { title:"Course data table: standard reduction potentials" });

  // ----- station 1 -----
  var trials = $(".gc-trials", host);
  function trialHTML(t, i){
    var x = S.s1[t.id], m = HM[t.m], so = HM[t.s], r = stripRes(m, so), k = anim[t.id] != null ? anim[t.id] : x.w ? 1 : 0, dis = anim[t.id] != null ? " disabled" : "";
    var h = '<div class="gc-trial" data-tr="' + t.id + '"><svg class="gc-tsvg" viewBox="0 0 200 220" role="img" aria-label="' + esc(m.el + " strip " + (x.w ? "in " : "above ") + MV.plain(so.oa) + "(aq). " + (x.w ? stripResT(m, so, r) : "")) + '">' +
      stripSVG({ m:m, s:so, drop:x.w || anim[t.id] != null ? 1 : 0, k:k, res:r.res }) + '</svg><div class="gc-tb"><p class="gc-tt"><strong>' + (i + 1) + ".</strong> " + m.el + " in " + so.oa + "(aq)</p>" +
      '<div class="rg chips" role="radiogroup" aria-label="Your prediction for trial ' + (i + 1) + '">' + [["y", "Reacts"], ["n", "No reaction"]].map(function(c){ var on = x.p === c[0]; return '<button type="button" role="radio" aria-checked="' + on + '" data-pr="' + c[0] + '" data-k="pr' + t.id + c[0] + '"' + (x.w ? " disabled" : dis) + ">" + c[1] + "</button>"; }).join("") + "</div>" +
      '<button type="button" class="btn sm" data-watch="1" data-k="wa' + t.id + '"' + (!x.p || x.w ? " disabled" : dis) + ">Watch</button>";
    if (x.w) { var right = (x.p === "y") === (r.Ec > 0); h += '<p class="gc-tfb">' + (right ? "<strong>✓ Right.</strong> " : "<strong>✗ Not this time.</strong> ") + stripResT(m, so, r) + (t.note && r.Ec > 0 ? " It reacts " + t.note + "." : "") + "</p>"; }
    return h + "</div></div>";
  }
  function paintS1(){
    MV.keepFocus(trials, function(){ trials.innerHTML = TR.map(trialHTML).join(""); });
    var w = TR.filter(function(t){ return S.s1[t.id].w; }), ok = w.filter(function(t){ var r = stripRes(HM[t.m], HM[t.s]); return (S.s1[t.id].p === "y") === (r.Ec > 0); });
    $(".gc-score", host).innerHTML = w.length ? "Predictions right: " + ok.length + " of " + w.length + " watched" + (w.length === TR.length ? ". Open <strong>Check it with data</strong> to see the subtraction behind each one." : ".") : "";
  }
  trials.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var card = b.closest("[data-tr]"), id = card.dataset.tr, x = S.s1[id];
    if (b.dataset.pr) { x.p = b.dataset.pr; api.save(); paintS1(); return; }
    if (b.dataset.watch) {
      anim[id] = 0; paintS1();
      MV.tween({ dur:1400, ease:LIN, step:function(t){ anim[id] = t; var c = trials.querySelector('[data-tr="' + id + '"] svg'); var tt = TR.filter(function(q){ return q.id === id; })[0]; if (c) c.innerHTML = stripSVG({ m:HM[tt.m], s:HM[tt.s], drop:Math.min(1, t * 3), k:clamp((t - 0.33) / 0.67, 0, 1), res:stripRes(HM[tt.m], HM[tt.s]).res }); }, done:function(){
        delete anim[id]; x.w = true; api.save(); paintS1(); MV.changed();
        var f = trials.querySelector('[data-tr="' + id + '"] .gc-tfb'); if (f) MV.focusFb(f.parentNode);
      } });
    }
  });
  paintS1();

  // ----- station 2 -----
  var bar = $("#gc-bar", host);
  function paintS2(){
    var i = S.bar, o = ROWS[i];
    bar.value = String(i); bar.setAttribute("aria-valuetext", "On " + MV.plain(o.oa) + ", " + MV.plain(sg(o.E)) + " V");
    MV.keepFocus($(".gc-etb", host), function(){
      $(".gc-etb", host).innerHTML = ROWS.map(function(h, j){
        var c = j === i ? "gc-on" : j > i ? "gc-below" : "";
        return '<tr class="' + c + '"><td><button type="button" class="gc-ob" data-bar="' + j + '" data-k="bar' + j + '" aria-pressed="' + (j === i) + '">' + h.oa + '</button></td><td class="gc-eq">+ ' + (h.n === 1 ? "" : h.n) + "e⁻ ⇌</td><td>" + (j > i ? "<strong>" + h.ra + "</strong> ✓" : h.ra) + "</td><td>" + sg(h.E) + "</td></tr>";
      }).join("");
    });
    var below = ROWS.slice(i + 1).map(function(h){ return h.ra; }), above = ROWS.slice(0, i + 1).map(function(h){ return h.ra; });
    $(".gc-barcap", host).innerHTML = "Bar on <strong>" + o.oa + "</strong> (" + sg(o.E) + " V). It takes electrons from every reducing agent below it" + (below.length ? ": " + below.join(", ") + "." : ": none, it is at the bottom.") + (above.length ? " It doesn’t react with " + above.join(", ") + "." : "");
    $(".gc-rule", host).innerHTML = S.moves >= 2 ? '<p class="gc-rulep"><strong>The rule:</strong> ' + s2.rule + "</p>" : '<p class="tiny muted">Move the bar a few times to find the pattern.</p>';
    MV.keepFocus($(".gc-cards", host), function(){
      $(".gc-cards", host).innerHTML = "<h4>Test the rule</h4>" + s2.cards.map(function(cd){
        var x = S.s2c[cd.id] || {}, ox = HM[cd.ox], rd = HM[cd.red], Ec = r2(ox.E - rd.E), right = x.p && ((x.p === "y") === (Ec > 0));
        return '<div class="q" data-cd="' + cd.id + '"><div class="q-prompt">' + cd.t + '</div><div class="rg chips" role="radiogroup" aria-label="Does it react?">' + [["y", "Reacts"], ["n", "No reaction"]].map(function(c){ var on = x.p === c[0]; return '<button type="button" role="radio" aria-checked="' + on + '" data-cp="' + c[0] + '" data-k="cp' + cd.id + c[0] + '"' + (right ? " disabled" : "") + ">" + c[1] + "</button>"; }).join("") + "</div>" +
          (x.p ? MV.fbHTML(right ? "good" : "bad", (right ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + ox.oa + " (" + sg(ox.E) + " V) is the oxidizing agent and " + rd.ra + " the reducing agent: " + ECH + " = " + subT(ox.E, rd.E) + ". " + (Ec > 0 ? rd.ra + " is lower in the table, so it reacts." : rd.ra + " is higher in the table, so there is no reaction.") + (right ? "" : " Try again.")) : "") + "</div>";
      }).join("");
    });
  }
  function setBar(j){ if (j === S.bar) return; S.bar = j; S.moves++; api.save(); paintS2(); }
  bar.addEventListener("input", function(){ setBar(+bar.value); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.bar != null) { setBar(+b.dataset.bar); return; }
    if (b.dataset.cp) { var id = b.closest("[data-cd]").dataset.cd; S.s2c[id] = { p:b.dataset.cp }; api.save(); paintS2(); MV.focusFb(host.querySelector('[data-cd="' + id + '"]')); }
  });
  paintS2();

  // ----- station 3: etching -----
  var s3h = $(".gc-s3", host), ec = s3.ecell, cn = s3.concern;
  function paintS3(){
    var x = S.s3, solved = !!x.ok;
    MV.keepFocus(s3h, function(){
      var h = '<div class="q"><div class="q-prompt">' + ec.prompt + '</div><div class="numrow"><label for="gc-s3v">' + ECH + ' =</label><input class="numin" id="gc-s3v" data-s3v="1" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + (solved ? " disabled" : "") + "><span>V</span></div>" +
        '<div class="rg chips" role="radiogroup" aria-label="Is it spontaneous?"><span class="rg-lab">Spontaneous?</span>' + [["y", "Yes"], ["n", "No"]].map(function(c){ var on = x.sp === c[0]; return '<button type="button" role="radio" aria-checked="' + on + '" data-sp="' + c[0] + '" data-k="sp' + c[0] + '"' + (solved ? " disabled" : "") + ">" + c[1] + "</button>"; }).join("") + "</div>";
      if (!solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-s3="check" data-k="s3chk">Check</button></div>';
      if (solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + ec.why);
      else if (s3msg) h += s3msg.soft ? MV.fbHTML("", s3msg.t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + s3msg.t + " Try again.");
      h += "</div>";
      if (solved) {
        var pk = x.pick, o = pk != null ? cn.options[pk] : null, good = o && MV.ok(o);
        h += '<div class="q"><div class="q-prompt">' + cn.prompt + '</div><div class="opts">' + cn.options.map(function(op, k){ return '<button type="button" class="opt' + (k === pk ? (good ? " right" : " wrong") : "") + '" data-cn="' + k + '" data-k="cn' + k + '"' + (good ? " disabled" : "") + "><span>" + op.t + "</span></button>"; }).join("") + "</div>" +
          (o ? MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + o.why + (good ? " This links to the health and safety thinking in module 49." : " Try again.")) : "") + "</div>";
      }
      s3h.innerHTML = h;
    });
  }
  s3h.addEventListener("input", function(e){ if (e.target.dataset.s3v) { S.s3.val = e.target.value; api.save(); } });
  s3h.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.sp) { S.s3.sp = b.dataset.sp; s3msg = null; api.save(); paintS3(); return; }
    if (b.dataset.cn != null) { S.s3.pick = +b.dataset.cn; api.save(); paintS3(); MV.focusFb(s3h); return; }
    if (b.dataset.s3 === "check") {
      var v = one(S.s3.val);
      if (v == null) s3msg = { soft:true, t:"Enter " + ECH + " as a number, such as 0.50." };
      else if (!S.s3.sp) s3msg = { soft:true, t:"Choose whether the etching is spontaneous." };
      else if (!near(v, MV.ans(ec), ec.tol)) { var w = (ec.wrong || []).filter(function(z){ return near(v, z.match, 0.005); })[0]; s3msg = { t:w ? w.fb : ec.fb }; }
      else if (S.s3.sp !== "y") s3msg = { t:"A positive " + ECH + " means the reaction is spontaneous." };
      else { S.s3.ok = true; s3msg = null; }
      api.save(); paintS3(); MV.focusFb(s3h);
    }
  });
  paintS3();
}

// ---------- Practice 1: Label the cell (tap a label, then tap its place on the diagram) ----------
var TGT = { elL:{ x:100, y:124 }, elR:{ x:420, y:124 }, solL:{ x:120, y:282 }, solR:{ x:400, y:282 }, bridge:{ x:260, y:118 }, wire:{ x:172, y:36 }, meter:{ x:260, y:36 } };
function tgtName(id, L, R){
  return { elL:"the " + L.el + " electrode", elR:"the " + R.el + " electrode", solL:"the left beaker (" + L.sol + ")", solR:"the right beaker (" + R.sol + ")", bridge:"the salt bridge", wire:"the wire", meter:"the voltmeter" }[id];
}
function tgtShort(id, L, R){ return { elL:L.el, elR:R.el, solL:"beaker", solR:"beaker", bridge:"bridge", wire:"wire", meter:"voltmeter" }[id]; }
function labelAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var sel = null, msgs = {}, cmsg = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (typeof x.val !== "string") x.val = ""; if (x.pick === undefined) x.pick = null; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function cellOfId(cid){ return a.cells.filter(function(c){ return c.id === cid; })[0]; }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.cells.map(function(c){
    return '<div class="part gc-lc" data-cell="' + c.id + '"><h4>' + c.title + '</h4><p class="tiny">' + c.desc + '</p><div class="gc-lbox"><svg class="gc-svg" viewBox="0 0 520 344" role="img" aria-label=""></svg><div class="gc-tgts" role="group" aria-label="Places on ' + c.title + '"></div></div><p class="gc-lmsg" aria-live="polite"></p><div class="gc-litems"></div></div>';
  }).join("");
  function done(id){ return ist(id).solved; }
  function paintCell(c){
    var box = host.querySelector('[data-cell="' + c.id + '"]'), L = HM[c.L], R = HM[c.R], tags = [];
    a.items.forEach(function(it){ if (it.cell !== c.id || it.kind !== "place" || !done(it.id)) return; var t = TGT[MV.ans(it)]; if (MV.ans(it).indexOf("sol") === 0) return; tags.push({ x:t.x, y:154, t:it.tag }); });
    var l3 = a.items.filter(function(it){ return it.cell === c.id && it.kind === "pick" && /Electron/.test(it.label); })[0], l4 = a.items.filter(function(it){ return it.cell === c.id && it.kind === "place" && MV.ans(it).indexOf("sol") === 0; })[0];
    var l7 = a.items.filter(function(it){ return it.cell === c.id && it.kind === "num"; })[0], cc = cellOf(L, R);
    var o = { L:L, R:R, bridge:true, wire:true, dev:"vm", lead:null, read:l7 && done(l7.id) ? cc.Ec : null, quiz:true, tags:tags,
      eDir:l3 && done(l3.id) ? cc.anSide : null, ionAn:l4 && done(l4.id) ? (MV.ans(l4) === "solL" ? "L" : "R") : null, ionK:false };
    var sv = $("svg", box); sv.innerHTML = cellSVG(o); sv.setAttribute("aria-label", c.title + ". " + cellDescribe(o, cc) + (tags.length ? " Labels placed: " + tags.map(function(t){ return t.t; }).join(", ") + "." : ""));
    var selIt = sel ? item(sel) : null, active = selIt && selIt.cell === c.id;
    MV.keepFocus($(".gc-tgts", box), function(){
      $(".gc-tgts", box).innerHTML = Object.keys(TGT).map(function(k){ var t = TGT[k]; return '<button type="button" class="gc-tg' + (active ? " on" : "") + '" style="left:' + r1(t.x / 5.2) + "%;top:" + r1(t.y / 3.44) + '%" data-tg="' + k + '" data-k="tg' + c.id + k + '" aria-label="Place on ' + esc(MV.plain(tgtName(k, L, R))) + '">' + tgtShort(k, L, R) + "</button>"; }).join("");
    });
    $(".gc-lmsg", box).innerHTML = cmsg[c.id] || (active ? "Now tap where <strong>" + selIt.label + "</strong> goes." : "");
    var list = $(".gc-litems", box);
    MV.keepFocus(list, function(){ list.innerHTML = a.items.filter(function(it){ return it.cell === c.id; }).map(itemHTML).join(""); });
  }
  function itemHTML(it){
    var x = ist(it.id), n = a.items.indexOf(it) + 1, dis = x.solved ? " disabled" : "", h = '<div class="q gc-li" data-li="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + n + '</span><div class="q-prompt">' +
      (it.kind === "place" ? "Place the label <strong>" + it.label + "</strong>." : "<strong>" + it.label + ":</strong> " + it.prompt) + "</div></div>";
    if (it.kind === "pick") h += '<div class="chips" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (it.kind === "num") h += '<div class="numrow"><label for="li-' + it.id + '">' + it.label + ' =</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span>' + it.unit + "</span></div>";
    if (!x.solved) {
      h += '<div class="q-actions">' + (it.kind === "place" ? '<button type="button" class="btn sm' + (sel === it.id ? " primary" : "") + '" data-act="sel" aria-pressed="' + (sel === it.id) + '" data-k="' + it.id + 'sel">' + (sel === it.id ? "Chosen: tap the diagram" : "Choose this label") + "</button>" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    } else {
      var why = it.kind === "pick" ? it.options[x.pick].why : it.why;
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    }
    return h + "</div>";
  }
  function paint(){ a.cells.forEach(paintCell); }
  function solve(it, x){ x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; if (sel === it.id) sel = null; }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (id) { ist(id).val = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var cbox = b.closest("[data-cell]"), cid = cbox && cbox.dataset.cell;
    if (b.dataset.tg) {
      var it = sel ? item(sel) : null;
      if (!it) { cmsg[cid] = "Choose a label first: tap <strong>Choose this label</strong> under the diagram."; paint(); return; }
      if (it.cell !== cid) { cmsg[cid] = "That label belongs to " + cellOfId(it.cell).title + "."; paint(); return; }
      var x = ist(it.id), tg = b.dataset.tg; cmsg[cid] = "";
      if (tg === MV.ans(it)) solve(it, x); else { x.tries++; msgs[it.id] = { t:(it.wrong && it.wrong[tg]) || it.wrongDefault }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-li="' + it.id + '"]')); return;
    }
    var li = b.closest("[data-li]"); if (!li) return;
    var it2 = item(li.dataset.li), x2 = ist(it2.id); cmsg[it2.cell] = "";
    if (b.dataset.act === "hint") { x2.hint = Math.min(3, x2.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "sel") { sel = sel === it2.id ? null : it2.id; msgs[it2.id] = null; paint(); return; }
    if (b.dataset.op != null) { x2.pick = +b.dataset.op; msgs[it2.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (it2.kind === "pick") {
        if (x2.pick == null) msgs[it2.id] = { soft:true, t:"Choose an answer first." };
        else if (MV.ok(it2.options[x2.pick])) solve(it2, x2); else { x2.tries++; msgs[it2.id] = { t:it2.options[x2.pick].why }; }
      } else {
        var v = one(x2.val);
        if (v == null) msgs[it2.id] = { soft:true, t:"Enter one number, such as 1.25." };
        else if (near(v, MV.ans(it2), it2.tol)) solve(it2, x2);
        else { x2.tries++; var w = (it2.wrong || []).filter(function(z){ return near(v, z.match, 0.005); })[0]; msgs[it2.id] = { t:w ? w.fb : it2.fb }; }
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-li="' + it2.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 2: Cell calculations (multi-part number / choice items; adapted from SCH4U 14's calcAct) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="gc-ctab"></div><div class="gc-citems"></div>';
  MV.chem.tablePanel($(".gc-ctab", host), "e0", { title:"Course data table: standard reduction potentials" });
  var list = $(".gc-citems", host);
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); if (!x.vals || typeof x.vals !== "object") x.vals = {}; if (!x.picks || typeof x.picks !== "object") x.picks = {}; x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function partHTML(it, x, p, j, dis){
    if (p.k === "pick") return '<div class="gc-part">' + (p.label ? '<span class="rg-lab">' + p.label + "</span>" : "") + '<div class="chips" role="radiogroup" aria-label="' + esc(MV.plain(p.label || "Choices")) + '">' + p.options.map(function(o, k){ var on = x.picks[j] === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + j + ":" + k + '" data-k="' + it.id + "p" + j + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div></div>";
    var v = x.vals[j] == null ? "" : x.vals[j];
    return '<div class="numrow gc-part"><label for="ca-' + it.id + j + '">' + p.label + '</label><input class="numin" id="ca-' + it.id + j + '" data-cin="' + it.id + ":" + j + '" ' + (p.neg ? 'type="number" step="any"' : 'type="text" inputmode="decimal"') + ' autocomplete="off" spellcheck="false" value="' + esc(v) + '"' + dis + "><span>" + (p.unit || "") + "</span></div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += it.parts.map(function(p, j){ return partHTML(it, x, p, j, dis); }).join("");
    if (!x.solved) {
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    } else {
      var pk = it.parts.length === 1 && it.parts[0].k === "pick" ? it.parts[0].options[x.picks[0]] : null;
      h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + ((pk && pk.why) || it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    }
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(list, function(){ list.innerHTML = a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    for (var j = 0; j < it.parts.length; j++) {
      var p = it.parts[j];
      if (p.k === "pick") {
        if (x.picks[j] == null) return { bad:"Choose " + (p.label ? MV.plain(p.label).replace(/:$/, "").toLowerCase() : "an answer") + " first." };
        var o = p.options[x.picks[j]]; if (!MV.ok(o)) return { fb:o.why || it.fb };
      } else {
        var v = one(x.vals[j]);
        if (v == null) return { bad:"Enter a number for " + MV.plain(p.label).replace(/ =$/, "") + ", such as 0.50." };
        if (!near(v, MV.ans(p), p.tol)) { var w = (p.wrong || []).filter(function(z){ return near(v, z.match, 0.005); })[0]; return { fb:w ? w.fb : it.fb }; }
      }
    }
    return { ok:true };
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.cin; if (!k) return; var q = k.split(":"); ist(q[0]).vals[q[1]] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin.split(":")[0] + 'chk"]'); if (b) b.click(); } });
  list.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { var q = b.dataset.op.split(":"); x.picks[q[0]] = +q[1]; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(list.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: A practical cell ----------
var task = (function(){
  var S = null, api = null, RGa = null, RGc = null;
  function read(){ return { a:HM[S.a] && !HM[S.a].myst ? S.a : "", c:HM[S.c] && !HM[S.c].myst ? S.c : "" }; }
  function ecOf(d){ return r2(HM[d.c].E - HM[d.a].E); }
  function lab(id){ return HM[id].lab + " (" + sg(HM[id].E) + " V)"; }
  function paint(){
    var d = read(), sv = $("#gc-tsvg"); if (!sv) return;
    if (!d.a || !d.c || d.a === d.c) {
      sv.innerHTML = ""; sv.setAttribute("aria-label", "Choose an anode and a cathode to see the cell.");
      $("#gc-tread").innerHTML = MV.readoutHTML([["Anode (left)", d.a ? lab(d.a) : muted("not chosen")], ["Cathode (right)", d.c ? lab(d.c) : muted("not chosen")], [ECH + " as connected", d.a && d.a === d.c ? "Choose two different half-cells." : muted("—")]]);
      return;
    }
    var A = HM[d.a], Cc = HM[d.c], c = cellOf(A, Cc), Ec = ecOf(d), fw = Ec > 0;
    var o = { L:A, R:Cc, bridge:true, wire:true, dev:"vm", lead:"R", read:Ec, an:c.anSide, roles:true, eDir:c.anSide, ionAn:c.anSide, anim:!MV.reduceMotion };
    sv.innerHTML = cellSVG(o); sv.setAttribute("aria-label", cellDescribe(o, c));
    $("#gc-tread").innerHTML = MV.readoutHTML([["Anode (left)", lab(d.a)], ["Cathode (right)", lab(d.c)], [ECH + " as connected", EH + "(cathode) − " + EH + "(anode) = " + subT(Cc.E, A.E)],
      ["Runs on its own?", fw ? "Yes: positive, so spontaneous" : "No: negative, so it would run backwards (your “cathode” would be oxidized)"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="gc-tch gc-ta"></div><div class="gc-tch gc-tc"></div>';
      var opts = HCL.map(function(h){ return { id:h.id, t:h.lab + " <span class=\"muted\">" + sg(h.E) + "</span>" }; });
      RGa = radios($(".gc-ta", inp), { label:"Anode half-cell", aria:"Anode half-cell", cls:"chips", options:opts, value:S.a || "", onChange:function(v){ S.a = v; api.save(); paint(); api.update(); } });
      RGc = radios($(".gc-tc", inp), { label:"Cathode half-cell", aria:"Cathode half-cell", cls:"chips", options:opts, value:S.c || "", onChange:function(v){ S.c = v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="gc-h4">Your cell</h4><div class="gc-box"><svg class="gc-svg" id="gc-tsvg" viewBox="0 0 520 344" role="img" aria-label=""></svg></div><dl class="read" id="gc-tread" aria-live="polite"></dl>';
      paint();
    },
    read:read,
    valid:function(d){ if (!d.a || !d.c) return "Choose an anode half-cell and a cathode half-cell."; if (d.a === d.c) return "Choose two different half-cells."; return true; },
    checks:function(d){
      if (!d.a || !d.c) return [false, false, false, false];
      var Ec = ecOf(d), bad = function(id){ return id === "ag" || id === "pb"; }, pt = function(id){ return !HM[id].metal; };
      return [Ec > 0, Ec >= 1.5 - 1e-9 && Ec <= 2.0 + 1e-9, !bad(d.a) && !bad(d.c), !pt(d.a) && !pt(d.c)];
    },
    key:function(d){ return d.a + ">" + d.c; },
    label:function(k){ var p = k.split(">"); return HM[p[0]].el + " anode, " + HM[p[1]].el + " cathode (" + fx(r2(HM[p[1]].E - HM[p[0]].E), 2) + " V)"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ label:labelAct, calc:calcAct },
  task:task
});
})();
