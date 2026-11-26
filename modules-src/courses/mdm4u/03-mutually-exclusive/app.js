// MDM4U 03 Mutually Exclusive Events & the Additive Principle: hero (hearts and face cards fill two circles; J♥ Q♥ K♥ stack in
// the overlap ×2, then − 3), Overlap detector (Explore: D2 Venn with tiles 1–30, a 4 × 13 deck grid and survey counts),
// "Counting “or” problems" stations (Part 3: same-group pairs, starts-or-ends with a listing check, hundred chart), task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.mdm.frac, MI = "−";
function lc(s){ return String(s).charAt(0).toLowerCase() + String(s).slice(1); }
function N(v){ return MV.num(v, 0); }
function intOf(s){ s = String(s == null ? "" : s).trim().replace(/−/g, "-"); if (!s) return null; var v = Number(s); return Number.isInteger(v) ? v : NaN; }
function isNum(v){ return typeof v === "number" && !isNaN(v); }
function muted(h){ return '<span class="muted">' + h + "</span>"; }
function list(items, max){ var s = items.slice(0, max).map(function(x){ return x.t; }).join(", "); return items.length > max ? s + ", …" : s; }

// @component radioGroup (copied from MDM4U 02 / MHF4U 25; a value that matches no option leaves the first option tabbable)
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// @component D2 vennDiagram — Venn diagram (course plan D2), self-contained: 2 or 3 event circles (--ev-a/b/c) in a sample-space
// box; tap a region (or its button in the strip under the box; keyboard: Tab + Enter) to shade it in highlighter; counts or
// probabilities per region; live set notation for the shaded part (A ∪ B, A′ ∩ B, (A ∪ B)′ …, shortest form found by search);
// outcome tokens: buttons laid out inside their region, each announcing it ("10: in both A and B"). A crowded region shrinks its
// tokens to 24 px, then (fit:"grow") the box grows taller, or (fit:"values", or more than maxTok tokens) the region shows its
// value instead. Tokens move to their regions when the events change; fly() animates them from a pile ("hesitate" codes take a
// detour through A only and B only first); the 2-set overlap glows (CSS pulse; static with reduced motion).
// v = vennDiagram(host, {sets:2|3, letters:["A","B","C"], aria, shade:true, universe:"S", onShade(codes), onToken(id, code),
//       stripNote(code) -> html, noteExtra(codes) -> html})
// v.set({names:[html], tokens:{code:[{id, t:html, aria}]}, order:[ids], values:{code:html}, fit:"grow"|"values", maxTok, glow,
//       shade:[codes]}, {at:"pile" | instant:true | fly:{…}})
// v.fly({from:"keep"|"pile", hesitate:[codes], dur, done}) · v.glow(bool) · v.shade(codes) · v.shaded() · v.notation(codes)
// v.regionText(code) -> "in both A and B" · v.codes · v.relayout()
var VD_UID = 0, VD_TBL = {};
function vdCodes(n){ return n === 3 ? ["a", "b", "c", "ab", "ac", "bc", "abc", "o"] : ["a", "ab", "b", "o"]; }
function vdNotation(n, L){
  var id = n + L.join(""); if (VD_TBL[id]) return VD_TBL[id];
  var R = vdCodes(n), full = (1 << R.length) - 1, best = {};
  function okey(s){ for (var i = 0; i < s.length; i++) { var k = L.indexOf(s[i]); if (k >= 0) return k * 2 + (s[i + 1] === "′" ? 1 : 0); } return 9; }
  function terms(X, op){ return X.op === op ? X.t : [X.op ? "(" + X.s + ")" : X.s]; }
  function join(X, Y, op){ var t = terms(X, op).concat(terms(Y, op)).sort(function(p, q){ return okey(p) - okey(q) || p.length - q.length; }); return { s:t.join(" " + op + " "), t:t }; }
  function add(m, s, cost, op, t){ var b = best[m]; if (!b || cost < b.cost || (cost === b.cost && s.length < b.s.length)) best[m] = { s:s, cost:cost, op:op, t:t }; }
  add(full, "S", 1, ""); add(0, "∅", 1, "");
  L.slice(0, n).forEach(function(letter, j){
    var m = 0; R.forEach(function(c, i){ if (c.indexOf("abc"[j]) >= 0) m |= 1 << i; });
    add(m, letter, 1, ""); add(full ^ m, letter + "′", 2, "");
  });
  for (var round = 0; round < 3; round++) {
    var keys = Object.keys(best).map(Number);
    for (var x = 0; x < keys.length; x++) for (var y = x + 1; y < keys.length; y++) {
      var X = best[keys[x]], Y = best[keys[y]], cost = X.cost + Y.cost + 1;
      if (cost > 11) continue;
      var U = join(X, Y, "∪"), I = join(X, Y, "∩");
      add(keys[x] | keys[y], U.s, cost, "∪", U.t);
      add(keys[x] & keys[y], I.s, cost, "∩", I.t);
    }
    Object.keys(best).forEach(function(k){ var B = best[k]; if (B.op) add(full ^ Number(k), "(" + B.s + ")′", B.cost + 1, ""); });
  }
  return (VD_TBL[id] = { R:R, best:best });
}
function vennDiagram(host, o){
  o = o || {};
  var n = o.sets === 3 ? 3 : 2, L = (o.letters || ["A", "B", "C"]).slice(0, n), codes = vdCodes(n), uid = "vd" + (++VD_UID), AB = "abc";
  var st = { names:[], tokens:{}, values:{}, order:null, fit:"grow", glow:false, maxTok:Infinity }, shade = {}, pos = {}, tokEl = {}, cur = null, lastW = 0, stopFly = null;
  host.innerHTML = '<div class="vd' + (n === 3 ? " vd3" : "") + '"><p class="vd-names" aria-hidden="true"></p><div class="vd-box"><svg class="vd-svg" focusable="false" aria-hidden="true"></svg><div class="vd-vals" aria-hidden="true"></div>' +
    '<div class="vd-toks" role="group" aria-label="' + MV.esc(o.aria || "Outcomes in the Venn diagram") + '"></div></div>' +
    (o.shade === false ? "" : '<div class="vd-strip" role="group" aria-label="Shade a region"></div><p class="vd-note" aria-live="polite"></p>') + "</div>";
  var root = host.firstChild, box = $(".vd-box", root), svg = $(".vd-svg", root), vals = $(".vd-vals", root), toks = $(".vd-toks", root), strip = $(".vd-strip", root), note = $(".vd-note", root), namesEl = $(".vd-names", root);
  function regionText(c){
    if (c === "o") return n === 2 ? "in neither " + L[0] + " nor " + L[1] : "in none of " + L[0] + ", " + L[1] + " and " + L[2];
    var ls = c.split("").map(function(ch){ return L[AB.indexOf(ch)]; });
    if (ls.length === 1) return "in " + ls[0] + " only";
    if (ls.length === 2) return n === 2 ? "in both " + ls[0] + " and " + ls[1] : "in " + ls[0] + " and " + ls[1] + " only";
    return "in " + ls[0] + ", " + ls[1] + " and " + ls[2];
  }
  function stripLabel(c){
    if (c === "o") return n === 2 ? "Neither" : "None";
    var ls = c.split("").map(function(ch){ return L[AB.indexOf(ch)]; });
    if (ls.length === 1) return ls[0] + " only";
    if (ls.length === 2) return n === 2 ? "Both" : ls[0] + " and " + ls[1] + " only";
    return "All three";
  }
  function small(W){ return W < 480; }
  function sizes(W){ return small(W) ? [28, 26, 24] : [30, 27, 24]; }
  function baseH(W){ return Math.max(200, Math.round(n === 2 ? (small(W) ? 0.92 * W : 0.6 * W) : (small(W) ? 1.05 * W : 0.82 * W))); }
  function geom(W, H, dF){
    var g = { W:W, H:H, pad:4, c:[], lab:[], res:[] }, r;
    if (n === 2) { var wl = small(W) ? (W - 12) / (2 + dF) : 0.262 * W * 2.98 / (2 + dF); r = Math.min(wl, (small(W) ? 0.42 : 0.4) * H); g.wLim = r >= wl; var d = dF * r, cy = H * 0.54; g.c = [{ x:W / 2 - d / 2, y:cy, r:r }, { x:W / 2 + d / 2, y:cy, r:r }]; }
    else { var wl3 = (small(W) ? 0.29 : 0.245) * W; r = Math.min(wl3, (small(W) ? 0.255 : 0.25) * H); g.wLim = r >= wl3; var cy3 = H * 0.47; g.c = [{ x:W / 2 - 0.6 * r, y:cy3 - 0.36 * r, r:r }, { x:W / 2 + 0.6 * r, y:cy3 - 0.36 * r, r:r }, { x:W / 2, y:cy3 + 0.68 * r, r:r }]; }
    var ang = n === 2 ? [-130, -50] : [-140, -40, 90];
    g.c.forEach(function(c, i){ var a = ang[i] * Math.PI / 180, x = c.x + Math.cos(a) * (c.r + 13), y = c.y + Math.sin(a) * (c.r + 13); g.lab.push({ x:x, y:y }); g.res.push({ x:x, y:y, w:22, h:22 }); });
    g.res.push({ x:g.pad + 14, y:g.pad + 14, w:20, h:20 });
    g.vo = { x:W - g.pad - 28, y:H - g.pad - 18 };
    return g;
  }
  function regionAt(g, x, y, m){
    var code = "";
    for (var i = 0; i < n; i++) { var c = g.c[i], d = Math.sqrt((x - c.x) * (x - c.x) + (y - c.y) * (y - c.y)); if (d <= c.r - m) code += AB[i]; else if (d < c.r + m) return null; }
    return code || "o";
  }
  function reserved(g, x, y, T){ return g.res.some(function(r){ return Math.abs(x - r.x) < r.w / 2 + T / 2 && Math.abs(y - r.y) < r.h / 2 + T / 2; }); }
  function grid(g, T){
    var gap = small(g.W) ? 3 : 4, s = T + gap, dy = Math.max(T + 1, s * 0.92), lo = g.pad + 2 + T / 2, pts = {}, row = 0;
    codes.forEach(function(c){ pts[c] = []; });
    for (var y = lo; y <= g.H - lo + 0.01; y += dy, row++)
      for (var x = lo + (row % 2 ? s / 2 : 0); x <= g.W - lo + 0.01; x += s) {
        var c = regionAt(g, x, y, T * 0.66); if (!c || reserved(g, x, y, T)) continue;
        pts[c].push({ x:x, y:y });
      }
    return pts;
  }
  function anchors(g){
    var pts = grid(g, 12), an = {};
    codes.forEach(function(c){ var p = pts[c]; if (!p.length) return; var sx = 0, sy = 0; p.forEach(function(q){ sx += q.x; sy += q.y; }); an[c] = { x:sx / p.length, y:sy / p.length }; });
    an.o = { x:g.W / 2, y:0 };
    return an;
  }
  function dist(p, q){ return (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y); }
  function layout(W){
    var H = baseH(W), dF = small(W) ? 0.95 : 0.98, tries = 0, plan;
    for (;;) {
      var g = geom(W, H, dF), grids = {}, bad = [], an = anchors(g);
      plan = { g:g, place:{}, show:{}, anchor:an };
      sizes(W).forEach(function(T){ grids[T] = grid(g, T); });
      codes.forEach(function(c){
        var lst = st.tokens[c] || [], k = lst.length, T = null;
        if (!k || k > st.maxTok) { plan.show[c] = false; return; }
        sizes(W).forEach(function(t){ if (T == null && grids[t][c].length >= k) T = t; });
        if (T == null) { bad.push(c); plan.show[c] = false; return; }
        plan.show[c] = true;
        var ref = c === "o" ? an.o : (an[c] || an.o), pts = grids[T][c].slice().sort(function(p, q){ return dist(p, ref) - dist(q, ref); }).slice(0, k);
        pts.sort(function(p, q){ return Math.abs(p.y - q.y) > 2 ? p.y - q.y : p.x - q.x; });
        lst.forEach(function(t, i){ plan.place[t.id] = { x:pts[i].x, y:pts[i].y, T:T, code:c }; });
      });
      if (!bad.length || st.fit === "values" || tries >= 8) break;
      // a crowded overlap pulls the circles together; crowded crescents push them apart; a crowded outside grows the box
      if (n === 2 && bad.indexOf("ab") >= 0 && dF > 0.5) dF = Math.max(0.5, dF * 0.85);
      else if (n === 2 && bad.indexOf("ab") < 0 && (bad.indexOf("a") >= 0 || bad.indexOf("b") >= 0) && dF < 1.2) dF = Math.min(1.2, dF * 1.08);
      else if (bad.indexOf("o") >= 0 || !g.wLim) H = Math.round(H * 1.14);
      else break;
      tries++;
    }
    return plan;
  }
  function f1(v){ return Math.round(v * 10) / 10; }
  function circ(c, extra){ return '<circle cx="' + f1(c.x) + '" cy="' + f1(c.y) + '" r="' + f1(c.r) + '"' + (extra || "") + "/>"; }
  function drawSvg(){
    var g = cur.g, W = g.W, H = g.H, h = "<defs>";
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("width", W); svg.setAttribute("height", H);
    g.c.forEach(function(c, i){ h += '<clipPath id="' + uid + "c" + i + '">' + circ(c) + "</clipPath>"; });
    codes.forEach(function(code){
      var outs = []; for (var i = 0; i < n; i++) if (code.indexOf(AB[i]) < 0) outs.push(g.c[i]);
      if (outs.length) h += '<mask id="' + uid + "m" + code + '" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="white"/>' + outs.map(function(c){ return circ(c, ' fill="black"'); }).join("") + "</mask>";
    });
    h += '<pattern id="' + uid + 'h" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="2" y1="0" x2="2" y2="9" class="vd-hl"/></pattern></defs>';
    h += '<rect class="vd-u" x="' + g.pad + '" y="' + g.pad + '" width="' + (W - 2 * g.pad) + '" height="' + (H - 2 * g.pad) + '" rx="10"/>';
    g.c.forEach(function(c, i){ h += circ(c, ' class="vd-f vd-' + AB[i] + '"'); });
    codes.forEach(function(code){
      var m = code === "o" || code.length < n ? ' mask="url(#' + uid + "m" + code + ')"' : "";
      var inner = '<rect x="0" y="0" width="' + W + '" height="' + H + '" class="vd-sh"' + m + '/><rect x="0" y="0" width="' + W + '" height="' + H + '" fill="url(#' + uid + 'h)"' + m + "/>";
      if (code !== "o") code.split("").forEach(function(ch){ inner = '<g clip-path="url(#' + uid + "c" + AB.indexOf(ch) + ')">' + inner + "</g>"; });
      h += '<g class="vd-reg' + (shade[code] ? " on" : "") + '" data-r="' + code + '">' + inner + "</g>";
    });
    if (n === 2) {
      var c0 = g.c[0], c1 = g.c[1], dd = (c1.x - c0.x) / 2, hh = Math.sqrt(Math.max(0, c0.r * c0.r - dd * dd)), mx = (c0.x + c1.x) / 2;
      h += '<path class="vd-glow" d="M' + f1(mx) + " " + f1(c0.y - hh) + "A" + f1(c0.r) + " " + f1(c0.r) + " 0 0 1 " + f1(mx) + " " + f1(c0.y + hh) + "A" + f1(c1.r) + " " + f1(c1.r) + " 0 0 1 " + f1(mx) + " " + f1(c0.y - hh) + 'Z"/>';
    }
    g.c.forEach(function(c, i){ h += circ(c, ' class="vd-o vd-' + AB[i] + '"'); });
    g.lab.forEach(function(p, i){ h += '<text class="vd-l vd-' + AB[i] + '" x="' + f1(p.x) + '" y="' + f1(p.y) + '" text-anchor="middle" dominant-baseline="central">' + L[i] + "</text>"; });
    h += '<text class="vd-s" x="' + (g.pad + 14) + '" y="' + (g.pad + 14) + '" text-anchor="middle" dominant-baseline="central">' + (o.universe || "S") + "</text>";
    svg.innerHTML = h;
  }
  function drawVals(){
    vals.innerHTML = codes.map(function(c){
      var v = st.values[c]; if (v == null || v === "" || cur.show[c]) return "";
      var p = c === "o" ? cur.g.vo : cur.anchor[c]; if (!p) return "";
      return '<span class="vd-v" style="left:' + f1(p.x) + "px;top:" + f1(p.y) + 'px">' + v + "</span>";
    }).join("");
  }
  function codeOf(id){ var P = cur && cur.place[id]; if (P) return P.code; for (var i = 0; i < codes.length; i++) if ((st.tokens[codes[i]] || []).some(function(t){ return t.id === id; })) return codes[i]; return "o"; }
  function put(id, x, y){ var el = tokEl[id]; if (!el) return; pos[id] = { x:x, y:y }; var T = el._T || 24; el.style.transform = "translate(" + f1(x - T / 2) + "px," + f1(y - T / 2) + "px)"; }
  function centre(){ return cur ? { x:cur.g.W / 2, y:cur.g.H / 2 } : { x:0, y:0 }; }
  function syncTokens(){
    var want = {}, ord = [];
    codes.forEach(function(c){ (st.tokens[c] || []).forEach(function(t){ want[t.id] = { t:t, c:c }; ord.push(t.id); }); });
    if (st.order) ord = st.order.filter(function(id){ return want[id]; });
    Object.keys(tokEl).forEach(function(id){ if (!want[id]) { tokEl[id].remove(); delete tokEl[id]; delete pos[id]; } });
    ord.forEach(function(id){
      var w = want[id], P = cur.place[id], el = tokEl[id];
      if (!el) { el = document.createElement("button"); el.type = "button"; el.className = "vd-t"; el.dataset.tok = id; toks.appendChild(el); tokEl[id] = el; pos[id] = null; }
      var T = P ? P.T : 24, len = MV.plain(w.t.t).length;
      el._T = T; el.style.width = T + "px"; el.style.height = T + "px"; el.style.fontSize = f1(T * (len >= 3 ? 0.36 : 0.46)) + "px";
      if (el.innerHTML !== w.t.t) el.innerHTML = w.t.t;
      el.setAttribute("aria-label", MV.plain(w.t.aria || w.t.t) + ": " + regionText(w.c));
      el.hidden = !P; el.classList.toggle("lit", !!shade[w.c]);
      if (!pos[id]) { var c0 = centre(); put(id, c0.x, c0.y); }
    });
  }
  function paintStrip(){
    if (!strip) return;
    MV.keepFocus(strip, function(){
      strip.innerHTML = codes.map(function(c){
        var sw = c === "o" ? '<i class="mdm-sw vd-sw0"></i>' : c.split("").map(function(ch){ return '<i class="mdm-sw" style="background:var(--ev-' + ch + ')"></i>'; }).join("");
        return '<button type="button" class="vd-rb" data-reg="' + c + '" data-k="' + uid + "r" + c + '" aria-pressed="' + !!shade[c] + '"><span class="vd-sws" aria-hidden="true">' + sw + "</span><span>" + stripLabel(c) + "</span>" + (o.stripNote ? '<span class="vd-rn">' + o.stripNote(c) + "</span>" : "") + "</button>";
      }).join("");
    });
  }
  function shaded(){ return codes.filter(function(c){ return shade[c]; }); }
  function notation(cs){
    var T = vdNotation(n, L), m = 0; cs.forEach(function(c){ var i = T.R.indexOf(c); if (i >= 0) m |= 1 << i; });
    return T.best[m] ? T.best[m].s : cs.map(stripLabel).join(" + ");
  }
  function paintNote(){
    if (!note) return;
    var cs = shaded();
    note.innerHTML = cs.length ? "Shaded: " + MV.m(notation(cs)) + (o.noteExtra ? o.noteExtra(cs) : "") : muted("Tap a region, or one of the buttons above, to shade it.");
  }
  function paintShade(){
    $$(".vd-reg", svg).forEach(function(gEl){ gEl.classList.toggle("on", !!shade[gEl.getAttribute("data-r")]); });
    Object.keys(tokEl).forEach(function(id){ tokEl[id].classList.toggle("lit", !!shade[codeOf(id)]); });
    paintStrip(); paintNote();
  }
  function toggle(c){ shade[c] = !shade[c]; paintShade(); if (o.onShade) o.onShade(shaded()); }
  function pilePlaces(){
    var ids = Object.keys(cur.place).filter(function(id){ return tokEl[id] && !tokEl[id].hidden; }), k = ids.length, out = {}, Tm = 24;
    ids.forEach(function(id){ Tm = Math.max(Tm, cur.place[id].T); });
    var s = Tm + 3, cols = Math.max(1, Math.min(k, 10, Math.floor((cur.g.W - 24) / s))), rows = Math.ceil(k / cols), x0 = cur.g.W / 2 - (cols - 1) * s / 2, y0 = cur.g.H / 2 - (rows - 1) * s / 2;
    var ord = (st.order || ids).filter(function(id){ return ids.indexOf(id) >= 0; });
    ord.forEach(function(id, i){ out[id] = { x:x0 + (i % cols) * s, y:y0 + Math.floor(i / cols) * s }; });
    return out;
  }
  function sm(u){ return u * u * (3 - 2 * u); }
  function fly(f){
    f = f || {};
    if (stopFly) { stopFly(); stopFly = null; }
    if (!cur) { if (f.done) f.done(); return; }
    var ids = Object.keys(cur.place).filter(function(id){ return tokEl[id] && !tokEl[id].hidden; });
    var pile = f.from === "pile" ? pilePlaces() : null, from = {}, hes = {}, dur = f.dur || 800;
    (f.hesitate || []).forEach(function(c){ hes[c] = true; });
    ids.forEach(function(id){ from[id] = pile ? pile[id] : (pos[id] || centre()); });
    var an = cur.anchor, mid = an.ab || centre();
    function toward(p){ return p ? { x:mid.x + (p.x - mid.x) * 0.6, y:mid.y + (p.y - mid.y) * 0.6 } : mid; }
    var pA = toward(an.a), pB = toward(an.b), extra = f.hesitate && n === 2 ? 1100 : 0, stag = Math.min(30, 600 / Math.max(1, ids.length)), total = dur + stag * ids.length + extra;
    stopFly = MV.tween({ dur:total, ease:function(x){ return x; }, step:function(t){
      var ms = t * total;
      ids.forEach(function(id, i){
        var P = cur.place[id], A0 = from[id], h = extra && hes[P.code], u = t >= 1 ? 1 : Math.max(0, Math.min(1, (ms - i * stag) / (dur + (h ? extra : 0)))), x, y;
        if (h) { var path = [A0, pA, pB, P], sg = u * 3, k = Math.min(2, Math.floor(sg)), v = sm(Math.min(1, sg - k)); x = path[k].x + (path[k + 1].x - path[k].x) * v; y = path[k].y + (path[k + 1].y - path[k].y) * v; }
        else { var e = sm(u); x = A0.x + (P.x - A0.x) * e; y = A0.y + (P.y - A0.y) * e; }
        put(id, x, y);
      });
    }, done:function(){ stopFly = null; ids.forEach(function(id){ var P = cur.place[id]; put(id, P.x, P.y); }); if (f.done) f.done(); } });
  }
  function glow(b){ root.classList.toggle("glow", !!b); }
  function relayout(opt){
    opt = opt || {};
    var W = box.clientWidth;
    namesEl.innerHTML = st.names.map(function(nm, i){ return '<span class="vd-nm"><b class="ev-' + AB[i] + '">' + L[i] + "</b> " + nm + "</span>"; }).join("");
    if (W < 60) { if (opt.fly && opt.fly.done) opt.fly.done(); return; }
    lastW = W; cur = layout(W);
    box.style.height = cur.g.H + "px";
    drawSvg(); drawVals(); syncTokens(); paintStrip(); paintNote(); glow(st.glow);
    if (stopFly) { stopFly(); stopFly = null; }
    if (opt.at === "pile") { var pl = pilePlaces(); Object.keys(pl).forEach(function(id){ put(id, pl[id].x, pl[id].y); }); }
    else if (opt.fly) fly(opt.fly);
    else if (opt.instant || MV.reduceMotion) Object.keys(cur.place).forEach(function(id){ put(id, cur.place[id].x, cur.place[id].y); });
    else fly({ dur:450 });
  }
  function set(s, opt){
    s = s || {};
    ["names", "tokens", "values", "order", "fit", "glow", "maxTok"].forEach(function(k){ if (s[k] !== undefined) st[k] = s[k]; });
    if (s.shade) { shade = {}; s.shade.forEach(function(c){ shade[c] = true; }); }
    relayout(opt);
  }
  root.addEventListener("click", function(e){
    var t = e.target.closest("[data-tok]"); if (t) { if (o.onToken) o.onToken(t.dataset.tok, codeOf(t.dataset.tok)); return; }
    var rb = e.target.closest("[data-reg]"); if (rb) { toggle(rb.dataset.reg); return; }
    if (o.shade === false || !cur || !e.target.closest(".vd-box")) return;
    var r = box.getBoundingClientRect(), c = regionAt(cur.g, e.clientX - r.left, e.clientY - r.top, 0);
    if (c) toggle(c);
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ var W = box.clientWidth; if (W >= 60 && Math.abs(W - lastW) > 1) relayout({ instant:true }); }).observe(root);
  return { set:set, fly:fly, glow:glow, shade:function(cs){ shade = {}; (cs || []).forEach(function(c){ shade[c] = true; }); if (cur) paintShade(); }, shaded:shaded, notation:notation,
    regionText:regionText, codes:codes, relayout:function(){ relayout({ instant:true }); }, el:root };
}

