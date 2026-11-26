// SCH4U 10 Organic Reaction Mechanisms: hero (HBr adds to propene: curved arrows, carbocation, major and minor products),
// Reaction sorter and mechanism stepper (Explore: Sort / Mechanism (C3 stepper, Watch and Draw it) / Markovnikov lab),
// Reaction roadmap (Part 3: fill the map, plan a route on it, isotope evidence and atom economy), "Plan a synthesis" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function esc(s){ return MV.esc(s); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function cp(o){ return JSON.parse(JSON.stringify(o)); }
function find(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
// misconception sentences (plan §3; the same text is in content.mjs)
var M1 = "Arrows start at electrons (a bond or lone pair) and point to where they go.";

// @component radioGroup (from MHF4U 25, via SCH4U 01–06) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// @component C3 mechanismStepper (extends SCH4U 02's C3 player wrapper with a scene engine; the scene model is adapted from
// SCH4U 05's C1 esterStage) — curved-arrow mechanisms as SVG scenes: atoms or condensed groups as labels in the course role
// colours (C ink, O magenta, halogens teal), single and double bonds, lone pairs as violet dot pairs, formal charges (+ in ink on a
// --hi-soft badge, − in ink), partial charges (δ+ blue, δ− magenta), curved electron-pair arrows in --e-pair (tail at a bond, a
// lone pair or an atom; head at an atom or a bond; drawn progressively), glows, dashed isotope rings, tags and stability bars.
// Scenes morph by id (lone pairs ride on their atom; bonds, charges and orders fade). MS.stage: load(seq), show(i, {arrows}),
// arrows(i, done) draws a frame's arrows, play(from, to, onStep(k, phase), done) = morph to the next frame, then draw its arrows;
// pair(A, B, done) morphs two loose scenes. MV.tween throughout (reduced motion jumps to the end).
//   MS.sc() · put(s, id, t, el, x, y) · bond(s, a, b, order) · lp(s, id, node, deg) · chg(s, node, "+"|"−") · dl(s, node, "δ+"|"δ−", deg)
//   arrow(s, id, tail, head, bend): tail "b:a|b" | "l:lpId" | "n:id", head "n:id" | "b:a|b" · tag(s, id, t, x, y, {fs, col, bold, op, anc})
//   glow(s, node) · ring(s, node, label) · bar(s, id, {x, y, w, f, t, lo, hi}) · MS.svg(s, {arrows, ap}) · MS.mix(A, B, t) · MS.bbox([s]) · MS.fit(svg, [s])
//   C3.stepper(host, {steps, interval, label(i), onStep(i)}) -> {go(i), get(), count}: MV.player in a fresh child host
var MS = (function(){
  var FS = 20, HH = 11;
  var COL = { C:"var(--at-c)", H:"var(--ink)", O:"var(--at-o)", X:"var(--at-x)", N:"var(--at-n)", R:"var(--ink)", P:"var(--ink)" };
  function tw(t, fs){
    var w = 0, prev = "";
    String(t).replace(/\^[+\-−]|\d+|[\s\S]/g, function(s){
      if (s.charAt(0) === "^" && s.length > 1) w += 0.42 * fs;
      else if (/^\d/.test(s)) w += s.length * (/[A-Za-z)]$/.test(prev) ? 0.42 : 0.56) * fs;
      else w += (/[A-Z]/.test(s) ? 0.64 : /[a-z]/.test(s) ? 0.5 : /[()]/.test(s) ? 0.34 : s === " " ? 0.28 : 0.56) * fs;
      prev = s; return s;
    });
    return w;
  }
  function hw(t){ return tw(t, FS) / 2 + 1.5; }
  function tsp(t, fs){
    var out = "", base = 0, d = fs * 0.3, prev = "";
    String(t).replace(/\d+|[^\d]+/g, function(s){
      var dy, body = esc(s), size = "";
      if (/^\d/.test(s) && /[A-Za-z)]$/.test(prev)) { dy = d - base; base = d; size = r1(fs * 0.72); }
      else { dy = -base; base = 0; }
      out += "<tspan" + (Math.abs(dy) > 0.01 ? ' dy="' + r1(dy) + '"' : "") + (size ? ' font-size="' + size + '"' : "") + ">" + body + "</tspan>";
      prev = s; return s;
    });
    return out;
  }
  function key(a, b){ return a < b ? a + "|" + b : b + "|" + a; }
  function sc(){ return { n:{}, b:{}, lp:{}, chg:{}, dl:{}, ar:{}, tag:{}, glow:{}, ring:{}, bar:{} }; }
  function put(s, id, t, el, x, y){ s.n[id] = { t:t, el:el, x:x, y:y, op:1 }; }
  function bond(s, a, b, o){ s.b[key(a, b)] = { a:a, b:b, o:o || 1, xo:1, op:1 }; }
  function lp(s, id, node, deg){ s.lp[id] = { n:node, a:deg * Math.PI / 180, op:1 }; }
  function chg(s, node, sign){ s.chg[node] = { s:sign, op:1 }; }
  function dl(s, node, sign, deg){ s.dl[node] = { s:sign, a:deg * Math.PI / 180, op:1 }; }
  function arrow(s, id, tail, head, bend){ s.ar[id] = { tail:tail, head:head, bend:bend == null ? 0.35 : bend, op:1 }; }
  function tag(s, id, t, x, y, o){ o = o || {}; s.tag[id] = { t:t, x:x, y:y, fs:o.fs || 14, col:o.col || "var(--ink)", bold:!!o.bold, op:o.op == null ? 1 : o.op, anc:o.anc || "middle", nosub:!!o.nosub }; }
  function glow(s, node){ s.glow[node] = 1; }
  function ring(s, node, t){ s.ring[node] = { t:t || "", op:1 }; }
  function bar(s, id, o){ s.bar[id] = { x:o.x, y:o.y, w:o.w, f:o.f, t:o.t || "", lo:o.lo || "", hi:o.hi || "", op:o.op == null ? 1 : o.op }; }
  function clone(s){ return cp(s); }
  function rad(n, ux, uy){ var h = hw(n.t), ax = Math.abs(ux), ay = Math.abs(uy); return Math.min(ax > 1e-6 ? h / ax : 1e9, ay > 1e-6 ? HH / ay : 1e9); }
  function lpXY(s, k){ var L = s.lp[k], n = L && s.n[L.n]; if (!n) return null; var ux = Math.cos(L.a), uy = Math.sin(L.a), r = rad(n, ux, uy) + 6; return { x:n.x + ux * r, y:n.y + uy * r, ux:ux, uy:uy }; }
  function bondMid(s, ref){ var p = ref.split("|"), A = s.n[p[0]], B = s.n[p[1]]; return A && B ? { x:(A.x + B.x) / 2, y:(A.y + B.y) / 2 } : null; }
  function refPt(s, ref){ var ty = ref.charAt(0), k = ref.slice(2); if (ty === "b") return bondMid(s, k); if (ty === "l") return lpXY(s, k); var n = s.n[k]; return n ? { x:n.x, y:n.y } : null; }
  function ctrl(T, H, bend){ var dx = H.x - T.x, dy = H.y - T.y; return { x:(T.x + H.x) / 2 - dy * bend, y:(T.y + H.y) / 2 + dx * bend }; }
  function geo(s, A){
    var T0 = refPt(s, A.tail), H0 = refPt(s, A.head); if (!T0 || !H0) return null;
    var C = ctrl(T0, H0, A.bend), T, H, tt = A.tail.charAt(0), ht = A.head.charAt(0);
    var ux = C.x - T0.x, uy = C.y - T0.y, L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L;
    if (tt === "n") { var rT = rad(s.n[A.tail.slice(2)], ux, uy) + 3; T = { x:T0.x + ux * rT, y:T0.y + uy * rT }; }
    else T = { x:T0.x + ux * (tt === "b" ? 5 : 4), y:T0.y + uy * (tt === "b" ? 5 : 4) };
    var vx = C.x - H0.x, vy = C.y - H0.y, M = Math.hypot(vx, vy) || 1; vx /= M; vy /= M;
    if (ht === "n") { var rH = rad(s.n[A.head.slice(2)], vx, vy) + 5; H = { x:H0.x + vx * rH, y:H0.y + vy * rH }; }
    else H = { x:H0.x + vx * 6, y:H0.y + vy * 6 };
    return { T:T, C:ctrl(T, H, A.bend), H:H };
  }
  function opA(op){ return op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
  function arrowSVG(g, p, op){
    var q0 = { x:lerp(g.T.x, g.C.x, p), y:lerp(g.T.y, g.C.y, p) }, q1 = { x:lerp(g.C.x, g.H.x, p), y:lerp(g.C.y, g.H.y, p) }, B = { x:lerp(q0.x, q1.x, p), y:lerp(q0.y, q1.y, p) };
    var out = '<path d="M' + r1(g.T.x) + " " + r1(g.T.y) + " Q" + r1(q0.x) + " " + r1(q0.y) + " " + r1(B.x) + " " + r1(B.y) + '" fill="none" stroke="var(--e-pair)" stroke-width="2.6" stroke-linecap="round"' + opA(op) + "/>";
    if (p > 0.2) {
      var dx = B.x - q0.x, dy = B.y - q0.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hs = 10;
      out += '<path d="M' + r1(B.x + ux * 2) + " " + r1(B.y + uy * 2) + " L" + r1(B.x - ux * hs - uy * hs * 0.55) + " " + r1(B.y - uy * hs + ux * hs * 0.55) + " L" + r1(B.x - ux * hs + uy * hs * 0.55) + " " + r1(B.y - uy * hs - ux * hs * 0.55) + 'Z" fill="var(--e-pair)"' + opA(op) + "/>";
    }
    return out;
  }
  function seg(A, B){
    var dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, ta = rad(A, ux, uy) + 1.5, tb = rad(B, ux, uy) + 1.5;
    return { ax:A.x + ux * ta, ay:A.y + uy * ta, bx:B.x - ux * tb, by:B.y - uy * tb, ux:ux, uy:uy, ok:ta + tb < L - 2 };
  }
  function line(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2.2) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op == null ? 1 : o.op) + "/>"; }
  function text(x, y, t, o){ o = o || {}; var fs = o.fs || 14; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.anc || "middle") + '" dominant-baseline="central" font-size="' + fs + '" font-weight="' + (o.bold ? 700 : 400) + '" fill="' + (o.col || "var(--ink)") + '"' + opA(o.op == null ? 1 : o.op) + ">" + (o.nosub ? esc(t) : tsp(t, fs)) + "</text>"; }
  function svgOf(s, o){
    o = o || {};
    var out = "", N = s.n;
    Object.keys(s.glow).forEach(function(k){ var n = N[k], op = s.glow[k]; if (!n || op * n.op < 0.02) return; out += '<circle cx="' + r1(n.x) + '" cy="' + r1(n.y) + '" r="15" fill="var(--hi-soft)"' + opA(op * n.op) + "/>"; });
    Object.keys(s.bar).forEach(function(k){
      var b = s.bar[k]; if (b.op < 0.02) return;
      out += '<rect x="' + r1(b.x) + '" y="' + r1(b.y) + '" width="' + r1(b.w) + '" height="12" rx="6" fill="var(--sheet)" stroke="var(--ink-2)" stroke-width="1.2"' + opA(b.op) + "/>";
      if (b.f > 0.005) out += '<rect x="' + r1(b.x) + '" y="' + r1(b.y) + '" width="' + r1(Math.max(6, b.w * b.f)) + '" height="12" rx="6" fill="var(--pen)"' + opA(b.op) + "/>";
      if (b.t) out += text(b.x, b.y - 11, b.t, { fs:13, bold:true, anc:"start", op:b.op });
      if (b.lo) out += text(b.x, b.y + 24, b.lo, { fs:12, anc:"start", col:"var(--ink-2)", op:b.op });
      if (b.hi) out += text(b.x + b.w, b.y + 24, b.hi, { fs:12, anc:"end", col:"var(--ink-2)", op:b.op });
    });
    Object.keys(s.b).forEach(function(k){
      var b = s.b[k], A = N[b.a], B = N[b.b]; if (!A || !B) return;
      var op = Math.min(b.op, A.op, B.op); if (op < 0.02) return;
      var g = seg(A, B); if (!g.ok) return;
      if (b.o === 2) {
        out += line(g.ax + g.uy * 3.4, g.ay - g.ux * 3.4, g.bx + g.uy * 3.4, g.by - g.ux * 3.4, { op:op });
        out += line(g.ax - g.uy * 3.4, g.ay + g.ux * 3.4, g.bx - g.uy * 3.4, g.by + g.ux * 3.4, { op:op * b.xo });
      } else out += line(g.ax, g.ay, g.bx, g.by, { op:op });
    });
    Object.keys(s.ring).forEach(function(k){ var r = s.ring[k], n = N[k]; if (!n || r.op * n.op < 0.02) return;
      out += '<circle cx="' + r1(n.x) + '" cy="' + r1(n.y) + '" r="16" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-dasharray="4 3"' + opA(r.op * n.op) + "/>";
      if (r.t) out += text(n.x, n.y - 28, r.t, { fs:13, bold:true, op:r.op * n.op }); });
    Object.keys(N).forEach(function(k){ var n = N[k]; if (n.op < 0.02) return;
      out += text(n.x, n.y, n.t, { fs:FS, bold:n.el === "O" || n.el === "X" || n.el === "N", col:COL[n.el] || "var(--ink)", op:n.op }); });
    Object.keys(s.lp).forEach(function(k){
      var L = s.lp[k], n = N[L.n]; if (!n) return; var op = L.op * n.op; if (op < 0.02) return;
      var q = lpXY(s, k), px = -q.uy * 4, py = q.ux * 4;
      out += '<circle cx="' + r1(q.x + px) + '" cy="' + r1(q.y + py) + '" r="2.6" fill="var(--e-pair)"' + opA(op) + '/><circle cx="' + r1(q.x - px) + '" cy="' + r1(q.y - py) + '" r="2.6" fill="var(--e-pair)"' + opA(op) + "/>";
    });
    Object.keys(s.dl).forEach(function(k){
      var d = s.dl[k], n = N[k]; if (!n || d.op * n.op < 0.02) return;
      var ux = Math.cos(d.a), uy = Math.sin(d.a), r = rad(n, ux, uy) + 12;
      out += text(n.x + ux * r, n.y + uy * r, d.s, { fs:14, bold:true, col:d.s === "δ+" ? "var(--dl-pos)" : "var(--dl-neg)", op:d.op * n.op });
    });
    Object.keys(s.chg).forEach(function(k){
      var c = s.chg[k], n = N[k]; if (!n || c.op * n.op < 0.02) return; var x = n.x + hw(n.t) + 4, y = n.y - 16, op = c.op * n.op;
      if (c.s === "+") out += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="9" fill="var(--hi-soft)" stroke="var(--ink)" stroke-width="1.3"' + opA(op) + "/>" + text(x, y + 0.5, "+", { fs:15, bold:true, op:op });
      else out += text(x, y, "−", { fs:19, bold:true, op:op });
    });
    if (o.arrows !== false) Object.keys(s.ar).forEach(function(k){ var A = s.ar[k]; if (A.op < 0.02) return; var g = geo(s, A); if (g) out += arrowSVG(g, o.ap == null ? 1 : clamp(o.ap, 0, 1), A.op); });
    Object.keys(s.tag).forEach(function(k){ var g = s.tag[k]; if (g.op < 0.02) return; out += text(g.x, g.y, g.t, { fs:g.fs, bold:g.bold, col:g.col, op:g.op, anc:g.anc, nosub:g.nosub }); });
    return out;
  }
  function keys2(a, b){ var k = {}; Object.keys(a).forEach(function(x){ k[x] = 1; }); Object.keys(b).forEach(function(x){ k[x] = 1; }); return Object.keys(k); }
  function angL(a, b, t){ var d = ((b - a + 3 * Math.PI) % (2 * Math.PI)) - Math.PI; return a + d * t; }
  function mix(A, B, t){
    var S = sc();
    keys2(A.n, B.n).forEach(function(k){ var a = A.n[k], b = B.n[k];
      if (a && b) S.n[k] = { t:t < 0.5 ? a.t : b.t, el:b.el, x:lerp(a.x, b.x, t), y:lerp(a.y, b.y, t), op:lerp(a.op, b.op, t) };
      else if (a) S.n[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.n[k] = Object.assign({}, b, { op:b.op * t }); });
    keys2(A.b, B.b).forEach(function(k){ var a = A.b[k], b = B.b[k];
      if (a && b) S.b[k] = { a:b.a, b:b.b, o:Math.max(a.o, b.o), xo:a.o === b.o ? 1 : a.o > b.o ? 1 - t : t, op:1 };
      else if (a) S.b[k] = Object.assign({}, a, { op:1 - t }); else S.b[k] = Object.assign({}, b, { op:t }); });
    keys2(A.lp, B.lp).forEach(function(k){ var a = A.lp[k], b = B.lp[k];
      if (a && b) S.lp[k] = { n:b.n, a:angL(a.a, b.a, t), op:lerp(a.op, b.op, t) };
      else if (a) S.lp[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.lp[k] = Object.assign({}, b, { op:b.op * t }); });
    ["chg", "dl", "ring"].forEach(function(f){ keys2(A[f], B[f]).forEach(function(k){ var a = A[f][k], b = B[f][k];
      if (a && b && a.s === b.s) S[f][k] = Object.assign({}, b, { op:lerp(a.op, b.op, t) });
      else if (a && b) S[f][k] = Object.assign({}, t < 0.5 ? a : b, { op:Math.abs(1 - 2 * t) });
      else if (a) S[f][k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S[f][k] = Object.assign({}, b, { op:b.op * t }); }); });
    Object.keys(A.ar).forEach(function(k){ S.ar[k] = Object.assign({}, A.ar[k], { op:A.ar[k].op * Math.max(0, 1 - t * 3) }); });
    keys2(A.tag, B.tag).forEach(function(k){ var a = A.tag[k], b = B.tag[k];
      if (a && b) S.tag[k] = Object.assign({}, b, { x:lerp(a.x, b.x, t), y:lerp(a.y, b.y, t), op:lerp(a.op, b.op, t) });
      else if (a) S.tag[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.tag[k] = Object.assign({}, b, { op:b.op * t }); });
    keys2(A.glow, B.glow).forEach(function(k){ S.glow[k] = lerp(A.glow[k] || 0, B.glow[k] || 0, t); });
    keys2(A.bar, B.bar).forEach(function(k){ var a = A.bar[k], b = B.bar[k];
      if (a && b) S.bar[k] = Object.assign({}, b, { f:lerp(a.f, b.f, t), op:lerp(a.op, b.op, t) });
      else if (a) S.bar[k] = Object.assign({}, a, { op:a.op * (1 - t) }); else S.bar[k] = Object.assign({}, b, { f:b.f * t, op:b.op * Math.min(1, t * 2) }); });
    return S;
  }
  function bbox(list){
    var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    function inc(a, b, c, d){ x0 = Math.min(x0, a); x1 = Math.max(x1, b); y0 = Math.min(y0, c); y1 = Math.max(y1, d); }
    list.forEach(function(s){
      Object.keys(s.n).forEach(function(k){ var n = s.n[k], h = hw(n.t); inc(n.x - h - (s.dl[k] ? 22 : 0), n.x + h + (s.chg[k] ? 16 : 0) + (s.dl[k] ? 22 : 0), n.y - HH - (s.chg[k] ? 12 : 0) - (s.ring[k] ? 34 : 0) - (s.dl[k] ? 22 : 0), n.y + HH + (s.dl[k] ? 22 : 0)); });
      Object.keys(s.lp).forEach(function(k){ var q = lpXY(s, k); if (q) inc(q.x - 6, q.x + 6, q.y - 6, q.y + 6); });
      Object.keys(s.tag).forEach(function(k){ var g = s.tag[k], w = tw(g.t, g.fs) * (g.bold ? 1.12 : 1.05); var a = g.anc === "start" ? 0 : g.anc === "end" ? w : w / 2; inc(g.x - a, g.x - a + w, g.y - g.fs * 0.7, g.y + g.fs * 0.7); });
      Object.keys(s.bar).forEach(function(k){ var b = s.bar[k]; inc(b.x, b.x + b.w, b.y - 20, b.y + 32); });
      Object.keys(s.ar).forEach(function(k){ var g = geo(s, s.ar[k]); if (!g) return; var mx = 0.25 * g.T.x + 0.5 * g.C.x + 0.25 * g.H.x, my = 0.25 * g.T.y + 0.5 * g.C.y + 0.25 * g.H.y;
        inc(Math.min(g.T.x, g.H.x, mx) - 6, Math.max(g.T.x, g.H.x, mx) + 6, Math.min(g.T.y, g.H.y, my) - 6, Math.max(g.T.y, g.H.y, my) + 6); });
    });
    return { x0:x0, x1:x1, y0:y0, y1:y1 };
  }
  function fit(svg, list, o){
    o = o || {}; var bb = bbox(list), pad = o.pad || 12, cw = svg.getBoundingClientRect().width || o.w || 560;
    var w = bb.x1 - bb.x0 + 2 * pad, h = bb.y1 - bb.y0 + 2 * pad, VW = Math.max(w, cw / (o.maxScale || 1.6));
    svg.setAttribute("viewBox", [bb.x0 - pad - (VW - w) / 2, bb.y0 - pad, VW, h].map(r1).join(" "));
  }
  function stage(svg, o){
    o = o || {};
    var st = { seq:null, i:0, tok:0, cancel:null, busy:false };
    function draw(s, opt){ svg.innerHTML = svgOf(s, opt); }
    function cancel(){ st.tok++; if (st.cancel) { st.cancel(); st.cancel = null; } st.busy = false; }
    function arrowsIn(s, tok, done){
      if (!Object.keys(s.ar).length || MV.reduceMotion) { draw(s); done(); return; }
      st.cancel = MV.tween({ dur:o.adur || 750, ease:function(t){ return t; }, step:function(t){ if (tok === st.tok) draw(s, { ap:t }); }, done:function(){ if (tok !== st.tok) return; st.cancel = null; draw(s); done(); } });
    }
    function morph(A, B, tok, done){
      st.cancel = MV.tween({ dur:o.dur || 1100, step:function(t){ if (tok === st.tok) draw(mix(A, B, t)); }, done:function(){ if (tok !== st.tok) return; st.cancel = null; done(); } });
    }
    return {
      load:function(seq){ cancel(); st.seq = seq; st.i = 0; fit(svg, seq, o); },
      refit:function(){ if (st.seq) fit(svg, st.seq, o); },
      show:function(i, opt){ cancel(); st.i = clamp(i, 0, st.seq.length - 1); draw(st.seq[st.i], opt); },
      scene:function(s, opt){ cancel(); draw(s, opt); },
      arrows:function(i, done){ cancel(); var tok = ++st.tok; st.busy = true; st.i = i; arrowsIn(st.seq[i], tok, function(){ st.busy = false; if (done) done(); }); },
      sceneArrows:function(s, done){ cancel(); var tok = ++st.tok; st.busy = true; arrowsIn(s, tok, function(){ st.busy = false; if (done) done(); }); },
      pair:function(A, B, done){ cancel(); var tok = ++st.tok; st.busy = true; morph(A, B, tok, function(){ draw(B, { arrows:false }); st.busy = false; if (done) done(); }); },
      play:function(from, to, onStep, done){
        cancel(); var tok = ++st.tok; st.busy = true; st.i = from;
        (function next(k){
          if (tok !== st.tok) return;
          if (k >= to) { st.i = to; st.busy = false; if (done) done(); return; }
          if (onStep) onStep(k + 1, "morph");
          morph(st.seq[k], st.seq[k + 1], tok, function(){
            st.i = k + 1; if (onStep) onStep(k + 1, "arrows");
            arrowsIn(st.seq[k + 1], tok, function(){ if (k + 1 >= to) next(k + 1); else MV.wait(o.pause || 350, function(){ next(k + 1); }); });
          });
        })(from);
      },
      cancel:cancel, busy:function(){ return st.busy; }, index:function(){ return st.i; }
    };
  }
  return { sc:sc, put:put, bond:bond, lp:lp, chg:chg, dl:dl, arrow:arrow, tag:tag, glow:glow, ring:ring, bar:bar, clone:clone, svg:svgOf, mix:mix, bbox:bbox, fit:fit, stage:stage, key:key, hw:hw };
})();
var C3 = {
  stepper:function(host, o){
    host.innerHTML = ""; var box = document.createElement("div"); host.appendChild(box);
    var pl = MV.player(box, { count:o.steps.length, interval:o.interval || 2700, render:function(i){ o.onStep(i); }, label:o.label || function(i){ return "Step " + (i + 1) + " of " + o.steps.length; } });
    return { go:pl.go, get:pl.get, count:o.steps.length };
  }
};

// ---------- the three mechanisms (plan §4 Explore) ----------
// frames[k] = structures after step k (frame 0 = reactants), with the arrows of step k + 1 drawn on them.
var MECH = (function(){
  var P = MS.put, B = MS.bond, L = MS.lp, Q = MS.chg, D = MS.dl, A = MS.arrow, G = MS.tag;
  // mechanism 1: HBr adds to propene
  var a0 = MS.sc(); P(a0, "c3", "CH3", "C", 0, 0); P(a0, "c2", "CH", "C", 70, 0); P(a0, "c1", "CH2", "C", 140, 0); B(a0, "c3", "c2", 1); B(a0, "c2", "c1", 2);
  P(a0, "h", "H", "H", 122, -92); P(a0, "br", "Br", "X", 192, -92); B(a0, "h", "br", 1);
  L(a0, "brL1", "br", 0); L(a0, "brL2", "br", 70); L(a0, "brL3", "br", -70); D(a0, "h", "δ+", -90); D(a0, "br", "δ−", 125);
  A(a0, "a1", "b:c2|c1", "n:h", -0.35); A(a0, "a2", "b:h|br", "n:br", -0.7);
  var a1 = MS.sc(); P(a1, "c3", "CH3", "C", 0, 0); P(a1, "c2", "CH", "C", 70, 0); P(a1, "c1", "CH2", "C", 140, 0); B(a1, "c3", "c2", 1); B(a1, "c2", "c1", 1);
  P(a1, "h", "H", "H", 140, 52); B(a1, "c1", "h", 1); MS.glow(a1, "h"); P(a1, "br", "Br", "X", 205, -78);
  L(a1, "brL1", "br", 0); L(a1, "brL2", "br", 90); L(a1, "brL3", "br", -90); L(a1, "brL4", "br", 180); Q(a1, "br", "−"); Q(a1, "c2", "+");
  G(a1, "t2", "secondary carbocation", 50, 40, { fs:13, col:"var(--ink-2)" }); A(a1, "a3", "l:brL4", "n:c2", 0.3);
  var a2 = MS.sc(); P(a2, "c3", "CH3", "C", 0, 0); P(a2, "c2", "CH", "C", 70, 0); P(a2, "c1", "CH2", "C", 140, 0); B(a2, "c3", "c2", 1); B(a2, "c2", "c1", 1);
  P(a2, "h", "H", "H", 140, 52); B(a2, "c1", "h", 1); MS.glow(a2, "h"); P(a2, "br", "Br", "X", 70, -64); B(a2, "c2", "br", 1);
  L(a2, "brL1", "br", 0); L(a2, "brL2", "br", 180); L(a2, "brL3", "br", -90); G(a2, "tp", "2-bromopropane (major)", 70, 92, { fs:15, bold:true });
  // mechanism 2: OH⁻ substitutes for Br in bromoethane
  var b0 = MS.sc(); P(b0, "ho", "H", "H", 0, 0); P(b0, "o", "O", "O", 40, 0); B(b0, "ho", "o", 1); L(b0, "oL1", "o", -110); L(b0, "oL2", "o", 110); L(b0, "oL3", "o", 0); Q(b0, "o", "−");
  P(b0, "c1", "CH2", "C", 130, 0); P(b0, "c2", "CH3", "C", 130, -64); P(b0, "br", "Br", "X", 205, 0); B(b0, "c2", "c1", 1); B(b0, "c1", "br", 1);
  L(b0, "brL1", "br", -90); L(b0, "brL2", "br", 0); L(b0, "brL3", "br", 90); D(b0, "c1", "δ+", -140); D(b0, "br", "δ−", 135);
  A(b0, "a1", "l:oL3", "n:c1", 0.4); A(b0, "a2", "b:c1|br", "n:br", -0.6);
  var b1 = MS.sc(); P(b1, "ho", "H", "H", 42, 0); P(b1, "o", "O", "O", 80, 0); B(b1, "ho", "o", 1); B(b1, "o", "c1", 1); L(b1, "oL1", "o", -90); L(b1, "oL2", "o", 90);
  P(b1, "c1", "CH2", "C", 130, 0); P(b1, "c2", "CH3", "C", 130, -64); B(b1, "c2", "c1", 1); P(b1, "br", "Br", "X", 250, 0);
  L(b1, "brL1", "br", -90); L(b1, "brL2", "br", 0); L(b1, "brL3", "br", 90); L(b1, "brL4", "br", 180); Q(b1, "br", "−"); G(b1, "tp", "ethanol + Br⁻", 140, 52, { fs:15, bold:true });
  // mechanism 3: acid-catalysed dehydration of propan-2-ol
  var d0 = MS.sc(); P(d0, "c1", "CH2", "C", 0, 0); P(d0, "h1", "H", "H", 0, -54); P(d0, "c2", "CH", "C", 70, 0); P(d0, "c3", "CH3", "C", 140, 0);
  P(d0, "o", "O", "O", 70, 58); P(d0, "ho", "H", "H", 112, 58); P(d0, "hp", "H", "H", -28, 108);
  B(d0, "c1", "h1", 1); B(d0, "c1", "c2", 1); B(d0, "c2", "c3", 1); B(d0, "c2", "o", 1); B(d0, "o", "ho", 1); L(d0, "oL1", "o", 180); L(d0, "oL2", "o", 90); Q(d0, "hp", "+");
  A(d0, "a1", "l:oL2", "n:hp", -0.3);
  var d1 = MS.sc(); P(d1, "c1", "CH2", "C", 0, 0); P(d1, "h1", "H", "H", 0, -54); P(d1, "c2", "CH", "C", 70, 0); P(d1, "c3", "CH3", "C", 140, 0);
  P(d1, "o", "O", "O", 70, 58); P(d1, "ho", "H", "H", 112, 58); P(d1, "hp", "H", "H", 70, 110);
  B(d1, "c1", "h1", 1); B(d1, "c1", "c2", 1); B(d1, "c2", "c3", 1); B(d1, "c2", "o", 1); B(d1, "o", "ho", 1); B(d1, "o", "hp", 1); L(d1, "oL1", "o", 180); Q(d1, "o", "+");
  A(d1, "a2", "b:c2|o", "n:o", 0.6);
  var d2 = MS.sc(); P(d2, "c1", "CH2", "C", 0, 0); P(d2, "h1", "H", "H", 0, -54); P(d2, "c2", "CH", "C", 70, 0); P(d2, "c3", "CH3", "C", 140, 0);
  P(d2, "o", "O", "O", 150, 104); P(d2, "ho", "H", "H", 188, 104); P(d2, "hp", "H", "H", 112, 104);
  B(d2, "c1", "h1", 1); B(d2, "c1", "c2", 1); B(d2, "c2", "c3", 1); B(d2, "o", "ho", 1); B(d2, "o", "hp", 1); L(d2, "oL1", "o", -90); L(d2, "oL3", "o", 90); Q(d2, "c2", "+");
  G(d2, "t2", "secondary carbocation", 70, 40, { fs:13, col:"var(--ink-2)" }); A(d2, "a3", "b:c1|h1", "n:c2", -0.45);
  var d3 = MS.sc(); P(d3, "c1", "CH2", "C", 0, 0); P(d3, "h1", "H", "H", -46, -62); P(d3, "c2", "CH", "C", 70, 0); P(d3, "c3", "CH3", "C", 140, 0);
  P(d3, "o", "O", "O", 150, 104); P(d3, "ho", "H", "H", 188, 104); P(d3, "hp", "H", "H", 112, 104);
  B(d3, "c1", "c2", 2); B(d3, "c2", "c3", 1); B(d3, "o", "ho", 1); B(d3, "o", "hp", 1); L(d3, "oL1", "o", -90); L(d3, "oL3", "o", 90); Q(d3, "h1", "+");
  G(d3, "tp", "propene + H₂O; H⁺ is returned", 70, 44, { fs:14, bold:true });
  return {
    m1:{ name:"1. HBr adds to propene", eq:"CH₃CH=CH₂ + HBr → CH₃CHBrCH₃", type:"addition", frames:[a0, a1, a2],
      product:"2-bromopropane (major) · 1-bromopropane (minor)",
      caps:["Propene meets HBr. Arrow 1: the C=C’s π electron pair moves to H. Arrow 2: the H–Br bond’s pair moves onto Br.",
        "Step 1: H bonds to C1 (the end CH₂), so the + lands on the middle carbon: a secondary carbocation. Br leaves as Br⁻. Next: a Br⁻ lone pair moves to C⁺.",
        "Step 2: Br⁻ bonds to C⁺. 2-bromopropane is the major product. The primary carbocation (H on C2) is less stable, so 1-bromopropane is minor."],
      aria:["Propene, CH₃–CH=CH₂, with H–Br above it (H δ+, Br δ− with three lone pairs). Violet arrow 1 runs from the C=C bond to H; arrow 2 from the H–Br bond to Br.",
        "The carbocation CH₃–C⁺H–CH₃: the new H is bonded to C1 and the middle carbon carries a + charge. Br⁻ with four lone pairs sits nearby; a violet arrow runs from one of its lone pairs to the positive carbon.",
        "2-bromopropane: Br bonded to the middle carbon, with three lone pairs. Labelled major."],
      steps:[
        { broken:"C=C π bond; H–Br", formed:"C–H", flow:"from the C=C to H; from H–Br to Br", inter:"secondary carbocation, CH₃C⁺HCH₃ (more stable than primary)",
          draw:{ tails:[{ id:"cc", t:"C=C bond", ref:"b:c2|c1" }, { id:"hbr", t:"H–Br bond", ref:"b:h|br" }, { id:"brlp", t:"Br lone pair", ref:"l:brL1" }, { id:"H", t:"H atom", ref:"n:h" }, { id:"Br", t:"Br atom", ref:"n:br" }],
            heads:[{ id:"H", t:"H", ref:"n:h" }, { id:"Br", t:"Br", ref:"n:br" }, { id:"C1", t:"C1 (CH₂)", ref:"n:c1" }, { id:"C2", t:"C2 (CH)", ref:"n:c2" }, { id:"cc", t:"C=C bond", ref:"b:c2|c1" }],
            ok:[["cc", "H"], ["hbr", "Br"]],
            named:[{ t:"H", h:["cc", "C1", "C2"], fb:"Arrows show electrons moving. H⁺ has none to give; the C=C’s electrons move to H." },
              { t:"Br", h:["H", "cc", "C1", "C2"], fb:"The bond’s electrons leave with Br, making Br⁻." },
              { t:"hbr", h:["H"], fb:"The bond’s electrons leave with Br, making Br⁻." },
              { t:"cc", h:["C1", "C2", "cc", "Br"], fb:"The C=C’s π electrons move to H: that’s where the new C–H bond forms." },
              { t:"brlp", h:"*", fb:"Br keeps its lone pairs in this step; it’s the H–Br bond’s electrons that move onto Br." },
              { t:"hbr", h:["C1", "C2", "cc"], fb:"The H–Br bond’s electrons go to Br, not to carbon: Br leaves as Br⁻." }] } },
        { broken:"none: Br⁻ uses a lone pair", formed:"C–Br", flow:"from a Br⁻ lone pair to C⁺", inter:"none: this step makes the product",
          draw:{ tails:[{ id:"brlp", t:"Br⁻ lone pair", ref:"l:brL4" }, { id:"ch", t:"new C–H bond", ref:"b:c1|h" }, { id:"C2", t:"C⁺ (C2) atom", ref:"n:c2" }, { id:"Br", t:"Br⁻ atom", ref:"n:br" }],
            heads:[{ id:"C2", t:"C⁺ (C2)", ref:"n:c2" }, { id:"C1", t:"C1", ref:"n:c1" }, { id:"Br", t:"Br⁻", ref:"n:br" }, { id:"H", t:"H", ref:"n:h" }],
            ok:[["brlp", "C2"]],
            named:[{ t:"C2", h:"*", fb:"Arrows start at electrons. C⁺ has none to spare; a lone pair on Br⁻ moves to C⁺." },
              { t:"brlp", h:["C1"], fb:"The + sits on C2, the secondary carbon: Br⁻ bonds there." },
              { t:"ch", h:"*", fb:"The new C–H bond stays put; the electrons come from a Br⁻ lone pair." }] } }
      ] },
    m2:{ name:"2. OH⁻ substitutes for Br in bromoethane", eq:"CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻", type:"substitution", frames:[b0, b1],
      product:"ethanol + Br⁻",
      caps:["OH⁻ meets bromoethane. Arrow 1: an O lone pair moves to the δ+ carbon. Arrow 2: the C–Br bond’s pair moves onto Br.",
        "One step: the C–O bond forms as Br⁻ leaves. OH swaps in for Br: substitution."],
      aria:["Hydroxide, H–O⁻ with three lone pairs, beside bromoethane, CH₃–CH₂–Br (C δ+, Br δ−). Violet arrow 1 runs from an O lone pair to the CH₂ carbon; arrow 2 from the C–Br bond to Br.",
        "Ethanol, CH₃–CH₂–O–H, and a separate bromide ion, Br⁻, with four lone pairs."],
      steps:[
        { broken:"C–Br", formed:"C–O", flow:"from an O lone pair to C; from C–Br to Br", inter:"none: one step (OH⁻ attacks as Br⁻ leaves)",
          draw:{ tails:[{ id:"olp", t:"O lone pair", ref:"l:oL3" }, { id:"cbr", t:"C–Br bond", ref:"b:c1|br" }, { id:"oh", t:"O–H bond", ref:"b:ho|o" }, { id:"C1", t:"C1 (CH₂) atom", ref:"n:c1" }, { id:"Br", t:"Br atom", ref:"n:br" }],
            heads:[{ id:"C1", t:"C1 (CH₂)", ref:"n:c1" }, { id:"C2", t:"C2 (CH₃)", ref:"n:c2" }, { id:"O", t:"O", ref:"n:o" }, { id:"Br", t:"Br", ref:"n:br" }],
            ok:[["olp", "C1"], ["cbr", "Br"]],
            named:[{ t:"C1", h:"*", fb:"Arrows start at electrons: an O lone pair points to the carbon, not the other way." },
              { t:"Br", h:"*", fb:"Br’s electrons leave with Br; the electrons for the new C–O bond come from O." },
              { t:"cbr", h:["C1", "C2", "O"], fb:"The C–Br bond’s electrons leave with Br, making Br⁻." },
              { t:"olp", h:["C2", "Br", "O"], fb:"OH⁻ attacks the carbon that holds Br (C1), the δ+ carbon." },
              { t:"oh", h:"*", fb:"The O–H bond stays; a lone pair on O attacks the carbon." }] } }
      ] },
    m3:{ name:"3. Acid-catalysed dehydration of propan-2-ol", eq:"CH₃CH(OH)CH₃ → CH₂=CHCH₃ + H₂O <span class=\"rm-capn\">(acid catalyst, heat)</span>", type:"elimination (dehydration)", frames:[d0, d1, d2, d3],
      product:"propene + water (the H⁺ is returned: a catalyst)",
      caps:["Propan-2-ol with an acid catalyst, H⁺. Arrow: an O lone pair moves to H⁺.",
        "Step 1: the OH gains H⁺ and becomes –OH₂⁺. Next: the C–O bond’s pair moves onto O.",
        "Step 2: water leaves with the C–O electrons, giving a secondary carbocation. Next: a neighbouring C–H bond’s pair moves toward C⁺.",
        "Step 3: H⁺ leaves and a C=C forms. Propene and water; the H⁺ is returned, so it’s a catalyst. Elimination: a small molecule leaves and a C=C forms."],
      aria:["Propan-2-ol: CH₂ (with one H drawn), CH and CH₃ in a row, with O–H on the middle carbon; O has two lone pairs. H⁺ waits below. A violet arrow runs from an O lone pair to H⁺.",
        "The protonated alcohol: O now bonded to the carbon and two H atoms, with a + charge and one lone pair. A violet arrow runs from the C–O bond to O.",
        "Water has left. The middle carbon carries a + charge: a secondary carbocation. A violet arrow runs from the C–H bond on the end carbon toward the positive carbon.",
        "Propene, CH₂=CH–CH₃, a water molecule, and H⁺ returned."],
      steps:[
        { broken:"none: O uses a lone pair", formed:"O–H (the OH gains H⁺)", flow:"from an O lone pair to H⁺", inter:"protonated alcohol, CH₃CH(OH₂⁺)CH₃",
          draw:{ tails:[{ id:"olp", t:"O lone pair", ref:"l:oL2" }, { id:"co", t:"C–O bond", ref:"b:c2|o" }, { id:"oh", t:"O–H bond", ref:"b:o|ho" }, { id:"Hp", t:"H⁺ atom", ref:"n:hp" }],
            heads:[{ id:"Hp", t:"H⁺", ref:"n:hp" }, { id:"O", t:"O", ref:"n:o" }, { id:"C2", t:"C2", ref:"n:c2" }],
            ok:[["olp", "Hp"]],
            named:[{ t:"Hp", h:"*", fb:"H⁺ has no electrons to give; a lone pair on O moves to H⁺." },
              { t:"co", h:"*", fb:"Not yet: first the OH gains H⁺, so that water can leave in the next step." },
              { t:"olp", h:["C2", "O"], fb:"The O lone pair grabs H⁺: that makes –OH₂⁺." },
              { t:"oh", h:"*", fb:"The O–H bond stays; a lone pair on O reaches for H⁺." }] } },
        { broken:"C–O", formed:"none", flow:"from C–O to O (water leaves)", inter:"secondary carbocation, CH₃C⁺HCH₃",
          draw:{ tails:[{ id:"co", t:"C–O bond", ref:"b:c2|o" }, { id:"olp", t:"O lone pair", ref:"l:oL1" }, { id:"oh", t:"O–H bond", ref:"b:o|ho" }, { id:"C2", t:"C2 atom", ref:"n:c2" }],
            heads:[{ id:"O", t:"O", ref:"n:o" }, { id:"C2", t:"C2", ref:"n:c2" }, { id:"H", t:"H", ref:"n:ho" }],
            ok:[["co", "O"]],
            named:[{ t:"co", h:["C2", "H"], fb:"The C–O electrons leave with O, so water departs and C2 is left positive." },
              { t:"C2", h:"*", fb:M1 },
              { t:"oh", h:"*", fb:"The O–H bonds stay: water leaves whole, taking the C–O electrons." },
              { t:"olp", h:"*", fb:"The lone pair stays on O; the C–O bond’s electrons are the ones that move." }] } },
        { broken:"C–H (H⁺ leaves)", formed:"C=C π bond", flow:"from the C–H bond to C⁺", inter:"none: this step makes the product",
          draw:{ tails:[{ id:"ch", t:"C–H bond on C1", ref:"b:c1|h1" }, { id:"cc", t:"C1–C2 bond", ref:"b:c1|c2" }, { id:"wlp", t:"water’s O lone pair", ref:"l:oL1" }, { id:"C2", t:"C⁺ (C2) atom", ref:"n:c2" }],
            heads:[{ id:"C2", t:"C⁺ (C2)", ref:"n:c2" }, { id:"C1", t:"C1", ref:"n:c1" }, { id:"H1", t:"H on C1", ref:"n:h1" }],
            ok:[["ch", "C2"]],
            named:[{ t:"ch", h:["H1"], fb:"The C–H electrons stay with carbon and become the new C=C; H leaves as H⁺." },
              { t:"ch", h:["C1"], fb:"They’re already on C1; they move toward C⁺ (C2) to make the C=C." },
              { t:"C2", h:"*", fb:M1 },
              { t:"cc", h:"*", fb:"The C1–C2 bond stays; the electrons come from the neighbouring C–H bond." },
              { t:"wlp", h:"*", fb:"In this model, the C–H bond’s electrons are what move; the H⁺ simply leaves." }] } }
      ] }
  };
})();
Object.keys(MECH).forEach(function(m){ var M = MECH[m]; M.framesD = M.frames.map(function(f){ var g = MS.clone(f); g.ar = {}; return g; }); });
function arrowsOf(m, k){ var f = MECH[m].frames[k]; return Object.keys(f.ar).map(function(id){ return f.ar[id]; }); }
// student arrows for a draw-it step -> scene arrows
function bendFor(m, k, tref, href){ var hit = arrowsOf(m, k).filter(function(a){ return a.tail === tref && a.head === href; })[0]; return hit ? hit.bend : 0.4; }
function judgeDraw(m, k, d){
  var st = MECH[m].steps[k], D = st.draw;
  if (!d || d.some(function(a){ return !a.t || !a.h; })) return { ok:false, msg:"Place every arrow: choose a tail and a head for each." };
  var need = D.ok.map(function(p){ return p.join(">"); }), got = d.map(function(a){ return a.t + ">" + a.h; });
  if (got.every(function(g){ return need.indexOf(g) >= 0; }) && need.every(function(n){ return got.indexOf(n) >= 0; })) return { ok:true };
  for (var j = 0; j < d.length; j++) {
    if (need.indexOf(got[j]) >= 0) continue;
    var a = d[j], nm = D.named.filter(function(x){ return x.t === a.t && (x.h === "*" || x.h.indexOf(a.h) >= 0); })[0];
    if (nm) return { ok:false, msg:nm.fb };
    var tl = find(D.tails, a.t);
    if (tl && tl.ref.charAt(0) === "n") return { ok:false, msg:M1 };
    return { ok:false, msg:"That electron pair doesn’t go there in this step. Ask: where does the new bond form, and which atom keeps the pair from the bond that breaks?" };
  }
  return { ok:false, msg:"Each arrow shows a different electron pair: use each move once." };
}

// ---------- Markovnikov lab data (plan §4 Explore) ----------
var RG = [{ id:"HCl", t:"HCl" }, { id:"HBr", t:"HBr" }, { id:"H2O", t:"H₂O (acid)" }];
var CLS = ["", "primary", "secondary", "tertiary"];
var ALK = [
  { id:"propene", cond:"CH₂=CH–CH₃",
    p:[{ on:"C1", at:"C2", cls:2, cat:"CH₃–C⁺H–CH₃", pr:{ HCl:"2-chloropropane", HBr:"2-bromopropane", H2O:"propan-2-ol" } },
      { on:"C2", at:"C1", cls:1, cat:"C⁺H₂–CH₂–CH₃", pr:{ HCl:"1-chloropropane", HBr:"1-bromopropane", H2O:"propan-1-ol" } }] },
  { id:"but-1-ene", cond:"CH₂=CH–CH₂–CH₃",
    p:[{ on:"C1", at:"C2", cls:2, cat:"CH₃–C⁺H–CH₂–CH₃", pr:{ HCl:"2-chlorobutane", HBr:"2-bromobutane", H2O:"butan-2-ol" } },
      { on:"C2", at:"C1", cls:1, cat:"C⁺H₂–CH₂–CH₂–CH₃", pr:{ HCl:"1-chlorobutane", HBr:"1-bromobutane", H2O:"butan-1-ol" } }] },
  { id:"but-2-ene", cond:"CH₃–CH=CH–CH₃", sym:true,
    p:[{ on:"C3", at:"C2", cls:2, cat:"CH₃–C⁺H–CH₂–CH₃", pr:{ HCl:"2-chlorobutane", HBr:"2-bromobutane", H2O:"butan-2-ol" } },
      { on:"C2", at:"C3", cls:2, cat:"CH₃–CH₂–C⁺H–CH₃", pr:{ HCl:"2-chlorobutane", HBr:"2-bromobutane", H2O:"butan-2-ol" } }] },
  { id:"2-methylpropene", cond:"CH₂=C(CH₃)–CH₃",
    p:[{ on:"C1", at:"C2", cls:3, cat:"CH₃–C⁺(CH₃)–CH₃", pr:{ HCl:"2-chloro-2-methylpropane", HBr:"2-bromo-2-methylpropane", H2O:"2-methylpropan-2-ol" } },
      { on:"C2", at:"C1", cls:1, cat:"C⁺H₂–CH(CH₃)–CH₃", pr:{ HCl:"1-chloro-2-methylpropane", HBr:"1-bromo-2-methylpropane", H2O:"2-methylpropan-1-ol" } }] },
  { id:"2-methylbut-2-ene", cond:"CH₃–C(CH₃)=CH–CH₃",
    p:[{ on:"C3", at:"C2", cls:3, cat:"CH₃–C⁺(CH₃)–CH₂–CH₃", pr:{ HCl:"2-chloro-2-methylbutane", HBr:"2-bromo-2-methylbutane", H2O:"2-methylbutan-2-ol" } },
      { on:"C2", at:"C3", cls:2, cat:"CH₃–CH(CH₃)–C⁺H–CH₃", pr:{ HCl:"2-chloro-3-methylbutane", HBr:"2-bromo-3-methylbutane", H2O:"3-methylbutan-2-ol" } }] }
];
function alkOf(id){ return find(ALK, id); }
function majorOf(A){ return A.p[0].cls >= A.p[1].cls ? A.p[0] : A.p[1]; }
function minorOf(A){ return A.p[0].cls >= A.p[1].cls ? A.p[1] : A.p[0]; }
function prodF(cat, rg){
  var x0 = rg === "HCl" ? "Cl" : rg === "HBr" ? "Br" : "OH", x1 = rg === "H2O" ? "(OH)" : x0;
  return cat.replace("C⁺H₂", "CH₂" + x0).replace("C⁺H", "CH" + x1).replace("C⁺(CH₃)", "C" + x1 + "(CH₃)");
}
function catHTML(cat){ return '<span class="rm-cf">' + cat.replace(/C⁺/g, 'C<span class="rm-plus" aria-hidden="true">+</span><span class="vh">+</span>') + "</span>"; }
function fHTML(f){ return '<span class="rm-cf">' + f.replace(/(Br|Cl)/g, '<span class="rm-x">$1</span>').replace(/O(?![a-z])/g, '<span class="rm-o">O</span>') + "</span>"; }

// ---------- hero ----------
function heroEq(){
  var wrap = $(".rm-heq"); if (!wrap) return;
  var svg = $(".rm-heq-arr", wrap);
  function head(x, y, ux, uy){ var hs = 9; return '<path d="M' + r1(x + ux * 2) + " " + r1(y + uy * 2) + " L" + r1(x - ux * hs - uy * hs * 0.55) + " " + r1(y - uy * hs + ux * hs * 0.55) + " L" + r1(x - ux * hs + uy * hs * 0.55) + " " + r1(y - uy * hs - ux * hs * 0.55) + 'Z" fill="var(--e-pair)"/>'; }
  function arc(x1, y1, x2, y2, cy){
    var cx = (x1 + x2) / 2, dx = x2 - cx, dy = y2 - cy, L = Math.hypot(dx, dy) || 1;
    return '<path d="M' + r1(x1) + " " + r1(y1) + " Q" + r1(cx) + " " + r1(cy) + " " + r1(x2) + " " + r1(y2) + '" fill="none" stroke="var(--e-pair)" stroke-width="2.4" stroke-linecap="round"/>' + head(x2, y2, dx / L, dy / L);
  }
  function draw(){
    var R = wrap.getBoundingClientRect(); if (!R.width) return;
    var db = $(".rm-heq-db", wrap).getBoundingClientRect(), h = $(".rm-heq-h", wrap).getBoundingClientRect(), br = $(".rm-heq-br", wrap).getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(wrap).fontSize) || 30, top = Math.min(db.top, h.top) - R.top, gy = top + fs * 0.2;
    svg.setAttribute("viewBox", "0 0 " + r1(R.width) + " " + r1(R.height)); svg.setAttribute("width", r1(R.width)); svg.setAttribute("height", r1(R.height));
    var xd = db.left - R.left + db.width / 2, xh = h.left - R.left + h.width / 2, xj = h.right - R.left, xb = br.left - R.left + br.width * 0.62;
    svg.innerHTML = arc(xd, gy, xh - 2, gy - 2, gy - fs * 0.95) + arc(xj - 1, gy - 1, xb, gy - 3, gy - fs * 0.9);
  }
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  if (window.ResizeObserver) new ResizeObserver(draw).observe(wrap);
}
function heroFrames(){
  var f = MECH.m1.frames, h0 = MS.clone(f[0]), h1 = MS.clone(f[0]), h2 = MS.clone(f[1]), h3 = MS.clone(f[2]);
  h0.ar = {}; ["h", "br"].forEach(function(k){ h0.n[k].x += 96; h0.n[k].y -= 30; });
  [h0, h1].forEach(function(s){ MS.tag(s, "tn", "propene", 70, 38, { fs:14, col:"var(--ink-2)" }); });
  delete h2.tag.t2;
  MS.bar(h2, "b2", { x:-10, y:96, w:170, f:2 / 3, t:"secondary carbocation", lo:"less stable", hi:"more stable" });
  MS.bar(h3, "b2", { x:-10, y:132, w:170, f:2 / 3, t:"secondary carbocation", lo:"less stable", hi:"more stable" });
  h3.tag.tp.y = 84;
  MS.bar(h3, "b1", { x:236, y:132, w:170, f:1 / 3, t:"primary carbocation", lo:"less stable", hi:"more stable", op:0.5 });
  MS.tag(h3, "m1", "If H⁺ added to C2 instead:", 236, -40, { fs:14, anc:"start", op:0.5, nosub:true });
  MS.tag(h3, "m2", "CH₃CH₂C⁺H₂ (primary)", 236, -12, { fs:15, anc:"start", op:0.5 });
  MS.tag(h3, "m3", "→ 1-bromopropane (minor)", 236, 24, { fs:15, anc:"start", bold:true, op:0.5 });
  return [h0, h1, h2, h3];
}
var HCAP = { start:"Propene and HBr approach.", a1:"A curved arrow leaves the C=C and lands on the H of HBr; a second moves the H–Br bond’s electrons onto Br.",
  m2:"Br leaves as Br⁻. The middle carbon turns positive: a secondary carbocation, more stable than a primary one.", a2:"A Br⁻ lone pair moves to the positive carbon.",
  end:"2-bromopropane is the major product. The primary carbocation is less stable, so 1-bromopropane is minor." };
function hero(){
  heroEq();
  var svg = $("#rm-hx-svg"), box = $("#rm-hx-box"), cap = $("#rm-hx-cap"), rep = $("#rm-hx-replay");
  if (!svg) return;
  var fr = heroFrames();
  if (MV.reduceMotion) {
    var parts = [[fr[1], "1. Two arrows: the C=C’s pair moves to H; the H–Br pair moves onto Br."], [fr[2], "2. A secondary carbocation forms; a Br⁻ lone pair moves to C⁺."], [fr[3], "3. 2-bromopropane (major); 1-bromopropane (minor)."]];
    box.innerHTML = '<div class="rm-hx-tri">' + parts.map(function(p, i){ return '<figure class="rm-hx-fr"><svg class="rm-hx-svg" role="img" aria-label="' + esc(MV.plain(p[1])) + '" data-i="' + i + '"></svg><figcaption>' + p[1] + "</figcaption></figure>"; }).join("") + "</div>";
    $$(".rm-hx-fr svg", box).forEach(function(s, i){ MS.fit(s, [parts[i][0]], { maxScale:3 }); s.innerHTML = MS.svg(parts[i][0]); });
    cap.textContent = "HBr adds to propene in two steps, through the more stable secondary carbocation.";
    return;
  }
  var stg = MS.stage(svg, { maxScale:2.4, dur:1300, adur:900, pause:900 });
  stg.load(fr);
  function play(){
    rep.hidden = true; stg.show(0); cap.textContent = HCAP.start;
    MV.wait(700, function(){
      stg.play(0, 3, function(k, ph){ cap.textContent = k === 1 ? (ph === "morph" ? HCAP.start : HCAP.a1) : k === 2 ? (ph === "morph" ? HCAP.m2 : HCAP.a2) : HCAP.end; },
        function(){ cap.textContent = HCAP.end; rep.hidden = false; });
    });
  }
  rep.addEventListener("click", play);
  play();
}

// ---------- Explore: Reaction sorter and mechanism stepper ----------
function explore(host, api){
  var S = api.S, C = api.content, BINS = C.bins, DEAL = MV.shuffle(C.cards, "rm-sort-deal");
  if (["sort", "mech", "lab"].indexOf(S.mode) < 0) S.mode = "sort";
  if (!MECH[S.mech]) S.mech = "m1";
  if (S.sub !== "draw") S.sub = "watch";
  S.frame = S.frame || {}; S.dstep = S.dstep || {}; S.draw = S.draw || {}; S.dok = S.dok || {};
  Object.keys(MECH).forEach(function(m){
    var M = MECH[m];
    S.frame[m] = clamp(+S.frame[m] || 0, 0, M.frames.length - 1); S.dstep[m] = clamp(+S.dstep[m] || 0, 0, M.steps.length);
    if (!Array.isArray(S.draw[m]) || S.draw[m].length !== M.steps.length) S.draw[m] = M.steps.map(function(st){ return st.draw.ok.map(function(){ return { t:"", h:"" }; }); });
    if (!Array.isArray(S.dok[m]) || S.dok[m].length !== M.steps.length) S.dok[m] = M.steps.map(function(){ return false; });
  });
  S.lab = S.lab || {}; if (!alkOf(S.lab.alk)) S.lab.alk = "propene"; if (!find(RG, S.lab.rg)) S.lab.rg = "HBr"; if (S.lab.pick !== "several") S.lab.pick = "one";
  if (!Array.isArray(S.lab.multi)) S.lab.multi = []; S.lab.multi = S.lab.multi.filter(alkOf);
  S.sort = S.sort || {}; S.sort.k = clamp(+S.sort.k || 0, 0, DEAL.length); S.sort.n = S.sort.n || {};
  var busy = false, eqHide = false, labHide = false, labT = 1, labPop = 0, hideArr = false, player = null, curF = 0, sortMsg = null, drawMsg = null, drawAnim = false;

  host.innerHTML = '<p class="how rm-how">' + C.how + '</p><div class="rm-grid"><div class="rm-left" data-mv="graph"><div class="rm-modes"></div><div class="eq-cap rm-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="rm-sortv"><p class="rm-dealn" aria-live="polite"></p><div class="rm-bins" role="group" aria-label="Reaction types"></div><div class="rm-sortfb" aria-live="polite"></div><div class="q-actions"><button type="button" class="btn ghost sm" data-k="rmdeal" data-sortact="deal">Deal again</button></div></div>' +
    '<div class="rm-mechv"><div class="rm-stagebox"><svg class="rm-svg" role="img" aria-label="Mechanism"></svg></div><p class="rm-legend tiny muted">Violet: electron pairs and curved arrows. <span class="rm-plus" aria-hidden="true">+</span> badge: a positive charge.</p><p class="rm-stepcap" aria-live="polite"></p><div class="rm-player"></div><div class="rm-drawc"></div></div>' +
    '<div class="rm-labv"></div></div>' +
    '<div class="rm-side"><div class="rm-ctrl"><div class="rm-mechc"><div class="rm-mechs"></div><div class="rm-subs"></div></div><div class="rm-labc"><div class="rm-pick"></div><div class="rm-alks"></div><div class="rm-multi"></div><div class="rm-rgs"></div></div></div>' +
    '<dl class="read rm-read" aria-live="polite"></dl></div></div>';
  var stg = MS.stage($(".rm-svg", host), { maxScale:1.7, dur:1100, adur:750, pause:350 });
  var modeRG = radios($(".rm-modes", host), { label:"Mode", aria:"Explore mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var mechRG = radios($(".rm-mechs", host), { label:"Mechanism", aria:"Mechanism", cls:"chips", options:Object.keys(MECH).map(function(m){ return { id:m, t:MECH[m].name }; }), value:S.mech,
    onChange:function(v){ S.mech = v; drawMsg = null; api.save(); loadMech(); paint(); } });
  var subRG = radios($(".rm-subs", host), { label:"Sub-mode", aria:"Watch or draw the arrows", options:[{ id:"watch", t:"Watch" }, { id:"draw", t:"Draw it" }], value:S.sub,
    onChange:function(v){ S.sub = v; drawMsg = null; api.save(); loadMech(); paint(); } });
  var pickRG = radios($(".rm-pick", host), { label:"Pick", aria:"Pick one alkene or several", options:[{ id:"one", t:"One alkene" }, { id:"several", t:"Several alkenes" }], value:S.lab.pick,
    onChange:function(v){ S.lab.pick = v; api.save(); paint(); } });
  var alkRG = radios($(".rm-alks", host), { label:"Alkene", aria:"Alkene", cls:"chips", options:ALK.map(function(a){ return { id:a.id, t:a.id }; }), value:S.lab.alk,
    onChange:function(v){ S.lab.alk = v; labHide = false; api.save(); paint(); } });
  var rgRG = radios($(".rm-rgs", host), { label:"Reagent", aria:"Reagent", cls:"chips", options:RG, value:S.lab.rg, onChange:function(v){ S.lab.rg = v; labHide = false; api.save(); paint(); } });

  function setMode(v){ S.mode = v; modeRG.set(v); sortMsg = null; drawMsg = null; api.save(); if (v === "mech") loadMech(); paint(); }
  function lock(b){
    busy = b; [modeRG, mechRG, subRG, pickRG, alkRG, rgRG].forEach(function(r){ r.lock(b); });
    $$(".rm-multi button, .rm-bins button, [data-sortact], .rm-drawc button", host).forEach(function(x){ x.disabled = b || x.dataset.off === "1"; });
    $(".rm-player", host).hidden = b || S.sub !== "watch";
  }
  // ----- mechanism -----
  function M(){ return MECH[S.mech]; }
  function loadMech(){
    var m = S.mech; hideArr = false;
    stg.load(S.sub === "watch" ? M().frames : M().framesD);
    if (S.sub === "watch") { makePlayer(); $(".rm-drawc", host).innerHTML = ""; }
    else { $(".rm-player", host).innerHTML = ""; player = null; buildDraw(); showDraw(); }
    void m;
  }
  function makePlayer(){
    var Mm = M(), n = Mm.steps.length, init = true;
    curF = S.frame[S.mech];
    player = C3.stepper($(".rm-player", host), { steps:Mm.frames, interval:2700,
      label:function(i){ return i === 0 ? "Start: step 1 of " + n + " is next" : "Step " + i + " of " + n + (i === n ? ": done" : ""); },
      onStep:function(i){ if (!init) goFrame(i); } });
    init = false; player.go(curF);
  }
  function goFrame(i){
    var from = curF; curF = i; S.frame[S.mech] = i; api.save();
    if (i === from + 1 && !MV.reduceMotion) stg.play(from, i, function(){ stepCap(i); }, function(){ paintRead(); });
    else stg.show(i, { arrows:!hideArr });
    stepCap(i); paintRead(); MV.changed();
  }
  function stepCap(i){
    var Mm = M(), c = Mm.caps[clamp(i, 0, Mm.caps.length - 1)];
    if (S.sub === "draw" && i < Mm.steps.length) c = Mm.caps[i].replace(/(Next|Arrow 1|Arrow:)[\s\S]*$/, "").trim() || "";
    $(".rm-stepcap", host).innerHTML = c;
    $(".rm-svg", host).setAttribute("aria-label", "Mechanism " + Mm.name.charAt(0) + ", frame " + (i + 1) + " of " + Mm.frames.length + ": " + Mm.aria[clamp(i, 0, Mm.aria.length - 1)]);
  }
  // draw it
  function drawScene(k){
    var m = S.mech, Mm = M(), s = MS.clone(Mm.framesD[k]), st = Mm.steps[k], d = S.draw[m][k];
    if (st) d.forEach(function(a, j){ if (!a.t || !a.h) return; var tl = find(st.draw.tails, a.t), hd = find(st.draw.heads, a.h); if (tl && hd) MS.arrow(s, "s" + j, tl.ref, hd.ref, bendFor(m, k, tl.ref, hd.ref)); });
    return s;
  }
  function showDraw(){ var k = S.dstep[S.mech]; stg.scene(drawScene(Math.min(k, M().steps.length))); stepCap(k); paintRead(); }
  function buildDraw(){
    var m = S.mech, Mm = M(), n = Mm.steps.length, k = S.dstep[m], box = $(".rm-drawc", host);
    if (k >= n) {
      box.innerHTML = '<p class="rm-dh"><strong>Mechanism complete.</strong> Product: ' + Mm.product + ". Reaction type: " + Mm.type + '.</p><div class="q-actions"><button type="button" class="btn ghost sm" data-dr="back" data-k="drback">Back a step</button><button type="button" class="btn ghost sm" data-dr="restart" data-k="drrestart">Start again</button></div>';
      return;
    }
    var st = Mm.steps[k], d = S.draw[m][k], ok = S.dok[m][k], na = d.length;
    box.innerHTML = '<p class="rm-dh"><strong>Step ' + (k + 1) + " of " + n + ":</strong> place " + (na === 1 ? "the arrow" : "the " + na + " arrows") + ". For each, choose its <strong>tail</strong> (where the electron pair starts) and its <strong>head</strong> (where it goes).</p>" +
      d.map(function(a, j){ return '<div class="rm-arw"><p class="rm-arwh">Arrow ' + (j + 1) + '</p><div class="rm-tl" data-j="' + j + '"></div><div class="rm-hd" data-j="' + j + '"></div></div>'; }).join("") +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-dr="check" data-k="drcheck">Check my arrows</button><button type="button" class="btn ghost sm" data-dr="next" data-k="drnext"' + (ok ? "" : ' disabled data-off="1"') + '>Next step</button><button type="button" class="btn ghost sm" data-dr="back" data-k="drback"' + (k ? "" : ' disabled data-off="1"') + '>Back a step</button></div><div class="rm-dfb" aria-live="polite">' + (drawMsg ? MV.fbHTML(drawMsg.k, drawMsg.h) : "") + "</div>";
    d.forEach(function(a, j){
      radios($('.rm-tl[data-j="' + j + '"]', box), { label:"Tail", aria:"Arrow " + (j + 1) + " tail: where the electron pair starts", cls:"chips", options:st.draw.tails, value:a.t, onChange:function(v){ a.t = v; edited(); } });
      radios($('.rm-hd[data-j="' + j + '"]', box), { label:"Head", aria:"Arrow " + (j + 1) + " head: where the electron pair goes", cls:"chips", options:st.draw.heads, value:a.h, onChange:function(v){ a.h = v; edited(); } });
    });
    function edited(){ S.dok[m][k] = false; drawMsg = null; api.save(); var nb = $('[data-dr="next"]', box); nb.disabled = true; nb.dataset.off = "1"; $(".rm-dfb", box).innerHTML = ""; showDraw(); MV.changed(); }
  }
  $(".rm-drawc", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-dr]"); if (!b || b.disabled || busy || drawAnim) return;
    var m = S.mech, k = S.dstep[m], a = b.dataset.dr, Mm = M();
    if (a === "check") {
      var r = judgeDraw(m, k, S.draw[m][k]);
      if (r.ok) { S.dok[m][k] = true; drawMsg = { k:"good", h:"<strong>✓ Those are the electron moves.</strong> " + Mm.steps[k].flow.charAt(0).toUpperCase() + Mm.steps[k].flow.slice(1) + ". Press <strong>Next step</strong> to watch it happen." }; }
      else drawMsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + r.msg };
      api.save(); buildDraw(); MV.focusFb($(".rm-drawc", host));
      if (r.ok && !MV.reduceMotion) { drawAnim = true; stg.sceneArrows(drawScene(k), function(){ drawAnim = false; }); } else showDraw();
      MV.changed(); return;
    }
    if (a === "next" && S.dok[m][k]) {
      drawAnim = true; var A = drawScene(k);
      S.dstep[m] = k + 1; drawMsg = null; api.save();
      stg.pair(A, Mm.framesD[k + 1], function(){ drawAnim = false; buildDraw(); showDraw(); var f = $('[data-k="drcheck"]', host) || $('[data-k="drrestart"]', host); if (f) f.focus({ preventScroll:true }); });
      stepCap(k + 1); paintRead(); return;
    }
    if (a === "back") { S.dstep[m] = Math.max(0, k - 1); drawMsg = null; api.save(); buildDraw(); showDraw(); return; }
    if (a === "restart") { S.dstep[m] = 0; drawMsg = null; api.save(); buildDraw(); showDraw(); }
  });
  // ----- sort -----
  function paintSort(){
    var k = S.sort.k, card = DEAL[k];
    $(".rm-dealn", host).innerHTML = card ? "Card " + (k + 1) + " of " + DEAL.length + ": tap its type." : "<strong>All " + DEAL.length + " cards sorted.</strong> Every reaction fits one type.";
    MV.keepFocus($(".rm-bins", host), function(){
      $(".rm-bins", host).innerHTML = BINS.map(function(b){ var c = S.sort.n[b.id] || 0; return '<button type="button" class="rm-bin" data-bin="' + b.id + '" data-k="bin' + b.id + '"' + (card && !busy ? "" : ' disabled data-off="' + (card ? 0 : 1) + '"') + '><span class="rm-bint">' + b.t + '</span><span class="rm-cnt" aria-label="' + c + ' sorted">' + c + "</span></button>"; }).join("");
    });
    $(".rm-sortfb", host).innerHTML = sortMsg ? MV.fbHTML(sortMsg.k, sortMsg.h) : "";
  }
  $(".rm-sortv", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.sortact === "deal") { S.sort = { k:0, n:{} }; sortMsg = null; api.save(); paint(); return; }
    var bin = b.dataset.bin; if (!bin) return;
    var card = DEAL[S.sort.k]; if (!card) return;
    var nm = find(BINS, bin).t;
    if (bin === card.type) { S.sort.n[bin] = (S.sort.n[bin] || 0) + 1; S.sort.k++; sortMsg = { k:"good", h:"<strong>✓ " + nm.charAt(0).toUpperCase() + nm.slice(1) + ".</strong> " + card.look }; }
    else {
      var w = (bin === "add" && card.type === "sub") || (bin === "sub" && card.type === "add") ? C.sig.add : C.sig[bin];
      sortMsg = { k:"bad", h:"<strong>✗ Not " + nm + ".</strong> " + w + " Try another type." };
    }
    api.save(); paint(); MV.focusFb($(".rm-sortv", host));
  });
  // ----- Markovnikov lab -----
  function barHTML(cls, t){
    var w = Math.round(cls / 3 * 100 * t);
    var full = t >= 1;
    return '<div class="rm-bar"><div class="rm-bartr"><span class="rm-barfill" style="width:' + w + '%"></span></div><div class="rm-bartk">' + [1, 2, 3].map(function(c){ return '<span class="' + (full && c === cls ? "on" : "") + '">' + CLS[c] + "</span>"; }).join("") + "</div>" + (full ? '<span class="vh">Stability: ' + CLS[cls] + " carbocation.</span>" : "") + "</div>";
  }
  function pathHTML(A, p, role){
    var rg = S.lab.rg, show = !labHide && labT >= 1, sc = role === "major" && labPop ? 1 + 0.08 * Math.sin(Math.PI * labPop) : 1;
    var word = role === "same" ? "the only product" : role, full = labT >= 1;
    return '<div class="rm-path ' + (show ? role : "pending") + '"' + (sc !== 1 ? ' style="transform:scale(' + r1(sc * 1000) / 1000 + ')"' : "") + '><p class="rm-ph">H⁺ adds to ' + p.on + " → C⁺ on " + p.at + '</p><p class="rm-cat">' + catHTML(p.cat) + (full ? " <small>" + CLS[p.cls] + "</small>" : "") + "</p>" + barHTML(p.cls, labT) +
      '<p class="rm-prod">' + (show ? "→ <strong>" + p.pr[rg] + "</strong> " + fHTML(prodF(p.cat, rg)) + ' <span class="rm-role">' + word + "</span>" : "→ " + muted("?")) + "</p></div>";
  }
  function paintLab(){
    var box = $(".rm-labv", host), A = alkOf(S.lab.alk), rg = S.lab.rg, h;
    if (S.lab.pick === "one") {
      var mj = majorOf(A), mn = minorOf(A);
      h = '<p class="rm-labh"><strong>' + A.id + "</strong> " + fHTML(A.cond) + " + " + find(RG, rg).t + ": the two possible carbocations</p>";
      h += '<div class="rm-paths">' + A.p.map(function(p){ return pathHTML(A, p, A.sym ? "same" : p === mj ? "major" : "minor"); }).join("") + "</div>";
      h += '<p class="rm-labnote">' + (labHide || labT < 1 ? muted("Watch the bars…") : A.sym ? "Symmetric alkene: both ends give the same secondary carbocation, so there’s only one product." : "The more stable " + CLS[mj.cls] + " carbocation forms faster, so its product is major (Markovnikov’s rule).") + "</p>";
    } else {
      var sel = S.lab.multi.map(alkOf);
      h = '<p class="rm-labh">Compare alkenes + ' + find(RG, rg).t + ": tap the alkene chips to select several.</p>";
      h += sel.length ? MV.tableHTML({ head:["Alkene", "More stable carbocation", "Major product"], rows:sel.map(function(a){ var p = majorOf(a); return [a.id, catHTML(p.cat) + " (" + CLS[p.cls] + ")", "<strong>" + p.pr[rg] + "</strong>" + (a.sym ? " (only product)" : ""), ]; }), caption:"Selected alkenes and their major products" }) : '<p class="muted">No alkenes selected yet.</p>';
    }
    box.innerHTML = h;
    var one = S.lab.pick === "one";
    $(".rm-alks", host).hidden = !one; $(".rm-multi", host).hidden = one;
    MV.keepFocus($(".rm-multi", host), function(){
      $(".rm-multi", host).innerHTML = '<span class="rg-wrap"><span class="rg-lab">Alkenes</span><span class="rm-mchips" role="group" aria-label="Alkenes (select several)">' + ALK.map(function(a){ var on = S.lab.multi.indexOf(a.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-multi="' + a.id + '" data-k="mu' + a.id + '"' + (busy ? " disabled" : "") + ">" + a.id + "</button>"; }).join("") + "</span></span>";
    });
  }
  $(".rm-multi", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-multi]"); if (!b || b.disabled || busy) return;
    var id = b.dataset.multi, i = S.lab.multi.indexOf(id);
    if (i >= 0) S.lab.multi.splice(i, 1); else S.lab.multi.push(id);
    S.lab.multi.sort(function(x, y){ return ALK.indexOf(alkOf(x)) - ALK.indexOf(alkOf(y)); });
    api.save(); paint();
  });
  // ----- caption, readouts -----
  function paintCap(){
    var e = "";
    if (S.mode === "sort") { var c = DEAL[S.sort.k]; e = c ? c.t : "All cards sorted"; }
    else if (S.mode === "mech") e = eqHide ? M().eq.replace(/→[^<]*/, "→ ? ") : M().eq;
    else if (S.lab.pick === "one") { var A = alkOf(S.lab.alk), p = majorOf(A); e = A.cond + " + " + find(RG, S.lab.rg).t + " → " + (labHide || labT < 1 ? "?" : prodF(p.cat, S.lab.rg) + ' <span class="rm-capn">(major)</span>'); }
    else e = "Several alkenes + " + find(RG, S.lab.rg).t;
    $(".rm-cap", host).innerHTML = e;
  }
  function paintRead(){
    var rows;
    if (S.mode === "sort") {
      var placed = BINS.filter(function(b){ return S.sort.n[b.id]; }).map(function(b){ return b.t + " " + S.sort.n[b.id]; });
      rows = [["Cards sorted", S.sort.k + " of " + DEAL.length], ["Tally", placed.length ? placed.join(" · ") : muted("none yet")], ["What to look for", "Count reactants and products. Did a C=C appear or disappear? Did water appear or get used? Was O gained or H lost?"]];
    } else if (S.mode === "mech") {
      var Mm = M(), n = Mm.steps.length, i = S.sub === "watch" ? curF : Math.min(S.dstep[S.mech], n), st = i > 0 ? Mm.steps[i - 1] : null, wait = muted(S.sub === "watch" ? "press Step" : "place and check the arrows");
      rows = [["Step", i === 0 ? "0 of " + n + " (start)" : i + " of " + n], ["Bond broken", st ? st.broken : wait], ["Bond formed", st ? st.formed : wait], ["Electron flow", st ? st.flow + ' <span class="tiny muted">(source → sink)</span>' : wait],
        ["Intermediate", st ? st.inter : wait], ["Product", i === n ? "<strong>" + Mm.product + "</strong>" : muted("after the last step")], ["Reaction type", eqHide && i < n ? muted("?") : Mm.type]];
    } else if (S.lab.pick === "one") {
      var A = alkOf(S.lab.alk), mj = majorOf(A), mn = minorOf(A), hid = labHide || labT < 1, rg = S.lab.rg;
      rows = [["Alkene", A.id + ", " + fHTML(A.cond)], ["Reagent", find(RG, rg).t], ["Carbocations", hid ? muted("watch the bars") : A.p.map(function(p){ return "H⁺ on " + p.on + " → " + CLS[p.cls] + " on " + p.at; }).join("; ")],
        ["Major product", hid ? muted("?") : "<strong>" + mj.pr[rg] + "</strong>"], ["Minor product", hid ? muted("?") : A.sym ? "none: both ends give the same product" : mn.pr[rg]],
        ["Rule", "Markovnikov: H adds to the C=C carbon that already has more H’s (the more stable carbocation forms)"], ["Reaction type", "addition"]];
    } else rows = [["Selected", S.lab.multi.length ? S.lab.multi.join(", ") : muted("none")], ["Reagent", find(RG, S.lab.rg).t], ["Reaction type", "addition"]];
    $(".rm-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paint(){
    var md = S.mode;
    $(".rm-sortv", host).hidden = md !== "sort"; $(".rm-mechv", host).hidden = md !== "mech"; $(".rm-labv", host).hidden = md !== "lab";
    $(".rm-mechc", host).hidden = md !== "mech"; $(".rm-labc", host).hidden = md !== "lab";
    $(".rm-player", host).hidden = busy || S.sub !== "watch"; $(".rm-drawc", host).hidden = S.sub !== "draw";
    if (md === "sort") paintSort(); else if (md === "lab") paintLab();
    paintCap(); paintRead(); MV.changed();
  }
  if (window.ResizeObserver) { var lastW = 0; new ResizeObserver(function(){ var w = Math.round($(".rm-stagebox", host).getBoundingClientRect().width); if (!w || Math.abs(w - lastW) < 24 || stg.busy()) return; lastW = w; stg.refit(); if (S.mode === "mech") { if (S.sub === "watch") stg.show(curF, { arrows:!hideArr }); else showDraw(); } }).observe($(".rm-stagebox", host)); }

  // ---------- predictions ----------
  var hooks = {
    start:function(p){
      stg.cancel(); drawAnim = false; lock(true);
      if (p.id === "p1" || p.id === "p3") {
        S.mode = "lab"; S.lab.pick = "one"; S.lab.alk = p.id === "p1" ? "propene" : "but-2-ene"; S.lab.rg = "HBr"; labHide = true; labT = 0; labPop = 0;
        modeRG.set("lab"); pickRG.set("one"); alkRG.set(S.lab.alk); rgRG.set("HBr");
      } else {
        S.mode = "mech"; S.sub = "watch"; S.mech = p.id === "p2" ? "m2" : "m3"; S.frame[S.mech] = 0; modeRG.set("mech"); subRG.set("watch"); mechRG.set(S.mech);
        eqHide = p.id === "p4"; loadMech(); hideArr = true; curF = 0; stg.show(0, { arrows:false }); stepCap(0);
        $(".rm-stepcap", host).innerHTML = muted("Watch the electrons move…");
      }
      api.save(); paint(); lock(true);
    },
    run:function(p, done){
      function fin(){ eqHide = false; lock(false); paint(); done(); }
      if (p.id === "p1" || p.id === "p3") {
        MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){ labT = t; paintLab(); }, done:function(){
          labT = 1; labHide = false; labPop = 0;
          MV.tween({ dur:700, step:function(t){ labPop = t; paintLab(); paintCap(); paintRead(); }, done:function(){ labPop = 0; fin(); } });
        } });
        return;
      }
      var n = M().frames.length - 1;
      stg.arrows(0, function(){
        hideArr = false;
        stg.play(0, n, function(k){ stepCap(k); }, function(){ S.frame[S.mech] = n; api.save(); makePlayer(); fin(); });
      });
    }
  };
  // ---------- challenges ----------
  function chal(id){
    if (id === "tc1") {
      var d = S.draw.m1 && S.draw.m1[0];
      if (!d || d.every(function(a){ return !a.t && !a.h; })) return { ok:false, msg:"Choose Mechanism mode, mechanism 1 and Draw it, then place both arrows for step 1." };
      var r = judgeDraw("m1", 0, d); return r.ok ? { ok:true } : { ok:false, msg:r.msg };
    }
    var L = S.lab;
    if (id === "tc2") {
      if (L.pick !== "one") return { ok:false, msg:"Set Pick to One alkene, then choose an alkene and a reagent." };
      if (L.alk === "2-methylpropene" && L.rg === "HCl") return { ok:true };
      if (L.alk === "propene" && L.rg === "HCl") return { ok:false, msg:"That gives 2-chloropropane." };
      if (L.alk === "2-methylpropene" && L.rg === "HBr") return { ok:false, msg:"Bromine, not chlorine." };
      if (L.alk === "but-1-ene" && L.rg === "HCl") return { ok:false, msg:"2-chlorobutane." };
      return { ok:false, msg:"That gives " + majorOf(alkOf(L.alk)).pr[L.rg] + "." };
    }
    if (id === "tc3") {
      var set = L.multi || [];
      function has(x){ return set.indexOf(x) >= 0; }
      if (!set.length) return { ok:false, msg:"In the lab, set Pick to Several alkenes, then tap every alkene that fits." };
      if (set.length === 2 && has("but-1-ene") && has("but-2-ene")) return { ok:true };
      if (has("2-methylpropene")) return { ok:false, msg:"That gives 2-bromo-2-methylpropane: a different carbon skeleton." };
      if (has("2-methylbut-2-ene")) return { ok:false, msg:"Five carbons." };
      if (has("propene")) return { ok:false, msg:"Propene has only three carbons: it gives 2-bromopropane." };
      if (has("but-1-ene")) return { ok:false, msg:"But-2-ene also gives a secondary carbocation on C2." };
      return { ok:false, msg:"But-1-ene also gives 2-bromobutane: H⁺ adds to C1, so the secondary carbocation forms on C2." };
    }
    return { ok:false };
  }
  if (S.mode === "mech") loadMech(); else { stg.load(M().frames); }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- species for the roadmap routes and the task (model rules, plan §4) ----------
