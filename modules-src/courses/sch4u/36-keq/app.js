// SCH4U 36 Quantitative Equilibrium (Keq): hero (three H₂/I₂/HI flasks settle and all land on K = 36), ICE table workbench
// (Explore: C7 ICE solver with an exact solver, small-x approximation and 5% check; C8 concentration–time graph and Q/K meter),
// Determine K in the lab (Part 3: colorimetry stations with model data), "Solve it" number entry and the
// "Same equilibrium, different starts" designer task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, CF = MV.chem.f, M = "−";

function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function neg(s){ return String(s).replace(/-/g, M); }
var SUPD = "⁰¹²³⁴⁵⁶⁷⁸⁹";
function toSup(e){ return String(e).split("").map(function(c){ return c === "-" ? "⁻" : SUPD[+c]; }).join(""); }
function sci(v, sf){
  if (v === 0) return "0";
  var e = Math.floor(Math.log10(Math.abs(v))), ms = (v / Math.pow(10, e)).toFixed(sf - 1);
  if (Math.abs(+ms) >= 10) { e++; ms = (v / Math.pow(10, e)).toFixed(sf - 1); }
  return neg(ms) + " × 10" + toSup(e);
}
// concentrations: 2 decimal places, or 2 significant figures in scientific notation when small (plan readout rule)
function fmt(v){ if (Math.abs(v) < 1e-15) return "0"; var a = Math.abs(v); return a >= 0.095 && a < 1000 ? neg(v.toFixed(2)) : sci(v, 2); }
// K and Q values: 3 significant figures
function fmtK(v){ if (Math.abs(v) < 1e-300) return "0"; var a = Math.abs(v); return a >= 0.0995 && a < 1000 ? neg(v.toPrecision(3)) : sci(v, 3); }
function pct(v){ return v >= 10 ? Math.round(v) + "%" : v >= 1 ? v.toFixed(1) + "%" : v.toFixed(2) + "%"; }
function powS(n){ return n === 2 ? "²" : n === 3 ? "³" : ""; }
// number entry: 4.0e-3, 4.0 × 10^-3, 4.0x10^-3, 4.0 × 10⁻³ (scientific notation accepted)
function parseSci(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/\s+/g, "").replace(/[−–]/g, "-");
  if (!s) return null;
  s = s.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function(m){ return "^" + m.split("").map(function(c){ return c === "⁻" ? "-" : String(SUPD.indexOf(c)); }).join(""); });
  s = s.replace(/[×xX*·]10\^?\(?([+-]?\d+)\)?$/, "e$1").replace(/^10\^\(?([+-]?\d+)\)?$/, "1e$1");
  var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null;
}
function near(a, b, tol){ return a != null && Math.abs(a - b) <= (tol || 0.02) * Math.max(Math.abs(b), 1e-300); }

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–19) — segmented control or chip row as a real radio group (arrow keys,
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
  return { set:function(id){ id = id == null ? "" : String(id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- @component C7 iceModel — reactions, Q, an exact solver (bisection on ln Q − ln K over the allowed extent) and the
// small-x approximation. Extent x > 0 is a shift right; concentrations c = c₀ + coefficient · x. Solids are left out of Q.
// Every K is a model value (plan §6). R4's K (0.010) is not in the plan; it is a local model value.
var RX = {
  r1:{ K:36, sp:[{ f:"H2", ph:"g", c:-1 }, { f:"I2", ph:"g", c:-1 }, { f:"HI", ph:"g", c:2 }] },
  r2:{ K:0.50, sp:[{ f:"N2", ph:"g", c:-1 }, { f:"H2", ph:"g", c:-3 }, { f:"NH3", ph:"g", c:2 }] },
  r3:{ K:4.0e-6, sp:[{ f:"X2", ph:"g", c:-1 }, { f:"X", ph:"g", c:2 }] },
  r4:{ K:0.010, sp:[{ f:"CaCO3", ph:"s", c:-1, solid:true }, { f:"CaO", ph:"s", c:1, solid:true }, { f:"CO2", ph:"g", c:1 }] } // VERIFY: R4 K = 0.010 is a local model value
};
var MCACO3 = 100.09; // g/mol from MV.chem.data.M below (Ca + C + 3 O)
(function(){ var Mm = MV.chem.data.M; MCACO3 = Mm.Ca + Mm.C + 3 * Mm.O; })();
var R3C = [1.0e-6, 0.25, 1.0, 4.0], R4G = [10, 20, 40];
function Qval(rx, c){
  var num = 1, den = 1, nz = false, dz = false;
  RX[rx].sp.forEach(function(s, i){ if (s.solid) return; var v = Math.max(0, c[i]), n = Math.abs(s.c); if (s.c > 0) { if (v <= 0) nz = true; else num *= Math.pow(v, n); } else { if (v <= 0) dz = true; else den *= Math.pow(v, n); } });
  if (dz && nz) return NaN; if (dz) return Infinity; if (nz) return 0; return num / den;
}
function at(rx, c0, x){ return RX[rx].sp.map(function(s, i){ return s.solid ? c0[i] : Math.max(0, c0[i] + s.c * x); }); }
function solveX(rx, c0){
  var R = RX[rx], lo = -Infinity, hi = Infinity;
  R.sp.forEach(function(s, i){ if (s.solid) return; if (s.c < 0) hi = Math.min(hi, c0[i] / -s.c); else lo = Math.max(lo, -c0[i] / s.c); });
  if (rx === "r4") hi = Math.min(hi, c0[0] / MCACO3); // grams of CaCO₃ in the 1.0 L flask
  if (!(hi > lo) || !isFinite(hi) || !isFinite(lo)) return 0;
  var lk = Math.log(R.K);
  for (var k = 0; k < 200; k++) { var m = (lo + hi) / 2, q = Qval(rx, at(rx, c0, m)); if (Math.log(q) - lk < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function approxX(rx, c0){ return Math.sqrt(RX[rx].K * c0[0]) / 2; } // R3 only: (2x)² ÷ c₀ = K
function dirOf(Q, K){
  if (isNaN(Q)) return { d:0, none:true };
  if (Q !== Infinity && Math.abs(Q / K - 1) < 1e-9) return { d:0 };
  return { d:Q < K ? 1 : -1 };
}
function spHTML(s){ return CF(s.f) + "(" + s.ph + ")"; }
function exprHTML(rx){
  var R = RX[rx], num = [], den = [], left = [];
  R.sp.forEach(function(s){ if (s.solid) { left.push(spHTML(s)); return; } var t = "[" + CF(s.f) + "]" + (Math.abs(s.c) > 1 ? "<sup>" + Math.abs(s.c) + "</sup>" : ""); (s.c > 0 ? num : den).push(t); });
  var h = "<i>K</i> = " + (num.join("") || "1") + (den.length ? " ÷ " + (den.length > 1 ? "(" + den.join("") + ")" : den[0]) : "");
  if (left.length) h += ' <span class="kq-solid">' + left.join(", ") + ': <span class="kq-tag">left out</span></span>';
  return h;
}
function subst(rx, c){
  var num = [], den = [];
  RX[rx].sp.forEach(function(s, i){ if (s.solid) return; var n = Math.abs(s.c), t = fmt(c[i]); if (n > 1 && t.indexOf("×") >= 0) t = "(" + t + ")"; t += powS(n); (s.c > 0 ? num : den).push(t); });
  return (num.join(" × ") || "1") + (den.length ? " ÷ " + (den.length > 1 ? "(" + den.join(" × ") + ")" : den[0]) : "");
}
function changeTxt(c){ var n = Math.abs(c); return (c < 0 ? M : "+") + (n > 1 ? n : "") + "<i>x</i>"; }
function amtTxt(rx, i, v){ return rx === "r4" && i === 0 ? v + " g" : "present"; }

// ---------- @component C7 iceTable — I / C / E rows; solids and liquids greyed with a "left out" tag ----------
function iceHTML(rx, c0, x, eq){
  var R = RX[rx];
  function cell(s, h){ return "<td" + (s.solid ? ' class="kq-solid"' : "") + ">" + h + "</td>"; }
  return '<div class="kq-icew"><table class="kq-ice"><caption>ICE table (mol/L)</caption><thead><tr><th scope="col"><span class="vh">Row</span></th>' +
    R.sp.map(function(s){ return '<th scope="col"' + (s.solid ? ' class="kq-solid"' : "") + ">" + spHTML(s) + (s.solid ? '<br><span class="kq-tag">left out</span>' : "") + "</th>"; }).join("") + "</tr></thead><tbody>" +
    '<tr><th scope="row">I</th>' + R.sp.map(function(s, i){ return cell(s, s.solid ? amtTxt(rx, i, c0[i]) : fmt(c0[i])); }).join("") + "</tr>" +
    '<tr><th scope="row">C</th>' + R.sp.map(function(s){ return cell(s, changeTxt(s.c)); }).join("") + "</tr>" +
    '<tr><th scope="row">E</th>' + R.sp.map(function(s, i){ return cell(s, s.solid ? amtTxt(rx, i, c0[i]) : fmt(eq[i])); }).join("") + "</tr></tbody></table></div>";
}

// ---------- @component C8 concGraph — concentration–time graph (SVG): reactants --eq-r, products --eq-p, dashed lines where
// each settles; prog (0–1) draws the run. concGraph(rx, c0, eq, prog) -> {svg, aria} ----------
function niceMax(m){ if (!(m > 0)) return 1; var e = Math.pow(10, Math.floor(Math.log10(m))), n = m / e; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * e; }
function easeG(t){ return (1 - Math.exp(-4 * t)) / (1 - Math.exp(-4)); }
function concGraph(rx, c0, eq, prog){
  var R = RX[rx], X0 = 70, X1 = 440, Y0 = 186, Y1 = 18, ser = [], mx = 0, rIdx = 0;
  R.sp.forEach(function(s, i){ if (s.solid) return; mx = Math.max(mx, c0[i], eq[i]); ser.push({ s:s, i:i, col:s.c < 0 ? "var(--eq-r)" : "var(--eq-p)", dash:s.c < 0 ? (rIdx++ ? "7 5" : "") : "" }); });
  var ym = niceMax(mx * 1.08);
  function X(t){ return X0 + (X1 - X0) * t; } function Y(v){ return Y0 - (Y0 - Y1) * v / ym; }
  var h = '<rect x="' + X0 + '" y="' + Y1 + '" width="' + (X1 - X0) + '" height="' + (Y0 - Y1) + '" fill="none" stroke="var(--rule)"/>';
  [0, 0.5, 1].forEach(function(f){ var v = ym * f, y = Y(v); h += '<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '" stroke="var(--rule)" stroke-width="1"/><text x="' + (X0 - 6) + '" y="' + y + '" text-anchor="end" dominant-baseline="central" font-size="12" fill="var(--ink-2)">' + fmt(v) + "</text>"; });
  h += '<text x="' + ((X0 + X1) / 2) + '" y="' + (Y0 + 22) + '" text-anchor="middle" font-size="13" fill="var(--ink-2)">time →</text>';
  h += '<text x="14" y="' + ((Y0 + Y1) / 2) + '" text-anchor="middle" font-size="13" fill="var(--ink-2)" transform="rotate(-90 14 ' + ((Y0 + Y1) / 2) + ')">mol/L</text>';
  var labs = [];
  ser.forEach(function(q){
    var a = c0[q.i], b = eq[q.i], pts = [];
    if (prog >= 1) h += '<line x1="' + X0 + '" y1="' + r1(Y(b)) + '" x2="' + X1 + '" y2="' + r1(Y(b)) + '" stroke="' + q.col + '" stroke-width="1.4" stroke-dasharray="3 4" opacity=".7"/>';
    var n = Math.max(1, Math.round(60 * prog));
    for (var k = 0; k <= n; k++) { var t = prog * k / n; pts.push(r1(X(t)) + "," + r1(Y(lerp(a, b, easeG(t))))); }
    if (prog > 0) h += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + q.col + '" stroke-width="3" stroke-linejoin="round"' + (q.dash ? ' stroke-dasharray="' + q.dash + '"' : "") + "/>";
    var tE = prog, vE = lerp(a, b, easeG(tE));
    h += '<circle cx="' + r1(X(tE)) + '" cy="' + r1(Y(vE)) + '" r="4.5" fill="' + q.col + '"/>';
    labs.push({ y:Y(vE), x:X(tE), t:CF(q.s.f), col:q.col });
  });
  labs.sort(function(p, q){ return p.y - q.y; });
  for (var k = 1; k < labs.length; k++) if (labs[k].y - labs[k - 1].y < 15) labs[k].y = labs[k - 1].y + 15;
  labs.forEach(function(L){ h += '<text x="' + r1(Math.min(L.x + 9, X1 + 8)) + '" y="' + r1(L.y) + '" dominant-baseline="central" font-size="13" font-weight="700" fill="' + L.col + '" stroke="var(--sheet)" stroke-width="4" paint-order="stroke">' + MV.plain(L.t) + "</text>"; });
  var aria = "Concentration–time graph. " + ser.map(function(q){ return MV.plain(CF(q.s.f)) + " starts at " + MV.plain(fmt(c0[q.i])) + (prog >= 1 ? " and settles at " + MV.plain(fmt(eq[q.i])) : "") + " mol/L"; }).join("; ") + (prog >= 1 ? "." : ". Press Run to equilibrium.");
  return { svg:h, aria:aria };
}

// ---------- @component C8 qkMeter — Q needle on a log scale with K marked (needle --ink); one-line form for phones ----------
function qkLine(Q, K){
  var d = dirOf(Q, K);
  if (d.none) return "<i>Q</i> undefined: nothing can react";
  var qs = Q === Infinity ? "undefined (no reactants)" : fmtK(Q);
  return "<i>Q</i> = " + qs + " " + (d.d > 0 ? "&lt;" : d.d < 0 ? "&gt;" : "=") + " <i>K</i> = " + fmtK(K) + " → " + (d.d > 0 ? "right" : d.d < 0 ? "left" : "no shift");
}
function qkMeter(Q, K){
  var A = 40, B = 480, Yl = 40, lk = Math.log10(K), span = 4;
  function X(lq){ return A + (B - A) * (Math.max(-span, Math.min(span, lq - lk)) + span) / (2 * span); }
  var h = '<line x1="' + A + '" y1="' + Yl + '" x2="' + B + '" y2="' + Yl + '" stroke="var(--ink-2)" stroke-width="2"/>';
  for (var k = -span; k <= span; k++) { var xx = X(lk + k); h += '<line x1="' + r1(xx) + '" y1="' + (Yl - 4) + '" x2="' + r1(xx) + '" y2="' + (Yl + 4) + '" stroke="var(--ink-2)" stroke-width="1.2"/>'; }
  var xk = X(lk);
  h += '<rect x="' + r1(xk - 3) + '" y="' + (Yl - 14) + '" width="6" height="28" rx="2" fill="var(--eq-p)"/><text x="' + r1(xk) + '" y="' + (Yl + 26) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--eq-p)">K = ' + MV.plain(fmtK(K)) + "</text>";
  h += '<text x="' + A + '" y="' + (Yl + 26) + '" font-size="11" fill="var(--ink-2)">smaller</text><text x="' + B + '" y="' + (Yl + 26) + '" text-anchor="end" font-size="11" fill="var(--ink-2)">larger (log scale)</text>';
  if (!isNaN(Q)) {
    var lq = Q === 0 ? -1e9 : Q === Infinity ? 1e9 : Math.log10(Q), xq = X(lq), d = dirOf(Q, K).d;
    h += '<path d="M' + r1(xq) + " " + (Yl - 4) + " l-7 -13 h14 z\" fill=\"var(--ink)\"/>";
    var ql = Q === 0 ? "Q = 0" : Q === Infinity ? "Q undefined" : "Q = " + MV.plain(fmtK(Q));
    h += '<text x="' + r1(Math.max(A + 30, Math.min(B - 30, xq))) + '" y="' + (Yl - 22) + '" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">' + ql + "</text>";
    if (d) { var x2 = xq + d * Math.min(70, Math.abs(xk - xq) - 6); if (Math.abs(xk - xq) > 14) h += '<line x1="' + r1(xq) + '" y1="' + (Yl + 8) + '" x2="' + r1(x2) + '" y2="' + (Yl + 8) + '" stroke="var(--ink)" stroke-width="2"/><path d="M' + r1(x2 + d * 6) + " " + (Yl + 8) + " l" + (-d * 8) + " -5 v10 z\" fill=\"var(--ink)\"/>"; }
  }
  return h;
}

// ---------- hero: three flasks of H₂ + I₂ ⇌ 2HI settle to different mixtures, all with K = 36 ----------
var HST = [[1.00, 1.00, 0], [0, 0, 1.00], [0.50, 1.00, 0.50]], HLAB = ["Start: H₂ + I₂", "Start: HI only", "Start: a mix"];
function heroSVG(T, cap){
  var h = "";
  HST.forEach(function(c0, k){
    var cx = 95 + k * 175, x = solveX("r1", c0), t = easeG(T), c = at("r1", c0, x * t), Q = Qval("r1", c);
    h += '<text x="' + cx + '" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">' + HLAB[k] + "</text>";
    h += '<path d="M' + (cx - 22) + " 34 v52 l-52 108 q-6 14 10 14 h128 q16 0 10 -14 l-52 -108 v-52\" fill=\"var(--sheet)\" stroke=\"var(--ink-2)\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>";
    var base = 200;
    c.forEach(function(v, i){
      var bx = cx - 39 + i * 28, bh = v / 1.6 * 96, col = i < 2 ? "var(--eq-r)" : "var(--eq-p)";
      h += '<rect x="' + bx + '" y="' + r1(base - bh) + '" width="22" height="' + r1(Math.max(0, bh)) + '" fill="' + col + '"' + (i === 1 ? ' fill-opacity=".55"' : "") + "/>";
      h += '<text x="' + (bx + 11) + '" y="' + (base + 14) + '" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + ["H₂", "I₂", "HI"][i] + "</text>";
    });
    var qs = isNaN(Q) ? "?" : Q === Infinity ? "undefined" : MV.plain(fmtK(Q));
    h += '<text x="' + cx + '" y="244" text-anchor="middle" font-size="12.5" fill="var(--ink-2)">[HI]² ÷ ([H₂][I₂])</text><text x="' + cx + '" y="264" text-anchor="middle" font-size="16" font-weight="700" fill="' + (T >= 1 ? "var(--eq-p)" : "var(--ink)") + '">= ' + qs + "</text>";
  });
  h += '<text x="270" y="292" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)" opacity="' + r1(cap) + '">Same temperature, same K</text>';
  return h;
}
function hero(){
  var svg = $("#kq-hx-svg"), cap = $("#kq-hx-cap"), rep = $("#kq-hx-replay"); if (!svg) return;
  var run = 0, tw = null;
  function fin(){ svg.innerHTML = heroSVG(1, 1); cap.textContent = "Three different starts, three different equilibrium mixtures, one K: 36."; rep.hidden = false; }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true;
    svg.innerHTML = heroSVG(0, 0); cap.textContent = "Three flasks of H₂(g) + I₂(g) ⇌ 2HI(g) start with different mixtures.";
    MV.wait(1200, function(){
      if (id !== run) return; cap.textContent = "Each mixture reacts until it settles. Watch the readouts.";
      tw = MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){ if (id === run) svg.innerHTML = heroSVG(t, 0); }, done:function(){
        tw = null; if (id !== run) return;
        tw = MV.tween({ dur:700, step:function(t){ if (id === run) svg.innerHTML = heroSVG(1, t); }, done:function(){ tw = null; if (id === run) fin(); } });
      } });
    });
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) fin(); else play(); });
  if (MV.reduceMotion) fin(); else play();
}

// ---------- Explore: ICE table workbench ----------
var DATA = { r1:[[0.25, 0.25, 1.50], [0.375, 0.375, 2.25]], r2:[[0.50, 1.0, 0.50], [0.25, 0.50, 0.125]], r3:[[1.0, 2.0e-3], [4.0, 4.0e-3]], r4:[[10, 10, 0.010], [40, 40, 0.010]] };
var DEF = { r1:{ h:1, i:1, hi:0 }, r2:["1.0", "3.0", "0"], r3:2, r4:0 };
function slider(id, lab, v, dis){
  return '<div class="kq-sl"><label for="' + id + '">' + lab + '</label><input type="range" id="' + id + '" data-sl="' + id + '" min="0" max="2" step="0.25" value="' + v + '"' + (dis ? " disabled" : "") + '><output for="' + id + '">' + v.toFixed(2) + " mol/L</output></div>";
}
function shiftKeys(host){
  host.addEventListener("keydown", function(e){
    var el = e.target; if (!el.matches || !el.matches('input[type="range"]') || !e.shiftKey) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault(); el.value = Math.max(0, Math.min(2, +el.value + d * 0.5)); el.dispatchEvent(new Event("input", { bubbles:true }));
  });
}
function explore(host, api){
  var C = api.content, S = api.S, RW = C.rows, m = C.msgs;
  if (!RX[S.rx]) S.rx = "r1";
  if (["data", "ice", "qk"].indexOf(S.mode) < 0) S.mode = "ice";
  if (!S.r1 || typeof S.r1 !== "object") S.r1 = { h:1, i:1, hi:0 };
  if (!Array.isArray(S.r2)) S.r2 = DEF.r2.slice();
  if (!(S.r3 >= 0 && S.r3 < 4)) S.r3 = DEF.r3;
  if (!(S.r4 >= 0 && S.r4 < 3)) S.r4 = 0;
  S.set = S.set === 2 ? 2 : 1; S.approx = !!S.approx; S.kin = S.kin || "";
  var busy = false, prog = 0, tw = null, lastKey = "", ranKey = "";

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="kq-ctl"><div class="kq-rxc"></div><div class="kq-mdc"></div></div><div class="kq-in"></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p><div class="kq-grid" data-mv="graph"><div class="kq-left">' +
    '<p class="kq-expr"></p><div class="kq-gw"><svg class="kq-gsvg" viewBox="0 0 520 220" role="img" aria-label=""></svg></div>' +
    '<div class="kq-mw"><svg class="kq-msvg" viewBox="0 0 520 74" aria-hidden="true"></svg><p class="kq-qline" aria-live="polite"></p></div>' +
    '<div class="kq-acts"><button type="button" class="btn primary sm" data-k="kqrun">Run to equilibrium</button><button type="button" class="btn ghost sm" data-k="kqreset">Reset</button></div>' +
    '<p class="kq-cap" aria-live="polite"></p></div><div class="kq-right"><h4 class="kq-h4">Readout</h4><dl class="read kq-read" aria-live="polite"></dl><div class="kq-icebox"></div></div></div>';
  var inEl = $(".kq-in", host), gsvg = $(".kq-gsvg", host), msvg = $(".kq-msvg", host), readEl = $(".kq-read", host), iceEl = $(".kq-icebox", host), capEl = $(".kq-cap", host);
  var runB = host.querySelector('[data-k="kqrun"]'), resetB = host.querySelector('[data-k="kqreset"]');
  var RG = {};
  RG.rx = radios($(".kq-rxc", host), { label:"Reaction", aria:"Reaction", cls:"chips", options:C.reactions.map(function(r, i){ return { id:r.id, t:"R" + (i + 1) + ": " + r.t }; }), value:S.rx, onChange:function(v){ if (busy) return; S.rx = v; S.kChecked = false; changed(true); } });
  RG.mode = radios($(".kq-mdc", host), { label:"Mode", aria:"Workbench mode", options:C.modes, value:S.mode, onChange:function(v){ if (busy) return; S.mode = v; changed(true); } });

  function c0(){
    if (S.mode === "data") { var d = DATA[S.rx][S.set - 1]; return d.slice(); }
    if (S.rx === "r1") return [S.r1.h, S.r1.i, S.r1.hi];
    if (S.rx === "r2") return S.r2.map(function(v){ var n = parseSci(v); return n != null && n >= 0 ? Math.min(n, 10) : 0; });
    if (S.rx === "r3") return [R3C[S.r3], 0];
    return [R4G[S.r4], 0, 0];
  }
  function useApprox(){ return S.rx === "r3" && S.approx && S.mode !== "data"; }
  function state(){
    var a = c0(), x = S.mode === "data" ? 0 : useApprox() ? approxX(S.rx, a) : solveX(S.rx, a), e = S.mode === "data" ? a : at(S.rx, a, x);
    return { c0:a, x:x, eq:e, Q0:Qval(S.rx, a), K:RX[S.rx].K };
  }
  function key(){ return S.rx + "|" + S.mode + "|" + c0().join(",") + "|" + useApprox(); }

  function paintInputs(){
    var h = "", rxN = C.reactions.filter(function(r){ return r.id === S.rx; })[0], dis = busy;
    h += '<p class="kq-rxk">' + rxN.t + " · " + rxN.k + "</p>";
    if (S.mode === "data") {
      var R = RX[S.rx], d = DATA[S.rx][S.set - 1];
      h += '<div class="kq-setc"></div><table class="kq-data"><caption>Equilibrium data, set ' + S.set + ' (model data)</caption><thead><tr>' + R.sp.map(function(s){ return '<th scope="col"' + (s.solid ? ' class="kq-solid"' : "") + ">" + spHTML(s) + "</th>"; }).join("") + "</tr></thead><tbody><tr>" +
        R.sp.map(function(s, i){ return "<td" + (s.solid ? ' class="kq-solid"' : "") + ">" + (s.solid ? (S.rx === "r4" && i === 0 ? d[i] + " g" : "present") + ' <span class="kq-tag">left out</span>' : fmt(d[i]) + " mol/L") + "</td>"; }).join("") + "</tr></tbody></table>";
      h += '<div class="numrow kq-kin"><label for="kq-kin">Your <i>K</i>:</label><input class="numin" id="kq-kin" type="text" inputmode="decimal" autocomplete="off" value="' + esc(S.kin) + '"' + (dis ? " disabled" : "") + '><button type="button" class="btn primary sm" data-k="kqkchk"' + (dis ? " disabled" : "") + ">Check my <i>K</i></button></div><div class=\"kq-kfb\"></div>";
    } else if (S.rx === "r1") {
      h += slider("kq-h", "[H<sub>2</sub>]<sub>0</sub>", S.r1.h, dis) + slider("kq-i", "[I<sub>2</sub>]<sub>0</sub>", S.r1.i, dis) + slider("kq-hi", "[HI]<sub>0</sub>", S.r1.hi, dis);
    } else if (S.rx === "r2") {
      h += '<div class="kq-boxes">' + ["[N<sub>2</sub>]<sub>0</sub>", "[H<sub>2</sub>]<sub>0</sub>", "[NH<sub>3</sub>]<sub>0</sub>"].map(function(l, i){ return '<div class="numrow"><label for="kq-b' + i + '">' + l + '</label><input class="numin" id="kq-b' + i + '" data-bx="' + i + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(S.r2[i]) + '"' + (dis ? " disabled" : "") + '><span class="m">mol/L</span></div>'; }).join("") + '</div><p class="tiny muted">0 to 10 mol/L.</p>';
    } else if (S.rx === "r3") {
      h += '<div class="kq-r3c"></div><p class="kq-apx"><button type="button" class="kq-sw" role="switch" aria-checked="' + S.approx + '" data-k="kqapx"' + (dis ? " disabled" : "") + '><span class="kq-swk" aria-hidden="true"></span>' + C.approx + "</button></p>";
    } else {
      h += '<div class="kq-r4c"></div><p class="tiny muted">' + C.r4note + "</p>";
    }
    MV.keepFocus(inEl, function(){ inEl.innerHTML = h; });
    if (S.mode === "data") RG.set = radios($(".kq-setc", inEl), { label:"Data set", aria:"Data set", cls:"chips", options:[{ id:"1", t:"Set 1" }, { id:"2", t:"Set 2" }], value:String(S.set), onChange:function(v){ S.set = +v; S.kChecked = false; changed(true); } });
    if (S.mode !== "data" && S.rx === "r3") RG.r3 = radios($(".kq-r3c", inEl), { label:"[X<sub>2</sub>]<sub>0</sub>", aria:"Starting X2 concentration", cls:"chips", options:R3C.map(function(v, i){ return { id:String(i), t:fmt(v) + " mol/L" }; }), value:String(S.r3), onChange:function(v){ S.r3 = +v; changed(false); } });
    if (S.mode !== "data" && S.rx === "r4") RG.r4 = radios($(".kq-r4c", inEl), { label:"Amount of CaCO<sub>3</sub>(s)", aria:"Amount of calcium carbonate", cls:"chips", options:R4G.map(function(g, i){ return { id:String(i), t:g + " g" }; }), value:String(S.r4), onChange:function(v){ S.r4 = +v; changed(false); } });
    [RG.set, RG.r3, RG.r4].forEach(function(r){ if (r) r.lock(busy); });
  }
  function kfb(){
    var el = $(".kq-kfb", inEl); if (!el) return;
    if (!S.kChecked) { el.innerHTML = ""; return; }
    var v = parseSci(S.kin), st = state(), K = Qval(S.rx, st.c0);
    el.innerHTML = v == null ? MV.fbHTML("", "Enter a number, such as 0.75 or 4.0e-3.") : near(v, K, 0.01) ? MV.fbHTML("good", "<strong>✓ Matches the data:</strong> <i>K</i> = " + fmtK(K) + ".") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Compare your working with the Check row in the readout.");
  }

  function paint(){
    var st = state(), R = RX[S.rx], dm = S.mode === "data", k = key();
    if (k !== lastKey) { if (tw) { tw(); tw = null; } prog = ranKey === k ? 1 : 0; lastKey = k; }
    RG.rx.set(S.rx); RG.mode.set(S.mode); RG.rx.lock(busy); RG.mode.lock(busy);
    $(".kq-expr", host).innerHTML = exprHTML(S.rx);
    $(".kq-gw", host).hidden = dm; $(".kq-mw", host).hidden = dm; $(".kq-acts", host).hidden = dm;
    if (!dm) {
      var g = concGraph(S.rx, st.c0, st.eq, prog); gsvg.innerHTML = g.svg; gsvg.setAttribute("aria-label", g.aria);
      msvg.innerHTML = qkMeter(st.Q0, st.K); $(".kq-qline", host).innerHTML = qkLine(st.Q0, st.K);
    }
    runB.disabled = busy; resetB.disabled = busy;
    // readout
    var rows = [[RW.expr, exprHTML(S.rx)]];
    if (dm) {
      rows.push(["Data (set " + S.set + ")", R.sp.map(function(s, i){ return s.solid ? null : "[" + CF(s.f) + "] = " + fmt(st.c0[i]); }).filter(Boolean).join(", ") + " mol/L"]);
      rows.push([RW.check, S.kChecked ? subst(S.rx, st.c0) + " = " + fmtK(Qval(S.rx, st.c0)) : '<span class="muted">Enter your <i>K</i> and press Check my <i>K</i>.</span>']);
    } else {
      var Q0 = st.Q0, d = dirOf(Q0, st.K);
      rows.push([RW.q0, isNaN(Q0) ? "undefined (nothing can react)" : Q0 === Infinity ? "undefined (no reactants)" : Q0 === 0 ? "0 (no products)" : subst(S.rx, st.c0) + " = " + fmtK(Q0)]);
      rows.push([RW.dir, d.none ? "No reaction: a reactant and the product are both missing" : d.d > 0 ? "<i>Q</i> &lt; <i>K</i>: shifts right" : d.d < 0 ? "<i>Q</i> &gt; <i>K</i>: shifts left" : "<i>Q</i> = <i>K</i>: already at equilibrium"]);
      var xs = Math.abs(st.x) < 1e-15 ? "0 (no shift)" : st.x < 0 ? fmt(st.x) + " (shifts left by " + fmt(-st.x) + ")" : fmt(st.x);
      rows.push([RW.x, (useApprox() ? "≈ " : "") + xs]);
      if (S.rx === "r3") {
        if (useApprox()) { var p = st.x / st.c0[0] * 100; rows.push([RW.check5, "<i>x</i> ÷ " + fmt(st.c0[0]) + " = " + pct(p) + ": " + (p < 5 ? "valid" : "<strong>not valid</strong>; switch to the exact solution")]); }
        else rows.push(["Method", "exact (quadratic): 4<i>x</i>² = <i>K</i>(" + fmt(st.c0[0]) + " " + M + " <i>x</i>)"]);
      }
      rows.push([RW.eq, R.sp.map(function(s, i){ return s.solid ? null : "[" + CF(s.f) + "] = " + fmt(st.eq[i]); }).filter(Boolean).join(", ") + " mol/L"]);
      var Qe = Qval(S.rx, st.eq);
      rows.push([RW.check, isFinite(Qe) && !isNaN(Qe) ? subst(S.rx, st.eq) + " = " + fmtK(Qe) : "can’t be calculated: the shortcut broke down"]);
    }
    readEl.innerHTML = MV.readoutHTML(rows);
    iceEl.innerHTML = dm || S.mode === "qk" ? "" : iceHTML(S.rx, st.c0, st.x, st.eq);
    if (S.rx === "r3" && S.r3 === 0 && useApprox()) S.r3fail = true;
    kfb();
  }
  function changed(full){ if (full) { capEl.textContent = ""; paintInputs(); } else capEl.textContent = ""; api.save(); paint(); MV.changed(); }

  inEl.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.sl) { var v = +t.value, f = { "kq-h":"h", "kq-i":"i", "kq-hi":"hi" }[t.dataset.sl]; S.r1[f] = v; var o = t.parentNode.querySelector("output"); if (o) o.textContent = v.toFixed(2) + " mol/L"; capEl.textContent = ""; api.save(); paint(); MV.changed(); return; }
    if (t.dataset.bx != null) { S.r2[+t.dataset.bx] = t.value; capEl.textContent = ""; api.save(); paint(); MV.changed(); return; }
    if (t.id === "kq-kin") { S.kin = t.value; S.kChecked = false; api.save(); kfb(); MV.changed(); }
  });
  inEl.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "kq-kin") { var b = inEl.querySelector('[data-k="kqkchk"]'); if (b) b.click(); } });
  shiftKeys(inEl);
  inEl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.k === "kqapx") { S.approx = !S.approx; b.setAttribute("aria-checked", String(S.approx)); capEl.textContent = ""; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.k === "kqkchk") { S.kChecked = true; api.save(); paint(); MV.changed(); MV.focusFb($(".kq-kfb", inEl)); }
  });
  function capText(){
    var st = state(), R = RX[S.rx];
    return "At equilibrium: " + R.sp.map(function(s, i){ return s.solid ? null : "[" + MV.plain(CF(s.f)) + "] = " + MV.plain(fmt(st.eq[i])); }).filter(Boolean).join(", ") + " mol/L." + (useApprox() ? " (Using the approximation.)" : " Q now equals K.");
  }
  function runAnim(done){
    if (tw) { tw(); tw = null; }
    var k = key(); prog = 0; capEl.textContent = "";
    tw = MV.tween({ dur:1700, ease:function(t){ return t; }, step:function(t){ prog = t; var st = state(), g = concGraph(S.rx, st.c0, st.eq, prog); gsvg.innerHTML = g.svg; }, done:function(){
      tw = null; prog = 1; ranKey = k; paint(); capEl.textContent = capText(); if (done) done();
    } });
  }
  runB.addEventListener("click", function(){ if (busy) return; busy = true; paint(); paintInputs(); runAnim(function(){ busy = false; paintInputs(); paint(); runB.focus({ preventScroll:true }); }); });
  resetB.addEventListener("click", function(){
    if (busy) return;
    if (S.rx === "r1") S.r1 = { h:1, i:1, hi:0 }; else if (S.rx === "r2") S.r2 = DEF.r2.slice(); else if (S.rx === "r3") { S.r3 = DEF.r3; S.approx = false; } else S.r4 = 0;
    S.kin = ""; S.kChecked = false; ranKey = ""; changed(true);
  });

  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; }
      busy = true; ranKey = "";
      if (p.id === "p1") { S.rx = "r1"; S.mode = "ice"; S.r1 = { h:1, i:1, hi:0 }; }
      else if (p.id === "p2") { S.rx = "r1"; S.mode = "ice"; S.r1 = { h:0, i:0, hi:2 }; }
      else if (p.id === "p3") { S.rx = "r1"; S.mode = "qk"; S.r1 = { h:0.5, i:0.5, hi:2 }; }
      else { S.rx = "r4"; S.mode = "ice"; S.r4 = 0; }
      api.save(); paintInputs(); paint(); capEl.textContent = MV.plain(C.predSetup[p.id] || "");
    },
    run:function(p, done){
      function end(msg){ busy = false; paintInputs(); paint(); if (msg) capEl.textContent = msg; api.save(); MV.changed(); done(); }
      if (p.id !== "p4") { runAnim(function(){ end(p.id === "p3" ? "Q = 16 < K = 36, so the mixture shifts right: [HI] climbs from 2.00 to 2.25 mol/L." : p.id === "p2" ? "[HI] falls from 2.00 to 1.50 mol/L; [H₂] and [I₂] rise to 0.25 mol/L. The same mixture as P1." : capText()); }); return; }
      var gi = 0, seen = [];
      (function next(){
        S.r4 = gi; paintInputs(); paint();
        runAnim(function(){
          seen.push(R4G[gi] + " g: [CO₂] = 0.010 mol/L"); capEl.textContent = seen.join(" · ");
          if (++gi < 3) MV.wait(700, next); else end("[CO₂] = 0.010 mol/L with 10 g, 20 g and 40 g of CaCO₃(s): the same every time.");
        });
      })();
    }
  };

  function chal(id){
    var st = state();
    if (id === "tc1") {
      if (S.rx !== "r2" || S.mode !== "data") return { ok:false, msg:m.tc1.where };
      if (!String(S.kin).trim()) return { ok:false, msg:m.tc1.empty };
      var v = parseSci(S.kin); if (v == null) return { ok:false, msg:m.tc1.bad };
      if (near(v, 0.50, 0.01)) return { ok:true };
      if (S.set === 1) { if (near(v, 1.0, 0.02)) return { ok:false, msg:m.tc1.w1 }; if (near(v, 2.0, 0.02)) return { ok:false, msg:m.tc1.w2 }; if (near(v, 2 / 3, 0.02)) return { ok:false, msg:m.tc1.w067 }; }
      return { ok:false, msg:m.tc1.other };
    }
    if (id === "tc2") {
      if (S.rx !== "r1" || S.mode === "data") return { ok:false, msg:m.tc2.where };
      if (S.r1.hi !== 0) return { ok:false, msg:m.tc2.hi0 };
      var hi = st.eq[2];
      if (Math.abs(hi - 1.5) <= 0.005) return { ok:true };
      if ((S.r1.h === 1 && S.r1.i === 0.5) || (S.r1.h === 0.5 && S.r1.i === 1)) return { ok:false, msg:m.tc2.a1b05 };
      if (S.r1.h === 0.75 && S.r1.i === 0.75) return { ok:false, msg:m.tc2.a075 };
      return { ok:false, msg:m.tc2.reach.replace("{v}", MV.plain(fmt(hi))) };
    }
    if (S.rx !== "r3" || S.mode === "data") return { ok:false, msg:m.tc3.where };
    if (S.r3 === 1) return { ok:false, msg:m.tc3.m025 };
    if (S.r3 === 3) return { ok:false, msg:m.tc3.m4 };
    if (S.r3 === 2) return { ok:false, msg:m.tc3.m1 };
    if (S.approx) return { ok:false, msg:m.tc3.stay };
    if (!S.r3fail) return { ok:false, msg:m.tc3.first };
    return { ok:true };
  }
  paintInputs(); paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Determine K in the lab (virtual colorimetry, model data) ----------
