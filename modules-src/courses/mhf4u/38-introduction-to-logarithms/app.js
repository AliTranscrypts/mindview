// MHF4U 38 Introduction to Logarithms: hero ladder, power ladder (Explore: Climb and Squeeze), From ladder to graph
// (Part 3, with "Build it from the definition"), Find the missing piece (Practice 2) and the "Between the rungs" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, MINUS = MV.MINUS, m = MV.m;

// ---------- numbers ----------
function groupStr(s){
  s = String(s); var neg = s.charAt(0) === "-" || s.charAt(0) === MINUS; if (neg) s = s.slice(1);
  var p = s.split("."), a = p[0], f = p[1];
  if (a.length >= 5) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  if (f != null && f.length > 4) f = f.replace(/(\d{3})(?=\d)/g, "$1 ");
  return (neg ? MINUS : "") + a + (f != null ? "." + f : "");
}
// n significant figures, never in exponent form, grouped (≈ 46.8, 28.9986, 0.030 181 5, 316 000)
function sig(v, n){
  if (v === 0) return "0";
  var a = Math.abs(v), r = Number(a.toPrecision(n)), e = Math.floor(Math.log10(r) + 1e-12), dec = n - 1 - e;
  return groupStr((v < 0 ? "-" : "") + (dec > 0 ? r.toFixed(Math.min(dec, 20)) : String(Math.round(r))));
}
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function fracTxt(p, q){ var g = gcd(p, q) || 1; p /= g; q /= g; if (q < 0) { p = -p; q = -q; } return (p < 0 ? MINUS : "") + Math.abs(p) + (q === 1 ? "" : "/" + q); }
function kTxt(k){ return (k < 0 ? MINUS : "") + (Math.abs(k) / 1000).toFixed(3).replace(/\.?0+$/, ""); }   // thousandths -> "3.065"
function fixTxt(k, d){ return (k < 0 ? MINUS : "") + (Math.abs(k) / 1000).toFixed(d); }
function near(a, b, tol){ return Math.abs(a - b) <= (tol || 1e-9) * Math.max(1, Math.abs(b)); }
function one(raw){ var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : NaN; }

// @component exactPow — exact values of b^(p/q) for bases built from the primes 2, 3, 5 (2, 3, 4, 5, 8, 9, 10, 16 and their
// reciprocals): rational -> "1/8" (base 10 -> "0.001"), otherwise a simplified, rationalized radical (27√3, √5/5, ∛4/2, 2∛4)
var PR = [2, 3, 5], BC = {};
function fac(n){ var e = [0, 0, 0]; for (var i = 0; i < 3; i++) while (n > 1 && n % PR[i] === 0) { n /= PR[i]; e[i]++; } return n === 1 ? e : null; }
function base(id){
  id = String(id); if (BC[id]) return BC[id];
  var p = id.split("/"), n = +p[0], d = p[1] ? +p[1] : 1, fn = n > 0 ? fac(n) : null, fd = fac(d);
  return (BC[id] = { id:id, n:n, d:d, v:n / d, ten:id === "10", e:fn && fd ? fn.map(function(x, i){ return x - fd[i]; }) : null });
}
function powX(B, p, q){
  var g = gcd(p, q) || 1; p /= g; q /= g;
  var num = 1, den = 1, rad = 1, rat = true;
  for (var i = 0; i < 3; i++) {
    var t = B.e[i] * p, f = Math.floor(t / q), r = t - f * q;
    if (f > 0) num *= Math.pow(PR[i], f); else if (f < 0) den *= Math.pow(PR[i], -f);
    if (r) { rat = false; rad *= Math.pow(PR[i], r); }
  }
  return { B:B, p:p, q:q, num:num, den:den, rad:rad, rat:rat, v:Math.pow(B.v, p / q) };
}
function ratSrc(X){
  if (X.B.ten && X.den > 1) return groupStr((X.num / X.den).toFixed(Math.round(Math.log10(X.den))));
  return groupStr(String(X.num)) + (X.den > 1 ? "/" + groupStr(String(X.den)) : "");
}
function radSrc(X){ return (X.num === 1 ? "" : groupStr(String(X.num))) + "√{" + X.rad + "}" + (X.den > 1 ? "/" + groupStr(String(X.den)) : ""); }
function exSrc(X){ return X.rat ? ratSrc(X) : radSrc(X); }
// typeset; a cube root keeps the bar but shows ∛
function H(src, X){ var h = m(src); return X && !X.rat && X.q === 3 ? h.replace(/class="rs">√</g, 'class="rs">∛<') : h; }
function moreFig(v, t, n){ while (n < 14 && isFinite(t) && Number(v.toPrecision(n)) === t) n++; return n; }
function fullH(X, t){ return X.rat ? H(ratSrc(X)) : H(radSrc(X) + " ≈ " + sig(X.v, moreFig(X.v, t, 3)), X); }
function shortTxt(X){ return X.rat ? ratSrc(X) : "≈ " + sig(X.v, 3); }
function rungSrc(p, q){ var g = gcd(p, q) || 1; p /= g; q /= g; if (q < 0) { p = -p; q = -q; } return (p < 0 ? "-" : "") + Math.abs(p) + (q === 1 ? "" : "/" + q); }
function bS(B){ return "@b{" + B.id + "}"; }
function pwS(B, e){ return (B.d > 1 ? "(" + bS(B) + ")" : bS(B)) + "^{" + e + "}"; }
function lgS(B){ return B.ten ? "log" : "log_{" + bS(B) + "}"; }
function argS(s){ return /[\/√−-]/.test(s) ? "(" + s + ")" : " " + s; }
function tSrc(raw){
  var s = String(raw).trim().replace(/−/g, "-").replace(/\s+/g, "");
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? groupStr(s) : s;
}
function setBanner(kind, html){ var b = $("#ex-app [data-mv=banner]"); if (!b) return; b.className = "banner" + (kind ? " " + kind : ""); b.innerHTML = html || ""; }