// fam: alkene, alkane, bromide, alcohol (cls 1–3), aldehyde, ketone, acid, ester, amide. Transitions by step id.
var SP = {
  "ethene":{ fam:"alkene", n:2, cond:"CH₂=CH₂", h2o:"ethanol", hbr:"bromoethane", h2:"ethane" },
  "propene":{ fam:"alkene", n:3, cond:"CH₂=CH–CH₃", h2o:"propan-2-ol", hbr:"2-bromopropane", h2:"propane" },
  "but-1-ene":{ fam:"alkene", n:4, cond:"CH₂=CH–CH₂–CH₃", h2o:"butan-2-ol", hbr:"2-bromobutane", h2:"butane" },
  "but-2-ene":{ fam:"alkene", n:4, cond:"CH₃–CH=CH–CH₃", h2o:"butan-2-ol", hbr:"2-bromobutane", h2:"butane" },
  "2-methylpropene":{ fam:"alkene", n:4, cond:"CH₂=C(CH₃)–CH₃", h2o:"2-methylpropan-2-ol", hbr:"2-bromo-2-methylpropane", h2:"2-methylpropane" },
  "ethane":{ fam:"alkane", n:2, cond:"CH₃–CH₃" }, "propane":{ fam:"alkane", n:3, cond:"CH₃–CH₂–CH₃" },
  "butane":{ fam:"alkane", n:4, cond:"CH₃–CH₂–CH₂–CH₃" }, "2-methylpropane":{ fam:"alkane", n:4, cond:"CH₃–CH(CH₃)–CH₃" },
  "bromoethane":{ fam:"bromide", n:2, cond:"CH₃–CH₂–Br", oh:"ethanol" }, "2-bromopropane":{ fam:"bromide", n:3, cond:"CH₃–CHBr–CH₃", oh:"propan-2-ol" },
  "2-bromobutane":{ fam:"bromide", n:4, cond:"CH₃–CHBr–CH₂–CH₃", oh:"butan-2-ol" }, "2-bromo-2-methylpropane":{ fam:"bromide", n:4, cond:"CH₃–CBr(CH₃)–CH₃", oh:"2-methylpropan-2-ol" },
  "ethanol":{ fam:"alcohol", cls:1, n:2, cond:"CH₃–CH₂–OH", ox:"ethanal", elim:"ethene" },
  "propan-2-ol":{ fam:"alcohol", cls:2, n:3, cond:"CH₃–CH(OH)–CH₃", ox:"propanone", elim:"propene" },
  "butan-2-ol":{ fam:"alcohol", cls:2, n:4, cond:"CH₃–CH(OH)–CH₂–CH₃", ox:"butanone" },
  "2-methylpropan-2-ol":{ fam:"alcohol", cls:3, n:4, cond:"CH₃–C(OH)(CH₃)–CH₃", elim:"2-methylpropene" },
  "ethanal":{ fam:"aldehyde", n:2, cond:"CH₃–CHO", ox:"ethanoic acid", red:"ethanol" },
  "propanone":{ fam:"ketone", n:3, cond:"CH₃–CO–CH₃", red:"propan-2-ol" }, "butanone":{ fam:"ketone", n:4, cond:"CH₃–CO–CH₂–CH₃", red:"butan-2-ol" },
  "ethanoic acid":{ fam:"acid", n:2, cond:"CH₃–COOH", est:"ethyl ethanoate", cond2:"N-methylethanamide" },
  "ethyl ethanoate":{ fam:"ester", n:4, cond:"CH₃–COO–CH₂–CH₃", hyd:"ethanoic acid" },
  "N-methylethanamide":{ fam:"amide", n:3, cond:"CH₃–CONH–CH₃", hyd:"ethanoic acid" }
};
var FAMW = { alkene:"alkene", alkane:"alkane", bromide:"alkyl halide (bromide)", aldehyde:"aldehyde", ketone:"ketone", acid:"carboxylic acid", ester:"ester", amide:"amide" };
function famOf(id){ var s = SP[id]; return s.fam === "alcohol" ? CLS[s.cls] + " alcohol" : FAMW[s.fam]; }
function nodeOf(id){ var s = SP[id]; return s.fam === "alcohol" ? ["", "p", "s", "t"][s.cls] : { alkene:"alkene", alkane:"alkane", bromide:"halide", aldehyde:"ald", ketone:"ket", acid:"acid", ester:"ester", amide:"amide" }[s.fam]; }
var OXNO = { alkene:"Alkenes don’t oxidize to ketones this way.", alkane:"Alkanes don’t oxidize this way.", bromide:"No C–OH to oxidize.", ketone:"Ketones don’t oxidize further.",
  acid:"An acid is the top of the oxidation ladder.", ester:"No C–OH to oxidize.", amide:"No C–OH to oxidize." };
