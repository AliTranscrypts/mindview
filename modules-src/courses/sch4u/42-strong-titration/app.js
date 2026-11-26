// SCH4U 42 Strong Acid/Base Titration: hero (a burette drips NaOH into HCl with bromothymol blue while the pH curve draws
// itself), Titration lab (Explore: C9 titrationLab — burette, flask, indicator, pH meter, live curve with a keyboard probe,
// moles table; Lab / Curve / Calculate modes; trial table), Read the curve (Part 3: four regions with a particle view, the
// calculation table, a data check with one wrong row, two overlaid curves), "Plan the titration" task (sample / NaOH /
// indicator chips + a live curve with the indicator band).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f, D = MV.chem.data, KW = D["const"].Kw, MIN = "−";
var PKW = -Math.log10(KW);
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function near(a, b, t){ return a != null && Math.abs(a - b) <= t + 1e-9; }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
// fixed decimals with a true minus
function fx(v, dp){ var s = Math.abs(v).toFixed(dp); return (v < 0 && +s !== 0 ? MIN : "") + s; }
function sup(e){ return "<sup>" + (e < 0 ? MIN : "") + Math.abs(e) + "</sup>"; }
function sci(v, k){ var e = Math.floor(Math.log10(v) + 1e-12), m = v / Math.pow(10, e); if (+m.toFixed(k - 1) >= 10) { e++; m /= 10; } return m.toFixed(k - 1) + " × 10" + sup(e); }
function conc(v){ return v >= 0.001 ? v.toPrecision(3) : sci(v, 3); }        // mol/L, 3 significant figures
function mmol(v){ return v >= 0.1 ? fx(v, 2) : v >= 0.001 ? v.toPrecision(2) : sci(v, 2); }
function vol(v){ return Math.abs(v * 10 - Math.round(v * 10)) < 1e-6 ? fx(v, 1) : fx(v, 2); }
function ionTxt(k){ return k === "h" ? "H₃O⁺" : "OH⁻"; }
var LOGS = Object.keys(D.logs).map(function(k){ return "log " + k + " = " + fx(D.logs[k], 2); }).join(", ");

// ---------- SVG helpers ----------
function T(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 14) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" stroke-linejoin="round" paint-order="stroke"' : "") + (o.tr ? ' transform="' + o.tr + '"' : "") + ">" + s + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + ' stroke-linecap="round"/>'; }
function Ci(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 2) + '"' : "") + "/>"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–07) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + (typeof o.label === "function" ? o.label() : o.label) + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || (typeof o.label === "function" ? o.label() : o.label) || "Options")) + '">' +
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

