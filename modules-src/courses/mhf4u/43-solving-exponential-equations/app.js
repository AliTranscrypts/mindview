// MHF4U 43 Solving Exponential Equations: hero (doubling timeline storyboard), doubling timeline (Explore),
// equation lab with a solution lock (Part 3), "Model it, then solve it" entries (Practice 2) and the "Plan a dose" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, LG = Math.log10;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
function rng(a, b, s){ var out = []; for (var k = 0; a + k * s <= b + 1e-9; k++) out.push(Math.round((a + k * s) * 1e6) / 1e6); return out; }
function near(a, b, e){ return Math.abs(a - b) <= (e || 1e-9) * Math.max(1, Math.abs(b)); }
// 3 significant figures, or the exact whole number
function f3(v){ if (Math.abs(v - Math.round(v)) < 1e-9) return num(Math.round(v), 0); return num(Number(v.toPrecision(3)), 10); }
function money(v){ var s = Math.abs(v).toFixed(2), p = s.split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return (v < 0 ? MINUS : "") + "$" + p.join("."); }
// value rounded to dp places with "=" when that is exact and "≈" otherwise
function ap(v, dp){ var k = Math.pow(10, dp), ex = Math.abs(v * k - Math.round(v * k)) < 1e-7; return { eq:ex ? "=" : "≈", s:num(v, dp) }; }
function pl(n, w){ return Math.abs(n) === 1 ? w[0] : w[1]; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function setTxt(ctx, size, weight, fam){ ctx.font = (weight || 600) + " " + size + "px " + (fam || css("--font-ui") || "sans-serif"); }
// text with an optional sheet-coloured backing
function txt(ctx, s, x, y, o){
  o = o || {}; setTxt(ctx, o.size || 12, o.weight, o.math ? css("--font-math") : null);
  ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
  if (o.bg) { var w = ctx.measureText(s).width, bx = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x; ctx.save(); ctx.globalAlpha = 0.88 * (o.alpha == null ? 1 : o.alpha); ctx.fillStyle = css("--sheet"); ctx.fillRect(bx - 3, y - (o.size || 12) * 0.75, w + 6, (o.size || 12) * 1.5); ctx.restore(); }
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha; ctx.fillStyle = o.color || css("--ink"); ctx.fillText(s, x, y); ctx.restore();
}

// @component G11 canvasMath (from MHF4U 37) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
// (single letters italic, words such as "log" upright), optional sheet-coloured backing; returns the width drawn
function cmath(ctx, s, x, y, o){
  o = o || {};
  var F = o.size || 14, fm = css("--font-math") || "serif", segs = [], i = 0;
  function push(t, lv){ t.split(/([A-Za-z]+)/).forEach(function(w, k){ if (w) segs.push({ t:w, lv:lv, it:k % 2 === 1 && w.length === 1 }); }); }
  while (i < s.length) {
    var c = s[i];
    if ((c === "^" || c === "_") && i + 1 < s.length) {
      var g, j;
      if (s[i + 1] === "{") { j = s.indexOf("}", i + 2); g = s.slice(i + 2, j); i = j + 1; } else { g = s[i + 1]; i += 2; }
      push(g.replace(/-/g, MINUS), c === "^" ? 1 : -1); continue;
    }
    var k = i; while (k < s.length && s[k] !== "^" && s[k] !== "_") k++;
    push(s.slice(i, k).replace(/-/g, MINUS), 0); i = k;
  }
  function font(sg){ return (sg.it ? "italic " : "") + (o.weight || 600) + " " + (sg.lv ? Math.round(F * 0.72) : F) + "px " + fm; }
  var w = 0; segs.forEach(function(sg){ ctx.font = font(sg); sg.w = ctx.measureText(sg.t).width + (sg.it ? 1 : 0); w += sg.w; });
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.bg !== false) { var ga = ctx.globalAlpha; ctx.globalAlpha = 0.85 * ga; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - F * 0.8, w + 6, F * 1.6); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.38 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
function ring(ctx, X, Y, o){
  o = o || {};
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.hi !== false) { ctx.beginPath(); ctx.arc(X, Y, (o.r || 5) + 5, 0, 6.3); ctx.fillStyle = css("--hi"); ctx.fill(); }
  ctx.beginPath(); ctx.arc(X, Y, o.r || 5, 0, 6.3);
  if (o.open) { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = o.color || css("--ink"); ctx.stroke(); }
  else { ctx.fillStyle = o.color || css("--ink"); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css("--sheet"); ctx.stroke(); }
  ctx.restore();
}
function axisLab(ctx, v, u, x, y, al){
  var c = css("--ink-2"); ctx.save(); ctx.font = "italic 400 13px " + css("--font-math"); var w1 = ctx.measureText(v).width; setTxt(ctx, 11, 400); var w2 = ctx.measureText(u).width; ctx.restore();
  var x0 = al === "right" ? x - w1 - w2 : x;
  ctx.save(); ctx.fillStyle = c; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.font = "italic 400 13px " + css("--font-math"); ctx.fillText(v, x0, y); setTxt(ctx, 11, 400); ctx.fillText(u, x0 + w1, y); ctx.restore();
}
function arrowHead(ctx, x, y, dir, col, s){ s = s || 9; ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - dir * s, y - s * 0.6); ctx.lineTo(x - dir * s, y + s * 0.6); ctx.closePath(); ctx.fill(); ctx.restore(); }

// @component radioGroup (from MHF4U 25/32/37) — segmented control or chip row as a real radio group (arrow keys, roving tabindex, lock)
function radios(host, o){
  var val = String(o.value), locked = false;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } } };
}
// @component N9 stepSlider (from MHF4U 32/37) — slider over a list of positions with 40 px − / + buttons and a formatted value;
// Shift + arrow for big steps (o.big); setCount(n) changes the number of positions (used by the time marker)
function stepSlider(host, o){
  host.innerHTML = '<div class="wt-sl" style="--sc:var(' + (o.color || "--ink") + ')"><div class="wt-sl-top"><label for="sl43-' + o.id + '">' + o.label + '</label><output id="sl43-' + o.id + '-o" for="sl43-' + o.id + '"></output></div>' +
    '<div class="wt-sl-row"><button type="button" class="btn ghost wt-pm" data-pm="-1" data-k="' + o.id + 'm" aria-label="Decrease ' + o.name + '">' + MINUS + '</button><input type="range" id="sl43-' + o.id + '" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost wt-pm" data-pm="1" data-k="' + o.id + 'p" aria-label="Increase ' + o.name + '">+</button></div>' + (o.note ? '<p class="tiny muted wt-note">' + o.note + "</p>" : "") + "</div>";
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), cur = o.idx, locked = false, n = o.n;
  function paint(){
    inp.max = n - 1; inp.value = cur; out.innerHTML = o.fmt(cur); inp.setAttribute("aria-valuetext", o.say(cur));
    inp.disabled = locked; btns[0].disabled = locked || cur <= 0; btns[1].disabled = locked || cur >= n - 1;
  }
  function go(i, how){ i = clamp(i, 0, n - 1); if (i === cur) { paint(); return; } cur = i; paint(); o.onChange(cur, how); }
  inp.addEventListener("input", function(){ cur = +inp.value; paint(); o.onChange(cur, "drag"); });
  inp.addEventListener("keydown", function(e){
    if (o.big && e.shiftKey && /^Arrow/.test(e.key)) { e.preventDefault(); if (!locked) go(cur + ((e.key === "ArrowRight" || e.key === "ArrowUp") ? o.big() : -o.big()), "key"); }
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + +b.dataset.pm, "step"); });
  paint();
  return { set:function(i){ cur = clamp(i, 0, n - 1); paint(); }, setCount:function(c){ n = Math.max(1, c); cur = clamp(cur, 0, n - 1); paint(); }, lock:function(b){ locked = !!b; paint(); }, get:function(){ return cur; } };
}

// ---------- hero: the doubling timeline storyboard, A = 10 · 2^t ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:-0.5, xmax:6.5, ymin:-60, ymax:720 });
  var A = function(t){ return 10 * Math.pow(2, t); }, TC = LG(30) / LG(2), st = { t:0 };
  var D = [1200, 2000, 1200, 1000], TOT = D[0] + D[1] + D[2] + D[3];
  var CAP1 = MV.md("300 is between 160 and 320: between 4 and 5 doublings."), CAP2 = MV.md("`2^t = 30`, so `t = log 30 / log 2 ≈ 4.91` hours."), shown = 0;
  p.render = function(){
    var ms = st.t * TOT, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), brown = css("--p-b"), soft = css("--hi-soft");
    var cd = clamp(ms / D[0], 0, 1) * 6, nb = clamp((ms - D[0]) / 400, 0, 5), tg = MV.ease(clamp((ms - D[0] - D[1]) / D[2], 0, 1)), dr = clamp((ms - D[0] - D[1] - D[2]) / D[3], 0, 1);
    var bands = [];
    for (var i = 0; i < 5; i++) if (nb > i && i % 2 === 1) bands.push({ x0:i, x1:i + 1, color:soft, alpha:Math.min(1, nb - i) });
    if (dr > 0) bands.push({ x0:4, x1:4 + (TC - 4) * dr, color:soft });
    p.draw({ view:{ xmin:-0.5, xmax:6.5, ymin:-60, ymax:720 }, bands:bands, xTicks:{ step:1 }, yTicks:{ step:100 }, xLabel:"t (h)",
      curves:cd > 0.01 ? [{ f:A, color:pen, width:3, domain:[0, cd] }] : [],
      describe:"Graph of A = 10 times 2 to the power t, for t from 0 to 6 hours. Five doubling periods are marked, each times 2, with values 20, 40, 80, 160 and 320. A target line at 300 meets the curve at t ≈ 4.91 hours, 0.907 of the way through the fifth doubling.",
      after:function(ctx, pl){
        var top = pl.Y(700);
        for (var b = 0; b < 5; b++) {
          if (nb <= b) continue;
          var a = Math.min(1, nb - b);
          ctx.save(); ctx.globalAlpha = 0.55 * a; ctx.strokeStyle = ink2; ctx.setLineDash([2, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pl.X(b + 1), pl.Y(0)); ctx.lineTo(pl.X(b + 1), top); ctx.stroke(); ctx.restore();
          txt(ctx, "× 2", pl.X(b + 0.5), top, { color:brown, align:"center", size:14, weight:700, alpha:a, math:true });
          var v = A(b + 1);
          txt(ctx, String(v), pl.X(b + 1) - 7, pl.Y(v) - 11, { align:"right", size:13, weight:700, bg:true, alpha:a, math:true });
          ring(ctx, pl.X(b + 1), pl.Y(v), { r:3.5, hi:false, alpha:a });
        }
        if (tg > 0) {
          var yT = lerp(760, 300, tg), Y = pl.Y(yT);
          ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(pl.X(0), Y); ctx.lineTo(pl.X(6.5), Y); ctx.stroke(); ctx.restore();
          txt(ctx, "target 300", pl.X(0) + 6, Y - 11, { align:"left", size:13, weight:700, bg:true });
        }
        if (dr > 0) {
          var X = pl.X(TC);
          ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(X, pl.Y(300)); ctx.lineTo(X, pl.Y(300 - 300 * dr)); ctx.stroke(); ctx.restore();
          ring(ctx, X, pl.Y(300), { r:5 });
          if (dr >= 1) { cmath(ctx, "t ≈ 4.91", X - 6, pl.Y(0) - 12, { size:13, align:"right" }); txt(ctx, "0.907", pl.X(4.45), pl.Y(250), { align:"center", size:12, weight:700, bg:true }); }
        }
      } });
    var want = dr >= 1 ? 2 : tg >= 1 ? 1 : 0;
    if (want !== shown) { shown = want; f.cap.innerHTML = want === 2 ? CAP1 + "<br>" + CAP2 : want === 1 ? CAP1 : ""; }
  };
  if (MV.reduceMotion) { st.t = 1; p.render(); return; }
  p.render();
  MV.tween({ dur:TOT, ease:LIN, step:function(t){ st.t = t; p.render(); } });
}

// ======================================================================================================
// Explore: doubling timeline (module-specific) — Doubling / Half-life / Interest modes, ordinary and log views,
// period strip, average rates, target box, time marker, challenge set-ups
// ======================================================================================================
var TL = {
  lists:{ dA0:rng(1, 100, 1), d:rng(0.5, 10, 0.5), hA0:rng(10, 1000, 10), h:rng(0.5, 12, 0.25), P:rng(100, 10000, 100), r:rng(0.5, 12, 0.5) },
  pname:{ 1:["year", "years"], 2:["half-year", "half-years"], 4:["quarter", "quarters"], 12:["month", "months"] },
  def:{ dbl:{ A0:5, d:3, N:40 }, half:{ A0:80, h:5, N:20 }, int:{ P:1000, r:6, m:4, N:2000 } }
};
function idxOf(list, v){ var best = 0; list.forEach(function(x, i){ if (Math.abs(x - v) < Math.abs(list[best] - v)) best = i; }); return best; }

