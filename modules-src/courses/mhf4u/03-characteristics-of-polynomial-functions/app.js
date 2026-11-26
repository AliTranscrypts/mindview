// MHF4U 03 Characteristics of Polynomial Functions: hero, polynomial shape lab (Explore), "Possible or impossible?"
// cards (Part 3), "Deduce it" set, "Design to spec" task and the Spot the Error graph.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS;

// @component polyExact — exact counts of distinct real zeros, touch points, turning points and level points of a polynomial
// (rational arithmetic with BigInt: square-free factors by Yun's algorithm, real roots counted with Sturm sequences).
var PX = (function(){
  var Z = BigInt(0), ONE = BigInt(1);
  function gcd(a, b){ if (a < Z) a = -a; if (b < Z) b = -b; while (b !== Z) { var t = a % b; a = b; b = t; } return a; }
  function Q(n, d){ if (d === undefined) d = ONE; if (d < Z) { n = -n; d = -d; } var g = gcd(n, d); if (g > ONE) { n = n / g; d = d / g; } return [n, d]; }
  var QZ = [Z, ONE];
  function add(a, b){ return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function sub(a, b){ return Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function mul(a, b){ return Q(a[0] * b[0], a[1] * b[1]); }
  function div(a, b){ return Q(a[0] * b[1], a[1] * b[0]); }
  function sgn(a){ return a[0] > Z ? 1 : a[0] < Z ? -1 : 0; }
  function isZ(a){ return a[0] === Z; }
  function fromNum(v){ return Q(BigInt(Math.round(v * 100)), BigInt(100)); }
  function toNum(a){ return Number(a[0]) / Number(a[1]); }
  // polynomials: arrays of rationals, constant term first
  function trim(p){ p = p.slice(); while (p.length && isZ(p[p.length - 1])) p.pop(); return p; }
  function deg(p){ return p.length - 1; }
  function deriv(p){ var out = []; for (var i = 1; i < p.length; i++) out.push(mul(p[i], Q(BigInt(i)))); return trim(out); }
  function psub(a, b){ var n = Math.max(a.length, b.length), out = []; for (var i = 0; i < n; i++) out.push(sub(a[i] || QZ, b[i] || QZ)); return trim(out); }
  function neg(p){ return p.map(function(c){ return [-c[0], c[1]]; }); }
  function divmod(a, b){
    a = trim(a); b = trim(b);
    var db = deg(b), lb = b[db], r = a.slice(), q = [];
    if (deg(a) < db) return [[], r];
    for (var k = deg(a) - db; k >= 0; k--) {
      var c = div(r[k + db], lb); q[k] = c;
      if (!isZ(c)) for (var j = 0; j <= db; j++) r[k + j] = sub(r[k + j], mul(c, b[j]));
    }
    return [trim(q), trim(r.slice(0, db))];
  }
  function monic(p){ var l = p[p.length - 1]; return p.map(function(c){ return div(c, l); }); }
  function pgcd(a, b){ a = trim(a); b = trim(b); while (b.length) { var r = divmod(a, b)[1]; a = b; b = r; } return a.length ? monic(a) : a; }
  function pdiv(a, b){ return divmod(a, b)[0]; }
  // number of distinct real roots (Sturm sequence read at −∞ and +∞)
  function nReal(p){
    p = trim(p); if (deg(p) < 1) return 0;
    var seq = [p, deriv(p)];
    for (;;) { var r = divmod(seq[seq.length - 2], seq[seq.length - 1])[1]; if (!r.length) break; seq.push(neg(r)); }
    function V(atNeg){ var v = 0, last = 0; seq.forEach(function(s){ var g = sgn(s[s.length - 1]) * (atNeg && deg(s) % 2 ? -1 : 1); if (g && last && g !== last) v++; if (g) last = g; }); return v; }
    return V(true) - V(false);
  }
  // square-free factorization (Yun): [[factor, multiplicity], …]
  function yun(f){
    f = trim(f); if (deg(f) < 1) return [];
    var fp = deriv(f), g = pgcd(f, fp), b = pdiv(f, g), c = pdiv(fp, g), d = psub(c, deriv(b)), i = 1, out = [];
    while (deg(b) > 0) {
      var a = pgcd(b, d);
      if (deg(a) > 0) out.push([a, i]);
      b = pdiv(b, a); c = pdiv(d, a); d = psub(c, deriv(b)); i++;
    }
    return out;
  }
  // floating-point roots of a square-free factor (for drawing only; the counts come from nReal)
  function fval(c, x){ var y = 0; for (var i = c.length - 1; i >= 0; i--) y = y * x + c[i]; return y; }
  function froots(c){
    while (c.length && c[c.length - 1] === 0) c = c.slice(0, -1);
    var n = c.length - 1; if (n < 1) return [];
    if (n === 1) return [-c[0] / c[1]];
    var d = [], B = 1, k;
    for (k = 1; k <= n; k++) d.push(c[k] * k);
    for (k = 0; k < n; k++) B = Math.max(B, 1 + Math.abs(c[k] / c[n]));
    var cr = froots(d).filter(function(x){ return x > -B && x < B; }).sort(function(p, q){ return p - q; });
    var pts = [-B].concat(cr, [B]), out = [];
    for (var j = 0; j + 1 < pts.length; j++) {
      var l = pts[j], r = pts[j + 1], fl = fval(c, l), fr = fval(c, r);
      if (fl === 0) { out.push(l); continue; }
      if (fr === 0 || (fl < 0) === (fr < 0)) continue;
      for (var it = 0; it < 200; it++) { var m = (l + r) / 2, fm = fval(c, m); if (m === l || m === r || fm === 0) { l = r = m; break; } if ((fm < 0) === (fl < 0)) { l = m; fl = fm; } else r = m; }
      out.push((l + r) / 2);
    }
    return out;
  }
  function analyse(cn){
    var f = trim(cn.map(fromNum)), res = { n:deg(f), zeros:0, touches:0, turns:0, levels:0, zx:[], tx:[], lx:[], f:f };
    yun(f).forEach(function(fm){
      var k = nReal(fm[0]), even = fm[1] % 2 === 0; res.zeros += k; if (even) res.touches += k;
      froots(fm[0].map(toNum)).forEach(function(x){ res.zx.push({ x:x, touch:even }); });
    });
    yun(deriv(f)).forEach(function(fm){
      var k = nReal(fm[0]), xs = froots(fm[0].map(toNum));
      if (fm[1] % 2) { res.turns += k; res.tx = res.tx.concat(xs); } else { res.levels += k; res.lx = res.lx.concat(xs); }
    });
    var by = function(p, q){ return p - q; };
    res.tx.sort(by); res.lx.sort(by); res.zx.sort(function(p, q){ return p.x - q.x; });
    return res;
  }
  // continued-fraction convergents of v (denominators up to 100 000)
  function convergents(v){
    var h0 = 0, h1 = 1, k0 = 1, k1 = 0, x = v, out = [];
    for (var i = 0; i < 24; i++) {
      var a = Math.floor(x), h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > 100000 || !isFinite(h2)) break;
      out.push([h2, k2]); h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      var fr = x - a; if (Math.abs(fr) < 1e-12) break; x = 1 / fr;
    }
    return out;
  }
  // Is v exactly a critical value of f (f − v has a repeated real root)? Returns [p, q] or null.
  function exactValue(f, v){
    var cs = convergents(v);
    for (var i = 0; i < cs.length; i++) {
      var p = cs[i][0], q = cs[i][1];
      if (Math.abs(p / q - v) > 1e-7 * Math.max(1, Math.abs(v))) continue;
      var h = f.slice(); h[0] = sub(h[0], Q(BigInt(p), BigInt(q)));
      if (yun(h).some(function(fm){ return fm[1] >= 2 && nReal(fm[0]) > 0; })) return [p, q];
      return null;
    }
    return null;
  }
  return { analyse:analyse, exactValue:exactValue, fval:fval };
})();
var fv = PX.fval;

// ---------- shared formatting ----------
function coefsOf(st){ var n = st.n, c = []; for (var i = 0; i <= n; i++) c.push(0); c[0] = st.s; if (n > 1) c[1] = st.r; if (n > 2) c[2] = st.q; if (n > 3) c[3] = st.p; c[n] = st.a; return c; }
function xpow(k){ return k === 0 ? "" : "<i>x</i>" + (k > 1 ? "<sup>" + k + "</sup>" : ""); }
// y = ax^n + … in standard form; with colour, a is violet and n blue
function eqHTML(c, colour){
  var n = c.length - 1, a = c[n], lead = a === 1 ? "" : a === -1 ? MINUS : num(a, 2), h;
  h = (colour && lead ? '<span class="va">' + lead + "</span>" : lead) + "<i>x</i>" + (n > 1 ? "<sup" + (colour ? ' class="vn"' : "") + ">" + n + "</sup>" : "");
  for (var k = n - 1; k >= 0; k--) {
    var v = c[k]; if (!v) continue;
    var ab = Math.abs(v);
    h += (v < 0 ? " " + MINUS + " " : " + ") + (k === 0 ? num(ab, 2) : (ab === 1 ? "" : num(ab, 2)) + xpow(k));
  }
  return '<span class="m"><i>y</i> = ' + h + "</span>";
}
function ends(a, n){
  var ev = n % 2 === 0;
  if (ev && a > 0) return { q:"Q2 to Q1", l:"∞", r:"∞", words:"Rises on both ends." };
  if (ev) return { q:"Q3 to Q4", l:"-∞", r:"-∞", words:"Falls on both ends." };
  if (a > 0) return { q:"Q3 to Q1", l:"-∞", r:"∞", words:"Falls on the left and rises on the right." };
  return { q:"Q2 to Q4", l:"∞", r:"-∞", words:"Rises on the left and falls on the right." };
}
function arrowForm(e){ return "as " + MV.m("x → -∞") + ", " + MV.m("y → " + e.l) + ", and as " + MV.m("x → ∞") + ", " + MV.m("y → " + e.r); }
function pl(k, one, many){ return k + " " + (k === 1 ? one : many); }
function pt(x, y){ return "(" + num(x, 2) + ", " + num(y, 2) + ")"; }

// @component budgetBars — slot rows "x-intercepts: k of at most n" and "turning points: k of at most n − 1";
// turning slots are drawn in pairs (1 + 2 + 2 … for even n, 2 + 2 … for odd n), so a pair fills or empties together.
function budgetHTML(n, zeros, turns){
  function group(size, start, filled, pair){
    var h = '<span class="bud-g' + (pair ? " pair" : "") + '">';
    for (var i = 0; i < size; i++) h += '<span class="bud-s' + (start + i < filled ? " on" : "") + '"></span>';
    return h + "</span>";
  }
  var t = n - 1, groups = [], tg = "", at = 0;
  if (n % 2 === 0 && t > 0) { groups.push(1); t -= 1; }
  while (t > 0) { groups.push(2); t -= 2; }
  groups.forEach(function(g){ tg += group(g, at, turns, g === 2); at += g; });
  return '<div class="bud-row"><span class="bud-lab">' + MV.m("x") + "-intercepts: <b>" + zeros + "</b> of at most " + n + '</span><span class="bud-slots" aria-hidden="true">' + group(n, 0, zeros, false) + "</span></div>" +
    '<div class="bud-row"><span class="bud-lab">turning points: <b>' + turns + "</b> of at most " + (n - 1) + '</span><span class="bud-slots" aria-hidden="true">' + (groups.length ? tg : '<span class="tiny muted">a line never turns</span>') + "</span></div>";
}

// Sample a polynomial densely where it is inside the window (also far zoomed out), sparsely elsewhere.
function samplePts(c, v){
  var n = c.length - 1, a = Math.abs(c[n]), W = v.xmax - v.xmin, Y = Math.max(Math.abs(v.ymin), Math.abs(v.ymax)) * 3, B = 0, k, xs = [];
  for (k = 0; k < n; k++) B = Math.max(B, Math.pow((k === 0 ? Math.abs(c[0]) + Y : Math.abs(c[k])) / a, 1 / (n - k)));
  B *= 2;
  for (k = 0; k <= 700; k++) xs.push(v.xmin - W * 0.01 + W * 1.02 * k / 700);
  var lo = Math.max(v.xmin - W * 0.01, -B), hi = Math.min(v.xmax + W * 0.01, B);
  if (hi > lo && hi - lo < W * 0.9) for (k = 0; k <= 900; k++) xs.push(lo + (hi - lo) * k / 900);
  xs.sort(function(p, q){ return p - q; });
  return xs.map(function(x){ return [x, fv(c, x)]; });
}
// Diamonds for points where the graph levels off without turning.
function drawLevels(plot, c, xs){
  var ctx = plot.ctx;
  xs.forEach(function(x){
    var X = plot.X(x), Y = plot.Y(fv(c, x)); if (!isFinite(X) || !isFinite(Y) || X < -10 || X > plot.W + 10 || Y < -10 || Y > plot.H + 10) return;
    ctx.beginPath(); ctx.moveTo(X, Y - 7); ctx.lineTo(X + 7, Y); ctx.lineTo(X, Y + 7); ctx.lineTo(X - 7, Y); ctx.closePath();
    ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--ink"); ctx.stroke();
    var right = X < plot.W - 170;
    plot.label({ x:x, y:fv(c, x), text:"levels off, doesn’t turn", dx:right ? 12 : -12, dy:18, align:right ? "left" : "right", font:"600 12px " + plot.fontUI, color:css("--ink"), bg:true });
  });
}
function rangeHTML(c, A){
  var n = c.length - 1, a = c[n];
  if (n % 2) return MV.m("{y ∈ ℝ}") + ' <span class="muted">(every real number)</span>';
  var vals = A.tx.map(function(x){ return fv(c, x); }), v = a > 0 ? Math.min.apply(null, vals) : Math.max.apply(null, vals), sign = a > 0 ? " ≥ " : " ≤ ";
  if (!vals.length) return MV.m("{y ∈ ℝ}");
  var ex = PX.exactValue(A.f, v);
  if (ex) {
    var p = ex[0], q = ex[1], dec = 1000 % q === 0, s = dec ? num(p / q, 3) : (p < 0 ? MINUS : "") + Math.abs(p) + "/" + q;
    return MV.m("{y ∈ ℝ | y" + sign + s + "}");
  }
  return MV.m("{y ∈ ℝ | y" + sign + "k}") + ", where " + MV.m("k ≈ " + num(v, 2));
}
function big(v){
  if (Math.abs(v) < 1e7) return num(v, 2);
  var e = Math.floor(Math.log10(Math.abs(v))), m = Math.round(v / Math.pow(10, e) * 100) / 100;
  if (Math.abs(m) >= 10) { m = m / 10; e++; }
  return num(m, 2) + " × 10<sup>" + e + "</sup>";
}
function describe(c, A, extra){
  var n = c.length - 1, e = ends(c[n], n);
  return "Graph of " + MV.plain(eqHTML(c)) + ". Degree " + n + ". " + pl(A.zeros, "x-intercept", "x-intercepts") + ", " + pl(A.turns, "turning point", "turning points") + ". " + e.words + (extra ? " " + extra : "");
}

// @component polyLab — polynomial shape lab: degree chips, N9 sliders for a (violet) and the lower terms p, q, r, s (ink),
// presets, Shape / Zoom out modes with a G10 smooth zoom and the leading-term ghost, exact budget bars, readout and graph.
// o: {pre, st (persisted {n, a, p, q, r, s, mode, zoom}), ctrl, cap, canvas, bars, read, degrees, aStep, low:[min, max],
//     sR:[min, max], zoom:bool, presets:[{label, st}], onChange()}
var ZS = [1, 10, 100, 1000];
var BASE = { xmin:-5, xmax:5, ymin:-20, ymax:20 };
function polyLab(o){
  var st = o.st, pre = o.pre, P = { zf:st.mode === "zoom" ? ZS[st.zoom || 0] : 1, view:null }, cache = { k:null, A:null }, anim = null, zanim = null;
  if (!st.mode) st.mode = "shape";
  if (st.zoom == null) st.zoom = 0;
  function coefs(){ return coefsOf(st); }
  function analysis(){ var c = coefs(), k = c.join(","); if (k !== cache.k) { cache.k = k; cache.A = PX.analyse(c); } return cache.A; }
  function view(){ if (P.view) return P.view; var z = P.zf; return { xmin:BASE.xmin * z, xmax:BASE.xmax * z, ymin:BASE.ymin * z, ymax:BASE.ymax * z }; }
  var LOW = [["p", 3], ["q", 2], ["r", 1], ["s", 0]];
  o.ctrl.innerHTML = '<div class="lab-row"><span class="lab-lab">Degree ' + MV.m("@n{n}") + '</span><span class="chips lab-chips" role="group" aria-label="Degree n">' +
      o.degrees.map(function(d){ return '<button type="button" class="fchip nchip" data-deg="' + d + '" data-k="' + pre + "deg" + d + '" aria-pressed="false">' + MV.m("@n{n} = " + d) + "</button>"; }).join("") + "</span></div>" +
    '<div id="' + pre + '-asl"></div>' +
    '<details class="lab-more" id="' + pre + '-more" open><summary>More sliders: the lower terms</summary><div id="' + pre + '-low"></div><button type="button" class="btn ghost sm" data-reset="1" data-k="' + pre + 'reset">Reset lower terms</button></details>' +
    (o.zoom ? '<div id="' + pre + '-mode"></div><div id="' + pre + '-zoom" class="lab-zoom" hidden></div>' : "") +
    (o.presets ? '<div class="lab-row" style="margin-top:12px"><span class="lab-lab">Presets</span><span class="chips lab-chips" role="group" aria-label="Presets">' + o.presets.map(function(p, i){ return '<button type="button" class="fchip" data-preset="' + i + '" data-k="' + pre + "pre" + i + '">' + p.label + "</button>"; }).join("") + "</span></div>" : "");
  if (window.matchMedia && window.matchMedia("(max-width: 820px)").matches) $("#" + pre + "-more").open = false;
  var sa = MV.sliders($("#" + pre + "-asl"), [{ id:pre + "a", param:"a", label:MV.m("@a{a}") + ", the leading coefficient", min:-3, max:3, step:o.aStep, value:st.a, skip:[0], fmt:function(v){ return num(v, 2); } }],
    function(id, v){ st.a = v; userChange(); });
  var sl = MV.sliders($("#" + pre + "-low"), LOW.map(function(L){
    var r = L[0] === "s" ? o.sR : o.low;
    return { id:pre + L[0], label:MV.m(L[0]) + ", " + (L[1] ? "the coefficient of " + MV.m(L[1] === 1 ? "x" : "x^" + L[1]) : "the constant term"), min:r[0], max:r[1], step:1, value:st[L[0]], fmt:function(v){ return num(v, 2); } };
  }), function(id, v){ st[id.slice(pre.length)] = v; userChange(); });
  LOW.forEach(function(L){ $("#sl-" + pre + L[0]).style.accentColor = "var(--ink)"; $("#sl-" + pre + L[0] + "-out").style.color = "var(--ink)"; });
  var seg = null, zs = null;
  if (o.zoom) {
    seg = MV.seg($("#" + pre + "-mode"), { label:"Mode:", value:st.mode, options:[{ id:"shape", t:"Shape" }, { id:"zoom", t:"Zoom out" }], onChange:function(v){ P.view = null; setMode(v); } });
    zs = MV.sliders($("#" + pre + "-zoom"), [{ id:pre + "zoom", label:"Zoom out", min:0, max:3, step:1, value:st.zoom, fmt:function(v){ return "×" + ZS[v]; } }], function(id, v){ P.view = null; zoomTo(v); });
    $("#sl-" + pre + "zoom").style.accentColor = "var(--ink)"; $("#sl-" + pre + "zoom-out").style.color = "var(--ink)";
    $("#" + pre + "-zoom").insertAdjacentHTML("beforeend", '<div class="zstops" aria-hidden="true"><span>×1</span><span>×10</span><span>×100</span><span>×1000</span></div>');
  }
  var plot = new MV.Plot(o.canvas, view());
  plot.render = draw;
  function draw(){
    var c = coefs(), A = analysis(), v = view(), n = c.length - 1, curves = [], pts = [], near = !!P.view || P.zf < 1.5;
    if (st.mode === "zoom") { var g = []; for (var i = 0; i < n; i++) g.push(0); g.push(c[n]); curves.push({ pts:samplePts(g, v), color:css("--ink-2"), width:2.4, dash:[6, 6], alpha:0.8 }); }
    curves.push({ pts:samplePts(c, v), color:css("--pen"), width:3.2, arrows:true });
    if (near) {
      A.zx.forEach(function(z){ pts.push({ x:z.x, y:0, r:4.5, color:css("--ink") }); });
      A.tx.forEach(function(x){ pts.push({ x:x, y:fv(c, x), r:4.5, color:css("--ink"), ring:true }); });
    }
    var extra = st.mode === "zoom" ? "Zoomed out to " + MV.plain(MV.m(num(v.xmin) + " ≤ x ≤ " + num(v.xmax))) + ", with the leading term drawn dashed." : "";
    plot.draw({ view:v, curves:curves, points:pts, after:near && A.lx.length ? function(){ drawLevels(plot, c, A.lx); } : null, describe:describe(c, A, extra) });
  }
  function rows(c, A){
    var n = c.length - 1, a = c[n], e = ends(a, n), R = [];
    R.push(["Equation", eqHTML(c)]);
    R.push(["Degree", n + ' <span class="muted">(' + (n % 2 ? "odd" : "even") + ")</span>"]);
    R.push(["Leading coefficient", num(a, 2) + ' <span class="muted">(' + (a > 0 ? "positive" : "negative") + ")</span>"]);
    R.push(["End behaviour", '<span class="qpath">' + e.q + "</span>: " + arrowForm(e)]);
    var z = A.zeros, t = A.touches, zt = String(z);
    if (t) zt += ", " + (z === 1 ? "where the graph touches the axis" : t === 1 ? "one where the graph touches the axis" : t === z ? (z === 2 ? "both" : "all") + " where the graph touches the axis" : t + " where the graph touches the axis");
    R.push([MV.m("x") + "-intercepts", zt + ' <span class="muted">(at most ' + n + ")</span>"]);
    var tt = n === 1 ? '0 <span class="muted">(a line never turns)</span>' : A.turns + ' <span class="muted">(at most ' + (n - 1) + "; always " + (n % 2 ? "even" : "odd") + " for degree " + n + ")</span>";
    if (A.lx.length) tt += '<br><span class="tiny muted">It levels off without turning at ' + A.lx.map(function(x){ return pt(x, fv(c, x)); }).join(" and ") + ".</span>";
    R.push(["Turning points", tt]);
    R.push([MV.m("y") + "-intercept", num(c[0], 2)]);
    R.push(["Domain", MV.m("{x ∈ ℝ}")]);
    R.push(["Range", rangeHTML(c, A)]);
    if (st.mode === "zoom") {
      var X = 5 * ZS[st.zoom], lead = a * Math.pow(X, n), oth = 0;
      for (var k = 0; k < n; k++) oth += c[k] * Math.pow(X, k);
      var txt = "At the right edge, " + MV.m("x = " + num(X)) + ": the leading term is " + big(lead) + "; ";
      if (!c.slice(0, n).some(function(v){ return v; })) txt += "there are no other terms, so the graph is exactly the leading term.";
      else {
        var pct = Math.abs(oth) / Math.abs(lead) * 100, d = pct >= 1 || pct === 0 ? 0 : Math.min(9, -Math.floor(Math.log10(pct)));
        txt += "all the other terms together are " + big(oth) + ". They change the total by " + (pct < 1 ? "only " : "") + pct.toFixed(d) + "%.";
      }
      R.push(["Zoom ×" + ZS[st.zoom], txt]);
    }
    return R;
  }
  function render(){
    var c = coefs(), A = analysis();
    o.cap.innerHTML = eqHTML(c, true);
    o.bars.innerHTML = budgetHTML(st.n, A.zeros, A.turns);
    o.read.innerHTML = MV.readoutHTML(rows(c, A));
    draw();
    if (o.onChange) o.onChange();
  }
  function syncSliders(){ sa.set(pre + "a", st.a); LOW.forEach(function(L){ sl.set(pre + L[0], st[L[0]]); }); }
  function sync(){
    MV.$$("[data-deg]", o.ctrl).forEach(function(b){ b.setAttribute("aria-pressed", String(+b.dataset.deg === st.n)); });
    LOW.forEach(function(L){ var lab = $("#sl-" + pre + L[0]).closest("label"); lab.hidden = L[1] >= st.n; });
    syncSliders();
    if (seg) { seg.set(st.mode); $("#" + pre + "-zoom").hidden = st.mode !== "zoom"; zs.set(pre + "zoom", st.zoom); $("#sl-" + pre + "zoom").setAttribute("aria-valuetext", "times " + ZS[st.zoom]); }
  }
  function stop(){ if (anim) { anim(); anim = null; } if (zanim) { zanim(); zanim = null; } }
  function userChange(){ stop(); P.view = null; P.zf = st.mode === "zoom" ? ZS[st.zoom] : 1; sync(); render(); }
  function zoomTo(i, cb, dur){
    if (zanim) { zanim(); zanim = null; }
    st.zoom = i; sync(); render();
    var z0 = P.zf, z1 = ZS[i];
    zanim = MV.tween({ dur:dur || 1100, step:function(t){ P.zf = z0 * Math.pow(z1 / z0, t); draw(); }, done:function(){ P.zf = z1; zanim = null; render(); if (cb) cb(); } });
  }
  function setMode(v, cb){
    st.mode = v;
    if (v === "shape") st.zoom = 0;
    sync();
    zoomTo(st.zoom, cb, 700);
  }
  o.ctrl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.deg) { st.n = +b.dataset.deg; userChange(); }
    else if (b.dataset.preset) { Object.assign(st, o.presets[+b.dataset.preset].st); userChange(); }
    else if (b.dataset.reset) { st.p = st.q = st.r = st.s = 0; userChange(); }
  });
  sync(); render();
  return {
    state:function(){ return st; }, coefs:coefs, analysis:analysis, stop:stop,
    set:function(x){ stop(); Object.assign(st, x); P.view = null; P.zf = st.mode === "zoom" ? ZS[st.zoom] : 1; sync(); render(); },
    animate:function(target, dur, cb){
      stop(); var from = {}; Object.keys(target).forEach(function(k){ from[k] = st[k]; });
      anim = MV.tween({ dur:dur, ease:function(t){ return t; },
        step:function(t){ Object.keys(target).forEach(function(k){ st[k] = from[k] + (target[k] - from[k]) * t; }); syncSliders(); render(); },
        done:function(){ Object.assign(st, target); anim = null; syncSliders(); render(); if (cb) cb(); } });
    },
    setMode:setMode, zoomTo:zoomTo,
    viewTo:function(target, dur, cb){
      stop(); var from = view();
      anim = MV.tween({ dur:dur, step:function(t){ var v = {}; ["xmin", "xmax", "ymin", "ymax"].forEach(function(k){ v[k] = from[k] + (target[k] - from[k]) * t; }); P.view = v; draw(); },
        done:function(){ P.view = target; anim = null; render(); if (cb) cb(); } });
    }
  };
}

