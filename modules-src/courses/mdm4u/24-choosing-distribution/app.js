// MDM4U 24 Choosing the Right Distribution: hero (two scenario cards slide down a decision tree to Hypergeometric and
// Geometric), Distribution detective (Explore: Route it = 12-card deck, Yes/No question chips with a drawn route, parameter
// boxes checked against the card, the distribution and its readout; Compare = two distributions on shared axes, the first
// solid --pen, the second teal outlined; a scenario builder for TC3), Mixed problems (Part 3: four stations), Mixed
// calculations (N4 probEntry), Same mean, different model task. Every distribution is exact (no simulation).
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function C(n, r){ return MV.mdm.nCr(n, r); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function dec(v, dp){ var p = Math.pow(10, dp), s = (Math.round(v * p) / p).toFixed(dp).replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace("-", MV.MINUS); }
function d2(v){ return dec(v, 2); }
function obj(o){ return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
function narrow(){ return (document.documentElement.clientWidth || window.innerWidth) < 560; }
function isSq(v){ var s = Math.round(Math.sqrt(v)); return s * s === v; }

// @component radioGroup (copied from MDM4U 21 / 18; adds o.k, a data-k prefix so MV.keepFocus can restore focus)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id), k}) -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) || ids.indexOf(val) < 0 ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (o.k ? ' data-k="' + o.k + id.replace(/[^\w]/g, "_") + '"' : "") + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// ---------- the four models (plus "none": the sum of two dice) ----------
var NAMES = { uni:"Uniform", bin:"Binomial", geo:"Geometric", hyp:"Hypergeometric", none:"None of these" };
var PCH = ["1/6", "1/5", "1/4", "0.3", "1/3", "2/5", "1/2", "2/3", "3/4"];
function pf(s){ return F.parse(String(s)); }
function qTxt(s){ return String(s).indexOf(".") >= 0 ? dec(1 - F.val(pf(s)), 4) : F.txt(F.comp(pf(s))); }
// dist({m, k | n, p | p | n, a, r}) -> {m, rows:[{x, p}], Ef, Vf, E, V, sd, x0, x1, more}
function dist(s){
  var o = { m:s.m, rows:[] }, x, p, pv;
  if (s.m === "uni") { for (x = 1; x <= s.k; x++) o.rows.push({ x:x, p:1 / s.k }); o.Ef = F.of(s.k + 1, 2); o.Vf = F.of(s.k * s.k - 1, 12); }
  else if (s.m === "bin") { p = pf(s.p); pv = F.val(p); for (x = 0; x <= s.n; x++) o.rows.push({ x:x, p:C(s.n, x) * Math.pow(pv, x) * Math.pow(1 - pv, s.n - x) }); o.Ef = F.mul(F.of(s.n, 1), p); o.Vf = F.mul(o.Ef, F.comp(p)); }
  else if (s.m === "geo") {
    p = pf(s.p); pv = F.val(p); var q = 1 - pv, x1 = 0;
    while (Math.pow(q, x1 + 1) >= 0.002 && x1 < 30) x1++;
    for (x = 0; x <= x1; x++) o.rows.push({ x:x, p:Math.pow(q, x) * pv });
    o.Ef = F.div(F.comp(p), p); o.Vf = F.div(F.comp(p), F.mul(p, p)); o.more = true;
  }
  else if (s.m === "hyp") { var N = s.n, a = s.a, r = s.r, tot = C(N, r); for (x = Math.max(0, r - (N - a)); x <= Math.min(a, r); x++) o.rows.push({ x:x, p:C(a, x) * C(N - a, r - x) / tot }); o.Ef = F.of(r * a, N); o.Vf = F.of(r * a * (N - a) * (N - r), N * N * (N - 1)); }
  else { for (x = 2; x <= 12; x++) o.rows.push({ x:x, p:(6 - Math.abs(x - 7)) / 36 }); o.Ef = F.of(7, 1); o.Vf = F.of(35, 6); }
  o.E = F.val(o.Ef); o.V = F.val(o.Vf); o.sd = Math.sqrt(o.V);
  o.x0 = o.rows.length ? o.rows[0].x : 0; o.x1 = o.rows.length ? o.rows[o.rows.length - 1].x : 0;
  return o;
}
function eTxt(f){ if (f.d === 1) return String(f.n); var v = f.n / f.d, ex = Math.abs(Math.round(v * 100) / 100 - v) < 1e-12; return F.txt(f) + (ex ? " = " : " ≈ ") + d2(v); }
function sdTxt(Vf){
  if (isSq(Vf.n) && isSq(Vf.d)) return "σ = " + F.txt(F.of(Math.round(Math.sqrt(Vf.n)), Math.round(Math.sqrt(Vf.d))));
  return "σ = √{" + F.txt(Vf) + "} ≈ " + d2(Math.sqrt(Vf.n / Vf.d));
}
function eLab(d){ var ex = Math.abs(Math.round(d.E * 100) / 100 - d.E) < 1e-12; return "E " + (ex ? "=" : "≈") + " " + d2(d.E); }
function sdShort(Vf){ return isSq(Vf.n) && isSq(Vf.d) ? "σ = " + F.txt(F.of(Math.round(Math.sqrt(Vf.n)), Math.round(Math.sqrt(Vf.d)))) : "σ ≈ " + d2(Math.sqrt(Vf.n / Vf.d)); }
function nameHTML(s){
  if (s.m === "uni") return "Uniform, " + M("k = " + s.k);
  if (s.m === "bin") return "Binomial " + M("(" + s.n + ", " + s.p + ")");
  if (s.m === "geo") return "Geometric " + M("(" + s.p + ")");
  if (s.m === "hyp") return "Hypergeometric " + M("(" + s.n + ", " + s.a + ", " + s.r + ")");
  return "None of these";
}
function namePlain(s){ return MV.plain(nameHTML(s)); }
function parHTML(s){
  if (s.m === "uni") return M("k = " + s.k);
  if (s.m === "bin") return M("n = " + s.n) + ", " + M("p = " + s.p);
  if (s.m === "geo") return M("p = " + s.p);
  if (s.m === "hyp") return M("n = " + s.n) + ", " + M("a = " + s.a) + ", " + M("r = " + s.r);
  return "No named model: values 2–12, not equally likely";
}
function formulaHTML(s){
  if (s.m === "uni") return M("P(X = x) = 1/" + s.k) + " for " + M("x = 1, 2, …, " + s.k);
  if (s.m === "bin") return s.p === "1/2" ? M("P(X = x) = C(" + s.n + ", x)(1/2)^" + s.n) : M("P(X = x) = C(" + s.n + ", x)(" + s.p + ")^x(" + qTxt(s.p) + ")^{" + s.n + " - x}");
  if (s.m === "geo") return M("P(X = x) = (" + qTxt(s.p) + ")^x(" + s.p + ")") + " for " + M("x = 0, 1, 2, …");
  if (s.m === "hyp") return M("P(X = x) = C(" + s.a + ", x) C(" + (s.n - s.a) + ", " + s.r + " - x) ÷ C(" + s.n + ", " + s.r + ")");
  return M("P(X = x)") + " = (ways to roll a sum of " + M("x") + ") ÷ 36";
}

// @component D7 distChart — compare version (adapted from MDM4U 21's D7 distChart): probability histograms on the toolkit's
// Plot engine with their own axes; several series on shared axes: series 0 solid (--pen), later series outlined (teal --ev-b);
// a dashed E(X) line per series in its colour; grow (0–1) scales the bars, upto reveals them left to right; "more" marks an
// unbounded tail; labels {x:text} print over series 0.
// distChart(plot, { x0, x1, ymax, yStep, series:[{rows, col, outline, mean, meanLabel}], labels, more, grow, upto, describe })
function distChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(160, r.width), H = Math.max(120, r.height);
  var L = 46, R = 18, T = 30, B = 30, n = o.x1 - o.x0 + 1, bw = (W - L - R) / n, ys = (H - T - B) / o.ymax;
  var view = { xmin:o.x0 - 0.5 - L / bw, xmax:o.x1 + 0.5 + R / bw, ymin:-B / ys, ymax:o.ymax + T / ys };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(o.x0 - 0.5), xb = X(o.x1 + 0.5), y0 = Y(0), yt = Y(o.ymax);
    var sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM, g = o.grow == null ? 1 : o.grow;
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    var step = o.yStep, v;
    for (v = step; v <= o.ymax + 1e-9; v += step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += step) ctx.fillText(MV.num(Math.round(v * 1e6) / 1e6, step < 0.1 ? 2 : 1), xa - 6, Y(v));
    (o.series || []).forEach(function(s){
      var col = css(s.col || "--pen");
      s.rows.forEach(function(b){
        if (!(b.p > 0) || b.x < o.x0 || b.x > o.x1 || (o.upto != null && b.x > o.upto)) return;
        var top = Math.max(yt - 4, Y(Math.min(b.p * g, o.ymax * 1.03))), x1 = X(b.x - 0.5), x2 = X(b.x + 0.5);
        if (s.outline) { var ins = Math.min(4, (x2 - x1) / 5); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.strokeRect(x1 + ins, top + 1.25, x2 - x1 - 2 * ins, Math.max(0, y0 - top - 1.25)); }
        else { ctx.fillStyle = col; ctx.fillRect(x1, top, x2 - x1, y0 - top); if (x2 - x1 > 4) { ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, top + 0.5, x2 - x1 - 1, Math.max(0, y0 - top - 1)); } }
      });
    });
    (o.series || []).forEach(function(s, si){
      if (s.mean == null || s.mean < o.x0 - 0.5 || s.mean > o.x1 + 0.5) return;
      var col = css(s.col || "--pen"), mx = X(s.mean);
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, yt - 2); ctx.stroke(); ctx.setLineDash([]);
      if (s.meanLabel) {
        ctx.font = "700 12px " + fUI; ctx.textBaseline = "bottom"; ctx.textAlign = si ? "left" : "right";
        var tw = ctx.measureText(s.meanLabel).width, lx = si ? Math.min(xb - tw, mx + 4) : Math.max(xa + tw, mx - 4);
        ctx.fillStyle = sheet; ctx.globalAlpha = 0.9; ctx.fillRect(si ? lx - 2 : lx - tw - 2, yt - 20, tw + 4, 16); ctx.globalAlpha = 1;
        ctx.fillStyle = col; ctx.fillText(s.meanLabel, lx, yt - 5);
      }
    });
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xa, yt - 6); ctx.lineTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    ctx.fillStyle = ink; ctx.font = "14px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var every = [1, 2, 5, 10].filter(function(k){ return bw * k >= 22; })[0] || 10;
    for (var x = o.x0; x <= o.x1; x++) if ((x - o.x0) % every === 0) ctx.fillText(String(x), X(x), y0 + 6);
    if (o.more) { ctx.fillStyle = ink2; ctx.font = "700 14px " + fUI; ctx.textAlign = "right"; ctx.fillText("…", W - 2, y0 + 4); }
    if (o.labels && o.series && o.series[0]) {
      ctx.font = "600 12px " + fUI; ctx.textBaseline = "bottom"; ctx.fillStyle = ink; ctx.textAlign = "center";
      Object.keys(o.labels).forEach(function(k){ var xx = +k, b = o.series[0].rows.filter(function(q){ return q.x === xx; })[0], h = b ? Math.min(b.p * g, o.ymax) : 0; ctx.fillText(o.labels[k], X(xx), Y(h) - 3); });
    }
    ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("P(X = x)", 4, 3);
    ctx.textAlign = "right"; ctx.fillText("x", xa - 6, y0 + 6);
  } });
}
var SCALES = [[0.1, 0.02], [0.15, 0.05], [0.2, 0.05], [0.25, 0.05], [0.3, 0.1], [0.4, 0.1], [0.5, 0.1], [0.6, 0.2], [0.8, 0.2], [1, 0.2]];
function scaleOf(m){ var s = SCALES.filter(function(q){ return q[0] >= Math.min(1, m * 1.08); })[0] || SCALES[SCALES.length - 1]; return { ymax:s[0], step:s[1] }; }
function maxP(list){ var m = 0; list.forEach(function(d){ d.rows.forEach(function(r){ m = Math.max(m, r.p); }); }); return m; }

