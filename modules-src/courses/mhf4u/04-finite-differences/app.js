// MHF4U 04 Finite Differences: hero difference table, difference table machine (Explore), reverse engineering (Part 3),
// scratch machine under the sorter, "Design to a difference spec" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var ORD = ["", "1st", "2nd", "3rd", "4th"], ORDW = ["", "first", "second", "third", "fourth"], LET = ["a", "b", "c", "d", "e"];
var SUPS = ["", "¹", "²", "³", "⁴"];

// ---------- maths ----------
function clean(v){ var r = Math.round(v * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; }
function diffCols(ys, max){
  var c = [ys.map(clean)];
  for (var k = 1; k <= (max || 4); k++) {
    var p = c[k - 1]; if (p.length < 2) break;
    var q = []; for (var j = 0; j + 1 < p.length; j++) q.push(clean(p[j + 1] - p[j]));
    c.push(q);
  }
  return c;
}
function isConst(col){ return !!col && col.length >= 2 && col.every(function(v){ return Math.abs(v - col[0]) < 1e-9; }); }
function firstConst(cols, upto){ for (var k = 1; k <= upto && k < cols.length; k++) if (isConst(cols[k])) return k; return 0; }
function fact(n){ return n <= 1 ? 1 : n * fact(n - 1); }
function evalP(co, x){ var v = 0; co.forEach(function(c){ v = v * x + c; }); return clean(v); }
function same(a, b){ return Math.abs(a - b) < 1e-9; }
function list(a){ return a.map(function(v){ return num(v); }).join(", "); }
function par(v){ return v < 0 ? "(" + num(v) + ")" : num(v); }
// "2x^3 - 5x + 1" for MV.m()
function polyStr(co){
  var n = co.length - 1, s = "";
  co.forEach(function(c, i){
    var p = n - i; if (same(c, 0)) return;
    var mag = clean(Math.abs(c)), cs = (p > 0 && same(mag, 1)) ? "" : String(mag);
    var t = cs + (p === 0 ? "" : p === 1 ? "x" : "x^" + p);
    s += s ? (c < 0 ? " - " : " + ") + t : (c < 0 ? "-" : "") + t;
  });
  return s || "0";
}
function polyM(co){ return MV.m("y = " + polyStr(co)); }
function termM(a, n){ var t = [a]; for (var i = 0; i < n; i++) t.push(0); return MV.m(polyStr(t)); }
function formM(n){ var t = []; for (var i = 0; i <= n; i++) { var p = n - i; t.push(LET[i] + (p === 0 ? "" : p === 1 ? "x" : "x^" + p)); } return MV.m("y = " + t.join(" + ")); }
// a value: decimals for halves, a stacked fraction (N3) otherwise
function aHTML(v){
  if (Number.isInteger(clean(v * 2))) return num(v);
  var f = MV.frac(v, 120); if (f.indexOf("/") < 0) return num(v);
  var neg = f.charAt(0) === MINUS, p = f.replace(MINUS, "").split("/");
  return MV.m((neg ? "-" : "") + "{" + p[0] + "}/{" + p[1] + "}");
}
// exact values in Part 3: whole numbers, or a stacked fraction (−1/2, 1/2)
function fracHTML(v){
  if (Number.isInteger(clean(v))) return num(v);
  var f = MV.frac(v, 120); if (f.indexOf("/") < 0) return num(v);
  var neg = f.charAt(0) === MINUS, p = f.replace(MINUS, "").split("/");
  return MV.m((neg ? "-" : "") + "{" + p[0] + "}/{" + p[1] + "}");
}
function fracTermHTML(a, n){
  if (Number.isInteger(clean(a))) return termM(a, n);
  var f = MV.frac(a, 120), neg = f.charAt(0) === MINUS, p = f.replace(MINUS, "").split("/");
  return MV.m((neg ? "-" : "") + "{" + p[0] + "}/{" + p[1] + "}x^" + n);
}
function inkSliders(host){
  $$("output", host).forEach(function(o){ o.style.color = "var(--ink)"; });
  $$('input[type="range"]', host).forEach(function(i){ i.style.accentColor = "var(--ink)"; });
}
function setSliderLabel(id, html){ var el = document.getElementById("sl-" + id); if (el) { var s = el.closest("label").querySelector(".slider-top > span"); if (s) s.innerHTML = html; } }
function showSlider(id, on){ var el = document.getElementById("sl-" + id); if (el) el.closest("label").hidden = !on; }
function chipsHTML(list, attr, cur, key){
  return list.map(function(c){ var on = String(c.v) === String(cur); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-' + attr + '="' + c.v + '" data-k="' + key + c.v + '" aria-pressed="' + on + '">' + c.t + "</button>"; }).join("");
}

// @component N14 diffTable — table of values with staggered difference columns (Δ¹…Δ⁴), subtraction arrows while a column
// fills, constant-column glow and tags, optional heading buttons and an extra aligned column ("peel"). Used by the hero,
// Explore, Part 3, the sorter's scratch machine and the task.
function DiffTable(host, o){
  o = o || {};
  var st = { xs:[], ys:[], cols:[[]], shown:0, anim:null, extra:null, glow:"auto", hb:null }, tok = 0, run = null;
  host.innerHTML = '<div class="dt-scroll" tabindex="0" role="region" aria-label="' + MV.esc(o.aria || "Table of values with difference columns") + '"><div class="dt-inner"><table class="dtab"></table><svg class="dt-arrows" aria-hidden="true" focusable="false"></svg></div></div>' +
    (o.noStep ? "" : '<p class="dt-step" aria-hidden="true"></p>') + '<p class="vh" aria-live="polite"></p>';
  var tbl = $("table", host), svg = $("svg", host), inner = $(".dt-inner", host), stepEl = $(".dt-step", host), live = $(".vh", host);
  function maxCols(){ return Math.max(0, Math.min(o.max || 4, st.ys.length - 1)); }
  function glowCol(){ return st.glow === "auto" ? firstConst(st.cols, st.shown) : (st.glow || 0); }
  function tag(k, fc){
    if (!o.tags || k > st.shown) return "";
    var col = st.cols[k];
    if (col.length < 2) return '<span class="dt-tag no">only 1 entry</span>';
    if (k === fc) return '<span class="dt-tag yes">' + (o.constLabel ? o.constLabel(k) : "constant") + "</span>";
    if (fc && k > fc && isConst(col)) return '<span class="dt-tag no">all ' + num(col[0]) + "</span>";
    return '<span class="dt-tag no">not constant</span>';
  }
  function headIn(k){
    var h = k === 0 ? '<span class="m"><i>y</i></span>' : '<span class="dt-dl">Δ<sup>' + k + '</sup></span><span class="dt-dw">' + ORD[k] + " differences</span>";
    if (!st.hb) return h;
    var mk = st.hb.marks && st.hb.marks[k];
    return '<button type="button" class="dt-hb' + (mk ? " " + mk : "") + '" data-col="' + k + '" data-k="' + (o.key || "dt") + "h" + k + '"' + (st.hb.on ? "" : " disabled") +
      ' aria-label="' + (k === 0 ? "The y column" : ORD[k] + " differences") + (mk === "good" ? ": the first constant column" : "") + '">' + h + "</button>";
  }
  function paint(){
    var N = st.ys.length, K = Math.min(st.shown + (st.anim ? 1 : 0), maxCols()), fc = glowCol(), k, i, j;
    var src = st.anim && st.anim.n > 0 ? { k:st.shown + 1, j:st.anim.n - 1 } : null, ex = st.extra;
    var h = '<caption class="vh">' + (o.caption ? o.caption() : "Table of values with difference columns") + "</caption><thead><tr>" +
      '<th scope="col" class="dt-x"><span class="m"><i>x</i></span></th><th scope="col" class="dt-y">' + headIn(0) + "</th>";
    for (k = 1; k <= K; k++) h += '<th scope="col" class="dt-dh' + (k === fc ? " on" : "") + '">' + headIn(k) + tag(k, fc) + "</th>";
    if (ex) h += '<th scope="col" class="dt-eh">' + ex.head + "</th>";
    h += "</tr></thead><tbody>";
    for (var r = 0; r < 2 * N; r++) {
      h += "<tr>";
      if (r % 2 === 0) {
        i = r / 2;
        h += '<td rowspan="2" class="dt-x">' + num(st.xs[i]) + '</td><td rowspan="2" class="dt-y' + (src && src.k === 1 && (i === src.j || i === src.j + 1) ? " src" : "") + '" data-c="0" data-j="' + i + '"><span class="v">' + num(st.ys[i]) + "</span></td>";
      }
      for (k = 1; k <= K; k++) {
        var len = N - k; if (len < 1) continue;
        var filled = k <= st.shown ? len : (st.anim ? st.anim.n : 0), glow = k === fc ? " on" : "";
        if (r === 0) h += '<td rowspan="' + k + '" class="dt-f' + glow + '"></td>';
        if (r >= k && (r - k) % 2 === 0) {
          j = (r - k) / 2;
          if (j < len) {
            var cls = "dt-d" + glow + (src && src.k === k && j === src.j ? " new" : "") + (src && src.k === k + 1 && (j === src.j || j === src.j + 1) ? " src" : "");
            h += '<td rowspan="2" class="' + cls + '" data-c="' + k + '" data-j="' + j + '">' + (j < filled ? '<span class="v">' + num(st.cols[k][j]) + "</span>" : "") + "</td>";
          }
        }
        if (r === 2 * N - k) h += '<td rowspan="' + k + '" class="dt-f' + glow + '"></td>';
      }
      if (ex && r % 2 === 0) {
        i = r / 2; var c = ex.cells[i];
        h += '<td rowspan="2" class="dt-e' + (i === ex.cur ? " new" : "") + '">' + (i < ex.n ? '<span class="v">' + c.v + "</span><small>" + c.note + "</small>" : "") + "</td>";
      }
      h += "</tr>";
    }
    MV.keepFocus(tbl, function(){ tbl.innerHTML = h + "</tbody>"; });
    arrows(src);
  }
  function cell(k, j){ return tbl.querySelector('td[data-c="' + k + '"][data-j="' + j + '"]'); }
  function arrows(src){
    svg.innerHTML = "";
    if (!src || MV.reduceMotion) return;
    var c = cell(src.k, src.j), p1 = cell(src.k - 1, src.j), p2 = cell(src.k - 1, src.j + 1);
    if (!c || !p1 || !p2) return;
    var ir = inner.getBoundingClientRect(), W = inner.scrollWidth, H = inner.scrollHeight;
    svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    function box(td){ var s = td.querySelector(".v") || td, b = s.getBoundingClientRect(); return { l:b.left - ir.left, r:b.right - ir.left, cy:(b.top + b.bottom) / 2 - ir.top }; }
    var C = box(c), x2 = C.l - 5, out = "";
    [[box(p1), -4], [box(p2), 4]].forEach(function(q){
      var P = q[0], x1 = P.r + 4, y1 = P.cy, y2 = C.cy + q[1], mx = (x1 + x2) / 2;
      out += '<path class="ln" d="M' + x1.toFixed(1) + " " + y1.toFixed(1) + " C" + mx.toFixed(1) + " " + y1.toFixed(1) + " " + mx.toFixed(1) + " " + y2.toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1) + '"/>' +
        '<path class="hd" d="M' + x2.toFixed(1) + " " + y2.toFixed(1) + ' l-6 -3.5 l0 7 z"/>';
    });
    svg.innerHTML = out;
  }
  function stepLine(k, j){
    if (!stepEl) return;
    var p = st.cols[k - 1];
    stepEl.innerHTML = "Δ" + SUPS[k] + ": " + MV.m(num(p[j + 1]) + " − " + par(p[j]) + " = " + num(st.cols[k][j])) + ' <span class="muted">(later minus earlier)</span>';
  }
  function announce(k){ if (o.quiet || !live) return; var col = st.cols[k]; live.textContent = ORD[k] + " differences: " + MV.plain(list(col)) + (isConst(col) ? ". Constant." : "."); }
  function finishRun(){ var r = run; run = null; if (r && r.done) r.done(); }
  function cancel(){ tok++; st.anim = null; if (st.extra) st.extra.cur = -1; if (run) { var r = run; run = null; if (r.done) setTimeout(r.done, 0); } }
  function fillCol(k, my, ms, cb){
    var len = st.ys.length - k;
    var end = function(){ st.anim = null; st.shown = k; paint(); announce(k); if (o.onCol) o.onCol(k); cb(); };
    if (MV.reduceMotion || !ms) { end(); return; }
    st.anim = { n:0 };
    (function step(){
      if (my !== tok) return;
      st.anim.n++; paint(); stepLine(k, st.anim.n - 1);
      setTimeout(function(){ if (my !== tok) return; if (st.anim.n < len) step(); else end(); }, ms);
    })();
  }
  function fillTo(n, done, ms){
    cancel(); var my = tok; run = { done:done };
    (function next(){
      if (my !== tok) return;
      var k = st.shown + 1;
      if (k > n || k > maxCols() || (o.stopAtConst && firstConst(st.cols, st.shown))) { st.anim = null; paint(); if (o.clearStep && stepEl) stepEl.innerHTML = ""; finishRun(); return; }
      fillCol(k, my, ms == null ? (o.ms || 260) : ms, next);
    })();
  }
  function peel(ex, done, ms){
    cancel(); var my = tok; run = { done:done }; st.extra = ex; ex.cur = -1;
    if (MV.reduceMotion) { ex.n = ex.cells.length; paint(); finishRun(); return; }
    ex.n = 0;
    (function step(){
      if (my !== tok) return;
      ex.n++; ex.cur = ex.n - 1; paint();
      setTimeout(function(){ if (my !== tok) return; if (ex.n < ex.cells.length) step(); else { ex.cur = -1; paint(); finishRun(); } }, ms || 420);
    })();
  }
  return {
    set:function(p){
      cancel();
      if (p.xs) st.xs = p.xs.slice();
      if (p.ys) st.ys = p.ys.slice();
      st.cols = diffCols(st.ys, o.max || 4);
      if (p.shown != null) st.shown = p.shown;
      st.shown = Math.min(st.shown, maxCols());
      if ("extra" in p) st.extra = p.extra;
      if ("glow" in p) st.glow = p.glow;
      if ("hb" in p) st.hb = p.hb;
      if (stepEl) stepEl.innerHTML = "";
      paint();
    },
    fillTo:fillTo, peel:peel, cancel:cancel, paint:paint,
    busy:function(){ return !!run; },
    shown:function(){ return st.shown; },
    cols:function(){ return st.cols; },
    data:function(){ return { xs:st.xs, ys:st.ys }; },
    maxCols:maxCols
  };
}

// Difference graph (G12 dots for y, a row of bars for each difference column; bars level off when a column is constant).
function drawDG(p, cols, shown, maxC, fc, what){
  var N = cols[0].length;
  var desc = "Difference graph for " + what + ": dots for the " + N + " y-values" + (shown ? ", and rows of bars for the 1st to " + ORD[shown] + " differences." : ". No difference columns filled yet.") + (fc ? " The " + ORD[fc] + " differences are level: constant at " + MV.plain(num(cols[fc][0])) + "." : "");
  p.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:desc, after:function(ctx){
    var W = p.W, H = p.H, left = 38, right = 10, cw = (W - left - right) / N, bands = 1 + Math.max(maxC, 1), bh = H / bands;
    for (var b = 0; b < bands; b++) {
      var top = b * bh;
      if (b === fc && b) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(0, top, W, bh); }
      if (b) { ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, Math.round(top) + 0.5); ctx.lineTo(W, Math.round(top) + 0.5); ctx.stroke(); }
      ctx.fillStyle = css("--ink-2"); ctx.globalAlpha = b > shown ? 0.45 : 1;
      ctx.font = (b ? "15px " : "italic 16px ") + p.fontM; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(b ? "Δ" + SUPS[b] : "y", 10, top + bh / 2); ctx.globalAlpha = 1;
      if (b > shown || !cols[b]) continue;
      var vals = cols[b], m = Math.max.apply(null, vals.map(Math.abs)) || 1, pos = vals.every(function(v){ return v >= 0; }), neg = vals.every(function(v){ return v <= 0; });
      var pad = Math.min(8, bh * 0.15), use = bh - 2 * pad, base = pos ? top + bh - pad : neg ? top + pad : top + bh / 2, sc = (pos || neg) ? use / m : use / 2 / m;
      ctx.strokeStyle = css("--ink-2"); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(left, base); ctx.lineTo(W - right, base); ctx.stroke(); ctx.globalAlpha = 1;
      vals.forEach(function(v, j){
        var cx = left + (j + 0.5 + b / 2) * cw, yv = base - v * sc;
        if (!b) { ctx.fillStyle = css("--pen"); ctx.beginPath(); ctx.arc(cx, yv, 4.5, 0, 2 * Math.PI); ctx.fill(); return; }
        var bw = Math.max(4, Math.min(cw * 0.5, 26));
        ctx.fillStyle = b === fc ? css("--ink") : css("--ink-2"); ctx.globalAlpha = b === fc ? 0.85 : 0.55;
        ctx.fillRect(cx - bw / 2, Math.min(base, yv), bw, Math.max(1.5, Math.abs(yv - base)));
        ctx.globalAlpha = 1;
      });
    }
  } });
}