// ---------- sample spaces and events ----------
var PRIMES = { 2:1, 3:1, 5:1, 7:1, 11:1, 13:1, 17:1, 19:1, 23:1, 29:1 };
var TEV = [
  { id:"even", t:"Even", f:function(v){ return v % 2 === 0; } },
  { id:"odd", t:"Odd", f:function(v){ return v % 2 === 1; } },
  { id:"m3", t:"Multiple of 3", f:function(v){ return v % 3 === 0; } },
  { id:"m5", t:"Multiple of 5", f:function(v){ return v % 5 === 0; } },
  { id:"prime", t:"Prime", f:function(v){ return !!PRIMES[v]; } },
  { id:"sq", t:"Perfect square", f:function(v){ var r = Math.round(Math.sqrt(v)); return r * r === v; } },
  { id:"gt20", t:"Greater than 20", f:function(v){ return v > 20; } },
  { id:"lt8", t:"Less than 8", f:function(v){ return v < 8; } }
];
var SUITS = [{ id:"h", s:"♥", t:"hearts", red:true }, { id:"d", s:"♦", t:"diamonds", red:true }, { id:"c", s:"♣", t:"clubs" }, { id:"s", s:"♠", t:"spades" }];
var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"], RNAME = { A:"ace", J:"jack", Q:"queen", K:"king" };
var CARDS = [];
SUITS.forEach(function(s, si){ RANKS.forEach(function(r, ri){ CARDS.push({ id:"c" + r + s.id, t:r + s.s, r:r, ri:ri, s:s.id, si:si, red:!!s.red, name:(RNAME[r] || r) + " of " + s.t }); }); });
var DEV = [
  { id:"heart", t:"Heart", f:function(c){ return c.s === "h"; } },
  { id:"red", t:"Red", f:function(c){ return c.red; } },
  { id:"black", t:"Black", f:function(c){ return !c.red; } },
  { id:"face", t:"Face card", f:function(c){ return c.ri >= 10; } },
  { id:"ace", t:"Ace", f:function(c){ return c.r === "A"; } },
  { id:"king", t:"King", f:function(c){ return c.r === "K"; } },
  { id:"queen", t:"Queen", f:function(c){ return c.r === "Q"; } },
  { id:"spade", t:"Spade", f:function(c){ return c.s === "s"; } },
  { id:"num", t:"Number card (2–10)", f:function(c){ return c.ri >= 1 && c.ri <= 9; } }
];
var TILES = [];
for (var tn = 1; tn <= 30; tn++) TILES.push({ id:"t" + tn, t:String(tn), v:tn, name:String(tn) });
var SPACE = {
  tiles:{ items:TILES, evs:TEV, noun:["tile", "tiles"], test:function(e, it){ return e.f(it.v); } },
  deck:{ items:CARDS, evs:DEV, noun:["card", "cards"], test:function(e, it){ return e.f(it); } }
};
function evOf(sp, id){ return SPACE[sp].evs.filter(function(e){ return e.id === id; })[0]; }

