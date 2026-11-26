// MCV4U 03 Rates of Change: hero storyboard, motion lab (Explore: V9 motion track + a V4-style secant window), rates in the
// real world (Part 3: flip cards, three contexts stepper, N29 sentences), rate problems (Practice 2) and "Design a launch".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
function m(s){ return MV.m(s); }
function md(h){ return MV.md(h); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function nsrc(v){ return String(r9(v)); }                       // number as m() source (a hyphen becomes a true minus)
function ntx(v){ return num(v, 4); }                              // number as text (true minus)
function close(a, b){ return Math.abs(a - b) < 1e-9; }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
// polynomial in v from coefficients c[k] of v^k: [12, 6, 1] -> "12 + 6h + h^2"
function polySrc(c, v){
  v = v || "h"; var out = "";
  c.forEach(function(x, k){
    x = r9(x); if (!x) return;
    var ax = Math.abs(x), body = k === 0 ? nsrc(ax) : (ax === 1 ? "" : nsrc(ax)) + v + (k > 1 ? "^" + k : "");
    out += out ? (x < 0 ? " - " : " + ") + body : (x < 0 ? "-" : "") + body;
  });
  return out || "0";
}

// @component exactDec (adapted from MHF4U 09 / MCV4U 02) — exact rationals (BigInt) for values and secant slopes, printed as
// exact decimals (−10.05, not −10.049999…); of(v) reads any decimal up to 12 places exactly; decS() adds "≈ " when it had to round.
var XQ = (function(){
  var B = window.BigInt, Z = B(0), ONE = B(1), TWO = B(2), FIVE = B(5), TEN = B(10);
  function abs(a){ return a < Z ? -a : a; }
  function gcd(a, b){ a = abs(a); b = abs(b); while (b !== Z) { var t = a % b; a = b; b = t; } return a; }
  function mk(n, d){ if (d < Z) { n = -n; d = -d; } var g = gcd(n, d); if (g > ONE) { n = n / g; d = d / g; } return { n:n, d:d }; }
  function of(v){
    if (v && typeof v === "object") return v;
    var s = Number(v).toFixed(12), neg = s.charAt(0) === "-"; if (neg) s = s.slice(1);
    var p = s.split("."), n = B(p[0] + p[1]), d = B("1" + p[1].replace(/\d/g, "0"));
    return mk(neg ? -n : n, d);
  }
  function add(a, b){ a = of(a); b = of(b); return mk(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b){ a = of(a); b = of(b); return mk(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b){ a = of(a); b = of(b); return mk(a.n * b.n, a.d * b.d); }
  function div(a, b){ a = of(a); b = of(b); return b.n === Z ? null : mk(a.n * b.d, a.d * b.n); }
  function toNum(a){ a = of(a); return Number(a.n) / Number(a.d); }
  function pow10(k){ var p = ONE; while (k-- > 0) p = p * TEN; return p; }
  function dec(a, maxDp, rDp){
    a = of(a); maxDp = maxDp == null ? 9 : maxDp; rDp = rDp == null ? 4 : rDp;
    var d = a.d, i = 0, j = 0;
    while (d % TWO === Z) { d = d / TWO; i++; }
    while (d % FIVE === Z) { d = d / FIVE; j++; }
    var k = Math.max(i, j), exact = d === ONE && k <= maxDp;
    if (!exact) k = rDp;
    var neg = a.n < Z, n = abs(a.n), s = pow10(k), q = exact ? n * s / a.d : (n * s * TWO + a.d) / (TWO * a.d), str = q.toString();
    if (k > 0) { while (str.length <= k) str = "0" + str; str = (str.slice(0, str.length - k) + "." + str.slice(str.length - k)).replace(/0+$/, "").replace(/\.$/, ""); }
    var parts = str.split(".");
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    str = parts.join(".");
    return { s:(neg && /[1-9]/.test(str) ? MINUS : "") + str, exact:exact };
  }
  function decS(a, maxDp, rDp){ var r = dec(a, maxDp, rDp); return (r.exact ? "" : "≈ ") + r.s; }
  return { of:of, add:add, sub:sub, mul:mul, div:div, toNum:toNum, dec:dec, decS:decS };
})();
function val(q){ return XQ.decS(q, 6, 4); }
// polynomials: c[k] is the coefficient of x^k (numbers or XQ)
function pval(c, x){ var s = 0; for (var k = c.length - 1; k >= 0; k--) s = s * x + XQ.toNum(XQ.of(c[k])); return s; }
function pX(c, x){ x = XQ.of(r9(x)); var s = XQ.of(0); for (var k = c.length - 1; k >= 0; k--) s = XQ.add(XQ.mul(s, x), c[k]); return s; }
function binom(n, k){ var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
// coefficients (in h) of the simplified quotient [p(a + h) − p(a)]/h
function quoC(c, a){
  var deg = c.length - 1, out = [];
  for (var j = 0; j < deg; j++) { var s = 0; for (var k = j + 1; k <= deg; k++) s += c[k] * binom(k, j + 1) * Math.pow(a, k - j - 1); out.push(r9(s)); }
  return out;
}
// unit normal (pixels) to a line of slope s, on the side away from the curve f near (cx, cy)
function awayN(f, s, cx, cy, pxu, pyu){
  var dxp = pxu, dyp = -s * pyu, len = Math.hypot(dxp, dyp) || 1, nx = -dyp / len, ny = dxp / len, d = f(cx) - cy;
  if (!isFinite(d) || Math.abs(d * pyu) < 1 || d < 0) { nx = -nx; ny = -ny; }
  return { x:nx, y:ny };
}
function alignOf(n){ return n.x < -0.35 ? "right" : n.x > 0.35 ? "left" : "center"; }
// the time-axis window bracket (--hi band with --ink-2 end ticks)
function bracket(ctx, pl, lo, hi){
  var yb = clamp(pl.Y(0) + 25, 5, pl.H - 5), x0 = pl.X(lo), x1 = pl.X(hi);
  ctx.save(); ctx.lineCap = "butt";
  ctx.strokeStyle = css("--hi"); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
  ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yb - 9); ctx.lineTo(x0, yb + 4); ctx.moveTo(x1, yb - 9); ctx.lineTo(x1, yb + 4); ctx.stroke();
  ctx.restore();
}

// @component V9 motionTrack — particle on a vertical or horizontal track driven by s(t) (MCV4U 03, 15, 32). Self-contained:
// its own MV.Plot canvas (put the box in a sized container; the canvas fills it), a ruler in the context's units, the particle
// (--pen), a ghost trail of past positions (--ink-2, older = fainter), ghost dots (--ink-2 at 50%, labelled), a velocity arrow
// (--ink, length ∝ v, labelled) and an optional acceleration arrow (--f3). Optional controls in ctlHost (Play / Pause, Step back,
// Step, a time slider: arrows 0.1 s, Shift + arrows 1 s; reduced motion: Play jumps 0.5 s with no smooth motion) and an optional
// readout in readHost (t, s, v, speed, a, speeding up / slowing down / at rest).
//   var mt = motionTrack(box, { s(t), v(t), acc(t) (optional), t0, t1, orient:"v"|"h", lo, hi (track-axis range), rail:[from, to],
//     ground:0 (vertical only), unit:"m", vUnit:"m/s", aUnit:"m/s²", dirs:["upward", "downward"], vmax (arrow scale), trail:true,
//     arrow:true, accel:false, ghosts() -> [{t, label}], ctlHost, readHost, step:0.5, speed:1 (track s per real s), t, onTime(t, how),
//     name:"The ball" });
//   mt.set(t, quiet), mt.get(), mt.play(), mt.pause(), mt.playing(), mt.config(o), mt.lock(bool), mt.show(t | null) (draw-only
//   override for animations), mt.paint(), mt.plot
function motionTrack(box, o){
  var cfg = Object.assign({ unit:"m", vUnit:"m/s", aUnit:"m/s²", dirs:["upward", "downward"], trail:true, arrow:true, step:0.5, speed:1, name:"The particle" }, o);
  var t = cfg.t != null ? cfg.t : cfg.t0, raf = null, timer = null, locked = false, showT = null;
  box.classList.add("mt-box");
  box.innerHTML = '<canvas class="mt-c" role="img" aria-label="Motion track"></canvas>';
  var plot = new MV.Plot(box.querySelector("canvas"), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function tNow(){ return showT != null ? showT : t; }
  function vel(x){ return cfg.v ? cfg.v(x) : (cfg.s(x + 1e-5) - cfg.s(x - 1e-5)) / 2e-5; }
  function fmt(v, dp){ return num(v, dp == null ? 2 : dp); }
  function dirTxt(v){ return Math.abs(v) < 1e-9 ? "at rest" : (v > 0 ? cfg.dirs[0] : cfg.dirs[1]); }
  function desc(){
    var x = tNow(), s = cfg.s(x), v = vel(x);
    return "Motion track. At t = " + fmt(x) + " s, " + cfg.name.toLowerCase() + " is at " + fmt(s) + " " + cfg.unit + (cfg.arrow ? ", " + (Math.abs(v) < 1e-9 ? "at rest" : "moving " + dirTxt(v) + " at " + fmt(Math.abs(v)) + " " + cfg.vUnit) : "") + "." +
      (cfg.ghosts ? cfg.ghosts().map(function(g){ return " Ghost dot at " + fmt(cfg.s(g.t)) + " " + cfg.unit + " (" + g.label + ")."; }).join("") : "");
  }
  function draw(){
    var H = cfg.orient === "h", view = H ? { xmin:cfg.lo, xmax:cfg.hi, ymin:0, ymax:1 } : { xmin:0, xmax:1, ymin:cfg.lo, ymax:cfg.hi };
    plot.draw({ view:view, grid:false, axes:false, describe:desc(), after:paintTrack });
  }
  function arrowHead(ctx, x0, y0, x1, y1, col){
    var ang = Math.atan2(y1 - y0, x1 - x0), s = 10;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - s * Math.cos(ang - 0.45), y1 - s * Math.sin(ang - 0.45)); ctx.lineTo(x1 - s * Math.cos(ang + 0.45), y1 - s * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
  }
  function paintTrack(ctx, p){
    var W = p.W, Hh = p.H, horiz = cfg.orient === "h", ink = css("--ink"), ink2 = css("--ink-2"), ui = css("--font-ui") || "sans-serif";
    var rail = cfg.rail || [cfg.lo, cfg.hi], rx = horiz ? 0 : Math.round(W * 0.5) + 0.5, ry = horiz ? Math.round(Hh * 0.5) + 0.5 : 0;
    function P(s){ return horiz ? [p.X(s), ry] : [rx, p.Y(s)]; }
    var a0 = P(rail[0]), a1 = P(rail[1]);
    // groove and rail
    ctx.save(); ctx.lineCap = "round";
    ctx.strokeStyle = css("--rule"); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
    ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
    // ruler
    var len = horiz ? Math.abs(a1[0] - a0[0]) : Math.abs(a1[1] - a0[1]), stp = MV.niceStep((rail[1] - rail[0]) / Math.max(2, Math.floor(len / (horiz ? 70 : 34))));
    ctx.font = "11px " + ui; ctx.fillStyle = ink2; ctx.strokeStyle = ink2; ctx.lineWidth = 1;
    for (var r = Math.ceil(rail[0] / stp - 1e-9) * stp; r <= rail[1] + 1e-9; r += stp) {
      var q = P(r); ctx.beginPath();
      if (horiz) { ctx.moveTo(q[0], ry + 5); ctx.lineTo(q[0], ry + 10); ctx.stroke(); ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(num(r), q[0], ry + 12); }
      else { ctx.moveTo(rx - 10, q[1]); ctx.lineTo(rx - 5, q[1]); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(num(r), rx - 13, q[1]); }
    }
    ctx.textAlign = horiz ? "right" : "center"; ctx.textBaseline = horiz ? "top" : "bottom";
    if (horiz) ctx.fillText(cfg.unit, W - 4, ry + 24); else ctx.fillText(cfg.unit, rx - 18, Math.max(12, a1[1] - 8));
    if (!horiz && cfg.ground != null) { var gy = p.Y(cfg.ground); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx - 26, gy); ctx.lineTo(rx + 26, gy); ctx.stroke(); }
    ctx.restore();
    var x = tNow(), s = cfg.s(x), v = vel(x), here = P(s);
    // ghost trail
    if (cfg.trail && x > cfg.t0) {
      var n = 36, dt = (cfg.t1 - cfg.t0) / n;
      ctx.save(); ctx.fillStyle = ink2;
      for (var k = 0; k < n; k++) {
        var tau = cfg.t0 + k * dt; if (tau > x - dt * 0.5) break;
        var g = P(cfg.s(tau)); ctx.globalAlpha = 0.12 + 0.4 * (tau - cfg.t0) / Math.max(1e-9, x - cfg.t0);
        ctx.beginPath(); ctx.arc(g[0], g[1], 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // ghost dots
    (cfg.ghosts ? cfg.ghosts() : []).forEach(function(gd, i){
      var q = P(cfg.s(gd.t));
      ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = ink2; ctx.beginPath(); ctx.arc(q[0], q[1], 7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.font = "600 12px " + (css("--font-math") || "serif"); ctx.fillStyle = ink2;
      if (horiz) { ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(gd.label, q[0], ry - 12 - (i % 2) * 14); }
      else { ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(gd.label, rx + 12, q[1] + (i % 2 ? 12 : -2)); }
      ctx.restore();
    });
    // particle
    ctx.save(); ctx.fillStyle = css("--pen"); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(here[0], here[1], 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    // velocity arrow
    if (cfg.arrow) {
      var full = (horiz ? W : Hh) * 0.4, vmax = cfg.vmax || 1, Lp = clamp(v / vmax, -1.2, 1.2) * full;
      ctx.save(); ctx.font = "600 13px " + (css("--font-math") || "serif"); ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.lineCap = "round";
      var lab = Math.abs(v) < 1e-9 ? "0 " + cfg.vUnit : fmt(Math.abs(v), 2) + " " + cfg.vUnit;
      if (Math.abs(Lp) > 4) {
        if (horiz) { var yA = ry - 18, x0 = here[0], x1 = here[0] + Lp; ctx.beginPath(); ctx.moveTo(x0, yA); ctx.lineTo(x1 - Math.sign(Lp) * 6, yA); ctx.stroke(); arrowHead(ctx, x0, yA, x1, yA, ink);
          ctx.textAlign = Lp > 0 ? "left" : "right"; ctx.textBaseline = "middle"; var lx = x1 + Math.sign(Lp) * 6; if (lx > W - 50) { ctx.textAlign = "right"; lx = W - 4; } if (lx < 50) { ctx.textAlign = "left"; lx = 4; } ctx.fillText(lab, lx, yA - 12); }
        else { var xA = rx + 16, y0 = here[1], y1 = here[1] - Lp; ctx.beginPath(); ctx.moveTo(xA, y0); ctx.lineTo(xA, y1 + Math.sign(Lp) * 6); ctx.stroke(); arrowHead(ctx, xA, y0, xA, y1, ink);
          var wide = W > 170; ctx.textAlign = wide ? "left" : "right"; ctx.textBaseline = "middle"; ctx.fillText(lab, wide ? xA + 10 : W - 3, clamp(wide ? (y0 + y1) / 2 : y1 + (Lp > 0 ? -10 : 10), 10, Hh - 10)); }
      } else {
        ctx.textAlign = horiz ? "center" : "right"; ctx.textBaseline = "middle";
        if (horiz) ctx.fillText(lab + " (at rest)", clamp(here[0], 60, W - 60), ry - 22); else { if (W > 170) { ctx.textAlign = "left"; ctx.fillText(lab + " (at rest)", rx + 16, here[1]); } else ctx.fillText(lab, W - 3, clamp(here[1] - 16, 10, Hh - 10)); }
      }
      ctx.restore();
    }
    if (cfg.accel && cfg.acc) {
      var aa = cfg.acc(x), La = clamp(aa / (cfg.amax || 1), -1.2, 1.2) * (horiz ? W : Hh) * 0.3;
      if (Math.abs(La) > 4) { ctx.save(); var fc = css("--f3"); ctx.strokeStyle = fc; ctx.lineWidth = 2.6;
        if (horiz) { ctx.beginPath(); ctx.moveTo(here[0], ry + 30); ctx.lineTo(here[0] + La, ry + 30); ctx.stroke(); arrowHead(ctx, here[0], ry + 30, here[0] + La, ry + 30, fc); }
        else { ctx.beginPath(); ctx.moveTo(rx - 16, here[1]); ctx.lineTo(rx - 16, here[1] - La); ctx.stroke(); arrowHead(ctx, rx - 16, here[1], rx - 16, here[1] - La, fc); }
        ctx.restore(); }
    }
  }
  plot.render = draw;
  // ---- controls ----
  var ctl = cfg.ctlHost, slider = null;
  if (ctl) {
    ctl.innerHTML = '<div class="mt-ctl"><div class="q-actions mt-btns"><button type="button" class="btn primary sm" data-mt="play" data-k="mtplay">Play</button>' +
      '<button type="button" class="btn ghost sm" data-mt="back" data-k="mtback">Step back</button><button type="button" class="btn ghost sm" data-mt="step" data-k="mtstep">Step</button></div>' +
      '<label class="slider mt-sl"><span class="slider-top"><span>Time ' + m("t") + '</span><output class="mt-out"></output></span><input type="range" class="mt-t" step="0.1" style="accent-color:var(--ink)" aria-label="Time t, in seconds"></label>' +
      '<p class="tiny muted mt-tip">Arrow keys move the time by 0.1 s; Shift + arrow by 1 s.</p></div>';
    slider = ctl.querySelector(".mt-t");
    ctl.addEventListener("click", function(e){
      var b = e.target.closest("[data-mt]"); if (!b || b.disabled || locked) return;
      var a = b.dataset.mt;
      if (a === "play") { if (playing()) pause(); else play(); }
      else if (a === "step") { pause(); setT(r9(Math.min(cfg.t1, t + cfg.step)), "step"); }
      else if (a === "back") { pause(); setT(r9(Math.max(cfg.t0, t - cfg.step)), "step"); }
    });
    slider.addEventListener("input", function(){ if (locked) { paintCtl(); return; } pause(); setT(r9(+slider.value), "slider"); });
    slider.addEventListener("keydown", function(e){
      if (!e.shiftKey || locked) return;
      var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
      e.preventDefault(); pause(); setT(r9(clamp(Math.round(t * 10) / 10 + d, cfg.t0, cfg.t1)), "slider");
    });
  }
  function paintCtl(){
    if (!ctl) return;
    slider.min = cfg.t0; slider.max = cfg.t1; slider.value = t; slider.disabled = locked;
    slider.setAttribute("aria-valuetext", fmt(t) + " seconds");
    ctl.querySelector(".mt-out").textContent = fmt(t, 2) + " s";
    var pb = ctl.querySelector('[data-mt="play"]'); pb.textContent = playing() ? "Pause" : "Play"; pb.disabled = locked;
    ctl.querySelector('[data-mt="back"]').disabled = locked || t <= cfg.t0 + 1e-9; ctl.querySelector('[data-mt="step"]').disabled = locked || t >= cfg.t1 - 1e-9;
  }
  function paintRead(){
    if (!cfg.readHost) return;
    var x = t, v = vel(x), rows = [["Time", m("t") + " = " + fmt(x) + " s"], ["Position", fmt(cfg.s(x)) + " " + cfg.unit], ["Velocity", fmt(v) + " " + cfg.vUnit], ["Speed", fmt(Math.abs(v)) + " " + cfg.vUnit]];
    if (cfg.acc) { var aa = cfg.acc(x); rows.push(["Acceleration", fmt(aa) + " " + cfg.aUnit]); rows.push(["Motion", Math.abs(v) < 1e-9 ? "at rest" : (v * aa > 0 ? "speeding up" : v * aa < 0 ? "slowing down" : "steady")]); }
    else rows.push(["Motion", dirTxt(v)]);
    cfg.readHost.innerHTML = MV.readoutHTML(rows);
  }
  function paint(){ draw(); paintCtl(); paintRead(); }
  function setT(n, how){ t = clamp(n, cfg.t0, cfg.t1); paint(); if (cfg.onTime) cfg.onTime(t, how); }
  function playing(){ return !!(raf || timer); }
  function pause(){
    var was = playing();
    if (raf) { cancelAnimationFrame(raf); raf = null; } if (timer) { clearInterval(timer); timer = null; }
    if (was) { t = r9(Math.round(t * 10) / 10); paint(); if (cfg.onTime) cfg.onTime(t, "pause"); }
  }
  function play(){
    if (locked || playing()) return;
    if (t >= cfg.t1 - 1e-9) setT(cfg.t0, "play");
    if (MV.reduceMotion) {
      timer = setInterval(function(){ var n = r9(Math.min(cfg.t1, t + 0.5)); setT(n, "play"); if (n >= cfg.t1 - 1e-9) pause(); }, 700);
    } else {
      var last = null;
      var loop = function(now){
        if (!raf) return;
        if (last == null) last = now;
        var n = Math.min(cfg.t1, t + (now - last) / 1000 * cfg.speed); last = now;
        setT(n, "play");
        if (n >= cfg.t1 - 1e-9) { pause(); return; }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    paintCtl();
  }
  paint();
  return {
    set:function(n, quiet){ t = clamp(n, cfg.t0, cfg.t1); paint(); if (!quiet && cfg.onTime) cfg.onTime(t, "set"); },
    get:function(){ return t; }, play:play, pause:pause, playing:playing,
    config:function(o2){ pause(); Object.assign(cfg, o2 || {}); if (o2 && o2.t != null) t = o2.t; t = clamp(t, cfg.t0, cfg.t1); paint(); },
    lock:function(v){ locked = !!v; if (locked) pause(); paintCtl(); },
    show:function(x){ showT = x; draw(); },
    paint:paint, plot:plot
  };
}

// ---------- the three Explore contexts ----------
var CTX = {
  ball:{ c:[0, 30, -5], t0:0, t1:6, a0:1, orient:"v", unit:"m", rateU:"m/s", tU:"s", q:"s", rail:[0, 47], ground:0, vmax:30,
    view:{ xmin:-0.45, xmax:6.45, ymin:-7, ymax:51 }, quoGen:"30 - 10a - 5h", vGen:"30 - 10t", dirs:["upward", "downward", "at rest"],
    L:{ ds:"Change in position " + m("Δs"), avg:"Average velocity " + m("{Δs}/{Δt}"), inst:"Instantaneous velocity", pos:"Position " + m("s(t)"), avgW:"average velocity", instW:"velocity", graph:"Height graph" } },
  track:{ c:[0, 9, -6, 1], t0:0, t1:4, a0:1, orient:"h", unit:"m", rateU:"m/s", tU:"s", q:"s", rail:[0, 5], vmax:9,
    view:{ xmin:-0.3, xmax:4.3, ymin:-0.8, ymax:5.4 }, quoGen:"3a^2 - 12a + 9 + (3a - 6)h + h^2", vGen:"3t^2 - 12t + 9", dirs:["forward", "backward", "at rest"],
    L:{ ds:"Change in position " + m("Δs"), avg:"Average velocity " + m("{Δs}/{Δt}"), inst:"Instantaneous velocity", pos:"Position " + m("s(t)"), avgW:"average velocity", instW:"velocity", graph:"Position graph" } },
  fish:{ c:[500, 20, 3], t0:0, t1:10, a0:2, orient:null, unit:"fish", rateU:"fish/year", tU:"years", q:"P", vmax:80,
    view:{ xmin:-1.3, xmax:10.6, ymin:-150, ymax:1120 }, quoGen:"20 + 6a + 3h", vGen:"20 + 6t", dirs:["increasing", "decreasing", "not changing"],
    L:{ ds:"Change in population " + m("ΔP"), avg:"Average rate " + m("{ΔP}/{Δt}"), inst:"Instantaneous rate", pos:"Population " + m("P(t)"), avgW:"average rate", instW:"rate", graph:"Population graph" } }
};
function fOf(d){ return function(x){ return pval(d.c, x); }; }
function vOf(d){ return function(x){ return quoC(d.c, x)[0]; }; }
function dirOf(d, v){ return Math.abs(v) < 1e-9 ? d.dirs[2] : v > 0 ? d.dirs[0] : d.dirs[1]; }

// ---------- hero storyboard ----------
// A ball rises up a track beside s(t) = 30t − 5t²; the window [1, 3] and its secant (10 m/s); the window shrinks toward t = 1
// and the secant swings into the tangent (20 m/s), with a matching velocity arrow on the ball.
function hero(f){
  var s = function(t){ return 30 * t - 5 * t * t; }, V = { xmin:-2.4, xmax:6.4, ymin:-10, ymax:62 }, RX = -1.35;
  var st = { trace:0, ball:0, h:null, tan:0, fin:false };
  var p = new MV.Plot(f.canvas, V);
  function cap(t){ f.cap.innerHTML = t; }
  p.render = function(){
    var sc = { view:V, xTicks:{ step:1, fmt:function(x){ return x < 0 ? "" : num(x); } }, yTicks:{ step:10 }, xLabel:"t", curves:[], lines:[], segments:[], points:[], labels:[] };
    sc.curves.push({ f:s, color:css("--pen"), width:3.2, domain:[0, st.trace] });
    var a = 1, ya = 25, h = st.h;
    if (h != null) {
      var b = 1 + h, yb = s(b), mm = 20 - 5 * h;
      sc.segments.push({ x1:-0.3, y1:ya + mm * (-0.3 - a), x2:b + 0.9, y2:yb + mm * 0.9, color:css("--ink-2"), width:2 });
      sc.points.push({ x:b, y:yb, r:5, color:css("--ink-2") });
      sc.labels.push({ x:3.0, y:57, text:"average velocity " + num(mm, 2) + " m/s", color:css("--ink-2"), align:"left", bg:true });
    }
    if (st.tan > 0) {
      sc.segments.push({ x1:-0.2, y1:25 + 20 * (-0.2 - 1), x2:2.5, y2:25 + 20 * 1.5, color:css("--ink"), width:2.2, alpha:st.tan });
      if (st.tan > 0.5) sc.labels.push({ x:2.4, y:57, text:"20 m/s at t = 1", dx:-6, align:"right", bg:true });
    }
    if (st.h != null || st.fin) sc.points.push({ x:1, y:25, r:5.5, color:css("--ink") });
    sc.after = function(ctx, pl){
      if (st.h != null) bracket(ctx, pl, 1, 1 + st.h);
      // the track, the ball and its velocity arrow
      var rx = pl.X(RX), top = pl.Y(47), bot = pl.Y(0);
      ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = css("--rule"); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(rx, top); ctx.lineTo(rx, bot); ctx.stroke();
      ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx, top); ctx.lineTo(rx, bot); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rx - 22, bot); ctx.lineTo(rx + 22, bot); ctx.lineWidth = 2; ctx.stroke();
      if (st.h != null) { var gy = pl.Y(s(1 + st.h)); ctx.globalAlpha = 0.5; ctx.fillStyle = css("--ink-2"); ctx.beginPath(); ctx.arc(rx, gy, 7, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
      var by = pl.Y(s(st.ball)); ctx.fillStyle = css("--pen"); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(rx, by, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (st.tan > 0.5) {
        var ay = pl.Y(25 + 20 * 0.55), ax = rx + 17; ctx.globalAlpha = st.tan; ctx.strokeStyle = css("--ink"); ctx.fillStyle = css("--ink"); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ax, by); ctx.lineTo(ax, ay + 6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - 5.5, ay + 10); ctx.lineTo(ax + 5.5, ay + 10); ctx.closePath(); ctx.fill();
        ctx.font = "600 13px " + (css("--font-math") || "serif"); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("20 m/s", rx - 14, ay + 4); ctx.globalAlpha = 1;
      }
      ctx.restore();
    };
    sc.describe = st.fin ? "A ball on a vertical track beside its height graph s(t) = 30t − 5t². The window from t = 1 to t = 3 has a secant with average velocity 10 m/s. The tangent at t = 1 has slope 20 m/s, and the velocity arrow on the ball shows 20 m/s upward."
      : "A ball on a vertical track beside its height graph s(t) = 30t − 5t².";
    p.draw(sc);
  };
  function finish(){ st = { trace:6, ball:1, h:2, tan:1, fin:true }; cap("Average velocity on [1, 3]: 10 m/s. Shrinking the window gives 15, 19.5, 19.95 m/s, closing in on the instantaneous velocity at " + m("t = 1") + ": 20 m/s."); p.render(); }
  if (MV.reduceMotion) { finish(); return; }
  cap("The ball rises: its height " + m("s(t) = 30t - 5t^2") + " is traced beside the track."); p.render();
  MV.wait(700, function(){
    MV.tween({ dur:1900, ease:function(x){ return x; }, step:function(k){ st.trace = 3 * k; st.ball = 3 * k; p.render(); }, done:function(){
      MV.tween({ dur:900, step:function(k){ st.trace = 3 + 3 * k; p.render(); }, done:function(){
        MV.wait(300, function(){
          st.ball = 1; st.h = 2; cap("Window [1, 3]: the ball rises from 25 m to 45 m in 2 s. Average velocity: 10 m/s."); p.render();
          var seq = [1, 0.5, 0.1, 0.01], i = 0, shown = ["10"];
          (function next(){
            if (i >= seq.length) {
              MV.tween({ dur:900, step:function(k){ st.tan = k; p.render(); }, done:function(){ MV.wait(1400, finish); } });
              cap("Shrinking the window: " + shown.join(", ") + " m/s. The secant swings into the tangent: 20 m/s at " + m("t = 1") + ".");
              return;
            }
            var from = st.h, to = seq[i++];
            MV.wait(1100, function(){
              MV.tween({ dur:900, step:function(k){ st.h = from * Math.pow(to / from, k); p.render(); }, done:function(){ st.h = to; shown.push(num(20 - 5 * to, 2)); cap("Shrinking the window toward " + m("t = 1") + ": " + shown.join(", ") + " m/s."); p.render(); next(); } });
            });
          })();
        });
      } });
    } });
  });
}

// ---------- Explore: the motion lab ----------
var MAGS = [2, 1, 0.5, 0.1, 0.01, 0.001];
var PSTART = {
  p1:{ ctx:"ball", mode:"win", a:0, h:6, veil:{ sec:1, avg:1 } },
  p2:{ ctx:"ball", mode:"speed", t:0, veil:{} },
  p3:{ ctx:"ball", mode:"shrink", a:4, h:1, rows:[1], veil:{ quo:1, inst:1, dir:1 } },
  p4:{ ctx:"track", mode:"win", a:0, h:4, veil:{ sec:1, avg:1 } }
};
function explore(host, api){
  var C = api.content, S = api.S, CH = {};
  (C.challenges || []).forEach(function(c){ CH[c.id] = c; });
  S.ctx = CTX[S.ctx] ? S.ctx : "ball";
  S.a = S.a || {}; S.t = S.t || {}; S.rows = S.rows || {}; S.unl = S.unl || {};
  S.h = typeof S.h === "number" && S.h !== 0 ? r9(S.h) : 2;
  S.mode = ["win", "shrink", "speed"].indexOf(S.mode) >= 0 ? S.mode : "win";
  S.tc3 = S.tc3 || { times:"", dist:"" };
  var veil = {}, A = { h:null, t:null }, anim = null, busy = false, running = false, flipped = false;
  function D(){ return CTX[S.ctx]; }
  function aV(){ var v = S.a[S.ctx]; return v == null ? D().a0 : v; }
  function tV(){ var v = S.t[S.ctx]; return v == null ? aV() : v; }
  function key(){ return S.ctx + "|" + aV(); }
  function rows(){ return S.rows[key()] || (S.rows[key()] = []); }
  function inD(x){ var d = D(); return x >= d.t0 - 1e-9 && x <= d.t1 + 1e-9; }
  function fitH(){
    var a = aV(), h = S.h; flipped = false;
    if (inD(a + h)) return;
    if (inD(a - h)) { S.h = r9(-h); flipped = true; return; }
    var sg = h > 0 ? 1 : -1;
    for (var i = 0; i < MAGS.length; i++) { var g = MAGS[i]; if (g >= Math.abs(h)) continue; if (inD(a + sg * g)) { S.h = sg * g; return; } if (inD(a - sg * g)) { S.h = -sg * g; flipped = true; return; } }
  }
  function addRow(){ var r = rows(), h = r9(S.h); if (r.indexOf(h) < 0) r.push(h); if (Math.abs(h) <= 0.01 + 1e-12) S.unl[key()] = true; }
  function known(){ return !veil.inst && (S.mode === "speed" || !!S.unl[key()]); }
  function save(){ api.save(); MV.changed(); }
  function sec(h){
    var d = D(), a = aV(), b = r9(a + h), Pa = pX(d.c, a), Pb = pX(d.c, b), mq = XQ.div(XQ.sub(Pb, Pa), XQ.of(h));
    return { a:a, b:b, lo:Math.min(a, b), hi:Math.max(a, b), ds:h > 0 ? XQ.sub(Pb, Pa) : XQ.sub(Pa, Pb), m:mq };
  }
  function ivTxt(lo, hi){ return "[" + ntx(lo) + ", " + ntx(hi) + "]"; }

  // ---- layout ----
  var L = MV.pgLayout(host, { aria:"Motion lab graph" });
  L.graph.parentNode.classList.add("rc-lab");
  var pw = L.canvas.parentNode, stage = document.createElement("div"); stage.className = "rc-stage";
  pw.parentNode.insertBefore(stage, pw);
  var tbox = document.createElement("div"); tbox.className = "rc-trk"; stage.appendChild(tbox); stage.appendChild(pw);
  var tblBox = document.createElement("div"); tblBox.className = "rc-tblbox"; L.read.parentNode.insertBefore(tblBox, L.read);
  tblBox.innerHTML = '<p class="tiny muted rc-tcap"></p><div class="rc-tbl"></div>';
  L.ctrl.innerHTML = '<div class="chips rc-ctx" role="group" aria-label="Choose a context"></div><div class="rc-mode"></div>' +
    '<div class="rc-win"><label class="slider rc-sl"><span class="slider-top"><span>Start time ' + m("a") + '</span><output class="rc-aout"></output></span>' +
      '<input type="range" class="rc-a" step="0.5" style="accent-color:var(--ink)" aria-label="Start time a"></label>' +
      '<div class="rc-h"><p class="rc-hcur"><span>Window width ' + m("h =") + '</span> <output class="rc-hout" aria-live="polite"></output> <span class="tiny muted rc-hside"></span></p>' +
      '<div class="rc-hmag"></div><div class="q-actions rc-hb"><button type="button" class="btn ghost sm" data-hb="flip" data-k="rcflip">Flip side</button>' +
      '<button type="button" class="btn primary sm" data-hb="shrink" data-k="rcshrink">Shrink the window</button><button type="button" class="btn ghost sm" data-hb="again" data-k="rcagain">Start again at ' + m("|h| = 2") + "</button></div></div></div>" +
    '<div class="rc-spd"></div>';
  var plot = new MV.Plot(L.canvas, D().view);
  function q(sel){ return $(sel, host); }
  var mt = motionTrack(tbox, { s:fOf(D()), v:vOf(D()), t0:D().t0, t1:D().t1, orient:D().orient || "v", lo:D().view.ymin, hi:D().view.ymax, rail:D().rail, ground:D().ground,
    vmax:D().vmax, dirs:D().dirs, ctlHost:q(".rc-spd"), t:tV(), name:"The ball", trail:false, arrow:false,
    onTime:function(t, how){ if (busy) return; S.t[S.ctx] = r9(t); if (how !== "play") save(); paintRead(); draw(); if (S.ctx === "track") paintTc3(); } });

  // ---- graph ----
  function draw(){
    var d = D(), f = fOf(d), v = d.view, W = L.canvas.getBoundingClientRect().width || 600, Hh = L.canvas.getBoundingClientRect().height || 450;
    var pxu = W / (v.xmax - v.xmin), pyu = Hh / (v.ymax - v.ymin), a = aV(), ya = f(a);
    var sc = { view:v, xLabel:"t", yLabel:d.q, curves:[{ f:f, color:css("--pen"), width:3, domain:[d.t0, d.t1] }], lines:[], points:[], labels:[] };
    var desc = d.L.graph + " of " + MV.plain(C.contexts[S.ctx].eq) + ".";
    if (S.mode !== "speed") {
      var h = A.h != null ? A.h : S.h, b = a + h, yb = f(b), lo = Math.min(a, b), hi = Math.max(a, b), ms = (yb - ya) / h;
      var s = A.h == null ? sec(S.h) : null, msTxt = s ? val(s.m) : num(ms, 3);
      if (!veil.sec) {
        sc.lines.push({ p:[a, ya], q:[b, yb], color:css("--ink-2"), width:2 });
        sc.points.push({ x:b, y:yb, r:5, color:css("--ink-2") });
        if (!veil.avg) {
          var far = Math.hypot((b - a) * pxu, (yb - ya) * pyu) > 40, mx = far ? (a + b) / 2 : a, my = far ? (ya + yb) / 2 : ya, n = awayN(f, ms, (a + b) / 2, (ya + yb) / 2, pxu, pyu), gap = far ? 18 : 30;
          if ((v.ymax - my) * pyu + n.y * gap > (v.ymax - 0) * pyu - 14) n = { x:-n.x, y:-n.y };
          sc.labels.push({ x:mx, y:my, text:d.L.avgW + " " + msTxt + " " + d.rateU, dx:n.x * gap, dy:n.y * gap, align:alignOf(n), bg:true, color:css("--ink-2") });
          desc += " Window from " + ntx(lo) + " to " + ntx(hi) + " " + d.tU + ". " + MV.cap(d.L.avgW) + " " + msTxt + " " + d.rateU + ".";
        } else desc += " Window from " + ntx(lo) + " to " + ntx(hi) + " " + d.tU + ".";
      } else desc += " Window from " + ntx(lo) + " to " + ntx(hi) + " " + d.tU + ".";
      sc.after = function(ctx, pl){ bracket(ctx, pl, lo, hi); };
      if (known() && A.h == null) {
        var vq = quoC(d.c, a)[0]; sc.lines.push({ p:[a, ya], q:[a + 1, ya + vq], color:css("--ink"), width:2 });
        tanLabel(sc, f, a, ya, vq, pxu, pyu, W, Hh);
        desc += " The tangent at t = " + ntx(a) + " has slope " + ntx(vq) + " " + d.rateU + ".";
      }
      sc.points.push({ x:a, y:ya, r:5.5, color:css("--ink") });
    } else {
      var t = tV(), yt = f(t), vt = quoC(d.c, t)[0];
      sc.lines.push({ p:[t, yt], q:[t + 1, yt + vt], color:css("--ink"), width:2 });
      tanLabel(sc, f, t, yt, vt, pxu, pyu, W, Hh, 2);
      sc.points.push({ x:t, y:yt, r:5.5, color:css("--ink") });
      desc += " At t = " + num(t, 2) + " " + d.tU + " the tangent has slope " + num(vt, 2) + " " + d.rateU + ".";
    }
    if (A.t != null) sc.points.push({ x:A.t, y:f(A.t), r:5, color:css("--pen"), ring:true });
    sc.describe = desc;
    plot.draw(sc);
  }
  function tanLabel(sc, f, a, ya, vq, pxu, pyu, W, Hh, dp){
    var d = D(), v = d.view, left = (a - v.xmin) * pxu > W * 0.5, dl = (v.xmax - v.xmin) * 0.12 * (left ? -1 : 1), tx = a, ty = ya, nT = null;
    [dl, -dl, dl * 0.5, -dl * 0.5].some(function(dd){
      var x = a + dd, y = ya + vq * dd, n = awayN(f, vq, x, y, pxu, pyu);
      return [n, { x:-n.x, y:-n.y }].some(function(nn){
        var X = (x - v.xmin) * pxu + nn.x * 16, Y = (v.ymax - y) * pyu + nn.y * 16;
        if (X > 70 && X < W - 70 && Y > 14 && Y < Hh - 14) { tx = x; ty = y; nT = nn; return true; }
        return false;
      });
    });
    if (!nT) nT = { x:0, y:-1 };
    sc.labels.push({ x:tx, y:ty, text:num(vq, dp == null ? 4 : dp) + " " + d.rateU + " at t = " + num(a, 2), dx:nT.x * 16, dy:nT.y * 16, align:alignOf(nT), bg:true });
  }
  plot.render = draw;

  // ---- table and readout ----
  function paintTable(){
    var d = D(), r = rows(), mags = [];
    tblBox.hidden = S.mode === "speed";
    if (tblBox.hidden) return;
    r.forEach(function(h){ var g = r9(Math.abs(h)); if (mags.indexOf(g) < 0) mags.push(g); });
    mags.sort(function(x, y){ return y - x; });
    var cell = function(h){ if (r.indexOf(h) < 0) return '<span class="muted">–</span>'; if (veil.avg) return "?"; return val(sec(h).m); };
    var body = mags.map(function(g){ return [ntx(g), cell(g), cell(r9(-g))]; });
    if (known()) body.push([m("h → 0"), "<strong>" + ntx(quoC(d.c, aV())[0]) + "</strong>", "<strong>" + ntx(quoC(d.c, aV())[0]) + "</strong>"]);
    q(".rc-tcap").innerHTML = "Secant slopes (" + d.rateU + ") from " + m("t = a = " + nsrc(aV()));
    q(".rc-tbl").innerHTML = MV.tableHTML({ head:[m("|h|"), "window ahead (" + m("h > 0") + ")", "window behind (" + m("h < 0") + ")"], rows:body, hiRow:mags.indexOf(r9(Math.abs(S.h))), caption:"Secant slopes from t = a, with the window ahead of a and behind it" });
  }
  function paintRead(){
    var d = D(), out = [];
    if (S.mode === "speed") {
      var t = r9(Math.round(tV() * 100) / 100), vt = quoC(d.c, t)[0];
      out.push(["Time", m("t") + " = " + ntx(t) + " " + d.tU]);
      out.push([d.L.pos, val(pX(d.c, t)) + " " + d.unit]);
      out.push([d.L.inst + " at " + m("t = " + nsrc(t)), "<strong>" + ntx(vt) + " " + d.rateU + "</strong>" + ' <span class="tiny muted">(' + m(d.vGen) + ")</span>"]);
      if (d.orient) out.push(["Speed", num(Math.abs(vt), 4) + " " + d.rateU]);
      out.push(["Direction", dirOf(d, vt)]);
    } else {
      var s = sec(S.h), a = aV(), vq = quoC(d.c, a)[0];
      out.push(["Time window", ivTxt(s.lo, s.hi) + " " + d.tU]);
      out.push([d.L.ds, veil.avg ? "?" : val(s.ds) + " " + d.unit]);
      out.push([d.L.avg, veil.avg ? "?" : "<strong>" + val(s.m) + " " + d.rateU + "</strong>"]);
      if (S.mode === "shrink") out.push(["Simplified quotient", veil.quo ? '<span class="muted">…</span>' : m(d.quoGen + " = " + polySrc(quoC(d.c, a)))]);
      var ir;
      if (veil.inst) ir = "?";
      else if (!known()) ir = '? <span class="tiny muted">(shrink the window to ' + m("|h| ≤ 0.01") + ")</span>";
      else ir = "<strong>" + ntx(vq) + " " + d.rateU + "</strong>";
      out.push([d.L.inst + " at " + m("t = a"), ir]);
      out.push(["Direction at " + m("t = a"), veil.dir ? "?" : dirOf(d, vq)]);
    }
    L.read.innerHTML = MV.readoutHTML(out);
  }
  function stageCls(){ var o = D().orient; stage.className = "rc-stage " + (o === "v" ? "v" : o === "h" ? "h" : "n"); }
  function trackCfg(){
    var d = D(), a = aV(), anim = A.t != null, speed = S.mode === "speed";
    return { s:fOf(d), v:vOf(d), t0:d.t0, t1:d.t1, orient:d.orient || "v", lo:d.orient === "h" ? d.view.ymin : d.view.ymin, hi:d.view.ymax, rail:d.rail, ground:d.ground,
      vmax:d.vmax, dirs:d.dirs, name:S.ctx === "ball" ? "The ball" : "The particle", trail:speed || anim, arrow:speed && !anim,
      ghosts:function(){ if (speed || veil.sec) return []; var h = A.h != null ? A.h : S.h; return [{ t:a, label:"t = " + ntx(a) }, { t:r9(a + h), label:"t = " + num(a + h, 3) }]; },
      t:speed ? tV() : a };
  }
  function paintCtl(){
    var d = D(), a = aV(), ah = Math.abs(S.h);
    MV.keepFocus(q(".rc-ctx"), function(){ q(".rc-ctx").innerHTML = ["ball", "track", "fish"].map(function(k){ return '<button type="button" class="fchip rc-cx" data-cx="' + k + '" data-k="rccx' + k + '" aria-pressed="' + (S.ctx === k) + '"' + (busy ? " disabled" : "") + ">" + C.contexts[k].chip + "</button>"; }).join(""); });
    segMode.set(S.mode);
    var sl = q(".rc-a"); sl.min = d.t0; sl.max = d.t1; sl.value = a; sl.disabled = busy || running; q(".rc-aout").textContent = ntx(a) + " " + d.tU;
    q(".rc-hout").textContent = ntx(S.h); q(".rc-hside").textContent = (S.h > 0 ? "(window ahead of a)" : "(window behind a)") + (flipped ? " · flipped to stay inside " + ntx(d.t0) + " to " + ntx(d.t1) + " " + d.tU : "");
    segMag.set(MAGS.indexOf(r9(ah)) >= 0 ? String(r9(ah)) : "");
    q(".rc-win").hidden = S.mode === "speed"; q(".rc-spd").hidden = S.mode !== "speed";
    $$("[data-hb]", host).forEach(function(b){ b.disabled = busy || running; });
    q('[data-hb="shrink"]').hidden = q('[data-hb="again"]').hidden = S.mode !== "shrink";
    if (S.mode === "shrink") q('[data-hb="shrink"]').disabled = busy || running || ah <= 0.001 + 1e-12;
    q('[data-hb="flip"]').disabled = busy || running || !inD(a - S.h);
    mt.lock(busy);
    L.cap.innerHTML = C.contexts[S.ctx].eq + ' <span class="tiny muted rc-note">' + C.contexts[S.ctx].note + "</span>";
  }
  function paint(){ stageCls(); mt.config(trackCfg()); paintCtl(); paintTable(); paintRead(); draw(); paintTc3(); }

  // ---- controls ----
  var segMode = MV.seg(q(".rc-mode"), { label:"Mode:", value:S.mode, options:[{ id:"win", t:"Window" }, { id:"shrink", t:"Shrink" }, { id:"speed", t:"Speedometer" }],
    onChange:function(v){ if (busy || running) { segMode.set(S.mode); return; } setMode(v); } });
  var segMag = MV.seg(q(".rc-hmag"), { label:"Size of " + m("h") + ":", value:String(Math.abs(S.h)), options:MAGS.map(function(g){ return { id:String(g), t:String(g) }; }),
    onChange:function(v){ if (busy || running) { paintCtl(); return; } slideTo((S.h < 0 ? -1 : 1) * parseFloat(v)); } });
  q(".rc-ctx").addEventListener("click", function(e){ var b = e.target.closest("[data-cx]"); if (!b || busy || running) return; stop(); S.ctx = b.dataset.cx; plot.view = D().view; fitH(); addRow(); save(); paint(); });
  q(".rc-a").addEventListener("input", function(e){ if (busy || running) { paintCtl(); return; } stop(); S.a[S.ctx] = r9(+e.target.value); fitH(); addRow(); save(); paint(); });
  q(".rc-hb").addEventListener("click", function(e){
    var b = e.target.closest("[data-hb]"); if (!b || b.disabled || busy || running) return;
    if (b.dataset.hb === "flip") { stop(); S.h = r9(-S.h); flipped = false; addRow(); save(); paint(); }
    else if (b.dataset.hb === "again") { stop(); S.h = S.h < 0 ? -2 : 2; fitH(); S.rows[key()] = []; addRow(); save(); paint(); }
    else if (b.dataset.hb === "shrink") shrinkRun(null, null);
  });
  function setMode(v){ stop(); if (v === "speed" && S.mode !== "speed") S.t[S.ctx] = aV(); S.mode = v; save(); paint(); }
  function stop(){ if (anim) anim(); anim = null; A.h = null; }
  function slideTo(to, dur, cb){
    stop(); to = r9(to); var from = S.h; S.h = to; fitH(); to = S.h; flipped = false;
    if (from === to) { addRow(); save(); paint(); if (cb) cb(); return; }
    var geo = from * to > 0;
    anim = MV.tween({ dur:dur == null ? 600 : dur, step:function(k){ A.h = geo ? from * Math.pow(to / from, k) : from + (to - from) * k; mt.config(trackCfg()); draw(); },
      done:function(){ anim = null; A.h = null; addRow(); save(); paint(); if (cb) cb(); } });
  }
  // Shrink: step down the h ladder (2, 1, 0.5, 0.1, 0.01, 0.001), one table row per step
  function shrinkRun(list, cb){
    var sg = S.h < 0 ? -1 : 1, ah = Math.abs(S.h);
    list = list || MAGS.filter(function(g){ return g < ah - 1e-12; }).map(function(g){ return sg * g; });
    running = !cb; paintCtl();
    var i = 0;
    (function next(){
      if (i >= list.length) { running = false; paint(); if (cb) cb(); return; }
      var h = list[i++];
      slideTo(h, 650, function(){ MV.wait(MV.reduceMotion ? 260 : 380, next); });
    })();
  }

  // ---- challenge 3 box ----
  var bx = document.createElement("div"); bx.className = "rc-tc3"; host.appendChild(bx);
  function tc3Solved(){ return !!(MV.S.chal.tc3 || {}).solved; }
  function paintTc3(){
    var done = tc3Solved(), canAdd = S.ctx === "track" && S.mode === "speed" && !busy && !done;
    MV.keepFocus(bx, function(){
      bx.innerHTML = '<h4>Challenge 3 answers: the Track <span class="tiny muted">(stretch)</span></h4>' +
        '<div class="rc-tcrow"><label for="rc-times">Times at rest (s), separated by a comma</label><span class="rc-tcin"><input class="numin" id="rc-times" data-tc="times" type="text" inputmode="text" autocomplete="off" spellcheck="false" value="' + MV.esc(S.tc3.times) + '"' + (done ? " disabled" : "") + ">" +
        '<button type="button" class="btn ghost sm" data-tcadd="1" data-k="rctcadd"' + (canAdd ? "" : " disabled") + ">Add the lab’s time" + (S.ctx === "track" && S.mode === "speed" ? ", " + m("t = " + nsrc(Math.round(tV() * 100) / 100)) : "") + "</button></span></div>" +
        (S.ctx === "track" && S.mode === "speed" ? "" : '<p class="tiny muted rc-tchint">To add a time from the lab, choose Track and Speedometer mode.</p>') +
        '<div class="rc-tcrow"><label for="rc-dist">Total distance from ' + m("t = 0") + " to " + m("t = 4") + '</label><span class="rc-tcin"><input class="numin" id="rc-dist" data-tc="dist" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(S.tc3.dist) + '"' + (done ? " disabled" : "") + '><span class="rc-u">m</span></span></div>' +
        (done ? '<p class="tiny rc-ok">✓ Challenge 3 met: at rest at 1 s and 3 s; 12 m in total.</p>' : '<p class="tiny muted">Then press <strong>Check challenge</strong> on challenge 3 below.</p>');
    });
  }
  bx.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tc; if (!k) return; S.tc3[k] = e.target.value; save(); });
  bx.addEventListener("click", function(e){
    var b = e.target.closest("[data-tcadd]"); if (!b || b.disabled) return;
    var t = ntx(Math.round(tV() * 100) / 100), cur = String(S.tc3.times || "").trim();
    S.tc3.times = cur ? cur.replace(/[,\s]+$/, "") + ", " + t : t; save(); paintTc3();
  });

  // ---- challenges ----
  function chal(id){
    var d = D(), msgs = (CH[id] || {}).msgs || {};
    if (id === "tc1") {
      if (S.ctx !== "ball") return { ok:false, msg:"Choose the Ball context first." };
      if (S.mode === "speed") return { ok:false, msg:"Switch to Window or Shrink mode: this challenge is about a time window." };
      var s = sec(S.h), w = r9(s.hi - s.lo);
      if (!close(w, 1)) return { ok:false, msg:md("Your window " + ivTxt(s.lo, s.hi) + " is " + ntx(w) + " s wide. Make it exactly 1 s wide: `h = 1` or `h = -1`.") };
      if (close(s.lo, 2)) return { ok:true };
      if (close(s.lo, 2.5)) return { ok:false, msg:msgs.straddle };
      if (close(s.lo, 3)) return { ok:false, msg:msgs.falling };
      return { ok:false, msg:"The window " + ivTxt(s.lo, s.hi) + " has an average velocity of " + val(s.m) + " m/s. You want 5 m/s." };
    }
    if (id === "tc2") {
      if (S.ctx !== "ball") return { ok:false, msg:"Choose the Ball context first." };
      var mo = S.mode === "speed" ? r9(tV()) : aV();
      if (close(mo, 2)) return { ok:true };
      if (close(mo, 0) || close(mo, 4)) return { ok:false, msg:msgs.ends };
      if (close(mo, 3)) return { ok:false, msg:msgs.top };
      return { ok:false, msg:md("At `t = " + nsrc(mo) + "` the velocity is `30 - 10t = " + nsrc(30 - 10 * mo) + "` m/s, but the average over [0, 4] is 10 m/s.") };
    }
    if (id === "tc3") {
      var times = MV.parseList(S.tc3.times || ""), dist = MV.parseNum(S.tc3.dist || "");
      if (!times || !times.length) return { ok:false, msg:"Enter both times when the particle is at rest, separated by a comma (or add them from the lab)." };
      if (MV.sameNums(times, [0, 3], 1e-6)) return { ok:false, msg:msgs.t0 };
      if (!MV.sameNums(times, [1, 3], 1e-6)) {
        var bad = times.filter(function(x){ return !close(x, 1) && !close(x, 3); })[0];
        if (bad != null) { var vb = quoC(CTX.track.c, bad)[0]; return { ok:false, msg:md("At `t = " + nsrc(bad) + "` the velocity is `3t^2 - 12t + 9 = " + nsrc(r9(vb)) + "` m/s, not 0.") }; }
        return { ok:false, msg:"There are two times in [0, 4] when the particle is at rest. Enter both, once each." };
      }
      if (!dist || dist.length !== 1) return { ok:false, msg:"The times are right. Now enter the total distance in metres." };
      if (close(dist[0], 4)) return { ok:false, msg:msgs.dist4 };
      if (!close(dist[0], 12)) return { ok:false, msg:md("Find the positions at `t = 0`, 1, 3 and 4, then add the length of each leg.") };
      return { ok:true };
    }
    return { ok:false };
  }

  // ---- predictions ----
  function applyStart(st){
    stop(); mt.pause();
    S.ctx = st.ctx; plot.view = D().view; S.mode = st.mode;
    if (st.a != null) S.a[S.ctx] = st.a;
    if (st.h != null) S.h = st.h;
    if (st.t != null) S.t[S.ctx] = st.t;
    if (st.mode !== "speed") { S.rows[key()] = (st.rows || [st.h]).slice(); }
    veil = Object.assign({}, st.veil || {}); A.t = null; flipped = false;
    save(); paint();
  }
  function flight(t0, t1, dur, cb){
    A.t = t0; mt.config(trackCfg()); mt.show(t0); draw();
    anim = MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(k){ A.t = t0 + (t1 - t0) * k; mt.show(A.t); draw(); },
      done:function(){ anim = null; MV.wait(450, function(){ A.t = null; mt.show(null); cb(); }); } });
  }
  var api2 = {
    predict:{
      start:function(p){ busy = false; applyStart(PSTART[p.id]); busy = true; paintCtl(); },
      run:function(p, done){
        var fin = function(){ veil = {}; busy = false; A.t = null; mt.show(null); save(); paint(); done(); };
        if (p.id === "p1") flight(0, 6, 3200, function(){ MV.wait(150, fin); });
        else if (p.id === "p4") flight(0, 4, 3400, function(){ MV.wait(150, fin); });
        else if (p.id === "p2") {
          anim = MV.tween({ dur:2600, step:function(k){ S.t.ball = r9(3 * k); mt.set(S.t.ball, true); paintRead(); draw(); }, done:function(){ anim = null; S.t.ball = 3; mt.set(3, true); MV.wait(500, fin); } });
        } else if (p.id === "p3") {
          busy = true; shrinkRun([0.5, 0.1, 0.01], function(){ MV.wait(250, fin); });
        } else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
  fitH(); addRow(); paint();
  return api2;
}

// ---------- Part 3: rates in the real world ----------
// @component N29 sentenceBuilder (copied from MHF4U 08) — a sentence with chip slots ("At ___, the ___ is ___ …"): tap a blank,
// then a chip from its bank; judge() checks each slot (chips marked ok:true; several may be right), mark() colours slots, lock() freezes it.
function sentenceBuilder(host, o){
  var val0 = Object.assign({}, o.value || {}), ids = [], active = null, locked = !!o.locked, marks = {};
  o.tpl.replace(/\{(\w+)\}/g, function(_, id){ ids.push(id); return ""; });
  function nextEmpty(after){
    var i0 = after ? ids.indexOf(after) + 1 : 0;
    for (var k = 0; k < ids.length; k++) { var id = ids[(i0 + k) % ids.length]; if (val0[id] == null) return id; }
    return null;
  }
  function paint(focusSel){
    var h = '<p class="sb-line">' + o.tpl.split(/(\{\w+\})/).map(function(pt){
      var mm = /^\{(\w+)\}$/.exec(pt);
      if (!mm) return pt;
      var id = mm[1], sl = o.slots[id], c = val0[id] != null ? sl.chips[val0[id]] : null, n = ids.indexOf(id) + 1;
      return '<button type="button" class="sb-slot' + (c ? " full" : "") + (active === id ? " on" : "") + (marks[id] ? " " + marks[id] : "") + '" data-sb-slot="' + id + '" data-k="' + o.key + "s" + id + '" aria-pressed="' + (active === id) + '" aria-label="Blank ' + n + " of " + ids.length + ", " + MV.esc(sl.label) + ": " + (c ? MV.esc(MV.plain(c.t)) : "empty") + (marks[id] === "bad" ? " (needs another look)" : "") + '"' + (locked ? " disabled" : "") + ">" + (c ? c.t : '<span class="vh">empty</span>') + "</button>";
    }).join("") + "</p>";
    if (active && !locked) {
      var sl = o.slots[active];
      h += '<div class="sb-bank" role="group" aria-label="Choices for ' + MV.esc(sl.label) + '"><span class="sb-bank-lab">' + MV.cap(sl.label) + ":</span>" + sl.chips.map(function(c, i){
        return '<button type="button" class="chip' + (val0[active] === i ? " on" : "") + '" data-sb-chip="' + i + '" data-k="' + o.key + "c" + active + i + '" aria-pressed="' + (val0[active] === i) + '">' + c.t + "</button>";
      }).join("") + "</div>";
    } else if (!locked) h += '<p class="tiny muted sb-tip">Tap a blank, then choose the words for it.</p>';
    MV.keepFocus(host, function(){ host.innerHTML = h; });
    if (focusSel) { var f = host.querySelector(focusSel); if (f) f.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked) return;
    if (b.dataset.sbSlot) { active = active === b.dataset.sbSlot ? null : b.dataset.sbSlot; paint(active ? ".sb-bank .chip" : null); return; }
    if (b.dataset.sbChip != null && active) {
      var cur = active; val0[cur] = +b.dataset.sbChip; marks[cur] = null;
      active = nextEmpty(cur);
      paint(active ? ".sb-bank .chip" : '[data-sb-slot="' + cur + '"]');
      if (o.onChange) o.onChange(Object.assign({}, val0));
    }
  });
  paint();
  return {
    get:function(){ return Object.assign({}, val0); },
    judge:function(){
      var empty = [], bad = [], mk = {};
      ids.forEach(function(id){ var c = val0[id] != null ? o.slots[id].chips[val0[id]] : null; if (!c) empty.push(id); else if (!MV.ok(c)) { bad.push({ id:id, fb:c.fb || "" }); mk[id] = "bad"; } else mk[id] = "good"; });
      return { ok:!empty.length && !bad.length, empty:empty, bad:bad, marks:mk };
    },
    mark:function(mk){ marks = mk || {}; active = null; paint(); },
    lock:function(on){ locked = !!on; active = null; paint(); }
  };
}

var S2 = {
  cost:{ c:[500, 4, 0.01], p:100, iv:[100, 200], hs:[50, 10, 1, 0.1], view:{ xmin:-34, xmax:262, ymin:-380, ymax:2350 }, x:"x", y:"C",
    fmt:function(qq){ return "$" + XQ.decS(qq, 6, 4) + " per item"; }, inst:6, ivName:"[100, 200]", at:"x = 100" },
  fish:{ c:[500, 20, 3], p:5, iv:[0, 5], hs:[2, 1, 0.1, 0.01], view:{ xmin:-1.4, xmax:10.6, ymin:-175, ymax:1120 }, x:"t", y:"P",
    fmt:function(qq){ return XQ.decS(qq, 6, 4) + " fish per year"; }, inst:50, ivName:"[0, 5]", at:"t = 5" },
  balloon:{ c:[0, 0, 0, XQ.div(4, 3)], pi:true, p:3, iv:[0, 3], hs:[1, 0.1, 0.01, 0.001], view:{ xmin:-0.3, xmax:4.3, ymin:-42, ymax:285 }, x:"r", y:"V",
    fmt:function(qq){ return XQ.decS(qq, 6, 3) + "π cm³ per cm"; }, inst:36, ivName:"[0, 3]", at:"r = 3" }
};
function part3(host, api){
  var C = api.content, S = api.S;
  S.st = ["s1", "s2", "s3"].indexOf(S.st) >= 0 ? S.st : "s1";
  S.s1 = S.s1 || {}; S.s2 = S.s2 || { ctx:"cost" }; S.s3 = S.s3 || {};
  host.innerHTML = '<div class="rc-st"></div>' +
    '<div class="rc-pane" data-pane="s1"><h3 class="rc-sh">' + C.s1.title + '</h3><p class="how">' + C.s1.how + '</p><div class="rc-cards"></div><div class="q-actions"><span class="tiny muted rc-s1n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="rc-s1reset" data-k="rcs1r">Reset the cards</button></div></div>' +
    '<div class="rc-pane" data-pane="s2"><h3 class="rc-sh">' + C.s2.title + '</h3><p class="how">' + C.s2.how + '</p><div class="rc-s2c"></div>' +
      '<div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="rc-s2plot" role="img" aria-label="Graph for this context"></canvas></div><p class="tiny muted rc-s2cap" id="rc-s2cap"></p></div>' +
      '<div><div id="rc-s2pl"></div><ol class="rc-steps" id="rc-s2steps" aria-live="polite"></ol><div id="rc-s2tbl"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><p id="rc-s2alg" style="margin:10px 0 0"></p></details></div></div></div>' +
    '<div class="rc-pane" data-pane="s3"><h3 class="rc-sh">' + C.s3.title + '</h3><p class="how">' + C.s3.how + '</p><div class="rc-s3"></div></div>';
  var seg = MV.seg($(".rc-st", host), { label:"Station:", value:S.st, options:[{ id:"s1", t:"1. Average or instantaneous?" }, { id:"s2", t:"2. Three contexts" }, { id:"s3", t:"3. Say what it means" }],
    onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ $$(".rc-pane", host).forEach(function(p){ p.hidden = p.dataset.pane !== S.st; }); seg.set(S.st); if (S.st === "s2") requestAnimationFrame(function(){ p2.render(); }); }

  // ---- station 1: flip cards ----
  var KIND = { avg:"Average", inst:"Instantaneous" }, turning = {};
  function card1(c){
    var pick = S.s1[c.id], ans = MV.ans(c);
    if (pick == null) return '<p class="rc-ct">' + c.t + '</p><div class="rc-cbtn" role="group" aria-label="Average or instantaneous?"><button type="button" class="btn ghost sm" data-pick="avg" data-k="' + c.id + 'avg">Average</button><button type="button" class="btn ghost sm" data-pick="inst" data-k="' + c.id + 'inst">Instantaneous</button></div>';
    var good = pick === ans;
    return '<p class="rc-kind">' + KIND[ans] + '</p><p class="rc-ct rc-small">' + c.t + '</p><p class="rc-why">' + c.why + '</p><p class="tiny rc-you ' + (good ? "good" : "bad") + '">' + (good ? "✓ You said " + KIND[pick].toLowerCase() + "." : "✗ You said " + KIND[pick].toLowerCase() + ".") + "</p>";
  }
  function paint1(){
    var box = $(".rc-cards", host);
    MV.keepFocus(box, function(){ box.innerHTML = C.s1.cards.map(function(c){ return '<div class="rc-card' + (S.s1[c.id] != null ? " done" : "") + '" data-card="' + c.id + '">' + card1(c) + "</div>"; }).join(""); });
    var n = C.s1.cards.filter(function(c){ return S.s1[c.id] != null; }).length, r = C.s1.cards.filter(function(c){ return S.s1[c.id] === MV.ans(c); }).length;
    $(".rc-s1n", host).textContent = "Cards flipped: " + n + " of " + C.s1.cards.length + (n ? " · you were right on " + r : "") + ".";
  }
  $(".rc-cards", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-pick]"); if (!b) return;
    var el = b.closest("[data-card]"), id = el.dataset.card; if (turning[id] || S.s1[id] != null) return;
    turning[id] = true; S.s1[id] = b.dataset.pick; api.save(); el.classList.add("rc-turn");
    MV.wait(180, function(){ turning[id] = false; paint1(); var nc = $('[data-card="' + id + '"]', host); if (nc) { nc.classList.add("rc-turn2"); nc.setAttribute("tabindex", "-1"); nc.focus({ preventScroll:true }); } });
  });
  $("#rc-s1reset").addEventListener("click", function(){ S.s1 = {}; api.save(); paint1(); });

  // ---- station 2: three contexts, one method ----
  var p2 = new MV.Plot($("#rc-s2plot"), S2.cost.view), step2 = 0, player = null;
  var segC = MV.seg($(".rc-s2c", host), { label:"Context:", value:S.s2.ctx, options:["cost", "fish", "balloon"].map(function(k){ return { id:k, t:C.s2.contexts[k].chip }; }),
    onChange:function(v){ S.s2.ctx = v; api.save(); build2(); } });
  function X2(){ return S2[S.s2.ctx]; }
  function f2(x){ var d = X2(); return pval(d.c, x) * (d.pi ? Math.PI : 1); }
  function quo2(h){ var d = X2(); return XQ.div(XQ.sub(pX(d.c, r9(d.p + h)), pX(d.c, d.p)), XQ.of(h)); }
  p2.render = function(){
    var d = X2(), cx = C.s2.contexts[S.s2.ctx], sc = { view:d.view, xLabel:d.x, yLabel:d.y, curves:[{ f:f2, color:css("--pen"), width:3, domain:[0, d.view.xmax] }], lines:[], points:[], labels:[] };
    var desc = "Graph of " + MV.plain(cx.eq) + ".", P = [d.p, f2(d.p)];
    if (step2 === 1) {
      var A0 = [d.iv[0], f2(d.iv[0])], B0 = [d.iv[1], f2(d.iv[1])];
      sc.lines.push({ p:A0, q:B0, color:css("--ink-2"), width:2 }); sc.points.push({ x:A0[0], y:A0[1], r:5, color:css("--ink-2") }, { x:B0[0], y:B0[1], r:5, color:css("--ink-2") });
      sc.after = function(ctx, pl){ bracket(ctx, pl, d.iv[0], d.iv[1]); };
      desc += " The secant over " + d.ivName + " shows the average rate.";
    } else if (step2 >= 2 && step2 <= 5) {
      var h = d.hs[step2 - 2], Q = [d.p + h, f2(d.p + h)];
      sc.lines.push({ p:P, q:Q, color:css("--ink-2"), width:2 }); sc.points.push({ x:Q[0], y:Q[1], r:5, color:css("--ink-2") });
      sc.after = function(ctx, pl){ bracket(ctx, pl, d.p, d.p + h); };
      desc += " The secant from " + d.at + " over an interval of width " + num(h, 4) + ".";
    } else if (step2 === 6) {
      var sl = d.inst * (d.pi ? Math.PI : 1);
      sc.lines.push({ p:P, q:[P[0] + 1, P[1] + sl], color:css("--ink"), width:2 });
      desc += " The tangent at " + d.at + " shows the instantaneous rate.";
    }
    if (step2 >= 1) sc.points.push({ x:P[0], y:P[1], r:5.5, color:css("--ink") });
    sc.describe = desc;
    p2.draw(sc);
  };
  function paintSteps(){
    var d = X2(), cx = C.s2.contexts[S.s2.ctx], items = [];
    items.push("<strong>The formula.</strong> " + cx.eq + ".");
    if (step2 >= 1) items.push("<strong>Average rate on " + d.ivName + ".</strong> " + cx.avg);
    for (var i = 0; i < 4; i++) if (step2 >= 2 + i) items.push("<strong>Shrink the interval: " + m("h = " + nsrc(d.hs[i])) + ".</strong> The average rate from " + m(d.at) + " to " + m(d.at.split(" = ")[0] + " = " + nsrc(r9(d.p + d.hs[i]))) + " is " + d.fmt(quo2(d.hs[i])) + ".");
    if (step2 >= 6) items.push("<strong>Let " + m("h → 0") + ".</strong> " + cx.inst);
    $("#rc-s2steps").innerHTML = items.map(function(x){ return "<li>" + x + "</li>"; }).join("");
    var tb = $("#rc-s2tbl");
    if (step2 >= 2) {
      var rws = d.hs.slice(0, Math.min(4, step2 - 1)).map(function(h){ return [ntx(h), d.fmt(quo2(h))]; });
      if (step2 >= 6) rws.push([m("h → 0"), "<strong>" + d.fmt(XQ.of(d.inst)) + "</strong>"]);
      tb.innerHTML = MV.tableHTML({ head:[m("h"), "average rate on [" + m(d.at.split(" = ")[1]) + ", " + m(d.at.split(" = ")[1] + " + h") + "]"], rows:rws, caption:"Average rates over shrinking intervals" });
    } else tb.innerHTML = "";
    $("#rc-s2alg").innerHTML = cx.alg;
    $("#rc-s2cap").innerHTML = cx.eq;
    p2.render();
  }
  function build2(){
    segC.set(S.s2.ctx); p2.view = X2().view; step2 = 0;
    var old = $("#rc-s2pl"), fresh = document.createElement("div"); fresh.id = "rc-s2pl"; old.parentNode.replaceChild(fresh, old);
    var names = ["the formula", "the average rate", "shrink", "shrink", "shrink", "shrink", "the instantaneous rate"];
    player = MV.player(fresh, { count:7, interval:1500, label:function(i){ return "Step " + (i + 1) + " of 7: " + names[i]; }, render:function(i){ step2 = i; paintSteps(); } });
  }

  // ---- station 3: say what it means ----
  var sbs = {};
  function paint3(){
    var host3 = $(".rc-s3", host);
    host3.innerHTML = C.s3.items.map(function(it, i){ return '<div class="rc-sb" data-sb="' + it.id + '"><p class="rc-sbh"><span class="qn" aria-hidden="true">' + (i + 1) + "</span><span><strong>" + it.name + ":</strong> " + it.stmt + '</span></p><div class="rc-sbb"></div><div class="rc-sbc"></div></div>'; }).join("");
    C.s3.items.forEach(function(it){
      var x = S.s3[it.id] || (S.s3[it.id] = { val:{}, solved:false, tries:0 }), el = $('[data-sb="' + it.id + '"]', host);
      sbs[it.id] = sentenceBuilder($(".rc-sbb", el), { tpl:C.s3.tpl, slots:it.slots, value:x.val, key:it.id, locked:x.solved, onChange:function(v){ x.val = v; api.save(); } });
      if (x.solved) sbs[it.id].mark(sbs[it.id].judge().marks);
      ctl3(it, null);
    });
  }
  function ctl3(it, msg){
    var x = S.s3[it.id], c = $('[data-sb="' + it.id + '"] .rc-sbc', host);
    MV.keepFocus(c, function(){
      c.innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.done) :
        '<div class="q-actions"><button type="button" class="btn primary sm" data-sbcheck="' + it.id + '" data-k="' + it.id + 'chk">Check</button></div>' + (msg || "");
    });
  }
  $(".rc-s3", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-sbcheck]"); if (!b) return;
    var it = C.s3.items.filter(function(z){ return z.id === b.dataset.sbcheck; })[0], x = S.s3[it.id], j = sbs[it.id].judge(), msg;
    sbs[it.id].mark(j.marks);
    if (j.ok) { x.solved = true; sbs[it.id].lock(true); sbs[it.id].mark(j.marks); }
    else {
      x.tries++;
      var lines = j.bad.map(function(z){ return "<li>" + (z.fb || "Look at this blank again.") + "</li>"; });
      if (j.empty.length) lines.push("<li>Fill every blank.</li>");
      msg = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Fix the marked blanks, then check again.</p><ul>' + lines.join("") + "</ul></div>";
    }
    api.save(); ctl3(it, msg); MV.focusFb($('[data-sb="' + it.id + '"]', host));
  });

  paint1(); build2(); paint3(); show();
}

// ---------- Practice 2: rate problems ----------
// @component N4 unitBoxes — one or more labelled number boxes per item with units beside them (items: boxes:[{k, label, pre, unit}],
// answer:{k:value}, wrong:[{k, v, fb}]); per-box named feedback, three-level hints, first-try scoring.
function rates(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ return st.items[id] || (st.items[id] = { v:{}, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
    return '<div class="q rc-rq" data-rq="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="rc-rb"></div><div class="rc-rc"></div></div>';
  }).join("");
  function paintBoxes(it){
    var x = ist(it.id), el = $('[data-rq="' + it.id + '"] .rc-rb', host);
    MV.keepFocus(el, function(){
      el.innerHTML = it.boxes.map(function(b){
        return '<div class="rc-brow"><label for="rq-' + it.id + b.k + '">' + b.label + '</label><span class="rc-bin">' + (b.pre ? '<span class="rc-pre">' + b.pre + "</span>" : "") + '<input class="numin" id="rq-' + it.id + b.k + '" data-bx="' + b.k + '" data-k="' + it.id + b.k + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.v[b.k] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="rc-u">' + b.unit + "</span></span></div>";
      }).join("");
    });
  }
  function paintCtl(it){
    var x = ist(it.id), c = $('[data-rq="' + it.id + '"] .rc-rc', host);
    MV.keepFocus(c, function(){
      var h = "";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
      c.innerHTML = h;
    });
  }
  a.items.forEach(function(it){ paintBoxes(it); paintCtl(it); });
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it), wrong = [], right = [];
    for (var i = 0; i < it.boxes.length; i++) {
      var b = it.boxes[i], p = MV.parseNum(x.v[b.k] || "");
      if (!String(x.v[b.k] || "").trim()) return { err:"Fill in every box first." };
      if (!p || p.length !== 1) return { err:"Type a number in each box, such as 12, 2.5 or 5/2." };
      if (Math.abs(p[0] - ans[b.k]) <= 1e-6 * Math.max(1, Math.abs(ans[b.k]))) right.push(b);
      else { var nw = (it.wrong || []).filter(function(w){ return w.k === b.k && Math.abs(w.v - p[0]) < 1e-6; })[0]; wrong.push(nw ? nw.fb : null); }
    }
    if (!wrong.length) return { ok:true };
    var named = wrong.filter(Boolean);
    var msg = named.length ? named.join(" ") : (it.boxes.length > 1 && right.length ? "Your " + right.map(function(b){ return b.label.toLowerCase(); }).join(" and ") + (right.length > 1 ? " are" : " is") + " right; check the other box." : "Check your working.");
    return { ok:false, msg:msg };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bx) return; var box = t.closest("[data-rq]"); ist(box.dataset.rq).v[t.dataset.bx] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.bx) return; var box = e.target.closest("[data-rq]"), b = box && box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-rq]"); if (!box) return;
    var it = a.items.filter(function(z){ return z.id === box.dataset.rq; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCtl(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintBoxes(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCtl(it); MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- performance task: design a launch ----------
var task = (function(){
  var api, plot, mt, T;
  function read(){
    var s = api ? api.S : {};
    return { v:+s.v, a:+s.a, b:+s.b };
  }
  function sOf(d){ return function(t){ return d.v * t - 5 * t * t; }; }
  function view(d){
    var land = d.v / 5, tmax = Math.max(6, land, d.b) + 0.6, top = d.v * d.v / 20, sb = sOf(d)(d.b), sa = sOf(d)(d.a);
    var ymax = Math.max(top, 100) * 1.12, ymin = Math.min(0, sa, sb) - ymax * 0.13;
    return { xmin:-tmax * 0.06, xmax:tmax, ymin:ymin, ymax:ymax };
  }
  function draw(){
    var d = read(), f = sOf(d), v = view(d), land = d.v / 5, va = d.v - 10 * d.a, sa = f(d.a), sb = f(d.b);
    var sc = { view:v, xLabel:"t", yLabel:"s", curves:[{ f:f, color:css("--pen"), width:3, domain:[0, land] }], lines:[], segments:[], points:[], labels:[] };
    if (d.b > land + 1e-9) sc.curves.push({ f:f, color:css("--ink-2"), width:2, dash:[6, 6], domain:[land, d.b + 0.2] });
    sc.segments.push({ x1:v.xmin, y1:100, x2:v.xmax, y2:100, color:css("--ink-2"), width:1.5, dash:[8, 6] });
    sc.labels.push({ x:v.xmax, y:100, text:"100 m", dx:-6, dy:-11, align:"right", color:css("--ink-2"), font:"italic 13px " + (css("--font-math") || "serif") });
    if (d.b > d.a) { sc.lines.push({ p:[d.a, sa], q:[d.b, sb], color:css("--ink-2"), width:2 }); sc.points.push({ x:d.b, y:sb, r:5, color:css("--ink-2"), label:"b", below:sb < 0 }); }
    sc.lines.push({ p:[d.a, sa], q:[d.a + 1, sa + va], color:css("--ink"), width:2 });
    sc.points.push({ x:d.a, y:sa, r:5.5, color:css("--ink"), label:"a", below:true });
    sc.after = function(ctx, pl){ if (d.b > d.a) bracket(ctx, pl, d.a, d.b); };
    var avg = d.b > d.a ? (sb - sa) / (d.b - d.a) : NaN;
    sc.describe = "Height graph of s(t) = " + num(d.v) + "t − 5t², landing at t = " + num(land) + " s, with the 100 m line. Window from " + num(d.a) + " to " + num(d.b) + " s" + (isFinite(avg) ? ", average velocity " + num(avg) + " m/s" : "") + ". Tangent at t = " + num(d.a) + " with slope " + num(va) + " m/s.";
    plot.draw(sc);
    mt.config({ s:f, v:function(t){ return d.v - 10 * t; }, t0:0, t1:Math.max(land, d.a, d.b), lo:v.ymin, hi:v.ymax, rail:[0, Math.max(d.v * d.v / 20, 100) * 1.05], t:d.a, vmax:50,
      ghosts:function(){ return d.b > d.a ? [{ t:d.b, label:"t = b" }] : []; } });
  }
  function readout(){
    var d = read(), el = $("#rc-tread"); if (!el) return;
    var f = sOf(d), avg = d.b > d.a ? (f(d.b) - f(d.a)) / (d.b - d.a) : null;
    el.innerHTML = MV.readoutHTML([["Height", m("s(t) = " + nsrc(d.v) + "t - 5t^2") + " m"],
      ["Average velocity on [" + m("a") + ", " + m("b") + "]", avg == null ? '<span class="muted">choose ' + m("b > a") + "</span>" : num(avg, 4) + " m/s"],
      ["Velocity at " + m("t = a"), m("v - 10a") + " = " + num(d.v - 10 * d.a) + " m/s"],
      ["Top", m("t = v/10") + " = " + num(d.v / 10) + " s, height " + num(d.v * d.v / 20) + " m"],
      ["Lands", m("t = v/5") + " = " + num(d.v / 5) + " s"]]);
  }
  function out(){ var d = read(); $("#rc-vo").textContent = num(d.v) + " m/s"; $("#rc-ao").textContent = num(d.a) + " s"; $("#rc-bo").textContent = num(d.b) + " s"; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; if (a.S.v == null) { a.S.v = 30; a.S.a = 1; a.S.b = 4; }
      function sl(k, lab, min, max, step, unit){ return '<label class="slider rc-tsl"><span class="slider-top"><span>' + lab + '</span><output id="rc-' + k + 'o"></output></span><input type="range" data-tl="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + a.S[k] + '" style="accent-color:var(--ink)" aria-label="' + MV.esc(MV.plain(lab)) + ", in " + unit + '"></label>'; }
      inp.innerHTML = sl("v", "Launch speed " + m("v"), 5, 50, 5, "metres per second") + sl("a", "Window start " + m("a"), 0, 10, 0.5, "seconds") + sl("b", "Window end " + m("b"), 0, 10, 0.5, "seconds");
      pv.innerHTML = '<div class="rc-tstage"><div class="rc-ttrk"></div><div class="plot-wrap"><canvas class="plot" id="rc-tplot" role="img" aria-label="Your launch: height graph with the window"></canvas></div></div><dl class="read" id="rc-tread" aria-live="polite" style="margin-top:10px"></dl>';
      mt = motionTrack($(".rc-ttrk", pv), { s:function(t){ return 30 * t - 5 * t * t; }, v:function(t){ return 30 - 10 * t; }, t0:0, t1:6, orient:"v", lo:-5, hi:110, ground:0, trail:true, arrow:true, vmax:50, name:"The ball", t:1 });
      plot = new MV.Plot($("#rc-tplot"), { xmin:0, xmax:10, ymin:-10, ymax:110 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tl; if (!k) return; a.S[k] = +e.target.value; a.save(); out(); draw(); readout(); a.update(); });
      // the frame's "find another" text appears after 3 answers; this plan's closing note waits for all five
      document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && ts.found.length >= 5 && T.afterAll) { var p = document.createElement("p"); p.innerHTML = T.afterAll; fb.appendChild(p); } }, 0);
      });
      out(); draw(); readout();
    },
    read:read,
    valid:function(d){ return d.a < d.b ? true : "Choose a window end b that is later than its start a."; },
    checks:function(d){
      var f = sOf(d);
      if (!(d.a < d.b)) return [false, false, false, d.v * d.v / 20 < 100, false];
      return [Math.abs(f(d.a) - f(d.b)) < 1e-9, close(d.b - d.a, 4), close(d.v - 10 * d.a, 20), d.v * d.v / 20 < 100, d.b <= d.v / 5 + 1e-9];
    },
    key:function(d){ return d.v + "," + d.a + "," + d.b; },
    label:function(k){ return "(" + k.split(",").map(function(x){ return num(+x); }).join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "v = " + num(+p[0]) + ", a = " + num(+p[1]) + ", b = " + num(+p[2]); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ rates:rates },
  task:task
});
})();
