// MHF4U 49 Modelling with Combined Functions: hero (trend + wave peel), Model lab (Explore), crossing finder (Part 3),
// "Match the story to its model" (Practice 1), "Keep the servers ahead" task and the quick-check figure.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS, M = MV.m;
var PI = Math.PI, TAU = 2 * Math.PI;
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, s){ return a + (b - a) * s; }
function snapTo(v, step, lo, hi){ return clamp(+(Math.round(v / step) * step).toFixed(6), lo, hi); }
function fx1(v){ var r = Math.round(v * 10) / 10; if (r === 0) r = 0; return (r < 0 ? MINUS : "") + Math.abs(r).toFixed(1); }
function src(v){ return String(+(+v).toFixed(6)); }          // number as MV.m source (a hyphen becomes a true minus)
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
function niceCeil(v){ var p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p, L = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]; for (var i = 0; i < L.length; i++) if (n <= L[i] + 1e-9) return L[i] * p; return 10 * p; }
function ease(s){ return MV.ease(clamp(s, 0, 1)); }
function sgn(v){ return Math.abs(v) < 1e-12 ? 0 : v > 0 ? 1 : -1; }

// @component radioGroup (copied from MHF4U 35, with per-option disabling) — segmented control or chip row as a real radio
//   group (arrow keys, roving tabindex). radios(host, {label, aria, options:[{id, t}], value, cls, onChange}) -> {set, get, off(ids)}
function radios(host, o){
  var val = String(o.value), offs = {};
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, dis = offs[x.id]; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-rg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + (typeof x.t === "function" ? x.t() : x.t) + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (offs[id]) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }).filter(function(x){ return !offs[x]; }), i = (ids.indexOf(val) + d + ids.length) % ids.length; choose(ids[i]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, repaint:paint,
    off:function(ids){ var n = {}; (ids || []).forEach(function(x){ n[x] = 1; }); if (JSON.stringify(n) !== JSON.stringify(offs)) { offs = n; paint(); } } };
}

