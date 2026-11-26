// SCH4U 43 Weak Acid/Base Titration: hero (HCl and ethanoic acid curves drawn together, pKa and equivalence dots),
// Titration lab, weak mode (Explore: C9 with Lab / Curve / Calculate modes, probe, overlay, indicator colours, region-aware
// calculator), Find Ka (Part 3: four unlabelled curves, vinegar analysis, weak-base mirror with particle zoom),
// Tap the curve (N8), "Pick the acid and indicator" task (live curve with indicator band and jump marker).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, CD = MV.chem.data;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function esc(s){ return MV.esc(s); }
function r2(v){ return Math.round(v * 100) / 100; }
function fx(v, d){ return MV.chem.fx(v, d); }
function css(t){ return MV.css(t); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
var KA = "<i>K</i><sub>a</sub>", KB = "<i>K</i><sub>b</sub>", KWH = "<i>K</i><sub>w</sub>", PKA = "p" + KA, PKB = "p" + KB, NI = "<i>n</i>", XI = "<i>x</i>", CI = "<i>c</i>";
// scientific notation, 2 significant figures by default, with a true minus in the exponent
function sci(v, sf){
  sf = sf || 2; if (!v) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-12), m = +(v / Math.pow(10, e)).toFixed(sf - 1);
  if (Math.abs(m) >= 10) { m /= 10; e++; }
  return fx(m, sf - 1) + " × 10<sup>" + (e < 0 ? "−" + (-e) : e) + "</sup>";
}
function rtxt(r){ var s = r >= 100 ? r.toFixed(0) : r >= 1 ? r.toFixed(2) : r.toPrecision(2); return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; }

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

// ---------- C13 constants (all from MV.chem.data; plan §5: Ka = 10^(−pKa) from the pinned 2-decimal pKa values) ----------
function tabK(list, name){ var r = list.filter(function(x){ return x[0] === name; })[0]; return r ? r[2] : NaN; }
function pk(v){ return r2(-Math.log10(v)); }
var KW = CD["const"].Kw, PKW = r2(-Math.log10(KW));             // 14.00
var VA = 25.0, CA = 0.18, NA = VA * CA;                           // flask: 25.0 mL of 0.18 mol/L = 4.50 mmol (fixed, plan Explore)
var MW_ETH = 2 * CD.M.C + 4 * CD.M.H + 2 * CD.M.O;                // CH3COOH, 60.06 g/mol
// kind: wa weak acid (titrant NaOH), wb weak base (titrant HCl), sa strong acid (titrant NaOH)
// pK: pKa for an acid; for ammonia the pKb (4.74), so pKa(NH4+) = 14.00 − 4.74 = 9.26 (plan §6 risk 1; not 9.25 from the table's Ka(NH4+))
var SP = {
  ethanoic:{ id:"ethanoic", nm:"ethanoic acid", kind:"wa", acidF:"CH3COOH", baseF:"CH3COO-", Anm:"ethanoate", pK:pk(tabK(CD.Ka, "ethanoic acid")) },
  methanoic:{ id:"methanoic", nm:"methanoic acid", kind:"wa", acidF:"HCOOH", baseF:"HCOO-", Anm:"methanoate", pK:pk(tabK(CD.Ka, "methanoic acid")) },
  benzoic:{ id:"benzoic", nm:"benzoic acid", kind:"wa", acidF:"C6H5COOH", baseF:"C6H5COO-", Anm:"benzoate", pK:pk(tabK(CD.Ka, "benzoic acid")) },
  hypochlorous:{ id:"hypochlorous", nm:"hypochlorous acid", kind:"wa", acidF:"HOCl", baseF:"OCl-", Anm:"hypochlorite", pK:pk(tabK(CD.Ka, "hypochlorous acid")) },
  ammonia:{ id:"ammonia", nm:"ammonia", kind:"wb", acidF:"NH4+", baseF:"NH3", pK:pk(tabK(CD.Kb, "ammonia")) },
  hcl:{ id:"hcl", nm:"HCl", kind:"sa", acidF:"HCl" }
};
function pKaOf(sp){ return sp.kind === "wb" ? r2(PKW - sp.pK) : sp.pK; }
function titrant(sp){ return sp.kind === "wb" ? "HCl" : "NaOH"; }

// @component C9 titrationModel (weak mode) — pH at any volume for 25.0 mL of 0.18 mol/L analyte. Each region uses the hand
// method (start: ICE with the 5% check; buffer: ratio form; equivalence: hydrolysis; after: excess titrant), so screen
// numbers match hand work. Where a shortcut fails its own 5% check (a few drops from the start or from equivalence), the
// model solves the full charge balance instead (flag exact:true), so the curve never folds back.
// A weak base is the mirror image: the same "frame" maths in pOH with Kb, then pH = 14.00 − pOH.
//   TM.calc(id, ct, V) -> {pH, region:"start"|"buffer"|"half"|"eq"|"after"|"before", nW, nC, nT, Vt, exact, …}
//   TM.pH(id, ct, V)   TM.strong(ct, V, base)  (0.18 mol/L strong acid, or strong base if base)  TM.veq(ct)
var TM = (function(){
  var EPS = 1e-9;
  function solve(K, cT, cX){ // h + cX = K·cT/(K + h) + Kw/h, monotonic in h; returns −log h
    var lo = -16, hi = 1;
    for (var i = 0; i < 70; i++) { var m = (lo + hi) / 2, h = Math.pow(10, m), f = h + cX - K * cT / (K + h) - KW / h; if (f > 0) hi = m; else lo = m; }
    return -(lo + hi) / 2;
  }
  function weak(K, pKv, ct, V){
    var nT = ct * V, Vt = VA + V, cT = NA / Vt, cX = nT / Vt, o = { nT:nT, Vt:Vt, K:K, pKv:pKv };
    if (nT < EPS) {
      var c = CA, x = Math.sqrt(K * c); o.x2 = K * c; o.pct = x / c * 100;
      if (x / c > 0.05) { x = (-K + Math.sqrt(K * K + 4 * K * c)) / 2; o.quad = true; }
      o.region = "start"; o.x = x; o.p = -Math.log10(x); o.nW = NA; o.nC = 0;
    } else if (nT < NA - EPS) {
      var nW = NA - nT, nC = nT, pr = pKv + Math.log10(nC / nW), h = Math.pow(10, -pr), oh = KW / h, mn = Math.min(nW, nC) / Vt;
      o.nW = nW; o.nC = nC; o.ratio = nC / nW; o.region = Math.abs(nC - nW) < 1e-6 ? "half" : "buffer";
      if (h < 0.05 * mn && oh < 0.05 * mn) o.p = pr; else { o.p = solve(K, cT, cX); o.exact = true; o.nearStart = nC < nW; }
    } else if (nT <= NA + EPS) {
      var cA = NA / Vt, Kc = KW / K, y = Math.sqrt(Kc * cA); o.x2 = Kc * cA;
      if (y / cA > 0.05) { y = (-Kc + Math.sqrt(Kc * Kc + 4 * Kc * cA)) / 2; o.quad = true; }
      o.region = "eq"; o.cA = cA; o.Kc = Kc; o.y = y; o.p = PKW + Math.log10(y); o.nW = 0; o.nC = NA;
    } else {
      var ex = (nT - NA) / Vt, yh = Math.sqrt(KW / K * NA / Vt);
      o.region = "after"; o.nEx = nT - NA; o.ex = ex; o.nW = 0; o.nC = NA;
      if (yh < 0.05 * ex) o.p = PKW + Math.log10(ex); else { o.p = solve(K, cT, cX); o.exact = true; }
    }
    return o;
  }
  function strongFrame(ct, V){
    var nT = ct * V, Vt = VA + V, net = (NA - nT) / Vt, h = net / 2 + Math.sqrt(net * net / 4 + KW);
    return { nT:nT, Vt:Vt, p:-Math.log10(h), net:net, region:nT < EPS ? "start" : Math.abs(nT - NA) <= EPS ? "eq" : nT < NA ? "before" : "after" };
  }
  function calc(id, ct, V){
    var sp = SP[id], o;
    if (sp.kind === "sa") { o = strongFrame(ct, V); o.pH = o.p; }
    else { o = weak(Math.pow(10, -sp.pK), sp.pK, ct, V); o.pH = sp.kind === "wa" ? o.p : PKW - o.p; }
    o.V = V; o.sp = sp; o.ct = ct; o.veq = NA / ct;
    // amounts of the acid form and the base form (HA / A⁻, or NH₄⁺ / NH₃)
    if (sp.kind === "wa") { o.nAcid = o.nW; o.nBase = o.nC; } else if (sp.kind === "wb") { o.nAcid = o.nC; o.nBase = o.nW; }
    return o;
  }
  return { calc:calc, pH:function(id, ct, V){ return calc(id, ct, V).pH; }, veq:function(ct){ return NA / ct; },
    strong:function(ct, V, base){ var p = strongFrame(ct, V).p; return base ? PKW - p : p; } };
})();

// ---------- indicators (course table from module 42, MV.chem.data.ind); colours named in words ----------
var IND = CD.ind.map(function(r){ return { id:r[0], nm:r[0], lo:r[1], hi:r[2] }; });
var IND_COL = { "methyl orange":["red", "orange", "yellow"], "methyl red":["red", "orange", "yellow"], "bromothymol blue":["yellow", "green", "blue"], "phenolphthalein":["colourless", "pale pink", "pink"] };
var COL_TOK = { red:"--wt-red", orange:"--wt-orange", yellow:"--wt-yellow", green:"--wt-green", blue:"--wt-blue", "pale pink":"--wt-pale", pink:"--wt-pink" };
function indOf(id){ return IND.filter(function(x){ return x.id === id; })[0] || null; }
function indCol(id, pH){
  var d = indOf(id); if (!d) return null;
  var k = pH < d.lo ? 0 : pH > d.hi ? 2 : 1, w = IND_COL[d.id][k];
  return { word:w + (k === 1 && d.id !== "phenolphthalein" ? " (changing)" : ""), tok:COL_TOK[w] || null };
}

