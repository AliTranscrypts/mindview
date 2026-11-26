// MDM4U 32 Measures of Spread: hero (two dot plots with box plots, same mean 50, s ≈ 3 vs s = 14), Spread builder (Explore:
// draggable dot plot 0–80 with D10 box plot, dashed fences and open-circle outliers; modes Box plot / SD steps / Compare /
// Transform; Sample / Population toggle; D9 summary readout), Compare two data sets (Part 3: four stations), and the
// "Steady practice" task (five sliders, live box plot and SD steps table). Quartiles: the course method (median left out
// when n is odd) everywhere. All data sets are model data.
(function(){
"use strict";
var $ = MV.$, css = MV.css;
function M(s){ return MV.m(s); }
function clampI(v, lo, hi, def){ v = Math.round(+v); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : def; }
function mn(s){ return String(s).replace(/-/g, MV.MINUS); }
function d2(v){ var s = (Math.round(v * 100) / 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""); return mn(s === "-0" ? "0" : s); }
function ex2(v){ return Math.abs(v * 100 - Math.round(v * 100)) < 1e-7; }
function eqx(v){ return (ex2(v) ? "= " : "≈ ") + d2(v); }
function apx(v){ return (ex2(v) ? "" : "≈ ") + d2(v); }
var Q = '<span class="sp-q">?</span>';
var XB = '<span class="m"><i>x̄</i></span>';
var DEVH = '<span class="m"><i>x</i> − <i>x̄</i></span>', SQH = '<span class="m">(<i>x</i> − <i>x̄</i>)<sup>2</sup></span>';
var SUMSQ = '<span class="m">Σ(<i>x</i> − <i>x̄</i>)<sup>2</sup></span>';

// ---------- D9 summaries (course quartile method: leave the median out when n is odd) ----------
function sortN(a){ return a.slice().sort(function(p, q){ return p - q; }); }
function median(s){ var n = s.length; return !n ? NaN : n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
function summ(vals){
  var s = sortN(vals), n = s.length, med = median(s), lo, hi;
  if (n < 2) { lo = s; hi = s; } else if (n % 2) { lo = s.slice(0, (n - 1) / 2); hi = s.slice((n + 1) / 2); } else { lo = s.slice(0, n / 2); hi = s.slice(n / 2); }
  var q1 = median(lo), q3 = median(hi), iqr = q3 - q1, f1 = q1 - 1.5 * iqr, f2 = q3 + 1.5 * iqr, sum = 0, ss = 0;
  s.forEach(function(v){ sum += v; });
  var mean = sum / n; s.forEach(function(v){ ss += (v - mean) * (v - mean); });
  var out = s.filter(function(v){ return v < f1 - 1e-9 || v > f2 + 1e-9; }), inn = s.filter(function(v){ return v >= f1 - 1e-9 && v <= f2 + 1e-9; });
  return { s:s, n:n, min:s[0], max:s[n - 1], q1:q1, med:med, q3:q3, iqr:iqr, f1:f1, f2:f2, out:out, wlo:inn[0], whi:inn[inn.length - 1],
    sum:sum, mean:mean, ss:ss, sd:n > 1 ? Math.sqrt(ss / (n - 1)) : 0, sdp:Math.sqrt(ss / n) };
}
function fiveTxt(st){ return [st.min, st.q1, st.med, st.q3, st.max].map(d2).join(", "); }
function listTxt(a){ return a.map(d2).join(", "); }

// @component radioGroup (copied from MDM4U 20 / 18) — segmented control or chip row as a real radio group
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

// @component D10 boxPlotRows — dot plots with box plots (course plan D10) on the toolkit's Plot engine. One or more rows on a
// shared number line: dots (--pen) stack on equal values; the box plot draws the five-number summary (median line --hi with
// --ink edges), whiskers end at the last values inside the fences, outliers are open circles (--pen outline on --sheet), fences
// are dashed --ink-2 lines; mean marker --ink (a triangle labelled x̄). A row may give only `five` (box plot without dots).
// boxRows(plot, { x0, x1, step, describe, meanLine:{x, label}, rows:[{ name, sub, note, noteA, vals, ids, five, box (0…1 draw
//   progress, default 1), fences, mean, drop (0…1 fall-in) }] })
// After drawing, plot.v maps data x to pixels and pixel y to H − y, so MV.drag handles work in (value, H − py) units; each
// row gets row.pos = [{id, x, y}] for its dots with ids.
function boxRows(plot, o){
  plot.draw({ grid:false, axes:false, ticks:false, describe:o.describe, after:function(ctx, p){
    var W = p.W, H = p.H, L = 18, R = 18, n = o.rows.length, k = (W - L - R) / (o.x1 - o.x0);
    p.v = { xmin:o.x0 - L / k, xmax:o.x1 + R / k, ymin:0, ymax:H };
    function sx(x){ return L + (x - o.x0) * k; }
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), sheet = css("--sheet"), hi = css("--hi"), fUI = p.fontUI;
    var r = Math.max(3.2, Math.min(7, k * (o.dotK || 0.46))), rh = H / n;
    o.rows.forEach(function(row, i){
      var y0 = i * rh, ya = y0 + rh - 22, yc = ya - 17, bh = 8, yb = yc - bh - 11, ytop = y0 + 22;
      var st = row.vals ? summ(row.vals) : null, five = row.five || (st ? [st.min, st.q1, st.med, st.q3, st.max] : null);
      var bt = row.box == null ? 1 : row.box;
      row.pos = [];
      ctx.save();
      // name line
      ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "700 13px " + fUI; ctx.fillStyle = ink; ctx.fillText(row.name || "", 4, y0 + 3);
      var nw = ctx.measureText(row.name || "").width;
      if (row.sub) { ctx.font = "12px " + fUI; ctx.fillStyle = ink2; ctx.fillText(row.sub, 14 + nw, y0 + 4); }
      if (row.note) { ctx.globalAlpha = row.noteA == null ? 1 : row.noteA; ctx.font = "700 14px " + fUI; ctx.fillStyle = ink; ctx.textAlign = "right"; ctx.fillText(row.note, W - 6, y0 + 3); ctx.globalAlpha = 1; ctx.textAlign = "left"; }
      // fences
      if (row.fences && st && st.n > 1 && bt > 0.99) {
        ctx.strokeStyle = ink2; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.font = "11px " + fUI; ctx.fillStyle = ink2; ctx.textBaseline = "top";
        [st.f1, st.f2].forEach(function(f, j){
          if (f < o.x0 - 1e-9 || f > o.x1 + 1e-9) return;
          var fx = Math.round(sx(f)) + 0.5; ctx.beginPath(); ctx.moveTo(fx, ytop); ctx.lineTo(fx, yc + bh + 3); ctx.stroke();
          ctx.textAlign = j ? "right" : "left"; ctx.fillText("fence " + d2(f), fx + (j ? -4 : 4), ytop);
        });
        ctx.setLineDash([]);
      }
      // number line
      ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx(o.x0), ya); ctx.lineTo(sx(o.x1), ya); ctx.stroke();
      ctx.fillStyle = ink2; ctx.font = "11px " + fUI; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.lineWidth = 1;
      for (var t = Math.ceil(o.x0 / o.step - 1e-9) * o.step; t <= o.x1 + 1e-9; t += o.step) { var tx = sx(t); ctx.beginPath(); ctx.moveTo(tx, ya); ctx.lineTo(tx, ya + 4); ctx.stroke(); ctx.fillText(d2(t), tx, ya + 6); }
      // dots
      if (row.vals) {
        var seen = {}, dTop = ytop + (row.fences ? 14 : 0), room = yb - dTop, maxLev = 0;
        row.vals.forEach(function(v){ var key = Math.round(v * 100); seen[key] = (seen[key] || 0) + 1; maxLev = Math.max(maxLev, seen[key]); });
        var gap = Math.min(2 * r + 1, maxLev > 1 ? (room - 2 * r) / (maxLev - 1) : 2 * r + 1); seen = {};
        row.vals.forEach(function(v, j){
          var key = Math.round(v * 100), lev = seen[key] || 0; seen[key] = lev + 1;
          var cx = sx(v), cy = yb - r - 1 - lev * gap;
          if (row.drop != null && row.drop < 1) cy -= (1 - row.drop) * (cy - y0 + 10) * (1 + (j % 4) * 0.15);
          var isOut = st && row.fences && bt > 0.99 && (v < st.f1 - 1e-9 || v > st.f2 + 1e-9);
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
          if (isOut) { ctx.fillStyle = sheet; ctx.fill(); ctx.strokeStyle = pen; ctx.lineWidth = 2; ctx.stroke(); }
          else { ctx.fillStyle = pen; ctx.fill(); ctx.strokeStyle = sheet; ctx.lineWidth = 1; ctx.stroke(); }
          if (row.ids) row.pos.push({ id:row.ids[j], x:v, y:H - cy });
        });
        ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx(o.x0), yb + 0.5); ctx.lineTo(sx(o.x1), yb + 0.5); ctx.stroke();
      }
      // mean marker
      if (row.mean && st) {
        var mx = sx(st.mean);
        ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(mx, yb + 1.5); ctx.lineTo(mx - 5.5, yb + 9.5); ctx.lineTo(mx + 5.5, yb + 9.5); ctx.closePath(); ctx.fill();
        ctx.font = "italic 700 12px " + p.fontM; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText("x̄", mx + 7, yb + 6);
      }
      // box plot
      if (five && bt > 0) {
        var md = five[2], g = function(x){ return sx(md + (x - md) * bt); };
        var wl = st ? st.wlo : five[0], wh = st ? st.whi : five[4];
        ctx.strokeStyle = ink; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(g(wl), yc); ctx.lineTo(g(five[1]), yc); ctx.moveTo(g(five[3]), yc); ctx.lineTo(g(wh), yc);
        ctx.moveTo(g(wl), yc - 5); ctx.lineTo(g(wl), yc + 5); ctx.moveTo(g(wh), yc - 5); ctx.lineTo(g(wh), yc + 5); ctx.stroke();
        ctx.fillStyle = css("--hi-soft"); ctx.fillRect(g(five[1]), yc - bh, g(five[3]) - g(five[1]), 2 * bh);
        ctx.lineWidth = 2; ctx.strokeRect(g(five[1]), yc - bh, g(five[3]) - g(five[1]), 2 * bh);
        var mdx = sx(md); ctx.fillStyle = ink; ctx.fillRect(mdx - 3, yc - bh - 2, 6, 2 * bh + 4); ctx.fillStyle = hi; ctx.fillRect(mdx - 1.8, yc - bh - 1, 3.6, 2 * bh + 2);
        if (st && row.fences && bt > 0.99) st.out.forEach(function(v){ ctx.beginPath(); ctx.arc(sx(v), yc, r, 0, Math.PI * 2); ctx.fillStyle = sheet; ctx.fill(); ctx.strokeStyle = pen; ctx.lineWidth = 2; ctx.stroke(); });
      }
      ctx.restore();
    });
    if (o.meanLine) {
      var lx = Math.round(sx(o.meanLine.x)) + 0.5;
      ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(lx, 20); ctx.lineTo(lx, H - 24); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = "700 12px " + fUI; ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(o.meanLine.label, lx + 5, 21); ctx.restore();
    }
  } });
}

