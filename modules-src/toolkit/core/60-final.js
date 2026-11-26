// Journal (K14), Sure-but-wrong (K15), Art of Language notebook (ENG4U E16), Final Check with version B and
// attempt history (K16), performance task frame (K17), results summary (K18), flashcards (K19), start over (K20),
// progress record (N2).
(function(){
"use strict";
var MV = window.MV, $ = MV.$;

// ---------- journal ----------
MV.initJournal = function(){
  var J = (MV.C.reflect || {}).journal || [], host = $("#journal"), timers = {};
  host.innerHTML = J.map(function(j){ return '<div class="jq"><label for="' + j.id + '">' + j.q + '</label><textarea id="' + j.id + '" data-j="' + j.id + '"></textarea><div class="saved" id="' + j.id + '-saved" aria-live="polite"></div></div>'; }).join("");
  J.forEach(function(j){ document.getElementById(j.id).value = MV.S.journal[j.id] || ""; });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset.j) return;
    MV.S.journal[t.dataset.j] = t.value; clearTimeout(timers[t.dataset.j]);
    timers[t.dataset.j] = setTimeout(function(){ MV.save(); document.getElementById(t.dataset.j + "-saved").textContent = "Saved"; }, 400);
  });
};

// ---------- Sure, but wrong? ----------
function confWrongList(list, store, opts){
  return list.filter(function(q){ var st = store[q.id]; if (!st || st.choice == null) return false; var o = (opts ? opts(q) : q.options); return (st.conf === "very" || st.conf === "fair") && !MV.ok(o[st.choice]); });
}
MV.confWrongList = confWrongList;
MV.paintConfReview = function(){
  var host = $("#conf-review"), W = MV.warmCfg(), S = MV.S, checked = W.list.filter(function(q){ return S.warm[q.id] && S.warm[q.id].checked; });
  if (!checked.length) { host.innerHTML = '<p class="fb">Answer the ' + (W.rev ? "diagnostic" : "warm-up") + " questions in Start first, then come back here.</p>"; return; }
  var wrong = confWrongList(checked, S.warm);
  var very = checked.filter(function(q){ return S.warm[q.id].conf === "very"; }), vr = very.filter(function(q){ return MV.ok(q.options[S.warm[q.id].choice]); }).length;
  var h = very.length ? "<p>When you said <strong>Very sure</strong>, you were right <strong>" + vr + " of " + very.length + "</strong> times.</p>" : "";
  if (!wrong.length) h += '<div class="fb good"><p><strong>Nothing here.</strong> Whenever you felt sure, you were right. Your sense of what you know is accurate.</p></div>';
  else h += wrong.map(function(q){ var st = S.warm[q.id], right = q.options[MV.right(q.options)]; return '<div class="cw"><p style="margin-bottom:.3em"><strong>' + q.prompt + '</strong></p><p class="tiny muted" style="margin-bottom:.3em">You answered ' + q.options[st.choice].t + " and felt " + (st.conf === "very" ? "very sure" : "fairly sure") + '.</p><p style="margin:0">The answer is ' + right.t + ". " + (right.why || "") + "</p></div>"; }).join("");
  host.innerHTML = h;
  MV.drawFigs(host);
};

