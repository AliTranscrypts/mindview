// MDM4U 01 Sample Spaces: hero (two-coin tree), Outcome mapper (Explore: D1 tree, outcome table, list, value counts,
// D6 simulator, discrete/continuous cards), "Is it equally likely?" stations (Part 3), "Twenty-four sectors" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, F = MV.mdm.frac;

// @component radioGroup (copied from MHF4U 25; adds per-option disabling) — segmented control or chip row as a real radio
// group (arrow keys skip disabled options, roving tabindex, lock while animating)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)})
//   -> {set(id), get(), lock(bool), refresh()}
function radios(host, o){
  var val = String(o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = off(val) ? ids.filter(function(id){ return !off(id); })[0] : val;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') ; if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// @component D1 treeDiagram — sample-space tree diagram (HTML labels and leaf buttons over SVG branches).
// Stages of branches with labels and optional branch probabilities; leaves are buttons (tap to toggle; arrow keys move
// between leaves, Home/End; roving tabindex) or plain labels (tap:false); "down" (root at the top, leaves in a row) or
// "right" (root at the left, leaves in a column) layout, "auto" picks "down" when every leaf gets minLeaf px; grow animation
// (one level at a time); marked leaves and their paths in highlighter yellow; leafNote for path products (modules 05, 17, 21–23).
// t = treeDiagram(host, {
//   stages:[{ name:"Coin 1", branches:[{ id:"H", t:"H", p:"1/2" }] }],  children:function(path) -> branches (overrides stages:
//   use it for draws without replacement), leafText(path) -> html (default: labels joined), leafAria(path) -> text,
//   leafNote(path) -> html (shown after the leaf, e.g. a path product), showP:false (branch probabilities on the edges),
//   tap:true, onTap(key, path), orient:"auto"|"down"|"right", minLeaf:58, levelH:58, rowH:36, colW:96, maxH:460, bare:false,
//   stageNames:true, label:"Tree diagram" })
// Keys are the path ids joined with ",". t.mark(keys); t.reveal(r) (levels 0…r; fractions grow the next level);
// t.grow(from, to, done) -> cancel(); t.set(opts); t.render(); t.leaves() -> [{key, path}].
function treeDiagram(host, o){
  var marked = {}, rev = Infinity, fk = null, lastW = 0;
  host.classList.add("d1"); if (o.bare) host.classList.add("bare");
  host.innerHTML = '<div class="d1-scroll"><div class="d1-box"><svg class="d1-svg" aria-hidden="true" focusable="false"></svg><div class="d1-in" role="group"></div></div></div>';
  var scroll = host.querySelector(".d1-scroll"), box = host.querySelector(".d1-box"), svg = host.querySelector(".d1-svg"), inner = host.querySelector(".d1-in");
  function key(p){ return p.join(","); }
  function branchesAt(p){ if (o.children) return o.children(p) || []; var s = (o.stages || [])[p.length]; return s ? s.branches : []; }
  function build(){
    var leaves = [], all = [], root = { path:[], depth:0 };
    (function rec(n){ all.push(n); var bs = branchesAt(n.path); if (!bs.length) { n.leaf = true; leaves.push(n); return; }
      n.kids = bs.map(function(b){ return { path:n.path.concat([b.id]), b:b, depth:n.depth + 1, parent:n }; }); n.kids.forEach(rec); })(root);
    var D = 0; leaves.forEach(function(l){ D = Math.max(D, l.depth); });
    return { root:root, leaves:leaves, all:all, D:D };
  }
  function centre(n, prop){ if (n.leaf) return [n[prop], n[prop]]; var lo = Infinity, hi = -Infinity; n.kids.forEach(function(c){ var r = centre(c, prop); lo = Math.min(lo, r[0]); hi = Math.max(hi, r[1]); }); n[prop] = (lo + hi) / 2; return [lo, hi]; }
  function layout(T, W){
    var nL = T.leaves.length, D = T.D, orient = o.orient || "auto", names = o.stageNames !== false && !o.bare;
    if (orient === "auto") orient = nL * (o.minLeaf || 58) <= W ? "down" : "right";
    var g = { orient:orient, names:names };
    if (orient === "down") {
      var lw = W / Math.max(1, nL), lh = o.levelH || 58, top = 16;
      T.leaves.forEach(function(l, i){ l.x = lw * (i + 0.5); });
      centre(T.root, "x");
      T.all.forEach(function(n){ n.y = top + n.depth * lh; });
      g.leafY = top + D * lh + 38; g.H = g.leafY + 22; g.W = W;
    } else {
      var rowH = o.rowH || 36, top2 = names ? 30 : 10, left = 14, leafW = o.leafW || 92;
      var colW = Math.max(40, Math.min(o.colW || 96, (W - left - leafW - 30) / Math.max(1, D)));
      T.leaves.forEach(function(l, i){ l.y = top2 + rowH * (i + 0.5); });
      centre(T.root, "y");
      T.all.forEach(function(n){ n.x = left + n.depth * colW; });
      g.leafX = left + D * colW + 24; g.H = top2 + nL * rowH + 8; g.W = Math.max(W, g.leafX + leafW + 8); g.colW = colW; g.left = left;
    }
    return g;
  }
  function render(){
    var T = build(), W = Math.max(220, Math.floor(scroll.clientWidth || host.clientWidth || 320)); lastW = W;
    var g = layout(T, W), on = {}, onLeaf = {};
    Object.keys(marked).forEach(function(k){ if (!marked[k]) return; onLeaf[k] = 1; var p = k.split(","); for (var i = 1; i <= p.length; i++) on[p.slice(0, i).join(",")] = 1; });
    host.classList.toggle("right", g.orient === "right"); host.classList.toggle("down", g.orient === "down");
    if (o.maxH) scroll.style.maxHeight = o.maxH + "px";
    box.style.height = g.H + "px"; box.style.width = g.W + "px";
    svg.setAttribute("width", g.W); svg.setAttribute("height", g.H); svg.setAttribute("viewBox", "0 0 " + g.W + " " + g.H);
    var e = "", hi = "", h = "";
    var fx = function(v){ return Math.round(v * 10) / 10; };
    T.all.forEach(function(n){
      if (!n.parent) return;
      var f = Math.max(0, Math.min(1, rev - (n.depth - 1))); if (f <= 0) return;
      var x0 = n.parent.x, y0 = n.parent.y, x1 = x0 + (n.x - x0) * f, y1 = y0 + (n.y - y0) * f;
      var seg = "M" + fx(x0) + " " + fx(y0) + "L" + fx(x1) + " " + fx(y1);
      e += seg; if (on[key(n.path)] && f >= 1) hi += seg;
      if (o.showP && n.b.p != null && f >= 1) h += '<span class="d1-p" style="left:' + fx((x0 + n.x) / 2) + "px;top:" + fx((y0 + n.y) / 2 - (g.orient === "down" ? 0 : 10)) + 'px">' + n.b.p + "</span>";
      if (f > 0.55) h += '<span class="d1-lab' + (on[key(n.path)] ? " on" : "") + '" style="left:' + fx(n.x) + "px;top:" + fx(n.y) + "px" + (f < 1 ? ";opacity:" + ((f - 0.55) / 0.45).toFixed(2) : "") + '">' + n.b.t + "</span>";
    });
    T.leaves.forEach(function(l){ if (l.leaf && T.all.length > 1) {
      var k = key(l.path), x = g.orient === "down" ? l.x : g.leafX, y = g.orient === "down" ? g.leafY : l.y;
      if (rev < T.D) return;
      var con = g.orient === "right" ? "M" + fx(l.x + 14) + " " + fx(l.y) + "L" + fx(x - 4) + " " + fx(l.y) : "M" + fx(l.x) + " " + fx(l.y + 13) + "L" + fx(l.x) + " " + fx(y - 15);
      e += con; if (onLeaf[k]) hi += con;
      var txt = o.leafText ? o.leafText(l.path) : l.path.join(""), note = o.leafNote ? o.leafNote(l.path) : "";
      var aria = (o.leafAria ? o.leafAria(l.path) : MV.plain(txt)) + (note ? ", " + MV.plain(note) : "");
      if (o.tap === false) h += '<span class="d1-leaf' + (onLeaf[k] ? " on" : "") + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? ' <small>' + note + "</small>" : "") + "</span>";
      else h += '<button type="button" class="d1-leaf' + (onLeaf[k] ? " on" : "") + '" data-key="' + k + '" aria-pressed="' + !!onLeaf[k] + '" aria-label="' + MV.esc(aria) + '" tabindex="' + (k === fk ? 0 : -1) + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? ' <small>' + note + "</small>" : "") + "</button>";
    } });
    h = '<span class="d1-root" style="left:' + fx(T.root.x) + "px;top:" + fx(T.root.y) + 'px"></span>' + h;
    if (g.names && g.orient === "right") (o.stages || []).forEach(function(s, i){ if (rev >= i + 0.55) h += '<span class="d1-stage" style="left:' + fx(g.left + (i + 1) * g.colW) + 'px;top:4px">' + s.name + "</span>"; });
    svg.innerHTML = (hi ? '<path class="d1-hi" d="' + hi + '"/>' : "") + '<path class="d1-e" d="' + e + '"/>';
    var had = inner.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    inner.setAttribute("aria-label", o.label || "Tree diagram");
    inner.innerHTML = h;
    var leafBtns = inner.querySelectorAll("button.d1-leaf");
    if (leafBtns.length && !inner.querySelector('button[tabindex="0"]')) { leafBtns[0].tabIndex = 0; fk = leafBtns[0].dataset.key; }
    if (had) { var b = inner.querySelector('[data-key="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  inner.addEventListener("click", function(ev){ var b = ev.target.closest("button.d1-leaf"); if (!b) return; fk = b.dataset.key; if (o.onTap) o.onTap(b.dataset.key, b.dataset.key.split(",")); });
  inner.addEventListener("focusin", function(ev){ var b = ev.target.closest("button.d1-leaf"); if (!b) return; fk = b.dataset.key; Array.prototype.forEach.call(inner.querySelectorAll("button.d1-leaf"), function(x){ x.tabIndex = x === b ? 0 : -1; }); });
  inner.addEventListener("keydown", function(ev){
    var b = ev.target.closest("button.d1-leaf"); if (!b) return;
    var list = Array.prototype.slice.call(inner.querySelectorAll("button.d1-leaf")), i = list.indexOf(b), j = i;
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") j = Math.min(list.length - 1, i + 1);
    else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") j = Math.max(0, i - 1);
    else if (ev.key === "Home") j = 0; else if (ev.key === "End") j = list.length - 1; else return;
    ev.preventDefault(); list[j].focus(); list[j].scrollIntoView({ block:"nearest", inline:"nearest" });
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.floor(scroll.clientWidth); if (w && Math.abs(w - lastW) > 2) render(); }).observe(scroll);
  return {
    mark:function(keys){ marked = {}; (keys || []).forEach(function(k){ marked[k] = 1; }); },
    reveal:function(r){ rev = r == null ? Infinity : r; },
    grow:function(from, to, done){
      var live = true, stop = null, lvl = from;
      function next(){
        if (!live) return;
        if (lvl >= to) { rev = Infinity; render(); if (done) done(); return; }
        var a = lvl; stop = MV.tween({ dur:620, ease:function(t){ return t; }, step:function(t){ rev = a + t; render(); }, done:function(){ lvl = a + 1; rev = lvl; render(); setTimeout(next, MV.reduceMotion ? 0 : 380); } });
      }
      next();
      return function(){ live = false; if (stop) stop(); };
    },
    set:function(n){ Object.keys(n).forEach(function(k){ o[k] = n[k]; }); },
    render:render,
    leaves:function(){ return build().leaves.map(function(l){ return { key:key(l.path), path:l.path }; }); }
  };
}

// @component outcomeTable — two-stage sample-space table: stage 1 down the side, stage 2 across the top. Cells are buttons
// (tap to toggle; arrow keys move in 2-D, Home/End along a row; roving tabindex), cell text from cellText (an ordered pair or
// a combined value), optional light tint by value (tint -> 0…1, drawn as a --pen mix), marked cells in highlighter yellow,
// row-by-row fill animation (render({fill:true})).
// tb = outcomeTable(host, { rows:{name, items:[{id, t}]}, cols:{name, items}, cellText(ri, ci) -> html, cellAria(ri, ci) -> text,
//   tint(ri, ci) -> 0…1 | null, onTap(key, ri, ci), caption }) ; key = rowId + "," + colId.   tb.set(opts); tb.mark(keys); tb.render(o)
function outcomeTable(host, o){
  var marked = {}, fk = null;
  host.classList.add("ot-host");
  function render(opt){
    var R = o.rows.items, C = o.cols.items, had = host.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    if (fk && !R.some(function(r){ return C.some(function(c){ return r.id + "," + c.id === fk; }); })) fk = null;
    if (!fk) fk = R[0].id + "," + C[0].id;
    var h = '<div class="ot-wrap"><table class="ot' + (opt && opt.fill && !MV.reduceMotion ? " ot-fill" : "") + (C.length > 4 ? " wide" : "") + '">' + (o.caption ? '<caption class="vh">' + o.caption + "</caption>" : "") +
      '<thead><tr><th scope="col" class="ot-corner"><span class="ot-cn">' + o.cols.name + ' →</span><span class="ot-rn">' + o.rows.name + " ↓</span></th>" +
      C.map(function(c){ return '<th scope="col">' + c.t + "</th>"; }).join("") + "</tr></thead><tbody>";
    R.forEach(function(r, ri){
      h += '<tr style="animation-delay:' + (ri * 110) + 'ms"><th scope="row">' + r.t + "</th>" + C.map(function(c, ci){
        var k = r.id + "," + c.id, on = !!marked[k], t = o.tint ? o.tint(ri, ci) : null;
        return '<td><button type="button" class="ot-c' + (on ? " on" : "") + (t != null ? " tint" : "") + '" data-key="' + k + '" data-r="' + ri + '" data-c="' + ci + '" aria-pressed="' + on + '" tabindex="' + (k === fk ? 0 : -1) + '"' +
          (t != null ? ' style="--tint:' + Math.round(5 + t * 22) + '%"' : "") + ' aria-label="' + MV.esc(o.cellAria ? o.cellAria(ri, ci) : MV.plain(o.cellText(ri, ci))) + '">' + o.cellText(ri, ci) + "</button></td>";
      }).join("") + "</tr>";
    });
    host.innerHTML = h + "</tbody></table></div>";
    if (had) { var b = host.querySelector('[data-key="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("button.ot-c"); if (!b) return; fk = b.dataset.key; if (o.onTap) o.onTap(b.dataset.key, +b.dataset.r, +b.dataset.c); });
  host.addEventListener("focusin", function(e){ var b = e.target.closest("button.ot-c"); if (!b) return; fk = b.dataset.key; Array.prototype.forEach.call(host.querySelectorAll("button.ot-c"), function(x){ x.tabIndex = x === b ? 0 : -1; }); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("button.ot-c"); if (!b) return;
    var r = +b.dataset.r, c = +b.dataset.c, nr = o.rows.items.length, nc = o.cols.items.length;
    if (e.key === "ArrowDown") r = Math.min(nr - 1, r + 1); else if (e.key === "ArrowUp") r = Math.max(0, r - 1);
    else if (e.key === "ArrowRight") c = Math.min(nc - 1, c + 1); else if (e.key === "ArrowLeft") c = Math.max(0, c - 1);
    else if (e.key === "Home") c = 0; else if (e.key === "End") c = nc - 1; else return;
    e.preventDefault(); var nb = host.querySelector('button.ot-c[data-r="' + r + '"][data-c="' + c + '"]'); if (nb) nb.focus();
  });
  return { set:function(n){ Object.keys(n).forEach(function(k){ o[k] = n[k]; }); }, mark:function(keys){ marked = {}; (keys || []).forEach(function(k){ marked[k] = 1; }); }, render:render };
}

// @component D6 simulator — repeatable trials, running tallies and a running relative-frequency graph.
// sim = makeSim({ trial:function(rng) -> outcome key, seed:"…", repeatable:true })
//   sim.reset(); sim.setRepeatable(bool) (resets); sim.run(n, {step(sim), done(sim)}) (animated over ≤ 40 frames; instant with
//   reduced motion); sim.seq (outcome keys in order), sim.counts {key: n}, sim.hits(pred) -> count; sim.stop().
//   Repeatable runs use MV.mdm.seededRandom(seed), so every device gets the same sequence (model data, challenges).
// drawRelFreq(plot, { seq, series:[{ pred(key) -> bool, color, theory }], describe })  running relative frequency of each
//   series (solid, 2.6 px) against the number of trials, with its theoretical value as a dashed line in the same colour.
function makeSim(o){
  var s = { seq:[], counts:{}, rep:o.repeatable !== false, seed:o.seed, rng:null, raf:null };
  function stop(){ if (s.raf) cancelAnimationFrame(s.raf); s.raf = null; }
  function one(){ var k = o.trial(s.rng); s.seq.push(k); s.counts[k] = (s.counts[k] || 0) + 1; }
  s.reset = function(){ stop(); s.seq = []; s.counts = {}; s.rng = MV.mdm.seededRandom(s.rep ? s.seed : Math.floor(Math.random() * 4294967296)); };
  s.setRepeatable = function(b){ s.rep = !!b; s.reset(); };
  s.run = function(n, cb){
    stop(); cb = cb || {};
    if (MV.reduceMotion) { for (var i = 0; i < n; i++) one(); if (cb.step) cb.step(s); if (cb.done) cb.done(s); return; }
    var left = n, frames = Math.min(40, Math.max(5, Math.ceil(n / 12))), per = Math.ceil(n / frames);
    (function tick(){ var m = Math.min(per, left); for (var j = 0; j < m; j++) one(); left -= m; if (cb.step) cb.step(s);
      if (left > 0) s.raf = requestAnimationFrame(tick); else { s.raf = null; if (cb.done) cb.done(s); } })();
  };
  s.hits = function(pred){ var h = 0; for (var i = 0; i < s.seq.length; i++) if (pred(s.seq[i])) h++; return h; };
  s.stop = stop; s.busy = function(){ return !!s.raf; };
  s.reset();
  return s;
}
function drawRelFreq(plot, o){
  var seq = o.seq, n = seq.length, xmax = Math.max(10, n), every = Math.max(1, Math.ceil(n / 600)), curves = [], segs = [], pts1 = [];
  o.series.forEach(function(s){
    var h = 0, pts = [];
    for (var i = 0; i < n; i++) { if (s.pred(seq[i])) h++; if ((i + 1) % every === 0 || i === n - 1) pts.push([i + 1, h / (i + 1)]); }
    if (pts.length > 1) curves.push({ pts:pts, color:s.color, width:2.6 }); else if (pts.length === 1) pts1.push({ x:pts[0][0], y:pts[0][1], color:s.color, r:4 });
    if (s.theory != null) segs.push({ x1:0, y1:s.theory, x2:xmax, y2:s.theory, color:s.color, width:1.6, dash:[7, 6] });
  });
  plot.draw({ view:{ xmin:-xmax * 0.07, xmax:xmax * 1.02, ymin:-0.08, ymax:1.06 }, grid:true, yTicks:{ step:0.25, fmt:function(v){ return MV.num(v, 2); } },
    xTicks:{ fmt:function(v){ return MV.num(v, 0); } }, curves:curves, segments:segs, points:pts1, xLabel:"trials", yLabel:"relative frequency", describe:o.describe });
}

// @component spinnerDraw — spinner on a Plot canvas (data units: centre (0, 0), radius 1, equal-scale view): sectors
// [{deg, label, color, sub}] clockwise from 12 o'clock, letters always drawn (in --sheet on the colour), optional split lines
// every splitDeg (progress 0…1), a pointer, and a highlight that dims the other sectors.
function drawSpinner(ctx, p, o){
  var cx = p.X(0), cy = p.Y(0), R = Math.abs(p.X(1) - p.X(0)), a0 = -Math.PI / 2, start = 0, sheet = css("--sheet"), ink = css("--ink");
  var font = (o.small ? "600 " + Math.max(10, Math.round(R * 0.11)) + "px " : "700 " + Math.round(R * 0.2) + "px ") + (css("--font-math") || "serif");
  o.sectors.forEach(function(s){
    var a = a0 + start * Math.PI / 180, b = a0 + (start + s.deg) * Math.PI / 180, dim = o.hi && o.hi !== s.label;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a, b); ctx.closePath();
    ctx.globalAlpha = dim ? 0.35 : 1; ctx.fillStyle = s.color; ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineWidth = o.small ? 1 : 2; ctx.strokeStyle = sheet; ctx.stroke();
    s._a = a; s._b = b; start += s.deg;
  });
  if (o.split) {
    var t = o.splitT == null ? 1 : o.splitT; ctx.strokeStyle = sheet; ctx.lineWidth = 3.5; ctx.beginPath();
    for (var d = 0; d < 360; d += o.split) { var ang = a0 + d * Math.PI / 180; ctx.moveTo(cx, cy); ctx.lineTo(cx + R * t * Math.cos(ang), cy + R * t * Math.sin(ang)); }
    ctx.stroke();
  }
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = font;
  (o.labels || o.sectors.map(function(s){ return { mid:(s._a + s._b) / 2, label:s.label, sub:s.sub }; })).forEach(function(l){
    var mid = l.mid != null ? l.mid : a0 + l.deg * Math.PI / 180, r = R * (o.small ? 0.82 : l.sub ? 0.58 : 0.62);
    ctx.globalAlpha = l.alpha == null ? 1 : l.alpha; ctx.fillStyle = o.hi && l.label !== o.hi ? ink : sheet;
    ctx.fillText(l.label, cx + r * Math.cos(mid), cy + r * Math.sin(mid) - (l.sub ? R * 0.07 : 0));
    if (l.sub) { ctx.font = "600 " + Math.round(R * 0.11) + "px " + (css("--font-ui") || "sans-serif"); ctx.fillText(l.sub, cx + r * Math.cos(mid), cy + r * Math.sin(mid) + R * 0.12); ctx.font = font; }
    ctx.globalAlpha = 1;
  });
  if (o.hi) o.sectors.forEach(function(s){ if (s.label !== o.hi) return; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R + 3, s._a, s._b); ctx.closePath(); ctx.lineWidth = 4; ctx.strokeStyle = css("--hi"); ctx.stroke(); });
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
  if (o.pointer !== false) { ctx.fillStyle = ink; ctx.beginPath(); ctx.moveTo(cx, cy - R - 2); ctx.lineTo(cx - 9, cy - R - 18); ctx.lineTo(cx + 9, cy - R - 18); ctx.closePath(); ctx.fill(); }
  ctx.beginPath(); ctx.arc(cx, cy, Math.max(4, R * 0.035), 0, Math.PI * 2); ctx.fillStyle = ink; ctx.fill();
}
var LET = { A:"--ev-a", B:"--ev-b", C:"--ev-c" };
function Pw(words){ return '<span class="m"><i>P</i>(' + words + ")</span>"; }   // P(words) with upright words

// ---------- the sample-space model ----------
var COIN = [{ id:"H", t:"H" }, { id:"T", t:"T" }];
function nums(n){ var a = []; for (var i = 1; i <= n; i++) a.push({ id:String(i), t:String(i) }); return a; }
var DIE = nums(6), SPIN = nums(4);
function st(name, b){ return { name:name, branches:b }; }
var EXPS = {
  c1:{ name:"One coin", stages:[st("Coin", COIN)], kind:"coin" },
  c2:{ name:"Two coins", stages:[st("Coin 1", COIN), st("Coin 2", COIN)], kind:"coin" },
  c3:{ name:"Three coins", stages:[st("Coin 1", COIN), st("Coin 2", COIN), st("Coin 3", COIN)], kind:"coin" },
  d1:{ name:"One die", stages:[st("Die", DIE)], kind:"num" },
  d2:{ name:"Two dice", stages:[st("Die 1", DIE), st("Die 2", DIE)], kind:"pair", comb:true },
  cd:{ name:"Coin + die", stages:[st("Coin", COIN), st("Die", DIE)], kind:"coin" },
  s1:{ name:"Spinner (4 equal sectors, 1–4)", short:"Spinner", stages:[st("Spinner", SPIN)], kind:"num" },
  s2:{ name:"Two spinners", stages:[st("Spinner 1", SPIN), st("Spinner 2", SPIN)], kind:"pair", comb:true }
};
var EXP_ORDER = ["c1", "c2", "c3", "d1", "d2", "cd", "s1", "s2"];
function paths(e){ var out = [[]]; e.stages.forEach(function(s){ var n = []; out.forEach(function(p){ s.branches.forEach(function(b){ n.push(p.concat([b.id])); }); }); out = n; }); return out; }
function keyOf(p){ return p.join(","); }
function nH(p){ return p.filter(function(x){ return x === "H"; }).length; }
var COMB = {
  sum:{ t:"Sum", f:function(a, b){ return a + b; }, noun:"sums", ev:"Sum is " },
  prod:{ t:"Product", f:function(a, b){ return a * b; }, noun:"products", ev:"Product is " },
  max:{ t:"Larger number", f:Math.max, noun:"larger numbers", ev:"Larger number is " }
};
function cval(p, comb){ return COMB[comb].f(+p[0], +p[1]); }
function isPrime(n){ return n === 2 || n === 3 || n === 5 || n === 7 || n === 11; }
var EVENTS = {
  c1:[{ id:"h", t:"Heads", f:function(p){ return p[0] === "H"; } }, { id:"t", t:"Tails", f:function(p){ return p[0] === "T"; } }],
  c2:[{ id:"h2", t:"Two heads", f:function(p){ return nH(p) === 2; } }, { id:"h1", t:"One of each", f:function(p){ return nH(p) === 1; } },
      { id:"h0", t:"No heads", f:function(p){ return nH(p) === 0; } }, { id:"ge1", t:"At least one head", f:function(p){ return nH(p) >= 1; } }],
  c3:[{ id:"h3", t:"Exactly three heads", f:function(p){ return nH(p) === 3; } }, { id:"h2", t:"Exactly two heads", f:function(p){ return nH(p) === 2; } },
      { id:"h1", t:"Exactly one head", f:function(p){ return nH(p) === 1; } }, { id:"h0", t:"No heads", f:function(p){ return nH(p) === 0; } },
      { id:"ge1", t:"At least one head", f:function(p){ return nH(p) >= 1; } }, { id:"ge2", t:"At least two heads", f:function(p){ return nH(p) >= 2; } }],
  d1:[{ id:"even", t:"Even number", f:function(p){ return +p[0] % 2 === 0; } }, { id:"gt4", t:"Greater than 4", f:function(p){ return +p[0] > 4; } },
      { id:"prime", t:"A prime number", f:function(p){ return isPrime(+p[0]); } }, { id:"six", t:"A 6", f:function(p){ return p[0] === "6"; } }],
  d2:[{ id:"s7", t:"Sum is 7", f:function(p){ return +p[0] + +p[1] === 7; } }, { id:"dbl", t:"Doubles", f:function(p){ return p[0] === p[1]; } },
      { id:"s10", t:"Sum is at least 10", f:function(p){ return +p[0] + +p[1] >= 10; } }, { id:"pev", t:"Product is even", f:function(p){ return (+p[0] * +p[1]) % 2 === 0; } }],
  cd:[{ id:"he", t:"Heads and an even number", f:function(p){ return p[0] === "H" && +p[1] % 2 === 0; } }, { id:"t6", t:"Tails and a 6", f:function(p){ return p[0] === "T" && p[1] === "6"; } },
      { id:"gt4", t:"A number greater than 4", f:function(p){ return +p[1] > 4; } }],
  s1:[{ id:"even", t:"Even number", f:function(p){ return +p[0] % 2 === 0; } }, { id:"lt3", t:"Less than 3", f:function(p){ return +p[0] < 3; } }, { id:"four", t:"A 4", f:function(p){ return p[0] === "4"; } }],
  s2:[{ id:"s5", t:"Sum is 5", f:function(p){ return +p[0] + +p[1] === 5; } }, { id:"dbl", t:"Doubles", f:function(p){ return p[0] === p[1]; } },
      { id:"both", t:"Both even", f:function(p){ return +p[0] % 2 === 0 && +p[1] % 2 === 0; } }, { id:"s6", t:"Sum is at least 6", f:function(p){ return +p[0] + +p[1] >= 6; } }]
};
function outText(e, p, comb){
  if (e.kind === "pair") { var s = "(" + p[0] + ", " + p[1] + ")"; return comb && comb !== "pairs" ? s + " → " + cval(p, comb) : s; }
  return p.join("");
}
function outAria(e, p, comb){
  var w = p.map(function(x, i){ var nm = e.stages[i].name.toLowerCase(); return nm + (x === "H" ? " heads" : x === "T" ? " tails" : " shows " + x); }).join(", ");
  return w + (e.kind === "pair" && comb && comb !== "pairs" ? ", " + COMB[comb].t.toLowerCase() + " " + cval(p, comb) : "");
}

// ---------- Explore: discrete or continuous? cards ----------
function range(a, b, s){ var o = []; for (var v = a; v <= b + 1e-9; v += s) o.push(Math.round(v * 10) / 10); return o; }
var DC = [
  { t:"Number of heads in 5 flips", d:true, set:"{0, 1, 2, 3, 4, 5}", nl:{ min:-1, max:7, step:1 }, dots:range(0, 5, 1) },
  { t:"Time to run 100 m", d:false, set:"any time from 9.5 s to 20 s", nl:{ min:8, max:22, step:2 }, iv:[9.5, 20] },
  { t:"Number of texts received today", d:true, set:"{0, 1, 2, 3, …}", nl:{ min:-1, max:12, step:1 }, dots:range(0, 10, 1), more:true },
  { t:"Mass of an apple", d:false, set:"any mass from 100 g to 350 g", nl:{ min:50, max:400, step:50 }, iv:[100, 350] },
  { t:"Number of goals in a game", d:true, set:"{0, 1, 2, 3, …}", nl:{ min:-1, max:12, step:1 }, dots:range(0, 10, 1), more:true },
  { t:"Length of a phone call", d:false, set:"any length from 0 min to 60 min", nl:{ min:-10, max:70, step:10 }, iv:[0, 60] },
  { t:"Shoe size sold", d:true, set:"{5, 5.5, 6, 6.5, …, 13}", nl:{ min:4, max:14, step:1 }, dots:range(5, 13, 0.5) },
  { t:"Temperature at noon", d:false, set:"any temperature from −30 °C to 35 °C", nl:{ min:-40, max:40, step:10 }, iv:[-30, 35] }
];

// ---------- Explore: the Outcome mapper ----------
function explore(host, api){
  var S = api.S;
  S.mode = S.mode || "map"; S.exp = EXPS[S.exp] ? S.exp : "d2"; S.view = S.view || "table"; S.comb = S.comb || "pairs";
  S.ev = S.ev || "none"; S.marks = S.marks || []; S.rep = S.rep !== false; S.dc = S.dc || { card:0, mapped:{} };
  var pv = {}, anim = null, sims = {};
  host.innerHTML =
    '<div class="ss-modes" id="ss-modes"></div>' +
    '<div class="pg ss-pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap" id="ss-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="ss-map"><p class="tiny muted ss-what" id="ss-what"></p><div id="ss-tree" hidden></div><div id="ss-table" hidden></div><div id="ss-list" hidden></div></div>' +
      '<div id="ss-dc" hidden><p class="ss-dc-t" id="ss-dc-t"></p><div class="plot-wrap"><canvas class="plot nl" id="ss-dcnl" role="img" aria-label="Number line"></canvas></div><p class="ss-dc-set" id="ss-dc-set" aria-live="polite"></p></div></div>' +
    '<div class="pg-ctrl"><div id="ss-ctl-map"><div id="ss-exp"></div><div id="ss-view"></div><div id="ss-comb"></div>' +
      '<div class="ss-evrow"><label for="ss-ev">Event</label><select id="ss-ev" class="ss-sel"></select></div><p class="tiny muted ss-taphint">Or tap outcomes to mark your own event.</p>' +
      '<div class="ss-simrow"><span class="rg-lab">Simulate</span><button type="button" class="btn sm" data-run="10">Run 10</button><button type="button" class="btn sm" data-run="100">Run 100</button><button type="button" class="btn sm" data-run="1000">Run 1000</button><button type="button" class="btn ghost sm" id="ss-simreset">Reset</button>' +
      '<label class="ss-check"><input type="checkbox" id="ss-rep"> Repeatable run</label></div></div>' +
      '<div id="ss-ctl-dc" hidden><div id="ss-cards"></div><div class="q-actions"><button type="button" class="btn primary sm" id="ss-mapit">Map it</button></div></div></div>' +
    '<div class="pg-read"><div id="ss-vals"></div><div id="ss-simbox" hidden><div class="plot-wrap"><canvas class="plot" id="ss-simplot" role="img" aria-label="Relative frequency graph"></canvas></div><p class="legend tiny" id="ss-simleg"></p></div><dl class="read" id="ss-read"></dl></div></div>';
  var treeHost = $("#ss-tree", host), tableHost = $("#ss-table", host), listHost = $("#ss-list", host);
  var tree = treeDiagram(treeHost, { stages:EXPS.c2.stages, tap:true, orient:"auto", maxH:460, label:"Tree diagram: tap a leaf to mark that outcome", onTap:tapOut });
  var table = outcomeTable(tableHost, { rows:{ name:"", items:[] }, cols:{ name:"", items:[] }, cellText:function(){ return ""; }, onTap:tapOut });
  var simPlot = new MV.Plot($("#ss-simplot", host), { xmin:0, xmax:10, ymin:0, ymax:1 }), dcPlot = new MV.Plot($("#ss-dcnl", host), { xmin:0, xmax:10, ymin:-1, ymax:1 });
  simPlot.render = drawSim; dcPlot.render = drawDC;

  // --- controls ---
  var modeR = radios($("#ss-modes", host), { label:"Mode", options:[{ id:"map", t:"Map it" }, { id:"dc", t:"Discrete or continuous?" }, { id:"data", t:"Compare to data" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; save(); render(); } });
  var expR = radios($("#ss-exp", host), { label:"Experiment", options:EXP_ORDER.map(function(k){ return { id:k, t:EXPS[k].name }; }), value:S.exp, cls:"chips",
    onChange:function(v){ user(); setExp(v); save(); render({ fill:true }); MV.changed(); } });
  var viewR = radios($("#ss-view", host), { label:"View", options:[{ id:"list", t:"List" }, { id:"table", t:"Table" }, { id:"tree", t:"Tree" }], value:S.view, cls:"seg",
    disabled:function(id){ return id === "table" && EXPS[S.exp].stages.length !== 2; },
    onChange:function(v){ user(); S.view = v; save(); render({ fill:v === "table" }); MV.changed(); } });
  var combR = radios($("#ss-comb", host), { label:"Combine", options:[{ id:"pairs", t:"Ordered pairs" }, { id:"sum", t:"Sum" }, { id:"prod", t:"Product" }, { id:"max", t:"Larger number" }], value:S.comb, cls:"seg",
    onChange:function(v){ user(); S.comb = v; if (S.ev.indexOf("v:") === 0) { S.ev = "none"; S.marks = []; } save(); fillEvents(); render(); MV.changed(); } });
  var evSel = $("#ss-ev", host);
  evSel.addEventListener("change", function(){ var v = evSel.value; user(); chooseEvent(v); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.run) { runSim(+b.dataset.run); return; }
    if (b.id === "ss-simreset") { sim().reset(); render(); return; }
    if (b.dataset.val != null) { user(); chooseEvent("v:" + b.dataset.val); tc3Banner(+b.dataset.val); return; }
    if (b.id === "ss-mapit") { mapIt(); return; }
  });
  $("#ss-rep", host).checked = S.rep;
  $("#ss-rep", host).addEventListener("change", function(e){ S.rep = e.target.checked; save(); Object.keys(sims).forEach(function(k){ sims[k].setRepeatable(S.rep); }); render(); });
  var cardR = radios($("#ss-cards", host), { label:"Scenario cards", options:DC.map(function(c, i){ return { id:i, t:c.t }; }), value:S.dc.card, cls:"chips",
    onChange:function(v){ cancelAnim(); S.dc.card = +v; save(); render(); } });

  function save(){ api.save(); }
  function user(){ cancelAnim(); pv = {}; MV.banner("", ""); }
  function setExp(v){
    S.exp = v; var e = EXPS[v];
    if (S.view === "table" && e.stages.length !== 2) S.view = "tree";
    if (!e.comb) S.comb = "pairs";
    S.ev = "none"; S.marks = [];
    viewR.set(S.view); viewR.refresh(); combR.set(S.comb); fillEvents();
  }
  function fillEvents(){
    var list = EVENTS[S.exp] || [], h = '<option value="none">No event</option>' + list.map(function(x){ return '<option value="' + x.id + '">' + x.t + "</option>"; }).join("");
    if (S.ev.indexOf("v:") === 0) h += '<option value="' + S.ev + '">' + evName() + " (from the side panel)</option>";
    h += '<option value="tap">Tap outcomes</option>';
    evSel.innerHTML = h; evSel.value = S.ev;
  }
  function evName(id){
    id = id || S.ev;
    if (id === "none") return "";
    if (id === "tap") return "your tapped outcomes";
    if (id.indexOf("v:") === 0) return COMB[S.comb] ? COMB[S.comb].ev + id.slice(2) : "";
    var x = (EVENTS[S.exp] || []).filter(function(q){ return q.id === id; })[0]; return x ? x.t : "";
  }
  function eventKeys(id){
    var e = EXPS[S.exp], all = paths(e);
    if (id.indexOf("v:") === 0) { var v = +id.slice(2); return all.filter(function(p){ return S.comb !== "pairs" && cval(p, S.comb) === v; }).map(keyOf); }
    var x = (EVENTS[S.exp] || []).filter(function(q){ return q.id === id; })[0];
    return x ? all.filter(x.f).map(keyOf) : [];
  }
  function marksNow(){ return pv.partial || S.marks; }
  function hasEvent(){ return S.ev !== "none"; }

  // --- animation bookkeeping (predictions and storyboard steps); any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], stops:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){
    if (!anim) return; var a = anim; anim = null;
    a.timers.forEach(clearTimeout); a.stops.forEach(function(s){ try { s(); } catch (e) {} });
    pv.partial = null; pv.unreduced = false; pv.shown = null; pv.reveal = null; pv.hide = false; pv.grouped = false; tree.reveal(null);
    if (a.fin) { var f = a.fin; a.fin = null; f(); }
    render(); MV.changed();
  }
  function chooseEvent(id, fin){
    S.ev = id; S.marks = id === "none" || id === "tap" ? (id === "tap" ? S.marks : []) : eventKeys(id); save(); fillEvents();
    if (id === "none" || id === "tap" || !S.marks.length) { render(); MV.changed(); if (fin) fin(); return; }
    animateMarks(S.marks.slice(), fin);
  }
  function animateMarks(keys, fin){
    newAnim(fin);
    if (MV.reduceMotion) { endAnim(); render(); MV.changed(); return; }
    var n = keys.length, per = Math.max(55, Math.min(170, 1100 / n)), k = 0;
    pv.unreduced = true;
    (function step(){ pv.partial = keys.slice(0, ++k); render(); if (k < n) later(per, step); else later(480, function(){ pv.partial = null; pv.unreduced = false; render(); MV.changed(); endAnim(); }); })();
  }
  function tapOut(key){
    if (pv.grouped) return;
    user();
    if (S.ev !== "tap") { S.ev = "tap"; }
    var i = S.marks.indexOf(key); if (i < 0) S.marks.push(key); else S.marks.splice(i, 1);
    var order = paths(EXPS[S.exp]).map(keyOf); S.marks.sort(function(a, b){ return order.indexOf(a) - order.indexOf(b); });
    save(); fillEvents(); render(); MV.changed();
  }

  // --- simulator ---
  function sim(){
    var e = EXPS[S.exp];
    return sims[S.exp] || (sims[S.exp] = makeSim({ seed:"mdm4u-01-" + S.exp, repeatable:S.rep, trial:function(rng){ return e.stages.map(function(s){ return s.branches[rng.int(s.branches.length)].id; }).join(","); } }));
  }
  function runSim(n){
    if (S.mode === "dc") return;
    var s = sim(); if (s.busy()) return;
    s.run(n, { step:function(){ paintRead(); if (S.mode === "data") simPlot.render(); }, done:function(){ paintRead(); if (S.mode === "data") simPlot.render(); } });
  }
  function drawSim(){
    if (S.mode !== "data") return;
    var e = EXPS[S.exp], N = paths(e).length, s = sim(), m = {}, k = S.marks.length;
    S.marks.forEach(function(x){ m[x] = 1; });
    var ev = hasEvent() && k > 0, pen = css("--pen");
    drawRelFreq(simPlot, { seq:s.seq, series:ev ? [{ pred:function(x){ return !!m[x]; }, color:pen, theory:k / N }] : [],
      describe:ev ? "Running relative frequency of the event over " + s.seq.length + " trials, with the theoretical probability " + F.txt(F.of(k, N)) + " as a dashed line." : "Relative frequency graph. Choose an event and run the simulator." });
    $("#ss-simleg", host).innerHTML = ev ? '<span><i class="sw" style="background:var(--pen)"></i>simulated relative frequency</span> <span><i class="sw dash" style="--dc:var(--pen)"></i>theoretical ' + MV.m("P(A) = " + F.src(F.of(k, N))) + "</span>" : "Choose an event, then press Run.";
  }

  // --- discrete or continuous ---
  var dcT = 1;
  function mapIt(){
    cancelAnim(); var i = S.dc.card; S.dc.mapped[i] = true; save();
    var a = newAnim(); dcT = 0; render();
    var stop = MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ dcT = t; dcPlot.render(); }, done:function(){ dcT = 1; render(); if (anim === a) endAnim(); } });
    a.stops.push(stop);
  }
  function drawDC(){
    if (S.mode !== "dc") return;
    var c = DC[S.dc.card], mapped = !!S.dc.mapped[S.dc.card], t = mapped ? dcT : 0, nl = { min:c.nl.min, max:c.nl.max, step:c.nl.step, pieces:[], dots:[], marks:[] };
    if (mapped && c.d) { var shown = Math.ceil(c.dots.length * t); nl.dots = c.dots.slice(0, shown).map(function(x){ return { x:x, closed:true }; }); if (c.more && t >= 1) nl.marks.push({ x:c.nl.max - 0.7, label:"…" }); }
    if (mapped && !c.d) { var b = c.iv[0] + (c.iv[1] - c.iv[0]) * t; nl.pieces = [{ a:c.iv[0], b:Math.max(b, c.iv[0] + 1e-6), aIn:true, bIn:true }]; }
    dcPlot.draw({ numberLine:nl, describe:!mapped ? "Empty number line. Press Map it." : c.d ? "Separate dots at " + c.set + ": a countable list." : "A shaded interval: " + c.set + "." });
  }

  // --- painting ---
  function render(o){
    o = o || {};
    var mode = S.mode, dc = mode === "dc";
    modeR.set(mode); expR.set(S.exp); viewR.set(S.view); viewR.refresh(); combR.set(S.comb);
    $("#ss-map", host).hidden = dc; $("#ss-dc", host).hidden = !dc; $("#ss-ctl-map", host).hidden = dc; $("#ss-ctl-dc", host).hidden = !dc;
    $("#ss-simbox", host).hidden = mode !== "data"; $("#ss-comb", host).hidden = !EXPS[S.exp].comb;
    if (evSel.value !== S.ev) fillEvents();
    if (dc) { paintDC(); return; }
    paintStage(o); paintVals(); paintRead(); paintCap();
    if (mode === "data") simPlot.render();
  }
  function paintStage(o){
    var e = EXPS[S.exp], v = S.view, marks = marksNow(), comb = e.comb ? S.comb : "pairs";
    treeHost.hidden = v !== "tree"; tableHost.hidden = v !== "table"; listHost.hidden = v !== "list";
    var what = { tree:"Tree diagram: one level of branches per stage. Each leaf is one outcome.", table:"Table: " + (e.stages[0] ? e.stages[0].name : "") + " down the side, " + (e.stages[1] ? e.stages[1].name : "") + " across the top. Each cell is one outcome.", list:"List: every outcome, written in order." }[v];
    $("#ss-what", host).textContent = e.name + ". " + what;
    if (v === "tree") {
      tree.set({ stages:e.stages, leafText:function(p){ return outText(e, p, comb); }, leafAria:function(p){ return outAria(e, p, comb); }, colW:e.stages.length > 2 ? 78 : 96, leafW:e.kind === "pair" && comb !== "pairs" ? 104 : 80 });
      tree.mark(marks); tree.reveal(pv.reveal == null ? null : pv.reveal); tree.render();
    } else if (v === "table") {
      var R = e.stages[0].branches, C = e.stages[1].branches, vals = null;
      if (comb !== "pairs") { vals = paths(e).map(function(p){ return cval(p, comb); }); }
      var lo = vals ? Math.min.apply(null, vals) : 0, hi = vals ? Math.max.apply(null, vals) : 1;
      table.set({ rows:{ name:e.stages[0].name, items:R }, cols:{ name:e.stages[1].name, items:C }, caption:e.name + " sample space table",
        cellText:function(ri, ci){ var p = [R[ri].id, C[ci].id]; return comb !== "pairs" ? String(cval(p, comb)) : e.kind === "pair" ? "(" + p[0] + ", " + p[1] + ")" : p.join(""); },
        cellAria:function(ri, ci){ return outAria(e, [R[ri].id, C[ci].id], comb); },
        tint:comb !== "pairs" ? function(ri, ci){ return (cval([R[ri].id, C[ci].id], comb) - lo) / Math.max(1, hi - lo); } : null });
      table.mark(marks); table.render({ fill:o.fill });
    } else paintList(e, marks, comb);
  }
  function paintList(e, marks, comb){
    var had = listHost.contains(document.activeElement) ? document.activeElement.dataset.key : null, m = {};
    marks.forEach(function(k){ m[k] = 1; });
    var h = '<div class="ss-list" role="group" aria-label="Sample space as a list"><span class="ss-br">' + MV.m("S") + " = {</span>";
    var grid = false;
    if (pv.grouped) h += '<span class="ss-grp"><span class="ss-li g">two heads</span><span class="ss-li g">one of each</span><span class="ss-li g">no heads</span><span class="ss-br">}</span></span>';
    else {
      var all = paths(e), six = e.kind === "pair" && all.length === 36; grid = e.kind === "pair";
      h += '<span class="ss-items' + (six ? " six" : grid ? " four" : "") + '">' + all.map(function(p, i){
        var k = keyOf(p), on = !!m[k];
        var lt = e.kind === "pair" && comb !== "pairs" ? outText(e, p) + '<span class="ss-lv"> → ' + cval(p, comb) + "</span>" : outText(e, p, comb);
        return '<button type="button" class="ss-li' + (on ? " on" : "") + '" data-key="' + k + '" aria-pressed="' + on + '" tabindex="' + (i === 0 ? 0 : -1) + '" aria-label="' + MV.esc(outAria(e, p, comb)) + '">' + lt + "</button>";
      }).join("") + (grid ? "" : '<span class="ss-br">}</span>') + "</span>";
    }
    listHost.innerHTML = h + (grid ? '<span class="ss-br">}</span>' : "") + "</div>";
    if (had) { var b = listHost.querySelector('[data-key="' + had + '"]'); if (b) { b.focus({ preventScroll:true }); fixTab(listHost, b); } }
  }
  function fixTab(box, b){ Array.prototype.forEach.call(box.querySelectorAll("button.ss-li"), function(x){ x.tabIndex = x === b ? 0 : -1; }); }
  listHost.addEventListener("click", function(e){ var b = e.target.closest("button.ss-li"); if (b) tapOut(b.dataset.key); });
  listHost.addEventListener("focusin", function(e){ var b = e.target.closest("button.ss-li"); if (b) fixTab(listHost, b); });
  listHost.addEventListener("keydown", function(e){
    var b = e.target.closest("button.ss-li"); if (!b) return;
    var list = Array.prototype.slice.call(listHost.querySelectorAll("button.ss-li")), i = list.indexOf(b), j = i;
    var cols = listHost.querySelector(".six") ? 6 : listHost.querySelector(".four") ? 4 : 1;
    if (e.key === "ArrowRight") j = i + 1; else if (e.key === "ArrowLeft") j = i - 1;
    else if (e.key === "ArrowDown") j = i + cols; else if (e.key === "ArrowUp") j = i - cols;
    else if (e.key === "Home") j = 0; else if (e.key === "End") j = list.length - 1; else return;
    e.preventDefault(); j = Math.max(0, Math.min(list.length - 1, j)); list[j].focus();
  });
  function valueCounts(){
    var e = EXPS[S.exp], cnt = {};
    paths(e).forEach(function(p){ var v = cval(p, S.comb); cnt[v] = (cnt[v] || 0) + 1; });
    return Object.keys(cnt).map(Number).sort(function(a, b){ return a - b; }).map(function(v){ return { v:v, n:cnt[v] }; });
  }
  // @component valueCounts — side panel "value: count" bars for a combined value over a sample space; each row is a button
  // that picks the event "value = v"; rows can be revealed one at a time (pv.shown) for a prediction.
  function paintVals(){
    var box = $("#ss-vals", host), e = EXPS[S.exp];
    if (!e.comb || S.comb === "pairs") { box.innerHTML = ""; return; }
    var vc = valueCounts(), N = paths(e).length, max = Math.max.apply(null, vc.map(function(x){ return x.n; })), sel = S.ev.indexOf("v:") === 0 ? +S.ev.slice(2) : null;
    var had = box.contains(document.activeElement) ? document.activeElement.dataset.val : null;
    box.innerHTML = '<div class="ss-vals"><h4>' + MV.cap(COMB[S.comb].noun) + ' <span class="tiny muted">(cells out of ' + N + ")</span></h4>" +
      '<p class="tiny muted">Tap a value to mark its cells.</p><div class="ss-vlist">' + vc.map(function(x, i){
        var hid = pv.shown != null && i >= pv.shown, on = sel === x.v;
        return '<button type="button" class="ss-v' + (on ? " on" : "") + '" data-val="' + x.v + '" aria-pressed="' + on + '" aria-label="' + MV.esc(COMB[S.comb].ev + x.v + ": " + (hid ? "count hidden" : x.n + " of " + N + " cells")) + '"><span class="ss-vv">' + x.v + '</span><span class="ss-vb"><i style="width:' + (hid ? 0 : x.n / max * 100) + '%"></i></span><span class="ss-vn">' + (hid ? "?" : x.n) + "</span></button>";
      }).join("") + "</div></div>";
    if (had) { var b = box.querySelector('[data-val="' + had + '"]'); if (b) b.focus({ preventScroll:true }); }
  }
  function relText(h, n){ return h + "/" + n + (F.exactDec(F.of(h, n), 4) ? " = " : " ≈ ") + F.dec(F.of(h, n), 4); }
  function paintRead(){
    if (S.mode === "dc") return;
    var e = EXPS[S.exp], N = paths(e).length, k = marksNow().length, hide = !!pv.hide, ev = hasEvent(), unit = e.kind === "pair" ? "ordered pairs" : "outcomes";
    var rows = [["Sample space size " + MV.m("n(S)"), hide ? "?" : N + " " + unit]];
    if (!ev) rows.push(["Outcomes in the event " + MV.m("n(A)"), '<span class="muted">Choose an event, or tap outcomes.</span>']);
    else {
      rows.push(["Outcomes in the event " + MV.m("n(A)"), hide && pv.partial == null ? "?" : k + ' <span class="muted">(' + MV.esc(evName()) + ")</span>"]);
      var fin = !pv.unreduced;
      rows.push([MV.m("P(A)"), hide && pv.partial == null ? "?" : fin ? F.prob(k, N) : k + "/" + N]);
      rows.push([MV.m("P(A′)"), hide && pv.partial == null ? "?" : fin ? F.prob(N - k, N, { dec:false }) : (N - k) + "/" + N]);
    }
    var eq = hide ? "?" : "Yes: each " + (e.kind === "pair" ? "ordered pair" : "outcome") + " has probability " + F.txt(F.of(1, N));
    if (!hide && e.comb && S.comb !== "pairs") eq += '.<br>The ' + valueCounts().length + " " + COMB[S.comb].noun + " are <strong>not</strong> equally likely.";
    rows.push(["Equally likely?", eq]);
    var s = sim();
    if (s.seq.length) rows.push(["Simulated relative frequency", ev ? relText(s.hits(function(x){ return S.marks.indexOf(x) >= 0; }), s.seq.length) + ' <span class="muted">(' + (S.rep ? "repeatable run" : "random run") + ")</span>" : '<span class="muted">' + s.seq.length + " trials so far. Choose an event to count it.</span>"]);
    $("#ss-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var e = EXPS[S.exp], N = paths(e).length, k = marksNow().length, cap = $("#ss-cap", host);
    if (pv.hide && pv.partial == null) { cap.innerHTML = MV.m("n(S) = ?"); return; }
    if (!hasEvent()) { cap.innerHTML = MV.m("n(S) = " + N); return; }
    var f = F.of(k, N), s = "P(A) = {" + k + "}/{" + N + "}";
    if (!pv.unreduced && (f.n !== k || f.d !== N)) s += " = " + F.src(f);
    cap.innerHTML = MV.m(s);
  }
  function paintDC(){
    var c = DC[S.dc.card], mapped = !!S.dc.mapped[S.dc.card];
    cardR.set(S.dc.card);
    $("#ss-cap", host).innerHTML = mapped ? (c.d ? MV.m("S = " + c.set) : '<span class="ss-capt">' + c.set + "</span>") : "";
    $("#ss-dc-t", host).innerHTML = "<strong>" + c.t + "</strong>";
    $("#ss-dc-set", host).textContent = mapped ? (c.d ? "A countable list: " + c.set : "A shaded interval: " + c.set) : "Press Map it to see the sample space.";
    $("#ss-read", host).innerHTML = MV.readoutHTML([["Scenario", c.t], ["Sample space", mapped ? c.set : '<span class="muted">Press Map it.</span>'],
      ["Discrete or continuous?", mapped ? (c.d ? "<strong>Discrete:</strong> the outcomes can be counted" : "<strong>Continuous:</strong> any value in a range") : '<span class="muted">Press Map it.</span>']]);
    $("#ss-vals", host).innerHTML = "";
    dcPlot.render();
  }
  function tc3Banner(v){
    var st = MV.S.chal && MV.S.chal.tc3;
    if (!st || !st.solved || !S.tc3) return;
    if ((v === 6 || v === 12) && v !== S.tc3 && S.comb === "prod" && S.exp === "d2") MV.banner("good", "✓ That’s the other one: 6 and 12 each fill 4 of the 36 cells.");
  }

  // --- start ---
  fillEvents(); render();

  // --- predictions ---
  function startPred(p){
    cancelAnim(); pv = {};
    var s = p.start || {};
    if (S.mode === "dc") S.mode = "map";
    S.exp = s.exp; S.view = s.view; S.comb = s.comb || "pairs"; S.ev = "none"; S.marks = [];
    pv.hide = true;
    if (s.reveal != null) pv.reveal = s.reveal;
    if (s.grouped) pv.grouped = true;
    if (S.comb !== "pairs") pv.shown = 0;
    save(); fillEvents(); render({ fill:s.view === "table" });
  }
  function runPred(p, done){
    var a0 = newAnim(done);
    if (p.id === "p1") {
      var stop = tree.grow(0, 3, function(){ if (anim !== a0) return; pv.reveal = null; pv.hide = false; render(); endAnim(); });
      a0.stops.push(stop);
    } else if (p.id === "p2") {
      var vc = valueCounts(), i = 0;
      (function step(){
        if (i < vc.length) { var v = vc[i].v; pv.shown = ++i; pv.partial = paths(EXPS[S.exp]).filter(function(q){ return cval(q, S.comb) === v; }).map(keyOf); render(); later(360, step); return; }
        pv = {}; S.ev = "v:7"; S.marks = eventKeys("v:7"); save(); fillEvents(); render(); MV.changed(); later(200, endAnim);
      })();
    } else if (p.id === "p3") {
      later(500, function(){ pv.grouped = false; render(); later(600, function(){ var a = anim; a.fin = null; pv.hide = false;
        S.ev = "h1"; S.marks = eventKeys("h1"); save(); fillEvents(); animateMarks(S.marks.slice(), done); }); });
    } else if (p.id === "p4") {
      later(300, function(){ var a = anim; a.fin = null; pv.hide = false; S.ev = "dbl"; S.marks = eventKeys("dbl"); save(); fillEvents(); animateMarks(S.marks.slice(), done); });
    } else endAnim();
    if (MV.reduceMotion && p.id !== "p1") { /* the steps above already jump through MV.wait's short delays */ }
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id, opt){
      var r = chal(id);
      if (r.ok && !opt.live) {
        if (id === "tc1") MV.banner("good", "Any 9 cells work. One you can describe: “both dice odd” is 3 × 3 = 9.");
        if (id === "tc3") { S.tc3 = +S.ev.slice(2); save(); MV.banner("good", "There’s one more. Can you find it?"); }
      }
      return r;
    }
  };

  function chal(id){
    var k = S.marks.length;
    if (id === "tc1") {
      if (S.exp !== "d2") return { ok:false, msg:"Switch the experiment to Two dice first." };
      if (k === 9) return { ok:true };
      var named = { 4:"4/36 = 1/9. One quarter of 36 is 9.", 6:"6/36 = 1/6.", 12:"12/36 = 1/3." };
      if (named[k]) return { ok:false, msg:named[k] };
      if (!k) return { ok:false, msg:"Tap cells to mark an event. You need " + MV.m("1/4") + " of the 36 cells." };
      return { ok:false, msg:"You marked " + k + " of 36 cells: " + F.prob(k, 36) + ". One quarter of 36 is 9." };
    }
    if (id === "tc2") {
      if (S.exp !== "c3") return { ok:false, msg:"Switch the experiment to Three coins first." };
      if (S.ev === "none") return { ok:false, msg:"Choose an event from the Event menu first." };
      if (k === 3) return { ok:true };
      if (S.ev === "ge2") return { ok:false, msg:"That includes HHH as well: 4/8." };
      if (S.ev === "h3") return { ok:false, msg:"Only HHH: 1/8." };
      return { ok:false, msg:"“" + MV.cap(evName()) + "” has " + k + " of the 8 leaves: " + F.prob(k, 8, { dec:false }) + ". You need 3 of the 8." };
    }
    if (id === "tc3") {
      if (S.exp !== "d2") return { ok:false, msg:"Choose Two dice first, then the Product view." };
      if (S.comb !== "prod") return { ok:false, msg:"Set Combine to Product, then tap a product value in the side panel." };
      if (S.ev.indexOf("v:") !== 0) return { ok:false, msg:"Tap one product value in the side panel to mark its cells." };
      var v = +S.ev.slice(2);
      if (v === 6 || v === 12) return { ok:true };
      var nm = { 4:"(1, 4), (4, 1), (2, 2): 3 cells, so 1/12.", 8:"(2, 4), (4, 2): 2/36 = 1/18.", 36:"Only (6, 6): 1/36." };
      if (nm[v]) return { ok:false, msg:nm[v] };
      return { ok:false, msg:"Product " + v + " fills " + k + " cell" + (k === 1 ? "" : "s") + ": " + F.prob(k, 36, { dec:false }) + ". You need a product in exactly 4 cells." };
    }
    return { ok:false };
  }
}