// ---------- SD steps table (D9): x, x − x̄, (x − x̄)², filled one column at a time ----------
function stepsHTML(vals, col, pop, cap){
  var st = summ(vals), m = st.mean, rows = st.s.map(function(x){ var d = x - m; return [d2(x), col >= 1 ? d2(d) : Q, col >= 2 ? d2(d * d) : Q]; });
  rows.push(["<strong>Σ = " + d2(st.sum) + "</strong>", col >= 1 ? "<strong>0</strong>" : Q, col >= 2 ? "<strong>" + d2(st.ss) + "</strong>" : Q]);
  var dv = pop ? st.n : st.n - 1, v = st.ss / dv, lines = [];
  lines.push(col >= 1 ? XB + " = " + d2(st.sum) + " ÷ " + st.n + " " + eqx(m) : XB + " = " + Q);
  if (col >= 3) {
    lines.push((pop ? M("σ^2") + " = " + SUMSQ + " ÷ " + M("N") : M("s^2") + " = " + SUMSQ + " ÷ (" + M("n - 1") + ")") + " = " + d2(st.ss) + " ÷ " + dv + " " + eqx(v));
    lines.push((pop ? M("σ") : M("s")) + " = √" + d2(v) + " " + eqx(Math.sqrt(v)));
  } else lines.push((pop ? M("σ") : M("s")) + " = " + Q);
  return MV.tableHTML({ head:[M("x"), DEVH, SQH], rows:rows, caption:cap || "Standard deviation steps" }) + '<div class="sp-lines">' + lines.map(function(l){ return "<p>" + l + "</p>"; }).join("") + "</div>";
}