// ---------- radio groups (adapted from MHF4U 25's @component radioGroup: arrow keys, roving tabindex) ----------
function rgHTML(name, opts, val, cls, aria, dis){
  return '<span class="lg-rg ' + (cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(aria) + '">' + opts.map(function(o){
    var on = String(o.id) === String(val);
    return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + name + '" data-v="' + MV.esc(o.id) + '" data-k="rg' + name + MV.esc(o.id) + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>";
  }).join("") + "</span>";
}
function rgKey(e, host){
  var b = e.target.closest && e.target.closest("[data-rg]"); if (!b) return null;
  var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return null;
  e.preventDefault();
  var all = Array.prototype.slice.call(host.querySelectorAll('[data-rg="' + b.dataset.rg + '"]')).filter(function(x){ return !x.disabled; }), i = all.indexOf(b);
  return all.length ? { name:b.dataset.rg, v:all[(i + d + all.length) % all.length].dataset.v } : null;
}
function rgFocus(host, name, v){ var b = host.querySelector('[data-rg="' + name + '"][data-v="' + v + '"]'); if (b) b.focus({ preventScroll:true }); }

// @component G4 powerLadder — a vertical log scale on a Plot (view x 0..1, y = exponent): two rails at 38% and 62%, rungs
// spaced by exponent (whole 3 px --ink; half, third and decimal sub-rungs 1.5 px --ink-2; current rung --pen), rung numbers
// left and values right (colliding labels skipped by priority), "× b" arcs with arrowheads, climber, flag, trial markers
// ▲/▼, bracket band (--hi-soft), dashed --hi halfway rung, a rounding arrow and a sliding card.
// sc: {rungs:[{y, whole, g (grow 0..1), a (alpha), pen, glow, bold, l, r, old (cross-fade label), fade}], arcs:[{y0, y1, t, up, hl}],
//      rails (0..1), railLo, railHi, band:[y0, y1], climber:y, flag:{y, t, s}, marks:[{y, dir:"up"|"down"|"eq", l, r}], mk:y,
//      half:y, arrow:{from, to}, card:{y, t, s}}
function drawLadder(ctx, p, sc){
  var W = p.W, H0 = p.H, xL = W * 0.38, xR = W * 0.62, xC = W * 0.5, small = W < 420, fM = p.fontM || "serif";
  var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hi = css("--hi"), fs = small ? 13 : 14;
  function Y(y){ return p.Y(y); }
  function seg(x1, y1, x2, y2, col, w, dash){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
  function tri(x, y, up, s, col){ ctx.fillStyle = col; ctx.beginPath(); if (up) { ctx.moveTo(x, y - s); ctx.lineTo(x - s * 0.75, y + s * 0.6); ctx.lineTo(x + s * 0.75, y + s * 0.6); } else { ctx.moveTo(x, y + s); ctx.lineTo(x - s * 0.75, y - s * 0.6); ctx.lineTo(x + s * 0.75, y - s * 0.6); } ctx.closePath(); ctx.fill(); }
  var rungs = sc.rungs || [];
  if (sc.band) { var by0 = Y(sc.band[1]), by1 = Y(sc.band[0]); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(xL - 10, by0, xR - xL + 20, by1 - by0); }
  rungs.forEach(function(r){ if (r.glow) seg(xL, Y(r.y), xR, Y(r.y), hi, 10); });
  var rt = sc.rails == null ? 1 : sc.rails;
  if (rt > 0) {
    var r0 = Math.max(sc.railLo == null ? -6.3 : sc.railLo, p.v.ymin - 1), r1 = Math.min(sc.railHi == null ? 6.3 : sc.railHi, p.v.ymax + 1), top = r0 + (r1 - r0) * rt;
    seg(xL, Y(r0), xL, Y(top), ink2, 2); seg(xR, Y(r0), xR, Y(top), ink2, 2);
  }
  rungs.forEach(function(r){
    var a = r.a == null ? 1 : r.a, g = r.g == null ? 1 : r.g; if (a <= 0.01 || g <= 0.01) return;
    ctx.globalAlpha = a; seg(xL, Y(r.y), xL + (xR - xL) * g, Y(r.y), r.pen ? pen : r.whole ? ink : ink2, r.pen ? 3.4 : r.whole ? 3 : 1.5); ctx.globalAlpha = 1;
  });
  (sc.marks || []).forEach(function(mk){ seg(xL, Y(mk.y), xR, Y(mk.y), ink2, 1, [3, 4]); });
  if (sc.half != null) seg(xL - 6, Y(sc.half), xR + 6, Y(sc.half), hi, 3.5, [8, 5]);
  var xA = W - (small ? 50 : 62);
  (sc.arcs || []).forEach(function(c){
    var ya = Y(c.y0), yb = Y(c.y1), mid = (ya + yb) / 2, up = c.up !== false;
    if (yb > H0 + 4 || ya < -4) return;
    ctx.save(); ctx.strokeStyle = c.hl ? hi : ink2; ctx.lineWidth = c.hl ? 3.5 : 1.6;
    ctx.beginPath(); ctx.moveTo(xA, ya - 4); ctx.quadraticCurveTo(xA + 14, mid, xA, yb + 4); ctx.stroke();
    tri(xA + 1, up ? yb + 5 : ya - 5, up, 5, c.hl ? hi : ink2);
    ctx.font = (c.hl ? "700 " : "400 ") + (small ? 11 : 13) + "px " + fM; ctx.fillStyle = c.hl ? ink : ink2; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillText(c.t, xA + 13, mid); ctx.restore();
  });
  // labels, most important first; a label that would overlap one already drawn on its side is skipped
  var used = { l:[], r:[] }, L = [];
  (sc.marks || []).forEach(function(mk){ if (mk.l) L.push({ s:"l", y:mk.y, t:mk.l, pri:4, bold:true, dx:14 }); if (mk.r) L.push({ s:"r", y:mk.y, t:mk.r, pri:4, bold:true }); });
  rungs.forEach(function(r){
    var a = r.a == null ? 1 : r.a; if (a <= 0.01) return;
    var pri = (r.pen || r.bold) ? 3 : r.whole ? 2 : 1;
    if (r.l != null) L.push({ s:"l", y:r.y, t:r.l, pri:pri, a:a, bold:r.pen || r.bold });
    if (r.r != null) L.push({ s:"r", y:r.y, t:r.r, pri:pri, a:a, bold:r.pen || r.bold, old:r.old, fade:r.fade == null ? 1 : r.fade });
  });
  L.map(function(x, i){ x.i = i; return x; }).sort(function(a, b){ return b.pri - a.pri || a.i - b.i; }).forEach(function(o){
    var yy = Y(o.y); if (yy < 8 || yy > H0 - 8) return;
    var arr = used[o.s]; for (var i = 0; i < arr.length; i++) if (Math.abs(arr[i] - yy) < fs) return;
    arr.push(yy);
    ctx.textBaseline = "middle"; ctx.textAlign = o.s === "l" ? "right" : "left"; ctx.fillStyle = ink;
    ctx.font = (o.bold ? "700 " : "400 ") + fs + "px " + fM;
    var x = o.s === "l" ? xL - (o.dx || 9) : xR + (o.dx || 9), a = o.a == null ? 1 : o.a;
    if (o.old != null && o.fade < 1) { ctx.globalAlpha = a * (1 - o.fade); ctx.fillText(o.old, x, yy); ctx.globalAlpha = a * o.fade; }
    else ctx.globalAlpha = a;
    ctx.fillText(o.t, x, yy); ctx.globalAlpha = 1;
  });
  (sc.marks || []).forEach(function(mk){
    var yy = Y(mk.y); if (yy < -10 || yy > H0 + 10) return;
    if (mk.dir === "eq") { ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(xL, yy - 7); ctx.lineTo(xL + 7, yy); ctx.lineTo(xL, yy + 7); ctx.lineTo(xL - 7, yy); ctx.closePath(); ctx.fill(); }
    else tri(xL, yy, mk.dir === "up", 8, ink);
  });
  if (sc.mk != null) { var my = Y(sc.mk); ctx.beginPath(); ctx.arc(xL, my, 9, 0, Math.PI * 2); ctx.fillStyle = hi; ctx.fill(); ctx.beginPath(); ctx.arc(xL, my, 5.5, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill(); }
  if (sc.arrow) { var ay0 = Y(sc.arrow.from), ay1 = Y(sc.arrow.to); seg(xC, ay0, xC, ay1 + (ay1 < ay0 ? 6 : -6), ink, 2.5); tri(xC, ay1, ay1 < ay0, 8, ink); }
  if (sc.climber != null) {
    var cy = Y(sc.climber);
    ctx.beginPath(); ctx.arc(xC, cy, 10.5, 0, Math.PI * 2); ctx.strokeStyle = hi; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.arc(xC, cy, 7, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill();
  }
  if (sc.flag && sc.flag.s > 0) {
    var fy = Y(sc.flag.y), s = sc.flag.s; ctx.save(); ctx.translate(xC + 15, fy); ctx.scale(s, s);
    ctx.font = "700 13px " + fM; var fw = ctx.measureText(sc.flag.t).width + 12;
    seg(0, 0, 0, -30, ink, 2); ctx.fillStyle = hi; ctx.fillRect(1, -30, fw, 18); ctx.fillStyle = css("--hi-ink"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(sc.flag.t, 7, -21);
    ctx.restore();
  }
  if (sc.card && sc.card.s > 0) {
    var cyy = Y(sc.card.y), xd = xR + (small ? 40 : 48), x0 = W + 10, cx = x0 + (xd - x0) * sc.card.s;
    ctx.font = "700 " + (fs + 2) + "px " + fM; var cw = ctx.measureText(sc.card.t).width + 16;
    ctx.fillStyle = hi; ctx.fillRect(cx, cyy - 13, cw, 26); ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx, cyy - 13, cw, 26);
    ctx.fillStyle = css("--hi-ink"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(sc.card.t, cx + 8, cyy + 1);
  }
}
function mulLab(B){ return "× " + B.id; }
function divLab(B){ return B.v > 1 ? "÷ " + B.id : "× " + B.d; }

// ---------- hero: the base-2 ladder builds itself (storyboard in the plan) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:-3.8, ymax:5.8 }), B = base("2");
  var st = { rails:0, a:{}, arcs:{}, card:0, glow:false, c1:false, c2:false };
  var caps = (MV.C.hero.captions || []);
  if (f.cap) f.cap.classList.add("lg-hcap");
  function paintCap(){ if (f.cap) f.cap.innerHTML = (st.c1 ? "<span>" + caps[0] + "</span>" : "") + (st.c2 ? "<span>" + caps[1] + "</span>" : ""); }
  p.render = function(){
    var rungs = [], arcs = [];
    for (var k = -3; k <= 5; k++) { var a = st.a[k] || 0; if (a <= 0) continue; rungs.push({ y:k, whole:true, a:a, glow:st.glow && k === 5, l:fracTxt(k, 1), r:ratSrc(powX(B, k, 1)) }); }
    for (var j = -3; j < 5; j++) { var ca = st.arcs[j] || 0; if (ca > 0) arcs.push({ y0:j, y1:j + 1, up:j >= 0, t:j >= 0 ? "× 2" : "÷ 2", a:ca }); }
    p.draw({ view:{ xmin:0, xmax:1, ymin:-3.8, ymax:5.8 }, grid:false, axes:false, ticks:false, after:function(ctx, pp){
      ctx.save(); drawLadder(ctx, pp, { rungs:rungs, arcs:arcs.map(function(c){ return c; }), rails:st.rails, railLo:-3.5, railHi:5.5, card:{ y:5, t:"32", s:st.card } }); ctx.restore();
    }, describe:"Power ladder, base 2. Rungs 0 to 5 have values 1, 2, 4, 8, 16 and 32, each one 2 times the last. Below rung 0, rungs −1, −2 and −3 have values 1/2, 1/4 and 1/8. log base 2 of 32 is 5." });
  };
  function done(){ st.rails = 1; for (var k = -3; k <= 5; k++) st.a[k] = 1; for (var j = -3; j < 5; j++) st.arcs[j] = 1; st.card = 1; st.glow = true; st.c1 = st.c2 = true; paintCap(); p.render(); }
  if (MV.reduceMotion) { done(); return; }
  p.render();
  function fadeIn(k, cb){ MV.tween({ dur:400, step:function(t){ st.a[k] = t; if (k > 0) st.arcs[k - 1] = t; if (k < 0) st.arcs[k] = t; p.render(); }, done:cb }); }
  function chain(list, cb){ var i = 0; (function nx(){ if (i >= list.length) { if (cb) cb(); return; } fadeIn(list[i++], nx); })(); }
  MV.tween({ dur:600, ease:function(t){ return t; }, step:function(t){ st.rails = t; p.render(); }, done:function(){
    fadeIn(0, function(){ chain([1, 2, 3, 4, 5], function(){
      MV.tween({ dur:700, step:function(t){ st.card = t; p.render(); }, done:function(){ st.glow = true; st.c1 = true; paintCap(); p.render();
        MV.wait(1000, function(){ chain([-1, -2, -3], function(){ st.c2 = true; paintCap(); p.render(); }); });
      } });
    }); });
  } });
}

// ---------- Explore: the power ladder (Climb and Squeeze) ----------
var CLIMB_BASES = ["2", "3", "4", "5", "8", "9", "10", "1/2"], SQ_BASES = ["2", "3", "4", "5", "8", "9", "10"];
var EX = null;   // explore internals (challenge tests read them)
function explore(host, api){
  var S = api.S, XC = MV.C.explore;
  if (S.mode !== "squeeze") S.mode = "climb";
  if (CLIMB_BASES.indexOf(S.base) < 0) S.base = "2";
  if ([1, 2, 3].indexOf(S.size) < 0) S.size = 1;
  if (typeof S.k !== "number") S.k = 0;
  if (S.arcs == null) S.arcs = true;
  if (S.strip == null) S.strip = 1;
  if (S.t == null) S.t = "";
  S.sq = S.sq || { base:"3", t:"29", trials:[], zo:0, dec:null, done:{}, lib:"l1", x:"" };
  S.tc3 = S.tc3 || { open:false, ans:"", proof:null };
  var A = { y:S.k / 6, vc:clampVc(S.k / 6), fade:null, grow:1, pulse:null, bold:null, glow:null, flag:null, dir:{}, moving:false, busy:false, cancel:null, ghost:null, sv:null, subA:1, mk:null, half:null };
  function clampVc(v){ return Math.max(-4, Math.min(4, v)); }
  host.innerHTML = '<div class="pg lg-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap" id="lg-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="lg-heads" aria-hidden="true"><span class="lg-hl">rung number = <span class="m"><span class="fnm">log</span><sub><i class="p-b">b</i></sub></span>(value)</span><span class="lg-hr">value = <span class="m"><i class="p-b">b</i></span><sup>rung number</sup></span></div>' +
    '<div class="plot-wrap lg-wrap"><canvas class="plot square lg-cv" id="lg-cv" tabindex="0" role="img" aria-label="Power ladder"></canvas></div>' +
    '<div class="lg-strip" id="lg-strip" hidden><canvas class="plot nl" id="lg-scv" role="img" aria-label="True-size strip"></canvas><div class="lg-row"><span class="tiny" id="lg-scale" aria-live="polite"></span>' +
    '<button type="button" class="btn ghost sm" id="lg-mag">Magnify × 10</button><button type="button" class="btn ghost sm" id="lg-sreset">Reset</button></div></div>' +
    '<p class="tiny muted lg-kbd" id="lg-kbd">Keyboard: focus the ladder, then ↑ and ↓ move one rung of the current size, Page Up and Page Down move one whole rung, and Home goes to rung 0.</p></div>' +
    '<div class="pg-ctrl" id="lg-ctrl"></div><div class="pg-read"><dl class="read" id="lg-read" aria-live="polite"></dl><div id="lg-read2"></div></div></div>';
  var ctrl = $("#lg-ctrl", host), P = new MV.Plot($("#lg-cv", host), { xmin:0, xmax:1, ymin:-3, ymax:3 }), SP = new MV.Plot($("#lg-scv", host), { xmin:0, xmax:1, ymin:-1, ymax:1 });
  function B(){ return base(S.base); }
  function busy(on){ A.busy = on; ctrl.classList.toggle("lg-busy", on); }

  // ----- climb: values, target -----
  function tgt(){
    var raw = (S.t || "").trim(); if (!raw) return null;
    var v = one(raw); return isFinite(v) ? { v:v, src:tSrc(raw) } : { bad:true };
  }
  function sizeWord(){ return ["whole", "half", "third"][S.size - 1]; }
  function onRung(t, st){ for (var k = -36; k <= 36; k += st) if (near(powX(B(), k, 6).v, t.v)) return k; return null; }
  function targetLines(){
    var t = tgt(); if (!t) return null;
    if (t.bad) return ["Type a number, like 32, 0.5 or 1/8."];
    var b = B(), X = powX(b, S.k, 6), rs = rungSrc(S.k, 6);
    if (t.v <= 0) return ["No rung is ever " + m(t.src) + ": " + m(pwS(b, "y")) + " is positive for every " + m("y") + ". " + m(lgS(b) + "(" + t.src + ")") + " is undefined."];
    if (near(X.v, t.v)) return ["✓ " + m(pwS(b, rs) + " = " + t.src) + ", so " + m(lgS(b) + argS(t.src) + " = " + rs) + "."];
    var out = ["Your value, " + fullH(X, t.v) + ", is " + (X.v < t.v ? "less" : "greater") + " than " + m(t.src) + "."];
    var st = 6 / S.size;
    if (onRung(t, st) == null) {
      var L = Math.log(t.v) / Math.log(b.v);
      if (L > 6 + 1e-9 || L < -6 - 1e-9) out.push(m(t.src) + " is off this ladder. Try another base.");
      else {
        var lo = null, hi = null;
        for (var k = -36; k <= 36; k += st) { var Y = powX(b, k, 6); if (Y.v < t.v && (!lo || Y.v > lo.v)) lo = Y; if (Y.v > t.v && (!hi || Y.v < hi.v)) hi = Y; }
        out.push(m(t.src) + " isn’t on a " + sizeWord() + " rung: " + fullH(lo, t.v) + " " + m("<") + " " + m(t.src) + " " + m("<") + " " + fullH(hi, t.v) + ". Try smaller rungs, or estimate it in Squeeze.");
      }
    }
    return out;
  }
  function stepLine(){
    var b = B(), q = S.size, word = ["whole rung", "half rung", "third of a rung"][q - 1], shrink = b.v < 1 ? ", so the values shrink as you climb" : "";
    if (q === 1) return "Each whole rung multiplies by " + m(bS(b)) + shrink + ".";
    var X = powX(b, 1, q), root = (q === 3 ? "∛" : "√") + "{" + b.id + "}", rs = q === 3 ? H(root.replace("∛", "√"), { rat:false, q:3 }) : m(root);
    return "Each " + word + " multiplies by " + rs + " " + (X.rat ? m("= " + ratSrc(X)) : m("≈ " + sig(X.v, 3))) + shrink + ".";
  }
  function signLine(){
    var b = B(); if (S.k === 0) return "Zero: " + m("@b{b}^0 = 1") + " for every base.";
    if (b.v > 1) return S.k < 0 ? "Negative: the value is between 0 and 1." : "Positive: the value is greater than 1.";
    return S.k < 0 ? "Negative: with a base between 0 and 1, values greater than 1 have negative logs." : "Positive: with a base between 0 and 1, values between 0 and 1 have positive logs.";
  }
  function logFormH(b, X, k){ return H(lgS(b) + argS(exSrc(X)) + " = " + rungSrc(k, 6), X); }
  function paintClimbRead(){
    var b = B(), X = powX(b, S.k, 6), rs = rungSrc(S.k, 6), t = tgt();
    var rows = [["Rung", m(rs)], ["Value", H(pwS(b, rs) + " = " + exSrc(X), X) + (X.rat ? "" : " " + m("≈ " + sig(X.v, 3)))], ["Log form", logFormH(b, X, S.k)],
      ["In words", m(bS(b)) + " to the power " + m(rs) + " is " + H(exSrc(X), X) + ", so the base-" + m(bS(b)) + " logarithm of " + H(exSrc(X), X) + " is " + m(rs) + "."],
      ["Each step up", stepLine()], ["Sign of the log", signLine()]];
    var tl = targetLines(); if (tl) rows.push(["Target", tl.join("<br>")]);
    $("#lg-read", host).innerHTML = MV.readoutHTML(rows);
    $("#lg-read2", host).innerHTML = "";
    $("#lg-cap", host).innerHTML = logFormH(b, X, S.k);
    void t;
  }
  function climbScene(){
    var b = B(), st = 6 / S.size, small = P.W < 420, lo = A.vc - 3.35, hi = A.vc + 3.35, rungs = [], arcs = [], ob = A.fade ? base(A.fade.from) : null;
    for (var k = -36; k <= 36; k++) {
      var whole = k % 6 === 0; if (!whole && k % st) continue;
      var y = k / 6; if (y < lo - 0.3 || y > hi + 0.3) continue;
      var lab = !small || whole || k === S.k, X = powX(b, k, 6);
      rungs.push({ y:y, whole:whole, g:whole ? 1 : A.grow, pen:k === S.k && !A.moving, glow:A.glow === k, bold:A.bold === k,
        l:lab ? fracTxt(k, 6) : null, r:lab ? shortTxt(X) : null, old:ob && lab ? shortTxt(powX(ob, k, 6)) : null, fade:A.fade ? A.fade.t : 1 });
    }
    if (S.arcs) for (var j = -6; j < 6; j++) { if (j + 1 < lo - 0.5 || j > hi + 0.5) continue; var dn = A.dir[j] === "down"; arcs.push({ y0:j, y1:j + 1, up:!dn, t:dn ? divLab(b) : mulLab(b), hl:A.pulse === j }); }
    var X0 = powX(b, S.k, 6);
    return { lo:lo, hi:hi, rungs:rungs, arcs:arcs, climber:A.y, flag:A.flag,
      desc:"Power ladder, base " + b.id + ". Climber on rung " + fracTxt(S.k, 6) + ", value " + MV.plain(H(exSrc(X0), X0)) + ". Log base " + b.id + " of " + MV.plain(H(exSrc(X0), X0)) + " is " + fracTxt(S.k, 6) + "." };
  }

  // ----- squeeze -----
  function trialRes(b, k, t, idx){
    var X = powX(b, k, 1000), c = X.rat && near(X.v, t, 1e-12) ? 0 : X.v < t ? -1 : 1;
    return { k:k, X:X, v:X.v, c:c, idx:idx };
  }
  function sqInfo(){
    var Q = S.sq, b = base(Q.base), t = one(Q.t), ok = isFinite(t) && t >= 1e-6 * (1 - 1e-9) && t <= 1e6 * (1 + 1e-9);
    var L = ok ? Math.log(t) / Math.log(b.v) : NaN, off = ok ? (L > 6 + 1e-9 ? "top" : L < -6 - 1e-9 ? "bottom" : null) : null;
    var trials = ok ? Q.trials.map(function(k, i){ return trialRes(b, k, t, i); }) : [], lo = null, hi = null, ex = null;
    trials.forEach(function(r){ if (r.c < 0 && (!lo || r.k > lo.k)) lo = r; if (r.c > 0 && (!hi || r.k < hi.k)) hi = r; if (r.c === 0) ex = r; });
    return { B:b, t:t, ok:ok, L:L, off:off, trials:trials, lo:lo, hi:hi, ex:ex, ts:ok ? tSrc(Q.t) : "" };
  }
  function cellAt(I, Lv){ var s = [0, 1000, 100, 10][Lv], a = Math.floor(I.lo.k / s) * s; return { L:Lv, s:s, a:a }; }
  function autoCell(I){
    if (!I.lo || !I.hi || I.ex) return null;
    for (var Lv = 3; Lv >= 1; Lv--) { var c = cellAt(I, Lv); if (I.hi.k <= c.a + c.s) return c; }
    return null;
  }
  function effCell(I){ var c = autoCell(I); if (!c) return null; var e = Math.max(0, c.L - (S.sq.zo || 0)); return e ? cellAt(I, e) : null; }
  function sqView(I){
    var c = effCell(I);
    if (c) { var mid = (c.a + c.s / 2) / 1000, h = c.s / 1000 / 0.7; return { lo:mid - h / 2, hi:mid + h / 2, L:c.L }; }
    var Q = S.sq, cen = Q.trials.length ? Q.trials[Q.trials.length - 1] / 1000 : 0; cen = clampVc(Math.round(cen));
    return { lo:cen - 3.35, hi:cen + 3.35, L:0 };
  }
  function valTrial(r, t){ return r.X.rat ? H(ratSrc(r.X)) : m("≈ " + sig(r.v, moreFig(r.v, t, 6))); }
  function valTrialTxt(r, t){ return r.X.rat ? ratSrc(r.X) : "≈ " + sig(r.v, moreFig(r.v, t, 6)); }
  function est(I, places){
    if (!I.lo || !I.hi || I.ex) return null;
    var s = places === 1 ? 100 : 10, v = Math.round((I.lo.k + I.hi.k) / 2 / s) * s;
    return I.lo.k >= v - s / 2 && I.hi.k <= v + s / 2 ? v : null;
  }
  function decideCond(I){ return !S.tc3.open && I.lo && I.hi && !I.ex && I.lo.k % 10 === 0 && I.hi.k - I.lo.k === 10; }
  function libMatch(I){ var Q = S.sq; return XC.library.filter(function(l){ return l.base === Q.base && near(one(l.t), I.t); })[0]; }
  function libFacts(l){
    var b = base(l.base), t = one(l.t), L = Math.log(t) / Math.log(b.v), w = Math.floor(L), k2 = Math.round(L * 100) * 10, kd = Math.floor(L * 100) * 10 + 5, r = trialRes(b, kd, t, 0), ts = tSrc(l.t);
    return l.label + ": whole-number bracket " + fracTxt(w, 1) + " and " + fracTxt(w + 1, 1) + "; to two decimal places " + fixTxt(k2, 2) + "; the deciding trial " + m(pwS(b, kTxt(kd))) + " " + valTrial(r, t) + ", " + (r.c < 0 ? "too low" : "too high") + "." + (l.id === "l5" ? " " + XC.log2Note : "") + (ts ? "" : "");
  }
  function markDone(I){ var l = libMatch(I); if (l && (I.ex || est(I, 2) != null)) S.sq.done[l.id] = true; }
  function decOpts(I){
    var b = I.B, lo = I.lo, hi = I.hi, mid = lo.k + 5, dLo = Math.abs(I.t - lo.v), dHi = Math.abs(hi.v - I.t), nearHi = dHi < dLo, D = XC.decide;
    function fill(s){ return s.replace("{L}", m(lgS(b) + argS(I.ts))).replace("{lo}", kTxt(lo.k)).replace("{hi}", kTxt(hi.k)).replace("{t}", m(I.ts)).replace("{mid}", kTxt(mid))
      .replace("{pmid}", m(pwS(b, kTxt(mid)))).replace("{plo}", m(pwS(b, kTxt(lo.k)))).replace("{phi}", m(pwS(b, kTxt(hi.k)))).replace("{near}", kTxt(nearHi ? hi.k : lo.k)); }
    var Lgt = I.L > mid / 1000, agree = nearHi === Lgt, sc;
    if (b.id === "3" && near(I.t, 29) && lo.k === 3060) sc = D.log329;
    else {
      var nr = nearHi ? hi : lo, fr = nearHi ? lo : hi;
      sc = "It’s true that " + m(I.ts) + " is closer to " + m(pwS(b, kTxt(nr.k)) + " " + MV.plain(valTrial(nr, I.t))) + " than to " + m(pwS(b, kTxt(fr.k)) + " " + MV.plain(valTrial(fr, I.t))) +
        (agree ? ", and here that happens to point the right way. But comparing values isn’t a reliable test, because the values don’t grow evenly between rungs. "
          : ", but here that points the wrong way: " + m(lgS(b) + argS(I.ts)) + " rounds to " + fixTxt(Lgt ? hi.k : lo.k, 2) + ". Comparing values isn’t a reliable test, because the values don’t grow evenly between rungs. ") + D.example;
    }
    return { q:fill(D.q), mid:mid, opts:[{ t:kTxt(lo.k), fb:fill(D.lo) }, { t:kTxt(mid), ok:true, fb:fill(D.mid) }, { t:kTxt(hi.k), fb:fill(D.hi) }, { t:fill(D.shortcut), fb:sc }] };
  }
  function paintSqRead(){
    var I = sqInfo(), Q = S.sq, rows = [];
    if (!I.ok) { $("#lg-read", host).innerHTML = MV.readoutHTML([["Target", "Type a positive number from 0.000 001 to 1 000 000."]]); $("#lg-read2", host).innerHTML = ""; $("#lg-cap", host).innerHTML = ""; return; }
    var b = I.B, LT = m(lgS(b) + argS(I.ts));
    rows.push(["Target", LT]);
    if (I.off === "top") rows.push(["Off the ladder", m(I.ts) + " is off the base-" + m(bS(b)) + " ladder (" + H(pwS(b, "6") + " = " + ratSrc(powX(b, 6, 1))) + "). Try a bigger base."]);
    else if (I.off === "bottom") rows.push(["Off the ladder", m(I.ts) + " is off the base-" + m(bS(b)) + " ladder (" + H(pwS(b, "-6") + " = " + ratSrc(powX(b, -6, 1))) + "). Try a bigger base."]);
    var ints = {}; I.trials.forEach(function(r){ if (r.k % 1000 === 0) ints[r.k / 1000] = r.c; });
    Object.keys(ints).map(Number).sort(function(a, c){ return a - c; }).forEach(function(a){
      if (ints[a] < 0 && ints[a + 1] > 0) { var Xa = powX(b, a, 1), Xb = powX(b, a + 1, 1);
        rows.push(["Whole-number bracket", m(pwS(b, String(a)) + " = " + ratSrc(Xa) + " < " + I.ts + " < " + ratSrc(Xb) + " = " + pwS(b, String(a + 1))) + ", so " + LT + " is between " + fracTxt(a, 1) + " and " + fracTxt(a + 1, 1) + "."]); }
    });
    if (I.ex) rows.push(["Best bracket", m(lgS(b) + argS(I.ts) + " = " + kTxt(I.ex.k)) + " exactly."]);
    else if (I.lo && I.hi) rows.push(["Best bracket", LT + " is between " + kTxt(I.lo.k) + " and " + kTxt(I.hi.k) + "."]);
    else if (I.lo) rows.push(["Best bracket", LT + " is more than " + kTxt(I.lo.k) + "."]);
    else if (I.hi) rows.push(["Best bracket", LT + " is less than " + kTxt(I.hi.k) + "."]);
    var last = I.trials[I.trials.length - 1];
    if (last) rows.push(["Last trial", m(pwS(b, kTxt(last.k))) + " " + valTrial(last, I.t) + ": " + (last.c < 0 ? "too low" : last.c > 0 ? "too high" : "exactly") + "."]);
    if (!S.tc3.open) {
      if (I.ex) rows.push(["Estimate", m(lgS(b) + argS(I.ts) + " = " + kTxt(I.ex.k)) + " exactly"]);
      else {
        var e2 = est(I, 2), e1 = est(I, 1);
        if (e2 != null || e1 != null) {
          var e = e2 != null ? e2 : e1, two = e2 != null, end = I.lo.idx > I.hi.idx ? I.lo : I.hi, below = end.c < 0;
          rows.push(["Estimate", m(pwS(b, kTxt(end.k))) + " is " + (below ? "below " : "above ") + m(I.ts) + ", so " + LT + " is " + (below ? "more" : "less") + " than " + kTxt(end.k) + ": " +
            m(lgS(b) + argS(I.ts) + " ≈ " + fixTxt(e, two ? 2 : 1)) + " to " + (two ? "two decimal places" : "one decimal place") + "."]);
        }
      }
    }
    rows.push(["Trials used", String(Q.trials.length)]);
    $("#lg-read", host).innerHTML = MV.readoutHTML(rows);
    var tbl = I.trials.length ? MV.tableHTML({ head:["Trial " + m("x"), m(pwS(b, "x")), "Compared with " + m(I.ts)], caption:"Trials so far",
      rows:I.trials.map(function(r){ return [m(kTxt(r.k)), valTrial(r, I.t), r.c < 0 ? "too low" : r.c > 0 ? "too high" : "exactly"]; }) }) : "";
    var libs = S.tc3.open ? "" : XC.library.filter(function(l){ return Q.done[l.id]; }).map(function(l){ return '<p class="tiny muted lg-lib">' + libFacts(l) + "</p>"; }).join("");
    $("#lg-read2", host).innerHTML = (tbl ? '<p class="lg-th">Trial table</p>' + tbl + '<p class="tiny" style="margin-top:6px">Trials used: ' + Q.trials.length + "</p>" : "") + libs;
    var e2b = est(I, 2); $("#lg-cap", host).innerHTML = LT + (I.ex ? m(" = " + kTxt(I.ex.k)) : !S.tc3.open && e2b != null ? m(" ≈ " + fixTxt(e2b, 2)) : "");
  }
  function sqScene(){
    var I = sqInfo(), b = I.B, want = sqView(I), v = A.sv || want, rungs = [], marks = [], lo = v.lo, hi = v.hi;
    if (!A.sv) A.sv = want;
    for (var k = -6; k <= 6; k++) { if (k < lo - 0.3 || k > hi + 0.3) continue; rungs.push({ y:k, whole:true, l:fracTxt(k, 1), r:ratSrc(powX(b, k, 1)) }); }
    var c = effCell(I) || (A.zoomFrom || null);
    if (c && c.L >= 1) {
      var dp = c.L, tried = {}; I.trials.forEach(function(r){ tried[r.k] = r; });
      for (var j = 0; j <= 10; j++) {
        var kk = c.a + j * c.s / 10; if (kk % 1000 === 0) continue;
        rungs.push({ y:kk / 1000, whole:false, a:A.subA, l:(kk < 0 ? MINUS : "") + (Math.abs(kk) / 1000).toFixed(dp).replace(/0+$/, "").replace(/\.$/, ""), r:tried[kk] && I.ok ? valTrialTxt(tried[kk], I.t) : null });
      }
    }
    I.trials.forEach(function(r){ if (A.mk && A.mk.k === r.k) return; marks.push({ y:r.k / 1000, dir:r.c < 0 ? "up" : r.c > 0 ? "down" : "eq", l:kTxt(r.k), r:valTrialTxt(r, I.t) }); });
    var D = S.sq.dec, half = null, arrow = null;
    if (D && D.ok && D.mid != null) { half = D.mid / 1000; var mr = I.trials.filter(function(r){ return r.k === D.mid; })[0]; if (mr && !A.mk) arrow = { from:D.mid / 1000, to:(mr.c < 0 ? D.hi : D.lo) / 1000 }; }
    return { lo:lo, hi:hi, rungs:rungs, marks:marks, mk:A.mk ? A.mk.y : null, band:I.lo && I.hi ? [I.lo.k / 1000, I.hi.k / 1000] : null, half:half, arrow:arrow,
      desc:"Power ladder in Squeeze mode, base " + b.id + (I.ok ? ", target " + MV.plain(m(I.ts)) : "") + ". " + I.trials.length + " trial" + (I.trials.length === 1 ? "" : "s") + "." + (I.lo && I.hi ? " The bracket runs from exponent " + kTxt(I.lo.k) + " to " + kTxt(I.hi.k) + "." : "") };
  }
  function zoomTo(cb){
    var I = sqInfo(), want = sqView(I), from = A.sv || want;
    if (Math.abs(from.lo - want.lo) < 1e-9 && Math.abs(from.hi - want.hi) < 1e-9) { A.sv = want; P.render(); if (cb) cb(); return; }
    var deeper = want.L > (from.L || 0), dur = want.L !== (from.L || 0) ? 1200 : 500;
    if (deeper) A.subA = 0;
    MV.tween({ dur:dur, step:function(t){ A.sv = { lo:from.lo + (want.lo - from.lo) * t, hi:from.hi + (want.hi - from.hi) * t, L:want.L }; if (deeper) A.subA = t; P.render(); },
      done:function(){ A.sv = want; A.subA = 1; P.render(); if (cb) cb(); } });
  }
  function sqMsg(html){ var el = $("#lg-sqmsg", host); if (el) el.innerHTML = html ? '<p class="fb bad" role="status">' + html + "</p>" : ""; }
  function addTrial(k, viaDecide){
    var Q = S.sq, I = sqInfo();
    if (!I.ok || I.off) return;
    if (Q.trials.indexOf(k) >= 0) { sqMsg("You’ve already tried " + kTxt(k) + "."); return; }
    var prevY = Q.trials.length ? Q.trials[Q.trials.length - 1] / 1000 : (A.sv ? (A.sv.lo + A.sv.hi) / 2 : 0);
    Q.trials.push(k); Q.zo = 0; if (!viaDecide) Q.dec = null; Q.x = kTxt(k).replace(MINUS, "-"); api.save();
    markDone(sqInfo()); sqMsg("");
    A.mk = { k:k, y:prevY }; busy(true);
    MV.tween({ dur:400, step:function(t){ A.mk.y = prevY + (k / 1000 - prevY) * t; P.render(); }, done:function(){
      A.mk = null; paintAll(); api.save();
      zoomTo(function(){ busy(false); MV.changed(); });
    } });
  }
  function zoomStep(){ var I = sqInfo(), c = effCell(I); return c ? c.s / 10000 : 1; }
  function tryTyped(){
    var raw = ($("#lg-x", host) || {}).value || "", x = one(raw);
    if (!isFinite(x) || x < -6 - 1e-9 || x > 6 + 1e-9 || Math.abs(x * 1000 - Math.round(x * 1000)) > 1e-6) { sqMsg("Type an exponent from −6 to 6, with at most 3 decimal places."); return; }
    addTrial(Math.round(x * 1000));
  }
  function nudge(dir){
    var el = $("#lg-x", host), x = one(el.value), Q = S.sq; if (!isFinite(x)) x = Q.trials.length ? Q.trials[Q.trials.length - 1] / 1000 : 0;
    var st = zoomStep(), nx = Math.max(-6, Math.min(6, Math.round((x + dir * st) * 1000) / 1000));
    el.value = kTxt(Math.round(nx * 1000)).replace(MINUS, "-"); Q.x = el.value; api.save();
  }

  // ----- painting -----
  function modeHTML(){ return '<div class="lg-row">' + rgHTML("mode", [{ id:"climb", t:"Climb" }, { id:"squeeze", t:"Squeeze" }], S.mode, "seg lg-mode", "Mode") + "</div>"; }
  function bchips(list, val, dis){ return rgHTML("base", list.map(function(id){ return { id:id, t:'<span class="m p-b">' + id + "</span>" }; }), val, "chips lg-bchips", "Base b", dis); }
  function ctrlClimb(){
    var b = B(), chips = XC.chips[S.base] || [];
    return modeHTML() +
      '<div class="lg-row"><span class="lg-lab">Base <span class="m"><i class="p-b">b</i></span></span>' + bchips(CLIMB_BASES, S.base) + "</div>" +
      '<div class="lg-row"><span class="lg-lab">Rung size</span>' + rgHTML("size", [{ id:1, t:"Whole" }, { id:2, t:"Halves" }, { id:3, t:"Thirds" }], S.size, "seg", "Rung size") + "</div>" +
      '<div class="lg-row"><button type="button" class="btn lg-b40" id="lg-up" data-k="lgup"' + (S.k >= 36 ? " disabled" : "") + '>▲ Up a rung</button><button type="button" class="btn lg-b40" id="lg-dn" data-k="lgdn"' + (S.k <= -36 ? " disabled" : "") + ">▼ Down a rung</button></div>" +
      '<div class="lg-row"><label class="lg-lab" for="lg-t">Find ' + m(lgS(b)) + ' of</label><input id="lg-t" class="numin short lg-in" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(S.t) + '"></div>' +
      '<div class="lg-row chips" role="group" aria-label="Quick targets">' + chips.map(function(c){ return '<button type="button" class="chip" data-tc="' + MV.esc(c) + '" data-k="lgtc' + MV.esc(c) + '">' + m(c.replace(/−/g, "-")) + "</button>"; }).join("") + "</div>" +
      '<div class="lg-row"><button type="button" class="chip' + (S.arcs ? " on" : "") + '" id="lg-arcs" data-k="lgarcs" aria-pressed="' + !!S.arcs + '">Show ' + m("× @b{b}") + ' steps</button><button type="button" class="chip' + (S.ts ? " on" : "") + '" id="lg-ts" data-k="lgts" aria-pressed="' + !!S.ts + '">True size</button></div>';
  }
  function ctrlSqueeze(){
    var Q = S.sq, I = sqInfo(), T = S.tc3, lock = T.open, c = autoCell(I), canZo = c && (c.L - (Q.zo || 0)) > 0;
    var h = modeHTML() +
      '<div class="lg-row"><span class="lg-lab">Base <span class="m"><i class="p-b">b</i></span></span>' + bchips(SQ_BASES, Q.base, lock) + '</div><p class="tiny muted" style="margin:-4px 0 8px">' + XC.squeezeNote + "</p>" +
      '<div class="lg-row"><label class="lg-lab" for="lg-st">Target</label><input id="lg-st" class="numin short lg-in" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(Q.t) + '"' + (lock ? " disabled" : "") + "></div>" +
      (lock ? "" : '<div class="lg-row chips" role="group" aria-label="Library">' + XC.library.map(function(l){ return '<button type="button" class="chip' + (Q.lib === l.id ? " on" : "") + '" data-lib="' + l.id + '" data-k="lglib' + l.id + '" aria-pressed="' + (Q.lib === l.id) + '">' + l.label + "</button>"; }).join("") + "</div>") +
      '<div class="lg-row"><label class="lg-lab" for="lg-x">Try the exponent</label><input id="lg-x" class="numin short lg-in" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(Q.x || "") + '">' +
      '<button type="button" class="btn ghost lg-b40 lg-pm" id="lg-xm" data-k="lgxm" aria-label="Step down by ' + sig(zoomStep(), 1) + '">' + MINUS + '</button><button type="button" class="btn ghost lg-b40 lg-pm" id="lg-xp" data-k="lgxp" aria-label="Step up by ' + sig(zoomStep(), 1) + '">+</button>' +
      '<button type="button" class="btn primary sm" id="lg-try" data-k="lgtry"' + (!I.ok || I.off ? " disabled" : "") + ">Try it</button></div>" +
      '<div class="lg-row"><button type="button" class="btn ghost sm" id="lg-zo" data-k="lgzo"' + (canZo ? "" : " disabled") + ">Zoom out</button>" + (lock ? "" : '<button type="button" class="btn ghost sm" id="lg-clr" data-k="lgclr"' + (Q.trials.length ? "" : " disabled") + ">Clear trials</button>") +
      (decideCond(I) ? '<button type="button" class="btn sm" id="lg-dec" data-k="lgdec">Decide the rounding</button>' : "") + "</div>" +
      '<div id="lg-sqmsg" aria-live="polite"></div>';
    var D = Q.dec;
    if (D && (decideCond(I) || D.ok)) {
      var o = D.o;
      h += '<div class="lg-dec"><p><strong>' + o.q + '</strong></p><div class="chips" role="group" aria-label="Choices">' + o.opts.map(function(x, i){
        return '<button type="button" class="chip' + (D.pick === i ? " on" : "") + '" data-dopt="' + i + '" data-k="lgdo' + i + '" aria-pressed="' + (D.pick === i) + '"' + (D.ok ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</div>" +
        (D.pick != null ? MV.fbHTML(o.opts[D.pick].ok ? "good" : "bad", (o.opts[D.pick].ok ? "" : "<strong>✗ Not quite.</strong> ") + o.opts[D.pick].fb) : "") + "</div>";
    }
    h += '<div class="lg-tc3"><p class="lg-th">Challenge 3</p>' + (T.open ?
      '<p class="tiny">Base 10, target 448. Your trials since you started count toward the limit of 4 (trials used: ' + Q.trials.length + ").</p>" +
      '<div class="lg-row"><label class="lg-lab" for="lg-tc3a">' + m("log 448 ≈") + '</label><input id="lg-tc3a" class="numin short lg-in" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(T.ans || "") + '"></div>' +
      '<div class="lg-row"><button type="button" class="btn ghost sm" id="lg-tc3re" data-k="lgtc3re">Restart challenge</button><button type="button" class="btn ghost sm" id="lg-tc3x" data-k="lgtc3x">Leave challenge</button></div>'
      : '<p class="tiny muted">Press this before you work on challenge 3: it sets up ' + m("log 448") + ", hides the library and the Estimate row, and counts your trials from 0.</p>" +
        '<button type="button" class="btn sm" id="lg-tc3go" data-k="lgtc3go">Start challenge 3</button>') + "</div>";
    return h;
  }
  function paintCtrl(){ MV.keepFocus(ctrl, function(){ ctrl.innerHTML = S.mode === "climb" ? ctrlClimb() : ctrlSqueeze(); }); ctrl.classList.toggle("lg-busy", A.busy); }
  function paintRead(){ if (S.mode === "climb") paintClimbRead(); else paintSqRead(); }
  function paintStrip(){
    var el = $("#lg-strip", host), on = S.mode === "climb" && !!S.ts; el.hidden = !on;
    $("#lg-kbd", host).hidden = S.mode !== "climb";
    $(".lg-heads", host).classList.toggle("sq", S.mode !== "climb");
    if (!on) return;
    $("#lg-scale", host).textContent = "Scale: 0 to " + scaleTxt(S.strip);
    $("#lg-mag", host).disabled = S.strip <= 1e-6 * 1.0001 || A.busy; $("#lg-sreset", host).disabled = A.busy;
    SP.render();
  }
  function scaleTxt(v){ return v >= 1 ? groupStr(String(Math.round(v))) : groupStr(v.toFixed(Math.round(-Math.log10(v)))); }
  SP.render = function(){
    if ($("#lg-strip", host).hidden) return;
    var b = B(), v = Math.pow(b.v, A.y), max = S.strip;
    SP.draw({ view:{ xmin:0, xmax:1, ymin:-1, ymax:1 }, grid:false, axes:false, ticks:false, after:function(ctx, p){
      var W = p.W, Hh = p.H, x0 = 18, x1 = W - 22, cy = Hh * 0.42, ink = css("--ink"), ink2 = css("--ink-2"), fM = p.fontM;
      ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(x1, cy); ctx.stroke();
      for (var i = 0; i <= 10; i++) { var x = x0 + (x1 - x0) * i / 10; ctx.beginPath(); ctx.moveTo(x, cy - (i % 5 ? 3 : 6)); ctx.lineTo(x, cy + (i % 5 ? 3 : 6)); ctx.stroke(); }
      ctx.font = "13px " + fM; ctx.fillStyle = ink2; ctx.textBaseline = "top"; ctx.textAlign = "left"; ctx.fillText("0", x0 - 3, cy + 10); ctx.textAlign = "right"; ctx.fillText(scaleTxt(max), x1 + 4, cy + 10);
      if (A.ghost != null && A.ghost <= max) { var gx = x0 + (x1 - x0) * A.ghost / max; ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, cy - 16); ctx.lineTo(gx, cy + 8); ctx.stroke(); ctx.restore();
        ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(groupStr(String(A.ghost)) + " (halfway value)", gx, cy - 17); }
      var frac = Math.min(1, v / max), bx = x0 + (x1 - x0) * frac;
      ctx.strokeStyle = css("--pen"); ctx.lineWidth = 7; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(x0, cy); ctx.lineTo(Math.max(x0 + 1.5, bx), cy); ctx.stroke();
      if (v > max) { ctx.fillStyle = css("--pen"); ctx.beginPath(); ctx.moveTo(x1 + 14, cy); ctx.lineTo(x1, cy - 8); ctx.lineTo(x1, cy + 8); ctx.closePath(); ctx.fill();
        ctx.font = "600 13px " + fM; ctx.fillStyle = ink; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("value " + shortTxt(powX(b, Math.round(A.y * 6), 6)) + " is off the end", x1, cy - 10); }
    }, describe:"True-size strip from 0 to " + scaleTxt(max) + ". The bar shows the value " + shortTxt(powX(b, Math.round(A.y * 6), 6)) + (v > max ? ", which runs off the right end." : ".") });
  };
  P.render = function(){
    var sc = S.mode === "climb" ? climbScene() : sqScene();
    P.draw({ view:{ xmin:0, xmax:1, ymin:sc.lo, ymax:sc.hi }, grid:false, axes:false, ticks:false, after:function(ctx, p){ ctx.save(); drawLadder(ctx, p, sc); ctx.restore(); }, describe:sc.desc });
  };
  function paintAll(){ paintCtrl(); paintRead(); P.render(); paintStrip(); }

  // ----- climb actions -----
  function follow(){ if (A.y > A.vc + 2) A.vc = A.y - 2; if (A.y < A.vc - 2) A.vc = A.y + 2; A.vc = clampVc(A.vc); }
  function clearFlag(){ A.flag = null; A.glow = null; }
  function celebrate(){
    var t = tgt(); if (!t || t.bad || t.v <= 0) return;
    var b = B(), X = powX(b, S.k, 6); if (!near(X.v, t.v)) return;
    var rs = rungSrc(S.k, 6), k = S.k;
    A.flag = { y:k / 6, t:MV.plain(m(t.src)), s:0 }; A.glow = k;
    setBanner("good", "✓ " + m(lgS(b) + argS(t.src) + " = " + rs));
    MV.tween({ dur:300, step:function(s){ if (A.flag) A.flag.s = s; P.render(); } });
    MV.wait(1000, function(){ if (A.glow === k) { A.glow = null; P.render(); } });
  }
  function landed(){ paintRead(); P.render(); paintStrip(); var u = $("#lg-up", host), d = $("#lg-dn", host); if (u) u.disabled = S.k >= 36; if (d) d.disabled = S.k <= -36; celebrate(); MV.changed(); }
  function moveTo(k2, dur, cb){
    k2 = Math.max(-36, Math.min(36, k2));
    if (A.cancel) { A.cancel(); A.cancel = null; }
    var y1 = A.y, y2 = k2 / 6; if (k2 !== S.k || Math.abs(y1 - y2) > 1e-9) { clearFlag(); setBanner("", ""); }
    var jl = Math.floor(Math.min(y1, y2) + 1e-9), jh = Math.ceil(Math.max(y1, y2) - 1e-9);
    for (var j = jl; j < jh; j++) A.dir[j] = y2 < y1 ? "down" : "up";
    S.k = k2; api.save(); A.moving = true; A.bold = null;
    A.cancel = MV.tween({ dur:dur == null ? 500 : dur, step:function(t){ A.y = y1 + (y2 - y1) * t; A.pulse = Math.floor((y1 + y2) / 2 + 1e-9); follow(); P.render(); paintStrip(); },
      done:function(){ A.cancel = null; A.moving = false; A.y = y2; A.pulse = null; A.bold = k2; follow(); landed(); if (cb) cb(); } });
  }
  function climbBy(dk){ if (A.busy) return; moveTo(S.k + dk); }
  function setBase(id){
    if (id === S.base) return; var from = S.base; S.base = id; A.dir = {}; clearFlag(); setBanner("", ""); api.save();
    A.fade = { from:from, t:0 };
    MV.tween({ dur:800, step:function(t){ if (A.fade) A.fade.t = t; P.render(); paintStrip(); }, done:function(){ A.fade = null; P.render(); celebrate(); MV.changed(); } });
    paintCtrl(); paintRead(); if (MV.reduceMotion) { A.fade = null; P.render(); }
  }
  function setSize(n){
    n = +n; if (n === S.size) return; S.size = n; api.save();
    var st = 6 / n, k2 = Math.floor((S.k + st / 2) / st) * st;
    A.grow = 0; MV.tween({ dur:600, step:function(t){ A.grow = t; P.render(); }, done:function(){ A.grow = 1; P.render(); } });
    paintCtrl();
    if (k2 !== S.k) moveTo(k2, 400); else { paintRead(); MV.changed(); }
  }
  function applyTarget(animate){
    A.lastT = S.t; api.save(); paintRead(); clearFlag(); setBanner("", ""); P.render();
    var t = tgt(); if (!t || t.bad) { MV.changed(); return; }
    if (t.v <= 0 && animate) zeroRun(t); else celebrate();
    MV.changed();
  }
  function zeroRun(t){
    var b = B(), end = b.v > 1 ? -36 : 36, ts0 = S.ts, strip0 = S.strip, y1 = A.y, y2 = end / 6, dur = Math.abs(y2 - y1) * 150;
    if (A.cancel) { A.cancel(); A.cancel = null; }
    S.ts = true; busy(true); paintCtrl(); paintStrip();
    setBanner("bad", "Every rung is still above 0. No rung is " + m(t.src) + ".");
    A.moving = true;
    function mag(){ var v = Math.pow(b.v, A.y); while (S.strip > 1e-6 * 1.0001 && v < S.strip / 10) S.strip /= 10; }
    A.cancel = MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(x){ A.y = y1 + (y2 - y1) * x; follow(); mag(); P.render(); paintStrip(); }, done:function(){
      MV.wait(500, function(){
        A.cancel = MV.tween({ dur:dur, ease:function(x){ return x; }, step:function(x){ A.y = y2 + (y1 - y2) * x; follow(); P.render(); paintStrip(); }, done:function(){
          A.cancel = null; A.moving = false; A.y = y1; S.ts = ts0; S.strip = strip0; busy(false); api.save(); paintCtrl(); landed();
        } });
      });
    } });
  }

  // ----- events -----
  function chooseRg(name, v){
    if (A.busy) return;
    if (name === "mode") { if (v !== S.mode) { S.mode = v; setBanner("", ""); api.save(); if (v === "squeeze") A.sv = null; paintAll(); MV.changed(); } return; }
    if (name === "base") {
      if (S.mode === "climb") setBase(v);
      else { var Q = S.sq; if (Q.base !== v) { Q.base = v; Q.trials = []; Q.zo = 0; Q.dec = null; Q.lib = null; var l = libMatch(sqInfo()); Q.lib = l ? l.id : null; A.sv = null; api.save(); paintAll(); MV.changed(); } }
      return;
    }
    if (name === "size") setSize(v);
  }
  ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || A.busy) return;
    var Q = S.sq;
    if (b.dataset.rg) { chooseRg(b.dataset.rg, b.dataset.v); return; }
    if (b.id === "lg-up") return climbBy(6 / S.size);
    if (b.id === "lg-dn") return climbBy(-6 / S.size);
    if (b.dataset.tc != null) { S.t = b.dataset.tc.replace(/−/g, "-"); var inp = $("#lg-t", host); if (inp) inp.value = S.t; applyTarget(true); return; }
    if (b.id === "lg-arcs") { S.arcs = !S.arcs; api.save(); paintCtrl(); P.render(); return; }
    if (b.id === "lg-ts") { S.ts = !S.ts; if (S.ts) { S.strip = 1; A.ghost = null; } api.save(); paintCtrl(); paintStrip(); return; }
    if (b.dataset.lib) { var l = MV.C.explore.library.filter(function(x){ return x.id === b.dataset.lib; })[0]; Q.base = l.base; Q.t = l.t; Q.lib = l.id; Q.trials = []; Q.zo = 0; Q.dec = null; A.sv = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.id === "lg-try") return tryTyped();
    if (b.id === "lg-xm" || b.id === "lg-xp") return nudge(b.id === "lg-xp" ? 1 : -1);
    if (b.id === "lg-zo") { var c = autoCell(sqInfo()); if (c) Q.zo = Math.min(c.L, (Q.zo || 0) + 1); api.save(); paintCtrl(); zoomTo(); return; }
    if (b.id === "lg-clr") { Q.trials = []; Q.zo = 0; Q.dec = null; api.save(); paintAll(); zoomTo(); MV.changed(); return; }
    if (b.id === "lg-dec") { var I = sqInfo(); Q.dec = { pick:null, ok:false, o:decOpts(I), mid:I.lo.k + 5, lo:I.lo.k, hi:I.hi.k }; api.save(); paintCtrl(); MV.focusFb(ctrl); return; }
    if (b.dataset.dopt != null) {
      var D = Q.dec, i = +b.dataset.dopt; D.pick = i; var right = !!D.o.opts[i].ok; api.save();
      if (right) { D.ok = true; paintCtrl(); P.render(); MV.wait(700, function(){ addTrial(D.mid, true); }); }
      else paintCtrl();
      return;
    }
    if (b.id === "lg-tc3go") { S.tc3 = { open:true, ans:"", proof:null }; Q.base = "10"; Q.t = "448"; Q.lib = null; Q.trials = []; Q.zo = 0; Q.dec = null; Q.x = ""; A.sv = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.id === "lg-tc3re") { Q.trials = []; Q.zo = 0; Q.dec = null; A.sv = null; api.save(); paintAll(); MV.changed(); return; }
    if (b.id === "lg-tc3x") { S.tc3.open = false; api.save(); paintAll(); MV.changed(); return; }
  });
  ctrl.addEventListener("keydown", function(e){
    var r = rgKey(e, ctrl); if (r) { chooseRg(r.name, r.v); rgFocus(ctrl, r.name, r.v); return; }
    var id = e.target.id;
    if (e.key === "Enter" && id === "lg-t") { e.preventDefault(); S.t = e.target.value; if (!A.busy) applyTarget(true); }
    if (e.key === "Enter" && id === "lg-st") { e.preventDefault(); e.target.blur(); }
    if (id === "lg-x") {
      if (e.key === "Enter") { e.preventDefault(); if (!A.busy) tryTyped(); }
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); nudge(e.key === "ArrowUp" ? 1 : -1); }
    }
  });
  ctrl.addEventListener("input", function(e){
    var id = e.target.id;
    if (id === "lg-t") { S.t = e.target.value; api.save(); paintRead(); clearFlag(); P.render(); MV.changed(); }
    else if (id === "lg-x") { S.sq.x = e.target.value; api.save(); }
    else if (id === "lg-tc3a") { S.tc3.ans = e.target.value; api.save(); MV.changed(); }
  });
  ctrl.addEventListener("change", function(e){
    var id = e.target.id;
    if (id === "lg-t") { S.t = e.target.value; if (A.lastT !== S.t && !A.busy) applyTarget(true); }
    else if (id === "lg-st") {
      var Q = S.sq; if (e.target.value === Q.t) return;
      Q.t = e.target.value; Q.trials = []; Q.zo = 0; Q.dec = null; var l = libMatch(sqInfo()); Q.lib = l ? l.id : null; A.sv = null; api.save();
      var I = sqInfo(); paintAll(); MV.changed();
      if (!I.ok) sqMsg("Type a positive number from 0.000 001 to 1 000 000.");
    }
  });
  $("#lg-cv", host).addEventListener("keydown", function(e){
    if (S.mode !== "climb" || A.busy) return;
    var st = 6 / S.size, d = { ArrowUp:st, ArrowDown:-st, PageUp:6, PageDown:-6 }[e.key];
    if (d) { e.preventDefault(); moveTo(S.k + d); return; }
    if (e.key === "Home") { e.preventDefault(); moveTo(0); }
  });
  $("#lg-mag", host).addEventListener("click", function(){ if (A.busy) return; S.strip = Math.max(1e-6, S.strip / 10); api.save(); paintStrip(); });
  $("#lg-sreset", host).addEventListener("click", function(){ if (A.busy) return; S.strip = 1; A.ghost = null; api.save(); paintStrip(); });

  // ----- "What you found" (opens after P4; stays as a details box) -----
  var found = document.createElement("div"); found.className = "part lg-found"; found.hidden = true;
  found.innerHTML = '<details id="lg-found"><summary>' + XC.found.title + "</summary><ul>" + XC.found.items.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul></details>";
  var predPart = $("#pred") && $("#pred").closest(".part"); if (predPart) predPart.parentNode.insertBefore(found, predPart.nextSibling);
  function showFound(open){ found.hidden = false; if (open) $("#lg-found").open = true; }
  if (MV.S.preds && MV.S.preds.p4) showFound(false);

  // ----- TC3 success text: fill in the student's own bracket -----
  function fillTc3(){ var pr = S.tc3.proof; if (!pr) return; var a = $("#chal .lg-tc3lo"), c = $("#chal .lg-tc3hi"); if (a && a.textContent !== pr.lo) a.textContent = pr.lo; if (c && c.textContent !== pr.hi) c.textContent = pr.hi; }
  if ($("#chal")) new MutationObserver(fillTc3).observe($("#chal"), { childList:true, subtree:true });

  // ----- challenge tests -----
  function rightBaseMsg(b, rs, val){ return "Right value, wrong base: you’re showing " + m(lgS(b) + val + " = " + rs) + ". "; }
  function chal(id){
    var b = B(), X = powX(b, S.k, 6), rs = rungSrc(S.k, 6);
    if (id === "tc1" || id === "tc2") {
      if (S.mode !== "climb") return { ok:false, msg:"Switch to Climb mode: this challenge uses the climber." };
      if (id === "tc1") {
        if (S.base === "4" && S.k === -18) return { ok:true };
        if (S.base === "4" && S.k === 18) return { ok:false, msg:m("4^3 = 64") + ". You need 1/64, which is below 1: go below rung 0." };
        if (S.base === "4" && S.k === -12) return { ok:false, msg:m("4^{-2} = 1/16") + ". One more rung down." };
        if (near(X.v, 1 / 64)) return { ok:false, msg:rightBaseMsg(b, rs, "(1/64)") + "The question asks for base 4." };
        return { ok:false, msg:"Your value is " + fullH(X) + ". You need 1/64 on the base-4 ladder." };
      }
      if (S.base === "8" && S.k === 4) return { ok:true };
      if (S.base === "4" && S.k === 9) return { ok:false, msg:"That’s " + m("log_4 8 = 3/2") + ": the base and the number are swapped. In " + m("log_8 4") + ", the base is 8." };
      if (S.base === "8" && S.size === 2) return { ok:false, msg:"Half rungs on the base-8 ladder near 4 give 1, " + m("√8 ≈ 2.83") + " and 8. None of them is 4. Try thirds." };
      if (S.base === "8" && S.k === 2) return { ok:false, msg:H("8^{1/3} = √{8} = 2", { rat:false, q:3 }) + ". One more third of a rung." };
      if (S.base === "8" && S.k === 6) return { ok:false, msg:m("8^1 = 8") + ", too big. 4 is less than 8, so the rung is between 0 and 1." };
      if (near(X.v, 4)) return { ok:false, msg:rightBaseMsg(b, rs, " 4") + "You need base 8." };
      return { ok:false, msg:"Your value is " + fullH(X) + ". You need 4 on the base-8 ladder." };
    }
    if (id === "tc3") {
      var T = S.tc3, Q = S.sq;
      if (!T.open) return { ok:false, msg:"Press <strong>Start challenge 3</strong> under the Squeeze controls first. It sets up " + m("log 448") + " and counts your trials." };
      var a = one(T.ans), I = sqInfo(), n = Q.trials.length;
      if (!isFinite(a)) return { ok:false, msg:"Type your estimate in the box: " + m("log 448 ≈") + " [ ]." };
      var gen = "Check your trials: which two tenths is 448 between, and which way does it round?";
      if (Q.base !== "10" || !near(I.t, 448)) return { ok:false, msg:gen };
      if (near(a, 2.7)) {
        if (n > 4) return { ok:false, msg:"Right answer, but you used " + n + " trials. You can skip the whole-number trials: " + m("10^2 = 100") + " and " + m("10^3 = 1000") + ", so " + m("log 448") + " is already known to be between 2 and 3. Press Restart challenge and try again." };
        var lows = I.trials.filter(function(r){ return r.c < 0 && r.k >= 2650; }), highs = I.trials.filter(function(r){ return r.c > 0 && r.k <= 2750; });
        if (!lows.length || !highs.length) return { ok:false, msg:"That’s the right value, but your trials don’t show it yet. To round to 2.7, you need to know that " + m("log 448") + " is above 2.65 and below 2.75. Which trials show that?" };
        var lo = Math.max.apply(null, lows.map(function(r){ return r.k; })), hi = Math.min.apply(null, highs.map(function(r){ return r.k; }));
        T.proof = { lo:kTxt(lo), hi:kTxt(hi) }; api.save(); setTimeout(fillTc3, 0);
        return { ok:true };
      }
      if (near(a, 2.6)) return { ok:false, msg:"448 is closer to " + m("10^{2.6} ≈ 398") + " than to " + m("10^{2.7} ≈ 501") + ", but that isn’t the test: the values don’t grow evenly. Try the halfway exponent, 2.65." };
      if (near(a, 2.65) || near(a, 2.66)) return { ok:false, msg:"That’s two decimal places. Round to one." };
      if (near(a, 44.8)) return { ok:false, msg:"That’s 448 ÷ 10. A logarithm is an exponent: 10 to what power gives 448?" };
      if (near(a, 3)) return { ok:false, msg:"That’s to the nearest whole number. Give one decimal place." };
      return { ok:false, msg:gen };
    }
    return { ok:false };
  }

  // ----- predictions -----
  function startPred(p){
    var s = p.start;
    if (A.cancel) { A.cancel(); A.cancel = null; }
    S.mode = "climb"; S.base = s.base; S.size = s.size; S.k = s.k; S.arcs = s.arcs !== false; S.ts = !!s.ts; S.strip = s.strip || 1; S.t = "";
    A.y = s.k / 6; A.vc = clampVc(s.k / 6); A.dir = {}; A.fade = null; A.grow = 1; A.bold = null; A.moving = false; A.ghost = null; clearFlag();
    api.save(); busy(true); setBanner("", "Watch what happens…"); paintAll();
  }
  function runPred(p, done){
    var steps = [];
    function mv(dk, dur){ steps.push(function(nx){ moveTo(S.k + dk, dur, nx); }); }
    function wt(ms){ steps.push(function(nx){ MV.wait(ms, nx); }); }
    if (p.id === "p1") { mv(-6, 500); mv(-6, 500); mv(-6, 500); }
    else if (p.id === "p2") { for (var i = 0; i < 6; i++) steps.push(function(nx){ moveTo(S.k - 6, 600, function(){ if (S.k <= -12) { S.strip = Math.max(1e-6, S.strip / 10); api.save(); paintStrip(); } nx(); }); }); }
    else if (p.id === "p3") { steps.push(function(nx){ A.ghost = 54; paintStrip(); nx(); }); mv(3, 600); }
    else if (p.id === "p4") { mv(6, 500); mv(6, 500); mv(6, 500); wt(700); for (var j = 0; j < 6; j++) mv(-6, 450); }
    var i2 = 0;
    (function nx(){ if (i2 >= steps.length) { busy(false); paintCtrl(); paintStrip(); if (p.id === "p4") showFound(true); done(); return; } steps[i2++](nx); })();
  }

  paintAll();
  setTimeout(fillTc3, 0);
  EX = { S:S };
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: from ladder to graph ----------
var A3 = { "2":{ r:[-3, 3], view:{ xmin:-1, xmax:9, ymin:-3.75, ymax:3.75 } }, "3":{ r:[-2, 2], view:{ xmin:-1, xmax:10, ymin:-4.125, ymax:4.125 } },
  "10":{ r:[-2, 1], view:{ xmin:-1, xmax:11, ymin:-4.5, ymax:4.5 } }, "1/2":{ r:[-3, 3], view:{ xmin:-1, xmax:9, ymin:-3.75, ymax:3.75 } } };
