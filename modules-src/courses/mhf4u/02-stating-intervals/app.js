// MHF4U 02 Stating Intervals: hero, interval builder (Explore), graph detective (Part 3), "Work backwards" builds,
// "Build the graph from its report" task, and the small question graphs.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, MINUS = MV.MINUS, iv = MV.iv;
var T = function(pieces){ return iv.text(pieces); };

// ---------- shared: draw a function with labelled key points ----------
function graph(p, view, f, pts, desc, extra){
  extra = extra || {};
  p.draw(Object.assign({ view:view, curves:[{ f:f, color:css("--pen"), width:3, arrows:extra.arrows !== false }], points:(pts || []).map(function(q){ return { x:q[0], y:q[1], label:q[2] }; }), describe:desc }, extra));
}

// ---------- hero: two number lines, notation fading in (storyboard in the plan) ----------
function hero(f){
  var p1 = new MV.Plot($("#hero-nl1"), { xmin:-6, xmax:8, ymin:-1, ymax:1 }), p2 = new MV.Plot($("#hero-nl2"), { xmin:-6, xmax:8, ymin:-1, ymax:1 });
  var st = { r1:0, show1:false, r2:0, show2:false };
  function nl(p, reveal, pieces){
    p.draw({ numberLine:{ min:-6, max:8, pieces:pieces }, after:function(ctx){ if (reveal < 1) { ctx.fillStyle = css("--sheet"); ctx.fillRect(p.W * reveal, 0, p.W, p.H); } } });
  }
  p1.render = function(){ nl(p1, st.r1, st.show1 ? [{ a:-2, b:5, aIn:false, bIn:true }] : []); };
  p2.render = function(){ nl(p2, st.r2, st.show2 ? [{ a:-Infinity, b:-3, aIn:false, bIn:true }, { a:1, b:Infinity, aIn:false, bIn:false }] : []); };
  var forms1 = ['<span class="hf">' + MV.m("-2 < x ≤ 5") + "</span>", '<span class="hf">' + MV.m("{x ∈ ℝ | -2 < x ≤ 5}") + "</span>", '<span class="hf">' + MV.m("(-2, 5]") + "</span>"];
  $("#hero-f1").innerHTML = forms1.join('<span class="hf-sep"> · </span>');
  $("#hero-f2").innerHTML = '<span class="hf">' + MV.m("x ≤ -3") + " or " + MV.m("x > 1") + " " + MV.m("→") + " " + MV.m("(-∞, -3] ∪ (1, ∞)") + "</span>";
  var spans1 = MV.$$("#hero-f1 .hf"), span2 = $("#hero-f2 .hf");
  if (MV.reduceMotion) { st = { r1:1, show1:true, r2:1, show2:true }; spans1.forEach(function(s){ s.classList.add("on"); }); span2.classList.add("on"); p1.render(); p2.render(); return; }
  p1.render(); p2.render();
  MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ st.r1 = t; p1.render(); }, done:function(){
    st.show1 = true; p1.render();
    spans1.forEach(function(s, i){ setTimeout(function(){ s.classList.add("on"); }, 400 + i * 650); });
    setTimeout(function(){
      MV.tween({ dur:900, ease:function(t){ return t; }, step:function(t){ st.r2 = t; p2.render(); }, done:function(){ st.show2 = true; p2.render(); span2.classList.add("on"); } });
    }, 400 + 3 * 650 + 2000);
  } });
}

