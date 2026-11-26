// MDM4U 17 Conditional Probability: hero (120 students under two conditions), Given-that filter (Explore: table, Venn, dice
// and tree modes; two-step Given/Find selection; swap; flip the tree; unlock the bag), Medical test puzzle (Part 3: 10 000-dot
// natural-frequency grid, the tree and its flip, a base-rate slider), probability entry practice (N4), Two-way table designer.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, F = MV.mdm.frac;

// ---------- small helpers ----------
function mm(s){ return MV.m(s); }
function muted(h){ return '<span class="muted">' + h + "</span>"; }
function Pw(inner){ return '<span class="m"><i>P</i>(' + inner + ")</span>"; }
function qm(){ return '<span class="cp-q" aria-label="hidden until the reveal">?</span>'; }
function Z(){ return F.of(0, 1); }
function N(v){ return MV.mdm.fmt(v); }
function dec(f, dp){ return F.dec(f, dp == null ? 4 : dp); }
function eqTxt(f){ f = F.of(f); return f.d === 1 ? "" : (F.exactDec(f, 4) ? " = " : " ≈ ") + dec(f); }   // " = 0.5" / " ≈ 0.3333"
function val(f){ return F.val(f); }
function marble(c){ return '<span class="cp-mb cp-mb-' + c.toLowerCase() + '">' + c + "</span>"; }
function Lt(c, k){ return '<b class="cp-l cp-l-' + c.toLowerCase() + '">' + c + "</b><sub>" + k + "</sub>"; }   // R₁, B₂ (colour + letter)
function mqHas(q){ return window.matchMedia && window.matchMedia(q).matches; }

// @component radioGroup (copied from MDM4U 05; setOptions(list) for option sets that change with other controls)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)})
//   -> {set, get, lock, refresh, setOptions}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + id + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + tab + '"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
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

// @component D1 treeDiagram — copied from MDM4U 05 (01's tree + grow onLevel); adds dim(path) -> bool: branches, labels and
// leaves outside a condition fade (class "dim", drawn in a separate faded SVG path).
// Sample-space tree diagram (HTML labels and leaf buttons over SVG branches): stages of branches with labels and optional
// branch probabilities; leaves are buttons (tap to toggle; arrow keys, Home/End; roving tabindex) or plain labels (tap:false);
// "down" or "right" layout ("auto" picks "down" when every leaf gets minLeaf px); grow animation one level at a time;
// marked leaves and their paths in highlighter yellow; leafNote for path products.
// t = treeDiagram(host, { stages:[{ name, branches:[{ id, t, p }] }], children(path) -> branches (overrides stages' branches),
//   leafText(path), leafAria(path), leafNote(path), showP, tap:true, onTap(key, path), orient:"auto"|"down"|"right", minLeaf:58,
//   levelH:58, rowH:36, colW:96, leafW:92, maxH:460, bare:false, stageNames:true, label, dim(path) })
// Keys are path ids joined with ",". t.mark(keys); t.reveal(r); t.grow(from, to, done, onLevel) -> cancel(); t.set(opts); t.render(); t.leaves()
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
    var e = "", dm = "", hi = "", h = "";
    var fx = function(v){ return Math.round(v * 10) / 10; };
    T.all.forEach(function(n){
      if (!n.parent) return;
      var f = Math.max(0, Math.min(1, rev - (n.depth - 1))); if (f <= 0) return;
      var x0 = n.parent.x, y0 = n.parent.y, x1 = x0 + (n.x - x0) * f, y1 = y0 + (n.y - y0) * f, dim = !!(o.dim && o.dim(n.path)), dc = dim ? " dim" : "";
      var seg = "M" + fx(x0) + " " + fx(y0) + "L" + fx(x1) + " " + fx(y1);
      if (dim) dm += seg; else e += seg; if (on[key(n.path)] && f >= 1) hi += seg;
      if (o.showP && n.b.p != null && f >= 1) h += '<span class="d1-p' + dc + '" style="left:' + fx((x0 + n.x) / 2) + "px;top:" + fx((y0 + n.y) / 2 - (g.orient === "down" ? 0 : 10)) + 'px">' + n.b.p + "</span>";
      if (f > 0.55) h += '<span class="d1-lab' + (on[key(n.path)] ? " on" : "") + dc + '" style="left:' + fx(n.x) + "px;top:" + fx(n.y) + "px" + (f < 1 ? ";opacity:" + ((f - 0.55) / 0.45).toFixed(2) : "") + '">' + n.b.t + "</span>";
    });
    T.leaves.forEach(function(l){ if (l.leaf && T.all.length > 1) {
      var k = key(l.path), x = g.orient === "down" ? l.x : g.leafX, y = g.orient === "down" ? g.leafY : l.y, dim = !!(o.dim && o.dim(l.path)), dc = dim ? " dim" : "";
      if (rev < T.D) return;
      var con = g.orient === "right" ? "M" + fx(l.x + 14) + " " + fx(l.y) + "L" + fx(x - 4) + " " + fx(l.y) : "M" + fx(l.x) + " " + fx(l.y + 13) + "L" + fx(l.x) + " " + fx(y - 15);
      if (dim) dm += con; else e += con; if (onLeaf[k]) hi += con;
      var txt = o.leafText ? o.leafText(l.path) : l.path.join(""), note = o.leafNote ? o.leafNote(l.path) : "";
      var aria = (o.leafAria ? o.leafAria(l.path) : MV.plain(txt)) + (note ? ", " + MV.plain(note) : "");
      if (o.tap === false) h += '<span class="d1-leaf' + (onLeaf[k] ? " on" : "") + dc + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? ' <small>' + note + "</small>" : "") + "</span>";
      else h += '<button type="button" class="d1-leaf' + (onLeaf[k] ? " on" : "") + dc + '" data-key="' + k + '" aria-pressed="' + !!onLeaf[k] + '" aria-label="' + MV.esc(aria) + '" tabindex="' + (k === fk ? 0 : -1) + '" style="left:' + fx(x) + "px;top:" + fx(y) + 'px">' + txt + (note ? ' <small>' + note + "</small>" : "") + "</button>";
    } });
    h = '<span class="d1-root" style="left:' + fx(T.root.x) + "px;top:" + fx(T.root.y) + 'px"></span>' + h;
    if (g.names && g.orient === "right") (o.stages || []).forEach(function(s, i){ if (rev >= i + 0.55) h += '<span class="d1-stage" style="left:' + fx(g.left + (i + 1) * g.colW) + 'px;top:4px">' + s.name + "</span>"; });
    svg.innerHTML = (hi ? '<path class="d1-hi" d="' + hi + '"/>' : "") + '<path class="d1-e" d="' + e + '"/>' + (dm ? '<path class="d1-e d1-dm" d="' + dm + '"/>' : "");
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
    grow:function(from, to, done, onLevel){
      var live = true, stop = null, lvl = from;
      function next(){
        if (!live) return;
        if (lvl >= to) { rev = Infinity; render(); if (done) done(); return; }
        var a = lvl; if (onLevel) onLevel(a);
        stop = MV.tween({ dur:620, ease:function(t){ return t; }, step:function(t){ rev = a + t; render(); }, done:function(){ lvl = a + 1; rev = lvl; render(); setTimeout(next, MV.reduceMotion ? 0 : 380); } });
      }
      next();
      return function(){ live = false; if (stop) stop(); };
    },
    set:function(n){ Object.keys(n).forEach(function(k){ o[k] = n[k]; }); },
    render:render,
    leaves:function(){ return build().leaves.map(function(l){ return { key:key(l.path), path:l.path }; }); }
  };
}

// @component flipTree — a two-stage tree (on D1 treeDiagram) that can be redrawn with the second stage first ("Flip the tree"):
// flipped first-level branches are the second stage's totals, flipped second-level branches the reversed conditionals
// P(first | second) = P(both on that path) ÷ P(second). Joint probabilities are exact fractions (MV.mdm.frac).
// ft = flipTree(host, { ids1, ids2, joint(x, y) -> frac, lab(id, stage) -> html, fmt(frac) -> text, br1(x), br2(x, y) (optional
//   unflipped branch texts, e.g. bag counts), names:[stage 1, stage 2], dim(atom) -> bool, label, narrow() -> bool })
// atoms are "x,y" (x = stage-1 id, y = stage-2 id). ft.flipped(); ft.flip(on, done) regrows the tree level by level;
// ft.mark(atoms); ft.render(); ft.p1(x); ft.p2(y)
function flipTree(host, o){
  var flip = false, cancel = null;
  function J(x, y){ return o.joint(x, y) || Z(); }
  function p1(x){ return o.ids2.reduce(function(a, y){ return F.add(a, J(x, y)); }, Z()); }
  function p2(y){ return o.ids1.reduce(function(a, x){ return F.add(a, J(x, y)); }, Z()); }
  function atom(p){ return flip ? p[1] + "," + p[0] : p[0] + "," + p[1]; }
  function kids(p){
    if (!flip) {
      if (!p.length) return o.ids1.filter(function(x){ return p1(x).n > 0; }).map(function(x){ return { id:x, t:o.lab(x, 1), p:o.br1 ? o.br1(x) : o.fmt(p1(x)) }; });
      if (p.length === 1) return o.ids2.filter(function(y){ return J(p[0], y).n > 0; }).map(function(y){ return { id:y, t:o.lab(y, 2), p:o.br2 ? o.br2(p[0], y) : o.fmt(F.div(J(p[0], y), p1(p[0]))) }; });
      return [];
    }
    if (!p.length) return o.ids2.filter(function(y){ return p2(y).n > 0; }).map(function(y){ return { id:y, t:o.lab(y, 2), p:o.fmt(p2(y)) }; });
    if (p.length === 1) return o.ids1.filter(function(x){ return J(x, p[0]).n > 0; }).map(function(x){ return { id:x, t:o.lab(x, 1), p:o.fmt(F.div(J(x, p[0]), p2(p[0]))) }; });
    return [];
  }
  function dim(p){
    if (!o.dim) return false;
    if (p.length >= 2) return o.dim(atom(p));
    var ext = flip ? o.ids1.filter(function(x){ return J(x, p[0]).n > 0; }).map(function(x){ return x + "," + p[0]; }) : o.ids2.filter(function(y){ return J(p[0], y).n > 0; }).map(function(y){ return p[0] + "," + y; });
    return ext.length > 0 && ext.every(function(a){ return o.dim(a); });
  }
  function stages(){ return flip ? [{ name:o.names[1] }, { name:o.names[0] }] : [{ name:o.names[0] }, { name:o.names[1] }]; }
  var tree = treeDiagram(host, { stages:stages(), children:kids, showP:true, tap:false, orient:"right", colW:118, rowH:40, maxH:420, label:o.label,
    get leafW(){ return o.narrow && o.narrow() ? 86 : 132; },
    leafText:function(p){ var lab = flip ? o.lab(p[0], 2) + o.lab(p[1], 1) : o.lab(p[0], 1) + o.lab(p[1], 2), a = atom(p).split(","); return lab + " <small>" + o.fmt(J(a[0], a[1])) + "</small>"; },
    dim:dim });
  var marks = [];
  function keyOf(a){ var s = a.split(","); return flip ? s[1] + "," + s[0] : a; }
  function render(){ tree.set({ stages:stages() }); tree.mark(marks.map(keyOf)); tree.render(); }
  return {
    flipped:function(){ return flip; },
    flip:function(on, done){
      if (cancel) { cancel(); cancel = null; }
      flip = !!on; tree.set({ stages:stages() }); tree.mark(marks.map(keyOf)); tree.reveal(0); tree.render();
      cancel = tree.grow(0, 2, function(){ cancel = null; if (done) done(); });
    },
    mark:function(list){ marks = list || []; },
    render:render, p1:p1, p2:p2, joint:J
  };
}