// ---------- Explore: Overlap detector ----------
function explore(host, api){
  var S = api.S, C = api.content || {}, MSG = C.msg || {}, SV0 = C.survey || {};
  if (["tiles", "deck", "survey"].indexOf(S.mode) < 0) S.mode = "tiles";
  S.ev = S.ev || {};
  if (!S.ev.tiles || !evOf("tiles", S.ev.tiles.a) || !evOf("tiles", S.ev.tiles.b)) S.ev.tiles = { a:"even", b:"m5" };
  if (!S.ev.deck || !evOf("deck", S.ev.deck.a) || !evOf("deck", S.ev.deck.b)) S.ev.deck = { a:"heart", b:"face" };
  S.show = S.show === "prob" ? "prob" : "count";
  S.fm = S.fm === "add" || S.fm === "sub" ? S.fm : ""; S.fchk = S.fchk || ""; S.fpick = S.fpick || "";
  if (!S.sv) S.sv = { T:String(SV0.total), A:String(SV0.a), B:String(SV0.b), given:SV0.given || "neither", G:String(SV0.g), a:"", ab:"", b:"", o:"" };
  S.tc2 = S.tc2 || { n:"", p:"" };
  S.shade = Array.isArray(S.shade) ? S.shade : [];
  var SHORT = SV0.short || ["A", "B"], RL = { a:SHORT[0] + " only", ab:"Both", b:SHORT[1] + " only", o:"Neither" };
  var opts = function(sp){ return SPACE[sp].evs.map(function(e){ return '<option value="' + e.id + '">' + e.t + "</option>"; }).join(""); };
  host.innerHTML = '<div class="pg me-pg"><div class="pg-graph" data-mv="graph"><div id="me-mode"></div>' +
    '<div class="me-evs" id="me-evs"><label class="me-ev me-ev-a"><span>Event <b class="ev-a">A</b></span><select id="me-a"></select></label><label class="me-ev me-ev-b"><span>Event <b class="ev-b">B</b></span><select id="me-b"></select></label></div>' +
    '<div class="me-sv" id="me-sv" hidden><p class="me-svp"><span class="mdm-model">Model data</span> A survey of students: <b class="ev-a">A</b> = ' + SV0.nameA + ", <b class=\"ev-b\">B</b> = " + SV0.nameB + ".</p>" +
      '<div class="me-nums"><label>Total<input type="number" step="1" data-sv="T" id="me-sT"></label><label>' + MV.m("n(A)") + '<input type="number" step="1" data-sv="A"></label><label>' + MV.m("n(B)") + '<input type="number" step="1" data-sv="B"></label>' +
      '<div class="me-giv"><div id="me-giv"></div><label><span id="me-gl"></span><input type="number" step="1" data-sv="G"></label></div></div></div>' +
    '<div class="eq-cap" id="me-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="me-venn"></div><p class="me-tok" id="me-tok" aria-live="polite"></p><div class="me-deck" id="me-deck" hidden></div></div>' +
    '<div class="pg-ctrl"><div id="me-form"><div id="me-fm"></div><div class="q-actions"><button type="button" class="btn primary sm" id="me-fchk">Check formula</button></div><div id="me-ffb"></div></div>' +
    '<div id="me-svr" hidden><p class="me-lab">Fill the four regions</p><div class="me-nums">' + ["a", "ab", "b", "o"].map(function(c){ return "<label>" + RL[c] + '<input type="number" step="1" data-sv="' + c + '"></label>'; }).join("") + "</div></div>" +
    '<div id="me-show"></div></div>' +
    '<div class="pg-read"><dl class="read" id="me-read" aria-live="polite"></dl></div></div>';
  var capEl = $("#me-cap", host), readEl = $("#me-read", host), deckEl = $("#me-deck", host), tokEl = $("#me-tok", host), ffb = $("#me-ffb", host), selA = $("#me-a", host), selB = $("#me-b", host);
  var capOv = "", noPick = false, anim = null;

  var venn = vennDiagram($("#me-venn", host), { sets:2, aria:"Outcomes in the Venn diagram",
    onShade:function(cs){ S.shade = cs; api.save(); if (S.mode === "deck") paintDeck(data()); },
    onToken:function(id, code){ tokInfo(id, code); },
    stripNote:function(c){ return regionCount(c); },
    noteExtra:function(cs){ return shadeExtra(cs); } });

  var modeRg = radios($("#me-mode", host), { label:"Sample space", cls:"chips", value:S.mode,
    options:[{ id:"tiles", t:"Tiles 1–30" }, { id:"deck", t:"Standard deck" }, { id:"survey", t:"Survey counts" }],
    onChange:function(v){ user(); S.mode = v; S.shade = []; api.save(); syncSelects(); render({ fly:{ from:"pile", dur:850 } }); } });
  radios($("#me-fm", host), { label:"Formula", cls:"seg", value:S.fm, options:[{ id:"add", t:"Add only" }, { id:"sub", t:"Add, then subtract the overlap" }],
    onChange:function(v){ S.fm = v; noPick = false; api.save(); paintForm(data()); } });
  radios($("#me-show", host), { label:"Regions show", cls:"seg", value:S.show, options:[{ id:"count", t:"Counts" }, { id:"prob", t:"Probabilities" }],
    onChange:function(v){ S.show = v; api.save(); render({ instant:true }); } });
  var givRg = radios($("#me-giv", host), { label:"Given", cls:"seg", value:S.sv.given, options:[{ id:"both", t:"Both" }, { id:"neither", t:"Neither" }],
    onChange:function(v){ S.sv.given = v; api.save(); paintGivLabel(); render({ instant:true }); } });
  void givRg;

  function syncSelects(){
    if (S.mode === "survey") return;
    var sp = S.mode;
    if (selA.dataset.sp !== sp) { selA.innerHTML = opts(sp); selB.innerHTML = opts(sp); selA.dataset.sp = sp; }
    selA.value = S.ev[sp].a; selB.value = S.ev[sp].b;
  }
  function paintGivLabel(){ $("#me-gl", host).textContent = S.sv.given === "both" ? "Both" : "Neither"; }
  $$("[data-sv]", host).forEach(function(inp){ inp.value = S.sv[inp.dataset.sv] == null ? "" : S.sv[inp.dataset.sv]; });
  paintGivLabel();

  function data(){
    var sp = SPACE[S.mode] || SPACE.tiles, e = S.ev[S.mode] || S.ev.tiles, A = evOf(S.mode, e.a), B = evOf(S.mode, e.b), code = {}, cnt = { a:0, b:0, ab:0, o:0 }, AB = [];
    sp.items.forEach(function(it){ var ia = sp.test(A, it), ib = sp.test(B, it), c = ia && ib ? "ab" : ia ? "a" : ib ? "b" : "o"; code[it.id] = c; cnt[c]++; if (c === "ab") AB.push(it); });
    return { sp:sp, A:A, B:B, code:code, n:cnt, AB:AB, nA:cnt.a + cnt.ab, nB:cnt.b + cnt.ab, k:cnt.ab, U:cnt.a + cnt.b + cnt.ab, N:sp.items.length, key:S.mode + "|" + e.a + "|" + e.b };
  }
  function sdata(){
    var v = S.sv, d = { T:intOf(v.T), A:intOf(v.A), B:intOf(v.B), G:intOf(v.G), given:v.given, r:{ a:intOf(v.a), ab:intOf(v.ab), b:intOf(v.b), o:intOf(v.o) } };
    d.giv = isNum(d.T) && isNum(d.A) && isNum(d.B) && isNum(d.G);
    if (d.giv) {
      if (d.given === "neither") { d.nei = d.G; d.U = d.T - d.G; d.both = d.A + d.B - d.U; } else { d.both = d.G; d.U = d.A + d.B - d.G; d.nei = d.T - d.U; }
      d.valid = d.T > 0 && d.A >= 0 && d.B >= 0 && d.G >= 0 && d.A <= d.T && d.B <= d.T && d.both >= 0 && d.both <= Math.min(d.A, d.B) && d.nei >= 0;
    }
    d.filled = ["a", "ab", "b", "o"].every(function(c){ return isNum(d.r[c]); });
    return d;
  }
  function regVal(k, tot){ return S.show === "prob" && tot ? N(k) + "/" + N(tot) : N(k); }
  function regionCount(c){
    if (S.mode === "survey") { var d = sdata(), v = d.r[c]; return isNum(v) ? regVal(v, isNum(d.T) ? d.T : 0) : "?"; }
    var D = data(); return regVal(D.n[c], D.N);
  }
  function shadeExtra(cs){
    if (S.mode === "survey") {
      var d = sdata(); if (!d.filled || !isNum(d.T) || d.T <= 0) return "";
      var s = 0; cs.forEach(function(c){ s += d.r[c]; }); return " · " + N(s) + " student" + (s === 1 ? "" : "s") + " · " + MV.m("P") + " = " + F.prob(Math.max(0, s), d.T, { dec:false });
    }
    var D = data(), k = 0; cs.forEach(function(c){ k += D.n[c]; });
    return " · " + k + " " + D.sp.noun[k === 1 ? 0 : 1] + " · " + MV.m("P") + " = " + F.prob(k, D.N, { dec:false });
  }
  function evLab(i, D){ return '<b class="ev-' + (i ? "b" : "a") + '">' + (i ? "B" : "A") + "</b> (" + lc((i ? D.B : D.A).t) + ")"; }
  function tokInfo(id, code){
    var D = data(), it = D.sp.items.filter(function(x){ return x.id === id; })[0]; if (!it) return;
    var nm = S.mode === "deck" ? "The " + it.name : it.name;
    var t = code === "ab" ? nm + " is in both " + evLab(0, D) + " and " + evLab(1, D) + "." : code === "a" ? nm + " is in " + evLab(0, D) + " only." : code === "b" ? nm + " is in " + evLab(1, D) + " only." : nm + " is in neither " + evLab(0, D) + " nor " + evLab(1, D) + ".";
    tokEl.innerHTML = t;
  }

  function venOpt(opt){ return opt.pile ? { at:"pile" } : opt.fly ? { fly:opt.fly } : opt.instant ? { instant:true } : {}; }
  function render(opt){
    opt = opt || {};
    var sp = S.mode, sv = sp === "survey";
    $("#me-evs", host).hidden = sv; $("#me-sv", host).hidden = !sv; $("#me-svr", host).hidden = !sv; $("#me-form", host).hidden = sv; deckEl.hidden = sp !== "deck";
    tokEl.innerHTML = "";
    if (sv) {
      var d = sdata(), vs = {};
      ["a", "ab", "b", "o"].forEach(function(c){ var v = d.r[c]; vs[c] = isNum(v) ? regVal(v, isNum(d.T) ? d.T : 0) : "?"; });
      venn.set({ names:[SV0.nameA, SV0.nameB], tokens:{}, order:null, values:vs, fit:"values", maxTok:Infinity, glow:isNum(d.r.ab) && d.r.ab > 0, shade:S.shade }, { instant:true });
      paintCapS(d); paintReadS(d); MV.changed(); return;
    }
    var D = data(), tk = { a:[], ab:[], b:[], o:[] }, vs2 = {};
    D.sp.items.forEach(function(it){ tk[D.code[it.id]].push({ id:it.id, t:it.t, aria:it.name }); });
    ["a", "ab", "b", "o"].forEach(function(c){ vs2[c] = c === "ab" && !D.k ? "∅" : regVal(D.n[c], D.N); });
    venn.set({ names:[D.A.t, D.B.t], tokens:tk, order:D.sp.items.map(function(it){ return it.id; }), values:vs2, fit:sp === "tiles" ? "grow" : "values", maxTok:sp === "deck" ? 13 : Infinity, glow:D.k > 0 && !opt.pile, shade:S.shade }, venOpt(opt));
    paintDeck(D); paintRead(D); paintCap(D); paintForm(D);
    MV.changed();
  }
  function revealed(D){ return S.fchk === D.key; }
  function paintCap(D){
    if (S.mode === "survey") return;
    capEl.innerHTML = capOv || (revealed(D) ? MV.m("n(A ∪ B) = " + D.nA + " + " + D.nB + " - " + D.k + " = " + D.U) : MV.m("n(A ∪ B) = " + D.U));
  }
  function formulaText(D){ return D.nA + "/" + D.N + " + " + D.nB + "/" + D.N + " " + MI + " " + (D.k ? D.k + "/" + D.N : "0") + " = " + F.prob(D.U, D.N, { dec:false }); }
  function paintRead(D){
    var nn = D.sp.noun;
    readEl.innerHTML = MV.readoutHTML([
      [MV.m("n(A), n(B)"), D.nA + ", " + D.nB],
      [MV.m("n(A ∩ B)"), D.k + (D.k ? ": " + list(D.AB, 6) : "")],
      ["Mutually exclusive?", D.k ? "No: they share " + D.k + " " + nn[D.k === 1 ? 0 : 1] : "Yes: " + MV.m("A ∩ B = ∅")],
      [MV.m("n(A ∪ B)") + " by counting", String(D.U)],
      ["Formula", revealed(D) ? MV.m("P(A ∪ B)") + " = " + formulaText(D) : muted("Shown after you press Check formula.")],
      [MV.m("P") + "(neither)", F.prob(D.N - D.U, D.N, { dec:false })]
    ]);
  }
  function paintForm(D){
    if (S.mode === "survey") { ffb.innerHTML = ""; return; }
    if (noPick) { ffb.innerHTML = MV.fbHTML("bad", "Choose a formula first: <strong>Add only</strong> or <strong>Add, then subtract the overlap</strong>."); return; }
    if (!revealed(D) || !S.fpick) { ffb.innerHTML = ""; return; }
    var nn = D.sp.noun, h;
    if (S.fpick === "add" && D.k) h = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Adding only counts the " + D.k + " shared " + nn[D.k === 1 ? 0 : 1] + " twice: " + D.nA + " + " + D.nB + " = " + (D.nA + D.nB) + ", but only " + D.U + " " + nn[1] + " are in " + MV.m("A") + " or " + MV.m("B") + ". Subtract the overlap once.");
    else if (S.fpick === "add") h = MV.fbHTML("good", "<strong>✓ Correct.</strong> No " + nn[0] + " is in both, so adding is enough: " + D.nA + " + " + D.nB + " = " + D.U + ".");
    else if (D.k) h = MV.fbHTML("good", "<strong>✓ Correct.</strong> The overlap was counted twice, so subtract it once: " + D.nA + " + " + D.nB + " " + MI + " " + D.k + " = " + D.U + ".");
    else h = MV.fbHTML("good", "<strong>✓ Correct.</strong> The overlap is 0, so subtracting it changes nothing: the formula is the same either way.");
    ffb.innerHTML = h;
  }
  function paintDeck(D){
    if (S.mode !== "deck") { deckEl.innerHTML = ""; return; }
    var sh = {}; venn.shaded().forEach(function(c){ sh[c] = true; });
    var MK = { a:"A", b:"B", ab:"A B", o:"" };
    deckEl.innerHTML = '<p class="me-lab">The 52 cards: <b class="ev-a">A</b> cells tinted blue, <b class="ev-b">B</b> teal, both split</p><div class="dk" role="list" aria-label="The 52 cards and the events each one is in">' + CARDS.map(function(c){
      var r = D.code[c.id];
      return '<span role="listitem" class="dk-c dk-' + r + (sh[r] ? " lit" : "") + '" style="--r1:' + (c.si + 1) + ";--c1:" + (c.ri + 1) + ";--r2:" + (c.ri + 1) + ";--c2:" + (c.si + 1) + '"><span class="dk-t">' + c.t + '</span><span class="dk-m" aria-hidden="true">' + MK[r] + '</span><span class="vh">: ' + c.name + ", " + venn.regionText(r) + "</span></span>";
    }).join("") + "</div>";
  }
  function paintCapS(d){
    capEl.innerHTML = capOv || (d.giv && d.valid ? MV.m("n(A ∪ B) = " + (d.given === "neither" ? d.T + " - " + d.G : d.A + " + " + d.B + " - " + d.G) + " = " + d.U) : MV.m("n(A ∪ B) = ?"));
  }
  function paintReadS(d){
    var rows = [], r = d.r;
    if (d.giv && !d.valid) rows.push(["Givens", "These numbers can’t all be true. " + MV.m("n(A)") + " and " + MV.m("n(B)") + " must be at most the total, and no region can be negative."]);
    rows.push([MV.m("n(A), n(B)"), d.giv ? N(d.A) + ", " + N(d.B) : "—"]);
    rows.push([MV.m("n(A ∩ B)") + " (your regions)", isNum(r.ab) ? N(r.ab) : muted("Fill in “Both”.")]);
    rows.push(["Mutually exclusive?", isNum(r.ab) ? (r.ab === 0 ? "Yes: " + MV.m("A ∩ B = ∅") : r.ab > 0 ? "No: " + N(r.ab) + " student" + (r.ab === 1 ? " does" : "s do") + " both" : "A region can’t hold a negative number of students.") : muted("Fill in “Both” to find out.")]);
    var three = isNum(r.a) && isNum(r.ab) && isNum(r.b);
    rows.push([MV.m("n(A ∪ B)"), (d.giv && d.valid ? "From the givens: " + (d.given === "neither" ? N(d.T) + " " + MI + " " + N(d.G) : N(d.A) + " + " + N(d.B) + " " + MI + " " + N(d.G)) + " = " + N(d.U) : "From the givens: —") +
      (three ? "<br>From your regions: " + N(r.a) + " + " + N(r.ab) + " + " + N(r.b) + " = " + N(r.a + r.ab + r.b) : "")]);
    if (d.filled && d.giv) {
      var line = function(ok, lhs, val, want){ return (ok ? '<span class="me-y">✓</span> ' : '<span class="me-n">✗</span> ') + lhs + " = " + N(val) + (ok ? "" : ", but it should be " + N(want)); };
      var gl = d.given === "neither" ? line(r.o === d.G, "Neither", r.o, d.G) : line(r.ab === d.G, "Both", r.ab, d.G);
      rows.push(["Check your regions", [line(r.a + r.ab === d.A, RL.a + " + both", r.a + r.ab, d.A), line(r.b + r.ab === d.B, RL.b + " + both", r.b + r.ab, d.B), line(r.a + r.ab + r.b + r.o === d.T, "All four regions", r.a + r.ab + r.b + r.o, d.T), gl].join("<br>")]);
    } else rows.push(["Check your regions", muted("Fill in all four regions.")]);
    rows.push([MV.m("P") + "(neither)", d.giv && d.valid ? F.prob(d.nei, d.T, { dec:false }) : "—"]);
    readEl.innerHTML = MV.readoutHTML(rows);
  }

  // events
  function onSel(){ user(); var sp = S.mode; S.ev[sp] = { a:selA.value, b:selB.value }; api.save(); render(); }
  selA.addEventListener("change", onSel); selB.addEventListener("change", onSel);
  $("#me-fchk", host).addEventListener("click", function(){
    var D = data();
    if (!S.fm) { noPick = true; paintForm(D); MV.focusFb($("#me-form", host)); return; }
    noPick = false; S.fchk = D.key; S.fpick = S.fm; api.save(); paintCap(D); paintRead(D); paintForm(D); MV.focusFb($("#me-form", host));
  });
  host.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.sv; if (!k) return;
    S.sv[k] = e.target.value; api.save(); if (S.mode === "survey") render({ instant:true });
  });

  // animation bookkeeping for predictions
  function endAnim(){ var a = anim; anim = null; if (!a) return; a.timers.forEach(clearTimeout); capOv = ""; if (a.fin) { var f = a.fin; a.fin = null; f(); } }
  function newAnim(fin){ endAnim(); anim = { timers:[], fin:fin }; return anim; }
  function later(ms, fn){ var a = anim; if (!a) return; a.timers.push(MV.wait(ms, function(){ if (anim === a) fn(); })); }
  function user(){ if (anim) { endAnim(); if (S.mode !== "survey") paintCap(data()); } }

  // TC2 answer boxes live inside the challenge card (re-added each time the toolkit repaints the challenges)
  var chal = $("#chal");
  function injectTc2(){
    var card = chal && chal.querySelector('[data-c="tc2"]'); if (!card || card.querySelector(".me-tc2")) return;
    var done = !!(MV.S.chal && MV.S.chal.tc2 && MV.S.chal.tc2.solved), row = document.createElement("div");
    row.className = "inrow me-tc2";
    row.innerHTML = '<label for="me-tc2n">' + MV.m("n(A ∩ B)") + '<input type="number" step="1" id="me-tc2n" data-tc2="n" data-k="me-tc2n"' + (done ? " disabled" : "") + "></label>" +
      '<label for="me-tc2p">' + MV.m("P(A ∪ B)") + '<input type="text" id="me-tc2p" data-tc2="p" data-k="me-tc2p" autocomplete="off" spellcheck="false" placeholder="e.g. 1/2"' + (done ? " disabled" : "") + "></label>";
    var head = card.querySelector(".q-head"); card.insertBefore(row, head ? head.nextSibling : card.firstChild);
    $("#me-tc2n").value = S.tc2.n || ""; $("#me-tc2p").value = S.tc2.p || "";
  }
  if (chal) {
    new MutationObserver(injectTc2).observe(chal, { childList:true });
    chal.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tc2; if (!k) return; S.tc2[k] = e.target.value; api.save(); MV.liveChallenges(); });
    chal.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.tc2) { var b = chal.querySelector('[data-c="tc2"] [data-act="check"]'); if (b) b.click(); } });
  }

  function tc1(){
    if (S.mode !== "tiles") return { ok:false, msg:"Switch the sample space to <strong>Tiles 1–30</strong>." };
    var D = data(), e = S.ev.tiles, pair = [e.a, e.b].sort().join("+");
    if (e.a === e.b) return { ok:false, msg:"Choose two different events: an event always overlaps itself." };
    if (pair === "prime+sq") return { ok:false, msg:MSG.tc1PrimeSq };
    if (pair === "even+m5") return { ok:false, msg:MSG.tc1EvenM5 };
    if (D.k) return { ok:false, msg:"They overlap at " + list(D.AB, 12) + ", so they aren’t mutually exclusive." };
    if (D.U <= 15) return { ok:false, msg:"Mutually exclusive, but " + D.nA + " + " + D.nB + " = " + D.U + " isn’t more than half of 30." };
    return { ok:true };
  }
  function tc2(){
    var nr = String(S.tc2.n || "").trim(), pr = String(S.tc2.p || "").trim();
    if (!nr) return { ok:false, msg:MV.md("Enter `n(A ∩ B)` in the first box.") };
    var nv = intOf(nr);
    if (nv === 0) return { ok:false, msg:MSG.tc2Zero };
    if (nv !== 2) return { ok:false, msg:"List the tiles that are prime <strong>and</strong> greater than 20, then count them." };
    if (!pr) return { ok:false, msg:MV.md("The overlap is right. Now enter `P(A ∪ B)`.") };
    var p = F.parse(pr);
    if (!p) return { ok:false, msg:MV.md("Enter `P(A ∪ B)` as a fraction such as 3/5 or a decimal such as 0.6.") };
    if (F.eq(p, F.of(18, 30))) return { ok:true };
    if (F.eq(p, F.of(20, 30))) return { ok:false, msg:MSG.tc2Add };
    if (F.eq(p, F.of(2, 30))) return { ok:false, msg:MV.md("2/30 is only the overlap. “Or” includes everything in `A`, everything in `B`, and the overlap.") };
    if (F.eq(p, F.of(18, 1))) return { ok:false, msg:"18 is the number of tiles. Divide by the 30 tiles to get the probability." };
    return { ok:false, msg:"Count the tiles that are prime or greater than 20 (or both), then divide by 30." };
  }
  function tc3(){
    if (S.mode !== "survey") return { ok:false, msg:"Switch the sample space to <strong>Survey counts</strong>." };
    var d = sdata(), r = d.r;
    if (!(d.T === 40 && d.A === 22 && d.B === 15 && d.given === "neither" && d.G === 9)) return { ok:false, msg:"Set the survey to 40 students, " + MV.m("n(A)") + " = 22, " + MV.m("n(B)") + " = 15 and 9 who do neither." };
    if (r.ab === -3) return { ok:false, msg:MSG.tc3Neg };
    if (r.ab === 0) return { ok:false, msg:MSG.tc3Zero };
    if (r.a === 22) return { ok:false, msg:MSG.tc3Sport };
    if (!d.filled) return { ok:false, msg:"Fill all four regions with whole numbers." };
    if (r.ab === 6 && r.a === 16 && r.b === 9 && r.o === 9) return { ok:true };
    return { ok:false, msg:"Check each circle: sport only + both must be 22, instrument only + both must be 15, and the four regions must add to 40." };
  }

  syncSelects();
  render({ instant:true });
  return {
    predict:{
      start:function(p){
        endAnim();
        var s = p.start || {};
        S.mode = s.mode; S.ev[s.mode] = { a:s.a, b:s.b }; S.fchk = ""; S.fpick = ""; S.shade = []; noPick = false;
        modeRg.set(S.mode); syncSelects(); api.save();
        capOv = MV.m(p.id === "p4" ? "P(A′) = ?" : "n(A ∪ B) = ?");
        render({ pile:true });
      },
      run:function(p, done){
        var D = data();
        newAnim(function(){ paintCap(data()); done(); });
        if (p.id === "p4") {
          venn.fly({ from:"keep", dur:850, done:function(){
            later(450, function(){
              S.shade = ["b", "o"]; api.save(); venn.shade(S.shade);
              capOv = MV.m("P(A′) = 1 - " + D.nA + "/" + D.N + " = " + (D.N - D.nA) + "/" + D.N); paintCap(D);
              later(1500, endAnim);
            });
          } });
          return;
        }
        venn.fly({ from:"keep", dur:900, hesitate:D.k ? ["ab"] : null, done:function(){
          capOv = MV.m("n(A ∪ B) = " + D.nA + " + " + D.nB + " = " + (D.nA + D.nB)); paintCap(D);
          later(D.k ? 900 : 500, function(){
            venn.glow(D.k > 0);
            later(D.k ? 1100 : 400, function(){
              capOv = MV.m("n(A ∪ B) = " + D.nA + " + " + D.nB + " - " + D.k + " = " + D.U); paintCap(D);
              S.fchk = D.key; S.fpick = ""; api.save(); paintRead(D); paintForm(D);
              later(1200, endAnim);
            });
          });
        } });
      }
    },
    challenge:function(id){
      if (id === "tc1") return tc1();
      if (id === "tc2") return tc2();
      if (id === "tc3") return tc3();
      return { ok:false };
    }
  };
}

