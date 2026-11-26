// Page shell, router and progress (K3), goals (K4), warm-up / review diagnostic (K6, N16), predictions (K9),
// Explore target challenges, Part 3 quick check (K11), content blocks (word story, sentence to steal, …).
(function(){
"use strict";
var MV = window.MV, $ = MV.$, $$ = MV.$$;

// ---------- views ----------
MV.views = function(){
  var C = MV.C;
  if (C.kind === "review") return { list:["start", "connect", "mixed-practice", "reflect", "final-check"], names:{ start:"Start", connect:"Connect", "mixed-practice":"Mixed practice", reflect:"Reflect", "final-check":"Final Check" } };
  var p3 = C.part3 || {}, names = { start:"Start", explore:"Explore", practice:"Practice", reflect:"Reflect", "final-check":"Final Check" };
  names[p3.slug] = p3.name || MV.cap(p3.slug);
  return { list:["start", "explore", p3.slug, "practice", "reflect", "final-check"], names:names };
};
MV.isDone = function(v){ return v === "final-check" ? !!MV.S.final.submitted || !!MV.S.lastFinal : !!MV.S.done[v]; };

function continueLabel(next){
  if (next === "final-check") return "Continue to the Final Check";
  return "Continue to " + MV.V.names[next];
}
function nextRow(v){
  var i = MV.V.list.indexOf(v), n = MV.V.list[i + 1];
  return n ? '<div class="next-row"><button type="button" class="btn primary" data-continue="' + n + '">' + continueLabel(n) + "</button></div>" : "";
}
function blocksHTML(list, where){
  return (list || []).map(function(b, i){
    var id = b.id || (where + i);
    if (b.type === "write") {
      return '<div class="sheet mv-block" data-block="' + id + '">' + (b.title ? "<h3>" + b.title + "</h3>" : "") + (b.html || "") +
        '<div class="jq"><label for="w-' + id + '">' + (b.prompt || "Your turn") + '</label><textarea id="w-' + id + '" data-w="' + id + '" placeholder="' + MV.esc(MV.plain(b.placeholder || "")) + '"></textarea><div class="saved" id="w-' + id + '-saved" aria-live="polite"></div></div></div>';
    }
    return '<div class="sheet mv-block">' + (b.title ? "<h3>" + b.title + "</h3>" : "") + (b.html || "") + "</div>";
  }).join("");
}

// ---------- shell ----------
MV.renderShell = function(){
  var C = MV.C, M = MV.meta, V = MV.V, h = "";
  var sub = M.code + ", " + M.groupLabel + ": " + M.groupName + (M.trivium ? " · Trivium: " + M.trivium : "");
  h += '<header class="top"><div class="top-inner"><div class="top-row">' +
    '<a class="btn ghost sm home-link" href="index.html"><span aria-hidden="true">←</span><span class="home-t">&nbsp;Course home</span></a>' +
    '<div class="brand"><b>' + C.title + "</b><span>" + sub + "</span></div>" +
    '<div class="prog" aria-live="polite"><span class="prog-bar" aria-hidden="true"><i id="prog-fill"></i></span><span id="prog-text" class="prog-text">0 of ' + V.list.length + " parts done</span></div>" +
    '<div class="hd-btns"><button type="button" class="btn sm" id="open-fc"><span class="fc-long">Flashcards</span><span class="fc-short" aria-hidden="true">Cards</span></button>' +
    '<button type="button" class="btn ghost sm theme-btn" id="theme-btn"></button></div>' +
    '</div><nav class="steps" id="steps" aria-label="Module parts"></nav></div></header>' +
    '<div class="save-off" id="save-off" hidden><p>Saving is turned off in this browser, so your work will be lost when you close this page.</p></div>';
  h += '<main><noscript><p class="sheet">This module needs JavaScript turned on to work.</p></noscript>';
  // START
  var hero = C.hero || {}, fig = hero.fig;
  h += '<section class="view" data-view="start" aria-labelledby="h-start"><div class="hero' + (fig ? "" : " solo") + '"><div>' +
    (hero.eq ? '<p class="hero-eq' + (hero.eqSize ? " " + hero.eqSize : "") + '"' + (hero.eqLabel ? ' aria-label="' + MV.esc(hero.eqLabel) + '"' : "") + ">" + hero.eq + "</p>" : "") +
    '<h1 id="h-start">' + (hero.headline || C.title) + "</h1>" + (hero.text ? "<p>" + hero.text + "</p>" : "") +
    '<p class="muted">' + (hero.muted || ("Work through the " + (C.kind === "review" ? "five" : "six") + " parts in order. Your answers save on this device as you go, so you can stop and come back later.")) + "</p></div>";
  if (fig) h += '<figure class="hero-fig">' + (fig.html || ('<canvas class="plot' + (fig.shape ? " " + fig.shape : "") + '" id="hero-plot" role="img" aria-label="' + MV.esc(fig.aria || "") + '"></canvas>')) + '<figcaption id="hero-cap">' + (fig.caption || "") + "</figcaption></figure>";
  h += "</div>";
  h += blocksHTML(C.start && C.start.blocks, "sb");
  h += '<div class="sheet"><h2>' + (C.kind === "review" ? "Your chapter goals" : "Your learning goals") + "</h2><p>Rate yourself honestly before you start. You’ll rate yourself again near the end to see how far you’ve come.</p><div id=\"goals-start\"></div></div>";
  var W = MV.warmCfg();
  h += '<div class="sheet"><h2>' + (W.title) + "</h2><p>" + W.intro + '</p><div id="warmup"></div><div id="warmup-result"></div></div>';
  h += blocksHTML(C.start && C.start.blocksAfter, "sa");
  h += nextRow("start") + "</section>";
  if (C.kind === "review") {
    var cn = C.connect || {};
    h += '<section class="view" data-view="connect" aria-labelledby="h-connect" hidden><div class="intro"><h2 id="h-connect">' + (cn.heading || "Connect the ideas") + "</h2>" + (cn.intro ? "<p>" + cn.intro + "</p>" : "") + '</div>' + (MV.APP.connect ? '<div class="sheet"><div id="connect-app"></div></div>' : "") + MV.activitySheets(cn.activities || []) + blocksHTML(cn.blocks, "cb") + nextRow("connect") + "</section>";
    var mx = C.mixed || {};
    h += '<section class="view" data-view="mixed-practice" aria-labelledby="h-mixed" hidden><div class="intro"><h2 id="h-mixed">' + (mx.heading || "Mixed practice") + "</h2><p>" + (mx.intro || "Problems from every topic in the chapter, mixed together. Each one has three levels of help: a small hint, a bigger hint, then the worked solution. Use only as much as you need.") + "</p></div>" + MV.activitySheets(mx.activities || []) + nextRow("mixed-practice") + "</section>";
  } else {
    var ex = C.explore || {};
    h += '<section class="view" data-view="explore" aria-labelledby="h-explore" hidden><div class="intro"><h2 id="h-explore">' + (ex.heading || "Explore") + "</h2>" + (ex.intro ? "<p>" + ex.intro + "</p>" : "") + "</div>" +
      '<div class="sheet"><div id="ex-app"></div>' +
      ((ex.predictions || []).length ? '<div class="part"><h3>Predict, then reveal</h3><p class="muted">' + (ex.predIntro || "Make a prediction first. Then the centrepiece will show you what really happens.") + '</p><div id="pred"></div></div>' : "") +
      ((ex.challenges || []).length ? '<div class="part"><h3>Target challenges</h3><p class="muted">' + (ex.chalIntro || "Use the centrepiece to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.") + '</p><div id="chal"></div></div>' : "") +
      "</div>" + blocksHTML(ex.blocks, "eb") + nextRow("explore") + "</section>";
    var p3 = C.part3 || {};
    h += '<section class="view" data-view="' + p3.slug + '" aria-labelledby="h-p3" hidden><div class="intro"><h2 id="h-p3">' + (p3.heading || p3.name) + "</h2>" + (p3.intro ? "<p>" + p3.intro + "</p>" : "") + "</div>" +
      '<div class="sheet"><div id="p3-app"></div>' +
      (p3.blocks || []).map(function(b){ return '<div class="part">' + (b.title ? "<h3>" + b.title + "</h3>" : "") + b.html + "</div>"; }).join("") +
      (p3.quickCheck ? '<div class="part"><h3>' + (p3.quickCheck.title || "Quick check") + "</h3>" + (p3.quickCheck.intro ? '<p class="muted">' + p3.quickCheck.intro + "</p>" : "") + '<div id="qc"></div></div>' : "") +
      "</div>" + blocksHTML(p3.blocksAfter, "pb") + nextRow(p3.slug) + "</section>";
    var pr = C.practice || {};
    h += '<section class="view" data-view="practice" aria-labelledby="h-prac" hidden><div class="intro"><h2 id="h-prac">Practice</h2><p>' + (pr.intro || "Three challenges. If you get stuck, each one has three levels of help: a small hint, a bigger hint, then the worked solution. Use only as much as you need.") + "</p></div>" + MV.activitySheets(pr.activities || []) + nextRow("practice") + "</section>";
  }
  var rf = C.reflect || {};
  h += '<section class="view" data-view="reflect" aria-labelledby="h-ref" hidden><div class="intro"><h2 id="h-ref">Reflect</h2><p>' + (rf.intro || "Before the Final Check, take stock. Writing about your thinking helps it stick.") + "</p></div>" +
    blocksHTML(rf.blocks, "rb") +
    '<div class="sheet"><h3>' + (rf.journalTitle || "Your journal") + '</h3><p class="muted">Your answers save automatically. Only you can see them, on this device.</p><div id="journal"></div></div>' +
    (rf.art ? '<div class="sheet" id="art-sheet"><h3>Add a principle to My Art of Language</h3><div id="art"></div></div>' : "") +
    '<div class="sheet"><h3>Sure, but wrong?</h3><p class="muted">These are the ' + (C.kind === "review" ? "diagnostic" : "warm-up") + ' questions where you felt sure but got the answer wrong. They’re the most useful ones to review.</p><div id="conf-review"></div></div>' +
    '<div class="sheet"><h3>Rate your learning goals again</h3><p class="muted">Compare with how you rated yourself at the start.</p><div id="goals-end"></div></div>' +
    nextRow("reflect") + "</section>";
  var fc = C.final || {}, nQ = (fc.questions || []).length;
  h += '<section class="view" data-view="final-check" aria-labelledby="h-final" hidden><div class="intro"><h2 id="h-final">Final Check</h2><p>' + (fc.intro || ("This shows what you’ve learned, so there are no hints here. Answer all " + nQ + " questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category.")) + "</p></div>" +
    '<div class="sheet"><div id="final-qs"></div><div id="final-ctl"></div></div>' +
    (C.task ? '<div class="sheet" id="task-sheet"><h3>' + C.task.title + '</h3><div id="task"></div></div>' : "") +
    '<div class="sheet" id="summary-sheet"><h3>Results summary</h3><div id="summary"></div></div></section>';
  h += "</main>";
  h += '<footer class="foot"><span>Your work is saved in this browser only. It isn’t sent anywhere.</span><button type="button" class="linkbtn" id="reset">Start over (clears your saved work)</button></footer>';
  h += '<dialog class="fc" id="fc" aria-labelledby="fc-title"><div class="fc-top"><h2 id="fc-title">Flashcards</h2><button type="button" class="btn ghost sm" data-fc="close">Close</button></div>' +
    '<div class="fc-stage"><button type="button" class="card" id="fc-card" aria-describedby="fc-hint"><span class="face front" id="fc-front"></span><span class="face back" id="fc-back"></span></button></div>' +
    '<p class="tiny muted" id="fc-hint" style="text-align:center;margin:10px 0 0">Tap the card to flip it.</p><div class="fc-nav"><button type="button" class="btn ghost sm" data-fc="prev">Previous</button><span id="fc-count" class="tiny" aria-live="polite"></span><button type="button" class="btn ghost sm" data-fc="shuffle">Shuffle</button><button type="button" class="btn primary sm" data-fc="next">Next</button></div></dialog>';
  document.getElementById("mv-root").innerHTML = h;
};

// ---------- router ----------
var current = "start";
MV.current = function(){ return current; };
MV.paintSteps = function(){
  var V = MV.V;
  $("#steps").innerHTML = V.list.map(function(v, i){
    var d = MV.isDone(v);
    return '<button type="button" class="step' + (d ? " done" : "") + '" data-view="' + v + '"' + (v === current ? ' aria-current="step"' : "") + '><span class="num" aria-hidden="true">' + (d ? "✓" : (i + 1)) + "</span>" + V.names[v] + (d ? '<span class="vh"> (done)</span>' : "") + "</button>";
  }).join("");
  var n = V.list.filter(MV.isDone).length;
  $("#prog-fill").style.width = (n / V.list.length * 100) + "%";
  $("#prog-text").textContent = n + " of " + V.list.length + " parts done";
};
MV.show = function(v, scroll){
  if (MV.V.list.indexOf(v) < 0) v = "start";
  current = v; MV.S.last = v; MV.save();
  $$(".view").forEach(function(s){ s.hidden = s.dataset.view !== v; });
  MV.paintSteps();
  if (v === "reflect") { MV.paintConfReview(); MV.paintGoals("goals-end", "rate1", "rate0"); }
  if (v === "final-check") MV.paintSummary();
  var sec = $('.view[data-view="' + v + '"]');
  requestAnimationFrame(function(){ MV.redrawAll(); MV.drawFigs(sec); });
  if (MV.APP.onShow) try { MV.APP.onShow(v); } catch (e) { console.error(e); }
  if (scroll !== false) window.scrollTo(0, 0);
  var stepBtn = $('.step[data-view="' + v + '"]'); if (stepBtn && stepBtn.scrollIntoView) stepBtn.scrollIntoView({ block:"nearest", inline:"nearest" });
};
MV.go = function(v){ if (location.hash.slice(1) === v) MV.show(v); else location.hash = v; };
MV.initRouter = function(){
  $("#steps").addEventListener("click", function(e){ var b = e.target.closest("[data-view]"); if (b) MV.go(b.dataset.view); });
  document.addEventListener("click", function(e){ var b = e.target.closest("[data-continue]"); if (!b) return; MV.S.done[current] = true; MV.save(); MV.go(b.dataset.continue); });
  window.addEventListener("hashchange", function(){ MV.show(location.hash.slice(1)); });
};

// ---------- goals (K4) ----------
MV.paintGoals = function(hostId, key, cmpKey){
  var host = document.getElementById(hostId), G = MV.C.goals, S = MV.S;
  MV.keepFocus(host, function(){
    host.innerHTML = G.map(function(g, gi){
      var cur = S[key][gi];
      var was = (cmpKey && S[cmpKey][gi] != null) ? '<p class="was tiny muted">At the start you chose: <strong>' + MV.RATE[S[cmpKey][gi]] + "</strong></p>" : "";
      return '<div class="goal"><p class="goal-t">' + g + '</p><div class="rate" role="radiogroup" aria-label="' + MV.esc(MV.plain(g)) + '">' +
        MV.RATE.map(function(r, ri){ return '<button type="button" role="radio" aria-checked="' + (cur === ri) + '" class="rbtn' + (cur === ri ? " on" : "") + '" data-k="' + key + gi + "-" + ri + '" data-g="' + gi + '" data-r="' + ri + '">' + r + "</button>"; }).join("") +
        "</div>" + was + "</div>";
    }).join("");
  });
};
function goalClicks(hostId, key, cmpKey){
  var host = document.getElementById(hostId);
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-r]"); if (!b) return;
    MV.S[key][+b.dataset.g] = +b.dataset.r; MV.save(); MV.paintGoals(hostId, key, cmpKey);
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-r]"); if (!b) return;
    var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0; if (!d) return;
    e.preventDefault(); var r = Math.max(0, Math.min(3, +b.dataset.r + d)); MV.S[key][+b.dataset.g] = r; MV.save(); MV.paintGoals(hostId, key, cmpKey);
    var nb = host.querySelector('[data-g="' + b.dataset.g + '"][data-r="' + r + '"]'); if (nb) nb.focus();
  });
}
MV.initGoals = function(){ goalClicks("goals-start", "rate0"); goalClicks("goals-end", "rate1", "rate0"); MV.paintGoals("goals-start", "rate0"); };

