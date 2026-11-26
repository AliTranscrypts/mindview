// MHF4U 15 Polynomial Inequalities: hero, N11 sign chart (build / display / practice modes) with the sign scanner (Explore),
// Above or below? with the flatten morph (Part 3), "Solve with a sign chart" and "Work backwards" practice, the
// "Design the solution set" task and the small question graphs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, iv = MV.iv, m = MV.m;
var PHONE = window.matchMedia ? window.matchMedia("(max-width:560px)") : { matches:false };
function eqMode(){ return !!PHONE.matches; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function clean(v){ v = Math.round(v * 1e9) / 1e9; return v === 0 ? 0 : v; }
function nm(v){ return num(clean(v), 4); }
function list(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function sgnCh(s){ return s > 0 ? "+" : s < 0 ? "−" : "0"; }
function sgnWord(s){ return s > 0 ? "positive" : s < 0 ? "negative" : "zero"; }
// exact decimal for the readout: more than 4 decimal places → rounded to 3 with ≈
function exact(v){ var r = Math.round(v * 1e8) / 1e8, d = (String(Math.abs(r)).split(".")[1] || "").length; return d > 4 ? { eq:" ≈ ", s:num(r, 3) } : { eq:" = ", s:num(r, 4) }; }

// ---------- polynomial helpers on factor lists {r, k, neg} (neg: the factor is written (r − x)) ----------
var P = {
  z:function(arr){ return arr.map(function(q){ return { r:q[0], k:q[1], neg:!!q[2] }; }).sort(function(a, b){ return a.r - b.r; }); },
  deg:function(zs){ return zs.reduce(function(s, z){ return s + z.k; }, 0); },
  f:function(zs, a){ return function(x){ var y = a; for (var i = 0; i < zs.length; i++) y *= Math.pow(zs[i].neg ? zs[i].r - x : x - zs[i].r, zs[i].k); return y; }; },
  fval:function(z, x){ return Math.pow(z.neg ? z.r - x : x - z.r, z.k); },
  fsign:function(z, x){ var t = z.neg ? z.r - x : x - z.r, s = t > 0 ? 1 : t < 0 ? -1 : 0; return z.k % 2 === 0 ? (s ? 1 : 0) : s; },
  sign:function(zs, a, x){ var s = a > 0 ? 1 : a < 0 ? -1 : 0; zs.forEach(function(z){ s *= P.fsign(z, x); }); return s; },
  inner:function(z){ return z.neg ? nm(z.r) + " - x" : z.r === 0 ? "x" : "x " + (z.r < 0 ? "+ " : "- ") + nm(Math.abs(z.r)); },
  fM:function(z, noExp){ var b = (!z.neg && z.r === 0) ? "x" : "(" + P.inner(z) + ")"; return (!noExp && z.k > 1) ? b + "^" + z.k : b; },
  aM:function(a, col){ var s = a === 1 ? "" : a === -1 ? "-" : nm(a); return s && col ? "@a{" + s + "}" : s; },
  polyM:function(zs, a, col){ if (!zs.length) return col ? "@a{" + nm(a) + "}" : nm(a); return P.aM(a, col) + zs.map(function(z){ return P.fM(z); }).join(""); },
  cols:function(zs){
    var b = [-Infinity].concat(zs.map(function(z){ return z.r; }), [Infinity]), out = [];
    for (var i = 0; i + 1 < b.length; i++) { var lo = b[i], hi = b[i + 1]; out.push({ a:lo, b:hi, mid:lo === -Infinity ? (hi === Infinity ? 0 : hi - 1) : hi === Infinity ? lo + 1 : (lo + hi) / 2 }); }
    return out;
  },
  want:function(sym){ return sym === ">" || sym === "≥" ? 1 : -1; },
  incl:function(sym){ return sym === "≥" || sym === "≤"; },
  sat:function(s, sym){ return sym === ">" ? s > 0 : sym === "≥" ? s >= 0 : sym === "<" ? s < 0 : s <= 0; },
  flip:function(sym){ return { ">":"<", "<":">", "≥":"≤", "≤":"≥" }[sym]; },
  // exact solution set from zeros, orders, sign of a and the symbol
  solve:function(zs, a, sym){
    var out = [], w = P.want(sym);
    P.cols(zs).forEach(function(c){ if (P.sign(zs, a, c.mid) === w) out.push({ a:c.a, b:c.b, aIn:false, bIn:false }); });
    if (P.incl(sym)) zs.forEach(function(z){ out.push({ a:z.r, b:z.r, aIn:true, bIn:true }); });
    if (!zs.length && P.sat(a > 0 ? 1 : -1, sym)) out = [{ a:-Infinity, b:Infinity }];
    return iv.norm(out);
  },
  // y-window: the largest turning value between the outer zeros fills about 70% of the half-height
  fit:function(zs, a){
    var f = P.f(zs, a), M = 0, i, j;
    if (zs.length >= 2) for (i = 0; i + 1 < zs.length; i++) for (j = 1; j < 40; j++) M = Math.max(M, Math.abs(f(zs[i].r + (zs[i + 1].r - zs[i].r) * j / 40)));
    else if (zs.length === 1) for (j = -20; j <= 20; j++) M = Math.max(M, Math.abs(f(zs[0].r + j * 0.075)));
    else M = Math.abs(a);
    if (!(M > 1e-9)) M = 1;
    return M / 0.7;
  },
  describe:function(zs, a, sol){
    var beh = function(k){ return k % 2 === 0 ? "touching" : k === 1 ? "crossing" : "crossing and flattening"; };
    var pos = sol.filter(function(p){ return p.a !== p.b; });
    return "Graph of y = " + MV.plain(m(P.polyM(zs, a))) + ". " + (zs.length ? "Zeros " + list(zs.map(function(z){ return nm(z.r) + " (" + beh(z.k) + ")"; })) + "." : "No zeros.");
  }
};

// @component N11 signChart — sign chart: one row per factor ((x − r)^k or (r − x)), an a row when a ≠ 1 (violet), a product row;
//   columns are the intervals between zeros, drawn to the graph's x-scale (desktop) or as equal columns that scroll (phones).
//   "0" badges where a boundary meets a factor that is zero there; signs in bold ink, never red/green. Modes: display, build
//   (editable cells, bad-cell rings, test-value row) and scan (column outline, scanner line, flip animation, "flips twice" note).
//   var ch = signChart(host); ch.render({ zs, a, xmin, xmax, equal, showFactors, split, cells, edit, blank, bad, hideCols,
//   tests, scanX, vlines, onCell(key) });  ch.scan(x)  ch.flip([keys], twice)  ch.note(rowId, x, text)  ch.col(x)
function signChart(host){
  var mo = null, key = "", pos = null, bnd = [];
  host.classList.add("sc-ch");
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-cell]"); if (b && mo && mo.onCell) mo.onCell(b.dataset.cell); });
  function posFn(o){
    var zs = o.zs, n = zs.length, b = [o.xmin].concat(zs.map(function(z){ return z.r; }), [o.xmax]);
    bnd = b;
    if (!o.equal) return function(x){ return Math.max(0, Math.min(1, (x - o.xmin) / (o.xmax - o.xmin))); };
    return function(x){ if (x <= o.xmin) return 0; if (x >= o.xmax) return 1; for (var c = 0; c <= n; c++) if (x <= b[c + 1]) return (c + (x - b[c]) / Math.max(1e-9, b[c + 1] - b[c])) / (n + 1); return 1; };
  }
  function col(x){ if (!mo) return null; var c = 0; for (var i = 0; i < mo.zs.length; i++) { if (x === mo.zs[i].r) return null; if (x > mo.zs[i].r) c = i + 1; } return c; }
  function rows(o){
    var R = [];
    if (o.a !== 1) R.push({ id:"a", kind:"a", label:m(o.aCol ? "@a{" + nm(o.a) + "}" : nm(o.a)) });
    if (o.showFactors !== false) o.zs.forEach(function(z, j){
      if (o.split === z.r && z.k === 2) {
        var l = { r:z.r, k:1, neg:z.neg };
        R.push({ id:"f" + j + "s1", kind:"f", z:l, j:j, label:m(P.fM(l)) }, { id:"f" + j + "s2", kind:"f", z:l, j:j, label:m(P.fM(l)) });
      } else R.push({ id:"f" + j, kind:"f", z:z, j:j, label:m(P.fM(z)) });
    });
    R.push({ id:"p", kind:"p", label:m("P(x)") });
    return R;
  }
  function render(o){
    var k2 = JSON.stringify(o, function(k, v){ return k === "scanX" || k === "onCell" ? undefined : v === Infinity ? "inf" : v === -Infinity ? "-inf" : v; });
    mo = o; host.classList.add("sc-ch");
    if (k2 === key) { scan(o.scanX); return; }
    key = k2; pos = posFn(o);
    var zs = o.zs, n = zs.length, cs = P.cols(zs), R = rows(o), pc = function(x){ return (pos(x) * 100).toFixed(3) + "%"; };
    var colBox = function(c){ var L = pos(bnd[c]), W = pos(bnd[c + 1]) - L; return "left:calc(" + (L * 100).toFixed(3) + "% + 3px);width:calc(" + (W * 100).toFixed(3) + "% - 6px)"; };
    var labs = '<div class="sc-l sc-hd" aria-hidden="true"></div>', body = "";
    body += '<div class="sc-r sc-hd" aria-hidden="true">' + zs.map(function(z){ return '<span class="sc-hv" style="left:' + pc(z.r) + '">' + nm(z.r) + "</span>"; }).join("") + "</div>";
    if (o.tests) {
      labs += '<div class="sc-l sc-tl">test ' + m("x") + "</div>";
      body += '<div class="sc-r sc-tr">' + cs.map(function(c, i){ return '<span class="sc-c sc-t" style="' + colBox(i) + '">' + nm(o.tests[i]) + "</span>"; }).join("") + "</div>";
    }
    R.forEach(function(r){
      labs += '<div class="sc-l' + (r.kind === "p" ? " sc-pl" : "") + '">' + r.label + "</div>";
      var h = '<div class="sc-r' + (r.kind === "p" ? " sc-p" : "") + '" data-row="' + r.id + '">';
      cs.forEach(function(c, i){
        var s = r.kind === "a" ? (o.a > 0 ? 1 : -1) : r.kind === "f" ? P.fsign(r.z, c.mid) : P.sign(zs, o.a, c.mid), k = r.id + "|" + i, txt;
        var editable = o.edit && r.kind !== "a";
        if (editable) txt = o.cells && o.cells[k] ? o.cells[k] : "";
        else if (o.blank && r.kind !== "a") txt = "";
        else if (r.kind === "p" && o.hideCols && o.hideCols.indexOf(i) >= 0) txt = "?";
        else txt = sgnCh(s);
        var where = iv.text([{ a:c.a, b:c.b }]), rl = MV.plain(r.label) + " on " + where;
        if (editable) h += '<button type="button" class="sc-c' + (o.bad && o.bad[k] ? " bad" : "") + '" data-cell="' + k + '" data-k="sc' + k + '" style="' + colBox(i) + '" aria-label="' + MV.esc(rl + ": " + (txt ? (txt === "+" ? "plus" : "minus") : "not set") + ". Press to change.") + '">' + (txt === "-" ? "−" : txt || "?") + "</button>";
        else h += '<span class="sc-c' + (o.bad && o.bad[k] ? " bad" : "") + '" data-key="' + k + '" style="' + colBox(i) + '" aria-label="' + MV.esc(rl + ": " + (txt === "+" ? "plus" : txt === "−" ? "minus" : txt === "?" ? "hidden" : txt || "blank")) + '">' + txt + "</span>";
      });
      if (r.kind === "f") h += '<span class="sc-z" style="left:' + pc(r.z.r) + '" aria-hidden="true">0</span>';
      if (r.kind === "p" && !o.blank) zs.forEach(function(z){ h += '<span class="sc-z" style="left:' + pc(z.r) + '" aria-hidden="true">0</span>'; });
      body += h + "</div>";
    });
    var over = (o.vlines && !o.equal ? zs.map(function(z){ return '<i class="sc-vl" style="left:' + pc(z.r) + '"></i>'; }).join("") : "") + '<i class="sc-out" hidden></i><i class="sc-sl" hidden></i>';
    host.innerHTML = '<div class="sc-labs">' + labs + '</div><div class="sc-scroll"><div class="sc-body' + (o.equal ? " eq" : "") + '" style="min-width:' + (o.equal ? (n + 1) * 66 + "px" : "0") + '">' + body + over + "</div></div>";
    scan(o.scanX);
  }
  function scan(x){
    var out = host.querySelector(".sc-out"), sl = host.querySelector(".sc-sl"); if (!out || !mo) return;
    if (x == null) { out.hidden = true; sl.hidden = true; return; }
    sl.hidden = false; sl.style.left = (pos(x) * 100).toFixed(3) + "%";
    var c = col(x);
    if (c == null) { out.hidden = true; return; }
    out.hidden = false; out.style.left = (pos(bnd[c]) * 100).toFixed(3) + "%"; out.style.width = ((pos(bnd[c + 1]) - pos(bnd[c])) * 100).toFixed(3) + "%";
    if (mo.equal) { var sc = host.querySelector(".sc-scroll"), bw = host.querySelector(".sc-body").offsetWidth, L = pos(bnd[c]) * bw; if (sc && (L < sc.scrollLeft || L + 60 > sc.scrollLeft + sc.clientWidth)) sc.scrollLeft = Math.max(0, L - 20); }
  }
  return {
    render:render, scan:scan, col:col,
    reset:function(){ key = ""; mo = null; host.classList.remove("sc-ch"); },
    flip:function(keys, twice){ if (MV.reduceMotion) return; keys.forEach(function(k){ var el = host.querySelector('[data-key="' + k + '"]'); if (!el) return; el.classList.remove("flip", "flip2"); void el.offsetWidth; el.classList.add(twice ? "flip2" : "flip"); }); },
    note:function(rowId, x, text){
      var row = host.querySelector('[data-row="' + rowId + '"]'); if (!row || !pos) return;
      var el = document.createElement("span"); el.className = "sc-note"; el.textContent = text; el.style.left = (pos(x) * 100).toFixed(2) + "%"; row.appendChild(el);
      MV.wait(1500, function(){ el.remove(); });
    }
  };
}

// ---------- the three aligned layers: graph, sign chart, number line ----------
function layersHTML(id, opts){
  opts = opts || {};
  return '<div class="sc-lay" id="' + id + '">' +
    '<div class="sc-lrow sc-grow"><span class="sc-gut" aria-hidden="true"></span><div class="plot-wrap"><canvas class="plot" data-l="g" role="img" aria-label="Graph"></canvas></div></div>' +
    '<div class="sc-chwrap" data-l="c"></div>' +
    '<div class="sc-lrow"><span class="sc-gut">Solution</span><div class="plot-wrap"><canvas class="plot sc-nl" data-l="n" role="img" aria-label="Number line"></canvas></div></div>' +
    (opts.scan ? '<div class="sc-lrow sc-scanrow"><span class="sc-gut" aria-hidden="true"></span><label class="slider sc-scan"><span class="slider-top"><span>Scanner</span><output data-l="so"></output></span><input type="range" min="-6" max="6" step="0.1" data-l="s" aria-label="Scanner position"></label></div>' : "") +
    "</div>";
}
function layers(root){
  var q = function(s){ return root.querySelector('[data-l="' + s + '"]'); };
  var gp = new MV.Plot(q("g"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }), np = new MV.Plot(q("n"), { xmin:-6, xmax:6, ymin:-1, ymax:1 });
  var chart = signChart(q("c")), sc = { g:null, n:null, c:null };
  gp.render = function(){ if (sc.g) drawGraph(gp, sc.g); };
  np.render = function(){ if (sc.n) drawNL(np, sc.n); };
  var api = {
    root:root, gp:gp, np:np, chart:chart, q:q,
    set:function(g, n, c){
      sc.g = g; sc.n = n; sc.c = c;
      root.querySelector(".sc-grow").hidden = !g || g.hidden;
      gp.render(); np.render();
      if (c && c.zs) { c.equal = eqMode(); chart.render(c); }
      else { chart.reset(); q("c").innerHTML = c && c.empty ? '<p class="sc-empty">' + c.empty + "</p>" : ""; }
    },
    redraw:function(){ api.set(sc.g, sc.n, sc.c); }
  };
  if (PHONE.addEventListener) PHONE.addEventListener("change", function(){ api.redraw(); });
  return api;
}
// graph layer: {view, f, curveTo, shade:[{x0, x1, where}], zdots:[{x, label}], tests:[x], testPts:[{x, y}], scanX, vlines:[x], touch, describe}
function drawGraph(p, s){
  var ink = css("--ink"), ink2 = css("--ink-2"), v = s.view, curves = [], segs = [], pts = [], regions = [];
  (s.shade || []).forEach(function(r){ regions.push({ f:s.f, x0:r.x0, x1:r.x1, where:r.where }); });
  if (s.f) curves.push({ f:s.f, color:css("--pen"), width:3.2, arrows:s.curveTo == null, domain:s.curveTo != null ? [v.xmin, s.curveTo] : null });
  if (!eqMode()) (s.vlines || []).forEach(function(x){ segs.push({ x1:x, y1:v.ymin, x2:x, y2:v.ymax, color:ink2, width:1.3, dash:[6, 5] }); });
  if (s.scanX != null) segs.push({ x1:s.scanX, y1:v.ymin, x2:s.scanX, y2:v.ymax, color:ink, width:2 });
  (s.zdots || []).forEach(function(z, i){ pts.push({ x:z.x, y:0, r:5.5, color:ink, label:z.label, below:i % 2 === 0 }); });
  (s.tests || []).forEach(function(t){ pts.push({ x:t, y:0, r:4, color:ink2 }); });
  (s.testPts || []).forEach(function(t){ pts.push({ x:t.x, y:t.y, r:4.5, color:ink2, label:t.label }); });
  if (s.touch) pts.push({ x:s.touch.x, y:s.touch.y, r:6, ring:true, color:ink });
  p.draw({ view:v, regions:regions, curves:curves, segments:segs, points:pts, describe:s.describe || "Graph" });
}
// number-line layer on the graph's x-scale: {xmin, xmax, pieces, marks:[x], cursor, tests:[x], scanX, vlines:[x], targets, describe}
function drawNL(p, s){
  p.draw({ view:{ xmin:s.xmin, xmax:s.xmax, ymin:-1, ymax:1 }, grid:false, axes:false, describe:s.describe || "Number line", after:function(ctx, pl){
    var W = pl.W, H = pl.H, cy = Math.round(H * 0.4) + 0.5, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), hi = css("--hi"), X = function(x){ return x === -Infinity ? 0 : x === Infinity ? W : pl.X(x); };
    if (!eqMode()) (s.vlines || []).forEach(function(x){ ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(X(x), 0); ctx.lineTo(X(x), H); ctx.stroke(); ctx.restore(); });
    if (s.targets) {
      ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
      s.targets.forEach(function(t){
        if (t.pt != null) { ctx.beginPath(); ctx.arc(X(t.pt), cy, 12, 0, Math.PI * 2); ctx.stroke(); }
        else { var a = X(t.a), b = X(t.b === Infinity ? s.xmax + 1 : t.b); ctx.strokeRect(a, cy - 17, Math.min(W - 2, b) - a, 34); }
      });
      ctx.restore();
    }
    (s.pieces || []).forEach(function(q){
      var a = X(q.a), b = X(q.b);
      if (q.a !== q.b) { ctx.fillStyle = css("--hi-soft"); ctx.fillRect(a, cy - 11, b - a, 22); ctx.strokeStyle = hi; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a, cy); ctx.lineTo(b, cy); ctx.stroke(); }
    });
    ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(2, cy); ctx.lineTo(W - 2, cy); ctx.stroke();
    var step = (s.xmax - s.xmin) / W > 1 / 30 ? 2 : 1;
    ctx.font = "12px " + pl.fontUI; ctx.fillStyle = ink2; ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var t = Math.ceil(s.xmin); t <= s.xmax; t++) { var px = Math.round(X(t)) + 0.5; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, cy - 5); ctx.lineTo(px, cy + 5); ctx.stroke(); if (t % step === 0 && px > 6 && px < W - 6) ctx.fillText(num(t), px, cy + 14); }
    (s.pieces || []).forEach(function(q){
      if (q.a === -Infinity) pl.head([pl.xOf(16), 0], [pl.xOf(1), 0], ink, 12);
      if (q.b === Infinity) pl.head([pl.xOf(W - 16), 0], [pl.xOf(W - 1), 0], ink, 12);
      var dot = function(x, closed){ ctx.beginPath(); ctx.arc(X(x), cy, 6.5, 0, Math.PI * 2); if (closed) { ctx.fillStyle = ink; ctx.fill(); } else { ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = ink; ctx.stroke(); } };
      if (isFinite(q.a)) dot(q.a, q.aIn);
      if (isFinite(q.b) && q.b !== q.a) dot(q.b, q.bIn);
    });
    (s.zticks || []).forEach(function(x){ ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(x), cy - 10); ctx.lineTo(X(x), cy + 10); ctx.stroke(); });
    (s.tests || []).forEach(function(x){ ctx.fillStyle = ink2; ctx.beginPath(); ctx.moveTo(X(x), cy - 7); ctx.lineTo(X(x) + 5, cy - 14); ctx.lineTo(X(x) - 5, cy - 14); ctx.closePath(); ctx.fill(); });
    (s.marks || []).forEach(function(x){ ctx.beginPath(); ctx.arc(X(x), cy, 7, 0, Math.PI * 2); ctx.fillStyle = pen; ctx.fill(); });
    if (s.cursor != null) { ctx.beginPath(); ctx.arc(X(s.cursor), cy, 12, 0, Math.PI * 2); ctx.lineWidth = 2.5; ctx.strokeStyle = hi; ctx.stroke(); }
    if (s.scanX != null) {
      var sx = X(s.scanX); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(sx, cy - 4); ctx.lineTo(sx + 8, cy - 16); ctx.lineTo(sx - 8, cy - 16); ctx.closePath(); ctx.fill();
    }
  } });
}

