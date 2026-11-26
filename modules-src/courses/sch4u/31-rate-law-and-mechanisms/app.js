// SCH4U 31 Rate Law and Reaction Mechanisms: hero (three-lane highway squeezing into one slow lane), Initial-rates analyser
// (Explore: concentration sliders, trials table with row selection, comparison panel, order chips, k entry, Mechanism mode
// with step cards + slow-step marker + C4 energy diagram, Rate law check mode), Mechanism detective (Part 3: cancel-and-label
// stations for H₂O₂/I⁻ and Cl/O₃ with particle zoom and cycle counter, "which mechanism fits?"), custom practice items
// (orders, k with unit chips, number entry, chips) and the "Plan the trials" grid task.
(function(){
"use strict";
var $ = MV.$, esc = MV.esc, M = "−";
var SUPD = { "0":"⁰", "1":"¹", "2":"²", "3":"³", "4":"⁴", "5":"⁵", "6":"⁶", "7":"⁷", "8":"⁸", "9":"⁹", "-":"⁻" };
var DESUP = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁻":"-" };
function sup(n){ return String(n).split("").map(function(c){ return SUPD[c] || c; }).join(""); }
function r1(v){ return Math.round(v * 10) / 10; }
function f2(v){ return v.toFixed(2); }
// scientific notation with Unicode superscripts: 2 significant figures, 3 when needed (1.35 × 10⁻²)
function sci(v){
  if (!v) return "0";
  var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), mt = v / Math.pow(10, e), s = mt.toFixed(2);
  if (parseFloat(s) >= 10) { e++; mt = v / Math.pow(10, e); s = mt.toFixed(2); }
  if (s.slice(-1) === "0") s = mt.toFixed(1);
  return e === 0 ? s : s + " × 10" + sup(e).replace("-", "⁻");
}
function ratio(v){ var s = (Math.round(v * 100) / 100).toString(); return s; }
// number entry: 4.0e-3, 4.0 × 10^-3, 4.0 x 10⁻³, 0.004, 3/4
function parseSci(raw){
  var s = String(raw == null ? "" : raw).trim(); if (!s) return null;
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, function(t){ return "^(" + t.split("").map(function(c){ return DESUP[c]; }).join("") + ")"; });
  s = s.replace(/(\d)\s*[xX*]\s*(?=10)/g, "$1×");
  var r = MV.parseNum(s); return r && r.length === 1 ? r[0] : null;
}
function near(a, b, tol){ return a != null && b != null && Math.abs(a - b) <= (tol || 0.011) * Math.abs(b) + 1e-12; }
function unitsOf(n){ return n === 0 ? "mol/(L·s)" : n === 1 ? "s⁻¹" : n === 2 ? "L/(mol·s)" : "L" + sup(n - 1) + "/(mol" + sup(n - 1) + "·s)"; }
var KI = "<i>k</i>";
function lawText(sp, o){ return "rate = " + KI + sp.map(function(s, i){ return o[i] == null ? "[" + s + "]<sup>?</sup>" : o[i] === 0 ? "" : "[" + s + "]" + sup(o[i]); }).join(""); }
function btn(act, t, kind, extra){ return '<button type="button" class="btn ' + (kind || "ghost") + ' sm" data-act="' + act + '" data-k="' + act + '"' + (extra || "") + ">" + t + "</button>"; }

// ---------- @component radioGroup (delegated HTML variant of SCH4U 01–19's radioGroup) — chip row as a real radio group:
// roving tabindex, arrow keys move and choose; the host component handles clicks on [data-rgk].
function chipRow(key, label, opts, val, dis, cls){
  var any = opts.some(function(o){ return String(o.id) === String(val); });
  return '<div class="rl-cr"><span class="rl-crl">' + label + '</span><span class="rg ' + (cls || "chips") + '" role="radiogroup" aria-label="' + esc(MV.plain(label)) + '">' +
    opts.map(function(o, i){ var on = val != null && String(o.id) === String(val);
      return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + ((on || (!any && i === 0)) ? 0 : -1) + '" data-rgk="' + key + '" data-rgv="' + esc(String(o.id)) + '" data-k="' + key + "-" + esc(String(o.id)) + '"' + (dis ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span></div>";
}
function rgKeys(root){
  root.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rgk]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var all = Array.prototype.slice.call(b.parentNode.querySelectorAll("[data-rgk]")).filter(function(x){ return !x.disabled; }), i = all.indexOf(b);
    var nx = all[(i + d + all.length) % all.length]; if (nx) { nx.focus(); nx.click(); }
  });
}

// ---------- mechanisms: add the steps, find intermediates and catalysts, rate law of the slow step ----------
function spHTML(p){ return (p[1] > 1 ? p[1] : "") + p[0]; }
function eqTxt(s){ return s.l.map(spHTML).join(" + ") + " → " + s.r.map(spHTML).join(" + "); }
function analyse(steps, slow, overall, exp){
  var net = {}, first = {}, order = [];
  steps.forEach(function(s){
    s.l.forEach(function(p){ if (!(p[0] in net)) { net[p[0]] = 0; first[p[0]] = "l"; order.push(p[0]); } net[p[0]] -= p[1]; });
    s.r.forEach(function(p){ if (!(p[0] in net)) { net[p[0]] = 0; first[p[0]] = "r"; order.push(p[0]); } net[p[0]] += p[1]; });
  });
  var want = {};
  overall.l.forEach(function(p){ want[p[0]] = (want[p[0]] || 0) - p[1]; });
  overall.r.forEach(function(p){ want[p[0]] = (want[p[0]] || 0) + p[1]; });
  var keys = Object.keys(net).concat(Object.keys(want));
  var adds = steps.length > 0 && keys.every(function(s){ return (net[s] || 0) === (want[s] || 0); });
  var ints = order.filter(function(s){ return net[s] === 0 && first[s] === "r"; }), cats = order.filter(function(s){ return net[s] === 0 && first[s] === "l"; });
  var law = null, hasInt = false, match = false;
  if (slow >= 0 && steps[slow]) {
    law = steps[slow].l;
    hasInt = law.some(function(p){ return ints.indexOf(p[0]) >= 0; });
    match = !hasInt && law.length === exp.length && exp.every(function(p){ return law.some(function(q){ return q[0] === p[0] && q[1] === p[1]; }); });
  }
  return { adds:adds, ints:ints, cats:cats, law:law, hasInt:hasInt, match:match, net:net, order:order };
}
function slowLaw(law){ return "rate = " + KI + law.map(function(p){ return "[" + p[0] + "]" + (p[1] > 1 ? sup(p[1]) : ""); }).join(""); }
function netEq(an){
  var L = [], R = [];
  an.order.forEach(function(s){ var n = an.net[s]; if (n < 0) L.push([s, -n]); else if (n > 0) R.push([s, n]); });
  return eqTxt({ l:L, r:R });
}

