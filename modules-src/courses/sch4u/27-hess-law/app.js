// SCH4U 27 Hess's Law: hero (C4 enthalpy-level diagram: C → CO₂ directly and via CO), Equation puzzle (Explore: the
// card tray with Reverse / multiplier / Include, a live sum with cancelling, a readout, Diagram mode and Free build),
// Test Hess's law (Part 3: magnesium calorimetry data, combine, evaluate) and Three roads to lime (task: card tray).
// Every card's ΔH is computed from the course table MV.chem.data.dHf; only Part 3's made-up runs carry their own ΔH.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var D = MV.chem.data, fx = MV.chem.fx, f = MV.chem.f;
function r1(v){ return Math.round(v * 10) / 10; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function obj(x){ return x && typeof x === "object" && !Array.isArray(x) ? x : {}; }
function sg(v){ v = r1(v); return (v > 0 ? "+" : "") + fx(v, 1); }
function one(s){ var v = MV.parseNum(String(s || "").replace(/[a-z/]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
var DH = "Δ<i>H</i>";
var LIN = function(t){ return t; };

// ---------- course data ----------
var HF = {}; D.dHf.forEach(function(r){ HF[r[0]] = r[1]; });
var ELEM = { "C(s)":1, "O2(g)":1, "H2(g)":1, "N2(g)":1, "Ca(s)":1, "Fe(s)":1, "Mg(s)":1 };   // standard states: ΔH°f = 0
function hf(s){ return HF[s] != null ? HF[s] : 0; }
// Formation equations for Free build (elements in their standard states; ΔH°f values come from the course table).
var FORM = {
  "H2O(l)":"H2(g) + 1/2 O2(g) -> H2O(l)", "H2O(g)":"H2(g) + 1/2 O2(g) -> H2O(g)", "CO2(g)":"C(s) + O2(g) -> CO2(g)", "CO(g)":"C(s) + 1/2 O2(g) -> CO(g)",
  "CH4(g)":"C(s) + 2 H2(g) -> CH4(g)", "C2H5OH(l)":"2 C(s) + 3 H2(g) + 1/2 O2(g) -> C2H5OH(l)", "CH3OH(l)":"C(s) + 2 H2(g) + 1/2 O2(g) -> CH3OH(l)",
  "NH3(g)":"1/2 N2(g) + 3/2 H2(g) -> NH3(g)", "NO(g)":"1/2 N2(g) + 1/2 O2(g) -> NO(g)", "NO2(g)":"1/2 N2(g) + O2(g) -> NO2(g)",
  "CaCO3(s)":"Ca(s) + C(s) + 3/2 O2(g) -> CaCO3(s)", "CaO(s)":"Ca(s) + 1/2 O2(g) -> CaO(s)", "Fe2O3(s)":"2 Fe(s) + 3/2 O2(g) -> Fe2O3(s)", "MgO(s)":"Mg(s) + 1/2 O2(g) -> MgO(s)"
};

// ---------- @component thermoCards — thermochemical equation engine (module-specific card tray core; plan: reused by 28).
// parse("1/2 N2(g) + O2(g) -> NO2(g)") -> {r:[{s, n}], p:[…]}; card ΔH from the course table unless given; adjust(card,
// {rev, k}); sumOf(list) -> {L, R, net (products +), dH, order}; same(net, net); diffs(net, target) -> leftovers / needs.
function parse(s){
  var p = String(s).split("->");
  function side(t){ return t.split(" + ").map(function(x){ x = x.trim(); var m = x.match(/^(\d+)(?:\/(\d+))?\s+(\S+)$/); return m ? { s:m[3], n:(+m[1]) / (m[2] ? +m[2] : 1) } : { s:x, n:1 }; }); }
  return { r:side(p[0]), p:side(p[1] || "") };
}
function eqDH(e){ var v = 0; e.p.forEach(function(t){ v += t.n * hf(t.s); }); e.r.forEach(function(t){ v -= t.n * hf(t.s); }); return r1(v); }
function mkCard(src, dH){ var e = parse(src); e.dH = dH != null ? dH : eqDH(e); return e; }
function adjust(c, st){
  var k = st.k || 1, a = st.rev ? c.p : c.r, b = st.rev ? c.r : c.p;
  function sc(t){ return { s:t.s, n:t.n * k }; }
  return { r:a.map(sc), p:b.map(sc), dH:r1((st.rev ? -1 : 1) * c.dH * k) };
}
function netOf(e){ var n = {}; e.r.forEach(function(t){ n[t.s] = (n[t.s] || 0) - t.n; }); e.p.forEach(function(t){ n[t.s] = (n[t.s] || 0) + t.n; }); return n; }
function sumOf(list){
  var L = {}, R = {}, order = [], seen = {}, dH = 0;
  function add(m, t){ m[t.s] = (m[t.s] || 0) + t.n; if (!seen[t.s]) { seen[t.s] = 1; order.push(t.s); } }
  list.forEach(function(e){ e.r.forEach(function(t){ add(L, t); }); e.p.forEach(function(t){ add(R, t); }); dH += e.dH; });
  var net = {}; order.forEach(function(s){ var v = (R[s] || 0) - (L[s] || 0); if (Math.abs(v) > 1e-9) net[s] = v; });
  return { L:L, R:R, net:net, order:order, dH:r1(dH), terms:list.map(function(e){ return e.dH; }) };
}
function keysOf(a, b){ var k = {}; Object.keys(a).forEach(function(s){ k[s] = 1; }); Object.keys(b).forEach(function(s){ k[s] = 1; }); return Object.keys(k); }
function same(a, b){ return keysOf(a, b).every(function(s){ return Math.abs((a[s] || 0) - (b[s] || 0)) < 1e-9; }); }
function diffs(net, tgt){
  var left = [], need = [];
  keysOf(net, tgt).forEach(function(s){
    var n = net[s] || 0, t = tgt[s] || 0;
    if (Math.abs(n - t) < 1e-9) return;
    if (!t) left.push({ s:s, n:Math.abs(n), side:n > 0 ? "right" : "left" });
    else if (n * t > 0 && Math.abs(n) > Math.abs(t)) left.push({ s:s, n:Math.abs(n) - Math.abs(t), side:n > 0 ? "right" : "left", extra:true });
    else need.push({ s:s, t:t, n:n });
  });
  return { left:left, need:need };
}
function waterClash(sm){ return (sm.L["H2O(l)"] || sm.R["H2O(l)"]) && (sm.L["H2O(g)"] || sm.R["H2O(g)"]); }

// ---------- typesetting ----------
function cf(n){                                       // coefficient text: 1 → "", 0.5 → "½", 1.5 → "1½"
  if (Math.abs(n - 1) < 1e-9) return "";
  var w = Math.floor(n + 1e-9), q = Math.round((n - w) * 4);
  if (Math.abs((n - w) * 4 - q) > 1e-6) return String(Math.round(n * 1000) / 1000);
  if (q === 4) { w++; q = 0; }
  return (w ? String(w) : "") + ["", "¼", "½", "¾"][q];
}
var SUBD = "₀₁₂₃₄₅₆₇₈₉";
function uni(s){ return String(s).replace(/([A-Za-z)])(\d+)/g, function(_, a, d){ return a + d.split("").map(function(c){ return SUBD[+c]; }).join(""); }); }
function spH(s){ return f(s); }
function termH(t, cls){ return '<span class="hs-t' + (cls || "") + '">' + cf(t.n) + spH(t.s) + "</span>"; }
function sideH(ts){ return ts.length ? ts.map(function(t){ return termH(t); }).join(" + ") : '<span class="muted">nothing</span>'; }
function eqH(e){ return '<span class="hs-eq">' + sideH(e.r) + " → " + sideH(e.p) + "</span>"; }
function eqU(e){ function sd(ts){ return ts.map(function(t){ return cf(t.n) + uni(t.s); }).join(" + "); } return sd(e.r) + " → " + sd(e.p); }
function sideU(ts){ return ts.map(function(t){ return cf(t.n) + uni(t.s); }).join(" + "); }
function netEq(sm){
  var r = [], p = [];
  sm.order.forEach(function(s){ var v = sm.net[s]; if (v == null) return; if (v < 0) r.push({ s:s, n:-v }); else p.push({ s:s, n:v }); });
  return { r:r, p:p };
}
function dhSum(terms){
  if (!terms.length) return '<span class="muted">no cards included</span>';
  var h = terms.map(function(v, i){ return i ? (v < 0 ? " − " : " + ") + fx(Math.abs(v), 1) : fx(v, 1); }).join("");
  return '<span class="hs-dhv">' + h + (terms.length > 1 ? " = " + sg(r1(terms.reduce(function(a, b){ return a + b; }, 0))) : "") + " kJ</span>";
}
function amtSide(x){ return cf(x.n) + spH(x.s) + " on the " + x.side; }
function leftText(d){ return d.left.length ? d.left.map(amtSide).join(", ") : "none"; }
function needText(d){
  return d.need.map(function(x){
    var ts = x.t > 0 ? "right" : "left", has = !x.n ? "has none" : "has " + (cf(Math.abs(x.n)) || "1") + " on the " + (x.n > 0 ? "right" : "left");
    return spH(x.s) + ": the target has " + (cf(Math.abs(x.t)) || "1") + " on the " + ts + "; your sum " + has;
  }).join("; ");
}

// @component sumStack — vertical sum of adjusted equations: one row per card (label, equation, ΔH in orange), species
// that cancel struck through (both sides when they cancel fully, the smaller side when partly; a new strike animates
// unless motion is reduced), then the net equation. mem (object) remembers strikes between repaints.
function sumStack(rows, mem){
  var L = {}, R = {};
  rows.forEach(function(r){ r.eq.r.forEach(function(t){ L[t.s] = (L[t.s] || 0) + t.n; }); r.eq.p.forEach(function(t){ R[t.s] = (R[t.s] || 0) + t.n; }); });
  function struck(s, side){ var l = L[s] || 0, r = R[s] || 0; if (!l || !r) return false; if (Math.abs(l - r) < 1e-9) return true; return side === "L" ? l < r : r < l; }
  var now = {}, h = '<div class="hs-stack" role="group" aria-label="Sum of the included equations">';
  rows.forEach(function(r, i){
    function sd(ts, side){
      return ts.map(function(t){
        var k = i + side + t.s, x = struck(t.s, side); if (x) now[k] = 1;
        return termH(t, x ? " hs-x" + (mem && !mem[k] && !MV.reduceMotion ? " hs-xa" : "") : "");
      }).join(" + ");
    }
    h += '<div class="hs-row"><span class="hs-rl">' + r.lab + '</span><span class="hs-req">' + sd(r.eq.r, "L") + " → " + sd(r.eq.p, "R") + '</span><span class="hs-rdh">' + sg(r.eq.dH) + " kJ</span></div>";
  });
  var sm = sumOf(rows.map(function(r){ return r.eq; })), ne = netEq(sm);
  h += '<div class="hs-row hs-net"><span class="hs-rl">Net</span><span class="hs-req">' + (ne.r.length || ne.p.length ? eqH(ne) : '<span class="muted">everything cancels</span>') + '</span><span class="hs-rdh">' + sg(sm.dH) + " kJ</span></div></div>";
  if (mem) { Object.keys(mem).forEach(function(k){ delete mem[k]; }); Object.keys(now).forEach(function(k){ mem[k] = 1; }); }
  return h;
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–14) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function paint(){
    var fcs = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, tab = on || (!any && first && !locked); if (!locked) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (fcs) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}

// ---------- SVG helpers ----------
function n1(v){ return Math.round(v * 10) / 10; }
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + n1(x) + '" y="' + n1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' +
    ' paint-order="stroke" stroke="var(--sheet)" stroke-width="3.5" stroke-linejoin="round"' + opA(o.op) + ">" + s + "</text>";
}
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) + '" y2="' + n1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function head(x, y, dir, len, fill, op){ return '<path d="M' + n1(x) + " " + n1(y) + " L" + n1(x - len * 0.45) + " " + n1(y - dir * len) + " L" + n1(x + len * 0.45) + " " + n1(y - dir * len) + ' Z" fill="' + fill + '"' + opA(op) + "/>"; }

// @component C4 levelDiagram — enthalpy-level diagram as SVG: horizontal levels (ink, labelled), vertical ΔH arrows
// (orange --en-dh, drawn for a fraction t of their length), an optional dashed ink target arrow and a bracket.
// spec {W, H, top, bot, vmin, vmax, levels:[{v, x0, x1, lab, la:"start"|"end", op, dash}], arrows:[{x, v0, v1, t, lab, c, dash, w}], bracket:{x, v0, v1, op}, foot:{t, op}}
function levelDiagram(o){
  var span = (o.vmax - o.vmin) || 1;
  function Y(v){ return o.top + (o.vmax - v) / span * (o.bot - o.top); }
  var h = "";
  (o.levels || []).forEach(function(L){
    if (L.op === 0) return;
    var y = Y(L.v);
    h += ln(L.x0, y, L.x1, y, { c:L.c || "var(--ink)", w:2.4, d:L.dash, op:L.op });
    if (L.lab) h += tx(L.la === "end" ? L.x1 - 2 : L.x0 + 2, y - 11, L.lab, { a:L.la === "end" ? "end" : "start", fs:13, w:600, op:L.op, c:L.lc });
  });
  (o.arrows || []).forEach(function(A){
    var t = A.t == null ? 1 : A.t; if (t <= 0) return;
    var y0 = Y(A.v0), y1 = Y(lerp(A.v0, A.v1, t)), dir = y1 >= y0 ? 1 : -1, c = A.c || "var(--en-dh)", L = Math.abs(y1 - y0);
    if (L > 10) h += ln(A.x, y0, A.x, y1 - dir * 8, { c:c, w:A.w || 3, d:A.dash });
    if (L > 2) h += head(A.x, y1, dir, Math.min(11, L), c);
    if (A.lab && t >= 1) h += tx(A.x + 8, (y0 + y1) / 2, A.lab, { a:"start", fs:12.5, w:700, c:A.lc || c });
  });
  if (o.bracket && o.bracket.op !== 0) {
    var B = o.bracket, ya = Y(B.v0), yb = Y(B.v1);
    h += '<path d="M' + B.x + " " + n1(ya) + " h8 V" + n1(yb) + " h-8" + '" fill="none" stroke="var(--en-dh)" stroke-width="2"' + opA(B.op) + "/>";
  }
  if (o.foot && o.foot.op !== 0) h += tx(o.W / 2, o.H - 16, o.foot.t, { fs:14, w:700, c:"var(--en-dh)", op:o.foot.op });
  return h;
}
// The hero / P3 scene: C(s) + O₂(g) → CO₂(g) directly and via CO. st = {lev, a0, a1, a2, br} each 0..1.
function routesSpec(st, W, H){
  var vCO = hf("CO(g)"), vCO2 = hf("CO2(g)"), step2 = r1(vCO2 - vCO);
  return { W:W, H:H, top:56, bot:H - 70, vmin:vCO2, vmax:0,
    levels:[{ v:0, x0:30, x1:W - 30, lab:"C(s) + O₂(g)", op:st.lev }, { v:vCO, x0:W * 0.44, x1:W - 30, lab:"CO(g) + ½O₂(g)", la:"end", op:st.lev }, { v:vCO2, x0:30, x1:W - 30, lab:"CO₂(g)", op:st.lev }],
    arrows:[{ x:W * 0.22, v0:0, v1:vCO2, t:st.a0, lab:sg(vCO2) + " kJ" }, { x:W * 0.54, v0:0, v1:vCO, t:st.a1, lab:sg(vCO) + " kJ" }, { x:W * 0.7, v0:vCO, v1:vCO2, t:st.a2, lab:sg(step2) + " kJ" }],
    bracket:{ x:W - 22, v0:0, v1:vCO2, op:st.br }, foot:{ t:fx(vCO, 1) + " + (" + fx(step2, 1) + ") = " + fx(vCO2, 1) + " kJ", op:st.br } };
}

// ---------- hero ----------
function hero(fg){
  var svg = $("#hs-hx-svg"), ctr = $("#hs-hx-ctr"), rep = $("#hs-hx-replay");
  if (!svg) return;
  var run = 0, st;
  var vCO = hf("CO(g)"), vCO2 = hf("CO2(g)"), step2 = r1(vCO2 - vCO);
  function draw(){ svg.innerHTML = levelDiagram(routesSpec(st, 480, 330)); }
  function final(){ st = { lev:1, a0:1, a1:1, a2:1, br:1 }; draw(); ctr.innerHTML = "Same start, same end, same " + DH + ". The route doesn’t change the climb."; rep.hidden = false; }
  function play(){
    var id = ++run; st = { lev:0, a0:0, a1:0, a2:0, br:0 }; rep.hidden = true; draw();
    function ok(){ return id === run; }
    ctr.innerHTML = "Three enthalpy levels: carbon and oxygen at the top, carbon dioxide at the bottom.";
    var steps = [
      ["lev", 600, null],
      ["a0", 1000, "Straight down: C(s) + O₂(g) → CO₂(g), " + sg(vCO2) + " kJ."],
      ["a1", 700, "Or in two steps. First to CO: " + sg(vCO) + " kJ…"],
      ["a2", 900, "…then on to CO₂: " + sg(step2) + " kJ."],
      ["br", 500, null]
    ];
    (function next(i){
      if (!ok()) return;
      if (i >= steps.length) { MV.wait(300, function(){ if (ok()) final(); }); return; }
      var s = steps[i]; if (s[2]) ctr.innerHTML = s[2];
      MV.tween({ dur:s[1], ease:s[0] === "lev" || s[0] === "br" ? undefined : LIN, step:function(t){ if (!ok()) return; st[s[0]] = t; draw(); }, done:function(){ if (ok()) MV.wait(500, function(){ next(i + 1); }); } });
    })(0);
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
  void fg;
}

// ---------- Explore: Equation puzzle ----------
var MULS = [{ id:"0.5", t:"×½", aria:"times one half" }, { id:"1", t:"×1", aria:"times 1" }, { id:"2", t:"×2", aria:"times 2" }, { id:"3", t:"×3", aria:"times 3" }];
function cleanSt(x){ x = obj(x); return { inc:x.inc !== false, rev:!!x.rev, k:[0.5, 1, 2, 3].indexOf(+x.k) >= 0 ? +x.k : 1 }; }
function freeCards(src){
  var e = parse(src), list = [], seen = {};
  function add(s){ if (seen[s] || ELEM[s] || !FORM[s]) return; seen[s] = 1; list.push(s); }
  e.r.concat(e.p).forEach(function(t){ add(t.s); if (t.s === "H2O(l)") add("H2O(g)"); if (t.s === "H2O(g)") add("H2O(l)"); });
  return list.map(function(s){ return mkCard(FORM[s]); });
}
function explore(host, api){
  var S = api.S, C = api.content, PZ = {}, FR = {};
  C.puzzles.forEach(function(p){ PZ[p.id] = { id:p.id, target:parse(p.target), cards:p.cards.map(function(c){ return mkCard(c); }) }; });
  C.free.forEach(function(t){ FR[t.id] = { id:t.id, target:parse(t.eq), cards:freeCards(t.eq) }; });
  if (["puzzle", "diagram", "free"].indexOf(S.mode) < 0) S.mode = "puzzle";
  if (!PZ[S.pz]) S.pz = "A";
  if (!FR[S.ft]) S.ft = C.free[0].id;
  S.cs = obj(S.cs); S.typed = obj(S.typed);
  var locked = false, A = null, scene = null, sel = -1, seq = 0, tw = null, mem = {}, built = "";
  function key(){ return S.mode === "free" ? "F" + S.ft : S.pz; }
  function cur(){ return S.mode === "free" ? FR[S.ft] : PZ[S.pz]; }
  function states(k, n){ var a = S.cs[k]; if (!Array.isArray(a) || a.length !== n) a = S.cs[k] = []; for (var i = 0; i < n; i++) a[i] = cleanSt(a[i]); return a; }

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="hs-top"><div class="hs-modes"></div><div class="hs-pz"></div>' +
    '<div class="hs-free" hidden><label class="hs-fl" for="hs-ft">Target</label><select id="hs-ft" class="hs-sel">' + C.free.map(function(t){ return '<option value="' + t.id + '">' + esc(eqU(parse(t.eq))) + "</option>"; }).join("") + "</select></div></div>" +
    '<div class="hs-grid"><div class="hs-trayw"><h4 class="hs-h4">Cards</h4><div class="hs-tray" role="group" aria-label="Equation cards"></div><p class="tiny muted hs-fnote" hidden>' + C.freeNote + "</p></div>" +
    '<div class="hs-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="hs-tgt"></div>' +
    '<div class="hs-sumw"><h4 class="hs-h4">Sum</h4><div class="hs-sum"></div></div>' +
    '<div class="hs-dia" hidden><svg class="hs-svg" id="hs-dsvg" viewBox="0 0 480 360" role="img" aria-label=""></svg></div>' +
    '<dl class="read hs-read"></dl><div class="numrow hs-typed"><label for="hs-tin">Your ' + DH + ' for the target:</label><input class="numin" id="hs-tin" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" data-k="hs-tin"><span>kJ</span></div>' +
    '<p class="vh hs-say" aria-live="polite"></p></div></div><div class="hs-tabs"></div>';
  MV.chem.tablePanel($(".hs-tabs", host), "dhf", { title:"Course data table: " + DH + "°f values" });
  var tray = $(".hs-tray", host), sel_ = $("#hs-ft"), tin = $("#hs-tin"), svg = $("#hs-dsvg");
  sel_.value = S.ft;

  var RG = {}, RGm = [];
  RG.mode = radios($(".hs-modes", host), { label:"Mode", aria:"Puzzle mode", options:C.modes, value:S.mode, onChange:function(v){ user(); S.mode = v; api.save(); paint(); } });
  RG.pz = radios($(".hs-pz", host), { label:"Puzzle", cls:"chips", aria:"Choose a puzzle", options:C.puzzles.map(function(p){ return { id:p.id, t:p.id, aria:"Puzzle " + p.id }; }), value:S.pz, onChange:function(v){ user(); S.pz = v; api.save(); paint(); } });
  sel_.addEventListener("change", function(){ if (locked) return; user(); S.ft = sel_.value; api.save(); paint(); });
  tin.addEventListener("input", function(){ S.typed[key()] = tin.value; api.save(); MV.changed(); });

  function user(){ cancelAnim(); scene = null; sel = -1; }
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } A = null; }

  // ----- the tray -----
  function build(){
    var set = cur(), k = key();
    if (built === k) return; built = k; mem = {};
    tray.innerHTML = set.cards.map(function(c, i){
      return '<div class="hs-card" data-ci="' + i + '"><div class="hs-ch"><span class="hs-cn">Card ' + (i + 1) + "</span>" +
        '<button type="button" class="hs-tg" data-act="rev" data-ci="' + i + '" data-k="rev' + k + i + '" aria-pressed="false"></button>' +
        '<span class="hs-mul" data-ci="' + i + '"></span>' +
        '<button type="button" class="hs-tg" data-act="inc" data-ci="' + i + '" data-k="inc' + k + i + '" aria-pressed="false"></button></div>' +
        '<p class="hs-given">As given: ' + eqH(c) + ", " + sg(c.dH) + ' kJ</p><p class="hs-adj"></p></div>';
    }).join("");
    var st = states(k, set.cards.length);
    RGm = set.cards.map(function(c, i){
      var r = radios($('.hs-mul[data-ci="' + i + '"]', tray), { aria:"Multiplier for card " + (i + 1), cls:"seg hs-segm", options:MULS, value:String(st[i].k),
        onChange:function(v){ user(); states(key(), cur().cards.length)[i].k = +v; api.save(); paint(); } });
      if (locked) r.lock(true);
      return r;
    });
  }
  tray.addEventListener("click", function(e){
    var b = e.target.closest("button.hs-tg"); if (!b || b.disabled || locked) return;
    var i = +b.dataset.ci, st = states(key(), cur().cards.length)[i]; user();
    if (b.dataset.act === "rev") st.rev = !st.rev; else st.inc = !st.inc;
    api.save(); paint();
  });
  function flip(i){
    if (MV.reduceMotion) return;
    var el = $('.hs-card[data-ci="' + i + '"]', tray); if (!el) return;
    el.classList.remove("hs-flip"); void el.offsetWidth; el.classList.add("hs-flip");
    MV.wait(700, function(){ el.classList.remove("hs-flip"); });
  }
  function paintCards(set, st){
    set.cards.forEach(function(c, i){
      var el = $('.hs-card[data-ci="' + i + '"]', tray); if (!el) return;
      var s = st[i], a = adjust(c, s), dh = A && A.ci === i ? A.dH : a.dH;
      el.classList.toggle("off", !s.inc); el.classList.toggle("hs-on", i === sel);
      var rb = $('[data-act="rev"]', el), ib = $('[data-act="inc"]', el);
      rb.setAttribute("aria-pressed", String(s.rev)); rb.innerHTML = (s.rev ? "✓ " : "") + "Reverse"; rb.disabled = locked;
      ib.setAttribute("aria-pressed", String(s.inc)); ib.innerHTML = (s.inc ? "✓ Included" : "Include"); ib.disabled = locked;
      $(".hs-adj", el).innerHTML = (s.inc ? "" : '<span class="hs-offl">Not included: </span>') + eqH(a) + ' <span class="hs-dh">' + DH + " = " + sg(dh) + " kJ</span>";
      if (RGm[i]) RGm[i].set(String(s.k));
    });
  }
  function rowsOf(set, st){ var rows = []; set.cards.forEach(function(c, i){ if (st[i].inc) rows.push({ lab:"Card " + (i + 1), n:i + 1, eq:adjust(c, st[i]) }); }); return rows; }
  function evalCur(){
    var set = cur(), st = states(key(), set.cards.length), rows = rowsOf(set, st), sm = sumOf(rows.map(function(r){ return r.eq; })), tn = netOf(set.target);
    return { set:set, st:st, rows:rows, sm:sm, tnet:tn, match:rows.length > 0 && same(sm.net, tn), d:diffs(sm.net, tn), tdH:eqDH(set.target) };
  }

  // ----- diagram -----
  function diaSpec(R){
    if (scene) return routesSpec(scene, 480, 360);
    var W = 480, H = 360, n = R.rows.length, gap = n ? Math.min(92, 300 / n) : 0, cum = 0, vals = [0, R.tdH], arrows = [], levels = [];
    var pts = R.rows.map(function(r, i){ var v = A && A.ci === r.n - 1 ? A.dH : r.eq.dH, o = { x:66 + i * gap, v0:cum, v1:cum + v, lab:r.n + ": " + sg(v) }; cum += v; vals.push(cum); return o; });
    if (A && A.span) vals = vals.concat(A.span);
    var vmin = Math.min.apply(null, vals), vmax = Math.max.apply(null, vals);
    if (vmax - vmin < 60) { var mid = (vmax + vmin) / 2; vmin = mid - 30; vmax = mid + 30; }
    levels.push({ v:0, x0:24, x1:W - 24, lab:"start: " + sideU(R.set.target.r) });
    pts.forEach(function(p, i){ arrows.push(p); var nx = i < pts.length - 1 ? pts[i + 1].x : p.x + 40; levels.push({ v:p.v1, x0:p.x - 14, x1:nx + 14, c:"var(--ink-2)", dash:"5 4" }); });
    levels.push({ v:R.tdH, x0:W - 120, x1:W - 24, lab:"target: " + sideU(R.set.target.p), la:"end" });
    arrows.push({ x:W - 60, v0:0, v1:R.tdH, c:"var(--ink)", dash:"7 5", w:2.4, lab:R.match ? sg(R.tdH) : "?", lc:"var(--ink)" });
    return { W:W, H:H, top:60, bot:H - 40, vmin:vmin, vmax:vmax, levels:levels, arrows:arrows };
  }
  function diaAria(R){
    if (scene) return "Enthalpy-level diagram: C(s) + O₂(g) at the top, CO(g) + ½O₂(g) in the middle, CO₂(g) at the bottom. The direct arrow is −393.5 kJ; the two steps via CO are −110.5 kJ and −283.0 kJ and end at the same level.";
    var t = "Enthalpy-level diagram. The start level is the target’s reactants. ";
    t += R.rows.length ? R.rows.map(function(r){ var v = A && A.ci === r.n - 1 ? A.dH : r.eq.dH; return "Card " + r.n + " arrow " + (v < 0 ? "down " : "up ") + fx(Math.abs(v), 1) + " kJ"; }).join("; ") + ". Your path ends at " + MV.plain(sg(R.sm.dH)) + " kJ. " : "No cards included. ";
    return t + "The dashed target arrow ends at the target’s products" + (R.match ? ", " + MV.plain(sg(R.tdH)) + " kJ, the same level." : ".");
  }
  function drawDia(R){ R = R || evalCur(); svg.innerHTML = levelDiagram(diaSpec(R)); svg.setAttribute("aria-label", diaAria(R)); }

  // ----- paint -----
  function paint(){
    var free = S.mode === "free";
    build();
    $(".hs-free", host).hidden = !free; $(".hs-pz", host).hidden = free; $(".hs-fnote", host).hidden = !free; $(".hs-typed", host).hidden = free;
    var R = evalCur();
    paintCards(R.set, R.st);
    $(".hs-tgt", host).innerHTML = '<p class="hs-tgtl"><span class="hs-tl">Target' + (free ? "" : " (Puzzle " + S.pz + ")") + ":</span> " + eqH(R.set.target) + "</p>";
    var dia = S.mode === "diagram";
    $(".hs-dia", host).hidden = !dia; $(".hs-sumw", host).hidden = dia;
    if (dia) drawDia(R);
    else $(".hs-sum", host).innerHTML = R.rows.length ? sumStack(R.rows, mem) : '<p class="muted">No cards included yet. Turn on <strong>Include</strong> on a card.</p>';
    var ne = netEq(R.sm), rows = [["Target", eqH(R.set.target)], ["Sum so far", R.rows.length ? (ne.r.length || ne.p.length ? eqH(ne) : "everything cancels") : '<span class="muted">no cards included</span>'],
      ["Left over", R.rows.length ? leftText(R.d) : "—"]];
    if (R.rows.length && R.d.need.length) rows.push(["Still needed", needText(R.d)]);
    if (waterClash(R.sm)) rows.push(["State check", C.stateRule]);
    rows.push([DH + " of sum", dhSum(R.sm.terms)]);
    rows.push(["Match", R.match ? "<strong>Sum matches the target ✓</strong>" : "Not yet ✗"]);
    $(".hs-read", host).innerHTML = MV.readoutHTML(rows);
    if (document.activeElement !== tin) tin.value = S.typed[key()] || "";
    tin.disabled = locked; sel_.disabled = locked;
    $(".hs-say", host).textContent = R.rows.length ? "Sum: " + (ne.r.length || ne.p.length ? eqU(ne) : "everything cancels") + ". ΔH " + MV.plain(sg(R.sm.dH)) + " kJ. " + (R.match ? "Matches the target." : "Doesn’t match the target yet.") : "No cards included.";
    MV.changed();
  }
  function lock(b){
    locked = b; RG.mode.lock(b); RG.pz.lock(b); RGm.forEach(function(r){ r.lock(b); });
    $$("button.hs-tg", tray).forEach(function(x){ x.disabled = b; }); tin.disabled = b; sel_.disabled = b;
  }
  function setCards(pz, arr){ S.cs[pz] = arr.map(cleanSt); }
  function sync(){ RG.mode.set(S.mode); RG.pz.set(S.pz); }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancelAnim(); scene = null; sel = -1;
      if (p.id === "p1") { S.mode = "diagram"; S.pz = "A"; setCards("A", [{}, { inc:false }]); sel = 0; }
      else if (p.id === "p2") { S.mode = "diagram"; S.pz = "B"; setCards("B", [{ inc:false }, {}, { inc:false }]); sel = 1; }
      else if (p.id === "p3") { S.mode = "diagram"; S.pz = "A"; scene = { lev:1, a0:1, a1:0, a2:0, br:0 }; }
      else { S.mode = "puzzle"; S.pz = "A"; setCards("A", [{ inc:false }, {}]); sel = 1; }
      built = ""; sync(); api.save(); lock(true); paint();
    },
    run:function(p, done){
      var my = seq;
      function ok(){ return my === seq; }
      function fin(){ if (!ok()) return; tw = null; A = null; lock(false); paint(); MV.wait(150, done); }
      function tween(dur, fn, then){ tw = MV.tween({ dur:dur, step:function(t){ if (ok()) fn(t); }, done:function(){ if (ok()) then(); } }); }
      var st = states(S.pz, PZ[S.pz].cards.length);
      if (p.id === "p1") {
        var v1 = PZ.A.cards[0].dH;
        flip(0);
        tween(1100, function(t){ A = { ci:0, dH:r1(lerp(v1, -v1, t)), span:[v1, -v1] }; paintCards(cur(), st); drawDia(); }, function(){ st[0].rev = true; api.save(); fin(); });
      } else if (p.id === "p2") {
        var v2 = PZ.B.cards[1].dH;
        tween(1100, function(t){ A = { ci:1, dH:r1(lerp(v2, 2 * v2, t)), span:[v2, 2 * v2] }; paintCards(cur(), st); drawDia(); }, function(){ st[1].k = 2; api.save(); flip(1); fin(); });
      } else if (p.id === "p3") {
        tween(800, function(t){ scene.a1 = t; drawDia(); }, function(){
          tween(900, function(t){ scene.a2 = t; drawDia(); }, function(){
            tween(500, function(t){ scene.br = t; drawDia(); }, fin);
          });
        });
      } else {
        var v4 = PZ.A.cards[1].dH;
        flip(1);
        tween(800, function(t){ A = { ci:1, dH:r1(lerp(v4, -v4, t)) }; paintCards(cur(), st); }, function(){
          st[1].rev = true; A = null; api.save(); paint();
          MV.wait(MV.reduceMotion ? 0 : 400, function(){
            if (!ok()) return;
            tween(800, function(t){ A = { ci:1, dH:r1(lerp(-v4, -2 * v4, t)) }; paintCards(cur(), st); }, function(){ st[1].k = 2; api.save(); fin(); });
          });
        });
      }
    }
  };

  // ----- challenges -----
  var NEED = { tc1:"A", tc2:"B", tc3:"C" };
  function chal(id){
    var pz = NEED[id]; if (!pz) return { ok:false };
    if (S.mode === "free" || S.pz !== pz) return { ok:false, msg:"Choose Puzzle " + pz + " first (in Puzzle or Diagram mode)." };
    var R = evalCur(), c = R.st, typed = one(S.typed[pz]);
    if (!R.rows.length) return { ok:false, msg:"Include the cards you need." };
    if (id === "tc1" && c[1].inc && !c[1].rev) return { ok:false, msg:"CO is on the wrong side. Reverse card 2." };
    if (id === "tc2") {
      if (c[2].inc && !c[2].rev) return { ok:false, msg:"CH₄ must be a product: reverse card 3." };
      if (c[1].inc && !c[1].rev && c[1].k === 1 && c[0].inc && !c[0].rev && c[0].k === 1) return { ok:false, msg:"Left over: H₂O(l) and O₂. The target needs 2H₂, so double card 2. Check the sum: if anything is left over that isn’t in the target, the combination isn’t finished." };
    }
    if (id === "tc3" && c[0].inc && c[1].inc && !c[0].rev && !c[1].rev) {
      if (c[0].k === 1 && c[1].k === 1) return { ok:false, msg:"Your sum makes 2NO₂ from N₂ + 2O₂ (+66.4 kJ). The target needs half of that." };
      if (c[0].k === 0.5 && c[1].k === 1) return { ok:false, msg:"Left over: NO and O₂. Halve both cards." };
    }
    if (!R.match) {
      var bits = [];
      if (R.d.left.length) bits.push("Left over: " + leftText(R.d) + ".");
      if (R.d.need.length) bits.push(needText(R.d) + ".");
      return { ok:false, msg:"The sum doesn’t match the target yet. " + bits.join(" ") };
    }
    if (typed == null) return { ok:false, msg:"The sum matches the target. Now type its " + DH + " in the box." };
    if (Math.abs(typed - R.sm.dH) <= 0.1 + 1e-9) return { ok:true };
    if (id === "tc1" && Math.abs(typed - r1(PZ.A.cards[0].dH + PZ.A.cards[1].dH)) <= 0.1) return { ok:false, msg:"Reversing flips the sign. Going backwards undoes the energy change: reverse the equation, flip the sign." };
    if (Math.abs(typed + R.sm.dH) <= 0.1) return { ok:false, msg:"Check the sign of your " + DH + ": add the adjusted values on the cards." };
    return { ok:false, msg:"The cards are right, but that " + DH + " isn’t. Add the adjusted " + DH + " values on the included cards." };
  }

  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Test Hess's law (C5 calorimeter data mode) ----------
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.v = obj(S.v); S.q = obj(S.q); S.ops = obj(S.ops); S.src = obj(S.src);
  if (["0.1", "1", "10", "50"].indexOf(S.pct) < 0) S.pct = "";
  var msgs = {}, mem = {};
  function qs(id){ var x = S.q[id] = obj(S.q[id]); x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  var cW = D["const"].cWater, accepted = hf("MgO(s)");
  var EQ = s2.eqs.map(function(e){ return { id:e.id, name:e.name, lab:e.lab, card:mkCard(e.eq, e.table ? hf(e.table) : e.dH) }; });
  EQ.forEach(function(e){ if (S.ops[e.id] !== "r") S.ops[e.id] = "f"; });
  var TG = parse(s2.target);

  host.innerHTML =
    '<section class="hs-st"><h3>' + s1.title + "</h3><p>" + s1.intro + "</p>" +
    MV.tableHTML({ caption:"Calorimetry data (made up for the module)", head:["Run", "Reaction", "Sample", "Solution", "Δ<i>T</i>"],
      rows:C.runs.map(function(r, i){ return [String(i + 1), eqH(parse(r.eq)), r.sample, r.soln, "+" + fx(r.dT, 1) + " °C"]; }) }) +
    '<p class="tiny muted">Model data: the runs are made up for this module.</p>' + MV.usesHTML(" <i>c</i> = " + cW.toFixed(2) + " J/(g·°C); the solution behaves like water.") +
    '<div class="hs-q" data-q="r1"></div><div class="hs-q" data-q="r2"></div></section>' +
    '<section class="hs-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="hs-ops"></div>' +
    '<details class="alg hs-data"><summary>Check it with data</summary><div class="hs-p3sum"></div></details><div class="hs-q" data-q="s2"></div></section>' +
    '<section class="hs-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><dl class="read hs-s3read"></dl><div class="hs-pct"></div>' +
    '<div class="hs-srcw"><p class="rg-lab">Choose the two most likely error sources:</p><div class="hs-src" role="group" aria-label="Error sources"></div></div><div class="hs-q" data-q="s3"></div></section>' +
    '<div class="hs-tabs3"></div>';
  MV.chem.tablePanel($(".hs-tabs3", host), "dhf", { title:"Course data table: " + DH + "°f values" });

  // Station 2 operation rows
  var opsHost = $(".hs-ops", host);
  opsHost.innerHTML = EQ.map(function(e){ return '<div class="hs-op" data-e="' + e.id + '"><div class="hs-oph"><span class="hs-opn">' + e.name + '</span><span class="hs-opr"></span></div><p class="hs-opq"></p></div>'; }).join("");
  var RGo = {};
  EQ.forEach(function(e){
    RGo[e.id] = radios($('.hs-op[data-e="' + e.id + '"] .hs-opr', opsHost), { aria:"How to use " + MV.plain(e.name), options:[{ id:"f", t:"As written" }, { id:"r", t:"Reversed" }], value:S.ops[e.id],
      onChange:function(v){ S.ops[e.id] = v; msgs.s2 = null; api.save(); paintS2(); } });
  });
  function adjE(e){ return adjust(e.card, { rev:S.ops[e.id] === "r", k:1 }); }
  function s2Sum(){ var rows = EQ.map(function(e){ return { lab:e.name.replace(/^\((\d)\).*/, "($1)"), eq:adjE(e) }; }); return { rows:rows, sm:sumOf(rows.map(function(r){ return r.eq; })) }; }
  function paintS2(){
    EQ.forEach(function(e){ var a = adjE(e); $('.hs-op[data-e="' + e.id + '"] .hs-opq', opsHost).innerHTML = eqH(a) + ' <span class="hs-dh">' + e.lab + (S.ops[e.id] === "r" ? " reversed" : "") + " = " + sg(a.dH) + " kJ/mol</span>"; });
    var X = s2Sum(), m = same(X.sm.net, netOf(TG));
    $(".hs-p3sum", host).innerHTML = sumStack(X.rows, mem) + '<p class="hs-p3m">' + (m ? "<strong>✓ The sum is the target:</strong> " + eqH(TG) : "✗ Not the target yet. Left over: " + leftText(diffs(X.sm.net, netOf(TG)))) + "</p>";
    paintQ("s2");
  }

  // Station 3 controls
  var RGp = radios($(".hs-pct", host), { label:"Percent error is about", cls:"chips", aria:"Percent error band", options:s3.pct, value:S.pct, onChange:function(v){ S.pct = v; msgs.s3 = null; api.save(); paintQ("s3"); } });
  var srcHost = $(".hs-src", host);
  function paintSrc(){
    var dis = qs("s3").solved;
    MV.keepFocus(srcHost, function(){
      srcHost.innerHTML = s3.sources.map(function(o){ var on = !!S.src[o.id]; return '<button type="button" class="opt sa-opt hs-sb" role="checkbox" aria-checked="' + on + '" data-src="' + o.id + '" data-k="src' + o.id + '"' + (dis ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>"; }).join("");
    });
  }
  srcHost.addEventListener("click", function(e){ var b = e.target.closest("[data-src]"); if (!b || b.disabled) return; S.src[b.dataset.src] = !S.src[b.dataset.src]; msgs.s3 = null; api.save(); paintSrc(); paintQ("s3"); });
  function paintS3read(){
    var meas = s2.answer, pe = Math.abs(accepted - meas) / Math.abs(accepted) * 100;
    $(".hs-s3read", host).innerHTML = MV.readoutHTML([["Accepted " + DH + "°f(MgO)", sg(accepted) + " kJ/mol (course table)"], ["Your result", sg(meas) + " kJ/mol"],
      ["Difference", fx(r1(Math.abs(accepted - meas)), 1) + " kJ/mol" + (qs("s3").solved ? "; percent error ≈ " + fx(Math.round(pe * 10) / 10, 1) + "%" : "")]]);
  }

  // ----- the four checks (Station 1 runs, Station 2 value, Station 3 evaluation) -----
  var Q = {
    r1:{ item:s1.q[0], run:C.runs[0] }, r2:{ item:s1.q[1], run:C.runs[1] },
    s2:{ item:{ label:"Δ<i>H</i> for Mg(s) + ½O₂(g) → MgO(s)", hints:s2.hints, why:s2.why, display:"−595.1 kJ/mol" } },
    s3:{ item:{ hints:s3.hints, why:s3.why }, noInput:true }
  };
  function judge(id){
    var it = Q[id].item;
    if (id === "r1" || id === "r2") {
      var v = one(S.v[id]); if (v == null) return { soft:"Type a number first." };
      var run = Q[id].run, q = run.m * cW * run.dT, ans = MV.ans(it);
      if (Math.abs(v - ans) <= it.tol + 1e-9) return { ok:true };
      if (Math.abs(v + ans) <= it.tol + 1e-9) return { fb:s1.fbSign };
      if (Math.abs(Math.abs(v) - q) <= 1) return { fb:s1.fbJ };
      if (Math.abs(Math.abs(v) - q / 1000) <= 0.01) return { fb:s1.fbKJ };
      return { fb:s1.fbOther };
    }
    if (id === "s2") {
      var w = one(S.v.s2); if (w == null) return { soft:"Type a number first." };
      if (!same(s2Sum().sm.net, netOf(TG))) {
        if (S.ops.e2 !== "r") return { fb:s2.fbE2 };
        if (S.ops.e1 === "r") return { fb:s2.fbE1 };
        return { fb:s2.fbE3 };
      }
      if (Math.abs(w - MV.ans(s2)) <= s2.tol + 1e-9) return { ok:true };
      var raw = r1(EQ.reduce(function(a, e){ return a + e.card.dH; }, 0));
      if (Math.abs(w - raw) <= 0.1) return { fb:s2.fbAll };
      return { fb:s2.fbVal };
    }
    if (!S.pct) return { soft:"Choose a percent error band first." };
    if (S.pct !== s3.pctAns) return { fb:s3.pctFb };
    var bad = s3.sources.filter(function(o){ return S.src[o.id] && !o.good; })[0];
    if (bad) return { fb:bad.why };
    var n = s3.sources.filter(function(o){ return S.src[o.id]; }).length;
    if (n < 2) return { soft:"Choose two error sources." };
    return { ok:true };
  }
  function qHTML(id){
    var it = Q[id].item, x = qs(id), dis = x.solved ? " disabled" : "", h = "";
    if (!Q[id].noInput) h += '<div class="numrow"><label for="hs-' + id + '">' + it.label + ':</label><input class="numin" id="hs-' + id + '" data-qin="' + id + '" data-k="qin' + id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(S.v[id] || "") + '"' + dis + "><span>kJ/mol</span></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + id + 'chk">Check</button>' + MV.hintBtn(id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[id]) h += msgs[id].soft ? MV.fbHTML("", msgs[id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[id].t + " Try again.");
    return h;
  }
  function paintQ(id){ var el = $('.hs-q[data-q="' + id + '"]', host); MV.keepFocus(el, function(){ el.innerHTML = qHTML(id); }); if (id === "s3") paintS3read(); }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.qin; if (!id) return; S.v[id] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.qin) { var b = $('[data-k="' + e.target.dataset.qin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest(".hs-q"); if (!box) return;
    var id = box.dataset.q, x = qs(id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintQ(id); return; }
    if (b.dataset.act === "check") {
      var r = judge(id);
      if (r.soft) { msgs[id] = { t:r.soft, soft:true }; paintQ(id); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[id] = null; } else { x.tries++; msgs[id] = { t:r.fb }; }
      api.save(); paintQ(id); if (id === "s3") { paintSrc(); RGp.lock(x.solved); }
      MV.focusFb(box);
    }
  });
  ["r1", "r2"].forEach(paintQ); paintS2(); paintSrc(); paintQ("s3");
  if (qs("s3").solved) RGp.lock(true);
}

// ---------- Performance task: Three roads to lime ----------
var task = (function(){
  var S = null, api = null, T = null, CARDS = [], TG = null, RG = {}, mem = {};
  var DIRS = [{ id:"off", t:"Off" }, { id:"f", t:"Forward" }, { id:"r", t:"Reversed" }];
  function read(){ var set = {}; CARDS.forEach(function(c){ set[c.id] = ["f", "r"].indexOf(S.set[c.id]) >= 0 ? S.set[c.id] : "off"; }); return { set:set, typed:String(S.typed || "") }; }
  function rowsOf(d){ var rows = []; CARDS.forEach(function(c){ var v = d.set[c.id]; if (v !== "off") rows.push({ lab:c.id + (v === "r" ? " rev." : ""), eq:adjust(c.card, { rev:v === "r", k:1 }) }); }); return rows; }
  function evalD(d){ var rows = rowsOf(d); return { rows:rows, sm:sumOf(rows.map(function(r){ return r.eq; })) }; }
  function sideIs(net, sign, want){
    var got = {}; Object.keys(net).forEach(function(s){ if (net[s] * sign > 0) got[s] = Math.abs(net[s]); });
    return same(got, want);
  }
  function paint(){
    var pv = $("#hs-tpv"); if (!pv) return;
    var d = read(), X = evalD(d), ne = netEq(X.sm);
    $("#hs-tsum").innerHTML = X.rows.length ? sumStack(X.rows, mem) : '<p class="muted">No cards on yet.</p>';
    $("#hs-tnet").innerHTML = X.rows.length ? "Your cards add up to: " + (ne.r.length || ne.p.length ? eqH(ne) : "nothing (everything cancels)") : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = a.content; S.set = obj(S.set);
      TG = parse(T.target);
      CARDS = T.tray.map(function(c){ return { id:c.id, card:mkCard(c.eq), note:c.note }; });
      inp.innerHTML = '<p class="hs-tl2"><strong>Target:</strong> ' + eqH(TG) + "</p>" + CARDS.map(function(c){
        return '<div class="hs-trow"><div class="hs-trh"><span class="hs-tlet">' + c.id + "</span> " + eqH(c.card) + ' <span class="hs-dh">' + sg(c.card.dH) + " kJ</span>" + (c.note ? ' <span class="tiny muted">(' + c.note + ")</span>" : "") + '</div><div class="hs-trr" data-t="' + c.id + '"></div></div>';
      }).join("") + '<div class="numrow hs-ttyped"><label for="hs-ttin">Your ' + DH + ' for the target:</label><input class="numin" id="hs-ttin" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(S.typed || "") + '"><span>kJ</span></div>';
      pv.innerHTML = '<h4 class="hs-h4">Your sum</h4><div id="hs-tpv"><div id="hs-tsum"></div><p class="hs-tnet" id="hs-tnet" aria-live="polite"></p></div>';
      CARDS.forEach(function(c){
        RG[c.id] = radios($('.hs-trr[data-t="' + c.id + '"]', inp), { aria:"Card " + c.id, options:DIRS, value:read().set[c.id], onChange:function(v){ S.set[c.id] = v; api.save(); paint(); api.update(); } });
      });
      $("#hs-ttin").addEventListener("input", function(e){ S.typed = e.target.value; api.save(); api.update(); });
      paint();
    },
    read:read,
    valid:function(d){
      if (!CARDS.some(function(c){ return d.set[c.id] !== "off"; })) return "Turn on at least one card.";
      if (one(d.typed) == null) return "Type the " + DH + " for your cards (in kJ).";
      return true;
    },
    checks:function(d){
      var X = evalD(d), v = one(d.typed);
      var react = {}, prod = {}; TG.r.forEach(function(t){ react[t.s] = t.n; }); TG.p.forEach(function(t){ prod[t.s] = t.n; });
      return [X.rows.length > 0 && sideIs(X.sm.net, -1, react), X.rows.length > 0 && sideIs(X.sm.net, 1, prod), v != null && X.rows.length > 0 && Math.abs(v - X.sm.dH) <= 0.1 + 1e-9];
    },
    key:function(d){ return CARDS.filter(function(c){ return d.set[c.id] !== "off"; }).map(function(c){ return c.id + (d.set[c.id] === "r" ? "r" : ""); }).join(","); },
    label:function(k){ return k.split(",").map(function(x){ return x.charAt(0) + (x.charAt(1) === "r" ? " reversed" : ""); }).join(" + "); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task
});
})();