// @component N11 signChart.build — guided sign-chart build: (Factor →) Zeros → Test values → Signs → Solution, each with
//   Check, named feedback and three hints; drives the layers ("step": the graph shades in step; "reward": the graph
//   appears once the build is right). chartBuild({ item, st, X:{msgs, stageNames, stageHow}, L, panel, mode, save, onSolved })
function chartBuild(o){
  var it = o.item, st = o.st, X = o.X, L = o.L, panel = o.panel, zs = P.z(it.f), a = it.a, sym = it.sym, cs = P.cols(zs);
  var stages = (it.factor ? ["factor"] : []).concat(["zeros", "tests", "signs", "sol"]);
  var fopts = it.factor ? MV.shuffle(it.factor.options.map(function(op, i){ return { op:op, i:i }; }), it.id + "f") : [];
  var correct = P.solve(zs, a, sym), msg = null, bad = {}, anim = null;
  if (st.stage == null) st.stage = 0;
  st.placed = st.placed || []; if (st.cur == null) st.cur = 0;
  st.tests = st.tests || (it.tests ? it.tests.slice() : cs.map(function(c){ var t = Math.round(c.mid * 2) / 2; return t === c.a || t === c.b ? c.mid : t; }));
  st.cells = st.cells || {}; st.selI = st.selI || []; st.selZ = st.selZ || []; st.hint = st.hint || {}; st.tries = st.tries || {};
  var stg = function(){ return stages[Math.min(st.stage, stages.length - 1)]; };
  var past = function(s){ return st.solved || stages.indexOf(s) < st.stage; };
  function hintsFor(s){ return Array.isArray(it.hints) ? it.hints : (it.hints[s] || it.hints.zeros); }
  function student(){
    var ps = [];
    st.selI.forEach(function(i){ ps.push({ a:cs[i].a, b:cs[i].b, aIn:false, bIn:false }); });
    st.selZ.forEach(function(j){ ps.push({ a:zs[j].r, b:zs[j].r, aIn:true, bIn:true }); });
    return iv.norm(ps);
  }
  function shadeOf(sol){ var w = P.want(sym) > 0 ? "above" : "below"; return sol.filter(function(q){ return q.a !== q.b; }).map(function(q){ return { x0:Math.max(-6.5, q.a), x1:Math.min(6.5, q.b), where:w }; }); }
  function sync(){
    var s = stg(), ym = P.fit(zs, a), view = { xmin:-6, xmax:6, ymin:-ym, ymax:ym }, f = P.f(zs, a), zr = zs.map(function(z){ return z.r; });
    var g = { view:view, vlines:past("zeros") ? zr : [] }, n = { xmin:-6, xmax:6, vlines:past("zeros") ? zr : [] }, c;
    if (o.mode === "step") {
      if (past("zeros")) g.zdots = zs.map(function(z){ return { x:z.r }; });
      if (past("tests")) g.tests = st.tests;
      if (past("signs")) { g.f = f; if (anim != null) g.curveTo = anim; }
      if (st.solved) g.shade = shadeOf(correct);
      g.describe = past("signs") ? P.describe(zs, a, correct) + (st.solved ? " Shaded where " + MV.plain(it.ineq) + "." : "") : "Graph axes" + (past("zeros") ? " with the zeros " + list(zr.map(nm)) + " marked." : ".");
    } else {
      g.hidden = !st.solved; g.f = f; g.zdots = zs.map(function(z){ return { x:z.r }; }); g.shade = shadeOf(correct); g.describe = P.describe(zs, a, correct) + " Shaded where the inequality holds.";
    }
    if (s === "zeros" && !past("zeros")) { n.marks = st.placed; n.cursor = st.cur; n.describe = "Number line for placing zeros. Placed: " + (st.placed.length ? list(st.placed.slice().sort(function(p, q){ return p - q; }).map(nm)) : "none") + ". Marker at " + nm(st.cur) + "."; }
    else n.zticks = zr;
    if (past("zeros") && !past("sol")) n.tests = st.tests;
    if (s === "sol" && !st.solved) { n.pieces = student(); n.describe = "Your solution so far: " + iv.text(n.pieces) + "."; }
    if (st.solved) { n.pieces = correct; n.describe = "Solution: " + iv.text(correct) + "."; }
    if (past("zeros")) c = { zs:zs, a:a, xmin:-6, xmax:6, tests:st.tests, blank:!(s === "signs" || past("signs")), edit:s === "signs" && !past("signs"), cells:st.cells, bad:bad, vlines:true, onCell:cell };
    else c = { empty:"The chart’s columns appear when the zeros are right." };
    L.set(g, n, c);
  }
  function cell(k){
    if (stg() !== "signs" || past("signs")) return;
    st.cells[k] = st.cells[k] === "+" ? "-" : "+"; delete bad[k]; msg = null; o.save(); sync();
    paint();
  }
  function controls(s){
    if (s === "factor") return '<p class="pred-q">' + it.factor.prompt + '</p><div class="opts">' + fopts.map(function(x){ return '<button type="button" class="opt" data-b="fc" data-i="' + x.i + '" data-k="sbf' + x.i + '" aria-pressed="' + (st.fc === x.i) + '"><span>' + x.op.t + "</span></button>"; }).join("") + "</div>";
    if (s === "zeros") return '<div class="sb-zrow"><span class="tiny" style="font-weight:700">Marker</span><button type="button" class="btn ghost sm sb-pm" data-b="cm" data-k="sbcm" aria-label="Move the marker left">−</button><output class="sb-cur" aria-live="polite">' + m("x = " + nm(st.cur)) + '</output><button type="button" class="btn ghost sm sb-pm" data-b="cp" data-k="sbcp" aria-label="Move the marker right">+</button><button type="button" class="btn ghost sm" data-b="place" data-k="sbpl">' + (st.placed.indexOf(st.cur) >= 0 ? "Remove the zero here" : "Place a zero here") + "</button></div>" +
      '<p class="tiny sb-placed">Placed zeros: ' + (st.placed.length ? st.placed.slice().sort(function(p, q){ return p - q; }).map(function(v){ return '<button type="button" class="chip" data-b="rm" data-v="' + v + '" data-k="sbrm' + v + '" aria-label="Remove the zero at ' + nm(v) + '">' + nm(v) + " ×</button>"; }).join(" ") : "none yet") + "</p>";
    if (s === "tests") return '<div class="sb-tests">' + cs.map(function(c, i){ return '<div class="sb-t"><span>' + m(iv.text([{ a:c.a, b:c.b }])) + '</span><span class="sb-step"><button type="button" class="btn ghost sm sb-pm" data-b="tm" data-i="' + i + '" data-k="sbtm' + i + '" aria-label="Move this test value left">−</button><output>' + m("x = " + nm(st.tests[i])) + '</output><button type="button" class="btn ghost sm sb-pm" data-b="tp" data-i="' + i + '" data-k="sbtp' + i + '" aria-label="Move this test value right">+</button></span></div>'; }).join("") + "</div>";
    if (s === "signs") return "";
    var h = '<div class="dt-strip sb-strip" role="group" aria-label="Intervals and zeros">';
    cs.forEach(function(c, i){
      var on = st.selI.indexOf(i) >= 0;
      h += '<button type="button" class="dt-st" data-b="si" data-i="' + i + '" data-k="sbsi' + i + '" aria-pressed="' + on + '">' + m(iv.text([{ a:c.a, b:c.b }])) + "</button>";
      if (i < zs.length) { var zon = st.selZ.indexOf(i) >= 0; h += '<button type="button" class="dt-pt" data-b="sz" data-i="' + i + '" data-k="sbsz' + i + '" aria-pressed="' + zon + '" aria-label="x = ' + nm(zs[i].r) + ": " + (zon ? "included" : "left out") + '"><span>' + nm(zs[i].r) + '</span><b aria-hidden="true">' + (zon ? "●" : "○") + "</b></button>"; }
    });
    return h + '</div><p class="sb-live">Your solution: <span class="sb-iv">' + m(iv.text(student()).replace("∅", "none yet")) + "</span></p>";
  }
  function paint(){
    var s = stg(), h = '<ol class="sb-st">' + stages.map(function(x, i){ var d = st.solved || i < st.stage; return '<li class="' + (d ? "done" : i === st.stage ? "now" : "") + '">' + (i + 1) + ". " + (d ? "✓ " : "") + X.stageNames[x] + "</li>"; }).join("") + "</ol>";
    if (st.solved) h += '<div class="fb good"><p><strong>✓ Correct: ' + m(MV.ans(it)) + ".</strong>" + (o.mode === "reward" && !st.first ? ' <span class="muted">(not first try)</span>' : "") + "</p><p>" + (it.why || it.done) + "</p></div>";
    else {
      var lvl = st.hint[s] || 0;
      h += '<p class="how">' + X.stageHow[s] + "</p>" + controls(s) + '<div class="q-actions"><button type="button" class="btn primary sm" data-b="check" data-k="sbchk">Check</button>' + MV.hintBtn("sbh" + it.id + s, lvl) + "</div>" + MV.hintsHTML(hintsFor(s), lvl);
      if (msg) h += MV.fbHTML(msg.good ? "good" : "bad", msg.html);
    }
    MV.keepFocus(panel, function(){ panel.innerHTML = h; });
  }
  function fail(s, html){ st.tries[s] = (st.tries[s] || 0) + 1; msg = { good:false, html:"<strong>✗ Not quite.</strong> " + html }; }
  function pass(s){
    st.stage++; msg = { good:true, html:"<strong>✓ Correct.</strong>" }; bad = {};
    if (s === "signs" && o.mode === "step" && !MV.reduceMotion) { anim = -6; MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ anim = -6 + 12.5 * t; sync(); }, done:function(){ anim = null; sync(); } }); }
    if (st.stage >= stages.length) {
      st.solved = true; msg = null;
      st.first = stages.every(function(x){ return !(st.tries[x] > 0) && (st.hint[x] || 0) < 3; });
      if (o.onSolved) o.onSolved(st.first);
    }
  }
  function check(){
    var s = stg(), M = X.msgs;
    if (s === "factor") {
      if (st.fc == null) { msg = { good:false, html:"Choose one of the forms first." }; return; }
      var op = it.factor.options[st.fc]; if (MV.ok(op)) pass(s); else fail(s, op.why);
    } else if (s === "zeros") {
      var want = zs.map(function(z){ return z.r; }), got = st.placed;
      var flipped = got.filter(function(g){ return want.indexOf(g) < 0 && want.indexOf(-g) >= 0 && got.indexOf(-g) < 0; });
      if (got.length === want.length && want.every(function(w){ return got.indexOf(w) >= 0; })) pass(s);
      else if (flipped.length) { var z = zs[want.indexOf(-flipped[0])]; fail(s, fill(M.wrongSignZero, { f:m(P.fM(z, true)), e:m(P.inner(z) + " = 0"), z:m("x = " + nm(z.r)) })); }
      else if (want.some(function(w){ return got.indexOf(w) < 0; })) fail(s, fill(M.missingZero, { n:got.filter(function(g){ return want.indexOf(g) >= 0; }).length, m:want.length }));
      else { var ex = got.filter(function(g){ return want.indexOf(g) < 0; })[0]; fail(s, fill(M.extraZero, { z:m("x = " + nm(ex)) })); }
    } else if (s === "tests") {
      var onZ = st.tests.some(function(t){ return zs.some(function(z){ return z.r === t; }); });
      if (onZ) fail(s, M.testOnZero); else pass(s);
    } else if (s === "signs") {
      var rowsF = [], i, j, firstBad = null, prodBad = false, pat = "";
      bad = {};
      for (i = 0; i < cs.length; i++) {
        for (j = 0; j < zs.length; j++) {
          var k = "f" + j + "|" + i, w = P.fsign(zs[j], st.tests[i]) > 0 ? "+" : "-";
          if (!st.cells[k]) { msg = { good:false, html:M.fillCells }; return; }
          if (st.cells[k] !== w) { bad[k] = 1; if (!firstBad) firstBad = { z:zs[j], t:st.tests[i] }; }
        }
        var kp = "p|" + i, wp = P.sign(zs, a, st.tests[i]) > 0 ? "+" : "-";
        if (!st.cells[kp]) { msg = { good:false, html:M.fillCells }; return; }
        pat += st.cells[kp];
        if (st.cells[kp] !== wp) prodBad = true;
      }
      void rowsF;
      if (firstBad) { var v = P.fval(firstBad.z, firstBad.t); fail(s, fill(M.factorCell, { x:m("x = " + nm(firstBad.t)), f:m(P.fM(firstBad.z)), v:m(nm(v)), pn:sgnWord(v) })); }
      else if (prodBad) { for (i = 0; i < cs.length; i++) { var kk = "p|" + i; if (st.cells[kk] !== (P.sign(zs, a, st.tests[i]) > 0 ? "+" : "-")) bad[kk] = 1; } fail(s, (it.rowWrong && it.rowWrong[pat]) || M.productCell); }
      else pass(s);
    } else {
      var mine = student(), t = iv.text(mine), w = P.want(sym);
      var good = cs.map(function(c, i){ return P.sign(zs, a, c.mid) === w ? i : -1; }).filter(function(i){ return i >= 0; });
      var wrongI = st.selI.filter(function(i){ return good.indexOf(i) < 0; });
      if (t === MV.ans(it)) pass(s);
      else if (it.wrong && it.wrong[t]) fail(s, it.wrong[t]);
      else if (!st.selI.length && !st.selZ.length) { msg = { good:false, html:M.empty }; }
      else if (!st.selI.length) fail(s, M.zerosOnly);
      else if (wrongI.length) { var c = cs[wrongI[0]]; fail(s, fill(M.wrongSign, { sign:sgnWord(P.sign(zs, a, c.mid)), need:m("P(x) " + sym + " 0") })); }
      else if (good.length === st.selI.length) fail(s, M.endpoints);
      else fail(s, M.missing);
    }
  }
  panel.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !panel.contains(b) || st.solved) return;
    var d = b.dataset.b, s = stg(), i = +b.dataset.i;
    if (b.dataset.act === "hint") { st.hint[s] = Math.min(3, (st.hint[s] || 0) + 1); o.save(); paint(); return; }
    if (d === "check") { check(); o.save(); sync(); paint(); MV.focusFb(panel); return; }
    if (d === "fc") st.fc = i;
    else if (d === "cm" || d === "cp") st.cur = Math.max(-6, Math.min(6, st.cur + (d === "cp" ? 0.5 : -0.5)));
    else if (d === "place") toggleZero(st.cur);
    else if (d === "rm") toggleZero(+b.dataset.v);
    else if (d === "tm" || d === "tp") {
      var lo = i === 0 ? -6 : zs[i - 1].r, hi = i === cs.length - 1 ? 6 : zs[i].r;
      st.tests[i] = Math.max(lo, Math.min(hi, st.tests[i] + (d === "tp" ? 0.5 : -0.5)));
    }
    else if (d === "si") { var k = st.selI.indexOf(i); if (k < 0) st.selI.push(i); else st.selI.splice(k, 1); }
    else if (d === "sz") { var kz = st.selZ.indexOf(i); if (kz < 0) st.selZ.push(i); else st.selZ.splice(kz, 1); }
    else return;
    msg = null; o.save(); sync(); paint();
  });
  function toggleZero(v){ v = clean(v); var k = st.placed.indexOf(v); if (k < 0) st.placed.push(v); else st.placed.splice(k, 1); }
  sync(); paint();
  return {
    tap:function(x){ if (stg() !== "zeros" || past("zeros")) return; var v = clean(Math.max(-6, Math.min(6, Math.round(x * 2) / 2))); st.cur = v; toggleZero(v); msg = null; o.save(); sync(); paint(); },
    sync:sync
  };
}
// tap-to-place on a number-line canvas (stage 1)
function nlTap(np, fn){ np.c.addEventListener("click", function(e){ var r = np.c.getBoundingClientRect(); fn(np.xOf(e.clientX - r.left)); }); }

