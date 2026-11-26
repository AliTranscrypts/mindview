// MHF4U 42 Logarithmic Scales: hero (linear ruler → log ruler), the scale switcher (Explore), same ratio, same rise
// (Part 3), "Forwards, backwards, combined" number entry with mini rulers (Practice 2) and the "Loud but safe" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS, RM = MV.reduceMotion;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function LIN(t){ return t; }
function lg(x){ return Math.log(x) / Math.LN10; }
function near(a, b, eps){ return Math.abs(a - b) < (eps || 1e-9); }
function isWhole(v){ return near(v, Math.round(v), 1e-7); }
function fix1(v){ return (v < -1e-9 ? MINUS : "") + Math.abs(v).toFixed(1); }
var V01 = { xmin:0, xmax:1, ymin:0, ymax:1 };

// ---------- number formats ----------
// 3 significant figures, trailing zeros kept ("2.00", "31.6", "316"); thin-space thousands from 10 000
function sf3(v){ var s = String(Number(Number(v).toPrecision(3))); if (Math.abs(v) < 100) s = Number(v).toPrecision(3); if (/e/.test(s)) s = String(Number(s)); return group(s); }
// at most 3 significant figures, trailing zeros dropped ("0.1", "31.6", "50")
function sf3t(v){ return group(String(Number(Number(v).toPrecision(3)))); }
function group(s){ var neg = s.charAt(0) === "-"; s = s.replace("-", ""); var p = s.split("."); if (p[0].length > 4) p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return (neg ? MINUS : "") + p.join("."); }
function digits(v){ return group(String(Math.round(v))); }
// exponent text: whole numbers plain, otherwise dp decimals (true minus)
function eS(e, dp){ return isWhole(e) ? num(Math.round(e)) : num(e, dp || 1); }
// m() source for m × 10^n with a 3-s.f. mantissa (n = 0 drops the power)
function sciSrc(v){ var n = Math.floor(lg(v) + 1e-12), mt = v / Math.pow(10, n); if (Number(mt.toFixed(2)) >= 10) { mt /= 10; n++; } return mt.toFixed(2) + (n === 0 ? "" : " × 10^{" + n + "}"); }
// a power of 10 as HTML: exact when the exponent is whole, else "10^e ≈ m × 10^n"
function powH(e, dp){ var s = m("10^{" + eS(e, dp) + "}"); return isWhole(e) ? s : s + " ≈ " + m(sciSrc(Math.pow(10, e))); }
// a ratio 10^d (d ≥ 0) as HTML: whole steps ≤ 6 with digits, ≥ 7 as a power, otherwise ≈ value (scientific from 10^4)
function ratioH(d, dp){
  if (d < 1e-9) return "1";
  if (isWhole(d)) { var k = Math.round(d); return k <= 6 ? m("10^{" + k + "}") + " = " + digits(Math.pow(10, k)) : m("10^{" + k + "}"); }
  var v = Math.pow(10, d); return m("10^{" + num(d, dp || 1) + "}") + " ≈ " + (v >= 1e4 ? m(sciSrc(v)) : sf3(v));
}
function ratioWord(d){ var v = Math.pow(10, Math.abs(d)); var t = isWhole(d) && Math.abs(d) <= 6 ? digits(v) : (Math.abs(d) >= 4 ? MV.plain(m(sciSrc(v))) : sf3(v)); return (isWhole(d) ? "" : "about ") + (d < 0 ? "1/" + t : t); }

// ---------- colours (read once per frame) ----------
function pal(){ return { ink:css("--ink"), ink2:css("--ink-2"), pen:css("--pen"), hi:css("--hi"), hiSoft:css("--hi-soft"), sheet:css("--sheet"), axis:css("--plot-axis"), grid:css("--plot-grid"), rule:css("--rule"), fm:css("--font-math") || "serif", fu:css("--font-ui") || "sans-serif" }; }

