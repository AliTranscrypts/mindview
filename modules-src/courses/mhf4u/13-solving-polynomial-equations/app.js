// MHF4U 13 Solving polynomial equations: hero, N15 strategy path (Explore) with the N28 root hunter as a pop-up,
// "Roots ↔ intercepts" stations with the N25 flatten morph (Part 3), N4 root boxes ("Solve it"), "Touch on the left" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, m = MV.m;

// ---------- exact fractions (copied from MHF4U 12's N28 root hunter) ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function F(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n = n / g; return { n:n === 0 ? 0 : n, d:d / g }; }
function fadd(x, y){ return F(x.n * y.d + y.n * x.d, x.d * y.d); }
function fmul(x, y){ return F(x.n * y.n, x.d * y.d); }
function fdiv(x, y){ return F(x.n * y.d, x.d * y.n); }
function fneg(x){ return F(-x.n, x.d); }
function fv(x){ return x.n / x.d; }
function fsrc(x, stack){ var a = Math.abs(x.n), s = x.n < 0 ? "-" : ""; return x.d === 1 ? s + a : stack ? s + "{" + a + "}/{" + x.d + "}" : s + a + "/" + x.d; }
function toF(c){ return c.map(function(v){ return typeof v === "number" ? F(v) : v; }); }
function pEval(c, x){ var r = F(0); c.forEach(function(a){ r = fadd(fmul(r, x), a); }); return r; }
function synth(c, z){ var bot = [c[0]]; for (var i = 1; i < c.length; i++) bot.push(fadd(c[i], fmul(bot[i - 1], z))); return { rem:bot[bot.length - 1], q:bot.slice(0, -1) }; }
function divisors(n){ n = Math.abs(n); var o = []; for (var i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o; }
// candidate zeros: Integral (± divisors of the constant) or Rational (± p/q in lowest terms)
function candList(q, mode){
  if (q.length < 2) return [];
  var lead = Math.abs(fv(q[0])), cst = Math.abs(fv(q[q.length - 1])), out = [], seen = {};
  if (cst === 0) return [F(0)];
  (mode === "rat" ? divisors(lead) : [1]).forEach(function(d){ divisors(cst).forEach(function(n){ var f = F(n, d), k = f.n + "/" + f.d; if (seen[k]) return; seen[k] = 1; out.push(f, F(-f.n, f.d)); }); });
  return out;
}
// the terms of P(z) for a substitution line: "54 − 27 − 33 + 6"
function subst(c, z){
  var deg = c.length - 1, parts = [];
  c.forEach(function(a, i){ if (a.n === 0) return; var t = a; for (var e = 0; e < deg - i; e++) t = fmul(t, z); if (t.n !== 0) parts.push(t); });
  if (!parts.length) return "0";
  return parts.map(function(t, i){ return i === 0 ? fsrc(t) : (t.n < 0 ? " - " : " + ") + fsrc(F(Math.abs(t.n), t.d)); }).join("");
}

// ---------- integer polynomials (coefficients highest power first) ----------
function trim(c){ var i = 0; while (i < c.length - 1 && c[i] === 0) i++; return c.slice(i); }
function padTo(c, n){ var o = c.slice(); while (o.length < n) o.unshift(0); return o; }
function pSub(a, b){ var n = Math.max(a.length, b.length), A = padTo(a, n), B = padTo(b, n); return trim(A.map(function(v, i){ return v - B[i]; })); }
function pMul(a, b){ var o = []; for (var i = 0; i < a.length + b.length - 1; i++) o.push(0); a.forEach(function(x, i){ b.forEach(function(y, j){ o[i + j] += x * y; }); }); return o; }
function hor(c){ return function(x){ return c.reduce(function(r, a){ return r * x + a; }, 0); }; }
function deg(c){ return c.length - 1; }
function cgcd(c){ return c.reduce(function(g, v){ return gcd(g, v); }, 0); }
function isSq(n){ if (n < 0) return false; var r = Math.round(Math.sqrt(n)); return r * r === n; }
function disc(c){ return c[1] * c[1] - 4 * c[0] * c[2]; }
function pStr(c, v){
  v = v || "x"; var d = c.length - 1, s = "";
  c.forEach(function(a, i){
    if (!a) return;
    var e = d - i, ab = Math.abs(a), term = (ab === 1 && e > 0 ? "" : String(ab)) + (e > 0 ? v + (e > 1 ? "^" + e : "") : "");
    s += s ? (a < 0 ? " - " : " + ") + term : (a < 0 ? "-" : "") + term;
  });
  return s || "0";
}
function plainM(src){ return MV.plain(m(src)); }
function cl(lab){ return String(lab).replace(/[{}]/g, "").replace(/-/g, MV.MINUS); }   // canvas label / aria text for a root label
function near(a, b){ return Math.abs(a - b) < 1e-9; }
function sortN(a){ return a.slice().sort(function(p, q){ return p - q; }); }
function sameSet(a, b){ a = sortN(a); b = sortN(b); return a.length === b.length && a.every(function(v, i){ return Math.abs(v - b[i]) < 1e-6; }); }
// automatic window around the real zeros and turning points (from MHF4U 12)
var vcache = {};
function viewFor(c){
  var key = c.join(","); if (vcache[key]) return vcache[key];
  var f = hor(c), roots = [], x, prev = f(-9);
  for (x = -9 + 0.01; x <= 9; x += 0.01) { var y = f(x); if (y === 0 || prev * y < 0) roots.push(x); prev = y; }
  var x0 = Math.max(-9.5, Math.min(-3, (roots.length ? Math.min.apply(null, roots) : 0) - 1.2)), x1 = Math.min(9.5, Math.max(3, (roots.length ? Math.max.apply(null, roots) : 0) + 1.2));
  var ys = [0, f(0)], N = 300, vals = [];
  for (var i = 0; i <= N; i++) vals.push(f(x0 + (x1 - x0) * i / N));
  for (i = 1; i < N; i++) if ((vals[i] - vals[i - 1]) * (vals[i + 1] - vals[i]) <= 0) ys.push(vals[i]);
  var lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
  if (hi - lo < 6) { var mid = (hi + lo) / 2; lo = mid - 3; hi = mid + 3; }
  var pad = (hi - lo) * 0.22;
  return (vcache[key] = { xmin:x0, xmax:x1, ymin:lo - pad, ymax:hi + pad });
}
// labels for dots on the x-axis: sheet background, alternate above/below when two roots are close, flip left near the right edge
function dotLabels(v, list){
  var span = v.xmax - v.xmin, out = [], prevUp = false, prevX = -Infinity, font = "600 14px " + (css("--font-math") || "serif");
  list.slice().sort(function(p, q){ return p.x - q.x; }).forEach(function(it){
    if (!it.text) return;
    var up = it.x - prevX < span * 0.13 ? !prevUp : true, right = it.x > v.xmax - span * 0.16;
    out.push({ x:it.x, y:0, text:it.text, dx:right ? -9 : 9, dy:up ? -15 : 16, align:right ? "right" : "left", bg:true, font:font, color:css("--ink") });
    prevUp = up; prevX = it.x;
  });
  return out;
}
function seq(list){ var i = 0; (function next(){ if (i >= list.length) return; var s = list[i++]; MV.wait(s[0], function(){ s[1](); next(); }); })(); }

// ---------- hero: x³ + 2x² = 9x + 18 → = 0 → grouping → factored, three dots drop onto the intercepts ----------
function hero(f){
  if (!f.canvas) return;
  var P = hor([1, 2, -9, -18]), V = { xmin:-4.6, xmax:4.6, ymin:-32, ymax:26 }, line = $("#hz-line");
  var plot = new MV.Plot(f.canvas, V), st = { draw:0, dots:[], drop:null }, R = [-3, -2, 3];
  var L = [m("x^3 + 2x^2") + " " + m("=") + ' <span class="hz-r">' + m("9x + 18") + "</span>",
    m("x^3 + 2x^2") + ' <span class="hz-hl">' + m("- 9x - 18") + "</span> " + m("= 0"),
    m("x^2(x + 2) - 9(x + 2) = 0"),
    m("(x + 2)(x - 3)(x + 3) = 0")];
  function show(i){ line.innerHTML = '<span class="hz-in">' + L[i] + "</span>"; }
  function cap(){ f.cap.innerHTML = "Roots −3, −2 and 3 are the " + m("x") + "-intercepts of " + m("y = x^3 + 2x^2 - 9x - 18") + "."; }
  plot.render = function(){
    var pts = st.dots.map(function(x){ return { x:x, y:0, r:6.5, color:css("--ink"), text:num(x) }; });
    if (st.drop) pts.push({ x:st.drop.x, y:st.drop.y, r:6.5, color:css("--ink") });
    plot.draw({ view:V, labels:dotLabels(V, pts.filter(function(q){ return q.text; })), curves:st.draw > 0 ? [{ f:P, color:css("--pen"), width:3.2, arrows:st.draw >= 1, domain:[V.xmin, V.xmin + (V.xmax - V.xmin) * st.draw] }] : [], points:pts,
      describe:"Graph of y = x³ + 2x² − 9x − 18 crossing the x-axis at −3, −2 and 3, the roots of x³ + 2x² = 9x + 18." });
  };
  if (MV.reduceMotion) { show(3); st.draw = 1; st.dots = R.slice(); cap(); plot.render(); return; }
  show(0); plot.render();
  seq([[1300, function(){ var r = $(".hz-r", line); if (r) r.classList.add("go"); }],
    [850, function(){ show(1); MV.tween({ dur:1100, ease:function(t){ return t; }, step:function(t){ st.draw = t; plot.render(); } }); }],
    [1700, function(){ show(2); }],
    [1500, function(){ show(3); }],
    [900, function(){
      var k = 0;
      (function next(){
        if (k >= R.length) { cap(); return; }
        var x = R[k];
        MV.tween({ dur:600, step:function(t){ st.drop = { x:x, y:V.ymax * (1 - t) }; plot.render(); }, done:function(){ st.drop = null; st.dots.push(x); k++; plot.render(); MV.wait(250, next); } });
      })();
    }]]);
}

// ---------- the polynomial-equation engine behind the strategy path ----------
// State of one equation: {zero (right side is 0), L, R, k (constant multiplier), fac:[{c, m, u}], umode, lines:[math src], found:[{v, lab, m}],
//   none:[poly src with no real roots], solved, moves, miss:[tested candidates], last (last test), demo}
var EQ = {
  e1:{ L:[1, 0, -4, 0] },
  e2:{ L:[1, 2, 0, 0], R:[9, 18] },
  e3:{ L:[1, 0, -13, 0, 36] },
  e4:{ L:[2, -3, -11, 6] },
  e5:{ L:[1, 0, -5, 0, -36] },
  p1:{ L:[1, 0, 0, 0], R:[4, 0] },
  p4:{ fac:[{ c:[1, -1], m:2, u:false }, { c:[1, 3], m:1, u:false }], src:"(x - 1)^2(x + 3)" }
};
Object.keys(EQ).forEach(function(id){
  var E = EQ[id];
  E.P = E.fac ? E.fac.reduce(function(p, f){ for (var i = 0; i < f.m; i++) p = pMul(p, f.c); return p; }, [1]) : E.R ? pSub(E.L, E.R) : E.L;
});
function facSrc(f, solo){
  var v = f.u ? "u" : "x", body = pStr(f.c, v);
  if (solo) return body;
  var bare = f.c.length === 2 && f.c[0] === 1 && f.c[1] === 0;
  return (bare ? v : "(" + body + ")") + (f.m > 1 ? "^" + f.m : "");
}
function lhsSrc(st){
  var solo = st.fac.length === 1 && st.fac[0].m === 1 && st.k === 1;
  return (st.k === 1 ? "" : st.k === -1 ? "-" : String(st.k)) + st.fac.map(function(f){ return facSrc(f, solo); }).join("");
}
function lineSrc(st){ return st.zero ? lhsSrc(st) + " = 0" : pStr(st.L) + " = " + pStr(st.R); }
function fresh(id){
  var E = EQ[id];
  var st = { zero:!E.R, L:(E.L || E.P).slice(), R:E.R ? E.R.slice() : null, k:1,
    fac:E.fac ? JSON.parse(JSON.stringify(E.fac)) : E.R ? [] : [{ c:E.L.slice(), m:1, u:false }],
    umode:false, lines:[], found:[], none:[], solved:false, moves:0, miss:[], last:null, demo:false };
  st.lines.push(lineSrc(st));
  return st;
}
function merge(st){
  var out = [];
  st.fac.forEach(function(f){ var h = out.filter(function(g){ return g.u === f.u && g.c.join() === f.c.join(); })[0]; if (h) h.m += f.m; else out.push({ c:f.c.slice(), m:f.m, u:f.u }); });
  st.fac = out;
}
function settable(f){ var d = deg(f.c); if (d === 1) return true; if (d === 2 && (disc(f.c) < 0 || (!f.u && f.c[1] === 0))) return true; return false; }
function idx(list, fn){ for (var i = 0; i < list.length; i++) if (fn(list[i])) return i; return -1; }
function monoSrc(g, e){ var x = "x" + (e > 1 ? "^" + e : ""); return g === 1 ? x : g === -1 ? "-" + x : g + x; }
function huntTarget(st){
  var i = idx(st.fac, function(f){ return !f.u && deg(f.c) >= 3; });
  if (i < 0) i = idx(st.fac, function(f){ return !f.u && deg(f.c) === 2 && isSq(disc(f.c)); });
  return i;
}
function sqRoots(val, mult, roots, none, xc){
  if (val.n < 0) { none.push(pStr(xc)); return; }
  if (val.n === 0) { roots.push({ v:0, lab:"0", m:2 * mult }); return; }
  var a = Math.round(Math.sqrt(val.n)), b = Math.round(Math.sqrt(val.d));
  if (a * a === val.n && b * b === val.d) { var r = F(a, b); roots.push({ v:fv(r), lab:fsrc(r), m:mult }, { v:-fv(r), lab:fsrc(fneg(r)), m:mult }); return; }
  var s = val.d === 1 ? "√" + val.n : "√{" + fsrc(val) + "}", v = Math.sqrt(fv(val));
  roots.push({ v:v, lab:s, m:mult }, { v:-v, lab:"-" + s, m:mult });
}
function rootsLine(roots){
  var labs = sortRoots(roots).map(function(r){ return r.lab; });
  if (!labs.length) return "!no real roots";
  return "x = " + (labs.length === 1 ? labs[0] : labs.slice(0, -1).join(", ") + " or " + labs[labs.length - 1]);
}
function sortRoots(rs){ return rs.slice().sort(function(p, q){ return p.v - q.v; }); }

// @component N15 moveChooser — strategy path for polynomial equations: equation chips, a move menu of buttons (move to one side,
//   divide by x (trap), common factor, group, u = x², test a candidate (N28 pop-up), factor a quadratic, set each factor to 0),
//   stacked history with the current line, named "doesn't apply" feedback, move counter, live graph of y = left − right with the
//   roots dropping onto the x-axis, readout, and a Build mode (k slider). strategyPath(host, {S, content, onChange}) -> {apply, load, ...}
function strategyPath(host, o){
  var C = o.content, S = o.S, FB = C.fb;
  if (!S.cur || !EQ[S.cur]) S.cur = "e1";
  if (!S.mode) S.mode = "solve";
  if (S.k == null) S.k = 9;
  if (!S.st) S.st = {};
  var view = { hunt:null, hm:"int", drop:null, fb:null, flash:null, all:false, busy:false };
  var L = MV.pgLayout(host, { aria:"Graph of the left side minus the right side, with the roots found so far" });
  host.querySelector(".pg").classList.add("sp");
  L.cap.insertAdjacentHTML("beforebegin", '<div class="sp-hist"></div>');
  L.graph.insertAdjacentHTML("beforeend", '<p class="tiny muted sp-gcap"></p>');
  L.ctrl.innerHTML = '<div class="sp-modes"></div><div class="sp-solve"><div class="chips sp-chips" role="group" aria-label="Equation"></div><p class="tiny muted sp-note"></p>' +
    '<p class="sp-h">Choose the next move</p><div class="sp-menu" role="group" aria-label="Moves"></div><div class="sp-fb" aria-live="polite"></div><div class="sp-hunt"></div>' +
    '<div class="sp-foot"><button type="button" class="btn ghost sm" data-act="reset" data-k="spreset">Start over</button></div></div>' +
    '<div class="sp-build" hidden><div class="sp-k"></div><p class="tiny muted">' + m("x^4 - 10x^2 + k = 0") + ". With " + m("u = x^2") + " it becomes " + m("u^2 - 10u + k = 0") + ".</p></div>";
  var E = { hist:$(".sp-hist", host), gcap:$(".sp-gcap", host), modes:$(".sp-modes", host), solve:$(".sp-solve", host), build:$(".sp-build", host), chips:$(".sp-chips", host),
    note:$(".sp-note", host), menu:$(".sp-menu", host), fb:$(".sp-fb", host), hunt:$(".sp-hunt", host) };
  MV.sliders($(".sp-k", host), [{ id:"spk", label:m("k"), min:-100, max:100, step:1, value:S.k }], function(id, v){ S.k = v; changed(); });
  var plot = new MV.Plot(L.canvas, { xmin:-5, xmax:5, ymin:-10, ymax:10 });

  function cur(){ return S.st[S.cur] || (S.st[S.cur] = fresh(S.cur)); }
  function label(id){ var mv = C.moves.filter(function(x){ return x.id === id; })[0]; return mv ? mv.t : id; }
  function na(id, reason){ return { fb:FB.na.replace("{move}", label(id)).replace("{reason}", MV.md(reason)) }; }
  function changed(){ paint(); if (o.onChange) o.onChange(); }

  // ----- moves -----
  function doMove(st, id){
    if (st.solved) return na(id, "the equation is solved: every real root is found. Choose another equation or start over");
    if (id === "side") {
      if (st.zero) return na(id, "the right side is already 0");
      st.fac = [{ c:pSub(st.L, st.R), m:1, u:false }]; st.zero = true;
      return { lines:[lineSrc(st)] };
    }
    if (id === "divx") {
      var hasX = st.zero ? st.fac.some(function(f){ return !f.u && f.c[f.c.length - 1] === 0; }) : st.L[st.L.length - 1] === 0 && st.R[st.R.length - 1] === 0;
      return hasX ? { fb:FB.divx } : na(id, "`x` isn’t a factor of every term");
    }
    if (id === "zero" && !st.zero) return { fb:FB.zeroSide };
    if (!st.zero) return na(id, "one side isn’t 0 yet. Move everything to one side first");
    if (id === "cf") {
      var i = idx(st.fac, function(f){ return (deg(f.c) >= 2 && f.c[f.c.length - 1] === 0) || (deg(f.c) >= 1 && cgcd(f.c) > 1); });
      if (i < 0) return na(id, "the terms have no common factor");
      var f = st.fac[i], c = f.c.slice(), t = 0;
      if (deg(c) >= 2) while (c.length > 1 && c[c.length - 1] === 0) { c.pop(); t++; }
      var g = cgcd(c); if (c[0] < 0) g = -g; c = c.map(function(v){ return v / g; });
      st.k *= Math.pow(g, f.m);
      var rep = []; if (t) rep.push({ c:[1, 0], m:t * f.m, u:f.u });
      if (c.length > 1) rep.push({ c:c, m:f.m, u:f.u }); else st.k *= Math.pow(c[0], f.m);
      st.fac.splice.apply(st.fac, [i, 1].concat(rep)); merge(st);
      return { lines:[lineSrc(st)] };
    }
    if (id === "group") {
      var j = idx(st.fac, function(f){ return !f.u && deg(f.c) === 3 && f.c.every(function(v){ return v !== 0; }); });
      if (j < 0) return na(id, "there aren’t four terms to pair up");
      var h = st.fac[j], a = h.c[0], b = h.c[1], cc = h.c[2], d = h.c[3];
      var gg = gcd(a, b) * (a < 0 ? -1 : 1), br = [a / gg, b / gg], hh = cc / br[0];
      if (!Number.isInteger(hh) || hh * br[1] !== d) return na(id, "the two pairs don’t share a bracket: `" + pStr([a, b, 0, 0]) + " = " + monoSrc(gg, 2) + "(" + pStr(br) + ")`, but `" + pStr([cc, d]) + "` has no factor `(" + pStr(br) + ")`");
      var lines = [];
      if (st.fac.length === 1 && st.k === 1 && h.m === 1) lines.push(monoSrc(gg, 2) + "(" + pStr(br) + ")" + (hh < 0 ? " - " : " + ") + (Math.abs(hh) === 1 ? "" : Math.abs(hh)) + "(" + pStr(br) + ") = 0");
      st.fac.splice(j, 1, { c:br, m:h.m, u:false }, { c:[gg, 0, hh], m:h.m, u:false }); merge(st);
      lines.push(lineSrc(st));
      return { lines:lines };
    }
    if (id === "u") {
      if (st.umode) return na(id, "`u = x^2` is already in use");
      var q = st.fac[0];
      if (st.fac.length !== 1 || deg(q.c) !== 4 || q.c[1] !== 0 || q.c[3] !== 0) return na(id, "it needs only the powers `x^4`, `x^2` and a constant");
      st.fac = [{ c:[q.c[0], q.c[2], q.c[4]], m:q.m, u:true }]; st.umode = true;
      return { lines:[lineSrc(st)] };
    }
    if (id === "quad") {
      var n = idx(st.fac, function(f){ return deg(f.c) === 2 && isSq(disc(f.c)); });
      if (n < 0) {
        var big = st.fac.filter(function(f){ return deg(f.c) >= 3; })[0], two = st.fac.filter(function(f){ return deg(f.c) === 2; })[0];
        if (big && deg(big.c) === 4) return na(id, "`" + pStr(big.c) + "` has degree 4. Let `u = x^2` first to see it as a quadratic");
        if (big) return na(id, "`" + pStr(big.c) + "` is a cubic. Group it or test a candidate first");
        if (two) return na(id, "`" + pStr(two.c, two.u ? "u" : "x") + "` doesn’t factor over the " + (disc(two.c) < 0 ? "real numbers" : "integers"));
        return na(id, "every factor is already linear");
      }
      var w = st.fac[n], A = w.c[0], B = w.c[1], s = Math.round(Math.sqrt(disc(w.c)));
      var rs = [F(-B - s, 2 * A), F(-B + s, 2 * A)].sort(function(p, r){ return ((fv(p) < 0) - (fv(r) < 0)) || (Math.abs(fv(p)) - Math.abs(fv(r))); });
      st.k *= Math.pow(A / (rs[0].d * rs[1].d), w.m);
      st.fac.splice(n, 1, { c:[rs[0].d, -rs[0].n], m:w.m, u:w.u }, { c:[rs[1].d, -rs[1].n], m:w.m, u:w.u }); merge(st);
      return { lines:[lineSrc(st)] };
    }
    if (id === "test") {
      if (st.umode) return na(id, "the equation is a quadratic in `u`. Factor it instead");
      var ti = huntTarget(st);
      if (ti < 0) return na(id, "every factor is ready to set to 0");
      return { open:ti };
    }
    if (id === "zero") {
      var bad = st.fac.filter(function(f){ return !settable(f); })[0];
      if (bad) return na(id, "`" + pStr(bad.c, bad.u ? "u" : "x") + "` isn’t factored yet");
      var roots = [], none = [], p1 = [], p2 = [];
      st.fac.forEach(function(f){
        var c = f.c;
        if (f.u) {
          if (deg(c) === 1) { var uv = F(-c[1], c[0]); p1.push("u = " + fsrc(uv)); p2.push("x^2 = " + fsrc(uv)); sqRoots(uv, f.m, roots, none, [c[0], 0, c[1]]); }
          else { p1.push(pStr(c, "u") + " = 0"); none.push(pStr(c, "u")); }
        } else if (deg(c) === 1) { var r = F(-c[1], c[0]); p1.push(pStr(c) + " = 0"); roots.push({ v:fv(r), lab:fsrc(r), m:f.m }); }
        else if (c[1] === 0 && -c[2] / c[0] >= 0) { p1.push(pStr(c) + " = 0"); sqRoots(F(-c[2], c[0]), f.m, roots, none, c); }
        else { p1.push(pStr(c) + " = 0"); none.push(pStr(c)); }
      });
      var merged = [];
      roots.forEach(function(r){ var h2 = merged.filter(function(x){ return near(x.v, r.v); })[0]; if (h2) h2.m += r.m; else merged.push({ v:r.v, lab:r.lab, m:r.m }); });
      var old = st.found.map(function(r){ return r.v; }), drops = merged.filter(function(r){ return !old.some(function(v){ return near(v, r.v); }); }).map(function(r){ return r.v; });
      st.found = merged; st.none = none; st.solved = true;
      var ls = [p1.join(" or ")]; if (st.umode) ls.push(p2.join(" or ")); ls.push(rootsLine(merged));
      return { lines:ls, drops:drops };
    }
    return { fb:"" };
  }
  function test(st, z){
    var i = view.hunt.i, f = st.fac[i], q = toF(f.c), v = pEval(q, z), name = (st.fac.length === 1 && st.k === 1) ? "P" : "Q";
    st.moves++;
    st.last = { z:[z.n, z.d], v:[v.n, v.d], hit:v.n === 0, of:name, sub:subst(q, z) };
    if (v.n !== 0) { st.miss.push({ n:z.n, d:z.d, v:[v.n, v.d] }); view.fb = null; return; }
    var qq = synth(q, z).q.map(function(x){ return fdiv(x, F(z.d)); }).map(fv);
    var rep = [{ c:[z.d, -z.n], m:f.m, u:false }];
    if (qq.length > 1) rep.push({ c:qq, m:f.m, u:false }); else st.k *= Math.pow(qq[0], f.m);
    st.fac.splice.apply(st.fac, [i, 1].concat(rep)); merge(st);
    st.miss = []; st.lines.push(lineSrc(st));
    if (!st.found.some(function(r){ return near(r.v, fv(z)); })) st.found.push({ v:fv(z), lab:fsrc(z), m:0 });
    view.hunt = null;
    view.fb = { kind:"good", html:"<strong>✓</strong> " + m(name + "(" + fsrc(z) + ") = " + st.last.sub + " = 0") + ", so " + m("(" + pStr([z.d, -z.n]) + ")") + " is a factor." };
    dropDots([fv(z)]);
  }
  // apply a move to the equation shown; returns true if the line changed
  function apply(id){
    var st = cur(), r = doMove(st, id);
    if (r.open != null) { view.hunt = { i:r.open }; view.fb = null; changed(); return false; }
    if (r.fb != null) { view.fb = r.fb ? { kind:"bad", html:"<strong>✗</strong> " + r.fb } : null; changed(); return false; }
    st.moves++; st.miss = []; view.hunt = null; view.fb = null;
    r.lines.forEach(function(l){ st.lines.push(l); });
    if (r.drops && r.drops.length) dropDots(r.drops);
    changed(); return true;
  }
  function dropDots(vals){
    view.drop = { vals:vals, t:0 };
    MV.tween({ dur:700, step:function(t){ if (view.drop) { view.drop.t = t; plot.render(); } }, done:function(){ view.drop = null; plot.render(); } });
  }

  // ----- Build mode (TC3): x⁴ − 10x² + k = 0 -----
  function build(k){
    var D = 25 - k, out = { D:D, us:[], roots:[], exact:isSq(D) };
    if (D < 0) return out;
    var s = Math.sqrt(D), us = D === 0 ? [5] : [5 + s, 5 - s];
    out.us = us;
    us.forEach(function(u){
      var mult = D === 0 ? 2 : 1;
      if (Math.abs(u) < 1e-9) { out.roots.push({ v:0, lab:"0", m:2 * mult, int:true }); return; }
      if (u < 0) return;
      var r = Math.sqrt(u), ui = Math.round(u), isInt = out.exact && isSq(ui), lab;
      if (isInt) lab = String(Math.round(r)); else if (out.exact) lab = "√" + ui; else lab = "≈ " + num(r, 2);
      out.roots.push({ v:r, lab:lab, m:mult, int:isInt }, { v:-r, lab:isInt ? "-" + Math.round(r) : out.exact ? "-√" + ui : "≈ " + num(-r, 2), m:mult, int:isInt });
    });
    return out;
  }
  function buildRead(){
    var b = build(S.k), uTxt;
    if (b.D < 0) uTxt = "no real " + m("u") + "-values";
    else if (b.D === 0) uTxt = m("u = 5") + " (twice)";
    else if (b.exact) uTxt = m("u = " + Math.round(b.us[0]) + " or u = " + Math.round(b.us[1]));
    else uTxt = m("u") + " ≈ " + num(b.us[0], 2) + " or " + m("u") + " ≈ " + num(b.us[1], 2);
    var rr = sortRoots(b.roots);
    L.read.innerHTML = MV.readoutHTML([
      ["Equation", m(pStr([1, 0, -10, 0, S.k]) + " = 0")],
      ["With " + m("u = x^2"), m(pStr([1, -10, S.k], "u") + " = 0")],
      [m("u") + "-values", uTxt],
      ["Real roots", rr.length ? rr.map(function(r){ return (/≈/.test(r.lab) ? m("x") + " " + r.lab.replace("-", MV.MINUS) : m("x = " + r.lab)) + (r.m >= 2 ? " (order " + r.m + ")" : ""); }).join(", ") : "none"],
      [C.readout.ints, String(rr.length) + " (degree 4, so at most 4)"]
    ]);
  }

  // ----- painting -----
  plot.render = function(){
    var ink = css("--ink"), pts = [];
    if (S.mode === "build") {
      var b = build(S.k), V = { xmin:-5.4, xmax:5.4, ymin:-140, ymax:125 };
      sortRoots(b.roots).forEach(function(r){ pts.push({ x:r.v, y:0, r:6, color:ink, text:cl(r.lab.replace(/^≈ /, "")) + (r.m >= 2 ? " (order " + r.m + ")" : "") }); });
      plot.draw({ view:V, curves:[{ f:hor([1, 0, -10, 0, S.k]), color:css("--pen"), width:3.2, arrows:true }], points:pts, labels:dotLabels(V, pts),
        describe:"Graph of y = " + plainM(pStr([1, 0, -10, 0, S.k])) + ". " + (b.roots.length ? "Real roots at " + sortRoots(b.roots).map(function(r){ return cl(r.lab); }).join(", ") + "." : "No real roots: the graph doesn’t meet the x-axis.") });
      return;
    }
    var st = cur(), P = EQ[S.cur].P, v = viewFor(P);
    sortRoots(st.found).forEach(function(r){
      var y = 0; if (view.drop && view.drop.vals.some(function(x){ return near(x, r.v); })) y = (v.ymax - (v.ymax - v.ymin) * 0.04) * (1 - view.drop.t);
      pts.push({ x:r.v, y:y, r:6.5, color:ink, text:y === 0 ? cl(r.lab) + (r.m >= 2 ? " (order " + r.m + ")" : "") : "" });
    });
    plot.draw({ view:v, curves:[{ f:hor(P), color:css("--pen"), width:3.2, arrows:true }], points:pts, labels:dotLabels(v, pts),
      describe:"Graph of y = " + plainM(pStr(P)) + ". " + (st.found.length ? "Roots found so far: " + sortRoots(st.found).map(function(r){ return cl(r.lab); }).join(", ") + "." : "No roots found yet.") });
  };
  function lineHTML(src){ return src.charAt(0) === "!" ? src.slice(1) : m(src); }
  function hunterHTML(st){
    var i = view.hunt.i, f = st.fac[i];
    if (!f) { view.hunt = null; return ""; }
    var q = toF(f.c), name = (st.fac.length === 1 && st.k === 1) ? "P" : "Q", cl = candList(q, view.hm);
    var lead = Math.abs(f.c[0]), cst = Math.abs(f.c[f.c.length - 1]);
    var h = '<div class="sp-hbox"><p class="sp-hhead"><strong>Test a candidate</strong> in ' + m(name + "(x) = " + pStr(f.c)) + '. <span class="tiny muted">Each test counts as a move.</span></p>';
    h += '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Candidate board:</span><span class="seg" role="group" aria-label="Candidate board">' + [["int", "Integral zeros"], ["rat", "Rational zeros"]].map(function(x){ return '<button type="button" data-hm="' + x[0] + '" data-k="sphm' + x[0] + '" aria-pressed="' + (view.hm === x[0]) + '">' + x[1] + "</button>"; }).join("") + "</span></div>";
    h += '<p class="rh-note tiny">' + (cst === 0 ? "The constant term is 0, so " + m("x = 0") + " is a zero." : view.hm === "int" ? "<strong>Integral zero theorem:</strong> an integer zero divides the constant term " + num(cst) + "." :
      "<strong>Rational zero theorem:</strong> " + m("p") + " divides the constant term " + num(cst) + " and " + m("q") + " divides the leading coefficient " + num(lead) + ".") + "</p>";
    h += '<div class="rh-board" role="group" aria-label="Candidates">' + cl.map(function(z){
      var mm = st.miss.filter(function(x){ return x.n === z.n && x.d === z.d; })[0], val = mm ? name + "(" + fsrc(z) + ") = " + fsrc(F(mm.v[0], mm.v[1])) : "";
      return '<button type="button" class="rh-tile' + (mm ? " miss" : "") + '" data-hc="' + z.n + "/" + z.d + '" data-k="sphc' + z.n + "_" + z.d + '"' + (mm || view.busy ? " disabled" : "") + ' aria-label="' + MV.esc(val ? plainM(val) + ", not a factor" : "Test x = " + plainM(fsrc(z))) + '"><span class="rh-c">' + m(fsrc(z, true)) + "</span>" + (val ? '<span class="rh-v">' + m(val) + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    return h + '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="hclose" data-k="sphclose">Close the board</button></div></div>';
  }
  function paintSolve(){
    var st = cur(), busy = view.busy ? " disabled" : "";
    MV.keepFocus(E.chips, function(){ E.chips.innerHTML = C.equations.map(function(q){ return '<button type="button" class="fchip sp-eq" data-eq="' + q.id + '" data-k="speq' + q.id + '" aria-pressed="' + (S.cur === q.id) + '"' + busy + '><span class="sp-tag">' + q.chip + "</span> " + q.eq + "</button>"; }).join(""); });
    E.note.innerHTML = EQ[S.cur] && !C.equations.some(function(q){ return q.id === S.cur; }) ? "This equation comes from a prediction. Choose an equation above to keep exploring." : "";
    MV.keepFocus(E.menu, function(){ E.menu.innerHTML = C.moves.map(function(x){ return '<button type="button" class="btn sp-mv' + (view.flash === x.id ? " flash" : "") + '" data-move="' + x.id + '" data-k="spm' + x.id + '"' + busy + "><span>" + x.t + "</span></button>"; }).join(""); });
    E.fb.innerHTML = view.fb ? MV.fbHTML(view.fb.kind, view.fb.html) : "";
    MV.keepFocus(E.hunt, function(){ E.hunt.innerHTML = view.hunt ? hunterHTML(st) : ""; });
    var hist = st.lines.slice(0, -1);
    MV.keepFocus(E.hist, function(){
      E.hist.innerHTML = (hist.length > 2 ? '<button type="button" class="linkbtn sp-more" data-act="hist" data-k="sphist" aria-expanded="' + view.all + '">' + (view.all ? "Show the last two lines" : "Show all " + hist.length + " earlier lines") + "</button>" : "") +
        '<ol class="sp-lines' + (view.all ? " all" : "") + '" aria-label="Earlier lines">' + hist.map(function(l){ return '<li class="sp-l">' + lineHTML(l) + "</li>"; }).join("") + "</ol>";
    });
    L.cap.innerHTML = lineHTML(st.lines[st.lines.length - 1]);
    var P = EQ[S.cur].P, n = deg(P), fr = sortRoots(st.found);
    E.gcap.innerHTML = "Graph of " + m("y = " + (EQ[S.cur].src || pStr(P))) + (EQ[S.cur].R ? " (left side − right side)" : "") + ".";
    L.read.innerHTML = MV.readoutHTML([
      [C.readout.line, lineHTML(st.lines[st.lines.length - 1])],
      [C.readout.roots, fr.length ? fr.map(function(r){ return m("x = " + r.lab) + (r.m >= 2 ? " (order " + r.m + ")" : ""); }).join(", ") : st.solved ? "none (no real roots)" : "none yet"],
      [C.readout.none, st.none.length ? st.none.map(function(s){ return m(s + " = 0") + " has no real roots"; }).join("; ") : st.solved ? "none" : "none found yet"],
      [C.readout.ints, (fr.length ? String(fr.length) + (st.solved ? "" : " found so far") : st.solved ? "0" : "none found yet") + " (degree " + n + ", so at most " + n + ")"],
      [C.readout.moves, String(st.moves)]
    ]);
  }
  function paint(){
    MV.keepFocus(E.modes, function(){ E.modes.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Mode:</span><span class="seg" role="group" aria-label="Mode">' +
      [["solve", "Solve equations"], ["build", "Build mode"]].map(function(x){ return '<button type="button" data-mode="' + x[0] + '" data-k="spmode' + x[0] + '" aria-pressed="' + (S.mode === x[0]) + '"' + (view.busy ? " disabled" : "") + ">" + x[1] + "</button>"; }).join("") + "</span></div>"; });
    var b = S.mode === "build";
    E.solve.hidden = b; E.build.hidden = !b; E.hist.hidden = b;
    if (b) {
      L.cap.innerHTML = m(pStr([1, 0, -10, 0, S.k]) + " = 0");
      E.gcap.innerHTML = "Graph of " + m("y = x^4 - 10x^2 + k") + ", with " + m("k = " + S.k) + ".";
      buildRead();
    } else paintSolve();
    plot.render();
  }
  host.addEventListener("click", function(e){
    var btn = e.target.closest("button"); if (!btn || btn.disabled || !host.contains(btn)) return;
    var d = btn.dataset;
    if (!view.busy && !btn.closest(".slider")) MV.banner("", "");
    if (d.mode) { S.mode = d.mode; view.hunt = null; view.fb = null; changed(); return; }
    if (d.eq) { if (S.cur !== d.eq) { S.cur = d.eq; view.hunt = null; view.fb = null; view.all = false; changed(); } return; }
    if (d.move) { apply(d.move); return; }
    if (d.hm) { view.hm = d.hm; paint(); return; }
    if (d.hc) { var p = d.hc.split("/"); test(cur(), F(+p[0], +p[1])); changed(); if (!view.hunt) { var mb = $('[data-move="test"]', host); if (mb) mb.focus({ preventScroll:true }); } return; }
    if (d.act === "hclose") { view.hunt = null; paint(); var tb = $('[data-move="test"]', host); if (tb) tb.focus({ preventScroll:true }); return; }
    if (d.act === "reset") { S.st[S.cur] = fresh(S.cur); view.hunt = null; view.fb = null; view.all = false; changed(); return; }
    if (d.act === "hist") { view.all = !view.all; paint(); return; }
  });
  paint();
  return {
    S:S, cur:cur, build:build, paint:paint,
    load:function(id, pre){ S.mode = "solve"; S.cur = id; S.st[id] = fresh(id); S.st[id].demo = true; view.hunt = null; view.fb = null; view.all = false; (pre || []).forEach(function(mv){ var st = cur(), r = doMove(st, mv); if (r.lines) { st.moves++; r.lines.forEach(function(l){ st.lines.push(l); }); } }); changed(); },
    demo:function(id){ view.flash = id; apply(id); MV.wait(700, function(){ view.flash = null; paint(); }); },
    busy:function(b){ view.busy = b; paint(); }
  };
}

// ---------- Explore: predictions and challenge tests ----------
var PRED = {
  p1:{ eq:"p1", pre:[], run:["divx", "side", "cf", "zero"] },
  p2:{ eq:"e3", pre:["u", "quad"], run:["zero"] },
  p3:{ eq:"e5", pre:["u", "quad"], run:["zero"] },
  p4:{ eq:"p4", pre:[], run:["zero"] }
};
function chalTest(H, id, C){
  var c = C.challenges.filter(function(x){ return x.id === id; })[0], M = c.msgs, S = H.S;
  function roots(st){ return st.found.map(function(r){ return r.v; }); }
  if (id === "tc1") {
    var a = S.st.e2;
    if (!a || !a.solved || !sameSet(roots(a), [-3, -2, 3])) return { ok:false, msg:M.pick };
    if (a.moves > 4) return { ok:false, msg:M.more + " " + M.moves.replace("{n}", a.moves) };
    return { ok:true };
  }
  if (id === "tc2") {
    var b = S.st.e4;
    if (b && b.solved && sameSet(roots(b), [-2, 0.5, 3])) return { ok:true };
    if (b && b.found.length && b.found.every(function(r){ return Number.isInteger(r.v); })) return { ok:false, msg:M.ints };
    return { ok:false, msg:M.pick };
  }
  if (id === "tc3") {
    var info = H.build(S.k), n = info.roots.length;
    if (n === 2 && info.roots.every(function(r){ return r.int; })) return { ok:true };
    if (n === 4) return { ok:false, msg:M.four };
    if (n === 3) return { ok:false, msg:M.three };
    if (n === 0) return { ok:false, msg:M.none };
    var r0 = info.roots[0], lab = info.exact ? "±√" + Math.round(info.us[0]) : "≈ ±" + num(Math.abs(r0.v), 2);
    if (info.exact && isSq(Math.round(info.us[0]))) lab = "±" + Math.round(Math.abs(r0.v));
    return { ok:false, msg:M.twoIrr.replace("{r}", lab) };
  }
  return { ok:false };
}

// ---------- Part 3: roots ↔ intercepts ----------
// @component N25 flattenMorph — animates f and g into f − g: the curve f − t·g morphs while g flattens to (1 − t)·g, so each
//   intersection slides straight down onto the x-axis; vertical guide lines join each intersection to its intercept.
//   flattenMorph(plot, {f, g, xs, view, t, place0/place1:[{dx, dy, align}] label spots, describe(t)}) -> {t(), to(target, done), draw()}
function flattenMorph(plot, o){
  var t = o.t || 0, cancel = null;
  function draw(){
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), curves = [], segs = [], pts = [];
    curves.push({ f:o.f, color:pen, width:3, alpha:1 - 0.65 * t, arrows:t < 0.5 });
    if (t < 0.999) curves.push({ f:function(x){ return (1 - t) * o.g(x); }, color:ink2, width:2, dash:[6, 6], arrows:t < 0.05 });
    if (t > 0) curves.push({ f:function(x){ return o.f(x) - t * o.g(x); }, color:ink, width:3.4, arrows:t > 0.95 });
    var labs = [], font = "600 14px " + (css("--font-math") || "serif");
    o.xs.forEach(function(x, i){
      var y0 = o.f(x), y = (1 - t) * o.g(x), pl = (t >= 1 ? o.place1 : o.place0 || [])[i] || { dx:8, dy:-14, align:"left" };
      if (t > 0) { segs.push({ x1:x, y1:y0, x2:x, y2:y, color:ink2, width:1.6, dash:[4, 4] }); pts.push({ x:x, y:y0, r:5, open:true, color:ink2 }); }
      pts.push({ x:x, y:y, r:6, color:ink });
      if (t === 0 || t >= 1) labs.push({ x:x, y:y, dx:pl.dx, dy:pl.dy, align:pl.align, bg:true, font:font, text:t >= 1 ? num(x) : "(" + num(x) + ", " + num(y0) + ")" });
    });
    plot.draw({ view:o.view, curves:curves, segments:segs, points:pts, labels:labs, describe:o.describe(t) });
  }
  plot.render = draw;
  return {
    t:function(){ return t; },
    draw:draw,
    to:function(target, done){
      if (cancel) cancel();
      var from = t;
      cancel = MV.tween({ dur:1600, step:function(s){ t = from + (target - from) * s; draw(); }, done:function(){ t = target; cancel = null; draw(); if (done) done(); } });
    }
  };
}
var BOX = [1, -13, 40, -36];
function part3(host, api){
  var C = api.content, S = api.S, ST = C.stations;
  if (!S.st) S.st = "s1";
  if (!S.box) S.box = { miss:[], hit:null, tests:0 };
  if (S.s == null) S.s = 0;
  var s1 = ST[0], s2 = ST[1], s3 = ST[2];
  host.innerHTML = '<div class="chips rt-chips" role="group" aria-label="Station"></div>' +
    '<div class="rt-st" data-stp="s1"><h3>' + s1.title + '</h3><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="rt1-plot" role="img" aria-label="Two graphs"></canvas></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-rt="sub" data-k="rtsub"></button></div></div>' +
      '<div><p>' + s1.text + '</p><dl class="read" id="rt1-read" aria-live="polite"></dl><details class="alg">' + s1.alg + "</details></div></div></div>" +
    '<div class="rt-st" data-stp="s2"><h3>' + s2.title + '</h3><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="rt2-plot" role="img" aria-label="Graph of V minus 144"></canvas></div><div id="rt2-res" aria-live="polite"></div></div>' +
      '<div><p>' + s2.text + '</p><div class="alg-lines rt-model">' + s2.model.map(function(x){ return "<span>" + x + "</span>"; }).join("") + '</div><p class="how">' + s2.how + '</p>' +
      '<div class="rh-board" id="rt2-board" role="group" aria-label="Candidates for x"></div><div class="rt-foot"><span class="tiny" id="rt2-count" aria-live="polite"></span><button type="button" class="btn ghost sm" data-rt="boxreset" data-k="rtboxreset">Start over</button></div>' +
      '<details class="alg">' + s2.alg + "</details></div></div></div>" +
    '<div class="rt-st" data-stp="s3"><h3>' + s3.title + '</h3><div class="sym"><div><div class="plot-wrap"><canvas class="plot" id="rt3-plot" role="img" aria-label="W-shaped quartic"></canvas></div></div>' +
      '<div><p>' + s3.text + '</p><div id="rt3-sl"></div><dl class="read" id="rt3-read" aria-live="polite"></dl><details class="alg">' + s3.alg + "</details></div></div></div>";

  // station 1: two views, then the flatten morph
  var f1 = hor([1, 2, 0, 0]), g1 = hor([9, 18]), XS = [-3, -2, 3];
  var p1 = new MV.Plot($("#rt1-plot"), { xmin:-4.6, xmax:4.6, ymin:-40, ymax:60 });
  var morph = flattenMorph(p1, { f:f1, g:g1, xs:XS, t:S.sub ? 1 : 0, view:{ xmin:-4.6, xmax:4.6, ymin:-40, ymax:60 },
    place0:[{ dx:8, dy:16, align:"left" }, { dx:-8, dy:-14, align:"right" }, { dx:-8, dy:-14, align:"right" }],
    place1:[{ dx:-8, dy:-14, align:"right" }, { dx:8, dy:-14, align:"left" }, { dx:-8, dy:-14, align:"right" }],
    describe:function(t){ return t >= 1 ? "Graph of y = x³ + 2x² − 9x − 18 crossing the x-axis at −3, −2 and 3. Dashed guide lines join each intercept to the matching intersection of the two original graphs, which are shown faintly." :
      t > 0 ? "The two graphs are being subtracted: the dashed line flattens onto the x-axis and the intersections slide straight down." :
      "Graphs of y = x³ + 2x² (solid) and y = 9x + 18 (dashed), meeting at (−3, −9), (−2, 0) and (3, 45)."; } });
  function read1(){
    var on = S.sub;
    $("#rt1-read").innerHTML = MV.readoutHTML(on ? [["Graph", m("y = x^3 + 2x^2 - 9x - 18")], [m("x") + "-intercepts", "−3, −2, 3"], ["", s1.after]] :
      [["Graphs", m("y = x^3 + 2x^2") + " and " + m("y = 9x + 18")], ["Intersections", "(−3, −9), (−2, 0), (3, 45)"]]);
    var b = $('[data-rt="sub"]', host); b.textContent = on ? MV.plain(s1.back) : MV.plain(s1.btn);
  }

  // station 2: the box, with a candidate board for x³ − 13x² + 40x − 36
  var p2 = new MV.Plot($("#rt2-plot"), { xmin:-1, xmax:10.5, ymin:-260, ymax:200 }), V2 = hor([4, -52, 160, -144]);
  function boxRoots(){
    if (!S.box.hit) return null;
    var z = F(S.box.hit[0], S.box.hit[1]), q = synth(toF(BOX), z).q.map(fv), D = disc(q), s = Math.round(Math.sqrt(D));
    var r1 = (-q[1] - s) / 2, r2 = (-q[1] + s) / 2;
    return { z:fv(z), q:q, rs:[r1, r2] };
  }
  p2.render = function(){
    var R = boxRoots(), pts = [], ink = css("--ink"), band = MV.plain(s2.band);
    if (R) { pts.push({ x:2, y:0, r:6.5, color:ink, text:"2 (order 2)" }, { x:9, y:0, r:6.5, color:ink, text:"9" }); }
    var W2 = { xmin:-1, xmax:10.5, ymin:-260, ymax:200 };
    p2.draw({ view:W2, bands:[{ x0:0, x1:5 }], curves:[{ f:V2, color:css("--pen"), width:3.2, arrows:true }], points:pts,
      labels:[{ x:2.5, y:170, text:band, align:"center", bg:true, font:"600 12px " + (css("--font-ui") || "sans-serif"), color:css("--ink") }].concat(dotLabels(W2, pts)),
      describe:"Graph of y = V(x) − 144 = 4x³ − 52x² + 160x − 144, with the valid sizes 0 < x < 5 shaded." + (R ? " It touches the x-axis at 2 (order 2) and crosses at 9, outside the shaded band." : "") });
  };
  function paint2(){
    var B = S.box, q = toF(BOX), R = boxRoots();
    var h = candList(q, "int").map(function(z){
      var mm = B.miss.filter(function(x){ return x[0] === z.n; })[0], hit = B.hit && B.hit[0] === z.n;
      var val = mm ? "P(" + fsrc(z) + ") = " + num(mm[1]).replace(MV.MINUS, "-") : hit ? "P(" + fsrc(z) + ") = 0" : "";
      return '<button type="button" class="rh-tile' + (mm ? " miss" : "") + (hit ? " hit" : "") + '" data-bx="' + z.n + '" data-k="rtbx' + z.n + '"' + (val || R ? " disabled" : "") + ' aria-label="' + MV.esc(val ? plainM(val) + (hit ? ", a factor" : ", not a factor") : "Test x = " + plainM(fsrc(z))) + '"><span class="rh-c">' + m(fsrc(z)) + "</span>" + (val ? '<span class="rh-v">' + m(val) + (hit ? " ✓" : "") + "</span>" : "") + "</button>";
    }).join("");
    MV.keepFocus($("#rt2-board"), function(){ $("#rt2-board").innerHTML = h; });
    $("#rt2-count").textContent = "Tests used: " + B.tests + ".";
    var res = "";
    if (R) {
      var z = R.z, other = R.rs.map(function(r){ return "(" + pStr([1, -r]) + ")"; }), qs = pStr(R.q);
      var full = z === 2 ? "(x - 2)^2(x - 9)" : "(x - 9)(x - 2)^2";
      res += '<div class="alg-lines rt-fac"><span>' + m("x = " + z) + " works: " + m("P(" + z + ") = " + subst(q, F(z)) + " = 0") + "</span><span>" + m(pStr(BOX) + " = (" + pStr([1, -z]) + ")(" + qs + ")") + "</span><span>" + m("= (" + pStr([1, -z]) + ")" + other.join("") + " = " + full) + "</span></div>";
      res += "<p>Roots: 2 (order 2) and 9. The graph of " + m("V - 144") + " touches at 2 and crosses at 9.</p>";
      res += MV.tableHTML({ caption:"Box dimensions for each root", head:[m("x"), m("10 - 2x"), m("16 - 2x"), "Box?"], rows:[
        ["2", "6", "12", "✓ 2 × 6 × 12 = 144"], ["9", "−8", "−2", "✗ " + m("10 - 18 < 0") + ": rejected"]] });
      res += MV.fbHTML("good", "<strong>✓</strong> " + s2.result);
    }
    $("#rt2-res").innerHTML = res;
    p2.render();
  }

  // station 3: the W with a constant s added
  var p3 = new MV.Plot($("#rt3-plot"), { xmin:-4.6, xmax:4.6, ymin:-55, ymax:75 });
  function wInfo(){
    var c = 36 + S.s, D = 169 - 4 * c, out = { c:c, D:D, us:[], roots:[] };
    if (D < 0) return out;
    var s = Math.sqrt(D), us = D === 0 ? [6.5] : [(13 + s) / 2, (13 - s) / 2];
    out.us = us;
    us.forEach(function(u){ if (Math.abs(u) < 1e-9) out.roots.push(0); else if (u > 0) out.roots.push(Math.sqrt(u), -Math.sqrt(u)); });
    out.roots = sortN(out.roots);
    return out;
  }
  function lab3(x){ var r = Math.round(x); return Math.abs(x - r) < 1e-9 ? num(r) : "≈ " + num(x, 2); }
  p3.render = function(){
    var w = wInfo(), ink = css("--ink");
    var W3 = { xmin:-4.6, xmax:4.6, ymin:-55, ymax:75 }, pts3 = w.roots.map(function(x){ return { x:x, y:0, r:6, color:ink, text:lab3(x) }; });
    p3.draw({ view:W3, curves:[{ f:function(x){ return hor([1, 0, -13, 0, 36])(x) + S.s; }, color:css("--pen"), width:3.2, arrows:true }],
      points:pts3, labels:dotLabels(W3, pts3),
      describe:"Graph of y = x⁴ − 13x² + 36 + s with s = " + num(S.s) + ". It has " + w.roots.length + " x-intercept" + (w.roots.length === 1 ? "" : "s") + (w.roots.length ? " at " + w.roots.map(lab3).join(", ") : "") + "." });
  };
  function read3(){
    var w = wInfo(), kind, uv;
    if (w.D < 0) { kind = "no real " + m("u") + "-roots, so no non-negative ones"; uv = "none"; }
    else if (w.D === 0) { kind = "one positive " + m("u") + "-root, repeated"; uv = m("u = 6.5") + " (twice)"; }
    else {
      uv = w.us.map(function(u){ var r = Math.round(u); return Math.abs(u - r) < 1e-9 ? m("u = " + r) : m("u") + " ≈ " + num(u, 2); }).join(" or ");
      kind = w.c > 0 ? "two positive " + m("u") + "-roots" : w.c === 0 ? "one positive " + m("u") + "-root and " + m("u = 0") : "one positive " + m("u") + "-root (the other is negative)";
    }
    var cS = (w.c < 0 ? " - " : " + ") + num(Math.abs(w.c)).replace(MV.MINUS, "-");
    $("#rt3-read").innerHTML = MV.readoutHTML([
      ["Graph", m("y = x^4 - 13x^2 + 36" + (S.s ? (S.s < 0 ? " - " : " + ") + num(Math.abs(S.s)) : ""))],
      ["With " + m("u = x^2"), m("u^2 - 13u" + (w.c === 0 ? "" : cS) + " = 0")],
      [m("u") + "-roots", uv + ": " + kind],
      [m("x") + "-intercepts", String(w.roots.length)]
    ]);
  }
  MV.sliders($("#rt3-sl"), [{ id:"rts", label:m("s"), min:-40, max:20, step:0.25, value:S.s }], function(id, v){ S.s = v; api.save(); read3(); p3.render(); });

  function paintChips(){
    MV.keepFocus($(".rt-chips", host), function(){ $(".rt-chips", host).innerHTML = ST.map(function(st){ return '<button type="button" class="fchip txt" data-stn="' + st.id + '" data-k="rtst' + st.id + '" aria-pressed="' + (S.st === st.id) + '">' + st.chip + "</button>"; }).join(""); });
    MV.$$(".rt-st", host).forEach(function(el){ el.hidden = el.dataset.stp !== S.st; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.stn) { S.st = b.dataset.stn; api.save(); paintChips(); MV.redrawAll(); return; }
    if (b.dataset.rt === "sub") { S.sub = !S.sub; api.save(); read1(); morph.to(S.sub ? 1 : 0); return; }
    if (b.dataset.rt === "boxreset") { S.box = { miss:[], hit:null, tests:0 }; api.save(); paint2(); return; }
    if (b.dataset.bx != null) {
      var z = F(+b.dataset.bx), v = pEval(toF(BOX), z); S.box.tests++;
      if (v.n === 0) S.box.hit = [z.n, z.d]; else S.box.miss.push([z.n, fv(v)]);
      api.save(); paint2();
      if (S.box.hit) { var r = $("#rt2-res"); if (r) MV.focusFb(r); }
      return;
    }
  });
  paintChips(); read1(); morph.draw(); paint2(); read3(); p3.render();
}

// ---------- Practice 2: Solve it ----------
// @component N4 rootBoxes — one item at a time; enter every real root in number boxes with "Add another root" (fractions and ±
//   accepted, order-free, duplicates ignored); named wrong sets ({match} or {missing}), three-level hints, first-try scoring
function rootBoxes(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  var msgs = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { vals:["", ""], tries:0, hint:0, solved:false, first:null }); }
  function paint(){
    var it = a.items[S.i], x = ist(it), isK = it.kind === "k";
    var h = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted">Problem ' + (S.i + 1) + " of " + a.items.length + (it.star ? " ★" : "") + '</span><span class="dots" aria-hidden="true">' +
      a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<p class="rb-q' + (isK ? " txt" : "") + '">' + it.prompt + "</p>";
    h += '<div class="rb-row"><span class="rb-lab">' + (isK ? a.kLabel : a.label) + ':</span><span class="rb-boxes">' + x.vals.map(function(v, i){
      return '<input class="numin short rb-in" type="text" inputmode="text" autocomplete="off" spellcheck="false" data-rb="' + i + '" data-k="rb' + it.id + i + '" aria-label="' + MV.esc((isK ? "Value of k " : "Root ") + (i + 1)) + '" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + ">";
    }).join("") + "</span></div>";
    if (!x.solved) {
      h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="add" data-k="rbadd"' + (x.vals.length >= 8 ? " disabled" : "") + ">" + a.add + '</button><button type="button" class="btn ghost sm" data-act="less" data-k="rbless"' + (x.vals.length <= 1 ? " disabled" : "") + ">Remove the last box</button></div>";
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="rbchk">Check</button>' + MV.hintBtn("rbh" + it.id, x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    }
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="prev" data-k="rbprev"' + (S.i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-act="next" data-k="rbnext"' + (S.i === a.items.length - 1 ? " disabled" : "") + ">Next</button></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function judge(it, x){
    var raw = x.vals.filter(function(s){ return String(s).trim(); }), vals = [];
    if (!raw.length) return { soft:"Enter at least one " + (it.kind === "k" ? "value" : "root") + " first." };
    for (var i = 0; i < raw.length; i++) { var r = MV.parseNum(raw[i]); if (!r) return { soft:"Enter numbers such as −3, 1/2 or ±2, one in each box." }; vals = vals.concat(r); }
    var uniq = []; vals.forEach(function(v){ if (!uniq.some(function(u){ return Math.abs(u - v) < 1e-6; })) uniq.push(v); });
    var ans = MV.ans(it);
    if (sameSet(uniq, ans)) return { ok:true };
    var named = (it.wrong || []).filter(function(w){
      if (w.match) return sameSet(uniq, w.match);
      if (w.missing != null) return sameSet(uniq, ans.filter(function(t){ return Math.abs(t - w.missing) > 1e-6; }));
      return false;
    })[0];
    return { fb:named ? named.fb : (it.general || "Substitute each of your roots into the original equation to check it.") };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || t.dataset.rb == null) return; var it = a.items[S.i]; ist(it).vals[+t.dataset.rb] = t.value; msgs[it.id] = null; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rb != null) { e.preventDefault(); var b = host.querySelector('[data-act="check"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var it = a.items[S.i], x = ist(it), act = b.dataset.act;
    if (act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (act === "add") { x.vals.push(""); api.save(); paint(); var ins = host.querySelectorAll(".rb-in"); if (ins.length) ins[ins.length - 1].focus(); return; }
    if (act === "less") { if (x.vals.length > 1) x.vals.pop(); api.save(); paint(); return; }
    if (act === "prev" || act === "next") { S.i += act === "prev" ? -1 : 1; api.save(); paint(); return; }
    if (act === "check") {
      var r = judge(it, x);
      if (r.soft) msgs[it.id] = r.soft;
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: touch on the left ----------
// exact real roots of a monic integer cubic x³ + bx² + cx + d: integer roots with orders, then the rest from the discriminant
function cubicRoots(b, c, d){
  var q = [1, b, c, d], out = [];
  function divOut(r){ var res = synth(toF(q), F(r)); q = res.q.map(fv); var h = out.filter(function(x){ return x.v === r; })[0]; if (h) h.m++; else out.push({ v:r, m:1, exact:true }); }
  var found = true;
  while (found && q.length > 1) {
    found = false;
    if (q[q.length - 1] === 0) { divOut(0); found = true; continue; }
    var cs = divisors(q[q.length - 1]);
    for (var i = 0; i < cs.length && !found; i++) [cs[i], -cs[i]].forEach(function(r){ if (!found && hor(q)(r) === 0) { divOut(r); found = true; } });
  }
  if (q.length === 3) {
    var D = q[1] * q[1] - 4 * q[2];
    if (D > 0) [(-q[1] - Math.sqrt(D)) / 2, (-q[1] + Math.sqrt(D)) / 2].forEach(function(v){ out.push({ v:v, m:1, exact:false }); });
  } else if (q.length === 4) {
    var f = hor(q), xs = [], prev = f(-80);
    for (var x = -80 + 0.005; x <= 80; x += 0.005) { var y = f(x); if (prev * y < 0) { var lo = x - 0.005, hi = x; for (var k = 0; k < 50; k++) { var mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; } xs.push((lo + hi) / 2); } prev = y; }
    xs.forEach(function(v){ out.push({ v:v, m:1, exact:false }); });
  }
  return out.sort(function(p, r){ return p.v - r.v; });
}
var task = (function(){
  var api, plot, KEYS = ["b", "c", "d"];
  function read(){
    var s = api ? api.S : {}, v = KEYS.map(function(k){ var r = MV.parseNum(s[k]); return r && r.length === 1 ? r[0] : NaN; });
    return { b:v[0], c:v[1], d:v[2], ok:v.every(function(x){ return Number.isInteger(x) && x >= -20 && x <= 20; }) };
  }
  function rlab(r){ return (r.exact ? num(r.v) : "≈ " + num(r.v, 2)) + (r.m >= 2 ? " (order " + r.m + ")" : ""); }
  function draw(){
    var d = read();
    if (!d.ok) { plot.draw({ view:{ xmin:-5, xmax:5, ymin:-10, ymax:10 }, describe:"Empty graph. Enter whole numbers from −20 to 20 for b, c and d." }); return; }
    var c = [1, d.b, d.c, d.d], rs = cubicRoots(d.b, d.c, d.d), v = viewFor(c);
    var pts = rs.map(function(r){ return { x:r.v, y:0, r:6.5, color:css("--ink"), text:rlab(r) }; });
    plot.draw({ view:v, curves:[{ f:hor(c), color:css("--pen"), width:3.2, arrows:true }], points:pts, labels:dotLabels(v, pts),
      describe:"Graph of y = " + plainM(pStr(c)) + ". Real roots: " + (rs.length ? rs.map(rlab).join(", ") : "none") + "." });
  }
  function preview(){
    var d = read(), el = $("#tl-eq"), rr = $("#tl-roots"); if (!el) return;
    if (!d.ok) { el.innerHTML = '<span class="muted">Enter ' + m("b") + ", " + m("c") + " and " + m("d") + ".</span>"; rr.innerHTML = ""; return; }
    var rs = cubicRoots(d.b, d.c, d.d);
    el.innerHTML = m(pStr([1, d.b, d.c, d.d]) + " = 0");
    rr.innerHTML = "Real roots: " + (rs.length ? rs.map(function(r){ return (r.exact ? m("x = " + r.v) : m("x") + " ≈ " + num(r.v, 2)) + (r.m >= 2 ? " (order " + r.m + ")" : ""); }).join(", ") : "none");
  }
  function facOf(k){ var p = k.split(",").map(Number), rs = cubicRoots(p[0], p[1], p[2]), dbl = rs.filter(function(r){ return r.m === 2; })[0]; return dbl ? "(x - 2)(" + pStr([1, -dbl.v]) + ")^2" : pStr([1, p[0], p[1], p[2]]); }
  return {
    render:function(inp, pv, A){
      api = A; var S = A.S;
      KEYS.forEach(function(k){ if (S[k] == null) S[k] = "0"; });
      inp.innerHTML = '<p class="eq-cap tl-eq" id="tl-eq" aria-live="polite"></p><div class="inrow tl-row">' + KEYS.map(function(k){
        return '<label for="tl-' + k + '"><span>' + m(k) + '</span><span class="tl-box"><button type="button" class="btn ghost sm" data-dk="' + k + '" data-d="-1" aria-label="Decrease ' + k + '">−</button><input id="tl-' + k + '" data-tl="' + k + '" type="number" step="1" min="-20" max="20" value="' + MV.esc(S[k]) + '"><button type="button" class="btn ghost sm" data-dk="' + k + '" data-d="1" aria-label="Increase ' + k + '">+</button></span></label>';
      }).join("") + '</div><p class="tl-roots" id="tl-roots" aria-live="polite"></p>';
      pv.innerHTML = '<canvas class="plot" id="tl-plot" role="img" aria-label="Graph of your cubic"></canvas>';
      plot = new MV.Plot($("#tl-plot"), { xmin:-5, xmax:5, ymin:-10, ymax:10 }); plot.render = draw;
      function upd(){ A.save(); preview(); draw(); A.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tl; if (!k) return; S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-dk]"); if (!b) return; var k = b.dataset.dk, r = MV.parseNum(S[k]), v = r && r.length === 1 ? Math.round(r[0]) : 0; v = Math.max(-20, Math.min(20, v + +b.dataset.d)); S[k] = String(v); $("#tl-" + k).value = v; upd(); });
      preview(); draw();
    },
    read:read,
    valid:function(d){ return d.ok ? true : "Enter a whole number from −20 to 20 for each of " + m("b") + ", " + m("c") + " and " + m("d") + "."; },
    checks:function(d){
      if (!d.ok) return [false, false, false, false];
      var rs = cubicRoots(d.b, d.c, d.d);
      return [8 + 4 * d.b + 2 * d.c + d.d === 0, rs.length === 2, d.d < 0, rs.some(function(r){ return r.m === 2 && r.v < 0; })];
    },
    key:function(d){ return [d.b, d.c, d.d].join(","); },
    label:function(k){ var p = k.split(",").map(Number); return m(facOf(k) + " = " + pStr([1, p[0], p[1], p[2]])); },
    text:function(k){ var p = k.split(",").map(Number); return plainM(facOf(k) + " = " + pStr([1, p[0], p[1], p[2]])); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){
    var C = api.content, H = strategyPath(host, { S:api.S, content:C, onChange:function(){ api.save(); MV.changed(); } }), running = false;
    return {
      predict:{
        start:function(p){ var sc = PRED[p.id]; if (sc) H.load(sc.eq, sc.pre); },
        run:function(p, done){
          var sc = PRED[p.id]; if (!sc || running) { done(); return; }
          running = true; H.busy(true);
          var list = [], gap = 450;
          sc.run.forEach(function(mv){ list.push([gap, function(){ H.demo(mv); }]); gap = mv === "divx" ? 1900 : 1300; });
          list.push([1400, function(){ running = false; H.busy(false); done(); }]);
          seq(list);
        }
      },
      challenge:function(id){ return chalTest(H, id, C); }
    };
  },
  part3:part3,
  activities:{ solve:rootBoxes },
  task:task
});
})();