// ---------- hero: a three-lane highway narrows to one slow lane ----------
var NC = 15, GAP = 0.42, T0 = 1.8;
function carPos(i, tau){
  var lane = i % 3, ly = 65 + lane * 30, x0 = -20 - Math.floor(i / 3) * 26 - lane * 8, tp = T0 + i * GAP;
  if (tau < tp) {
    var passed = tau >= T0 ? Math.min(i, Math.floor((tau - T0) / GAP) + 1) : 0, row = Math.floor((i - passed) / 3);
    return [Math.min(x0 + 110 * tau, 158 - row * 24), ly];
  }
  var s = tau - tp, x = 165 + 75 * s;
  if (x > 300) x = 300 + 220 * (s - 135 / 75);
  var y = x < 200 ? ly + (95 - ly) * ((x - 165) / 35) : x <= 300 ? 95 : x < 335 ? 95 + (ly - 95) * ((x - 300) / 35) : ly;
  return [x, y];
}
function T(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.op != null && o.op < 1 ? ' opacity="' + r1(o.op * 10) / 10 + '"' : "") + (o.it ? ' font-style="italic"' : "") + ">" + s + "</text>"; }
function heroSVG(tau, s){
  var road = "0,50 165,50 200,80 300,80 335,50 480,50 480,140 335,140 300,110 200,110 165,140 0,140";
  var h = '<defs><clipPath id="rl-hx-clip"><polygon points="' + road + '"/></clipPath></defs>';
  h += '<polygon points="' + road + '" fill="var(--paper)" stroke="var(--ink-2)" stroke-width="2"/>';
  [80, 110].forEach(function(y){ h += '<line x1="0" y1="' + y + '" x2="160" y2="' + y + '" stroke="var(--rule)" stroke-width="2" stroke-dasharray="10 8"/><line x1="340" y1="' + y + '" x2="480" y2="' + y + '" stroke="var(--rule)" stroke-width="2" stroke-dasharray="10 8"/>'; });
  if (s.glow > 0) h += '<rect x="200" y="80" width="100" height="30" fill="var(--hi)" opacity="' + r1(0.4 * s.glow * 10) / 10 + '"/>';
  h += T(250, 66, "slow step", { fs:13, w:700, c:"var(--ink-2)" });
  h += '<g clip-path="url(#rl-hx-clip)">';
  for (var i = 0; i < NC; i++) { var p = carPos(i, tau); if (p[0] > -15 && p[0] < 495) h += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="8" fill="var(--eq-r)" stroke="var(--sheet)" stroke-width="1.5"/>'; }
  h += "</g>";
  if (s.lab > 0) {
    h += T(250, 160, "Step 1 (slow)", { fs:13, w:700, op:s.lab }) + T(250, 180, "A + B → AB", { fs:13, op:s.lab });
    h += T(408, 160, "Step 2 (fast)", { fs:13, w:700, op:s.lab }) + T(408, 180, "AB + A → A₂B", { fs:13, op:s.lab });
  }
  if (s.law > 0) h += T(240, 232, "rate = <tspan font-style=\"italic\">k</tspan>[A][B]", { fs:22, w:700, op:s.law });
  return h;
}
function hero(){
  var svg = $("#rl-hx-svg"), cap = $("#rl-hx-cap"), rep = $("#rl-hx-replay"); if (!svg) return;
  var run = 0, tw = null, tau = 0, s = { glow:0, lab:0, law:0 };
  function draw(){ svg.innerHTML = heroSVG(tau, s); }
  function fin(){ tau = 6; s = { glow:1, lab:1, law:1 }; draw(); cap.textContent = "Step 1 (slow): A + B → AB; Step 2 (fast): AB + A → A₂B. The slow step sets the rate: rate = k[A][B]."; rep.hidden = false; }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true; tau = 0; s = { glow:0, lab:0, law:0 }; draw();
    var L = [
      { cap:"Three lanes squeeze into one: cars pile up before the narrow point.", dur:5000, step:function(t){ tau = 6 * t; }, pause:300 },
      { cap:"Step 1 (slow): A + B → AB; Step 2 (fast): AB + A → A₂B.", dur:700, step:function(t){ s.lab = t; s.glow = t; }, pause:700 },
      { cap:"The slow step sets the rate: rate = k[A][B].", dur:600, step:function(t){ s.law = t; }, pause:600 }
    ], i = 0;
    (function next(){
      if (id !== run) return;
      if (i >= L.length) { fin(); return; }
      var it = L[i++]; cap.textContent = it.cap;
      tw = MV.tween({ dur:it.dur, step:function(t){ if (id !== run) return; it.step(t); draw(); }, done:function(){ tw = null; if (id === run) MV.wait(it.pause, next); } });
    })();
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) fin(); else play(); });
  if (MV.reduceMotion) fin(); else play();
}

// ---------- C4 energy diagram: one hump per step, the slow step tallest ----------
function energySVG(n, slow){
  if (!n) return "";
  var w = 250 / n, y = 100, h = '<path d="M12,100 L40,100';
  var lab = "";
  for (var i = 0; i < n; i++) {
    var x0 = 40 + i * w, x1 = x0 + w, xc = (x0 + x1) / 2, yp = i === slow ? 24 : 66, ye = i === n - 1 ? 118 : 92;
    h += " C" + r1(x0 + w * 0.25) + "," + y + " " + r1(xc - w * 0.2) + "," + yp + " " + r1(xc) + "," + yp + " S" + r1(x1 - w * 0.25) + "," + ye + " " + r1(x1) + "," + ye;
    lab += T(xc, yp - 12, "Step " + (i + 1) + (i === slow ? " (slow)" : ""), { fs:11, w:i === slow ? 700 : 400 });
    if (i === slow) lab += '<line x1="' + r1(xc) + '" y1="' + (y - 2) + '" x2="' + r1(xc) + '" y2="' + (yp + 6) + '" stroke="var(--en-ea)" stroke-width="2" stroke-dasharray="4 3"/>' + T(xc + 6, (y + yp) / 2, "<tspan font-style=\"italic\">E</tspan><tspan font-size=\"8\" dy=\"3\">a</tspan>", { fs:12, a:"start", c:"var(--en-ea)" });
    y = ye;
  }
  h += " L306," + y + '" fill="none" stroke="var(--en-ea)" stroke-width="2.6"/>';
  return '<svg class="rl-en" viewBox="0 0 320 136" role="img" aria-label="Energy diagram with one hump per step' + (slow >= 0 ? "; the hump for step " + (slow + 1) + ", the slow step, is the tallest" : "") + '.">' +
    '<line x1="10" y1="130" x2="310" y2="130" stroke="var(--rule)" stroke-width="1.5"/>' + h + lab + T(14, 112, "reactants", { fs:10, a:"start", c:"var(--ink-2)" }) + T(306, y + 10, "products", { fs:10, a:"end", c:"var(--ink-2)" }) + "</svg>";
}