// ---------- ENG4U: My Art of Language (E16, shared record eng4u-art-v1) ----------
MV.ART_KEY = "eng4u-art-v1";
MV.artRead = function(){ try { return JSON.parse(localStorage.getItem(MV.ART_KEY)) || { v:1, principles:{}, commonplace:[] }; } catch (e) { return { v:1, principles:{}, commonplace:[] }; } };
MV.artWrite = function(rec){ try { localStorage.setItem(MV.ART_KEY, JSON.stringify(rec)); } catch (e) {} };
MV.artDone = function(){ var A = (MV.C.reflect || {}).art; if (!A || A.required === false) return true; var w = MV.S.writes; return !!((w["art-principle"] || "").trim() && (w["art-example"] || "").trim() && (w["art-imitation"] || "").trim()); };
MV.initArt = function(){
  var A = (MV.C.reflect || {}).art; if (!A) return;
  var host = $("#art"), w = MV.S.writes, timer = null;
  host.innerHTML = '<p class="muted">' + (A.intro || "Write one craft principle you learned here, in your own words. Add the master’s example that shows it, then your own sentence that uses it. It goes into your Art of Language on the course home page.") + "</p>" +
    '<div class="jq"><label for="art-p">Principle (your own words)</label><textarea id="art-p" data-art="art-principle" placeholder="' + MV.esc(MV.plain(A.placeholder || "e.g. Put the word you want remembered at the end of the sentence.")) + '"></textarea></div>' +
    '<div class="jq"><label for="art-e">The master’s example</label>' + (A.examples ? '<div class="chips" role="group" aria-label="Choose an example">' + A.examples.map(function(x, i){ return '<button type="button" class="chip" data-artx="' + i + '" data-k="artx' + i + '">' + x + "</button>"; }).join("") + "</div>" : "") + '<textarea id="art-e" data-art="art-example"></textarea></div>' +
    '<div class="jq"><label for="art-i">My imitation</label><textarea id="art-i" data-art="art-imitation"></textarea><div class="saved" id="art-saved" aria-live="polite"></div></div>';
  ["art-p", "art-e", "art-i"].forEach(function(id){ var t = document.getElementById(id); t.value = w[t.dataset.art] || ""; });
  function store(){
    var rec = MV.artRead(); rec.principles = rec.principles || {};
    rec.principles[MV.meta.id] = { title:MV.C.title, nn:MV.meta.nn, trivium:MV.meta.trivium || "", principle:w["art-principle"] || "", example:w["art-example"] || "", imitation:w["art-imitation"] || "", updated:new Date().toISOString() };
    MV.artWrite(rec);
  }
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset.art) return; w[t.dataset.art] = t.value; clearTimeout(timer);
    timer = setTimeout(function(){ MV.save(); store(); $("#art-saved").textContent = "Saved to My Art of Language"; MV.paintFinalCtl(); }, 400);
  });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-artx]"); if (!b) return; var t = document.getElementById("art-e"); t.value = MV.plain(A.examples[+b.dataset.artx]); w["art-example"] = t.value; MV.save(); store(); MV.paintFinalCtl(); });
};