// react(id, step) -> {to, note} | {none:reason}. step: h2o, hbr, h2, oh, ox, red, elim, est, cond, hyd
function react(id, step){
  var s = SP[id], f = s.fam;
  if (step === "h2o" || step === "hbr") return f === "alkene" ? { to:s[step], note:step === "h2o" ? "Markovnikov: OH on the more substituted carbon" : "Markovnikov: Br on the more substituted carbon" } : { none:"No C=C to add across." };
  if (step === "h2") { if (f === "alkene") return { to:s.h2, note:"H₂ adds across the C=C" }; if (s.red) return { to:s.red, note:"reduction: the C=O gains H₂" }; return { none:"No C=C (or C=O) for H₂ to add to." }; }
  if (step === "red") return s.red ? { to:s.red, note:"reduction: the C=O gains H₂" } : { none:"No C=O to reduce." };
  if (step === "oh") return f === "bromide" ? { to:s.oh, note:"OH swaps in for Br on the same carbon" } : { none:"No halogen to swap for OH." };
  if (step === "ox") {
    if (f === "alcohol") return s.cls === 3 ? { none:"Tertiary alcohol: no H on the C–OH carbon." } : { to:s.ox, note:s.cls === 1 ? "primary alcohol → aldehyde" : "secondary alcohol → ketone" };
    if (f === "aldehyde") return { to:s.ox, note:"aldehyde → acid" };
    return { none:OXNO[f] };
  }
  if (step === "elim") return s.elim ? { to:s.elim, note:"water leaves and a C=C forms" } : { none:f === "alcohol" ? "No dehydration in this model." : "Only alcohols lose water here." };
  if (step === "est") return s.est ? { to:s.est, note:"esterified with ethanol" } : { none:"Only a carboxylic acid esterifies." };
  if (step === "cond") return s.cond2 ? { to:s.cond2, note:"condensed with methylamine" } : { none:"Only a carboxylic acid condenses with an amine." };
  if (step === "hyd") return s.hyd ? { to:s.hyd, note:"water splits the " + f } : { none:"Only esters and amides hydrolyse here." };
  return { none:"No reaction." };
}
function spHTML(id){ return '<span class="rm-sp">' + fHTML(SP[id].cond) + ' <span class="rm-spn">' + id + '</span> <span class="rm-spf">' + famOf(id) + "</span></span>"; }