// ---------- hero: the storyboard table for y = 2x³ − 5x + 1 ----------
function hero(){
  var host = $("#hero-dt"); if (!host) return;
  var dt = DiffTable(host, { tags:true, quiet:true, ms:330, clearStep:true, constLabel:function(){ return "constant: degree 3"; },
    aria:"Difference table for y = 2x³ − 5x + 1", caption:function(){ return "Table of y = 2x³ − 5x + 1 for x = 0 to 5, with its difference columns."; } });
  var c1 = $("#hero-cap1"), c2 = $("#hero-cap2");
  c1.innerHTML = '<span class="m"><i>a</i> = 12 ÷ 3! = 12 ÷ 6 = 2</span>';
  c2.innerHTML = '<span class="m"><i>y</i> = <strong>2</strong><i>x</i><sup>3</sup> − 5<i>x</i> + 1</span>';
  var xs = [0, 1, 2, 3, 4, 5], ys = [1, -2, 7, 40, 109, 226];
  if (MV.reduceMotion) { dt.set({ xs:xs, ys:ys, shown:3 }); c1.classList.add("on"); c2.classList.add("on"); return; }
  dt.set({ xs:xs, ys:ys, shown:0 });
  MV.wait(900, function(){ dt.fillTo(3, function(){ MV.wait(500, function(){ c1.classList.add("on"); MV.wait(900, function(){ c2.classList.add("on"); }); }); }); });
}