// ---------- Final Check (K16) ----------
function FQ(){ return MV.C.final.questions; }
function ver(){ return MV.S.final.ver === "b" ? "b" : "a"; }
MV.finalQ = function(q, v){ var x = q[v || ver()] || q.a || q; return { id:q.id, cat:q.cat, goal:q.goal, topic:q.topic, prompt:x.prompt, options:x.options, use:x.use }; };
function paintFinalQ(q, i){
  var box = $('[data-fq="' + q.id + '"]'), st = MV.S.final.q[q.id] || (MV.S.final.q[q.id] = {});
  MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(MV.finalQ(q), st, { mode:"deferred", locked:!!MV.S.final.submitted, showFb:!!MV.S.final.submitted, num:i + 1, topicLabel:MV.C.kind === "review" ? MV.topicLabel(q.topic) : "" }); });
}
MV.renderFinal = function(){
  $("#final-qs").innerHTML = '<p class="tiny muted" style="margin:0">Version ' + ver().toUpperCase() + (MV.S.history.attempts ? " · attempt " + (MV.S.history.attempts + (MV.S.final.submitted ? 0 : 1)) : "") + "</p>" + FQ().map(function(q){ return '<div class="q" data-fq="' + q.id + '"></div>'; }).join("");
  FQ().forEach(paintFinalQ); MV.paintFinalCtl();
};
MV.finalStats = function(){
  var by = { K:[0, 0], T:[0, 0], C:[0, 0], A:[0, 0] }, score = 0, topics = {};
  FQ().forEach(function(q){
    var st = MV.S.final.q[q.id] || {}, fq = MV.finalQ(q), ok = st.choice != null && MV.ok(fq.options[st.choice]);
    by[q.cat][1]++; if (ok) { by[q.cat][0]++; score++; }
    if (q.topic) { var t = topics[q.topic] || (topics[q.topic] = [0, 0]); t[1]++; if (ok) t[0]++; }
  });
  return { by:by, score:score, outOf:FQ().length, topics:topics };
};
function wrongSure(){ return confWrongList(FQ(), MV.S.final.q, function(q){ return MV.finalQ(q).options; }); }
MV.paintFinalCtl = function(){
  var host = $("#final-ctl"); if (!host) return;
  var S = MV.S, n = FQ().length;
  if (!S.final.submitted) {
    var answered = FQ().filter(function(q){ var st = S.final.q[q.id]; return st && st.choice != null && st.conf; }).length, art = MV.artDone();
    host.innerHTML = '<div class="q-actions" style="margin-top:18px"><button type="button" class="btn primary" id="final-submit"' + (answered < n || !art ? " disabled" : "") + ">Submit the Final Check</button><span class=\"tiny muted\">" + answered + " of " + n + " answered, with how sure you are." + (art ? "" : " Add your principle to My Art of Language in Reflect first.") + "</span></div>";
    return;
  }
  var fs = MV.finalStats(), wrong = wrongSure(), H = S.history;
  var h = '<div class="part" id="final-results" tabindex="-1"><h3>Your Final Check results</h3><p class="big-score">' + fs.score + " / " + n + "</p>";
  if (H.attempts > 1) h += '<p class="tiny muted">Attempt ' + H.attempts + "; first attempt " + H.first + "/" + n + "; best " + H.best + "/" + n + ".</p>";
  h += '<div class="bars">' + ["K", "T", "C", "A"].map(function(c){ var v = fs.by[c]; return '<div class="bar-row"><span>' + MV.CATN[c] + '</span><span class="bar" aria-hidden="true"><i style="width:' + (v[1] ? v[0] / v[1] * 100 : 0) + '%"></i></span><b>' + v[0] + "/" + v[1] + "</b></div>"; }).join("") + "</div>";
  if (MV.C.kind === "review") {
    h += '<table class="topic-tbl"><thead><tr><th scope="col">Topic</th><th scope="col">Right</th><th scope="col">Next step</th></tr></thead><tbody>' + Object.keys(fs.topics).sort().map(function(t){ var v = fs.topics[t], mm = MV.topicMod(t); return "<tr><td>" + mm.nn + ". " + mm.title + "</td><td>" + v[0] + "/" + v[1] + "</td><td>" + (v[0] < v[1] ? MV.revisitLink(t) : "✓") + "</td></tr>"; }).join("") + "</tbody></table>";
  }
  if (wrong.length) h += '<div class="fb bad"><p><strong>Sure, but wrong:</strong> you felt sure about question' + (wrong.length > 1 ? "s " : " ") + wrong.map(function(q){ return FQ().indexOf(q) + 1; }).join(", ") + " but got " + (wrong.length > 1 ? "them" : "it") + " wrong. Review " + (wrong.length > 1 ? "those" : "that one") + " first. The explanations are under each question above.</p></div>";
  else h += '<div class="fb good"><p><strong>Whenever you felt sure, you were right.</strong> Your sense of what you know is accurate.</p></div>';
  h += '<div class="q-actions"><button type="button" class="btn ghost sm" id="final-retake">Retake the Final Check</button><span class="tiny muted">A retake uses a second version of each question.</span></div></div>';
  host.innerHTML = h;
};
MV.initFinal = function(){
  var S = MV.S;
  if (S._legacyFinal && S.final.submitted && S.history.first == null) { var fs0 = MV.finalStats(); S.history.first = S.history.best = fs0.score; S.lastFinal = { score:fs0.score, outOf:fs0.outOf, byCat:fs0.by, topics:fs0.topics }; }
  $("#final-qs").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || S.final.submitted) return;
    var box = b.closest("[data-fq]"); if (!box) return;
    var q = FQ().filter(function(x){ return x.id === box.dataset.fq; })[0], st = S.final.q[q.id];
    if (b.dataset.i != null) st.choice = +b.dataset.i; else if (b.dataset.conf) st.conf = b.dataset.conf;
    MV.save(); paintFinalQ(q, FQ().indexOf(q)); MV.paintFinalCtl();
  });
  $("#final-ctl").addEventListener("click", function(e){
    if (e.target.id === "final-submit") {
      S.final.submitted = true; S.done["final-check"] = true;
      var fs = MV.finalStats(), H = S.history;
      H.attempts = (H.attempts || 0) + 1; if (H.first == null) H.first = fs.score; H.best = Math.max(H.best == null ? 0 : H.best, fs.score);
      S.lastFinal = { score:fs.score, outOf:fs.outOf, byCat:fs.by, topics:fs.topics, ver:ver() };
      MV.save(); MV.renderFinal(); MV.paintSteps(); MV.paintSummary();
      var r = $("#final-results"); if (r) { r.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); r.focus({ preventScroll:true }); }
    } else if (e.target.id === "final-retake") {
      if (!confirm("Clear your Final Check answers and try again with the second version of each question?")) return;
      S.final = { q:{}, submitted:false, ver:(S.history.attempts % 2 === 0) ? "a" : "b" }; MV.save(); MV.renderFinal(); MV.paintSteps(); MV.paintSummary();
      $("#final-qs").scrollIntoView({ block:"start" });
    }
  });
  if (!S.final.submitted && !S.final.ver) S.final.ver = (S.history.attempts % 2 === 0) ? "a" : "b";
  MV.renderFinal();
};

