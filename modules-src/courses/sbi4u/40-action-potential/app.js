// SBI4U 40 Action Potential: hero (trace + membrane strip storyboard), Neuron membrane lab (S4 membrane simulator: single spike,
// stimulus train, propagation), How a signal codes strength (three stations), Label the trace (N8 tap-on-graph),
// What if…? (chips with an investigation follow-up), "Design a fast, thin pathway" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "ap-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function mV(v){ v = Math.round(v); return (v > 0 ? "+" : "") + MV.num(v) + " mV"; }
function msT(v){ return MV.num(Math.round(v * 10) / 10) + " ms"; }

// ---------- @component radioGroup (copied from SBI4U 04 / 03 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- model (plan: Explore model values, deterministic; linear interpolation between listed times) ----------
var SPIKE = [[0, -70], [0.5, -55], [1, 35], [1.5, -20], [2, -70], [2.5, -80], [3, -75], [4, -70], [5, -70]];
// Plan error: the K⁺-blocked trace lists −20 mV at 1.5 ms, then +10 mV at 2.0 ms (a rise inside a "slow fall").
// Smallest faithful fix: +20 mV at 1.5 ms, so the fall from the +35 mV peak is steady and slow.
var KBLK = [[0, -70], [0.5, -55], [1, 35], [1.5, 20], [2, 10], [3, -30], [4, -60], [5, -70]];
var ST_T = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4];
var NA_ST = ["closed", "open", "inactivated", "inactivated", "closed (reset)", "closed", "closed", "closed"];
var K_ST = ["closed", "closed", "open", "open", "open", "open", "closing", "closed"];
var PHASE = ["Rest", "Threshold", "Peak", "Repolarization", "Repolarization", "Hyperpolarization", "Returning to rest", "Rest"];
var REFR = ["", "", "abs", "abs", "rel", "rel", "rel", ""];
var TRAIN = { 0:0, 5:0, 10:0, 15:2, 20:3, 25:4, 30:5 };
var SPEED = { u:{ thin:1, thick:10 }, m:{ thin:50, thick:100 } };
var THR = 15;
function interp(pts, t){
  if (t <= pts[0][0]) return pts[0][1];
  for (var i = 1; i < pts.length; i++) if (t <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]));
  return pts[pts.length - 1][1];
}
function subPts(s){ return s > 0 ? [[0, -70], [0.5, -70 + s], [1.5, -70], [5, -70]] : [[0, -70], [5, -70]]; }
function fires(c){ return c.stim >= THR && !c.blockNa; }
function tracePts(c){ return !fires(c) ? subPts(c.stim) : c.blockK ? KBLK : SPIKE; }
function vAt(c, t){ return t < 0 ? -70 : interp(tracePts(c), t); }
function idxAt(t){ var k = 0; for (var i = 0; i < ST_T.length; i++) if (t >= ST_T[i] - 1e-9) k = i; return k; }
function stateAt(c, t){
  if (!fires(c)) {
    var loc = c.stim > 0 && t > 1e-9 && t < 1.5 - 1e-9;
    return { na:c.blockNa ? "blocked" : "closed", k:c.blockK ? "blocked" : "closed", refr:"",
      phase:loc ? (c.blockNa && c.stim >= THR ? "Local depolarization (Na⁺ channels blocked)" : "Local depolarization (below threshold)") : "Rest" };
  }
  var i = idxAt(t), s = { na:NA_ST[i], k:c.blockK ? "blocked" : K_ST[i], phase:PHASE[i], refr:REFR[i] };
  if (t > 1e-9 && t < 0.5 - 1e-9) s.phase = "Rising to threshold";
  if (c.blockK && t > 1 + 1e-9 && t < 5 - 1e-9) { s.phase = "Slow repolarization"; s.refr = t < 2 - 1e-9 ? "abs" : "rel"; s.na = t < 2 - 1e-9 ? "inactivated" : "closed (reset)"; }
  return s;
}
function trainPts(stim){
  var n = TRAIN[stim] || 0;
  if (!n) return stim > 0 ? [[0, -70], [0.5, -70 + stim], [20, -70 + stim]] : [[0, -70], [20, -70]];
  var pts = [];
  for (var i = 0; i < n; i++) { var s0 = i * 20 / n; SPIKE.forEach(function(p){ if (p[0] <= 4) pts.push([s0 + p[0], p[1]]); }); }
  if (pts[pts.length - 1][0] < 20) pts.push([20, -70]);
  return pts;
}
function speedOf(my, dia, dmg){ var v = SPEED[my][dia]; return my === "m" && dmg ? v / 2 : v; }
function failsOf(my, dist, dmg){ return my === "m" && dmg && dist >= 0.5 - 1e-9; }
function refrText(r){ return r === "abs" ? "Absolute: no new action potential possible" : r === "rel" ? "Relative: only a stronger-than-usual stimulus can fire" : "None"; }