// ---------- Explore: challenge tests ----------
function intsIn(pieces){ var out = []; for (var k = -10; k <= 10; k++) if (iv.contains(pieces, k)) out.push(k); return out; }
function chalTest(b, id){
  var M = b.merged(), t = T(M), raw = b.get().pieces;
  if (id === "tc1") {
    if (t === T([{ a:-4, b:6, aIn:true, bIn:false }])) return { ok:true };
    if (M.length === 1 && M[0].a === -4 && M[0].b === 6) {
      if (!M[0].aIn && !M[0].bIn) return { ok:false, msg:"“At least −4” means −4 counts. Close the left dot." };
      if (M[0].aIn && M[0].bIn) return { ok:false, msg:"“Less than 6” means 6 doesn’t count. Open the right dot." };
      return { ok:false, msg:"Both ends are reversed: −4 is in, 6 is out." };
    }
    return { ok:false, msg:"Check the numbers: the set starts at −4 and stops at 6." };
  }
  if (id === "tc2") {
    if (t === T([{ a:-Infinity, b:-1, aIn:false, bIn:false }, { a:4, b:Infinity, aIn:true, bIn:false }])) return { ok:true };
    var named = {};
    named[T([{ a:-1, b:4, aIn:true, bIn:false }])] = "That’s the “everything else” you were given. Build the numbers outside it.";
    named[T([{ a:-Infinity, b:-1, bIn:true }, { a:4, b:Infinity, aIn:false }])] = "You kept each endpoint’s bracket. But −1 is <strong>in</strong> `[-1, 4)`, so it can’t be in your set; and 4 is <strong>not</strong> in `[-1, 4)`, so it must be in your set.";
    named[T([{ a:-Infinity, b:-1, bIn:false }, { a:4, b:Infinity, aIn:false }])] = "4 isn’t in `[-1, 4)`, and it isn’t in your set either. Every number has to be in exactly one of them. Close the dot at 4.";
    named[T([{ a:-Infinity, b:-1, bIn:true }, { a:4, b:Infinity, aIn:true }])] = "−1 is already in `[-1, 4)`, so it can’t be in your set too. Open the dot at −1.";
    return { ok:false, msg:MV.md(named[t] || "Your set should be every number outside `[-1, 4)`. Check each endpoint: is it in `[-1, 4)`?") };
  }
  if (id === "tc3") {
    if (raw.some(function(p){ return p.aInf || p.bInf; })) return { ok:false, msg:"Every endpoint must be an integer, so no ∞ this time. Decide open or closed at each one." };
    if (raw.some(function(p){ return p.a % 1 || p.b % 1; })) return { ok:false, msg:"Every endpoint must be an integer. That’s the point of the challenge: decide open or closed at each one." };
    var ints = intsIn(M), want = [-3, -2, 2, 3];
    if (raw.length === 2 && ints.join() === want.join()) return { ok:true };
    if (raw.length < 2 || (M.length === 1 && iv.contains(M, 0))) return { ok:false, msg:"One piece from −3 to 3 also contains −1, 0 and 1. Use two pieces with a gap." };
    var extra = ints.filter(function(k){ return want.indexOf(k) < 0; });
    var closedEnd = function(v){ return raw.some(function(p){ return (p.a === v && p.aIn) || (p.b === v && p.bIn); }); };
    var openEnd = function(v){ return raw.some(function(p){ return (p.a === v && !p.aIn) || (p.b === v && !p.bIn); }); };
    for (var i = 0; i < extra.length; i++) {
      var v = extra[i];
      if (closedEnd(v) && Math.abs(v) <= 1) return { ok:false, msg:"Your set contains " + num(v) + ". If an endpoint is an integer you don’t want, make it open." };
      if (closedEnd(v)) return { ok:false, msg:"Your set contains " + num(v) + ". Open that dot, or stop at the next integer in." };
    }
    var missing = want.filter(function(k){ return ints.indexOf(k) < 0; });
    for (var j = 0; j < missing.length; j++) if (openEnd(missing[j])) return { ok:false, msg:"Your set leaves out " + num(missing[j]) + ". An integer you need must be inside a piece or at a closed endpoint." };
    if (raw.length > 2) return { ok:false, msg:"Use exactly two pieces." };
    return { ok:false, msg:"List the integers in your set: " + (ints.length ? ints.map(function(k){ return num(k); }).join(", ") : "none") + ". They must be exactly −3, −2, 2 and 3." };
  }
  return { ok:false };
}

