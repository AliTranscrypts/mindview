// MHF4U 12 Factor theorem and sum/difference of cubes: hero, N28 root hunter (Explore), volume model and grouping tiles
// (Part 3), "Fully factor" factor builder, "Hide a rational zero" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m;

// ---------- exact fractions and polynomials (coefficients highest power first) ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function F(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; n = n / g; return { n:n === 0 ? 0 : n, d:d / g }; }
function fadd(x, y){ return F(x.n * y.d + y.n * x.d, x.d * y.d); }
function fmul(x, y){ return F(x.n * y.n, x.d * y.d); }
function fdiv(x, y){ return F(x.n * y.d, x.d * y.n); }
function fneg(x){ return F(-x.n, x.d); }
function fv(x){ return x.n / x.d; }
function feq(x, y){ return x.n === y.n && x.d === y.d; }
function fsrc(x, stack){ var a = Math.abs(x.n), s = x.n < 0 ? "-" : ""; return x.d === 1 ? s + a : stack ? s + "{" + a + "}/{" + x.d + "}" : s + a + "/" + x.d; }
function toF(c){ return c.map(function(v){ return typeof v === "number" ? F(v) : v; }); }
function pEval(c, x){ var r = F(0); c.forEach(function(a){ r = fadd(fmul(r, x), a); }); return r; }
function pMul(a, b){ var o = []; for (var i = 0; i < a.length + b.length - 1; i++) o.push(F(0)); a.forEach(function(x, i){ b.forEach(function(y, j){ o[i + j] = fadd(o[i + j], fmul(x, y)); }); }); return o; }
function pTrim(c){ var i = 0; while (i < c.length - 1 && c[i].n === 0) i++; return c.slice(i); }
function pSame(a, b){ a = pTrim(toF(a)); b = pTrim(toF(b)); return a.length === b.length && a.every(function(x, i){ return feq(x, b[i]); }); }
function synth(c, z){ var bot = [c[0]], mid = [null]; for (var i = 1; i < c.length; i++) { var t = fmul(bot[i - 1], z); mid.push(t); bot.push(fadd(c[i], t)); } return { bot:bot, mid:mid, rem:bot[bot.length - 1], q:bot.slice(0, -1) }; }
function pStr(c, stack){
  c = toF(c); var deg = c.length - 1, s = "";
  c.forEach(function(a, i){
    if (a.n === 0) return;
    var e = deg - i, ab = F(Math.abs(a.n), a.d), one = ab.n === 1 && ab.d === 1;
    var term = (one && e > 0 ? "" : fsrc(ab, stack)) + (e > 0 ? "x" + (e > 1 ? "^" + e : "") : "");
    s += s ? (a.n < 0 ? " - " : " + ") + term : (a.n < 0 ? "-" : "") + term;
  });
  return s || "0";
}
// factor whose zero is z = p/q: (qx − p)
function facSrc(z){ var lead = z.d === 1 ? "x" : z.d + "x"; return z.n === 0 ? lead : lead + (z.n > 0 ? " - " : " + ") + Math.abs(z.n); }
function facsSrc(zs){
  var g = [];
  zs.forEach(function(z){ var h = g.filter(function(x){ return feq(x.z, z); })[0]; if (h) h.k++; else g.push({ z:z, k:1 }); });
  return g.map(function(x){ var bare = x.z.n === 0 && x.z.d === 1 && x.k === 1; return (bare ? "x" : "(" + facSrc(x.z) + ")") + (x.k > 1 ? "^" + x.k : ""); }).join("");
}
function constSrc(k){ return k.n === k.d ? "" : k.n === -k.d ? "-" : fsrc(k); }
function divisors(n){ n = Math.abs(n); var o = []; for (var i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o; }
function seq(list){ var i = 0; (function next(){ if (i >= list.length) return; var s = list[i++]; MV.wait(s[0], function(){ s[1](); next(); }); })(); }

// candidate zeros of an integer polynomial: Integral (± divisors of the constant) or Rational (± p/q, lowest terms)
function candList(q, mode){
  if (q.length < 2) return [];
  var lead = Math.abs(fv(q[0])), cst = Math.abs(fv(q[q.length - 1])), out = [], seen = {};
  if (cst === 0) return [F(0)];
  (mode === "rat" ? divisors(lead) : [1]).forEach(function(d){ divisors(cst).forEach(function(n){ var f = F(n, d), k = f.n + "/" + f.d; if (seen[k]) return; seen[k] = 1; out.push(f, F(-f.n, f.d)); }); });
  return out;
}
function candText(list){ var s = []; list.forEach(function(f){ if (f.n > 0) s.push("±" + fsrc(f)); else if (f.n === 0) s.push("0"); }); return s.join(", "); }
// the terms of P(z) for a substitution line: "1 − 2 − 5 + 6"
function subst(c, z){
  var deg = c.length - 1, parts = [];
  c.forEach(function(a, i){ if (a.n === 0) return; var t = a; for (var e = 0; e < deg - i; e++) t = fmul(t, z); if (t.n !== 0) parts.push(t); });
  if (!parts.length) return "0";
  return parts.map(function(t, i){ return i === 0 ? fsrc(t) : (t.n < 0 ? " - " : " + ") + fsrc(F(Math.abs(t.n), t.d)); }).join("");
}
// a·x² + b·x + c with rational zeros -> {z:[z1, z2], k}; otherwise null
function quadInfo(q){
  var a = fv(q[0]), b = fv(q[1]), c = fv(q[2]), D = b * b - 4 * a * c, s = Math.round(Math.sqrt(Math.max(D, 0)));
  if (D < 0 || s * s !== D) return null;
  var z1 = F(-b + s, 2 * a), z2 = F(-b - s, 2 * a);
  return { z:fv(z1) <= fv(z2) ? [z1, z2] : [z2, z1], k:F(a, z1.d * z2.d) };
}
function linSrc(p, c){ var s = (p === 1 ? "" : p) + "x"; return c === 0 ? s : s + (c > 0 ? " + " : " - ") + Math.abs(c); }

// @component N28 rootHunter — root hunter: polynomial chips (presets, a coefficient slider, "Build your own"), Integral /
//   Rational candidate board generated live from the current quotient, exact P(c) on each tile, dots dropping onto the
//   x-intercepts, factor tray, N13 synthetic-division step-through after each hit, "Factor the quadratic" picker, test counter.
//   rootHunter(host, {S, polys:[{id, chip, coeffs (may hold "k") | own:true, k:{min, max}}], onChange})
//   -> {S, load(start), test(z, demo), setMode(id), ghost(g), quotient(), zeros(), done(), base()}
function rootHunter(host, o){
  var S = o.S, POLYS = o.polys;
  if (!S.pid) S.pid = POLYS[0].id;
  if (!S.mode) S.mode = "int";
  if (S.k == null) S.k = 0;
  if (!S.own) S.own = { deg:3, c:[1, 0, -7, 6], raw:null };
  var view = { hold:null, holdT:null, drop:null, ghost:null, pick:false, pickMsg:null, autoT:null };
  var L = MV.pgLayout(host, { aria:"Graph of the polynomial with its zeros found so far" });
  L.graph.insertAdjacentHTML("beforeend", '<div class="rh-tray" aria-live="polite"></div>');
  L.ctrl.innerHTML = '<div class="chips rh-chips" role="group" aria-label="Polynomial"></div><div class="rh-extra"></div><div class="rh-mode"></div>' +
    '<p class="rh-note tiny"></p><div class="rh-board" role="group" aria-label="Candidate board"></div><div class="rh-quad"></div>' +
    '<div class="rh-foot"><span class="rh-count" aria-live="polite"></span><button type="button" class="btn ghost sm" data-rh="reset" data-k="rhreset">Start over</button></div>';
  L.read.insertAdjacentHTML("afterend", '<div class="rh-sd"></div>');
  var E = { tray:$(".rh-tray", host), chips:$(".rh-chips", host), extra:$(".rh-extra", host), note:$(".rh-note", host), board:$(".rh-board", host),
    quad:$(".rh-quad", host), count:$(".rh-count", host), sd:$(".rh-sd", host) };
  var plot = new MV.Plot(L.canvas, { xmin:-5, xmax:5, ymin:-10, ymax:10 });
  var seg = MV.seg($(".rh-mode", host), { label:"Candidate board:", value:S.mode, options:[{ id:"int", t:"Integral zeros" }, { id:"rat", t:"Rational zeros" }],
    onChange:function(v){ S.mode = v; view.ghost = null; changed(); } });

  function def(){ return POLYS.filter(function(p){ return p.id === S.pid; })[0] || POLYS[0]; }
  function base(){ var p = def(); return p.own ? S.own.c.slice() : p.coeffs.map(function(v){ return v === "k" ? S.k : v; }); }
  function quotient(){ var q = toF(base()); S.found.forEach(function(z){ q = synth(q, F(z.n, z.d)).q.map(function(v){ return fdiv(v, F(z.d)); }); }); return q; }
  function zeros(){ return S.found.map(function(z){ return F(z.n, z.d); }); }
  function done(){ var q = quotient(); return q.length === 1 || (q.length === 3 && S.quad === "no"); }
  function fullSrc(){ var q = quotient(), zs = zeros().sort(function(x, y){ return Math.abs(fv(x)) - Math.abs(fv(y)) || fv(y) - fv(x); }); return q.length === 1 ? constSrc(q[0]) + facsSrc(zs) : facsSrc(zs) + "(" + pStr(q) + ")"; }
  function ofName(){ return S.found.length ? "Q" : "P"; }
  function resetHunt(){
    S.found = []; S.miss = []; S.tests = 0; S.quad = null; S.last = null; S.div = null; S.demo = false;
    clearTimeout(view.holdT); clearTimeout(view.autoT); view.hold = null; view.drop = null; view.ghost = null; view.pick = false; view.pickMsg = null;
    E.sd.innerHTML = "";
  }
  if (!S.found) resetHunt();
  function changed(){ paint(); if (o.onChange) o.onChange(); }

  // ----- graph -----
  var vcache = {};
  function viewFor(c){
    var key = c.join(","); if (vcache[key]) return vcache[key];
    var f = function(x){ return c.reduce(function(r, a){ return r * x + a; }, 0); }, roots = [], x, prev = f(-9);
    for (x = -9 + 0.01; x <= 9; x += 0.01) { var y = f(x); if (y === 0 || prev * y < 0) roots.push(x); prev = y; }
    var x0 = Math.max(-9.5, Math.min(-3, (roots.length ? Math.min.apply(null, roots) : 0) - 1.2)), x1 = Math.min(9.5, Math.max(3, (roots.length ? Math.max.apply(null, roots) : 0) + 1.2));
    var ys = [0, f(0)], N = 300, vals = [];
    for (var i = 0; i <= N; i++) vals.push(f(x0 + (x1 - x0) * i / N));
    for (i = 1; i < N; i++) if ((vals[i] - vals[i - 1]) * (vals[i + 1] - vals[i]) <= 0) ys.push(vals[i]);
    var lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
    if (hi - lo < 6) { var mid = (hi + lo) / 2; lo = mid - 3; hi = mid + 3; }
    var pad = (hi - lo) * 0.2;
    return (vcache[key] = { xmin:x0, xmax:x1, ymin:lo - pad, ymax:hi + pad });
  }
  function irr(){
    var q = quotient(); if (q.length !== 3) return [];
    var a = fv(q[0]), b = fv(q[1]), c = fv(q[2]), D = b * b - 4 * a * c;
    if (D <= 0 || quadInfo(q)) return [];
    var allMiss = candList(q, S.mode).every(function(z){ return S.miss.some(function(mm){ return mm.n === z.n && mm.d === z.d; }); });
    if (S.quad !== "no" && !allMiss) return [];
    return [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)];
  }
  plot.render = function(){
    var c = base(), v = viewFor(c), zs = zeros(), ink = css("--ink"), pts = [];
    zs.forEach(function(z, i){
      var y = 0; if (view.drop && i >= view.drop.from) y = (v.ymax - (v.ymax - v.ymin) * 0.04) * (1 - view.drop.t);
      pts.push({ x:fv(z), y:y, r:6.5, color:ink, label:y === 0 ? MV.plain(m(fsrc(z))) : "" });
    });
    irr().forEach(function(r){ pts.push({ x:r, y:0, r:6, open:true, ring:true, color:ink, label:"≈ " + num(r, 2) }); });
    plot.draw({ view:v, curves:[{ f:function(x){ return c.reduce(function(r, a){ return r * x + a; }, 0); }, color:css("--pen"), width:3.2, arrows:true }], points:pts,
      describe:MV.plain(m("P(x) = " + pStr(c))) + ". " + (zs.length ? "Zeros found so far: " + zs.map(function(z){ return MV.plain(m(fsrc(z))); }).join(", ") + "." : "No zeros found yet.") +
        (irr().length ? " The graph also crosses the x-axis at about " + irr().map(function(r){ return num(r, 2); }).join(" and ") + "." : "") });
  };
  function dropDots(from){
    view.drop = { from:from, t:0 };
    MV.tween({ dur:650, step:function(t){ if (view.drop) { view.drop.t = t; plot.render(); } }, done:function(){ view.drop = null; plot.render(); } });
  }

  // ----- controls -----
  function paintChips(){
    E.chips.innerHTML = POLYS.map(function(p){ return '<button type="button" class="fchip' + (/`/.test(p.chip) ? "" : " txt") + '" data-rh-pid="' + p.id + '" data-k="rhp' + p.id + '" aria-pressed="' + (S.pid === p.id) + '">' + MV.md(p.chip) + "</button>"; }).join("");
  }
  function paintExtra(){
    var p = def(), box = document.createElement("div");
    E.extra.innerHTML = ""; E.extra.appendChild(box);
    if (p.k) {
      box.className = "rh-k";
      MV.sliders(box, [{ id:"rhk", label:m("k"), min:p.k.min, max:p.k.max, step:1, value:S.k }], function(id, v){ S.k = v; resetHunt(); changed(); });
    } else if (p.own) {
      var ow = S.own, raw = ow.raw || ow.c.map(String), names = ow.deg === 4 ? ["x^4", "x^3", "x^2", "x", ""] : ["x^3", "x^2", "x", ""];
      box.className = "rh-own";
      box.innerHTML = '<div class="seg-wrap"><span class="tiny" style="font-weight:700">Degree:</span><span class="seg" role="group" aria-label="Degree">' +
        [3, 4].map(function(d){ return '<button type="button" data-rh-deg="' + d + '" data-k="rhdeg' + d + '" aria-pressed="' + (ow.deg === d) + '">' + d + "</button>"; }).join("") + "</span></div>" +
        '<div class="rh-own-in">' + names.map(function(nm, i){ return '<label><span>' + (nm ? m(nm) : "constant") + '</span><input type="number" step="1" data-rh-oc="' + i + '" value="' + MV.esc(raw[i]) + '" aria-label="' + (nm ? "Coefficient of " + MV.plain(m(nm)) : "Constant term") + '"></label>'; }).join("") + "</div>" +
        '<p class="tiny muted rh-own-msg" aria-live="polite">Leading coefficient 1 to 4; the others are whole numbers from −12 to 12.</p>';
    } else E.extra.innerHTML = "";
  }
  function tileHTML(z, st){
    var val = st.miss ? ofName() + "(" + fsrc(z) + ") = " + fsrc(st.miss) : st.hit ? st.of + "(" + fsrc(z) + ") = 0" : "";
    var lab = val ? MV.plain(m(val)) + (st.hit ? ", a factor" : ", not a factor") : "Test x = " + MV.plain(m(fsrc(z)));
    return '<button type="button" class="rh-tile' + (st.miss ? " miss" : "") + (st.hit ? " hit" : "") + '" data-rh-c="' + z.n + "/" + z.d + '" data-k="rhc' + z.n + "_" + z.d + '"' + (val || st.off ? " disabled" : "") + ' aria-label="' + MV.esc(lab) + '">' +
      '<span class="rh-c">' + m(fsrc(z, true)) + "</span>" + (val ? '<span class="rh-v">' + m(val) + (st.hit ? " ✓" : "") + "</span>" : "") + "</button>";
  }
  function paintBoard(){
    var q, mode, miss, hitZ = null, off = false;
    if (view.hold) { q = view.hold.q; mode = view.hold.mode; miss = view.hold.miss; hitZ = view.hold.hit; off = true; }
    else { q = quotient(); mode = S.mode; miss = S.miss; }
    var fin = !view.hold && done(), of = view.hold ? view.hold.of : ofName();
    if (fin) { E.note.innerHTML = "Fully factored. Nothing left to test."; MV.keepFocus(E.board, function(){ E.board.innerHTML = ""; }); return; }
    var lead = Math.abs(fv(q[0])), cst = Math.abs(fv(q[q.length - 1]));
    E.note.innerHTML = cst === 0 ? "The constant term is 0, so " + m("x = 0") + " is a zero: " + m("x") + " is a factor." :
      mode === "int" ? "<strong>Integral zero theorem:</strong> an integer zero divides the constant term " + num(cst) + "." :
      "<strong>Rational zero theorem:</strong> " + m("p") + " divides the constant term " + num(cst) + " and " + m("q") + " divides the leading coefficient " + num(lead) + ".";
    var h = candList(q, mode).map(function(z){
      var mm = miss.filter(function(x){ return x.n === z.n && x.d === z.d; })[0];
      return tileHTML(z, { miss:mm ? F(mm.v[0], mm.v[1]) : null, hit:hitZ && feq(hitZ, z), of:of, off:off });
    }).join("");
    if (view.ghost && !view.hold) h += '<span class="rh-tile ghost" role="note"><span class="rh-c">' + m(fsrc(view.ghost.z)) + '</span><span class="rh-v">' + view.ghost.note + "</span></span>";
    MV.keepFocus(E.board, function(){ E.board.innerHTML = h; });
  }
  function quadChoices(q){
    var A = fv(q[0]), B = fv(q[1]), C = fv(q[2]), info = quadInfo(q), pool = [], seen = {};
    var tgt = [A, B, C].join(",");
    function add(L, k, ok){
      var e = [k * L[0][0] * L[1][0], k * (L[0][0] * L[1][1] + L[1][0] * L[0][1]), k * L[0][1] * L[1][1]].join(",");
      if (seen[e] || (!ok && e === tgt)) return; seen[e] = 1; pool.push({ L:L, k:k, ok:!!ok });
    }
    if (info) add([[info.z[0].d, -info.z[0].n], [info.z[1].d, -info.z[1].n]], fv(info.k), true);
    if (info) add([[info.z[0].d, info.z[0].n], [info.z[1].d, info.z[1].n]], fv(info.k));
    var ra = Math.round(Math.sqrt(A));
    if (ra * ra === A) {
      if (B && B % (2 * ra) === 0) add([[ra, B / (2 * ra)], [ra, B / (2 * ra)]], 1);
      var rc = Math.round(Math.sqrt(Math.abs(C))); if (rc * rc === Math.abs(C) && rc) add([[ra, -rc], [ra, rc]], 1);
    }
    if (C !== 0) divisors(A).forEach(function(p1){ divisors(C).forEach(function(n){ [n, -n].forEach(function(m1){ add([[p1, m1], [A / p1, C / m1]], 1); }); }); });
    if (A === 1) [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6].forEach(function(s){ if (B - s) add([[1, s], [1, B - s]], 1); });
    for (var t = 1; pool.length < 6 && t < 8; t++) { add([[1, t], [A, C]], 1); add([[1, -t], [A, -C]], 1); }
    var right = pool.filter(function(x){ return x.ok; }), wrong = pool.filter(function(x){ return !x.ok; });
    var pick = right.concat(wrong.slice(0, 4 - right.length));
    return MV.shuffle(pick, "rh" + tgt).concat([{ none:true }]);
  }
  function choiceSrc(x){
    if (x.none) return null;
    var f = x.L.map(function(l){ var s = linSrc(l[0], l[1]); return l[1] === 0 && l[0] === 1 ? s : "(" + s + ")"; });
    var body = f[0] === f[1] && f[0].charAt(0) === "(" ? f[0] + "^2" : f.join("");
    return (x.k === 1 ? "" : x.k === -1 ? "-" : String(x.k)) + body;
  }
  function paintQuad(){
    var q = quotient();
    if (view.hold || done() || q.length !== 3) { E.quad.innerHTML = ""; view.pick = false; return; }
    var h = '<button type="button" class="btn sm" data-rh="quad" data-k="rhquad" aria-expanded="' + view.pick + '"><span>Factor the quadratic</span></button>';
    if (view.pick) {
      h += '<div class="rh-pick"><p class="tiny"><strong>' + m(pStr(q)) + " =</strong></p><div class=\"opts\">" + quadChoices(q).map(function(x, i){
        return '<button type="button" class="opt" data-rh-q="' + i + '" data-k="rhq' + i + '"><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + (x.none ? "Doesn’t factor over the integers" : m(choiceSrc(x))) + "</span></button>";
      }).join("") + "</div>" + (view.pickMsg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + view.pickMsg) : "") + "</div>";
    }
    MV.keepFocus(E.quad, function(){ E.quad.innerHTML = h; });
  }
  function pickQuad(i){
    var q = quotient(), x = quadChoices(q)[i], info = quadInfo(q);
    if (!x) return;
    if (x.none) {
      if (info) { var mono = fv(q[0]) === 1; view.pickMsg = "It does factor over the integers. " + (mono ? "Look for two numbers with product " + num(fv(q[2])) + " and sum " + num(fv(q[1])) + "." : "Try the factor pairs of the first and last terms and check the middle term."); }
      else { S.quad = "no"; view.pick = false; view.pickMsg = null; }
    } else if (x.ok) {
      var from = S.found.length;
      info.z.forEach(function(z){ S.found.push({ n:z.n, d:z.d, via:"quad" }); });
      S.miss = []; S.quad = null; view.pick = false; view.pickMsg = null; dropDots(from);
    } else {
      var k = x.k, L2 = x.L, e = [k * L2[0][0] * L2[1][0], k * (L2[0][0] * L2[1][1] + L2[1][0] * L2[0][1]), k * L2[0][1] * L2[1][1]];
      view.pickMsg = "That expands to " + m(pStr(e)) + ", not " + m(pStr(q)) + ".";
    }
    changed();
    if (!view.pick) { var b = $('[data-rh="reset"]', host); if (b) b.focus({ preventScroll:true }); }
  }

  // ----- N13 synthetic division step-through -----
  function sdData(div){
    var c = div.c.map(function(p){ return F(p[0], p[1]); }), z = F(div.z[0], div.z[1]), r = synth(c, z), n = c.length - 1;
    return { c:c, z:z, r:r, n:n, of:div.of, count:n + 2 + (z.d > 1 ? 1 : 0) };
  }
  function paren(x){ return x.n < 0 ? "(" + fsrc(x) + ")" : fsrc(x); }
  function sdPaint(box, d, i){
    var n = d.n, z = d.z, cols = n + 1, h = '<div class="tbl-wrap"><table class="vt rh-sdt"><caption class="vh">Synthetic division by x minus ' + MV.plain(m(fsrc(z))) + "</caption><tbody>";
    var shown = function(j){ return i >= 1 && j <= i - 1; };
    h += '<tr><th scope="row" class="rh-z">' + m(fsrc(z)) + "</th>" + d.c.map(function(a, j){ return '<td' + (i >= 1 && j === i - 1 ? ' class="hl"' : "") + ">" + m(fsrc(a)) + "</td>"; }).join("") + "</tr>";
    h += '<tr><th scope="row"></th>' + d.c.map(function(a, j){ return '<td' + (i >= 1 && j === i - 1 ? ' class="hl"' : "") + ">" + (j >= 1 && shown(j) ? m(fsrc(d.r.mid[j])) : "") + "</td>"; }).join("") + "</tr>";
    h += '<tr class="rh-bot"><th scope="row"></th>' + d.c.map(function(a, j){ return '<td class="' + (j === n ? "rh-rem" : "") + (i >= 1 && j === i - 1 ? " hl" : "") + '">' + (shown(j) ? m(fsrc(d.r.bot[j])) : "") + "</td>"; }).join("") + "</tr></tbody></table></div>";
    var cap, of = d.of + "(x)";
    var xz = "x" + (z.n > 0 ? " - " : " + ") + fsrc(F(Math.abs(z.n), z.d));
    if (z.n === 0) xz = "x";
    if (i === 0) cap = "Divide by " + m(xz) + (z.d > 1 ? " (" + m(fsrc(z)) + " is the zero of " + m(facSrc(z)) + ")" : "") + ": write the coefficients of " + m(of) + " and the zero " + m(fsrc(z)) + ".";
    else if (i === 1) cap = "Bring down " + m(fsrc(d.c[0])) + ".";
    else if (i <= n + 1) {
      var j = i - 1, t = d.r.mid[j];
      cap = "Multiply: " + m(fsrc(d.r.bot[j - 1]) + " × " + paren(z) + " = " + fsrc(t)) + ". Add: " + m(fsrc(d.c[j]) + " + " + paren(t) + " = " + fsrc(d.r.bot[j])) + ".";
      if (j === n) cap += " The remainder is 0, so " + m("(" + facSrc(z) + ")") + " is a factor. " + (z.d > 1 ? "Bottom row: " + m(pStr(d.r.q)) + "." : "Quotient: " + m(pStr(d.r.q)) + ".");
    } else {
      var qq = d.r.q.map(function(v){ return fdiv(v, F(z.d)); });
      if (qq.length === 1) cap = m(fsrc(d.r.q[0]) + "(" + xz + ") = " + constSrc(qq[0]) + (constSrc(qq[0]) ? "(" + facSrc(z) + ")" : facSrc(z))) + ": divide the bottom row by " + z.d + ". The factor is " + m("(" + facSrc(z) + ")") + " and the quotient is " + m(fsrc(qq[0])) + ".";
      else cap = m("(" + xz + ")(" + pStr(d.r.q) + ") = (" + facSrc(z) + ")(" + pStr(qq) + ")") + ": divide the bottom row by " + z.d + " to get the quotient for " + m("(" + facSrc(z) + ")") + ".";
    }
    $(".rh-sd-tbl", box).innerHTML = h; $(".rh-sd-cap", box).innerHTML = cap;
  }
  function newDivision(animate){
    clearTimeout(view.autoT); E.sd.innerHTML = "";
    if (!S.div) return;
    var box = document.createElement("div"); box.className = "rh-sd-box"; E.sd.appendChild(box);
    box.innerHTML = '<h4>Synthetic division</h4><div class="rh-sd-tbl"></div><p class="rh-sd-cap" aria-live="polite"></p><div class="rh-sd-pl"></div>';
    var d = sdData(S.div), user = false;
    var pl = MV.player($(".rh-sd-pl", box), { count:d.count, interval:900, render:function(i){ sdPaint(box, d, i); }, label:function(i){ return "Step " + (i + 1) + " of " + d.count; } });
    $(".rh-sd-pl", box).addEventListener("click", function(){ user = true; clearTimeout(view.autoT); });
    if (!animate || MV.reduceMotion) { pl.go(d.count - 1); return; }
    (function next(){ view.autoT = MV.wait(650, function(){ if (user || !box.isConnected) return; pl.go(pl.get() + 1); if (pl.get() < d.count - 1) next(); }); })();
  }

  // ----- tests -----
  function test(z, demo){
    if (done() || view.hold) return null;
    var q = quotient(), v = pEval(q, z), hit = v.n === 0, of = ofName();
    view.ghost = null; S.tests++; if (demo) S.demo = true;
    S.last = { z:[z.n, z.d], v:[v.n, v.d], hit:hit, of:of, sub:subst(q, z) };
    if (hit) {
      view.hold = { q:q, mode:S.mode, miss:S.miss.slice(), hit:z, of:of };
      S.div = { c:q.map(function(x){ return [x.n, x.d]; }), z:[z.n, z.d], of:of };
      S.found.push({ n:z.n, d:z.d, via:"test" }); S.miss = []; S.quad = null; view.pick = false; view.pickMsg = null;
      dropDots(S.found.length - 1);
      clearTimeout(view.holdT); view.holdT = MV.wait(1100, function(){ view.hold = null; paint(); });
      newDivision(true);
    } else S.miss.push({ n:z.n, d:z.d, v:[v.n, v.d] });
    changed();
    return hit;
  }
  function lastHTML(){
    var l = S.last; if (!l) return "none yet";
    var z = F(l.z[0], l.z[1]), v = F(l.v[0], l.v[1]);
    return l.hit ? m(l.of + "(" + fsrc(z) + ") = " + l.sub + " = 0") + " ✓ factor " + m("(" + facSrc(z) + ")") : m(l.of + "(" + fsrc(z) + ") = " + fsrc(v)) + ": not a factor";
  }
  function paint(){
    var c = base(), q = quotient(), fin = done(), zs = zeros();
    paintChips();
    L.cap.innerHTML = m("P(x) = " + pStr(c));
    paintBoard(); paintQuad();
    E.count.textContent = "Tests used: " + S.tests + ".";
    var tray = zs.map(function(z){ return '<span class="rh-fac">' + m(z.n === 0 && z.d === 1 ? "x" : "(" + facSrc(z) + ")") + "</span>"; }).join("");
    if (fin && q.length === 3) tray += '<span class="rh-fac">' + m("(" + pStr(q) + ")") + "</span>";
    else if (!fin && zs.length) tray += '<span class="rh-rest" title="Still to factor">' + m("(" + pStr(q) + ")") + "</span>";
    if (fin && q.length === 1 && constSrc(q[0])) tray = '<span class="rh-fac">' + m(fsrc(q[0])) + "</span>" + tray;
    E.tray.innerHTML = '<span class="rh-tray-l">Factor tray:</span>' + (tray || '<span class="muted tiny">empty. Tap a candidate to test it.</span>') + (fin ? '<span class="rh-done">✓ Fully factored</span>' : "");
    var cl = candList(q, S.mode);
    L.read.innerHTML = MV.readoutHTML([
      ["Polynomial", m(pStr(c))],
      ["Candidates", fin ? "none left to test" : m(candText(cl))],
      ["Last test", lastHTML()],
      ["Factors found", zs.length ? m(facsSrc(zs)) : "none yet"],
      ["Still to factor", fin ? (q.length === 3 ? m(pStr(q)) + " doesn’t factor over the integers" : "nothing") : m((zs.length ? "Q(x) = " : "P(x) = ") + pStr(q))],
      ["Fully factored", fin ? m(fullSrc()) : "not yet"]
    ]);
    plot.render();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.rhPid) { if (S.pid !== b.dataset.rhPid) { S.pid = b.dataset.rhPid; resetHunt(); paintExtra(); changed(); } return; }
    if (b.dataset.rhC) { var p = b.dataset.rhC.split("/"); test(F(+p[0], +p[1])); return; }
    if (b.dataset.rhQ != null) { pickQuad(+b.dataset.rhQ); return; }
    if (b.dataset.rhDeg) { var d = +b.dataset.rhDeg; if (S.own.deg !== d) { S.own = { deg:d, c:d === 4 ? [1, 0, -5, 0, 4] : [1, 0, -7, 6], raw:null }; resetHunt(); paintExtra(); changed(); } return; }
    if (b.dataset.rh === "reset") { resetHunt(); changed(); return; }
    if (b.dataset.rh === "quad") { view.pick = !view.pick; view.pickMsg = null; paintQuad(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (t.dataset.rhOc == null) return;
    var ow = S.own, raw = ow.raw || ow.c.map(String); raw[+t.dataset.rhOc] = t.value; ow.raw = raw;
    var vals = raw.map(function(s){ var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : NaN; });
    var ok = vals.every(function(v, i){ return Number.isInteger(v) && (i === 0 ? v >= 1 && v <= 4 : v >= -12 && v <= 12); });
    var msg = $(".rh-own-msg", host);
    if (ok) { ow.c = vals; resetHunt(); msg.textContent = "Leading coefficient 1 to 4; the others are whole numbers from −12 to 12."; msg.classList.remove("bad"); changed(); }
    else { msg.textContent = "Not loaded yet: the leading coefficient must be 1 to 4, and the others whole numbers from −12 to 12."; msg.classList.add("bad"); if (o.onChange) o.onChange(); }
  });
  paintExtra(); paint();
  if (S.div) newDivision(false);
  return {
    S:S, base:base, quotient:quotient, zeros:zeros, done:done, test:test,
    setMode:function(id){ S.mode = id; seg.set(id); changed(); },
    ghost:function(g){ view.ghost = g ? { z:F(g.n), note:g.note } : null; paintBoard(); },
    load:function(st){
      S.pid = st.pid; S.mode = st.mode || "int"; resetHunt(); seg.set(S.mode); paintExtra();
      (st.hits || []).forEach(function(h){ var q = quotient(), z = F(h[0], h[1]); S.tests++; S.last = { z:[z.n, z.d], v:[0, 1], hit:true, of:ofName(), sub:subst(q, z) }; S.div = { c:q.map(function(x){ return [x.n, x.d]; }), z:[z.n, z.d], of:ofName() }; S.found.push({ n:z.n, d:z.d, via:"test" }); });
      if ((st.hits || []).length) S.demo = true;
      newDivision(false); changed();
    }
  };
}

// ---------- hero: P(x) = x³ − 2x² − 5x + 6 draws, candidate tiles drop in, hits land on the intercepts ----------
function hero(f){
  if (!f.canvas) return;
  var P = function(x){ return x * x * x - 2 * x * x - 5 * x + 6; }, V = { xmin:-3.5, xmax:4.5, ymin:-8, ymax:12 };
  var plot = new MV.Plot(f.canvas, V), st = { draw:0, dots:[], drop:null }, el = $("#hero-tiles"), hits = [1, -2, 3];
  var facs = ["(x - 1)", "(x + 2)", "(x - 3)"];
  el.innerHTML = [1, -1, 2, -2, 3, -3, 6, -6].map(function(v){ return '<span class="ht" data-v="' + v + '">' + num(v) + "</span>"; }).join("");
  var tiles = $$(".ht", el);
  function cap(n){ f.cap.innerHTML = m("x^3 - 2x^2 - 5x + 6") + (n ? " " + m("= " + facs.slice(0, n).join("")) : ""); }
  plot.render = function(){
    var pts = st.dots.map(function(x){ return { x:x, y:0, r:6.5, color:css("--ink") }; });
    if (st.drop) pts.push({ x:st.drop.x, y:st.drop.y, r:6.5, color:css("--ink") });
    plot.draw({ view:V, curves:st.draw > 0 ? [{ f:P, color:css("--pen"), width:3.2, arrows:st.draw >= 1, domain:[V.xmin, V.xmin + (V.xmax - V.xmin) * st.draw] }] : [], points:pts,
      describe:"Graph of P(x) = x³ − 2x² − 5x + 6 crossing the x-axis at −2, 1 and 3. Candidate tiles ±1, ±2, ±3, ±6; the hits 1, −2 and 3 give (x − 1)(x + 2)(x − 3)." });
  };
  if (MV.reduceMotion) { st.draw = 1; st.dots = hits.slice(); tiles.forEach(function(t){ t.classList.add("in"); if (hits.indexOf(+t.dataset.v) >= 0) t.classList.add("hit"); }); cap(3); plot.render(); return; }
  cap(0); plot.render();
  MV.tween({ dur:1300, ease:function(t){ return t; }, step:function(t){ st.draw = t; plot.render(); }, done:function(){
    tiles.forEach(function(t, i){ setTimeout(function(){ t.classList.add("in"); }, 110 * i); });
    var k = 0;
    function next(){
      if (k >= hits.length) return;
      var x = hits[k], tile = el.querySelector('[data-v="' + x + '"]'); if (tile) tile.classList.add("hit");
      MV.tween({ dur:650, step:function(t){ st.drop = { x:x, y:V.ymax * (1 - t) }; plot.render(); }, done:function(){ st.drop = null; st.dots.push(x); k++; cap(k); plot.render(); setTimeout(next, 750); } });
    }
    setTimeout(next, 110 * tiles.length + 600);
  } });
}

// ---------- Explore: root hunter, prediction scripts, challenge tests ----------
var POLYS = [
  { id:"p1", chip:"`P_1`", coeffs:[1, -2, -5, 6] },
  { id:"p2", chip:"`P_2`", coeffs:[1, 0, -5, 0, 4] },
  { id:"p3", chip:"`P_3`", coeffs:[2, -3, -3, 2] },
  { id:"p4", chip:"`P_4`", coeffs:[1, -3, -2, 6] },
  { id:"tc2", chip:"Challenge 2", coeffs:[1, "k", -4, 12], k:{ min:-6, max:6 } },
  { id:"tc3", chip:"Challenge 3", coeffs:[1, 2, -7, -8, 12] },
  { id:"own", chip:"Build your own", own:true }
];
var RUNS = {
  p1:function(H, p, done){ seq([[400, function(){ H.ghost(p.ghost); }], [1200, done]]); },
  p2:function(H, p, done){ seq([[300, function(){ H.test(F(-2), true); }], [1800, function(){ H.test(F(3), true); }], [1500, done]]); },
  p3:function(H, p, done){ seq([[300, function(){ H.test(F(2), true); }], [1800, function(){ H.test(F(-1), true); }], [1800, function(){ H.setMode("rat"); }], [1000, function(){ H.test(F(1, 2), true); }], [1600, done]]); },
  p4:function(H, p, done){ seq([[300, function(){ H.test(F(3), true); }], [1800, function(){ H.test(F(1), true); }], [550, function(){ H.test(F(-1), true); }], [550, function(){ H.test(F(2), true); }], [550, function(){ H.test(F(-2), true); }], [1000, done]]); }
};
function chalTest(H, id, C){
  var c = C.challenges.filter(function(x){ return x.id === id; })[0], M = c.msgs, S = H.S, zs = H.zeros().map(fv).sort(function(a, b){ return a - b; }), q = H.quotient(), fin = H.done();
  function has(w){ w = w.slice().sort(function(a, b){ return a - b; }); return zs.length === w.length && zs.every(function(v, i){ return Math.abs(v - w[i]) < 1e-9; }) && q.length === 1 && feq(q[0], F(1)); }
  function ok(){ return S.demo ? { ok:false, msg:C.demo } : { ok:true }; }
  if (id === "tc1") {
    if (S.pid !== "p1") return { ok:false, msg:M.pick };
    if (fin && has([1, -2, 3])) return ok();
    if (zs.length && q.length === 3) return { ok:false, msg:M.m4 };
    return { ok:false, msg:M.more };
  }
  if (id === "tc2") {
    if (S.pid !== "tc2") return { ok:false, msg:M.pick };
    if (S.k !== -3) return { ok:false, msg:M.k };
    if (fin && has([2, -2, 3])) return ok();
    if (zs.length && q.length === 3) return { ok:false, msg:M.m4 };
    return { ok:false, msg:M.more };
  }
  if (id === "tc3") {
    if (!(S.pid === "tc3" || (S.pid === "own" && H.base().join(",") === "1,2,-7,-8,12"))) return { ok:false, msg:M.pick };
    if (fin && has([1, 2, -2, -3])) return S.tests > 5 ? { ok:false, msg:M.tests.replace("{n}", S.tests) } : ok();
    return { ok:false, msg:M.more };
  }
  return { ok:false };
}

// @component cubeVolumeModel — a³ − b³ volume model: oblique-projection boxes on a Plot canvas, N13 step-through (cut, split, slide apart), sliders for a and b
function volumeModel(api, C){
  var S = api.S; S.vm = S.vm || { a:5, b:2, step:0 };
  var V = S.vm, an = { lift:1, edge:0, gap:0 }, cancel = null;
  var KX = Math.cos(Math.PI / 6) * 0.55, KY = Math.sin(Math.PI / 6) * 0.55;
  function P(x, y, z){ return [x + z * KX, y + z * KY]; }
  function boxes(gap){ var a = V.a, b = V.b, g = gap * Math.max(1, a * 0.3);
    return [{ x:-g, y:0, z:0, w:a - b, h:a, d:a, n:"1" }, { x:a - b, y:0, z:0, w:b, h:a - b, d:a, n:"2" }, { x:a - b, y:a - b + g, z:b, w:b, h:b, d:a - b, n:"3" }]; }
  function small(lift){ var a = V.a, b = V.b; return { x:a - b + lift * (b * 0.55 + 0.7), y:a - b + lift * (b * 0.8 + 0.9), z:0, w:b, h:b, d:b }; }
  function corners(B){ var o = []; [0, 1].forEach(function(i){ [0, 1].forEach(function(j){ [0, 1].forEach(function(k){ o.push(P(B.x + i * B.w, B.y + j * B.h, B.z + k * B.d)); }); }); }); return o; }
  function viewBox(){
    var pts = [];
    boxes(1).concat(boxes(0), [small(1)]).forEach(function(B){ pts = pts.concat(corners(B)); });
    var xs = pts.map(function(p){ return p[0]; }), ys = pts.map(function(p){ return p[1]; }), pad = V.a * 0.16;
    return { xmin:Math.min.apply(null, xs) - pad, xmax:Math.max.apply(null, xs) + pad, ymin:Math.min.apply(null, ys) - pad, ymax:Math.max.apply(null, ys) + pad };
  }
  function face(ctx, p, pts, fills, stroke){
    ctx.beginPath(); pts.forEach(function(q, i){ var s = P(q[0], q[1], q[2]); if (i) ctx.lineTo(p.X(s[0]), p.Y(s[1])); else ctx.moveTo(p.X(s[0]), p.Y(s[1])); }); ctx.closePath();
    fills.forEach(function(f){ ctx.fillStyle = f; ctx.fill(); });
    if (stroke) { ctx.strokeStyle = stroke.c; ctx.globalAlpha = stroke.a; ctx.lineWidth = stroke.w; ctx.setLineDash(stroke.dash || []); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
  }
  function drawBox(ctx, p, B, stroke, fills){
    var x0 = B.x, x1 = B.x + B.w, y0 = B.y, y1 = B.y + B.h, z0 = B.z, z1 = B.z + B.d;
    if (fills !== false) {
      face(ctx, p, [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], [css("--rule")], stroke);
      face(ctx, p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [css("--sheet"), css("--hi-soft")], stroke);
      face(ctx, p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [css("--sheet")], stroke);
    } else {
      [[[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]]].forEach(function(f){ face(ctx, p, f, [], stroke); });
    }
  }
  function tag(ctx, p, x, y, z, t, italic){
    var s = P(x, y, z); ctx.font = (italic ? "italic 600 16px " : "700 14px ") + (italic ? p.fontM : p.fontUI); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (!italic) { ctx.beginPath(); ctx.arc(p.X(s[0]), p.Y(s[1]), 11, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.fillStyle = css("--ink"); ctx.fillText(t, p.X(s[0]), p.Y(s[1]));
  }
  var plot;
  function desc(){
    var a = V.a, b = V.b;
    return ["A cube of side " + a + " with a cube of side " + b + " lifted out of one corner.", "The remaining solid cut into three boxes: " + a + " by " + a + " by " + (a - b) + ", " + a + " by " + b + " by " + (a - b) + ", and " + b + " by " + b + " by " + (a - b) + ".", "The three boxes pulled apart; each has one edge " + (a - b) + "."][V.step];
  }
  function draw(){
    var ink = css("--ink"), ink2 = css("--ink-2");
    plot.draw({ view:viewBox(), grid:false, axes:false, equal:true, describe:desc(), after:function(ctx, p){
      var st = { c:an.edge > 0.5 ? ink : ink2, a:0.45 + 0.55 * an.edge, w:1.2 + 0.6 * an.edge };
      var bx = boxes(an.gap);
      bx.forEach(function(B){ drawBox(ctx, p, B, st); });
      if (V.step === 0) {
        var s0 = small(0), s1 = small(an.lift);
        if (an.lift > 0.02) drawBox(ctx, p, s0, { c:ink2, a:0.9, w:1.3, dash:[5, 4] }, false);
        drawBox(ctx, p, s1, { c:ink, a:1, w:1.8 });
        tag(ctx, p, V.a / 2, -V.a * 0.07, 0, "a", true); tag(ctx, p, -V.a * 0.07, V.a / 2, 0, "a", true);
        tag(ctx, p, V.a + V.a * 0.02, -V.a * 0.02, V.a / 2 + V.a * 0.08, "a", true);
        tag(ctx, p, s1.x + V.b / 2, s1.y - V.a * 0.07, 0, "b", true);
      } else bx.forEach(function(B){ tag(ctx, p, B.x + B.w / 2, B.y + B.h / 2, B.z, B.n, false); });
    } });
  }
  function nums(){
    var a = V.a, b = V.b, d = a - b, A = a * a * d, B = a * b * d, Cc = b * b * d, n = MV.num;
    var top = "<p><strong>" + m("a = " + a) + ", " + m("b = " + b) + ":</strong> " + n(a * a * a) + " − " + n(b * b * b) + " = " + n(a * a * a - b * b * b) + " = " + n(d) + " × " + n(a * a + a * b + b * b) + "</p>";
    var rows = [
      ["Big cube: " + m("a^3") + " = " + n(a) + "³ = " + n(a * a * a) + ". Corner cube: " + m("b^3") + " = " + n(b) + "³ = " + n(b * b * b) + ". What’s left: " + n(a * a * a) + " − " + n(b * b * b) + " = " + n(a * a * a - b * b * b) + "."],
      ["Box 1: " + m("a × a × (a - b)") + " = " + n(a) + " × " + n(a) + " × " + n(d) + " = " + n(A) + ".", "Box 2: " + m("a × b × (a - b)") + " = " + n(a) + " × " + n(b) + " × " + n(d) + " = " + n(B) + ".", "Box 3: " + m("b × b × (a - b)") + " = " + n(b) + " × " + n(b) + " × " + n(d) + " = " + n(Cc) + "."],
      [n(A) + " + " + n(B) + " + " + n(Cc) + " = " + n(A + B + Cc) + ".", m("(a - b)(a^2 + ab + b^2)") + " = " + n(d) + " × (" + n(a * a) + " + " + n(a * b) + " + " + n(b * b) + ") = " + n(d) + " × " + n(a * a + a * b + b * b) + " = " + n(A + B + Cc) + "."]
    ][V.step];
    $("#vm-num").innerHTML = top + rows.map(function(r){ return "<p>" + r + "</p>"; }).join("");
    $("#vm-cap").innerHTML = "<strong>Step " + (V.step + 1) + ".</strong> " + C.steps[V.step];
  }
  function go(i, anim){
    var from = V.step; V.step = i; api.save(); if (cancel) cancel();
    var end = [{ lift:1, edge:0, gap:0 }, { lift:1, edge:1, gap:0 }, { lift:1, edge:1, gap:1 }][i];
    if (!anim || (i < from && i > 0)) { an = { lift:end.lift, edge:end.edge, gap:end.gap }; draw(); nums(); return; }
    var startS = i === 0 ? { lift:0, edge:0, gap:0 } : i === 1 ? { lift:1, edge:0, gap:0 } : { lift:1, edge:1, gap:0 };
    nums();
    cancel = MV.tween({ dur:i === 0 ? 1100 : 900, step:function(t){ an = { lift:startS.lift + (end.lift - startS.lift) * t, edge:startS.edge + (end.edge - startS.edge) * t, gap:startS.gap + (end.gap - startS.gap) * t }; draw(); } });
  }
  plot = new MV.Plot($("#vm-plot"), { xmin:0, xmax:10, ymin:0, ymax:8 }, { equal:true }); plot.render = draw;
  var sl = MV.sliders($("#vm-sl"), [
    { id:"vma", label:m("a"), min:2, max:6, step:1, value:V.a },
    { id:"vmb", label:m("b"), min:1, max:5, step:1, value:V.b, note:m("b") + " runs from 1 to " + m("a - 1") + "." }], function(id, v){
      if (id === "vma") { V.a = v; if (V.b > v - 1) { V.b = v - 1; sl.set("vmb", V.b); } }
      else { if (v > V.a - 1) { v = V.a - 1; sl.set("vmb", v); } V.b = v; }
      var e = document.getElementById("sl-vmb"); if (e) e.max = V.a - 1;
      api.save(); draw(); nums();
    });
  var eb = document.getElementById("sl-vmb"); if (eb) eb.max = V.a - 1;
  var ready = false, pl = MV.player($("#vm-pl"), { count:3, interval:1600, label:function(i){ return "Step " + (i + 1) + " of 3"; }, render:function(i){ if (ready) go(i, true); } });
  an = [{ lift:1, edge:0, gap:0 }, { lift:1, edge:1, gap:0 }, { lift:1, edge:1, gap:1 }][V.step];
  if (V.step) pl.go(V.step);
  ready = true; draw(); nums();
  vmIntro = function(){ if (V.step === 0 && !vmIntro.done) { vmIntro.done = true; go(0, true); } };
}
var vmIntro = function(){};

// @component groupingTiles — four term tiles: pair them, take out each pair's GCF, shared bracket glows, merge (or "brackets don't match")
function monoSrc(c, e){ var a = Math.abs(c); return (a === 1 && e > 0 ? "" : String(a)) + (e > 0 ? "x" + (e > 1 ? "^" + e : "") : ""); }
function termsSrc(ts){ return ts.map(function(t, i){ return i === 0 ? (t[0] < 0 ? "-" : "") + monoSrc(t[0], t[1]) : (t[0] < 0 ? " - " : " + ") + monoSrc(t[0], t[1]); }).join(""); }
function gcfPair(ts){
  var s = ts.slice().sort(function(p, q){ return q[1] - p[1]; }), g = gcd(s[0][0], s[1][0]); if (s[0][0] < 0) g = -g;
  var e = Math.min(s[0][1], s[1][1]);
  return { g:[g, e], br:s.map(function(t){ return [t[0] / g, t[1] - e]; }) };
}
function groupingTiles(host, api, G){
  var S = api.S; S.gt = S.gt || { ex:0, pick:[], step:0 };
  var T = S.gt;
  function ex(){ return G.examples[T.ex]; }
  function groups(){ var ts = ex().terms, A = T.pick.slice().sort(), B = [0, 1, 2, 3].filter(function(i){ return A.indexOf(i) < 0; }); var gA = A.map(function(i){ return ts[i]; }), gB = B.map(function(i){ return ts[i]; }); return A[0] === 0 ? [gA, gB] : [gB, gA]; }
  function gSrc(g, first){ var c = g[0], e = g[1], body = (Math.abs(c) === 1 && e === 0) ? "" : monoSrc(c, e); return first ? (c < 0 ? "-" : "") + body : (c < 0 ? " - " : " + ") + body; }
  function paint(){
    var e = ex(), ts = e.terms, h = '<div class="chips" role="group" aria-label="Choose a polynomial">' + G.examples.map(function(x, i){ return '<button type="button" class="fchip" data-gt-ex="' + i + '" data-k="gtx' + i + '" aria-pressed="' + (T.ex === i) + '">' + x.label + "</button>"; }).join("") + "</div>";
    if (T.step === 0) {
      h += '<div class="gt-tiles" role="group" aria-label="Term tiles">' + ts.map(function(t, i){ var on = T.pick.indexOf(i) >= 0; return '<button type="button" class="tile gt-tile' + (on ? " on" : "") + '" data-gt-t="' + i + '" data-k="gtt' + i + '" aria-pressed="' + on + '">' + m((i && t[0] > 0 ? "+ " : t[0] < 0 && i ? "- " : t[0] < 0 ? "-" : "") + monoSrc(t[0], t[1])) + "</button>"; }).join("") + "</div>";
      h += '<p class="tiny muted">' + (T.pick.length ? "First pair: 1 tile chosen. Tap one more." : "Nothing paired yet.") + "</p>";
    } else {
      var gs = groups(), f1 = gcfPair(gs[0]), f2 = gcfPair(gs[1]), match = f1.br.join() === f2.br.join();
      h += '<p class="gt-line">' + m("(" + termsSrc(gs[0]) + ") + (" + termsSrc(gs[1]) + ")") + "</p>";
      if (T.step >= 2) {
        var br = function(f){ return '<span class="gt-br' + (match ? " glow" : "") + '">' + m("(" + termsSrc(f.br) + ")") + "</span>"; };
        h += '<p class="gt-line">' + m("= " + gSrc(f1.g, true)) + br(f1) + m(gSrc(f2.g, false)) + br(f2) + "</p>";
        if (!match) h += MV.fbHTML("bad", e.miss);
        else h += '<p class="tiny">' + G.glow + "</p>";
      }
      if (T.step >= 3 && match) {
        var sum = [f1.g, f2.g].sort(function(p, q){ return q[1] - p[1]; });
        h += '<p class="gt-line gt-merge">' + m("= (" + termsSrc(f1.br) + ")(" + termsSrc(sum) + ") =") + " " + e.full + "</p>" + MV.fbHTML("good", "<strong>✓ Grouping works.</strong> " + (e.win || ""));
      }
      h += '<div class="q-actions">';
      if (T.step === 1) h += '<button type="button" class="btn primary sm" data-gt="take" data-k="gttake"><span>' + G.take + "</span></button>";
      if (T.step === 2 && match) h += '<button type="button" class="btn primary sm" data-gt="merge" data-k="gtmerge"><span>' + G.merge + "</span></button>";
      h += '<button type="button" class="btn ghost sm" data-gt="again" data-k="gtagain"><span>' + G.again + "</span></button></div>";
    }
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.gtEx != null) { T.ex = +b.dataset.gtEx; T.pick = []; T.step = 0; }
    else if (b.dataset.gtT != null) { var i = +b.dataset.gtT, k = T.pick.indexOf(i); if (k >= 0) T.pick.splice(k, 1); else T.pick.push(i); if (T.pick.length === 2) T.step = 1; }
    else if (b.dataset.gt === "take") T.step = 2;
    else if (b.dataset.gt === "merge") T.step = 3;
    else if (b.dataset.gt === "again") { T.pick = []; T.step = 0; }
    else return;
    api.save(); paint();
    var f = host.querySelector(T.step === 0 ? "[data-gt-t]" : "[data-gt]"); if (f && !host.contains(document.activeElement)) f.focus({ preventScroll:true });
  });
  paint();
}
function part3(host, api){
  var C = api.content, M = C.model;
  host.innerHTML = '<h3>' + M.title + '</h3><p class="how">' + M.how + '</p><div class="sym vm"><div><div class="plot-wrap"><canvas class="plot" id="vm-plot" role="img" aria-label="Volume model"></canvas></div><p class="vm-cap" id="vm-cap" aria-live="polite"></p><div id="vm-pl"></div></div>' +
    '<div><div id="vm-sl"></div><div class="vm-num" id="vm-num" aria-live="polite"></div><details class="alg">' + M.alg + '</details><p class="vm-hook">' + M.hook + "</p></div></div>" +
    '<div class="part"><h3>' + C.grouping.title + '</h3><p class="how">' + C.grouping.how + '</p><div id="gt-app"></div></div>';
  volumeModel(api, M);
  groupingTiles($("#gt-app"), api, C.grouping);
}

// @component N4 factorTray — "Fully factor" builder: up to four px + q factors with steppers and an optional quadratic; Check expands and compares, named wrong-answer specs
function factorBuilder(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { lin:[], quad:null, k:"", tries:0, hint:0, solved:false, first:null }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function quadVals(x){ if (!x.quad) return null; var v = x.quad.map(function(s){ var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : NaN; }); return v.every(Number.isInteger) && v[0] !== 0 ? v : false; }
  function product(x, qv){ var p = [F(1)]; x.lin.forEach(function(l){ p = pMul(p, [F(l[0]), F(l[1])]); }); if (qv) p = pMul(p, toF(qv)); return p; }
  function prodSrc(x, qv){
    var s = x.lin.map(function(l){ return "(" + linSrc(l[0], l[1]) + ")"; }).join("");
    if (x.quad) s += "(" + (qv ? pStr(qv) : "?") + ")";
    return s || "";
  }
  function stepper(it, i, w, v, lab){
    return '<span class="fx-st" role="group" aria-label="' + lab + '"><button type="button" class="btn ghost sm" data-fx="dec" data-w="' + w + '" data-i="' + i + '" data-k="fx' + it.id + w + i + 'd" aria-label="Decrease ' + lab + '">−</button><output>' + num(v) + '</output><button type="button" class="btn ghost sm" data-fx="inc" data-w="' + w + '" data-i="' + i + '" data-k="fx' + it.id + w + i + 'i" aria-label="Increase ' + lab + '">+</button></span>';
  }
  function trayHTML(it, x){
    var h = '<div class="fx-tray">';
    x.lin.forEach(function(l, i){
      h += '<div class="fx-row"><span class="fx-f">' + m("(" + linSrc(l[0], l[1]) + ")") + "</span>" + '<span class="fx-pq"><span class="fx-lab tiny">' + m("p") + "</span>" + stepper(it, i, "p", l[0], "x-coefficient of factor " + (i + 1)) + "</span>" +
        '<span class="fx-pq"><span class="fx-lab tiny">' + m("q") + "</span>" + stepper(it, i, "q", l[1], "constant of factor " + (i + 1)) + "</span>" + '<button type="button" class="btn ghost sm" data-fx="rm" data-i="' + i + '" data-k="fx' + it.id + "rm" + i + '">Remove</button></div>';
    });
    if (x.quad) {
      h += '<div class="fx-row fx-quad"><span class="fx-f">' + m("(" + "ax^2 + bx + c" + ")") + "</span>" + ["a", "b", "c"].map(function(nm, j){ return '<label class="fx-qin"><span class="m"><i>' + nm + '</i> =</span><input type="number" step="1" data-fq="' + j + '" aria-label="Quadratic coefficient ' + nm + '" value="' + MV.esc(x.quad[j]) + '"></label>'; }).join("") +
        '<button type="button" class="btn ghost sm" data-fx="rmq" data-k="fx' + it.id + 'rmq">Remove</button></div>';
    }
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-fx="addl" data-k="fx' + it.id + 'addl"' + (x.lin.length >= 4 ? " disabled" : "") + "><span>Add a linear factor</span></button>" +
      '<button type="button" class="btn ghost sm" data-fx="addq" data-k="fx' + it.id + 'addq"' + (x.quad ? " disabled" : "") + "><span>Add a quadratic factor</span></button></div>";
    var qv = quadVals(x), ps = prodSrc(x, qv);
    h += '<p class="fx-prev">Your factorization: ' + (ps ? m(ps) : '<span class="muted">no factors yet</span>') + "</p></div>";
    return h;
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it, i){
        var x = ist(it.id), h = '<div class="q" data-fi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + (it.kAt != null ? "" : "Fully factor ") + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
        if (x.solved) return h + '<div class="fb good" role="status"><p><strong>✓ Correct: ' + MV.md(MV.ans(it).f) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div></div>";
        if (it.kAt != null) h += '<div class="numrow"><label for="fxk-' + it.id + '">' + m("k =") + '</label><input class="numin short" id="fxk-' + it.id + '" type="number" step="1" data-fk="' + it.id + '" value="' + MV.esc(x.k) + '"></div>';
        h += trayHTML(it, x);
        h += '<div class="q-actions"><button type="button" class="btn primary sm" data-fx="check" data-k="fx' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn("fxh" + it.id, x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
        if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  function judge(it, x){
    var target = it.poly.slice();
    if (it.kAt != null) {
      var kr = MV.parseNum(x.k), k = kr && kr.length === 1 ? kr[0] : NaN;
      if (!Number.isInteger(k)) return { soft:"Enter " + m("k") + " first." };
      if (k !== MV.ans(it).k) { var kw = (it.kWrong || []).filter(function(w){ return w.k === k; })[0]; return { fb:kw ? kw.fb : it.kGeneral }; }
      target[it.kAt] = k;
    }
    var qv = quadVals(x);
    if (qv === false) return { soft:"Fill in all three coefficients of the quadratic factor (whole numbers, " + m("a ≠ 0") + ")." };
    if (!x.lin.length && !qv) return { soft:"Add at least one factor first." };
    var prod = product(x, qv), same = pSame(prod, target), qFactors = qv && quadInfo(toF(qv));
    if (same && !qFactors) return { ok:true };
    var zs = x.lin.map(function(l){ return -l[1] / l[0]; }).sort(function(p, q){ return p - q; });
    var named = (it.wrong || []).filter(function(w){
      if (w.lin != null) return x.lin.length === w.lin && !qv;
      if (w.zeros) { var wz = w.zeros.slice().sort(function(p, q){ return p - q; }); if (wz.length !== zs.length || !wz.every(function(v, i){ return Math.abs(v - zs[i]) < 1e-9; })) return false; if (!w.quad && qv) return false; }
      if (w.quad) return !!qv && w.quad.join() === qv.join();
      return true;
    })[0];
    if (named) return { fb:named.fb };
    if (same) return { fb:a.m4 + " " + m(pStr(qv)) + " factors further." };
    return { fb:"Your factors expand to " + m(pStr(prod)) + ", not " + m(pStr(target)) + "." + (it.general ? " " + it.general : "") };
  }
  host.addEventListener("input", function(e){
    var t = e.target, box = t.closest("[data-fi]"); if (!box) return;
    var x = ist(box.dataset.fi);
    if (t.dataset.fq != null) { x.quad[+t.dataset.fq] = t.value; var pv = box.querySelector(".fx-prev"); if (pv) { var qv = quadVals(x), ps = prodSrc(x, qv); pv.innerHTML = "Your factorization: " + (ps ? m(ps) : ""); } }
    else if (t.dataset.fk) x.k = t.value;
    else return;
    msgs[box.dataset.fi] = null; api.save();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-fi]"); if (!box) return;
    var it = item(box.dataset.fi), x = ist(it.id), act = b.dataset.fx;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (!act) return;
    if (act === "check") {
      var r = judge(it, x);
      if (r.soft) msgs[it.id] = r.soft;
      else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-fi="' + it.id + '"]')); return;
    }
    var i = +b.dataset.i;
    if (act === "addl" && x.lin.length < 4) x.lin.push([1, 1]);
    else if (act === "addq" && !x.quad) x.quad = ["1", "0", "1"];
    else if (act === "rm") x.lin.splice(i, 1);
    else if (act === "rmq") x.quad = null;
    else if (act === "inc" || act === "dec") {
      var l = x.lin[i], w = b.dataset.w === "p" ? 0 : 1, d = act === "inc" ? 1 : -1, lo = w ? -12 : 1, hi = w ? 12 : 6;
      l[w] = Math.max(lo, Math.min(hi, l[w] + d));
    }
    msgs[it.id] = null; api.save(); paint();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = S.items[it.id]; if (x && x.solved) d++; if (x && x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = S.items[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: hide a rational zero ----------
var task = (function(){
  var api, AS = [1, 2, 3, 4, 6];
  function st(){ var s = api ? api.S : {}; if (!s.z) { s.a = 1; s.z = [{ p:"1", q:1 }, { p:"2", q:1 }, { p:"3", q:1 }]; } return s; }
  function read(){
    var s = st(), zs = s.z.map(function(r){ var v = MV.parseNum(r.p); return { p:v && v.length === 1 ? v[0] : NaN, q:r.q }; });
    var valid = zs.every(function(z){ return Number.isInteger(z.p) && z.p >= -6 && z.p <= 6; });
    return { a:s.a, valid:valid, r:valid ? zs.map(function(z){ return F(z.p, z.q); }) : null };
  }
  function expand(d){ var c = [F(d.a)]; d.r.forEach(function(r){ c = pMul(c, [F(1), fneg(r)]); }); return c; }
  function sorted(r){ return r.slice().sort(function(x, y){ return fv(x) - fv(y); }); }
  function preview(){
    var d = read(), pv = $("#hz-pv"); if (!pv) return;
    if (!d.valid) { pv.innerHTML = '<p class="muted">Enter a whole number from −6 to 6 for each ' + m("p") + ".</p>"; return; }
    var c = expand(d), ints = c.every(function(v){ return v.d === 1; });
    var fac = (d.a === 1 ? "" : d.a) + d.r.map(function(r){ return r.n === 0 ? "x" : "(x" + (r.n > 0 ? " - " : " + ") + fsrc(F(Math.abs(r.n), r.d)) + ")"; }).join("");
    var h = '<p class="hz-eq">' + m("P(x) = " + fac) + "</p><p class=\"hz-eq\">" + m("= " + pStr(c, true)) + "</p>";
    if (!ints) h += '<p class="tiny muted">Not every coefficient is an integer, so the root hunter’s board can’t be built for this cubic.</p>';
    else if (c[3].n === 0) h += '<p class="tiny muted">The constant term is 0, so ' + m("x") + " is a factor. Hide a zero with a nonzero constant term.</p>";
    else {
      var isZ = function(z){ return d.r.some(function(r){ return feq(r, z); }); };
      ["int", "rat"].forEach(function(mode){
        var cl = candList(c, mode);
        h += '<p class="tiny" style="margin:12px 0 4px"><strong>' + (mode === "int" ? "Integral zeros board" : "Rational zeros board") + "</strong> (" + cl.length + " candidates)</p><div class=\"rh-board static\">" + cl.map(function(z){
          var hit = isZ(z);
          return '<span class="rh-tile' + (hit ? " hit" + (z.d > 1 ? " hid" : "") : "") + '"><span class="rh-c">' + m(fsrc(z, true)) + "</span>" + (hit ? '<span class="rh-v">zero ✓</span>' : "") + "</span>";
        }).join("") + "</div>";
      });
    }
    pv.innerHTML = h;
  }
  return {
    render:function(inp, pv, A){
      api = A; var s = st();
      inp.innerHTML = '<div id="hz-a"></div>' + s.z.map(function(z, i){ return '<div class="hz-row"><label for="hz-p' + i + '">' + m("r_" + (i + 1) + " =") + '</label><input id="hz-p' + i + '" class="numin short" type="number" step="1" min="-6" max="6" data-hz="' + i + '" value="' + MV.esc(z.p) + '" aria-label="Numerator p of zero ' + (i + 1) + '"><span class="hz-q"><span class="hz-sl" aria-hidden="true">/</span><span id="hz-q' + i + '"></span></span></div>'; }).join("");
      pv.innerHTML = '<div class="refresh" style="margin-top:0"><h4>Your cubic</h4><div id="hz-pv" aria-live="polite"></div></div>';
      MV.seg($("#hz-a"), { label:"Leading coefficient " + m("a") + ":", value:String(s.a), options:AS.map(function(v){ return { id:String(v), t:String(v) }; }), onChange:function(v){ s.a = +v; A.save(); preview(); A.update(); } });
      s.z.forEach(function(z, i){ MV.seg($("#hz-q" + i), { label:m("q") + ":", value:String(z.q), options:[1, 2, 3].map(function(v){ return { id:String(v), t:String(v) }; }), onChange:function(v){ s.z[i].q = +v; A.save(); preview(); A.update(); } }); });
      inp.addEventListener("input", function(e){ var i = e.target.dataset.hz; if (i == null) return; s.z[+i].p = e.target.value; A.save(); preview(); A.update(); });
      preview();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter a whole number from −6 to 6 for each " + m("p") + "."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var c = expand(d), vals = d.r.map(fv), distinct = vals[0] !== vals[1] && vals[0] !== vals[2] && vals[1] !== vals[2];
      return [d.a === 2, feq(c[3], F(-6)), c.every(function(v){ return v.d === 1; }), distinct && d.r.filter(function(r){ return r.d !== 1; }).length === 1];
    },
    key:function(d){ return d.a + "|" + sorted(d.r).map(function(r){ return r.n + "/" + r.d; }).join(","); },
    label:function(k){ var z = k.split("|")[1].split(",").map(function(t){ var p = t.split("/"); return fsrc(F(+p[0], +p[1])); }); return m("{" + z.join(", ") + "}"); },
    text:function(k){ var z = k.split("|")[1].split(",").map(function(t){ var p = t.split("/"); return MV.plain(m(fsrc(F(+p[0], +p[1])))); }); return "zeros {" + z.join(", ") + "}"; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){
    var C = api.content;
    var H = rootHunter(host, { S:api.S, polys:POLYS, onChange:function(){ api.save(); MV.changed(); } });
    return {
      predict:{ start:function(p){ H.load(p.start); }, run:function(p, done){ (RUNS[p.id] || function(H2, p2, d){ d(); })(H, p, done); } },
      challenge:function(id){ return chalTest(H, id, C); }
    };
  },
  part3:part3,
  activities:{ factor:factorBuilder },
  task:task,
  onShow:function(v){ if (v === "cubes") MV.wait(250, vmIntro); }
});
})();