// @component C9 titrationLab — acid–base titration model and SVG views (SCH4U 42; written for reuse in 43 and 44).
//   TL.ph(sys, v)      exact pH by charge balance (bisection on log[H₃O⁺], Kw from MV.chem.data). sys = {fk:"acid"|"base" (in the
//                      flask), fc mol/L, fV mL, np (H₃O⁺ or OH⁻ per formula unit; strong only, e.g. 2 for H₂SO₄), K (Ka of a weak acid
//                      or Kb of a weak base in the flask; null = strong), tc mol/L (strong titrant)}; v = mL of titrant added.
//   TL.eqV(sys)        equivalence volume (mL).   TL.excess(sys, v) -> {ion:"h"|"oh"|null, mmol, Vt} (strong–strong excess method)
//   TL.volAt(sys, pH, a, b)  titrant volume where the curve reaches pH (bisection on [a, b]).
//   TL.IND / TL.INDS   indicators {mo, mr, btb, pp}: name and range from MV.chem.data.ind, colour words [low, change, high].
//   TL.colour(id, pH) -> {w:"yellow", v:"--st-yellow"} (true indicator colours are app.css tokens; always print the word).
//   TL.labSVG(o)       burette (0–50 mL scale) + Erlenmeyer flask + optional pH meter, inner markup for viewBox 0 0 240 340:
//                      o = {read, flaskV, col, tcol, meter:null|"off"|pH, drop:null|0..1, tName}
//   TL.curveSVG(o)     pH curve, inner markup for viewBox 0 0 460 300: o = {x0, x1, xl, curves:[{s, a, b, col, w, dash}],
//                      band:indicator id, eq:{v, p, label}, pts:[{v, p, col, r, lab}], cur:{v, p}, probe:{v, p}, hit:[{id, a, b}]}
//                      -> markup; TL.curveX(o, px) converts a viewBox x back to mL.
var TL = (function(){
  var INDW = { "methyl orange":["mo", "red", "orange", "yellow"], "methyl red":["mr", "red", "orange", "yellow"],
    "bromothymol blue":["btb", "yellow", "green", "blue"], "phenolphthalein":["pp", "colourless", "pale pink", "pink"] };
  var CV = { red:"--st-red", orange:"--st-orange", yellow:"--st-yellow", green:"--st-green", blue:"--st-blue", pink:"--st-pink", "pale pink":"--st-palepink", colourless:"--st-clear" };
  var IND = {}, INDS = [];
  D.ind.forEach(function(r){ var w = INDW[r[0]]; if (!w) return; IND[w[0]] = { id:w[0], nm:r[0], lo:r[1], hi:r[2], c:[w[1], w[2], w[3]] }; INDS.push(w[0]); });
  function ph(s, v){
    var Vt = s.fV + v, Cf = s.fc * s.fV * (s.np || 1) / Vt, Ct = s.tc * v / Vt, lo = -15, hi = 1.5;
    for (var i = 0; i < 64; i++) {
      var m = (lo + hi) / 2, h = Math.pow(10, m), oh = KW / h, f;
      if (s.fk === "acid") f = h + Ct - oh - (s.K ? Cf * s.K / (s.K + h) : Cf);
      else f = h + (s.K ? Cf * h / (KW / s.K + h) : Cf) - oh - Ct;
      if (f > 0) hi = m; else lo = m;
    }
    return -(lo + hi) / 2;
  }
  function eqV(s){ return s.fc * s.fV * (s.np || 1) / s.tc; }
  function excess(s, v){
    var d = s.fc * s.fV * (s.np || 1) - s.tc * v, Vt = s.fV + v, fi = s.fk === "acid" ? "h" : "oh";
    if (Math.abs(d) < 1e-9) return { ion:null, mmol:0, Vt:Vt };
    return d > 0 ? { ion:fi, mmol:d, Vt:Vt } : { ion:fi === "h" ? "oh" : "h", mmol:-d, Vt:Vt };
  }
  function volAt(s, p, a, b){ var up = ph(s, b) > ph(s, a); for (var i = 0; i < 50; i++) { var m = (a + b) / 2; if ((ph(s, m) < p) === up) a = m; else b = m; } return (a + b) / 2; }
  function colour(id, p){ var I = IND[id]; if (!I) return { w:"colourless", v:CV.colourless }; var w = p < I.lo ? I.c[0] : p > I.hi ? I.c[2] : I.c[1]; return { w:w, v:CV[w] }; }

  function labSVG(o){
    var g = "", top = 16, tubeH = 200, bx = 104, bw = 18, k = tubeH / 50, m;
    var ly = top + clamp(o.read, 0, 50) * k;
    g += T(bx + bw + 8, top + 6, o.tName || "", { a:"start", fs:14, w:700 });
    g += '<rect x="' + bx + '" y="' + r1(ly) + '" width="' + bw + '" height="' + r1(top + tubeH - ly) + '" fill="var(' + (o.tcol || "--st-clear") + ')"/>';
    if (o.read < 50) g += Ln(bx + 1, ly, bx + bw - 1, ly, { c:"var(--ink-2)", w:1.6 });
    g += '<rect x="' + bx + '" y="' + top + '" width="' + bw + '" height="' + tubeH + '" fill="none" stroke="var(--ink)" stroke-width="1.8"/>';
    for (m = 0; m <= 50; m++) { var y = top + m * k, maj = m % 5 === 0; g += Ln(bx, y, bx + (maj ? 8 : 4), y, { c:"var(--ink-2)", w:maj ? 1.3 : 0.8 }); if (m % 10 === 0) g += T(bx - 6, y, String(m), { a:"end", fs:12, c:"var(--ink-2)" }); }
    var by = top + tubeH, sy = by + 8;
    g += '<path d="M' + bx + " " + by + " L" + (bx + 6) + " " + sy + " L" + (bx + 12) + " " + sy + " L" + (bx + bw) + " " + by + 'Z" fill="var(' + (o.tcol || "--st-clear") + ')" stroke="var(--ink)" stroke-width="1.6"/>';
    g += '<rect x="' + (bx - 8) + '" y="' + sy + '" width="' + (bw + 16) + '" height="8" rx="3" fill="var(--ink-2)"/>';
    g += '<path d="M' + (bx + 6) + " " + (sy + 8) + " L" + (bx + 8) + " " + (sy + 22) + " L" + (bx + 10) + " " + (sy + 22) + " L" + (bx + 12) + " " + (sy + 8) + 'Z" fill="none" stroke="var(--ink)" stroke-width="1.6"/>';
    // flask: neck x 101–125 from y 258, body to y 330
    var lv = 330 - 54 * clamp(o.flaskV / 80, 0.12, 0.92), sl = 37 / 54;
    function xl(y){ return 101 - (y - 276) * sl; } function xr(y){ return 125 + (y - 276) * sl; }
    g += '<path d="M' + r1(xl(lv)) + " " + r1(lv) + " L" + r1(xr(lv)) + " " + r1(lv) + " L162 330 L64 330 Z" + '" fill="var(' + o.col + ')"/>';
    if (o.drop != null) g += Ci(bx + 9, (sy + 25) + o.drop * (lv - sy - 28), 3.6, "var(" + (o.tcol || "--st-clear") + ")", { s:"var(--ink-2)", sw:1.2 });
    g += '<path d="M101 256 L101 276 L64 330 L162 330 L125 276 L125 256" fill="none" stroke="var(--ink-2)" stroke-width="2.2" stroke-linejoin="round"/>' + Ln(97, 256, 129, 256, { c:"var(--ink-2)", w:2.2 });
    if (o.meter != null) {
      var on = o.meter !== "off";
      g += '<path d="M170 244 L124 250 L120 318" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>' + Ci(120, 318, 3, "var(--ink-2)");
      g += '<rect x="160" y="200" width="74" height="44" rx="6" fill="var(--sheet)" stroke="var(--ink)" stroke-width="1.6"/>' + T(170, 212, "pH", { a:"start", fs:11.5, c:"var(--ink-2)", w:700 }) +
        T(197, 230, on ? fx(o.meter, 2) : "off", { fs:on ? 17 : 14, w:700, c:on ? "var(--ink)" : "var(--ink-2)" });
    }
    return g;
  }

  var CW = 460, CH = 300, PL = 46, PR = 14, PT = 14, PB = 46;
  function geo(o){ var x0 = o.x0, x1 = o.x1; return { X:function(v){ return PL + (v - x0) / (x1 - x0) * (CW - PL - PR); }, Y:function(p){ return PT + (14 - clamp(p, 0, 14)) / 14 * (CH - PT - PB); } }; }
  function curveX(o, px){ return o.x0 + (px - PL) / (CW - PL - PR) * (o.x1 - o.x0); }
  function pathD(s, a, b, X, Y){
    if (b <= a) return "";
    var vs = [], N = 140, e = eqV(s), span = b - a, kk;
    for (kk = 0; kk <= N; kk++) vs.push(a + span * kk / N);
    for (kk = -100; kk <= 100; kk++) { var u = e + kk * (span < 3 ? 0.0025 : 0.01); if (u > a && u < b) vs.push(u); }
    vs.sort(function(p, q){ return p - q; });
    return vs.map(function(v, j){ return (j ? "L" : "M") + r1(X(v)) + " " + r1(Y(ph(s, v))); }).join("");
  }
  function curveSVG(o){
    var G = geo(o), X = G.X, Y = G.Y, g = "", span = o.x1 - o.x0, v, p;
    if (o.band && IND[o.band]) { var I = IND[o.band]; g += '<rect x="' + PL + '" y="' + r1(Y(I.hi)) + '" width="' + (CW - PL - PR) + '" height="' + r1(Y(I.lo) - Y(I.hi)) + '" fill="var(--hi-soft)"/>'; }
    for (p = 0; p <= 14; p += 2) { g += Ln(PL, Y(p), CW - PR, Y(p), { c:"var(--plot-grid)", w:1 }) + T(PL - 7, Y(p), String(p), { a:"end", fs:13, c:"var(--ink-2)" }); }
    var st = span <= 1.5 ? 0.1 : span <= 3 ? 0.5 : span <= 12 ? 1 : span <= 30 ? 5 : 10, lab = span <= 1.5 ? 2 : 1, dp = st < 1 ? 1 : 0, n0 = Math.ceil(o.x0 / st - 1e-9), n1 = Math.floor(o.x1 / st + 1e-9);
    for (var t = n0; t <= n1; t++) { v = t * st; g += Ln(X(v), PT, X(v), Y(0), { c:"var(--plot-grid)", w:1 }); if (t % lab === 0) g += T(X(v), Y(0) + 13, fx(v, dp), { fs:13, c:"var(--ink-2)" }); }
    g += Ln(PL, Y(0), CW - PR, Y(0), { c:"var(--plot-axis)", w:1.6 }) + Ln(PL, PT, PL, Y(0), { c:"var(--plot-axis)", w:1.6 });
    g += T((PL + CW - PR) / 2, CH - 10, o.xl || "Titrant added (mL)", { fs:13.5, c:"var(--ink)" }) + T(13, (PT + Y(0)) / 2, "pH", { fs:13.5, c:"var(--ink)", tr:"rotate(-90 13 " + r1((PT + Y(0)) / 2) + ")" });
    if (o.band && IND[o.band]) { var I2 = IND[o.band]; g += T(CW - PR - 5, Y(I2.hi) + (I2.hi > 12 ? 10 : -10), I2.nm + " " + fx(I2.lo, 1) + "–" + fx(I2.hi, 1), { a:"end", fs:12.5, c:"var(--ink-2)", halo:true }); }
    (o.curves || []).forEach(function(c){
      var a = Math.max(o.x0, c.a == null ? o.x0 : c.a), b = Math.min(o.x1, c.b == null ? o.x1 : c.b);
      g += '<path d="' + pathD(c.s, a, b, X, Y) + '" fill="none" stroke="var(' + (c.col || "--pen") + ')" stroke-width="' + (c.w || 3) + '" stroke-linejoin="round" stroke-linecap="round"' + (c.dash ? ' stroke-dasharray="' + c.dash + '"' : "") + "/>";
    });
    if (o.eq && o.eq.v >= o.x0 && o.eq.v <= o.x1) {
      var ex = X(o.eq.v), ey = Y(o.eq.p), right = ex < (PL + CW - PR) / 2;
      g += Ln(ex, Y(0), ex, ey, { c:"var(--ink)", w:1.6, d:"5 4" }) + Ci(ex, ey, 5, "var(--ink)", { s:"var(--sheet)", sw:1.5 }) +
        T(ex + (right ? 9 : -9), ey + 16, o.eq.label || ("equivalence: pH " + fx(o.eq.p, 2) + ", " + fx(o.eq.v, 2) + " mL"), { a:right ? "start" : "end", fs:13, w:700, halo:true });
    }
    (o.pts || []).forEach(function(q){ if (q.v < o.x0 || q.v > o.x1) return; g += Ci(X(q.v), Y(q.p), q.r || 5, "var(" + (q.col || "--pen") + ")", { s:"var(--sheet)", sw:1.5 }) + (q.lab ? T(X(q.v) + 8, Y(q.p) - 12, q.lab, { a:"start", fs:12.5, halo:true }) : ""); });
    if (o.cur && o.cur.v >= o.x0 && o.cur.v <= o.x1) g += Ci(X(o.cur.v), Y(o.cur.p), 6, "var(--pen)", { s:"var(--sheet)", sw:2 });
    if (o.probe && o.probe.v >= o.x0 && o.probe.v <= o.x1) {
      var px = X(o.probe.v), py = Y(o.probe.p), pr = px < (PL + CW - PR) / 2;
      g += Ln(px, PT, px, Y(0), { c:"var(--ink-2)", w:1.2, d:"3 4" }) + Ci(px, py, 7, "none", { s:"var(--ink)", sw:2 }) +
        T(px + (pr ? 10 : -10), py - 14, fx(o.probe.v, 2) + " mL, pH " + fx(o.probe.p, 2), { a:pr ? "start" : "end", fs:12.5, halo:true });
    }
    (o.hit || []).forEach(function(h){ var a = X(Math.max(o.x0, h.a)), b = X(Math.min(o.x1, h.b)); g += '<rect class="st-hit" data-reg="' + h.id + '" x="' + r1(a) + '" y="' + PT + '" width="' + r1(b - a) + '" height="' + r1(Y(0) - PT) + '" fill="transparent"/>'; });
    return g;
  }
  return { ph:ph, eqV:eqV, excess:excess, volAt:volAt, colour:colour, IND:IND, INDS:INDS, labSVG:labSVG, curveSVG:curveSVG, curveX:curveX, CW:CW, CH:CH };
})();
var IND = TL.IND;
function indOpts(none){ return (none ? [{ id:"none", t:"none" }] : []).concat(TL.INDS.map(function(id){ return { id:id, t:IND[id].nm }; })); }
function sysOf(fc, fV, tc, fk, np){ return { fk:fk || "acid", fc:fc, fV:fV, np:np || 1, K:null, tc:tc }; }
var REF = sysOf(0.1, 20, 0.1);

// Final Check: the indicator table and the "Use these values" logs are available (plan, Final Check intro).
function finalExtras(){
  var fi = $('[data-view="final-check"] .intro');
  if (!fi || fi.querySelector(".chem-tab")) return;
  fi.insertAdjacentHTML("beforeend", MV.usesHTML(" " + LOGS));
  MV.chem.tablePanel(fi, "ind", { title:"Indicator table" });
}

