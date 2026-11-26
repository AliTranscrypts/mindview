// MDM4U 18 Discrete Random Variables: hero (36 dice cells show their sums, then stack into the triangular histogram),
// Variable builder (Explore: experiment + rule, Build / Check / Compare modes, D7 histogram, outcome grid, inequality probe),
// Simulated vs theoretical (Part 3: three stations), Distribution builder practice (N4 probEntry), Design a distribution task.
// Every probability is exact (MV.mdm.frac); every simulation is seeded (MV.mdm.seededRandom), so runs repeat on any device.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;
function M(s){ return MV.m(s); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function clamp01(t){ return Math.max(0, Math.min(1, t)); }
function d4(v){ var s = (Math.round(v * 1e4) / 1e4).toFixed(4).replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace("-", MV.MINUS); }
function isDark(){ var c = css("--sheet"), m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c); if (!m) return false; return (parseInt(m[1], 16) + parseInt(m[2], 16) + parseInt(m[3], 16)) / 3 < 110; }
function Xv(){ return "<i>X</i>"; }
var OPS = { le:{ s:"≤", f:function(x, v){ return x <= v; } }, lt:{ s:"<", f:function(x, v){ return x < v; } }, ge:{ s:"≥", f:function(x, v){ return x >= v; } }, gt:{ s:">", f:function(x, v){ return x > v; } } };
function ease(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

// @component radioGroup (copied from MDM4U 15 / 11) — segmented control or chip row as a real radio group
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh, setOptions}
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

// @component D7 distChart — probability histogram (course plan D7) on the toolkit's Plot engine, with its own axes so the
// y labels never clip: bars of width 1 centred on each value, height = probability, solid --pen; optional blocks (one per
// outcome, thin joints); outlined simulated bars (2 px --ink, --ink-2 in dark mode) over lighter theoretical bars; probe
// selection (--hi-soft band behind the chosen bars, the others faded); falling blocks; labels over bars; a dashed reference
// line; a shaded x-range with edge knobs (for drag handles).
// distChart(plot, { x0, x1, ymax, yStep, yFmt(v), bars:[{x, p, n}], sim:[{x, p}], sel:{x:1}, fall:[{x, y, h}], labels:{x:html-free text},
//   ref:{y, label}, range:{a, b}, xLabel, yLabel, describe })
function distChart(plot, o){
  var c = plot.c, r = c.getBoundingClientRect(), W = Math.max(160, r.width), H = Math.max(120, r.height);
  var L = 46, R = 12, T = 26, B = 30, n = o.x1 - o.x0 + 1, bw = (W - L - R) / n, ys = (H - T - B) / o.ymax;
  var view = { xmin:o.x0 - 0.5 - L / bw, xmax:o.x1 + 0.5 + R / bw, ymin:-B / ys, ymax:o.ymax + T / ys };
  plot.draw({ view:view, grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var X = function(x){ return p.X(x); }, Y = function(y){ return p.Y(y); }, xa = X(o.x0 - 0.5), xb = X(o.x1 + 0.5), y0 = Y(0), yt = Y(o.ymax);
    var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM;
    var sel = o.sel || null, selKeys = sel ? Object.keys(sel).filter(function(k){ return sel[k]; }) : [], hasSel = selKeys.length > 0 && selKeys.length < (o.bars || []).filter(function(b){ return b.p > 0; }).length;
    if (o.range) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(X(o.range.a), yt, X(o.range.b) - X(o.range.a), y0 - yt); }
    if (hasSel) { ctx.fillStyle = css("--hi-soft"); selKeys.forEach(function(k){ var x = +k; if (x < o.x0 || x > o.x1) return; ctx.fillRect(X(x - 0.5), yt, X(x + 0.5) - X(x - 0.5), y0 - yt); }); }
    // grid and y labels
    ctx.lineWidth = 1; ctx.strokeStyle = css("--plot-grid"); ctx.beginPath();
    var step = o.yStep, fmt = o.yFmt || function(v){ return MV.num(v, step < 0.1 ? 2 : step < 1 ? (Math.abs(step * 10 - Math.round(step * 10)) > 1e-9 ? 2 : 1) : 0); };
    for (var v = step; v <= o.ymax + 1e-9; v += step) { var py = Math.round(Y(v)) + 0.5; ctx.moveTo(xa, py); ctx.lineTo(xb, py); }
    ctx.stroke();
    ctx.fillStyle = ink2; ctx.font = "12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (v = 0; v <= o.ymax + 1e-9; v += step) ctx.fillText(fmt(Math.round(v * 1e6) / 1e6), xa - 6, Y(v));
    // bars
    var simOn = !!(o.sim && o.sim.length);
    (o.bars || []).forEach(function(b){
      if (!(b.p > 0) || b.x < o.x0 || b.x > o.x1) return;
      var top = Math.max(yt - 4, Y(Math.min(b.p, o.ymax * 1.03))), x1 = X(b.x - 0.5), x2 = X(b.x + 0.5);
      ctx.globalAlpha = hasSel && !sel[b.x] ? 0.3 : simOn ? 0.5 : 1;
      ctx.fillStyle = pen; ctx.fillRect(x1, top, x2 - x1, y0 - top); ctx.globalAlpha = 1;
      ctx.strokeStyle = sheet; ctx.lineWidth = 1;
      if (b.n > 1 && (y0 - top) / b.n >= 3) { ctx.beginPath(); for (var k = 1; k < b.n; k++) { var yy = Math.round(y0 - (y0 - top) * k / b.n) + 0.5; ctx.moveTo(x1 + 1, yy); ctx.lineTo(x2 - 1, yy); } ctx.stroke(); }
      ctx.strokeRect(x1 + 0.5, top + 0.5, x2 - x1 - 1, y0 - top - 1);
    });
    (o.fall || []).forEach(function(f){
      var x1 = X(f.x - 0.5), x2 = X(f.x + 0.5), t2 = Y(f.y + f.h), b2 = Y(f.y);
      ctx.fillStyle = pen; ctx.fillRect(x1, t2, x2 - x1, b2 - t2); ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.strokeRect(x1 + 0.5, t2 + 0.5, x2 - x1 - 1, b2 - t2 - 1);
    });
    if (simOn) {
      ctx.strokeStyle = isDark() ? ink2 : ink; ctx.lineWidth = 2;
      o.sim.forEach(function(s){ if (!(s.p > 0) || s.x < o.x0 || s.x > o.x1) return; var top = Math.max(yt - 4, Y(Math.min(s.p, o.ymax * 1.03))); ctx.strokeRect(X(s.x - 0.5) + 2, top + 1, X(s.x + 0.5) - X(s.x - 0.5) - 4, y0 - top - 1); });
    }
    if (o.ref) {
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(xa, Y(o.ref.y)); ctx.lineTo(xb, Y(o.ref.y)); ctx.stroke(); ctx.restore();
      if (o.ref.label) { ctx.font = "600 12px " + fUI; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; var tw = ctx.measureText(o.ref.label).width; ctx.fillStyle = sheet; ctx.globalAlpha = 0.85; ctx.fillRect(xb - tw - 6, Y(o.ref.y) - 17, tw + 4, 15); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.fillText(o.ref.label, xb - 4, Y(o.ref.y) - 3); }
    }
    // axes
    ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xa, yt - 6); ctx.lineTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    if (o.range) {
      ctx.strokeStyle = ink; ctx.lineWidth = 2; [o.range.a, o.range.b].forEach(function(e){ ctx.beginPath(); ctx.moveTo(X(e), yt); ctx.lineTo(X(e), y0); ctx.stroke(); ctx.beginPath(); ctx.arc(X(e), y0, 7, 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = sheet; ctx.stroke(); ctx.strokeStyle = ink; });
    }
    // x labels
    ctx.fillStyle = ink; ctx.font = "14px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
    var every = bw >= 18 ? 1 : 2;
    for (var x = o.x0; x <= o.x1; x++) if ((x - o.x0) % every === 0) ctx.fillText(String(x).replace("-", MV.MINUS), X(x), y0 + (o.range ? 10 : 6));
    // labels over bars
    if (o.labels) {
      ctx.font = "600 12px " + fUI; ctx.textBaseline = "bottom"; ctx.fillStyle = ink;
      Object.keys(o.labels).forEach(function(k){ var x = +k, b = (o.bars || []).filter(function(q){ return q.x === x; })[0], h = b ? Math.min(b.p, o.ymax) : 0; ctx.fillText(o.labels[k], X(x), Y(h) - 3); });
    }
    if (o.yLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.yLabel, xa + 6, 4); }
    if (o.xLabel) { ctx.fillStyle = ink2; ctx.font = "italic 13px " + fM; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText(o.xLabel, xa - 6, y0 + (o.range ? 10 : 6)); }
  } });
}
function yScale(m){ return m <= 0.5 + 1e-9 ? { ymax:0.5, yStep:0.1 } : m <= 0.75 + 1e-9 ? { ymax:0.75, yStep:0.25 } : { ymax:1, yStep:0.25 }; }
// G15 description: "bars at 1 to 6 with heights 1/36 to 11/36, rising"
function shapeOf(rows){
  var ps = rows.map(function(r){ return r.p; }), n = ps.length, up = true, dn = true, eq = true, sym = true, i;
  for (i = 1; i < n; i++) { if (ps[i] < ps[i - 1] - 1e-12) up = false; if (ps[i] > ps[i - 1] + 1e-12) dn = false; if (Math.abs(ps[i] - ps[0]) > 1e-12) eq = false; }
  for (i = 0; i < n; i++) if (Math.abs(ps[i] - ps[n - 1 - i]) > 1e-12) sym = false;
  var mx = Math.max.apply(null, ps), at = rows.filter(function(r){ return Math.abs(r.p - mx) < 1e-12; }).map(function(r){ return r.x; });
  if (n < 2) return "";
  if (eq) return "all the same height (uniform)";
  if (up) return "rising";
  if (dn) return "falling";
  return (sym ? "symmetric, " : "") + "highest at " + at.join(" and ");
}
function describeRows(rows, txt, head){
  if (!rows.length) return (head || "Probability histogram") + ": no bars yet.";
  var xs = rows.map(function(r){ return r.x; });
  return (head || "Probability histogram") + ": bars at " + (rows.length > 2 ? xs[0] + " to " + xs[xs.length - 1] : xs.join(" and ")) + " with heights " +
    (rows.length <= 6 ? rows.map(txt).join(", ") : txt(rows[0]) + " up to " + txt(rows.reduce(function(a, b){ return b.p > a.p ? b : a; }))) + ". " + MV.cap(shapeOf(rows) || "one bar") + ".";
}

