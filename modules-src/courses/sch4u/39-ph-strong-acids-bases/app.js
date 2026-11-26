// SCH4U 39 pH of Strong Acids and Bases: hero (pH ladder: the marker slides from pH 1 to 13 while log-axis H₃O⁺ and OH⁻
// bars trade decades), pH ladder (Explore: Ladder / Dilute / Mix modes, readout, Mix beaker), pH in daily life (Part 3:
// pH strip, blood slider, acid-lake data, antacid model), Calculate it (custom pH, concentration and volume entry) and
// Mix to a target (task: two volume chip rows; live beaker and checklist).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var KW = MV.chem.data["const"].Kw;     // 1.0 × 10⁻¹⁴ at 25 °C (course table C13)
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function r2(v){ return Math.round(v * 100) / 100; }
function esc(s){ return MV.esc(s); }
function fx(v, dp){ return MV.chem.fx(v, dp); }
function sci(v){ return MV.chem.sci(v); }                       // HTML: 2.0 × 10<sup>−3</sup>
function F(s){ return MV.chem.f(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function LIN(t){ return t; }
var SUP = { "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻" };
function supU(n){ return String(n).split("").map(function(c){ return SUP[c] || c; }).join(""); }
function sciU(v){                                                 // plain Unicode: 2.0 × 10⁻³ (SVG text, aria)
  if (v === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = v / Math.pow(10, e);
  if (fx(m, 1) === "10.0") { m = 1; e++; }
  return fx(m, 1) + " × 10" + supU(e);
}
function dec2(v){ return v >= 0.001 ? Number(v).toPrecision(2) : sciU(v); }   // 2 significant digits: 0.020
function vol(v){ return fx(v, 1) + " mL"; }
function near(a, b){ return Math.abs(a - b) <= Math.abs(b) * 1e-6; }

// ---------- strong acid / base chemistry ----------
// Formula concentration c, n H₃O⁺ or OH⁻ per formula. Below 10⁻⁶ mol/L water's own ions are included exactly:
// [ion] = x/2 + √(x²/4 + Kw). pH and pOH are rounded to 2 decimal places and always add to 14.00.
function solve(acid, n, c){
  var x = n * c, water = x < 1e-6, ion = water ? x / 2 + Math.sqrt(x * x / 4 + KW) : x;
  var p = r2(-Math.log10(ion)), q = r2(14 - p);
  return acid ? { acid:true, h:ion, oh:KW / ion, pH:p, pOH:q, water:water, x:x } : { acid:false, oh:ion, h:KW / ion, pOH:p, pH:q, water:water, x:x };
}
// 0.10 mol/L HCl (va mL) + 0.10 mol/L NaOH (vb mL); moles in mol.
function mixOf(va, vb){
  var nA = va * 1e-4, nB = vb * 1e-4, V = va + vb, d = va - vb, r = { va:va, vb:vb, nA:nA, nB:nB, V:V };
  if (d === 0) { r.ex = 0; r.c = 0; r.s = { acid:true, h:1e-7, oh:1e-7, pH:7, pOH:7 }; }
  else { r.ex = Math.abs(d) * 1e-4; r.c = Math.abs(d) * 0.10 / V; r.s = solve(d > 0, 1, r.c); }
  return r;
}
function mixLine(r){
  return "H₃O⁺ " + sci(r.nA) + " mol, OH⁻ " + sci(r.nB) + " mol → " +
    (r.ex ? "excess " + (r.va > r.vb ? "H₃O⁺ " : "OH⁻ ") + sci(r.ex) + " mol in " + vol(r.V) + " = " + dec2(r.c) + " mol/L, " + (r.va > r.vb ? "" : "pOH " + fx(r.s.pOH, 2) + ", ") + "pH " + fx(r.s.pH, 2)
      : "they neutralize exactly in " + vol(r.V) + ": pH 7.00");
}

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

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + Math.round(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){
  o = o || {};
  return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.fs || 12) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + s + "</text>";
}
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function rect(x, y, w, h, fill, o){ o = o || {}; return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(Math.max(0, w)) + '" height="' + r1(Math.max(0, h)) + '" rx="' + (o.rx || 0) + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" fill="' + (fill || "none") + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }

// ---------- pH ladder (viewBox 400 × 408) ----------
// @component pHLadder — vertical pH ladder (0 at the top, 14 at the bottom, --ink ticks) with a marker, beside H₃O⁺ (magenta)
// and OH⁻ (cerulean) bars on a shared log axis (10⁰ … 10⁻¹⁴ mol/L): a bar's top sits at its ion's −log, so the H₃O⁺ bar
// top lines up with the pH and the OH⁻ bar top with the pOH. Extras: ghost mark (+ dashed ghost bar), span label, neutral label.
// ladderSVG({ph, hide, vals:{h, oh}, ghost:{ph, t, bar}, span:{a, b, t}, neutral}) -> SVG inner string
var LY0 = 40, LK = 24, XL = 66, XA = 196, XH = 222, XO = 312, BW = 62;
function ly(p){ return LY0 + LK * clamp(p, 0, 14); }
var YB = ly(14);
function ladderSVG(o){
  var s = tx(XL, 22, "pH", { fs:14, w:700 }) + tx(XH + 76, 22, "mol/L (log scale)", { fs:12, c:"var(--ink-2)" });
  for (var d = 0; d <= 14; d++) {
    s += ln(XA, ly(d), 392, ly(d), { w:1, c:"var(--rule)" });
    if (d % 2 === 0) s += tx(XA - 5, ly(d) + 4, "10" + supU(-d), { fs:11, a:"end", c:"var(--ink-2)" });
  }
  s += ln(XA, ly(0), XA, YB, { w:1.4, c:"var(--ink-2)" });
  s += ln(XL, ly(0), XL, YB, { w:2 });
  for (var p = 0; p <= 14; p++) {
    s += ln(XL - 6, ly(p), XL + 6, ly(p), { w:p === 7 ? 2.4 : 1.4 });
    s += tx(XL - 12, ly(p) + 4.5, String(p), { fs:13, a:"end", c:p === 7 ? "var(--ink)" : "var(--ink-2)", w:p === 7 ? 700 : 0 });
  }
  s += tx(XH + BW / 2, YB + 22, "H₃O⁺", { fs:13, w:700 }) + tx(XO + BW / 2, YB + 22, "OH⁻", { fs:13, w:700 });
  var g = o.ghost;
  if (g) {
    var gy = ly(g.ph);
    if (g.bar) s += rect(XH, gy, BW, YB - gy, "none", { s:"var(--ab-h3o)", sw:1.6, d:"5 4" });
    s += '<path d="M' + (XL + 8) + " " + gy + " L" + (XL + 20) + " " + (gy - 8) + " L" + (XL + 20) + " " + (gy + 8) + 'Z" fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="3 2"/>';
    s += tx(XL + 24, gy + 4.5, g.t, { fs:12, a:"start", c:"var(--ink-2)", w:700 });
  }
  if (o.hide || o.ph == null) return s + tx(XH + 76, ly(7) + 5, "Predict first", { fs:14, c:"var(--ink-2)", w:700 });
  var pH = clamp(o.ph, 0, 14), yH = ly(pH), yO = ly(14 - pH);
  s += rect(XH, yH, BW, YB - yH, "var(--ab-h3o)", { op:0.9 }) + rect(XO, yO, BW, YB - yO, "var(--ab-oh)", { op:0.9 });
  var neu = o.neutral && Math.abs(pH - 7) < 0.005;
  if (neu) s += tx(XH + 76, ly(7) - 10, "neutral: both 1.0 × 10⁻⁷ mol/L", { fs:12, w:700 });
  else if (o.vals) s += tx(XH + BW / 2, yH - 6, o.vals.h, { fs:11, w:700 }) + tx(XO + BW / 2, yO - 6, o.vals.oh, { fs:11, w:700 });
  if (o.span) s += tx(XH + BW / 2, (ly(o.span.a) + ly(o.span.b)) / 2 + 5, o.span.t, { fs:15, w:700 });
  s += '<path d="M' + (XL + 8) + " " + r1(yH) + " L" + (XL + 20) + " " + r1(yH - 8) + " L" + (XL + 20) + " " + r1(yH + 8) + 'Z" fill="var(--ink)"/>';
  s += rect(XL + 22, yH - 12, 76, 24, "var(--sheet)", { s:"var(--ink)", sw:1.6, rx:6 }) + tx(XL + 60, yH + 5, "pH " + fx(pH, 2), { fs:13, w:700 });
  s += ln(XA, yH, XH, yH, { w:1.2, c:"var(--ink-2)", d:"4 4" });
  return s;
}
function ladderAria(o){
  var t = "pH ladder from 0 at the top to 14 at the bottom, beside H₃O⁺ and OH⁻ bars on a log axis from 1 to 10⁻¹⁴ mol/L. ";
  if (o.hide || o.ph == null) return t + "Values hidden until you predict.";
  t += "Marker at pH " + fx(o.ph, 2) + ". ";
  if (o.vals) t += "[H₃O⁺] = " + o.vals.h + " mol/L, [OH⁻] = " + o.vals.oh + " mol/L.";
  if (o.ghost) t += " Dashed mark at " + o.ghost.t + ".";
  return t;
}

// @component mixBeaker — strong acid + strong base mixing: a beaker whose liquid level shows the total volume (0–100 mL) and a
// mole tally (one dot = 1.0 × 10⁻³ mol): H₃O⁺ dots (magenta, +) above OH⁻ dots (cerulean, −); neutralized pairs fade with
// "H₂O" between them; the excess stays solid and ringed. beakerSVG(mixOf(va, vb)) -> SVG inner string (viewBox 400 × 214)
function beakerSVG(r){
  var s = "", nA = r.va / 10, nB = r.vb / 10, k = Math.min(nA, nB), bx0 = 20, bx1 = 118, yb = 186, sc = 1.5, yl = yb - r.V * sc, yA = 62, yB = 126;
  s += rect(bx0 + 2, yl, bx1 - bx0 - 4, yb - yl - 1, "var(--hi-soft)");
  s += '<path d="M' + bx0 + " 26 L" + bx0 + " " + yb + " L" + bx1 + " " + yb + " L" + bx1 + ' 26" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>';
  for (var m = 20; m <= 100; m += 20) { var y = yb - m * sc; s += ln(bx1 - 10, y, bx1, y, { w:1.2, c:"var(--ink-2)" }) + tx(bx1 + 4, y + 4, String(m), { fs:10, a:"start", c:"var(--ink-2)" }); }
  s += tx((bx0 + bx1) / 2, yb + 20, vol(r.V) + " total", { fs:12, w:700 });
  s += tx(160, 22, "Each dot = 1.0 × 10⁻³ mol", { fs:11, a:"start", c:"var(--ink-2)" });
  s += tx(160, yA + 5, "H₃O⁺", { fs:13, a:"start", w:700 }) + tx(160, yB + 5, "OH⁻", { fs:13, a:"start", w:700 });
  function dot(i, y, fill, sign, paired){ var cx = 226 + i * 34; return circ(cx, y, 11, fill, { op:paired ? 0.3 : 1, s:paired ? null : "var(--ink)", sw:2 }) + tx(cx, y + 5, sign, { fs:15, w:700, c:"var(--sheet)", op:paired ? 0.6 : 1 }); }
  for (var i = 0; i < nA; i++) s += dot(i, yA, "var(--ab-h3o)", "+", i < k);
  for (i = 0; i < nB; i++) s += dot(i, yB, "var(--ab-oh)", "−", i < k);
  for (i = 0; i < k; i++) { var cx = 226 + i * 34, mid = (yA + yB) / 2; s += ln(cx, yA + 13, cx, mid - 10, { w:1.3, c:"var(--ink-2)", d:"3 3" }) + ln(cx, mid + 8, cx, yB - 13, { w:1.3, c:"var(--ink-2)", d:"3 3" }) + tx(cx, mid + 4, "H₂O", { fs:10, c:"var(--ink-2)" }); }
  if (r.ex) {
    s += tx(160, 168, "Excess " + (r.va > r.vb ? "H₃O⁺" : "OH⁻") + ": " + sciU(r.ex) + " mol", { fs:13, a:"start", w:700 });
    s += tx(160, 190, "÷ " + fx(r.V / 1000, 4) + " L = " + dec2(r.c) + " mol/L → pH " + fx(r.s.pH, 2), { fs:12, a:"start" });
  } else s += tx(160, 168, "No excess: they neutralize exactly", { fs:13, a:"start", w:700 }) + tx(160, 190, "pH 7.00", { fs:12, a:"start" });
  return s;
}
function beakerAria(r){ return "Beaker with " + MV.plain(vol(r.V)) + " in total. H₃O⁺: " + r.va / 10 + " dots, OH⁻: " + r.vb / 10 + " dots, each 1.0 × 10⁻³ mol. " + MV.plain(mixLine(r)) + "."; }

// ---------- hero ----------
function hero(f){
  var svg = $("#ph-hx-svg"), ctr = $("#ph-hx-ctr"), rep = $("#ph-hx-replay"), cap = f.cap, run = 0;
  if (!svg) return;
  function draw(ph){ svg.innerHTML = ladderSVG({ ph:ph, neutral:true }); }
  function final(){ draw(7); ctr.innerHTML = "Neutral at pH 7.00: [H₃O⁺] = [OH⁻] = 1.0 × 10⁻⁷ mol/L."; if (cap) cap.textContent = "Every step on the ladder is a factor of 10, and pH + pOH = 14.00 at every step."; rep.hidden = false; }
  function play(){
    var id = ++run; rep.hidden = true; if (cap) cap.textContent = ""; draw(1);
    ctr.textContent = "Each step down the ladder: [H₃O⁺] ÷ 10 and [OH⁻] × 10.";
    function ok(){ return id === run; }
    MV.wait(700, function(){ if (!ok()) return;
      MV.tween({ dur:3000, ease:LIN, step:function(t){ if (ok()) draw(1 + 6 * t); }, done:function(){ if (!ok()) return;
        ctr.textContent = "pH 7: the bars match. Neutral water has both ions at 1.0 × 10⁻⁷ mol/L.";
        MV.wait(1600, function(){ if (!ok()) return;
          ctr.textContent = "Past 7, OH⁻ takes over: the solution is basic.";
          MV.tween({ dur:3000, ease:LIN, step:function(t){ if (ok()) draw(7 + 6 * t); }, done:function(){ if (!ok()) return; MV.wait(1200, function(){ if (ok()) final(); }); } });
        });
      } });
    });
  }
  rep.addEventListener("click", play);
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: pH ladder ----------
function explore(host, api){
  var S = api.S, C = api.content, SP = {}, POW = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  C.species.forEach(function(x){ SP[x.id] = x; });
  if (["lad", "dil", "mix"].indexOf(S.mode) < 0) S.mode = "lad";
  if (!SP[S.sp]) S.sp = "HCl";
  if (C.mantissas.indexOf(+S.m) < 0) S.m = 1; else S.m = +S.m;
  S.vd = !!S.vd; S.e = clamp(Math.round(+S.e || 2), 1, S.vd ? 9 : 6);
  S.k = clamp(Math.round(+S.k || 0), 0, 8);
  if (C.vols.indexOf(+S.va) < 0) S.va = 30; else S.va = +S.va;
  if (C.vols.indexOf(+S.vb) < 0) S.vb = 10; else S.vb = +S.vb;
  var busy = false, locked = false, tw = null, disp = null, hide = false, ghost = null, span = null, note = "", seq = 0;

  host.innerHTML = '<p class="how ph-how">' + C.how + '</p><div class="ph-modes"></div><div class="ph-grid">' +
    '<div class="ph-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="ph-box"><svg class="ph-svg" id="ph-lad" viewBox="0 0 400 408" role="img" aria-label=""></svg></div>' +
      '<div class="ph-box ph-bkbox" hidden><svg class="ph-svg" id="ph-bk" viewBox="0 0 400 214" role="img" aria-label=""></svg></div>' +
      '<p class="ph-cap" aria-live="polite"></p></div>' +
    '<div class="ph-side"><div class="ph-c" data-for="sol"><div class="ph-sp"></div><div class="ph-man"></div><div class="ph-pow"></div><div class="ph-vdrow"></div></div>' +
      '<div class="ph-c" data-for="dil"><div class="ph-dilrow"></div></div>' +
      '<div class="ph-c" data-for="mix"><div class="ph-va"></div><div class="ph-vb"></div><p class="tiny muted">' + C.mixNote + "</p></div>" +
      '<dl class="read ph-read" aria-live="polite"></dl></div></div><div class="ph-tabs"></div>';
  var svg = $("#ph-lad"), bk = $("#ph-bk"), bkBox = $(".ph-bkbox", host), dilRow = $(".ph-dilrow", host), vdRow = $(".ph-vdrow", host);
  MV.chem.tablePanel($(".ph-tabs", host), "const", { title:"Course data table: constants (" + "K<sub>w</sub>" + ")" });

  // ----- state -----
  function conc(){ return S.m * Math.pow(10, -(S.e + (S.mode === "dil" ? S.k : 0))); }
  function cur(){ var sp = SP[S.sp]; return solve(!!sp.acid, sp.n, conc()); }
  function prevPH(){ var sp = SP[S.sp]; return solve(!!sp.acid, sp.n, S.m * Math.pow(10, -(S.e + S.k - 1))).pH; }
  function touch(){ cancelAnim(); hide = false; ghost = null; span = null; note = ""; }

  // ----- controls -----
  var RG = {};
  RG.mode = radios($(".ph-modes", host), { label:"Mode", aria:"Ladder mode", options:C.modes, value:S.mode, onChange:function(v){ touch(); S.mode = v; api.save(); paint(); } });
  RG.sp = radios($(".ph-sp", host), { label:"Species", cls:"chips", aria:"Strong acid or base", options:C.species.map(function(x){ return { id:x.id, t:F(x.f) }; }), value:S.sp,
    onChange:function(v){ touch(); S.sp = v; S.k = 0; api.save(); paint(); } });
  RG.m = radios($(".ph-man", host), { label:"Concentration", cls:"chips", aria:"Concentration: number before the power of 10", options:C.mantissas.map(function(m){ return { id:String(m), t:fx(m, 1) + " ×" }; }), value:String(S.m),
    onChange:function(v){ touch(); S.m = +v; S.k = 0; api.save(); paint(); } });
  RG.e = radios($(".ph-pow", host), { label:"Power of 10 (mol/L)", cls:"chips", aria:"Concentration: power of 10, in mol per litre", options:POW.map(function(e){ return { id:String(e), t:"10<sup>−" + e + "</sup>" }; }), value:String(S.e),
    disabled:function(id){ return +id > 6 && !S.vd ? "locked" : ""; }, onChange:function(v){ touch(); S.e = +v; S.k = 0; api.save(); paint(); } });
  RG.va = radios($(".ph-va", host), { label:"0.10 mol/L HCl", cls:"chips", aria:"Volume of 0.10 mol/L HCl", options:C.vols.map(function(v){ return { id:String(v), t:vol(v) }; }), value:String(S.va),
    onChange:function(v){ touch(); S.va = +v; api.save(); paint(); } });
  RG.vb = radios($(".ph-vb", host), { label:"0.10 mol/L NaOH", cls:"chips", aria:"Volume of 0.10 mol/L NaOH", options:C.vols.map(function(v){ return { id:String(v), t:vol(v) }; }), value:String(S.vb),
    onChange:function(v){ touch(); S.vb = +v; api.save(); paint(); } });
  function syncRG(){ RG.mode.set(S.mode); RG.sp.set(S.sp); RG.m.set(String(S.m)); RG.e.paint(); RG.e.set(String(S.e)); RG.va.set(String(S.va)); RG.vb.set(String(S.vb)); }
  function lock(b){ locked = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paintCtl(); }
  function paintCtl(){
    var dis = locked || busy ? " disabled" : "";
    MV.keepFocus(vdRow, function(){
      vdRow.innerHTML = '<button type="button" class="btn ghost sm ph-vd" data-act="vd" data-k="vd" aria-pressed="' + S.vd + '"' + dis + ">" + (S.vd ? "✓ " : "") + "Very dilute view</button>" +
        '<span class="tiny muted">' + (S.vd ? "Powers 10<sup>−7</sup> to 10<sup>−9</sup> are unlocked." : "Unlocks 10<sup>−7</sup> to 10<sup>−9</sup> mol/L.") + "</span>";
    });
    MV.keepFocus(dilRow, function(){
      dilRow.innerHTML = '<button type="button" class="btn primary sm" data-act="dil" data-k="dil"' + (dis || S.k >= 8 ? " disabled" : "") + ">×10 dilution</button>" +
        '<button type="button" class="btn ghost sm" data-act="reset" data-k="dreset"' + (dis || !S.k ? " disabled" : "") + ">Reset</button>" +
        '<span class="tiny muted">Dilutions: ' + S.k + " of 8" + (S.k ? " (concentration ÷ " + (S.k > 3 ? "10" + supU(S.k) : String(Math.pow(10, S.k))) + ")" : "") + "</span>";
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked || busy || !host.contains(b)) return;
    var a = b.dataset.act;
    if (a === "vd") { touch(); S.vd = !S.vd; if (!S.vd && S.e > 6) { S.e = 6; S.k = 0; } RG.e.paint(); RG.e.set(String(S.e)); api.save(); paint(); }
    else if (a === "dil" && S.k < 8) {
      touch(); var from = cur().pH; S.k++; api.save(); var to = cur().pH;
      busy = true; paintCtl(); animate(from, to, 700, function(){ busy = false; paint(); });
    } else if (a === "reset") { touch(); S.k = 0; api.save(); paint(); }
  });

  // ----- animation -----
  function cancelAnim(){ seq++; if (tw) { tw(); tw = null; } disp = null; busy = false; }
  function animate(a, b, dur, cb){
    seq++; var my = seq; if (tw) { tw(); tw = null; }
    disp = a; draw();
    tw = MV.tween({ dur:dur, step:function(t){ if (my !== seq) return; disp = a + (b - a) * t; draw(); }, done:function(){ if (my !== seq) return; tw = null; disp = null; draw(); if (cb) cb(); } });
  }

  // ----- drawing -----
  function scene(){
    var o = { hide:hide, ghost:ghost, span:span };
    if (hide) return o;
    if (S.mode === "mix") { var r = mixOf(S.va, S.vb); o.ph = disp != null ? disp : r.s.pH; if (disp == null) o.vals = { h:sciU(r.s.h), oh:sciU(r.s.oh) }; return o; }
    var s = cur(); o.ph = disp != null ? disp : s.pH; if (disp == null) o.vals = { h:sciU(s.h), oh:sciU(s.oh) };
    return o;
  }
  function draw(){
    var o = scene(); svg.innerHTML = ladderSVG(o); svg.setAttribute("aria-label", ladderAria(o));
    var mx = S.mode === "mix"; bkBox.hidden = !mx;
    if (mx) { var r = mixOf(S.va, S.vb); bk.innerHTML = beakerSVG(r); bk.setAttribute("aria-label", beakerAria(r)); }
  }
  function paintRead(){
    var rows, Q = muted("?");
    if (S.mode === "mix") {
      var r = mixOf(S.va, S.vb);
      rows = [["Reaction", F("H3O+ + OH- -> 2H2O")], ["Mix", mixLine(r)], ["pOH / pH", fx(r.s.pOH, 2) + " / " + fx(r.s.pH, 2)],
        ["Check", "pH + pOH = 14.00; [H₃O⁺][OH⁻] = " + sci(KW)]];
    } else {
      var sp = SP[S.sp], s = cur(), c = conc();
      var hRow = ["[H₃O⁺]", hide ? Q : sci(s.h) + " mol/L" + (sp.acid ? (s.water ? muted(" (acid + water)") : "") : muted(" from <i>K</i><sub>w</sub> ÷ [OH⁻]"))];
      var oRow = ["[OH⁻]", hide ? Q : sci(s.oh) + " mol/L" + (sp.acid ? muted(" from <i>K</i><sub>w</sub> ÷ [H₃O⁺]") : (sp.n === 2 ? muted(" = 2 × " + sci(c)) : "") + (s.water ? muted(" (base + water)") : ""))];
      rows = [["Dissociation", F(sp.eq)], ["Concentration", sci(c) + " mol/L"]].concat(sp.acid ? [hRow, oRow] : [oRow, hRow]);
      rows.push(["pOH / pH", hide ? Q + " / " + Q : fx(s.pOH, 2) + " / " + fx(s.pH, 2)]);
      rows.push(["Check", "pH + pOH = 14.00; [H₃O⁺][OH⁻] = " + sci(KW)]);
      var wNote = "Water’s own H₃O⁺ now matters; pH approaches 7.00";
      if (S.mode === "dil") rows.push(["Dilution note", (S.k ? "×10 dilution: pH " + fx(prevPH(), 2) + " → " + fx(s.pH, 2) : muted("Press ×10 dilution.")) + (c < 1e-6 ? ". " + wNote + "." : "")]);
      else if (c < 1e-6 && !hide) rows.push(["Note", wNote + "."]);
    }
    $(".ph-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var t = note;
    if (!t) t = S.mode === "mix" ? "Mix moles, not pH values: excess moles ÷ total volume." : S.mode === "dil" ? "Each ×10 dilution lowers [H₃O⁺] tenfold." : "One pH unit is a factor of 10 in [H₃O⁺].";
    $(".ph-cap", host).innerHTML = t;
  }
  function paint(){
    $$(".ph-c", host).forEach(function(p){ var f = p.dataset.for; p.hidden = f === "sol" ? S.mode === "mix" : f !== S.mode; });
    draw(); paintRead(); paintCap(); paintCtl();
    MV.changed();
  }

  // ----- predictions -----
  var hooks = {
    start:function(p){
      touch();
      if (p.id === "p1") { S.mode = "dil"; S.sp = "HCl"; S.m = 1; S.e = 2; S.k = 0; }
      else if (p.id === "p2") { S.mode = "lad"; S.sp = "HCl"; S.m = 1; S.e = 3; }
      else if (p.id === "p3") { S.mode = "lad"; S.sp = "BaOH2"; S.m = 5; S.e = 3; hide = true; }
      else { S.mode = "lad"; S.vd = true; S.sp = "HCl"; S.m = 1; S.e = 8; hide = true; }
      syncRG(); api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(n){ note = n || ""; busy = false; lock(false); paint(); MV.wait(150, done); }
      busy = true; paintCtl();
      if (p.id === "p1") { var a = cur().pH; S.k = 1; api.save(); paintRead(); animate(a, cur().pH, 1200, function(){ fin("×10 dilution: pH 2.00 → 3.00. [H₃O⁺] fell from 1.0 × 10⁻² to 1.0 × 10⁻³ mol/L."); }); }
      else if (p.id === "p2") { ghost = { ph:3, t:"pH 3.00", bar:true }; S.e = 5; api.save(); RG.e.set("5"); paintRead(); animate(3, 5, 1400, function(){ span = { a:3, b:5, t:"×100" }; fin("The H₃O⁺ bars differ by two decades: 10⁻³ ÷ 10⁻⁵ = 100."); }); }
      else if (p.id === "p3") { hide = false; paintRead(); animate(7, cur().pH, 1400, function(){ fin("[OH⁻] = 2 × 5.0 × 10⁻³ = 1.0 × 10⁻² mol/L, so pOH 2.00 and pH 12.00."); }); }
      else { hide = false; ghost = { ph:8, t:"8.00 ✗" }; paintRead(); animate(7, cur().pH, 1400, function(){ fin("Ignoring water would give pH 8.00 (dashed). Water’s own 1.0 × 10⁻⁷ mol/L of H₃O⁺ keeps the pH just under 7: 6.98."); }); }
    }
  };

  // ----- challenges -----
  function chal(id){
    var c = conc(), s, nm = F(SP[S.sp].f);
    if (id === "tc1" || id === "tc2") {
      if (S.mode === "mix") return { ok:false, msg:"Use Ladder or Dilute mode for this one." };
      s = cur();
      if (id === "tc1") {
        if (!SP[S.sp].acid) return { ok:false, msg:nm + " is a base. Choose HNO₃." };
        if (S.sp !== "HNO3") return { ok:false, msg:near(c, 2e-3) ? "That’s pH 2.70, but this challenge asks for HNO₃." : "This challenge asks for HNO₃." };
        if (near(c, 2e-3)) return { ok:true };
        if (near(c, 5e-3)) return { ok:false, msg:"pH 2.30 (log 5 = 0.70)." };
        if (near(c, 3e-3)) return { ok:false, msg:"pH 2.52 (log 3 = 0.48)." };
        if (near(c, 2e-2)) return { ok:false, msg:"pH 1.70: check the power of 10." };
        return { ok:false, msg:"pH " + fx(s.pH, 2) + ". You need 2.70." };
      }
      if (SP[S.sp].acid) return { ok:false, msg:nm + " is an acid. Choose Ca(OH)₂." };
      if (S.sp !== "CaOH2") return { ok:false, msg:near(s.pOH, 2) ? "That’s pOH 2.00, but this challenge asks for Ca(OH)₂." : "This challenge asks for Ca(OH)₂." };
      if (near(c, 5e-3)) return { ok:true };
      if (near(c, 1e-2)) return { ok:false, msg:"That gives [OH⁻] = 2.0 × 10⁻² and pOH 1.70; you forgot the 2 OH⁻." };
      if (near(c, 1e-12)) return { ok:false, msg:"That’s the [H₃O⁺] you need, not the base concentration." };
      return { ok:false, msg:"pOH " + fx(s.pOH, 2) + ". You need 2.00." };
    }
    if (id === "tc3") {
      if (S.mode !== "mix") return { ok:false, msg:"Switch to Mix mode." };
      var va = S.va, vb = S.vb, r = mixOf(va, vb);
      if (va === 30 && vb === 20) return { ok:true };
      if (va === 40 && vb === 30) return { ok:false, msg:"pH 1.85: the excess is spread over 70.0 mL." };
      if (va === 20 && vb === 10) return { ok:false, msg:"pH 1.48: 1.0 × 10⁻³ mol in only 30.0 mL." };
      if (va === vb) return { ok:false, msg:"They neutralize exactly: pH 7.00." };
      if (vb > va) return { ok:false, msg:"pH " + fx(r.s.pH, 2) + ": more NaOH than HCl leaves excess OH⁻, so the mixture is basic." };
      return { ok:false, msg:"pH " + fx(r.s.pH, 2) + ". Averaging pH values doesn’t work; use moles: excess moles ÷ total volume." };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// @component phMeter (from SCH4U 06; two decimal places) — display-only pH gauge (0–14), acidic / basic bands in the H₃O⁺ and
// OH⁻ role colours with words, needle and reading.
function meterSVG(v){
  var x0 = 18, x1 = 402, X = function(p){ return x0 + (x1 - x0) * p / 14; }, s = "";
  s += '<rect x="' + x0 + '" y="30" width="' + r1(X(6.5) - x0) + '" height="18" fill="var(--ab-h3o)" fill-opacity=".22"/><rect x="' + r1(X(7.5)) + '" y="30" width="' + r1(x1 - X(7.5)) + '" height="18" fill="var(--ab-oh)" fill-opacity=".22"/>';
  s += '<rect x="' + x0 + '" y="30" width="' + (x1 - x0) + '" height="18" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>';
  for (var p = 0; p <= 14; p++) s += '<line x1="' + r1(X(p)) + '" y1="48" x2="' + r1(X(p)) + '" y2="' + (p % 7 ? 53 : 57) + '" stroke="var(--ink-2)" stroke-width="1.2"/>' + (p % 7 ? "" : '<text x="' + r1(X(p)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + p + "</text>");
  s += '<text x="' + r1(X(3.2)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">acidic</text><text x="' + r1(X(10.8)) + '" y="69" text-anchor="middle" font-size="12" fill="var(--ink)">basic</text>';
  var nx = r1(X(clamp(v, 0, 14)));
  s += '<path d="M' + nx + " 52 L" + r1(nx - 7) + " 22 L" + r1(nx + 7) + ' 22Z" fill="var(--ink)"/><text x="' + Math.max(40, nx) + '" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">pH ' + fx(v, 2) + "</text>";
  return '<svg class="ph-msvg" viewBox="0 0 420 74" role="img" aria-label="pH meter reading ' + fx(v, 2) + ' (model reading)">' + s + "</svg>";
}

// ---------- Part 3: pH in daily life ----------
function part3(host, api){
  var S = api.S, C = api.content, ST = C.strip, IT = ST.items, BL = C.blood, LK3 = C.lake, AC = C.antacid;
  function item(id){ return IT.filter(function(x){ return x.id === id; })[0]; }
  function fits(it, n){ return n > it.lo - 1 && n < it.hi + 1; }
  S.placed = S.placed && typeof S.placed === "object" ? S.placed : {};
  Object.keys(S.placed).forEach(function(k){ if (!item(k) || !fits(item(k), +S.placed[k])) delete S.placed[k]; });
  if (!item(S.sel)) S.sel = "";
  S.blood = clamp(r2(+S.blood || 7.40), 7.10, 7.40);
  S.lake = typeof S.lake === "number" && LK3.choices[S.lake] ? S.lake : -1;
  S.tabs = clamp(Math.round(+S.tabs || 0), 0, 2);
  var msg = null;

  host.innerHTML =
    '<div class="part ph-st"><h3>' + ST.title + "</h3><p>" + ST.intro + '</p><div class="ph-items" role="group" aria-label="Items to place"></div>' +
      '<div class="ph-stripwrap"><div class="ph-strip" role="group" aria-label="pH strip from 0 to 14"></div><div class="ph-ends tiny muted" aria-hidden="true"><span>← more acidic</span><span>7 neutral</span><span>more basic →</span></div></div>' +
      '<div class="ph-s1fb" aria-live="polite"></div><ul class="ph-placed"></ul><div class="q-actions"><button type="button" class="btn ghost sm" data-s1="clear" data-k="s1clr">Clear the strip</button></div></div>' +
    '<div class="part ph-st"><h3>' + BL.title + "</h3><p>" + BL.prompt + "</p>" + MV.usesHTML(BL.use) +
      '<div class="ph-bl"><label for="ph-blood">Blood pH: <strong id="ph-bloodv"></strong></label><input type="range" id="ph-blood" min="7.10" max="7.40" step="0.01" value="' + fx(S.blood, 2) + '"></div>' +
      '<div class="ph-blbars"></div><dl class="read ph-blread" aria-live="polite"></dl><p>' + BL.note + "</p></div>" +
    '<div class="part ph-st"><h3>' + LK3.title + "</h3>" + LK3.html +
      '<details class="alg ph-lake"><summary>Check it with data</summary><p class="tiny muted"><strong>Model data:</strong> one lake’s pH, measured every 10 years.</p>' +
      MV.tableHTML({ head:["Year", "Lake pH"], rows:LK3.data.map(function(d){ return [String(d[0]), fx(d[1], 1)]; }) }) +
      '<p class="ph-lq">' + LK3.q + '</p><div class="ph-lakech"></div><div class="ph-lakefb" aria-live="polite"></div></details></div>' +
    '<div class="part ph-st"><h3>' + AC.title + "</h3>" + AC.html + '<div class="ph-meter"></div>' +
      '<div class="q-actions ph-acbtns"></div><dl class="read ph-acread" aria-live="polite"></dl><p class="tiny muted">' + AC.note + "</p></div>";
  var itemsEl = $(".ph-items", host), stripEl = $(".ph-strip", host), s1fb = $(".ph-s1fb", host);

  // ----- station 1: the pH strip -----
  function paintS1(){
    MV.keepFocus(itemsEl, function(){
      itemsEl.innerHTML = IT.map(function(it){ var on = S.sel === it.id, d = S.placed[it.id] != null;
        return '<button type="button" class="chip ph-it' + (on ? " on" : "") + '" data-it="' + it.id + '" data-k="it' + it.id + '" aria-pressed="' + on + '">' + (d ? "✓ " : "") + it.t + "</button>"; }).join("");
    });
    MV.keepFocus(stripEl, function(){
      var h = "";
      for (var n = 0; n <= 14; n++) {
        var here = IT.filter(function(it){ return S.placed[it.id] === n; });
        h += '<button type="button" class="ph-cell' + (here.length ? " has" : "") + '" data-ph="' + n + '" data-k="cell' + n + '" aria-label="pH ' + n + (here.length ? ", placed here: " + here.map(function(it){ return it.t; }).join(", ") : "") + '">' + n + (here.length ? '<span class="ph-pin" aria-hidden="true">' + "●".repeat(here.length) + "</span>" : "") + "</button>";
      }
      stripEl.innerHTML = h;
    });
    s1fb.innerHTML = msg ? MV.fbHTML(msg.type, msg.html) : "";
    var done = IT.filter(function(it){ return S.placed[it.id] != null; }).sort(function(a, b){ return S.placed[a.id] - S.placed[b.id]; });
    $(".ph-placed", host).innerHTML = done.map(function(it){ return "<li><strong>pH " + S.placed[it.id] + ":</strong> " + it.t + muted(" (typical: " + it.typ + ")") + "</li>"; }).join("") +
      (done.length === IT.length ? '<li class="ph-alldone">All seven placed. From lemon juice to household ammonia, [H₃O⁺] changes by a factor of about 10⁹ to 10¹⁰.</li>' : "");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.it) { S.sel = S.sel === b.dataset.it ? "" : b.dataset.it; msg = null; api.save(); paintS1(); return; }
    if (b.dataset.ph != null) {
      var n = +b.dataset.ph, hp = "At pH " + n + ", [H₃O⁺] = " + (n ? "1 × 10<sup>−" + n + "</sup>" : "1") + " mol/L.";
      if (!S.sel) { msg = { type:"", html:"Choose an item first, then tap its place on the strip. " + hp }; paintS1(); return; }
      var it = item(S.sel);
      if (fits(it, n)) { S.placed[it.id] = n; msg = { type:"good", html:"<strong>✓ " + it.t + "</strong> sits at pH " + it.typ + ". " + hp }; S.sel = ""; }
      else msg = { type:"bad", html:"<strong>✗ Not quite.</strong> " + hp + " " + it.t + " is " + (n < it.lo ? "less acidic than that: try a higher pH." : "more acidic than that: try a lower pH.") };
      api.save(); paintS1(); MV.focusFb(s1fb); return;
    }
    if (b.dataset.s1 === "clear") { S.placed = {}; S.sel = ""; msg = null; api.save(); paintS1(); return; }
    if (b.dataset.lk != null) { S.lake = +b.dataset.lk; api.save(); paintLake(); MV.focusFb($(".ph-lakefb", host)); return; }
    if (b.dataset.ac === "add" && S.tabs < 2) { S.tabs++; api.save(); paintAc(); return; }
    if (b.dataset.ac === "reset") { S.tabs = 0; api.save(); paintAc(); }
  });

  // ----- station 2: blood -----
  var range = $("#ph-blood", host);
  function paintBlood(){
    var p = S.blood, h = Math.pow(10, -p), h0 = Math.pow(10, -7.40), f = Math.pow(10, r2(7.40 - p)), hMax = Math.pow(10, -7.10);
    $("#ph-bloodv", host).textContent = fx(p, 2);
    $(".ph-blbars", host).innerHTML = '<div class="ph-blrow"><span>pH 7.40</span><span class="ph-bltrack"><span class="ph-blbar" style="width:' + r1(100 * h0 / hMax) + '%"></span></span></div>' +
      '<div class="ph-blrow"><span>pH ' + fx(p, 2) + '</span><span class="ph-bltrack"><span class="ph-blbar" style="width:' + r1(100 * h / hMax) + '%"></span></span></div>' +
      '<p class="tiny muted">[H₃O⁺] bars on an ordinary (not log) scale.</p>';
    $(".ph-blread", host).innerHTML = MV.readoutHTML([["[H₃O⁺] at pH 7.40", sci(h0) + " mol/L"], ["[H₃O⁺] at pH " + fx(p, 2), sci(h) + " mol/L"],
      ["Factor", "10<sup>" + fx(r2(7.40 - p), 2) + "</sup> = " + fx(f, 1) + (Math.abs(p - 7.10) < 0.001 ? " (log 2 = 0.30, so 10<sup>0.30</sup> = 2)" : "")]]);
  }
  range.addEventListener("input", function(){ S.blood = clamp(r2(+range.value), 7.10, 7.40); api.save(); paintBlood(); });

  // ----- station 3: lake data -----
  function paintLake(){
    var ch = $(".ph-lakech", host);
    MV.keepFocus(ch, function(){
      ch.innerHTML = '<div class="chips" role="radiogroup" aria-label="[H₃O⁺] ratio">' + LK3.choices.map(function(c, k){ var on = S.lake === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-lk="' + k + '" data-k="lk' + k + '">' + c.t + "</button>"; }).join("") + "</div>";
    });
    var c = LK3.choices[S.lake];
    $(".ph-lakefb", host).innerHTML = c ? MV.fbHTML(MV.ok(c) ? "good" : "bad", (MV.ok(c) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + c.fb.replace(/^Right\. /, "")) : "";
  }

  // ----- station 4: antacid -----
  function paintAc(){
    var mmol = 5 - 2 * S.tabs, mol = mmol / 1000, c = mol / 0.10, p = r2(-Math.log10(c));
    $(".ph-meter", host).innerHTML = meterSVG(p);
    var bx = $(".ph-acbtns", host);
    MV.keepFocus(bx, function(){
      bx.innerHTML = '<button type="button" class="btn primary sm" data-ac="add" data-k="acadd"' + (S.tabs >= 2 ? " disabled" : "") + ">Add a tablet</button>" +
        '<button type="button" class="btn ghost sm" data-ac="reset" data-k="acrst"' + (S.tabs ? "" : " disabled") + ">Reset</button>";
    });
    $(".ph-acread", host).innerHTML = MV.readoutHTML([["Tablets", String(S.tabs)],
      ["H₃O⁺ left", S.tabs ? "0.0050 − " + S.tabs + " × 0.0020 = " + mol.toPrecision(2) + " mol" : "0.0050 mol"],
      ["[H₃O⁺]", mol.toPrecision(2) + " mol ÷ 0.10 L = " + c.toPrecision(2) + " mol/L"], ["pH", fx(p, 2)]]);
  }
  paintS1(); paintBlood(); paintLake(); paintAc();
}

// ---------- Practice 2: Calculate it (pH, concentration and volume entry; adapted from SCH4U 14's calcAct) ----------
function calcAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = {}); ["val", "m", "e"].forEach(function(k){ if (typeof x[k] !== "string") x[k] = ""; }); x.tries = x.tries || 0; x.hint = x.hint || 0; x.solved = !!x.solved; if (x.first === undefined) x.first = null; return x; }
  function box(id, k, v, dis, lab, mode){ return '<input class="numin ph-in' + (k === "e" ? " ph-exp" : "") + '" id="ci-' + id + k + '" data-cin="' + id + '" data-f="' + k + '" ' + (mode === "num" ? 'type="number" step="1"' : 'type="text" inputmode="decimal"') + ' autocomplete="off" spellcheck="false" aria-label="' + esc(lab) + '" value="' + esc(v) + '"' + dis + ">"; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "sci") h += '<div class="numrow ph-sci"><span>[H₃O⁺] =</span>' + box(it.id, "m", x.m, dis, "Number before the power of 10") + '<span>× 10</span><sup class="ph-supbox">' + box(it.id, "e", x.e, dis, "Power of 10 (exponent)", "num") + '</sup><span>mol/L</span></div>';
    else h += '<div class="numrow"><label for="ci-' + it.id + 'val">' + (it.kind === "ph" ? "pH =" : "Your answer:") + "</label>" + box(it.id, "val", x.val, dis, it.kind === "ph" ? "pH" : "Answer") + '<span class="ph-unit">' + (it.unit || "") + "</span></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function one(s){ var v = MV.parseNum(String(s || "").replace(/−/g, "-").replace(/[a-z]+/gi, "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function dps(s){ var m = String(s).trim().match(/[.,](\d*)\s*$/); return m ? m[1].length : 0; }
  function judge(it, x){
    var ans = MV.ans(it), v, w;
    if (it.kind === "sci") {
      var m = one(x.m), e = one(x.e);
      if (m == null || e == null || Math.round(e) !== e) return { bad:"Enter both the number and the power of 10 (a whole number, such as −5)." };
      v = m * Math.pow(10, e);
      if (Math.abs(v / ans - 1) <= 0.03) return { ok:true };
      w = (it.wrong || []).filter(function(z){ return Math.abs(v / z.match - 1) <= 0.03; })[0];
      return { fb:w ? w.fb : it.fb };
    }
    v = one(x.val);
    if (v == null) return { bad:it.kind === "ph" ? "Enter one pH value, such as 2.70." : "Enter one number, such as 250." };
    if (it.kind === "ph") {
      var d = dps(x.val);
      if (Math.abs(v - ans) <= 0.01 + 1e-9) return d === 2 ? { ok:true } : { bad:"Right value, but write pH with two decimal places: digits after the decimal in pH = significant digits in the concentration." };
      if (d < 2 && Math.abs(v - r1(ans)) < 1e-9) return { bad:"Close. Give the pH to two decimal places: digits after the decimal in pH = significant digits in the concentration." };
    } else if (Math.abs(v - ans) <= (it.tol || 0) + 1e-9) return { ok:true };
    w = (it.wrong || []).filter(function(z){ return Math.abs(v - z.match) <= 0.005; })[0];
    return { fb:w ? w.fb : it.fb };
  }
  host.addEventListener("input", function(e){ var t = e.target, id = t.dataset && t.dataset.cin; if (!id) return; ist(id)[t.dataset.f] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = host.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = { t:r.bad, soft:true }; paint(); MV.focusFb(host.querySelector('[data-ci="' + it.id + '"]')); return; }
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

// ---------- Performance task: Mix to a target ----------
var task = (function(){
  var S = null, api = null, VOLS = [10, 20, 30, 40, 50], RA = null, RB = null;
  function ok(v){ return VOLS.indexOf(+v) >= 0 ? +v : null; }
  function read(){ return { va:S ? ok(S.va) : null, vb:S ? ok(S.vb) : null }; }
  function paint(){
    var d = read(), pv = $("#ph-tbk"), rd = $("#ph-tread"); if (!pv) return;
    if (d.va == null || d.vb == null) {
      pv.innerHTML = tx(200, 108, "Choose both volumes", { fs:14, c:"var(--ink-2)", w:700 }); pv.setAttribute("aria-label", "No mixture yet: choose both volumes.");
      rd.innerHTML = MV.readoutHTML([["Mixture", muted("choose both volumes")]]); return;
    }
    var r = mixOf(d.va, d.vb);
    pv.innerHTML = beakerSVG(r); pv.setAttribute("aria-label", beakerAria(r));
    rd.innerHTML = MV.readoutHTML([["Moles", "H₃O⁺ " + sci(r.nA) + " mol, OH⁻ " + sci(r.nB) + " mol"], ["Excess", r.ex ? (r.va > r.vb ? "H₃O⁺ " : "OH⁻ ") + sci(r.ex) + " mol" : "none"],
      ["Total volume", vol(r.V)], ["pH", fx(r.s.pH, 2)]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="ph-tva"></div><div class="ph-tvb"></div><p class="tiny muted">Both solutions are 0.10 mol/L.</p>';
      pv.innerHTML = '<h4 class="ph-h4">Your mixture</h4><div class="ph-box"><svg class="ph-svg" id="ph-tbk" viewBox="0 0 400 214" role="img" aria-label=""></svg></div><dl class="read" id="ph-tread" aria-live="polite"></dl>';
      var opts = VOLS.map(function(v){ return { id:String(v), t:vol(v) }; });
      RA = radios($(".ph-tva", inp), { label:"0.10 mol/L HCl", cls:"chips", aria:"Volume of HCl", options:opts, value:ok(S.va) == null ? "" : String(S.va), onChange:function(v){ S.va = +v; api.save(); paint(); api.update(); } });
      RB = radios($(".ph-tvb", inp), { label:"0.10 mol/L NaOH", cls:"chips", aria:"Volume of NaOH", options:opts, value:ok(S.vb) == null ? "" : String(S.vb), onChange:function(v){ S.vb = +v; api.save(); paint(); api.update(); } });
      paint();
    },
    read:read,
    valid:function(d){ return d.va != null && d.vb != null ? true : "Choose a volume of HCl and a volume of NaOH."; },
    checks:function(d){ var r = mixOf(d.va, d.vb), acid = d.va > d.vb; return [acid, acid && r.s.pH >= 1.40 && r.s.pH <= 2.00, r.V >= 60]; },
    key:function(d){ return d.va + "/" + d.vb; },
    label:function(k){ var p = k.split("/"); return "HCl " + vol(+p[0]) + " + NaOH " + vol(+p[1]); },
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