// @component decisionTree — the model router as an SVG tree (module-specific): question boxes Equally likely? → Fixed trials?
// → Without replacement? / Waiting?, leaves Uniform … None of these; edges on a route draw in --ink (route 2 in teal),
// reached leaves light in highlighter yellow. treeSVG({ dy, r1:[[from, to]], r2, lit:{leaf:1}, lit2, tok:{x, y}, tok2, none })
var TN = { q1:{ x:150, y:26, t:"Equally likely?", w:104 }, q2:{ x:252, y:90, t:"Fixed trials?", w:92 }, q4:{ x:174, y:154, t:"Without replacement?", w:136 }, q3:{ x:345, y:154, t:"Waiting?", w:68 },
  uni:{ x:36, y:220, t:"Uniform", w:64 }, hyp:{ x:124, y:220, t:"Hypergeometric", w:100 }, bin:{ x:226, y:220, t:"Binomial", w:68 }, geo:{ x:302, y:220, t:"Geometric", w:74 }, none:{ x:384, y:220, t:"None of these", w:84 } };
var TE = [["q1", "uni", "Yes"], ["q1", "q2", "No"], ["q2", "q4", "Yes"], ["q2", "q3", "No"], ["q4", "hyp", "Yes"], ["q4", "bin", "No"], ["q3", "geo", "Yes"], ["q3", "none", "No"]];
var NEXT = { q1:{ y:"uni", n:"q2" }, q2:{ y:"q4", n:"q3" }, q3:{ y:"geo", n:"none" }, q4:{ y:"hyp", n:"bin" } };
function onRoute(list, a, b){ return (list || []).some(function(e){ return e[0] === a && e[1] === b; }); }
function treeSVG(o){
  var dy = o.dy || 0, h = "";
  TE.forEach(function(e){
    if (e[1] === "none" && o.none === false) return;
    var A = TN[e[0]], Bn = TN[e[1]], c = onRoute(o.r1, e[0], e[1]) ? " on" : onRoute(o.r2, e[0], e[1]) ? " on2" : "";
    var x1 = A.x, y1 = A.y + 12 + dy, x2 = Bn.x, y2 = Bn.y - 12 + dy;
    h += '<line class="cd-te' + c + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    h += '<text class="cd-tyn' + c + '" x="' + (mx + (x2 < x1 ? -6 : 6)) + '" y="' + (my + 4) + '" text-anchor="' + (x2 < x1 ? "end" : "start") + '">' + e[2] + "</text>";
  });
  Object.keys(TN).forEach(function(k){
    if (k === "none" && o.none === false) return;
    var n = TN[k], leaf = k.charAt(0) !== "q", lit = (o.lit || {})[k] ? " lit" : (o.lit2 || {})[k] ? " lit2" : "";
    h += '<g class="cd-tn' + (leaf ? " leaf" : "") + lit + '"><rect x="' + (n.x - n.w / 2) + '" y="' + (n.y - 12 + dy) + '" width="' + n.w + '" height="24" rx="' + (leaf ? 12 : 5) + '"/><text x="' + n.x + '" y="' + (n.y + 4.5 + dy) + '" text-anchor="middle">' + n.t + "</text></g>";
  });
  [o.tok, o.tok2].forEach(function(t, i){ if (t) h += '<g class="cd-tok' + (i ? " two" : "") + '"><rect x="' + (t.x - 11).toFixed(1) + '" y="' + (t.y - 8).toFixed(1) + '" width="22" height="16" rx="3"/></g>'; });
  return h;
}