// ---------- hero (storyboard: draw, zeros, shade, sign strip, number line, caption) ----------
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, { xmin:-3.5, xmax:4.5, ymin:-10, ymax:12 }), zs = P.z([[-2, 1], [1, 1], [3, 1]]), F = P.f(zs, 1);
  var bis = function(lo, hi, y){ for (var i = 0; i < 50; i++) { var md = (lo + hi) / 2; if ((F(md) - y) * (F(lo) - y) <= 0) hi = md; else lo = md; } return (lo + hi) / 2; };
  var xL = bis(-3, -2, -10), xR = bis(3.2, 4.5, 12), st = { c:0, dots:0, shade:0, strip:0, nl:0 };
  var capTxt = "(x + 2)(x − 1)(x − 3) > 0 when x is in (−2, 1) ∪ (3, ∞)";
  p.render = function(){
    var W = p.W || f.canvas.getBoundingClientRect().width, frac = 0.66, ymin = 12 - 22 / frac;
    var view = { xmin:-3.5, xmax:4.5, ymin:ymin, ymax:12 }, curves = [], regions = [], pts = [];
    if (st.c > 0) curves.push({ f:F, color:css("--pen"), width:3.2, arrows:st.c >= 1, domain:[xL, xL + (xR - xL) * st.c] });
    if (st.shade > 0) [[-2, 1], [3, xR]].forEach(function(r){ regions.push({ f:F, x0:r[0], x1:r[1], where:"above", alpha:st.shade }); });
    [-2, 1, 3].slice(0, st.dots).forEach(function(x){ pts.push({ x:x, y:0, r:5.5, color:css("--ink"), label:nm(x), below:true }); });
    p.draw({ view:view, regions:regions, curves:curves, points:pts, yTicks:{ step:5 }, describe:"Graph of y = (x + 2)(x − 1)(x − 3), zeros −2, 1 and 3, each crossing. Above the axis on (−2, 1) and (3, ∞), shown shaded; a sign strip −, +, −, + and a number line with open circles at −2, 1 and 3 and the solution (−2, 1) ∪ (3, ∞).",
      after:function(ctx, pl){
        var top = pl.Y(-10) + 2, H = pl.H, ink = css("--ink"), ink2 = css("--ink-2");
        ctx.fillStyle = css("--sheet"); ctx.fillRect(0, top, pl.W, H - top);
        ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, top + 0.5); ctx.lineTo(pl.W, top + 0.5); ctx.stroke();
        var sh = (H - top) / 2, sy = top + sh * 0.5 + (1 - st.strip) * sh * 0.8, ny = top + sh * 1.45;
        if (st.strip > 0) {
          ctx.globalAlpha = st.strip;
          [-2, 1, 3].forEach(function(x){ ctx.save(); ctx.strokeStyle = ink2; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(pl.X(x), pl.Y(0)); ctx.lineTo(pl.X(x), H); ctx.stroke(); ctx.restore(); });
          ctx.font = "700 20px " + pl.fontM; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          [[-3.5, -2, "−"], [-2, 1, "+"], [1, 3, "−"], [3, 4.5, "+"]].forEach(function(c){ ctx.fillText(c[2], pl.X((c[0] + c[1]) / 2), sy); });
          ctx.globalAlpha = 1;
        }
        if (st.nl > 0) {
          ctx.globalAlpha = st.nl;
          ctx.fillStyle = css("--hi-soft"); ctx.fillRect(pl.X(-2), ny - 9, pl.X(1) - pl.X(-2), 18); ctx.fillRect(pl.X(3), ny - 9, pl.W - pl.X(3), 18);
          ctx.strokeStyle = css("--hi"); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(pl.X(-2), ny); ctx.lineTo(pl.X(1), ny); ctx.moveTo(pl.X(3), ny); ctx.lineTo(pl.W - 4, ny); ctx.stroke();
          ctx.strokeStyle = ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, ny); ctx.lineTo(pl.W, ny); ctx.stroke();
          var Y0 = pl.Y; pl.Y = function(){ return ny; }; pl.head([pl.xOf(pl.W - 16), 0], [pl.xOf(pl.W - 1), 0], ink, 12); pl.Y = Y0;
          [-2, 1, 3].forEach(function(x){ ctx.beginPath(); ctx.arc(pl.X(x), ny, 6, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.3; ctx.strokeStyle = ink; ctx.stroke(); });
          ctx.globalAlpha = 1;
        }
      } });
  };
  function cap(n){ f.cap.textContent = capTxt.slice(0, n); }
  if (MV.reduceMotion) { st = { c:1, dots:3, shade:1, strip:1, nl:1 }; p.render(); f.cap.innerHTML = MV.md("`(x + 2)(x - 1)(x - 3) > 0` when `x` is in `(-2, 1) ∪ (3, ∞)`"); return; }
  p.render();
  MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ st.c = t; p.render(); }, done:function(){
    [0, 1, 2].forEach(function(i){ MV.wait(300 * (i + 1), function(){ st.dots = i + 1; p.render(); }); });
    MV.wait(1300, function(){ MV.tween({ dur:600, step:function(t){ st.shade = t; p.render(); }, done:function(){
      MV.tween({ dur:700, step:function(t){ st.strip = t; p.render(); }, done:function(){
        MV.tween({ dur:600, step:function(t){ st.nl = t; p.render(); }, done:function(){
          var n = 0, tm = setInterval(function(){ n += 2; cap(n); if (n >= capTxt.length) { clearInterval(tm); f.cap.innerHTML = MV.md("`(x + 2)(x - 1)(x - 3) > 0` when `x` is in `(-2, 1) ∪ (3, ∞)`"); } }, 40);
        } });
      } });
    } }); });
  } });
}

