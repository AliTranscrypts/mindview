// MHF4U 07 Transformations of Power Functions: hero storyboard, key-point mapper (Explore, with an Inside-out mode),
// "Order matters" card sequencer (Part 3), "Find the parameters" boxes (Practice 2), "Logo through the origin" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, m = MV.m;

// ---------- numbers ----------
function z(v){ return Math.abs(v) < 1e-9; }
function near(a, b){ return Math.abs(a - b) < 1e-9; }
function isInt(v){ return near(v, Math.round(v)); }
function fracParts(v){ var x = Math.abs(v); for (var q = 2; q <= 12; q++) { var p = Math.round(x * q); if (near(p / q, x)) return [p, q]; } return null; }
// plain text: integers, halves, quarters, eighths as decimals; thirds and the like as a/b; anything else to 2 dp
function fx(v){
  if (isInt(v * 8)) return num(v, 3);
  var f = fracParts(v); if (f) return (v < 0 ? MV.MINUS : "") + f[0] + "/" + f[1];
  return num(v, 2);
}
// m() source for a value: integers as they are, other simple rationals stacked ({1}/{2})
function ms(v){
  if (isInt(v)) return String(Math.round(v));
  var f = fracParts(v); if (f) return (v < 0 ? "-" : "") + "{" + f[0] + "}/{" + f[1] + "}";
  return String(Math.round(v * 100) / 100);
}
function lerp(a, b, t){ return a + (b - a) * t; }