function fmt1(v){ return (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); }
// base info for Part 3: chips keep exact fractions; slider values are decimals
function binfo(id, chip){
  if (chip) {
    var Bq = base(id), inv = Bq.d > 1 ? (Bq.n === 1 ? String(Bq.d) : Bq.d + "/" + Bq.n) : "1/" + Bq.n;
    return { v:Bq.v, txt:id, inv:inv, ten:id === "10", frac:Bq.d > 1, B:Bq, chip:true };
  }
  var v = Math.round(parseFloat(id) * 10) / 10, txt = fmt1(v), whole = Math.abs(v - Math.round(v)) < 1e-9, iv = 1 / v, ex = Math.abs(iv * 1000 - Math.round(iv * 1000)) < 1e-6;
  return { v:v, txt:txt, inv:whole ? "1/" + Math.round(v) : ex ? String(Math.round(iv * 1000) / 1000) : "≈ " + iv.toFixed(2), ten:false, frac:false, chip:false };
}
function pw3(bi, e){ return (bi.frac ? "(@b{" + bi.txt + "})" : "@b{" + bi.txt + "}") + "^{" + e + "}"; }
function lg3(bi){ return bi.ten ? "log" : "log_{@b{" + bi.txt + "}}"; }
function featRows(bi){
  var inc = bi.v > 1;
  return [["Function", m("y = " + lg3(bi) + " x")], ["Means", m(pw3(bi, "y") + " = x")], ["Domain", m("{x ∈ ℝ | x > 0}") + ", or " + m("(0, ∞)")], ["Range", m("{y ∈ ℝ}") + ", or " + m("(-∞, ∞)")],
    ["Vertical asymptote", m("x = 0") + " (the " + m("y") + "-axis)"], [m("x") + "-intercept", "1, at (1, 0)"], [m("y") + "-intercept", "None: " + m("x = 0") + " isn’t in the domain"],
    ["Key points", m("(" + bi.inv + ", -1)") + ", (1, 0), " + m("(" + bi.txt + ", 1)")], ["Increasing or decreasing", (inc ? "Increasing" : "Decreasing") + " on " + m("(0, ∞)")],
    ["End behaviour", inc ? "Q4 to Q1: as " + m("x → 0^{+}") + ", " + m("y → -∞") + "; as " + m("x → ∞") + ", " + m("y → ∞") : "Q1 to Q4: as " + m("x → 0^{+}") + ", " + m("y → ∞") + "; as " + m("x → ∞") + ", " + m("y → -∞")],
    ["Where " + m("y < 0"), inc ? m("0 < x < 1") + ", or " + m("(0, 1)") : m("x > 1") + ", or " + m("(1, ∞)")]];
}
function par(bv, y0, y1, n){ var out = []; n = n || 500; for (var i = 0; i <= n; i++) { var t = y0 + (y1 - y0) * i / n; out.push([Math.pow(bv, t), t]); } return out; }