// ---------- hero: storyboard in the plan (draw, dots, budget bars, zoom out to y = x^4) ----------
function hero(f){
  var c = [4, 0, -5, 0, 1], g = [0, 0, 0, 0, 1], bud = $("#hero-bud"), H = { reveal:0, dots:0, z:1, ghost:0 };
  var p = new MV.Plot(f.canvas, { xmin:-3, xmax:3, ymin:-12, ymax:12 });
  var DOTS = [[-2, 0], [-1, 0], [1, 0], [2, 0], [-Math.sqrt(2.5), -2.25, 1], [0, 4, 1], [Math.sqrt(2.5), -2.25, 1]];
  bud.innerHTML = budgetHTML(4, 4, 3);
  var eq = MV.m("y = x^4 - 5x^2 + 4"), far = "Far out, it’s just " + MV.m("x^4");
  p.render = function(){
    var v = { xmin:-3 * H.z, xmax:3 * H.z, ymin:-12 * H.z, ymax:12 * H.z }, curves = [];
    if (H.ghost > 0) curves.push({ pts:samplePts(g, v), color:css("--ink-2"), width:2.6, dash:[6, 6], alpha:H.ghost });
    var pts = samplePts(c, v);
    if (H.reveal < 1) { var xr = v.xmin + (v.xmax - v.xmin) * H.reveal; pts = pts.filter(function(q){ return q[0] <= xr; }); }
    curves.push({ pts:pts, color:css("--pen"), width:3.2, arrows:H.reveal >= 1 });
    var dots = DOTS.slice(0, H.dots).map(function(d){ return { x:d[0], y:d[1], r:4.5, color:css("--ink"), ring:!!d[2] }; });
    p.draw({ view:v, curves:curves, points:dots,
      describe:H.z > 1 ? "The graph of y = x⁴ − 5x² + 4 zoomed out to −30 ≤ x ≤ 30. Its bumps have shrunk into the bottom of the curve, and it lies on top of the dashed graph of y = x⁴." : "Graph of y = x⁴ − 5x² + 4 for −3 ≤ x ≤ 3, with 4 x-intercepts and 3 turning points." });
  };
  if (MV.reduceMotion) { H = { reveal:1, dots:0, z:10, ghost:0.85 }; bud.classList.add("on"); f.cap.innerHTML = eq + '<br><span class="hero-far">' + far + "</span>"; p.render(); return; }
  f.cap.innerHTML = eq; p.render();
  MV.tween({ dur:1700, ease:function(t){ return t; }, step:function(t){ H.reveal = t; p.render(); }, done:function(){
    var k = 0, pop = setInterval(function(){ H.dots = ++k; p.render(); if (k >= DOTS.length) { clearInterval(pop); bud.classList.add("on");
      MV.wait(2600, function(){
        H.dots = 0;
        MV.tween({ dur:2600, step:function(t){ H.z = Math.pow(10, t); H.ghost = 0.85 * t; p.render(); }, done:function(){ f.cap.innerHTML = '<span class="hero-far">' + far + "</span>"; } });
      }); } }, 220);
  } });
}

