// MHF4U 08 Average Rate of Change: hero (ball secant), secant lab (Explore), rates in context with the N29 sentence
// builder and the vase sketch round (Part 3), and the "Plan the road trip" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var r6 = function(v){ return Math.round(v * 1e6) / 1e6; };
var lin = function(t){ return t; };

// @component G5 secantScene — adds a secant line (--ink-2) through two points, rise-and-run legs with unit labels, optional
// slope label and draggable-style points to a Plot scene; used by the secant lab, Part 3 and (likely) module 09.
// o: {a, ya, b, yb, dash, alpha, tri, rise, run, slope, nameA, nameB, ring, pointColor}
function secantScene(sc, o){
  var ink = css("--ink"), ink2 = css("--ink-2");
  sc.lines.push({ p:[o.a, o.ya], q:[o.b, o.yb], color:ink2, width:2, dash:o.dash || null });
  if (o.tri) {
    sc.segments.push({ x1:o.a, y1:o.ya, x2:o.b, y2:o.ya, color:ink, width:2, dash:o.dash ? [4, 4] : null, alpha:o.alpha == null ? 1 : o.alpha });
    var flat = Math.abs(o.yb - o.ya) < 1e-6 * Math.max(1, Math.abs(o.ya));
    if (!flat) sc.segments.push({ x1:o.b, y1:o.ya, x2:o.b, y2:o.yb, color:ink, width:2, dash:o.dash ? [4, 4] : null, alpha:o.alpha == null ? 1 : o.alpha });
    if (o.run) sc.labels.push({ x:(o.a + o.b) / 2, y:o.ya, text:o.run, align:"center", baseline:o.yb >= o.ya ? "top" : "bottom", dy:o.yb >= o.ya ? 6 : -6, bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif"), color:ink });
    var nearR = o.view && o.b > o.view.xmin + 0.8 * (o.view.xmax - o.view.xmin);
    if (o.rise && !flat) sc.labels.push({ x:o.b, y:(o.ya + o.yb) / 2, text:o.rise, dx:nearR ? -8 : 8, align:nearR ? "right" : "left", bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif"), color:ink });
  }
  if (o.slope) sc.labels.push({ x:(o.a + o.b) / 2, y:(o.ya + o.yb) / 2, text:o.slope, align:"right", dx:-10, dy:o.yb >= o.ya ? -14 : 14, bg:true, font:"600 13px " + (css("--font-ui") || "sans-serif"), color:ink2 });
  var pc = o.pointColor || ink;
  sc.points.push({ x:o.a, y:o.ya, r:o.ring ? 7 : 5, color:pc, ring:!!o.ring, label:o.nameA || "" });
  sc.points.push({ x:o.b, y:o.yb, r:o.ring ? 7 : 5, color:pc, ring:!!o.ring, label:o.nameB || "" });
}
function newScene(view, extra){ return Object.assign({ view:view, curves:[], lines:[], segments:[], points:[], labels:[] }, extra || {}); }

// ---------- hero: ball height, secant whose second point slides from t = 1 to 2 to 4 ----------
function hero(f){
  if (!f.canvas) return;
  var H = function(t){ return -5 * t * t + 20 * t + 1; };
  var p = new MV.Plot(f.canvas, { xmin:-0.5, xmax:4.45, ymin:-2.5, ymax:25 });
  var st = { draw:0, q:null, tri:0, sec:0 };
  var CAPS = ["15 m in 1 s: 15 m/s", "20 m in 2 s: 10 m/s", "0 m in 4 s: 0 m/s"];
  p.render = function(){
    var sc = newScene({ xmin:-0.5, xmax:4.45, ymin:-2.5, ymax:25 }, { xLabel:"t (s)", yLabel:"h (m)" }), desc = "Graph of the ball’s height h(t) = −5t² + 20t + 1 from t = 0 to 4 s.";
    if (st.draw > 0) sc.curves.push({ f:H, color:css("--pen"), width:3, domain:[0, 4 * st.draw] });
    if (st.q != null) {
      var q = st.q, yq = H(q), dy = yq - 1, show = st.tri >= 1;
      if (st.sec > 0) {
        var m = dy / q, x0 = -0.5, x1 = 0 + (4.45 - 0) * st.sec;
        sc.segments.push({ x1:x0, y1:1 + m * x0, x2:x1, y2:1 + m * x1, color:css("--ink-2"), width:2 });
      }
      if (st.tri > 0) {
        sc.segments.push({ x1:0, y1:1, x2:q, y2:1, color:css("--ink"), width:2, alpha:st.tri });
        if (Math.abs(dy) > 0.05) sc.segments.push({ x1:q, y1:1, x2:q, y2:yq, color:css("--ink"), width:2, alpha:st.tri });
      }
      if (show) {
        var font = "600 13px " + (css("--font-ui") || "sans-serif");
        sc.labels.push({ x:q / 2, y:1, text:"run " + num(q, 1) + " s", align:"center", baseline:"top", dy:6, bg:true, font:font });
        if (Math.abs(dy) > 0.5) sc.labels.push({ x:q, y:(1 + yq) / 2, text:"rise " + num(dy, 1) + " m", dx:8, bg:true, font:font, align:q > 3.2 ? "right" : "left" });
      }
      sc.points.push({ x:0, y:1, r:5.5, color:css("--ink"), label:"P" }, { x:q, y:yq, r:5.5, color:css("--ink"), label:"Q" });
      desc += " Secant from (0, 1) to (" + num(q, 1) + ", " + num(yq, 1) + "), slope " + num(dy / q, 1) + " metres per second.";
    }
    sc.describe = desc;
    p.draw(sc);
  };
  var setCap = function(i){ f.cap.innerHTML = CAPS[i]; };
  if (MV.reduceMotion) { st = { draw:1, q:4, tri:1, sec:1 }; f.cap.innerHTML = CAPS.join("<br>"); p.render(); return; }
  p.render();
  function moveTo(target, dur, done){ var from = st.q; MV.tween({ dur:dur, step:function(t){ st.q = from + (target - from) * t; p.render(); }, done:done }); }
  MV.tween({ dur:1300, ease:lin, step:function(t){ st.draw = t; p.render(); }, done:function(){
    MV.wait(250, function(){
      st.q = 1; p.render();
      MV.tween({ dur:550, step:function(t){ st.tri = t; p.render(); }, done:function(){
        MV.tween({ dur:650, step:function(t){ st.sec = t; p.render(); }, done:function(){
          setCap(0);
          MV.wait(1800, function(){ moveTo(2, 1100, function(){ setCap(1);
            MV.wait(1800, function(){ moveTo(4, 1500, function(){ setCap(2);
              MV.wait(1600, function(){ f.cap.innerHTML = CAPS.join("<br>"); });
            }); });
          }); });
        } });
      } });
    });
  } });
}

// ---------- Explore: secant lab ----------
var SIT = {
  taxi:{ id:"taxi", name:"Taxi fare", f:function(d){ return 3.5 + 2 * d; }, a:0, b:10, step:1, def:[2, 6], def2:[6, 9],
    view:{ xmin:-0.8, xmax:10.8, ymin:-2.5, ymax:27 }, xv:"d", yv:"C", xu:"km", yu:"$", money:true, long:"dollars per kilometre",
    eq:"C(d) = 3.5 + 2d", what:"Taxi fare in dollars for a trip of <i>d</i> km (linear)" },
  ball:{ id:"ball", name:"Ball", f:function(t){ return -5 * t * t + 20 * t + 1; }, a:0, b:4, step:1, def:[0, 1], def2:[2, 4],
    view:{ xmin:-0.4, xmax:4.4, ymin:-2.5, ymax:25 }, xv:"t", yv:"h", xu:"s", yu:"m", noun:"the ball", what2:"height", long:"metres per second",
    eq:"h(t) = -5t^2 + 20t + 1", what:"Height of a ball in metres, <i>t</i> seconds after it’s thrown (quadratic)" },
  bact:{ id:"bact", name:"Bacteria", f:function(t){ return 200 * Math.pow(2, t); }, a:0, b:5, step:1, def:[0, 1], def2:[3, 5],
    view:{ xmin:-0.45, xmax:5.45, ymin:-450, ymax:7000 }, xv:"t", yv:"N", xu:"h", yu:"bacteria", long:"bacteria per hour",
    eq:"N(t) = 200 · 2^t", what:"Number of bacteria after <i>t</i> hours (exponential)" },
  wheel:{ id:"wheel", name:"Ferris wheel", f:function(t){ return 11 - 10 * Math.cos(Math.PI * t / 4); }, a:0, b:16, step:2, def:[0, 4], def2:[8, 12],
    view:{ xmin:-1, xmax:17, ymin:-2.5, ymax:25 }, xv:"t", yv:"h", xu:"s", yu:"m", noun:"the rider", what2:"height", long:"metres per second",
    eq:"h(t)", what:"Rider’s height in metres after <i>t</i> seconds (sinusoidal; module 35 builds its formula)" }
};
var SIT_ORDER = ["taxi", "ball", "bact", "wheel"];
var NAME = { P:"P", Q:"Q", P2:"P_2", Q2:"Q_2" };
function val(s, x){ return r6(s.f(x)); }
function money(v, dp){ var a = Math.abs(v), t = Math.abs(a - Math.round(a)) < 1e-9 ? String(Math.round(a)) : a.toFixed(dp == null ? 2 : dp); return (v < -1e-9 ? MINUS : "") + "$" + t; }
function xs(s, x, dp){ return num(x, dp == null ? 3 : dp) + " " + s.xu; }
function ys(s, y, dp){ return s.money ? money(y, dp) : num(y, dp == null ? 3 : dp) + " " + s.yu; }
function yNum(s, y){ return s.money ? money(y) : num(y); }
function isInt(v){ return Math.abs(v - Math.round(v)) < 1e-9; }
function rateNum(v){ if (isInt(v)) return num(Math.round(v)); var fr = MV.frac(v, 16); return fr.indexOf("/") > 0 ? fr + " ≈ " + num(v, 2) : num(v, 2); }
function rateTxt(s, v){
  if (s.money) return (v < -1e-9 ? MINUS : "") + "$" + rateNum(Math.abs(v)) + "/km";
  return rateNum(v) + (s.id === "bact" ? " bacteria per hour" : " m/s");
}
function ivM(a, b){ return MV.m("[" + num(a) + ", " + num(b) + "]"); }
function meaning(s, a, b){
  var v = (val(s, b) - val(s, a)) / (b - a), abs = Math.abs(v), amt = isInt(abs) ? num(Math.round(abs)) : "about " + num(abs, 2);
  if (abs < 1e-9) return "Same " + (s.what2 || "value") + " at both times: average rate 0 m/s, even though " + (s.noun || "it") + " moved.";
  var from = "From " + xs(s, a) + " to " + xs(s, b) + " ";
  if (s.money) return from + "the fare rose $" + amt.replace("about ", "") + " per kilometre, on average.";
  if (s.id === "bact") return from + "the count grew by " + amt + " bacteria per hour, on average.";
  return from + s.noun + " " + (v > 0 ? "rose " : "fell ") + amt + " m per second, on average.";
}

function explore(host, api){
  var S = api.S;
  if (!SIT[S.sit]) { S.sit = "ball"; S.P = 0; S.Q = 1; S.P2 = 2; S.Q2 = 4; S.tri = true; S.cmp = false; }
  var X = { anim:null, extra:null }, busy = false;
  var L = MV.pgLayout(host, { aria:"Secant lab graph" });
  L.ctrl.innerHTML = '<div class="sl-row"><span class="sl-lab">Situation</span><span class="chips" id="sl-sit" role="group" aria-label="Situation"></span></div>' +
    '<div class="stp-row" id="sl-steps" role="group" aria-label="Move the points"></div>' +
    '<p class="tiny muted sl-how">Drag the points along the curve, or tap a point and use the arrow keys. They snap to the grid.</p>' +
    '<div id="sl-tri"></div><div id="sl-cmp"></div>';
  var plot = new MV.Plot(L.canvas, SIT[S.sit].view);
  var legEl = document.createElement("p"); legEl.className = "sl-leg"; L.graph.appendChild(legEl);
  var dstep = { x:SIT[S.sit].step, y:1 };
  function pos(id){ return X.anim && X.anim[id] != null ? X.anim[id] : S[id]; }

  function draw(){
    var s = SIT[S.sit], sc = newScene(s.view, { xLabel:s.xv + " (" + s.xu + ")", yLabel:s.yv + " (" + s.yu + ")" });
    sc.curves.push({ f:s.f, color:css("--pen"), width:3, domain:[s.a, s.b] });
    var dp = X.anim ? 1 : 3, desc = s.name + ": " + MV.plain(MV.m(s.eq)) + ".", leg = [];
    function pair(a, b, second, nA, nB){
      var ya = s.f(a), yb = s.f(b), v = (yb - ya) / (b - a);
      secantScene(sc, { a:a, ya:ya, b:b, yb:yb, dash:second ? [7, 6] : null, alpha:second ? 0.75 : 1, tri:S.tri, view:s.view,
        run:second ? null : "run " + xs(s, b - a, dp), rise:second ? null : "rise " + ys(s, yb - ya, X.anim ? 0 : 2),
        nameA:nA, nameB:nB, ring:true, pointColor:second ? css("--ink-2") : css("--ink") });
      leg.push([second ? "dash" : "solid", (second ? "Secant " + MV.m("P_2Q_2") : "Secant " + MV.m("PQ")) + ": slope " + (X.anim ? num(v, 1) : rateNum(v))]);
      desc += (second ? " Second secant" : " Secant") + " from (" + num(a, dp) + ", " + num(ya, 1) + ") to (" + num(b, dp) + ", " + num(yb, 1) + "), slope " + num(v, 2) + " " + s.long + ".";
    }
    if (S.cmp) pair(pos("P2"), pos("Q2"), true, "P₂", "Q₂");
    pair(pos("P"), pos("Q"), false, "P", "Q");
    (X.extra || []).forEach(function(e){
      var ya = s.f(e[0]), yb = s.f(e[1]);
      sc.lines.push({ p:[e[0], ya], q:[e[1], yb], color:css("--ink-2"), width:2, dash:[2, 5] });
      sc.points.push({ x:e[0], y:ya, r:5, color:css("--ink-2") }, { x:e[1], y:yb, r:5, color:css("--ink-2") });
      leg.push(["dot", "Secant on " + ivM(e[0], e[1]) + ": slope " + rateNum((yb - ya) / (e[1] - e[0]))]);
      desc += " Third secant on [" + num(e[0]) + ", " + num(e[1]) + "], slope " + num((yb - ya) / (e[1] - e[0]), 2) + ".";
    });
    sc.describe = desc;
    legEl.innerHTML = leg.reverse().map(function(l){ return '<span><i class="sl-sw ' + l[0] + '" aria-hidden="true"></i>' + l[1] + "</span>"; }).join("");
    plot.draw(sc);
  }
  plot.render = draw;

  function pairRows(s, a, b, nA, nB, short){
    var ya = val(s, a), yb = val(s, b), dy = r6(yb - ya), dx = r6(b - a), v = dy / dx;
    var pts = '<span class="nw">' + MV.m(nA) + "(" + num(a) + ", " + num(ya, 2) + ')</span>, <span class="nw">' + MV.m(nB) + "(" + num(b) + ", " + num(yb, 2) + ")</span>";
    var rise = yNum(s, yb) + " − " + yNum(s, ya) + " = " + ys(s, dy), run = num(b) + " − " + num(a) + " = " + xs(s, dx);
    var rows = short ? [["Rise " + MV.m("Δy") + " and run " + MV.m("Δx"), rise + "<br>" + run]] : [["Points", pts], ["Rise " + MV.m("Δy"), rise], ["Run " + MV.m("Δx"), run]];
    rows.push(["Average rate", ys(s, dy) + " ÷ " + xs(s, dx) + " = <strong>" + rateTxt(s, v) + "</strong>"], ["Meaning", meaning(s, a, b)]);
    if (!short) rows.push(["Secant slope", '<strong>' + rateNum(v) + '</strong> <span class="tiny muted">The secant’s slope is the average rate.</span>']);
    return rows;
  }
  function compareTxt(s){
    var a = S.P, b = S.Q, c = S.P2, d = S.Q2, r1 = (val(s, b) - val(s, a)) / (b - a), r2 = (val(s, d) - val(s, c)) / (d - c);
    var i1 = ivM(a, b), i2 = ivM(c, d);
    if (Math.abs(r1 - r2) < 1e-9) return "Same average rate on both intervals: " + rateTxt(s, r1) + ".";
    var big = r1 > r2 ? [i1, r1, i2, r2] : [i2, r2, i1, r1], h = "Bigger: " + big[0] + " at " + rateTxt(s, big[1]) + ", against " + big[2] + " at " + rateTxt(s, big[3]) + ".";
    if (big[3] > 1e-9 && isInt(big[1] / big[3])) h += " That’s " + Math.round(big[1] / big[3]) + " times as big.";
    return h;
  }
  function readout(){
    var s = SIT[S.sit], rows;
    if (!S.cmp) rows = pairRows(s, S.P, S.Q, "P", "Q");
    else {
      rows = [["Compare", "<strong>" + compareTxt(s) + "</strong>"]].concat(
        [['<span class="rd-h">' + MV.m("P") + " to " + MV.m("Q") + ", solid secant</span>", ivM(S.P, S.Q)]], pairRows(s, S.P, S.Q, "P", "Q", true),
        [['<span class="rd-h">' + MV.m("P_2") + " to " + MV.m("Q_2") + ", dashed secant</span>", ivM(S.P2, S.Q2)]], pairRows(s, S.P2, S.Q2, "P_2", "Q_2", true));
    }
    (X.extra || []).forEach(function(e){ rows.push(["Also shown", ivM(e[0], e[1]) + ": " + rateTxt(s, (val(s, e[1]) - val(s, e[0])) / (e[1] - e[0]))]); });
    L.read.innerHTML = MV.readoutHTML(rows);
  }
  function paintCtl(){
    MV.keepFocus($("#sl-sit", host), function(){
      $("#sl-sit", host).innerHTML = SIT_ORDER.map(function(id){ var on = id === S.sit; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-sit="' + id + '" data-k="sit' + id + '" aria-pressed="' + on + '">' + SIT[id].name + "</button>"; }).join("");
    });
    var s = SIT[S.sit], ids = S.cmp ? ["P", "Q", "P2", "Q2"] : ["P", "Q"];
    MV.keepFocus($("#sl-steps", host), function(){
      $("#sl-steps", host).innerHTML = ids.map(function(id){
        var nm = MV.m(NAME[id]), plainNm = MV.plain(nm);
        return '<span class="stp"><span class="stp-l">' + nm + '</span><button type="button" class="btn ghost sm" data-mv="' + id + '" data-d="-1" data-k="st' + id + 'm" aria-label="Move ' + plainNm + ' left"' + (busy ? " disabled" : "") + '>◀</button>' +
          '<span class="stp-v">' + MV.m(s.xv) + " = " + xs(s, S[id]) + '</span><button type="button" class="btn ghost sm" data-mv="' + id + '" data-d="1" data-k="st' + id + 'p" aria-label="Move ' + plainNm + ' right"' + (busy ? " disabled" : "") + ">▶</button></span>";
      }).join("");
    });
  }
  function paint(){
    var s = SIT[S.sit];
    L.cap.innerHTML = MV.m(s.eq) + '<span class="sl-what">' + s.what + "</span>";
    paintCtl(); readout(); draw();
  }
  function partnerOK(id, x){
    var s = SIT[S.sit];
    if (x < s.a - 1e-9 || x > s.b + 1e-9) return false;
    if (id === "P") return x <= S.Q - s.step + 1e-9;
    if (id === "Q") return x >= S.P + s.step - 1e-9;
    if (id === "P2") return x <= S.Q2 - s.step + 1e-9;
    return x >= S.P2 + s.step - 1e-9;
  }
  function setPos(id, x){
    if (busy) return;
    var s = SIT[S.sit];
    x = r6(Math.round(x / s.step) * s.step);
    if (x === S[id]) return;
    if (!partnerOK(id, x)) {
      x = id === "P" ? Math.min(Math.max(x, s.a), S.Q - s.step) : id === "Q" ? Math.max(Math.min(x, s.b), S.P + s.step) : id === "P2" ? Math.min(Math.max(x, s.a), S.Q2 - s.step) : Math.max(Math.min(x, s.b), S.P2 + s.step);
      x = r6(x); if (x === S[id]) return;
    }
    S[id] = x; X.extra = null; api.save(); paint(); MV.changed();
  }
  function setSit(id, keep){
    var s = SIT[id]; S.sit = id; dstep.x = s.step;
    if (!keep) { S.P = s.def[0]; S.Q = s.def[1]; S.P2 = s.def2[0]; S.Q2 = s.def2[1]; }
    X.extra = null;
  }
  MV.drag(plot, { axis:"x", step:dstep, big:2,
    handles:function(){
      var s = SIT[S.sit], ids = S.cmp ? ["P2", "Q2", "P", "Q"] : ["P", "Q"];
      return ids.map(function(id){ var x = pos(id); return { id:id, x:x, y:s.f(x), label:"Point " + MV.plain(MV.m(NAME[id])) + " at " + s.xv + " = " + xs(s, x, 2) + ", " + s.yv + " = " + ys(s, s.f(x), 2) + ". Arrow keys move it along the curve." }; });
    },
    snap:function(x){ var s = SIT[S.sit]; return [Math.round(x / s.step) * s.step, 0]; },
    move:function(id, x){ setPos(id, x); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.sit) { if (b.dataset.sit === S.sit) return; setSit(b.dataset.sit); api.save(); paint(); MV.changed(); return; }
    if (b.dataset.mv) { var s = SIT[S.sit]; setPos(b.dataset.mv, S[b.dataset.mv] + (+b.dataset.d) * s.step); }
  });
  var triSeg = MV.seg($("#sl-tri", host), { label:"Rise-and-run triangle:", value:S.tri ? "on" : "off", options:[{ id:"on", t:"Show" }, { id:"off", t:"Hide" }],
    onChange:function(v){ S.tri = v === "on"; api.save(); draw(); } });
  var cmpSeg = MV.seg($("#sl-cmp", host), { label:"Compare two intervals:", value:S.cmp ? "on" : "off", options:[{ id:"off", t:"Off" }, { id:"on", t:"On" }],
    onChange:function(v){ if (busy) { cmpSeg.set(S.cmp ? "on" : "off"); return; } S.cmp = v === "on"; X.extra = null; api.save(); paint(); MV.changed(); } });
  setSit(S.sit, true);
  paint();

  function slide(to, dur, cb){
    var keys = Object.keys(to), from = {};
    keys.forEach(function(k){ from[k] = S[k]; });
    X.anim = {};
    MV.tween({ dur:dur, step:function(t){ keys.forEach(function(k){ X.anim[k] = from[k] + (to[k] - from[k]) * t; }); draw(); },
      done:function(){ keys.forEach(function(k){ S[k] = to[k]; }); X.anim = null; api.save(); paint(); cb(); } });
  }
  function chal(id){
    var s = SIT[S.sit], a = S.P, b = S.Q, k = a + "," + b, v = (val(s, b) - val(s, a)) / (b - a);
    if (id === "tc1") {
      if (S.sit !== "ball") return { ok:false, msg:"Choose the Ball situation first." };
      if (k === "0,2") return { ok:true };
      return { ok:false, msg:{ "0,1":"Too steep. Stretch the interval.", "1,2":"Too shallow.", "2,4":"Right size, but falling." }[k] || ("On " + ivM(a, b) + " the average rate is " + rateTxt(s, v) + ". You need 10 m/s.") };
    }
    if (id === "tc2") {
      if (S.sit !== "bact") return { ok:false, msg:"Choose the Bacteria situation first." };
      if (k === "2,4") return { ok:true };
      return { ok:false, msg:{ "3,4":"Too steep.", "1,3":"Too shallow.", "0,5":"Close, but 6200 ÷ 5 = 1240." }[k] || ("On " + ivM(a, b) + " the average rate is " + rateTxt(s, v) + ". You need exactly 1200 bacteria per hour.") };
    }
    if (id === "tc3") {
      if (S.sit !== "wheel") return { ok:false, msg:"Choose the Ferris wheel situation first." };
      if (b - a !== 4) return { ok:false, msg:"The interval must be 4 s long. Yours is " + num(b - a) + " s long." };
      if (k === "6,10") return { ok:true };
      if (k === "2,6" || k === "10,14") return { ok:false, msg:MV.md("Zero rate, but it contains a top (`t` = 4 or 12).") };
      return { ok:false, msg:"Rate " + rateTxt(s, v) + ": the heights differ." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        var st = p.start || {};
        X.extra = null; X.anim = null;
        setSit(st.sit); S.P = st.P; S.Q = st.Q; S.cmp = false; S.tri = true;
        cmpSeg.set("off"); triSeg.set("on"); api.save(); paint();
      },
      run:function(p, done){
        var r = p.run || {};
        busy = true; paintCtl();
        var fin = function(){ busy = false; paint(); MV.changed(); done(); };
        if (r.from) { S.cmp = true; Object.keys(r.from).forEach(function(k){ S[k] = r.from[k]; }); cmpSeg.set("on"); paint(); }
        MV.wait(350, function(){
          slide(r.to || {}, 1800, function(){
            if (r.extra) MV.wait(500, function(){ X.extra = [r.extra]; paint(); MV.wait(700, fin); });
            else MV.wait(250, fin);
          });
        });
      }
    },
    challenge:function(id){ return chal(id); }
  };
}

// ---------- Part 3: rates in context ----------
// @component N29 sentenceBuilder — a sentence with chip slots ("From ___ to ___, the ___ …"): tap a blank, then a chip
// from its bank; judge() checks each slot (chips marked ok:true), mark() colours slots, lock() freezes it. Reused by 23, 35, 37.
function sentenceBuilder(host, o){
  var val = Object.assign({}, o.value || {}), ids = [], active = null, locked = !!o.locked, marks = {};
  o.tpl.replace(/\{(\w+)\}/g, function(_, id){ ids.push(id); return ""; });
  function nextEmpty(after){
    var i0 = after ? ids.indexOf(after) + 1 : 0;
    for (var k = 0; k < ids.length; k++) { var id = ids[(i0 + k) % ids.length]; if (val[id] == null) return id; }
    return null;
  }
  function paint(focusSel){
    var h = '<p class="sb-line">' + o.tpl.split(/(\{\w+\})/).map(function(pt){
      var m = /^\{(\w+)\}$/.exec(pt);
      if (!m) return pt;
      var id = m[1], sl = o.slots[id], c = val[id] != null ? sl.chips[val[id]] : null, n = ids.indexOf(id) + 1;
      return '<button type="button" class="sb-slot' + (c ? " full" : "") + (active === id ? " on" : "") + (marks[id] ? " " + marks[id] : "") + '" data-sb-slot="' + id + '" data-k="' + o.key + "s" + id + '" aria-pressed="' + (active === id) + '" aria-label="Blank ' + n + " of " + ids.length + ", " + MV.esc(sl.label) + ": " + (c ? MV.esc(MV.plain(c.t)) : "empty") + (marks[id] === "bad" ? " (needs another look)" : "") + '"' + (locked ? " disabled" : "") + ">" + (c ? c.t : "<span class=\"vh\">empty</span>") + "</button>";
    }).join("") + "</p>";
    if (active && !locked) {
      var sl = o.slots[active];
      h += '<div class="sb-bank" role="group" aria-label="Choices for ' + MV.esc(sl.label) + '"><span class="sb-bank-lab">' + MV.cap(sl.label) + ":</span>" + sl.chips.map(function(c, i){
        return '<button type="button" class="chip' + (val[active] === i ? " on" : "") + '" data-sb-chip="' + i + '" data-k="' + o.key + "c" + active + i + '" aria-pressed="' + (val[active] === i) + '">' + c.t + "</button>";
      }).join("") + "</div>";
    } else if (!locked) h += '<p class="tiny muted sb-tip">Tap a blank, then choose the words for it.</p>';
    MV.keepFocus(host, function(){ host.innerHTML = h; });
    if (focusSel) { var f = host.querySelector(focusSel); if (f) f.focus({ preventScroll:true }); }
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || locked) return;
    if (b.dataset.sbSlot) { active = active === b.dataset.sbSlot ? null : b.dataset.sbSlot; paint(active ? ".sb-bank .chip" : null); return; }
    if (b.dataset.sbChip != null && active) {
      var cur = active; val[cur] = +b.dataset.sbChip; marks[cur] = null;
      active = nextEmpty(cur);
      paint(active ? ".sb-bank .chip" : '[data-sb-slot="' + cur + '"]');
      if (o.onChange) o.onChange(Object.assign({}, val));
    }
  });
  paint();
  return {
    get:function(){ return Object.assign({}, val); },
    judge:function(){
      var empty = [], bad = [], mk = {};
      ids.forEach(function(id){ var c = val[id] != null ? o.slots[id].chips[val[id]] : null; if (!c) empty.push(id); else if (!MV.ok(c)) { bad.push({ id:id, fb:c.fb || "" }); mk[id] = "bad"; } else mk[id] = "good"; });
      return { ok:!empty.length && !bad.length, empty:empty, bad:bad, marks:mk };
    },
    mark:function(m){ marks = m || {}; active = null; paint(); },
    lock:function(on){ locked = !!on; active = null; paint(); }
  };
}

var GEN = { dy:"subtract the earlier value from the later one.", dx:"subtract the earlier time from the later one, in the units shown.", rate:"divide the change in the quantity by the change in time." };
function fbList(kind, head, msgs){
  return '<div class="fb ' + kind + '" role="status"><p><strong>' + head + "</strong></p>" + (msgs.length ? "<ul>" + msgs.map(function(m){ return "<li>" + m + "</li>"; }).join("") + "</ul>" : "") + "</div>";
}
function rateRound(el, r, x, api, onSolved){
  var key = r.id, plot = null;
  el.innerHTML = '<div class="sym cx-grid"><div><p class="cx-prompt">' + r.prompt + "</p>" + MV.tableHTML({ head:r.table.head, rows:r.table.rows, caption:r.table.caption }) +
    (r.pts ? '<canvas class="plot cx-plot" role="img" aria-label="Data points from the table"></canvas>' : "") + "</div><div>" +
    '<h4 class="cx-h">1. Work out the changes</h4>' + r.boxes.map(function(bx){
      return '<div class="cx-box"><label for="cx-' + key + bx.k + '">' + bx.label + '</label><span class="cx-in"><input id="cx-' + key + bx.k + '" data-bx="' + bx.k + '" type="number" step="any" autocomplete="off" value="' + MV.esc(x.v[bx.k]) + '">' + '<span class="u">' + (bx.unit || "") + "</span>" + "</span></div>";
    }).join("") +
    '<h4 class="cx-h">2. ' + r.unitLabel + '</h4><div class="chips cx-units" role="group" aria-label="' + MV.esc(MV.plain(r.unitLabel)) + '"></div>' +
    '<h4 class="cx-h">3. Say what it means</h4><div class="cx-sb"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-act="cxcheck" data-k="' + key + 'chk">Check</button></div><div class="cx-fb" aria-live="polite"></div>' +
    '<details class="alg"><summary>Check it with algebra</summary><p style="margin:10px 0 0">' + r.alg + "</p></details></div></div>";
  var unitMark = null;
  function paintUnits(){
    var box = $(".cx-units", el);
    MV.keepFocus(box, function(){
      box.innerHTML = r.units.map(function(u, i){ var on = x.unit === i; return '<button type="button" class="chip' + (on ? " on" : "") + (on && unitMark ? " " + unitMark : "") + '" data-unit="' + i + '" data-k="' + key + "u" + i + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + u.t + "</button>"; }).join("");
    });
  }
  var sb = sentenceBuilder($(".cx-sb", el), { tpl:r.sentence, slots:r.slots, value:x.sent, key:key + "sb", locked:x.solved, onChange:function(v){ x.sent = v; api.save(); } });
  if (r.pts) {
    plot = new MV.Plot($(".cx-plot", el), r.view);
    plot.render = function(){
      var sc = newScene(r.view, { xLabel:r.xLabel, yLabel:r.yLabel, data:r.pts.map(function(p){ return { x:p[0], y:p[1] }; }) });
      var desc = "Data points from the table: " + r.pts.map(function(p){ return "(" + num(p[0]) + ", " + num(p[1]) + ")"; }).join(", ") + ".";
      if (x.solved) {
        var A = MV.ans(r), a = r.iv[0], b = r.iv[1], pa = r.pts.filter(function(p){ return p[0] === a; })[0], pb = r.pts.filter(function(p){ return p[0] === b; })[0];
        secantScene(sc, { a:a, ya:pa[1], b:b, yb:pb[1], tri:true, run:"run " + num(A.dx) + " min", rise:"rise " + num(A.dy) + " L", slope:"slope " + num(A.rate), nameA:"(" + a + ", " + pa[1] + ")", nameB:"(" + b + ", " + pb[1] + ")" });
        desc += " Secant from (" + a + ", " + pa[1] + ") to (" + b + ", " + pb[1] + "), slope " + num(A.rate) + " litres per minute.";
      }
      sc.describe = desc;
      plot.draw(sc);
    };
    plot.render();
  }
  function paintState(msgs){
    var fb = $(".cx-fb", el);
    $$("[data-bx]", el).forEach(function(i){ i.disabled = x.solved; });
    $('[data-act="cxcheck"]', el).disabled = x.solved;
    if (x.solved) fb.innerHTML = '<div class="fb good" role="status"><p><strong>✓ Round complete.</strong> ' + r.done + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else fb.innerHTML = msgs && msgs.length ? fbList("bad", "✗ Not quite. Fix these, then check again:", msgs) : "";
  }
  el.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.bx; if (!k) return; x.v[k] = e.target.value; e.target.classList.remove("good", "bad"); api.save(); });
  el.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.bx) { e.preventDefault(); check(); } });
  el.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.unit != null) { x.unit = +b.dataset.unit; unitMark = null; api.save(); paintUnits(); return; }
    if (b.dataset.act === "cxcheck") check();
  });
  function check(){
    if (x.solved) return;
    var A = MV.ans(r), msgs = [];
    r.boxes.forEach(function(bx){
      var inp = $("#cx-" + key + bx.k, el), p = MV.parseNum(x.v[bx.k]), good = false, m = null;
      if (!p || p.length !== 1) m = "enter a number.";
      else if (Math.abs(p[0] - A[bx.k]) < 1e-6) good = true;
      else { var w = ((r.wrong || {})[bx.k] || []).filter(function(w){ return Math.abs(w.v - p[0]) < 1e-6; })[0]; m = w ? w.fb : GEN[bx.k]; }
      inp.classList.toggle("good", good); inp.classList.toggle("bad", !good);
      if (!good) msgs.push("<strong>" + bx.label + ":</strong> " + m);
    });
    if (x.unit == null) { unitMark = null; msgs.push("<strong>Units:</strong> choose the units of the rate."); }
    else if (!MV.ok(r.units[x.unit])) { unitMark = "bad"; msgs.push("<strong>Units:</strong> " + r.units[x.unit].fb); }
    else unitMark = "good";
    var j = sb.judge(); sb.mark(j.marks);
    if (j.empty.length) msgs.push("<strong>Sentence:</strong> fill every blank.");
    var seen = {};
    j.bad.forEach(function(b){ if (seen[b.fb]) return; seen[b.fb] = 1; msgs.push("<strong>Sentence (" + MV.esc(r.slots[b.id].label) + "):</strong> " + b.fb); });
    if (!msgs.length) { x.solved = true; x.first = x.tries === 0; sb.lock(true); onSolved(); }
    else x.tries++;
    api.save(); paintUnits(); paintState(msgs); if (plot) plot.render(); MV.focusFb(el);
  }
  paintUnits(); paintState();
  return { redraw:function(){ if (plot) plot.render(); } };
}