function explore(host, api){
  var S = api.S, C = api.content, CH = {};
  (C.challenges || []).forEach(function(c){ CH[c.id] = c; });
  ["dbl", "half", "int"].forEach(function(k){ S[k] = Object.assign({}, TL.def[k], S[k] || {}); });
  if (!TL.def[S.mode]) S.mode = "dbl";
  S.view = S.view === "log" ? "log" : "ord"; if (typeof S.tm !== "number") S.tm = 0;
  if (S.strip === undefined) S.strip = true; S.rates = !!S.rates; if (!/^tc[123]$/.test(S.setup || "")) S.setup = "off";
  var view = { s:S.view === "log" ? 1 : 0, hideCross:false, fillT:1, secN:Infinity, secT:1, tri:0, flash:false, busy:false };
  var vw = null, vgoal = null, vcancel = null, G = { L:48, R:12, T:14, B:28 };

  host.innerHTML = '<div class="x43-tl"><div class="x43-tl-g" data-mv="graph"><div class="eq-cap x43-cap" id="tl-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="tl-plot" role="img" tabindex="0" aria-describedby="tl-keys" aria-label="Doubling timeline graph"></canvas></div>' +
    '<div class="x43-stripwrap" id="tl-stripwrap"><canvas class="x43-strip" id="tl-strip" role="img" aria-label="Period strip"></canvas><p class="x43-tip" id="tl-tip" hidden></p></div>' +
    '<p class="x43-stripsum" id="tl-sum" aria-live="polite"></p><p class="tiny muted" id="tl-keys">On the graph: ← and → move the time marker (Shift: a whole period), Home and End jump to the ends, ↑ and ↓ apply × 2 and ÷ 2 to the target. You can also drag along the graph.</p></div>' +
    '<div class="x43-tl-c"><div class="x43-row" id="tl-mode"></div><div class="x43-row" id="tl-view"></div><div class="x43-row" id="tl-setup"></div><p class="tiny muted x43-locknote" id="tl-locknote" hidden></p>' +
    '<div id="tl-sl-dbl"><div id="tl-dA0"></div><div id="tl-d"></div></div><div id="tl-sl-half"><div id="tl-hA0"></div><div id="tl-h"></div></div><div id="tl-sl-int"><div id="tl-P"></div><div id="tl-r"></div><div class="x43-row" id="tl-comp"></div></div>' +
    '<div class="x43-target"><label for="tl-N" class="x43-tlab">Target <i>N</i></label><div class="x43-trow"><input id="tl-N" class="numin x43-N" type="number" step="0.01" min="-1000" max="100000" autocomplete="off">' +
    '<button type="button" class="btn ghost x43-tb" id="tl-half" data-k="tlhalf">÷ 2</button><button type="button" class="btn ghost x43-tb" id="tl-dbl" data-k="tldbl">× 2</button></div></div>' +
    '<div id="tl-mk"></div><div class="x43-togs"><button type="button" class="btn ghost sm x43-tog" id="tl-tstrip" data-k="tltstrip">Period strip</button><button type="button" class="btn ghost sm x43-tog" id="tl-trates" data-k="tltrates">Average rates</button></div>' +
    '<dl class="read x43-read" id="tl-read" aria-live="polite"></dl></div></div>';
  var E = { cap:$("#tl-cap"), canvas:$("#tl-plot"), strip:$("#tl-strip"), tip:$("#tl-tip"), sum:$("#tl-sum"), wrap:$("#tl-stripwrap"), read:$("#tl-read"), N:$("#tl-N"), lock:$("#tl-locknote"),
    half:$("#tl-half"), dbl:$("#tl-dbl"), tstrip:$("#tl-tstrip"), trates:$("#tl-trates"), keys:$("#tl-keys") };

  // ----- model -----
  function model(){
    var md = S.mode, r;
    if (md === "dbl") r = { A0:S.dbl.A0, p:S.dbl.d, f:2, N:S.dbl.N, fsrc:"2", tu:"h", pn:["doubling", "doublings"], au:"", ru:"per hour" };
    else if (md === "half") r = { A0:S.half.A0, p:S.half.h, f:0.5, N:S.half.N, fsrc:"1/2", tu:"h", pn:["half-life", "half-lives"], au:" mg", ru:"mg per hour" };
    else { var o = S.int, ip = o.r / o.m; r = { A0:o.P, p:1 / o.m, mpy:o.m, ip:ip, f:1 + ip / 100, N:o.N, tu:"years", pn:TL.pname[o.m], au:"", ru:"per year" }; }
    r.mode = md; r.R = r.N / r.A0; r.noSol = r.N <= 0;
    r.n = r.noSol ? NaN : Math.log(r.R) / Math.log(r.f); if (Math.abs(r.n) < 1e-12) r.n = 0;
    r.tc = r.n * r.p;
    r.A = function(t){ return r.A0 * Math.pow(r.f, t / r.p); };
    r.Ak = function(k){ return r.A0 * Math.pow(r.f, k); };
    r.Av = md === "int" ? function(t){ return r.Ak(Math.floor(t / r.p + 1e-9)); } : r.A;
    r.before = !r.noSol && r.n < 0;
    r.k = Math.round(r.n); r.exact = md !== "int" && !r.noSol && Math.abs(r.n - r.k) < 1e-9;
    r.kc = md === "int" && !r.noSol ? Math.max(0, Math.ceil(r.n - 1e-9)) : null;
    return r;
  }
  function hideTarget(){ return S.setup === "tc3"; }
  function tc2Hidden(){ if (S.setup !== "tc2") return false; var st = MV.S.chal && MV.S.chal.tc2; return !(st && (st.solved || st.hint >= 3)); }
  function stepT(){ return S.mode === "int" ? 1 / S.int.m : 0.25; }
  function goalWin(){
    var M = model(), cap = M.mode === "int" ? 40 * M.mpy : 40, nP = 4;
    if (!M.noSol && M.n > 0) nP = Math.max(4, Math.ceil(M.n - 1e-9) + 1);
    if (S.setup === "tc3") nP = Math.max(nP, Math.ceil(9 / M.p - 1e-9));
    if (S.setup === "tc1") nP = Math.max(nP, Math.ceil(13 / M.p - 1e-9));
    nP = Math.min(nP, cap);
    var t1 = nP * M.p, e0 = M.A0, e1 = M.Av(t1), hi = Math.max(e0, e1), lo = Math.min(e0, e1), showN = !hideTarget();
    if (showN && M.N > 0) { hi = Math.max(hi, M.N); lo = Math.min(lo, M.N); }
    if (S.setup === "tc3") { hi = Math.max(hi, 96); lo = Math.min(lo, 12); }
    var ymax = 1.1 * hi, ymin = 0;
    if (showN && M.N <= 0) ymin = M.N - 0.12 * (ymax - M.N);
    var l0 = LG(lo), l1 = LG(hi), sp = Math.max(l1 - l0, LG(4)), mid = (l0 + l1) / 2;
    return { t1:t1, nP:nP, ymin:ymin, ymax:ymax, lmin:mid - sp * 0.58, lmax:mid + sp * 0.58, capped:!M.noSol && M.n > cap };
  }
  var VK = ["t1", "ymin", "ymax", "lmin", "lmax"];
  function retarget(jump){
    var g = goalWin(), same = vgoal && VK.every(function(k){ return Math.abs(vgoal[k] - g[k]) < 1e-9; });
    vgoal = g;
    if (!vw || jump || MV.reduceMotion) { if (vcancel) { vcancel(); vcancel = null; } vw = Object.assign({}, g); drawAll(); return; }
    if (same) { drawAll(); return; }
    var from = Object.assign({}, vw); if (vcancel) vcancel();
    vcancel = MV.tween({ dur:450, step:function(t){ VK.forEach(function(k){ vw[k] = lerp(from[k], g[k], t); }); vw.nP = g.nP; vw.capped = g.capped; drawAll(); }, done:function(){ vcancel = null; } });
  }

  // ----- blocks of the period strip (one per period, or one per year when more than 24 periods are visible) -----
  function blocks(M){
    var out = [], yearly = M.mode === "int" && vgoal.nP > 24, w = yearly ? 1 : M.p, t1 = vgoal.t1, n = Math.ceil(t1 / w - 1e-9);
    for (var i = 0; i < n; i++) { var a = i * w, b = Math.min(t1, (i + 1) * w); out.push({ i:i, a:a, b:b, full:b - a > w - 1e-9 }); }
    return { list:out, yearly:yearly, w:w };
  }
  function factorTxt(M, yearly){
    if (M.mode === "dbl") return "× 2"; if (M.mode === "half") return "× 1/2";
    if (yearly) return "× " + num(Math.pow(M.f, M.mpy), 4);
    return "× " + num(M.f, 6);
  }
  function rateTxt(M, a, b){
    var r = (M.Av(b) - M.Av(a)) / (b - a), sg = r > 0 ? "+" : r < 0 ? MINUS : "";
    if (M.mode === "int") return sg + money(Math.abs(r)) + "/yr";
    var s = Math.abs(r) >= 100 ? f3(Math.abs(r)) : num(Math.abs(r), 2);
    return sg + s + (M.mode === "half" ? " mg/h" : "/h");
  }

  // ----- the graph -----
  var plot = new MV.Plot(E.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 }), sp = new MV.Plot(E.strip, { xmin:0, xmax:1, ymin:0, ymax:1 });
  function maps(W, H){
    var v = vw, s = view.s, L = G.L, R = G.R, T = G.T, B = G.B;
    var X = function(t){ return L + t / v.t1 * (W - L - R); };
    var Yo = function(a){ return T + (v.ymax - a) / (v.ymax - v.ymin) * (H - T - B); };
    var Yl = function(a){ return a > 0 ? T + (v.lmax - LG(a)) / (v.lmax - v.lmin) * (H - T - B) : H - B + 30; };
    return { X:X, Yo:Yo, Yl:Yl, Y:function(a){ return s <= 0 ? Yo(a) : s >= 1 ? Yl(a) : (1 - s) * Yo(a) + s * Yl(a); } };
  }
  function gridLab(g, base){
    if (g >= 1 || base < 1) return g >= 1 ? num(g, 3) : num(g, 4);
    var d = Math.round(1 / g); return Math.abs(1 / d - g) < 1e-12 ? "1/" + d : num(g, 4);
  }
  function drawGraph(ctx, p){
    var W = p.W, H = p.H, M = model(), v = vw, s = view.s, mp = maps(W, H), X = mp.X, Y = mp.Y;
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), grid = css("--plot-grid"), brown = css("--p-b"), hi = css("--hi");
    var T = G.T, B = G.B, bl = (1 - s) * mp.Yo(clamp(0, v.ymin, v.ymax)) + s * (H - B);
    G.W = W; G.H = H; G.X = X; G.Y = Y; G.bl = bl;
    var bk = blocks(M), small = W < 480;
    // ordinary gridlines (fade out on the log scale)
    if (s < 1) {
      var st = MV.niceStep((v.ymax - v.ymin) / (H < 320 ? 5 : 7));
      ctx.save(); ctx.globalAlpha = 1 - s; ctx.strokeStyle = grid; ctx.lineWidth = 1;
      for (var y = Math.ceil(v.ymin / st) * st; y <= v.ymax + 1e-9; y += st) { var py = Math.round(mp.Yo(y)) + 0.5; ctx.beginPath(); ctx.moveTo(G.L, py); ctx.lineTo(W - G.R, py); ctx.stroke(); }
      ctx.restore();
      for (var y2 = Math.ceil(v.ymin / st) * st; y2 <= v.ymax + 1e-9; y2 += st) { var py2 = mp.Yo(y2); if (py2 < T - 2 || py2 > H - B + 2) continue; txt(ctx, M.mode === "int" ? num(y2, 0) : num(y2, 4), G.L - 5, py2, { align:"right", size:11, weight:400, color:ink2, alpha:1 - s }); }
    }
    // × 2 gridlines (slide to equal spacing on the log scale)
    if (s > 0) {
      var a = Math.pow(10, v.lmin), b = Math.pow(10, v.lmax), bs = Math.pow(10, Math.floor(LG(M.A0) + 1e-9)), gl = [];
      for (var k = Math.floor(Math.log2(a / bs)) - 1; k <= Math.ceil(Math.log2(b / bs)) + 1; k++) { var g = bs * Math.pow(2, k); if (g >= a * 0.999 && g <= b * 1.001) gl.push(g); }
      var al = Math.min(1, s * 4), lastY = -99;
      ctx.save(); ctx.globalAlpha = al; ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      gl.forEach(function(g){ var py = Math.round(Y(g)) + 0.5; ctx.beginPath(); ctx.moveTo(G.L, py); ctx.lineTo(W - G.R, py); ctx.stroke(); });
      ctx.restore();
      gl.slice().reverse().forEach(function(g){ var py = Y(g); if (py < T - 2 || py > H - B + 2 || Math.abs(py - lastY) < 13) return; lastY = py; txt(ctx, gridLab(g, bs), G.L - 5, py, { align:"right", size:11, weight:600, color:ink2, alpha:s }); });
    }
    // period marks
    ctx.save(); ctx.strokeStyle = ink2; ctx.globalAlpha = 0.55; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
    bk.list.forEach(function(bb){ if (bb.b >= v.t1 - 1e-9 && !bb.full) return; var px = Math.round(X(bb.b)) + 0.5; if (px > W - G.R + 1) return; ctx.beginPath(); ctx.moveTo(px, T); ctx.lineTo(px, bl); ctx.stroke(); });
    ctx.restore();
    // t-axis and the A-axis
    ctx.save(); ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(G.L, bl); ctx.lineTo(W - G.R, bl); ctx.moveTo(G.L, T - 4); ctx.lineTo(G.L, H - B); ctx.stroke(); ctx.restore();
    var ts = MV.niceStep(v.t1 / (small ? 5 : 9)), lastX = -99;
    for (var t = ts; t <= v.t1 + 1e-9; t += ts) { var px3 = X(t); if (px3 - lastX < 26 || px3 > W - 6) continue; lastX = px3; txt(ctx, num(t, 2), px3, bl + 10, { align:"center", size:11, weight:400, color:ink2 }); }
    txt(ctx, "0", G.L, bl + 10, { align:"center", size:11, weight:400, color:ink2 });
    axisLab(ctx, "t", M.mode === "int" ? " (years)" : " (h)", W - G.R - 2, H - 8, "right");
    axisLab(ctx, "A", M.mode === "half" ? " (mg)" : M.mode === "int" ? " ($)" : "", G.L + 6, T + 2, "left");
    // average-rate secants (G5)
    if (S.rates) {
      bk.list.forEach(function(bb, i){
        if (!bb.full || i >= view.secN + 1) return;
        var fr = i === view.secN ? view.secT : 1, x0 = X(bb.a), y0 = Y(M.Av(bb.a)), x1 = X(bb.b), y1 = Y(M.Av(bb.b)), xe = lerp(x0, x1, fr), ye = lerp(y0, y1, fr);
        if (view.tri > i) {
          ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
          var rise = M.Av(bb.b) - M.Av(bb.a);
          txt(ctx, (rise < 0 ? MINUS : "+") + f3(Math.abs(rise)) + M.au, x1 + 5, (y0 + y1) / 2, { size:12, bg:true });
          txt(ctx, num(bb.b - bb.a, 2) + (M.mode === "int" ? " yr" : " h"), (x0 + x1) / 2, y0 - 10, { size:12, align:"center", bg:true });
        }
        ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(xe, ye); ctx.stroke(); ctx.restore();
        ring(ctx, x0, y0, { r:3, hi:false, color:ink2 }); if (fr >= 1) ring(ctx, x1, y1, { r:3, hi:false, color:ink2 });
      });
    }
    // the curve (Interest: staircase balance plus the dashed smooth guide)
    ctx.save(); ctx.beginPath(); ctx.rect(G.L, 0, W - G.L - G.R + 2, H - B + 4); ctx.clip();
    var N = Math.max(160, Math.round(W * 0.8)), i2;
    if (M.mode === "int") {
      ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath();
      for (i2 = 0; i2 <= N; i2++) { var tt = v.t1 * i2 / N; if (i2) ctx.lineTo(X(tt), Y(M.A(tt))); else ctx.moveTo(X(tt), Y(M.A(tt))); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.lineJoin = "miter"; ctx.beginPath(); ctx.moveTo(X(0), Y(M.A0));
      var np = Math.ceil(v.t1 / M.p - 1e-9);
      for (var q = 0; q < np; q++) { var xa = X(Math.min(v.t1, (q + 1) * M.p)); ctx.lineTo(xa, Y(M.Ak(q))); if ((q + 1) * M.p <= v.t1 + 1e-9) ctx.lineTo(xa, Y(M.Ak(q + 1))); }
      ctx.stroke();
    } else {
      ctx.strokeStyle = pen; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.beginPath();
      for (i2 = 0; i2 <= N; i2++) { var t2 = v.t1 * i2 / N; if (i2) ctx.lineTo(X(t2), Y(M.A(t2))); else ctx.moveTo(X(t2), Y(M.A(t2))); }
      ctx.stroke();
    }
    ctx.restore();
    // amounts at the period marks
    var hid = tc2Hidden(), lastL = -99;
    if (!hid) bk.list.forEach(function(bb){
      if (!bb.full) return; var px4 = X(bb.b); if (px4 - lastL < (small ? 40 : 34) || px4 > W - 4) return;
      var val = M.Av(bb.b), py4 = Y(val); if (py4 < T || py4 > H - B) return; lastL = px4;
      ring(ctx, px4, py4, { r:3, hi:false, color:pen });
      txt(ctx, M.mode === "int" ? "$" + num(Math.round(val), 0) : f3(val), px4 - 5, py4 - 11, { align:"right", size:11, weight:700, bg:true, math:true });
    });
    // TC3's two points
    if (S.setup === "tc3") [[2, 12], [8, 96]].forEach(function(q){ var qx = X(q[0]), qy = Y(q[1]); ring(ctx, qx, qy, { r:6, open:true, hi:false }); cmath(ctx, "(" + q[0] + ", " + q[1] + ")", qx + 9, qy + 12, { size:13 }); });
    // target line
    if (!hideTarget()) {
      var NN = M.N;
      if (NN > 0 || s < 1) {
        var a2 = NN > 0 ? 1 : 1 - s, ty = Y(NN > 0 ? NN : NN);
        if (NN <= 0) ty = mp.Yo(NN);
        ctx.save(); ctx.globalAlpha = a2; ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(G.L, ty); ctx.lineTo(W - G.R, ty); ctx.stroke(); ctx.restore();
        txt(ctx, "target " + (M.mode === "int" ? money(NN).replace(/\.00$/, "") : num(NN, 2)), W - G.R - 4, ty - 11, { align:"right", size:12, weight:700, bg:true, alpha:a2 });
      }
      if (NN <= 0 && s > 0) txt(ctx, "The log scale can’t show 0 or negative amounts", (G.L + W - G.R) / 2, H - B - 14, { align:"center", size:12, weight:700, bg:true, alpha:s, color:ink });
      // crossing
      if (!M.noSol && !view.hideCross) {
        if (M.before) {
          var yb = Y(NN), lbl = "crossed at t " + (near(M.tc, Math.round(M.tc * 100) / 100, 1e-9) ? "= " : "≈ ") + num(M.tc, 2);
          ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(G.L + 30, yb + 14); ctx.lineTo(G.L + 6, yb + 14); ctx.stroke(); ctx.restore();
          arrowHead(ctx, G.L + 2, yb + 14, -1, ink, 9);
          cmath(ctx, lbl, G.L + 34, yb + 14, { size:12 });
        } else if (M.tc <= v.t1 + 1e-9) {
          if (M.mode === "int") {
            var cx = X(M.tc), cy = Y(NN);
            ring(ctx, cx, cy, { r:5, open:true, hi:false });
            if (!hid && M.kc != null) {
              var tk = M.kc * M.p, kx = X(tk), ky = Y(M.Ak(M.kc));
              ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx, bl); ctx.stroke(); ctx.restore();
              ring(ctx, kx, ky, { r:5 });
              cmath(ctx, "t = " + num(tk, 2), kx + 6, bl - 12, { size:12 });
            }
          } else {
            var fx = X(M.tc), fy = Y(NN);
            ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, bl); ctx.stroke(); ctx.restore();
            ring(ctx, fx, fy, { r:5 });
            cmath(ctx, "t " + (M.exact ? "= " + num(M.tc, 2) : "≈ " + num(M.tc, 2)), fx + 6, bl - 12, { size:12 });
          }
        } else {
          var ry = Y(NN);
          arrowHead(ctx, W - G.R, ry + 14, 1, ink, 9);
          txt(ctx, "crosses off the graph →", W - G.R - 12, ry + 14, { align:"right", size:11, bg:true });
        }
      }
    }
    // time marker (G7)
    var mx = X(S.tm), my = Y(M.Av(S.tm));
    ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mx, bl); ctx.lineTo(mx, my); ctx.stroke(); ctx.restore();
    if (!hid) ring(ctx, mx, my, { r:3.5, hi:false });
    ring(ctx, mx, bl, { r:6 });
    var ml = "t = " + num(S.tm, 2) + (M.mode === "int" ? (S.tm === 1 ? " year" : " years") : " h");
    cmath(ctx, ml, clamp(mx, G.L + 80, W - 62), T + 6, { size:12, align:"center" });
    if (document.activeElement === E.canvas) { ctx.save(); ctx.strokeStyle = pen; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, bl, 12, 0, 6.3); ctx.stroke(); ctx.restore(); }
  }
  function describe(){
    var M = model(), f = M.mode === "dbl" ? num(M.A0) + " times 2 to the power t over " + num(M.p) : M.mode === "half" ? num(M.A0) + " times one half to the power t over " + num(M.p) : num(M.A0) + " times " + num(M.f, 6) + " to the power n, where n = " + M.mpy + "t";
    var d = "Graph of A = " + f + (view.s >= 1 ? ", on a log scale, where it is a straight line" : "") + ". ";
    if (hideTarget()) return d + "Two points are marked: (2, 12) and (8, 96). Time marker at t = " + num(S.tm, 2) + ".";
    d += "Target " + num(M.N, 2) + ". ";
    if (M.noSol) d += "The target is not positive, so the curve never reaches it.";
    else if (M.before) d += "The amount passed the target before the start, at t ≈ " + num(M.tc, 2) + ".";
    else if (M.mode === "int") d += tc2Hidden() ? "The smooth guide crosses the target partway through a quarter." : "The smooth guide reaches the target at t ≈ " + num(M.tc, 2) + " years; the balance first reaches it at the end of " + pl(1, M.pn) + " " + M.kc + ", t = " + num(M.kc * M.p, 2) + " years.";
    else d += "The curve reaches the target at t " + (M.exact ? "= " : "≈ ") + num(M.tc, 2) + " hours, " + (M.exact ? "exactly " + M.k + " " + pl(M.k, M.pn) : "between " + Math.floor(M.n) + " and " + (Math.floor(M.n) + 1) + " " + M.pn[1]) + ".";
    return d + " Time marker at t = " + num(S.tm, 2) + ".";
  }
  plot.render = function(){ if (!vw) return; plot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, after:drawGraph, describe:describe() }); };

  // ----- the period strip (same horizontal scale as the graph) -----
  var stripBlocks = [];
  function stripFill(M){ if (M.noSol || M.before || hideTarget() || tc2Hidden() || view.hideCross) return -1; return M.tc; }
  sp.render = function(){
    if (!vw || !S.strip) return;
    E.strip.style.height = (S.rates ? 78 : 56) + "px";
    sp.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:stripDesc(), after:function(ctx, p){
      var M = model(), W = p.W, H = p.H, X = function(t){ return G.L + t / vw.t1 * (W - G.L - G.R); }, bk = blocks(M), fc = stripFill(M), soft = css("--hi-soft"), hi = css("--hi"), dark = MV.effectiveTheme() === "dark";
      var many = bk.list.length > 12, y0 = 20, y1 = 46, rows = [];
      stripBlocks = [];
      bk.list.forEach(function(bb, i){
        var x0 = X(bb.a), x1 = X(bb.b), w = x1 - x0;
        stripBlocks.push({ x0:x0, x1:x1, bb:bb });
        if (fc >= 0) {
          var fr = fc >= bb.b ? 1 : fc > bb.a ? (fc - bb.a) / (bb.b - bb.a) : 0;
          if (fc < bb.b && fc > bb.a) fr *= view.fillT;
          if (fr > 0) { ctx.fillStyle = soft; ctx.fillRect(x0, y0, w * fr, y1 - y0); if (dark) { ctx.strokeStyle = hi; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, w * fr - 1, y1 - y0 - 1); } }
          if (fc > bb.a && fc < bb.b && view.fillT >= 1) {
            var ft = (fc - bb.a) / (bb.b - bb.a), long = num(ft, 3) + " of a" + (bk.yearly ? " year" : (/^[aeiou]/.test(M.pn[0]) ? "n " : " ") + M.pn[0]);
            setTxt(ctx, 11, 700); var lw = ctx.measureText(long).width;
            if (lw + 6 < w) txt(ctx, long, x0 + w / 2, (y0 + y1) / 2, { align:"center", size:11, weight:700 });
            else if (w > 30) txt(ctx, num(ft, 3), x0 + w / 2, (y0 + y1) / 2, { align:"center", size:11, weight:700 });
          }
        }
        ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1; ctx.strokeRect(Math.round(x0) + 0.5, y0 + 0.5, Math.max(1, Math.round(w) - 1), y1 - y0);
        if (!bb.full) return;
        var lab = factorTxt(M, bk.yearly), fs = 12, lw2;
        setTxt(ctx, fs, 700, css("--font-math")); lw2 = ctx.measureText(lab).width;
        if (lw2 > w - 2) { fs = 10; setTxt(ctx, fs, 700, css("--font-math")); lw2 = ctx.measureText(lab).width; }
        var every = lw2 > w - 2 ? Math.ceil((lw2 + 6) / w) : many ? 2 : 1, show = i % every === 0;
        if (show && lw2 < w * every - 2) txt(ctx, lab, x0 + w / 2, 10, { align:"center", size:fs, weight:700, color:css("--p-b"), math:true });
        if (S.rates && i <= view.secN && !(i === view.secN && view.secT < 1) && !tc2Hidden()) {
          var rt = rateTxt(M, bb.a, bb.b); setTxt(ctx, 11, 600);
          var rw = ctx.measureText(rt).width, ev = Math.max(many ? 2 : 1, rw > w - 2 ? Math.ceil((rw + 8) / w) : 1);
          if (i % ev === 0) txt(ctx, rt, x0 + w / 2, 62, { align:"center", size:11, weight:600 });
        }
      });
    } });
  };
  function stripDesc(){
    var M = model(), bk = blocks(M);
    return "Period strip: " + bk.list.length + " blocks, one per " + (bk.yearly ? "year" : M.pn[0]) + ", each " + factorTxt(M, bk.yearly) + ". " + MV.plain(E.sum.innerHTML);
  }
  function sumLine(){
    var M = model();
    if (!S.strip) return "";
    if (hideTarget()) return "";
    if (M.noSol) return "No solution: the amount is always positive.";
    if (M.before) return M.mode === "int" ? "Reached at the start." : "The amount passed the target before the start.";
    if (tc2Hidden() || view.hideCross) return "";
    var dp = M.mode === "int" ? 2 : 3, w = Math.floor(M.n + 1e-9), fr = M.n - w;
    if (M.mode !== "int" && M.exact) return "Exactly " + M.k + " " + pl(M.k, M.pn);
    if (fr < 1e-9) return "Exactly " + w + " " + pl(w, M.pn);
    return w + " whole " + pl(w, M.pn) + " + " + num(fr, dp) + " of a" + (/^[aeiou]/.test(M.pn[0]) ? "n " : " ") + M.pn[0] + " = " + num(M.n, dp) + " " + M.pn[1];
  }
  var tipTimer = null;
  E.strip.addEventListener("pointerdown", function(e){
    var r = E.strip.getBoundingClientRect(), x = e.clientX - r.left, M = model(), hit = stripBlocks.filter(function(q){ return x >= q.x0 && x <= q.x1; })[0];
    if (!hit) return;
    var bk = blocks(M), bb = hit.bb, nm = bk.yearly ? "Year " + (bb.i + 1) : MV.cap(M.pn[0]) + " " + (bb.i + 1);
    E.tip.textContent = nm + ": " + factorTxt(M, bk.yearly) + (bb.full && !tc2Hidden() ? ", average rate " + rateTxt(M, bb.a, bb.b) : "");
    E.tip.hidden = false; E.tip.style.left = clamp((hit.x0 + hit.x1) / 2, 60, r.width - 60) + "px";
    clearTimeout(tipTimer); tipTimer = setTimeout(function(){ E.tip.hidden = true; }, 2600);
  });

  function drawAll(){ plot.render(); sp.render(); }

  // ----- controls -----
  var R = {};
  R.mode = radios($("#tl-mode"), { label:"Mode", options:[{ id:"dbl", t:"Doubling" }, { id:"half", t:"Half-life" }, { id:"int", t:"Interest" }], value:S.mode, onChange:function(v){ S.mode = v; afterModeChange(); } });
  R.view = radios($("#tl-view"), { label:"View", options:[{ id:"ord", t:"Ordinary scale" }, { id:"log", t:"Log scale" }], value:S.view, onChange:function(v){ morph(v, false); } });
  R.setup = radios($("#tl-setup"), { label:"Set-up", cls:"chips", options:[{ id:"off", t:"Free explore" }, { id:"tc1", t:"Challenge 1" }, { id:"tc2", t:"Challenge 2" }, { id:"tc3", t:"Challenge 3" }], value:S.setup, onChange:function(v){ setup(v); } });
  R.comp = radios($("#tl-comp"), { label:"Compounding", cls:"chips", options:[{ id:1, t:"Annually (1)" }, { id:2, t:"Semi-annually (2)" }, { id:4, t:"Quarterly (4)" }, { id:12, t:"Monthly (12)" }], value:S.int.m, onChange:function(v){ S.int.m = +v; S.tm = Math.round(S.tm * S.int.m) / S.int.m; changed(true); } });
  function sl(id, key, mode, label, name, list, fmt, say, note){
    return stepSlider($("#tl-" + id), { id:id, label:label, name:name, n:list.length, idx:idxOf(list, S[mode][key]), fmt:function(i){ return fmt(list[i]); }, say:function(i){ return say(list[i]); }, note:note,
      big:function(){ return Math.max(1, Math.round(list.length / 10)); }, onChange:function(i){ S[mode][key] = list[i]; changed(); } });
  }
  var L = TL.lists;
  R.dA0 = sl("dA0", "A0", "dbl", "Starting amount " + m("A_0"), "starting amount", L.dA0, function(v){ return num(v); }, function(v){ return num(v); });
  R.d = sl("d", "d", "dbl", "Doubling time " + m("d") + ", hours", "doubling time", L.d, function(v){ return num(v, 2) + " h"; }, function(v){ return num(v, 2) + " hours"; }, C.dNote);
  R.hA0 = sl("hA0", "A0", "half", "Starting amount " + m("A_0") + ", mg", "starting amount", L.hA0, function(v){ return num(v) + " mg"; }, function(v){ return num(v) + " milligrams"; });
  R.h = sl("h", "h", "half", "Half-life " + m("h") + ", hours", "half-life", L.h, function(v){ return num(v, 2) + " h"; }, function(v){ return num(v, 2) + " hours"; });
  R.P = sl("P", "P", "int", "Principal " + m("P") + ", $", "principal", L.P, function(v){ return money(v).replace(/\.00$/, ""); }, function(v){ return num(v) + " dollars"; });
  R.r = sl("r", "r", "int", "Annual rate " + m("r"), "annual rate", L.r, function(v){ return num(v, 2) + "%"; }, function(v){ return num(v, 2) + " percent"; });
  R.mk = stepSlider($("#tl-mk"), { id:"mk", label:"Time marker", name:"time marker", n:2, idx:0, color:"--ink",
    fmt:function(i){ var t = i * stepT(); return m("t") + " = " + num(t, 2) + (S.mode === "int" ? (Math.abs(t - 1) < 1e-9 ? " year" : " years") : " h"); }, say:function(i){ return "t = " + num(i * stepT(), 2) + (S.mode === "int" ? " years" : " hours"); },
    big:function(){ return S.mode === "int" ? S.int.m : Math.max(1, Math.round(model().p / 0.25)); }, onChange:function(i){ S.tm = Math.round(i * stepT() * 1e6) / 1e6; changed(); } });

  function syncControls(){
    var lk = S.setup;
    R.mode.set(S.mode); R.mode.lock(lk !== "off" || view.busy); R.view.set(S.view); R.view.lock(view.busy); R.setup.set(S.setup); R.setup.lock(view.busy); R.comp.set(S.int.m);
    $("#tl-sl-dbl").hidden = S.mode !== "dbl"; $("#tl-sl-half").hidden = S.mode !== "half"; $("#tl-sl-int").hidden = S.mode !== "int";
    R.dA0.set(idxOf(L.dA0, S.dbl.A0)); R.d.set(idxOf(L.d, S.dbl.d)); R.hA0.set(idxOf(L.hA0, S.half.A0)); R.h.set(idxOf(L.h, S.half.h)); R.P.set(idxOf(L.P, S.int.P)); R.r.set(idxOf(L.r, S.int.r));
    R.hA0.lock(lk === "tc1"); R.P.lock(lk === "tc2"); R.r.lock(lk === "tc2"); R.comp.lock(lk === "tc2");
    var M = model(), Nlock = lk === "tc2" || lk === "tc3";
    if (document.activeElement !== E.N) E.N.value = hideTarget() ? "" : String(Math.round(M.N * 100) / 100);
    E.N.disabled = Nlock; E.half.disabled = Nlock || M.N / 2 < -1000; E.dbl.disabled = Nlock || M.N * 2 > 100000 || M.N * 2 < -1000;
    E.N.placeholder = hideTarget() ? "hidden" : "";
    var mx = Math.round(vgoal.t1 / stepT()); R.mk.setCount(mx + 1); R.mk.set(Math.round(S.tm / stepT()));
    E.tstrip.setAttribute("aria-pressed", S.strip); E.trates.setAttribute("aria-pressed", S.rates);
    E.wrap.hidden = !S.strip; E.sum.hidden = !S.strip;
    E.lock.hidden = lk === "off";
    E.lock.innerHTML = lk === "tc1" ? "Challenge 1 is loaded: the starting amount is locked at 400 mg." : lk === "tc2" ? "Challenge 2 is loaded: $1000 at 6% per year, compounded quarterly, target $2000. Some rows stay hidden until you meet the challenge or open the worked solution." : lk === "tc3" ? "Challenge 3 is loaded: the target line is hidden and the two points are marked." : "";
  }

  // ----- caption and readout -----
  function fsrcB(M){ return M.mode === "dbl" ? "@b{2}" : M.mode === "half" ? "(@b{{1}/{2}})" : "(@b{" + facS(M) + "})"; }
  function facS(M){ var s = num(M.f, 6); return s; }
  function facExact(M){ return Math.abs(M.ip * 1e4 - Math.round(M.ip * 1e4)) < 1e-6; }
  function capSrc(M){
    if (M.mode === "int") return "A " + (facExact(M) ? "=" : "≈") + " " + num(M.A0) + fsrcB(M) + "^n,  n = " + (M.mpy === 1 ? "t" : M.mpy + "t");
    return "A = " + num(M.A0) + " · " + fsrcB(M) + "^{t/" + num(M.p, 2) + "}";
  }
  function ratioStr(M){
    if (Number.isInteger(M.N) && Number.isInteger(M.A0)) { var g = gcd(M.N, M.A0), a = M.N / g, b = M.A0 / g; return { s:b === 1 ? String(a) : a + "/" + b, frac:b !== 1, exact:true }; }
    return { s:num(Number(M.R.toPrecision(4)), 10), frac:false, exact:near(Number(M.R.toPrecision(4)), M.R, 1e-12) };
  }
  function pw(M, k){
    if (M.mode === "dbl") { var v = k >= 0 ? String(Math.pow(2, k)) : "1/" + Math.pow(2, -k); return { src:"2^{" + k + "}", v:v }; }
    var w = k >= 0 ? (k === 0 ? "1" : "1/" + Math.pow(2, k)) : String(Math.pow(2, -k)); return { src:"(1/2)^{" + k + "}", v:w };
  }
  function readout(){
    var M = model(), rs = ratioStr(M), rows = [], hid = tc2Hidden(), pS = num(M.p, 2), cnt = M.pn;
    var lgR = rs.frac ? "log(" + rs.s + ")" : "log " + rs.s;
    // Model and Equation
    if (M.mode === "int") {
      var ipS = (facExact(M) ? "" : "≈ ") + num(M.ip, 4) + "%";
      rows.push(["Model", m("A " + (facExact(M) ? "=" : "≈") + " " + num(M.A0) + "(" + facS(M) + ")^n") + ", where " + m("n = " + (M.mpy === 1 ? "t" : M.mpy + "t")) + " counts " + cnt[1] + " (" + m("i") + " = " + (M.mpy === 1 ? num(S.int.r, 2) + "% per year" : num(S.int.r, 2) + "% ÷ " + M.mpy + " = " + ipS + " per " + cnt[0]) + ")"]);
      rows.push(["Equation", m(num(M.A0) + "(" + facS(M) + ")^n = " + num(M.N, 2))]);
      rows.push(["Isolate the power", m("(" + facS(M) + ")^n = " + rs.s)]);
    } else {
      var base = M.mode === "dbl" ? "2" : "(1/2)", pow = base + "^{t/" + pS + "}";
      rows.push(["Model", m("A = " + num(M.A0) + " · " + (M.mode === "dbl" ? "2" : "({1}/{2})") + "^{t/" + pS + "}")]);
      rows.push(["Equation", m(num(M.A0) + " · " + pow + " = " + num(M.N, 2))]);
      rows.push(["Isolate the power", m(pow + (rs.exact ? " = " : " ≈ ") + rs.s)]);
    }
    if (M.noSol) {
      var expr = M.mode === "int" ? num(M.A0) + "(" + facS(M) + ")^n" : num(M.A0) + " · " + (M.mode === "dbl" ? "2" : "(1/2)") + "^{t/" + pS + "}";
      rows.push(["Solution", "No solution. " + m(expr) + " is positive for every " + m(M.mode === "int" ? "n" : "t") + ", so it never equals 0 or a negative number."]);
    } else {
      var lgF = M.mode === "dbl" ? "log 2" : M.mode === "half" ? "log(1/2)" : "log " + facS(M);
      // Whole periods
      if (!hid) {
        var wp;
        if (M.mode === "int") wp = M.n <= 1e-9 ? "0 " + cnt[1] + ": the balance starts at or above the target" : Math.abs(M.n - Math.round(M.n)) < 1e-9 ? "Exactly " + Math.round(M.n) + " " + pl(Math.round(M.n), cnt) : "Between " + Math.floor(M.n) + " and " + (Math.floor(M.n) + 1) + " " + cnt[1];
        else if (M.exact) { var e = pw(M, M.k); wp = "Exactly " + M.k + " " + pl(M.k, cnt) + ": " + m(e.src + " = " + e.v); }
        else { var k0 = Math.floor(M.n), a = pw(M, k0), b = pw(M, k0 + 1), op = M.mode === "dbl" ? " < " : " > "; wp = "Between " + k0 + " and " + (k0 + 1) + " " + cnt[1] + ": " + m(a.src + " = " + a.v + op + rs.s + op + b.v + " = " + b.src); }
        rows.push(["Whole periods", wp]);
      }
      // Method
      var meth;
      if (M.mode === "int") meth = "Solve with logs.";
      else if (M.exact) meth = m(pw(M, M.k).v + " = " + pw(M, M.k).src) + ", so a common base gives the answer.";
      else meth = m(rs.s) + " isn’t a whole-number power of " + m(M.mode === "dbl" ? "2" : "1/2") + ", so solve with logs.";
      rows.push(["Method", meth]);
      // Periods
      var lhs = M.mode === "int" ? "n" : "t/" + pS;
      rows.push(["Periods, exact", M.mode !== "int" && M.exact ? m(lhs + " = " + lgR + " / " + lgF + " = " + M.k) : m(lhs + (rs.exact ? " = " : " ≈ ") + lgR + " / " + lgF)]);
      var dp = M.mode === "int" ? 2 : 3, pd = ap(M.n, dp);
      rows.push(["Periods, decimal", pd.eq + " " + pd.s + " " + pl(M.n, cnt)]);
      // Time
      if (!hid) {
        var tm;
        if (M.n === 0 && M.mode !== "int") tm = "The target is the starting amount: " + m("t = 0") + ".";
        else if (M.mode === "int") tm = M.n <= 1e-9 ? "Reached at the start (" + m("n = 0") + ")." : m("n ≈ " + num(M.n, 2)) + ". Interest is added only at the end of a" + (/^[aeiou]/.test(cnt[0]) ? "n " : " ") + cnt[0] + ", so the balance first reaches " + money(M.N).replace(/\.00$/, "") + " at the end of " + cnt[0] + " " + M.kc + ": " + m("t = " + num(M.kc * M.p, 2)) + " years.";
        else if (M.before) { var tb = ap(M.tc, 2); tm = m("t " + tb.eq + " " + tb.s) + " h: the amount passed this value before the start."; }
        else if (M.exact) tm = m("t = " + pS + " × " + M.k + " = " + num(M.tc, 2)) + " h";
        else tm = m("t = " + pS + " × " + lgR + " / " + lgF + " ≈ " + num(M.tc, 2)) + " h";
        if (vgoal.capped && !M.before) tm += " (off the graph to the right)";
        rows.push(["Time", tm]);
      }
    }
    // At the marker
    if (!hid) {
      var at;
      if (M.mode === "int") { var kk = Math.round(S.tm / M.p); at = kk === 0 ? "At the start: " + money(M.A0) : "After " + kk + " " + pl(kk, cnt) + " (" + num(S.tm, 2) + " " + (S.tm === 1 ? "year" : "years") + "): " + money(M.Ak(kk)); }
      else { var av = M.A(S.tm), exA = Math.abs(av - Math.round(av)) < 1e-9; at = "At " + m("t = " + num(S.tm, 2)) + " h: " + m("A " + (exA ? "= " : "≈ ") + f3(av)) + M.au; }
      rows.push(["At the marker", at]);
      rows.push(["Average rate (marked period)", rateRow(M)]);
    }
    if (view.s >= 1) {
      var c0 = LG(M.A0), c1 = M.mode === "int" ? M.mpy * LG(M.f) : LG(M.f) / M.p, sg = c1 < 0 ? " − " : " + ";
      var src = M.mode === "dbl" ? "log A = log " + num(M.A0) + " + t × (log 2)/" + pS : M.mode === "half" ? "log A = log " + num(M.A0) + " + t × (log(1/2))/" + pS : "log A = log " + num(M.A0) + " + " + (M.mpy === 1 ? "" : M.mpy) + "t × log " + facS(M);
      rows.push(["On the log scale", m(src + " ≈ " + c0.toFixed(3).replace("-", MINUS) + sg + Math.abs(c1).toFixed(3) + "t") + ": a straight line"]);
    }
    E.read.innerHTML = MV.readoutHTML(rows);
  }
  function rateRow(M){
    var p = M.p, j = S.tm > 1e-9 && Math.abs(S.tm / p - Math.round(S.tm / p)) < 1e-9 ? Math.round(S.tm / p) : Math.floor(S.tm / p + 1e-9) + 1;
    var a = (j - 1) * p, b = j * p, va = M.Av(a), vb = M.Av(b), r = (vb - va) / p, other = j >= 2 ? j - 1 : j + 1, ro = (M.Av(other * p) - M.Av((other - 1) * p)) / p;
    var rr = ap(r, 2), ro2 = ap(ro, 2), unit = M.mode === "int" ? " per year" : " " + M.ru, rate;
    if (M.mode === "int") rate = "Over " + M.pn[0] + " " + j + " (" + num(a, 2) + " to " + num(b, 2) + " years): (" + money(vb) + " − " + money(va) + ") ÷ " + num(p, 4) + " " + rr.eq + " " + money(r) + unit;
    else rate = "From " + m("t = " + num(a, 2)) + " to " + num(b, 2) + " h: (" + f3(vb) + " − " + f3(va) + ") ÷ " + num(p, 2) + " " + rr.eq + " " + num(r, 2).replace("-", MINUS) + unit;
    var ot = M.mode === "int" ? money(ro) : num(ro, 2);
    return rate + ". " + (j >= 2 ? "The period before: " : "The next period: ") + ro2.eq + " " + ot + unit + ". Ratio: × " + (M.mode === "dbl" ? "2" : M.mode === "half" ? "1/2" : facS(M));
  }
  function paintCap(){ E.cap.innerHTML = m(capSrc(model())); }

  // ----- update -----
  function changed(jump){
    var M = model();
    retarget(jump);
    var max = Math.round(vgoal.t1 / stepT()) * stepT(); if (S.tm > max + 1e-9) S.tm = Math.round(max * 1e6) / 1e6;
    if (S.tm < 0) S.tm = 0;
    if (!view.busy) { view.tri = 0; view.secN = Infinity; view.secT = 1; }
    syncControls(); paintCap(); readout(); E.sum.innerHTML = sumLine(); drawAll();
    api.save(); MV.changed(); void M;
  }
  function afterModeChange(){ S.tm = 0; changed(true); }
  function morph(v, run, done){
    var to = v === "log" ? 1 : 0, from = view.s; S.view = v;
    var dur = run ? 1500 : 900;
    MV.tween({ dur:dur, step:function(t){ view.s = lerp(from, to, t); drawAll(); }, done:function(){ view.s = to; changed(); if (done) done(); } });
  }
  function setTarget(v){
    if (!isFinite(v) || view.busy) return;
    v = clamp(Math.round(v * 100) / 100, -1000, 100000);
    S[S.mode].N = v; changed();
  }
  function setup(id){
    S.setup = id;
    if (id === "tc1") { S.mode = "half"; S.half.A0 = 400; S.half.N = 25; S.tm = 12; }
    else if (id === "tc2") { S.mode = "int"; S.int.P = 1000; S.int.r = 6; S.int.m = 4; S.int.N = 2000; S.tm = 0; }
    else if (id === "tc3") { S.mode = "dbl"; S.dbl.N = 96; S.tm = 0; }
    changed(true);
    if (id === "tc1") { var mx = Math.round(vgoal.t1 / stepT()) * stepT(); S.tm = Math.min(12, mx); changed(); }
    syncChalButtons();
  }

  // ----- events -----
  E.N.addEventListener("input", function(){ var r = MV.parseNum(E.N.value); if (r && r.length === 1 && r[0] >= -1000 && r[0] <= 100000) setTarget(r[0]); });
  E.N.addEventListener("change", function(){ syncControls(); });
  E.half.addEventListener("click", function(){ setTarget(model().N / 2); });
  E.dbl.addEventListener("click", function(){ setTarget(model().N * 2); });
  E.tstrip.addEventListener("click", function(){ S.strip = !S.strip; changed(); });
  E.trates.addEventListener("click", function(){ S.rates = !S.rates; changed(); });
  function tFromPx(px){ var t = (px - G.L) / ((G.W || 1) - G.L - G.R) * vw.t1, s = stepT(); return clamp(Math.round(t / s) * s, 0, Math.round(vgoal.t1 / s) * s); }
  var dragging = false;
  function ptr(e){ var r = E.canvas.getBoundingClientRect(); var t = Math.round(tFromPx(e.clientX - r.left) * 1e6) / 1e6; if (t !== S.tm) { S.tm = t; changed(); } }
  E.canvas.addEventListener("pointerdown", function(e){ if (view.busy || !vw) return; dragging = true; try { E.canvas.setPointerCapture(e.pointerId); } catch (err) {} ptr(e); });
  E.canvas.addEventListener("pointermove", function(e){ if (dragging) ptr(e); });
  E.canvas.addEventListener("pointerup", function(){ dragging = false; });
  E.canvas.addEventListener("pointercancel", function(){ dragging = false; });
  E.canvas.addEventListener("focus", drawAll); E.canvas.addEventListener("blur", drawAll);
  E.canvas.addEventListener("keydown", function(e){
    if (view.busy) return;
    var s = stepT(), M = model(), big = M.mode === "int" ? 1 : M.p, mx = Math.round(vgoal.t1 / s) * s, t = S.tm, k = e.key;
    if (k === "ArrowLeft" || k === "ArrowRight") t += (k === "ArrowRight" ? 1 : -1) * (e.shiftKey ? big : s);
    else if (k === "Home") t = 0; else if (k === "End") t = mx;
    else if (k === "ArrowUp" || k === "ArrowDown") { e.preventDefault(); if (!(S.setup === "tc2" || S.setup === "tc3")) setTarget(M.N * (k === "ArrowUp" ? 2 : 0.5)); return; }
    else return;
    e.preventDefault(); S.tm = Math.round(clamp(Math.round(t / s) * s, 0, mx) * 1e6) / 1e6; changed();
  });

  // "Load this challenge" buttons inside the challenge cards (the toolkit repaints the cards, so re-add them each time)
  function syncChalButtons(){
    ["tc1", "tc2", "tc3"].forEach(function(id){
      var box = document.querySelector('#chal [data-c="' + id + '"] .q-actions'); if (!box) return;
      var b = box.querySelector("[data-load]");
      if (!b) { b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.load = id; b.dataset.k = id + "load"; box.insertBefore(b, box.firstChild); }
      var on = S.setup === id; b.textContent = on ? C.loadedBtn : C.loadBtn; b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  var chalHost = $("#chal");
  if (chalHost) {
    new MutationObserver(function(){ syncChalButtons(); }).observe(chalHost, { childList:true });
    chalHost.addEventListener("click", function(e){
      var b = e.target.closest("[data-load]");
      if (b && view.busy) return;
      if (b) { setup(S.setup === b.dataset.load ? "off" : b.dataset.load); if (S.setup !== "off") { var g = $("#ex-app [data-mv=graph]"); if (g && g.scrollIntoView) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); } return; }
      if (e.target.closest("button")) setTimeout(function(){ changed(); syncChalButtons(); }, 0);
    });
  }
  changed(true);

  // ----- predictions (K9): each supplies its own start and run -----
  function busy(b){ view.busy = b; syncControls(); }
  function glideN(to, dur, done){ var md = S.mode, from = S[md].N; MV.tween({ dur:dur, step:function(t){ S[md].N = Math.round(lerp(from, to, t) * 1000) / 1000; changed(); }, done:function(){ S[md].N = to; changed(); if (done) done(); } }); }
  return {
    predict:{
      start:function(p){
        var st = p.start; S.setup = "off"; S.mode = st.mode; S.view = "ord"; view.s = 0; S.tm = 0; S.strip = true; S.rates = false;
        if (st.mode === "dbl") { S.dbl.A0 = st.A0; S.dbl.d = st.d; S.dbl.N = st.N; } else { S.half.A0 = st.A0; S.half.h = st.h; S.half.N = st.N; }
        view.hideCross = false; view.fillT = 1; view.tri = 0; view.secN = Infinity; view.secT = 1; busy(false); changed(true);
      },
      run:function(p, done){
        busy(true);
        function end(){ busy(false); changed(); done(); }
        if (p.id === "p1") {
          E.dbl.classList.add("x43-flash");
          MV.wait(600, function(){ E.dbl.classList.remove("x43-flash"); glideN(80, 1000, function(){ MV.wait(300, end); }); });
        } else if (p.id === "p2") {
          view.hideCross = true;
          glideN(60, 1000, function(){
            var from = S.tm;
            MV.tween({ dur:600, step:function(t){ S.tm = Math.round(lerp(from, 10.5, t) / 0.25) * 0.25; changed(); }, done:function(){ S.tm = 10.5; changed();
              MV.wait(1400, function(){ view.hideCross = false; view.fillT = 0; changed();
                MV.tween({ dur:700, step:function(t){ view.fillT = t; drawAll(); }, done:function(){ view.fillT = 1; drawAll(); end(); } }); }); } });
          });
        } else if (p.id === "p3") {
          R.view.set("log"); morph("log", true, function(){ end(); });
        } else if (p.id === "p4") {
          S.rates = true; view.secN = 0; view.secT = 0; view.tri = 1; changed();
          MV.tween({ dur:800, ease:LIN, step:function(t){ view.secT = t; drawAll(); }, done:function(){
            view.secN = 1; view.secT = 0; view.tri = 2; drawAll();
            MV.tween({ dur:800, ease:LIN, step:function(t){ view.secT = t; drawAll(); }, done:function(){ view.secN = 1; view.secT = 1; drawAll(); MV.wait(500, function(){ view.secN = Infinity; drawAll(); busy(false); E.sum.innerHTML = sumLine(); done(); }); } });
          } });
        } else end();
      }
    },
    challenge:function(id){
      var c = CH[id], ms = c.msgs, M;
      if (id === "tc1") {
        if (S.mode !== "half" || S.half.A0 !== 400) return { ok:false, msg:ms.setup };
        var h = S.half.h;
        if (Math.abs(12 / h - 4) < 1e-9) return { ok:true };
        if (h === 4) return { ok:false, msg:ms.h4 }; if (h === 6) return { ok:false, msg:ms.h6 }; if (h === 2) return { ok:false, msg:ms.h2 }; if (h === 0.75) return { ok:false, msg:ms.h075 };
        return { ok:false, msg:fill(ms.other, { A:f3(400 * Math.pow(0.5, 12 / h)) }) };
      }
      if (id === "tc2") {
        if (S.setup !== "tc2" || S.mode !== "int") return { ok:false, msg:ms.setup };
        var n = Math.round(S.tm * 4);
        if (n === 47) return { ok:true };
        if (n === 46) return { ok:false, msg:ms.n46 }; if (n === 48) return { ok:false, msg:ms.n48 };
        return { ok:false, msg:n < 47 ? ms.early : ms.late };
      }
      if (id === "tc3") {
        if (S.mode !== "dbl") return { ok:false, msg:ms.setup };
        M = model(); var a2 = M.A(2), a8 = M.A(8), A0 = S.dbl.A0, d = S.dbl.d;
        if (Math.abs(a2 - 12) < 0.05 && Math.abs(a8 - 96) < 0.05) return { ok:true };
        if (A0 === 12 && d === 2) return { ok:false, msg:ms.a12d2 }; if (A0 === 3 && d === 2) return { ok:false, msg:ms.a3d2 };
        if (d === 6) return { ok:false, msg:ms.d6 };
        if (d === 2) return { ok:false, msg:fill(ms.d2, { A2:f3(a2) }) };
        return { ok:false, msg:fill(ms.other, { A2:f3(a2), A8:f3(a8) }) };
      }
      return { ok:false };
    }
  };
}

// ======================================================================================================
// Part 3: equation lab
// ======================================================================================================
// @component N15 moveChooser.lock — scripted move chooser with the NEW "solution lock" option: per equation a list of lines,
//   each step offers 2–3 move cards in a fixed shuffle (one legal), a "Plan first" chip pair, history, hints and a clean
//   count; both sides are graphed (left --pen, right --f3), a locked --hi vertical line marks the true solution, a legal
//   move morphs both graphs (pixel-space interpolation, G10 window zoom; crossfade when the axis switches to u), a wrong
//   move previews the would-be sides dashed in --red with a red ✗ crossing (or "These never cross") and vertical-line
//   previews for "x = c" lines, a u-picture with a shaded "not allowed" region (G6) and a dashed asymptote (G1).
//   lockLab(host, {S, content, graphs, save, onChange}) -> {stats(), missed()}
var l2 = LG(2), l3 = LG(3), l7 = LG(7), l12 = LG(12);
function P2(e){ return Math.pow(2, e); }
var LABG = {
  L1:{ st:[
      { L:function(x){ return Math.pow(4, x + 1); }, R:function(x){ return Math.pow(8, x - 1); }, win:[0, 7, 0, 6000], lock:5 },
      { L:function(x){ return P2(2 * x + 2); }, R:function(x){ return P2(3 * x - 3); }, win:[0, 7, 0, 6000], lock:5 },
      { L:function(x){ return 2 * x + 2; }, R:function(x){ return 3 * x - 3; }, win:[0, 7, -5, 20], lock:5 },
      { L:function(x){ return x; }, R:function(){ return 5; }, win:[0, 7, -1, 8], lock:5 }],
    pv:{ "0b":{ L:function(x){ return P2(2 * x + 1); }, R:function(x){ return P2(3 * x - 1); }, win:[0, 7, 0, 300], cross:2 },
      "0c":{ L:function(x){ return x + 1; }, R:function(x){ return x - 1; }, win:[0, 7, -2, 10], never:true },
      "1b":{ L:function(x){ return (2 * x + 2) * l2; }, R:function(x){ return 3 * x - 3; }, win:[0, 7, -5, 20], cross:(3 + 2 * l2) / (3 - 2 * l2) },
      "2b":{ vl:[-0.2], win:[-1, 7, -1, 8] } } },
  L2:{ st:[
      { L:function(x){ return Math.pow(3, x); }, R:function(){ return 7; }, win:[-1, 3, 0, 12], lock:l7 / l3 },
      { L:function(x){ return x * l3; }, R:function(){ return l7; }, win:[-1, 3, -0.6, 1.6], lock:l7 / l3 },
      { L:function(x){ return x * l3; }, R:function(){ return l7; }, win:[-1, 3, -0.6, 1.6], lock:l7 / l3 },
      { L:function(x){ return x; }, R:function(){ return l7 / l3; }, win:[-1, 3, -1, 3], lock:l7 / l3 }],
    pv:{ "0b":{ vl:[7 / 3], win:[-1, 3, 0, 12] }, "0c":{ vl:[l3 / l7], win:[-1, 3, 0, 12] },
      "1b":{ L:function(x){ return x > 0 ? LG(3 * x) : NaN; }, R:function(){ return l7; }, win:[-1, 3, -0.6, 1.6], cross:7 / 3 },
      "1c":{ L:function(x){ return Math.pow(l3, x); }, R:function(){ return l7; }, win:[-1, 3, -0.2, 2.4], cross:LG(l7) / LG(l3) },
      "2b":{ vl:[LG(7 / 3)], win:[-1, 3, -1, 3] }, "2c":{ vl:[7 / 3], win:[-1, 3, -1, 3] } } },
  L3:{ st:[
      { L:function(x){ return 5 * P2(x - 1) + 4; }, R:function(){ return 64; }, win:[0, 7, 0, 120], lock:1 + l12 / l2 },
      { L:function(x){ return 5 * P2(x - 1); }, R:function(){ return 60; }, win:[0, 7, 0, 120], lock:1 + l12 / l2 },
      { L:function(x){ return P2(x - 1); }, R:function(){ return 12; }, win:[0, 7, 0, 120], lock:1 + l12 / l2 },
      { L:function(x){ return (x - 1) * l2; }, R:function(){ return l12; }, win:[0, 7, -0.5, 2], lock:1 + l12 / l2 },
      { L:function(x){ return x; }, R:function(){ return 1 + l12 / l2; }, win:[0, 7, 0, 7], lock:1 + l12 / l2 }],
    pv:{ "0b":{ L:function(x){ return Math.pow(10, x - 1) + 4; }, R:function(){ return 64; }, win:[0, 7, 0, 120], cross:1 + LG(60) },
      "0c":{ L:function(x){ return LG(5) + (x - 1) * l2 + LG(4); }, R:function(){ return LG(64); }, win:[0, 7, 0, 3.5], cross:1 + (LG(64) - LG(5) - LG(4)) / l2 },
      "1b":{ L:function(x){ return P2(x - 1); }, R:function(){ return 55; }, win:[0, 7, 0, 120], cross:1 + LG(55) / l2 },
      "2b":{ L:function(x){ return x - l2; }, R:function(){ return l12; }, win:[0, 7, -0.5, 2], cross:LG(24) },
      "3b":{ vl:[l12 / l2 - 1], win:[0, 7, 0, 7] } } },
  L4:{ st:[
      { L:function(x){ return P2(x + 1); }, R:function(x){ return Math.pow(3, x); }, win:[-1, 4, 0, 30], lock:l2 / (l3 - l2) },
      { L:function(x){ return (x + 1) * l2; }, R:function(x){ return x * l3; }, win:[-1, 4, -0.6, 2.2], lock:l2 / (l3 - l2) },
      { L:function(){ return l2; }, R:function(x){ return x * (l3 - l2); }, win:[-1, 4, -0.3, 0.8], lock:l2 / (l3 - l2) },
      { L:function(x){ return x; }, R:function(){ return l2 / (l3 - l2); }, win:[-1, 4, -1, 4], lock:l2 / (l3 - l2) }],
    pv:{ "0b":{ L:function(x){ return x + 1; }, R:function(x){ return x; }, win:[-1, 4, -2, 6], never:true },
      "0c":{ L:function(x){ return x * l2 + 1; }, R:function(x){ return x * l3; }, win:[-1, 7, -0.6, 3.6], cross:1 / (l3 - l2) },
      "1b":{ L:function(x){ return x * (l2 - l3); }, R:function(){ return l2; }, win:[-3, 4, -0.8, 0.8], cross:-l2 / (l3 - l2) },
      "2b":{ vl:[l2 / l3 - l2], win:[-1, 4, -1, 4] },
      "2c":{ L:function(){ return 0; }, R:function(){ return l2; }, win:[-1, 4, -0.3, 0.8], never:true } } },
  L5:{ st:[
      { L:function(x){ return Math.pow(4, x) - P2(x); }, R:function(){ return 12; }, win:[-1, 3, -4, 20], lock:2 },
      { u:true, L:function(u){ return u * u - u; }, R:function(){ return 12; }, win:[-5, 7, -4, 26], lock:4, extra:-3 },
      { L:function(x){ return P2(x); }, R:function(){ return 4; }, R2:function(){ return -3; }, asym:true, win:[-1, 3, -4, 8], lock:2 },
      { L:function(x){ return P2(x); }, R:function(){ return 4; }, R2:function(){ return -3; }, asym:true, win:[-1, 3, -4, 8], lock:2, fadeR2:true }],
    pv:{ "0b":{ L:function(x){ return P2(x); }, R:function(){ return 12; }, win:[-1, 4, -4, 20], cross:l12 / l2 },
      "0c":{ L:function(x){ return x * l2; }, R:function(){ return l12; }, win:[-1, 4, -0.5, 1.5], cross:l12 / l2 },
      "1b":{ u:true, vl:[6, -2], win:[-5, 7, -4, 26] },
      "2b":{ L:function(x){ return P2(x); }, R:function(){ return -3; }, win:[-1, 3, -4, 8], never:true, asym:true },
      "2c":{ vl:[4, -3], win:[-4, 5, -4, 8] } } }
};
// spoken label for a move card: "2 to the power 2x plus 2 equals …"
var SUPW = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"−", "⁺":"+", "ⁿ":"n" };
var SUBW = { "₀":"0", "₁":"1", "₂":"2", "₃":"3", "₄":"4", "₅":"5", "₆":"6", "₇":"7", "₈":"8", "₉":"9" };
function speak(html){
  var s = MV.plain(html);
  s = s.replace(/log([₀-₉]+)/g, function(_, d){ return "log base " + d.split("").map(function(c){ return SUBW[c]; }).join(""); });
  s = s.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]+)/g, function(_, d){ return " to the power " + d.split("").map(function(c){ return SUPW[c]; }).join(""); });
  for (var g = 0; g < 4; g++) s = s.replace(/\^\(([^()]*)\)/g, " to the power $1");
  s = s.replace(/−/g, " minus ").replace(/\+/g, " plus ").replace(/=/g, " equals ").replace(/·|×/g, " times ").replace(/÷/g, " divided by ").replace(/ \/ /g, " divided by ").replace(/(\w)\/(\w)/g, "$1 over $2").replace(/≈/g, " is about ");
  return s.replace(/\s+/g, " ").trim();
}

