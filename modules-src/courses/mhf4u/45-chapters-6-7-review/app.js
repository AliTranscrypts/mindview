// MHF4U 45 Chapters 6–7 Summary & Review: hero (2^x, its mirror log2 x, a transformation, a Richter ruler and a root
// check), per-topic tables (diagnostic, mixed practice, Final Check), Connect "Exponential ↔ logarithm concept map"
// (N18 connection builder + the chapter on one page), the mixed-practice set (choice and number entry) and the
// "A positive root that fails" task (equation builder with a domain gate, adapted from MHF4U 44).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, m = MV.m, MINUS = MV.MINUS;
var TOPICS = ["37", "38", "39", "40", "41", "42", "43", "44"];
function fill(s, o){ return String(s == null ? "" : s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function F(s, a){ return String(s == null ? "" : s).replace(/§(\d)/g, function(mm, k){ var v = a[+k - 1]; return v == null ? mm : v; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lg2(x){ return Math.log(x) / Math.LN2; }
function modsLabel(ts){ return ts.length > 1 ? "Modules " + ts.slice(0, -1).join(", ") + " and " + ts[ts.length - 1] : "Module " + ts[0]; }
function scrollTo(el){ if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check), as in MHF4U 10, 16, 24, 30 and 36 ----------
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
// @component G11 canvasMath (from MHF4U 37 / 40 / 44) — canvas text with ^{…} superscripts and _{…} subscripts in the math
// font (single letters italic, words such as "log" upright); o.dry measures only; returns the width
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
function uiText(ctx, s, x, y, o){
  o = o || {};
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  ctx.font = (o.weight || 400) + " " + (o.size || 12) + "px " + (css("--font-ui") || "sans-serif");
  var w = ctx.measureText(s).width, al = o.align || "center", x0 = al === "center" ? x - w / 2 : al === "right" ? x - w : x;
  if (o.bg) { var ga = ctx.globalAlpha; ctx.globalAlpha = ga * 0.88; ctx.fillStyle = css("--sheet"); ctx.fillRect(x0 - 3, y - 8, w + 6, 16); ctx.globalAlpha = ga; }
  ctx.fillStyle = o.color || css("--ink-2"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(s, x0, y);
  ctx.restore(); return w;
}
function pill(ctx, cx, cy, txt, o){
  o = o || {};
  ctx.save(); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  ctx.font = "700 12px " + (css("--font-ui") || "sans-serif");
  var w = Math.max(24, ctx.measureText(txt).width + 14), h = 20, x = cx - w / 2, y = cy - h / 2;
  ctx.fillStyle = css("--sheet"); ctx.strokeStyle = o.stroke || css("--ink"); ctx.lineWidth = 1.6; ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, 10); else ctx.rect(x, y, w, h);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = css("--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, cx, cy + 0.5);
  ctx.restore(); return w;
}
function vline(ctx, X, y0, y1, col, w, dash, alpha){ ctx.save(); if (alpha != null) ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = w || 1.5; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, y1); ctx.stroke(); ctx.restore(); }
function evenTick(v){ return Math.abs(v % 2) < 1e-9 ? num(v) : ""; }
// points of y = s·log2(x − h) from just right of its asymptote to xmax
function logPts(s, h, xmax){ var out = [], k; for (k = 14; k >= 0; k--) out.push(h + Math.pow(2, -k)); for (k = 1; k <= 60; k++) out.push(h + 1 + (xmax - h - 1) * k / 60); return out.map(function(x){ return [x, s * lg2(x - h)]; }); }
function expPts(x0, x1){ var out = []; for (var k = 0; k <= 80; k++) { var x = x0 + (x1 - x0) * k / 80; out.push([x, Math.pow(2, x)]); } return out; }

// ---------- hero: every logarithm is an exponent (storyboard in the plan; reduced motion shows the final frame) ----------
var HV = { xmin:-3, xmax:10, ymin:-3, ymax:10 }, EP = [[0, 1], [1, 2], [3, 8]];
function hero(f){
  if (!f.canvas) return;
  var p = new MV.Plot(f.canvas, HV, { equal:true }), steps = ((MV.C.hero || {}).fig || {}).steps || [];
  var KEYS = ["yx", "ex", "sw", "lg", "asy", "tr", "rr", "rt"], END = { yx:1, ex:1, sw:1, lg:1, asy:1, tr:1, rr:4, rt:1 }, st = {};
  function set(o){ KEYS.forEach(function(k){ st[k] = o[k] || 0; }); }
  function cap(){
    f.cap.innerHTML = steps.map(function(s, i){ var wait = i >= st.k; return '<span class="hc-l' + (i === st.cur ? " cur" : "") + (wait ? " wait" : "") + '"' + (wait ? ' aria-hidden="true"' : "") + ">" + s.cap + "</span>"; }).join("");
  }
  p.render = function(){
    var done = st.k >= steps.length && st.rt >= 1;
    p.draw({ view:HV, equal:true, xTicks:{ step:1, fmt:evenTick }, yTicks:{ step:1, fmt:evenTick },
      describe:done ? MV.plain(MV.C.hero.fig.aria) : "Graph. " + steps.slice(0, st.k).map(function(s){ return MV.plain(s.cap); }).join(" "),
      after:function(ctx){
        var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3"), green = css("--green"), red = css("--red");
        var small = p.W < 400, fs = small ? 12 : 13;
        // asymptote x = 0 of log2 x, labelled with the domain
        if (st.asy > 0) {
          p.segment({ x1:0, y1:-3.5, x2:0, y2:10.5, color:ink2, width:1.5, dash:[8, 6], alpha:st.asy });
          var lx = p.X(0) - 17;
          cmath(ctx, "x = 0", lx, p.Y(7.1), { size:fs, align:"right", color:ink2, weight:400, alpha:st.asy, bg:true });
          uiText(ctx, "domain", lx, p.Y(5.35), { align:"right", color:ink, weight:700, alpha:st.asy, bg:true, size:fs - 1 });
          cmath(ctx, "x > 0", lx, p.Y(4.75), { size:fs, align:"right", alpha:st.asy, bg:true });
        }
        // the line y = x
        if (st.yx > 0) {
          var e = -3.2 + 13.4 * st.yx;
          p.segment({ x1:-3.2, y1:-3.2, x2:e, y2:e, color:ink2, width:1.5, dash:[2, 5] });
          if (st.yx >= 1) cmath(ctx, "y = x", p.X(9.2) - 6, p.Y(9.6), { size:fs, align:"right", color:ink2, weight:400, bg:true });
        }
        // y = 2^x and its points
        if (st.ex > 0) {
          var xe = -3.5 + 7 * st.ex;
          p.curve({ pts:expPts(-3.5, Math.min(xe, 3.45)), color:pen, width:3 });
          EP.forEach(function(q){ if (q[0] <= xe) p.point({ x:q[0], y:q[1], r:4.5, color:pen }); });
          if (st.ex >= 1) cmath(ctx, "y = 2^x", p.X(2.75) - 4, p.Y(7.7), { size:fs, align:"right", color:pen, bg:true });
        }
        // swap each point across y = x
        if (st.sw > 0) EP.forEach(function(q){
          var x = q[0] + (q[1] - q[0]) * st.sw, y = q[1] + (q[0] - q[1]) * st.sw;
          p.segment({ x1:q[0], y1:q[1], x2:x, y2:y, color:ink2, width:1.3, dash:[2, 4], alpha:0.8 });
          if (st.tr <= 0) p.point({ x:x, y:y, r:4.5, color:f3 });
        });
        // y = log2 x (then the parent of the transformed curve)
        if (st.lg > 0) {
          var L = logPts(1, 0, 10.6), n = Math.max(2, Math.round(L.length * st.lg));
          if (st.tr > 0) p.curve({ pts:L, color:ink2, width:2, dash:[6, 6], alpha:0.7 });
          else p.curve({ pts:L.slice(0, n), color:f3, width:2.8 });
          if (st.lg >= 1) cmath(ctx, "y = log_2 x", p.W - 4, p.Y(2.15), { size:fs, align:"right", color:st.tr > 0 ? ink2 : f3, bg:true });
        }
        if (st.asy >= 1) {
          if (st.tr > 0) EP.forEach(function(q){ p.point({ x:q[1], y:q[0], r:4, open:true, color:ink2 }); });
          cmath(ctx, "log_2 8 = 3", p.X(8) - 9, p.Y(3) - 14, { size:fs, align:"right", bg:true });
        }
        // the stretch and shift: y = (1 + t) log2(x − t), t from 0 to 1
        if (st.tr > 0) {
          var t = st.tr;
          p.segment({ x1:t, y1:-3.5, x2:t, y2:10.5, color:ink2, width:1.2, dash:[8, 6], alpha:0.55 * t });
          p.curve({ pts:logPts(1 + t, t, 10.6), color:f3, width:2.8 });
          EP.forEach(function(q){ p.point({ x:q[1] + t, y:(1 + t) * q[0], r:4.5, color:f3 }); });
          if (t >= 1) cmath(ctx, "y = 2 log_2(x - 1)", p.W - 4, p.Y(7.2), { size:fs, align:"right", color:f3, bg:true });
        }
        // a Richter ruler: each step of 1 is ×10
        if (st.rr > 0) {
          var x0 = 3.6, gap = 1.5, Y = p.Y(-1.75);
          ctx.save(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p.X(x0) - 4, Y); ctx.lineTo(p.X(x0 + gap * Math.min(st.rr, 4)) + 4, Y); ctx.stroke(); ctx.restore();
          for (var i = 0; i <= 4; i++) {
            if (st.rr < i - 1e-9) break;
            var X = p.X(x0 + gap * i);
            vline(ctx, X, Y - 6, Y + 6, ink, 1.6);
            uiText(ctx, String(i + 3), X, Y + 14, { color:ink, weight:700, size:fs - 1 });
            if (i < 4 && st.rr >= i + 1 - 1e-9) {
              var Xb = p.X(x0 + gap * (i + 1));
              ctx.save(); ctx.strokeStyle = pen; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X + 3, Y - 8); ctx.quadraticCurveTo((X + Xb) / 2, Y - 24, Xb - 3, Y - 8); ctx.stroke(); ctx.restore();
              uiText(ctx, "×10", (X + Xb) / 2, Y - 24, { color:pen, weight:700, size:small ? 10.5 : 11.5, bg:true });
            }
          }
        }
        // roots of log2 x + log2(x − 2) = 3: 4 passes the domain x > 0, −2 doesn't
        if (st.rt > 0) {
          var a = st.rt;
          pill(ctx, p.X(4), p.Y(0), "4", { alpha:a });
          uiText(ctx, "✓", p.X(4) + 17, p.Y(0) - 1, { align:"left", color:green, weight:700, size:16, alpha:a });
          pill(ctx, p.X(-2), p.Y(0), MINUS + "2", { alpha:a });
          uiText(ctx, "✗", p.X(-2) + 19, p.Y(0) - 1, { align:"left", color:red, weight:700, size:16, alpha:a });
        }
      } });
  };
  if (MV.reduceMotion) { set(END); st.k = steps.length; st.cur = -1; cap(); p.render(); return; }
  set({}); st.k = 0; st.cur = -1; cap(); p.render();
  function tw(dur, key, to, then){ var from = st[key]; MV.tween({ dur:dur, step:function(t){ st[key] = from + (to - from) * t; p.render(); }, done:function(){ st[key] = to; p.render(); if (then) then(); } }); }
  var PLAN = [
    function(next){ tw(500, "yx", 1, function(){ tw(1300, "ex", 1, next); }); },
    function(next){ tw(1100, "sw", 1, function(){ tw(1000, "lg", 1, next); }); },
    function(next){ tw(600, "asy", 1, next); },
    function(next){ tw(1500, "tr", 1, next); },
    function(next){ next(); },
    function(next){ tw(1800, "rr", 4, next); },
    function(next){ next(); },
    function(next){ tw(600, "rt", 1, next); }
  ];
  function step(i){
    st.k = i + 1; st.cur = i; cap(); p.render();
    (PLAN[i] || function(n){ n(); })(function(){
      MV.wait(i === 4 || i === 6 ? 1700 : 900, function(){ if (i + 1 < steps.length) step(i + 1); else MV.wait(1500, function(){ st.cur = -1; cap(); p.render(); }); });
    });
  }
  MV.wait(400, function(){ step(0); });
}

// ---------- Connect: exponential ↔ logarithm concept map ----------
// @component N18 connectionBuilder (adapted from MHF4U 24 / 30 for a concept map with follow-up chips) — three columns of
// tappable cards (exponent side | logarithm side | tools and uses); one challenge at a time with its stem card already
// chosen: tap the partner card and press Link in a sticky bar. Several partners can be accepted. A link can carry a
// follow-up chip question ("say how they're linked"). Correct links draw --hi SVG connectors that stay (curves between the
// columns; arcs in the left margin when the columns stack on phones). First-try tracking; named wrong-link feedback.
var CN = null;
function connect(host, api){
  var C = api.content, U = C.ui, CH = C.challenges, S = api.S, msg = {}, CARD = {}, COLS = ["exp", "log", "use"];
  COLS.forEach(function(col, ci){ C.cards[col].forEach(function(c){ CARD[c.id] = { col:col, ci:ci, c:c }; }); });
  S.cur = clamp(S.cur || 0, 0, CH.length - 1); S.ch = S.ch || {};
  function st(c){ return S.ch[c.id] || (S.ch[c.id] = { tries:0, linked:false, solved:false, first:null, other:null, pick:null }); }
  function solved(id){ var x = S.ch[id]; return !!(x && x.solved); }
  function acc(c){ return String(MV.ans(c)).split("|"); }
  function live(c){ return !st(c).linked; }
  function fresh(){ var c = CH[S.cur]; return live(c) ? { a:c.stem, b:null } : { a:null, b:null }; }
  if (!S.sel || (S.sel.a !== CH[S.cur].stem && S.sel.b !== CH[S.cur].stem)) S.sel = fresh();
  function short(id){ var o = CARD[id]; return o.c.name ? "<strong>" + o.c.name + "</strong>" : o.c.t; }
  function ph(t){ return '<span class="muted">[' + t + "]</span>"; }
  // the follow-up chips, in a fixed shuffled order (never the plan's order, where the accepted chip comes first)
  function askOrder(c){ var idx = c.ask.opts.map(function(_, i){ return i; }); return MV.shuffle ? MV.shuffle(idx, c.id) : idx.reverse(); }
  function cardBtn(id){
    var o = CARD[id], c = o.c;
    return '<button type="button" class="tm-card tm-' + o.col + '" data-card="' + id + '" data-k="tmc' + id + '" aria-pressed="false" aria-label="' + MV.esc(MV.plain((c.name ? c.name + ": " : "") + c.t)) + '">' +
      (c.name ? '<span class="tm-n">' + c.name + "</span>" : "") + '<span class="tm-t">' + c.t + "</span></button>";
  }
  host.innerHTML = '<div class="tm"><div class="cv-chal" id="tm-chal"></div><div class="tm-board" id="tm-board">' +
    COLS.map(function(col){ return '<div class="tm-col" data-col="' + col + '"><h3 class="tm-h">' + U[col] + '</h3><div class="tm-cards" role="group" aria-label="' + MV.esc(MV.plain(U[col])) + '">' + C.cards[col].map(function(c){ return cardBtn(c.id); }).join("") + "</div></div>"; }).join("") +
    '<svg class="tm-links" aria-hidden="true"></svg></div><div class="tm-bar" id="tm-bar"></div><div class="tm-one" id="tm-one"></div></div>';
  var root = $(".tm", host), board = $("#tm-board", root);

  // ---- links made so far ----
  function linkedCards(){ var o = {}; CH.forEach(function(c){ var x = S.ch[c.id]; if (x && x.linked) { o[x.other] = 1; o[c.stem] = 1; } }); return o; }
  function cardEl(id){ return board.querySelector('[data-card="' + id + '"]'); }
  function links(){
    var svg = $(".tm-links", board), base = board.getBoundingClientRect(); if (!base.width) return;
    var stacked = getComputedStyle(board).gridTemplateColumns.split(" ").length < 2, out = "";
    CH.forEach(function(c, ci){
      var x = S.ch[c.id]; if (!x || !x.linked) return;
      var A = cardEl(c.stem).getBoundingClientRect(), B = cardEl(x.other).getBoundingClientRect(), d, x1, y1, x2, y2;
      if (stacked) {
        x1 = A.left - base.left; y1 = A.top + A.height / 2 - base.top; x2 = B.left - base.left; y2 = B.top + B.height / 2 - base.top;
        var bu = clamp(12 + Math.abs(y2 - y1) * 0.035, 12, 28);
        d = "M" + x1 + " " + y1 + " C" + (x1 - bu) + " " + y1 + " " + (x2 - bu) + " " + y2 + " " + x2 + " " + y2;
      } else {
        var L = CARD[c.stem].ci < CARD[x.other].ci ? A : B, R = L === A ? B : A;
        x1 = L.right - base.left; y1 = L.top + L.height / 2 - base.top; x2 = R.left - base.left; y2 = R.top + R.height / 2 - base.top;
        var mx = (x1 + x2) / 2;
        d = "M" + x1 + " " + y1 + " C" + mx + " " + y1 + " " + mx + " " + y2 + " " + x2 + " " + y2;
      }
      out += '<path class="tm-ln' + (ci === S.cur ? " cur" : "") + (x.solved ? "" : " pend") + '" d="' + d + '"/><circle class="tm-end" cx="' + x1 + '" cy="' + y1 + '" r="3.5"/><circle class="tm-end" cx="' + x2 + '" cy="' + y2 + '" r="3.5"/>';
    });
    svg.innerHTML = out;
  }

  // ---- painting ----
  function paintBoard(){
    var c = CH[S.cur], lv = live(c), lk = linkedCards();
    $$(".tm-card", root).forEach(function(b){
      var id = b.dataset.card, on = lv && (S.sel.a === id || S.sel.b === id);
      b.classList.toggle("on", on); b.classList.toggle("linked", !!lk[id]); b.classList.toggle("stem", lv && id === c.stem);
      b.setAttribute("aria-pressed", String(on)); b.disabled = !lv;
    });
    root.classList.toggle("live", lv);
    links();
  }
  function paintBar(){
    var c = CH[S.cur], bar = $("#tm-bar", root);
    bar.hidden = !live(c); if (bar.hidden) return;
    var a = S.sel.a, b = S.sel.b;
    if (b === c.stem) { b = a; a = c.stem; }
    MV.keepFocus(bar, function(){
      bar.innerHTML = '<p class="tm-sent" aria-live="polite">' + (a ? short(a) : ph(U.card2)) + ' <span class="tm-arr" aria-label="links to">' + U.arrow + "</span> " + (b ? short(b) : ph(U.card2)) + "</p>" +
        '<div class="q-actions tm-acts"><button type="button" class="btn primary sm" data-tm="link" data-k="tmlink">' + U.link + '</button><button type="button" class="btn ghost sm" data-tm="clear" data-k="tmclear">' + U.clear + "</button></div>";
    });
  }
  function fbBox(M){ return M ? (M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>") : ""; }
  function paintChal(){
    var c = CH[S.cur], x = st(c), i = S.cur, box = $("#tm-chal", root), h, M = msg[c.id];
    h = '<div class="pred-top cv-top"><span class="tiny muted">Link ' + (i + 1) + " of " + CH.length + '</span><span class="cv-tags"><span class="tag">' + modsLabel(c.topics) + "</span>" + (c.stretch ? '<span class="tag">Stretch</span>' : "") + '</span><span class="dots" aria-hidden="true">' +
      CH.map(function(q, k){ return '<span class="dot' + (solved(q.id) ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="q-head"><div class="q-prompt">' + c.prompt + "</div></div>";
    if (!x.linked) h += '<p class="how">' + C.how + "</p>";
    var nf = x.first ? "" : ' <span class="muted">(not first try)</span>';
    var line = x.linked ? "<strong>" + U.linked + "</strong> " + short(c.stem) + " " + U.arrow + " " + short(x.other) + ". " + c.why[x.other] : "";
    if (x.solved) h += MV.fbHTML("good", line + (c.ask && x.pick != null ? " <strong>" + c.ask.opts[x.pick].t + "</strong> " + c.ask.opts[x.pick].why : "") + nf);
    else if (x.linked && c.ask) {
      h += MV.fbHTML("good", line);
      h += '<p class="tm-sq">' + c.ask.q + '</p><div class="tm-split" role="group" aria-label="' + MV.esc(MV.plain(c.ask.q)) + '">' +
        askOrder(c).map(function(k){ return '<button type="button" class="btn ghost tm-sp" data-ask="' + k + '" data-k="tma' + k + '">' + c.ask.opts[k].t + "</button>"; }).join("") + "</div>";
      h += fbBox(M);
    } else h += fbBox(M);
    h += '<div class="q-actions cv-nav"><button type="button" class="btn ghost sm" data-cv="prev" data-k="tmprev"' + (i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-cv="next" data-k="tmnext"' + (i === CH.length - 1 ? " disabled" : "") + ">Next link</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  var onePlot = null;
  function paintOne(){
    var el = $("#tm-one", root), n = CH.filter(function(c){ return solved(c.id); }).length, O = C.onePage;
    if (n < CH.length) { el.dataset.done = ""; onePlot = null; el.innerHTML = '<p class="tiny muted">' + n + " of " + CH.length + " links done. “" + MV.plain(O.title) + "” appears when all " + CH.length + " are done.</p>"; return; }
    if (el.dataset.done) return;
    el.dataset.done = "1";
    function tag(mods){ return '<span class="tag">' + (/ and /.test(mods) ? "Modules " : "Module ") + mods + "</span>"; }
    el.innerHTML = "<h3>" + O.title + '</h3><p class="muted">' + O.intro + "</p>" +
      '<div class="op-centre"><p class="op-eq">' + O.centre + '</p><div class="op-graph"><canvas class="plot square" id="op-plot" role="img" aria-label="' + MV.esc(MV.plain(O.aria)) + '"></canvas></div></div>' +
      '<div class="op-pairs" role="list"><div class="op-row op-head" aria-hidden="true"><span>' + O.expHead + "</span><span></span><span>" + O.logHead + "</span></div>" +
      O.pairs.map(function(q){ return '<div class="op-row" role="listitem"><span class="op-c">' + q.e + '</span><span class="op-link"><span aria-hidden="true">⟷</span> ' + q.link + '</span><span class="op-c">' + q.l + " " + tag(q.mods) + "</span></div>"; }).join("") + "</div>" +
      '<h4 class="op-th">' + O.toolsHead + '</h4><ul class="op-tools">' + O.tools.map(function(q){ return "<li>" + q.t + " " + tag(q.mods) + "</li>"; }).join("") + "</ul>";
    var V = { xmin:-3, xmax:6, ymin:-3, ymax:6 };
    onePlot = new MV.Plot($("#op-plot", el), V, { equal:true });
    onePlot.render = function(){
      onePlot.draw({ view:V, equal:true, xTicks:{ step:1, fmt:evenTick }, yTicks:{ step:1, fmt:evenTick }, describe:MV.plain(O.aria),
        after:function(ctx, p){
          var ink2 = css("--ink-2"), pen = css("--pen"), f3 = css("--f3");
          p.segment({ x1:-3.5, y1:-3.5, x2:6.5, y2:6.5, color:ink2, width:1.5, dash:[2, 5] });
          p.segment({ x1:-3.5, y1:0, x2:6.5, y2:0, color:ink2, width:1.5, dash:[8, 6] });
          p.segment({ x1:0, y1:-3.5, x2:0, y2:6.5, color:ink2, width:1.5, dash:[8, 6] });
          p.curve({ pts:expPts(-3.5, 2.7), color:pen, width:3 });
          p.curve({ pts:logPts(1, 0, 6.6), color:f3, width:2.8 });
          cmath(ctx, "y = 2^x", p.X(1.9) - 6, p.Y(4.9), { size:13, align:"right", color:pen, bg:true });
          cmath(ctx, "y = log_2 x", p.W - 4, p.Y(1.7), { size:13, align:"right", color:f3, bg:true });
          cmath(ctx, "y = x", p.X(5.4) - 6, p.Y(5.8), { size:13, align:"right", color:ink2, weight:400, bg:true });
          cmath(ctx, "y = 0", p.W - 4, p.Y(0) + 12, { size:12, align:"right", color:ink2, weight:400, bg:true });
          cmath(ctx, "x = 0", p.X(0) + 5, p.Y(-2.6), { size:12, color:ink2, weight:400, bg:true });
        } });
    };
    onePlot.render();
  }
  function paintAll(){ paintChal(); paintBar(); paintBoard(); paintOne(); }

  // ---- judging ----
  function bad(t){ return { bad:true, html:"<strong>✗ Not quite.</strong> " + t + " Try again." }; }
  function info(t){ return { bad:false, html:t }; }
  function link(c, x){
    var s = S.sel;
    if (!s.a || !s.b) { msg[c.id] = info(U.needAll); return; }
    if (s.a !== c.stem && s.b !== c.stem) { msg[c.id] = info(F(U.notStem, [short(c.stem)])); return; }
    var other = s.a === c.stem ? s.b : s.a;
    if (acc(c).indexOf(other) < 0) { x.tries++; msg[c.id] = bad(c.fb[other] || c.fb.def); return; }
    x.linked = true; x.other = other; S.sel = { a:null, b:null }; msg[c.id] = null;
    if (!c.ask) { x.solved = true; x.first = x.tries === 0; }
  }
  function after(scroll){ api.save(); paintAll(); var bx = $("#tm-chal", root); if (scroll) scrollTo(bx); MV.focusFb(bx); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CH[S.cur], x = st(c);
    if (b.dataset.cv) {
      S.cur = clamp(S.cur + (b.dataset.cv === "next" ? 1 : -1), 0, CH.length - 1); S.sel = fresh();
      api.save(); paintAll();
      var nb = host.querySelector('[data-cv="' + b.dataset.cv + '"]'); if (nb && !nb.disabled) nb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.card) {
      var id = b.dataset.card, s = S.sel;
      if (s.a === id) { s.a = s.b; s.b = null; } else if (s.b === id) s.b = null; else if (!s.a) s.a = id; else s.b = id;
      msg[c.id] = null; api.save(); paintBar(); paintBoard(); return;
    }
    if (b.dataset.tm === "clear") { S.sel = fresh(); msg[c.id] = null; api.save(); paintBar(); paintBoard(); return; }
    if (b.dataset.tm === "link") { link(c, x); after(true); return; }
    if (b.dataset.ask != null && c.ask && x.linked && !x.solved) {
      var k = +b.dataset.ask, o = c.ask.opts[k];
      if (MV.ok(o)) { x.solved = true; x.pick = k; x.first = x.tries === 0; msg[c.id] = null; }
      else { x.tries++; msg[c.id] = bad(o.why); }
      after(false);
    }
  });
  paintAll();
  CN = { repaint:function(){ links(); if (onePlot) onePlot.render(); } };
  if (window.ResizeObserver) new ResizeObserver(links).observe(board);

  // Register with the activity list so the summary and "skills to review" include Connect.
  MV.ACTS.connect = { a:{ id:"connect", title:C.summary },
    stats:function(){ var f = 0, d = 0; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:CH.length, done:d, line:C.summary + " (first try): " + f + "/" + CH.length + (d < CH.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.tries > 0) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  return {};
}

// ---------- Mixed practice: multiple choice (K5, retry) and number entry (N4, one or two boxes) ----------
var GENERAL = "Check your work, or use a hint.";
function mixed(host, api, a){
  var S = api.S; S.items = S.items || {};
  var items = a.items, msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function tags(it){ return '<span class="tags"><span class="tag">' + MV.topicLabel(it.topic) + "</span>" + (it.star ? '<span class="tag">★ Challenge</span>' : "") + "</span>"; }
  function head(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + tags(it) + "</div>"; }
  function box(it){ return host.querySelector('[data-mx="' + it.id + '"]'); }
  function feedback(it, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    var M = msgs[it.id]; if (!M) return "";
    return M.bad ? MV.fbHTML("bad", M.html) : '<div class="fb" role="status"><p>' + M.html + "</p></div>";
  }
  function actions(it, x){ return x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint); }
  function inp(it, x, j, label){
    var id = "mxn-" + it.id + (j == null ? "" : "-" + j), im = it.keypad === "decimal" ? "decimal" : "text", v = j == null ? x.val : (x.vals || [])[j];
    return '<span class="mx-pair"><label class="mx-lab" for="' + id + '">' + (label || it.label || "Your answer:") + '</label><span class="mx-cell"><input class="numin short" id="' + id + '" data-mxn="' + it.id + '"' + (j == null ? "" : ' data-j="' + j + '"') + ' type="text" inputmode="' + im + '" autocomplete="off" value="' + MV.esc(v || "") + '"' + (x.solved ? " disabled" : "") + ">" +
      (it.unit ? '<span class="mx-unit">' + it.unit + "</span>" : "") + "</span></span>";
  }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';

  function paint(it){
    var i = items.indexOf(it), x = ist(it.id), el = box(it);
    if (it.kind === "mc") {
      MV.keepFocus(el, function(){
        el.innerHTML = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:MV.topicLabel(it.topic) + (it.star ? '</span><span class="tag">★ Challenge' : "") }) +
          (x.solved && !x.first ? '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>' : "");
      });
    } else {
      var fields = it.kind === "two" ? it.boxes.map(function(bx, j){ return inp(it, x, j, bx.label); }).join("") : inp(it, x);
      MV.keepFocus(el, function(){ el.innerHTML = head(it, i) + '<div class="numrow mx-row">' + fields + "</div>" + actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>"; });
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
  function clean(raw){ return String(raw == null ? "" : raw).replace(/^\s*[a-z]\s*(\(\s*\w*\s*\))?\s*=\s*/i, "").replace(/\s*(hours?|h|dB|times)\s*\.?\s*$/i, "").trim(); }
  function one(raw){ var v = MV.parseNum(clean(raw)); return v && v.length === 1 ? v[0] : null; }
  function judge(it, x){
    var ans = MV.ans(it), w;
    if (it.kind === "two") {
      var vs = [0, 1].map(function(j){ return one((x.vals || [])[j]); });
      if (vs[0] == null || vs[1] == null) return { msg:{ bad:false, html:"Enter a number in each box, such as 3 or −2." } };
      if (close(vs[0], ans[0]) && close(vs[1], ans[1])) return { ok:true };
      for (var j = 0; j < 2; j++) {
        if (close(vs[j], ans[j])) continue;
        var bw = it.boxWrong[j], hit = (bw.match || []).some(function(q){ return close(vs[j], q); });
        return { msg:bad(hit ? bw.fb : bw.def) };
      }
    }
    var raw = String(x.val || "");
    if (it.logWrong && /log/i.test(raw)) return { msg:raw.indexOf(it.logWrong.has) >= 0 ? bad(it.logWrong.fb) : { bad:false, html:"Enter a number: simplify to a single log, then evaluate it." } };
    var v = one(raw);
    if (v == null) return { msg:{ bad:false, html:"Enter a number, such as 12, 0.5 or 3/4." } };
    if (close(v, ans)) return { ok:true };
    w = (it.wrong || []).filter(function(q){ return close(v, q.match); })[0];
    return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
  }
  host.addEventListener("input", function(e){
    var t = e.target, id = t.dataset && t.dataset.mxn; if (!id) return;
    var x = ist(id);
    if (t.dataset.j != null) { x.vals = x.vals || ["", ""]; x.vals[+t.dataset.j] = t.value; } else x.val = t.value;
    api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset || !e.target.dataset.mxn) return;
    var b = host.querySelector('[data-k="' + e.target.dataset.mxn + 'chk"]'); if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-mx]"); if (!el) return;
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

// ---------- performance task: a positive root that fails ----------
// @component gateLanes (adapted from MHF4U 44's domain gate) — argument lanes on one x-scale: a lane per log argument
// (solid --pen where it is positive, open circle at its zero), the gate lane (--hi-soft where every argument is positive)
// and an axis with the candidate roots as tokens marked ✓ (inside the gate) or ✗ (outside), joined to the lanes by guides.
var LIM = { p:[-6, 6], q:[-6, 6], r:[1, 5] }, TK = ["p", "q", "r"];
function linLab(p){ return p === 0 ? "x" : "x " + (p < 0 ? "- " : "+ ") + Math.abs(p); }
function logArg(p){ return p === 0 ? "log_2 x" : "log_2(" + linLab(p) + ")"; }
function eqSrc(p, q, r){ return logArg(p) + " + " + logArg(q) + " = " + r; }
function halfS(v){ if (Number.isInteger(v)) return String(v); var n = Math.round(v * 2); return n % 2 ? (n < 0 ? "-" : "") + Math.abs(n) + "/2" : String(n / 2); }
function valS(v){ var h = Math.round(v * 2) / 2; return Math.abs(h - v) < 1e-9 ? halfS(h) : null; }
function valTxt(v){ var s = valS(v); return s != null ? s.replace("-", MINUS) : "≈ " + num(v, 2); }
function valM(v){ var s = valS(v); return s != null ? m(s) : "≈ " + num(v, 2); }
function xEq(v){ var s = valS(v); return s != null ? m("x = " + s) : m("x") + " ≈ " + num(v, 2); }
function quadInfo(d){
  var B = d.p + d.q, C = d.p * d.q - Math.pow(2, d.r), D = B * B - 4 * C, sq = Math.sqrt(D), rt = Math.round(sq), perfect = rt * rt === D;
  var x1 = (-B - sq) / 2, x2 = (-B + sq) / 2;
  if (perfect) { x1 = (-B - rt) / 2; x2 = (-B + rt) / 2; }
  var roots = [x1, x2].map(function(x){ return { x:x, a:x + d.p, b:x + d.q, ok:x + d.p > 1e-9 && x + d.q > 1e-9 }; });
  return { B:B, C:C, D:D, roots:roots, ints:perfect && Math.abs(B + rt) % 2 === 0 && D > 0,
    sols:roots.filter(function(o){ return o.ok; }), rej:roots.filter(function(o){ return !o.ok; }) };
}
function polySrc(B, C){
  var s = "x^2";
  if (B) s += (B < 0 ? " - " : " + ") + (Math.abs(B) === 1 ? "" : Math.abs(B)) + "x";
  if (C) s += (C < 0 ? " - " : " + ") + Math.abs(C);
  return s + " = 0";
}
function prodSrc(p, q){ function f(k){ return k === 0 ? "x" : "(" + linLab(k) + ")"; } return f(p) + f(q); }
var task = (function(){
  var api, gp, T, U;
  function read(){
    var s = api ? api.S : {}, d = {};
    TK.forEach(function(k){ var r = MV.parseNum(s[k]); d[k] = r && r.length === 1 ? r[0] : NaN; });
    d.ok = TK.every(function(k){ return Number.isInteger(d[k]) && d[k] >= LIM[k][0] && d[k] <= LIM[k][1]; });
    return d;
  }
  function checks(d){
    if (!d.ok) return [false, false, false, false, false];
    var I = quadInfo(d), one = I.sols.length === 1;
    return [I.ints, one, one && I.sols[0].x > 1e-9, d.p < d.q, I.rej.length === 1 && I.rej[0].x > 1e-9];
  }
  function verdict(o, d){
    if (o.ok) return U.sol;
    var bad = o.a <= 1e-9 ? [d.p, o.a] : [d.q, o.b];
    return U.rej + ": " + m("log_2(" + (valS(bad[1]) != null ? valS(bad[1]) : num(bad[1], 2)) + ")") + " is undefined";
  }
  function drawGate(d, I){
    gp.render = function(){
      var W0 = gp.c.getBoundingClientRect().width;
      gp.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:describe(d, I), after:function(ctx){
        var W = gp.W, GUT = 82, ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen");
        var zs = [-d.p, -d.q, I.roots[0].x, I.roots[1].x], lo = Math.floor(Math.min.apply(null, zs)) - 1, hi = Math.ceil(Math.max.apply(null, zs)) + 1;
        if (hi - lo < 10) { var pad = (10 - (hi - lo)) / 2; lo = Math.floor(lo - pad); hi = Math.ceil(hi + pad); }
        function X(x){ return GUT + (x - lo) / (hi - lo) * (W - GUT - 14); }
        var rows = [{ z:-d.p, lab:linLab(d.p) + " > 0" }, { z:-d.q, lab:linLab(d.q) + " > 0" }], gate = Math.max(-d.p, -d.q), LH = 28, top = 18;
        rows.forEach(function(r, i){
          var cy = top + i * LH, xz = X(r.z);
          cmath(ctx, r.lab, GUT - 8, cy, { size:12.5, align:"right", weight:600 });
          ctx.save(); ctx.strokeStyle = ink2; ctx.lineWidth = 1.3; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(X(lo), cy); ctx.lineTo(xz, cy); ctx.stroke(); ctx.restore();
          ctx.fillStyle = pen; ctx.fillRect(xz, cy - 3, X(hi) - xz, 6);
          ctx.beginPath(); ctx.arc(xz, cy, 4.5, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = pen; ctx.stroke();
        });
        var gy = top + 2 * LH, gx = X(gate);
        uiText(ctx, "Gate", GUT - 8, gy, { align:"right", weight:700, color:ink, size:12 });
        ctx.fillStyle = css("--hi-soft"); ctx.fillRect(gx, gy - 9, X(hi) - gx, 18);
        ctx.strokeStyle = css("--hi"); ctx.lineWidth = 1.2; ctx.strokeRect(gx + 0.5, gy - 8.5, X(hi) - gx - 1, 17);
        // axis
        var ay = top + 3 * LH + 4, stp = hi - lo > 16 ? 2 : 1;
        ctx.save(); ctx.strokeStyle = css("--plot-axis"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(lo), ay); ctx.lineTo(X(hi), ay); ctx.stroke(); ctx.restore();
        for (var t = Math.ceil(lo / stp) * stp; t <= hi; t += stp) { vline(ctx, X(t), ay - 4, ay + 4, ink2, 1.2); uiText(ctx, num(t), X(t), ay + 13, { color:ink2, size:11 }); }
        uiText(ctx, "x", X(hi) + 7, ay, { color:ink2, size:12 });
        // candidates
        I.roots.forEach(function(o){
          var Xr = X(o.x);
          vline(ctx, Xr, top - 10, ay - 12, ink, 1.3, [2, 4]);
          rows.forEach(function(r, i){ var cy = top + i * LH, pos = (i === 0 ? o.a : o.b) > 1e-9; ctx.beginPath(); ctx.arc(Xr, cy, 3.5, 0, Math.PI * 2); ctx.fillStyle = pos ? ink : css("--red"); ctx.fill(); });
          pill(ctx, Xr, ay - 1, valTxt(o.x).replace("≈ ", ""), { stroke:o.ok ? css("--green") : css("--red") });
          uiText(ctx, o.ok ? "✓" : "✗", Xr, ay + 30, { color:o.ok ? css("--green") : css("--red"), weight:700, size:16, bg:true });
        });
        var gl = "x > " + num(gate), gw = cmath(ctx, gl, 0, 0, { dry:true, size:12.5 });
        if (X(hi) - gx > gw + 12) cmath(ctx, gl, gx + 6, gy, { size:12.5, weight:600, bg:true });
        void W0;
      } });
    };
    gp.render();
  }
  function describe(d, I){
    return "Domain gate. " + MV.plain(m(linLab(d.p))) + " is positive for x > " + num(-d.p) + "; " + MV.plain(m(linLab(d.q))) + " is positive for x > " + num(-d.q) + "; both are positive for x > " + num(Math.max(-d.p, -d.q)) + ". " +
      I.roots.map(function(o){ return "Root " + valTxt(o.x) + (o.ok ? ": a solution." : ": rejected."); }).join(" ");
  }
  function preview(){
    var d = read(), el = $("#pr-read"), eq = $("#pr-eq");
    if (!el) return;
    if (!d.ok) { eq.innerHTML = '<span class="muted">' + U.invalid + "</span>"; el.innerHTML = ""; gp.render = function(){ gp.draw({ view:{ xmin:0, xmax:1, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:"Domain gate: enter p, q and r to see it." }); }; gp.render(); return; }
    var I = quadInfo(d);
    eq.innerHTML = m(eqSrc(d.p, d.q, d.r));
    var rootsH = I.roots.map(function(o){ return xEq(o.x); }).join(" and ") + (I.ints ? "" : " (" + U.notInt + ")");
    el.innerHTML = MV.readoutHTML([[U.quad, m(prodSrc(d.p, d.q) + " = 2^" + d.r + " = " + Math.pow(2, d.r)) + ", so " + m(polySrc(I.B, I.C))], [U.roots, rootsH]]) +
      '<div class="tbl-wrap pr-tbl"><table class="vt"><caption class="vh">Each root’s arguments</caption><thead><tr><th scope="col">' + U.root + '</th><th scope="col">' + m(linLab(d.p)) + '</th><th scope="col">' + m(linLab(d.q)) + '</th><th scope="col">' + U.verdict + "</th></tr></thead><tbody>" +
      I.roots.map(function(o){ return "<tr><td>" + valM(o.x) + "</td><td>" + valM(o.a) + "</td><td>" + valM(o.b) + '</td><td class="' + (o.ok ? "pr-ok" : "pr-no") + '">' + verdict(o, d) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    drawGate(d, I);
  }
  function key(d){ return [d.p, d.q, d.r].join(","); }
  function unkey(k){ return String(k).split(",").map(Number); }
  function text(k){ var v = unkey(k); return "(p, q, r) = (" + v.map(function(n){ return num(n); }).join(", ") + ")"; }
  return {
    render:function(inp, pv, A){
      api = A; T = MV.C.task; U = T.ui; var S = A.S;
      if (S.p == null) S.p = "0"; if (S.q == null) S.q = "2"; if (S.r == null) S.r = "3";
      inp.innerHTML = '<p class="tiny muted pt-how">' + U.how + '</p><div class="inrow pr-row">' + TK.map(function(k){
        return '<label for="pr-' + k + '"><span class="pr-name">' + m(k) + '</span><span class="pr-box"><button type="button" class="btn ghost sm pr-pm" data-dk="' + k + '" data-d="-1" aria-label="Decrease ' + k + '">' + MINUS + '</button><input id="pr-' + k + '" data-pr="' + k + '" type="number" step="1" min="' + LIM[k][0] + '" max="' + LIM[k][1] + '" value="' + MV.esc(S[k]) + '"><button type="button" class="btn ghost sm pr-pm" data-dk="' + k + '" data-d="1" aria-label="Increase ' + k + '">+</button></span></label>';
      }).join("") + "</div>";
      pv.innerHTML = '<h4 class="pr-h">' + U.eq + '</h4><p class="eq-cap pr-eq" id="pr-eq" aria-live="polite"></p><dl class="read pr-read" id="pr-read" aria-live="polite"></dl>' +
        '<h4 class="pr-h">' + U.gate + '</h4><div class="pr-gwrap"><canvas class="pr-gate" id="pr-gate" role="img" aria-label="Domain gate"></canvas></div>';
      gp = new MV.Plot($("#pr-gate"), { xmin:0, xmax:1, ymin:0, ymax:1 });
      function upd(){ A.save(); preview(); A.update(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.pr; if (!k) return; S[k] = e.target.value; upd(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-dk]"); if (!b) return;
        var k = b.dataset.dk, r = MV.parseNum(S[k]), v = r && r.length === 1 ? Math.round(r[0]) : LIM[k][0];
        v = clamp(v + (+b.dataset.d), LIM[k][0], LIM[k][1]); S[k] = String(v); $("#pr-" + k).value = v; upd();
      });
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"), ts = MV.taskState();
        if (g && ts.found.length >= 8 && !g.querySelector(".pr-all")) g.insertAdjacentHTML("beforeend", '<p class="pr-all">' + T.all8 + "</p>");
      }, 0); });
      preview();
    },
    read:read,
    valid:function(d){ return d.ok ? true : U.invalid; },
    checks:checks,
    tips:function(d, res){
      var out = [], now = T.tipNow, I = quadInfo(d);
      function rootsH(){ return I.roots.map(function(o){ return xEq(o.x); }).join(" and "); }
      if (!res[0]) out.push(fill(now[0], { roots:rootsH() + ": not both integers" }));
      if (!res[1]) out.push(fill(now[1], { sol:I.sols.length ? U.two : U.none }) + " " + T.tips[1]);
      if (!res[2] && I.sols.length === 1) out.push(fill(now[2], { s:xEq(I.sols[0].x) }));
      if (!res[3]) out.push(fill(now[3], { p:num(d.p), q:num(d.q) }));
      if (!res[4] && I.rej.length === 1) out.push(fill(now[4], { x:xEq(I.rej[0].x) }) + " " + T.tips[4]);
      return out;
    },
    key:key,
    label:function(k){ var v = unkey(k); return m(eqSrc(v[0], v[1], v[2])); },
    text:text,
    summary:function(ts){ var T = MV.C.task; return [(T.summary || T.title) + ": " + (ts.found.length ? "solved (" + ts.found.map(text).join("; ") + ")" : "not solved yet")]; }
  };
})();

MV.module({
  hero:hero,
  connect:connect,
  activities:{ mx:mixed },
  task:task,
  onShow:function(v){ if (v === "connect" && CN) CN.repaint(); }
});
})();
