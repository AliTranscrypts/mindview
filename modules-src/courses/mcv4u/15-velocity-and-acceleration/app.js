// MCV4U 15 Velocity and Acceleration: hero (a particle on s(t) = t³ − 6t² + 9t with teal v and magenta a arrows), Motion
// simulator (Explore: V9 motion track + V5 s–t / v–t / a–t panels + V11 sign chart with a motion row to fill), Speeding up?
// (Part 3: sign-chart builder, leg table with a leg replay, a cliff throw), the s–t ↔ v–t thumbnails (Practice 1 figures),
// One trip, five questions (Practice 2: number entry + N10 interval builder + V11 chart) and the "Turn once, then hurry left" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, Q = MV.mcv.Q;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, tol){ return Math.abs(a - b) <= (tol == null ? 1e-9 : tol); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function snapT(t){ return r9(Math.round(t * 20) / 20); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function mf(px, w){ return "italic " + (w || 600) + " " + (px || 14) + "px " + (css("--font-math") || "serif"); }
// a value with at most dp decimals: "= 3.375" or "≈ 3.993"
function rel(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? " ≈ " : " = ") + num(r, dp); }
function val(v, dp){ var r = r9(v), p = Math.pow(10, dp); return (Math.abs(r * p - Math.round(r * p)) > 1e-6 ? "≈ " : "") + num(r, dp); }
function segBtns(name, opts, cur, label){
  return '<span class="seg" role="group" aria-label="' + MV.esc(label) + '">' + opts.map(function(o){
    return '<button type="button" data-' + name + '="' + o.id + '" data-k="' + name + o.id + '" aria-pressed="' + (cur === o.id) + '">' + o.t + "</button>"; }).join("") + "</span>";
}

// ---------- polynomials (c[k] is the coefficient of t^k) ----------
function pv(c, t){ var s = 0; for (var k = c.length - 1; k >= 0; k--) s = s * t + c[k]; return s; }
function pd(c){ return c.slice(1).map(function(x, i){ return x * (i + 1); }); }
function polySrc(c, v){
  v = v || "t"; var out = "";
  for (var k = c.length - 1; k >= 0; k--) {
    var x = r9(c[k]); if (!x) continue;
    var ax = Math.abs(x), body = k === 0 ? String(ax) : (ax === 1 ? "" : String(ax)) + v + (k > 1 ? "^" + k : "");
    out += out ? (x < 0 ? " - " : " + ") + body : (x < 0 ? "-" : "") + body;
  }
  return out || "0";
}
// real zeros of a polynomial of degree ≤ 2 inside (lo, hi) (or [lo, hi] with incl), sorted; a double zero is flagged touch
function roots(c, lo, hi, incl){
  var d = c.slice(); while (d.length && Math.abs(d[d.length - 1]) < 1e-12) d.pop();
  var out = [];
  if (d.length === 2) out.push({ x:-d[0] / d[1] });
  else if (d.length === 3) {
    var A = d[2], B = d[1], C0 = d[0], D = B * B - 4 * A * C0;
    if (D > 1e-12) { var s = Math.sqrt(D); out.push({ x:(-B - s) / (2 * A) }, { x:(-B + s) / (2 * A) }); }
    else if (Math.abs(D) <= 1e-12) out.push({ x:-B / (2 * A), touch:true });
  }
  return out.map(function(r){ r.x = r9(r.x); return r; }).filter(function(r){ return incl ? r.x >= lo - 1e-9 && r.x <= hi + 1e-9 : r.x > lo + 1e-9 && r.x < hi - 1e-9; })
    .sort(function(p, q){ return p.x - q.x; });
}
// a time as text: 2, 3.5, 7/3 or ≈ 2.27
function tTxt(x){
  if (!isFinite(x)) return x > 0 ? "∞" : MINUS + "∞";
  var r = r9(x);
  if (Number.isInteger(r) || near(r * 2, Math.round(r * 2))) return num(r, 2);
  if (near(r * 3, Math.round(r * 3), 1e-7)) return Q.txt(Q.of(Math.round(r * 3), 3));
  return "≈ " + num(r, 2);
}
function tHTML(x){ var s = tTxt(x); return s.indexOf("≈") === 0 ? m("t") + " " + s : m("t = " + s.replace(MINUS, "-")); }

// ---------- motions ----------
function makeMotion(d){
  var C = d.c, V = pd(C), A = pd(V), t1 = d.t1;
  var Mo = { id:d.id, c:C, t0:0, t1:t1, vert:!!d.vert, letter:d.vert ? "h" : "s", vSrc:d.vSrc || "v = " + polySrc(V), aSrc:d.aSrc || "a = " + polySrc(A),
    s:function(t){ return pv(C, t); }, v:function(t){ return pv(V, t); }, a:function(t){ return pv(A, t); } };
  Mo.vz = roots(V, 0, t1); Mo.az = roots(A, 0, t1);
  Mo.turns = Mo.vz.filter(function(r){ return !r.touch; }).map(function(r){ return r.x; });
  var sm = [Infinity, -Infinity], vm = [0, 0], am = [0, 0], ts = [];
  for (var i = 0; i <= 240; i++) ts.push(t1 * i / 240);
  ts = ts.concat(Mo.vz.map(function(r){ return r.x; }));
  ts.forEach(function(t){ var s = Mo.s(t), v = Mo.v(t), a = Mo.a(t); sm = [Math.min(sm[0], s), Math.max(sm[1], s)]; vm = [Math.min(vm[0], v), Math.max(vm[1], v)]; am = [Math.min(am[0], a), Math.max(am[1], a)]; });
  Mo.smin = sm[0]; Mo.smax = sm[1]; Mo.vlo = vm[0]; Mo.vhi = vm[1]; Mo.alo = am[0]; Mo.ahi = am[1];
  Mo.vmax = Math.max(Math.abs(vm[0]), Math.abs(vm[1]), 1e-6); Mo.amax = Math.max(Math.abs(am[0]), Math.abs(am[1]), 1e-6);
  var pad = Math.max(0.5, (sm[1] - sm[0]) * 0.07); Mo.lo = sm[0] - pad; Mo.hi = sm[1] + (d.vert ? Math.max(pad, (sm[1] - sm[0]) * 0.12) : pad);
  Mo.dist = function(t){ var pts = [0].concat(Mo.turns.filter(function(z){ return z < t; }), [t]), s = 0; for (var k = 0; k + 1 < pts.length; k++) s += Math.abs(Mo.s(pts[k + 1]) - Mo.s(pts[k])); return s; };
  Mo.disp = function(t){ return Mo.s(t) - Mo.s(0); };
  Mo.dirs = d.vert ? ["up", "down"] : ["right", "left"];
  return Mo;
}
var MDEF = {
  M1:{ id:"M1", c:[0, 9, -6, 1], t1:4.5, vSrc:"v = 3(t - 1)(t - 3)", aSrc:"a = 6t - 12" },
  M2:{ id:"M2", c:[12, -8, 1], t1:8, vSrc:"v = 2t - 8", aSrc:"a = 2" },
  M3:{ id:"M3", c:[25, 20, -5], t1:5, vert:true, vSrc:"v = -10t + 20", aSrc:"a = -10" },
  M4:{ id:"M4", c:[0, 45, -12, 1], t1:7, vSrc:"v = 3(t - 3)(t - 5)", aSrc:"a = 6t - 24" }
};
function motion(id, b, c){ return id === "B" ? makeMotion({ id:"B", c:[0, c, b, 1], t1:6 }) : makeMotion(MDEF[id]); }
function dirText(Mo, v){ return Math.abs(v) < 1e-9 ? "at rest" : "moving " + (v > 0 ? Mo.dirs[0] + " (positive direction)" : Mo.dirs[1] + " (negative direction)"); }
function spdText(v, a){
  if (Math.abs(v) < 1e-9) return "neither (" + m("v = 0") + ")";
  if (Math.abs(a) < 1e-9) return "neither (" + m("a = 0") + ")";
  return v * a > 0 ? "speeding up (" + m("v") + " and " + m("a") + " both " + (v > 0 ? "positive" : "negative") + ")" : "slowing down (opposite signs)";
}

// ---------- canvas helpers ----------
function arrowTo(ctx, x0, y0, x1, y1, col, w){
  var ang = Math.atan2(y1 - y0, x1 - x0), s = Math.max(8, w * 3.2), len = Math.hypot(x1 - x0, y1 - y0);
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
  if (len > s * 0.8) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - Math.cos(ang) * s * 0.7, y1 - Math.sin(ang) * s * 0.7); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - s * Math.cos(ang - 0.42), y1 - s * Math.sin(ang - 0.42)); ctx.lineTo(x1 - s * Math.cos(ang + 0.42), y1 - s * Math.sin(ang + 0.42)); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function bgText(ctx, text, x, y, align, col, font, base){
  ctx.save(); ctx.font = font; ctx.textAlign = align || "left"; ctx.textBaseline = base || "middle";
  var w = ctx.measureText(text).width, x0 = align === "right" ? x - w : align === "center" ? x - w / 2 : x, h = +((/(\d+)px/.exec(font) || [0, 13])[1]);
  var yTop = base === "top" ? y : base === "bottom" ? y - h : y - h / 2;
  ctx.globalAlpha = 0.9; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, yTop - 2, w + 6, h + 4); ctx.globalAlpha = 1;
  ctx.fillStyle = col || css("--ink"); ctx.fillText(text, x, y); ctx.restore();
}