// @component drawModel — draws from a pool of classes, with or without replacement (copied from MDM4U 05; D1 + D6 support).
// mdl = { ids:["R","B"], count:{R:4, B:2}, rep:false, draws:2 }
//   dmKids(mdl, path) -> [{id, n, d}] branches after path (count left of that class, total left; classes at 0 are left out)
//   dmPaths(mdl) -> [{path, fs:[{n, d}], pr:frac}] every full path with its exact probability (MV.mdm.frac)
function dmKids(mdl, path){
  if (path.length >= mdl.draws) return [];
  var k = {}, n = 0;
  mdl.ids.forEach(function(x){ k[x] = mdl.count[x] || 0; });
  if (!mdl.rep) path.forEach(function(x){ k[x]--; });
  mdl.ids.forEach(function(x){ n += Math.max(0, k[x]); });
  if (n <= 0) return [];
  return mdl.ids.filter(function(x){ return k[x] > 0; }).map(function(x){ return { id:x, n:k[x], d:n }; });
}
function dmPaths(mdl){
  var out = [];
  (function rec(p, fs){
    var ks = dmKids(mdl, p);
    if (!ks.length) { if (p.length === mdl.draws) out.push({ path:p, fs:fs, pr:fs.reduce(function(a, f){ return F.mul(a, F.of(f.n, f.d)); }, F.of(1, 1)) }); return; }
    ks.forEach(function(k){ rec(p.concat([k.id]), fs.concat([{ n:k.n, d:k.d }])); });
  })([], []);
  return out;
}

// @component D2 vennDiagram — conditional version (self-contained; MDM4U 03/04's D2 trimmed to two sets): event circles
// A (--ev-a) and B (--ev-b) in a sample-space box with a count in each region; regions outside a condition fade behind a
// veil (opacity transition), regions in "on" get highlighter yellow. Built once (SVG in a fixed viewBox, so it scales); draw() only
// updates classes and numbers, so fades animate.
// v = vennCond(host) ; v.draw({counts:{a, ab, b, o}, out:{code:1}, on:{code:1}, aria}) ; region codes "a", "ab", "b", "o" (neither)
var VC_UID = 0;
function vennCond(host){
  var u = "cpv" + (++VC_UID), W = 400, H = 250, R = 92, CY = 132, AX = 158, BX = 242;
  var all = 'x="6" y="6" width="388" height="238"', cA = '<circle cx="' + AX + '" cy="' + CY + '" r="' + R + '"', cB = '<circle cx="' + BX + '" cy="' + CY + '" r="' + R + '"';
  function shape(code, cls){
    var r = "<rect " + all + ' class="' + cls + '"';
    if (code === "a") return '<g clip-path="url(#' + u + 'A)">' + r + ' mask="url(#' + u + 'nB)"/></g>';
    if (code === "b") return '<g clip-path="url(#' + u + 'B)">' + r + ' mask="url(#' + u + 'nA)"/></g>';
    if (code === "ab") return '<g clip-path="url(#' + u + 'A)"><g clip-path="url(#' + u + 'B)">' + r + "/></g></g>";
    return r + ' rx="10" mask="url(#' + u + 'nAB)"/>';
  }
  var AN = { a:[108, CY], ab:[200, CY], b:[292, CY], o:[362, 228] }, codes = ["a", "ab", "b", "o"];
  var h = '<svg class="cp-vsvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Venn diagram"><defs>' +
    '<clipPath id="' + u + 'A">' + cA + "/></clipPath>" + '<clipPath id="' + u + 'B">' + cB + "/></clipPath>" +
    '<mask id="' + u + 'nA" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect ' + all + ' fill="white"/>' + cA + ' fill="black"/></mask>' +
    '<mask id="' + u + 'nB" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect ' + all + ' fill="white"/>' + cB + ' fill="black"/></mask>' +
    '<mask id="' + u + 'nAB" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect ' + all + ' fill="white"/>' + cA + ' fill="black"/>' + cB + ' fill="black"/></mask></defs>' +
    "<rect " + all + ' rx="10" class="cp-vu"/>' + cA + ' class="cp-vfa"/>' + cB + ' class="cp-vfb"/>' +
    codes.map(function(c){ return '<g class="cp-vhi" data-r="' + c + '">' + shape(c, "cp-vhs") + "</g>"; }).join("") +
    cA + ' class="cp-voa"/>' + cB + ' class="cp-vob"/>' +
    '<text class="cp-vl cp-vla" x="88" y="40" text-anchor="middle">A</text><text class="cp-vl cp-vlb" x="312" y="40" text-anchor="middle">B</text><text class="cp-vs" x="24" y="28" text-anchor="middle">S</text>' +
    codes.map(function(c){ return '<text class="cp-vn" data-n="' + c + '" x="' + AN[c][0] + '" y="' + AN[c][1] + '" text-anchor="middle" dominant-baseline="central"></text>'; }).join("") +
    codes.map(function(c){ return '<g class="cp-vveil" data-v="' + c + '">' + shape(c, "cp-vvs") + "</g>"; }).join("") + "</svg>";
  host.innerHTML = '<div class="cp-venn">' + h + "</div>";
  var svg = host.querySelector("svg");
  return {
    draw:function(o){
      codes.forEach(function(c){
        svg.querySelector('[data-n="' + c + '"]').textContent = o.counts[c];
        svg.querySelector('[data-r="' + c + '"]').classList.toggle("on", !!(o.on && o.on[c]));
        svg.querySelector('[data-v="' + c + '"]').classList.toggle("on", !!(o.out && o.out[c]));
      });
      if (o.aria) svg.setAttribute("aria-label", o.aria);
    }
  };
}

// ---------- the Given-that filter: the four modes as sample spaces of weighted atoms and named events ----------
var JOBS = { "g11&job":18, "g11&nj":42, "g12&job":30, "g12&nj":30 };
var VCODES = ["a", "ab", "b", "o"], VNAME = { a:"<i>A</i> only", ab:"<i>A</i> ∩ <i>B</i>", b:"<i>B</i> only", o:"Neither" };
function tableDef(){
  var atoms = Object.keys(JOBS).map(function(k){ return { id:k, w:F.of(JOBS[k], 1) }; });
  var ev = {
    g11:{ name:"Grade 11", ph:"Grade 11", v:"are in Grade 11", has:function(id){ return id.indexOf("g11&") === 0; } },
    g12:{ name:"Grade 12", ph:"Grade 12", v:"are in Grade 12", has:function(id){ return id.indexOf("g12&") === 0; } },
    job:{ name:"Job", ph:"job", v:"have a job", has:function(id){ return /&job$/.test(id); } },
    nj:{ name:"No job", ph:"no job", v:"have no job", has:function(id){ return /&nj$/.test(id); } }
  };
  Object.keys(JOBS).forEach(function(k){ var p = k.split("&"), g = p[0] === "g11" ? "Grade 11" : "Grade 12", j = p[1] === "job" ? "job" : "no job";
    ev[k] = { name:g + " and " + j, ph:g + " and " + j, v:(p[0] === "g11" ? "are in Grade 11" : "are in Grade 12") + " and have " + (j === "job" ? "a job" : "no job"), cell:true, has:function(id){ return id === k; } }; });
  return { id:"table", count:true, unit:"students", atoms:atoms, ev:ev, order:["g11", "g12", "job", "nj"] };
}
function vennDef(S){
  var atoms = VCODES.map(function(c){ return { id:c, w:F.of(S.venn[c], 1) }; });
  function inA(c){ return c === "a" || c === "ab"; } function inB(c){ return c === "b" || c === "ab"; }
  var ev = {
    A:{ name:"<i>A</i>", ph:"<i>A</i>", v:"are in <i>A</i>", has:inA, chip:'<b class="ev-a">A</b>' },
    B:{ name:"<i>B</i>", ph:"<i>B</i>", v:"are in <i>B</i>", has:inB, chip:'<b class="ev-b">B</b>' },
    Ap:{ name:"<i>A</i>′ (not <i>A</i>)", ph:"<i>A</i>′", v:"are not in <i>A</i>", has:function(c){ return !inA(c); }, chip:'<b class="ev-a">A</b>′ (not A)' },
    Bp:{ name:"<i>B</i>′ (not <i>B</i>)", ph:"<i>B</i>′", v:"are not in <i>B</i>", has:function(c){ return !inB(c); }, chip:'<b class="ev-b">B</b>′ (not B)' }
  };
  return { id:"venn", count:true, unit:"", atoms:atoms, ev:ev, order:["A", "B", "Ap", "Bp"] };
}
function diceDef(){
  var atoms = [];
  for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) atoms.push({ id:i + "," + j, w:F.of(1, 1) });
  function d(id){ var p = id.split(","); return [+p[0], +p[1]]; }
  var ev = {
    e1:{ name:"First die even", ph:"first die even", v:"have an even first die", has:function(id){ return d(id)[0] % 2 === 0; } },
    f6:{ name:"First die 6", ph:"first die 6", v:"have a 6 on the first die", has:function(id){ return d(id)[0] === 6; } },
    d6:{ name:"Second die 6", ph:"second die 6", v:"have a 6 on the second die", has:function(id){ return d(id)[1] === 6; } },
    s7:{ name:"Sum = 7", ph:"sum = 7", v:"have a sum of 7", has:function(id){ var x = d(id); return x[0] + x[1] === 7; } },
    s8:{ name:"Sum = 8", ph:"sum = 8", v:"have a sum of 8", has:function(id){ var x = d(id); return x[0] + x[1] === 8; } },
    dbl:{ name:"Doubles", ph:"doubles", v:"are doubles", has:function(id){ var x = d(id); return x[0] === x[1]; } }
  };
  return { id:"dice", count:true, unit:"outcomes", atoms:atoms, ev:ev, order:["e1", "f6", "d6", "s7", "s8", "dbl"] };
}
function bagModel(S){ return { ids:["R", "B"], count:{ R:S.bag.r, B:S.bag.b }, rep:false, draws:2 }; }
function treeDef(S){
  var atoms = dmPaths(bagModel(S)).map(function(l){ return { id:l.path.join(","), w:l.pr }; });
  function at(id, k){ return id.split(",")[k]; }
  var ev = {
    R1:{ name:Lt("R", 1) + " first red", ph:"<i>R</i><sub>1</sub>", w:"first red", has:function(id){ return at(id, 0) === "R"; } },
    B1:{ name:Lt("B", 1) + " first blue", ph:"<i>B</i><sub>1</sub>", w:"first blue", has:function(id){ return at(id, 0) === "B"; } },
    R2:{ name:Lt("R", 2) + " second red", ph:"<i>R</i><sub>2</sub>", w:"second red", has:function(id){ return at(id, 1) === "R"; } },
    B2:{ name:Lt("B", 2) + " second blue", ph:"<i>B</i><sub>2</sub>", w:"second blue", has:function(id){ return at(id, 1) === "B"; } }
  };
  return { id:"tree", count:false, atoms:atoms, ev:ev, order:["R1", "B1", "R2", "B2"] };
}

