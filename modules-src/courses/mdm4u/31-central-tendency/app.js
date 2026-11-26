// MDM4U 31 Measures of Central Tendency: hero (seven dots on a seesaw; the 11 slides to 20, the fulcrum follows the mean,
// the median bracket stays on 5), Balance and middle (Explore: D9 data table with dot-plot views — Balance, Middle, Weighted,
// Grouped with a small D10 histogram), Which centre? (Part 3: four decision stations with Check it with data), Find it
// (N4 numEntry), Five quiz scores task. Dots --pen; beam and fulcrum (mean) --ink; median bracket --hi (course plan §3).
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? clamp(v, lo, hi) : def; }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function mi(s){ return String(s).replace(/-/g, MV.MINUS); }
// a number with up to dp decimals (zeros trimmed), true minus
function dN(v, dp){ dp = dp == null ? 2 : dp; var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return mi(s); }
// a centre: exact when it ends within 2 decimals, otherwise "≈ x.xx"
function exact2(v){ return Math.abs(v * 100 - Math.round(v * 100)) < 1e-7; }
function cTxt(v){ return exact2(v) ? dN(v, 2) : "≈ " + mi(v.toFixed(2)); }
function ord(k){ var t = k % 100, s = (t >= 11 && t <= 13) ? "th" : ["th", "st", "nd", "rd"][k % 10] || "th"; return k + s; }
function stats(a){
  var n = a.length, s = a.slice().sort(function(x, y){ return x - y; }), sum = 0, cnt = {}, mx = 0;
  s.forEach(function(v){ sum += v; cnt[v] = (cnt[v] || 0) + 1; mx = Math.max(mx, cnt[v]); });
  var mlo = null, mhi = null, med = null;
  if (n) { if (n % 2) { mlo = mhi = (n - 1) / 2; med = s[mlo]; } else { mlo = n / 2 - 1; mhi = n / 2; med = (s[mlo] + s[mhi]) / 2; } }
  var modes = mx > 1 ? Object.keys(cnt).map(Number).filter(function(v){ return cnt[v] === mx; }).sort(function(x, y){ return x - y; }) : [];
  return { n:n, s:s, sum:sum, mean:n ? sum / n : null, med:med, mlo:mlo, mhi:mhi, modes:modes, cnt:cnt, mx:mx, range:n ? s[n - 1] - s[0] : 0 };
}
function listTxt(a){ a = a.map(function(v){ return dN(v, 2); }); return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function modeTxt(st){ return !st.n ? "—" : st.modes.length ? listTxt(st.modes) : "no mode"; }
function medTxt(st){ if (!st.n) return "—"; return st.mlo === st.mhi ? dN(st.med, 2) + ' <span class="tiny muted">(the ' + ord(st.mlo + 1) + " value)</span>" : dN(st.med, 2) + ' <span class="tiny muted">(average of the ' + ord(st.mlo + 1) + " and " + ord(st.mhi + 1) + " values)</span>"; }
function sorted(a){ return a.slice().sort(function(x, y){ return x - y; }); }
function slider(id, lab, min, max, step, val, out, extra){
  return '<label class="slider ct-sl"><span class="slider-top"><span>' + lab + '</span><output id="' + id + '-o">' + out + '</output></span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" aria-valuetext="' + MV.esc(String(out)) + '"' + (extra || "") + "></label>";
}

// @component radioGroup (copied from MDM4U 19 / 18) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t, aria}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh, setOptions}
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint,
    setOptions:function(list){ o.options = list; paint(); } };
}

// @component D9 dotSeesaw — a dot plot on a seesaw (course plan D9's balance view): dots (--pen) stack on an --ink beam that
// pivots on an --ink fulcrum and tilts toward the heavier side in proportion to mean − fulcrum (up to 9°); the median bracket
// (--hi, over the middle one or two dots) with its label; tick labels under the beam; optional selected-dot ring, drop offsets
// (hero) and a tilt line. With fx null the beam rests level on two posts.
// drawDots(plot, {data, x0, x1, fx, mean, med, medPair:[a, b], medLab, fLab, sel, drop:[px], tiltText, unit, describe})
// geometry in plot._g = {W, H, X, L, R, cx, cy, th, pos:[[px, py] per data index], toVal(px, py), fxOf(px)}
function tickStepOf(span, W){ return span <= 12 ? 1 : span <= 30 ? (W < 480 ? 5 : 2) : span <= 60 ? 10 : 20; }
function drawDots(plot, o){
  var r0 = plot.c.getBoundingClientRect(), W0 = Math.max(200, r0.width), H0 = Math.max(120, r0.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 26, R = 26, top = o.medLab ? 34 : 14, bh = 6, triH = 24, yB = H - 66, span = o.x1 - o.x0;
    var X = function(v){ return L + (v - o.x0) / span * (W - L - R); }, unit = (W - L - R) / span;
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), hi = css("--hi"), hiInk = css("--hi-ink"), fUI = p.fontUI, fM = p.fontM;
    var rad = clamp(Math.min(unit * 0.45, 10), 5, 10), data = o.data || [];
    // stack dots that would overlap (sorted order, greedy levels)
    var idx = data.map(function(v, i){ return i; }).sort(function(a, b){ return data[a] - data[b] || a - b; }), lv = [], placed = [], maxK = 0;
    idx.forEach(function(i){ var px = X(data[i]), k = 0; while (placed.some(function(q){ return q.k === k && Math.abs(q.px - px) < 2 * rad - 0.5; })) k++; placed.push({ px:px, k:k }); lv[i] = k; maxK = Math.max(maxK, k); });
    var sp = Math.min(2 * rad + 2, (yB - bh / 2 - top - 2 * rad - 6) / Math.max(1, maxK));
    var hasF = o.fx != null, cx = hasF ? X(o.fx) : W / 2, cy = yB + bh / 2, th = 0;
    if (hasF && o.mean != null) {
      th = clamp((o.mean - o.fx) / (0.15 * span), -1, 1) * 9 * Math.PI / 180;
      var reach = th > 0 ? X(o.x1) + 8 - cx : cx - X(o.x0) + 8, lim = Math.asin(Math.min(1, (triH - 4) / Math.max(1, reach)));
      th = clamp(th, -lim, lim);
    }
    var cs = Math.cos(th), sn = Math.sin(th);
    function rot(px, py){ var dx = px - cx, dy = py - cy; return [cx + cs * dx - sn * dy, cy + sn * dx + cs * dy]; }
    ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L - 14, cy + triH + 0.5); ctx.lineTo(W - R + 14, cy + triH + 0.5); ctx.stroke();
    if (hasF) { ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 15, cy + triH); ctx.lineTo(cx + 15, cy + triH); ctx.closePath(); ctx.fill(); }
    else { ctx.fillStyle = ink2; [X(o.x0) - 4, X(o.x1) - 2].forEach(function(px){ ctx.fillRect(px, cy, 6, triH); }); }
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(th); ctx.translate(-cx, -cy);
    ctx.fillStyle = ink; ctx.fillRect(X(o.x0) - 8, yB - bh / 2, X(o.x1) - X(o.x0) + 16, bh);
    // ticks and labels under the beam
    var st = o.tick || tickStepOf(span, W), used = [];
    ctx.font = "12px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.strokeStyle = ink; ctx.lineWidth = 1;
    for (var t = Math.ceil(o.x0 / st) * st; t <= o.x1 + 1e-9; t += st) {
      var tx = X(t), lab = dN(t, 2), w = ctx.measureText(lab).width;
      ctx.beginPath(); ctx.moveTo(tx, yB + bh / 2); ctx.lineTo(tx, yB + bh / 2 + 4); ctx.stroke();
      if (used.some(function(u){ return Math.abs(u - tx) < w + 6; })) continue; used.push(tx);
      ctx.fillStyle = sheet; ctx.globalAlpha = 0.85; ctx.fillRect(tx - w / 2 - 2, yB + bh / 2 + 5, w + 4, 15); ctx.globalAlpha = 1;
      ctx.fillStyle = ink; ctx.fillText(lab, tx, yB + bh / 2 + 6);
    }
    // median bracket (--hi) over the middle dot(s)
    if (o.med != null) {
      var a = X(o.medPair ? o.medPair[0] : o.med), b = X(o.medPair ? o.medPair[1] : o.med), yb = top - 2, ym = X(o.med);
      ctx.strokeStyle = hi; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a - rad - 3, yb + 9); ctx.lineTo(a - rad - 3, yb); ctx.lineTo(b + rad + 3, yb); ctx.lineTo(b + rad + 3, yb + 9); ctx.stroke();
      ctx.lineWidth = 2.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ym, yb); ctx.lineTo(ym, yB - bh / 2); ctx.stroke(); ctx.setLineDash([]); ctx.lineCap = "butt";
      if (o.medLab) {
        ctx.font = "700 13px " + fUI; var mw = ctx.measureText(o.medLab).width, mx = clamp(ym, mw / 2 + 6, W - mw / 2 - 6);
        ctx.fillStyle = hi; ctx.fillRect(mx - mw / 2 - 5, yb - 22, mw + 10, 19); ctx.fillStyle = hiInk; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.medLab, mx, yb - 12);
      }
    }
    // dots
    var pos = [];
    data.forEach(function(v, i){
      var px = X(v), py = yB - bh / 2 - rad - 1 - lv[i] * sp - ((o.drop && o.drop[i]) || 0);
      pos[i] = rot(px, py);
      ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fillStyle = pen; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = sheet; ctx.stroke();
      if (o.sel === i) { ctx.beginPath(); ctx.arc(px, py, rad + 3.5, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = ink; ctx.stroke(); }
    });
    ctx.restore();
    if (hasF && o.fLab) {
      ctx.font = "700 14px " + fUI; var lw = ctx.measureText(o.fLab).width, lx = clamp(cx, lw / 2 + 4, W - lw / 2 - 4);
      ctx.fillStyle = sheet; ctx.fillRect(lx - lw / 2 - 3, cy + triH + 3, lw + 6, 19); ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(o.fLab, lx, cy + triH + 5);
    }
    ctx.textBaseline = "bottom";
    if (hasF && o.tiltText !== false) {
      var deg = Math.round(Math.abs(th) * 180 / Math.PI);
      ctx.fillStyle = ink; ctx.font = "600 12px " + fUI; ctx.textAlign = "left";
      ctx.fillText(deg === 0 ? "Level: balanced" : "Tilting: " + (th > 0 ? "right" : "left") + " side down", 6, H - 3);
    }
    if (o.unit) { ctx.fillStyle = ink2; ctx.font = "italic 12px " + fM; ctx.textAlign = "right"; ctx.fillText(o.unit, W - 6, H - 3); }
    plot._g = { W:W, H:H, X:X, L:L, R:R, cx:cx, cy:cy, th:th, pos:pos,
      toVal:function(px, py){ var dx = px - cx, dy = py - cy, lx = cx + Math.cos(-th) * dx - Math.sin(-th) * dy; return o.x0 + (lx - L) / (W - L - R) * span; },
      fxOf:function(px){ return o.x0 + (px - L) / (W - L - R) * span; } };
  } });
}