// ---------- Part 3: graph detective ----------
var TURN = "is a turning point. There the graph is neither rising nor falling, so it’s left out.";
var G = {
  A:{ name:"Graph A", eq:"`f(x) = (x + 3)(x - 3)^2`", view:{ xmin:-5, xmax:6, ymin:-20, ymax:40 }, f:function(x){ return (x + 3) * (x - 3) * (x - 3); },
    pts:[[-3, 0, "(−3, 0)"], [-1, 32, "(−1, 32)"], [3, 0, "(3, 0)"], [0, 27, "(0, 27)"]], keys:[-3, -1, 3],
    st:[{ s:"below", d:"rising" }, { s:"above", d:"rising" }, { s:"above", d:"falling" }, { s:"above", d:"rising" }],
    desc:"Graph A: f of x equals (x + 3)(x − 3) squared. Zero at (−3, 0); local maximum (−1, 32); local minimum and zero at (3, 0); y-intercept (0, 27).",
    alg:"`(x - 3)^2` is never negative and is 0 only at `x = 3`. So `f(x)` has the same sign as `x + 3`, except at `x = 3`: negative for `x < -3`, positive for `x > -3` with `x ≠ 3`.",
    qs:[
      { k:"inc", label:"Increasing", type:"d", sel:[0, 1, 3], inc:{ "-3":true }, why:"`f` rises until the local maximum at `x = -1`, falls to the local minimum at `x = 3`, then rises again. At −3 it crosses the axis without turning, so −3 doesn’t split the interval.",
        pt:{ "-1":"(−1, 32) and (3, 0) are turning points. There the graph is neither rising nor falling, so they’re left out.", "3":"(−1, 32) and (3, 0) are turning points. There the graph is neither rising nor falling, so they’re left out.", "-3":"The graph keeps rising through (−3, 0). Crossing the axis isn’t turning, so include −3 to join the pieces." } },
      { k:"dec", label:"Decreasing", type:"d", sel:[2], inc:{}, why:"`f` falls only between its turning points, from (−1, 32) down to (3, 0).",
        pt:{ "-1":"(−1, 32) and (3, 0) are turning points. There the graph is neither rising nor falling, so they’re left out.", "3":"(−1, 32) and (3, 0) are turning points. There the graph is neither rising nor falling, so they’re left out." } },
      { k:"pos", label:"Positive", type:"s", sel:[1, 2, 3], inc:{ "-1":true }, why:"`f` is above the axis everywhere right of −3, except at 3, where it touches the axis.",
        pt:{ "-1":"`f(-1) = 32`, which is positive. A turning point above the axis belongs to the positive interval; include it to join the pieces.", "3":"`f(3) = 0`. The graph touches the axis there, and 0 isn’t positive.", "-3":"`f(-3) = 0`, and 0 isn’t positive." } },
      { k:"neg", label:"Negative", type:"s", sel:[0], inc:{}, why:"`f` is below the axis only left of its zero at −3.",
        stretch:{ 3:"The graph only touches the axis at 3 and goes back up. It’s never below the axis on the right." }, pt:{ "-3":"`f(-3) = 0`, which isn’t negative." } }
    ] },
  B:{ name:"Graph B", eq:"`g(x) = x^3(4 - x)`", view:{ xmin:-2, xmax:5, ymin:-40, ymax:35 }, f:function(x){ return x * x * x * (4 - x); },
    pts:[[0, 0, "(0, 0)"], [3, 27, "(3, 27)"], [4, 0, "(4, 0)"]], keys:[0, 3, 4],
    st:[{ s:"below", d:"rising" }, { s:"above", d:"rising" }, { s:"above", d:"falling" }, { s:"below", d:"falling" }],
    desc:"Graph B: g of x equals x cubed times (4 − x). It levels off at (0, 0) but keeps rising; local maximum (3, 27); zero at (4, 0).",
    alg:"`x^3` has the same sign as `x`, and `4 - x` is positive for `x < 4`. So `g` is negative for `x < 0`, positive between 0 and 4, and negative again for `x > 4`.",
    qs:[
      { k:"inc", label:"Increasing", type:"d", sel:[0, 1], inc:{ "0":true }, why:"`g` rises all the way to its peak at `x = 3`. It levels off for an instant at (0, 0) but doesn’t turn.",
        pt:{ "0":"`g` keeps rising through (0, 0): `g(-1) = -5`, `g(0) = 0`, `g(1) = 3`. It levels off for an instant but doesn’t turn, so 0 doesn’t split the interval. Include it.", "3":"(3, 27) is a turning point. There the graph is neither rising nor falling, so it’s left out." } },
      { k:"dec", label:"Decreasing", type:"d", sel:[2, 3], inc:{ "4":true }, why:"After the peak at `x = 3`, `g` falls forever, straight through its zero at 4.",
        stretch:{ 0:"Left of 0 the graph is below the axis but rising. Negative isn’t the same as decreasing." },
        pt:{ "3":"(3, 27) is a turning point. There the graph is neither rising nor falling, so it’s left out.", "4":"`g` keeps falling through (4, 0). Crossing the axis isn’t turning, so include 4 to join the pieces." } },
      { k:"pos", label:"Positive", type:"s", sel:[1, 2], inc:{ "3":true }, why:"`g` is above the axis between its zeros 0 and 4.",
        pt:{ "0":"These are zeros: `g = 0` there.", "4":"These are zeros: `g = 0` there.", "3":"`g(3) = 27` is positive, so include 3 to join the pieces." } },
      { k:"neg", label:"Negative", type:"s", sel:[0, 3], inc:{}, why:"`g` is below the axis left of 0 and right of 4.",
        pt:{ "0":"`g(0) = 0`, which isn’t negative, so 0 splits the negative set into two pieces.", "4":"`g(4) = 0`, which isn’t negative." } }
    ] },
  C:{ name:"Graph C", eq:"three straight segments", view:{ xmin:-5, xmax:6, ymin:-5, ymax:5 },
    f:function(x){ if (x < -4 || x >= 5) return NaN; if (x <= -1) return 2 * x + 6; if (x <= 3) return -2 * x + 2; return 4 * x - 16; },
    pts:[[-1, 4, "(−1, 4)"], [3, -4, "(3, −4)"]], keys:[-4, -3, -1, 1, 3, 4, 5], ends:true,
    st:[{ s:"below", d:"rising" }, { s:"above", d:"rising" }, { s:"above", d:"falling" }, { s:"below", d:"falling" }, { s:"below", d:"rising" }, { s:"above", d:"rising" }],
    desc:"Graph C: three straight segments from a closed dot at (−4, −2) up to (−1, 4), down to (3, −4), and up to an open dot at (5, 4). Zeros at −3, 1 and 4.",
    alg:"The three segments are `y = 2x + 6` for `-4 ≤ x ≤ -1`, `y = -2x + 2` for `-1 ≤ x ≤ 3`, and `y = 4x - 16` for `3 ≤ x < 5`. Setting each to 0 gives the zeros −3, 1 and 4.",
    qs:[
      { k:"dom", label:"Domain", type:"x", sel:[0, 1, 2, 3, 4, 5], inc:{ "-4":true, "-3":true, "-1":true, "1":true, "3":true, "4":true }, why:"The graph covers every `x` from −4 (closed dot) up to, but not including, 5 (open dot).",
        pt:{ "-4":"The dot at (−4, −2) is closed, so `x = -4` is in the domain.", "5":"The dot at (5, 4) is open: the graph stops just before `x = 5`." }, ptDefault:"The graph passes through `x` = {v}, so include it to join the pieces." },
      { k:"rng", label:"Range", type:"y", ykeys:[-4, -2, 4], sel:[0, 1], inc:{ "-4":true, "-2":true, "4":true }, why:"The lowest point (3, −4) and the peak (−1, 4) are both solid points, and every height between them is reached.",
        stretchMsg:"The range runs from the lowest point the graph reaches, not from where it starts.",
        pt:{ "4":"The open dot at (5, 4) misses `y = 4`, but the peak (−1, 4) is a solid point of the graph. 4 is reached, so it’s in the range.", "-4":"The lowest point (3, −4) is on the graph, so −4 is included.", "-2":"The graph reaches height −2 (at the closed dot (−4, −2) and again on the way down), so include it." } },
      { k:"inc", label:"Increasing", type:"d", sel:[0, 1, 4, 5], inc:{ "-3":true, "4":true }, why:"The graph rises from the closed dot to the peak at `x = -1`, and again from the valley at `x = 3` to the end. Increasing intervals are written as open intervals.",
        pt:{ "-4":"Increasing intervals are written as open intervals in this course, even at the ends of the domain.", "5":"Increasing intervals are written as open intervals in this course, even at the ends of the domain.", "-1":"(−1, 4) and (3, −4) are turning points. There the graph is neither rising nor falling, so they’re left out.", "3":"(−1, 4) and (3, −4) are turning points. There the graph is neither rising nor falling, so they’re left out.", "-3":"The graph keeps rising through (−3, 0), so include −3 to join the pieces.", "4":"The graph keeps rising through (4, 0), so include 4 to join the pieces." } },
      { k:"dec", label:"Decreasing", type:"d", sel:[2, 3], inc:{ "1":true }, why:"The graph falls only between its turning points at `x = -1` and `x = 3`.",
        pt:{ "-1":"(−1, 4) and (3, −4) are turning points. There the graph is neither rising nor falling, so they’re left out.", "3":"(−1, 4) and (3, −4) are turning points. There the graph is neither rising nor falling, so they’re left out.", "1":"The graph keeps falling through (1, 0), so include 1 to join the pieces." } }
    ] }
};
// strip model for a graph/question: stretches between keys, with ±∞ ends unless the graph has domain ends
function strip(g, q){
  var keys = q.type === "y" ? q.ykeys : g.keys, out = [], ends = q.type === "y" || g.ends;
  var bounds = ends ? keys : [-Infinity].concat(keys, [Infinity]);
  for (var i = 0; i + 1 < bounds.length; i++) out.push({ a:bounds[i], b:bounds[i + 1] });
  return { st:out, keys:keys, ends:ends };
}
function buildPieces(model, sel, inc){
  var ps = [], cur = null;
  model.st.forEach(function(s, i){
    if (sel.indexOf(i) < 0) { cur = null; return; }
    var aIn = !!inc[String(s.a)], bIn = !!inc[String(s.b)];
    if (cur && cur.b === s.a && aIn) { cur.b = s.b; cur.bIn = bIn; }
    else { cur = { a:s.a, b:s.b, aIn:isFinite(s.a) && aIn, bIn:isFinite(s.b) && bIn }; ps.push(cur); }
  });
  return ps;
}
function lab(v){ return v === -Infinity ? MINUS + "∞" : v === Infinity ? "∞" : num(v); }
function part3(host, api){
  var S = api.S; S.g = S.g || "A"; S.q = S.q || { A:0, B:0, C:0 }; S.ans = S.ans || {};
  host.innerHTML = '<div class="sym"><div><div class="chips" id="dt-g" role="group" aria-label="Choose a graph"></div><canvas class="plot" id="dt-plot" role="img"></canvas>' +
    '<p class="tiny muted" id="dt-axis-lab" style="margin:10px 0 4px"></p><div class="dt-strip" id="dt-strip" role="group" aria-label="Axis strip"></div></div>' +
    '<div><h3 id="dt-title"></h3><div class="chips" id="dt-q" role="group" aria-label="Choose a question"></div><p id="dt-ask" style="font-weight:700"></p>' +
    '<p>Your answer: <span id="dt-line" class="eq-cap" style="font-size:1.4rem;display:inline"></span></p>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="dt-check">Check</button><button type="button" class="btn ghost sm" id="dt-clear">Clear</button></div><div id="dt-fb" aria-live="polite"></div>' +
    '<details class="alg" id="dt-alg"></details></div></div>';
  var plot = new MV.Plot($("#dt-plot"), G.A.view), fbMsg = null;
  function cur(){ var g = G[S.g], q = g.qs[S.q[S.g]]; var key = S.g + "-" + q.k; var a = S.ans[key] || (S.ans[key] = { sel:[], inc:{}, tries:0, solved:false }); return { g:g, q:q, a:a, m:strip(g, q) }; }
  plot.render = function(){
    var c = cur(), bands = [], after = null;
    if (c.q.type === "y") {
      after = function(ctx, p){ c.a.sel.forEach(function(i){ var s = c.m.st[i]; ctx.fillStyle = css("--hi-soft"); ctx.fillRect(0, p.Y(s.b), p.W, p.Y(s.a) - p.Y(s.b)); }); };
    } else c.a.sel.forEach(function(i){ var s = c.m.st[i]; bands.push({ x0:s.a === -Infinity ? c.g.view.xmin : s.a, x1:s.b === Infinity ? c.g.view.xmax : s.b }); });
    var pts = c.g.pts.map(function(q){ return { x:q[0], y:q[1], label:q[2] }; });
    if (S.g === "C") pts.push({ x:-4, y:-2, label:"(−4, −2)", color:css("--pen") }, { x:5, y:4, open:true, label:"(5, 4)" });
    plot.draw({ view:c.g.view, bands:bands, after:after, curves:[{ f:c.g.f, color:css("--pen"), width:3, arrows:S.g !== "C" }], points:pts, describe:c.g.desc });
  };
  function paint(){
    var c = cur();
    $("#dt-g").innerHTML = ["A", "B", "C"].map(function(k){ return '<button type="button" class="fchip" data-g="' + k + '" data-k="dtg' + k + '" aria-pressed="' + (S.g === k) + '">' + G[k].name + "</button>"; }).join("");
    $("#dt-title").innerHTML = c.g.name + ": " + MV.md(c.g.eq);
    $("#dt-q").innerHTML = c.g.qs.map(function(q, i){ var a = S.ans[S.g + "-" + q.k]; return '<button type="button" class="chip' + (i === S.q[S.g] ? " on" : "") + '" data-q="' + i + '" data-k="dtq' + i + '" aria-pressed="' + (i === S.q[S.g]) + '">' + (a && a.solved ? "✓ " : "") + q.label + "</button>"; }).join("");
    var ask = { inc:"Where is it increasing?", dec:"Where is it decreasing?", pos:"Where is it positive?", neg:"Where is it negative?", dom:"What is its domain?", rng:"What is its range?" }[c.q.k];
    $("#dt-ask").textContent = ask;
    $("#dt-axis-lab").innerHTML = c.q.type === "y" ? "<strong>This question is about <i>y</i>-values.</strong> The strip runs up the <i>y</i>-axis, from bottom (left) to top (right)." : "Tap the stretches of the <i>x</i>-axis, then set each split point: ○ left out or ● included.";
    var h = "";
    c.m.st.forEach(function(s, i){
      if (i === 0 && c.m.ends) h += ptBtn(c, s.a);
      var on = c.a.sel.indexOf(i) >= 0;
      h += '<button type="button" class="dt-st' + (on ? " on" : "") + '" data-st="' + i + '" data-k="dts' + i + '" aria-pressed="' + on + '"' + (c.a.solved ? " disabled" : "") + ">" + lab(s.a) + " to " + lab(s.b) + "</button>";
      if (i < c.m.st.length - 1 || c.m.ends) h += ptBtn(c, s.b);
    });
    MV.keepFocus($("#dt-strip"), function(){ $("#dt-strip").innerHTML = h; });
    $("#dt-line").innerHTML = MV.m(T(buildPieces(c.m, c.a.sel, c.a.inc)));
    $("#dt-check").disabled = c.a.solved; $("#dt-clear").disabled = c.a.solved;
    var alg = $("#dt-alg"), open = alg.open; alg.innerHTML = "<summary>Check it with algebra</summary><p style=\"margin:10px 0 0\">" + MV.md(c.g.alg) + "</p>"; alg.open = open;
    var fb = $("#dt-fb");
    if (c.a.solved) fb.innerHTML = '<div class="fb good"><p><strong>✓ Case closed.</strong> ' + MV.md(c.q.why) + "</p></div>";
    else fb.innerHTML = fbMsg ? '<div class="fb bad"><p><strong>✗ Not yet.</strong></p>' + fbMsg.map(function(x){ return "<p>" + MV.md(x) + "</p>"; }).join("") + "</div>" : "";
    plot.render();
  }
  function ptBtn(c, v){
    var s = c.m.st, adj = c.a.sel.some(function(i){ return s[i].a === v || s[i].b === v; }), on = !!c.a.inc[String(v)];
    return '<button type="button" class="dt-pt' + (on ? " on" : "") + '" data-pt="' + v + '" data-k="dtp' + v + '" aria-pressed="' + on + '" aria-label="' + (c.q.type === "y" ? "y" : "x") + " = " + num(v) + ": " + (on ? "included" : "left out") + '"' + (!adj || c.a.solved ? " disabled" : "") + "><span>" + num(v) + "</span><b aria-hidden=\"true\">" + (on ? "●" : "○") + "</b></button>";
  }
  function judge(c){
    var msgs = [], q = c.q, s = c.m.st;
    s.forEach(function(st, i){
      var want = q.sel.indexOf(i) >= 0, has = c.a.sel.indexOf(i) >= 0;
      if (has && !want) msgs.push((q.stretch && q.stretch[i]) || (q.type === "y" ? q.stretchMsg : "This stretch doesn’t fit. Here the graph is " + (q.type === "s" ? c.g.st[i].s + " the axis" : q.type === "d" ? c.g.st[i].d : "") + "."));
      if (!has && want) msgs.push(q.type === "y" ? q.stretchMsg : "You’re missing a stretch. Look for every place where the graph is " + ({ inc:"rising", dec:"falling", pos:"above the axis", neg:"below the axis", dom:"drawn" })[q.k] + ".");
    });
    c.m.keys.forEach(function(v){
      var adj = c.a.sel.some(function(i){ return s[i].a === v || s[i].b === v; }); if (!adj) return;
      var want = !!q.inc[String(v)], has = !!c.a.inc[String(v)];
      var wantAdj = q.sel.some(function(i){ return s[i].a === v || s[i].b === v; });
      if (want !== has && wantAdj) msgs.push((q.pt && q.pt[String(v)]) || (q.ptDefault || (want ? "Include {v}." : "Leave {v} out.")).replace("{v}", num(v)));
    });
    return msgs.filter(function(x, i){ return msgs.indexOf(x) === i; }).slice(0, 3);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = cur();
    if (b.dataset.g) { S.g = b.dataset.g; fbMsg = null; }
    else if (b.dataset.q != null) { S.q[S.g] = +b.dataset.q; fbMsg = null; }
    else if (b.dataset.st != null) { var i = +b.dataset.st, k = c.a.sel.indexOf(i); if (k < 0) c.a.sel.push(i); else c.a.sel.splice(k, 1); c.a.sel.sort(); fbMsg = null; }
    else if (b.dataset.pt != null) { var v = b.dataset.pt; c.a.inc[v] = !c.a.inc[v]; fbMsg = null; }
    else if (b.id === "dt-clear") { c.a.sel = []; c.a.inc = {}; fbMsg = null; }
    else if (b.id === "dt-check") {
      var m = judge(c);
      if (!c.a.sel.length) m = ["Tap at least one stretch of the axis first."];
      if (!m.length && T(buildPieces(c.m, c.a.sel, c.a.inc)) === T(buildPieces(c.m, c.q.sel, c.q.inc))) { c.a.solved = true; fbMsg = null; }
      else { c.a.tries++; fbMsg = m.length ? m : ["Compare your answer line with the graph again."]; }
      api.save(); paint(); MV.focusFb(host); return;
    } else return;
    api.save(); paint();
  });
  paint();
}