// ---------- Explore: difference table machine ----------
function explore(host, api){
  var C = api.content, MYS = C.mystery, S = api.S;
  var D = { mode:"build", deg:3, a:2, co:[0, -5, 1, 0], start:0, step:1, rows:6, mys:"stack", shown:0 };
  Object.keys(D).forEach(function(k){ if (S[k] == null) S[k] = Array.isArray(D[k]) ? D[k].slice() : D[k]; });
  function mys(){ return MYS.filter(function(m){ return m.id === S.mys; })[0] || MYS[0]; }
  function coefs(){ return [S.a].concat(S.co.slice(0, S.deg)); }
  function data(){
    var xs = [], ys = [], i;
    if (S.mode === "mystery") { ys = mys().ys.slice(0, S.rows); for (i = 0; i < ys.length; i++) xs.push(i); return { xs:xs, ys:ys }; }
    var co = coefs(); for (i = 0; i < S.rows; i++) { var x = S.start + i * S.step; xs.push(x); ys.push(evalP(co, x)); }
    return { xs:xs, ys:ys };
  }
  var L = MV.pgLayout(host, { shape:"wide", aria:"Difference graph" });
  L.graph.querySelector(".plot-wrap").insertAdjacentHTML("beforebegin", '<div id="ex-dt"></div>' +
    '<div class="q-actions dt-mach" id="ex-mach"><button type="button" class="btn primary sm" data-m="next" data-k="exnext">Next column</button><button type="button" class="btn ghost sm" data-m="all" data-k="exall">Fill all</button><button type="button" class="btn ghost sm" data-m="clear" data-k="exclear">Clear</button></div>' +
    '<p class="tiny muted dg-lab">Difference graph: the dots are the <i>y</i>-values; each row of bars is a difference column.</p>');
  L.ctrl.innerHTML = '<div id="ex-src"></div>' +
    '<div id="ex-build"><div class="ctl-row"><span class="ctl-lab">Degree</span><span class="chips" role="group" aria-label="Degree" id="ex-deg"></span></div><p class="ex-form" id="ex-form"></p><div id="ex-sl"></div></div>' +
    '<div id="ex-mys" hidden><div class="chips" role="group" aria-label="Mystery tables" id="ex-mys-ch" style="margin-top:12px"></div><p class="tiny muted">Mystery tables use <span class="m"><i>x</i></span> = 0, 1, 2, ….</p></div>' +
    '<div id="ex-xv"><div class="ctl-row"><span class="ctl-lab"><span class="m"><i>x</i></span>-values start at</span><span class="chips" role="group" aria-label="x-values start at" id="ex-start"></span></div><div id="ex-step"></div></div>' +
    '<div class="ctl-row"><span class="ctl-lab">Rows</span><span class="chips" role="group" aria-label="Rows" id="ex-rows"></span></div>';
  var dt = DiffTable($("#ex-dt"), { tags:true, stopAtConst:true, key:"ex", aria:"Difference table machine",
    caption:function(){ return "Difference table for " + what(); },
    onCol:function(){ S.shown = dt.shown(); api.save(); paintRead(); plot.render(); } });
  var plot = new MV.Plot(L.canvas, { xmin:0, xmax:1, ymin:0, ymax:1 });
  plot.render = function(){ var d = data(); drawDG(plot, dt.cols(), dt.shown(), Math.min(4, d.ys.length - 1), firstConst(dt.cols(), dt.shown()), what()); };
  function what(){ return S.mode === "build" ? MV.plain(polyM(coefs())) : "the mystery table " + mys().name; }

  var srcSeg = MV.seg($("#ex-src"), { label:"Source:", value:S.mode, options:[{ id:"build", t:"Build a polynomial" }, { id:"mystery", t:"Mystery tables" }],
    onChange:function(v){ S.mode = v; S.shown = 0; update(true); } });
  var stepSeg = MV.seg($("#ex-step"), { label:"Step:", value:String(S.step), options:[{ id:"1", t:"1 apart" }, { id:"2", t:"2 apart" }],
    onChange:function(v){ S.step = +v; update(true); } });
  var sl = MV.sliders($("#ex-sl"), [
    { id:"a", label:'<span class="m"><i>a</i></span>, the leading coefficient', min:-3, max:3, step:0.5, value:S.a, skip:[0] },
    { id:"b", label:"b", min:-10, max:10, step:0.5, value:S.co[0] },
    { id:"c", label:"c", min:-10, max:10, step:0.5, value:S.co[1] },
    { id:"d", label:"d", min:-10, max:10, step:0.5, value:S.co[2] },
    { id:"e", label:"e", min:-10, max:10, step:0.5, value:S.co[3] }
  ], function(id, v){ if (id === "a") { S.a = v; aIn.value = v; } else S.co[LET.indexOf(id) - 1] = v; update(true); });
  inkSliders($("#ex-sl"));
  $("#sl-a").closest("label").insertAdjacentHTML("afterend", '<div class="ex-atype"><label for="ex-a-in">or type <span class="m"><i>a</i></span>:</label><input id="ex-a-in" type="number" step="0.5" min="-50" max="50" autocomplete="off"></div>');
  var aIn = $("#ex-a-in"); aIn.value = S.a;
  aIn.addEventListener("input", function(){
    var r = MV.parseNum(aIn.value); if (!r || r.length !== 1 || same(r[0], 0) || Math.abs(r[0]) > 50) return;
    S.a = clean(r[0]); sl.set("a", S.a); update(true);
  });
  L.ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.deg) { S.deg = +b.dataset.deg; update(true); }
    else if (b.dataset.mys) { S.mys = b.dataset.mys; S.shown = 0; update(true); }
    else if (b.dataset.xs != null) { S.start = +b.dataset.xs; update(true); }
    else if (b.dataset.rows) { S.rows = +b.dataset.rows; update(true); }
  });
  function afterRun(){ S.shown = dt.shown(); api.save(); paintCtl(); paintRead(); plot.render(); MV.changed(); }
  $("#ex-mach").addEventListener("click", function(e){
    var b = e.target.closest("[data-m]"); if (!b || b.disabled) return;
    MV.banner("", "");
    if (b.dataset.m === "clear") { S.shown = 0; update(); return; }
    dt.fillTo(b.dataset.m === "next" ? S.shown + 1 : 4, afterRun);
    paintCtl();
  });

  function paintCtl(){
    var build = S.mode === "build";
    $("#ex-build").hidden = !build; $("#ex-xv").hidden = !build; $("#ex-mys").hidden = build;
    MV.keepFocus($("#ex-deg"), function(){ $("#ex-deg").innerHTML = chipsHTML([1, 2, 3, 4].map(function(v){ return { v:v, t:String(v) }; }), "deg", S.deg, "exd"); });
    MV.keepFocus($("#ex-mys-ch"), function(){ $("#ex-mys-ch").innerHTML = chipsHTML(MYS.map(function(m){ return { v:m.id, t:m.name }; }), "mys", S.mys, "exm"); });
    MV.keepFocus($("#ex-start"), function(){ $("#ex-start").innerHTML = chipsHTML([-2, 0, 1].map(function(v){ return { v:v, t:num(v) }; }), "xs", S.start, "exs"); });
    MV.keepFocus($("#ex-rows"), function(){ $("#ex-rows").innerHTML = chipsHTML([5, 6, 7, 8].map(function(v){ return { v:v, t:String(v) }; }), "rows", S.rows, "exr"); });
    $("#ex-form").innerHTML = "The function is " + formM(S.deg) + ".";
    for (var i = 1; i <= 4; i++) {
      var p = S.deg - i, id = LET[i];
      showSlider(id, i <= S.deg);
      if (i <= S.deg) setSliderLabel(id, '<span class="m"><i>' + id + "</i></span>, " + (p === 0 ? "the constant term" : "the coefficient of " + MV.m(p === 1 ? "x" : "x^" + p)));
    }
    var busy = dt.busy(), mx = dt.maxCols(), fc = firstConst(dt.cols(), S.shown), more = S.shown < mx && !fc;
    $('#ex-mach [data-m="next"]').disabled = busy || !more;
    $('#ex-mach [data-m="all"]').disabled = busy || !more;
    $('#ex-mach [data-m="clear"]').disabled = busy || !S.shown;
  }
  function leadHTML(Dv, n, h){
    var f = fact(n);
    if (h === 1) return MV.m("a") + " = " + num(Dv) + " ÷ " + n + "! = " + num(Dv) + " ÷ " + f + " = " + aHTML(Dv / f);
    var M = Math.pow(h, n);
    return num(Dv) + " ÷ " + n + "! = " + aHTML(Dv / f) + " would be wrong here: the differences are " + MV.m(h + "^" + n) + " = " + M + " times bigger. " +
      MV.m("a") + " = " + num(Dv) + " ÷ (" + n + "! × " + M + ") = " + aHTML(Dv / f / M) + ".";
  }
  function paintRead(){
    var d = data(), cols = dt.cols(), sh = dt.shown(), N = d.ys.length, mx = dt.maxCols(), fc = firstConst(cols, sh), full = sh >= mx, build = S.mode === "build", m = mys();
    var step = build ? S.step : 1, rows = [];
    L.cap.innerHTML = build ? polyM(coefs()) : "Mystery table: " + m.name;
    rows.push(["Function", build ? polyM(coefs()) : "Mystery table: " + m.name]);
    rows.push([MV.m("x") + "-values", num(d.xs[0]) + " to " + num(d.xs[N - 1]) + ", " + step + " apart" + (step === 2 ? ": the " + MV.m("n!") + " rule needs 1 apart" : "")]);
    var short = sh && cols[sh] && cols[sh].length < 2 && !fc;
    rows.push(["First constant column", fc ? ORD[fc] + " differences, all " + num(cols[fc][0]) : (full ? "None in these rows" : "None yet") + (short ? ' <span class="tiny muted">(a column needs at least two entries to count)</span>' : "")]);
    rows.push(["Degree", fc ? String(fc) : full ? "Not found in these rows" : "Not found yet"]);
    rows.push(["Leading coefficient", fc ? leadHTML(cols[fc][0], fc, step) : '<span class="muted">Not found yet</span>']);
    if (build) {
      var ok = fc === S.deg && same(cols[fc] ? cols[fc][0] / fact(fc) / Math.pow(step, fc) : NaN, S.a);
      rows.push(["Check", fc ? "The equation’s leading term is " + termM(S.a, S.deg) + "." + (ok ? " ✓" : "") : '<span class="muted">Appears when a constant column is found.</span>']);
    }
    if (!build && m.note && sh >= 1) rows.push(["Pattern note", m.note]);
    L.read.innerHTML = MV.readoutHTML(rows);
  }
  function update(user){
    if (user) MV.banner("", "");
    var d = data(), cols = diffCols(d.ys, 4), sh = Math.min(S.shown, Math.min(4, d.ys.length - 1)), fc = firstConst(cols, sh);
    if (fc) sh = fc;
    S.shown = sh;
    dt.set({ xs:d.xs, ys:d.ys, shown:sh });
    paintCtl(); paintRead(); plot.render(); api.save(); MV.changed();
  }
  function chal(id){
    var a = S.a, deg = S.deg, low = S.co.slice(0, deg);
    if (S.mode !== "build") return { ok:false, msg:"Switch the source to <strong>Build a polynomial</strong>." };
    if (id === "tc1") {
      if (S.step !== 1) return { ok:false, msg:"This challenge uses `x`-values 1 apart. Switch the step back to <strong>1 apart</strong>." };
      if (deg !== 3) return { ok:false, msg:"Constant <strong>third</strong> differences mean degree 3." };
      if (same(a, -3)) return { ok:true };
      if (same(a, -18)) return { ok:false, msg:"Your third differences are −18 × 6 = −108. The constant difference is `a × 3!`, so `a = -18 ÷ 6`." };
      if (same(a, -6)) return { ok:false, msg:"−18 ÷ 3 = −6, but you need to divide by 3! = 6." };
      if (same(a, 3)) return { ok:false, msg:"Right size, wrong sign: the differences are 18." };
      return { ok:false, msg:"Your table’s third differences are " + num(6 * a) + ", not −18." };
    }
    if (id === "tc2") {
      if (S.step !== 1) return { ok:false, msg:"This challenge uses `x`-values 1 apart. Switch the step back to <strong>1 apart</strong>." };
      if (deg !== 4) return { ok:false, msg:"Constant <strong>fourth</strong> differences mean degree 4." };
      if (same(a, 0.5)) return { ok:true };
      if (same(a, 12)) return { ok:false, msg:"Divide by 4! = 24." };
      if (same(a, 3)) return { ok:false, msg:"12 ÷ 4 = 3, but the rule divides by 4! = 4 × 3 × 2 × 1 = 24." };
      if (same(a, 2)) return { ok:false, msg:"That divides by 3! = 6. Fourth differences need 4! = 24." };
      return { ok:false, msg:"Your table’s fourth differences are " + num(24 * a) + ", not 12." };
    }
    if (id === "tc3") {
      if (S.step !== 2) return { ok:false, msg:"Switch the `x`-values to <strong>2 apart</strong> first." };
      if (deg !== 2) return { ok:false, msg:"The challenge asks for `y = ax^2`, so choose degree 2." };
      if (!low.every(function(v){ return same(v, 0); })) return { ok:false, msg:"Set the other terms to 0: the challenge asks for `y = ax^2` with no other terms." };
      if (same(a, 1.5)) return { ok:true };
      if (same(a, 6)) return { ok:false, msg:"6 = 12 ÷ 2! would be right for `x`-values 1 apart. With 2 apart, each second difference is 2² = 4 times bigger." };
      if (same(a, 3)) return { ok:false, msg:"You divided by 4 for the spacing, but not by 2! as well." };
      if (same(a, 12)) return { ok:false, msg:"Divide by 2! and by the spacing factor 2²." };
      return { ok:false, msg:"With `x`-values 2 apart, your second differences are " + num(8 * a) + ", not 12." };
    }
    return { ok:false };
  }
  update();
  return {
    predict:{
      start:function(p){
        var s = p.start;
        S.mode = s.mode; S.rows = s.rows; S.shown = s.shown;
        if (s.mode === "build") { S.deg = s.deg; S.a = s.a; S.co = s.co.slice(); S.start = s.start; S.step = s.step; }
        else S.mys = s.mys;
        srcSeg.set(S.mode); stepSeg.set(String(S.step));
        sl.set("a", S.a); aIn.value = S.a; ["b", "c", "d", "e"].forEach(function(id, i){ sl.set(id, S.co[i]); });
        update();
      },
      run:function(p, done){ dt.fillTo(4, function(){ afterRun(); done(); }); paintCtl(); }
    },
    challenge:function(id){ var r = chal(id); if (r.msg) r.msg = MV.md(r.msg); return r; }
  };
}