// ---------- hero ----------
function hero(){
  try { finalExtras(); } catch (e) {}
  var lab = $("#st-hx-lab"), cv = $("#st-hx-cv"), cap = $("#st-hx-cap"), rep = $("#st-hx-replay");
  if (!lab || !cv) return;
  lab.setAttribute("viewBox", "0 0 240 340"); cv.setAttribute("viewBox", "0 0 " + TL.CW + " " + TL.CH);
  var V1 = 26, run = 0, st = { v:0, drop:null, mark:false };
  var CAPS = ["Bromothymol blue in the acid: the flask is yellow.", "NaOH drips in. The pH barely moves: flat, flat…", "One drop more: the flask turns green. Equivalence: pH 7.00 at 20.00 mL.", "Past equivalence the flask is blue.", "Equivalence: pH 7.00 at 20.00 mL. The flask went yellow, then green, then blue."];
  function draw(){
    var p = TL.ph(REF, st.v), c = TL.colour("btb", p);
    lab.innerHTML = TL.labSVG({ read:st.v, flaskV:20 + st.v, col:c.v, tcol:"--st-clear", meter:null, drop:st.drop, tName:"NaOH" });
    cv.innerHTML = TL.curveSVG({ x0:0, x1:30, xl:"NaOH added (mL)", curves:[{ s:REF, a:0, b:st.v }], cur:{ v:st.v, p:p }, eq:st.mark ? { v:20, p:TL.ph(REF, 20) } : null });
  }
  function say(i){ cap.textContent = CAPS[i]; }
  function play(){
    var id = ++run; rep.hidden = true; st = { v:0, drop:null, mark:false }; draw(); say(0);
    MV.wait(900, function(){
      if (id !== run) return; say(1);
      MV.tween({ dur:3800, ease:LIN, step:function(t){ if (id !== run) return; st.v = 19.8 * t; st.drop = (t * 26) % 1; draw(); }, done:function(){
        if (id !== run) return;
        MV.tween({ dur:700, ease:LIN, step:function(t){ if (id !== run) return; st.v = 19.8 + 0.2 * t; st.drop = t; draw(); }, done:function(){
          if (id !== run) return; st.mark = true; st.drop = null; draw(); say(2);
          MV.wait(1300, function(){
            if (id !== run) return; say(3);
            MV.tween({ dur:1400, ease:LIN, step:function(t){ if (id !== run) return; st.v = 20 + (V1 - 20) * t; st.drop = (t * 8) % 1; draw(); }, done:function(){ if (id !== run) return; st.drop = null; draw(); say(4); rep.hidden = false; } });
          });
        } });
      } });
    });
  }
  if (MV.reduceMotion) { st = { v:V1, drop:null, mark:true }; draw(); say(4); }
  else { rep.addEventListener("click", play); play(); }
}

// ---------- Explore: Titration lab ----------
var FKS = [{ id:"HCl", t:F("HCl") }, { id:"NaOH", t:F("NaOH") }, { id:"H2SO4", t:F("H2SO4") }];
var FVS = [10, 20, 25], FCS = ["0.0500", "0.0800", "0.100", "0.200", "unk"], TCS = ["0.050", "0.100", "0.200"], CAP = 5000;
// "Unknown" flask concentrations (hidden from students): HCl 0.0800 mol/L (TC1: equivalence at 16.00 mL), H₂SO₄ 0.0600 mol/L
// (TC3: 24.0 mL of 0.100 mol/L NaOH for 20.0 mL), NaOH 0.0800 mol/L (builder's choice for base-in-flask mode).
var HID = { HCl:0.08, H2SO4:0.06, NaOH:0.08 };