// Vase for round C3: radius 6 + h/2 cm, steady pour, full (12 cm) after 40 s, so depth h(t) = 12((1 + 7t/40)^(1/3) − 1).
function vDepth(t){ return 12 * (Math.cbrt(1 + 7 * t / 40) - 1); }
function sketchRound(el, r, x, api, onSolved){
  var rows = [0, 10, 20, 30].map(function(t){ var d = vDepth(t + 10) - vDepth(t); return ["[" + t + ", " + (t + 10) + "]", "≈ " + num(d, 1) + " cm", "≈ " + num(d / 10, 2) + " cm/s"]; });
  el.innerHTML = '<div class="sym cx-grid"><div><p class="cx-prompt">' + r.prompt + '</p><div class="opts cx-sk" role="radiogroup" aria-label="Depth–time sketches"></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-act="skcheck" data-k="' + r.id + 'chk">Check</button></div><div class="cx-fb" aria-live="polite"></div></div>' +
    '<div><div class="vase-row"><canvas class="plot square cx-vase" role="img" aria-label="A vase, narrow at the bottom and wide at the top"></canvas><canvas class="plot cx-dt" role="img" aria-label="Depth–time graph"></canvas></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="pour" data-k="' + r.id + 'pour">Pour the water</button><span class="tiny muted cx-pour-note"></span></div>' +
    '<details class="alg"><summary>Check it with algebra</summary><p style="margin:10px 0 8px">' + r.alg + "</p>" +
    MV.tableHTML({ head:["Interval (s)", "Depth change", "Average rate"], rows:rows, caption:"Average rate of the depth on equal 10-second intervals" }) + "</details></div></div>";
  var tNow = x.poured ? 40 : 0, pouring = false, last = null;
  var vase = new MV.Plot($(".cx-vase", el), { xmin:-15, xmax:15, ymin:-1.5, ymax:15 });
  var VV = { xmin:-15, xmax:15, ymin:-1.5, ymax:15 }, DV = { xmin:-4.5, xmax:44, ymin:-1.4, ymax:13.6 };
  vase.render = function(){
    var h = vDepth(tNow);
    vase.draw({ view:VV, grid:false, axes:false, describe:"A vase, narrow at the bottom and wide at the top, " + (h > 0.01 ? "filled to a depth of " + num(h, 1) + " cm." : "empty."),
      after:function(ctx, p){
        var w = function(y){ return 6 + y / 2; };
        if (h > 0.01) {
          ctx.save(); ctx.globalAlpha = 0.3; ctx.fillStyle = css("--pen"); ctx.beginPath();
          ctx.moveTo(p.X(-w(0)), p.Y(0)); ctx.lineTo(p.X(w(0)), p.Y(0)); ctx.lineTo(p.X(w(h)), p.Y(h)); ctx.lineTo(p.X(-w(h)), p.Y(h)); ctx.closePath(); ctx.fill(); ctx.restore();
        }
        if (pouring) { ctx.save(); ctx.strokeStyle = css("--pen"); ctx.globalAlpha = 0.6; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.X(0), p.Y(15)); ctx.lineTo(p.X(0), p.Y(h)); ctx.stroke(); ctx.restore(); }
        ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.beginPath();
        ctx.moveTo(p.X(-12), p.Y(12)); ctx.lineTo(p.X(-6), p.Y(0)); ctx.lineTo(p.X(6), p.Y(0)); ctx.lineTo(p.X(12), p.Y(12)); ctx.stroke(); ctx.restore();
        ctx.fillStyle = css("--ink"); ctx.font = "600 13px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(num(tNow, 0) + " s · depth " + num(h, 1) + " cm", p.W / 2, 4);
      } });
  };
  var dt = new MV.Plot($(".cx-dt", el), DV);
  dt.render = function(){
    var pts = [], sc = { view:DV, xLabel:"t (s)", yLabel:"depth (cm)", xTicks:{ step:10 }, yTicks:{ step:3 }, curves:[], points:pts };
    if (tNow > 0.01) sc.curves.push({ f:vDepth, color:css("--pen"), width:3, domain:[0, tNow] });
    if (!pouring && tNow >= 40) [0, 10, 20, 30, 40].forEach(function(t){ pts.push({ x:t, y:vDepth(t), r:4.5, color:css("--ink") }); });
    sc.describe = tNow > 0.01 ? "Depth of the water against time, from 0 to " + num(tNow, 0) + " s: rising, steep at first and then less steep, reaching 12 cm at 40 s." : "Empty depth–time graph. Pour the water to draw it.";
    dt.draw(sc);
  };
  function paintOpts(){
    var box = $(".cx-sk", el), ri = MV.right(r.options);
    MV.keepFocus(box, function(){
      box.innerHTML = r.options.map(function(o, i){
        var c = "opt"; if (x.choice === i) c += " picked"; if (x.solved && i === ri) c += " right"; else if (last === i && i !== ri) c += " wrong";
        return '<button type="button" class="' + c + '" role="radio" aria-checked="' + (x.choice === i) + '" data-sk="' + i + '" data-k="' + r.id + "o" + i + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>";
      }).join("");
    });
    $('[data-act="skcheck"]', el).disabled = x.solved || x.choice == null;
    var pb = $('[data-act="pour"]', el); pb.disabled = pouring || !x.checked;
    $(".cx-pour-note", el).textContent = x.checked ? (x.poured ? "Pour again to watch it fill." : "Watch the depth rise as the vase fills.") : "Check your choice first, then pour to test it.";
  }
  function paintFb(){
    var fb = $(".cx-fb", el), ri = MV.right(r.options);
    if (x.solved) fb.innerHTML = '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + r.options[ri].fb + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (last != null) fb.innerHTML = '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + r.options[last].fb + " Try again.</p></div>";
    else fb.innerHTML = "";
  }
  el.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.sk != null) { x.choice = +b.dataset.sk; last = null; api.save(); paintOpts(); paintFb(); return; }
    if (b.dataset.act === "skcheck") {
      if (x.choice == null || x.solved) return;
      x.checked = true;
      if (MV.ok(r.options[x.choice])) { x.solved = true; x.first = x.tries === 0; last = null; onSolved(); }
      else { x.tries++; last = x.choice; }
      api.save(); paintOpts(); paintFb(); MV.focusFb(el); return;
    }
    if (b.dataset.act === "pour") {
      pouring = true; tNow = 0; paintOpts();
      MV.tween({ dur:4200, ease:lin, step:function(t){ tNow = 40 * t; vase.render(); dt.render(); },
        done:function(){ pouring = false; tNow = 40; x.poured = true; api.save(); vase.render(); dt.render(); paintOpts(); } });
    }
  });
  paintOpts(); paintFb(); vase.render(); dt.render();
  return { redraw:function(){ vase.render(); dt.render(); } };
}

