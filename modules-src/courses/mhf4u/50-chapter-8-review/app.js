// MHF4U 50 Chapter 8 Summary & Review: hero (f = x² and g = x + 1 combined five ways, then a fitted model), per-topic
// tables (diagnostic, mixed practice, Final Check), Connect "Combination detective" (case cards with equation, graph and
// table faces + operation chips, then the chapter on one page), the mixed-practice set (choice, number entry with a small
// graph, interval entry) and the "Build a function to spec" task (u, v and an operation, with a live checklist).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, iv = MV.iv, MINUS = MV.MINUS;
var TOPICS = ["46", "47", "48", "49"];
function F(s, a){ return String(s == null ? "" : s).replace(/§(\d)/g, function(mm, k){ var v = a[+k - 1]; return v == null ? mm : v; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function md(s){ return MV.md(s); }
function scrollTo(el){ if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check), as in MHF4U 10, 16, 24, 30, 36 and 45 ----------
function modLink(t){ var mm = MV.topicMod(t); return mm.slug ? '<a href="' + mm.nn + "-" + mm.slug + '.html">Revisit module ' + mm.nn + "</a>" : "Revisit module " + t; }
function keyIdea(t){ var k = (MV.C.keyIdeas || {})[t]; return k ? '<div class="tt-key"><p><strong>Key idea:</strong> ' + k.idea + "</p><p><strong>Where to look:</strong> " + k.look + "</p></div>" : ""; }
// rows: [{t, r, n}] -> Module | <head> | Status; "◆ Revisit" rows add the key idea and where to look.
function topicTable(rows, head, caption){
  return '<div class="tt-wrap"><table class="topic-tbl tt"><caption class="vh">' + caption + '</caption><thead><tr><th scope="col">Module</th><th scope="col">' + head + '</th><th scope="col">Status</th></tr></thead><tbody>' +
    rows.map(function(o){
      var mm = MV.topicMod(o.t), pend = !o.n, ok = !pend && o.r === o.n;
      var st = pend ? '<span class="muted">Not tried yet</span>' : ok ? "✓ Ready" : "◆ " + modLink(o.t);
      var h = '<tr class="' + (ok || pend ? "" : "tt-rev") + '"><td>' + mm.nn + ". " + mm.title + "</td><td>" + (pend ? "—" : o.r + "/" + o.n) + "</td><td>" + st + "</td></tr>";
      if (!ok && !pend) h += '<tr class="tt-more"><td colspan="3">' + keyIdea(o.t) + "</td></tr>";
      return h;
    }).join("") + "</tbody></table></div>";
}
// Diagnostic results: the toolkit's review messages, then the per-topic Ready / Revisit table with key ideas.
MV.paintWarmResult = function(){
  var host = $("#warmup-result"), W = MV.warmCfg(), S = MV.S, ws = MV.warmStats();
  if (ws.checked < ws.total) { host.innerHTML = '<p class="tiny muted" style="margin-top:12px">' + ws.checked + " of " + ws.total + " answered.</p>"; return; }
  var frac = ws.score / ws.total;
  var msg = frac >= 5 / 6 - 1e-9 ? "You’re in good shape for this review. Use it to sharpen the details." : frac >= 0.5 ? "Good start. The table below shows which modules to revisit." : "Use the table below: revisit the modules marked before you go further.";
  var rows = TOPICS.map(function(t){
    var qs = W.list.filter(function(q){ return q.topic === t; });
    return { t:t, n:qs.length, r:qs.filter(function(q){ return S.warm[q.id] && S.warm[q.id].correct; }).length };
  }).filter(function(o){ return o.n; });
  host.innerHTML = '<div class="result"><p class="big-score">' + ws.score + " / " + ws.total + "</p>" + (ws.withSol ? '<p class="tiny muted">(' + ws.withSol + " more correct with the worked solution)</p>" : "") +
    "<p>" + msg + "</p>" + topicTable(rows, "Right", "Diagnostic results by module") + "</div>";
};
// Final Check: swap the toolkit's per-topic table for the same table with key ideas.
var finalCtl0 = MV.paintFinalCtl;
MV.paintFinalCtl = function(){
  finalCtl0.apply(this, arguments);
  if (!MV.S.final.submitted) return;
  var tbl = $("#final-ctl .topic-tbl"); if (!tbl) return;
  var tp = MV.finalStats().topics, d = document.createElement("div");
  d.innerHTML = topicTable(TOPICS.filter(function(t){ return tp[t]; }).map(function(t){ return { t:t, r:tp[t][0], n:tp[t][1] }; }), "Right", "Final Check results by module");
  tbl.parentNode.replaceChild(d.firstChild, tbl);
};
// "Modules to revisit" combines the diagnostic, mixed practice and the Final Check.
function mixedWeak(){
  var A = (MV.S.act || {}).mx, out = {}; if (!A || !A.items) return [];
  ((MV.C.mixed || {}).activities || []).forEach(function(a){ (a.items || []).forEach(function(it){ var x = A.items[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) out[it.topic] = 1; }); });
  return Object.keys(out);
}
var summaryData0 = MV.summaryData;
MV.summaryData = function(){
  var d = summaryData0.apply(this, arguments), w = {};
  d.weak.concat(mixedWeak()).forEach(function(t){ w[t] = 1; });
  d.weak = Object.keys(w).sort();
  return d;
};
var summaryText0 = MV.summaryText;
MV.summaryText = function(){
  var L = summaryText0.apply(this, arguments).split("\n"), S = MV.S, W = MV.warmCfg();
  var flagged = TOPICS.filter(function(t){ return W.list.some(function(q){ var st = S.warm[q.id]; return q.topic === t && st && st.checked && !st.correct; }); });
  return L.map(function(l){ return /^Diagnostic: \d/.test(l) ? l + "; modules flagged: " + (flagged.length ? flagged.join(", ") : "none") : l; }).join("\n");
};

// ---------- canvas helpers ----------
// @component G11 canvasMath (from MHF4U 37 / 40 / 44 / 45) — canvas text with ^{…} superscripts and _{…} subscripts in the
// math font (single letters italic, words such as "sin" upright); o.dry measures only; returns the width
function cmath(ctx, s, x, y, o){
  o = o || {};
  var Fz = o.size || 14, fm = css("--font-math") || "serif", segs = [], i = 0;
  function push(t, lv){ t.split(/([A-Za-z]+)/).forEach(function(w, k){ if (w) segs.push({ t:w, lv:lv, it:k % 2 === 1 && w.length === 1 }); }); }
  while (i < s.length) {
    var c = s[i];
    if ((c === "^" || c === "_") && i + 1 < s.length) {
      var g, j;
      if (s[i + 1] === "{") { j = s.indexOf("}", i + 2); g = s.slice(i + 2, j); i = j + 1; } else { g = s[i + 1]; i += 2; }
      push(g.replace(/-/g, MINUS), c === "^" ? 1 : -1); continue;
    }
    var k = i; while (k < s.length && s[k] !== "^" && s[k] !== "_") k++;
    push(s.slice(i, k).replace(/-/g, MINUS), 0); i = k;
  }
  function font(sg){ return (sg.it ? "italic " : "") + (o.weight || 600) + " " + (sg.lv ? Math.round(Fz * 0.72) : Fz) + "px " + fm; }
  var w = 0; segs.forEach(function(sg){ ctx.font = font(sg); sg.w = ctx.measureText(sg.t).width + (sg.it ? 1 : 0); w += sg.w; });
  if (o.dry) return w;
  var x0 = o.align === "center" ? x - w / 2 : o.align === "right" ? x - w : x;
  ctx.save(); ctx.textBaseline = "middle"; ctx.textAlign = "left"; if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.bg) { var ga = ctx.globalAlpha; ctx.globalAlpha = ga * 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - Fz * 0.75, w + 6, Fz * 1.5); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || css("--ink");
  segs.forEach(function(sg){ ctx.font = font(sg); ctx.fillText(sg.t, x0, y + (sg.lv === 1 ? -Fz * 0.38 : sg.lv === -1 ? Fz * 0.3 : 0)); x0 += sg.w; });
  ctx.restore();
  return w;
}
// filled dot with a --sheet rim and its own opacity (Plot.point always draws at full opacity)
function dot(p, x, y, r, col, a){
  var ctx = p.ctx, X = p.X(x), Y = p.Y(y); if (!isFinite(Y) || Y < -10 || Y > p.H + 10) return;
  ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); ctx.restore();
}
function rrect(ctx, x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
// polyline in data units, clipped to the canvas (Plot.curve clamps x to 6 × height, which cuts wide, short canvases)
function strokePts(p, pts, o){
  var ctx = p.ctx, lim = p.H * 4;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W, p.H); ctx.clip();
  ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.strokeStyle = o.color || css("--ink"); ctx.lineWidth = o.width || 3; ctx.lineJoin = "round"; ctx.lineCap = "round";
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); var pen = false;
  for (var i = 0; i < pts.length; i++) {
    var q = pts[i]; if (!isFinite(q[0]) || !isFinite(q[1])) { pen = false; continue; }
    var X = p.X(q[0]), Y = Math.max(-lim, Math.min(p.H + lim, p.Y(q[1])));
    if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
  }
  ctx.stroke(); ctx.restore();
}
// @component G1+G16 breakPieces (from MHF4U 47, sampling only) — samples y = fn(x) on [a, b] with dense geometric samples
// next to each break, and a NaN at the break so the branches are never joined
function piecePts(fn, a, b, breaks){
  var xs = [], N = 360, i;
  for (i = 0; i <= N; i++) xs.push(a + (b - a) * i / N);
  (breaks || []).forEach(function(s){ if (s > a && s < b) { for (var k = 0; k < 70; k++) { var e = 1e-6 * Math.pow(1.22, k); if (e > 1) break; xs.push(s - e, s + e); } } });
  xs.sort(function(p, q){ return p - q; });
  var out = [];
  xs.forEach(function(x){ if ((breaks || []).some(function(s){ return Math.abs(x - s) < 1e-12; })) { out.push([x, NaN]); return; } out.push([x, fn(x)]); });
  (breaks || []).forEach(function(s){ if (s > a && s < b) out.push([s, NaN]); });
  out.sort(function(p, q){ return p[0] - q[0]; });
  return out;
}