// @component D6 simulator (copied from MDM4U 01) — repeatable trials and running tallies; adds run(n, cb, instant).
// sim = makeSim({ trial:function(rng) -> outcome key, seed }) ; sim.reset(); sim.run(n, {step(sim), done(sim)}, instant)
//   (animated over ≤ 40 frames; instant with reduced motion); sim.seq, sim.counts {key: n}; sim.stop(); sim.busy().
function makeSim(o){
  var s = { seq:[], counts:{}, seed:o.seed, rng:null, raf:null, running:false };
  function stop(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; s.running = false; }
  function one(){ var k = o.trial(s.rng); s.seq.push(k); s.counts[k] = (s.counts[k] || 0) + 1; }
  s.reset = function(){ stop(); s.seq = []; s.counts = {}; s.rng = MV.mdm.seededRandom(s.seed); };
  s.run = function(n, cb, instant){
    stop(); cb = cb || {};
    if (MV.reduceMotion || instant) { for (var i = 0; i < n; i++) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var left = n, frames = Math.min(40, Math.max(8, Math.ceil(n / 12))), per = Math.ceil(n / frames);
    s.running = true;
    (function tick(){ var m = Math.min(per, left); for (var j = 0; j < m; j++) one(); left -= m; if (cb.step) cb.step(s);
      if (left > 0) s.raf = requestAnimationFrame(tick); else { s.raf = null; s.running = false; if (cb.done) cb.done(s); } })();
  };
  s.to = function(n, cb, instant){ if (n < s.seq.length) { s.reset(); s.run(n, cb, true); } else s.run(n - s.seq.length, cb, instant); };
  s.stop = stop; s.busy = function(){ return s.running; };
  s.reset();
  return s;
}

// @component outcomeTable — grid version (adapted from MDM4U 01): rows of outcome cells as buttons with optional column heads
// and row heads; arrow keys move in 2-D (Home/End along a row), roving tabindex; cell html / aria / class / tint from callbacks.
// g = outcomeGrid(host, { rows() -> [{t (row head html or null), cells:[index…]}], head() -> {corner, cols:[html]} | null,
//   cellHTML(i), cellAria(i), cellCls(i), tint(i) -> 0…1 | null, onTap(i), caption, cls }) ; g.render()
function outcomeGrid(host, o){
  var fk = null;
  host.classList.add("ot-host");
  function render(){
    var rows = o.rows(), all = [], had = host.contains(document.activeElement) ? document.activeElement.dataset.i : null;
    rows.forEach(function(r){ r.cells.forEach(function(i){ all.push(i); }); });
    if (fk == null || all.indexOf(fk) < 0) fk = all[0];
    var hd = o.head ? o.head() : null, rh = rows.some(function(r){ return r.t != null; });
    var h = '<div class="ot-wrap"><table class="ot dr-ot ' + (o.cls ? o.cls() : "") + '">' + (o.caption ? '<caption class="vh">' + o.caption + "</caption>" : "");
    if (hd) h += '<thead><tr><th scope="col" class="ot-corner">' + hd.corner + "</th>" + hd.cols.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") + "</tr></thead>";
    h += "<tbody>";
    rows.forEach(function(r, ri){
      h += "<tr>" + (rh ? (r.t != null ? '<th scope="row">' + r.t + "</th>" : "<td></td>") : "") + r.cells.map(function(i, ci){
        var t = o.tint ? o.tint(i) : null;
        return '<td><button type="button" class="ot-c dr-c ' + (o.cellCls ? o.cellCls(i) : "") + (t != null ? " tint" : "") + '" data-i="' + i + '" data-r="' + ri + '" data-c="' + ci + '" tabindex="' + (i === fk ? 0 : -1) + '"' +
          (t != null ? ' style="--tint:' + Math.round(8 + t * 24) + '%"' : "") + ' aria-label="' + MV.esc(o.cellAria(i)) + '">' + o.cellHTML(i) + "</button></td>";
      }).join("") + "</tr>";
    });
    host.innerHTML = h + "</tbody></table></div>";
    if (had != null) { var b = host.querySelector('[data-i="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("button.dr-c"); if (!b) return; fk = +b.dataset.i; if (o.onTap) o.onTap(+b.dataset.i); });
  host.addEventListener("focusin", function(e){ var b = e.target.closest("button.dr-c"); if (!b) return; fk = +b.dataset.i; Array.prototype.forEach.call(host.querySelectorAll("button.dr-c"), function(x){ x.tabIndex = x === b ? 0 : -1; }); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("button.dr-c"); if (!b) return;
    var rows = o.rows(), r = +b.dataset.r, c = +b.dataset.c;
    if (e.key === "ArrowDown") r = Math.min(rows.length - 1, r + 1); else if (e.key === "ArrowUp") r = Math.max(0, r - 1);
    else if (e.key === "ArrowRight") c = c + 1; else if (e.key === "ArrowLeft") c = c - 1;
    else if (e.key === "Home") c = 0; else if (e.key === "End") c = 99; else return;
    e.preventDefault(); c = Math.max(0, Math.min(rows[r].cells.length - 1, c));
    var nb = host.querySelector('button.dr-c[data-r="' + r + '"][data-c="' + c + '"]'); if (nb) nb.focus();
  });
  return { render:render };
}

// ---------- the experiments, their outcomes and rules ----------
function sub(s){ return s.replace(/([RB])(\d)/g, "$1<sub>$2</sub>"); }
var OUT = { dice:[], coins:[], spin:[], bag:[] };
(function(){
  var a, b;
  for (a = 1; a <= 6; a++) for (b = 1; b <= 6; b++) OUT.dice.push({ a:a, b:b, short:a + "," + b, aria:"first die " + a + ", second die " + b });
  ["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"].forEach(function(s){ OUT.coins.push({ short:s, aria:s.split("").map(function(c){ return c === "H" ? "heads" : "tails"; }).join(", "), h:s.split("H").length - 1 }); });
  [["A", 1], ["B", 2], ["C", 2], ["D", 3]].forEach(function(s){ OUT.spin.push({ short:"sector " + s[0], aria:"sector " + s[0] + ", numbered " + s[1], num:s[1], lab:s[0] }); });
  var mb = ["R1", "R2", "B1", "B2", "B3"];
  mb.forEach(function(p, i){ mb.forEach(function(q, j){ if (i === j) return; OUT.bag.push({ first:i, short:sub(p) + " " + sub(q), aria:"first " + (p[0] === "R" ? "red " : "blue ") + p[1] + ", then " + (q[0] === "R" ? "red " : "blue ") + q[1], red:(p[0] === "R") + (q[0] === "R") }); }); });
})();
var EXPS = {
  dice:{ t:"Two dice", noun:"rolls", what:"Two dice: 36 equally likely ordered pairs (first die down the side, second across the top)." },
  coins:{ t:"Three coins", noun:"tosses", what:"Three coins: 8 equally likely outcomes." },
  spin:{ t:"Spinner (1, 2, 2, 3)", noun:"spins", what:"A spinner with 4 equal sectors numbered 1, 2, 2, 3." },
  bag:{ t:"Bag: 2 red, 3 blue", noun:"draws", what:"Two draws without replacement from 2 red (R) and 3 blue (B) marbles: 20 equally likely ordered draws, one row for each first marble." },
  custom:{ t:"Custom table", noun:"trials" }
};
var EXP_ORDER = ["dice", "coins", "spin", "bag", "custom"];
var RULES = {
  dice:[{ id:"sum", t:"Sum", def:"the sum of the two numbers", f:function(o){ return o.a + o.b; } },
    { id:"max", t:"Larger number (maximum)", def:"the larger of the two numbers", f:function(o){ return Math.max(o.a, o.b); } },
    { id:"diff", t:"Difference (larger − smaller)", def:"the difference (larger − smaller)", f:function(o){ return Math.abs(o.a - o.b); } },
    { id:"six", t:"Number of sixes", def:"the number of sixes", f:function(o){ return (o.a === 6 ? 1 : 0) + (o.b === 6 ? 1 : 0); } }],
  coins:[{ id:"heads", t:"Number of heads", def:"the number of heads", f:function(o){ return o.h; } }],
  spin:[{ id:"num", t:"The number shown", def:"the number shown", f:function(o){ return o.num; } }],
  bag:[{ id:"red", t:"Number of red", def:"the number of red marbles drawn", f:function(o){ return o.red; } }]
};
function ruleOf(exp, rid){ var L = RULES[exp] || []; return L.filter(function(r){ return r.id === rid; })[0] || L[0]; }
function valsOf(exp, rid){ var r = ruleOf(exp, rid), s = {}; OUT[exp].forEach(function(o){ s[r.f(o)] = 1; }); return Object.keys(s).map(Number).sort(function(a, b){ return a - b; }); }
function theoRows(exp, rid){
  var r = ruleOf(exp, rid), N = OUT[exp].length, c = {};
  OUT[exp].forEach(function(o){ var v = r.f(o); c[v] = (c[v] || 0) + 1; });
  return valsOf(exp, rid).map(function(x){ return { x:x, n:c[x], N:N, f:F.of(c[x], N), p:c[x] / N }; });
}
function gridRows(exp){
  if (exp === "dice") return [1, 2, 3, 4, 5, 6].map(function(a){ return { t:String(a), cells:[0, 1, 2, 3, 4, 5].map(function(j){ return (a - 1) * 6 + j; }) }; });
  if (exp === "coins") return [{ t:null, cells:[0, 1, 2, 3] }, { t:null, cells:[4, 5, 6, 7] }];
  if (exp === "spin") return [{ t:null, cells:[0, 1, 2, 3] }];
  return [0, 1, 2, 3, 4].map(function(i){ return { t:null, cells:[0, 1, 2, 3].map(function(j){ return i * 4 + j; }) }; });
}
function seedFor(key){ return key === "dice|sum" ? 2 : "mdm18|" + key; }
function trialFor(exp, rid){
  var r = ruleOf(exp, rid), O = OUT[exp];
  if (exp === "dice") return function(g){ var a = g.int(6), b = g.int(6); return r.f(O[a * 6 + b]); };
  return function(g){ return r.f(O[g.int(O.length)]); };
}

// ---------- the custom table ----------
var KTAB = { xs:[0, 1, 2, 3] };
function customRows(S){
  var t = S.tab, out = [], errs = [];
  if (t.kind === "k") {
    var k = F.of(t.k, 20);
    [F.of(1, 10), F.of(3, 10), k, F.mul(k, F.of(2, 1))].forEach(function(f, i){ out.push({ x:i, f:f, p:f.n / f.d, raw:i === 2 ? "k" : i === 3 ? "2k" : null }); });
    return { rows:out, errs:errs };
  }
  var seen = {};
  t.rows.forEach(function(r, i){
    var xs = String(r.x).trim().replace(/−/g, "-"), x = /^-?\d+$/.test(xs) ? parseInt(xs, 10) : NaN, f = F.parse(r.p);
    if (!isFinite(x) || x < -20 || x > 20) { errs.push("Row " + (i + 1) + ": give a whole-number value of " + Xv() + " from −20 to 20."); return; }
    if (seen[x]) { errs.push("Each value of " + Xv() + " appears once: " + String(x).replace("-", MV.MINUS) + " is listed twice."); return; }
    seen[x] = 1;
    if (!f) { errs.push("Row " + (i + 1) + ": enter the probability as a decimal or a fraction, such as 0.25 or 1/4."); out.push({ x:x, f:null, p:NaN }); return; }
    out.push({ x:x, f:f, p:f.n / f.d, fr:/\//.test(String(r.p)) });
  });
  out.sort(function(a, b){ return a.x - b.x; });
  return { rows:out, errs:errs };
}
function tabStatus(rows){
  var ok = rows.length > 0 && rows.every(function(r){ return r.f; }), sum = F.of(0, 1), range = true;
  rows.forEach(function(r){ if (r.f) { sum = F.add(sum, r.f); if (r.f.n < 0 || r.f.n > r.f.d) range = false; } });
  return { parsed:ok, sum:sum, range:range, valid:ok && range && F.eq(sum, F.of(1, 1)) };
}

// ---------- Explore: Variable builder ----------
var DEF = { exp:"dice", rule:"sum", mode:"build", auto:true, cur:7, dec:false, probe:{ v:12, op:"le" }, simN:0, lastExp:"dice" };
function explore(host, api){
  var S = api.S;
  function sanitize(){
    if (!EXPS[S.exp]) S.exp = DEF.exp;
    if (!EXPS[S.lastExp] || S.lastExp === "custom") S.lastExp = "dice";
    if (["build", "check", "compare"].indexOf(S.mode) < 0) S.mode = DEF.mode;
    if (S.exp === "custom" && S.mode === "build") S.mode = "check";
    if (S.exp !== "custom" && S.mode === "check") S.mode = "build";
    S.rules = S.rules && typeof S.rules === "object" ? S.rules : {};
    if (S.exp !== "custom") { S.rule = ruleOf(S.exp, S.rule || S.rules[S.exp]).id; S.rules[S.exp] = S.rule; }
    S.auto = S.auto == null ? true : !!S.auto; S.dec = !!S.dec;
    S.asg = S.asg && typeof S.asg === "object" ? S.asg : {};
    S.probe = S.probe && typeof S.probe === "object" ? S.probe : { v:DEF.probe.v, op:DEF.probe.op };
    if (!OPS[S.probe.op]) S.probe.op = "le";
    S.simN = [0, 36, 360, 3600].indexOf(+S.simN) >= 0 ? +S.simN : 0;
    S.tab = S.tab && typeof S.tab === "object" ? S.tab : {};
    if (S.tab.kind !== "k") S.tab.kind = "free";
    S.tab.k = clampI(S.tab.k, 0, 20, 0);
    if (!Array.isArray(S.tab.rows) || !S.tab.rows.length || S.tab.rows.length > 6) S.tab.rows = [{ x:"1", p:"0.25" }, { x:"2", p:"0.25" }, { x:"3", p:"0.25" }, { x:"4", p:"0.25" }];
    S.tab.rows = S.tab.rows.map(function(r){ return { x:String(r && r.x != null ? r.x : ""), p:String(r && r.p != null ? r.p : "") }; });
  }
  sanitize();
  var pv = {}, anim = null, msg = "", sims = {}, plot, grid, dropStop = null;

  host.innerHTML =
    '<div class="dr-top"><div id="dr-exp"></div><div id="dr-rule"></div><div id="dr-mode"></div></div>' +
    '<div class="pg dr-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap dr-cap" id="dr-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<canvas class="plot dr-plot" id="dr-plot" role="img" aria-label="Probability histogram"></canvas><div id="dr-tbl2" class="dr-tbl dr-tbl-m"></div>' +
      '<div id="dr-gridbox" class="dr-gridbox"><p class="tiny muted dr-gl" id="dr-gl"></p><div id="dr-grid"></div></div>' +
      '<div id="dr-ed" class="dr-ed" hidden><div id="dr-pre"></div><div id="dr-edb"></div></div>' +
      '<div id="dr-simbox" class="dr-simbox" hidden><div id="dr-trials"></div><p class="tiny muted" id="dr-simtxt"></p></div>' +
      '<p class="dr-aha" id="dr-aha"></p></div>' +
    '<div class="pg-ctrl dr-ctrl"><div id="dr-build" class="dr-panel"></div>' +
      '<div class="dr-panel"><p class="dr-sh">Inequality probe</p><label class="slider"><span class="slider-top"><span>Probe value</span><output id="dr-pv-out"></output></span><input type="range" id="dr-pv" step="1"></label><div id="dr-op"></div></div>' +
      '<button type="button" class="cc-switch dr-sw" role="switch" id="dr-dec" aria-checked="false" data-k="drdec"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>Show decimals</button>' +
      '<p class="tiny dr-msg" id="dr-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="dr-read" aria-live="polite"></dl><div id="dr-tbl" class="dr-tbl dr-tbl-d"></div></div></div>';

  plot = new MV.Plot($("#dr-plot", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = paintChart;

  var expR = radios($("#dr-exp", host), { label:"Experiment", options:EXP_ORDER.map(function(k){ return { id:k, t:EXPS[k].t }; }), value:S.exp, cls:"chips",
    onChange:function(v){ user(); setExp(v); save(); render(); MV.changed(); } });
  var ruleR = radios($("#dr-rule", host), { label:"Rule: " + Xv() + " =", aria:"Rule", options:[], value:S.rule, cls:"chips",
    onChange:function(v){ user(); S.rule = v; S.rules[S.exp] = v; S.cur = valsOf(S.exp, v)[0]; fixProbe(true); save(); render(); MV.changed(); } });
  var modeR = radios($("#dr-mode", host), { label:"Mode", options:[{ id:"build", t:"Build" }, { id:"check", t:"Check" }, { id:"compare", t:"Compare" }], value:S.mode, cls:"seg",
    disabled:function(id){ return id === "build" && S.exp === "custom"; },
    onChange:function(v){ user(); setMode(v); save(); render(); MV.changed(); } });
  var opR = radios($("#dr-op", host), { label:"Inequality", options:Object.keys(OPS).map(function(k){ return { id:k, t:OPS[k].s, aria:{ le:"less than or equal to", lt:"less than", ge:"greater than or equal to", gt:"greater than" }[k] }; }), value:S.probe.op, cls:"chips",
    onChange:function(v){ user(); S.probe.op = v; save(); render(); MV.changed(); } });
  var curR = null, trialsR = null, preR = null;

  function save(){ api.save(); }
  function key(){ return S.exp + "|" + S.rule; }
  function asg(){ var k = key(); return S.asg[k] || (S.asg[k] = {}); }
  function setExp(v){
    if (v === S.exp) return;
    S.exp = v;
    if (v === "custom") { if (S.mode === "build") S.mode = "check"; }
    else { S.lastExp = v; if (S.mode === "check") S.mode = "build"; S.rule = ruleOf(v, S.rules[v]).id; S.rules[v] = S.rule; S.cur = valsOf(v, S.rule)[0]; }
    S.simN = 0; msg = ""; fixProbe(true);
  }
  function setMode(v){
    S.mode = v;
    if (v === "check") S.exp = "custom";
    else if (v === "build" && S.exp === "custom") { S.exp = S.lastExp || "dice"; S.rule = ruleOf(S.exp, S.rules[S.exp]).id; }
    if (v === "compare") S.simN = S.simN || 0;
    msg = ""; fixProbe(false);
  }
  // probe range follows the distribution's values; jump = true puts the probe at the top value (P(X ≤ max) = 1)
  function probeRange(){
    if (S.exp === "custom") { var rs = customRows(S).rows; if (!rs.length) return [0, 0]; return [rs[0].x, rs[rs.length - 1].x]; }
    var vs = valsOf(S.exp, S.rule); return [vs[0], vs[vs.length - 1]];
  }
  function fixProbe(jump){ var r = probeRange(); if (jump) { S.probe.v = r[1]; S.probe.op = "le"; } S.probe.v = clampI(S.probe.v, r[0], r[1], r[1]); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }

  // --- animation bookkeeping: any user action cancels and finishes the running animation ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function cancelAnim(){
    if (dropStop) { dropStop(); dropStop = null; pv.drop = null; }
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv = {};
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } paintBtns(); }

  // --- simulation (Compare mode) ---
  function simKey(){
    if (S.exp !== "custom") return key();
    var c = customRows(S); return "custom|" + c.rows.map(function(r){ return r.x + ":" + (r.f ? r.f.n + "/" + r.f.d : "?"); }).join(",");
  }
  function sim(){
    var k = simKey();
    if (!sims[k]) {
      var trial;
      if (S.exp === "custom") { var rs = customRows(S).rows.slice(); trial = function(g){ return rs[g.pick(rs.map(function(r){ return Math.max(0, r.p || 0); }))].x; }; }
      else trial = trialFor(S.exp, S.rule);
      sims[k] = makeSim({ trial:trial, seed:seedFor(k) });
    }
    return sims[k];
  }
  function simReady(){ var s = sim(); if (!s.busy() && s.seq.length !== S.simN) s.to(S.simN, null, true); return s; }
  function canSim(){ if (S.exp !== "custom") return true; var c = customRows(S); return !c.errs.length && tabStatus(c.rows).valid; }

  // --- the distribution on show ---
  function autoP(i, N){ if (pv.autoT == null) return 1; var s = i / N * 0.72; return clamp01((pv.autoT - s) / 0.28); }
  function cellVal(i){
    var o = OUT[S.exp][i], r = ruleOf(S.exp, S.rule);
    if (S.mode !== "build" || S.auto) return autoP(i, OUT[S.exp].length) > 0 ? r.f(o) : null;
    var a = asg()[i]; return a == null ? null : a;
  }
  function dist(){
    if (S.exp === "custom") {
      var c = customRows(S), st = tabStatus(c.rows);
      return { custom:true, rows:c.rows.filter(function(r){ return r.f; }), errs:c.errs, st:st, N:null, theo:c.rows.filter(function(r){ return r.f; }) };
    }
    var T = theoRows(S.exp, S.rule), N = OUT[S.exp].length;
    if (S.mode === "build" && !S.auto) {
      var a = asg(), cnt = {}, n = 0;
      Object.keys(a).forEach(function(i){ var v = a[i]; cnt[v] = (cnt[v] || 0) + 1; n++; });
      var rows = Object.keys(cnt).map(Number).sort(function(p, q){ return p - q; }).map(function(x){ return { x:x, n:cnt[x], N:N, f:F.of(cnt[x], N), p:cnt[x] / N }; });
      return { rows:rows, N:N, assigned:n, theo:T, manual:true, st:{ parsed:true, range:true, sum:F.of(n, N), valid:n === N } };
    }
    return { rows:T, N:N, theo:T, st:{ parsed:true, range:true, sum:F.of(1, 1), valid:true } };
  }
  // experiments show count/N; a custom table shows each probability the way it was typed (decimal or fraction)
  function pTxt(r, d){ if (S.dec || (d.custom && !r.fr)) return d4(r.p); return d.N ? r.n + "/" + d.N : F.txt(r.f); }
  function probeInfo(d){
    var op = OPS[S.probe.op], v = S.probe.v, rows = d.rows.filter(function(r){ return op.f(r.x, v); }), lab = "P(X " + op.s + " " + String(v).replace("-", MV.MINUS) + ")";
    if (d.custom) {
      var s = F.of(0, 1); rows.forEach(function(r){ s = F.add(s, r.f); });
      var parts = rows.map(function(r){ return pTxt(r, d); }), asDec = S.dec || !rows.some(function(r){ return r.fr; });
      return { lab:lab, rows:rows, f:s, txt:(parts.length > 1 ? parts.join(" + ") + " = " : "") + (asDec ? d4(s.n / s.d) : F.txt(s)) + (!parts.length ? " (no values)" : "") };
    }
    var n = 0; rows.forEach(function(r){ n += r.n; }); var f = F.of(n, d.N);
    return { lab:lab, rows:rows, f:f, n:n, txt:S.dec ? d4(n / d.N) : n + "/" + d.N + (f.d !== d.N || f.n !== n ? " = " + F.txt(f) : "") };
  }

  // --- painting ---
  function render(){
    sanitize();
    expR.set(S.exp); modeR.refresh(); modeR.set(S.mode); opR.set(S.probe.op);
    var custom = S.exp === "custom";
    $("#dr-rule", host).hidden = custom;
    if (!custom) { ruleR.setOptions(RULES[S.exp].map(function(r){ return { id:r.id, t:r.t }; })); ruleR.set(S.rule); }
    $("#dr-gridbox", host).hidden = S.mode !== "build";
    $("#dr-ed", host).hidden = S.mode !== "check";
    $("#dr-simbox", host).hidden = S.mode !== "compare";
    var dk = $("#dr-dec", host); dk.setAttribute("aria-checked", String(S.dec));
    paintBuild(); paintGrid(); paintEd(); paintSimBox(); paintProbe(); paintChart(); paintRead(); paintCap(); paintAha(); paintBtns();
    $("#dr-msg", host).innerHTML = msg;
  }
  function paintBuild(){
    var box = $("#dr-build", host);
    if (S.mode !== "build") { box.hidden = true; return; }
    box.hidden = false;
    if (!box.firstChild) {
      box.innerHTML = '<p class="dr-sh">Build</p><button type="button" class="cc-switch dr-sw" role="switch" id="dr-auto" data-k="drauto" aria-checked="false"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>Auto: the rule assigns every cell</button>' +
        '<div id="dr-cur"></div><button type="button" class="btn ghost sm" id="dr-clear" data-k="drclear">Clear my cells</button>';
      curR = radios($("#dr-cur", box), { label:"Tap cells to give them " + Xv() + " =", aria:"Value to assign", options:[], value:S.cur, cls:"chips", onChange:function(v){ S.cur = +v; msg = ""; save(); paintGridLabel(); $("#dr-msg", host).innerHTML = ""; } });
    }
    $("#dr-auto", box).setAttribute("aria-checked", String(S.auto));
    var vs = valsOf(S.exp, S.rule); if (vs.indexOf(+S.cur) < 0) S.cur = vs[0];
    $("#dr-cur", box).hidden = S.auto; $("#dr-clear", box).hidden = S.auto;
    curR.setOptions(vs.map(function(v){ return { id:v, t:String(v) }; })); curR.set(S.cur);
  }
  function paintGridLabel(){
    var gl = $("#dr-gl", host); if (S.mode !== "build") return;
    gl.innerHTML = EXPS[S.exp].what + " " + (pv.hide || S.auto ? "Auto: the rule gives every cell its value of " + Xv() + "." : "Tap a cell to give it " + M("X = " + S.cur) + "; tap it again to clear it. Arrow keys move between cells.");
  }
  function paintGrid(){
    if (S.mode !== "build") return;
    paintGridLabel();
    var vs = valsOf(S.exp, S.rule), exp = S.exp;
    if (!grid || grid.exp !== exp) {
      $("#dr-grid", host).innerHTML = "";
      var gh = document.createElement("div"); $("#dr-grid", host).appendChild(gh);
      grid = outcomeGrid(gh, {
        rows:function(){ return gridRows(exp); },
        head:exp === "dice" ? function(){ return { corner:'<span class="ot-cn">2nd →</span><span class="ot-rn">1st ↓</span>', cols:["1", "2", "3", "4", "5", "6"] }; } : null,
        cellHTML:function(i){ var v = cellVal(i), o = OUT[exp][i]; return (v != null ? '<b class="dr-cv">' + v + "</b>" : "") + '<span class="dr-cp">' + (exp === "spin" ? o.lab + ": " + o.num : o.short) + "</span>"; },
        cellAria:function(i){ var v = cellVal(i), o = OUT[exp][i]; return o.aria + ": " + (v != null ? "X = " + v : "no value yet"); },
        cellCls:function(i){ return cellVal(i) != null ? "dr-has" : ""; },
        tint:function(i){ var v = cellVal(i), vv = valsOf(S.exp, S.rule); if (v == null) return null; var k = vv.indexOf(v); return vv.length > 1 ? (k < 0 ? 0 : k / (vv.length - 1)) : 0.5; },
        onTap:tap, caption:"Outcomes of the experiment", cls:function(){ return exp; } });
      grid.exp = exp;
    }
    grid.render();
    void vs;
  }
  function tap(i){
    if (pv.hide) return;
    if (S.auto) { msg = "Auto is on: the rule gives every cell its value. Turn Auto off to assign the cells yourself."; $("#dr-msg", host).innerHTML = msg; return; }
    user();
    var a = asg(), v = +S.cur;
    if (a[i] === v) { delete a[i]; msg = ""; }
    else { a[i] = v; msg = ""; drop(v); }
    save(); render(); MV.changed();
  }
  function drop(v){
    if (MV.reduceMotion) return;
    pv.drop = { x:v, t:0 };
    dropStop = MV.tween({ dur:340, ease:function(t){ return t * t; }, step:function(t){ if (pv.drop) { pv.drop.t = t; paintChart(); } }, done:function(){ dropStop = null; pv.drop = null; paintChart(); } });
  }
  function paintEd(){
    if (S.mode !== "check") return;
    if (!preR) preR = radios($("#dr-pre", host), { label:"Table", options:[{ id:"free", t:"Free table" }, { id:"k", t:"0.1, 0.3, " + M("k") + ", " + M("2k") }], value:S.tab.kind, cls:"chips",
      onChange:function(v){ user(); S.tab.kind = v; fixProbe(true); S.simN = 0; save(); render(); MV.changed(); } });
    preR.set(S.tab.kind);
    var b = $("#dr-edb", host), h = "";
    if (S.tab.kind === "k") {
      var k = S.tab.k;
      h = '<div class="tbl-wrap dr-ktab"><table class="vt"><caption class="vh">The table 0.1, 0.3, k, 2k</caption><thead><tr><th scope="col">' + M("x") + '</th><th scope="col">0</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th></tr></thead><tbody><tr><th scope="row">' + M("P(X = x)") + "</th><td>0.1</td><td>0.3</td><td>" + M("k") + " = " + d4(k / 20) + "</td><td>" + M("2k") + " = " + d4(2 * k / 20) + "</td></tr></tbody></table></div>" +
        '<div class="dr-step" role="group" aria-label="Set k"><span class="dr-stl">' + M("k") + '</span><button type="button" class="btn ghost sm" data-kk="-1" data-k="drkm" aria-label="k minus 0.05"' + (k <= 0 ? " disabled" : "") + '>−</button><output class="dr-sv" aria-live="polite">' + d4(k / 20) + '</output><button type="button" class="btn ghost sm" data-kk="1" data-k="drkp" aria-label="k plus 0.05"' + (k >= 20 ? " disabled" : "") + ">+</button><span class=\"tiny muted\">steps of 0.05</span></div>";
    } else {
      h = '<p class="tiny muted dr-edh">Type each value and its probability (a decimal or a fraction such as 1/6). The − and + buttons step by 0.05.</p><div class="dr-rows">' + S.tab.rows.map(function(r, i){
        return '<div class="dr-row"><label><span>' + M("x") + '</span><input type="number" step="1" min="-20" max="20" class="numin dr-xin" data-ex="' + i + '" data-k="drx' + i + '" value="' + MV.esc(r.x) + '" aria-label="Value ' + (i + 1) + '"></label>' +
          '<label><span>' + M("P") + '</span><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" class="numin dr-pin" data-ep="' + i + '" data-k="drp' + i + '" value="' + MV.esc(r.p) + '" aria-label="Probability of value ' + (i + 1) + '"></label>' +
          '<button type="button" class="btn ghost sm" data-es="' + i + '|-1" data-k="drs' + i + 'm" aria-label="Probability ' + (i + 1) + ' minus 0.05">−</button><button type="button" class="btn ghost sm" data-es="' + i + '|1" data-k="drs' + i + 'p" aria-label="Probability ' + (i + 1) + ' plus 0.05">+</button></div>';
      }).join("") + '</div><div class="q-actions"><button type="button" class="btn ghost sm" data-erow="1" data-k="draddr"' + (S.tab.rows.length >= 6 ? " disabled" : "") + '>Add a value</button><button type="button" class="btn ghost sm" data-erow="-1" data-k="drdelr"' + (S.tab.rows.length <= 1 ? " disabled" : "") + ">Remove the last value</button></div>";
    }
    MV.keepFocus(b, function(){ b.innerHTML = h; });
  }
  function paintSimBox(){
    if (S.mode !== "compare") return;
    var nn = EXPS[S.exp].noun;
    if (!trialsR) trialsR = radios($("#dr-trials", host), { label:"Simulate", options:[], value:S.simN, cls:"chips", onChange:function(v){ user(); runTo(+v); } });
    trialsR.setOptions([36, 360, 3600].map(function(n){ return { id:n, t:MV.mdm.fmt(n).replace(/ /g, " ") + " " + nn }; }));
    trialsR.set(S.simN); trialsR.lock(!canSim() || !!(anim && pv.hide));
    var s = simReady();
    $("#dr-simtxt", host).innerHTML = !canSim() ? "Make the table valid first: the simulation draws from your probabilities." :
      (s.seq.length ? MV.mdm.fmt(s.seq.length) + " " + nn + " simulated. " : "No trials yet. ") + "Solid bars: theoretical. Outlined bars: simulated. The trials are seeded, so the same settings give the same results every time.";
  }
  function runTo(n){
    var s = sim(); S.simN = n; save();
    s.to(n, { step:function(){ paintChart(); paintRead(); paintSimTxt(); }, done:function(){ render(); MV.changed(); } });
    paintSimBox();
  }
  function paintSimTxt(){ var s = sim(); $("#dr-simtxt", host).innerHTML = MV.mdm.fmt(s.seq.length) + " " + EXPS[S.exp].noun + " simulated…"; }
  function paintProbe(){
    var r = probeRange(), el = $("#dr-pv", host);
    el.min = r[0]; el.max = r[1]; el.value = S.probe.v; el.disabled = r[0] === r[1];
    $("#dr-pv-out", host).textContent = String(S.probe.v).replace("-", MV.MINUS);
    el.setAttribute("aria-valuetext", "Probe value " + S.probe.v);
  }
  function totDiff(d, s){
    var n = s.seq.length; if (!n) return null;
    var xs = {}; d.theo.forEach(function(r){ xs[r.x] = r.p; }); Object.keys(s.counts).forEach(function(k){ if (xs[k] == null) xs[k] = 0; });
    var t = 0; Object.keys(xs).forEach(function(k){ t += Math.abs((s.counts[k] || 0) / n - xs[k]); }); return t;
  }
  function paintChart(){
    var d = dist(), r = probeRange(), N = d.N, bars = [], fall = [], x0 = r[0], x1 = r[1], mx = 0;
    if (d.custom) { d.rows.forEach(function(q){ bars.push({ x:q.x, p:Math.max(0, q.p), n:0 }); mx = Math.max(mx, q.p); }); }
    else {
      d.theo.forEach(function(q){ mx = Math.max(mx, q.p); });
      if (S.mode === "build" && S.auto && pv.autoT != null) {
        var rule = ruleOf(S.exp, S.rule), land = {}, slot = {};
        OUT[S.exp].forEach(function(o, i){
          var v = rule.f(o), k = slot[v] || 0, t = autoP(i, N); slot[v] = k + 1;
          if (t >= 1) land[v] = (land[v] || 0) + 1;
          else if (t > 0) { var top = yScale(mx).ymax; fall.push({ x:v, y:top + (k / N - top) * ease(t), h:1 / N }); }
        });
        d.theo.forEach(function(q){ bars.push({ x:q.x, p:(land[q.x] || 0) / N, n:land[q.x] || 0 }); });
      } else {
        d.rows.forEach(function(q){
          var n = S.mode === "build" ? q.n : 0;
          if (pv.drop && pv.drop.x === q.x && S.mode === "build" && !S.auto) { n--; var top2 = yScale(Math.max(mx, q.p)).ymax; fall.push({ x:q.x, y:top2 + (n / N - top2) * pv.drop.t, h:1 / N }); }
          bars.push({ x:q.x, p:S.mode === "build" ? n / N : q.p, n:n }); mx = Math.max(mx, q.p);
        });
      }
    }
    var sc = yScale(Math.min(1, mx)), simBars = null, s = null;
    if (S.mode === "compare" && canSim()) {
      s = simReady();
      if (s.seq.length) { simBars = Object.keys(s.counts).map(function(k){ return { x:+k, p:s.counts[k] / s.seq.length }; }); simBars.forEach(function(b){ if (b.p > sc.ymax) sc = yScale(Math.min(1, b.p)); }); }
    }
    var sel = {}, pi = probeInfo(d);
    pi.rows.forEach(function(q){ sel[q.x] = 1; });
    var labels = null, bw = (plot.c.getBoundingClientRect().width - 58) / Math.max(1, x1 - x0 + 1);
    if (!pv.hide && bw >= 44) { labels = {}; d.rows.forEach(function(q){ labels[q.x] = MV.plain(pTxt(q, d)); }); }
    var head = d.custom ? "Probability histogram of your table" : "Probability histogram of X = " + ruleOf(S.exp, S.rule).def;
    var desc = pv.hide ? head + ": hidden until the reveal." : describeRows(d.rows, function(q){ return MV.plain(pTxt(q, d)); }, head);
    if (simBars) desc += " Outlined simulated bars from " + s.seq.length + " trials.";
    if (pi.rows.length && pi.rows.length < d.rows.length) desc += " Probe: " + pi.lab + " shaded.";
    distChart(plot, { x0:x0, x1:x1, ymax:sc.ymax, yStep:sc.yStep, bars:bars, fall:fall, sim:simBars, sel:pv.hide ? null : sel, labels:labels, yLabel:"P(X = x)", xLabel:"x", describe:desc });
  }
  function paintRead(){
    var d = dist(), rows = [], hide = !!pv.hide, Q = '<span class="dr-q">?</span>';
    var def = d.custom ? "the value in your table" : ruleOf(S.exp, S.rule).def;
    rows.push(["Random variable", M("X") + " = " + def]);
    if (d.custom && d.errs.length) rows.push(["Table", '<span class="dr-warn">⚠ ' + d.errs[0] + "</span>"]);
    rows.push(["Values", hide ? Q : d.rows.length ? d.rows.map(function(q){ return String(q.x).replace("-", MV.MINUS); }).join(", ") : '<span class="muted">none yet</span>']);
    rows.push(["Distribution", hide ? Q : d.rows.length ? M(d.rows.map(function(q){ return pTxt(q, d); }).join(", ")) : '<span class="muted">' + (d.manual ? "Tap cells to give them values." : "none") + "</span>"]);
    var st = d.st, cDec = S.dec || !d.rows.some(function(q){ return q.fr; }), sumTxt = d.custom ? (cDec ? d4(st.sum.n / st.sum.d) : F.txt(st.sum)) : (S.dec ? d4(st.sum.n / st.sum.d) : d.assigned != null ? d.assigned + "/" + d.N : "1");
    var sumRow;
    if (hide) sumRow = Q;
    else if (d.custom && !st.parsed) sumRow = '<span class="dr-warn">⚠ Fill in every probability first.</span>';
    else if (!st.range) sumRow = M(sumTxt) + ' <span class="dr-warn">⚠ a probability is below 0 or above 1: not valid</span>';
    else if (st.valid) sumRow = M(sumTxt === "1" ? "1" : sumTxt + " = 1") + " ✓";
    else if (d.manual && !d.assigned) sumRow = '<span class="muted">No cells have a value yet.</span>';
    else sumRow = M(sumTxt) + ' <span class="dr-warn">⚠ ≠ 1: not valid</span>' + (d.manual ? ' <span class="tiny muted">(' + (d.N - d.assigned) + " of " + d.N + " cells have no value yet)</span>" : "");
    rows.push(["Sum of probabilities", sumRow]);
    var mx = -1, at = [];
    d.rows.forEach(function(q){ if (q.p > mx + 1e-12) { mx = q.p; at = [q.x]; } else if (Math.abs(q.p - mx) < 1e-12) at.push(q.x); });
    var atTxt = at.length > 2 ? at.slice(0, -1).join(", ") + " and " + at[at.length - 1] : at.join(" and ");
    rows.push(["Most likely value", hide ? Q : !at.length ? "—" : at.length > 1 && at.length === d.rows.length && st.valid ? "none: all " + at.length + " values are equally likely (uniform)" : atTxt + (at.length > 1 ? " (a tie)" : "")]);
    var pi = probeInfo(d);
    rows.push(["Probe", hide ? M(pi.lab) + " = " + Q : M(pi.lab + " = " + pi.txt)]);
    rows.push(["Total histogram area", hide ? Q : M(d.custom ? sumTxt : d.assigned != null ? (S.dec ? d4(d.assigned / d.N) : (d.assigned === d.N ? "1" : d.assigned + "/" + d.N)) : "1")]);
    if (S.mode === "compare") {
      var s = canSim() ? simReady() : null, td = s ? totDiff(d, s) : null;
      rows.push(["Simulated trials", s && s.seq.length ? MV.mdm.fmt(s.seq.length) : '<span class="muted">none yet</span>']);
      rows.push(["Total difference Σ|simulated − theoretical|", td == null ? '<span class="muted">Simulate first.</span>' : d4(td)]);
    }
    $("#dr-read", host).innerHTML = MV.readoutHTML(rows);
    // the distribution table
    var head = [M("x")].concat(d.N ? ["Outcomes"] : []).concat([M("P(X = x)")]), trs = [];
    var sm = S.mode === "compare" && canSim() ? simReady() : null;
    if (sm && sm.seq.length) head.push("Simulated");
    d.rows.forEach(function(q){
      var r = [String(q.x).replace("-", MV.MINUS)];
      if (d.N) r.push(hide ? "?" : String(q.n));
      r.push(hide ? "?" : M(pTxt(q, d)));
      if (sm && sm.seq.length) r.push(d4((sm.counts[q.x] || 0) / sm.seq.length));
      trs.push(r);
    });
    var th = trs.length ? MV.tableHTML({ head:head, rows:trs, caption:"Distribution table" }) : "";
    $("#dr-tbl", host).innerHTML = th; $("#dr-tbl2", host).innerHTML = th;
  }
  function paintCap(){
    var c = $("#dr-cap", host);
    c.innerHTML = pv.cap != null ? MV.md(pv.cap) : M("X") + " = " + (S.exp === "custom" ? "your table" : ruleOf(S.exp, S.rule).def);
    c.classList.toggle("long", MV.plain(c.innerHTML).length > 26);
  }
  function paintAha(){
    var a = $("#dr-aha", host), d = dist(), t = "";
    if (pv.hide) t = "";
    else if (S.mode === "build" && !d.manual && !d.custom) t = "The values gather different numbers of outcomes: " + d.rows.map(function(q){ return q.n; }).join(", ") + " of the " + d.N + ". Each bar’s area is its probability, and the areas add to 1.";
    else if (S.mode === "check" && d.st.valid) t = "Valid: every probability is between 0 and 1, and the bars’ areas add to 1.";
    else if (S.mode === "compare") { var s = canSim() ? simReady() : null; if (s && s.seq.length) t = "Simulated bars wobble around the theoretical ones; more trials, smaller wobble."; }
    a.innerHTML = t; a.hidden = !t;
  }
  function paintBtns(){ if (trialsR) trialsR.lock(!canSim() || !!(anim && pv.hide)); }

  // --- events ---
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".rg") || b.closest(".dr-ot")) return;
    if (b.id === "dr-auto") { user(); S.auto = !S.auto; msg = ""; save(); if (S.auto) autoBuild(); else { render(); MV.changed(); } return; }
    if (b.id === "dr-clear") { user(); S.asg[key()] = {}; msg = ""; save(); render(); MV.changed(); return; }
    if (b.id === "dr-dec") { S.dec = !S.dec; save(); render(); return; }
    if (b.dataset.kk) { user(); S.tab.k = clampI(S.tab.k + (+b.dataset.kk), 0, 20, 0); S.simN = 0; save(); render(); MV.changed(); return; }
    if (b.dataset.es) {
      user(); var p = b.dataset.es.split("|"), r = S.tab.rows[+p[0]], f = F.parse(r.p), v = f ? f.n / f.d : 0;
      v = Math.max(0, Math.min(1, (Math.round(v * 20) + (+p[1])) / 20)); r.p = d4(v);
      S.simN = 0; save(); render(); MV.changed(); return;
    }
    if (b.dataset.erow) {
      user();
      if (b.dataset.erow === "1" && S.tab.rows.length < 6) { var mxx = 0; S.tab.rows.forEach(function(q){ var v2 = parseInt(q.x, 10); if (isFinite(v2)) mxx = Math.max(mxx, v2); }); S.tab.rows.push({ x:String(mxx + 1), p:"0" }); }
      else if (b.dataset.erow === "-1" && S.tab.rows.length > 1) S.tab.rows.pop();
      fixProbe(false); S.simN = 0; save(); render(); MV.changed(); return;
    }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "dr-pv") { user(); S.probe.v = +t.value; save(); paintProbe(); paintChart(); paintRead(); MV.changed(); return; }
    if (t.dataset.ex != null || t.dataset.ep != null) {
      if (anim) cancelAnim();
      var i = +(t.dataset.ex != null ? t.dataset.ex : t.dataset.ep);
      if (t.dataset.ex != null) S.tab.rows[i].x = t.value; else S.tab.rows[i].p = t.value;
      S.simN = 0; fixProbe(false); save(); paintProbe(); paintChart(); paintRead(); paintAha(); paintSimBox(); MV.changed();
    }
  });

  // --- auto-build: cells reveal their values in reading order and drop into the stacks ---
  function autoBuild(fin){
    newAnim(fin || null);
    pv.autoT = 0; var last = -1, N = OUT[S.exp].length;
    render();
    var dur = Math.max(1100, Math.min(2600, N * 70)) + 400;
    var stop = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){
      pv.autoT = t; var shown = 0; for (var i = 0; i < N; i++) if (autoP(i, N) > 0) shown++;
      if (shown !== last) { last = shown; paintGrid(); }
      paintChart();
    }, done:function(){ pv.autoT = null; if (!pv.keep) pv = {}; render(); MV.changed(); later(200, endAnim); } });
    anim.stops.push(stop);
  }

  render();

  // --- predictions ---
  function startPred(p){
    cancelAnim();
    var s = p.start || {};
    S.exp = s.exp; S.lastExp = s.exp; S.rule = s.rule; S.rules[s.exp] = s.rule; msg = "";
    if (p.id === "p4") { S.mode = "compare"; S.simN = 0; sim().reset(); }
    else { S.mode = "build"; S.auto = true; }
    fixProbe(true);
    pv = { hide:true, autoT:p.id === "p4" ? null : 0 };
    save(); render();
  }
  function runPred(p, done){
    if (p.id !== "p4") {
      pv.keep = true;
      autoBuild(function(){ pv = {}; render(); MV.changed(); done(); });
      return;
    }
    newAnim(done);
    var s = sim(), trail = [];
    function step(n, next){
      S.simN = n; save();
      s.to(n, { step:function(){ paintChart(); paintSimTxt(); }, done:function(){
        var td = totDiff(dist(), s); trail.push(MV.mdm.fmt(n).replace(/ /g, " ") + " rolls: " + d4(td));
        pv.cap = "Total difference: " + trail.join(" · ");
        pv.hide = false; render();
        later(1300, next);
      } });
      anim.stops.push(function(){ s.stop(); });
    }
    later(200, function(){ step(36, function(){ step(360, function(){ step(3600, function(){ pv = { cap:pv.cap }; render(); MV.changed(); later(300, endAnim); }); }); }); });
  }

  // --- challenges ---
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; };
    if (id === "tc1") {
      if (S.exp !== "dice" || S.rule !== "six") return R("Choose <strong>Two dice</strong> and the rule <strong>Number of sixes</strong>.");
      if (S.mode !== "build") return R("Use <strong>Build</strong> mode.");
      if (S.auto) return R("Turn Auto off and build it by tapping the cells yourself.");
      var a = S.asg["dice|six"] || {}, c = [0, 0, 0], n = 0, bad = 0, rule = ruleOf("dice", "six");
      Object.keys(a).forEach(function(i){ var v = a[i]; if (v >= 0 && v <= 2) c[v]++; n++; if (rule.f(OUT.dice[+i]) !== v) bad++; });
      if (!n) return R("Tap cells to give them values first.");
      if (n === 36 && !bad) return { ok:true };
      if (c[0] === 12 && c[1] === 12 && c[2] === 12) return R("The values aren’t equally likely.");
      if (!c[0]) return R("Most rolls have no sixes; include `X = 0`.");
      if (c[1] === 5) return R("One six can be on either die: 5 + 5 cells.");
      if (n < 36) return R("Your table adds to " + n + "/36, not 1: " + (36 - n) + " cells have no value yet. Every outcome needs a value of `X`.");
      if (c[0] === 25 && c[1] === 10 && c[2] === 1) return R("Your counts are right, but " + bad + " cell" + (bad === 1 ? " has" : "s have") + " the wrong value. Count the sixes in each pair again.");
      return R("Your table shows `P(0) = " + c[0] + "/36`, `P(1) = " + c[1] + "/36`, `P(2) = " + c[2] + "/36`. Count the sixes in each cell again.");
    }
    if (id === "tc2") {
      if (S.mode !== "check" || S.exp !== "custom") return R("Switch to <strong>Check</strong> mode.");
      if (S.tab.kind !== "k") return R("Choose the table <strong>0.1, 0.3, `k`, `2k`</strong>.");
      var k = S.tab.k;
      if (k === 12) return R("You used 0.4 + `k` = 1 and forgot the `2k`.");
      if (k !== 4) return R("With `k = " + d4(k / 20) + "` the table adds to 0.4 + `3k` = " + d4(0.4 + 3 * k / 20) + ", not 1.");
      if (S.probe.v === 2 && S.probe.op === "ge") return { ok:true };
      if (S.probe.v === 2 && S.probe.op === "gt") return R("‘≥ 2’ includes 2: that’s 0.2 + 0.4.");
      return R("`k = 0.2` makes the table valid. Now set the probe to show `P(X ≥ 2)`.");
    }
    if (id === "tc3") {
      if (S.mode !== "check" || S.exp !== "custom" || S.tab.kind !== "free") return R("Use <strong>Check</strong> mode with the <strong>Free table</strong>.");
      var cr = customRows(S);
      if (cr.errs.length) return R(cr.errs[0]);
      var xs = cr.rows.map(function(r){ return r.x; }).join(",");
      if (xs !== "1,2,3,4") return R("Use the values 1, 2, 3 and 4, one row each.");
      var q = cr.rows.map(function(r){ return r.p * 20; });
      if (q.some(function(v){ return Math.abs(v - Math.round(v)) > 1e-9; })) return R("Use probabilities in steps of 0.05.");
      q = q.map(Math.round);
      if (q.some(function(v){ return v <= 0; })) return R("None of the probabilities can be 0.");
      var tot = q[0] + q[1] + q[2] + q[3];
      if (tot !== 20) return R("That adds to " + d4(tot / 20) + ".");
      if (q[0] + q[1] !== 8) return R("`P(X <= 2) = p_1 + p_2 = " + d4((q[0] + q[1]) / 20) + "`, not 0.4.");
      if (q[3] !== 2 * q[0]) return R("`P(X = 4)` must be twice `P(X = 1)`: " + d4(q[3] / 20) + " isn’t 2 × " + d4(q[0] / 20) + ".");
      var others = [0, 1, 3].filter(function(i){ return q[i] >= q[2]; });
      if (others.length) { var ties = others.filter(function(i){ return q[i] === q[2]; }); if (ties.length) return R("`X = 3` ties `X = " + (ties[0] + 1) + "`; it must be the single most likely."); return R("`X = 3` must be the single most likely value; `X = " + (others[0] + 1) + "` beats it."); }
      return { ok:true };
    }
    return { ok:false };
  }

  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: 36 cells, their sums, then the stacks of the triangular histogram ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "";
  var st = { grid:0, sums:0, move:0, labels:0, cap:0 };
  var cells = [], slot = {};
  for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) { var s = a + b, k = slot[s] || 0; slot[s] = k + 1; cells.push({ a:a, b:b, s:s, k:k }); }
  plot.render = function(){
    plot.draw({ grid:false, axes:false, ticks:false, describe:aria, after:function(ctx, p){
      var W = p.W, H = p.H, c = Math.min((W - 24) / 11, (H - 86) / 12.2), gx = (W - 6 * c) / 2, gy = 40, hx = (W - 11 * c) / 2, yB = H - 32;
      var pen = css("--pen"), sheet = css("--sheet"), ink = css("--ink"), ink2 = css("--ink-2"), fUI = p.fontUI, fM = p.fontM;
      // number line
      if (st.move > 0) {
        ctx.globalAlpha = Math.min(1, st.move * 2); ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx - 6, yB); ctx.lineTo(hx + 11 * c + 6, yB); ctx.stroke();
        ctx.fillStyle = ink; ctx.font = Math.round(Math.max(11, c * 0.36)) + "px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "top";
        for (var v = 2; v <= 12; v++) ctx.fillText(String(v), hx + (v - 1.5) * c, yB + 6);
        ctx.globalAlpha = 1;
      }
      cells.forEach(function(q){
        var d = (q.s - 2) / 10 * 0.45, t = ease(clamp01((st.move - d) / 0.55));
        var x0 = gx + (q.b - 1) * c, y0 = gy + (q.a - 1) * c, x1 = hx + (q.s - 2) * c, y1 = yB - (q.k + 1) * c;
        var x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
        ctx.globalAlpha = st.grid;
        ctx.fillStyle = pen; ctx.globalAlpha = st.grid * (0.16 + 0.84 * t); ctx.fillRect(x + 1, y + 1, c - 2, c - 2);
        ctx.globalAlpha = st.grid; ctx.strokeStyle = t > 0.5 ? sheet : pen; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1, y + 1, c - 2, c - 2);
        if (st.sums > 0) { ctx.globalAlpha = st.sums; ctx.fillStyle = t > 0.5 ? sheet : ink; ctx.font = "600 " + Math.round(c * 0.42) + "px " + fM; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(q.s), x + c / 2, y + c / 2 + 1); }
        ctx.globalAlpha = 1;
      });
      if (st.labels > 0) {
        ctx.globalAlpha = st.labels; ctx.fillStyle = ink; ctx.font = "700 " + Math.round(Math.max(12, c * 0.38)) + "px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        var lh = ctx.measureText("1/36").width > c - 2 ? 2 : 1;   // narrow canvas: lift the end labels clear of the next stacks
        ctx.fillText("6/36", hx + 5.5 * c, yB - 6 * c - 4); ctx.fillText("1/36", hx + 0.5 * c, yB - lh * c - 4); ctx.fillText("1/36", hx + 10.5 * c, yB - lh * c - 4);
        ctx.globalAlpha = 1;
      }
      if (st.cap > 0) { ctx.globalAlpha = st.cap; ctx.fillStyle = ink; ctx.font = "700 " + Math.round(Math.max(15, c * 0.5)) + "px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("Total area = 1", W / 2, 10); ctx.globalAlpha = 1; }
      else if (st.grid > 0 && st.move < 0.02) { ctx.globalAlpha = st.grid; ctx.fillStyle = ink2; ctx.font = "600 12px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillText("first die ↓   second die →", W / 2, 14); ctx.globalAlpha = 1; }
    } });
  };
  var cap = f.cap;
  function last(){ st = { grid:1, sums:1, move:1, labels:1, cap:1 }; plot.render(); cap.textContent = "Each cell is 1/36 of the area: P(X = 7) = 6/36, P(X = 2) = P(X = 12) = 1/36. Total area = 1."; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Two dice: 36 equally likely outcomes";
  function tw(dur, fn, done){ MV.tween({ dur:dur, step:fn, done:done }); }
  MV.wait(300, function(){
    tw(700, function(t){ st.grid = t; plot.render(); }, function(){
      MV.wait(500, function(){
        cap.textContent = "X = the sum: each outcome gets a number";
        tw(800, function(t){ st.sums = t; plot.render(); }, function(){
          MV.wait(900, function(){
            cap.textContent = "Cells with equal sums stack above the number line";
            tw(2200, function(t){ st.move = t; plot.render(); }, function(){
              MV.wait(400, function(){
                cap.textContent = "P(X = 7) = 6/36; P(X = 2) = P(X = 12) = 1/36";
                tw(500, function(t){ st.labels = t; plot.render(); }, function(){
                  MV.wait(1200, function(){ tw(500, function(t){ st.cap = t; plot.render(); }, function(){ last(); }); });
                });
              });
            });
          });
        });
      });
    });
  });
}

