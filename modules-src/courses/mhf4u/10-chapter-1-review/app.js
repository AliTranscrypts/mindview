// MHF4U 10 Chapter 1 Summary & Review: hero, per-topic tables (diagnostic, mixed practice, Final Check),
// Connect ("Four views of one function"), the mixed-practice set, the "Design a polynomial" task and the MP10 thumbnails.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num;
var TOPICS = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
function Pf(x){ return -(x + 2) * (x - 1) * (x - 1); }
var VIEW = { xmin:-3.5, xmax:2.5, ymin:-6, ymax:6 };

// @component N21 zeroBuilder.poly (helpers only: f, lobes, fit) — copied from MHF4U 05's zero builder for the task preview
var ZP = (function(){
  var P = {};
  P.f = function(zs, a){ return function(x){ var y = a; for (var i = 0; i < zs.length; i++) y *= Math.pow(x - zs[i].r, zs[i].k); return y; }; };
  P.sorted = function(zs){ return zs.slice().sort(function(p, q){ return p.r - q.r; }); };
  P.lobes = function(zs, a){
    var s = P.sorted(zs), f = P.f(zs, a), out = [];
    for (var i = 0; i + 1 < s.length; i++) {
      var best = 0;
      for (var j = 1; j < 80; j++) { var y = f(s[i].r + (s[i + 1].r - s[i].r) * j / 80); if (Math.abs(y) > Math.abs(best)) best = y; }
      out.push(best);
    }
    return out;
  };
  // Fit (G10): x from the zeros (and 0); y from the lobes, a lone zero's neighbourhood and the y-intercept.
  P.fit = function(zs, a, o){
    o = o || {};
    var f = P.f(zs, a), xs = zs.map(function(z){ return z.r; }).concat([0]);
    var lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs), pad = Math.max(1.2, (hi - lo) * 0.18), span = o.minSpan || 5;
    var xmin = lo - pad, xmax = hi + pad;
    if (xmax - xmin < span) { var c = (xmin + xmax) / 2; xmin = c - span / 2; xmax = c + span / 2; }
    var lobes = P.lobes(zs, a);
    if (!lobes.length) zs.forEach(function(z){ lobes.push(f(z.r - 1.5), f(z.r + 1.5)); });
    var vals = lobes.concat([f(0)], o.extraY || []), pos = 0, neg = 0;
    vals.forEach(function(v){ if (!isFinite(v)) return; if (v > pos) pos = v; if (-v > neg) neg = -v; });
    var mags = lobes.map(Math.abs).filter(function(v){ return v > 1e-12 && isFinite(v); });
    if (mags.length) {
      var m = Math.min.apply(null, mags), R = pos + neg, cap = Math.max(10 * m, 0.04 * R);
      if (R > cap) {
        pos = pos > 0 ? Math.max(Math.min(pos, cap * pos / R), Math.min(pos, 1.25 * m)) : 0;
        neg = neg > 0 ? Math.max(Math.min(neg, cap * neg / R), Math.min(neg, 1.25 * m)) : 0;
      }
    }
    (o.must || []).forEach(function(v){ if (v > pos) pos = v; if (-v > neg) neg = -v; });
    if (!(pos > 0) && !(neg > 0)) pos = neg = 1;
    if (pos < 0.12 * neg) pos = 0.12 * neg;
    if (neg < 0.12 * pos) neg = 0.12 * pos;
    return { xmin:xmin, xmax:xmax, ymin:-neg * 1.2, ymax:pos * 1.2 };
  };
  return P;
})();

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check) ----------
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
// Diagnostic results: the plan's score bands (11–12, 7–10, 0–6) and the per-topic Ready / Revisit table.
MV.paintWarmResult = function(){
  var host = $("#warmup-result"), W = MV.warmCfg(), S = MV.S, ws = MV.warmStats(), D = MV.C.start.diagnostic;
  if (ws.checked < ws.total) { host.innerHTML = '<p class="tiny muted" style="margin-top:12px">' + ws.checked + " of " + ws.total + " answered.</p>"; return; }
  var msg = ws.score >= 11 ? D.msgs[0] : ws.score >= 7 ? D.msgs[1] : D.msgs[2];
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
  L = L.map(function(l){ return /^Diagnostic: \d/.test(l) ? l + "; modules flagged: " + (flagged.length ? flagged.join(", ") : "none") : l; });
  var first = -1, parts = [];
  L = L.filter(function(l, i){ var m = /^ {2}Module (\d\d): (\d+\/\d+)$/.exec(l); if (!m) return true; if (first < 0) first = i; parts.push(m[1] + " " + m[2]); return false; });
  if (first >= 0) L.splice(first, 0, "Final Check by module: " + parts.join(", "));
  return L.join("\n");
};