// ---------- Explore: Initial-rates analyser ----------
function explore(host, api){
  var C = api.content, S = api.S, m = C.msgs, RX = C.rx, byId = {}, RD = C.read;
  RX.forEach(function(r){ byId[r.id] = r; });
  var CARD = {}; C.build.cards.forEach(function(c){ CARD[c.id] = c; });
  if (["rates", "mech", "check"].indexOf(S.mode) < 0) S.mode = "rates";
  if (!byId[S.rx]) S.rx = "r1";
  if (S.mech !== "build") S.mech = "r4";
  ["c", "tr", "sel", "ord", "kIn", "kU", "pred"].forEach(function(k){ if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
  RX.forEach(function(r){
    var n = r.sp.length;
    if (!Array.isArray(S.c[r.id]) || S.c[r.id].length !== n) S.c[r.id] = r.sp.map(function(){ return 0.10; });
    if (!Array.isArray(S.tr[r.id])) S.tr[r.id] = [];
    if (!Array.isArray(S.sel[r.id])) S.sel[r.id] = [];
    if (!Array.isArray(S.ord[r.id]) || S.ord[r.id].length !== n) S.ord[r.id] = r.sp.map(function(){ return null; });
  });
  if (S.slow4 !== 1) S.slow4 = 0;
  if (!Array.isArray(S.bm)) S.bm = [];
  S.bm = S.bm.filter(function(id){ return CARD[id]; }).slice(0, 2);
  if (typeof S.bslow !== "number" || S.bslow >= S.bm.length) S.bslow = -1;
  var busy = false, flash = false, fb = null, unitsN = 0, glow = {};
  var ORD = C.orders.map(function(v){ return { id:v, t:String(v) }; });

  host.innerHTML = '<p class="how">' + C.how + '</p><div class="rl-top"></div>' +
    '<div class="rl-grid" data-mv="graph"><div class="rl-left"><p class="banner" data-mv="banner" aria-live="polite"></p><div class="rl-main"></div><p class="rl-cap" aria-live="polite"></p><div class="rl-xfb" aria-live="polite"></div></div>' +
    '<div class="rl-right"><h4 class="rl-h4">Readout</h4><dl class="read rl-read"></dl><div class="rl-side"></div></div></div><p class="tiny muted rl-model">' + C.model + "</p>";
  var topEl = $(".rl-top", host), mainEl = $(".rl-main", host), readEl = $(".rl-read", host), sideEl = $(".rl-side", host), capEl = $(".rl-cap", host), fbEl = $(".rl-xfb", host);

  function cur(){ return byId[S.rx]; }
  function rateOf(r, cs){ var a = MV.ans(r), v = r.k; cs.forEach(function(c, i){ v *= Math.pow(c, a[i]); }); return v; }
  function same(a, b){ return a.every(function(v, i){ return Math.abs(v - b[i]) < 1e-9; }); }
  function addTrial(rid, cs, user){
    var T = S.tr[rid];
    for (var i = 0; i < T.length; i++) if (same(T[i], cs)) { if (user) fb = { k:"", h:m.noDup }; return i; }
    if (T.length >= 8) { if (user) { fb = { k:"", h:m.full }; return -1; } T.shift(); S.sel[rid] = []; }
    T.push(cs.slice()); return T.length - 1;
  }
  function fitInfo(r){
    var T = S.tr[r.id], o = S.ord[r.id];
    if (!T.length || o.some(function(v){ return v == null; })) return null;
    function pw(cs){ var v = 1; cs.forEach(function(c, i){ v *= Math.pow(c, o[i]); }); return v; }
    var k = rateOf(r, T[0]) / pw(T[0]), n = 0;
    T.forEach(function(cs){ if (near(k * pw(cs), rateOf(r, cs), 0.01)) n++; });
    return { k:k, n:n, of:T.length, ov:o.reduce(function(a, b){ return a + b; }, 0), pw:pw };
  }

  // comparison of the selected pair
  function cmp(r){
    var T = S.tr[r.id], sel = S.sel[r.id];
    if (sel.length < 2) return null;
    var a = T[sel[0]], b = T[sel[1]], ch = [], un = [];
    r.sp.forEach(function(sp, i){ var q = b[i] / a[i]; if (Math.abs(q - 1) < 1e-9) un.push(i); else ch.push({ i:i, q:q }); });
    var rr = rateOf(r, b) / rateOf(r, a), out = { a:sel[0], b:sel[1], ch:ch, un:un, rr:rr };
    if (ch.length === 1) out.n = Math.round(Math.log(rr) / Math.log(ch[0].q));
    return out;
  }
  function cmpRows(r){
    var c = cmp(r);
    if (!c) return [[RD.pair, '<span class="muted">Tap two trials in the table to compare them.</span>']];
    var conc = c.ch.length > 1 ? "Two concentrations changed: this pair can’t isolate an order." : c.ch.map(function(x){ return "[" + r.sp[x.i] + "] × " + ratio(x.q); }).concat(c.un.map(function(i){ return "[" + r.sp[i] + "] unchanged"; })).join(", ");
    var one = c.ch.length === 1, base = one ? ratio(c.ch[0].q) : "";
    return [[RD.pair, "Trial " + (c.a + 1) + " → Trial " + (c.b + 1)], [RD.conc, conc],
      [RD.rate, "× " + ratio(c.rr) + (one ? " = " + base + sup(c.n) : "")],
      [RD.ord, one ? c.n + " (because " + base + sup(c.n) + " = " + ratio(c.rr) + ")" : '<span class="muted">Shown only when exactly one concentration changed</span>']];
  }
  function sliderHTML(sp, i, v){
    var id = "rl-sl-" + i;
    return '<div class="rl-sl"><label for="' + id + '">[' + sp + '] = <output data-out="' + i + '">' + f2(v) + '</output> mol/L</label><input type="range" id="' + id + '" min="1" max="' + C.concs.length + '" step="1" value="' + Math.round(v * 10) + '" data-sl="' + i + '" data-k="sl-' + i + '" aria-valuetext="' + f2(v) + ' mol/L"' + (busy ? " disabled" : "") + "></div>";
  }
  function tableHTML(r){
    var T = S.tr[r.id], sel = S.sel[r.id];
    var h = '<div class="tbl-wrap rl-tw"><table class="rl-tbl"><caption class="vh">Trials for ' + esc(MV.plain(r.eq)) + '</caption><thead><tr><th scope="col">Trial</th>' + r.sp.map(function(sp){ return '<th scope="col">[' + sp + "] (mol/L)</th>"; }).join("") + '<th scope="col">Initial rate (mol/(L·s))</th></tr></thead><tbody>';
    if (!T.length) h += '<tr><td colspan="' + (r.sp.length + 2) + '" class="muted">No trials yet. Press Run trial.</td></tr>';
    T.forEach(function(cs, i){
      var on = sel.indexOf(i) >= 0;
      h += '<tr' + (on ? ' class="on"' : "") + '><th scope="row"><button type="button" class="rl-tsel" aria-pressed="' + on + '" data-tr="' + i + '" data-k="tr-' + i + '"' + (busy ? " disabled" : "") + ">Trial " + (i + 1) + "</button></th>" + cs.map(function(c){ return "<td>" + f2(c) + "</td>"; }).join("") + "<td>" + sci(rateOf(r, cs)) + "</td></tr>";
    });
    return h + "</tbody></table></div>";
  }
  function ratesMain(){
    var r = cur(), cs = S.c[r.id];
    var h = '<div class="rl-conc">' + r.sp.map(function(sp, i){ return sliderHTML(sp, i, cs[i]); }).join("") + "</div>";
    if (S.mode === "check") h += '<div class="rl-pred"><label class="rl-in">Your predicted rate <input type="text" class="numin rl-num" inputmode="decimal" autocomplete="off" data-in="pred" data-k="pred" value="' + esc(S.pred[r.id] || "") + '"' + (busy ? " disabled" : "") + "> mol/(L·s)</label></div>";
    h += '<div class="rl-acts">' + (S.mode === "check" ? btn("runchk", "Run to check", "primary") : btn("run", "Run trial", "primary")) + btn("clear", "Clear trials") + "</div>";
    h += tableHTML(r);
    if (S.mode === "rates") h += '<h4 class="rl-h4">Comparison</h4><dl class="read rl-cmp' + (flash ? " rl-flash" : "") + '">' + MV.readoutHTML(cmpRows(r)) + "</dl>";
    if (unitsN) {
      var U = ["(mol/(L·s)) ÷ (mol/L)²", "= (mol/(L·s)) × (L²/mol²)", "= L/(mol·s)"];
      h += '<div class="rl-units" aria-label="Units of k">' + U.slice(0, unitsN).map(function(u, i){ return '<p class="rl-u' + (i === 2 ? " rl-uend" : "") + '">' + (i === 0 ? KI + " = rate ÷ [X]²: " : "") + u + "</p>"; }).join("") + "</div>";
    }
    return h;
  }
  function rateRows(){
    var r = cur(), fi = fitInfo(r);
    return [[RD.rx, r.eq], [RD.n, String(S.tr[r.id].length)], [RD.law, lawText(r.sp, S.ord[r.id])],
      [RD.k, fi ? sci(fi.k) + " " + unitsOf(fi.ov) : '<span class="muted">Choose every order and run a trial</span>'],
      [RD.fit, fi ? fi.n + " of " + fi.of : '<span class="muted">—</span>']];
  }
  function sideHTML(){
    var r = cur(), o = S.ord[r.id];
    var h = '<h4 class="rl-h4">Your orders</h4>' + r.sp.map(function(sp, i){ return chipRow("ord-" + i, "Order in [" + sp + "]", ORD, o[i], busy); }).join("");
    if (S.mode === "rates") h += '<h4 class="rl-h4">Your ' + KI + '</h4><div class="rl-cr"><label class="rl-in">' + KI + ' = <input type="text" class="numin rl-num" inputmode="decimal" autocomplete="off" data-in="kv" data-k="kv" value="' + esc(S.kIn[r.id] || "") + '"' + (busy ? " disabled" : "") + "></label></div>" + chipRow("ku", "Units", C.units, S.kU[r.id], busy);
    return h;
  }
  // mechanism mode
  function mechData(){
    if (S.mech === "r4") return { steps:C.r4mech.steps, slow:S.slow4, overall:C.r4mech.overall, exp:C.r4mech.exp, build:false };
    return { steps:S.bm.map(function(id){ return CARD[id].s; }), slow:S.bslow, overall:C.build.overall, exp:C.build.exp, build:true };
  }
  function stepHTML(s, an, si){
    function one(p, side){
      var cls = an.cats.indexOf(p[0]) >= 0 ? " rl-cat" : an.ints.indexOf(p[0]) >= 0 ? " rl-int" : "", g = glow[si + side + p[0]];
      return '<span class="rl-spc' + cls + (g ? " rl-" + g : "") + '">' + spHTML(p) + "</span>";
    }
    return s.l.map(function(p){ return one(p, "l"); }).join(" + ") + " → " + s.r.map(function(p){ return one(p, "r"); }).join(" + ");
  }
  function mechMain(){
    var d = mechData(), an = analyse(d.steps, d.slow, d.overall, d.exp), h = '<p class="rl-ov"><strong>Overall:</strong> ' + eqTxt(d.overall) + "</p>";
    if (d.build) h += '<div class="rl-pal"><span class="rl-crl">Step cards (tap to add)</span><div class="rl-cards">' + C.build.cards.map(function(c){ return '<button type="button" class="rl-card" data-act="add" data-card="' + c.id + '" data-k="add-' + c.id + '"' + (busy ? " disabled" : "") + "><strong>" + c.id + "</strong> " + eqTxt(c.s) + "</button>"; }).join("") + "</div></div>";
    h += '<ol class="rl-steps">' + d.steps.map(function(s, i){
      var tag = i === d.slow ? " (slow)" : d.slow >= 0 ? " (fast)" : "";
      var ctl = d.build ? '<span class="rl-stc">' + '<button type="button" class="btn ghost sm" data-act="up" data-i="' + i + '" data-k="up-' + i + '"' + (i === 0 || busy ? " disabled" : "") + ' aria-label="Move step ' + (i + 1) + ' up">Move up</button><button type="button" class="btn ghost sm" data-act="down" data-i="' + i + '" data-k="down-' + i + '"' + (i === d.steps.length - 1 || busy ? " disabled" : "") + ' aria-label="Move step ' + (i + 1) + ' down">Move down</button><button type="button" class="btn ghost sm" data-act="rm" data-i="' + i + '" data-k="rm-' + i + '"' + (busy ? " disabled" : "") + ' aria-label="Remove step ' + (i + 1) + '">Remove</button></span>' : "";
      return '<li class="rl-step' + (i === d.slow ? " rl-slow" : "") + '"><span class="rl-stn">Step ' + (i + 1) + tag + (d.build ? " · " + S.bm[i] : "") + '</span><span class="rl-eq">' + stepHTML(s, an, i) + "</span>" + ctl + "</li>";
    }).join("") + "</ol>";
    if (!d.steps.length) h += '<p class="tiny muted">No steps yet: tap a card to add it.</p>';
    if (d.steps.length) h += chipRow(d.build ? "bslow" : "slow4", "Slow step", d.steps.map(function(_, i){ return { id:i, t:"Step " + (i + 1) }; }), d.slow >= 0 ? d.slow : null, busy);
    h += energySVG(d.steps.length, d.slow);
    h += '<div class="rl-acts">' + btn("chkmech", "Check mechanism", "primary", busy ? " disabled" : "") + "</div>";
    return h;
  }
  function mechRows(){
    var d = mechData(), an = analyse(d.steps, d.slow, d.overall, d.exp), yes = function(b){ return b ? "yes" : "no"; };
    var law = !an.law ? '<span class="muted">Mark the slow step</span>' : slowLaw(an.law) + (an.hasInt ? " (contains an intermediate)" : "");
    return [[RD.exp, slowLaw(d.exp)], [RD.add, d.steps.length ? yes(an.adds) : "—"], [RD.ints, an.ints.length ? '<span class="rl-int">' + an.ints.join(", ") + "</span>" : "none"],
      [RD.cats, an.cats.length ? '<span class="rl-cat">' + an.cats.join(", ") + "</span>" : "none"], [RD.slow, law], [RD.match, an.law ? yes(an.adds && an.match) : "—"]];
  }
  function evalBuild(){
    var t = m.tc3, ids = S.bm, sl = S.bslow;
    if (ids.length < 2) return { ok:false, msg:t.need2 };
    if (sl < 0 || sl >= ids.length) return { ok:false, msg:t.slow };
    var key = ids.join("+");
    if (key === "S1+S2") return sl === 0 ? { ok:true } : { ok:false, msg:t.s12 };
    if (key === "S3+S4") return sl === 0 ? { ok:false, msg:t.s34 } : { ok:false, msg:t.inter + " Here the slow step contains A₂, an intermediate." };
    if (key === "S2+S1" || key === "S4+S3") return { ok:false, msg:t.order };
    if (ids.indexOf("S1") >= 0 && ids.indexOf("S4") >= 0) return { ok:false, msg:t.s14 };
    var d = mechData(), an = analyse(d.steps, sl, d.overall, d.exp);
    if (!an.adds) return { ok:false, msg:t.sum };
    if (an.hasInt) return { ok:false, msg:t.inter };
    return { ok:false, msg:t.nomatch };
  }

  function paint(){
    MV.keepFocus(host, function(){
      topEl.innerHTML = chipRow("mode", "Mode", C.modes, S.mode, busy, "seg") +
        (S.mode === "mech" ? chipRow("mech", "Mechanism", C.mechs, S.mech, busy) : chipRow("rx", "Reaction", RX.map(function(r){ return { id:r.id, t:r.t + ": " + r.eq }; }), S.rx, busy));
      mainEl.innerHTML = S.mode === "mech" ? mechMain() : ratesMain();
      readEl.innerHTML = MV.readoutHTML(S.mode === "mech" ? mechRows() : rateRows());
      sideEl.innerHTML = S.mode === "mech" ? "" : sideHTML();
      fbEl.innerHTML = fb ? MV.fbHTML(fb.k, fb.h) : "";
    });
  }
  function commit(){ api.save(); paint(); MV.changed(); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    var r = cur();
    if (b.dataset.rgk) {
      var k = b.dataset.rgk, v = b.dataset.rgv; fb = null;
      if (k === "mode") { S.mode = v; capEl.textContent = ""; unitsN = 0; }
      else if (k === "rx") { S.rx = v; capEl.textContent = ""; unitsN = 0; }
      else if (k === "mech") S.mech = v;
      else if (k === "ku") S.kU[r.id] = v;
      else if (k === "slow4") S.slow4 = +v;
      else if (k === "bslow") S.bslow = +v;
      else if (k.indexOf("ord-") === 0) S.ord[r.id][+k.slice(4)] = +v;
      commit(); return;
    }
    if (b.dataset.tr != null) {
      var i = +b.dataset.tr, sel = S.sel[r.id], at = sel.indexOf(i);
      if (at >= 0) sel.splice(at, 1); else { sel.push(i); if (sel.length > 2) sel.shift(); }
      fb = null; commit(); return;
    }
    var act = b.dataset.act; if (!act) return;
    fb = null;
    if (act === "run") { var n = addTrial(r.id, S.c[r.id], true); if (n >= 0 && !fb) capEl.textContent = "Trial " + (n + 1) + ": initial rate " + sci(rateOf(r, S.tr[r.id][n])) + " mol/(L·s)."; }
    else if (act === "clear") { S.tr[r.id] = []; S.sel[r.id] = []; capEl.textContent = "Trials cleared."; }
    else if (act === "runchk") {
      var fi = fitInfo(r), p = parseSci(S.pred[r.id]);
      if (!fi) fb = { k:"", h:m.needLaw };
      else if (p == null) fb = { k:"", h:m.needPred };
      else {
        var cs = S.c[r.id].slice(), actual = rateOf(r, cs), idx = addTrial(r.id, cs, false);
        var conc = r.sp.map(function(sp, j){ return "[" + sp + "] = " + f2(cs[j]); }).join(", ");
        if (near(p, actual, 0.02)) fb = { k:"good", h:"<strong>✓ Your prediction matches.</strong> Trial " + (idx + 1) + " (" + conc + "): measured " + sci(actual) + " mol/(L·s); you predicted " + sci(p) + "." };
        else fb = { k:"bad", h:"<strong>✗ Not quite.</strong> Trial " + (idx + 1) + " (" + conc + "): measured " + sci(actual) + " mol/(L·s); you predicted " + sci(p) + ". " + (fi.n < fi.of ? "Your rate law doesn’t fit every trial yet." : "Use your rate law: multiply " + KI + " by each concentration raised to its order.") };
      }
    }
    else if (act === "add") { if (S.bm.length >= 2) fb = { k:"", h:m.maxSteps }; else S.bm.push(b.dataset.card); }
    else if (act === "up" || act === "down" || act === "rm") {
      var j = +b.dataset.i, sl = S.bslow;
      if (act === "rm") { S.bm.splice(j, 1); S.bslow = sl === j ? -1 : sl > j ? sl - 1 : sl; }
      else { var t = act === "up" ? j - 1 : j + 1; if (t < 0 || t >= S.bm.length) return; var x = S.bm[j]; S.bm[j] = S.bm[t]; S.bm[t] = x; S.bslow = sl === j ? t : sl === t ? j : sl; }
    }
    else if (act === "chkmech") {
      if (S.mech === "build") { var ev = evalBuild(); fb = ev.ok ? { k:"good", h:"<strong>✓ It fits.</strong> " + C.challenges[2].why } : { k:"bad", h:"<strong>✗ Not yet.</strong> " + ev.msg }; }
      else {
        var d = mechData(), an = analyse(d.steps, d.slow, d.overall, d.exp);
        fb = an.adds && an.match ? { k:"good", h:"<strong>✓ It fits.</strong> The steps add up to " + eqTxt(d.overall) + ". I⁻ is the catalyst and IO⁻ is the intermediate; the slow step gives " + slowLaw(an.law) + ", which matches." }
          : { k:"bad", h:"<strong>✗ Not yet.</strong> Step 2’s rate law would contain IO⁻, an intermediate you can’t add to the flask. " + m.tc3.inter };
      }
    }
    commit();
  });
  host.addEventListener("input", function(e){
    var el = e.target, r = cur();
    if (el.dataset.sl != null) {
      var i = +el.dataset.sl, v = C.concs[+el.value - 1]; S.c[r.id][i] = v;
      var o = host.querySelector('[data-out="' + i + '"]'); if (o) o.textContent = f2(v);
      el.setAttribute("aria-valuetext", f2(v) + " mol/L"); api.save(); MV.changed(); return;
    }
    if (el.dataset.in === "pred") { S.pred[r.id] = el.value; api.save(); return; }
    if (el.dataset.in === "kv") { S.kIn[r.id] = el.value; api.save(); MV.changed(); }
  });
  rgKeys(host);
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-tr]"); if (!b) return;
    var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(host.querySelectorAll("[data-tr]")), nx = all[all.indexOf(b) + d]; if (nx) nx.focus();
  });

  // predictions
  var hooks = {
    start:function(p){
      fb = null; unitsN = 0; glow = {}; flash = false; capEl.textContent = C.predSetup[p.id] || "";
      if (p.id === "p1") { S.mode = "rates"; S.rx = "r3"; S.c.r3 = [0.10, 0.10]; S.sel.r3 = []; }
      else if (p.id === "p2") { S.mode = "rates"; S.rx = "r1"; S.c.r1 = [0.10, 0.10]; S.sel.r1 = []; }
      else if (p.id === "p3") { S.mode = "rates"; S.rx = "r2"; }
      else { S.mode = "mech"; S.mech = "r4"; S.slow4 = 0; }
      busy = true; api.save(); paint();
    },
    run:function(p, done){
      function end(msg){ busy = false; glow = {}; capEl.textContent = msg; api.save(); paint(); flash = false; MV.changed(); done(); }
      function pair(rid, b, msg){
        MV.wait(400, function(){
          var i = addTrial(rid, [0.10, 0.10], false); capEl.textContent = "Trial at " + byId[rid].sp.map(function(s){ return "[" + s + "] = 0.10"; }).join(", ") + "."; paint();
          MV.wait(900, function(){ S.c[rid] = b; var j = addTrial(rid, b, false); S.sel[rid] = [i, j]; flash = true; end(msg); });
        });
      }
      if (p.id === "p1") { pair("r3", [0.10, 0.20], "Two rows: 3.0 × 10⁻³ and 3.0 × 10⁻³ mol/(L·s). Doubling [Q] changed nothing."); return; }
      if (p.id === "p2") { pair("r1", [0.10, 0.20], "The comparison panel: rate × 4 = 2² when only [B] doubled, so the order in B is 2."); return; }
      if (p.id === "p3") {
        var n = 0;
        (function more(){ n++; unitsN = n; paint(); if (n < 3) MV.wait(900, more); else end("Second order overall: " + "k is in L/(mol·s)."); })();
        return;
      }
      var G = [
        [{ "0lI⁻":"glow" }, "I⁻ is used in step 1."],
        [{ "0lI⁻":"glow", "0rIO⁻":"appear" }, "IO⁻ is made in step 1…"],
        [{ "0rIO⁻":"fade", "1lIO⁻":"fade" }, "…and used up in step 2: an intermediate."],
        [{ "0lI⁻":"glow", "1rI⁻":"glow" }, "I⁻ is made again at the end of step 2: the catalyst."]
      ], k = 0;
      (function nx(){
        if (k >= G.length) { end("I⁻ is used in step 1 and remade in step 2: the catalyst. IO⁻ is made, then used up: an intermediate."); return; }
        glow = G[k][0]; capEl.textContent = G[k][1]; k++; paint(); MV.wait(1100, nx);
      })();
    }
  };

  function chal(id){
    var t;
    if (id === "tc1") {
      t = m.tc1; var T = S.tr.r1, o = S.ord.r1;
      if (!T.length) return { ok:false, msg:t.none };
      if (o[0] == null || o[1] == null) return { ok:false, msg:t.orders };
      if (o[1] === 4) return { ok:false, msg:t.four };
      if (o[0] === 2 && o[1] === 1) return { ok:false, msg:t.swap };
      if (!(o[0] === 1 && o[1] === 2)) return { ok:false, msg:t.wrong };
      if (T.length > 3) return { ok:false, msg:t.tooMany };
      var pa = false, pb = false;
      for (var i = 0; i < T.length; i++) for (var j = i + 1; j < T.length; j++) {
        if (T[i][1] === T[j][1] && T[i][0] !== T[j][0]) pa = true;
        if (T[i][0] === T[j][0] && T[i][1] !== T[j][1]) pb = true;
      }
      return pa && pb ? { ok:true } : { ok:false, msg:t.pairs };
    }
    if (id === "tc2") {
      t = m.tc2; var raw = S.kIn.r2, u = S.kU.r2, v = parseSci(raw);
      if (v == null) return { ok:false, msg:t.empty };
      if (near(v, 0.050)) return { ok:false, msg:t.tenth };
      if (near(v, 5.0e-3)) return { ok:false, msg:t.rate };
      if (!near(v, 0.50)) return { ok:false, msg:t.wrong };
      if (!u) return { ok:false, msg:t.unit };
      if (u === "1") return { ok:false, msg:t.first };
      if (u !== "2") return { ok:false, msg:t.units };
      return { ok:true };
    }
    return evalBuild();
  }
  paint();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Mechanism detective ----------