// ---------- Part 3: Simulated vs theoretical (three stations) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {}; S.s1.n = [0, 36, 360, 3600].indexOf(+S.s1.n) >= 0 ? +S.s1.n : 0; S.s1.seen = S.s1.seen && typeof S.s1.seen === "object" ? S.s1.seen : {};
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; S.s2.why = typeof S.s2.why === "string" ? S.s2.why : "";
  S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {}; S.s3.a = [0.5, 1.5, 2.5].indexOf(+S.s3.a) >= 0 ? +S.s3.a : 0.5; S.s3.b = [1.5, 2.5, 3.5].indexOf(+S.s3.b) >= 0 ? +S.s3.b : 1.5; if (S.s3.b <= S.s3.a) S.s3.b = S.s3.a + 1; S.s3.freq = !!S.s3.freq;
  var THEO = []; for (var s0 = 2; s0 <= 12; s0++) THEO.push({ x:s0, n:6 - Math.abs(s0 - 7), p:(6 - Math.abs(s0 - 7)) / 36 });
  var dice = makeSim({ seed:2, trial:function(g){ return g.int(6) + g.int(6) + 2; } });
  dice.to(S.s1.n, null, true);
  var SPIN = [{ x:1, f:F.of(1, 4) }, { x:2, f:F.of(1, 2) }, { x:3, f:F.of(1, 4) }];
  var plots = {}, tabsR = null, s1R = null, s2R = null, s3sw = null, drag = null;
  host.innerHTML = '<div id="cs-tabs" class="cs-tabs"></div><div id="cs-body" class="cs-body"></div>';
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function done(id){ if (id === "s1") return !!S.s1.seen[3600]; if (id === "s2") return S.s2.pick === "B"; return !!S.s3.found && !!S.s3.freqSeen; }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s.id) ? ' <span class="cs-tick" aria-label="done">✓</span>' : ""); }); }
  tabText();
  tabsR = radios($("#cs-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function tdiff(){ var n = dice.seq.length; if (!n) return null; var t = 0; THEO.forEach(function(r){ t += Math.abs((dice.counts[r.x] || 0) / n - r.p); }); return t; }

  // Station 1
  function s1(body, s){
    body.innerHTML = '<p class="cs-text">' + s.text + '</p><div id="cs1-n"></div><canvas class="plot dr-plot" id="cs1-plot" role="img" aria-label="Histogram of the sum of two dice"></canvas>' +
      '<dl class="read cs-read" id="cs1-read" aria-live="polite"></dl><p class="cs-after" id="cs1-after"></p>' +
      '<details class="alg" id="cs1-alg"><summary>Check it with data</summary><div id="cs1-tbl"></div></details>';
    s1R = radios($("#cs1-n", body), { label:"Roll", options:[36, 360, 3600].map(function(n){ return { id:n, t:MV.mdm.fmt(n).replace(/ /g, " ") + " rolls" }; }), value:S.s1.n, cls:"chips",
      onChange:function(v){ v = +v; S.s1.n = v; api.save(); dice.to(v, { step:function(){ s1Paint(); }, done:function(){ S.s1.seen[v] = tdiff(); api.save(); s1Paint(); tabText(); tabsR.refresh(); } }); } });
    plots.s1 = new MV.Plot($("#cs1-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 }); plots.s1.render = s1Chart;
    s1Paint();
  }
  function s1Chart(){
    var n = dice.seq.length, sim = n ? THEO.map(function(r){ return { x:r.x, p:(dice.counts[r.x] || 0) / n }; }) : null, mx = 0.2;
    if (sim) sim.forEach(function(q){ mx = Math.max(mx, q.p); });
    var sc = mx <= 0.25 ? { ymax:0.25, yStep:0.05 } : mx <= 0.3 ? { ymax:0.3, yStep:0.05 } : yScale(mx);
    distChart(plots.s1, { x0:2, x1:12, ymax:sc.ymax, yStep:sc.yStep, bars:THEO.map(function(r){ return { x:r.x, p:r.p }; }), sim:sim, yLabel:"P(X = x)", xLabel:"sum",
      describe:"Theoretical histogram of the sum of two dice: bars at 2 to 12, highest at 7 (6/36), symmetric." + (n ? " Outlined simulated bars from " + n + " rolls; total difference " + d4(tdiff()) + "." : " No simulated rolls yet.") });
  }
  function s1Paint(){
    var body = $("#cs-body", host), n = dice.seq.length, td = tdiff();
    if (!$("#cs1-read", body)) return;
    s1Chart();
    var hist = [36, 360, 3600].filter(function(k){ return S.s1.seen[k] != null; }).map(function(k){ return MV.mdm.fmt(k).replace(/ /g, " ") + " rolls: " + d4(S.s1.seen[k]); });
    $("#cs1-read", body).innerHTML = MV.readoutHTML([["Rolls", n ? MV.mdm.fmt(n) : '<span class="muted">Choose 36 rolls to start.</span>'],
      ["Total difference Σ|simulated − theoretical|", td == null ? '<span class="muted">—</span>' : "<strong>" + d4(td) + "</strong>"],
      ["Your runs", hist.length ? hist.join(" · ") : '<span class="muted">none yet</span>']]);
    $("#cs1-after", body).innerHTML = S.s1.seen[3600] != null ? "<strong>✓ " + st("s1").after + "</strong>" : "";
    $("#cs1-tbl", body).innerHTML = n ? MV.tableHTML({ head:["Sum", "Simulated count", "Simulated", "Theoretical", "|Difference|"], caption:"Simulated and theoretical proportions",
      rows:THEO.map(function(r){ var c = dice.counts[r.x] || 0; return [String(r.x), String(c), d4(c / n), M(r.n + "/36") + " ≈ " + d4(r.p), d4(Math.abs(c / n - r.p))]; }).concat([["Total", String(n), "1", "1", "<strong>" + d4(td) + "</strong>"]]) }) :
      '<p class="muted">Roll first: the table pairs each bar’s simulated proportion with its theoretical value.</p>';
  }
  // Station 2
  function s2(body, s){
    body.innerHTML = '<p class="cs-text">' + s.text + ' <span class="mdm-model">model data</span></p><div class="sym cs-dice"><div><h4>Die A <span class="tiny muted">(600 rolls)</span></h4><canvas class="plot cs-dplot" id="cs2-a" role="img"></canvas></div><div><h4>Die B <span class="tiny muted">(600 rolls)</span></h4><canvas class="plot cs-dplot" id="cs2-b" role="img"></canvas></div></div>' +
      '<p class="tiny muted">Dashed line: the expected 100 rolls of each face for a fair die.</p><div id="cs2-pick"></div><div id="cs2-fb" aria-live="polite"></div>' +
      '<div class="jq"><label for="cs2-why">' + s.explain + '</label><textarea id="cs2-why" placeholder="Die … is likely loaded because …"></textarea><div class="saved" id="cs2-saved" aria-live="polite"></div></div>' +
      '<details class="alg"><summary>Check it with data</summary>' + MV.tableHTML({ head:["Face", "Die A", "Die B", "Expected (fair)"], caption:"Counts for 600 rolls",
        rows:[0, 1, 2, 3, 4, 5].map(function(i){ return [String(i + 1), s.a[i] + " (" + d4(s.a[i] / 600) + ")", s.b[i] + " (" + d4(s.b[i] / 600) + ")", "100 (" + d4(1 / 6) + ")"]; }) }) +
      '<p class="tiny muted">Die B’s 172 sixes are 72 above the expected 100; Die A’s biggest gap is 5.</p></details>';
    $("#cs2-why", body).value = S.s2.why;
    var tmr = null;
    $("#cs2-why", body).addEventListener("input", function(e){ S.s2.why = e.target.value; clearTimeout(tmr); tmr = setTimeout(function(){ api.save(); var sv = $("#cs2-saved"); if (sv) sv.textContent = "Saved"; }, 400); });
    s2R = radios($("#cs2-pick", body), { label:"Which die is likely loaded?", options:[{ id:"A", t:"Die A" }, { id:"B", t:"Die B" }, { id:"both", t:"Both" }, { id:"none", t:"Neither" }], value:S.s2.pick || "", cls:"chips",
      onChange:function(v){ S.s2.pick = v; api.save(); s2Fb(); tabText(); tabsR.refresh(); MV.focusFb($("#cs2-fb", host)); } });
    ["a", "b"].forEach(function(k){
      var p = plots["s2" + k] = new MV.Plot($("#cs2-" + k, body), { xmin:0, xmax:1, ymin:0, ymax:1 }), data = s[k], lab = {};
      data.forEach(function(v, i){ lab[i + 1] = String(v); });
      p.render = function(){ distChart(p, { x0:1, x1:6, ymax:180, yStep:30, yFmt:function(v){ return String(Math.round(v)); }, bars:data.map(function(v, i){ return { x:i + 1, p:v }; }), labels:lab, ref:{ y:100 }, yLabel:"count", xLabel:"face",
        describe:"Die " + k.toUpperCase() + ": counts for faces 1 to 6 are " + data.join(", ") + " out of 600 rolls. The dashed line marks the expected 100 for a fair die." }); };
      p.render();
    });
    s2Fb();
  }
  function s2Fb(){
    var s = st("s2"), v = S.s2.pick, fb = $("#cs2-fb", host); if (!fb) return;
    if (!v) { fb.innerHTML = ""; return; }
    fb.innerHTML = v === "B" ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + s.right) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (v === "A" ? s.wrongA : v === "both" ? s.wrongBoth : s.wrongNone));
  }
  // Station 3
  function s3(body, s){
    body.innerHTML = '<p class="cs-text">' + s.text + '</p><button type="button" class="cc-switch dr-sw" role="switch" id="cs3-freq" data-k="cs3freq" aria-checked="' + S.s3.freq + '"><span class="cc-track" aria-hidden="true"><span class="cc-knob"></span></span>Frequency histogram (40 spins)</button>' +
      '<div class="plot-wrap"><canvas class="plot cs-s3" id="cs3-plot" role="img"></canvas></div><p class="tiny muted">Drag the two dark knobs on the axis, or focus one (Tab) and use the arrow keys.</p>' +
      '<dl class="read cs-read" id="cs3-read" aria-live="polite"></dl><div id="cs3-fb" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary><div id="cs3-tbl"></div></details>';
    var p = plots.s3 = new MV.Plot($("#cs3-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 });
    p.render = s3Chart;
    drag = MV.drag(p, { axis:"x", step:{ x:1, y:1 },
      handles:function(){ return [{ id:"a", x:S.s3.a, y:0, label:"Left edge of the shaded region, at x = " + S.s3.a }, { id:"b", x:S.s3.b, y:0, label:"Right edge of the shaded region, at x = " + S.s3.b }]; },
      snap:function(x, y){ return [Math.max(0.5, Math.min(3.5, Math.round(x - 0.5) + 0.5)), 0]; },
      move:function(id, x){ if (id === "a") S.s3.a = Math.min(x, S.s3.b - 1); else S.s3.b = Math.max(x, S.s3.a + 1); api.save(); s3Paint(); } });
    s3Paint();
  }
  function s3Info(){
    var s = st("s3"), xs = SPIN.filter(function(r){ return r.x > S.s3.a && r.x < S.s3.b; }), lo = xs[0].x, hi = xs[xs.length - 1].x;
    var ev = lo === 1 && hi === 3 ? "P(1 <= X <= 3)" : lo === 1 ? "P(X <= " + hi + ")" : hi === 3 ? "P(X ≥ " + lo + ")" : "P(X = " + lo + ")";
    var area = F.of(0, 1), cnt = 0; xs.forEach(function(r){ area = F.add(area, r.f); cnt += s.counts[r.x - 1]; });
    return { xs:xs, ev:ev, area:area, cnt:cnt, target:lo === 2 && hi === 3 };
  }
  function s3Chart(){
    var s = st("s3"), fq = S.s3.freq, p = plots.s3, lab = {};
    SPIN.forEach(function(r){ lab[r.x] = fq ? String(s.counts[r.x - 1]) : F.txt(r.f); });
    distChart(p, { x0:1, x1:3, ymax:fq ? 25 : 0.6, yStep:fq ? 5 : 0.1, yFmt:fq ? function(v){ return String(Math.round(v)); } : null,
      bars:SPIN.map(function(r){ return { x:r.x, p:fq ? s.counts[r.x - 1] : r.f.n / r.f.d }; }), labels:lab, range:{ a:S.s3.a, b:S.s3.b }, yLabel:fq ? "count" : "P(X = x)", xLabel:"x",
      describe:(fq ? "Frequency histogram of 40 spins: counts 10, 20, 10 for X = 1, 2, 3." : "Probability histogram of the spinner: 1/4, 1/2, 1/4 for X = 1, 2, 3.") + " Shaded region from x = " + S.s3.a + " to " + S.s3.b + "." });
  }
  function s3Paint(){
    var body = $("#cs-body", host); if (!$("#cs3-read", body)) return;
    var s = st("s3"), I = s3Info(), fq = S.s3.freq, parts = I.xs.map(function(r){ return fq ? String(s.counts[r.x - 1]) : F.txt(r.f); });
    $("#cs3-freq", body).setAttribute("aria-checked", String(fq));
    if (I.target && !fq && !S.s3.found) { S.s3.found = true; api.save(); tabText(); tabsR.refresh(); }
    if (fq) { S.s3.freqSeen = true; api.save(); tabText(); tabsR.refresh(); }
    plots.s3.render();
    $("#cs3-read", body).innerHTML = MV.readoutHTML([
      ["Shaded bars", M("X") + " = " + I.xs.map(function(r){ return r.x; }).join(", ")],
      ["Shaded area", M((parts.length > 1 ? parts.join(" + ") + " = " : "") + (fq ? String(I.cnt) : F.txt(I.area))) + (fq ? " (a count, not a probability)" : " = " + M(I.ev))],
      ["Total area", fq ? M("10 + 20 + 10 = 40") : M("1/4 + 1/2 + 1/4 = 1")]]);
    var fb = "";
    if (fq) fb = MV.fbHTML("", "<strong>Frequency histogram.</strong> " + s.freqNote + (I.target ? " Shaded: " + I.cnt + " of 40 spins, so the proportion is " + M(I.cnt + "/40 = " + F.txt(F.of(I.cnt, 40))) + "." : ""));
    else if (I.target) fb = MV.fbHTML("good", "<strong>✓ " + M("P(X ≥ 2) = 1/2 + 1/4 = 3/4") + ":</strong> the shaded area. Now switch on the frequency histogram.");
    else fb = '<p class="tiny">Goal: shade the bars for ' + M("P(X ≥ 2)") + ". Right now the shaded area is " + M(I.ev) + ".</p>";
    $("#cs3-fb", body).innerHTML = fb;
    $("#cs3-tbl", body).innerHTML = MV.tableHTML({ head:[M("x"), M("P(X = x)"), "Area of bar (width 1)", "Count in 40 spins"], caption:"Spinner distribution",
      rows:SPIN.map(function(r){ return [String(r.x), M(F.txt(r.f)), "1 × " + M(F.txt(r.f)) + " = " + M(F.txt(r.f)), String(s.counts[r.x - 1])]; }).concat([["Total", "1", "1", "40"]]) });
  }
  function paint(){
    tabText(); tabsR.refresh();
    var s = st(S.cur), body = $("#cs-body", host);
    MV.keepFocus(body, function(){
      body.innerHTML = '<div class="cs-card"><span class="cs-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + '</span><div id="cs-in"></div></div>';
    });
    var inner = $("#cs-in", body);
    if (s.id === "s1") s1(inner, s); else if (s.id === "s2") s2(inner, s); else s3(inner, s);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.id === "cs3-freq") { S.s3.freq = !S.s3.freq; api.save(); s3Paint(); }
  });
  paint();
  void s3sw; void drag;
  return {};
}

// @component N4 probEntry — number entry for probabilities (adapted from MDM4U 02's N4 countEntry): fractions, decimals and
// percents (MV.mdm.frac.parse), within 5e-5 so 4-place decimals count; two-part items (parts:[label, label], answer:[a, b]) get
// a box per part; named wrong answers by value ({match}) or by part ({part, match}). First-try scoring as the toolkit's N4.
// activity a: {id, title, summary, how, items:[{id, goal, prompt, answer, parts, label, display, why, star, wrong:[…], hints:[3]}]}
function probEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { val:[], tries:0, hint:0, solved:false, first:null }); if (!Array.isArray(x.val)) x.val = [String(x.val || "")]; return x; }
  function pv(raw){ var f = F.parse(raw); return f ? f.n / f.d : null; }
  function close(v, w){ return v != null && Math.abs(v - w) <= 5e-5 * Math.max(1, Math.abs(w)); }
  function judge(it, vals){
    var ans = MV.ans(it), A = Array.isArray(ans) ? ans : [ans], nums = A.map(function(_, k){ return pv(vals[k]); });
    if (nums.some(function(v){ return v == null; })) return { bad:true };
    var oks = nums.map(function(v, k){ return close(v, A[k]); });
    if (oks.every(Boolean)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return close(nums[w.part || 0], w.match); })[0];
    var fb = named ? named.fb : null;
    if (!fb && A.length > 1) { var k1 = oks.indexOf(true), k2 = oks.indexOf(false); if (k1 >= 0) fb = MV.md(it.parts[k1].replace(/\s*=\s*$/, "")) + " is right. Check " + MV.md(it.parts[k2].replace(/\s*=\s*$/, "")) + "."; }
    return { ok:false, fb:fb };
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + a.items.map(function(it, i){
        var x = ist(it.id), parts = it.parts || [it.label || "Your answer:"];
        var h = '<div class="q" data-pe="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">N' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        h += '<div class="numrow pe-row">' + parts.map(function(lab, k){ return '<label class="pe-lab" for="pe-' + it.id + k + '"><span>' + lab + '</span><input class="numin" id="pe-' + it.id + k + '" data-pin="' + it.id + '" data-pk="' + k + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(x.val[k] || "") + '"' + (x.solved ? " disabled" : "") + "></label>"; }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.pin; if (!id) return; ist(id).val[+e.target.dataset.pk] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pin) { var b = host.querySelector('[data-k="' + e.target.dataset.pin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pe]"); if (!box) return;
    var it = a.items.filter(function(x){ return x.id === box.dataset.pe; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x.val);
      if (r.bad) { msgs[it.id] = (it.parts ? "Fill in both boxes. " : "") + "Enter a fraction such as 3/8 or a decimal such as 0.375."; paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]')); return; }
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

// ---------- Performance task: Design a distribution ----------
var task = (function(){
  var api = null, plot = null;
  function t1(v){ return v === 10 ? "1" : v === 0 ? "0" : "0." + v; }
  function read(){ var s = api ? api.S : {}, p = Array.isArray(s.p) && s.p.length === 4 ? s.p.map(function(v){ return clampI(v, 0, 10, 0); }) : [4, 2, 2, 2]; return { p:p }; }
  function draw(){
    var d = read(), p = d.p, mx = Math.max.apply(null, p) / 10, sc = yScale(mx), lab = {};
    p.forEach(function(v, i){ lab[i] = t1(v); });
    distChart(plot, { x0:0, x1:3, ymax:sc.ymax, yStep:sc.yStep, bars:p.map(function(v, i){ return { x:i, p:v / 10 }; }), labels:lab, yLabel:"P(X = x)", xLabel:"x",
      describe:"Your probability histogram: P(X = 0) = " + t1(p[0]) + ", P(X = 1) = " + t1(p[1]) + ", P(X = 2) = " + t1(p[2]) + ", P(X = 3) = " + t1(p[3]) + ". Total area " + sumTxt(p[0] + p[1] + p[2] + p[3]) + "." });
  }
  function sumTxt(n){ return n === 10 ? "1" : n > 10 ? (n / 10).toFixed(1) : n === 0 ? "0" : "0." + n; }
  function paint(){
    var d = read(), p = d.p, el = $("#dt-read"); if (!el) return;
    p.forEach(function(v, i){ $("#dt-v" + i).textContent = t1(v); $('[data-dt="' + i + '|-1"]').disabled = v <= 0; $('[data-dt="' + i + '|1"]').disabled = v >= 10; });
    var tot = p[0] + p[1] + p[2] + p[3], hi = p[2] + p[3];
    el.innerHTML = MV.readoutHTML([["Total area", M(t1(p[0]) + " + " + t1(p[1]) + " + " + t1(p[2]) + " + " + t1(p[3]) + " = " + sumTxt(tot)) + (tot === 10 ? " ✓" : "")],
      [M("P(X ≥ 2)"), M("p_2 + p_3 = " + sumTxt(hi))]]);
    draw();
  }
  return {
    render:function(inp, pvw, a){
      api = a; a.S.p = read().p;
      inp.innerHTML = '<div class="dt-in" role="group" aria-label="Your probabilities">' + [0, 1, 2, 3].map(function(i){
        return '<div class="dr-step"><span class="dr-stl">' + M("p_" + i) + ' <span class="tiny muted">(' + M("X = " + i) + ')</span></span><button type="button" class="btn ghost sm" data-dt="' + i + '|-1" data-k="dt' + i + 'm" aria-label="p' + i + ' minus 0.1">−</button><output class="dr-sv" id="dt-v' + i + '" aria-live="polite"></output><button type="button" class="btn ghost sm" data-dt="' + i + '|1" data-k="dt' + i + 'p" aria-label="p' + i + ' plus 0.1">+</button></div>';
      }).join("") + '<p class="tiny muted">Steps of 0.1, from 0 to 1.</p></div>';
      pvw.innerHTML = '<canvas class="plot dt-plot" id="dt-plot" role="img" aria-label="Your probability histogram"></canvas><dl class="read dt-read" id="dt-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#dt-plot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-dt]"); if (!b || b.disabled) return;
        var q = b.dataset.dt.split("|"), p = read().p; p[+q[0]] = clampI(p[+q[0]] + (+q[1]), 0, 10, 0); a.S.p = p; a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var p = d.p; return [p[0] + p[1] + p[2] + p[3] === 10, p[2] + p[3] === 6, p[1] < p[0] && p[1] < p[2] && p[1] < p[3], p.every(function(v){ return v >= 1; })]; },
    key:function(d){ return d.p.join(","); },
    label:function(k){ return M("(" + k.split(",").map(function(v){ return t1(+v); }).join(", ") + ")"); },
    text:function(k){ return "(" + k.split(",").map(function(v){ return t1(+v); }).join(", ") + ")"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ builder:probEntry },
  task:task
});
})();