// ---------- performance task frame (K17) ----------
// content.task: {title, statement, checks:[label html], tips:[html], explainPrompt, vocab, success, more, after3, store}
// app.task: {render(inputsHost, previewHost, api), read(), checks(d) -> [bool], tips(d, res) -> [html], valid(d) -> true | "message",
//            key(d) -> string, label(key) -> html, text(key) -> plain text, summary(d) -> [lines]}
function taskState(){ var k = MV.C.task.store || "task"; var t = MV.S[k] || (MV.S[k] = { explain:"", found:[], app:{} }); t.found = t.found || []; t.app = t.app || {}; return t; }
MV.taskState = taskState;
MV.initTask = function(){
  var T = MV.C.task; if (!T) return;
  var A = MV.APP.task || {}, st = taskState(), host = $("#task");
  host.innerHTML = '<div class="design"><div>' + (T.statement ? "<div>" + T.statement + "</div>" : "") + '<div id="task-in"></div><ul class="checks" id="task-checks"></ul>' +
    '<div class="jq"><label for="task-explain">' + (T.explainPrompt || "Explain how you know your design works.") + '</label><textarea id="task-explain" placeholder="' + MV.esc(MV.plain(T.vocab || "")) + '"></textarea><div class="saved" id="task-saved" aria-live="polite"></div></div>' +
    '<button type="button" class="btn primary" id="task-check">' + (T.checkLabel || "Check my design") + '</button><div id="task-fb" aria-live="polite"></div></div><div id="task-pv"></div></div>';
  $("#task-explain").value = st.explain || "";
  var timer = null;
  $("#task-explain").addEventListener("input", function(){ st.explain = $("#task-explain").value; clearTimeout(timer); timer = setTimeout(function(){ MV.save(); $("#task-saved").textContent = "Saved"; MV.paintSummary(); }, 400); });
  function res(){ var d = A.read ? A.read() : {}; var ok = A.valid ? A.valid(d) : true; return { d:d, valid:ok === true, vmsg:ok === true ? "" : ok, checks:(A.checks ? A.checks(d) : []) }; }
  function update(){
    var r = res();
    $("#task-checks").innerHTML = (T.checks || []).map(function(lab, i){ var ok = !!r.checks[i]; return '<li class="' + (ok ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (ok ? "✓" : "○") + "</span><span>" + lab + '<span class="vh">' + (ok ? " (met)" : " (not met)") + "</span></span></li>"; }).join("");
    $("#task-fb").innerHTML = "";
  }
  var api = { S:st.app, save:MV.save, update:update, changed:update, content:T };
  try { if (A.render) A.render($("#task-in"), $("#task-pv"), api); } catch (e) { console.error(e); }
  $("#task-check").addEventListener("click", function(){
    var r = res(), fb = $("#task-fb");
    if (!r.valid) { fb.innerHTML = '<div class="fb bad"><p>' + (r.vmsg || "Fill in every box first.") + "</p></div>"; return; }
    var all = (T.checks || []).every(function(_, i){ return !!r.checks[i]; });
    if (all) {
      var key = A.key ? A.key(r.d) : "solved";
      if (key != null && st.found.indexOf(key) < 0) st.found.push(key);
      MV.save();
      var list = A.label ? st.found.map(function(k){ return A.label(k); }).join("; ") : "";
      var more = !(st.explain || "").trim() ? " Don’t forget to write your explanation." : "";
      var tail = st.found.length >= 3 && T.after3 ? "<p>" + T.after3 + "</p>" : "";
      fb.innerHTML = '<div class="fb good"><p><strong>✓ ' + (T.success || "Your design works!") + "</strong>" + more + "</p>" + (A.key ? "<p>" + (T.more || "There’s more than one answer. Can you find another?") + (list ? " Answers you’ve found: " + list : "") + "</p>" : "") + tail + "</div>";
      MV.paintSummary();
    } else {
      var tips = A.tips ? A.tips(r.d, r.checks) : (T.checks || []).map(function(_, i){ return r.checks[i] ? null : (T.tips || [])[i]; }).filter(Boolean);
      fb.innerHTML = '<div class="fb bad"><p><strong>Not yet.</strong> ' + tips.join(" ") + "</p></div>";
    }
    MV.focusFb($("#task-sheet"));
  });
  update();
  MV._taskUpdate = update;
};

// ---------- summary (K18) ----------
MV.summaryData = function(){
  var S = MV.S, C = MV.C, miss = {}, fs = MV.finalStats();
  if (S.final.submitted) FQ().forEach(function(q){ var st = S.final.q[q.id], fq = MV.finalQ(q); if (st && st.choice != null && !MV.ok(fq.options[st.choice])) MV.goalIdx(q.goal).forEach(function(g){ miss[g] = 1; }); });
  Object.keys(MV.ACTS).forEach(function(id){ try { MV.ACTS[id].missed().forEach(function(g){ miss[g] = 1; }); } catch (e) {} });
  var qc = MV.qcStats(); if (qc) qc.missed.forEach(function(q){ MV.goalIdx(q.goal).forEach(function(g){ miss[g] = 1; }); });
  ((C.explore || {}).challenges || []).forEach(function(c){ var st = S.chal[c.id]; if (st && (st.tries > 0 || st.hint >= 3)) MV.goalIdx(c.goal).forEach(function(g){ miss[g] = 1; }); });
  var weak = {};
  if (C.kind === "review") {
    MV.warmCfg().list.forEach(function(q){ var st = S.warm[q.id]; if (st && st.checked && !st.correct && q.topic) weak[q.topic] = 1; });
    if (S.final.submitted) Object.keys(fs.topics).forEach(function(t){ if (fs.topics[t][0] < fs.topics[t][1]) weak[t] = 1; });
  }
  return { fs:fs, miss:Object.keys(miss).map(Number).filter(function(g){ return g >= 0 && g < C.goals.length; }).sort(function(a, b){ return a - b; }), weak:Object.keys(weak).sort() };
};
MV.summaryText = function(){
  var S = MV.S, C = MV.C, M = MV.meta, d = MV.summaryData(), L = [], n = FQ().length, H = S.history, last = S.lastFinal;
  L.push((C.topic || C.title) + " module (" + M.code + ", " + M.groupLabel + "): results summary");
  L.push("Student: " + (S.name || "(no name entered)"));
  L.push("Date: " + new Date().toLocaleDateString("en-CA", { year:"numeric", month:"long", day:"numeric" }));
  L.push("");
  if (last) {
    L.push("Final Check: " + last.score + "/" + n + (H.attempts > 1 ? " (attempt " + H.attempts + "; first attempt " + H.first + "/" + n + ")" : ""));
    ["K", "T", "C", "A"].forEach(function(c){ L.push("  " + MV.CATN[c] + ": " + last.byCat[c][0] + "/" + last.byCat[c][1]); });
    if (S.final.submitted) { var ws = wrongSure(); if (ws.length) L.push("  Felt sure but got wrong: question" + (ws.length > 1 ? "s " : " ") + ws.map(function(q){ return FQ().indexOf(q) + 1; }).join(", ")); }
    if (C.kind === "review" && last.topics) Object.keys(last.topics).sort().forEach(function(t){ var v = last.topics[t]; L.push("  Module " + t + ": " + v[0] + "/" + v[1]); });
  } else L.push("Final Check: not submitted yet");
  if (C.task) {
    var T = C.task, A = MV.APP.task || {}, ts = taskState();
    if (A.summary) A.summary(ts).forEach(function(x){ L.push(x); });
    else L.push((T.summary || T.title) + ": " + (ts.found.length ? "solved" + (A.text ? " (" + ts.found.map(function(k){ return A.text(k); }).join("; ") + ")" : "") : "not solved yet"));
    if ((ts.explain || "").trim()) L.push("  " + (T.explainLabel || "Explanation") + ": " + ts.explain.trim());
  }
  L.push("");
  var ws2 = MV.warmStats();
  L.push((C.kind === "review" ? "Diagnostic: " : "Warm-up: ") + (ws2.checked ? ws2.score + "/" + ws2.total + (ws2.checked < ws2.total ? " (unfinished)" : "") + (ws2.withSol ? " (" + ws2.withSol + " more correct with the worked solution)" : "") : "not done"));
  var cs = MV.chalStats(); if (cs.total) L.push("Explore challenges (first try): " + cs.first + "/" + cs.total);
  var qc = MV.qcStats(); if (qc) L.push((C.part3.quickCheck.summary || C.part3.quickCheck.title || "Quick check") + " (first try): " + (qc.done ? qc.first + "/" + qc.total + (qc.done < qc.total ? " (unfinished)" : "") : "not done"));
  Object.keys(MV.ACTS).forEach(function(id){ try { var s = MV.ACTS[id].stats(); if (s.line) L.push(s.line); } catch (e) {} });
  if (MV.APP.summaryLines) try { MV.APP.summaryLines().forEach(function(x){ L.push(x); }); } catch (e) {}
  if ((C.reflect || {}).art) L.push("My Art of Language: " + (MV.artDone() ? "principle added" : "not added yet") + ((S.writes["art-principle"] || "").trim() ? " (“" + S.writes["art-principle"].trim() + "”)" : ""));
  L.push("");
  L.push("Learning goals (start → now):");
  C.goals.forEach(function(g, i){ L.push("  " + (i + 1) + ". " + MV.plain(g) + " " + (S.rate0[i] != null ? MV.RATE[S.rate0[i]] : "not rated") + " → " + (S.rate1[i] != null ? MV.RATE[S.rate1[i]] : "not rated")); });
  L.push("");
  L.push("Skills to review: " + (d.miss.length ? "" : "none flagged"));
  d.miss.forEach(function(i){ L.push("  • " + MV.plain(C.goals[i])); });
  if (C.kind === "review") L.push("Modules to revisit: " + (d.weak.length ? d.weak.map(function(t){ var mm = MV.topicMod(t); return mm.nn + " " + mm.title; }).join("; ") : "none flagged"));
  return L.join("\n");
};
MV.paintSummary = function(){
  var host = $("#summary"); if (!host) return;
  if (!MV.S.lastFinal) { host.innerHTML = '<p class="fb">Submit the Final Check to see your results summary. You can copy it and send it to your teacher.</p>'; return; }
  var d = MV.summaryData(), C = MV.C;
  var h = '<label class="namefield" for="stu-name">Your name<input id="stu-name" type="text" autocomplete="name" value="' + MV.esc(MV.S.name || "") + '"></label>';
  h += '<p class="muted">Here’s everything in one place. Copy it and share it with your teacher, or keep it for review.</p>';
  if (d.miss.length) h += '<div class="refresh" style="margin-bottom:12px"><h4>Skills to review</h4><p>' + d.miss.map(function(i){ return C.goals[i]; }).join("<br>") + "</p></div>";
  if (C.kind === "review" && d.weak.length) h += '<div class="refresh" style="margin-bottom:12px"><h4>Modules to revisit</h4><p>' + d.weak.map(MV.revisitLink).join("<br>") + "</p></div>";
  h += '<pre class="summary" id="sum-text"></pre><div class="q-actions"><button type="button" class="btn primary" id="copy-sum">Copy summary</button><button type="button" class="btn ghost" id="save-sum">Save as a file</button><span class="tiny muted" id="copy-status" aria-live="polite"></span></div>';
  host.innerHTML = h;
  $("#sum-text").textContent = MV.summaryText();
};
MV.initSummary = function(){
  var host = $("#summary");
  host.addEventListener("input", function(e){ if (e.target.id === "stu-name") { MV.S.name = e.target.value; MV.save(); $("#sum-text").textContent = MV.summaryText(); } });
  host.addEventListener("click", function(e){
    var status = $("#copy-status");
    if (e.target.id === "save-sum") { MV.download(MV.meta.id + "-summary.txt", MV.summaryText()); status.textContent = "Saved as a file."; return; }
    if (e.target.id !== "copy-sum") return;
    var text = MV.summaryText();
    var fallback = function(){
      // A textarea is a form field, so the site's copy protection still lets the student copy from it.
      var ta = document.getElementById("sum-copy");
      if (!ta) { ta = document.createElement("textarea"); ta.id = "sum-copy"; ta.className = "txtin"; ta.setAttribute("aria-label", "Summary text to copy"); ta.style.minHeight = "160px"; host.appendChild(ta); }
      ta.value = text; ta.focus(); ta.select();
      status.textContent = "The summary is selected in the box below. Press Ctrl+C (or ⌘+C) to copy it.";
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){ status.textContent = "Copied."; }, fallback);
      else fallback();
    } catch (err) { fallback(); }
  });
};