// @component flaskView — burette (50 mL, level falls as titrant is added) over an Erlenmeyer flask whose liquid takes the
// indicator colour (token per colour; colourless = sheet). flaskSVG(V, colourToken) -> svg inner markup
function flaskSVG(V, tok){
  var top = 10, bot = 112, lvl = top + (bot - top) * clamp(V / 50, 0, 1), s = "";
  s += '<rect x="92" y="' + top + '" width="16" height="' + (bot - top) + '" rx="2" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.5"/>';
  if (bot - lvl > 0.5) s += '<rect x="93.5" y="' + lvl.toFixed(1) + '" width="13" height="' + (bot - lvl).toFixed(1) + '" fill="var(--rule)"/>';
  for (var m = 0; m <= 50; m += 10) { var y = top + (bot - top) * m / 50; s += '<line x1="92" y1="' + y.toFixed(1) + '" x2="98" y2="' + y.toFixed(1) + '" stroke="var(--ink-2)" stroke-width="1"/><text x="88" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end" font-size="9" fill="var(--ink-2)">' + m + "</text>"; }
  s += '<rect x="86" y="113" width="28" height="7" rx="2" fill="var(--ink)"/><path d="M97 120 L103 120 L101 134 L99 134 Z" fill="var(--ink-2)"/>';
  var yl = 206 - 12 * clamp(V / 50, 0, 1), half = function(y){ return y <= 166 ? 12 : 12 + (y - 166) * 44 / 56; };
  var fill = tok ? "var(" + tok + ")" : "var(--sheet)";
  s += '<path d="M' + (100 - half(yl)).toFixed(1) + " " + yl.toFixed(1) + " L" + (100 + half(yl)).toFixed(1) + " " + yl.toFixed(1) + ' L155 221 Q157 227 150 227 L50 227 Q43 227 45 221 Z" fill="' + fill + '" fill-opacity="' + (tok ? 0.85 : 1) + '"/>';
  s += '<path d="M88 142 L88 166 L44 221 Q41 228 50 228 L150 228 Q159 228 156 221 L112 166 L112 142" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>';
  return s;
}

// ---------- shared plot pieces ----------
var VIEW = { xmin:-4, xmax:51, ymin:-1, ymax:14.5 }, VIEW40 = { xmin:-3, xmax:41, ymin:-1, ymax:14.5 };
function baseScene(view){ return { view:view, xTicks:{ step:5 }, yTicks:{ step:2 }, xLabel:"V (mL)", yLabel:"pH", curves:[], points:[], segments:[], labels:[], bands:[] }; }
function markerSegs(sc, x, y, text){
  sc.segments.push({ x1:x, y1:0, x2:x, y2:y, color:css("--ink"), width:1.4, dash:[4, 4] });
  sc.labels.push({ x:x, y:-0.45, text:text, color:css("--ink"), align:"center", font:"600 12px " + (css("--font-ui") || "sans-serif"), bg:true });
}

// ---------- hero ----------
function hero(f){
  if (!f.canvas) return;
  var plot = new MV.Plot(f.canvas, VIEW40), t = 0, cancel = null;
  var cap = f.cap, caps = ["0.18 mol/L HCl (dashed) and 0.18 mol/L ethanoic acid (blue), each titrated with 0.18 mol/L NaOH.",
    "The ethanoic acid curve starts higher, rises quickly, flattens into the buffer region, then jumps.",
    "At 12.5 mL, half-equivalence, pH 4.74 = " + PKA + ". At 25.0 mL, equivalence, pH 8.85: above 7.",
    "Beyond equivalence both curves meet: excess OH⁻ sets the pH."];
  cap.innerHTML = '<span class="wt-hcap" aria-live="polite"></span> <button type="button" class="btn ghost sm wt-replay" hidden>Replay</button>';
  var capEl = $(".wt-hcap", cap), rep = $(".wt-replay", cap), stage = -1;
  function setCap(i){ if (i !== stage) { stage = i; capEl.innerHTML = caps[i]; } }
  plot.render = function(){
    var sc = baseScene(VIEW40), vmax = 40 * clamp(t / 0.62, 0, 1), font = "600 13px " + (css("--font-ui") || "sans-serif");
    sc.segments.push({ x1:0, y1:7, x2:40, y2:7, color:css("--ink-2"), width:1, dash:[2, 5] });
    sc.labels.push({ x:40, y:7.45, text:"pH 7", align:"right", color:css("--ink-2"), font:"12px " + (css("--font-ui") || "sans-serif") });
    sc.curves.push({ f:function(v){ return TM.strong(0.18, v); }, domain:[0, vmax], color:css("--ink-2"), width:2.2, dash:[6, 6] });
    sc.curves.push({ f:function(v){ return TM.pH("ethanoic", 0.18, v); }, domain:[0, vmax], color:css("--pen"), width:3.2 });
    sc.labels.push({ x:1, y:13.4, text:"— 0.18 mol/L ethanoic acid", color:css("--pen"), font:font, bg:true });
    sc.labels.push({ x:1, y:12.2, text:"- - 0.18 mol/L HCl", color:css("--ink-2"), font:font, bg:true });
    if (t > 0.66) { var u = clamp((t - 0.66) / 0.14, 0, 1), x = 12.5 * u; sc.points.push({ x:x, y:TM.pH("ethanoic", 0.18, x), r:6, color:css("--ink"), label:u >= 1 ? "pH 4.74 = pKa" : "" }); }
    if (t > 0.86) sc.points.push({ x:25, y:TM.pH("ethanoic", 0.18, 25), r:6, color:css("--ink"), label:"pH 8.85: above 7" });
    sc.describe = MV.plain(f.canvas.getAttribute("aria-label") || "");
    plot.draw(sc);
  };
  function play(){
    if (cancel) cancel(); rep.hidden = true;
    t = 0; setCap(0);
    cancel = MV.tween({ dur:6200, ease:function(x){ return x; }, step:function(v){ t = v; setCap(v < 0.25 ? 0 : v < 0.66 ? 1 : v < 0.97 ? 2 : 3); plot.render(); }, done:function(){ cancel = null; t = 1; setCap(3); plot.render(); rep.hidden = false; } });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) { t = 1; setCap(3); plot.render(); rep.hidden = false; } else play();
}