// ---------- Explore: Build it / Scan ----------
// @component N11 signScanner — Scan mode: zero builder (N21-style cards, degree cap 4), a slider, symbol, scanner line through the
//   three aligned layers (layersHTML / layers / drawGraph / drawNL), column outline, factor flips, "flips twice" note and the
//   "Is x = … a solution?" readout. Lives inside explore() below; module 22 can lift it with asymptotes as extra boundaries.
var PRESETS = [
  { id:"hero", t:"`(x + 2)(x - 1)(x - 3) > 0`", z:[[-2, 1], [1, 1], [3, 1]], a:1, sym:">" },
  { id:"b2", t:"`(x + 1)(x - 2)^2 ≤ 0`", z:[[-1, 1], [2, 2]], a:1, sym:"≤" },
  { id:"b3", t:"`-(x + 3)(x - 1)(x - 4) ≥ 0`", z:[[-3, 1], [1, 1], [4, 1]], a:-1, sym:"≥" },
  { id:"q4", t:"`x^4 - 5x^2 + 4`", z:[[-2, 1], [-1, 1], [1, 1], [2, 1]], a:1 },
  { id:"blank", t:"Blank", z:[], a:1 }
];
function explore(host, api){
  var C = api.content, S = api.S;
  S.mode = S.mode || "build";
  S.scan = S.scan || { z:[[-2, 1], [1, 1], [3, 1]], a:1, sym:">", x:2.5, g:true, rows:true, tests:false };
  S.build = S.build || { cur:"b1", it:{} };
  host.innerHTML = '<div class="pg sc-pg"><div class="pg-graph" data-mv="graph"><div class="sc-mode"></div><div class="eq-cap sc-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' + layersHTML("ex-lay", { scan:true }) + "</div>" +
    '<div class="pg-ctrl"></div><div class="pg-read"></div></div>';
  var L = layers($("#ex-lay", host)), ctrl = $(".pg-ctrl", host), read = $(".pg-read", host), cap = $(".sc-cap", host);
  var scanIn = L.q("s"), scanOut = L.q("so"), eng = null, aSl = null, symSeg = null;
  var V = { hideCols:null, split:null, touch:null, lockView:null, p3k:null, solHTML:null };
  var modeSeg = MV.seg($(".sc-mode", host), { label:"Mode:", options:[{ id:"build", t:"Build it" }, { id:"scan", t:"Scan" }], value:S.mode, onChange:function(v){ setMode(v); } });
  function setMode(v){ S.mode = v; modeSeg.set(v); api.save(); buildUI(); }
  // ----- Build it -----
  function buildUI(){
    L.root.querySelector(".sc-scanrow").hidden = S.mode !== "scan";
    if (S.mode === "scan") { scanUI(); return; }
    var B = C.builds, cur = B.filter(function(b){ return b.id === S.build.cur; })[0] || B[0];
    ctrl.innerHTML = '<div class="chips sb-builds" role="group" aria-label="Choose a build">' + B.map(function(b){ var x = S.build.it[b.id]; return '<button type="button" class="fchip txt" data-bd="' + b.id + '" data-k="bd' + b.id + '" aria-pressed="' + (b.id === cur.id) + '">' + (x && x.solved ? "✓ " : "") + b.label + "</button>"; }).join("") + "</div>";
    cap.innerHTML = cur.ineq;
    read.innerHTML = '<div class="sb-panel"></div>';
    var st = S.build.it[cur.id] || (S.build.it[cur.id] = {});
    eng = chartBuild({ item:cur, st:st, X:C, L:L, panel:$(".sb-panel", read), mode:"step", save:api.save, onSolved:function(){ api.save(); MV.wait(50, buildUI); } });
  }
  ctrl.addEventListener("click", function(e){
    var b = e.target.closest("[data-bd]"); if (b) { S.build.cur = b.dataset.bd; api.save(); buildUI(); }
  });
  nlTap(L.np, function(x){ if (S.mode === "build" && eng) eng.tap(x); else if (S.mode === "scan") setScan(x); });
  // ----- Scan -----
  function zs(){ return P.z(S.scan.z); }
  function scanUI(){
    eng = null;
    ctrl.innerHTML = '<div class="sc-zb"><div class="sc-zs"></div><p class="tiny muted sc-capnote" hidden>This module’s polynomials have degree 4 or less.</p><button type="button" class="btn ghost sm" data-s="add" data-k="scadd">Add a zero</button></div>' +
      '<div class="sc-asl"></div><div class="sc-sym"></div><div class="chips sc-tg" role="group" aria-label="Show or hide"></div>' +
      '<div class="sc-pre"><span class="tiny" style="font-weight:700">Presets:</span><div class="chips">' + PRESETS.map(function(q){ return '<button type="button" class="chip" data-pre="' + q.id + '" data-k="pre' + q.id + '">' + MV.md(q.t) + "</button>"; }).join("") + "</div></div>";
    read.innerHTML = '<details class="sc-rd"' + (eqMode() ? "" : " open") + '><summary>Show readout</summary><dl class="read" aria-live="polite"></dl></details>';
    aSl = MV.sliders($(".sc-asl", ctrl), [{ id:"sca", label:m("@a{a}"), param:"a", min:-3, max:3, step:0.5, value:S.scan.a, skip:[0] }], function(id, v){ S.scan.a = v; userChange(); });
    symSeg = MV.seg($(".sc-sym", ctrl), { label:"Symbol:", options:[{ id:"<", t:"<" }, { id:"≤", t:"≤" }, { id:">", t:">" }, { id:"≥", t:"≥" }], value:S.scan.sym, onChange:function(v){ S.scan.sym = v; userChange(); } });
    cards(); toggles(); paintScan();
  }
  function cards(){
    var deg = S.scan.z.reduce(function(s, q){ return s + q[1]; }, 0), capped = false;
    var h = S.scan.z.map(function(q, i){
      var ords = [1, 2, 3].map(function(o){ var dis = o !== q[1] && deg - q[1] + o > 4; if (dis) capped = true; return '<button type="button" class="chip' + (o === q[1] ? " on" : "") + '" aria-pressed="' + (o === q[1]) + '" data-s="ord" data-i="' + i + '" data-o="' + o + '" data-k="scord' + i + o + '"' + (dis ? " disabled" : "") + ">" + o + "</button>"; }).join("");
      return '<div class="sc-zc"><div class="sc-zt"><strong>Zero ' + (i + 1) + ':</strong> <span class="sc-zv" data-zv="' + i + '">' + m("x = " + nm(q[0])) + '</span>' +
        '<span class="zb-ord" role="group" aria-label="Order of zero ' + (i + 1) + '"><span class="tiny">Order</span>' + ords + '</span><button type="button" class="btn ghost sm" data-s="rm" data-i="' + i + '" data-k="scrm' + i + '">Remove</button></div>' +
        '<input type="range" min="-5" max="5" step="0.5" value="' + q[0] + '" data-zr="' + i + '" aria-label="Zero ' + (i + 1) + ' position"></div>';
    }).join("");
    MV.keepFocus(ctrl, function(){ $(".sc-zs", ctrl).innerHTML = h || '<p class="tiny muted">No zeros: ' + m("P(x)") + " is a constant.</p>"; });
    $(".sc-capnote", ctrl).hidden = !capped && deg < 4;
    var add = $('[data-s="add"]', ctrl); add.disabled = S.scan.z.length >= 4 || deg >= 4;
  }
  function toggles(){
    var T = [["g", "Show graph"], ["rows", "Show factor rows"], ["tests", "Show test values"]];
    MV.keepFocus(ctrl, function(){ $(".sc-tg", ctrl).innerHTML = T.map(function(t){ var on = !!S.scan[t[0]]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tg="' + t[0] + '" data-k="tg' + t[0] + '">' + t[1] + "</button>"; }).join(""); });
  }
  function userChange(){ V.lockView = null; V.touch = null; V.hideCols = null; V.split = null; V.p3k = null; V.solHTML = null; api.save(); paintScan(); api.changed(); }
  function occupied(v, i){ return S.scan.z.some(function(q, j){ return j !== i && q[0] === v; }); }
  function moveZero(i, v, dir){
    v = Math.max(-5, Math.min(5, v));
    while (occupied(v, i)) { v += dir * 0.5; if (v < -5 || v > 5) return false; }
    S.scan.z[i][0] = clean(v); var lab = ctrl.querySelector('[data-zv="' + i + '"]'); if (lab) lab.innerHTML = m("x = " + nm(v));
    var rg = ctrl.querySelector('[data-zr="' + i + '"]'); if (rg && +rg.value !== v) rg.value = v;
    return true;
  }
  ctrl.addEventListener("input", function(e){
    var i = e.target.dataset.zr; if (i == null) return; i = +i;
    var old = S.scan.z[i][0], v = +e.target.value;
    if (!moveZero(i, v, v >= old ? 1 : -1)) e.target.value = old;
    userChange();
  });
  ctrl.addEventListener("click", function(e){
    if (S.mode !== "scan") return;
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s === "add") {
      for (var d = 0; d <= 5; d++) { var c = [d, -d].filter(function(v){ return !occupied(v, -1); })[0]; if (c != null) { S.scan.z.push([c, 1]); break; } }
      cards(); userChange(); return;
    }
    if (b.dataset.s === "rm") { S.scan.z.splice(+b.dataset.i, 1); cards(); userChange(); return; }
    if (b.dataset.s === "ord") { S.scan.z[+b.dataset.i][1] = +b.dataset.o; cards(); userChange(); return; }
    if (b.dataset.tg) { S.scan[b.dataset.tg] = !S.scan[b.dataset.tg]; toggles(); userChange(); return; }
    if (b.dataset.pre) { preset(b.dataset.pre); userChange(); }
  });
  function preset(id, keepSym){
    var q = PRESETS.filter(function(x){ return x.id === id; })[0] || (id === "p2" ? { z:[[-2, 1], [1, 2]], a:1, sym:">" } : null); if (!q) return;
    S.scan.z = q.z.map(function(x){ return x.slice(); }); S.scan.a = q.a; if (q.sym && !keepSym) S.scan.sym = q.sym;
    if (aSl) aSl.set("sca", S.scan.a); if (symSeg) symSeg.set(S.scan.sym); cards();
  }
  // scanner
  function setScan(x, how){
    x = clean(Math.max(-6, Math.min(6, Math.round(x * 10) / 10)));
    var old = S.scan.x, Z = zs(), lo = Math.min(old, x), hi = Math.max(old, x), right = x > old;
    var crossed = Z.map(function(z, j){ return { z:z, j:j }; }).filter(function(q){ return x !== old && ((q.z.r > lo && q.z.r <= hi && right) || (q.z.r >= lo && q.z.r < hi && !right)); });
    S.scan.x = x;
    if (V.hideCols) { var cc = L.chart.col(x); if (cc == null) cc = Z.filter(function(z){ return z.r < x; }).length + (right ? 0 : 0); V.hideCols = V.hideCols.filter(function(c){ return c !== cc; }); }
    paintScan();
    if (crossed.length) {
      var nc = Z.filter(function(z){ return right ? z.r < x || z.r === x : z.r < x; }).length;
      crossed.forEach(function(q){
        var rows = V.split === q.z.r ? ["f" + q.j + "s1", "f" + q.j + "s2"] : ["f" + q.j];
        L.chart.flip(rows.map(function(r){ return r + "|" + nc; }), q.z.k % 2 === 0 && V.split !== q.z.r);
        if (q.z.k % 2) L.chart.flip(["p|" + nc]);
        else L.chart.note(rows[0], q.z.r, "flips twice → no change");
      });
    }
    if (how !== "anim") { api.save(); api.changed(); }
  }
  scanIn.addEventListener("input", function(){ V.lockView = null; setScan(+scanIn.value); });
  scanIn.addEventListener("keydown", function(e){
    var Z = zs().map(function(z){ return z.r; }), x = S.scan.x, t = null;
    if (e.key === "PageUp") { t = Z.filter(function(r){ return r > x; })[0]; if (t == null) t = 6; }
    else if (e.key === "PageDown") { var l = Z.filter(function(r){ return r < x; }); t = l.length ? l[l.length - 1] : -6; }
    else return;
    e.preventDefault(); setScan(t);
  });
  MV.drag(L.np, { axis:"x", step:{ x:0.1 }, big:10,
    handles:function(){ return S.mode === "scan" ? [{ id:"s", x:S.scan.x, y:0, label:"Scanner at x = " + nm(S.scan.x) + ". Arrow keys move it; Page Up and Page Down jump to the next zero." }] : []; },
    snap:function(x){ return [Math.max(-6, Math.min(6, Math.round(x * 10) / 10)), 0]; },
    move:function(id, x){ setScan(x); },
    key:function(id, e){ if (e.key === "PageUp" || e.key === "PageDown" || e.key === "Home" || e.key === "End") { var Z = zs().map(function(z){ return z.r; }), x = S.scan.x, t; if (e.key === "Home") t = -6; else if (e.key === "End") t = 6; else if (e.key === "PageUp") { t = Z.filter(function(r){ return r > x; })[0]; if (t == null) t = 6; } else { var l = Z.filter(function(r){ return r < x; }); t = l.length ? l[l.length - 1] : -6; } setScan(t); return true; } return false; } });
  MV.drag(L.gp, { axis:"x", step:{ x:0.5 }, big:2,
    handles:function(){ return S.mode === "scan" ? S.scan.z.map(function(q, i){ return { id:"z" + i, x:q[0], y:0, label:"Zero " + (i + 1) + " at x = " + nm(q[0]) + ", order " + q[1] + ". Arrow keys move it by 0.5; Shift and an arrow move it by 1." }; }) : []; },
    snap:function(x){ return [Math.max(-5, Math.min(5, Math.round(x * 2) / 2)), 0]; },
    move:function(id, x, y, how){ var i = +id.slice(1), old = S.scan.z[i][0]; if (x === old) return; if (occupied(x, i) && how !== "key") return; if (moveZero(i, x, x > old ? 1 : -1)) userChange(); } });
  function sol(){ var Z = zs(); if (V.p3k != null) return iv.norm(P.solve(Z, S.scan.a, ">").concat(Z.slice(0, V.p3k).map(function(z){ return { a:z.r, b:z.r, aIn:true, bIn:true }; }))); return P.solve(Z, S.scan.a, S.scan.sym); }
  function paintScan(){
    if (S.mode !== "scan") return;
    var Z = zs(), a = S.scan.a, sym = S.scan.sym, x = S.scan.x, f = P.f(Z, a), so = sol(), ym = V.lockView || P.fit(Z, a), zr = Z.map(function(z){ return z.r; });
    var view = { xmin:-6, xmax:6, ymin:-ym, ymax:ym }, cs = P.cols(Z), w = P.want(sym) > 0 ? "above" : "below";
    var g = { view:view, f:f, hidden:!S.scan.g, vlines:zr, scanX:x, touch:V.touch, zdots:Z.map(function(z){ return { x:z.r }; }),
      shade:so.filter(function(q){ return q.a !== q.b; }).map(function(q){ return { x0:Math.max(-6.5, q.a), x1:Math.min(6.5, q.b), where:w }; }),
      testPts:S.scan.tests ? cs.map(function(c){ var t = clean(Math.max(-5.75, Math.min(5.75, c.mid))); return { x:t, y:f(t), label:"P(" + nm(t) + ")" + exact(f(t)).eq + exact(f(t)).s }; }) : null,
      describe:P.describe(Z, a, so) + " Shaded where the inequality holds: " + iv.text(so) + ". Scanner at x = " + nm(x) + "." };
    var n = { xmin:-6, xmax:6, pieces:so, vlines:zr, scanX:x, describe:"Number line: the solution " + iv.text(so) + ", scanner at " + nm(x) + "." };
    var c = { zs:Z, a:a, aCol:true, xmin:-6, xmax:6, showFactors:S.scan.rows, split:V.split, hideCols:V.hideCols, tests:S.scan.tests ? cs.map(function(c){ return clean(Math.max(-5.75, Math.min(5.75, c.mid))); }) : null, vlines:true, scanX:x };
    if (!Z.length) c = { empty:"No zeros: the sign of " + m("P(x)") + " is the sign of " + m("@a{a}") + " everywhere." };
    L.set(g, n, c);
    cap.innerHTML = m("y = " + P.polyM(Z, a, true));
    scanIn.value = x; scanOut.textContent = nm(x);
    var rd = $("dl.read", read); if (rd) rd.innerHTML = MV.readoutHTML(rows(Z, a, sym, x, f, so));
  }
  function rows(Z, a, sym, x, f, so){
    var xs = nm(x), s = P.sign(Z, a, x), at = Z.filter(function(z){ return z.r === x; })[0], L1 = Z.filter(function(z){ return z.r < x; }), R1 = Z.filter(function(z){ return z.r > x; });
    var where = at ? ", a zero of order " + at.k : !Z.length ? "" : !L1.length ? ", left of every zero" : !R1.length ? ", right of every zero" : ", between the zeros " + nm(L1[L1.length - 1].r) + " and " + nm(R1[0].r);
    var fs = (a !== 1 ? [m("@a{" + nm(a) + "}") + ": " + sgnCh(a)] : []).concat(Z.map(function(z){ return m(P.fM(z)) + ": " + sgnCh(P.fsign(z, x)); }));
    var sg = (a !== 1 ? [sgnCh(a)] : []).concat(Z.map(function(z){ return sgnCh(P.fsign(z, x)); })).map(function(c){ return "(" + c + ")"; }).join("");
    var v = exact(f(x)), Px = "P(" + xs + ")", need = m("P(x) " + sym + " 0");
    var isSol = s === 0 ? (P.sat(0, sym) ? "Yes: " + m(Px + " = 0") + ", and " + m("0 " + sym + " 0") + " is true." : "No: " + m(Px + " = 0") + ", and " + m("0 " + sym + " 0") + " is false.")
      : (P.sat(s, sym) ? "Yes: " : "No: ") + m(Px) + " is " + sgnWord(s) + ", and the inequality needs " + need + ".";
    var odd = Z.filter(function(z){ return z.k % 2; }).length, txt = iv.text(so);
    return [
      ["Inequality", m(P.polyM(Z, a, true) + " " + sym + " 0")],
      ["Zeros", Z.length ? Z.map(function(z){ return nm(z.r) + " (order " + z.k + ": " + (z.k % 2 ? "sign changes" : "sign stays the same") + ")"; }).join(" · ") : "none"],
      ["Far right", "For large " + m("x") + ", " + m("P(x)") + " has the sign of " + m("@a{a}") + ": " + (a > 0 ? "positive" : "negative")],
      ["Scanner", m("x = " + xs) + where],
      ["Factor signs here", fs.join(" · ")],
      ["Product", m(Px + " = " + sg) + ": " + sgnWord(s) + ". " + m(Px) + v.eq + v.s],
      ["Is " + m("x = " + xs) + " a solution?", isSol],
      ["Solution", V.solHTML || (txt === "∅" ? "no solution (∅)" : m(txt))],
      ["In words", txt === "∅" ? "no solution" : m(iv.ineq(so))],
      ["Sign changes", Z.length ? "The sign changes at " + odd + " of the " + Z.length + " zero" + (Z.length > 1 ? "s" : "") + "." : "No zeros, so the sign never changes."]
    ];
  }
  // P3 helper: the hero solution with the first k zeros filled, new bracket highlighted, ∞ bracket pulsing at the end
  function heroSol(k, pulse){
    var br = function(ch, i){ return '<span class="' + (i === k - 1 ? "sc-new" : "") + '">' + ch + "</span>"; };
    return '<span class="m">' + br(k >= 1 ? "[" : "(", 0) + "−2, 1" + br(k >= 2 ? "]" : ")", 1) + " ∪ " + br(k >= 3 ? "[" : "(", 2) + "3, ∞" + '<span class="' + (pulse ? "sc-pulse" : "") + '">)</span></span>';
  }
  function tweenScan(to, dur, done){ var from = S.scan.x; MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){ setScan(from + (to - from) * t, "anim"); }, done:function(){ setScan(to, "anim"); done(); } }); }
  function tweenA(to, dur, done){
    var from = S.scan.a;
    MV.tween({ dur:dur, step:function(t){ var v = from + (to - from) * t; if (Math.abs(v) < 0.04) v = to < from ? -0.04 : 0.04; S.scan.a = clean(Math.round(v * 100) / 100); aSl.set("sca", S.scan.a); paintScan(); }, done:function(){ S.scan.a = to; aSl.set("sca", to); paintScan(); done(); } });
  }
  buildUI();
  if (S.mode === "scan") paintScan();
  return {
    predict:{
      start:function(p){
        var s = p.start;
        if (S.mode !== "scan") setMode("scan");
        preset(s.preset); S.scan.sym = s.sym; S.scan.a = s.a; S.scan.x = s.scan; aSl.set("sca", s.a); symSeg.set(s.sym);
        V.lockView = null; V.touch = null; V.split = null; V.p3k = null; V.solHTML = null;
        V.hideCols = s.hideProduct ? P.cols(zs()).map(function(c, i){ return i; }) : null;
        paintScan();
      },
      run:function(p, done){
        if (p.id === "p1") {
          var stops = [3, 1, -2], cnt = [];
          var go = function(i){
            if (i >= stops.length) { tweenScan(-3, 430, function(){ api.save(); done(); }); return; }
            tweenScan(stops[i], Math.abs(S.scan.x - stops[i]) * 430, function(){ cnt.push(i + 1); MV.banner("", p.counter + cnt.join(", ")); MV.wait(600, function(){ go(i + 1); }); });
          };
          go(0);
        } else if (p.id === "p2") {
          tweenScan(-2, 900, function(){ MV.wait(400, function(){ tweenScan(0.9, 1100, function(){
            V.split = 1; paintScan(); V.touch = { x:1, y:0 };
            MV.wait(250, function(){ setScan(1, "anim"); MV.wait(1000, function(){ V.split = null; paintScan(); tweenScan(3, 800, function(){ V.hideCols = null; paintScan(); api.save(); done(); }); }); });
          }); }); });
        } else if (p.id === "p3") {
          S.scan.sym = "≥"; symSeg.set("≥"); V.p3k = 0; V.solHTML = heroSol(0); paintScan();
          var k = 0, step = function(){ k++; V.p3k = k; V.solHTML = heroSol(k); paintScan(); if (k < 3) MV.wait(300, step); else MV.wait(400, function(){ V.p3k = null; V.solHTML = heroSol(3, true); paintScan(); MV.wait(900, function(){ V.solHTML = null; paintScan(); api.save(); done(); }); }); };
          MV.wait(300, step);
        } else if (p.id === "p4") {
          V.lockView = P.fit(zs(), 1);
          tweenA(3, 1500, function(){ MV.banner("", MV.plain(p.still)); MV.wait(900, function(){ tweenA(-2, 1500, function(){ api.save(); done(); }); }); });
        } else done();
      }
    },
    challenge:function(id){ return chal(id); }
  };
  function chal(id){
    var Z = zs(), a = S.scan.a, sym = S.scan.sym, eff = a > 0 ? sym : P.flip(sym), ch = C.challenges.filter(function(c){ return c.id === id; })[0], M = ch.msgs;
    var sig = Z.map(function(z){ return String(clean(z.r)) + ":" + z.k; }).join(",");
    var text = function(s){ return iv.text(P.solve(Z, a, s)); };
    if (id === "tc1") {
      if (text(">") === "(−3, 1) ∪ (4, ∞)") return { ok:true };
      if (sig === "-3:1,1:1,4:1" && a < 0) return { ok:false, msg:M.aNeg };
      if (sig === "-4:1,-1:1,3:1" && a > 0) return { ok:false, msg:M.flipped };
      if (Z.length === 3 && Z.map(function(z){ return z.r; }).join() === "-3,1,4" && Z.filter(function(z){ return z.k === 2; }).length === 1 && Z.filter(function(z){ return z.k === 1; }).length === 2) return { ok:false, msg:M.order2 };
      return { ok:false, msg:M.other };
    }
    if (id === "tc2") {
      if (text(sym) === "(−∞, −2) ∪ (−2, 3)") return { ok:true };
      if (sig === "-2:2,3:1" && eff === "≤") return { ok:false, msg:M.le };
      if (sig === "-2:1,3:1" && eff === "<") return { ok:false, msg:M.order1 };
      if (sig === "-2:2,3:1" && sym === ">" && a > 0) return { ok:false, msg:M.gt };
      if (sig === "2:2,3:1" && eff === "<") return { ok:false, msg:M.gap2 };
      return { ok:false, msg:M.other };
    }
    if (id === "tc3") {
      if (text(sym) === "(−∞, −2] ∪ {1} ∪ [3, ∞)") return { ok:true };
      if (sig === "-2:1,1:2,3:1" && eff === ">") return { ok:false, msg:M.strict };
      if (sig === "-2:1,1:1,3:1" && eff === "≥") return { ok:false, msg:M.order1 };
      if (sig === "-2:1,1:2,3:1" && a < 0 && sym === "≥") return { ok:false, msg:M.aNeg };
      if (sig === "-2:1,3:1" && eff === "≥") return { ok:false, msg:M.no1 };
      return { ok:false, msg:M.other };
    }
    return { ok:false };
  }
}