var TR = [
  { fe0:2.2e-3, scn0:6.0e-4, rd:0.80, c:2.0e-4, fe:2.0e-3, scn:4.0e-4, K:250 },
  { fe0:1.2e-3, scn0:1.0e-3, rd:0.80, c:2.0e-4, fe:1.0e-3, scn:8.0e-4, K:250 },
  { fe0:2.1e-3, scn0:3.0e-4, rd:0.40, c:1.0e-4, fe:2.0e-3, scn:2.0e-4, K:250 }
];
var CAL = 4000; // reading ÷ 4000 = [FeSCN²⁺] in mol/L (plan's calibration, model data)
function cuvetteSVG(rd, shown){
  var op = Math.min(0.85, rd * 0.9);
  return '<rect x="20" y="58" width="150" height="10" rx="5" fill="var(--hi)" opacity=".7"/><rect x="250" y="58" width="80" height="10" rx="5" fill="var(--hi)" opacity="' + r1(0.7 - op * 0.6) + '"/>' +
    '<rect x="172" y="22" width="76" height="96" rx="6" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/><rect x="176" y="40" width="68" height="74" rx="4" fill="var(--red)" fill-opacity="' + r1(op * 100) / 100 + '"/>' +
    '<rect x="340" y="30" width="150" height="66" rx="10" fill="var(--ink)"/><text x="415" y="58" text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="700" fill="var(--sheet)" font-family="var(--font-ui)">' + (shown ? rd.toFixed(2) : "—") + '</text><text x="415" y="84" text-anchor="middle" font-size="11" fill="var(--sheet)">colorimeter reading</text>';
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3, F = function(s){ return CF(s); };
  if (!Array.isArray(S.v1)) S.v1 = ["", "", ""];
  if (!S.v2 || typeof S.v2 !== "object") S.v2 = {};
  if (!S.s3 || typeof S.s3 !== "object") S.s3 = { sel:{} }; S.s3.sel = S.s3.sel || {};
  S.meas = S.meas == null ? -1 : S.meas;
  var cvTw = null, shownRd = S.meas >= 0;
  host.innerHTML = '<p class="kq-note tiny muted">' + C.note + "</p>" +
    '<div class="kq-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="kq-cuvc"></div><svg class="kq-csvg" viewBox="0 0 510 140" role="img" aria-label=""></svg><p class="kq-ccap" aria-live="polite"></p><div class="kq-s1"></div></div>' +
    '<div class="part kq-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="kq-s2"></div></div>' +
    '<div class="part kq-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="q kq-s3"></div></div>';
  var csvg = $(".kq-csvg", host);
  var CUV = [{ id:"std", t:s1.std, rd:0.40 }].concat(TR.map(function(t, i){ return { id:"t" + i, t:"Trial " + (i + 1), rd:t.rd }; }));
  function paintCuv(rdOverride){
    var k = S.meas, it = k >= 0 ? CUV[k] : null, rd = it ? it.rd : 0;
    csvg.innerHTML = cuvetteSVG(rdOverride != null ? rdOverride : rd, shownRd && !!it);
    csvg.setAttribute("aria-label", it ? "A beam of light passes through a cuvette of " + MV.plain(it.t) + " solution, tinted red-orange. The colorimeter reads " + it.rd.toFixed(2) + "." : "A colorimeter with an empty cuvette holder. Choose a cuvette to measure.");
  }
  var RGc = radios($(".kq-cuvc", host), { label:"Measure", aria:"Cuvette to measure", cls:"chips", options:CUV.map(function(c, i){ return { id:String(i), t:c.t }; }), value:S.meas >= 0 ? String(S.meas) : "", onChange:function(v){
    S.meas = +v; api.save(); if (cvTw) cvTw(); shownRd = false; var it = CUV[S.meas];
    cvTw = MV.tween({ dur:900, step:function(t){ paintCuv(it.rd * t); }, done:function(){ cvTw = null; shownRd = true; paintCuv(); $(".kq-ccap", host).textContent = MV.plain(it.t) + ": the solution is red-orange, and the colorimeter reads " + it.rd.toFixed(2) + "."; } });
  } });
  void RGc;
  // Station 1: convert three readings
  function paintS1(){
    var h = '<table class="kq-lt"><caption>Convert each reading: [' + F("FeSCN^2+") + "] = reading ÷ " + CAL + '</caption><thead><tr><th scope="col">Trial</th><th scope="col">Reading</th><th scope="col">[' + F("FeSCN^2+") + "]<sub>eq</sub> (mol/L)</th></tr></thead><tbody>";
    TR.forEach(function(t, i){
      var v = parseSci(S.v1[i]), mk = S.chk1 ? (near(v, t.c, 0.02) ? '<span class="kq-ok">✓</span>' : '<span class="kq-no">✗</span>') : "";
      h += '<tr><th scope="row">' + (i + 1) + "</th><td>" + t.rd.toFixed(2) + '</td><td><input class="numin kq-cell" type="text" inputmode="decimal" autocomplete="off" data-v1="' + i + '" aria-label="Trial ' + (i + 1) + ' FeSCN concentration" value="' + esc(S.v1[i]) + '"> ' + mk + "</td></tr>";
    });
    h += '</tbody></table><div class="q-actions"><button type="button" class="btn primary sm" data-k="kqs1">Check</button></div>';
    if (S.chk1) { var all = TR.every(function(t, i){ return near(parseSci(S.v1[i]), t.c, 0.02); }); h += all ? MV.fbHTML("good", "<strong>✓ Right.</strong> 0.80 ÷ 4000 = 2.0 × 10⁻⁴ and 0.40 ÷ 4000 = 1.0 × 10⁻⁴ mol/L. These go into Station 2.") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Divide each reading by 4000. Type small numbers like 2.0e-4."); }
    MV.keepFocus($(".kq-s1", host), function(){ $(".kq-s1", host).innerHTML = h; });
  }
  var FLD = [["fe", "[" + F("Fe^3+") + "]<sub>eq</sub>", "Subtract [FeSCN²⁺]eq from [Fe³⁺]₀: each FeSCN²⁺ used one Fe³⁺."], ["scn", "[" + CF("SCN-") + "]<sub>eq</sub>", "Subtract [FeSCN²⁺]eq from [SCN⁻]₀."], ["K", "<i>K</i>", "K = [FeSCN²⁺] ÷ ([Fe³⁺][SCN⁻]), with equilibrium values."]];
  function okCell(i, f){ var v = parseSci(S.v2[i + f]); return near(v, TR[i][f], f === "K" ? 0.03 : 0.02); }
  function paintS2(){
    var s1ok = TR.every(function(t, i){ return near(parseSci(S.v1[i]), t.c, 0.02); });
    var h = '<div class="kq-ltw"><table class="kq-lt"><caption>Three trials (model data)</caption><thead><tr>' + s2.head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead><tbody>";
    TR.forEach(function(t, i){
      h += '<tr><th scope="row">' + (i + 1) + "</th><td>" + sci(t.fe0, 2) + "</td><td>" + sci(t.scn0, 2) + "</td><td>" + t.rd.toFixed(2) + "</td><td>" + (s1ok ? sci(t.c, 2) : '<span class="muted">from Station 1</span>') + "</td>";
      FLD.forEach(function(f){ var mk = S.chk2 ? (okCell(i, f[0]) ? '<span class="kq-ok">✓</span>' : '<span class="kq-no">✗</span>') : ""; h += '<td class="kq-shade"><input class="numin kq-cell" type="text" inputmode="decimal" autocomplete="off" data-v2="' + i + f[0] + '" aria-label="Trial ' + (i + 1) + " " + esc(MV.plain(f[1])) + '" value="' + esc(S.v2[i + f[0]] || "") + '"> ' + mk + "</td>"; });
      h += "</tr>";
    });
    h += '</tbody></table></div><div class="q-actions"><button type="button" class="btn primary sm" data-k="kqs2">Check</button><button type="button" class="btn ghost sm" data-k="kqs2d" aria-expanded="' + !!S.show2 + '">' + s2.checkTitle + "</button></div>";
    if (S.chk2) {
      var bad = []; TR.forEach(function(t, i){ FLD.forEach(function(f){ if (!okCell(i, f[0]) && bad.indexOf(f[2]) < 0) bad.push(f[2]); }); });
      h += !bad.length ? MV.fbHTML("good", "<strong>✓ Every cell is right.</strong> " + s2.message) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + bad.join(" "));
    }
    if (S.show2) h += '<div class="kq-dchk"><h4 class="kq-h4">' + s2.checkTitle + "</h4><ul>" + TR.map(function(t, i){ return "<li>Trial " + (i + 1) + ": <i>K</i> = " + sci(t.c, 2) + " ÷ (" + sci(t.fe, 2) + " × " + sci(t.scn, 2) + ") = " + t.K + "</li>"; }).join("") + "</ul><p><strong>" + s2.message + "</strong></p></div>";
    h += TR.map(function(t, i){ return '<details class="alg kq-trice"><summary>ICE table, trial ' + (i + 1) + "</summary>" + '<div class="kq-icew"><table class="kq-ice"><thead><tr><th scope="col"><span class="vh">Row</span></th><th scope="col">' + F("Fe^3+") + '</th><th scope="col">' + CF("SCN-") + '</th><th scope="col">' + F("FeSCN^2+") + "</th></tr></thead><tbody>" +
      '<tr><th scope="row">I</th><td>' + sci(t.fe0, 2) + "</td><td>" + sci(t.scn0, 2) + "</td><td>0</td></tr>" +
      '<tr><th scope="row">C</th><td>' + M + "<i>x</i></td><td>" + M + "<i>x</i></td><td>+<i>x</i></td></tr>" +
      '<tr><th scope="row">E</th><td>' + sci(t.fe0, 2) + " " + M + " <i>x</i></td><td>" + sci(t.scn0, 2) + " " + M + " <i>x</i></td><td><i>x</i> = reading ÷ 4000</td></tr></tbody></table></div></details>"; }).join("");
    MV.keepFocus($(".kq-s2", host), function(){ $(".kq-s2", host).innerHTML = h; });
  }
  function paintS3(){
    var sel = S.s3.sel, h = '<div class="chips kq-ichips" role="group" aria-label="Sources of error">' + s3.chips.map(function(c){ var on = !!sel[c.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-iv="' + c.id + '" data-k="kqiv' + c.id + '">' + c.t + "</button>"; }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" data-k="kqs3">Check</button></div>';
    if (S.s3.fb) {
      var right = s3.chips.every(function(c){ return !!c.need === !!sel[c.id]; });
      h += MV.fbHTML(right ? "good" : "bad", "<strong>" + (right ? "✓ " + s3.right : "✗ " + s3.wrong) + "</strong><ul class=\"kq-why\">" + s3.chips.filter(function(c){ return sel[c.id] || c.need && right; }).map(function(c){ return "<li><strong>" + c.t + ":</strong> " + c.why + "</li>"; }).join("") + "</ul>");
    }
    MV.keepFocus($(".kq-s3", host), function(){ $(".kq-s3", host).innerHTML = h; });
  }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.v1 != null) { S.v1[+t.dataset.v1] = t.value; api.save(); }
    else if (t.dataset.v2) { S.v2[t.dataset.v2] = t.value; api.save(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var k = b.dataset.k;
    if (k === "kqs1") { S.chk1 = true; api.save(); paintS1(); paintS2(); MV.focusFb($(".kq-s1", host)); }
    else if (k === "kqs2") { S.chk2 = true; api.save(); paintS2(); MV.focusFb($(".kq-s2", host)); }
    else if (k === "kqs2d") { S.show2 = !S.show2; api.save(); paintS2(); }
    else if (b.dataset.iv) { S.s3.sel[b.dataset.iv] = !S.s3.sel[b.dataset.iv]; S.s3.fb = false; api.save(); paintS3(); }
    else if (k === "kqs3") { S.s3.fb = true; api.save(); paintS3(); MV.focusFb($(".kq-s3", host)); }
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter") return; var t = e.target;
    if (t.dataset.v1 != null) host.querySelector('[data-k="kqs1"]').click(); else if (t.dataset.v2) host.querySelector('[data-k="kqs2"]').click();
  });
  if (S.meas >= 0) $(".kq-ccap", host).textContent = MV.plain(CUV[S.meas].t) + ": the colorimeter reads " + CUV[S.meas].rd.toFixed(2) + ".";
  paintCuv(); paintS1(); paintS2(); paintS3();
  return {};
}

// ---------- Practice 2: Solve it (N4 number entry with scientific notation, plus direction chips) ----------
function solveAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { vals:[], pick:null, tries:0, hint:0, solved:false, first:null }); x.vals = x.vals || []; return x; }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-si="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    it.parts.forEach(function(p, k){ h += '<div class="numrow"><label for="kq-s' + it.id + k + '">' + p.label + '</label><input class="numin" id="kq-s' + it.id + k + '" data-sv="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.vals[k] || "") + '"' + dis + ">" + (p.unit ? '<span class="m">' + p.unit + "</span>" : "") + "</div>"; });
    if (it.choice) h += '<div class="kq-chrow"><span class="rg-lab">' + it.choice.label + '</span><div class="chips" role="radiogroup" aria-label="' + esc(MV.plain(it.choice.label)) + '">' + it.choice.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function judge(it, x){
    var ans = MV.ans(it), vals = it.parts.map(function(_, k){ return parseSci(x.vals[k]); });
    if (vals.some(function(v){ return v == null; })) return { soft:true, t:"Enter a number in each box, such as 0.25, 4.0e-3 or 4.0 × 10^-3." };
    if (it.choice && x.pick == null) return { soft:true, t:"Choose a direction too." };
    var tol = it.tol || 0.03;
    for (var k = 0; k < vals.length; k++) if (!near(vals[k], ans[k], tol)) {
      var w = (it.wrong || []).filter(function(w){ return w.part === k && near(vals[k], w.match, tol); })[0];
      return { t:w ? w.fb : "Check your working." };
    }
    if (it.choice && !MV.ok(it.choice.options[x.pick])) return { t:it.choice.options[x.pick].why || "Check the direction." };
    return { ok:true };
  }
  host.addEventListener("input", function(e){ var t = e.target, bx = t.closest("[data-si]"); if (!bx || t.dataset.sv == null) return; ist(bx.dataset.si).vals[+t.dataset.sv] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target, bx = t.closest && t.closest("[data-si]"); if (!bx) return;
    if (e.key === "Enter" && t.dataset.sv != null) { var cb = bx.querySelector('[data-act="check"]'); if (cb) cb.click(); return; }
    if (t.dataset.op == null) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(t.parentNode.querySelectorAll("[data-op]")), nx = all[(all.indexOf(t) + d + all.length) % all.length]; nx.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-si]"); if (!bx) return;
    var it = a.items.filter(function(q){ return q.id === bx.dataset.si; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.soft) { msgs[it.id] = r; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = r; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-si="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Same equilibrium, different starts (R1 sliders, live ICE solver, Q/K meter, graph) ----------
var task = (function(){
  var S = null, api = null, TK = null, pvEl = null;
  function read(){ return { h:+S.h || 0, i:+S.i || 0, hi:+S.hi || 0 }; }
  function info(d){
    var c0 = [d.h, d.i, d.hi], x = solveX("r1", c0), eq = at("r1", c0, x), Q = Qval("r1", c0);
    return { c0:c0, x:x, eq:eq, Q:Q, notEq:isNaN(Q) || Q === Infinity || Math.abs(Q - 36) > 1e-9, fwd:!isNaN(Q) && Q < 36 - 1e-9, hi:Math.abs(eq[2] - 1.5) <= 0.005 };
  }
  function paint(){
    if (!pvEl) return;
    var d = read(), I = info(d), g = concGraph("r1", I.c0, I.eq, 1);
    pvEl.innerHTML = '<h4 class="kq-h4">Live ICE solver</h4><svg class="kq-gsvg" viewBox="0 0 520 220" role="img" aria-label="' + esc(g.aria) + '">' + g.svg + '</svg><svg class="kq-msvg" viewBox="0 0 520 74" aria-hidden="true">' + qkMeter(I.Q, 36) + '</svg><p class="kq-qline">' + qkLine(I.Q, 36) + "</p>" + iceHTML("r1", I.c0, I.x, I.eq) +
      '<p class="tiny">At equilibrium: [H<sub>2</sub>] = ' + fmt(I.eq[0]) + ", [I<sub>2</sub>] = " + fmt(I.eq[1]) + ", [HI] = " + fmt(I.eq[2]) + " mol/L.</p>";
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; TK = MV.C.task; pvEl = pv;
      ["h", "i", "hi"].forEach(function(k){ var v = +S[k]; S[k] = v >= 0 && v <= 2 ? Math.round(v * 4) / 4 : 0; });
      inp.innerHTML = '<div class="kq-tkin">' + slider("kq-th", TK.inputs.h, S.h) + slider("kq-ti", TK.inputs.i, S.i) + slider("kq-thi", TK.inputs.hi, S.hi) + "</div>";
      inp.addEventListener("input", function(e){
        var t = e.target, f = { "kq-th":"h", "kq-ti":"i", "kq-thi":"hi" }[t.dataset.sl]; if (!f) return;
        S[f] = +t.value; var o = t.parentNode.querySelector("output"); if (o) o.textContent = (+t.value).toFixed(2) + " mol/L";
        api.save(); paint(); api.update();
      });
      shiftKeys(inp);
      paint();
    },
    read:read,
    valid:function(d){ return d.h + d.i + d.hi > 0 ? true : "Put something in the flask first: move at least one slider."; },
    checks:function(d){ var I = info(d); return [I.notEq, I.fwd, I.hi]; },
    key:function(d){ return [d.h, d.i, d.hi].map(function(v){ return v.toFixed(2); }).join("|"); },
    label:function(k){ var p = k.split("|"); return "(" + p.join(", ") + ")"; },
    text:function(k){ return "(" + k.split("|").join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ solve:solveAct },
  task:task
});
})();
