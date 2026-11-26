// SCH4U 44 Buffer Solutions: hero (water vs buffer under the same HCl dose, with a particle zoom), Buffer challenge (Explore:
// pair / amounts / dilute, add HCl or NaOH, Compare (two beakers + pH graph) / Zoom to the particles / Calculate), Buffers in
// your body (Part 3: blood ratio slider, breathing and Le Chatelier, buffered tablet, ocean carbonate), "Design a buffer" task.
(function(){
"use strict";
var $ = MV.$, F = MV.chem.f, D = MV.chem.data, MINUS = "−";
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function fx2(v){ return MV.chem.fx(v, 2); }
function sgn2(v){ return (v > 0.0049 ? "+" : "") + MV.chem.fx(Math.abs(v) < 0.005 ? 0 : v, 2); }
function lg(v){ return Math.log10(v); }
function css(v){ return MV.css(v); }
var PKA = "p<i>K</i><sub>a</sub>";
// misconception core sentences used in the challenge feedback (plan §3)
var M4 = "pH = " + PKA + " + log(<strong>base</strong> ÷ <strong>acid</strong>). More A⁻ means a higher pH.";
var M6 = "Once A⁻ is used up, the extra H₃O⁺ stays in solution and the pH drops sharply.";
var M7 = "Pick the pair whose " + PKA + " is closest to the target pH (within about 1).";

// ---------- data (C13 course tables) ----------
// pKa values are pinned to 2 decimals from MV.chem.data.Ka so screen values match hand work. NH₄⁺ uses the course table's
// pinned 9.26 (misc), matching module 43. The blood buffer's effective pKa 6.1 is the course table addition (misc).
function pkaOf(name){ var r = D.Ka.filter(function(x){ return x[0] === name; })[0]; return Math.round(-lg(r[2]) * 100) / 100; }
function miscNum(label){ var r = D.misc.filter(function(x){ return x[0] === label; })[0]; return parseFloat(String(r[1]).replace(MINUS, "-")); }
var KW = D["const"].Kw, PKW = -lg(KW), V = 1.00; // volume of every beaker, L
var PAIRS = [
  { id:"meth", acid:"methanoic acid", base:"methanoate", HA:"HCOOH", A:"HCOO-", pKa:pkaOf("methanoic acid") },
  { id:"benz", acid:"benzoic acid", base:"benzoate", HA:"C6H5COOH", A:"C6H5COO-", pKa:pkaOf("benzoic acid") },
  { id:"eth", acid:"ethanoic acid", base:"ethanoate", HA:"CH3COOH", A:"CH3COO-", pKa:pkaOf("ethanoic acid") },
  // Course table addition (plan §6): the model acid HX, Ka = 1.0 × 10⁻⁵ (pKa 5.00), labelled "model acid". Not in MV.chem.data.
  { id:"hx", acid:"HX", base:"X⁻", HA:"HX", A:"X-", pKa:5.00, model:true },
  { id:"hocl", acid:"hypochlorous acid", base:"hypochlorite", HA:"HOCl", A:"OCl-", pKa:pkaOf("hypochlorous acid") },
  { id:"nh4", acid:"ammonium", base:"ammonia", HA:"NH4+", A:"NH3", pKa:miscNum("pKa of NH4+") }
];
var PKA_BLOOD = miscNum("blood buffer, effective pKa");
function pairById(id){ return PAIRS.filter(function(p){ return p.id === id; })[0]; }
function pairLabel(p){ return (p.model ? "model acid HX / X⁻" : p.acid + " / " + p.base) + " · " + fx2(p.pKa); }
var AMTS = [50, 100, 200, 400]; // mmol: 0.050 · 0.10 · 0.20 · 0.40 mol
function molTxt(v){ // mol, 2 significant figures at least (0.080, 0.12, 0.105)
  if (Math.abs(v) < 1e-9) return "0";
  return v >= 0.1 ? v.toFixed(3).replace(/0$/, "") : v.toPrecision(2);
}
function mm(m){ return molTxt(m / 1000); }

// ---------- buffer model (plan §4 model rules) ----------
// a, b = mol of acid form and base form in V; x = net strong acid added (mol; negative = strong base). Strong acid and base
// react completely first. While both forms are ≥ 0.005 mol: pH = pKa + log(n(base) ÷ n(acid)). Otherwise the excess strong
// acid or base sets the pH, or (exactly used up) the weak acid or weak base alone (ICE, quadratic).
var TH = 0.005 - 1e-9;
function quadX(K, C){ return (-K + Math.sqrt(K * K + 4 * K * C)) / 2; }
function bufModel(pKa, a, b, x){
  var u, ex = 0, kind = "";
  if (x >= 0) { u = Math.min(x, b); b -= u; a += u; ex = x - u; if (ex > 1e-9) kind = "acid"; }
  else { u = Math.min(-x, a); a -= u; b += u; ex = -x - u; if (ex > 1e-9) kind = "base"; }
  var Ka = Math.pow(10, -pKa), pH, how;
  if (a >= TH && b >= TH) { pH = pKa + lg(b / a); how = "ratio"; }
  else if (kind === "acid") { pH = -lg(ex / V); how = "exAcid"; }
  else if (kind === "base") { pH = PKW + lg(ex / V); how = "exBase"; }
  else if (b < TH) { pH = -lg(quadX(Ka, a / V)); how = "weakAcid"; }
  else { pH = PKW + lg(quadX(KW / Ka, b / V)); how = "weakBase"; }
  return { a:a, b:b, ex:kind ? ex : 0, kind:kind, pH:pH, how:how, used:u, out:a < 1e-9 || b < 1e-9 };
}
function waterPH(x){ var c = Math.abs(x) / V, h = (c + Math.sqrt(c * c + 4 * KW)) / 2; return x >= 0 ? -lg(h) : PKW + lg(h); }
function gcd(a, b){ return b ? gcd(b, a % b) : a; }
function ratioTxt(b, a){
  var B = Math.round(b * 1000), A = Math.round(a * 1000);
  if (!A || !B) return "— (" + (B ? "acid" : "base") + " form used up)";
  var g = gcd(B, A), p = B / g, q = A / g;
  return p <= 20 && q <= 20 ? p + " : " + q : MV.chem.fx(B / A, 2) + " : 1";
}

// @component radioGroup (from MHF4U 25, via SCH4U 01–06) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock)
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, d = locked || !!off(x.id); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && !i) ? 0 : -1) + '" data-rg="' + x.id + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val);
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// @component phMeter (from SCH4U 06; adds a zoomed range lo–hi and an optional highlighted band) — display-only pH gauge,
// acidic / basic sides in the H₃O⁺ and OH⁻ role colours, needle. meterSVG(v, {lo, hi, acidTo, baseFrom, band:[a, b], tick, aria})
function meterSVG(v, o){
  o = o || {};
  var lo = o.lo == null ? 0 : o.lo, hi = o.hi == null ? 14 : o.hi, x0 = 18, x1 = 402, X = function(p){ return x0 + (x1 - x0) * (p - lo) / (hi - lo); }, s = "";
  var aTo = clamp(o.acidTo == null ? 6.5 : o.acidTo, lo, hi), bFrom = clamp(o.baseFrom == null ? 7.5 : o.baseFrom, lo, hi);
  if (aTo > lo) s += '<rect x="' + x0 + '" y="30" width="' + r1(X(aTo) - x0) + '" height="18" fill="var(--ab-h3o)" fill-opacity=".22"/>';
  if (bFrom < hi) s += '<rect x="' + r1(X(bFrom)) + '" y="30" width="' + r1(x1 - X(bFrom)) + '" height="18" fill="var(--ab-oh)" fill-opacity=".22"/>';
  if (o.band) s += '<rect x="' + r1(X(o.band[0])) + '" y="26" width="' + r1(X(o.band[1]) - X(o.band[0])) + '" height="26" fill="var(--hi-soft)" stroke="var(--ink-2)" stroke-width="1" stroke-dasharray="3 3"/>';
  s += '<rect x="' + x0 + '" y="30" width="' + (x1 - x0) + '" height="18" rx="3" fill="none" stroke="var(--ink-2)" stroke-width="1.5"/>';
  var step = o.tick || 1, dp = step < 1 ? 1 : 0;
  for (var p = lo; p <= hi + 1e-9; p += step) { var px = r1(X(p)); s += '<line x1="' + px + '" y1="48" x2="' + px + '" y2="55" stroke="var(--ink-2)" stroke-width="1.2"/><text x="' + px + '" y="70" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + MV.chem.fx(p, dp) + "</text>"; }
  var nx = r1(X(clamp(v, lo, hi)));
  s += '<path d="M' + nx + " 52 L" + r1(nx - 7) + " 22 L" + r1(nx + 7) + ' 22Z" fill="var(--ink)"/><text x="' + clamp(nx, 40, 380) + '" y="14" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">pH ' + fx2(v) + "</text>";
  return '<svg class="bf-msvg" viewBox="0 0 420 76" role="img" aria-label="' + esc(o.aria || ("pH meter reading " + fx2(v))) + '">' + s + "</svg>";
}

// @component beakerGauge — one 1.00 L beaker (SVG) with a vertical 0–14 pH bar beside it, a big readout and the change from
// the start. Water uses --ink-2 (as its dashed graph curve), the buffer --pen.
function beakerSVG(o){
  var col = o.water ? "var(--ink-2)" : "var(--pen)", top = 34, bot = 204, Y = function(p){ return bot - (clamp(p, 0, 14) / 14) * (bot - top); };
  var s = '<text x="10" y="20" font-size="15" font-weight="700" fill="var(--ink)">' + o.title + "</text>";
  s += '<path d="M24 64 L24 196 Q24 206 34 206 L128 206 Q138 206 138 196 L138 64" fill="none" stroke="var(--ink-2)" stroke-width="2.4" stroke-linejoin="round"/>';
  s += '<path d="M26 92 L136 92 L136 196 Q136 204 128 204 L34 204 Q26 204 26 196Z" fill="' + col + '" fill-opacity=".13"/>';
  s += '<text x="81" y="140" text-anchor="middle" font-size="26" font-weight="700" fill="var(--ink)">' + fx2(o.pH) + '</text><text x="81" y="166" text-anchor="middle" font-size="13" fill="var(--ink-2)">pH</text>';
  if (o.delta != null) s += '<text x="81" y="188" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink-2)">' + (Math.abs(o.delta) < 0.005 ? "no change" : sgn2(o.delta)) + "</text>";
  s += '<rect x="166" y="' + top + '" width="16" height="' + (bot - top) + '" rx="3" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.4"/>';
  s += '<rect x="168" y="' + r1(Y(o.pH)) + '" width="12" height="' + r1(bot - 1 - Y(o.pH)) + '" rx="2" fill="' + col + '"/>';
  [0, 7, 14].forEach(function(p){ s += '<line x1="182" y1="' + r1(Y(p)) + '" x2="190" y2="' + r1(Y(p)) + '" stroke="var(--ink-2)" stroke-width="1.2"/><text x="194" y="' + r1(Y(p) + 4) + '" font-size="12" fill="var(--ink-2)">' + p + "</text>"; });
  if (o.badge) s += '<text x="81" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="var(--red)">' + o.badge + "</text>";
  return '<svg class="bf-bsvg" viewBox="0 0 214 214" role="img" aria-label="' + esc(o.aria) + '">' + s + "</svg>";
}

// @component dotBeaker — particle view of one buffer beaker: HA (ink outline), A⁻ (teal), H₃O⁺ (magenta), OH⁻ (cerulean) on
// a fixed shuffled grid (14 × 10 slots). Pool slots 0…T−1 hold the conjugate pair: slot i is base form while i < nB, so
// adding acid turns the highest base-form slots into acid form. Excess strong ions sit in slots T, T+1, …
var DOT_COLS = 14, DOT_ROWS = 10, DOT_ORDER = MV.shuffle(Array.apply(null, { length:DOT_COLS * DOT_ROWS }).map(function(_, i){ return i; }), "sch4u44dots");
function slotXY(i){ var g = DOT_ORDER[i % DOT_ORDER.length], c = g % DOT_COLS, r = Math.floor(g / DOT_COLS), j = ((g * 37) % 7) - 3; return [44 + (c + 0.5) * 20 + j * 0.8, 74 + (r + 0.5) * 17 + ((g * 53) % 5 - 2) * 0.8]; }
function dot(x, y, kind, al){
  var a = al == null ? 1 : al, o = ' opacity="' + r1(a * 10) / 10 + '"';
  if (kind === "HA") return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="6.2" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"' + o + "/>";
  var c = kind === "A" ? "var(--f3)" : kind === "H" ? "var(--ab-h3o)" : "var(--ab-oh)";
  return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="6.2" fill="' + c + '"' + o + "/>" + (kind === "H" ? '<text x="' + r1(x) + '" y="' + r1(y + 3.5) + '" text-anchor="middle" font-size="9" font-weight="700" fill="var(--sheet)"' + o + ">+</text>" : kind === "OH" ? '<text x="' + r1(x) + '" y="' + r1(y + 3.5) + '" text-anchor="middle" font-size="10" font-weight="700" fill="var(--sheet)"' + o + ">" + MINUS + "</text>" : "");
}
function dotState(T, nB, E, kind){ return { T:T, nB:nB, E:Math.min(E, DOT_COLS * DOT_ROWS - T), more:Math.max(0, E - (DOT_COLS * DOT_ROWS - T)), kind:kind }; }
function dotSVG(st, movers, cap, aria){
  var s = '<path d="M30 56 L30 252 Q30 262 40 262 L328 262 Q338 262 338 252 L338 56" fill="none" stroke="var(--ink-2)" stroke-width="2.4"/>';
  for (var i = 0; i < st.T; i++) { var p = slotXY(i); s += dot(p[0], p[1], i < st.nB ? "A" : "HA"); }
  for (var j = 0; j < st.E; j++) { var q = slotXY(st.T + j); s += dot(q[0], q[1], st.kind === "acid" ? "H" : "OH"); }
  (movers || []).forEach(function(m){ s += dot(m.x, m.y, m.kind, m.a); });
  if (st.more) s += '<text x="184" y="250" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">+ ' + st.more + " more " + (st.kind === "acid" ? "H₃O⁺" : "OH⁻") + " not drawn</text>";
  if (cap) s += '<text x="184" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">' + cap + "</text>";
  return '<svg class="bf-dsvg" viewBox="0 0 368 272" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>";
}

// ---------- hero: the same HCl dose into water and into a buffer ----------
function heroSVG(t, z, w1, b1){
  var wp = 7 + (w1 - 7) * t, bp = 5 + (b1 - 5) * t, s = "";
  s += '<g transform="translate(6 40)">' + beakerG("water", wp, true) + '</g><g transform="translate(226 40)">' + beakerG("buffer", bp, false) + "</g>";
  // droppers
  [86, 306].forEach(function(x){
    s += '<path d="M' + (x - 7) + ' 4 L' + (x + 7) + " 4 L" + (x + 4) + " 34 L" + (x - 4) + ' 34Z" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/><rect x="' + (x - 9) + '" y="0" width="18" height="8" rx="3" fill="var(--ink-2)"/>';
    if (t > 0 && t < 0.6) { var y = 40 + (t / 0.6) * 80; s += '<circle cx="' + x + '" cy="' + r1(y) + '" r="5" fill="var(--ab-h3o)"/>'; }
  });
  s += '<text x="196" y="22" text-anchor="middle" font-size="15" fill="var(--ink-2)">0.020 mol HCl each</text>';
  // zoom inset
  var cx = 570, cy = 168, R = 112;
  s += '<line x1="356" y1="150" x2="' + (cx - R + 6) + '" y2="' + (cy - 50) + '" stroke="var(--ink-2)" stroke-width="1.2" stroke-dasharray="4 4"/><line x1="356" y1="220" x2="' + (cx - R + 6) + '" y2="' + (cy + 50) + '" stroke="var(--ink-2)" stroke-width="1.2" stroke-dasharray="4 4"/>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2"/>';
  var A = [[-60, -30], [-10, -60], [40, -20], [-40, 40], [20, 50], [65, 25]], HA = [[-70, 10], [0, 0], [60, -60], [-20, 75]];
  HA.forEach(function(p){ s += dot(cx + p[0], cy + p[1], "HA"); });
  var hits = [0, 2, 4], k = clamp(z / 0.75, 0, 1), e = k * k * (3 - 2 * k);
  A.forEach(function(p, i){ s += dot(cx + p[0], cy + p[1], hits.indexOf(i) >= 0 && z >= 0.8 ? "HA" : "A"); });
  hits.forEach(function(i, n){
    if (z >= 0.8 || z <= 0) return;
    var sx = cx - 40 + n * 40, sy = cy - R + 18, tx = cx + A[i][0], ty = cy + A[i][1];
    s += dot(sx + (tx - sx) * e, sy + (ty - sy) * e, "H");
  });
  s += '<text x="' + cx + '" y="' + (cy + R + 22) + '" text-anchor="middle" font-size="14" fill="var(--ink-2)">inside the buffer</text>';
  var aria = "Two beakers get the same 0.020 mol of HCl. Water: pH " + fx2(wp) + ". Buffer: pH " + fx2(bp) + "." + (z >= 0.8 ? " Zoom: each magenta H₃O⁺ met a teal A⁻, which became HA (outline)." : "");
  return '<svg class="bf-hsvg" viewBox="0 0 700 310" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>";
  function beakerG(name, pH, water){
    var col = water ? "var(--ink-2)" : "var(--pen)", top = 30, bot = 230, Y = function(p){ return bot - clamp(p, 0, 14) / 14 * (bot - top); }, g = "";
    g += '<path d="M20 70 L20 222 Q20 232 30 232 L140 232 Q150 232 150 222 L150 70" fill="none" stroke="var(--ink-2)" stroke-width="2.6"/>';
    g += '<path d="M22 100 L148 100 L148 222 Q148 230 140 230 L30 230 Q22 230 22 222Z" fill="' + col + '" fill-opacity=".13"/>';
    g += '<text x="85" y="152" text-anchor="middle" font-size="30" font-weight="700" fill="var(--ink)">' + fx2(pH) + '</text><text x="85" y="182" text-anchor="middle" font-size="17" fill="var(--ink-2)">' + name + "</text>";
    g += '<rect x="166" y="' + top + '" width="18" height="' + (bot - top) + '" rx="3" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.4"/><rect x="168" y="' + r1(Y(pH)) + '" width="14" height="' + r1(bot - 1 - Y(pH)) + '" rx="2" fill="' + col + '"/>';
    return g;
  }
}
function hero(){
  var host = $("#bf-hx-svg"), cap = $("#bf-hx-cap"), rep = $("#bf-hx-replay");
  if (!host) return;
  var w1 = waterPH(0.020), b1 = bufModel(5.00, 0.10, 0.10, 0.020).pH;
  var T1 = "The same 0.020 mol of HCl drips into 1.00 L of water and 1.00 L of buffer (HX / X⁻, " + PKA + " 5.00).";
  var T2 = "Water plunges from 7.00 to " + fx2(w1) + ". The buffer only dips from 5.00 to " + fx2(b1) + ".";
  var T3 = "Zoom in: each H₃O⁺ (magenta) meets an A⁻ (teal) and becomes HA (outline). The added acid is used up.";
  function draw(t, z){ host.innerHTML = heroSVG(t, z, w1, b1); }
  if (MV.reduceMotion) { draw(1, 1); cap.innerHTML = T2 + " " + T3; return; }
  var run = 0;
  function play(){
    var id = ++run; rep.hidden = true; draw(0, 0); cap.innerHTML = T1;
    MV.wait(1300, function(){
      if (id !== run) return;
      MV.tween({ dur:1800, step:function(t){ if (id === run) draw(t, 0); }, done:function(){
        if (id !== run) return; cap.innerHTML = T2;
        MV.wait(1800, function(){
          if (id !== run) return; cap.innerHTML = T3;
          MV.tween({ dur:2000, ease:function(t){ return t; }, step:function(z){ if (id === run) draw(1, z); }, done:function(){ if (id === run) { draw(1, 1); rep.hidden = false; } } });
        });
      } });
    });
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Buffer challenge ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (!pairById(S.pair)) S.pair = "hx";
  if (AMTS.indexOf(S.na) < 0) S.na = 100;
  if (AMTS.indexOf(S.nb) < 0) S.nb = 100;
  S.dil = !!S.dil; if ([10, 50].indexOf(S.step) < 0) S.step = 10;
  S.adds = Array.isArray(S.adds) ? S.adds.filter(function(v){ return typeof v === "number" && isFinite(v) && v % 10 === 0; }) : [];
  if (["compare", "particles", "calc"].indexOf(S.mode) < 0) S.mode = "compare";
  var busy = false, dispX = null, movers = null, frames = null, cancel = null;

  host.innerHTML = '<p class="how">' + C.how + "</p>" +
    '<div class="bf-ctrl"><div id="bf-pair"></div><div class="bf-amts"><div id="bf-na"></div><div id="bf-nb"></div></div>' +
    '<div class="bf-row"><button type="button" class="btn ghost sm bf-tog" data-act="dil" data-k="dil" aria-pressed="false">Dilute ×10</button><div id="bf-step"></div></div>' +
    '<div class="bf-add"><button type="button" class="btn primary" data-act="hcl" data-k="hcl">Add HCl</button><button type="button" class="btn primary" data-act="naoh" data-k="naoh">Add NaOH</button>' +
    '<button type="button" class="btn ghost" data-act="undo" data-k="undo" aria-keyshortcuts="Control+Z">Undo</button><button type="button" class="btn ghost" data-act="reset" data-k="reset">Reset</button></div>' +
    '<div class="bf-row"><button type="button" class="btn ghost sm" data-act="dose" data-k="dose">Test dose: 0.15 mol HCl</button><span class="tiny bf-added" aria-live="polite"></span></div></div>' +
    '<div class="bf-grid"><div class="bf-stage" data-mv="graph"><div id="bf-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="bf-v" data-v="compare"><div class="bf-beakers"><div class="bf-bk" id="bf-bw"></div><div class="bf-bk" id="bf-bb"></div></div>' +
    '<div class="plot-wrap bf-plot"><canvas class="plot" role="img" aria-label="Graph of pH against moles of acid or base added"></canvas></div>' +
    '<p class="legend tiny"><span class="bf-key bf-key-b" aria-hidden="true"></span> buffer · <span class="bf-key bf-key-w" aria-hidden="true"></span> water (dashed) · <span class="bf-key bf-key-x" aria-hidden="true"></span> shaded: capacity exceeded. Left of 0: NaOH added; right of 0: HCl added.</p></div>' +
    '<div class="bf-v" data-v="particles" hidden><div class="bf-dots"></div><p class="legend tiny bf-dleg"></p></div>' +
    '<div class="bf-v" data-v="calc" hidden><div class="bf-calc"></div></div></div>' +
    '<div class="bf-side"><h4 class="bf-h4">Readout</h4><dl class="read bf-read" aria-live="polite"></dl><div class="bf-tab"></div></div></div>';

  var pairRG = radios($("#bf-pair", host), { label:"Buffer pair (" + PKA + ")", cls:"chips", options:PAIRS.map(function(p){ return { id:p.id, t:pairLabel(p) }; }), value:S.pair, onChange:function(v){ S.pair = v; fresh(); } });
  var naRG = radios($("#bf-na", host), { label:"<i>n</i>(acid form)", aria:"n(acid form)", cls:"chips", options:AMTS.map(function(a){ return { id:a, t:mm(a) + " mol" }; }), value:S.na, onChange:function(v){ S.na = +v; fresh(); } });
  var nbRG = radios($("#bf-nb", host), { label:"<i>n</i>(base form)", aria:"n(base form)", cls:"chips", options:AMTS.map(function(a){ return { id:a, t:mm(a) + " mol" }; }), value:S.nb, onChange:function(v){ S.nb = +v; fresh(); } });
  var stepRG = radios($("#bf-step", host), { label:"Step", cls:"chips", options:[{ id:10, t:"+0.010 mol" }, { id:50, t:"+0.050 mol" }], value:S.step, onChange:function(v){ S.step = +v; api.save(); paintCtrl(); } });
  var modeRG = radios($("#bf-mode", host), { label:"View", cls:"seg", options:[{ id:"compare", t:"Compare" }, { id:"particles", t:"Zoom to the particles" }, { id:"calc", t:"Calculate" }], value:S.mode, onChange:function(v){ S.mode = v; api.save(); paint(); } });
  MV.chem.tablePanel($(".bf-tab", host), "acid", { title:"Course table: acid and base constants" });
  var canvas = $(".bf-plot canvas", host), plot = new MV.Plot(canvas, { xmin:-0.2, xmax:0.2, ymin:0, ymax:14 });
  plot.render = function(){ drawGraph(); };

  function net(){ return S.adds.reduce(function(s, v){ return s + v; }, 0); }
  function eff(){ var d = S.dil ? 10 : 1; return { a:S.na / d, b:S.nb / d }; } // mmol
  function now(x){ // x in mmol (may be fractional during a tween)
    var P = pairById(S.pair), e = eff();
    return { P:P, e:e, x:x, m:bufModel(P.pKa, e.a / 1000, e.b / 1000, x / 1000), m0:bufModel(P.pKa, e.a / 1000, e.b / 1000, 0), w:waterPH(x / 1000), w0:waterPH(0) };
  }
  function curX(){ return dispX == null ? net() : dispX; }
  function unit(){ return S.dil ? 1 : 10; } // mmol per dot
  function dotsOf(x){ var c = now(x), u = unit(), T = Math.round((c.e.a + c.e.b) / u); return dotState(T, Math.round(c.m.b * 1000 / u), Math.round(c.m.ex * 1000 / u), c.m.kind); }
  function fresh(){ S.adds = []; frames = null; api.save(); paint(); }

  // ----- painting -----
  function paintCtrl(){
    var x = net(), st = S.step;
    [pairRG, naRG, nbRG, stepRG, modeRG].forEach(function(r){ r.lock(busy); });
    var t = $('[data-act="dil"]', host); t.setAttribute("aria-pressed", String(S.dil)); t.textContent = S.dil ? "Diluted ×10 (tap to undo)" : "Dilute ×10";
    $('[data-act="hcl"]', host).textContent = "Add " + mm(st) + " mol HCl"; $('[data-act="naoh"]', host).textContent = "Add " + mm(st) + " mol NaOH";
    $('[data-act="hcl"]', host).disabled = busy || x + st > 500; $('[data-act="naoh"]', host).disabled = busy || x - st < -500;
    $('[data-act="dose"]', host).disabled = busy || x + 150 > 500; $('[data-act="dil"]', host).disabled = busy;
    $('[data-act="undo"]', host).disabled = busy || !S.adds.length; $('[data-act="reset"]', host).disabled = busy || (!S.adds.length && !S.dil);
    var both = S.adds.some(function(v){ return v > 0; }) && S.adds.some(function(v){ return v < 0; });
    $(".bf-added", host).textContent = "Added so far" + (both ? " (net)" : "") + ": " + (x > 0 ? mm(x) + " mol HCl" : x < 0 ? mm(-x) + " mol NaOH" : "nothing") + (x ? " (" + S.adds.length + " step" + (S.adds.length === 1 ? "" : "s") + ")" : "") + ".";
  }
  function paintRead(c){
    var m = c.m, P = c.P, cap = m.out ? (m.b < 1e-9 ? "none for acid: the base form (" + F(P.A) + ") is used up" : "none for base: the acid form (" + F(P.HA) + ") is used up") :
      "can absorb " + molTxt(m.b) + " mol more acid or " + molTxt(m.a) + " mol more base";
    $(".bf-read", host).innerHTML = MV.readoutHTML([
      ["Pair", (P.model ? "model acid " : "") + F(P.HA) + " / " + F(P.A) + " (" + PKA + " " + fx2(P.pKa) + ")"],
      ["<i>n</i>(acid form) / <i>n</i>(base form)", molTxt(m.a) + " / " + molTxt(m.b) + " mol"],
      ["Ratio base : acid", ratioTxt(m.b, m.a)],
      ["Buffer pH", fx2(m.pH)],
      ["Water pH", fx2(c.w)],
      ["Change from start", "buffer " + sgn2(Math.round(m.pH * 100) / 100 - Math.round(c.m0.pH * 100) / 100) + " · water " + sgn2(Math.round(c.w * 100) / 100 - Math.round(c.w0 * 100) / 100)],
      ["Capacity left", cap],
      ["Status", m.out ? "<strong>Capacity exceeded</strong>" : "Buffering"]]);
  }
  function paintBeakers(c){
    $("#bf-bw", host).innerHTML = beakerSVG({ water:true, title:"1.00 L water", pH:c.w, delta:c.w - c.w0, aria:"Water beaker: pH " + fx2(c.w) + "." });
    $("#bf-bb", host).innerHTML = beakerSVG({ title:"1.00 L buffer" + (S.dil ? " (diluted ×10)" : ""), pH:c.m.pH, delta:c.m.pH - c.m0.pH, badge:c.m.out ? "capacity exceeded" : "", aria:"Buffer beaker: pH " + fx2(c.m.pH) + (c.m.out ? ", capacity exceeded." : ".") });
  }
  function range(){ var e = eff(), x = Math.abs(net()); return clamp(Math.ceil(Math.max(e.a, e.b, x, dispX == null ? 0 : Math.abs(dispX)) * 1.5 / 50) * 50, 150, 500) / 1000; }
  function drawGraph(){
    if (S.mode !== "compare") return;
    var c = now(curX()), P = c.P, a = c.e.a / 1000, b = c.e.b / 1000, R = range(), x = c.x / 1000;
    plot.draw({ view:{ xmin:-R, xmax:R, ymin:0, ymax:14 },
      bands:[{ x0:b, x1:R + 1, color:css("--hi-soft") }, { x0:-R - 1, x1:-a, color:css("--hi-soft") }],
      xTicks:{ step:R > 0.3 ? 0.1 : 0.05, fmt:function(t){ return MV.chem.fx(Math.abs(t), 2); } }, yTicks:{ step:2 },
      curves:[{ f:function(t){ return waterPH(t); }, color:css("--ink-2"), width:2.4, dash:[6, 6] }, { f:function(t){ return bufModel(P.pKa, a, b, t).pH; }, color:css("--pen"), width:3.2 }],
      points:[{ x:x, y:c.w, r:5.5, color:css("--ink-2") }, { x:x, y:c.m.pH, r:6, color:css("--pen") }],
      labels:[{ x:-R, y:13.2, dx:6, text:"← NaOH (mol)", align:"left", font:"600 12px " + (css("--font-ui") || "sans-serif"), color:css("--ink-2"), bg:true }, { x:R, y:13.2, dx:-6, text:"HCl (mol) →", align:"right", font:"600 12px " + (css("--font-ui") || "sans-serif"), color:css("--ink-2"), bg:true }],
      yLabel:"pH",
      describe:"Graph of pH against moles added (NaOH to the left of 0, HCl to the right). Buffer curve (solid): flat near pH " + fx2(c.m0.pH) + " and falling steeply once " + molTxt(b) + " mol of HCl or rising steeply once " + molTxt(a) + " mol of NaOH is added (shaded). Water curve (dashed) jumps away from 7 at once. Now: buffer pH " + fx2(c.m.pH) + ", water pH " + fx2(c.w) + "." });
  }
  function paintDots(){
    var c = now(curX()), u = unit(), P = c.P;
    $(".bf-dleg", host).innerHTML = '<span class="bf-dk bf-dk-ha" aria-hidden="true"></span> ' + F(P.HA) + " (acid form) · " + '<span class="bf-dk bf-dk-a" aria-hidden="true"></span> ' + F(P.A) + " (base form) · " +
      '<span class="bf-dk bf-dk-h" aria-hidden="true"></span> H₃O⁺ · <span class="bf-dk bf-dk-oh" aria-hidden="true"></span> OH⁻. Each dot = ' + mm(u) + " mol" + (S.dil ? " (diluted: one tenth as much of each)." : ".");
    var d = dotsOf(curX()), aria = "Particle view: " + d.nB + " base-form dots and " + (d.T - d.nB) + " acid-form dots" + (d.E || d.more ? ", " + (d.E + d.more) + " leftover " + (d.kind === "acid" ? "H₃O⁺" : "OH⁻") + " dots" : "") + ".";
    if (MV.reduceMotion && frames) {
      $(".bf-dots", host).innerHTML = '<div class="bf-frames"><div>' + dotSVG(frames.before, null, "Before", "Before: " + frames.before.nB + " base-form and " + (frames.before.T - frames.before.nB) + " acid-form dots.") + "</div><div>" + dotSVG(d, null, "After", "After: " + aria) + "</div></div>";
      return;
    }
    $(".bf-dots", host).innerHTML = dotSVG(movers ? movers.st : d, movers ? movers.list : null, movers ? "" : (d.E || d.more ? "Leftover " + (d.kind === "acid" ? "H₃O⁺" : "OH⁻") + ": capacity exceeded" : ""), aria);
  }
  function paintCalc(){
    var c = now(net()), P = c.P, m = c.m, x = c.x / 1000, a0 = c.e.a / 1000, b0 = c.e.b / 1000, h = "", HA = F(P.HA), A = F(P.A);
    if (S.dil) h += '<p class="tiny muted">Diluted ×10: the 1.00 L holds one tenth of each component.</p>';
    if (!c.x) {
      h += "<p>Nothing added yet.</p>";
    } else {
      var acid = x > 0, ion = acid ? "H₃O⁺" : "OH⁻", amt = Math.abs(x), u = m.used;
      h += '<p class="bf-rx">' + (acid ? F(P.A + " + H3O+ -> " + P.HA + " + H2O") : F(P.HA + " + OH- -> " + P.A + " + H2O")) + " (goes to completion)</p>";
      var rows = [[HA, molTxt(a0), (acid ? "+" : MINUS) + molTxt(u), molTxt(m.a)], [A, molTxt(b0), (acid ? MINUS : "+") + molTxt(u), molTxt(m.b)], [ion + " added", molTxt(amt), MINUS + molTxt(u), molTxt(m.ex)]];
      h += MV.tableHTML({ head:["Species", "Before (mol)", "Change (mol)", "After (mol)"], rows:rows, caption:"Moles table (1.00 L)" });
    }
    var L = [];
    if (m.how === "ratio") {
      L.push("pH = " + PKA + " + log(<i>n</i>(base) ÷ <i>n</i>(acid))");
      L.push("= " + fx2(P.pKa) + " + log(" + molTxt(m.b) + " ÷ " + molTxt(m.a) + ")");
      L.push("= " + fx2(P.pKa) + " + (" + sgn2(lg(m.b / m.a)) + ")");
      L.push("= <strong>" + fx2(m.pH) + "</strong>");
    } else if (m.how === "exAcid") {
      L.push("Capacity exceeded: " + A + " is used up.");
      L.push("[H₃O⁺] = excess strong acid ÷ volume = " + molTxt(m.ex) + " mol ÷ 1.00 L = " + molTxt(m.ex) + " mol/L");
      L.push("pH = " + MINUS + "log " + molTxt(m.ex) + " = <strong>" + fx2(m.pH) + "</strong>");
    } else if (m.how === "exBase") {
      L.push("Capacity exceeded: " + HA + " is used up.");
      L.push("[OH⁻] = excess strong base ÷ volume = " + molTxt(m.ex) + " mol ÷ 1.00 L = " + molTxt(m.ex) + " mol/L");
      L.push("pOH = " + MINUS + "log " + molTxt(m.ex) + " = " + fx2(PKW - m.pH) + "; pH = 14.00 " + MINUS + " pOH = <strong>" + fx2(m.pH) + "</strong>");
    } else if (m.how === "weakAcid") {
      var Ka = Math.pow(10, -P.pKa);
      L.push("Capacity reached: " + A + " is used up exactly, so only the weak acid " + HA + " is left: [" + HA + "] = " + molTxt(m.a) + " mol/L.");
      L.push("ICE: <i>x</i>² ÷ (" + molTxt(m.a) + " " + MINUS + " <i>x</i>) = " + "<i>K</i><sub>a</sub> = " + MV.chem.sci(Ka) + ", so <i>x</i> = [H₃O⁺] = " + MV.chem.sci(quadX(Ka, m.a)) + " mol/L");
      L.push("pH = <strong>" + fx2(m.pH) + "</strong>");
    } else {
      var Kb = KW / Math.pow(10, -P.pKa);
      L.push("Capacity reached: " + HA + " is used up exactly, so only the weak base " + A + " is left: [" + A + "] = " + molTxt(m.b) + " mol/L.");
      L.push("<i>K</i><sub>b</sub> = <i>K</i><sub>w</sub> ÷ <i>K</i><sub>a</sub> = " + MV.chem.sci(Kb) + "; ICE gives [OH⁻] = " + MV.chem.sci(quadX(Kb, m.b)) + " mol/L");
      L.push("pOH = " + fx2(PKW - m.pH) + "; pH = 14.00 " + MINUS + " pOH = <strong>" + fx2(m.pH) + "</strong>");
    }
    h += '<div class="bf-lines">' + L.map(function(l){ return "<p>" + l + "</p>"; }).join("") + "</div>";
    h += '<p class="tiny muted">Water, for comparison: ' + (c.x ? "[" + (x > 0 ? "H₃O⁺" : "OH⁻") + "] = " + molTxt(Math.abs(x)) + " mol/L, so pH = " + fx2(c.w) : "pH 7.00") + ".</p>";
    $(".bf-calc", host).innerHTML = h;
  }
  function paintViews(){
    $$v().forEach(function(v){ v.hidden = v.dataset.v !== S.mode; });
    var c = now(curX());
    paintRead(c);
    if (S.mode === "compare") { paintBeakers(c); drawGraph(); }
    else if (S.mode === "particles") paintDots();
    else paintCalc();
  }
  function $$v(){ return Array.prototype.slice.call(host.querySelectorAll(".bf-v")); }
  function paint(){ pairRG.set(S.pair); naRG.set(S.na); nbRG.set(S.nb); stepRG.set(S.step); modeRG.set(S.mode); paintCtrl(); paintViews(); MV.changed(); }

  // ----- actions -----
  function animate(x0, x1, cb){
    busy = true; paintCtrl();
    var end = function(){ busy = false; dispX = null; movers = null; cancel = null; paint(); if (cb) MV.wait(150, cb); };
    frames = { before:dotsOf(x0) };
    if (S.mode === "particles" && !MV.reduceMotion) {
      var b = dotsOf(x0), a = dotsOf(x1), u = unit(), k = Math.round(Math.abs(x1 - x0) / u), acid = x1 > x0, list = [], i;
      var oppEx = (acid && b.kind === "base") || (!acid && b.kind === "acid") ? b.E : 0, n1 = Math.min(k, oppEx), left = k - n1;
      var pool = acid ? Math.min(left, b.nB) : Math.min(left, b.T - b.nB); left -= pool;
      var targets = [];
      for (i = 0; i < n1; i++) targets.push(b.T + b.E - 1 - i);
      for (i = 0; i < pool; i++) targets.push(acid ? b.nB - 1 - i : b.nB + i);
      var sameEx = (acid && b.kind === "acid") || (!acid && b.kind === "base") ? b.E : 0;
      for (i = 0; i < left; i++) targets.push(b.T + sameEx + i);
      targets = targets.slice(0, 40);
      targets.forEach(function(tg, j){ var p = slotXY(tg); list.push({ sx:184 + (j - targets.length / 2) * 7, sy:44, tx:p[0], ty:p[1], kind:acid ? "H" : "OH" }); });
      cancel = MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){
        if (t < 0.8) { var e = clamp(t / 0.75, 0, 1); e = e * e * (3 - 2 * e); movers = { st:b, list:list.map(function(m){ return { x:m.sx + (m.tx - m.sx) * e, y:m.sy + (m.ty - m.sy) * e, kind:m.kind }; }) }; }
        else movers = { st:a, list:[] };
        paintDots();
      }, done:end });
      void a;
      return;
    }
    cancel = MV.tween({ dur:S.mode === "compare" ? 1100 : 300, step:function(t){ dispX = x0 + (x1 - x0) * t; paintViews(); }, done:end });
  }
  function add(dm, cb){
    var x0 = net(), x1 = x0 + dm;
    if (busy || Math.abs(x1) > 500) return;
    S.adds.push(dm); api.save();
    animate(x0, x1, cb);
  }
  function undo(){ if (busy || !S.adds.length) return; S.adds.pop(); frames = null; api.save(); paint(); }
  function reset(){ if (busy) return; S.adds = []; S.dil = false; frames = null; api.save(); paint(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-act]"); if (!b || b.disabled || busy) return;
    var act = b.dataset.act;
    if (act === "hcl") add(S.step); else if (act === "naoh") add(-S.step); else if (act === "dose") add(150);
    else if (act === "undo") undo(); else if (act === "reset") reset();
    else if (act === "dil") { S.dil = !S.dil; frames = null; api.save(); paint(); }
  });
  (host.closest(".sheet") || host).addEventListener("keydown", function(e){
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
      var t = e.target; if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT")) return;
      e.preventDefault(); undo();
    }
  });

  // ----- predictions -----
  var hooks = {
    start:function(p){
      if (cancel) { cancel(); cancel = null; }
      busy = false; dispX = null; movers = null; frames = null;
      S.pair = "hx"; S.na = 100; S.nb = 100; S.dil = false; S.adds = []; S.step = 10;
      S.mode = p.id === "p2" || p.id === "p4" ? "particles" : "compare";
      api.save(); paint();
    },
    run:function(p, done){
      if (p.id === "p1" || p.id === "p2") { add(20, done); return; }
      if (p.id === "p4") { add(120, done); return; }
      busy = true; paintCtrl();
      MV.wait(500, function(){ S.dil = true; busy = false; api.save(); paint(); MV.wait(700, done); });
    }
  };

  // ----- challenges -----
  function chal(id){
    var P = pairById(S.pair), x = net(), c = now(x);
    if (id === "tc1") {
      if (P.id === "meth") return { ok:false, msg:"Its " + PKA + " is 3.74." };
      if (P.id !== "eth") return { ok:false, msg:"That pair’s " + PKA + " is " + fx2(P.pKa) + ". Use ethanoic acid and ethanoate." };
      if (x) return { ok:false, msg:"Undo or reset the additions: the challenge is the buffer itself, with nothing added." };
      if (S.na === 200 && S.nb === 100) return { ok:false, msg:"Base ÷ acid = 1/2 gives 4.74 − 0.30. " + M4 };
      if (S.na === 100 && S.nb === 200) return { ok:false, msg:"That’s 4.74 + 0.30." };
      if (S.na !== S.nb) return { ok:false, msg:"pH = 4.74 + log(" + mm(S.nb) + " ÷ " + mm(S.na) + ") = " + fx2(c.m.pH) + ". You need log(ratio) = 0." };
      return { ok:true };
    }
    if (id === "tc2") {
      if (P.id !== "hx" || S.na !== 100 || S.nb !== 100 || S.dil) return { ok:false, msg:"Start with the HX buffer: model acid HX / X⁻, 0.10 mol of each form, not diluted." };
      if (x === 50) return { ok:true };
      if (x === 20) return { ok:false, msg:"Not enough. You need log(ratio) = −0.48 = log(1/3)." };
      if (x === 100) return { ok:false, msg:"That used up all the X⁻." };
      if (x <= 0) return { ok:false, msg:"Add HCl (not NaOH) to lower the pH from 5.00 to 4.52." };
      return { ok:false, msg:"The pH reads " + fx2(c.m.pH) + ". " + (x < 50 ? "Add more HCl." : "That’s too much HCl: undo some.") };
    }
    if (id === "tc3") {
      var e = eff(), d0 = bufModel(P.pKa, e.a / 1000, e.b / 1000, 0), d1 = bufModel(P.pKa, e.a / 1000, e.b / 1000, 0.150);
      if (P.id === "nh4" && S.na === 200 && S.nb === 400 && !S.dil) return { ok:true };
      if (P.id === "nh4" && S.na === 100 && S.nb === 200 && !S.dil) return { ok:false, msg:"Right pH, too little capacity. 0.15 mol of acid uses up most of the 0.20 mol of NH₃. " + M6 };
      if (P.id === "nh4" && S.na === 50 && S.nb === 100 && !S.dil) return { ok:false, msg:"The dose exceeds the 0.10 mol of NH₃: capacity exceeded." };
      if (P.id === "hocl") return { ok:false, msg:PKA + " 7.52 is too far from 9.56; even a ratio of 8 only reaches 8.42. " + M7 };
      if (P.id !== "nh4") return { ok:false, msg:"That pair’s " + PKA + " (" + fx2(P.pKa) + ") is too far from 9.56. " + M7 };
      if (Math.round(d0.pH * 100) !== 956) return { ok:false, msg:"Your buffer starts at pH " + fx2(d0.pH) + "; you need 9.56. Set the ratio NH₃ : NH₄⁺." };
      return { ok:false, msg:"Right pH, but after the test dose the pH is " + fx2(d1.pH) + ": too little capacity." + (S.dil ? " Diluting lowers the capacity." : "") };
    }
    return { ok:false };
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Buffers in your body ----------
var BREATH = { normal:{ co2:6, h2co3:3, h:4, hco3:8 }, fast:{ co2:2, h2co3:2, h:2, hco3:6 }, hold:{ co2:10, h2co3:4, h:6, hco3:10 } };
function breathSVG(from, to, t){
  // model picture, not to scale: dot groups for CO₂, H₂CO₃, H⁺ and HCO₃⁻; dots fade in or out as the counts change
  var G = [["co2", "CO₂", "CO2"], ["h2co3", "H₂CO₃", "HA"], ["h", "H⁺", "H"], ["hco3", "HCO₃⁻", "A"]], s = "";
  G.forEach(function(g, gi){
    var x0 = 20 + gi * 100, n0 = from[g[0]], n1 = to[g[0]], n = Math.max(n0, n1);
    s += '<rect x="' + x0 + '" y="8" width="88" height="150" rx="8" fill="none" stroke="var(--rule)" stroke-width="1.5"/>';
    for (var i = 0; i < n; i++) {
      var al = i < Math.min(n0, n1) ? 1 : n1 > n0 ? t : 1 - t, cx = x0 + 18 + (i % 3) * 26, cy = 140 - Math.floor(i / 3) * 26;
      if (al < 0.02) continue;
      s += g[2] === "CO2" ? '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="var(--ink-2)" opacity="' + r1(al * 10) / 10 + '"/>' : dot(cx, cy, g[2], al).replace(/r="6.2"/g, 'r="8"');
    }
    s += '<text x="' + (x0 + 44) + '" y="182" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">' + g[1] + "</text>";
  });
  return s;
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, s4 = C.s4;
  S.r = clamp(Math.round(+S.r) || 20, 5, 40); if (!BREATH[S.br]) S.br = "normal"; S.oc = clamp(S.oc | 0, 0, 5); if (typeof S.ex !== "string") S.ex = "";
  var bShow = BREATH[S.br], bBusy = false, medMsg = null;
  host.innerHTML =
    '<div class="part bf-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><p class="bf-rx">' + F(s1.eq) + "</p><p>" + s1.text + "</p>" +
      '<div class="bf-slide"><label for="bf-r">[HCO₃⁻] : [H₂CO₃] = <output id="bf-rout">20 : 1</output></label><input type="range" id="bf-r" min="5" max="40" step="1" value="' + S.r + '"></div>' +
      '<div class="q-actions bf-rq"><button type="button" class="btn ghost sm" data-r="10" data-k="r10">10 : 1</button><button type="button" class="btn ghost sm" data-r="20" data-k="r20">20 : 1</button><button type="button" class="btn ghost sm" data-r="40" data-k="r40">40 : 1</button></div>' +
      '<div class="bf-meter"></div><p class="bf-bline" aria-live="polite"></p>' +
      '<details class="alg"><summary>' + s1.dataTitle + "</summary><p>" + s1.data + "</p></details></div>" +
    '<div class="part bf-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div id="bf-br"></div><p class="bf-rx">' + F("CO2(aq) + H2O(l) <=> H2CO3(aq) <=> H+(aq) + HCO3-(aq)") + '</p><p class="bf-shift" aria-live="polite"></p><p class="bf-btext" aria-live="polite"></p>' +
      '<details class="alg" open><summary>Zoom to the particles</summary><svg class="bf-brsvg" viewBox="0 0 420 192" role="img" aria-label=""></svg><p class="tiny muted">Model picture, not to scale: H₂CO₃ outlined (acid form), HCO₃⁻ teal (base form), H⁺ magenta, CO₂ grey.</p></details>' +
      '<p class="tiny">' + s2.kidney + "</p></div>" +
    '<div class="part bf-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><p class="q-prompt">' + s3.q + '</p><div class="chips bf-med" role="group" aria-label="Components">' +
      s3.choices.map(function(o, i){ return '<button type="button" class="chip" data-med="' + i + '" data-k="med' + i + '">' + o.t + "</button>"; }).join("") + '</div><div class="bf-medfb"></div></div>' +
    '<div class="part bf-st"><h3>' + s4.title + "</h3><p>" + s4.intro + '</p><p class="bf-rx">' + F(s4.eq) + "</p>" +
      '<div class="bf-ocean"></div><p class="bf-ocap" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn primary sm" data-oc="add" data-k="ocadd">Dissolve more CO₂</button><button type="button" class="btn ghost sm" data-oc="reset" data-k="ocreset">Start again</button></div>' +
      '<div class="jq"><label for="bf-ex">' + s4.prompt + '</label><textarea id="bf-ex" rows="3"></textarea></div><details class="alg"><summary>Compare with a model answer</summary><p>' + s4.model + "</p></details></div>";
  $("#bf-ex", host).value = S.ex;
  // station 1
  function paint1(){
    var r = S.r, ph = PKA_BLOOD + lg(r), p2 = Math.round(ph * 100) / 100, lab = p2 < 7.35 ? "acidosis (model)" : p2 > 7.45 ? "alkalosis (model)" : "normal range (7.35–7.45)";
    $("#bf-rout", host).textContent = r + " : 1";
    $("#bf-r", host).setAttribute("aria-valuetext", r + " to 1, blood pH " + fx2(ph) + ", " + lab);
    $(".bf-meter", host).innerHTML = meterSVG(ph, { lo:6.8, hi:8.0, tick:0.2, acidTo:7.35, baseFrom:7.45, band:[7.35, 7.45], aria:"Blood pH gauge from 6.8 to 8.0: reading " + fx2(ph) + ", " + lab + ". The normal range 7.35 to 7.45 is highlighted." });
    $(".bf-bline", host).innerHTML = "log " + r + " = " + fx2(lg(r)) + ", so pH = " + MV.chem.fx(PKA_BLOOD, 1) + " + " + fx2(lg(r)) + " = <strong>" + fx2(ph) + "</strong>: " + lab + ".";
  }
  $("#bf-r", host).addEventListener("input", function(e){ S.r = clamp(+e.target.value, 5, 40); api.save(); paint1(); });
  // station 2
  var brRG = radios($("#bf-br", host), { label:"Breathing", cls:"seg", options:[{ id:"normal", t:"Normal" }, { id:"fast", t:"Fast and deep" }, { id:"hold", t:"Holding breath" }], value:S.br, onChange:function(v){
    var from = bShow; S.br = v; api.save(); bBusy = true; brRG.lock(true);
    MV.tween({ dur:1200, step:function(t){ drawBr(from, BREATH[v], t); }, done:function(){ bShow = BREATH[v]; bBusy = false; brRG.lock(false); paint2(); } });
    paintText2();
  } });
  function drawBr(from, to, t){ var svg = $(".bf-brsvg", host); svg.innerHTML = breathSVG(from, to, t); }
  function paintText2(){
    var k = S.br;
    $(".bf-shift", host).innerHTML = k === "normal" ? "Equilibrium: steady." : k === "fast" ? "CO₂ removed → equilibrium shifts ← (left): H⁺ ↓, pH ↑" : "CO₂ builds up → equilibrium shifts → (right): H⁺ ↑, pH ↓";
    $(".bf-btext", host).innerHTML = s2.states[k];
    var b = BREATH[k];
    $(".bf-brsvg", host).setAttribute("aria-label", "Model picture: " + b.co2 + " CO₂, " + b.h2co3 + " H₂CO₃, " + b.h + " H⁺ and " + b.hco3 + " HCO₃⁻ particles (" + (k === "normal" ? "normal breathing" : k === "fast" ? "fast, deep breathing: fewer CO₂ and H⁺" : "holding breath: more CO₂ and H⁺") + ").");
  }
  function paint2(){ drawBr(bShow, bShow, 1); paintText2(); }
  // station 3
  host.querySelector(".bf-med").addEventListener("click", function(e){
    var b = e.target.closest("[data-med]"); if (!b) return;
    var o = s3.choices[+b.dataset.med], good = MV.ok(o);
    host.querySelectorAll("[data-med]").forEach(function(x){ x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    $(".bf-medfb", host).innerHTML = MV.fbHTML(good ? "good" : "bad", (good ? "" : "<strong>✗ Not quite.</strong> ") + o.fb);
    medMsg = good;
  });
  void medMsg;
  // station 4: carbonate reserve (model picture)
  function paint4(){
    var k = S.oc, co3 = 10 - 2 * k, hco3 = 6 + 4 * k, s = "", i;
    for (i = 0; i < 10; i++) s += dot(30 + (i % 5) * 26, 40 + Math.floor(i / 5) * 26, "A", i < co3 ? 1 : 0.15).replace(/r="6.2"/g, 'r="8"');
    for (i = 0; i < hco3; i++) s += dot(214 + (i % 7) * 24, 40 + Math.floor(i / 7) * 24, "HA").replace(/r="6.2"/g, 'r="8"');
    s += '<text x="82" y="112" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">CO₃²⁻ left: ' + co3 + '</text><text x="286" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="var(--ink)">HCO₃⁻: ' + hco3 + "</text>";
    $(".bf-ocean", host).innerHTML = '<svg class="bf-osvg" viewBox="0 0 400 140" role="img" aria-label="' + esc("Model picture: " + co3 + " carbonate ions left of 10, " + hco3 + " hydrogen carbonate ions.") + '">' + s + "</svg>";
    $(".bf-ocap", host).innerHTML = k === 0 ? "Model picture, not to scale: carbonate (CO₃²⁻, teal) is the base reserve." : co3 > 0 ? "Each dose of CO₂ uses up carbonate and makes HCO₃⁻. The pH falls only slowly, but the reserve shrinks." : "The carbonate reserve is used up: the buffer can no longer absorb the acid, and the pH would fall faster.";
    $('[data-oc="add"]', host).disabled = k >= 5; $('[data-oc="reset"]', host).disabled = !k;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.r) { S.r = +b.dataset.r; $("#bf-r", host).value = S.r; api.save(); paint1(); return; }
    if (b.dataset.oc) { S.oc = b.dataset.oc === "reset" ? 0 : Math.min(5, S.oc + 1); api.save(); MV.keepFocus(host, paint4); }
  });
  $("#bf-ex", host).addEventListener("input", function(e){ S.ex = e.target.value; api.save(); });
  void bBusy;
  paint1(); paint2(); paint4();
}

// ---------- Performance task: Design a buffer ----------
function taskSVG(d){
  var lo = 4.0, hi = 6.0, x0 = 20, x1 = 400, X = function(p){ return x0 + (x1 - x0) * (clamp(p, lo, hi) - lo) / (hi - lo); }, s = "";
  s += '<rect x="' + r1(X(4.85)) + '" y="20" width="' + r1(X(5.15) - X(4.85)) + '" height="40" fill="var(--hi-soft)"/><line x1="' + x0 + '" y1="60" x2="' + x1 + '" y2="60" stroke="var(--ink-2)" stroke-width="1.5"/>';
  for (var p = 4; p <= 6.001; p += 0.5) s += '<line x1="' + r1(X(p)) + '" y1="60" x2="' + r1(X(p)) + '" y2="66" stroke="var(--ink-2)"/><text x="' + r1(X(p)) + '" y="80" text-anchor="middle" font-size="12" fill="var(--ink-2)">' + MV.chem.fx(p, 1) + "</text>";
  var a = X(d.pH), b = X(d.pH2);
  s += '<circle cx="' + r1(a) + '" cy="40" r="7" fill="var(--pen)"/>';
  if (Math.abs(a - b) > 3) s += '<line x1="' + r1(a) + '" y1="40" x2="' + r1(b + (b < a ? 7 : -7)) + '" y2="40" stroke="var(--ink-2)" stroke-width="2"/>';
  s += '<circle cx="' + r1(b) + '" cy="40" r="7" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="2.4"/>';
  s += '<text x="' + r1(X(5)) + '" y="14" text-anchor="middle" font-size="12" fill="var(--ink-2)">target 4.85–5.15</text>';
  return '<svg class="bf-tsvg" viewBox="0 0 420 88" role="img" aria-label="' + esc("pH scale 4 to 6 with the target band 4.85 to 5.15: your buffer starts at pH " + fx2(d.pH) + " (filled dot) and is at pH " + fx2(d.pH2) + " after the test dose (open dot).") + '">' + s + "</svg>";
}
var task = (function(){
  var S = null;
  function read(){
    var P = pairById(S && S.pair) || pairById("hx"), a = S ? S.na : 100, b = S ? S.nb : 100;
    var m0 = bufModel(P.pKa, a / 1000, b / 1000, 0), m1 = bufModel(P.pKa, a / 1000, b / 1000, 0.030);
    return { pair:P.id, na:a, nb:b, pH:m0.pH, pH2:m1.pH, drop:m0.pH - m1.pH, held:b - 30 > 0, total:a + b };
  }
  function labelOf(k){
    var p = k.split("|"), P = pairById(p[0]); if (!P) return k;
    var a = +p[1], b = +p[2];
    return (P.model ? "model HX " : P.acid + " ") + mm(a) + " / " + (P.model ? "X⁻ " : P.base + " ") + mm(b) + " (pH " + fx2(P.pKa + lg(b / a)) + ")";
  }
  function paint(){
    var d = read();
    $("#bf-tkv").innerHTML = taskSVG(d);
    $("#bf-tkread").innerHTML = MV.readoutHTML([["pH", fx2(d.pH)], ["After 0.030 mol HCl", d.held ? fx2(d.pH2) : fx2(d.pH2) + " (capacity exceeded)"], ["Drop", fx2(d.drop)], ["Total solute", mm(d.total) + " mol"]]);
  }
  return {
    render:function(inp, pv, a){
      S = a.S;
      if (!pairById(S.pair)) S.pair = "eth"; if (AMTS.indexOf(S.na) < 0) S.na = 100; if (AMTS.indexOf(S.nb) < 0) S.nb = 100;
      inp.innerHTML = '<div id="bf-tkp"></div><div id="bf-tka"></div><div id="bf-tkb"></div><p class="tiny muted">All in 1.00 L. ' + PKA + " values from the course tables (HX is the model acid).</p>";
      pv.innerHTML = '<h4 class="bf-h4">Your buffer</h4><div id="bf-tkv"></div><dl class="read" id="bf-tkread" aria-live="polite"></dl>';
      radios($("#bf-tkp"), { label:"Pair", cls:"chips", options:PAIRS.map(function(p){ return { id:p.id, t:pairLabel(p) }; }), value:S.pair, onChange:function(v){ S.pair = v; a.save(); paint(); a.update(); } });
      radios($("#bf-tka"), { label:"<i>n</i>(acid form)", aria:"n(acid form)", cls:"chips", options:AMTS.map(function(x){ return { id:x, t:mm(x) + " mol" }; }), value:S.na, onChange:function(v){ S.na = +v; a.save(); paint(); a.update(); } });
      radios($("#bf-tkb"), { label:"<i>n</i>(base form)", aria:"n(base form)", cls:"chips", options:AMTS.map(function(x){ return { id:x, t:mm(x) + " mol" }; }), value:S.nb, onChange:function(v){ S.nb = +v; a.save(); paint(); a.update(); } });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var p = Math.round(d.pH * 100);
      return [p >= 485 && p <= 515, d.held && Math.round(d.drop * 100) <= 30, d.total <= 500];
    },
    key:function(d){ return d.pair + "|" + d.na + "|" + d.nb; },
    label:function(k){ return labelOf(k); },
    text:function(k){ return MV.plain(labelOf(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