// ---------- Explore: C9 titration lab, weak mode ----------
var CTS = [{ id:"0.090", v:0.09, t:"0.090 mol/L" }, { id:"0.18", v:0.18, t:"0.18 mol/L" }, { id:"0.36", v:0.36, t:"0.36 mol/L" }];
function ctId(v){ var m = CTS.filter(function(c){ return Math.abs(c.v - v) < 1e-9; })[0]; return m ? m.id : "0.18"; }
function ctV(id){ var m = CTS.filter(function(c){ return c.id === id; })[0]; return m ? m.v : 0.18; }
var REG = { start:"Start", buffer:"Buffer region", half:"Half-equivalence", eq:"Equivalence", after:"After equivalence", before:"Before equivalence" };
function methodOf(o){
  var sp = o.sp, a = sp.kind === "wa";
  if (sp.kind === "sa") return { start:"Start: strong acid, [H₃O⁺] = " + CI, before:"Before: excess H₃O⁺ ÷ total volume", eq:"Equivalence: neutral salt", after:"After: excess OH⁻ ÷ total volume" }[o.region];
  if (o.exact) return "Full equilibrium (too close to " + (o.region === "after" || !o.nearStart ? "equivalence" : "the start") + " for the shortcut)";
  if (o.region === "start") return "Start: ICE with " + (a ? KA : KB);
  if (o.region === "buffer" || o.region === "half") return "Buffer: ratio, pH = " + PKA + " + log(" + NI + "(" + F(sp.baseF) + ") ÷ " + NI + "(" + F(sp.acidF) + "))";
  if (o.region === "eq") return "Equivalence: hydrolysis of " + F(a ? sp.baseF : sp.acidF);
  return "After: excess " + (a ? "OH⁻" : "H₃O⁺");
}
// working lines for the Calculate mode; the last line holds the pH (hidden when the meter is off)
function workLines(o){
  var sp = o.sp, a = sp.kind === "wa", L = [], V = fx(o.V, 2), ct = fx(o.ct, o.ct < 0.1 ? 3 : 2), tit = a || sp.kind === "sa" ? "OH⁻" : "H₃O⁺";
  if (sp.kind === "sa") {
    if (o.region === "start") { L.push(CI + " = 0.18 mol/L, and a strong acid ionizes completely: [H₃O⁺] = 0.18 mol/L."); L.push("pH = −log 0.18 = " + fx(o.pH, 2)); }
    else if (o.region === "before") { L.push(NI + "(OH⁻) added = " + ct + " × " + V + " = " + fx(o.nT, 2) + " mmol; H₃O⁺ left = 4.50 − " + fx(o.nT, 2) + " = " + fx(NA - o.nT, 2) + " mmol."); L.push("[H₃O⁺] = " + fx(NA - o.nT, 2) + " mmol ÷ " + fx(o.Vt, 2) + " mL = " + sci(o.net, 3) + " mol/L"); L.push("pH = " + fx(o.pH, 2)); }
    else if (o.region === "eq") { L.push("Only Na⁺, Cl⁻ and water remain: neither ion reacts with water."); L.push("pH = 7.00"); }
    else { L.push(NI + "(OH⁻) added = " + ct + " × " + V + " = " + fx(o.nT, 2) + " mmol; excess = " + fx(o.nT - NA, 2) + " mmol."); L.push("[OH⁻] = " + fx(o.nT - NA, 2) + " mmol ÷ " + fx(o.Vt, 2) + " mL = " + sci(-o.net, 3) + " mol/L"); L.push("pOH = " + fx(PKW - o.pH, 2) + "; pH = 14.00 − " + fx(PKW - o.pH, 2) + " = " + fx(o.pH, 2)); }
    return L;
  }
  var K = a ? KA : KB, Kc = a ? KB : KA, x = a ? "[H₃O⁺]" : "[OH⁻]", y = a ? "[OH⁻]" : "[H₃O⁺]", W = F(a ? sp.acidF : sp.baseF), C = F(a ? sp.baseF : sp.acidF);
  if (o.region === "start") {
    L.push(CI + " = 0.18 mol/L, " + K + " = 10<sup>−" + fx(sp.pK, 2) + "</sup> = " + sci(o.K) + ".");
    L.push(XI + "² = " + K + " × " + CI + " = " + sci(o.x2) + ", so " + XI + " = " + x + " = " + sci(o.x) + " mol/L.");
    L.push("5% check: " + XI + " ÷ " + CI + " = " + fx(o.pct, 1) + "%" + (o.quad ? ", over 5%, so solve the quadratic instead." : ", under 5%, so the shortcut holds."));
    L.push(a ? "pH = −log " + XI + " = " + fx(o.pH, 2) : "pOH = −log " + XI + " = " + fx(PKW - o.pH, 2) + "; pH = 14.00 − " + fx(PKW - o.pH, 2) + " = " + fx(o.pH, 2));
  } else if (o.region === "buffer" || o.region === "half") {
    L.push(NI + "(" + tit + ") added = " + ct + " × " + V + " = " + fx(o.nT, 2) + " mmol.");
    L.push(NI + "(" + C + ") = " + fx(o.nC, 2) + " mmol; " + NI + "(" + W + ") = 4.50 − " + fx(o.nT, 2) + " = " + fx(o.nW, 2) + " mmol.");
    if (o.exact) { L.push("So close to " + (o.nearStart ? "the start" : "equivalence") + " that the ratio form fails the 5% check: the simulator solves the full equilibrium instead."); L.push("pH = " + fx(o.pH, 2)); }
    else {
      var rb = o.nBase / o.nAcid, lg = Math.log10(rb), pka = pKaOf(sp);
      L.push("pH = " + PKA + (a ? "" : "(" + F(sp.acidF) + ")") + " + log(" + NI + "(" + F(sp.baseF) + ") ÷ " + NI + "(" + F(sp.acidF) + ")) = " + fx(pka, 2) + " + log(" + rtxt(rb) + ")");
      L.push("pH = " + fx(pka, 2) + (lg < 0 ? " − " : " + ") + fx(Math.abs(lg), 2) + " = " + fx(o.pH, 2));
    }
  } else if (o.region === "eq") {
    L.push("All 4.50 mmol of " + W + " is now " + C + ", in " + fx(o.Vt, 2) + " mL: " + CI + "(" + C + ") = " + fx(o.cA, 4) + " mol/L.");
    L.push(Kc + " = " + KWH + " ÷ " + K + " = " + sci(KW) + " ÷ " + sci(o.K) + " = " + sci(o.Kc) + ".");
    L.push(XI + "² = " + Kc + " × " + CI + " = " + sci(o.x2) + ", so " + XI + " = " + y + " = " + sci(o.y) + " mol/L" + (o.quad ? " (quadratic)." : "."));
    L.push(a ? "pOH = " + fx(PKW - o.pH, 2) + "; pH = 14.00 − " + fx(PKW - o.pH, 2) + " = " + fx(o.pH, 2) : "pH = −log " + XI + " = " + fx(o.pH, 2));
  } else {
    L.push(NI + "(" + tit + ") added = " + ct + " × " + V + " = " + fx(o.nT, 2) + " mmol; excess = " + fx(o.nT, 2) + " − 4.50 = " + fx(o.nEx, 2) + " mmol.");
    if (o.exact) { L.push("Just past equivalence, the hydrolysis of " + C + " still matters: the simulator solves the full equilibrium instead."); L.push("pH = " + fx(o.pH, 2)); }
    else {
      L.push((a ? "[OH⁻]" : "[H₃O⁺]") + " = " + fx(o.nEx, 2) + " mmol ÷ " + fx(o.Vt, 2) + " mL = " + fx(o.ex, 4) + " mol/L.");
      L.push(a ? "pOH = " + fx(PKW - o.pH, 2) + "; pH = 14.00 − " + fx(PKW - o.pH, 2) + " = " + fx(o.pH, 2) : "pH = −log " + fx(o.ex, 4) + " = " + fx(o.pH, 2));
    }
  }
  return L;
}

