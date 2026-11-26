// MDM4U 28 Normal Approximation to the Binomial: hero (bars for n = 10 grow to n = 100, a normal curve fades in, the bar at 60
// and its matching area from 59.5 to 60.5), Overlay (Explore: D7 histogram + D8 normal overlay; n and p sliders + chips;
// Overlay / Correction / Error modes; event menu with steppers; continuity-correction switch; exact vs approximate readouts),
// When does it fail? (Part 3: four evidence stations + "Check it with data"), Catch a biased coin task, and a D8 z-table
// panel (left areas, with a look-up box) added to the Start, Explore, Part 3, Practice and Final Check views.
// Exact binomial sums are computed in code (log factorials), for display only; z is rounded to 2 decimals before the table.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function dec(v, dp){ var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp); if (/^-0\.?0*$/.test(s)) s = s.slice(1); return s.replace("-", MV.MINUS); }
function trim(v, dp){ var s = dec(v, dp); if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s; }
function d4(v){ return dec(v, 4); }
function d2(v){ return dec(v, 2); }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }

// ---------- @component D8 normalTable — standard normal left areas as a z-table would give them ----------
// Phi(z) exact (series); T(z) = table value: z rounded to 2 decimals, area rounded to 4. zr(v) rounds a z-score to 2 decimals.
function Phi(z){
  if (z < -6) return 0; if (z > 6) return 1;
  var s = z, t = z, z2 = z * z;
  for (var k = 1; k < 200; k++) { t *= z2 / (2 * k + 1); s += t; if (Math.abs(t) < 1e-17 * Math.abs(s)) break; }
  return 0.5 + s * Math.exp(-z2 / 2) / Math.sqrt(2 * Math.PI);
}
function zr(v){ return Math.round(v * 100 + (v >= 0 ? 1e-9 : -1e-9)) / 100; }
function T(z){ return Math.round(Phi(zr(z)) * 1e4) / 1e4; }

// ---------- the binomial model (exact sums for display) ----------
var LF = [0];
function lf(n){ while (LF.length <= n) LF.push(LF[LF.length - 1] + Math.log(LF.length)); return LF[n]; }
function pmf(n, p){
  var out = [], lp = Math.log(p), lq = Math.log(1 - p);
  for (var x = 0; x <= n; x++) out.push(Math.exp(lf(n) - lf(x) - lf(n - x) + x * lp + (n - x) * lq));
  return out;
}
function model(n, p){ var mu = n * p, v = n * p * (1 - p); return { n:n, p:p, mu:mu, v:v, sd:Math.sqrt(v), pmf:pmf(n, p) }; }
function sdTxt(md){ var s = md.sd; return Math.abs(s - Math.round(s)) < 1e-9 ? String(Math.round(s)) : d2(s); }
// events: ge X >= k, gt X > k, le X <= k, lt X < k, eq X = k, bi a <= X <= b, bs a < X < b
var EVS = [["ge", "X ≥ k"], ["gt", "X > k"], ["le", "X ≤ k"], ["lt", "X < k"], ["eq", "X = k"], ["bi", "a ≤ X ≤ b"], ["bs", "a < X < b"]];
function evInfo(e, k, a, b, cc){
  var h = cc ? 0.5 : 0, r;
  if (e === "ge") r = { lo:k, hi:Infinity, L:k - h, R:null, t:"X >= " + k };
  else if (e === "gt") r = { lo:k + 1, hi:Infinity, L:k + h, R:null, t:"X > " + k };
  else if (e === "le") r = { lo:-Infinity, hi:k, L:null, R:k + h, t:"X <= " + k };
  else if (e === "lt") r = { lo:-Infinity, hi:k - 1, L:null, R:k - h, t:"X < " + k };
  else if (e === "eq") r = { lo:k, hi:k, L:k - h, R:k + h, t:"X = " + k };
  else if (e === "bi") r = { lo:a, hi:b, L:a - h, R:b + h, t:a + " <= X <= " + b };
  else r = { lo:a + 1, hi:b - 1, L:a + h, R:b - h, t:a + " < X < " + b };
  r.y = r.L != null && r.R != null ? fmtB(r.L) + " < Y < " + fmtB(r.R) : r.L != null ? "Y > " + fmtB(r.L) : "Y < " + fmtB(r.R);
  return r;
}
function fmtB(v){ return trim(v, 2); }
function exactOf(md, ev){ var s = 0; for (var x = Math.max(0, ev.lo); x <= Math.min(md.n, ev.hi); x++) s += md.pmf[x]; return s; }
// table approximation: {v, zL, zR, tL, tR, txt}
function approxOf(md, ev){
  var o = { zL:null, zR:null };
  if (ev.L != null && ev.R != null && ev.L >= ev.R) { o.v = 0; o.txt = "0"; o.zero = true; return o; }
  if (ev.L != null) { o.zL = zr((ev.L - md.mu) / md.sd); o.tL = T(o.zL); }
  if (ev.R != null) { o.zR = zr((ev.R - md.mu) / md.sd); o.tR = T(o.zR); }
  o.v = Math.round(((o.zR != null ? o.tR : 1) - (o.zL != null ? o.tL : 0)) * 1e4) / 1e4;
  o.txt = o.zL != null && o.zR != null ? d4(o.tR) + " − " + d4(o.tL) + " = " + d4(o.v) : o.zL != null ? "1 − " + d4(o.tL) + " = " + d4(o.v) : d4(o.v);
  return o;
}
function zLine(md, b, z){ var s = sdTxt(md), exact = Math.abs(md.sd - Math.round(md.sd)) < 1e-9 && Math.abs((b - md.mu) / md.sd - z) < 1e-9; return M("z = (" + fmtB(b) + " - " + trim(md.mu, 3) + ") ÷ " + s + (exact ? " = " : " ≈ ") + d2(z)); }