// ---------- Explore: Spread builder ----------
var PRE = {
  home:{ t:"Homework", v:[12, 15, 18, 20, 24, 26, 28, 30, 34, 38, 70] },
  home40:{ t:"Homework (70 → 40)", v:[12, 15, 18, 20, 24, 26, 28, 30, 34, 38, 40] },
  small:{ t:"Small sample", v:[7, 7, 10, 13, 13] }
};
var BDEF = [18, 22, 24, 25, 26, 27, 28, 29, 31, 33, 36];
var KS = [0.5, 1, 1.5, 2, 2.5, 3];
var MODES = [{ id:"box", t:"Box plot" }, { id:"steps", t:"SD steps" }, { id:"compare", t:"Compare" }, { id:"trans", t:"Transform" }];
function explore(host, api){
  var S = api.S;
  function arr(a, def){
    if (!Array.isArray(a)) return def.slice();
    a = a.map(function(v){ return Math.round(+v); }).filter(function(v){ return isFinite(v) && v >= 0 && v <= 80; }).slice(0, 15);
    return a.length >= 2 ? a : def.slice();
  }
  if (!MODES.some(function(m){ return m.id === S.mode; })) S.mode = "box";
  S.A = arr(S.A, PRE.home.v); S.B = arr(S.B, BDEF); if (!PRE[S.pre]) S.pre = S.pre == null ? "home" : "";
  S.pop = !!S.pop; S.col = clampI(S.col, 0, 3, 0); S.c = clampI(S.c, -10, 10, 0); if (KS.indexOf(+S.k) < 0) S.k = 1; else S.k = +S.k;
  var pv = {}, anim = null, msg = "", plot, drag, presetR = null;

  host.innerHTML = '<div id="sp-mode"></div>' +
    '<div class="pg sp-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap sp-cap" id="sp-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="sp-scroll"><div class="plot-wrap sp-wrap"><canvas class="plot sp-plot" id="sp-plot" role="img" aria-label="Dot plot with a box plot"></canvas></div></div>' +
      '<p class="tiny muted sp-keys">Drag a dot, or Tab to it and use the arrow keys (Shift + arrow moves 5). Delete removes the dot.</p><p class="sp-aha" id="sp-aha"></p></div>' +
    '<div class="pg-ctrl"><div id="sp-ctrl"></div><p class="tiny sp-msg" id="sp-msg" aria-live="polite"></p></div>' +
    '<div class="pg-read"><dl class="read" id="sp-read" aria-live="polite"></dl><p class="tiny muted sp-note">Spreadsheets and calculators often use another quartile method and can give slightly different quartiles. This course always leaves the median out when ' + M("n") + " is odd.</p></div></div>";
  plot = new MV.Plot($("#sp-plot", host), { xmin:0, xmax:80, ymin:0, ymax:1 });
  plot.render = paintChart;
  var modeR = radios($("#sp-mode", host), { label:"Mode", options:MODES, value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; msg = ""; save(); renderAll(); MV.changed(); } });

  function save(){ api.save(); }
  function user(){ cancelAnim(); MV.banner("", ""); }
  function newAnim(fin){ cancelAnim(); anim = { stop:null, timer:null, fin:fin }; return anim; }
  function cancelAnim(){ if (!anim) return; var a = anim; anim = null; if (a.stop) a.stop(); if (a.timer) clearTimeout(a.timer); if (a.fin) a.fin(); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) a.fin(); }
  function curC(){ return pv.c != null ? pv.c : S.c; }
  function tv(){ var c = curC(), k = S.k; return S.A.map(function(v){ return Math.round((k * v + c) * 1000) / 1000; }); }
  function ruleTxt(c, k){ return "new = " + (k === 1 ? "" : d2(k) + " × ") + "value" + (c > 0 ? " + " + d2(c) : c < 0 ? " − " + d2(-c) : ""); }
  function ids(set, a){ return a.map(function(_, i){ return set + i; }); }

  // --- chart ---
  function rows(){
    if (S.mode === "compare") return [{ name:"Set A", vals:S.A, ids:ids("A", S.A), fences:true, mean:true }, { name:"Set B", vals:S.B, ids:ids("B", S.B), fences:true, mean:true }];
    if (S.mode === "trans") return [{ name:"Original", vals:S.A, ids:ids("A", S.A), mean:true }, { name:ruleTxt(curC(), S.k), vals:tv(), fences:true, mean:true }];
    return [{ name:PRE[S.pre] ? PRE[S.pre].t : "Your data", sub:"model data", vals:S.A, ids:ids("A", S.A), fences:true, mean:true }];
  }
  function range(){
    if (S.mode !== "trans") return { x0:0, x1:80, step:10 };
    var t = S.A.map(function(v){ return S.k * v + 10; }), lo = Math.min(0, Math.min.apply(null, S.A.map(function(v){ return S.k * v - 10; }))), hi = Math.max(80, Math.max.apply(null, t));
    var x0 = Math.floor(lo / 10) * 10, x1 = Math.ceil(hi / 10) * 10;
    return { x0:x0, x1:x1, step:x1 - x0 > 130 ? 20 : 10 };
  }
  function describe(R){
    return R.map(function(row){
      var st = summ(row.vals), t = row.name + ": " + row.vals.length + " dots at " + listTxt(st.s) + ". Box plot " + fiveTxt(st) + ".";
      if (row.fences) t += " Fences " + d2(st.f1) + " and " + d2(st.f2) + "; " + (st.out.length ? "outliers " + listTxt(st.out) + " (open circles)." : "no outliers.");
      return t + " Mean " + apx(st.mean) + ".";
    }).join(" ");
  }
  function paintChart(){
    var R = rows(), rg = range();
    boxRows(plot, { x0:rg.x0, x1:rg.x1, step:rg.step, rows:R, describe:describe(R) });
    lastRows = R;
  }
  var lastRows = [];
  plot.c.classList.toggle("sp-two", S.mode === "compare" || S.mode === "trans");
  drag = MV.drag(plot, {
    axis:"x", step:{ x:1, y:1 }, big:5,
    handles:function(){
      var hs = [];
      lastRows.forEach(function(row){ (row.pos || []).forEach(function(q){ var set = q.id[0], i = +q.id.slice(1);
        hs.push({ id:q.id, x:q.x, y:q.y, label:(S.mode === "compare" ? "Set " + set + ", d" : "D") + "ot " + (i + 1) + " at " + d2(q.x) + ". Arrow keys move it; Delete removes it." }); }); });
      return hs;
    },
    snap:function(x){ return [Math.max(0, Math.min(80, Math.round(x))), 0]; },
    move:function(id, x){
      var a = id[0] === "B" ? S.B : S.A, i = +id.slice(1); if (i >= a.length) return;
      if (anim) cancelAnim(); else MV.banner("", "");
      x = Math.max(0, Math.min(80, Math.round(x))); if (a[i] === x) return;
      a[i] = x; if (id[0] === "A" && S.pre) { S.pre = ""; if (presetR) presetR.set(""); }
      msg = ""; save(); paint(); MV.changed();
    },
    key:function(id, e){
      if (e.key !== "Delete" && e.key !== "Backspace") return false;
      removeDot(id); return true;
    }
  });
  function removeDot(id){
    var set = id && id[0] === "B" ? "B" : "A", a = set === "B" ? S.B : S.A, i = id ? +id.slice(1) : a.length - 1;
    if (a.length <= 2) { msg = MV.fbHTML("bad", "Keep at least 2 dots."); paintMsg(); return; }
    user(); a.splice(Math.min(i, a.length - 1), 1); if (set === "A") { S.pre = ""; if (presetR) presetR.set(""); }
    msg = ""; save(); paint(); MV.changed();
    var nid = set + Math.max(0, Math.min(i, a.length - 1)); if (drag.buttons[nid]) drag.focus(nid);
  }
  function addDot(set){
    var a = set === "B" ? S.B : S.A;
    if (a.length >= 15) { msg = MV.fbHTML("bad", "The builder holds at most 15 dots."); paintMsg(); return; }
    user(); a.push(Math.round(summ(a).med)); if (set === "A") { S.pre = ""; if (presetR) presetR.set(""); }
    msg = MV.fbHTML("", "A new dot sits at the median, " + d2(a[a.length - 1]) + ". Drag it where you want it."); save(); paint(); MV.changed();
    var nid = set + (a.length - 1); if (drag.buttons[nid]) drag.focus(nid);
  }

  // --- readouts ---
  function sdTxt(st){
    return S.pop ? M("σ") + " " + eqx(st.sdp) + ' <span class="tiny muted">(population, ÷ ' + M("N") + ")</span>" : M("s") + " " + eqx(st.sd) + ' <span class="tiny muted">(sample, ÷ (' + M("n - 1") + "))</span>";
  }
  function sqList(st){ var m = st.mean, sq = st.s.map(function(v){ return (v - m) * (v - m); }); return (st.n <= 6 ? sq.map(d2).join(" + ") + " " : "") + eqx(st.ss); }
  function noteTxt(st){ return st.n % 2 ? M("n") + " odd: the median (" + d2(st.med) + ") is left out of both halves" : M("n") + " even: each half has " + st.n / 2 + " values"; }
  function readRows(){
    var out = [];
    if (S.mode === "compare") {
      var A = summ(S.A), B = summ(S.B), h = !!pv.hide;
      function both(f){ return "A: " + f(A) + "<br>B: " + f(B); }
      out.push([M("n"), both(function(s){ return String(s.n); })]);
      out.push(["Five-number summary", both(fiveTxt)]);
      out.push(["Range", both(function(s){ return d2(s.max - s.min); })]);
      out.push(["IQR", both(function(s){ return d2(s.iqr); })]);
      out.push(["Mean", both(function(s){ return apx(s.mean); })]);
      out.push(["Squares " + SUMSQ, "A: " + (h && !(pv.sq >= 1) ? Q : sqList(A)) + "<br>B: " + (h && !(pv.sq >= 2) ? Q : sqList(B))]);
      out.push(["Standard deviation", both(function(s){ return h ? Q : sdTxt(s); })]);
      return out;
    }
    if (S.mode === "trans") {
      var O = summ(S.A), T = summ(tv()), k = S.k, c = curC();
      function ch(f){ return d2(f(O)) + " → " + d2(f(T)); }
      out.push(["Rule", ruleTxt(c, k)]);
      out.push(["Mean", apx(O.mean) + " → " + apx(T.mean)]);
      out.push(["Median", ch(function(s){ return s.med; })]);
      out.push(["Range", ch(function(s){ return s.max - s.min; })]);
      out.push(["IQR", ch(function(s){ return s.iqr; })]);
      out.push(["Standard deviation", (S.pop ? M("σ") + " " : M("s") + " ") + apx(S.pop ? O.sdp : O.sd) + " → " + apx(S.pop ? T.sdp : T.sd) + ' <span class="tiny muted">(× ' + d2(k) + "; adding " + M("c") + " changes nothing)</span>"]);
      return out;
    }
    var st = summ(S.A), steps = S.mode === "steps";
    out.push([M("n"), String(st.n)]);
    out.push(["Five-number summary", fiveTxt(st) + ' <span class="tiny muted">(min, ' + M("Q_1") + ", median, " + M("Q_3") + ", max)</span>"]);
    out.push(["Range", d2(st.max) + " − " + d2(st.min) + " = " + d2(st.max - st.min)]);
    out.push(["IQR", d2(st.q3) + " − " + d2(st.q1) + " = " + d2(st.iqr)]);
    out.push(["Fences", d2(st.f1) + " and " + d2(st.f2) + ' <span class="tiny muted">(' + M("Q_1") + " − 1.5 × IQR, " + M("Q_3") + " + 1.5 × IQR)</span>"]);
    out.push(["Outliers", st.out.length ? listTxt(st.out) : "none"]);
    out.push(["Mean", apx(st.mean)]);
    out.push(["Standard deviation", steps && S.col < 3 ? Q + ' <span class="tiny muted">Finish the SD steps table.</span>' : sdTxt(st)]);
    out.push(["Quartile method", noteTxt(st)]);
    return out;
  }
  function paintRead(){ $("#sp-read", host).innerHTML = MV.readoutHTML(readRows()); }
  function paintCap(){
    var cap = $("#sp-cap", host), st = summ(S.A);
    if (S.mode === "box") cap.innerHTML = "IQR = " + d2(st.q3) + " − " + d2(st.q1) + " = " + d2(st.iqr);
    else if (S.mode === "steps") cap.innerHTML = '<span class="m"><i>s</i> = √[Σ(<i>x</i> − <i>x̄</i>)<sup>2</sup> ÷ (<i>n</i> − 1)]</span>';
    else if (S.mode === "compare") cap.innerHTML = "Set A vs set B";
    else cap.innerHTML = mn(ruleTxt(curC(), S.k));
  }
  function paintAha(){
    var t = { box:"Drag the largest value: the range, mean and " + M("s") + " respond, while the median and IQR hardly move.",
      steps:M("s") + " is the square root of an average squared distance from the mean.",
      compare:"Compare a matching pair: median with IQR, or mean with standard deviation.",
      trans:"Adding " + M("c") + " slides every dot; multiplying by " + M("k") + " stretches every distance." }[S.mode];
    $("#sp-aha", host).innerHTML = t;
  }
  function paintMsg(){ $("#sp-msg", host).innerHTML = msg; }
  function paintSteps(){ var el = $("#sp-steps", host); if (!el) return; el.innerHTML = stepsHTML(S.A, S.col, S.pop); var nb = $("#sp-next", host); if (nb) nb.disabled = S.col >= 3; }
  function paintInputs(){
    ["A", "B"].forEach(function(set){ var el = $("#sp-in" + set, host); if (el && document.activeElement !== el) el.value = (set === "B" ? S.B : S.A).join(", "); });
    host.querySelectorAll("[data-add]").forEach(function(b){ b.disabled = (b.dataset.add === "B" ? S.B : S.A).length >= 15; });
    host.querySelectorAll("[data-rem]").forEach(function(b){ b.disabled = (b.dataset.rem === "B" ? S.B : S.A).length <= 2; });
  }
  function paint(){ paintChart(); paintRead(); paintCap(); paintSteps(); paintInputs(); paintMsg(); }

  // --- controls (rebuilt when the mode changes) ---
  function dataRow(set, lab){
    return '<div class="sp-data"><label class="sp-dl" for="sp-in' + set + '">' + lab + '</label><span class="sp-dr"><input class="numin sp-in" id="sp-in' + set + '" type="text" autocomplete="off" spellcheck="false" inputmode="decimal">' +
      '<button type="button" class="btn ghost sm" data-set="' + set + '" data-k="spset' + set + '">Use these</button></span>' +
      '<span class="sp-dr"><button type="button" class="btn ghost sm" data-add="' + set + '" data-k="spadd' + set + '">Add a dot</button><button type="button" class="btn ghost sm" data-rem="' + set + '" data-k="sprem' + set + '">Remove a dot</button></span></div>';
  }
  function renderAll(){
    modeR.set(S.mode);
    plot.c.classList.toggle("sp-two", S.mode === "compare" || S.mode === "trans");
    var c = $("#sp-ctrl", host), h = "";
    if (S.mode === "box" || S.mode === "steps" || S.mode === "trans") h += '<div id="sp-pre"></div>';
    if (S.mode === "compare") h += dataRow("A", "Set A (whole numbers 0–80)") + dataRow("B", "Set B (whole numbers 0–80)");
    else h += dataRow("A", "Data (2 to 15 whole numbers, 0–80)");
    h += '<div id="sp-pop"></div>';
    if (S.mode === "steps") h += '<div class="q-actions"><button type="button" class="btn primary sm" id="sp-next" data-k="spnext">Next step</button><button type="button" class="btn ghost sm" id="sp-reset" data-k="spreset">Start again</button></div><div id="sp-steps" class="sp-steps"></div>';
    if (S.mode === "trans") h += '<div id="sp-sl" class="sp-sl"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="sp-treset" data-k="sptreset">Reset the sliders</button></div>';
    c.innerHTML = h;
    presetR = null;
    if ($("#sp-pre", c)) presetR = radios($("#sp-pre", c), { label:"Data:", aria:"Preset data sets", options:Object.keys(PRE).map(function(k){ return { id:k, t:PRE[k].t }; }), value:S.pre, cls:"chips",
      onChange:function(v){ user(); S.A = PRE[v].v.slice(); S.pre = v; S.col = 0; msg = ""; save(); paint(); MV.changed(); } });
    radios($("#sp-pop", c), { label:"Divide by:", aria:"Sample or population", options:[{ id:"s", t:"Sample (÷ " + M("n - 1") + ")" }, { id:"p", t:"Population (÷ " + M("N") + ")" }], value:S.pop ? "p" : "s", cls:"seg",
      onChange:function(v){ user(); S.pop = v === "p"; save(); paint(); MV.changed(); } });
    if ($("#sp-sl", c)) MV.sliders($("#sp-sl", c), [
      { id:"spc", label:"Add " + M("c"), min:-10, max:10, step:1, value:S.c, fmt:function(v){ return (v > 0 ? "+" : "") + mn(v); } },
      { id:"spk", label:"Multiply by " + M("k"), min:0.5, max:3, step:0.5, value:S.k, fmt:function(v){ return "× " + d2(v); } }],
      function(id, v){ user(); if (id === "spc") S.c = clampI(v, -10, 10, 0); else S.k = KS.indexOf(+v) >= 0 ? +v : 1; save(); paint(); MV.changed(); });
    paintAha(); paint();
  }
  function setData(set){
    var el = $("#sp-in" + set, host), raw = String(el ? el.value : "").trim(), parts = raw ? raw.split(/[\s,;]+/).filter(Boolean) : [], vals = [];
    for (var i = 0; i < parts.length; i++) {
      var v = Number(parts[i].replace(/−/g, "-"));
      if (!isFinite(v) || Math.round(v) !== v || v < 0 || v > 80) { msg = MV.fbHTML("bad", "Use whole numbers from 0 to 80, separated by commas: “" + MV.esc(parts[i]) + "” isn’t one."); paintMsg(); return; }
      vals.push(v);
    }
    if (vals.length < 2 || vals.length > 15) { msg = MV.fbHTML("bad", "Enter from 2 to 15 values."); paintMsg(); return; }
    user();
    if (set === "B") S.B = vals; else { S.A = vals; S.pre = ""; Object.keys(PRE).forEach(function(k){ if (PRE[k].v.join() === vals.join()) S.pre = k; }); if (presetR) presetR.set(S.pre); S.col = 0; }
    msg = ""; save(); if (el) el.blur(); paint(); MV.changed();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest(".rg")) return;
    if (b.dataset.set) { setData(b.dataset.set); return; }
    if (b.dataset.add) { addDot(b.dataset.add); return; }
    if (b.dataset.rem) { var set = b.dataset.rem, a = set === "B" ? S.B : S.A, sel = document.activeElement; removeDot(set + (a.length - 1)); return; }
    if (b.id === "sp-next") { user(); S.col = Math.min(3, S.col + 1); save(); paint(); MV.changed(); return; }
    if (b.id === "sp-reset") { user(); S.col = 0; save(); paint(); MV.changed(); return; }
    if (b.id === "sp-treset") { user(); S.c = 0; S.k = 1; save(); renderAll(); MV.changed(); return; }
  });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id && /^sp-in[AB]$/.test(e.target.id)) { e.preventDefault(); setData(e.target.id.slice(-1)); } });

  renderAll();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); msg = "";
    var s = p.start || {};
    S.mode = s.mode || "box"; S.pop = !!s.pop; S.col = 0;
    if (s.data) { S.A = PRE[s.data].v.slice(); S.pre = s.data; }
    if (s.a) { S.A = s.a.slice(); S.pre = ""; }
    if (s.b) S.B = s.b.slice();
    if (S.mode === "trans") { S.c = s.c || 0; S.k = s.k || 1; }
    pv = p.id === "p4" ? { hide:true } : {};
    save(); renderAll();
  }
  function runPred(p, done){
    var s = p.start || {};
    var a = newAnim(function(){
      if (p.id === "p1") { S.A = PRE.home40.v.slice(); S.pre = "home40"; }
      else if (p.id === "p2") S.c = s.to;
      else if (p.id === "p3") S.pop = false;
      pv = {}; save(); renderAll(); MV.changed(); done();
    });
    if (p.id === "p1") {
      var i = S.A.indexOf(70); if (i < 0) { S.A = PRE.home.v.slice(); i = 10; }
      a.stop = MV.tween({ dur:1500, step:function(t){ S.A[i] = 70 - 30 * t; paintChart(); paintRead(); }, done:function(){ S.A[i] = 40; a.timer = MV.wait(500, endAnim); } });
    } else if (p.id === "p2") {
      a.stop = MV.tween({ dur:1500, step:function(t){ pv.c = s.to * t; paintChart(); paintRead(); paintCap(); }, done:function(){ a.timer = MV.wait(500, endAnim); } });
    } else if (p.id === "p3") {
      a.timer = MV.wait(600, function(){ S.pop = false; renderAll(); a.timer = MV.wait(700, endAnim); });
    } else {
      pv = { hide:true, sq:1 }; paintRead();
      a.timer = MV.wait(900, function(){ pv.sq = 2; paintRead(); a.timer = MV.wait(900, endAnim); });
    }
  }

  // --- challenges ---
  function multisetDiff(a, b){ var c = b.slice(), out = []; a.forEach(function(v){ var k = c.indexOf(v); if (k >= 0) c.splice(k, 1); else out.push(v); }); return out; }
  function chal(id){
    var R = function(m){ return { ok:false, msg:MV.md(m) }; }, A = S.A;
    if (id === "tc1") {
      if (A.length !== 7) return R("Use exactly 7 values.");
      if (A.some(function(v){ return v > 30; })) return R("Keep every value from 0 to 30.");
      var s = sortN(A);
      if (s[3] !== 15) return R("The median (the 4th value) is " + s[3] + ". Put 15 in the middle (4th) position.");
      if (s[5] - s[1] === 10) return { ok:true };
      if ((s[4] + s[5]) / 2 - (s[1] + s[2]) / 2 === 10) return R("With 7 values, `Q_1` is the median of the 3 lowest: the 2nd value.");
      return R("The IQR is " + d2(s[5] - s[1]) + ". `Q_1` is the 2nd value and `Q_3` is the 6th: make them 10 apart.");
    }
    if (id === "tc2") {
      var base = PRE.home40.v;
      if (A.length !== 11) return R("Keep all 11 values: choose Homework (70 → 40) and drag one dot.");
      var gone = multisetDiff(base, A), added = multisetDiff(A, base);
      if (gone.length > 1) return R("Move just one value. Choose Homework (70 → 40) to start again.");
      var st = summ(A);
      if (st.med !== 26) return R("The median is now " + d2(st.med) + ". Keep it at 26.");
      if (st.out.length === 1) return { ok:true };
      if (!gone.length) return R("There are no outliers yet. Drag one value beyond a fence.");
      var o = gone[0], nw = added[0];
      if (st.out.length > 1) return R("Now there are " + st.out.length + " outliers. Make exactly one.");
      if (nw < o && nw < 26) return R("The lower fence is −6, and values can’t go below 0 here.");
      if (st.q3 !== 34) return R("That changes `Q_3` to " + d2(st.q3) + ", which moves the fence to " + d2(st.f2) + ". " + d2(nw) + " isn’t beyond it.");
      return R("The upper fence is " + d2(st.f2) + ", and " + d2(nw) + " isn’t beyond it.");
    }
    if (id === "tc3") {
      if (S.mode !== "steps") return R("Use <strong>SD steps</strong> mode.");
      if (A.length !== 4) return R("Use exactly 4 values.");
      if (A.some(function(v){ return v > 20; })) return R("Keep every value from 0 to 20.");
      var sum = 0, ss = 0; A.forEach(function(v){ sum += v; ss += (v - 10) * (v - 10); });
      if (sum !== 40) return R("The mean is " + d2(sum / 4) + ". For a mean of 10 the values must total 40.");
      if (ss === 12) return { ok:true };
      if (ss === 16) return S.pop ? R("You used ÷ `N`. This is a sample.") : R("That’s `s^2` = 16 ÷ 3 ≈ 5.3: too spread. For a sample, " + SUMSQ + " must be 3 × 4 = 12.");
      return R(SUMSQ + " = " + ss + ", so `s^2` = " + ss + " ÷ 3 " + eqx(ss / 3) + ". For `s` = 2 it must be 12.");
    }
    return { ok:false };
  }
  return { predict:{ start:startPred, run:runPred }, challenge:function(id){ return chal(id); } };
}