function explore(host, api){
  var S = api.S, C = api.content;
  if (!SP[S.sp]) S.sp = "ethanoic";
  if (!CTS.some(function(c){ return Math.abs(c.v - S.ct) < 1e-9; })) S.ct = 0.18;
  S.V = typeof S.V === "number" ? clamp(r2(S.V), 0, 50) : 0;
  if (["lab", "curve", "calc"].indexOf(S.mode) < 0) S.mode = "curve";
  if (S.ind !== "none" && !indOf(S.ind)) S.ind = "none";
  S.ov = !!S.ov; S.meter = S.meter !== false; S.rec = Array.isArray(S.rec) ? S.rec : [];
  S.probe = typeof S.probe === "number" ? clamp(S.probe, 0, S.V) : S.V; S.pf = S.pf !== false; S.entry = S.entry || "";
  var busy = false, msg = "", cancel = null;
  var phone = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
  host.innerHTML = '<p class="how">' + C.how + '</p><div class="wt-grid"><div class="wt-main" data-mv="graph">' +
    '<div class="eq-cap wt-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p><div class="wt-modes"></div>' +
    '<div class="wt-labrow"><svg class="wt-flask" viewBox="0 0 200 232" role="img" aria-label=""></svg><div class="wt-labside"><div class="wt-meter" aria-live="polite"></div>' +
    '<button type="button" class="btn ghost sm wt-recb" data-k="wtrec">Stop and record</button><p class="tiny muted wt-colw"></p></div></div>' +
    '<div class="plot-wrap"><canvas class="plot wide" role="img" aria-label="Titration curve"></canvas></div>' +
    '<p class="wt-probe" aria-live="polite"></p><p class="tiny muted wt-legend"></p><div class="wt-calc"></div><div class="wt-recs"></div></div>' +
    '<div class="wt-side"><div class="wt-ctrl"><div class="wt-sp"></div><p class="tiny muted">' + C.flaskNote + '</p>' +
    '<div class="wt-ctrow"><span class="rg-lab wt-tname"></span><div class="wt-ct"></div></div>' +
    '<div class="wt-bur" role="group" aria-label="Burette"><button type="button" class="btn ghost sm" data-add="1" data-k="wta1">+1.00 mL</button><button type="button" class="btn ghost sm" data-add="0.1" data-k="wta01">+0.10 mL</button><button type="button" class="btn ghost sm" data-add="0.05" data-k="wta005">+1 drop (0.05 mL)</button><button type="button" class="btn ghost sm" data-reset="1" data-k="wtreset">Reset</button></div>' +
    '<form class="wt-to"><label for="wt-toin">Add to</label><input type="text" id="wt-toin" class="numin wt-toin" inputmode="decimal" autocomplete="off" placeholder="0.00–50.00"><span>mL</span><button type="submit" class="btn ghost sm" data-k="wtto">Add</button></form>' +
    '<div class="wt-ind"></div>' +
    '<label class="wt-chk"><input type="checkbox" class="wt-ov"> <span class="wt-ovl"></span></label>' +
    '<label class="wt-chk"><input type="checkbox" class="wt-mt"> pH m&#101;ter on</label>' +
    '<form class="wt-ent"><label for="wt-entin">Your pH</label><input type="text" id="wt-entin" class="numin wt-entin" inputmode="decimal" autocomplete="off"><span class="tiny muted">for the challenges</span></form>' +
    '<p class="wt-msg" aria-live="polite"></p></div>' +
    '<dl class="read wt-read" aria-live="polite"></dl>' +
    '<details class="wt-vals"' + (phone ? "" : " open") + '><summary>Values</summary>' + MV.usesHTML(C.use) + '</details><div class="wt-tabs"></div></div></div>';
  var canvas = $("canvas", host), plot = new MV.Plot(canvas, VIEW);
  var modeRG = radios($(".wt-modes", host), { label:"Mode", aria:"Lab mode", options:[{ id:"lab", t:"Lab" }, { id:"curve", t:"Curve" }, { id:"calc", t:"Calculate" }], value:S.mode, onChange:function(v){ S.mode = v; api.save(); paint(); } });
  var spRG = radios($(".wt-sp", host), { label:"In the flask", aria:"In the flask", cls:"chips", options:[{ id:"ethanoic", t:"ethanoic acid" }, { id:"methanoic", t:"methanoic acid" }, { id:"benzoic", t:"benzoic acid" }, { id:"hypochlorous", t:"hypochlorous acid" }, { id:"ammonia", t:"ammonia (weak base)" }, { id:"hcl", t:"HCl (for comparison)" }], value:S.sp,
    onChange:function(v){ S.sp = v; newRun("New titration: 25.0 mL of 0.18 mol/L " + SP[v].nm + "."); } });
  var ctRG = radios($(".wt-ct", host), { aria:"Titrant concentration", cls:"chips", options:CTS, value:ctId(S.ct), onChange:function(v){ S.ct = ctV(v); newRun("New titration with " + v + " mol/L " + titrant(SP[S.sp]) + "."); } });
  var indRG = radios($(".wt-ind", host), { label:"Indicator", aria:"Indicator", cls:"chips", options:[{ id:"none", t:"none" }].concat(IND.map(function(d){ return { id:d.id, t:d.nm }; })), value:S.ind, onChange:function(v){ S.ind = v; api.save(); paint(); MV.changed(); } });
  MV.chem.tablePanel($(".wt-tabs", host), "ind", { title:"Course data table: indicators" });
  MV.chem.tablePanel($(".wt-tabs", host), "acid", { title:"Course data table: acid and base constants" });
  var ov = $(".wt-ov", host), mt = $(".wt-mt", host), ent = $(".wt-entin", host);
  ov.checked = S.ov; mt.checked = S.meter; ent.value = S.entry;
  ov.addEventListener("change", function(){ S.ov = ov.checked; api.save(); paint(); });
  mt.addEventListener("change", function(){ S.meter = mt.checked; api.save(); paint(); MV.changed(); });
  ent.addEventListener("input", function(){ S.entry = ent.value; api.save(); MV.changed(); });
  $(".wt-ent", host).addEventListener("submit", function(e){ e.preventDefault(); });

  function newRun(m){ S.V = 0; S.probe = 0; S.pf = true; S.rec = []; msg = m || ""; api.save(); paint(); MV.changed(); }
  function setV(v){ S.V = r2(clamp(v, 0, 50)); if (S.pf || S.probe > S.V) S.probe = S.V; }
  function add(dv){
    if (busy) return;
    if (S.V >= 50 - 1e-9) { msg = "The burette is empty: 50.00 mL added. Press Reset to start again."; paint(); return; }
    setV(S.V + dv); msg = ""; api.save(); paint(); MV.changed();
  }
  $(".wt-bur", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.reset) { newRun("Reset: a fresh flask, nothing added."); return; }
    add(+b.dataset.add);
  });
  $(".wt-to", host).addEventListener("submit", function(e){
    e.preventDefault(); if (busy) return;
    var v = MV.parseNum($(".wt-toin", host).value);
    v = v && v.length === 1 ? v[0] : NaN;
    if (!isFinite(v) || v < 0 || v > 50) { msg = "Type a volume from 0.00 to 50.00 mL."; paint(); return; }
    if (v < S.V - 1e-9) { msg = "The burette only adds liquid. Press Reset first, then add to " + fx(v, 2) + " mL."; paint(); return; }
    setV(v); msg = ""; api.save(); paint(); MV.changed();
  });
  $(".wt-recb", host).addEventListener("click", function(){
    if (busy) return;
    var o = TM.calc(S.sp, S.ct, S.V), ic = indCol(S.ind, o.pH);
    S.rec = S.rec.filter(function(r){ return Math.abs(r.V - S.V) > 1e-9; });
    S.rec.push({ V:S.V, pH:S.meter ? r2(o.pH) : null, col:ic ? ic.word : "" }); S.rec.sort(function(p, q){ return p.V - q.V; });
    if (S.rec.length > 40) S.rec.shift();
    msg = "Recorded " + fx(S.V, 2) + " mL."; api.save(); paint();
  });
  $(".wt-recs", host).addEventListener("click", function(e){ if (e.target.closest("[data-clear]")) { S.rec = []; api.save(); paint(); } });

  var drag = MV.drag(plot, { axis:"x", step:{ x:0.5, y:0.5 }, big:0.1,
    handles:function(){ return (S.mode === "curve" && S.meter && !busy) ? [{ id:"probe", x:S.probe, y:TM.pH(S.sp, S.ct, S.probe), label:"Probe at " + fx(S.probe, 2) + " mL, pH " + fx(TM.pH(S.sp, S.ct, S.probe), 2) + ". Arrow keys move it 0.5 mL; Shift and an arrow key, 0.05 mL." }] : []; },
    snap:function(x){ return [clamp(Math.round(x * 20) / 20, 0, S.V), 0]; },
    move:function(id, x){ S.probe = r2(x); S.pf = Math.abs(S.probe - S.V) < 1e-9; api.save(); paint(); } });

  function lock(b){
    busy = b; [modeRG, spRG, ctRG, indRG].forEach(function(r){ r.lock(b); });
    $$("button, input", $(".wt-ctrl", host)).forEach(function(el){ if (!el.closest(".rg")) el.disabled = b; });
    $(".wt-recb", host).disabled = b; if (!b) ov.disabled = SP[S.sp].kind === "sa";
  }
  function scene(){
    var sp = SP[S.sp], o = TM.calc(S.sp, S.ct, S.V), veq = o.veq, sc = baseScene(VIEW), showCurve = S.mode !== "lab" && S.meter, wb = sp.kind === "wb";
    var font = "600 12px " + (css("--font-ui") || "sans-serif");
    if (showCurve) {
      if (sp.kind !== "sa" && S.V > 0.12 * veq) {
        sc.bands.push({ x0:0.12 * veq, x1:Math.min(S.V, 0.88 * veq), color:css("--hi-soft"), alpha:0.6 });
        if (S.V > 0.4 * veq) sc.labels.push({ x:0.5 * veq, y:wb ? 0.9 : 13.6, text:"buffer region", align:"center", color:css("--ink-2"), font:font });
      }
      if (sp.kind !== "sa" && S.V > veq + 4) sc.labels.push({ x:Math.min(veq + (50 - veq) / 2, 46), y:wb ? 13.6 : 0.9, text:"excess " + (wb ? "H₃O⁺" : "OH⁻"), align:"center", color:css("--ink-2"), font:font });
      if (S.ov && sp.kind !== "sa") sc.curves.push({ f:function(v){ return TM.strong(S.ct, v, wb); }, domain:[0, S.V], color:css("--ink-2"), width:2.2, dash:[6, 6] });
      sc.curves.push({ f:function(v){ return TM.pH(S.sp, S.ct, v); }, domain:[0, S.V], color:css("--pen"), width:3.2 });
      if (sp.kind !== "sa" && S.V >= veq / 2 - 1e-9) markerSegs(sc, veq / 2, TM.pH(S.sp, S.ct, veq / 2), "½ eq.");
      if (S.V >= veq - 1e-9) markerSegs(sc, veq, TM.pH(S.sp, S.ct, veq), "eq.");
      sc.points.push({ x:S.V, y:o.pH, r:5, color:css("--pen") });
      if (S.mode === "curve") sc.points.push({ x:S.probe, y:TM.pH(S.sp, S.ct, S.probe), r:6, color:css("--ink") });
    } else if (S.mode === "lab") {
      sc.data = S.rec.filter(function(r){ return r.pH != null; }).map(function(r){ return { x:r.V, y:r.pH, r:4.5, color:css("--ink") }; });
    }
    if (!S.meter) sc.labels.push({ x:23.5, y:7, text:"pH m" + "eter off: no pH readings", align:"center", color:css("--ink-2"), font:font, bg:true });
    sc.describe = !S.meter ? "Graph of pH against volume added. The m" + "eter is off, so no pH values are shown." :
      S.mode === "lab" ? "Graph of your recorded readings: " + (S.rec.length ? S.rec.filter(function(r){ return r.pH != null; }).map(function(r){ return fx(r.V, 2) + " mL, pH " + fx(r.pH, 2); }).join("; ") : "none yet") + "." :
      "Titration curve of 25.0 mL of 0.18 mol/L " + sp.nm + " with " + fx(S.ct, S.ct < 0.1 ? 3 : 2) + " mol/L " + titrant(sp) + ", from 0 to " + fx(S.V, 2) + " mL. pH now " + fx(o.pH, 2) + "." + (S.ov && sp.kind !== "sa" ? " The dashed curve is the strong " + (wb ? "base" : "acid") + " for comparison." : "");
    return sc;
  }
  plot.render = function(){ plot.draw(scene()); };

  function paint(){
    var sp = SP[S.sp], o = TM.calc(S.sp, S.ct, S.V), ic = indCol(S.ind, o.pH), ctTxt = fx(S.ct, S.ct < 0.1 ? 3 : 2);
    $(".wt-cap", host).innerHTML = "25.0 mL of 0.18 mol/L " + (sp.kind === "sa" ? "HCl" : sp.nm) + " + " + ctTxt + " mol/L " + titrant(sp);
    $(".wt-tname", host).textContent = titrant(sp) + " (titrant)";
    $(".wt-ovl", host).innerHTML = sp.kind === "wb" ? "Show the strong-base curve (0.18 mol/L NaOH, dashed)" : "Show the strong-acid curve (0.18 mol/L HCl, dashed)";
    if (!busy) ov.disabled = sp.kind === "sa";
    var svg = $(".wt-flask", host); svg.innerHTML = flaskSVG(S.V, ic ? ic.tok : null);
    svg.setAttribute("aria-label", "Burette: " + fx(S.V, 2) + " mL of " + titrant(sp) + " added. Flask colour: " + (ic ? ic.word.replace(" (changing)", ", changing") + " (" + S.ind + ")" : "no indicator") + ".");
    $(".wt-colw", host).textContent = ic ? "Flask: " + ic.word + " (" + S.ind + ")" : "No indicator in the flask.";
    $(".wt-meter", host).innerHTML = '<span class="wt-mlab">pH m&#101;ter</span><span class="wt-mval">' + (S.meter ? fx(o.pH, 2) : "off") + "</span>";
    $(".wt-meter", host).classList.toggle("off", !S.meter);
    $(".wt-recb", host).hidden = S.mode !== "lab";
    // readout
    var rows = [["Volume added", fx(S.V, 2) + " mL"], ["Region", REG[o.region]]];
    if (sp.kind === "sa") rows.push([NI + "(H₃O⁺) / " + NI + "(OH⁻) left", fx(Math.max(0, NA - o.nT), 2) + " / " + fx(Math.max(0, o.nT - NA), 2) + " mmol"]);
    else rows.push([NI + "(" + F(sp.acidF) + ") / " + NI + "(" + F(sp.baseF) + ")", fx(o.nAcid, 2) + " / " + fx(o.nBase, 2) + " mmol"]);
    if (sp.kind !== "sa" && (o.region === "buffer" || o.region === "half")) { var rb = o.nBase / o.nAcid; rows.push(["Ratio " + F(sp.baseF) + " : " + F(sp.acidF), rb >= 1 ? rtxt(rb) + " : 1" : "1 : " + rtxt(1 / rb)]); }
    rows.push(["Method", methodOf(o)]);
    rows.push(["pH", S.meter ? "<strong>" + fx(o.pH, 2) + "</strong>" : muted("m&#101;ter off")]);
    rows.push(["Indicator", ic ? ic.word + " (" + S.ind + ")" : "none"]);
    $(".wt-read", host).innerHTML = MV.readoutHTML(rows);
    // probe
    var pr = $(".wt-probe", host);
    if (S.mode === "curve" && S.meter) {
      var q = TM.calc(S.sp, S.ct, S.probe);
      pr.innerHTML = "<strong>Probe</strong> " + fx(S.probe, 2) + " mL: pH " + fx(q.pH, 2) + (sp.kind === "sa" ? "" : " · " + NI + "(" + F(sp.acidF) + ") " + fx(q.nAcid, 2) + " mmol · " + NI + "(" + F(sp.baseF) + ") " + fx(q.nBase, 2) + " mmol") +
        (S.V > 0 ? muted(" (drag the black dot, or focus it and use the arrow keys)") : muted(" (add titrant first; the probe moves along the curve you’ve made)"));
    } else if (S.mode === "curve") pr.innerHTML = muted("Turn the m&#101;ter on to plot the curve and use the probe.");
    else pr.innerHTML = "";
    $(".wt-legend", host).innerHTML = S.mode === "lab" ? "Dots: your recorded readings (ink)." : sp.kind === "sa" ? "Blue: the HCl curve. Ink dashed lines mark equivalence." :
      "Blue: the " + sp.nm + " curve" + (S.ov ? "; dashed grey: the strong " + (sp.kind === "wb" ? "base" : "acid") : "") + ". Shaded: buffer region (" + F(sp.acidF) + " and " + F(sp.baseF) + " both present). Ink dashed lines: half-equivalence and equivalence.";
    // calculator
    var cb = $(".wt-calc", host);
    if (S.mode === "calc") {
      var L = workLines(o), last = L.length - 1;
      cb.innerHTML = '<h4 class="wt-h4">' + methodOf(o) + "</h4><ol class=\"wt-work\">" + L.map(function(l, i){ return "<li>" + (i === last && !S.meter ? muted("M&#101;ter off: finish this line yourself.") : l) + "</li>"; }).join("") + "</ol>";
    } else cb.innerHTML = "";
    var rc = $(".wt-recs", host);
    if (S.mode === "lab") rc.innerHTML = S.rec.length ? MV.tableHTML({ head:["Volume (mL)", "pH", "Flask colour"], rows:S.rec.map(function(r){ return [fx(r.V, 2), r.pH == null ? "—" : fx(r.pH, 2), r.col || "—"]; }), caption:"Recorded readings" }) + '<button type="button" class="btn ghost sm" data-clear="1" data-k="wtclr">Clear the records</button>' : muted("Press <strong>Stop and record</strong> to log a reading.");
    else rc.innerHTML = "";
    $(".wt-msg", host).innerHTML = msg;
    $$(".wt-bur [data-add]", host).forEach(function(b){ if (!busy) b.disabled = S.V >= 50 - 1e-9; });
    plot.render();
  }

  // ---------- predictions ----------
  function setState(o){
    if (cancel) { cancel(); cancel = null; } lock(false);
    S.sp = o.sp; S.ct = 0.18; S.V = o.V; S.probe = o.V; S.pf = true; S.mode = "curve"; S.meter = true; S.ov = !!o.ov; S.rec = []; msg = "";
    spRG.set(S.sp); ctRG.set("0.18"); modeRG.set("curve"); ov.checked = S.ov; mt.checked = true;
    api.save(); paint(); MV.changed();
  }
  var TXT = { p1:"Both jumps sit at 25.0 mL: same moles of acid, same volume of NaOH.", p2:"Probe locked at 12.50 mL: n(HA) = n(A⁻) = 2.25 mmol, so pH = pKa = 4.74.",
    p3:"pH 8.85 at equivalence: above 7. Bromothymol blue would change too early here.", p4:"pH 5.15 at equivalence: below 7." };
  var hooks = {
    start:function(p){
      if (p.id === "p1") setState({ sp:"ethanoic", V:0, ov:true });
      else if (p.id === "p2") setState({ sp:"ethanoic", V:12 });
      else if (p.id === "p3") setState({ sp:"ethanoic", V:24 });
      else setState({ sp:"ammonia", V:0 });
    },
    run:function(p, done){
      var to = { p1:35, p2:12.5, p3:25, p4:25 }[p.id], from = S.V, dur = { p1:3200, p2:1100, p3:1300, p4:2600 }[p.id];
      lock(true);
      cancel = MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(t){ S.V = r2(from + (to - from) * t); S.probe = S.V; paint(); },
        done:function(){ cancel = null; S.V = to; S.probe = to; S.pf = true; lock(false); api.save(); paint(); api.banner("", TXT[p.id]); MV.changed(); done(); } });
    }
  };
  // ---------- challenges ----------
  function entry(){ var v = MV.parseNum(S.entry || ""); return v && v.length === 1 ? v[0] : null; }
  function near(a, b, t){ return Math.abs(a - b) <= t + 1e-9; }
  function chal(id){
    var e = entry(), sp = SP[S.sp];
    if (id === "tc1") {
      if (S.sp !== "ethanoic") return { ok:false, msg:"Put ethanoic acid in the flask first." };
      if (!near(S.ct, 0.18, 0)) return { ok:false, msg:"Use 0.18 mol/L NaOH, so equivalence is at 25.0 mL." };
      if (near(S.V, 25, 0.05)) return { ok:false, msg:"That’s equivalence. Half-equivalence is half that volume." };
      if (!near(S.V, 12.5, 0.05)) return { ok:false, msg:"The burette reads " + fx(S.V, 2) + " mL. Half-equivalence is half of the equivalence volume." };
      if (e === null) return { ok:false, msg:"Now read the pH at 12.50 mL and type it in the Your pH box." };
      if (near(e, 7, 0.02)) return { ok:false, msg:"Read the m&#101;ter at 12.5 mL." };
      if (near(e, 4.74, 0.02)) return { ok:true };
      return { ok:false, msg:"Read the m&#101;ter at 12.5 mL." };
    }
    if (id === "tc2") {
      if (S.sp === "ethanoic") return { ok:false, msg:"Its " + PKA + " is 4.74." };
      if (sp.kind === "wa" && S.sp !== "benzoic") return { ok:false, msg:"Its " + PKA + " is " + fx(sp.pK, 2) + ". Match 4.20 in the " + PKA + " list." };
      if (S.sp !== "benzoic") return { ok:false, msg:"The mystery is a weak acid: match 4.20 in the " + PKA + " list." };
      if (S.ind === "methyl red") return { ok:false, msg:"This equivalence pH is 8.58; methyl red’s range (4.4–6.2) is far too low." };
      if (S.ind === "bromothymol blue") return { ok:false, msg:"6.0–7.6 ends before 8.58." };
      if (S.ind === "methyl orange") return { ok:false, msg:"This equivalence pH is 8.58; methyl orange’s range (3.1–4.4) is far too low." };
      if (S.ind !== "phenolphthalein") return { ok:false, msg:"Right acid. Now choose the indicator for its titration." };
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.sp !== "ethanoic") return { ok:false, msg:"Put ethanoic acid in the flask first." };
      if (!near(S.ct, 0.18, 0)) return { ok:false, msg:"Use 0.18 mol/L NaOH." };
      if (near(S.V, 5, 0.05)) return { ok:false, msg:"That gives a ratio of 1 : 4, so pH 4.14. You inverted the ratio." };
      if (near(S.V, 16.7, 0.1)) return { ok:false, msg:"That gives a ratio of 2 (pH 5.04). You need log(ratio) = 0.60." };
      if (!near(S.V, 20, 0.05)) return { ok:false, msg:"(a) Not yet: the burette reads " + fx(S.V, 2) + " mL. You need log(" + NI + "(A⁻) ÷ " + NI + "(HA)) = 5.34 − 4.74 = 0.60." };
      if (e === null) return { ok:false, msg:"(a) is right. Now (b): predict the pH at 5.0 mL and type it in the Your pH box." };
      if (near(e, 5.34, 0.02)) return { ok:false, msg:"At 5.0 mL there’s less A⁻ than HA. pH = " + PKA + " + log(base form ÷ acid form). More A⁻ means a higher pH." };
      if (near(e, 4.14, 0.02)) return { ok:true };
      return { ok:false, msg:"(a) is right. For (b), find " + NI + "(A⁻) and " + NI + "(HA) at 5.0 mL, then use the ratio form." };
    }
    return { ok:false };
  }
  lock(false); paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Find Ka from a curve ----------