// =====================================================================================================================
// @component V9 motionTrack (adapted from MCV4U 03) — a particle on a horizontal or vertical track driven by s(t): ruler in
// metres, the particle (--pen), a ghost trail (--ink-2, older = fainter), a teal velocity arrow labelled v (length ∝ |v|), a
// magenta acceleration arrow labelled a ("v = 0" / "a = 0" when one vanishes), ghost marks with labels and an extra() layer.
// Optional controls in ctlHost: Play / Pause, Step back, Step (±step s) and a time slider in 0.05 s (arrows 0.05 s, Shift +
// arrows 0.5 s, Space plays or pauses). Reduced motion: Play jumps 0.5 s at a time with no glide (trails still draw).
//   var mt = motionTrack(box, { s, v, acc, t0, t1, orient:"h"|"v", lo, hi, ground, vmax, amax, trail, varr, aarr, dirs,
//     marks() -> [{t, label}], extra(ctx, plot, P, t), strip (compact), ctlHost, step:0.5, speed:1, t, onTime(t, how), name });
//   mt.set(t, quiet), get(), play(), pause(), playing(), config(o), lock(bool), refresh(), plot
function motionTrack(box, o){
  var cfg = Object.assign({ unit:"m", dirs:["right", "left"], trail:true, varr:true, aarr:true, step:0.5, speed:1, name:"The particle", strip:false }, o);
  var t = cfg.t != null ? cfg.t : cfg.t0, raf = null, timer = null, locked = false;
  box.classList.add("mt-box");
  box.innerHTML = '<canvas class="mt-c" role="img" aria-label="Motion track"></canvas>';
  var plot = new MV.Plot(box.querySelector("canvas"), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function horiz(){ return cfg.orient !== "v"; }
  function desc(){
    var s = cfg.s(t), v = cfg.v(t), a = cfg.acc ? cfg.acc(t) : null, d = horiz() ? cfg.dirs : ["up", "down"];
    return "Motion track. At t = " + num(t, 2) + " s, " + cfg.name.toLowerCase() + " is at " + num(s, 3) + " " + cfg.unit + ", " +
      (Math.abs(v) < 1e-9 ? "at rest" : "moving " + (v > 0 ? d[0] : d[1]) + " at " + num(Math.abs(v), 3) + " m/s") +
      (a != null ? "; acceleration " + num(a, 3) + " m/s²" + (Math.abs(v) > 1e-9 && Math.abs(a) > 1e-9 ? (v * a > 0 ? ", speeding up" : ", slowing down") : "") : "") + "." +
      (cfg.marks ? cfg.marks().map(function(g){ return " Ghost dot at " + num(cfg.s(g.t), 3) + " " + cfg.unit + " (" + g.label + ")."; }).join("") : "");
  }
  function draw(){
    var H = horiz();
    plot.draw({ view:H ? { xmin:cfg.lo, xmax:cfg.hi, ymin:0, ymax:1 } : { xmin:0, xmax:1, ymin:cfg.lo, ymax:cfg.hi }, grid:false, axes:false, describe:desc(), after:paintTrack });
  }
  function paintTrack(ctx, p){
    var W = p.W, Hh = p.H, H = horiz(), ink2 = css("--ink-2"), narrow = W < 170;
    var ry = H ? Math.round(Hh * (cfg.strip ? 0.7 : 0.64)) + 0.5 : 0, rx = H ? 0 : Math.round(W * (narrow ? 0.42 : 0.4)) + 0.5;
    function P(s){ return H ? [p.X(s), ry] : [rx, p.Y(s)]; }
    // groove and rail
    var e0 = P(cfg.lo), e1 = P(cfg.hi), ins = 6;
    ctx.save(); ctx.lineCap = "round";
    ctx.strokeStyle = css("--rule"); ctx.lineWidth = 8; ctx.beginPath();
    if (H) { ctx.moveTo(e0[0] + ins, ry); ctx.lineTo(e1[0] - ins, ry); } else { ctx.moveTo(rx, e0[1] - ins); ctx.lineTo(rx, e1[1] + ins); }
    ctx.stroke(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.stroke();
    // ruler
    var len = H ? W : Hh, stp = MV.niceStep((cfg.hi - cfg.lo) / Math.max(2, Math.floor(len / (H ? 62 : 34))));
    ctx.font = ui(11, 400); ctx.fillStyle = ink2; ctx.strokeStyle = ink2; ctx.lineWidth = 1;
    for (var r = Math.ceil(cfg.lo / stp - 1e-9) * stp; r <= cfg.hi + 1e-9; r += stp) {
      var q = P(r); ctx.beginPath();
      if (H) { if (q[0] < 6 || q[0] > W - 6) continue; ctx.moveTo(q[0], ry + 5); ctx.lineTo(q[0], ry + 10); ctx.stroke(); if (q[0] < W - 26) { ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(num(r), q[0], ry + 12); } }
      else { if (q[1] < 16 || q[1] > Hh - 6) continue; ctx.moveTo(rx - 10, q[1]); ctx.lineTo(rx - 5, q[1]); ctx.stroke(); ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(num(r), rx - 13, q[1]); }
    }
    if (H) { ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(cfg.unit, W - 4, ry + 12); }
    else { ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(cfg.unit, rx - 13, 2); }
    if (!H && cfg.ground != null) { var gy = p.Y(cfg.ground); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx - 28, gy); ctx.lineTo(rx + 28, gy); ctx.stroke(); }
    ctx.restore();
    if (cfg.extra) cfg.extra(ctx, p, P, t, { H:H, rx:rx, ry:ry });
    var s = cfg.s(t), v = cfg.v(t), here = P(s);
    // ghost trail
    if (cfg.trail && t > cfg.t0) {
      var n = 48, dt = (cfg.t1 - cfg.t0) / n;
      ctx.save(); ctx.fillStyle = ink2;
      for (var k = 0; k < n; k++) {
        var tau = cfg.t0 + k * dt; if (tau > t - dt * 0.5) break;
        var g = P(cfg.s(tau)); ctx.globalAlpha = 0.1 + 0.4 * (tau - cfg.t0) / Math.max(1e-9, t - cfg.t0);
        ctx.beginPath(); ctx.arc(g[0], g[1], 3.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // ghost marks
    (cfg.marks ? cfg.marks() : []).forEach(function(gd, i){
      var q = P(cfg.s(gd.t));
      ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = ink2; ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (H) { ctx.save(); ctx.strokeStyle = ink2; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(q[0], 20 + (i % 2) * 15); ctx.lineTo(q[0], ry - 9); ctx.stroke(); ctx.restore();
        bgText(ctx, gd.label, clamp(q[0], 50, W - 50), 4 + (i % 2) * 15, "center", ink2, ui(12, 600), "top"); }
      else bgText(ctx, gd.label, rx + (narrow ? 12 : 50), q[1], "left", ink2, ui(12, 600));
    });
    // particle
    ctx.save(); ctx.fillStyle = css("--pen"); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(here[0], here[1], cfg.strip ? 8 : 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    // arrows: v (teal) and a (magenta)
    var full = (H ? W : Hh) * 0.36;
    function lane(val, max, col, w, letter, off){
      var L = clamp(val / max, -1.15, 1.15) * full;
      if (Math.abs(val) > 1e-9 && Math.abs(L) < 10) L = (L < 0 ? -10 : 10);
      if (H) {
        var y = ry - off;
        if (Math.abs(val) < 1e-9) { bgText(ctx, letter + " = 0", clamp(here[0], 26, W - 26), y, "center", col, mf(13)); return; }
        arrowTo(ctx, here[0], y, here[0] + L, y, col, w);
        var lx = here[0] + L + (L > 0 ? 7 : -7), al = L > 0 ? "left" : "right";
        if (lx > W - 14) { lx = here[0] - 7; al = "right"; } if (lx < 14) { lx = here[0] + 7; al = "left"; }
        ctx.save(); ctx.font = mf(14); ctx.fillStyle = col; ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.fillText(letter, lx, y); ctx.restore();
      } else {
        var x = rx + off;
        if (Math.abs(val) < 1e-9) { bgText(ctx, letter + " = 0", rx + (narrow ? 12 : 50), clamp(here[1] + (letter === "v" ? -9 : 9), 10, Hh - 10), "left", col, mf(13)); return; }
        arrowTo(ctx, x, here[1], x, here[1] - L, col, w);
        var ly = clamp(here[1] - L + (L > 0 ? -9 : 9), 9, Hh - 9);
        ctx.save(); ctx.font = mf(14); ctx.fillStyle = col; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(letter, x, ly); ctx.restore();
      }
    }
    if (cfg.varr) lane(v, cfg.vmax || 1, css("--f3"), 3, "v", H ? (cfg.strip ? 20 : 25) : (narrow ? 14 : 18));
    if (cfg.aarr && cfg.acc) lane(cfg.acc(t), cfg.amax || 1, css("--f4"), 2.6, "a", H ? (cfg.strip ? 40 : 50) : (narrow ? 32 : 40));
  }
  plot.render = draw;
  // ---- controls ----
  var ctl = cfg.ctlHost, slider = null;
  if (ctl) {
    ctl.innerHTML = '<div class="mt-ctl"><div class="q-actions mt-btns"><button type="button" class="btn primary sm" data-mt="play" data-k="mtplay">Play</button>' +
      '<button type="button" class="btn ghost sm" data-mt="back" data-k="mtback" aria-label="Step back 0.5 s">Step back</button><button type="button" class="btn ghost sm" data-mt="step" data-k="mtstep" aria-label="Step forward 0.5 s">Step</button></div>' +
      '<label class="slider mt-sl"><span class="slider-top"><span>Time ' + m("t") + '</span><output class="mt-out"></output></span><input type="range" class="mt-t" step="0.05" style="accent-color:var(--ink)" aria-label="Time t, in seconds"></label>' +
      '<p class="tiny muted mt-tip">Arrow keys move the time by 0.05 s; Shift + arrow by 0.5 s. Space plays or pauses.</p></div>';
    slider = ctl.querySelector(".mt-t");
    ctl.addEventListener("click", function(e){
      var b = e.target.closest("[data-mt]"); if (!b || b.disabled || locked) return;
      var a = b.dataset.mt;
      if (a === "play") { if (playing()) pause(); else play(); }
      else if (a === "step") { pause(); setT(snapT(Math.min(cfg.t1, t + cfg.step)), "step"); }
      else if (a === "back") { pause(); setT(snapT(Math.max(cfg.t0, t - cfg.step)), "step"); }
    });
    slider.addEventListener("input", function(){ if (locked) { paintCtl(); return; } pause(); setT(snapT(+slider.value), "slider"); });
    slider.addEventListener("keydown", function(e){
      if (locked) return;
      if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); if (playing()) pause(); else play(); return; }
      if (!e.shiftKey) return;
      var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
      e.preventDefault(); pause(); setT(snapT(clamp(t + d * 0.5, cfg.t0, cfg.t1)), "slider");
    });
  }
  function paintCtl(){
    if (!ctl) return;
    slider.min = cfg.t0; slider.max = cfg.t1; slider.value = t; slider.disabled = locked;
    slider.setAttribute("aria-valuetext", num(t, 2) + " seconds");
    ctl.querySelector(".mt-out").textContent = num(t, 2) + " s";
    var pb = ctl.querySelector('[data-mt="play"]'); pb.textContent = playing() ? "Pause" : "Play"; pb.disabled = locked;
    ctl.querySelector('[data-mt="back"]').disabled = locked || t <= cfg.t0 + 1e-9; ctl.querySelector('[data-mt="step"]').disabled = locked || t >= cfg.t1 - 1e-9;
  }
  function refresh(){ draw(); paintCtl(); }
  function setT(n, how){ t = clamp(n, cfg.t0, cfg.t1); refresh(); if (cfg.onTime) cfg.onTime(t, how); }
  function playing(){ return !!(raf || timer); }
  function pause(){
    var was = playing();
    if (raf) { cancelAnimationFrame(raf); raf = null; } if (timer) { clearInterval(timer); timer = null; }
    if (was) { t = snapT(t); refresh(); if (cfg.onTime) cfg.onTime(t, "pause"); }
  }
  function play(){
    if (locked || playing()) return;
    if (t >= cfg.t1 - 1e-9) setT(cfg.t0, "slider");
    if (MV.reduceMotion) {
      timer = setInterval(function(){ var n = snapT(Math.min(cfg.t1, t + 0.5)); setT(n, "play"); if (n >= cfg.t1 - 1e-9) pause(); }, 650);
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
  refresh();
  return {
    set:function(n, quiet){ t = clamp(n, cfg.t0, cfg.t1); refresh(); if (!quiet && cfg.onTime) cfg.onTime(t, "set"); },
    get:function(){ return t; }, play:play, pause:pause, playing:playing,
    config:function(o2){ pause(); Object.assign(cfg, o2 || {}); if (o2 && o2.t != null) t = o2.t; t = clamp(t, cfg.t0, cfg.t1); refresh(); },
    lock:function(v){ locked = !!v; if (locked) pause(); paintCtl(); },
    refresh:refresh, plot:plot
  };
}
// ------------------------------------------------- end of V9 motionTrack --------------------------------------------------------

// =====================================================================================================================
// @component V5 motionPanels (adapted from MCV4U 07/11 derivativePanels) — linked s–t (--pen, 3 px), v–t (--f3, 2.6 px) and
// a–t (--f4, 2.4 px) panels on one shared t-axis with one dashed time probe and a ringed dot on each curve; tap or drag a
// panel to move the time. On phones one panel shows at a time, chosen with s / v / a tabs (the probe stays in sync).
//   var pn = motionPanels(host, { M(), t(), setT(t), tab:"s", onTab(k), extra(i, scene, plot), locked(), plain() })
//   -> { render(), plots, tab(k) }
function motionPanels(host, o){
  var K = ["s", "v", "a"], NAME = { s:"Position", v:"Velocity", a:"Acceleration" }, UNIT = { s:"m", v:"m/s", a:"m/s²" }, COL = { s:"--pen", v:"--f3", a:"--f4" }, WID = { s:3, v:2.6, a:2.4 };
  host.classList.add("va-pn");
  host.innerHTML = '<div class="seg va-tabs" role="group" aria-label="Graph to show">' + K.map(function(k){
      return '<button type="button" data-tab="' + k + '" data-k="vatab' + k + '" aria-pressed="false"><i class="va-tl" data-tl="' + k + '">' + k + "</i>–<i>t</i></button>"; }).join("") + "</div>" +
    K.map(function(k){ return '<div class="plot-wrap va-pw" data-p="' + k + '"><canvas class="plot va-pc" role="img" aria-label="' + NAME[k] + ' graph"></canvas></div>'; }).join("");
  var plots = $$("canvas", host).map(function(c){ return new MV.Plot(c, { xmin:0, xmax:1, ymin:0, ymax:1 }); });
  function letter(k){ return k === "s" ? o.M().letter : k; }
  function tab(k){ host.dataset.tab = k; $$("[data-tab]", host).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.tab === k)); }); $$("[data-tl=s]", host).forEach(function(e){ e.textContent = letter("s"); }); }
  function scene(i){
    var Mo = o.M(), k = K[i], f = k === "s" ? Mo.s : k === "v" ? Mo.v : Mo.a, t = o.t(), L = letter(k);
    var lo = k === "s" ? Mo.smin : k === "v" ? Mo.vlo : Mo.alo, hi = k === "s" ? Mo.smax : k === "v" ? Mo.vhi : Mo.ahi;
    lo = Math.min(lo, 0); hi = Math.max(hi, 0); if (hi - lo < 1e-6) { lo -= 1; hi += 1; }
    var pad = (hi - lo) * 0.14, span = Mo.t1 - Mo.t0, V = { xmin:Mo.t0 - span * 0.06, xmax:Mo.t1 + span * 0.04, ymin:lo - pad, ymax:hi + pad };
    var col = css(COL[k]), y = f(t);
    var sc = { view:V, xLabel:"t", curves:[{ f:f, color:col, width:WID[k], domain:[Mo.t0, Mo.t1] }], points:[], labels:[], segments:[] };
    sc.after = function(ctx, p){
      var X = p.X(t); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, p.H); ctx.stroke(); ctx.restore();
      p.point({ x:t, y:y, r:5.5, color:col, ring:true });
      var x0 = Math.min(Math.max(p.X(0) + 8, 6), p.W - 120);
      ctx.save(); ctx.textBaseline = "top"; ctx.textAlign = "left"; ctx.font = mf(14); ctx.fillStyle = col; ctx.fillText(L, x0, 4);
      var w = ctx.measureText(L).width; ctx.font = ui(12, 400); ctx.fillStyle = css("--ink-2"); ctx.fillText(" (" + UNIT[k] + ")", x0 + w, 6); ctx.restore();
    };
    sc.describe = NAME[k] + " graph: " + L + " against t for " + (o.plain ? o.plain() : "the motion") + ", 0 ≤ t ≤ " + num(Mo.t1) + ". At t = " + num(t, 2) + " s, " + L + " = " + num(y, 3) + " " + UNIT[k] + ".";
    return sc;
  }
  function render(){ plots.forEach(function(p, i){ var sc = scene(i); if (o.extra) o.extra(i, sc, p); p.draw(sc); }); }
  plots.forEach(function(p){
    p.render = render;
    var active = false;
    function at(e){ var r = p.c.getBoundingClientRect(); return p.xOf(e.clientX - r.left); }
    p.c.addEventListener("pointerdown", function(e){ if (!p.v || (o.locked && o.locked())) return; active = true; try { p.c.setPointerCapture(e.pointerId); } catch (err) {} o.setT(at(e)); });
    p.c.addEventListener("pointermove", function(e){ if (active && !(o.locked && o.locked())) o.setT(at(e)); });
    p.c.addEventListener("pointerup", function(){ active = false; }); p.c.addEventListener("pointercancel", function(){ active = false; });
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-tab]"); if (!b) return; tab(b.dataset.tab); if (o.onTab) o.onTab(b.dataset.tab); });
  tab(o.tab || "s");
  return { render:render, plots:plots, tab:tab };
}
// ------------------------------------------------- end of V5 motionPanels -------------------------------------------------------

// =====================================================================================================================
// @component V11 motionSignChart (MCV4U 11 signChart adapted for motion) — columns for the open intervals between the critical
// times (zeros of v and of a) and for the critical times themselves; rows for the sign of v, the sign of a and a motion row
// (filled by cell(col): chips, text or ✓/✗; "at rest" or "neither" at the critical times). The column holding the time t is
// highlighted; the table scrolls inside its box on phones.
//   chartCols(Mo) -> [{iv:true, a, b, mid, k} | {iv:false, x, v0, a0}];  chartHTML({ cols, Mo, t, vLab, aLab, cell(col), caption })
function chartCols(Mo){
  var pts = [];
  function add(x, k){ var e = pts.filter(function(p){ return near(p.x, x, 1e-7); })[0]; if (!e) { e = { x:x }; pts.push(e); } e[k] = true; }
  Mo.vz.forEach(function(r){ add(r.x, "v"); }); Mo.az.forEach(function(r){ add(r.x, "a"); });
  pts.sort(function(p, q){ return p.x - q.x; });
  var b = [Mo.t0].concat(pts.map(function(p){ return p.x; }), [Mo.t1]), cols = [], k = 0;
  for (var i = 0; i + 1 < b.length; i++) {
    cols.push({ iv:true, a:b[i], b:b[i + 1], mid:(b[i] + b[i + 1]) / 2, k:k++ });
    if (i < pts.length) cols.push({ iv:false, x:pts[i].x, v0:!!pts[i].v, a0:!!pts[i].a });
  }
  return cols;
}
function sgn(v){ return v > 1e-9 ? "+" : v < -1e-9 ? MINUS : "0"; }
function chartHTML(o){
  var cols = o.cols, Mo = o.Mo, hl = -1;
  if (o.t != null) cols.forEach(function(c, j){ if (hl < 0 && (c.iv ? o.t > c.a + 1e-9 && o.t < c.b - 1e-9 : near(o.t, c.x, 1e-6))) hl = j; });
  function cell(j, h, cls){ var c = [j === hl ? "hl" : "", cls || ""].join(" ").trim(); return "<td" + (c ? ' class="' + c + '"' : "") + ">" + h + "</td>"; }
  var h = '<div class="tbl-wrap va-scwrap"><table class="vt va-sct"><caption class="vh">' + o.caption + "</caption><thead><tr><th scope=\"col\">" + m("t") + "</th>" +
    cols.map(function(c, j){ return '<th scope="col"' + (j === hl ? ' class="hl"' : "") + ">" + (c.iv ? "(" + tTxt(c.a) + ", " + tTxt(c.b) + ")" : tTxt(c.x)) + "</th>"; }).join("") + "</tr></thead><tbody>";
  h += '<tr><th scope="row">' + o.vLab + "</th>" + cols.map(function(c, j){ return cell(j, c.iv ? sgn(Mo.v(c.mid)) : c.v0 ? "0" : sgn(Mo.v(c.x)), "va-sg"); }).join("") + "</tr>";
  h += '<tr><th scope="row">' + o.aLab + "</th>" + cols.map(function(c, j){ return cell(j, c.iv ? sgn(Mo.a(c.mid)) : c.a0 ? "0" : sgn(Mo.a(c.x)), "va-sg"); }).join("") + "</tr>";
  h += '<tr class="va-mrow"><th scope="row">Motion</th>' + cols.map(function(c, j){ return c.iv ? cell(j, o.cell(c), "va-mc") : cell(j, c.v0 ? "at rest" : "neither", "va-pt"); }).join("") + "</tr>";
  return h + "</tbody></table></div>";
}
function truthOf(Mo, c){ return Mo.v(c.mid) * Mo.a(c.mid) > 0 ? "u" : "s"; }
var SPDW = { u:"speeding up", s:"slowing down" };
// ------------------------------------------------- end of V11 motionSignChart ---------------------------------------------------

// ---------- hero: the particle on s(t) = t³ − 6t² + 9t ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var Mo = makeMotion(MDEF.M1), LO = -0.45, HI = 4.65, VMAX = 9, AMAX = 12, FR = [0.5, 1.5, 3.5];
  var p = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), st = { t:0, frames:false, ph:"", popAt:0 };
  function phase(t){ var v = Mo.v(t), a = Mo.a(t); if (Math.abs(v) < 1e-6) return "at rest"; if (Math.abs(a) < 1e-6) return ""; return v * a > 0 ? "speeding up" : "slowing down"; }
  function dirW(t){ var v = Mo.v(t); return Math.abs(v) < 1e-6 ? "at rest" : v > 0 ? "moving right" : "moving left"; }
  function signs(t){ var v = Mo.v(t), a = Mo.a(t); return m(Math.abs(v) < 1e-6 ? "v = 0" : v > 0 ? "v > 0" : "v < 0") + ", " + m(Math.abs(a) < 1e-6 ? "a = 0" : a > 0 ? "a > 0" : "a < 0"); }
  function capFor(t, noT){ var ph = phase(t), d = dirW(t), txt = d + (ph && ph !== "at rest" ? ", " + ph : "") + " (" + signs(t) + ")."; return noT ? txt.charAt(0).toUpperCase() + txt.slice(1) : m("t = " + num(t, 2)) + " s: " + txt; }
  function row(ctx, pl, y0, h, t, o){
    var W = pl.W, xL = W * 0.05, xR = W * 0.95, X = function(s){ return xL + (s - LO) / (HI - LO) * (xR - xL); };
    var small = !!o.small, ry = Math.round(y0 + h * (small ? 0.74 : 0.62)) + 0.5, vy = ry - (small ? 15 : 30), ay = ry - (small ? 29 : 60), ink2 = css("--ink-2");
    ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = css("--rule"); ctx.lineWidth = small ? 6 : 8; ctx.beginPath(); ctx.moveTo(X(LO) + 4, ry); ctx.lineTo(X(HI) - 4, ry); ctx.stroke();
    ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1; ctx.fillStyle = ink2; ctx.font = ui(small ? 10 : 12, 400);
    for (var s = 0; s <= 4; s++) { ctx.beginPath(); ctx.moveTo(X(s), ry + 4); ctx.lineTo(X(s), ry + 9); ctx.stroke(); if (!small || o.last) { ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(String(s), X(s), ry + 10); } }
    if (!small || o.last) { ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("m", xR, ry + 10); }
    ctx.restore();
    var x = X(Mo.s(t)), v = Mo.v(t), a = Mo.a(t);
    if (!small && t > 0) {
      ctx.save(); ctx.fillStyle = ink2;
      for (var k = 0; k <= 32; k++) { var tau = k * 4 / 32; if (tau > t - 0.06) break; ctx.globalAlpha = 0.08 + 0.32 * tau / t; ctx.beginPath(); ctx.arc(X(Mo.s(tau)), ry - 10, 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
    ctx.save(); ctx.fillStyle = css("--pen"); ctx.strokeStyle = css("--sheet"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, ry, small ? 7 : 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
    var full = (xR - xL) * 0.3;
    [[v, VMAX, "--f3", "v", vy, small ? 2.4 : 3.2], [a, AMAX, "--f4", "a", ay, small ? 2.2 : 2.8]].forEach(function(q){
      var col = css(q[2]), L = q[0] / q[1] * full;
      if (Math.abs(q[0]) < 1e-6) { bgText(ctx, q[3] + " = 0", clamp(x, 30, W - 30), q[4], "center", col, mf(small ? 12 : 14)); return; }
      if (Math.abs(L) < 10) L = L < 0 ? -10 : 10;
      arrowTo(ctx, x, q[4], x + L, q[4], col, q[5]);
      var lx = x + L + (L > 0 ? 7 : -7); ctx.save(); ctx.font = mf(small ? 13 : 15); ctx.fillStyle = col; ctx.textAlign = L > 0 ? "left" : "right"; ctx.textBaseline = "middle"; ctx.fillText(q[3], lx, q[4]); ctx.restore();
    });
    if (small) {
      bgText(ctx, "t = " + num(t, 1) + " s", xL, y0 + 4, "left", css("--ink"), ui(12, 700), "top");
      var ph = phase(t); bgText(ctx, dirW(t) + (ph ? ", " + ph : ""), xR, y0 + 4, "right", css("--ink"), ui(12, 600), "top");
      if (!o.last) { ctx.save(); ctx.strokeStyle = css("--rule"); ctx.beginPath(); ctx.moveTo(0, Math.round(y0 + h) + 0.5); ctx.lineTo(W, Math.round(y0 + h) + 0.5); ctx.stroke(); ctx.restore(); }
    } else {
      bgText(ctx, "t = " + num(t, 2) + " s", xL, y0 + 10, "left", css("--ink"), ui(14, 700), "top");
      var ph2 = phase(t) || dirW(t), age = (window.performance ? performance.now() : 0) - st.popAt, sc = 1 + 0.3 * Math.max(0, 1 - age / 320);
      if (ph2) {
        ctx.save(); ctx.font = ui(Math.round(15 * sc), 700); var w = ctx.measureText(ph2).width, bx = clamp(x, w / 2 + 14, W - w / 2 - 14), by = Math.max(y0 + 34, ay - 36);
        ctx.fillStyle = css("--hi-soft"); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1;
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx - w / 2 - 9, by - 13 * sc, w + 18, 26 * sc, 8); else ctx.rect(bx - w / 2 - 9, by - 13 * sc, w + 18, 26 * sc); ctx.fill(); ctx.stroke();
        ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(ph2, bx, by); ctx.restore();
      }
    }
  }
  function desc(){
    if (st.frames) return "Three still frames of a particle on a horizontal track, s(t) = t³ − 6t² + 9t. At t = 0.5 s it is at 3.125 m, moving right and slowing down. At t = 1.5 s it is at 3.375 m, moving left and speeding up. At t = 3.5 s it is at 0.875 m, moving right and speeding up.";
    var t = st.t, v = Mo.v(t);
    return "A particle on a horizontal track, s(t) = t³ − 6t² + 9t. At t = " + num(t, 2) + " s it is at " + num(Mo.s(t), 3) + " m, " + (Math.abs(v) < 1e-6 ? "at rest" : dirW(t) + " at " + num(Math.abs(v), 2) + " m/s") + (phase(t) && phase(t) !== "at rest" ? ", " + phase(t) : "") + ".";
  }
  p.render = function(){
    p.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:desc(), after:function(ctx, pl){
      if (st.frames) FR.forEach(function(t, i){ row(ctx, pl, i * pl.H / 3, pl.H / 3, t, { small:true, last:i === 2 }); });
      else row(ctx, pl, 0, pl.H, st.t, {});
    } });
  };
  function cap(h){ if (f.cap) f.cap.innerHTML = h; }
  function setT(t){ st.t = t; var ph = phase(t) || dirW(t); if (ph !== st.ph) { st.ph = ph; st.popAt = performance.now(); cap(capFor(t, true)); } p.render(); }
  if (MV.reduceMotion) {
    st.frames = true;
    cap("Three moments: " + FR.map(function(t){ return capFor(t).replace(/\.$/, ""); }).join("; ") + ".");
    p.render(); return;
  }
  setT(0);
  function go(a, b, dur, cb){ MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(k){ setT(a + (b - a) * k); }, done:function(){ setT(b); if (cb) cb(); } }); }
  MV.wait(600, function(){
    go(0, 1, 1700, function(){ MV.wait(900, function(){
      go(1, 3, 3200, function(){ MV.wait(900, function(){
        go(3, 4, 1600, function(){ cap(capFor(4) + " It went right 4 m, back 4 m, then right 4 m again."); p.render(); });
      }); });
    }); });
  });
}

