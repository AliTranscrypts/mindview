// SCH4U 37 Solubility Equilibrium (Ksp): hero (ions leave and return to a CaF₂ solid until the rates match), Saturated
// solution simulator (Explore: beaker with cation/anion dots and a patterned solid, Q/Ksp bar, C7 ICE rows, Dissolve / Mix /
// Common-ion modes, C13 Ksp table), Solubility in the real world (Part 3: kidney stones, kettle scale, hydroxide
// precipitation, barium meals), "Precipitate or not?" (scientific-notation entry + chips), "Just a little precipitate" task.
(function(){
"use strict";
var $ = MV.$, F = MV.chem.f, D = MV.chem.data;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function hl(t){ return '<strong class="ks-hl">' + t + "</strong>"; }
function LIN(t){ return t; }
var KS = "<i>K</i><sub>sp</sub>", QI = "<i>Q</i>", SI = "<i>s</i>";
var M6 = KS + " is unchanged. The extra ion shifts the equilibrium left, so less salt dissolves.";

// ---------- numbers: 2.1 × 10⁻⁴ (Unicode, to match the content text) ----------
var SUPD = { "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻" };
function sup(n){ return String(n).replace(/[0-9-]/g, function(c){ return SUPD[c]; }); }
function sx(v, dp){
  if (!v) return "0"; dp = dp == null ? 1 : dp;
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), f = Math.pow(10, dp), m = Math.round(v / Math.pow(10, e) * f * (1 + 1e-9)) / f;
  if (m >= 10) { m /= 10; e++; }
  if (e >= 0 && e <= 2) return MV.num(Math.round(v * 10) / 10, 1);
  return m.toFixed(dp) + " × 10" + sup(e);
}
function near(v, w, tol){ return Math.abs(v - w) <= Math.abs(w) * (tol || 0.02); }

// ---------- course data (MV.chem.data.Ksp) and the plan's model salts ----------
function kspOf(f){ var r = D.Ksp.filter(function(x){ return x[0] === f; })[0]; return r ? r[1] : null; }
// use: "Use these values" root for s (hand-checked: √1.8 = 1.342, √50 = 7.071, √1.1 = 1.049, ∛8.75 = 2.061, ∛2450 = 13.48, ∛1.4 = 1.119)
var SALTS = {
  AgCl:{ f:"AgCl", c:"Ag+", n:"Cl-", b:1, k:kspOf("AgCl"), use:"√1.8 ≈ 1.34" },
  AgBr:{ f:"AgBr", c:"Ag+", n:"Br-", b:1, k:kspOf("AgBr"), use:"√50 ≈ 7.07" },
  BaSO4:{ f:"BaSO4", c:"Ba^2+", n:"SO4^2-", b:1, k:kspOf("BaSO4"), use:"√1.1 ≈ 1.05" },
  CaF2:{ f:"CaF2", c:"Ca^2+", n:"F-", b:2, k:kspOf("CaF2"), use:"∛8.75 ≈ 2.06" },
  PbI2:{ f:"PbI2", c:"Pb^2+", n:"I-", b:2, k:kspOf("PbI2"), use:"∛2450 ≈ 13.5" },
  MgOH2:{ f:"Mg(OH)2", c:"Mg^2+", n:"OH-", b:2, k:kspOf("Mg(OH)2"), use:"∛1.4 ≈ 1.12" },
  // model salts (plan values, labelled "model"; roots are exact)
  MA:{ f:"MA", c:"M+", n:"A-", b:1, k:1.0e-10, model:true },
  MB2:{ f:"MB2", c:"M^2+", n:"B-", b:2, k:4.0e-12, model:true },
  MX2:{ f:"MX2", c:"M^2+", n:"X-", b:2, k:3.2e-11, model:true }
};
var SALT_IDS = ["AgCl", "AgBr", "BaSO4", "CaF2", "PbI2", "MgOH2", "MA", "MB2", "MX2"];
var K_OX = kspOf("CaC2O4"), K_CO3 = kspOf("CaCO3"), KW = D["const"].Kw;
function sOf(x){ return Math.pow(x.k / Math.pow(x.b, x.b), 1 / (1 + x.b)); }
// molar solubility with c mol/L of the common anion already present: s(bs + c)^b = Ksp
function sCommon(x, c){
  if (c <= 0) return sOf(x);
  if (x.b === 1) return (-c + Math.sqrt(c * c + 4 * x.k)) / 2;
  var lo = 0, hi = sOf(x);
  for (var i = 0; i < 80; i++) { var m = (lo + hi) / 2; if (m * Math.pow(x.b * m + c, x.b) > x.k) hi = m; else lo = m; }
  return (lo + hi) / 2;
}
function ion(t){ return "[" + F(t) + "]"; }
function exprHTML(x){ return ion(x.c) + ion(x.n) + (x.b > 1 ? "<sup>" + x.b + "</sup>" : ""); }
function eqHTML(x){ return F(x.f + "(s) <=> " + x.c + "(aq) + " + (x.b > 1 ? x.b : "") + x.n + "(aq)"); }
function kTxt(x){ return sx(x.k) + (x.model ? " (model)" : " (course table)"); }

// Mix mode solutions and the course-table salts they can form
var SOLS = [{ id:"AgNO3", ions:[["Ag+", 1], ["NO3-", 1]] }, { id:"NaCl", ions:[["Na+", 1], ["Cl-", 1]] }, { id:"Ca(NO3)2", ions:[["Ca^2+", 1], ["NO3-", 2]] },
  { id:"NaF", ions:[["Na+", 1], ["F-", 1]] }, { id:"BaCl2", ions:[["Ba^2+", 1], ["Cl-", 2]] }, { id:"Na2SO4", ions:[["Na+", 2], ["SO4^2-", 1]] }];
var PPT = ["AgCl", "CaF2", "BaSO4"];
var CONC = [1.0e-6, 1.0e-5, 2.0e-5, 4.0e-5, 1.0e-4, 2.0e-4, 4.0e-4, 6.0e-4, 8.0e-4, 1.0e-3, 2.0e-3, 5.0e-3];
var CI_ADD = { AgCl:"NaCl", CaF2:"NaF", BaSO4:"Na2SO4" };
function solOf(id){ return SOLS.filter(function(x){ return x.id === id; })[0]; }
function mixCalc(a, ca, va, b, cb, vb){
  var V = va + vb, ions = {}, order = [];
  [[solOf(a), ca, va], [solOf(b), cb, vb]].forEach(function(x){ x[0].ions.forEach(function(io){
    if (!ions[io[0]]) { ions[io[0]] = { after:0, stock:[] }; order.push(io[0]); }
    ions[io[0]].after += x[1] * io[1] * x[2] / V; ions[io[0]].stock.push(x[1] * io[1]);
  }); });
  var best = null;
  PPT.forEach(function(id){ var x = SALTS[id]; if (!ions[x.c] || !ions[x.n]) return; var Q = ions[x.c].after * Math.pow(ions[x.n].after, x.b); if (!best || Q / x.k > best.r) best = { id:id, x:x, Q:Q, r:Q / x.k }; });
  return { V:V, ions:ions, order:order, p:best };
}
function outcome(r){ return r > 1.005 ? QI + " > " + KS + ": precipitate forms" : r >= 0.995 ? QI + " = " + KS + ": saturated" : QI + " < " + KS + ": no precipitate (unsaturated)"; }

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

// ---------- N4 scientific-notation entry (number part × 10^power) ----------
function sciHTML(key, st, dis, lab){
  return '<span class="ks-sci"><input class="numin ks-man" data-sm="' + key + '" data-k="' + key + 'm" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" aria-label="' + esc(MV.plain(lab || "Answer")) + ': number part" value="' + esc(st.m || "") + '"' + (dis ? " disabled" : "") + ">" +
    '<span class="ks-x" aria-hidden="true">× 10</span><input class="numin ks-exp" data-se="' + key + '" data-k="' + key + 'e" type="number" step="1" aria-label="' + esc(MV.plain(lab || "Answer")) + ': power of ten" value="' + esc(st.e == null ? "" : st.e) + '"' + (dis ? " disabled" : "") + "></span>";
}
function sciVal(st){
  var ms = String(st.m || "").trim(), es = String(st.e == null ? "" : st.e).trim().replace(/−/g, "-");
  if (!ms) return { err:"Enter the number part and the power of ten." };
  var m = MV.parseNum(ms.replace(/\s/g, ""));
  if (!m || m.length !== 1) return { err:"The number part should be one number, like 2.0." };
  if (es === "") return /e|10\^|×10/i.test(ms.replace(/\s/g, "")) ? { v:m[0] } : { err:"Enter the power of ten too (for 10⁻⁴, type −4)." };
  if (!/^[-+]?\d+$/.test(es)) return { err:"The power of ten should be a whole number, like −4." };
  return { v:m[0] * Math.pow(10, +es) };
}

// ---------- SVG helpers ----------
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function T(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 14) + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + s + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
var KSP_SVG = '<tspan font-style="italic">K</tspan><tspan font-size="0.7em" dy="0.35em">sp</tspan>';
function seedOrder(n, seed){ var a = [], i, x = seed * 9301 + 49297; for (i = 0; i < n; i++) a.push(i); for (i = n - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; var j = Math.floor(x / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function nDots(c){ return c > 0 ? clamp(Math.round(2 * (Math.log10(c) + 7)), 1, 14) : 0; }

// @component beakerView — a beaker of solution (SVG string, viewBox 0 0 300 250): cation dots --ec-cat with "+", anion dots
// --ec-an with "−" (letters, so colour isn't the only signal), a solid layer at the bottom in --ink-2 with a hatch pattern.
// o: {nc, na, per (anions per cation when released together), solid (px, 0–56), rel (null = all in place; 0…nc = released
// so far: unit k rises from the solid as rel passes k), seed, ret (hero: two ions sinking back to the solid)}
var hid = 0;
function beakerSVG(o){
  var id = "ksh" + (++hid), top = 58, yb = 238, sol = clamp(o.solid || 0, 0, 56), sTop = yb - sol, s = "";
  s += '<defs><pattern id="' + id + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="var(--sheet)"/><line x1="1.5" y1="0" x2="1.5" y2="7" stroke="var(--ink-2)" stroke-width="2.6"/></pattern></defs>';
  s += '<path d="M38 ' + top + " V222 Q38 240 56 240 H244 Q262 240 262 222 V" + top + ' Z" fill="var(--hi-soft)"/>' + Ln(38, top, 262, top, { c:"var(--ink-2)", w:1.5 });
  if (sol > 0.5) s += '<rect x="41" y="' + r1(sTop) + '" width="218" height="' + r1(sol) + '" rx="4" fill="url(#' + id + ')" stroke="var(--ink-2)" stroke-width="1.5"/>';
  var cols = 9, rows = 5, nS = cols * rows, ord = seedOrder(nS, o.seed || 3), y0 = top + 14, y1 = sTop - 12, dy = (y1 - y0) / rows, nc = Math.min(o.nc, 12), na = Math.min(o.na, nS - nc), dots = [];
  function slot(i, kind){ var k = ord[i % nS], c = k % cols, r = Math.floor(k / cols), jx = ((k * 37) % 11 - 5), jy = ((k * 53) % 9 - 4) * 0.6; return [56 + (c + 0.5) * (188 / cols) + jx, y0 + (r + 0.5) * dy + jy * Math.min(1, dy / 30), kind]; }
  for (var i = 0; i < nc; i++) dots.push(slot(i, 1).concat([i]));
  for (var j = 0; j < na; j++) dots.push(slot(nc + j, 0).concat([Math.floor(j / (o.per || 1))]));
  dots.forEach(function(d){
    var x = d[0], y = d[1], op = 1;
    if (o.rel != null) { var p = clamp(o.rel - d[3], 0, 1); if (p <= 0) return; var e = 1 - Math.pow(1 - p, 2); y = lerp(sTop - 8, y, e); x = lerp(150 + (x - 150) * 0.4, x, e); op = Math.min(1, p * 3); }
    s += dot(x, y, d[2], op);
  });
  if (o.ret != null) [0, 1].forEach(function(k){ var ph = (o.ret * 5 + k * 0.5) % 1; s += dot(110 + k * 86, lerp(top + 30, sTop - 8, ph), k ? 0 : 1, ph < 0.85 ? 1 : (1 - ph) / 0.15); });
  s += '<path d="M36 22 V222 Q36 242 56 242 H244 Q264 242 264 222 V22" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>';
  return s;
}
function dot(x, y, cat, op){ return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="7.5" fill="var(' + (cat ? "--ec-cat" : "--ec-an") + ')"' + opA(op) + "/>" + T(x, y + 0.5, cat ? "+" : "−", { fs:12, w:700, c:"var(--sheet)", op:op }); }

// @component qkBar — Q/Ksp bar on a log scale (±6 powers of ten around Ksp): an --ink bar for Q, a labelled Ksp tick, the
// unsaturated and precipitate sides named in words (no red/green). qbarSVG(ratio Q/Ksp, {hide}) -> svg inner (viewBox 0 0 320 86)
function qbarSVG(r, o){
  o = o || {};
  var x0 = 14, x1 = 306, xm = 160, px = (x1 - x0) / 12, L = Math.log10(r), xq = clamp(xm + L * px, x0 + 4, x1), s = "";
  s += '<rect x="' + x0 + '" y="28" width="' + (x1 - x0) + '" height="22" rx="4" fill="none" stroke="var(--rule)" stroke-width="1.5"/>';
  if (o.hide) s += T(x0 + 14, 39, "?", { fs:16, w:700 });
  else { s += '<rect x="' + x0 + '" y="30" width="' + r1(xq - x0) + '" height="18" rx="3" fill="var(--ink)"/>';
    s += T(xq < x1 - 26 ? xq + 6 : xq - 6, 39, '<tspan font-style="italic">Q</tspan>' + (Math.abs(L) > 6 ? (L > 0 ? " ≫" : " ≪") : ""), { a:xq < x1 - 26 ? "start" : "end", fs:15, w:700, c:xq < x1 - 26 ? "var(--ink)" : "var(--sheet)" }); }
  s += Ln(xm, 20, xm, 58, { w:3 }) + T(xm, 11, KSP_SVG, { fs:14, w:700 });
  s += T(xm - 8, 72, "unsaturated", { a:"end", fs:12.5, c:"var(--ink-2)" }) + T(xm + 8, 72, "precipitate forms", { a:"start", fs:12.5, c:"var(--ink-2)" });
  return s;
}
function qbarLabel(r, hide){ return "Q compared with Ksp on a scale of powers of ten. " + (hide ? "Q is hidden for now." : r > 1.005 ? "Q is " + sx(r) + " times Ksp: past the Ksp mark, a precipitate forms." : r >= 0.995 ? "Q sits exactly at the Ksp mark: saturated." : "Q is below the Ksp mark (" + sx(r) + " times Ksp): unsaturated."); }

// ---------- hero ----------
function hero(){
  var svg = $("#ks-hx-svg"), cap = $("#ks-hx-cap"), rep = $("#ks-hx-replay"); if (!svg) return;
  var run = 0, OUT = 30, CAP = ["Ions leave the solid and drift into the water: one Ca²⁺ and two F⁻ each time.", "Some ions land back on the solid. The more ions in the water, the faster they return.", "Saturated: dissolving = precipitating, so " + KS + " = [Ca²⁺][F⁻]²."];
  function gauge(y, lab, v, c){ return T(306, y, lab, { a:"start", fs:13.5, w:700 }) + '<rect x="306" y="' + (y + 12) + '" width="120" height="14" rx="3" fill="none" stroke="var(--rule)" stroke-width="1.2"/><rect x="306" y="' + (y + 12) + '" width="' + r1(120 * v / OUT) + '" height="14" rx="3" fill="' + c + '"/>' + T(306, y + 40, v + " ions per second", { a:"start", fs:13 }); }
  function draw(t){
    var f = (1 - Math.exp(-4 * t)) / (1 - Math.exp(-4)), back = Math.round(OUT * f), done = t >= 1;
    svg.innerHTML = '<g transform="translate(0 30)">' + beakerSVG({ nc:6, na:12, per:2, solid:30, rel:done ? null : f * 6, seed:7, ret:t > 0.25 && !done ? t : null }) + "</g>" +
      gauge(64, "Leaving the solid", OUT, "var(--ink)") + gauge(134, "Returning to it", back, "var(--ink-2)") +
      (back === OUT ? T(306, 214, "Equal rates:", { a:"start", fs:14, w:700 }) + T(306, 234, "saturated", { a:"start", fs:14, w:700 }) : "") + T(306, 276, "model rates", { a:"start", fs:12, c:"var(--ink-2)" });
  }
  function play(){
    var id = ++run; rep.hidden = true; draw(0); cap.innerHTML = CAP[0];
    MV.tween({ dur:6500, ease:LIN, step:function(t){ if (id !== run) return; draw(t); if (t > 0.3) cap.innerHTML = CAP[1]; }, done:function(){ if (id !== run) return; draw(1); cap.innerHTML = CAP[2]; rep.hidden = false; } });
  }
  if (MV.reduceMotion) { draw(1); cap.innerHTML = CAP[2]; }
  else { rep.addEventListener("click", play); play(); }
}

// ---------- Explore: Saturated solution simulator ----------
// @component C7 iceRows — ICE rows for a salt dissolving in water (I, C, E; the solid has no concentration entry)
function iceHTML(x, hideN){
  var b = x.b > 1 ? x.b : "", q = hideN ? "?" : null;
  return MV.tableHTML({ head:["", F(x.f + "(s)"), F(x.c), F(x.n)], rows:[["I (mol/L)", "—", "0", "0"], ["C (mol/L)", "—", "+" + SI, q || "+" + b + SI], ["E (mol/L)", "—", SI, q || b + SI]],
    caption:"ICE rows: the solid has no concentration entry" });
}
function explore(host, api){
  var S = api.S, C = api.content;
  if (["dis", "mix", "ci"].indexOf(S.mode) < 0) S.mode = "dis";
  if (!SALTS[S.salt]) S.salt = "CaF2";
  if (S.cmp !== "none" && !SALTS[S.cmp]) S.cmp = "none";
  if (!solOf(S.a)) S.a = "AgNO3"; if (!solOf(S.b)) S.b = "NaCl";
  function ci(v, d){ v = Math.round(+v); return v >= 0 && v < CONC.length ? v : d; }
  function vol(v){ v = Math.round(+v / 10) * 10; return v >= 10 && v <= 90 ? v : 50; }
  S.ca = ci(S.ca, 10); S.cb = ci(S.cb, 10); S.va = vol(S.va); S.vb = vol(S.vb);
  if (!CI_ADD[S.cis]) S.cis = "AgCl";
  S.ck = clamp(Math.round(+S.ck || 0), 0, 50);
  if (["same", "lower", "higher"].indexOf(S.kc) < 0) S.kc = "";
  S.t1 = S.t1 && typeof S.t1 === "object" ? S.t1 : { m:"", e:"" };
  var busy = false, tw = null, hide = {}, flash = "", note = "", rel = null, solidT = 1, cOv = null, kcMsg = "";

  host.innerHTML = '<p class="how ks-how">' + C.how + '</p><div class="ks-modes"></div>' +
    '<div class="ks-grid"><div class="ks-left"><div class="ks-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ks-bks"><figure class="ks-bk"><svg class="ks-svg" data-bk="1" viewBox="0 0 300 250" role="img" aria-label=""></svg><figcaption class="ks-fc" data-fc="1"></figcaption></figure>' +
    '<figure class="ks-bk" data-bk2 hidden><svg class="ks-svg" data-bk="2" viewBox="0 0 300 250" role="img" aria-label=""></svg><figcaption class="ks-fc" data-fc="2"></figcaption></figure></div>' +
    '<p class="ks-legend"><span class="ks-key cat" aria-hidden="true">+</span> cation <span class="ks-key an" aria-hidden="true">−</span> anion <span class="ks-key sol" aria-hidden="true"></span> solid · dots aren’t to scale</p>' +
    '<div class="ks-qb"><svg class="ks-qsvg" viewBox="0 0 320 86" role="img" aria-label=""></svg></div><p class="ks-cap" aria-live="polite"></p></div></div>' +
    '<div class="ks-right"><div class="ks-ctrl">' +
      '<div class="ks-dis"><div class="ks-salt"></div><div class="ks-cmp"></div><div class="ks-tc1"><p class="ks-lab">Your molar solubility for MX₂ (challenge 1)</p><div class="ks-entry">' + SI + " = " + sciHTML("t1", S.t1, false, "Molar solubility of MX2") + " mol/L</div></div></div>" +
      '<div class="ks-mix"><div class="ks-solbox"><p class="ks-lab">Solution 1</p><div class="ks-sa"></div><div class="ks-ca"></div><div class="ks-va"></div></div>' +
        '<div class="ks-solbox"><p class="ks-lab">Solution 2</p><div class="ks-sb"></div><div class="ks-cb"></div><div class="ks-vb"></div></div></div>' +
      '<div class="ks-ci"><div class="ks-cis"></div><div class="ks-ck"></div><p class="ks-add tiny"></p><div class="ks-kc"></div><p class="ks-msg" aria-live="polite"></p></div>' +
    '</div><dl class="read ks-read" aria-live="polite"></dl><div class="ks-ice"></div><div class="ks-tab"></div></div></div>';
  MV.chem.tablePanel($(".ks-tab", host), "ksp");
  var svg1 = $('[data-bk="1"]', host), svg2 = $('[data-bk="2"]', host), qsvg = $(".ks-qsvg", host);
  var saltOpts = SALT_IDS.map(function(id){ return { id:id, t:F(SALTS[id].f) + (SALTS[id].model ? " (model)" : "") }; });
  var modeRG = radios($(".ks-modes", host), { label:"Mode", aria:"Simulator mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; reset(); } });
  var saltRG = radios($(".ks-salt", host), { label:"Salt", aria:"Salt", cls:"chips", options:saltOpts, value:S.salt, onChange:function(v){ S.salt = v; reset(); } });
  var cmpRG = radios($(".ks-cmp", host), { label:"Compare with", aria:"Compare with", cls:"chips", options:[{ id:"none", t:"none" }].concat(saltOpts.filter(function(o){ return o.id !== "MX2"; })), value:S.cmp, onChange:function(v){ S.cmp = v; reset(); } });
  var solOpts = SOLS.map(function(x){ return { id:x.id, t:F(x.id) }; }), concOpts = CONC.map(function(c, i){ return { id:String(i), t:sx(c) }; });
  var saRG = radios($(".ks-sa", host), { aria:"Solution 1", cls:"chips", options:solOpts, value:S.a, onChange:function(v){ S.a = v; reset(); } });
  var caRG = radios($(".ks-ca", host), { label:"mol/L", aria:"Solution 1 concentration in mol/L", cls:"chips ks-conc", options:concOpts, value:String(S.ca), onChange:function(v){ S.ca = +v; reset(); } });
  var sbRG = radios($(".ks-sb", host), { aria:"Solution 2", cls:"chips", options:solOpts, value:S.b, onChange:function(v){ S.b = v; reset(); } });
  var cbRG = radios($(".ks-cb", host), { label:"mol/L", aria:"Solution 2 concentration in mol/L", cls:"chips ks-conc", options:concOpts, value:String(S.cb), onChange:function(v){ S.cb = +v; reset(); } });
  function vfmt(v){ return MV.num(v, 1) + " mL"; }
  var vaSl = MV.sliders($(".ks-va", host), [{ id:"ksva", label:"Volume", min:10, max:90, step:10, value:S.va, fmt:vfmt }], function(id, v){ S.va = v; reset(); });
  var vbSl = MV.sliders($(".ks-vb", host), [{ id:"ksvb", label:"Volume", min:10, max:90, step:10, value:S.vb, fmt:vfmt }], function(id, v){ S.vb = v; reset(); });
  var cisRG = radios($(".ks-cis", host), { label:"Salt", aria:"Salt for the common-ion test", cls:"chips", options:["AgCl", "CaF2", "BaSO4"].map(function(id){ return { id:id, t:F(id) }; }), value:S.cis, onChange:function(v){ S.cis = v; S.kc = ""; kcRG.set(""); kcMsg = ""; reset(); } });
  var ckSl = MV.sliders($(".ks-ck", host), [{ id:"ksck", label:"Added salt (common ion)", min:0, max:0.1, step:0.002, value:S.ck * 0.002, fmt:function(v){ return MV.num(Math.round(v / 0.002) * 0.002, 3) + " mol/L"; } }],
    function(id, v){ S.ck = clamp(Math.round(v / 0.002), 0, 50); reset(); });
  var kcRG = radios($(".ks-kc", host), { label:"Your call: " + KS + " with the added salt is", aria:"Your call: Ksp with the added salt", cls:"chips", options:[{ id:"same", t:"unchanged" }, { id:"lower", t:"smaller" }, { id:"higher", t:"larger" }], value:S.kc,
    onChange:function(v){ S.kc = v; kcMsg = v === "same" ? "✓ Right: " + KS + " changes only with temperature. Only " + SI + " changes." : "✗ Look at the readout: " + KS + " stays " + sx(SALTS[S.cis].k) + ". " + M6; api.save(); paint(); } });

  function lock(b){
    [modeRG, saltRG, cmpRG, saRG, caRG, sbRG, cbRG, cisRG, kcRG].forEach(function(r){ r.lock(b); });
    ["sl-ksva", "sl-ksvb", "sl-ksck"].forEach(function(id){ var el = document.getElementById(id); if (el) el.disabled = b; });
    Array.prototype.forEach.call(host.querySelectorAll(".ks-tc1 input"), function(el){ el.disabled = b; });
  }
  function cNow(){ return cOv != null ? cOv : S.ck * 0.002; }
  // scene for the current mode
  function scene(){
    var x, sc = { rows:[] }, R = sc.rows;
    if (S.mode === "dis") {
      x = SALTS[S.salt]; var s = sOf(x), b = x.b, hideS = S.salt === "MX2";
      sc.bk = { nc:clamp(Math.round(2 * (Math.log10(s) + 7)), 1, 8), per:b, solid:34, rel:rel, seed:5 }; sc.bk.na = sc.bk.nc * b;
      sc.fc = F(x.f) + (x.model ? " (model)" : "") + ": saturated, with excess solid";
      sc.r = 1;
      R.push(["Equation", eqHTML(x)], [KS + " expression", exprHTML(x) + ' <span class="ks-gone">' + F(x.f + "(s)") + ": left out</span>"], [KS, kTxt(x)]);
      var sTxt = hideS ? muted("? Work it out, then enter it below") : (flash === "s" ? hl(sx(s) + " mol/L") : "<strong>" + sx(s) + " mol/L</strong>") + muted(" (" + SI + " = " + (b > 1 ? "∛(" + KS + " ÷ 4)" : "√" + KS) + (x.use ? "; use " + x.use : "") + ")");
      R.push(["Molar solubility " + SI, sTxt]);
      var ions = hide.ions ? ion(x.c) + " = " + SI + " · " + ion(x.n) + " = ?" : hideS ? ion(x.c) + " = " + SI + " · " + ion(x.n) + " = " + (b > 1 ? b : "") + SI
        : ion(x.c) + " = " + SI + " = " + sx(s) + " · " + ion(x.n) + " = " + (b > 1 ? b : "") + SI + " = " + sx(b * s) + " mol/L";
      R.push(["Ion concentrations", flash === "ions" ? hl(ions) : ions]);
      if (S.cmp !== "none" && S.cmp !== S.salt) {
        var y = SALTS[S.cmp], sy = sOf(y), big = sy > s ? y : x;
        sc.bk2 = { nc:clamp(Math.round(2 * (Math.log10(sy) + 7)), 1, 8), per:y.b, solid:34, seed:9 }; sc.bk2.na = sc.bk2.nc * y.b;
        sc.fc2 = F(y.f) + (y.model ? " (model)" : "") + ": saturated";
        var cmp = hideS ? muted("enter MX₂’s " + SI + " first") : F(x.f) + " " + sx(s) + " · " + F(y.f) + " " + sx(sy) + " mol/L: " + F(big.f) + " dissolves more";
        R.push(["Compare " + SI, hide.cmp ? "?" : flash === "cmp" ? hl(cmp) : cmp], ["Compare " + KS, F(x.f) + " " + sx(x.k) + " · " + F(y.f) + " " + sx(y.k)]);
      }
      R.push([QI + " and " + KS, QI + " = " + KS + ": saturated (dissolving = precipitating)"]);
      sc.ice = iceHTML(x, hide.ions);
      sc.desc = "A beaker of saturated " + MV.plain(F(x.f)) + " solution with excess solid at the bottom. " + (rel != null ? "Ions are leaving the solid: one cation and " + b + " anion" + (b > 1 ? "s" : "") + " each time." : "Cation dots and anion dots in a 1 to " + b + " ratio.");
    } else if (S.mode === "mix") {
      var m = mixCalc(S.a, CONC[S.ca], S.va, S.b, CONC[S.cb], S.vb), p = m.p, ids = p ? [p.x.c, p.x.n] : m.order.slice(0, 4);
      var ct = p ? m.ions[p.x.c].after : m.ions[m.order[0]].after, an = p ? m.ions[p.x.n].after : m.ions[m.order[m.order.length - 1]].after;
      sc.r = p ? p.r : 1e-9; sc.noP = !p;
      sc.bk = { nc:nDots(ct), na:nDots(an), solid:p && p.r > 1.005 ? clamp(6 + 5 * Math.log10(p.r), 6, 40) * solidT : 0, seed:11 };
      sc.fc = "After mixing: " + MV.num(m.V, 1) + " mL" + (p ? "" : " (spectator ions not drawn)");
      R.push(["Mixing", F(S.a) + " " + sx(CONC[S.ca]) + " mol/L, " + MV.num(S.va, 1) + " mL + " + F(S.b) + " " + sx(CONC[S.cb]) + " mol/L, " + MV.num(S.vb, 1) + " mL = " + MV.num(m.V, 1) + " mL"]);
      R.push(["After mixing (stock)", ids.map(function(k){ var io = m.ions[k]; return ion(k) + " = " + sx(io.after) + muted(" (" + io.stock.map(function(v){ return sx(v); }).join(" and ") + ")"); }).join("<br>") + " mol/L"]);
      if (p) {
        var qt = QI + " = " + exprHTML(p.x) + " = (" + sx(m.ions[p.x.c].after) + ")(" + sx(m.ions[p.x.n].after) + ")" + (p.x.b > 1 ? "²" : "") + " = <strong>" + sx(p.Q) + "</strong>";
        R.push(["Salt that could form", F(p.x.f) + ", " + KS + " = " + kTxt(p.x)], [QI + " (after mixing)", hide.q ? "?" : flash === "q" ? hl(qt) : qt], ["Outcome", hide.q ? "?" : outcome(p.r)]);
      } else R.push(["Salt that could form", muted("none in our " + KS + " table: these ions stay dissolved")], ["Outcome", "No precipitate"]);
      sc.desc = "A beaker after mixing " + MV.plain(F(S.a)) + " and " + MV.plain(F(S.b)) + ". " + (p ? (hide.q ? "Will a solid form? Not shown yet." : p.r > 1.005 ? "A layer of " + MV.plain(F(p.x.f)) + " solid has formed at the bottom." : "No solid at the bottom.") : "No solid forms.");
    } else {
      x = SALTS[S.cis]; var c = cNow(), s0 = sOf(x), sc2 = sCommon(x, c), add = CI_ADD[S.cis];
      sc.r = 1;
      sc.bk = { nc:clamp(Math.round(2 * (Math.log10(sc2) + 7)), 1, 8), solid:30 + 16 * (1 - sc2 / s0), seed:13 };
      sc.bk.na = c > 0 ? clamp(nDots(c + x.b * sc2), sc.bk.nc * x.b, 24) : sc.bk.nc * x.b;
      sc.fc = F(x.f) + " in " + MV.num(c, 3) + " mol/L " + F(add);
      R.push(["Equation", eqHTML(x)], [KS, kTxt(x) + ": unchanged"]);
      R.push(["Added", F(add) + " " + MV.num(c, 3) + " mol/L: " + ion(x.n) + " from it = " + MV.num(c, 3) + " mol/L"]);
      var st = "<strong>" + SI + " = " + sx(sc2) + " mol/L</strong>" + (c > 0 ? " in " + MV.num(c, 3) + " mol/L " + F(add) + " (was " + sx(s0) + " in water)" : " in pure water" + (x.use ? muted(" (use " + x.use + ")") : ""));
      R.push(["Molar solubility " + SI, flash === "s" ? hl(st) : st]);
      R.push(["Ion concentrations", ion(x.c) + " = " + SI + " = " + sx(sc2) + " · " + ion(x.n) + " = " + (c > 0 ? MV.num(c, 3) + " + " + (x.b > 1 ? x.b : "") + SI + " ≈ " + MV.num(c, 3) : sx(x.b * sc2)) + " mol/L"]);
      R.push([QI + " and " + KS, QI + " = " + KS + ": saturated" + (c > 0 ? ". The extra " + F(x.n) + " pushed the equilibrium left, so solid grew." : "")]);
      $(".ks-add", host).innerHTML = "Added salt: " + F(add) + " (common ion " + F(x.n) + ")";
      sc.desc = "A beaker of saturated " + MV.plain(F(x.f)) + " with " + MV.num(c, 3) + " mol/L " + MV.plain(F(add)) + " added. " + (c > 0 ? "Few cation dots remain; the solid layer is thicker." : "");
    }
    return sc;
  }
  function draw(sc){
    sc = sc || scene();
    svg1.innerHTML = beakerSVG(sc.bk); svg1.setAttribute("aria-label", sc.desc);
    $('[data-fc="1"]', host).innerHTML = sc.fc;
    var two = !!sc.bk2, f2 = host.querySelector("[data-bk2]"); f2.hidden = !two;
    if (two) { svg2.innerHTML = beakerSVG(sc.bk2); svg2.setAttribute("aria-label", "A second beaker for comparison: saturated " + MV.plain(sc.fc2) + "."); $('[data-fc="2"]', host).innerHTML = sc.fc2; }
    host.querySelector(".ks-bks").classList.toggle("two", two);
    var hq = S.mode === "mix" && hide.q;
    qsvg.innerHTML = sc.noP ? "" : qbarSVG(sc.r, { hide:hq }); qsvg.setAttribute("aria-label", sc.noP ? "No salt from our table can form, so there is no Q to compare." : qbarLabel(sc.r, hq));
    $(".ks-qb", host).hidden = !!sc.noP;
    return sc;
  }
  function paint(){
    var md = S.mode;
    $(".ks-dis", host).hidden = md !== "dis"; $(".ks-mix", host).hidden = md !== "mix"; $(".ks-ci", host).hidden = md !== "ci";
    $(".ks-tc1", host).hidden = S.salt !== "MX2";
    var sc = draw();
    $(".ks-read", host).innerHTML = MV.readoutHTML(sc.rows);
    $(".ks-ice", host).innerHTML = md === "dis" ? sc.ice : "";
    $(".ks-msg", host).innerHTML = kcMsg;
    $(".ks-cap", host).innerHTML = note || (md === "dis" ? "Saturated: ions leave the solid as fast as they return." : md === "mix" ? "Concentrations after mixing decide " + QI + "." : "Slide the added salt: " + KS + " stays put while " + SI + " drops.");
    MV.changed();
  }
  function reset(){
    if (tw) { tw(); tw = null; }
    if (busy) { busy = false; lock(false); }
    hide = {}; flash = ""; note = ""; rel = null; solidT = 1; cOv = null; if (S.mode !== "ci") kcMsg = "";
    api.save(); paint();
  }
  function sync(){ modeRG.set(S.mode); saltRG.set(S.salt); cmpRG.set(S.cmp); saRG.set(S.a); sbRG.set(S.b); caRG.set(String(S.ca)); cbRG.set(String(S.cb)); vaSl.set("ksva", S.va); vbSl.set("ksvb", S.vb); cisRG.set(S.cis); ckSl.set("ksck", S.ck * 0.002); }
  // TC1 entry
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset) return;
    if (t.dataset.sm === "t1") S.t1.m = t.value; else if (t.dataset.se === "t1") S.t1.e = t.value; else return;
    api.save(); MV.changed();
  });

  // ---------- predictions ----------
  function anim(dur, step, end){ busy = true; lock(true); tw = MV.tween({ dur:dur, step:step, done:function(){ tw = null; busy = false; lock(false); end(); } }); }
  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; } if (busy) { busy = false; lock(false); }
      hide = {}; flash = ""; note = ""; rel = null; solidT = 1; cOv = null; kcMsg = "";
      if (p.id === "p1") { S.mode = "dis"; S.salt = "CaF2"; S.cmp = "none"; hide.ions = true; rel = 0; note = "CaF₂ is about to dissolve. Watch the dots that leave the solid."; }
      else if (p.id === "p2") { S.mode = "mix"; S.a = "AgNO3"; S.b = "NaCl"; S.ca = S.cb = 10; S.va = S.vb = 50; hide.q = true; solidT = 0; note = "Two clear solutions, about to be mixed."; }
      else if (p.id === "p3") { S.mode = "ci"; S.cis = "AgCl"; S.ck = 0; S.kc = ""; kcRG.set(""); note = "Saturated AgCl in pure water. The NaCl slider is at 0."; }
      else { S.mode = "dis"; S.salt = "AgCl"; S.cmp = "CaF2"; hide.cmp = true; note = "AgCl and CaF₂, each saturated, side by side."; }
      sync(); api.save(); paint();
    },
    run:function(p, done){
      if (p.id === "p1") {
        var nc = scene().bk.nc;
        anim(2600, function(t){ rel = t * nc; var k = Math.floor(rel + 1e-6); note = "Released so far: " + k + " Ca²⁺ and <strong>" + 2 * k + "</strong> F⁻."; draw(); $(".ks-cap", host).innerHTML = note; },
          function(){ rel = null; hide.ions = false; flash = "ions"; note = "Two teal F⁻ leave for every orange Ca²⁺: [F⁻] = 2" + SI + "."; paint(); MV.wait(200, done); });
      } else if (p.id === "p2") {
        anim(1600, function(t){ solidT = t; draw(); }, function(){ solidT = 1; hide.q = false; flash = "q"; note = "After mixing each ion is 1.0 × 10⁻³ mol/L (half the stock): " + QI + " = 1.0 × 10⁻⁶, far above " + KS + "."; paint(); MV.wait(200, done); });
      } else if (p.id === "p3") {
        anim(2200, function(t){ cOv = 0.010 * t; ckSl.set("ksck", Math.round(cOv / 0.002) * 0.002); draw(); paintRead(); },
          function(){ cOv = null; S.ck = 5; ckSl.set("ksck", 0.010); api.save(); flash = "s"; note = SI + " fell from 1.3 × 10⁻⁵ to 1.8 × 10⁻⁸ mol/L while " + KS + " stayed 1.8 × 10⁻¹⁰."; paint(); MV.wait(200, done); });
      } else {
        anim(900, function(){}, function(){ hide.cmp = false; flash = "cmp"; note = "CaF₂ has the smaller " + KS + " but the larger " + SI + ": its formula type is AB₂."; paint(); MV.wait(200, done); });
      }
    }
  };
  function paintRead(){ $(".ks-read", host).innerHTML = MV.readoutHTML(scene().rows); }

  // ---------- challenges ----------
  function chal(id){
    if (id === "tc1") {
      if (S.mode !== "dis" || S.salt !== "MX2") return { ok:false, msg:"Switch to Dissolve mode and choose the model salt MX₂, then enter its molar solubility." };
      var r = sciVal(S.t1); if (r.err) return { ok:false, msg:r.err };
      if (near(r.v, 2.0e-4, 0.01)) return { ok:true };
      if (near(r.v, 5.7e-6)) return { ok:false, msg:"That’s √" + KS + ", the rule for an AB salt." };
      if (near(r.v, 3.2e-4)) return { ok:false, msg:"That’s ∛" + KS + "; you left out the 4 from (2" + SI + ")²." };
      if (near(r.v, 8.0e-12)) return { ok:false, msg:"That’s " + KS + " ÷ 4; you still need the cube root." };
      return { ok:false, msg:"Write " + KS + " in terms of " + SI + " first: MX₂ gives one M²⁺ and two X⁻." };
    }
    if (id === "tc2") {
      if (S.mode !== "mix") return { ok:false, msg:"Switch to Mix mode." };
      var pair = [S.a, S.b].sort().join();
      if (pair !== "AgNO3,NaCl") return { ok:false, msg:"Mix AgNO₃ with NaCl." };
      if (S.va !== 50 || S.vb !== 50) return { ok:false, msg:"Set both volumes to 50.0 mL." };
      if (S.ca !== S.cb) return { ok:false, msg:"Use the <strong>same</strong> concentration chip for both solutions." };
      var c = CONC[S.ca], Q = Math.pow(c / 2, 2), k = SALTS.AgCl.k;
      if (c === 2.0e-5) return { ok:true };
      if (c === 1.0e-5) return { ok:false, msg:"No precipitate, but it isn’t the largest. Did you forget that mixing halves both concentrations?" };
      if (c === 4.0e-5) return { ok:false, msg:"After mixing " + QI + " = 4.0 × 10⁻¹⁰ > " + KS + ": a precipitate forms." };
      if (Q > k) return { ok:false, msg:"After mixing " + QI + " = " + sx(Q) + " > " + KS + ": a precipitate forms. Try a smaller chip." };
      return { ok:false, msg:"No precipitate, but it isn’t the largest. Try a bigger chip." };
    }
    if (S.mode !== "ci" || S.cis !== "AgCl") return { ok:false, msg:"Switch to Common-ion mode and choose AgCl." };
    if (S.kc === "lower" || S.kc === "higher") return { ok:false, msg:KS + " stays 1.8 × 10⁻¹⁰; only " + SI + " changes." };
    var s = sCommon(SALTS.AgCl, S.ck * 0.002);
    if (near(s, 1.0e-8)) return { ok:true };
    if (S.ck === 5) return { ok:false, msg:SI + " = 1.8 × 10⁻⁸ mol/L, not low enough." };
    if (S.ck === 50) return { ok:false, msg:SI + " = 1.8 × 10⁻⁹: you overshot." };
    return { ok:false, msg:SI + " = " + sx(s) + " mol/L: " + (s > 1.0e-8 ? "not low enough." : "you overshot.") };
  }
  reset();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Solubility in the real world ----------
var S2 = { t:[0, 2, 4, 6, 8], ca:1.0e-3, co3:[1.0e-6, 2.0e-6, 3.0e-6, 4.0e-6, 6.0e-6] };  // model data (plan: Q passes Ksp as [CO₃²⁻] rises)
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  S.drink = !!S.drink; S.so4 = !!S.so4; S.ph = [8, 9, 10].indexOf(S.ph) >= 0 ? S.ph : 10; S.st = clamp(+S.st || 0, 0, 3);
  S.heat = S.heat && typeof S.heat === "object" ? S.heat : { pick:-1, done:false };
  var f1 = S.drink ? 0.5 : 1, b1 = false, c4 = S.so4 ? 0.010 : 0, b4 = false;
  function bar(cls){ return '<div class="ks-qb"><svg class="ks-qsvg ' + cls + '" viewBox="0 0 320 86" role="img" aria-label=""></svg></div>'; }
  host.innerHTML = '<div class="part ks-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-k="ksdrink" data-s1="go">Drink more water</button></div>' + bar("ks-q1") +
    '<dl class="read ks-r1" aria-live="polite"></dl><details class="alg"><summary>Check it with data</summary><div class="ks-d1"></div></details><p class="tiny muted">' + s1.note + "</p></div>" +
    '<div class="part ks-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="ks-tbl2"></div><div class="ks-steps" role="group" aria-label="Heating steps"></div>' + bar("ks-q2") + '<div class="ks-fb2"></div><p class="tiny muted">' + s2.note + "</p></div>" +
    '<div class="part ks-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="ks-ph"></div><ol class="ks-work" aria-live="polite"></ol><div class="q-actions"><button type="button" class="btn primary sm" data-k="ksnext" data-s3="next">Next step</button></div><p class="tiny muted">' + s3.note + "</p></div>" +
    '<div class="part ks-st"><h3>' + s4.title + "</h3><p>" + s4.intro + "</p>" + MV.usesHTML(s4.use) + '<div class="q-actions"><button type="button" class="btn primary sm" data-k="ksso4" data-s4="go">Add a little sulfate</button></div><dl class="read ks-r4" aria-live="polite"></dl><p class="tiny muted">' + s4.note + "</p></div>";
  MV.chem.tablePanel(host.querySelector(".ks-st"), "ksp");

  // station 1: kidney stones
  function paint1(){
    var ca = 2.5e-3 * f1, ox = 1.0e-6 * f1, Q = ca * ox, r = Q / K_OX, q = $(".ks-q1", host);
    q.innerHTML = qbarSVG(r); q.setAttribute("aria-label", qbarLabel(r));
    $(".ks-r1", host).innerHTML = MV.readoutHTML([["Volume", f1 < 0.75 ? "doubled" : "as sampled"], ["[Ca²⁺]", sx(ca) + " mol/L"], ["[C₂O₄²⁻]", sx(ox) + " mol/L"],
      [QI + " = [Ca²⁺][C₂O₄²⁻]", "<strong>" + sx(Q) + "</strong>"], [KS + " of CaC₂O₄", sx(K_OX) + " (course table)"], ["Outcome", r > 1.005 ? QI + " > " + KS + ": crystals can form" : QI + " < " + KS + ": no crystals form"]]);
    var b = $('[data-s1="go"]', host); b.disabled = b1; b.textContent = S.drink ? "Back to the first sample" : "Drink more water";
  }
  $(".ks-d1", host).innerHTML = "<p>Before: " + QI + " = (2.5 × 10⁻³)(1.0 × 10⁻⁶) = 2.5 × 10⁻⁹ > " + sx(K_OX) + ", so crystals can form.</p><p>Doubling the volume halves both concentrations: " + QI + " = (1.25 × 10⁻³)(5.0 × 10⁻⁷) = " + sx(1.25e-3 * 5.0e-7) + " < " + sx(K_OX) + ". " + KS + " didn’t change; " + QI + " fell to a quarter.</p>";
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-s1]"); if (!b || b1) return;
    b1 = true; var from = f1, to = S.drink ? 1 : 0.5; S.drink = !S.drink; api.save(); paint1();
    MV.tween({ dur:1400, step:function(t){ f1 = lerp(from, to, t); paint1(); }, done:function(){ f1 = to; b1 = false; paint1(); } });
  });
  // station 2: kettle scale
  $(".ks-tbl2", host).innerHTML = MV.tableHTML({ head:["Heating (min)", "[Ca²⁺] (mol/L)", "[CO₃²⁻] (mol/L)"], rows:S2.t.map(function(t, i){ return [String(t), sx(S2.ca), sx(S2.co3[i])]; }), caption:"Hard water in a kettle (model data). " + KS + " of CaCO₃ = " + sx(K_CO3) + " (course table)." });
  function paint2(){
    var h = S.heat;
    MV.keepFocus($(".ks-steps", host), function(){ $(".ks-steps", host).innerHTML = S2.t.map(function(t, i){ return '<button type="button" class="ks-stepb" data-k="ksh' + i + '" data-h="' + i + '" aria-pressed="' + (h.pick === i) + '">' + t + " min</button>"; }).join(""); });
    var q = $(".ks-q2", host), fb = $(".ks-fb2", host);
    if (h.pick < 0) { q.innerHTML = qbarSVG(1, { hide:true }); q.setAttribute("aria-label", qbarLabel(1, true)); fb.innerHTML = muted("Tap a heating step to see its " + QI + "."); return; }
    var Q = S2.ca * S2.co3[h.pick], r = Q / K_CO3, first = S2.co3.map(function(c){ return S2.ca * c > K_CO3; }).indexOf(true), t = S2.t[h.pick];
    q.innerHTML = qbarSVG(r); q.setAttribute("aria-label", qbarLabel(r));
    var calc = t + " min: " + QI + " = (" + sx(S2.ca) + ")(" + sx(S2.co3[h.pick]) + ") = " + sx(Q) + ". ";
    fb.innerHTML = h.pick === first ? MV.fbHTML("good", "<strong>✓ " + calc + "</strong>This is the first step where " + QI + " passes " + KS + " = " + sx(K_CO3) + ": scale starts to form on the element.")
      : h.pick < first ? MV.fbHTML("bad", "<strong>✗ " + calc + "</strong>That’s still below " + KS + " = " + sx(K_CO3) + ": no scale yet. Keep heating.")
      : MV.fbHTML("bad", "<strong>✗ " + calc + "</strong>" + QI + " is above " + KS + " here, but it crossed earlier. Check the steps before.");
  }
  $(".ks-steps", host).addEventListener("click", function(e){ var b = e.target.closest("[data-h]"); if (!b) return; S.heat.pick = +b.dataset.h; api.save(); paint2(); MV.focusFb($(".ks-fb2", host)); });
  // station 3: hydroxide precipitation
  var MG = SALTS.MgOH2;
  var phRG = radios($(".ks-ph", host), { label:"pH after adding lime", aria:"pH after adding lime", cls:"chips", options:[8, 9, 10].map(function(p){ return { id:String(p), t:MV.num(p, 2) }; }), value:String(S.ph),
    onChange:function(v){ S.ph = +v; S.st = 0; api.save(); paint3(); } });
  function paint3(){
    var pOH = -Math.log10(KW) - S.ph, oh = Math.pow(10, -pOH), mx = MG.k / (oh * oh);
    var steps = ["pH " + MV.num(S.ph, 2) + ", so pOH = " + MV.num(-Math.log10(KW), 2) + " − " + MV.num(S.ph, 2) + " = " + MV.num(pOH, 2) + " and [OH⁻] = " + sx(oh) + " mol/L.",
      KS + " = [Mg²⁺][OH⁻]², so the most Mg²⁺ that can stay dissolved is " + KS + " ÷ [OH⁻]².",
      sx(MG.k) + " ÷ (" + sx(oh) + ")² = <strong>" + sx(mx) + " mol/L</strong>. " + (mx >= 1 ? "That’s far more than any wastewater holds, so nothing precipitates yet: raise the pH." : "Any Mg²⁺ above this precipitates as Mg(OH)₂ and can be filtered out. Each pH unit up divides this limit by 100.")];
    $(".ks-work", host).innerHTML = steps.slice(0, S.st).map(function(t){ return "<li>" + t + "</li>"; }).join("") || '<li class="muted ks-none">Press <strong>Next step</strong>.</li>';
    var b = $('[data-s3="next"]', host); b.disabled = S.st >= 3; b.textContent = S.st >= 3 ? "All steps shown" : "Next step";
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-s3]"); if (!b || S.st >= 3) return; S.st++; api.save(); paint3(); });
  // station 4: barium meals
  var BA = SALTS.BaSO4;
  function paint4(){
    var s0 = sOf(BA), s = sCommon(BA, c4);
    $(".ks-r4", host).innerHTML = MV.readoutHTML([[KS + " of BaSO₄", sx(BA.k) + " (course table): unchanged"], ["[Ba²⁺] in water", SI + " = √" + KS + " = " + sx(s0) + " mol/L"],
      ["Added sulfate", c4 > 0 ? MV.num(c4, 3) + " mol/L Na₂SO₄" : muted("none yet")], ["[Ba²⁺] now", "<strong>" + sx(s) + " mol/L</strong>" + (c4 >= 0.0099 ? ": " + KS + " ÷ 0.010, about a thousand times less" : "")]]);
    var b = $('[data-s4="go"]', host); b.disabled = b4; b.textContent = S.so4 ? "Remove the sulfate" : "Add a little sulfate";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-s4]"); if (!b || b4) return;
    b4 = true; var from = c4, to = S.so4 ? 0 : 0.010; S.so4 = !S.so4; api.save(); paint4();
    MV.tween({ dur:1200, step:function(t){ c4 = lerp(from, to, t); paint4(); }, done:function(){ c4 = to; b4 = false; paint4(); } });
  });
  paint1(); paint2(); paint3(); paint4();
  return phRG;
}