function ballSVG(x, y, el, r, lab){
  var c = MV.chem.atom(el);
  return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" fill="' + c.fill + '"' + (el === "H" ? ' stroke="' + c.line + '" stroke-width="1.5"' : "") + "/>" + T(x, y, lab || el, { fs:r > 10 ? 12 : 10, w:700, c:c.ink });
}
function zoomSVG(t){
  // H₂O₂ from the left meets I⁻ from the right at t = 0.5; then H₂O flies up-left and IO⁻ down-right
  var h = "", a = Math.min(1, t * 2), b = Math.max(0, (t - 0.5) * 2);
  if (t < 0.5) {
    var hx = 60 + 130 * a, ix = 380 - 140 * a;
    h += ballSVG(hx - 30, 66, "H", 8) + ballSVG(hx - 12, 75, "O", 12) + ballSVG(hx + 12, 75, "O", 12) + ballSVG(hx + 30, 84, "H", 8);
    h += ballSVG(ix, 75, "I", 16, "I⁻");
    h += T(hx, 112, "H₂O₂", { fs:12 }) + T(ix, 112, "I⁻", { fs:12 });
  } else {
    var wx = 200 - 90 * b, wy = 75 - 30 * b, ox = 232 + 90 * b, oy = 75 + 25 * b;
    h += ballSVG(wx - 18, wy + 8, "H", 8) + ballSVG(wx, wy, "O", 12) + ballSVG(wx + 18, wy + 8, "H", 8) + T(wx, wy + 30, "H₂O", { fs:12 });
    h += ballSVG(ox, oy, "I", 16, "I") + ballSVG(ox + 25, oy, "O", 12) + T(ox + 12, oy + 30, "IO⁻", { fs:12 });
    if (b < 0.6) h += T(216, 22, "collision!", { fs:13, w:700, c:"var(--ink-2)", op:1 - b });
  }
  return h;
}
function cycleSVG(f){
  var h = '<path d="M95,48 Q180,0 265,48" fill="none" stroke="var(--ink-2)" stroke-width="2"/><path d="M257,40 L267,50 L253,52" fill="none" stroke="var(--ink-2)" stroke-width="2"/>' +
    '<path d="M265,92 Q180,140 95,92" fill="none" stroke="var(--ink-2)" stroke-width="2"/><path d="M103,100 L93,90 L107,88" fill="none" stroke="var(--ink-2)" stroke-width="2"/>';
  h += ballSVG(75, 70, "Cl", 20, "Cl") + '<g>' + ballSVG(270, 70, "Cl", 18, "Cl") + ballSVG(298, 70, "O", 13, "O") + "</g>";
  h += T(180, 14, "+ O₃ → O₂ out", { fs:12 }) + T(180, 128, "+ O → O₂ out", { fs:12 }) + T(75, 104, "Cl (catalyst)", { fs:11, c:"var(--en-cat)" }) + T(284, 104, "ClO (intermediate)", { fs:11, it:true, c:"var(--ink-2)" });
  if (f != null) {
    var th = f * Math.PI * 2, x, y;
    if (f < 0.5) { var u = f * 2; x = (1 - u) * (1 - u) * 95 + 2 * (1 - u) * u * 180 + u * u * 265; y = (1 - u) * (1 - u) * 48 + 2 * (1 - u) * u * 0 + u * u * 48; }
    else { var w = (f - 0.5) * 2; x = (1 - w) * (1 - w) * 265 + 2 * (1 - w) * w * 180 + w * w * 95; y = (1 - w) * (1 - w) * 92 + 2 * (1 - w) * w * 140 + w * w * 92; }
    h += '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="6" fill="var(--hi)" stroke="var(--ink)" stroke-width="1.2"/>';
    void th;
  }
  return h;
}
// @component C3 mechanismStepper (cancel-and-label variant) — steps as tappable species; species on both sides cancel,
// the overall equation appears, then "intermediate" / "catalyst" labels are placed by tapping a label, then a species.
function cancelStation(el, cfg, st, save){
  var an = analyse(cfg.steps, -1, { l:[], r:[] }, []), both = an.ints.concat(an.cats), msg = null;
  st.x = st.x || {}; st.lab = st.lab || {};
  function side(name){ var L = cfg.steps.some(function(s){ return s.l.some(function(p){ return p[0] === name; }); }), R = cfg.steps.some(function(s){ return s.r.some(function(p){ return p[0] === name; }); }); return L && R ? "both" : L ? "left" : "right"; }
  function allX(){ return both.every(function(s){ return st.x[s]; }); }
  function role(s){ return an.ints.indexOf(s) >= 0 ? "intermediate" : an.cats.indexOf(s) >= 0 ? "catalyst" : ""; }
  function done(){ return both.every(function(s){ return st.lab[s] === role(s); }); }
  function sp(p, si, sd){
    var n = p[0], x = st.x[n], lb = st.lab[n], cls = x ? " rl-x" : "";
    if (lb) cls += lb === "catalyst" ? " rl-cat" : " rl-int";
    return '<button type="button" class="rl-sp' + cls + '" data-sp="' + esc(n) + '" data-k="sp-' + si + sd + esc(n) + '" aria-label="' + esc(n + (x ? ", cancelled" : "") + (lb ? ", " + lb : "")) + '">' + spHTML(p) + (lb ? '<span class="rl-badge">' + lb + "</span>" : "") + "</button>";
  }
  function paint(){
    MV.keepFocus(el, function(){
      var h = '<ol class="rl-steps">' + cfg.steps.map(function(s, i){
        return '<li class="rl-step' + (cfg.slow === i ? " rl-slow" : "") + '"><span class="rl-stn">Step ' + (i + 1) + (cfg.slow == null ? "" : cfg.slow === i ? " (slow)" : " (fast)") + '</span><span class="rl-eq">' + s.l.map(function(p){ return sp(p, i, "l"); }).join(" + ") + " → " + s.r.map(function(p){ return sp(p, i, "r"); }).join(" + ") + "</span></li>";
      }).join("") + "</ol>";
      h += allX() ? '<p class="rl-ov"><strong>Overall:</strong> ' + netEq(an) + "</p>" : '<p class="tiny muted">Cancelled so far: ' + (both.filter(function(s){ return st.x[s]; }).join(", ") || "none") + "</p>";
      h += chipRow("lab", "Label", [{ id:"intermediate", t:"intermediate" }, { id:"catalyst", t:"catalyst" }], st.pick || null, !allX() || done());
      if (done()) h += MV.fbHTML("good", "<strong>✓ Done.</strong> " + an.cats.join(", ") + " is the catalyst: used, then made again. " + an.ints.join(", ") + " is the intermediate: made, then used up.");
      else if (msg) h += MV.fbHTML(msg.k, msg.h);
      el.innerHTML = h;
    });
  }
  el.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.rgk === "lab") { st.pick = b.dataset.rgv; msg = { k:"", h:"Now tap the species that is the " + st.pick + "." }; save(); paint(); return; }
    var n = b.dataset.sp; if (n == null || done()) return;
    if (!allX()) {
      if (st.x[n]) msg = { k:"", h:n + " is already cancelled." };
      else if (both.indexOf(n) >= 0) { st.x[n] = true; msg = { k:"good", h:n + " cancels: it appears on both sides." }; }
      else { var sd = side(n); msg = { k:"bad", h:sd === "both" ? n + " doesn’t cancel completely." : n + " appears only on the " + sd + " side, so it stays in the overall equation." }; }
    } else if (!st.pick) msg = { k:"", h:"Tap a label first: intermediate or catalyst." };
    else if (both.indexOf(n) < 0) msg = { k:"bad", h:"Only species that cancel can be intermediates or catalysts. " + n + " stays in the overall equation." };
    else if (role(n) === st.pick) { st.lab[n] = st.pick; st.pick = ""; msg = { k:"good", h:"Right: " + n + " is the " + role(n) + "." }; }
    else msg = { k:"bad", h:"<strong>✗ Not quite.</strong> An intermediate is made, then used up. A catalyst is used, then made again. Look where " + n + " first appears." };
    save(); paint(); MV.changed();
  });
  rgKeys(el);
  paint();
}
function part3(host, api){
  var C = api.content, S = api.S, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  ["st1", "st2", "s3"].forEach(function(k){ if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
  host.innerHTML =
    '<div class="rl-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="rl-c1"></div>' +
    '<details class="alg rl-zoom"><summary>' + s1.zoom + '</summary><svg class="rl-zsvg" viewBox="0 0 440 130" role="img" aria-label="One H₂O₂ molecule moves in from the left and one I⁻ ion from the right. They collide, and H₂O and IO⁻ fly apart."></svg>' +
    '<div class="rl-acts"><button type="button" class="btn ghost sm rl-zplay" data-k="zplay">Play the collision</button></div><p>' + s1.zoomText + "</p></details></div>" +
    '<div class="part rl-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="rl-c2"></div>' +
    '<svg class="rl-csvg" viewBox="0 0 360 140" role="img" aria-label="A cycle: Cl reacts with O₃ to give ClO and O₂; ClO reacts with O to give Cl back and O₂. The Cl atom goes round and round."></svg>' +
    '<div class="rl-acts"><button type="button" class="btn primary sm rl-crun" data-k="crun">' + s2.run + '</button></div><p class="rl-count" aria-live="polite"></p>' + s2.html + "</div>" +
    '<div class="part rl-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="rl-c3"></div></div>';
  cancelStation($(".rl-c1", host), s1, S.st1, function(){ api.save(); });
  cancelStation($(".rl-c2", host), s2, S.st2, function(){ api.save(); });

  // zoom to the particles
  var zsvg = $(".rl-zsvg", host), ztw = null;
  zsvg.innerHTML = zoomSVG(1);
  $(".rl-zplay", host).addEventListener("click", function(){
    if (ztw) { ztw(); ztw = null; }
    if (MV.reduceMotion) { zsvg.innerHTML = zoomSVG(1); return; }
    ztw = MV.tween({ dur:2200, step:function(t){ zsvg.innerHTML = zoomSVG(t); }, done:function(){ ztw = null; zsvg.innerHTML = zoomSVG(1); } });
  });

  // Station 2 cycle counter
  var csvg = $(".rl-csvg", host), cnt = $(".rl-count", host), crun = $(".rl-crun", host), ctw = null;
  function countText(n, end){ return end ? "1 Cl atom: many cycles. It comes out unchanged every time, so it keeps going." : "1 Cl atom · cycles: " + n + " · O₃ molecules destroyed: " + n; }
  csvg.innerHTML = cycleSVG(null);
  cnt.textContent = S.cyc ? countText(0, true) : countText(0);
  crun.addEventListener("click", function(){
    if (ctw) return;
    if (MV.reduceMotion) { S.cyc = true; api.save(); cnt.textContent = countText(0, true); return; }
    crun.disabled = true;
    ctw = MV.tween({ dur:3600, step:function(t){ var c = t * t * 1000; cnt.textContent = countText(Math.floor(c)); csvg.innerHTML = cycleSVG(c - Math.floor(c)); },
      done:function(){ ctw = null; crun.disabled = false; S.cyc = true; api.save(); csvg.innerHTML = cycleSVG(null); cnt.textContent = countText(1000) + ". " + countText(0, true); } });
  });

  // Station 3: which mechanism fits?
  var c3 = $(".rl-c3", host), YN = [{ id:"y", t:"Yes" }, { id:"n", t:"No" }], m3 = {};
  function st3(id){ return S.s3[id] || (S.s3[id] = { a:null, m:null, done:false }); }
  function paint3(){
    MV.keepFocus(c3, function(){
      var all = s3.cands.every(function(c){ return st3(c.id).done; });
      c3.innerHTML = '<div class="rl-cands">' + s3.cands.map(function(c){
        var x = st3(c.id);
        return '<div class="q rl-cand" data-cd="' + c.id + '"><h4 class="rl-h4">' + c.t + '</h4><ul class="rl-csteps">' + c.steps.map(function(s){ return "<li>" + s + "</li>"; }).join("") + "</ul>" +
          chipRow("a-" + c.id, s3.rules[0] + "?", YN, x.a, x.done) + chipRow("m-" + c.id, s3.rules[1] + "?", YN, x.m, x.done) +
          (x.done ? MV.fbHTML("good", "<strong>✓</strong> " + c.fb) : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="c3" data-k="c3-' + c.id + '">Check</button></div>' + (m3[c.id] ? MV.fbHTML(m3[c.id].k, m3[c.id].h) : "")) + "</div>";
      }).join("") + "</div>" + (all ? MV.fbHTML("good", s3.done) : "");
    });
  }
  c3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-cd]"); if (!box) return;
    var c = s3.cands.filter(function(q){ return q.id === box.dataset.cd; })[0], x = st3(c.id);
    if (b.dataset.rgk) { if (b.dataset.rgk.charAt(0) === "a") x.a = b.dataset.rgv; else x.m = b.dataset.rgv; m3[c.id] = null; api.save(); paint3(); return; }
    if (b.dataset.act === "c3") {
      var ans = MV.ans(c);
      if (!x.a || !x.m) m3[c.id] = { k:"", h:"Answer both questions first." };
      else if (x.a !== ans[0]) m3[c.id] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + s3.addWrong };
      else if (x.m !== ans[1]) m3[c.id] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + s3.matchWrong };
      else { x.done = true; m3[c.id] = null; }
      api.save(); paint3(); MV.focusFb(box); MV.changed();
    }
  });
  rgKeys(c3);
  paint3();
  return {};
}