// ---------- Part 3: Reaction roadmap ----------
// Map layout (940 × 510 box; scrolls on phones). Edges: [from, to] node ids ("grp" = the alcohols box), the right chip, the line, the slot centre.
var MAP = {
  W:940, H:510, grp:{ x:225, y:95, w:180, h:330 },
  nodes:{ alkane:[70, 60], alkene:[70, 260], halide:[70, 460], p:[315, 160], s:[315, 270], t:[315, 380], ald:[550, 160], ket:[550, 270], acid:[760, 160], ester:[760, 340], amide:[760, 50] },
  edges:[
    { id:"e1", from:"alkene", to:"alkane", ok:"h2", l:[70, 242, 70, 79], slot:[70, 160] },
    { id:"e2", from:"alkene", to:"halide", ok:"hx", l:[70, 278, 70, 441], slot:[70, 360] },
    { id:"e3", from:"alkene", to:"grp", ok:"h2o", l:[110, 252, 224, 252], slot:[167, 222] },
    { id:"e5", from:"grp", to:"alkene", ok:"elim", l:[224, 270, 110, 270], slot:[167, 300] },
    { id:"e4", from:"halide", to:"grp", ok:"oh", l:[124, 455, 224, 405], slot:[167, 486] },
    { id:"e6", from:"p", to:"ald", ok:"ox", l:[383, 160, 504, 160], slot:[443, 132] },
    { id:"e7", from:"s", to:"ket", ok:"ox", l:[392, 262, 511, 262], slot:[451, 234] },
    { id:"e9", from:"ket", to:"s", ok:"red", l:[511, 280, 392, 280], slot:[451, 308] },
    { id:"e8", from:"ald", to:"acid", ok:"ox", l:[596, 160, 689, 160], slot:[642, 196] },
    { id:"e10", from:"acid", to:"ester", ok:"est", l:[742, 178, 742, 322], slot:[680, 250] },
    { id:"e11", from:"ester", to:"acid", ok:"hyd", l:[778, 322, 778, 178], slot:[840, 250] },
    { id:"e12", from:"acid", to:"amide", ok:"cond", l:[760, 142, 760, 68], slot:[840, 100] }
  ],
  trap:{ l:[384, 372, 520, 290], slot:[466, 368] }
};
// specific feedback for a wrong chip on an arrow (written for this module)
var MAPFB = {
  "e1|red":"On this map, H₂ across a C=C is “add H₂ (catalyst)”; “reduce” is for a C=O.",
  "e9|h2":"This arrow turns a C=O into C–OH: that’s “reduce (add H₂)”.",
  "e9|ox":"Ketone → secondary alcohol goes the other way: the carbon gains H. That’s reduction.",
  "e6|red":"This arrow goes up the oxidation ladder: the carbon loses H.", "e7|red":"This arrow goes up the oxidation ladder: the carbon loses H.", "e8|red":"This arrow goes up the oxidation ladder: the aldehyde gains O.",
  "e10|hyd":"Hydrolysis splits an ester; this arrow makes one.", "e11|est":"This arrow splits the ester with water: hydrolysis.", "e10|cond":"With an amine the product is an amide; this arrow makes an ester.",
  "e12|est":"N, not O, joins: an amide by condensation.", "e12|hyd":"Hydrolysis splits an amide; this arrow makes one.",
  "e3|elim":"This arrow adds water to the C=C. Elimination takes water out (the arrow back).", "e5|h2o":"This arrow points back to the alkene: water is taken out, so it’s elimination.",
  "e5|hyd":"Hydrolysis adds water; this arrow removes water.", "e4|hx":"This arrow starts at the alkyl halide: OH⁻ swaps in for the halogen.",
  "e2|oh":"OH⁻ substitutes on an alkyl halide; this arrow starts at the alkene and adds H and X.", "e3|oh":"OH⁻ substitutes on an alkyl halide; this arrow starts at the alkene.",
  "e2|h2o":"Adding water makes an alcohol; this arrow ends at the alkyl halide.", "e3|hx":"Adding HX makes an alkyl halide; this arrow ends at the alcohols."
};
var CHIPDO = { h2o:"“add H₂O” adds water across a C=C to make an alcohol.", hx:"“add HX” adds H and a halogen across a C=C.", h2:"“add H₂” adds hydrogen across a C=C to make an alkane.",
  oh:"“substitute with OH⁻” swaps a halogen for OH.", elim:"“eliminate H₂O” takes water out of an alcohol to make a C=C.", ox:"“oxidize [O]” removes H from the C–OH carbon (or adds O to an aldehyde).",
  red:"“reduce” adds H₂ to a C=O.", est:"“esterify” joins an acid and an alcohol.", cond:"“condense (+ amine)” joins an acid and an amine.", hyd:"“hydrolyse” splits an ester (or amide) with water." };