// ---------- warm-up / diagnostic (K6, N16) ----------
MV.warmCfg = function(){
  var C = MV.C, rev = C.kind === "review", w = (rev ? C.start.diagnostic : C.start.warmup) || { questions:[] };
  return { rev:rev, list:w.questions || [], refresh:w.refreshers || {},
    title:w.title || (rev ? "Diagnostic: where do I stand?" : "What do I already know?"),
    intro:w.intro || (rev ? "One or two questions from each topic in the chapter. Pick an answer, say how sure you are, then check it. Your results show which modules to revisit." : "Six quick questions on skills from earlier courses. Pick an answer, say how sure you are, then check it. Stuck? Use the hint button."),
    ready:w.ready, cfg:w };
};
MV.topicMod = function(nn){ var mm = (MV.course.modules || []).filter(function(x){ return x.nn === String(nn); })[0]; return mm || { nn:String(nn), slug:"", title:"Module " + nn }; };
MV.topicLabel = function(nn){ return nn ? "Module " + nn : ""; };
MV.revisitLink = function(nn){ var mm = MV.topicMod(nn); return mm.slug ? '<a href="' + mm.nn + "-" + mm.slug + '.html">Revisit module ' + mm.nn + "</a>" : "Revisit module " + nn; };
function paintWarmQ(q, i){
  var box = $('[data-q="' + q.id + '"]'), st = MV.S.warm[q.id] || (MV.S.warm[q.id] = {});
  MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(q, st, { mode:"instant", locked:!!st.checked, showFb:!!st.checked, num:i + 1, topicLabel:MV.warmCfg().rev ? MV.topicLabel(q.topic) : "" }); });
}
MV.renderWarm = function(){
  var W = MV.warmCfg();
  $("#warmup").innerHTML = W.list.map(function(q){ return '<div class="q" data-q="' + q.id + '"></div>'; }).join("");
  W.list.forEach(paintWarmQ); MV.paintWarmResult();
};
MV.warmStats = function(){
  var W = MV.warmCfg(), S = MV.S;
  var checked = W.list.filter(function(q){ return S.warm[q.id] && S.warm[q.id].checked; });
  var score = checked.filter(function(q){ return S.warm[q.id].correct; }).length;
  var withSol = checked.filter(function(q){ return !S.warm[q.id].correct && S.warm[q.id].okAny; }).length;
  return { total:W.list.length, checked:checked.length, score:score, withSol:withSol };
};
MV.paintWarmResult = function(){
  var host = $("#warmup-result"), W = MV.warmCfg(), S = MV.S, ws = MV.warmStats();
  if (ws.checked < ws.total) { host.innerHTML = '<p class="tiny muted" style="margin-top:12px">' + ws.checked + " of " + ws.total + " answered.</p>"; return; }
  var frac = ws.score / ws.total;
  var msg = frac >= 5 / 6 - 1e-9 ? (W.ready || ("You’re ready for " + (MV.C.readyTopic || MV.C.title.toLowerCase()) + ".")) : frac >= 0.5 ? "Good start. Read the refresher notes below before you move on." : "Spend a few minutes on the refresher notes below first. They’ll make the rest of the module much easier.";
  if (W.rev) msg = frac >= 5 / 6 - 1e-9 ? (W.ready || "You’re in good shape for this review. Use it to sharpen the details.") : frac >= 0.5 ? "Good start. The table below shows which modules to revisit." : "Use the table below: revisit the modules marked before you go further.";
  var h = '<div class="result"><p class="big-score">' + ws.score + " / " + ws.total + "</p>" + (ws.withSol ? '<p class="tiny muted">(' + ws.withSol + " more correct with the worked solution)</p>" : "") + "<p>" + msg + "</p>";
  if (W.rev) {
    var topics = [];
    W.list.forEach(function(q){ if (topics.indexOf(q.topic) < 0) topics.push(q.topic); });
    h += '<table class="topic-tbl"><thead><tr><th scope="col">Topic</th><th scope="col">Right</th><th scope="col">Next step</th></tr></thead><tbody>' + topics.map(function(t){
      var qs = W.list.filter(function(q){ return q.topic === t; }), r = qs.filter(function(q){ return S.warm[q.id].correct; }).length, mm = MV.topicMod(t);
      return "<tr><td>" + mm.nn + ". " + mm.title + "</td><td>" + r + "/" + qs.length + "</td><td>" + (r < qs.length ? MV.revisitLink(t) : "✓ Solid") + "</td></tr>";
    }).join("") + "</tbody></table>";
  }
  var missed = [];
  W.list.forEach(function(q){ if (!S.warm[q.id].correct && q.skill && missed.indexOf(q.skill) < 0) missed.push(q.skill); });
  h += missed.filter(function(sk){ return W.refresh[sk]; }).map(function(sk){ return '<div class="refresh"><h4>Refresher: ' + sk + "</h4><p>" + W.refresh[sk] + "</p></div>"; }).join("");
  host.innerHTML = h + "</div>";
};
MV.initWarm = function(){
  $("#warmup").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-q]"); if (!box) return;
    var W = MV.warmCfg(), q = W.list.filter(function(x){ return x.id === box.dataset.q; })[0], i = W.list.indexOf(q), st = MV.S.warm[q.id];
    var act = b.dataset.act;
    if (b.dataset.i != null) st.choice = +b.dataset.i;
    else if (b.dataset.conf) st.conf = b.dataset.conf;
    else if (act === "hint") st.hint = Math.min(3, (st.hint || 0) + 1);
    else if (act === "check") {
      if (st.choice == null || !st.conf) return;
      st.checked = true; st.okAny = MV.ok(q.options[st.choice]); st.usedSol = (st.hint || 0) >= 3;
      st.correct = st.okAny && !st.usedSol;
    }
    MV.save(); paintWarmQ(q, i);
    if (act === "check") { MV.paintWarmResult(); MV.focusFb(box); }
  });
  MV.renderWarm();
};