// @component N25 flattenMorph — copied from MHF4U 13 and extended here with gap bars (every 0.5 units, --ink-2) that keep their
//   lengths while f slides down by g and g straightens onto the x-axis; f stays behind as a dashed ghost; f − g in --ink.
//   flattenMorph(plot, {f, g, xs, view(), band:[a, b], bandLabel, shade(t) -> [{x0, x1, where}], describe(t)}) -> {t(), to(target, done), draw(), set(t)}
function flattenMorph(plot, o){
  var t = o.t || 0, cancel = null;
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), teal = css("--f3"), v = o.view(), curves = [], segs = [], pts = [], regions = [], labels = [];
    var fd = function(x){ return o.f(x) - t * o.g(x); }, gd = function(x){ return (1 - t) * o.g(x); };
    (o.shade ? o.shade(t) : []).forEach(function(r){ regions.push({ f:t > 0 ? fd : o.f, g:t > 0 ? null : o.g, x0:r.x0, x1:r.x1, where:r.where }); });
    if (t === 0) {
      if (o.band) { curves.push({ f:o.f, color:pen, width:3.2, alpha:0.4, domain:[v.xmin, o.band[0]] }, { f:o.f, color:pen, width:3.2, domain:[o.band[0], o.band[1]] }, { f:o.f, color:pen, width:3.2, alpha:0.4, domain:[o.band[1], v.xmax] }); }
      else curves.push({ f:o.f, color:pen, width:3.2, arrows:true });
    } else curves.push({ f:o.f, color:pen, width:2, dash:[7, 6], alpha:0.5 });
    if (t < 1) curves.push({ f:gd, color:teal, width:2.6, arrows:t === 0 && !o.band });
    if (t > 0) {
      for (var x = Math.ceil(v.xmin * 2) / 2; x <= v.xmax; x += 0.5) segs.push({ x1:x, y1:gd(x), x2:x, y2:fd(x), color:ink2, width:1.2 });
      curves.push({ f:fd, color:ink, width:3.4, arrows:t >= 1 });
    }
    o.xs.forEach(function(x, i){ pts.push({ x:x, y:gd(x), r:6, color:ink, label:"x = " + nm(x), below:i % 2 === 1 }); });
    if (o.band) labels.push({ x:(o.band[0] + o.band[1]) / 2, y:v.ymin + (v.ymax - v.ymin) * 0.06, text:o.bandLabel, align:"center", bg:true, font:"600 12px " + (css("--font-ui") || "sans-serif") });
    plot.draw({ view:v, bands:o.band ? [{ x0:o.band[0], x1:o.band[1], alpha:0.55 }] : [], regions:regions, curves:curves, segments:segs, points:pts, labels:labels, describe:o.describe(t) });
  }
  plot.render = draw;
  return {
    t:function(){ return t; }, draw:draw, set:function(v){ if (cancel) cancel(); t = v; draw(); },
    to:function(target, done){ if (cancel) cancel(); var from = t; cancel = MV.tween({ dur:1600, step:function(s){ t = from + (target - from) * s; draw(); }, done:function(){ t = target; cancel = null; draw(); if (done) done(); } }); }
  };
}

