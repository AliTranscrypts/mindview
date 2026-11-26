// MHF4U 16 Chapter 2 Summary & Review: hero, per-topic tables (diagnostic, mixed practice, Final Check), Connect Part B
// (tool chains with a spare slot) and "The chapter on one page", the mixed-practice set (choice, number, pair, roots and
// interval entry) and the "One polynomial, five conditions" task.
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num, iv = MV.iv, m = MV.m, MINUS = MV.MINUS;
var TOPICS = ["11", "12", "13", "14", "15"];
function Pf(x){ return (x - 2) * (x - 4) * (x + 3); }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function modsLabel(ts){ return ts.length > 1 ? "Modules " + ts.slice(0, -1).join(", ") + " and " + ts[ts.length - 1] : "Module " + ts[0]; }

// ---------- per-topic tables (N16 diagnostic, mixed practice, N17 Final Check), as in MHF4U 10 ----------
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

// ---------- hero: P draws in, then five labels, one per module, about 700 ms apart (storyboard in the plan) ----------
var HV = { xmin:-5, xmax:6, ymin:-30, ymax:45 }, FANK = [2, 0.5, -0.5, -1];
// rings (--hi) at the zeros; pulse 0..1 grows them
function rings(ctx, pl, xs, pulse){
  ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3;
  xs.forEach(function(x){ ctx.beginPath(); ctx.arc(pl.X(x), pl.Y(0), 9 + 5 * (pulse || 0), 0, 2 * Math.PI); ctx.stroke(); });
  ctx.restore();
}
function hero(f){
  var p = new MV.Plot(f.canvas, HV), CAP = (MV.C.hero.fig || {}).captions || [], st = { t:0, k:0, fan:0, glow:0 };
  p.render = function(){
    var ink = css("--ink"), ink2 = css("--ink-2"), pen = css("--pen"), k = st.k, curves = [], pts = [], segs = [], labels = [], regs = [];
    var f13 = "600 13px " + (css("--font-ui") || "sans-serif");
    if (k >= 4) FANK.forEach(function(kk){ var kv = 1 + (kk - 1) * st.fan; curves.push({ f:function(x){ return kv * Pf(x); }, color:ink2, alpha:0.35, width:2 }); });
    if (k >= 5) regs.push({ f:Pf, x0:HV.xmin, x1:-3, where:"below" }, { f:Pf, x0:2, x1:4, where:"below" });
    curves.push({ f:Pf, color:pen, width:3.2, arrows:st.t >= 1, domain:[HV.xmin - 0.1, HV.xmin - 0.1 + (HV.xmax - HV.xmin + 0.2) * st.t] });
    if (k >= 1) { segs.push({ x1:1, y1:0, x2:1, y2:12, color:ink, width:2, dash:[4, 4] }); pts.push({ x:1, y:12, r:5, color:ink }); labels.push({ x:1, y:12, text:"P(1) = 12", dx:10, dy:-12, bg:true }); }
    if (k >= 2) { pts.push({ x:2, y:0, r:5, color:ink }); labels.push({ x:2, y:0, text:"P(2) = 0", dx:10, dy:-16, bg:true }); }
    if (k >= 5) labels.push({ x:-4, y:-14, text:"P < 0", align:"center", font:f13, bg:true }, { x:3, y:-14, text:"P < 0", align:"center", font:f13, bg:true });
    p.draw({ view:HV, xTicks:{ step:1 }, yTicks:{ step:10 }, regions:regs, curves:curves, segments:segs, points:pts, labels:labels,
      describe:"Graph of P(x) = (x − 2)(x − 4)(x + 3)" + (k ? ". " + CAP.slice(0, k).map(MV.plain).join("; ") + "." : "."),
      after:function(ctx, pl){ if (k >= 3) rings(ctx, pl, [-3, 2, 4], st.glow); } });
    f.cap.innerHTML = k ? CAP.slice(0, k).map(function(c){ return '<span class="hc-l">' + c + "</span>"; }).join("") : m("P(x) = (x - 2)(x - 4)(x + 3)");
  };
  if (MV.reduceMotion) { st.t = 1; st.k = 5; st.fan = 1; p.render(); return; }
  p.render();
  function next(){
    if (st.k >= 5) return;
    MV.wait(700, function(){
      st.k++; p.render();
      if (st.k === 3) MV.tween({ dur:700, ease:function(t){ return t; }, step:function(t){ st.glow = Math.sin(Math.PI * t); p.render(); }, done:function(){ st.glow = 0; p.render(); } });
      if (st.k === 4) MV.tween({ dur:600, step:function(t){ st.fan = t; p.render(); }, done:function(){ st.fan = 1; p.render(); } });
      next();
    });
  }
  MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ st.t = t; p.render(); }, done:function(){ st.t = 1; p.render(); next(); } });
}

