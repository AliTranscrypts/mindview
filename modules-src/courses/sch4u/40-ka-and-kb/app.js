// SCH4U 40 Ka and Kb Calculations: hero (a flask of 100 ethanoic acid particles, one ionizes; the ICE table writes
// itself; x = 1.8 × 10⁻³, the 5% check badge, pH 2.74), Weak acid ionizer (Explore: C7 ICE table workbench with
// pH from K, K from pH, Percent ionization and Conjugate pairs modes), Ranking acids (Part 3: ordering stations, the
// conjugate ladder, pH order with "Check it with data"), Calculate it (custom number entry with mantissa × 10^exponent
// entry for K values) and Hit the pH window (task: acid × concentration).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
var MI = "−";
var D = MV.chem.data, fx = MV.chem.fx, KW = D["const"].Kw;
var KA = "<i>K</i><sub>a</sub>", KB = "<i>K</i><sub>b</sub>", KWH = "<i>K</i><sub>w</sub>", XI = "<i>x</i>", CI = "<i>c</i>";

// ---------- numbers ----------
function sc(v){                                            // 2 significant figures, HTML: 1.8 × 10<sup>−5</sup>
  if (!v) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = Math.round(v / Math.pow(10, e) * 10) / 10;
  if (m >= 10) { m = m / 10; e++; }
  return fx(m, 1) + " × 10<sup>" + (e < 0 ? MI + (-e) : e) + "</sup>";
}
function scT(v){ return MV.plain(sc(v)); }                 // plain text (SVG, aria)
function p2(v){ return fx(v, 2); }
function pctT(v){ if (v >= 99.5) return "100%"; var dp = v >= 10 ? 0 : v >= 1 ? 1 : Math.max(1, 1 - Math.floor(Math.log10(v))); return fx(v, dp) + "%"; }
function cT(c){ return c >= 1 ? fx(c, 1) : Number(c).toPrecision(2); }
function exact(K, c){ return (-K + Math.sqrt(K * K + 4 * K * c)) / 2; }
function pHofX(x, base){ var p = -Math.log10(x); return base ? 14 - p : p; }

// ---------- species (every K from MV.chem.data; HX is the plan's model acid) ----------
function kOf(list, f){ var r = (D[list] || []).filter(function(r){ return r[1] === f; })[0]; return r ? r[2] : null; }
var SP = [
  { id:"eth", name:"ethanoic acid", ha:"CH₃COOH", a:"CH₃COO⁻", K:kOf("Ka", "CH3COOH") },
  { id:"meth", name:"methanoic acid", ha:"HCOOH", a:"HCOO⁻", K:kOf("Ka", "HCOOH") },
  { id:"hf", name:"hydrofluoric acid", ha:"HF", a:"F⁻", K:kOf("Ka", "HF") },
  { id:"hocl", name:"hypochlorous acid", ha:"HOCl", a:"OCl⁻", K:kOf("Ka", "HOCl") },
  { id:"benz", name:"benzoic acid", ha:"C₆H₅COOH", a:"C₆H₅COO⁻", K:kOf("Ka", "C6H5COOH") },
  { id:"nh3", name:"ammonia", ha:"NH₃", a:"NH₄⁺", K:kOf("Kb", "NH3"), base:true },
  { id:"hx", name:"model acid HX", ha:"HX", a:"X⁻", K:1.0e-5, model:true }      // model acid from the plan, not a course-table value
];
var NH4 = { id:"nh4", name:"ammonium ion", short:"NH₄⁺", ha:"NH₄⁺", a:"NH₃", K:kOf("Ka", "NH4+") };
function spOf(id){ return SP.filter(function(s){ return s.id === id; })[0] || (id === "nh4" ? NH4 : SP[0]); }
function kSym(s){ return s.base ? KB : KA; }
function cjSym(s){ return s.base ? KA : KB; }
function cjOf(s){ return s.base ? "NH₄⁺" : s.a; }
function h3o(t){ return '<span class="kab-h3o">' + t + "</span>"; }
function anion(t){ return '<span class="kab-an">' + t + "</span>"; }
function ohS(t){ return '<span class="kab-oh">' + t + "</span>"; }
function bhS(t){ return '<span class="kab-bh">' + t + "</span>"; }
function eqHTML(s){ return s.base ? s.ha + " + H₂O ⇌ " + bhS(s.a) + " + " + ohS("OH⁻") : s.ha + " + H₂O ⇌ " + h3o("H₃O⁺") + " + " + anion(s.a); }
function exprHTML(s){ return s.base ? KB + " = [" + s.a + "][OH⁻] ÷ [" + s.ha + "]" : KA + " = [H₃O⁺][" + s.a + "] ÷ [" + s.ha + "]"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–21) — segmented control or chip row as a real radio group (arrow keys,
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
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="middle" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") +
    ' fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + s + "</text>";
}
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 1.5) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
var IX = '<tspan font-style="italic">x</tspan>';