// ---------- Part 3: Above or below? ----------
var R3 = {
  r1:{ f:function(x){ return x * x * x; }, g:function(x){ return 4 * x; }, view:[-3, 3, -20, 20], xs:[-2, 0, 2], fT:"y = x³", gT:"y = 4x", dT:"y = x³ − 4x" },
  r2:{ f:function(x){ return x * x * x + x * x; }, g:function(x){ return 4 * x + 4; }, view:[-3, 3, -12, 20], xs:[-2, -1, 2], fT:"y = x³ + x²", gT:"y = 4x + 4", dT:"y = x³ + x² − 4x − 4" },
  r3:{ f:function(x){ return x * (14 - 2 * x) * (10 - 2 * x); }, g:function(){ return 96; }, view:[-1, 9, -60, 160], xs:[1, 3, 8], band:[0, 5], fT:"y = V(x)", gT:"y = 96", dT:"y = V(x) − 96" }
};
function part3(host, api){
  var C = api.content, S = api.S; S.cur = S.cur || "r1"; S.r = S.r || {};
  host.innerHTML = '<div class="chips p3-chips" role="group" aria-label="Choose a round"></div><h3 class="p3-title"></h3><p class="p3-text"></p>' +
    '<div class="sym p3-grid"><div class="p3-left"><div class="plot-wrap"><canvas class="plot" id="p3-plot" role="img" aria-label="Two graphs"></canvas></div>' +
    '<div class="q-actions p3-flatrow"><button type="button" class="btn primary sm" data-p="flat" data-k="p3flat">Flatten</button><span class="tiny muted p3-flatnote"></span></div><p class="p3-cap" aria-live="polite"></p>' +
    '<p class="p3-step"></p><div class="p3-ib"></div></div>' +
    '<div class="p3-right"><p class="how">' + C.how + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-p="check" data-k="p3chk">Check</button><span class="p3-hb"></span></div><div class="p3-hints"></div><div class="p3-fb" aria-live="polite"></div>' +
    '<details class="alg p3-alg"><summary>Check it with algebra</summary><div class="p3-algin"></div></details><div class="p3-cmp" aria-live="polite"></div></div></div>';
  var canvas = $("#p3-plot", host), plot = new MV.Plot(canvas, { xmin:-3, xmax:3, ymin:-20, ymax:20 }), ib = null, msg = null, morph = null;
  function round(){ return C.rounds.filter(function(r){ return r.id === S.cur; })[0]; }
  function rs(){ var r = round(); return S.r[r.id] || (S.r[r.id] = { step:0, steps:r.steps.map(function(){ return { build:null, tries:0, solved:false }; }), hint:0, flat:false }); }
  function viewFor(id){
    var R = R3[id], w = canvas.getBoundingClientRect().width || 400, span = R.view[1] - R.view[0], pad = 22 * span / Math.max(60, w - 44);
    return { xmin:R.view[0] - pad, xmax:R.view[1] + pad, ymin:R.view[2], ymax:R.view[3] };
  }
  function setup(){
    var r = round(), R = R3[r.id], x = rs();
    $(".p3-title", host).innerHTML = r.chip + ": " + r.title; $(".p3-text", host).innerHTML = r.text;
    morph = flattenMorph(plot, { f:R.f, g:R.g, xs:R.xs, t:x.flat ? 1 : 0, view:function(){ return viewFor(r.id); }, band:R.band, bandLabel:r.band,
      shade:function(){ if (!x.steps[0].solved) return []; var w = r.id === "r2" ? "below" : "above", ps = r.id === "r1" ? [[-2, 0], [2, 3.5]] : r.id === "r2" ? [[-3.5, -2], [-1, 2]] : [[1, 3], [8, 9.5]];
        return ps.map(function(q){ return { x0:q[0], x1:q[1], where:w }; }); },
      describe:function(t){ return t >= 1 ? "Graph of " + R.dT + ", crossing the x-axis at " + list(R.xs.map(nm)) + "; the graph of f is shown dashed." : t > 0 ? "The second graph is flattening onto the x-axis while the first slides down by the same amount." : "Graphs of " + R.fT + " and " + R.gT + ", meeting at x = " + list(R.xs.map(nm)) + "."; } });
    paint(true);
  }
  function makeBuilder(){
    var r = round(), R = R3[r.id], x = rs(), sx = x.steps[x.step];
    var holder = $(".p3-ib", host), d = document.createElement("div"); holder.innerHTML = ""; holder.appendChild(d);
    ib = MV.intervalBuilder(d, { min:R.view[0], max:R.view[1], maxPieces:3, modes:false, test:false, readout:false, halfToggle:false, aria:"Number line for your answer",
      pieces:[{ a:R.view[0] + 1, b:R.view[0] + 3, aIn:true, bIn:true }],
      onChange:function(s){ var y = rs().steps[rs().step]; if (!y.solved) { y.build = s; api.save(); } } });
    if (sx.build) ib.set(sx.build, true);
  }
  function paint(rebuild){
    var r = round(), x = rs(), sx = x.steps[x.step], step = r.steps[x.step];
    MV.keepFocus($(".p3-chips", host), function(){ $(".p3-chips", host).innerHTML = C.rounds.map(function(q){ var y = S.r[q.id], done = y && y.steps.every(function(s){ return s.solved; }); return '<button type="button" class="fchip txt" data-r="' + q.id + '" data-k="p3r' + q.id + '" aria-pressed="' + (q.id === S.cur) + '">' + (done ? "✓ " : "") + q.chip + "</button>"; }).join(""); });
    $(".p3-step", host).innerHTML = "<strong>" + step.prompt + "</strong>";
    if (rebuild) makeBuilder();
    var canFlat = x.steps[0].tries > 0 || x.steps[0].solved;
    var fb = $('[data-p="flat"]', host); fb.disabled = !canFlat; fb.textContent = x.flat ? "Unflatten" : "Flatten";
    $(".p3-flatnote", host).textContent = canFlat ? "" : "Check your first answer to unlock Flatten.";
    $(".p3-cap", host).innerHTML = x.flat ? C.flatCap : "";
    $('[data-p="check"]', host).disabled = sx.solved;
    $(".p3-hb", host).innerHTML = x.steps.every(function(s){ return s.solved; }) ? "" : MV.hintBtn("p3h" + r.id, x.hint);
    $(".p3-hints", host).innerHTML = x.steps.every(function(s){ return s.solved; }) ? "" : MV.hintsHTML(r.hints, x.hint);
    var f = "";
    x.steps.forEach(function(s, i){ if (s.solved) f += MV.fbHTML("good", "<strong>✓ Correct: " + m(MV.ans(r.steps[i])) + ".</strong>" + (r.steps.length > 1 ? " (" + (i === 0 ? "step 1" : "step 2") + ")" : "")); });
    if (msg) f += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg);
    if (sx.solved && x.step < r.steps.length - 1) f += '<div class="q-actions"><button type="button" class="btn primary sm" data-p="next" data-k="p3next">Go to step 2</button></div>';
    $(".p3-fb", host).innerHTML = f;
    var alg = $(".p3-alg", host), open = alg.open;
    $(".p3-algin", host).innerHTML = '<div class="alg-lines">' + r.alg.map(function(l){ return "<span>" + l + "</span>"; }).join("") + '</div><div class="p3-chart"></div><p style="margin:10px 0 0"><strong>' + (r.id === "r3" ? "" : "Solution: ") + "</strong>" + r.sol + "</p>" + (r.why96 ? '<div class="refresh" style="margin-top:10px"><h4>' + r.why96.title + "</h4><p>" + r.why96.html + "</p></div>" : "");
    var ch = signChart($(".p3-chart", host)); ch.render({ zs:P.z(r.chart.f), a:r.chart.a, xmin:R3[r.id].view[0], xmax:R3[r.id].view[1], equal:true, vlines:false });
    alg.open = open || x.flat;
    var cmp = "";
    if (x.flat) x.steps.forEach(function(s, i){
      var mine = s.build ? iv.text(iv.norm(s.build.pieces.map(function(p){ return { a:p.aInf ? -Infinity : p.a, b:p.bInf ? Infinity : p.b, aIn:p.aIn, bIn:p.bIn }; }))) : null;
      if (!mine) return;
      cmp += s.solved ? MV.fbHTML("good", "<strong>✓</strong> Your marked answer" + (r.steps.length > 1 ? " (step " + (i + 1) + ")" : "") + ": " + m(mine) + ".") : MV.fbHTML("", fill(C.note, { got:m(mine) }));
    });
    $(".p3-cmp", host).innerHTML = cmp;
    morph.draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var r = round(), x = rs();
    if (b.dataset.r) { S.cur = b.dataset.r; msg = null; api.save(); setup(); return; }
    if (b.dataset.act === "hint" && b.closest(".p3-hb")) { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.p === "flat") { x.flat = !x.flat; api.save(); morph.to(x.flat ? 1 : 0); paint(); return; }
    if (b.dataset.p === "next") { x.step = Math.min(r.steps.length - 1, x.step + 1); msg = null; api.save(); paint(true); return; }
    if (b.dataset.p === "check") {
      var sx = x.steps[x.step], step = r.steps[x.step], got = iv.text(ib.merged());
      sx.build = ib.get();
      if (got === MV.ans(step)) { sx.solved = true; sx.first = sx.tries === 0 && x.hint < 3; msg = null; }
      else { sx.tries++; msg = (step.wrong && step.wrong[got]) || fill(C.other, { got:m(got) }); }
      api.save(); paint(); MV.focusFb($(".p3-right", host));
    }
  });
  setup();
}