// ---------- Explore: the Given-that filter ----------
function explore(host, api){
  var S = api.S, MODES = ["table", "venn", "dice", "tree"];
  if (MODES.indexOf(S.mode) < 0) S.mode = "table";
  S.sel = S.sel && typeof S.sel === "object" ? S.sel : {};
  var DEF = { table:{ g:"g12", f:"job" }, venn:{ g:"B", f:"A" }, dice:{ g:"", f:"s8" }, tree:{ g:"R1", f:"R2" } };
  MODES.forEach(function(m){ if (!S.sel[m] || typeof S.sel[m] !== "object") S.sel[m] = { g:DEF[m].g, f:DEF[m].f }; });
  if (S.role !== "f") S.role = "g";
  S.venn = S.venn && typeof S.venn === "object" ? S.venn : {};
  var V0 = { a:6, ab:4, b:10, o:10 };
  VCODES.forEach(function(c){ var x = S.venn[c]; S.venn[c] = typeof x === "number" && x >= 0 && x <= 30 ? Math.round(x) : V0[c]; });
  S.bag = S.bag && typeof S.bag === "object" ? S.bag : {};
  S.unlock = !!S.unlock; if (!S.unlock) { S.bag.r = 4; S.bag.b = 2; }
  S.bag.r = clampI(S.bag.r, 1, 20, 4); S.bag.b = clampI(S.bag.b, 1, 10, 2);
  S.flip = !!S.flip; S.swapped = !!S.swapped;
  var pv = {}, anim = null;
  function clampI(v, lo, hi, d){ return typeof v === "number" && isFinite(v) ? Math.max(lo, Math.min(hi, Math.round(v))) : d; }

  host.innerHTML = '<div id="cp-modes"></div>' +
    '<div class="pg cp-pg"><div class="pg-graph" data-mv="graph">' +
      '<div class="cp-formula" id="cp-formula"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="cp-v-table"></div><div id="cp-v-venn" hidden></div><div id="cp-v-dice" hidden></div>' +
      '<div id="cp-v-tree" hidden><p class="cp-bag" id="cp-bag"></p><div id="cp-tree"></div></div>' +
      '<div class="cp-fbar" id="cp-fbar"></div></div>' +
    '<div class="pg-ctrl"><div id="cp-role"></div><p class="cp-cue" id="cp-cue"></p><div id="cp-evs" class="cp-evs"></div>' +
      '<div class="q-actions cp-acts"><button type="button" class="btn sm" id="cp-swap">Swap given and find</button><button type="button" class="btn ghost sm" id="cp-clear">Clear both</button></div>' +
      '<div id="cp-ctl-venn" hidden><p class="cp-sub">Region counts (0 to 30)</p><div class="cp-vin">' + VCODES.map(function(c){
        var nm = MV.plain(VNAME[c]);
        return '<div class="cp-vrow"><span class="cp-vlab">' + VNAME[c] + '</span><button type="button" class="btn ghost sm cp-step" data-vs="' + c + '" data-d="-1" aria-label="One fewer: ' + nm + '">−</button><input class="numin cp-vnum" data-vn="' + c + '" type="text" inputmode="numeric" autocomplete="off" aria-label="Count: ' + nm + '"><button type="button" class="btn ghost sm cp-step" data-vs="' + c + '" data-d="1" aria-label="One more: ' + nm + '">+</button></div>';
      }).join("") + "</div></div>" +
      '<div id="cp-ctl-tree" hidden><div class="q-actions"><button type="button" class="btn sm" id="cp-flip" aria-pressed="false">Flip the tree</button>' +
        '<label class="cp-switch"><input type="checkbox" role="switch" id="cp-unlock"><span class="cp-track" aria-hidden="true"></span><span>Unlock the bag</span></label></div>' +
        '<div id="cp-bagsl" hidden>' + [["r", "Red marbles, ", 20, "--red"], ["b", "Blue marbles, ", 10, "--pen"]].map(function(d){
          return '<label class="slider cp-sl"><span class="slider-top"><span>' + d[1] + mm(d[0]) + '</span><output data-bo="' + d[0] + '"></output></span><input type="range" data-bs="' + d[0] + '" min="1" max="' + d[2] + '" step="1" style="accent-color:var(' + d[3] + ')" aria-label="' + d[1] + d[0] + '"></label>';
        }).join("") + "</div></div>" +
    '</div><div class="pg-read"><dl class="read" id="cp-read"></dl><p class="vh" id="cp-say" aria-live="polite"></p></div></div>';

  // --- views ---
  $("#cp-v-table", host).innerHTML = '<div class="tbl-wrap"><table class="cp-tw"><caption class="vh">Students by grade and part-time job (tap a row, column or cell)</caption><thead><tr><td class="cp-corner"></td>' +
    ["job", "nj"].map(function(c){ return '<th scope="col" data-hd="' + c + '"><button type="button" class="cp-hb" data-ev="' + c + '">' + (c === "job" ? "Job" : "No job") + '<span class="cp-tg" data-tg="' + c + '"></span></button></th>'; }).join("") + '<th scope="col" class="cp-totc">Total</th></tr></thead><tbody>' +
    ["g11", "g12"].map(function(r){ return '<tr><th scope="row" data-hd="' + r + '"><button type="button" class="cp-hb" data-ev="' + r + '">' + (r === "g11" ? "Grade 11" : "Grade 12") + '<span class="cp-tg" data-tg="' + r + '"></span></button></th>' +
      ["job", "nj"].map(function(c){ var k = r + "&" + c; return '<td data-at="' + k + '"><button type="button" class="cp-cb" data-ev="' + k + '" aria-label="' + (r === "g11" ? "Grade 11" : "Grade 12") + " and " + (c === "job" ? "job" : "no job") + ": " + JOBS[k] + '">' + JOBS[k] + '<span class="cp-tg" data-tg="' + k + '"></span></button></td>'; }).join("") +
      '<td class="cp-tot" data-tot="' + r + '">60</td></tr>'; }).join("") +
    '<tr class="cp-totr"><th scope="row">Total</th><td data-tot="job">48</td><td data-tot="nj">72</td><td data-tot="all">120</td></tr></tbody></table></div>';
  var venn = vennCond($("#cp-v-venn", host));
  var dh = '<div class="tbl-wrap cp-dwrap"><table class="cp-dice"><caption class="vh">Two dice: the 36 outcomes, each cell showing the sum</caption><thead><tr><td class="cp-dcorner"><span>2nd die →</span><span>1st die ↓</span></td>';
  for (var c0 = 1; c0 <= 6; c0++) dh += '<th scope="col">' + c0 + "</th>";
  dh += "</tr></thead><tbody>";
  for (var r0 = 1; r0 <= 6; r0++) { dh += '<tr><th scope="row">' + r0 + "</th>"; for (var c1 = 1; c1 <= 6; c1++) dh += '<td data-at="' + r0 + "," + c1 + '"><span>' + (r0 + c1) + "</span></td>"; dh += "</tr>"; }
  $("#cp-v-dice", host).innerHTML = dh + "</tbody></table></div>";
  var ft = flipTree($("#cp-tree", host), { ids1:["R", "B"], ids2:["R", "B"], names:["Draw 1", "Draw 2"], label:"Tree diagram: two draws without replacement",
    joint:function(x, y){ var l = dmPaths(bagModel(S)).filter(function(p){ return p.path[0] === x && p.path[1] === y; })[0]; return l ? l.pr : Z(); },
    br1:function(x){ var k = dmKids(bagModel(S), []).filter(function(q){ return q.id === x; })[0]; return k ? k.n + "/" + k.d : "0"; },
    br2:function(x, y){ var k = dmKids(bagModel(S), [x]).filter(function(q){ return q.id === y; })[0]; return k ? k.n + "/" + k.d : "0"; },
    lab:function(id, k){ return Lt(id, k); }, fmt:function(f){ return F.txt(f); },
    narrow:function(){ return ($("#cp-tree", host).clientWidth || 600) < 420; },
    dim:function(a){ var G = treeG(); return !!G && !G.has(a); } });

  // --- controls ---
  var modeR = radios($("#cp-modes", host), { label:"Mode", options:[{ id:"table", t:"Table" }, { id:"venn", t:"Venn" }, { id:"dice", t:"Dice" }, { id:"tree", t:"Tree" }], value:S.mode, cls:"seg",
    onChange:function(v){ user(); S.mode = v; S.role = cur().g ? "f" : "g"; save(); render(); MV.changed(); } });
  var roleR = radios($("#cp-role", host), { label:"Tap to set", options:[{ id:"g", t:'1. Given <span class="cp-rk cp-rk-g">A</span>' }, { id:"f", t:'2. Find <span class="cp-rk cp-rk-f">B</span>' }], value:S.role, cls:"seg",
    onChange:function(v){ S.role = v; save(); paintCue(); paintChips(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.ev) { pick(b.dataset.ev); return; }
    if (b.id === "cp-swap") { user(); var s = cur(), t = s.g; s.g = s.f; s.f = t; S.swapped = true; save(); render(); MV.changed(); return; }
    if (b.id === "cp-clear") { user(); var s2 = cur(); s2.g = ""; s2.f = ""; S.role = "g"; save(); render(); MV.changed(); return; }
    if (b.id === "cp-flip") { user(); S.flip = !S.flip; save(); ft.mark(markAtoms()); ft.flip(S.flip); paintTreeCtl(); return; }
    if (b.dataset.vs) { user(); var c = b.dataset.vs; S.venn[c] = Math.max(0, Math.min(30, S.venn[c] + +b.dataset.d)); save(); syncVenn(); render(); MV.changed(); }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.vn) { var v = String(t.value).trim(); if (/^\d{1,2}$/.test(v) && +v <= 30) { user(); S.venn[t.dataset.vn] = +v; t.classList.remove("cp-bad"); save(); render(); MV.changed(); } else t.classList.add("cp-bad"); return; }
    if (t.dataset && t.dataset.bs) { user(); S.bag[t.dataset.bs] = +t.value; save(); paintTreeCtl(); render(); MV.changed(); }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset && t.dataset.vn) { t.value = S.venn[t.dataset.vn]; t.classList.remove("cp-bad"); }
    if (t.id === "cp-unlock") { user(); S.unlock = t.checked; if (!S.unlock) { S.bag.r = 4; S.bag.b = 2; } save(); paintTreeCtl(); render(); MV.changed(); }
  });
  function syncVenn(){ $$("[data-vn]", host).forEach(function(el){ if (document.activeElement !== el || !el.classList.contains("cp-bad")) { el.value = S.venn[el.dataset.vn]; el.classList.remove("cp-bad"); } }); }
  function paintTreeCtl(){
    var fb = $("#cp-flip", host); fb.setAttribute("aria-pressed", S.flip); fb.textContent = S.flip ? "Unflip the tree" : "Flip the tree";
    $("#cp-unlock", host).checked = S.unlock; $("#cp-bagsl", host).hidden = !S.unlock;
    ["r", "b"].forEach(function(k){ var el = host.querySelector('[data-bs="' + k + '"]'); if (+el.value !== S.bag[k]) el.value = S.bag[k]; host.querySelector('[data-bo="' + k + '"]').textContent = S.bag[k]; });
  }

  function save(){ api.save(); }
  function cur(){ return S.sel[S.mode]; }
  function def(){ return S.mode === "table" ? tableDef() : S.mode === "venn" ? vennDef(S) : S.mode === "dice" ? diceDef() : treeDef(S); }
  function pick(id){
    var s = cur(), M = def(), e = M.ev[id]; if (!e) return;
    user();
    var role = e.cell ? "f" : S.role;
    if (role === "g") { if (s.g === id) s.g = ""; else { if (s.f === id) s.f = ""; s.g = id; S.role = "f"; } }
    else { if (s.f === id) s.f = ""; else { if (s.g === id) s.g = ""; s.f = id; } }
    save(); render(); MV.changed();
    var nb = host.querySelector('[data-ev="' + id + '"]'); if (nb && document.activeElement !== nb) nb.focus({ preventScroll:true });
  }

  // --- the numbers ---
  function calc(){
    var M = def(), s = cur(), G = M.ev[s.g] || null, Fv = M.ev[s.f] || null, tot = Z(), nG = Z(), nF = Z(), nGF = Z(), inF = [];
    M.atoms.forEach(function(a){
      tot = F.add(tot, a.w);
      var g = !G || G.has(a.id), f = !!Fv && Fv.has(a.id);
      if (g) nG = F.add(nG, a.w); if (f) { nF = F.add(nF, a.w); inF.push(a); } if (g && f) nGF = F.add(nGF, a.w);
    });
    return { M:M, G:G, Fv:Fv, tot:tot, nG:nG, nF:nF, nGF:nGF, inF:inF,
      cond:nG.n ? F.div(nGF, nG) : null, pF:tot.n ? F.div(nF, tot) : null, rev:nF.n ? F.div(nGF, nF) : null };
  }
  function Pof(Ev, Gv){ return Pw(Ev.ph + (Gv ? " | " + Gv.ph : "")); }
  function cnt(f){ return N(f.n); }                               // a whole-number count (fractions with d = 1)
  function ratio(n, d, cntMode){ return cntMode ? F.prob(n.n, d.n) : F.txt(n) + " ÷ " + F.txt(d) + " = " + F.txt(F.div(n, d)) + eqTxt(F.div(n, d)); }
  function pathSum(st){ return st.inF.length > 1 ? st.inF.map(function(a){ return F.txt(a.w); }).join(" + ") + " = " + F.txt(st.nF) : F.txt(st.nF); }

  // --- painting ---
  function render(){
    modeR.set(S.mode); roleR.set(S.role);
    MODES.forEach(function(m){ $("#cp-v-" + m, host).hidden = m !== S.mode; });
    $("#cp-ctl-venn", host).hidden = S.mode !== "venn"; $("#cp-ctl-tree", host).hidden = S.mode !== "tree";
    var st = calc();
    if (S.mode === "table") paintTable(st); else if (S.mode === "venn") paintVenn(st); else if (S.mode === "dice") paintDice(st); else paintTree(st);
    paintChips(); paintCue(); paintFormula(st); paintBar(st); paintRead(st); paintSay(st);
  }
  function roleOf(id){ var s = cur(); return s.g === id ? "g" : s.f === id ? "f" : ""; }
  function tag(id){ var r = roleOf(id); return r === "g" ? '<span class="cp-rk cp-rk-g" aria-hidden="true">A</span><span class="vh"> (given)</span>' : r === "f" ? '<span class="cp-rk cp-rk-f" aria-hidden="true">B</span><span class="vh"> (find)</span>' : ""; }
  function atomCls(el, st, id){
    var g = !st.G || st.G.has(id), f = !!st.Fv && st.Fv.has(id);
    el.classList.toggle("cp-out", !g);
    el.classList.toggle("cp-g", !!st.G && g && !f);
    el.classList.toggle("cp-f", f && !g);
    el.classList.toggle("cp-on", f && g);
  }
  function paintTable(st){
    var v = $("#cp-v-table", host);
    Object.keys(JOBS).forEach(function(k){ atomCls(v.querySelector('[data-at="' + k + '"]'), st, k); });
    ["g11", "g12", "job", "nj"].concat(Object.keys(JOBS)).forEach(function(id){
      var b = v.querySelector('[data-ev="' + id + '"]'), r = roleOf(id);
      b.setAttribute("aria-pressed", r !== ""); b.classList.toggle("cp-isg", r === "g"); b.classList.toggle("cp-isf", r === "f");
      v.querySelector('[data-tg="' + id + '"]').innerHTML = tag(id);
    });
    var s = cur(), HD = { g11:["g11&job", "g11&nj"], g12:["g12&job", "g12&nj"], job:["g11&job", "g12&job"], nj:["g11&nj", "g12&nj"] };
    Object.keys(HD).forEach(function(hd){
      var out = !!st.G && !HD[hd].some(function(k){ return st.G.has(k); });
      v.querySelector('[data-hd="' + hd + '"]').classList.toggle("cp-out", out); v.querySelector('[data-tot="' + hd + '"]').classList.toggle("cp-out", out);
    });
    ["g11", "g12", "job", "nj", "all"].forEach(function(t){ v.querySelector('[data-tot="' + t + '"]').classList.toggle("cp-den", st.G ? t === s.g : t === "all"); });
  }
  function paintVenn(st){
    var out = {}, on = {};
    VCODES.forEach(function(c){ var g = !st.G || st.G.has(c), f = !!st.Fv && st.Fv.has(c); if (!g) out[c] = 1; if (g && f) on[c] = 1; });
    venn.draw({ counts:S.venn, out:out, on:on,
      aria:"Venn diagram. " + VCODES.map(function(c){ return MV.plain(VNAME[c]) + ": " + S.venn[c]; }).join(", ") + "." + (st.G ? " Faded: everything outside " + MV.plain(st.G.name) + "." : "") });
    syncVenn();
  }
  function paintDice(st){ var v = $("#cp-v-dice", host); st.M.atoms.forEach(function(a){ atomCls(v.querySelector('[data-at="' + a.id + '"]'), st, a.id); }); }
  function paintTree(st){
    var r = S.bag.r, b = S.bag.b, h = "";
    for (var i = 0; i < r; i++) h += marble("R"); for (var j = 0; j < b; j++) h += marble("B");
    $("#cp-bag", host).innerHTML = '<span class="cp-mbs" aria-hidden="true">' + h + '</span> <span class="tiny">Bag: ' + r + " red (R), " + b + " blue (B); two draws without replacement." + (S.flip ? " <strong>Flipped:</strong> second draw first." : "") + "</span>";
    ft.mark(markAtoms()); if (ft.flipped() !== S.flip) ft.flip(S.flip); else ft.render();
  }
  function treeG(){ return treeDef(S).ev[S.sel.tree.g] || null; }
  function markAtoms(){
    if (pv.marks) return pv.marks;
    var M = treeDef(S), G = M.ev[S.sel.tree.g], Fv = M.ev[S.sel.tree.f]; if (!Fv) return [];
    return M.atoms.filter(function(a){ return Fv.has(a.id) && (!G || G.has(a.id)); }).map(function(a){ return a.id; });
  }
  function paintChips(){
    var box = $("#cp-evs", host);
    if (S.mode === "table") { box.innerHTML = ""; box.hidden = true; return; }
    box.hidden = false;
    var M = def();
    MV.keepFocus(box, function(){
      box.innerHTML = '<span class="rg-lab">' + (S.mode === "venn" ? "Sets" : "Events") + '</span><span class="cp-chips">' + M.order.map(function(id){
        var e = M.ev[id], r = roleOf(id);
        return '<button type="button" class="cp-ev' + (r ? " cp-is" + r : "") + '" data-ev="' + id + '" data-k="cpev' + id + '" aria-pressed="' + (r !== "") + '">' + (e.chip || e.name) + tag(id) + "</button>";
      }).join("") + "</span>";
    });
  }
  function paintCue(){
    var g = S.role === "g", what = S.mode === "table" ? (g ? "a row or column" : "a row, column or single cell") : S.mode === "venn" ? "a set" : "an event";
    $("#cp-cue", host).innerHTML = g ? "<strong>Step 1:</strong> tap " + what + " to make it the condition (" + mm("A") + ", given). Everything outside it fades."
      : "<strong>Step 2:</strong> tap " + what + " for what you’re looking for (" + mm("B") + ", find)." + (S.mode === "table" ? " A single cell is an “and” event." : "");
  }
  function hideP(){ return !!pv.hide; }
  function paintFormula(st){
    var el = $("#cp-formula", host), H = hideP(), cm = st.M.count, l1, l2;
    if (st.Fv && st.G) {
      l1 = mm("P(B | A) = P(A ∩ B) ÷ P(A)");
      if (H) l2 = Pof(st.Fv, st.G) + " " + mm("=") + " " + qm();
      else if (!st.nG.n) l2 = Pof(st.Fv, st.G) + " is undefined: " + mm("n(A) = 0") + ".";
      else l2 = Pof(st.Fv, st.G) + " " + mm("= " + (cm ? st.nGF.n + "/" + st.tot.n + " ÷ " + st.nG.n + "/" + st.tot.n : F.txt(st.nGF) + " ÷ " + F.txt(st.nG)) + " = " + F.txt(st.cond));
    } else if (st.Fv) {
      l1 = mm("P(B)") + ' <span class="cp-capw">(no condition yet: the whole sample space)</span>';
      l2 = Pof(st.Fv) + " " + mm("=") + " " + (H ? qm() : mm(cm ? F.prob(st.nF.n, st.tot.n, { dec:false }) : pathSum(st)));
    } else {
      l1 = mm("P(B | A) = P(A ∩ B) ÷ P(A)");
      l2 = '<span class="cp-capw">' + (st.G ? "Now choose what you’re looking for (Find, " + mm("B") + ")." : "Choose a condition (Given, " + mm("A") + "), then what you’re looking for (Find, " + mm("B") + ").") + "</span>";
    }
    el.innerHTML = '<p class="cp-f1">' + l1 + '</p><p class="cp-f2">' + l2 + "</p>";
  }
  function bar(label, f, cls){
    var w = f == null ? 0 : Math.max(0, Math.min(1, val(f))) * 100;
    return '<p class="cp-bl">' + label + '</p><div class="cp-bar' + (cls ? " " + cls : "") + '" aria-hidden="true"><i style="width:' + w.toFixed(2) + '%"></i></div>';
  }
  function paintBar(st){
    var el = $("#cp-fbar", host), cm = st.M.count, H = hideP(), h = "";
    if (!st.Fv) { el.innerHTML = ""; return; }
    if (st.G && st.nG.n) h += bar(mm(cm ? "n(A ∩ B) ÷ n(A)" : "P(A ∩ B) ÷ P(A)") + " " + (H ? mm("=") + " " + qm() : mm("= " + (cm ? st.nGF.n + " ÷ " + st.nG.n : F.txt(st.nGF) + " ÷ " + F.txt(st.nG)))) + ' <span class="cp-capw">(the condition is the whole bar)</span>', H ? null : st.cond, "cp-bar1");
    h += bar('<span class="cp-capw">Without the condition:</span> ' + mm(cm ? "n(B) ÷ total" : "P(B)") + " " + (H ? mm("=") + " " + qm() : mm("= " + (cm ? st.nF.n + " ÷ " + st.tot.n : F.txt(st.nF)))), H ? null : st.pF, "cp-bar2");
    el.innerHTML = h;
  }
  function paintRead(st){
    var H = hideP(), cm = st.M.count, rows = [], G = st.G, Fv = st.Fv;
    rows.push(["Given (" + mm("A") + ")", G ? G.name : muted("none: the whole sample space")]);
    if (cm) rows.push([mm("n(A)") + " or " + mm("P(A)"), G ? cnt(st.nG) + " " + muted("(" + dec(F.div(st.nG, st.tot)) + ")") : cnt(st.tot) + " " + muted("(everything)")]);
    else rows.push([mm("P(A)"), G ? mm(F.txt(st.nG)) : "1 " + muted("(everything)")]);
    if (!Fv) { rows.push(["Find (" + mm("B") + ")", muted("Choose what you’re looking for.")]); $("#cp-read", host).innerHTML = MV.readoutHTML(rows); return; }
    rows.push([mm("A ∩ B") + " " + muted("(" + MV.plain(Fv.name) + (G ? " in " + MV.plain(G.name) : "") + ")"), H ? qm() : cm ? cnt(st.nGF) + " " + muted("(" + dec(F.div(st.nGF, st.tot)) + ")") : mm(F.txt(st.nGF))]);
    var condTxt;
    if (!G) condTxt = muted("Set a condition first. With none, it’s just ") + Pof(Fv) + ".";
    else if (H) condTxt = Pof(Fv, G) + " " + mm("=") + " " + qm();
    else if (!st.nG.n) condTxt = Pof(Fv, G) + " is undefined: nothing is in " + G.name + ".";
    else condTxt = Pof(Fv, G) + " " + mm("= " + ratio(st.nGF, st.nG, cm));
    rows.push([mm("P(B | A)"), condTxt]);
    rows.push([mm("P(B)") + " without the condition", Pof(Fv) + " " + mm("=") + " " + (H ? qm() : mm(cm ? F.prob(st.nF.n, st.tot.n) : pathSum(st) + eqTxt(st.nF)))]);
    var ind;
    if (!G) ind = muted("Set a condition to compare.");
    else if (H) ind = qm();
    else if (!st.nG.n) ind = muted("—");
    else if (F.eq(st.cond, st.pF)) ind = mm("P(B | A) = P(B)") + ": " + mm(F.txt(st.cond) + " = " + F.txt(st.pF)) + ", so <strong>independent</strong>";
    else ind = mm("P(B | A) ≠ P(B)") + ": " + mm(F.txt(st.cond) + " ≠ " + F.txt(st.pF)) + ", so <strong>dependent</strong>";
    rows.push(["Independence check", ind]);
    if (S.swapped && G) rows.push(["Swapped, " + mm("P(A | B)"), H || pv.hideRev ? qm() : !st.nF.n ? Pof(G, Fv) + " is undefined" : Pof(G, Fv) + " " + mm("= " + ratio(st.nGF, st.nF, cm))]);
    $("#cp-read", host).innerHTML = MV.readoutHTML(rows);
  }
  var lastSay = "";
  function paintSay(st){
    var t = "";
    if (st.G && st.Fv && !hideP() && st.nG.n) {
      if (st.M.count) t = "Given " + MV.plain(st.G.name) + ": " + st.nGF.n + " of " + N(st.nG.n) + (st.M.unit ? " " + st.M.unit : "") + " " + MV.plain(st.Fv.v) + ", probability " + F.txt(st.cond) + ".";
      else t = "Given " + st.G.w + ": the probability of " + st.Fv.w + " is " + F.txt(st.cond) + ".";
    }
    if (t !== lastSay) { lastSay = t; $("#cp-say", host).textContent = t; }
  }

  // --- animation bookkeeping; any user action cancels and finishes it ---
  function newAnim(fin){ cancelAnim(); anim = { timers:[], fin:fin || null }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function endAnim(){ var a = anim; anim = null; if (a && a.fin) { var f = a.fin; a.fin = null; f(); } }
  function cancelAnim(){ if (!anim) return; var a = anim; anim = null; a.timers.forEach(clearTimeout); if (a.fin) { var f = a.fin; a.fin = null; f(); } }
  function user(){ var had = !!anim || Object.keys(pv).length > 0; cancelAnim(); pv = {}; MV.banner("", ""); if (had) render(); }

  syncVenn(); paintTreeCtl(); render();

  // --- predictions ---
  function setMode(m, g, f){ S.mode = m; S.sel[m].g = g; S.sel[m].f = f; S.role = g ? "f" : "g"; }
  function startPred(p){
    cancelAnim(); pv = { hide:true };
    if (p.id === "p1") { setMode("table", "", ""); S.swapped = false; }
    else if (p.id === "p2") { setMode("tree", "", "R2"); S.unlock = false; S.bag.r = 4; S.bag.b = 2; S.flip = false; pv.marks = []; }
    else if (p.id === "p3") setMode("dice", "", "s8");
    else if (p.id === "p4") setMode("dice", "", "f6");
    save(); paintTreeCtl(); render(); MV.changed();
  }
  function finish(){ pv = {}; render(); MV.changed(); endAnim(); }
  function runPred(p, done){
    newAnim(done);
    if (p.id === "p1") later(300, function(){
      var s = cur(); s.g = "g12"; pv = { hide:true }; render();
      later(800, function(){ s.f = "job"; S.role = "f"; pv = { hideRev:true }; render();
        later(1600, function(){ s.g = "job"; s.f = "g12"; S.swapped = true; save(); pv = {}; render(); later(1400, finish); }); });
    });
    else if (p.id === "p2") later(300, function(){
      pv.marks = ["R,R"]; render();
      later(900, function(){ pv.marks = ["R,R", "B,R"]; render(); later(900, finish); });
    });
    else if (p.id === "p3" || p.id === "p4") later(300, function(){
      var s = cur(); s.g = p.id === "p3" ? "e1" : "s7"; S.role = "f"; save(); pv = { hide:true }; render();
      later(1100, finish);
    });
    else finish();
  }

  return {
    predict:{ start:startPred, run:runPred },
    challenge:function(id){ return chal(id); }
  };

  function chal(id){
    var s = cur(), st;
    if (id === "tc1") {
      if (S.mode !== "table") return { ok:false, msg:"Switch to Table mode first." };
      s = S.sel.table;
      if (s.g === "g11" && (s.f === "nj" || s.f === "g11&nj")) return { ok:true };
      if (s.g === "nj" && (s.f === "g11" || s.f === "g11&nj")) return { ok:false, msg:"That’s " + Pw("Grade 11 | no job") + ". The condition is Grade 11." };
      if (!s.g && s.f === "g11&nj") return { ok:false, msg:"That’s " + Pw("Grade 11 and no job") + ". Set Grade 11 as the condition." };
      if (!s.g) return { ok:false, msg:"No condition is set, so the filter divides by all 120 students. Set Grade 11 as the condition." };
      if (s.g === "g11") return { ok:false, msg:"Grade 11 is the right condition. Now choose No job as what you’re looking for." };
      st = calc();
      return { ok:false, msg:"Your filter shows " + (st.Fv ? Pof(st.Fv, st.G) : "the condition " + st.G.name + " with nothing to find") + ". The challenge asks for " + Pw("no job | Grade 11") + ": the condition comes after the bar." };
    }
    if (id === "tc2") {
      if (S.mode !== "venn") return { ok:false, msg:"Switch to Venn mode first." };
      var v = S.venn;
      if (v.a === 4 && v.ab === 4 && v.b === 8) return { ok:true };
      if (v.ab === 4 && v.a === 8 && v.b === 4) return { ok:false, msg:"Those are swapped: " + mm("P(A | B) = 4 ÷ n(B) = 1/3") + " needs " + mm("n(B) = 12") + "." };
      if (v.ab === 4 && v.a === 0) return { ok:false, msg:mm("n(A)") + " includes the overlap: " + VNAME.a + " = 4 makes " + mm("n(A) = 8") + "." };
      if (v.ab !== 4) return { ok:false, msg:"Set the overlap first: " + mm("n(A ∩ B) = 4") + "." };
      var nA = v.a + v.ab, nB = v.b + v.ab;
      return { ok:false, msg:"Now " + mm("P(A | B) = 4/" + nB + " = " + F.txt(F.of(4, nB))) + " and " + mm("P(B | A) = 4/" + nA + " = " + F.txt(F.of(4, nA))) + ". You need " + mm("1/3") + " and " + mm("1/2") + "." };
    }
    if (id === "tc3") {
      if (S.mode !== "tree") return { ok:false, msg:"Switch to Tree mode first." };
      if (!S.unlock) return { ok:false, msg:"Unlock the bag first, then set the red and blue counts." };
      var r = S.bag.r, b = S.bag.b, n = r + b, num = r * (r - 1), den = n * (n - 1);
      if (2 * num === den) return { ok:true };
      if (r === b) return { ok:false, msg:"That makes the first draw " + mm("1/2") + ", but both red needs the second draw too." };
      if (r === 2 && b === 1) return { ok:false, msg:mm("P = 2/3 × 1/2 = 1/3") + ". Add a red." };
      return { ok:false, msg:Pw("both red") + " " + mm("= " + r + "/" + n + " × " + (r - 1) + "/" + (n - 1) + " = " + F.txt(F.of(num, den))) + ", not " + mm("1/2") + "." };
    }
    return { ok:false };
  }
}