// ---------- @component D7 overlayChart — probability histogram (D7) with the D8 normal overlay, on the toolkit's Plot engine ----------
// Bars of width 1 (--pen; drawn as one filled path when narrower than 2 px); normal curve (--ink, 2.4 px, alpha curveA);
// shaded area under the curve between L and R (--hi-soft); included bars outlined (--ink); boundary lines (--ink-2 dashed)
// with labels; a zero-width line (P(Y = k) = 0). o = {md, x0, x1, ymax, step, curveA, shade:{L, R}, outline:{lo, hi}, marks:[x],
// zline:x, dim, hideBars, describe}
function niceY(m){ var steps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5], st = steps.filter(function(s){ return m / s <= 5; })[0] || 0.5; return { ymax:Math.max(st, Math.ceil(m / st - 1e-9) * st), step:st }; }
function rangeOf(md, extra){
  var x0 = Math.floor(md.mu - 4 * md.sd), x1 = Math.ceil(md.mu + 4 * md.sd);
  (extra || []).forEach(function(v){ if (v == null || !isFinite(v)) return; v = Math.max(-1, Math.min(md.n + 1, v)); x0 = Math.min(x0, Math.floor(v - 1)); x1 = Math.max(x1, Math.ceil(v + 1)); });
  x0 = Math.max(x0, -Math.max(3, Math.ceil(md.sd * 4))); x1 = Math.min(x1, md.n + Math.max(3, Math.ceil(md.sd * 4)));
  while (x1 - x0 < 10) { x0--; x1++; }
  var mx = 0; for (var x = Math.max(0, x0); x <= Math.min(md.n, x1); x++) mx = Math.max(mx, md.pmf[x]);
  var peak = 1 / (md.sd * Math.sqrt(2 * Math.PI)), y = niceY(Math.max(mx, Math.min(peak, mx * 1.3)) * 1.06);
  return { x0:x0, x1:x1, ymax:y.ymax, step:y.step };
}
function overlayChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(200, r.width), H = Math.max(140, r.height), md = o.md;
  var L = 46, R = 12, Tp = 26, B = 30, span = o.x1 - o.x0 + 1, bw = (W - L - R) / span, ys = (H - Tp - B) / o.ymax;
  var view = { xmin:o.x0 - 0.5 - L / bw, xmax:o.x1 + 0.5 + R / bw, ymin:-B / ys, ymax:o.ymax + Tp / ys };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(o.x0 - 0.5), xb = X(o.x1 + 0.5), y0 = Y(0), yt = Y(o.ymax);
    var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM, v, x;
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    for (v = o.step; v <= o.ymax + 1e-9; v += o.step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += o.step) ctx.fillText(MV.num(Math.round(v * 1e6) / 1e6, o.step < 0.1 ? 2 : 1), xa - 6, Y(v));
    ctx.save(); ctx.beginPath(); ctx.rect(xa, yt - 6, xb - xa, y0 - yt + 6); ctx.clip();
    var top = function(h){ return Math.max(yt - 4, Y(Math.min(h, o.ymax * 1.03))); }, lo = Math.max(0, o.x0), hi = Math.min(md.n, o.x1);
    if (!o.hideBars) {
      ctx.globalAlpha = o.dim ? 0.55 : 1; ctx.fillStyle = pen;
      if (bw < 2) { ctx.beginPath(); ctx.moveTo(X(lo - 0.5), y0); for (x = lo; x <= hi; x++) { var ty = top(md.pmf[x]); ctx.lineTo(X(x - 0.5), ty); ctx.lineTo(X(x + 0.5), ty); } ctx.lineTo(X(hi + 0.5), y0); ctx.closePath(); ctx.fill(); }
      else for (x = lo; x <= hi; x++) { var t1 = top(md.pmf[x]), x1 = X(x - 0.5), x2 = X(x + 0.5); if (y0 - t1 < 0.3) continue; ctx.fillRect(x1, t1, x2 - x1, y0 - t1); if (bw > 4) { ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, t1 + 0.5, x2 - x1 - 1, y0 - t1 - 1); } }
      ctx.globalAlpha = 1;
    }
    var f = function(xx){ var u = (xx - md.mu) / md.sd; return Math.exp(-u * u / 2) / (md.sd * Math.sqrt(2 * Math.PI)); };
    var cx0 = o.x0 - 0.5, cx1 = o.x1 + 0.5, N = Math.max(80, Math.round(xb - xa));
    if (o.shade) {
      var sL = o.shade.L == null ? cx0 : Math.max(cx0, o.shade.L), sR = o.shade.R == null ? cx1 : Math.min(cx1, o.shade.R);
      if (sR > sL) {
        ctx.beginPath(); ctx.moveTo(X(sL), y0); var m = Math.max(8, Math.round((X(sR) - X(sL)) / 2));
        for (var i = 0; i <= m; i++) { var sx = sL + (sR - sL) * i / m; ctx.lineTo(X(sx), Y(f(sx))); }
        ctx.lineTo(X(sR), y0); ctx.closePath(); ctx.globalAlpha = 0.82; ctx.fillStyle = css("--hi-soft"); ctx.fill(); ctx.globalAlpha = 1;
      }
    }
    if (o.outline && !o.hideBars) {
      ctx.strokeStyle = ink; ctx.lineWidth = bw < 3 ? 1 : 2;
      var ol = Math.max(lo, o.outline.lo), oh = Math.min(hi, o.outline.hi);
      if (oh - ol > 40 || bw < 3) { if (oh >= ol) { ctx.beginPath(); ctx.moveTo(X(ol - 0.5), y0); for (x = ol; x <= oh; x++) { var ty2 = top(md.pmf[x]); ctx.lineTo(X(x - 0.5), ty2); ctx.lineTo(X(x + 0.5), ty2); } ctx.lineTo(X(oh + 0.5), y0); ctx.stroke(); } }
      else for (x = ol; x <= oh; x++) { var t2 = top(md.pmf[x]); ctx.strokeRect(X(x - 0.5) + 1, t2 + 1, X(x + 0.5) - X(x - 0.5) - 2, y0 - t2 - 1); }
    }
    if (o.curveA > 0) {
      ctx.globalAlpha = o.curveA; ctx.strokeStyle = ink; ctx.lineWidth = 2.4; ctx.lineJoin = "round"; ctx.beginPath();
      for (var j = 0; j <= N; j++) { var qx = cx0 + (cx1 - cx0) * j / N, qy = Y(Math.min(f(qx), o.ymax * 1.2)); if (j) ctx.lineTo(X(qx), qy); else ctx.moveTo(X(qx), qy); }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    if (o.zline != null) { var zx = X(o.zline); ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(zx, y0); ctx.lineTo(zx, Y(f(o.zline))); ctx.stroke(); }
    ctx.restore();
    (o.marks || []).forEach(function(mk, idx, all){
      if (mk < o.x0 - 0.5 || mk > o.x1 + 0.5) return;
      var mx2 = X(mk); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(mx2, y0); ctx.lineTo(mx2, yt - 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = "600 12px " + fUI; ctx.textBaseline = "bottom"; var tx = fmtB(mk).replace("-", MV.MINUS), tw = ctx.measureText(tx).width;
      ctx.textAlign = all.length === 2 ? (idx === 0 ? "right" : "left") : "center";
      var lx = all.length === 2 ? mx2 + (idx === 0 ? -3 : 3) : Math.max(xa + tw / 2, Math.min(xb - tw / 2, mx2));
      ctx.fillStyle = sheet; ctx.globalAlpha = 0.9; ctx.fillRect(ctx.textAlign === "right" ? lx - tw - 2 : ctx.textAlign === "left" ? lx - 2 : lx - tw / 2 - 2, yt - 18, tw + 4, 16); ctx.globalAlpha = 1;
      ctx.fillStyle = ink2; ctx.fillText(tx, lx, yt - 3);
    });
    if (o.zline != null) { ctx.font = "600 12px " + fUI; ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("P(Y = " + o.zline + ") = 0: a line has no area", Math.min(X(o.zline) + 6, xb - 210), yt - 3); }
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xa, yt - 6); ctx.lineTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    ctx.fillStyle = ink; ctx.font = "13px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var every = [1, 2, 5, 10, 20, 25, 50, 100].filter(function(k){ return bw * k >= 28; })[0] || 100;
    for (x = Math.ceil(o.x0 / every) * every; x <= o.x1; x += every) ctx.fillText(String(x).replace("-", MV.MINUS), X(x), y0 + 6);
    ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("P(X = x)", 4, 3);
  } });
}