// ---------- Connect Part B: tool chains (N5 put the steps in order, with an optional spare slot for a decoy card) ----------
function chains(host, api, a){
  var S = api.S; S.seq = S.seq || {};
  var sel = {}, msgs = {};
  function cardsOf(s){ return s.decoy ? s.steps.concat([s.decoy]) : s.steps; }
  function sq(s){
    var x = S.seq[s.id];
    if (!x || !x.order || x.order.length !== cardsOf(s).length) x = S.seq[s.id] = { order:s.start.slice(), tries:0, solved:false, first:null, decoy:false };
    return x;
  }
  // The chain is the first steps.length positions; with a decoy, the last position is "Not needed in the chain".
  // The decoy is accepted in place of card 2 (index 1).
  function judge(s, ord){
    var n = s.steps.length, D = s.decoy ? n : -1, viaDecoy = D >= 0 && ord[1] === D, p;
    for (p = 0; p < n; p++) if (ord[p] !== (viaDecoy && p === 1 ? D : p)) break;
    if (p === n) return { ok:true, decoy:viaDecoy };
    var c = ord[p], fb = D >= 0 && p > 1 && (c === 1 || c === D) ? s.fbTwice : c === D ? s.fbDecoy : s.fb[c];
    return { ok:false, pos:p, card:c, fb:fb };
  }
  function li(s, x, pos, cards){
    var c = x.order[pos], spare = !!s.decoy && pos === s.steps.length, isSel = sel[s.id] === pos && !x.solved;
    var cls = "ostep" + (x.solved ? (spare ? " ch-left" : " good") : (msgs[s.id] && msgs[s.id].pos === pos ? " bad" : ""));
    return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "c" + c + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (spare ? "—" : (pos + 1) + ".") + "</span><span>" + cards[c] + "</span></button>" +
      (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
  }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.sequences.map(function(s, si){
        var x = sq(s), cards = cardsOf(s), n = s.steps.length;
        var h = '<div class="q ch-seq' + (si ? " part" : "") + '" data-seq="' + s.id + '"><div class="q-head"><div class="q-prompt">Chain ' + (si + 1) + ": " + s.prompt + '</div><span class="tags"><span class="tag">' + modsLabel(s.topics) + "</span>" + (s.stretch ? '<span class="tag">Stretch</span>' : "") + "</span></div>";
        h += '<ol class="olist">' + x.order.slice(0, n).map(function(_, pos){ return li(s, x, pos, cards); }).join("") + "</ol>";
        if (s.decoy) h += '<p class="ch-spare-lab">' + s.spareLabel + ':</p><ol class="olist ch-spare">' + li(s, x, n, cards) + "</ol>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button></div>';
        if (x.solved) h += MV.fbHTML("good", "<strong>✓ That order works.</strong>" + (x.decoy ? " " + s.decoyNote : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
        else if (msgs[s.id]) h += MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + msgs[s.id].html + " Try again.");
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = a.sequences.filter(function(q){ return q.id === box.dataset.seq; })[0], x = sq(s);
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[s.id] = sel[s.id] === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel[s.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[s.id] = j; msgs[s.id] = null; api.save(); paint();
      var nb = host.querySelector('[data-seq="' + s.id + '"] [data-mv="' + b.dataset.mv + '"]');
      if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-seq="' + s.id + '"] [data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "check") {
      var r = judge(s, x.order);
      if (r.ok) { x.solved = true; x.first = x.tries === 0; x.decoy = r.decoy; msgs[s.id] = null; sel[s.id] = null; }
      else { x.tries++; msgs[s.id] = { pos:r.pos, html:"Step " + (r.pos + 1) + ", “" + cardsOf(s)[r.card] + "”, is out of place. " + r.fb }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0) g = g.concat(MV.goalIdx(s.goal)); }); return g; }
  };
}

// ---------- "The chapter on one page": a five-step flowchart, shown once the sorter and both chains are done ----------
function onePage(host, api, a){
  function counts(){
    var s = MV.ACTS.sort ? MV.ACTS.sort.stats() : { done:0, total:11 }, c = MV.ACTS.chains ? MV.ACTS.chains.stats() : { done:0, total:2 };
    return { done:s.done + c.done, total:s.total + c.total };
  }
  function paint(){
    var c = counts();
    if (c.done < c.total) { host.dataset.done = ""; host.innerHTML = '<p class="tiny muted">' + c.done + " of " + c.total + " done. " + a.locked + "</p>"; return; }
    if (host.dataset.done) return;
    host.dataset.done = "1";
    host.innerHTML = "<p>" + a.intro + '</p><ol class="op-flow">' + a.steps.map(function(st, i){
      return '<li class="op-step"><div class="op-top"><span class="op-n" aria-hidden="true">' + (i + 1) + "</span><strong>" + st.name + '</strong><span class="tag">Module ' + st.mod + "</span></div><p>" + st.html + "</p>" +
        (i < a.steps.length - 1 ? '<span class="op-arr" aria-hidden="true">↓</span>' : "") + "</li>";
    }).join("") + "</ol>";
  }
  var view = host.closest(".view");
  if (view) view.addEventListener("click", function(){ setTimeout(paint, 0); });
  paint();
  return { stats:function(){ return { first:0, total:0, done:0, line:"" }; }, missed:function(){ return []; } };
}

// ---------- Mixed practice: choice (retry), number, pair of numbers, all roots and interval entry (N10), in the plan's order ----------
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
    return '<label class="mx-lab" for="' + id + '">' + label + '</label><input class="numin' + (type === "text" ? "" : " short") + '" id="' + id + '" data-mxn="' + it.id + '"' + (k == null ? "" : ' data-mxk="' + k + '"') +
      (type === "text" ? ' type="text" inputmode="text"' : ' type="number" step="any"') + ' autocomplete="off" value="' + MV.esc(val || "") + '"' + (x.solved ? " disabled" : "") + ">";
  }
  host.innerHTML = items.map(function(it){ return '<div class="q mx-q" data-mx="' + it.id + '"></div>'; }).join("") + '<div class="mx-sum" aria-live="polite"></div>';

  // ---- interval entry: the N10 builder plus single points ----
  function ivPieces(it, x){
    var ib = ibs[it.id], ps = ib ? ib.iv() : [];
    return iv.norm(ps.concat((x.pts || []).map(function(p){ return { a:p, b:p, aIn:true, bIn:true }; })));
  }
  function ivShow(it, ps){ return m(iv.text(ps)) + (ps.length ? ' <span class="muted">(' + m(iv.set(ps, it.v || "x")) + ")</span>" : ""); }
  function buildIv(it, el, i){
    var x = ist(it.id); x.pts = x.pts || [];
    el.innerHTML = head(it, i) + '<p class="how">Build your answer on the number line. Drag an end (or use the arrow keys, then O or C for open or closed), and add a piece or a single point if you need one.</p>' +
      '<div class="mx-ib"></div><div class="mx-pts"></div><p class="mx-yours" aria-live="polite"></p><div class="mx-dyn"></div>';
    var ib = MV.intervalBuilder($(".mx-ib", el), { min:-10, max:10, maxPieces:3, modes:false, test:false, readout:false, halfToggle:false, caption:false,
      aria:"Number line for your answer", pieces:[{ a:-2, b:2, aIn:true, bIn:true }],
      onChange:function(s){ var y = ist(it.id); if (!y.solved) { y.build = s; msgs[it.id] = null; api.save(); paintYours(it); } } });
    ibs[it.id] = ib;
    if (x.build) ib.set(x.build, true);
    ib.plot.onDrawn(function(pl){
      var y = ist(it.id); if (!y.pts || !y.pts.length) return;
      var ctx = pl.ctx, cy = Math.round(pl.H * 0.5) + 0.5;
      y.pts.forEach(function(p){ ctx.beginPath(); ctx.arc(pl.X(p), cy, 6.5, 0, 2 * Math.PI); ctx.fillStyle = css("--pen"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = css("--sheet"); ctx.stroke(); });
      pl.c.setAttribute("aria-label", (pl.c.getAttribute("aria-label") || "") + " Single points: " + y.pts.map(function(p){ return num(p); }).join(", ") + ".");
    });
    ib.render();
  }
  function paintYours(it){
    var el = box(it), x = ist(it.id), y = $(".mx-yours", el);
    if (y) y.innerHTML = "<strong>Your answer:</strong> " + ivShow(it, ivPieces(it, x));
  }
  function paintPts(it){
    var el = box(it), x = ist(it.id), host2 = $(".mx-pts", el), v = it.v || "x";
    MV.keepFocus(host2, function(){
      host2.innerHTML = '<div class="mx-ptrow"><span class="mx-ptlab">Single points:</span>' + (x.pts.length ? x.pts.map(function(p, k){
        return '<button type="button" class="chip on mx-pt" data-ptrm="' + k + '" data-k="' + it.id + "pt" + k + '" aria-label="Remove the single point ' + MV.esc(v + " = " + num(p)) + '"' + (x.solved ? " disabled" : "") + ">" + m(v + " = " + num(p)) + ' <span aria-hidden="true">✕</span></button>';
      }).join("") : '<span class="tiny muted">none</span>') +
        (x.solved ? "" : '<span class="mx-ptadd"><label class="vh" for="mxp-' + it.id + '">A single point to add</label><input class="numin short" id="mxp-' + it.id + '" data-mxp="' + it.id + '" type="number" step="any" autocomplete="off" value="' + MV.esc(x.ptv || "") + '"><button type="button" class="btn ghost sm" data-ptadd="1" data-k="' + it.id + 'ptadd">Add a single point</button></span>') + "</div>";
    });
  }

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
      paintPts(it); paintYours(it);
      var dyn = $(".mx-dyn", el);
      MV.keepFocus(dyn, function(){ dyn.innerHTML = actions(it, x) + feedback(it, x); });
    } else {
      var row;
      if (it.kind === "pair") row = '<div class="numrow mx-pair">' + it.labels.map(function(l, k){ return '<span class="mx-cell">' + inp(it, x, k, l) + "</span>"; }).join("") + "</div>";
      else if (it.kind === "set") row = '<div class="numrow">' + inp(it, x, null, it.label || "Every answer, separated by commas:", "text") + "</div>";
      else row = '<div class="numrow">' + inp(it, x, null, it.label || "Your answer:") + "</div>";
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
  function bad(it, text){ return "<strong>✗ Not quite.</strong> " + text + " Try again."; }
  function judge(it, x){
    var ans = MV.ans(it), v, w;
    if (it.kind === "num") {
      v = MV.parseNum(x.val);
      if (!v || v.length !== 1) return { msg:"Enter a number, such as 12 or −3." };
      if (Math.abs(v[0] - ans) < 1e-9) return { ok:true };
      w = (it.wrong || []).filter(function(q){ return MV.sameNums(v, [q.match], 1e-9); })[0];
      return { msg:bad(it, w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "pair") {
      var vs = [0, 1].map(function(k){ var r = MV.parseNum((x.vals || [])[k]); return r && r.length === 1 ? r[0] : null; });
      if (vs[0] == null || vs[1] == null) return { msg:"Enter a number in each box." };
      if (Math.abs(vs[0] - ans[0]) < 1e-9 && Math.abs(vs[1] - ans[1]) < 1e-9) return { ok:true };
      w = (it.wrong || []).filter(function(q){ return Math.abs(vs[0] - q.match[0]) < 1e-9 && Math.abs(vs[1] - q.match[1]) < 1e-9; })[0];
      return { msg:bad(it, w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "set") {
      var raw = String(x.val || "");
      if (it.complexFb && (/\d\s*i(?![a-z])/i.test(raw) || /(^|[\s,±+\-−])i(?![a-z])/i.test(raw))) return { msg:bad(it, it.complexFb) };
      v = MV.parseList(raw);
      if (!v) return { msg:"Enter your answers as numbers separated by commas, such as −3, 1/2, 4." };
      if (MV.sameNums(v, ans, 1e-9)) return { ok:true };
      w = (it.wrong || []).filter(function(q){ return MV.sameNums(v, q.match, 1e-9); })[0];
      return { msg:bad(it, w ? w.fb : (it.general || GENERAL)) };
    }
    if (it.kind === "iv") {
      var ps = ivPieces(it, x), got = iv.text(ps);
      x.build = ibs[it.id].get();
      if (got === ans) return { ok:true };
      var named = (it.wrong || {})[got];
      return { msg:bad(it, named || ("Your answer is " + ivShow(it, ps) + ". Check each piece and each endpoint.")) };
    }
  }
  host.addEventListener("input", function(e){
    var t = e.target, id = t.dataset && (t.dataset.mxn || t.dataset.mxp); if (!id) return;
    var x = ist(id);
    if (t.dataset.mxp) x.ptv = t.value;
    else if (t.dataset.mxk != null) { x.vals = x.vals || ["", ""]; x.vals[+t.dataset.mxk] = t.value; }
    else x.val = t.value;
    api.save();
  });
  host.addEventListener("keydown", function(e){
    if (e.key !== "Enter" || !e.target.dataset) return;
    var id = e.target.dataset.mxn || e.target.dataset.mxp; if (!id) return;
    var b = host.querySelector(e.target.dataset.mxp ? '[data-k="' + id + 'ptadd"]' : '[data-k="' + id + 'chk"]'); if (b) { e.preventDefault(); b.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-mx]"); if (!el || b.closest(".mx-ib")) return;
    var it = items.filter(function(q){ return q.id === el.dataset.mx; })[0], x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; api.save(); paint(it); return; }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, (x.hint || 0) + 1); api.save(); paint(it); return; }
    if (b.dataset.ptadd) {
      var pv = MV.parseNum(x.ptv);
      if (!pv || pv.length !== 1 || pv[0] < -10 || pv[0] > 10) { msgs[it.id] = "Type a single number from −10 to 10, then press Add a single point."; paint(it); return; }
      if (x.pts.indexOf(pv[0]) < 0) x.pts.push(pv[0]);
      x.pts.sort(function(p, q){ return p - q; }); x.ptv = ""; msgs[it.id] = null; api.save(); paint(it); ibs[it.id].render();
      var nb = $('[data-k="' + it.id + 'ptadd"]', el); if (nb) nb.focus();
      return;
    }
    if (b.dataset.ptrm != null) { x.pts.splice(+b.dataset.ptrm, 1); msgs[it.id] = null; api.save(); paint(it); ibs[it.id].render(); var ab = $('[data-k="' + it.id + 'ptadd"]', el); if (ab) ab.focus(); return; }
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

// ---------- performance task: one polynomial, five conditions ----------
// @component N21 zeroSlots — copied from MHF4U 14: slot-style zero builder (controls only). Each slot has a whole-number box
// with − / + steppers, order chips and Clear.  zeroSlots(host, { uid, slots:[{ v, k }] (live array), min, max, maxDeg, maxOrder, onChange })
function parseSlots(slots, min, max){
  var zs = [], bad = null, seen = {};
  slots.forEach(function(s, i){
    var t = String(s.v == null ? "" : s.v).trim().replace(MINUS, "-"); if (t === "") return;
    var v = Number(t);
    if (!/^-?\d+$/.test(t) || v < min || v > max) { if (!bad) bad = { i:i, kind:"range" }; return; }
    if (seen[v] != null) { if (!bad) bad = { i:i, kind:"dup", j:seen[v] }; return; }
    seen[v] = i; zs.push([v, s.k]);
  });
  return { zs:zs, bad:bad };
}
var ZP = {
  deg:function(zs){ return zs.reduce(function(s, z){ return s + z[1]; }, 0); },
  factor:function(r, k){ var b = r === 0 ? "x" : "(x " + (r < 0 ? "+ " : "- ") + Math.abs(r) + ")"; return k > 1 ? b + "^" + k : b; }
};
function zeroSlots(host, o){
  o = Object.assign({ min:-5, max:5, maxDeg:99, maxOrder:3, uid:"zs" }, o);
  var note = "";
  function parse(){ var r = parseSlots(o.slots, o.min, o.max); r.deg = ZP.deg(r.zs); return r; }
  function filled(s){ return String(s.v == null ? "" : s.v).trim() !== ""; }
  function msg(r){
    if (r.bad && r.bad.kind === "range") return "Zero " + (r.bad.i + 1) + ": use a whole number from " + num(o.min) + " to " + num(o.max) + ".";
    if (r.bad && r.bad.kind === "dup") return "Zero " + (r.bad.i + 1) + " repeats zero " + (r.bad.j + 1) + ". To repeat a zero, use its order chip.";
    if (r.deg > o.maxDeg) return "Degree " + o.maxDeg + " is the most here. Lower an order or clear a zero.";
    return note;
  }
  function paint(){
    var r = parse();
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="zs" role="group" aria-label="Zeros and their orders">' + o.slots.map(function(s, i){
        var fl = filled(s), lab = "Zero " + (i + 1), chips = "";
        for (var k = 1; k <= o.maxOrder; k++) {
          var on = fl && k === s.k, dis = !fl || (!on && r.deg - s.k + k > o.maxDeg);
          chips += '<button type="button" class="chip' + (on ? " on" : "") + '" data-zk="' + k + '" data-zi="' + i + '" data-k="' + o.uid + i + "k" + k + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + ">" + k + "</button>";
        }
        var pos = '<span class="zs-pos"><button type="button" class="btn ghost sm zs-st" data-zs="dec" data-zi="' + i + '" data-k="' + o.uid + i + 'd" aria-label="' + lab + ': one less">' + MINUS + "</button>" +
          '<input class="zs-in" type="number" step="1" min="' + o.min + '" max="' + o.max + '" data-zin="' + i + '" data-k="' + o.uid + i + 'in" aria-label="' + lab + " (a whole number from " + num(o.min) + " to " + num(o.max) + ')" value="' + MV.esc(s.v) + '">' +
          '<button type="button" class="btn ghost sm zs-st" data-zs="inc" data-zi="' + i + '" data-k="' + o.uid + i + 'u" aria-label="' + lab + ': one more">+</button></span>';
        return '<div class="zs-row' + (fl ? "" : " empty") + '"><span class="zs-lab">' + lab + "</span>" + pos +
          '<span class="zs-ord" role="group" aria-label="Order of ' + lab.toLowerCase() + '"><span class="tiny">Order</span>' + chips + "</span>" +
          '<button type="button" class="btn ghost sm zs-clr" data-zs="clr" data-zi="' + i + '" data-k="' + o.uid + i + 'c"' + (fl ? "" : " disabled") + ">Clear</button></div>";
      }).join("") + '</div><p class="tiny zs-msg" aria-live="polite">' + msg(r) + "</p>";
    });
    note = "";
  }
  function taken(v, i){ return o.slots.some(function(t, j){ return j !== i && filled(t) && Number(String(t.v).replace(MINUS, "-")) === v; }); }
  function step(i, dir){
    var s = o.slots[i], t = String(s.v).trim().replace(MINUS, "-"), cur = /^-?\d+$/.test(t) ? Number(t) : null, v;
    if (cur == null) {
      if (parse().deg + s.k > o.maxDeg) { note = "Degree " + o.maxDeg + " is the most here. Lower an order first."; return false; }
      for (var d = 0, found = false; d <= o.max - o.min && !found; d++) [d, -d].forEach(function(c){ if (!found && c >= o.min && c <= o.max && !taken(c, i)) { v = c; found = true; } });
      if (!found) return false;
    } else {
      v = Math.max(o.min, Math.min(o.max, cur + dir));
      while (v >= o.min && v <= o.max && taken(v, i)) v += dir;
      if (v < o.min || v > o.max) return false;
    }
    s.v = String(v); return true;
  }
  // typing updates the rows in place (no re-render, so focus and the caret stay put)
  function sync(){
    var r = parse(), rows = host.querySelectorAll(".zs-row");
    o.slots.forEach(function(s, i){
      var fl = filled(s), row = rows[i]; if (!row) return;
      row.classList.toggle("empty", !fl);
      Array.prototype.forEach.call(row.querySelectorAll("[data-zk]"), function(b){ var k = +b.dataset.zk, on = fl && k === s.k; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); b.disabled = !fl || (!on && r.deg - s.k + k > o.maxDeg); });
      var c = row.querySelector('[data-zs="clr"]'); if (c) c.disabled = !fl;
    });
    var mm = host.querySelector(".zs-msg"); if (mm) mm.textContent = msg(r);
  }
  host.addEventListener("input", function(e){
    var i = e.target.dataset && e.target.dataset.zin; if (i == null) return;
    o.slots[+i].v = e.target.value; sync();
    o.onChange("type");
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var i = +b.dataset.zi, s = o.slots[i]; if (!s) return;
    if (b.dataset.zk) { var k = +b.dataset.zk; if (k === s.k || parse().deg - s.k + k > o.maxDeg) return; s.k = k; paint(); o.onChange("order"); return; }
    if (b.dataset.zs === "clr") { s.v = ""; s.k = 1; paint(); o.onChange("clear"); return; }
    if (b.dataset.zs === "inc" || b.dataset.zs === "dec") { step(i, b.dataset.zs === "inc" ? 1 : -1); paint(); o.onChange("step"); }
  });
  return { paint:paint, parse:parse, step:step, sync:sync };
}
// y-window fit for the preview (from MHF4U 05/10): x from the zeros (and 0); y from the lobes and the y-intercept.
function fitView(zs, a, extraY){
  var f = function(x){ var y = a; zs.forEach(function(z){ y *= Math.pow(x - z[0], z[1]); }); return y; };
  var xs = zs.map(function(z){ return z[0]; }).concat([-1, 2, 0]), lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
  var pad = Math.max(1.2, (hi - lo) * 0.18), xmin = lo - pad, xmax = hi + pad;
  if (xmax - xmin < 8) { var c = (xmin + xmax) / 2; xmin = c - 4; xmax = c + 4; }
  var s = zs.slice().sort(function(p, q){ return p[0] - q[0]; }), lobes = [];
  for (var i = 0; i + 1 < s.length; i++) { var best = 0; for (var j = 1; j < 80; j++) { var y = f(s[i][0] + (s[i + 1][0] - s[i][0]) * j / 80); if (Math.abs(y) > Math.abs(best)) best = y; } lobes.push(best); }
  if (!lobes.length) zs.forEach(function(z){ lobes.push(f(z[0] - 1.5), f(z[0] + 1.5)); });
  var vals = lobes.concat([f(0)], extraY || []), pos = 0, neg = 0;
  vals.forEach(function(v){ if (!isFinite(v)) return; if (v > pos) pos = v; if (-v > neg) neg = -v; });
  var mags = lobes.map(Math.abs).filter(function(v){ return v > 1e-12 && isFinite(v); });
  if (mags.length) {
    var mn = Math.min.apply(null, mags), R = pos + neg, cap = Math.max(10 * mn, 0.04 * R);
    if (R > cap) {
      pos = pos > 0 ? Math.max(Math.min(pos, cap * pos / R), Math.min(pos, 1.25 * mn)) : 0;
      neg = neg > 0 ? Math.max(Math.min(neg, cap * neg / R), Math.min(neg, 1.25 * mn)) : 0;
    }
  }
  (extraY || []).forEach(function(v){ if (v > pos) pos = v; if (-v > neg) neg = -v; });
  if (!(pos > 0) && !(neg > 0)) pos = neg = 1;
  if (pos < 0.12 * neg) pos = 0.12 * neg;
  if (neg < 0.12 * pos) neg = 0.12 * pos;
  return { xmin:xmin, xmax:xmax, ymin:-neg * 1.2, ymax:pos * 1.2 };
}