// ---------- hero: 120 students; given Grade 12 (30 of 60 → 1/2), then given has a job (30 of 48 → 5/8) ----------
function hero(f){
  var root = $("#cph"), grid = $("#cph-grid"), given = $("#cph-given"), cap = f.cap;
  if (!grid) return;
  var CW = 14, RH = 20, LX = 66, GAP = 12, h = '<svg viewBox="0 0 ' + (LX + 20 * CW + 2) + " " + (6 * RH + GAP + 4) + '" class="cph-svg">';
  [["Grade 11", 0], ["Grade 12", 3 * RH + GAP]].forEach(function(g){ h += '<text class="cph-lab" x="' + (LX - 8) + '" y="' + (g[1] + 1.5 * RH + 4) + '" text-anchor="end">' + g[0] + "</text>"; });
  for (var gi = 0; gi < 2; gi++) for (var r = 0; r < 3; r++) for (var c = 0; c < 20; c++) {
    var job = c < (gi ? 10 : 6), x = LX + c * CW + CW / 2, y = gi * (3 * RH + GAP) + r * RH + 2, cls = "cph-p " + (gi ? "g12" : "g11") + (job ? " j" : " nj");
    h += '<g class="' + cls + '">' + (gi && job ? '<rect class="cph-hl" x="' + (x - CW / 2 + 0.5) + '" y="' + (y - 1) + '" width="' + (CW - 1) + '" height="' + (RH - 1) + '" rx="2"/>' : "") +
      '<circle cx="' + x + '" cy="' + (y + 4.5) + '" r="3"/><path d="M' + (x - 4.5) + " " + (y + 17) + "v-3.5a4.5 4.5 0 0 1 9 0v3.5z\"/></g>";
  }
  grid.innerHTML = h + "</svg>";
  var C1 = "Given Grade 12: 30 of 60 have jobs → " + mm("1/2"), C2 = "Given has a job: 30 of 48 are in Grade 12 → " + mm("5/8");
  function frame(s, g, c){ root.classList.remove("s1", "s2"); if (s) root.classList.add(s); given.innerHTML = g; cap.innerHTML = c; }
  if (MV.reduceMotion) { frame("s2", "Given: has a job", C1 + "<br>" + C2); return; }
  frame("", "120 students", "Shaded: has a job. 18 in Grade 11, 30 in Grade 12.");
  var seq = [
    [1300, function(){ frame("s1", "Given: Grade 12", ""); }],
    [900, function(){ frame("s1", "Given: Grade 12", C1); }],
    [3000, function(){ frame("s2", "Given: has a job", C1); }],
    [900, function(){ frame("s2", "Given: has a job", C2); }],
    [2600, function(){ frame("s2", "Given: has a job", C1 + "<br>" + C2); }]
  ], i = 0;
  (function next(){ if (i >= seq.length) return; var s = seq[i++]; MV.wait(s[0], function(){ s[1](); next(); }); })();
}