// ---------- hero: "Deal 4 cards; count the aces" → Hypergeometric, then "Roll until a 6" → Geometric ----------
function hero(f){
  var box = f.fig && f.fig.querySelector("#cd-hfig"); if (!box) return;
  var cap = f.cap, DY = 52;
  var R1 = [["q1", "q2"], ["q2", "q4"], ["q4", "hyp"]], R2 = [["q1", "q2"], ["q2", "q3"], ["q3", "geo"]];
  var C1 = "Deal 4 cards; count the aces", C2 = "Roll until a 6";
  var aria = "A decision tree. The card ‘Deal 4 cards; count the aces’ goes: equally likely? no; fixed trials? yes; without replacement from a small group? yes; it lands on Hypergeometric. The card ‘Roll until a 6’ goes: equally likely? no; fixed trials? no; waiting for a first success? yes; it lands on Geometric.";
  var st = { c1:0, c2:0, r1:[], r2:[], lit:{}, lit2:{}, tok:null, tok2:null };
  function lightEq(){ var eq = document.querySelectorAll(".cd-hh"); Array.prototype.forEach.call(eq, function(el){ el.classList.toggle("on", !!(st.lit[el.dataset.m] || st.lit2[el.dataset.m])); }); }
  function svg(){
    var h = '<g opacity="' + st.c1.toFixed(2) + '"><rect class="cd-hc" x="6" y="6" width="200" height="30" rx="6"/><text class="cd-hct" x="106" y="25" text-anchor="middle">' + C1 + "</text></g>";
    h += '<g opacity="' + st.c2.toFixed(2) + '"><rect class="cd-hc two" x="250" y="6" width="150" height="30" rx="6"/><text class="cd-hct" x="325" y="25" text-anchor="middle">' + C2 + "</text></g>";
    h += treeSVG({ dy:DY, r1:st.r1, r2:st.r2, lit:st.lit, lit2:st.lit2, tok:st.tok, tok2:st.tok2, none:false });
    box.innerHTML = '<svg class="cd-hsvg" viewBox="0 0 426 ' + (232 + DY + 8) + '" role="img" aria-label="' + MV.esc(aria) + '">' + h + "</svg>";
    lightEq();
  }
  function last(){ st = { c1:1, c2:1, r1:R1.slice(), r2:R2.slice(), lit:{ hyp:1 }, lit2:{ geo:1 }, tok:null, tok2:null }; svg(); cap.textContent = "Deal 4 cards → Hypergeometric · Roll until a 6 → Geometric. Which one fits?"; }
  if (MV.reduceMotion) { last(); return; }
  function pt(k){ return { x:TN[k].x, y:TN[k].y + DY }; }
  function run(start, route, caps, key, done){
    var pts = [start].concat(route.map(function(e){ return pt(e[1]); })), seg = 0;
    pts.splice(1, 0, pt("q1"));
    (function next(){
      if (seg >= pts.length - 1) { done(); return; }
      cap.textContent = caps[seg];
      var a = pts[seg], b = pts[seg + 1];
      MV.tween({ dur:seg === 0 ? 700 : 900, step:function(t){ st[key] = { x:a.x + (b.x - a.x) * t, y:a.y + (b.y - a.y) * t }; svg(); }, done:function(){
        if (seg >= 1) st[key === "tok" ? "r1" : "r2"].push(route[seg - 1]);
        seg++; svg(); MV.wait(350, next);
      } });
    })();
  }
  svg(); cap.textContent = C1;
  MV.tween({ dur:500, step:function(t){ st.c1 = t; svg(); }, done:function(){
    run({ x:106, y:36 }, R1, [C1, "Equally likely? No", "Fixed trials? Yes", "Without replacement from a small group? Yes"], "tok", function(){
      st.tok = null; st.lit.hyp = 1; svg(); cap.textContent = "Hypergeometric";
      MV.wait(1100, function(){
        MV.tween({ dur:500, step:function(t){ st.c2 = t; svg(); }, done:function(){
          run({ x:325, y:36 }, R2, [C2, "Equally likely? No", "Fixed trials? No", "Waiting for a first success? Yes"], "tok2", function(){
            st.tok2 = null; st.lit2.geo = 1; svg(); cap.textContent = "Geometric";
            MV.wait(1200, last);
          });
        } });
      });
    });
  } });
}

// ---------- Explore: the distribution detective ----------
var QS = [
  { id:"q1", t:"Are all values equally likely?", s:"Equally likely?" },
  { id:"q2", t:"Is the number of trials fixed? (`X` counts the successes in them.)", s:"Fixed trials?" },
  { id:"q3", t:"Are we waiting for a first success?", s:"Waiting?" },
  { id:"q4", t:"Are items drawn without replacement from a small group?", s:"Without replacement?" }];
function qById(id){ return QS.filter(function(q){ return q.id === id; })[0]; }
function routeOf(ans){
  var path = [], q = "q1", guard = 0;
  while (q && guard++ < 6) {
    var v = ans[q]; if (v !== "y" && v !== "n") return { path:path, leaf:null, next:q };
    var nx = NEXT[q][v]; path.push([q, nx, v]);
    if (nx.charAt(0) !== "q") return { path:path, leaf:nx, next:null };
    q = nx;
  }
  return { path:path, leaf:null, next:null };
}
var FITCLUE = { uni:"Each value here is equally likely.", bin:"A fixed number of independent trials, each with the same `p`.", geo:"Read the stop rule: ‘until …’ means waiting.",
  hyp:"The items aren’t put back, and the group is small.", none:"Are the values equally likely? Does `X` count successes, or a wait?" };
// parameter fields per model (hyp: n = group size)
function fieldsOf(m){
  if (m === "uni") return [{ id:"k", lab:"`k` (number of values)", lo:2, hi:30 }];
  if (m === "bin") return [{ id:"n", lab:"`n` (trials)", lo:1, hi:20 }, { id:"p", chip:true }];
  if (m === "geo") return [{ id:"p", chip:true }];
  if (m === "hyp") return [{ id:"n", lab:"`n` (group size)", lo:2, hi:60 }, { id:"a", lab:"`a` (successes in the group)", lo:0, hi:60 }, { id:"r", lab:"`r` (draws)", lo:1, hi:20 }];
  return [];
}
// raw strings -> {ok, spec, err}
function specOf(m, raw){
  raw = obj(raw); var s = { m:m }, err = null;
  fieldsOf(m).forEach(function(f){
    if (err) return;
    if (f.chip) { if (PCH.indexOf(raw.p) < 0) err = "Choose " + M("p") + " from the chips."; else s.p = raw.p; return; }
    var t = String(raw[f.id] == null ? "" : raw[f.id]).trim(), v = /^\d+$/.test(t) ? +t : NaN;
    if (!t) { err = "Enter " + MV.md(f.lab.split(" ")[0]) + "."; return; }
    if (!(v >= f.lo && v <= f.hi)) { err = "Enter a whole number from " + f.lo + " to " + f.hi + " for " + MV.md(f.lab.split(" ")[0]) + "."; return; }
    s[f.id] = v;
  });
  if (!err && m === "hyp") { if (s.a > s.n) err = M("a") + " can’t be more than the group size " + M("n") + "."; else if (s.r > s.n) err = M("r") + " can’t be more than the group size " + M("n") + "."; }
  return err ? { ok:false, err:err } : { ok:true, spec:s };
}
function rawOf(s){ var o = {}; ["k", "n", "p", "a", "r"].forEach(function(k){ if (s[k] != null) o[k] = String(s[k]); }); return o; }