// ---------- hero: five ways to combine f(x) = x² and g(x) = x + 1 (storyboard in the plan; reduced motion: final frame) ----------
var HV = { xmin:-3, xmax:4.6, ymin:-4, ymax:10 };
function fF(x){ return x * x; }
function gF(x){ return x + 1; }
function sumF(x){ return x * x + x + 1; }
function prodF(x){ return x * x * (x + 1); }
function quotF(x){ return x * x / (x + 1); }
var BARX = [-2, -1, 0, 1, 2];
var HDATA = [[-2.5, 4.4], [-2, 3.3], [-1.5, 1.5], [-1, 1.2], [-0.5, 0.5], [0, 1.2], [0.5, 1.6], [1, 3.3], [1.5, 4.5], [2, 7.2], [2.5, 9.5]];
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, HV), fig = (MV.C.hero || {}).fig || {}, steps = fig.steps || [], U = fig.ui || {};
  var KEYS = ["f", "g", "bars", "sum", "sumA", "prod", "prodA", "quot", "quotA", "c1", "c2", "cA", "data", "model"], st = {};
  var END = { f:1, g:1, bars:0, sum:0, sumA:0, prod:0, prodA:0, quot:0, quotA:0, c1:1, c2:1, cA:0, data:1, model:1 };
  function set(o){ KEYS.forEach(function(k){ st[k] = o[k] || 0; }); }
  function cap(){
    f.cap.innerHTML = steps.map(function(s, i){ var wait = i >= st.k; return '<span class="hc-l' + (i === st.cur ? " cur" : "") + (wait ? " wait" : "") + '"' + (wait ? ' aria-hidden="true"' : "") + ">" + md(s.cap) + "</span>"; }).join("");
  }
  var PF = piecePts(fF, -3.2, 4.8), PG = piecePts(gF, -3.2, 4.8), PS = piecePts(sumF, -3.2, 4.8), PP = piecePts(prodF, -3.2, 4.8), PQ = piecePts(quotF, -3.2, 4.8, [-1]);
  function upto(pts, t){ if (t >= 1) return pts; var lim = -3.2 + 8 * t; return pts.filter(function(q){ return q[0] <= lim; }); }
  // pipeline row: label, then value pill → machine box → value pill → machine box → value pill
  function pipe(ctx, y, lab, vals, mach, a){
    var ink = css("--ink"), sm = p.W < 400, fs = sm ? 12 : 13, pw = sm ? 22 : 26, bw = sm ? 24 : 28, gap = sm ? 13 : 18, h = sm ? 20 : 22;
    var x = 8 + cmath(ctx, lab, 8, y, { size:fs, alpha:a, bg:true, dry:true });
    cmath(ctx, lab, 8, y, { size:fs, alpha:a, bg:true }); x += 8;
    ctx.save(); ctx.globalAlpha = a;
    for (var i = 0; i < 5; i++) {
      var isM = i % 2 === 1, w = isM ? bw : pw, col = isM ? css(mach[(i - 1) / 2] === "g" ? "--f3" : "--pen") : ink;
      ctx.fillStyle = css("--sheet"); ctx.strokeStyle = col; ctx.lineWidth = isM ? 2.2 : 1.5;
      rrect(ctx, x, y - h / 2, w, h, isM ? 4 : h / 2); ctx.fill(); ctx.stroke();
      if (isM) cmath(ctx, mach[(i - 1) / 2], x + w / 2, y, { size:fs + 1, align:"center", color:col });
      else { ctx.fillStyle = ink; ctx.font = "700 " + fs + "px " + (css("--font-ui") || "sans-serif"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(vals[i / 2], x + w / 2, y + 0.5); }
      x += w;
      if (i < 4) { ctx.strokeStyle = css("--ink-2"); ctx.fillStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.lineTo(x + gap - 4, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + gap - 2, y); ctx.lineTo(x + gap - 7, y - 4); ctx.lineTo(x + gap - 7, y + 4); ctx.closePath(); ctx.fill(); x += gap; }
    }
    ctx.restore();
  }
  p.render = function(){
    var done = st.k >= steps.length && st.model >= 1;
    p.draw({ view:HV, xTicks:{ step:1 }, yTicks:{ step:2 },
      describe:done ? MV.plain(fig.aria) : "Graph. " + steps.slice(0, st.k).map(function(s){ return MV.plain(md(s.cap)); }).join(" "),
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), sm = p.W < 400, fs = sm ? 12 : 13;
        var tagX = 8, tagY = p.Y(9.35);
        // value bars: f's height (pen), then g's height stacked on top of it (teal)
        if (st.bars > 0) {
          var bw = sm ? 9 : 12, tf = clamp(st.bars * 2, 0, 1), tg = clamp(st.bars * 2 - 1, 0, 1);
          ctx.save(); ctx.globalAlpha = 0.75 * (1 - st.sumA);
          BARX.forEach(function(x){
            var X = p.X(x), y0 = p.Y(0), y1 = p.Y(fF(x) * tf);
            ctx.fillStyle = pen; ctx.fillRect(X - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0));
            if (tg > 0) { var ya = p.Y(fF(x)), yb = p.Y(fF(x) + gF(x) * tg); ctx.fillStyle = f3; ctx.fillRect(X - bw / 2, Math.min(ya, yb), bw, Math.abs(yb - ya)); }
          });
          ctx.restore();
        }
        if (st.f > 0) { strokePts(p, upto(PF, st.f), { color:pen, width:3 }); if (st.f >= 1) cmath(ctx, U.f, p.X(3.12) + 6, p.Y(9.3), { size:fs, color:pen, bg:true }); }
        if (st.g > 0) { strokePts(p, upto(PG, st.g), { color:f3, width:2.6 }); if (st.g >= 1) cmath(ctx, U.g, p.W - 6, p.Y(6.7), { size:fs, align:"right", color:f3, bg:true }); }
        // f + g through the tops of the stacks
        if (st.sum > 0 && st.sumA < 1) {
          var a1 = 1 - st.sumA;
          strokePts(p, upto(PS, st.sum), { color:ink, width:3.4, alpha:a1 });
          BARX.forEach(function(x){ if (x <= -3.2 + 8 * st.sum) dot(p, x, sumF(x), 4, ink, a1); });
          if (st.sum >= 1) cmath(ctx, U.sum + " = x^2 + x + 1", tagX, tagY, { size:fs, color:ink, bg:true, alpha:a1 });
        }
        // f · g: zeros at −1 (crosses) and 0 (touches)
        if (st.prod > 0 && st.prodA < 1) {
          var a2 = 1 - st.prodA;
          strokePts(p, upto(PP, st.prod), { color:ink, width:3.4, alpha:a2 });
          if (st.prod >= 1) {
            dot(p, -1, 0, 5, ink, a2); dot(p, 0, 0, 5, ink, a2);
            cmath(ctx, U.prod + " = x^2(x + 1)", tagX, tagY, { size:fs, color:ink, bg:true, alpha:a2 });
            cmath(ctx, U.zeros + " -1 and 0", p.X(-0.5), p.Y(-1.1), { size:fs - 1, align:"center", weight:400, bg:true, alpha:a2 });
          }
        }
        // f/g: the zero of g at −1 becomes the asymptote
        if (st.quot > 0 && st.quotA < 1) {
          var a3 = 1 - st.quotA;
          p.segment({ x1:-1, y1:HV.ymin - 1, x2:-1, y2:HV.ymax + 1, color:ink2, width:1.5, dash:[8, 6], alpha:a3 * Math.min(1, st.quot * 3) });
          strokePts(p, upto(PQ, st.quot), { color:ink, width:3.4, alpha:a3 });
          if (st.quot >= 1) {
            cmath(ctx, U.va, p.X(-1) - 6, p.Y(6.2), { size:fs, align:"right", color:ink2, weight:400, bg:true, alpha:a3 });
            dot(p, 0, 0, 5, ink, a3);
            cmath(ctx, U.quot + " = x^2/(x + 1)", tagX, tagY, { size:fs, color:ink, bg:true, alpha:a3 });
          }
        }
        // f(g(2)): 2 → g → 3 → f → 9, then g(f(2)): 2 → f → 4 → g → 5
        var aC = 1 - st.cA;
        if (st.c1 > 0) {
          var t1 = st.c1 * aC;
          p.segment({ x1:2, y1:0, x2:2, y2:3, color:f3, width:1.6, dash:[3, 4], alpha:t1 }); p.segment({ x1:3, y1:0, x2:3, y2:9, color:pen, width:1.6, dash:[3, 4], alpha:t1 });
          dot(p, 2, 3, 5, f3, t1); dot(p, 3, 9, 5, pen, t1);
          pipe(ctx, p.Y(-1.75), U.fg + ":", ["2", "3", "9"], ["g", "f"], st.c1);
        }
        if (st.c2 > 0) {
          var t2 = st.c2 * aC;
          p.segment({ x1:4, y1:0, x2:4, y2:5, color:f3, width:1.6, dash:[3, 4], alpha:t2 });
          dot(p, 2, 4, 5, pen, t2); dot(p, 4, 5, 5, f3, t2);
          pipe(ctx, p.Y(-3.15), U.gf + ":", ["2", "4", "5"], ["f", "g"], st.c2);
        }
        // a dataset and a fitted model
        if (st.data > 0) HDATA.forEach(function(q, i){ var a = clamp(st.data * HDATA.length - i, 0, 1); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(p.X(q[0]), p.Y(q[1]), 4.2, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke(); ctx.restore(); } });
        if (st.model > 0) {
          strokePts(p, upto(PS, st.model), { color:ink, width:3.4 });
          if (st.model >= 1) cmath(ctx, U.model + ": y = x^2 + x + 1", tagX, tagY, { size:fs, color:ink, bg:true });
        }
      } });
  };
  if (MV.reduceMotion) { set(END); st.k = steps.length; st.cur = -1; cap(); p.render(); return; }
  set({}); st.k = 0; st.cur = -1; cap(); p.render();
  function tw(dur, key, to, then){ var from = st[key]; MV.tween({ dur:dur, step:function(t){ st[key] = from + (to - from) * t; p.render(); }, done:function(){ st[key] = to; p.render(); if (then) then(); } }); }
  var PLAN = [
    function(next){ tw(1100, "f", 1, function(){ tw(900, "g", 1, next); }); },
    function(next){ tw(1600, "bars", 1, function(){ tw(1200, "sum", 1, next); }); },
    function(next){ tw(500, "sumA", 1, function(){ tw(1300, "prod", 1, next); }); },
    function(next){ tw(500, "prodA", 1, function(){ tw(1300, "quot", 1, next); }); },
    function(next){ tw(500, "quotA", 1, function(){ tw(900, "c1", 1, function(){ MV.wait(900, function(){ tw(900, "c2", 1, next); }); }); }); },
    function(next){ tw(500, "cA", 0.6, function(){ tw(900, "data", 1, function(){ tw(1200, "model", 1, next); }); }); }
  ];
  function step(i){
    st.k = i + 1; st.cur = i; cap(); p.render();
    (PLAN[i] || function(n){ n(); })(function(){
      MV.wait(i === 4 ? 1800 : 1100, function(){ if (i + 1 < steps.length) step(i + 1); else MV.wait(1500, function(){ st.cur = -1; cap(); p.render(); }); });
    });
  }
  MV.wait(400, function(){ step(0); });
}