function part3(host, api){
  var R = api.content.rounds, S = api.S;
  S.i = Math.min(S.i || 0, R.length - 1); S.r = S.r || {};
  host.innerHTML = '<div class="chips cx-ch" role="group" aria-label="Rounds"></div>' + R.map(function(r, i){ return '<div class="cx-round" data-round="' + i + '"' + (i === S.i ? "" : " hidden") + "></div>"; }).join("");
  var chipBox = $(".cx-ch", host);
  function rs(r){ return S.r[r.id] || (S.r[r.id] = r.kind === "sketch" ? { choice:null, tries:0, solved:false, first:null, checked:false, poured:false } : { v:{ dy:"", dx:"", rate:"" }, unit:null, sent:{}, tries:0, solved:false, first:null }); }
  function chips(){
    MV.keepFocus(chipBox, function(){
      chipBox.innerHTML = R.map(function(r, i){ var x = S.r[r.id], on = i === S.i; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-round-i="' + i + '" data-k="cxr' + i + '" aria-pressed="' + on + '">' + (x && x.solved ? "✓ " : "") + r.name + "</button>"; }).join("");
    });
  }
  var ctl = R.map(function(r, i){
    var el = $('[data-round="' + i + '"]', host);
    return r.kind === "sketch" ? sketchRound(el, r, rs(r), api, chips) : rateRound(el, r, rs(r), api, chips);
  });
  chipBox.addEventListener("click", function(e){
    var b = e.target.closest("[data-round-i]"); if (!b) return;
    S.i = +b.dataset.roundI; api.save();
    $$(".cx-round", host).forEach(function(el, i){ el.hidden = i !== S.i; });
    chips(); ctl[S.i].redraw();
  });
  chips();
}

// ---------- Performance task: plan the road trip ----------
var task = (function(){
  var api, plot;
  function parse(v){ var r = MV.parseNum(v); return r && r.length === 1 ? r[0] : NaN; }
  function okD(v){ return Number.isInteger(v) && v >= 0 && v <= 300 && v % 10 === 0; }
  function read(){
    var s = api ? api.S : {}, raw = (s.d || ["", "", "", ""]).slice(0, 4), d = [0].concat(raw.map(parse));
    return { raw:raw, d:d, valid:d.every(okD) };
  }
  function hours(d){ return [1, 2, 3, 4].map(function(i){ return d[i] - d[i - 1]; }); }
  function draw(){
    var x = read(), d = x.d, segs = [], pts = [], labels = [], font = "600 12px " + (css("--font-ui") || "sans-serif");
    var known = d.map(function(v){ return okD(v); }), top = Math.max.apply(null, d.filter(function(v, i){ return known[i]; }).concat([200]));
    var view = { xmin:-0.35, xmax:4.45, ymin:-top * 0.09, ymax:top * 1.14 + 10 };
    for (var i = 0; i < 4; i++) if (known[i] && known[i + 1]) {
      segs.push({ x1:i, y1:d[i], x2:i + 1, y2:d[i + 1], color:css("--pen"), width:3 });
      labels.push({ x:i + 0.5, y:(d[i] + d[i + 1]) / 2, text:num(d[i + 1] - d[i]) + " km/h", align:"center", dy:-14, bg:true, font:font, color:css("--ink") });
    }
    if (known[4]) segs.unshift({ x1:0, y1:0, x2:4, y2:d[4], color:css("--ink-2"), width:2 });
    d.forEach(function(v, i){ if (known[i]) pts.push({ x:i, y:v, r:5, color:css("--ink") }); });
    var desc = x.valid ? "Your trip: distance from home " + d.map(function(v){ return num(v); }).join(", ") + " km at t = 0, 1, 2, 3, 4 h. Hourly rates " + hours(d).map(function(v){ return num(v); }).join(", ") + " km/h. Whole-trip secant slope " + num(d[4] / 4, 2) + " km/h." : "Distance–time graph of your trip. Enter all four distances to see it.";
    plot.draw({ view:view, xTicks:{ step:1 }, xLabel:"t (h)", yLabel:"d (km)", segments:segs, points:pts, labels:labels, describe:desc });
    var lg = $("#rt-lg");
    if (lg) lg.innerHTML = known[4] ? '<span><i class="sw" style="background:var(--pen)"></i>Your trip, with each hour’s average rate</span><span><i class="sw" style="background:var(--ink-2);height:2px"></i>Whole-trip secant: slope ' + num(d[4] / 4, 2) + " km/h</span>" : '<span><i class="sw" style="background:var(--pen)"></i>Your trip, with each hour’s average rate</span>';
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.d = (a.S.d || ["", "", "", ""]).slice(0, 4);
      inp.innerHTML = '<div class="inrow rt-in"><label for="rt-d0"><span>' + MV.m("d(0)") + '</span><input id="rt-d0" type="number" value="0" disabled></label>' +
        [1, 2, 3, 4].map(function(t){ return '<label for="rt-d' + t + '"><span>' + MV.m("d(" + t + ")") + '</span><input id="rt-d' + t + '" data-d="' + (t - 1) + '" type="number" step="10" min="0" max="300" autocomplete="off" value="' + MV.esc(a.S.d[t - 1]) + '"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<canvas class="plot" id="rt-plot" role="img" aria-label="Distance–time graph of your trip"></canvas><div class="legend rt-lg" id="rt-lg"></div>';
      plot = new MV.Plot($("#rt-plot"), { xmin:-0.35, xmax:4.45, ymin:-20, ymax:240 }); plot.render = draw;
      inp.addEventListener("input", function(e){ var i = e.target.dataset && e.target.dataset.d; if (i == null) return; a.S.d[+i] = e.target.value; a.save(); draw(); a.update(); });
      draw();
    },
    read:read,
    valid:function(x){ return x.valid ? true : "Enter a distance for every hour: a multiple of 10 from 0 to 300 km."; },
    checks:function(x){
      if (!x.valid) return [false, false, false, false, false];
      var d = x.d, h = hours(d);
      return [d[4] / 4 === 50, d[2] / 2 === 40, h.some(function(v){ return v === 0; }), h.every(function(v){ return v >= 0; }), h.every(function(v){ return v <= 100; })];
    },
    tips:function(x, c){
      var T = MV.C.task.tips, d = x.d, h = hours(d), out = [];
      if (!c[0]) out.push(T[0]);
      if (!c[1]) out.push(T[1]);
      if (!c[2]) out.push(T[2]);
      if (!c[3]) { for (var i = 0; i < 4; i++) if (h[i] < 0) { out.push(T[3].replace("{t}", i + " h").replace("{t1}", (i + 1) + " h")); break; } }
      if (!c[4]) {
        var cut = T[4].indexOf(". "), parts = cut > 0 ? [T[4].slice(0, cut + 1), T[4].slice(cut + 2)] : [T[4]], late = h[2] === 0 || h[3] === 0;
        for (var j = 0; j < 4; j++) if (h[j] > 100) { out.push(parts[0].replace("{i}", j + 1).replace("{v}", num(h[j])) + (late && parts[1] ? " " + parts[1] : "")); break; }
      }
      return out;
    },
    key:function(x){ return x.d.join(","); },
    label:function(k){ return "(" + k.split(",").map(function(v){ return num(+v); }).join(", ") + ")"; },
    text:function(k){ return k.split(",").map(function(v){ return num(+v); }).join(", ") + " km"; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task
});
})();