// ---------- @component S4 membraneSim — axon membrane strip (course plan S4): outside above, inside below; a voltage-gated
// Na⁺ channel (teal), a voltage-gated K⁺ channel (violet) and the Na⁺/K⁺ pump with an orange ATP badge. Channel icons show
// closed / open / inactivated (ball plug + lock) / blocked (drug token). Ion dots sit by concentration; open channels stream
// dots (Na⁺ in, K⁺ out) by phase ph (0–1). stripSVG(o) returns markup for a 520 × 190 box. ----------
var STRIP = (function(){
  var r = MV.bio.rng("axon-membrane"), out = [], inn = [];
  function free(x){ return Math.abs(x - 150) > 34 && Math.abs(x - 290) > 34 && Math.abs(x - 420) > 40; }
  while (out.length < 15) { var x = r.range(20, 505); if (free(x)) out.push([x, r.range(42, 74), out.length < 12 ? "na" : "k"]); }
  while (inn.length < 15) { var y = r.range(20, 505); if (free(y)) inn.push([y, r.range(118, 178), inn.length < 12 ? "k" : "na"]); }
  return { out:out, inn:inn };
})();
function dot(x, y, kind){ return sv("circle", { cx:x, cy:y, r:5, "class":kind === "na" ? "ap-dna" : "ap-dk" }); }
function channelSVG(x, kind, st){
  var c = kind === "na" ? "ap-chna" : "ap-chk", h = "";
  h += sv("rect", { x:x - 9, y:82, width:18, height:26, "class":"ap-pore" });
  h += sv("rect", { x:x - 24, y:70, width:16, height:50, rx:6, "class":"ap-ch " + c }) + sv("rect", { x:x + 8, y:70, width:16, height:50, rx:6, "class":"ap-ch " + c });
  if (st === "closed" || st === "blocked") h += sv("line", { x1:x - 9, y1:74, x2:x + 9, y2:74, "class":"ap-gate " + c });
  else h += sv("line", { x1:x - 9, y1:74, x2:x - 17, y2:58, "class":"ap-gate " + c });
  if (st === "inactivated") {
    h += sv("circle", { cx:x, cy:114, r:7, "class":"ap-ball " + c });
    h += sv("rect", { x:x + 10, y:122, width:10, height:8, rx:1.5, "class":"ap-lock" }) + sv("path", { d:"M" + (x + 12) + " 122 v-3 a3 3 0 0 1 6 0 v3", "class":"ap-lockb" });
  }
  if (st === "blocked") h += sv("circle", { cx:x, cy:64, r:8, "class":"ap-drug" }) + txt(x, 67.5, "×", "ap-drugt", "middle");
  return h;
}
function stripSVG(o){
  var h = "";
  h += txt(8, 16, "outside", "ap-sub") + txt(8, 186, "inside", "ap-sub");
  h += sv("rect", { x:0, y:82, width:520, height:26, "class":"ap-mem" }) + sv("line", { x1:0, y1:82, x2:520, y2:82, "class":"ap-meml" }) + sv("line", { x1:0, y1:108, x2:520, y2:108, "class":"ap-meml" });
  STRIP.out.forEach(function(d){ h += dot(d[0], d[1], d[2]); });
  STRIP.inn.forEach(function(d){ h += dot(d[0], d[1], d[2]); });
  h += channelSVG(150, "na", o.na) + channelSVG(290, "k", o.k);
  // pump: ATP badge in orange; in the hero's last step it glows and shows its exchange
  h += sv("rect", { x:400, y:72, width:40, height:46, rx:12, "class":"ap-pump" + (o.pump ? " on" : "") }) + txt(420, 99, "pump", "ap-sub", "middle");
  h += sv("rect", { x:432, y:112, width:34, height:16, rx:8, "class":"ap-atp" }) + txt(449, 123.5, "ATP", "ap-atpt", "middle");
  if (o.pump) h += txt(420, 60, "3 Na⁺ out", "ap-sub", "middle") + txt(420, 146, "2 K⁺ in", "ap-sub", "middle");
  var ph = o.ph || 0;
  if (o.flowNa) for (var i = 0; i < 3; i++) { var u = (ph + i / 3) % 1; h += sv("circle", { cx:150, cy:f1(52 + u * 86), r:5, "class":"ap-dna", opacity:f1(Math.min(1, Math.min(u, 1 - u) * 6)) }); }
  if (o.flowK) for (var j = 0; j < 3; j++) { var w = (ph + j / 3) % 1; h += sv("circle", { cx:290, cy:f1(138 - w * 86), r:5, "class":"ap-dk", opacity:f1(Math.min(1, Math.min(w, 1 - w) * 6)) }); }
  h += txt(150, 34, "Na⁺ channel", "ap-lab", "middle") + txt(150, 48, o.na, "ap-sub", "middle");
  h += txt(290, 34, "K⁺ channel", "ap-lab", "middle") + txt(290, 48, o.k, "ap-sub", "middle");
  if (o.flowNa) h += txt(176, 150, "Na⁺ in ↓", "ap-flna");
  if (o.flowK) h += txt(316, 70, "K⁺ out ↑", "ap-flk");
  return h;
}
function flowing(st){ return { na:st.na === "open", k:st.k === "open" || st.k === "closing" }; }
function chipsHTML(st){
  return '<span class="ap-chip"><i class="bio-sw" style="background:var(--bio-nadh)"></i> Na⁺: ' + st.na + '</span><span class="ap-chip"><i class="bio-sw" style="background:var(--bio-e)"></i> K⁺: ' + st.k + "</span>";
}

// ---------- axon drawing (propagation, Part 3 station 3, task preview): a horizontal bar, myelin segments in --ink-2 with
// node gaps; a --hi pulse that slides (unmyelinated) or hops node to node (myelinated). axonSVG(o) -> 520 × 96 markup ----------
var AX0 = 24, AXW = 470, SEG = 47;
function axonSVG(o){
  var len = AXW * clamp(o.dist, 0.1, 1), x1 = AX0 + len, hh = o.dia === "thick" ? 20 : 10, cy = 50, h = "";
  h += sv("rect", { x:AX0, y:cy - hh / 2, width:f1(len), height:hh, rx:hh / 2, "class":"ap-axon" });
  if (o.my === "m") {
    for (var k = 0, x = AX0; x < x1 - 8; k++, x += SEG) {
      var w = Math.min(SEG - 7, x1 - x), dmg = o.dmgLevel && (o.dmgLevel >= 2 ? k % 3 !== 0 : k % 3 === 1);
      h += sv("rect", { x:f1(x + 3.5), y:cy - hh / 2 - 7, width:f1(w), height:hh + 14, rx:6, "class":dmg ? "ap-myd" : "ap-my" });
    }
  }
  h += txt(AX0, 92, "0 m", "ap-sub") + txt(f1(x1), 92, MV.num(o.dist) + " m", "ap-sub", "end");
  if (o.pulse != null && o.alpha > 0.02) {
    var px = AX0 + len * clamp(o.pulse, 0, 1);
    if (o.my === "m" && !o.slide) px = Math.min(x1, AX0 + Math.floor((px - AX0) / SEG + 1e-6) * SEG);
    h += sv("circle", { cx:f1(px), cy:cy, r:hh / 2 + 7, "class":"ap-pulse", opacity:f1(o.alpha) });
  }
  return h;
}
function pulseRun(o, frame, done){
  // o: {ms, fails}. Model ms → screen time (slow motion), capped; the pulse fades out at 55% when it fails.
  var real = clamp(500 + o.ms * 3.4, 500, 4000), stopAt = o.fails ? 0.55 : 1;
  return MV.tween({ dur:real * stopAt, ease:lin, step:function(t){
    var u = t * stopAt, a = o.fails ? clamp((stopAt - u) / 0.25, 0, 1) : 1;
    frame(u, a, u * o.ms, false);
  }, done:function(){ frame(stopAt, o.fails ? 0 : 1, o.ms * stopAt, true); if (done) done(); } });
}