// ---------- blocks with writing boxes (sentence to steal etc.) ----------
MV.initWrites = function(){
  var timers = {};
  $$("textarea[data-w]").forEach(function(t){ t.value = MV.S.writes[t.dataset.w] || ""; });
  document.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.w) return;
    MV.S.writes[t.dataset.w] = t.value; clearTimeout(timers[t.dataset.w]);
    timers[t.dataset.w] = setTimeout(function(){ MV.save(); var s = document.getElementById("w-" + t.dataset.w + "-saved"); if (s) s.textContent = "Saved"; }, 400);
  });
};

// ---------- Explore: predictions (K9) ----------
var predI = 0, predBusy = false;
function bannerEl(){ return $("#ex-app [data-mv=banner]") || $("#ex-banner"); }
MV.banner = function(kind, text){ var b = bannerEl(); if (!b) return; b.className = "banner" + (kind ? " " + kind : ""); b.textContent = text || ""; };
function predPaint(){
  var P = MV.C.explore.predictions, p = P[predI], st = MV.S.preds[p.id], host = $("#pred"), rightI = MV.right(p.options);
  var h = '<div class="pred-top"><span class="tiny muted">Prediction ' + (predI + 1) + " of " + P.length + '</span><span class="dots" aria-hidden="true">' + P.map(function(q, i){ return '<span class="dot' + (MV.S.preds[q.id] ? " done" : "") + (i === predI ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
  h += '<p class="pred-q">' + p.prompt + '</p><div class="opts">' + p.options.map(function(o, i){
    var c = "opt";
    if (st && !predBusy) { if (i === rightI) c += " right"; else if (st.choice === i) c += " wrong"; }
    else if (st && st.choice === i) c += " picked";
    return '<button type="button" class="' + c + '" data-k="pr' + p.id + i + '" data-i="' + i + '"' + (st || predBusy ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>";
  }).join("") + "</div>";
  if (predBusy) h += '<p class="fb" role="status">Watch what happens…</p>';
  else if (st) h += '<div class="fb ' + (st.correct ? "good" : "bad") + '" role="status"><p><strong>' + (st.correct ? "✓ Your prediction was right." : "✗ That’s not what happened.") + "</strong> " + p.explain + "</p></div>";
  h += '<div class="q-actions">';
  if (st && !predBusy) h += '<button type="button" class="btn ghost sm" data-act="replay" data-k="prreplay">Replay it</button>';
  h += '<button type="button" class="btn ghost sm" data-act="prev" data-k="prprev"' + (predI === 0 || predBusy ? " disabled" : "") + ">Previous</button>";
  h += '<button type="button" class="btn ' + (st ? "primary" : "ghost") + ' sm" data-act="next" data-k="prnext"' + (predI === P.length - 1 || predBusy ? " disabled" : "") + ">Next prediction</button></div>";
  MV.keepFocus(host, function(){ host.innerHTML = h; });
}
function predRun(p){
  var hooks = (MV.EX && MV.EX.predict) || {};
  predBusy = true;
  try { if (hooks.start) hooks.start(p); } catch (e) { console.error(e); }
  predPaint();
  var st = MV.S.preds[p.id];
  MV.banner("", "Watch what happens…");
  var g = $("#ex-app [data-mv=graph]") || $("#ex-app"), r = g.getBoundingClientRect();
  if (r.top < 120 || r.bottom > window.innerHeight) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  var finished = false;
  var finish = function(){
    if (finished) return; finished = true;
    predBusy = false;
    MV.banner(st.correct ? "good" : "bad", st.correct ? "✓ Just as you predicted." : "✗ Different from your prediction. Read why below.");
    predPaint(); MV.focusFb($("#pred"));
  };
  MV.wait(MV.reduceMotion ? 50 : 700, function(){
    try { if (hooks.run) hooks.run(p, finish); else finish(); } catch (e) { console.error(e); finish(); }
  });
}
MV.initPredictions = function(){
  var P = (MV.C.explore || {}).predictions || [];
  if (!P.length) return;
  for (var i = 0; i < P.length; i++) { if (!MV.S.preds[P[i].id]) { predI = i; break; } }
  $("#pred").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || predBusy) return;
    var p = P[predI];
    if (b.dataset.i != null) { var k = +b.dataset.i; MV.S.preds[p.id] = { choice:k, correct:MV.ok(p.options[k]) }; MV.save(); predRun(p); }
    else if (b.dataset.act === "replay") predRun(p);
    else if (b.dataset.act === "prev") { predI = Math.max(0, predI - 1); MV.banner("", ""); predPaint(); }
    else if (b.dataset.act === "next") { predI = Math.min(P.length - 1, predI + 1); MV.banner("", ""); predPaint(); }
  });
  predPaint();
};

// ---------- Explore: target challenges ----------
function chalState(id){ return MV.S.chal[id] || (MV.S.chal[id] = { tries:0, hint:0, solved:false, first:null }); }
var chalMsg = {};
function chalPaint(){
  var host = $("#chal"), T = MV.C.explore.challenges;
  MV.keepFocus(host, function(){
    host.innerHTML = T.map(function(c, i){
      var st = chalState(c.id), h = '<div class="chal" data-c="' + c.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + c.prompt + "</div>" + (c.stretch ? '<span class="tag">Stretch</span>' : "") + "</div>";
      if (st.solved) h += '<div class="fb good" role="status"><p><strong>✓ Challenge met.</strong> ' + (c.why || "") + (st.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else {
        h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + c.id + 'chk">Check challenge</button>' + MV.hintBtn(c.id + "hint", st.hint) + "</div>" + MV.hintsHTML(c.hints, st.hint);
        h += '<p class="live" data-live="' + c.id + '"></p>';
        if (chalMsg[c.id]) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + chalMsg[c.id] + "</p></div>";
      }
      return h + "</div>";
    }).join("");
  });
  MV.liveChallenges();
}
MV.liveChallenges = function(){
  var check = MV.EX && MV.EX.challenge; if (!check) return;
  $$("[data-live]").forEach(function(p){
    var r = null; try { r = check(p.dataset.live, { live:true }); } catch (e) {}
    p.textContent = (r && r.ok) ? "✓ Goal met. Press Check challenge to record it." : "";
  });
};
MV.initChallenges = function(){
  var T = (MV.C.explore || {}).challenges || [];
  if (!T.length) return;
  $("#chal").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-c]"), c = T.filter(function(x){ return x.id === box.dataset.c; })[0], st = chalState(c.id);
    if (b.dataset.act === "hint") { st.hint = Math.min(3, st.hint + 1); MV.save(); chalPaint(); return; }
    if (b.dataset.act === "check") {
      var r = { ok:false };
      try { r = (MV.EX && MV.EX.challenge) ? (MV.EX.challenge(c.id, { live:false }) || { ok:false }) : { ok:false }; } catch (err) { console.error(err); }
      if (r.ok) { st.solved = true; st.first = st.tries === 0 && st.hint < 3; chalMsg[c.id] = null; }
      else { st.tries++; chalMsg[c.id] = r.msg || c.general || "That doesn’t meet the goal yet. Read the challenge again and adjust the centrepiece."; }
      MV.save(); chalPaint(); MV.focusFb($('#chal [data-c="' + c.id + '"]'));
    }
  });
  chalPaint();
};
MV.chalStats = function(){
  var T = ((MV.C.explore || {}).challenges) || [];
  return { total:T.length, first:T.filter(function(c){ return chalState(c.id).first === true; }).length, solved:T.filter(function(c){ return chalState(c.id).solved; }).length };
};
// App calls this after any centrepiece change (keeps the live ✓ in step).
MV.changed = function(){ MV.liveChallenges(); if (MV._taskUpdate) { /* task updates itself */ } };