// ---------- equations in parameter colours (m() source) ----------
function coefA(a){ return near(a, 1) ? "" : "@a{" + (near(a, -1) ? "-" : ms(a)) + "}"; }
function tail(c){ return z(c) ? "" : (c > 0 ? " + " : " - ") + "@c{" + ms(Math.abs(c)) + "}"; }
// y = a[k(x − d)]^n + c, with k = 1 hiding the inner factor and d = 0 writing x
function eqSrc(P){
  var inner = z(P.d) ? "x" : "x " + (P.d > 0 ? "- " : "+ ") + "@d{" + ms(Math.abs(P.d)) + "}", base;
  if (near(P.k, 1)) base = z(P.d) ? "x" : "(" + inner + ")";
  else { var kk = "@k{" + (near(P.k, -1) ? "-" : ms(P.k)) + "}"; base = z(P.d) ? "(" + kk + "x)" : "[" + kk + "(" + inner + ")]"; }
  return "y = " + coefA(P.a) + base + "^{@n{" + P.n + "}}" + tail(P.c);
}
// unfactored bracket (px + q): p does the job of k (orange); q is a plain coefficient
function bracketSrc(p, q){
  if (near(p, 1) && z(q)) return "x";
  var s = (near(p, 1) ? "" : "@k{" + (near(p, -1) ? "-" : ms(p)) + "}") + "x";
  if (!z(q)) s += (q > 0 ? " + " : " - ") + ms(Math.abs(q));
  return "(" + s + ")";
}
function rawEqSrc(n, a, p, q, c){ return "y = " + coefA(a) + bracketSrc(p, q) + "^{@n{" + n + "}}" + tail(c); }
// (x, y) → (x/k + d, ay + c)
function ruleSrc(P){
  var h = 1 / P.k, xs;
  if (isInt(h)) xs = (near(h, 1) ? "" : near(h, -1) ? "@k{-}" : "@k{" + Math.round(h) + "}") + "x";
  else if (isInt(P.k)) xs = (P.k < 0 ? "@k{-}" : "") + "{x}/{@k{" + Math.abs(Math.round(P.k)) + "}}";
  else { var f = fracParts(h); xs = f ? (h < 0 ? "@k{-}" : "") + "{@k{" + f[0] + "}x}/{@k{" + f[1] + "}}" : "@k{" + ms(h) + "}x"; }
  if (!z(P.d)) xs += (P.d > 0 ? " + " : " - ") + "@d{" + ms(Math.abs(P.d)) + "}";
  var ys = (near(P.a, 1) ? "" : "@a{" + (near(P.a, -1) ? "-" : ms(P.a)) + "}") + "y" + tail(P.c);
  return "(x, y) -> (" + xs + ", " + ys + ")";
}
function cv(param, v){ return m("@" + param + "{" + ms(v) + "}"); }
// Description: stretches and reflections first, then translations
function descHTML(P){
  var A = Math.abs(P.a), K = Math.abs(P.k), v = [], h = [], t = [], first = [];
  if (A > 1 + 1e-9) v.push("vertical stretch by a factor of " + cv("a", A)); else if (A < 1 - 1e-9) v.push("vertical compression by a factor of " + cv("a", A));
  if (P.a < 0) v.push("reflection in the " + m("x") + "-axis");
  if (K > 1 + 1e-9) h.push("horizontal compression by a factor of " + cv("k", 1 / K)); else if (K < 1 - 1e-9) h.push("horizontal stretch by a factor of " + cv("k", 1 / K));
  if (P.k < 0) h.push("reflection in the " + m("y") + "-axis" + (P.n === 4 ? " (no visible change: " + m("x^4") + " is even)" : ""));
  if (v.length) first.push(v.join(" and "));
  if (h.length) first.push(h.join(" and "));
  if (!z(P.d)) t.push(cv("d", Math.abs(P.d)) + (P.d > 0 ? " right" : " left"));
  if (!z(P.c)) t.push(cv("c", Math.abs(P.c)) + (P.c > 0 ? " up" : " down"));
  var s = first.join("; ");
  if (t.length) s += (s ? "; then " : "") + t.join(" and ");
  if (!s) return "No change: this is the parent " + m("y = x^{@n{" + P.n + "}}") + ".";
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
function keyName(n){ return n === 4 ? "Vertex" : "Point of inflection"; }
function kpHTML(P){ return keyName(P.n) + " " + m("(@d{" + ms(P.d) + "}, @c{" + ms(P.c) + "})"); }
function rangeHTML(P){
  return m("{x ∈ ℝ}") + "; " + (P.n === 3 ? m("{y ∈ ℝ}") : m("{y ∈ ℝ | y " + (P.a > 0 ? "≥" : "≤") + " @c{" + ms(P.c) + "}}"));
}
function endInfo(P){
  var s = P.a * Math.pow(P.k, P.n);
  if (P.n % 2) return s > 0 ? { q:"Q3 to Q1", l:"-∞", r:"∞", w:"Falls to the left, rises to the right" } : { q:"Q2 to Q4", l:"∞", r:"-∞", w:"Rises to the left, falls to the right" };
  return s > 0 ? { q:"Q2 to Q1", l:"∞", r:"∞", w:"Both arms point up" } : { q:"Q3 to Q4", l:"-∞", r:"-∞", w:"Both arms point down" };
}
function endHTML(P){ var e = endInfo(P); return '<span class="qpath">' + e.q + '</span><br><span class="tiny muted">As ' + m("x → -∞") + ", " + m("y → " + e.l) + ", and as " + m("x → ∞") + ", " + m("y → " + e.r) + ".</span>"; }
function describe(P, extra){
  var e = endInfo(P);
  return "Graph of " + MV.plain(m(eqSrc(P))) + ", " + keyName(P.n).toLowerCase() + " (" + fx(P.d) + ", " + fx(P.c) + "). " + e.w + ", " + e.q + "." + (extra || "");
}
function fnOf(P){ return function(x){ return P.a * Math.pow(P.k * (x - P.d), P.n) + P.c; }; }
function ptLab(x, y){ return "(" + fx(x) + ", " + fx(y) + ")"; }

// ---------- hero: x³ → stretch → squeeze → slide → lift, each step leaving a faded copy ----------
function hero(f){
  var ST = [{ a:1, k:1, d:0, c:0 }, { a:2, k:1, d:0, c:0 }, { a:2, k:2, d:0, c:0 }, { a:2, k:2, d:2, c:0 }, { a:2, k:2, d:2, c:3 }].map(function(s){ return Object.assign({ n:3 }, s); });
  var V = { xmin:-4, xmax:6, ymin:-10, ymax:12 }, p = new MV.Plot(f.canvas, V), RM = MV.reduceMotion;
  var H = { stage:RM ? 4 : 0, P:ST[RM ? 4 : 0], reveal:RM ? 1 : 0, capAt:RM ? 4 : 0 };
  p.render = function(){
    var curves = [], ink2 = css("--ink-2"), P = H.P;
    for (var i = 0; i < H.stage; i++) curves.push({ f:fnOf(ST[i]), color:ink2, width:2, alpha:0.45, dash:i === 0 ? [6, 6] : null });
    if (H.reveal > 0) curves.push({ f:fnOf(P), color:css("--pen"), width:3.2, arrows:H.reveal >= 1, domain:[V.xmin - 0.5, V.xmin - 0.5 + (V.xmax - V.xmin + 1) * H.reveal] });
    var pts = H.reveal >= 1 ? [-1, 0, 1].map(function(u){ var x = u / P.k + P.d, y = P.a * u * u * u + P.c; return { x:x, y:y, r:u === 0 ? 6 : 4.5, color:css("--ink"), label:u === 0 ? ptLab(x, y) : null, below:true }; }) : [];
    p.draw({ curves:curves, points:pts, describe:"Graph of " + MV.plain(m(eqSrc(ST[H.capAt]))) + (H.stage ? ", with a faded copy of each earlier step" : "") + ". Key points shown." });
  };
  function cap(s){ H.capAt = s; f.cap.innerHTML = m(eqSrc(ST[s])); }
  cap(H.capAt); p.render();
  if (RM) return;
  function step(s){
    if (s > 4) return;
    var from = H.P, to = ST[s]; H.stage = s;
    MV.tween({ dur:1000, step:function(t){ H.P = { n:3, a:lerp(from.a, to.a, t), k:lerp(from.k, to.k, t), d:lerp(from.d, to.d, t), c:lerp(from.c, to.c, t) }; p.render(); },
      done:function(){ H.P = to; cap(s); p.render(); MV.wait(700, function(){ step(s + 1); }); } });
  }
  MV.tween({ dur:1200, ease:function(t){ return t; }, step:function(t){ H.reveal = t; p.render(); }, done:function(){ H.reveal = 1; p.render(); MV.wait(800, function(){ step(1); }); } });
}

// ---------- Explore: key-point mapper ----------
// @component N9+N14 keyPointMapper — power-function transformer with sliders, mapping table, arrows, Inside-out (px + q) mode
var VIEW = { xmin:-8, xmax:8, ymin:-20, ymax:20 }, KU = [-2, -1, 0, 1, 2];
function explore(host, api){
  var S = api.S, C = api.content, CH = {};
  (C.challenges || []).forEach(function(c){ CH[c.id] = c; });
  var DEF = { n:3, a:1, k:1, d:0, c:0, mode:"map", p:2, q:-6, arrows:"off", tgt:"none", all:false };
  Object.keys(DEF).forEach(function(k){ if (S[k] == null) S[k] = DEF[k]; });
  var O = { hl:null, trail:null, h:null }, busy = false;
  var L = MV.pgLayout(host, { aria:"Graph of the transformed power function" });
  var plot = new MV.Plot(L.canvas, VIEW);
  var leg = document.createElement("p"); leg.className = "kp-leg tiny muted";
  leg.innerHTML = '<span><i class="ln par"></i>parent</span><span><i class="ln cur"></i>your graph</span><span><i class="ln tg"></i>challenge target</span><span><i class="dt"></i>key points</span>';
  L.graph.appendChild(leg);
  L.ctrl.innerHTML = '<div id="kp-n"></div><div id="kp-mode"></div><div id="kp-sa" class="kp-sl"></div><div id="kp-kd" class="kp-sl"></div><div id="kp-pq" hidden></div><div id="kp-sc" class="kp-sl"></div>' +
    '<div id="kp-arr"></div><div id="kp-tgt"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="kp-reset">Reset</button></div>';
  var tbl = document.createElement("div"); tbl.className = "kp-tbl"; L.read.parentNode.appendChild(tbl);
  function onSl(id, v){ S[id] = v; userChange(); }
  var sl = {};
  sl.a = MV.sliders($("#kp-sa", host), [{ id:"a", param:"a", label:m("@a{a}") + " · vertical stretch", min:-3, max:3, step:0.25, value:S.a, skip:[0], fmt:fx }], onSl);
  sl.kd = MV.sliders($("#kp-kd", host), [
    { id:"k", param:"k", label:m("@k{k}") + " · horizontal compression", min:-3, max:3, step:0.25, value:S.k, skip:[0], fmt:fx },
    { id:"d", param:"d", label:m("@d{d}") + " · horizontal shift", min:-5, max:5, step:0.5, value:S.d, fmt:fx }], onSl);
  sl.c = MV.sliders($("#kp-sc", host), [{ id:"c", param:"c", label:m("@c{c}") + " · vertical shift", min:-8, max:8, step:0.5, value:S.c, fmt:fx }], onSl);
  var segN = MV.seg($("#kp-n", host), { label:"Parent:", value:String(S.n), options:[{ id:"3", t:m("y = x^{@n{3}}") }, { id:"4", t:m("y = x^{@n{4}}") }], onChange:function(v){ S.n = +v; userChange(); } });
  var segM = MV.seg($("#kp-mode", host), { label:"Mode:", value:S.mode, options:[{ id:"map", t:"Mapper" }, { id:"io", t:"Inside out" }], onChange:function(v){ S.mode = v; if (v === "io") factorAnim(); userChange(); } });
  var segA = MV.seg($("#kp-arr", host), { label:"Mapping arrows:", value:S.arrows, options:[{ id:"off", t:"Off" }, { id:"on", t:"Show arrows" }], onChange:function(v){ S.arrows = v; userChange(); } });
  var segT = MV.seg($("#kp-tgt", host), { label:"Show a target:", value:S.tgt, options:[{ id:"none", t:"None" }, { id:"1", t:"1" }, { id:"2", t:"2" }, { id:"3", t:"3" }], onChange:function(v){ S.tgt = v; api.save(); draw(); } });
  // Inside-out steppers for the bracket (px + q)
  var pq = $("#kp-pq", host);
  pq.innerHTML = '<p class="tiny muted kp-pq-note">Inside out: build the bracket ' + m("(@k{p}x + q)") + " and watch it factor into " + m("@k{p}(x - @d{d})") + ".</p>" +
    '<div class="stp-row">' + stp("p", m("@k{p}"), "coefficient of x") + stp("q", m("q"), "constant") + '</div><p class="fx-strip" id="kp-fx" aria-live="polite"></p>';
  function stp(id, lab, what){
    return '<div class="stp"><span class="stp-l">' + lab + ' <span class="tiny muted">(' + what + ')</span></span><button type="button" class="btn ghost sm" data-stp="' + id + '" data-dir="-1" data-k="stp' + id + 'm" aria-label="Decrease ' + id + '">−</button>' +
      '<output class="stp-v" id="kp-' + id + '-v"></output><button type="button" class="btn ghost sm" data-stp="' + id + '" data-dir="1" data-k="stp' + id + 'p" aria-label="Increase ' + id + '">+</button></div>';
  }
  pq.addEventListener("click", function(e){
    var b = e.target.closest("[data-stp]"); if (!b) return;
    var id = b.dataset.stp, dir = +b.dataset.dir, v = S[id] + dir;
    if (id === "p") { if (v === 0) v += dir; if (v < -4 || v > 4) return; }
    else if (v < -12 || v > 12) return;
    S[id] = v; factorAnim(); userChange();
  });
  var fxT = [];
  function factorAnim(){
    fxT.forEach(clearTimeout); fxT = [];
    var el = $("#kp-fx", host), p = S.p, q = S.q, d = -q / p;
    var fac = (near(p, 1) ? "" : "@k{" + (near(p, -1) ? "-" : p) + "}") + "(" + (z(d) ? "x" : "x " + (d > 0 ? "- " : "+ ") + "@d{" + ms(Math.abs(d)) + "}") + ")";
    var raw = bracketSrc(p, q); if (raw === "x") raw = "(x)";
    el.innerHTML = '<span class="fx1">' + m(raw) + '</span> <span class="fx2">= ' + m(fac) + '</span><br><span class="fx3">so ' + m("@k{k} = p = " + p) + " and " + m("@d{d} = -{q}/{p} = " + ms(d)) + "</span>";
    var s2 = el.querySelector(".fx2"), s3 = el.querySelector(".fx3");
    if (MV.reduceMotion) { s2.classList.add("on"); s3.classList.add("on"); return; }
    fxT.push(setTimeout(function(){ s2.classList.add("on"); }, 500), setTimeout(function(){ s3.classList.add("on"); }, 1200));
  }
  $("#kp-reset", host).addEventListener("click", function(){ S.a = 1; S.k = 1; S.d = 0; S.c = 0; if (S.mode === "io") { S.p = 1; S.q = 0; factorAnim(); } userChange(); });
  tbl.addEventListener("click", function(e){ if (e.target.closest("[data-all]")) { S.all = !S.all; api.save(); MV.keepFocus(tbl, function(){ tbl.innerHTML = tableHTML(eff()); }); } });
  // clicking anything in a challenge card shows that challenge's target on the graph
  var chalBox = $("#chal");
  if (chalBox) chalBox.addEventListener("click", function(e){ var c = e.target.closest("[data-c]"); if (!c) return; var t = c.dataset.c.replace("tc", ""); if (S.tgt !== t) { S.tgt = t; segT.set(t); api.save(); draw(); } }, true);

  function eff(){ var P = { n:S.n, a:S.a, k:S.k, d:S.d, c:S.c }; if (S.mode === "io") { P.k = S.p; P.d = -S.q / S.p; } return P; }
  function userChange(){ if (!busy) { O.hl = null; O.trail = null; } api.save(); paint(); MV.changed(); }

  function tableHTML(P){
    var h = O.h != null ? O.h : 1 / P.k;
    var head = [m("x"), m("y"), m("x/@k{k} + @d{d}"), m("@a{a}y + @c{c}")];
    var rows = KU.map(function(u){
      var y = Math.pow(u, P.n), cls = (Math.abs(u) === 2 ? "kp-x" : "") + (O.hl === u ? " hl" : "");
      return '<tr class="' + cls + '"><td>' + fx(u) + "</td><td>" + fx(y) + "</td><td>" + fx(h * u + P.d) + "</td><td>" + fx(P.a * y + P.c) + "</td></tr>";
    }).join("");
    return '<h4 class="kp-th">Mapping table</h4><div class="tbl-wrap"><table class="vt"><caption class="vh">Key points of the parent and where they go</caption><thead><tr>' + head.map(function(c){ return '<th scope="col">' + c + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows + '</tbody></table></div><button type="button" class="btn ghost sm kp-all" data-all="1" data-k="kpall" aria-pressed="' + !!S.all + '">' + (S.all ? "Show 3 key points" : "Show all 5") + "</button>";
  }
  function readout(P){
    var rows = [];
    if (S.mode === "io") rows.push(["Equation", m(rawEqSrc(P.n, P.a, S.p, S.q, P.c)) + "<br>= " + m(eqSrc(P))], ["From the bracket", m("@k{k} = p = " + S.p) + " and " + m("@d{d} = -{q}/{p} = " + ms(P.d))]);
    else rows.push(["Equation", m(eqSrc(P))]);
    rows.push(["Description", descHTML(P)], ["Mapping rule", m(ruleSrc(P))], ["Key point", kpHTML(P)], ["Domain / range", rangeHTML(P)], ["End behaviour", endHTML(P)]);
    return MV.readoutHTML(rows);
  }
  function foldPts(P, h){
    var U = Math.min(400, (Math.max(Math.abs(VIEW.xmin - P.d), Math.abs(VIEW.xmax - P.d)) + 1) / Math.max(Math.abs(h), 0.02)), N = 1400, out = [];
    for (var i = 0; i <= N; i++) { var s = -1 + 2 * i / N, u = U * s * Math.abs(s); out.push([h * u + P.d, P.a * Math.pow(u, P.n) + P.c]); }
    return out;
  }
  function targetScene(){
    var out = { points:[], curve:null }, ch = S.tgt === "none" ? null : CH["tc" + S.tgt];
    if (!ch || !ch.target) return out;
    var t = ch.target, ink = css("--ink");
    if (t.n) out.curve = { f:fnOf(t), color:ink, width:2.2, dash:[12, 7] };
    (t.pts || []).forEach(function(q){ out.points.push({ x:q[0], y:q[1], r:8, open:true, color:ink, label:ptLab(q[0], q[1]) }); });
    return out;
  }
  function draw(){
    var P = eff(), h = O.h != null ? O.h : 1 / P.k, ink2 = css("--ink-2"), ink = css("--ink"), pen = css("--pen");
    var curves = [{ f:function(x){ return Math.pow(x, P.n); }, color:ink2, width:2, dash:[6, 6], alpha:0.6 }];
    var T = targetScene(); if (T.curve) curves.push(T.curve);
    curves.push(O.h != null ? { pts:foldPts(P, h), color:pen, width:3.2, arrows:true } : { f:fnOf(P), color:pen, width:3.2, arrows:true });
    var pts = [], segs = [];
    KU.forEach(function(u){
      var y0 = Math.pow(u, P.n), X = h * u + P.d, Y = P.a * y0 + P.c;
      pts.push({ x:u, y:y0, r:3.2, color:ink2 });
      if ((S.arrows === "on" || (O.hl === u && !O.trail)) && Math.hypot(X - u, Y - y0) > 1e-6) segs.push({ x1:u, y1:y0, x2:X, y2:Y, color:ink2, width:1.8, arrow:true });
    });
    if (O.trail) {
      var wp = O.trail.concat([[h * 1 + P.d, P.a + P.c]]);
      for (var i = 1; i < wp.length; i++) if (Math.hypot(wp[i][0] - wp[i - 1][0], wp[i][1] - wp[i - 1][1]) > 1e-6) segs.push({ x1:wp[i - 1][0], y1:wp[i - 1][1], x2:wp[i][0], y2:wp[i][1], color:ink2, width:2, arrow:true });
    }
    var clearBelow = P.a * Math.pow(O.h != null ? 1 / O.h : P.k, P.n) > 0;
    KU.forEach(function(u){
      var X = h * u + P.d, Y = P.a * Math.pow(u, P.n) + P.c, hl = O.hl === u;
      pts.push({ x:X, y:Y, r:u === 0 ? 6 : 4.5, color:ink, ring:hl, label:(u === 0 || hl) ? ptLab(X, Y) : null, below:u === 0 ? clearBelow : false });
    });
    var tg = S.tgt !== "none" && CH["tc" + S.tgt] ? " Target for challenge " + S.tgt + " shown." : "";
    plot.draw({ view:VIEW, curves:curves, segments:segs, points:T.points.concat(pts), describe:describe(P, " The parent y = x" + (P.n === 3 ? "³" : "⁴") + " is dashed." + tg) });
  }
  plot.render = draw;
  function paint(){
    var P = eff();
    sl.a.set("a", S.a); sl.kd.set("k", S.k); sl.kd.set("d", S.d); sl.c.set("c", S.c);
    $("#kp-kd", host).hidden = S.mode === "io"; pq.hidden = S.mode !== "io";
    $("#kp-p-v", host).textContent = num(S.p); $("#kp-q-v", host).textContent = num(S.q);
    L.cap.innerHTML = S.mode === "io" ? m(rawEqSrc(P.n, P.a, S.p, S.q, P.c)) : m(eqSrc(P));
    L.read.innerHTML = readout(P);
    MV.keepFocus(tbl, function(){ tbl.innerHTML = tableHTML(P); });
    tbl.classList.toggle("all", !!S.all);
    draw();
  }
  // ---------- predictions ----------
  function setState(st){
    S.mode = "map"; segM.set("map"); S.n = st.n; segN.set(String(st.n));
    S.a = st.a; S.k = st.k; S.d = st.d; S.c = st.c;
    S.arrows = "off"; segA.set("off"); S.tgt = "none"; segT.set("none");
    O = { hl:st.hl == null ? null : st.hl, trail:null, h:null };
    api.save(); paint(); MV.changed();
  }
  function tw(keys, to, dur, done){
    var from = keys.map(function(k){ return S[k]; });
    MV.tween({ dur:dur, step:function(t){ keys.forEach(function(k, i){ S[k] = lerp(from[i], to[i], t); }); paint(); },
      done:function(){ keys.forEach(function(k, i){ S[k] = to[i]; }); paint(); MV.changed(); if (done) done(); } });
  }
  function fold(done){
    MV.tween({ dur:1700, ease:function(t){ return t; }, step:function(t){ O.h = Math.cos(Math.PI * t); paint(); },
      done:function(){ O.h = null; S.k = -1; paint(); MV.changed(); done(); } });
  }
  paint();
  if (S.mode === "io") factorAnim();
  return {
    predict:{
      start:function(p){ setState(p.start); },
      run:function(p, done){
        busy = true;
        var fin = function(){ busy = false; api.save(); MV.wait(250, done); };
        if (p.id === "p1") tw(["d"], [-3], 1400, fin);
        else if (p.id === "p2") tw(["k"], [2], 1400, fin);
        else if (p.id === "p3") {
          O.trail = [[1, 1]];
          tw(["a"], [2], 900, function(){ O.trail.push([1, 2]); MV.wait(300, function(){
            tw(["d"], [1], 800, function(){ O.trail.push([2, 2]); MV.wait(300, function(){ tw(["c"], [3], 800, fin); }); }); }); });
        } else if (p.id === "p4") {
          fold(function(){ MV.wait(1100, function(){ S.n = 3; segN.set("3"); S.k = 1; paint(); MV.wait(700, function(){ fold(fin); }); }); });
        } else fin();
      }
    },
    challenge:function(id){
      var P = eff(), F = (C.chalFb || {})[id] || {};
      var fill = function(s, o){ return String(s || "").replace(/\{(\w)\}/g, function(_, k){ return o[k]; }); };
      var at = function(){ return "(" + fx(P.d) + ", " + fx(P.c) + ")"; };
      if (id === "tc1") {
        if (P.n === 3 && near(P.a, 1) && near(P.k, 1) && near(P.d, -2) && near(P.c, 5)) return { ok:true };
        if (P.n !== 3) return { ok:false, msg:"This challenge moves " + m("y = x^3") + ". Choose that parent." };
        if (!near(P.a, 1) || !near(P.k, 1)) return { ok:false, msg:F.stretch };
        if (near(P.d, 2)) return { ok:false, msg:fill(F.d2, { c:fx(P.c) }) };
        if (near(P.c, -5)) return { ok:false, msg:F.cm5 };
        return { ok:false, msg:"Your point of inflection is at " + at() + ". It needs to be at (−2, 5)." };
      }
      if (id === "tc2") {
        var s = P.a * Math.pow(P.k, 4);
        if (P.n === 4 && near(P.d, 3) && near(P.c, 4) && near(s, -2)) return { ok:true };
        if (P.n !== 4) return { ok:false, msg:"The target is a quartic. Choose the parent " + m("y = x^4") + "." };
        if (near(P.d, -3)) return { ok:false, msg:fill(F.dm3, { c:fx(P.c) }) };
        if (s > 0) return { ok:false, msg:F.apos };
        if (near(P.d, 3) && near(P.c, 4)) return { ok:false, msg:fill(F.value, { v:fx(s + 4) }) };
        return { ok:false, msg:"Your vertex is at " + at() + ". The target’s vertex is (3, 4)." };
      }
      if (id === "tc3") {
        var s3 = P.a * Math.pow(P.k, 3), f = fnOf(P);
        if (P.n === 3 && near(P.d, 2) && near(P.c, 4) && near(s3, 8)) return { ok:true };
        if (P.n !== 3) return { ok:false, msg:"This challenge uses " + m("y = x^3") + ". Choose that parent." };
        if (near(P.a, 3) && near(P.k, 1)) return { ok:false, msg:F.a3 };
        if (near(P.d, 1) || near(P.d, 3)) return { ok:false, msg:F.d13 };
        return { ok:false, msg:"At " + m("x") + " = 1, 2 and 3 your graph is at " + fx(f(1)) + ", " + fx(f(2)) + " and " + fx(f(3)) + ". You need −4, 4 and 12." };
      }
      return { ok:false };
    }
  };
}

// ---------- Part 3: Order matters ----------
// @component N5+N13 transformSequencer — order transformation cards, step through them on a graph, check against a target
var P3VIEW = { r1:{ xmin:-4, xmax:4, ymin:-10, ymax:10 }, r2:{ xmin:-3, xmax:10, ymin:-8, ymax:8 }, r3:{ xmin:-8, xmax:3, ymin:-8, ymax:7 } };
var ID = { sx:1, tx:0, sy:1, ty:0 };
function applyCard(s, c){ var sx = c.sx || 1, tx = c.tx || 0, sy = c.sy || 1, ty = c.ty || 0; return { sx:sx * s.sx, tx:sx * s.tx + tx, sy:sy * s.sy, ty:sy * s.ty + ty }; }
function compose(cards){ return cards.reduce(applyCard, ID); }
function sameState(a, b){ return near(a.sx, b.sx) && near(a.tx, b.tx) && near(a.sy, b.sy) && near(a.ty, b.ty); }
function targetState(t){ return { sx:1 / t.k, tx:t.d, sy:t.a, ty:t.c }; }
function paramsOf(s, n){ return { n:n, a:s.sy, k:1 / s.sx, d:s.tx, c:s.ty }; }
function stepEq(s, n){
  var P = paramsOf(s, n), p = 1 / s.sx, q = -s.tx / s.sx, fac = eqSrc(P);
  return m(!near(p, 1) && !z(q) ? rawEqSrc(n, P.a, p, q, P.c) + " = " + fac.slice(4) : fac);
}
function part3(host, api){
  var R = api.content.rounds, S = api.S;
  S.r = S.r || 0; S.seq = S.seq || {}; S.solved = S.solved || {};
  var paths = {}, sel = null, fb = null, disp = ID, shown = 0, anim = null, player = null;
  function cardOf(r, id){ return r.cards.filter(function(c){ return c.id === id; })[0]; }
  R.forEach(function(r){
    var out = [], tgt = targetState(r.target);
    (function rec(seq, used){
      if (seq.length && sameState(compose(seq.map(function(id){ return cardOf(r, id); })), tgt)) out.push(seq.slice());
      r.cards.forEach(function(c){ if (used[c.id]) return; used[c.id] = 1; seq.push(c.id); rec(seq, used); seq.pop(); used[c.id] = 0; });
    })([], {});
    paths[r.id] = out;
  });
  host.innerHTML = '<div class="sym om">' +
    '<div><div class="chips" id="om-r" role="group" aria-label="Choose a round"></div><p class="om-target" id="om-tgt"></p>' +
    '<div class="plot-wrap"><canvas class="plot" id="om-plot" role="img" aria-label="Order matters graph"></canvas></div>' +
    '<p class="kp-leg tiny muted"><span><i class="ln par"></i>parent</span><span><i class="ln tg"></i>target</span><span><i class="ln cur"></i>your graph</span><span><i class="dt cr"></i>trail of the key point</span></p>' +
    '<div id="om-player"></div><p class="om-now" id="om-now" aria-live="polite"></p><div id="om-keys"></div></div>' +
    '<div><h3>Cards</h3><p class="tiny muted">Tap a card to add it to your sequence. Not every card is needed.</p><div class="om-tray" id="om-tray" role="group" aria-label="Card tray"></div>' +
    '<h3 class="om-h">Your sequence</h3><ol class="olist" id="om-seq" aria-label="Your sequence"></ol>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="om-check" data-k="omchk">Check</button><button type="button" class="btn ghost sm" id="om-clear" data-k="omclr">Clear</button></div>' +
    '<div id="om-fb" aria-live="polite"></div><details class="alg" id="om-alg"></details></div></div>';
  var plot = new MV.Plot($("#om-plot", host), P3VIEW.r1);
  function rd(){ return R[S.r] || R[0]; }
  function seq(){ var r = rd(); return S.seq[r.id] || (S.seq[r.id] = []); }
  function stateAt(i){ var r = rd(); return compose(seq().slice(0, i).map(function(id){ return cardOf(r, id); })); }
  plot.render = function(){
    var r = rd(), n = r.n, ink2 = css("--ink-2"), ink = css("--ink"), pen = css("--pen"), cur = disp;
    var fOf = function(s){ return function(x){ return s.sy * Math.pow((x - s.tx) / s.sx, n) + s.ty; }; };
    var curves = [{ f:function(x){ return Math.pow(x, n); }, color:ink2, width:2, dash:[6, 6], alpha:0.6 }, { f:fOf(targetState(r.target)), color:ink, width:2.2, dash:[12, 7] }, { f:fOf(cur), color:pen, width:3.2, arrows:true }];
    var crumbs = [], segs = [], pts = [];
    for (var i = 0; i <= Math.min(shown, seq().length); i++) { var s = stateAt(i); crumbs.push([s.tx, s.ty]); }
    crumbs.forEach(function(c, j){
      if (j && Math.hypot(c[0] - crumbs[j - 1][0], c[1] - crumbs[j - 1][1]) > 1e-6) segs.push({ x1:crumbs[j - 1][0], y1:crumbs[j - 1][1], x2:c[0], y2:c[1], color:ink2, width:1.6, dash:[3, 4], arrow:true });
      pts.push({ x:c[0], y:c[1], r:3.5, color:ink2 });
    });
    [-1, 0, 1].forEach(function(u){ var X = cur.sx * u + cur.tx, Y = cur.sy * Math.pow(u, n) + cur.ty; pts.push({ x:X, y:Y, r:u === 0 ? 6 : 4.5, color:ink, label:u === 0 ? ptLab(X, Y) : null, below:cur.sy > 0 }); });
    plot.draw({ view:P3VIEW[r.id], curves:curves, segments:segs, points:pts,
      describe:"Round " + (S.r + 1) + ". Target " + MV.plain(r.eq) + ", dashed. Your graph is now " + MV.plain(stepEq(cur, n)) + ", with the " + (n === 4 ? "vertex" : "point of inflection") + " at " + ptLab(cur.tx, cur.ty) + "." });
  };
  function now(i){
    var r = rd(), sq = seq();
    $("#om-now", host).innerHTML = (i === 0 ? "Start: " : "After step " + i + ": ") + stepEq(stateAt(i), r.n);
  }
  function goTo(i){
    if (anim) { anim(); anim = null; }
    var from = disp, to = stateAt(i);
    if (i < shown) shown = i;
    if (MV.reduceMotion || sameState(from, to)) { disp = to; shown = i; plot.render(); now(i); return; }
    anim = MV.tween({ dur:850, step:function(t){ disp = { sx:lerp(from.sx, to.sx, t), tx:lerp(from.tx, to.tx, t), sy:lerp(from.sy, to.sy, t), ty:lerp(from.ty, to.ty, t) }; plot.render(); },
      done:function(){ anim = null; disp = to; shown = i; plot.render(); now(i); } });
  }
  function makePlayer(){
    var box = $("#om-player", host), fresh = document.createElement("div"), r = rd(), sq = seq().slice();
    box.innerHTML = ""; box.appendChild(fresh);
    if (anim) { anim(); anim = null; }
    disp = ID; shown = 0;
    player = MV.player(fresh, { count:sq.length + 1, interval:1300,
      label:function(i){ return i === 0 ? "Start: the parent" + (sq.length ? "" : ". Add cards to play them.") : "Step " + i + " of " + sq.length + ": " + MV.plain(cardOf(r, sq[i - 1]).t); },
      render:function(i){ goTo(i); } });
  }
  function missLines(r, sq){
    var P = paths[r.id], first = -1, lines = [];
    for (var i = 1; i <= sq.length && first < 0; i++) {
      var s = stateAt(i);
      if (!P.some(function(p){ return p.length >= i && sameState(compose(p.slice(0, i).map(function(id){ return cardOf(r, id); })), s); })) first = i;
    }
    if (first > 0) lines.push("Step " + first + " (" + cardOf(r, sq[first - 1]).t + ") is where your path leaves every correct path.");
    else lines.push("Every step so far fits a correct path, but you haven’t reached the target yet. Add another card.");
    var at = function(id){ return sq.indexOf(id); }, fin = stateAt(sq.length);
    var named = (r.named || []).filter(function(w){
      if (w.uses) return at(w.uses) >= 0;
      return at(w.first) >= 0 && at(w.then) >= 0 && at(w.first) < at(w.then) && (!w.without || at(w.without) < 0);
    })[0];
    if (named) lines.push(named.fb.replace("{v}", ptLab(fin.tx, fin.ty)));
    return lines;
  }
  function paintSide(){
    var r = rd(), sq = seq();
    MV.keepFocus(host, function(){
      $("#om-r", host).innerHTML = R.map(function(x, i){ return '<button type="button" class="chip' + (i === S.r ? " on" : "") + '" aria-pressed="' + (i === S.r) + '" data-round="' + i + '" data-k="omr' + i + '">Round ' + (i + 1) + (S.solved[x.id] ? " ✓" : "") + "</button>"; }).join("");
      $("#om-tgt", host).innerHTML = "Target: " + r.eq + ' <span class="tiny muted">(' + r.keyName + ")</span>";
      var order = MV.shuffle(r.cards.map(function(c){ return c.id; }), "om7" + r.id), tray = order.filter(function(id){ return sq.indexOf(id) < 0; });
      $("#om-tray", host).innerHTML = tray.length ? tray.map(function(id){ return '<button type="button" class="om-card" data-add="' + id + '" data-k="omadd' + id + '">' + cardOf(r, id).t + "</button>"; }).join("") : '<p class="tiny muted" style="margin:0">Every card is in your sequence.</p>';
      $("#om-seq", host).innerHTML = sq.length ? sq.map(function(id, i){
        var on = sel === i;
        return '<li><button type="button" class="ostep" aria-pressed="' + on + '" data-pos="' + i + '" data-k="ompos' + id + '"><span class="sn">' + (i + 1) + ".</span><span>" + cardOf(r, id).t + "</span></button>" +
          (on ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="omup"' + (i === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="omdown"' + (i === sq.length - 1 ? " disabled" : "") + '>Move down</button><button type="button" class="btn ghost" data-mv="out" data-k="omout">Remove</button></span>' : "") + "</li>";
      }).join("") : '<li class="om-empty tiny muted">No cards yet. Tap a card above to add it.</li>';
      var f = $("#om-fb", host);
      if (!fb) f.innerHTML = "";
      else if (fb.good) f.innerHTML = '<div class="fb good" role="status"><p><strong>✓ Target reached.</strong> Your graph lands on ' + r.eq + ".</p>" + (r.after ? "<p>" + r.after + "</p>" : "") + "</div>";
      else f.innerHTML = '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + fb.lines.join(" ") + "</p></div>";
      $("#om-keys", host).innerHTML = S.solved[r.id] ? '<div class="refresh"><h4>Key points to check</h4><p>' + r.keyPts + "</p></div>" : "";
      var alg = $("#om-alg", host), open = alg.open;
      alg.innerHTML = "<summary>Check it with algebra</summary><div class=\"alg-lines\"><div><small>Start:</small> " + m("y = x^{@n{" + r.n + "}}") + "</div>" +
        sq.map(function(id, i){ return "<div><small>" + (i + 1) + ". " + cardOf(r, id).t + ":</small> " + stepEq(stateAt(i + 1), r.n) + "</div>"; }).join("") + "</div>" +
        (sq.length ? "" : '<p class="tiny muted" style="margin:8px 0 0">Add cards to see the equation after each step.</p>');
      alg.open = open;
    });
  }
  function edited(){ fb = null; api.save(); makePlayer(); paintSide(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest("#om-player")) return;
    var sq = seq();
    if (b.dataset.round != null) { S.r = +b.dataset.round; sel = null; fb = null; api.save(); makePlayer(); paintSide(); return; }
    if (b.dataset.add) { sq.push(b.dataset.add); sel = null; edited(); return; }
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel = sel === p ? null : p; paintSide(); return; }
    if (b.dataset.mv && sel != null) {
      var i = sel;
      if (b.dataset.mv === "out") { sq.splice(i, 1); sel = null; }
      else { var j = b.dataset.mv === "up" ? i - 1 : i + 1; if (j < 0 || j >= sq.length) return; var t = sq[i]; sq[i] = sq[j]; sq[j] = t; sel = j; }
      edited(); return;
    }
    if (b.id === "om-clear") { S.seq[rd().id] = []; sel = null; edited(); return; }
    if (b.id === "om-check") {
      var r = rd();
      if (!sq.length) fb = { lines:["Add cards to your sequence first."] };
      else if (sameState(stateAt(sq.length), targetState(r.target))) { S.solved[r.id] = true; fb = { good:true }; }
      else fb = { lines:missLines(r, sq) };
      sel = null; api.save();
      if (player && sq.length) player.go(sq.length);
      paintSide(); MV.focusFb($("#om-fb", host));
    }
  });
  makePlayer(); paintSide();
}

// ---------- Practice 2: find the parameters (N4 parameter boxes) ----------
// @component N4 paramBoxes — labelled number boxes for a, k, d, c with per-box mistake feedback
function paramBoxes(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { vals:{}, tries:0, hint:0, solved:false, first:null }); }
  function ansHTML(it){ var A = MV.ans(it); return it.ask.map(function(p){ return m("@" + p + "{" + p + "} = " + ms(A[p])); }).join(", "); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-pi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag" title="Non-routine">★</span>' : "") + "</div>";
        h += '<div class="pbox-row">' + it.ask.map(function(p){
          return '<label class="pbox" for="pb-' + it.id + p + '"><span class="m"><i class="p-' + p + '">' + p + '</i> =</span><input id="pb-' + it.id + p + '" class="numin short" type="text" autocomplete="off" spellcheck="false" data-k="pb' + it.id + p + '" data-pi="' + it.id + '" data-pp="' + p + '" value="' + MV.esc(x.vals[p] || "") + '"' + (x.solved ? " disabled" : "") + "></label>";
        }).join("") + "</div>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + ansHTML(it) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.pp) return; ist(t.dataset.pi).vals[t.dataset.pp] = t.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.pp) { var b = host.querySelector('[data-k="' + e.target.dataset.pi + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-pi]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.pi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act !== "check") return;
    var A = MV.ans(it), bad = [], fbs = [], empty = false;
    it.ask.forEach(function(p){
      var r = MV.parseNum(x.vals[p]);
      if (!r || r.length !== 1) { empty = true; return; }
      if (Math.abs(r[0] - A[p]) > 1e-6) {
        bad.push(p);
        var w = ((it.wrong || {})[p] || []).filter(function(w){ return Math.abs(w.v - r[0]) < 1e-6; })[0];
        if (w) fbs.push(w.fb);
      }
    });
    if (empty) msgs[it.id] = "Enter a number in " + (it.ask.length > 1 ? "every box" : "the box") + ", such as −2, 3 or 1/2.";
    else if (!bad.length) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (fbs.length ? fbs.join(" ") + " " : "") + "Check " + bad.map(function(p){ return m("@" + p + "{" + p + "}"); }).join(", ").replace(/, ([^,]*)$/, " and $1") + " again."; }
    api.save(); paint(); MV.focusFb(host.querySelector('[data-pi="' + it.id + '"].q'));
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = S.items[it.id]; if (x && x.solved) d++; if (x && x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = S.items[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: logo through the origin ----------
var task = (function(){
  var api, plot, LV = { xmin:-10, xmax:6, ymin:-16, ymax:12 };
  function read(){ var s = api ? api.S : {}; return { n:s.n || 3, a:s.a == null ? 1 : s.a, k:s.k == null ? 1 : s.k, d:s.d || 0, c:s.c || 0 }; }
  function at0(d){ return d.a * Math.pow(d.k * (0 - d.d), d.n) + d.c; }
  function draw(){
    var d = read();
    plot.draw({ view:LV, quads:true, shade:[2], curves:[{ f:fnOf(d), color:css("--pen"), width:3.2, arrows:true }],
      points:[{ x:0, y:0, r:8, open:true, color:css("--ink") }, { x:d.d, y:d.c, r:6, color:css("--ink"), label:ptLab(d.d, d.c) }],
      describe:"Your logo curve: " + describe(d, " At x = 0 the curve is at " + fx(at0(d)) + ". The origin is circled and quadrant 2 is shaded.") });
  }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S;
      if (S.n == null) { S.n = 3; S.a = 1; S.k = 1; S.d = 0; S.c = 0; }
      inp.innerHTML = '<p class="eq-cap lg-cap" id="lg-eq" aria-live="polite"></p><div id="lg-n"></div><div id="lg-sl" class="kp-sl"></div>';
      pv.innerHTML = '<canvas class="plot square" id="lg-plot" role="img" aria-label="Preview of your logo curve"></canvas>';
      plot = new MV.Plot($("#lg-plot"), LV); plot.render = draw;
      function upd(){ a.save(); $("#lg-eq").innerHTML = m(eqSrc(read())); draw(); a.update(); }
      MV.seg($("#lg-n"), { label:"Parent:", value:String(S.n), options:[{ id:"3", t:m("y = x^{@n{3}}") }, { id:"4", t:m("y = x^{@n{4}}") }], onChange:function(v){ S.n = +v; upd(); } });
      MV.sliders($("#lg-sl"), [
        { id:"ta", param:"a", label:m("@a{a}"), min:-3, max:3, step:0.25, value:S.a, skip:[0], fmt:fx },
        { id:"tk", param:"k", label:m("@k{k}"), min:-3, max:3, step:0.25, value:S.k, skip:[0], fmt:fx },
        { id:"td", param:"d", label:m("@d{d}"), min:-5, max:5, step:0.5, value:S.d, fmt:fx },
        { id:"tc", param:"c", label:m("@c{c}"), min:-8, max:8, step:0.5, value:S.c, fmt:fx }], function(id, v){ S[id.slice(1)] = v; upd(); });
      upd();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [d.d < 0 && d.c > 0, Math.abs(at0(d)) < 1e-9, d.n === 4 && d.a * d.c < 0, d.n === 4 && d.a < 0 && near(d.c, 8)]; },
    tips:function(d, c){ var T = MV.C.task.tips, out = []; c.forEach(function(ok, i){ if (!ok) out.push(String(T[i]).replace("{v}", fx(at0(d)))); }); return out; },
    key:function(d){ return [d.n, d.a, Math.abs(d.k), d.d, d.c].join("|"); },
    label:function(k){ var p = k.split("|").map(Number); return m(eqSrc({ n:p[0], a:p[1], k:p[2], d:p[3], c:p[4] })); },
    text:function(k){ var p = k.split("|").map(Number); return MV.plain(m(eqSrc({ n:p[0], a:p[1], k:p[2], d:p[3], c:p[4] }))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ params:paramBoxes },
  task:task
});
})();