// ---------- hero: the storyboard (rest → stimulus to threshold → Na⁺ in → K⁺ out → pump restores) ----------
var HC = { stim:30, blockNa:false, blockK:false };
function hX(t){ return 46 + (t + 1) / 6 * 456; }
function hY(v){ return 150 - (v + 92) / 136 * 138; }
function heroSVG(m, o){
  var h = "";
  h += sv("line", { x1:46, y1:f1(hY(-70)), x2:502, y2:f1(hY(-70)), "class":"ap-guide" }) + txt(42, f1(hY(-70) + 4), "−70", "ap-sub", "end");
  h += sv("line", { x1:46, y1:f1(hY(-55)), x2:502, y2:f1(hY(-55)), "class":"ap-guide" + (o.flash ? " ap-flash" : "") }) + txt(42, f1(hY(-55) - 2), "−55", "ap-sub", "end");
  h += txt(42, f1(hY(35) + 4), "+35", "ap-sub", "end") + txt(502, f1(hY(-55) - 5), "threshold", "ap-sub", "end") + txt(8, 14, "mV", "ap-sub");
  var pts = [[-1, -70], [0, -70]].concat(SPIKE.slice(1)).filter(function(p){ return p[0] <= m; });
  if (m > -1) pts.push([m, vAt(HC, m)]);
  if (pts.length > 1) h += sv("polyline", { points:pts.map(function(p){ return f1(hX(p[0])) + "," + f1(hY(p[1])); }).join(" "), "class":"ap-htr" });
  if (o.stim) h += sv("path", { d:"M" + f1(hX(0)) + " 160 V" + f1(hY(-66)) + " M" + f1(hX(0) - 5) + " " + f1(hY(-66) + 7) + " L" + f1(hX(0)) + " " + f1(hY(-66)) + " L" + f1(hX(0) + 5) + " " + f1(hY(-66) + 7), "class":"ap-stim" }) + txt(f1(hX(0) + 8), 158, "stimulus", "ap-sub");
  if (o.labels) {
    h += txt(f1(hX(0.72) - 6), f1(hY(10)), "Na⁺ in", "ap-flna", "end") + txt(f1(hX(1.4) + 8), f1(hY(5)), "K⁺ out", "ap-flk");
    h += txt(f1(hX(2.5)), f1(hY(-80) + 14), "−80: hyperpolarization", "ap-sub", "middle");
  }
  var st = stateAt(HC, Math.max(0, m)), fl = flowing(st);
  if (o.peak) { st = { na:"open", k:"open" }; fl = { na:true, k:true }; }
  h += '<g transform="translate(0,168)">' + stripSVG({ na:st.na, k:st.k, flowNa:fl.na, flowK:fl.k, ph:o.ph, pump:o.pump }) + "</g>";
  return '<svg viewBox="0 0 520 360" class="ap-svg" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function hero(f){
  var box = $("#ap-hero"); if (!box) return;
  var cap = f && f.cap;
  var CAPS = ["At rest: Na⁺ (teal) crowds outside, K⁺ (violet) inside, and the trace sits at −70 mV.",
    "A stimulus nudges the membrane up to the −55 mV threshold.",
    "The Na⁺ gates swing open: Na⁺ streams in and the trace shoots to +35 mV.",
    "The Na⁺ gates lock (inactivated) and the K⁺ gates open: K⁺ streams out, past −70 to −80 mV.",
    "The K⁺ gates close and the pump (ATP) restores the ions; the trace settles at −70 mV."];
  function setCap(s){ if (cap && cap.textContent !== s) cap.textContent = s; }
  if (MV.reduceMotion) {
    box.innerHTML = heroSVG(5, { labels:true, peak:true, ph:0.3 });
    setCap("The whole spike: Na⁺ in on the way up (depolarization), K⁺ out on the way down (repolarization), a dip to −80 mV (hyperpolarization), then rest. Channels shown open, as at their peak.");
    return;
  }
  var K = [[0, -1], [1.2, 0], [2.4, 0.5], [3.6, 1], [6, 2.5], [8.4, 5]], t0 = null;
  function mOf(t){ for (var i = 1; i < K.length; i++) if (t <= K[i][0]) return lerp(K[i - 1][1], K[i][1], (t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])); return 5; }
  function step(now){
    if (t0 === null) t0 = now;
    var t = (now - t0) / 1000, m = mOf(t), seg = t < 1.2 ? 0 : t < 2.4 ? 1 : t < 3.6 ? 2 : t < 6 ? 3 : 4;
    box.innerHTML = heroSVG(m, { stim:seg === 1, flash:seg === 1 && Math.floor(t * 4) % 2 === 0, ph:(t * 1.3) % 1, pump:seg === 4, labels:t > 8.4 });
    setCap(CAPS[seg]);
    if (t < 10) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---------- Explore: Neuron membrane lab (S4 membrane simulator + K21 trace with G11 guide lines) ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (S.mode == null) { S.mode = "single"; S.stim = 20; S.t = 1.5; S.blockNa = false; S.blockK = false; S.my = "m"; S.dia = "thin"; S.dist = 0.5; S.dmg = false; }
  var tcur = S.t, anim = null, pend = null, busy = false, ghost = null, hidePrev = false, pulse = null, watch = null, plot = null;
  var wide = window.innerWidth >= 560;
  host.innerHTML = '<div class="pg ap-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="ap-sp"><div class="plot-wrap"><canvas class="plot" id="ap-c" role="img"></canvas></div>' +
        '<p class="ap-chips" id="ap-chips"></p>' +
        '<details class="ap-chv" id="ap-chv"' + (wide ? " open" : "") + '><summary>Channel view</summary><div class="ap-strip" id="ap-strip" role="img"></div></details></div>' +
      '<div id="ap-pp"><p class="ap-watch" id="ap-watch"></p><div class="ap-axw" id="ap-axw" role="img"></div></div>' +
      '<p class="ap-cap" id="ap-cap"></p></div>' +
    '<div class="pg-ctrl"><div class="ap-row" id="ap-mode"></div>' +
      '<div id="ap-cs"><label class="slider"><span class="slider-top"><span>Stimulus strength</span><output id="ap-so" for="ap-stim"></output></span><input type="range" id="ap-stim" min="0" max="30" step="5"></label></div>' +
      '<div id="ap-c1"><label class="slider"><span class="slider-top"><span>Time</span><output id="ap-to" for="ap-t"></output></span><input type="range" id="ap-t" min="0" max="5" step="0.5"></label>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="ap-play" data-k="applay">Play</button></div>' +
        '<label class="ap-cb"><input type="checkbox" id="ap-bna"> Block voltage-gated Na⁺ channels</label>' +
        '<label class="ap-cb"><input type="checkbox" id="ap-bk"> Block voltage-gated K⁺ channels</label></div>' +
      '<div id="ap-c2"><p class="tiny muted">The stimulus is held for a 20 ms window.</p></div>' +
      '<div id="ap-c3"><div class="ap-row" id="ap-my"></div><div class="ap-row" id="ap-dia"></div>' +
        '<label class="slider"><span class="slider-top"><span>Distance</span><output id="ap-do" for="ap-dist"></output></span><input type="range" id="ap-dist" min="0.1" max="1" step="0.1"></label>' +
        '<label class="ap-cb"><input type="checkbox" id="ap-dmg"> Damage myelin</label>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="ap-send" data-k="apsend">Send an impulse</button></div></div>' +
      '<p class="tiny muted ap-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="ap-read"></dl></div></div>';
  var modeR = radios($("#ap-mode", host), { label:"Mode", options:[{ id:"single", t:"Single spike" }, { id:"train", t:"Stimulus train" }, { id:"prop", t:"Propagation" }], value:S.mode,
    onChange:function(v){ stop(); S.mode = v; ghost = null; hidePrev = false; pulse = null; changed(); } });
  var myR = radios($("#ap-my", host), { label:"Axon", options:[{ id:"u", t:"Unmyelinated" }, { id:"m", t:"Myelinated" }], value:S.my, onChange:function(v){ stop(); S.my = v; if (v === "u") S.dmg = false; pulse = null; changed(); } });
  var diaR = radios($("#ap-dia", host), { label:"Diameter", options:[{ id:"thin", t:"Thin" }, { id:"thick", t:"Thick" }], value:S.dia, onChange:function(v){ stop(); S.dia = v; pulse = null; changed(); } });
  var sIn = $("#ap-stim", host), tIn = $("#ap-t", host), dIn = $("#ap-dist", host), bNa = $("#ap-bna", host), bK = $("#ap-bk", host), dmgIn = $("#ap-dmg", host);
  sIn.addEventListener("input", function(){ stop(); S.stim = +sIn.value; ghost = null; hidePrev = false; changed(); });
  tIn.addEventListener("input", function(){ stop(); S.t = +tIn.value; tcur = S.t; hidePrev = false; changed(); });
  dIn.addEventListener("input", function(){ stop(); S.dist = Math.round(+dIn.value * 10) / 10; pulse = null; changed(); });
  bNa.addEventListener("change", function(){ stop(); S.blockNa = bNa.checked; ghost = null; changed(); });
  bK.addEventListener("change", function(){ stop(); S.blockK = bK.checked; ghost = null; changed(); });
  dmgIn.addEventListener("change", function(){ stop(); S.dmg = dmgIn.checked; pulse = null; changed(); });
  $("#ap-play", host).addEventListener("click", function(){ if (!busy) play(null); });
  $("#ap-send", host).addEventListener("click", function(){ if (!busy) send(null); });
  plot = new MV.Plot($("#ap-c", host), { xmin:-0.35, xmax:5.2, ymin:-100, ymax:55 });
  plot.render = drawPlot;

  function cfg(){ return { stim:S.stim, blockNa:S.blockNa, blockK:S.blockK }; }
  function stop(){ if (anim) { anim(); anim = null; } busy = false; pend = null; }
  function changed(){ api.save(); paintAll(); MV.changed(); }
  function sync(){
    modeR.set(S.mode); myR.set(S.my); diaR.set(S.dia);
    sIn.value = S.stim; tIn.value = S.t; dIn.value = S.dist; bNa.checked = !!S.blockNa; bK.checked = !!S.blockK;
    dmgIn.checked = !!S.dmg; dmgIn.disabled = S.my !== "m";
    $("#ap-so", host).textContent = S.stim + " mV"; $("#ap-to", host).textContent = MV.num(S.t, 1) + " ms"; $("#ap-do", host).textContent = MV.num(S.dist) + " m";
    $("#ap-sp", host).hidden = S.mode === "prop"; $("#ap-pp", host).hidden = S.mode !== "prop";
    $("#ap-cs", host).hidden = S.mode === "prop"; $("#ap-c1", host).hidden = S.mode !== "single"; $("#ap-c2", host).hidden = S.mode !== "train"; $("#ap-c3", host).hidden = S.mode !== "prop";
    $$("button, input", host).forEach(function(el){ if (el.closest(".pg-ctrl")) el.disabled = busy || (el === dmgIn && S.my !== "m"); });
  }
  function drawPlot(){
    if (S.mode === "prop" || !plot) return;
    var css = MV.css, pen = css("--pen"), ink2 = css("--ink-2"), c = cfg(), curves = [], pts, d, view, xT;
    if (S.mode === "train") {
      view = { xmin:-0.6, xmax:20.6, ymin:-100, ymax:55 }; xT = { step:5 };
      pts = trainPts(S.stim);
      curves.push({ pts:pts, color:pen, width:2.6 });
      var n = TRAIN[S.stim] || 0;
      d = "Stimulus train, " + S.stim + " mV held for 20 ms: " + (n ? n + " action potentials, each peaking at +35 mV." : "no action potentials; the membrane only rises to " + MV.plain(mV(-70 + S.stim)) + ".");
    } else {
      view = { xmin:-0.35, xmax:5.2, ymin:-100, ymax:55 }; xT = { step:1 };
      pts = tracePts(c);
      if (!hidePrev) curves.push({ pts:pts, color:ink2, width:1.4, dash:[3, 4] });
      if (ghost) curves.push({ pts:ghost, color:ink2, width:2.6, dash:[7, 5] });
      var shown = pts.filter(function(p){ return p[0] <= tcur + 1e-9; });
      if (tcur > 0) shown.push([tcur, vAt(c, tcur)]);
      if (shown.length > 1) curves.push({ pts:shown, color:pen, width:3 });
      d = "Membrane potential against time, 0 to 5 ms, stimulus " + S.stim + " mV" + (S.blockNa ? ", Na⁺ channels blocked" : "") + (S.blockK ? ", K⁺ channels blocked" : "") + ". " +
        (fires(c) ? "The trace rises from −70 mV through the −55 mV threshold to +35 mV, then " + (S.blockK ? "falls slowly back to −70 mV by 5 ms with no undershoot." : "falls to −80 mV and settles at −70 mV.") : "It rises only to " + MV.plain(mV(-70 + S.stim)) + " and fades back to −70 mV: no spike.") +
        " Cursor at " + MV.num(tcur, 1) + " ms, " + MV.plain(mV(vAt(c, tcur))) + "." + (ghost ? " The dashed trace is the earlier spike for comparison." : "");
    }
    var segs = [{ x1:view.xmin, y1:-55, x2:view.xmax, y2:-55, color:ink2, width:1.4, dash:[8, 6] }, { x1:view.xmin, y1:-70, x2:view.xmax, y2:-70, color:ink2, width:1.4, dash:[8, 6] }];
    var pts2 = [];
    if (S.mode === "single") { segs.push({ x1:tcur, y1:-100, x2:tcur, y2:55, color:css("--ink"), width:1, dash:[2, 3] }); pts2.push({ x:tcur, y:vAt(c, tcur), r:5.5, color:pen }); }
    var font = "600 12px " + css("--font-ui");
    plot.draw({ view:view, curves:curves, segments:segs, points:pts2, xTicks:xT, yTicks:{ step:20 },
      labels:[{ x:view.xmax, y:-55, text:"threshold −55", color:ink2, align:"right", dy:-11, font:font, bg:true }, { x:view.xmax, y:-70, text:"rest −70", color:ink2, align:"right", dy:13, font:font, bg:true }],
      xLabel:"time (ms)", yLabel:"membrane potential (mV)", describe:d });
  }
  function paintStrip(){
    if (S.mode === "prop") return;
    var c = cfg(), st, fl, ph = MV.reduceMotion ? 0.3 : (tcur * 2.2) % 1;
    if (S.mode === "train") { var n = TRAIN[S.stim] || 0; st = n ? { na:"open, then inactivated", k:"open, then closed" } : { na:"closed", k:"closed" }; fl = { na:false, k:false }; }
    else { st = stateAt(c, tcur); fl = flowing(st); }
    $("#ap-chips", host).innerHTML = chipsHTML(st);
    var sEl = $("#ap-strip", host);
    sEl.innerHTML = '<svg viewBox="0 0 520 190" class="ap-svg" aria-hidden="true" focusable="false">' + stripSVG({ na:st.na, k:st.k, flowNa:fl.na, flowK:fl.k, ph:ph }) + "</svg>";
    sEl.setAttribute("aria-label", "Membrane strip: voltage-gated Na⁺ channel " + st.na + "; K⁺ channel " + st.k + "." + (fl.na ? " Na⁺ ions stream in." : "") + (fl.k ? " K⁺ ions stream out." : "") + " Na⁺ is crowded outside and K⁺ inside; the pump carries an ATP badge.");
  }
  function paintAxon(){
    if (S.mode !== "prop") return;
    var p = pulse || { u:null, a:0 };
    var o = { my:S.my, dia:S.dia, dist:S.dist, dmgLevel:S.my === "m" && S.dmg ? 2 : 0, pulse:p.u, alpha:p.a };
    var el = $("#ap-axw", host);
    el.innerHTML = '<svg viewBox="0 0 520 100" class="ap-svg" aria-hidden="true" focusable="false">' + axonSVG(o) + "</svg>";
    el.setAttribute("aria-label", (S.my === "m" ? "Myelinated" : "Unmyelinated") + ", " + S.dia + " axon, " + MV.num(S.dist) + " m long" + (S.my === "m" && S.dmg ? ", with damaged myelin" : "") + ". " +
      (S.my === "m" ? "Myelin segments in grey with gaps (nodes) between them; the impulse jumps node to node." : "The impulse travels continuously along the bare axon."));
    $("#ap-watch", host).innerHTML = '<span class="ap-sw">Stopwatch</span> <strong>' + (watch == null ? "—" : watch === "fail" ? "fails to arrive" : msT(watch)) + "</strong>" + (watch == null ? ' <span class="tiny muted">Press Send an impulse.</span>' : "");
  }
  function paintRead(){
    var c = cfg(), rows = [];
    if (S.mode === "prop") {
      var v = speedOf(S.my, S.dia, S.dmg), ms = S.dist / v * 1000, fails = failsOf(S.my, S.dist, S.dmg);
      rows.push(["Axon", (S.my === "m" ? "Myelinated" : "Unmyelinated") + ", " + S.dia + (S.my === "m" && S.dmg ? " (myelin damaged)" : "")]);
      rows.push(["Speed · travel time", MV.num(v) + " m/s · " + (fails ? "fails to arrive" : MV.num(S.dist) + " m in " + msT(ms))]);
      rows.push(["Conduction", S.my === "m" ? (fails ? "Damaged myelin: the impulse slows and fades out" : "Saltatory: jumps node to node") : "Continuous along the bare axon"]);
    } else if (S.mode === "train") {
      var n = TRAIN[S.stim] || 0;
      rows.push(["Stimulus", S.stim + " mV, held for 20 ms"]);
      rows.push(["Threshold reached?", S.stim >= THR ? "Yes (stimulus " + S.stim + " mV ≥ 15 mV)" : "No (stimulus " + S.stim + " mV < 15 mV)"]);
      rows.push(["Action potentials in 20 ms", n + (n ? " (" + MV.num(n * 50) + " per second), each peaking at +35 mV" : "")]);
    } else {
      var st = stateAt(c, tcur);
      rows.push(["Time", MV.num(tcur, 1) + " ms"]);
      rows.push(["Membrane potential", mV(vAt(c, tcur))]);
      rows.push(["Na⁺ channels / K⁺ channels", st.na + " / " + st.k]);
      rows.push(["Phase", st.phase]);
      rows.push(["Threshold reached?", S.stim >= THR ? "Yes (stimulus " + S.stim + " mV ≥ 15 mV)" + (S.blockNa ? ", but the Na⁺ channels are blocked" : "") : "No (stimulus " + S.stim + " mV < 15 mV)"]);
      rows.push(["Refractory", refrText(st.refr)]);
      if (S.blockNa) rows.push(["Blocker", "No action potential: Na⁺ can’t rush in."]);
      else if (S.blockK && fires(c)) rows.push(["Blocker", "Repolarization is slow without the K⁺ exit."]);
    }
    $("#ap-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var c = cfg(), s = "";
    if (S.mode === "single") s = fires(c) ? "Above threshold: the channels run the full, fixed-size spike." : S.blockNa ? "Na⁺ channels blocked: only a local depolarization." : "Below threshold: a small bump that fades.";
    else if (S.mode === "train") s = "Stronger stimulus, more spikes in 20 ms. Every spike still peaks at +35 mV.";
    else s = S.my === "m" ? "Myelin insulates; the impulse jumps between nodes of Ranvier." : "No myelin: every patch of membrane must fire in turn.";
    $("#ap-cap", host).textContent = s;
  }
  function paintAll(){ sync(); drawPlot(); paintStrip(); paintAxon(); paintRead(); paintCap(); }
  function play(done){
    stop(); busy = true; pend = done || null; S.mode = "single";
    var t0 = tcur >= 5 - 1e-9 || done ? 0 : tcur;
    tcur = t0; paintAll();
    anim = MV.tween({ dur:3400 * (5 - t0) / 5, ease:lin, step:function(u){ tcur = lerp(t0, 5, u); drawPlot(); paintStrip(); paintRead(); }, done:function(){
      anim = null; busy = false; tcur = 5; S.t = 5; hidePrev = false; api.save(); paintAll(); MV.changed();
      var d = pend; pend = null; if (d) MV.wait(300, d);
    } });
  }
  function send(done){
    stop(); busy = true; pend = done || null; S.mode = "prop";
    var v = speedOf(S.my, S.dia, S.dmg), ms = S.dist / v * 1000, fails = failsOf(S.my, S.dist, S.dmg);
    pulse = { u:0, a:1 }; watch = 0; paintAll();
    anim = pulseRun({ ms:ms, fails:fails }, function(u, a, w, end){ pulse = { u:u, a:a }; watch = end && fails ? "fail" : w; paintAxon(); }, function(){
      anim = null; busy = false; api.save(); paintAll(); MV.changed();
      var d = pend; pend = null; if (d) MV.wait(300, d);
    });
  }
  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var c = cfg();
    if (id === "tc1") {
      if (S.mode !== "single") return { ok:false, msg:"Switch to Single spike mode first." };
      if (S.blockNa || S.blockK) return { ok:false, msg:"Turn the blockers off: this challenge is about a normal membrane." };
      if (S.stim === 15) return { ok:true };
      if (S.stim === 10) return { ok:false, msg:"−60 mV doesn’t reach threshold." };
      if (S.stim > 15) return { ok:false, msg:"That fires, but a weaker stimulus also does." };
      return { ok:false, msg:MV.plain(mV(-70 + S.stim)) + " doesn’t reach threshold." };
    }
    if (id === "tc2") {
      if (S.mode !== "single") return { ok:false, msg:"Switch to Single spike mode first." };
      if (!fires(c)) return { ok:false, msg:"There’s no spike at this setting. Use a stimulus that fires, with the Na⁺ channels unblocked." };
      if (S.blockK) return { ok:false, msg:"Turn the K⁺ blocker off to see a normal spike." };
      var t = S.t;
      if (Math.abs(t - 1.5) < 1e-6) return { ok:true };
      if (Math.abs(t - 1) < 1e-6) return { ok:false, msg:"That’s the peak; the fall starts after it." };
      if (Math.abs(t - 2) < 1e-6) return { ok:false, msg:"The Na⁺ channels have reset to closed by then." };
      if (Math.abs(t - 2.5) < 1e-6) return { ok:false, msg:"That’s the undershoot." };
      if (t < 1) return { ok:false, msg:"The membrane is still rising (or resting) here. Find the peak first." };
      return { ok:false, msg:"The Na⁺ channels have reset to closed by then. Look earlier." };
    }
    if (id === "tc3") {
      if (S.mode !== "prop") return { ok:false, msg:"Switch to Propagation mode first." };
      if (Math.abs(S.dist - 0.5) > 1e-6) return { ok:false, msg:"Set the distance to 0.5 m." };
      if (S.my === "m" && S.dmg) return { ok:false, msg:"Damaged myelin halves the speed, and at 0.5 m the impulse fails to arrive. Use healthy myelin." };
      if (S.my === "m" && S.dia === "thin") return { ok:true };
      if (S.my === "m") return { ok:false, msg:"That works (5 ms), but a thinner axon also works." };
      if (S.dia === "thick") return { ok:false, msg:"0.5 ÷ 10 = 50 ms: too slow." };
      return { ok:false, msg:"500 ms." };
    }
    return { ok:false };
  }
  paintAll();
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start; ghost = null; pulse = null; watch = null;
        S.mode = s.mode; S.blockNa = false; S.blockK = false;
        if (s.mode === "prop") { S.my = s.my; S.dia = s.dia; S.dist = s.dist; S.dmg = false; }
        else { S.stim = s.stim; S.t = s.t; tcur = s.t; hidePrev = s.t === 0; }
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        var to = p.to || {};
        if (p.start.mode === "prop") { S.my = to.my; S.dia = to.dia; send(done); return; }
        if (to.stim != null || to.blockNa) { ghost = tracePts(cfg()); if (to.stim != null) S.stim = to.stim; if (to.blockNa) S.blockNa = true; }
        hidePrev = true; tcur = 0; play(done);
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: How a signal codes strength (three stations) ----------
function part3(host, api){
  var P = api.content, S = api.S, s1 = P.s1, s2 = P.s2, s3 = P.s3;
  S.cond = S.cond || "h";
  var anim = null, pulse = null, watch = null, colMsg = null;
  var maxR = 80;
  host.innerHTML =
    '<div class="ap-st" id="ap-s1"><h3>' + s1.title + '</h3><p>' + s1.intro + ' <span class="bio-model">Model data</span></p>' +
      '<div class="ap-bars" id="ap-bars" role="group" aria-label="Firing rate at each pressure: tap a column"></div>' +
      '<div class="tbl-wrap"><table class="ap-tbl"><thead><tr><th scope="col">Pressure</th>' + s1.cols.map(function(c){ return '<th scope="col">' + c.t + "</th>"; }).join("") + "</tr></thead><tbody>" +
        '<tr><th scope="row">Action potentials per second</th>' + s1.cols.map(function(c){ return "<td>" + c.rate + "</td>"; }).join("") + "</tr>" +
        '<tr><th scope="row">Peak of each spike (mV)</th>' + s1.cols.map(function(c){ return "<td>" + c.peak + "</td>"; }).join("") + "</tr></tbody></table></div>" +
      '<div id="ap-s1fb"></div><div id="ap-s1w"></div></div>' +
    '<div class="ap-st part" id="ap-s2"><h3>' + s2.title + '</h3><div class="ap-s2pic" id="ap-s2pic" role="img"></div><p class="ap-s2t" id="ap-s2t" aria-live="polite"></p><div id="ap-s2pl"></div><p>' + s2.text + "</p></div>" +
    '<div class="ap-st part" id="ap-s3"><h3>' + s3.title + '</h3><p>' + s3.intro + ' <span class="bio-model">Model data</span></p><div class="ap-row" id="ap-s3c"></div>' +
      '<p class="ap-watch" id="ap-s3w"></p><div class="ap-axw" id="ap-s3ax" role="img"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="ap-s3go" data-k="aps3go">Send an impulse</button></div>' +
      '<div class="tbl-wrap"><table class="ap-tbl"><thead><tr><th scope="col">Condition</th>' + s3.conds.map(function(c){ return '<th scope="col">' + c.t + "</th>"; }).join("") + "</tr></thead><tbody>" +
        '<tr><th scope="row">Time to arrive</th>' + s3.conds.map(function(c){ return "<td>" + (c.ms == null ? "fails to arrive" : c.ms + " ms") + "</td>"; }).join("") + "</tr></tbody></table></div>" +
      "<p>" + s3.ms + "</p><p>" + s3.blockers + "</p></div>";
  // ---- station 1: tap the column where the rate stops rising, then choose why ----
  function paintBars(){
    var box = $("#ap-bars", host), ans = MV.ans(s1);
    MV.keepFocus(box, function(){
      box.innerHTML = s1.cols.map(function(c){
        var on = S.col === c.id, good = on && ans.indexOf(c.id) >= 0;
        return '<button type="button" class="ap-bar' + (on ? (good ? " good" : " bad") : "") + '" data-col="' + c.id + '" data-k="apcol' + c.id + '" aria-pressed="' + on + '" aria-label="' + MV.esc(c.t + " pressure: " + c.rate + " action potentials per second" + (c.rate ? ", each peaking at +35 mV" : "")) + '">' +
          '<span class="ap-barv"><i style="height:' + f1(Math.max(2, c.rate / maxR * 100)) + '%"></i></span><span class="ap-barn">' + c.rate + "/s</span><span class=\"ap-barl\">" + c.t + "</span></button>";
      }).join("");
    });
    var fb = $("#ap-s1fb", host);
    if (S.colOk) fb.innerHTML = MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s1.colGood);
    else if (colMsg) fb.innerHTML = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + colMsg);
    else fb.innerHTML = "";
    var w = $("#ap-s1w", host);
    if (!S.colOk) { w.innerHTML = ""; return; }
    var pick = S.why == null ? null : s1.options[S.why];
    MV.keepFocus(w, function(){
      w.innerHTML = '<p class="ap-wp"><strong>' + s1.whyPrompt + '</strong></p><div class="opts" role="radiogroup" aria-label="Why the rate stops rising">' + s1.options.map(function(o, i){
        var c = "opt" + (S.why === i ? " picked" + (MV.ok(o) ? " right" : " wrong") : "");
        return '<button type="button" class="' + c + '" role="radio" aria-checked="' + (S.why === i) + '" data-why="' + i + '" data-k="apwhy' + i + '"' + (S.whyOk ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>";
      }).join("") + "</div>" + (pick ? (MV.ok(pick) ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + pick.why) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + pick.why + " Try again.")) : "");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.col) {
      if (S.colOk) return;
      S.col = b.dataset.col;
      if (MV.ans(s1).indexOf(S.col) >= 0) { S.colOk = true; colMsg = null; } else colMsg = s1.colBad[S.col] || "Look again at where the numbers stop climbing.";
      api.save(); paintBars(); MV.focusFb($("#ap-s1", host)); return;
    }
    if (b.dataset.why != null) { S.why = +b.dataset.why; if (MV.ok(s1.options[S.why])) S.whyOk = true; api.save(); paintBars(); MV.focusFb($("#ap-s1w", host)); return; }
  });
  paintBars();
  // ---- station 2: why one way? (step-through; N13 player) ----
  function s2pic(i){
    var h = "", y = 46, x0 = 30, w = 92;
    h += sv("rect", { x:x0, y:y - 14, width:w * 5, height:28, rx:14, "class":"ap-axon" });
    for (var k = 0; k < 5; k++) {
      var n = k + 1, x = x0 + k * w, st = "";
      if (n === 3) st = i >= 2 ? "refr" : "fire";
      if (n === 2 && i >= 1) st = "refr";
      if (n === 4 && i >= 2) st = "fire";
      h += sv("rect", { x:x + 4, y:y - 12, width:w - 8, height:24, rx:10, "class":"ap-patch" + (st ? " " + st : "") });
      h += txt(x + w / 2, y + 4, "patch " + n, "ap-lab", "middle");
      if (st === "refr") h += txt(x + w / 2, y + 34, "refractory", "ap-sub", "middle");
      if (st === "fire") { h += txt(x + w / 2, y + 34, "fires: Na⁺ in", "ap-flna", "middle"); h += sv("circle", { cx:x + w / 2 - 10, cy:y - 22, r:4, "class":"ap-dna" }) + sv("circle", { cx:x + w / 2 + 10, cy:y - 22, r:4, "class":"ap-dna" }); }
    }
    h += sv("path", { d:"M" + (x0 + w * 5 - 60) + " 96 H" + (x0 + w * 5) + " M" + (x0 + w * 5 - 8) + " 91 L" + (x0 + w * 5) + " 96 L" + (x0 + w * 5 - 8) + " 101", "class":"ap-dir" }) + txt(x0 + w * 5 - 66, 100, "toward the axon terminal", "ap-sub", "end");
    return '<svg viewBox="0 0 520 110" class="ap-svg" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  var ALT = ["Five patches of axon membrane. The impulse (firing, Na⁺ entering) is at patch 3.", "Patch 3 is firing; patch 2, behind it, is refractory.", "Patch 4, ahead, has reached threshold and fires; patches 2 and 3 behind it are refractory."];
  MV.player($("#ap-s2pl", host), { count:3, interval:1600, label:function(i){ return "Step " + (i + 1) + " of 3"; }, render:function(i){
    var pic = $("#ap-s2pic", host); pic.innerHTML = s2pic(i); pic.setAttribute("aria-label", ALT[i]);
    $("#ap-s2t", host).textContent = (i + 1) + ". " + s2.steps[i];
  } });
  // ---- station 3: myelin conditions on a 0.5 m pathway ----
  radios($("#ap-s3c", host), { label:"Condition", cls:"chips", options:s3.conds.map(function(c){ return { id:c.id, t:c.t }; }), value:S.cond, onChange:function(v){ if (anim) { anim(); anim = null; } S.cond = v; pulse = null; watch = null; api.save(); paintS3(); } });
  function paintS3(){
    var c = byId(s3.conds, S.cond), lvl = S.cond === "h" ? 0 : S.cond === "p" ? 1 : 2, p = pulse || { u:null, a:0 };
    var el = $("#ap-s3ax", host);
    el.innerHTML = '<svg viewBox="0 0 520 100" class="ap-svg" aria-hidden="true" focusable="false">' + axonSVG({ my:"m", dia:"thick", dist:0.5, dmgLevel:lvl, pulse:p.u, alpha:p.a, slide:false }) + "</svg>";
    el.setAttribute("aria-label", c.t + " axon, 0.5 m. " + (lvl ? "Some myelin segments are damaged (dashed outlines)." : "Intact myelin segments with nodes between them.") + " Model time to arrive: " + (c.ms == null ? "fails to arrive." : c.ms + " ms."));
    $("#ap-s3w", host).innerHTML = '<span class="ap-sw">Stopwatch</span> <strong>' + (watch == null ? "—" : watch === "fail" ? "fails to arrive" : msT(watch)) + "</strong>";
    $("#ap-s3go", host).disabled = !!anim;
  }
  $("#ap-s3go", host).addEventListener("click", function(){
    if (anim) return;
    var c = byId(s3.conds, S.cond), fails = c.ms == null;
    pulse = { u:0, a:1 }; watch = 0;
    anim = pulseRun({ ms:fails ? 20 : c.ms, fails:fails }, function(u, a, w, end){ pulse = { u:u, a:a }; watch = end && fails ? "fail" : w; paintS3(); }, function(){ anim = null; paintS3(); });
    paintS3();
  });
  paintS3();
  return {};
}