// Middle view: the dots in sorted order, evenly spaced, with the median bracket (--hi) over the middle one or two.
// drawMiddle(plot, {data, sel, lo, hi (sorted positions, may be fractional while animating), medLab, fade:{index:alpha}, describe})
function drawMiddle(plot, o){
  var r0 = plot.c.getBoundingClientRect(), W0 = Math.max(200, r0.width), H0 = Math.max(120, r0.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, data = o.data, n = data.length;
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), hi = css("--hi"), hiInk = css("--hi-ink"), fUI = p.fontUI, fM = p.fontM;
    var idx = data.map(function(v, i){ return i; }).sort(function(a, b){ return data[a] - data[b] || a - b; });
    var slot = Math.min(64, (W - 24) / Math.max(1, n)), x0 = W / 2 - slot * n / 2, rad = Math.min(19, slot * 0.43), cy = H * 0.58;
    function cxk(k){ return x0 + slot * (k + 0.5); }
    ctx.fillStyle = ink2; ctx.font = "600 12px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("sorted order", 8, 8);
    if (o.lo != null && n) {
      var a = cxk(o.lo) - rad - 4, b = cxk(o.hi) + rad + 4, yb = cy - rad - 12;
      ctx.strokeStyle = hi; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a, yb + 9); ctx.lineTo(a, yb); ctx.lineTo(b, yb); ctx.lineTo(b, yb + 9); ctx.stroke(); ctx.lineCap = "butt";
      if (o.medLab) {
        ctx.font = "700 14px " + fUI; var mw = ctx.measureText(o.medLab).width, mx = clamp((a + b) / 2, mw / 2 + 6, W - mw / 2 - 6);
        ctx.fillStyle = hi; ctx.fillRect(mx - mw / 2 - 6, yb - 30, mw + 12, 22); ctx.fillStyle = hiInk; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.medLab, mx, yb - 19);
      }
    }
    idx.forEach(function(i, k){
      var x = cxk(k), al = o.fade && o.fade[i] != null ? o.fade[i] : 1;
      ctx.globalAlpha = al;
      ctx.beginPath(); ctx.arc(x, cy, rad, 0, Math.PI * 2); ctx.fillStyle = pen; ctx.fill();
      ctx.fillStyle = sheet; ctx.font = "700 " + Math.round(rad * 0.9) + "px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(dN(data[i], 2), x, cy + 1);
      ctx.globalAlpha = 1;
      if (o.sel === i) { ctx.beginPath(); ctx.arc(x, cy, rad + 4, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = ink; ctx.stroke(); }
      ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textBaseline = "top"; ctx.fillText(String(k + 1), x, cy + rad + 8);
    });
    ctx.fillStyle = ink2; ctx.font = "600 12px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("position", 8, H - 6);
  } });
}

// Weighted view: each value is a bar on a 0–100 beam whose height is its weight; the fulcrum sits at the weighted mean.
// drawWeighted(plot, {rows:[{x, w}], t (0: equal heights, 1: weights), wm (null: no fulcrum), describe})
function drawWeighted(plot, o){
  var r0 = plot.c.getBoundingClientRect(), W0 = Math.max(200, r0.width), H0 = Math.max(120, r0.height);
  plot.draw({ view:{ xmin:0, xmax:W0, ymin:0, ymax:H0 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 26, R = 26, top = 30, bh = 6, triH = 24, yB = H - 66;
    var X = function(v){ return L + v / 100 * (W - L - R); }, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), fUI = p.fontUI, fM = p.fontM;
    var n = o.rows.length, t = o.t == null ? 1 : o.t, hs = (yB - bh / 2 - top - 20) / 100, bw = clamp((W - L - R) / 16, 16, 30), cy = yB + bh / 2;
    ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L - 14, cy + triH + 0.5); ctx.lineTo(W - R + 14, cy + triH + 0.5); ctx.stroke();
    if (o.wm != null) { var cx = X(o.wm); ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 15, cy + triH); ctx.lineTo(cx + 15, cy + triH); ctx.closePath(); ctx.fill(); }
    else { ctx.fillStyle = ink2; [X(0) - 4, X(100) - 2].forEach(function(px){ ctx.fillRect(px, cy, 6, triH); }); }
    o.rows.forEach(function(r){
      var w = t * r.w + (1 - t) * 100 / n, h = Math.max(0, w) * hs, x = X(r.x) - bw / 2;
      ctx.fillStyle = pen; ctx.fillRect(x, yB - bh / 2 - h, bw, h); ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, yB - bh / 2 - h + 0.5, bw - 1, Math.max(0, h - 1));
      ctx.fillStyle = ink; ctx.font = "700 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(t >= 1 ? r.w + "%" : "", X(r.x), yB - bh / 2 - h - 3);
    });
    ctx.fillStyle = ink; ctx.fillRect(X(0) - 8, yB - bh / 2, X(100) - X(0) + 16, bh);
    ctx.font = "12px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.strokeStyle = ink; ctx.lineWidth = 1;
    for (var v = 0; v <= 100; v += W < 480 ? 20 : 10) { ctx.beginPath(); ctx.moveTo(X(v), cy); ctx.lineTo(X(v), cy + 4); ctx.stroke(); var lab = String(v), lw = ctx.measureText(lab).width; ctx.fillStyle = sheet; ctx.globalAlpha = 0.85; ctx.fillRect(X(v) - lw / 2 - 2, cy + 5, lw + 4, 15); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(lab, X(v), cy + 6); }
    if (o.wm != null) {
      var lb = "weighted mean " + cTxt(o.wm); ctx.font = "700 14px " + fUI; var w2 = ctx.measureText(lb).width, lx = clamp(X(o.wm), w2 / 2 + 4, W - w2 / 2 - 4);
      ctx.fillStyle = sheet; ctx.fillRect(lx - w2 / 2 - 3, cy + triH + 3, w2 + 6, 19); ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(lb, lx, cy + triH + 5);
    }
    ctx.fillStyle = ink2; ctx.font = "600 12px " + fUI; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(t >= 1 ? "bar height = weight" : "equal weights", 6, 6);
    ctx.font = "italic 12px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.fillText("mark", W - 6, H - 3);
  } });
}

