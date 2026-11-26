// MHF4U 24 Chapter 3 Summary & Review: hero (each part of the factored equation points to its feature), per-topic tables
// (diagnostic, mixed practice, Final Check), Connect "Rational function anatomy" (N18 connection builder + the chapter on
// one page), the mixed-practice set (choice, number, pair, solutions and interval entry) and the "Build a rational function
// to spec" task (N26 factor tiles, live graph and sign chart).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, iv = MV.iv, m = MV.m, MINUS = MV.MINUS;
var TOPICS = ["17", "18", "19", "20", "21", "22", "23"];
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function F(s, a){ return String(s == null ? "" : s).replace(/§(\d)/g, function(mm, k){ var v = a[+k - 1]; return v == null ? mm : v; }); }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function modsLabel(ts){ return ts.length > 1 ? "Modules " + ts.slice(0, -1).join(", ") + " and " + ts[ts.length - 1] : "Module " + ts[0]; }
function mi(s){ return m(s).replace(/^<span class="m">/, "").replace(/<\/span>$/, ""); }
function scrollTo(el){ if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); }

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check), as in MHF4U 10 and 16 ----------
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
function rrect(ctx, x, y, w, h, r){ ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
// a tag box at data point (x, y), aligned left / right / center; `on` = highlighted (current step)
function tagBox(ctx, p, x, y, al, text, on){
  ctx.save(); ctx.font = "600 14px " + p.fontM;
  var w = ctx.measureText(text).width + 14, h = 24, X = p.X(x), Y = p.Y(y);
  var x0 = clamp(al === "left" ? X : al === "right" ? X - w : X - w / 2, 2, p.W - w - 2), y0 = clamp(Y - h / 2, 2, p.H - h - 2);
  rrect(ctx, x0, y0, w, h, 6); ctx.fillStyle = css(on ? "--hi" : "--sheet"); ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = css(on ? "--ink" : "--ink-2"); ctx.stroke();
  ctx.fillStyle = css(on ? "--hi-ink" : "--ink"); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, x0 + w / 2, y0 + h / 2 + 1);
  ctx.restore();
  return { x0:x0, y0:y0, w:w, h:h };
}
// leader line from the edge of a box to (X, Y) in pixels, stopping `gap` px short
function leader(ctx, b, X, Y, gap){
  var cx = b.x0 + b.w / 2, cy = b.y0 + b.h / 2, dx = X - cx, dy = Y - cy, L = Math.sqrt(dx * dx + dy * dy); if (L < 1) return;
  var t = Math.min(dx ? (b.w / 2) / Math.abs(dx) : 99, dy ? (b.h / 2) / Math.abs(dy) : 99), sx = cx + dx * t, sy = cy + dy * t, ex = X - dx / L * gap, ey = Y - dy / L * gap;
  ctx.save(); ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.fillStyle = css("--ink"); ctx.beginPath(); ctx.arc(ex, ey, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function hiRing(ctx, p, x, y, r){ ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r || 11, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
function hiLine(ctx, p, x1, y1, x2, y2){ ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.moveTo(p.X(x1), p.Y(y1)); ctx.lineTo(p.X(x2), p.Y(y2)); ctx.stroke(); ctx.restore(); }
function ptLabel(p, x, y, text, dx, dy, al){ p.label({ x:x, y:y, text:text, dx:dx, dy:dy, align:al, bg:true, font:"600 13px " + p.fontM }); }
// "x = a" written just left of the top of a vertical asymptote (the engine's label sits right of it, under the curve here)
function vaLabel(p, a){ p.label({ x:a, y:p.v.ymax, text:"x = " + num(a), dx:-6, dy:12, align:"right", color:css("--ink-2"), font:"italic 13px " + p.fontM }); }
function fS(x){ return 2 * (x - 1) / (x - 3); }        // f simplified: 2(x − 1)/(x − 3), x ≠ −2
function gF(x){ return (x * x - 4) / (x - 1); }

// ---------- hero: f draws with its asymptotes; then each part of the factored equation glows and a leader points to its feature ----------
var HV = { xmin:-5, xmax:8, ymin:-5, ymax:8 };
var HS = [
  { fx:-2, fy:1.2, tx:-4.7, ty:4.9, al:"left", pt:true, lab:"(−2, 6/5)", dx:0, dy:18, la:"center" },
  { fx:3, fy:4.6, tx:2.5, ty:5.9, al:"right", line:[3, HV.ymin, 3, HV.ymax] },
  { fx:6.8, fy:2, tx:7.8, ty:0.4, al:"right", line:[HV.xmin, 2, HV.xmax, 2] },
  { fx:1, fy:0, tx:0.3, ty:-3.8, al:"center", pt:true, lab:"(1, 0)", dx:-8, dy:14, la:"right" },
  { fx:0, fy:2 / 3, tx:-3.1, ty:-2.1, al:"center", pt:true, lab:"(0, 2/3)", dx:8, dy:-14, la:"left" }
];
function hero(f){
  var p = new MV.Plot(f.canvas, HV), steps = (MV.C.hero.fig || {}).steps || [], st = { t:0, k:0, cur:-1 };
  var parts = $$(".hero-eq .hx");
  function glow(){ var h = st.cur >= 0 ? steps[st.cur].h : ""; parts.forEach(function(el){ el.classList.toggle("on", el.dataset.h === h); }); }
  p.render = function(){
    var pen = css("--pen"), k = st.k, cur = st.cur;
    p.draw({ view:HV, xTicks:{ step:1 }, yTicks:{ step:1 }, asymptotes:[{ x:3, label:"" }, { y:2, label:"y = 2" }],
      curves:[{ f:fS, color:pen, width:3.2, arrows:st.t >= 1, domain:[HV.xmin - 0.2, HV.xmin - 0.2 + (HV.xmax - HV.xmin + 0.4) * st.t] }],
      points:st.t >= 0.25 ? [{ x:-2, y:1.2, open:true, r:5.5 }] : [],
      describe:"Graph of f(x) = 2(x − 1)(x + 2)/((x − 3)(x + 2)) with dashed asymptotes x = 3 and y = 2 and a hole at (−2, 6/5)." + (k ? " " + steps.slice(0, k).map(function(s){ return MV.plain(s.cap); }).join(". ") + "." : ""),
      after:function(ctx, pl){
        vaLabel(pl, 3);
        for (var i = 0; i < k; i++) {
          var s = HS[i];
          if (i === cur) { if (s.line) hiLine(ctx, pl, s.line[0], s.line[1], s.line[2], s.line[3]); else hiRing(ctx, pl, s.fx, s.fy); }
          if (s.pt) ptLabel(pl, s.fx, s.fy, s.lab, s.dx, s.dy, s.la);
          var b = tagBox(ctx, pl, s.tx, s.ty, s.al, MV.plain(steps[i].tag), i === cur);
          leader(ctx, b, pl.X(s.fx), pl.Y(s.fy), s.pt ? 8 : 2);
        }
      } });
    f.cap.innerHTML = k ? steps.slice(0, k).map(function(s, i){ return '<span class="hc-l' + (i === cur ? " cur" : "") + '">' + s.cap + "</span>"; }).join("") : m("f(x) = {2(x - 1)(x + 2)}/{(x - 3)(x + 2)}");
  };
  if (MV.reduceMotion) { st.t = 1; st.k = steps.length; p.render(); return; }
  p.render();
  function next(){
    if (st.k >= steps.length) { MV.wait(1600, function(){ st.cur = -1; glow(); p.render(); }); return; }
    MV.wait(1100, function(){ st.k++; st.cur = st.k - 1; glow(); p.render(); next(); });
  }
  MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ st.t = t; p.render(); }, done:function(){ st.t = 1; p.render(); next(); } });
}