// ---------- Explore: challenge tests ----------
function chalTest(id, st, A, c){
  var n = st.n, a = st.a, md = function(s){ return { ok:false, msg:MV.md(s) }; };
  if (id === "tc1") {
    if (n !== 4 || !(a > 0)) return md("The challenge needs degree 4 and `a > 0`.");
    if (A.zeros === 2 && A.turns === 3) return { ok:true };
    if (A.turns === 1) return md("Your graph is a single U. Make `q` negative enough to push up a hump in the middle.");
    if (A.zeros === 4) return md("Both valleys and the middle hump cross the axis. Lower the hump below the axis (make `s` negative) or lift one valley above it.");
    if (A.zeros === 0) return md("The whole graph is above the axis. Lower it until each valley dips below.");
    return md("Your graph has " + pl(A.zeros, "`x`-intercept", "`x`-intercepts") + " and " + pl(A.turns, "turning point", "turning points") + ". You need exactly 2 and 3.");
  }
  if (id === "tc2") {
    if (n !== 3 || !(a < 0)) return md("The challenge needs degree 3 and `a < 0`.");
    if (A.zeros === 1 && A.turns === 2) return { ok:true };
    if (A.turns === 0) return md("Your cubic just falls. Make `r` positive to create a dip and a hump.");
    if (A.zeros === 3) return md("The low point is below the axis and the high point above it, so the graph crosses three times. Move the graph up or down until both turning points are on the same side.");
    if (A.zeros === 2) return md("One turning point sits exactly on the axis (a touch). Move the graph a little further.");
    return md("Your graph has " + pl(A.zeros, "`x`-intercept", "`x`-intercepts") + " and " + pl(A.turns, "turning point", "turning points") + ". You need exactly 1 and 2.");
  }
  if (id === "tc3") {
    if (n !== 4) return md("This challenge is about degree 4. Choose `n = 4` first.");
    if (A.lx.length && A.turns === 1) {
      var x = A.lx[0], h = 1e-3 * Math.max(1, Math.abs(x)), up = fv(c, x + h) > fv(c, x - h);
      return md("Your graph levels off at " + pt(x, fv(c, x)) + ", but it keeps " + (up ? "rising" : "falling") + ": that’s not a turn. The lab counts 1 turning point.");
    }
    return md("That’s " + A.turns + ". Can you get exactly 2? If not, why not?");
  }
  return { ok:false };
}
var PRESETS = [
  { label:"W-shape " + MV.m("x^4 - 5x^2 + 4"), st:{ n:4, a:1, p:0, q:-5, r:0, s:4 } },
  { label:MV.m("x^3 - 3x"), st:{ n:3, a:1, p:0, q:0, r:-3, s:0 } },
  { label:MV.m("x^5 - 5x^3 + 4x"), st:{ n:5, a:1, p:-5, q:0, r:4, s:0 } }
];