// @component splitPlot — hand-drawn plot panels on a Plot canvas (a graph above a strip, sharing one t-axis), with margins for
//   tick labels, grid, axes, curves (solid or dashed, clipped), dots, gap bars, bands, reference lines and labels in data units.
//   var P = panel(plot, {x, y, w, h}, {xmin, xmax, ymin, ymax}, {xTitle, yTitle, xLab:false}); P.frame(); P.curve(f, {color, width, dash})
function panel(pl, R, v, o){
  o = o || {};
  var ctx = pl.ctx, P = { R:R, v:v, ctx:ctx };
  P.X = function(t){ return R.x + (t - v.xmin) / (v.xmax - v.xmin) * R.w; };
  P.Y = function(y){ return R.y + R.h - (y - v.ymin) / (v.ymax - v.ymin) * R.h; };
  P.tOf = function(px){ return v.xmin + (px - R.x) / R.w * (v.xmax - v.xmin); };
  P.yOf = function(py){ return v.ymin + (R.y + R.h - py) / R.h * (v.ymax - v.ymin); };
  P.clip = function(){ ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); };
  P.frame = function(alpha){
    var sx = o.xStep || MV.niceStep((v.xmax - v.xmin) / (R.w < 360 ? 5 : 9)), sy = o.yStep || MV.niceStep((v.ymax - v.ymin) / clamp(R.h / 40, 2, 8)), x, y;
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    for (x = Math.ceil(v.xmin / sx - 1e-9) * sx; x <= v.xmax + 1e-9; x += sx) { var px = Math.round(P.X(x)) + 0.5; ctx.moveTo(px, R.y); ctx.lineTo(px, R.y + R.h); }
    for (y = Math.ceil(v.ymin / sy - 1e-9) * sy; y <= v.ymax + 1e-9; y += sy) { var py = Math.round(P.Y(y)) + 0.5; ctx.moveTo(R.x, py); ctx.lineTo(R.x + R.w, py); }
    ctx.stroke();
    ctx.strokeStyle = css("--rule"); ctx.strokeRect(R.x + 0.5, R.y + 0.5, R.w - 1, R.h - 1);
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath();
    if (v.ymin <= 0 && v.ymax >= 0) { ctx.moveTo(R.x, P.Y(0)); ctx.lineTo(R.x + R.w, P.Y(0)); }
    if (v.xmin <= 0 && v.xmax >= 0) { ctx.moveTo(P.X(0), R.y); ctx.lineTo(P.X(0), R.y + R.h); }
    ctx.stroke();
    ctx.fillStyle = css("--ink-2"); ctx.font = "12px " + pl.fontUI;
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (y = Math.ceil(v.ymin / sy - 1e-9) * sy; y <= v.ymax + 1e-9; y += sy) { var yy = P.Y(y); if (yy < R.y + 5 || yy > R.y + R.h - 5) continue; ctx.fillText(num(y), R.x - 5, yy); }
    if (o.xLab !== false) {
      ctx.textAlign = "center"; ctx.textBaseline = "top"; var last = -1e9;
      for (x = Math.ceil(v.xmin / sx - 1e-9) * sx; x <= v.xmax + 1e-9; x += sx) { var xx = P.X(x), lab = num(x), lw = ctx.measureText(lab).width; if (xx < R.x + 4 || xx > R.x + R.w - 4 || xx - lw / 2 < last + 6) continue; ctx.fillText(lab, xx, R.y + R.h + 3); last = xx + lw / 2; }
    }
    ctx.font = "italic 13px " + pl.fontM;
    if (o.xTitle) { ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText(o.xTitle, R.x + R.w - 5, R.y + R.h - 4); }
    if (o.yTitle) { ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yTitle, (v.xmin <= 0 && v.xmax >= 0 ? Math.max(R.x, P.X(0)) : R.x) + 6, R.y + 4); }
    ctx.restore();
  };
  P.curve = function(f, s){
    s = s || {}; var a = s.from != null ? Math.max(s.from, v.xmin) : v.xmin, b = s.to != null ? Math.min(s.to, v.xmax) : v.xmax;
    if (b <= a) return;
    var n = Math.max(160, Math.round(R.w * (b - a) / (v.xmax - v.xmin))), pen = false, lim = 4000;
    P.clip(); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha; ctx.strokeStyle = s.color || css("--ink"); ctx.lineWidth = s.width || 3; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.setLineDash(s.dash || []); ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var t = a + (b - a) * i / n, y = f(t);
      if (!isFinite(y)) { pen = false; continue; }
      var px = P.X(t), py = clamp(P.Y(y), R.y - lim, R.y + R.h + lim);
      if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.restore();
  };
  P.dot = function(t, y, s){
    s = s || {}; var px = P.X(t), py = P.Y(y), r = s.r || 4.5;
    if (!isFinite(px) || !isFinite(py) || px < R.x - 8 || px > R.x + R.w + 8 || py < R.y - 8 || py > R.y + R.h + 8) return;
    ctx.save(); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha;
    if (s.ring) { ctx.beginPath(); ctx.arc(px, py, r + 5, 0, TAU); ctx.fillStyle = css("--hi"); ctx.fill(); }
    ctx.beginPath(); ctx.arc(px, py, r, 0, TAU);
    if (s.open) { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = s.color || css("--ink"); ctx.stroke(); }
    else { ctx.fillStyle = s.color || css("--ink"); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css("--sheet"); ctx.stroke(); }
    ctx.restore();
  };
  P.gapBar = function(t, y0, y1, big, alpha){
    var px = P.X(t), a = P.Y(y0), b = P.Y(y1), top = Math.min(a, b), h = Math.abs(b - a);
    P.clip(); ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = css("--hi"); ctx.fillRect(px - 2, top, 4, h);
    if (big) { ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 2; ctx.strokeRect(px - 3, top - 1, 6, h + 2); }
    ctx.restore();
  };
  P.hband = function(y0, y1, color, alpha){ P.clip(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = color || css("--hi-soft"); var a = P.Y(Math.max(y0, y1)), b = P.Y(Math.min(y0, y1)); ctx.fillRect(R.x, a, R.w, b - a); ctx.restore(); };
  P.vband = function(t0, t1, color, alpha){ P.clip(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = color || css("--hi-soft"); ctx.fillRect(P.X(t0), R.y, P.X(t1) - P.X(t0), R.h); ctx.restore(); };
  P.hline = function(y, s){
    s = s || {}; var py = P.Y(y); if (py < R.y - 1 || py > R.y + R.h + 1) return;
    P.clip(); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha; ctx.strokeStyle = s.color || css("--ink-2"); ctx.lineWidth = s.width || 1.6; ctx.setLineDash(s.dash || []);
    ctx.beginPath(); ctx.moveTo(R.x, py); ctx.lineTo(R.x + R.w, py); ctx.stroke(); ctx.restore();
    if (s.label) P.text(v.xmax, y, s.label, { align:"right", dx:-6, dy:s.below ? 11 : -11, color:s.color || css("--ink-2"), font:"600 12px " + pl.fontUI, bg:true });
  };
  P.vline = function(t, s){
    s = s || {}; var px = P.X(t); if (px < R.x || px > R.x + R.w) return;
    P.clip(); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha; ctx.strokeStyle = s.color || css("--ink-2"); ctx.lineWidth = s.width || 1.6; ctx.setLineDash(s.dash || []);
    ctx.beginPath(); ctx.moveTo(px, R.y); ctx.lineTo(px, R.y + R.h); ctx.stroke(); ctx.restore();
  };
  P.text = function(t, y, text, s){
    s = s || {}; var px = P.X(t) + (s.dx || 0), py = P.Y(y) + (s.dy || 0);
    ctx.save(); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha; ctx.font = s.font || ("600 13px " + pl.fontUI);
    ctx.textAlign = s.align || "left"; ctx.textBaseline = s.base || "middle";
    var w = ctx.measureText(text).width, bx = s.align === "center" ? px - w / 2 : s.align === "right" ? px - w : px;
    if (s.align !== "right" && bx + w > R.x + R.w - 2) { bx = R.x + R.w - 2 - w; px = s.align === "center" ? bx + w / 2 : bx; }
    if (bx < R.x + 2) { var sh = R.x + 2 - bx; bx += sh; px += sh; }
    if (s.bg) { ctx.fillStyle = css("--sheet"); ctx.globalAlpha *= 0.88; ctx.fillRect(bx - 3, py - 9, w + 6, 18); ctx.globalAlpha = s.alpha == null ? 1 : s.alpha; }
    ctx.fillStyle = s.color || css("--ink"); ctx.fillText(text, px, py); ctx.restore();
  };
  return P;
}
function layout(pl, split, frac, gs){
  var W = pl.W, H = pl.H, ml = 44, mr = 10, mt = 8, mb = 20, gap = 24 * (gs == null ? 1 : gs), w = W - ml - mr;
  if (!split) return { top:{ x:ml, y:mt, w:w, h:H - mt - mb } };
  var avail = H - mt - mb - gap, th = avail * (frac || 0.55);
  return { top:{ x:ml, y:mt, w:w, h:th }, strip:{ x:ml, y:mt + th + gap, w:w, h:avail - th } };
}

// ---------- the Model lab: data, structures and text ----------
var CFG = {
  tea:{ rng:{ m:[-2, 2, 0.1], b:[0, 100, 1], A:[0, 100, 1], h:[1, 30, 1], a:[0, 20, 1], T:[10, 60, 5], ds:5 }, xT:"t (min)", yT:"T (°C)", view:{ ymin:0, ymax:90 },
    fore:{ tmax:180, ymin:0, ymax:100, lo:60, step:5, def:120, line:20, lab:"room 20 °C" },
    start:{ p1:"exp", op:"add", p2:"none", lin:{ m:0, b:0 }, e1:{ A:84, h:15, dir:"half" }, e2:{ A:40, h:20, dir:"half" }, wave:{ a:5, T:30, d:0 } } },
  ferry:{ rng:{ m:[-2, 2, 0.1], b:[0, 50, 1], A:[0, 50, 1], h:[1, 36, 1], a:[0, 15, 0.5], T:[2, 24, 1], ds:1 }, xT:"t (months)", yT:"P (thousands)", view:{ ymin:0, ymax:45 },
    fore:{ tmax:120, ymin:0, ymax:90, lo:36, step:1, def:60, line:39, lab:"ferry capacity 39 thousand" },
    start:{ p1:"lin", op:"add", p2:"none", lin:{ m:0, b:25 }, e1:{ A:20, h:12, dir:"double" }, e2:{ A:10, h:12, dir:"half" }, wave:{ a:3, T:6, d:0 } } },
  spring:{ rng:{ m:[-6, 6, 0.5], b:[-30, 30, 1], A:[0, 40, 1], h:[0.5, 8, 0.5], a:[0, 30, 1], T:[0.5, 8, 0.5], ds:0.5 }, xT:"t (s)", yT:"y (cm)", view:{ ymin:-30, ymax:30 },
    fore:{ tmax:24, ymin:-30, ymax:30, lo:8, step:0.5, def:24, line:0, lab:"rest position" },
    start:{ p1:"lin", op:"add", p2:"wave", lin:{ m:0, b:0 }, e1:{ A:20, h:4, dir:"half" }, e2:{ A:20, h:4, dir:"half" }, wave:{ a:24, T:4, d:0 } } },
  swing:{ rng:{ m:[-6, 6, 0.5], b:[-30, 30, 1], A:[0, 40, 1], h:[0.5, 8, 0.5], a:[0, 30, 1], T:[0.5, 8, 0.5], ds:0.5 }, xT:"t (s)", yT:"y (cm)", view:{ ymin:-35, ymax:35 },
    fore:{ tmax:24, ymin:-90, ymax:90, lo:8, step:0.5, def:24, line:0, lab:"rest position" },
    start:{ p1:"lin", op:"add", p2:"none", lin:{ m:0, b:0 }, e1:{ A:6, h:4, dir:"double" }, e2:{ A:6, h:4, dir:"double" }, wave:{ a:10, T:3, d:0 } } }
};
var SETS = ["tea", "ferry", "spring", "swing"];
function DSET(id){ return MV.C.explore.data[id]; }
function times(id){ var d = DSET(id); return d.y.map(function(_, i){ return +(d.t0 + i * d.dt).toFixed(4); }); }
function copy(o){ return JSON.parse(JSON.stringify(o)); }
function loadSet(S, id){
  var st = copy(CFG[id].start);
  S.set = id; S.p1 = st.p1; S.op = st.op; S.p2 = st.p2; S.lin = st.lin; S.e1 = st.e1; S.e2 = st.e2; S.wave = st.wave;
  S.view = "fit"; S.left = "p1"; S.parts = false; S.fore = CFG[id].fore.def; S.note = null;
}
function expV(e, t, lock){ return (lock ? 1 : e.A) * Math.pow(e.dir === "half" ? 0.5 : 2, t / e.h); }
function p1V(L, t){ return L.p1 === "lin" ? L.lin.m * t + L.lin.b : expV(L.e1, t); }
function p2V(L, t){ var lock = L.op === "mul"; if (L.p2 === "exp") return expV(L.e2, t, lock); if (L.p2 === "wave") return (lock ? 1 : L.wave.a) * Math.cos(TAU * (t - L.wave.d) / L.wave.T); return null; }
function modelV(L, t){ var a = p1V(L, t), b = p2V(L, t); if (b === null) return a; return L.op === "mul" ? a * b : a + b; }
function gapStats(L){
  var ts = times(L.set), ys = DSET(L.set).y, mx = -1, at = 0, n = 0, g = [];
  ts.forEach(function(t, i){ var v = Math.abs(ys[i] - modelV(L, t)); g.push(v); if (v > mx + 1e-9) { mx = v; at = t; } if (v <= 1 + 1e-9) n++; });
  var order = g.map(function(v, i){ return i; }).sort(function(a, b){ return (g[b] - g[a]) || (a - b); });
  return { max:mx, at:at, n:n, N:ts.length, g:g, top2:order.slice(0, 2).map(function(i){ return ts[i]; }).sort(function(a, b){ return a - b; }) };
}
function leftovers(L, mode){
  var ts = times(L.set), ys = DSET(L.set).y, pts = [], zero = [];
  ts.forEach(function(t, i){
    if (mode === "whole") { pts.push({ t:t, v:ys[i] - modelV(L, t), i:i }); return; }
    var p = p1V(L, t);
    if (L.op === "mul") { if (Math.abs(p) < 0.05) zero.push(t); else pts.push({ t:t, v:ys[i] / p, i:i }); }
    else pts.push({ t:t, v:ys[i] - p, i:i });
  });
  return { pts:pts, zero:zero };
}
// model text in MV.m source
function linSrc(m, b){
  var mt = m === 0 ? "" : m === 1 ? "t" : m === -1 ? "-t" : src(m) + "t";
  if (!mt) return src(b);
  if (b === 0) return mt;
  return mt + (b < 0 ? " - " + src(-b) : " + " + src(b));
}
function expSrc(e, lock){
  var A = lock ? 1 : e.A, ex = "^{t/" + src(e.h) + "}";
  if (A === 0) return "0";
  if (e.dir === "half") return (A === 1 ? "" : src(A)) + "(1/2)" + ex;
  return (A === 1 ? "" : src(A) + " · ") + "2" + ex;
}
function kInfo(T, stacked){
  var n = 4, d = Math.round(2 * T), g = gcd(n, d); n /= g; d /= g;
  var top = (n === 1 ? "" : n) + "π";
  return { frac:d > 1, s:d === 1 ? top : stacked ? "{" + top + "}/{" + d + "}" : top + "/" + d };
}
function waveSrc(w, lock, stacked){
  var k = kInfo(w.T, stacked), kk = "@k{" + k.s + "}", a = lock ? "" : "@a{" + src(w.a) + "} ";
  if (w.d === 0) return a + "cos(" + kk + (k.frac ? " " : "") + "t)";
  return a + "cos[" + kk + (k.frac ? " " : "") + "(t - @d{" + src(w.d) + "})]";
}
function modelSrc(L, stacked){
  var p1 = L.p1 === "lin" ? linSrc(L.lin.m, L.lin.b) : expSrc(L.e1), mul = L.op === "mul";
  if (L.p2 === "none") return p1;
  var p2 = L.p2 === "exp" ? expSrc(L.e2, mul) : waveSrc(L.wave, mul, stacked);
  if (!mul) return (L.p1 === "lin" && L.lin.m === 0 && L.lin.b === 0) ? p2 : p1 + " + " + p2;
  var f1 = (L.p1 === "lin" && L.lin.m !== 0 && L.lin.b !== 0) ? "(" + p1 + ")" : p1;
  if (L.p2 === "wave") return f1 + " " + p2;
  return f1 + (L.e2.dir === "half" ? "" : " · ") + p2;
}
function capSrc(L){ return DSET(L.set).letter + "(t) = " + modelSrc(L, true); }
function every(L, v){ var d = DSET(L.set); return v === 1 && d.tOne === "month" ? "1 month" : num(v) + " " + d.tUnit; }
function monthYear(t){ return MONTHS[((t % 12) + 12) % 12] + ", year " + (Math.floor(t / 12) + 1); }
function peaksTxt(L){
  var tEnd = times(L.set).slice(-1)[0], w = L.wave, out = [];
  for (var t = w.d; t <= tEnd + 1e-9 && out.length < 7; t += w.T) out.push(+t.toFixed(4));
  var more = out.length > 6; if (more) out.length = 6;
  return M("t = " + out.map(src).join(", ")) + (more ? ", …" : "") + (L.set === "ferry" && out.length ? " (" + MONTHS[((out[0] % 12) + 12) % 12] + ")" : "");
}

// ---------- hero: the ferry readings, a trend, the peel, a wave, and the model ----------
function hero(f){
  if (!f.canvas) return;
  var d = DSET("ferry"), ts = times("ferry"), ys = d.y, N = ys.length;
  var trend = function(t){ return 0.5 * t + 20; }, wave = function(t){ return 5 * Math.cos(PI / 6 * (t - 6)); };
  var H = { axes:0, dots:0, trend:0, split:0, peel:0, wave:0, lift:0 }, pl = new MV.Plot(f.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  var vTop = { xmin:-1, xmax:36, ymin:0, ymax:45 }, vStr = { xmin:-1, xmax:36, ymin:-7.5, ymax:7.5 }, PD = 900, ST = 20;
  function pk(i){ return ease((H.peel * (PD + ST * (N - 1)) - ST * i) / PD); }
  function lk(i){ return ease((H.lift * (PD + ST * (N - 1)) - ST * i) / PD); }
  function draw(){
    pl.draw({ grid:false, axes:false, describe:MV.plain(MV.C.hero.fig.aria), after:function(ctx){
      var Ly = layout(pl, H.split > 0, lerp(1, 0.58, H.split), H.split), split = H.split > 0;
      var P = panel(pl, Ly.top, vTop, { xTitle:"months since January, year 1", yTitle:"passengers (thousands)", xLab:!split || H.split < 0.5 });
      P.frame(H.axes);
      var Q = split ? panel(pl, Ly.strip, vStr, { yTitle:"what’s left" }) : null;
      if (Q) Q.frame(H.split);
      var pen = css("--pen"), ink = css("--ink");
      // trend: draws left to right, flattens onto the strip's zero line during the peel, and lifts back with the wave
      if (H.trend > 0) {
        var tEnd = -1 + 37 * H.trend, s = ease(H.peel) * (1 - ease(H.lift)), pts = [];
        for (var k = 0; k <= 160; k++) { var t = -1 + 37 * k / 160; if (t > tEnd) break; pts.push([P.X(t), Q && s > 0 ? lerp(P.Y(trend(t)), Q.Y(0), s) : P.Y(trend(t))]); }
        stroke(ctx, pts, pen, H.lift >= 1 ? 2 : 2.6, null, 1);
        if (H.peel < 0.2 || H.lift >= 1) P.text(29, trend(29), "trend", { dy:20, color:pen, bg:true });
      }
      // the wave: drawn through the leftovers, then lifted onto the trend
      if (H.wave > 0 && Q) {
        var we = -1 + 37 * H.wave, lw = ease(H.lift), wp = [];
        for (var j = 0; j <= 220; j++) { var tt = -1 + 37 * j / 220; if (tt > we) break; wp.push([P.X(tt), lerp(Q.Y(wave(tt)), P.Y(trend(tt) + wave(tt)), lw)]); }
        stroke(ctx, wp, ink, lerp(2.2, 3.4, lw), lw < 1 ? [10, 6] : null, 1);
      } else if (H.lift >= 1) P.curve(function(t){ return trend(t) + wave(t); }, { color:ink, width:3.4 });
      if (H.lift > 0) {
        var lw2 = ease(H.lift);
        ts.forEach(function(t, i){ if (lk(i) >= 1 || H.lift >= 1) P.gapBar(t, ys[i], trend(t) + lw2 * wave(t), false, 0.9); });
        if (H.lift >= 1) P.text(6, trend(6) + wave(6), "trend + wave", { align:"center", dy:-22, bg:true });
      }
      // the readings: appear one by one, peel down into the strip, and lift back
      for (var i = 0; i < Math.min(N, Math.floor(H.dots)); i++) {
        var t0 = ts[i], y0 = P.Y(ys[i]), x0 = P.X(t0), yy = y0;
        if (Q) { var down = Q.Y(ys[i] - trend(t0)); yy = lerp(y0, down, pk(i)); if (H.lift > 0) yy = lerp(down, y0, lk(i)); }
        dotPx(ctx, x0, yy, 4.2, ink);
      }
      if (Q && H.peel > 0.6 && H.lift < 0.3) Q.text(34, 6, "what’s left", { align:"right", base:"top", dy:4, color:ink, alpha:Math.min(1, (H.peel - 0.6) * 3) });
    } });
  }
  pl.render = draw;
  function done(){ H = { axes:1, dots:N, trend:1, split:0, peel:1, wave:1, lift:1 }; draw(); f.cap.textContent = "Trend + wave = model. What’s left is just scatter."; }
  if (MV.reduceMotion) { done(); return; }
  draw();
  var seq = [
    function(n){ MV.tween({ dur:300, step:function(s){ H.axes = s; draw(); }, done:n }); },
    function(n){ MV.tween({ dur:40 * N, ease:function(s){ return s; }, step:function(s){ H.dots = s * N + 0.999; draw(); }, done:n }); },
    function(n){ MV.tween({ dur:600, ease:function(s){ return s; }, step:function(s){ H.trend = s; draw(); }, done:function(){ MV.wait(500, n); } }); },
    function(n){ MV.tween({ dur:500, step:function(s){ H.split = s; draw(); }, done:n }); },
    function(n){ MV.tween({ dur:PD + ST * (N - 1), ease:function(s){ return s; }, step:function(s){ H.peel = s; draw(); }, done:function(){ MV.wait(300, n); } }); },
    function(n){ MV.tween({ dur:600, ease:function(s){ return s; }, step:function(s){ H.wave = s; draw(); }, done:function(){ MV.wait(500, n); } }); },
    function(n){ MV.tween({ dur:PD + ST * (N - 1), ease:function(s){ return s; }, step:function(s){ H.lift = s; H.split = 1 - ease(s); draw(); }, done:n }); }
  ];
  (function go(i){ if (i >= seq.length) { done(); return; } seq[i](function(){ go(i + 1); }); })(0);
}
function stroke(ctx, pts, color, width, dash, alpha){
  if (pts.length < 2) return;
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.restore();
}
function dotPx(ctx, x, y, r, color, open){
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (open) { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke(); }
  else { ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css("--sheet"); ctx.stroke(); }
}

// ---------- Explore: Model lab ----------
// @component modelLab (module-specific) — part slots (type menus, + / ×, N9 sliders with locked states), Fit / Leftovers /
//   Forecast views on one canvas (splitPlot), the K10 peel between data and leftovers, G10 forecast zoom, gap bars, sense checks.
function explore(host, api){
  var S = api.S, EX = MV.C.explore, AN = { peel:1, leaving:false, zoom:1, ov:null }, cancels = [], runTok = 0, predDone = null;
  if (!S.set || !CFG[S.set]) loadSet(S, "tea");
  host.innerHTML = '<div class="ml-story" id="ml-story"></div><div class="ml-lab">' +
    '<div class="ml-g" data-mv="graph"><div class="eq-cap ml-cap" id="ml-cap" aria-live="polite"></div><p class="tiny ml-note" id="ml-note" hidden></p>' +
      '<div id="ml-views"></div><div id="ml-lsel"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot" id="ml-plot" role="img" aria-label="Model lab graph"></canvas></div><div id="ml-fore"></div><div class="vh" id="ml-sr"></div></div>' +
    '<div class="ml-c"><div id="ml-set"></div>' +
      '<details class="ml-part" id="ml-d1" open><summary>Part 1</summary><div class="ml-pbody"><label class="ml-sel"><span>Type</span><select id="ml-p1"><option value="lin">Linear</option><option value="exp">Exponential</option></select></label><div id="ml-p1s"></div><div id="ml-p1d"></div></div></details>' +
      '<div id="ml-op" class="ml-op"></div>' +
      '<details class="ml-part" id="ml-d2"><summary>Part 2</summary><div class="ml-pbody"><label class="ml-sel"><span>Type</span><select id="ml-p2"><option value="none">None</option><option value="exp">Exponential</option><option value="wave">Wave</option></select></label><div id="ml-p2s"></div><div id="ml-p2d"></div></div></details>' +
      '<div id="ml-parts"></div></div>' +
    '<div class="ml-r"><dl class="read" id="ml-read" aria-live="polite"></dl></div></div>';
  if (window.matchMedia && window.matchMedia("(min-width: 821px)").matches) $("#ml-d2").open = true;
  var canvas = $("#ml-plot"), plot = new MV.Plot(canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = function(){ draw(); };
  function tc3Solved(){ var c = MV.S.chal && MV.S.chal.tc3; return !!(c && c.solved); }
  function hidden(){ return S.set === "swing" && !tc3Solved(); }
  function stop(){ runTok++; cancels.forEach(function(c){ c(); }); cancels = []; if (predDone) { var d = predDone; predDone = null; d(); } }
  function tw(o){ var c = MV.tween(o); cancels.push(c); return c; }

  // ---- story card and data table ----
  function paintStory(){
    var d = DSET(S.set), ts = times(S.set), h = "<h3>" + d.name + '</h3><p class="ml-storyt">' + d.story + ' <span class="tiny muted">' + EX.idealised + "</span></p>";
    var lab = M(d.letter === "y" ? "y" : d.letter);
    if (S.set === "ferry") {
      var row = function(k){ return [k === 0 ? "Year 1" : "Year " + (k + 1) + " (" + M("t") + " + " + 12 * k + ")"].concat(d.y.slice(12 * k, 12 * k + 12).map(fx1)); };
      var head = [M("t")].concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(String));
      S.year = S.year || 0;
      h += '<div class="ml-tfull">' + MV.tableHTML({ head:head, rows:[row(0), row(1), row(2)], caption:"Ferry readings" }) + "</div>" +
        '<div class="ml-tyear"><div id="ml-yr"></div>' + MV.tableHTML({ head:head, rows:[row(S.year)], caption:"Ferry readings, year " + (S.year + 1) }) + "</div>";
    } else h += MV.tableHTML({ head:[M("t")].concat(ts.map(num)), rows:[[lab].concat(d.y.map(fx1))], caption:d.name + " readings" });
    $("#ml-story").innerHTML = h;
    if (S.set === "ferry") radios($("#ml-yr"), { label:"Show", aria:"Year", cls:"seg", value:S.year, options:[{ id:0, t:"Year 1" }, { id:1, t:"Year 2" }, { id:2, t:"Year 3" }], onChange:function(v){ S.year = +v; api.save(); paintStory(); var b = $('#ml-yr [data-rg="' + v + '"]'); if (b) b.focus(); } });
  }

  // ---- controls ----
  var rgSet = radios($("#ml-set"), { label:"Data set", aria:"Data set", value:S.set,
    options:SETS.map(function(id){ return { id:id, t:function(){ return DSET(id).name + (id === "swing" && !S.unlocked ? ' <small class="ml-lockt">' + EX.locked + "</small>" : ""); } }; }),
    onChange:function(v){ stop(); loadSet(S, v); AN = { peel:1, leaving:false, zoom:1, ov:null }; api.save(); paintAll(); } });
  var rgView = radios($("#ml-views"), { aria:"View", cls:"seg ml-tabs", value:S.view, options:[{ id:"fit", t:"Fit" }, { id:"left", t:"Leftovers" }, { id:"fore", t:"Forecast" }], onChange:function(v){ userChange(); setView(v); } });
  var rgLeft = null;
  var rgOp = radios($("#ml-op"), { label:"Operation", aria:"Operation", value:S.op, options:[{ id:"add", t:"+ add" }, { id:"mul", t:"× multiply" }], onChange:function(v){ S.op = v; userChange(); paintSliders("p2"); update(); } });
  var rgParts = radios($("#ml-parts"), { label:"Show the parts", aria:"Show the parts", value:S.parts ? "on" : "off", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], onChange:function(v){ S.parts = v === "on"; userChange(); update(); } });
  $("#ml-p1").addEventListener("change", function(e){ S.p1 = e.target.value; userChange(); paintSliders("p1"); update(); });
  $("#ml-p2").addEventListener("change", function(e){ S.p2 = e.target.value; userChange(); paintSliders("p2"); update(); });
  function userChange(){ if (S.note) { S.note = null; paintNote(); } AN.ov = null; }
  function paintNote(){ var n = $("#ml-note"); n.hidden = !S.note; n.innerHTML = S.note || ""; }

  function defs(part){
    var R = CFG[S.set].rng, d = DSET(S.set), type = part === "p1" ? S.p1 : S.p2, lock = part === "p2" && S.op === "mul", e = part === "p1" ? "e1" : "e2";
    if (type === "lin") return [{ id:"lin.m", lab:M("m") + ": change per " + d.tOne, r:R.m }, { id:"lin.b", lab:M("b") + ": value at " + M("t = 0"), r:R.b }];
    if (type === "exp") return [{ id:e + ".A", lab:M("A") + ": value at " + M("t = 0"), r:R.A, lock:lock }, { id:e + ".h", lab:M("h") + ": " + (S[e].dir === "half" ? "halving" : "doubling") + " time", r:R.h, unit:true }];
    if (type === "wave") return [{ id:"wave.a", lab:M("@a{a}") + ": amplitude", r:R.a, col:"--acol", lock:lock }, { id:"wave.T", lab:M("@k{T}") + ": period", r:R.T, col:"--p-k", isT:true },
      { id:"wave.d", lab:M("@d{d}") + ": time of a peak", r:[0, Math.max(0, +(S.wave.T - R.ds).toFixed(4)), R.ds], col:"--p-d" }];
    return [];
  }
  function getP(id){ var k = id.split("."); return S[k[0]][k[1]]; }
  function setP(id, v){ var k = id.split("."); S[k[0]][k[1]] = v; }
  function outTxt(df, v){
    if (df.lock) return "1";
    if (df.isT) { var k = kInfo(v, false); return num(v) + ' <span class="ml-ou">' + DSET(S.set).tUnit + "</span> · " + M("@k{k} = @k{" + k.s + "}"); }
    if (df.unit) return num(v) + ' <span class="ml-ou">' + DSET(S.set).tUnit + "</span>";
    return num(v);
  }
  function paintSliders(part){
    var hostS = $("#ml-" + part + "s"), hostD = $("#ml-" + part + "d"), list = defs(part), type = part === "p1" ? S.p1 : S.p2;
    $("#ml-" + part).value = type;
    hostS.innerHTML = list.map(function(df){
      var col = df.col ? "var(" + df.col + ")" : "var(--ink)", v = df.lock ? 1 : getP(df.id), key = df.id.replace(".", "-");
      return '<label class="slider ml-sl' + (df.lock ? " ml-locked" : "") + '"><span class="slider-top"><span>' + df.lab + '</span><output id="ml-o-' + key + '" style="color:' + col + '">' + outTxt(df, v) + "</output></span>" +
        '<input type="range" id="ml-s-' + key + '" data-sl="' + df.id + '" min="' + df.r[0] + '" max="' + df.r[1] + '" step="' + df.r[2] + '" value="' + v + '" style="accent-color:' + col + '"' + (df.lock ? " disabled" : "") + "></label>" +
        (df.lock ? '<p class="tiny muted ml-locknote">' + EX.productNote + "</p>" : "");
    }).join("") || '<p class="tiny muted">' + EX.noneYet + "</p>";
    hostD.innerHTML = "";
    if (type === "exp") {
      var e = part === "p1" ? "e1" : "e2";
      hostD.innerHTML = "<div></div>";
      radios(hostD.firstChild, { label:"Direction", aria:"Direction", value:S[e].dir, options:[{ id:"half", t:"Halves" }, { id:"double", t:"Doubles" }], onChange:function(v){ S[e].dir = v; userChange(); paintSliders(part); update(); } });
    }
  }
  $(".ml-c", host).addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id) return;
    var v = +e.target.value; setP(id, v); userChange();
    var df = defs("p1").concat(defs("p2")).filter(function(x){ return x.id === id; })[0];
    var o = $("#ml-o-" + id.replace(".", "-")); if (o && df) o.innerHTML = outTxt(df, v);
    if (id === "wave.T") {
      var R = CFG[S.set].rng, dmax = Math.max(0, +(v - R.ds).toFixed(4)), dIn = $("#ml-s-wave-d");
      if (S.wave.d > dmax + 1e-9) S.wave.d = 0;
      if (dIn) { dIn.max = dmax; dIn.value = S.wave.d; var od = $("#ml-o-wave-d"); if (od) od.innerHTML = num(S.wave.d); }
    }
    update();
  });

  // ---- views ----
  function paintViewCtl(){
    rgView.set(S.view);
    var ls = $("#ml-lsel"), fo = $("#ml-fore");
    if (S.view === "left") {
      if (!ls.firstChild) { ls.innerHTML = "<div></div>"; rgLeft = radios(ls.firstChild, { label:"Leftovers", aria:"Which leftovers", cls:"chips ml-chiprow", value:S.left, options:[{ id:"p1", t:"After Part 1" }, { id:"whole", t:"After the whole model" }], onChange:function(v){ S.left = v; userChange(); api.save(); stop(); AN.peel = 0; runPeel(); paintRead(); } }); }
      else rgLeft.set(S.left);
    } else { ls.innerHTML = ""; rgLeft = null; }
    if (S.view === "fore") {
      var F = CFG[S.set].fore;
      if (!fo.firstChild) {
        fo.innerHTML = '<label class="slider ml-sl"><span class="slider-top"><span>Forecast time</span><output id="ml-o-fore">' + num(S.fore) + " " + DSET(S.set).tUnit + '</output></span><input type="range" id="ml-s-fore" min="' + F.lo + '" max="' + F.tmax + '" step="' + F.step + '" value="' + S.fore + '" style="accent-color:var(--ink)"></label>';
        $("#ml-s-fore").addEventListener("input", function(e){ S.fore = +e.target.value; $("#ml-o-fore").textContent = num(S.fore) + " " + DSET(S.set).tUnit; userChange(); update(); });
      }
    } else fo.innerHTML = "";
  }
  function runPeel(back, done){
    var N = DSET(S.set).y.length, D = 900 + 20 * (N - 1);
    tw({ dur:D, ease:function(s){ return s; }, step:function(s){ AN.peel = back ? 1 - s : s; draw(); }, done:function(){ AN.peel = back ? 0 : 1; draw(); if (done) done(); } });
  }
  function setView(v, done, keep){
    var from = S.view; if (!keep) stop(); AN.leaving = false;
    if (v === from) { AN.peel = 1; AN.zoom = 1; paintViewCtl(); paintRead(); draw(); if (done) done(); return; }
    var after = function(){
      AN.leaving = false; S.view = v; api.save(); paintViewCtl(); paintRead();
      if (v === "left") { AN.peel = 0; draw(); runPeel(false, done); }
      else if (v === "fore") { AN.zoom = 0; draw(); tw({ dur:800, step:function(s){ AN.zoom = s; draw(); }, done:function(){ AN.zoom = 1; draw(); if (done) done(); } }); }
      else { draw(); if (done) done(); }
    };
    if (from === "left") { AN.leaving = true; S.view = v; paintViewCtl(); S.view = from; runPeel(true, after); }
    else after();
  }

  // ---- drawing ----
  function draw(){
    var L = S, d = DSET(L.set), cf = CFG[L.set], ts = times(L.set), ys = d.y, N = ts.length, t0 = ts[0], tEnd = ts[N - 1];
    var split = L.view === "left" || AN.leaving, fore = L.view === "fore" && !AN.leaving;
    canvas.classList.toggle("ml-tall", split);
    plot.draw({ grid:false, axes:false, describe:describe(), after:function(ctx, pl){
      var z = fore ? ease(AN.zoom) : 0, pad = (tEnd - t0) * 0.03, F = cf.fore;
      var ymin0 = cf.view.ymin;
      if (L.parts && L.op === "add" && L.p2 !== "none") for (var q = 0; q <= 80; q++) { var vq = p2V(L, t0 + (tEnd - t0) * q / 80); if (isFinite(vq)) ymin0 = Math.min(ymin0, Math.floor(vq - 1)); }
      ymin0 = Math.max(ymin0, cf.view.ymin - (cf.view.ymax - cf.view.ymin) * 0.4);
      var view = { xmin:t0 - pad, xmax:lerp(tEnd + pad, F.tmax + (F.tmax - t0) * 0.03, z), ymin:lerp(ymin0, F.ymin, z), ymax:lerp(cf.view.ymax, F.ymax, z) };
      var Ly = layout(pl, split, 0.55), P = panel(pl, Ly.top, view, { xTitle:cf.xT, yTitle:cf.yT });
      P.frame();
      var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2");
      var f1 = function(t){ return p1V(L, t); }, f2 = function(t){ return p2V(L, t); }, fm = function(t){ return modelV(L, t); };
      if (fore) {
        P.vband(t0, tEnd, css("--hi-soft"));
        P.text(t0, view.ymax, "your data", { dx:6, dy:24, color:ink, font:"600 12px " + pl.fontUI });
        P.hline(F.line, { color:ink2, dash:[6, 6], label:F.lab, below:F.line > (view.ymin + view.ymax) / 2 });
      }
      if (L.parts && !fore) {
        if (L.op === "mul") { P.curve(f1, { color:pen, width:2, dash:[6, 6] }); P.curve(function(t){ return -f1(t); }, { color:pen, width:2, dash:[6, 6] }); }
        else { P.curve(f1, { color:pen, width:2.6 }); if (L.p2 !== "none") P.curve(f2, { color:ink, width:2, dash:[10, 6] }); }
      }
      if (fore) { P.curve(fm, { color:ink, width:3.4, to:tEnd }); P.curve(fm, { color:ink, width:3, dash:[8, 6], from:tEnd }); }
      else P.curve(fm, { color:ink, width:3.4 });
      if (!fore) ts.forEach(function(t, i){ var m = fm(t); if (isFinite(m)) P.gapBar(t, ys[i], m, Math.abs(ys[i] - m) > 1 + 1e-9); });
      ts.forEach(function(t, i){ P.dot(t, ys[i]); });
      if (fore && AN.zoom >= 1) { var fv = fm(L.fore); P.vline(L.fore, { color:ink2, dash:[3, 4], width:1.2 }); P.dot(L.fore, clamp(fv, view.ymin, view.ymax), { r:6, ring:true }); }
      overlayTop(P, pl);
      if (!split) return;
      // ---- the leftovers strip ----
      var mode = L.left, lo = leftovers(L, mode), mul = L.op === "mul" && mode === "p1";
      var hideWhole = mode === "whole" && hidden(), vals = lo.pts.map(function(p){ return Math.abs(p.v); });
      if (mode === "p1" && L.p2 !== "none") for (var k = 0; k <= 60; k++) { var tk = t0 + (tEnd - t0) * k / 60, vk = mul ? p2V(L, tk) : f2(tk); if (isFinite(vk)) vals.push(Math.abs(vk)); }
      var Rr = Math.min(150, niceCeil(Math.max(mode === "whole" ? 2 : mul ? 1.5 : 1, Math.max.apply(null, vals.concat([0.5])) * 1.12)));
      var Q = panel(pl, Ly.strip, { xmin:view.xmin, xmax:view.xmax, ymin:-Rr, ymax:Rr }, { yTitle:mode === "whole" ? "data − model" : mul ? "data ÷ Part 1" : "data − Part 1" });
      Q.frame();
      var s = AN.peel, se = ease(s), Dtot = 900 + 20 * (N - 1);
      if (hideWhole) { Q.text((view.xmin + view.xmax) / 2, 0, MV.plain(EX.fit.hidden), { align:"center", dy:-16, bg:true, color:ink2 }); return; }
      if (mode === "whole") Q.hband(-1, 1, css("--hi-soft"), se);
      if (s >= 1 && mode === "p1" && L.p2 !== "none") Q.curve(f2, { color:ink, width:2, dash:[10, 6] });
      // the part that flattens: Part 1 onto 0 (+) or onto ±1 (×); the whole model onto 0
      var flat = function(f, target, color, dash, width){
        var pts = []; for (var j = 0; j <= 200; j++) { var t = view.xmin + (view.xmax - view.xmin) * j / 200, y = f(t); if (!isFinite(y)) continue; pts.push([P.X(t), lerp(clamp(P.Y(y), -2000, 4000), Q.Y(target), se)]); }
        ctx.save(); ctx.beginPath(); ctx.rect(Ly.top.x, Ly.top.y, Ly.top.w, Ly.strip.y + Ly.strip.h - Ly.top.y); ctx.clip(); stroke(ctx, pts, color, width, dash, 1); ctx.restore();
      };
      if (mode === "whole") flat(fm, 0, ink, null, 2.4);
      else if (mul) { flat(f1, 1, pen, [6, 6], 2); flat(function(t){ return -f1(t); }, -1, pen, [6, 6], 2); }
      else flat(f1, 0, pen, null, 2.4);
      lo.pts.forEach(function(p, n){
        var sk = ease((s * Dtot - 20 * p.i) / 900), x = P.X(p.t), yA = P.Y(ys[p.i]), vv = clamp(p.v, -Rr, Rr), yB = Q.Y(vv), off = vv !== p.v;
        dotPx(ctx, x, lerp(yA, yB, sk), 4.2, ink, off && sk >= 1);
        void n;
      });
      if (AN.ov && AN.ov.brackets) brackets(Q, pl, Rr, AN.ov.brackets);
    } });
  }
  function brackets(Q, pl, Rr, a){
    var ctx = Q.ctx, hi = css("--hi"), y = Q.Y(Rr) + 14;
    [[6, 18], [18, 30]].forEach(function(b){
      var x0 = Q.X(b[0]), x1 = Q.X(b[1]);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = hi; ctx.lineWidth = 3; ctx.beginPath();
      ctx.moveTo(x0, y + 6); ctx.lineTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1, y + 6); ctx.stroke(); ctx.restore();
      Q.text((b[0] + b[1]) / 2, Q.yOf(y), "12 months", { align:"center", dy:0, alpha:a, bg:true, font:"600 12px " + pl.fontUI });
    });
  }
  function overlayTop(P, pl){
    var ov = AN.ov; if (!ov) return;
    var ctx = P.ctx, ink = css("--ink"), pen = css("--pen");
    (ov.bars || []).forEach(function(b){
      var x = P.X(b.t) + (b.dx || 0), a = P.Y(b.y0), c = P.Y(lerp(b.y0, b.y1, b.s == null ? 1 : b.s)), hw = b.kind === "trend" ? 7 : 4;
      ctx.save(); ctx.globalAlpha = 0.92; ctx.fillStyle = b.kind === "trend" ? css("--hi-soft") : css("--hi"); ctx.fillRect(x - hw, Math.min(a, c), 2 * hw, Math.abs(c - a));
      ctx.lineWidth = 2; ctx.strokeStyle = b.kind === "trend" ? pen : ink; ctx.strokeRect(x - hw, Math.min(a, c), 2 * hw, Math.abs(c - a)); ctx.restore();
    });
    (ov.bars || []).forEach(function(b){ if (b.label && !b.quiet && (b.s == null || b.s >= 1)) P.text(b.t, b.ly, b.label, { align:"right", dx:(b.dx || 0) - 12, bg:true, font:"600 13px " + pl.fontUI }); });
    if (ov.marker) { var mk = ov.marker; P.vline(mk.t, { color:css("--ink-2"), dash:[3, 4], width:1.4 }); P.dot(mk.t, mk.y, { r:6, ring:true }); if (mk.label) P.text(mk.t, mk.y, mk.label, { align:mk.t > 24 ? "right" : "left", dx:mk.t > 24 ? -14 : 14, dy:-20, bg:true }); }
    if (ov.best) P.dot(ov.best.t, ov.best.y, { r:7, open:true, color:ink });
    if (ov.runner) P.dot(ov.runner.t, ov.runner.y, { r:6, ring:true });
    if (ov.cross) { P.dot(ov.cross.t, 20, { r:6, open:true }); P.text(ov.cross.t, 20, ov.cross.label, { dx:10, dy:-16, bg:true }); }
    if (ov.gap) { P.gapBar(ov.gap.t, ov.gap.y0, lerp(ov.gap.y0, ov.gap.y1, ov.gap.s), true); if (ov.gap.s >= 1) P.text(ov.gap.t, (ov.gap.y0 + ov.gap.y1) / 2, ov.gap.label, { align:"right", dx:-10, bg:true }); }
  }
  function describe(){
    var L = S, d = DSET(L.set), st = gapStats(L), h = hidden();
    var txt = d.name + " data, " + st.N + " readings. Model " + MV.plain(M(capSrc(L))) + ".";
    if (!h) txt += " Largest gap " + fx1(st.max) + " " + d.unit + " at t = " + num(st.at) + ". Gaps of 1 or less: " + st.n + " of " + st.N + ".";
    if (L.view === "left") { var lo = leftovers(L, L.left), vs = lo.pts.map(function(p){ return p.v; }); if (!(L.left === "whole" && h) && vs.length) txt += " Leftovers " + (L.left === "whole" ? "after the whole model" : "after Part 1") + " from " + fx1(Math.min.apply(null, vs)) + " to " + fx1(Math.max.apply(null, vs)) + "."; }
    if (L.view === "fore") txt += " Forecast at t = " + num(L.fore) + ": " + fx1(modelV(L, L.fore)) + " " + d.unit + ".";
    return txt;
  }
  function syncSR(){
    var L = S, ts = times(L.set), ys = DSET(L.set).y, h = hidden(), lo = leftovers(L, "p1"), byI = {};
    lo.pts.forEach(function(p){ byI[p.i] = p.v; });
    $("#ml-sr").innerHTML = "<table><caption>Data, model and leftovers</caption><thead><tr><th>t</th><th>reading</th><th>model</th>" + (h ? "" : "<th>gap</th>") + "<th>leftover after Part 1</th></tr></thead><tbody>" +
      ts.map(function(t, i){ var m = modelV(L, t); return "<tr><td>" + num(t) + "</td><td>" + fx1(ys[i]) + "</td><td>" + fx1(m) + "</td>" + (h ? "" : "<td>" + fx1(Math.abs(ys[i] - m)) + "</td>") + "<td>" + (byI[i] == null ? "none" : num(byI[i], 2)) + "</td></tr>"; }).join("") + "</tbody></table>";
  }

  // ---- readout ----
  function p1Text(){
    var L = S, d = DSET(L.set);
    if (L.op === "mul") return "Envelope: sets the size of the swings.";
    if (L.p1 === "lin") { var m = L.lin.m, b = L.lin.b; return m === 0 ? "Level at " + num(b) + "." : "Trend: starts at " + num(b) + " and " + (m > 0 ? "rises " : "falls ") + num(Math.abs(m)) + " per " + d.tOne + "."; }
    return "Starts at " + num(L.e1.A) + " and " + (L.e1.dir === "half" ? "halves" : "doubles") + " every " + every(L, L.e1.h) + ".";
  }
  function p2Text(){
    var L = S, w = L.wave, e = L.e2, mul = L.op === "mul";
    if (L.p2 === "none") return EX.noneYet;
    if (L.p2 === "wave") return mul ? "Wave: repeats every " + every(L, w.T) + ", peaks at " + peaksTxt(L) + "; its size comes from Part 1." : "Wave: " + num(w.a) + " above and below, repeats every " + every(L, w.T) + ", peaks at " + peaksTxt(L) + ".";
    var dv = e.dir === "half" ? "halves" : "doubles";
    return mul ? "Multiplies by " + M(expSrc(e, true)) + ": " + dv + " every " + every(L, e.h) + "; its size comes from Part 1." : "Adds " + M(expSrc(e)) + ": starts at " + num(e.A) + ", " + dv + " every " + every(L, e.h) + ".";
  }
  function senseTxt(){
    var L = S, t = L.fore, v = modelV(L, t), sc = EX.sense;
    if (L.set === "tea") return v < 19.5 ? sc.teaLow : v > 84.5 ? sc.teaHigh : Math.abs(v - 20) <= 0.5 ? sc.teaRoom : sc.teaMid;
    if (L.set === "ferry") {
      if (v < 0) return sc.ferryNeg;
      var m = L.p1 === "lin" ? L.lin.m : Math.round((p1V(L, 35) - p1V(L, 0)) / 35 * 10) / 10;
      if (m === 0) return sc.ferryFlat;
      var s = fill(sc.ferryGrow, { m:num(Math.abs(m)), yrs:fx1((t - 35) / 12) });
      return m < 0 ? s.replace("keeps adding", "keeps losing") : s;
    }
    if (L.set === "spring") return Math.abs(v) > 24.5 ? sc.springBig : (L.p1 !== "exp" && L.p2 !== "exp") ? sc.springNoFade : sc.springOk;
    var env = L.op === "mul" && L.p2 !== "none" ? Math.abs(p1V(L, 24)) : L.p2 === "wave" && L.op === "add" ? Math.abs(p1V(L, 24)) + Math.abs(L.wave.a) : Math.abs(v);
    return fill(sc.swing, { env:fx1(env) });
  }
  function paintRead(){
    var L = S, d = DSET(L.set), st = gapStats(L), h = hidden(), hid = EX.fit.hidden, rows = [];
    rows.push(["Data", d.name + ": " + d.what + ", " + st.N + " readings"]);
    rows.push(["Model", M(capSrc(L))]);
    rows.push(["Part 1", p1Text()]);
    rows.push(["Part 2", p2Text()]);
    rows.push(["Largest gap", h ? hid : fx1(st.max) + " " + d.unit + " at " + M("t = " + src(st.at)) + (L.set === "ferry" ? " (" + monthYear(st.at) + ")" : "")]);
    rows.push(["Gaps of 1 " + d.unit + " or less", h ? hid : st.n + " of " + st.N + " readings"]);
    rows.push(["Fit", h ? hid : st.max <= 1 + 1e-9 ? EX.fit.close : st.max <= 3 + 1e-9 ? fill(EX.fit.near, { t1:num(st.top2[0]), t2:num(st.top2[1]) }) : EX.fit.far]);
    if (L.view === "left") {
      var lo = leftovers(L, L.left), vs = lo.pts.map(function(p){ return p.v; }), rng = vs.length ? "from " + fx1(Math.min.apply(null, vs)) + " to " + fx1(Math.max.apply(null, vs)) : "none";
      var txt = L.left === "whole" ? (h ? hid : "After the whole model: " + rng + ", " + vs.filter(function(v){ return Math.abs(v) <= 1 + 1e-9; }).length + " of " + st.N + " inside the band") : "After Part 1: " + rng;
      if (L.left === "p1" && lo.zero.length) txt += ". " + fill(EX.zeroNote, { list:lo.zero.map(num).join(", ") });
      rows.push(["Leftovers", txt]);
    }
    if (L.view === "fore") {
      rows.push(["Forecast", M(d.letter + "(" + src(L.fore) + ")") + " = " + fx1(modelV(L, L.fore)) + " " + d.unit]);
      rows.push(["Sense check", senseTxt()]);
    }
    $("#ml-read").innerHTML = MV.readoutHTML(rows);
    syncSR();
  }
  function update(){ $("#ml-cap").innerHTML = M(capSrc(S)); draw(); paintRead(); api.save(); MV.changed(); }
  function paintAll(){
    rgSet.off(S.unlocked ? [] : ["swing"]); rgSet.repaint(); rgSet.set(S.set);
    rgOp.set(S.op); rgParts.set(S.parts ? "on" : "off");
    paintStory(); paintSliders("p1"); paintSliders("p2"); paintViewCtl(); paintNote(); update();
  }
  paintAll();

  // ---- challenge set-ups (buttons inside the challenge prompts) and TC2's "Predict your fit" chips ----
  var chal = $("#chal");
  function syncChal(){
    if (!chal) return;
    var guessHost = chal.querySelector("[data-guess-host]"), locked = !!S.tc2checked;
    if (guessHost) {
      $$("[data-guess]", guessHost).forEach(function(b){ var on = S.guess === b.dataset.guess; if (b.getAttribute("aria-pressed") !== String(on)) b.setAttribute("aria-pressed", String(on)); if (b.classList.contains("on") !== on) b.classList.toggle("on", on); if (b.disabled !== locked) b.disabled = locked; });
      var res = chal.querySelector("[data-guessres]"), want = S.tc2last ? fill(EX.guess.line, { guess:S.guess ? EX.guess[S.guess] : "none chosen", gap:fx1(S.tc2last) }) : "";
      if (want && !res) guessHost.insertAdjacentHTML("afterend", '<span class="tiny ml-guessres" data-guessres>' + want + "</span>");
      else if (res && res.textContent !== MV.plain(want)) res.textContent = MV.plain(want);
    }
    if (syncChal.lastSolved !== tc3Solved()) { syncChal.lastSolved = tc3Solved(); paintRead(); draw(); }
  }
  if (chal) {
    chal.addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.tcload) {
        var id = { tc1:"tea", tc2:"ferry", tc3:"swing" }[b.dataset.tcload];
        if (b.dataset.tcload === "tc3") S.unlocked = true;
        stop(); loadSet(S, id); AN = { peel:1, leaving:false, zoom:1, ov:null }; api.save(); paintAll();
        var g = $("#ml-cap"); if (g && g.scrollIntoView) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
      } else if (b.dataset.guess && !S.tc2checked) { S.guess = b.dataset.guess; api.save(); syncChal(); }
    });
    new MutationObserver(syncChal).observe(chal, { childList:true, subtree:true });
  }

  // ---- predictions ----
  function startState(p){
    stop(); AN = { peel:1, leaving:false, zoom:1, ov:null };
    if (p.id === "p1") { loadSet(S, "ferry"); S.p1 = "lin"; S.lin = { m:0.5, b:20 }; S.p2 = "none"; }
    else if (p.id === "p2") { loadSet(S, "ferry"); S.p1 = "lin"; S.lin = { m:0.5, b:20 }; S.p2 = "wave"; S.wave = { a:5, T:12, d:6 }; S.parts = true; }
    else if (p.id === "p3") { loadSet(S, "spring"); S.p1 = "exp"; S.e1 = { A:24, h:2, dir:"half" }; S.op = "mul"; S.p2 = "none"; S.parts = true; }
    else if (p.id === "p4") { loadSet(S, "tea"); S.note = p.note; }
    paintAll();
  }
  function runPred(p, done){
    var L = S, tok = ++runTok, fm = function(t){ return modelV(L, t); };
    predDone = done;
    var fin = function(){ if (tok !== runTok) return; predDone = null; done(); };
    var live = function(fn){ return function(){ if (tok === runTok) fn.apply(null, arguments); }; };
    var pause = function(ms, fn){ MV.wait(ms, live(fn)); };
    var chain = function(steps){ (function go(i){ if (tok !== runTok) return; if (i >= steps.length) { fin(); return; } steps[i](live(function(){ go(i + 1); })); })(0); };
    if (p.id === "p1") { S.left = "p1"; chain([function(n){ setView("left", n, true); }, function(n){ tw({ dur:500, step:function(s){ AN.ov = { brackets:s }; draw(); }, done:n }); }]); return; }
    if (p.id === "p3") { S.left = "p1"; chain([function(n){ setView("left", n, true); }]); return; }
    if (p.id === "p2") {
      var bars = [], grow = function(b, dur, wait){ return function(n){ if (b.t === 30) bars.forEach(function(o){ o.quiet = true; }); bars.push(b); tw({ dur:dur, step:function(s){ b.s = s; AN.ov = { bars:bars }; draw(); }, done:function(){ pause(wait, n); } }); }; };
      chain([
        grow({ t:35, y0:0, y1:37.5, kind:"trend", s:0, label:"trend: 37.5", ly:37.5, dx:-6 }, 600, 0),
        grow({ t:35, y0:37.5, y1:fm(35), kind:"wave", s:0, label:"wave: −4.3, so 33.2", ly:30.5, dx:-6 }, 500, 900),
        grow({ t:30, y0:0, y1:35, kind:"trend", s:0, label:"trend: 35", ly:33, dx:0 }, 600, 0),
        grow({ t:30, y0:35, y1:40, kind:"wave", s:0, label:"wave: +5, so 40", ly:41.5, dx:0 }, 500, 700),
        function(n){
          var best = { t:0, y:fm(0) }; bars.forEach(function(o){ o.quiet = true; });
          tw({ dur:2200, ease:function(s){ return s; }, step:function(s){ var t = Math.min(35, Math.floor(s * 36)); for (var k = 0; k <= t; k++) if (fm(k) > best.y + 1e-9) best = { t:k, y:fm(k) };
            AN.ov = { bars:bars, runner:{ t:t, y:fm(t) }, best:best, marker:{ t:best.t, y:best.y, label:"largest so far: " + fx1(best.y) } }; draw(); },
            done:function(){ bars.forEach(function(o){ o.quiet = true; }); AN.ov = { bars:bars, marker:{ t:30, y:40, label:"largest: 40 (July, year 3)" } }; draw(); n(); } });
        }
      ]);
      return;
    }
    if (p.id === "p4") {
      chain([
        function(n){ tw({ dur:1300, ease:function(s){ return s; }, step:function(s){ var t = 60 * s; AN.ov = { runner:{ t:t, y:fm(t) } }; draw(); }, done:n }); },
        function(n){ tw({ dur:600, step:function(s){ AN.ov = { runner:{ t:60, y:fm(60) }, gap:{ t:60, y0:fm(60), y1:21.0, s:s, label:"15.8 °C" } }; draw(); }, done:function(){ pause(700, n); } }); },
        function(n){ AN.ov = null; S.fore = 90; setView("fore", n, true); },
        function(n){ AN.ov = { cross:{ t:15 * Math.log(4.2) / Math.LN2, label:"crosses 20 °C at about t = 31" } }; draw(); n(); }
      ]);
      return;
    }
    fin();
  }

  // ---- target challenges ----
  function isLinWave(add){ return S.p1 === "lin" && S.p2 === "wave" && (add ? S.op === "add" : S.op === "mul"); }
  function challenge(id, opt){
    var L = S, st = gapStats(L), ok = st.max <= 1 + 1e-9, F = EX.fb[id];
    if (id === "tc1") {
      if (L.set !== "tea") return { ok:false, msg:F.set };
      var right = L.p1 === "lin" && L.lin.m === 0 && L.lin.b === 20 && L.op === "add" && L.p2 === "exp" && L.e2.dir === "half";
      if (ok && right) return { ok:true };
      if (L.p1 === "exp" && L.p2 === "none") return { ok:false, msg:F.expOnly };
      if (ok && L.p1 === "lin" && L.lin.m !== 0) return { ok:false, msg:fill(F.drift, { m:num(L.lin.m), v180:fx1(modelV(L, 180)) }) };
      var linExp = L.p1 === "lin" && L.op === "add" && L.p2 === "exp" && L.lin.m === 0;
      if (linExp && L.lin.b !== 20 && L.e2.dir === "half") return { ok:false, msg:L.lin.b === 21 ? F.level21 : fill(F.level, { b:num(L.lin.b) }) };
      if (linExp && L.e2.dir === "double") return { ok:false, msg:F.doubles };
      if (linExp && L.lin.b === 20) return { ok:false, msg:fill(F.close, { gap:fx1(st.max), at:num(st.at) }) };
      return { ok:false, msg:F.other };
    }
    if (id === "tc2") {
      if (L.set !== "ferry") return { ok:false, msg:F.set };
      if (!opt || !opt.live) { S.tc2checked = true; S.tc2last = st.max; api.save(); setTimeout(syncChal, 0); }
      if (ok) return { ok:true };
      if (L.p2 === "none") return { ok:false, msg:F.none };
      if (isLinWave(true) && L.wave.T !== 12) return { ok:false, msg:fill(F.period, { T:num(L.wave.T) }) };
      if (isLinWave(true) && L.wave.d !== 6) return { ok:false, msg:fill(F.peak, { d:num(L.wave.d), month:MONTHS[L.wave.d % 12] }) };
      if (isLinWave(true) && L.wave.a >= 8) return { ok:false, msg:fill(F.amp, { a:num(L.wave.a) }) };
      if (isLinWave(false)) return { ok:false, msg:F.times };
      if (isLinWave(true) && (L.lin.m !== 0.5 || L.lin.b !== 20)) {
        var lo = leftovers(L, "p1").pts, mean = function(a, b){ var s = 0, n = 0; lo.forEach(function(p){ if (p.t >= a && p.t <= b) { s += p.v; n++; } }); return s / n; };
        return { ok:false, msg:fill(F.trend, { dir:mean(24, 35) > mean(0, 11) ? "upward" : "downward" }) };
      }
      return { ok:false, msg:fill(F.other, { gap:fx1(st.max), at:num(st.at) }) };
    }
    if (id === "tc3") {
      if (L.set !== "swing") return { ok:false, msg:F.set };
      if (ok) return { ok:true };
      if (L.p1 === "exp" && L.op === "mul" && L.p2 === "wave") return { ok:false, msg:F.expWave };
      if (isLinWave(true)) return { ok:false, msg:F.add };
      if (isLinWave(false)) {
        var w = L.wave, m = L.lin.m, b = L.lin.b;
        if (w.T === 2) return { ok:false, msg:F.half };
        if (w.T === 4 && w.d === 0 && b === 6 && m === 6) return { ok:false, msg:F.m6 };
        if (w.T === 4 && w.d === 2 && m > 0 && b > 0) return { ok:false, msg:fill(F.flip, { b:num(b) }) };
        if (b === 0) return { ok:false, msg:F.b0 };
      }
      return { ok:false, msg:F.other };
    }
    return { ok:false };
  }

  return { predict:{ start:startState, run:runPred }, challenge:challenge };
}