// ---------- Part 3: reverse engineering ----------
function part3(host, api){
  var R = api.content.rounds, S = api.S; S.i = S.i || 0; S.rs = S.rs || {};
  host.innerHTML = '<div class="chips" role="group" aria-label="Rounds" id="rv-ch"></div><p class="rv-sub" id="rv-sub"></p><div id="rv-dt"></div><div id="rv-steps"></div>' +
    '<details class="alg" id="rv-alg"><summary>Check it with algebra</summary><p id="rv-alg-in" style="margin:10px 0 0"></p></details>';
  var dt = DiffTable($("#rv-dt"), { tags:false, key:"rv", ms:240, aria:"Round table with difference columns",
    caption:function(){ return R[S.i].name + ": table of values with difference columns"; } });
  var msg = {}, busy = false;
  function rs(){ var r = R[S.i]; return S.rs[r.id] || (S.rs[r.id] = { filled:false, colOk:false, bad:null, colTries:0, aOk:false, aVal:"", aTries:0, peeled:false, m:"", k:"", done:false }); }
  function A(){ return MV.ans(R[S.i]); }
  function K(){ var r = R[S.i]; return Math.min(4, A().deg + 1, r.ys.length - 1); }
  function cells(){
    var r = R[S.i], a = A();
    return r.xs.map(function(x, i){ var t = clean(a.a * Math.pow(x, a.deg)); return { v:num(clean(r.ys[i] - t)), note:num(r.ys[i]) + " − " + par(t) }; });
  }
  function sync(){
    var r = R[S.i], x = rs(), a = A(), marks = {};
    if (x.colOk) marks[a.deg] = "good"; else if (x.bad != null) marks[x.bad] = "bad";
    dt.set({ xs:r.xs, ys:r.ys, shown:x.filled ? K() : 0, glow:x.colOk ? a.deg : 0, hb:{ on:x.filled && !x.colOk && !busy, marks:marks },
      extra:x.peeled ? { head:MV.md(a.head), cells:cells(), n:r.xs.length, cur:-1 } : null });
  }
  function fb(kind, html){ return '<div class="fb ' + kind + '" role="status"><p>' + (kind === "bad" ? "<strong>✗ Not quite.</strong> " : "") + html + "</p></div>"; }
  function paint(){
    var r = R[S.i], x = rs(), a = A(), n = a.deg, f = fact(n), cols = dt.cols();
    MV.keepFocus($("#rv-ch"), function(){
      $("#rv-ch").innerHTML = R.map(function(q, i){ var y = S.rs[q.id]; return '<button type="button" class="chip' + (i === S.i ? " on" : "") + '" data-round="' + i + '" data-k="rvr' + i + '" aria-pressed="' + (i === S.i) + '">' + (y && y.done ? "✓ " : "") + q.name + "</button>"; }).join("");
    });
    $("#rv-sub").innerHTML = MV.m("x = " + num(r.xs[0])) + " to " + num(r.xs[r.xs.length - 1]) + ", 1 apart.";
    var h = '<ol class="rv-steps">';
    h += '<li class="' + (x.filled ? "ok" : "cur") + '"><p><strong>Fill the differences.</strong> The machine does the subtracting.</p>' +
      (x.filled ? '<p class="rv-done">✓ Filled.</p>' : '<div class="q-actions"><button type="button" class="btn primary sm" data-rv="fill" data-k="rvfill"' + (busy ? " disabled" : "") + ">Fill</button></div>") + "</li>";
    if (x.filled) {
      h += '<li class="' + (x.colOk ? "ok" : "cur") + '"><p><strong>(a) Tap the first constant column.</strong> Tap its heading in the table.</p>' +
        (x.colOk ? '<p class="rv-done">✓ The ' + ORDW[n] + " differences are the first constant column, all " + num(cols[n][0]) + ": degree " + n + ".</p>" : (msg.a ? fb("bad", msg.a) : "")) + "</li>";
    }
    if (x.colOk) {
      h += '<li class="' + (x.aOk ? "ok" : "cur") + '"><p><strong>(b) Enter <span class="m"><i>a</i></span>.</strong> A fraction such as −1/2 is fine.</p>';
      if (x.aOk) h += '<p class="rv-done">✓ ' + MV.m("a") + " = " + num(cols[n][0]) + " ÷ " + n + "! = " + num(cols[n][0]) + " ÷ " + f + " = " + fracHTML(a.a) + ".</p>";
      else h += '<div class="inrow rv-in"><label for="rv-a"><span><span class="m"><i>a</i></span> =</span><input id="rv-a" data-v="aVal" data-k="rva" type="text" autocomplete="off" value="' + MV.esc(x.aVal) + '"></label></div>' +
        '<div class="q-actions" style="margin-top:0"><button type="button" class="btn primary sm" data-rv="checka" data-k="rvchka">Check</button></div>' + (msg.b ? fb("bad", msg.b) : "");
      h += "</li>";
    }
    if (x.aOk) {
      h += '<li class="' + (x.done ? "ok" : "cur") + '"><p><strong>(c) Peel off the leading term.</strong> Subtract ' + fracTermHTML(a.a, n) + " from every <i>y</i>-value. What’s left is linear.</p>";
      if (!x.peeled) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-rv="peel" data-k="rvpeel"' + (busy ? " disabled" : "") + ">Peel</button></div>";
      else if (x.done) h += '<p class="rv-done">✓ The leftover column has slope ' + fracHTML(a.m) + " and intercept " + fracHTML(a.k) + ".</p>";
      else h += "<p>Enter the rest of the equation: the leftover column’s slope and intercept.</p>" +
        '<div class="inrow rv-in"><label for="rv-m"><span>slope</span><input id="rv-m" data-v="m" data-k="rvm" type="text" autocomplete="off" value="' + MV.esc(x.m) + '"></label>' +
        '<label for="rv-k"><span>intercept</span><input id="rv-k" data-v="k" data-k="rvk" type="text" autocomplete="off" value="' + MV.esc(x.k) + '"></label></div>' +
        '<div class="q-actions" style="margin-top:0"><button type="button" class="btn primary sm" data-rv="checkc" data-k="rvchkc">Check</button></div>' + (msg.c ? fb("bad", msg.c) : "");
      h += "</li>";
    }
    h += "</ol>";
    if (x.done) h += fb("good", "<strong>✓ Round complete:</strong> " + MV.md(a.eq) + (S.i < R.length - 1 ? " Open the next round when you’re ready." : " That’s every round."));
    MV.keepFocus($("#rv-steps"), function(){ $("#rv-steps").innerHTML = h; });
    $("#rv-alg-in").innerHTML = x.done ? MV.md(a.alg) : MV.md("Finish the round, then this check substitutes an `x`-value into your equation and compares it with the table.");
  }
  function pickCol(k){
    var r = R[S.i], x = rs(), a = A();
    if (k === a.deg) { x.colOk = true; x.bad = null; msg.a = null; return; }
    x.colTries++; x.bad = k;
    if (r.trap && k <= 1) msg.a = r.trapFb;
    else if (k > a.deg) msg.a = "An earlier column is already constant. The degree is the <strong>first</strong> constant column.";
    else msg.a = "Look all the way down this column.";
  }
  function checkA(){
    var x = rs(), a = A(), n = a.deg, f = fact(n), Dv = dt.cols()[n][0], v = MV.parseNum(x.aVal);
    if (!v || v.length !== 1) { msg.b = "Enter a number, such as 3, −2 or −1/2."; return; }
    v = v[0];
    if (same(v, a.a)) { x.aOk = true; msg.b = null; return; }
    x.aTries++;
    if (same(v, Dv)) msg.b = "That’s the constant difference itself. The constant " + ORDW[n] + " difference is " + MV.m("a × " + n + "!") + ", so divide by " + n + "! = " + f + ".";
    else if (same(v, Dv / n)) msg.b = MV.m("n! = n × (n - 1) × … × 1") + ". For degree " + n + " that’s " + f + ", not " + n + ".";
    else if (same(v, -a.a)) msg.b = "Watch the sign: " + MV.m("a") + " has the same sign as the constant difference.";
    else msg.b = "Divide the constant " + ORDW[n] + " difference by " + n + "! = " + f + ".";
  }
  function checkC(){
    var r = R[S.i], x = rs(), a = A(), m = MV.parseNum(x.m), k = MV.parseNum(x.k);
    if (!m || !k || m.length !== 1 || k.length !== 1) { msg.c = "Enter a number in each box, such as 4, −5 or 1/2."; return; }
    m = m[0]; k = k[0];
    if (same(m, a.m) && same(k, a.k)) { x.done = true; msg.c = null; return; }
    var first = clean(r.ys[0] - a.a * Math.pow(r.xs[0], a.deg));
    if (same(m, a.k) && same(k, a.m)) msg.c = "Those are swapped: the slope is the change from one row to the next, and the intercept is the value at " + MV.m("x = 0") + ".";
    else if (same(m, a.m) && r.xs[0] !== 0 && same(k, first)) msg.c = "The intercept is the value at " + MV.m("x = 0") + ", not the value in the first row.";
    else if (!same(m, a.m)) msg.c = "Check the slope: how much does the leftover column change from one row to the next?";
    else msg.c = "Check the intercept: read the leftover column in the row where " + MV.m("x = 0") + ".";
  }
  host.addEventListener("input", function(e){ var v = e.target.dataset && e.target.dataset.v; if (!v) return; rs()[v] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.v) return;
    var b = $(e.target.dataset.v === "aVal" ? '[data-rv="checka"]' : '[data-rv="checkc"]', host); if (b) b.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = rs();
    if (b.dataset.round != null) { S.i = +b.dataset.round; msg = {}; busy = false; api.save(); sync(); paint(); return; }
    if (b.dataset.col != null) { pickCol(+b.dataset.col); api.save(); sync(); paint(); MV.focusFb($("#rv-steps")); return; }
    var act = b.dataset.rv;
    if (act === "fill") {
      busy = true; paint();
      var mine = R[S.i].id;
      dt.fillTo(K(), function(){ busy = false; var y = S.rs[mine]; if (y) y.filled = true; api.save(); sync(); paint(); });
    } else if (act === "checka") { checkA(); api.save(); paint(); MV.focusFb($("#rv-steps")); }
    else if (act === "peel") {
      busy = true; paint();
      var a = A(), id2 = R[S.i].id;
      dt.peel({ head:MV.md(a.head), cells:cells(), n:0 }, function(){ busy = false; var y = S.rs[id2]; if (y) y.peeled = true; api.save(); sync(); paint(); var mi = $("#rv-m"); if (mi) mi.focus({ preventScroll:true }); });
    } else if (act === "checkc") { checkC(); api.save(); paint(); MV.focusFb($("#rv-steps")); }
  });
  sync(); paint();
}