// ---------- Part 3: Medical test puzzle (dot grid, tree flip, base-rate slider) ----------
function part3(host, api){
  var C = api.content, S = api.S, ST = C.stations;
  if (!ST.some(function(s){ return s.id === S.st; })) S.st = ST[0].id;
  S.ask = typeof S.ask === "string" ? S.ask : ""; S.base = typeof S.base === "number" && S.base >= 1 && S.base <= 50 ? Math.round(S.base) : 2;
  S.flip = !!S.flip;
  var s1 = ST[0], s2 = ST[1], s3 = ST[2];
  host.innerHTML = '<p class="cp-model">' + C.model + ' <span class="mdm-model">model data</span></p><div id="cp3-st" class="cp3-st"></div>' +
    // station 1
    '<div class="cp3-s" data-st="s1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><div class="sym cp3-sym"><div>' +
      '<canvas class="plot cp3-dots" id="cp3-dots" role="img" aria-label="Grid of 10 000 people"></canvas>' +
      '<p class="legend tiny cp3-leg"><span><i class="cp3-k cp3-kc" aria-hidden="true">+</i>has the condition</span><span><i class="cp3-k cp3-kp" aria-hidden="true"></i>tested positive</span><span><i class="cp3-k cp3-kn" aria-hidden="true"></i>doesn’t have it</span><span id="cp3-each"></span></p></div>' +
      '<div><div id="cp3-pl"></div><ol class="cp3-steps" id="cp3-steps" aria-live="polite"></ol>' +
      '<div class="q-actions"><button type="button" class="btn" id="cp3-who" aria-pressed="false" disabled>Who tested positive?</button></div>' +
      '<dl class="read" id="cp3-r1" aria-live="polite"></dl>' +
      '<div class="cp3-ask" id="cp3-ask" hidden><div class="numrow"><label for="cp3-in">' + s1.ask + '</label><input class="numin short" id="cp3-in" type="text" inputmode="decimal" autocomplete="off"><button type="button" class="btn primary sm" id="cp3-chk">Check</button></div><div id="cp3-fb"></div></div>' +
    "</div></div></div>" +
    // station 2
    '<div class="cp3-s" data-st="s2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="sym cp3-sym"><div><div id="cp3-tree"></div>' +
      '<p class="tiny muted cp3-tlab">C = has the condition, C′ = doesn’t; + = tests positive, − = tests negative.</p></div>' +
      '<div><div class="q-actions"><button type="button" class="btn primary sm" id="cp3-flip" aria-pressed="false">Flip the tree</button></div><dl class="read" id="cp3-r2" aria-live="polite"></dl>' +
      '<details class="alg"><summary>Check it with data</summary><div class="alg-lines" id="cp3-data"></div></details></div></div></div>' +
    // station 3
    '<div class="cp3-s" data-st="s3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div class="sym cp3-sym"><div>' +
      '<label class="slider cp3-sl"><span class="slider-top"><span>Base rate (how common the condition is)</span><output id="cp3-bo"></output></span><input type="range" id="cp3-base" min="1" max="50" step="1" aria-label="Base rate in percent"></label>' +
      '<canvas class="plot" id="cp3-curve" role="img" aria-label="Graph of P(condition | positive) against the base rate"></canvas><p class="tiny muted cp3-axes">Across: the base rate (%). Up: ' + Pw("condition | positive") + ".</p></div>" +
      '<div><dl class="read" id="cp3-r3" aria-live="polite"></dl><div class="cp3-qa"><p><strong>' + s3.question + '</strong></p><button type="button" class="btn ghost sm" id="cp3-show" aria-expanded="false">Show an explanation</button><div id="cp3-ans" hidden><p>' + s3.reply + "</p></div></div></div></div></div>";
  radios($("#cp3-st", host), { label:"Station", options:ST.map(function(s){ return { id:s.id, t:s.chip }; }), value:S.st, cls:"chips", onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ $$(".cp3-s", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); MV.redrawAll(); if (S.st === "s2") ft.render(); }

  // --- station 1: the dot grid ---
  var step = 0, who = false;
  var dots = new MV.Plot($("#cp3-dots", host), { xmin:0, xmax:1, ymin:0, ymax:1 });
  function small(){ return mqHas("(max-width:560px)"); }
  dots.render = function(){
    var sm = small(), per = sm ? 10 : 1, Cn = sm ? 40 : 100, Rn = sm ? 25 : 100, bw = sm ? 5 : 20, bh = sm ? 4 : 10, tp = 180 / per, fp = 490 / per;
    $("#cp3-each", host).textContent = "Each dot is " + (per === 1 ? "1 person" : per + " people") + ".";
    var desc = "Grid of 10 000 people, " + (per === 1 ? "one dot per person" : "each dot 10 people") + ".";
    if (step >= 1) desc += " 200 have the condition: magenta crosses in the outlined top-left block.";
    if (step >= 2) desc += " 180 of them tested positive (yellow).";
    if (step >= 3) desc += " 9800 don’t have it: grey dots.";
    if (step >= 4) desc += " 490 of them tested positive anyway (a yellow block beside the first).";
    if (who) desc += " Everyone else fades: 670 tested positive, and 180 of them have the condition.";
    dots.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, describe:desc, after:function(ctx, P){
      var W = P.W, H = P.H, pad = 8, pitch = Math.min((W - 2 * pad) / Cn, (H - 2 * pad) / Rn), x0 = (W - pitch * Cn) / 2, y0 = (H - pitch * Rn) / 2;
      var mag = css("--p-c"), yel = css("--hi"), grey = css("--ink-2"), s = Math.max(1, pitch * 0.42), arm = Math.max(1.6, pitch * 0.4), th = Math.max(1, pitch * 0.16);
      var fade = parseFloat(css("--cp-fade")) || 0.2;
      for (var j = 0; j < Rn; j++) for (var i = 0; i < Cn; i++) {
        var cond = j < bh && i < bw, k, pos = false;
        if (cond) { k = j * bw + i; pos = k < tp; } else if (j < bh) { k = (i - bw) * bh + j; pos = k < fp; }
        var shown = cond ? step >= 1 : step >= 3, posShown = cond ? step >= 2 : step >= 4;
        if (!shown) continue;
        var cx = x0 + (i + 0.5) * pitch, cy = y0 + (j + 0.5) * pitch;
        ctx.globalAlpha = who && !(pos && posShown) ? fade : 1;
        if (pos && posShown) { ctx.fillStyle = yel; ctx.fillRect(cx - pitch / 2, cy - pitch / 2, pitch, pitch); }
        if (cond) { ctx.fillStyle = mag; ctx.fillRect(cx - arm, cy - th / 2, 2 * arm, th); ctx.fillRect(cx - th / 2, cy - arm, th, 2 * arm); }
        else { ctx.fillStyle = grey; ctx.globalAlpha *= 0.75; ctx.fillRect(cx - s / 2, cy - s / 2, s, s); }
      }
      ctx.globalAlpha = 1;
      if (step >= 1) { ctx.strokeStyle = mag; ctx.lineWidth = 2; ctx.strokeRect(x0 - 1, y0 - 1, bw * pitch + 2, bh * pitch + 2); }
    } });
  };
  function paint1(){
    $("#cp3-steps", host).innerHTML = step ? s1.steps.slice(0, step).map(function(t){ return "<li>" + t + "</li>"; }).join("") : '<li class="cp3-intro">Press <strong>Step</strong> (or Play) to sort the 10 000 people.</li>';
    var wb = $("#cp3-who", host); wb.disabled = step < 4; wb.setAttribute("aria-pressed", who);
    var rows = [["Have the condition", step >= 1 ? "200" : qm()], ["… and test positive", step >= 2 ? "180" : qm()], ["Don’t have it", step >= 3 ? "9800" : qm()], ["… and test positive anyway", step >= 4 ? "490" : qm()]];
    if (who) rows.push(["Tested positive in all", mm("180 + 490 = 670")]);
    $("#cp3-r1", host).innerHTML = MV.readoutHTML(rows);
    $("#cp3-ask", host).hidden = !who;
    dots.render();
  }
  MV.player($("#cp3-pl", host), { count:5, interval:1300, render:function(i){ step = i; if (step < 4) who = false; paint1(); }, label:function(i){ return i ? "Step " + i + " of 4" : "Ready"; } });
  $("#cp3-who", host).addEventListener("click", function(){ if (step < 4) return; who = !who; paint1(); });
  $("#cp3-in", host).value = S.ask;
  $("#cp3-in", host).addEventListener("input", function(e){ S.ask = e.target.value; api.save(); });
  $("#cp3-in", host).addEventListener("keydown", function(e){ if (e.key === "Enter") $("#cp3-chk", host).click(); });
  $("#cp3-chk", host).addEventListener("click", function(){
    var p = parseP(S.ask), fb = $("#cp3-fb", host), msg;
    if (!p) msg = MV.fbHTML("bad", "Enter a fraction such as 3/4 or a decimal such as 0.75.");
    else if (pMatch(p, "18/67")) msg = MV.fbHTML("good", "<strong>✓ Correct:</strong> " + s1.answerNote);
    else if (pMatch(p, "0.9")) msg = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> That’s " + Pw("positive | condition") + ", the reverse. Given a positive result, divide by all 670 positives.");
    else if (pMatch(p, "180/10000") || pMatch(p, "670/10000")) msg = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> That divides by all 10 000 people. Given a positive result, only the 670 positives count.");
    else if (pMatch(p, "49/67")) msg = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> That’s the share of positives <em>without</em> the condition. How many of the 670 have it?");
    else msg = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Given a positive result, only the 670 positives count. How many of them have the condition?");
    fb.innerHTML = msg; MV.focusFb(fb);
  });

  // --- station 2: the tree and its flip ---
  var MED = { "C,+":F.of(18, 1000), "C,−":F.of(2, 1000), "C′,+":F.of(49, 1000), "C′,−":F.of(931, 1000) };
  function fmt3(f){ var v = val(f); if (F.exactDec(f, 3)) return F.dec(f, 3); return "≈ " + (v < 0.05 || v > 0.95 ? F.dec(f, 3) : F.dec(f, 2)); }
  var LAB = { "C":"<i>C</i>", "C′":"<i>C</i>′", "+":"+", "−":"−" };
  var ft = flipTree($("#cp3-tree", host), { ids1:["C", "C′"], ids2:["+", "−"], names:["Condition", "Test"], label:"Tree diagram of the screening model",
    joint:function(x, y){ return MED[x + "," + y]; }, lab:function(id){ return '<span class="cp3-tl">' + LAB[id] + "</span>"; }, fmt:fmt3,
    narrow:function(){ return ($("#cp3-tree", host).clientWidth || 600) < 420; } });
  ft.mark(S.flip ? ["C,+"] : []); if (S.flip) ft.flip(true); else ft.render();
  function paint2(){
    var b = $("#cp3-flip", host); b.setAttribute("aria-pressed", S.flip); b.textContent = S.flip ? "Unflip the tree" : "Flip the tree";
    var rows = [[Pw("condition and positive"), mm("0.02 × 0.9 = 0.018")], [Pw("no condition and positive"), mm("0.98 × 0.05 = 0.049")]];
    if (S.flip) { rows.push([Pw("positive"), mm("0.018 + 0.049 = 0.067")]); rows.push([Pw("condition | positive"), mm("0.018 ÷ 0.067 ≈ 0.27")]); }
    else rows.push([Pw("condition | positive"), muted("Flip the tree to put the test result first.")]);
    $("#cp3-r2", host).innerHTML = MV.readoutHTML(rows);
  }
  $("#cp3-data", host).innerHTML = ["Condition and positive: 180 of 10 000 people, " + mm("180/10 000 = 0.018"), "No condition, positive: " + mm("490/10 000 = 0.049"),
    "Positive: " + mm("670/10 000 = 0.067"), Pw("condition | positive") + ": " + mm("180/670 ≈ 0.27") + ", the same as " + mm("0.018 ÷ 0.067")].map(function(l){ return "<span>" + l + "</span>"; }).join("");
  $("#cp3-flip", host).addEventListener("click", function(){ S.flip = !S.flip; api.save(); ft.mark(S.flip ? ["C,+"] : []); ft.flip(S.flip); paint2(); });

  // --- station 3: the base rate ---
  var curve = new MV.Plot($("#cp3-curve", host), { xmin:-5, xmax:53, ymin:-0.08, ymax:1.06 });
  function ppv(p){ return 0.9 * p / (0.9 * p + 0.05 * (1 - p)); }
  curve.render = function(){
    var p = S.base / 100, y = ppv(p);
    curve.draw({ view:{ xmin:-5, xmax:53, ymin:-0.08, ymax:1.06 }, xTicks:{ step:10 }, yTicks:{ step:0.2 },
      curves:[{ f:function(x){ return x <= 0 ? 0 : ppv(x / 100); }, domain:[1, 50], color:css("--pen"), width:3 }],
      segments:[{ x1:S.base, y1:0, x2:S.base, y2:y, color:css("--ink-2"), width:1.5, dash:[5, 5] }],
      points:[{ x:S.base, y:y, r:6, color:css("--pen"), label:y.toFixed(2) }],
      describe:"Curve of P(condition | positive) against the base rate from 1% to 50%, rising steeply at first. At " + S.base + "% it is about " + y.toFixed(2) + "." });
  };
  function paint3(){
    var b = S.base, tp = 90 * b, fp = 500 - 5 * b, y = ppv(b / 100);
    $("#cp3-bo", host).textContent = b + "%"; var sl = $("#cp3-base", host); if (+sl.value !== b) sl.value = b;
    $("#cp3-r3", host).innerHTML = MV.readoutHTML([["Out of 10 000 people", N(100 * b) + " have the condition; " + N(10000 - 100 * b) + " don’t"],
      ["True positives", mm("0.9 × " + N(100 * b) + " = " + N(tp))], ["False positives", mm("0.05 × " + N(10000 - 100 * b) + " = " + N(fp))],
      [Pw("condition | positive"), mm(N(tp) + "/" + N(tp + fp) + " ≈ " + y.toFixed(2))]]);
    curve.render();
  }
  $("#cp3-base", host).addEventListener("input", function(e){ S.base = Math.round(+e.target.value); api.save(); paint3(); });
  $("#cp3-show", host).addEventListener("click", function(e){ var a = $("#cp3-ans", host), open = a.hidden; a.hidden = !open; e.target.setAttribute("aria-expanded", open); e.target.textContent = open ? "Hide the explanation" : "Show an explanation"; });

  paint1(); paint2(); paint3(); showSt();
  return {};
}