// ---------- Part 3: the crossing finder ----------
var CF = {
  s1:{ f:function(t){ return 0.5 * t + 20 + 5 * Math.cos(PI / 6 * (t - 6)); }, g:function(){ return 39; }, win:{ xmin:0, xmax:35, ymin:0, ymax:45 }, from:24, to:35, dp:[1, 2, 3] },
  s2:{ f:function(t){ return 500 * Math.pow(2, t / 4); }, g:function(t){ return 1000 + 150 * t; }, win:{ xmin:0, xmax:12, ymin:0, ymax:4500 }, from:0, to:12, dp:[1, 1, 2] },
  s3:{ f:function(x){ return Math.cos(x); }, g:function(x){ return x / 2; }, win:{ xmin:-4, xmax:4, ymin:-2.2, ymax:2.2 }, from:-4, to:4, dp:[2, 3, 3] },
  s4:{ f:function(x){ return x * x * x; }, g:function(x){ return Math.pow(3, x); }, win:{ xmin:-2, xmax:5, ymin:-10, ymax:130 }, from:-2, to:5, dp:[1, 2, 3] }
};
var IDS = ["s1", "s2", "s3", "s4"];
function hOf(id){ var c = CF[id]; return function(x){ return c.f(x) - c.g(x); }; }
function findRoots(id){
  var c = CF[id], h = hOf(id), w = c.win, n = 4000, out = [], x0 = w.xmin, h0 = h(x0);
  for (var i = 1; i <= n; i++) {
    var x1 = w.xmin + (w.xmax - w.xmin) * i / n, h1 = h(x1);
    if (h0 === 0) out.push(x0);
    else if ((h0 > 0) !== (h1 > 0) && h1 !== 0) { var a = x0, b = x1, fa = h0; for (var k = 0; k < 80; k++) { var m = (a + b) / 2, fm = h(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; } out.push((a + b) / 2); }
    x0 = x1; h0 = h1;
  }
  return out.map(function(r){ return Math.abs(r - Math.round(r)) < 1e-7 ? Math.round(r) : r; });
}
IDS.forEach(function(id){ CF[id].roots = findRoots(id); CF[id].brackets = CF[id].roots.filter(function(r){ return r !== Math.round(r); }).map(function(r){ return Math.floor(r); }); });
function fxd(v, dp){ var r = Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp); if (r === 0) r = 0; return (r < 0 ? MINUS : "") + Math.abs(r).toFixed(dp); }
function fmtH(v, dp){ if (Math.abs(v) < 1e-12) return "0"; var d = dp; while (d < 6 && Math.round(Math.abs(v) * Math.pow(10, d)) === 0) d++; return num(v, d); }
function xsOf(a, n, div){ var out = []; for (var i = 0; i <= n; i++) out.push(Math.round(a * div + i) / div); return out; }