// ---------- Practice 1: scratch difference machine under the sorter ----------
function scratch(){
  var host = $("#act-sort"); if (!host || $("#scr")) return;
  var a = (MV.C.practice.activities || []).filter(function(x){ return x.id === "sort"; })[0]; if (!a) return;
  host.insertAdjacentHTML("afterend", '<details class="alg scr" id="scr"><summary>Scratch difference machine</summary>' +
    '<p class="tiny muted" style="margin:8px 0 10px">Pick any table. The machine only subtracts: you decide which column is constant.</p>' +
    '<div class="ctl-row" style="margin:0 0 10px"><label class="ctl-lab" for="scr-sel">Table</label><select id="scr-sel">' +
    a.items.map(function(it, i){ return '<option value="' + i + '">' + MV.esc(MV.plain(it.t)) + "</option>"; }).join("") + "</select></div>" +
    '<div id="scr-dt"></div><div class="q-actions" id="scr-mach"><button type="button" class="btn primary sm" data-m="next" data-k="scrnext">Next column</button><button type="button" class="btn ghost sm" data-m="all" data-k="scrall">Fill all</button><button type="button" class="btn ghost sm" data-m="clear" data-k="scrclear">Clear</button></div></details>');
  var xs = [0, 1, 2, 3, 4, 5], sel = $("#scr-sel");
  var dt = DiffTable($("#scr-dt"), { tags:false, key:"scr", ms:200, aria:"Scratch difference table", caption:function(){ return "Scratch table for y = " + MV.plain(a.items[+sel.value].t); }, onCol:paintBtns });
  function paintBtns(){
    var busy = dt.busy(), more = dt.shown() < dt.maxCols();
    $('#scr-mach [data-m="next"]').disabled = busy || !more; $('#scr-mach [data-m="all"]').disabled = busy || !more; $('#scr-mach [data-m="clear"]').disabled = busy || !dt.shown();
  }
  function load(){ dt.set({ xs:xs, ys:a.items[+sel.value].ys, shown:0, glow:0 }); paintBtns(); }
  sel.addEventListener("change", load);
  $("#scr-mach").addEventListener("click", function(e){
    var b = e.target.closest("[data-m]"); if (!b || b.disabled) return;
    if (b.dataset.m === "clear") { dt.set({ shown:0 }); paintBtns(); return; }
    dt.fillTo(b.dataset.m === "next" ? dt.shown() + 1 : 4, paintBtns); paintBtns();
  });
  load();
}