// ---------- hero: tight vs wide, same mean 50 ----------
var H_T = [45, 46, 48, 49, 50, 51, 52, 52, 53, 54];          // Σ(x − 50)² = 80, s ≈ 2.98
var H_W = [31, 33, 36, 44, 50, 50, 56, 64, 67, 69];          // Σ(x − 50)² = 1764, s = 14
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var plot = new MV.Plot(cv, { xmin:0, xmax:1, ymin:0, ymax:1 }), aria = cv.getAttribute("aria-label") || "", st = { drop:0, box:0, wide:0, cap:0 };
  plot.render = function(){
    var bottom = H_T.map(function(v, i){ return v + (H_W[i] - v) * st.wide; });
    boxRows(plot, { x0:25, x1:75, step:5, dotK:0.34, describe:aria, meanLine:{ x:50, label:"mean 50" },
      rows:[{ name:"Class 1", vals:H_T, drop:st.drop, box:st.box, note:"s ≈ 3", noteA:st.cap }, { name:"Class 2", vals:bottom, drop:st.drop, box:st.box, note:"s = 14", noteA:st.cap }] });
  };
  var cap = f.cap;
  function last(){ st = { drop:1, box:1, wide:1, cap:1 }; plot.render(); cap.textContent = "Same mean, 50. Spread: s ≈ 3 vs s = 14"; }
  if (MV.reduceMotion) { last(); return; }
  plot.render(); cap.textContent = "Twenty dots, two classes";
  MV.tween({ dur:1100, step:function(t){ st.drop = t; plot.render(); }, done:function(){
    cap.textContent = "Both rows balance at a mean of 50";
    MV.wait(600, function(){
      cap.textContent = "A box plot draws under each row";
      MV.tween({ dur:1000, step:function(t){ st.box = t; plot.render(); }, done:function(){
        MV.wait(500, function(){
          cap.textContent = "The bottom row spreads out";
          MV.tween({ dur:1600, step:function(t){ st.wide = t; st.cap = Math.max(0, t * 1.6 - 0.6); plot.render(); }, done:function(){ MV.wait(400, last); } });
        });
      } });
    });
  } });
}