function part3(host, api){
  var S = api.S, P3 = MV.C.part3, TX = P3.steps; S.cur = S.cur || "s1"; S.cards = S.cards || {};
  var msg = {}, anim = { reveal:{}, pulse:0 }, views = {}, last = {};
  function card(){ return P3.cards.filter(function(c){ return c.id === S.cur; })[0]; }
  function cs(id){ id = id || S.cur; return S.cards[id] || (S.cards[id] = { step:1, marks:[], probe:null, st:{}, hund:{ open:false, sel:{}, done:false }, iv:{ sel:[false, false, false], a:false, b:false } }); }
  function stepRec(k, id){ var c = cs(id); return c.st[k] || (c.st[k] = { tries:0, done:false, first:null }); }
  function nSteps(id){ return id === "s3" ? 4 : 5; }
  function view(){ var c = CF[S.cur]; return views[S.cur] || (views[S.cur] = { xmin:c.win.xmin, xmax:c.win.xmax, ymin:c.win.ymin, ymax:c.win.ymax }); }
  host.innerHTML = '<div class="chips" id="cf-chips" role="group" aria-label="Choose a problem"></div><div id="cf-head"></div>' +
    '<div class="sym ml-cf"><div><div class="plot-wrap"><canvas class="plot" id="cf-top" role="img" aria-label="Graphs of the two sides"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-cf="zin" data-k="cfzin">Zoom in</button><button type="button" class="btn ghost sm" data-cf="zout" data-k="cfzout">Zoom out</button><button type="button" class="btn ghost sm" data-cf="mark" data-k="cfmark">Mark a crossing here</button><button type="button" class="btn ghost sm" data-cf="clear" data-k="cfclear">Clear marks</button></div>' +
      '<p class="tiny muted" id="cf-hlab" style="margin:12px 0 4px"></p><canvas class="plot ml-strip" id="cf-strip" role="img" aria-label="Difference graph"></canvas></div>' +
    '<div><ol class="ml-steps" id="cf-steps"></ol></div></div>' +
    '<details class="alg" id="cf-alg"><summary>Check it with algebra</summary><div id="cf-algp"></div><div id="cf-algb" aria-live="polite"></div></details>';
  var top = new MV.Plot($("#cf-top"), { xmin:0, xmax:1, ymin:0, ymax:1 }), strip = new MV.Plot($("#cf-strip"), { xmin:0, xmax:1, ymin:0, ymax:1 }), TP = null, SP = null;
  function tolOf(){ var v = view(); return TP ? Math.max(0.25, 16 * (v.xmax - v.xmin) / TP.R.w) : 0.25; }
  function probeX(){ var c = cs(), w = CF[S.cur].win; if (c.probe == null) c.probe = +((w.xmin + w.xmax) / 2).toFixed(2); return c.probe; }
  top.render = function(){
    var id = S.cur, c = CF[id], k = card(), v = view(), st = cs();
    top.draw({ grid:false, axes:false, describe:topDesc(), after:function(ctx, pl){
      var P = TP = panel(pl, layout(pl, false).top, v, { xTitle:k.v, yTitle:"y" });
      P.frame();
      P.curve(c.g, { color:css("--f3"), width:2.6 });
      P.curve(c.f, { color:css("--pen"), width:3 });
      // label both curves where they are furthest apart on screen (and both visible)
      var xl = v.xmin, best = -1;
      for (var q = 8; q <= 92; q++) { var xq = v.xmin + (v.xmax - v.xmin) * q / 100, fy = P.Y(c.f(xq)), gy = P.Y(c.g(xq)), inside = fy > P.R.y + 20 && fy < P.R.y + P.R.h - 20 && gy > P.R.y + 20 && gy < P.R.y + P.R.h - 20, d = Math.abs(fy - gy); if (inside && d > best) { best = d; xl = xq; } }
      if (best < 0) xl = v.xmin + (v.xmax - v.xmin) * 0.5;
      var up = c.f(xl) > c.g(xl);
      P.text(xl, c.f(xl), k.fLab, { align:"center", dy:up ? -16 : 16, color:css("--pen"), bg:true, font:"italic 600 14px " + pl.fontM });
      P.text(xl, c.g(xl), k.gLab, { align:"center", dy:up ? 16 : -16, color:css("--f3"), bg:true, font:"italic 600 14px " + pl.fontM });
      var px = probeX(); P.vline(px, { color:css("--ink-2"), dash:[4, 4], width:1.3 });
      st.marks.forEach(function(m){ P.dot(m.x, c.f(m.x), { r:7, open:true, color:css("--ink") }); });
      if (stepRec("s2").done) c.roots.forEach(function(r){ P.dot(r, c.f(r), { r:5 }); });
      // hand the panel's mapping to the drag handle (G7)
      pl.X = P.X; pl.Y = P.Y; pl.xOf = function(x){ return P.tOf(x); }; pl.yOf = function(y){ return P.yOf(y); };
    } });
  };
  strip.render = function(){
    var id = S.cur, c = CF[id], k = card(), v = view(), h = hOf(id), st = cs(), shown = st.step > 1;
    var lo = 0, hi = 0; for (var i = 0; i <= 200; i++) { var y = h(v.xmin + (v.xmax - v.xmin) * i / 200); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
    var span = Math.max(hi - lo, 1e-6), sv = { xmin:v.xmin, xmax:v.xmax, ymin:lo - span * 0.12, ymax:hi + span * 0.12 };
    strip.draw({ grid:false, axes:false, describe:shown ? "Difference graph " + MV.plain(k.h) + ", with its zeros at the crossings." : "Difference graph, not drawn yet.", after:function(ctx, pl){
      var Q = SP = panel(pl, { x:44, y:6, w:pl.W - 54, h:pl.H - 26 }, sv, { yTitle:"h" });
      Q.frame();
      if (!shown && anim.reveal[id] == null) { Q.text((v.xmin + v.xmax) / 2, (sv.ymin + sv.ymax) / 2, "h appears here after step 1", { align:"center", color:css("--ink-2"), bg:true }); return; }
      var r = anim.reveal[id] == null ? 1 : anim.reveal[id];
      Q.curve(h, { color:css("--ink"), width:3, to:v.xmin + (v.xmax - v.xmin) * r });
      if (anim.pulse > 0 && anim.pulseId === id) c.roots.forEach(function(x){ var X = Q.X(x), Y = Q.Y(0); if (X < Q.R.x || X > Q.R.x + Q.R.w) return; ctx.save(); ctx.globalAlpha = 0.85; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, Y, 6 + 6 * Math.abs(Math.sin(anim.pulse * PI * 3)), 0, TAU); ctx.stroke(); ctx.restore(); });
    } });
  };
  function topDesc(){ var k = card(), st = cs(); return MV.plain(k.problem) + " Graphs of " + k.fLab + " and " + k.gLab + ". Probe at " + k.v + " = " + num(probeX(), 2) + "." + (st.marks.length ? " Marked crossings near " + k.v + " = " + st.marks.map(function(m){ return num(m.x, 2); }).join(", ") + "." : ""); }
  function redraw(){ top.render(); strip.render(); }
  var drag = MV.drag(top, { axis:"x", step:{ x:0.1, y:1 }, big:5,
    handles:function(){ var px = probeX(); return [{ id:"pr", x:px, y:CF[S.cur].f(px), label:"Probe at " + card().v + " = " + num(px, 2) + ". Arrow keys move it; press M or Enter to mark a crossing here." }]; },
    key:function(id, e){ if (e.key === "m" || e.key === "M" || e.key === "Enter") { toggleMark(probeX()); return true; } if (e.key === "ArrowLeft" || e.key === "ArrowRight") { var v = view(), stp = MV.niceStep((v.xmax - v.xmin) / 100) * (e.shiftKey ? 5 : 1); moveProbe(probeX() + (e.key === "ArrowLeft" ? -stp : stp)); return true; } return false; },
    move:function(id, x){ moveProbe(x); } });
  void drag;
  function moveProbe(x){ var v = view(), w = CF[S.cur].win; cs().probe = +clamp(x, Math.max(v.xmin, w.xmin), Math.min(v.xmax, w.xmax)).toFixed(4); api.save(); top.render(); }
  $("#cf-top").addEventListener("pointerdown", function(e){
    if (e.defaultPrevented || !TP) return;
    var r = this.getBoundingClientRect(), x = TP.tOf(e.clientX - r.left), w = CF[S.cur].win;
    if (x < w.xmin || x > w.xmax) return;
    moveProbe(x); last[S.cur] = { x:x, y:TP.yOf(e.clientY - r.top) }; toggleMark(x);
  });
  function toggleMark(x){
    var st = cs(); if (st.step !== 2) { msg.s2 = null; top.render(); return; }
    var k = -1, tl = tolOf(); st.marks.forEach(function(m, i){ if (Math.abs(m.x - x) <= Math.max(tl, m.tol) * 0.6) k = i; });
    if (k >= 0) st.marks.splice(k, 1); else if (st.marks.length < 6) st.marks.push({ x:+x.toFixed(4), tol:tl });
    st.marks.sort(function(a, b){ return a.x - b.x; }); msg.s2 = null; api.save(); top.render(); paintSteps();
  }
  function zoom(f){
    var v = view(), w = CF[S.cur].win, cx = last[S.cur] ? last[S.cur].x : probeX(), cy = last[S.cur] ? last[S.cur].y : CF[S.cur].f(cx);
    var nw = clamp((v.xmax - v.xmin) * f, (w.xmax - w.xmin) / 64, w.xmax - w.xmin), nh = clamp((v.ymax - v.ymin) * f, (w.ymax - w.ymin) / 64, w.ymax - w.ymin);
    var x0 = clamp(cx - nw / 2, w.xmin, w.xmax - nw), y0 = clamp(cy - nh / 2, w.ymin, w.ymax - nh), from = Object.assign({}, v), to = { xmin:x0, xmax:x0 + nw, ymin:y0, ymax:y0 + nh };
    MV.tween({ dur:450, step:function(s){ ["xmin", "xmax", "ymin", "ymax"].forEach(function(key){ v[key] = lerp(from[key], to[key], s); }); redraw(); } });
  }

  // ---- step panel ----
  function hEqFor(k){ return M("h(" + k.v + ") = 0"); }
  function chipsHTML(list, key, chosen, done){
    return '<div class="chips ml-c5" role="group" aria-label="Choices">' + list.map(function(c, i){ var on = chosen === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-ch="' + key + '" data-ci="' + i + '" data-k="ch' + key + i + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
  }
  function tblHTML(key, xs, h, dp, sel, done, v, xdp){
    return '<div class="ml-tbl" role="group" aria-label="Table of h values"><span class="ml-tlab" aria-hidden="true"><span>' + M(v) + "</span><span>" + M("h") + "</span></span>" + xs.map(function(x, i){
      var on = sel.indexOf(i) >= 0, hv = fmtH(h(x), dp), xv = fxd(x, xdp || 0);
      return '<button type="button" class="ml-tc' + (on ? " on" : "") + '" data-tb="' + key + '" data-ti="' + i + '" data-k="tb' + key + "-" + i + '" aria-pressed="' + on + '" aria-label="' + v + " = " + xv + ", h = " + hv + '"' + (done ? " disabled" : "") + '><span class="ml-tx">' + xv + '</span><span class="ml-th">' + hv + "</span></button>";
    }).join("") + "</div>";
  }
  function fbLine(kind, html){ return MV.fbHTML(kind, (kind === "good" ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + html); }
  function wholeXs(id){ var c = CF[id]; return xsOf(c.from, c.to - c.from, 1); }
  function tenthXs(a){ return xsOf(a, 10, 10); }
  function hundXs(a){ return xsOf(a, 10, 100); }
  function tenthLow(r){ return Math.floor(r * 10 + 1e-9) / 10; }
  function bracketTxt(k, p, q, dp){ return fill(TX.s4.report, { v:M(k.v), p:fxd(p, dp), q:fxd(q, dp) }); }
  function paintSteps(){
    var k = card(), id = k.id, c = CF[id], st = cs(), h = hOf(id), n = nSteps(id), out = "";
    var titles = [TX.s1.title, TX.s2.title, TX.s3.title, TX.s4.title, TX.s5.title];
    for (var i = 1; i <= n; i++) {
      var cls = i < st.step ? "done" : i === st.step ? "cur" : "todo", body = "";
      if (i === 1) {
        body = i < st.step ? "<p>" + k.h + ". " + TX.s1.text + "</p>" : "<p>" + k.eq + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-cf="s1" data-k="cfs1">' + fill(TX.s1.btn, { h0:hEqFor(k) }) + "</button></div>";
      } else if (i === 2 && i <= st.step) {
        var r2 = stepRec("s2");
        if (r2.done) body = "<p>✓ " + c.roots.length + " crossing" + (c.roots.length > 1 ? "s" : "") + ", marked on the graph." + (r2.first ? "" : ' <span class="muted">(not first try)</span>') + "</p>";
        else body = "<p>" + TX.s2.text + '</p><p class="tiny muted">Marked: ' + (st.marks.length ? st.marks.map(function(m){ return M(k.v + " ≈ " + src(+m.x.toFixed(2))); }).join(", ") : "none yet") + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-cf="s2" data-k="cfs2"' + (st.marks.length ? "" : "") + ">Done</button></div>" + (msg.s2 ? fbLine("bad", msg.s2) : "");
      } else if (i === 3 && i <= st.step) {
        var r3 = stepRec("s3");
        if (id === "s4") {
          var ch = MV.shuffle(k.chipChoices, "s4chip");
          body = "<p>" + k.chipQ + "</p>" + tblHTML("w", wholeXs(id), h, c.dp[0], [], true, k.v) + chipsHTML(ch, "s4c", st.s4c, r3.done);
          if (r3.done) body += fbLine("good", k.after); else if (msg.s3) body += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg.s3);
        } else {
          var xs = wholeXs(id), sel = st.sel3 || [];
          body = "<p>" + fill(TX.s3.text, { unit:k.unit }) + "</p>" + tblHTML("w", xs, h, c.dp[0], sel, r3.done, k.v);
          if (r3.done) body += "<p>✓ " + c.brackets.map(function(a){ return "(" + num(a) + ", " + num(a + 1) + ")"; }).join(" and ") + (r3.first ? "" : ' <span class="muted">(not first try)</span>') + "</p>";
          else body += '<div class="q-actions"><button type="button" class="btn primary sm" data-cf="s3" data-k="cfs3">Check</button></div>' + (msg.s3 ? fbLine("bad", msg.s3) : "");
        }
      } else if (i === 4 && i <= st.step) {
        var r4 = stepRec("s4"); st.sel4 = st.sel4 || {};
        body = "<p>" + TX.s4.text + "</p>";
        c.brackets.forEach(function(a, bi){ var s4 = st.sel4[bi] || []; body += '<p class="tiny ml-tcap">' + M(k.v) + " from " + num(a) + " to " + num(a + 1) + "</p>" + tblHTML("t" + bi, tenthXs(a), h, c.dp[1], s4, r4.done, k.v, 1); });
        if (r4.done) {
          body += "<p>✓ " + c.roots.filter(function(r){ return r !== Math.round(r); }).map(function(r){ var p = tenthLow(r); return bracketTxt(k, p, p + 0.1, 1); }).join(" ") + (r4.first ? "" : ' <span class="muted">(not first try)</span>') + "</p>";
          var hu = st.hund;
          if (!hu.open) body += '<div class="q-actions"><button type="button" class="btn ghost sm" data-cf="hund" data-k="cfhund">' + TX.s4.again + "</button></div>";
          else {
            body += "<p>" + TX.s4.hund + "</p>";
            c.roots.filter(function(r){ return r !== Math.round(r); }).forEach(function(r, bi){ var a = tenthLow(r), s = hu.sel[bi] || []; body += '<p class="tiny ml-tcap">' + M(k.v) + " from " + fxd(a, 1) + " to " + fxd(a + 0.1, 1) + "</p>" + tblHTML("h" + bi, hundXs(a), h, c.dp[2], s, hu.done, k.v, 2); });
            if (hu.done) body += "<p>✓ " + c.roots.filter(function(r){ return r !== Math.round(r); }).map(function(r){ var p = Math.floor(r * 100 + 1e-9) / 100; return bracketTxt(k, p, p + 0.01, 2); }).join(" ") + "</p>";
            else body += '<div class="q-actions"><button type="button" class="btn primary sm" data-cf="s4h" data-k="cfs4h">Check</button></div>' + (msg.hund ? fbLine("bad", msg.hund) : "");
          }
        } else body += '<div class="q-actions"><button type="button" class="btn primary sm" data-cf="s4" data-k="cfs4">Check</button></div>' + (msg.s4 ? fbLine("bad", msg.s4) : "");
      } else if (i === 5 && i <= st.step) {
        var r5 = stepRec("s5");
        if (id === "s4") body = ivHTML(k, st, r5);
        else {
          body = "<p>" + k.ask + "</p>" + chipsHTML(k.choices, "s5c", st.s5c, r5.done);
          if (st.s5c != null) { var chc = k.choices[st.s5c], good = MV.ok(chc); body += MV.fbHTML(good ? "good" : "bad", (/^(Right|✓)/.test(MV.plain(chc.fb)) ? "" : good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + chc.fb + (good ? "" : " Try again.")); }
        }
      }
      var mark = i < st.step ? "✓" : String(i);
      out += '<li class="ml-step ' + cls + '"><p class="ml-sth"><span class="ml-stn" aria-hidden="true">' + mark + "</span> " + titles[i - 1] + (i < st.step ? '<span class="vh"> (done)</span>' : "") + "</p>" + (body ? '<div class="ml-stb">' + body + "</div>" : "") + "</li>";
    }
    if (st.step > n) out += '<li class="ml-step done ml-ans"><p class="ml-sth"><span class="ml-stn" aria-hidden="true">✓</span> Answer</p><div class="ml-stb"><p><strong>' + MV.md(MV.ans(k)) + "</strong></p></div></li>";
    MV.keepFocus($("#cf-steps"), function(){ $("#cf-steps").innerHTML = out; });
    if (st.step >= 5 && id === "s4") drawIv();
  }
  // S4 step 5: number line cut at a and 3 (N10 in cut-line mode, G14)
  var A4 = null, ivPlot = null, nlWrap = document.createElement("div");
  nlWrap.className = "plot-wrap"; nlWrap.innerHTML = '<canvas class="plot nl" role="img" aria-label="Number line cut at a and 3"></canvas>';
  function ivPieces(st){ var a = A4, out = []; if (st.iv.sel[0]) out.push({ a:-Infinity, b:a, aIn:false, bIn:st.iv.a }); if (st.iv.sel[1]) out.push({ a:a, b:3, aIn:st.iv.a, bIn:st.iv.b }); if (st.iv.sel[2]) out.push({ a:3, b:Infinity, aIn:st.iv.b, bIn:false }); return out; }
  function ivSrc(st){ var ps = MV.iv.norm(ivPieces(st)); if (!ps.length) return "∅"; var e = function(v){ return v === A4 ? "a" : v === -Infinity ? "-∞" : v === Infinity ? "∞" : src(v); }; return ps.map(function(p){ return (p.aIn ? "[" : "(") + e(p.a) + ", " + e(p.b) + (p.bIn ? "]" : ")"); }).join(" ∪ "); }
  function ivHTML(k, st, r5){
    var adjA = st.iv.sel[0] || st.iv.sel[1], adjB = st.iv.sel[1] || st.iv.sel[2], dis = r5.done ? " disabled" : "";
    var pt = function(key, lab, on, adj){ return '<button type="button" class="ml-pt" data-ivp="' + key + '" data-k="ivp' + key + '" aria-pressed="' + on + '" aria-label="' + lab + ": " + (on ? "included" : "left out") + '"' + (!adj || r5.done ? " disabled" : "") + "><span>" + lab + '</span><b aria-hidden="true">' + (on ? "●" : "○") + "</b></button>"; };
    var pc = function(i, lab){ var on = st.iv.sel[i]; return '<button type="button" class="ml-st' + (on ? " on" : "") + '" data-ivs="' + i + '" data-k="ivs' + i + '" aria-pressed="' + on + '"' + dis + ">" + lab + "</button>"; };
    var h = "<p>" + k.ask + '</p><div id="cf-nlslot"></div>' +
      '<div class="ml-ivrow" role="group" aria-label="Pieces of the number line">' + pc(0, MINUS + "∞ to <i>a</i>") + pt("a", "a ≈ 2.48", st.iv.a, adjA) + pc(1, "<i>a</i> to 3") + pt("b", "3", st.iv.b, adjB) + pc(2, "3 to ∞") + "</div>" +
      '<p>Your answer: <span class="ml-ivans">' + M(ivSrc(st)) + "</span></p>";
    if (r5.done) h += fbLine("good", MV.md(MV.ans(k)));
    else h += '<div class="q-actions"><button type="button" class="btn primary sm" data-cf="s5iv" data-k="cfs5iv">Check</button></div>' + (msg.s5 ? fbLine("bad", msg.s5) : "");
    return h;
  }
  function drawIv(){
    var slot = $("#cf-nlslot"); if (!slot) return;
    slot.appendChild(nlWrap);
    if (!ivPlot) ivPlot = new MV.Plot($("canvas", nlWrap), { xmin:-1, xmax:5, ymin:-1, ymax:1 });
    ivPlot.render = function(){ var st = cs("s4"); ivPlot.draw({ numberLine:{ min:-1, max:5, pieces:ivPieces(st), marks:[{ x:A4, label:"a" }, { x:3, label:"3" }], dots:[{ x:A4, closed:st.iv.a, color:css("--ink-2") }, { x:3, closed:st.iv.b, color:css("--ink-2") }] }, describe:"Number line from −1 to 5, cut at a ≈ 2.48 and 3. Your answer: " + MV.plain(M(ivSrc(st))) + "." }); };
    ivPlot.render();
  }

  // ---- judging ----
  function judgePairs(xs, sel, h, want){
    if (!sel || !sel.length) return { msg:TX.s3.apart };
    var s = sel.slice().sort(function(a, b){ return a - b; }), runs = [], cur = [s[0]];
    for (var i = 1; i < s.length; i++) { if (s[i] === s[i - 1] + 1) cur.push(s[i]); else { runs.push(cur); cur = [s[i]]; } }
    runs.push(cur);
    if (runs.some(function(r){ return r.length % 2; })) return { msg:TX.s3.apart };
    runs = runs.reduce(function(acc, r){ for (var k = 0; k < r.length; k += 2) acc.push([r[k], r[k + 1]]); return acc; }, []);
    for (var j = 0; j < runs.length; j++) {
      var p = xs[runs[j][0]], q = xs[runs[j][1]], sp = sgn(h(p)), sq = sgn(h(q));
      if (sp === 0 || sq === 0) return { msg:fill(TX.s4.zero, { p:num(sp === 0 ? p : q, 2) }) };
      if (sp === sq) return { msg:fill(TX.s3.wrong, { sign:sp < 0 ? "negative" : "positive", p:num(p, 2), q:num(q, 2) }) };
    }
    if (runs.length < want) return { msg:TX.s3.missing };
    return { ok:true };
  }
  function record(key, ok, m){ var r = stepRec(key); if (ok) { r.done = true; r.first = r.tries === 0; msg[key] = null; } else { r.tries++; msg[key] = m; } }
  function judge2(){
    var k = card(), id = k.id, c = CF[id], st = cs(), h = hOf(id);
    if (!st.marks.length) return TX.s2.empty;
    for (var i = 0; i < st.marks.length; i++) {
      var m = st.marks[i], tl = Math.max(0.25, m.tol || 0.25);
      if (!c.roots.some(function(r){ return Math.abs(r - m.x) <= tl + 1e-9; })) {
        if (id === "s3" && Math.abs(m.x + 2) <= 0.6) return k.near;
        return fill(TX.s2.none, { sign:h(m.x) > 0 ? "positive" : "negative", v:M(k.v) });
      }
    }
    for (var j = 0; j < c.roots.length; j++) {
      var r = c.roots[j];
      if (!st.marks.some(function(mm){ return Math.abs(r - mm.x) <= Math.max(0.25, mm.tol || 0.25) + 1e-9; })) return k.missing[j] || k.missing[0];
    }
    return null;
  }
  function judge5iv(st){
    var sel = st.iv.sel, F = card().ivFb;
    if (!sel[0] && !sel[1] && !sel[2]) return "Tap at least one piece of the number line first.";
    if (sel[1]) return F.mid;
    if ((sel[0] && st.iv.a) || (sel[2] && st.iv.b)) return F.closed;
    if (!sel[0]) return F.left;
    if (!sel[2]) return F.right;
    return null;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var k = card(), id = k.id, c = CF[id], st = cs(), h = hOf(id);
    if (b.dataset.card) { S.cur = b.dataset.card; msg = {}; api.save(); paintCard(); return; }
    var a = b.dataset.cf;
    if (a === "zin") { zoom(0.5); return; }
    if (a === "zout") { zoom(2); return; }
    if (a === "mark") { toggleMark(probeX()); return; }
    if (a === "clear") { if (st.step === 2) { st.marks = []; msg.s2 = null; api.save(); top.render(); paintSteps(); } return; }
    if (a === "s1") {
      st.step = 2; api.save(); anim.reveal[id] = 0; anim.pulseId = id; paintSteps();
      MV.tween({ dur:600, ease:function(s){ return s; }, step:function(s){ anim.reveal[id] = s; strip.render(); }, done:function(){ anim.reveal[id] = null;
        MV.tween({ dur:1400, ease:function(s){ return s; }, step:function(s){ anim.pulse = s < 1 ? s : 0; strip.render(); }, done:function(){ anim.pulse = 0; strip.render(); } }); } });
      return;
    }
    if (a === "s2") { var m2 = judge2(); record("s2", !m2, m2); if (!m2) st.step = 3; api.save(); redraw(); paintSteps(); MV.focusFb($("#cf-steps")); return; }
    if (a === "s3") { var j3 = judgePairs(wholeXs(id), st.sel3, h, c.brackets.length); record("s3", !!j3.ok, j3.msg); if (j3.ok) st.step = 4; api.save(); paintSteps(); MV.focusFb($("#cf-steps")); return; }
    if (a === "s4") {
      var bad = null;
      c.brackets.forEach(function(br, bi){ if (bad) return; var s4 = (st.sel4 || {})[bi]; if (!s4 || !s4.length) { bad = "Tap the sign change in each table."; return; } var j = judgePairs(tenthXs(br), s4, h, 1); if (!j.ok) bad = j.msg; });
      record("s4", !bad, bad); if (!bad) st.step = 5; api.save(); paintSteps(); paintChips(); MV.focusFb($("#cf-steps")); return;
    }
    if (a === "hund") { st.hund.open = true; api.save(); paintSteps(); return; }
    if (a === "s4h") {
      var badh = null, rs = c.roots.filter(function(r){ return r !== Math.round(r); });
      rs.forEach(function(r, bi){ if (badh) return; var s = st.hund.sel[bi]; if (!s || !s.length) { badh = "Tap the sign change in each table."; return; } var j = judgePairs(hundXs(tenthLow(r)), s, h, 1); if (!j.ok) badh = j.msg; });
      if (!badh) st.hund.done = true; msg.hund = badh; api.save(); paintSteps(); MV.focusFb($("#cf-steps")); return;
    }
    if (a === "s5iv") { var m5 = judge5iv(st); record("s5", !m5, m5); if (!m5) st.step = 6; api.save(); paintSteps(); paintChips(); MV.focusFb($("#cf-steps")); return; }
    if (b.dataset.tb) {
      var key = b.dataset.tb, ti = +b.dataset.ti, arr;
      if (key === "w") arr = st.sel3 = st.sel3 || [];
      else if (key.charAt(0) === "t") { st.sel4 = st.sel4 || {}; arr = st.sel4[+key.slice(1)] = st.sel4[+key.slice(1)] || []; }
      else arr = st.hund.sel[+key.slice(1)] = st.hund.sel[+key.slice(1)] || [];
      var pos = arr.indexOf(ti); if (pos >= 0) arr.splice(pos, 1); else arr.push(ti);
      if (key === "w") msg.s3 = null; else if (key.charAt(0) === "t") msg.s4 = null; else msg.hund = null;
      api.save(); paintSteps(); return;
    }
    if (b.dataset.ch === "s4c") {
      var ch = MV.shuffle(k.chipChoices, "s4chip"), pick = ch[+b.dataset.ci], ok = MV.ok(pick);
      st.s4c = +b.dataset.ci; record("s3", ok, ok ? null : pick.fb); if (ok) st.step = 4; api.save(); paintSteps(); MV.focusFb($("#cf-steps")); return;
    }
    if (b.dataset.ch === "s5c") {
      var pk = k.choices[+b.dataset.ci], ok5 = MV.ok(pk); st.s5c = +b.dataset.ci; record("s5", ok5, null); if (ok5) st.step = 6; api.save(); paintSteps(); paintChips(); MV.focusFb($("#cf-steps")); return;
    }
    if (b.dataset.ivs != null) { var si = +b.dataset.ivs; st.iv.sel[si] = !st.iv.sel[si]; if (!st.iv.sel[0] && !st.iv.sel[1]) st.iv.a = false; if (!st.iv.sel[1] && !st.iv.sel[2]) st.iv.b = false; msg.s5 = null; api.save(); paintSteps(); return; }
    if (b.dataset.ivp) { st.iv[b.dataset.ivp] = !st.iv[b.dataset.ivp]; msg.s5 = null; api.save(); paintSteps(); return; }
  });
  function paintChips(){
    $("#cf-chips").innerHTML = P3.cards.map(function(k){ var done = cs(k.id).step > nSteps(k.id); return '<button type="button" class="fchip ml-cchip" data-card="' + k.id + '" data-k="cc' + k.id + '" aria-pressed="' + (S.cur === k.id) + '">' + (done ? "✓ " : "") + k.chip + (k.stretch ? ' <span class="tag">Stretch</span>' : "") + "</button>"; }).join("");
  }
  function paintCard(){
    var k = card();
    paintChips();
    $("#cf-head").innerHTML = "<h3>" + k.chip + ". " + k.title + "</h3><p>" + k.problem + "</p>";
    $("#cf-hlab").innerHTML = "Difference graph: " + k.h;
    if (k.id === "s4") A4 = CF.s4.roots.filter(function(r){ return r !== 3; })[0];
    redraw(); paintSteps();
  }
  paintCard();
  // "Check it with algebra" (N13 step-through, N20 boxes)
  var ALG = P3.alg;
  MV.player($("#cf-algp"), { count:ALG.length, label:function(i){ return "Step " + (i + 1) + " of " + ALG.length + ": " + MV.plain(ALG[i].t); }, render:function(i){ var s = ALG[i]; $("#cf-algb").innerHTML = '<h4 class="ml-algt">' + s.t + "</h4><p>" + s.html + "</p>" + MV.usesHTML(s.use); } });
  // results summary line for the 15 steps
  MV.ACTS.solve = { a:{ id:"solve" },
    stats:function(){ var f = 0, d = 0; IDS.forEach(function(id){ ["s2", "s3", "s4", "s5"].slice(0, nSteps(id) - 1).forEach(function(k){ var r = cs(id).st[k]; if (r && r.done) d++; if (r && r.first) f++; }); }); return { first:f, total:15, done:d, line:"Solve with graphs steps (first try): " + f + "/15" + (d < 15 ? " (unfinished)" : "") }; },
    missed:function(){ var miss = false; IDS.forEach(function(id){ Object.keys(cs(id).st).forEach(function(k){ if (cs(id).st[k].tries > 0) miss = true; }); }); return miss ? [3] : []; } };
}

// ---------- Practice 1: match the story to its model ----------
// @component N6 storyMatch (adapted from the toolkit's N6 matching pairs) — the same tap-to-pair activity, but each mismatch
//   message ends with the activity's own retry line (a.retry) instead of "Try another partner."; hints per left item, first-try stats.
function storyMatch(host, api, a){
  var st = api.S; st.done = st.done || {}; st.tries = st.tries || {}; st.hints = st.hints || {};
  var sel = null, msg = null, right = MV.shuffle(a.right, MV.meta.id + a.id), K = MV.ans(a);
  function itemById(id){ return a.left.filter(function(x){ return x.id === id; })[0]; }
  function stats(){ var first = 0, done = 0, missed = []; a.left.forEach(function(L){ var bad = (st.tries[L.id] || 0) > 0 || (st.hints[L.id] || 0) >= 3; if (st.done[L.id]) { done++; if (!bad) first++; } if (bad) missed.push(L); }); return { first:first, done:done, total:a.left.length, missed:missed }; }
  function paint(){
    var s = stats(), h = '<p class="how">' + a.how + "</p>";
    if (sel) { var L = itemById(sel), lv = st.hints[sel] || 0; h += '<div class="sel-bar"><span>Selected: ' + L.t + "</span>" + MV.hintBtn("mh" + a.id, lv) + "</div>" + MV.hintsHTML(L.hints, lv); }
    if (msg) h += '<div class="fb ' + msg.type + '" role="status"><p>' + msg.html + "</p></div>";
    if (s.done === s.total) h += '<p class="sort-done" style="margin-top:10px">All matched! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>";
    var doneR = {}; a.left.forEach(function(L, i){ if (st.done[L.id]) doneR[K[L.id]] = i + 1; });
    h += '<div class="match"><div class="match-col" role="group" aria-label="' + MV.esc(MV.plain(a.leftTitle)) + '"><h4>' + a.leftTitle + "</h4>" + a.left.map(function(L, i){
      var d = st.done[L.id];
      return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-k="ml' + L.id + '" data-l="' + L.id + '" aria-pressed="' + (sel === L.id) + '"' + (d ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + (i + 1) + "</span>" : "") + "<span>S" + (i + 1) + ". " + L.t + "</span></button>";
    }).join("") + '</div><div class="match-col" role="group" aria-label="' + MV.esc(MV.plain(a.rightTitle)) + '"><h4>' + a.rightTitle + "</h4>" + right.map(function(R){
      var d = doneR[R.id];
      return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-k="mr' + R.id + '" data-r="' + R.id + '"' + (d ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + d + "</span>" : "") + "<span>" + R.t + "</span></button>";
    }).join("") + "</div></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { st.hints[sel] = Math.min(3, (st.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.r) {
      if (!sel) { msg = { type:"", html:"Tap a situation first, then tap its model." }; paint(); return; }
      var L = itemById(sel);
      if (K[sel] === b.dataset.r) { st.done[sel] = true; msg = { type:"good", html:"<strong>✓ Matched.</strong> " + (L.why || "") }; sel = null; api.save(); paint(); MV.focusFb(host); }
      else { st.tries[sel] = (st.tries[sel] || 0) + 1; msg = { type:"bad", html:"<strong>✗ Not a match.</strong> " + ((a.wrong && a.wrong[sel + "|" + b.dataset.r]) || "Those two don’t match.") + " " + a.retry }; api.save(); paint(); MV.focusFb(host); }
    }
  });
  paint();
  return { stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:a.summary + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().missed.forEach(function(L){ g = g.concat(MV.goalIdx(L.goal != null ? L.goal : a.goal)); }); return g; } };
}