// ---------- Connect: Combination detective ----------
// @component K11 caseChips (detective cards) — one case card at a time (equation, mini graph or table face) with a row of
// operation chips; tapping a chip checks it at once (K11 quick-check style): a right chip locks the case with the reason,
// a wrong chip is marked ✗ with feedback naming that operation's fingerprint (case-specific where the plan gives one).
// Cases can instead carry a four-option choice. Previous / Next, progress dots, first-try tracking; "the chapter on one
// page" appears when every case is solved.
var CN = null;
function connect(host, api){
  var C = api.content, U = C.ui, CS = C.cases, S = api.S, msg = {}, OP = {}, facePlot = null;
  C.ops.forEach(function(o){ OP[o.id] = o; });
  S.cur = clamp(S.cur || 0, 0, CS.length - 1); S.ch = S.ch || {};
  function st(c){ var x = S.ch[c.id] || (S.ch[c.id] = { tries:0, solved:false, first:null }); x.picks = x.picks || []; return x; }
  function solved(c){ var x = S.ch[c.id]; return !!(x && x.solved); }
  host.innerHTML = '<div class="c8-cd"><p class="c8-sus">' + C.suspects + '</p><div class="cv-chal" id="cd-chal"></div><div class="c8-one" id="cd-one"></div></div>';
  var root = $(".c8-cd", host);

  function face(c){
    if (c.face === "graph") return '<div class="c8-face c8-gr"><span class="c8-fl">' + U.faces.graph + '</span><div class="c8-gwrap"><canvas class="plot c8-gc" role="img" aria-label="' + MV.esc(U.graphAria) + '"></canvas></div><p class="c8-gcap">' + c.h + "</p></div>";
    if (c.face === "table") return '<div class="c8-face"><span class="c8-fl">' + U.faces.table + '</span><div class="tbl-wrap c8-tw"><table class="vt c8-tb"><caption class="vh">' + MV.plain(md(c.h)) + "</caption><tbody><tr>" +
      U.tblHead.map(function(t, i){ return i ? "<td>" + md(t) + "</td>" : '<th scope="row">' + md(t) + "</th>"; }).join("") + "</tr><tr>" +
      U.tblRow.map(function(t, i){ return i ? "<td>" + md(t) + "</td>" : '<th scope="row">' + md(t) + "</th>"; }).join("") + "</tr></tbody></table></div></div>";
    return '<div class="c8-face"><span class="c8-fl">' + U.faces.eq + '</span><p class="c8-eq">' + c.h + "</p></div>";
  }
  function drawFace(box, c){
    facePlot = null; if (c.face !== "graph") return;
    var cv = $(".c8-gc", box), V = { xmin:-5, xmax:4, ymin:-8, ymax:8 }, P = piecePts(quotF, -5.2, 4.2, [-1]);
    var pl = facePlot = new MV.Plot(cv, V);
    pl.render = function(){
      pl.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:2 }, asymptotes:[{ x:-1, label:"" }], describe:U.graphAria,
        after:function(ctx, p){ strokePts(p, P, { color:css("--ink"), width:3.2 }); p.point({ x:0, y:0, r:4.5, color:css("--ink") }); cmath(ctx, "x = -1", p.X(-1) - 6, 14, { size:13, align:"right", color:css("--ink-2"), weight:400, bg:true }); } });
    };
    pl.render();
  }
  function chipRow(c, x){
    if (c.options) return '<p class="c8-ask">' + (c.ask || U.askPair) + '</p><div class="c8-opts" role="group" aria-label="' + MV.esc(MV.plain(md(c.ask || U.askPair))) + '">' +
      c.options.map(function(o, i){
        var picked = x.picks.indexOf(i) >= 0, right = x.solved && MV.ok(o), wrong = picked && !MV.ok(o);
        return '<button type="button" class="c8-op' + (right ? " right" : "") + (wrong ? " wrong" : "") + '" data-opt="' + i + '" data-k="cdo' + i + '"' + (x.solved || wrong ? " disabled" : "") + ">" +
          '<span class="c8-mk" aria-hidden="true">' + (right ? "✓" : wrong ? "✗" : "") + "</span><span>" + o.t + "</span>" + (right ? '<span class="vh"> (right)</span>' : wrong ? '<span class="vh"> (not this one)</span>' : "") + "</button>";
      }).join("") + "</div>";
    var ans = MV.ans(c);
    return '<p class="c8-ask">' + U.ask + '</p><div class="c8-chips" role="group" aria-label="' + MV.esc(MV.plain(md(U.ask))) + '">' +
      C.ops.map(function(o){
        var picked = x.picks.indexOf(o.id) >= 0, right = x.solved && o.id === ans, wrong = picked && o.id !== ans;
        return '<button type="button" class="c8-chip' + (right ? " right" : "") + (wrong ? " wrong" : "") + '" data-chip="' + o.id + '" data-k="cdc' + o.id + '"' + (x.solved || wrong ? " disabled" : "") + ">" +
          (right ? '<span aria-hidden="true">✓ </span>' : wrong ? '<span aria-hidden="true">✗ </span>' : "") + o.t + (right ? '<span class="vh"> (right)</span>' : wrong ? '<span class="vh"> (not this one)</span>' : "") + "</button>";
      }).join("") + "</div>";
  }
  function paintChal(){
    var c = CS[S.cur], x = st(c), i = S.cur, box = $("#cd-chal", root), M = msg[c.id], h;
    h = '<div class="pred-top cv-top"><span class="tiny muted">' + F(U.caseOf, [i + 1, CS.length]) + '</span><span class="cv-tags"><span class="tag">' + MV.topicLabel(c.topic) + "</span>" + (c.stretch ? '<span class="tag">' + U.stretch + "</span>" : "") + '</span><span class="dots" aria-hidden="true">' +
      CS.map(function(q, k){ return '<span class="dot' + (solved(q) ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<h3 class="c8-ct">' + c.id + "</h3>" + face(c) + chipRow(c, x);
    if (x.solved) {
      var why = c.options ? c.options.filter(function(o){ return MV.ok(o); })[0].why : c.why;
      h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    } else if (M) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + M + " Try again.");
    h += '<div class="q-actions cv-nav"><button type="button" class="btn ghost sm" data-cv="prev" data-k="cdprev"' + (i === 0 ? " disabled" : "") + ">" + U.prev + '</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-cv="next" data-k="cdnext"' + (i === CS.length - 1 ? " disabled" : "") + ">" + U.next + "</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    drawFace(box, c);
  }
  function paintOne(){
    var el = $("#cd-one", root), n = CS.filter(solved).length, O = C.onePage;
    if (n < CS.length) { el.dataset.done = ""; el.innerHTML = '<p class="tiny muted">' + F(U.waitOne, [n, CS.length]) + "</p>"; return; }
    if (el.dataset.done) return;
    el.dataset.done = "1";
    el.innerHTML = "<h3>" + O.title + '</h3><p class="muted">' + O.intro + '</p><div class="tbl-wrap c8-opw"><table class="c8-op1"><caption class="vh">' + O.title + "</caption><thead><tr>" +
      O.head.map(function(t){ return '<th scope="col">' + t + "</th>"; }).join("") + "</tr></thead><tbody>" +
      O.rows.map(function(r){ return '<tr><th scope="row">' + r.op + ' <span class="tag">Module ' + r.mods + "</span></th><td>" + r.fp + "</td><td>" + r.dom + "</td><td>" + r.ex + "</td></tr>"; }).join("") + "</tbody></table></div>";
  }
  function paintAll(){ paintChal(); paintOne(); }
  function judgeChip(c, x, id){
    if (x.picks.indexOf(id) < 0) x.picks.push(id);
    if (id === MV.ans(c)) { x.solved = true; x.first = x.tries === 0; msg[c.id] = null; return; }
    x.tries++;
    var o = OP[id], t = c.fb && c.fb[id];
    if (!t) t = c.face === "graph" ? o.gr : c.face === "table" ? F(U.tblFb, [o.t, o.tbl]) : F(U.eqFb, [o.is]);
    msg[c.id] = t + (c.tip ? " " + c.tip : "");
  }
  function judgeOpt(c, x, i){
    if (x.picks.indexOf(i) < 0) x.picks.push(i);
    var o = c.options[i];
    if (MV.ok(o)) { x.solved = true; x.first = x.tries === 0; msg[c.id] = null; return; }
    x.tries++; msg[c.id] = o.why;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CS[S.cur], x = st(c);
    if (b.dataset.cv) {
      S.cur = clamp(S.cur + (b.dataset.cv === "next" ? 1 : -1), 0, CS.length - 1);
      api.save(); paintAll();
      var nb = host.querySelector('[data-cv="' + b.dataset.cv + '"]'); if (nb && !nb.disabled) nb.focus({ preventScroll:true });
      return;
    }
    if (x.solved) return;
    if (b.dataset.chip) judgeChip(c, x, b.dataset.chip);
    else if (b.dataset.opt != null) judgeOpt(c, x, +b.dataset.opt);
    else return;
    api.save(); paintAll();
    var bx = $("#cd-chal", root); MV.focusFb(bx);
  });
  paintAll();
  CN = { repaint:function(){ if (facePlot) facePlot.render(); } };

  // Register with the activity list so the summary and "skills to review" include Connect.
  MV.ACTS.connect = { a:{ id:"connect", title:C.summary },
    stats:function(){ var f = 0, d = 0; CS.forEach(function(c){ var y = S.ch[c.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:CS.length, done:d, line:C.summary + " (first try): " + f + "/" + CS.length + (d < CS.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CS.forEach(function(c){ var y = S.ch[c.id]; if (y && y.tries > 0) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  return {};
}

// ---------- Mixed practice: choice (K5, retry), number entry (N4) and interval entry (N10), in the plan's order ----------
var GENERAL = "Check your work, or use a hint.";
function mixed(host, api, a){
  var S = api.S; S.items = S.items || {};
  var items = a.items, msgs = {}, ibs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function tags(it){ return '<span class="tags"><span class="tag">' + MV.topicLabel(it.topic) + "</span>" + (it.star ? '<span class="tag">★ Challenge</span>' : "") + "</span>"; }
  function head(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + tags(it) + "</div>" + (it.fig ? '<div class="mx-figw">' + it.fig + "</div>" : ""); }
  function box(it){ return host.querySelector('[data-mx="' + it.id + '"]'); }
  function feedback(it, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    var M = msgs[it.id]; if (!M) return "";
    return M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>";
  }
  function actions(it, x){ return x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint); }
  function inp(it, x){
    var id = "mxn-" + it.id, im = it.keypad === "decimal" ? "decimal" : "text";
    return '<span class="mx-pair"><label class="mx-lab" for="' + id + '">' + (it.label || "Your answer:") + '</label><span class="mx-cell"><input class="numin short" id="' + id + '" data-mxn="' + it.id + '" type="text" inputmode="' + im + '" autocomplete="off" value="' + MV.esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + ">" +
      (it.unit ? '<span class="mx-unit">' + it.unit + "</span>" : "") + "</span></span>";
  }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';

  // ---- interval entry: the N10 builder (as in MHF4U 16 and 24) ----
  function ivShow(ps){ return m(iv.text(ps)) + (ps.length ? ' <span class="muted">(' + m(iv.set(ps, "x")) + ")</span>" : ""); }
  function buildIv(it, el, i){
    var x = ist(it.id);
    el.innerHTML = head(it, i) + '<p class="how">Build your answer on the number line. Drag an end (or use the arrow keys, then O or C for open or closed), and add a piece if you need one.</p>' +
      '<div class="mx-ib"></div><p class="mx-yours" aria-live="polite"></p><div class="mx-dyn"></div>';
    var ib = MV.intervalBuilder($(".mx-ib", el), { min:-5, max:5, maxPieces:3, modes:false, test:false, readout:false, halfToggle:false, caption:false,
      aria:"Number line for your answer", pieces:[{ a:-3, b:2, aIn:true, bIn:true }],
      onChange:function(s){ var y = ist(it.id); if (!y.solved) { y.build = s; msgs[it.id] = null; api.save(); paintYours(it); } } });
    ibs[it.id] = ib;
    if (x.build) ib.set(x.build, true);
  }
  function paintYours(it){ var el = box(it), y = $(".mx-yours", el); if (y) y.innerHTML = "<strong>Your answer:</strong> " + ivShow(iv.norm(ibs[it.id].iv())); }

  function paint(it){
    var i = items.indexOf(it), x = ist(it.id), el = box(it);
    if (it.kind === "mc") {
      MV.keepFocus(el, function(){
        el.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:MV.topicLabel(it.topic) + (it.star ? '</span><span class="tag">★ Challenge' : "") }) +
          (x.solved && !x.first ? '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>' : "");
      });
    } else if (it.kind === "iv") {
      if (!ibs[it.id]) buildIv(it, el, i);
      $(".mx-ib", el).inert = !!x.solved;
      paintYours(it);
      var dyn = $(".mx-dyn", el);
      MV.keepFocus(dyn, function(){ dyn.innerHTML = actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>"; });
    } else {
      MV.keepFocus(el, function(){ el.innerHTML = head(it, i) + '<div class="numrow mx-row">' + inp(it, x) + "</div>" + actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>"; });
    }
    paintSum();
  }
  function paintSum(){
    var el = $(".mx-sum", host), done = items.filter(function(it){ return ist(it.id).solved; }).length;
    if (done < items.length) { el.innerHTML = '<p class="tiny muted">' + done + " of " + items.length + " done. Your first-try table by module appears when all " + items.length + " are done.</p>"; return; }
    var rows = TOPICS.map(function(t){ var its = items.filter(function(it){ return it.topic === t; }); return { t:t, n:its.length, r:its.filter(function(it){ return ist(it.id).first; }).length }; }).filter(function(o){ return o.n; });
    el.innerHTML = '<div class="part"><h3>Your first tries by module</h3>' + topicTable(rows, "First try", "Mixed practice first tries by module") + "</div>";
  }
  function bad(text){ return { bad:true, html:"<strong>✗ Not quite.</strong> " + text + " Try again." }; }
  function close(v, w){ return Math.abs(v - w) <= 1e-6 * Math.max(1, Math.abs(w)); }
  function clean(raw){ return String(raw == null ? "" : raw).replace(/^.*=\s*/, "").replace(/\$/g, "").replace(/\s*(dollars?|solutions?)\s*\.?\s*$/i, "").trim(); }
  function judge(it, x){
    var ans = MV.ans(it);
    if (it.kind === "iv") {
      var ps = iv.norm(ibs[it.id].iv()), got = iv.text(ps);
      x.build = ibs[it.id].get();
      if (got === ans) return { ok:true };
      var named = (it.wrong || {})[got];
      return { msg:bad(named || ("Your answer is " + ivShow(ps) + ". Check each piece and each endpoint.")) };
    }
    var v = MV.parseNum(clean(x.val));
    if (!v || v.length !== 1) return { msg:{ bad:false, html:"Enter a number, such as 12, 0.5 or 3/4." } };
    if (close(v[0], ans)) return { ok:true };
    var w = (it.wrong || []).filter(function(q){ return close(v[0], q.match); })[0];
    return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
  }
  host.addEventListener("input", function(e){
    var t = e.target, id = t.dataset && t.dataset.mxn; if (!id) return;
    ist(id).val = t.value; api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.mxn) return;
    var b = host.querySelector('[data-k="' + e.target.dataset.mxn + 'chk"]'); if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-mx]"); if (!el || b.closest(".mx-ib")) return;
    var it = items.filter(function(q){ return q.id === el.dataset.mx; })[0], x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paint(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paint(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "mc") {
      if (x.choice == null) return;
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (r.msg.bad) x.tries++; msgs[it.id] = r.msg; }
    }
    api.save(); paint(it); MV.focusFb(el);
  });
  items.forEach(paint);
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}
// MP10's graphs: f (blue) through (2, 3) and g (teal) through (2, −5)
var figures = {
  mp10:function(p){
    var V = { xmin:-2, xmax:4.5, ymin:-8, ymax:7 }, pen = css("--pen"), f3 = css("--f3");
    p.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:2 }, describe:"Graphs of f in blue and g in teal. At x = 2, the graph of f is at (2, 3) and the graph of g is at (2, −5).",
      after:function(ctx, pl){
        strokePts(pl, piecePts(function(x){ return x * x / 2 + 1; }, -2.2, 4.7), { color:pen, width:3 });
        strokePts(pl, piecePts(function(x){ return 1 - 3 * x; }, -2.2, 4.7), { color:f3, width:2.6 });
        pl.segment({ x1:2, y1:-8.5, x2:2, y2:7.5, color:css("--ink-2"), width:1.3, dash:[3, 4] });
        pl.point({ x:2, y:3, r:5, color:pen }); pl.point({ x:2, y:-5, r:5, color:f3 });
        cmath(ctx, "(2, 3)", pl.X(2) + 9, pl.Y(3) - 12, { size:13, bg:true });
        cmath(ctx, "(2, -5)", pl.X(2) + 9, pl.Y(-5) + 2, { size:13, bg:true });
        cmath(ctx, "f", pl.X(3.2) + 6, pl.Y(5), { size:15, color:pen, bg:true });
        cmath(ctx, "g", pl.X(-1.2) + 8, pl.Y(5.6), { size:15, color:f3, bg:true });
      } });
  }
};

// ---------- performance task: build a function to spec ----------
// @component functionPicker (adapted from MHF4U 46) — radio group of function chips in the math font with a slot-coloured
// outline (u in --pen, v in --f3), arrow keys with a roving tabindex, one sideways-scrolling row on phones.
// o = {slot, label, aria, options:[{id, t, say}], value, onChange(i)}
function picker(host, o){
  var val = o.value;
  function paint(){
    var f = host.contains(document.activeElement);
    host.innerHTML = '<div class="c8-pk c8-pk-' + o.slot + '"><span class="c8-pk-lab">' + o.label + '</span><div class="c8-pk-row" role="radiogroup" aria-label="' + MV.esc(o.aria) + '">' +
      o.options.map(function(x, i){ var on = i === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-pk="' + i + '" aria-label="' + MV.esc(x.say) + '">' + x.t + "</button>"; }).join("") + "</div></div>";
    var row = host.querySelector(".c8-pk-row"), b = row.querySelector('[aria-checked="true"]');
    if (b && row.scrollWidth > row.clientWidth + 2) row.scrollLeft = b.offsetLeft - row.offsetLeft - row.clientWidth / 2 + b.offsetWidth / 2;
    if (f && b) b.focus({ preventScroll:true });
  }
  function choose(i){ var ch = i !== val; val = i; paint(); if (ch && o.onChange) o.onChange(i); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-pk]"); if (b && !b.disabled) choose(+b.dataset.pk); });
  host.addEventListener("keydown", function(e){
    if (!e.target.closest("[data-pk]")) return;
    var n = o.options.length, d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
    if (e.key === "Home") d = -val; if (e.key === "End") d = n - 1 - val; if (!d) return;
    e.preventDefault(); choose((val + d + n) % n);
  });
  paint();
  return { get:function(){ return val; } };
}
// the menu: each function with its parity, value at 0 (null = undefined) and size as x → ∞ (2^(E·x) · x^P, or oscillating)
var TL = [
  { id:"x2", src:"x^2", say:"x squared", f:function(x){ return x * x; }, par:"even", z0:0, o:[0, 2] },
  { id:"x3", src:"x^3", say:"x cubed", f:function(x){ return x * x * x; }, par:"odd", z0:0, o:[0, 3] },
  { id:"sin", src:"sin x", say:"sine x", f:Math.sin, par:"odd", z0:0, osc:true },
  { id:"rx", src:"{1}/{x}", in:"1/x", say:"1 over x", f:function(x){ return x === 0 ? NaN : 1 / x; }, par:"odd", z0:null, o:[0, -1] },
  { id:"e", src:"2^x", say:"2 to the power x", f:function(x){ return Math.pow(2, x); }, par:"neither", z0:1, o:[1, 0] }
];
var TOPS = [
  { id:"sum", t:"u + v", say:"u plus v" }, { id:"dif", t:"u - v", say:"u minus v" }, { id:"prod", t:"u · v", say:"u times v" },
  { id:"quot", t:"u/v", say:"u divided by v" }, { id:"comp", t:"u(v(x))", say:"u of v of x" }];
function osgn(o){ return o[0] !== 0 ? Math.sign(o[0]) : Math.sign(o[1]); }
function ocmp(a, b){ return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]; }
function ocls(o){ var s = osgn(o); return s > 0 ? "inf" : s < 0 ? "0" : "c"; }
// symbolic behaviour as x → ∞: "0", "inf", "c" (levels off at a nonzero value), "osc" (bounded swings), "wild" (swings to ±∞)
function limCls(d){
  var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id, other;
  if (op === "sum" || op === "dif") {
    if (A.osc || B.osc) { other = A.osc ? B : A; return osgn(other.o) > 0 ? "inf" : "osc"; }
    return ocls(ocmp(A.o, B.o) >= 0 ? A.o : B.o);
  }
  if (op === "prod") {
    if (A.osc || B.osc) { other = A.osc ? B : A; var s = osgn(other.o); return s < 0 ? "0" : s > 0 ? "wild" : "osc"; }
    return ocls([A.o[0] + B.o[0], A.o[1] + B.o[1]]);
  }
  if (op === "quot") {
    if (B.osc) return "wild";
    if (A.osc) { var t = osgn(B.o); return t > 0 ? "0" : t < 0 ? "wild" : "osc"; }
    return ocls([A.o[0] - B.o[0], A.o[1] - B.o[1]]);
  }
  // u(v(x))
  if (B.osc) return A.id === "rx" ? "wild" : "osc";
  if (osgn(B.o) > 0) { if (A.osc) return "osc"; if (A.o[0] > 0) return "inf"; var p = A.o[1]; return ocls([p * B.o[0], p * B.o[1]]); }
  return A.id === "rx" ? "inf" : A.id === "e" ? "c" : "0";   // v → 0 (only 1/x): u(v) → u(0)
}
function parity(d){
  var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id;
  if (op === "comp") return B.par === "even" ? "even" : B.par === "odd" ? A.par : "neither";
  if (A.par === "neither" || B.par === "neither") return "neither";
  if (op === "sum" || op === "dif") return A.par === B.par ? A.par : "neither";
  return A.par === B.par ? "even" : "odd";
}
function undef0(d){
  var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id;
  if (op === "comp") return B.z0 === null || (A.id === "rx" && B.z0 === 0);
  if (A.z0 === null || B.z0 === null) return true;
  return op === "quot" && B.z0 === 0;
}
function hFn(d){
  var A = TL[d.u].f, B = TL[d.v].f, op = TOPS[d.op].id;
  return function(x){
    var r;
    if (op === "comp") { var w = B(x); r = isFinite(w) ? A(w) : NaN; }
    else { var a = A(x), b = B(x); if (!isFinite(a) || !isFinite(b)) return NaN; r = op === "sum" ? a + b : op === "dif" ? a - b : op === "prod" ? a * b : (b === 0 ? NaN : a / b); }
    return isFinite(r) ? r : NaN;
  };
}
var ODDX = [0.37, 0.81, 1.23, 1.9, 2.71, 3.3, 4.6, 5.9];
function numOdd(d){
  var h = hFn(d);
  return ODDX.every(function(x){ var a = h(x), b = h(-x); if (isNaN(a) !== isNaN(b)) return false; if (isNaN(a)) return true; return Math.abs(a + b) <= 1e-9 * Math.max(1, Math.abs(a)); });
}
function numLim0(d){
  var h = hFn(d);
  for (var k = 0; k <= 4000; k++) { var x = 100 + 900 * k / 4000, y = h(x); if (!isFinite(y) || Math.abs(y) >= 0.02) return false; }
  return true;
}
// written formula for h, and a simpler equal form when the pieces are powers of x
function inExp(F){ return F.in || F.src; }
function hSrc(d){
  var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id;
  if (op === "sum") return A.src + " + " + B.src;
  if (op === "dif") return A.src + " - " + B.src;
  if (op === "prod") return A.src + " · " + B.src;
  if (op === "quot") return "{" + A.src + "}/{" + B.src + "}";
  if (A.id === "x2" || A.id === "x3") return "(" + B.src + ")^" + (A.id === "x2" ? 2 : 3);
  if (A.id === "sin") return "sin(" + B.src + ")";
  if (A.id === "rx") return "{1}/{" + B.src + "}";
  return "2^{" + inExp(B) + "}";
}
function powSrc(r){ return r === 0 ? "1" : r === 1 ? "x" : r > 0 ? "x^" + r : r === -1 ? "{1}/{x}" : "{1}/{x^" + (-r) + "}"; }
function simpler(d){
  var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id, P = { x2:2, x3:3, rx:-1 };
  if (!(A.id in P) || !(B.id in P) || op === "sum" || op === "dif") return null;
  var r = op === "prod" ? P[A.id] + P[B.id] : op === "quot" ? P[A.id] - P[B.id] : P[A.id] * P[B.id], s = powSrc(r);
  return s === hSrc(d) ? null : { src:s, note:r >= 0 && undef0(d) };
}
function fmtV(v){
  if (!isFinite(v)) return MV.C.task.ui.undef;
  if (v === 0) return "0";
  var a = Math.abs(v);
  if (a >= 1e5 || a < 1e-3) { var k = Math.floor(Math.log10(a)), mant = v / Math.pow(10, k); return "≈ " + m(num(mant, 1) + " × 10^{" + k + "}"); }
  var r = Math.round(v * 1000) / 1000;
  return (Math.abs(r - v) > 1e-12 ? "≈ " : "") + num(v, 3);
}
var task = (function(){
  var api, plot, T, U;
  function read(){ var s = api ? api.S : {}; return { u:s.u == null ? 0 : s.u, v:s.v == null ? 1 : s.v, op:s.op == null ? 0 : s.op }; }
  function valid(d){ return d.u !== d.v; }
  function checks(d){ if (!valid(d)) return [false, false, false]; return [parity(d) === "odd" && numOdd(d), undef0(d), limCls(d) === "0" && numLim0(d)]; }
  function capSrc(d){ var s = simpler(d); return "h(x) = " + hSrc(d) + (s ? " = " + s.src : ""); }
  function capHTML(d){ var s = simpler(d); return m(capSrc(d)) + (s && s.note ? ' <span class="tiny muted">(for ' + m("x != 0") + ")</span>" : ""); }
  function parWhy(d){
    var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id, R = U.rule, P = U.par;
    function w(p){ return p === "neither" ? "neither" : p; }
    if (op === "comp") return B.par === "even" ? R.compEven : B.par === "odd" ? (A.par === "neither" ? F(R.none, [m(A.src)]) : F(R.compOdd, [A.par === "odd" ? "an odd" : "an even", A.par])) : R.compNone;
    if (A.par === "neither" || B.par === "neither") return F(R.none, [m((A.par === "neither" ? A : B).src)]);
    var sym = { sum:"+", dif:MINUS, prod:"×", quot:"÷" }[op];
    void P;
    return F(R.pair, [w(A.par), sym, w(B.par), parity(d)]);
  }
  function why0(d){
    var A = TL[d.u], B = TL[d.v], op = TOPS[d.op].id, W = U.why0, h = hFn(d);
    if (!undef0(d)) return F(W.def, [fmtV(h(0))]);
    if (op === "comp") return B.id === "rx" ? W.rx : W.comp;
    if (A.id === "rx" || B.id === "rx") return W.rx;
    return W.div;
  }
  function draw(d){
    var V = { xmin:-6, xmax:6, ymin:-4, ymax:4 };
    if (!valid(d)) { plot.render = function(){ plot.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:1 }, describe:MV.plain(md(U.same)) }); }; plot.render(); return; }
    var h = hFn(d), A = TL[d.u], B = TL[d.v];
    plot.render = function(){
      plot.draw({ view:V, xTicks:{ step:1 }, yTicks:{ step:1 },
        curves:[{ f:function(x){ var y = A.f(x); return isFinite(y) ? y : NaN; }, color:css("--pen"), width:2, alpha:0.45 },
          { f:function(x){ var y = B.f(x); return isFinite(y) ? y : NaN; }, color:css("--f3"), width:2, alpha:0.45 },
          { f:h, color:css("--ink"), width:3.4 }],
        describe:F(U.describe, [MV.plain(m(hSrc(d))), MV.plain(md(T.checks[0])) + ": " + (checks(d)[0] ? "yes" : "no") + ". h(0): " + MV.plain(why0(d)) + ". As x → ∞, h(x) " + MV.plain(md(U.lim[limCls(d)])) + "."]) });
    };
    plot.render();
  }
  function preview(){
    var d = read(), cap = $("#c8-tcap"), rd = $("#c8-trd");
    if (!cap) return;
    if (!valid(d)) { cap.innerHTML = '<span class="muted">' + md(U.same) + "</span>"; rd.innerHTML = ""; draw(d); return; }
    cap.innerHTML = capHTML(d);
    var h = hFn(d), pr = parity(d), ok1 = checks(d)[0];
    rd.innerHTML = "<h4 class=\"c8-th\">" + md(U.odd) + '</h4><div class="tbl-wrap c8-tw"><table class="vt c8-ot"><caption class="vh">' + MV.plain(md(U.odd)) + "</caption><thead><tr><th scope=\"col\">" + md(U.x) + "</th>" +
      [0.5, 1, 2].map(function(x){ return '<th scope="col">' + num(x) + "</th>"; }).join("") + "</tr></thead><tbody><tr><th scope=\"row\">" + md(U.hx) + "</th>" +
      [0.5, 1, 2].map(function(x){ return "<td>" + fmtV(h(x)) + "</td>"; }).join("") + "</tr><tr><th scope=\"row\">" + md(U.hmx) + "</th>" +
      [0.5, 1, 2].map(function(x){ return "<td>" + fmtV(h(-x)) + "</td>"; }).join("") + "</tr></tbody></table></div>" +
      '<p class="c8-tl"><span class="' + (ok1 ? "c8-y" : "c8-n") + '">' + (ok1 ? U.yes : U.no) + "</span> " + MV.cap(parWhy(d)) + ": " + m("h") + " is " + U.par[pr] + ".</p>" +
      "<h4 class=\"c8-th\">" + md(U.h0) + '</h4><p class="c8-tl"><span class="' + (undef0(d) ? "c8-y" : "c8-n") + '">' + (undef0(d) ? U.yes : U.no) + "</span> " + MV.cap(why0(d)) + ".</p>" +
      "<h4 class=\"c8-th\">" + md(U.far) + '</h4><p class="c8-tl">' + [10, 100, 1000].map(function(x){ return m("h(" + x + ")") + " " + (/^≈/.test(fmtV(h(x))) || fmtV(h(x)) === U.undef ? "" : "= ") + fmtV(h(x)); }).join("; ") + "</p>" +
      '<p class="c8-tl"><span class="' + (checks(d)[2] ? "c8-y" : "c8-n") + '">' + (checks(d)[2] ? U.yes : U.no) + "</span> " + m("h(x)") + " " + md(U.lim[limCls(d)]) + ".</p>";
    draw(d);
  }
  function key(d){ return [TL[d.u].id, TL[d.v].id, TOPS[d.op].id].join("|"); }
  function unkey(k){ var p = String(k).split("|"), u = 0, v = 0, op = 0; TL.forEach(function(F, i){ if (F.id === p[0]) u = i; if (F.id === p[1]) v = i; }); TOPS.forEach(function(o, i){ if (o.id === p[2]) op = i; }); return { u:u, v:v, op:op }; }
  function text(k){ return MV.plain(m(capSrc(unkey(k)))); }
  return {
    render:function(inp, pv, A){
      api = A; T = MV.C.task; U = T.ui; var S = A.S, d = read();
      inp.innerHTML = '<div class="c8-tu"></div><div class="c8-tv"></div><div class="c8-top"></div><p class="eq-cap c8-tcap" id="c8-tcap" aria-live="polite"></p>';
      pv.innerHTML = '<h4 class="c8-th">' + md(U.graph) + '</h4><div class="plot-wrap"><canvas class="plot" id="c8-tplot" role="img" aria-label="Graph of h"></canvas></div>' +
        '<div class="c8-leg" aria-hidden="true"><span><i class="c8-sw" style="background:var(--pen)"></i>' + m("u") + '</span><span><i class="c8-sw" style="background:var(--f3)"></i>' + m("v") + '</span><span><i class="c8-sw c8-sw-h" style="background:var(--ink)"></i>' + m("h") + "</span></div>" +
        '<div class="c8-trd" id="c8-trd" aria-live="polite"></div>';
      plot = new MV.Plot($("#c8-tplot"), { xmin:-6, xmax:6, ymin:-4, ymax:4 });
      function upd(){ A.save(); preview(); A.update(); }
      var opts = TL.map(function(F){ return { t:m(F.src), say:F.say }; });
      picker($(".c8-tu", inp), { slot:"u", label:md(U.u), aria:U.uAria, options:opts.map(function(o){ return { t:o.t, say:"u equals " + o.say }; }), value:d.u, onChange:function(i){ S.u = i; upd(); } });
      picker($(".c8-tv", inp), { slot:"v", label:md(U.v), aria:U.vAria, options:opts.map(function(o){ return { t:o.t, say:"v equals " + o.say }; }), value:d.v, onChange:function(i){ S.v = i; upd(); } });
      picker($(".c8-top", inp), { slot:"op", label:U.op, aria:U.opAria, options:TOPS.map(function(o){ return { t:m(o.t), say:o.say }; }), value:d.op, onChange:function(i){ S.op = i; upd(); } });
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"), ts = MV.taskState();
        if (g && ts.found.length >= 6 && !g.querySelector(".c8-all")) g.insertAdjacentHTML("beforeend", '<p class="c8-all">' + md(T.all6) + "</p>");
      }, 0); });
      preview();
    },
    read:read,
    valid:function(d){ return valid(d) ? true : md(U.same); },
    checks:checks,
    tips:function(d, res){
      var out = [], now = T.tipNow;
      if (!res[0]) out.push(F(now[0], [U.par[parity(d)], parWhy(d)]) + " " + T.tips[0]);
      if (!res[1]) out.push(F(now[1], [why0(d)]) + " " + T.tips[1]);
      if (!res[2]) out.push(F(now[2], [md(U.lim[limCls(d)])]) + " " + T.tips[2]);
      return out;
    },
    key:key,
    label:function(k){ return m(capSrc(unkey(k))); },
    text:text,
    summary:function(ts){ var T0 = MV.C.task; return [(T0.summary || T0.title) + ": " + (ts.found.length ? "solved (" + ts.found.map(text).join("; ") + ")" : "not solved yet")]; },
    // for testing: every design with its three results
    _all:function(){ var out = []; TL.forEach(function(_, u){ TL.forEach(function(_2, v){ if (u === v) return; TOPS.forEach(function(_3, op){ var d = { u:u, v:v, op:op }; out.push({ k:key(d), c:checks(d), symOdd:parity(d) === "odd", numOdd:numOdd(d), symLim:limCls(d) === "0", numLim:numLim0(d) }); }); }); }); return out; }
  };
})();
MV._c8task = task;

MV.module({
  hero:hero,
  connect:connect,
  activities:{ mx:mixed },
  figures:figures,
  task:task,
  onShow:function(v){ if (v === "connect" && CN) CN.repaint(); }
});
})();