// ---------- Connect: rational function anatomy ----------
// @component N18 connectionBuilder — link board: tappable equation parts (grouped by data-part) beside or above a graph whose
// features are buttons placed over the canvas; tap a part, tap a feature, press Link (sticky bar); a correct link draws a --hi
// SVG connector that stays. One challenge card at a time (link or multiple choice), first-try tracking, named wrong-link feedback
// (exact pair, then part:<id>, then partDefault / featDefault). Reused by MHF4U 30 and 45.
var BV = { f:{ xmin:-4.5, xmax:7.5, ymin:-4, ymax:8 }, g:{ xmin:-5.5, xmax:7, ymin:-5, ymax:7.5 } };
var FT = {
  fva:{ fn:"f", pill:"x = 3", at:[3, 4.6] }, fha:{ fn:"f", pill:"y = 2", at:[6.2, 2] },
  fhole:{ fn:"f", pts:[[-2, 1.2]] }, fx:{ fn:"f", pts:[[1, 0]], lab:["(1, 0)"], ld:[[-8, 14, "right"]] },
  fy:{ fn:"f", pts:[[0, 2 / 3]], lab:["(0, 2/3)"], ld:[[8, -14, "left"]] },
  gva:{ fn:"g", pill:"x = 1", at:[1, 3.4] }, goa:{ fn:"g", pill:"y = x + 1", at:[3.3, 4.3] },
  gx:{ fn:"g", pts:[[-2, 0], [2, 0]], lab:["(−2, 0)", "(2, 0)"], ld:[[-8, -14, "right"], [8, 14, "left"]] },
  gy:{ fn:"g", pts:[[0, 4]], lab:["(0, 4)"], ld:[[-8, -12, "right"]] }
};
var PART_FN = { lead:"f", const:"f", n1:"f", c2:"f", d3:"f", gnum:"g", gden:"g", gdiv:"g" };
var CN = null;
function connect(host, api){
  var C = api.content, U = C.ui, CH = C.challenges, S = api.S, msg = {}, plots = {};
  S.cur = clamp(S.cur || 0, 0, CH.length - 1); S.ch = S.ch || {}; S.sel = S.sel || { part:null, feat:null };
  function st(c){ return S.ch[c.id] || (S.ch[c.id] = { tries:0, solved:false, first:null }); }
  function solved(id){ var x = S.ch[id]; return !!(x && x.solved); }
  function pair(c){ var a = String(MV.ans(c)).split("|"); return { part:a[0], feat:a[1] }; }
  function P(id, html, k){ return '<button type="button" class="an-part" data-part="' + id + '" data-k="anp' + id + k + '" aria-label="' + MV.esc(MV.plain(C.parts[id])) + '">' + html + "</button>"; }
  var fx = '<span class="m"><i>f</i>(<i>x</i>) = </span>', gx = '<span class="m"><i>g</i>(<i>x</i>) = </span>';
  var fExp = fx + '<span class="m"><span class="frac"><span class="fn">' + P("lead", mi("2x^2"), 0) + " " + mi("+ 2x") + " " + P("const", mi("- 4"), 0) + '</span><span class="fd">' + P("lead", mi("x^2"), 1) + " " + mi("- x") + " " + P("const", mi("- 6"), 1) + "</span></span></span>";
  var fFac = fx + '<span class="m"><span class="frac"><span class="fn">2' + P("n1", mi("(x - 1)"), 0) + P("c2", mi("(x + 2)"), 0) + '</span><span class="fd">' + P("d3", mi("(x - 3)"), 0) + P("c2", mi("(x + 2)"), 1) + "</span></span></span>";
  var gEq = gx + '<span class="m"><span class="frac"><span class="fn">' + P("gnum", mi("x^2 - 4"), 0) + '</span><span class="fd">' + P("gden", mi("x - 1"), 0) + "</span></span> = " +
    '<span class="frac"><span class="fn">' + P("gnum", mi("(x - 2)(x + 2)"), 1) + '</span><span class="fd">' + P("gden", mi("x - 1"), 1) + "</span></span></span>";
  var gDiv = P("gdiv", '<span class="an-dl">' + U.divide + ":</span> " + mi("(x^2 - 4) ÷ (x - 1)"), 0);
  function row(fn, eqHTML){
    var pts = Object.keys(FT).filter(function(id){ return FT[id].fn === fn; }).map(function(id){
      var o = FT[id];
      if (o.pill) return '<button type="button" class="an-ft pill" data-ft="' + id + '" data-k="anf' + id + '0" aria-label="' + MV.esc(MV.plain(C.feats[id])) + '">' + m(o.pill) + "</button>";
      return o.pts.map(function(_, j){ return '<button type="button" class="an-ft pt" data-ft="' + id + '" data-j="' + j + '" data-k="anf' + id + j + '" aria-label="' + MV.esc(MV.plain(C.feats[id])) + '"></button>'; }).join("");
    }).join("");
    return '<div class="an-row" data-fn="' + fn + '"><div class="an-eq">' + eqHTML + '</div><div class="an-gr"><p class="an-gt">' + U[fn + "Graph"] + '</p><div class="plot-wrap an-pw"><canvas class="plot" role="img"></canvas>' + pts + '</div></div><svg class="an-links" aria-hidden="true"></svg></div>';
  }
  host.innerHTML = '<div class="an"><div class="cv-chal" id="an-chal"></div>' +
    row("f", '<p class="tiny muted an-form">' + U.expanded + '</p><p class="an-eqline">' + fExp + '</p><p class="tiny muted an-form">' + U.factored + '</p><p class="an-eqline">' + fFac + "</p>") +
    row("g", '<p class="an-eqline">' + gEq + '</p><p class="an-eqline an-divl">' + gDiv + "</p>") +
    '<div class="an-bar" id="an-bar"></div><div class="an-one" id="an-one"></div></div>';
  var root = $(".an", host);

  // ---- graphs ----
  function linkedFeats(){ var o = {}; CH.forEach(function(c){ if (c.type === "link" && solved(c.id)) o[pair(c).feat] = 1; }); return o; }
  function drawGraph(fn){
    var pl = plots[fn], v = BV[fn], ink = css("--ink"), pen = css("--pen"), lk = linkedFeats(), sel = S.sel.feat, pts = [], hole = solved("AN2");
    var sc = { view:v, xTicks:{ step:1 }, yTicks:{ step:1 }, points:pts };
    if (fn === "f") {
      sc.asymptotes = [{ x:3, label:"" }, { y:2, label:"" }];
      sc.curves = [{ f:fS, color:pen, width:3, arrows:true }];
      pts.push({ x:-2, y:1.2, open:true, r:5.5 }, { x:1, y:0, r:4.5, color:ink }, { x:0, y:2 / 3, r:4.5, color:ink });
      sc.describe = "Graph of f: dashed vertical line x = 3, dashed horizontal line y = 2, an open circle at x = −2" + (hole ? " (the hole (−2, 6/5))" : "") + ", and the points (1, 0) and (0, 2/3).";
    } else {
      sc.asymptotes = [{ x:1, label:"" }, { m:1, b:1, label:"" }];
      sc.curves = [{ f:gF, color:pen, width:3, arrows:true }];
      pts.push({ x:-2, y:0, r:4.5, color:ink }, { x:2, y:0, r:4.5, color:ink }, { x:0, y:4, r:4.5, color:ink });
      sc.describe = "Graph of g: dashed vertical line x = 1, slanted dashed line y = x + 1, and the points (−2, 0), (2, 0) and (0, 4).";
    }
    sc.after = function(ctx, p){
      Object.keys(FT).forEach(function(id){
        var o = FT[id]; if (o.fn !== fn || !o.pts) return;
        o.pts.forEach(function(q, j){
          if (lk[id] || sel === id) hiRing(ctx, p, q[0], q[1], sel === id ? 13 : 10);
          if (id === "fhole") ptLabel(p, q[0], q[1], hole ? "(−2, 6/5)" : MV.plain(U.holeQ), 0, 18, "center");
          else ptLabel(p, q[0], q[1], o.lab[j], o.ld[j][0], o.ld[j][1], o.ld[j][2]);
        });
      });
    };
    pl.draw(sc);
  }
  ["f", "g"].forEach(function(fn){
    var r = $('.an-row[data-fn="' + fn + '"]', root), pl = new MV.Plot($("canvas", r), BV[fn]);
    plots[fn] = pl; pl.render = function(){ drawGraph(fn); };
    pl.onDrawn(function(p){
      var cv = p.c;
      $$(".an-ft", r).forEach(function(b){
        var o = FT[b.dataset.ft], q = o.pill ? o.at : o.pts[+(b.dataset.j || 0)];
        b.style.left = (cv.offsetLeft + p.X(q[0])) + "px"; b.style.top = (cv.offsetTop + p.Y(q[1])) + "px";
      });
      links(fn);
    });
  });

  // ---- connectors (SVG over each row) ----
  function center(el, base, side){ var r = el.getBoundingClientRect(); return side ? [r.right - base.left, r.top + r.height / 2 - base.top] : [r.left + r.width / 2 - base.left, r.bottom - base.top]; }
  function links(fn){
    var r = $('.an-row[data-fn="' + fn + '"]', root), svg = $(".an-links", r), base = r.getBoundingClientRect(); if (!base.width) return;
    var side = getComputedStyle(r).gridTemplateColumns.split(" ").length > 1, out = "";
    CH.forEach(function(c, ci){
      if (c.type !== "link" || !solved(c.id)) return;
      var pr = pair(c); if (PART_FN[pr.part] !== fn) return;
      var ps = $$('.an-part[data-part="' + pr.part + '"]', r), fs = $$('.an-ft[data-ft="' + pr.feat + '"]', r), n = Math.max(ps.length, fs.length);
      for (var i = 0; i < n; i++) {
        var a = center(ps[i % ps.length], base, side), fr = fs[i % fs.length].getBoundingClientRect(), b = [fr.left + fr.width / 2 - base.left, fr.top + fr.height / 2 - base.top];
        out += '<line class="an-ln' + (ci === S.cur ? " cur" : "") + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/><circle class="an-end" cx="' + a[0] + '" cy="' + a[1] + '" r="4"/>';
      }
    });
    svg.innerHTML = out;
  }

  // ---- equation parts and feature buttons: selected / linked state ----
  function paintBoard(){
    var c = CH[S.cur], live = c.type === "link" && !solved(c.id), lkP = {}, lkF = linkedFeats();
    CH.forEach(function(q){ if (q.type === "link" && solved(q.id)) lkP[pair(q).part] = 1; });
    $$(".an-part", root).forEach(function(b){ var id = b.dataset.part; b.classList.toggle("on", S.sel.part === id); b.classList.toggle("linked", !!lkP[id]); b.setAttribute("aria-pressed", String(S.sel.part === id)); b.disabled = !live; });
    $$(".an-ft", root).forEach(function(b){ var id = b.dataset.ft; b.classList.toggle("on", S.sel.feat === id); b.classList.toggle("linked", !!lkF[id]); b.setAttribute("aria-pressed", String(S.sel.feat === id)); b.disabled = !live; });
    root.classList.toggle("live", live);
    plots.f.render(); plots.g.render();
  }
  function paintBar(){
    var c = CH[S.cur], bar = $("#an-bar", root), live = c.type === "link" && !solved(c.id);
    bar.hidden = !live; if (!live) return;
    MV.keepFocus(bar, function(){
      bar.innerHTML = '<p class="an-sel" aria-live="polite"><span><strong>' + U.part + ":</strong> " + (S.sel.part ? C.parts[S.sel.part] : '<span class="muted">' + U.none + "</span>") + "</span>" +
        "<span><strong>" + U.feat + ":</strong> " + (S.sel.feat ? C.feats[S.sel.feat] : '<span class="muted">' + U.none + "</span>") + "</span></p>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-an="link" data-k="anlink">' + U.link + '</button><button type="button" class="btn ghost sm" data-an="clear" data-k="anclear">' + U.clear + "</button></div>";
    });
  }
  function paintChal(){
    var c = CH[S.cur], x = st(c), i = S.cur, box = $("#an-chal", root), h;
    h = '<div class="pred-top cv-top"><span class="tiny muted">Challenge ' + (i + 1) + " of " + CH.length + '</span><span class="cv-tags"><span class="tag">' + modsLabel(c.topics) + "</span>" + (c.stretch ? '<span class="tag">Stretch</span>' : "") + '</span><span class="dots" aria-hidden="true">' +
      CH.map(function(q, k){ return '<span class="dot' + (solved(q.id) ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    if (c.type === "choose") {
      h += MV.mcHTML({ id:c.id, prompt:c.prompt, options:c.options }, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true });
      if (x.solved && !x.first) h += '<p class="tiny muted" style="margin:6px 0 0">(not first try)</p>';
    } else {
      h += '<div class="q-head"><div class="q-prompt">' + c.prompt + "</div></div>";
      if (!x.solved) h += '<p class="how">' + C.how + "</p>";
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ Linked:</strong> " + C.parts[pair(c).part] + " ⟷ " + C.feats[pair(c).feat] + ". " + c.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (msg[c.id]) h += MV.fbHTML("bad", msg[c.id]);
    }
    h += '<div class="q-actions cv-nav"><button type="button" class="btn ghost sm" data-cv="prev" data-k="anprev"' + (i === 0 ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-cv="next" data-k="annext"' + (i === CH.length - 1 ? " disabled" : "") + ">Next challenge</button></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paintOne(){
    var el = $("#an-one", root), n = CH.filter(function(c){ return solved(c.id); }).length, O = C.onePage;
    if (n < CH.length) { el.dataset.done = ""; el.innerHTML = '<p class="tiny muted">' + n + " of " + CH.length + " links done. “" + MV.plain(O.title) + "” appears when all " + CH.length + " are done.</p>"; return; }
    if (el.dataset.done) return;
    el.dataset.done = "1";
    el.innerHTML = '<h3>' + O.title + '</h3><p class="muted">' + O.intro + '</p><div class="an-onegrid"><div><canvas class="plot" id="an-anat" role="img" aria-label="' + MV.esc(MV.plain(O.aria)) + '"></canvas></div>' +
      '<ol class="an-flist">' + O.feats.map(function(q, i){ return '<li><span class="an-bd" aria-hidden="true">' + (i + 1) + "</span><span>" + q.t + ' <span class="tag">' + (/,| and /.test(q.mods) ? "Modules " : "Module ") + q.mods + "</span></span></li>"; }).join("") + "</ol></div>";
    var ap = new MV.Plot($("#an-anat", el), AV); ap.render = function(){ drawAnatomy(ap); }; ap.render();
  }
  function paintAll(){ paintChal(); paintBar(); paintBoard(); paintOne(); }

  // ---- judging ----
  function judge(c){
    var want = pair(c), s = S.sel, fb = c.fb || {};
    if (s.part === want.part && s.feat === want.feat) return { ok:true };
    if (PART_FN[s.part] !== FT[s.feat].fn) return { msg:U.otherGraph };
    if (fb[s.part + "|" + s.feat]) return { msg:fb[s.part + "|" + s.feat] };
    if (s.part === want.part) return { msg:fb["feat:" + s.feat] || fb.featDefault };
    return { msg:fb["part:" + s.part] || fb.partDefault };
  }
  function after(scroll){ api.save(); paintAll(); var box = $("#an-chal", root); if (scroll) scrollTo(box); MV.focusFb(box); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var c = CH[S.cur], x = st(c);
    if (b.dataset.cv) {
      S.cur = clamp(S.cur + (b.dataset.cv === "next" ? 1 : -1), 0, CH.length - 1); S.sel = { part:null, feat:null };
      api.save(); paintAll();
      var nb = host.querySelector('[data-cv="' + b.dataset.cv + '"]'); if (nb && !nb.disabled) nb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.part) { S.sel.part = S.sel.part === b.dataset.part ? null : b.dataset.part; msg[c.id] = null; api.save(); paintBar(); paintBoard(); return; }
    if (b.dataset.ft) { S.sel.feat = S.sel.feat === b.dataset.ft ? null : b.dataset.ft; msg[c.id] = null; api.save(); paintBar(); paintBoard(); return; }
    if (b.dataset.an === "clear") { S.sel = { part:null, feat:null }; api.save(); paintBar(); paintBoard(); return; }
    if (b.dataset.an === "link") {
      if (!S.sel.part || !S.sel.feat) { msg[c.id] = U.needBoth; after(true); return; }
      var r = judge(c);
      if (r.ok) { x.solved = true; x.first = x.tries === 0; msg[c.id] = null; S.sel = { part:null, feat:null }; }
      else { x.tries++; msg[c.id] = "<strong>✗ Not quite.</strong> " + r.msg + " Try again."; }
      after(true); return;
    }
    if (c.type === "choose") {
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paintChal(); return; }
      if (b.dataset.act === "check" && x.choice != null) {
        x.checked = true;
        if (MV.ok(c.options[x.choice])) { x.solved = true; x.first = x.tries === 0; } else x.tries++;
        after(false);
      }
    }
  });
  paintAll();
  CN = { repaint:function(){ plots.f.render(); plots.g.render(); } };
  if (window.ResizeObserver) $$(".an-row", root).forEach(function(r){ new ResizeObserver(function(){ links(r.dataset.fn); }).observe(r); });

  // Register with the activity list so the summary and "skills to review" include Connect.
  MV.ACTS.connect = { a:{ id:"connect", title:C.summary },
    stats:function(){ var f = 0, d = 0; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.solved) d++; if (y && y.first) f++; }); return { first:f, total:CH.length, done:d, line:C.summary + " (first try): " + f + "/" + CH.length + (d < CH.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; CH.forEach(function(c){ var y = S.ch[c.id]; if (y && y.tries > 0) g = g.concat(MV.goalIdx(c.goal)); }); return g; } };
  return {};
}
// "The chapter on one page": f with every feature marked by a numbered badge (the list beside it names the module).
var AV = { xmin:-5, xmax:8, ymin:-4.5, ymax:8 };
function drawAnatomy(p){
  var pen = css("--pen"), ink = css("--ink");
  function badge(ctx, x, y, n, fx, fy){
    var X = p.X(x), Y = p.Y(y);
    if (fx != null) { ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(p.X(fx), p.Y(fy)); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.beginPath(); ctx.arc(X, Y, 11, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke();
    ctx.fillStyle = ink; ctx.font = "700 13px " + p.fontUI; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(n), X, Y + 1); ctx.restore();
  }
  p.draw({ view:AV, xTicks:{ step:1 }, yTicks:{ step:1 }, asymptotes:[{ x:3, label:"" }, { y:2, label:"y = 2" }],
    regions:[{ f:fS, x0:1, x1:2.999, where:"below" }],
    curves:[{ f:fS, color:pen, width:3.2, arrows:true }],
    points:[{ x:-2, y:1.2, open:true, r:5.5 }, { x:1, y:0, r:4.5, color:ink }, { x:0, y:2 / 3, r:4.5, color:ink }],
    describe:MV.plain(MV.C.connect.onePage.aria),
    after:function(ctx, pl){
      vaLabel(pl, 3);
      ptLabel(pl, -2, 1.2, "(−2, 6/5)", 0, 18, "center"); ptLabel(pl, 1, 0, "(1, 0)", 8, -14, "left"); ptLabel(pl, 0, 2 / 3, "(0, 2/3)", -8, -14, "right");
      badge(ctx, -2, -1.6, 1, -2, -0.15); badge(ctx, 3, -1.6, 1, 3, -0.15);
      badge(ctx, 3.9, 6.8, 2, 3, 6.8); badge(ctx, -4, 3.2, 3, -4, 2.05);
      badge(ctx, -3.4, 4.6, 4, -2.1, 1.45); badge(ctx, 1.9, 2.6, 5, 1.05, 0.15);
      badge(ctx, -1.2, -2.4, 6, -0.08, 0.55); badge(ctx, 2.05, -0.75, 7);
    } });
}

// ---------- Mixed practice: choice (retry), number, pair, solutions and interval entry (N10), in the plan's order ----------
var GENERAL = "Check your work, or use a hint.";
function mixed(host, api, a){
  var S = api.S; S.items = S.items || {};
  var items = a.items, msgs = {}, ibs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function tags(it){ return '<span class="tags"><span class="tag">' + MV.topicLabel(it.topic) + "</span>" + (it.star ? '<span class="tag">★ Challenge</span>' : "") + "</span>"; }
  function head(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + tags(it) + "</div>"; }
  function box(it){ return host.querySelector('[data-mx="' + it.id + '"]'); }
  function feedback(it, x){
    if (x.solved) return MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    return msgs[it.id] ? MV.fbHTML("bad", msgs[it.id]) : "";
  }
  function actions(it, x){ return x.solved ? "" : '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint); }
  function inp(it, x, k, label, type){
    var id = "mxn-" + it.id + (k == null ? "" : "-" + k), val = k == null ? x.val : (x.vals || [])[k];
    var t = type === "text" ? ' type="text" inputmode="text"' : type === "decimal" ? ' type="text" inputmode="decimal"' : ' type="number" step="any"';
    return '<label class="mx-lab" for="' + id + '">' + label + '</label><input class="numin' + (type === "text" ? "" : " short") + '" id="' + id + '" data-mxn="' + it.id + '"' + (k == null ? "" : ' data-mxk="' + k + '"') +
      t + ' autocomplete="off" value="' + MV.esc(val || "") + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit && k == null ? '<span class="mx-unit">' + it.unit + "</span>" : "");
  }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';

  // ---- interval entry: the N10 builder ----
  function ivShow(it, ps){ return m(iv.text(ps)) + (ps.length ? ' <span class="muted">(' + m(iv.set(ps, it.v || "x")) + ")</span>" : ""); }
  function buildIv(it, el, i){
    var x = ist(it.id);
    el.innerHTML = head(it, i) + '<p class="how">Build your answer on the number line. Drag an end (or use the arrow keys, then O or C for open or closed), and add a piece if you need one.</p>' +
      '<div class="mx-ib"></div><p class="mx-yours" aria-live="polite"></p><div class="mx-dyn"></div>';
    var ib = MV.intervalBuilder($(".mx-ib", el), { min:-6, max:6, maxPieces:3, modes:false, test:false, readout:false, halfToggle:false, caption:false,
      aria:"Number line for your answer", pieces:[{ a:-2, b:2, aIn:true, bIn:true }],
      onChange:function(s){ var y = ist(it.id); if (!y.solved) { y.build = s; msgs[it.id] = null; api.save(); paintYours(it); } } });
    ibs[it.id] = ib;
    if (x.build) ib.set(x.build, true);
  }
  function paintYours(it){ var el = box(it), y = $(".mx-yours", el); if (y) y.innerHTML = "<strong>Your answer:</strong> " + ivShow(it, iv.norm(ibs[it.id].iv())); }

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
      MV.keepFocus(dyn, function(){ dyn.innerHTML = actions(it, x) + feedback(it, x); });
    } else {
      var row;
      if (it.kind === "pair") row = '<div class="numrow mx-pair">' + it.labels.map(function(l, k){ return '<span class="mx-cell">' + inp(it, x, k, l) + "</span>"; }).join("") + "</div>";
      else if (it.kind === "set") row = '<div class="numrow">' + inp(it, x, null, it.label || "Every answer, separated by commas:", "text") + "</div>";
      else row = '<div class="numrow">' + inp(it, x, null, it.label || "Your answer:", it.keypad) + "</div>";
      MV.keepFocus(el, function(){ el.innerHTML = head(it, i) + row + actions(it, x) + '<div class="mx-fb">' + feedback(it, x) + "</div>"; });
    }
    paintSum();
  }
  function paintSum(){
    var el = $(".mx-sum", host), done = items.filter(function(it){ return ist(it.id).solved; }).length;
    if (done < items.length) { el.innerHTML = '<p class="tiny muted">' + done + " of " + items.length + " done. Your first-try table by module appears when all " + items.length + " are done.</p>"; return; }
    var rows = TOPICS.map(function(t){ var its = items.filter(function(it){ return it.topic === t; }); return { t:t, n:its.length, r:its.filter(function(it){ return ist(it.id).first; }).length }; }).filter(function(o){ return o.n; });
    el.innerHTML = '<div class="part"><h3>Your first tries by module</h3>' + topicTable(rows, "First try", "Mixed practice first tries by module") + "</div>";
  }
  function bad(text){ return "<strong>✗ Not quite.</strong> " + text + " Try again."; }
  function near(a, b){ return b == null || Math.abs(a - b) < 1e-9; }
  function judge(it, x){
    var ans = MV.ans(it), v, w;
    if (it.kind === "num") {
      v = MV.parseNum(x.val);
      if (!v || v.length !== 1) return { msg:"Enter a number, such as 12 or 0.5." };
      if (Math.abs(v[0] - ans) < 1e-9) return { ok:true };
      w = (it.wrong || []).filter(function(q){ return MV.sameNums(v, [q.match], 1e-9); })[0];
      return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "pair") {
      var vs = [0, 1].map(function(k){ var r = MV.parseNum((x.vals || [])[k]); return r && r.length === 1 ? r[0] : null; });
      if (vs[0] == null || vs[1] == null) return { msg:"Enter a number in each box." };
      if (near(vs[0], ans[0]) && near(vs[1], ans[1])) return { ok:true };
      // a null in a wrong-answer pattern matches anything in that box
      w = (it.wrong || []).filter(function(q){ return near(vs[0], q.match[0]) && near(vs[1], q.match[1]); })[0];
      return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "set") {
      v = MV.parseList(String(x.val || ""));
      if (!v) return { msg:"Enter your answers as numbers separated by commas, such as −3, 4." };
      if (MV.sameNums(v, ans, 1e-9)) return { ok:true };
      w = (it.wrong || []).filter(function(q){ return MV.sameNums(v, q.match, 1e-9); })[0];
      return { msg:bad(w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "iv") {
      var ps = iv.norm(ibs[it.id].iv()), got = iv.text(ps);
      x.build = ibs[it.id].get();
      if (got === ans) return { ok:true };
      var named = (it.wrong || {})[got];
      return { msg:bad(named || ("Your answer is " + ivShow(it, ps) + ". Check each piece and each endpoint.")) };
    }
  }
  host.addEventListener("input", function(e){
    var t = e.target, id = t.dataset && t.dataset.mxn; if (!id) return;
    var x = ist(id);
    if (t.dataset.mxk != null) { x.vals = x.vals || ["", ""]; x.vals[+t.dataset.mxk] = t.value; } else x.val = t.value;
    api.save();
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
      else { if (/^<strong>/.test(r.msg)) x.tries++; msgs[it.id] = r.msg; }
    }
    api.save(); paint(it); MV.focusFb(el);
  });
  items.forEach(paint);
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- exact fractions and polynomials (from MHF4U 21) ----------
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
function Q(n, d){ if (d == null) d = 1; if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return { n:n / g, d:d / g }; }
function qadd(a, b){ return Q(a.n * b.d + b.n * a.d, a.d * b.d); }
function qmul(a, b){ return Q(a.n * b.n, a.d * b.d); }
function qdiv(a, b){ return Q(a.n * b.d, a.d * b.n); }
function qv(a){ return a.n / a.d; }
function qT(a){ return (a.n < 0 ? MINUS : "") + Math.abs(a.n) + (a.d === 1 ? "" : "/" + a.d); }
function ptT(x, y){ return "(" + qT(x) + ", " + qT(y) + ")"; }
function uniq(a){ var o = []; a.forEach(function(v){ if (o.indexOf(v) < 0) o.push(v); }); return o; }
function sortN(a){ return a.slice().sort(function(x, y){ return x - y; }); }
function cnt(a, v){ return a.filter(function(x){ return x === v; }).length; }
function pmul(a, b){ var r = []; for (var i = 0; i < a.length + b.length - 1; i++) r.push(0); a.forEach(function(x, i){ b.forEach(function(y, j){ r[i + j] += x * y; }); }); return r; }
function pRoots(c, roots){ var p = [c]; roots.forEach(function(t){ p = pmul(p, [1, -t]); }); return p; }
function pval(p, x){ var v = 0; p.forEach(function(c){ v = v * x + c; }); return v; }
function pvalQ(p, X){ var v = Q(0); p.forEach(function(c){ v = qadd(qmul(v, X), Q(c)); }); return v; }
function pdiv(p, d){ var r = p.slice(), q = [], n = r.length - d.length; for (var i = 0; i <= n; i++) { var k = r[i] / d[0]; q.push(k); for (var j = 0; j < d.length; j++) r[i + j] -= k * d[j]; } return { q:q, r:r.slice(Math.max(0, n + 1)) }; }
function psrc(p){
  var n = p.length - 1, out = "", first = true;
  p.forEach(function(c, i){
    if (!c) return;
    var e = n - i, a = Math.abs(c), body = (e > 0 && a === 1 ? "" : a) + (e === 0 ? "" : e === 1 ? "x" : "x^" + e);
    out += first ? (c < 0 ? "-" : "") + body : (c < 0 ? " - " : " + ") + body; first = false;
  });
  return out || "0";
}
function fac(r){ return r === 0 ? "x" : r > 0 ? "x - " + r : "x + " + (-r); }
function facP(r){ return r === 0 ? "x" : "(" + fac(r) + ")"; }
function prodSrc(c, roots, bare){
  if (!roots.length) return c < 0 ? "-" + (-c) : String(c);
  var seen = uniq(roots), body = seen.map(function(t){ var k = cnt(roots, t); return k > 1 ? (t === 0 ? "x" : "(" + fac(t) + ")") + "^" + k : facP(t); }).join("");
  if (bare && c === 1 && roots.length === 1) return fac(roots[0]);
  return (c === 1 ? "" : c === -1 ? "-" : String(c)) + body;
}
function ratSrc(c, top, bot){ var t = prodSrc(c, top, true); return bot.length ? "{" + t + "}/{" + prodSrc(1, bot, true) + "}" : t; }

// ---------- performance task: build a rational function to spec ----------
// @component N26 factorTiles (adapted from MHF4U 21) — numerator/denominator rows of (x − r) tiles (r from −6 to 6) with a
// constant-factor stepper (−6 to 6, not 0), add/remove, pair-by-pair match highlighting with link lines; ftAnalyse gives exact features.
function ftAnalyse(st){
  var c = st.c, top = st.top.slice(), bot = st.bot.slice();
  var restr = sortN(uniq(bot)), holes = [], vas = [], lt = top.slice(), lb = bot.slice(), common = [];
  uniq(top).forEach(function(a){ var k = Math.min(cnt(top, a), cnt(bot, a)); if (k > 0) { common.push({ r:a, k:k }); for (var i = 0; i < k; i++) { lt.splice(lt.indexOf(a), 1); lb.splice(lb.indexOf(a), 1); } } });
  var P = pRoots(c, lt), D = pRoots(1, lb);
  function f(x){ return pval(P, x) / pval(D, x); }
  function fQ(X){ var d = pvalQ(D, X); return d.n === 0 ? null : qdiv(pvalQ(P, X), d); }
  restr.forEach(function(a){ if (cnt(bot, a) <= cnt(top, a)) holes.push({ a:a, h:fQ(Q(a)) }); else vas.push({ a:a }); });
  var dt = lt.length, db = lb.length, far;
  if (!db) far = { k:"poly", p:P, deg:dt };
  else if (dt < db) far = { k:"zero" };
  else if (dt === db) far = { k:"eq", v:c };
  else if (dt === db + 1) far = { k:"ob", q:pdiv(P, D).q };
  else far = { k:"none" };
  var zeros = sortN(uniq(lt)).filter(function(t){ return restr.indexOf(t) < 0; });
  // sign chart: critical values (zeros, vertical asymptotes, holes) and the sign on each interval between them
  var crit = zeros.map(function(z){ return { v:z, k:"zero" }; }).concat(vas.map(function(v){ return { v:v.a, k:"va" }; }), holes.map(function(h){ return { v:h.a, k:"hole" }; }))
    .sort(function(p, q){ return p.v - q.v; }), cols = [];
  for (var i = 0; i <= crit.length; i++) {
    var lo = i ? crit[i - 1].v : -Infinity, hi = i < crit.length ? crit[i].v : Infinity;
    var t = lo === -Infinity ? (isFinite(hi) ? hi - 1 : 0) : hi === Infinity ? lo + 1 : (lo + hi) / 2;
    cols.push({ a:lo, b:hi, s:f(t) > 0 ? 1 : -1 });
  }
  var le0 = iv.norm(cols.filter(function(q){ return q.s < 0; }).map(function(q){ return { a:q.a, b:q.b, aIn:false, bIn:false }; })
    .concat(zeros.map(function(z){ return { a:z, b:z, aIn:true, bIn:true }; })));
  return { c:c, top:top, bot:bot, restr:restr, holes:holes, vas:vas, common:common, lt:lt, lb:lb, P:P, D:D, f:f, far:far, zeros:zeros, crit:crit, cols:cols, le0:le0 };
}
function ftPairs(st){ var used = {}, out = []; st.top.forEach(function(t, i){ for (var j = 0; j < st.bot.length; j++) if (!used[j] && st.bot[j] === t) { used[j] = 1; out.push([i, j]); return; } }); return out; }
function ftBuilder(host, o){
  var U = o.ui;
  host.innerHTML = '<div class="ft-wrap"><div class="ft-a" role="group" aria-label="a"></div><div class="ft"><div class="ft-row" data-row="top" role="group" aria-label="' + MV.esc(U.top) + '"></div><div class="ft-bar" aria-hidden="true"></div><div class="ft-row" data-row="bot" role="group" aria-label="' + MV.esc(U.bottom) + '"></div><svg class="ft-links" aria-hidden="true"></svg></div></div>';
  var wrap = $(".ft", host), aBox = $(".ft-a", host);
  function btn(act, row, i, txt, lab, dis, cls){ return '<button type="button" class="' + (cls || "ft-b") + '" data-act="' + act + '" data-row="' + row + '" data-i="' + i + '" data-k="ft' + row + i + act + '" aria-label="' + MV.esc(lab) + '"' + (dis ? " disabled" : "") + ">" + txt + "</button>"; }
  function tile(row, i, r, cls, canRm){
    var f = m(facP(r)), name = (row === "top" ? U.top : U.bottom) + " factor " + (i + 1) + ", " + MV.plain(f);
    return '<span class="ft-tile' + cls + '" data-row="' + row + '" data-i="' + i + '">' + btn("dec", row, i, MINUS, name + ": r " + U.dec, r <= -6) +
      '<span class="ft-f">' + f + "</span>" + btn("inc", row, i, "+", name + ": r " + U.inc, r >= 6) + (canRm ? btn("rm", row, i, "×", U.remove + " " + name, false, "ft-x") : "") + "</span>";
  }
  function paint(){
    var st = o.get(), pairs = ftPairs(st), mt = {}, mb = {};
    pairs.forEach(function(p){ mt[p[0]] = 1; mb[p[1]] = 1; });
    var aH = '<span class="ft-const"><span class="ft-cl">' + m(U.constant + " =") + '</span><span class="ft-cb">' +
      btn("cdec", "c", 0, MINUS, "a: " + U.dec, st.c <= -6) + '<span class="ft-cv" aria-live="polite" aria-label="' + MV.esc("a = " + MV.plain(num(st.c))) + '">' + num(st.c) + "</span>" +
      btn("cinc", "c", 0, "+", "a: " + U.inc, st.c >= 6) + '</span></span><span class="ft-times" aria-hidden="true">×</span>';
    var top = '<span class="ft-lab">' + U.top + "</span>" + st.top.map(function(r, i){ return tile("top", i, r, mt[i] ? " match" : "", true); }).join("") +
      '<button type="button" class="btn ghost sm ft-add" data-act="add" data-row="top" data-i="0" data-k="fttopadd"' + (st.top.length >= 2 ? " disabled" : "") + ">" + U.addTile + "</button>";
    var bot = '<span class="ft-lab">' + U.bottom + "</span>" + st.bot.map(function(r, i){ return tile("bot", i, r, mb[i] ? " match" : "", st.bot.length > 1); }).join("") +
      '<button type="button" class="btn ghost sm ft-add" data-act="add" data-row="bot" data-i="0" data-k="ftbotadd"' + (st.bot.length >= 2 ? " disabled" : "") + ">" + U.addTile + "</button>";
    MV.keepFocus(host, function(){ aBox.innerHTML = aH; $('[data-row="top"].ft-row', wrap).innerHTML = top; $('[data-row="bot"].ft-row', wrap).innerHTML = bot; });
    links();
  }
  function tileEl(row, i){ return wrap.querySelector('.ft-tile[data-row="' + row + '"][data-i="' + i + '"]'); }
  function links(){
    var svg = $(".ft-links", wrap), st = o.get(), wr = wrap.getBoundingClientRect(); if (!wr.width) return;
    svg.setAttribute("width", wr.width); svg.setAttribute("height", wr.height);
    svg.innerHTML = ftPairs(st).map(function(p){
      var a = tileEl("top", p[0]), b = tileEl("bot", p[1]); if (!a || !b) return "";
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return '<line x1="' + (ra.left - wr.left + ra.width / 2) + '" y1="' + (ra.bottom - wr.top) + '" x2="' + (rb.left - wr.left + rb.width / 2) + '" y2="' + (rb.top - wr.top) + '"/>';
    }).join("");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button[data-act]"); if (!b || b.disabled) return;
    var st = o.get(), n = { c:st.c, top:st.top.slice(), bot:st.bot.slice() }, act = b.dataset.act, row = b.dataset.row, i = +b.dataset.i, arr = n[row];
    if (act === "cdec" || act === "cinc") { var c = n.c + (act === "cinc" ? 1 : -1); if (c === 0) c += act === "cinc" ? 1 : -1; if (c < -6 || c > 6) return; n.c = c; }
    else if (act === "dec" || act === "inc") arr[i] = clamp(arr[i] + (act === "inc" ? 1 : -1), -6, 6);
    else if (act === "rm") arr.splice(i, 1);
    else if (act === "add") arr.push(0);
    o.set(n, act);
  });
  if (window.ResizeObserver) new ResizeObserver(links).observe(wrap);
  return { paint:paint, links:links };
}
// canvas pieces for a tile function (from MHF4U 21): oblique line, holes as open circles (or an edge arrow when off-window)
function dashLine(ctx, p, mm, b){
  var v = p.v; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, p.W, p.H); ctx.clip();
  ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(p.X(v.xmin), p.Y(mm * v.xmin + b)); ctx.lineTo(p.X(v.xmax), p.Y(mm * v.xmax + b)); ctx.stroke(); ctx.restore();
}
function openDot(ctx, p, x, y, label){
  var X = p.X(x), Y = p.Y(y);
  if (X < -12 || X > p.W + 12 || Y < -12 || Y > p.H + 12) return false;
  ctx.save(); ctx.beginPath(); ctx.arc(X, Y, 5.5, 0, Math.PI * 2); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = css("--pen"); ctx.stroke(); ctx.restore();
  if (label) p.label({ x:x, y:y, text:label, dx:X > p.W - 90 ? -10 : 10, dy:Y < 30 ? 16 : -16, align:X > p.W - 90 ? "right" : "left", bg:true, font:"600 13px " + p.fontM });
  return true;
}
function edgeMark(ctx, p, x, y, label){
  var X = p.X(x), Y = p.Y(y), cx = clamp(X, 14, p.W - 14), cy = clamp(Y, 14, p.H - 14), ang = Math.atan2(Y - cy, X - cx);
  ctx.save(); ctx.fillStyle = css("--ink"); ctx.translate(cx, cy); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-5, -6); ctx.lineTo(-5, 6); ctx.closePath(); ctx.fill(); ctx.restore();
  p.label({ x:p.xOf(cx), y:p.yOf(cy), text:label, dx:cx > p.W / 2 ? -12 : 12, dy:cy > p.H / 2 ? -14 : 14, align:cx > p.W / 2 ? "right" : "left", bg:true, font:"600 13px " + p.fontM });
}
var TV = { xmin:-7.5, xmax:7.5, ymin:-9, ymax:12 };
var task = (function(){
  var api, tb, plot;
  function T(){ return MV.C.task; }
  function UI(){ return T().ui; }
  function st(){ return api ? api.S.st : { c:1, top:[], bot:[0] }; }
  function read(){ var s = st(); return { c:s.c, top:s.top.slice(), bot:s.bot.slice(), A:ftAnalyse(s) }; }
  function list(a, fn){ return a.length ? a.map(fn).join(", ") : UI().none; }
  function vaText(A){ return list(A.vas, function(v){ return m("x = " + v.a); }); }
  function holeText(A){ return list(A.holes, function(h){ return m(ptT(Q(h.a), h.h)); }); }
  function farText(A){
    var f = A.far, u = UI();
    if (f.k === "zero") return u.farZero;
    if (f.k === "eq") return F(u.farEq, [num(f.v)]);
    if (f.k === "ob") return F(u.farOb, [m("y = " + psrc(f.q))]);
    if (f.k === "poly" && f.deg === 0) return F(u.farConst, [num(A.c)]);
    return u.farPoly;
  }
  function setText(A){ return A.le0.length ? m(iv.text(A.le0)) : UI().empty; }
  function checks(d){
    var A = d.A, ck = A.common.reduce(function(s, q){ return s + q.k; }, 0);
    return [A.vas.length === 1 && A.vas[0].a === 2,
      A.c === 3 && (A.far.k === "eq" || (A.far.k === "poly" && A.far.deg === 0)),
      A.holes.length === 1 && A.holes[0].a < 0 && ck === 1,
      iv.text(A.le0) === "(2, 4]"];
  }
  function keyOf(d){ return d.c + "|" + sortN(d.top).join(",") + "|" + sortN(d.bot).join(","); }
  function unkey(k){ var p = k.split("|"), sp = function(s){ return s ? s.split(",").map(Number) : []; }; return { c:+p[0], top:sp(p[1]), bot:sp(p[2]) }; }
  function chart(A){
    var u = UI(), xs = [], ss = [];
    A.cols.forEach(function(q, i){
      xs.push(q.a === -Infinity && q.b === Infinity ? m("x ∈ ℝ") : m(iv.text([{ a:q.a, b:q.b, aIn:false, bIn:false }])));
      ss.push('<td class="' + (q.s < 0 ? "neg" : "") + '">' + (q.s > 0 ? "+" : MINUS) + "</td>");
      var c = A.crit[i]; if (!c) return;
      xs.push(m(num(c.v)));
      ss.push('<td class="cv">' + (c.k === "zero" ? "0" : c.k === "va" ? u.va : u.hole) + "</td>");
    });
    return '<div class="tbl-wrap"><table class="tk-sc"><caption class="vh">' + MV.plain(u.signTitle) + '</caption><tbody><tr><th scope="row">' + u.sx + "</th>" + xs.map(function(x){ return "<td>" + x + "</td>"; }).join("") +
      '</tr><tr><th scope="row">' + u.sf + "</th>" + ss.join("") + "</tr></tbody></table></div>";
  }
  function preview(){
    var d = read(), A = d.A, u = UI(), ink2 = css("--ink-2");
    var sc = { view:TV, asymptotes:[], curves:[{ f:A.f, color:css("--pen"), width:3, arrows:true }] };
    A.vas.forEach(function(v){ sc.asymptotes.push({ x:v.a, label:"x = " + num(v.a), color:ink2 }); });
    if (A.far.k === "zero") sc.asymptotes.push({ y:0, label:"y = 0" });
    if (A.far.k === "eq") sc.asymptotes.push({ y:A.c, label:"y = " + num(A.c) });
    sc.bands = A.le0.filter(function(q){ return q.a !== q.b; }).map(function(q){ return { x0:Math.max(TV.xmin, q.a), x1:Math.min(TV.xmax, q.b) }; });
    sc.after = function(ctx, p){
      if (A.far.k === "ob") dashLine(ctx, p, A.far.q[0], A.far.q[1]);
      A.holes.forEach(function(h){ var lab = ptT(Q(h.a), h.h); if (!openDot(ctx, p, h.a, qv(h.h), lab)) edgeMark(ctx, p, h.a, qv(h.h), lab); });
    };
    sc.describe = "Graph of " + MV.plain(m("f(x) = " + ratSrc(A.c, A.top, A.bot))) + ". Vertical asymptotes: " + MV.plain(vaText(A)) + ". " + MV.plain(farText(A)) + ". Holes: " + MV.plain(holeText(A)) + ". f(x) ≤ 0 on " + MV.plain(setText(A)) + " (shaded).";
    plot.draw(sc);
    $("#tk-eq").innerHTML = m("f(x) = " + ratSrc(A.c, A.top, A.bot));
    $("#tk-sc").innerHTML = chart(A);
    var R = u.rows;
    $("#tk-read").innerHTML = MV.readoutHTML([[R.va, vaText(A)], [R.far, farText(A)], [R.holes, holeText(A)], [R.le0, setText(A)]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.st = a.S.st || { c:1, top:[], bot:[0] };
      var u = UI();
      inp.innerHTML = '<p class="tiny muted pt-how">' + u.how + '</p><div id="tk-tiles"></div>';
      pv.innerHTML = '<h4 class="tk-h">' + u.preview + '</h4><p class="eq-cap tk-eq" id="tk-eq" aria-live="polite"></p><canvas class="plot" id="tk-plot" role="img" aria-label="Preview graph"></canvas>' +
        '<p class="tk-sl">' + u.signTitle + '</p><div id="tk-sc"></div><dl class="read" id="tk-read" aria-live="polite"></dl>';
      plot = new MV.Plot($("#tk-plot"), TV); plot.render = preview;
      tb = ftBuilder($("#tk-tiles"), { ui:u, get:function(){ return a.S.st; }, set:function(n){ a.S.st = n; a.save(); tb.paint(); preview(); a.update(); } });
      tb.paint(); preview();
      document.addEventListener("click", function(e){
        if (!e.target.closest || !e.target.closest("#task-check")) return;
        setTimeout(function(){ var ts = MV.taskState(), g = $("#task-fb .fb.good"); if (g && ts.found.length >= 6 && !g.querySelector(".tk-all")) g.insertAdjacentHTML("beforeend", '<p class="tk-all">' + T().all6 + "</p>"); }, 0);
      });
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(d, res){
      var A = d.A, t = T(), out = [], now = [fill(t.tipNow[0], { v:vaText(A) }), fill(t.tipNow[1], { far:farText(A) }), fill(t.tipNow[2], { h:holeText(A) }), fill(t.tipNow[3], { s:setText(A) })];
      res.forEach(function(ok, i){ if (!ok) out.push(now[i] + " " + t.tips[i]); });
      return out;
    },
    key:keyOf,
    label:function(k){ var s = unkey(k); return m(ratSrc(s.c, s.top, s.bot)); },
    text:function(k){ var s = unkey(k); return MV.plain(m(ratSrc(s.c, s.top, s.bot))); }
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