// ---------- Practice 2: work backwards from the clues ----------
function builds(host, api, a){
  var S = api.S; S.i = S.i || 0; S.items = S.items || {};
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="pred-top"><span class="tiny muted" id="wb-n"></span><span class="dots" id="wb-dots" aria-hidden="true"></span></div><p class="pred-q" id="wb-clue"></p><div id="wb-b"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="wb-check">Check</button><span id="wb-hint"></span></div><div id="wb-hints"></div><div id="wb-fb" aria-live="polite"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="wb-prev">Previous</button><button type="button" class="btn ghost sm" id="wb-next">Next clue</button></div>';
  var start = { pieces:[{ a:-2, b:2, aIn:true, bIn:true }] };
  var b = MV.intervalBuilder($("#wb-b", host), { modes:false, test:false, readout:false, aria:"Number line for your answer",
    onChange:function(st){ var x = ist(); if (!x.solved) { x.build = st; api.save(); } } });
  var msg = {};
  function ist(){ var it = a.items[S.i]; return S.items[it.id] || (S.items[it.id] = { build:null, tries:0, hint:0, solved:false, first:null }); }
  function paint(load){
    var it = a.items[S.i], x = ist();
    $("#wb-n", host).textContent = "Build " + (S.i + 1) + " of " + a.items.length + (it.star ? " ★" : "");
    $("#wb-dots", host).innerHTML = a.items.map(function(q, i){ var y = S.items[q.id]; return '<span class="dot' + (y && y.solved ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("");
    $("#wb-clue", host).innerHTML = it.clue;
    if (load) b.set(x.build || start, true);
    $("#wb-check", host).disabled = x.solved;
    $("#wb-hint", host).innerHTML = x.solved ? "" : MV.hintBtn("wbh" + it.id, x.hint);
    $("#wb-hints", host).innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    $("#wb-fb", host).innerHTML = x.solved ? '<div class="fb good"><p><strong>✓ Correct: ' + MV.m(MV.ans(it)) + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : (msg[it.id] ? '<div class="fb bad"><p><strong>✗ Not quite.</strong> ' + msg[it.id] + "</p></div>" : "");
    $("#wb-prev", host).disabled = S.i === 0; $("#wb-next", host).disabled = S.i === a.items.length - 1;
  }
  host.addEventListener("click", function(e){
    var btn = e.target.closest("button"); if (!btn || btn.disabled) return;
    var it = a.items[S.i], x = ist();
    if (btn.id === "wb-prev" || btn.id === "wb-next") { S.i += btn.id === "wb-prev" ? -1 : 1; api.save(); paint(true); return; }
    if (btn.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (btn.id === "wb-check") {
      var got = T(b.merged()), want = MV.ans(it);
      if (got === want) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[it.id] = null; }
      else { x.tries++; msg[it.id] = MV.md((it.wrong && it.wrong[got]) || "Your build is " + MV.m(got) + ". Compare it with the clue again: check each endpoint and each bracket."); }
      api.save(); paint(); MV.focusFb(host);
    }
  });
  paint(true);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var y = S.items[it.id]; if (y && (y.tries > 0 || y.hint >= 3)) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: build the graph from its report ----------
var XS = [-4, -2, 0, 2, 4];
function analyse(d){
  var h = d.h, L = d.left === "closed", R = d.right === "closed", zeros = 0, inf = false;
  for (var i = 0; i < 4; i++) {
    var a = h[i], b = h[i + 1];
    if (a === 0 && b === 0) inf = true;
    if (a * b < 0) zeros++;
  }
  h.forEach(function(v, i){ if (v === 0 && (i === 0 ? L : i === 4 ? R : true)) zeros++; });
  var solid = function(i){ return i === 0 ? L : i === 4 ? R : true; };
  var lo = Math.min.apply(null, h), hi = Math.max.apply(null, h);
  var loIn = h.some(function(v, i){ return v === lo && solid(i); }), hiIn = h.some(function(v, i){ return v === hi && solid(i); });
  var inc = [], dec = [];
  for (var j = 0; j < 4; j++) { var seg = { a:XS[j], b:XS[j + 1], aIn:false, bIn:false }; if (h[j + 1] > h[j]) inc.push(seg); else if (h[j + 1] < h[j]) dec.push(seg); }
  // consecutive same-direction segments join (the shared point isn't a turn)
  var join = function(ps){ var out = []; ps.forEach(function(p){ var l = out[out.length - 1]; if (l && l.b === p.a) l.b = p.b; else out.push(Object.assign({}, p)); }); return out; };
  return { zeros:inf ? Infinity : zeros, lo:lo, hi:hi, loIn:loIn, hiIn:hiIn, inc:join(inc), dec:join(dec), dom:[{ a:-4, b:4, aIn:L, bIn:R }],
    range:[{ a:lo, b:hi, aIn:loIn, bIn:hiIn }] };
}
var task = (function(){
  var api, plot;
  function read(){
    var s = api ? api.S : {}, raw = (s.h || ["", "", "", "", ""]), h = raw.map(function(v){ var r = MV.parseNum(v); return r && r.length === 1 ? r[0] : NaN; });
    return { raw:raw, h:h, left:s.left || "closed", right:s.right || "closed", valid:h.every(function(v){ return Number.isInteger(v) && v >= -6 && v <= 6; }) };
  }
  function draw(){
    var d = read(), segs = [], pts = [];
    if (d.valid) {
      for (var i = 0; i < 4; i++) segs.push({ x1:XS[i], y1:d.h[i], x2:XS[i + 1], y2:d.h[i + 1], color:css("--pen"), width:3 });
      d.h.forEach(function(v, i){ var end = i === 0 ? d.left : i === 4 ? d.right : "mid"; pts.push({ x:XS[i], y:v, open:end === "open", color:end === "mid" ? css("--ink") : css("--pen"), r:end === "mid" ? 4 : 5.5 }); });
    }
    plot.draw({ view:{ xmin:-5, xmax:5, ymin:-7, ymax:7 }, segments:segs, points:pts, describe:d.valid ? "Your graph through the heights " + d.h.map(function(v){ return num(v); }).join(", ") + " at x = −4, −2, 0, 2, 4." : "Empty graph. Enter five heights." });
  }
  function report(){
    var d = read(), el = $("#rp-own"); if (!el) return;
    if (!d.valid) { el.innerHTML = '<span class="muted">Enter all five heights to see your graph’s report.</span>'; return; }
    var r = analyse(d);
    el.innerHTML = "Domain: " + MV.m(T(r.dom)) + "<br>Increasing on " + MV.m(T(r.inc)) + "; decreasing on " + MV.m(T(r.dec)) + "<br>Zeros: " + (r.zeros === Infinity ? "infinitely many (a segment lies on the axis)" : r.zeros) + "<br>Range: " + MV.m(T(r.range));
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.h = a.S.h || ["", "", "", "", ""];
      inp.innerHTML = '<div class="inrow">' + XS.map(function(x, i){ return '<label for="rp-h' + i + '"><span>' + MV.m("x = " + x) + '</span><input id="rp-h' + i + '" data-h="' + i + '" type="number" step="1" min="-6" max="6" autocomplete="off" style="width:4.6rem" value="' + MV.esc(a.S.h[i]) + '"></label>'; }).join("") + "</div>" +
        '<div class="seg-wrap" id="rp-ends"></div>';
      pv.innerHTML = '<canvas class="plot square" id="rp-plot" role="img"></canvas><div class="refresh" style="margin-top:12px"><h4>Your graph’s report</h4><p id="rp-own"></p></div>';
      plot = new MV.Plot($("#rp-plot"), { xmin:-5, xmax:5, ymin:-7, ymax:7 }); plot.render = draw;
      function ends(){
        $("#rp-ends").innerHTML = ["left", "right"].map(function(side){ var v = a.S[side] || "closed"; return '<span class="tiny" style="font-weight:700">' + (side === "left" ? "Left end (x = −4):" : "Right end (x = 4):") + '</span><span class="seg" role="group" aria-label="' + side + ' end dot">' + ["open", "closed"].map(function(o){ return '<button type="button" data-end="' + side + '" data-v="' + o + '" data-k="rp' + side + o + '" aria-pressed="' + (v === o) + '">' + (o === "open" ? "Open ○" : "Closed ●") + "</button>"; }).join("") + "</span>"; }).join("");
      }
      inp.addEventListener("input", function(e){ var i = e.target.dataset.h; if (i == null) return; a.S.h[+i] = e.target.value; a.save(); draw(); report(); a.update(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-end]"); if (!b) return; a.S[b.dataset.end] = b.dataset.v; a.save(); MV.keepFocus($("#rp-ends"), ends); draw(); report(); a.update(); });
      ends(); draw(); report();
    },
    read:read,
    valid:function(d){ return d.valid ? true : "Enter a whole number from −6 to 6 for each of the five heights."; },
    checks:function(d){
      if (!d.valid) return [false, false, false, false];
      var h = d.h, r = analyse(d);
      return [d.left === "closed" && d.right === "open", h[0] < h[1] && h[1] > h[2] && h[2] < h[3] && h[3] < h[4], r.zeros === 3, r.lo === -3 && r.loIn && r.hi === 5 && !r.hiIn];
    },
    tips:function(d, c){
      var h = d.h, r = analyse(d), out = [];
      if (!c[0]) out.push(MV.md("`[-4, 4)` means `x = -4` is in (closed dot) and `x = 4` is out (open dot)."));
      if (!c[1]) {
        var want = ["up", "down", "up", "up"], where = "";
        for (var i = 0; i < 4; i++) { var dir = h[i + 1] > h[i] ? "up" : h[i + 1] < h[i] ? "down" : "flat"; if (dir !== want[i]) { where = "from x = " + num(XS[i]) + " to x = " + num(XS[i + 1]) + " the height goes " + (dir === "flat" ? "nowhere (it stays at " + num(h[i]) + ")" : dir + " (from " + num(h[i]) + " to " + num(h[i + 1]) + ")") + "."; break; } }
        out.push("Read your heights left to right: they must go up, then down, then up twice. Right now " + where);
      }
      if (!c[2]) out.push("Your graph has " + (r.zeros === Infinity ? "infinitely many" : r.zeros) + " zero" + (r.zeros === 1 ? "" : "s") + ". To cross the axis three times, start below it, rise above it, dip below it, then rise above it again.");
      if (!c[3]) out.push("Your range is " + MV.m(T(r.range)) + ". The top of the range must be 5 but not reached: which point can be 5 if its dot is open? The bottom must be −3, reached at a solid point.");
      return out;
    },
    key:function(d){ return d.h.join(",") + "|" + d.left + "|" + d.right; },
    label:function(k){ var p = k.split("|"); return "(" + p[0].split(",").map(function(v){ return num(+v); }).join(", ") + ")"; },
    text:function(k){ var p = k.split("|"); return "heights " + p[0].split(",").map(function(v){ return num(+v); }).join(", ") + ", left " + p[1] + ", right " + p[2]; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host){
    var b = MV.intervalBuilder(host, { pieces:[{ a:-2, b:5, aIn:false, bIn:true }], aria:"Interval builder number line", onChange:function(){ MV.changed(); } });
    return {
      predict:{
        start:function(p){ b.set(Object.assign({ mode:"set" }, p.start), true); },
        run:function(p, done){
          if (p.id === "p1") b.slide(0, "b", Infinity, done);
          else if (p.id === "p2") b.slide(1, "a", 1, function(){ var st = b.get(); st.pieces[1].aIn = true; b.set(st); MV.wait(300, done); });
          else if (p.id === "p3") MV.wait(500, function(){ b.setMode("else"); MV.wait(500, done); });
          else if (p.id === "p4") { b.ring({ x:2, closed:false }); MV.wait(900, function(){ b.ring(null); b.set({ pieces:[{ a:-3, b:2, aIn:false, bIn:false, aInf:true, bInf:false }, { a:2, b:5, aIn:false, bIn:false, aInf:false, bInf:true }] }); MV.wait(300, done); }); }
          else done();
        }
      },
      challenge:function(id){ return chalTest(b, id); }
    };
  },
  part3:part3,
  activities:{ builds:builds },
  task:task,
  figures:{
    w6:function(p){ graph(p, { xmin:-4, xmax:6, ymin:-6, ymax:8 }, function(x){ return (x - 1) * (x - 1) - 4; }, [[1, -4, "(1, −4)"], [-1, 0, "(−1, 0)"], [3, 0, "(3, 0)"]], "Parabola opening up with vertex (1, −4) and zeros −1 and 3"); },
    k3a:function(p){ graph(p, { xmin:-3, xmax:7, ymin:-11, ymax:8 }, function(x){ return (x + 1) * (x - 5); }, [[2, -9, "(2, −9)"], [-1, 0, "(−1, 0)"], [5, 0, "(5, 0)"]], "Parabola opening up with zeros −1 and 5 and vertex (2, −9)"); },
    k3b:function(p){ graph(p, { xmin:-6, xmax:4, ymin:-8, ymax:11 }, function(x){ return -(x - 2) * (x + 4); }, [[-1, 9, "(−1, 9)"], [-4, 0, "(−4, 0)"], [2, 0, "(2, 0)"]], "Parabola opening down with zeros −4 and 2 and vertex (−1, 9)"); },
    t2a:function(p){ graph(p, { xmin:-6, xmax:4, ymin:-20, ymax:40 }, function(x){ return (x + 4) * (x - 2) * (x - 2); }, [[-4, 0, "(−4, 0)"], [-2, 32, "(−2, 32)"], [2, 0, "(2, 0)"]], "Cubic through (−4, 0), local maximum (−2, 32), touching the axis at (2, 0)"); },
    t2b:function(p){ graph(p, { xmin:-4, xmax:6, ymin:-20, ymax:40 }, function(x){ return -(x - 4) * (x + 2) * (x + 2); }, [[-2, 0, "(−2, 0)"], [2, 32, "(2, 32)"], [4, 0, "(4, 0)"]], "Cubic touching the axis at (−2, 0), local maximum (2, 32), crossing at (4, 0)"); },
    e1:function(p){ graph(p, { xmin:-2, xmax:6, ymin:-6, ymax:8 }, function(x){ return x * x - 4 * x; }, [[0, 0, "(0, 0)"], [4, 0, "(4, 0)"], [2, -4, "(2, −4)"]], "Parabola opening up through (0, 0) and (4, 0) with vertex (2, −4)"); }
  }
});
})();
