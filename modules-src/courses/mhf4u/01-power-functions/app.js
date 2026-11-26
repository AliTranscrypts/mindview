// MHF4U 01 Power Functions: centrepiece, symmetry lab and design task, ported from the reference module.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;

function termHTML(a, n){
  if (n === 0) return num(a);
  var c = a === 1 ? "" : a === -1 ? MINUS : num(a);
  return c + (n === 1 ? "<i>x</i>" : "<i>x</i><sup>" + n + "</sup>");
}
function eqHTML(a, n){ return '<span class="m"><i>y</i> = ' + termHTML(a, n) + "</span>"; }
function endInfo(a, n){
  var L = function(l, r){ return "As " + MV.m("x → -∞") + ", " + MV.m("y → " + l) + ", and as " + MV.m("x → ∞") + ", " + MV.m("y → " + r) + "."; };
  if (n === 0) return { flat:true, words:"Flat on both sides: the graph is a horizontal line.", limits:MV.m("y") + " stays at " + num(a) + " on both sides." };
  var ev = n % 2 === 0;
  if (ev && a > 0) return { from:2, to:1, words:"Both arms point up.", limits:L("∞", "∞") };
  if (ev && a < 0) return { from:3, to:4, words:"Both arms point down.", limits:L("-∞", "-∞") };
  if (a > 0) return { from:3, to:1, words:"Starts low on the left and ends high on the right.", limits:L("-∞", "∞") };
  return { from:2, to:4, words:"Starts high on the left and ends low on the right.", limits:L("∞", "-∞") };
}
function keyPoints(a, n){ return n === 0 ? [[-1, a], [0, a], [1, a]] : [[-1, a * Math.pow(-1, n)], [0, 0], [1, a]]; }
function rangeHTML(a, n){
  if (n === 0) return MV.m("{y ∈ ℝ | y = " + num(a) + "}") + ' <span class="muted">(only one y-value)</span>';
  if (n % 2) return MV.m("{y ∈ ℝ}") + ' <span class="muted">(every real number)</span>';
  return a > 0 ? MV.m("{y ∈ ℝ | y ≥ 0}") : MV.m("{y ∈ ℝ | y ≤ 0}");
}
function tpHTML(a, n){
  if (n === 0) return "None. It’s a flat line.";
  if (n === 1) return "None. It’s a straight line.";
  if (n % 2) return "None. The graph flattens out at (0, 0), but keeps heading the same way.";
  return "One, at (0, 0). It’s the " + (a > 0 ? "lowest point (a minimum)." : "highest point (a maximum).");
}
function describe(a, n){
  var e = endInfo(a, n);
  return "Graph of " + MV.plain(eqHTML(a, n)) + ". " + (e.flat ? e.words : e.words + " Quadrant " + e.from + " to quadrant " + e.to + ".");
}