// ---------- D8 z-table panel (added to several views) ----------
function zTableHTML(){
  var cols = "", rows = "", c, r;
  for (c = 0; c < 10; c++) cols += "<th scope=\"col\">" + (c / 100).toFixed(2).slice(1) + "</th>";
  function row(sign, t){
    var lab = (sign < 0 ? MV.MINUS : "") + (t / 10).toFixed(1), h = "<tr><th scope=\"row\">" + lab + "</th>";
    for (var cc = 0; cc < 10; cc++) h += "<td>" + d4(Phi(sign * (t / 10 + cc / 100))) + "</td>";
    return h + "</tr>";
  }
  for (r = 34; r >= 0; r--) rows += row(-1, r);
  for (r = 0; r <= 34; r++) rows += row(1, r);
  return '<details class="na-zt"><summary>' + M("z") + "-table: left areas " + M("P(Z < z)") + "</summary>" +
    '<div class="na-zt-in"><label class="na-zt-look"><span>Look up ' + M("z") + ':</span><input type="number" step="0.01" min="-3.49" max="3.49" class="numin na-zt-z" autocomplete="off"></label><output class="na-zt-out" aria-live="polite"></output>' +
    '<p class="tiny muted">Row: ' + M("z") + " to 1 decimal place; column: the second decimal place. For a negative " + M("z") + ", read the row with the minus sign (" + M("z = -1.10") + " is row −1.1, column .00; " + M("z = -1.19") + " is row −1.1, column .09).</p>" +
    '<div class="tbl-wrap na-zt-wrap"><table class="na-zt-t"><caption class="vh">Standard normal table of left areas</caption><thead><tr><th scope="col">' + M("z") + "</th>" + cols + "</tr></thead><tbody>" + rows + "</tbody></table></div></div></details>";
}
var ZT_VIEWS = ["start", "explore", "fails", "practice", "final-check"];
function ensureZT(){
  ZT_VIEWS.forEach(function(v){
    var sec = document.querySelector('.view[data-view="' + v + '"]'); if (!sec || sec.querySelector(".na-zt")) return;
    var intro = sec.querySelector(".intro"), d = document.createElement("div"); d.className = "na-ztbox"; d.innerHTML = zTableHTML();
    if (intro && intro.parentNode === sec) intro.insertAdjacentElement("afterend", d); else sec.insertBefore(d, sec.firstChild);
  });
}
document.addEventListener("input", function(e){
  var t = e.target; if (!t.classList || !t.classList.contains("na-zt-z")) return;
  var out = t.closest(".na-zt-in").querySelector(".na-zt-out"), v = parseFloat(String(t.value).replace(MV.MINUS, "-"));
  if (!isFinite(v)) { out.textContent = ""; return; }
  var z = zr(Math.max(-3.49, Math.min(3.49, v)));
  out.innerHTML = M("P(Z < " + d2(z).replace(MV.MINUS, "-") + ") = " + d4(Phi(z)));
});

// @component radioGroup (copied from MDM4U 21 / 18) — segmented control or chip row as a real radio group
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// ---------- hero ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), cap = f.cap, st = { n:100, curveA:1, mark:1, shade:1 };
  function draw(){
    var n = Math.round(st.n), md = model(n, 0.5), rg = rangeOf(md, [60]);
    var w = Math.max(0, Math.min(1, (n - 10) / 90)), x0 = Math.round(rg.x0), x1 = Math.round(rg.x1);
    if (st.mark || st.shade) { x0 = 30; x1 = 70; }
    var y = niceY(md.pmf[Math.round(md.mu)] * 1.12 + (1 - w) * 0.02);
    overlayChart(plot, { md:md, x0:x0, x1:x1, ymax:y.ymax, step:y.step, curveA:st.curveA, outline:st.mark && n >= 60 ? { lo:60, hi:60 } : null,
      shade:st.shade ? { L:59.5, R:59.5 + st.shade } : null, marks:st.mark ? [59.5, 60.5] : [],
      describe:"Binomial histogram, n = " + n + ", p = 0.5" + (st.curveA > 0.5 ? ", with a normal curve of mean " + trim(md.mu, 1) + " and SD " + sdTxt(md) : "") + (st.mark ? ". The bar at 60 runs from 59.5 to 60.5" + (st.shade >= 1 ? ", and the area under the curve over it is shaded." : ".") : ".") });
  }
  plot.render = draw;
  function last(){ st = { n:100, curveA:1, mark:1, shade:1 }; draw(); cap.textContent = "The bar at 60 runs from 59.5 to 60.5: the normal area over it matches the bar."; }
  if (MV.reduceMotion) { last(); return; }
  st = { n:10, curveA:0, mark:0, shade:0 }; draw(); cap.textContent = "A binomial histogram: n = 10, p = 0.5";
  MV.wait(600, function(){
    MV.tween({ dur:2600, step:function(t){ st.n = 10 + 90 * t; draw(); cap.textContent = "More trials: n = " + Math.round(st.n) + " (the bars narrow and multiply)"; }, done:function(){
      st.n = 100; cap.textContent = "A normal curve with μ = np = 50 and σ = √(npq) = 5";
      MV.tween({ dur:900, step:function(t){ st.curveA = t; draw(); }, done:function(){
        MV.wait(700, function(){
          st.mark = 1; draw(); cap.textContent = "The bar at 60 has edges at 59.5 and 60.5";
          MV.wait(1100, function(){
            MV.tween({ dur:1000, step:function(t){ st.shade = t; draw(); }, done:function(){ MV.wait(300, last); } });
          });
        });
      } });
    } });
  });
}