var S1MAP = { "1":"benzoic", "2":"hypochlorous", "3":"methanoic", "4":"ethanoic" };
var S1ACIDS = ["methanoic", "benzoic", "ethanoic", "hypochlorous"];
// @component particleZoom — NH₃ (teal fill) and NH₄⁺ (ink outline) particles, plus H₃O⁺ (magenta) past equivalence; 12 particles
// share the 4.50 mmol in proportion. particlesSVG(nB, nBH, nEx) -> svg markup
function particlesSVG(nB, nBH, nEx){
  var N = 12, b = Math.round(N * nB / NA), bh = N - b, ex = Math.min(6, Math.round(N * nEx / NA)), list = [], s = "", i;
  for (i = 0; i < b; i++) list.push("b"); for (i = 0; i < bh; i++) list.push("a"); for (i = 0; i < ex; i++) list.push("h");
  list = MV.shuffle(list, 43);
  list.forEach(function(k, j){
    var col = j % 9, row = Math.floor(j / 9), x = 30 + col * 38 + (row % 2) * 16, y = 34 + row * 46;
    if (k === "b") s += '<circle cx="' + x + '" cy="' + y + '" r="15" fill="var(--f3)"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--sheet)">NH₃</text>';
    else if (k === "a") s += '<circle cx="' + x + '" cy="' + y + '" r="15" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2.2"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink)">NH₄⁺</text>';
    else s += '<circle cx="' + x + '" cy="' + y + '" r="13" fill="var(--ab-h3o)"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="9" font-weight="700" fill="var(--sheet)">H₃O⁺</text>';
  });
  return { svg:s, b:b, bh:bh, ex:ex };
}
function part3(host, api){
  var S = api.S, C = api.content;
  S.s1 = S.s1 || {}; S.s1.cur = S1MAP[S.s1.cur] ? S.s1.cur : "1"; S.s1.probe = typeof S.s1.probe === "number" ? S.s1.probe : 0; S.s1.pick = S.s1.pick || {};
  S.s2 = S.s2 || {}; S.s3 = S.s3 || {}; S.s3.probe = typeof S.s3.probe === "number" ? S.s3.probe : 0;
  var fb1 = "", fb2 = {}, fb3 = "";
  host.innerHTML =
    '<div class="part wt-st"><h3>' + C.s1.title + "</h3><p>" + C.s1.intro + '</p><div class="wt-s1cur"></div>' +
    '<div class="plot-wrap"><canvas class="plot wide" id="wt-s1c" role="img" aria-label="Four unlabelled titration curves"></canvas></div><p class="wt-probe wt-s1pr" aria-live="polite"></p>' +
    '<div class="wt-s1m">' + ["1", "2", "3", "4"].map(function(k){ return '<div class="wt-s1row" data-c="' + k + '"></div>'; }).join("") + "</div>" +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-k="s1chk">Check the matches</button></div><div class="wt-s1fb"></div>' +
    '<details class="alg"><summary>Check it with data</summary><p>' + C.s1.data + '</p><div class="wt-s1tab"></div></details></div>' +
    '<div class="part wt-st"><h3>' + C.s2.title + "</h3><p>" + C.s2.intro + "</p>" + MV.usesHTML(C.s2.use) + '<div class="wt-s2"></div></div>' +
    '<div class="part wt-st"><h3>' + C.s3.title + "</h3><p>" + C.s3.intro + '</p><div class="plot-wrap"><canvas class="plot wide" id="wt-s3c" role="img" aria-label="Ammonia titration curve"></canvas></div><p class="wt-probe wt-s3pr" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm wt-zoom" data-k="s3zoom" aria-pressed="false">Zoom to the particles</button></div><div class="wt-zoombox" hidden><svg class="wt-psvg" viewBox="0 0 360 120" role="img" aria-label=""></svg><p class="tiny muted wt-plg"></p></div>' +
    '<div class="wt-s3fill"><p>pH at half-equivalence = ' + PKA + ' of NH₄⁺ = <input type="text" class="numin wt-s3a" inputmode="decimal" aria-label="pKa of NH4+" autocomplete="off">, so ' + PKB + ' of NH₃ = 14.00 − ' + PKA + ' = <input type="text" class="numin wt-s3b" inputmode="decimal" aria-label="pKb of NH3" autocomplete="off"> and ' + KB + ' = </p><div class="wt-s3k"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-k="s3chk">Check</button></div><div class="wt-s3fb"></div></div></div>';
  MV.chem.tablePanel($(".wt-s1tab", host), "acid", { title:"Course data table: acid and base constants" });
  // Station 1
  var p1 = new MV.Plot($("#wt-s1c"), VIEW40);
  radios($(".wt-s1cur", host), { label:"Curve", aria:"Choose a curve", options:["1", "2", "3", "4"].map(function(k){ return { id:k, t:"Curve " + k }; }), value:S.s1.cur, onChange:function(v){ S.s1.cur = v; api.save(); paint1(); } });
  ["1", "2", "3", "4"].forEach(function(k){
    radios($('.wt-s1row[data-c="' + k + '"]', host), { label:"Curve " + k, aria:"Curve " + k + " is", cls:"chips", options:S1ACIDS.map(function(id){ return { id:id, t:SP[id].nm }; }), value:S.s1.pick[k] || "", onChange:function(v){ S.s1.pick[k] = v; fb1 = ""; api.save(); paint1(); } });
  });
  p1.render = function(){
    var sc = baseScene(VIEW40);
    ["1", "2", "3", "4"].forEach(function(k){ if (k !== S.s1.cur) sc.curves.push({ f:function(v){ return TM.pH(S1MAP[k], 0.18, v); }, domain:[0, 40], color:css("--ink-2"), width:1.4, alpha:0.55 }); });
    var id = S1MAP[S.s1.cur];
    sc.curves.push({ f:function(v){ return TM.pH(id, 0.18, v); }, domain:[0, 40], color:css("--pen"), width:3.2 });
    sc.points.push({ x:S.s1.probe, y:TM.pH(id, 0.18, S.s1.probe), r:6, color:css("--ink") });
    sc.describe = "Four titration curves, each 25.0 mL of 0.18 mol/L acid with 0.18 mol/L NaOH. Curve " + S.s1.cur + " is highlighted in blue; the probe is at " + fx(S.s1.probe, 2) + " mL, pH " + fx(TM.pH(id, 0.18, S.s1.probe), 2) + ".";
    p1.draw(sc);
  };
  MV.drag(p1, { axis:"x", step:{ x:0.5, y:0.5 }, big:0.1,
    handles:function(){ var id = S1MAP[S.s1.cur]; return [{ id:"pr1", x:S.s1.probe, y:TM.pH(id, 0.18, S.s1.probe), label:"Probe on curve " + S.s1.cur + " at " + fx(S.s1.probe, 2) + " mL, pH " + fx(TM.pH(id, 0.18, S.s1.probe), 2) + ". Arrow keys move it 0.5 mL; Shift and an arrow key, 0.05 mL." }]; },
    snap:function(x){ return [clamp(Math.round(x * 20) / 20, 0, 40), 0]; },
    move:function(id, x){ S.s1.probe = r2(x); api.save(); paint1(); } });
  function paint1(){
    var id = S1MAP[S.s1.cur];
    $(".wt-s1pr", host).innerHTML = "<strong>Curve " + S.s1.cur + "</strong> at " + fx(S.s1.probe, 2) + " mL: pH " + fx(TM.pH(id, 0.18, S.s1.probe), 2) + muted(" (drag the black dot, or focus it and use the arrow keys)");
    $(".wt-s1fb", host).innerHTML = fb1;
    p1.render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.k === "s1chk") {
      var miss = ["1", "2", "3", "4"].filter(function(k){ return S.s1.pick[k] !== S1MAP[k]; });
      if (["1", "2", "3", "4"].some(function(k){ return !S.s1.pick[k]; })) fb1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Match every curve to an acid first.");
      else if (!miss.length) fb1 = MV.fbHTML("good", "<strong>✓ Correct.</strong> Curve 1 benzoic (4.20), curve 2 hypochlorous (7.52), curve 3 methanoic (3.74), curve 4 ethanoic (4.74): the pH at 12.5 mL is " + PKA + ".");
      else fb1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Check curve" + (miss.length > 1 ? "s " : " ") + miss.join(", ") + ": read the pH at 12.5 mL (half-equivalence) and match it to the " + PKA + " list.");
      S.s1.done = !miss.length; api.save(); paint1(); MV.focusFb($(".wt-s1fb", host)); return;
    }
    if (b.dataset.s2) { check2(b.dataset.s2); return; }
    if (b.dataset.k === "s3zoom") { S.s3.zoom = !S.s3.zoom; api.save(); paint3(); return; }
    if (b.dataset.k === "s3chk") { check3(); }
  });
  // Station 2
  var S2 = [
    { id:"a", label:"Diluted concentration of ethanoic acid", unit:"mol/L", ans:0.0800, tol:0.0006,
      good:NI + "(NaOH) = 0.100 × 20.0 = 2.00 mmol = " + NI + "(CH₃COOH); 2.00 mmol ÷ 25.0 mL = 0.0800 mol/L.",
      wrong:[[0.125, "Volumes inverted: divide the amount by the vinegar portion’s volume, 25.0 mL."], [2, "That’s the amount (2.00 mmol). Divide by 25.0 mL."], [0.8, "That’s the original vinegar. First find the diluted portion’s concentration."]],
      gen:"Find " + NI + "(NaOH) = 0.100 mol/L × 20.0 mL, then divide by 25.0 mL." },
    { id:"b", label:"Original vinegar concentration", unit:"mol/L", ans:0.800, tol:0.005,
      good:"10.0 mL was diluted to 100.0 mL, a factor of 10: 0.0800 × 10 = 0.800 mol/L.",
      wrong:[[0.08, "The titration gives the diluted concentration. Multiply by the dilution factor to get the original."], [8, "×10, not ×100."], [0.008, "Multiply by the dilution factor; don’t divide."]],
      gen:"The dilution factor is 100.0 mL ÷ 10.0 mL = 10." },
    { id:"c", label:"Mass of ethanoic acid per litre of vinegar", unit:"g/L", ans:0.8 * MW_ETH, tol:1.2,
      good:"0.800 mol/L × " + fx(MW_ETH, 2) + " g/mol ≈ 48 g/L, about 4.8% (mass per volume). " + C.s2.compare,
      wrong:[[4.8, "That’s the percentage (mass per volume). The mass per litre is 10 times larger."], [4.8048, "That’s the percentage (mass per volume). The mass per litre is 10 times larger."]],
      gen:"Multiply mol/L by the molar mass of CH₃COOH, " + fx(MW_ETH, 2) + " g/mol." }
  ];
  function paint2(){
    MV.keepFocus($(".wt-s2", host), function(){
      $(".wt-s2", host).innerHTML = S2.map(function(st, i){
        var x = S.s2[st.id] || {};
        return '<div class="q" data-s2q="' + st.id + '"><div class="numrow"><label for="wt-s2' + st.id + '">' + (i + 1) + ". " + st.label + ':</label><input class="numin" id="wt-s2' + st.id + '" data-s2in="' + st.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val || "") + '"' + (x.ok ? " disabled" : "") + '><span class="m">' + st.unit + "</span></div>" +
          (x.ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + st.good) : '<div class="q-actions"><button type="button" class="btn primary sm" data-s2="' + st.id + '" data-k="s2' + st.id + '">Check</button></div>' + (fb2[st.id] || "")) + "</div>";
      }).join("");
    });
  }
  $(".wt-s2", host).addEventListener("input", function(e){ var id = e.target.dataset.s2in; if (!id) return; (S.s2[id] = S.s2[id] || {}).val = e.target.value; api.save(); });
  $(".wt-s2", host).addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset.s2in) { e.preventDefault(); check2(e.target.dataset.s2in); } });
  function check2(id){
    var st = S2.filter(function(q){ return q.id === id; })[0], x = S.s2[id] = S.s2[id] || {}, v = MV.parseNum(x.val || "");
    v = v && v.length === 1 ? v[0] : null;
    if (v === null) fb2[id] = MV.fbHTML("bad", "Type a number, such as 0.25.");
    else if (Math.abs(v - st.ans) <= st.tol) { x.ok = true; fb2[id] = ""; }
    else { var w = st.wrong.filter(function(p){ return Math.abs(v - p[0]) <= Math.abs(p[0]) * 0.01 + 1e-9; })[0]; fb2[id] = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (w ? w[1] : st.gen)); }
    api.save(); paint2(); MV.focusFb($('[data-s2q="' + id + '"]', host));
  }
  // Station 3
  var p3 = new MV.Plot($("#wt-s3c"), VIEW40);
  var kRG = radios($(".wt-s3k", host), { aria:"Kb of NH3", cls:"chips", options:[{ id:"a", t:"1.8 × 10<sup>−5</sup>" }, { id:"b", t:"5.6 × 10<sup>−10</sup>" }, { id:"c", t:"1.8 × 10<sup>−9</sup>" }, { id:"d", t:"4.7 × 10<sup>−5</sup>" }], value:S.s3.k || "", onChange:function(v){ S.s3.k = v; fb3 = ""; api.save(); paint3(); } });
  var ia = $(".wt-s3a", host), ib = $(".wt-s3b", host); ia.value = S.s3.a || ""; ib.value = S.s3.b || "";
  ia.addEventListener("input", function(){ S.s3.a = ia.value; api.save(); }); ib.addEventListener("input", function(){ S.s3.b = ib.value; api.save(); });
  p3.render = function(){
    var sc = baseScene(VIEW40);
    sc.curves.push({ f:function(v){ return TM.pH("ammonia", 0.18, v); }, domain:[0, 40], color:css("--pen"), width:3.2 });
    sc.points.push({ x:S.s3.probe, y:TM.pH("ammonia", 0.18, S.s3.probe), r:6, color:css("--ink") });
    sc.describe = "Titration curve of 25.0 mL of 0.18 mol/L ammonia with 0.18 mol/L HCl, falling from pH 11.26 through a buffer region to a drop at 25.0 mL. Probe at " + fx(S.s3.probe, 2) + " mL, pH " + fx(TM.pH("ammonia", 0.18, S.s3.probe), 2) + ".";
    p3.draw(sc);
  };
  MV.drag(p3, { axis:"x", step:{ x:0.5, y:0.5 }, big:0.1,
    handles:function(){ return [{ id:"pr3", x:S.s3.probe, y:TM.pH("ammonia", 0.18, S.s3.probe), label:"Probe on the ammonia curve at " + fx(S.s3.probe, 2) + " mL, pH " + fx(TM.pH("ammonia", 0.18, S.s3.probe), 2) + ". Arrow keys move it 0.5 mL; Shift and an arrow key, 0.05 mL." }]; },
    snap:function(x){ return [clamp(Math.round(x * 20) / 20, 0, 40), 0]; },
    move:function(id, x){ S.s3.probe = r2(x); api.save(); paint3(); } });
  function paint3(){
    var o = TM.calc("ammonia", 0.18, S.s3.probe), nEx = Math.max(0, o.nT - NA);
    $(".wt-s3pr", host).innerHTML = "<strong>Probe</strong> " + fx(S.s3.probe, 2) + " mL: pH " + fx(o.pH, 2) + " · " + NI + "(NH₃) " + fx(o.nBase, 2) + " mmol · " + NI + "(NH₄⁺) " + fx(o.nAcid, 2) + " mmol" + muted(" (drag the black dot, or focus it and use the arrow keys)");
    var zb = $(".wt-zoombox", host), zbtn = $(".wt-zoom", host);
    zb.hidden = !S.s3.zoom; zbtn.setAttribute("aria-pressed", S.s3.zoom ? "true" : "false"); zbtn.textContent = S.s3.zoom ? "Hide the particles" : "Zoom to the particles";
    if (S.s3.zoom) {
      var P = particlesSVG(o.nBase, o.nAcid, nEx), svg = $(".wt-psvg", host);
      svg.innerHTML = P.svg;
      var eq = P.b === P.bh && P.ex === 0;
      svg.setAttribute("aria-label", "Particle view at " + fx(S.s3.probe, 2) + " mL: " + P.b + " NH₃, " + P.bh + " NH₄⁺" + (P.ex ? ", " + P.ex + " H₃O⁺" : "") + (eq ? ". Equal numbers of NH₃ and NH₄⁺." : "."));
      $(".wt-plg", host).innerHTML = "Teal: NH₃ (base form). Ink outline: NH₄⁺ (acid form)." + (P.ex ? " Magenta: excess H₃O⁺." : "") + " " + P.b + " NH₃ and " + P.bh + " NH₄⁺" + (eq ? ": equal numbers." : ".");
    }
    $(".wt-s3fb", host).innerHTML = fb3;
    p3.render();
  }
  var S3M3 = "At half-equivalence [B] = [BH⁺], so pH = " + PKA + "(BH⁺) = 14.00 − " + PKB + ".";
  function judge3(){
    var a = MV.parseNum(S.s3.a || ""), bb = MV.parseNum(S.s3.b || ""), k = S.s3.k;
    a = a && a.length === 1 ? a[0] : null; bb = bb && bb.length === 1 ? bb[0] : null;
    var bad = [];
    if (a === null || Math.abs(a - 9.26) > 0.02) bad.push(a !== null && Math.abs(a - 4.74) <= 0.02 ? "4.74 is " + PKB + ". " + S3M3 : "Read the probe at 12.5 mL: that pH is " + PKA + " of NH₄⁺.");
    if (bb === null || Math.abs(bb - 4.74) > 0.02) bad.push(bb !== null && Math.abs(bb - 9.26) <= 0.02 ? "9.26 is " + PKA + " of NH₄⁺; " + PKB + " = 14.00 − 9.26." : PKB + " = 14.00 − 9.26.");
    if (k !== "a") bad.push(k === "b" ? "5.6 × 10<sup>−10</sup> is " + KA + " of NH₄⁺. " + KB + " = 10<sup>−" + PKB + "</sup>." : KB + " = 10<sup>−" + PKB + "</sup> = 10<sup>−4.74</sup>.");
    S.s3.done = !bad.length;
    fb3 = bad.length ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + bad.join(" ")) : MV.fbHTML("good", "<strong>✓ Correct.</strong> pH at half-equivalence = " + PKA + " of NH₄⁺ = 9.26, so " + PKB + " of NH₃ = 14.00 − 9.26 = 4.74 and " + KB + " = 1.8 × 10<sup>−5</sup>.");
  }
  function check3(){ judge3(); api.save(); paint3(); MV.focusFb($(".wt-s3fill", host)); }
  if (S.s1.done) fb1 = MV.fbHTML("good", "<strong>✓ Correct.</strong> All four curves are matched.");
  if (S.s3.done) judge3();
  paint1(); paint2(); paint3();
  kRG.paint();
}