// @component D10 histogramMini — grouped frequency histogram (classes of width 10 from 0 to 50) with midpoints, the midpoint
// estimate (▲, --ink) and the raw-data mean (dashed --ink-2). drawGrouped(plot, {f:[5], mid:bool, est, raw, describe})
var CLS = [0, 1, 2, 3, 4];
function drawGrouped(plot, o){
  plot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 40, R = 18, top = 34, yB = H - 56, X = function(v){ return L + v / 50 * (W - L - R); };
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), sheet = css("--sheet"), hi = css("--hi"), hiInk = css("--hi-ink"), grid = css("--plot-grid"), fUI = p.fontUI, fM = p.fontM;
    var ymax = Math.max(4, Math.max.apply(null, o.f)), hs = (yB - top) / ymax, st = ymax > 6 ? 2 : 1;
    ctx.font = "12px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.lineWidth = 1;
    for (var y = 0; y <= ymax; y += st) { ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(L, yB - y * hs); ctx.lineTo(W - R, yB - y * hs); ctx.stroke(); ctx.fillStyle = ink2; ctx.fillText(String(y), L - 6, yB - y * hs); }
    CLS.forEach(function(c){
      var h = o.f[c] * hs, x = X(c * 10);
      if (h > 0) { ctx.fillStyle = pen; ctx.fillRect(x, yB - h, X(10) - X(0), h); ctx.strokeStyle = sheet; ctx.lineWidth = 1.5; ctx.strokeRect(x + 0.75, yB - h + 0.75, X(10) - X(0) - 1.5, h - 1.5); }
      if (o.f[c] > 0) { ctx.fillStyle = ink; ctx.font = "700 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillText(String(o.f[c]), X(c * 10 + 5), yB - h - 3); }
      var mx = X(c * 10 + 5);
      if (o.mid && o.f[c] > 0) { ctx.beginPath(); ctx.arc(mx, yB, 6, 0, Math.PI * 2); ctx.fillStyle = hi; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke(); }
      else { ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mx, yB - 3); ctx.lineTo(mx, yB + 3); ctx.stroke(); }
    });
    ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, yB); ctx.lineTo(W - R, yB); ctx.stroke();
    ctx.font = "12px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = ink;
    for (var v = 0; v <= 50; v += 10) ctx.fillText(String(v), X(v), yB + 8);
    if (o.mid) CLS.forEach(function(c){ if (!o.f[c]) return; var t = String(c * 10 + 5), w = ctx.measureText(t).width; ctx.fillStyle = hi; ctx.fillRect(X(c * 10 + 5) - w / 2 - 3, yB + 24, w + 6, 16); ctx.fillStyle = hiInk; ctx.fillText(t, X(c * 10 + 5), yB + 25); });
    if (o.raw != null) {
      var rx = X(o.raw); ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(rx, yB); ctx.lineTo(rx, top - 8); ctx.stroke(); ctx.setLineDash([]);
      var rl = "raw mean " + cTxt(o.raw); ctx.font = "600 12px " + fUI; var rw = ctx.measureText(rl).width, rlx = clamp(rx, rw / 2 + 4, W - rw / 2 - 4);
      ctx.fillStyle = sheet; ctx.fillRect(rlx - rw / 2 - 3, 2, rw + 6, 17); ctx.fillStyle = ink2; ctx.textBaseline = "top"; ctx.fillText(rl, rlx, 4);
    }
    if (o.est != null) {
      var ex = X(o.est); ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(ex, yB + 2); ctx.lineTo(ex - 8, yB + 16); ctx.lineTo(ex + 8, yB + 16); ctx.closePath(); ctx.fill();
      var el = "estimate " + cTxt(o.est); ctx.font = "700 13px " + fUI; var ew = ctx.measureText(el).width, elx = clamp(ex, ew / 2 + 4, W - ew / 2 - 4);
      ctx.fillStyle = sheet; ctx.fillRect(elx - ew / 2 - 3, yB + 38, ew + 6, 18); ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText(el, elx, yB + 40);
    }
    ctx.fillStyle = ink2; ctx.font = "italic 12px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("frequency", L + 4, top - 26 > 18 ? top - 26 : 20);
  } });
}
// the model raw data behind each class (fixed: seeded), so the raw-data mean is exact
var RAW = CLS.map(function(c){ var g = MV.mdm.seededRandom("mdm31-raw-" + c), a = []; for (var i = 0; i < 10; i++) a.push(c * 10 + g.int(10)); return a; });
function grouped(f){
  var n = 0, fm = 0, raw = 0;
  CLS.forEach(function(c){ n += f[c]; fm += f[c] * (c * 10 + 5); for (var i = 0; i < f[c]; i++) raw += RAW[c][i]; });
  return { n:n, fm:fm, est:n ? fm / n : null, raw:n ? raw / n : null };
}
function wStats(rows){ var tw = 0, s = 0, sx = 0; rows.forEach(function(r){ tw += r.w; s += r.w * r.x; sx += r.x; }); return { tw:tw, wm:tw === 100 ? s / 100 : null, avg:sx / rows.length }; }