// ---------- Explore: Overlay ----------
var NCH = [25, 100, 400, 625], PCH = [5, 10, 20, 50];
function nToI(n){ return n <= 100 ? n - 5 : Math.min(155, 95 + Math.round((n - 100) / 5)); }
function iToN(i){ i = clampI(i, 0, 155, 95); return i <= 95 ? i + 5 : 100 + (i - 95) * 5; }
var DEF = { n:100, pk:50, mode:"over", ev:"ge", k:60, a:45, b:55, cc:true, log:[] };
function explore(host, api){
  var S = api.S, pv = {}, anim = null, msg = "";
  function sanitize(){
    if (S.n == null) Object.keys(DEF).forEach(function(k){ S[k] = Array.isArray(DEF[k]) ? [] : DEF[k]; });
    S.n = clampI(S.n, 5, 625, 100); if (S.n > 100 && S.n % 5 && S.n !== 625) S.n = Math.round(S.n / 5) * 5; if (S.n > 400 && S.n !== 625) S.n = 400;
    S.pk = clampI(S.pk, 2, 98, 50);
    if (["over", "corr", "err"].indexOf(S.mode) < 0) S.mode = "over";
    if (!EVS.some(function(e){ return e[0] === S.ev; })) S.ev = "ge";
    S.k = clampI(S.k, 0, S.n, Math.min(S.n, 60)); S.a = clampI(S.a, 0, S.n, 0); S.b = clampI(S.b, 0, S.n, S.n); if (S.b < S.a) S.b = S.a;
    S.cc = S.cc !== false; if (!Array.isArray(S.log)) S.log = [];
  }
  sanitize();
  host.innerHTML =
    '<div id="na-mode" class="na-mode"></div>' +
    '<div class="na-pg"><div class="na-main" data-mv="graph"><div class="eq-cap na-cap" id="na-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="na-sls"><label class="slider"><span class="slider-top"><span>Trials ' + M("n") + '</span><output id="na-n-out"></output></span><input type="range" id="na-n" min="0" max="155" step="1"></label><div id="na-nch"></div>' +
        '<label class="slider"><span class="slider-top"><span>Probability of success ' + M("p") + '</span><output id="na-p-out"></output></span><input type="range" id="na-p" min="2" max="98" step="1"></label><div id="na-pch"></div></div>' +
      '<p class="na-badges" id="na-badges" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot na-plot" id="na-plot" role="img" aria-label="Binomial histogram with a normal curve"></canvas></div>' +
      '<div class="na-ev" id="na-ev"><label class="na-sel"><span class="rg-lab">Event</span><select id="na-evsel">' + EVS.map(function(e){ return '<option value="' + e[0] + '">' + e[1] + "</option>"; }).join("") + "</select></label>" +
        '<span class="na-steps" id="na-steps"></span>' +
        '<button type="button" class="na-sw" role="switch" id="na-cc" aria-checked="true" data-k="nacc"><span class="na-track" aria-hidden="true"><span class="na-knob"></span></span>Continuity correction</button></div>' +
      '<div id="na-errbox" class="na-errbox"></div>' +
      '<p class="tiny na-msg" id="na-msg" aria-live="polite"></p></div>' +
    '<div class="na-read"><dl class="read" id="na-read" aria-live="polite"></dl></div></div>';
  var plot = new MV.Plot($("#na-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = paintChart;
  var modeR = radios($("#na-mode", host), { label:"Mode", options:[{ id:"over", t:"Overlay" }, { id:"corr", t:"Correction" }, { id:"err", t:"Error" }], value:S.mode, onChange:function(v){ user(); S.mode = v; changed(); } });
  var nR = radios($("#na-nch", host), { label:"", aria:"n chips", options:NCH.map(function(v){ return { id:v, t:"<i>n</i> = " + v, aria:"n = " + v }; }), value:S.n, cls:"chips", onChange:function(v){ user(); S.n = +v; changed(); } });
  var pR = radios($("#na-pch", host), { label:"", aria:"p chips", options:PCH.map(function(v){ return { id:v, t:"<i>p</i> = " + trim(v / 100, 2), aria:"p = " + trim(v / 100, 2) }; }), value:S.pk, cls:"chips", onChange:function(v){ user(); S.pk = +v; changed(); } });
  function save(){ api.save(); }
  function md(){ return model(pv.n != null ? Math.round(pv.n) : S.n, S.pk / 100); }
  function ev(cc){ return evInfo(S.ev, S.k, S.a, S.b, cc == null ? S.cc : cc); }
  function evOn(){ return S.mode !== "over"; }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); msg = ""; }
  function changed(){ sanitize(); if (S.mode === "err") logRow(); save(); render(); MV.changed(); }
  function logRow(){
    var key = S.n + "|" + S.pk + "|" + ev(true).t; if (S.log.length && S.log[S.log.length - 1].key === key) return;
    var m = md(), e1 = ev(true), e0 = ev(false), ex = exactOf(m, e1), a1 = approxOf(m, e1).v, a0 = approxOf(m, e0).v;
    S.log.push({ key:key, n:S.n, p:trim(S.pk / 100, 2), t:e1.t, ex:d4(ex), a1:d4(a1), e1:d4(Math.abs(ex - a1)), a0:d4(a0), e0:d4(Math.abs(ex - a0)) });
    if (S.log.length > 8) S.log.splice(0, S.log.length - 8);
  }
  // --- animation bookkeeping (from MDM4U 21): any user action cancels the running animation and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } render(); MV.changed(); }

  function render(){
    sanitize();
    var m = md(), n = m.n;
    modeR.set(S.mode); nR.set(NCH.indexOf(n) >= 0 ? n : ""); pR.set(PCH.indexOf(S.pk) >= 0 ? S.pk : "");
    var nIn = $("#na-n", host); nIn.value = nToI(n); $("#na-n-out", host).textContent = String(n); nIn.setAttribute("aria-valuetext", "n = " + n);
    var pIn = $("#na-p", host); pIn.value = S.pk; $("#na-p-out", host).textContent = trim(S.pk / 100, 2); pIn.setAttribute("aria-valuetext", "p = " + trim(S.pk / 100, 2));
    $("#na-ev", host).hidden = !evOn(); $("#na-evsel", host).value = S.ev;
    $("#na-cc", host).setAttribute("aria-checked", String(S.cc));
    paintSteps(); paintBadges(m); paintChart(); paintRead(); paintErr(); paintCap(m);
    $("#na-msg", host).innerHTML = msg;
    var busy = !!anim; host.querySelectorAll("#na-n, #na-p, #na-evsel, #na-cc, [data-st], .na-stin").forEach(function(el){ el.disabled = busy; });
    modeR.lock(busy); nR.lock(busy); pR.lock(busy);
  }
  function paintSteps(){
    var box = $("#na-steps", host), two = S.ev === "bi" || S.ev === "bs", ids = two ? ["a", "b"] : ["k"];
    var h = ids.map(function(id){ return '<span class="na-step"><span class="rg-lab">' + M(id) + '</span><button type="button" class="btn sm ghost" data-st="' + id + '-" data-k="na' + id + 'm" aria-label="Decrease ' + id + '">−</button><input type="number" class="numin na-stin" data-sv="' + id + '" min="0" max="' + S.n + '" step="1" value="' + S[id] + '" aria-label="' + id + '"><button type="button" class="btn sm ghost" data-st="' + id + '+" data-k="na' + id + 'p" aria-label="Increase ' + id + '">+</button></span>'; }).join("");
    if (box.dataset.h !== h) { MV.keepFocus(box, function(){ box.innerHTML = h; }); box.dataset.h = h; }
    else ids.forEach(function(id){ var inp = box.querySelector('[data-sv="' + id + '"]'); if (inp && document.activeElement !== inp) inp.value = S[id]; });
  }
  function condTxt(m){
    var np = m.n * m.p, nq = m.n * (1 - m.p), okN = S.n * S.pk > 500, okQ = S.n * (100 - S.pk) > 500;
    return { ok:okN && okQ, np:np, nq:nq, okN:okN, okQ:okQ,
      html:M("np = " + trim(np, 2) + (okN ? " > 5" : " <= 5")) + (okN ? " ✓" : " ✗") + " · " + M("nq = " + trim(nq, 2) + (okQ ? " > 5" : " <= 5")) + (okQ ? " ✓" : " ✗") };
  }
  function paintBadges(m){
    var c = condTxt(m);
    $("#na-badges", host).innerHTML = '<span class="na-badge ' + (c.okN ? "ok" : "no") + '">' + M("np = " + trim(c.np, 2)) + (c.okN ? " > 5 ✓" : " ≤ 5 ✗") + '</span><span class="na-badge ' + (c.okQ ? "ok" : "no") + '">' + M("nq = " + trim(c.nq, 2)) + (c.okQ ? " > 5 ✓" : " ≤ 5 ✗") + "</span>" + (c.ok ? "" : '<span class="na-warn">Approximation not recommended</span>');
  }
  function paintCap(m){ var c = $("#na-cap", host); c.innerHTML = pv.cap != null ? MV.md(pv.cap) : M("B(" + m.n + ", " + trim(m.p, 2) + ") ≈ N(" + trim(m.mu, 2) + ", " + sdTxt(m) + "^2)"); }
  function paintChart(){
    var m = md(), e = ev(), on = evOn() && !pv.noEv, rg = rangeOf(m, on ? [e.L, e.R, isFinite(e.lo) ? e.lo : null, isFinite(e.hi) ? e.hi : null] : []);
    if (pv.x0 != null) { rg.x0 = pv.x0; rg.x1 = pv.x1; }
    if (pv.ymax) { rg.ymax = pv.ymax; rg.step = pv.step; }
    var zero = on && S.ev === "eq" && !S.cc, shade = on && !zero ? { L:e.L, R:e.R } : null;
    if (shade && pv.sweep != null) shade = { L:pv.sweep, R:null };
    if (shade && pv.grow != null) shade = { L:e.L, R:e.L + (e.R - e.L) * pv.grow };
    var marks = on && !zero ? [e.L, e.R].filter(function(v){ return v != null; }) : [];
    if (pv.sweep != null) marks = [pv.sweep];
    overlayChart(plot, { md:m, x0:rg.x0, x1:rg.x1, ymax:rg.ymax, step:rg.step, curveA:pv.curveA != null ? pv.curveA : 1, dim:on, shade:pv.noShade ? null : shade,
      outline:on && !pv.noShade ? { lo:e.lo, hi:e.hi } : null, marks:pv.noShade ? [] : marks, zline:zero && !pv.noShade ? S.k : null, describe:describe(m, e, on) });
  }
  function describe(m, e, on){
    var t = "Binomial n = " + m.n + ", p = " + trim(m.p, 2) + ", with a normal curve of mean " + trim(m.mu, 2) + " and SD " + sdTxt(m);
    if (pv.curveA === 0) t = "Binomial n = " + m.n + ", p = " + trim(m.p, 2) + "; the normal curve is hidden until the reveal";
    if (on && !pv.noShade) t += "; event " + MV.plain(M(e.t)) + (S.ev === "eq" && !S.cc ? ", no correction: a single line at " + S.k + " with zero area" : ", " + (S.cc ? "boundary " : "no correction, boundary ") + [e.L, e.R].filter(function(v){ return v != null; }).map(fmtB).join(" and "));
    return t + ".";
  }
  function paintRead(){
    var m = md(), c = condTxt(m), rows = [], Q = '<span class="na-q">?</span>', hide = !!pv.hide;
    rows.push(["Conditions", c.html + (c.ok ? "" : '<br><span class="na-warn">approximation not recommended</span>')]);
    var V = m.v, vs = trim(V, 4), sd = sdTxt(m), whole = Math.abs(m.sd - Math.round(m.sd)) < 1e-9;
    rows.push(["Normal model", M("μ = np = " + trim(m.mu, 2)) + ", " + M("σ = √{npq} = √{" + vs + "}" + (whole ? " = " : " ≈ ") + sd)]);
    if (!evOn()) { rows.push(["Event", '<span class="muted">Choose Correction or Error to pick an event.</span>']); $("#na-read", host).innerHTML = MV.readoutHTML(rows); return; }
    var e1 = ev(true), e0 = ev(false), a1 = approxOf(m, e1), a0 = approxOf(m, e0), ex = exactOf(m, e1);
    var rule = S.ev === "ge" ? "includes the bar at " + S.k + ", which starts at " + fmtB(S.k - 0.5) : S.ev === "gt" ? "starts at " + (S.k + 1) + ", whose bar starts at " + fmtB(S.k + 0.5) : S.ev === "le" ? "includes the bar at " + S.k + ", which ends at " + fmtB(S.k + 0.5) : S.ev === "lt" ? "stops at " + (S.k - 1) + ", whose bar ends at " + fmtB(S.k - 0.5) : S.ev === "eq" ? "one bar, from " + fmtB(S.k - 0.5) + " to " + fmtB(S.k + 0.5) : S.ev === "bi" ? "bars " + S.a + " to " + S.b + ": go half a unit outward" : "bars " + (S.a + 1) + " to " + (S.b - 1) + ": the ends " + S.a + " and " + S.b + " are left out";
    rows.push(["Event and boundary", M(e1.t) + " → " + M(e1.y) + ' <span class="tiny muted">(' + rule + ")</span>" + (S.cc ? "" : '<br><span class="tiny">Correction off: ' + (a0.zero ? M("P(Y = " + S.k + ") = 0") : M(e0.y)) + "</span>")]);
    var zl = []; if (a1.zL != null) zl.push(zLine(m, e1.L, a1.zL)); if (a1.zR != null) zl.push(zLine(m, e1.R, a1.zR));
    rows.push([M("z"), hide ? Q : zl.join("<br>") || "—"]);
    rows.push(["Approximate (with correction)", hide ? Q : a1.txt]);
    rows.push(['<span class="muted">Approximate (no correction)</span>', hide ? Q : '<span class="muted">' + (a0.zero ? "0 (a line has no area)" : d4(a0.v)) + "</span>"]);
    rows.push(["Exact (by the tool)", hide ? Q : d4(ex)]);
    rows.push(["Error", hide ? Q : d4(Math.abs(ex - a1.v)) + (S.cc ? "" : ' <span class="tiny muted">(no correction: ' + d4(Math.abs(ex - a0.v)) + ")</span>")]);
    $("#na-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintErr(){
    var box = $("#na-errbox", host); if (S.mode !== "err") { box.innerHTML = ""; return; }
    var rows = S.log.slice().reverse().map(function(r){ return "<tr><td>" + r.n + "</td><td>" + r.p + "</td><td>" + M(r.t) + "</td><td>" + r.ex + "</td><td>" + r.a1 + "</td><td>" + r.e1 + '</td><td class="muted">' + r.a0 + '</td><td class="muted">' + r.e0 + "</td></tr>"; }).join("");
    var h = '<p class="tiny muted">Each new setting adds a row (newest first, up to 8).</p><div class="tbl-wrap na-errwrap"><table class="na-errt"><caption class="vh">Exact and approximate values</caption><thead><tr><th scope="col">' + M("n") + '</th><th scope="col">' + M("p") + '</th><th scope="col">Event</th><th scope="col">Exact</th><th scope="col">With correction</th><th scope="col">Error</th><th scope="col">No correction</th><th scope="col">Error</th></tr></thead><tbody>' + (rows || '<tr><td colspan="8" class="muted">Change n, p or the event to add rows.</td></tr>') + "</tbody></table></div>" +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="na-clr" data-k="naclr">Clear the table</button></div>';
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  // --- events ---
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "na-n") { user(); S.n = iToN(t.value); changed(); return; }
    if (t.id === "na-p") { user(); S.pk = clampI(t.value, 2, 98, 50); changed(); return; }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.id === "na-evsel") { user(); S.ev = t.value; changed(); return; }
    if (t.dataset && t.dataset.sv) { user(); setV(t.dataset.sv, t.value); }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.sv) { user(); setV(e.target.dataset.sv, e.target.value); } });
  function setV(id, v){
    v = clampI(v, 0, S.n, S[id]);
    if (id === "a") v = Math.min(v, S.b); if (id === "b") v = Math.max(v, S.a);
    S[id] = v; changed();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    if (b.id === "na-cc") { user(); S.cc = !S.cc; changed(); return; }
    if (b.id === "na-clr") { S.log = []; save(); render(); return; }
    if (b.dataset.st) { user(); var id = b.dataset.st[0], d = b.dataset.st[1] === "+" ? 1 : -1; setV(id, S[id] + d); }
  });
  render();

  // --- predictions ---
  function setState(o){ Object.keys(o).forEach(function(k){ S[k] = o[k]; }); sanitize(); }
  function startPred(p){
    user(); var s = p.start || {};
    setState({ mode:s.mode, n:s.n, pk:s.p, ev:s.ev || S.ev, k:s.k != null ? s.k : S.k, cc:true });
    if (p.id === "p1") pv = { hide:true };
    else if (p.id === "p2") pv = { hide:true, curveA:0 };
    else if (p.id === "p3") pv = { hide:true, noShade:true };
    else { S.cc = false; pv = { hide:true, noShade:true }; }
    save(); render(); MV.changed();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") {
      var rg10 = rangeOf(model(10, 0.5)), rg100 = rangeOf(model(100, 0.5));
      pv.cap = "`n`: 10 → 100";
      anim.stops.push(MV.tween({ dur:2400, step:function(t){ var n = Math.round(10 + 90 * t); pv.n = n; pv.x0 = Math.round(rg10.x0 + (rg100.x0 - rg10.x0) * t); pv.x1 = Math.round(rg10.x1 + (rg100.x1 - rg10.x1) * t); var y = rangeOf(model(n, 0.5)); pv.ymax = y.ymax; pv.step = y.step; render(); },
        done:function(){ pv = { cap:"`n = 100`: the bars hug the curve" }; S.n = 100; save(); render(); later(600, function(){ endAnim(); }); } }));
      return;
    }
    if (p.id === "p2") {
      pv.cap = "`np = 100 × 0.02 = 2`";
      anim.stops.push(MV.tween({ dur:1400, step:function(t){ pv.curveA = t; render(); }, done:function(){
        pv = { cap:"Bunched against 0 with a long right tail; the curve spills below 0" }; render(); later(700, function(){ endAnim(); }); } }));
      return;
    }
    if (p.id === "p3") {
      var m = md(), rg = rangeOf(m, [59.5]);
      pv.noShade = false; pv.cap = "Shading from the right…";
      anim.stops.push(MV.tween({ dur:1600, step:function(t){ pv.sweep = rg.x1 + 0.5 - (rg.x1 + 0.5 - 59.5) * t; paintChart(); }, done:function(){
        pv = { cap:"The bar for 60 runs from 59.5 to 60.5: start at 59.5" }; render(); later(700, function(){ endAnim(); }); } }));
      render(); return;
    }
    pv.noShade = false; pv.cap = "A single line at 50: `P(Y = 50) = 0`"; render();
    later(1500, function(){
      S.cc = true; save(); pv.grow = 0; pv.cap = "Correction on: the bar from 49.5 to 50.5"; render();
      anim.stops.push(MV.tween({ dur:1100, step:function(t){ pv.grow = t; paintChart(); }, done:function(){
        pv = { cap:"`0.5398 - 0.4602 = 0.0796` (exact: 0.0796)" }; render(); later(700, function(){ endAnim(); }); } }));
    });
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (anim) return R("Wait for the animation to finish.");
    var m = md();
    if (id === "tc1") {
      if (S.pk !== 10) return R("Set `p = 0.1` first.");
      if (S.n === 51) return { ok:true };
      if (S.n === 50) return R("`np = 5` exactly: the condition is strictly greater than 5.");
      if (S.n < 50) return R("`np = " + trim(m.mu, 2) + "`, which isn’t more than 5.");
      return R("That works, but it isn’t the smallest.");
    }
    if (id === "tc2") {
      if (S.n !== 100 || S.pk !== 50) return R("Set `n = 100` and `p = 0.5` first.");
      if (S.mode !== "corr") return R("Switch to Correction mode and choose the event `a <= X <= b`.");
      if (S.ev === "bs" && S.a === 45 && S.b === 55) return R("‘<’ would leave out 45 and 55; the question includes them.");
      if (S.ev !== "bi") return R("Choose the event `a <= X <= b`.");
      if (S.a !== 45 || S.b !== 55) return R("Set `a = 45` and `b = 55`.");
      if (!S.cc) return R("Without it you get 0.6826, which misses half of each end bar.");
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.n !== 400 || S.pk !== 50) return R("A fair coin tossed 400 times: set `n = 400` and `p = 0.5`.");
      if (S.mode === "over") return R("Switch to Correction mode and choose the event `X >= k`.");
      if (S.ev !== "ge") return R("‘`k` or more heads’ is the event `X >= k`.");
      if (!S.cc) return R("Turn the continuity correction on: `X >= k` starts at `k - 0.5`.");
      if (S.k === 221) return { ok:true };
      if (S.k === 220) return R("With the correction, `X >= 220` starts at 219.5: `z = 1.95`, area 0.0256, just over 2.5%.");
      if (S.k < 200) return R("That’s the low end; heads must be high.");
      if (S.k > 221) return R("That works, but it isn’t the smallest.");
      return R("The area is " + d4(approxOf(m, ev(true)).v) + ", more than 0.025. Raise `k`.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: When does it fail? (four evidence stations) ----------
function part3(host, api){
  var S = api.S, ST = (api.content || {}).stations || [];
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0] && ST[0].id;
  S.st = obj(S.st);
  host.innerHTML = '<div id="nf-tabs" class="nf-tabs"></div><div class="nf-head" id="nf-head"></div><div class="plot-wrap"><canvas class="plot wide nf-plot" id="nf-plot" role="img" aria-label="Station histogram with a normal curve"></canvas></div><div id="nf-body" class="nf-body"></div>' +
    '<details class="alg nf-data"><summary>Check it with data</summary><div id="nf-data"></div></details>';
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function x(id){ return S.st[id] = obj(S.st[id]); }
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + (x(s.id).ok ? ' <span aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#nf-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  var plot = new MV.Plot($("#nf-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
  function cur(){ return ST.filter(function(s){ return s.id === S.cur; })[0] || ST[0]; }
  function rowVals(s, r){ var m = model(s.n, s.p), e = evInfo(r.ev, r.k, 0, 0, true), ex = exactOf(m, e), a = approxOf(m, e); return { m:m, e:e, ex:ex, a:a, err:Math.abs(ex - a.v) }; }
  function draw(){
    var s = cur(); if (!s) return;
    var m = model(s.n, s.p), r = s.rows && s.rows[0], e = r ? evInfo(r.ev, r.k, 0, 0, true) : null, rg = rangeOf(m, e ? [e.L, e.R] : []);
    overlayChart(plot, { md:m, x0:rg.x0, x1:rg.x1, ymax:rg.ymax, step:rg.step, curveA:1, dim:!!e, shade:e ? { L:e.L, R:e.R } : null, outline:e ? { lo:e.lo, hi:e.hi } : null, marks:e ? [e.L, e.R].filter(function(v){ return v != null; }) : [],
      describe:"Station: binomial n = " + s.n + ", p = " + s.p + " with a normal curve of mean " + trim(m.mu, 3) + " and SD " + d2(m.sd) + (m.mu < 3 * m.sd ? "; the bars are bunched near 0 with a long right tail, and the curve spills below 0" : "; the bars follow the curve closely") + (e ? "; shaded: " + MV.plain(M(e.y)) : "") + "." });
  }
  function paint(){
    tabText(); tabs.refresh();
    var s = cur(); if (!s) return;
    var i = ST.indexOf(s), xs = x(s.id), m = model(s.n, s.p);
    $("#nf-head", host).innerHTML = "<h3 class=\"nf-title\">Station " + (i + 1) + ": " + MV.md(s.t) + '</h3><p class="nf-set">' + M("n = " + s.n) + ", " + M("p = " + s.p) + ' <span class="na-badge ' + (s.n * s.p > 5 && s.n * (1 - s.p) > 5 ? "ok" : "no") + '">' + MV.md(s.badge) + "</span></p>";
    var h = "";
    if (s.rows) h += '<div class="tbl-wrap"><table class="nf-t"><caption class="vh">Exact and approximate values</caption><thead><tr><th scope="col">Event</th><th scope="col">Exact</th><th scope="col">Approximation</th><th scope="col">Error</th></tr></thead><tbody>' +
      s.rows.map(function(r){ var v = rowVals(s, r), z = []; if (v.a.zL != null) z.push(M("z = " + d2(v.a.zL).replace(MV.MINUS, "-"))); if (v.a.zR != null) z.push(M("z = " + d2(v.a.zR).replace(MV.MINUS, "-")));
        return "<tr><td>" + MV.md(r.label) + "</td><td>" + d4(v.ex) + "</td><td>" + d4(v.a.v) + " (" + z.join(", ") + ")</td><td>" + (v.err < 0.005 ? d4(v.err) : d2(v.err)) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    if (s.id === "s2") h += '<p class="tiny muted">' + M("X") + " can’t be negative, so " + M("X = 0") + " is the same as " + M("X <= 0") + ": the approximation uses " + M("Y < 0.5") + ".</p>";
    if (s.note) h += '<p class="nf-note">' + MV.md(s.note) + "</p>";
    var order = MV.shuffle(s.opts.map(function(o, k){ return k; }), "mdm28-" + s.id);
    h += '<div class="q nf-q" data-st="' + s.id + '"><p class="q-prompt">' + MV.md(s.q) + '</p><div class="opts">' + order.map(function(k){ var o = s.opts[k], c = "opt"; if (xs.pick === k) c += MV.ok(o) ? " right" : " wrong";
      return '<button type="button" class="' + c + '" data-o="' + k + '" data-k="nf' + s.id + k + '"' + (xs.ok ? " disabled" : "") + "><span>" + MV.md(o.t) + "</span></button>"; }).join("") + "</div>";
    if (xs.pick != null) { var o = s.opts[xs.pick]; h += MV.fbHTML(MV.ok(o) ? "good" : "bad", (MV.ok(o) ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + MV.md(o.fb) + (MV.ok(o) ? "" : " Try again.")); }
    h += "</div>";
    var nDone = ST.filter(function(q){ return x(q.id).ok; }).length;
    if (xs.ok) h += '<p class="nf-done"><strong>✓ Station ' + (i + 1) + " done.</strong> " + (nDone === ST.length ? "All four stations done. Try the quick check below." : "Choose another station above.") + "</p>";
    var body = $("#nf-body", host); MV.keepFocus(body, function(){ body.innerHTML = h; });
    paintData(); draw(); void m;
  }
  function paintData(){
    var rows = "";
    ST.forEach(function(s, i){
      if (!s.rows) { rows += "<tr><td>" + (i + 1) + "</td><td>" + M("n = " + s.n) + ", " + M("p = " + s.p) + "</td><td>—</td><td>—</td><td>—</td><td>" + M("np = " + trim(s.n * s.p, 3)) + ": not recommended</td></tr>"; return; }
      s.rows.forEach(function(r){ var v = rowVals(s, r); rows += "<tr><td>" + (i + 1) + "</td><td>" + M("n = " + s.n) + ", " + M("p = " + s.p) + "</td><td>" + MV.md(r.label) + "</td><td>" + d4(v.ex) + "</td><td>" + d4(v.a.v) + "</td><td>" + d4(v.err) + "</td></tr>"; });
    });
    $("#nf-data", host).innerHTML = '<p class="tiny">Exact values are sums of binomial terms worked out by the tool; approximations use the continuity correction and the table (' + M("z") + ' to 2 decimals).</p><div class="tbl-wrap"><table class="nf-t"><caption class="vh">Errors at every station</caption><thead><tr><th scope="col">Station</th><th scope="col">Setting</th><th scope="col">Event</th><th scope="col">Exact</th><th scope="col">Approximation</th><th scope="col">Error</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-o]"); if (!b || b.disabled) return;
    var s = cur(), xs = x(s.id), k = +b.dataset.o; xs.pick = k;
    if (MV.ok(s.opts[k])) xs.ok = true; else xs.tries = (xs.tries || 0) + 1;
    api.save(); paint(); MV.focusFb(host.querySelector('[data-st="' + s.id + '"]'));
  });
  paint();
  return {};
}

// ---------- Performance task: Catch a biased coin ----------
var task = (function(){
  var api = null, plot = null, nR = null, NS = [10, 25, 100, 400];
  function read(){ var s = api ? api.S : {}, n = NS.indexOf(+s.n) >= 0 ? +s.n : 100; return { n:n, k:clampI(s.k, 0, n, Math.round(n * 0.55)) }; }
  function tail(d){ var m = model(d.n, 0.5), a = approxOf(m, evInfo("ge", d.k, 0, 0, true)); return { m:m, a:a }; }
  function draw(){
    var d = read(), I = tail(d), rg = rangeOf(I.m, [d.k - 0.5]);
    overlayChart(plot, { md:I.m, x0:rg.x0, x1:rg.x1, ymax:rg.ymax, step:rg.step, curveA:1, dim:true, shade:{ L:d.k - 0.5, R:null }, outline:{ lo:d.k, hi:d.n }, marks:[d.k - 0.5],
      describe:"Fair coin, n = " + d.n + " tosses: binomial with a normal curve of mean " + trim(I.m.mu, 1) + " and SD " + sdTxt(I.m) + ". Shaded: X ≥ " + d.k + ", from " + fmtB(d.k - 0.5) + ". Approximate probability " + d4(I.a.v) + "." });
  }
  function paint(){
    var d = read(), I = tail(d), el = $("#nt-read"); if (!el) return;
    var inp = $("#nt-k"); if (inp && document.activeElement !== inp) inp.value = d.k; if (inp) inp.max = d.n;
    el.innerHTML = MV.readoutHTML([["Normal model", M("μ = " + trim(I.m.mu, 1)) + ", " + M("σ = √{" + trim(I.m.v, 2) + "}" + (Math.abs(I.m.sd - Math.round(I.m.sd)) < 1e-9 ? " = " : " ≈ ") + sdTxt(I.m))],
      ["Boundary", M("X >= " + d.k) + " → " + M("Y > " + fmtB(d.k - 0.5))], [M("z"), zLine(I.m, d.k - 0.5, I.a.zL)], ["Approximate probability", I.a.txt]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.n = d.n; a.S.k = d.k;
      inp.innerHTML = '<div id="nt-n"></div><div class="na-step nt-k"><span class="rg-lab">Cutoff ' + M("k") + '</span><button type="button" class="btn sm ghost" data-nt="-" aria-label="Decrease k">−</button><input type="number" class="numin" id="nt-k" min="0" max="' + d.n + '" step="1" value="' + d.k + '" aria-label="Cutoff k (call the coin biased at k or more heads)"><button type="button" class="btn sm ghost" data-nt="+" aria-label="Increase k">+</button></div><p class="tiny muted">Call the coin biased if it shows ' + M("k") + " or more heads.</p>";
      nR = radios($("#nt-n", inp), { label:"Tosses " + M("n"), aria:"Number of tosses n", options:NS.map(function(v){ return { id:v, t:String(v), aria:"n = " + v }; }), value:d.n, cls:"chips",
        onChange:function(v){ a.S.n = +v; a.S.k = Math.min(clampI(a.S.k, 0, +v, 0), +v); if (a.S.k === 0 || a.S.k > +v) a.S.k = Math.round(+v * 0.55); a.save(); paint(); a.update(); } });
      pvw.innerHTML = '<canvas class="plot nt-plot" id="nt-plot" role="img" aria-label="Fair-coin histogram with the region X ≥ k shaded"></canvas><dl class="read nt-read" id="nt-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#nt-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      function setK(v){ var dd = read(); a.S.k = clampI(v, 0, dd.n, dd.k); a.save(); paint(); a.update(); }
      inp.addEventListener("change", function(e){ if (e.target.id === "nt-k") setK(e.target.value); });
      inp.addEventListener("input", function(e){ if (e.target.id === "nt-k" && e.target.value !== "" && isFinite(+e.target.value)) setK(e.target.value); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-nt]"); if (!b) return; setK(read().k + (b.dataset.nt === "+" ? 1 : -1)); });
      paint();
    },
    read:read,
    valid:function(d){ return d.k >= 0 && d.k <= d.n ? true : "Choose a cutoff from 0 to " + d.n + "."; },
    checks:function(d){ return [d.n * 0.5 > 5, tail(d).a.v <= 0.05, d.k <= 0.55 * d.n]; },
    key:function(d){ return d.n + "|" + d.k; },
    label:function(k){ var q = k.split("|"); return M("n = " + q[0]) + ", " + M("k = " + q[1]); },
    text:function(k){ var q = k.split("|"); return "n = " + q[0] + ", k = " + q[1]; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ var r = explore(host, api); MV.wait(0, ensureZT); return r; },
  part3:part3,
  task:task,
  onShow:function(){ ensureZT(); }
});
})();