function explore(host, api){
  var S = api.S, CARDS = (api.content || {}).cards || [];
  function sanitize(){
    if (["route", "compare"].indexOf(S.view) < 0) S.view = "route";
    S.card = clampI(S.card, 1, CARDS.length || 1, 1);
    S.cs = obj(S.cs);
    ["A", "B"].forEach(function(k, i){ var x = S[k] = obj(S[k]); if (!NAMES[x.m] || x.m === "none") x.m = i ? "hyp" : "bin"; x.par = obj(x.par); });
    if (!S.A.par.bin) S.A.par.bin = { n:"4", p:"1/2" };
    if (!S.B.par.hyp) S.B.par.hyp = { n:"8", a:"4", r:"4" };
    var b = S.bld = obj(S.bld);
    if (["spin", "bag"].indexOf(b.act) < 0) b.act = "spin";
    if (["1/6", "1/4", "1/3", "1/2"].indexOf(b.p) < 0) b.p = "1/3";
    if (["four", "until"].indexOf(b.stop) < 0) b.stop = "four";
    if (["with", "without"].indexOf(b.rep) < 0) b.rep = "with";
    if (["reds", "non"].indexOf(b.cnt) < 0) b.cnt = "reds";
  }
  sanitize();
  var pv = {}, anim = null, plot, plot2;
  function card(){ return CARDS[S.card - 1] || CARDS[0]; }
  function cst(){ var c = card(), x = S.cs[c.id] = obj(S.cs[c.id]); x.ans = obj(x.ans); x.par = obj(x.par); return x; }
  function save(){ api.save(); }

  host.innerHTML =
    '<div id="cd-view" class="cd-view"></div>' +
    '<div class="cd-pg" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="cd-route" class="cd-route">' +
        '<div class="cd-deck"><button type="button" class="btn sm" id="cd-prev" data-k="cdprev">← Previous</button><span class="cd-cn" id="cd-cn" aria-live="polite"></span><button type="button" class="btn sm" id="cd-next" data-k="cdnext">Next →</button></div>' +
        '<p class="cd-card" id="cd-card"></p>' +
        '<div class="cd-rt"><div class="cd-qs" id="cd-qs"></div><div class="cd-tree" id="cd-tree"></div></div>' +
        '<div class="cd-pars" id="cd-pars"></div>' +
      "</div>" +
      '<div id="cd-cmp" class="cd-cmp" hidden><div class="cd-pick" id="cd-pa"></div><div class="cd-pick two" id="cd-pb"></div></div>' +
      '<div class="cd-chart" id="cd-chart"><div class="plot-wrap cd-pw"><canvas class="plot cd-plot" id="cd-plot" role="img" aria-label="Probability histogram"></canvas></div>' +
        '<div class="plot-wrap cd-pw cd-pw2" id="cd-pw2" hidden><canvas class="plot cd-plot" id="cd-plot2" role="img" aria-label="Probability histogram of distribution 2"></canvas></div></div>' +
      '<p class="tiny muted cd-empty" id="cd-empty"></p>' +
      '<dl class="read cd-read" id="cd-read" aria-live="polite"></dl>' +
      '<details class="cd-bld" id="cd-bld"><summary>Scenario builder (for challenge 3)</summary><div id="cd-bldb" class="cd-bldb"></div></details>' +
    "</div>";

  plot = new MV.Plot($("#cd-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = paintChart;
  plot2 = new MV.Plot($("#cd-plot2", host), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot2.render = paintChart;
  var viewR = radios($("#cd-view", host), { label:"View", options:[{ id:"route", t:"Route it" }, { id:"compare", t:"Compare" }], value:S.view, cls:"seg", k:"cdv",
    onChange:function(v){ user(); S.view = v; save(); render(); MV.changed(); } });

  // --- animation bookkeeping: any user action finishes the running animation ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    pv = {}; render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } pv = {}; render(); MV.changed(); }
  function user(){ if (anim) cancelAnim(); else if (pv.lock || pv.hide) pv = {}; MV.banner("", ""); }

  // --- Route it ---
  function curSpec(){
    var x = cst(), R = routeOf(x.ans);
    if (!R.leaf) return { R:R };
    if (R.leaf === "none") return { R:R, spec:card().fit === "none" ? { m:"none" } : null };
    var sp = specOf(R.leaf, x.par[R.leaf]);
    return { R:R, spec:sp.ok ? sp.spec : null, err:sp.ok ? null : sp.err };
  }
  function paintQs(){
    var x = cst(), R = routeOf(x.ans), show = R.path.map(function(e){ return e[0]; });
    if (R.next) show.push(R.next);
    var qs = $("#cd-qs", host);
    MV.keepFocus(qs, function(){
      qs.innerHTML = '<p class="cd-qh">Answer each question:</p>' + show.map(function(id, i){ var q = qById(id); return '<div class="cd-q" data-q="' + id + '"><p class="cd-qt"><span class="cd-qn">' + (i + 1) + ".</span> " + MV.md(q.t) + '</p><div class="cd-qr"></div></div>'; }).join("") +
        (R.leaf ? '<p class="cd-leaf">' + (R.leaf === "none" ? "No named model fits: <strong>None of these</strong>" : "Model: <strong>" + NAMES[R.leaf] + "</strong>") + "</p>" : "");
      show.forEach(function(id){
        var el = qs.querySelector('[data-q="' + id + '"] .cd-qr'), q = qById(id);
        radios(el, { aria:MV.plain(MV.md(q.t)), options:[{ id:"y", t:"Yes" }, { id:"n", t:"No" }], value:x.ans[id] || "", cls:"seg", k:"cd" + id,
          disabled:function(){ return !!pv.lock; },
          onChange:function(v){ user(); answer(id, v); } });
      });
    });
    var tr = $("#cd-tree", host), r1 = R.path.map(function(e){ return [e[0], e[1]]; }), lit = {};
    if (R.leaf) lit[R.leaf] = 1;
    tr.innerHTML = '<svg class="cd-tsvg" viewBox="0 0 426 238" role="img" aria-label="' + MV.esc("Decision tree. Route so far: " + (routeText(R) || "no answers yet")) + '">' + treeSVG({ r1:r1, lit:lit }) + "</svg>";
  }
  function routeText(R){
    var t = R.path.map(function(e){ return qById(e[0]).s + " " + (e[2] === "y" ? "Yes" : "No"); }).join(" → ");
    if (R.leaf) t += " → " + NAMES[R.leaf];
    return t;
  }
  function answer(id, v){
    var x = cst(), R = routeOf(x.ans), keep = {};
    R.path.some(function(e){ if (e[0] === id) return true; keep[e[0]] = x.ans[e[0]]; return false; });
    keep[id] = v; x.ans = keep; save(); paintRoute(); MV.changed();
  }
  function paintPars(){
    var x = cst(), R = routeOf(x.ans), box = $("#cd-pars", host);
    if (!R.leaf || R.leaf === "none") { box.innerHTML = ""; return; }
    var m = R.leaf, raw = x.par[m] = obj(x.par[m]);
    MV.keepFocus(box, function(){
      box.innerHTML = '<p class="cd-ph">Enter the parameters for the <strong>' + NAMES[m].toLowerCase() + "</strong> model:</p>" + parFields(m, raw, "r");
      wireChips(box, m, raw, "r");
    });
  }
  function parFields(m, raw, pre){
    return '<div class="cd-pf">' + fieldsOf(m).map(function(f){
      if (f.chip) return '<div class="cd-pchip" data-chip="' + pre + '"></div>';
      return '<label class="cd-pl"><span>' + MV.md(f.lab) + '</span><input class="numin cd-in" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" data-par="' + f.id + '" data-pre="' + pre + '" data-k="cd' + pre + m + f.id + '" value="' + MV.esc(raw[f.id] || "") + '"></label>';
    }).join("") + "</div>";
  }
  function wireChips(box, m, raw, pre){
    var el = box.querySelector('[data-chip="' + pre + '"]'); if (!el) return;
    radios(el, { label:M("p") + " =", aria:"Probability of success p", options:PCH.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:raw.p || "", cls:"chips", k:"cd" + pre + m + "p",
      onChange:function(v){ user(); raw.p = v; save(); afterPar(); } });
  }
  function afterPar(){ if (S.view === "route") paintRouteOut(); else paintCmpOut(); MV.changed(); }
  function paintRoute(){
    var c = card();
    $("#cd-cn", host).textContent = "Card " + S.card + " of " + CARDS.length;
    $("#cd-card", host).innerHTML = '<span class="cd-ctag">S' + S.card + "</span> " + c.t;
    $("#cd-prev", host).disabled = S.card <= 1 || !!pv.lock; $("#cd-next", host).disabled = S.card >= CARDS.length || !!pv.lock;
    paintQs(); paintPars(); paintRouteOut();
  }
  function paintRouteOut(){
    var c = card(), cs = curSpec(), R = cs.R, rows = [], note = "", empty = "";
    if (R.leaf && R.leaf !== c.fit) note = "Check: re-read the card. " + MV.md(FITCLUE[c.fit]);
    else if (cs.spec && c.fit !== "none") {
      var bad = Object.keys(c.par).filter(function(k){ return String(c.par[k]) !== String(cs.spec[k]); })[0];
      if (bad) note = "Check: the card says " + (c.say || {})[bad] + ".";
    }
    if (!R.path.length) empty = "Answer the questions to route this card.";
    else if (!R.leaf) empty = "Keep answering: the route isn’t finished.";
    else if (R.leaf === "none" && c.fit !== "none") empty = "None of these: no named model, so there’s no formula to fill in.";
    else if (!cs.spec) empty = cs.err ? cs.err : "Enter the parameters.";
    if (R.path.length) rows.push(["Route", routeText(R).replace(/→ ([A-Z][a-z]+( of these)?)$/, "→ <strong>$1</strong>")]);
    if (cs.spec) {
      var d = dist(cs.spec);
      rows.push(["Parameters", parHTML(cs.spec) + (note ? '<span class="cd-chk">' + note + "</span>" : "")]);
      rows.push(["Formula", formulaHTML(cs.spec)]);
      rows.push(["Centre and spread", pv.hide ? '<span class="muted">Shown after your prediction</span>' : M("E(X) = " + eTxt(d.Ef)) + (cs.spec.m === "geo" ? "" : ", " + M(sdTxt(d.Vf)))]);
    } else if (note) rows.push(["Check", '<span class="cd-chk">' + note + "</span>"]);
    $("#cd-read", host).innerHTML = MV.readoutHTML(rows);
    $("#cd-empty", host).innerHTML = cs.spec ? "" : empty;
    $("#cd-chart", host).hidden = !cs.spec;
    paintChart();
  }

  // --- Compare ---
  function pickRaw(k){ var x = S[k]; x.par[x.m] = obj(x.par[x.m]); return x.par[x.m]; }
  function pickSpec(k){ var sp = specOf(S[k].m, pickRaw(k)); return sp; }
  function paintPick(k){
    var el = $(k === "A" ? "#cd-pa" : "#cd-pb", host), x = S[k], raw = pickRaw(k), pre = k.toLowerCase();
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="cd-pk"><i class="cd-sw' + (k === "B" ? " two" : "") + '" aria-hidden="true"></i>Distribution ' + (k === "A" ? "1 (solid)" : "2 (teal, outlined)") + '</p><div class="cd-pt"></div>' + parFields(x.m, raw, pre);
      radios(el.querySelector(".cd-pt"), { aria:"Type of distribution " + (k === "A" ? 1 : 2), options:["uni", "bin", "geo", "hyp"].map(function(m){ return { id:m, t:NAMES[m] }; }), value:x.m, cls:"chips", k:"cd" + pre + "t",
        disabled:function(){ return !!pv.lock; },
        onChange:function(v){ user(); x.m = v; pickRaw(k); save(); paintPick(k); paintCmpOut(); MV.changed(); } });
      wireChips(el, x.m, raw, pre);
    });
  }
  function paintCmp(){ paintPick("A"); paintPick("B"); paintCmpOut(); }
  function paintCmpOut(){
    var rows = [], ok = true;
    ["A", "B"].forEach(function(k, i){
      var sp = pickSpec(k), lab = '<i class="cd-sw' + (i ? " two" : "") + '" aria-hidden="true"></i>Distribution ' + (i + 1);
      if (!sp.ok) { ok = false; rows.push([lab, '<span class="cd-chk">' + sp.err + "</span>"]); return; }
      var d = dist(sp.spec);
      rows.push([lab, nameHTML(sp.spec) + ": " + (pv.hide ? '<span class="muted">' + M("E") + " and " + M("σ") + " appear after your prediction</span>" : M("E(X) = " + eTxt(d.Ef)) + ", " + M(sdTxt(d.Vf)))]);
    });
    $("#cd-read", host).innerHTML = MV.readoutHTML(rows);
    $("#cd-empty", host).innerHTML = ok ? "" : "Fix the parameters to draw both distributions.";
    $("#cd-chart", host).hidden = !ok;
    paintChart();
  }

  // --- chart ---
  function paintChart(){
    if (!plot) return;
    var ch = $("#cd-chart", host); if (!ch || ch.hidden) return;
    var list = [], pw2 = $("#cd-pw2", host);
    if (S.view === "route") { var cs = curSpec(); if (!cs.spec) return; list.push({ d:dist(cs.spec), s:cs.spec }); }
    else { var a = pickSpec("A"), b = pickSpec("B"); if (!a.ok || !b.ok) return; list.push({ d:dist(a.spec), s:a.spec }); list.push({ d:dist(b.spec), s:b.spec }); }
    var x0 = 0, x1 = 1, more = false;
    list.forEach(function(L){ x1 = Math.max(x1, L.d.x1); if (L.d.more) more = true; });
    if (pv.x1) x1 = Math.max(x1, pv.x1);
    var sc = scaleOf(maxP(list.map(function(L){ return L.d; })));
    function ser(L, i){ return { rows:L.d.rows, col:i ? "--ev-b" : "--pen", outline:!!i, mean:pv.hide ? null : L.d.E, meanLabel:eLab(L.d) }; }
    function desc(sub){ return sub.map(function(L){ return namePlain(L.s) + ": " + L.d.rows.map(function(r){ return r.x + " → " + dec(r.p, 3); }).join(", ") + (L.d.more ? ", … (the tail goes on)" : "") + "."; }).join(" "); }
    var labels = null;
    if (S.view === "route" && list[0].s.m === "none" && !pv.hide) labels = { 7:"6/36" };
    if (S.view === "route" && list[0].s.m === "uni" && list[0].s.k <= 12 && !pv.hide) { labels = {}; labels[Math.ceil(list[0].s.k / 2)] = "1/" + list[0].s.k; }
    var two = S.view === "compare" && narrow();
    pw2.hidden = !two;
    var base = { x0:x0, x1:x1, ymax:sc.ymax, yStep:sc.step, more:more, grow:pv.grow, upto:pv.upto };
    if (two) {
      distChart(plot, Object.assign({}, base, { series:[ser(list[0], 0)], describe:"Distribution 1 (solid), shared scale. " + desc([list[0]]) }));
      distChart(plot2, Object.assign({}, base, { series:[ser(list[1], 1)], describe:"Distribution 2 (teal, outlined), shared scale. " + desc([list[1]]) }));
    } else {
      distChart(plot, Object.assign({}, base, { labels:labels, series:list.map(ser), describe:(list.length > 1 ? "Two distributions on shared axes: distribution 1 solid, distribution 2 teal outlined. " : "") + desc(list) }));
    }
  }

  // --- scenario builder (TC3) ---
  function bldModel(){
    var b = S.bld, p = b.act === "spin" ? b.p : "1/4", bagOut = b.act === "bag" && b.rep === "without";
    if (b.stop === "four" && b.cnt === "reds") return bagOut ? { s:{ m:"hyp", n:12, a:3, r:4 }, route:[["q1", "n"], ["q2", "y"], ["q4", "y"]] } : { s:{ m:"bin", n:4, p:p }, route:[["q1", "n"], ["q2", "y"], ["q4", "n"]] };
    if (b.stop === "until" && b.cnt === "non") return bagOut ? { s:{ m:"none" }, why:"Each draw changes the bag, so the chance isn’t constant: not geometric.", route:[["q1", "n"], ["q2", "n"], ["q3", "n"]] } : { s:{ m:"geo", p:p }, route:[["q1", "n"], ["q2", "n"], ["q3", "y"]] };
    if (b.stop === "until") return { s:{ m:"none" }, why:"Counting reds until the first red always gives " + M("X = 1") + ": there’s nothing random to model.", route:[["q1", "n"], ["q2", "n"], ["q3", "n"]] };
    return { s:{ m:"none" }, why:"With exactly 4 draws, count the reds in them; ‘non-reds before the first red’ is cut off at 4, so no named model fits.", route:[["q1", "n"], ["q2", "n"], ["q3", "n"]] };
  }
  function paintBld(){
    var b = S.bld, el = $("#cd-bldb", host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="cd-br" id="cd-b1"></div><div class="cd-br" id="cd-b2"></div><div class="cd-br" id="cd-b3"></div><div class="cd-br" id="cd-b4"></div><div class="cd-br" id="cd-b5"></div><div class="cd-bout" id="cd-bout" aria-live="polite"></div>';
      function row(id, lab, opts, key, dis){ radios($(id, el), { label:lab, options:opts, value:b[key], cls:"chips", k:"cdb" + key, disabled:dis, onChange:function(v){ user(); b[key] = v; save(); paintBld(); MV.changed(); } }); }
      row("#cd-b1", "Action", [{ id:"spin", t:"Spin a spinner (red with probability " + M("p") + ")" }, { id:"bag", t:"Draw from a bag of 12 (3 red)" }], "act");
      row("#cd-b2", "Spinner " + M("p"), ["1/6", "1/4", "1/3", "1/2"].map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), "p", function(){ return b.act !== "spin"; });
      row("#cd-b3", "Stop rule", [{ id:"four", t:"Exactly 4 times" }, { id:"until", t:"Until the first red" }], "stop");
      row("#cd-b4", "Replacement (bag only)", [{ id:"with", t:"With" }, { id:"without", t:"Without" }], "rep", function(){ return b.act !== "bag"; });
      row("#cd-b5", "Count", [{ id:"reds", t:"Reds" }, { id:"non", t:"Non-reds before the first red" }], "cnt");
    });
    var md = bldModel(), R = { path:md.route.map(function(e){ var q = e[0]; return [q, NEXT[q][e[1]], e[1]]; }), leaf:md.s.m }, h = "";
    h += "<p><strong>Route:</strong> " + routeText(R).replace(/→ ([A-Z][a-z]+( of these)?)$/, "→ <strong>$1</strong>") + "</p>";
    if (md.s.m === "none") h += "<p>" + md.why + "</p>";
    else { var d = dist(md.s); h += "<p>" + nameHTML(md.s) + ": " + M("E(X) = " + eTxt(d.Ef)) + "</p>"; }
    $("#cd-bout", host).innerHTML = h;
  }

  function render(){
    $("#cd-route", host).hidden = S.view !== "route";
    $("#cd-bld", host).hidden = S.view !== "route";
    $("#cd-cmp", host).hidden = S.view !== "compare";
    if (S.view === "route") paintRoute(); else paintCmp();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg")) return;
    if (b.id === "cd-prev" || b.id === "cd-next") { user(); S.card = clampI(S.card + (b.id === "cd-next" ? 1 : -1), 1, CARDS.length, 1); save(); paintRoute(); MV.changed(); var f = $("#" + b.id, host); if (f && f.disabled) { var o = $(b.id === "cd-next" ? "#cd-prev" : "#cd-next", host); if (o) o.focus(); } }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.par) return;
    if (anim) cancelAnim();
    var pre = t.dataset.pre, raw;
    if (pre === "r") { var R = routeOf(cst().ans); if (!R.leaf) return; raw = cst().par[R.leaf] = obj(cst().par[R.leaf]); }
    else raw = pickRaw(pre === "a" ? "A" : "B");
    raw[t.dataset.par] = t.value; save(); afterPar();
  });
  render(); paintBld();

  // --- predictions ---
  function setPick(k, s){ S[k].m = s.m; S[k].par[s.m] = rawOf(s); }
  function startPred(p){
    user();
    if (p.id === "p1" || p.id === "p4") {
      S.view = "route"; S.card = p.id === "p1" ? 1 : 11; var c = card(); S.cs[c.id] = { ans:{}, par:{} };
      pv = { hide:true, lock:true };
    } else if (p.id === "p2") { S.view = "compare"; setPick("A", { m:"bin", n:4, p:"1/2" }); setPick("B", { m:"hyp", n:8, a:4, r:4 }); pv = { hide:true, lock:true, grow:0 }; }
    else { S.view = "compare"; setPick("A", { m:"geo", p:"1/3" }); setPick("B", { m:"bin", n:6, p:"1/3" }); pv = { hide:true, lock:true, upto:-1, x1:15 }; }
    save(); viewR.set(S.view); render();
  }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1" || p.id === "p4") {
      var c = card(), x = cst(), steps = p.id === "p1" ? [["q1", "y"]] : [["q1", "n"], ["q2", "n"], ["q3", "n"]], i = 0;
      anim.fin = function(){ x.ans = {}; steps.forEach(function(s){ x.ans[s[0]] = s[1]; }); if (p.id === "p1") x.par.uni = { k:"10" }; save(); done(); };
      (function step(){
        later(i ? 650 : 300, function(){
          x.ans[steps[i][0]] = steps[i][1]; i++; save(); paintRoute();
          if (i < steps.length) { step(); return; }
          if (p.id === "p1") { later(600, function(){ x.par.uni = { k:"10" }; save(); pv.grow = 0; paintRoute(); grow(); }); }
          else { pv.grow = 0; paintRoute(); grow(); }
        });
      })();
      void c; return;
    }
    if (p.id === "p2") { pv.grow = 0; grow(); return; }
    pv.upto = -1;
    anim.stops.push(MV.tween({ dur:2200, ease:function(t){ return t; }, step:function(t){ pv.upto = Math.floor(t * 16) - 1 + (t >= 1 ? 1 : 0); paintChart(); }, done:function(){ pv.upto = null; later(500, endAnim); } }));
  }
  function grow(){
    anim.stops.push(MV.tween({ dur:1000, step:function(t){ pv.grow = t; paintChart(); }, done:function(){ pv.grow = null; pv.hide = false; render(); later(500, endAnim); } }));
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (anim) return R("Wait for the animation to finish.");
    if (id === "tc1" || id === "tc2") {
      var a = pickSpec("A"), b = pickSpec("B");
      if (!a.ok || !b.ok) return R("Fix the parameters of both distributions in Compare view first.");
      var L = [a.spec, b.spec];
      if (id === "tc1") {
        var bi = L.filter(function(s){ return s.m === "bin"; })[0], hy = L.filter(function(s){ return s.m === "hyp"; })[0];
        if (!bi || !hy) return R("In Compare view, set one distribution to binomial and the other to hypergeometric.");
        var eb = dist(bi).E, eh = dist(hy).E;
        if (Math.abs(eb - 2) < 1e-12 && Math.abs(eh - 2) < 1e-12) return { ok:true };
        if (hy.n === 10 && hy.a === 5 && hy.r === 5) return R("`E = 2.5`.");
        if (bi.n === 4 && bi.p === "1/4") return R("`E = 1`.");
        return R("Right now the binomial has `E = " + eTxt(dist(bi).Ef) + "` and the hypergeometric has `E = " + eTxt(dist(hy).Ef) + "`. You need both to be 2.");
      }
      var ge = L.filter(function(s){ return s.m === "geo"; })[0];
      if (!ge) return R("In Compare view, set one distribution to geometric.");
      if (ge.p === "1/3") return { ok:true };
      if (ge.p === "1/2") return R("`E = 1`.");
      if (ge.p === "1/4") return R("`E = 3`.");
      return R("Right now the geometric has `E = q ÷ p = " + eTxt(dist(ge).Ef) + "`. The binomial (6, `1/3`) has `E = 2`.");
    }
    if (id === "tc3") {
      var md = bldModel(), bl = S.bld;
      if (md.s.m === "geo") { var e = dist(md.s).Ef; if (e.d === 1 && e.n === 3) return { ok:true }; return R(bl.act === "spin" && bl.p === "1/3" ? "`E = 2`." : "The route is geometric, but `E = " + eTxt(e) + "`. You need `q ÷ p = 3`."); }
      if (bl.act === "bag" && bl.rep === "without" && bl.stop === "until") return R("Each draw changes the bag, so the chance isn’t constant: not geometric.");
      if (bl.stop === "four" && bl.cnt === "reds") return R("Fixed trials: that’s " + (bl.act === "bag" && bl.rep === "without" ? "hypergeometric." : "binomial."));
      return R(md.why || "That doesn’t route to geometric.");
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Mixed problems (four stations) ----------
function part3(host, api){
  var S = api.S, ST = (api.content || {}).stations || {};
  var TABS = [{ id:"s1", t:"One bag, three questions" }, { id:"s2", t:"Who’s the success?" }, { id:"s3", t:"Close enough?" }, { id:"s4", t:"None of the above" }];
  if (!TABS.some(function(s){ return s.id === S.cur; })) S.cur = "s1";
  ["s1", "s2", "s3", "s4"].forEach(function(k){ S[k] = obj(S[k]); });
  S.s4.cells = obj(S.s4.cells); S.s4.cnt = Array.isArray(S.s4.cnt) ? S.s4.cnt : ["", "", "", ""];
  var msg = {};
  var MODELS = [{ id:"bin", t:"Binomial" }, { id:"hyp", t:"Hypergeometric" }, { id:"geo", t:"Geometric" }, { id:"uni", t:"Uniform" }];
  function done(id){
    if (id === "s1") return (ST.s1.parts || []).every(function(p){ return obj(S.s1[p.id]).ok; });
    if (id === "s2") return !!S.s2.ok;
    if (id === "s3") return !!S.s3.pick;
    return !!S.s4.ok;
  }
  host.innerHTML = '<div id="mx-tabs" class="mx-tabs"></div><div id="mx-body" class="mx-body"></div>';
  var tabOpts = TABS.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ TABS.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.t + (done(s.id) ? ' <span class="mx-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  var tabs = radios($("#mx-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function chips(key, list, pick, ok, locked){
    return '<div class="opts mx-opts" role="group">' + list.map(function(m){ var c = "opt"; if (pick === m.id) c += ok ? " right" : " wrong";
      return '<button type="button" class="' + c + '" data-pick="' + m.id + '" data-key="' + key + '" data-k="mx' + key + m.id + '"' + (locked ? " disabled" : "") + "><span>" + m.t + "</span></button>"; }).join("") + "</div>";
  }
  function bars(list){
    var W = 300, H = 150, bw = 60, gap = (W - 3 * bw) / 4, h = "";
    list.forEach(function(b, i){
      var x = gap + i * (bw + gap), bh = b.v == null ? 0 : b.v / 0.6 * (H - 40);
      h += b.v == null ? '<text class="mx-bq" x="' + (x + bw / 2) + '" y="' + (H - 30) + '">?</text>' : '<rect class="mx-bar b' + i + '" x="' + x + '" y="' + (H - 20 - bh).toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '"/><text class="mx-bv" x="' + (x + bw / 2) + '" y="' + (H - 24 - bh).toFixed(1) + '">' + b.v + "</text>";
      h += '<text class="mx-bl" x="' + (x + bw / 2) + '" y="' + (H - 4) + '">' + b.l + "</text>";
    });
    return '<svg class="mx-bsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + MV.esc("Bars for P(X = 2): " + list.map(function(b){ return b.l + " " + (b.v == null ? "not solved yet" : b.v); }).join(", ")) + '"><line class="mx-ax" x1="0" y1="' + (H - 20) + '" x2="' + W + '" y2="' + (H - 20) + '"/>' + h + "</svg>";
  }
  function s1(){
    var D = ST.s1, h = '<p class="mx-task">' + D.t + " Name the model for each question, then see the calculation.</p>";
    D.parts.forEach(function(p, i){
      var x = obj(S.s1[p.id]);
      h += '<div class="mx-card' + (x.ok ? " ok" : "") + '" data-part="' + p.id + '"><p class="mx-ct"><span class="mx-cn">' + "abc".charAt(i) + ")</span> " + p.q + "</p>" + chips("s1" + p.id, MODELS, x.pick, x.pick === p.fit, x.ok);
      if (x.ok) h += MV.fbHTML("good", "<strong>✓ " + NAMES[p.fit] + ".</strong> " + p.calc);
      else if (x.pick) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + ((p.wrong || {})[x.pick] || "Ask the four questions in order.") + " Try again.");
      h += "</div>";
    });
    var B = D.parts.map(function(p, i){ return { v:obj(S.s1[p.id]).ok ? p.v : null, l:["With repl.", "Without repl.", "Until blue"][i] }; });
    h += '<details class="alg" open><summary>Check it with algebra</summary><div class="alg-lines"><span>' + M("P(X = 2)") + " for each question: one bag, three models, three different answers.</span>" + bars(B) +
      "<span>Binomial (3, 0.6): 0.432 · Hypergeometric: 0.5 · Geometric (0.4): 0.144. The wording (with or without replacement, a fixed count or a wait) decides the model.</span></div></details>";
    return h;
  }
  function s2(){
    var D = ST.s2, x = S.s2, h = '<p class="mx-task">' + D.t + "</p><p>What counts as a <strong>success</strong> here?</p>";
    h += chips("s2", [{ id:"save", t:"A save" }, { id:"goal", t:"A goal" }], x.pick, x.pick === "goal", x.ok);
    if (x.ok) {
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + D.right);
      h += '<details class="alg" open><summary>Check it with algebra</summary><div class="alg-lines"><span>Geometric: ' + M("p = P(goal) = 1/4") + ", " + M("q = 3/4") + ".</span><span>" + M("E(X) = q ÷ p = (3/4) ÷ (1/4) = 3") + " saves before the first goal.</span><span>" + D.alt + "</span></div></details>";
    } else if (x.pick) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + D.wrong + " Try again.");
    return h;
  }
  function hyperBig(){ var N = 2000000, a = 800000, p = C(10, 4); for (var i = 0; i < 4; i++) p *= (a - i) / (N - i); for (var j = 0; j < 6; j++) p *= (N - a - j) / (N - 4 - j); return p; }
  function s3(){
    var D = ST.s3, x = S.s3, h = '<p class="mx-task">' + D.t + "</p><p>Which model is <strong>strictly</strong> correct?</p>";
    h += chips("s3", [{ id:"hyp", t:"Hypergeometric" }, { id:"bin", t:"Binomial" }], x.pick, x.pick === "hyp", !!x.pick);
    if (x.pick) {
      h += x.pick === "hyp" ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + D.right) : MV.fbHTML("bad", "<strong>✗ Strictly, no.</strong> " + D.wrong);
      var hb = hyperBig(), bb = C(10, 4) * Math.pow(0.4, 4) * Math.pow(0.6, 6);
      h += '<details class="alg" open><summary>Check it with algebra</summary><div class="alg-lines">' +
        '<table class="mx-tab"><caption class="tiny muted">' + M("P(X = 4)") + ", 10 people polled</caption><thead><tr><th scope=\"col\">Model</th><th scope=\"col\">" + M("P(X = 4)") + "</th></tr></thead><tbody>" +
        "<tr><td>Hypergeometric (2 000 000, 800 000, 10)</td><td>" + hb.toFixed(6) + "</td></tr><tr><td>Binomial (10, 0.4)</td><td>" + bb.toFixed(6) + "</td></tr></tbody></table>" +
        "<span>To 4 decimal places both are <strong>" + hb.toFixed(4) + "</strong>.</span><span>" + D.after + "</span></div></details>";
    }
    return h;
  }
  function s4(){
    var D = ST.s4, x = S.s4, h = '<p class="mx-task">' + D.t + "</p><p>Tap each outcome to write down the larger number (or fill them all). Then count how many outcomes give each value of " + M("X") + ".</p>";
    h += '<div class="mx-grid" role="group" aria-label="The 16 outcomes: first spin down the side, second spin across the top"><span class="mx-gh"></span>' + [1, 2, 3, 4].map(function(c){ return '<span class="mx-gh">' + c + "</span>"; }).join("");
    for (var a = 1; a <= 4; a++) {
      h += '<span class="mx-gh">' + a + "</span>";
      for (var b = 1; b <= 4; b++) { var k = a + "" + b, on = !!x.cells[k]; h += '<button type="button" class="mx-cell' + (on ? " on" : "") + '" data-cell="' + k + '" data-k="mxc' + k + '" aria-label="First spin ' + a + ", second spin " + b + (on ? ": larger number " + Math.max(a, b) : "") + '">' + (on ? Math.max(a, b) : "") + "</button>"; }
    }
    h += '</div><div class="q-actions"><button type="button" class="btn sm" data-act="fill" data-k="mxfill">Fill them all</button></div>';
    h += '<div class="mx-cnt"><p>Number of outcomes (out of 16) for each value:</p><div class="numrow">' + [1, 2, 3, 4].map(function(v, i){ return '<label class="pe-lab"><span>' + M("X = " + v) + '</span><input class="numin mx-in" type="text" inputmode="numeric" autocomplete="off" data-cnt="' + i + '" data-k="mxn' + i + '" value="' + MV.esc(x.cnt[i] || "") + '"' + (x.ok ? " disabled" : "") + "></label>"; }).join("") + "</div>";
    if (!x.ok) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="cnt" data-k="mxchk">Check</button></div>';
    h += "</div>";
    if (x.ok) {
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + M("P(X = 1) = 1/16") + ", " + M("P(X = 2) = 3/16") + ", " + M("P(X = 3) = 5/16") + ", " + M("P(X = 4) = 7/16") + ".");
      h += '<details class="alg" open><summary>Check it with algebra</summary><div class="alg-lines"><span>Not uniform: the probabilities aren’t equal. Not binomial or hypergeometric: ' + M("X") + " isn’t a count of successes. Not geometric: nothing is waited for.</span><span><strong>" + D.lesson + "</strong></span></div></details>";
    } else if (msg.s4) h += MV.fbHTML("bad", msg.s4);
    return h;
  }
  function paint(){
    tabText(); tabs.refresh();
    var body = $("#mx-body", host), id = S.cur, h = id === "s1" ? s1() : id === "s2" ? s2() : id === "s3" ? s3() : s4();
    if (done(id)) h += '<p class="mx-done"><strong>✓ Station ' + (TABS.map(function(s){ return s.id; }).indexOf(id) + 1) + " complete.</strong> " + (TABS.every(function(s){ return done(s.id); }) ? "All four stations done. Try the quick check below." : "Choose another station above.") + "</p>";
    MV.keepFocus(body, function(){ body.innerHTML = '<div class="mx-wrap">' + h + "</div>"; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.pick) {
      var key = b.dataset.key, v = b.dataset.pick;
      if (key.indexOf("s1") === 0) { var pid = key.slice(2), part = ST.s1.parts.filter(function(p){ return p.id === pid; })[0], x = S.s1[pid] = obj(S.s1[pid]); x.pick = v; if (v === part.fit) x.ok = true; else x.tries = (x.tries || 0) + 1; }
      else if (key === "s2") { S.s2.pick = v; if (v === "goal") S.s2.ok = true; else S.s2.tries = (S.s2.tries || 0) + 1; }
      else if (key === "s3") S.s3.pick = v;
      var sel = key.indexOf("s1") === 0 ? '[data-part="' + key.slice(2) + '"]' : null;
      api.save(); paint(); MV.focusFb((sel && host.querySelector(sel)) || $("#mx-body", host)); return;
    }
    if (b.dataset.cell) { S.s4.cells[b.dataset.cell] = 1; api.save(); paint(); return; }
    if (b.dataset.act === "fill") { for (var a = 1; a <= 4; a++) for (var c = 1; c <= 4; c++) S.s4.cells[a + "" + c] = 1; api.save(); paint(); return; }
    if (b.dataset.act === "cnt") {
      var want = [1, 3, 5, 7], got = S.s4.cnt.map(function(t){ return /^\s*\d+\s*$/.test(t || "") ? +t : null; });
      if (got.some(function(g){ return g == null; })) msg.s4 = "Enter a whole number in every box.";
      else if (got.every(function(g, i){ return g === want[i]; })) { S.s4.ok = true; msg.s4 = null; }
      else { var sum = got.reduce(function(s, g){ return s + g; }, 0); msg.s4 = "<strong>✗ Not quite.</strong> " + (sum !== 16 ? "The counts should add to 16. " : "") + "Count the outcomes showing each value: only (1, 1) gives 1. Try again."; S.s4.tries = (S.s4.tries || 0) + 1; }
      api.save(); paint(); MV.focusFb($("#mx-body", host));
    }
  });
  host.addEventListener("input", function(e){ var t = e.target; if (t.dataset && t.dataset.cnt != null) { S.s4.cnt[+t.dataset.cnt] = t.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cnt != null) { var b = host.querySelector('[data-k="mxchk"]'); if (b) b.click(); } });
  paint();
  return {};
}