// ---------- hero: coin flips, the two-coin tree grows, then the three-result list is crossed out ----------
function hero(f){
  var coin = $("#ssh-coin"), flipLab = $("#ssh-flip"), list = $("#ssh-list"), cap = f.cap;
  if (!coin) return;
  var t = treeDiagram($("#ssh-tree"), { stages:EXPS.c2.stages, tap:false, orient:"down", bare:true, levelH:52, leafText:function(p){ return p.join(""); } });
  function last(){ t.reveal(null); t.mark(["H,T", "T,H"]); t.render(); cap.textContent = "one of each: 2 out of 4"; list.classList.add("on", "x"); coin.classList.add("rest"); flipLab.textContent = ""; }
  if (MV.reduceMotion) { last(); return; }
  t.reveal(0); t.render();
  function flip(face, n, done){
    flipLab.textContent = "Flip " + n;
    MV.tween({ dur:760, ease:function(x){ return x; }, step:function(x){ var a = x * Math.PI * 4, c = Math.cos(a); coin.style.transform = "scaleX(" + Math.max(0.04, Math.abs(c)).toFixed(3) + ")"; coin.textContent = x >= 1 ? face : (Math.floor(a / Math.PI + 0.5) % 2 ? (face === "H" ? "T" : "H") : face); }, done:done });
  }
  MV.wait(500, function(){ flip("H", 1, function(){ t.grow(0, 1, function(){ flip("T", 2, function(){ t.grow(1, 2, function(){
    MV.wait(450, function(){ t.mark(["H,T", "T,H"]); t.render(); cap.textContent = "one of each: 2 out of 4";
      MV.wait(1400, function(){ list.classList.add("on"); MV.wait(1100, function(){ list.classList.add("x"); flipLab.textContent = ""; }); }); }); }); }); }); }); });
}