// ---------- performance task: keep the servers ahead ----------
var task = (function(){
  var api = null, plot = null, T = null;
  function U(t){ return 5 * Math.pow(2, t / 6); }
  function read(){
    var s = api ? api.S : {}, pm = MV.parseNum(s.m), pb = MV.parseNum(s.b);
    var m = pm && pm.length === 1 ? pm[0] : NaN, b = pb && pb.length === 1 ? pb[0] : NaN;
    var valid = isFinite(m) && isFinite(b) && Math.abs(b - Math.round(b)) < 1e-9 && b >= 0 && b <= 40 && m >= 0 && m <= 5 && Math.abs(m * 2 - Math.round(m * 2)) < 1e-9;
    return { m:valid ? Math.round(m * 2) / 2 : m, b:valid ? Math.round(b) : b, valid:valid };
  }
  function checks(d){ if (!d.valid) return [false, false, false, false]; return [d.b <= 20, d.b >= 5 && 18 * d.m + d.b >= 40, 12 * d.m + d.b >= 30, d.b + 6 * d.m <= 30 + 1e-9]; }
  function draw(){
    var d = read();
    plot.draw({ grid:false, axes:false, describe:d.valid ? "Users U of t and your capacity C of t = " + MV.plain(M(linSrc(d.m, d.b))) + " for t from 0 to 24 months, with the ratio C over U below." : "Users U of t for t from 0 to 24 months. Enter m and b to see your capacity.", after:function(ctx, pl){
      var Ly = layout(pl, true, 0.64), P = panel(pl, Ly.top, { xmin:-0.5, xmax:24.5, ymin:0, ymax:100 }, { xTitle:"t (months)", yTitle:"thousand users" });
      P.frame();
      var C = function(t){ return d.m * t + d.b; };
      if (d.valid) {
        P.clip(); ctx.fillStyle = css("--hi-soft");
        for (var i = 0; i < 240; i++) { var t0 = 24 * i / 240, t1 = 24 * (i + 1) / 240; if (C((t0 + t1) / 2) >= U((t0 + t1) / 2)) { ctx.beginPath(); ctx.moveTo(P.X(t0), P.Y(C(t0))); ctx.lineTo(P.X(t1), P.Y(C(t1))); ctx.lineTo(P.X(t1), P.Y(U(t1))); ctx.lineTo(P.X(t0), P.Y(U(t0))); ctx.closePath(); ctx.fill(); } }
        ctx.restore();
      }
      P.vline(18, { color:css("--ink-2"), dash:[6, 6] }); P.text(18, 96, "new data centre", { align:"right", dx:-6, color:css("--ink-2"), bg:true, font:"600 12px " + pl.fontUI });
      P.curve(U, { color:css("--pen"), width:3 }); P.text(22, U(22), "U", { dx:8, dy:-4, color:css("--pen"), font:"italic 600 15px " + pl.fontM });
      if (d.valid) { P.curve(C, { color:css("--f3"), width:2.6 }); P.text(3, C(3), "C", { dy:-14, color:css("--f3"), font:"italic 600 15px " + pl.fontM, bg:true }); }
      var Q = panel(pl, Ly.strip, { xmin:-0.5, xmax:24.5, ymin:0, ymax:3 }, { yTitle:"C ÷ U", yStep:1 });
      Q.frame();
      Q.hline(1, { color:css("--ink-2"), dash:[6, 6], label:"1" }); Q.hline(1.5, { color:css("--ink-2"), dash:[6, 6], label:"1.5" });
      if (d.valid) Q.curve(function(t){ return C(t) / U(t); }, { color:css("--ink"), width:3 });
    } });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; if (a.S.m == null) a.S.m = "1"; if (a.S.b == null) a.S.b = "10";
      var box = function(id, lab, step){ return '<div class="ml-steprow"><label for="tk-' + id + '">' + lab + '</label><span class="ml-stepper"><button type="button" class="btn ghost sm" data-tk="' + id + '" data-dv="-' + step + '" data-k="tk' + id + 'm" aria-label="Decrease ' + id + '">−</button><input id="tk-' + id + '" data-tkin="' + id + '" class="numin" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(a.S[id]) + '"><button type="button" class="btn ghost sm" data-tk="' + id + '" data-dv="' + step + '" data-k="tk' + id + 'p" aria-label="Increase ' + id + '">+</button></span></div>'; };
      inp.innerHTML = box("m", M("m") + ": capacity added each month (0 to 5, steps of 0.5)", 0.5) + box("b", M("b") + ": capacity at launch (whole number, 0 to 40)", 1) + '<p class="eq-cap ml-tkcap" id="tk-cap" aria-live="polite"></p>';
      pv.innerHTML = '<canvas class="plot" id="tk-plot" role="img" aria-label="Users and capacity"></canvas>';
      plot = new MV.Plot($("#tk-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      function refresh(){ var d = read(); $("#tk-cap").innerHTML = d.valid ? M("C(t) = " + linSrc(d.m, d.b)) : '<span class="tiny muted">Enter ' + M("m") + " and " + M("b") + ".</span>"; draw(); a.update(); }
      inp.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.tkin; if (!id) return; a.S[id] = e.target.value; a.save(); refresh(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tk]"); if (!b) return;
        var id = b.dataset.tk, step = +b.dataset.dv, cur = MV.parseNum(a.S[id]), v = cur && cur.length === 1 ? cur[0] : 0;
        v = id === "m" ? snapTo(v + step, 0.5, 0, 5) : snapTo(v + step, 1, 0, 40);
        a.S[id] = String(v); $("#tk-" + id).value = a.S[id]; a.save(); refresh();
      });
      refresh();
      // after plans with three different values of m, show the trade-off note (the toolkit counts any three plans)
      document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        var found = (MV.taskState().found || []), ms = {}; found.forEach(function(k){ ms[k.split("|")[0]] = 1; });
        var fb = $("#task-fb .fb.good");
        if (fb && Object.keys(ms).length >= 3 && !fb.querySelector(".ml-afterm")) fb.insertAdjacentHTML("beforeend", '<p class="ml-afterm">' + T.afterM + "</p>");
      });
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter a whole number from 0 to 40 for " + M("b") + ", and a value from 0 to 5 in steps of 0.5 for " + M("m") + "."; },
    checks:checks,
    tips:function(d, c){
      var tp = T.tips, out = [], C0 = d.b, C18 = 18 * d.m + d.b, C12 = 12 * d.m + d.b;
      if (!c[0]) out.push(fill(tp[0], { b:num(d.b), r:num(d.b / 5, 2) }));
      if (!c[1]) out.push(fill(tp[1], { c0:num(C0), c18:num(C18) }));
      if (!c[2]) out.push(fill(tp[2], { c12:num(C12) }));
      if (!c[3]) out.push(fill(tp[3], { cost:num(d.b + 6 * d.m) }));
      return out;
    },
    key:function(d){ return src(d.m) + "|" + d.b; },
    label:function(k){ var p = k.split("|"); return M("(m, b) = (" + p[0] + ", " + p[1] + ")"); },
    text:function(k){ var p = k.split("|"); return MV.plain(M("C(t) = " + linSrc(+p[0], +p[1]))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ match:storyMatch },
  task:task,
  figures:{
    q2:function(p){
      p.draw({ view:{ xmin:-1, xmax:7, ymin:-4, ymax:4 }, asymptotes:[{ x:3, label:"x = 3" }], curves:[{ f:function(x){ return 1 / (x - 3); }, color:css("--pen"), width:3 }],
        points:[{ x:2, y:-1, label:"(2, −1)" }, { x:4, y:1, label:"(4, 1)" }], describe:"Graph of y = 1/(x − 3): two pieces either side of the vertical asymptote x = 3, through (2, −1) and (4, 1), never touching the x-axis." });
    }
  }
});
})();