// ---------- Explore: Balance and middle ----------
var START = [2, 4, 4, 5, 7, 9, 11], WPRE = { p3:[{ x:70, w:25 }, { x:90, w:75 }], tc2:[{ x:72, w:70 }, { x:60, w:30 }] }, GSTART = [2, 5, 3, 0, 0];
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (["bal", "mid", "wt", "grp"].indexOf(S.mode) < 0) S.mode = "bal";
    if (!Array.isArray(S.data) || !S.data.length || S.data.length > 15) S.data = START.slice();
    S.data = S.data.map(function(v){ return clampI(v, 0, 20, 10); });
    S.sel = S.sel == null || S.sel >= S.data.length ? null : clampI(S.sel, 0, S.data.length - 1, null);
    S.addV = clampI(S.addV, 0, 20, 10);
    S.w = obj(S.w);
    if (!Array.isArray(S.w.rows) || S.w.rows.length < 2 || S.w.rows.length > 4) { S.w.rows = WPRE.p3.map(function(r){ return { x:r.x, w:r.w }; }); S.w.pre = "p3"; }
    S.w.rows = S.w.rows.map(function(r){ r = obj(r); return { x:clampI(r.x, 0, 100, 50), w:Math.round(clampI(r.w, 0, 100, 0) / 5) * 5 }; });
    if (!Array.isArray(S.f) || S.f.length !== 5) S.f = GSTART.slice();
    S.f = S.f.map(function(v){ return clampI(v, 0, 10, 0); });
  }
  sanitize();
  var pv = {}, anim = null, msg = "", fxCur = null, fxStop = null, manual = false, built = "", wpreR = null;
  host.innerHTML =
    '<div class="ct-top"><div id="ct-mode"></div></div>' +
    '<div class="pg ct-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap ct-cap" id="ct-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot ct-plot" id="ct-plot" role="img" aria-label="Dot plot on a seesaw"></canvas></div>' +
      '<p class="ct-terms" id="ct-terms" aria-live="polite"></p><p class="ct-aha" id="ct-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="ct-ctrl"></div><p class="tiny ct-msg" id="ct-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="ct-read" aria-live="polite"></dl></div></div>';
  var plot = new MV.Plot($("#ct-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;
  var modeR = radios($("#ct-mode", host), { label:"Mode", options:[{ id:"bal", t:"Balance" }, { id:"mid", t:"Middle" }, { id:"wt", t:"Weighted" }, { id:"grp", t:"Grouped" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; if (!manual) fxCur = null; save(); render(); MV.changed(); } });

  function save(){ api.save(); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }
  function st(){ return stats(S.data); }

  // --- animation bookkeeping: any user action finishes the running animation ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function tw(dur, step, done){ var a = anim; if (!a) return; a.stops.push(MV.tween({ dur:dur, step:function(t){ if (anim === a) step(t); }, done:function(){ if (anim === a) done(); } })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { if (typeof s === "function") s(); } catch (e) {} });
    if (a.fin) { var f = a.fin; a.fin = null; if (a.fix) a.fix(); f(); }
    pv = {}; fxCur = null; render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }

  // --- the fulcrum follows the mean: the beam tips at once, holds, then the fulcrum slides under the new balance point ---
  function stopF(){ if (fxStop) { fxStop(); fxStop = null; } }
  function followF(){
    var m = st().mean; if (manual || pv.lockF || m == null) return;
    if (MV.reduceMotion || fxCur == null) { stopF(); fxCur = m; return; }
    if (Math.abs(m - fxCur) < 1e-9) return;
    stopF(); var from = fxCur, hold = MV.wait(320, function(){
      var s = MV.tween({ dur:650, step:function(t){ fxCur = from + (m - from) * t; paintChart(); paintAha(); }, done:function(){ fxStop = null; fxCur = m; paintChart(); paintAha(); } });
      fxStop = function(){ if (typeof s === "function") s(); };
    });
    fxStop = function(){ clearTimeout(hold); };
  }
  function balanceNow(){
    var m = st().mean; manual = false; stopF();
    if (MV.reduceMotion || fxCur == null) { fxCur = m; render(); MV.changed(); return; }
    var from = fxCur, s = MV.tween({ dur:700, step:function(t){ fxCur = from + (m - from) * t; paintChart(); }, done:function(){ fxStop = null; fxCur = m; render(); MV.changed(); } });
    fxStop = function(){ if (typeof s === "function") s(); };
  }
  function after(){ save(); followF(); render(); MV.changed(); }

  // --- data editing ---
  function moveVal(i, d){ if (i == null || S.data[i] == null) return; user(); S.data[i] = clamp(S.data[i] + d, 0, 20); S.sel = i; msg = ""; after(); }
  function addVal(){ user(); if (S.data.length >= 15) { msg = "That’s the limit: up to 15 values."; paintMsg(); return; } S.data.push(S.addV); S.sel = S.data.length - 1; msg = ""; after(); }
  function removeVal(){ user(); if (S.sel == null) { msg = "Select a value first (tap it)."; paintMsg(); return; } if (S.data.length <= 1) { msg = "Keep at least one value."; paintMsg(); return; } S.data.splice(S.sel, 1); S.sel = null; msg = ""; after(); }

  // --- painting ---
  function render(){
    sanitize(); modeR.set(S.mode);
    if (S.mode === "bal" && fxCur == null && !pv.lockF) fxCur = st().mean;
    paintCtrl(); paintChart(); paintRead(); paintCap(); paintTerms(); paintAha(); paintMsg();
    plot.c.style.touchAction = S.mode === "bal" ? "pan-y" : "auto";
  }
  function paintMsg(){ $("#ct-msg", host).innerHTML = msg ? MV.md(msg) : ""; }
  function paintCtrl(){
    var box = $("#ct-ctrl", host), want = S.mode === "wt" ? "wt:" + S.w.rows.length : S.mode === "grp" ? "grp" : "data:" + S.mode;
    if (built !== want) {
      built = want; wpreR = null;
      if (S.mode === "bal" || S.mode === "mid") {
        box.innerHTML = '<div class="ct-panel"><p class="ct-sh">Data <span class="mdm-model">model data</span></p><div class="ct-chips" id="ct-chips" role="group" aria-label="Data values, sorted"></div>' +
          '<p class="tiny muted ct-how">Tap a value' + (S.mode === "bal" ? " or a dot" : "") + " to select it. Arrow keys move it by 1 (Shift + arrow: 5). " + (S.mode === "bal" ? "You can also drag the dots and the fulcrum." : "") + "</p>" +
          '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="dec" data-k="ctdec">Selected − 1</button><button type="button" class="btn ghost sm" data-act="inc" data-k="ctinc">Selected + 1</button><button type="button" class="btn ghost sm" data-act="rm" data-k="ctrm">Remove</button></div>' +
          '<div class="ct-add" role="group" aria-label="Add a value"><span class="ct-al">New value</span><button type="button" class="btn ghost sm ct-stb" data-act="avm" data-k="ctavm" aria-label="New value down">−</button><output class="ct-ov" id="ct-av"></output><button type="button" class="btn ghost sm ct-stb" data-act="avp" data-k="ctavp" aria-label="New value up">+</button><button type="button" class="btn sm" data-act="add" data-k="ctadd">Add value</button></div>' +
          '<div class="q-actions">' + (S.mode === "bal" ? '<button type="button" class="btn primary sm" data-act="balance" data-k="ctbal">Let it balance</button>' : "") + '<button type="button" class="btn ghost sm" data-act="reset" data-k="ctreset">Start values</button></div></div>';
      } else if (S.mode === "wt") {
        box.innerHTML = '<div class="ct-panel"><p class="ct-sh">Weighted mean <span class="mdm-model">model data</span></p><div id="ct-wpre"></div><div id="ct-wrows" class="ct-wrows">' +
          S.w.rows.map(function(r, k){ return '<div class="ct-wrow"><p class="ct-wl">Value ' + (k + 1) + "</p>" + slider("ct-wx" + k, "Mark", 0, 100, 1, r.x, r.x, ' data-wx="' + k + '"') + slider("ct-ww" + k, "Weight", 0, 100, 5, r.w, r.w + "%", ' data-ww="' + k + '"') + "</div>"; }).join("") +
          '</div><div class="q-actions"><button type="button" class="btn ghost sm" data-act="wadd" data-k="ctwadd"' + (S.w.rows.length >= 4 ? " disabled" : "") + '>Add a value</button><button type="button" class="btn ghost sm" data-act="wrm" data-k="ctwrm"' + (S.w.rows.length <= 2 ? " disabled" : "") + ">Remove the last value</button></div>" +
          '<p class="ct-warn" id="ct-wwarn" role="status"></p></div>';
        wpreR = radios($("#ct-wpre", box), { label:"Start from", options:[{ id:"p3", t:"Test and exam" }, { id:"tc2", t:"Term and exam" }, { id:"", t:"Your own", aria:"Your own (edit below)" }], value:S.w.pre || "", cls:"chips",
          disabled:function(id){ return id === ""; },
          onChange:function(v){ if (!v) return; user(); S.w.rows = WPRE[v].map(function(r){ return { x:r.x, w:r.w }; }); S.w.pre = v; built = ""; save(); render(); MV.changed(); } });
      } else {
        box.innerHTML = '<div class="ct-panel"><p class="ct-sh">Frequency table <span class="mdm-model">model data</span></p><div class="ct-grows" role="group" aria-label="Class frequencies">' +
          CLS.map(function(c){ var lab = "[" + c * 10 + ", " + (c * 10 + 10) + ")"; return '<div class="ct-grow"><span class="ct-gl">' + lab + '</span><span class="tiny muted ct-gm">midpoint ' + (c * 10 + 5) + '</span><button type="button" class="btn ghost sm ct-stb" data-gf="' + c + '|-1" data-k="ctg' + c + 'm" aria-label="Frequency of ' + lab + ' down">−</button><output class="ct-ov" id="ct-gf' + c + '"></output><button type="button" class="btn ghost sm ct-stb" data-gf="' + c + '|1" data-k="ctg' + c + 'p" aria-label="Frequency of ' + lab + ' up">+</button></div>'; }).join("") +
          '</div><p class="tiny muted ct-how">Frequencies 0–10. Each class hides real values; the raw-data mean uses them, the estimate uses only the midpoints.</p><div class="q-actions"><button type="button" class="btn ghost sm" data-act="greset" data-k="ctgreset">Start values</button></div></div>';
      }
    }
    if (S.mode === "bal" || S.mode === "mid") {
      var ch = $("#ct-chips", box), idx = S.data.map(function(v, i){ return i; }).sort(function(a, b){ return S.data[a] - S.data[b] || a - b; });
      MV.keepFocus(ch, function(){ ch.innerHTML = idx.map(function(i){ var on = S.sel === i; return '<button type="button" class="ct-chip" data-dv="' + i + '" data-k="ctd' + i + '" aria-pressed="' + on + '" aria-label="Value ' + S.data[i] + (on ? ", selected: arrow keys move it" : "") + '">' + S.data[i] + "</button>"; }).join(""); });
      $("#ct-av", box).textContent = S.addV;
      box.querySelector('[data-act="avm"]').disabled = S.addV <= 0; box.querySelector('[data-act="avp"]').disabled = S.addV >= 20;
      box.querySelector('[data-act="add"]').disabled = S.data.length >= 15 || !!anim;
      ["dec", "inc", "rm"].forEach(function(k){ box.querySelector('[data-act="' + k + '"]').disabled = S.sel == null || !!anim; });
      var bb = box.querySelector('[data-act="balance"]'); if (bb) bb.disabled = !!anim || fxCur == null || Math.abs(fxCur - st().mean) < 1e-9;
      box.querySelector('[data-act="reset"]').disabled = !!anim;
    } else if (S.mode === "wt") {
      if (wpreR) wpreR.set(S.w.pre || "");
      S.w.rows.forEach(function(r, k){
        var ix = $("#ct-wx" + k, box), iw = $("#ct-ww" + k, box);
        if (+ix.value !== r.x) ix.value = r.x; if (+iw.value !== r.w) iw.value = r.w;
        $("#ct-wx" + k + "-o", box).textContent = r.x; $("#ct-ww" + k + "-o", box).textContent = r.w + "%";
        ix.setAttribute("aria-valuetext", "Mark " + r.x); iw.setAttribute("aria-valuetext", r.w + " percent");
      });
      var ws = wStats(S.w.rows); $("#ct-wwarn", box).textContent = ws.tw === 100 ? "" : "The weights total " + ws.tw + "%. They must total 100%.";
    } else {
      CLS.forEach(function(c){ $("#ct-gf" + c, box).textContent = S.f[c]; box.querySelector('[data-gf="' + c + '|-1"]').disabled = S.f[c] <= 0; box.querySelector('[data-gf="' + c + '|1"]').disabled = S.f[c] >= 10; });
    }
  }
  function paintChart(){
    var s = st();
    if (S.mode === "bal") {
      var m = s.mean, fx = fxCur != null ? fxCur : m;
      var fLab = fx == null ? "" : Math.abs(fx - m) < 1e-6 ? "mean " + cTxt(m) : "fulcrum " + dN(fx, 1);
      drawDots(plot, { data:S.data, x0:0, x1:20, fx:fx, mean:m, med:s.med, medPair:s.mlo !== s.mhi ? [s.s[s.mlo], s.s[s.mhi]] : null, medLab:"median " + dN(s.med, 2),
        fLab:fLab, sel:S.sel, unit:"value",
        describe:"Dot plot on a seesaw, values " + s.s.join(", ") + ". " + (Math.abs(fx - m) < 1e-6 ? "The beam balances at the mean, " + MV.plain(cTxt(m)) + "." : "The fulcrum is at " + dN(fx, 1) + "; the beam tips to the " + (m > fx ? "right" : "left") + " because the mean is " + MV.plain(cTxt(m)) + ".") + " The median bracket is at " + dN(s.med, 2) + "." });
    } else if (S.mode === "mid") {
      var lo = s.mlo, hi = pv.br != null ? s.mlo + pv.br : s.mhi;
      drawMiddle(plot, { data:S.data, sel:S.sel, lo:lo, hi:hi, fade:pv.fade, medLab:pv.br != null && pv.br < 1 ? "median ?" : s.mlo === s.mhi ? "median = " + dN(s.med, 2) : "median = (" + dN(s.s[s.mlo], 2) + " + " + dN(s.s[s.mhi], 2) + ") ÷ 2 = " + dN(s.med, 2),
        describe:"The " + s.n + " values in sorted order: " + s.s.join(", ") + ". The bracket marks the " + (s.mlo === s.mhi ? ord(s.mlo + 1) + " value, " + dN(s.med, 2) : ord(s.mlo + 1) + " and " + ord(s.mhi + 1) + " values; the median is " + dN(s.med, 2)) + "." });
    } else if (S.mode === "wt") {
      var ws = wStats(S.w.rows), t = pv.wt != null ? pv.wt : 1;
      drawWeighted(plot, { rows:S.w.rows, t:t, wm:pv.hide ? null : ws.wm,
        describe:"Weighted marks on a beam from 0 to 100: " + S.w.rows.map(function(r){ return r.x + " with weight " + r.w + "%"; }).join(", ") + ". " + (pv.hide ? "The weighted mean is hidden until the reveal." : ws.wm == null ? "The weights don’t total 100%." : "The fulcrum is at the weighted mean, " + MV.plain(cTxt(ws.wm)) + ".") });
    } else {
      var g = grouped(S.f);
      drawGrouped(plot, { f:S.f, mid:pv.mid != null ? pv.mid : true, est:pv.hide ? null : g.est, raw:pv.hide ? null : g.raw,
        describe:"Histogram of classes 0 to 50 in tens with frequencies " + S.f.join(", ") + ". " + (pv.hide ? "The estimate is hidden until the reveal." : g.n ? "Midpoint estimate " + MV.plain(cTxt(g.est)) + "; raw-data mean " + MV.plain(cTxt(g.raw)) + "." : "No values yet.") });
    }
  }
  function Q(){ return '<span class="ct-q">?</span>'; }
  function paintRead(){
    var rows = [], s = st();
    if (S.mode === "bal" || S.mode === "mid") {
      var d = s.mean - s.med, dTxt = (d > 1e-9 ? "+" : "") + cTxt(d);
      rows = [[MV.m("n"), String(s.n)], ["Total Σ" + MV.m("x"), dN(s.sum, 2)], ["Mean", "<strong>" + cTxt(s.mean) + "</strong>"], ["Median", "<strong>" + medTxt(s) + "</strong>"], ["Mode", modeTxt(s) + (s.n && !s.modes.length && s.mx === 1 ? ' <span class="tiny muted">(every value appears once)</span>' : "")],
        ["Mean − median", dTxt + (d > 1e-9 ? ' <span class="tiny">Mean above median: a few high values pull it up.</span>' : d < -1e-9 ? ' <span class="tiny">Mean below median: a few low values pull it down.</span>' : ' <span class="tiny">They agree.</span>')]];
    } else if (S.mode === "wt") {
      var ws = wStats(S.w.rows);
      rows = [["Weights total", ws.tw + "%" + (ws.tw === 100 ? " ✓" : ' <span class="tiny">(must total 100%)</span>')],
        ["Weighted mean Σ" + MV.m("wx") + " ÷ Σ" + MV.m("w"), pv.hide ? Q() : ws.wm == null ? "—" : S.w.rows.map(function(r){ return dN(r.w / 100, 2) + " × " + r.x; }).join(" + ") + " = <strong>" + cTxt(ws.wm) + "</strong>"],
        ["Simple average (ignores the weights)", cTxt(ws.avg)]];
    } else {
      var g = grouped(S.f), live = CLS.filter(function(c){ return S.f[c] > 0; });
      rows = [[MV.m("n") + " = Σ" + MV.m("f"), String(g.n)],
        ["Σ(" + MV.m("f") + " × midpoint)", live.length ? live.map(function(c){ return S.f[c] + " × " + (c * 10 + 5); }).join(" + ") + " = " + g.fm : "0"],
        ["Grouped estimate", pv.hide ? Q() : g.n ? "Σ(" + MV.m("f") + " × midpoint) ÷ Σ" + MV.m("f") + " = " + g.fm + " ÷ " + g.n + " = <strong>" + cTxt(g.est) + "</strong>" : "—"],
        ["Raw-data mean " + '<span class="mdm-model">model data</span>', pv.hide ? Q() : g.n ? cTxt(g.raw) : "—"]];
    }
    var rd = $("#ct-read", host); MV.keepFocus(rd, function(){ rd.innerHTML = MV.readoutHTML(rows); });
  }
  function paintCap(){
    var c = $("#ct-cap", host), s = st();
    if (S.mode === "bal") c.innerHTML = "mean " + cTxt(s.mean) + " · median " + dN(s.med, 2) + " · mode " + modeTxt(s);
    else if (S.mode === "mid") c.innerHTML = pv.br != null && pv.br < 1 ? "median = ?" : "median = " + dN(s.med, 2);
    else if (S.mode === "wt") { var ws = wStats(S.w.rows); c.innerHTML = "weighted mean = " + (pv.hide ? "?" : ws.wm == null ? "—" : cTxt(ws.wm)); }
    else { var g = grouped(S.f); c.innerHTML = "estimated mean = " + (pv.hide ? "?" : g.n ? cTxt(g.est) : "—"); }
  }
  function paintTerms(){
    var el = $("#ct-terms", host), h = "";
    if (S.mode === "wt") {
      var ws = wStats(S.w.rows), k = pv.terms != null ? pv.terms : S.w.rows.length + 1;
      if (ws.wm != null && k > 0) h = S.w.rows.slice(0, k).map(function(r){ return dN(r.w / 100, 2) + " × " + r.x + " = " + dN(r.w * r.x / 100, 2); }).join(";  ") + (k > S.w.rows.length ? "  →  " + S.w.rows.map(function(r){ return dN(r.w * r.x / 100, 2); }).join(" + ") + " = <strong>" + cTxt(ws.wm) + "</strong>" : "");
    } else if (S.mode === "grp" && !pv.hide) {
      var g = grouped(S.f); if (g.n) h = "Estimate " + cTxt(g.est) + " vs raw-data mean " + cTxt(g.raw) + ": the midpoints give an <strong>estimate</strong>, not the exact mean.";
    }
    el.innerHTML = h; el.hidden = !h;
  }
  function paintAha(){
    var a = $("#ct-aha", host), s = st(), t = "";
    if (anim) t = "";
    else if (S.mode === "bal") {
      if (fxCur != null && Math.abs(fxCur - s.mean) > 1e-6) t = "The beam tips toward the heavier side. Press <strong>Let it balance</strong> or drag the fulcrum to the mean.";
      else t = "The mean responds to <em>how far</em> values are; the median responds only to <em>order</em>. Drag the largest dot far right and watch which one moves.";
    } else if (S.mode === "mid") t = "The bracket marks the middle of the sorted values. Make the largest value bigger: the median doesn’t move.";
    else if (S.mode === "wt") t = "Weights are a way to count values fairly: the result sits closer to the value with more weight.";
    else t = "Grouped data have no exact mean. Each class’s values are counted at its midpoint, so the result is an estimate.";
    a.innerHTML = t; a.hidden = !t;
  }

  // --- dragging the dots and the fulcrum (Balance mode) ---
  var drag = MV.drag(plot, { axis:"xy",
    handles:function(){
      var g = plot._g; if (S.mode !== "bal" || !g || anim || !g.pos) return [];
      var hs = S.data.map(function(v, i){ var q = g.pos[i]; return q ? { id:"d" + i, x:q[0], y:g.H - q[1], label:"Value " + v + (S.sel === i ? " (selected)" : "") + ". Arrow keys move it by 1; Shift + arrow by 5." } : null; }).filter(Boolean);
      if (fxCur != null) hs.push({ id:"f", x:g.cx, y:g.H - g.cy - 12, label:"Fulcrum at " + dN(fxCur, 1) + ". Arrow keys move it by 0.5." });
      return hs;
    },
    key:function(id, e){
      var dir = (e.key === "ArrowUp" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowDown" || e.key === "ArrowLeft") ? -1 : 0;
      if (id === "f") { if (!dir) return false; user(); stopF(); manual = true; fxCur = clamp(Math.round((fxCur + dir * (e.shiftKey ? 2 : 0.5)) * 10) / 10, 0, 20); render(); return true; }
      var i = +id.slice(1);
      if (e.key === "Delete" || e.key === "Backspace") { S.sel = i; removeVal(); return true; }
      if (!dir) return false; moveVal(i, dir * (e.shiftKey ? 5 : 1)); return true;
    },
    move:function(id, x, y, how){
      if (how !== "drag") return; var g = plot._g; if (!g) return;
      if (id === "f") { if (anim) cancelAnim(); stopF(); manual = true; fxCur = clamp(Math.round(g.fxOf(x) * 10) / 10, 0, 20); paintChart(); paintAha(); paintCtrl(); return; }
      var i = +id.slice(1); if (S.data[i] == null) return;
      var v = clampI(g.toVal(x, g.H - y), 0, 20, S.data[i]);
      if (S.sel !== i) { S.sel = i; paintCtrl(); paintChart(); }
      if (v === S.data[i]) return;
      if (anim) cancelAnim(); pv = {};
      S.data[i] = v; msg = ""; after();
    } });
  host.addEventListener("focusin", function(e){
    var h = e.target.closest && e.target.closest(".drag-h"); if (!h || !h.dataset.h || h.dataset.h[0] !== "d") return;
    var i = +h.dataset.h.slice(1); if (S.sel !== i) { S.sel = i; paintCtrl(); paintChart(); }
  });

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg") || b.classList.contains("drag-h")) return;
    if (b.dataset.dv != null) { user(); var i = +b.dataset.dv; S.sel = S.sel === i ? null : i; save(); render(); return; }
    var act = b.dataset.act;
    if (act === "dec" || act === "inc") { moveVal(S.sel, act === "inc" ? 1 : -1); return; }
    if (act === "rm") { removeVal(); return; }
    if (act === "avm" || act === "avp") { S.addV = clamp(S.addV + (act === "avp" ? 1 : -1), 0, 20); save(); paintCtrl(); return; }
    if (act === "add") { addVal(); return; }
    if (act === "balance") { user(); balanceNow(); return; }
    if (act === "reset") { user(); S.data = START.slice(); S.sel = null; manual = false; fxCur = null; msg = ""; save(); render(); MV.changed(); return; }
    if (act === "wadd" || act === "wrm") { user(); if (act === "wadd" && S.w.rows.length < 4) S.w.rows.push({ x:50, w:0 }); else if (act === "wrm" && S.w.rows.length > 2) S.w.rows.pop(); S.w.pre = ""; save(); render(); MV.changed(); return; }
    if (b.dataset.gf) { user(); var q = b.dataset.gf.split("|"); S.f[+q[0]] = clamp(S.f[+q[0]] + (+q[1]), 0, 10); save(); render(); MV.changed(); return; }
    if (act === "greset") { user(); S.f = GSTART.slice(); save(); render(); MV.changed(); }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-dv]"); if (!b) return;
    var i = +b.dataset.dv, dir = (e.key === "ArrowUp" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowDown" || e.key === "ArrowLeft") ? -1 : 0;
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); S.sel = i; removeVal(); return; }
    if (!dir) return; e.preventDefault(); moveVal(i, dir * (e.shiftKey ? 5 : 1));
  });
  host.addEventListener("input", function(e){
    var t = e.target, k;
    if (t.dataset.wx != null) { k = +t.dataset.wx; S.w.rows[k].x = clampI(t.value, 0, 100, 50); }
    else if (t.dataset.ww != null) { k = +t.dataset.ww; S.w.rows[k].w = Math.round(clampI(t.value, 0, 100, 0) / 5) * 5; }
    else return;
    if (anim) cancelAnim(); pv = {}; S.w.pre = ""; save(); paintCtrl(); paintChart(); paintRead(); paintCap(); paintTerms(); MV.changed();
  });

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); stopF(); msg = ""; manual = false; S.sel = null;
    var m = (p.start || {}).mode;
    S.mode = m;
    if (m === "bal" || m === "mid") S.data = START.slice();
    if (m === "wt") { S.w.rows = WPRE.p3.map(function(r){ return { x:r.x, w:r.w }; }); S.w.pre = "p3"; pv = { hide:true, wt:0, terms:0 }; }
    else if (m === "grp") { S.f = GSTART.slice(); pv = { hide:true, mid:false }; }
    else pv = {};
    fxCur = null; built = ""; save(); render();
  }
  function runPred(p, done){
    var a = newAnim(done);
    if (p.id === "p1") {
      var i = S.data.indexOf(11); if (i < 0) { S.data = START.slice(); i = 6; }
      a.fix = function(){ S.data[i] = 20; save(); };
      fxCur = 6; pv = { lockF:true }; render();
      later(300, function(){
        tw(MV.reduceMotion ? 0 : 1100, function(t){ S.data[i] = 11 + 9 * t; paintChart(); paintRead(); paintCap(); }, function(){
          S.data[i] = 20; save(); paintChart(); paintRead(); paintCap();
          later(500, function(){
            var to = st().mean;
            tw(MV.reduceMotion ? 0 : 1200, function(t){ fxCur = 6 + (to - 6) * t; paintChart(); }, function(){ fxCur = to; pv = {}; render(); MV.changed(); later(200, endAnim); });
          });
        });
      });
      return;
    }
    if (p.id === "p2") {
      var n0 = S.data.length;
      a.fix = function(){ if (S.data.length === n0) { S.data.push(6); save(); } };
      later(400, function(){
        S.data.push(6); save(); var ni = S.data.length - 1; pv = { br:0, fade:{} }; pv.fade[ni] = 0; render();
        tw(MV.reduceMotion ? 0 : 700, function(t){ pv.fade[ni] = t; paintChart(); }, function(){
          later(250, function(){
            tw(MV.reduceMotion ? 0 : 800, function(t){ pv.br = t; paintChart(); }, function(){ pv = {}; render(); MV.changed(); later(200, endAnim); });
          });
        });
      });
      return;
    }
    if (p.id === "p3") {
      pv = { hide:true, wt:0, terms:0 }; render();
      later(300, function(){
        tw(MV.reduceMotion ? 0 : 1100, function(t){ pv.wt = t; paintChart(); }, function(){
          pv.wt = 1; pv.hide = false; pv.terms = 1; render();
          later(600, function(){ pv.terms = 2; paintTerms(); later(600, function(){ pv = {}; render(); MV.changed(); later(200, endAnim); }); });
        });
      });
      return;
    }
    if (p.id === "p4") {
      pv = { hide:true, mid:false }; render();
      later(400, function(){ pv.mid = true; paintChart(); later(900, function(){ pv = {}; render(); MV.changed(); later(200, endAnim); }); });
      return;
    }
    later(10, endAnim);
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1" || id === "tc3") {
      if (S.mode !== "bal" && S.mode !== "mid") return R("Use <strong>Balance</strong> or <strong>Middle</strong> mode.");
      var s = st();
      if (id === "tc1") {
        if (s.n !== 5) return R("Use exactly five values.");
        if (s.sum !== 40) return R("Five values with mean 8 must total 40.");
        if (s.s[2] !== 6) return R("Sort them. The 3rd value must be 6.");
        return { ok:true };
      }
      if (s.n !== 6) return R("Use exactly six values.");
      if (s.sum !== 60) return R("Mean 10 with six values means a total of 60.");
      if (s.med !== 10) return R("Sort them. The 3rd and 4th values must average 10.");
      if (!(s.modes.length === 1 && s.modes[0] === 10)) return R("10 must appear more often than any other value.");
      if (s.range !== 12) return R("Largest minus smallest must be 12.");
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.mode !== "wt") return R("Use <strong>Weighted</strong> mode. (<strong>Term and exam</strong> sets it up.)");
      var rows = S.w.rows, ws = wStats(rows);
      if (rows.length !== 2) return R("Use two values: the term mark and the exam mark.");
      var ti = rows[0].x === 72 && rows[0].w === 70 ? 0 : rows[1].x === 72 && rows[1].w === 70 ? 1 : -1;
      if (ti < 0) return R("Set the term mark to 72 with a weight of 70%. (<strong>Term and exam</strong> sets it up.)");
      var ex = rows[1 - ti];
      if (ex.w !== 30) return R("The exam counts 30%: the weights must total 100%.");
      if (ex.x === 82) return { ok:true };
      if (ex.x === 78) return R("That would work only if both parts counted equally: (72 + 78) ÷ 2 = 75.");
      if (ex.x === 75) return R("An exam mark of 75 can’t lift a 72 term mark all the way to 75.");
      return R("The final mark is " + cTxt(ws.wm) + ", not 75.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: seven dots on a seesaw; the 11 slides to 20; the fulcrum follows; the median bracket stays on 5 ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", cap = f.cap;
  var st = { data:START.slice(), drop:[0, 0, 0, 0, 0, 0, 0], fx:6, fLab:"mean 6", medLab:"median 5" };
  plot.render = function(){ var s = stats(st.data); drawDots(plot, { data:st.data, x0:0, x1:20, fx:st.fx, mean:s.mean, med:s.med, medLab:st.medLab, fLab:st.fLab, drop:st.drop, unit:"value", describe:aria }); };
  function last(){ st = { data:[2, 4, 4, 5, 7, 9, 20], drop:null, fx:51 / 7, fLab:"mean ≈ 7.29", medLab:"median 5: it didn’t move" }; plot.render(); cap.textContent = "The 11 moved to 20: the mean slid from 6 to about 7.29, but the median stayed at 5."; }
  if (MV.reduceMotion) { last(); return; }
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  cap.textContent = "Seven dots balance at the mean, 6";
  tw(1100, function(t){ st.drop = st.data.map(function(v, i){ var u = clamp((t - i * 0.07) / 0.55, 0, 1); return (1 - (1 - Math.pow(1 - u, 3))) * 260; }); plot.render(); }, function(){
    st.drop = null; plot.render();
    MV.wait(1000, function(){
      cap.textContent = "The 11 slides to 20: the beam tips right";
      st.fLab = "fulcrum 6";
      tw(1000, function(t){ st.data[6] = 11 + 9 * t; plot.render(); }, function(){
        MV.wait(700, function(){
          cap.textContent = "The fulcrum slides to the new mean";
          tw(1100, function(t){ st.fx = 6 + (51 / 7 - 6) * t; plot.render(); }, function(){
            st.fLab = "mean ≈ 7.29"; plot.render();
            MV.wait(700, function(){ st.medLab = "median 5: it didn’t move"; plot.render(); MV.wait(600, last); });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Which centre? (four decision stations) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.items = obj(S.items);
  var msgs = {}, tabsR = null, plots = [];
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function ist(id){ var x = S.items[id] = obj(S.items[id]); x.tries = x.tries || 0; return x; }
  function done(s){ return s.plots ? s.plots.every(function(p){ return ist(p.id).solved; }) : !!ist(s.id).solved; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s) ? ' <span class="ct-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="wc-tabs" class="wc-tabs"></div><div id="wc-body" class="wc-body"></div>';
  tabText();
  tabsR = radios($("#wc-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function plotOpts(data, x0, x1, unit){
    var s = stats(data);
    return { data:data, x0:x0, x1:x1, fx:s.mean, mean:s.mean, med:s.med, medPair:s.mlo !== s.mhi ? [s.s[s.mlo], s.s[s.mhi]] : null, medLab:"median " + dN(s.med, 2), fLab:"mean " + cTxt(s.mean), tiltText:false, unit:unit,
      describe:"Dot plot, model data: " + s.s.map(function(v){ return dN(v, 2); }).join(", ") + ". The fulcrum (mean) is at " + MV.plain(cTxt(s.mean)) + " and the median bracket at " + dN(s.med, 2) + "." };
  }
  function choiceHTML(key, choices, picked, solved, lab){
    return '<div class="wc-ch" role="group" aria-label="' + MV.esc(lab) + '">' + choices.map(function(c){
      var id = String(c.id); return '<button type="button" class="btn ghost sm wc-c" data-wc="' + key + "|" + id + '" data-k="wc' + key + id + '"' + (solved ? " disabled" : "") + ' aria-pressed="' + (picked === id) + '">' + c.t + "</button>"; }).join("") + "</div>";
  }
  function stationHTML(s){
    var h = '<p class="wc-text">' + s.text + ' <span class="mdm-model">model data</span></p>';
    if (s.plots) {
      h += s.plots.map(function(p){
        var x = ist(p.id), fb = x.solved ? MV.fbHTML("good", "<strong>✓ Correct: " + s.shapes.filter(function(q){ return q.id === MV.ans(p); })[0].t + ".</strong> " + skewWhy(p) + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : msgs[p.id] ? MV.fbHTML("bad", msgs[p.id]) : "";
        return '<div class="wc-plotbox" data-wcp="' + p.id + '"><p class="wc-pl">' + p.label + '</p><div class="plot-wrap"><canvas class="plot wide wc-plot" data-pid="' + p.id + '" role="img" aria-label="' + p.label + '"></canvas></div>' + choiceHTML(p.id, s.shapes, x.pick, x.solved, p.label + ": shape") + fb + "</div>";
      }).join("");
      if (done(s)) h += '<p class="wc-after"><strong>' + s.rule + "</strong></p>";
      return h;
    }
    var x = ist(s.id), c = x.pick != null ? s.choices.filter(function(q){ return q.id === x.pick; })[0] : null;
    h += '<div class="plot-wrap"><canvas class="plot wide wc-plot" data-pid="' + s.id + '" role="img" aria-label="' + MV.esc(s.title) + ' dot plot"></canvas></div>';
    h += '<div data-wcp="' + s.id + '">' + choiceHTML(s.id, s.choices, x.pick, x.solved, "Which centre?");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + c.fb + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[s.id]) h += MV.fbHTML("bad", msgs[s.id]);
    h += "</div>";
    if (x.solved) {
      var ss = stats(s.data);
      h += '<details class="alg"><summary>Check it with data</summary><p>' + s.check + "</p>" +
        MV.tableHTML({ head:["Sorted position", "Value"], caption:"Sorted data", rows:ss.s.map(function(v, k){ return [String(k + 1) + (k >= ss.mlo && k <= ss.mhi ? " (middle)" : ""), dN(v, 2)]; }).concat([["<strong>Total</strong>", "<strong>" + dN(ss.sum, 2) + "</strong>"]]) }) + "</details>";
    }
    return h;
  }
  function skewWhy(p){ var s = stats(p.data); return "Mean " + cTxt(s.mean) + ", median " + dN(s.med, 2) + ": " + (MV.ans(p) === "right" ? "the long tail of high values pulls the mean above the median." : MV.ans(p) === "left" ? "the long tail of low values pulls the mean below the median." : "no long tail, so the mean and median agree."); }
  function paint(){
    tabText(); tabsR.refresh();
    var s = st(S.cur), body = $("#wc-body", host);
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="wc-card0"><span class="wc-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + "</span>" + stationHTML(s) + "</div>"; });
    plots = [];
    body.querySelectorAll("canvas[data-pid]").forEach(function(cv){
      var pid = cv.dataset.pid, src = s.plots ? s.plots.filter(function(q){ return q.id === pid; })[0] : s, o = s.plots ? plotOpts(src.data, 0, 11, "value") : plotOpts(s.data, s.x0, s.x1, s.unit);
      var pl = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }); pl.render = function(){ drawDots(pl, o); }; pl.render(); plots.push(pl);
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (!b.dataset.wc) return;
    var q = b.dataset.wc.split("|"), key = q[0], pick = q[1], s = st(S.cur), x = ist(key);
    x.pick = pick;
    if (s.plots) {
      var p = s.plots.filter(function(z){ return z.id === key; })[0];
      if (MV.ans(p) === pick) { x.solved = true; x.first = x.tries === 0; msgs[key] = null; }
      else { x.tries++; var ss = stats(p.data); msgs[key] = "<strong>✗ Not quite.</strong> Compare the mean (" + cTxt(ss.mean) + ") with the median (" + dN(ss.med, 2) + "): the mean is pulled toward the tail. Try again."; }
    } else {
      var c = s.choices.filter(function(z){ return String(z.id) === pick; })[0];
      if (MV.ok(c)) { x.solved = true; x.first = x.tries === 0; msgs[key] = null; }
      else { x.tries++; msgs[key] = "<strong>✗ Not quite.</strong> " + c.fb + " Try again."; }
    }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-wcp="' + key + '"]'));
  });
  paint();
  return {};
}

// ---------- Practice: Find it ----------
// @component N4 numEntry (copied from MDM4U 20) — number entry: one box per part (parts:[label…]); numbers accept decimals and
// fractions (MV.parseNum) within tol (default 0.01); named wrong answers ({part, match, fb}); an item-level fb for any other
// wrong answer; three-level hints when the item has them; first-try scoring as the toolkit's N4.
function num(raw){ var s = String(raw == null ? "" : raw).replace(/[$\s,]/g, ""); if (!s) return null; var r = MV.parseNum(s); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
function numEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = []; return x; }
  function partsOf(it){ return it.parts || [it.label || "Your answer:"]; }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], P = partsOf(it), tol = it.tol || 0.01;
    var got = A.map(function(_, k){ return num(vals[k]); });
    if (got.some(function(v){ return v == null; })) return { bad:true };
    var oks = got.map(function(g, k){ return Math.abs(g - A[k]) <= tol + 1e-9; });
    if (oks.every(Boolean)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ var k = w.part || 0, g = got[k]; return !oks[k] && Math.abs(g - w.match) <= tol + 1e-9; })[0];
    var fb = named ? named.fb : null;
    if (!fb && A.length > 1) {
      var lab = function(k){ return P[k].replace(/\s*[=:]\s*$/, ""); };
      var right = oks.map(function(o, k){ return o ? lab(k) : null; }).filter(Boolean), wrong = oks.map(function(o, k){ return o ? null : lab(k); }).filter(Boolean);
      if (right.length) fb = right.join(" and ") + (right.length > 1 ? " are" : " is") + " right. Check " + wrong.join(" and ") + ".";
    }
    return { ok:false, fb:fb || it.fb || null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), P = partsOf(it);
        var h = '<div class="q" data-ne="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="ne-row">' + P.map(function(p, k){
          return '<label class="ne-lab" for="ne-' + it.id + k + '"><span>' + p + '</span><input class="numin ne-in" id="ne-' + it.id + k + '" data-nin="' + it.id + '" data-nk="' + k + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val[+e.target.dataset.nk] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ne]"); if (!box) return;
    var it = a.items.filter(function(y){ return y.id === box.dataset.ne; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (partsOf(it).length > 1 ? "Fill in every part. " : "") + "Enter a number such as 7.5."; paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " " : "") + "Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ne="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Five quiz scores ----------
var task = (function(){
  var api = null, plot = null;
  function vals(){ var s = api ? api.S : {}; if (!Array.isArray(s.v) || s.v.length !== 5) s.v = [5, 5, 5, 5, 5]; s.v = s.v.map(function(v){ return clampI(v, 0, 10, 5); }); return s.v; }
  function read(){ return { s:sorted(vals()) }; }
  function key(d){ return d.s.join(","); }
  function lab(k){ return k.split(",").join(", "); }
  function paint(){
    var d = read(), s = stats(d.s), pv = $("#qs-read"); if (!pv) return;
    if (plot) plot.render();
    pv.innerHTML = MV.readoutHTML([["Sorted", d.s.join(", ")], ["Total", String(s.sum)], ["Mean", cTxt(s.mean)], ["Median (3rd score)", String(s.med)], ["Mode", modeTxt(s)], ["Range", s.s[4] + " − " + s.s[0] + " = " + s.range]]);
  }
  return {
    render:function(inp, pvw, a){
      api = a; var v = vals();
      inp.innerHTML = '<div class="qs-in">' + v.map(function(x, i){ return slider("qs-s" + i, "Score " + (i + 1), 0, 10, 1, x, x, ' data-qs="' + i + '"'); }).join("") + "</div>";
      pvw.innerHTML = '<div class="plot-wrap"><canvas class="plot wide qs-plot" id="qs-plot" role="img" aria-label="Your scores as a dot plot"></canvas></div><dl class="read" id="qs-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#qs-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 });
      plot.render = function(){
        var d = read(), s = stats(d.s);
        drawDots(plot, { data:d.s, x0:0, x1:10, fx:s.mean, mean:s.mean, med:s.med, medLab:"median " + s.med, fLab:"mean " + cTxt(s.mean), tiltText:false, unit:"score",
          describe:"Your scores sorted: " + d.s.join(", ") + ". The beam balances at the mean, " + MV.plain(cTxt(s.mean)) + "; the median bracket is on " + s.med + "." });
      };
      inp.addEventListener("input", function(e){
        var t = e.target; if (t.dataset.qs == null) return; var i = +t.dataset.qs, x = clampI(t.value, 0, 10, 5);
        api.S.v[i] = x; var o = $("#qs-s" + i + "-o"); if (o) o.textContent = x; t.setAttribute("aria-valuetext", String(x));
        api.save(); paint(); api.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var s = stats(d.s), c8 = s.cnt[8] || 0, only8 = c8 >= 2 && Object.keys(s.cnt).every(function(v){ return +v === 8 || s.cnt[v] < c8; });
      return [s.sum === 30, d.s[2] === 7, only8, s.range <= 7];
    },
    key:key,
    label:function(k){ return lab(k); },
    text:function(k){ return lab(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ find:numEntry },
  task:task
});
})();