// ---------- hero: hearts into A, face cards into B, J♥ Q♥ K♥ counted twice ----------
function hero(f){
  var svg = $("#me-hsvg"), cnt = $("#me-hcount"), cap = f.cap;
  if (!svg) return;
  var SA = [[95, 82], [123, 82], [75, 114], [103, 114], [131, 114], [75, 146], [103, 146], [131, 146], [95, 178], [123, 178]];
  var SB = [[277, 82], [305, 82], [269, 114], [297, 114], [325, 114], [269, 146], [297, 146], [325, 146], [297, 178]];
  var SO = [[200, 92], [200, 130], [200, 168]], cards = [];
  ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"].forEach(function(r, i){ cards.push({ t:r + "♥", g:0, x0:-26, y0:SA[i][1], x1:SA[i][0], y1:SA[i][1] }); });
  ["J", "Q", "K"].forEach(function(r, i){ cards.push({ t:r + "♥", g:0, x0:-26, y0:SO[i][1], x1:SO[i][0] - 5, y1:SO[i][1] - 4 }); });
  ["J♠", "Q♠", "K♠", "J♦", "Q♦", "K♦", "J♣", "Q♣", "K♣"].forEach(function(t, i){ cards.push({ t:t, g:1, x0:426, y0:SB[i][1], x1:SB[i][0], y1:SB[i][1] }); });
  ["J", "Q", "K"].forEach(function(r, i){ cards.push({ t:r + "♥", g:1, x0:426, y0:SO[i][1], x1:SO[i][0] + 5, y1:SO[i][1] + 4, dup:true }); });
  var hh = Math.sqrt(100 * 100 - 50 * 50), h = "";
  h += '<circle class="h-fa" cx="150" cy="130" r="100"/><circle class="h-fb" cx="250" cy="130" r="100"/>';
  h += '<path class="h-lens" d="M200 ' + (130 - hh).toFixed(1) + "A100 100 0 0 1 200 " + (130 + hh).toFixed(1) + "A100 100 0 0 1 200 " + (130 - hh).toFixed(1) + 'Z"/>';
  h += '<circle class="h-oa" cx="150" cy="130" r="100"/><circle class="h-ob" cx="250" cy="130" r="100"/>';
  h += '<text class="h-la" x="96" y="18" text-anchor="middle">A: 13 hearts</text><text class="h-lb" x="304" y="18" text-anchor="middle">B: 12 face cards</text>';
  cards.forEach(function(c, i){ h += '<g class="h-card' + (c.dup ? " h-dup" : "") + '" data-i="' + i + '"><rect x="-11" y="-14" width="22" height="28" rx="3"/><text y="3.5" text-anchor="middle">' + c.t + "</text>" + (c.dup ? '<line class="h-strike" x1="-12" y1="15" x2="12" y2="-15"/>' : "") + "</g>"; });
  SO.forEach(function(p){ h += '<g class="h-x2" transform="translate(' + (p[0] + 29) + " " + p[1] + ')"><rect x="-12" y="-9" width="24" height="18" rx="9"/><text y="4" text-anchor="middle">×2</text></g>'; });
  h += '<text class="h-twice" x="200" y="241" text-anchor="middle">counted twice</text>';
  svg.innerHTML = h;
  var els = $$(".h-card", svg);
  function smooth(u){ u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
  function frame(p0, p1){
    var k0 = 0, k1 = 0;
    cards.forEach(function(c, i){
      var p = c.g ? p1 : p0, k = c.g ? k1++ : k0++, cntG = c.g ? 12 : 13, u = smooth((p * (1 + 0.05 * (cntG - 1)) - 0.05 * k));
      els[i].setAttribute("transform", "translate(" + (c.x0 + (c.x1 - c.x0) * u).toFixed(1) + " " + (c.y0 + (c.y1 - c.y0) * u).toFixed(1) + ")");
    });
  }
  var CAPS = ["13 hearts slide into circle A.", "12 face cards slide into circle B.", "J♥, Q♥ and K♥ are in both circles: counted twice.", "Subtract the overlap once: 22 cards."];
  var CNT = ["", "13", "13 + 12 = 25", "13 + 12 = 25", '13 + 12 <span class="h-m3">' + MI + " 3</span> = 22"];
  function phase(k){ svg.classList.toggle("p2", k >= 2); svg.classList.toggle("p3", k >= 3); if (cap) cap.textContent = CAPS[Math.max(0, Math.min(3, k))]; $(".h-twice", svg).textContent = k >= 3 ? "subtract once" : "counted twice"; }
  function last(){ frame(1, 1); phase(3); cnt.innerHTML = CNT[4]; }
  if (MV.reduceMotion) { last(); return; }
  frame(0, 0); phase(0); cnt.innerHTML = "";
  var lin = function(x){ return x; };
  MV.wait(500, function(){
    MV.tween({ dur:1500, ease:lin, step:function(t){ frame(t, 0); }, done:function(){
      cnt.innerHTML = CNT[1];
      MV.wait(500, function(){
        phase(1);
        MV.tween({ dur:1500, ease:lin, step:function(t){ frame(1, t); }, done:function(){
          cnt.innerHTML = CNT[2];
          MV.wait(600, function(){ phase(2); MV.wait(2600, function(){ phase(3); cnt.innerHTML = CNT[4]; }); });
        } });
      });
    } });
  });
}

// ---------- Part 3: Counting “or” problems ----------
function lcm(a, b){ var x = a, y = b; while (y) { var t = x % y; x = y; y = t; } return a / x * b; }
function part3(host, api){
  var S = api.S, P = api.content || {}, s1 = P.st1 || {}, s2 = P.st2 || {}, s3 = P.st3 || {};
  S.st = ["1", "2", "3"].indexOf(S.st) >= 0 ? S.st : "1";
  S.p1 = Array.isArray(S.p1) ? S.p1 : [];
  S.s2 = S.s2 || {}; S.s2.v = S.s2.v || {};
  S.s3 = S.s3 || {}; if (!(S.s3.a >= 2 && S.s3.a <= 10)) S.s3.a = 2; if (!(S.s3.b >= 2 && S.s3.b <= 10)) S.s3.b = 5; if (S.s3.A == null) S.s3.A = true; if (S.s3.B == null) S.s3.B = true;
  var G11 = ["A", "B", "C"], G12 = ["D", "E", "F", "G"], ALL1 = ["AB", "AC", "BC"], ALL2 = ["DE", "DF", "DG", "EF", "EG", "FG"];
  var divOpts = function(){ var h = ""; for (var d = 2; d <= 10; d++) h += '<option value="' + d + '">' + d + "</option>"; return h; };
  host.innerHTML = '<div id="or-st" class="or-st"></div>' +
    '<div class="or-station" data-st="1"><h3>' + s1.title + "</h3><p>" + s1.text + '</p><div class="sym"><div><p class="how">Tap two students from the same grade to list them as a pair.</p><div id="or-s1p"></div>' +
      '<div class="q-actions"><button type="button" class="btn sm" id="or-s1list">List them for me</button><button type="button" class="btn ghost sm" id="or-s1clr">Clear the list</button></div><div id="or-s1fb" aria-live="polite"></div></div>' +
      '<div><dl class="read" id="or-s1read" aria-live="polite"></dl><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>Case 1, Grade 11: AB, AC, BC = 3 pairs</span><span>Case 2, Grade 12: DE, DF, DG, EF, EG, FG = 6 pairs</span><span>3 + 6 = 9 <small>No pair is in both cases, so the cases are mutually exclusive and the counts add.</small></span></div></details></div></div></div>' +
    '<div class="or-station" data-st="2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="sym"><div><div class="me-nums or-s2n">' +
      [["a", "Start with 7"], ["b", "End with 7"], ["ab", "Both (7_7)"], ["u", "Start or end with 7"]].map(function(x){ return "<label>" + x[1] + '<input type="number" step="1" data-s2="' + x[0] + '"></label>'; }).join("") +
      '</div><div class="q-actions"><button type="button" class="btn primary sm" id="or-s2chk">Check</button></div><div id="or-s2fb"></div>' +
      '<details class="alg"><summary>Check it with algebra</summary><div class="alg-lines"><span>Start with 7: 1 × 10 × 10 = 100</span><span>End with 7: 10 × 10 × 1 = 100</span><span>Both, 7_7: 1 × 10 × 1 = 10</span><span>100 + 100 − 10 = 190 <small>The 7_7 codes are in both counts, so subtract them once.</small></span></div></details></div>' +
      '<div><p class="me-lab">Check it by listing: a smaller version</p><p class="tiny">Two-digit codes from the digits 1–3 (repeats allowed). <b class="ev-a">A</b> = starts with 1, <b class="ev-b">B</b> = ends with 1.</p><div id="or-s2v"></div>' +
      '<div class="q-actions"><button type="button" class="btn sm" id="or-s2list">Check it by listing</button></div><dl class="read" id="or-s2read" aria-live="polite"></dl></div></div></div>' +
    '<div class="or-station" data-st="3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div class="sym"><div><p class="tiny or-leg"><span class="or-ka" aria-hidden="true"></span> <b class="ev-a">A</b> &nbsp;<span class="or-kb" aria-hidden="true"></span> <b class="ev-b">B</b> &nbsp;<span class="or-kab" aria-hidden="true"></span> both (outlined)</p><div class="hc" id="or-hc" role="img"></div></div>' +
      '<div><div class="me-evs"><label class="me-ev me-ev-a"><span><b class="ev-a">A</b>: divisible by</span><select id="or-da">' + divOpts() + '</select></label><label class="me-ev me-ev-b"><span><b class="ev-b">B</b>: divisible by</span><select id="or-db">' + divOpts() + "</select></label></div>" +
      '<div class="q-actions"><button type="button" class="btn sm" id="or-shA" aria-pressed="true">Shade <b class="ev-a">A</b></button><button type="button" class="btn sm" id="or-shB" aria-pressed="true">Shade <b class="ev-b">B</b></button></div>' +
      '<dl class="read" id="or-s3read" aria-live="polite"></dl><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines" id="or-s3alg"></div></details></div></div></div>';
  radios($("#or-st", host), { label:"Station", cls:"chips", value:S.st, options:[{ id:"1", t:"1. Same-group pairs" }, { id:"2", t:"2. Starts or ends with 7" }, { id:"3", t:"3. Divisible by 2 or 5" }],
    onChange:function(v){ S.st = v; api.save(); showSt(); } });
  function showSt(){ $$(".or-station", host).forEach(function(d){ d.hidden = d.dataset.st !== S.st; }); if (S.st === "2") v2.relayout(); }

  // station 1: list the same-grade pairs
  var sel1 = null, msg1 = null, timer1 = null;
  function has(p){ return S.p1.indexOf(p) >= 0; }
  function grade(x){ return G11.indexOf(x) >= 0 ? 11 : 12; }
  function paint1(){
    var grp = function(lab, lst){ return '<div class="or-grp" role="group" aria-label="' + lab + '"><span class="or-gl">' + lab + "</span>" + lst.map(function(x){ return '<button type="button" class="or-stu" data-stu="' + x + '" data-k="stu' + x + '" aria-pressed="' + (sel1 === x) + '">' + x + "</button>"; }).join("") + "</div>"; };
    MV.keepFocus($("#or-s1p", host), function(){ $("#or-s1p", host).innerHTML = grp("Grade 11", G11) + grp("Grade 12", G12); });
    var f1 = ALL1.filter(has), f2 = ALL2.filter(has), done = f1.length === 3 && f2.length === 6;
    $("#or-s1read", host).innerHTML = MV.readoutHTML([
      ["Grade 11 pairs", f1.length ? f1.join(", ") + " (" + f1.length + (f1.length === 3 ? ": that’s all of them ✓" : "") + ")" : muted("none listed yet")],
      ["Grade 12 pairs", f2.length ? f2.join(", ") + " (" + f2.length + (f2.length === 6 ? ": that’s all of them ✓" : "") + ")" : muted("none listed yet")],
      ["Total", done ? "3 + 6 = 9" : muted("List every pair first.")]
    ]);
    $("#or-s1fb", host).innerHTML = msg1 ? MV.fbHTML(msg1.k, msg1.h) : done ? MV.fbHTML("good", "<strong>✓ All 9 pairs are listed.</strong> " + s1.done) : "";
  }
  $("#or-s1p", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-stu]"); if (!b) return;
    var x = b.dataset.stu;
    if (!sel1) { sel1 = x; msg1 = { k:"", h:"Now tap a partner for " + x + "." }; }
    else if (sel1 === x) { sel1 = null; msg1 = null; }
    else {
      var p = [sel1, x].sort().join("");
      if (grade(sel1) !== grade(x)) msg1 = { k:"bad", h:"<strong>✗ Not a pair.</strong> " + sel1 + " and " + x + " are in different grades: co-leaders must come from the same grade." };
      else if (has(p)) msg1 = { k:"", h:p + " is already on the list." };
      else { S.p1.push(p); api.save(); msg1 = { k:"good", h:"<strong>✓ " + p + "</strong> is a Grade " + grade(x) + " pair." }; }
      sel1 = null;
      if (ALL1.every(has) && ALL2.every(has)) msg1 = null;
    }
    paint1();
  });
  $("#or-s1list", host).addEventListener("click", function(){
    clearTimeout(timer1); sel1 = null; msg1 = null;
    var todo = ALL1.concat(ALL2).filter(function(p){ return !has(p); });
    (function tick(){ if (!todo.length) { api.save(); paint1(); return; } S.p1.push(todo.shift()); paint1(); timer1 = MV.wait(320, tick); })();
  });
  $("#or-s1clr", host).addEventListener("click", function(){ clearTimeout(timer1); S.p1 = []; sel1 = null; msg1 = null; api.save(); paint1(); });

  // station 2: start with 7 or end with 7, then the listing check
  $$("[data-s2]", host).forEach(function(inp){ inp.value = S.s2.v[inp.dataset.s2] == null ? "" : S.s2.v[inp.dataset.s2]; });
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.s2; if (!k) return; S.s2.v[k] = e.target.value; api.save(); });
  $("#or-s2chk", host).addEventListener("click", function(){
    var v = S.s2.v, a = intOf(v.a), b = intOf(v.b), ab = intOf(v.ab), u = intOf(v.u), fb = $("#or-s2fb", host), msg = null;
    if (![a, b, ab, u].every(isNum)) msg = "Fill in all four boxes with whole numbers.";
    else if (a !== 100) msg = "Start with 7: the first digit is fixed at 7, and the other two digits have 10 choices each.";
    else if (b !== 100) msg = "End with 7: the last digit is fixed at 7, and the first two digits have 10 choices each.";
    else if (ab === 0) msg = "Codes like 707 start <strong>and</strong> end with 7.";
    else if (ab !== 10) msg = "7_7: only the middle digit is free.";
    else if (u === 200) msg = "200 counts the 7_7 codes twice. Subtract them once.";
    else if (u !== 190) msg = "Use the additive principle: start with 7 + end with 7 − both.";
    fb.innerHTML = msg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msg) : MV.fbHTML("good", "<strong>✓ Correct.</strong> 100 + 100 " + MI + " 10 = 190: the 10 codes 7_7 were in both counts, so they’re subtracted once.");
    MV.focusFb(fb.parentNode);
  });
  var CODES2 = ["11", "12", "13", "21", "22", "23", "31", "32", "33"];
  function code2(c){ var a = c[0] === "1", b = c[1] === "1"; return a && b ? "ab" : a ? "a" : b ? "b" : "o"; }
  var v2 = vennDiagram($("#or-s2v", host), { sets:2, aria:"Two-digit codes in the Venn diagram",
    stripNote:function(c){ return S.s2.listed ? String(CODES2.filter(function(x){ return code2(x) === c; }).length) : "?"; },
    noteExtra:function(cs){ if (!S.s2.listed) return ""; var k = CODES2.filter(function(x){ return cs.indexOf(code2(x)) >= 0; }).length; return " · " + k + " code" + (k === 1 ? "" : "s"); } });
  function tokens2(){ var t = { a:[], ab:[], b:[], o:[] }; CODES2.forEach(function(c){ t[code2(c)].push({ id:"k" + c, t:c, aria:c }); }); return t; }
  function paint2(fly){
    var listed = !!S.s2.listed;
    v2.set({ names:["starts with 1", "ends with 1"], tokens:tokens2(), order:CODES2.map(function(c){ return "k" + c; }), values:{ ab:"" }, fit:"grow", glow:listed && !fly }, listed && !fly ? { instant:true } : { at:"pile" });
    if (fly) v2.fly({ from:"keep", dur:900, hesitate:["ab"], done:function(){ v2.glow(true); paintRead2(); } });
    else paintRead2();
  }
  function paintRead2(){
    var listed = !!S.s2.listed;
    $("#or-s2read", host).innerHTML = listed ? MV.readoutHTML([
      ["Start with 1 (" + '<b class="ev-a">A</b>)', "11, 12, 13 (3)"], ["End with 1 (" + '<b class="ev-b">B</b>)', "11, 21, 31 (3)"], ["Both", "11 (1)"],
      ["Start or end with 1", "11, 12, 13, 21, 31: 3 + 3 " + MI + " 1 = 5 ✓"]]) + '<div class="fb good" role="status"><p>' + s2.list + "</p></div>" : MV.readoutHTML([["Listing", muted("Press Check it by listing to sort the 9 codes.")]]);
  }
  $("#or-s2list", host).addEventListener("click", function(){ S.s2.listed = true; api.save(); paint2(true); });

  // station 3: hundred chart
  var da = $("#or-da", host), db = $("#or-db", host);
  da.value = String(S.s3.a); db.value = String(S.s3.b);
  function paint3(){
    var a = S.s3.a, b = S.s3.b, L = lcm(a, b), nA = Math.floor(100 / a), nB = Math.floor(100 / b), nAB = Math.floor(100 / L), shA = S.s3.A, shB = S.s3.B, cells = "", shaded = 0;
    for (var v = 1; v <= 100; v++) {
      var ia = v % a === 0, ib = v % b === 0, ca = ia && shA, cb = ib && shB;
      if (ca || cb) shaded++;
      cells += "<span" + (ca || cb ? ' class="' + (ca ? "hc-a " : "") + (cb ? "hc-b " : "") + (ca && cb ? "hc-ab" : "") + '"' : "") + ">" + v + "</span>";
    }
    var hc = $("#or-hc", host); hc.innerHTML = cells;
    hc.setAttribute("aria-label", "Hundred chart, 1 to 100." + (shA ? " " + nA + " multiples of " + a + " marked for A." : "") + (shB ? " " + nB + " multiples of " + b + " marked for B." : "") + (shA && shB ? " " + nAB + " multiples of " + L + " are in both and outlined." : ""));
    $("#or-shA", host).setAttribute("aria-pressed", shA); $("#or-shB", host).setAttribute("aria-pressed", shB);
    $("#or-s3read", host).innerHTML = MV.readoutHTML([
      [MV.m("n(A)"), "multiples of " + a + ": 100 ÷ " + a + " → " + nA],
      [MV.m("n(B)"), "multiples of " + b + ": 100 ÷ " + b + " → " + nB],
      [MV.m("n(A ∩ B)"), a === b ? "the same event: " + nAB : "multiples of " + L + " (the lowest common multiple): " + nAB],
      [MV.m("n(A ∪ B)"), nA + " + " + nB + " " + MI + " " + nAB + " = " + (nA + nB - nAB)],
      ["Shaded cells", shA && shB ? shaded + (shaded === nA + nB - nAB ? " ✓ the chart agrees" : "") : muted("Shade both events to compare.")]
    ]);
    $("#or-s3alg", host).innerHTML = "<span>Multiples of " + a + ": 100 ÷ " + a + " → " + nA + "</span><span>Multiples of " + b + ": 100 ÷ " + b + " → " + nB + "</span><span>Multiples of both are multiples of " + L + ": " + nAB + "</span><span>" + nA + " + " + nB + " " + MI + " " + nAB + " = " + (nA + nB - nAB) + " <small>The multiples of " + L + " are in both counts, so subtract them once.</small></span>";
  }
  da.addEventListener("change", function(){ S.s3.a = +da.value; api.save(); paint3(); });
  db.addEventListener("change", function(){ S.s3.b = +db.value; api.save(); paint3(); });
  $("#or-shA", host).addEventListener("click", function(){ S.s3.A = !S.s3.A; api.save(); paint3(); });
  $("#or-shB", host).addEventListener("click", function(){ S.s3.B = !S.s3.B; api.save(); paint3(); });

  paint1(); paint2(false); paint3(); showSt();
  return {};
}