MV.module({
  // Hero: y = x^n for n = 1…6 drawn one after another (reduced motion: final frame).
  hero:function(f){
    var p = new MV.Plot(f.canvas, { xmin:-1.9, xmax:1.9, ymin:-2.4, ymax:2.4 }), k = MV.reduceMotion ? 6 : 1;
    p.render = function(){
      var curves = [];
      for (var n = 1; n <= k; n++) (function(n){ curves.push({ f:function(x){ return Math.pow(x, n); }, color:n === k ? css("--pen") : css("--ink-2"), alpha:n === k ? 1 : 0.3, width:n === k ? 3.2 : 1.6, arrows:n === k }); })(n);
      p.draw({ quads:true, curves:curves, points:[{ x:1, y:1 }, { x:0, y:0 }] });
      f.cap.innerHTML = eqHTML(1, k);
    };
    p.render();
    if (!MV.reduceMotion) { var t = setInterval(function(){ if (k >= 6) { clearInterval(t); return; } k++; p.render(); }, 750); }
  },

  // Explore: the power function playground.
  explore:function(host){
    var L = MV.pgLayout(host, { aria:"Graph of the power function chosen with the sliders" });
    var plot = new MV.Plot(L.canvas, { xmin:-3, xmax:3, ymin:-8, ymax:8 });
    var PG = { a:1, n:2, compare:null, marks:[] };
    L.ctrl.innerHTML = '<div id="pg-sl"></div><div id="pg-cmp"></div>';
    var sl = MV.sliders($("#pg-sl", host), [
      { id:"a", param:"a", label:'<i class="m va">a</i>, the leading coefficient', min:-3, max:3, step:0.5, value:1, skip:[0],
        note:'<span class="m"><i>a</i></span> skips over 0, because <span class="m"><i>y</i> = 0<i>x</i><sup><i>n</i></sup></span> is just the line <span class="m"><i>y</i> = 0</span>.' },
      { id:"n", param:"n", label:'<i class="m vn">n</i>, the degree', min:0, max:8, step:1, value:2, fmt:function(v){ return String(v); } }
    ], function(id, v){ PG[id] = v; PG.compare = null; PG.marks = []; MV.banner("", ""); cmp.set("off"); paint(); });
    var cmp = MV.seg($("#pg-cmp", host), { label:"Compare a family:", value:"off", options:[{ id:"off", t:"Off" }, { id:"even", t:"Even powers" }, { id:"odd", t:"Odd powers" }],
      onChange:function(v){ PG.compare = v === "off" ? null : v; PG.marks = []; MV.banner("", ""); paint(); } });
    function draw(){
      if (PG.compare) {
        var ns = PG.compare === "even" ? [2, 4, 6] : [1, 3, 5], cols = [css("--pen"), css("--acol"), css("--f3")];
        plot.draw({ view:{ xmin:-1.7, xmax:1.7, ymin:-2.3, ymax:2.3 },
          curves:ns.map(function(n, i){ return { f:function(x){ return Math.pow(x, n); }, color:cols[i], width:2.8, arrows:true }; }),
          points:[{ x:0, y:0 }, { x:1, y:1, label:"(1, 1)" }, { x:-1, y:PG.compare === "even" ? 1 : -1, label:PG.compare === "even" ? "(−1, 1)" : "(−1, −1)" }],
          describe:"Graphs of the " + PG.compare + " powers " + ns.join(", ") + " of x, zoomed in near the origin." });
        return;
      }
      var a = PG.a, n = PG.n, e = endInfo(a, n);
      var pts = keyPoints(a, n).map(function(p){ return { x:p[0], y:p[1] }; }).concat(PG.marks);
      plot.draw({ quads:true, shade:e.flat ? [] : [e.from, e.to], curves:[{ f:function(x){ return a * Math.pow(x, n); }, color:css("--pen"), width:3.2, arrows:true }], points:pts, describe:describe(a, n) });
    }
    plot.render = draw;
    function readout(a, n){
      var e = endInfo(a, n), ev = n % 2 === 0, kp = keyPoints(a, n);
      return MV.readoutHTML([
        ["Degree", n + ' <span class="muted">(' + (ev ? "even" : "odd") + ")</span>"],
        ["Leading coefficient", num(a) + ' <span class="muted">(' + (a > 0 ? "positive" : "negative") + ")</span>"],
        ["End behaviour", e.flat ? e.words + '<br><span class="tiny muted">' + e.limits + "</span>" : e.words + ' <span class="qpath">Q' + e.from + " to Q" + e.to + '</span><br><span class="tiny muted">' + e.limits + "</span>"],
        ["Domain", MV.m("{x ∈ ℝ}") + ' <span class="muted">(every real number)</span>'],
        ["Range", rangeHTML(a, n)],
        ["Symmetry", ev ? "Line symmetry about the <i>y</i>-axis, so it’s an <strong>even</strong> function." : "Point symmetry about the origin, so it’s an <strong>odd</strong> function."],
        ["Turning points", tpHTML(a, n)],
        ["Key points", kp.map(function(p){ return '<span class="nw">(' + num(p[0]) + ", " + num(p[1]) + ")</span>"; }).join(", ")]
      ]);
    }
    function familyHTML(kind){
      var ns = kind === "even" ? [2, 4, 6] : [1, 3, 5], cols = ["--pen", "--acol", "--f3"];
      return '<div><dt>Family of ' + kind + ' powers</dt><dd><div class="legend">' + ns.map(function(n, i){ return '<span><i class="sw" style="background:var(' + cols[i] + ')"></i>' + eqHTML(1, n) + "</span>"; }).join("") + "</div></dd></div>" +
        '<div><dt>Shared points</dt><dd>All three pass through <span class="nw">(0, 0)</span>, <span class="nw">(1, 1)</span> and ' + (kind === "even" ? '<span class="nw">(−1, 1)</span>.' : '<span class="nw">(−1, −1)</span>.') + "</dd></div>" +
        "<div><dt>What changes</dt><dd>Between −1 and 1, higher powers are flatter, staying closer to the <i>x</i>-axis. Past 1 and −1, they climb much faster.</dd></div>" +
        '<div><dt>Note</dt><dd class="tiny muted">The view is zoomed in so you can see the difference near the origin. Move a slider to leave compare mode.</dd></div>';
    }
    function paint(){
      sl.set("a", PG.a); sl.set("n", PG.n);
      if (PG.compare) { L.cap.innerHTML = PG.compare === "even" ? MV.m("y = x^2, x^4, x^6") : MV.m("y = x, x^3, x^5"); L.read.innerHTML = familyHTML(PG.compare); }
      else { L.cap.innerHTML = eqHTML(PG.a, PG.n); L.read.innerHTML = readout(PG.a, PG.n); }
      draw();
    }
    function setPG(s){ PG.a = s.a; PG.n = s.n; PG.compare = null; PG.marks = []; cmp.set("off"); paint(); }
    paint();
    return {
      predict:{
        start:function(p){ setPG(p.start); },
        run:function(p, done){
          if (p.cycle) {
            var n = 1;
            var step = function(){ PG.n = n; PG.marks = [{ x:1, y:1, r:7, color:css("--red"), label:"(1, 1)" }]; paint(); n++; if (n <= 7) setTimeout(step, MV.reduceMotion ? 150 : 650); else setTimeout(done, 400); };
            step();
          } else { setPG(p.end); setTimeout(done, 350); }
        }
      }
    };
  },

  // Part 3: fold and spin symmetry tests.
  part3:function(host){
    var SYMF = [{ a:1, n:2 }, { a:1, n:3 }, { a:-1, n:4 }, { a:0.5, n:5 }, { a:-2, n:3 }, { a:1, n:6 }];
    host.innerHTML = '<div class="sym"><div><canvas class="plot square" id="sym-plot" role="img" aria-label="Symmetry test graph"></canvas></div><div>' +
      '<h3>1. Choose a function</h3><div class="chips" id="sym-chips" role="group" aria-label="Functions to test"></div>' +
      '<h3>2. Move a copy</h3><div class="q-actions" style="margin-top:0"><button type="button" class="btn primary sm" id="sym-fold">Fold over the y-axis</button><button type="button" class="btn primary sm" id="sym-spin">Spin half a turn</button><button type="button" class="btn ghost sm" id="sym-reset">Reset</button></div>' +
      '<div id="sym-result" aria-live="polite"></div><details class="alg" id="sym-alg"></details></div></div>';
    var plot = new MV.Plot($("#sym-plot"), { xmin:-3.2, xmax:3.2, ymin:-3.2, ymax:3.2 });
    var SY = { i:0, mode:null, t:0, running:false, done:false, match:false };
    function base(){
      var f = SYMF[SY.i], R = 3.2 * Math.SQRT2 + 0.3, pts = [], N = 1400;
      for (var k = 0; k <= N; k++) { var x = -R + 2 * R * k / N, y = f.a * Math.pow(x, f.n); if (Math.abs(y) > R * 1.15) y = NaN; pts.push([x, y]); }
      return pts;
    }
    function draw(){
      var b = base(), curves = [], points = [];
      if (SY.mode === "fold") curves.push({ pts:[[0, -5], [0, 5]], color:css("--acol"), width:2, dash:[6, 6] });
      curves.push({ pts:b, color:css("--pen"), width:3.2, alpha:SY.mode ? 0.5 : 1 });
      if (SY.mode) {
        var t = MV.ease(SY.t), c = Math.cos(Math.PI * t), s = Math.sin(Math.PI * t);
        var moved = b.map(function(p){ return SY.mode === "fold" ? [p[0] * c, p[1]] : [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; });
        var col = SY.done ? (SY.match ? css("--green") : css("--red")) : css("--acol");
        curves.push({ pts:moved, color:col, width:3.2, dash:(SY.done && SY.match) ? null : [10, 7] });
      }
      if (SY.mode === "spin") points.push({ x:0, y:0, r:6, color:css("--acol") });
      plot.draw({ curves:curves, points:points, describe:"Symmetry test for " + MV.plain(eqHTML(SYMF[SY.i].a, SYMF[SY.i].n)) + (SY.done ? (SY.match ? ": the moved copy matches." : ": the moved copy does not match.") : ".") });
    }
    plot.render = draw;
    function algHTML(a, n){
      var ev = n % 2 === 0, inner = (a === 1 ? "" : a === -1 ? MINUS : num(a)) + "(" + MINUS + "<i>x</i>)<sup>" + n + "</sup>";
      return "<summary>Check it with algebra</summary><div class=\"alg-lines\">" +
        "<div><i>f</i>(<i>x</i>) = " + termHTML(a, n) + "</div><div><i>f</i>(" + MINUS + "<i>x</i>) = " + inner + "</div>" +
        "<div>= " + termHTML(ev ? a : -a, n) + " <small>because (" + MINUS + "x)<sup>" + n + "</sup> = " + (ev ? "" : MINUS) + "x<sup>" + n + "</sup>: " + (ev ? "an even number of negatives cancel out" : "an odd number of negatives leaves a negative") + "</small></div>" +
        "<div>= " + (ev ? "<i>f</i>(<i>x</i>)" : MINUS + "<i>f</i>(<i>x</i>)") + '</div></div><p style="margin:10px 0 0">So ' + eqHTML(a, n) + " is an <strong>" + (ev ? "even" : "odd") + "</strong> function.</p>";
    }
    function paint(){
      var f = SYMF[SY.i];
      $("#sym-chips").innerHTML = SYMF.map(function(g, i){ return '<button type="button" class="fchip" aria-pressed="' + (i === SY.i) + '" data-f="' + i + '">' + eqHTML(g.a, g.n) + "</button>"; }).join("");
      var alg = $("#sym-alg"), wasOpen = alg.open; alg.innerHTML = algHTML(f.a, f.n); alg.open = wasOpen;
      $("#sym-fold").disabled = $("#sym-spin").disabled = SY.running;
      var r = $("#sym-result");
      if (!SY.mode) r.innerHTML = '<p class="fb">The blue graph is ' + eqHTML(f.a, f.n) + ". Choose a test to see whether a moved copy lands on it.</p>";
      else if (SY.running) r.innerHTML = '<p class="fb">' + (SY.mode === "fold" ? "Folding the graph over the <i>y</i>-axis…" : "Spinning the graph half a turn around the origin…") + "</p>";
      else {
        var msg;
        if (SY.mode === "fold") msg = SY.match ? "<strong>✓ The folded copy lands exactly on the original.</strong> This graph has line symmetry about the <i>y</i>-axis, so it’s an even function." : "<strong>✗ The folded copy doesn’t match.</strong> It ends up flipped. There’s no line symmetry about the <i>y</i>-axis. Try the spin instead.";
        else msg = SY.match ? "<strong>✓ After half a turn, the copy lands exactly on the original.</strong> This graph has point symmetry about the origin, so it’s an odd function." : "<strong>✗ After half a turn, the copy ends up upside down.</strong> There’s no point symmetry about the origin. Try the fold instead.";
        r.innerHTML = '<div class="fb ' + (SY.match ? "good" : "bad") + '"><p>' + msg + "</p></div>";
      }
    }
    function run(mode){
      if (SY.running) return;
      var n = SYMF[SY.i].n;
      SY.mode = mode; SY.done = false; SY.t = 0; SY.running = true; SY.match = mode === "fold" ? n % 2 === 0 : n % 2 === 1;
      paint();
      MV.tween({ dur:1700, ease:function(t){ return t; }, step:function(t){ SY.t = t; draw(); }, done:function(){ SY.running = false; SY.done = true; draw(); paint(); } });
    }
    $("#sym-chips").addEventListener("click", function(e){ var b = e.target.closest("[data-f]"); if (!b || SY.running) return; SY.i = +b.dataset.f; SY.mode = null; paint(); draw(); var nb = $('[data-f="' + SY.i + '"]'); if (nb) nb.focus(); });
    $("#sym-fold").addEventListener("click", function(){ run("fold"); });
    $("#sym-spin").addEventListener("click", function(){ run("spin"); });
    $("#sym-reset").addEventListener("click", function(){ if (SY.running) return; SY.mode = null; paint(); draw(); });
    paint(); draw();
  },

  // Performance task: design a power function.
  task:(function(){
    var plot, api;
    function read(){
      var s = api ? api.S : {}, aRaw = String(s.a == null ? "" : s.a).trim(), nRaw = String(s.n == null ? "" : s.n).trim(), a = parseFloat(aRaw.replace(MINUS, "-")), n = Number(nRaw);
      var valid = aRaw !== "" && nRaw !== "" && isFinite(a) && a !== 0 && Number.isInteger(n) && n >= 0 && n <= 12, odd = n % 2 === 1;
      return { a:a, n:n, valid:valid, fallsLeft:valid && ((odd && a > 0) || (!odd && n > 0 && a < 0)), risesRight:valid && n >= 1 && a > 0, through:valid && Math.abs(a * Math.pow(2, n) - 24) < 1e-6 };
    }
    function drawPlot(){
      var d = read(), curves = [], e = d.valid ? endInfo(d.a, d.n) : null;
      if (d.valid) curves.push({ f:function(x){ return d.a * Math.pow(x, d.n); }, color:css("--pen"), width:3.2, arrows:true });
      plot.draw({ quads:true, shade:(e && !e.flat) ? [e.from, e.to] : [], curves:curves, points:[{ x:2, y:24, r:6, color:css("--red"), label:"(2, 24)" }],
        describe:d.valid ? describe(d.a, d.n) + " The target point (2, 24) is marked." : "Empty graph with the target point (2, 24) marked." });
    }
    return {
      render:function(inp, pv, a){
        api = a;
        inp.innerHTML = '<div class="inrow"><label for="d-a"><span><span class="m"><i class="va">a</i></span> =</span><input id="d-a" type="number" step="any" inputmode="decimal" placeholder="e.g. 2"></label>' +
          '<label for="d-n"><span><span class="m"><i class="vn">n</i></span> =</span><input id="d-n" type="number" step="1" min="0" max="12" inputmode="numeric" placeholder="e.g. 4"></label></div><p class="eq-cap" id="d-eq" style="font-size:1.6rem"></p>';
        pv.innerHTML = '<canvas class="plot" id="design-plot" role="img" aria-label="Graph of your designed function with the point (2, 24)"></canvas>';
        plot = new MV.Plot($("#design-plot"), { xmin:-3, xmax:3, ymin:-40, ymax:40 });
        plot.render = drawPlot;
        $("#d-a").value = api.S.a || ""; $("#d-n").value = api.S.n || "";
        function upd(){ var d = read(); $("#d-eq").innerHTML = d.valid ? eqHTML(d.a, d.n) : '<span class="tiny muted">Enter a value for a (not 0) and a whole number for n from 0 to 12.</span>'; drawPlot(); api.update(); }
        ["#d-a", "#d-n"].forEach(function(id){ $(id).addEventListener("input", function(){ api.S.a = $("#d-a").value; api.S.n = $("#d-n").value; api.save(); upd(); }); });
        upd();
      },
      read:read,
      valid:function(d){ return d.valid ? true : "Enter a value for " + MV.m("a") + " (not 0) and a whole number for " + MV.m("n") + " from 0 to 12."; },
      checks:function(d){ return [d.valid, d.fallsLeft, d.risesRight, d.through]; },
      tips:function(d){
        var tips = [];
        if (!d.risesRight || !d.fallsLeft) tips.push("For the arms to go from low on the left to high on the right, you need an <strong>odd</strong> degree and a <strong>positive</strong> " + MV.m("a") + ".");
        if (!d.through) tips.push("Substitute x = 2: you need " + MV.m("a × 2^n = 24") + ". Right now you get " + num(d.a * Math.pow(2, d.n)) + ".");
        return tips;
      },
      key:function(d){ return num(d.a) + "|" + d.n; },
      label:function(k){ var p = k.split("|"); return eqHTML(parseFloat(p[0].replace(MINUS, "-")), +p[1]); },
      text:function(k){ var p = k.split("|"); return "y = " + MV.plain(termHTML(parseFloat(p[0].replace(MINUS, "-")), +p[1])); }
    };
  })()
});
})();