function lockLab(host, o){
  var S = o.S, C = o.content, EQ = C.eqs, GR = o.graphs;
  S.cur = S.cur && EQ.some(function(q){ return q.id === S.cur; }) ? S.cur : EQ[0].id; S.eq = S.eq || {};
  var V = { pv:null, fb:null, flash:0, anim:null, from:null, tip:false };
  host.innerHTML = '<div class="x43-lab"><div class="x43-lab-top"><div id="lab-eqs"></div></div><div class="x43-lab-grid">' +
    '<div class="x43-lab-g"><div class="plot-wrap"><canvas class="plot" id="lab-plot" role="img" aria-label="Equation lab graph"></canvas></div><p class="x43-lab-tag" id="lab-tag" aria-live="polite"></p>' +
    '<p class="tiny muted x43-lab-key"><span class="x43-sw x43-sw-l"></span>left side &nbsp; <span class="x43-sw x43-sw-r"></span>right side &nbsp; <span class="x43-sw x43-sw-k"></span>solution lock &nbsp; <span class="x43-sw x43-sw-w"></span>wrong-move preview</p></div>' +
    '<div class="x43-lab-p"><div class="x43-lab-prompt" id="lab-prompt"></div><div id="lab-plan"></div><ol class="x43-hist" id="lab-hist" aria-label="Earlier lines"></ol>' +
    '<p class="x43-cur" id="lab-cur" aria-live="polite"></p><div class="x43-would" id="lab-would" aria-live="polite"></div><div class="x43-moves" id="lab-moves" role="group" aria-label="Moves"></div>' +
    '<div id="lab-fb" aria-live="polite"></div><div class="q-actions" id="lab-acts"></div><div id="lab-hints"></div><p class="tiny muted x43-score" id="lab-score"></p></div></div></div>';
  var E = { eqs:$("#lab-eqs"), canvas:$("#lab-plot"), tag:$("#lab-tag"), prompt:$("#lab-prompt"), plan:$("#lab-plan"), hist:$("#lab-hist"), cur:$("#lab-cur"), would:$("#lab-would"), moves:$("#lab-moves"), fb:$("#lab-fb"), acts:$("#lab-acts"), hints:$("#lab-hints"), score:$("#lab-score") };
  var plot = new MV.Plot(E.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  function q(id){ return EQ.filter(function(x){ return x.id === (id || S.cur); })[0]; }
  function st(id){ id = id || S.cur; return S.eq[id] || (S.eq[id] = { step:0, plan:null, firstPlan:null, wrong:0, hint:0, everWrong:false, everHint:false, done:false, rec:null, hist:[] }); }
  function last(e){ return e.lines.length - 1; }
  function moves(e, step){ return MV.shuffle(e.steps[step].moves, e.id + "-" + step); }

  // ----- drawing -----
  function W2(win){ return { xmin:win[0], xmax:win[1], ymin:win[2], ymax:win[3] }; }
  function curWin(){
    var e = q(), s = st(), g = GR[e.id], base = g.st[Math.min(s.step, g.st.length - 1)];
    var tgt = V.pv ? (g.pv[V.pv].win || base.win) : base.win;
    if (V.anim && V.anim.cross) return W2(V.anim.t < 0.5 ? V.anim.fromWin : tgt);
    if (V.anim) { var a = V.anim.fromWin, t = V.anim.t; return { xmin:lerp(a[0], tgt[0], t), xmax:lerp(a[1], tgt[1], t), ymin:lerp(a[2], tgt[2], t), ymax:lerp(a[3], tgt[3], t) }; }
    return W2(tgt);
  }
  function drawSides(ctx, p, X, Yw, f, col, o){
    o = o || {}; var W = p.W, N = Math.max(200, Math.round(W)), pen = false, lim = p.H * 3;
    ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha; ctx.strokeStyle = col; ctx.lineWidth = o.width || 3; ctx.lineJoin = "round"; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath();
    for (var i = 0; i <= N; i++) {
      var px = W * i / N, x = p.xOf(px), y = Yw(f, x);
      if (!isFinite(y)) { pen = false; continue; }
      y = clamp(y, -lim, lim);
      if (!pen) { ctx.moveTo(px, y); pen = true; } else ctx.lineTo(px, y);
    }
    ctx.stroke(); ctx.restore();
  }
  plot.render = function(){
    var e = q(), s = st(), g = GR[e.id], stI = Math.min(s.step, g.st.length - 1), cur = g.st[stI], win = curWin(), A = V.anim;
    var pen = css("--pen"), f3c = css("--f3"), red = css("--red"), hi = css("--hi"), ink2 = css("--ink-2"), soft = css("--hi-soft");
    var old = !!(A && A.cross && A.t < 0.5), shown = old ? A.from : cur, ca = A && A.cross ? (old ? 1 - A.t * 2 : (A.t - 0.5) * 2) : 1;
    var pvs = V.pv ? g.pv[V.pv] : null, uPic = pvs && pvs.u != null ? pvs.u : shown.u;
    plot.draw({ view:win, xLabel:uPic ? "u" : "x", describe:labDesc(e, s, cur, pvs), after:function(ctx, p){
      var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); };
      var Yw = function(f, x){ return Y(f(x)); };
      // u-picture: shade u ≤ 0 (G6)
      if (shown.u) {
        var x0 = X(win.xmin), x1 = X(0);
        ctx.save(); ctx.globalAlpha = ca; ctx.fillStyle = soft; ctx.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), p.H); ctx.restore();
        cmath(ctx, MV.plain(C.uNote).replace(/\^\(x\)/g, "^x"), X(win.xmin) + 6, 16, { size:12, alpha:ca });
      }
      // asymptote y = 0 (G1)
      if (shown.asym || (pvs && pvs.asym)) { ctx.save(); ctx.globalAlpha = ca; ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(p.W, Y(0)); ctx.stroke(); ctx.restore(); cmath(ctx, "y = 0", p.W - 8, Y(0) - 10, { size:12, align:"right", color:ink2, alpha:ca }); }
      // the solution lock
      var lockX = shown.lock, LX = X(lockX);
      ctx.save(); ctx.strokeStyle = hi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(LX, 0); ctx.lineTo(LX, p.H); ctx.stroke(); ctx.restore();
      txt(ctx, s.done && !A ? MV.plain(e.sol) : C.lockLabel, clamp(LX, 80, p.W - 80), p.H - 14, { align:"center", size:12, weight:700, bg:true, math:s.done && !A });
      var dim = pvs ? 0.35 : 1;
      if (A && A.morph && !A.cross) {
        // legal move: each point slides from its old pixel height to its new one (the crossing stays on the lock)
        var fw = A.fromWin, to = g.st[stI].win;
        var Yfrom = function(y){ return p.H - (y - fw[2]) / (fw[3] - fw[2]) * p.H; }, Yto = function(y){ return p.H - (y - to[2]) / (to[3] - to[2]) * p.H; };
        var mk = function(f0, f1){ return function(f, x){ return lerp(Yfrom(f0(x)), Yto(f1(x)), A.t); }; };
        if (cur.R2) drawSides(ctx, p, X, mk(A.from.R2 || A.from.R, cur.R2), null, f3c, { width:2.6 });
        drawSides(ctx, p, X, mk(A.from.R, cur.R), null, f3c, { width:2.8 });
        drawSides(ctx, p, X, mk(A.from.L, cur.L), null, pen, { width:3 });
        var yc = lerp(Yfrom(A.from.L(lockX)), Yto(cur.L(lockX)), A.t); ring(ctx, LX, yc, { r:5 });
      } else {
        if (shown.R2) drawSides(ctx, p, X, Yw, shown.R2, f3c, { width:2.6, alpha:ca * dim * (shown.fadeR2 ? 0.45 : 1) });
        drawSides(ctx, p, X, Yw, shown.R, f3c, { width:2.8, alpha:ca * dim });
        drawSides(ctx, p, X, Yw, shown.L, pen, { width:3, alpha:ca * dim });
        if (shown.extra != null) { var ex = X(shown.extra), ey = Y(shown.L(shown.extra)); ring(ctx, ex, ey, { r:5, open:true, hi:false, color:ink2, alpha:ca * dim }); txt(ctx, "u = " + MINUS + "3", ex + 8, ey + 14, { size:12, bg:true, alpha:ca * dim, math:true }); }
        ring(ctx, LX, Y(shown.L(lockX)), { r:5, alpha:ca * dim });
        var lab = function(f, col, nm){ var xe = win.xmax - (win.xmax - win.xmin) * 0.03, ye = Y(f(xe)); if (ye > 10 && ye < p.H - 30) txt(ctx, nm, X(xe) - 2, ye + (nm === "left" ? -10 : 12), { align:"right", size:11, weight:700, color:col, bg:true, alpha:ca * dim }); };
        if (!A) { lab(shown.L, pen, "left"); lab(shown.R, f3c, "right"); }
      }
      // wrong-move preview
      if (pvs) {
        var pa = V.fade != null ? V.fade : 1;
        if (pvs.vl) pvs.vl.forEach(function(xv){ var vx = X(xv); ctx.save(); ctx.globalAlpha = pa; ctx.strokeStyle = red; ctx.lineWidth = 2.4; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(vx, 0); ctx.lineTo(vx, p.H); ctx.stroke(); ctx.restore(); xMark(ctx, vx, Y(0), red, pa); txt(ctx, (uPic ? "u = " : "x ≈ ") + num(xv, 2), vx + 8, 30, { size:12, weight:700, color:red, bg:true, alpha:pa, math:true }); });
        if (pvs.L) {
          drawSides(ctx, p, X, Yw, pvs.R, red, { width:2.4, dash:[7, 5], alpha:pa });
          drawSides(ctx, p, X, Yw, pvs.L, red, { width:2.4, dash:[3, 4], alpha:pa });
          if (pvs.never) txt(ctx, C.never, p.W / 2, 26, { align:"center", size:13, weight:700, color:red, bg:true, alpha:pa });
          else if (pvs.cross != null) { var cx = X(pvs.cross), cy = Y(pvs.L(pvs.cross)); xMark(ctx, cx, cy, red, pa); txt(ctx, (uPic ? "u ≈ " : "x ≈ ") + num(pvs.cross, 2), cx + 9, cy - 14, { size:12, weight:700, color:red, bg:true, alpha:pa, math:true }); }
        }
      }
      // "✓ Same solution" flash on the lock
      if (V.flash) txt(ctx, C.same, clamp(LX, 80, p.W - 80), 18, { align:"center", size:13, weight:700, color:css("--green"), bg:true });
    } });
  };
  function xMark(ctx, x, y, col, a){ ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6); ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6); ctx.stroke(); ctx.restore(); }
  function labDesc(e, s, cur, pvs){
    var line = MV.plain(e.lines[s.step]), sol = num(cur.lock, 2);
    var d = "Equation lab. Current line " + line + ". " + (cur.u ? "In the u-picture, left side u squared minus u, right side 12; the region u ≤ 0 is shaded because u = 2^x is never 0 or negative. They cross at u = 4, on the solution line." : "Left side in blue, right side in teal. They cross at x ≈ " + sol + ", on the solution line.");
    if (pvs) d += " A dashed red preview shows the wrong move: " + (pvs.never ? "these never cross." : pvs.cross != null ? "it crosses at x ≈ " + num(pvs.cross, 2) + ", off the solution line." : "x ≈ " + pvs.vl.map(function(v){ return num(v, 2); }).join(" and ") + ", off the solution line.");
    return d;
  }

  // ----- panel -----
  function paint(){
    var e = q(), s = st(), busy = !!V.anim;
    MV.keepFocus(E.eqs, function(){ E.eqs.innerHTML = '<div class="chips x43-eqchips" role="group" aria-label="Equation">' + EQ.map(function(x, i){ var t = st(x.id); return '<button type="button" class="fchip" data-eq="' + x.id + '" data-k="labeq' + x.id + '" aria-pressed="' + (S.cur === x.id) + '"' + (busy ? " disabled" : "") + ">" + (t.done ? "✓ " : "") + "<span class=\"x43-eqn\">" + (i + 1) + (x.stretch ? " ★" : "") + "</span> " + MV.md(x.prompt.replace(/^Solve /, "").replace(/\.$/, "")) + "</button>"; }).join("") + "</div>"; });
    E.prompt.innerHTML = '<p class="x43-lab-q">' + e.prompt + (e.stretch ? ' <span class="tag">Stretch</span>' : "") + "</p>" + MV.usesHTML(e.use);
    MV.keepFocus(E.plan, function(){
      var locked = s.firstPlan != null && !s.done && s.step > 0 || busy;
      E.plan.innerHTML = '<div class="x43-planrow"><span class="rg-lab">' + C.planQ + '</span><span class="chips" role="group" aria-label="' + MV.esc(C.planQ) + '">' + ["base", "logs"].map(function(k){ return '<button type="button" class="chip' + (s.plan === k ? " on" : "") + '" data-plan="' + k + '" data-k="labplan' + k + '" aria-pressed="' + (s.plan === k) + '"' + (locked || s.done ? " disabled" : "") + ">" + C.tools[k] + "</button>"; }).join("") + "</span></div>" + (!s.plan ? '<p class="tiny muted">' + C.planNote + "</p>" : "");
    });
    E.hist.innerHTML = s.hist.map(function(l){ return "<li>" + l + "</li>"; }).join("");
    E.cur.innerHTML = e.lines[s.step];
    var pm = V.pv ? e.steps[s.step].moves.filter(function(x){ return x.id === V.pv.slice(1); })[0] : null;
    E.would.innerHTML = pm ? '<p class="x43-would-l">' + pm.line + "</p>" + (pm.note ? '<p class="tiny x43-would-n">' + pm.note + "</p>" : "") : "";
    MV.keepFocus(E.moves, function(){
      if (s.done) { E.moves.innerHTML = ""; return; }
      E.moves.innerHTML = moves(e, s.step).map(function(mv){ return '<button type="button" class="btn x43-mv" data-mv="' + mv.id + '" data-k="labmv' + e.id + s.step + mv.id + '" aria-label="' + MV.esc(speak(mv.t)) + '"' + (!s.plan || V.pv || busy ? " disabled" : "") + "><span>" + mv.t + "</span></button>"; }).join("");
    });
    E.fb.innerHTML = s.done ? doneHTML(e, s) : V.fb ? MV.fbHTML(V.fb.kind, V.fb.html) : "";
    MV.keepFocus(E.acts, function(){
      E.acts.innerHTML = (V.pv ? '<button type="button" class="btn primary sm" data-act="again" data-k="labagain">Try another move</button>' : "") + (s.done ? "" : MV.hintBtn("labh" + e.id, s.hint)) + '<button type="button" class="btn ghost sm" data-act="reset" data-k="labreset"' + (busy ? " disabled" : "") + ">Start this equation over</button>";
    });
    E.hints.innerHTML = s.done ? "" : MV.hintsHTML(e.hints, s.hint);
    var t = totals(); E.score.innerHTML = "Clean: " + t.clean + "/" + EQ.length + " · Planned right: " + t.plan + "/" + EQ.length + ". An equation is clean when you finish it with no wrong moves and without the worked solution.";
    plot.render();
  }
  function doneHTML(e, s){
    var right = s.firstPlan === e.tool, used = e.used;
    return '<div class="fb good" role="status"><p><strong>✓ Solved.</strong> ' + e.finish + "</p><p>You planned: " + C.tools[s.firstPlan || s.plan] + ". The final step used: " + used + " " + (right ? "✓" : "✗") + "</p>" + (s.rec && s.rec.clean ? "<p>Clean: no wrong moves and no worked solution.</p>" : "") + "</div>";
  }
  function totals(){ var c = 0, p = 0, d = 0; EQ.forEach(function(x){ var r = st(x.id).rec; if (r) { d++; if (r.clean) c++; if (r.plan) p++; } }); return { clean:c, plan:p, done:d }; }

  // ----- moves -----
  function legal(e, s, mv){
    var g = GR[e.id], from = g.st[Math.min(s.step, g.st.length - 1)], fromWin = from.win.slice();
    s.hist.push(e.lines[s.step]); s.step++; V.fb = null; V.pv = null;
    var tag = e.steps[s.step - 1].tag;
    E.tag.innerHTML = C.same + (tag ? ". " + tag : ".");
    if (s.step === last(e)) { s.done = true; if (!s.rec) s.rec = { clean:!s.everWrong && !s.everHint, plan:s.firstPlan === e.tool }; }
    o.save(); o.onChange();
    var to = g.st[Math.min(s.step, g.st.length - 1)], cross = !!from.u !== !!to.u;
    V.anim = { from:from, fromWin:fromWin, t:0, cross:cross, morph:true }; V.flash = 1;
    paint();
    MV.tween({ dur:800, ease:MV.ease, step:function(t){ if (V.anim) { V.anim.t = t; plot.render(); } }, done:function(){ V.anim = null; paint(); if (st().done) MV.focusFb(host); else focusMoves(); } });
    setTimeout(function(){ V.flash = 0; plot.render(); }, 1600);
  }
  function wrong(e, s, mv){
    s.wrong++; s.everWrong = true; V.pv = s.step + mv.id; V.fade = 1; V.fb = { kind:"bad", html:"<strong>✗ Not quite.</strong> " + mv.fb };
    E.tag.innerHTML = "";
    var g = GR[e.id], cur = g.st[Math.min(s.step, g.st.length - 1)];
    V.anim = null; o.save(); o.onChange();
    var fromWin = cur.win, pv = g.pv[V.pv];
    if (pv && pv.win && pv.win.join() !== fromWin.join()) { V.anim = { from:cur, fromWin:fromWin.slice(), t:0, cross:false, pvZoom:true }; }
    paint();
    if (V.anim) MV.tween({ dur:500, step:function(t){ if (V.anim) { V.anim.t = t; plot.render(); } }, done:function(){ V.anim = null; paint(); } });
    MV.focusFb(host);
    var fbBox = E.fb.querySelector(".fb"); if (fbBox && fbBox.scrollIntoView) fbBox.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }
  function again(){
    var e = q(), s = st(), g = GR[e.id], pv = g.pv[V.pv], cur = g.st[Math.min(s.step, g.st.length - 1)], pw = pv && pv.win ? pv.win.slice() : cur.win.slice();
    MV.tween({ dur:300, step:function(t){ V.fade = 1 - t; plot.render(); }, done:function(){
      V.pv = null; V.fade = 1; V.fb = null;
      if (pw.join() !== cur.win.join()) { V.anim = { from:cur, fromWin:pw, t:0, cross:false }; paint(); MV.tween({ dur:450, step:function(t){ if (V.anim) { V.anim.t = t; plot.render(); } }, done:function(){ V.anim = null; paint(); focusMoves(); } }); }
      else { paint(); focusMoves(); }
    } });
  }
  function focusMoves(){ var b = E.moves.querySelector("button:not([disabled])"); if (b) b.focus({ preventScroll:true }); }
  host.addEventListener("click", function(ev){
    var b = ev.target.closest("button"); if (!b || b.disabled) return;
    var e = q(), s = st(), d = b.dataset;
    if (d.eq) { if (d.eq !== S.cur) { S.cur = d.eq; V.pv = null; V.fb = null; E.tag.innerHTML = ""; o.save(); paint(); } return; }
    if (d.plan) { if (s.step > 0 && s.firstPlan != null && !s.done) return; s.plan = d.plan; o.save(); paint(); return; }
    if (d.mv) {
      if (!s.plan || V.pv || V.anim) return;
      if (s.firstPlan == null) s.firstPlan = s.plan;
      var mv = e.steps[s.step].moves.filter(function(x){ return x.id === d.mv; })[0];
      if (MV.ok(mv)) legal(e, s, mv); else wrong(e, s, mv);
      return;
    }
    if (d.act === "again") { again(); return; }
    if (d.act === "hint") { s.hint = Math.min(3, s.hint + 1); if (s.hint >= 3) s.everHint = true; o.save(); o.onChange(); paint(); return; }
    if (d.act === "reset") { var keep = { rec:s.rec, everWrong:s.everWrong, everHint:s.everHint, firstPlan:s.rec ? s.firstPlan : s.firstPlan }; S.eq[e.id] = null; var n = st(e.id); n.rec = keep.rec; n.everWrong = keep.everWrong; n.everHint = keep.everHint; n.firstPlan = keep.firstPlan; n.plan = keep.firstPlan; V.pv = null; V.fb = null; E.tag.innerHTML = ""; o.save(); o.onChange(); paint(); return; }
  });
  paint();
  return {
    stats:function(){ var t = totals(); return { first:t.clean, total:EQ.length, done:t.done, line:"Equation lab: " + t.clean + "/" + EQ.length + " clean; planned the finishing tool right: " + t.plan + "/" + EQ.length + (t.done < EQ.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; EQ.forEach(function(x){ var s = st(x.id); if (s.everWrong || s.everHint) g = g.concat(MV.goalIdx(x.goal)); }); return g; }
  };
}

// ======================================================================================================
// Practice 2: model it, then solve it (number entry, N4, with known wrong values matched after rounding)
// ======================================================================================================
// @component N4 roundBoxes — one box per item, units shown after the box, an absolute tolerance per item (abs), and known
//   wrong answers matched exactly or after rounding the entry to `round` decimal places; "%", "$" and unit words are ignored
function modelIt(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  function parse(raw){ var s = String(raw || "").replace(/[%$]/g, "").replace(/[a-z]+/gi, " ").trim(); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null; }
  function rnd(v, dp){ var k = Math.pow(10, dp); return Math.round(v * k) / k; }
  function judge(it, raw){
    var v = parse(raw), ans = MV.ans(it); if (v == null) return { bad:true };
    if (it.abs != null ? Math.abs(v - ans) <= it.abs + 1e-9 : near(v, ans, 1e-6)) return { ok:true };
    var w = (it.wrong || []).filter(function(x){ return x.round != null ? Math.abs(rnd(v, x.round) - x.match) < 1e-9 : near(v, x.match, 1e-6); })[0];
    return { ok:false, fb:w ? w.fb : null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-mi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div></div>";
        h += '<div class="numrow"><label for="mi-' + it.id + '">Your answer:</label><input class="numin x43-mi" id="mi-' + it.id + '" data-min="' + it.id + '" type="text" inputmode="' + (it.keypad || "decimal") + '" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="x43-unit">' + it.unit + "</span></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + num(MV.ans(it), 2) + (it.unit === "%" ? "" : " ") + it.unit + ".</strong> " + it.hints[2] + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.min; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.min) { var b = host.querySelector('[data-k="' + e.target.dataset.min + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-mi]"); if (!box) return;
    var it = a.items.filter(function(x){ return x.id === box.dataset.mi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = "Enter a number, such as 12, −3.5 or 3/4."; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb || a.fallback); }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-mi="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ======================================================================================================
// Performance task: Plan a dose
// ======================================================================================================
var HL = [2, 3, 4, 6, 8, 12];
function doseA(D, h, t){ return D * Math.pow(0.5, t / h); }
function doseChecks(D, h){
  var c1 = D % 50 === 0 && D >= 50 && D <= 800;
  var e12 = 12 / h, c2 = Number.isInteger(e12) ? D >= 100 * Math.pow(2, e12) : D * D >= 10000 * Math.pow(2, 24 / h);
  var c3 = D < 50 * Math.pow(2, 24 / h);
  return [c1, c2, c3];
}
function amt(v){ return Math.abs(v * 100 - Math.round(v * 100)) < 1e-9 ? num(v, 2) : f3(v); }
var task = (function(){
  var api, plot, T;
  function S(){ return api ? api.S : {}; }
  function read(){
    var s = S(), r = MV.parseNum(String(s.D == null ? "" : s.D).replace(/mg/i, "")), D = r && r.length === 1 ? r[0] : NaN, h = +s.h;
    return { D:D, h:h, valid:isFinite(D) && Number.isInteger(D) && D % 50 === 0 && D >= 50 && D <= 1600 && HL.indexOf(h) >= 0 };
  }
  function passedHs(){ var out = {}; (S().passed || []).forEach(function(k){ out[k.split("|")[1]] = 1; }); return out; }
  function checks(d){
    if (!d.valid) return [false, false, false, false];
    var c = doseChecks(d.D, d.h), hs = passedHs();
    if (c[0] && c[1] && c[2]) hs[String(d.h)] = 1;
    return c.concat([Object.keys(hs).length >= 2]);
  }
  function draw(){
    var d = read(), ymax = Math.max(isFinite(d.D) ? d.D : 0, 120) * 1.1, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), green = css("--green"), red = css("--red");
    var c = d.valid ? doseChecks(d.D, d.h) : [false, false, false];
    plot.draw({ view:{ xmin:-1.5, xmax:31, ymin:-ymax * 0.06, ymax:ymax }, xTicks:{ step:6 }, xLabel:"t (h)",
      curves:d.valid ? [{ f:function(t){ return t < 0 ? NaN : doseA(d.D, d.h, t); }, color:pen, width:3, domain:[0, 31] }] : [],
      describe:d.valid ? "Decay curve A = " + d.D + " times one half to the power t over " + d.h + ". At 12 hours " + amt(doseA(d.D, d.h, 12)) + " mg; at 24 hours " + amt(doseA(d.D, d.h, 24)) + " mg." : "Choose a dose and a half-life to see the curve.",
      after:function(ctx, p){
        [[100, "works above here"], [50, "50 mg"]].forEach(function(L){ var y = p.Y(L[0]); ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(p.X(0), y); ctx.lineTo(p.W, y); ctx.stroke(); ctx.restore(); txt(ctx, L[1], p.W - 6, y - 10, { align:"right", size:12, bg:true, color:ink2 }); });
        [12, 24].forEach(function(t){ var x = p.X(t); ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.2; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, p.Y(0)); ctx.stroke(); ctx.restore(); });
        if (!d.valid) return;
        var t100 = d.D > 100 ? d.h * LG(d.D / 100) / l2 : d.D === 100 ? 0 : null;
        if (t100 != null && t100 <= 30) { ring(ctx, p.X(t100), p.Y(100), { r:5 }); cmath(ctx, "t ≈ " + num(t100, 2), p.X(t100) + 8, p.Y(100) + 16, { size:12 }); }
        [[12, c[1]], [24, c[2]]].forEach(function(q){ var v = doseA(d.D, d.h, q[0]), x = p.X(q[0]), y = p.Y(v);
          ring(ctx, x, y, { r:5, hi:false, color:q[1] ? green : red });
          cmath(ctx, "A(" + q[0] + ") = " + amt(v) + " mg " + (q[1] ? "✓" : "✗"), x + (q[0] === 24 ? -8 : 8), y - 14, { size:12, align:q[0] === 24 ? "right" : "left", color:q[1] ? green : red }); });
      } });
    var cap = $("#dose-fall");
    if (cap) cap.innerHTML = !d.valid ? "" : d.D > 100 ? "Falls to 100 mg at " + m("t = " + d.h + " × log(" + d.D + "/100) / log 2 ≈ " + (d.h * LG(d.D / 100) / l2).toFixed(2)) + " h" : d.D === 100 ? "Starts at exactly 100 mg." : "Starts below 100 mg, so it never works.";
  }
  function caption(){ var d = read(), e = $("#dose-cap"); if (e) e.innerHTML = m("A = " + (isFinite(d.D) ? d.D : "D") + " · (@b{{1}/{2}})^{t/" + (HL.indexOf(d.h) >= 0 ? d.h : "h") + "}"); }
  function paintChecks(){ var e = $("#dose-n"); if (e) e.textContent = "Checks used: " + (S().checks || 0); }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      if (a.S.D == null) a.S.D = "200"; if (a.S.h == null) a.S.h = "4"; a.S.checks = a.S.checks || 0; a.S.passed = a.S.passed || [];
      inp.innerHTML = '<p class="eq-cap x43-dcap" id="dose-cap" aria-live="polite"></p><div class="x43-dose"><div class="x43-dfield"><label for="dose-D">Dose <i>D</i> (mg)</label><div class="x43-drow"><button type="button" class="btn ghost wt-pm" data-dd="-50" aria-label="Decrease the dose by 50 mg">' + MINUS + '</button><input id="dose-D" class="numin short" type="text" inputmode="numeric" autocomplete="off" value="' + MV.esc(a.S.D) + '"><button type="button" class="btn ghost wt-pm" data-dd="50" aria-label="Increase the dose by 50 mg">+</button></div></div>' +
        '<div class="x43-dfield"><label for="dose-h">Half-life <i>h</i> (hours)</label><select id="dose-h" class="x43-sel">' + HL.map(function(h){ return '<option value="' + h + '"' + (String(h) === String(a.S.h) ? " selected" : "") + ">" + h + "</option>"; }).join("") + "</select></div></div>";
      pv.innerHTML = '<canvas class="plot" id="dose-plot" role="img" aria-label="Dose preview"></canvas><p class="tiny x43-dfall" id="dose-fall" aria-live="polite"></p>';
      plot = new MV.Plot($("#dose-plot"), { xmin:0, xmax:30, ymin:0, ymax:500 }); plot.render = draw;
      var chk = $("#task-check"); if (chk) chk.insertAdjacentHTML("afterend", '<span class="tiny muted x43-checks" id="dose-n" aria-live="polite"></span>');
      function upd(){ caption(); draw(); a.update(); }
      inp.addEventListener("input", function(e){ if (e.target.id === "dose-D") { a.S.D = e.target.value; a.save(); upd(); } });
      inp.addEventListener("change", function(e){ if (e.target.id === "dose-h") { a.S.h = e.target.value; a.save(); upd(); } });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-dd]"); if (!b) return; var d = read(), D = isFinite(d.D) ? Math.round(d.D / 50) * 50 : 400; D = clamp(D + +b.dataset.dd, 50, 1600); a.S.D = String(D); $("#dose-D").value = a.S.D; a.save(); upd(); });
      if (chk) chk.addEventListener("click", function(){
        var d = read(); a.S.checks = (a.S.checks || 0) + 1;
        if (d.valid) { var c = doseChecks(d.D, d.h), k = d.D + "|" + d.h; if (c[0] && c[1] && c[2] && a.S.passed.indexOf(k) < 0) a.S.passed.push(k); }
        a.save(); paintChecks(); a.update();
        setTimeout(function(){
          var fb = $("#task-fb"); if (!fb || !d.valid) return;
          var c2 = checks(d), hs = passedHs();
          if (c2[0] && c2[1] && c2[2] && !c2[3]) fb.innerHTML = '<div class="fb good" role="status"><p><strong>✓ ' + T.firstWorks + "</strong></p><p>" + T.tips[3] + "</p></div>";
          if (hs["4"] && hs["6"] && hs["8"] && c2.every(Boolean)) { var g = fb.querySelector(".fb"); if (g && !/x43-all3/.test(g.innerHTML)) g.insertAdjacentHTML("beforeend", '<p class="x43-all3">' + T.allThree + "</p>"); }
          MV.paintSummary();
        }, 0);
      });
      caption(); paintChecks(); draw();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Choose a dose from 50 to 1600 mg, in steps of 50, and a half-life from the list."; },
    checks:checks,
    tips:function(d, c){
      var out = [];
      if (!c[0]) out.push(T.tips[0]);
      if (!c[1]) out.push(fill(T.tips[1], { A12:amt(doseA(d.D, d.h, 12)) }));
      if (!c[2]) out.push(fill(T.tips[2], { A24:amt(doseA(d.D, d.h, 24)) }));
      if (c[0] && c[1] && c[2] && !c[3]) out.push(T.tips[3]);
      return out;
    },
    key:function(d){ return d.D + "|" + d.h; },
    label:function(k){ var p = k.split("|"); return p[0] + " mg with " + m("h") + " = " + p[1] + " h"; },
    text:function(k){ var p = k.split("|"); return p[0] + " mg with h = " + p[1] + " h"; },
    summary:function(ts){
      var s = ts.app || {}, plans = (s.passed || []).map(function(k){ var p = k.split("|"); return p[0] + " mg with h = " + p[1] + " h"; });
      return ["Plan a dose: " + (ts.found && ts.found.length ? "solved (" + plans.join("; ") + ")" : "not solved yet") + "; checks used: " + (s.checks || 0)];
    }
  };
})();

// ---------- registration ----------
var LAB = null;
MV.module({
  hero:hero,
  explore:explore,
  part3:function(host, api){
    LAB = lockLab(host, { S:api.S, content:api.content.lab, graphs:LABG, save:api.save, onChange:function(){ if (MV.paintSummary) MV.paintSummary(); } });
    MV.ACTS.lab = { a:{ id:"lab" }, stats:LAB.stats, missed:LAB.missed };
    return LAB;
  },
  activities:{ modelit:modelIt },
  task:task
});
})();