// ---------- Practice 1: Label the trace (@component N8 traceTap — tap a point on a Plot trace, or move a probe with the arrow
// keys and press Enter; each item accepts a time range; solved picks stay marked) ----------
var LT_PTS = [[-1, -70]].concat(SPIKE);
function traceAct(host, api, a){
  var S = api.S; S.items = S.items || {}; if (S.p == null) S.p = -0.5;
  var msg = null, plot = null;
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null, pick:null }); }
  function cur(){ for (var i = 0; i < a.items.length; i++) if (!ist(a.items[i].id).solved) return a.items[i]; return null; }
  function vOf(t){ return interp(LT_PTS, t); }
  host.innerHTML = '<div class="ap-lt"><div class="ap-ltg"><div class="plot-wrap ap-ltw" id="ap-ltw" tabindex="0" role="group" aria-label="Trace point selector. Arrow keys move along the trace; Enter chooses the point.">' +
    '<canvas class="plot" id="ap-ltc" role="img"></canvas></div><p class="tiny ap-ltp" id="ap-ltp" aria-live="polite"></p></div><div class="ap-ltq" id="ap-ltq"></div></div>';
  var wrap = $("#ap-ltw", host), cvs = $("#ap-ltc", host);
  plot = new MV.Plot(cvs, { xmin:-1.15, xmax:5.15, ymin:-100, ymax:55 });
  plot.render = draw;
  function draw(){
    var css = MV.css, pen = css("--pen"), pts = [], labels = [], font = "700 12px " + css("--font-ui");
    a.items.forEach(function(it, i){ var x = ist(it.id); if (x.solved && x.pick != null) { pts.push({ x:x.pick, y:vOf(x.pick), r:4.5, color:css("--ink") }); labels.push({ x:x.pick, y:vOf(x.pick), text:String(i + 1), color:css("--ink"), align:"center", dy:-14, font:font, bg:true }); } });
    pts.push({ x:S.p, y:vOf(S.p), r:6.5, color:css("--hi-ink"), ring:true });
    plot.draw({ view:{ xmin:-1.15, xmax:5.15, ymin:-100, ymax:55 }, curves:[{ pts:LT_PTS, color:pen, width:3 }],
      segments:[{ x1:S.p, y1:-100, x2:S.p, y2:55, color:css("--ink-2"), width:1, dash:[2, 3] }, { x1:0, y1:-97, x2:0, y2:-76, color:css("--ink"), width:1.6, arrow:true }],
      points:pts, labels:labels.concat([{ x:0.08, y:-92, text:"stimulus", color:css("--ink-2"), align:"left", font:"600 12px " + css("--font-ui") }]),
      xTicks:{ step:1 }, yTicks:{ step:20 }, xLabel:"time (ms)", yLabel:"membrane potential (mV)",
      describe:"A single action potential: flat at −70 mV from −1 to 0 ms, a stimulus at 0 ms, rising to −55 mV at 0.5 ms, steeply to +35 mV at 1.0 ms, falling to −20 mV at 1.5 ms and −70 mV at 2.0 ms, dipping to −80 mV at 2.5 ms, −75 mV at 3.0 ms, and back to −70 mV at 4.0 ms. Probe at " + MV.num(S.p, 1) + " ms." });
    $("#ap-ltp", host).textContent = "Probe: " + MV.num(S.p, 1) + " ms, " + MV.plain(mV(vOf(S.p)));
  }
  function paintQ(){
    var it = cur(), box = $("#ap-ltq", host), h = "";
    if (it) {
      var i = a.items.indexOf(it), x = ist(it.id);
      h += '<div class="q"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + '</div><span class="tags"><span class="tag">' + (i + 1) + " of " + a.items.length + "</span></span></div>";
      h += '<p class="tiny muted">Tap the trace, or Tab to the graph, move with the arrow keys and press Enter.</p>';
      if (msg) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg + " Try again.");
      if (it.hints) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      h += "</div>";
    } else h += MV.fbHTML("good", "<strong>✓ All 8 labelled.</strong> You’ve read the whole trace: rest, threshold, Na⁺ in, peak, K⁺ out, hyperpolarization and both refractory periods.");
    var done = a.items.filter(function(q){ return ist(q.id).solved; });
    if (done.length) h += '<ol class="ap-ltd">' + done.map(function(q){ var x = ist(q.id); return '<li value="' + (a.items.indexOf(q) + 1) + '"><span class="ap-ok">✓</span> ' + q.prompt + " <span class=\"muted\">" + q.done + (x.first ? "" : " (not first try)") + "</span></li>"; }).join("") + "</ol>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function choose(){
    var it = cur(); if (!it) return;
    var x = ist(it.id), r = MV.ans(it), t = S.p;
    if (t >= r[0] - 1e-6 && t <= r[1] + 1e-6) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; x.pick = t; msg = null; }
    else { x.tries++; var w = (it.wrong || []).filter(function(q){ return t >= q.range[0] - 1e-6 && t <= q.range[1] + 1e-6; })[0]; msg = w ? w.fb : a.wrongDefault; }
    api.save(); draw(); paintQ(); MV.focusFb($("#ap-ltq", host));
  }
  function setP(t){ S.p = clamp(Math.round(t * 10) / 10, -1, 5); draw(); }
  cvs.addEventListener("click", function(e){ var rc = cvs.getBoundingClientRect(); setP(plot.xOf(e.clientX - rc.left)); choose(); });
  wrap.addEventListener("keydown", function(e){
    var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (d) { e.preventDefault(); setP(S.p + d * (e.shiftKey ? 0.5 : 0.1)); api.save(); return; }
    if (e.key === "Home") { e.preventDefault(); setP(-1); return; }
    if (e.key === "End") { e.preventDefault(); setP(5); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = cur(); if (!it || b.dataset.act !== "hint") return;
    var x = ist(it.id); x.hint = Math.min(3, x.hint + 1); api.save(); paintQ();
  });
  paintQ();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: What if…? (prediction chips in retry mode, adapted from the toolkit's practice MC; ★ tags; the
// investigation follow-up appears under W4 once it is solved and isn't counted) ----------
function whatIf(host, api, a){
  var S = api.S; S.items = S.items || {};
  var fu = a.followUp;
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  var all = a.items.concat([fu]);
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-mq="' + it.id + '"></div>' + (it.id === fu.after ? '<div class="q ap-fu" data-mq="' + fu.id + '"></div>' : ""); }).join("");
  function paintQ(it){
    var box = $('[data-mq="' + it.id + '"]', host), x = ist(it.id);
    if (it === fu) {
      if (!ist(fu.after).solved) { box.hidden = true; box.innerHTML = ""; return; }
      box.hidden = false;
      MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true, topicLabel:fu.title }); });
      return;
    }
    var i = a.items.indexOf(it);
    MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" }); });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-mq]"); if (!box) return;
    var it = byId(all, box.dataset.mq), x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
    else if (b.dataset.act === "check") {
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintQ(it); if (it.id === fu.after) paintQ(fu);
    if (b.dataset.act === "check") MV.focusFb(box);
  });
  all.forEach(paintQ);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a fast, thin pathway (chips; live axon preview with stopwatch + 20 ms spike train) ----------