function part3(host, api){
  var S3 = api.S, C3 = MV.C.part3;
  if (["A", "B", "C", "D"].indexOf(S3.step) < 0) S3.step = "A";
  if (!A3[S3.ab]) S3.ab = "2";
  if (S3.ph == null) S3.ph = 0;
  if (S3.b == null) { S3.b = "2"; S3.bc = true; }
  if (S3.win !== "100") S3.win = "10";
  if (S3.j == null) S3.j = 0;
  S3.trail = S3.trail || [];
  S3.d = S3.d || { i:0, items:{} };
  var T = { u:{}, c:S3.ph >= 2 ? 1 : 0, asy:S3.ph >= 2, view:null, fail:null, shake:0, dc:{} };
  host.innerHTML = '<div class="lg3"><div class="lg3-graph"><p class="banner" id="lg3-ban" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="lg3-cv" role="img" aria-label="Graph"></canvas></div><p class="tiny muted" id="lg3-note"></p></div>' +
    '<div class="lg3-read"><p class="lg-th" id="lg3-rh">Features</p><dl class="read" id="lg3-read" aria-live="polite"></dl></div></div>' +
    '<div class="lg-row lg3-steps" id="lg3-steps"></div><div id="lg3-panel" class="lg3-panel"></div>';
  var P = new MV.Plot($("#lg3-cv", host), A3["2"].view), panel = $("#lg3-panel", host);
  function bB(){ return binfo(S3.b, S3.bc); }
  function curBi(){ if (S3.step === "A") return binfo(S3.ab, true); if (S3.step === "D") { var it = C3.build[S3.d.i]; return binfo(it.base, true); } return bB(); }
  function M(bi){ return bi.v > 1 ? bi.v : 1 / bi.v; }
  function jMax(bi){ return Math.abs(M(bi) - 10) < 1e-9 ? 6 : 10; }
  function banner(kind, html){ var el = $("#lg3-ban", host); el.className = "banner" + (kind ? " " + kind : ""); el.innerHTML = html || ""; }
  function probeXY(){ var bi = bB(), Mv = M(bi), x = Math.pow(Mv, S3.j); return { x:x, y:bi.v > 1 ? S3.j : -S3.j }; }
  function probeView(){
    var pq = probeXY(), xmax = Math.max(11, pq.x * 1.15), ymin = Math.min(-4.5, pq.y - 1.2), ymax = Math.max(4.5, pq.y + 1.2), xmin = -xmax / 12;
    if (T.fail) { xmin = -3.2; xmax = 11; }
    return { xmin:xmin, xmax:xmax, ymin:ymin, ymax:ymax };
  }
  // exact text for M^j (chip bases) or a decimal (slider bases)
  function xTxt(j, bi){
    var Mv = M(bi), v = Math.pow(Mv, j);
    if (bi.chip) { var n = Math.round(Mv); return j >= 0 ? groupStr(String(Math.pow(n, j))) : "1/" + groupStr(String(Math.pow(n, -j))); }
    return Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6 * Math.max(1, v * 1e4) ? groupStr(String(Math.round(v * 1e4) / 1e4)) : "≈ " + sig(v, 4);
  }
  function viewFor(){
    if (S3.step === "A") return A3[S3.ab].view;
    if (S3.step === "D") return C3.build[S3.d.i].view;
    if (S3.step === "C") return T.view || probeView();
    return S3.win === "100" ? { xmin:-5, xmax:100, ymin:-4.5, ymax:4.5 } : { xmin:-1, xmax:11, ymin:-4.5, ymax:4.5 };
  }
  function keyPts(bi){ return [{ x:1 / bi.v, y:-1, label:"(" + bi.inv + ", " + MINUS + "1)" }, { x:1, y:0, label:"(1, 0)" }, { x:bi.v, y:1, label:"(" + bi.txt + ", 1)" }]; }
  function domainStrip(ctx, p){ var y0 = p.Y(0), x0 = p.X(0); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(x0, y0 - 9, p.W - x0, 7); p.point({ x:0, y:0, open:true, color:css("--pen"), r:5 }); }
  P.render = function(){
    var v = viewFor(), pen = css("--pen"), ink2 = css("--ink-2"), sc = { view:v, curves:[], points:[], asymptotes:[], labels:[] };
    if (S3.step === "A") {
      var ab = S3.ab, cfg = A3[ab], Ba = base(ab), rs = [];
      for (var r = cfg.r[1]; r >= cfg.r[0]; r--) rs.push(r);
      if (T.c > 0) { var pts = par(Ba.v, v.ymin, v.ymax, 400), n = Math.max(2, Math.round(pts.length * T.c)); sc.curves.push({ pts:pts.slice(0, n), color:pen, width:3 }); }
      if (T.asy) sc.asymptotes.push({ x:0, label:"x = 0 (vertical asymptote)" });
      sc.after = function(ctx, p){
        var x0 = p.X(0), ink = css("--ink"), fM = p.fontM;
        rs.forEach(function(rr){
          var X = powX(Ba, rr, 1), u = S3.ph >= 1 ? 1 : (T.u[rr] || 0), yy = p.Y(rr), tx = p.X(X.v);
          if (u > 0) { ctx.save(); ctx.globalAlpha = 0.45; ctx.strokeStyle = ink2; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(tx, yy); ctx.stroke(); ctx.restore(); }
          if (u < 1) { ctx.save(); ctx.globalAlpha = 1 - u; ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 - 1, yy); ctx.lineTo(x0 + 13, yy); ctx.stroke(); ctx.restore(); }
          ctx.font = "600 14px " + fM; ctx.fillStyle = ink; ctx.textBaseline = "middle"; ctx.textAlign = "left";
          if (u >= 1) { p.point({ x:X.v, y:rr, r:5, color:ink }); var lab = "(" + ratSrc(X) + ", " + fracTxt(rr, 1) + ")"; ctx.font = "600 13px " + fM; var lx = p.X(X.v) + 9; if (lx + ctx.measureText(lab).width > p.W - 4) { ctx.textAlign = "right"; lx = p.X(X.v) - 9; } ctx.fillStyle = ink; ctx.fillText(lab, lx, yy - 11); }
          else { var sx = x0 + 18 + (tx - x0 - 18) * u; ctx.fillText(ratSrc(X), sx, yy); }
        });
        if (T.c >= 1) { var pp = par(Ba.v, v.ymin, v.ymax, 400), inside = pp.filter(function(q){ return q[0] <= v.xmax && q[0] >= v.xmin && q[1] >= v.ymin && q[1] <= v.ymax; }); if (inside.length > 8) { var endI = Ba.v > 1 ? inside.length - 1 : 0, prevI = Ba.v > 1 ? endI - 6 : 6; p.head(inside[prevI], inside[endI], pen, 14); } }
      };
      sc.describe = "Base-" + ab + " ladder on the y-axis" + (S3.ph >= 1 ? ", slid out: each rung y moved to x = " + ab + " to the power y, giving the points " + rs.slice().reverse().map(function(rr){ return "(" + ratSrc(powX(Ba, rr, 1)) + ", " + fracTxt(rr, 1) + ")"; }).join(", ") : ": rungs at heights " + cfg.r[0] + " to " + cfg.r[1]) + (T.c >= 1 ? ". The curve y = log base " + ab + " of x joins them, with the vertical asymptote x = 0." : ".");
    } else if (S3.step === "B" || S3.step === "C") {
      var bi = bB(), main = par(bi.v, v.ymin - 1, v.ymax + 1, 600);
      if (S3.step === "B" && S3.prev) { var pb = binfo(S3.prev.b, S3.prev.c); sc.curves.push({ pts:par(pb.v, v.ymin - 1, v.ymax + 1, 500), color:ink2, width:2, dash:[6, 6], alpha:0.6 }); }
      if (S3.step === "B" && S3.expo) { sc.curves.push({ f:function(x){ return Math.pow(bi.v, x); }, color:css("--f3"), width:2.6 }); sc.curves.push({ f:function(x){ return x; }, color:ink2, width:1.5, dash:[2, 5] }); }
      if (S3.step === "B" && S3.recip) sc.curves.push({ pts:par(1 / bi.v, v.ymin - 1, v.ymax + 1, 500), color:css("--ink"), width:2, dash:[10, 6] });
      sc.curves.push({ pts:main, color:pen, width:3, arrows:true });
      sc.asymptotes.push({ x:0, label:"x = 0" });
      if (S3.step === "B") sc.points = keyPts(bi).map(function(q){ return { x:q.x, y:q.y, label:q.label, color:css("--ink") }; });
      if (S3.step === "B" && S3.win === "100") sc.xTicks = { step:10 };
      var after = domainStrip;
      if (S3.step === "C") {
        var pq = probeXY(), F = T.fail;
        after = function(ctx, p){
          domainStrip(ctx, p);
          if (F) { var fx = p.X(F.x) + T.shake, fy = p.Y(pq.y); ctx.beginPath(); ctx.arc(fx, fy, 12, 0, Math.PI * 2); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.arc(fx, fy, 7, 0, Math.PI * 2); ctx.fillStyle = css("--ink"); ctx.fill();
            ctx.font = "700 15px " + p.fontUI; ctx.fillStyle = css("--red"); ctx.textAlign = F.x < 0 ? "left" : "left"; ctx.textBaseline = "bottom"; ctx.fillText("✗ No point here", fx + 12, fy - 10); }
          else p.point({ x:pq.x, y:pq.y, r:7, ring:true, color:css("--ink") });
        };
        sc.describe = "Graph of y = log base " + bi.txt + " of x with the probe at (" + MV.plain(m(xTxt(S3.j, bi))) + ", " + fracTxt(pq.y, 1) + ")" + (F ? ". x = " + F.x + " has no point: the probe shows No point here." : ".");
      } else sc.describe = "Graph of y = log base " + bi.txt + " of x. Vertical asymptote x = 0. Passes through " + keyPts(bi).map(function(q){ return q.label; }).join(", ") + ". " + (bi.v > 1 ? "Increasing." : "Decreasing.") + (S3.expo ? " Also y = " + bi.txt + " to the x and the line y = x." : "") + (S3.recip ? " Also the base 1/b graph, its mirror image in the x-axis." : "");
      sc.after = after;
    } else {
      var it = C3.build[S3.d.i], st = dState(it), bd = base(it.base);
      sc.xTicks = it.view.xmax > 15 ? { step:2 } : undefined;
      if (st.solved) {
        var c = T.dc[it.id] == null ? 1 : T.dc[it.id], ppd = par(bd.v, it.view.ymin, it.view.ymax, 400), nd = Math.max(2, Math.round(ppd.length * c));
        sc.curves.push({ pts:ppd.slice(0, nd), color:pen, width:3, arrows:c >= 1 });
        if (c >= 1) sc.asymptotes.push({ x:0, label:"x = 0" });
        sc.points = it.rows.map(function(rw){ var x = rw.ask === "x" ? one(MV.ans(rw)) : one(rw.x), y = rw.ask === "y" ? one(MV.ans(rw)) : one(rw.y); return { x:x, y:y, color:css("--ink"), r:5 }; });
        sc.describe = "Graph of " + MV.plain(it.fn) + " through the points you built, with the vertical asymptote x = 0.";
      } else sc.describe = "Empty grid for " + MV.plain(it.fn) + ". The points appear when your table is right.";
    }
    sc.equal = false; P.draw(sc);
  };
  function paintSteps(){ var el = $("#lg3-steps", host); MV.keepFocus(el, function(){ el.innerHTML = rgHTML("p3step", C3.steps.map(function(t, i){ return { id:"ABCD"[i], t:t }; }), S3.step, "seg lg3-seg", "Steps"); }); }
  function paintRead(){
    var bi = curBi(), dOk = S3.step !== "D" || dState(C3.build[S3.d.i]).solved;
    $("#lg3-rh", host).textContent = "Features of the graph";
    $("#lg3-read", host).innerHTML = dOk ? MV.readoutHTML(featRows(bi)) : '<div><dt>Features</dt><dd class="muted">They appear when your table is right.</dd></div>';
    var note = "";
    if (S3.step === "A" && S3.ab === "10") note = C3.note10;
    if (S3.step === "B" && S3.win === "100") note = C3.scaleNote + ".";
    $("#lg3-note", host).innerHTML = note;
  }
  // ----- panels -----
  function panelA(){
    return '<div class="lg-row"><span class="lg-lab">Base <span class="m"><i class="p-b">b</i></span></span>' + rgHTML("ab", ["2", "3", "10", "1/2"].map(function(id){ return { id:id, t:'<span class="m p-b">' + id + "</span>" }; }), S3.ab, "chips lg-bchips", "Base for step A", T.busy) + "</div>" +
      '<div class="lg-row"><button type="button" class="btn primary sm" id="lg3-slide" data-k="lg3slide"' + (S3.ph >= 1 || T.busy ? " disabled" : "") + '>Slide the rungs</button><button type="button" class="btn sm" id="lg3-join" data-k="lg3join"' + (S3.ph !== 1 || T.busy ? " disabled" : "") + '>Join the points</button><button type="button" class="btn ghost sm" id="lg3-reset" data-k="lg3reset"' + (S3.ph === 0 || T.busy ? " disabled" : "") + ">Stand the ladder up again</button></div>" +
      nextBtn("B");
  }
  function panelB(){
    var bi = bB();
    return '<div id="lg3-sl"></div>' + (S3.skip ? '<p class="tiny muted" id="lg3-skip">' + C3.skipNote + "</p>" : "") +
      '<div class="lg-row chips" role="group" aria-label="Exact bases">' + ["1/10", "1/3", "1/2", "2", "3", "10"].map(function(id){ var on = S3.bc && S3.b === id; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-bchip="' + id + '" data-k="lg3bc' + id + '" aria-pressed="' + on + '">' + m("@b{" + id + "}") + "</button>"; }).join("") + "</div>" +
      '<div class="lg-row"><button type="button" class="chip' + (S3.expo ? " on" : "") + '" id="lg3-expo" data-k="lg3expo" aria-pressed="' + !!S3.expo + '">Show ' + m("y = @b{b}^x") + '</button><button type="button" class="chip' + (S3.recip ? " on" : "") + '" id="lg3-recip" data-k="lg3recip" aria-pressed="' + !!S3.recip + '">Show base ' + m("1/@b{b}") + "</button></div>" +
      (S3.recip ? '<p class="tiny muted">' + C3.recipNote + "</p>" : "") +
      '<div class="lg-row"><span class="lg-lab">Window</span>' + rgHTML("win", [{ id:"10", t:"0 to 10" }, { id:"100", t:"0 to 100" }], S3.win, "seg", "Window") + "</div>" + nextBtn("C");
    void bi;
  }
  function panelC(){
    var bi = bB(), jm = jMax(bi), pq = probeXY(), rows = S3.trail.map(function(j){ var y = bi.v > 1 ? j : -j; var xt = xTxt(j, bi); return [m(xt), m(fracTxt(y, 1).replace(MINUS, "-")), m(pw3(bi, rungSrc(y, 1)) + eqx(xt))]; });
    var Mn = M(bi), verb = Math.abs(Mn - 2) < 1e-9 ? "double" : Math.abs(Mn - 3) < 1e-9 ? "triple" : "be multiplied by " + (bi.chip ? String(Math.round(Mn)) : sig(Mn, 3)), ends = "";
    if (S3.j <= -jm) ends = m("x" + eqx(xTxt(S3.j, bi))) + ": " + m("y = " + rungSrc(pq.y, 1)) + ". The curve hugs the " + m("y") + "-axis but never touches it.";
    if (S3.j >= jm) ends = m("x" + eqx(xTxt(S3.j, bi))) + ": " + m("y = " + rungSrc(pq.y, 1)) + ". To " + (bi.v > 1 ? "raise" : "lower") + " " + m("y") + " by just 1, " + m("x") + " must " + verb + ": " + (bi.v > 1 ? "logarithms grow slowly." : "logarithms change slowly.");
    return '<p class="tiny muted">Base ' + m("@b{" + bi.txt + "}") + " (set it in step B).</p>" +
      '<div class="lg-row"><button type="button" class="btn sm" id="lg3-tow" data-k="lg3tow"' + (S3.j <= -jm || T.busy ? " disabled" : "") + '>One rung toward 0</button><button type="button" class="btn sm" id="lg3-away" data-k="lg3away"' + (S3.j >= jm || T.busy ? " disabled" : "") + ">One rung away</button></div>" +
      '<div class="lg-row"><button type="button" class="btn ghost sm" id="lg3-x0" data-k="lg3x0"' + (T.busy ? " disabled" : "") + ">Try " + m("x = 0") + '</button><button type="button" class="btn ghost sm" id="lg3-xm2" data-k="lg3xm2"' + (T.busy ? " disabled" : "") + ">Try " + m("x = -2") + "</button></div>" +
      (ends ? '<p class="lg-end" aria-live="polite">' + ends + "</p>" : "") +
      (rows.length ? '<p class="lg-th">Trail</p><div class="lg-trail">' + MV.tableHTML({ head:[m("x"), m("y"), "Check: " + m(pw3(bi, "y") + " = x")], rows:rows, caption:"Probe trail" }) + "</div>" : "") + nextBtn("D");
  }
  function eqx(t){ return t.charAt(0) === "≈" ? " " + t : " = " + t; }
  function nextBtn(s){ return '<div class="lg-row" style="margin-top:14px"><button type="button" class="btn ghost sm" data-go="' + s + '" data-k="lg3go' + s + '">Next: step ' + s + "</button></div>"; }
  // D. Build it from the definition
  function dState(it){ return S3.d.items[it.id] || (S3.d.items[it.id] = { vals:{}, tries:0, hint:0, solved:false, chip:null, chipTries:0, first:null, bad:{} }); }
  var dMsg = {};
  function panelD(){
    var it = C3.build[S3.d.i], st = dState(it), n = C3.build.length;
    var h = '<div class="pred-top"><span class="tiny muted">Task D' + (S3.d.i + 1) + " of " + n + '</span><span class="dots" aria-hidden="true">' + C3.build.map(function(q, i){ var y = S3.d.items[q.id]; return '<span class="dot' + (y && y.first != null ? " done" : "") + (i === S3.d.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += "<p>Complete the points on " + it.fn + ". Then press Check.</p><div class=\"lg-pts\">" + it.rows.map(function(rw, i){
      var bad = st.bad[i], cls = "numin lg-din" + (st.solved ? " good" : bad === true ? " bad" : bad === false ? " good" : "");
      var box = '<input class="' + cls + '" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-dbox="' + i + '" data-k="lgd' + it.id + i + '" aria-label="' + (rw.ask === "x" ? "x-coordinate of the point with y = " + rw.y.replace("-", MINUS) : "y-coordinate of the point with x = " + rw.x.replace("-", MINUS)) + '" value="' + MV.esc(st.vals[i] || "") + '"' + (st.solved ? " disabled" : "") + ">";
      return '<span class="lg-pt m">(' + (rw.ask === "x" ? box : m(rw.x)) + ", " + (rw.ask === "y" ? box : m(rw.y)) + ")</span>";
    }).join("") + "</div>";
    if (!st.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" id="lg3-dchk" data-k="lg3dchk">Check</button>' + MV.hintBtn("lg3dh" + it.id, st.hint) + "</div>" + MV.hintsHTML(it.hints, st.hint);
    if (!st.solved && dMsg[it.id]) h += MV.fbHTML("bad", dMsg[it.id]);
    if (st.solved) {
      h += MV.fbHTML("good", "<strong>✓ Every point is right.</strong> The points are plotted and joined.");
      h += '<div class="sq"><div class="sq-p">This graph is:</div><div class="sq-c" role="group" aria-label="Choices">' + it.chips.map(function(c, i){ var on = st.chip === i, done = st.chip != null && MV.ok(it.chips[st.chip]);
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-dchip="' + i + '" data-k="lg3dc' + i + '" aria-pressed="' + on + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
      if (st.chip != null) { var ch = it.chips[st.chip], good = MV.ok(ch); h += MV.fbHTML(good ? "good" : "bad", (good ? "" : "<strong>✗ Not quite.</strong> ") + ch.fb + (good && st.first === false ? ' <span class="muted">(not first try)</span>' : "")); }
      h += "</div>";
    }
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" id="lg3-dprev" data-k="lg3dprev"' + (S3.d.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ghost sm" id="lg3-dnext" data-k="lg3dnext"' + (S3.d.i === n - 1 ? " disabled" : "") + ">Next</button></div>";
    return h;
  }
  function dCheck(){
    var it = C3.build[S3.d.i], st = dState(it), vals = [], miss = false;
    it.rows.forEach(function(rw, i){ var v = one(st.vals[i]); if (!isFinite(v)) miss = true; vals.push(v); });
    if (miss) { dMsg[it.id] = "Fill in every box first. Fractions like 1/4 are fine."; paintPanel(); MV.focusFb(panel); return; }
    var msgs = [], allOk = true; st.bad = {};
    it.rows.forEach(function(rw, i){
      var ok = near(vals[i], one(MV.ans(rw)), 1e-9); st.bad[i] = !ok;
      if (!ok) { allOk = false; var w = (rw.wrong || []).filter(function(q){ return near(vals[i], one(q.match), 1e-9); })[0];
        msgs.push(w ? w.fb : "The box for " + (rw.ask === "x" ? m("y = " + rw.y) : m("x = " + rw.x)) + " isn’t right yet. Use the definition: " + it.fn + " means " + m(pw3(binfo(it.base, true), "y") + " = x") + "."); }
    });
    if (allOk) { st.solved = true; dMsg[it.id] = null; animD(it); }
    else { st.tries++; dMsg[it.id] = "<strong>✗ Not quite.</strong> " + msgs.join(" ") + " Fix the boxes outlined in red and check again."; }
    api.save(); paintPanel(); paintRead(); P.render(); MV.focusFb(panel);
  }
  function animD(it){ T.dc[it.id] = 0; MV.tween({ dur:1200, step:function(t){ T.dc[it.id] = t; P.render(); }, done:function(){ T.dc[it.id] = 1; P.render(); } }); }
  function paintPanel(){
    MV.keepFocus(panel, function(){ panel.innerHTML = S3.step === "A" ? panelA() : S3.step === "B" ? panelB() : S3.step === "C" ? panelC() : panelD(); });
    if (S3.step === "B") mountSlider();
  }
  function mountSlider(){
    var host2 = $("#lg3-sl", panel); if (!host2) return;
    var bi = bB(), pos = Math.max(0.1, Math.min(5, Math.round(bi.v * 10) / 10)); if (Math.abs(pos - 1) < 1e-9) pos = 1.1;
    var sl = MV.sliders(host2, [{ id:"lg3b", label:"Base " + m("@b{b}"), param:"b", min:0.1, max:5, step:0.1, value:pos, skip:[1], fmt:function(v){ return fmt1(v); } }], function(id, v){
      var from = S3.b, fc = S3.bc; if (Math.abs(v - 1.1) < 1e-9 && Math.abs(bB().v - 0.9) < 1e-9 || Math.abs(v - 0.9) < 1e-9 && Math.abs(bB().v - 1.1) < 1e-9) S3.skip = true;
      S3.prev = { b:from, c:fc }; S3.b = String(v); S3.bc = false; S3.j = 0; S3.trail = []; api.save(); afterBase();
    });
    if (S3.bc) { var out = document.getElementById("sl-lg3b-out"); if (out) out.innerHTML = '<span class="m">' + S3.b + "</span>"; }
    var inp = document.getElementById("sl-lg3b");
    inp.addEventListener("keydown", function(e){
      if (e.key !== "PageUp" && e.key !== "PageDown") return;
      e.preventDefault(); var v = +inp.value, d = e.key === "PageUp" ? 1 : -1, nv = Math.round((v + d) * 10) / 10; nv = Math.max(0.1, Math.min(5, nv));
      if (Math.abs(nv - 1) < 1e-9) { nv = d > 0 ? 1.1 : 0.9; S3.skip = true; }
      sl.set("lg3b", nv); S3.prev = { b:S3.b, c:S3.bc }; S3.b = String(nv); S3.bc = false; S3.j = 0; S3.trail = []; api.save(); afterBase();
    });
    void sl;
  }
  function afterBase(){
    // repaint everything except the slider itself (so dragging keeps working)
    var skipEl = $("#lg3-skip", panel);
    if (S3.skip && !skipEl) { var p = document.createElement("p"); p.className = "tiny muted"; p.id = "lg3-skip"; p.innerHTML = C3.skipNote; $("#lg3-sl", panel).after(p); }
    MV.$$("[data-bchip]", panel).forEach(function(b){ var on = S3.bc && S3.b === b.dataset.bchip; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    paintRead(); P.render();
  }
  function paintAll(){ paintSteps(); paintPanel(); paintRead(); P.render(); }
  // ----- actions -----
  function slide(){
    var cfg = A3[S3.ab], rs = [], k; for (k = cfg.r[1]; k >= cfg.r[0]; k--) rs.push(k);
    T.busy = true; paintPanel(); banner("", "");
    var per = 2400 - (rs.length - 1) * 150;
    rs.forEach(function(r, i){ MV.wait(i * 150, function(){ MV.tween({ dur:MV.reduceMotion ? 0 : per, step:function(t){ T.u[r] = t; P.render(); }, done:function(){ T.u[r] = 1; if (i === rs.length - 1) { S3.ph = 1; T.busy = false; api.save(); paintPanel(); P.render(); } } }); }); });
  }
  function join(){
    T.busy = true; paintPanel(); T.c = 0; T.asy = false;
    MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ T.c = t; P.render(); }, done:function(){ T.c = 1; T.asy = true; S3.ph = 2; T.busy = false; api.save(); paintPanel(); P.render(); } });
  }
  function moveProbe(dj){
    var bi = bB(), jm = jMax(bi), nj = Math.max(-jm, Math.min(jm, S3.j + dj)); if (nj === S3.j && !T.fail) return;
    T.fail = null; banner("", ""); S3.j = nj; S3.trail.push(nj); if (S3.trail.length > 24) S3.trail.shift(); api.save();
    var from = T.view || probeView(), to = probeView(); T.busy = true; paintPanel();
    MV.tween({ dur:500, step:function(t){ T.view = { xmin:from.xmin + (to.xmin - from.xmin) * t, xmax:from.xmax + (to.xmax - from.xmax) * t, ymin:from.ymin + (to.ymin - from.ymin) * t, ymax:from.ymax + (to.ymax - from.ymax) * t }; P.render(); },
      done:function(){ T.view = to; T.busy = false; paintPanel(); P.render(); } });
  }
  function tryX(x){
    var bi = bB(); T.fail = { x:x }; T.view = probeView(); T.shake = 0;
    banner("bad", m(pw3(bi, "y") + " = " + (x < 0 ? "-2" : "0")) + " has no solution: " + m(pw3(bi, "y")) + " is positive for every " + m("y") + ".");
    if (MV.reduceMotion) { P.render(); return; }
    MV.tween({ dur:500, ease:function(t){ return t; }, step:function(t){ T.shake = Math.sin(t * Math.PI * 6) * 7 * (1 - t); P.render(); }, done:function(){ T.shake = 0; P.render(); } });
  }
  function setStep(s){ if (S3.step === s) return; S3.step = s; T.fail = null; banner("", ""); if (s === "C") T.view = probeView(); api.save(); paintAll(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.rg) { choose(b.dataset.rg, b.dataset.v); return; }
    if (b.dataset.go) { setStep(b.dataset.go); var sb = $('#lg3-steps [data-v="' + b.dataset.go + '"]', host); if (sb) sb.focus({ preventScroll:true }); return; }
    if (T.busy) return;
    if (b.id === "lg3-slide") return slide();
    if (b.id === "lg3-join") return join();
    if (b.id === "lg3-reset") { S3.ph = 0; T.u = {}; T.c = 0; T.asy = false; api.save(); paintPanel(); P.render(); return; }
    if (b.dataset.bchip) { S3.prev = { b:S3.b, c:S3.bc }; S3.b = b.dataset.bchip; S3.bc = true; S3.j = 0; S3.trail = []; api.save(); paintPanel(); paintRead(); P.render(); return; }
    if (b.id === "lg3-expo") { S3.expo = !S3.expo; api.save(); paintPanel(); P.render(); return; }
    if (b.id === "lg3-recip") { S3.recip = !S3.recip; api.save(); paintPanel(); P.render(); return; }
    if (b.id === "lg3-tow") return moveProbe(-1);
    if (b.id === "lg3-away") return moveProbe(1);
    if (b.id === "lg3-x0") return tryX(0);
    if (b.id === "lg3-xm2") return tryX(-2);
    var it = C3.build[S3.d.i], st = dState(it);
    if (b.id === "lg3-dchk") return dCheck();
    if (b.dataset.act === "hint") { st.hint = Math.min(3, st.hint + 1); api.save(); paintPanel(); return; }
    if (b.dataset.dchip != null) {
      var i = +b.dataset.dchip, ok = MV.ok(it.chips[i]); st.chip = i;
      if (!ok) st.chipTries++;
      else if (st.first == null) st.first = st.tries === 0 && st.hint < 3 && st.chipTries === 0;
      api.save(); paintPanel(); MV.focusFb(panel); return;
    }
    if (b.id === "lg3-dprev" || b.id === "lg3-dnext") { S3.d.i += b.id === "lg3-dprev" ? -1 : 1; api.save(); paintPanel(); paintRead(); P.render(); return; }
  });
  host.addEventListener("input", function(e){ var i = e.target.dataset && e.target.dataset.dbox; if (i == null) return; var it = C3.build[S3.d.i], st = dState(it); st.vals[i] = e.target.value; delete st.bad[i]; e.target.classList.remove("bad", "good"); api.save(); });
  host.addEventListener("keydown", function(e){
    var r = rgKey(e, host); if (r) { choose(r.name, r.v); rgFocus(host, r.name, r.v); return; }
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.dbox != null) { e.preventDefault(); dCheck(); }
  });
  function choose(name, v){
    if (name === "p3step") return setStep(v);
    if (T.busy) return;
    if (name === "ab" && v !== S3.ab) { S3.ab = v; S3.ph = 0; T.u = {}; T.c = 0; T.asy = false; api.save(); paintPanel(); paintRead(); P.render(); }
    if (name === "win" && v !== S3.win) { S3.win = v; api.save(); paintPanel(); paintRead(); P.render(); }
  }
  MV.ACTS.dbuild = { a:{ id:"dbuild" },
    stats:function(){ var f = 0, d = 0; C3.build.forEach(function(it){ var y = S3.d.items[it.id]; if (y && y.first != null) d++; if (y && y.first) f++; }); return { first:f, total:C3.build.length, done:d, line:"Build it from the definition (first try): " + f + "/" + C3.build.length + (d < C3.build.length ? " (unfinished)" : "") }; },
    missed:function(){ var bad = C3.build.some(function(it){ var y = S3.d.items[it.id]; return y && (y.tries > 0 || y.hint >= 3 || y.chipTries > 0); }); return bad ? [4] : []; } };
  if (S3.step === "C") T.view = probeView();
  paintAll();
  return {};
}

// ---------- Practice 2: find the missing piece (N4: fraction, integer-pair, decimal and whole-number boxes) ----------
// @component N4 pieceBoxes — a list of number-entry items with per-item box kinds (frac | pair | dec | whole), "Use these
// values" boxes, named wrong entries matched by value, three-level hints, first-try scoring; right answers show hint 3.
function missing(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:["", ""], tries:0, hint:0, solved:false, first:null }); }
  function boxes(it, x){
    var dis = x.solved ? " disabled" : "";
    if (it.box === "pair") return '<div class="numrow lg-pair"><span>Between</span><input class="numin short" type="number" step="1" data-nb="0" data-k="mp' + it.id + '0" aria-label="Smaller integer" value="' + MV.esc(x.vals[0]) + '"' + dis + '><span>and</span><input class="numin short" type="number" step="1" data-nb="1" data-k="mp' + it.id + '1" aria-label="Larger integer" value="' + MV.esc(x.vals[1]) + '"' + dis + "></div>";
    var lab = it.box === "dec" ? "Your answer (a decimal):" : it.box === "whole" ? "Your answer (a whole number):" : "Your answer:";
    return '<div class="numrow"><label for="mp-' + it.id + '">' + lab + '</label><input class="numin short" id="mp-' + it.id + '" type="text" inputmode="' + (it.box === "whole" ? "numeric" : "text") + '" autocomplete="off" spellcheck="false" data-nb="0" data-k="mp' + it.id + '0" value="' + MV.esc(x.vals[0]) + '"' + dis + "></div>";
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it), h = '<div class="q" data-mi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★ Non-routine</span>' : "") + "</div>" + boxes(it, x);
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="mp' + it.id + 'chk">Check</button>' + MV.hintBtn("mp" + it.id + "h", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.hints[2] + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
        else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
        return h + "</div>";
      }).join("");
    });
  }
  function judge(it, x){
    var ans = MV.ans(it);
    if (it.box === "pair") {
      var p0 = one(x.vals[0]), p1 = one(x.vals[1]);
      if (!isFinite(p0) || !isFinite(p1) || p0 % 1 || p1 % 1) return { bad:"Enter two integers, such as −4 and −3." };
      var A0 = one(ans[0]), A1 = one(ans[1]);
      if (p0 === A0 && p1 === A1) return { ok:true };
      if (p0 === A1 && p1 === A0) return { fb:"Those are the right integers. Enter the smaller one first." };
      var w = (it.wrong || []).filter(function(q){ return one(q.match[0]) === p0 && one(q.match[1]) === p1; })[0];
      return { fb:w ? w.fb : null };
    }
    var v = one(x.vals[0]);
    if (!isFinite(v)) return { bad:it.box === "dec" ? "Enter a decimal, such as −1.25." : it.box === "whole" ? "Enter a whole number, such as 12." : "Enter a number, such as 12, −3 or 3/4." };
    var A = one(ans), tol = it.box === "dec" ? (it.tol || 0.001) + 1e-9 : 1e-9;
    if (Math.abs(v - A) <= tol) return { ok:true };
    var w2 = (it.wrong || []).filter(function(q){ return Math.abs(v - one(q.match)) <= (it.box === "dec" ? 0.0015 : 1e-9); })[0];
    return { fb:w2 ? w2.fb : null };
  }
  host.addEventListener("input", function(e){ var nb = e.target.dataset && e.target.dataset.nb; if (nb == null) return; var box = e.target.closest("[data-mi]"), it = a.items.filter(function(q){ return q.id === box.dataset.mi; })[0]; ist(it).vals[+nb] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.nb == null) return; e.preventDefault(); var box = e.target.closest("[data-mi]"), b = box.querySelector('[data-act="check"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-mi]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.mi; })[0], x = ist(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act !== "check") return;
    var r = judge(it, x);
    if (r.bad) { msgs[it.id] = r.bad; paint(); MV.focusFb(host.querySelector('[data-mi="' + it.id + '"]')); return; }
    if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " Try again." : "Check your work and try again."); }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-mi="' + it.id + '"]'));
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: between the rungs ----------
var TB = ["-4", "0", "1/16", "1/10", "1/9", "1/8", "1/4", "1/2", "1", "2", "4", "8", "9", "10", "16"];
function bigPow(n, e){ var r = 1n, b = BigInt(n); for (var i = 0; i < e; i++) r *= b; return r; }
// exact log_b x = m/n with 1 ≤ n ≤ 12 (b, x positive rationals): {m, n} or null
function exactLog(bn, bd, xn, xd){
  var L = Math.log(xn / xd) / Math.log(bn / bd);
  for (var n = 1; n <= 12; n++) {
    var mm = Math.round(n * L); if (Math.abs(n * L - mm) > 1e-6) continue;
    var ok = mm >= 0 ? bigPow(bn, mm) * bigPow(xd, n) === bigPow(xn, n) * bigPow(bd, mm) : bigPow(bd, -mm) * bigPow(xd, n) === bigPow(xn, n) * bigPow(bn, -mm);
    if (ok) return { m:mm, n:n };
  }
  return null;
}
var task = (function(){
  var api, pl, pg;
  function read(){
    var s = api ? api.S : {}, bId = s.b || "", p = String(s.p == null ? "" : s.p).trim(), q = String(s.q == null ? "1" : s.q).trim();
    var okN = function(t){ return /^\d+$/.test(t) && +t >= 1 && +t <= 1000; };
    var d = { bId:bId, raw:[p, q], valid:!!bId && okN(p) && okN(q) };
    if (bId) { var bp = bId.split("/"); d.bn = +bp[0]; d.bd = bp[1] ? +bp[1] : 1; d.bv = d.bn / d.bd; }
    if (d.valid) { var g = gcd(+p, +q); d.xn = +p / g; d.xd = +q / g; d.xv = d.xn / d.xd; }
    return d;
  }
  function info(d){
    var r = { c1:d.bv > 0 && d.bv !== 1, c2:d.xv > 1 };
    if (r.c1) {
      var bn = d.bn, bd = d.bd, xn = d.xn, xd = d.xd;
      r.c3 = d.bv < 1 ? (bd * xd < xn * bn && xn * bn * bn < bd * bd * xd) : (bd * bd * xd < xn * bn * bn && xn * bn < bd * xd);
      r.ex = exactLog(bn, bd, xn, xd); r.c4 = !!(r.ex && r.ex.n >= 2);
      r.L = Math.log(d.xv) / Math.log(d.bv);
      r.vTxt = r.ex ? fracTxt(r.ex.m, r.ex.n) : "≈ " + (r.L < 0 ? MINUS : "") + Math.abs(r.L).toFixed(3);
    }
    return r;
  }
  function xSrc(d){ return d.xd === 1 ? String(d.xn) : d.xn + "/" + d.xd; }
  function bSrcT(d){ return "@b{" + d.bId + "}"; }
  function lgT(d){ return "log_{" + bSrcT(d) + "}"; }
  function pwT(d, e){ return (d.bd > 1 ? "(" + bSrcT(d) + ")" : bSrcT(d)) + "^{" + e + "}"; }
  function patchChecks(){
    var d = read(), lis = MV.$$("#task-checks li"); if (lis.length < 4 || !d.bId) return;
    if (!(d.bv > 0 && d.bv !== 1)) [2, 3].forEach(function(i){ var s = lis[i].querySelector("span:last-child"); if (s && !s.querySelector(".lg-cant")) s.insertAdjacentHTML("beforeend", ' <span class="lg-cant muted">' + MV.C.task.cantCheck + "</span>"); });
  }
  function draw(){
    var d = read(), r = d.valid ? info(d) : null, cap = $("#tk-cap");
    var bad = d.bId && !(d.bv > 0 && d.bv !== 1);
    function msg(p, txt){ p.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, after:function(ctx, pp){ ctx.font = "600 15px " + pp.fontUI; ctx.fillStyle = css("--ink-2"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, pp.W / 2, pp.H / 2); }, describe:txt }); }
    if (!d.bId) { msg(pl, "Choose a base"); msg(pg, "Choose a base"); cap.innerHTML = ""; return; }
    if (bad) { msg(pl, MV.C.task.noLadder); msg(pg, MV.C.task.noLadder); cap.innerHTML = ""; return; }
    var Bt = base(d.bId), L = r ? r.L : null;
    // ladder strip, rungs −3 to 1
    pl.draw({ view:{ xmin:0, xmax:1, ymin:-3.55, ymax:1.55 }, grid:false, axes:false, ticks:false, after:function(ctx, p){
      var rungs = []; for (var k = -3; k <= 1; k++) rungs.push({ y:k, whole:true, l:fracTxt(k, 1), r:ratSrc(powX(Bt, k, 1)) });
      var marks = [];
      if (r) { var y = Math.max(-3.4, Math.min(1.4, L)); marks.push({ y:y, dir:L > 1.4 ? "up" : L < -3.4 ? "down" : "eq", l:r.vTxt, r:"x = " + MV.plain(m(xSrc(d))) }); }
      ctx.save(); drawLadder(ctx, p, { rungs:rungs, band:[-2, -1], marks:marks, railLo:-3.4, railHi:1.4 }); ctx.restore();
    }, describe:"Base-" + d.bId + " ladder from rung −3 to rung 1, with the band between rungs −2 and −1 shaded." + (r ? " Your x sits at height " + r.vTxt + "." : "") });
    // graph
    var xv = r ? d.xv : 1, yv = r ? L : 0, xmax = Math.max(4, xv * 1.25), ymin = Math.min(-3, yv - 1), ymax = Math.max(2, yv + 1);
    pg.draw({ view:{ xmin:-xmax / 12, xmax:xmax, ymin:ymin, ymax:ymax }, curves:[{ pts:par(d.bv, ymin - 1, ymax + 1, 500), color:css("--pen"), width:3, arrows:true }],
      asymptotes:[{ x:1, label:"x = 1", dash:[6, 5] }], points:r ? [{ x:xv, y:yv, r:6, color:css("--ink"), label:"(" + MV.plain(m(xSrc(d))) + ", " + r.vTxt + ")" }] : [],
      after:function(ctx, p){ ctx.save(); ctx.fillStyle = css("--hi-soft"); ctx.fillRect(0, p.Y(-1), p.W, p.Y(-2) - p.Y(-1)); ctx.restore(); if (r) p.point({ x:xv, y:yv, r:6, color:css("--ink") }); },
      describe:"Graph of y = log base " + d.bId + " of x with the band −2 < y < −1 shaded and a dashed line at x = 1." + (r ? " Your point is (" + MV.plain(m(xSrc(d))) + ", " + r.vTxt + ")." : "") });
    cap.innerHTML = r && r.c4 ? capText(d, r) : "";
  }
  function capText(d, r){
    var e = rungSrc(r.ex.m, r.ex.n), s = m(lgT(d) + argS(xSrc(d)) + " = " + e) + ", because " + m(pwT(d, e));
    if (d.bd > 1 && d.bn === 1 && r.ex.m < 0) s += m(" = " + d.bd + "^{" + rungSrc(-r.ex.m, r.ex.n) + "}");
    return s + m(" = " + xSrc(d)) + ".";
  }
  function upd(){ draw(); api.update(); patchChecks(); }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S; if (S.q == null) S.q = "1";
      inp.innerHTML = '<div class="inrow lg-tin"><label><span>Base ' + m("@b{b}") + '</span><select id="tk-b" class="lg-sel"><option value="">Choose…</option>' + TB.map(function(id){ return '<option value="' + id + '"' + (S.b === id ? " selected" : "") + ">" + id.replace("-", MINUS) + "</option>"; }).join("") + "</select></label>" +
        '<span class="lg-xfr"><span>Number ' + m("x") + '</span><span class="lg-frin"><input id="tk-p" class="numin short" type="text" inputmode="numeric" autocomplete="off" aria-label="Numerator of x" value="' + MV.esc(S.p || "") + '"><span class="lg-bar" aria-hidden="true"></span><input id="tk-q" class="numin short" type="text" inputmode="numeric" autocomplete="off" aria-label="Denominator of x" value="' + MV.esc(S.q) + '"></span></span></div>';
      pv.innerHTML = '<div class="lg-tpv"><canvas class="plot square" id="tk-lad" role="img" aria-label="Ladder strip"></canvas><canvas class="plot square" id="tk-gr" role="img" aria-label="Graph"></canvas></div><p class="lg-tcap" id="tk-cap" aria-live="polite"></p>';
      pl = new MV.Plot($("#tk-lad"), { xmin:0, xmax:1, ymin:-3.5, ymax:1.5 }); pg = new MV.Plot($("#tk-gr"), { xmin:-1, xmax:5, ymin:-3, ymax:2 }); pl.render = draw; pg.render = draw;
      inp.addEventListener("change", function(e){ if (e.target.id === "tk-b") { S.b = e.target.value; a.save(); upd(); } });
      inp.addEventListener("input", function(e){ if (e.target.id === "tk-p") S.p = e.target.value; else if (e.target.id === "tk-q") S.q = e.target.value; else return; a.save(); upd(); });
      setTimeout(function(){
        draw(); patchChecks();
        var btn = $("#task-check"); if (btn) btn.addEventListener("click", function(){ setTimeout(function(){
          patchChecks(); var st = MV.taskState(); if (st.found.length >= 7 && $("#task-fb .fb.good") && !$("#task-fb .lg-all7")) $("#task-fb .fb.good").insertAdjacentHTML("beforeend", '<p class="lg-all7">' + MV.C.task.all7 + "</p>"); }, 0); });
      }, 0);
    },
    read:read,
    valid:function(d){ if (!d.bId) return "Choose a base from the menu."; return d.valid ? true : "Enter whole numbers from 1 to 1000."; },
    checks:function(d){ if (!d.valid) return [false, false, false, false]; var r = info(d); return [r.c1, r.c2, !!r.c3, !!r.c4]; },
    tips:function(d, c){
      var T = MV.C.task, r = info(d), out = [];
      if (!c[0]) out.push(T.tips[0]);
      if (!c[1]) out.push(T.tips[1]);
      if (r.c1 && !c[2]) {
        var vt = r.vTxt, s;
        if (d.bv > 1) s = T.tips[2];
        else { var ib = d.bd / d.bn, ib2 = ib * ib; s = T.tip3small.replace("{b}", m(d.bId)).replace("{lo}", m(fracTxt(d.bd, d.bn).replace(MINUS, "-"))).replace("{hi}", m(fracTxt(d.bd * d.bd, d.bn * d.bn).replace(MINUS, "-"))); void ib2; }
        out.push(vt.charAt(0) === "≈" ? s.replace(" = {v}", " " + m(vt.replace(MINUS, "-"))) : s.replace("{v}", m(vt.replace(MINUS, "-"))));
      }
      if (r.c1 && !c[3]) {
        var whole = r.ex && r.ex.n === 1, s4 = T.tips[3].replace("{kind}", whole ? "a whole number" : "not an exact fraction");
        out.push(r.vTxt.charAt(0) === "≈" ? s4.replace(" = {v}", " " + m(r.vTxt.replace(MINUS, "-"))) : s4.replace("{v}", m(r.vTxt.replace(MINUS, "-"))));
      }
      return out;
    },
    key:function(d){ return d.bId + "|" + d.xn + "/" + d.xd; },
    label:function(k){ var p = k.split("|"), x = p[1].replace(/\/1$/, ""); return m("@b{b} = " + p[0] + ", x = " + x); },
    text:function(k){ var p = k.split("|"); return "b = " + p[0] + ", x = " + p[1].replace(/\/1$/, ""); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ missing:missing },
  task:task
});
})();