// ---------- Part 3 quick check (K11) ----------
function qcStore(){ var k = (MV.C.part3.quickCheck.store || "qc"); return MV.S[k] || (MV.S[k] = {}); }
function qcPaint(){
  var host = $("#qc"), items = MV.C.part3.quickCheck.items, store = qcStore();
  MV.keepFocus(host, function(){
    host.innerHTML = items.map(function(q){
      var st = store[q.id] || {}, ri = MV.right(q.choices), fb = "", done = st.last === ri;
      if (st.last != null) {
        var ch = q.choices[st.last], good = st.last === ri, txt = ch.fb || (good ? q.right : q.wrong) || "";
        var pre = /^(✓|✗|Right|Not quite|Correct)/.test(MV.plain(txt)) ? "" : (good ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ");
        fb = '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p>' + pre + txt + "</p></div>";
      }
      return '<div class="sq" data-sq="' + q.id + '"><div class="sq-p">' + q.prompt + '</div><div class="sq-c" role="group" aria-label="Choices">' + q.choices.map(function(c, i){
        return '<button type="button" class="chip' + (st.last === i ? " on" : "") + '" aria-pressed="' + (st.last === i) + '" data-k="' + q.id + "c" + i + '" data-ci="' + i + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>";
      }).join("") + "</div>" + fb + "</div>";
    }).join("");
  });
}
MV.initQuickCheck = function(){
  var p3 = MV.C.part3; if (!p3 || !p3.quickCheck) return;
  var items = p3.quickCheck.items;
  $("#qc").addEventListener("click", function(e){
    var b = e.target.closest("[data-ci]"); if (!b || b.disabled) return;
    var box = b.closest("[data-sq]"), q = items.filter(function(x){ return x.id === box.dataset.sq; })[0], store = qcStore(), st = store[q.id] || (store[q.id] = { tries:0 });
    var ri = MV.right(q.choices);
    st.tries = (st.tries || 0) + 1; st.last = +b.dataset.ci;
    if (st.last === ri && st.first == null) st.first = st.tries === 1;
    if (st.last !== ri) st.first = false;
    MV.save(); qcPaint(); MV.focusFb($('[data-sq="' + q.id + '"]'));
  });
  qcPaint();
};
MV.qcStats = function(){
  var p3 = MV.C.part3; if (!p3 || !p3.quickCheck) return null;
  var items = p3.quickCheck.items, store = qcStore();
  return { total:items.length, done:items.filter(function(q){ return store[q.id] && store[q.id].first != null; }).length, first:items.filter(function(q){ return store[q.id] && store[q.id].first === true; }).length,
    missed:items.filter(function(q){ return store[q.id] && store[q.id].first === false; }) };
};
})();