var task = (function(){
  var api = null, T = null, anim = null;
  function read(){ var s = api ? api.S : {}; return { my:s.my || null, dia:s.dia || null, path:s.path || null, stim:s.stim == null ? null : +s.stim }; }
  function full(d){ return d.my && d.dia && d.path && d.stim != null; }
  function dist(d){ return T.paths[d.path]; }
  function ms(d){ return dist(d) / SPEED[d.my][d.dia] * 1000; }
  function trainSVG(d){
    var pts = trainPts(d.stim == null ? 0 : d.stim), X = function(t){ return 30 + t / 20 * 470; }, Y = function(v){ return 96 - (v + 90) / 135 * 84; }, h = "";
    h += sv("line", { x1:30, y1:f1(Y(-55)), x2:500, y2:f1(Y(-55)), "class":"ap-guide" }) + txt(26, f1(Y(-55) + 4), "−55", "ap-sub", "end") + txt(26, f1(Y(35) + 4), "+35", "ap-sub", "end");
    h += sv("polyline", { points:pts.map(function(p){ return f1(X(p[0])) + "," + f1(Y(p[1])); }).join(" "), "class":"ap-htr thin" });
    h += txt(30, 112, "0 ms", "ap-sub") + txt(500, 112, "20 ms", "ap-sub", "end");
    return '<svg viewBox="0 0 520 118" class="ap-svg" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  function draw(p){
    var d = read(), ok = full(d), ax = $("#ap-tax"), tr = $("#ap-ttr"); if (!ax) return;
    p = p || { u:null, a:0, w:null };
    var o = { my:d.my || "u", dia:d.dia || "thin", dist:d.path ? dist(d) : 0.5, dmgLevel:0, pulse:p.u, alpha:p.a };
    ax.innerHTML = '<svg viewBox="0 0 520 100" class="ap-svg" aria-hidden="true" focusable="false">' + axonSVG(o) + "</svg>";
    ax.setAttribute("aria-label", ok ? (d.my === "m" ? "Myelinated" : "Unmyelinated") + ", " + d.dia + " axon along the " + d.path + " pathway, " + MV.num(dist(d)) + " m. First action potential arrives in " + MV.plain(msT(ms(d))) + "." : "Axon preview: choose all four inputs.");
    $("#ap-tw").innerHTML = '<span class="ap-sw">Stopwatch</span> <strong>' + (!ok ? "—" : p.w == null ? msT(ms(d)) : msT(p.w)) + "</strong>";
    var n = d.stim == null ? 0 : TRAIN[d.stim] || 0;
    tr.innerHTML = trainSVG(d);
    tr.setAttribute("aria-label", d.stim == null ? "Spike train preview: choose a stimulus." : "20 ms spike train at " + d.stim + " mV: " + n + " action potentials, each peaking at +35 mV.");
    $("#ap-tn").textContent = d.stim == null ? "Choose a stimulus to see the 20 ms spike train." : "Spike train in 20 ms: " + n + " action potential" + (n === 1 ? "" : "s") + (n ? ", each peaking at +35 mV." : ".");
  }
  function run(){
    if (anim) { anim(); anim = null; }
    var d = read(); if (!full(d)) { draw(); return; }
    var m = ms(d);
    anim = pulseRun({ ms:m, fails:false }, function(u, a2, w){ draw({ u:u, a:a2, w:w }); }, function(){ anim = null; });
  }
  function lab(k){ var p = k.split("-"); return (p[0] === "m" ? "myelinated" : "unmyelinated") + ", " + p[1] + ", " + p[2] + " (" + MV.num(T.paths[p[2]]) + " m), " + p[3] + " mV"; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="ap-tin"><div id="ap-tmy"></div><div id="ap-tdia"></div><div id="ap-tpath"></div><div id="ap-tstim"></div></div>';
      function grp(id, label, list, key){ radios($(id, inp), { label:label, cls:"chips", options:list, value:a.S[key] == null ? "" : a.S[key], onChange:function(v){ a.S[key] = key === "stim" ? +v : v; a.save(); a.update(); run(); } }); }
      grp("#ap-tmy", "Myelin", [{ id:"m", t:"yes" }, { id:"u", t:"no" }], "my");
      grp("#ap-tdia", "Diameter", [{ id:"thin", t:"thin" }, { id:"thick", t:"thick" }], "dia");
      grp("#ap-tpath", "Pathway", [{ id:"arm", t:"arm (0.5 m)" }, { id:"leg", t:"leg (1.0 m)" }], "path");
      grp("#ap-tstim", "Stimulus", T.stims.map(function(v){ return { id:v, t:v + " mV" }; }), "stim");
      pv.innerHTML = '<p class="ap-watch" id="ap-tw"></p><div class="ap-axw" id="ap-tax" role="img"></div><div class="ap-ttr" id="ap-ttr" role="img"></div><p class="tiny" id="ap-tn"></p>' +
        '<details class="alg"><summary>How the model works</summary><p>Speeds: unmyelinated thin 1 m/s, unmyelinated thick 10 m/s, myelinated thin 50 m/s, myelinated thick 100 m/s. Time = distance ÷ speed.</p><p>Action potentials in 20 ms: 10 mV 0, 15 mV 2, 20 mV 3, 25 mV 4, 30 mV 5. Every spike peaks at +35 mV.</p></details>';
      draw();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose the myelin, diameter, pathway and stimulus first."; },
    checks:function(d){ if (!full(d)) return [false, false, false, false]; return [d.stim >= THR, (TRAIN[d.stim] || 0) >= 3, dist(d) / SPEED[d.my][d.dia] <= 0.010 + 1e-9, d.dia === "thin"]; },
    key:function(d){ return d.my + "-" + d.dia + "-" + d.path + "-" + d.stim; },
    label:lab,
    text:function(k){ var p = k.split("-"), d = { my:p[0], dia:p[1], path:p[2], stim:+p[3] }; return lab(k) + ": arrives in " + MV.plain(msT(ms(d))) + ", " + (TRAIN[d.stim] || 0) + " spikes in 20 ms"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ trace:traceAct, whatif:whatIf },
  task:task
});
})();