// ---------- hero ----------
function hero(){
  var svg = $("#kab-hx-svg"), rep = $("#kab-hx-replay"), stop = null;
  if (!svg) return;
  function seg(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
  function draw(t){
    var h = "", sp = seg(t, 0.06, 0.2);
    h += '<path d="M24 56 V232 Q24 248 40 248 H184 Q200 248 200 232 V56" fill="none" stroke="var(--ink-2)" stroke-width="2"/>';
    h += tx(112, 272, "0.18 mol/L ethanoic acid", { fs:12, c:"var(--ink-2)" });
    for (var j = 0; j < 10; j++) for (var i = 0; i < 10; i++) {
      var k = j * 10 + i, x = 38 + i * 16.4, y = 80 + j * 16.4;
      if (k === 44 && sp > 0) h += circ(x - 5 * sp, y - 3 * sp, 5.4, "var(--ab-h3o)") + circ(x + 5 * sp, y + 3 * sp, 5.4, "var(--ec-an)");
      else h += circ(x, y, 5.4, "var(--sheet)", { s:"var(--ink-2)", sw:1.3 });
    }
    h += circ(30, 30, 5, "var(--sheet)", { s:"var(--ink-2)", sw:1.3 }) + tx(39, 30, "CH₃COOH", { a:"start", fs:11 });
    h += circ(30, 44, 5, "var(--ab-h3o)", { op:sp }) + tx(39, 44, "H₃O⁺", { a:"start", fs:11, op:sp }) + circ(96, 44, 5, "var(--ec-an)", { op:sp }) + tx(105, 44, "CH₃COO⁻", { a:"start", fs:11, op:sp });
    // ICE table
    var X0 = 222, cols = [246, 300, 372, 440], r0 = seg(t, 0.2, 0.28);
    h += tx(346, 30, "CH₃COOH + H₂O ⇌ H₃O⁺ + CH₃COO⁻", { fs:12, op:r0 });
    h += tx(cols[1], 62, "CH₃COOH", { fs:11.5, w:700, op:r0 }) + tx(cols[2], 62, "H₃O⁺", { fs:11.5, w:700, c:"var(--ab-h3o)", op:r0 }) + tx(cols[3], 62, "CH₃COO⁻", { fs:11.5, w:700, c:"var(--ec-an)", op:r0 });
    h += ln(X0, 74, 470, 74, { c:"var(--rule)", op:r0 });
    var rows = [["I", "0.18", "0", "0"], ["C", MI + IX, "+" + IX, "+" + IX], ["E", "0.18 " + MI + " " + IX, IX, IX]];
    rows.forEach(function(r, n){
      var op = seg(t, 0.28 + n * 0.09, 0.34 + n * 0.09), y = 90 + n * 22;
      r.forEach(function(v, q){ h += tx(cols[q], y, v, { fs:12.5, w:q ? 400 : 700, op:op }); });
    });
    var m1 = seg(t, 0.58, 0.64), m2 = seg(t, 0.64, 0.7);
    h += tx(346, 170, IX + "² ÷ 0.18 = 1.8 × 10⁻⁵", { fs:13, op:m1 });
    h += tx(346, 192, "→ " + IX + " = 1.8 × 10⁻³ mol/L", { fs:13, w:700, op:m2 });
    var bd = seg(t, 0.72, 0.8);
    h += rect(X0, 206, 248, 26, "none", { rx:6, s:"var(--ink)", sw:1.8, op:bd }) + tx(346, 219.5, "✓ 1.0% < 5%: shortcut valid", { fs:12.5, w:700, op:bd });
    var ph = seg(t, 0.82, 1), pv = 7 - (7 - 2.74) * ph;
    h += tx(346, 266, "pH = " + p2(ph >= 1 ? 2.74 : pv), { fs:24, w:700, op:ph > 0 ? 1 : 0 });
    svg.innerHTML = h;
  }
  function play(){
    if (stop) stop();
    if (rep) rep.hidden = true;
    stop = MV.tween({ dur:7000, ease:function(t){ return t; }, step:draw, done:function(){ stop = null; if (rep) rep.hidden = false; } });
  }
  if (rep) rep.addEventListener("click", play);
  draw(0); play();
}

// ---------- @component C7 iceWorkbench (Explore centrepiece): species/concentration chips, mode segments, small-x toggle,
// ICE table (scrolls inside its box), 100-token particle panel (a strip on phones), readout, percent-ionization curve
// (log concentration axis), K-from-pH entry (mantissa × 10^exponent), conjugate K reveal. Exact x from the quadratic.
function kEntry(m, e){
  var mv = MV.parseNum(String(m || "").trim()), ev = MV.parseNum(String(e || "").trim());
  if (!mv || mv.length !== 1 || !ev || ev.length !== 1 || !isFinite(mv[0]) || !isFinite(ev[0]) || Math.round(ev[0]) !== ev[0] || mv[0] <= 0) return null;
  return mv[0] * Math.pow(10, ev[0]);
}
function relNear(v, w, tol){ return Math.abs(v - w) <= Math.abs(w) * tol; }
function iceHTML(s, cv, xv, rows, cName){
  var head = s.base ? [s.ha, "H₂O", bhS(s.a), ohS("OH⁻")] : [s.ha, "H₂O", h3o("H₃O⁺"), anion(s.a)];
  var c = cName || cT(cv), W = '<span class="muted">—</span>';
  var R = [["I", c, W, "0", "0"], ["C", MI + XI, W, "+" + XI, "+" + XI], ["E", c + " " + MI + " " + XI, W, XI, XI]];
  R.push(["E (mol/L)", xv == null ? "?" : sc(Math.max(0, cv - xv)), W, xv == null ? "?" : sc(xv), xv == null ? "?" : sc(xv)]);
  return '<table class="kab-ice-t"><thead><tr><th scope="col"><span class="vh">Row</span></th>' + head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
    R.slice(0, rows).map(function(r, i){ return "<tr" + (i === 3 ? ' class="kab-num"' : "") + '><th scope="row">' + r[0] + "</th>" + r.slice(1).map(function(v){ return "<td>" + v + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
}
var SPOTS = MV.shuffle(Array.from({ length:100 }, function(_, i){ return i; }), "sch4u-40-tokens");
function tokensSVG(s, n, split){
  var h = "", on = {}; SPOTS.slice(0, n).forEach(function(i){ on[i] = 1; });
  var cA = s.base ? "var(--ec-cat)" : "var(--ab-h3o)", cB = s.base ? "var(--ab-oh)" : "var(--ec-an)";
  for (var j = 0; j < 10; j++) for (var i = 0; i < 10; i++) {
    var k = j * 10 + i, x = 12 + i * 21.6, y = 12 + j * 21.6;
    if (on[k]) { var d = 4.6 * split; h += circ(x - d, y - d * 0.5, 6.2, cA) + circ(x + d, y + d * 0.5, 6.2, cB); }
    else h += circ(x, y, 7, "var(--sheet)", { s:"var(--ink-2)", sw:1.4 });
  }
  return h;
}
function stripSVG(s, n){
  var h = "", on = {}; SPOTS.slice(0, n).forEach(function(i){ on[i] = 1; });
  for (var k = 0; k < 100; k++) h += rect(k * 3, 0, 2.2, 14, on[k] ? (s.base ? "var(--ab-oh)" : "var(--ab-h3o)") : "var(--rule)");
  return h;
}
function niceUp(v){ var L = [5, 10, 15, 20, 30, 40, 50, 60, 80, 100]; for (var i = 0; i < L.length; i++) if (v <= L[i]) return L[i]; return 100; }

function explore(host, api){
  var S = api.S, C = api.content;
  if (!SP.some(function(s){ return s.id === S.sp; })) S.sp = "eth";
  if (C.concs.indexOf(S.c) < 0) S.c = "0.18";
  if (["ph", "k", "pct", "conj"].indexOf(S.mode) < 0) S.mode = "ph";
  S.short = S.short !== false; S.div = !!S.div;
  ["phIn", "kM", "kE"].forEach(function(k){ if (typeof S[k] !== "string") S[k] = ""; });
  S.seen = Array.isArray(S.seen) ? S.seen.filter(function(x){ return typeof x === "string"; }) : [];
  if (typeof S.shown !== "string") S.shown = "";
  if (["", "eth", "nh4", "benz", "hocl"].indexOf(S.pred) < 0) S.pred = ""; S.fresh = !!S.fresh;
  var hide = {}, locked = false, cAnim = null, split = 1, iceRows = 4, note = "", stopA = null;

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="kab-modes"></div>' +
    '<div class="kab-ctl"><div class="kab-sp"></div><div class="kab-cc"></div>' +
    '<div class="kab-row" data-for="ph"><label class="kab-chk"><input type="checkbox" id="kab-short"> Use small-<i>x</i> approximation</label></div>' +
    '<div class="kab-row" data-for="pct"><button type="button" class="btn ghost sm" id="kab-div" aria-pressed="false">÷100: dilute 100 times</button></div>' +
    '<div class="kab-row kab-kin" data-for="k"><span class="inrow"><label for="kab-phin">Measured pH:</label> <input class="numin" id="kab-phin" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"></span>' +
      '<span class="inrow"><span id="kab-klab">Your ' + KA + ' =</span> <input class="numin kab-m" id="kab-km" type="text" inputmode="decimal" autocomplete="off" aria-label="Your K: number in front"> × 10<sup><input class="numin kab-e" id="kab-ke" type="number" step="1" aria-label="Your K: power of 10"></sup></span></div>' +
    '<div class="kab-row kab-cj" data-for="conj"><button type="button" class="btn ghost sm" id="kab-show">Show the conjugate’s <i>K</i></button><div class="kab-pred"></div><button type="button" class="btn ghost sm" id="kab-reset">Start over</button></div></div>' +
    '<div class="kab-grid"><div class="kab-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<p class="kab-eq" aria-live="polite"></p><div class="tbl-wrap kab-ice"></div><p class="tiny muted">Water is the solvent: it’s left out of <i>K</i>.</p>' +
      '<div class="kab-parts"><svg class="kab-tok" viewBox="0 0 220 220" role="img" aria-label=""></svg><svg class="kab-strip" viewBox="0 0 300 14" aria-hidden="true"></svg><p class="kab-pcap" aria-live="polite"></p><p class="kab-leg tiny"></p></div>' +
      '<div class="kab-curvebox" data-for="pct"><svg class="kab-curve" viewBox="0 0 380 230" role="img" aria-label=""></svg></div><p class="kab-cap" aria-live="polite"></p></div>' +
    '<div class="kab-side"><dl class="read kab-read" aria-live="polite"></dl></div></div><div class="kab-tabs"></div>';
  MV.chem.tablePanel($(".kab-tabs", host), "acid", { title:"Course data table: acid and base constants" });
  var elShort = $("#kab-short"), elDiv = $("#kab-div"), elPh = $("#kab-phin"), elKm = $("#kab-km"), elKe = $("#kab-ke");
  elShort.checked = S.short; elPh.value = S.phIn; elKm.value = S.kM; elKe.value = S.kE;

  var RG = {};
  RG.mode = radios($(".kab-modes", host), { label:"Mode", aria:"Ionizer mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; note = ""; api.save(); paint(); } });
  RG.sp = radios($(".kab-sp", host), { label:"Species", cls:"chips", aria:"Weak acid or base", value:S.sp,
    options:SP.map(function(s){ return { id:s.id, t:s.id === "nh3" ? "ammonia (base)" : s.id === "hx" ? "HX (model)" : s.name }; }),
    onChange:function(v){ S.sp = v; S.shown = ""; note = ""; api.save(); paint(); } });
  RG.c = radios($(".kab-cc", host), { label:"Concentration (mol/L)", cls:"chips", aria:"Concentration in mol per litre", value:S.c,
    options:C.concs.map(function(c){ return { id:c, t:c }; }), onChange:function(v){ S.c = v; S.div = false; note = ""; api.save(); paint(); } });
  RG.pred = radios($(".kab-pred", host), { label:"Challenge 3 prediction:", cls:"chips", aria:"Challenge 3 prediction", value:S.pred, options:C.tc3chips,
    onChange:function(v){ S.pred = v; S.fresh = S.seen.length === 0; api.save(); paint(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.sp.set(S.sp); RG.c.set(S.c); RG.pred.set(S.pred); elShort.checked = S.short; }
  elShort.addEventListener("change", function(){ S.short = elShort.checked; note = ""; api.save(); paint(); });
  elDiv.addEventListener("click", function(){ if (locked) return; S.div = !S.div; note = ""; api.save(); paint(); });
  elPh.addEventListener("input", function(){ S.phIn = elPh.value; api.save(); paint(); });
  elKm.addEventListener("input", function(){ S.kM = elKm.value; api.save(); paint(); });
  elKe.addEventListener("input", function(){ S.kE = elKe.value; api.save(); paint(); });
  $("#kab-show").addEventListener("click", function(){ if (locked) return; S.shown = S.sp; if (S.seen.indexOf(S.sp) < 0) S.seen.push(S.sp); api.save(); paint(); });
  $("#kab-reset").addEventListener("click", function(){ if (locked) return; S.pred = ""; S.fresh = false; S.seen = []; S.shown = ""; RG.pred.set(""); api.save(); paint(); });
  function lock(b){
    locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); });
    [elShort, elDiv, elPh, elKm, elKe, $("#kab-show"), $("#kab-reset")].forEach(function(e){ e.disabled = b; });
  }

  function cEff(){ if (cAnim != null) return cAnim; var c = +S.c; return S.mode === "pct" && S.div ? c / 100 : c; }
  function cName(){ return cAnim != null ? cT(cAnim) : S.mode === "pct" && S.div ? cT(+S.c / 100) : S.c; }
  function pHin(){ var v = MV.parseNum(String(S.phIn).trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function solve(){
    var s = spOf(S.sp), c = cEff(), r = { s:s, c:c, K:s.K };
    r.xs = Math.sqrt(s.K * c); r.xe = exact(s.K, c); r.pctS = r.xs / c * 100; r.pass = r.pctS < 5;
    if (S.mode === "k") {
      var p = pHin(); r.x = null;
      if (p == null) r.msg = "Enter the measured pH.";
      else if (p <= 0 || p >= 14) r.msg = "Enter a pH between 0 and 14.";
      else {
        var x = s.base ? Math.pow(10, -(14 - p)) : Math.pow(10, -p);
        if (s.base ? p <= 7 : p >= 7) r.msg = s.base ? "A base solution has a pH above 7." : "An acid solution has a pH below 7.";
        else if (x >= c) r.msg = "That pH needs more " + (s.base ? "OH⁻" : "H₃O⁺") + " than the " + (s.base ? "base" : "acid") + " could give at " + cT(c) + " mol/L.";
        else { r.x = x; r.Kc = x * x / (c - x); }
      }
    } else r.x = S.mode === "ph" && S.short ? r.xs : r.xe;
    r.pct = r.x != null ? r.x / c * 100 : null;
    r.pH = r.x != null ? pHofX(r.x, s.base) : null;
    return r;
  }

  function paintIce(r){
    var hx = hide.x || r.x == null;
    $(".kab-ice", host).innerHTML = iceHTML(r.s, r.c, hx ? null : r.x, iceRows, cName());
  }
  function paintParts(r){
    var s = r.s, show = !hide.x && r.pct != null, n = show ? Math.round(Math.min(100, r.pct)) : 0, tok = $(".kab-tok", host);
    tok.innerHTML = tokensSVG(s, n, split);
    $(".kab-strip", host).innerHTML = stripSVG(s, n);
    var cap = !show ? (r.x == null && S.mode === "k" ? "Enter a pH to see the particles." : "100 particles of " + s.ha + "…") :
      n === 0 ? "Fewer than 1 in 100 ionized (" + pctT(r.pct) + ")" : n + " in 100 ionized (" + pctT(r.pct) + ")";
    $(".kab-pcap", host).innerHTML = cap;
    tok.setAttribute("aria-label", "Particle model: 100 particles of " + MV.plain(s.ha) + ". " + (show ? (n === 0 ? "Fewer than 1" : n) + " in 100 have ionized into " + (s.base ? "NH₄⁺ and OH⁻" : "H₃O⁺ and " + MV.plain(s.a)) + "; the rest stay whole." : "None shown ionized yet."));
    $(".kab-leg", host).innerHTML = '<span class="kab-dot kab-d0"></span> ' + s.ha + " (whole) · " +
      (s.base ? '<span class="kab-dot kab-dbh"></span> ' + s.a + ' · <span class="kab-dot kab-doh"></span> OH⁻' : '<span class="kab-dot kab-dh"></span> H₃O⁺ · <span class="kab-dot kab-da"></span> ' + s.a);
  }
  function paintCurve(r){
    var s = r.s, c = r.c, lo = Math.min(-3, Math.floor(Math.log10(c) - 1e-9)), x0 = 50, x1 = 362, y0 = 190, y1 = 18;
    var top = niceUp(exact(s.K, Math.pow(10, lo)) / Math.pow(10, lo) * 100 * 1.04);
    function X(lc){ return x0 + (lc - lo) / (0 - lo) * (x1 - x0); }
    function Y(p){ return y0 - p / top * (y0 - y1); }
    var h = "";
    for (var d = lo; d <= 0; d++) h += ln(X(d), y0, X(d), y1, { c:"var(--plot-grid)", w:1 }) + tx(X(d), y0 + 13, d === 0 ? "1" : fx(Math.pow(10, d), -d), { fs:10.5, c:"var(--ink-2)" });
    [0, top / 2, top].forEach(function(p){ h += ln(x0, Y(p), x1, Y(p), { c:"var(--plot-grid)", w:1 }) + tx(x0 - 6, Y(p), fx(p, p % 1 ? 1 : 0) + "%", { a:"end", fs:10.5, c:"var(--ink-2)" }); });
    h += ln(x0, y0, x1, y0, { c:"var(--plot-axis)", w:1.4 }) + ln(x0, y0, x0, y1, { c:"var(--plot-axis)", w:1.4 });
    h += tx((x0 + x1) / 2, 222, "concentration (mol/L, log scale)", { fs:11, c:"var(--ink-2)" });
    var pts = []; for (var i = 0; i <= 120; i++) { var lc = lo + (0 - lo) * i / 120, cc = Math.pow(10, lc); pts.push(r1(X(lc)) + "," + r1(Y(exact(s.K, cc) / cc * 100))); }
    h += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--pen)" stroke-width="3" stroke-linejoin="round"/>';
    var pv = exact(s.K, c) / c * 100, px = X(Math.log10(c)), py = Y(pv);
    if (!hide.x) h += circ(px, py, 7, "var(--sheet)", { s:"var(--hi)", sw:2.6 }) + circ(px, py, 3.5, "var(--pen)") + tx(px + (px > 280 ? -10 : 10), py - 14, pctT(pv), { a:px > 280 ? "end" : "start", fs:12.5, w:700 });
    var sv = $(".kab-curve", host); sv.innerHTML = h;
    sv.setAttribute("aria-label", "Percent ionization of " + MV.plain(s.name) + " against concentration on a log scale: the curve rises as the solution gets more dilute. " + (hide.x ? "" : "At " + cT(c) + " mol/L it is " + pctT(pv) + "."));
  }
  function paintRead(r){
    var s = r.s, rows = [], m = S.mode, H = hide.x;
    rows.push(["Species", s.name + ", " + kSym(s) + " = " + sc(s.K) + (s.model ? " (model)" : "")], ["Expression", exprHTML(s)], ["Concentration", cName() + " mol/L"]);
    if (m === "ph") {
      var xn = s.base ? "[OH⁻]" : "[H₃O⁺]";
      if (S.short) {
        rows.push(["Shortcut " + XI, H ? "?" : "√(" + sc(s.K) + " × " + cName() + ") = " + sc(r.xs)]);
        rows.push(["5% check", H ? "?" : r.pass ? "✓ " + sc(r.xs) + " ÷ " + cName() + " = " + pctT(r.pctS) + ": valid" : "✗ " + XI + " ÷ " + CI + " = " + pctT(r.pctS) + ": not valid; switch the shortcut off to see the exact value"]);
      } else rows.push(["Exact " + XI + " (quadratic)", H ? "?" : sc(r.xe)]);
      if (s.base) rows.push([xn, H ? "?" : sc(r.x)], ["pOH", H ? "?" : p2(-Math.log10(r.x))]);
      rows.push(["pH", H ? "?" : S.short ? p2(r.pH) + (r.pass ? " (exact " + p2(pHofX(r.xe, s.base)) + ")" : " (shortcut not valid)") : p2(r.pH)]);
      rows.push(["Percent ionization", H ? "?" : pctT(r.pct)]);
    } else if (m === "k") {
      if (r.x == null) rows.push(["Measured pH", muted(r.msg)]);
      else {
        var p = pHin();
        rows.push(["Measured pH", p2(p)]);
        if (s.base) rows.push(["pOH", p2(14 - p)]);
        rows.push([XI + " = " + (s.base ? "[OH⁻] = 10<sup>" + MI + "pOH</sup>" : "[H₃O⁺] = 10<sup>" + MI + "pH</sup>"), sc(r.x)], [XI + "²", sc(r.x * r.x)], ["[" + s.ha + "] = " + CI + " " + MI + " " + XI, sc(r.c - r.x)], ["Percent ionization", pctT(r.pct)]);
        var k = kEntry(S.kM, S.kE);
        rows.push(["Your " + kSym(s), k == null ? muted("enter it: number in front × 10 to a power") : sc(k)]);
        rows.push(["Tool’s " + kSym(s) + " = " + XI + "² ÷ (" + CI + " " + MI + " " + XI + ")", k == null ? muted("shows once you enter yours") : sc(r.Kc) + (relNear(k, r.Kc, 0.03) ? " ✓ matches yours" : " ✗ differs from yours")]);
      }
    } else if (m === "pct") {
      rows.push([XI + " (exact)", H ? "?" : sc(r.xe)], ["Percent ionization", H ? "?" : pctT(r.pct)]);
      rows.push([s.base ? "[OH⁻]" : "[H₃O⁺]", H ? "?" : sc(r.xe) + " mol/L"]);
    } else {
      var shown = S.shown === s.id && !hide.cj, ck = KW / s.K;
      rows.push(["Conjugate " + (s.base ? "acid" : "base"), cjOf(s)]);
      rows.push([cjSym(s) + "(" + cjOf(s) + ")", shown ? cjSym(s) + " = " + KWH + " ÷ " + kSym(s) + " = " + sc(KW) + " ÷ " + sc(s.K) + " = <strong>" + sc(ck) + "</strong>" : muted("press Show the conjugate’s K")]);
      rows.push([KA + " × " + KB, shown ? sc(s.K) + " × " + sc(ck) + " = " + sc(KW) + " = " + KWH : muted("—")]);
      rows.push(["Challenge 3 prediction", S.pred ? C.tc3chips.filter(function(x){ return x.id === S.pred; })[0].t + (S.fresh ? " (chosen before any conjugate was shown)" : " (chosen after a conjugate was shown)") : muted("none yet")]);
    }
    $(".kab-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(r){
    var s = r.s, m = S.mode, t;
    if (m === "ph") t = hide.x ? "The ICE table is filling in…" : S.short ? (r.pass ? "The shortcut passes the 5% check, so " + CI + " " + MI + " " + XI + " ≈ " + CI + " is fine." : "The shortcut fails the 5% check: " + XI + " is too big to ignore. Switch it off to solve the quadratic.") : "Exact solution of " + XI + "² ÷ (" + CI + " " + MI + " " + XI + ") = " + kSym(s) + ".";
    else if (m === "k") t = r.x == null ? r.msg : "The measured pH gives " + XI + "; " + XI + " gives " + kSym(s) + ".";
    else if (m === "pct") t = "The point shows this solution on the percent-ionization curve. Press ÷100 to dilute it.";
    else t = "Stronger acid, weaker conjugate base: " + KA + " × " + KB + " = " + KWH + " for every conjugate pair.";
    $(".kab-cap", host).innerHTML = t + (note ? " <strong>" + note + "</strong>" : "");
  }
  function paint(){
    var m = S.mode, r = solve();
    $$("[data-for]", host).forEach(function(p){ p.hidden = p.dataset.for !== m; });
    elDiv.setAttribute("aria-pressed", String(S.div)); elDiv.textContent = S.div ? "Undo ÷100" : "÷100: dilute 100 times";
    $("#kab-klab").innerHTML = "Your " + kSym(r.s) + " =";
    $(".kab-eq", host).innerHTML = eqHTML(r.s);
    paintIce(r); paintParts(r); if (m === "pct") paintCurve(r); paintRead(r); paintCap(r);
    MV.changed();
  }

  // ----- predictions -----
  function anim(dur, step, done){ if (stopA) stopA(); stopA = MV.tween({ dur:dur, step:step, done:function(){ stopA = null; if (done) done(); } }); }
  var hooks = {
    start:function(p){
      if (stopA) { stopA(); stopA = null; }
      note = ""; cAnim = null; hide = {}; split = 1; iceRows = 4;
      if (p.id === "p1") { S.mode = "ph"; S.sp = "eth"; S.c = "0.18"; S.short = true; hide.x = true; iceRows = 3; }
      else if (p.id === "p2") { S.mode = "pct"; S.sp = "eth"; S.c = "0.18"; S.div = false; }
      else if (p.id === "p3") { S.mode = "ph"; S.sp = "hf"; S.c = "0.10"; S.short = true; hide.x = true; }
      else { S.mode = "conj"; S.sp = "eth"; S.shown = "eth"; hide.cj = true; }
      syncRG(); api.save(); lock(true); paint();
    },
    run:function(p, done){
      function fin(n){ note = n || ""; hide = {}; cAnim = null; split = 1; iceRows = 4; lock(false); api.save(); paint(); MV.wait(150, done); }
      if (p.id === "p1") {
        iceRows = 3; paint();
        MV.wait(500, function(){ iceRows = 4; hide.x = false; split = 0; paint(); anim(1200, function(t){ split = t; paint(); }, function(){ fin("Only 1 in 100 molecules ionized: " + XI + " = " + sc(Math.sqrt(1.8e-5 * 0.18)) + ", pH 2.74."); }); });
      } else if (p.id === "p2") {
        anim(2400, function(t){ cAnim = 0.18 * Math.pow(10, -2 * t); paint(); }, function(){ cAnim = null; S.div = true; fin("From 1.0% to 9.5%: about 10 times more of the acid is ionized."); });
      } else if (p.id === "p3") {
        MV.wait(400, function(){ hide.x = false; note = "Shortcut " + XI + " = " + sc(Math.sqrt(6.6e-4 * 0.1)) + " is 8.1% of 0.10: flagged."; paint();
          MV.wait(1800, function(){ S.short = false; syncRG(); fin("With the shortcut off, the quadratic gives " + XI + " = " + sc(exact(6.6e-4, 0.1)) + " and pH 2.11."); }); });
      } else {
        MV.wait(600, function(){ hide.cj = false; fin(KB + " = " + KWH + " ÷ " + KA + " = " + sc(KW / 1.8e-5) + "."); });
      }
    }
  };

  // ----- challenges -----
  function chal(id, opt){
    var r = solve();
    if (id === "tc1") {
      if (S.mode !== "ph") return { ok:false, msg:"Use <strong>pH from <i>K</i></strong> mode." };
      if (S.sp !== "meth") return { ok:false, msg:"Choose methanoic acid." };
      if (!S.short) return { ok:false, msg:"Switch the shortcut on." };
      if (S.c === "0.20") return { ok:true };
      if (S.c === "0.18") return { ok:false, msg:"pH 2.24: close, but " + XI + " = " + sc(r.xs) + "." };
      if (S.c === "1.0") return { ok:false, msg:"pH 1.87: too concentrated." };
      if (S.c === "0.012") return { ok:false, msg:"pH 2.83, and the 5% check fails." };
      return { ok:false, msg:"pH " + p2(r.pH) + ": " + (r.pH < 2.22 ? "too concentrated." : "too dilute.") };
    }
    if (id === "tc2") {
      if (S.mode !== "k") return { ok:false, msg:"Use <strong><i>K</i> from pH</strong> mode." };
      if (S.sp !== "hx") return { ok:false, msg:"Choose model acid HX." };
      if (S.c !== "0.10") return { ok:false, msg:"The solution is 0.10 mol/L." };
      var p = pHin(); if (p == null || Math.abs(p - 3) > 0.005) return { ok:false, msg:"Enter the measured pH, 3.00." };
      var k = kEntry(S.kM, S.kE); if (k == null) return { ok:false, msg:"Enter your " + KA + ": the number in front, then the power of 10." };
      if (k >= 1.0e-5 * (1 - 1e-9) && k <= 1.01e-5 * (1 + 1e-9)) return { ok:true };
      if (relNear(k, 1.0e-3, 0.02)) return { ok:false, msg:"That’s " + XI + ", the [H₃O⁺]." };
      if (relNear(k, 1.0e-2, 0.02)) return { ok:false, msg:"That’s " + XI + " ÷ " + CI + ", the fraction ionized." };
      if (relNear(k, 1.0e-6, 0.02)) return { ok:false, msg:"That’s " + XI + "²; divide by [HA] = 0.10 " + MI + " " + XI + "." };
      return { ok:false, msg:KA + " = " + XI + "² ÷ (0.10 " + MI + " " + XI + ")." };
    }
    if (id === "tc3") {
      if (S.mode !== "conj") return { ok:false, msg:"Use <strong>Conjugate pairs</strong> mode." };
      if (!S.pred) return { ok:false, msg:"Choose your Challenge 3 prediction first." };
      if (S.pred === "nh4") return { ok:false, msg:sc(NH4.K) + " is NH₄⁺’s " + KA + ", not a " + KB + "." };
      if (S.pred === "benz") return { ok:false, msg:"Its conjugate base has " + KB + " = " + sc(KW / spOf("benz").K) + "." };
      if (S.pred === "hocl") return { ok:false, msg:"OCl⁻ has " + KB + " = " + sc(KW / spOf("hocl").K) + ", a much stronger base." };
      if (!S.fresh) return { ok:false, msg:"You showed a conjugate’s <i>K</i> before choosing. Press <strong>Start over</strong>, then choose your prediction before opening any acid." };
      if (!(opt && opt.live) && (S.sp !== "eth" || S.shown !== "eth")) MV.wait(30, function(){ S.sp = "eth"; S.shown = "eth"; RG.sp.set("eth"); api.save(); paint(); });
      return { ok:true };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id, opt){ return chal(id, opt); } };
}

// ---------- Part 3: Ranking acids ----------
var RANK = ["hf", "meth", "benz", "eth", "hocl", "nh4"];
function short3(id){ return { hf:"HF", meth:"methanoic", benz:"benzoic", eth:"ethanoic", hocl:"hypochlorous", nh4:"NH₄⁺" }[id]; }
function cardT(id){ var s = spOf(id); return id === "nh4" ? "NH₄⁺, ammonium ion" : s.ha + ", " + s.name; }
// @component N5 rankList — tap a card, then Move up / Move down (toolkit .olist look); Check compares with the right order.
function rankList(box, o){
  var sel = null, msg = null, st = o.state;
  function paint(){
    MV.keepFocus(box, function(){
      var h = '<ol class="olist" aria-label="' + esc(o.aria) + '">' + st.order.map(function(id, pos){
        var isSel = sel === pos && !st.solved;
        return '<li><button type="button" class="ostep' + (st.solved ? " good" : "") + '" aria-pressed="' + isSel + '" data-pos="' + pos + '" data-k="' + o.key + id + '"' + (st.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + o.text(id) + "</span></button>" +
          (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + o.key + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + o.key + 'down"' + (pos === st.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
      }).join("") + "</ol>";
      if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + o.key + 'chk">Check the order</button></div>';
      if (st.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + o.ok + (st.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg + " Try again.");
      box.innerHTML = h;
    });
  }
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel = sel === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel, j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= st.order.length) return;
      var t = st.order[i]; st.order[i] = st.order[j]; st.order[j] = t; sel = j; msg = null; o.save(); paint();
      var nb = box.querySelector('[data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = box.querySelector('[data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "check") {
      var right = st.order.filter(function(id, k){ return id === o.right[k]; }).length;
      if (right === o.right.length) { st.solved = true; st.first = st.tries === 0; sel = null; msg = null; }
      else { st.tries++; msg = right + " of " + o.right.length + " are in the right place. " + o.bad; }
      o.save(); paint(); MV.focusFb(box);
    }
  });
  paint();
}
function ladderSVG(selId){
  var top = -3, bot = -11.2, y0 = 44, y1 = 250, XL = 120, XR = 260;
  function Y(lg){ return y0 + (top - lg) / (top - bot) * (y1 - y0); }
  function spread(arr){ arr.sort(function(a, b){ return a.y - b.y; }); for (var i = 1; i < arr.length; i++) if (arr[i].y - arr[i - 1].y < 14) arr[i].y = arr[i - 1].y + 14; return arr; }
  var L = [], R = [], h = "";
  RANK.forEach(function(id){ var s = spOf(id), kb = KW / s.K; L.push({ id:id, y:Y(Math.log10(s.K)), y0:Y(Math.log10(s.K)), t:short3(id) + "  " + scT(s.K) }); R.push({ id:id, y:Y(Math.log10(kb)), y0:Y(Math.log10(kb)), t:cjOf(s) + "  " + scT(kb) }); });
  spread(L); spread(R);
  h += tx(XL, 16, "Acid (Ka)", { fs:12, w:700 }) + tx(XR, 16, "Conjugate base (Kb)", { fs:12, w:700 });
  h += tx(XL, 32, "↑ stronger acid", { fs:10.5, c:"var(--ink-2)" }) + tx(XR, 32, "↑ stronger base", { fs:10.5, c:"var(--ink-2)" });
  h += ln(XL, y0, XL, y1, { c:"var(--plot-axis)", w:1.4 }) + ln(XR, y0, XR, y1, { c:"var(--plot-axis)", w:1.4 });
  RANK.forEach(function(id){
    var a = L.filter(function(p){ return p.id === id; })[0], b = R.filter(function(p){ return p.id === id; })[0], on = id === selId;
    h += ln(XL, a.y0, XR, b.y0, { c:on ? "var(--hi)" : "var(--ink-2)", w:on ? 3 : 1.2, op:on ? 1 : 0.55 });
  });
  L.forEach(function(p){ var on = p.id === selId; h += circ(XL, p.y0, on ? 5.5 : 4, "var(--ab-h3o)") + tx(XL - 9, p.y, p.t, { a:"end", fs:10.5, w:on ? 700 : 400 }); });
  R.forEach(function(p){ var on = p.id === selId; h += circ(XR, p.y0, on ? 5.5 : 4, "var(--ec-an)") + tx(XR + 9, p.y, p.t, { a:"start", fs:10.5, w:on ? 700 : 400 }); });
  return h;
}
function part3(host, api){
  var S = api.S, C = api.content;
  function okOrder(o, start){ return Array.isArray(o) && o.length === RANK.length && RANK.every(function(id){ return o.indexOf(id) >= 0; }) ? o : start.slice(); }
  function st(k, start){ var x = S[k] && typeof S[k] === "object" ? S[k] : (S[k] = {}); x.order = okOrder(x.order, start); x.tries = x.tries || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  var s1 = st("s1", ["eth", "nh4", "hf", "hocl", "benz", "meth"]), s3 = st("s3", ["hocl", "eth", "hf", "nh4", "meth", "benz"]);
  if (RANK.indexOf(S.s2) < 0) S.s2 = "hf";
  var right1 = RANK.slice().sort(function(a, b){ return spOf(b).K - spOf(a).K; });
  var pH10 = {}; RANK.forEach(function(id){ pH10[id] = pHofX(exact(spOf(id).K, 0.10), false); });
  var right3 = RANK.slice().sort(function(a, b){ return pH10[a] - pH10[b]; });
  host.innerHTML =
    '<div class="part kab-st"><h3>' + C.s1.title + "</h3><p>" + C.s1.intro + '</p><div class="kab-r1"></div></div>' +
    '<div class="part kab-st"><h3>' + C.s2.title + "</h3><p>" + C.s2.intro + '</p><div class="kab-s2ch"></div><div class="kab-ladbox"><svg class="kab-lad" viewBox="0 0 380 262" role="img" aria-label=""></svg></div><dl class="read kab-s2read" aria-live="polite"></dl><p><strong>' + C.s2.cap + "</strong></p></div>" +
    '<div class="part kab-st"><h3>' + C.s3.title + "</h3><p>" + C.s3.intro + '</p><div class="kab-r3"></div>' +
      '<details class="alg kab-data"><summary>Check it with data</summary><p class="tiny muted">The tool’s exact values (quadratic), 0.10 mol/L.</p>' +
      MV.tableHTML({ head:["Acid", KA, "pH at 0.10 mol/L"], rows:right3.map(function(id){ return [cardT(id), sc(spOf(id).K), p2(pH10[id])]; }) }) + "</details></div>";
  rankList($(".kab-r1", host), { state:s1, key:"r1", aria:"Acids, strongest first", right:right1, ok:C.s1.ok, bad:C.s1.bad, save:api.save,
    text:function(id){ return cardT(id) + ' <span class="kab-k">(' + KA + " = " + sc(spOf(id).K) + ")</span>"; } });
  rankList($(".kab-r3", host), { state:s3, key:"r3", aria:"0.10 mol/L acid solutions, lowest pH first", right:right3, ok:C.s3.ok, bad:C.s3.bad, save:api.save,
    text:function(id){ return "0.10 mol/L " + (id === "nh4" ? "NH₄⁺ (ammonium ion)" : spOf(id).name) + ' <span class="kab-k">(' + KA + " = " + sc(spOf(id).K) + ")</span>"; } });
  radios($(".kab-s2ch", host), { label:"Acid", cls:"chips", aria:"Acid to show on the ladder", value:S.s2, options:RANK.map(function(id){ return { id:id, t:short3(id) }; }), onChange:function(v){ S.s2 = v; api.save(); paintS2(); } });
  function paintS2(){
    var s = spOf(S.s2), kb = KW / s.K, sv = $(".kab-lad", host);
    sv.innerHTML = ladderSVG(S.s2);
    sv.setAttribute("aria-label", "Conjugate ladder: acids from strongest (HF) to weakest (NH₄⁺) on the left; their conjugate bases on the right in the reverse order, from NH₃ (strongest base) to F⁻ (weakest). " + MV.plain(short3(S.s2)) + " is highlighted.");
    $(".kab-s2read", host).innerHTML = MV.readoutHTML([["Acid", cardT(S.s2) + ", " + KA + " = " + sc(s.K)], ["Conjugate base", cjOf(s)],
      [KB + "(" + cjOf(s) + ")", KWH + " ÷ " + KA + " = " + sc(KW) + " ÷ " + sc(s.K) + " = <strong>" + sc(kb) + "</strong>" + (S.s2 === "nh4" ? " (matching the table’s " + KB + " for ammonia)" : "")]]);
  }
  paintS2();
}

// ---------- Practice 2: Calculate it (number entry; K values as mantissa × 10^exponent; investigation chips in A4) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); ["val", "m", "e"].forEach(function(k){ if (typeof x[k] !== "string") x[k] = ""; }); x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; if (x.inv === undefined) x.inv = null; return x; }
  function inputHTML(it, x, dis){
    if (it.kind === "sci") return '<div class="numrow inrow"><span>' + it.label + '</span> <input class="numin kab-m" data-cm="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="' + esc(MV.plain(it.label)) + ' number in front" value="' + esc(x.m) + '"' + dis + '> × 10<sup><input class="numin kab-e" data-ce="' + it.id + '" type="number" step="1" aria-label="power of 10" value="' + esc(x.e) + '"' + dis + "></sup></div>";
    return '<div class="numrow inrow"><label for="ci-' + it.id + '">' + it.label + '</label> <input class="numin" id="ci-' + it.id + '" data-cin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + dis + '><span class="kab-unit">' + (it.unit || "") + "</span></div>";
  }
  function invHTML(it, x){
    var v = it.inv, h = '<div class="kab-inv"><p>' + v.prompt + '</p><div class="chips" role="radiogroup" aria-label="Investigation choices">' + v.options.map(function(o, k){ var on = x.inv === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-inv="' + k + '" data-k="' + it.id + "i" + k + '">' + o.t + "</button>"; }).join("") + "</div>";
    if (x.inv != null) { var o = v.options[x.inv]; h += MV.fbHTML(MV.ok(o) ? "good" : "bad", (MV.ok(o) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + o.why); }
    return h + "</div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" + inputHTML(it, x, dis);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) {
      var note = it.exactNote && x.used != null && Math.abs(x.used - MV.ans(it)) > Math.abs(MV.ans(it)) * 1e-6 ? " " + it.exactNote : "";
      h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + it.why + note + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      if (it.inv) h += invHTML(it, x);
    } else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/%/g, "").replace(/[a-z/]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function judge(it, x){
    var ans = MV.ans(it), v;
    if (it.kind === "sci") {
      v = kEntry(x.m, x.e);
      if (v == null) return { bad:"Enter the number in front and a whole-number power of 10, such as 2.0 and −5." };
      var rt = it.rtol || [0, 0];
      if (v >= ans * (1 - rt[0]) * (1 - 1e-9) && v <= ans * (1 + rt[1]) * (1 + 1e-9)) return { ok:true, v:v };
      var w = (it.wrong || []).filter(function(z){ return relNear(v, z.match, 0.02); })[0];
      return { fb:w ? w.fb : it.fb };
    }
    v = one(x.val);
    if (v == null) return { bad:"Enter one number, such as 2.74." };
    var t = it.tol || [0, 0];
    if (v >= ans - t[0] - 1e-9 && v <= ans + t[1] + 1e-9) return { ok:true, v:v };
    var w2 = (it.wrong || []).filter(function(z){ return Math.abs(v - z.match) <= Math.max(0.005, Math.abs(z.match) * 0.01); })[0];
    return { fb:w2 ? w2.fb : it.fb };
  }
  host.addEventListener("input", function(e){
    var d = e.target.dataset || {};
    if (d.cin) { ist(d.cin).val = e.target.value; msgs[d.cin] = null; api.save(); }
    else if (d.cm) { ist(d.cm).m = e.target.value; api.save(); }
    else if (d.ce) { ist(d.ce).e = e.target.value; api.save(); }
  });
  host.addEventListener("keydown", function(e){ var d = e.target.dataset || {}, id = d.cin || d.cm || d.ce; if (e.key === "Enter" && id) { var b = host.querySelector('[data-k="' + id + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.inv != null) { x.inv = +b.dataset.inv; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); return; }
      if (r.ok) { x.solved = true; x.used = r.v; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Hit the pH window ----------
var task = (function(){
  var S = null, api = null, T = null;
  function read(){ return { acid:S && S.acid || "", c:S && S.c || "" }; }
  function calc(d){ var s = spOf(d.acid), c = +d.c, xe = exact(s.K, c), xs = Math.sqrt(s.K * c); return { s:s, c:c, xe:xe, xs:xs, pH:pHofX(xe, false), pct:xe / c * 100, pctS:xs / c * 100 }; }
  function paint(){
    var d = read(), pv = $("#kab-tread"), sv = $("#kab-tsvg"); if (!pv) return;
    if (!d.acid || !d.c) { pv.innerHTML = MV.readoutHTML([["Design", muted("choose an acid and a concentration")]]); sv.innerHTML = scaleSVG(null); sv.setAttribute("aria-label", "pH scale from 1.5 to 5.0 with the window 2.70 to 3.30 shaded. No design yet."); return; }
    var r = calc(d);
    pv.innerHTML = MV.readoutHTML([["Design", r.s.name + ", " + d.c + " mol/L (" + KA + " = " + sc(r.s.K) + ")"], ["Exact pH (quadratic)", p2(r.pH)], ["Shortcut " + XI, "√(" + sc(r.s.K) + " × " + d.c + ") = " + sc(r.xs)], ["Percent ionization (exact)", pctT(r.pct) + (r.pct < 5 ? " ✓ under 5%" : " ✗ over 5%")]]);
    sv.innerHTML = scaleSVG(r.pH);
    sv.setAttribute("aria-label", "pH scale from 1.5 to 5.0 with the window 2.70 to 3.30 shaded. Your design: pH " + p2(r.pH) + (r.pH >= 2.7 && r.pH <= 3.3 ? ", inside the window." : ", outside the window."));
  }
  function scaleSVG(ph){
    var x0 = 20, x1 = 340, lo = 1.5, hi = 5.0; function X(v){ return x0 + (clamp(v, lo, hi) - lo) / (hi - lo) * (x1 - x0); }
    var h = rect(X(2.7), 14, X(3.3) - X(2.7), 30, "var(--hi-soft)") + ln(x0, 44, x1, 44, { c:"var(--plot-axis)", w:1.6 });
    for (var v = 2; v <= 5; v++) h += ln(X(v), 40, X(v), 48, { c:"var(--plot-axis)" }) + tx(X(v), 60, String(v), { fs:11, c:"var(--ink-2)" });
    h += tx(X(3.0), 8, "window 2.70–3.30", { fs:10.5, c:"var(--ink-2)" });
    if (ph != null) h += '<polygon points="' + r1(X(ph)) + ',42 ' + r1(X(ph) - 7) + ",26 " + r1(X(ph) + 7) + ',26" fill="var(--pen)"/>' + tx(X(ph), 18, (ph > hi ? "› " : ph < lo ? "‹ " : "") + "pH " + p2(ph), { fs:11.5, w:700 });
    return h;
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = a.content || {};
      var acids = (MV.C && MV.C.task && MV.C.task.acids) || [], concs = (MV.C && MV.C.task && MV.C.task.concs) || [];
      if (!acids.some(function(x){ return x.id === S.acid; })) S.acid = "";
      if (concs.indexOf(S.c) < 0) S.c = "";
      inp.innerHTML = '<div class="kab-ta"></div><div class="kab-tc"></div>';
      pv.innerHTML = '<h4 class="kab-h4">Your solution</h4><svg class="kab-scale" id="kab-tsvg" viewBox="0 0 360 66" role="img" aria-label=""></svg><dl class="read" id="kab-tread" aria-live="polite"></dl>';
      radios($(".kab-ta", inp), { label:"Acid", cls:"chips", aria:"Acid", value:S.acid, options:acids, onChange:function(v){ S.acid = v; api.save(); paint(); api.update(); } });
      radios($(".kab-tc", inp), { label:"Concentration (mol/L)", cls:"chips", aria:"Concentration in mol per litre", value:S.c, options:concs.map(function(c){ return { id:c, t:c }; }), onChange:function(v){ S.c = v; api.save(); paint(); api.update(); } });
      paint();
    },
    read:read,
    valid:function(d){ return d.acid && d.c ? true : "Choose an acid and a concentration."; },
    checks:function(d){ var r = calc(d); return [r.pH >= 2.70 && r.pH <= 3.30, r.pct < 5, r.c <= 0.10 + 1e-12]; },
    key:function(d){ return d.acid + "@" + d.c; },
    label:function(k){ var p = k.split("@"); return spOf(p[0]).name + ", " + p[1] + " mol/L"; },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ calc:calcAct },
  task:task
});
})();