// ---------- Explore: the motion simulator ----------
var PST = { p1:{ mode:"track", t:1.5 }, p2:{ mode:"graphs", t:0 }, p3:{ mode:"track", t:0 }, p4:{ mode:"track", t:1 } };
function explore(host, api){
  var S = api.S, C = api.content, MS = {}, MOD = {};
  C.challenges.forEach(function(c){ MS[c.id] = c.msgs || {}; });
  C.motions.forEach(function(q){ MOD[q.id] = q; });
  if (!MOD[S.mo]) S.mo = "M1";
  if (["track", "graphs", "sign"].indexOf(S.mode) < 0) S.mode = "track";
  S.t = S.t || {}; S.tg = Object.assign({ trail:true, varr:true, aarr:true }, S.tg || {});
  S.b = Number.isInteger(S.b) ? S.b : -6; S.c = Number.isInteger(S.c) ? S.c : 9;
  S.tab = ["s", "v", "a"].indexOf(S.tab) >= 0 ? S.tab : "s"; S.fill = S.fill || {}; S.rev = S.rev || {};
  var busy = false, mark = null, note = "", MOT = null, hlKey = "";
  function key(){ return S.mo === "B" ? "B|" + S.b + "|" + S.c : S.mo; }
  function M(){ if (!MOT || MOT.key !== key()) { MOT = motion(S.mo, S.b, S.c); MOT.key = key(); } return MOT; }
  function tv(){ var v = S.t[S.mo]; return v == null ? 0 : clamp(v, 0, M().t1); }
  function plainEq(){ return S.mo === "B" ? "s(t) = " + MV.plain(m(polySrc(M().c))) : MOD[S.mo].plain; }
  host.innerHTML = '<div class="va-ex"><div class="va-main" data-mv="graph"><p class="eq-cap va-eq" id="va-eq"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="va-stage" id="va-stage"><div class="va-trk" id="va-trk"></div><div id="va-pn"></div><div class="va-sc" id="va-sc"></div></div>' +
    '<p class="va-cnt" id="va-cnt" aria-hidden="true"></p><p class="va-note" id="va-note" aria-live="polite"></p><div id="va-ctl"></div></div>' +
    '<div class="va-side"><div class="chips va-mos" id="va-mo" role="group" aria-label="Choose a motion"></div><div id="va-build"></div><div id="va-mode"></div>' +
    '<p class="tiny muted va-how" id="va-how"></p><div class="chips va-tgs" id="va-tg" role="group" aria-label="Show on the track"></div></div>' +
    '<div class="va-rd"><dl class="read va-read" id="va-read" aria-live="polite"></dl></div></div>';
  function q(sel){ return $(sel, host); }
  function trackCfg(){
    var Mo = M();
    return { s:Mo.s, v:Mo.v, acc:Mo.a, t0:0, t1:Mo.t1, orient:Mo.vert ? "v" : "h", lo:Mo.vert ? Math.min(Mo.lo, -2) : Mo.lo, hi:Mo.hi, ground:Mo.vert ? 0 : null,
      vmax:Mo.vmax, amax:Mo.amax, trail:S.tg.trail, varr:S.tg.varr, aarr:S.tg.aarr, dirs:Mo.dirs, t:tv(), strip:S.mode !== "track", name:Mo.vert ? "The ball" : "The particle" };
  }
  var mt = motionTrack(q("#va-trk"), Object.assign(trackCfg(), { ctlHost:q("#va-ctl"), onTime:onTime,
    marks:function(){ return mark && mark.track ? mark.track : []; } }));
  var pn = motionPanels(q("#va-pn"), { M:M, t:tv, tab:S.tab, plain:plainEq, locked:function(){ return busy; },
    setT:function(x){ mt.pause(); mt.set(snapT(clamp(x, 0, M().t1))); },
    onTab:function(k){ S.tab = k; api.save(); },
    extra:function(i, sc){
      if (!mark || !mark.pts) return;
      mark.pts.forEach(function(pt){ if (pt.i !== i) return; sc.points.push({ x:pt.x, y:pt.y, r:8, open:true, color:css("--ink") }); sc.labels.push({ x:pt.x, y:pt.y, text:pt.text, dx:10, dy:-16, align:"left", bg:true, font:ui(12) }); });
    } });
  function onTime(t, how){
    S.t[S.mo] = t;
    if (how !== "play") api.save();
    mark = null; if (!busy) note = "";
    refresh();
    if (how !== "play") MV.changed();
  }
  function refresh(){ paintRead(); paintCnt(); pn.render(); paintSC(false); paintNote(); }
  // ---- readouts ----
  function paintRead(){
    var Mo = M(), t = tv(), s = Mo.s(t), v = Mo.v(t), a = Mo.a(t), R = C.rows;
    q("#va-read").innerHTML = MV.readoutHTML([
      [R.time, m("t = " + num(t, 2)) + " s"],
      [Mo.vert ? "Height" : R.pos, m(Mo.letter) + rel(s, 3) + " m"],
      [R.vel, m("v") + rel(v, 3) + " m/s"],
      [R.speed, val(Math.abs(v), 3) + " m/s"],
      [R.acc, m("a") + rel(a, 3) + " m/s²"],
      [R.dir, dirText(Mo, v)],
      [R.spd, spdText(v, a)],
      [R.since, "displacement " + val(Mo.disp(t), 3) + " m · distance " + val(Mo.dist(t), 3) + " m"]
    ]);
  }
  function paintCnt(){ var Mo = M(), t = tv(); q("#va-cnt").innerHTML = '<span>displacement <strong>' + val(Mo.disp(t), 2) + ' m</strong></span><span>distance <strong>' + val(Mo.dist(t), 2) + " m</strong></span>"; }
  function paintNote(){ q("#va-note").innerHTML = note; }
  // ---- sign chart ----
  function paintSC(force){
    var el = q("#va-sc"), on = S.mode === "sign";
    el.hidden = !on; if (!on) { hlKey = ""; return; }
    var Mo = M(), cols = chartCols(Mo), t = tv(), k = key(), fill = S.fill[k] || (S.fill[k] = []), rev = !!S.rev[k];
    var hl = -1; cols.forEach(function(c, j){ if (hl < 0 && (c.iv ? t > c.a + 1e-9 && t < c.b - 1e-9 : near(t, c.x, 1e-6))) hl = j; });
    var hk = k + "|" + hl + "|" + rev + "|" + fill.join(",");
    if (!force && hk === hlKey) return;
    hlKey = hk;
    var ivs = cols.filter(function(c){ return c.iv; }), right = ivs.filter(function(c){ return fill[c.k] === truthOf(Mo, c); }).length;
    var h = '<h4 class="va-sch">Sign chart of ' + m("v") + " and " + m("a") + "</h4>" + chartHTML({ cols:cols, Mo:Mo, t:t, caption:"Sign chart of v and a for " + plainEq(), vLab:m(Mo.vSrc), aLab:m(Mo.aSrc),
      cell:function(c){
        var f = fill[c.k], tr = truthOf(Mo, c), lab = "(" + tTxt(c.a) + ", " + tTxt(c.b) + ")";
        if (rev) return f === tr ? '<span class="va-ok">✓ ' + SPDW[tr] + "</span>" : '<span class="va-no">✗ <s><span class="vh">you chose </span>' + (f ? SPDW[f] : "blank") + '</s><br><span class="vh">answer: </span>' + SPDW[tr] + "</span>";
        return '<span class="va-mch" role="group" aria-label="Motion on ' + lab + '">' + ["u", "s"].map(function(x){
          return '<button type="button" class="chip' + (f === x ? " on" : "") + '" data-mf="' + c.k + "|" + x + '" data-k="mf' + c.k + x + '" aria-pressed="' + (f === x) + '">' + SPDW[x] + "</button>"; }).join("") + "</span>";
      } });
    h += '<div class="q-actions">' + (rev ? '<button type="button" class="btn ghost sm" data-act="scclear" data-k="scclear">Try again</button>' : '<button type="button" class="btn primary sm" data-act="screv" data-k="screv">Reveal</button>') + "</div>";
    if (rev) h += MV.fbHTML(right === ivs.length ? "good" : "bad", (right === ivs.length ? "<strong>✓ All " + ivs.length + " right.</strong> " : "<strong>" + right + " of " + ivs.length + " right.</strong> ") + "Same signs: speeding up. Opposite signs: slowing down.");
    else if (scMsg) h += '<p class="tiny va-scmsg" role="status">' + scMsg + "</p>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  var scMsg = "";
  // ---- top controls ----
  function paintTop(){
    var Mo = M();
    q("#va-eq").innerHTML = "<strong>" + (S.mo === "B" ? "Build" : S.mo) + "</strong> " + MOD[S.mo].eq + (S.mo === "B" ? ' <span class="tiny muted">now</span> ' + m("s(t) = " + polySrc(Mo.c)) : "");
    MV.keepFocus(q("#va-mo"), function(){
      q("#va-mo").innerHTML = C.motions.map(function(o){ return '<button type="button" class="chip' + (o.id === S.mo ? " on" : "") + '" data-mo="' + o.id + '" data-k="mo' + o.id + '" aria-pressed="' + (o.id === S.mo) + '">' + (o.id === "B" ? "<strong>Build</strong>" : "<strong>" + o.id + "</strong> " + o.chip) + "</button>"; }).join("");
    });
    var bEl = q("#va-build"), want = S.mo === "B" ? "1" : "0";
    if (bEl.dataset.on !== want) {
      bEl.dataset.on = want;
      bEl.innerHTML = S.mo !== "B" ? "" : '<div class="va-bsl">' + [["b", -12, 12], ["c", -30, 30]].map(function(r){
        return '<label class="slider"><span class="slider-top"><span>' + m(r[0]) + '</span><output id="va-' + r[0] + 'out">' + num(S[r[0]]) + '</output></span><input type="range" data-bk="' + r[0] + '" min="' + r[1] + '" max="' + r[2] + '" step="1" value="' + S[r[0]] + '" style="accent-color:var(--ink)" aria-label="' + r[0] + " (" + num(r[1]) + " to " + num(r[2]) + ')"></label>'; }).join("") + "</div>";
    }
    MV.keepFocus(q("#va-mode"), function(){ q("#va-mode").innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Mode</span>' + segBtns("mode", C.modes, S.mode, "Mode") + "</div>"; });
    q("#va-how").innerHTML = C.modeHow[S.mode];
    MV.keepFocus(q("#va-tg"), function(){
      q("#va-tg").innerHTML = C.toggles.map(function(o){ var on = !!S.tg[o.id]; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-tg="' + o.id + '" data-k="tg' + o.id + '" aria-pressed="' + on + '">' + o.t + "</button>"; }).join("");
    });
    var stg = q("#va-stage"); stg.className = "va-stage m-" + S.mode + (Mo.vert ? " vert" : " horz");
    q("#va-pn").hidden = S.mode !== "graphs";
  }
  function paintAll(){ paintTop(); paintRead(); paintCnt(); pn.render(); paintSC(true); paintNote(); }
  function reconfig(){ mt.config(trackCfg()); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || busy) return;
    if (b.dataset.mo) { if (b.dataset.mo === S.mo) return; S.mo = b.dataset.mo; mark = null; note = ""; scMsg = ""; api.save(); paintTop(); reconfig(); paintAll(); MV.changed(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; mark = null; api.save(); paintTop(); reconfig(); paintAll(); MV.changed(); return; }
    if (b.dataset.tg) { S.tg[b.dataset.tg] = !S.tg[b.dataset.tg]; api.save(); paintTop(); mt.config({ trail:S.tg.trail, varr:S.tg.varr, aarr:S.tg.aarr }); return; }
    if (b.dataset.mf) {
      var pr = b.dataset.mf.split("|"), fl = S.fill[key()] || (S.fill[key()] = []); fl[+pr[0]] = fl[+pr[0]] === pr[1] ? null : pr[1]; scMsg = ""; api.save(); paintSC(true); return;
    }
    if (b.dataset.act === "screv") {
      var Mo = M(), ivs = chartCols(Mo).filter(function(c){ return c.iv; }), fl2 = S.fill[key()] || [];
      if (ivs.some(function(c){ return !fl2[c.k]; })) { scMsg = "Choose speeding up or slowing down for every interval first."; paintSC(true); return; }
      S.rev[key()] = true; scMsg = ""; api.save(); paintSC(true); MV.focusFb(q("#va-sc")); return;
    }
    if (b.dataset.act === "scclear") { S.rev[key()] = false; S.fill[key()] = []; api.save(); paintSC(true); return; }
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bk; if (!k || busy) return;
    S[k] = +e.target.value; q("#va-" + k + "out").textContent = num(S[k]);
    mark = null; scMsg = ""; api.save(); paintTop(); reconfig(); paintAll(); MV.changed();
  });
  paintAll();

  // ---- predictions ----
  var stopAnim = null;
  function setNote(h){ note = h; paintNote(); }
  function go(a, b, dur, cb){
    stopAnim = MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(k){ var t = a + (b - a) * k; S.t[S.mo] = t; mt.set(t, true); refresh(); },
      done:function(){ stopAnim = null; S.t[S.mo] = snapT(b); mt.set(S.t[S.mo], true); refresh(); if (cb) cb(); } });
  }
  function seen(list){ mark = mark || {}; mark.track = (mark.track || []).concat(list.track || []); mark.pts = (mark.pts || []).concat(list.pts || []); mt.refresh(); pn.render(); }
  // ---- challenges ----
  function chal(id){
    var X = MS[id], t = tv();
    if (id === "tc1") {
      if (S.mo !== "M2") return { ok:false, msg:X.mo };
      if (near(t, 2, 1e-6)) return { ok:true };
      if (near(t, 6, 1e-6)) return { ok:false, msg:X.t6 };
      if (near(t, 4, 1e-6)) return { ok:false, msg:X.t4 };
      return { ok:false, msg:tpl(X.other, { v:num(2 * t - 8, 2) }) };
    }
    if (id === "tc2") {
      if (S.mo !== "M4") return { ok:false, msg:X.mo };
      if (t > 3 + 1e-6 && t < 4 - 1e-6) return { ok:true };
      if (near(t, 3, 1e-6) || near(t, 5, 1e-6)) return { ok:false, msg:X.rest };
      if (near(t, 4, 1e-6)) return { ok:false, msg:X.a0 };
      if (t > 4 && t < 5) return { ok:false, msg:X.slow };
      return { ok:false, msg:X.right };
    }
    if (id === "tc3") {
      if (S.mo !== "B") return { ok:false, msg:X.mo };
      if (S.b === -9 && S.c === 27) return { ok:true };
      if (S.b === -6 && S.c === 9) return { ok:false, msg:X.w1 };
      if (S.b === -9 && S.c === 24) return { ok:false, msg:X.w2 };
      if (S.b === -9 && S.c === 30) return { ok:false, msg:X.w3 };
      var Mo = M(), z = roots(pd(Mo.c), 0, 6, true), left = false;
      for (var i = 0; i <= 600; i++) if (Mo.v(i / 100) < -1e-9) { left = true; break; }
      if (!z.length) return { ok:false, msg:X.none + (left ? X.left : "") };
      return { ok:false, msg:tpl(X.rest, { r:z.map(function(r){ return tHTML(r.x); }).join(" and ") }) + (left ? X.left : "") };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        if (stopAnim) { stopAnim(); stopAnim = null; }
        var st = PST[p.id] || { mode:"track", t:0 };
        busy = true; mt.lock(true); S.mo = p.mo; S.mode = st.mode; S.tg = { trail:true, varr:true, aarr:true }; mark = null; note = ""; scMsg = "";
        S.t[S.mo] = st.t; paintTop(); reconfig(); mt.lock(true); paintAll();
      },
      run:function(p, done){
        function fin(){ busy = false; mt.lock(false); api.save(); paintAll(); MV.changed(); done(); }
        if (p.id === "p1") {
          setNote("At " + m("t = 1.5") + " s: " + m("v = -2.25") + " m/s and " + m("a = -3") + " m/s². Both arrows point left.");
          MV.wait(1300, function(){ go(1.5, 1.95, 1800, function(){ setNote("Speed: 2.25 → 2.99 m/s. Same signs, so the speed climbs: speeding up."); MV.wait(900, fin); }); });
        } else if (p.id === "p2") {
          go(0, 1, 1100, function(){
            seen({ track:[{ t:1, label:"at rest, 4 m" }], pts:[{ i:1, x:1, y:0, text:"v = 0" }] }); setNote("At rest at " + m("t = 1") + " s, at 4 m: " + m("v = 0") + ".");
            MV.wait(1000, function(){ go(1, 3, 1900, function(){
              seen({ track:[{ t:3, label:"at rest, 0 m" }], pts:[{ i:1, x:3, y:0, text:"v = 0" }] }); setNote("At rest again at " + m("t = 3") + " s, at 0 m. At " + m("t = 2") + " only " + m("a = 0") + ": the particle kept moving.");
              MV.wait(1000, function(){ go(3, 4.5, 1100, fin); });
            }); });
          });
        } else if (p.id === "p3") {
          setNote("Watch the counters under the track.");
          go(0, 1, 1300, function(){ setNote("Right 4 m: distance 4 m."); MV.wait(500, function(){
            go(1, 3, 2400, function(){ setNote("Back 4 m to 0: distance 8 m, displacement 0 m."); MV.wait(500, function(){
              go(3, 4, 1300, function(){ setNote("Right 4 m again: distance 12 m, but the displacement is only " + m("s(4) - s(0) = 4") + " m."); MV.wait(900, fin); });
            }); });
          }); });
        } else if (p.id === "p4") {
          go(1, 2, 1500, function(){
            setNote("At the top: " + m("v = 0") + ", but the magenta acceleration arrow still points down: " + m("a = -10") + " m/s².");
            MV.wait(1300, fin);
          });
        } else fin();
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: Speeding up or slowing down? ----------
function numBox(id, label, unit, v, mode, dis){
  return '<label class="va-bx"><span class="va-bl">' + label + '</span><span class="va-bw"><input class="numin short" data-bx="' + id + '" data-k="bx' + id + '" type="text" inputmode="' + (mode || "decimal") + '" autocomplete="off" spellcheck="false" value="' + MV.esc(v || "") + '"' + (dis ? " disabled" : "") + ' aria-label="' + MV.esc(MV.plain(label) + (unit ? ", in " + unit : "")) + '">' +
    (unit ? '<span class="va-unit">' + unit + "</span>" : "") + "</span></label>";
}
function readNum(raw){ var t = String(raw == null ? "" : raw).trim(); if (!t) return { empty:true }; var p = MV.parseNum(t); return p && p.length === 1 && isFinite(p[0]) ? { v:p[0] } : { err:true }; }
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, A1 = MV.ans(s1), A2 = MV.ans(s2), A3 = MV.ans(s3);
  S.s1 = S.s1 || { pick:{}, timesOk:false, rows:[{}, {}, {}, {}], solved:false, tries:0 }; S.s1.rows = S.s1.rows || [{}, {}, {}, {}];
  S.s2 = S.s2 || { v:{}, solved:false }; S.s3 = S.s3 || { v:{}, solved:{} };
  var msg1t = "", msg1 = null, bad1 = {}, msg2 = null, bad2 = {}, msg3 = {};
  host.innerHTML =
    '<div class="part p3-st va-st" id="va-st1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><p class="va-tp">' + s1.timesPrompt + '</p><div class="chips" id="va-s1t" role="group" aria-label="Critical times"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s1t" data-k="s1t">Check the times</button></div><div id="va-s1tfb"></div><div id="va-s1tab"></div><div id="va-s1fb"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s1.alg.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details></div>" +
    '<div class="part p3-st va-st" id="va-st2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="va-s2"><div class="va-s2trk"><div class="va-trk2" id="va-trk2"></div><div id="va-ctl2"></div></div>' +
      '<div class="va-s2in" id="va-s2in"></div></div><div id="va-s2fb"></div></div>' +
    '<div class="part p3-st va-st" id="va-st3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div class="va-s3"><div class="va-s3trk"><div class="va-trk3" id="va-trk3"></div><div id="va-ctl3"></div></div>' +
      '<div class="va-s3q">' + s3.groups.map(function(g){ return '<div class="va-g" data-g="' + g.id + '"><h4>' + g.title + '</h4><div class="va-gin"></div><div class="va-gcl"></div>' +
        '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><div>' + g.alg + "</div></div></details></div>"; }).join("") + "</div></div></div>";
  // ---- Station 1: build the two-row sign chart ----
  var IVS = ["(0, 2)", "(2, 3)", "(3, 4)", "(4, ∞)"];
  function chip(on, data, label, dis){ return '<button type="button" class="chip' + (on ? " on" : "") + '" data-s1="' + data + '" data-k="s1' + data.replace(/\|/g, "") + '" aria-pressed="' + !!on + '"' + (dis ? " disabled" : "") + ">" + label + "</button>"; }
  function paint1(){
    var X = S.s1;
    MV.keepFocus($("#va-s1t", host), function(){ $("#va-s1t", host).innerHTML = s1.candidates.map(function(x){ return chip(X.pick[x], "t|" + x, m("t = " + x), X.timesOk); }).join(""); });
    $('[data-act="s1t"]', host).disabled = X.timesOk;
    $("#va-s1tfb", host).innerHTML = X.timesOk ? MV.fbHTML("good", s1.fb.times) : msg1t ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + msg1t) : "";
    var tb = $("#va-s1tab", host);
    if (!X.timesOk) { tb.innerHTML = ""; $("#va-s1fb", host).innerHTML = ""; return; }
    var h = '<div class="tbl-wrap"><table class="vt va-s1tb"><caption class="vh">Sign chart for s(t) = t³ − 9t² + 24t</caption><thead><tr><th scope="col">Interval</th><th scope="col">' + m("v") + '</th><th scope="col">' + m("a") + '</th><th scope="col">Motion</th></tr></thead><tbody>';
    IVS.forEach(function(iv, i){
      var R = X.rows[i] || (X.rows[i] = {}), dis = X.solved, cls = bad1[i] ? ' class="va-bad"' : X.solved ? ' class="va-good"' : "";
      h += "<tr" + cls + '><th scope="row">' + iv + (bad1[i] ? '<span class="vh"> (check this row)</span>' : "") + "</th>" +
        '<td data-l="v"><span class="chips va-sgc" role="group" aria-label="Sign of v on ' + iv + '">' + chip(R.v === 1, i + "|v|1", "+", dis) + chip(R.v === -1, i + "|v|-1", MINUS, dis) + "</span></td>" +
        '<td data-l="a"><span class="chips va-sgc" role="group" aria-label="Sign of a on ' + iv + '">' + chip(R.a === 1, i + "|a|1", "+", dis) + chip(R.a === -1, i + "|a|-1", MINUS, dis) + "</span></td>" +
        '<td class="va-mtd"><span class="chips va-mot" role="group" aria-label="Direction on ' + iv + '">' + chip(R.dir === "r", i + "|dir|r", "moving right", dis) + chip(R.dir === "l", i + "|dir|l", "moving left", dis) + "</span>" +
        '<span class="chips va-mot" role="group" aria-label="Speed on ' + iv + '">' + chip(R.spd === "u", i + "|spd|u", "speeding up", dis) + chip(R.spd === "s", i + "|spd|s", "slowing down", dis) + "</span></td></tr>";
    });
    h += "</tbody></table></div>" + (X.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s1c" data-k="s1c">Check the chart</button></div>');
    MV.keepFocus(tb, function(){ tb.innerHTML = h; });
    $("#va-s1fb", host).innerHTML = X.solved ? MV.fbHTML("good", s1.fb.done + " " + s1.alg[2]) : msg1 ? MV.fbHTML("bad", msg1) : "";
  }
  function check1t(){
    var X = S.s1, pick = s1.candidates.filter(function(x){ return X.pick[x]; }), want = A1.times;
    var extra = pick.filter(function(x){ return want.indexOf(x) < 0; }), miss = want.filter(function(x){ return pick.indexOf(x) < 0; });
    if (!extra.length && !miss.length) { X.timesOk = true; msg1t = ""; }
    else if (extra.length) msg1t = tpl(s1.fb.extra, { x:m("t = " + extra[0]) });
    else if (miss.indexOf(3) >= 0) msg1t = s1.fb.missA;
    else msg1t = s1.fb.missV;
    api.save(); paint1(); MV.focusFb($("#va-st1", host));
  }
  function check1(){
    var X = S.s1, R = A1.rows;
    if (X.rows.some(function(r){ return r.v == null || r.a == null || !r.dir || !r.spd; })) { msg1 = "Fill in every cell first: a sign for " + m("v") + " and " + m("a") + ", a direction and a speed for each interval."; paint1(); MV.focusFb($("#va-st1", host)); return; }
    bad1 = {}; var lines = [], motionOnly = false;
    X.rows.forEach(function(r, i){
      var signs = r.v === R[i].v && r.a === R[i].a, mot = r.dir === R[i].dir && r.spd === R[i].spd;
      if (!signs) { bad1[i] = 1; lines.push(IVS[i] + ": " + s1.rows[i].test); }
      else if (!mot) { bad1[i] = 1; motionOnly = true; }
    });
    if (!lines.length && !motionOnly) { X.solved = true; msg1 = null; }
    else { X.tries++; msg1 = "<strong>✗ Not yet.</strong> " + (lines.length ? lines.join(" ") + " " : "") + (motionOnly ? s1.fb.motion : "") + " Rows to check are marked."; }
    api.save(); paint1(); MV.focusFb($("#va-st1", host));
  }
  // ---- Station 2: legs and the leg replay ----
  var M2s = makeMotion({ id:"s2", c:[0, 24, -9, 1], t1:5 }), LEGS = [[0, 2], [2, 4], [4, 5]], LEGC = ["--pen", "--f3", "--f5"];
  var mt2 = motionTrack($("#va-trk2", host), { s:M2s.s, v:M2s.v, acc:M2s.a, t0:0, t1:5, orient:"h", lo:-1.5, hi:22.5, trail:false, varr:false, aarr:false, t:S.s2.t || 0,
    ctlHost:$("#va-ctl2", host), name:"The particle",
    onTime:function(t, how){ S.s2.t = t; if (how !== "play") api.save(); },
    extra:function(ctx, p, P, t, g){
      LEGS.forEach(function(L, i){
        if (t <= L[0] + 1e-9) return;
        var a = M2s.s(L[0]), b = M2s.s(Math.min(t, L[1])), y = g.ry - 26 - i * 28, col = css(LEGC[i]);
        if (Math.abs(p.X(b) - p.X(a)) > 2) arrowTo(ctx, p.X(a), y, p.X(b), y, col, 4);
        ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.X(a), y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        var done = t >= L[1] - 1e-9, lab = "leg " + (i + 1) + (done && S.s2.solved ? ": " + num(Math.abs(M2s.s(L[1]) - M2s.s(L[0]))) + " m" : "");
        bgText(ctx, lab, clamp((p.X(a) + p.X(b)) / 2, 48, p.W - 48), y - 12, "center", col, ui(12, 700));
      });
    } });
  var B2 = [["s0", "`s(0)`"], ["s2", "`s(2)`"], ["s4", "`s(4)`"], ["s5", "`s(5)`"], ["l1", "Leg 1, `t = 0` to 2"], ["l2", "Leg 2, `t = 2` to 4"], ["l3", "Leg 3, `t = 4` to 5"], ["dist", "Total distance"], ["disp", "Displacement"]];
  function paint2(){
    var X = S.s2, el = $("#va-s2in", host);
    function box(r){ return '<div class="va-bxw' + (bad2[r[0]] ? " va-bad" : "") + '">' + numBox("s2" + r[0], MV.md(r[1]), "m", X.v[r[0]], "decimal", X.solved) + "</div>"; }
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="va-gh">Positions</p><div class="va-bxs">' + B2.slice(0, 4).map(box).join("") + '</div><p class="va-gh">Leg lengths</p><div class="va-bxs">' + B2.slice(4, 7).map(box).join("") +
        '</div><p class="va-gh">The whole trip</p><div class="va-bxs">' + B2.slice(7).map(box).join("") + "</div>" + (X.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s2c" data-k="s2c">Check the table</button></div>');
    });
    $("#va-s2fb", host).innerHTML = X.solved ? MV.fbHTML("good", s2.fb.done) : msg2 ? MV.fbHTML(msg2.bad ? "bad" : "", msg2.html) : "";
    mt2.refresh();
  }
  function check2(){
    var X = S.s2, v = {}, i;
    for (i = 0; i < B2.length; i++) { var r = readNum(X.v[B2[i][0]]); if (r.empty) { msg2 = { html:"Fill in every box first." }; paint2(); return; } if (r.err) { msg2 = { html:"Type a number, such as 20 or 3.5, in each box." }; paint2(); return; } v[B2[i][0]] = r.v; }
    bad2 = {}; B2.forEach(function(r){ if (!near(v[r[0]], A2[r[0]], 1e-9)) bad2[r[0]] = 1; });
    var ks = Object.keys(bad2);
    if (!ks.length) { X.solved = true; msg2 = null; api.save(); paint2(); mt2.set(0, true); mt2.play(); MV.focusFb($("#va-st2", host)); return; }
    var why = ks.some(function(k){ return /^s\d/.test(k); }) ? s2.fb.pos : ks.some(function(k){ return /^l\d/.test(k); }) ? s2.fb.leg : bad2.dist ? s2.fb.dist : s2.fb.disp;
    if (bad2.dist && near(v.dist, A2.disp, 1e-9)) why = "That’s the displacement. " + s2.fb.dist;
    msg2 = { bad:true, html:"<strong>✗ Not yet.</strong> " + why + " The boxes to check are marked." }; api.save(); paint2(); MV.focusFb($("#va-st2", host));
  }
  // ---- Station 3: the cliff throw ----
  var M3s = makeMotion({ id:"s3", c:[35, 30, -5], t1:7, vert:true });
  var mt3 = motionTrack($("#va-trk3", host), { s:M3s.s, v:M3s.v, acc:M3s.a, t0:0, t1:7, orient:"v", lo:-5, hi:88, ground:0, vmax:40, amax:14, trail:true, varr:true, aarr:true, dirs:["up", "down"], t:S.s3.t || 0,
    ctlHost:$("#va-ctl3", host), name:"The ball", step:0.5,
    onTime:function(t, how){ S.s3.t = t; if (how !== "play") api.save(); },
    marks:function(){ var o = []; if (S.s3.solved.top) o.push({ t:3, label:"top: 80 m" }); if (S.s3.solved.land) o.push({ t:7, label:"lands: t = 7 s" }); return o; },
    extra:function(ctx, p, P, t, g){
      var y = p.Y(35), x = g.rx + 56; ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.W - 4, y); ctx.lineTo(x, y); ctx.lineTo(x, p.Y(0)); ctx.stroke(); ctx.restore();
      bgText(ctx, "cliff, 35 m", p.W - 6, y - 10, "right", css("--ink-2"), ui(11, 600));
    } });
  function paint3(g){
    var X = S.s3, box = $('[data-g="' + g.id + '"]', host), done = !!X.solved[g.id];
    MV.keepFocus($(".va-gin", box), function(){ $(".va-gin", box).innerHTML = '<div class="va-bxs">' + g.boxes.map(function(b){ return numBox("s3" + b.k, b.label, b.unit, X.v[b.k], "text", done); }).join("") + "</div>"; });
    var cl = $(".va-gcl", box), h = done ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s3" data-g="' + g.id + '" data-k="s3' + g.id + '">Check</button></div>';
    if (done) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> Compare your working with “Check it with algebra”.");
    else if (msg3[g.id]) h += MV.fbHTML(msg3[g.id].bad ? "bad" : "", msg3[g.id].html);
    MV.keepFocus(cl, function(){ cl.innerHTML = h; });
  }
  function check3(g){
    var X = S.s3, vals = {}, i;
    for (i = 0; i < g.boxes.length; i++) { var r = readNum(X.v[g.boxes[i].k]); if (r.empty) { msg3[g.id] = { html:g.boxes.length > 1 ? "Fill in both boxes first." : "Type your answer first." }; paint3(g); return; } if (r.err) { msg3[g.id] = { html:"Type a number, such as 12 or −3.5." }; paint3(g); return; } vals[g.boxes[i].k] = r.v; }
    if (g.boxes.every(function(b){ return near(vals[b.k], A3[b.k], 1e-9); })) { X.solved[g.id] = true; msg3[g.id] = null; api.save(); paint3(g); mt3.refresh(); MV.focusFb($('[data-g="' + g.id + '"]', host)); return; }
    var w = (g.wrong || []).filter(function(z){ return near(vals[z.k], z.v, 1e-9); })[0];
    var right = g.boxes.filter(function(b){ return near(vals[b.k], A3[b.k], 1e-9); });
    msg3[g.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + (w ? w.fb : right.length ? "Your " + MV.plain(right[0].label).toLowerCase() + " is right; check the other box." : g.hint) + " Try again." };
    api.save(); paint3(g); MV.focusFb($('[data-g="' + g.id + '"]', host));
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var X = S.s1;
    if (b.dataset.s1) {
      var p = b.dataset.s1.split("|");
      if (p[0] === "t") { X.pick[p[1]] = !X.pick[p[1]]; msg1t = ""; }
      else { var R = X.rows[+p[0]] || (X.rows[+p[0]] = {}), v = p[1] === "v" || p[1] === "a" ? +p[2] : p[2]; R[p[1]] = R[p[1]] === v ? null : v; delete bad1[+p[0]]; msg1 = null; }
      api.save(); paint1(); return;
    }
    if (b.dataset.act === "s1t") { check1t(); return; }
    if (b.dataset.act === "s1c") { check1(); return; }
    if (b.dataset.act === "s2c") { check2(); return; }
    if (b.dataset.act === "s3") { check3(s3.groups.filter(function(g){ return g.id === b.dataset.g; })[0]); return; }
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.bx; if (!k) return;
    if (k.indexOf("s2") === 0) { S.s2.v[k.slice(2)] = e.target.value; delete bad2[k.slice(2)]; }
    else if (k.indexOf("s3") === 0) S.s3.v[k.slice(2)] = e.target.value;
    api.save();
  });
  host.addEventListener("keydown", function(e){
    var k = e.key === "Enter" && e.target.dataset && e.target.dataset.bx; if (!k) return;
    var btn = k.indexOf("s2") === 0 ? $('[data-act="s2c"]', host) : e.target.closest("[data-g]") && $('[data-act="s3"]', e.target.closest("[data-g]"));
    if (btn) btn.click();
  });
  paint1(); paint2(); s3.groups.forEach(paint3);
  return {};
}

// ---------- Practice 1 figures: s–t and v–t thumbnails ----------
var THS = {
  1:{ s:function(t){ return 0.5 + 0.8 * t; }, v:function(){ return 0.8; } },
  2:{ s:function(){ return 2; }, v:function(){ return 0; } },
  3:{ s:function(t){ return 0.5 * (t - 2) * (t - 2) + 0.6; }, v:function(t){ return t - 2; } },
  4:{ s:function(t){ return -0.5 * (t - 2) * (t - 2) + 3.4; }, v:function(t){ return 2 - t; } },
  5:{ s:function(t){ return t * t * t / 3 - 2 * t * t + 3 * t + 0.8; }, v:function(t){ return t * t - 4 * t + 3; } },
  6:{ s:function(t){ return 3.7 - 0.8 * t; }, v:function(){ return -0.8; } },
  7:{ s:function(t){ return 3 * (1 - Math.exp(-t)) + 0.4; }, v:function(t){ return 3 * Math.exp(-t); } },
  8:{ s:function(t){ return 3 * Math.exp(-t) + 0.5; }, v:function(t){ return -3 * Math.exp(-t); } }
};
function thumb(kind, k){
  return function(p){
    var isS = kind === "s", V = { xmin:-0.45, xmax:4.35, ymin:isS ? -0.6 : -3.7, ymax:isS ? 4.3 : 3.7 };
    p.draw({ view:V, xLabel:"t", yLabel:isS ? "s" : "v", xTicks:{ step:1 }, yTicks:{ step:1, fmt:function(){ return ""; } },
      curves:[{ f:isS ? THS[k].s : THS[k].v, color:css(isS ? "--pen" : "--f3"), width:2.8, domain:[0, 4] }] });
  };
}
var FIGS = {};
for (var fk = 1; fk <= 8; fk++) { FIGS["st" + fk] = thumb("s", fk); FIGS["vt" + fk] = thumb("v", fk); }

// ---------- Practice 2: One trip, five questions ----------
// @component V8 tripBoxes — number entry with units (sets of times order-free; √7 and fractions accepted) plus an N10 interval
// builder item judged against open intervals; named wrong answers, three-level help where the plan gives hints, first-try scoring.
var S4MO = makeMotion({ id:"s4", c:[0, 60, -21, 2], t1:6, vSrc:"v = 6(t - 2)(t - 5)", aSrc:"a = 12t - 42" });
function tripAct(host, api, a){
  var S = api.S; S.it = S.it || {}; var msgs = {}, ib = null;
  function ist(id){ return S.it[id] || (S.it[id] = { val:"", iv:null, tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><p class="va-stem">' + a.stem + "</p>" + a.items.map(function(it, i){
    return '<div class="q va-tq" data-q="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + '</div><div class="va-tin"></div><div class="va-tcl"></div></div>';
  }).join("");
  function paintIn(it){
    var x = ist(it.id), el = $('[data-q="' + it.id + '"] .va-tin', host);
    if (it.kind === "iv") {
      if (!ib) {
        el.innerHTML = '<div class="va-ib"></div><div class="va-s4c"></div>';
        ib = MV.intervalBuilder($(".va-ib", el), { min:0, max:6, maxPieces:2, modes:false, test:false, readout:false, halfToggle:true, caption:true, aria:"Interval builder for the times when it’s speeding up",
          pieces:[{ a:1, b:4, aIn:false, bIn:false }], onChange:function(st){ ist(it.id).iv = st; api.save(); } });
        ib.set(x.iv || { pieces:[{ a:1, b:4, aIn:false, bIn:false, aInf:false, bInf:false }], half:true }, true);
        // toolkit workaround: the builder's arrow keys always move an end by 1, even with "½ steps" on, so 3.5 couldn't be
        // reached from the keyboard. With ½ steps on, arrows move 0.5 (Shift: 1).
        $(".va-ib", el).addEventListener("keydown", function(e){
          var hb = e.target.closest && e.target.closest(".drag-h"); if (!hb) return;
          var st = ib.get(); if (!st.half) return;
          var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0; if (!d) return;
          e.preventDefault(); e.stopPropagation();
          var id = hb.dataset.h, pc = st.pieces[+id[0]], stp = e.shiftKey ? 1 : 0.5; if (!pc) return;
          if (id[1] === "a") pc.a = clamp(pc.a + d * stp, 0, (pc.bInf ? 6 : pc.b) - 0.5); else pc.b = clamp(pc.b + d * stp, (pc.aInf ? 0 : pc.a) + 0.5, 6);
          ib.set(st);
        }, true);
      }
      $(".va-s4c", el).innerHTML = x.solved || x.hint >= 3 ? '<h4 class="va-sch">Sign chart</h4>' + chartHTML({ cols:chartCols(S4MO), Mo:S4MO, caption:"Sign chart of v and a for s(t) = 2t³ − 21t² + 60t on [0, 6]",
        vLab:m(S4MO.vSrc), aLab:m(S4MO.aSrc), cell:function(c){ return SPDW[truthOf(S4MO, c)]; } }) : "";
      return;
    }
    var h = '<div class="numrow va-nr"><label for="va-ti' + it.id + '">' + it.label + '</label><input class="numin" id="va-ti' + it.id + '" data-tin="' + it.id + '" data-k="ti' + it.id + '" type="text" inputmode="' + (it.id === "s3" || it.id === "s5" ? "decimal" : "text") + '" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="va-unit">' + it.unit + "</span></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintCl(it){
    var x = ist(it.id), c = $('[data-q="' + it.id + '"] .va-tcl', host), h = "";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].bad ? "bad" : "", msgs[it.id].html);
    MV.keepFocus(c, function(){ c.innerHTML = h; });
  }
  a.items.forEach(function(it){ paintIn(it); paintCl(it); });
  function sameIv(ps, want){ return ps.length === want.length && ps.every(function(p, i){ return near(p.a, want[i][0], 1e-9) && near(p.b, want[i][1], 1e-9); }); }
  function judge(it){
    var x = ist(it.id), ans = MV.ans(it);
    if (it.kind === "iv") {
      var st = ib.get(), ps = st.pieces.slice().sort(function(p, q){ return p.a - q.a; });
      if (ps.some(function(p){ return p.aInf || p.bInf; })) return { ok:false, msg:it.general };
      if (sameIv(ps, ans)) {
        if (ps[0].aIn || ps[0].bIn || ps[1].aIn) return { ok:false, msg:it.closed };
        return { ok:true };
      }
      var w = (it.wrong || []).filter(function(z){ return sameIv(ps, z.iv); })[0];
      return { ok:false, msg:w ? w.fb : it.general };
    }
    var vals = it.kind === "set" ? MV.parseList(x.val) : MV.parseNum(x.val);
    if (!String(x.val || "").trim()) return { err:"Type your answer first." };
    if (!vals || (it.kind === "num" && vals.length !== 1) || vals.some(function(v){ return !isFinite(v); })) return { err:it.kind === "set" ? "Type the times as numbers separated by commas, such as 1, 4." : "Type a number, such as 12, −3.5, 3/4 or √7." };
    if (it.kind === "set" ? MV.sameNums(vals, ans, 1e-6) : near(vals[0], ans, 1e-6)) return { ok:true };
    var nw = (it.wrong || []).filter(function(z){ return MV.sameNums(vals, z.match, 1e-6); })[0];
    if (nw) return { ok:false, msg:nw.fb };
    if (it.kind === "set" && vals.length < ans.length && vals.every(function(v){ return ans.some(function(q){ return near(v, q, 1e-6); }); })) return { ok:false, msg:"That’s one of them. " + it.general };
    return { ok:false, msg:it.general };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.tin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.tin) return; var b = host.querySelector('[data-k="' + e.target.dataset.tin + 'chk"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !b.dataset.act) return;
    var q = b.closest("[data-q]"); if (!q) return;
    var it = a.items.filter(function(z){ return z.id === q.dataset.q; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintCl(it); if (it.kind === "iv") paintIn(it); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it);
    if (r.err) msgs[it.id] = { bad:false, html:r.err };
    else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; paintIn(it); }
    else { x.tries++; msgs[it.id] = { bad:true, html:"<strong>✗ Not quite.</strong> " + r.msg + " Try again." }; }
    api.save(); paintCl(it); MV.focusFb(q);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Turn once, then hurry left ----------
var task = (function(){
  var api, plot, mtT;
  function g(k, lo, hi){ var s = api ? api.S : {}, t = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(t); return t !== "" && Number.isInteger(v) && v >= lo && v <= hi ? v : null; }
  function read(){ var b = g("b", -12, 12), c = g("c", -30, 30); return { b:b, c:c, valid:b !== null && c !== null }; }
  function sSrc(b, c){ return polySrc([0, c, b, 1]); }
  function vFac(b, c){
    var D = b * b - 3 * c;
    var fac = function(z){ var q = Q.of(Math.round(z * 3), 3); return q.n === 0 ? "t" : q.d === 1 ? "(t " + (q.n < 0 ? "+ " + -q.n : "- " + q.n) + ")" : "(3t " + (q.n < 0 ? "+ " + -q.n : "- " + q.n) + ")"; };
    if (D > 0) { var r = Math.sqrt(D); if (Number.isInteger(r)) { var z1 = (-b - r) / 3, z2 = (-b + r) / 3;
      var k3 = [z1, z2].filter(function(z){ return Q.of(Math.round(z * 3), 3).d !== 1; }).length;
      return (k3 === 2 ? "{1}/{3}" : k3 === 1 ? "" : "3") + fac(z1) + fac(z2); } }
    if (D === 0) { var z = -b / 3; return Number.isInteger(z) ? "3" + (z === 0 ? "t^2" : "(t " + (z < 0 ? "+ " + -z : "- " + z) + ")^2") : polySrc([c, 2 * b, 3]); }
    return polySrc([c, 2 * b, 3]);
  }
  function M(d){ return makeMotion({ id:"task", c:[0, d.c, d.b, 1], t1:6 }); }
  function drawV(){
    var d = read(), V0 = { xmin:-0.4, xmax:6.4, ymin:-10, ymax:30 };
    if (!d.valid) { plot.draw({ view:V0, describe:"Enter whole numbers for b (−12 to 12) and c (−30 to 30) to draw the v–t graph." }); return; }
    var Mo = M(d), lo = Math.min(Mo.vlo, 0), hi = Math.max(Mo.vhi, 0), pad = Math.max(2, (hi - lo) * 0.12), V = { xmin:-0.4, xmax:6.4, ymin:lo - pad, ymax:hi + pad };
    var z = roots(pd(Mo.c), 0, 6, true), ink = css("--ink"), ink2 = css("--ink-2"), pts = [], labs = [], ta = -d.b / 3;
    z.forEach(function(r, i){ pts.push({ x:r.x, y:0, r:5.5, color:ink }); labs.push({ x:r.x, y:0, text:MV.plain(tHTML(r.x)), dy:i % 2 ? 18 : -18, align:"center", bg:true, font:ui(12) }); });
    if (ta >= 0 && ta <= 6) { pts.push({ x:ta, y:Mo.v(ta), r:6, open:true, color:css("--f4") }); labs.push({ x:ta, y:Mo.v(ta), text:"a = 0 (flat)", dy:20, align:"center", bg:true, font:ui(12), color:css("--f4") }); }
    plot.draw({ view:V, xLabel:"t", yLabel:"v", curves:[{ f:Mo.v, color:css("--f3"), width:2.8, domain:[0, 6] }],
      segments:[{ x1:2, y1:V.ymin, x2:2, y2:V.ymax, color:ink2, width:1.2, dash:[2, 5] }], points:pts,
      labels:labs.concat([{ x:2, y:V.ymax, text:"t = 2", dx:5, dy:12, align:"left", color:ink2, bg:true, font:ui(12) }]),
      describe:"v–t graph of v = " + MV.plain(m(polySrc([d.c, 2 * d.b, 3]))) + " on 0 ≤ t ≤ 6. " + (z.length ? "v = 0 at t = " + z.map(function(r){ return tTxt(r.x); }).join(" and ") : "v is never 0") + "; v(2) = " + num(Mo.v(2)) + "; a = 0 at t = " + tTxt(ta) + "." });
  }
  function readout(){
    var d = read(), el = $("#vt-read"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<div><dd class="muted">Enter whole numbers: ' + m("b") + " from −12 to 12 and " + m("c") + " from −30 to 30.</dd></div>"; return; }
    var Mo = M(d), z = roots(pd(Mo.c), 0, 6, true), ta = -d.b / 3;
    el.innerHTML = MV.readoutHTML([
      ["Motion", m("s(t) = " + sSrc(d.b, d.c))],
      ["Velocity", m("v = " + vFac(d.b, d.c))],
      ["At rest at", z.length ? z.map(function(r){ return tHTML(r.x) + (r.touch ? " (touches 0)" : ""); }).join(", ") : "never on " + m("0 ≤ t ≤ 6")],
      [m("a = 0") + " at", tHTML(ta) + (ta < 0 ? " (before the motion starts)" : "")],
      [m("v(2)"), num(Mo.v(2)) + " m/s"]
    ]);
  }
  function update(){
    var d = read();
    if (d.valid) { var Mo = M(d); mtT.config({ s:Mo.s, v:Mo.v, acc:Mo.a, lo:Mo.lo, hi:Mo.hi, vmax:Mo.vmax, amax:Mo.amax }); }
    drawV(); readout();
  }
  function stepper(k, lo, hi, v){
    return '<div class="vt-step"><label for="vt-' + k + '"><span class="m vt-lab"><i>' + k + "</i></span> " + '<span class="tiny muted">(' + num(lo) + " to " + num(hi) + ")</span></label>" +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="-1" data-k="vt' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short" id="vt-' + k + '" data-tk="' + k + '" type="number" min="' + lo + '" max="' + hi + '" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-st="' + k + '" data-dir="1" data-k="vt' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.b == null) { a.S.b = "0"; a.S.c = "0"; }
      inp.innerHTML = stepper("b", -12, 12, a.S.b) + stepper("c", -30, 30, a.S.c);
      pv.innerHTML = '<div class="vt-trk"></div><div class="vt-ctl"></div><div class="plot-wrap"><canvas class="plot" id="vt-plot" role="img" aria-label="v–t graph of your motion"></canvas></div><dl class="read" id="vt-read" aria-live="polite" style="margin-top:10px"></dl>';
      var d0 = read(), M0 = M(d0.valid ? d0 : { b:0, c:0 });
      mtT = motionTrack($(".vt-trk", pv), { s:M0.s, v:M0.v, acc:M0.a, t0:0, t1:6, orient:"h", lo:M0.lo, hi:M0.hi, vmax:M0.vmax, amax:M0.amax, trail:true, varr:true, aarr:true, ctlHost:$(".vt-ctl", pv), name:"The particle" });
      plot = new MV.Plot($("#vt-plot"), { xmin:-0.4, xmax:6.4, ymin:-10, ymax:30 }); plot.render = drawV;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); update(); a.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.st) return;
        var k = b.dataset.st, lo = k === "b" ? -12 : -30, hi = k === "b" ? 12 : 30, cur = parseInt(String(a.S[k]).replace(/−/g, "-"), 10);
        if (!isFinite(cur)) cur = 0;
        a.S[k] = String(Math.max(lo, Math.min(hi, cur + +b.dataset.dir))); $("#vt-" + k).value = a.S[k];
        a.save(); update(); a.update();
      });
      update();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter whole numbers: b from −12 to 12 and c from −30 to 30."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var b = d.b, c = d.c, D = b * b - 3 * c, ta = -b / 3;
      return [3 + 2 * b + c === 0, D > 0 && c > 0 && 108 + 12 * b + c > 0 && -b > 0 && -b < 18, ta >= 0 && ta < 2.5, 12 + 4 * b + c < 0];
    },
    key:function(d){ return d.b + "|" + d.c; },
    label:function(k){ var p = k.split("|"); return m("s = " + sSrc(+p[0], +p[1])); },
    text:function(k){ var p = k.split("|"); return "s = " + MV.plain(m(sSrc(+p[0], +p[1]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ trip:tripAct },
  figures:FIGS,
  task:task
});
})();