// @component N4 probEntry — number entry (copied from MDM4U 21; item labels M1, M2, …): whole numbers, fractions, decimals and
// percents; named wrong answers; optional hints; first-try scoring.
function probEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = [String(x.val || "")]; return x; }
  function pv(raw){ var f = F.parse(raw); if (f) return f.n / f.d; var r = MV.parseNum(raw); return r && r.length === 1 ? r[0] : null; }
  function close(v, w, tol){ return v != null && Math.abs(v - w) <= tol * Math.max(1, Math.abs(w)); }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], nums = A.map(function(_, k){ return pv(vals[k]); });
    if (nums.some(function(v){ return v == null; })) return { bad:true };
    if (nums.every(function(v, k){ return close(v, A[k], 5e-5); })) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return close(nums[w.part || 0], w.match, 5e-5); })[0];
    return { ok:false, fb:named ? named.fb : null };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id);
        var h = '<div class="q" data-pe="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">M' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow pe-row"><label class="pe-lab" for="pe-' + it.id + '"><span>Your answer:</span><input class="numin" id="pe-' + it.id + '" data-pin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[0] || "") + '"' + (x.solved ? " disabled" : "") + "></label></div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.pin; if (!id) return; ist(id).val[0] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pin) { var b = host.querySelector('[data-k="' + e.target.dataset.pin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pe]"); if (!box) return;
    var it = a.items.filter(function(x){ return x.id === box.dataset.pe; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = "Enter a whole number, a fraction such as 9/64 or a decimal such as 0.25."; paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb ? r.fb + " " : "") + "Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Same mean, different model ----------
var task = (function(){
  var api = null, plot = null, TP = ["1/6", "1/5", "1/4", "1/3", "2/5", "1/2", "2/3"], GS = [8, 10, 12, 15, 20, 30, 60];
  function read(){
    var s = api ? api.S : {}, N = GS.indexOf(+s.N) >= 0 ? +s.N : 12;
    return { n:clampI(s.n, 1, 10, 3), p:TP.indexOf(s.p) >= 0 ? s.p : "1/3", N:N, A:clampI(s.A, 1, N - 1, 4), R:clampI(s.R, 1, Math.min(N - 1, 10), 3) };
  }
  function specs(d){ return [{ m:"bin", n:d.n, p:d.p }, { m:"hyp", n:d.N, a:d.A, r:d.R }]; }
  function draw(){
    var d = read(), sp = specs(d), D = sp.map(dist), sc = scaleOf(maxP(D)), x1 = Math.max(D[0].x1, D[1].x1, 1);
    distChart(plot, { x0:0, x1:x1, ymax:sc.ymax, yStep:sc.step, series:D.map(function(q, i){ return { rows:q.rows, col:i ? "--ev-b" : "--pen", outline:!!i, mean:q.E, meanLabel:eLab(q) }; }),
      describe:"Binomial (" + d.n + ", " + d.p + ") solid and hypergeometric (" + d.N + ", " + d.A + ", " + d.R + ") teal outlined on shared axes. " + D.map(function(q, i){ return (i ? "Hypergeometric" : "Binomial") + ": E = " + d2(q.E) + ", σ ≈ " + d2(q.sd); }).join("; ") + "." });
  }
  function paint(){
    var d = read(), el = $("#ct-read"); if (!el) return;
    var sp = specs(d), D = sp.map(dist), ratio = D[0].sd > 0 ? D[1].sd / D[0].sd : 0;
    $("#ct-n-out").textContent = String(d.n); $("#ct-n").value = d.n;
    var aS = $("#ct-a"), rS = $("#ct-r");
    aS.max = d.N - 1; aS.value = d.A; $("#ct-a-out").textContent = String(d.A);
    rS.max = Math.min(d.N - 1, 10); rS.value = d.R; $("#ct-r-out").textContent = String(d.R);
    el.innerHTML = MV.readoutHTML([
      ['<i class="cd-sw" aria-hidden="true"></i>Binomial', M("(" + d.n + ", " + d.p + ")") + ": " + M("E = " + eTxt(D[0].Ef)) + ", " + M(sdShort(D[0].Vf))],
      ['<i class="cd-sw two" aria-hidden="true"></i>Hypergeometric', M("(" + d.N + ", " + d.A + ", " + d.R + ")") + ": " + M("E = " + eTxt(D[1].Ef)) + ", " + M(sdShort(D[1].Vf))],
      ["Spread ratio", M("σ") + " (hyper) ÷ " + M("σ") + " (binomial) ≈ " + Math.round(ratio * 100) + "%"]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.n = d.n; a.S.p = d.p; a.S.N = d.N; a.S.A = d.A; a.S.R = d.R;
      inp.innerHTML = '<p class="cd-tk"><i class="cd-sw" aria-hidden="true"></i><strong>Binomial</strong></p>' +
        '<label class="slider"><span class="slider-top"><span>Trials ' + M("n") + '</span><output id="ct-n-out"></output></span><input type="range" id="ct-n" min="1" max="10" step="1" value="' + d.n + '"></label><div id="ct-p"></div>' +
        '<p class="cd-tk"><i class="cd-sw two" aria-hidden="true"></i><strong>Hypergeometric</strong></p><div id="ct-g"></div>' +
        '<label class="slider"><span class="slider-top"><span>Successes in the group ' + M("a") + '</span><output id="ct-a-out"></output></span><input type="range" id="ct-a" min="1" max="' + (d.N - 1) + '" step="1" value="' + d.A + '"></label>' +
        '<label class="slider"><span class="slider-top"><span>Draws ' + M("r") + '</span><output id="ct-r-out"></output></span><input type="range" id="ct-r" min="1" max="' + Math.min(d.N - 1, 10) + '" step="1" value="' + d.R + '"></label>';
      radios($("#ct-p", inp), { label:"Probability of success " + M("p"), aria:"Probability of success p", options:TP.map(function(c){ return { id:c, t:M(c), aria:"p = " + c }; }), value:d.p, cls:"chips",
        onChange:function(v){ a.S.p = v; a.save(); paint(); a.update(); } });
      radios($("#ct-g", inp), { label:"Group size", aria:"Group size", options:GS.map(function(g){ return { id:g, t:String(g) }; }), value:d.N, cls:"chips",
        onChange:function(v){ a.S.N = +v; var q = read(); a.S.A = q.A; a.S.R = q.R; a.save(); paint(); a.update(); } });
      pvw.innerHTML = '<canvas class="plot cd-tplot" id="ct-plot" role="img" aria-label="Your binomial (solid) and hypergeometric (teal, outlined) on shared axes"></canvas><dl class="read cd-tread" id="ct-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#ct-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      $("#ct-n").addEventListener("input", function(e){ a.S.n = clampI(e.target.value, 1, 10, 3); a.save(); paint(); a.update(); });
      $("#ct-a").addEventListener("input", function(e){ a.S.A = +e.target.value; a.save(); paint(); a.update(); });
      $("#ct-r").addEventListener("input", function(e){ a.S.R = +e.target.value; a.save(); paint(); a.update(); });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var q = d.p.split("/"), pa = +q[0], pd = +q[1], pv = pa / pd;
      var Vb = d.n * pv * (1 - pv), f = d.A / d.N, Vh = d.R * f * (1 - f) * (d.N - d.R) / (d.N - 1);
      return [d.n * pa === 2 * pd, d.R === d.n && d.A * pd === d.N * pa, Vh <= 0.81 * Vb + 1e-12, d.N <= 15];
    },
    key:function(d){ return [d.n, d.p, d.N, d.A, d.R].join("|"); },
    label:function(k){ var q = k.split("|"); return "binomial " + M("(" + q[0] + ", " + q[1] + ")") + " with hypergeometric " + M("(" + q[2] + ", " + q[3] + ", " + q[4] + ")"); },
    text:function(k){ var q = k.split("|"); return "binomial (" + q[0] + ", " + q[1] + ") with hypergeometric (" + q[2] + ", " + q[3] + ", " + q[4] + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ calc:probEntry },
  task:task
});
})();