function explore(host, api){
  var S = api.S, C = api.content;
  if (["lab", "curve", "calc"].indexOf(S.mode) < 0) S.mode = "lab";
  if (!FKS.some(function(x){ return x.id === S.fk; })) S.fk = "HCl";
  S.fV = FVS.indexOf(+S.fV) >= 0 ? +S.fV : 20;
  if (FCS.indexOf(S.fc) < 0) S.fc = "0.100";
  if (TCS.indexOf(S.tc) < 0) S.tc = "0.100";
  if (S.ind !== "none" && !IND[S.ind]) S.ind = "none";
  S.meter = S.meter !== false;
  S.v100 = clamp(Math.round(+S.v100 || 0), 0, CAP);
  S.trials = Array.isArray(S.trials) ? S.trials.filter(function(x){ return Number.isFinite(x); }).slice(0, 3) : [];
  S.entry = typeof S.entry === "string" ? S.entry : "";
  S.zoom = !!S.zoom && S.fc !== "unk";
  S.probe = Number.isInteger(S.probe) ? clamp(S.probe, 0, S.v100) : null;
  var vv = S.v100 / 100, busy = false, tw = null, dtw = null, drop = null, msg = "";

  host.innerHTML = '<p class="how st-how">' + C.how + "</p>" +
    '<div class="st-modes"></div>' +
    '<div class="st-setup"><div data-r="fk"></div><div data-r="fv"></div><div data-r="fc"></div><div data-r="tc"></div><div data-r="ind"></div><div data-r="met"></div></div>' +
    '<div class="st-stage"><div class="st-labbox"><svg class="st-lsvg" viewBox="0 0 240 340" role="img" aria-label=""></svg><p class="st-col" aria-live="polite"></p></div>' +
    '<div class="st-side"><div class="st-cvwrap"><div class="st-cvbox" tabindex="0" role="slider" aria-label="Probe on the titration curve" aria-valuemin="0"><svg class="st-cv" viewBox="0 0 ' + TL.CW + " " + TL.CH + '" aria-hidden="true"></svg></div>' +
    '<p class="vh st-cvdesc"></p><div class="st-zoom"></div><p class="tiny muted st-probe-how">Curve probe: tap the curve, or focus it and use the arrow keys (0.10 mL steps).</p></div>' +
    '<div class="st-labnotes"><h4 class="st-h4">Trial table</h4><div class="st-trials"></div></div></div></div>' +
    '<div class="st-btns" role="group" aria-label="Burette"><button type="button" class="btn sm" data-add="100" data-k="a100">+1.00 mL</button><button type="button" class="btn sm" data-add="10" data-k="a10">+0.10 mL</button><button type="button" class="btn sm" data-add="5" data-k="a5">+1 drop (0.05 mL)</button>' +
    '<button type="button" class="btn ghost sm" data-act="refill" data-k="refill">Refill</button><button type="button" class="btn ghost sm" data-act="reset" data-k="reset">Reset</button><button type="button" class="btn primary sm" data-act="record" data-k="record">Stop and record</button></div>' +
    '<div class="st-addto"><label for="st-to">Add to</label><input class="numin" id="st-to" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="0.00–50.00"><span>mL</span><button type="button" class="btn sm" data-act="to" data-k="to">Add</button></div>' +
    '<p class="st-msg" aria-live="polite"></p>' +
    '<div class="st-readbox"></div>' +
    '<div class="st-result"><label for="st-entry">Your result: concentration of the flask solution</label><span class="st-entryrow"><input class="numin" id="st-entry" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span>mol/L</span></span></div>' +
    '<div class="st-tabs"></div>';
  var lsvg = $(".st-lsvg", host), cvbox = $(".st-cvbox", host), cv = $(".st-cv", host), btns = $(".st-btns", host);
  $("#st-entry").value = S.entry;
  try { MV.chem.tablePanel($(".st-tabs", host), "ind", { title:"Indicator table" }); } catch (e) {}

  function known(){ return S.fc !== "unk"; }
  function sys(){ return sysOf(known() ? +S.fc : HID[S.fk], S.fV, +S.tc, S.fk === "NaOH" ? "base" : "acid", S.fk === "H2SO4" ? 2 : 1); }
  function tName(){ return S.fk === "NaOH" ? "HCl" : "NaOH"; }
  function meterOn(){ return S.mode !== "lab" || S.meter; }
  function newFlask(){ stop(); S.v100 = 0; vv = 0; S.probe = null; S.trials = []; S.zoom = S.zoom && known(); }
  function onSet(){ newFlask(); msg = ""; api.save(); paint(); }

  var modeRG = radios($(".st-modes", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; msg = ""; api.save(); paint(); } });
  var fkRG = radios($('[data-r="fk"]', host), { label:"In the flask", cls:"chips", options:FKS, value:S.fk, onChange:function(v){ S.fk = v; onSet(); } });
  var fvRG = radios($('[data-r="fv"]', host), { label:"Flask volume (mL)", cls:"chips", options:FVS.map(function(x){ return { id:x, t:fx(x, 1) }; }), value:S.fV, onChange:function(v){ S.fV = +v; onSet(); } });
  var fcRG = radios($('[data-r="fc"]', host), { label:"Flask concentration (mol/L)", cls:"chips", options:FCS.map(function(x){ return { id:x, t:x === "unk" ? "Unknown" : x }; }), value:S.fc, onChange:function(v){ S.fc = v; if (v === "unk") S.zoom = false; onSet(); } });
  var tcRG = radios($('[data-r="tc"]', host), { label:function(){ return "Titrant " + F(tName()) + " (mol/L)"; }, aria:"Titrant concentration", cls:"chips", options:TCS.map(function(x){ return { id:x, t:x }; }), value:S.tc, onChange:function(v){ S.tc = v; onSet(); } });
  var indRG = radios($('[data-r="ind"]', host), { label:"Indicator", cls:"chips", options:indOpts(true), value:S.ind, onChange:function(v){ S.ind = v; api.save(); paint(); } });
  var metRG = radios($('[data-r="met"]', host), { label:"pH meter", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.meter ? "on" : "off", disabled:function(){ return S.mode !== "lab" ? "always on" : ""; },
    onChange:function(v){ S.meter = v === "on"; api.save(); paint(); } });
  var zoomRG = radios($(".st-zoom", host), { label:"View", options:[{ id:"full", t:"Full curve" }, { id:"zoom", t:"Zoom: ±0.50 mL" }], value:S.zoom ? "zoom" : "full", disabled:function(id){ return id === "zoom" && !known() ? "unknown" : ""; },
    onChange:function(v){ S.zoom = v === "zoom"; api.save(); paint(); } });
  var RGS = [modeRG, fkRG, fvRG, fcRG, tcRG, indRG, metRG, zoomRG];

  function view(){
    var s = sys(), e = TL.eqV(s);
    if (S.zoom && known()) return { x0:Math.max(0, e - 0.5), x1:e + 0.5 };
    var x1 = clamp(Math.ceil(Math.max(e * 2, vv + 2) / 5) * 5, 20, 50);
    return { x0:0, x1:x1 };
  }
  function readRows(){
    var s = sys(), ex = TL.excess(s, vv), p = TL.ph(s, vv), e = TL.eqV(s), ti = s.fk === "acid" ? "OH⁻" : "H₃O⁺", rows = [], on = meterOn(), k = known(), c = TL.colour(S.ind, p);
    rows.push(["Volume added", fx(vv, 2) + " mL"]);
    rows.push(["<i>n</i>(" + ti + ") added", mmol(s.tc * vv) + " mmol"]);
    rows.push(["Excess", k ? (ex.ion ? ionTxt(ex.ion) + ", " + mmol(ex.mmol) + " mmol" : "none: equivalence") : muted("hidden: unknown concentration")]);
    rows.push(["Total volume", vol(s.fV + vv) + " mL"]);
    rows.push(["[excess ion]", k ? (ex.ion ? "[" + ionTxt(ex.ion) + "] = " + conc(ex.mmol / ex.Vt) + " mol/L" : "[H₃O⁺] = [OH⁻] = " + sci(Math.sqrt(KW), 2) + " mol/L") : muted("hidden")]);
    rows.push(["pH", on ? (p > PKW / 2 + 0.005 ? "pOH " + fx(PKW - p, 2) + ", so pH <strong>" + fx(p, 2) + "</strong>" : "<strong>" + fx(p, 2) + "</strong>") : muted("meter off")]);
    rows.push(["Region", on || k ? (Math.abs(vv - e) < 0.005 ? "At equivalence" : vv < e ? "Before equivalence" : "After equivalence") : muted("hidden")]);
    rows.push(["Indicator", S.ind === "none" ? "none: colourless" : c.w + " (" + IND[S.ind].nm + ")"]);
    return rows;
  }
  function calcHTML(){
    var s = sys(), k = known(), init = s.fc * s.fV * s.np, add = s.tc * vv, ex = TL.excess(s, vv), fi = s.fk === "acid" ? "H₃O⁺" : "OH⁻", ti = s.fk === "acid" ? "OH⁻" : "H₃O⁺", rows = [];
    var cTxt = S.fc, tTxt = S.tc, Vt = s.fV + vv;
    rows.push(["Initial <i>n</i>(" + fi + ")", k ? cTxt + " mol/L × " + fx(s.fV, 1) + " mL" + (s.np === 2 ? " × 2 (2 H⁺ per H₂SO₄)" : "") + " = " + mmol(init) + " mmol" : muted("unknown: that’s what a titration finds")]);
    rows.push(["<i>n</i>(" + ti + ") added", tTxt + " mol/L × " + fx(vv, 2) + " mL = " + mmol(add) + " mmol"]);
    if (!k) { rows.push(["Excess", muted("needs the initial amount")]); rows.push(["Total volume", fx(s.fV, 1) + " + " + fx(vv, 2) + " = " + vol(Vt) + " mL"]); }
    else {
      rows.push(["Excess", ex.ion ? ionTxt(ex.ion) + ": " + (ex.ion === (s.fk === "acid" ? "h" : "oh") ? mmol(init) + " − " + mmol(add) : mmol(add) + " − " + mmol(init)) + " = " + mmol(ex.mmol) + " mmol" : "none: equivalence (" + mmol(init) + " = " + mmol(add) + ")"]);
      rows.push(["Total volume", fx(s.fV, 1) + " + " + fx(vv, 2) + " = " + vol(Vt) + " mL"]);
      if (ex.ion) {
        var cc = ex.mmol / Vt;
        rows.push(["[" + ionTxt(ex.ion) + "]", mmol(ex.mmol) + " mmol ÷ " + vol(Vt) + " mL = " + conc(cc) + " mol/L"]);
        if (ex.ion === "oh") { var po = -Math.log10(cc); rows.push(["pOH", MIN + "log " + conc(cc) + " = " + fx(po, 2)]); rows.push(["pH", fx(PKW, 2) + " − " + fx(po, 2) + " = <strong>" + fx(PKW - po, 2) + "</strong>"]); }
        else rows.push(["pH", MIN + "log " + conc(cc) + " = <strong>" + fx(-Math.log10(cc), 2) + "</strong>"]);
      } else rows.push(["pH", "<strong>" + fx(PKW / 2, 2) + "</strong>: only spectator ions, so [H₃O⁺] = [OH⁻] = " + sci(Math.sqrt(KW), 2) + " mol/L"]);
    }
    return '<h4 class="st-h4">Moles table at ' + fx(vv, 2) + " mL</h4>" + MV.tableHTML({ head:["Quantity", "Working"], rows:rows, caption:"Moles table at " + fx(vv, 2) + " mL" });
  }
  function trialsHTML(){
    if (!S.trials.length) return '<p class="tiny muted">No trials yet. At the endpoint, press <strong>Stop and record</strong>. Up to 3 trials.</p>';
    var t = S.trials.map(function(x){ return x / 100; }), h = MV.tableHTML({ head:["Trial", "Volume (mL)"], rows:t.map(function(x, i){ return [String(i + 1), fx(x, 2)]; }), caption:"Trial volumes" });
    if (t.length > 1) { var rg = Math.max.apply(null, t) - Math.min.apply(null, t); h += '<p class="tiny">' + (rg <= 0.10 + 1e-9 ? "Trials agree within 0.10 mL. Mean: " + fx(t.reduce(function(a, b){ return a + b; }, 0) / t.length, 2) + " mL." : "Trials differ by " + fx(rg, 2) + " mL: repeat until they agree within 0.10 mL.") + "</p>"; }
    return h;
  }
  function draw(){
    var s = sys(), p = TL.ph(s, vv), c = TL.colour(S.ind, p), on = meterOn(), e = TL.eqV(s);
    lsvg.innerHTML = TL.labSVG({ read:vv, flaskV:s.fV + vv, col:c.v, tcol:"--st-clear", meter:on ? p : "off", drop:drop, tName:tName() });
    lsvg.setAttribute("aria-label", "Burette of " + tName() + " reading " + fx(vv, 2) + " mL above a flask of " + MV.plain(F(S.fk)) + ". The flask is " + c.w + ". pH meter " + (on ? "reads " + fx(p, 2) : "off") + ".");
    $(".st-col", host).innerHTML = "Flask: <strong>" + c.w + "</strong>" + (S.ind === "none" ? " (no indicator)" : " (" + IND[S.ind].nm + ")");
    if (S.mode !== "lab") {
      var w = view(), pr = S.probe != null ? { v:S.probe / 100, p:TL.ph(s, S.probe / 100) } : null;
      cv.innerHTML = TL.curveSVG({ x0:w.x0, x1:w.x1, xl:F(tName()) + " added (mL)", band:S.ind === "none" ? null : S.ind, curves:[{ s:s, a:0, b:vv }], cur:{ v:vv, p:p },
        eq:vv >= e - 1e-9 ? { v:e, p:TL.ph(s, e) } : null, probe:pr });
      cvbox.setAttribute("aria-valuemax", fx(vv, 2)); cvbox.setAttribute("aria-valuenow", pr ? fx(pr.v, 2) : fx(vv, 2));
      cvbox.setAttribute("aria-valuetext", pr ? fx(pr.v, 2) + " mL, pH " + fx(pr.p, 2) : "Probe off. Current point " + fx(vv, 2) + " mL, pH " + fx(p, 2));
      $(".st-cvdesc", host).textContent = "pH curve so far: from pH " + fx(TL.ph(s, 0), 2) + " at 0 mL to pH " + fx(p, 2) + " at " + fx(vv, 2) + " mL" + (vv >= e - 1e-9 ? ", passing equivalence at " + fx(e, 2) + " mL, pH " + fx(TL.ph(s, e), 2) : "") + ".";
    }
  }
  function paint(){
    var lab = S.mode === "lab";
    modeRG.set(S.mode); metRG.set(meterOn() ? "on" : "off"); metRG.paint(); zoomRG.set(S.zoom ? "zoom" : "full"); zoomRG.paint(); tcRG.paint();
    host.classList.toggle("st-m-lab", lab);
    $(".st-cvwrap", host).hidden = lab;
    $(".st-trials", host).innerHTML = trialsHTML();
    $(".st-readbox", host).innerHTML = S.mode === "calc" ? calcHTML() : '<dl class="read">' + MV.readoutHTML(readRows()) + "</dl>";
    $(".st-msg", host).innerHTML = msg;
    $$("button", btns).concat([$('[data-act="to"]', host), $("#st-to")]).forEach(function(b){ b.disabled = busy; });
    draw();
  }
  function stop(){ if (tw) { tw(); tw = null; } if (dtw) { dtw(); dtw = null; } drop = null; busy = false; RGS.forEach(function(r){ r.lock(false); }); }
  function lock(b){ busy = b; RGS.forEach(function(r){ r.lock(b); }); }
  function commit(t100){ S.v100 = clamp(t100, 0, CAP); vv = S.v100 / 100; if (S.probe != null) S.probe = Math.min(S.probe, S.v100); api.save(); MV.changed(); }
  function dripAnim(){
    if (MV.reduceMotion) return;
    if (dtw) dtw();
    dtw = MV.tween({ dur:360, ease:LIN, step:function(t){ drop = t < 1 ? t : null; draw(); }, done:function(){ dtw = null; drop = null; draw(); } });
  }
  function add(d){
    if (busy) return;
    if (S.v100 >= CAP) { msg = "The burette is empty: 50.00 mL used. Press Refill for a fresh trial."; paint(); return; }
    var t = S.v100 + d; msg = "";
    if (t > CAP) { t = CAP; msg = "The burette holds 50.00 mL, so it stopped at 50.00 mL."; }
    commit(t); paint(); dripAnim();
  }
  function tweenTo(t100, dur, cb){
    var from = vv, to = t100 / 100; lock(true); paint();
    tw = MV.tween({ dur:dur, ease:LIN, step:function(t){ vv = lerp(from, to, t); drop = t < 1 ? (t * 12) % 1 : null; draw(); }, done:function(){ tw = null; drop = null; lock(false); commit(t100); paint(); if (cb) cb(); } });
  }
  btns.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.add) { add(+b.dataset.add); return; }
    var a = b.dataset.act;
    if (a === "refill") { stop(); commit(0); S.probe = null; msg = "Burette refilled to 0.00 mL, with a fresh sample in the flask. Your trial table is kept."; }
    else if (a === "reset") { stop(); commit(0); S.probe = null; S.trials = []; msg = "Reset: fresh sample, burette at 0.00 mL, trial table cleared."; }
    else if (a === "record") {
      if (S.trials.length >= 3) msg = "Three trials are recorded. Press Reset to clear the table.";
      else if (!S.v100) msg = "Add titrant first: record the volume at the endpoint.";
      else { S.trials.push(S.v100); msg = "Trial " + S.trials.length + " recorded: " + fx(vv, 2) + " mL. Press Refill for a fresh sample."; MV.changed(); }
    }
    api.save(); paint();
  });
  function addTo(){
    if (busy) return;
    var raw = String($("#st-to").value || "").replace(/\s*mL\s*$/i, "").trim(), p = MV.parseNum(raw), x = p && p.length === 1 ? p[0] : null;
    if (x == null || !(x >= 0 && x <= 50)) { msg = "Enter a total volume from 0.00 to 50.00 mL."; paint(); return; }
    var t = Math.round(x * 100);
    if (t < S.v100) { msg = "You can’t take liquid back out of the flask. Press Refill for a fresh sample, then add to that volume."; paint(); return; }
    msg = "";
    if (t === S.v100) { paint(); return; }
    tweenTo(t, clamp((t - S.v100) * 6, 250, 1400));
  }
  $('[data-act="to"]', host).addEventListener("click", addTo);
  $("#st-to").addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); addTo(); } });
  $("#st-entry").addEventListener("input", function(e){ S.entry = e.target.value; api.save(); MV.changed(); });
  // curve probe: pointer and keyboard (0.10 mL steps)
  function setProbe(p100){ S.probe = clamp(Math.round(p100), 0, S.v100); api.save(); draw(); }
  cvbox.addEventListener("click", function(e){
    if (S.mode === "lab") return;
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    var w = view(), v = TL.curveX(w, (e.clientX - r.left) / r.width * TL.CW);
    setProbe(clamp(v, w.x0, Math.min(w.x1, vv)) * 100);
  });
  cvbox.addEventListener("keydown", function(e){
    var k = e.key, cur = S.probe == null ? S.v100 : S.probe, st = S.zoom ? 5 : 10;
    if (k === "ArrowRight" || k === "ArrowUp") setProbe(cur + st);
    else if (k === "ArrowLeft" || k === "ArrowDown") setProbe(cur - st);
    else if (k === "Home") setProbe(0);
    else if (k === "End") setProbe(S.v100);
    else if (k === "Escape") { S.probe = null; api.save(); draw(); }
    else return;
    e.preventDefault();
  });

  // ---------- predictions ----------
  var hooks = {
    start:function(p){
      stop(); msg = "";
      S.mode = "curve"; S.fk = "HCl"; S.fV = 20; S.fc = "0.100"; S.tc = p.id === "p4" ? "0.200" : "0.100"; S.zoom = false; S.trials = []; S.probe = null;
      [fkRG, fvRG, fcRG, tcRG].forEach(function(r, i){ r.set([S.fk, S.fV, S.fc, S.tc][i]); });
      commit(p.id === "p1" ? 1900 : p.id === "p3" ? 1980 : 0); paint();
    },
    run:function(p, done){
      stop();
      var to = p.id === "p1" ? 2000 : p.id === "p2" ? 1000 : p.id === "p3" ? 2020 : 1500, dur = p.id === "p1" ? 1600 : p.id === "p3" ? 2200 : 2400;
      if (p.id === "p3") { S.zoom = true; api.save(); }
      tweenTo(to, dur, function(){
        var s = sys();
        if (p.id === "p1") msg = "Equivalence: the marker reads pH " + fx(TL.ph(s, 20), 2) + " at 20.00 mL.";
        else if (p.id === "p2") msg = "At 10.00 mL the pH is only " + fx(TL.ph(s, 10), 2) + ": the curve barely rises.";
        else if (p.id === "p3") msg = "19.80 mL: pH " + fx(TL.ph(s, 19.8), 2) + " → 20.00 mL: pH " + fx(TL.ph(s, 20), 2) + " → 20.20 mL: pH " + fx(TL.ph(s, 20.2), 2) + ". About 7 units in 8 drops.";
        else msg = "The jump is now at " + fx(TL.eqV(s), 2) + " mL: half the volume of the twice-as-concentrated base.";
        paint(); MV.wait(200, done);
      });
    }
  };

  // ---------- challenges ----------
  function no(m){ return { ok:false, msg:m }; }
  function entryVal(){ var p = MV.parseNum(String(S.entry || "").replace(/mol\s*\/\s*L\s*$/i, "").trim()); return p && p.length === 1 ? p[0] : null; }
  function chal(id){
    if (id === "tc1") {
      if (S.fk !== "HCl" || S.fV !== 20 || S.fc !== "unk" || S.tc !== "0.100") return no("Set up the flask first: 20.0 mL of HCl with concentration Unknown, and 0.100 mol/L NaOH in the burette.");
      if (S.ind === "none") return no("Without an indicator or a meter, the endpoint can’t be seen.");
      if (meterOn()) return no("Switch to Lab mode and turn the pH meter off: this time the indicator finds the endpoint.");
      var r = S.trials.length ? S.trials[S.trials.length - 1] / 100 : null;
      if (r == null) return no("At the endpoint, press Stop and record, then enter the acid’s concentration.");
      if (r > 16.10 + 1e-9) return no("You went past the endpoint: the colour had already changed. Use single drops near the end.");
      if (r < 15.90 - 1e-9) return no("You recorded " + fx(r, 2) + " mL, before the colour change. Add single drops until the indicator changes, then record.");
      var e = entryVal();
      if (e == null) return no("Enter the acid’s concentration (mol/L) under Your result.");
      if (near(e, 0.125, 0.0008)) return no("That’s 20.0 ÷ 16.0 × 0.100. Use <i>n</i>(OH⁻) = 1.60 mmol, so <i>c</i> = 1.60 ÷ 20.0.");
      if (near(e, 0.1, 0.0008)) return no("The acid isn’t necessarily the same concentration as the base.");
      if (!near(e, 0.08, 0.0008)) return no("Find <i>n</i>(OH⁻) = <i>c</i> × <i>V</i> of the base at your endpoint; that equals <i>n</i>(H₃O⁺). Divide by the acid’s 20.0 mL.");
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.fk !== "HCl" || S.fV !== 25 || S.fc !== "0.100") return no("Set the flask to 25.0 mL of 0.100 mol/L HCl first.");
      if (S.tc === "0.050") return no("Equivalence at 50.0 mL fills a whole burette.");
      if (S.tc === "0.100") return no("Equivalence at 25.0 mL.");
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.fk !== "H2SO4" || S.fV !== 20 || S.fc !== "unk" || S.tc !== "0.100") return no("Set up the flask first: 20.0 mL of H₂SO₄ with concentration Unknown, and 0.100 mol/L NaOH in the burette.");
      var a = entryVal();
      if (a == null) return no("(a) Enter the sulfuric acid concentration (mol/L) under Your result.");
      if (near(a, 0.12, 0.0012)) return no("That used a 1 : 1 ratio. Each H₂SO₄ needs 2 OH⁻.");
      if (!near(a, 0.06, 0.0006)) return no("(a) Not yet. <i>n</i>(OH⁻) = 0.100 × 24.0 = 2.40 mmol; use the mole ratio from H₂SO₄ + 2NaOH, then divide by 20.0 mL.");
      if (meterOn()) return no("(b) Switch to Lab mode and turn the pH meter off: work out the volume, then add it.");
      if (near(vv, 34, 0.05) || near(vv, 26, 0.05)) return no("pH 12.30 means [OH⁻] = 0.020 in the <strong>total</strong> volume. Set up excess ÷ (20.0 + <i>V</i>) = 0.020.");
      if (!near(vv, 35, 0.05)) return no("(b) At " + fx(vv, 2) + " mL the pH isn’t 12.30. Find the volume where excess OH⁻ ÷ (20.0 + <i>V</i>) = 0.020 mol/L, then add to exactly that volume.");
      return { ok:true };
    }
    return no("");
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Read the curve ----------
var PV_W = 300, PV_H = 210;
function rng(seed){ var s = seed >>> 0; return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
var CELLS = (function(){ var c = [], r = rng(42), i, j; for (i = 0; i < 4; i++) for (j = 0; j < 6; j++) c.push([24 + j * 48 + (r() - 0.5) * 10, 34 + i * 44 + (r() - 0.5) * 10]); for (i = c.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); var t = c[i]; c[i] = c[j]; c[j] = t; } return c; })();
function pill(x, y, kind){
  var S = { h:["H₃O⁺", "var(--ab-h3o)", "var(--sheet)", ""], oh:["OH⁻", "var(--ab-oh)", "var(--sheet)", ""], na:["Na⁺", "var(--sheet)", "var(--ink)", ""], cl:["Cl⁻", "var(--sheet)", "var(--ink)", "4 3"] }[kind];
  return '<rect x="' + r1(x - 21) + '" y="' + r1(y - 11) + '" width="42" height="22" rx="11" fill="' + S[1] + '"' + (kind === "na" || kind === "cl" ? ' stroke="var(--ink-2)" stroke-width="1.6"' + (S[3] ? ' stroke-dasharray="' + S[3] + '"' : "") : "") + "/>" + T(x, y + 0.5, S[0], { fs:12.5, w:700, c:S[2] });
}
var PCOUNT = { start:{ h:8, cl:8 }, before:{ h:4, cl:8, na:4 }, eq:{ cl:8, na:8 }, after:{ oh:4, cl:8, na:12 } };
function particlesSVG(reg, zoom){
  var g = '<rect x="4" y="4" width="' + (PV_W - 8) + '" height="' + (PV_H - 8) + '" rx="12" fill="var(--st-clear)" stroke="var(--ink-2)" stroke-width="1.8"/>';
  if (zoom) {
    var r = rng(7);
    for (var i = 0; i < 22; i++) g += T(26 + (i % 6) * 50 + (r() - 0.5) * 14, 32 + Math.floor(i / 6) * 46 + (r() - 0.5) * 12, "H₂O", { fs:12, c:"var(--ink-2)" });
    return g + pill(118, 128, "h") + pill(186, 82, "oh");
  }
  var list = [], c = PCOUNT[reg];
  ["h", "oh", "na", "cl"].forEach(function(k){ for (var j = 0; j < (c[k] || 0); j++) list.push(k); });
  list.forEach(function(k, i){ g += pill(CELLS[i][0] + 4, CELLS[i][1], k); });
  return g;
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  if (!s1.regions.some(function(r){ return r.id === S.reg; })) S.reg = "start";
  S.zp = !!S.zp && S.reg === "eq"; S.s2 = S.s2 || {}; S.s2in = S.s2in || {}; S.s3 = S.s3 || {}; S.ind4 = IND[S.ind4] ? S.ind4 : "none";
  var BASE = sysOf(0.1, 12.5, 0.1, "base"), DIL = sysOf(0.01, 20, 0.01), s2msg = null, s3msg = null, s3eq = null;
  var head = ["NaOH added (mL)", "Excess ion", "Excess (mmol)", "Total volume (mL)", "pH", ""];
  host.innerHTML =
    '<div class="st-p3">' +
    '<section class="st-stn"><h3 class="st-h3">' + s1.title + "</h3><p>" + s1.intro + '</p><div class="st-s1"><div class="st-s1cv"><svg class="st-cv" id="st-s1cv" viewBox="0 0 ' + TL.CW + " " + TL.CH + '" role="img" aria-label="Reference titration curve, divided into four regions: start, before equivalence, equivalence and after equivalence."></svg></div>' +
    '<div class="st-s1fl"><svg class="st-pv" id="st-pv" viewBox="0 0 ' + PV_W + " " + PV_H + '" role="img" aria-label=""></svg><p class="st-pvcap" aria-live="polite"></p>' +
    '<p class="tiny st-legend"><span class="st-sw st-sw-h"></span> H₃O⁺ <span class="st-sw st-sw-oh"></span> OH⁻ <span class="st-sw st-sw-sp"></span> spectators (Na⁺, Cl⁻ dashed). Water molecules are not drawn.</p></div></div>' +
    '<div class="st-regs"></div><div class="st-zp"></div></section>' +
    '<section class="st-stn"><h3 class="st-h3">' + s2.title + "</h3><p>" + s2.intro + '</p><div class="tbl-wrap"><table class="vt st-s2t"><caption class="vh">Moles table for the reference titration</caption><thead><tr>' + head.map(function(h){ return '<th scope="col">' + h + "</th>"; }).join("") + '</tr></thead><tbody class="st-s2b"></tbody></table></div><div class="st-s2fb"></div>' +
    '<svg class="st-cv" id="st-s2cv" viewBox="0 0 ' + TL.CW + " " + TL.CH + '" role="img" aria-label=""></svg></section>' +
    '<section class="st-stn"><h3 class="st-h3">' + s3.title + "</h3><p>" + s3.intro + '</p><div class="st-s3">' +
    '<div class="st-s3t">' + MV.tableHTML({ head:["HCl added (mL)", "pH"], rows:s3.rows, caption:"Model data: 12.5 mL of 0.100 mol/L NaOH titrated with 0.100 mol/L HCl" }) + '<p class="tiny muted">Model data</p></div>' +
    '<svg class="st-cv" id="st-s3cv" viewBox="0 0 ' + TL.CW + " " + TL.CH + '" role="img" aria-label=""></svg></div>' +
    '<div class="st-s3q"><div class="numrow"><label for="st-s3eq">Equivalence volume, from the middle of the jump:</label><input class="numin" id="st-s3eq" type="text" inputmode="decimal" autocomplete="off"><span>mL</span><button type="button" class="btn primary sm" id="st-s3chk">Check</button></div><div class="st-s3eqfb"></div>' +
    '<p class="st-s3ask"><strong>One row doesn’t fit. Which?</strong></p><div class="st-s3rows"></div><div class="st-s3fb"></div></div></section>' +
    '<section class="st-stn"><h3 class="st-h3">' + s4.title + "</h3><p>" + s4.intro + '</p><div class="st-s4ind"></div>' +
    '<p class="tiny st-legend"><span class="st-ln st-ln-a"></span> 0.100 mol/L HCl with 0.100 mol/L NaOH <span class="st-ln st-ln-b"></span> 0.0100 mol/L HCl with 0.0100 mol/L NaOH</p>' +
    '<svg class="st-cv" id="st-s4cv" viewBox="0 0 ' + TL.CW + " " + TL.CH + '" role="img" aria-label=""></svg><dl class="read st-s4read"></dl><p>' + s4.note + "</p></section>" +
    "</div>";

  // Station 1
  var regRG = radios($(".st-regs", host), { label:"Region", options:s1.regions.map(function(r){ return { id:r.id, t:r.t }; }), value:S.reg, onChange:function(v){ S.reg = v; S.zp = false; api.save(); paint1(); } });
  var zpHost = $(".st-zp", host);
  function regOf(id){ return s1.regions.filter(function(r){ return r.id === id; })[0]; }
  function paint1(){
    var r = regOf(S.reg), p = TL.ph(REF, r.v), cnt = PCOUNT[S.reg];
    $("#st-s1cv").innerHTML = TL.curveSVG({ x0:0, x1:40, xl:"NaOH added (mL)", curves:[{ s:REF }], eq:{ v:20, p:TL.ph(REF, 20) }, pts:[{ v:r.v, p:p, r:7, col:"--hi" }],
      hit:[{ id:"start", a:0, b:3 }, { id:"before", a:3, b:19.4 }, { id:"eq", a:19.4, b:20.6 }, { id:"after", a:20.6, b:40 }] });
    var pv = $("#st-pv");
    pv.innerHTML = particlesSVG(S.reg, S.zp);
    var list = ["h", "oh", "na", "cl"].filter(function(k){ return cnt[k]; }).map(function(k){ return cnt[k] + " " + { h:"H₃O⁺", oh:"OH⁻", na:"Na⁺", cl:"Cl⁻" }[k]; }).join(", ");
    pv.setAttribute("aria-label", S.zp ? "Zoomed-in view: many water molecules, with one H₃O⁺ and one OH⁻." : "Particles in the flask at " + fx(r.v, 1) + " mL: " + list + ".");
    $(".st-pvcap", host).innerHTML = S.zp ? "Zoomed in: one H₃O⁺ and one OH⁻ remain, from water’s self-ionization. [H₃O⁺] = [OH⁻] = " + sci(Math.sqrt(KW), 2) + " mol/L, because <i>K</i><sub>w</sub> = [H₃O⁺][OH⁻] = " + sci(KW, 2) + "."
      : "<strong>" + r.t + "</strong> (" + fx(r.v, 1) + " mL, pH " + fx(p, 2) + "): " + r.cap + ". " + list + ".";
    zpHost.innerHTML = S.reg === "eq" ? '<button type="button" class="btn ghost sm" data-k="zp">' + (S.zp ? "Back to the flask" : "Zoom to the particles") + "</button>" : "";
  }
  $("#st-s1cv").addEventListener("click", function(e){ var h = e.target.closest("[data-reg]"); if (!h) return; S.reg = h.dataset.reg; S.zp = false; regRG.set(S.reg); api.save(); paint1(); });
  zpHost.addEventListener("click", function(e){ if (!e.target.closest("button")) return; S.zp = !S.zp; api.save(); paint1(); var b = $("button", zpHost); if (b) b.focus(); });

  // Station 2
  function s2rowHTML(r, i){
    var x = S.s2in[i] || {}, done = !!S.s2[i], dis = done ? " disabled" : "", lab = " at " + r.v + " mL";
    return "<tr><th scope=\"row\">" + r.v + '</th><td><select data-s2="' + i + '" data-f="ion" aria-label="Excess ion' + lab + '"' + dis + '><option value="">choose</option><option value="h"' + (x.ion === "h" ? " selected" : "") + '>H₃O⁺</option><option value="oh"' + (x.ion === "oh" ? " selected" : "") + ">OH⁻</option></select></td>" +
      ["ex", "vt", "ph"].map(function(f){ return '<td><input class="numin st-cell" type="text" inputmode="decimal" autocomplete="off" data-s2="' + i + '" data-f="' + f + '" aria-label="' + { ex:"Excess in mmol", vt:"Total volume in mL", ph:"pH" }[f] + lab + '" value="' + esc(x[f] || "") + '"' + dis + "></td>"; }).join("") +
      "<td>" + (done ? '<span class="st-ok">✓</span>' : '<button type="button" class="btn sm" data-s2chk="' + i + '" data-k="s2c' + i + '">Check</button>') + "</td></tr>";
  }
  function paint2(){
    MV.keepFocus($(".st-s2b", host), function(){ $(".st-s2b", host).innerHTML = s2.rows.map(s2rowHTML).join(""); });
    $(".st-s2fb", host).innerHTML = s2msg ? MV.fbHTML(s2msg.k, s2msg.h) : "";
    var pts = s2.rows.map(function(r, i){ return S.s2[i] ? { v:+r.v, p:TL.ph(REF, +r.v), lab:"pH " + fx(TL.ph(REF, +r.v), 2) } : null; }).filter(Boolean);
    var sv = $("#st-s2cv");
    sv.innerHTML = TL.curveSVG({ x0:0, x1:40, xl:"NaOH added (mL)", curves:[{ s:REF }], pts:pts });
    sv.setAttribute("aria-label", "Reference curve with " + pts.length + " checked point" + (pts.length === 1 ? "" : "s") + (pts.length ? ": " + pts.map(function(q){ return fx(q.v, 1) + " mL, pH " + fx(q.p, 2); }).join("; ") : "") + ".");
  }
  function num1(s){ var p = MV.parseNum(String(s || "").trim()); return p && p.length === 1 ? p[0] : null; }
  host.addEventListener("input", function(e){ var t = e.target; if (t.dataset && t.dataset.s2 != null) { var i = t.dataset.s2; S.s2in[i] = S.s2in[i] || {}; S.s2in[i][t.dataset.f] = t.value; api.save(); } });
  host.addEventListener("change", function(e){ var t = e.target; if (t.tagName === "SELECT" && t.dataset.s2 != null) { var i = t.dataset.s2; S.s2in[i] = S.s2in[i] || {}; S.s2in[i].ion = t.value; api.save(); } });
  $(".st-s2b", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-s2chk]"); if (!b) return;
    var i = +b.dataset.s2chk, r = s2.rows[i], x = S.s2in[i] || {}, ans = MV.ans(r), ex = num1(x.ex), vt = num1(x.vt), p = num1(x.ph), at = " (" + r.v + " mL)";
    if (!x.ion || ex == null || vt == null || p == null) s2msg = { k:"bad", h:"Fill in all four cells of the " + r.v + " mL row: the ion, the excess, the total volume and the pH." };
    else if (x.ion !== r.ion) s2msg = { k:"bad", h:"<strong>✗ Not quite" + at + ".</strong> Compare <i>n</i>(OH⁻) added with the 2.00 mmol of H₃O⁺ at the start: which one is left over?" };
    else if (!near(ex, ans[0], 0.01)) s2msg = { k:"bad", h:"<strong>✗ Not quite" + at + ".</strong> Excess = the larger amount − the smaller, each from <i>n</i> = <i>cV</i> in mmol." };
    else if (!near(vt, ans[1], 0.05)) s2msg = { k:"bad", h:"<strong>✗ Not quite" + at + ".</strong> The flask now holds acid <strong>and</strong> the base you added. Divide by the total volume." };
    else if (!near(p, ans[2], 0.011)) s2msg = { k:"bad", h:"<strong>✗ Not quite" + at + ".</strong> " + (r.ion === "oh" ? (near(p, PKW - ans[2], 0.02) ? "Past equivalence, OH⁻ is in excess: find pOH first, then pH = 14.00 − pOH." : "Divide the excess OH⁻ by the total volume, find pOH, then pH = 14.00 − pOH.") : "pH = −log(excess H₃O⁺ ÷ total volume).") };
    else { S.s2[i] = true; s2msg = { k:"good", h:"<strong>✓ " + r.v + " mL row correct.</strong> pH " + fx(ans[2], 2) + ": the point lights up on the curve." }; }
    api.save(); paint2(); MV.focusFb($(".st-s2fb", host));
  });

  // Station 3
  var rows3 = s3.rows.map(function(r){ return { v:+r[0], p:+r[1], t:r[0] }; });
  var rowRG = radios($(".st-s3rows", host), { label:"HCl added (mL)", cls:"chips", options:rows3.map(function(r){ return { id:r.t, t:r.t + " mL" }; }), value:S.s3.pick || "", onChange:function(v){ S.s3.pick = v; s3msg = judgeRow(v); if (s3msg.k === "good") S.s3.found = true; api.save(); paint3(); } });
  function judgeRow(t){
    var v = +t, ex = TL.excess(BASE, v), p = TL.ph(BASE, v);
    if (t === MV.ans(s3)) return { k:"good", h:"<strong>✓ Right: the " + t + " mL row.</strong> " + s3.odd };
    if (!v) return { k:"bad", h:"<strong>✗ That row fits.</strong> Only base: [OH⁻] = 0.100 mol/L, so pOH 1.00 and pH 13.00." };
    return { k:"bad", h:"<strong>✗ That row fits.</strong> Excess " + ionTxt(ex.ion) + " = " + mmol(ex.mmol) + " mmol in " + vol(ex.Vt) + " mL gives pH " + fx(p, 2) + "." };
  }
  function paint3(){
    var found = !!S.s3.found, sv = $("#st-s3cv");
    sv.innerHTML = TL.curveSVG({ x0:0, x1:16, xl:"HCl added (mL)", curves:found ? [{ s:BASE, col:"--ink-2", w:2, dash:"6 5" }] : [],
      pts:rows3.map(function(r){ var odd = found && r.t === MV.ans(s3); return { v:r.v, p:r.p, col:odd ? "--red" : "--pen", r:odd ? 7 : 5, lab:odd ? "doesn’t fit" : "" }; }) });
    sv.setAttribute("aria-label", "Model data points falling from pH 13.00 at 0 mL to pH 1.85 at 15.0 mL, with a steep drop between 12.4 and 12.6 mL." + (found ? " The dashed model curve passes through every point except 15.0 mL, which sits below it." : ""));
    $(".st-s3fb", host).innerHTML = s3msg ? MV.fbHTML(s3msg.k, s3msg.h) : "";
    $(".st-s3eqfb", host).innerHTML = s3eq ? MV.fbHTML(s3eq.k, s3eq.h) : (S.s3.eqOk ? MV.fbHTML("good", eqGood()) : "");
  }
  function eqGood(){ return "<strong>✓ 12.5 mL, the middle of the jump between 12.4 and 12.6 mL.</strong> Check: <i>n</i>(NaOH) = 0.100 × 12.5 = 1.25 mmol, which needs 12.5 mL of 0.100 mol/L HCl. This curve falls, because base is in the flask."; }
  $("#st-s3eq").value = S.s3.eq || "";
  $("#st-s3eq").addEventListener("input", function(e){ S.s3.eq = e.target.value; api.save(); });
  function chk3(){
    var x = num1(S.s3.eq);
    if (x == null) s3eq = { k:"bad", h:"Enter a volume in mL." };
    else if (near(x, 12.5, 0.05)) { S.s3.eqOk = true; s3eq = { k:"good", h:eqGood() }; }
    else if (near(x, 12.4, 0.01) || near(x, 12.6, 0.01)) s3eq = { k:"bad", h:"<strong>✗ Not quite.</strong> The jump lies between 12.4 and 12.6 mL: take the middle." };
    else s3eq = { k:"bad", h:"<strong>✗ Not quite.</strong> Look for the steepest drop in pH: between which two rows does it happen?" };
    api.save(); paint3(); MV.focusFb($(".st-s3eqfb", host));
  }
  $("#st-s3chk").addEventListener("click", chk3);
  $("#st-s3eq").addEventListener("keydown", function(e){ if (e.key === "Enter") { e.preventDefault(); chk3(); } });

  // Station 4
  radios($(".st-s4ind", host), { label:"Indicator", cls:"chips", options:indOpts(true), value:S.ind4, onChange:function(v){ S.ind4 = v; api.save(); paint4(); } });
  function paint4(){
    var I = IND[S.ind4], sv = $("#st-s4cv");
    sv.innerHTML = TL.curveSVG({ x0:0, x1:40, xl:"Base added (mL)", band:I ? S.ind4 : null, curves:[{ s:REF }, { s:DIL, col:"--f3", dash:"8 5" }], eq:{ v:20, p:TL.ph(REF, 20) } });
    function two(f){ return f(REF) + " (0.100) · " + f(DIL) + " (0.0100)"; }
    var rows = [["Start pH", two(function(s){ return fx(TL.ph(s, 0), 2); })],
      ["pH from 19.80 to 20.20 mL", two(function(s){ return fx(TL.ph(s, 19.8), 2) + " → " + fx(TL.ph(s, 20.2), 2); })]];
    if (I) { var mid = (I.lo + I.hi) / 2; rows.push(["Endpoint with " + I.nm + " (middle of its range, pH " + fx(mid, 2) + ")", two(function(s){ return fx(TL.volAt(s, mid, 0, 40), 2) + " mL"; }) + "; equivalence 20.00 mL"]); }
    else rows.push(["Endpoint", muted("choose an indicator")]);
    $(".st-s4read", host).innerHTML = MV.readoutHTML(rows);
    sv.setAttribute("aria-label", "Two titration curves. 0.100 mol/L: starts at pH " + fx(TL.ph(REF, 0), 2) + ", jumps from " + fx(TL.ph(REF, 19.8), 2) + " to " + fx(TL.ph(REF, 20.2), 2) + ". 0.0100 mol/L: starts at pH " + fx(TL.ph(DIL, 0), 2) + ", jumps from " + fx(TL.ph(DIL, 19.8), 2) + " to " + fx(TL.ph(DIL, 20.2), 2) + ". Both reach pH 7.00 at 20.00 mL." + (I ? " The " + I.nm + " band is shaded." : ""));
  }
  paint1(); paint2(); paint3(); paint4();
  return {};
}