// @component G11 canvasMath (from MHF4U 37) — canvas text with ^{…} superscripts and _{…} subscripts in the math font
// (single letters italic, words such as "log", "pH" and "dB" upright); keeps the caller's globalAlpha; o.dry measures only
function cmath(ctx, s, x, y, o){
  o = o || {};
  var F = o.size || 14, fm = o.font || "serif", segs = [], i = 0, ga = ctx.globalAlpha;
  function push(t, lv){ t.split(/([A-Za-z]+)/).forEach(function(w, k){ if (w) segs.push({ t:w, lv:lv, it:!o.upright && k % 2 === 1 && w.length === 1 }); }); }
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
  function font(sg){ return (sg.it ? "italic " : "") + (o.weight || 400) + " " + (sg.lv ? Math.round(F * 0.74) : F) + "px " + fm; }
  var w = 0; segs.forEach(function(sg){ ctx.font = font(sg); sg.w = ctx.measureText(sg.t).width + (sg.it ? 1 : 0); w += sg.w; });
  if (o.dry) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left";
  if (o.bg) { ctx.globalAlpha = ga * 0.9; ctx.fillStyle = o.bg; ctx.fillRect(x0 - 3, y - F * 0.72, w + 6, F * 1.44); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || "#000";
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -F * 0.36 : sg.lv === -1 ? F * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
function txt(ctx, s, x, y, o){
  o = o || {}; var ga = ctx.globalAlpha;
  ctx.save(); ctx.font = (o.weight || 400) + " " + (o.size || 12) + "px " + (o.font || "sans-serif"); ctx.textAlign = o.align || "left"; ctx.textBaseline = o.base || "middle";
  if (o.bg) { var w = ctx.measureText(s).width, bx = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x, F = o.size || 12; ctx.globalAlpha = ga * 0.9; ctx.fillStyle = o.bg; ctx.fillRect(bx - 3, y - F * 0.72, w + 6, F * 1.44); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || "#000"; ctx.fillText(s, x, y); ctx.restore();
}
function tw(ctx, s, F, font, weight){ ctx.font = (weight || 400) + " " + F + "px " + font; return ctx.measureText(s).width; }
function seg(ctx, x1, y1, x2, y2, col, w, dash){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1; ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function tri(ctx, x, y, dir, s, col){ ctx.fillStyle = col; ctx.beginPath(); if (dir === "down") { ctx.moveTo(x, y); ctx.lineTo(x - s * 0.7, y - s); ctx.lineTo(x + s * 0.7, y - s); } else if (dir === "up") { ctx.moveTo(x, y); ctx.lineTo(x - s * 0.7, y + s); ctx.lineTo(x + s * 0.7, y + s); } else if (dir === "right") { ctx.moveTo(x, y); ctx.lineTo(x - s, y - s * 0.7); ctx.lineTo(x - s, y + s * 0.7); } else { ctx.moveTo(x, y); ctx.lineTo(x + s, y - s * 0.7); ctx.lineTo(x + s, y + s * 0.7); } ctx.closePath(); ctx.fill(); }

// @component G4 logAxis — a horizontal log-scale ruler drawn on any canvas: one tick per whole step of the exponent (each
// step ×10), minor ticks at 2× … 9×, power-of-10 labels above and scale labels below (colliding labels thinned, so phones
// show every second one), plus the NEW linear ↔ log morph: frac(e) = (1 − s)·10^(e − eW) + s·(e − e0)/(e1 − e0), where e
// is log10 of the quantity, s = 0 is a linear ruler from 0 to W = 10^eW (ticks at fifths of W fade in) and s = 1 the log
// ruler; anything past the right end is hidden. mir (0 … 1) mirrors the ruler about its centre (the pH direction).
// new LogAxis({e0, e1, eW, s, mir, x0, x1, y}); .px(e) → pixel x; .on(e) → still on the ruler; .draw(ctx, o) where
// o = {majors:[e], top(e) → canvasMath source | null, bot(e) → text | null, lin:[{f, t}], size, topGap, botGap, c (pal())}.
// Used by the hero, the switcher and the practice mini rulers; Part 3 uses frac() on a 2-D graph's x-axis.
function LogAxis(o){ this.e0 = o.e0; this.e1 = o.e1; this.eW = o.eW == null ? o.e1 : o.eW; this.s = o.s == null ? 1 : o.s; this.mir = o.mir || 0; this.x0 = o.x0; this.x1 = o.x1; this.y = o.y; }
LogAxis.prototype.frac = function(e){ var u = (e - this.e0) / (this.e1 - this.e0); if (this.s >= 1) return u; return (1 - this.s) * Math.pow(10, e - this.eW) + this.s * u; };
LogAxis.prototype.pxF = function(f){ return this.x0 + (0.5 + (f - 0.5) * Math.cos(Math.PI * this.mir)) * (this.x1 - this.x0); };
LogAxis.prototype.px = function(e){ return this.pxF(this.frac(e)); };
LogAxis.prototype.on = function(e){ return this.frac(e) <= 1 + 1e-6; };
// pixel → exponent on the log ruler (s = 1); returns null when mirrored half-way
LogAxis.prototype.eOf = function(px){ var c = Math.cos(Math.PI * this.mir); if (Math.abs(c) < 0.2) return null; var f = 0.5 + ((px - this.x0) / (this.x1 - this.x0) - 0.5) / c; return this.e0 + f * (this.e1 - this.e0); };
LogAxis.prototype.draw = function(ctx, o){
  var self = this, y = this.y, s = this.s, c = o.c, ga = ctx.globalAlpha, F = o.size || 12, majors = o.majors || [];
  seg(ctx, this.x0, y, this.x1, y, c.axis, 1.5);
  function tick(px, h, a){ ctx.globalAlpha = ga * a; seg(ctx, px, y - h, px, y + h, c.axis, 1); ctx.globalAlpha = ga; }
  if (o.minor !== false && s > 0.02) majors.forEach(function(e){ if (!isWhole(e)) return; for (var k = 2; k <= 9; k++) { var em = e + lg(k); if (em > self.e1 + 1e-9 || !self.on(em)) continue; tick(self.px(em), 3.5, 0.75 * s); } });
  var shown = [];
  majors.forEach(function(e){ if (!self.on(e)) return; tick(self.px(e), 6.5, 0.3 + 0.7 * s); shown.push(e); });
  // log labels: thin by collision (widest of the top and bottom labels), keep the same ticks above and below
  if (s > 0.02 && (o.top || o.bot)) {
    var L = shown.map(function(e){ var t = o.top ? o.top(e) : null, b = o.bot ? o.bot(e) : null; var w = Math.max(t ? cmath(ctx, t, 0, 0, { size:F, font:c.fm, dry:true }) : 0, b ? tw(ctx, b, F, c.fm) : 0); return { e:e, x:self.px(e), w:w, t:t, b:b }; }).sort(function(a, b){ return a.x - b.x; });
    var step = 1;
    for (var i = 1; i < L.length; i++) { var gap = L[i].x - L[i - 1].x, need = (L[i].w + L[i - 1].w) / 2 + 6; if (gap > 0.5 && need > gap) step = Math.max(step, Math.ceil(need / gap)); }
    var anchor = o.keep != null ? L.map(function(l){ return l.e; }).indexOf(o.keep) : 0; if (anchor < 0) anchor = 0;
    ctx.globalAlpha = ga * s;
    L.forEach(function(l, i){
      if ((i - anchor) % step !== 0) return;
      var x = clamp(l.x, l.w / 2 + 2, (o.W || 1e9) - l.w / 2 - 2);
      if (l.t) cmath(ctx, l.t, x, y - (o.topGap || 16), { size:F, font:c.fm, color:c.ink, align:"center" });
      if (l.b) txt(ctx, l.b, x, y + (o.botGap || 16), { size:F, font:c.fm, color:c.ink, align:"center" });
    });
    ctx.globalAlpha = ga;
  }
  if (s < 0.98 && o.lin) {
    o.lin.forEach(function(t){
      var px = t.f === 0 ? self.pxF(0) : self.px(self.eW + lg(t.f)); tick(px, 6.5, 1 - s);
      ctx.globalAlpha = ga * (1 - s); cmath(ctx, t.t, px, y - (o.topGap || 16), { size:F, font:c.fm, color:c.ink, align:t.f === 0 ? "left" : t.f === 1 ? "right" : "center" }); ctx.globalAlpha = ga;
    });
  }
};
// a hop arc above the ruler from xa to xb (progress t 0..1), with optional labels above and below
function hopArc(ctx, xa, xb, yb, t, c, up, below, o){
  o = o || {}; var w = Math.abs(xb - xa), h = clamp(w * 0.38, 9, o.hMax || 26), mx = (xa + xb) / 2;
  ctx.save(); ctx.strokeStyle = o.color || c.ink2; ctx.lineWidth = o.lw || 1.8; ctx.beginPath();
  var N = 20, last = null;
  for (var i = 0; i <= N * t; i++) { var u = i / N, px = (1 - u) * (1 - u) * xa + 2 * u * (1 - u) * mx + u * u * xb, py = (1 - u) * (1 - u) * yb + 2 * u * (1 - u) * (yb - 2 * h) + u * u * yb; if (!i) ctx.moveTo(px, py); else ctx.lineTo(px, py); last = [px, py]; }
  ctx.stroke(); ctx.restore();
  if (t >= 1 && w > 3) { var dir = xb > xa ? 1 : -1; ctx.save(); ctx.fillStyle = o.color || c.ink2; ctx.beginPath(); ctx.moveTo(xb, yb + 1); ctx.lineTo(xb - dir * 6, yb - 6); ctx.lineTo(xb + dir * 1.5, yb - 7.5); ctx.closePath(); ctx.fill(); ctx.restore(); }
  void last;
  if (t >= 1) {
    if (up) cmath(ctx, up, mx, yb - h - 9, { size:o.size || 12, font:c.fm, color:c.ink, align:"center", bg:o.bg ? c.sheet : null, weight:600 });
    if (below && o.yBelow != null) cmath(ctx, below, mx, o.yBelow, { size:(o.size || 12) - 1, font:c.fm, color:c.ink2, align:"center" });
  }
}

// ---------- the three scales (shared by every part) ----------
// Positions k: pH in tenths (pH = k/10), Sound in dB, Earthquakes in tenths. Every scale has 10 positions per step of ×10,
// and e(k) = log10 of the quantity.
function EX(list){ return list.map(function(x){ return { name:x[0], k:x[1], about:x[2] !== false }; }); }
var SC = {
  ph:{ id:"ph", tab:"pH", e0:-14, e1:0, eW:-1, kMin:0, kMax:140, P:70, Q:50,
    e:function(k){ return -k / 10; }, kOf:function(e){ return -e * 10; },
    v:function(k){ return "pH " + fix1(k / 10); }, sv:function(k){ return fix1(k / 10); },
    bot:function(e){ return num(-e); }, qty:function(e){ return "[H⁺] = " + powH(e, isWhole(e * 10) ? 1 : 3) + " mol/L"; },
    lin:[{ f:0, t:"0" }, { f:0.2, t:"0.02" }, { f:0.4, t:"0.04" }, { f:0.6, t:"0.06" }, { f:0.8, t:"0.08" }, { f:1, t:"0.1" }],
    linTop:"[H⁺] in mol/L", titleTop:"Above the ruler: [H⁺], in mol/L.", titleBot:"Below: pH.",
    exs:EX([["Stomach acid", 15], ["Lemon juice", 20], ["Black coffee", 50], ["Milk", 65], ["Pure water", 70, false], ["Sea water", 80], ["Household ammonia", 110], ["Bleach", 120]]) },
  snd:{ id:"snd", tab:"Sound", e0:-13, e1:1, eW:0, kMin:-10, kMax:130, P:60, Q:90,
    e:function(k){ return k / 10 - 12; }, kOf:function(e){ return (e + 12) * 10; },
    v:function(k){ return (isWhole(k) ? num(k) : k.toFixed(1)) + " dB"; }, sv:function(k){ return (isWhole(k) ? num(k) : k.toFixed(1)) + " dB"; },
    bot:function(e){ return num(Math.round(10 * (e + 12))); }, qty:function(e){ return m("I") + " = " + powH(e, isWhole(e * 10) ? 1 : 3) + " W/m²"; },
    lin:[{ f:0, t:"0" }, { f:0.2, t:"0.2" }, { f:0.4, t:"0.4" }, { f:0.6, t:"0.6" }, { f:0.8, t:"0.8" }, { f:1, t:"1" }],
    titleTop:"Above the ruler: intensity <i>I</i>, in W/m².", titleBot:"Below: sound level <i>L</i>, in dB.",
    exs:EX([["Threshold of hearing", 0, false], ["Rustling leaves", 20], ["Quiet library", 40], ["Conversation", 60], ["Busy street", 80], ["Lawn mower", 90], ["Rock concert", 110], ["Threshold of pain", 120]]) },
  eq:{ id:"eq", tab:"Earthquakes", e0:-1, e1:9.5, eW:9, kMin:-10, kMax:95, P:40, Q:60,
    e:function(k){ return k / 10; }, kOf:function(e){ return e * 10; },
    v:function(k){ return "magnitude " + fix1(k / 10); }, sv:function(k){ return fix1(k / 10); },
    bot:function(e){ return num(e, 1); },
    qty:function(e){ var s = m("A") + " = " + (isWhole(e) ? m("10^{" + eS(e) + "} A_0") : m("10^{" + eS(e) + "} A_0") + " ≈ " + m(sciSrc(Math.pow(10, e)) + " A_0")); if (isWhole(e) && e >= -1 && e <= 6) s += " = " + (e < 0 ? "0.1" : digits(Math.pow(10, e))) + " " + m("A_0"); return s; },
    lin:[{ f:0, t:"0" }, { f:0.2, t:"2 × 10^{8}" }, { f:0.4, t:"4 × 10^{8}" }, { f:0.6, t:"6 × 10^{8}" }, { f:0.8, t:"8 × 10^{8}" }, { f:1, t:"10^{9}" }],
    titleTop:"Above the ruler: amplitude <i>A</i>, as a multiple of <i>A</i><sub>0</sub>.", titleBot:"Below: magnitude <i>M</i>.",
    exs:EX([["Usually not felt", 20], ["Felt by some people at rest", 30], ["Rattles windows and dishes", 40], ["Moderate: can crack plaster", 50], ["Strong: damages weak buildings", 60], ["Major", 70], ["Great", 80], ["Among the largest recorded", 90]]) }
};
Object.keys(SC).forEach(function(id){ var sc = SC[id], L = []; for (var e = Math.ceil(sc.e0); e <= sc.e1 + 1e-9; e++) L.push(e); if (!isWhole(sc.e1)) L.push(sc.e1); sc.majors = L; });
function shortName(n){ return n.split(":")[0]; }
function exVal(sc, x){ return sc.id === "ph" ? (x.about ? "about " : "") + "pH " + num(x.k / 10, 1) : sc.id === "snd" ? (x.about ? "about " : "") + num(x.k) + " dB" : "about magnitude " + num(x.k / 10, 1); }
function pctTxt(p){ return p < 0.001 ? "less than 0.001%" : sf3t(p) + "%"; }

// ---------- hero: a linear ruler becomes a log ruler (storyboard in the plan) ----------
function hero(f){
  if (!f.canvas) return;
  var cap = f.cap, capHTML = cap ? cap.innerHTML : "", p = new MV.Plot(f.canvas, V01);
  if (cap) cap.classList.add("ls-hcap");
  var st = { line:0, drop:[], brk:0, s:0, lab:0, hop:0, capOn:false };
  function paint(ctx, pl){
    var c = pal(), W = pl.W, H = pl.H, small = W < 420, yR = Math.round(H * 0.56), x0 = small ? 22 : 30, x1 = W - x0, F = small ? 11 : 13;
    var ax = new LogAxis({ e0:0, e1:9, eW:9, s:st.s, x0:x0, x1:x1, y:yR });
    // ruler line drawing in, with its linear ticks
    var xe = x0 + (x1 - x0) * st.line;
    seg(ctx, x0, yR, xe, yR, c.ink, 2);
    if (st.line >= 1) {
      var lin = [{ f:0, t:"0" }, { f:0.2, t:"2 × 10^{8}" }, { f:0.4, t:"4 × 10^{8}" }, { f:0.6, t:"6 × 10^{8}" }, { f:0.8, t:"8 × 10^{8}" }, { f:1, t:"10^{9}" }];
      ax.draw(ctx, { majors:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], top:null, bot:null, lin:lin, size:F, c:c, topGap:18, W:W });
      var tw1 = tw(ctx, "amplitude, as a multiple of ", F, c.fm), tw2 = cmath(ctx, "A_0", 0, 0, { size:F, font:c.fm, dry:true }), tx = (x0 + x1) / 2 - (tw1 + tw2) / 2;
      txt(ctx, "amplitude, as a multiple of ", tx, yR + (small ? 50 : 58), { size:F, font:c.fm, color:c.ink2 }); cmath(ctx, "A_0", tx + tw1, yR + (small ? 50 : 58), { size:F, font:c.fm, color:c.ink2 });
    }
    // labels on the log ruler
    if (st.lab > 0) {
      ctx.globalAlpha = st.lab;
      for (var e = 0; e <= 9; e++) {
        var t = e === 0 ? "1" : e === 1 ? "10" : e === 2 ? "100" : "10^{" + e + "}";
        if (!(small && e % 2 === 1)) cmath(ctx, t, ax.px(e), yR - 18, { size:F, font:c.fm, color:c.ink, align:"center" });
        txt(ctx, String(e), ax.px(e), yR + 17, { size:F, font:c.fm, color:c.ink, align:"center" });
      }
      txt(ctx, "magnitude", x0, yR + 34, { size:F - 1, font:c.fu, color:c.ink2 });
      ctx.globalAlpha = 1;
    }
    // the pile bracket
    if (st.brk > 0) {
      ctx.globalAlpha = st.brk; var bx0 = ax.px(0) - 4, bx1 = ax.px(7) + 4, by = yR - 34;
      seg(ctx, bx0, by + 6, bx0, by, c.ink, 1.5); seg(ctx, bx0, by, Math.max(bx1, bx0 + 12), by, c.ink, 1.5); seg(ctx, Math.max(bx1, bx0 + 12), by, Math.max(bx1, bx0 + 12), by + 6, c.ink, 1.5);
      txt(ctx, "8 dots in here", bx0, by - 11, { size:F, font:c.fu, color:c.ink, weight:700 }); ctx.globalAlpha = 1;
    }
    // hops from magnitude 2 to 5
    var nh = Math.floor(st.hop + 1e-9);
    for (var j = 0; j < 3; j++) { var tj = clamp(st.hop - j, 0, 1); if (tj <= 0) continue; hopArc(ctx, ax.px(2 + j), ax.px(3 + j), yR - 32, tj, c, "×10", "+1", { yBelow:yR + 34 + (small ? 0 : 0), size:F, hMax:small ? 18 : 24 }); }
    void nh;
    // dots
    for (var d = 0; d <= 9; d++) {
      var t2 = st.drop[d] || 0; if (t2 <= 0) continue;
      var dx = ax.px(d), dy = yR - (1 - t2) * 70;
      ctx.globalAlpha = Math.min(1, t2 * 2); ctx.beginPath(); ctx.arc(dx, dy, small ? 4.5 : 5.5, 0, Math.PI * 2); ctx.fillStyle = c.pen; ctx.fill(); ctx.globalAlpha = 1;
    }
    if (st.hop > 0) { var mx = ax.px(2 + st.hop); ctx.beginPath(); ctx.arc(mx, yR, 10.5, 0, Math.PI * 2); ctx.fillStyle = c.hi; ctx.fill(); ctx.beginPath(); ctx.arc(mx, yR, 7, 0, Math.PI * 2); ctx.fillStyle = c.ink; ctx.fill(); }
  }
  p.render = function(){ p.draw({ view:V01, grid:false, axes:false, ticks:false, after:paint,
    describe:st.lab >= 1 ? "Log ruler of amplitude: the dots for 1, 10, 100 and so on up to 10 to the 9 are evenly spaced above magnitudes 0 to 9. A marker hops from magnitude 2 to magnitude 5, times 10 on each hop: 1000 times the amplitude." : "A linear ruler of amplitude from 0 to 10 to the 9. Eight of the ten dots pile up within the first 1% of the ruler." }); };
  function finish(){ st.line = 1; for (var i = 0; i <= 9; i++) st.drop[i] = 1; st.brk = 0; st.s = 1; st.lab = 1; st.hop = 3; if (cap) cap.innerHTML = capHTML; p.render(); }
  if (cap) cap.innerHTML = "";
  if (RM) { finish(); return; }
  p.render();
  MV.tween({ dur:600, ease:LIN, step:function(t){ st.line = t; p.render(); }, done:function(){
    var k = 0;
    (function drop(){
      if (k > 9) { MV.tween({ dur:300, step:function(t){ st.brk = t; p.render(); }, done:function(){ MV.wait(1100, morph); } }); return; }
      var i = k++; MV.tween({ dur:300, step:function(t){ st.drop[i] = t; p.render(); } }); setTimeout(drop, 100);
    })();
  } });
  function morph(){
    MV.tween({ dur:1600, step:function(t){ st.s = t; st.brk = Math.max(0, 1 - t * 3); p.render(); }, done:function(){
      MV.tween({ dur:500, step:function(t){ st.lab = t; p.render(); }, done:function(){ MV.wait(400, hops); } });
    } });
  }
  function hops(){
    var j = 0;
    (function one(){ if (j >= 3) { if (cap) cap.innerHTML = capHTML; p.render(); return; } var j0 = j++; MV.tween({ dur:500, step:function(t){ st.hop = j0 + t; p.render(); }, done:one }); })();
  }
}

// @component radioGroup (from MHF4U 25 / 37) — segmented control or chip row as a real radio group (arrow keys, roving tabindex)
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="ls-rgw">' + (o.label ? '<span class="ls-rgl">' + o.label + "</span>" : "") + '<span class="ls-rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '">' + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; } };
}
// @component N9 stepSlider (from MHF4U 37 / 32) — slider over a list of positions with 40 px − / + buttons, a formatted output,
// Page Up / Page Down moving o.page positions, aria-valuetext, and lock() while an animation runs
var sliderN = 0;
function stepSlider(slot, o){
  var id = "ls-sl" + (++sliderN), host = document.createElement("div");   // a fresh wrapper, so a rebuilt slider never keeps old listeners
  slot.innerHTML = ""; slot.appendChild(host);
  host.innerHTML = '<div class="ls-sl"><div class="ls-sl-top"><label for="' + id + '">' + o.label + '</label><output for="' + id + '"></output></div>' +
    '<div class="ls-sl-row"><button type="button" class="btn ghost ls-pm" data-pm="-1" data-k="' + id + 'm" aria-label="Decrease ' + MV.esc(o.name) + '">' + MINUS + '</button><input type="range" id="' + id + '" min="0" max="' + (o.n - 1) + '" step="1">' +
    '<button type="button" class="btn ghost ls-pm" data-pm="1" data-k="' + id + 'p" aria-label="Increase ' + MV.esc(o.name) + '">+</button></div></div>';
  var inp = host.querySelector("input"), out = host.querySelector("output"), btns = host.querySelectorAll("[data-pm]"), cur = o.idx, locked = false;
  function paint(){ inp.value = cur; out.innerHTML = o.fmt(cur); inp.setAttribute("aria-valuetext", MV.plain(o.say ? o.say(cur) : o.fmt(cur))); inp.disabled = locked; btns[0].disabled = locked || cur <= 0; btns[1].disabled = locked || cur >= o.n - 1; }
  function go(i, how){ i = clamp(i, 0, o.n - 1); if (i === cur) { paint(); return; } cur = i; paint(); o.onChange(cur, how); }
  inp.addEventListener("input", function(){ cur = +inp.value; paint(); o.onChange(cur, "drag"); });
  inp.addEventListener("change", function(){ if (o.onRelease) o.onRelease(cur); });
  inp.addEventListener("keydown", function(e){
    if (o.page && (e.key === "PageUp" || e.key === "PageDown")) { e.preventDefault(); if (!locked) { go(cur + (e.key === "PageUp" ? o.page : -o.page), "key"); if (o.onRelease) o.onRelease(cur); } }
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pm]"); if (!b || b.disabled) return; go(cur + +b.dataset.pm, "step"); if (o.onRelease) o.onRelease(cur); });
  paint();
  return { set:function(i){ cur = clamp(i, 0, o.n - 1); paint(); }, lock:function(b){ locked = !!b; paint(); }, get:function(){ return cur; }, input:inp };
}

// ---------- Explore: the scale switcher ----------
function explore(host, api){
  var S = api.S;
  if (!SC[S.sc]) S.sc = "eq";
  if (S.mode !== "compare") S.mode = "switch";
  if (S.si == null) S.si = 20;
  if (S.P == null || S.Q == null) { S.P = SC[S.sc].P; S.Q = SC[S.sc].Q; }
  S.posed = S.posed || 0; S.posedRight = S.posedRight || 0;
  var A = { s:S.si / 20, mir:0, fade:1, hop:Infinity, bar:{ p:1, q:1 }, hide:false, hideSel:false, hl:null, exactQ:null, pLab:null, barNorm:null, pose:null, last:"P", busy:false, timers:[], stops:[], read:"" };
  host.innerHTML = '<div class="ls-ex">' +
    '<div class="ls-tabs" id="ls-tabs"></div>' +
    '<div class="ls-main"><div class="ls-graph" data-mv="graph"><div class="eq-cap ls-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap ls-ruler"><canvas class="plot" role="img" aria-label="Scale switcher ruler"></canvas><div class="ls-dots"></div></div>' +
    '<p class="tiny muted ls-axes"></p><p class="tiny ls-phnote" aria-live="polite"></p><div class="ls-exchips" role="group" aria-label="Examples"></div></div>' +
    '<div class="ls-ctrl"><div id="ls-mode"></div><div class="ls-sw"><div id="ls-morph"></div><div class="ls-btns"><button type="button" class="btn ghost ls-big" data-act="lin" data-k="lsLin">Linear</button><button type="button" class="btn ghost ls-big" data-act="log" data-k="lsLog">Log</button></div></div>' +
    '<div class="ls-cmp"><div id="ls-p"></div><div id="ls-q"></div></div>' +
    '<div class="ls-tg"><button type="button" class="btn ghost sm ls-tog" data-act="dir" data-k="lsDir" aria-pressed="false">Usual pH direction</button>' +
    '<button type="button" class="btn ghost sm ls-tog" data-act="all" data-k="lsAll" aria-pressed="false">Show all labels</button>' +
    '<button type="button" class="btn sm ls-pose-b" data-act="pose" data-k="lsPose">Pose it</button>' +
    '<button type="button" class="btn ghost sm" data-act="reset" data-k="lsReset">Reset</button></div></div></div>' +
    '<div class="ls-read"><dl class="read" aria-live="polite"></dl><div class="ls-pose" aria-live="polite"></div></div></div>';
  var root = $(".ls-ex", host), canvas = $("canvas", host), dotsHost = $(".ls-dots", host), readEl = $("dl.read", host), poseEl = $(".ls-pose", host);
  var plot = new MV.Plot(canvas, V01), G = null, sP = null, sQ = null, sM = null, tabs, modes;
  function sc(){ return SC[S.sc]; }
  function kQ(){ return A.exactQ != null ? A.exactQ : S.Q; }
  function mirTarget(){ return S.sc === "ph" && S.dir && (S.mode === "compare" || S.si === 20) ? 1 : 0; }
  function stopAll(){ A.stops.forEach(function(f){ try { f(); } catch (e) {} }); A.stops = []; A.timers.forEach(clearTimeout); A.timers = []; A.hold = false; }
  function later(fn, ms){ var t = setTimeout(fn, RM ? Math.min(ms, 30) : ms); A.timers.push(t); return t; }
  function anim(o){ var stop = MV.tween(o); A.stops.push(stop); return stop; }

  // ----- hops, bars and their animation -----
  function hopList(){
    var s = sc(), eP = s.e(S.P), eQ = s.e(kQ()), eSm = Math.min(eP, eQ), d = Math.abs(eQ - eP), n = Math.floor(d + 1e-7), rem = d - n, out = [];
    for (var j = 0; j < n; j++) out.push({ a:eSm + j, b:eSm + j + 1, whole:true });
    if (rem > 1e-6) out.push({ a:eSm + n, b:eSm + d, whole:false, rem:rem });
    return out;
  }
  function barTargets(){
    var s = sc(), qp = Math.pow(10, s.e(S.P)), qq = Math.pow(10, s.e(kQ())), nrm = A.barNorm ? qp * A.barNorm : Math.max(qp, qq);
    return { p:qp / nrm, q:qq / nrm };
  }
  function settle(){ A.hop = Infinity; A.bar = barTargets(); }
  var hopTimer = null;
  function animHops(cb){
    stopAll(); clearTimeout(hopTimer);
    var hs = hopList(), tgt = barTargets();
    if (RM || S.mode !== "compare") { A.hop = Infinity; A.bar = tgt; update(); if (cb) cb(); return; }
    A.hop = 0; A.hold = true; draw();
    var i = 0;
    (function next(){
      if (i >= hs.length) {
        A.hop = Infinity; var from = { p:A.bar.p, q:A.bar.q };
        anim({ dur:400, step:function(t){ A.bar = { p:lerp(from.p, tgt.p, t), q:lerp(from.q, tgt.q, t) }; draw(); }, done:function(){ A.hold = false; update(); if (cb) cb(); } });
        return;
      }
      A.hop = ++i; draw(); later(next, 150);
    })();
  }
  function soon(){ clearTimeout(hopTimer); stopAll(); A.hop = 0; A.hold = true; draw(); hopTimer = setTimeout(function(){ animHops(); }, RM ? 0 : 160); }

  // ----- drawing -----
  function draw(){ plot.draw({ view:V01, grid:false, axes:false, ticks:false, after:paint, describe:describe() }); }
  plot.render = draw;
  function paint(ctx, pl){
    var c = pal(), s = sc(), W = pl.W, H = pl.H, small = W < 480, cmp = S.mode === "compare";
    var yR = Math.round(H * (cmp ? 0.46 : 0.72)), x0 = small ? 20 : 30, x1 = W - x0, F = small ? 11 : 12;
    var ax = new LogAxis({ e0:s.e0, e1:s.e1, eW:s.eW, s:cmp ? 1 : A.s, mir:A.mir, x0:x0, x1:x1, y:yR });
    G = { ax:ax, yR:yR, W:W, H:H, small:small, cmp:cmp, x0:x0, x1:x1 };
    ctx.globalAlpha = A.fade;
    ax.draw(ctx, { majors:s.majors, top:function(e){ return "10^{" + eS(e) + "}"; }, bot:s.bot, lin:s.lin, size:F, topGap:cmp ? 23 : 17, botGap:cmp ? 23 : 17, c:c, W:W, keep:s.e(S.P) });
    // example dots and their labels
    var dots = s.exs.map(function(x, i){ var e = s.e(x.k); return { i:i, e:e, x:ax.px(e), on:ax.on(e), t:x.name, sel:S.sel === i || A.hl === i }; });
    exampleLabels(ctx, dots, { yR:yR, row0:cmp ? yR - 86 : yR - 40, W:W, small:small, all:!!S.all, c:c, F:F });
    if (cmp) {
      var eP = s.e(S.P), eQ = s.e(kQ()), hideH = A.hide || S.tc3 || A.pose && A.pose.choice == null;
      if (!hideH && A.hop > 0) {
        var hs = hopList(), below = S.sc === "snd" ? "+10 dB" : S.sc === "eq" ? "+1" : "−1 pH";
        hs.forEach(function(h, j){
          if (j >= A.hop) return;
          var up = h.whole ? "×10" : (A.p3 ? (small ? "×2" : "×2 ≈ ×10^{0.301}") : (small ? "" : "×10^{" + num(h.rem, 1) + "} ≈ " + sf3(Math.pow(10, h.rem))));
          hopArc(ctx, ax.px(h.a), ax.px(h.b), yR - 33, 1, c, up, h.whole && !small ? below : null, { yBelow:yR + 40, size:small ? 11 : 12, hMax:small ? 16 : 22, bg:true });
        });
      }
      if (A.pLab) txt(ctx, A.pLab, ax.px(eP), yR + 42, { size:F, font:c.fu, color:c.ink, align:"center", weight:700, bg:c.sheet });
      marker(ctx, ax.px(eP), yR, "P", c);
      marker(ctx, ax.px(eQ), yR, "Q", c);
      if (!hideH) bars(ctx, c, { yB:yR + (small ? 52 : 62), x0:x0, x1:x1, H:H, small:small, F:F });
    }
    ctx.globalAlpha = 1;
    syncDots(dots);
  }
  function marker(ctx, x, y, L, c){
    ctx.save();
    if (L === "P") { ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fillStyle = c.hi; ctx.fill(); ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fillStyle = c.ink; ctx.fill(); }
    else { ctx.fillStyle = c.hi; ctx.fillRect(x - 12.5, y - 12.5, 25, 25); ctx.fillStyle = c.ink; ctx.fillRect(x - 8.5, y - 8.5, 17, 17); }
    ctx.restore();
    cmath(ctx, L, x - 0.5, y + 0.5, { size:13, font:c.fm, color:c.sheet, align:"center", weight:700 });
  }
  function bars(ctx, c, g){
    var bh = g.small ? 15 : 19, gap = g.small ? 9 : 12, bx0 = g.x0 + 20, bx1 = g.x1 - (g.small ? 74 : 96), full = bx1 - bx0;
    txt(ctx, "Bars drawn to a linear scale", g.x0, g.yB, { size:g.F - 1, font:c.fu, color:c.ink2 });
    [["P", A.bar.p], ["Q", A.bar.q]].forEach(function(b, i){
      var y = g.yB + 14 + i * (bh + gap), f = clamp(b[1], 0, 1), hair = f < 0.005, w = hair ? 1 : f * full;
      cmath(ctx, b[0], g.x0 + 4, y + bh / 2, { size:14, font:c.fm, color:c.ink, weight:600 });
      ctx.fillStyle = c.pen; ctx.fillRect(bx0, y, w, bh);
      if (f < 0.999) txt(ctx, pctTxt(f * 100), bx0 + w + 6, y + bh / 2, { size:g.F, font:c.fu, color:c.ink });
    });
  }
  // @component exampleLabels — labelled dots on a ruler: labels on leader lines in rows above, greedy so they don't overlap
  // (hidden when they don't fit unless "show all"), and a crowd of 3+ dots gets a bracket "n examples in here" with its
  // labels stacked in a list above it
  function exampleLabels(ctx, dots, g){
    var c = g.c, F = g.small ? 11 : 12, rowH = F + 4, maxRows = Math.max(1, Math.floor((g.row0 - 6) / rowH) + 1);
    var vis = dots.filter(function(d){ return d.on; });
    vis.forEach(function(d){
      ctx.beginPath(); ctx.arc(d.x, g.yR, d.sel ? 5.5 : 4.5, 0, Math.PI * 2);
      if (d.sel) { ctx.save(); ctx.beginPath(); ctx.arc(d.x, g.yR, 9, 0, Math.PI * 2); ctx.fillStyle = c.hi; ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.arc(d.x, g.yR, 5.5, 0, Math.PI * 2); }
      ctx.fillStyle = d.sel ? c.ink : c.ink2; ctx.fill();
    });
    var rows = []; for (var r = 0; r < maxRows; r++) rows.push([]);
    var sorted = vis.slice().sort(function(a, b){ return a.x - b.x; }), groups = [], cur = [];
    sorted.forEach(function(d){ if (cur.length && d.x - cur[cur.length - 1].x > 9) { groups.push(cur); cur = []; } cur.push(d); });
    if (cur.length) groups.push(cur);
    var draws = [];
    function rowY(r){ return g.row0 - r * rowH; }
    function free(r, a, b){ return rows[r].every(function(iv){ return b < iv[0] || a > iv[1]; }); }
    groups.filter(function(gp){ return gp.length >= 3; }).forEach(function(gp){
      var head = gp.length + " examples in here", names = gp.map(function(d){ return d; });
      var wMax = tw(ctx, head, F, c.fu, 700); names.forEach(function(d){ wMax = Math.max(wMax, tw(ctx, d.t, F, c.fu, d.sel ? 700 : 400)); });
      var gx0 = gp[0].x, gx1 = gp[gp.length - 1].x, lx = clamp(gx0 - 4, 4, g.W - wMax - 6), n = Math.min(maxRows, names.length + 1);
      for (var r2 = 0; r2 < n; r2++) rows[r2].push([lx - 4, lx + wMax + 4]);
      draws.push({ crowd:true, gx0:gx0, gx1:gx1, lx:lx, head:head, names:names, n:n });
      gp.forEach(function(d){ d.done = true; });
    });
    vis.filter(function(d){ return !d.done; }).sort(function(a, b){ return (b.sel - a.sel) || (a.x - b.x); }).forEach(function(d){
      var w = tw(ctx, d.t, F, c.fu, d.sel ? 700 : 400), cx = clamp(d.x, w / 2 + 4, g.W - w / 2 - 4), a = cx - w / 2 - 4, b = cx + w / 2 + 4, row = -1;
      for (var r3 = 0; r3 < maxRows; r3++) if (free(r3, a, b)) { row = r3; break; }
      if (row < 0 && (g.all || d.sel)) { var best = 1e9; for (var r4 = 0; r4 < maxRows; r4++) { var ov = rows[r4].filter(function(iv){ return !(b < iv[0] || a > iv[1]); }).length; if (ov < best) { best = ov; row = r4; } } }
      if (row < 0) return;
      rows[row].push([a, b]); draws.push({ d:d, cx:cx, row:row });
    });
    // leader lines first, then labels on a sheet backing
    draws.forEach(function(o){
      if (o.crowd) {
        var by = g.row0 + rowH * 0.5 + 3, bx0 = o.gx0 - 5, bx1 = Math.max(o.gx1 + 5, bx0 + 10);
        seg(ctx, bx0, by + 5, bx0, by, c.ink, 1.4); seg(ctx, bx0, by, bx1, by, c.ink, 1.4); seg(ctx, bx1, by, bx1, by + 5, c.ink, 1.4);
        seg(ctx, (bx0 + bx1) / 2, by + 5, (bx0 + bx1) / 2, g.yR - 26, c.ink2, 1, [2, 3]);
      } else { ctx.globalAlpha *= 0.7; seg(ctx, o.d.x, g.yR - 7, o.d.x, rowY(o.row) + F * 0.6, o.d.sel ? c.ink : c.ink2, 1); ctx.globalAlpha /= 0.7; }
    });
    draws.forEach(function(o){
      if (o.crowd) {
        txt(ctx, o.head, o.lx, rowY(0), { size:F, font:c.fu, color:c.ink, weight:700, bg:c.sheet });
        o.names.slice(0, o.n - 1).forEach(function(d, i){ var last = i === o.n - 2 && o.names.length > o.n - 1; txt(ctx, last ? d.t + " …" : d.t, o.lx, rowY(i + 1), { size:F, font:c.fu, color:d.sel ? c.ink : c.ink2, weight:d.sel ? 700 : 400, bg:c.sheet }); });
      } else txt(ctx, o.d.t, o.cx, rowY(o.row), { size:F, font:c.fu, color:o.d.sel ? c.ink : c.ink2, weight:o.d.sel ? 700 : 400, align:"center", bg:c.sheet });
    });
  }
  // example dots as buttons (32 px) laid over the canvas
  function syncDots(dots){
    var s = sc(), need = s.exs.length;
    if (dotsHost.children.length !== need || dotsHost.dataset.sc !== S.sc) {
      dotsHost.dataset.sc = S.sc;
      dotsHost.innerHTML = s.exs.map(function(x, i){ return '<button type="button" class="ls-dotb" data-ex="' + i + '" data-k="lsEx' + i + '" aria-label="' + MV.esc(x.name + ", " + exVal(s, x)) + '"></button>'; }).join("");
    }
    var ox = canvas.offsetLeft, oy = canvas.offsetTop;
    dots.forEach(function(d){ var b = dotsHost.children[d.i]; if (!b) return; b.hidden = !d.on || A.fade < 0.5; b.style.left = (ox + d.x) + "px"; b.style.top = (oy + G.yR) + "px"; b.setAttribute("aria-pressed", S.sel === d.i ? "true" : "false"); });
  }
  function describe(){
    var s = sc();
    if (S.mode === "switch") {
      var where = A.s >= 1 ? "logarithmic" : A.s <= 0 ? "linear, from 0 to " + MV.plain(linTop()) : "part way between linear and logarithmic";
      return s.tab + " ruler, " + where + ". " + (A.s >= 1 ? "The 8 examples are spread out, with equal gaps for equal ratios." : crowdCount() + " of the 8 examples are squeezed into the first 1% of the ruler.");
    }
    var eP = s.e(S.P), eQ = s.e(kQ()), d = eQ - eP;
    return s.tab + " ruler, logarithmic. P at " + MV.plain(s.v(S.P)) + ". Q at " + MV.plain(s.v(kQ())) + ". " + (near(d, 0, 1e-6) ? "P and Q are the same." : (d > 0 ? "Q" : "P") + "'s quantity is " + ratioWord(Math.abs(d)) + " times the other's: " + num(Math.abs(d), 1) + " steps of times 10.");
  }
  function linTop(){ var s = sc(); return S.sc === "ph" ? m("10^{-1}") + " mol/L" : S.sc === "snd" ? "1 W/m²" : m("10^9 A_0"); }
  function crowdCount(){ var s = sc(), n = 0, ax = new LogAxis({ e0:s.e0, e1:s.e1, eW:s.eW, s:A.s }); s.exs.forEach(function(x){ if (ax.frac(s.e(x.k)) <= 0.01 + 1e-12) n++; }); return n; }

  // ----- readout -----
  function rows(){
    var s = sc(), R = [];
    if (S.mode === "switch") {
      R.push(["Ruler", A.s >= 0.999 ? (S.sc === "ph" ? (A.mir > 0.5 ? "Log ruler: pH 0 to 14" : "Log ruler: pH 14 down to 0") : S.sc === "snd" ? "Log ruler: −10 to 130 dB" : "Log ruler: magnitude −1.0 to 9.5") : A.s <= 0.001 ? "Linear ruler: 0 to " + linTop() : "Part way: " + m("s") + " = " + num(A.s, 2)]);
      var n = crowdCount();
      R.push(["Crowding", A.s >= 0.999 ? "Equal gaps mean equal ratios: " + (S.sc === "snd" ? "each 10 dB is ×10." : "each step of 1 is ×10.") : n + " of the 8 examples " + (n === 1 ? "is" : "are") + " squeezed into the first 1% of the ruler."]);
      if (S.sel != null && !A.hideSel && s.exs[S.sel]) {
        var x = s.exs[S.sel], e = s.e(x.k);
        R.push(["Selected example", shortName(x.name) + ": " + exVal(s, x) + ", so " + s.qty(e) + ". On the linear ruler it sits " + pctTxt(100 * Math.pow(10, e - s.eW)) + " of the way along."]);
      }
      if (S.sc === "ph") R.push(["Direction", "Lower pH means more hydrogen ions: each step down in pH is 10 times the [H⁺]."]);
      return R;
    }
    var kq = kQ(), eP = s.e(S.P), eQ = s.e(kq), d = eQ - eP, ad = Math.abs(d), same = near(d, 0, 1e-6);
    var hid = S.tc3, pend = A.pose && A.pose.choice == null || A.hide;
    R.push(["Scale", S.sc === "snd" ? "Sound level: " + m("L = 10 log(I/I_0)") + ", with " + m("I_0 = 10^{-12}") + " W/m²" : S.sc === "ph" ? '<span class="m">pH = −log[H⁺]</span>, with [H⁺] in mol/L' : "Magnitude: " + m("M = log(A/A_0)") + ", where " + m("A_0") + " is a standard amplitude"]);
    R.push([m("P"), s.v(S.P) + ", so " + s.qty(eP)]);
    if (!hid) R.push([m("Q"), s.v(kq) + ", so " + s.qty(eQ)]);
    var dv = s.id === "snd" ? kq - S.P : (kq - S.P) / 10;
    R.push(["Difference", m("Q - P") + " = " + (A.p3 ? m("10 log 2") + " ≈ +3.0 dB" : (dv > 1e-9 ? "+" : dv < -1e-9 ? MINUS : "") + (s.id === "snd" ? num(Math.abs(dv)) + " dB" : Math.abs(dv).toFixed(1)))]);
    R.push(["Steps of ×10", (isWhole(ad) ? num(Math.round(ad)) : num(ad, 1)) + (near(ad, 1, 1e-9) ? " step" : " steps") + " (each step is " + (s.id === "snd" ? "10 dB" : s.id === "ph" ? "1 pH unit" : "1 unit of magnitude") + ")"]);
    if (!hid && !pend) {
      var big = d >= 0 ? "Q" : "P", sml = d >= 0 ? "P" : "Q", R1 = A.p3 ? "2" : ratioH(ad);
      if (same) R.push(["Ratio", m("P") + " and " + m("Q") + " are the same: ratio 1 (0 steps)."]);
      else R.push(["Ratio", s.id === "snd" ? m(big) + "’s intensity is " + R1 + " times " + m(sml) + "’s." : s.id === "eq" ? m(big) + " has " + R1 + " times the amplitude of " + m(sml) + "." : m(big) + " has " + R1 + " times the [H⁺] of " + m(sml) + ", so " + m(big) + " is more acidic."]);
      if (!same) {
        var v = Math.pow(10, ad), den = A.p3 ? "2" : isWhole(ad) ? (ad <= 6 ? digits(v) : m("10^{" + Math.round(ad) + "}")) : (v >= 1e4 ? "(" + m(sciSrc(v)) + ")" : sf3(v));
        var what = s.id === "snd" ? "intensity" : s.id === "eq" ? "amplitude" : "[H⁺]";
        R.push(["The other way", m(sml) + "’s " + what + " is " + (isWhole(ad) || A.p3 ? "" : "about ") + "1/" + den + " of " + m(big) + "’s."]);
        var pct = 100 / v;
        R.push(["Linear picture", pct < 0.01 ? "On a linear ruler, " + m(sml) + "’s bar would be less than 0.01% of " + m(big) + "’s: drawn as a hairline." : "On a linear ruler, " + m(sml) + "’s bar would be " + sf3t(pct) + "% of " + m(big) + "’s."]);
      } else R.push(["Linear picture", "On a linear ruler, the two bars would be the same length."]);
    }
    if (S.posed) R.push(["Pose it", "Questions you posed: " + S.posed + ", right first time: " + S.posedRight]);
    return R;
  }
  function paintRead(){ var h = MV.readoutHTML(rows()); if (h !== A.read) { A.read = h; readEl.innerHTML = h; } }

  // ----- controls -----
  tabs = radios($("#ls-tabs", host), { aria:"Scale", cls:"tabs", value:S.sc, options:[{ id:"ph", t:"pH" }, { id:"snd", t:"Sound" }, { id:"eq", t:"Earthquakes" }], onChange:function(v){ setScale(v, true); } });
  modes = radios($("#ls-mode", host), { label:"Mode", value:S.mode, options:[{ id:"switch", t:"Switch" }, { id:"compare", t:"Compare" }], onChange:function(v){ setMode(v); } });
  sM = stepSlider($("#ls-morph", host), { label:"Linear ⟷ Log", name:"the linear to log position", n:21, idx:S.si,
    fmt:function(i){ return i === 0 ? m("s") + " = 0 (linear)" : i === 20 ? m("s") + " = 1 (log)" : m("s") + " = " + num(i / 20, 2); },
    onChange:function(i){ if (A.busy) return; stopAll(); S.si = i; A.s = i / 20; api.save(); flipTo(mirTarget()); update(); } });
  function buildPQ(){
    var s = sc(), n = s.kMax - s.kMin + 1;
    function mk(id, L){ return stepSlider($("#ls-" + id.toLowerCase(), host), { label:"Marker " + m(L), name:"marker " + L, n:n, idx:(id === "Q" ? Math.round(kQ()) : S[id]) - s.kMin, page:10,
      fmt:function(i){ return s.v(i + s.kMin); },
      onChange:function(i){ if (A.busy) return; S[id] = i + s.kMin; if (id === "Q") A.exactQ = null; A.p3 = false; A.pLab = null; A.barNorm = null; A.pose = null; api.save(); soon(); update(true); MV.changed(); },
      onRelease:function(){ if (!A.busy) animHops(); } }); }
    sP = mk("P", "P"); sQ = mk("Q", "Q");
    sP.input.addEventListener("focus", function(){ A.last = "P"; }); sQ.input.addEventListener("focus", function(){ A.last = "Q"; });
  }
  buildPQ();
  var drag = MV.drag(plot, {
    axis:"x",
    handles:function(){ if (S.mode !== "compare" || !G) return []; var s = sc(); return [["P", S.P], ["Q", kQ()]].map(function(h){ return { id:h[0], x:G.ax.px(s.e(h[1])) / G.W, y:1 - G.yR / G.H, label:"Marker " + h[0] + " at " + MV.plain(s.v(h[1])) + ". Arrow keys move it one position, Page Up and Page Down one whole step." }; }); },
    move:function(id, x, y, how){
      if (A.busy || !G) return; var s = sc(), e = G.ax.eOf(x * G.W); if (e == null) return;
      var k = clamp(Math.round(s.kOf(e)), s.kMin, s.kMax); if (id === "Q" && A.exactQ == null && k === S.Q) return; if (id === "P" && k === S.P) return;
      setK(id, k); if (how === "drag") soon();
    },
    key:function(id, e){
      if (A.busy) return true; var s = sc(), dirR = (S.sc === "ph" ? -1 : 1) * (A.mir > 0.5 ? -1 : 1), cur = id === "Q" ? Math.round(kQ()) : S[id], k = null;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") k = cur + dirR; else if (e.key === "ArrowLeft" || e.key === "ArrowDown") k = cur - dirR;
      else if (e.key === "PageUp") k = cur + 10; else if (e.key === "PageDown") k = cur - 10;
      else if (e.key === "Home") k = dirR > 0 ? s.kMin : s.kMax; else if (e.key === "End") k = dirR > 0 ? s.kMax : s.kMin;
      else if (e.key === "Enter" || e.key === " ") return false;
      else return false;
      setK(id, clamp(k, s.kMin, s.kMax)); animHops(); return true;
    },
    end:function(){ if (!A.busy) animHops(); }
  });
  function setK(id, k){ S[id] = k; if (id === "Q") A.exactQ = null; A.p3 = false; A.pLab = null; A.barNorm = null; A.pose = null; api.save(); (id === "P" ? sP : sQ).set(k - sc().kMin); update(true); MV.changed(); }
  plot.c.parentNode.addEventListener("focusin", function(e){ var h = e.target.dataset && e.target.dataset.h; if (h) A.last = h; });
  function flipTo(t, cb){
    if (near(A.mir, t)) { A.mir = t; if (cb) cb(); return; }
    var from = A.mir; anim({ dur:800 * Math.abs(t - from), step:function(u){ A.mir = lerp(from, t, u); update(); }, done:function(){ A.mir = t; update(); if (cb) cb(); } });
  }
  function morphTo(si, cb){
    var from = A.s, to = si / 20;
    S.si = si; api.save();
    if (near(from, to)) { A.s = to; sM.set(si); update(); if (cb) cb(); return; }
    anim({ dur:1600 * Math.abs(to - from), step:function(u){ A.s = lerp(from, to, u); sM.set(Math.round(A.s * 20)); update(); }, done:function(){ A.s = to; sM.set(si); update(); if (cb) cb(); } });
  }
  function setScale(id, fade){
    stopAll(); S.sc = id; S.P = SC[id].P; S.Q = SC[id].Q; S.sel = null; A.exactQ = null; A.p3 = false; A.pLab = null; A.barNorm = null; A.pose = null; A.hl = null;
    A.mir = mirTarget(); api.save(); buildPQ(); settle(); tabs.set(id);
    if (fade && !RM) { A.fade = 0; anim({ dur:500, step:function(t){ A.fade = t; draw(); }, done:function(){ A.fade = 1; update(); } }); }
    update(); MV.changed();
  }
  function setMode(v){ stopAll(); S.mode = v; A.pose = null; api.save(); modes.set(v); A.mir = mirTarget(); settle(); update(); MV.changed(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || A.busy) return;
    if (b.dataset.ex != null) { pickExample(+b.dataset.ex); return; }
    var a = b.dataset.act; if (!a) return;
    if (a === "lin") { stopAll(); if (A.mir > 0) flipTo(0, function(){ morphTo(0); }); else morphTo(0); }
    else if (a === "log") { stopAll(); morphTo(20, function(){ flipTo(mirTarget()); }); }
    else if (a === "dir") { S.dir = !S.dir; api.save(); stopAll(); flipTo(mirTarget()); update(); }
    else if (a === "all") { S.all = !S.all; api.save(); update(); }
    else if (a === "reset") { stopAll(); S.si = 20; A.s = 1; sM.set(20); S.mode = "switch"; modes.set("switch"); S.all = false; S.dir = false; S.tc3 = false; setScale("eq", false); }
    else if (a === "pose") pose();
    else if (a === "pick") answerPose(+b.dataset.i);
  });
  function pickExample(i){
    var s = sc(); S.sel = i; A.hl = null;
    if (S.mode === "compare") { setK(A.last || "P", s.exs[i].k); animHops(); }
    else { api.save(); update(); }
  }

  // ----- Pose it -----
  function poseK(){ if (S.mode !== "compare" || A.exactQ != null) return 0; var d = Math.abs(kQ() - S.P); if (d % 10) return 0; var k = d / 10; return k >= 2 && k <= 6 ? k : 0; }
  function pose(){
    var k = poseK(); if (!k) return;
    var s = sc(), kb = s.e(S.P) > s.e(S.Q) ? S.P : S.Q, ks = kb === S.P ? S.Q : S.P, q;
    if (s.id === "snd") q = "How many times as intense is a " + num(kb) + " dB sound as a " + num(ks) + " dB sound?";
    else if (s.id === "eq") q = "How many times the amplitude of a magnitude " + fix1(ks / 10) + " earthquake is the amplitude of a magnitude " + fix1(kb / 10) + " earthquake?";
    else q = "How many times the [H⁺] of a pH " + fix1(ks / 10) + " solution is the [H⁺] of a pH " + fix1(kb / 10) + " solution?";
    var opts = [{ v:Math.pow(10, k), kind:"right" }, { v:10 * k, kind:"ten" }, { v:k, kind:"k" }, { v:Math.pow(10, k + 1), kind:"one" }];
    for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
    A.pose = { k:k, q:q, opts:opts, choice:null }; update();
    var f = poseEl.querySelector("[data-act=pick]"); if (f) f.focus({ preventScroll:true });
  }
  function answerPose(i){
    var P = A.pose; if (!P || P.choice != null) return;
    P.choice = i; S.posed++; if (P.opts[i].kind === "right") S.posedRight++; api.save(); settle(); A.hop = 0; update(); animHops();
  }
  function paintPose(){
    var P = A.pose;
    if (!P) { poseEl.innerHTML = ""; return; }
    var h = '<div class="ls-posebox"><p class="ls-poseq"><strong>Your question:</strong> ' + P.q + "</p>" + (P.choice == null ? '<p class="tiny muted">Commit to an answer. The hops, the bars and the ratio rows come back when you choose.</p>' : "") +
      '<div class="chips" role="group" aria-label="Answers">' + P.opts.map(function(o, i){ return '<button type="button" class="chip' + (P.choice === i ? " on" : "") + '" data-act="pick" data-i="' + i + '" data-k="lsPk' + i + '" aria-pressed="' + (P.choice === i) + '"' + (P.choice != null ? " disabled" : "") + ">" + digits(o.v) + "</button>"; }).join("") + "</div>";
    if (P.choice != null) {
      var o = P.opts[P.choice], K = P.k, pw = m("10^{" + K + "}");
      var fb = o.kind === "right" ? "<strong>✓ Correct.</strong> " + K + " steps of ×10 make " + pw + "." : o.kind === "ten" ? "<strong>✗ Not quite.</strong> That multiplies 10 by the number of steps. Each step multiplies by 10 again: " + pw + "." : o.kind === "k" ? "<strong>✗ Not quite.</strong> That’s the number of steps, not the ratio." : "<strong>✗ Not quite.</strong> One step too many. Count the hops.";
      h += MV.fbHTML(o.kind === "right" ? "good" : "bad", fb);
    }
    poseEl.innerHTML = h + "</div>";
  }

  // ----- paint everything -----
  function update(force){
    var s = sc(), cmp = S.mode === "compare";
    root.dataset.mode = S.mode; root.dataset.sc = S.sc; root.classList.toggle("ls-busy", A.busy);
    var cap = $(".ls-cap", host), ch = S.sc === "snd" ? m("L = 10 log(I/I_0)") + ", " + m("I_0 = 10^{-12}") + " W/m²" : S.sc === "ph" ? '<span class="m">pH = −log[H⁺]</span>' : m("M = log(A/A_0)");
    if (cap.innerHTML !== ch) cap.innerHTML = ch;
    $(".ls-axes", host).innerHTML = s.titleTop + " " + s.titleBot;
    var showNote = S.sc === "ph" && (cmp || A.s >= 0.999) && A.mir < 0.5;
    $(".ls-phnote", host).textContent = showNote ? "The pH scale is usually drawn the other way round." : "";
    var dirB = $('[data-act="dir"]', host); dirB.hidden = S.sc !== "ph"; dirB.disabled = !cmp && S.si !== 20; dirB.setAttribute("aria-pressed", S.dir ? "true" : "false");
    $('[data-act="all"]', host).setAttribute("aria-pressed", S.all ? "true" : "false");
    var pb = $('[data-act="pose"]', host); pb.hidden = !cmp; pb.disabled = !poseK() || !!(A.pose && A.pose.choice == null);
    var chips = $(".ls-exchips", host), chH = s.exs.map(function(x, i){ return '<button type="button" class="chip' + (S.sel === i ? " on" : "") + '" data-ex="' + i + '" data-k="lsCh' + i + '" aria-pressed="' + (S.sel === i) + '">' + x.name + "</button>"; }).join("");
    if (chips.dataset.h !== chH) { chips.dataset.h = chH; MV.keepFocus(chips, function(){ chips.innerHTML = chH; }); }
    draw();
    if (!A.hold || force === "all") paintRead();
    paintPose();
    void force;
  }

  // ----- TC3 "commit first": an Open button inside the challenge card (the toolkit repaints the card, so re-add it) -----
  function injectTc3(){
    var box = document.querySelector('#chal [data-c="tc3"] .q-actions'); if (!box || box.querySelector("[data-tc3]")) return;
    var st = MV.S.chal.tc3 || {}; if (st.solved || st.tries) { if (S.tc3) { S.tc3 = false; api.save(); update(); } return; }
    var b = document.createElement("button"); b.type = "button"; b.className = "btn ghost sm"; b.dataset.tc3 = "1"; b.dataset.k = "tc3open";
    b.textContent = S.tc3 ? "Close (show everything again)" : "Open this challenge (hide the answer rows)"; b.setAttribute("aria-pressed", S.tc3 ? "true" : "false");
    box.insertBefore(b, box.firstChild);
  }
  var chalHost = $("#chal");
  if (chalHost) {
    new MutationObserver(injectTc3).observe(chalHost, { childList:true });
    chalHost.addEventListener("click", function(e){
      var b = e.target.closest("[data-tc3]"); if (!b) return;
      S.tc3 = !S.tc3;
      if (S.tc3) { if (S.mode !== "compare") { S.mode = "compare"; modes.set("compare"); } if (S.sc !== "ph") setScale("ph", false); A.pose = null; }
      api.save(); settle(); update(); MV.changed();
      b.textContent = S.tc3 ? "Close (show everything again)" : "Open this challenge (hide the answer rows)"; b.setAttribute("aria-pressed", S.tc3 ? "true" : "false");
      if (S.tc3) { var g = $(".ls-graph", host); if (g.scrollIntoView) g.scrollIntoView({ block:"start", behavior:RM ? "auto" : "smooth" }); }
    });
  }

  // ----- challenges (exact tests and named wrong states from the plan) -----
  function chal(id, opt){
    var live = opt && opt.live, s = sc(), q = kQ(), r = { ok:false };
    var need = { tc1:["eq", "Earthquakes"], tc2:["snd", "Sound"], tc3:["ph", "pH"] }[id];
    if (S.mode !== "compare" || S.sc !== need[0]) r.msg = "Switch to Compare mode on the " + need[1] + " scale first.";
    else if (id === "tc1") {
      if (S.P !== 40) r.msg = "Set " + m("P") + " to 4.0 first.";
      else if (q === 70) r = { ok:true };
      else r.msg = ({ 10:"Right size, wrong direction: now " + m("P") + "’s amplitude is 1000 times " + m("Q") + "’s. Bigger amplitudes are further right.", 50:"That’s one step: ×10. You need ×1000.", 60:"Two steps: ×100. One more hop." })[q] ||
        (q >= 80 ? "Too many steps: magnitude 8.0 is already ×10 000." : m("Q") + "’s amplitude is " + ratioWord((q - S.P) / 10) + " times " + m("P") + "’s right now. 1000 is 10 × 10 × 10.");
    } else if (id === "tc2") {
      if (S.P !== 40) r.msg = "Set " + m("P") + " to 40 dB first.";
      else if (q === 43) r = { ok:true };
      else r.msg = ({ 80:"You doubled the decibel number. 80 dB is 4 steps of ×10 above 40 dB: 10 000 times the intensity.", 50:"That’s 10 dB, one whole step: ×10. Doubling is much less than one step.", 42:"Close: " + m("10^{0.2}") + " ≈ 1.58 times. A little more.", 44:"Close: " + m("10^{0.4}") + " ≈ 2.51 times. A little less.", 37:"Right size, wrong direction: " + m("Q") + " is now about half as intense as " + m("P") + "." })[q] ||
        "Right now the ratio is " + ratioWord((q - S.P) / 10) + ". How many decibels make ×2?";
    } else if (id === "tc3") {
      if (live) return { ok:false };
      if (S.P !== 70) r.msg = "Set " + m("P") + " to pure water, pH 7.0.";
      else if (q === 43) r = { ok:true };
      else r.msg = ({ 97:"Right size, wrong direction: more hydrogen ions means a <strong>lower</strong> pH.", 63:"That’s 7 − " + m("log 5") + ": ×5, not ×500. 500 = 5 × 100.", 47:"That’s 7 − " + m("log 200") + " (" + m("log 2 + 2") + "). Use " + m("log 5") + ": 500 = 5 × 100.", 50:"That’s ×100 only (2 steps). You still need the ×5: how much does ×5 change the pH?", 40:"That’s ×1000: 3 whole steps. 500 is half of 1000, so the change is a bit less than 3.", 20:"500 isn’t 5 steps of ×10: that would be 100 000. The change is " + m("log 500") + ", not 5." })[q] ||
        "Work out " + m("log 500") + " before you check.";
    }
    if (id === "tc3" && !live && S.tc3) later(function(){ S.tc3 = false; api.save(); settle(); A.hop = 0; update(); animHops(); }, 30);
    return r;
  }

  // ----- predictions -----
  function startPred(p){
    stopAll(); A.busy = false; S.tc3 = false; A.pose = null; A.exactQ = null; A.p3 = false; A.pLab = null; A.hl = null; A.hideSel = false; A.hide = false; A.barNorm = null;
    var to = { p1:["eq", "switch"], p2:["ph", "compare"], p3:["snd", "compare"], p4:["snd", "compare"] }[p.id];
    S.mode = to[1]; modes.set(to[1]); S.sc = to[0]; tabs.set(to[0]); S.si = 20; A.s = 1; sM.set(20); S.sel = null;
    if (p.id === "p1") { S.P = 40; S.Q = 60; S.sel = 4; A.hideSel = true; }
    else if (p.id === "p2") { S.P = 20; S.Q = 50; A.hide = true; }
    else if (p.id === "p3") { S.P = 80; S.Q = 80; A.pLab = "one machine"; A.barNorm = 2; }
    else { S.P = 0; S.Q = 0; }
    A.mir = mirTarget(); A.fade = 1; api.save(); buildPQ(); settle(); A.read = ""; update();
  }
  function runPred(p, done){
    A.busy = true; update();
    var fin = function(){ A.busy = false; A.hold = false; api.save(); update(); MV.changed(); done(); };
    if (p.id === "p1") morphTo(0, function(){ A.hideSel = false; update(); later(fin, 300); });
    else if (p.id === "p2") { A.hide = false; A.bar = { p:0, q:0 }; animHops(function(){ later(fin, 200); }); }
    else if (p.id === "p3") {
      var tgt = 80 + 10 * lg(2); A.hop = 0; A.hold = true;
      anim({ dur:600, step:function(t){ A.exactQ = lerp(80, tgt, t); sQ.set(Math.round(A.exactQ) - sc().kMin); A.bar = barTargets(); draw(); }, done:function(){
        A.exactQ = tgt; A.p3 = true; A.barNorm = null; S.Q = 83; A.bar = barTargets(); A.hop = Infinity; A.hold = false; update(); later(fin, 400);
      } });
    } else {
      A.hop = 0; A.hold = true;
      anim({ dur:800, step:function(t){ A.exactQ = lerp(0, -10, t); sQ.set(Math.round(A.exactQ) - sc().kMin); A.bar = barTargets(); draw(); }, done:function(){
        A.exactQ = null; S.Q = -10; sQ.set(-10 - sc().kMin); A.bar = barTargets(); A.hold = false; animHops(function(){ later(fin, 200); });
      } });
    }
  }

  // initial paint
  A.mir = mirTarget(); settle(); update();
  window.addEventListener("resize", function(){ if (drag && drag.sync) drag.sync(); });
  return { predict:{ start:startPred, run:runPred }, challenge:chal };
}

// ---------- Part 3: same ratio, same rise ----------
var RAT1 = [2, 3, 5, 10], RAT2 = [2, 10, 100, 1000];
var CH = {
  x:{ id:"x", t:"`y = log x`", l0:-1, l1:3, y0:-1, y1:3, y:function(l){ return l; }, xs:"x", ys:"y", defU:1, k:1 },
  eq:{ id:"eq", t:"Earthquakes: `M = log(A/A_0)`", l0:0, l1:9, y0:0, y1:9, y:function(l){ return l; }, xs:"A/A_0", ys:"M", defU:3, k:1 },
  snd:{ id:"snd", t:"Sound: `L = 10 log(I/I_0)`", l0:-12, l1:0, y0:0, y1:120, y:function(l){ return 10 * (l + 12); }, xs:"I", ys:"L", defU:-6, k:10 },
  ph:{ id:"ph", t:"Acidity: pH = −log[H⁺]", l0:-14, l1:0, y0:0, y1:14, y:function(l){ return -l; }, xs:"[H⁺]", ys:"pH", defU:-7, k:-1 }
};
function part3(host, api){
  var S = api.S;
  if (RAT1.indexOf(S.r) < 0) S.r = 3; if (!(S.u >= 1 && S.u <= 100)) S.u = 20; if (S.ax !== "log") S.ax = "lin";
  S.trail = S.trail || {}; S.pz = S.pz || {};
  if (!CH[S.ch]) S.ch = "x"; if (RAT2.indexOf(S.r2) < 0) S.r2 = 2; if (S.ul == null) S.ul = CH[S.ch].defU;
  var C3 = MV.C.part3, A = { t:S.ax === "log" ? 1 : 0, busy:false, stop:null, msg:{} }, B = { t:1, from:null, stop:null };
  host.innerHTML = '<div class="ls-p3">' +
    '<h3 class="ls-st">Stage 1: Slide the pair</h3>' +
    '<div class="ls-p3g"><div class="ls-p3gr"><div class="plot-wrap"><canvas class="plot" id="ls-g1" role="img" aria-label="Graph of y = log x"></canvas></div><div id="ls-ax"></div></div>' +
    '<div class="ls-p3c"><div id="ls-r"></div><div id="ls-u"></div><div class="ls-btns"><button type="button" class="btn ls-big" data-act="slide" data-k="lsSlide">Slide the pair</button></div>' +
    '<dl class="read" id="ls-rd1" aria-live="polite"></dl><div id="ls-trail"></div></div></div>' +
    '<div class="part"><h3>Pair puzzles</h3><p class="muted">Set the ratio and the position of <i>U</i>, then press <strong>Check</strong>. Each puzzle has three levels of help.</p><div id="ls-pz"></div><p class="tiny" id="ls-tally" aria-live="polite"></p></div>' +
    '<div class="part"><h3 class="ls-st">Stage 2: Three scales, three slopes</h3><p class="muted">The <i>x</i>-axis is logarithmic in this stage, so every graph is a straight line.</p>' +
    '<div class="ls-p3g"><div class="ls-p3gr"><div id="ls-ch"></div><div class="plot-wrap"><canvas class="plot" id="ls-g2" role="img" aria-label="Log-scale graph"></canvas></div></div>' +
    '<div class="ls-p3c"><div id="ls-r2"></div><div id="ls-ul"></div><dl class="read" id="ls-rd2" aria-live="polite"></dl></div></div></div></div>';
  var p1 = new MV.Plot($("#ls-g1", host), { xmin:-0.1, xmax:1.04, ymin:-1.45, ymax:3.75 });
  var p2 = new MV.Plot($("#ls-g2", host), { xmin:-0.15, xmax:1.04, ymin:-0.14, ymax:1.08 });
  function U(x){ return (1 - A.t) * x / 1000 + A.t * (lg(x) + 1) / 4; }
  function trailMark(a, b){ var r = S.r, T = S.trail[r] || (S.trail[r] = {}); [1, 10, 100].forEach(function(v){ if (Math.min(a, b) <= v && v <= Math.max(a, b)) T[v] = true; }); }
  // ----- stage 1 drawing -----
  function paint1(ctx, pl){
    var c = pal(), W = pl.W, small = W < 480, F = small ? 11 : 12, t = A.t, r = S.r, u = S.u;
    function X(x){ return pl.X(U(x)); } function Y(y){ return pl.Y(y); }
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, pl.W, pl.H); ctx.clip();
    // grid
    ctx.lineWidth = 1; ctx.strokeStyle = c.grid;
    for (var gy = -1; gy <= 3.5 + 1e-9; gy += 0.5) seg(ctx, pl.X(0), Y(gy), pl.X(1), Y(gy), c.grid, 1);
    if (t < 1) { ctx.globalAlpha = 1 - t; for (var gx = 100; gx <= 1000; gx += 100) seg(ctx, X(gx), Y(-1), X(gx), Y(3.5), c.grid, 1); ctx.globalAlpha = 1; }
    if (t > 0) { ctx.globalAlpha = t; for (var d = -1; d <= 3; d++) for (var k = 1; k <= 9; k++) { var xv = k * Math.pow(10, d); if (xv > 1000) break; seg(ctx, X(xv), Y(-1), X(xv), Y(3.5), k === 1 ? c.rule : c.grid, 1); } ctx.globalAlpha = 1; }
    // axes
    seg(ctx, pl.X(0), Y(-1.2), pl.X(0), Y(3.6), c.axis, 1.5); seg(ctx, pl.X(0), Y(0), pl.X(1.02), Y(0), c.axis, 1.5);
    for (var ly = -1; ly <= 3; ly++) txt(ctx, num(ly), pl.X(0) - 6, Y(ly), { size:F, font:c.fu, color:c.ink2, align:"right" });
    var yl = Y(-1.2) + 3;
    if (t < 1) { ctx.globalAlpha = 1 - t; [0, 200, 400, 600, 800, 1000].forEach(function(v){ txt(ctx, num(v), v === 0 ? pl.X(0) : X(v), yl, { size:F, font:c.fu, color:c.ink2, align:v === 1000 ? "right" : "center", base:"top" }); }); ctx.globalAlpha = 1; }
    if (t > 0) { ctx.globalAlpha = t; [0.1, 1, 10, 100, 1000].forEach(function(v){ txt(ctx, v === 0.1 ? "0.1" : num(v), X(v), yl, { size:F, font:c.fu, color:c.ink2, align:v === 1000 ? "right" : v === 0.1 ? "left" : "center", base:"top" }); }); ctx.globalAlpha = 1; }
    cmath(ctx, "x", pl.X(1.02) - 4, Y(0) - 10, { size:13, font:c.fm, color:c.ink2, align:"right" });
    cmath(ctx, "y", pl.X(0) + 10, Y(3.55), { size:13, font:c.fm, color:c.ink2 });
    // asymptote x = 0 (linear axis only)
    if (t < 1) { ctx.globalAlpha = 1 - t; seg(ctx, pl.X(0), Y(-1.3), pl.X(0), Y(3.7), c.ink2, 1.5, [8, 6]); cmath(ctx, "x = 0", pl.X(0) + 6, Y(-0.75), { size:12, font:c.fm, color:c.ink2 }); ctx.globalAlpha = 1; }
    // the curve, sampled geometrically
    var pts = []; for (var i = 0; i <= 500; i++) { var xv2 = 0.1 * Math.pow(10, 4 * i / 500); pts.push([U(xv2), lg(xv2)]); }
    pl.curve({ pts:pts, color:c.pen, width:3 });
    // ghost brackets left behind at u = 1, 10, 100
    var T = S.trail[r] || {};
    [1, 10, 100].forEach(function(g){ if (!T[g] || g === u) return; ctx.globalAlpha = 0.35; seg(ctx, X(g), Y(lg(g)), X(g * r), Y(lg(g)), c.ink2, 1.5); seg(ctx, X(g * r), Y(lg(g)), X(g * r), Y(lg(g * r)), c.hi, 3); ctx.globalAlpha = 1; });
    // the pair, run and rise
    var xu = X(u), xv = X(u * r), yu = Y(lg(u)), yv = Y(lg(u * r));
    seg(ctx, xu, yu, xv, yu, c.ink2, 2);
    seg(ctx, xv, yu, xv, yv, c.hi, 3.2); seg(ctx, xv - 5, yu, xv + 5, yu, c.hi, 2); seg(ctx, xv - 5, yv, xv + 5, yv, c.hi, 2);
    var rl = r === 10 ? "rise = 1" : "rise ≈ " + num(lg(r), 3), right = xv < pl.W - 110;
    txt(ctx, rl, right ? xv + 9 : xv - 9, (yu + yv) / 2, { size:F + 1, font:c.fm, color:c.ink, weight:700, align:right ? "left" : "right", bg:c.sheet });
    pl.point({ x:U(u), y:lg(u), r:6.5, ring:true, color:c.ink }); pl.point({ x:U(u * r), y:lg(u * r), r:6.5, ring:true, color:c.ink });
    cmath(ctx, "U", xu + 5, yu + 17, { size:14, font:c.fm, color:c.ink, weight:700, bg:c.sheet });
    cmath(ctx, "V", xv, yv - 18, { size:14, font:c.fm, color:c.ink, weight:700, align:"center", bg:c.sheet });
    ctx.restore();
  }
  p1.render = function(){ p1.draw({ view:{ xmin:-0.1, xmax:1.04, ymin:-1.45, ymax:3.75 }, grid:false, axes:false, ticks:false, after:paint1,
    describe:"Graph of y = log x on a " + (A.t >= 1 ? "logarithmic" : A.t <= 0 ? "linear" : "changing") + " x-axis. U is at (" + S.u + ", log " + S.u + ") and V at (" + S.u * S.r + ", log " + S.u * S.r + "): the run is " + (S.u * S.r - S.u) + " and the rise is log " + S.r + ", about " + num(lg(S.r), 3) + "." }); };
  function lgT(x){ return isWhole(lg(x)) ? "= (" + num(x) + ", " + num(Math.round(lg(x))) + ")" : "≈ (" + num(x) + ", " + num(lg(x), 3) + ")"; }
  function read1(){
    var u = S.u, r = S.r, v = u * r;
    $("#ls-rd1", host).innerHTML = MV.readoutHTML([
      [m("U"), "(" + num(u) + ", " + m("log " + u) + ") " + lgT(u)],
      [m("V"), "(" + num(v) + ", " + m("log " + v) + ") " + lgT(v)],
      ["Ratio", m("V") + "’s " + m("x") + " is " + r + " times " + m("U") + "’s: " + num(v) + " ÷ " + num(u) + " = " + r],
      ["Run", num(v) + " − " + num(u) + " = " + num(v - u)],
      ["Rise", m("log " + v + " - log " + u) + (r === 10 ? " = 1 exactly, which is " + m("log 10") : " ≈ " + num(lg(r), 3) + ", which is " + m("log " + r))]
    ]);
    var T = S.trail[r] || {}, rows = [1, 10, 100].map(function(g){ return T[g] ? [num(g), num(g * r), num(g * r - g), r === 10 ? "1" : "≈ " + num(lg(r), 3)] : ["", "", "", ""]; });
    $("#ls-trail", host).innerHTML = '<p class="tiny" style="margin:12px 0 4px;font-weight:700">Trail (for ×' + r + ")</p>" + MV.tableHTML({ head:[m("U") + "’s " + m("x"), m("V") + "’s " + m("x"), "Run", "Rise"], rows:rows, caption:"Trail table" }) +
      (T[1] && T[10] && T[100] ? '<p class="ls-trailnote">' + C3.trailNote + "</p>" : '<p class="tiny muted">The table fills in as ' + m("U") + " passes " + m("x") + " = 1, 10 and 100.</p>");
  }
  function upd1(){ p1.render(); read1(); paintPz(); }
  var rg = radios($("#ls-r", host), { label:"Ratio " + m("r"), cls:"chips", value:S.r, options:RAT1.map(function(r){ return { id:r, t:"×" + r }; }), onChange:function(v){ S.r = +v; api.save(); upd1(); } });
  var su = stepSlider($("#ls-u", host), { label:"Position of " + m("U") + ": " + m("u"), name:"u", n:100, idx:S.u - 1, page:10, fmt:function(i){ return m("u") + " = " + (i + 1); },
    onChange:function(i){ if (A.busy) return; var old = S.u; S.u = i + 1; trailMark(old, S.u); api.save(); upd1(); } });
  radios($("#ls-ax", host), { label:m("x") + "-axis", value:S.ax, options:[{ id:"lin", t:"Linear" }, { id:"log", t:"Log" }], onChange:function(v){ S.ax = v; api.save(); if (A.stop) A.stop(); var from = A.t, to = v === "log" ? 1 : 0; A.stop = MV.tween({ dur:1200 * Math.abs(to - from), step:function(t){ A.t = lerp(from, to, t); p1.render(); }, done:function(){ A.t = to; upd1(); drag1.sync(); } }); } });
  var drag1 = MV.drag(p1, {
    axis:"x",
    handles:function(){ return [{ id:"U", x:U(S.u), y:lg(S.u), label:"Point U at x = " + S.u + ". Arrow keys move it along the curve." }]; },
    move:function(id, x, y, how){ if (A.busy) return; var best = S.u, bd = 1e9; for (var u = 1; u <= 100; u++) { var dd = Math.abs(U(u) - x); if (dd < bd) { bd = dd; best = u; } } if (best !== S.u) { var old = S.u; S.u = best; trailMark(old, best); su.set(best - 1); api.save(); upd1(); } void how; },
    key:function(id, e){
      if (A.busy) return true; var u = S.u, k = e.key;
      if (k === "ArrowRight" || k === "ArrowUp") u++; else if (k === "ArrowLeft" || k === "ArrowDown") u--; else if (k === "PageUp") u += 10; else if (k === "PageDown") u -= 10; else if (k === "Home") u = 1; else if (k === "End") u = 100; else return false;
      u = clamp(u, 1, 100); var old = S.u; S.u = u; trailMark(old, u); su.set(u - 1); api.save(); upd1(); return true;
    }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.act === "slide") {
      if (A.stop) A.stop(); S.u = 1; trailMark(1, 1); su.set(0);
      if (RM) { trailMark(1, 100); S.u = 100; su.set(99); api.save(); upd1(); return; }
      A.busy = true; su.lock(true); var last = 1;
      A.stop = MV.tween({ dur:4000, ease:LIN, step:function(t){ var u = Math.round(1 + 99 * t); if (u !== last) { trailMark(last, u); last = u; S.u = u; su.set(u - 1); p1.render(); read1(); } }, done:function(){ A.busy = false; su.lock(false); S.u = 100; trailMark(last, 100); api.save(); upd1(); drag1.sync(); } });
    }
    else if (b.dataset.pz) checkPz(b.dataset.pz, b.dataset.act);
  });
  // ----- pair puzzles -----
  function pst(id){ return S.pz[id] || (S.pz[id] = { tries:0, hint:0, solved:false, first:null }); }
  var LG = { 2:"0.301", 3:"0.477", 5:"0.699" };
  function judgePz(id){
    var r = S.r, u = S.u;
    if (id === "r1") return r === 10 ? { ok:true } : { msg:"Your rise is " + m("log " + r) + " ≈ " + LG[r] + ". A rise of exactly 1 means " + m("V") + " is 10 times as far along as " + m("U") + "." };
    if (id === "r2") {
      if (r === 3 && u === 30) return { ok:true };
      if (r === 3) return { msg:"The rise is right: " + m("log 3 ≈ 0.477") + ". The run is (3 − 1) × " + u + " = " + 2 * u + ". You need " + m("2u = 60") + "." };
      if (r === 2 && u === 60) return { msg:"The run is 60, but the rise is " + m("log 2 ≈ 0.301") + ". The rise depends only on the ratio." };
      if (r === 5 && u === 15) return { msg:"The run is 60, but the rise is " + m("log 5 ≈ 0.699") + "." };
      return { msg:"Choose the ratio for the rise first, then the position for the run." };
    }
    if (r === 5 && u === 4) return { ok:true };
    if (u === 4) return { msg:"Your rise is " + m("log " + r) + ". The given pair has the ratio 250 ÷ 50 = 5, so its rise is " + m("log 5") + "." };
    if (r === 5) return { msg:"Right ratio. Now move " + m("U") + " to " + m("x = 4") + "." };
    return { msg:"The rise depends only on the ratio. What’s the ratio of the given pair?" };
  }
  function checkPz(id, act){
    var st = pst(id), pz = C3.puzzles.filter(function(q){ return q.id === id; })[0];
    if (act === "hint") st.hint = Math.min(3, st.hint + 1);
    else { var r = judgePz(id); if (r.ok) { st.solved = true; st.first = st.tries === 0 && st.hint < 3; A.msg[id] = null; } else { st.tries++; A.msg[id] = r.msg; } }
    api.save(); paintPz(); if (act !== "hint") MV.focusFb($('[data-pzc="' + id + '"]', host)); void pz;
  }
  function paintPz(){
    var host2 = $("#ls-pz", host);
    MV.keepFocus(host2, function(){
      host2.innerHTML = C3.puzzles.map(function(q, i){
        var st = pst(q.id), h = '<div class="chal" data-pzc="' + q.id + '"><div class="q-head"><span class="qn" aria-hidden="true">R' + (i + 1) + '</span><div class="q-prompt">' + q.prompt + "</div></div>";
        if (st.solved) h += MV.fbHTML("good", "<strong>✓ Puzzle solved.</strong>" + (st.first ? "" : ' <span class="muted">(not first try)</span>'));
        else {
          h += '<div class="q-actions"><button type="button" class="btn primary sm" data-pz="' + q.id + '" data-act="check" data-k="pz' + q.id + 'c">Check</button><button type="button" class="btn ghost sm" data-pz="' + q.id + '" data-act="hint" data-k="pz' + q.id + 'h"' + (st.hint >= 3 ? " disabled" : "") + ">" + MV.HINT_LABELS[st.hint] + "</button></div>" + MV.hintsHTML(q.hints, st.hint);
          if (A.msg[q.id]) h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + A.msg[q.id]);
        }
        return h + "</div>";
      }).join("");
    });
    var k = pzStats();
    $("#ls-tally", host).textContent = k.done ? "Solved " + k.done + " of 3 · " + k.first + " of 3 on the first try" : "";
  }
  function pzStats(){ var f = 0, d = 0; C3.puzzles.forEach(function(q){ var st = S.pz[q.id]; if (st && st.solved) d++; if (st && st.first) f++; }); return { first:f, done:d }; }
  MV.ACTS.pairs = { a:{ id:"pairs" },
    stats:function(){ var k = pzStats(); return { first:k.first, total:3, done:k.done, line:"Pair puzzles (first try): " + k.first + "/3" + (k.done < 3 ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; C3.puzzles.forEach(function(q){ var st = S.pz[q.id]; if (st && (st.tries > 0 || st.hint >= 3)) g = g.concat(MV.goalIdx(q.goal)); }); return g; } };

  // ----- stage 2: three scales, three slopes -----
  function upos(ch, r){ var L = [], c = CH[ch]; for (var l = c.l0; l + lg(r) <= c.l1 + 1e-9; l += 0.5) L.push(l); return L; }
  function scr(ch, l){ var c = CH[ch]; return [(l - c.l0) / (c.l1 - c.l0), (c.y(l) - c.y0) / (c.y1 - c.y0)]; }
  function geo(ch, r, ul){ return { a:scr(ch, CH[ch].l0), b:scr(ch, CH[ch].l1), u:scr(ch, ul), v:scr(ch, ul + lg(r)) }; }
  function paint2(ctx, pl){
    var c = pal(), W = pl.W, small = W < 480, F = small ? 11 : 12, t = B.t, cur = geo(S.ch, S.r2, S.ul), g = B.from ? B.from : cur;
    function L(a, b){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
    var gA = L(g.a, cur.a), gB = L(g.b, cur.b), gU = L(g.u, cur.u), gV = L(g.v, cur.v);
    function X(x){ return pl.X(x); } function Y(y){ return pl.Y(y); }
    seg(ctx, X(0), Y(0), X(1.02), Y(0), c.axis, 1.5); seg(ctx, X(0), Y(0), X(0), Y(1.05), c.axis, 1.5);
    function axisLabels(ch, al){
      if (al <= 0.01) return; var cc = CH[ch], n = cc.l1 - cc.l0, every = Math.ceil(n / (small ? 6 : 10)), ys = cc.id === "snd" ? 20 : cc.id === "ph" ? 2 : 1;
      ctx.globalAlpha = al;
      for (var l = cc.l0; l <= cc.l1; l++) {
        var fx = (l - cc.l0) / n; seg(ctx, X(fx), Y(0), X(fx), Y(1), c.grid, 1);
        if ((l - cc.l0) % every === 0 || l === cc.l1) { var lab = cc.id === "x" ? (l === -1 ? "0.1" : num(Math.pow(10, l))) : (l === 0 ? "1" : l === 1 && cc.id !== "eq" ? "10" : "10^{" + l + "}"); cmath(ctx, lab, X(fx), Y(0) + 13, { size:F, font:c.fm, color:c.ink2, align:fx > 0.98 ? "right" : fx < 0.02 ? "left" : "center" }); }
      }
      for (var yv = cc.y0; yv <= cc.y1 + 1e-9; yv += ys) { var fy = (yv - cc.y0) / (cc.y1 - cc.y0); seg(ctx, X(0), Y(fy), X(1), Y(fy), c.grid, 1); txt(ctx, num(yv), X(0) - 6, Y(fy), { size:F, font:c.fu, color:c.ink2, align:"right" }); }
      cmath(ctx, cc.ys, X(0) + 8, Y(1.05) + 2, { size:13, font:c.fm, color:c.ink2, weight:700 });
      cmath(ctx, cc.xs + " (log scale)", X(1), Y(0) - 12, { size:12, font:c.fm, color:c.ink2, align:"right", bg:c.sheet });
      ctx.globalAlpha = 1;
    }
    if (B.from && t < 1) axisLabels(B.fromCh, 1 - t);
    axisLabels(S.ch, t);
    seg(ctx, X(gA[0]), Y(gA[1]), X(gB[0]), Y(gB[1]), c.pen, 3);
    var xu = X(gU[0]), yu = Y(gU[1]), xv = X(gV[0]), yv = Y(gV[1]);
    seg(ctx, xu, yu, xv, yu, c.ink2, 2); seg(ctx, xv, yu, xv, yv, c.hi, 3.2);
    pl.point({ x:gU[0], y:gU[1], r:6, ring:true, color:c.ink }); pl.point({ x:gV[0], y:gV[1], r:6, ring:true, color:c.ink });
    cmath(ctx, "U", xu - 9, yu + (yv < yu ? 14 : -14), { size:14, font:c.fm, color:c.ink, weight:700, align:"right", bg:c.sheet });
    cmath(ctx, "V", xv + 9, yv + (yv < yu ? -12 : 12), { size:14, font:c.fm, color:c.ink, weight:700, bg:c.sheet });
    if (t >= 1) { var rl = riseLab(true), right = xv < pl.W - 130; cmath(ctx, rl, right ? xv + 10 : xv - 10, (yu + yv) / 2, { size:F + 1, font:c.fm, color:c.ink, weight:700, align:right ? "left" : "right", bg:c.sheet }); }
  }
  function riseLab(canvasSrc){
    var r = S.r2, lr = lg(r), w = isWhole(lr), ch = CH[S.ch];
    if (ch.id === "snd") return "rise = 10 log " + r + (w ? " = " + Math.round(10 * lr) + " dB" : " ≈ " + num(10 * lr, 2) + " dB");
    if (ch.id === "ph") return "rise = " + (canvasSrc ? "-" : MINUS) + "log " + r + (w ? " = " + (canvasSrc ? "-" : MINUS) + Math.round(lr) : " ≈ " + num(-lr, 3));
    return "rise = log " + r + (w ? " = " + Math.round(lr) : " ≈ " + num(lr, 3));
  }
  p2.render = function(){ p2.draw({ view:{ xmin:-0.15, xmax:1.04, ymin:-0.14, ymax:1.08 }, grid:false, axes:false, ticks:false, after:paint2, describe:MV.plain(CH[S.ch].t) + " on a log-scale x-axis: a straight line. The pair spans a ratio of " + S.r2 + "; " + riseLab(false) + "." }); };
  // a quantity r × 10^l on chip ch: exact when it is a power of 10 or 2 × 10^n, otherwise ≈ (3 s.f.)
  function qty2(ch, l, r){
    var v = r * Math.pow(10, l), lv = lg(v), plainX = ch.id === "x" && v < 1e4;
    if (isWhole(lv)) return "= " + (ch.id === "x" ? (lv < 0 ? "0.1" : digits(v)) : m("10^{" + Math.round(lv) + "}"));
    if (isWhole(l)) return "= " + (ch.id === "x" ? num(v, 3) : r + " × " + m("10^{" + Math.round(l) + "}"));
    if (r === 1 || isWhole(lg(r))) return "= " + m("10^{" + num(lv, 1) + "}") + " ≈ " + (plainX ? sf3(v) : m(sciSrc(v)));
    return "≈ " + (plainX ? sf3(v) : m(sciSrc(v)));
  }
  function read2(){
    var ch = CH[S.ch], r = S.r2, l = S.ul, lv = l + lg(r);
    function yT(y){ return isWhole(y) ? "= " + num(Math.round(y)) : "≈ " + (ch.id === "snd" ? (Math.round(y * 10) / 10).toFixed(1) : num(y, 3)); }
    var xs = ch.id === "x" ? m("x") : ch.id === "eq" ? m("A") : ch.id === "snd" ? m("I") : "[H⁺]", unit = ch.id === "eq" ? " " + m("A_0") : ch.id === "snd" ? " W/m²" : ch.id === "ph" ? " mol/L" : "";
    var ys = ch.id === "x" ? m("y") : ch.id === "eq" ? m("M") : ch.id === "snd" ? m("L") : "pH", yu2 = ch.id === "snd" ? " dB" : "";
    var rise = riseLab(false).replace("rise = ", "").replace(/ dB$/, "");
    $("#ls-rd2", host).innerHTML = MV.readoutHTML([
      [m("U"), xs + " " + qty2(ch, l, 1) + unit + ", " + ys + " " + yT(ch.y(l)) + yu2 + "."],
      [m("V"), xs + " " + qty2(ch, l, r) + unit + ", " + ys + " " + yT(ch.y(lv)) + yu2 + "."],
      ["Rise", "Rise = " + m(rise) + (ch.id === "snd" ? " dB" : "") + (ch.id === "ph" ? ": the pH drops." : ".")]
    ]);
  }
  var chips2 = radios($("#ls-ch", host), { aria:"Function", cls:"chips", value:S.ch, options:Object.keys(CH).map(function(k){ return { id:k, t:MV.md(CH[k].t) }; }), onChange:function(v){
    var from = geo(S.ch, S.r2, S.ul), fromCh = S.ch; S.ch = v; S.ul = clamp(CH[v].defU, CH[v].l0, CH[v].l1 - lg(S.r2)); fixU(); api.save(); buildUL();
    B.from = from; B.fromCh = fromCh; if (B.stop) B.stop(); B.t = 0;
    B.stop = MV.tween({ dur:800, step:function(t){ B.t = t; p2.render(); }, done:function(){ B.t = 1; B.from = null; p2.render(); read2(); } }); read2(); } });
  radios($("#ls-r2", host), { label:"Ratio", cls:"chips", value:S.r2, options:RAT2.map(function(r){ return { id:r, t:"×" + r }; }), onChange:function(v){ S.r2 = +v; fixU(); api.save(); buildUL(); upd2(); } });
  // keep U on a half-decade position with V still inside the window (a bigger ratio pulls U back)
  function fixU(){ var L = upos(S.ch, S.r2); if (L.indexOf(S.ul) < 0) { var below = L.filter(function(l){ return l <= S.ul; }); S.ul = below.length ? below[below.length - 1] : L[0]; } }
  var sUL;
  function buildUL(){
    var L = upos(S.ch, S.r2), ch = CH[S.ch];
    sUL = stepSlider($("#ls-ul", host), { label:"Move " + m("U") + " along the line", name:"U", n:L.length, idx:Math.max(0, L.indexOf(S.ul)), page:2,
      fmt:function(i){ var l = L[i]; return (ch.id === "ph" ? "[H⁺]" : m(ch.id === "x" ? "x" : ch.id === "eq" ? "A/A_0" : "I")) + " = " + m("10^{" + eS(l) + "}"); },
      onChange:function(i){ S.ul = L[i]; api.save(); upd2(); } });
  }
  function upd2(){ p2.render(); read2(); }
  fixU(); buildUL(); void chips2;
  upd1(); upd2();
  return {};
}

// ---------- Practice 2: forwards, backwards, combined (number entry with a mini ruler after each check) ----------
// @component N4+G4 rulerBoxes — number-entry items (stated accept range in `answer`, named wrong values, three-level hints,
// first-try scoring) that draw a mini log ruler after each check: the item's given value, the value your answer stands
// for, and the ×10 hops between them (a dashed target mark when the question gives one)
function fbc(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { val:"", tries:0, hint:0, solved:false, first:null, last:null }); }
  function parse(v){ var r = MV.parseNum(v); return r && r.length === 1 ? r[0] : null; }
  function judge(it, v){
    var ans = MV.ans(it);
    if (v >= ans.lo - 1e-9 && v <= ans.hi + 1e-9) return { ok:true };
    var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) <= 1e-9 * Math.max(1, Math.abs(q.match)); })[0];
    return { fb:w ? w.fb : a.fallback };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it), dis = x.solved ? " disabled" : "";
        var h = '<div class="q" data-fi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (i >= 7 ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow"><label for="fb-' + it.id + '">' + (it.label || "Your answer:") + '</label><input class="numin" id="fb-' + it.id + '" data-fin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val) + '"' + dis + ">" + (it.unit ? '<span class="m">' + it.unit + "</span>" : "") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="fb' + it.id + 'c">Check</button>' + MV.hintBtn("fb" + it.id + "h", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
        else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
        if (x.last != null) h += '<div class="ls-mini"><canvas class="plot ls-minic" data-mr="' + it.id + '" role="img" aria-label="Mini ruler"></canvas><p class="tiny ls-minicap" data-mrc="' + it.id + '"></p></div>';
        return h + "</div>";
      }).join("");
    });
    a.items.forEach(function(it){ var x = ist(it); if (x.last != null) mini(it, x.last); });
  }
  // the two values the ruler shows, as scale values
  function vals(it, v){
    var R = it.ruler, b = R.b === "ans" ? v : R.b === "logans" ? (v > 0 ? R.a + lg(v) : null) : (v > 0 ? R.a + 10 * lg(v) : null);
    return { a:R.a, b:b, t:R.target };
  }
  function eOf(sc, v){ return sc === "ph" ? -v : sc === "snd" ? v / 10 - 12 : v; }
  function vTxt(sc, v, dp){ var w = isWhole(v * (sc === "snd" ? 1 : 10)); return sc === "ph" ? "pH " + (w ? num(v, 1) : num(v, dp || 2)) : sc === "snd" ? (isWhole(v) ? num(v) : num(v, dp || 2)) + " dB" : "magnitude " + (w ? num(v, 1) : num(v, dp || 2)); }
  function mini(it, v){
    var cv = host.querySelector('[data-mr="' + it.id + '"]'), capEl = host.querySelector('[data-mrc="' + it.id + '"]'); if (!cv) return;
    var R = it.ruler, sc = R.sc, V = vals(it, v), p = cv._p || (cv._p = new MV.Plot(cv, V01));
    var eA = V.b == null ? null : eOf(sc, V.a), eB = V.b == null ? null : eOf(sc, V.b), off = V.b == null || Math.abs(eB - eA) > 14 || !isFinite(eB);
    var what = sc === "snd" ? "intensity" : sc === "eq" ? "amplitude" : "[H⁺]";
    p.render = function(){ p.draw({ view:V01, grid:false, axes:false, ticks:false, after:function(ctx, pl){
      var c = pal(), W = pl.W, H = pl.H, small = W < 420;
      if (off) { txt(ctx, "Your value is off this ruler.", W / 2, H / 2, { size:13, font:c.fu, color:c.ink2, align:"center" }); return; }
      var es = [eA, eB]; if (V.t != null) es.push(eOf(sc, V.t));
      var lo = Math.floor(Math.min.apply(null, es) - 0.4), hi = Math.ceil(Math.max.apply(null, es) + 0.4); if (hi - lo < 3) { lo -= 1; hi += 1; }
      var yR = Math.round(H * 0.6), ax = new LogAxis({ e0:lo, e1:hi, s:1, x0:16, x1:W - 16, y:yR }), M = []; for (var e = lo; e <= hi; e++) M.push(e);
      ax.draw(ctx, { majors:M, top:function(e){ return "10^{" + eS(e) + "}"; }, bot:function(e){ return sc === "ph" ? num(-e) : sc === "snd" ? num(Math.round(10 * (e + 12))) : num(e); }, size:small ? 10 : 11, topGap:15, botGap:15, c:c, W:W, minor:false });
      if (V.t != null) { var xt = ax.px(eOf(sc, V.t)); seg(ctx, xt, yR - 22, xt, yR + 22, c.ink2, 1.5, [4, 3]); txt(ctx, "target", xt, yR + 32, { size:10, font:c.fu, color:c.ink2, align:"center" }); }
      // hops from the smaller quantity to the larger
      var e0 = Math.min(eA, eB), e1 = Math.max(eA, eB), d = e1 - e0, n = Math.floor(d + 1e-7), rem = d - n;
      for (var j = 0; j < n && j < 14; j++) hopArc(ctx, ax.px(e0 + j), ax.px(e0 + j + 1), yR - 26, 1, c, "×10", null, { size:small ? 10 : 11, hMax:14, bg:true });
      if (rem > 0.004) hopArc(ctx, ax.px(e0 + n), ax.px(e1), yR - 26, 1, c, small ? null : "×10^{" + num(rem, 2) + "}", null, { size:11, hMax:14, bg:true });
      [[eA, "given", "P"], [eB, "yours", "Q"]].forEach(function(q){ var x = ax.px(q[0]); ctx.beginPath(); ctx.arc(x, yR, 7, 0, Math.PI * 2); ctx.fillStyle = q[2] === "Q" ? c.pen : c.ink; ctx.fill(); });
    }, describe:off ? "Your value is off this ruler." : "Mini ruler: " + MV.plain(capTxt()) }); };
    function capTxt(){
      if (off) return "Your value is off this ruler.";
      var d = Math.abs(eB - eA), rt = d < 1e-9 ? "the same " + what : (isWhole(d) ? "" : "about ") + (d > 6 ? MV.plain(m("10^{" + num(d, 1) + "}")) : sf3t(Math.pow(10, d))) + " times the " + what;
      var A1 = R.aLab ? vTxt(sc, V.a) + " ([H⁺] = " + R.aLab + ")" : vTxt(sc, V.a), B1 = vTxt(sc, V.b, 2);
      var lead = R.b === "ans" ? "Dark dot: " + A1 + ". Blue dot (your answer): " + B1 + "." : "Dark dot: " + A1 + ". Blue dot: where your answer, ×" + sf3t(v) + ", lands: " + B1 + (V.t != null ? " (target " + vTxt(sc, V.t) + ")" : "") + ".";
      return lead + " Between them: " + (isWhole(d) ? num(Math.round(d)) : num(d, 2)) + (near(d, 1) ? " step" : " steps") + " of ×10, so one has " + rt + " of the other.";
    }
    capEl.textContent = capTxt();
    p.render();
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.fin; if (!id) return; var it = a.items.filter(function(q){ return q.id === id; })[0]; ist(it).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.fin) return; e.preventDefault(); var b = host.querySelector('[data-k="fb' + e.target.dataset.fin + 'c"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-fi]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.fi; })[0], x = ist(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var v = parse(x.val);
      if (v == null) { msgs[it.id] = "Enter a number, such as 12, −3.5 or 3/4."; paint(); return; }
      var r = judge(it, v); x.last = v;
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-fi="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Loud but safe ----------
var EAR = ["None", "Light", "Medium", "Heavy"], LEVELS = [80, 85, 90, 95, 100, 105], LEAN = ["10|90|2", "4|95|2", "2|100|2", "2|105|3"];
// exact tests (plan: N² × 10^(S/5) against powers of 10, all whole numbers): ge → N²·10^(S/5) ≥ 10^k, le → ≤
function ge(N, S, k){ var j = k - S / 5; return j <= 0 ? true : j >= 3 ? false : N * N >= Math.pow(10, j); }
function le(N, S, k){ var j = k - S / 5; return j < 0 ? false : j >= 3 ? true : N * N <= Math.pow(10, j); }
function tChecks(d){ return [d.N >= 2, ge(d.N, d.S, 20), le(d.N, d.S, 17 + 2 * d.e), ge(d.N, d.S, 15 + 2 * d.e)]; }
function tLean(d){ var c = tChecks(d); return c.every(Boolean) && (d.N === 2 || !ge(d.N - 1, d.S, 20)); }
function room(d){ return d.S + 10 * lg(d.N); }
function dB1(v, exact){ return (exact ? "= " : "≈ ") + (Math.round(v * 10) / 10).toFixed(1); }
var task = (function(){
  var api, cvB, cvM, pB, pM, A = { T:null, E:null, n:null, stop:null };
  function read(){ var s = api ? api.S : {}; return { N:s.N || 1, S:LEVELS.indexOf(s.S) >= 0 ? s.S : 90, e:s.e >= 0 && s.e <= 3 ? s.e : 0 }; }
  function exact(d){ return d.N === 1 || d.N === 10; }
  function caption(d){ var T = room(d), ex = exact(d); return d.N + (d.N === 1 ? " stack" : " stacks") + " of " + d.S + " dB: room " + dB1(T, ex) + " dB. " + (d.e ? EAR[d.e] + " earplugs" : "No earplugs") + ": ear " + dB1(T - 10 * d.e, ex) + " dB."; }
  function drawBlocks(ctx, pl){
    var c = pal(), W = pl.W, H = pl.H, d = read(), n = A.n == null ? d.N : A.n, top = 34, bot = H - 26, bh = (bot - top) / 16.6, bw = Math.min(70, W * 0.4), bx = W / 2 - bw / 2;
    txt(ctx, "Intensity (linear)", W / 2, 14, { size:12, font:c.fu, color:c.ink2, align:"center", weight:700 });
    for (var i = 0; i < Math.ceil(n); i++) { var f = Math.min(1, n - i); ctx.fillStyle = c.pen; ctx.fillRect(bx, bot - (i + f) * bh + 1, bw, f * bh - 2); }
    seg(ctx, bx - 14, bot - 10 * bh, bx + bw + 14, bot - 10 * bh, c.ink2, 1.5, [6, 4]);
    txt(ctx, "×10 one stack", bx + bw + 16 > W - 70 ? W - 4 : bx + bw + 16, bot - 10 * bh - 9, { size:11, font:c.fu, color:c.ink2, align:bx + bw + 16 > W - 70 ? "right" : "left", bg:c.sheet });
    seg(ctx, bx - 20, bot, bx + bw + 20, bot, c.axis, 1.5);
    txt(ctx, d.N + (d.N === 1 ? " stack" : " stacks"), W / 2, bot + 13, { size:12, font:c.fu, color:c.ink, align:"center", weight:700 });
  }
  function drawMeter(ctx, pl){
    var c = pal(), W = pl.W, H = pl.H, d = read(), top = 26, bot = H - 16, ax = Math.min(54, W * 0.24);
    function Y(v){ return bot - (clamp(v, 60, 120) - 60) / 60 * (bot - top); }
    txt(ctx, "Level (dB)", W / 2, 12, { size:12, font:c.fu, color:c.ink2, align:"center", weight:700 });
    ctx.fillStyle = c.hiSoft; ctx.fillRect(ax, Y(85), W - ax - 6, Y(75) - Y(85)); seg(ctx, ax, Y(85), W - 6, Y(85), c.hi, 2); seg(ctx, ax, Y(75), W - 6, Y(75), c.hi, 2);
    txt(ctx, "safe and clear", W - 8, (Y(75) + Y(85)) / 2, { size:11, font:c.fu, color:c.ink, align:"right" });
    seg(ctx, ax, Y(100), W - 6, Y(100), c.ink2, 1.5, [6, 4]); txt(ctx, "loud show", W - 8, Y(100) - 8, { size:11, font:c.fu, color:c.ink2, align:"right", bg:c.sheet });
    seg(ctx, ax, top, ax, bot, c.axis, 1.5);
    for (var v = 60; v <= 120; v += 10) { seg(ctx, ax - 5, Y(v), ax, Y(v), c.axis, 1); txt(ctx, String(v), ax - 8, Y(v), { size:11, font:c.fu, color:c.ink2, align:"right" }); }
    var T = A.T == null ? room(d) : A.T, E = A.E == null ? T - 10 * d.e : A.E, mx = ax + 22;
    function mk(v, lab, col){ var y = Y(v); ctx.beginPath(); ctx.arc(mx, y, 7, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); txt(ctx, lab + " " + (Math.round(v * 10) / 10).toFixed(1) + (v < 60 ? " (below 60)" : ""), mx + 12, y, { size:12, font:c.fu, color:c.ink, weight:700, bg:c.sheet }); }
    if (d.e) { var y1 = Y(T) + 9, y2 = Y(E) - 10; if (y2 - y1 > 8) { seg(ctx, mx, y1, mx, y2, c.ink, 2); tri(ctx, mx, y2 + 6, "down", 7, c.ink); } txt(ctx, MINUS + (10 * d.e) + " dB", mx - 10, (Y(T) + Y(E)) / 2, { size:11, font:c.fu, color:c.ink, align:"right", bg:c.sheet }); }
    mk(T, "room", c.ink); if (d.e) mk(E, "ear", c.pen);
  }
  function paint(anim){
    var d = read();
    var cap = $("#lb-cap"); if (cap) cap.textContent = caption(d);
    $$("#lb-ear [data-e]").forEach(function(b){ b.setAttribute("aria-checked", +b.dataset.e === d.e ? "true" : "false"); b.tabIndex = +b.dataset.e === d.e ? 0 : -1; });
    $$("#lb-lev [data-lv]").forEach(function(b){ b.setAttribute("aria-checked", +b.dataset.lv === d.S ? "true" : "false"); b.tabIndex = +b.dataset.lv === d.S ? 0 : -1; });
    var nOut = $("#lb-n"); if (nOut) nOut.textContent = d.N; $("#lb-minus").disabled = d.N <= 1; $("#lb-plus").disabled = d.N >= 16;
    var T1 = room(d), E1 = T1 - 10 * d.e;
    if (A.stop) A.stop();
    if (anim && !RM && A.T != null) {
      var fT = A.T, fE = A.E, fn = A.n;
      A.stop = MV.tween({ dur:400, step:function(t){ A.T = lerp(fT, T1, t); A.E = lerp(fE, E1, t); A.n = lerp(fn, d.N, t); pB.render(); pM.render(); }, done:function(){ A.T = T1; A.E = E1; A.n = d.N; pB.render(); pM.render(); } });
    } else { A.T = T1; A.E = E1; A.n = d.N; pB.render(); pM.render(); }
  }
  function ensureBonus(){
    var ul = $("#task-checks"); if (!ul || ul.querySelector(".lb-bonus")) return;
    var d = read(), on = tLean(d), li = document.createElement("li"); li.className = "lb-bonus " + (on ? "yes" : "no");
    li.innerHTML = '<span class="mk" aria-hidden="true">' + (on ? "★" : "☆") + "</span><span>" + MV.C.task.bonus + '<span class="vh">' + (on ? " (met)" : " (not met)") + "</span></span>";
    ul.appendChild(li);
  }
  function upd(anim){ paint(anim); if (api) api.update(); ensureBonus(); }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S; if (!s.N) s.N = 1; if (LEVELS.indexOf(s.S) < 0) s.S = 90; if (!(s.e >= 0)) s.e = 0;
      inp.innerHTML = '<div class="lb-in"><div class="lb-row"><span class="lb-lab" id="lb-nl"><i>N</i>, the number of identical speaker stacks</span><span class="lb-step" role="group" aria-labelledby="lb-nl"><button type="button" class="btn ghost ls-pm" id="lb-minus" data-k="lbm" aria-label="One stack fewer">' + MINUS + '</button><output id="lb-n" aria-live="polite"></output><button type="button" class="btn ghost ls-pm" id="lb-plus" data-k="lbp" aria-label="One more stack">+</button></span></div>' +
        '<div class="lb-row"><span class="lb-lab" id="lb-ll">Level of one stack at the crew’s position</span><span class="ls-rg chips" id="lb-lev" role="radiogroup" aria-labelledby="lb-ll">' + LEVELS.map(function(v){ return '<button type="button" role="radio" data-lv="' + v + '" data-k="lbl' + v + '">' + v + " dB</button>"; }).join("") + "</span></div>" +
        '<div class="lb-row"><span class="lb-lab" id="lb-el">Earplugs</span><span class="ls-rg chips" id="lb-ear" role="radiogroup" aria-labelledby="lb-el">' + EAR.map(function(n, i){ return '<button type="button" role="radio" data-e="' + i + '" data-k="lbe' + i + '">' + n + (i ? " (÷" + digits(Math.pow(10, i)) + ")" : "") + "</button>"; }).join("") + "</span></div>" +
        '<p class="lb-cap" id="lb-cap" aria-live="polite"></p></div>';
      pv.innerHTML = '<div class="lb-pv"><div class="lb-meter"><canvas class="plot lb-c" id="lb-cm" role="img" aria-label="Level meter"></canvas></div><div class="lb-blocks"><canvas class="plot lb-c" id="lb-cb" role="img" aria-label="Intensity blocks"></canvas></div></div>';
      cvB = $("#lb-cb"); cvM = $("#lb-cm"); pB = new MV.Plot(cvB, V01); pM = new MV.Plot(cvM, V01);
      pB.render = function(){ var d = read(); pB.draw({ view:V01, grid:false, axes:false, ticks:false, after:drawBlocks, describe:d.N + " blocks of equal intensity, one per stack, with a dashed mark at 10 blocks." }); };
      pM.render = function(){ var d = read(), T = room(d); pM.draw({ view:V01, grid:false, axes:false, ticks:false, after:drawMeter, describe:"Level meter from 60 to 120 dB with the safe and clear band from 75 to 85 dB and a dashed line at 100 dB. Room about " + num(T, 1) + " dB; ear about " + num(T - 10 * d.e, 1) + " dB." }); };
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.id === "lb-minus") s.N = Math.max(1, s.N - 1); else if (b.id === "lb-plus") s.N = Math.min(16, s.N + 1);
        else if (b.dataset.lv) s.S = +b.dataset.lv; else if (b.dataset.e != null) s.e = +b.dataset.e; else return;
        a.save(); upd(true);
      });
      inp.addEventListener("keydown", function(e){
        var b = e.target.closest("[role=radio]"); if (!b) return;
        var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
        e.preventDefault();
        if (b.dataset.lv) { var i = (LEVELS.indexOf(s.S) + d + 6) % 6; s.S = LEVELS[i]; } else { s.e = (s.e + d + 4) % 4; }
        a.save(); upd(true); var nb = inp.querySelector(b.dataset.lv ? '[data-lv="' + s.S + '"]' : '[data-e="' + s.e + '"]'); if (nb) nb.focus();
      });
      var ul = $("#task-checks");
      if (ul) new MutationObserver(ensureBonus).observe(ul, { childList:true });
      else setTimeout(function(){ var u2 = $("#task-checks"); if (u2) { new MutationObserver(ensureBonus).observe(u2, { childList:true }); ensureBonus(); } }, 0);
      // after the toolkit's own check handler: the lean-design message once all four lean designs are found
      var btn = $("#task-check");
      var hook = function(){ setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && LEAN.every(function(k){ return ts.found.indexOf(k) >= 0; }) && !fb.querySelector(".lb-leanall")) { var p = document.createElement("p"); p.className = "lb-leanall"; p.innerHTML = MV.C.task.leanAll; fb.appendChild(p); } }, 0); };
      if (btn) btn.addEventListener("click", hook); else setTimeout(function(){ var b2 = $("#task-check"); if (b2) b2.addEventListener("click", hook); }, 0);
      paint(false); setTimeout(ensureBonus, 0);
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return tChecks(d); },
    tips:function(d, res){
      var Tt = MV.C.task, out = [], T = room(d), E = T - 10 * d.e, f1 = function(v){ return (Math.round(v * 10) / 10).toFixed(1); };
      if (!res[0]) out.push(Tt.tips[0]);
      if (!res[1]) {
        if (d.S <= 85) out.push(Tt.tipLow.replace("{S}", d.S).replace("{T16}", f1(d.S + 10 * lg(16))));
        else out.push(Tt.tips[1].replace("{T}", f1(T)).replace("{S}", d.S).replace("{need}", '<span class="m">10<sup>(100 − ' + d.S + ")/10</sup></span>" + (d.S === 90 ? " = 10" : d.S === 95 ? " ≈ 3.16, so 4" : "")));
      }
      if (!res[2]) out.push(d.e === 3 ? Tt.tipHeavy.replace("{E}", f1(E)) : Tt.tips[2].replace("{E}", f1(E)));
      if (!res[3]) out.push(Tt.tips[3].replace("{E}", f1(E)));
      return out;
    },
    key:function(d){ return d.N + "|" + d.S + "|" + d.e; },
    label:function(k){ var p = k.split("|"); return "(" + p[0] + ", " + p[1] + ", " + EAR[+p[2]] + ")" + (LEAN.indexOf(k) >= 0 ? " ★" : ""); },
    text:function(k){ var p = k.split("|"); return "(" + p[0] + ", " + p[1] + ", " + EAR[+p[2]] + ")"; },
    summary:function(ts){
      if (!ts.found.length) return ["Loud but safe: not solved yet"];
      var n = LEAN.filter(function(k){ return ts.found.indexOf(k) >= 0; }).length;
      return ["Loud but safe: solved (" + ts.found.map(function(k){ var p = k.split("|"); return "(" + p[0] + ", " + p[1] + ", " + EAR[+p[2]] + ")"; }).join("; ") + "), lean designs " + n + "/4"];
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ fbc:fbc },
  task:task,
  onShow:function(){ MV.redrawAll(); }
});
})();