// ---------- number parsing for probabilities: fractions exact, decimals and percentages within 0.005 ----------
function parseP(raw){
  var s = String(raw == null ? "" : raw).trim().replace(/−/g, "-").replace(/\s+/g, "").replace(/^=/, "").replace(/^≈/, "");
  if (!s) return null;
  var f = F.parse(s); if (!f) return null;
  return { f:f, exact:/\//.test(s) };
}
function pMatch(p, target){
  var t = typeof target === "string" ? F.parse(target) : F.of(target); if (!p || !t) return false;
  return p.exact ? F.eq(p.f, t) : Math.abs(val(p.f) - val(t)) <= 0.005 + 1e-12;
}

// @component N4 probEntry — number entry for probabilities (N4; adapted from the toolkit's numeric activity and MDM4U 02's
// countEntry): a typed fraction must be exactly equivalent (shown reduced), a decimal or percentage counts within 0.005; several
// boxes per item (parts) and Yes/No choice parts; named wrong answers per box ({part, match, fb}); first-try scoring (right on
// the first check and the worked solution not shown).
// a: {id, title, summary, prefix ("C" → C1, C2 …), how, data (html above the items), items:[{id, goal, prompt, star,
//   answer:"3/5" | ["0.6", "0.62", "No"], parts:[{label, choice:["Yes", "No"]}], display, why, general,
//   wrong:[{part, match, fb}], hints:[3]}]}  ->  {stats(), missed()}
function probEntry(host, api, a){
  var st = api.S; st.items = st.items || {};
  var msgs = {};
  function ist(id){ var x = st.items[id] || (st.items[id] = { vals:[], tries:0, hint:0, solved:false, first:null }); x.vals = x.vals || []; return x; }
  function partsOf(it){ return it.parts || [{ label:"Your answer:" }]; }
  function ansOf(it){ var v = MV.ans(it); return Array.isArray(v) ? v : [v]; }
  function judge(it, x){
    var parts = partsOf(it), ans = ansOf(it), res = [], named = null, bad = false;
    parts.forEach(function(pt, i){
      var raw = x.vals[i];
      if (pt.choice) { res.push(raw === ans[i]); if (raw !== ans[i]) (it.wrong || []).forEach(function(w){ if (!named && (w.part || 0) === i && w.match === raw) named = w.fb; }); if (raw == null || raw === "") bad = true; return; }
      var p = parseP(raw); if (!p) { bad = true; res.push(false); return; }
      var ok = pMatch(p, ans[i]); res.push(ok);
      if (!ok) (it.wrong || []).forEach(function(w){ if (!named && (w.part || 0) === i && pMatch(p, w.match)) named = w.fb; });
    });
    return { ok:res.every(Boolean), res:res, named:named, bad:bad && !res.some(function(r, i){ return !r && x.vals[i] != null && x.vals[i] !== ""; }) };
  }
  function disp(it){ if (it.display) return it.display; var v = ansOf(it); return v.map(function(s){ var f = F.parse(s); return f ? F.txt(f) : s; }).join("; "); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = (a.how === "" ? "" : '<p class="how">' + (a.how || "Type your answer, then press Check.") + "</p>") + (a.data ? '<div class="cp-data">' + a.data + "</div>" : "") + a.items.map(function(it, i){
        var x = ist(it.id), parts = partsOf(it);
        var h = '<div class="q" data-pe="' + it.id + '"><div class="q-head"><span class="qn cp-qn" aria-hidden="true">' + (a.prefix || "") + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        parts.forEach(function(pt, pi){
          var v = x.vals[pi] == null ? "" : x.vals[pi], mk = x.marks && x.marks[pi] != null && !x.solved ? (x.marks[pi] ? " cp-okp" : " cp-badp") : "";
          if (pt.choice) h += '<div class="numrow cp-prow' + mk + '"><span class="cp-plab" id="pl-' + it.id + pi + '">' + pt.label + '</span><span class="rg chips" role="group" aria-labelledby="pl-' + it.id + pi + '">' + pt.choice.map(function(c){
            return '<button type="button" data-pc="' + pi + '" data-cv="' + MV.esc(c) + '" data-k="' + it.id + pi + c + '" aria-pressed="' + (v === c) + '"' + (x.solved ? " disabled" : "") + ">" + c + "</button>"; }).join("") + "</span></div>";
          else h += '<div class="numrow cp-prow' + mk + '"><label for="pe-' + it.id + pi + '">' + pt.label + '</label><input class="numin short" id="pe-' + it.id + pi + '" data-pin="' + pi + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + "></div>";
        });
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + disp(it) + ".</strong> " + (it.why || "") + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  function itemOf(el){ var box = el.closest("[data-pe]"); return box ? a.items.filter(function(x){ return x.id === box.dataset.pe; })[0] : null; }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || t.dataset.pin == null) return; var it = itemOf(t); if (!it) return; ist(it.id).vals[+t.dataset.pin] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key !== "Enter" || !e.target.dataset || e.target.dataset.pin == null) return; var it = itemOf(e.target); var b = it && host.querySelector('[data-k="' + it.id + 'chk"]'); if (b) b.click(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = itemOf(b); if (!it) return;
    var x = ist(it.id);
    if (b.dataset.pc != null) { x.vals[+b.dataset.pc] = b.dataset.cv; api.save(); paint(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x), box = host.querySelector('[data-pe="' + it.id + '"]');
      if (r.bad) { msgs[it.id] = "Enter " + (partsOf(it).length > 1 ? "every box" : "a probability") + ": a fraction such as 3/5 or a decimal such as 0.6" + (partsOf(it).some(function(p){ return p.choice; }) ? ", and choose Yes or No" : "") + "."; x.marks = null; paint(); MV.focusFb(host.querySelector('[data-pe="' + it.id + '"]')); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; x.marks = null; }
      else {
        x.tries++; x.marks = partsOf(it).length > 1 ? r.res : null;
        var part = partsOf(it).length > 1 ? " " + r.res.map(function(ok, i){ return ok ? "" : "Check box " + (i + 1) + "."; }).filter(Boolean).join(" ") : "";
        msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.named || it.general || "Check which group the condition restricts to, then try again.") + (r.named ? "" : part) + " Try again.";
      }
      api.save(); paint(); box = host.querySelector('[data-pe="' + it.id + '"]'); MV.focusFb(box);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; });
      return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Two-way table designer ----------
var task = (function(){
  var api = null, MORE0 = null, K = ["a", "b", "c", "d"];
  function whole(s){ s = String(s == null ? "" : s).trim(); return /^\d{1,2}$/.test(s) && +s <= 40 ? +s : null; }
  function read(){ var s = api ? api.S : {}, d = {}; K.forEach(function(k){ d[k] = whole(s[k]); d[k + "Raw"] = s[k] == null ? "" : String(s[k]); }); return d; }
  function full(d){ return K.every(function(k){ return d[k] != null; }); }
  function checks(d){
    if (!full(d)) return [false, false, false, false];
    var a = d.a, b = d.b, c = d.c, dd = d.d;
    return [a + b + c + dd === 40, a + c > 0 && 2 * a === a + c, a + b > 0 && 3 * a === a + b, dd >= 20];
  }
  function cpT(n, dn){ return F.prob(n, dn, { dec:false }); }
  function paint(){
    var d = read(), t = function(v){ return v == null ? "?" : String(v); }, sum = function(x, y){ return x == null || y == null ? "?" : String(x + y); };
    $("#tk-sr").textContent = sum(d.a, d.b); $("#tk-nsr").textContent = sum(d.c, d.d);
    $("#tk-fc").textContent = sum(d.a, d.c); $("#tk-nfc").textContent = sum(d.b, d.d);
    $("#tk-all").textContent = full(d) ? String(d.a + d.b + d.c + d.d) : "?";
    var rows = [];
    if (d.a != null && d.c != null) rows.push([mm("P(S | F)"), d.a + d.c ? mm("= a ÷ (a + c) = " + cpT(d.a, d.a + d.c)) : muted("undefined: no one is in ") + mm("F")]);
    else rows.push([mm("P(S | F)"), muted("Fill in ") + mm("a") + muted(" and ") + mm("c") + "."]);
    if (d.a != null && d.b != null) rows.push([mm("P(F | S)"), d.a + d.b ? mm("= a ÷ (a + b) = " + cpT(d.a, d.a + d.b)) : muted("undefined: no one is in ") + mm("S")]);
    else rows.push([mm("P(F | S)"), muted("Fill in ") + mm("a") + muted(" and ") + mm("b") + "."]);
    rows.push(["Neither, " + mm("d"), d.d == null ? "?" : d.d + (full(d) ? " of " + (d.a + d.b + d.c + d.d) : "")]);
    $("#tk-read").innerHTML = MV.readoutHTML(rows);
    K.forEach(function(k){ var el = $('[data-tk="' + k + '"]'); el.classList.toggle("cp-bad", d[k + "Raw"].trim() !== "" && d[k] == null); });
  }
  return {
    render:function(inp, pvh, a){
      api = a;
      var cell = function(k, lab){ return '<td><input class="numin cp-tkin" data-tk="' + k + '" type="text" inputmode="numeric" autocomplete="off" aria-label="' + lab + '" value="' + MV.esc(a.S[k] == null ? "" : a.S[k]) + '"></td>'; };
      inp.innerHTML = '<p class="tiny muted cp-tkh">Type whole numbers from 0 to 40 in the four white cells. The totals fill in by themselves.</p><div class="tbl-wrap"><table class="cp-tw cp-tk"><caption class="vh">Two-way table: sport (S) by French (F)</caption>' +
        '<thead><tr><td class="cp-corner"></td><th scope="col">' + mm("F") + ' <span class="tiny">French</span></th><th scope="col">' + mm("F′") + ' <span class="tiny">not French</span></th><th scope="col">Total</th></tr></thead><tbody>' +
        '<tr><th scope="row">' + mm("S") + ' <span class="tiny">sport</span></th>' + cell("a", "a: S and F") + cell("b", "b: S only") + '<td id="tk-sr" class="cp-tot"></td></tr>' +
        '<tr><th scope="row">' + mm("S′") + ' <span class="tiny">no sport</span></th>' + cell("c", "c: F only") + cell("d", "d: neither") + '<td id="tk-nsr" class="cp-tot"></td></tr>' +
        '<tr class="cp-totr"><th scope="row">Total</th><td id="tk-fc"></td><td id="tk-nfc"></td><td id="tk-all"></td></tr></tbody></table></div>' +
        '<p class="tiny muted cp-tkkey">' + mm("a") + " = " + mm("S") + " and " + mm("F") + "; " + mm("b") + " = " + mm("S") + " only; " + mm("c") + " = " + mm("F") + " only; " + mm("d") + " = neither.</p>";
      pvh.innerHTML = '<dl class="read tk-read" id="tk-read" aria-live="polite"></dl>';
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tk; if (!k) return; a.S[k] = e.target.value; a.save(); paint(); a.update(); });
      paint();
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Fill in all four cells with whole numbers from 0 to 40."; },
    checks:checks,
    tips:function(d, res){
      var T = MV.C.task.tips, out = [];
      if (full(d) && d.a + d.c === 0) out.push("No one is in " + mm("F") + ", so " + mm("P(S | F)") + " is undefined.");
      if (full(d) && d.a + d.b === 0) out.push("No one is in " + mm("S") + ", so " + mm("P(F | S)") + " is undefined.");
      res.forEach(function(ok, i){ if (!ok) out.push(T[i]); });
      return out;
    },
    key:function(d){
      var k = [d.a, d.b, d.c, d.d].join(","), st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0);
      if (MORE0 == null) MORE0 = MV.C.task.more || "There’s more than one answer. Can you find another?";
      MV.C.task.more = n >= 5 ? "You’ve found all five." : MORE0;
      return k;
    },
    label:function(k){ return "(" + k.split(",").join(", ") + ")"; },
    text:function(k){ var p = k.split(","); return "a = " + p[0] + ", b = " + p[1] + ", c = " + p[2] + ", d = " + p[3]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ tv:probEntry, tr:probEntry },
  task:task
});
})();