function part3(host, api){
  var S = api.S, P3 = MV.C.part3, s1 = P3.s1, s2 = P3.s2, s3 = P3.s3, N = s1.nodes;
  S.map = S.map || {}; if (S.mm !== "route") S.mm = "fill"; S.route = S.route || {}; if (!find(s2.targets, S.route.tg)) S.route = { tg:"r1" };
  var chip = null, mapMsg = null, routeMsg = null, isoBusy = false, aeBusy = false, aeT = S.ae ? 1 : 0;
  function chipT(id){ return find(s1.chips, id).t; }
  function nodeName(k){ return k === "grp" ? "alcohols" : N[k]; }
  function resetRoute(){ var T = find(s2.targets, S.route.tg); S.route = { tg:T.id, cur:T.start, steps:[], alc:false, done:false }; routeMsg = null; }
  if (!S.route.cur || !SP[S.route.cur]) resetRoute();
  host.innerHTML = '<div class="rm-p3">' +
    '<div class="rm-mapcard"><div class="rm-mm"></div><div class="rm-mmtext"></div><div class="rm-chips"></div><div class="rm-r2"></div>' +
    '<div class="rm-mapbox"><div class="rm-map" role="group" aria-label="Reaction roadmap" style="width:' + MAP.W + "px;height:" + MAP.H + 'px"><svg class="rm-mapsvg" viewBox="0 0 ' + MAP.W + " " + MAP.H + '" width="' + MAP.W + '" height="' + MAP.H + '" aria-hidden="true"></svg><div class="rm-mapnodes"></div><div class="rm-slots"></div></div></div>' +
    '<p class="rm-scrollnote tiny muted">Scroll the map sideways to see all of it.</p><p class="rm-mapn tiny muted" aria-live="polite"></p><div class="rm-mapfb" aria-live="polite"></div><div class="rm-routelog"></div></div>' +
    '<div class="rm-st3"><h3>' + s3.title + '</h3><p>' + s3.isoIntro + '</p><div class="rm-isobox"><svg class="rm-isosvg" role="img" aria-label=""></svg></div><div class="q-actions"><button type="button" class="btn primary sm" data-iso="run" data-k="isorun">Run the experiment</button></div><div class="rm-isodata" aria-live="polite"></div>' +
    '<p class="rm-aeintro">' + s3.aeIntro + '</p><div class="rm-ae" aria-live="polite"></div><div class="q-actions"><button type="button" class="btn primary sm" data-ae="go" data-k="aego">Compare the routes</button></div><div class="rm-aeafter" aria-live="polite"></div>' +
    '<details class="alg rm-aealg"><summary>Check it with data: the molar masses</summary><div class="rm-aecalc"></div></details></div></div>';
  var mmRG = radios($(".rm-mm", host), { label:"Station", aria:"Map station", options:[{ id:"fill", t:"1. Fill the map" }, { id:"route", t:"2. Plan a route" }], value:S.mm,
    onChange:function(v){ S.mm = v; mapMsg = null; api.save(); paintMap(); } });
  var chipRG = null, tgRG = null;
  function buildSide(){
    var cbox = $(".rm-chips", host), rbox = $(".rm-r2", host);
    cbox.innerHTML = ""; rbox.innerHTML = "";
    if (S.mm === "fill") { var d = document.createElement("div"); cbox.appendChild(d); chipRG = radios(d, { label:"Label chips", aria:"Label chips", cls:"chips", options:s1.chips, value:chip || "", onChange:function(v){ chip = v; mapMsg = null; paintMapFb(); } }); tgRG = null; }
    else { var e = document.createElement("div"); rbox.appendChild(e); tgRG = radios(e, { label:"Target", aria:"Route target", cls:"chips", options:s2.targets, value:S.route.tg, onChange:function(v){ S.route.tg = v; resetRoute(); api.save(); paintMap(); } }); chipRG = null; }
  }
  // static drawing: nodes, group box, edges
  (function(){
    var g = MAP.grp, s = '<rect x="' + g.x + '" y="' + g.y + '" width="' + g.w + '" height="' + g.h + '" rx="14" fill="none" stroke="var(--rule)" stroke-width="2" stroke-dasharray="6 5"/>';
    function arr(l, cls, dash){ var dx = l[2] - l[0], dy = l[3] - l[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, hs = 10, x = l[2], y = l[3];
      return '<g class="' + cls + '"><line x1="' + l[0] + '" y1="' + l[1] + '" x2="' + r1(x - ux * 6) + '" y2="' + r1(y - uy * 6) + '" stroke-width="2.4"' + (dash ? ' stroke-dasharray="7 6"' : "") + '/><path d="M' + x + " " + y + " L" + r1(x - ux * hs - uy * hs * 0.55) + " " + r1(y - uy * hs + ux * hs * 0.55) + " L" + r1(x - ux * hs + uy * hs * 0.55) + " " + r1(y - uy * hs - ux * hs * 0.55) + 'Z"/></g>'; }
    MAP.edges.forEach(function(e){ s += arr(e.l, "rm-edge rm-e-" + e.id); });
    s += arr(MAP.trap.l, "rm-edge rm-trap", true);
    $(".rm-mapsvg", host).innerHTML = s;
    $(".rm-mapnodes", host).innerHTML = '<span class="rm-grpl" style="left:' + (g.x + g.w / 2) + "px;top:" + (g.y + 16) + 'px">alcohols</span>' + Object.keys(MAP.nodes).map(function(k){ var p = MAP.nodes[k]; return '<span class="rm-node" data-node="' + k + '" style="left:' + p[0] + "px;top:" + p[1] + 'px">' + N[k] + "</span>"; }).join("");
  })();
  function slotLabel(e){ return "Arrow from " + nodeName(e.from) + " to " + nodeName(e.to); }
  function paintMap(){
    var route = S.mm === "route", filled = MAP.edges.filter(function(e){ return S.map[e.id]; }).length, R = S.route, curN = route ? nodeOf(R.cur) : null;
    $(".rm-mmtext", host).innerHTML = route ? "<h3>" + s2.title + "</h3><p>" + s2.intro + "</p>" : "<h3>" + s1.title + "</h3><p>" + s1.intro + "</p>";
    if ((route && !tgRG) || (!route && !chipRG)) buildSide();
    MV.keepFocus($(".rm-slots", host), function(){
      $(".rm-slots", host).innerHTML = MAP.edges.map(function(e){
        var lab = route || S.map[e.id] ? chipT(e.ok) : "", from = route && (e.from === curN || (e.from === "grp" && /^[pst]$/.test(curN))), used = route && R.steps.some(function(st){ return st.e === e.id; });
        var aria = (route ? "Step: " + chipT(e.ok) + ", " : "") + slotLabel(e) + (route ? "" : lab ? ": " + lab : ": blank. Choose a chip, then tap here.");
        return '<button type="button" class="rm-slot' + (lab ? " filled" : "") + (from ? " from" : "") + (used ? " used" : "") + '" data-slot="' + e.id + '" data-k="sl' + e.id + '" style="left:' + e.slot[0] + "px;top:" + e.slot[1] + 'px" aria-label="' + esc(MV.plain(aria)) + '">' + (lab || "?") + "</button>";
      }).join("") + '<button type="button" class="rm-slot fixed" data-slot="trap" data-k="sltrap" style="left:' + MAP.trap.slot[0] + "px;top:" + MAP.trap.slot[1] + 'px" aria-label="Arrow from tertiary alcohol to ketone: crossed out, oxidize gives no reaction.">✗ [O]: no reaction</button>';
    });
    $$(".rm-node", host).forEach(function(nd){ nd.classList.toggle("cur", route && nd.dataset.node === curN); });
    MAP.edges.forEach(function(e){ var g = $(".rm-e-" + e.id, host); if (g) g.classList.toggle("used", route && R.steps.some(function(st){ return st.e === e.id; })); });
    $(".rm-chips", host).hidden = route; $(".rm-r2", host).hidden = !route;
    $(".rm-mapn", host).textContent = route ? "Your molecule now: " + R.cur + " (" + famOf(R.cur) + "). Arrows that start here are outlined." : "Arrows labelled: " + filled + " of " + MAP.edges.length + ".";
    paintMapFb(); paintLog();
  }
  function paintMapFb(){
    var box = $(".rm-mapfb", host), filled = MAP.edges.every(function(e){ return S.map[e.id]; });
    if (S.mm === "fill") box.innerHTML = (mapMsg ? MV.fbHTML(mapMsg.k, mapMsg.h) : "") + (filled ? MV.fbHTML("good", "<strong>✓ " + s1.done + "</strong>") : "") + '<div class="q-actions"><button type="button" class="btn ghost sm" data-mapact="clear" data-k="mapclear">Clear the map</button></div>';
    else box.innerHTML = routeMsg ? MV.fbHTML(routeMsg.k, routeMsg.h) : "";
  }
  function paintLog(){
    var box = $(".rm-routelog", host), R = S.route, T = find(s2.targets, R.tg);
    if (S.mm !== "route") { box.innerHTML = ""; return; }
    var h = '<ol class="rm-rlog"><li>' + spHTML(T.start) + " <small>(start)</small></li>" + R.steps.map(function(st){ return '<li><span class="rm-rstep">' + chipT(st.chip) + (st.note ? " (" + st.note + ")" : "") + "</span> → " + spHTML(st.to) + "</li>"; }).join("") + "</ol>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-mapact="restart" data-k="rrestart">Start this route again</button></div>';
    box.innerHTML = h;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.mapact === "clear") { S.map = {}; mapMsg = null; api.save(); paintMap(); return; }
    if (b.dataset.mapact === "restart") { resetRoute(); api.save(); paintMap(); return; }
    var id = b.dataset.slot; if (!id) return;
    if (id === "trap") { (S.mm === "fill" ? (mapMsg = { k:"bad", h:"<strong>✗ " + s1.m3 + "</strong>" }) : (routeMsg = { k:"bad", h:"<strong>✗ No reaction.</strong> " + s1.m3 })); paintMapFb(); MV.focusFb($(".rm-mapcard", host)); return; }
    var ed = find(MAP.edges, id);
    if (S.mm === "fill") {
      if (S.map[id]) { mapMsg = { k:"", h:"This arrow is already labelled: " + chipT(ed.ok) + "." }; paintMapFb(); return; }
      if (!chip) { mapMsg = { k:"", h:"Choose a label chip first, then tap the blank on an arrow." }; paintMapFb(); return; }
      if (chip === ed.ok) { S.map[id] = true; mapMsg = { k:"good", h:"<strong>✓ " + nodeName(ed.from) + " → " + nodeName(ed.to) + ": " + chipT(chip) + ".</strong>" }; api.save(); paintMap(); }
      else { mapMsg = { k:"bad", h:"<strong>✗ Not this arrow.</strong> " + (MAPFB[id + "|" + chip] || CHIPDO[chip] + " Look at what this arrow starts and ends with.") }; paintMapFb(); }
      MV.focusFb($(".rm-mapcard", host)); return;
    }
    // route mode
    var R = S.route, T = find(s2.targets, R.tg), cn = nodeOf(R.cur);
    if (R.done) { routeMsg = { k:"", h:"Route complete. Press “Start this route again” or choose another target." }; paintMapFb(); return; }
    if (!(ed.from === cn || (ed.from === "grp" && /^[pst]$/.test(cn)))) { routeMsg = { k:"bad", h:"<strong>✗ That arrow starts at the " + nodeName(ed.from) + ".</strong> Your molecule is " + R.cur + ", a " + famOf(R.cur) + ". Tap an arrow that starts there." }; paintMapFb(); MV.focusFb($(".rm-mapcard", host)); return; }
    var r = react(R.cur, ed.ok);
    if (r.none) { routeMsg = { k:"bad", h:"<strong>✗ No reaction.</strong> " + r.none }; paintMapFb(); MV.focusFb($(".rm-mapcard", host)); return; }
    var note = r.note;
    if (ed.ok === "est") { if (!R.alc) { routeMsg = { k:"bad", h:"<strong>✗ Esterifying needs an alcohol too.</strong> Which alcohol could you make from " + T.start + "?" }; paintMapFb(); return; } note = "with the rest of the ethanol from step 1"; }
    R.steps.push({ e:id, chip:ed.ok, to:r.to, note:note }); R.cur = r.to; if (r.to === "ethanol") R.alc = true;
    if (R.cur === T.goal) { R.done = true; routeMsg = { k:"good", h:"<strong>✓ Target reached: " + T.goal + ".</strong> " + T.plan }; }
    else if (R.steps.length >= 6) { routeMsg = { k:"bad", h:"<strong>That’s a long way round.</strong> Start the route again and look for a shorter path." }; }
    else routeMsg = { k:"", h:"Step " + R.steps.length + ": " + chipT(ed.ok) + " gives " + r.to + "." };
    api.save(); paintMap(); MV.focusFb($(".rm-mapcard", host));
  });
  // ----- station 3: isotope labels -----
  var MM = MV.chem.data.M, O18 = 18.00; // ¹⁸O molar mass ≈ 18.00 g/mol: a value this module adds (not in the course table)
  function mm(c, h, o){ return c * MM.C + h * MM.H + o * MM.O; }
  var mEster = mm(4, 8, 2), mWater = mm(0, 2, 1);
  function isoScenes(){
    var P = MS.put, B = MS.bond, r = MS.sc(), p = MS.sc();
    P(r, "me", "CH3", "C", 0, 0); P(r, "c", "C", "C", 56, 0); P(r, "oc", "O", "O", 56, -44); P(r, "oa", "O", "O", 100, 0); P(r, "ha", "H", "H", 136, 0);
    B(r, "me", "c", 1); B(r, "c", "oc", 2); B(r, "c", "oa", 1); B(r, "oa", "ha", 1); MS.tag(r, "plus", "+", 165, 0, { fs:20 });
    P(r, "hb", "H", "H", 196, 0); P(r, "ob", "O", "O", 232, 0); P(r, "et", "CH2CH3", "C", 298, 0); B(r, "hb", "ob", 1); B(r, "ob", "et", 1); MS.ring(r, "ob", "¹⁸O");
    MS.tag(r, "ta", "ethanoic acid", 56, 40, { fs:13, col:"var(--ink-2)" }); MS.tag(r, "tb", "ethanol (labelled)", 262, 40, { fs:13, col:"var(--ink-2)" });
    P(p, "me", "CH3", "C", 0, 0); P(p, "c", "C", "C", 56, 0); P(p, "oc", "O", "O", 56, -44); P(p, "ob", "O", "O", 100, 0); P(p, "et", "CH2CH3", "C", 166, 0);
    B(p, "me", "c", 1); B(p, "c", "oc", 2); B(p, "c", "ob", 1); B(p, "ob", "et", 1); MS.ring(p, "ob", "¹⁸O"); MS.tag(p, "plus", "+", 232, 0, { fs:20 });
    P(p, "ha", "H", "H", 262, 10); P(p, "oa", "O", "O", 292, -8); P(p, "hb", "H", "H", 322, 10); B(p, "ha", "oa", 1); B(p, "oa", "hb", 1);
    MS.tag(p, "ta", "ethyl ethanoate", 90, 40, { fs:13, col:"var(--ink-2)" }); MS.tag(p, "tb", "water", 292, 40, { fs:13, col:"var(--ink-2)" });
    return [r, p];
  }
  var ISO = isoScenes(), isoSvg = $(".rm-isosvg", host), isoStg = MS.stage(isoSvg, { maxScale:1.6, dur:1600 });
  isoStg.load(ISO);
  function paintIso(){
    isoStg.show(S.iso ? 1 : 0);
    isoSvg.setAttribute("aria-label", S.iso ? "Products: ethyl ethanoate, with the ringed ¹⁸O in its C–O–C link, and a water molecule with ordinary oxygen." : "Reactants: ethanoic acid, CH₃–C(=O)–O–H, and ethanol whose O is ringed as heavy ¹⁸O.");
    $(".rm-isodata", host).innerHTML = S.iso ? MV.tableHTML({ head:["Product", "Molar mass found (model data)", "Without the label", "Holds the ¹⁸O?"],
      rows:[["ethyl ethanoate", MV.chem.fx(mEster - MM.O + O18, 1) + " g/mol", MV.chem.fx(mEster, 1) + " g/mol", "<strong>yes</strong>"], ["water", MV.chem.fx(mWater, 1) + " g/mol", MV.chem.fx(mWater, 1) + " g/mol", "no"]], caption:"Labelled-oxygen experiment" }) +
      '<p class="tiny muted">Model data: ¹⁸O makes a molecule about 2 g/mol heavier. Molar masses from the course data table.</p>' + MV.fbHTML("good", s3.isoAfter) : "";
    $('[data-iso="run"]', host).textContent = S.iso ? "Run it again" : "Run the experiment";
  }
  $(".rm-st3", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.iso && !isoBusy) {
      isoBusy = true; b.disabled = true; S.iso = false; paintIso();
      isoStg.pair(ISO[0], ISO[1], function(){ isoBusy = false; S.iso = true; api.save(); paintIso(); $('[data-iso="run"]', host).disabled = false; });
      return;
    }
    if (b.dataset.ae && !aeBusy) {
      aeBusy = true; b.disabled = true; aeT = 0;
      MV.tween({ dur:1400, step:function(t){ aeT = t; paintAE(); }, done:function(){ aeBusy = false; S.ae = true; aeT = 1; api.save(); paintAE(); $('[data-ae="go"]', host).disabled = false; } });
    }
  });
  // ----- station 3: atom economy (molar masses from the course table; Br added here) -----
  var BR = 79.90; // Br molar mass, g/mol: not in the course data table, so defined here (course table addition)
  var mEthene = 2 * MM.C + 4 * MM.H, mWat = mWater, mEthanol = mm(2, 6, 1), mBromo = 2 * MM.C + 5 * MM.H + BR, mOH = MM.O + MM.H;
  var AE = [{ t:"Route 1: ethene + water (addition)", re:mEthene + mWat, pct:mEthanol / (mEthene + mWat) * 100, waste:"none" },
    { t:"Route 2: bromoethane + OH⁻ (substitution)", re:mBromo + mOH, pct:mEthanol / (mBromo + mOH) * 100, waste:"Br⁻" }];
  function paintAE(){
    var fx = MV.chem.fx;
    $(".rm-ae", host).innerHTML = AE.map(function(r){
      var w = r.pct * aeT, shown = aeT >= 1 || S.ae;
      return '<div class="rm-aer"><p class="rm-aet">' + r.t + '</p><div class="rm-aebar" role="img" aria-label="' + esc(r.t + ": " + (shown ? fx(r.pct, 0) + "% of reactant atoms end up in ethanol" : "not compared yet")) + '"><span class="rm-aep" style="width:' + r1(w) + '%"></span>' + (shown && r.pct < 99.5 ? '<span class="rm-aew" style="width:' + r1(100 - r.pct) + '%"></span>' : "") + "</div>" +
        '<p class="rm-aev">' + (shown ? "<strong>" + fx(r.pct, 0) + "%</strong> into ethanol" + (r.pct < 99.5 ? " · waste: " + r.waste : "") : muted("?")) + "</p></div>";
    }).join("") + '<p class="rm-aeleg tiny muted"><span class="rm-sw p"></span> atoms in the product <span class="rm-sw w"></span> waste</p>';
    $(".rm-aeafter", host).innerHTML = S.ae && aeT >= 1 ? MV.fbHTML("good", s3.aeAfter) : "";
    $(".rm-aecalc", host).innerHTML = '<div class="alg-lines"><span>ethanol, C₂H₆O: ' + fx(mEthanol, 2) + " g/mol</span><span>Route 1: " + fx(mEthanol, 2) + " ÷ (" + fx(mEthene, 2) + " + " + fx(mWat, 2) + ") × 100% = <strong>" + fx(AE[0].pct, 0) + "%</strong></span>" +
      "<span>Route 2: " + fx(mEthanol, 2) + " ÷ (" + fx(mBromo, 2) + " + " + fx(mOH, 2) + ") × 100% ≈ <strong>" + fx(AE[1].pct, 1) + "%</strong></span><small>Waste in route 2: Br⁻, " + fx(BR, 2) + " g/mol. Molar masses: C, H and O from the course data table; Br 79.90 g/mol is added for this module.</small></div>";
  }
  paintMap(); paintIso(); paintAE();
}