// ---------- Part 3: Compare two data sets (four stations) ----------
function part3(host, api){
  var S = api.S, P3 = api.content || {}, ST = P3.stations || [];
  if (!ST.length) return {};
  if (!ST.some(function(s){ return s.id === S.cur; })) S.cur = ST[0].id;
  function obj(o){ return o && typeof o === "object" ? o : {}; }
  S.s1 = typeof S.s1 === "string" ? S.s1 : ""; S.s2 = obj(S.s2); S.s3 = obj(S.s3); S.s4 = obj(S.s4);
  ["add", "mul"].forEach(function(k){ S.s4[k] = obj(S.s4[k]); S.s4[k].pick = typeof S.s4[k].pick === "string" ? S.s4[k].pick : ""; S.s4[k].on = !!S.s4[k].on; });
  if (!S.s4.add.on) S.s4.mul.on = false;
  var plots = {}, tabsR;
  function st(id){ return ST.filter(function(s){ return s.id === id; })[0]; }
  function okChoice(s){ return s.choices.filter(function(c){ return MV.ok(c); })[0]; }
  function done(id){
    var s = st(id);
    if (id === "s1") { var c = okChoice(s); return !!c && S.s1 === c.id; }
    if (id === "s2") return s.asks.every(function(q){ return S.s2[q.id] === MV.ans(q); });
    if (id === "s3") return s.sets.every(function(q){ return S.s3[q.id] === MV.ans(q); });
    return S.s4.add.on && S.s4.mul.on;
  }
  var tabOpts = ST.map(function(s){ return { id:s.id, t:"" }; });
  function tabText(){ ST.forEach(function(s, i){ tabOpts[i].t = "Station " + (i + 1) + ": " + s.title + (done(s.id) ? ' <span class="sp-tick" aria-label="done">✓</span>' : ""); }); }
  host.innerHTML = '<div id="cp-tabs"></div><div id="cp-body"></div>';
  tabText();
  tabsR = radios($("#cp-tabs", host), { label:"Station", options:tabOpts, value:S.cur, cls:"chips", onChange:function(v){ S.cur = v; api.save(); paint(); } });
  function ticks(){ tabText(); tabsR.refresh(); }
  function fb(ok, t){ return MV.fbHTML(ok ? "good" : "bad", (ok ? "<strong>✓ " : "<strong>✗ ") + (ok ? "Correct.</strong> " : "Not quite.</strong> ") + t.replace(/^Right\.\s*/, "")); }
  function sdTable(sets){
    return sets.map(function(q){
      var s = summ(q.vals), m = s.mean;
      return MV.tableHTML({ head:[M("x"), DEVH, SQH], caption:q.name + " (mean " + d2(m) + ")",
        rows:q.vals.map(function(x){ return [d2(x), d2(x - m), d2((x - m) * (x - m))]; }).concat([["<strong>Σ = " + d2(s.sum) + "</strong>", "<strong>0</strong>", "<strong>" + d2(s.ss) + "</strong>"]]) });
    }).join("");
  }

  // Station 1: two goalies
  function s1(body, s){
    body.innerHTML = '<p class="cp-text">' + s.text + '</p><canvas class="plot cp-plot2" id="cp1-plot" role="img" aria-label="Goalie saves"></canvas><div id="cp1-ch"></div><div id="cp1-fb" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with data</summary>' + sdTable([{ name:"Goalie A", vals:s.a }, { name:"Goalie B", vals:s.b }]) + '<p class="sp-lines">' + s.data + "</p></details>";
    plots.s1 = new MV.Plot($("#cp1-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 });
    plots.s1.render = function(){ boxRows(plots.s1, { x0:15, x1:40, step:5, rows:[{ name:"Goalie A", vals:s.a, mean:true }, { name:"Goalie B", vals:s.b, mean:true }],
      describe:"Dot plots with box plots of saves per game. Goalie A: " + s.a.join(", ") + ". Goalie B: " + s.b.join(", ") + ". Both means are 28." }); };
    plots.s1.render();
    radios($("#cp1-ch", body), { label:"More consistent:", aria:"Which goalie is more consistent?", options:s.choices.map(function(c){ return { id:c.id, t:c.t }; }), value:S.s1, cls:"chips",
      onChange:function(v){ S.s1 = v; api.save(); s1fb(); ticks(); MV.focusFb($("#cp1-fb", host)); } });
    s1fb();
  }
  function s1fb(){ var s = st("s1"), c = s.choices.filter(function(x){ return x.id === S.s1; })[0], el = $("#cp1-fb", host); if (el) el.innerHTML = c ? fb(MV.ok(c), c.fb) : ""; }

  // Station 2: two classes (box plots)
  function s2(body, s){
    body.innerHTML = '<p class="cp-text">' + s.text + '</p><canvas class="plot cp-plot2" id="cp2-plot" role="img" aria-label="Two box plots"></canvas>' +
      s.asks.map(function(q){ return '<div class="cp-ask"><p class="cp-q">' + q.t + '</p><div data-ask="' + q.id + '"></div><div id="cp2-' + q.id + '" aria-live="polite"></div></div>'; }).join("") + '<p class="cp-done" id="cp2-done"></p>';
    plots.s2 = new MV.Plot($("#cp2-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 });
    plots.s2.render = function(){ boxRows(plots.s2, { x0:50, x1:100, step:10, rows:[{ name:"Class P", five:s.p }, { name:"Class Q", five:s.q }],
      describe:"Box plots. Class P: minimum 52, Q1 62, median 70, Q3 78, maximum 94. Class Q: minimum 58, Q1 66, median 70, Q3 74, maximum 82." }); };
    plots.s2.render();
    s.asks.forEach(function(q){
      radios(body.querySelector('[data-ask="' + q.id + '"]'), { aria:MV.plain(q.t), options:q.choices.map(function(c){ return { id:c, t:c }; }), value:S.s2[q.id] || "", cls:"chips",
        onChange:function(v){ S.s2[q.id] = v; api.save(); s2fb(); ticks(); MV.focusFb($("#cp2-" + q.id, host)); } });
    });
    s2fb();
  }
  function s2fb(){
    var s = st("s2");
    s.asks.forEach(function(q){ var el = $("#cp2-" + q.id, host), v = S.s2[q.id]; if (el) el.innerHTML = v ? fb(v === MV.ans(q), q.fb[v]) : ""; });
    var d = $("#cp2-done", host); if (d) d.innerHTML = done("s2") ? "<strong>✓ " + s.done + "</strong>" : "";
  }

  // Station 3: the right pair
  function s3(body, s){
    body.innerHTML = '<p class="cp-text">' + s.text + "</p>" + s.sets.map(function(q){
      return '<div class="cp-set"><p class="cp-q"><strong>' + q.name + "</strong> (" + q.unit + ') <span class="mdm-model">model data</span></p><canvas class="plot cp-plot1" id="cp3-' + q.id + '-plot" role="img" aria-label="' + MV.esc(q.name) + '"></canvas>' +
        '<div data-set3="' + q.id + '"></div><div id="cp3-' + q.id + '" aria-live="polite"></div></div>';
    }).join("") + '<p class="cp-done" id="cp3-done"></p>';
    s.sets.forEach(function(q){
      var pl = plots["s3" + q.id] = new MV.Plot($("#cp3-" + q.id + "-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 });
      pl.render = function(){ var sm = summ(q.vals); boxRows(pl, { x0:q.x0, x1:q.x1, step:q.step, rows:[{ name:q.name, vals:q.vals, fences:true, mean:true }],
        describe:q.name + ": " + q.vals.join(", ") + ". Box plot " + fiveTxt(sm) + "; mean " + apx(sm.mean) + (sm.out.length ? "; outlier " + listTxt(sm.out) : "; no outliers") + "." }); };
      pl.render();
      radios(body.querySelector('[data-set3="' + q.id + '"]'), { label:"Best pair:", aria:"Best summary pair for " + q.name, options:s.pairs, value:S.s3[q.id] || "", cls:"chips",
        onChange:function(v){ S.s3[q.id] = v; api.save(); s3fb(); ticks(); MV.focusFb($("#cp3-" + q.id, host)); } });
    });
    s3fb();
  }
  function s3fb(){
    var s = st("s3");
    s.sets.forEach(function(q){ var el = $("#cp3-" + q.id, host), v = S.s3[q.id]; if (el) el.innerHTML = v ? fb(v === MV.ans(q), q.fb[v] + (v === MV.ans(q) ? "" : " " + s.done)) : ""; });
    var d = $("#cp3-done", host); if (d) d.innerHTML = done("s3") ? "<strong>✓ " + s.done + "</strong>" : "";
  }

  // Station 4: how much did the spread change?
  function s4(body, s){
    body.innerHTML = '<p class="cp-text">' + s.text + '</p><canvas class="plot cp-plot3" id="cp4-plot" role="img" aria-label="Test marks"></canvas><dl class="read cp-read" id="cp4-read" aria-live="polite"></dl>' +
      s.steps.map(function(q){ return '<div class="cp-ask" id="cp4-' + q.id + '-box"><p class="cp-q">' + q.t + '</p><div data-step4="' + q.id + '"></div><div class="q-actions"><button type="button" class="btn primary sm" data-apply="' + q.id + '" data-k="cp4' + q.id + '">' + q.btn + '</button></div><div id="cp4-' + q.id + '" aria-live="polite"></div></div>'; }).join("") +
      '<p class="cp-done" id="cp4-done"></p>';
    plots.s4 = new MV.Plot($("#cp4-plot", body), { xmin:0, xmax:1, ymin:0, ymax:1 });
    plots.s4.render = s4chart;
    s.steps.forEach(function(q){
      radios(body.querySelector('[data-step4="' + q.id + '"]'), { label:"Predict:", aria:MV.plain(q.t), options:q.choices.map(function(c){ return { id:c, t:c }; }), value:S.s4[q.id].pick, cls:"chips",
        disabled:function(){ return S.s4[q.id].on || (q.id === "mul" && !S.s4.add.on); },
        onChange:function(v){ S.s4[q.id].pick = v; api.save(); s4paint(); } });
    });
    s4paint();
  }
  function s4data(){ var m = st("s4").marks, a = m.map(function(v){ return v + 4; }); return { m:m, a:a, b:a.map(function(v){ return v * 2; }) }; }
  function s4chart(){
    var D = s4data(), R = [{ name:"Marks out of 50", vals:D.m, mean:true }];
    if (S.s4.add.on) R.push({ name:"+ 4 bonus", vals:D.a, mean:true });
    if (S.s4.mul.on) R.push({ name:"× 2 (percent)", vals:D.b, mean:true });
    boxRows(plots.s4, { x0:20, x1:100, step:10, rows:R, describe:R.map(function(r){ var sm = summ(r.vals); return r.name + ": " + r.vals.join(", ") + ", mean " + apx(sm.mean) + ", s " + apx(sm.sd) + "."; }).join(" ") });
  }
  function s4paint(){
    var s = st("s4"), body = $("#cp-body", host); if (!$("#cp4-read", body)) return;
    var D = s4data(), m = summ(D.m), a = summ(D.a), b = summ(D.b);
    plots.s4.c.classList.toggle("cp-r2", S.s4.add.on && !S.s4.mul.on); plots.s4.c.classList.toggle("cp-r3", S.s4.mul.on);
    s4chart();
    var rows = [["Original", "mean " + apx(m.mean) + ", " + M("s") + " " + eqx(m.sd)]];
    if (S.s4.add.on) rows.push(["After + 4", "mean " + apx(a.mean) + ", " + M("s") + " " + eqx(a.sd)]);
    if (S.s4.mul.on) rows.push(["After × 2", "mean " + apx(b.mean) + ", " + M("s") + " " + eqx(b.sd)]);
    $("#cp4-read", body).innerHTML = MV.readoutHTML(rows);
    s.steps.forEach(function(q){
      var x = S.s4[q.id], btn = body.querySelector('[data-apply="' + q.id + '"]'), el = $("#cp4-" + q.id, body);
      btn.disabled = x.on || !x.pick || (q.id === "mul" && !S.s4.add.on);
      el.innerHTML = x.on ? fb(x.pick === MV.ans(q), q.fb[x.pick]) : x.pick ? '<p class="tiny muted">Tap ' + q.btn + " to see what happens.</p>" : "";
    });
    var d = $("#cp4-done", body); d.innerHTML = done("s4") ? "<strong>✓ " + MV.md(s.done) + "</strong>" : "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-apply]"); if (!b || b.disabled) return;
    var k = b.dataset.apply, x = S.s4[k]; if (!x.pick || x.on) return;
    x.on = true; api.save(); s4paint(); ticks();
    body4Refresh(); MV.focusFb($("#cp4-" + k, host));
  });
  function body4Refresh(){ var body = $("#cp-body", host); body.querySelectorAll("[data-step4]").forEach(function(h){ var bt = h.querySelectorAll("button"); bt.forEach(function(x){ x.disabled = S.s4[h.dataset.step4].on || (h.dataset.step4 === "mul" && !S.s4.add.on); }); }); }
  function paint(){
    ticks();
    var s = st(S.cur), body = $("#cp-body", host);
    body.innerHTML = '<div class="cp-card"><span class="cp-lab">Station ' + (ST.indexOf(s) + 1) + " · " + s.title + '</span><div id="cp-in"></div></div>';
    var inner = $("#cp-in", body);
    ({ s1:s1, s2:s2, s3:s3, s4:s4 })[s.id](inner, s);
  }
  paint();
  return {};
}

// ---------- Performance task: Steady practice ----------
var task = (function(){
  var api = null, plot = null;
  function read(){
    var s = api ? api.S : {};
    return { v:Array.isArray(s.v) && s.v.length === 5 ? s.v.map(function(x){ return clampI(x, 0, 20, 10); }) : [8, 9, 10, 11, 12] };
  }
  function nums(v){ var s1 = 0, s2 = 0; v.forEach(function(x){ s1 += x; s2 += x * x; }); return { sum:s1, ss5:5 * s2 - s1 * s1, range:Math.max.apply(null, v) - Math.min.apply(null, v) }; }
  function key(d){ return sortN(d.v).join(", "); }
  function paint(){
    var el = $("#sp-tread"); if (!el) return;
    var d = read(), st = summ(d.v), N = nums(d.v);
    el.innerHTML = MV.readoutHTML([
      ["Times", listTxt(d.v)],
      ["Mean", d2(N.sum) + " ÷ 5 " + eqx(st.mean)],
      ["Sample SD", SUMSQ + " " + eqx(st.ss) + "; " + M("s") + " = √(" + d2(st.ss) + " ÷ 4) " + eqx(st.sd)],
      ["Range", d2(st.max) + " − " + d2(st.min) + " = " + d2(N.range)],
      ["Five-number summary", fiveTxt(st)]]);
    $("#sp-tsteps").innerHTML = stepsHTML(d.v, 3, false, "Standard deviation steps for your times");
    if (plot) plot.render();
  }
  function draw(){
    var d = read(), st = summ(d.v);
    boxRows(plot, { x0:0, x1:20, step:2, dotK:0.4, rows:[{ name:"Your five times", sub:"minutes", vals:d.v, fences:true, mean:true }],
      describe:"Dot plot of your times " + listTxt(d.v) + " with a box plot " + fiveTxt(st) + "; mean " + apx(st.mean) + ", sample standard deviation " + apx(st.sd) + "." });
  }
  return {
    render:function(inp, pvw, a){
      api = a; var d = read(); a.S.v = d.v.slice();
      inp.innerHTML = '<div id="sp-tsl"></div><p class="tiny muted">Whole minutes from 0 to 20. The order doesn’t matter.</p>';
      MV.sliders($("#sp-tsl", inp), d.v.map(function(v, i){ return { id:"spt" + (i + 1), label:"Time " + (i + 1) + " (min)", min:0, max:20, step:1, value:v }; }), function(id, v){
        var i = +id.slice(3) - 1, cur = read().v; cur[i] = clampI(v, 0, 20, 10); a.S.v = cur; a.save(); paint(); a.update();
      });
      pvw.innerHTML = '<canvas class="plot sp-tplot" id="sp-tplot" role="img" aria-label="Your times as a dot plot with a box plot"></canvas><dl class="read" id="sp-tread" aria-live="polite"></dl><div id="sp-tsteps" class="sp-steps"></div>';
      plot = new MV.Plot($("#sp-tplot"), { xmin:0, xmax:1, ymin:0, ymax:1 }); plot.render = draw;
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var N = nums(d.v); return [N.sum === 50, N.ss5 === 180, N.range <= 7]; },
    key:key,
    label:function(k){ return k; },
    text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