// ---------- Part 3: Is it equally likely? ----------
var SP3 = [{ deg:180, label:"A", sub:"180°" }, { deg:120, label:"B", sub:"120°" }, { deg:60, label:"C", sub:"60°" }];
var COUNTS = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], EQ_H = 180;
function part3(host, api){
  var S = api.S; S.st = S.st || "1"; S.hi = S.hi || null; S.bar = S.bar || 7; S.rep3 = S.rep3 !== false;
  var splitT = S.split ? 1 : 0, stopTw = null;
  host.innerHTML = '<div id="eq-st" class="eq-st"></div>' +
    // station 1
    '<div class="eq-station" data-st="1"><div class="sym"><div><div class="plot-wrap"><canvas class="plot square" id="eq-spin" role="img" aria-label="Spinner"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="eq-split">Split into equal parts</button><button type="button" class="btn ghost sm" id="eq-unsplit">Show the original spinner</button></div></div>' +
      '<div><h3>Station 1: the unequal spinner</h3><p>Sector A is 180°, B is 120° and C is 60°. The tempting sample space {A, B, C} has 3 outcomes. Is each one ' + MV.m("1/3") + "?</p>" +
      '<div id="eq-pick"></div><dl class="read" id="eq-read1" aria-live="polite"></dl>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>' + MV.m("P(A) = {180}/{360} = {1}/{2}") + "</span><span>" + MV.m("P(B) = {120}/{360} = {1}/{3}") + "</span><span>" + MV.m("P(C) = {60}/{360} = {1}/{6}") + "</span><span>" + MV.m("{1}/{2} + {1}/{3} + {1}/{6} = 1") + " <small>The probabilities of all the outcomes add to 1.</small></span><span><small>Only B has probability " + MV.m("1/3") + ", so {A, B, C} is not an equally likely sample space. The six 60° parts A, A, A, B, B, C are.</small></span></div></details></div></div></div>" +
    // station 2
    '<div class="eq-station" data-st="2"><div class="sym"><div><div class="eq-chart" id="eq-chart" style="--eq-h:' + EQ_H + 'px"><div class="eq-bars" id="eq-bars" role="group" aria-label="Sums of two dice: tap a bar"></div></div><p class="tiny muted">Sum of two dice. Bar height = number of ordered pairs, out of 36.</p><p class="legend tiny" id="eq-lineleg" hidden><span><i class="sw dash" style="--dc:var(--ink)"></i>if all 11 sums were equally likely, each bar would hold 36/11 ≈ 3.27 pairs</span></p>' +
      '<label class="ss-check"><input type="checkbox" id="eq-line"> Show the height each bar would have if all 11 sums were equally likely</label></div>' +
      '<div><h3>Station 2: sums of two dice</h3><p>There are 11 possible sums, from 2 to 12. Tap a bar to see the ordered pairs behind it.</p><dl class="read" id="eq-read2" aria-live="polite"></dl>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>' + Pw("sum = 7") + " " + MV.m("= {6}/{36} = {1}/{6}") + " <small>not " + MV.m("1/11") + "</small></span><span>1 + 2 + 3 + 4 + 5 + 6 + 5 + 4 + 3 + 2 + 1 = 36 <small>Every ordered pair gives exactly one sum, so the bars hold all 36.</small></span></div></details></div></div></div>" +
    // station 3
    '<div class="eq-station" data-st="3"><h3>Station 3: check it with data</h3><p>The simulator spins the station 1 spinner (A 180°, B 120°, C 60°). Theory says ' + MV.m("P(A) = 1/2") + ", " + MV.m("P(B) = 1/3") + " and " + MV.m("P(C) = 1/6") + ".</p>" +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="eq-go">Spin 600 times</button><button type="button" class="btn ghost sm" id="eq-reset">Reset</button><label class="ss-check"><input type="checkbox" id="eq-rep"> Repeatable run</label></div>' +
      '<div class="sym"><div><div class="plot-wrap"><canvas class="plot wide" id="eq-rf" role="img" aria-label="Relative frequency graph"></canvas></div><p class="legend tiny eq-leg"><span><i class="sw" style="background:var(--ev-a)"></i>A</span><span><i class="sw" style="background:var(--ev-b)"></i>B</span><span><i class="sw" style="background:var(--ev-c)"></i>C</span><span><i class="sw dash"></i>theory (same colour, dashed)</span></p></div>' +
      '<div><div id="eq-tally"></div><p id="eq-cap3" class="eq-cap3" aria-live="polite"></p></div></div></div>';
  radios($("#eq-st", host), { label:"Station", options:[{ id:"1", t:"1. The unequal spinner" }, { id:"2", t:"2. Sums of two dice" }, { id:"3", t:"3. Check it with data" }], value:S.st, cls:"chips",
    onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ Array.prototype.forEach.call(host.querySelectorAll(".eq-station"), function(d){ d.hidden = d.dataset.st !== S.st; }); MV.redrawAll(); }

  // station 1
  var p1 = new MV.Plot($("#eq-spin", host), { xmin:-1.25, xmax:1.25, ymin:-1.25, ymax:1.25 }, { equal:true });
  p1.render = function(){
    var sec = SP3.map(function(s){ return { deg:s.deg, label:s.label, sub:S.split ? null : s.sub, color:css(LET[s.label]) }; }), labels = null;
    if (S.split && splitT > 0.5) labels = ["A", "A", "A", "B", "B", "C"].map(function(l, i){ return { deg:30 + 60 * i, label:l, alpha:Math.min(1, (splitT - 0.5) * 2) }; });
    p1.draw({ grid:false, axes:false, after:function(ctx, p){ drawSpinner(ctx, p, { sectors:sec, split:S.split ? 60 : 0, splitT:splitT, labels:labels, hi:S.hi }); },
      describe:S.split ? "The spinner cut into six equal 60 degree parts labelled A, A, A, B, B, C." : "Spinner with sector A 180 degrees, B 120 degrees and C 60 degrees." });
  };
  radios($("#eq-pick", host), { label:"Look at a letter", options:[{ id:"A", t:"A" }, { id:"B", t:"B" }, { id:"C", t:"C" }, { id:"none", t:"All" }], value:S.hi || "none", cls:"chips",
    onChange:function(v){ S.hi = v === "none" ? null : v; api.save(); paint1(); } });
  $("#eq-split", host).addEventListener("click", function(){
    if (S.split) return; S.split = true; api.save(); if (stopTw) stopTw(); splitT = 0; paint1();
    stopTw = MV.tween({ dur:1100, ease:function(t){ return t; }, step:function(t){ splitT = t; p1.render(); }, done:function(){ splitT = 1; stopTw = null; paint1(); } });
  });
  $("#eq-unsplit", host).addEventListener("click", function(){ if (stopTw) stopTw(); stopTw = null; S.split = false; splitT = 0; api.save(); paint1(); });
  function paint1(){
    var rows = [], b = function(L, s){ return S.hi === L ? "<strong>" + s + "</strong>" : s; };
    if (!S.split) {
      rows.push(["Tempting sample space", "{A, B, C}: 3 results, but <strong>not</strong> equally likely"]);
      SP3.forEach(function(s){ rows.push([MV.m("P(" + s.label + ")"), b(s.label, s.deg + "/360 = " + F.txt(F.of(s.deg, 360))) + ' <span class="muted">(' + s.deg + "°)</span>"]); });
    } else {
      rows.push(["Equally likely sample space", "{A, A, A, B, B, C}: 6 equal parts of 60°"]);
      [["A", 3], ["B", 2], ["C", 1]].forEach(function(x){ rows.push([MV.m("P(" + x[0] + ")"), b(x[0], x[1] + " of 6 parts: " + x[1] + "/6" + (x[1] > 1 ? " = " + F.txt(F.of(x[1], 6)) : ""))]); });
    }
    $("#eq-read1", host).innerHTML = MV.readoutHTML(rows);
    $("#eq-split", host).disabled = !!S.split; $("#eq-unsplit", host).disabled = !S.split;
    p1.render();
  }

  // station 2
  $("#eq-line", host).checked = !!S.line;
  $("#eq-line", host).addEventListener("change", function(e){ S.line = e.target.checked; api.save(); paint2(); });
  $("#eq-bars", host).addEventListener("click", function(e){ var b = e.target.closest("[data-sum]"); if (!b) return; S.bar = +b.dataset.sum; api.save(); paint2(); });
  function paint2(){
    var bars = $("#eq-bars", host), had = bars.contains(document.activeElement) ? document.activeElement.dataset.sum : null;
    bars.innerHTML = COUNTS.map(function(n, i){ var s = i + 2, on = S.bar === s;
      return '<button type="button" class="eq-bar' + (on ? " on" : "") + '" data-sum="' + s + '" aria-pressed="' + on + '" aria-label="Sum ' + s + ": " + n + ' of 36 ordered pairs"><span class="eq-tr"><span class="eq-bh" style="height:' + (n / 6 * 100).toFixed(1) + '%">' + n + '</span></span><span class="eq-bx">' + s + "</span></button>"; }).join("");
    var old = $(".eq-eqline", host); if (old) old.remove();
    if (S.line) { var ln = document.createElement("span"); ln.className = "eq-eqline"; ln.setAttribute("aria-hidden", "true"); ln.style.top = (EQ_H * (1 - 36 / 11 / 6)).toFixed(1) + "px"; $("#eq-chart", host).appendChild(ln); }
    $("#eq-lineleg", host).hidden = !S.line;
    if (had) { var hb = bars.querySelector('[data-sum="' + had + '"]'); if (hb) hb.focus({ preventScroll:true }); }
    var s = S.bar, pairs = [];
    for (var a = 1; a <= 6; a++) { var c = s - a; if (c >= 1 && c <= 6) pairs.push("(" + a + ", " + c + ")"); }
    $("#eq-read2", host).innerHTML = MV.readoutHTML([["Sum " + s + ": " + pairs.length + " ordered pair" + (pairs.length > 1 ? "s" : ""), pairs.join(", ")], [Pw("sum = " + s), F.prob(pairs.length, 36)],
      ["If the 11 sums were equally likely", "each would have probability 1/11 ≈ 0.0909. They aren’t: 7 happens 6 ways, 2 and 12 only once."]]);
  }

  // station 3 (D6 simulator, seeded: the repeatable run is the plan's model data 296, 205, 99)
  var sim3 = makeSim({ seed:"eq-station3-567", repeatable:S.rep3, trial:function(r){ return ["A", "B", "C"][r.pick([3, 2, 1])]; } });
  var p3 = new MV.Plot($("#eq-rf", host), { xmin:0, xmax:10, ymin:0, ymax:1 });
  p3.render = function(){
    var th = { A:1 / 2, B:1 / 3, C:1 / 6 };
    drawRelFreq(p3, { seq:sim3.seq, series:["A", "B", "C"].map(function(L){ return { pred:function(k){ return k === L; }, color:css(LET[L]), theory:th[L] }; }),
      describe:sim3.seq.length ? "Running relative frequencies of A, B and C over " + sim3.seq.length + " spins, settling near the dashed theoretical lines at 1/2, 1/3 and 1/6." : "Empty relative frequency graph. Press Spin 600 times." });
  };
  $("#eq-rep", host).checked = S.rep3;
  $("#eq-go", host).addEventListener("click", function(){ if (sim3.busy()) return; sim3.run(600, { step:paint3, done:paint3 }); });
  $("#eq-reset", host).addEventListener("click", function(){ sim3.reset(); paint3(); });
  $("#eq-rep", host).addEventListener("change", function(e){ S.rep3 = e.target.checked; api.save(); sim3.setRepeatable(S.rep3); paint3(); });
  function paint3(){
    var n = sim3.seq.length, th = [["A", 1, 2], ["B", 1, 3], ["C", 1, 6]], model = S.rep3 && n === 600;
    $("#eq-tally", host).innerHTML = MV.tableHTML({ head:["Letter", "Spins", "Relative frequency", "Theory"], caption:"Spin tallies",
      rows:th.map(function(x){ var c = sim3.counts[x[0]] || 0; return ['<span class="ev-' + x[0].toLowerCase() + '">' + x[0] + "</span>", n ? String(c) : "–", n ? c + "/" + n + " ≈ " + F.dec(F.of(c, n), 3) : "–", x[1] + "/" + x[2] + (x[2] === 2 ? " = " : " ≈ ") + F.dec(F.of(x[1], x[2]), 3)]; }) }) +
      '<p class="tiny muted">' + (n ? n + " spins so far" + (S.rep3 ? " (repeatable run)" : " (random run)") + (model ? ' <span class="mdm-model">model data</span>' : "") : "No spins yet.") + "</p>";
    $("#eq-cap3", host).innerHTML = n ? "<strong>Close, not exact. More spins usually get closer.</strong>" : "";
    p3.render();
  }
  paint1(); paint2(); paint3(); showSt();
  return {};
}

// ---------- Performance task: Twenty-four sectors ----------
var task = (function(){
  var api = null, plot = null, view = "spin";
  function read(){ var s = api ? api.S : {}; var a = s.a == null ? 8 : s.a, b = s.b == null ? 8 : s.b; return { a:a, b:b, c:24 - a - b }; }
  function same(d){ return d.a * d.a + d.b * d.b + d.c * d.c; }
  function draw(){
    var d = read();
    if (view === "spin") {
      var sec = [];
      ["a", "b", "c"].forEach(function(k){ for (var i = 0; i < d[k]; i++) sec.push({ deg:15, label:k.toUpperCase(), color:css(LET[k.toUpperCase()]) }); });
      plot.draw({ view:{ xmin:-1.25, xmax:1.25, ymin:-1.25, ymax:1.25 }, equal:true, grid:false, axes:false,
        after:function(ctx, p){ if (sec.length) drawSpinner(ctx, p, { sectors:sec, small:true }); },
        describe:"Spinner with 24 equal sectors: " + d.a + " A, " + d.b + " B and " + d.c + " C." });
    } else {
      plot.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, after:function(ctx, p){
        var W = p.W, H = p.H, pad = 22, size = Math.min(W, H) - pad - 6, cell = size / 24, x0 = pad + (W - pad - size) / 2 - 3, y0 = pad, L = [];
        ["a", "b", "c"].forEach(function(k){ for (var i = 0; i < d[k]; i++) L.push(k.toUpperCase()); });
        ctx.fillStyle = css("--sheet"); ctx.fillRect(0, 0, W, H);
        for (var r = 0; r < 24; r++) for (var c = 0; c < 24; c++) {
          if (L[r] === L[c]) { ctx.globalAlpha = 0.85; ctx.fillStyle = css(LET[L[r]]); ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell); ctx.globalAlpha = 1; }
        }
        ctx.strokeStyle = css("--plot-grid"); ctx.lineWidth = 1; ctx.beginPath();
        for (var g = 0; g <= 24; g++) { ctx.moveTo(x0 + g * cell, y0); ctx.lineTo(x0 + g * cell, y0 + size); ctx.moveTo(x0, y0 + g * cell); ctx.lineTo(x0 + size, y0 + g * cell); }
        ctx.stroke(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, size, size);
        ctx.fillStyle = css("--ink-2"); ctx.font = "600 12px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillText("second spin →", x0 + size / 2, y0 - 4);
        ctx.save(); ctx.translate(x0 - 6, y0 + size / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("first spin →", 0, 0); ctx.restore();
      }, describe:"24 by 24 table of two spins. Same-letter cells are coloured: " + d.a + " by " + d.a + " A, " + d.b + " by " + d.b + " B and " + d.c + " by " + d.c + " C, " + same(d) + " of 576 cells." });
    }
  }
  function paint(){
    var d = read();
    $("#tk-a-out").textContent = d.a; $("#tk-b-out").textContent = d.b; $("#tk-c").textContent = d.c;
    $("#tk-a").value = d.a; $("#tk-b").value = d.b;
    $("#tk-same").innerHTML = "Same letter: " + MV.m("a^2 + b^2 + c^2") + " = " + d.a * d.a + " + " + d.b * d.b + " + " + d.c * d.c + " = <strong>" + same(d) + "</strong> of 576";
    $("#tk-probs").innerHTML = MV.readoutHTML([[MV.m("P(A)"), d.a + "/24" + (d.a && F.of(d.a, 24).d !== 24 ? " = " + F.txt(F.of(d.a, 24)) : "")], [MV.m("P(B)"), d.b + "/24" + (d.b && F.of(d.b, 24).d !== 24 ? " = " + F.txt(F.of(d.b, 24)) : "")], [MV.m("P(C)"), d.c + "/24" + (d.c && F.of(d.c, 24).d !== 24 ? " = " + F.txt(F.of(d.c, 24)) : "")]]);
    if (plot) plot.render();
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.a == null) a.S.a = 8; if (a.S.b == null) a.S.b = 8;
      var sl = function(id, L, v){ return '<label class="slider tk-sl"><span class="slider-top"><span>' + L + " sectors, " + MV.m(id) + '</span><output id="tk-' + id + '-out" class="ev-' + id + '">' + v + '</output></span><input type="range" id="tk-' + id + '" data-tk="' + id + '" min="0" max="24" step="1" value="' + v + '" style="accent-color:var(--ev-' + id + ')"></label>'; };
      inp.innerHTML = '<div class="tk-in">' + sl("a", "A", a.S.a) + sl("b", "B", a.S.b) +
        '<p class="tk-c">C sectors: ' + MV.m("c = 24 - a - b") + ' = <strong class="ev-c" id="tk-c"></strong></p><p class="tk-same" id="tk-same" aria-live="polite"></p></div>';
      pv.innerHTML = '<div id="tk-view"></div><div class="plot-wrap"><canvas class="plot square" id="tk-plot" role="img"></canvas></div><dl class="read tk-probs" id="tk-probs" aria-live="polite"></dl>';
      radios($("#tk-view"), { label:"Show", options:[{ id:"spin", t:"Spinner" }, { id:"table", t:"Two spins table" }], value:view, cls:"seg", onChange:function(v){ view = v; draw(); } });
      plot = new MV.Plot($("#tk-plot"), { xmin:-1.25, xmax:1.25, ymin:-1.25, ymax:1.25 }); plot.render = draw;
      inp.addEventListener("input", function(e){
        var id = e.target.dataset && e.target.dataset.tk; if (!id) return;
        var v = Math.round(+e.target.value), other = id === "a" ? a.S.b : a.S.a;
        if (v + other > 24) v = 24 - other;   // the sliders stop where c would go below 0
        a.S[id] = v; e.target.value = v; a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.c >= 0 ? true : "Lower a or b: c can’t be negative."; },
    checks:function(d){ return [d.a >= 1 && d.b >= 1 && d.c >= 1, d.a === 2 * d.b, d.c >= 6, same(d) <= 288]; },
    key:function(d){
      var k = d.a + "," + d.b + "," + d.c, st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0);
      MV.C.task.after3 = n >= 4 ? MV.C.task.afterAll : "";
      return k;
    },
    label:function(k){ return "(" + k.split(",").join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return p[0] + " A, " + p[1] + " B, " + p[2] + " C"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