function explore(host, api){
  var S = api.S;
  if (!S.lab) S.lab = { n:4, a:1, p:0, q:-5, r:0, s:4, mode:"shape", zoom:0 };
  var L = MV.pgLayout(host, { aria:"Graph of the polynomial set with the controls" });
  L.ctrl.innerHTML = '<div class="bud" id="ex-bud"></div><div id="ex-ctl"></div>';
  var lab = polyLab({ pre:"ex", st:S.lab, ctrl:$("#ex-ctl"), cap:L.cap, canvas:L.canvas, bars:$("#ex-bud"), read:L.read, degrees:[1, 2, 3, 4, 5, 6],
    aStep:0.1, low:[-10, 10], sR:[-10, 10], zoom:true, presets:PRESETS, onChange:function(){ api.save(); api.changed(); } });
  // TC3: "It's impossible" with reason chips, added to the target-challenge frame
  var tc3 = ((api.content.challenges || []).filter(function(x){ return x.id === "tc3"; })[0]) || { reasons:[] };
  var imp = { open:false, pending:null };
  function tc3UI(){
    var box = $('#chal [data-c="tc3"]'); if (!box || box.querySelector(".imp")) return;
    var acts = box.querySelector(".q-actions"); if (!acts) return;
    var d = document.createElement("div"); d.className = "imp";
    d.innerHTML = '<button type="button" class="btn sm" data-imp="open" data-k="tc3imp" aria-expanded="' + imp.open + '" aria-controls="tc3-reasons">It’s impossible</button>' +
      '<div class="imp-r" id="tc3-reasons" role="group" aria-label="Choose the reason"' + (imp.open ? "" : " hidden") + '><p class="tiny" style="margin:0;font-weight:700">Why can’t it be done? Choose the reason.</p>' +
      tc3.reasons.map(function(r, i){ return '<button type="button" class="opt" data-imp-r="' + i + '" data-k="tc3r' + i + '"><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + r.t + "</span></button>"; }).join("") + "</div>";
    acts.parentNode.insertBefore(d, acts.nextSibling);
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-imp], [data-imp-r]"); if (!b) return;
    if (b.dataset.imp === "open") { imp.open = !imp.open; b.setAttribute("aria-expanded", String(imp.open)); var r = $("#tc3-reasons"); r.hidden = !imp.open; if (imp.open) { var f = r.querySelector("[data-imp-r]"); if (f) f.focus(); } return; }
    imp.pending = +b.dataset.impR;
    var chk = $('#chal [data-c="tc3"] [data-act="check"]'); if (chk) chk.click(); else imp.pending = null;
  });
  return {
    predict:{
      start:function(p){ lab.set(Object.assign({ mode:"shape", zoom:0 }, p.start)); },
      run:function(p, done){
        if (p.id === "p1") lab.animate({ s:6.25 }, 1600, function(){ MV.wait(1100, function(){ lab.animate({ s:10 }, 1600, function(){ MV.wait(300, done); }); }); });
        else if (p.id === "p2") MV.wait(500, function(){ lab.setMode("zoom", function(){ MV.wait(500, function(){ lab.zoomTo(1, function(){ MV.wait(900, function(){ lab.zoomTo(2, function(){ MV.wait(300, done); }, 1400); }); }, 1400); }); }); });
        else if (p.id === "p3") MV.wait(400, function(){ lab.set({ n:4, a:0.1, p:1 }); MV.wait(1700, function(){ lab.viewTo({ xmin:-12, xmax:6, ymin:-120, ymax:60 }, 1900, function(){ MV.wait(300, done); }); }); });
        else if (p.id === "p4") MV.wait(1100, function(){ lab.set({ r:-5 }); MV.wait(1900, function(){ lab.set({ p:-5, r:4 }); MV.wait(1100, done); }); });
        else done();
      }
    },
    challenge:function(id, opt){
      if (id === "tc3" && opt && opt.live) { tc3UI(); return { ok:false }; }
      if (id === "tc3" && imp.pending != null) {
        var i = imp.pending, R = tc3.reasons[i]; imp.pending = null;
        return MV.ok(R) ? { ok:true } : { ok:false, msg:"<strong>" + String.fromCharCode(65 + i) + ".</strong> “" + R.t + "” " + R.why };
      }
      return chalTest(id, lab.state(), lab.analysis(), lab.coefs());
    }
  };
}