// @component N8 tapCurve — tap a point or region on a plotted curve (pointer, or keyboard slider + Tap here); per-item judge
// with named wrong states, three-level help, first-try scoring. Used here on the ethanoic acid curve.
function tapAct(host, api, a){
  var S = api.S; S.items = S.items || {}; S.cur = clamp(S.cur | 0, 0, a.items.length - 1); S.cx = typeof S.cx === "number" ? S.cx : 20;
  var msg = "", lastTap = null;
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null, x:null }); }
  var ACC = { t1:[12, 13], t2:[24.5, 25.5], t3:[3, 22], t4:[0, 0.5], t5:[25.5, 40], t6:[24.5, 25.5] };
  function judge(id, x){
    var r = ACC[id], ok = x >= r[0] - 1e-9 && x <= r[1] + 1e-9;
    if (ok) return { ok:true };
    if (id === "t1" && Math.abs(x - 25) <= 0.5) return { ok:false, fb:"Half-equivalence, not equivalence." };
    if (id === "t3" && x > 25) return { ok:false, fb:"Past equivalence there’s no HA left to buffer." };
    return { ok:false, fb:"Which species are in the flask at that volume?" };
  }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="wt-tap"><div class="wt-tapq" aria-live="polite"></div>' +
    '<div class="plot-wrap"><canvas class="plot wide wt-tapc" role="img" aria-label="Ethanoic acid titration curve"></canvas></div>' +
    '<div class="wt-tapkb"><label for="wt-tapr">Cursor</label><input type="range" id="wt-tapr" min="0" max="40" step="0.5" value="' + S.cx + '"><output class="wt-tapo" for="wt-tapr"></output><button type="button" class="btn primary sm" data-act="tap" data-k="taphere">Tap here</button></div>' +
    '<ol class="wt-taplist"></ol></div>';
  var cv = $(".wt-tapc", host), plot = new MV.Plot(cv, VIEW40), rng = $("#wt-tapr", host);
  plot.render = function(){
    var it = a.items[S.cur], x = ist(it.id), sc = baseScene(VIEW40);
    if (x.solved) { var r = ACC[it.id]; sc.bands.push({ x0:r[0], x1:r[1], color:css("--hi-soft"), alpha:0.8 }); }
    sc.curves.push({ f:function(v){ return TM.pH("ethanoic", 0.18, v); }, domain:[0, 40], color:css("--pen"), width:3.2 });
    sc.segments.push({ x1:S.cx, y1:-1, x2:S.cx, y2:14.5, color:css("--ink-2"), width:1.2, dash:[3, 4] });
    if (lastTap != null) sc.points.push({ x:lastTap, y:TM.pH("ethanoic", 0.18, lastTap), r:6, color:x.solved ? css("--green") : css("--red") });
    sc.describe = "Titration curve of 25.0 mL of 0.18 mol/L ethanoic acid with 0.18 mol/L NaOH, from 0 to 40 mL: starts at pH 2.74, flat buffer region, jump at 25.0 mL to about 12.5. Cursor at " + fx(S.cx, 1) + " mL.";
    plot.draw(sc);
  };
  function paint(){
    var it = a.items[S.cur], x = ist(it.id), hints = [a.hints[0], a.hints[1], it.region];
    MV.keepFocus(host, function(){
      var h = '<div class="q"><div class="q-head"><span class="qn" aria-hidden="true">' + (S.cur + 1) + '</span><div class="q-prompt">' + it.prompt + ' <span class="tiny muted">(item ' + (S.cur + 1) + " of " + a.items.length + ")</span></div></div>";
      if (!x.solved) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (x.x != null ? " (" + fx(x.x, 1) + " mL)" : "") + ".</strong> " + it.region + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg + " Try again.");
      if (x.solved && S.cur < a.items.length - 1) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="next" data-k="tapnext">Next item</button></div>';
      $(".wt-tapq", host).innerHTML = h;
      $(".wt-taplist", host).innerHTML = a.items.map(function(q, i){ var y = ist(q.id); return '<li><button type="button" class="btn ghost sm' + (i === S.cur ? " on" : "") + '" data-go="' + i + '" data-k="tapgo' + i + '"' + (i === S.cur ? ' aria-current="true"' : "") + ">" + (i + 1) + ". " + (y.solved ? "✓ " : "") + MV.plain(q.prompt) + "</button></li>"; }).join("");
    });
    $(".wt-tapo", host).textContent = fx(S.cx, 1) + " mL";
    $('[data-act="tap"]', host).disabled = x.solved;
    plot.render();
  }
  function tap(v){
    var it = a.items[S.cur], x = ist(it.id); if (x.solved) return;
    v = clamp(Math.round(v * 10) / 10, 0, 40); lastTap = v;
    var r = judge(it.id, v);
    if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.x = v; msg = ""; } else { x.tries++; msg = r.fb + " (You tapped " + fx(v, 1) + " mL.)"; }
    api.save(); paint(); MV.focusFb($(".wt-tapq", host));
  }
  cv.addEventListener("click", function(e){ var rc = cv.getBoundingClientRect(); var v = plot.xOf(e.clientX - rc.left); if (v < -0.5 || v > 40.5) return; S.cx = clamp(Math.round(v * 2) / 2, 0, 40); rng.value = S.cx; tap(v); });
  rng.addEventListener("input", function(){ S.cx = +rng.value; api.save(); $(".wt-tapo", host).textContent = fx(S.cx, 1) + " mL"; plot.render(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.cur], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "tap") { tap(S.cx); return; }
    if (b.dataset.act === "next") { S.cur = Math.min(a.items.length - 1, S.cur + 1); msg = ""; lastTap = null; api.save(); paint(); var q = $(".wt-tapq .q-prompt", host); if (q) { q.setAttribute("tabindex", "-1"); q.focus({ preventScroll:true }); } return; }
    if (b.dataset.go != null) { S.cur = +b.dataset.go; msg = ""; lastTap = ist(a.items[S.cur].id).x; api.save(); paint(); }
  });
  lastTap = ist(a.items[S.cur].id).x;
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Pick the acid and indicator ----------
var task = (function(){
  var S = null, api = null, plot = null;
  var TA = ["methanoic", "ethanoic", "benzoic", "hypochlorous"];
  function read(){ return S ? { acid:S.acid || "", ct:S.ct || "", ind:S.ind || "" } : { acid:"", ct:"", ind:"" }; }
  function info(d){
    var ct = ctV(d.ct), veq = NA / ct, eq = TM.pH(d.acid, ct, veq), jump = TM.pH(d.acid, ct, veq + 0.5) - TM.pH(d.acid, ct, veq - 0.5);
    return { ct:ct, veq:veq, eq:eq, jump:jump };
  }
  function paint(){
    var d = read(), rd = $("#wt-tkread");
    if (!d.acid || !d.ct) { rd.innerHTML = MV.readoutHTML([["Your titration", muted("choose an acid and a NaOH concentration")]]); plot.render(); return; }
    var I = info(d), ind = indOf(d.ind);
    rd.innerHTML = MV.readoutHTML([["Equivalence volume", fx(I.veq, 1) + " mL"], ["Equivalence pH", fx(I.eq, 2)], ["Jump (0.50 mL either side)", fx(I.jump, 1) + " pH units"], ["Indicator range", ind ? ind.nm + ": " + fx(ind.lo, 1) + "–" + fx(ind.hi, 1) : muted("choose an indicator")]]);
    plot.render();
  }
  function render(inp, pv, a){
    api = a; S = a.S;
    inp.innerHTML = '<div class="wt-tk"><div class="wt-tka"></div><div class="wt-tkb"></div><div class="wt-tkc"></div></div>';
    pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="wt-tkc" role="img" aria-label="Your titration curve"></canvas></div><dl class="read" id="wt-tkread" aria-live="polite"></dl>';
    plot = new MV.Plot($("#wt-tkc"), VIEW);
    plot.render = function(){
      var d = read(), sc = baseScene(VIEW), font = "600 12px " + (css("--font-ui") || "sans-serif");
      var ind = indOf(d.ind);
      if (ind) sc.after = function(ctx, p){ var y1 = p.Y(ind.hi), y2 = p.Y(ind.lo); ctx.save(); ctx.globalAlpha = 0.7; ctx.fillStyle = css("--hi-soft"); ctx.fillRect(0, y1, p.W, y2 - y1); ctx.restore(); ctx.save(); ctx.font = font; ctx.fillStyle = css("--ink-2"); ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(ind.nm + " " + fx(ind.lo, 1) + "–" + fx(ind.hi, 1), p.W - 6, y1 - 2); ctx.restore(); };
      if (d.acid && d.ct) {
        var I = info(d), ct = I.ct;
        sc.curves.push({ f:function(v){ return TM.pH(d.acid, ct, v); }, domain:[0, 50], color:css("--pen"), width:3.2 });
        if (I.veq <= 50) {
          var lo = TM.pH(d.acid, ct, I.veq - 0.5), hi = TM.pH(d.acid, ct, Math.min(50, I.veq + 0.5)), xj = Math.min(I.veq + 2.5, 49);
          sc.segments.push({ x1:xj, y1:lo, x2:xj, y2:hi, color:css("--ink"), width:2, arrow:"both" });
          sc.labels.push({ x:xj, y:(lo + hi) / 2, dx:8, text:"jump " + fx(I.jump, 1), color:css("--ink"), font:font, bg:true });
          sc.points.push({ x:I.veq, y:I.eq, r:5.5, color:css("--ink"), label:"eq. pH " + fx(I.eq, 2) });
        }
        sc.describe = "Titration curve of 25.0 mL of 0.18 mol/L " + SP[d.acid].nm + " with " + fx(ct, ct < 0.1 ? 3 : 2) + " mol/L NaOH. Equivalence at " + fx(I.veq, 1) + " mL, pH " + fx(I.eq, 2) + "; the jump from 0.50 mL before to 0.50 mL after is " + fx(I.jump, 1) + " pH units." + (ind ? " Shaded band: " + ind.nm + " range " + fx(ind.lo, 1) + " to " + fx(ind.hi, 1) + "." : "");
      } else sc.describe = "Empty graph: choose an acid and a NaOH concentration to see the curve.";
      plot.draw(sc);
    };
    function rg(sel, key, label, opts){ radios($(sel, inp), { label:label, aria:label, cls:"chips", options:opts, value:S[key] || "", onChange:function(v){ S[key] = v; api.save(); paint(); api.update(); } }); }
    rg(".wt-tka", "acid", "Acid", TA.map(function(id){ return { id:id, t:SP[id].nm }; }));
    rg(".wt-tkb", "ct", "NaOH", CTS);
    rg(".wt-tkc", "ind", "Indicator", IND.map(function(d){ return { id:d.id, t:d.nm }; }));
    paint();
  }
  function label(k){ var p = k.split("|"); return SP[p[0]].nm + ", " + p[1] + " mol/L NaOH, " + p[2]; }
  return {
    render:render, read:read,
    valid:function(d){ return (d.acid && d.ct && d.ind) ? true : "Choose an acid, a NaOH concentration and an indicator."; },
    checks:function(d){
      if (!d.acid || !d.ct || !d.ind) return [false, false, false];
      var I = info(d), ind = indOf(d.ind);
      return [I.veq >= 15 - 1e-9 && I.veq <= 30 + 1e-9, !!ind && I.eq >= ind.lo && I.eq <= ind.hi, I.jump >= 3.0];
    },
    key:function(d){ return d.acid + "|" + d.ct + "|" + d.ind; }, label:label, text:label
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ tap:tapAct },
  task:task
});
})();