// ---------- Practice 2: Precipitate or not? (N4 scientific-notation entry + chips) ----------
function precipAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { num:{}, pick:{}, tries:0, hint:0, solved:false, first:null, inv:null }); x.num = x.num || {}; x.pick = x.pick || {}; return x; }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    it.parts.forEach(function(p, k){
      var key = it.id + "p" + k;
      if (p.k === "num") h += '<div class="ks-part"><span class="ks-plab">' + p.label + "</span>" + sciHTML(key, x.num[k] || {}, x.solved, p.label) + (p.unit ? '<span class="ks-unit">' + p.unit + "</span>" : "") + "</div>";
      else h += '<div class="ks-part"><span class="ks-plab">' + p.label + '</span><span class="chips" role="radiogroup" aria-label="' + esc(MV.plain(p.label)) + '">' + p.options.map(function(o, j){ var on = x.pick[k] === j; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-pp="' + k + '" data-op="' + j + '" data-k="' + key + "o" + j + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span></div>";
    });
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) {
      h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      if (it.invest) {
        var iv = it.invest;
        h += '<div class="ks-inv"><p>' + iv.prompt + '</p><div class="chips" role="radiogroup" aria-label="Variable to control">' + iv.options.map(function(o, j){ var on = x.inv === j; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-inv="' + j + '" data-k="' + it.id + "iv" + j + '">' + o.t + "</button>"; }).join("") + "</div>";
        if (x.inv != null) h += MV.fbHTML(MV.ok(iv.options[x.inv]) ? "good" : "bad", (MV.ok(iv.options[x.inv]) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + iv.options[x.inv].why + (MV.ok(iv.options[x.inv]) ? "" : " Try another."));
        h += "</div>";
      }
    } else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = MV.usesHTML(a.uses) + '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function judge(it, x){
    for (var k = 0; k < it.parts.length; k++) {
      var p = it.parts[k];
      if (p.k === "num") {
        var r = sciVal(x.num[k] || {}); if (r.err) return { bad:r.err };
        if (near(r.v, MV.ans(p))) continue;
        var w = (p.wrong || []).filter(function(z){ return near(r.v, z.match); })[0];
        return { fb:w ? w.fb : it.fb };
      }
      if (x.pick[k] == null) return { bad:"Choose an answer for “" + MV.plain(p.label).replace(/[:?]$/, "") + "” first." };
      if (!MV.ok(p.options[x.pick[k]])) return { fb:p.options[x.pick[k]].why || it.fb };
    }
    return { ok:true };
  }
  host.addEventListener("input", function(e){
    var t = e.target, d = t.dataset || {}, key = d.sm || d.se; if (!key) return;
    var bx = t.closest("[data-ri]"); if (!bx) return;
    var x = ist(bx.dataset.ri), k = +key.split("p").pop(); x.num[k] = x.num[k] || {};
    if (d.sm) x.num[k].m = t.value; else x.num[k].e = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter") return; var bx = e.target.closest && e.target.closest("[data-ri]"); if (!bx || !(e.target.dataset.sm || e.target.dataset.se)) return; var b = bx.querySelector('[data-act="check"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.inv != null) { x.inv = +b.dataset.inv; api.save(); paint(); MV.focusFb(bx.querySelector(".ks-inv")); return; }
    if (b.dataset.op != null) { x.pick[+b.dataset.pp] = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = r.fb; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Just a little precipitate ----------
var TCA = [1.0e-4, 2.0e-4, 4.0e-4, 1.0e-3, 2.0e-3, 5.0e-3], TF = [1.0e-4, 2.0e-4, 4.0e-4, 1.0e-3];
var task = (function(){
  var S = null, api = null, X = SALTS.CaF2;
  function read(){ var i = S && TCA[S.i] != null ? S.i : 0, j = S && TF[S.j] != null ? S.j : 0; return { i:i, j:j, ca:TCA[i], f:TF[j] }; }
  function qOf(d){ return (d.ca / 2) * Math.pow(d.f / 2, 2); }
  function paint(){
    var d = read(), Q = qOf(d), r = Q / X.k, q = $("#ks-tkq"), bk = $("#ks-tkbk");
    q.innerHTML = qbarSVG(r); q.setAttribute("aria-label", qbarLabel(r));
    bk.innerHTML = beakerSVG({ nc:nDots(d.ca / 2), na:nDots(d.f / 2), solid:r > 1.005 ? clamp(6 + 9 * Math.log10(r), 6, 44) : 0, seed:17 });
    bk.setAttribute("aria-label", "The mixed solution, 100.0 mL. " + (r > 1.005 ? "A layer of CaF₂ solid at the bottom" + (r >= 10 ? ", a thick one." : ", a thin one.") : "No solid."));
    $("#ks-tkread").innerHTML = MV.readoutHTML([["After mixing (100.0 mL)", "[Ca²⁺] = " + sx(d.ca / 2) + " · [F⁻] = " + sx(d.f / 2) + " mol/L"],
      [QI + " = [Ca²⁺][F⁻]²", "(" + sx(d.ca / 2) + ")(" + sx(d.f / 2) + ")² = <strong>" + sx(Q) + "</strong>"], [QI + " ÷ " + KS, MV.num(Math.round(r * 100) / 100, 2) + " (" + KS + " = " + sx(X.k) + ")"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; S.i = TCA[S.i] != null ? S.i : 0; S.j = TF[S.j] != null ? S.j : 0;
      inp.innerHTML = '<div class="ks-tki"></div><div class="ks-tkj"></div><p class="tiny muted">50.0 mL of each stock is mixed.</p>';
      radios($(".ks-tki", inp), { label:"Ca(NO₃)₂ stock (mol/L)", aria:"Calcium nitrate stock in mol/L", cls:"chips", options:TCA.map(function(c, i){ return { id:String(i), t:sx(c) }; }), value:String(S.i), onChange:function(v){ S.i = +v; api.save(); paint(); api.update(); } });
      radios($(".ks-tkj", inp), { label:"NaF stock (mol/L)", aria:"Sodium fluoride stock in mol/L", cls:"chips", options:TF.map(function(c, i){ return { id:String(i), t:sx(c) }; }), value:String(S.j), onChange:function(v){ S.j = +v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="ks-h4">Your mixture</h4><div class="ks-tkgrid"><svg class="ks-svg" id="ks-tkbk" viewBox="0 0 300 250" role="img" aria-label=""></svg><div><div class="ks-qb"><svg class="ks-qsvg" id="ks-tkq" viewBox="0 0 320 86" role="img" aria-label=""></svg></div><dl class="read" id="ks-tkread" aria-live="polite"></dl></div></div>';
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var Q = qOf(d); return [Q > X.k * (1 + 1e-9), Q < 10 * X.k * (1 - 1e-9), d.f <= d.ca]; },
    tips:function(d, res){ var T2 = MV.C.task.tips, out = []; if (!res[0]) out.push(T2[0]); if (!res[1]) out.push(T2[1]); if (!res[2]) out.push(T2[2]); return out; },
    key:function(d){ return d.i + "|" + d.j; },
    label:function(k){ var p = k.split("|"); return "Ca(NO₃)₂ " + sx(TCA[+p[0]]) + " with NaF " + sx(TF[+p[1]]) + " mol/L"; },
    text:function(k){ var p = k.split("|"); return "Ca(NO3)2 " + MV.plain(sx(TCA[+p[0]])) + ", NaF " + MV.plain(sx(TF[+p[1]])) + " mol/L"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:function(host, api){ part3(host, api); },
  activities:{ precip:precipAct },
  task:task
});
})();