// @component cardDeck — "Possible or impossible?" cards: a sketch and a claim, verdict and rule radio groups, rule-by-rule
// feedback and a "Show me one" equation drawn over the sketch (the part's "Check it with algebra").
function sketchFn(tp, arms){
  var n = tp.length, K = 2.2;
  return function(x){
    if (x <= tp[0][0]) { var d = tp[0][0] - x; return tp[0][1] + arms[0] * K * d * d * (1 + d); }
    if (x >= tp[n - 1][0]) { var d2 = x - tp[n - 1][0]; return tp[n - 1][1] + arms[1] * K * d2 * d2 * (1 + d2); }
    for (var i = 0; i + 1 < n; i++) if (x <= tp[i + 1][0]) { var t = (x - tp[i][0]) / (tp[i + 1][0] - tp[i][0]); return tp[i][1] + (tp[i + 1][1] - tp[i][1]) * t * t * (3 - 2 * t); }
    return NaN;
  };
}
function part3(host, api){
  var C = api.content, cards = C.cards, RULES = C.rules, S = api.S, msg = null;
  S.i = S.i || 0; S.c = S.c || {};
  host.innerHTML = '<div class="pred-top"><span class="tiny muted" id="pc-n"></span><span class="dots" id="pc-dots" aria-hidden="true"></span></div>' +
    '<div class="sym pc"><div><figure class="pc-fig"><canvas class="plot" id="pc-plot" role="img"></canvas><div class="pc-text" id="pc-text" hidden></div><figcaption id="pc-cap" aria-live="polite"></figcaption></figure></div>' +
    '<div><p class="pc-claim" id="pc-claim"></p><p class="pc-q">Could a polynomial like that have this graph?</p><div class="pc-verdict" id="pc-v" role="radiogroup" aria-label="Your verdict"></div>' +
    '<div id="pc-rwrap" hidden><p class="pc-q" style="margin-top:14px">Which rule does it break?</p><div class="pc-rules" id="pc-r" role="radiogroup" aria-label="The rule it breaks"></div></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="pc-check" data-k="pccheck">Check</button><button type="button" class="btn ghost sm" id="pc-show" data-k="pcshow" hidden>Show me one</button></div><div id="pc-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="pc-prev" data-k="pcprev">Previous card</button><button type="button" class="btn ghost sm" id="pc-next" data-k="pcnext">Next card</button></div></div></div>';
  var plot = new MV.Plot($("#pc-plot"), { xmin:-3, xmax:3, ymin:-8, ymax:8 });
  function cur(){ var c = cards[S.i]; return { c:c, A:MV.ans(c), x:S.c[c.id] || (S.c[c.id] = { v:null, r:null, tries:0, solved:false, first:null, checked:false, seen:false, shown:false, last:null }) }; }
  function ruleBy(id){ return RULES.filter(function(r){ return r.id === id; })[0]; }
  plot.render = function(){
    var k = cur(); if (!k.c.view) return;
    var A = k.A, f = A.co ? function(x){ return fv(A.co, x); } : sketchFn(A.tp, A.arms), show = k.x.shown && A.co;
    var curves = [{ f:f, color:css("--ink-2"), width:show ? 7 : 3.4, alpha:show ? 0.4 : 1, arrows:true }];
    if (show) curves.push({ f:f, color:css("--pen"), width:2.6, arrows:true });
    plot.draw({ view:k.c.view, curves:curves, describe:k.c.desc + (show ? " A real equation is drawn over it: " + MV.plain(MV.md(A.eq)) + "." : "") });
  };
  function feedback(k){
    var A = k.A, L = k.x.last, okR = A.rules || [];
    if (A.v === "P") {
      if (L.v === "P") return { good:true, h:"<strong>✓ Correct.</strong> A polynomial like that can have this graph. Press “Show me one” to see an equation that fits." };
      return { good:false, h:"<strong>✗ Not quite.</strong> This one is possible. Press “Show me one” to see an equation that fits. " + MV.md(A.fb[L.r] || "") };
    }
    if (L.v === "P") { var main = ruleBy(okR[0]); return { good:false, h:"<strong>✗ Not quite.</strong> Look again at the " + main.name + ". " + MV.md(A.look) }; }
    if (okR.indexOf(L.r) >= 0) return { good:true, h:"<strong>✓ Correct.</strong> " + MV.md(A.rule) };
    return { good:false, h:"<strong>✗ Not quite.</strong> It is impossible, but not for that reason. " + MV.md(A.rule) };
  }
  function radio(group, id, label, on, enabled, first){
    return '<button type="button" class="pc-chip" role="radio" aria-checked="' + on + '" tabindex="' + (on || first ? 0 : -1) + '" data-' + group + '="' + id + '" data-k="pc' + group + id + '"' + (enabled ? "" : " disabled") + ">" + label + "</button>";
  }
  function paint(){
    var k = cur(), c = k.c, A = k.A, x = k.x, open = !x.solved;
    $("#pc-n").textContent = "Card " + (S.i + 1) + " of " + cards.length;
    $("#pc-dots").innerHTML = cards.map(function(q, i){ var y = S.c[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#pc-plot").hidden = !c.view; $("#pc-text").hidden = !!c.view; $("#pc-text").innerHTML = c.text ? "<p>" + c.text + "</p>" : "";
    $("#pc-claim").innerHTML = "Claim: " + c.claim;
    MV.keepFocus($("#pc-v"), function(){ $("#pc-v").innerHTML = [["P", "Possible"], ["I", "Impossible"]].map(function(o, i){ return radio("v", o[0], o[1], x.v === o[0], open, x.v == null && i === 0); }).join(""); });
    $("#pc-rwrap").hidden = x.v !== "I";
    MV.keepFocus($("#pc-r"), function(){ $("#pc-r").innerHTML = RULES.map(function(r, i){ return radio("r", r.id, r.t, x.r === r.id, open, x.r == null && i === 0); }).join(""); });
    $("#pc-check").disabled = x.solved;
    $("#pc-show").hidden = !(A.v === "P" && x.seen);
    $("#pc-show").disabled = x.shown;
    var fb = "";
    if (msg) fb = '<div class="fb" role="status"><p>' + msg + "</p></div>";
    else if (x.checked && x.last) { var r = feedback(k); fb = '<div class="fb ' + (r.good ? "good" : "bad") + '" role="status"><p>' + r.h + (x.solved && !x.first ? ' <span class="muted">(not first try)</span>' : "") + "</p></div>"; }
    $("#pc-fb").innerHTML = fb;
    var cap = "";
    if (x.shown && A.co) {
      var an = PX.analyse(A.co), n = A.co.length - 1, a = A.co[n];
      cap = MV.md(A.eq) + '<span class="pc-alg">Degree ' + n + ", leading coefficient " + num(a) + ": " + ends(a, n).q + ". The lab counts " + pl(an.zeros, MV.m("x") + "-intercept", MV.m("x") + "-intercepts") + " and " + pl(an.turns, "turning point", "turning points") + ".</span>";
    }
    $("#pc-cap").innerHTML = cap;
    $("#pc-prev").disabled = S.i === 0; $("#pc-next").disabled = S.i === cards.length - 1;
    plot.render();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var k = cur(), x = k.x;
    msg = null;
    if (b.dataset.v) { x.v = b.dataset.v; x.checked = false; }
    else if (b.dataset.r) { x.r = b.dataset.r; x.checked = false; }
    else if (b.id === "pc-prev" || b.id === "pc-next") { S.i = Math.max(0, Math.min(cards.length - 1, S.i + (b.id === "pc-prev" ? -1 : 1))); }
    else if (b.id === "pc-show") { x.shown = true; }
    else if (b.id === "pc-check") {
      if (!x.v) msg = "Choose <strong>Possible</strong> or <strong>Impossible</strong> first.";
      else if (x.v === "I" && !x.r) msg = "Choose the rule it breaks first.";
      else {
        x.last = { v:x.v, r:x.v === "I" ? x.r : null }; x.checked = true; x.seen = true;
        var good = feedback(k).good;
        if (good) { x.solved = true; x.first = x.tries === 0; } else x.tries++;
      }
      api.save(); paint(); MV.focusFb($("#pc-fb").parentNode); return;
    } else return;
    api.save(); paint();
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[role=radio]"); if (!b) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!d) return;
    e.preventDefault();
    var list = MV.$$("[role=radio]", b.parentNode).filter(function(x){ return !x.disabled; }), i = list.indexOf(b), nb = list[(i + d + list.length) % list.length];
    if (nb) { var key = nb.dataset.k; nb.click(); var f = host.querySelector('[data-k="' + key + '"]'); if (f) f.focus(); }
  });
  paint();
  return {};
}

// ---------- Practice 2: Deduce it (multiple choice with retry, plus one select-all) ----------
function deduce(host, api, a){
  var S = api.S; S.items = S.items || {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null, checked:false, pick:{} }); }
  function saHTML(it, x, i){
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tags"><span class="tag">★</span></span>' : "") + "</div>";
    h += '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
      var on = !!x.pick[oi], c = "opt sa-opt";
      if (x.checked) { var good = MV.ok(o); if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
      return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'check">Check answer</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.msg) h += '<div class="fb" role="status"><p>' + x.msg + "</p></div>";
    else if (x.checked) {
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else {
        var miss = (MV.ans(it) || {}).miss || {}, lines = [];
        it.options.forEach(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) lines.push("✗ " + o.t + ": " + (o.why || "")); else if (!on && good) lines.push(miss[oi] ? "○ " + MV.md(miss[oi]) : "○ One more option belongs in your selection."); });
        h += '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> Your selection isn’t right yet. Try again.</p>' + lines.filter(function(l, k){ return lines.indexOf(l) === k; }).map(function(l){ return "<p>" + l + "</p>"; }).join("") + "</div>";
      }
    }
    return h;
  }
  function paintQ(it, i){
    var box = host.querySelector('[data-dq="' + it.id + '"]'), x = ist(it.id);
    MV.keepFocus(box, function(){
      box.innerHTML = it.kind === "sa" ? saHTML(it, x, i) : MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
      if (it.kind !== "sa" && x.solved && !x.first) { var g = box.querySelector(".fb.good p"); if (g) g.insertAdjacentHTML("beforeend", ' <span class="muted">(not first try)</span>'); }
    });
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q" data-dq="' + it.id + '"></div>'; }).join("");
  a.items.forEach(paintQ);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-dq]"); if (!box) return;
    var it = a.items.filter(function(q){ return q.id === box.dataset.dq; })[0], i = a.items.indexOf(it), x = ist(it.id);
    x.msg = null;
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; }
    else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
    else if (b.dataset.act === "check") {
      var ok;
      if (it.kind === "sa") {
        if (!it.options.some(function(o, oi){ return x.pick[oi]; })) { x.msg = "Select at least one option first."; api.save(); paintQ(it, i); return; }
        ok = it.options.every(function(o, oi){ return !!x.pick[oi] === MV.ok(o); });
      } else ok = MV.ok(it.options[x.choice]);
      x.checked = true;
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    }
    api.save(); paintQ(it, i); if (b.dataset.act === "check") MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design to spec (the shape lab's controls) ----------
var task = (function(){
  var lab = null;
  return {
    render:function(inp, pv, api){
      var S = api.S; if (S.n == null) Object.assign(S, { n:2, a:1, p:0, q:0, r:0, s:0, mode:"shape", zoom:0 });
      inp.innerHTML = '<div id="tk-ctl" class="tk-ctl"></div>';
      pv.innerHTML = '<div class="eq-cap" id="tk-cap" aria-live="polite"></div><div class="plot-wrap"><canvas class="plot" id="tk-plot" role="img" aria-label="Graph of your design"></canvas></div><div class="bud" id="tk-bud" style="margin-top:12px"></div><dl class="read" id="tk-read" aria-live="polite"></dl>';
      lab = polyLab({ pre:"tk", st:S, ctrl:$("#tk-ctl"), cap:$("#tk-cap"), canvas:$("#tk-plot"), bars:$("#tk-bud"), read:$("#tk-read"), degrees:[2, 3, 4, 5, 6],
        aStep:0.5, low:[-6, 6], sR:[-6, 6], zoom:false, presets:null, onChange:function(){ api.save(); api.update(); } });
    },
    read:function(){ if (!lab) return { n:0, a:0, s:0, c:[], A:{ zeros:0, turns:0 } }; var s = lab.state(); return { n:s.n, a:s.a, s:s.s, c:lab.coefs(), A:lab.analysis() }; },
    valid:function(d){ return d.n ? true : "Set the sliders first."; },
    checks:function(d){ return [d.n % 2 === 0 && d.a > 0, d.A.turns === 3, d.A.zeros === 2, d.s === -3, d.n === 4]; },
    tips:function(d, res){
      var T = MV.C.task.tips, out = [];
      res.forEach(function(ok, i){
        if (ok) return;
        var k = i === 1 ? d.A.turns : d.A.zeros, s = T[i].replace("{k}", k).replace("{n}", d.n);
        if (k === 1) s = s.replace("turning points.", "turning point.").replace("-intercepts.", "-intercept.");
        out.push(s);
      });
      return out;
    },
    key:function(d){ return d.c.join(","); },
    label:function(k){ return eqHTML(k.split(",").map(Number)); },
    text:function(k){ return MV.plain(eqHTML(k.split(",").map(Number))); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ deduce:deduce },
  task:task,
  figures:{
    e3:function(p){
      p.draw({ view:{ xmin:-2.2, xmax:2.2, ymin:-3, ymax:4.6 }, curves:[{ f:function(x){ return -2 * Math.pow(x, 4) + 4 * x * x + 1; }, color:css("--pen"), width:3, arrows:true }],
        points:[{ x:-1, y:3, label:"(−1, 3)" }, { x:1, y:3, label:"(1, 3)" }, { x:0, y:1, label:"(0, 1)", below:true }],
        describe:"Graph of y = −2x⁴ + 4x² + 1: both arms down, highest points (−1, 3) and (1, 3), and a dip at (0, 1)." });
    }
  }
});
})();