// ---------- Performance task: Two events, one overlap ----------
var task = (function(){
  var api = null;
  function read(){ var s = api ? api.S : {}; return { k:s.k == null ? 3 : s.k, m:s.m == null ? 15 : s.m }; }
  function stats(d){ var A = [], B = [], AB = []; for (var v = 1; v <= 30; v++) { var a = v % d.k === 0, b = v > d.m; if (a) A.push(v); if (b) B.push(v); if (a && b) AB.push(v); } return { A:A, B:B, AB:AB, U:A.length + B.length - AB.length }; }
  function paint(){
    var d = read(), s = stats(d), cells = "";
    $("#tk-k").textContent = d.k;
    $('[data-tk="-1"]').disabled = d.k <= 2; $('[data-tk="1"]').disabled = d.k >= 10;
    for (var v = 1; v <= 30; v++) { var a = v % d.k === 0, b = v > d.m; cells += "<span" + (a || b ? ' class="' + (a ? "hc-a " : "") + (b ? "hc-b " : "") + (a && b ? "hc-ab" : "") + '"' : "") + ">" + v + "</span>"; }
    var bd = $("#tk-board"); bd.innerHTML = cells;
    bd.setAttribute("aria-label", "Tiles 1 to 30. A, multiples of " + d.k + ": " + s.A.join(", ") + ". B, greater than " + d.m + ": " + (s.B.length ? s.B[0] + " to 30" : "none") + ". In both: " + (s.AB.length ? s.AB.join(", ") : "none") + ".");
    $("#tk-read").innerHTML = MV.readoutHTML([
      [MV.m("n(A)"), String(s.A.length)], [MV.m("n(B)"), String(s.B.length)],
      [MV.m("n(A ∩ B)"), s.AB.length + (s.AB.length ? ": " + s.AB.join(", ") : "")],
      [MV.m("n(A ∪ B)"), s.A.length + " + " + s.B.length + " " + MI + " " + s.AB.length + " = " + s.U + " (" + MV.m("P") + " = " + F.prob(s.U, 30, { dec:false }) + ")"]
    ]);
  }
  return {
    render:function(inp, pv, a){
      api = a; if (a.S.k == null) a.S.k = 3; if (a.S.m == null) a.S.m = 15;
      inp.innerHTML = '<div class="tk-in"><div class="tk-row" role="group" aria-label="k for event A"><span class="tk-lab">Event ' + MV.m("A") + ": a multiple of " + MV.m("k") + '</span><button type="button" class="btn ghost sm tk-b" data-tk="-1" aria-label="Decrease k">' + MI + '</button><output class="tk-out" id="tk-k" aria-live="polite"></output><button type="button" class="btn ghost sm tk-b" data-tk="1" aria-label="Increase k">+</button></div><div id="tk-sl"></div></div>';
      MV.sliders($("#tk-sl", inp), [{ id:"tkm", label:"Event " + MV.m("B") + ": greater than " + MV.m("m"), min:0, max:29, step:1, value:a.S.m }], function(id, v){ a.S.m = v; a.save(); paint(); a.update(); });
      pv.innerHTML = '<div class="tk-pv"><p class="me-lab">Tiles 1–30 <span class="or-leg"><span class="or-ka" aria-hidden="true"></span> <b class="ev-a">A</b> &nbsp;<span class="or-kb" aria-hidden="true"></span> <b class="ev-b">B</b> &nbsp;<span class="or-kab" aria-hidden="true"></span> both</span></p><div class="hc tk-board" id="tk-board" role="img"></div><dl class="read" id="tk-read" aria-live="polite"></dl></div>';
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tk]"); if (!b || b.disabled) return;
        a.S.k = Math.max(2, Math.min(10, (a.S.k | 0) + +b.dataset.tk)); a.save(); paint(); a.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var s = stats(d); return [s.AB.length === 2, s.U === 15, s.B.length >= 2 * s.A.length]; },
    key:function(d){
      var k = d.k + "," + d.m, st = MV.taskState(), n = st.found.length + (st.found.indexOf(k) < 0 ? 1 : 0), T = MV.C.task;
      T.after3 = n >= 4 ? T.afterAll : "";
      if (T._more == null) T._more = T.more;
      T.more = n >= 4 ? "You’ve found all four answers." : T._more;
      return k;
    },
    label:function(k){ var p = k.split(","); return MV.m("k = " + p[0]) + ", " + MV.m("m = " + p[1]); },
    text:function(k){ var p = k.split(","); return "k = " + p[0] + ", m = " + p[1]; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