// ---------- Performance task: design to a difference spec ----------
var task = (function(){
  var api, dt, plot;
  function read(){
    var s = api ? api.S : {}, deg = s.deg || 2, a = s.a == null ? 1 : s.a, b = s.b || 0, c = s.c || 0, d = s.d || 0;
    var co = deg === 1 ? [a, b] : deg === 2 ? [a, b, c] : [a, b, c, d];
    var xs = [0, 1, 2, 3, 4, 5], ys = xs.map(function(x){ return evalP(co, x); }), cols = diffCols(ys, 2);
    return { deg:deg, co:co, xs:xs, ys:ys, d1:cols[1], d2:cols[2] };
  }
  function coFromKey(k){ return k.split("|")[1].split(",").map(Number); }
  function draw(){
    var d = read(), lo = Math.min(-25, Math.min.apply(null, d.ys) - 6), hi = Math.max(45, Math.max.apply(null, d.ys) + 6);
    plot.draw({ view:{ xmin:-0.6, xmax:5.6, ymin:lo, ymax:hi }, xTicks:{ step:1 },
      segments:[{ x1:-0.6, y1:40, x2:5.6, y2:40, color:css("--ink-2"), width:1.5, dash:[8, 6] }, { x1:-0.6, y1:-20, x2:5.6, y2:-20, color:css("--ink-2"), width:1.5, dash:[8, 6] }],
      labels:[{ x:5.5, y:40, text:"y = 40", color:css("--ink-2"), align:"right", dy:-10 }, { x:5.5, y:-20, text:"y = −20", color:css("--ink-2"), align:"right", dy:10 }],
      data:d.ys.map(function(y, i){ return { x:i, y:y, r:5, color:css("--pen") }; }),
      describe:"Dots for your table: " + d.ys.map(function(y, i){ return "(" + i + ", " + MV.plain(num(y)) + ")"; }).join(", ") + ". Dashed guide lines at y = 40 and y = −20." });
  }
  function upd(){
    var S = api.S, d = read();
    MV.keepFocus($("#tk-deg"), function(){ $("#tk-deg").innerHTML = chipsHTML([1, 2, 3].map(function(v){ return { v:v, t:String(v) }; }), "tdeg", S.deg, "tkd"); });
    $("#tk-form").innerHTML = "The function is " + formM(S.deg) + ".";
    showSlider("tc", S.deg >= 2); showSlider("td", S.deg === 3);
    var labs = { 1:{ tb:"the constant term" }, 2:{ tb:"the coefficient of " + MV.m("x"), tc:"the constant term" }, 3:{ tb:"the coefficient of " + MV.m("x^2"), tc:"the coefficient of " + MV.m("x"), td:"the constant term" } }[S.deg];
    setSliderLabel("ta", '<span class="m"><i>a</i></span>, the leading coefficient');
    Object.keys(labs).forEach(function(id){ setSliderLabel(id, '<span class="m"><i>' + id.slice(1) + "</i></span>, " + labs[id]); });
    $("#tk-eq").innerHTML = polyM(d.co);
    dt.set({ xs:d.xs, ys:d.ys, shown:2 });
    plot.render();
    api.update();
  }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S;
      if (S.deg == null) { S.deg = 2; S.a = 1; S.b = 0; S.c = 0; S.d = 0; }
      inp.innerHTML = '<div class="ctl-row" style="margin-top:0"><span class="ctl-lab">Degree</span><span class="chips" role="group" aria-label="Degree" id="tk-deg"></span></div><p class="ex-form" id="tk-form"></p><div id="tk-sl"></div>';
      var tsl = MV.sliders($("#tk-sl"), [
        { id:"ta", label:"a", min:-5, max:5, step:0.5, value:S.a, skip:[0] },
        { id:"tb", label:"b", min:-30, max:30, step:1, value:S.b },
        { id:"tc", label:"c", min:-10, max:10, step:1, value:S.c },
        { id:"td", label:"d", min:-10, max:10, step:1, value:S.d }
      ], function(id, v){ S[id.slice(1)] = v; if (id === "ta") tIn.value = v; a.save(); upd(); });
      inkSliders($("#tk-sl"));
      $("#sl-ta").closest("label").insertAdjacentHTML("afterend", '<div class="ex-atype"><label for="tk-a-in">or type <span class="m"><i>a</i></span>:</label><input id="tk-a-in" type="number" step="0.5" min="-50" max="50" autocomplete="off"></div>');
      var tIn = $("#tk-a-in"); tIn.value = S.a;
      tIn.addEventListener("input", function(){
        var r = MV.parseNum(tIn.value); if (!r || r.length !== 1 || same(r[0], 0) || Math.abs(r[0]) > 50) return;
        S.a = clean(r[0]); tsl.set("ta", S.a); a.save(); upd();
      });
      pv.innerHTML = '<p class="eq-cap" id="tk-eq" aria-live="polite"></p><div id="tk-dt"></div><canvas class="plot" id="tk-plot" role="img" aria-label="Dots for your table"></canvas>';
      dt = DiffTable($("#tk-dt"), { tags:true, noStep:true, max:2, key:"tk", aria:"Your table with first and second differences", caption:function(){ return "Your table for x = 0 to 5 with first and second differences"; } });
      plot = new MV.Plot($("#tk-plot"), { xmin:-0.6, xmax:5.6, ymin:-25, ymax:45 }); plot.render = draw;
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-tdeg]"); if (!b) return; S.deg = +b.dataset.tdeg; a.save(); upd(); });
      upd();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      return [d.d2.every(function(v){ return same(v, 6); }), same(d.ys[0], 2),
        Math.min.apply(null, d.d1) < 0 && Math.max.apply(null, d.d1) > 0,
        d.ys.every(function(y){ return y >= -20 && y <= 40; })];
    },
    tips:function(d, c){
      var out = [];
      if (!c[0]) out.push("Your second differences are " + list(d.d2) + ". Constant second differences mean degree 2, and the constant is " + MV.m("a × 2!") + ".");
      if (!c[1]) out.push(MV.m("y(0)") + " is the constant term.");
      if (!c[2]) out.push("Your first differences are " + list(d.d1) + ". With " + MV.m("a = 3") + " they are 3 + " + MV.m("b") + ", 9 + " + MV.m("b") + ", 15 + " + MV.m("b") + ", 21 + " + MV.m("b") + ", 27 + " + MV.m("b") + ". Choose " + MV.m("b") + " so the first is negative and the last is positive.");
      if (!c[3]) {
        var worst = 0, wx = 0;
        d.ys.forEach(function(y, i){ var over = y > 40 ? y - 40 : y < -20 ? -20 - y : 0; if (over > worst) { worst = over; wx = i; } });
        out.push("Your table reaches " + num(d.ys[wx]) + " at " + MV.m("x = " + wx) + ". Keep every value between −20 and 40.");
      }
      return out;
    },
    key:function(d){ return d.deg + "|" + d.co.join(","); },
    label:function(k){ return polyM(coFromKey(k)); },
    text:function(k){ return MV.plain(polyM(coFromKey(k))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (v === "practice") scratch(); }
});
})();