// ---------- Practice: orders, k with units, number entry and chips (custom items) ----------
function itemAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, U = a.units;
  function ist(id){ return S.items[id] || (S.items[id] = { v:{}, u:null, pick:null, alt:false, tries:0, hint:0, solved:false, first:null }); }
  function inp(it, key, label, x, dis, unit){
    return '<label class="rl-in">' + label + ' <input type="text" class="numin rl-num" inputmode="decimal" autocomplete="off" data-in="' + esc(key) + '" data-k="' + it.id + "-" + esc(key) + '" value="' + esc(x.v[key] || "") + '"' + dis + ">" + (unit ? " " + unit : "") + "</label>";
  }
  function body(it, x){
    var dis = x.solved ? " disabled" : "";
    if (it.kind === "ord") return '<div class="rl-ins">' + it.sp.map(function(sp){ return inp(it, sp, "Order in [" + sp + "]:", x, dis); }).join("") + "</div>";
    if (it.kind === "k") return '<div class="rl-ins">' + inp(it, "v", KI + " =", x, dis) + "</div>" + chipRow(it.id + "-u", "Units", U, x.u, x.solved);
    if (it.kind === "units") return chipRow(it.id + "-u", "Units of " + KI, U, x.u, x.solved);
    if (it.kind === "num") return '<div class="rl-ins">' + inp(it, "v", "Answer:", x, dis, it.unit || "") + (it.alt ? '<button type="button" class="chip' + (x.alt ? " on" : "") + '" aria-pressed="' + x.alt + '" data-alt="1" data-k="' + it.id + '-alt"' + dis + ">" + it.alt.t + "</button>" : "") + "</div>";
    return '<div class="chips rl-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" tabindex="' + (on || (x.pick == null && k === 0) ? 0 : -1) + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
  }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.table) h += MV.tableHTML({ head:it.table.head, rows:it.table.rows, caption:it.table.title });
    h += body(it, x);
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (it.kind === "choice" ? (it.options[x.pick].why || "") : it.why) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(itemHTML).join(""); }); }
  // returns null (correct), {soft, t} or {t}
  function judge(it, x){
    var ans = MV.ans(it), W = it.wrong || [], hit;
    if (it.kind === "ord") {
      var vals = {}, miss = false;
      it.sp.forEach(function(sp){ var v = parseSci(x.v[sp]); if (v == null) miss = true; vals[sp] = v; });
      if (miss) return { soft:true, t:"Enter a number for each order." };
      if (it.sp.every(function(sp, i){ return vals[sp] === ans[i]; })) return null;
      hit = W.filter(function(w){ return w.at && Object.keys(w.at).every(function(sp){ return vals[sp] === w.at[sp]; }); })[0];
      return { t:hit ? hit.fb : "Compare two trials where only that concentration changes; the order is the exponent." };
    }
    if (it.kind === "k") {
      var kv = parseSci(x.v.v);
      if (kv == null) return { soft:true, t:"Type a number for " + KI + ", e.g. 0.25 or 2.5e-3." };
      if (!x.u) return { soft:true, t:"Choose the units of " + KI + " too." };
      if (near(kv, ans.v) && x.u === ans.u) return null;
      if (!near(kv, ans.v)) { hit = W.filter(function(w){ return w.v != null && near(kv, w.v); })[0]; return { t:hit ? hit.fb : "Substitute one trial into the rate law and solve for " + KI + "." }; }
      hit = W.filter(function(w){ return w.u === x.u; })[0];
      return { t:hit ? hit.fb : "Right value; check the units. The overall order sets them." };
    }
    if (it.kind === "units") {
      if (!x.u) return { soft:true, t:"Choose the units first." };
      if (x.u === ans) return null;
      hit = W.filter(function(w){ return w.u === x.u; })[0];
      return { t:hit ? hit.fb : "Add the exponents to find the overall order." };
    }
    if (it.kind === "num") {
      if (x.alt) return { t:it.alt.fb };
      var v = parseSci(x.v.v);
      if (v == null) return { soft:true, t:"Type a number, e.g. 0.25, 2.5e-3 or 2.5 × 10^-3." };
      if (near(v, ans)) return null;
      hit = W.filter(function(w){ return w.v != null && near(v, w.v); })[0];
      return { t:hit ? hit.fb : "Check each factor against the rate law." };
    }
    if (x.pick == null) return { soft:true, t:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? null : { t:it.options[x.pick].why };
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-bi]"); if (!bx) return;
    var it = a.items.filter(function(q){ return q.id === bx.dataset.bi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.rgk) { x.u = b.dataset.rgv; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.alt) { x.alt = !x.alt; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (!r) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (!r.soft) x.tries++; msgs[it.id] = r; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-bi="' + it.id + '"]')); MV.changed();
    }
  });
  host.addEventListener("input", function(e){
    var el = e.target; if (el.dataset.in == null) return;
    var bx = el.closest("[data-bi]"); if (!bx) return;
    var x = ist(bx.dataset.bi); x.v[el.dataset.in] = el.value; if (el.dataset.in === "v") x.alt = false; api.save();
  });
  rgKeys(host);
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-op]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(b.parentNode.querySelectorAll("[data-op]")), nx = all[(all.indexOf(b) + d + all.length) % all.length]; nx.click();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Plan the trials (3 × 3 grid, tap three) ----------
var task = (function(){
  var S = null, api = null, TK = null, inpEl = null, pvEl = null;
  function fmt(p){ TK = TK || MV.C.task; return "(" + f2(TK.inputs.vals[p[0]]) + ", " + f2(TK.inputs.vals[p[1]]) + ")"; }
  function read(){ var t = (S && Array.isArray(S.t) ? S.t : []).map(function(s){ return s.split("|").map(Number); }); t.sort(function(p, q){ return p[0] - q[0] || p[1] - q[1]; }); return { t:t }; }
  function lines(t){
    var l1 = false, l2 = false;
    for (var i = 0; i < t.length; i++) for (var j = i + 1; j < t.length; j++) {
      if (t[i][1] === t[j][1] && t[i][0] !== t[j][0]) l1 = true;
      if (t[i][0] === t[j][0] && t[i][1] !== t[j][1]) l2 = true;
    }
    var ref = t.some(function(p){ return p[0] === 0 && p[1] === 0; });
    var l3 = ref && t.some(function(p){ return p[1] === 0 && p[0] !== 0; }) && t.some(function(p){ return p[0] === 0 && p[1] !== 0; });
    return [l1, l2, l3];
  }
  function paintGrid(msg){
    var I = TK.inputs, on = {}; (S.t || []).forEach(function(s){ on[s] = true; });
    MV.keepFocus(inpEl, function(){
      inpEl.innerHTML = '<p class="rl-crl">' + I.grid + '</p><table class="rl-grid3"><caption class="vh">' + I.grid + '</caption><thead><tr><th scope="col"><span class="vh">[A] down, [B] across</span></th>' + I.vals.map(function(v){ return '<th scope="col">[B] = ' + f2(v) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        I.vals.map(function(va, ia){ return '<tr><th scope="row">[A] = ' + f2(va) + "</th>" + I.vals.map(function(vb, ib){ var k = ia + "|" + ib, p = !!on[k]; return '<td><button type="button" class="rl-cell' + (p ? " on" : "") + '" aria-pressed="' + p + '" data-cell="' + k + '" data-k="cell-' + k + '">' + fmt([ia, ib]) + "</button></td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table>" + (msg ? MV.fbHTML("", msg) : "");
    });
  }
  function paintPv(){
    var I = TK.inputs, t = read().t, h = '<h4 class="rl-h4">' + I.preview + "</h4>";
    if (t.length < 2) h += '<p class="tiny muted">' + I.none + "</p>";
    else {
      h += '<ul class="rl-pairs">';
      for (var i = 0; i < t.length; i++) for (var j = i + 1; j < t.length; j++) {
        var a = t[i], b = t[j], k = a[1] === b[1] ? "A" : a[0] === b[0] ? "B" : "";
        var q = k === "A" ? " ([A] × " + ratio(I.vals[b[0]] / I.vals[a[0]]) + ")" : k === "B" ? " ([B] × " + ratio(I.vals[b[1]] / I.vals[a[1]]) + ")" : "";
        h += '<li class="' + (k ? "rl-pok" : "rl-pno") + '">' + fmt(a) + " → " + fmt(b) + ": " + (k === "A" ? I.onlyA : k === "B" ? I.onlyB : I.both) + q + "</li>";
      }
      h += "</ul>";
    }
    pvEl.innerHTML = h;
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; TK = MV.C.task; inpEl = inp; pvEl = pv;
      if (!Array.isArray(S.t)) S.t = [];
      S.t = S.t.filter(function(s){ return /^[0-2]\|[0-2]$/.test(s); }).slice(0, 3);
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-cell]"); if (!b) return;
        var k = b.dataset.cell, at = S.t.indexOf(k), msg = "";
        if (at >= 0) S.t.splice(at, 1); else if (S.t.length >= 3) msg = TK.inputs.max; else S.t.push(k);
        api.save(); paintGrid(msg); paintPv(); api.update();
      });
      paintGrid(""); paintPv();
    },
    read:read,
    valid:function(d){ return d.t.length === 3 ? true : "Choose three trials (" + d.t.length + " of 3 so far)."; },
    checks:function(d){ return d.t.length === 3 ? lines(d.t) : [false, false, false]; },
    key:function(d){ return d.t.map(function(p){ return p.join(""); }).join("-"); },
    label:function(k){ return k.split("-").map(function(s){ return fmt([+s[0], +s[1]]); }).join(", "); },
    text:function(k){ return k.split("-").map(function(s){ return fmt([+s[0], +s[1]]); }).join(", "); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ orders:itemAct, puzzles:itemAct },
  task:task
});
})();