// ---------- Practice 1: Solve with a sign chart ----------
function chartAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var X = MV.C.explore;
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="ca-n"></span><span class="dots" id="ca-dots" aria-hidden="true"></span></div><p class="pred-q ca-q" id="ca-q"></p>' +
    '<div class="pg ca-pg"><div class="pg-graph">' + layersHTML("ca-lay") + '</div><div class="pg-read"><div id="ca-panel"></div></div></div><div class="q-actions"><button type="button" class="btn ghost sm" id="ca-prev">Previous</button><button type="button" class="btn ghost sm" id="ca-next">Next inequality</button></div>';
  var L = layers($("#ca-lay", host)), eng = null;
  function ist(){ var it = a.items[S.i]; return S.items[it.id] || (S.items[it.id] = {}); }
  function load(){
    var it = a.items[S.i];
    $("#ca-n", host).textContent = "Inequality " + (S.i + 1) + " of " + a.items.length;
    $("#ca-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#ca-q", host).innerHTML = "Solve " + it.ineq + ".";
    $("#ca-prev", host).disabled = S.i === 0; $("#ca-next", host).disabled = S.i === a.items.length - 1;
    var pn = $("#ca-panel", host), fresh = document.createElement("div"); pn.innerHTML = ""; pn.appendChild(fresh);
    eng = chartBuild({ item:it, st:ist(), X:X, L:L, panel:fresh, mode:"reward", save:api.save, onSolved:function(){ api.save(); MV.wait(30, function(){ load(); MV.focusFb(fresh); }); } });
  }
  nlTap(L.np, function(x){ if (eng) eng.tap(x); });
  host.addEventListener("click", function(e){ var b = e.target.closest("#ca-prev, #ca-next"); if (!b || b.disabled) return; S.i += b.id === "ca-prev" ? -1 : 1; api.save(); load(); });
  load();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (Object.keys(y.tries || {}).some(function(k){ return y.tries[k] > 0; }) || Object.keys(y.hint || {}).some(function(k){ return y.hint[k] >= 3; }))) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 3: Work backwards (number entry, interval builder, choice in retry mode) ----------
