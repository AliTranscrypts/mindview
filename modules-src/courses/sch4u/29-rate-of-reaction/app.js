// SCH4U 29 Rate of Reaction: hero (a marble chip and the same mass of powder in acid; volume–time curves draw live, with
// tangents at 10 s), Reaction rate lab (Explore: Data mode V4-style secant/tangent tool on the model [A]–t and V–t graphs;
// Experiment mode CaCO₃ + HCl bench with gas syringe, timer, results table and IV/DV/controls chips; Catalyst and nature
// mode), Read the rate (Part 3: species gauges, unit matcher, mass-loss graph), "Hit 15 seconds" task (live syringe preview).
(function(){
"use strict";
var $ = MV.$, F = MV.chem.f, css = MV.css;
function esc(s){ return MV.esc(s); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
// fixed decimals with a true minus
function fx(v, dp){ var s = Math.abs(v).toFixed(dp); return (v < 0 && +s !== 0 ? "−" : "") + s; }
// a time or rate without trailing zeros (3.75, 7.5, 30), true minus
function tn(v){ var s = String(Math.round(v * 100) / 100); return s.replace("-", "−"); }
function near(a, b, tol){ return Math.abs(a - b) <= tol; }
var TI = "<i>t</i>";
var M1 = "Rates are positive. For a reactant, rate = −Δ[A] ÷ Δ<i>t</i>.";
var M2 = "Instantaneous rate is the slope of the <strong>tangent</strong> at that moment, not an average from the start.";
var M5 = "Change only the factor you’re testing; otherwise you can’t tell which change caused the effect.";

// ---------- module model (plan §4 "Model rules"; model data, not course-table values) ----------
var MOD = {
  conc:{ f:function(t){ return 0.9 - 0.03 * t + 0.00025 * t * t; }, d:function(t){ return -0.03 + 0.0005 * t; },
    view:{ xmin:-5, xmax:64, ymin:-0.09, ymax:1.0 }, yl:"[A] (mol/L)", unit:"mol/(L·s)", yu:"mol/L", dp:3, sdp:3, sstep:0.001, ystep:0.1, name:"concentration" },
  gas:{ f:function(t){ return 4 * t - t * t / 30; }, d:function(t){ return 4 - t / 15; },
    view:{ xmin:-5, xmax:64, ymin:-12, ymax:132 }, yl:"V of gas (mL)", unit:"mL/s", yu:"mL", dp:1, sdp:1, sstep:0.1, ystep:20, name:"gas volume" }
};
var BASE = 2.0, VOL = 60;                       // standard CO₂ rate (mL/s) at 1.00 mol/L, large chips, 20 °C; syringe target (mL)
var CONCS = [{ id:"0.5", t:"0.50 mol/L" }, { id:"1", t:"1.00 mol/L" }, { id:"2", t:"2.00 mol/L" }];
var SIZES = [{ id:"large", t:"large chips", f:1 }, { id:"small", t:"small chips", f:2 }, { id:"powder", t:"powder", f:8 }];
var SIZEF = { large:1, small:2, powder:8 };
var TEMPS = [{ id:"10", t:"10 °C" }, { id:"20", t:"20 °C" }, { id:"30", t:"30 °C" }, { id:"40", t:"40 °C" }];
function rateOf(c, size, T){ return BASE * (+c / 1.00) * SIZEF[size] * Math.pow(2, (+T - 20) / 10); }
function concTxt(c){ return (+c).toFixed(2) + " mol/L"; }
function sizeTxt(s){ return SIZES.filter(function(x){ return x.id === s; })[0].t; }
function setTxt(r){ return concTxt(r.c) + ", " + sizeTxt(r.size) + ", " + r.T + " °C"; }
// Catalyst and nature modes. Catalyst masses are illustrative model values (the plan only asks that the mass is shown unchanged).
var CATS = [{ id:"none", t:"no catalyst", r:0.1 }, { id:"potato", t:"potato slice (catalase)", r:2.0, m:5.0, md:1 }, { id:"mno2", t:"manganese(IV) oxide", r:4.0, m:0.50, md:2 }];
var METALS = [{ id:"Mg", t:"Mg", r:3.0, nm:"magnesium" }, { id:"Zn", t:"Zn", r:0.5, nm:"zinc" }, { id:"Cu", t:"Cu", r:0, nm:"copper" }];
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function animDur(time){ return clamp(time * 50, 900, 4200); }

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

// ---------- SVG helpers ----------
function T(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="middle" font-size="' + (o.fs || 13) + '"' + (o.w ? ' font-weight="' + o.w + '"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' + (o.op != null && o.op < 1 ? ' opacity="' + r1(o.op * 100) / 100 + '"' : "") + ">" + s + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + (o.op != null && o.op < 1 ? ' opacity="' + r1(o.op * 100) / 100 + '"' : "") + ' stroke-linecap="round"/>'; }
function hsh(i, k){ var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }   // deterministic 0–1
// @component C6 flaskBubbles (particle-box styling, bubbles only) — a conical flask of liquid with a solid at the bottom and
// neutral rising bubbles. flask(cx, sc, o): o = {solid:"large"|"small"|"powder"|"potato"|"mno2"|"none"|"Mg"|"Zn"|"Cu", bubbles:[[u, v]] (u across 0–1, v height 0–1), drop:0–1}
function flaskPath(cx, top, sc){
  var w1 = 15 * sc, w2 = 62 * sc, neck = 44 * sc, h = 160 * sc, b = top + h;
  return { d:"M" + r1(cx - w1) + " " + r1(top) + " V" + r1(top + neck) + " L" + r1(cx - w2) + " " + r1(b - 7) + " Q" + r1(cx - w2) + " " + r1(b) + " " + r1(cx - w2 + 7) + " " + r1(b) + " H" + r1(cx + w2 - 7) + " Q" + r1(cx + w2) + " " + r1(b) + " " + r1(cx + w2) + " " + r1(b - 7) + " L" + r1(cx + w1) + " " + r1(top + neck) + " V" + r1(top),
    xAt:function(y, side){ var f = clamp((y - top - neck) / (h - neck), 0, 1); return cx + side * (w1 + (w2 - w1) * f); }, bot:b, liq:top + neck + 0.42 * (h - neck), top:top };
}
function flask(cx, top, sc, o){
  var P = flaskPath(cx, top, sc), s = "", ly = P.liq, b = P.bot;
  s += '<path d="M' + r1(P.xAt(ly, -1)) + " " + r1(ly) + " L" + r1(P.xAt(b - 3, -1)) + " " + r1(b - 3) + " H" + r1(P.xAt(b - 3, 1)) + " L" + r1(P.xAt(ly, 1)) + " " + r1(ly) + ' Z" fill="var(--info-bg)"/>';
  var sy = b - 5 * sc, dy = o.drop == null ? 0 : (1 - o.drop) * (sy - top + 30);
  var so = o.solid || "none";
  if (so === "large") [-1, 0, 1].forEach(function(k){ s += '<rect x="' + r1(cx + k * 24 * sc - 9 * sc) + '" y="' + r1(sy - 13 * sc - dy) + '" width="' + r1(18 * sc) + '" height="' + r1(13 * sc) + '" rx="' + r1(4 * sc) + '" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.6"/>'; });
  else if (so === "chip1") s += '<rect x="' + r1(cx - 11 * sc) + '" y="' + r1(sy - 16 * sc - dy) + '" width="' + r1(22 * sc) + '" height="' + r1(16 * sc) + '" rx="' + r1(5 * sc) + '" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.6"/>';
  else if (so === "small") for (var i = 0; i < 9; i++) s += '<rect x="' + r1(cx + (i - 4) * 11 * sc - 4 * sc) + '" y="' + r1(sy - (i % 2 ? 7 : 9) * sc - dy) + '" width="' + r1(8 * sc) + '" height="' + r1(7 * sc) + '" rx="' + r1(2 * sc) + '" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.3"/>';
  else if (so === "powder" || so === "mno2") for (var j = 0; j < 46; j++) s += '<circle cx="' + r1(cx + (hsh(j, 1) - 0.5) * 92 * sc) + '" cy="' + r1(sy - hsh(j, 2) * 5 * sc - dy) + '" r="' + r1(1.7 * sc) + '" fill="' + (so === "mno2" ? "var(--ink)" : "var(--ink-2)") + '"/>';
  else if (so === "potato") s += '<ellipse cx="' + r1(cx) + '" cy="' + r1(sy - 6 * sc - dy) + '" rx="' + r1(26 * sc) + '" ry="' + r1(6 * sc) + '" fill="var(--hi-soft)" stroke="var(--ink-2)" stroke-width="1.6"/>';
  else if (so === "Mg" || so === "Zn" || so === "Cu") s += '<rect x="' + r1(cx - 30 * sc) + '" y="' + r1(sy - 6 * sc - dy) + '" width="' + r1(60 * sc) + '" height="' + r1(6 * sc) + '" rx="2" fill="var(--ink-2)"/>' + T(cx, sy - 16 * sc - dy, so, { fs:12 * Math.max(sc, 0.8), w:700, c:"var(--ink-2)" });
  (o.bubbles || []).forEach(function(bb){
    var y = lerp(sy - 8 * sc, ly + 4, bb[1]), x = lerp(P.xAt(y, -1) + 10 * sc, P.xAt(y, 1) - 10 * sc, bb[0]);
    s += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1((2.2 + 1.6 * bb[1]) * sc) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.3"/>';
  });
  s += '<path d="' + P.d + '" fill="none" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/>';
  return s;
}
// bubbles for a steady rate (mL/s): n bubbles at phase ph (0–1 cycles)
function steadyBubbles(rate, ph){
  var n = rate <= 0 ? 0 : clamp(Math.round(3 + rate * 1.6), 2, 26), out = [];
  for (var i = 0; i < n; i++) out.push([hsh(i, 3), (hsh(i, 4) + ph * (0.8 + 0.4 * hsh(i, 5))) % 1]);
  return out;
}
// @component bench — flask + tube + horizontal gas syringe (0–60 mL scale, outlined in --ink) + timer, as an SVG string.
// bench({solid, vol, time, rate, ph, gas, cap, note})
function bench(o){
  var s = flask(86, 34, 1, { solid:o.solid, bubbles:o.rate > 0 && o.ph != null ? steadyBubbles(o.rate, o.ph) : [] });
  s += '<rect x="74" y="24" width="24" height="12" rx="3" fill="var(--ink-2)"/>';
  s += '<path d="M86 24 V12 H182 V54 H198" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/>';
  var x0 = 200, pxml = 2, xp = x0 + pxml * clamp(o.vol, 0, VOL);
  s += '<rect x="' + x0 + '" y="44" width="' + r1(xp - x0) + '" height="20" fill="var(--hi-soft)"/>';
  s += '<rect x="196" y="42" width="138" height="24" rx="4" fill="none" stroke="var(--ink)" stroke-width="2"/>';
  s += '<rect x="' + r1(xp - 2) + '" y="44" width="5" height="20" fill="var(--ink)"/>' + Ln(xp + 3, 54, Math.min(xp + 60, 352), 54, { w:3 }) + Ln(Math.min(xp + 60, 352), 46, Math.min(xp + 60, 352), 62, { w:3 });
  for (var m = 0; m <= VOL; m += 10) s += Ln(x0 + m * pxml, 66, x0 + m * pxml, m % 20 ? 71 : 74, { w:1.4, c:"var(--ink-2)" }) + (m % 20 ? "" : T(x0 + m * pxml, 84, String(m), { fs:12, c:"var(--ink-2)" }));
  s += T(338, 84, "mL", { fs:12, c:"var(--ink-2)", a:"start" });
  s += T(266, 26, "gas syringe" + (o.gas ? ", " + o.gas : ""), { fs:12, c:"var(--ink-2)" });
  s += T(266, 120, o.time == null ? "t = 0 s" : o.time, { fs:22, w:700 });
  s += T(266, 148, o.note || "", { fs:13, c:"var(--ink-2)" });
  s += T(266, 172, o.vol == null ? "" : r1(o.vol) + " mL collected", { fs:13, c:"var(--ink-2)" });
  s += T(86, 214, o.cap || "", { fs:12.5, c:"var(--ink-2)" });
  return s;
}

// ---------- hero ----------
var HK = { chip:0.02, powder:0.1 }, HV = 60, HTMAX = 150;   // hero model data: V = 60(1 − e^(−kt)) mL
function hV(k, t){ return HV * (1 - Math.exp(-k * t)); }
function hS(k, t){ return HV * k * Math.exp(-k * t); }
var HCAP = ["Same acid, same mass of marble: a chip on the left, powder on the right.", "Bubbles of CO₂ rise; the powder fizzes far faster.",
  "The powder curve is steeper and levels off sooner, at the same final volume.", "Tangents at 10 s: about 2.2 mL/s for the powder and 1.0 mL/s for the chip (model data)."];
function hero(){
  var fl = $("#rr-hx-fl"), gr = $("#rr-hx-gr"), cap = $("#rr-hx-cap"), rep = $("#rr-hx-replay"); if (!fl || !gr) return;
  var st = { drop:0, t:0, tan:0 }, run = 0;
  var GX = function(t){ return 50 + t * (310 / HTMAX); }, GY = function(v){ return 212 - v * (180 / 70); };
  function bubbles(k, t){
    var out = [], per = 1.5, life = 18;
    for (var i = 1; i * per < HV - 0.5; i++) {
      var tb = -Math.log(1 - i * per / HV) / k, age = t - tb;
      if (age >= 0 && age <= life) out.push([hsh(i, k * 100), age / life]);
    }
    return out;
  }
  function draw(){
    var t = st.t, s = "";
    s += flask(65, 30, 0.78, { solid:"chip1", drop:st.drop, bubbles:st.drop >= 1 ? bubbles(HK.chip, t) : [] }) + T(65, 172, "chip", { fs:14, w:700 });
    s += flask(195, 30, 0.78, { solid:"powder", drop:st.drop, bubbles:st.drop >= 1 ? bubbles(HK.powder, t) : [] }) + T(195, 172, "powder", { fs:14, w:700 });
    s += T(130, 200, "same acid, same mass of CaCO₃", { fs:12.5, c:"var(--ink-2)" });
    fl.innerHTML = s;
    var g = "";
    [0, 20, 40, 60].forEach(function(v){ g += Ln(50, GY(v), 360, GY(v), { w:1, c:"var(--plot-grid)" }) + T(44, GY(v), String(v), { fs:12, a:"end", c:"var(--ink-2)" }); });
    [0, 50, 100, 150].forEach(function(x){ g += Ln(GX(x), 30, GX(x), 212, { w:1, c:"var(--plot-grid)" }) + T(GX(x), 226, String(x), { fs:12, c:"var(--ink-2)" }); });
    g += Ln(50, 212, 362, 212, { w:1.6, c:"var(--plot-axis)" }) + Ln(50, 26, 50, 212, { w:1.6, c:"var(--plot-axis)" });
    g += T(362, 242, TI.replace("<i>", '<tspan font-style="italic">').replace("</i>", "</tspan>") + " (s)", { fs:12.5, a:"end", c:"var(--ink-2)" }) + T(56, 16, "V of CO₂ (mL)", { fs:12.5, a:"start", c:"var(--ink-2)" });
    g += T(356, 40, "model data", { fs:11.5, a:"end", c:"var(--ink-2)" });
    [["powder", "var(--pen)", ""], ["chip", "var(--f3)", "7 5"]].forEach(function(c){
      var k = HK[c[0]], pts = [];
      for (var tt = 0; tt <= t + 1e-9; tt += 1.5) pts.push(r1(GX(tt)) + "," + r1(GY(hV(k, tt))));
      pts.push(r1(GX(t)) + "," + r1(GY(hV(k, t))));
      g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + c[1] + '" stroke-width="3"' + (c[2] ? ' stroke-dasharray="' + c[2] + '"' : "") + ' stroke-linejoin="round"/>';
      if (t > 60) g += T(GX(t) - 4, GY(hV(k, t)) + (c[0] === "powder" ? -12 : 14), c[0], { fs:13, w:700, a:"end", c:c[1] });
    });
    if (st.tan > 0) [["powder", -1], ["chip", 1]].forEach(function(c){
      var k = HK[c[0]], y0 = hV(k, 10), m = hS(k, 10), a = 9, x1 = 10 - a, x2 = 10 + a * (c[0] === "powder" ? 1.6 : 3.2);
      g += Ln(GX(x1), GY(y0 + m * (x1 - 10)), GX(x2), GY(y0 + m * (x2 - 10)), { w:2.2, op:st.tan }) + '<circle cx="' + r1(GX(10)) + '" cy="' + r1(GY(y0)) + '" r="4" fill="var(--ink)"' + (st.tan < 1 ? ' opacity="' + r1(st.tan * 100) / 100 + '"' : "") + "/>";
      g += T(GX(x2) + 4, GY(y0 + m * (x2 - 10)) + (c[0] === "powder" ? -2 : 4), "slope " + fx(m, 1) + " mL/s", { fs:12.5, w:700, a:"start", op:st.tan });
    });
    gr.innerHTML = g;
  }
  function play(){
    var id = ++run; rep.hidden = true; st = { drop:0, t:0, tan:0 }; cap.textContent = HCAP[0]; draw();
    if (MV.reduceMotion) { st = { drop:1, t:HTMAX, tan:1 }; draw(); cap.textContent = HCAP[3]; rep.hidden = false; return; }
    MV.wait(700, function(){
      if (id !== run) return;
      MV.tween({ dur:900, step:function(t){ if (id !== run) return; st.drop = t; draw(); }, done:function(){
        if (id !== run) return; cap.textContent = HCAP[1];
        MV.tween({ dur:6500, ease:LIN, step:function(t){ if (id !== run) return; st.t = t * HTMAX; if (st.t > 45) cap.textContent = HCAP[2]; draw(); }, done:function(){
          if (id !== run) return;
          MV.tween({ dur:900, step:function(t){ if (id !== run) return; st.tan = t; draw(); }, done:function(){ if (id !== run) return; cap.textContent = HCAP[3]; rep.hidden = false; } });
        } });
      } });
    });
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Reaction rate lab ----------
function explore(host, api){
  var S = api.S, C = api.content;
  function dflt(){
    if (["data", "exp", "cat"].indexOf(S.mode) < 0) S.mode = "data";
    if (!MOD[S.graph]) S.graph = "conc"; if (S.tool !== "tan") S.tool = "sec";
    S.t1 = Number.isInteger(S.t1) ? clamp(S.t1, 0, 60) : 0; S.t2 = Number.isInteger(S.t2) ? clamp(S.t2, 0, 60) : 20; if (S.t1 === S.t2) S.t2 = S.t1 < 60 ? S.t1 + 1 : 59;
    S.tt = Number.isInteger(S.tt) ? clamp(S.tt, 0, 60) : 10; S.ts = typeof S.ts === "number" ? S.ts : 0; S.entry = typeof S.entry === "string" ? S.entry : "";
    if (!byId(CONCS, String(S.c))) S.c = "1"; if (!SIZEF[S.size]) S.size = "large"; if (!byId(TEMPS, String(S.T))) S.T = "20";
    S.runs = Array.isArray(S.runs) ? S.runs.filter(function(r){ return r && byId(CONCS, String(r.c)) && SIZEF[r.size] && byId(TEMPS, String(r.T)); }) : [];
    S.ctl = S.ctl || {}; S.sub = S.sub === "nat" ? "nat" : "cat"; if (!byId(CATS, S.cat)) S.cat = "none"; if (!byId(METALS, S.metal)) S.metal = "Mg";
    S.cdone = S.cdone || null;
  }
  dflt();
  var busy = false, tw = null, ph = 0, phTw = null, show3 = 0, hideRate = false, note = "", flash = "", exAnim = null, cxAnim = null;

  host.innerHTML = '<p class="how rr-how">' + C.how + '</p><div class="rr-modes"></div>' +
    '<div class="rr-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    // Data
    '<div class="rr-v" data-v="data"><div class="rr-grid"><div class="rr-gcol"><div class="plot-wrap"><canvas class="plot rr-plot" role="img" aria-label="Rate graph"></canvas></div><p class="tiny muted rr-gcap">Model data. Curve: the model; grey line: secant; black line: tangent.</p></div>' +
    '<div class="rr-ccol"><div class="rr-graph"></div><div class="rr-tool"></div>' +
    '<div class="rr-entry numrow"><label for="rr-entry">Instantaneous rate at <span class="rr-entt"></span>:</label><input class="numin" id="rr-entry" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span class="rr-entu"></span></div>' +
    '<p class="rr-note" aria-live="polite"></p><dl class="read rr-read" aria-live="polite"></dl></div></div></div>' +
    // Experiment
    '<div class="rr-v" data-v="exp"><div class="rr-grid"><div class="rr-gcol"><div class="rr-svgbox"><svg class="rr-bench" viewBox="0 0 360 226" role="img" aria-label=""></svg></div></div>' +
    '<div class="rr-ccol"><p class="rr-rxn"></p><div class="rr-ec"></div><div class="rr-es"></div><div class="rr-et"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm rr-run" data-k="rrrun">Run</button></div><p class="rr-note rr-enote" aria-live="polite"></p><dl class="read rr-eread" aria-live="polite"></dl></div></div>' +
    '<div class="rr-runs"><div class="rr-runtbl"></div><div class="q-actions"><button type="button" class="btn ghost sm rr-clear" data-k="rrclear">Clear table</button></div></div>' +
    '<div class="rr-benchq"><p class="rr-lab">Your experiment design</p><div class="rr-iv"></div><div class="rr-dv"></div><div class="rr-ctl" role="group" aria-label="Controlled variables"></div></div></div>' +
    // Catalyst and nature
    '<div class="rr-v" data-v="cat"><div class="rr-grid"><div class="rr-gcol"><div class="rr-svgbox"><svg class="rr-bench rr-cbench" viewBox="0 0 360 226" role="img" aria-label=""></svg></div></div>' +
    '<div class="rr-ccol"><div class="rr-sub"></div><p class="rr-rxn rr-crxn"></p><div class="rr-cpick"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm rr-crun" data-k="rrcrun">Run</button></div><p class="rr-note rr-cnote" aria-live="polite"></p><dl class="read rr-cread" aria-live="polite"></dl></div></div></div>' +
    "</div>";
  function q(s){ return $(s, host); }

  // ----- controls -----
  var modeRG = radios(q(".rr-modes"), { label:"Mode", aria:"Lab mode", options:C.modes, value:S.mode, onChange:function(v){ stopAll(); S.mode = v; show3 = 0; hideRate = false; note = ""; save(); paint(); } });
  var graphRG = radios(q(".rr-graph"), { label:"Graph", options:[{ id:"conc", t:"Concentration" }, { id:"gas", t:"Gas volume" }], value:S.graph, onChange:function(v){ S.graph = v; S.ts = 0; show3 = 0; note = ""; save(); paint(); } });
  var toolRG = radios(q(".rr-tool"), { label:"Tool", options:[{ id:"sec", t:"Secant" }, { id:"tan", t:"Tangent" }], value:S.tool, onChange:function(v){ S.tool = v; show3 = 0; note = ""; save(); paint(); } });
  var cRG = radios(q(".rr-ec"), { label:"Acid", aria:"Acid concentration", cls:"chips", options:CONCS, value:S.c, onChange:function(v){ S.c = v; afterSet(); } });
  var sRG = radios(q(".rr-es"), { label:"CaCO₃", aria:"Chip size (same mass)", cls:"chips", options:SIZES, value:S.size, onChange:function(v){ S.size = v; afterSet(); } });
  var tRG = radios(q(".rr-et"), { label:"Temperature", cls:"chips", options:TEMPS, value:S.T, onChange:function(v){ S.T = v; afterSet(); } });
  var subRG = radios(q(".rr-sub"), { label:"Test", aria:"Catalyst or nature of reactants", options:[{ id:"cat", t:"Catalyst" }, { id:"nat", t:"Nature" }], value:S.sub, onChange:function(v){ S.sub = v; S.cdone = null; buildPick(); save(); paintCat(); } });
  var pickRG = null;
  function buildPick(){
    var old = q(".rr-cpick"), nw = document.createElement("div"); nw.className = "rr-cpick"; old.parentNode.replaceChild(nw, old);
    pickRG = S.sub === "cat" ? radios(nw, { label:"Added to the H₂O₂", aria:"Catalyst", cls:"chips", options:CATS, value:S.cat, onChange:function(v){ S.cat = v; S.cdone = null; save(); paintCat(); } })
      : radios(nw, { label:"Metal strip", aria:"Metal", cls:"chips", options:METALS, value:S.metal, onChange:function(v){ S.metal = v; S.cdone = null; save(); paintCat(); } });
  }
  buildPick();
  var ivRG = radios(q(".rr-iv"), { label:"Independent variable", cls:"chips", options:[{ id:"temp", t:"temperature" }, { id:"conc", t:"acid concentration" }, { id:"size", t:"chip size" }, { id:"time", t:"time to collect 60 mL" }], value:S.iv, onChange:function(v){ S.iv = v; save(); } });
  var dvRG = radios(q(".rr-dv"), { label:"Dependent variable", cls:"chips", options:[{ id:"time", t:"time to collect 60 mL (or rate)" }, { id:"temp", t:"temperature" }, { id:"conc", t:"acid concentration" }, { id:"size", t:"chip size" }], value:S.dv, onChange:function(v){ S.dv = v; save(); } });
  var CTL = [{ id:"conc", t:"acid concentration" }, { id:"size", t:"chip size" }, { id:"temp", t:"temperature" }];
  function paintCtl(){
    MV.keepFocus(q(".rr-ctl"), function(){
      q(".rr-ctl").innerHTML = '<span class="rg-wrap"><span class="rg-lab">Controlled variables (tap each one you keep the same)</span><span class="rg chips">' + CTL.map(function(x){ var on = !!S.ctl[x.id]; return '<button type="button" class="rr-tg" aria-pressed="' + on + '" data-ctl="' + x.id + '" data-k="ctl' + x.id + '">' + (on ? "✓ " : "") + x.t + "</button>"; }).join("") + "</span></span>";
    });
  }
  q(".rr-ctl").addEventListener("click", function(e){ var b = e.target.closest("[data-ctl]"); if (!b) return; S.ctl[b.dataset.ctl] = !S.ctl[b.dataset.ctl]; save(); paintCtl(); });
  paintCtl();
  var entry = q("#rr-entry"); entry.value = S.entry;
  entry.addEventListener("input", function(){ S.entry = entry.value; save(); });
  function save(){ api.save(); MV.changed(); }
  function afterSet(){ note = ""; save(); paintExp(); }
  function lockAll(b){ busy = b; [modeRG, graphRG, toolRG, cRG, sRG, tRG, subRG, pickRG].forEach(function(r){ r.lock(b); }); q(".rr-run").disabled = b; q(".rr-crun").disabled = b; q(".rr-clear").disabled = b; }
  function stopAll(){ if (tw) { tw(); tw = null; } if (exAnim) { exAnim(); exAnim = null; } if (cxAnim) { cxAnim(); cxAnim = null; } if (phTw) { phTw(); phTw = null; } if (busy) lockAll(false); }

  // ----- Data mode: plot -----
  var L = { canvas:q(".rr-plot") };
  var plot = new MV.Plot(L.canvas, MOD.conc.view);
  function M(){ return MOD[S.graph]; }
  function sTxt(v){ return S.graph === "conc" ? fx(v, 4).replace(/(\.\d{3})0$/, "$1") : fx(v, 2); }
  function tanDx(){ return S.tt <= 44 ? 12 : -12; }
  function trueS(){ return M().d(S.tt); }
  function tanOK(){ var tr = trueS(); return Math.abs(S.ts - tr) <= Math.max(0.05 * Math.abs(tr), M().sstep * 0.5 + 1e-9); }
  function draw(){
    var Md = M(), v = Md.view, sc = { view:v, xTicks:{ step:10 }, yTicks:{ step:Md.ystep, fmt:function(y){ return S.graph === "conc" ? fx(y, 1) : String(Math.round(y)); } }, xLabel:"t (s)", yLabel:Md.yl,
      curves:[{ f:Md.f, color:css("--pen"), width:3, domain:[0, 60] }], lines:[], segments:[], points:[], labels:[] };
    var d = "Graph of " + Md.name + " against time, model data. ";
    if (show3) {
      [[0, 20], [20, 40], [40, 60]].forEach(function(p, i){
        var y1 = Md.f(p[0]), y2 = Md.f(p[1]), a = clamp(show3 - i, 0, 1); if (a <= 0) return;
        var xe = lerp(p[0], p[1], a), ye = lerp(y1, y2, a);
        sc.segments.push({ x1:p[0], y1:y1, x2:xe, y2:ye, color:css("--ink-2"), width:2.6 });
        sc.points.push({ x:p[0], y:y1, r:4, color:css("--ink-2") }); if (a >= 1) sc.points.push({ x:p[1], y:y2, r:4, color:css("--ink-2") });
        if (a >= 1) sc.labels.push({ x:(p[0] + p[1]) / 2, y:(y1 + y2) / 2, text:"rate " + fx(-(y2 - y1) / 20, 3), dx:14, dy:-14, align:"left", bg:true, color:css("--ink") });
      });
      d += "Secants over 0–20 s, 20–40 s and 40–60 s give average rates 0.025, 0.015 and 0.005 mol/(L·s).";
    } else if (S.tool === "sec") {
      var a1 = S.t1, a2 = S.t2, y1 = Md.f(a1), y2 = Md.f(a2), sl = (y2 - y1) / (a2 - a1);
      sc.lines.push({ p:[a1, y1], q:[a2, y2], color:css("--ink-2"), width:2 });
      sc.points.push({ x:a1, y:y1, r:5.5, color:css("--ink-2"), label:"P" }); sc.points.push({ x:a2, y:y2, r:5.5, color:css("--ink-2"), label:"Q" });
      if (!hideRate) sc.labels.push({ x:(a1 + a2) / 2, y:(y1 + y2) / 2, text:"slope " + sTxt(sl), dx:12, dy:S.graph === "conc" ? 16 : -16, align:"left", bg:true, color:css("--ink-2") });
      d += "Secant from " + Math.min(a1, a2) + " s to " + Math.max(a1, a2) + " s" + (hideRate ? "." : ", slope " + MV.plain(sTxt(sl)) + ".");
    } else {
      var yt = Md.f(S.tt), dx = tanDx();
      sc.lines.push({ p:[S.tt, yt], q:[S.tt + 1, yt + S.ts], color:css("--ink"), width:2.4 });
      sc.points.push({ x:S.tt, y:yt, r:6, color:css("--ink"), label:"T" });
      sc.points.push({ x:S.tt + dx, y:yt + S.ts * dx, r:5, color:css("--ink"), ring:true });
      sc.labels.push({ x:S.tt + dx, y:yt + S.ts * dx, text:"slope " + fx(S.ts, Md.sdp) + (tanOK() ? " ✓" : ""), dx:dx > 0 ? 12 : -12, dy:-14, align:dx > 0 ? "left" : "right", bg:true, color:css("--ink") });
      d += "Tangent tool at " + S.tt + " s with slope " + MV.plain(fx(S.ts, Md.sdp)) + (tanOK() ? ", matching the curve." : ".");
    }
    sc.describe = d;
    plot.draw(sc);
    L.canvas.setAttribute("aria-label", d);
  }
  plot.render = draw;
  MV.drag(plot, { axis:"xy", step:{ x:1, y:1 },
    handles:function(){
      if (S.mode !== "data" || busy || show3) return [];
      var Md = M();
      if (S.tool === "sec") return [{ id:"A", x:S.t1, y:Md.f(S.t1), label:"Secant point P at t = " + S.t1 + " s. Arrow keys move it by 1 s." }, { id:"B", x:S.t2, y:Md.f(S.t2), label:"Secant point Q at t = " + S.t2 + " s. Arrow keys move it by 1 s." }];
      var dx = tanDx(), yt = Md.f(S.tt);
      return [{ id:"T", x:S.tt, y:yt, label:"Tangent point at t = " + S.tt + " s. Arrow keys move it by 1 s; Shift + arrows turn the tangent." },
        { id:"H", x:S.tt + dx, y:yt + S.ts * dx, label:"Slope handle: slope " + MV.plain(fx(S.ts, Md.sdp)) + ". Up and down arrows turn the tangent." }];
    },
    key:function(id, e){
      var k = e.key, dir = (k === "ArrowRight" || k === "ArrowUp") ? 1 : (k === "ArrowLeft" || k === "ArrowDown") ? -1 : 0; if (!dir) return false;
      if (id === "H" || (id === "T" && e.shiftKey)) { setSlope(S.ts + dir * M().sstep * (id === "H" && e.shiftKey ? 10 : 1)); return true; }
      var step = e.shiftKey ? 5 : 1;
      if (id === "T") setT("T", S.tt + dir * step); else setT(id, (id === "A" ? S.t1 : S.t2) + dir * step);
      return true;
    },
    move:function(id, x, y){
      if (id === "H") { var dx = tanDx(); setSlope((y - M().f(S.tt)) / dx); return; }
      setT(id, Math.round(x));
    } });
  function setT(id, t){
    t = clamp(Math.round(t), 0, 60);
    if (id === "T") S.tt = t;
    else if (id === "A") { if (t === S.t2) t = t + (t > S.t1 ? 1 : -1); if (t < 0 || t > 60) return; S.t1 = t; }
    else { if (t === S.t1) t = t + (t > S.t2 ? 1 : -1); if (t < 0 || t > 60) return; S.t2 = t; }
    note = ""; save(); paintData();
  }
  function setSlope(v){ var st = M().sstep; S.ts = Math.round(v / st) * st; S.ts = +S.ts.toFixed(4); note = ""; save(); paintData(); }
  function paintData(){
    var Md = M(), rows = [];
    q(".rr-entt").innerHTML = TI + " = " + S.tt + " s"; q(".rr-entu").textContent = Md.unit;
    q(".rr-entry").hidden = S.tool !== "tan";
    if (show3) {
      rows.push(["Average rate, 0–20 s", "(0.900 − 0.400) ÷ 20 = <strong>0.025 mol/(L·s)</strong>"]);
      rows.push(["Average rate, 20–40 s", show3 >= 2 ? "(0.400 − 0.100) ÷ 20 = <strong>0.015 mol/(L·s)</strong>" : muted("…")]);
      rows.push(["Average rate, 40–60 s", show3 >= 3 ? "(0.100 − 0.000) ÷ 20 = <strong>0.005 mol/(L·s)</strong>" : muted("…")]);
    } else if (S.tool === "sec") {
      var a = Math.min(S.t1, S.t2), b = Math.max(S.t1, S.t2), ya = Md.f(a), yb = Md.f(b), dt = b - a, sl = (yb - ya) / dt;
      rows.push(["Secant", TI + " = " + a + " s to " + b + " s (Δ" + TI + " = " + dt + " s)"]);
      rows.push(["Secant slope", hideRate ? muted("…") : "(" + fx(yb, Md.dp) + " − " + fx(ya, Md.dp) + ") ÷ " + dt + " = " + sTxt(sl) + " " + Md.unit]);
      if (S.graph === "conc") rows.push(["Average rate, −Δ[A] ÷ Δ" + TI, hideRate ? muted("…") : "(" + fx(ya, 3) + " − " + fx(yb, 3) + ") ÷ " + dt + " = <strong>" + sTxt(-sl) + " mol/(L·s)</strong>"]);
      else rows.push(["Average rate, Δ<i>V</i> ÷ Δ" + TI, "(" + fx(yb, 1) + " − " + fx(ya, 1) + ") ÷ " + dt + " = <strong>" + sTxt(sl) + " mL/s</strong>"]);
    } else {
      var yt = Md.f(S.tt), ok = tanOK();
      rows.push(["Tangent point", TI + " = " + S.tt + " s, " + (S.graph === "conc" ? "[A] = " : "<i>V</i> = ") + fx(yt, Md.dp) + " " + Md.yu]);
      rows.push(["Tangent slope at " + TI, fx(S.ts, Md.sdp) + " " + Md.unit + " at " + S.tt + " s " + (ok ? '<strong class="rr-ok">✓ matches the curve</strong>' : muted("(turn it until it touches the curve at one point)"))]);
      rows.push(["Instantaneous rate", ok ? "<strong>" + fx(Math.abs(S.ts), Md.sdp) + " " + Md.unit + "</strong>" + (S.graph === "conc" ? " = −(tangent slope)" : "") : muted("set the tangent first")]);
    }
    q(".rr-read").innerHTML = MV.readoutHTML(rows);
    q(".rr-note").innerHTML = note;
    draw();
  }

  // ----- Experiment mode -----
  q(".rr-rxn").innerHTML = F("CaCO3(s) + 2HCl(aq) -> CaCl2(aq) + H2O(l) + CO2(g)");
  var exVol = null, exTime = null, exPh = null;
  function lastRun(){ return S.runs.length ? S.runs[S.runs.length - 1] : null; }
  function sameAsCur(r){ return r && String(r.c) === String(S.c) && r.size === S.size && String(r.T) === String(S.T); }
  function diffs(a, b){ var d = []; if (String(a.c) !== String(b.c)) d.push("acid concentration"); if (a.size !== b.size) d.push("chip size"); if (String(a.T) !== String(b.T)) d.push("temperature"); return d; }
  function ctlTxt(a, b){ var o = []; if (String(a.c) === String(b.c)) o.push("acid " + concTxt(a.c)); if (a.size === b.size) o.push(sizeTxt(a.size)); if (String(a.T) === String(b.T)) o.push(a.T + " °C"); return o.join(", ") || "none"; }
  function paintExp(){
    var lr = lastRun(), prev = S.runs.length > 1 ? S.runs[S.runs.length - 2] : null, cur = sameAsCur(lr) ? lr : null, rows = [];
    var shown = exTime != null ? { vol:exVol, time:"t = " + fx(exTime, 1) + " s" } : cur ? { vol:VOL, time:"t = " + tn(VOL / rateOf(cur.c, cur.size, cur.T)) + " s" } : { vol:0, time:"t = 0 s" };
    var rate = rateOf(S.c, S.size, S.T);
    q(".rr-bench").innerHTML = bench({ solid:S.size, vol:shown.vol, time:shown.time, rate:rate, ph:exPh, gas:"CO₂", cap:concTxt(S.c) + " HCl, " + S.T + " °C",
      note:cur && exTime == null ? "rate " + fx(rateOf(cur.c, cur.size, cur.T), 1) + " mL/s" : "" });
    q(".rr-bench").setAttribute("aria-label", "Flask of " + concTxt(S.c) + " hydrochloric acid at " + S.T + " °C with " + sizeTxt(S.size) + " of calcium carbonate, connected to a gas syringe. " + (cur && exTime == null ? "60 mL of CO₂ collected in " + tn(VOL / rateOf(cur.c, cur.size, cur.T)) + " s." : "Press Run to start."));
    rows.push(["Reaction", "CaCO₃ + HCl"]);
    if (!lr) rows.push(["Independent variable", muted("run twice to compare")]);
    else if (!prev) rows.push(["Independent variable", muted("first run: nothing to compare yet")]);
    else { var df = diffs(prev, lr); rows.push(["Independent variable", df.length === 0 ? "no change (a repeat run)" : df.length === 1 ? "<strong>" + df[0] + "</strong>" : '<strong class="rr-bad">more than one change</strong>']); rows.push(["Controlled variables", ctlTxt(prev, lr)]); }
    if (cur && exTime == null) { var r = rateOf(cur.c, cur.size, cur.T); rows.push(["Rate", "<strong>" + fx(r, 1) + " mL/s</strong>"]); rows.push(["Time to collect 60 mL", "<strong>" + tn(VOL / r) + " s</strong>"]); }
    else rows.push(["Rate", muted(exTime != null ? "running…" : "press Run")]);
    q(".rr-eread").innerHTML = MV.readoutHTML(rows);
    q(".rr-enote").innerHTML = note;
    var tb = S.runs.map(function(r, i){ var rt = rateOf(r.c, r.size, r.T); return [String(i + 1), concTxt(r.c), sizeTxt(r.size), r.T + " °C", fx(rt, 1), tn(VOL / rt)]; });
    q(".rr-runtbl").innerHTML = tb.length ? MV.tableHTML({ head:["Run", "Acid (mol/L)", "CaCO₃ (same mass)", "Temperature", "Rate (mL/s)", "Time for 60 mL (s)"], rows:tb.map(function(r){ r[1] = r[1].replace(" mol/L", ""); return r; }), hiRow:tb.length - 1, caption:"Results (model data)" })
      : '<p class="tiny muted">Results table: each run you make is added here (model data).</p>';
  }
  function runExp(cb){
    if (busy) return;
    var c = S.c, size = S.size, Tt = S.T, rate = rateOf(c, size, Tt), time = VOL / rate;
    lockAll(true); note = ""; exVol = 0; exTime = 0; exPh = 0; paintExp();
    exAnim = MV.tween({ dur:animDur(time), ease:LIN, step:function(t){ exVol = VOL * t; exTime = time * t; exPh = t * Math.max(2, time / 6); paintExp(); }, done:function(){
      exAnim = null; exVol = null; exTime = null; exPh = null;
      S.runs.push({ c:c, size:size, T:Tt }); if (S.runs.length > 12) S.runs.shift();
      lockAll(false); save(); paintExp(); if (cb) cb();
    } });
  }
  q(".rr-run").addEventListener("click", function(){ runExp(); });
  q(".rr-clear").addEventListener("click", function(){ if (busy) return; S.runs = []; note = "Table cleared. Start a new test."; save(); paintExp(); });

  // ----- Catalyst and nature mode -----
  var cxVol = null, cxTime = null, cxPh = null;
  function cinfo(){
    if (S.sub === "cat") { var k = byId(CATS, S.cat); return { r:k.r, solid:k.id, gas:"O₂", eq:F("2H2O2(aq) -> 2H2O(l) + O2(g)"), cap:"3% H₂O₂, 20 °C", k:k }; }
    var m = byId(METALS, S.metal); return { r:m.r, solid:m.id, gas:"H₂", eq:F("M(s) + 2HCl(aq) -> MCl2(aq) + H2(g)").replace(/M/g, '<i>M</i>'), cap:"1.00 mol/L HCl, 20 °C", m:m };
  }
  function paintCat(){
    var ci = cinfo(), done = S.cdone && S.cdone.sub === S.sub && S.cdone.id === (S.sub === "cat" ? S.cat : S.metal), rows = [];
    q(".rr-crxn").innerHTML = ci.eq + (S.sub === "nat" ? ' <span class="tiny muted">(<i>M</i> = Mg, Zn or Cu)</span>' : "");
    var time = ci.r > 0 ? VOL / ci.r : null;
    var shown = cxTime != null ? { vol:cxVol, time:"t = " + fx(cxTime, 1) + " s" } : done ? { vol:ci.r > 0 ? VOL : 0, time:ci.r > 0 ? "t = " + tn(time) + " s" : "t = 60 s" } : { vol:0, time:"t = 0 s" };
    q(".rr-cbench").innerHTML = bench({ solid:ci.solid, vol:shown.vol, time:shown.time, rate:ci.r, ph:cxPh, gas:ci.gas, cap:ci.cap, note:done ? (ci.r > 0 ? "rate " + fx(ci.r, 1) + " mL/s" : "no gas: no reaction") : "" });
    q(".rr-cbench").setAttribute("aria-label", "Flask of " + ci.cap + " with " + (S.sub === "cat" ? byId(CATS, S.cat).t : MV.plain(byId(METALS, S.metal).nm) + " strip") + ", connected to a gas syringe. " + (done ? (ci.r > 0 ? "60 mL of gas in " + tn(time) + " s." : "No gas forms.") : "Press Run to start."));
    if (S.sub === "cat") {
      var k = ci.k;
      rows.push(["Reaction", "decomposition of 3% H₂O₂"]);
      rows.push(["Catalyst", k.t]);
      if (k.m != null) rows.push(["Catalyst mass (model data)", fx(k.m, k.md) + " g before" + (done ? "; <strong>" + fx(k.m, k.md) + " g after: unchanged</strong>" : "; run to weigh it after")]);
    } else { rows.push(["Reaction", ci.m.nm + " + hydrochloric acid"]); rows.push(["Metal", ci.m.nm + " strip, same size"]); }
    rows.push(["Rate of " + ci.gas, done ? "<strong>" + (ci.r > 0 ? fx(ci.r, 1) + " mL/s" : "0 (no reaction)") + "</strong>" : muted(cxTime != null ? "running…" : "press Run")]);
    if (done && ci.r > 0) rows.push(["Time to collect 60 mL", "<strong>" + tn(time) + " s</strong>"]);
    q(".rr-cread").innerHTML = MV.readoutHTML(rows);
    q(".rr-cnote").innerHTML = done ? (S.sub === "cat" ? (S.cat === "none" ? "Without a catalyst, H₂O₂ breaks down very slowly." : "The catalyst sped up the reaction and is still there, unchanged. The products are the same: water and oxygen.") : (S.metal === "Cu" ? "Copper doesn’t react with dilute HCl: no bubbles." : "Different metals react at different rates: the nature of the reactants matters.")) : "";
  }
  function runCat(){
    if (busy) return;
    var ci = cinfo(), time = ci.r > 0 ? VOL / ci.r : 60, id = S.sub === "cat" ? S.cat : S.metal;
    lockAll(true); S.cdone = null; cxVol = 0; cxTime = 0; cxPh = 0; paintCat();
    cxAnim = MV.tween({ dur:ci.r > 0 ? animDur(time) : 1500, ease:LIN, step:function(t){ cxVol = ci.r > 0 ? VOL * t : 0; cxTime = time * t; cxPh = t * Math.max(2, time / 6); paintCat(); }, done:function(){
      cxAnim = null; cxVol = null; cxTime = null; cxPh = null; S.cdone = { sub:S.sub, id:id }; lockAll(false); save(); paintCat();
    } });
  }
  q(".rr-crun").addEventListener("click", runCat);

  function paint(){
    Array.prototype.forEach.call(host.querySelectorAll(".rr-v"), function(v){ v.hidden = v.dataset.v !== S.mode; });
    modeRG.set(S.mode); graphRG.set(S.graph); toolRG.set(S.tool);
    if (S.mode === "data") paintData();
    else if (S.mode === "exp") paintExp(); else paintCat();
  }
  paint();

  // ----- predictions -----
  var hooks = {
    start:function(p){
      stopAll(); show3 = 0; hideRate = false; note = "";
      if (p.id === "p1" || p.id === "p2") { S.mode = "data"; S.graph = "conc"; S.tool = "sec"; S.t1 = 0; S.t2 = p.id === "p1" ? 1 : 20; if (p.id === "p1") hideRate = true; else show3 = 0.001; }
      else { S.mode = "exp"; S.c = "1"; S.size = "large"; S.T = "20"; S.runs = S.runs.filter(function(r){ return !(String(r.c) === "1" && r.size === "large" && String(r.T) === "20"); }); S.runs.push({ c:"1", size:"large", T:"20" }); }
      cRG.set(S.c); sRG.set(S.size); tRG.set(S.T); api.save(); paint();
    },
    run:function(p, done){
      if (p.id === "p1") {
        lockAll(true);
        tw = MV.tween({ dur:1400, step:function(t){ S.t2 = Math.max(1, Math.round(20 * t)); paintData(); }, done:function(){ tw = null; S.t2 = 20; hideRate = false; note = "The secant’s slope is −0.025, but the rate is reported as <strong>+0.025 mol/(L·s)</strong>."; lockAll(false); api.save(); paintData(); MV.wait(200, done); } });
        return;
      }
      if (p.id === "p2") {
        lockAll(true);
        tw = MV.tween({ dur:2700, ease:LIN, step:function(t){ show3 = Math.max(0.001, 3 * t); paintData(); }, done:function(){ tw = null; show3 = 3; note = "Secants: 0.025, then 0.015, then 0.005 mol/(L·s). The rate falls as A is used up."; lockAll(false); paintData(); MV.wait(200, done); } });
        return;
      }
      if (p.id === "p3") { S.size = "powder"; sRG.set("powder"); }
      else { S.T = "30"; tRG.set("30"); }
      runExp(function(){
        note = p.id === "p3" ? "Powder: <strong>16 mL/s</strong>; 60 mL in 3.75 s. The final volume is unchanged: same mass of CaCO₃, same gas." : "30 °C: the rate doubles to <strong>4.0 mL/s</strong>, so 60 mL takes 15 s.";
        paintExp(); MV.wait(200, done);
      });
    }
  };

  // ----- challenges -----
  function parseEntry(){ var s = String(S.entry || "").replace(/mol.*$|m?l\/s.*$/i, "").trim(); var v = MV.parseNum(s); return v && v.length === 1 ? v[0] : null; }
  function chal(id){
    if (id === "tc1") {
      if (S.mode !== "data") return { ok:false, msg:"Switch to Data mode." };
      if (S.graph !== "conc") return { ok:false, msg:"Use the concentration graph." };
      var v = parseEntry(), tok = S.tool === "tan" && S.tt === 20 && tanOK();
      if (v != null && near(v, 0.025, 0.001)) return { ok:false, msg:"That’s the average from 0 to 20 s (a secant). " + M2 };
      if (v != null && near(v, -0.02, 0.001)) return { ok:false, msg:"Report rates as positive. " + M1 };
      if (!tok) {
        if (v != null && near(v, 0.02, 0.001)) return { ok:false, msg:"Set the tangent: [A] ÷ " + TI + " isn’t a slope. " + M2 };
        if (S.tool !== "tan") return { ok:false, msg:"Choose the Tangent tool and set a tangent at " + TI + " = 20 s." };
        if (S.tt !== 20) return { ok:false, msg:"Move the tangent point to " + TI + " = 20 s." };
        return { ok:false, msg:"Turn the tangent until it touches the curve only at 20 s (the readout shows ✓)." };
      }
      if (v == null) return { ok:false, msg:"Now enter the instantaneous rate, as a positive number." };
      if (!near(v, 0.02, 0.001)) return { ok:false, msg:"Read the rate from your tangent’s slope, reported as a positive number." };
      return { ok:true };
    }
    if (S.mode !== "exp") return { ok:false, msg:"Switch to Experiment mode." };
    if (id === "tc2") {
      var R = S.runs;
      if (!R.length) return { ok:false, msg:"Press Run to start: compare at least three temperatures." };
      if (R.length === 1) return { ok:false, msg:"Only one run: compare at least three temperatures." };
      var multi = R.some(function(r){ return String(r.c) !== String(R[0].c) || r.size !== R[0].size; });
      if (multi) return { ok:false, msg:"More than one change: you can’t tell which caused the difference. " + M5 + " (Clear the table to start a new test.)" };
      var temps = {}; R.forEach(function(r){ temps[r.T] = 1; });
      if (Object.keys(temps).length < 3) return { ok:false, msg:"Compare at least three temperatures." };
      if (S.iv !== "temp") return { ok:false, msg:S.iv ? "The independent variable is the one you change on purpose: temperature." : "Choose the independent variable." };
      if (S.dv !== "time") return { ok:false, msg:S.dv ? "The dependent variable is what you measure: the time to collect 60 mL (or the rate)." : "Choose the dependent variable." };
      if (S.ctl.temp) return { ok:false, msg:"Temperature can’t be a control: it’s the variable you change." };
      if (!S.ctl.conc || !S.ctl.size) return { ok:false, msg:"Name the two controlled variables: acid concentration and chip size." };
      return { ok:true };
    }
    var dn = (S.c !== "1" ? 1 : 0) + (S.size !== "large" ? 1 : 0) + (S.T !== "20" ? 1 : 0), fac = rateOf(S.c, S.size, S.T) / BASE;
    if (dn === 1 && near(fac, 8, 1e-9)) return { ok:false, msg:"That’s ×8, but with one change. The challenge asks for two." };
    if (dn === 3 && near(fac, 8, 1e-9)) return { ok:false, msg:"Exactly two changes." };
    if (dn === 2 && near(fac, 4, 1e-9)) return { ok:false, msg:"That’s only 4 times as fast." };
    if (!near(fac, 8, 1e-9)) return { ok:false, msg:"That’s ×" + tn(fac) + " (" + fx(fac * BASE, 1) + " mL/s). You need ×8: 16.0 mL/s." };
    if (dn !== 2) return { ok:false, msg:"Exactly two changes." };
    if (!sameAsCur(lastRun())) return { ok:false, msg:"Press Run to test these settings." };
    return { ok:true };
  }
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Read the rate ----------
// @component speciesGauges — one balanced equation, a slider for the last product's rate, and a bar gauge per species.
var EQS = {
  nh3:{ t:"N₂ + 3H₂ → 2NH₃", f:"N2(g) + 3H2(g) -> 2NH3(g)", sp:[["N₂", "used", 1], ["H₂", "used", 3], ["NH₃", "formed", 2]], min:0.02, max:0.20, step:0.01, v:0.10 },
  h2o2:{ t:"2H₂O₂ → 2H₂O + O₂", f:"2H2O2(aq) -> 2H2O(l) + O2(g)", sp:[["H₂O₂", "used", 2], ["H₂O", "formed", 2], ["O₂", "formed", 1]], min:0.01, max:0.10, step:0.01, v:0.05 }
};
var UWRONG = { u1:"A syringe measures a volume (mL).", u2:"A balance measures a mass (g).", u3:"A spectrometer measures a concentration (mol/L).", u4:"A stopwatch gives only a time (s)." };
function multTxt(k){ return k === 0.5 ? "½ ×" : k === 1.5 ? "1½ ×" : tn(k) + " ×"; }
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  if (!EQS[S.eq]) S.eq = "nh3"; S.v = S.v || {}; S.u = S.u || {}; S.m = S.m || {};
  Object.keys(EQS).forEach(function(k){ var e = EQS[k], v = S.v[k]; S.v[k] = typeof v === "number" ? clamp(v, e.min, e.max) : e.v; });
  host.innerHTML =
    '<section class="rr-st"><h3 class="rr-h3">' + s1.title + "</h3><p>" + s1.intro + '</p><div class="rr-eqp"></div><p class="rr-eqbig" aria-live="polite"></p><div class="rr-s1sl"></div><div class="rr-gauges" aria-live="polite"></div>' +
    '<details class="alg"><summary>Check it with data</summary><p>' + s1.data + "</p></details></section>" +
    '<section class="rr-st"><h3 class="rr-h3">' + s2.title + "</h3><p>" + s2.intro + '</p><div class="rr-units"></div><details class="alg"><summary>Check it with data</summary><p>' + s2.data + "</p></details></section>" +
    '<section class="rr-st"><h3 class="rr-h3">' + s3.title + "</h3><p>" + s3.intro + '</p><div class="rr-grid rr-mgrid"><div class="rr-gcol"><div class="plot-wrap"><canvas class="plot rr-mplot" role="img" aria-label="Mass of the flask against time (data): 150.00 g at 0 s, 149.56 g at 20 s, 149.12 g at 40 s. The points fall on a straight line."></canvas></div></div>' +
    '<div class="rr-ccol">' + MV.usesHTML(s3.uses) + '<div class="rr-mitems"></div></div></div><details class="alg"><summary>Check it with data</summary><p>' + s3.data + "</p></details></section>";
  function q(s){ return $(s, host); }
  // station 1
  var eqRG = radios(q(".rr-eqp"), { label:"Equation card", cls:"chips", options:Object.keys(EQS).map(function(k){ return { id:k, t:EQS[k].t }; }), value:S.eq, onChange:function(v){ S.eq = v; api.save(); buildSl(); paintG(); } });
  function buildSl(){
    var e = EQS[S.eq], last = e.sp[2], old = q(".rr-s1sl"), nw = document.createElement("div"); nw.className = "rr-s1sl"; old.parentNode.replaceChild(nw, old);
    MV.sliders(nw, [{ id:"rr29v", label:"Rate of " + last[0] + " formation", min:e.min, max:e.max, step:e.step, value:S.v[S.eq], fmt:function(v){ return fx(v, 2) + " mol/(L·s)"; } }], function(id, v){ S.v[S.eq] = Math.round(v * 100) / 100; api.save(); paintG(); });
  }
  function paintG(){
    var e = EQS[S.eq], v = S.v[S.eq], cl = e.sp[2][2], mx = e.max * Math.max.apply(null, e.sp.map(function(s){ return s[2]; })) / cl;
    q(".rr-eqbig").innerHTML = F(e.f);
    q(".rr-gauges").innerHTML = e.sp.map(function(s){
      var k = s[2] / cl, r = v * k, w = clamp(r / mx * 100, 0, 100);
      return '<div class="rr-g"><span class="rr-gl">' + s[0] + " " + s[1] + '</span><span class="rr-gbar" aria-hidden="true"><span class="rr-gfill' + (s[1] === "used" ? " used" : "") + '" style="width:' + r1(w) + '%"></span></span><span class="rr-gv"><strong>' + fx(r, 3) + "</strong> mol/(L·s) " + muted("(" + multTxt(k) + ")") + "</span></div>";
    }).join("") + '<p class="tiny muted rr-gnote">Rate ÷ coefficient is the same for every species: ' + fx(v / cl, 3) + " mol/(L·s).</p>";
  }
  buildSl(); paintG();
  // station 2
  function paintU(){
    var box = q(".rr-units");
    MV.keepFocus(box, function(){
      box.innerHTML = s2.rows.map(function(r){
        var pick = S.u[r.id], ok = pick != null && pick === MV.ans(r);
        return '<div class="rr-urow" data-u="' + r.id + '"><p class="rr-ut">' + r.t + '</p><span class="rg chips" role="radiogroup" aria-label="' + esc(MV.plain(r.t)) + ': unit">' + s2.units.map(function(u){ var on = pick === u.id; return '<button type="button" role="radio" aria-checked="' + on + '" data-uu="' + u.id + '" data-k="u' + r.id + u.id + '"' + (ok ? " disabled" : "") + ">" + u.t + "</button>"; }).join("") + "</span>" +
          (pick == null ? "" : MV.fbHTML(ok ? "good" : "bad", ok ? "<strong>✓ " + byId(s2.units, pick).t + ".</strong> " + r.why : "<strong>✗ Not quite.</strong> " + UWRONG[r.id] + " Its rate is that ÷ time. Try another unit.")) + "</div>";
      }).join("");
    });
  }
  q(".rr-units").addEventListener("click", function(e){ var b = e.target.closest("[data-uu]"); if (!b || b.disabled) return; var row = b.closest("[data-u]"); S.u[row.dataset.u] = b.dataset.uu; api.save(); paintU(); MV.focusFb(row); });
  paintU();
  // station 3: graph + two number entries
  var mp = new MV.Plot(q(".rr-mplot"), { xmin:-4, xmax:64, ymin:148.95, ymax:150.12 });
  var MP = [[0, 150.00], [20, 149.56], [40, 149.12]];
  mp.render = function(){
    mp.draw({ view:{ xmin:-4, xmax:64, ymin:148.95, ymax:150.12 }, xTicks:{ step:10 }, yTicks:{ step:0.2, fmt:function(y){ return y.toFixed(1); } }, xLabel:"t (s)", yLabel:"mass (g)",
      segments:[{ x1:0, y1:150, x2:40, y2:149.12, color:css("--pen"), width:3 }],
      points:MP.map(function(p){ return { x:p[0], y:p[1], r:5, color:css("--pen"), label:p[1].toFixed(2) + " g" }; }),
      describe:"Mass of the flask against time (data): 150.00 g at 0 s, 149.56 g at 20 s, 149.12 g at 40 s. The points fall on a straight line." });
  };
  mp.render();
  var msgs = {};
  function mst(id){ return S.m[id] || (S.m[id] = { val:"", solved:false }); }
  function paintM(){
    var box = q(".rr-mitems");
    MV.keepFocus(box, function(){
      box.innerHTML = s3.items.map(function(it){
        var x = mst(it.id), h = '<div class="rr-mi" data-mi="' + it.id + '"><div class="numrow"><label for="rr-' + it.id + '">' + it.prompt + '</label><input class="numin" id="rr-' + it.id + '" data-min="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span>' + it.unit + "</span></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-mchk="' + it.id + '" data-k="mchk' + it.id + '">Check</button></div>';
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong>");
        else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
        return h + "</div>";
      }).join("");
    });
  }
  q(".rr-mitems").addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.min; if (!id) return; mst(id).val = e.target.value; api.save(); });
  q(".rr-mitems").addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.min) { var b = q('[data-mchk="' + e.target.dataset.min + '"]'); if (b) b.click(); } });
  q(".rr-mitems").addEventListener("click", function(e){
    var b = e.target.closest("[data-mchk]"); if (!b) return;
    var it = byId(s3.items, b.dataset.mchk), x = mst(it.id), v = MV.parseNum(String(x.val).replace(/(mol\/s|g\/s)\s*$/i, "").trim()), ans = MV.ans(it);
    if (!v || v.length !== 1) msgs[it.id] = "Enter one number (for powers of ten, type 5.0e-4 or 5.0×10^-4).";
    else if (Math.abs(v[0] - ans) <= Math.abs(ans) * 0.02 + 1e-12) { x.solved = true; msgs[it.id] = null; }
    else { var w = (it.wrong || []).filter(function(z){ return Math.abs(v[0] - z.match) <= Math.abs(z.match) * 0.02 + 1e-12; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : it.fb) + " Try again."; }
    api.save(); paintM(); MV.focusFb(q('[data-mi="' + it.id + '"]'));
  });
  paintM();
}

// ---------- Performance task: Hit 15 seconds ----------
var task = (function(){
  var S = null, api = null, rg = {};
  function read(){ return { c:byId(CONCS, String(S && S.c)) ? String(S.c) : "1", size:S && SIZEF[S.size] ? S.size : "large", T:byId(TEMPS, String(S && S.T)) ? String(S.T) : "20" }; }
  function paint(){
    var d = read(), r = rateOf(d.c, d.size, d.T), time = VOL / r, sv = $("#rr-tksvg");
    sv.innerHTML = bench({ solid:d.size, vol:VOL, time:"t = " + tn(time) + " s", rate:r, ph:0.35, gas:"CO₂", cap:concTxt(d.c) + " HCl, " + d.T + " °C", note:"predicted: rate " + fx(r, 1) + " mL/s" });
    sv.setAttribute("aria-label", "Preview: " + setTxt(d) + ". Predicted rate " + fx(r, 1) + " mL/s, so 60 mL takes " + tn(time) + " s.");
    var f = { c:+d.c, s:SIZEF[d.size], t:Math.pow(2, (+d.T - 20) / 10) };
    $("#rr-tkread").innerHTML = MV.readoutHTML([["Rate", "2.0 × " + tn(f.c) + " × " + f.s + " × " + tn(f.t) + " = <strong>" + fx(r, 1) + " mL/s</strong>"], ["Predicted time for 60 mL", "60 ÷ " + fx(r, 1) + " = <strong>" + tn(time) + " s</strong>"]]);
  }
  function txt(k){ var p = k.split("|"); return setTxt({ c:p[0], size:p[1], T:p[2] }); }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; var d = read(); S.c = d.c; S.size = d.size; S.T = d.T;
      inp.innerHTML = '<div class="rr-tkc"></div><div class="rr-tks"></div><div class="rr-tkt"></div>';
      function on(k){ return function(v){ S[k] = v; api.save(); paint(); api.update(); }; }
      rg.c = radios($(".rr-tkc", inp), { label:"Acid", aria:"Acid concentration", cls:"chips", options:CONCS, value:S.c, onChange:on("c") });
      rg.s = radios($(".rr-tks", inp), { label:"CaCO₃", aria:"Chip size", cls:"chips", options:SIZES, value:S.size, onChange:on("size") });
      rg.t = radios($(".rr-tkt", inp), { label:"Temperature", cls:"chips", options:TEMPS, value:S.T, onChange:on("T") });
      pv.innerHTML = '<div class="rr-svgbox"><svg class="rr-bench" id="rr-tksvg" viewBox="0 0 360 226" role="img" aria-label=""></svg></div><dl class="read" id="rr-tkread" aria-live="polite"></dl><p class="tiny muted">Model data.</p>';
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [near(rateOf(d.c, d.size, d.T), 4.0, 1e-9), +d.T <= 30, d.size !== "powder", +d.c <= 1.00]; },
    tips:function(d, res){
      var tp = MV.C.task.tips, out = [];
      function add(i){ if (out.indexOf(tp[i]) < 0) out.push(tp[i]); }
      if (!res[0]) { add(0); add(1); add(2); }
      if (!res[1]) add(3);
      if (!res[2] || !res[3]) add(2);
      return out;
    },
    key:function(d){ return d.c + "|" + d.size + "|" + d.T; }, label:function(k){ return txt(k); }, text:function(k){ return txt(k); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task
});
})();