var task = (function(){
  var api = null, plot = null, nl = null, zb = null;
  function st(){ var s = api.S; s.slots = s.slots || [{ v:"-3", k:1 }, { v:"1", k:1 }, { v:"", k:1 }, { v:"", k:1 }]; if (s.k == null) s.k = 1; return s; }
  function read(){
    if (!api) return { zs:[], bad:null, k:1 };
    var s = st(), r = parseSlots(s.slots, -6, 6);
    return { zs:r.zs, bad:r.bad, k:s.k };
  }
  function fOf(d){ return function(x){ var y = d.k; d.zs.forEach(function(z){ y *= Math.pow(x - z[0], z[1]); }); return y; }; }
  function p0(d){ var y = d.k; d.zs.forEach(function(z){ y *= Math.pow(-z[0], z[1]); }); return y; }
  // exact sign on each interval between neighbouring zeros (parity of the orders and the sign of k)
  function regions(d){
    var rs = d.zs.map(function(z){ return z[0]; }).sort(function(p, q){ return p - q; }), b = [-Infinity].concat(rs, [Infinity]), out = [];
    for (var i = 0; i + 1 < b.length; i++) {
      var t = b[i] === -Infinity ? (isFinite(b[i + 1]) ? b[i + 1] - 1 : 0) : b[i + 1] === Infinity ? b[i] + 1 : (b[i] + b[i + 1]) / 2, sg = d.k > 0 ? 1 : -1;
      d.zs.forEach(function(z){ if (t < z[0] && z[1] % 2) sg = -sg; });
      out.push({ a:b[i], b:b[i + 1], aIn:false, bIn:false, s:sg });
    }
    return out;
  }
  function negSet(d){ return iv.norm(regions(d).filter(function(r){ return r.s < 0; })); }
  function posSet(d){ return iv.norm(regions(d).filter(function(r){ return r.s > 0; })); }
  function kSrc(k){ if (k === 1) return ""; if (k === -1) return "@a{-}"; var n = Math.round(k * 4), d = 4; while (d > 1 && n % 2 === 0) { n /= 2; d /= 2; } return "@a{" + (d === 1 ? String(n) : (n < 0 ? "-" : "") + "{" + Math.abs(n) + "}/{" + d + "}") + "}"; }
  function eqSrc(zs, k){ return "P(x) = " + (zs.length ? kSrc(k) + zs.map(function(z){ return ZP.factor(z[0], z[1]); }).join("") : "@a{" + num(k, 2) + "}"); }
  function ordered(zs){ var rank = function(z){ return z[0] === -1 ? 0 : z[0] === 2 ? 1 : 2; }; return zs.slice().sort(function(a, b){ return rank(a) - rank(b) || a[0] - b[0]; }); }
  function checks(d){
    var has = function(r){ return d.zs.some(function(z){ return z[0] === r; }); }, ord = function(r){ var z = d.zs.filter(function(q){ return q[0] === r; })[0]; return z ? z[1] : 0; };
    var others = d.zs.filter(function(z){ return z[0] !== -1 && z[0] !== 2; });
    return [has(-1) && has(2), ZP.deg(d.zs) === 4 && d.zs.length === 3,
      d.zs.length === 3 && ord(-1) === 1 && ord(2) === 1 && others.length === 1 && others[0][1] === 2,
      iv.text(negSet(d)) === iv.text([{ a:-1, b:2, aIn:false, bIn:false }]),
      Math.abs(p0(d) + 8) < 1e-9];
  }
  function draw(){
    var d = read(), cap = $("#tk-eq"); if (!plot) return;
    if (cap) cap.innerHTML = m(eqSrc(d.zs, d.k));
    var f = fOf(d), neg = negSet(d), pos = posSet(d), y0 = p0(d), view = fitView(d.zs, d.k, [y0]);
    var ink = css("--ink"), pts = d.zs.map(function(z){ return { x:z[0], y:0, r:4.5, color:ink }; });
    pts.push({ x:0, y:y0, r:5, color:ink, label:"(0, " + num(y0, 4) + ")" });
    var desc = "Graph of " + MV.plain(m(eqSrc(d.zs, d.k))) + ". P(0) = " + num(y0, 4) + ". Negative on " + iv.text(neg) + ", positive on " + iv.text(pos) + ".";
    plot.draw({ view:view, bands:neg.map(function(r){ return { x0:Math.max(view.xmin, r.a), x1:Math.min(view.xmax, r.b) }; }), curves:[{ f:f, color:css("--pen"), width:3, arrows:true }], points:pts, describe:desc });
    var regs = regions(d);
    var zx = d.zs.map(function(z){ return z[0]; }).concat([-1, 2]), L = Math.min.apply(null, zx) - 1, R = Math.max.apply(null, zx) + 1;
    nl.draw({ numberLine:{ min:L, max:R, pieces:neg },
      describe:"Sign strip for P(x) from " + num(L) + " to " + num(R) + ": " + regs.map(function(r){ return iv.text([r]) + (r.s > 0 ? " positive" : " negative"); }).join(", ") + (d.zs.length ? "; zero at " + d.zs.map(function(z){ return num(z[0]); }).join(", ") : "") + ".",
      after:function(ctx, pl){
        var cy = Math.round(pl.H * 0.5) + 0.5, band = Math.min(26, pl.H * 0.32);
        var u = pl.X(1) - pl.X(0), fm = pl.fontM || "serif";
        ctx.save(); ctx.font = "700 " + (u >= 26 ? 20 : 15) + "px " + fm; ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillStyle = ink;
        regs.forEach(function(r){ var lo = Math.max(L, r.a), hi = Math.min(R, r.b); if (hi <= lo) return; ctx.fillText(r.s > 0 ? "+" : MINUS, pl.X((lo + hi) / 2), cy - band / 2 - 2); });
        ctx.font = "700 " + (u >= 26 ? 15 : 12) + "px " + fm;   // a 0 above each zero, as in a sign chart
        d.zs.forEach(function(z){ ctx.fillText("0", pl.X(z[0]), cy - band / 2 - 3); });
        ctx.restore();
      } });
    var rd = $("#tk-read");
    if (rd) rd.innerHTML = MV.readoutHTML([["Negative on", m(iv.text(neg))], ["Positive on", m(iv.text(pos))], ["Remainder ÷ " + m("x"), m("P(0) = " + num(y0, 4))]]);
  }
  function refresh(){ draw(); api.update(); }
  function unkey(key){ var p = key.split("|"); return { zs:p[0] ? p[0].split(",").map(function(t){ var r = t.split(":"); return [+r[0], +r[1]]; }) : [], k:+p[1] }; }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<p class="tiny muted pt-how">' + a.content.how + '</p><h4 class="tk-h">Zeros</h4><div class="tk-zs"></div><div class="tk-k"></div>';
      pv.innerHTML = '<p class="eq-cap tk-eq" id="tk-eq" aria-live="polite"></p><div class="plot-wrap"><canvas class="plot" id="tk-plot" role="img" aria-label="Preview of your polynomial"></canvas></div>' +
        '<p class="tk-sl">Sign of ' + m("P(x)") + '</p><canvas class="plot nl tk-nl" id="tk-nl" role="img" aria-label="Sign strip"></canvas><dl class="read tk-read" id="tk-read" aria-live="polite"></dl>';
      zb = zeroSlots($(".tk-zs", inp), { uid:"tkz", slots:s.slots, min:-6, max:6, maxDeg:12, onChange:function(){ a.save(); refresh(); } });
      zb.paint();
      MV.sliders($(".tk-k", inp), [{ id:"tkk", label:m("@a{k}"), param:"a", min:-3, max:3, step:0.25, value:s.k, skip:[0], fmt:function(v){ return num(v, 2); } }],
        function(id, v){ s.k = v; a.save(); refresh(); });
      plot = new MV.Plot($("#tk-plot"), { xmin:-6, xmax:6, ymin:-10, ymax:10 }); plot.render = draw;
      nl = new MV.Plot($("#tk-nl")); nl.render = draw;
      draw();
    },
    read:read,
    valid:function(d){
      if (d.bad && d.bad.kind === "range") return "Zero " + (d.bad.i + 1) + ": use a whole number from −6 to 6.";
      if (d.bad && d.bad.kind === "dup") return "Zero " + (d.bad.i + 1) + " repeats zero " + (d.bad.j + 1) + ". To repeat a zero, use its order chip.";
      return true;
    },
    checks:checks,
    tips:function(d, c){
      var T = MV.C.task, out = [];
      if (!c[0]) out.push(T.tips[0]);
      if (!c[1]) out.push(fill(T.tips[1], { deg:ZP.deg(d.zs), n:d.zs.length }));
      if (!c[2]) out.push(T.tips[2]);
      if (!c[3]) out.push(fill(T.tipNow4, { neg:m(iv.text(negSet(d))) }) + " " + T.tips[3]);
      if (!c[4]) out.push(fill(T.tipNow5, { p0:m(num(p0(d), 4)) }) + " " + T.tips[4]);
      return out;
    },
    key:function(d){ return d.zs.slice().sort(function(p, q){ return p[0] - q[0]; }).map(function(z){ return z[0] + ":" + z[1]; }).join(",") + "|" + d.k; },
    label:function(key){ var u = unkey(key); return m(eqSrc(ordered(u.zs), u.k)); },
    text:function(key){ var u = unkey(key); return MV.plain(m(eqSrc(ordered(u.zs), u.k))); }
  };
})();

MV.module({
  hero:hero,
  activities:{ chains:chains, onepage:onePage, mx:mixed },
  task:task
});
})();