// ---------- hero: P draws in, then seven labels pop in, each naming its module (storyboard in the plan) ----------
var HERO_CAP = ["Q2 to Q4: modules 01 and 03", "crosses: module 05", "touches: module 05", "turning points: module 03", "increasing: module 02", "slope 2: module 08", "slope 0: module 09"];
function hero(f){
  var p = new MV.Plot(f.canvas, VIEW), st = { t:0, k:0 };
  p.render = function(){
    var ink = css("--ink"), ink2 = css("--ink-2"), k = st.k, labels = [], points = [], segs = [], f13 = "600 13px " + (css("--font-ui") || "sans-serif");
    var sc = { view:VIEW, xTicks:{ step:1 }, yTicks:{ step:2 }, curves:st.t > 0.01 ? [{ f:Pf, color:css("--pen"), width:3.2, arrows:st.t >= 1, domain:[VIEW.xmin - 0.1, VIEW.xmin - 0.1 + (VIEW.xmax - VIEW.xmin + 0.2) * st.t] }] : [] };
    if (k >= 1) { sc.regions = [{ f:function(){ return 7; }, x0:VIEW.xmin, x1:0, alpha:0.55 }, { f:function(){ return -7; }, x0:0, x1:VIEW.xmax, alpha:0.55 }]; labels.push({ x:-1.2, y:3.4, text:"Q2 to Q4", align:"center", bg:true }); }
    if (k >= 2) { points.push({ x:-2, y:0, color:ink }); labels.push({ x:-2.22, y:-1.05, text:"crosses", align:"right", font:f13, bg:true }); }
    if (k >= 3) { points.push({ x:1, y:0, color:ink }); labels.push({ x:1, y:1.3, text:"touches", align:"center", font:f13, bg:true }); }
    if (k >= 4) { points.push({ x:-1, y:-4, color:ink, ring:true }, { x:1, y:0, color:ink, ring:true }); labels.push({ x:-1, y:-4.85, text:"(−1, −4)", align:"center", bg:true }, { x:0.88, y:0.55, text:"(1, 0)", align:"right", bg:true }); }
    if (k >= 5) { sc.bands = [{ x0:-1, x1:1 }]; labels.push({ x:0, y:5.2, text:"increasing", align:"center", font:f13, bg:true }); }
    if (k >= 6) { segs.push({ x1:-1, y1:-4, x2:1, y2:0, color:ink2, width:2 }); labels.push({ x:0.45, y:-2.6, text:"slope 2", align:"left", font:f13, color:ink2, bg:true }); }
    if (k >= 7) { segs.push({ x1:0.35, y1:0, x2:1.65, y2:0, color:ink, width:2.6 }); labels.push({ x:1.38, y:0.55, text:"slope 0", align:"left", font:f13, bg:true }); }
    sc.points = points; sc.segments = segs; sc.labels = labels;
    sc.describe = "Graph of P(x) = −(x + 2)(x − 1)²" + (k ? ". " + HERO_CAP.slice(0, k).join("; ") + "." : ".");
    p.draw(sc);
    f.cap.textContent = k ? HERO_CAP.slice(0, k).join(" · ") : "P(x) = −(x + 2)(x − 1)²";
  };
  if (MV.reduceMotion) { st.t = 1; st.k = 7; p.render(); return; }
  p.render();
  MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ st.t = t; p.render(); }, done:function(){
    (function next(){ if (st.k >= 7) return; MV.wait(700, function(){ st.k++; p.render(); next(); }); })();
  } });
}

// ---------- Connect: four views of one function ----------
var PTS = { pm20:{ x:-2, y:0, lab:"(−2, 0)" }, pm1m4:{ x:-1, y:-4, lab:"(−1, −4)" }, p0m2:{ x:0, y:-2, lab:"(0, −2)" }, p10:{ x:1, y:0, lab:"(1, 0)" } };
var BTN_ORDER = ["armL", "pm20", "pm1m4", "p0m2", "p10", "armR"];
var ARMS = { armL:{ x:-2.4, lab:"Left arm of the graph" }, armR:{ x:2.05, lab:"Right arm of the graph" } };
var PARTS = [{ id:"f0", m:"-", lab:"leading minus sign" }, { id:"f1", m:"(x + 2)" }, { id:"f2", m:"(x - 1)^2" }, { id:"e1", m:"-x^3" }, { id:"e2", m:"+ 3x" }, { id:"e3", m:"- 2" }];
var CVIEWS = [{ id:"eq", t:"Equation" }, { id:"graph", t:"Graph" }, { id:"table", t:"Table" }, { id:"words", t:"Words" }];
var TBL = { xs:[-3, -2, -1, 0, 1, 2, 3], ys:[16, 0, -4, -2, 0, -4, -20], d:[[-16, -4, 2, 2, -4, -16], [12, 6, 0, -6, -12], [-6, -6, -6, -6]] };
function topicsLabel(ts){ return ts.length > 1 ? "Modules " + ts.slice(0, -1).join(", ") + " and " + ts[ts.length - 1] : "Module " + ts[0]; }