// ---------- Performance task: Plan a synthesis ----------
var TSTART = ["ethene", "propene", "but-1-ene", "but-2-ene", "2-methylpropene"];
var TSTEP = [{ id:"none", t:"no step" }, { id:"h2o", t:"add H₂O (acid)" }, { id:"hbr", t:"add HBr" }, { id:"h2", t:"add H₂ (catalyst)" }, { id:"oh", t:"substitute with OH⁻" }, { id:"ox", t:"oxidize [O]" }];
function runRoute(start, steps){
  var cur = start, out = [], fail = false;
  steps.forEach(function(st){ var r = react(cur, st); if (r.none) { fail = true; out.push({ st:st, none:r.none, to:cur }); } else { out.push({ st:st, to:r.to, note:r.note }); cur = r.to; } });
  return { final:cur, chain:out, fail:fail };
}
var task = (function(){
  var S = null, api = null;
  function stepT(id){ return find(TSTEP, id).t; }
  function read(){ var st = [S.s1, S.s2, S.s3].map(function(x){ return x && find(TSTEP, x) ? x : "none"; }); return { start:TSTART.indexOf(S.start) >= 0 ? S.start : "", raw:st, steps:st.filter(function(x){ return x !== "none"; }) }; }
  function gap(d){ var seen = false; for (var i = d.raw.length - 1; i >= 0; i--) { if (d.raw[i] !== "none") seen = true; else if (seen) return true; } return false; }
  function paint(){
    var d = read(), pv = $("#rm-tkroute");
    if (!d.start) { pv.innerHTML = '<li class="muted">Choose a starting alkene.</li>'; $("#rm-tkread").innerHTML = ""; return; }
    var r = runRoute(d.start, d.steps), h = "<li>" + spHTML(d.start) + " <small>(start)</small></li>";
    r.chain.forEach(function(c, i){ h += '<li class="' + (c.none ? "rm-fail" : "") + '"><span class="rm-rstep">Step ' + (i + 1) + ": " + stepT(c.st) + (c.none ? ": <strong>no reaction.</strong> " + c.none : " (" + c.note + ")") + "</span>" + (c.none ? "" : " → " + spHTML(c.to)) + "</li>"; });
    pv.innerHTML = h;
    $("#rm-tkread").innerHTML = MV.readoutHTML([["Final product", spHTML(r.final)], ["Carbons", String(SP[r.final].n)], ["Steps used", d.steps.length + " of 3"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (TSTART.indexOf(S.start) < 0) S.start = "";
      inp.innerHTML = '<div class="rm-tkrow" id="rm-tk-start"></div>' + [1, 2, 3].map(function(i){ return '<div class="rm-tkrow" id="rm-tk-s' + i + '"></div>'; }).join("");
      pv.innerHTML = '<h4 class="rm-h4">Your route</h4><ol class="rm-rlog" id="rm-tkroute" aria-live="polite"></ol><dl class="read" id="rm-tkread" aria-live="polite"></dl>';
      radios($("#rm-tk-start"), { label:"Start alkene", aria:"Start alkene", cls:"chips", options:TSTART.map(function(x){ return { id:x, t:x }; }), value:S.start, onChange:function(v){ S.start = v; api.save(); paint(); api.update(); } });
      [1, 2, 3].forEach(function(i){ var k = "s" + i; if (!find(TSTEP, S[k])) S[k] = "none";
        radios($("#rm-tk-s" + i), { label:"Step " + i, aria:"Step " + i, cls:"chips", options:TSTEP, value:S[k], onChange:function(v){ S[k] = v; api.save(); paint(); api.update(); } }); });
      var chk = $("#task-check"), T = MV.C.task;
      if (chk && T.after4) chk.addEventListener("click", function(){ setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && ts.found.length >= 4 && !fb.querySelector(".rm-after4")) fb.insertAdjacentHTML("beforeend", '<p class="rm-after4">' + T.after4 + "</p>"); }, 0); });
      paint();
    },
    read:read,
    valid:function(d){ if (!d.start) return "Choose a starting alkene first."; if (!d.steps.length) return "Choose at least one step."; if (gap(d)) return "Fill the steps in order, with no gap."; return true; },
    checks:function(d){
      if (!d.start) return [false, false, false, false];
      var r = runRoute(d.start, d.steps), f = SP[r.final];
      return [f.fam === "ketone", f.n === 4, d.steps.length <= 3 && !gap(d), d.steps.length > 0 && !r.fail];
    },
    tips:function(d, res){
      var T = MV.C.task.tips, out = [];
      function add(i){ if (out.indexOf(T[i]) < 0) out.push(T[i]); }
      if (!d.start) return [T[0]];
      var r = runRoute(d.start, d.steps), tert = d.start === "2-methylpropene";
      if (tert) add(2);
      if (!res[0] || !res[3]) add(0);
      if (!res[1]) add(1);
      if (d.steps.indexOf("hbr") >= 0 && d.steps.indexOf("oh") < 0) add(3);
      void r; return out.length ? out : [T[0]];
    },
    key:function(d){ return d.start + ":" + d.steps.join(">"); },
    label:function(k){ var p = k.split(":"); return p[0] + ": " + p[1].split(">").map(stepT).join(" → "); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  task:task
});
})();
