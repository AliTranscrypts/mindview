// SCH4U 38 Acids and Bases: hero (HF hands H⁺ to water; conjugate-pair brackets; a two-way handoff), Proton transfer
// animator (Explore: Pair up with a hopping H⁺ token and pair brackets, Particle view of 100 molecules, Which side wins?
// balance), Strength (Part 3: strong/weak × concentrated/dilute grid with particle pictures and a pH gauge, magnesium-test
// graph) and "Pick the proton transfer" (task). Every Ka comes from MV.chem.data; percent ionization and pH are computed here.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, CH = MV.chem, F = CH.f, D = CH.data, MI = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function P(fm){ return MV.plain(F(fm)); }
function LIN(t){ return t; }
function rng(seed){ var a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
var KA = "<i>K</i><sub>a</sub>";

// @component radioGroup (from MHF4U 25, via SCH4U 01–17) — segmented control or chip row as a real radio group (arrow keys,
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
function tx(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + s + "</text>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(Math.max(0.3, r)) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function brk(x1, x2, y, up, o){ o = o || {}; return '<path d="M' + r1(x1) + " " + r1(y - up) + " V" + r1(y) + " H" + r1(x2) + " V" + r1(y - up) + '" fill="none" stroke="' + (o.c || "var(--ink-2)") + '" stroke-width="1.6" stroke-linejoin="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }

// ---------- acid–base model ----------
// conjugate pairs, acid → conjugate base (ASCII keys for MV.chem.f; the same strings as MV.chem.data.Ka)
var CB = { "HCl":"Cl-", "HNO3":"NO3-", "CH3COOH":"CH3COO-", "HCOOH":"HCOO-", "HF":"F-", "NH4+":"NH3", "H2O":"OH-", "HCO3-":"CO3^2-", "H3O+":"H2O", "H2CO3":"HCO3-" };
var CA = {}; Object.keys(CB).forEach(function(a){ CA[CB[a]] = a; });   // base → conjugate acid
var ACIDS = ["HCl", "HNO3", "CH3COOH", "HCOOH", "HF", "NH4+", "H2O", "HCO3-"];
var BASES = ["H2O", "NH3", "OH-", "CH3COO-", "HCOO-", "F-", "HCO3-", "CO3^2-"];
var STRONG = { HCl:1, HNO3:1 };
function kaOf(fm){ var r = D.Ka.filter(function(x){ return x[1] === fm; })[0]; return r ? r[2] : null; }
// Order on a log Ka scale. Strong acids sit above H₃O⁺ (the strongest acid that can exist in water) and water below every
// table acid. These three are not course-table values: they only order the acids, and the readouts describe them in words.
function rank(fm){ if (STRONG[fm]) return 6; if (fm === "H3O+") return 0; if (fm === "H2O") return -16; var k = kaOf(fm); return k ? Math.log10(k) : null; }
function kaWords(fm){
  if (STRONG[fm]) return "strong: ionizes completely";
  if (fm === "H3O+") return "the strongest acid that can exist in water";
  if (fm === "H2O") return "a very weak acid, weaker than every acid in the table";
  return KA + " " + CH.sci(kaOf(fm));
}
function rx(acid, base){
  if (!acid || !base) return { ok:false, acid:acid, base:base };
  var cb = CB[acid], ca = CA[base], same = cb === base, la = rank(acid), lr = rank(ca);
  return { ok:true, acid:acid, base:base, cb:cb, ca:ca, same:same, side:same ? 0 : la > lr ? 1 : la < lr ? -1 : 0, d:same ? 0 : la - lr, strong:!!STRONG[acid] };
}
function spCls(fm){ return fm === "H3O+" ? "ab-c-h3o" : fm === "OH-" ? "ab-c-oh" : /-$/.test(fm) ? "ab-c-an" : ""; }
function arrow(r){ return r.strong ? "→" : "⇌"; }
function eqText(r){ return F(r.acid) + " + " + F(r.base) + " " + arrow(r) + " " + F(r.cb) + " + " + F(r.ca); }
function pairsText(r){ return F(r.acid) + "/" + F(r.cb) + " · " + F(r.ca) + "/" + F(r.base); }
function strongerText(r){
  var a = F(r.acid) + " (" + kaWords(r.acid) + ")", b = F(r.ca) + " (" + kaWords(r.ca) + ")";
  if (r.same) return "the same acid on both sides";
  return r.side > 0 ? "<strong>" + a + "</strong> is stronger than " + b : "<strong>" + b + "</strong> is stronger than " + a;
}
function favText(r){
  if (r.same) return "Neither: the same conjugate pair is on both sides";
  return r.side > 0 ? "<strong>Products</strong>: the weaker acid (" + F(r.ca) + ") is on the right" : "<strong>Reactants</strong>: the weaker acid (" + F(r.acid) + ") is on the left";
}
function waterText(r){
  if (r.acid === "H2O" && r.base === "H2O") return "Water acts as both: one molecule donates H⁺, the other accepts it";
  if (r.acid === "H2O") return "Water acts as an acid (donates H⁺)";
  if (r.base === "H2O") return "Water acts as a base (accepts H⁺)";
  return muted("water isn’t a reactant here");
}
// percent ionization in water from the course Ka (exact quadratic: x² ÷ (c − x) = Ka); strong acids 100%
function ionFrac(acid, c){ if (STRONG[acid]) return 1; var k = kaOf(acid); if (!k) return null; return (-k + Math.sqrt(k * k + 4 * k * c)) / 2 / c; }
function pctT(p){ if (p >= 99.95) return "100%"; return (p >= 10 ? CH.fx(p, 1) : String(Number(p.toPrecision(2)))) + "%"; }
function aboutT(p){ if (p >= 99.95) return "all 100 of 100"; if (p >= 0.5) return "about " + Math.round(p) + " in 100"; var k = Math.round(p * 10); return k >= 1 ? "about " + k + " in 1000" : "fewer than 1 in 1000"; }
function nTok(p){ return p >= 99.95 ? 100 : Math.round(p); }
var CONCS = [{ id:"1", c:1.0, t:"1.0 mol/L" }, { id:"0.1", c:0.10, t:"0.10 mol/L" }, { id:"0.01", c:0.010, t:"0.010 mol/L" }, { id:"0.001", c:0.0010, t:"0.0010 mol/L" }];
function concOf(id){ return CONCS.filter(function(x){ return x.id === id; })[0] || CONCS[1]; }
// which 100 tokens split first (fixed shuffle, so a higher count adds tokens to the same picture)
var ORDER = (function(){ var R = rng(38), a = [], i; for (i = 0; i < 100; i++) a.push(i); for (i = 99; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; })();

// @component particleBox — 100 acid molecules as labelled-by-legend tokens in water: intact (outlined) or split into
// H₃O⁺ (magenta) + conjugate base (teal). n may be fractional while animating. o: {x0, y0, dx, dy, r} grid geometry.
function tokensSVG(n, o){
  var full = Math.floor(n), part = n - full, h = "";
  var sp = {}; for (var k = 0; k < Math.ceil(n) && k < 100; k++) sp[ORDER[k]] = k < full ? 1 : part;
  for (var i = 0; i < 100; i++) {
    var x = o.x0 + (i % 10) * o.dx, y = o.y0 + Math.floor(i / 10) * o.dy, s = sp[i] || 0;
    if (!s) h += circ(x, y, o.r, "var(--sheet)", { s:"var(--ink-2)", sw:1.3 });
    else { var d = o.r * 0.72 * s, rr = o.r * 0.78; h += circ(x - d, y, rr, "var(--ab-h3o)") + circ(x + d, y, rr, "var(--ec-an)"); }
  }
  return h;
}
function beakerSVG(n){
  return '<path d="M14 10 V266 Q14 280 28 280 H372 Q386 280 386 266 V10" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
    tokensSVG(n, { x0:42, y0:32, dx:35.2, dy:26, r:9 });
}

// @component phMeter (from SCH4U 06) — display-only pH gauge (0–14), acidic / neutral / basic bands in the H₃O⁺ and OH⁻
// role colours, needle.
function meterSVG(v){
  var x0 = 18, x1 = 402, X = function(p){ return x0 + (x1 - x0) * p / 14; }, s = "";
  s += '<rect x="' + x0 + '" y="30" width="' + r1(X(6.5) - x0) + '" height="18" fill="var(--ab-h3o)" fill-opacity=".22"/><rect x="' + r1(X(7.5)) + '" y="30" width="' + r1(x1 - X(7.5)) + '" height="18" fill="var(--ab-oh)" fill-opacity=".22"/>';
  s += '<rect x="' + x0 + '" y="30" width="' + (x1 - x0) + '" height="18" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>';
  for (var p = 0; p <= 14; p++) s += '<line x1="' + r1(X(p)) + '" y1="48" x2="' + r1(X(p)) + '" y2="' + (p % 7 ? 53 : 57) + '" stroke="var(--ink-2)" stroke-width="1.2"/>' + (p % 7 ? "" : '<text x="' + r1(X(p)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + p + "</text>");
  s += '<text x="' + r1(X(3.2)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">acidic</text><text x="' + r1(X(10.8)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">basic</text>';
  var nx = r1(X(clamp(v, 0, 14))), ax = clamp(nx, 34, 386);
  s += '<path d="M' + nx + " 52 L" + r1(nx - 7) + " 22 L" + r1(nx + 7) + ' 22Z" fill="var(--ink)"/><text x="' + ax + '" y="12" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">pH ' + CH.fx(v, 2) + "</text>";
  return '<svg class="ab-msvg" viewBox="0 0 420 74" role="img" aria-label="pH gauge reading ' + CH.fx(v, 2) + '">' + s + "</svg>";
}

// ---------- hero: HF hands H⁺ to water, the pairs are bracketed, then the H⁺ shuttles back and forth ----------
function hero(f){
  var svg = $("#ab-hx-svg"), rep = $("#ab-hx-replay"), cap = f && f.cap;
  if (!svg) return;
  var Y = 80, st, run = 0;
  var EQ = [[60, "HF", "var(--ink)"], [105, "+", "var(--ink-2)"], [150, "H₂O", "var(--ink)"], [217, "⇌", "var(--ink-2)"], [285, "F⁻", "var(--ec-an)"], [330, "+", "var(--ink-2)"], [390, "H₃O⁺", "var(--ab-h3o)"]];
  function mol(x, lab, col){ return rect(x - 38, Y - 22, 76, 44, "var(--sheet)", { rx:22, s:col, sw:2 }) + tx(x, Y, lab, { fs:18, w:700, c:col }); }
  function draw(){
    var onW = st.t >= 0.5 ? st.to : 1 - st.to, h = "";
    // onW: 1 = the H⁺ now sits on water (HF is F⁻), 0 = back on HF
    h += mol(st.ax, onW ? "F⁻" : "HF", onW ? "var(--ec-an)" : "var(--ink)") + mol(st.wx, onW ? "H₃O⁺" : "H₂O", onW ? "var(--ab-h3o)" : "var(--ink)");
    var p0 = [st.ax + 30, Y - 30], p1 = [st.wx - 30, Y - 30], u = st.to ? st.t : 1 - st.t;
    var px = lerp(p0[0], p1[0], u), py = lerp(p0[1], p1[1], u) - 34 * Math.sin(Math.PI * u);
    h += circ(px, py, 14, "var(--ab-h3o)") + tx(px, py + 0.5, "H⁺", { fs:13, w:700, c:"var(--sheet)" });
    if (st.b > 0) {
      EQ.forEach(function(e){ h += tx(e[0], 196, e[1], { fs:18, w:700, c:e[2], op:st.b }); });
      h += brk(60, 285, 224, 10, { op:st.b }) + tx(105, 238, "conjugate pair", { fs:12, c:"var(--ink-2)", op:st.b });
      h += brk(150, 390, 254, 10, { op:st.b, d:"5 3" }) + tx(337, 268, "conjugate pair", { fs:12, c:"var(--ink-2)", op:st.b });
    }
    svg.innerHTML = h;
  }
  function say(t){ if (cap) cap.innerHTML = t; }
  function final(){ st = { ax:150, wx:330, t:1, to:0, b:1 }; draw(); say("<strong>Weak acid: a two-way handoff.</strong> The H⁺ shuttles between HF and water, and most HF stays intact. HF/F⁻ and H₂O/H₃O⁺ are the conjugate pairs."); rep.hidden = false; }
  function hop(id, to, dur, cb){ st.to = to; st.t = 0; MV.tween({ dur:dur, step:function(t){ if (id !== run) return; st.t = t; draw(); }, done:function(){ if (id === run) cb(); } }); }
  function play(){
    var id = ++run; rep.hidden = true; st = { ax:60, wx:420, t:1, to:0, b:0 }; draw();
    say("An HF molecule meets a water molecule…");
    MV.tween({ dur:1100, step:function(t){ if (id !== run) return; st.ax = lerp(60, 150, t); st.wx = lerp(420, 330, t); draw(); }, done:function(){
      if (id !== run) return;
      hop(id, 1, 800, function(){
        say("HF gives H⁺ to water: HF becomes F⁻ and H₂O becomes H₃O⁺.");
        MV.wait(700, function(){
          if (id !== run) return;
          MV.tween({ dur:700, step:function(t){ if (id !== run) return; st.b = t; draw(); }, done:function(){
            if (id !== run) return; say("Each conjugate pair differs by exactly one H⁺.");
            var n = 0;
            (function swing(){
              if (id !== run) return;
              if (n >= 3) { final(); return; }
              hop(id, n % 2 ? 1 : 0, 650, function(){ n++; if (n === 1) say("Weak acid: a two-way handoff…"); MV.wait(350, swing); });
            })();
          } });
        });
      });
    } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Proton transfer animator ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (["pair", "particle", "wins"].indexOf(S.mode) < 0) S.mode = "pair";
  if (ACIDS.indexOf(S.acid) < 0) S.acid = "HF";
  if (BASES.indexOf(S.base) < 0) S.base = "";
  if (!CONCS.some(function(c){ return c.id === S.conc; })) S.conc = "0.1";
  if (!C.reasons.some(function(r){ return r.id === S.reason; })) S.reason = "";
  var tw = null, locked = false, pre = false, hopT = -1, splitN = null, tilt = null, moved = "";

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="ab-modes"></div>' +
    '<div class="ab-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ab-eqw"><div class="ab-eq"></div><svg class="ab-brk" aria-hidden="true" height="52"></svg><span class="ab-tok" aria-hidden="true" hidden>H⁺</span></div>' +
    '<div class="ab-pane" data-pane="particle"><div class="ab-box"><svg class="ab-svg ab-part" viewBox="0 0 400 290" role="img" aria-label=""></svg></div><p class="ab-legend"></p></div>' +
    '<div class="ab-pane" data-pane="wins"><div class="ab-box"><svg class="ab-svg ab-bal" viewBox="0 0 520 214" role="img" aria-label=""></svg></div></div>' +
    '<div class="ab-caprow"><p class="ab-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" data-k="abreplay" id="ab-replay">Replay</button></div></div>' +
    '<div class="ab-grid"><div class="ab-ctrl"><div class="ab-acid"></div><div class="ab-base" data-for="pair wins"></div><div class="ab-conc" data-for="particle"></div>' +
    '<div class="ab-reason" data-for="wins"></div><p class="tiny muted">' + C.note + "</p></div>" +
    '<div class="ab-right"><dl class="read ab-read" aria-live="polite"></dl><div class="ab-tab"></div></div></div>';
  var eqBox = $(".ab-eq", host), eqw = $(".ab-eqw", host), brkSvg = $(".ab-brk", host), tok = $(".ab-tok", host);
  var partSvg = $(".ab-part", host), balSvg = $(".ab-bal", host), capEl = $(".ab-cap", host), rep = $("#ab-replay");
  CH.tablePanel($(".ab-tab", host), "acid", { title:"Course data table: acid and base constants" });

  var RG = {};
  function partOff(id){ return S.mode === "particle" && (id === "H2O" || id === "HCO3-") ? "not in particle view" : ""; }
  RG.mode = radios($(".ab-modes", host), { label:"Mode", aria:"Animator mode", options:C.modes, value:S.mode, onChange:function(v){
    S.mode = v; if (partOff(S.acid)) { S.acid = "CH3COOH"; RG.acid.set(S.acid); } RG.acid.paint(); api.save(); go(); } });
  RG.acid = radios($(".ab-acid", host), { label:"Acid", aria:"Acid", cls:"chips", options:ACIDS.map(function(a){ return { id:a, t:F(a) }; }), value:S.acid, disabled:partOff, onChange:function(v){ S.acid = v; api.save(); go(); } });
  RG.base = radios($(".ab-base", host), { label:"Base", aria:"Base", cls:"chips", options:BASES.map(function(b){ return { id:b, t:F(b) }; }), value:S.base, onChange:function(v){ S.base = v; api.save(); go(); } });
  RG.conc = radios($(".ab-conc", host), { label:"Concentration", aria:"Concentration", cls:"chips", options:CONCS, value:S.conc, onChange:function(v){ S.conc = v; api.save(); go(); } });
  RG.reason = radios($(".ab-reason", host), { label:C.reasonQ, aria:C.reasonQ, cls:"chips ab-rlist", options:C.reasons, value:S.reason, onChange:function(v){ S.reason = v; api.save(); paintRead(); api.changed(); } });
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); rep.disabled = b; }

  function cur(){ return rx(S.acid, S.mode === "particle" ? "H2O" : S.base); }
  function pct(){ var fr = ionFrac(S.acid, concOf(S.conc).c); return fr == null ? null : fr * 100; }

  // ----- equation with roles, pair badges, brackets and the H⁺ token -----
  function paintEq(){
    var r = cur(), hideP = pre && S.mode === "pair" || hopT >= 0;
    if (!r.ok) {
      eqBox.innerHTML = '<span class="ab-side"><span class="ab-sp"><span class="ab-role">acid</span><span class="ab-f ' + spCls(r.acid) + '">' + F(r.acid) + '</span><span class="ab-pr">&nbsp;</span></span><span class="ab-op">+</span><span class="ab-sp"><span class="ab-role">base</span><span class="ab-f">?</span><span class="ab-pr">&nbsp;</span></span></span>';
      drawBrk(null); return;
    }
    var sp = [r.acid, r.base, r.cb, r.ca], role = ["acid", "base", "conjugate base", "conjugate acid"], pr = [1, 2, 1, 2];
    function card(i){
      var hid = hideP && i >= 2;
      return '<span class="ab-sp" data-pos="' + i + '"><span class="ab-role">' + (hid ? "&nbsp;" : role[i]) + '</span><span class="ab-f ' + (hid ? "ab-q" : spCls(sp[i])) + '">' + (hid ? "?" : F(sp[i])) + '</span><span class="ab-pr ab-pr' + pr[i] + '">' + (hideP ? "&nbsp;" : "pair " + pr[i]) + "</span></span>";
    }
    eqBox.innerHTML = '<span class="ab-side">' + card(0) + '<span class="ab-op">+</span>' + card(1) + '</span><span class="ab-arr">' + arrow(r) + '</span><span class="ab-side">' + card(2) + '<span class="ab-op">+</span>' + card(3) + "</span>";
    eqBox.setAttribute("aria-label", hideP ? MV.plain(F(r.acid) + " + " + F(r.base)) + ": products hidden until the reveal" : MV.plain(eqText(r)));
    drawBrk(hideP ? null : r);
  }
  function fRects(){ var w = eqw.getBoundingClientRect(); return Array.prototype.map.call($$(".ab-f", eqBox), function(el){ var b = el.getBoundingClientRect(); return { x:b.left - w.left + b.width / 2, top:b.top - w.top, bottom:b.bottom - w.top }; }); }
  function drawBrk(r){
    var f = r ? fRects() : [];
    if (!r || f.length < 4 || Math.abs(f[0].top - f[2].top) > 6 || Math.abs(f[1].top - f[3].top) > 6) { brkSvg.innerHTML = ""; brkSvg.style.display = "none"; return; }
    var W = Math.max(50, eqw.getBoundingClientRect().width);
    brkSvg.style.display = ""; brkSvg.setAttribute("viewBox", "0 0 " + r1(W) + " 52");
    brkSvg.innerHTML = brk(f[0].x, f[2].x, 12, 9) + tx((f[0].x + f[1].x) / 2, 24, "pair 1", { fs:12, c:"var(--ink-2)" }) +
      brk(f[1].x, f[3].x, 36, 9, { d:"5 3" }) + tx((f[2].x + f[3].x) / 2, 47, "pair 2", { fs:12, c:"var(--ink-2)" });
  }
  function placeTok(u){
    var f = fRects();
    if (u < 0 || f.length < 2) { tok.hidden = true; return; }
    var x = lerp(f[0].x, f[1].x, u), y = lerp(f[0].top, f[1].top, u) - 14 - 36 * Math.sin(Math.PI * u);
    tok.hidden = false; tok.style.left = r1(x) + "px"; tok.style.top = r1(y) + "px";
  }

  // ----- particle view -----
  function paintPart(){
    var r = cur(), p = pct(), cc = concOf(S.conc), n = splitN == null ? nTok(p) : splitN;
    partSvg.innerHTML = beakerSVG(pre && splitN == null ? 0 : n);
    var shownN = Math.round(pre && splitN == null ? 0 : n);
    partSvg.setAttribute("aria-label", "Particle view: " + cc.t + " " + P(r.acid) + " in water, 100 molecules shown: " + shownN + " ionized into H₃O⁺ and " + P(r.cb) + ", " + (100 - shownN) + " intact.");
    $(".ab-legend", host).innerHTML = '<span><i class="ab-dot ab-dot-int"></i>' + F(r.acid) + ' (intact)</span><span><i class="ab-dot ab-dot-h3o"></i>' + F("H3O+") + '</span><span><i class="ab-dot ab-dot-an"></i>' + F(r.cb) + "</span>";
  }
  // ----- balance (Which side wins?) -----
  function tiltFor(r){ if (!r.ok || r.same) return 0; var m = Math.min(16, 5 + Math.abs(r.d) * 1.6); return r.d > 0 ? m : -m; }
  function paintBal(){
    var r = cur(), th = tilt == null ? (pre ? 0 : tiltFor(r)) : tilt, a = th * Math.PI / 180, cx = 260, cy = 56, L = 180;
    var dx = L * Math.cos(a), dy = L * Math.sin(a), ends = [[cx - dx, cy - dy], [cx + dx, cy + dy]], h = "";
    h += '<path d="M' + cx + " " + cy + " L" + (cx - 26) + " 196 H" + (cx + 26) + ' Z" fill="var(--hi-soft)" stroke="var(--ink-2)" stroke-width="1.5"/>' + rect(cx - 70, 196, 140, 8, "var(--ink-2)", { rx:3 });
    h += ln(ends[0][0], ends[0][1], ends[1][0], ends[1][1], { w:5 }) + circ(cx, cy, 6, "var(--ink)");
    var fav = !pre && r.ok && !r.same ? (r.side > 0 ? 1 : 0) : -1;
    var labs = r.ok ? [P(r.acid) + " + " + P(r.base), P(r.cb) + " + " + P(r.ca)] : [P(r.acid) + " + ?", "?"];
    ends.forEach(function(e, i){
      var x = e[0], y = e[1];
      h += ln(x, y, x - 46, y + 40, { c:"var(--ink-2)", w:1.4 }) + ln(x, y, x + 46, y + 40, { c:"var(--ink-2)", w:1.4 });
      h += '<path d="M' + r1(x - 70) + " " + r1(y + 40) + " H" + r1(x + 70) + " Q" + r1(x + 64) + " " + r1(y + 56) + " " + r1(x + 48) + " " + r1(y + 58) + " H" + r1(x - 48) + " Q" + r1(x - 64) + " " + r1(y + 56) + " " + r1(x - 70) + " " + r1(y + 40) + 'Z" fill="' + (fav === i ? "var(--hi-soft)" : "var(--sheet)") + '" stroke="' + (fav === i ? "var(--hi)" : "var(--ink-2)") + '" stroke-width="' + (fav === i ? 2.4 : 1.5) + '"/>';
      h += tx(x, y + 74, labs[i], { fs:15, w:700 }) + tx(x, y + 92, i ? "products" : "reactants", { fs:12, c:"var(--ink-2)" });
    });
    balSvg.innerHTML = h;
    balSvg.setAttribute("aria-label", "Balance: reactants " + labs[0] + " on the left, products " + labs[1] + " on the right. " + (fav < 0 ? "The beam is level." : "It tips toward the " + (fav ? "products" : "reactants") + "."));
  }

  // ----- readouts and caption -----
  function paintRead(){
    var r = cur(), rows = [], W = muted("watch the reveal");
    if (S.mode === "particle") {
      var p = pct(), cc = concOf(S.conc), n = nTok(p);
      rows.push(["Equation", eqText(r)], ["Solution", cc.t + " " + F(r.acid) + " in water"]);
      if (pre) rows.push(["Percent ionized", W], ["In the picture", W]);
      else {
        rows.push(["Percent ionized", "<strong>" + pctT(p) + "</strong> (" + aboutT(p) + ")" + (STRONG[r.acid] ? ": a strong acid ionizes completely" : "")]);
        rows.push(["In the picture", n + " ionized · " + (100 - n) + " intact" + (p > 0 && p < 0.5 ? muted(" (fewer than 1 in 100 ionize: too few to show in 100 molecules)") : "")]);
      }
      rows.push(["Water’s role", pre ? W : waterText(r)]);
    } else if (!r.ok) {
      rows.push(["Equation", "No proton transfer possible: choose a base"]);
    } else {
      var hide = pre;
      rows.push(["Equation", hide && S.mode === "pair" ? F(r.acid) + " + " + F(r.base) + " " + arrow(r) + " " + W : eqText(r)]);
      rows.push(["Pairs", hide && S.mode === "pair" ? W : pairsText(r) + (r.same ? muted(" (the same pair)") : "")]);
      rows.push(["Stronger acid", strongerText(r)]);
      rows.push(["Favoured side", hide ? W : favText(r)]);
      rows.push(["Water’s role", hide && S.mode === "pair" ? W : waterText(r)]);
    }
    $(".ab-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var r = cur(), t = "";
    if (S.mode === "particle") {
      if (pre) t = "100 " + P(r.acid) + " molecules in water. Watch how many ionize.";
      else { var p = pct(); t = STRONG[r.acid] ? "Every molecule splits: a strong acid ionizes completely." : pctT(p) + " ionized: most molecules stay intact at equilibrium."; }
    } else if (!r.ok) t = "No proton transfer possible: choose a base.";
    else if (r.same) t = "Same conjugate pair: the H⁺ just swaps back and forth (no new proton transfer).";
    else if (hopT >= 0) t = "The H⁺ moves from " + F(r.acid) + " to " + F(r.base) + "…";
    else if (pre) t = S.mode === "wins" ? "Which way will the balance tip?" : "Watch the H⁺.";
    else {
      t = "→ H⁺ moved: " + F(r.acid) + " gave H⁺ to " + F(r.base) + ".";
      if (S.mode === "wins") t += " The balance tips toward the <strong>" + (r.side > 0 ? "products" : "reactants") + "</strong>: the weaker acid (" + F(r.side > 0 ? r.ca : r.acid) + ") is on that side.";
    }
    capEl.innerHTML = t + (moved ? " " + moved : "");
  }
  function paint(){
    var m = S.mode;
    $$(".ab-pane", host).forEach(function(p){ p.hidden = p.dataset.pane !== m; });
    $$(".ab-ctrl [data-for]", host).forEach(function(p){ p.hidden = p.dataset.for.split(" ").indexOf(m) < 0; });
    paintEq();
    if (m === "particle") paintPart(); else if (m === "wins") paintBal();
    placeTok(hopT);
    paintRead(); paintCap();
    api.changed();
  }
  window.addEventListener("resize", function(){ paintEq(); placeTok(hopT); });

  // ----- animations -----
  function cancel(){ if (tw) { tw(); tw = null; } hopT = -1; splitN = null; tilt = null; moved = ""; }
  function hop(cb){
    var r = cur();
    if (!r.ok || r.same) { hopT = -1; paint(); if (cb) cb(); return; }
    hopT = 0; paint();
    tw = MV.tween({ dur:900, step:function(t){ hopT = t; placeTok(t); }, done:function(){ tw = null; hopT = -1; pre = false; paint(); if (cb) cb(); } });
  }
  function tip(cb){
    var to = tiltFor(cur()); tilt = 0; paint();
    tw = MV.tween({ dur:900, step:function(t){ tilt = to * t; paintBal(); }, done:function(){ tw = null; tilt = null; pre = false; paint(); if (cb) cb(); } });
  }
  function split(cb){
    var n = nTok(pct()); splitN = 0; paint();
    tw = MV.tween({ dur:n > 40 ? 1600 : 1100, ease:LIN, step:function(t){ splitN = n * t; paintPart(); }, done:function(){ tw = null; splitN = null; pre = false; paint(); if (cb) cb(); } });
  }
  function go(){
    cancel(); pre = false;
    if (S.mode === "particle") split();
    else if (S.mode === "wins") { var r = cur(); if (r.ok && !r.same) { pre = true; hop(function(){ pre = true; tip(); }); } else paint(); }
    else hop();
  }
  rep.addEventListener("click", function(){ if (!locked) go(); });

  // ----- predictions -----
  var hooks = {
    start:function(p){
      cancel(); pre = true;
      if (p.id === "p1") { S.mode = "pair"; S.acid = "HCl"; S.base = "H2O"; }
      else if (p.id === "p2") { S.mode = "pair"; S.acid = "H2O"; S.base = "NH3"; }
      else if (p.id === "p3") { S.mode = "particle"; S.acid = "CH3COOH"; S.conc = "0.1"; }
      else { S.mode = "wins"; S.acid = "HF"; S.base = "CH3COO-"; }
      RG.mode.set(S.mode); RG.acid.set(S.acid); RG.base.set(S.base); RG.conc.set(S.conc); RG.acid.paint();
      api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(){ pre = false; lock(false); paint(); MV.wait(150, done); }
      if (p.id === "p3") split(fin);
      else if (p.id === "p4") tip(fin);
      else hop(fin);
    }
  };

  // ----- challenges -----
  var TA = ["CH3COOH", "HCOOH", "HF", "NH4+"], TB = ["CH3COO-", "HCOO-", "F-", "NH3"];
  function chal(id){
    var a = S.acid, b = S.base;
    if (id === "tc1") {
      if (S.mode === "particle") return { ok:false, msg:"In the particle view the base is always water. Switch to Pair up and choose the base yourself." };
      if (a === "HCO3-" && b === "CO3^2-") return { ok:false, msg:"Two forms of the same pair; no new proton transfer." };
      if (a === "HCO3-" && b === "HCO3-") return { ok:false, msg:"Here one HCO₃⁻ gives H⁺ away and the other accepts it. Choose a different acid, so HCO₃⁻ only accepts H⁺." };
      if (a === "HCO3-") return { ok:false, msg:"Here HCO₃⁻ gives away H⁺ to make CO₃²⁻: that’s acting as an acid." };
      if (b !== "HCO3-") return { ok:false, msg:"Choose HCO₃⁻ as the base: a base accepts H⁺." };
      if (a === "H2O") return { ok:false, msg:"Water is a very weak acid: it barely gives HCO₃⁻ a proton. Choose a stronger acid." };
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.mode !== "particle") return { ok:false, msg:"Switch to Particle view first." };
      if (STRONG[a]) return { ok:false, msg:"That’s a strong acid; the challenge is about ethanoic acid." };
      if (a !== "CH3COOH") return { ok:false, msg:"The challenge is about ethanoic acid, CH₃COOH." };
      if (S.conc === "1") return { ok:false, msg:"Only 0.42%: concentrating a weak acid lowers its percent ionization." };
      if (S.conc !== "0.001") return { ok:false, msg:"Only " + pctT(pct()) + " ionized: not more than 10% yet. Try another concentration." };
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.mode !== "wins") return { ok:false, msg:"Switch to Which side wins? mode first." };
      if (TA.indexOf(a) < 0 || TB.indexOf(b) < 0) return { ok:false, msg:"Use the table acids (CH₃COOH, HCOOH, HF, NH₄⁺) and their conjugate bases (CH₃COO⁻, HCOO⁻, F⁻, NH₃)." };
      var r = rx(a, b);
      if (r.same) return { ok:false, msg:"Two forms of the same pair; no new proton transfer." };
      if (a === "HF" && b === "CH3COO-") return { ok:false, msg:"HF is the stronger acid, so products are favoured." };
      if (a === "CH3COOH" && b === "NH3") return { ok:false, msg:"NH₃ is a strong enough base to win: products favoured." };
      if (r.side > 0) return { ok:false, msg:"Products are favoured here: " + P(a) + " is stronger than " + P(r.ca) + ", the acid it makes." };
      if (!S.reason) return { ok:false, msg:"Reactants are favoured. Now pick the reason." };
      if (S.reason !== "weaker") return { ok:false, msg:"Reactants are favoured, but that reason doesn’t fit. Compare the acid on the left with the acid it would make." };
      return { ok:true };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Strong vs weak, concentrated vs dilute ----------
function part3(host, api){
  var S = api.S, C = api.content, G = C.grid, Mg = C.mg;
  var CELLS = [{ id:"sc", acid:"HCl", c:1.0, ct:"1.0 mol/L", s:"strong", k:"concentrated" }, { id:"sd", acid:"HCl", c:0.0010, ct:"0.0010 mol/L", s:"strong", k:"dilute" },
    { id:"wc", acid:"CH3COOH", c:1.0, ct:"1.0 mol/L", s:"weak", k:"concentrated" }, { id:"wd", acid:"CH3COOH", c:0.0010, ct:"0.0010 mol/L", s:"weak", k:"dilute" }];
  CELLS.forEach(function(x){ var fr = ionFrac(x.acid, x.c); x.p = fr * 100; x.h = fr * x.c; x.ph = -Math.log10(x.h); if (Math.abs(x.ph) < 1e-9) x.ph = 0; });
  if (!CELLS.some(function(x){ return x.id === S.cell; })) S.cell = "";
  if (typeof S.mg !== "number") S.mg = -1;
  function cellOf(id){ return CELLS.filter(function(x){ return x.id === id; })[0]; }

  host.innerHTML = '<div class="part"><h3>' + G.title + "</h3><p>" + G.intro + "</p>" +
    '<div class="ab-ghead" aria-hidden="true"><span></span><span>' + G.cols[0] + "</span><span>" + G.cols[1] + "</span></div>" +
    '<div class="ab-gridw"><div class="ab-grow" aria-hidden="true">' + G.rows[0] + '</div><div class="ab-cells" data-row="0"></div><div class="ab-grow" aria-hidden="true">' + G.rows[1] + '</div><div class="ab-cells" data-row="1"></div></div>' +
    '<div class="ab-data" aria-live="polite"></div><p class="tiny muted">' + G.note + "</p></div>" +
    '<div class="part"><h3>' + Mg.title + "</h3><p>" + Mg.intro + '</p><canvas class="plot wide ab-mgc" role="img" aria-label=""></canvas>' +
    '<p class="ab-mgleg"><span><i class="ab-sw ab-sw-hcl"></i>0.10 mol/L HCl</span><span><i class="ab-sw ab-sw-ac"></i>0.10 mol/L CH₃COOH</span><button type="button" class="btn ghost sm" data-k="abmgrun" id="ab-mgrun">Run the test again</button></p>' +
    '<p class="tiny muted">' + Mg.note + '</p><p class="ab-ask">' + Mg.ask + '</p><div class="ab-mgchips" role="group" aria-label="Explanations"></div><div class="ab-mgfb"></div></div>';

  function cellHTML(x){
    var on = S.cell === x.id, n = nTok(x.p);
    return '<button type="button" class="ab-cell' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-cell="' + x.id + '" data-k="abc' + x.id + '">' +
      '<span class="ab-ct">' + x.ct + " " + F(x.acid) + '</span><span class="ab-ctag">' + x.s + " · " + x.k + "</span>" +
      '<svg class="ab-csvg" viewBox="0 0 220 150" role="img" aria-label="' + esc(n + " of 100 molecules ionized") + '">' + tokensSVG(n, { x0:20, y0:12, dx:20, dy:14, r:5.6 }) + "</svg>" +
      '<span class="ab-cdat"><span>pH <strong>' + CH.fx(x.ph, 2) + "</strong></span><span>conductivity: " + G.cond[x.id] + "</span><span>" + pctT(x.p) + " ionized" + (x.p < 0.5 ? " (fewer than 1 in 100)" : "") + "</span></span></button>";
  }
  function paintGrid(){
    $$(".ab-cells", host).forEach(function(row){ var i = +row.dataset.row; MV.keepFocus(row, function(){ row.innerHTML = cellHTML(CELLS[i * 2]) + cellHTML(CELLS[i * 2 + 1]); }); });
    var x = cellOf(S.cell), box = $(".ab-data", host);
    if (!x) { box.innerHTML = '<p class="muted ab-dhint">' + G.dataTitle + ": tap a card.</p>"; return; }
    var how;
    if (x.s === "strong") how = "<p>HCl is a strong acid: it ionizes completely, so [H₃O⁺] = " + x.ct + ".</p><p>pH = " + MI + "log(" + CH.sci(x.h).replace(/ × 10<sup>0<\/sup>/, "") + ") = <strong>" + CH.fx(x.ph, 2) + "</strong></p>";
    else how = "<p>CH₃COOH is a weak acid (" + KA + " = " + CH.sci(kaOf("CH3COOH")) + "). At equilibrium [H₃O⁺] = <i>x</i>, where <i>x</i>² ÷ (" + x.ct.replace(" mol/L", "") + " " + MI + " <i>x</i>) = " + CH.sci(kaOf("CH3COOH")) + ", so <i>x</i> = " + CH.sci(x.h) + " mol/L.</p>" +
      "<p>pH = " + MI + "log(" + CH.sci(x.h) + ") = <strong>" + CH.fx(x.ph, 2) + "</strong></p><p>Percent ionized = " + CH.sci(x.h) + " ÷ " + x.ct.replace(" mol/L", "") + " × 100% = <strong>" + pctT(x.p) + "</strong></p>";
    box.innerHTML = '<h4 class="ab-h4">' + G.dataTitle + ": " + x.ct + " " + F(x.acid) + " (" + x.s + ", " + x.k + ")</h4>" + meterSVG(x.ph) + how;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-cell]"); if (b) { S.cell = b.dataset.cell; api.save(); paintGrid(); return; }
    var c = e.target.closest("[data-mgc]"); if (c) { S.mg = +c.dataset.mgc; api.save(); paintMg(); MV.focusFb($(".ab-mgfb", host)); }
  });
  paintGrid();

  // station 2: gas volume over time (model data: 50 mL of 0.10 mol/L acid → 0.0050 mol → about 60 mL of H₂)
  var VMAX = 60, TAU = { hcl:25, ac:110 }, tEnd = 600;
  function vol(k, t){ return VMAX * (1 - Math.exp(-t / TAU[k])); }
  function curve(k, t1){ var pts = []; for (var t = 0; t <= t1 + 1e-9; t += 5) pts.push([t, vol(k, t)]); if (pts[pts.length - 1][0] < t1) pts.push([t1, vol(k, t1)]); return pts; }
  var pl = new MV.Plot($(".ab-mgc", host), { xmin:-60, xmax:620, ymin:-8, ymax:72 });
  pl.render = function(){
    var t1 = tEnd;
    pl.draw({ view:{ xmin:-90, xmax:620, ymin:-10, ymax:72 }, xTicks:{ step:100, fmt:function(v){ return v < 0 ? "" : String(v); } }, yTicks:{ step:20, fmt:function(v){ return v < 0 ? "" : String(v); } },
      xLabel:"time (s)", yLabel:"gas (mL)",
      curves:[{ pts:curve("hcl", t1), color:MV.css("--pen"), width:2.6 }, { pts:curve("ac", t1), color:MV.css("--ec-an"), width:2.6 }],
      describe:"Hydrogen gas volume against time, model data. The HCl curve rises steeply and levels off at about 60 mL within about 100 s. The ethanoic acid curve rises much more slowly but reaches the same 60 mL by about 500 s." });
  };
  pl.render();
  var mgTw = null;
  $("#ab-mgrun").addEventListener("click", function(){
    if (mgTw) mgTw();
    mgTw = MV.tween({ dur:2600, ease:LIN, step:function(t){ tEnd = Math.max(5, 600 * t); pl.render(); }, done:function(){ mgTw = null; tEnd = 600; pl.render(); } });
  });
  function paintMg(){
    var box = $(".ab-mgchips", host);
    MV.keepFocus(box, function(){ box.innerHTML = Mg.chips.map(function(c, i){ var on = S.mg === i; return '<button type="button" class="chip ab-mgchip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-mgc="' + i + '" data-k="abmg' + i + '">' + c.t + "</button>"; }).join(""); });
    var c = Mg.chips[S.mg];
    $(".ab-mgfb", host).innerHTML = !c ? "" : MV.ok(c) ? MV.fbHTML("good", "<strong>✓ That’s it.</strong> " + c.why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + c.why + " Try another explanation.");
  }
  paintMg();
}

// ---------- Performance task: Pick the proton transfer ----------
var task = (function(){
  var S = null, api = null, T = null;
  function read(){ return { a:S && S.a || "", b:S && S.b || "" }; }
  function evalD(d){
    var real = !!(d.a && d.b) && CB[d.a] !== d.b, ka = kaOf(d.a), kc = d.b ? kaOf(CA[d.b]) : null, K = ka && kc ? ka / kc : null;
    return { real:real, ka:ka, kc:kc, K:K, fav:real && K > 1, strong:real && K >= 100 };
  }
  function kT(K){ return K >= 1000 || K < 1 ? CH.sci(K) : String(Number(K.toPrecision(2))); }
  function paint(){
    var d = read(), pv = $("#ab-tkpv"); if (!pv) return;
    if (!d.a || !d.b) { pv.innerHTML = '<p class="muted">Choose an acid and a base to see the reaction and its <i>K</i>.</p>'; return; }
    var r = rx(d.a, d.b), e = evalD(d), rows = [];
    rows.push(["Equation", eqText(r)]);
    rows.push([KA + " of the acid on the left", F(d.a) + ": " + CH.sci(e.ka)]);
    rows.push([KA + " of the acid formed", F(r.ca) + ": " + CH.sci(e.kc)]);
    if (r.same) rows.push(["Reaction <i>K</i>", muted("no real transfer: the same pair on both sides")]);
    else rows.push(["Reaction <i>K</i> = " + KA + "(acid) ÷ " + KA + "(acid formed)", "<strong>≈ " + kT(e.K) + "</strong>"]);
    rows.push(["Favoured side", favText(r)]);
    pv.innerHTML = '<dl class="read">' + MV.readoutHTML(rows) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      if (T.acids.indexOf(S.a) < 0) S.a = ""; if (T.bases.indexOf(S.b) < 0) S.b = "";
      inp.innerHTML = '<div class="ab-tq"><div class="ab-ta"></div></div><div class="ab-tq"><div class="ab-tb"></div></div>';
      radios($(".ab-ta", inp), { label:T.qA, aria:"Acid", cls:"chips", options:T.acids.map(function(x){ return { id:x, t:F(x) }; }), value:S.a, onChange:function(v){ S.a = v; api.save(); paint(); api.update(); } });
      radios($(".ab-tb", inp), { label:T.qB, aria:"Base", cls:"chips", options:T.bases.map(function(x){ return { id:x, t:F(x) }; }), value:S.b, onChange:function(v){ S.b = v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="ab-h4">Live reaction</h4><div id="ab-tkpv" aria-live="polite"></div><div class="ab-tktab"></div>';
      CH.tablePanel($(".ab-tktab", pv), "acid", { title:"Course data table: acid and base constants" });
      paint();
    },
    read:read,
    valid:function(d){ return d.a && d.b ? true : "Choose an acid and a base first."; },
    checks:function(d){ var e = evalD(d); return [e.real, !!e.fav, !!e.strong]; },
    tips:function(d, res){ if (!res[0]) return [T.tips[0]]; if (!res[1]) return [T.tips[1]]; if (!res[2]) return [T.tips[2]]; return []; },
    key:function(d){ return d.a + "|" + d.b; },
    label:function(k){ var p = k.split("|"); return F(p[0]) + " + " + F(p[1]); },
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