function connect(host, api){
  var C = api.content, CH = C.challenges, S = api.S, msg = {};
  S.cur = Math.min(S.cur || 0, CH.length - 1); S.ch = S.ch || {}; S.tab = S.tab || CH[S.cur].view;
  if (CH[S.cur].id === "L3") S.diff = true;
  var byId = {}; CH.forEach(function(c){ byId[c.id] = c; });
  function st(c){ return S.ch[c.id] || (S.ch[c.id] = { tries:0, hint:0, solved:false, first:null, sel:[] }); }
  function solved(id){ var x = S.ch[id]; return !!(x && x.solved); }
  var tanT = 1;

  host.innerHTML = '<div class="cv" data-tab="' + S.tab + '">' +
    '<div class="cv-chal" id="cv-chal"></div>' +
    '<div class="cv-tabs" role="tablist" aria-label="Views of P">' + CVIEWS.map(function(v){ return '<button type="button" role="tab" id="cv-t-' + v.id + '" aria-controls="cv-v-' + v.id + '" data-tab="' + v.id + '" data-k="cvt' + v.id + '">' + v.t + "</button>"; }).join("") + "</div>" +
    '<div class="cv-grid">' +
      '<section class="cv-view" id="cv-v-eq" role="tabpanel" aria-labelledby="cv-t-eq"><h3>Equation</h3><div id="cv-eq"></div></section>' +
      '<section class="cv-view" id="cv-v-graph" role="tabpanel" aria-labelledby="cv-t-graph"><h3>Graph</h3><div class="plot-wrap" id="cv-gw"><canvas class="plot" id="cv-plot" role="img"></canvas>' +
        BTN_ORDER.map(function(id){ return '<button type="button" class="cv-pt" data-pt="' + id + '" data-k="cvp' + id + '"></button>'; }).join("") + "</div></section>" +
      '<section class="cv-view" id="cv-v-table" role="tabpanel" aria-labelledby="cv-t-table"><h3>Table</h3><div id="cv-table"></div></section>' +
      '<section class="cv-view" id="cv-v-words" role="tabpanel" aria-labelledby="cv-t-words"><h3>Words</h3><div class="cv-card"><p id="cv-w1"></p><div class="cv-nlw" id="cv-nlw1" hidden><canvas class="plot nl" id="cv-nl1" role="img" aria-label="Number line: increasing on (−1, 1)"></canvas></div><p id="cv-w2"></p><div class="cv-nlw" id="cv-nlw2" hidden><canvas class="plot nl" id="cv-nl2" role="img" aria-label="Number line: negative on (−2, 1) ∪ (1, ∞)"></canvas></div></div></section>' +
    "</div>" +
    '<div class="cv-one" id="cv-one"></div></div>';
  var root = $(".cv", host), plot = new MV.Plot($("#cv-plot", host), VIEW);
  var nl1 = new MV.Plot($("#cv-nl1", host)), nl2 = new MV.Plot($("#cv-nl2", host));
  nl1.render = function(){ nl1.draw({ numberLine:{ min:-4, max:3, pieces:[{ a:-1, b:1, aIn:false, bIn:false }] }, describe:"Number line: increasing on (−1, 1)" }); };
  nl2.render = function(){ nl2.draw({ numberLine:{ min:-4, max:3, pieces:[{ a:-2, b:1, aIn:false, bIn:false }, { a:1, b:Infinity, aIn:false, bIn:false }] }, describe:"Number line: negative on (−2, 1) ∪ (1, ∞)" }); };

  // ---- graph view ----
  plot.render = function(){
    var c = CH[S.cur], x = st(c), ink = css("--ink"), ink2 = css("--ink-2"), segs = [], labels = [], points = [];
    var sec = c.id === "L6" || solved("L6"), tan = solved("L7");
    if (sec) segs.push({ x1:-1, y1:-4, x2:1, y2:0, color:ink2, width:2 });
    if (tan) {
      segs.push({ x1:-1 - 0.75 * tanT, y1:-4, x2:-1 + 0.75 * tanT, y2:-4, color:ink, width:2.4 }, { x1:1 - 0.75 * tanT, y1:0, x2:1 + 0.75 * tanT, y2:0, color:ink, width:2.4 });
      if (tanT >= 1) labels.push({ x:-0.2, y:-4.35, text:"slope 0", align:"left", bg:true }, { x:1.3, y:0.62, text:"slope 0", align:"left", bg:true });
    }
    Object.keys(PTS).forEach(function(id){
      var p = PTS[id], on = (c.type === "graph2" && x.sel.indexOf(id) >= 0) || ((c.type === "graph" || c.type === "graph2") && x.solved && [].concat(MV.ans(c)).indexOf(id) >= 0);
      points.push({ x:p.x, y:p.y, r:5, color:ink, ring:on });
    });
    labels.push({ x:-2.12, y:0.6, text:"(−2, 0)", align:"right", bg:true }, { x:-1, y:-4.85, text:"(−1, −4)", align:"center", bg:true },
      { x:-0.14, y:-2.5, text:"(0, −2)", align:"right", bg:true }, { x:0.86, y:0.62, text:"(1, 0)", align:"right", bg:true });
    plot.draw({ view:VIEW, xTicks:{ step:1 }, yTicks:{ step:2 }, curves:[{ f:Pf, color:css("--pen"), width:3.2, arrows:true }], segments:segs, points:points, labels:labels,
      describe:"Graph of P(x) = −(x + 2)(x − 1)², from quadrant 2 to quadrant 4. Marked points: (−2, 0), (−1, −4), (0, −2) and (1, 0)." + (sec ? " The secant from (−1, −4) to (1, 0) is drawn." : "") + (tan ? " Horizontal tangents are drawn at (−1, −4) and (1, 0)." : "") });
  };
  plot.onDrawn(function(){
    var cv = plot.c, c = CH[S.cur], x = st(c), live = (c.type === "graph" || c.type === "graph2") && !x.solved;
    BTN_ORDER.forEach(function(id){
      var b = host.querySelector('[data-pt="' + id + '"]'), p = PTS[id] || { x:ARMS[id].x, y:Pf(ARMS[id].x) };
      b.style.left = (cv.offsetLeft + plot.X(p.x)) + "px"; b.style.top = (cv.offsetTop + plot.Y(p.y)) + "px";
      var lab = PTS[id] ? "Point " + PTS[id].lab : ARMS[id].lab;
      b.setAttribute("aria-label", lab); b.disabled = !live;
      if (c.type === "graph2") b.setAttribute("aria-pressed", String(x.sel.indexOf(id) >= 0)); else b.removeAttribute("aria-pressed");
    });
  });

  // ---- equation, table, words ----
  function paintEq(){
    var c = CH[S.cur], x = st(c), live = c.type === "eq" && !x.solved, L1 = st(byId.L1);
    function part(p){
      var cls = "cv-part" + (L1.solved && p.id === MV.ans(byId.L1) ? " on" : "") + (c.type === "eq" && !x.solved && x.last === p.id ? " bad" : "");
      return '<button type="button" class="' + cls + '" data-part="' + p.id + '" data-k="cvq' + p.id + '" aria-label="' + MV.esc(p.lab || MV.plain(MV.m(p.m))) + '"' + (live ? "" : " disabled") + ">" + MV.m(p.m) + "</button>";
    }
    MV.keepFocus($("#cv-eq", host), function(){
      $("#cv-eq", host).innerHTML = '<p class="tiny muted cv-form">Factored form</p><p class="cv-eqline">' + MV.m("P(x) =") + " " + PARTS.slice(0, 3).map(part).join("") + "</p>" +
        '<p class="tiny muted cv-form">Expanded form</p><p class="cv-eqline">' + MV.m("P(x) =") + " " + PARTS.slice(3).map(part).join(" ") + "</p>" +
        (live ? '<p class="tiny muted" style="margin:0">Tap a part of an equation.</p>' : "");
    });
  }
  function paintTable(){
    var show = S.diff || solved("L3"), hiD = CH[S.cur].id === "L3", m = function(v){ return v == null ? "" : MV.m(String(v)); };
    var rows = [["`x`", TBL.xs], ["`P(x)`", TBL.ys]];
    if (show) TBL.d.forEach(function(d, i){ rows.push([["1st", "2nd", "3rd"][i] + " differences", new Array(i + 1).concat(d)]); });
    $("#cv-table", host).innerHTML = '<div class="tbl-wrap"><table class="vt cv-tbl"><caption class="vh">Table of values of P' + (show ? " with first, second and third differences" : "") + "</caption><tbody>" +
      rows.map(function(r, ri){ return "<tr" + (hiD && ri === 4 ? ' class="cv-hl"' : "") + '><th scope="row">' + MV.md(r[0]) + "</th>" + r[1].concat(new Array(7 - r[1].length)).slice(0, 7).map(function(v){ return "<td>" + m(v) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>" + (show ? "" : '<p class="tiny muted" style="margin:8px 0 0">The difference rows appear with the challenge that needs them.</p>');
  }
  function paintWords(){
    var W = C.words, a = solved("L4"), b = solved("L5");
    $("#cv-w1", host).innerHTML = a ? W.inc : '<span class="muted">' + W.incBlank + "</span>";
    $("#cv-w2", host).innerHTML = b ? W.neg : '<span class="muted">' + W.negBlank + "</span>";
    $("#cv-nlw1", host).hidden = !a; $("#cv-nlw2", host).hidden = !b;
    if (a) nl1.render(); if (b) nl2.render();
  }
  function paintOne(){
    var host1 = $("#cv-one", host), all = CH.every(function(c){ return solved(c.id); }), O = C.onePage;
    if (!all) { host1.innerHTML = '<p class="tiny muted">' + CH.filter(function(c){ return solved(c.id); }).length + " of " + CH.length + " challenges done. “" + O.title + "” appears when all " + CH.length + " are done.</p>"; return; }
    if (host1.dataset.done) return;
    host1.dataset.done = "1";
    host1.innerHTML = '<h3>' + O.title + '</h3><p class="muted">' + O.intro + "</p>" + onePageSVG(O.links) +
      '<ol class="cv-links">' + O.links.map(function(l){ return "<li>" + l.t + ' <span class="tiny muted">(' + vname(l.a) + " and " + vname(l.b) + ")</span></li>"; }).join("") + "</ol>";
  }
  function vname(id){ return CVIEWS.filter(function(v){ return v.id === id; })[0].t; }

  // ---- the challenge card ----
  function paintChal(){
    var c = CH[S.cur], x = st(c), i = S.cur, box = $("#cv-chal", host), tl = topicsLabel(c.topics), h;
    h = '<div class="pred-top cv-top"><span class="tiny muted">Challenge ' + (i + 1) + " of " + CH.length + '</span><span class="cv-tags"><span class="tag">' + tl + "</span>" + (c.stretch ? '<span class="tag">Stretch</span>' : "") + '</span><span class="dots" aria-hidden="true">' +
      CH.map(function(q, k){ return '<span class="dot' + (solved(q.id) ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    if (c.type === "choose") {
      h += MV.mcHTML({ id:c.id, prompt:c.prompt, options:c.options, hints:c.hints }, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true });
    } else {
      h += '<div class="q-head"><div class="q-prompt">' + c.prompt + "</div></div>";
      if (!x.solved) {
        if (c.type === "eq") h += '<p class="how">Tap a part of an equation in the Equation view.</p>';
        if (c.type === "graph") h += '<p class="how">Tap a point on the graph in the Graph view.</p>';
        if (c.type === "graph2") h += '<p class="how">Tap points on the graph to select them, then press Check.</p><p class="tiny muted" aria-live="polite">Selected: ' + (x.sel.length ? x.sel.map(function(id){ return PTS[id] ? PTS[id].lab : ARMS[id].lab.toLowerCase(); }).join(", ") : "none") + "</p>";
        if (c.type === "num") h += '<div class="numrow"><label for="cv-num">Slope:</label><input class="numin" id="cv-num" data-cvn="1" type="number" step="any" autocomplete="off" value="' + MV.esc(x.val || "") + '"></div>';
        h += '<div class="q-actions">' + (c.type === "graph2" || c.type === "num" ? '<button type="button" class="btn primary sm" data-act="check" data-k="cvchk">Check</button>' : "") + MV.hintBtn("cvh" + c.id, x.hint) + "</div>" + MV.hintsHTML(c.hints, x.hint);
      }
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (c.type === "num" ? ": the slope is 2" : "") + ".</strong> " + c.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msg[c.id]) h += MV.fbHTML("bad", msg[c.id]);
    }
    if (c.type === "choose" && x.solved && !x.first) h += '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>';
    h += '<div class="q-actions cv-nav"><button type="button" class="btn ghost sm" data-cv="prev" data-k="cvprev"' + (i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-cv="next" data-k="cvnext"' + (i === CH.length - 1 ? " disabled" : "") + ">Next challenge</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paintTabs(){
    root.dataset.tab = S.tab;
    $$(".cv-tabs [data-tab]", host).forEach(function(b){ var on = b.dataset.tab === S.tab; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    plot.render();
  }
  function paintAll(){ paintChal(); paintEq(); paintTable(); paintWords(); paintOne(); paintTabs(); }

  // ---- judging ----
  function solve(c, x){
    x.solved = true; x.first = x.tries === 0 && x.hint < 3; msg[c.id] = null;
    if (c.id === "L7") { tanT = 0; MV.tween({ dur:700, step:function(t){ tanT = t; plot.render(); } }); }
  }
  function wrong(c, x, text){ x.tries++; msg[c.id] = "<strong>✗ Not quite.</strong> " + text + " Try again."; }
  function tapFb(c, id){ return id.indexOf("arm") === 0 ? c.fb.arm : (c.fb[id] || (id.charAt(0) === "f" ? c.fb.factored : "")); }
  function after(){ api.save(); paintAll(); MV.focusFb($("#cv-chal", host)); }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CH[S.cur], x = st(c);
    if (b.dataset.tab) { S.tab = b.dataset.tab; api.save(); paintTabs(); return; }
    if (b.dataset.cv) {
      S.cur = Math.max(0, Math.min(CH.length - 1, S.cur + (b.dataset.cv === "next" ? 1 : -1)));
      S.tab = CH[S.cur].view; if (CH[S.cur].id === "L3") S.diff = true;
      api.save(); paintAll();
      var nb = host.querySelector('[data-cv="' + b.dataset.cv + '"]'); if (nb && !nb.disabled) nb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.part) {
      if (c.type !== "eq" || x.solved) return;
      if (b.dataset.part === MV.ans(c)) solve(c, x); else { x.last = b.dataset.part; wrong(c, x, tapFb(c, b.dataset.part)); }
      after(); return;
    }
    if (b.dataset.pt) {
      if (x.solved) return;
      if (c.type === "graph") { if (b.dataset.pt === MV.ans(c)) solve(c, x); else wrong(c, x, tapFb(c, b.dataset.pt)); after(); }
      else if (c.type === "graph2") { var k = x.sel.indexOf(b.dataset.pt); if (k < 0) x.sel.push(b.dataset.pt); else x.sel.splice(k, 1); msg[c.id] = null; api.save(); paintChal(); plot.render(); }
      return;
    }
    if (b.dataset.i != null && c.type === "choose") { x.choice = +b.dataset.i; x.checked = false; api.save(); paintChal(); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paintChal(); return; }
    if (b.dataset.act === "check") {
      if (c.type === "choose") { if (x.choice == null) return; x.checked = true; if (MV.ok(c.options[x.choice])) solve(c, x); else x.tries++; }
      else if (c.type === "num") {
        var v = MV.parseNum(x.val);
        if (!v || v.length !== 1) { msg[c.id] = "Enter a number, such as 3 or −1.5."; paintChal(); MV.focusFb($("#cv-chal", host)); return; }
        if (Math.abs(v[0] - MV.ans(c)) <= (c.tol || 0) + 1e-9) solve(c, x);
        else { var w = (c.wrong || []).filter(function(q){ return MV.sameNums(v, [q.match], 1e-9); })[0]; wrong(c, x, w ? w.fb : "Find the rise and the run, then divide."); }
      } else if (c.type === "graph2") {
        var sel = x.sel, want = MV.ans(c);
        if (!sel.length) { msg[c.id] = "Tap at least one point on the graph first."; paintChal(); MV.focusFb($("#cv-chal", host)); return; }
        if (sel.length === want.length && want.every(function(w){ return sel.indexOf(w) >= 0; })) solve(c, x);
        else if (sel.indexOf("pm20") >= 0) wrong(c, x, c.fb.pm20);
        else if (sel.indexOf("p0m2") >= 0) wrong(c, x, c.fb.p0m2);
        else if (sel.some(function(s){ return s.indexOf("arm") === 0; })) wrong(c, x, c.fb.arm);
        else wrong(c, x, c.fb.one);
      }
      after();
    }
  });
  host.addEventListener("input", function(e){ if (e.target.dataset && e.target.dataset.cvn) { st(CH[S.cur]).val = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.cvn) { var b = host.querySelector('[data-k="cvchk"]'); if (b) b.click(); return; }
    var t = e.target.closest && e.target.closest(".cv-tabs [data-tab]"); if (!t) return;
    var ids = CVIEWS.map(function(v){ return v.id; }), k = ids.indexOf(t.dataset.tab), d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
    e.preventDefault(); S.tab = ids[(k + d + ids.length) % ids.length]; api.save(); paintTabs(); host.querySelector('.cv-tabs [data-tab="' + S.tab + '"]').focus();
  });
  paintAll();

  // Register with the activity list so the summary and "skills to review" include Connect.
  MV.ACTS.connect = { a:{ id:"connect", title:C.summary },
    stats:function(){ var f = 0, d = 0; CH.forEach(function(c){ var x = S.ch[c.id]; if (x && x.solved) d++; if (x && x.first) f++; }); return { first:f, total:CH.length, done:d, line:C.summary + " (first try): " + f + "/" + CH.length + (d < CH.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CH.forEach(function(c){ var x = S.ch[c.id]; if (x && (x.tries > 0 || x.hint >= 3)) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  return {};
}
// "The chapter on one page": the four views as boxes, each link a numbered line between the two views it joins.
function onePageSVG(links){
  var B = { eq:[20, 20, "Equation", "factored and expanded"], graph:[380, 20, "Graph", "zeros, turning points, slopes"], table:[20, 250, "Table", "values and differences"], words:[380, 250, "Words", "intervals in words"] };
  var W = 200, H = 90;
  var paths = { 1:[[220, 42], [380, 42]], 2:[[220, 65], [380, 65]], 8:[[220, 88], [380, 88]], 3:[[120, 250], [120, 110]], 4:[[440, 110], [440, 250]], 5:[[520, 110], [520, 250]], 6:[[160, 250], [380, 95]], 7:[[220, 290], [400, 110]] }, bx = { 1:260, 2:300, 8:340 };
  var s = '<svg class="cv-svg" viewBox="0 0 600 360" role="img" aria-label="The four views of P, Equation, Graph, Table and Words, joined by eight numbered links, one for each challenge.">';
  Object.keys(B).forEach(function(k){ var b = B[k]; s += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + W + '" height="' + H + '" rx="10" class="cv-box"/><text x="' + (b[0] + W / 2) + '" y="' + (b[1] + 36) + '" class="cv-bt">' + b[2] + '</text><text x="' + (b[0] + W / 2) + '" y="' + (b[1] + 62) + '" class="cv-bs">' + b[3] + "</text>"; });
  links.forEach(function(l){
    var p = paths[l.n]; if (!p) return;
    var mx = (p[0][0] + p[1][0]) / 2, my = (p[0][1] + p[1][1]) / 2;
    if (bx[l.n]) mx = bx[l.n];
    s += '<line x1="' + p[0][0] + '" y1="' + p[0][1] + '" x2="' + p[1][0] + '" y2="' + p[1][1] + '" class="cv-ln"/><circle cx="' + mx + '" cy="' + my + '" r="14" class="cv-bd"/><text x="' + mx + '" y="' + (my + 6) + '" class="cv-bn">' + l.n + "</text>";
  });
  return s + "</svg>";
}

// ---------- Mixed practice: MC (retry), graph options, number entry and tap a point, in the plan's fixed order ----------
function mixed(host, api, a){
  var S = api.S; S.items = S.items || {};
  var items = a.items, msgs = {}, taps = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function tags(it){ return '<span class="tags"><span class="tag">' + MV.topicLabel(it.topic) + "</span>" + (it.star ? '<span class="tag">★ Challenge</span>' : "") + "</span>"; }
  function head(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + tags(it) + "</div>"; }
  function box(it){ return host.querySelector('[data-mx="' + it.id + '"]'); }
  function feedback(it, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    return msgs[it.id] ? MV.fbHTML("bad", msgs[it.id]) : "";
  }
  function actions(it, x, label){ return x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">' + (label || "Check") + "</button>" + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint); }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';

  function paint(it){
    var i = items.indexOf(it), x = ist(it.id), el = box(it);
    if (it.kind === "mc" || it.kind === "graphs") {
      var shown = it;
      if (x.tries > 0 || x.solved) shown = Object.assign({}, it, { options:it.options.map(function(o){ return o.tb ? Object.assign({}, o, { t:o.tb }) : o; }) });
      MV.keepFocus(el, function(){
        el.innerHTML = MV.mcHTML(shown, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:MV.topicLabel(it.topic) + (it.star ? '</span><span class="tag">★ Challenge' : "") }) +
          (x.solved && !x.first ? '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>' : "");
      });
    } else if (it.kind === "num") {
      MV.keepFocus(el, function(){
        el.innerHTML = head(it, i) + '<div class="numrow"><label for="mxn-' + it.id + '">Your answer:</label><input class="numin" id="mxn-' + it.id + '" data-mxn="' + it.id + '" type="number" step="any" autocomplete="off" value="' + MV.esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + "></div>" +
          actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>";
      });
    } else if (it.kind === "tap") {
      if (!taps[it.id]) buildTap(it, el, i);
      var dyn = $(".mx-dyn", el);
      MV.keepFocus(dyn, function(){ dyn.innerHTML = actions(it, x, "Check this point") + feedback(it, x); });
      taps[it.id].render();
    }
    paintSum();
  }
  function buildTap(it, el, i){
    var x = ist(it.id);
    el.innerHTML = head(it, i) + '<div class="plot-wrap mx-tap"><canvas class="plot" role="img" aria-label="' + MV.esc(it.describe) + '"></canvas></div>' +
      '<p class="how">Tap the graph to place the marker, or move it with the arrow keys. Then press Check this point.</p><div class="mx-dyn"></div>';
    var p = new MV.Plot($("canvas", el), it.view);
    if (!x.mark) x.mark = [0.5, 5];
    var snap = function(X, Y){ return [Math.max(it.view.xmin, Math.min(it.view.xmax, Math.round(X * 10) / 10)), Math.max(it.view.ymin, Math.min(it.view.ymax, Math.round(Y * 2) / 2))]; };
    var f = function(X){ return Math.pow(X + 1, 3) * (X - 2); };
    p.render = function(){
      var pts = [], ans = MV.ans(it);
      if (x.solved) pts.push({ x:ans[0], y:ans[1], r:6, color:css("--ink"), label:"(−1, 0)" });
      else pts.push({ x:x.mark[0], y:x.mark[1], r:7, color:css("--ink"), ring:true });
      p.draw({ view:it.view, curves:[{ f:f, color:css("--pen"), width:3, arrows:true }], points:pts, describe:it.describe + (x.solved ? " The zero (−1, 0) is marked." : " Your marker is at (" + num(x.mark[0], 1) + ", " + num(x.mark[1], 1) + ").") });
    };
    MV.drag(p, { handles:function(){ return x.solved ? [] : [{ id:"m", x:x.mark[0], y:x.mark[1], label:"Your marker at (" + num(x.mark[0], 1) + ", " + num(x.mark[1], 1) + "). Use the arrow keys to move it." }]; },
      move:function(id, X, Y){ x.mark = snap(X, Y); msgs[it.id] = null; api.save(); p.render(); }, snap:snap, step:{ x:0.1, y:0.5 }, big:5 });
    p.c.style.touchAction = "pan-y";
    p.c.addEventListener("click", function(e){
      if (x.solved) return;
      var r = p.c.getBoundingClientRect(); x.mark = snap(p.xOf(e.clientX - r.left), p.yOf(e.clientY - r.top)); msgs[it.id] = null; api.save(); p.render();
      var dyn = $(".mx-dyn", el); dyn.innerHTML = actions(it, x, "Check this point") + feedback(it, x);
    });
    taps[it.id] = p;
  }
  function paintSum(){
    var el = $(".mx-sum", host), done = items.filter(function(it){ return ist(it.id).solved; }).length;
    if (done < items.length) { el.innerHTML = '<p class="tiny muted">' + done + " of " + items.length + " done. Your first-try table by module appears when all " + items.length + " are done.</p>"; return; }
    var rows = TOPICS.map(function(t){ var its = items.filter(function(it){ return it.topic === t; }); return { t:t, n:its.length, r:its.filter(function(it){ return ist(it.id).first; }).length }; }).filter(function(o){ return o.n; });
    el.innerHTML = '<div class="part"><h3>Your first tries by module</h3>' + topicTable(rows, "First try", "Mixed practice first tries by module") + "</div>";
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.mxn; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.mxn) { var b = host.querySelector('[data-k="' + e.target.dataset.mxn + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-mx]"); if (!el) return;
    var it = items.filter(function(q){ return q.id === el.dataset.mx; })[0], x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paint(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paint(it); return; }
    if (b.dataset.act !== "check") return;
    if (it.kind === "mc" || it.kind === "graphs") {
      if (x.choice == null) return;
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else if (it.kind === "num") {
      var v = MV.parseNum(x.val);
      if (!v || v.length !== 1) { msgs[it.id] = "Enter a number, such as 12 or −3.5."; paint(it); MV.focusFb(el); return; }
      if (Math.abs(v[0] - MV.ans(it)) < 1e-9) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; var w = (it.wrong || []).filter(function(q){ return MV.sameNums(v, [q.match], 1e-9); })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : "Check your work.") + " Try again."; }
    } else if (it.kind === "tap") {
      var m = x.mark, ans = MV.ans(it), tol = it.tol;
      var near = function(pt){ return Math.abs(m[0] - pt[0]) <= tol + 1e-9 && Math.abs(m[1] - pt[1]) <= 1 + 1e-9; };
      if (near(ans)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (near(it.other.at) ? it.other.fb : it.elsewhere) + " Try again."; }
    }
    api.save(); paint(it); MV.focusFb(el);
  });
  items.forEach(paint);
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- MP10 graph-option thumbnails (window −2 ≤ x ≤ 5, −30 ≤ y ≤ 35) ----------
var THUMB = {
  mp10a:function(x){ return 4 * Math.pow(x, 3) - Math.pow(x, 4); },
  mp10b:function(x){ return 2 * (x + 1) * (x - 2) * (x - 4); },
  mp10c:function(x){ return -0.3 * (x + 1.6) * (x + 0.6) * (x - 0.9) * (x - 2.4) * (x - 3.8) * (x - 4.7); },
  mp10d:function(x){ return 1.1 * (x + 1.4) * (x - 0.6) * (x - 2.6) * (x - 4.4); }
};
var figures = {};
Object.keys(THUMB).forEach(function(k){
  figures[k] = function(p, c){ p.draw({ view:{ xmin:-2, xmax:5, ymin:-30, ymax:35 }, xTicks:{ step:1 }, yTicks:{ step:10, fmt:function(){ return ""; } }, curves:[{ f:THUMB[k], color:css("--pen"), width:2.6, arrows:true }], describe:c.getAttribute("aria-label") }); };
});

// ---------- performance task: design a polynomial (fraction box for a, three zero slots with order chips) ----------
var task = (function(){
  var api = null, plot = null, nl = null;
  function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function rat(n, d){ if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n:n / g, d:d / g }; }
  function parseRat(s){
    s = String(s == null ? "" : s).trim().replace(/−/g, "-");
    if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
    var neg = s.charAt(0) === "-", p = s.replace(/^[-+]/, "").split("."), dec = p[1] || "";
    if (dec.length > 6) return null;
    var n = parseInt((p[0] || "0") + dec, 10), d = Math.pow(10, dec.length);
    return rat(neg ? -n : n, d);
  }
  function fracM(q){ var s = q.n < 0 ? "-" : "", n = Math.abs(q.n); return q.d === 1 ? s + n : s + "{" + n + "}/{" + q.d + "}"; }
  function read(){
    var s = api ? api.S : {}, an = parseRat(s.an), adRaw = s.ad == null ? "" : String(s.ad).trim(), ad = adRaw === "" ? { n:1, d:1 } : parseRat(adRaw);
    var a = an && ad && ad.n !== 0 ? rat(an.n * ad.d, an.d * ad.n) : null;
    var slots = (s.z || []).map(function(z){ var t = String(z.v == null ? "" : z.v).trim().replace(/−/g, "-"); if (t === "") return null; var v = Number(t); return { r:v, m:z.m || 1 }; });
    var filled = slots.filter(Boolean), numsOK = filled.every(function(z){ return Number.isInteger(z.r) && Math.abs(z.r) <= 99; });
    var rs = filled.map(function(z){ return z.r; }), distinct = rs.every(function(r, i){ return rs.indexOf(r) === i; });
    return { a:a, slots:slots, filled:filled, numsOK:numsOK, distinct:distinct, deg:filled.reduce(function(t, z){ return t + z.m; }, 0) };
  }
  function yInt(d){ var Q = 1; d.filled.forEach(function(z){ Q *= Math.pow(-z.r, z.m); }); return rat(d.a.n * Q, d.a.d); }
  // exact sign of y in each region between neighbouring distinct zeros (parity of the orders)
  function regions(d){
    var rs = d.filled.map(function(z){ return z.r; }).filter(function(r, i, all){ return all.indexOf(r) === i; }).sort(function(p, q){ return p - q; });
    var b = [-Infinity].concat(rs, [Infinity]), out = [];
    for (var i = 0; i + 1 < b.length; i++) {
      var t = b[i] === -Infinity ? (isFinite(b[i + 1]) ? b[i + 1] - 1 : 0) : b[i + 1] === Infinity ? b[i] + 1 : (b[i] + b[i + 1]) / 2, sg = d.a.n > 0 ? 1 : -1;
      d.filled.forEach(function(z){ if (t < z.r && z.m % 2) sg = -sg; });
      out.push({ a:b[i], b:b[i + 1], aIn:false, bIn:false, s:sg });
    }
    return out;
  }
  function ivText(ps){ return ps.length ? MV.iv.text(ps) : "∅"; }
  function eqM(d){
    var a = d.a, c = !a ? "@a{?}" : a.d === 1 && a.n === 1 ? "" : a.d === 1 && a.n === -1 ? "@a{-}" : "@a{" + fracM(a) + "}";
    var fs = d.slots.filter(Boolean).map(function(z){ var r = z.r; if (!isFinite(r)) return "(x - ?)"; var b = r === 0 ? "x" : "(x " + (r < 0 ? "+ " : "- ") + Math.abs(r) + ")"; return z.m > 1 ? b + "^" + z.m : b; });
    if (!fs.length && c === "") c = "1"; else if (!fs.length && c === "@a{-}") c = "@a{-1}";
    return "y = " + c + fs.join("");
  }
  function valid1(d){ return !!d.a && d.a.n !== 0 && d.numsOK && d.distinct && d.filled.every(function(z){ return Number.isInteger(z.r) && z.r >= -5 && z.r <= 5 && [1, 2, 3].indexOf(z.m) >= 0; }); }
  function checks(d){
    var ok = !!d.a && d.numsOK, regs = ok ? regions(d) : [];
    var y0 = ok ? yInt(d) : null;
    return [valid1(d), d.deg === 4, !!d.a && d.a.n > 0 && d.deg % 2 === 0 && d.deg >= 2, d.filled.length === 3 && d.distinct && d.numsOK,
      !!y0 && y0.n === -6 && y0.d === 1, ok && regs.filter(function(r){ return r.s < 0; }).length === 1];
  }
  function draw(){
    var d = read(), cap = $("#pt-eq");
    if (cap) cap.innerHTML = MV.m(eqM(d));
    var signs = $("#pt-signs");
    if (!d.a || !d.numsOK) {
      plot.draw({ view:{ xmin:-6, xmax:6, ymin:-10, ymax:10 }, describe:"Empty graph. Enter a leading coefficient and the zeros to see your design." });
      nl.draw({ numberLine:{ min:-6, max:6, pieces:[] }, describe:"Empty number line." });
      if (signs) signs.innerHTML = '<span class="muted">Enter whole-number zeros and a value for ' + MV.m("a") + " to see where your design is positive and negative.</span>";
      return;
    }
    var av = d.a.n / d.a.d, zs = d.filled.map(function(z){ return { r:z.r, k:z.m }; }), f = ZP.f(zs, av), regs = regions(d);
    var pos = regs.filter(function(r){ return r.s > 0; }), neg = regs.filter(function(r){ return r.s < 0; });
    var y0 = yInt(d), y0v = y0.n / y0.d, view = ZP.fit(zs, av, { minSpan:6, extraY:[y0v] });
    var pts = zs.map(function(z){ return { x:z.r, y:0, r:4.5, color:css("--ink") }; });
    pts.push({ x:0, y:y0v, r:4.5, color:css("--ink"), label:"(0, " + MV.plain(MV.m(fracM(y0))) + ")" });
    var desc = "Graph of " + MV.plain(MV.m(eqM(d))) + ". y-intercept " + MV.plain(MV.m(fracM(y0))) + ". Positive on " + MV.plain(MV.m(ivText(pos))) + ", negative on " + MV.plain(MV.m(ivText(neg))) + ".";
    plot.draw({ view:view, bands:neg.map(function(r){ return { x0:r.a === -Infinity ? view.xmin : r.a, x1:r.b === Infinity ? view.xmax : r.b }; }), curves:[{ f:f, color:css("--pen"), width:3, arrows:true }], points:pts, describe:desc });
    nl.draw({ numberLine:{ min:-6, max:6, pieces:neg.map(function(r){ return { a:r.a, b:r.b, aIn:false, bIn:false }; }) }, describe:"Number line showing where y is negative: " + MV.plain(MV.m(ivText(neg))) + "." });
    if (signs) signs.innerHTML = "positive on " + MV.m(ivText(pos)) + ", negative on " + MV.m(ivText(neg));
  }
  function slotHTML(i){
    var z = api.S.z[i];
    return '<fieldset class="pt-z"><legend>Zero ' + (i + 1) + '</legend><label class="pt-zl"><span>value</span><input class="pt-in" type="number" min="-5" max="5" step="1" data-zv="' + i + '" value="' + MV.esc(z.v) + '" aria-label="Zero ' + (i + 1) + ' (a whole number from −5 to 5; leave empty for no zero)"></label>' +
      '<div class="pt-ord" role="radiogroup" aria-label="Order of zero ' + (i + 1) + '"><span class="tiny">order</span>' + [1, 2, 3].map(function(m){ var on = z.m === m; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-zo="' + i + '" data-m="' + m + '" data-k="pto' + i + m + '">' + m + "</button>"; }).join("") + "</div></fieldset>";
  }
  function key(d){ return d.filled.slice().sort(function(p, q){ return p.r - q.r; }).map(function(z){ return z.r + ":" + z.m; }).join(",") + "|" + d.a.n + "/" + d.a.d; }
  function parseKey(k){ var p = k.split("|"), q = p[1].split("/"); return { a:{ n:+q[0], d:+q[1] }, slots:p[0].split(",").map(function(t){ var u = t.split(":"); return { r:+u[0], m:+u[1] }; }) }; }
  return {
    render:function(inp, pv, a){
      api = a; var S = a.S;
      if (!S.z) { S.an = "1"; S.ad = "1"; S.z = [{ v:"-2", m:1 }, { v:"1", m:1 }, { v:"", m:1 }]; }
      inp.innerHTML = '<div class="pt-arow"><span class="pt-lab" id="pt-alab">Leading coefficient ' + MV.m("@a{a} =") + '</span><span class="pt-frac" role="group" aria-labelledby="pt-alab">' +
        '<input class="pt-in" id="pt-an" type="number" step="any" autocomplete="off" aria-label="Numerator of a" value="' + MV.esc(S.an) + '"><span class="pt-bar" aria-hidden="true"></span>' +
        '<input class="pt-in" id="pt-ad" type="number" step="any" autocomplete="off" aria-label="Denominator of a" value="' + MV.esc(S.ad) + '"></span></div>' +
        '<p class="tiny muted pt-note">Enter a fraction. A whole number goes over 1, and decimals such as 0.375 are fine too.</p>' +
        '<div class="pt-zs">' + [0, 1, 2].map(slotHTML).join("") + "</div>";
      pv.innerHTML = '<p class="eq-cap pt-eq" id="pt-eq" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="pt-plot" role="img"></canvas></div>' +
        '<dl class="read pt-read" aria-live="polite"><div><dt>Sign of your design</dt><dd id="pt-signs"></dd></div></dl><canvas class="plot nl pt-nl" id="pt-nl" role="img"></canvas>';
      plot = new MV.Plot($("#pt-plot"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); plot.render = draw;
      nl = new MV.Plot($("#pt-nl")); nl.render = draw;
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.id === "pt-an") S.an = t.value; else if (t.id === "pt-ad") S.ad = t.value; else if (t.dataset.zv != null) S.z[+t.dataset.zv].v = t.value; else return;
        a.save(); draw(); a.update();
      });
      function setOrder(i, m, focus){
        S.z[i].m = m; a.save();
        var fs = inp.querySelectorAll(".pt-z")[i], d = document.createElement("div"); d.innerHTML = slotHTML(i);
        var nr = d.querySelector(".pt-ord"); fs.replaceChild(nr, fs.querySelector(".pt-ord"));
        if (focus) nr.querySelector('[data-m="' + m + '"]').focus();
        draw(); a.update();
      }
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-zo]"); if (!b) return; setOrder(+b.dataset.zo, +b.dataset.m, true); });
      inp.addEventListener("keydown", function(e){
        var b = e.target.closest && e.target.closest("[data-zo]"); if (!b) return;
        var dlt = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!dlt) return;
        e.preventDefault(); var m = ((+b.dataset.m - 1 + dlt + 3) % 3) + 1; setOrder(+b.dataset.zo, m, true);
      });
      draw();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(d, c){
      var T = MV.C.task.tips, out = [], ok = !!d.a && d.numsOK;
      if (!c[0]) out.push(T[0]);
      if (!c[1]) out.push(T[1].replace("{sum}", d.deg));
      if (!c[2]) out.push(T[2]);
      if (!c[3]) out.push(T[3]);
      if (!c[4]) out.push(T[4].replace("{value}", ok ? MV.m(fracM(yInt(d))) : "?"));
      if (!c[5]) out.push(T[5].replace("{intervals}", ok ? MV.m(ivText(regions(d).filter(function(r){ return r.s < 0; }))) : "?"));
      return out;
    },
    key:key,
    label:function(k){ return MV.m(eqM(parseKey(k))); },
    text:function(k){ return MV.plain(MV.m(eqM(parseKey(k)))); }
  };
})();

MV.module({
  hero:hero,
  connect:connect,
  activities:{ mx:mixed },
  task:task,
  figures:figures
});
})();