function backAct(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  host.innerHTML = '<div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div><div class="pred-q" id="wb-q"></div><div id="wb-in"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check">Check</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev">Previous</button><button type="button" class="btn ghost sm" id="wb-next">Next problem</button></div>';
  var ib = null, msg = {};
  function ist(){ var it = a.items[S.i]; return S.items[it.id] || (S.items[it.id] = { tries:0, hint:0, solved:false, first:null, v:"", build:null, ch:null }); }
  function load(){
    var it = a.items[S.i], x = ist(), inp = $("#wb-in", host);
    $("#wb-n", host).textContent = "Problem " + (S.i + 1) + " of " + a.items.length + (it.star ? " ★" : "");
    $("#wb-q", host).innerHTML = it.prompt;
    ib = null;
    if (it.kind === "num") {
      inp.innerHTML = '<div class="numrow"><label for="wb-v">' + it.label + '</label><input class="numin short" id="wb-v" type="number" step="any" autocomplete="off" value="' + MV.esc(x.v) + '"' + (x.solved ? " disabled" : "") + "></div>";
      $("#wb-v", host).addEventListener("input", function(e){ ist().v = e.target.value; api.save(); });
    } else if (it.kind === "iv") {
      inp.innerHTML = '<div class="wb-ib"></div>';
      ib = MV.intervalBuilder($(".wb-ib", host), { min:-10, max:10, maxPieces:3, modes:false, test:false, readout:false, halfToggle:false, aria:"Number line for your answer", pieces:[{ a:-2, b:2, aIn:true, bIn:true }],
        onChange:function(s){ var y = ist(); if (!y.solved) { y.build = s; api.save(); } } });
      if (x.build) ib.set(x.build, true);
    } else {
      inp.innerHTML = '<div class="opts" role="group" aria-label="Choices">' + it.options.map(function(op, i){ var c = "opt" + (x.solved && MV.ok(op) ? " right" : "") + (!x.solved && x.ch === i ? " picked" : ""); return '<button type="button" class="' + c + '" data-ch="' + i + '" data-k="wbc' + i + '" aria-pressed="' + (x.ch === i) + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + op.t + "</span></button>"; }).join("") + "</div>";
    }
    paint();
  }
  function paint(){
    var it = a.items[S.i], x = ist();
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-check", host).disabled = x.solved;
    $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint);
    $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    var ans = MV.ans(it), shown = it.kind === "num" ? m(nm(ans)) : it.kind === "iv" ? m(ans) : "";
    $("#wb-fb", host).innerHTML = x.solved ? '<div class="fb good"><p><strong>✓ Correct' + (shown ? ": " + shown : "") + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p><p>" + (it.why || (it.options || []).filter(MV.ok).map(function(o){ return o.why; })[0] || "") + "</p></div>" :
      (msg[it.id] ? '<div class="fb bad"><p><strong>✗ Not quite.</strong> ' + msg[it.id] + "</p></div>" : "");
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var it = a.items[S.i], x = ist();
    if (b.id === "wb-prev" || b.id === "wb-next") { S.i += b.id === "wb-prev" ? -1 : 1; api.save(); load(); return; }
    if (b.dataset.act === "hint" && b.closest("#wb-hint")) { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.ch != null) { x.ch = +b.dataset.ch; msg[it.id] = null; api.save(); load(); return; }
    if (b.id !== "wb-check") return;
    var ok = false, fb = null;
    if (it.kind === "num") {
      var v = MV.parseNum(x.v);
      if (!v || v.length !== 1) fb = "Type a single number.";
      else { ok = Math.abs(v[0] - MV.ans(it)) < 1e-9; if (!ok) { var w = (it.wrong || []).filter(function(q){ return Math.abs(q.v - v[0]) < 1e-9; })[0]; fb = w ? w.fb + " Try again." : "Check your work and try again."; } }
    } else if (it.kind === "iv") {
      var got = iv.text(ib.merged()); x.build = ib.get(); ok = got === MV.ans(it);
      if (!ok) fb = (it.wrong && it.wrong[got] ? it.wrong[got] + " Try again." : "Your answer is " + m(got) + ". Check each piece and each endpoint, then try again.");
    } else {
      if (x.ch == null) fb = "Choose an answer first.";
      else { ok = MV.ok(it.options[x.ch]); if (!ok) fb = it.options[x.ch].why + " Try again."; }
    }
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
    else if (fb) { if (!/^(Type|Choose)/.test(fb)) x.tries++; msg[it.id] = fb; }
    api.save(); if (it.kind === "mc") load(); else { if (it.kind === "num" && ok) $("#wb-v", host).disabled = true; paint(); }
    MV.focusFb(host);
  });
  load();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design the solution set ----------
var task = (function(){
  var api = null, gp = null, np = null, aSl = null, seg = null;
  function read(){ var s = api ? api.S : {}; return { z:(s.z || []).map(function(q){ return q.slice(); }), a:s.a == null ? 1 : s.a, sym:s.sym || "≥" }; }
  function zsOf(d){ return P.z(d.z); }
  function val(d, x){ return P.f(zsOf(d), d.a)(x); }
  function sat(d, x){ return P.sat(P.sign(zsOf(d), d.a, x), d.sym); }
  function draw(){
    var d = read(), Z = zsOf(d), so = P.solve(Z, d.a, d.sym), ym = P.fit(Z, d.a), w = P.want(d.sym) > 0 ? "above" : "below";
    drawGraph(gp, { view:{ xmin:-6, xmax:6, ymin:-ym, ymax:ym }, f:P.f(Z, d.a), zdots:Z.map(function(z){ return { x:z.r, label:nm(z.r) }; }),
      shade:so.filter(function(q){ return q.a !== q.b; }).map(function(q){ return { x0:Math.max(-6.5, q.a), x1:Math.min(6.5, q.b), where:w }; }),
      describe:P.describe(Z, d.a, so) + " Shaded where " + MV.plain(m(P.polyM(Z, d.a) + " " + d.sym + " 0")) + ": " + iv.text(so) + "." });
    drawNL(np, { xmin:-6, xmax:6, pieces:so, targets:[{ pt:-2 }, { pt:1 }, { a:0, b:2 }, { a:4, b:Infinity }], describe:"Number line: your solution " + iv.text(so) + ". Targets marked: the points −2 and 1, the interval (0, 2) and the ray from 4." });
    $("#tk-eq").innerHTML = m(P.polyM(Z, d.a, true) + " " + d.sym + " 0");
    $("#tk-sol").innerHTML = "Solution: " + m(iv.text(so).replace("∅", "no solution (∅)"));
  }
  function slots(){
    var d = read(), deg = d.z.reduce(function(s, q){ return s + q[1]; }, 0);
    var h = d.z.map(function(q, i){
      return '<div class="sc-zc tk-z"><div class="sc-zt"><strong>Zero ' + (i + 1) + ':</strong><span class="sb-step"><button type="button" class="btn ghost sm sb-pm" data-t="zm" data-i="' + i + '" data-k="tkzm' + i + '" aria-label="Move zero ' + (i + 1) + ' left">−</button><output>' + m("x = " + nm(q[0])) + '</output><button type="button" class="btn ghost sm sb-pm" data-t="zp" data-i="' + i + '" data-k="tkzp' + i + '" aria-label="Move zero ' + (i + 1) + ' right">+</button></span><button type="button" class="btn ghost sm" data-t="rm" data-i="' + i + '" data-k="tkrm' + i + '">Remove</button></div>' +
        '<div class="zb-ord" role="group" aria-label="Order of zero ' + (i + 1) + '"><span class="tiny">Order</span>' + [1, 2, 3].map(function(o){ return '<button type="button" class="chip' + (o === q[1] ? " on" : "") + '" aria-pressed="' + (o === q[1]) + '" data-t="ord" data-i="' + i + '" data-o="' + o + '" data-k="tkord' + i + o + '">' + o + "</button>"; }).join("") + "</div></div>";
    }).join("");
    MV.keepFocus($("#tk-slots"), function(){ $("#tk-slots").innerHTML = (h || '<p class="tiny muted">No zeros yet.</p>') + '<p class="tiny muted">Degree so far: ' + deg + '</p><button type="button" class="btn ghost sm" data-t="add" data-k="tkadd"' + (d.z.length >= 4 ? " disabled" : "") + ">Add a zero</button>"; });
  }
  function free(v, i){ return !(api.S.z || []).some(function(q, j){ return j !== i && q[0] === v; }); }
  function changed(){ api.save(); slots(); draw(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; if (!a.S.z) a.S.z = []; if (a.S.a == null) a.S.a = 1; if (!a.S.sym) a.S.sym = "≥";
      inp.innerHTML = '<p class="tiny muted">' + a.content.how + '</p><div id="tk-slots"></div><div id="tk-a"></div><div id="tk-sym"></div>';
      pv.innerHTML = '<p class="eq-cap tk-eq" id="tk-eq" aria-live="polite"></p><canvas class="plot" id="tk-g" role="img" aria-label="Graph preview"></canvas><canvas class="plot sc-nl tk-nl" id="tk-n" role="img" aria-label="Number line"></canvas><p id="tk-sol" aria-live="polite"></p>';
      gp = new MV.Plot($("#tk-g"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); gp.render = draw;
      np = new MV.Plot($("#tk-n"), { xmin:-6, xmax:6, ymin:-1, ymax:1 }); np.render = draw;
      aSl = MV.sliders($("#tk-a"), [{ id:"tka", label:m("@a{a}"), param:"a", min:-3, max:3, step:1, value:a.S.a, skip:[0] }], function(id, v){ a.S.a = v; changed(); });
      seg = MV.seg($("#tk-sym"), { label:"Symbol:", options:[{ id:"<", t:"<" }, { id:"≤", t:"≤" }, { id:">", t:">" }, { id:"≥", t:"≥" }], value:a.S.sym, onChange:function(v){ a.S.sym = v; changed(); } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-t]"); if (!b || b.disabled) return;
        var z = a.S.z, i = +b.dataset.i, t = b.dataset.t;
        if (t === "add") { for (var d = 0; d <= 5; d++) { var c = [d, -d].filter(function(v){ return free(v, -1); })[0]; if (c != null) { z.push([c, 1]); break; } } }
        else if (t === "rm") z.splice(i, 1);
        else if (t === "ord") z[i][1] = +b.dataset.o;
        else if (t === "zm" || t === "zp") { var dir = t === "zp" ? 1 : -1, v = z[i][0] + dir; while (v >= -5 && v <= 5 && !free(v, i)) v += dir; if (v >= -5 && v <= 5) z[i][0] = v; }
        changed();
      });
      slots(); draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){
      var deg = d.z.reduce(function(s, q){ return s + q[1]; }, 0), whole = d.z.every(function(q){ return Number.isInteger(q[0]) && q[0] >= -5 && q[0] <= 5; });
      var rep = d.z.some(function(q, i){ return d.z.some(function(r, j){ return j !== i && r[0] === q[0]; }); });
      return [whole && !rep && deg === 4, sat(d, 1), !sat(d, 0.5) && !sat(d, 1.5), [4, 4.5, 5, 6].every(function(x){ return sat(d, x); }), !sat(d, -2)];
    },
    tips:function(d, res){
      var T = MV.C.task.tips, deg = d.z.reduce(function(s, q){ return s + q[1]; }, 0), out = [];
      res.forEach(function(ok, i){ if (ok) return; out.push(fill(T[i], { sum:deg, p1:m("P(1) = " + nm(val(d, 1))), p2:m("P(-2) = " + nm(val(d, -2))) })); });
      return out;
    },
    key:function(d){ return zsOf(d).map(function(z){ return z.r + ":" + z.k; }).join(","); },
    label:function(k){ return m(P.polyM(P.z(k.split(",").map(function(s){ return s.split(":").map(Number); })), 1)); },
    text:function(k){ return MV.plain(m(P.polyM(P.z(k.split(",").map(function(s){ return s.split(":").map(Number); })), 1))); }
  };
})();

// ---------- small question graphs ----------
function twoGraphs(p, view, f, g, fl, gl, desc){
  p.draw({ view:view, curves:[{ f:f, color:css("--pen"), width:3, arrows:true }, { f:g, color:css("--f3"), width:2.6, arrows:true }],
    labels:[{ x:fl[0], y:fl[1], text:"y = f(x)", color:css("--pen"), bg:true }, { x:gl[0], y:gl[1], text:"y = g(x)", color:css("--f3"), bg:true }], describe:desc });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ chart:chartAct, back:backAct },
  task:task,
  figures:{
    w5:function(p){ p.draw({ view:{ xmin:-3, xmax:5, ymin:-6, ymax:6 }, curves:[{ f:function(x){ return -(x + 1) * (x - 3); }, color:css("--pen"), width:3, arrows:true }], points:[{ x:-1, y:0, label:"(−1, 0)", below:true }, { x:3, y:0, label:"(3, 0)", below:true }, { x:1, y:4, label:"(1, 4)" }], describe:"Parabola opening down with zeros −1 and 3 and vertex (1, 4)" }); },
    t1a:function(p){ twoGraphs(p, { xmin:-4.5, xmax:3.5, ymin:-30, ymax:30 }, function(x){ return x * x * x + x * x; }, function(x){ return 6 * x; }, [-4.3, 24], [1.2, -24], "Graphs of f(x) = x³ + x² and g(x) = 6x on a grid. They meet three times; the meeting points are not labelled."); },
    t1b:function(p){ twoGraphs(p, { xmin:-2.5, xmax:4.5, ymin:-15, ymax:15 }, function(x){ return x * x * x - 2 * x * x; }, function(x){ return 3 * x; }, [3.2, -12], [-2.3, 12], "Graphs of f(x) = x³ − 2x² and g(x) = 3x on a grid. They meet three times; the meeting points are not labelled."); }
  }
});
})();