// ---------- Performance task: Plan the titration ----------
var TASK_HCL = 0.08; // the plan's "about 0.0800 mol/L" HCl
var task = (function(){
  var S = null, api = null, rg = [];
  var VS = ["10.0", "20.0", "25.0"], CS = ["0.050", "0.100", "0.200"];
  function read(){ return { V:VS.indexOf(S && S.V) >= 0 ? S.V : "", c:CS.indexOf(S && S.c) >= 0 ? S.c : "", ind:S && IND[S.ind] ? S.ind : "" }; }
  function ep(d){ return TASK_HCL * (+d.V) / (+d.c); }
  function tkLabel(k){ var p = k.split("|"); return p[0] + " mL sample, " + p[1] + " mol/L NaOH, " + (IND[p[2]] ? IND[p[2]].nm : p[2]) + " (endpoint " + fx(TASK_HCL * (+p[0]) / (+p[1]), 1) + " mL)"; }
  function paint(){
    var d = read(), pv = $("#st-tkcv"), rows = [];
    if (d.V && d.c) {
      var s = sysOf(TASK_HCL, +d.V, +d.c), e = ep(d), I = IND[d.ind];
      pv.innerHTML = TL.curveSVG({ x0:0, x1:50, xl:"NaOH added (mL)", band:d.ind || null, curves:[{ s:s }], eq:{ v:e, p:TL.ph(s, e), label:"equivalence " + fx(e, 1) + " mL" } });
      pv.setAttribute("aria-label", "Simulated curve: equivalence at " + fx(e, 1) + " mL, pH " + fx(TL.ph(s, e), 2) + "." + (I ? " The " + I.nm + " band (" + fx(I.lo, 1) + " to " + fx(I.hi, 1) + ") is shaded." : ""));
      rows.push(["Endpoint volume", "0.0800 × " + d.V + " ÷ " + d.c + " = <strong>" + fx(e, 1) + " mL</strong>"]);
    } else { pv.innerHTML = ""; pv.setAttribute("aria-label", "Choose a sample volume and a NaOH concentration to see the curve."); rows.push(["Endpoint volume", muted("choose a sample volume and a NaOH concentration")]); }
    rows.push(["Equivalence pH", fx(PKW / 2, 2)]);
    rows.push(["Indicator range", d.ind ? IND[d.ind].nm + ": " + fx(IND[d.ind].lo, 1) + "–" + fx(IND[d.ind].hi, 1) : muted("choose an indicator")]);
    $("#st-tkread").innerHTML = MV.readoutHTML(rows);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S;
      inp.innerHTML = '<div class="st-tkrow" data-t="V"></div><div class="st-tkrow" data-t="c"></div><div class="st-tkrow" data-t="ind"></div>';
      pv.innerHTML = '<h4 class="st-h4">Simulated curve</h4><svg class="st-cv" id="st-tkcv" viewBox="0 0 ' + TL.CW + " " + TL.CH + '" role="img" aria-label=""></svg><dl class="read" id="st-tkread" aria-live="polite"></dl>';
      function on(k){ return function(v){ S[k] = v; api.save(); paint(); api.update(); }; }
      rg = [radios($('[data-t="V"]', inp), { label:"Sample volume (mL)", cls:"chips", options:VS.map(function(x){ return { id:x, t:x }; }), value:S.V || "", onChange:on("V") }),
        radios($('[data-t="c"]', inp), { label:"NaOH concentration (mol/L)", cls:"chips", options:CS.map(function(x){ return { id:x, t:x }; }), value:S.c || "", onChange:on("c") }),
        radios($('[data-t="ind"]', inp), { label:"Indicator", cls:"chips", options:indOpts(false), value:S.ind || "", onChange:on("ind") })];
      paint();
    },
    read:read,
    valid:function(d){ return d.V && d.c && d.ind ? true : "Choose a sample volume, a NaOH concentration and an indicator."; },
    checks:function(d){ var e = ep(d), I = IND[d.ind], eqp = PKW / 2; return [e >= 15 - 1e-9 && e <= 35 + 1e-9, !!I && I.lo <= eqp && eqp <= I.hi, +d.V >= 20 - 1e-9]; },
    key:function(d){ return d.V + "|" + d.c + "|" + d.ind; },
    label:tkLabel,
    text:function(k){ return MV.plain(tkLabel(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task,
  onShow:function(){ try { finalExtras(); } catch (e) {} }
});
})();