// ---------- flashcards (K19) ----------
MV.initCards = function(){
  var CARDS = (MV.C.cards || []).map(function(c){ return Array.isArray(c) ? c : [c.front || c.f, c.back || c.b]; });
  var order = CARDS.map(function(_, i){ return i; }), i = 0, flipped = false;
  function paint(){
    if (!CARDS.length) return;
    var c = CARDS[order[i]];
    $("#fc-front").innerHTML = "<span>" + c[0] + "</span><small>Tap to see the answer</small>";
    $("#fc-back").innerHTML = "<span>" + c[1] + "</span>";
    $("#fc-card").classList.toggle("flipped", flipped);
    $("#fc-card").setAttribute("aria-label", flipped ? "Answer: " + MV.plain(c[1]) + ". Activate to flip back." : "Card: " + MV.plain(c[0]) + ". Activate to flip.");
    $("#fc-count").textContent = "Card " + (i + 1) + " of " + CARDS.length;
  }
  function close(){ var dlg = $("#fc"); if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
  $("#open-fc").addEventListener("click", function(){ var dlg = $("#fc"); flipped = false; paint(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
  $("#fc-card").addEventListener("click", function(){ flipped = !flipped; paint(); });
  $("#fc").addEventListener("click", function(e){
    var b = e.target.closest("[data-fc]");
    if (!b) { if (e.target === $("#fc")) close(); return; }
    var a = b.dataset.fc;
    if (a === "close") close();
    else if (a === "next") { i = (i + 1) % CARDS.length; flipped = false; paint(); }
    else if (a === "prev") { i = (i - 1 + CARDS.length) % CARDS.length; flipped = false; paint(); }
    else if (a === "shuffle") { for (var k = order.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = order[k]; order[k] = order[j]; order[j] = t; } i = 0; flipped = false; paint(); }
  });
};

// ---------- start over (K20) ----------
MV.initReset = function(){
  $("#reset").addEventListener("click", function(){
    if (!confirm("This clears all your saved answers on this device and starts the module from the beginning. Continue?")) return;
    MV._noSave = true; MV.clearSaved();
    try { var rec = MV.artRead(); if (rec.principles && rec.principles[MV.meta.id]) { delete rec.principles[MV.meta.id]; MV.artWrite(rec); } } catch (e) {}
    location.hash = "start"; location.reload();
  });
};

// ---------- progress record (N2, 03-home-page.md §4.2) ----------
MV._progress = function(){
  var S = MV.S, V = MV.V, last = S.lastFinal, H = S.history, ts = MV.C.task ? taskState() : null;
  return {
    v:1, id:MV.meta.id, kind:MV.C.kind === "review" ? "review" : "topic", parts:V.list.length,
    partsDone:V.list.filter(MV.isDone), last:S.last, started:S.started, updated:new Date().toISOString(),
    final:last ? { submitted:true, score:last.score, outOf:last.outOf, byCat:last.byCat, attempt:H.attempts, firstScore:H.first, bestScore:H.best } : null,
    task:{ solved:!!(ts && ts.found && ts.found.length) },
    weakTopics:MV.C.kind === "review" && MV.ACTS ? MV.summaryData().weak : []
  };
};
})();
