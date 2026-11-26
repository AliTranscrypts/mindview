// ENG4U 20 ISU Oral Defence: hero (Hamlet 3.2 with a gesturing figure and a lectern), Rehearsal coach (Explore: E15 oral
// rehearsal coach with Plan, Rehearse and Question drill modes, readout, timer, optional in-memory recording), Handling the
// hard question (Part 3: four listening-and-response stations), Spot the Error (K13 prose), Defence plan (task, reads E15).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc, X = null;
function num(a, b){ return a - b; }
function wc(t){ return MV.eng.wordCount(t); }
function mmss(s){ s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
function nk(w){ return MV.eng.norm(w); }
function prep(){ if (!X) X = MV.C.explore; }

// ---------- @component radioGroup (copied from ENG4U 10; no option needs to be checked) ----------
function radios(host, o){
  var val = String(o.value == null ? "" : o.value);
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); }), tab = ids.indexOf(val) >= 0 ? val : ids[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '">' + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) { e.stopPropagation(); choose(b.dataset.rg); } });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(b.dataset.rg) + d + ids.length) % ids.length;
    choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus();
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; } };
}

// ---------- local voice + @component E15 readAloud (adapted from ENG4U 10's pausePlayer): parts spoken in turn with gaps;
// with no local voice, a timed run lights the same parts (reduced motion: no run) ----------
var VOICE = null, RUN = 0;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; if (fn) fn(v); }); }
function stopAll(){ RUN++; try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {} }
function seq(items, o, done){
  stopAll(); o = o || {}; var me = RUN, i = 0, fin = false;
  function end(ok){ if (fin) return; fin = true; if (o.off) o.off(); if (done) done(ok); }
  function next(){
    if (me !== RUN) { end(false); return; }
    if (i >= items.length) { end(true); return; }
    var it = items[i++], fired = false; if (it.on) it.on();
    var after = function(){ if (fired) return; fired = true; if (me !== RUN) { end(false); return; } setTimeout(next, MV.reduceMotion && !VOICE ? 0 : (it.gap || 0)); };
    if (VOICE && !o.silent) {
      try {
        var u = new SpeechSynthesisUtterance(it.t); u.voice = VOICE; u.lang = VOICE.lang; u.rate = (o.rate || 1) * (it.rate || 1); u.pitch = it.st ? 1.15 : 1; u.volume = it.st ? 1 : 0.85;
        var go = false; u.onstart = function(){ go = true; setTimeout(after, 900 + it.t.length * 120 / u.rate); }; u.onend = after; u.onerror = after; window.speechSynthesis.speak(u); setTimeout(function(){ if (!go) { o.silent = true; try { window.speechSynthesis.cancel(); } catch (e) {} after(); } }, 1500);
      } catch (e) { after(); }
    } else if (MV.reduceMotion) after();
    else setTimeout(after, it.dur || 260);
  }
  next();
  return { stop:function(){ stopAll(); end(false); } };
}

// ---------- hero: Hamlet 3.2; "trippingly" bounces, a hand rises on "action", a speech mark pulses on "word", then a lectern ----------
var HR = { run:0 };
function hero(){
  var H = MV.C.hero, host = $("#dfh"); if (!host) return;
  function lineHTML(l, li){
    return '<p class="dfh-l dfh-l' + (li + 1) + '">' + l.t.split(" ").map(function(w){
      var k = nk(w), c = k === nk(l.bounce || "-") ? " dfh-bounce" : k === nk(l.action || "-") ? " dfh-act" : k === nk(l.word || "-") ? " dfh-wd" : "";
      return '<span class="dfh-w' + c + '">' + esc(w) + "</span>";
    }).join(" ") + "</p>";
  }
  host.innerHTML = '<div class="dfh-row"><div class="dfh-lines">' + H.lines.map(lineHTML).join("") + '<p class="eng-cite">' + H.cite + "</p></div>" +
    '<svg class="dfh-svg" viewBox="0 0 220 170" aria-hidden="true">' +
      '<g class="dfh-fig"><circle cx="48" cy="40" r="13" class="dfh-ink"/><line x1="48" y1="53" x2="48" y2="108" class="dfh-ink"/><line x1="48" y1="108" x2="36" y2="148" class="dfh-ink"/><line x1="48" y1="108" x2="60" y2="148" class="dfh-ink"/>' +
        '<line x1="48" y1="66" x2="30" y2="92" class="dfh-ink"/><g class="dfh-arm"><line x1="48" y1="66" x2="72" y2="88" class="dfh-ink"/></g>' +
        '<text x="74" y="36" class="dfh-sm">“ ”</text></g>' +
      '<g class="dfh-lect"><path d="M120 92 L200 92 L190 160 L130 160 Z" class="dfh-desk"/>' +
        '<rect x="128" y="22" width="64" height="26" rx="3" class="dfh-card dfh-thesis"/><text x="160" y="39" class="dfh-t">Thesis</text>' +
        '<rect x="124" y="58" width="20" height="26" rx="2" class="dfh-card"/><text x="134" y="75" class="dfh-t">1</text>' +
        '<rect x="150" y="58" width="20" height="26" rx="2" class="dfh-card"/><text x="160" y="75" class="dfh-t">2</text>' +
        '<rect x="176" y="58" width="20" height="26" rx="2" class="dfh-card"/><text x="186" y="75" class="dfh-t">3</text>' +
        '<text x="160" y="134" class="dfh-q">?</text></g></svg></div>' +
    '<p class="dfh-cap" id="dfh-cap">' + H.caption + '</p><div class="q-actions"><button type="button" class="btn ghost sm" id="dfh-go">' + H.watch + '</button><span class="tiny muted" id="dfh-note"></span></div>';
  var T = [];
  function clear(){ T.forEach(clearTimeout); T = []; }
  function at(ms, fn){ var me = HR.run; T.push(setTimeout(function(){ if (me === HR.run) fn(); }, ms)); }
  function cls(c, on){ host.classList.toggle(c, on); }
  function finish(){ clear(); ["dfh-anim", "dfh-act-on", "dfh-wd-on"].forEach(function(c){ cls(c, false); }); ["dfh-s1", "dfh-s2", "dfh-s3", "dfh-done"].forEach(function(c){ cls(c, true); }); }
  function visual(withVoice){
    var me = ++HR.run; clear(); stopAll();
    ["dfh-s1", "dfh-s2", "dfh-s3", "dfh-done", "dfh-act-on", "dfh-wd-on"].forEach(function(c){ cls(c, false); }); cls("dfh-anim", true);
    if (MV.reduceMotion) { finish(); if (!withVoice) return; }
    if (withVoice && VOICE) {
      seq([{ t:H.lines[0].t.replace(/…/g, ""), rate:0.95, gap:500, on:function(){ if (me === HR.run) cls("dfh-s1", true); } },
           { t:"suit the action", gap:80, on:function(){ if (me === HR.run) { cls("dfh-s2", true); cls("dfh-act-on", true); } } },
           { t:"to the word,", gap:80, on:function(){ if (me === HR.run) { cls("dfh-act-on", false); cls("dfh-wd-on", true); } } },
           { t:"the word", gap:60, on:function(){ if (me === HR.run) cls("dfh-wd-on", true); } },
           { t:"to the action", gap:400, on:function(){ if (me === HR.run) { cls("dfh-wd-on", false); cls("dfh-act-on", true); } } }],
        { rate:0.95 }, function(){ if (me === HR.run) { cls("dfh-act-on", false); cls("dfh-s3", true); at(900, finish); } });
      return;
    }
    if (MV.reduceMotion) return;
    at(100, function(){ cls("dfh-s1", true); });
    at(2000, function(){ cls("dfh-s2", true); });
    at(2500, function(){ cls("dfh-act-on", true); });
    at(3100, function(){ cls("dfh-act-on", false); cls("dfh-wd-on", true); });
    at(3700, function(){ cls("dfh-wd-on", false); cls("dfh-act-on", true); });
    at(4300, function(){ cls("dfh-act-on", false); cls("dfh-s3", true); });
    at(5200, finish);
  }
  $("#dfh-go").addEventListener("click", function(){ visual(true); });
  voiceReady(function(v){ $("#dfh-go").textContent = v ? H.listen : H.watch; $("#dfh-note").textContent = v ? "" : H.noVoice; if (!v && MV.reduceMotion) $("#dfh-go").hidden = true; });
  if (MV.reduceMotion) finish(); else visual(false);
  HR.stop = function(){ if (host.classList.contains("dfh-anim")) { HR.run++; stopAll(); finish(); } };
}

// ---------- shared plan data (Explore state; the task reads it) ----------
var EXS = null, EXAPI = null;
function ensure(S){
  prep();
  S.mode = ["plan", "rehearse", "drill"].indexOf(S.mode) >= 0 ? S.mode : "plan";
  S.novel = S.novel || "fr";
  S.my = S.my || { title:"", author:"", thesis:"" };
  if (S.limit == null) S.limit = 6; if (S.pace == null) S.pace = 150;
  S.seg = S.seg || {}; X.segs.forEach(function(s){ if (!S.seg[s.id]) S.seg[s.id] = { s:s.def, n:"" }; });
  if (S.c3 == null) S.c3 = true;
  S.slides = S.slides || [];
  S.pass = S.pass === "mine" ? "mine" : "tc2"; S.mk = S.mk || {}; S.tool = S.tool || "stress";
  S.runs = S.runs || []; S.rev = S.rev || {}; if (S.next == null) S.next = "";
  S.drill = S.drill || { seed:1 + Math.floor(Math.random() * 9973), i:-1, ans:{} };
  S.tc3 = S.tc3 || [];
  return S;
}
// pre-fill title, author and thesis from module 19's storage on this device (read only; any field it can find)
function prefill(S){
  if (S.my.title || S.my.author || S.my.thesis) return;
  var o = null; try { o = JSON.parse(localStorage.getItem("eng4u-19-sustained-essay-v1") || "null"); } catch (e) { o = null; }
  if (!o || typeof o !== "object") return;
  var got = {}, seen = 0;
  (function walk(v, depth){
    if (!v || typeof v !== "object" || depth > 6 || seen > 4000) return;
    Object.keys(v).forEach(function(k){
      seen++; var x = v[k];
      if (typeof x === "string" && x.trim()) {
        if (!got.thesis && /thesis/i.test(k) && x.length < 700) got.thesis = x.trim();
        else if (!got.author && /author/i.test(k) && x.length < 80) got.author = x.trim();
        else if (!got.title && /^(novel|book|novelTitle|bookTitle|title)$/i.test(k) && x.length < 120 && depth > 0) got.title = x.trim();
      } else walk(x, depth + 1);
    });
  })(o, 0);
  if (got.title || got.author || got.thesis) { S.my.title = got.title || ""; S.my.author = got.author || ""; S.my.thesis = got.thesis || ""; S.pf = true; }
}
function activeSegs(S){ return X.segs.filter(function(s){ return !s.opt || S.c3; }); }
function total(S){ return activeSegs(S).reduce(function(t, s){ return t + (+S.seg[s.id].s || 0); }, 0); }
function novelInfo(S){
  var n = X.novels.filter(function(x){ return x.id === S.novel; })[0] || X.novels[0];
  if (n.id === "my") return { title:S.my.title.trim() ? "<i>" + esc(S.my.title.trim()) + "</i>" : "your novel", author:S.my.author.trim() ? esc(S.my.author.trim()) : "the author" };
  return { title:"<i>" + n.title + "</i>", author:n.author };
}
function fillQ(S, q){
  var N = novelInfo(S), c1 = String(S.seg.c1.n || "").trim().split(/\s+/).slice(0, 8).join(" ");
  return q.t.replace(/\[title\]/g, N.title).replace(/\[author\]/g, N.author).replace(/\[claim\]/g, c1 ? "“" + esc(c1.replace(/[“”"]/g, "")) + (String(S.seg.c1.n).trim().split(/\s+/).length > 8 ? "…" : "") + "”" : "your first claim");
}
function toksOf(text){ return String(text || "").split(/\s+/).filter(Boolean).map(function(w, i){ return { t:w, line:0, i:i }; }); }
function passText(S){ if (S.pass === "tc2") return X.para; return activeSegs(S).map(function(s){ return String(S.seg[s.id].n || "").trim(); }).filter(Boolean).join(" "); }
function marksOf(S){ var m = S.mk[S.pass] || (S.mk[S.pass] = { p:[], e:[], s:[] }); return m; }
function sentencesOf(t){
  var s = String(t || "").replace(/\s+/g, " ").trim(); if (!s) return [];
  return s.match(/[^.!?]+[.!?]+[”’"')]*|[^.!?]+$/g).map(function(x){ return x.trim(); }).filter(Boolean);
}
function movesOf(ans){ var t = ans && ans.tags || {}, n = toksOf(ans && ans.text).length, o = {}; X.moves.forEach(function(m){ o[m.id] = (t[m.id] || []).filter(function(i){ return i < n; }).length > 0; }); return o; }

// ---------- audience gauge: listener icons whose heads tilt (engaged) or droop (lost) ----------
function audHTML(states, label){
  return '<div class="df-aud" role="img" aria-label="' + esc(label) + '">' + states.map(function(st){
    return '<svg class="df-li ' + st + '" viewBox="0 0 24 34" aria-hidden="true"><g class="df-lh"><circle cx="12" cy="9" r="6"/></g><path d="M3 33 Q3 18 12 18 Q21 18 21 33 Z"/></svg>';
  }).join("") + "</div>";
}
function bars(words, o){
  o = o || {};
  return '<div class="df-wave' + (o.cls ? " " + o.cls : "") + '" aria-hidden="true">' + words.map(function(w, i){
    var h = 10 + Math.min(26, w.replace(/[^A-Za-z]/g, "").length * 3);
    return (o.gapBefore === i ? '<span class="df-gap"></span>' : "") + '<span class="df-bar' + (o.hi === i ? " hi" : "") + '" data-b="' + i + '" style="height:' + h + 'px"></span>';
  }).join("") + "</div>";
}
function stillSVG(kind){
  var eyes = kind === "card" ? '<line x1="38" y1="30" x2="44" y2="30" class="df-ink"/>' : '<line x1="34" y1="35" x2="38" y2="38" class="df-ink"/>';
  var paper = kind === "card" ? '<rect x="12" y="62" width="14" height="10" rx="1" class="df-paper"/>' : '<rect x="24" y="44" width="30" height="38" rx="2" class="df-paper"/><line x1="28" y1="52" x2="50" y2="52" class="df-thin"/><line x1="28" y1="58" x2="50" y2="58" class="df-thin"/><line x1="28" y1="64" x2="50" y2="64" class="df-thin"/><line x1="28" y1="70" x2="46" y2="70" class="df-thin"/>';
  return '<svg viewBox="0 0 170 110" class="df-still" aria-hidden="true"><circle cx="36" cy="30" r="12" class="df-head"/>' + eyes +
    '<line x1="36" y1="42" x2="36" y2="92" class="df-ink"/><line x1="36" y1="56" x2="' + (kind === "card" ? "20" : "28") + '" y2="' + (kind === "card" ? "66" : "52") + '" class="df-ink"/>' + paper +
    '<line x1="46" y1="30" x2="128" y2="30" class="df-eye"/>' +
    [130, 150].map(function(x){ return '<circle cx="' + x + '" cy="32" r="8" class="df-head"/><path d="M' + (x - 10) + ' 66 Q' + (x - 10) + ' 44 ' + x + ' 44 Q' + (x + 10) + ' 44 ' + (x + 10) + ' 66 Z" class="df-body"/>'; }).join("") + "</svg>";
}

// ---------- Explore: @component E15 oralCoach — Plan (time budget, cue notes, pace, slides, my novel), Rehearse (marking
// tools, timer, listen at my pace, optional in-memory recording, self-review), Question drill (seeded bank, type it, answer,
// "Say it" timer, E1 move tags, TC3 answer builder) and a readout panel ----------
var EX = null, TIMER = { on:false, t0:0, iv:0 }, SAY = { on:false, t0:0, iv:0 }, REC = { mr:null, url:null };
function explore(host, api){
  var S = ensure(api.S); EXS = S; EXAPI = api; prefill(S);
  var fx = { demo:null };
  host.innerHTML = '<div class="df">' +
    '<div class="df-top"><div id="df-mode"></div><div id="df-nov"></div></div>' +
    '<div class="df-body"><div class="df-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="df-demo" class="df-demo" hidden></div><div id="df-plan"></div><div id="df-reh" hidden></div><div id="df-drill" hidden></div></div>' +
    '<div class="df-read"><p class="df-rh">Readout</p><dl class="read" id="df-read"></dl><p class="df-aha">' + X.aha + "</p></div></div></div>";
  var modeRG = radios($("#df-mode"), { label:"Mode", options:X.modes, value:S.mode, onChange:function(v){ S.mode = v; closeDemo(); api.save(); paint(); } });
  var novRG = radios($("#df-nov"), { label:"Practice novel", cls:"chips", options:X.novels, value:S.novel, onChange:function(v){ S.novel = v; api.save(); if (S.mode === "drill") paintDrill(); paintRead(); } });

  // ----- Plan -----
  function buildPlan(){
    var el = $("#df-plan");
    el.innerHTML = '<div class="df-my"><h4 class="df-h">My novel</h4>' + (S.pf ? '<p class="tiny muted">Pre-filled from module 19 on this device. Edit anything.</p>' : "") +
      '<div class="df-two"><div class="jq"><label for="df-title">Title</label><input class="txtin" type="text" id="df-title" data-my="title"></div><div class="jq"><label for="df-author">Author</label><input class="txtin" type="text" id="df-author" data-my="author"></div></div>' +
      '<div class="jq"><label for="df-thesis">Thesis (one sentence, 20–60 words)</label><textarea id="df-thesis" rows="3" data-my="thesis"></textarea></div></div>' +
      '<div class="df-sls"><div class="df-sl"><label for="df-limit">Time limit</label><input type="range" id="df-limit" min="3" max="10" step="0.5"><output id="df-limit-o" for="df-limit"></output></div>' +
      '<div class="df-sl"><label for="df-pace">Pace</label><input type="range" id="df-pace" min="120" max="180" step="10"><output id="df-pace-o" for="df-pace"></output></div></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="df-c3" data-k="c3"></button><span class="tiny muted">Cue notes are key words, not a script. Put each claim’s one best quotation in its cue note, cited.</span></div>' +
      '<ol class="df-segs" id="df-segs"></ol>' +
      '<details class="alg" id="df-slides"><summary>Slide sketcher (optional, up to 3 slides)</summary><div id="df-sk"></div></details>';
    $("#df-title").value = S.my.title; $("#df-author").value = S.my.author; $("#df-thesis").value = S.my.thesis;
    $("#df-limit").value = S.limit; $("#df-pace").value = S.pace;
    paintSegs(); paintSlides(); planOuts();
  }
  function planOuts(){ $("#df-limit-o").textContent = mmss(S.limit * 60); $("#df-pace-o").textContent = S.pace + " wpm"; var b = $("#df-c3"); b.textContent = S.c3 ? "Claim 3: on" : "Claim 3: off"; b.setAttribute("aria-pressed", S.c3); }
  function paintSegs(){
    $("#df-segs").innerHTML = X.segs.map(function(s){
      if (s.opt && !S.c3) return "";
      var v = S.seg[s.id];
      return '<li class="df-seg"><span class="df-st" id="df-sl-' + s.id + '">' + s.t + '</span><label class="df-secs"><span class="vh">' + s.t + ': </span>Seconds <input class="txtin" type="number" min="0" max="180" step="5" inputmode="numeric" data-ss="' + s.id + '" value="' + esc(String(v.s)) + '"></label>' +
        '<label class="df-cn"><span class="vh">Cue notes for ' + MV.plain(s.t) + '</span><textarea rows="2" data-sn="' + s.id + '" placeholder="Cue notes">' + esc(v.n || "") + "</textarea></label></li>";
    }).join("");
  }
  function paintSlides(){
    var h = S.slides.map(function(sl, i){
      var n = wc(sl.t);
      return '<div class="df-slide"><p class="df-h2">Slide ' + (i + 1) + '</p><label class="tiny">Layout <select data-sly="' + i + '">' + X.layouts.map(function(l){ return '<option value="' + l.id + '"' + (sl.lay === l.id ? " selected" : "") + ">" + l.t + "</option>"; }).join("") + '</select></label>' +
        '<label class="df-cn"><span class="vh">Slide ' + (i + 1) + ' content</span><textarea rows="2" data-slt="' + i + '" placeholder="What the slide shows">' + esc(sl.t || "") + '</textarea></label><p class="tiny" id="df-slw' + i + '">' + slideWords(n) + '</p><button type="button" class="btn ghost sm" data-slx="' + i + '" data-k="slx' + i + '">Remove slide ' + (i + 1) + "</button></div>";
    }).join("");
    if (S.slides.length < 3) h += '<button type="button" class="btn ghost sm" id="df-sla" data-k="sla">Add a slide</button>';
    MV.keepFocus($("#df-sk"), function(){ $("#df-sk").innerHTML = h; });
  }
  function slideWords(n){ return '<span class="df-gauge" aria-hidden="true"><span style="width:' + Math.min(100, n * 4) + '%"></span></span> ' + n + " word" + (n === 1 ? "" : "s") + (n > 25 ? " · ⚠ text-heavy: show what you’re pointing at, not what you’re saying" : ""); }

  // ----- Rehearse -----
  var toolRG = null, passRG = null;
  function buildReh(){
    var el = $("#df-reh"), rec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    el.innerHTML = '<div class="df-timer" id="df-timer"><span class="df-clock" id="df-clock">0:00</span><span class="tiny" id="df-planned"></span><button type="button" class="btn primary sm" id="df-go" data-k="go">Start timer</button><span class="tiny muted">Space starts or stops the timer. A run counts once it reaches 1 minute.</span></div>' +
      '<div id="df-pass"></div><div id="df-tool"></div><p class="how">Choose a tool, then tap a word. A pause goes in the gap after the word you tap. Arrow keys move through the words; Enter or Space marks.</p>' +
      '<div id="df-mk" class="df-card"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="df-mclr" data-k="mclr">Clear marks</button><span class="tiny" id="df-mn" aria-live="polite"></span></div>' +
      '<div class="q-actions" id="df-lis"><label class="tiny" for="df-sent">Sentence</label><select id="df-sent"></select><button type="button" class="btn sm" id="df-listen" data-k="listen">Listen at my pace</button></div><p class="tiny muted" id="df-nov-note"></p>' +
      (rec ? '<div class="q-actions df-recrow"><button type="button" class="btn sm" id="df-rec" data-k="rec">Record (optional)</button><button type="button" class="btn ghost sm" id="df-recp" data-k="recp" disabled>Play back</button><span class="tiny"><strong>' + X.recLabel + '</strong></span><span class="tiny muted" id="df-recs" aria-live="polite"></span></div>' : '<p class="tiny muted">Recording isn’t available in this browser. The timer and the self-review still work.</p>') +
      '<h4 class="df-h">Self-review after each run</h4><div id="df-rev"></div>' +
      '<div class="jq"><label for="df-next">My next step (what exactly I’ll practise)</label><textarea id="df-next" rows="2"></textarea></div><ol class="df-log" id="df-log"></ol>';
    passRG = radios($("#df-pass"), { label:"Text", cls:"chips", options:[{ id:"tc2", t:"Practice paragraph" }, { id:"mine", t:"My cue notes" }], value:S.pass, onChange:function(v){ S.pass = v; api.save(); paintMk(); paintRead(); } });
    toolRG = radios($("#df-tool"), { label:"Tool", cls:"chips", options:X.tools, value:S.tool, onChange:function(v){ S.tool = v; api.save(); } });
    $("#df-next").value = S.next || "";
    paintRev(); paintLog(); paintMk();
    voiceReady(function(v){ $("#df-lis").hidden = !v; $("#df-nov-note").textContent = v ? "" : X.noVoice; });
  }
  var mkCur = 0;
  function paintMk(){
    var T = toksOf(passText(S)), m = marksOf(S), el = $("#df-mk");
    if (!T.length) { el.innerHTML = '<p class="tiny muted">Write cue notes in Plan mode first, or mark the practice paragraph.</p>'; $("#df-mn").textContent = ""; paintSent(); return; }
    var h = '<div class="df-mkt" role="group" aria-label="' + (S.pass === "tc2" ? "Practice paragraph" : "My cue notes") + ': words and the gaps after them">';
    T.forEach(function(t, i){
      var st = m.e.indexOf(i) >= 0, sl = m.s.indexOf(i) >= 0, pa = m.p.indexOf(i) >= 0;
      h += '<button type="button" class="df-w' + (st ? " st" : "") + (sl ? " sl" : "") + '" data-mw="' + i + '" tabindex="-1" aria-label="' + esc(t.t + (st ? ", stressed" : "") + (sl ? ", slow down" : "") + (pa ? ", pause after" : "")) + '">' + esc(t.t) + (sl ? '<span class="df-tilde" aria-hidden="true">~</span>' : "") + "</button>" +
        '<span class="df-g' + (pa ? " on" : "") + '" aria-hidden="true">' + (pa ? "/" : "") + "</span>";
    });
    el.innerHTML = h + "</div>";
    var all = $$("[data-mw]", el), k = Math.min(mkCur, all.length - 1); if (all[k]) all[k].tabIndex = 0;
    $("#df-mn").textContent = m.p.length + " pauses · " + m.e.length + " stresses · " + m.s.length + " slow";
    paintSent();
  }
  function paintSent(){
    var sel = $("#df-sent"); if (!sel) return; var ss = sentencesOf(passText(S)), cur = sel.value;
    sel.innerHTML = ss.map(function(s, i){ return '<option value="' + i + '">' + esc(s.length > 60 ? s.slice(0, 57) + "…" : s) + "</option>"; }).join("");
    if (cur && +cur < ss.length) sel.value = cur;
  }
  function paintRev(){
    $("#df-rev").innerHTML = '<div class="df-revs">' + X.review.map(function(r, i){ return '<div class="df-rv"><span class="df-rvl" id="df-rvl' + i + '">' + r + '</span><div id="df-rv' + i + '"></div></div>'; }).join("") + "</div>";
    X.review.forEach(function(r, i){ radios($("#df-rv" + i), { aria:r, cls:"chips", options:X.levels.map(function(l, k){ return { id:String(k), t:l }; }), value:S.rev[i] == null ? "" : String(S.rev[i]), onChange:function(v){ S.rev[i] = +v; api.save(); paintRead(); upd(); } }); });
  }
  function paintLog(){ var el = $("#df-log"); if (el) el.innerHTML = S.runs.length ? S.runs.map(function(r, i){ return "<li>Run " + (i + 1) + ": " + mmss(r.s) + "</li>"; }).join("") : ""; }
  function timerTick(){ var s = (Date.now() - TIMER.t0) / 1000, c = $("#df-clock"); if (!c) return; c.textContent = mmss(s); $("#df-timer").classList.toggle("df-due", s >= total(S)); }
  function toggleTimer(){
    var b = $("#df-go");
    if (!TIMER.on) { TIMER.on = true; TIMER.t0 = Date.now(); TIMER.iv = setInterval(timerTick, 250); timerTick(); b.textContent = "Stop timer"; $("#df-timer").classList.add("on"); return; }
    clearInterval(TIMER.iv); TIMER.on = false; var s = Math.round((Date.now() - TIMER.t0) / 1000); b.textContent = "Start timer"; $("#df-timer").classList.remove("on", "df-due");
    if (s >= 60) { S.runs.push({ s:s }); api.save(); paintLog(); paintRead(); upd(); MV.changed(); $("#df-clock").textContent = mmss(s) + " ✓ logged"; }
    else $("#df-clock").textContent = mmss(s) + " (under 1 minute, not logged)";
  }
  function listen(){
    var b = $("#df-listen"); if (b.dataset.on) { stopAll(); return; }
    var ss = sentencesOf(passText(S)), i = +($("#df-sent").value || 0), s = ss[i]; if (!s) return;
    var T = toksOf(passText(S)), off = 0; for (var k = 0; k < i; k++) off += toksOf(ss[k]).length;
    var m = marksOf(S), parts = [], cur = [], st = false;
    toksOf(s).forEach(function(t, j){ var gi = off + j; cur.push(t.t); if (m.e.indexOf(gi) >= 0) st = true; if (m.p.indexOf(gi) >= 0 || j === toksOf(s).length - 1) { parts.push({ t:cur.join(" "), st:st, gap:m.p.indexOf(gi) >= 0 ? 600 : 0 }); cur = []; st = false; } });
    void T; b.dataset.on = "1"; b.textContent = "Stop";
    seq(parts, { rate:S.pace / 165, off:function(){ delete b.dataset.on; b.textContent = "Listen at my pace"; } });
  }
  function record(){
    var b = $("#df-rec");
    if (REC.mr && REC.mr.state === "recording") { REC.mr.stop(); return; }
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(stream){
      var chunks = []; REC.mr = new MediaRecorder(stream);
      REC.mr.ondataavailable = function(ev){ chunks.push(ev.data); };
      REC.mr.onstop = function(){ stream.getTracks().forEach(function(t){ t.stop(); }); if (REC.url) URL.revokeObjectURL(REC.url); REC.url = URL.createObjectURL(new Blob(chunks, { type:REC.mr.mimeType || "audio/webm" })); $("#df-recp").disabled = false; b.textContent = "Record again"; $("#df-recs").textContent = "Recorded. Kept in this page’s memory only."; };
      REC.mr.start(); b.textContent = "Stop recording"; $("#df-recs").textContent = "Recording…";
    }).catch(function(){ $("#df-recs").textContent = "The microphone isn’t available. The timer and the self-review still work."; });
  }

  // ----- Question drill -----
  var tagTok = null;
  function order(){ return MV.shuffle(X.bank.map(function(_, i){ return i; }), S.drill.seed); }
  function curQ(){ return S.drill.i < 0 ? null : X.bank[order()[S.drill.i % X.bank.length]]; }
  function ans(q){ return S.drill.ans[q.id] || (S.drill.ans[q.id] = { type:"", text:"", tags:{}, said:false }); }
  function buildDrill(){
    var el = $("#df-drill"), q = curQ();
    var h = '<div class="df-qc">' + (q ? '<p class="df-qn tiny muted">Question ' + (S.drill.i + 1) + ' of the drill</p><p class="df-qt">' + fillQ(S, q) + "</p>" : '<p class="df-qt">Draw a question to start.</p>') +
      '<div class="q-actions"><button type="button" class="btn primary sm" id="df-draw" data-k="draw">' + (q ? "Draw another" : "Draw a question") + "</button></div></div>";
    if (q) {
      var a = ans(q);
      h += '<div id="df-type"></div><div id="df-tfb" aria-live="polite"></div>' +
        '<div class="jq"><label for="df-ans">Your answer</label><textarea id="df-ans" rows="3"></textarea></div>' +
        '<div class="q-actions"><button type="button" class="btn sm" id="df-say" data-k="say">Say it (60 s)</button><span class="df-clock sm" id="df-sayc" aria-live="off"></span></div>' +
        '<h4 class="df-h">Tag your moves</h4><p class="tiny muted">Select words in your answer (tap, or Shift + arrows), then press a move.</p><div id="df-tok" class="df-tok"></div>' +
        '<div class="q-actions" id="df-mvb">' + X.moves.map(function(m){ return '<button type="button" class="btn ghost sm df-mv df-mv-' + m.id + '" data-mv="' + m.id + '" data-k="mv' + m.id + '">' + m.t + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" id="df-tclr" data-k="tclr">Clear tags</button></div>';
      void a;
    }
    h += '<details class="alg df-build" id="df-build"' + (fx.build ? " open" : "") + '><summary>Answer builder (challenge 3)</summary><p class="df-qt">“' + X.tc3q + '”</p><p class="tiny muted">Tap chips to build your answer in order; tap a chip in your answer to take it out.</p>' +
      '<div class="df-bank" id="df-bank"></div><ol class="df-seq" id="df-seq"></ol><div class="q-actions"><button type="button" class="btn ghost sm" id="df-bclr" data-k="bclr">Clear my answer</button></div></details>';
    el.innerHTML = h;
    if (q) {
      var A = ans(q);
      radios($("#df-type"), { label:"Type it", cls:"chips", options:X.types, value:A.type, onChange:function(v){ A.type = v; api.save(); paintTfb(); paintRead(); } });
      $("#df-ans").value = A.text || "";
      tagTok = MV.eng.tokens($("#df-tok"), toksOf(A.text), { label:"Your answer: select words to tag", marks:function(){ return tagMarks(A); }, onChange:function(){} });
      paintTfb();
    }
    paintBuild();
  }
  function tagMarks(A){ var out = [], n = toksOf(A.text).length; X.moves.forEach(function(m){ var w = (A.tags[m.id] || []).filter(function(i){ return i < n; }); if (w.length) out.push({ w:w, role:m.role, tag:m.t }); }); return out; }
  function paintTfb(){
    var q = curQ(), el = $("#df-tfb"); if (!q || !el) return; var A = ans(q);
    el.innerHTML = !A.type ? "" : MV.fbHTML(A.type === q.type ? "good" : "bad", (A.type === q.type ? "<strong>✓ " + X.types.filter(function(t){ return t.id === q.type; })[0].t + ".</strong> " : "<strong>✗ Not quite.</strong> ") + X.typeFb[A.type === q.type ? q.type : A.type].replace(/^It/, A.type === q.type ? "It" : "That type: it") + (A.type === q.type ? "" : " Listen again: what is this question asking for?"));
  }
  function paintBuild(){
    var b = $("#df-bank"), s = $("#df-seq"); if (!b) return;
    MV.keepFocus(b, function(){ b.innerHTML = X.tc3chips.map(function(c){ var used = S.tc3.indexOf(c.id) >= 0; return '<button type="button" class="df-chip" data-bc="' + c.id + '" data-k="bc' + c.id + '"' + (used ? " disabled" : "") + '><span class="tag">' + c.id + "</span> " + c.t + "</button>"; }).join(""); });
    MV.keepFocus(s, function(){ s.innerHTML = S.tc3.length ? S.tc3.map(function(id, i){ var c = X.tc3chips.filter(function(x){ return x.id === id; })[0]; return '<li><button type="button" class="df-chip on" data-br="' + i + '" data-k="br' + id + '" aria-label="' + esc("Take out " + id + ": " + MV.plain(c.t)) + '"><span class="tag">' + id + "</span> " + c.t + "</button></li>"; }).join("") : '<li class="tiny muted">Your answer is empty.</li>'; });
  }
  function sayTick(){ var left = 60 - (Date.now() - SAY.t0) / 1000, c = $("#df-sayc"); if (!c) { clearInterval(SAY.iv); SAY.on = false; return; } if (left <= 0) { stopSay(true); return; } c.textContent = mmss(left) + " left"; }
  function stopSay(full){ clearInterval(SAY.iv); SAY.on = false; var b = $("#df-say"), c = $("#df-sayc"), q = curQ(); if (b) b.textContent = "Say it (60 s)"; if (c) c.textContent = full ? "Time. How did it go?" : ""; if (q) { ans(q).said = true; api.save(); paintRead(); } }

  // ----- predictions demo -----
  function closeDemo(){ fx.demo = null; var d = $("#df-demo"); if (d) { d.hidden = true; d.innerHTML = ""; } }
  function demo(p){
    var d = $("#df-demo"), h = '<div class="df-dh"><strong>Listen and compare</strong><button type="button" class="btn ghost sm" id="df-dx" data-k="dx">Back to the coach</button></div>';
    if (p.id === "p1") {
      var w = X.p1.sentence.split(" ");
      h += '<p class="df-dl">Version 1</p>' + bars(w, { cls:"v1" }) + '<p class="df-dl">Version 2 (one beat before “hear”)</p>' + bars(w, { cls:"v2", gapBefore:X.p1.pauseBefore }) + '<p class="df-sent">“' + X.p1.sentence + '”</p>' + audHTML(["", "", "", "", "", "", "", ""], "Audience: waiting") + '<p class="tiny muted" id="df-dn"></p>';
    } else if (p.id === "p2") {
      var w2 = X.p2.para.split(" ");
      h += '<p class="df-sent tiny">' + X.p2.para + ' <span class="muted">(' + w2.length + ' words)</span></p><p class="df-dl">At 150 words per minute</p>' + bars(w2, { cls:"v150 df-sm" }) + '<p class="df-dl">At 200 words per minute</p>' + bars(w2, { cls:"v200 df-sm" }) + audHTML(["", "", "", "", "", "", "", ""], "Audience: waiting");
    } else if (p.id === "p3") {
      h += '<div class="df-stills"><figure class="df-sf" id="df-sfa">' + stillSVG("script") + '<figcaption>Eyes on a full script</figcaption></figure><figure class="df-sf" id="df-sfb">' + stillSVG("card") + "<figcaption>Eyes on the audience, cue card in hand</figcaption></figure></div>";
    } else {
      h += '<p class="df-qt">“' + X.p4.q + '”</p><div class="df-ans2"><div class="df-ab"><p class="df-dl">Answer 1</p><p>“' + X.p4.a1 + '”</p><div class="df-eth"><span id="df-e1"></span></div></div>' +
        '<div class="df-ab"><p class="df-dl">Answer 2</p><p>“' + X.p4.a2 + '”</p><div class="df-eth"><span id="df-e2"></span></div></div></div><p class="tiny muted">The bars show the audience’s trust (ethos).</p>';
    }
    d.innerHTML = h; d.hidden = false; fx.demo = p.id;
  }
  function setAud(states, label){ var a = $("#df-demo .df-aud"); if (!a) return; $$(".df-li", a).forEach(function(x, i){ x.setAttribute("class", "df-li " + (states[i] || "")); }); a.setAttribute("aria-label", label); }
  function runBars(sel, step, done){
    var B = $$(sel + " .df-bar"); if (MV.reduceMotion) { B.forEach(function(b){ b.classList.add("lit"); }); done(); return; }
    var i = 0; (function go(){ if (!fx.demo) return; if (i >= B.length) { done(); return; } B[i].classList.add("lit"); var gap = B[i].previousElementSibling && B[i].previousElementSibling.classList.contains("df-gap") ? 0 : 0; i++; setTimeout(go, step + gap); })();
  }

  // ----- readout -----
  function paintRead(){
    var R = [], t = total(S), lim = S.limit * 60, A = activeSegs(S);
    R.push(["Planned total", mmss(t) + " of " + mmss(lim) + (t > lim ? ' <span class="df-warn">⚠ over by ' + mmss(t - lim) + "</span>" : "")]);
    var words = 0, secs = 0; A.forEach(function(s){ var n = wc(S.seg[s.id].n); if (n) { words += n; secs += n / S.pace * 60; } });
    R.push(["Estimated speaking time", words ? mmss(secs) + " (" + words + " cue-note words at " + S.pace + " wpm)" : "Write cue notes to estimate"]);
    var cl = A.filter(function(s){ return s.claim; }).reduce(function(x, s){ return x + (+S.seg[s.id].s || 0); }, 0), w = [];
    if (t && (+S.seg.thesis.s) / t > 0.2) w.push("thesis and roadmap over 20%"); if (t && (+S.seg.open.s) / t > 0.15) w.push("opening over 15%");
    R.push(["Segment balance", (t ? "Claims: " + Math.round(cl / t * 100) + "% of time" : "—") + (w.length ? ' <span class="df-warn">⚠ ' + w.join("; ") + "</span>" : "")]);
    var m = marksOf(S), nw = toksOf(passText(S)).length;
    R.push(["Delivery marks", "pauses " + m.p.length + " · stresses " + m.e.length + " · slow " + m.s.length + (nw && m.e.length > nw / 8 ? ' <span class="df-warn">⚠ When everything is stressed, nothing is</span>' : "")]);
    R.push(["Rehearsals", S.runs.length ? S.runs.length + " completed · last " + mmss(S.runs[S.runs.length - 1].s) : "none yet (a run counts at 1 minute)"]);
    var types = {}; Object.keys(S.drill.ans).forEach(function(id){ var a = S.drill.ans[id], q = X.bank.filter(function(b){ return b.id === id; })[0]; if (q && (wc(a.text) || a.said)) types[q.type] = 1; });
    R.push(["Question types practised", Object.keys(types).length + " of 4"]);
    var q = curQ(), mv = q ? movesOf(ans(q)) : {};
    R.push(["Answer moves used (last answer)", X.moves.map(function(x){ return x.t.toLowerCase() + " " + (mv[x.id] ? "✓" : "○") + '<span class="vh">' + (mv[x.id] ? " (used)" : " (not used)") + "</span>"; }).join(" ")]);
    var mx = 0, mi = -1; S.slides.forEach(function(sl, i){ var n = wc(sl.t); if (n >= mx) { mx = n; mi = i; } });
    R.push(["Slide text", mi < 0 ? "no slides" : mx + " words on slide " + (mi + 1) + (mx > 25 ? ' <span class="df-warn">⚠ over 25 words</span>' : "")]);
    $("#df-read").innerHTML = MV.readoutHTML(R);
  }
  function upd(){ if (MV._taskUpdate) try { MV._taskUpdate(); TASK.digest(); } catch (e) {} }

  function paint(){
    modeRG.set(S.mode); novRG.set(S.novel);
    $("#df-plan").hidden = S.mode !== "plan"; $("#df-reh").hidden = S.mode !== "rehearse"; $("#df-drill").hidden = S.mode !== "drill";
    if (S.mode === "plan" && !$("#df-segs")) buildPlan();
    if (S.mode === "rehearse") { if (!$("#df-mk")) buildReh(); else { paintMk(); paintLog(); } $("#df-planned").textContent = "planned " + mmss(total(S)); }
    if (S.mode === "drill") buildDrill();
    paintRead(); MV.changed();
  }

  host.addEventListener("input", function(e){
    var t = e.target, d = t.dataset;
    if (d.my) { S.my[d.my] = t.value; api.save(); paintRead(); upd(); return; }
    if (t.id === "df-limit") { S.limit = +t.value; planOuts(); api.save(); paintRead(); upd(); MV.changed(); return; }
    if (t.id === "df-pace") { S.pace = +t.value; planOuts(); api.save(); paintRead(); return; }
    if (d.ss) { var v = Math.max(0, Math.min(180, Math.round(+t.value || 0))); S.seg[d.ss].s = v; api.save(); paintRead(); upd(); MV.changed(); return; }
    if (d.sn) { S.seg[d.sn].n = t.value; api.save(); paintRead(); upd(); return; }
    if (d.slt != null) { S.slides[+d.slt].t = t.value; $("#df-slw" + d.slt).innerHTML = slideWords(wc(t.value)); api.save(); paintRead(); return; }
    if (t.id === "df-next") { S.next = t.value; api.save(); upd(); return; }
    if (t.id === "df-ans") { var q = curQ(); if (!q) return; var A = ans(q); A.text = t.value; api.save(); if (tagTok) { tagTok.setTokens(toksOf(A.text)); tagTok.paint(); } paintRead(); return; }
  });
  host.addEventListener("change", function(e){ var d = e.target.dataset; if (d.sly != null) { S.slides[+d.sly].lay = e.target.value; api.save(); } if (d.ss) e.target.value = S.seg[d.ss].s; });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.disabled) return;
    var d = b.dataset;
    if (b.id === "df-c3") { S.c3 = !S.c3; api.save(); planOuts(); paintSegs(); paintRead(); upd(); MV.changed(); return; }
    if (b.id === "df-sla") { S.slides.push({ lay:"quote", t:"" }); api.save(); paintSlides(); paintRead(); var ta = $('[data-slt="' + (S.slides.length - 1) + '"]'); if (ta) ta.focus(); return; }
    if (d.slx != null) { S.slides.splice(+d.slx, 1); api.save(); paintSlides(); paintRead(); return; }
    if (b.id === "df-go") { toggleTimer(); return; }
    if (d.mw != null) { var i = +d.mw, m = marksOf(S), arr = S.tool === "pause" ? m.p : S.tool === "slow" ? m.s : m.e, k = arr.indexOf(i); if (k < 0) arr.push(i); else arr.splice(k, 1); arr.sort(num); mkCur = $$("[data-mw]", $("#df-mk")).indexOf(b); api.save(); paintMk(); paintRead(); MV.changed(); var nb = $$("[data-mw]", $("#df-mk"))[mkCur]; if (nb) nb.focus(); return; }
    if (b.id === "df-mclr") { S.mk[S.pass] = { p:[], e:[], s:[] }; api.save(); paintMk(); paintRead(); MV.changed(); return; }
    if (b.id === "df-listen") { listen(); return; }
    if (b.id === "df-rec") { record(); return; }
    if (b.id === "df-recp" && REC.url) { new Audio(REC.url).play(); return; }
    if (b.id === "df-draw") { if (SAY.on) stopSay(false); S.drill.i++; api.save(); buildDrill(); paintRead(); var dq = $("#df-draw"); if (dq) dq.focus(); return; }
    if (b.id === "df-say") { if (SAY.on) { stopSay(false); return; } SAY.on = true; SAY.t0 = Date.now(); SAY.iv = setInterval(sayTick, 250); sayTick(); b.textContent = "Stop"; return; }
    if (d.mv) { var q = curQ(); if (!q || !tagTok) return; var A = ans(q), sel = tagTok.get(); if (!sel.length) { MV.banner("", "Select some words in your answer first, then press a move."); return; } X.moves.forEach(function(x){ A.tags[x.id] = (A.tags[x.id] || []).filter(function(j){ return sel.indexOf(j) < 0; }); }); A.tags[d.mv] = (A.tags[d.mv] || []).concat(sel).sort(num); tagTok.clear(); tagTok.paint(); api.save(); paintRead(); return; }
    if (b.id === "df-tclr") { var q2 = curQ(); if (q2) { ans(q2).tags = {}; if (tagTok) tagTok.paint(); api.save(); paintRead(); } return; }
    if (d.bc) { S.tc3.push(d.bc); api.save(); paintBuild(); MV.changed(); return; }
    if (d.br != null) { S.tc3.splice(+d.br, 1); api.save(); paintBuild(); MV.changed(); var f = $("#df-bank [data-bc]:not([disabled])"); if (f && !$("#df-seq [data-br]")) f.focus(); return; }
    if (b.id === "df-bclr") { S.tc3 = []; api.save(); paintBuild(); MV.changed(); return; }
    if (b.id === "df-dx") { closeDemo(); return; }
  });
  host.addEventListener("toggle", function(e){ if (e.target.id === "df-build") fx.build = e.target.open; }, true);
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-mw]"); if (!b) return;
    var all = $$("[data-mw]", $("#df-mk")), i = all.indexOf(b), dd = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : e.key === "Home" ? -1e4 : e.key === "End" ? 1e4 : 0;
    if (!dd) return; e.preventDefault(); var j = Math.max(0, Math.min(all.length - 1, i + dd)); b.tabIndex = -1; all[j].tabIndex = 0; all[j].focus(); mkCur = j;
  });
  document.addEventListener("keydown", function(e){
    if (e.key !== " " || S.mode !== "rehearse") return;
    var v = $('.view[data-view="explore"]'); if (!v || v.hidden) return;
    var t = e.target; if (t && t.closest && t.closest("input,textarea,select,button,a,[contenteditable],summary")) return;
    e.preventDefault(); toggleTimer();
  });
  document.addEventListener("click", function(e){
    var b = e.target.closest(".df-setup"); if (!b) return;
    var id = b.dataset.setup; closeDemo();
    if (id === "tc1") { S.mode = "plan"; S.limit = 6; var lm = $("#df-limit"); if (lm) { lm.value = 6; planOuts(); } }
    else if (id === "tc2") { S.mode = "rehearse"; S.pass = "tc2"; if (passRG) passRG.set("tc2"); }
    else { S.mode = "drill"; fx.build = true; }
    api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc1" ? $('[data-ss="open"]') : id === "tc2" ? $("#df-mk [tabindex='0']") : $("#df-bank [data-bc]:not([disabled])");
    if (f) f.focus({ preventScroll:true });
  });
  window.addEventListener("pagehide", function(){ if (REC.url) { URL.revokeObjectURL(REC.url); REC.url = null; } });

  EX = { stop:function(){ stopAll(); if (SAY.on) stopSay(false); }, paint:paint };

  // ----- challenges -----
  function tc1(){
    var M = X.challenges[0].msgs, K = MV.ans(X.tc1key), t = total(S), g = function(id){ return +S.seg[id].s || 0; }, claims = activeSegs(S).filter(function(s){ return s.claim; }).map(function(s){ return g(s.id); });
    if (S.limit !== 6) return { ok:false, msg:M.limit };
    if (t > K.total[1]) return { ok:false, msg:M.over };
    if (g("thesis") < K.thesis[0]) return { ok:false, msg:M.thesis };
    if (claims.some(function(c){ return c < K.claim[0]; })) return { ok:false, msg:M.claim };
    if (g("open") > K.open[1]) return { ok:false, msg:M.open };
    if (t < K.total[0]) return { ok:false, msg:M.under };
    if (g("thesis") > K.thesis[1]) return { ok:false, msg:M.thesisHi };
    if (claims.some(function(c){ return c > K.claim[1]; })) return { ok:false, msg:M.claimHi };
    if (g("open") < K.open[0]) return { ok:false, msg:M.openLo };
    if (g("close") < K.close[0] || g("close") > K.close[1]) return { ok:false, msg:M.close };
    if (g("invite") < K.invite[0] || g("invite") > K.invite[1]) return { ok:false, msg:M.invite };
    return { ok:true };
  }
  function tc2(){
    var M = X.challenges[1].msgs, T = toksOf(X.para), m = S.mk.tc2 || { p:[], e:[], s:[] };
    function idx(w, raw){ for (var i = 0; i < T.length; i++) if (raw ? T[i].t === w : nk(T[i].t) === w) return i; return -1; }
    var see = idx("see"), hear = idx("hear"), ref = idx("refuse"), colon = idx("know:", true), hop = idx("learning,", true);
    if (m.e.length > 6) return { ok:false, msg:M.many };
    if (m.p.indexOf(colon) < 0) return { ok:false, msg:M.colon };
    if (m.e.indexOf(hear) < 0) return { ok:false, msg:M.hear };
    if (m.e.indexOf(see) < 0) return { ok:false, msg:M.see };
    if (m.e.indexOf(ref) < 0) return { ok:false, msg:M.refuse };
    if (m.p.indexOf(hop) < 0) return { ok:false, msg:M.hoping };
    return { ok:true };
  }
  function tc3(){
    var M = X.challenges[2].msgs, s = S.tc3, K = MV.ans(X.tc3key);
    if (s.indexOf("c2") >= 0) return { ok:false, msg:M.c2 };
    if (s.indexOf("c6") >= 0) return { ok:false, msg:M.c6 };
    if (!s.length) return { ok:false, msg:M.empty };
    if (s.indexOf("c4") < 0) return { ok:false, msg:M.c4 };
    if (s.indexOf("c5") !== s.length - 1) return { ok:false, msg:M.c5 };
    if (s.join() === K.join()) return { ok:true };
    return { ok:false, msg:M.order };
  }
  paint();
  return {
    predict:{
      start:function(p){
        stopAll(); S.mode = p.id === "p4" ? "drill" : "rehearse"; api.save(); paint(); demo(p);
        if (p.id === "p4") { $("#df-e1").style.width = "20%"; $("#df-e2").style.width = "20%"; }
      },
      run:function(p, done){
        if (fx.demo !== p.id) demo(p);
        if (p.id === "p1") {
          var w = X.p1.sentence.split(" "), items = function(v){ return w.map(function(x, i){ return { t:x, dur:260, gap:v === 2 && i === X.p1.pauseBefore - 1 ? 650 : 0, st:v === 2 && i === X.p1.pauseBefore, on:function(){ var b = $$("#df-demo .v" + v + " .df-bar")[i]; if (b) b.classList.add("lit"); } }; }); };
          var it = items(1).concat([{ t:"", dur:500, gap:300 }]).concat(items(2));
          if (VOICE) it = [{ t:X.p1.sentence, on:function(){ $$("#df-demo .v1 .df-bar").forEach(function(b){ b.classList.add("lit"); }); }, gap:600 }, { t:"We", on:function(){ var b = $$("#df-demo .v2 .df-bar")[0]; if (b) b.classList.add("lit"); }, gap:700 }, { t:w.slice(1).join(" "), st:true, on:function(){ $$("#df-demo .v2 .df-bar").forEach(function(b){ b.classList.add("lit"); }); } }];
          seq(it.filter(function(x){ return x.t || !VOICE; }), { silent:!VOICE }, function(){
            var b = $$("#df-demo .v2 .df-bar")[X.p1.pauseBefore]; if (b) b.classList.add("hi");
            setAud(["eng", "eng", "eng", "eng", "eng", "eng", "eng", "eng"], "Audience: heads tilt, engaged, as “hear” stands out");
            MV.wait(900, done);
          });
          return;
        }
        if (p.id === "p2") {
          setAud(["eng", "eng", "eng", "eng", "eng", "eng", "eng", "eng"], "Audience at 150 words per minute: all engaged");
          runBars("#df-demo .v150", 40, function(){
            MV.wait(400, function(){
              var k = 0, B = $$("#df-demo .v200 .df-bar"), n = B.length;
              runBars("#df-demo .v200", 30, function(){ setAud(["eng", "lost", "eng", "lost", "lost", "eng", "lost", "eng"], "Audience at 200 words per minute: half the heads droop, lost"); MV.wait(900, done); });
              void k; void n;
            });
          });
          return;
        }
        if (p.id === "p3") { $("#df-sfb").classList.add("on"); $("#df-sfa").classList.add("off"); MV.wait(1400, done); return; }
        $("#df-e1").style.width = "20%"; $("#df-e2").style.width = "85%"; $("#df-e2").parentNode.classList.add("up"); MV.wait(1400, done);
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: Handling the hard question — four listening-and-response stations ----------
function stanceSVG(id){
  var body = '<circle cx="40" cy="20" r="11" class="df-head"/><line x1="40" y1="31" x2="40" y2="78" class="df-ink"/><line x1="40" y1="78" x2="30" y2="110" class="df-ink"/><line x1="40" y1="78" x2="50" y2="110" class="df-ink"/>';
  var arms = id === "cross" ? '<path d="M26 52 L54 60 M54 52 L26 60" class="df-ink"/>' :
    id === "open" ? '<path d="M40 44 L20 66 M40 44 L60 66" class="df-ink"/><circle cx="18" cy="68" r="3" class="df-hand"/><circle cx="62" cy="68" r="3" class="df-hand"/>' :
    '<path d="M40 44 L28 62 M40 44 L52 62" class="df-ink"/>';
  var eyes = id === "notes" ? '<line x1="40" y1="24" x2="46" y2="27" class="df-ink"/><rect x="30" y="60" width="22" height="14" rx="1" class="df-paper"/>' : id === "eyes" ? '<line x1="44" y1="18" x2="50" y2="18" class="df-ink"/><line x1="52" y1="18" x2="76" y2="18" class="df-eye on"/>' : "";
  return '<svg viewBox="0 0 80 114" class="df-stance" aria-hidden="true">' + body + arms + eyes + "</svg>";
}
function part3(host, api){
  var C = MV.C.part3.stations, S = api.S;
  S.s1 = S.s1 == null ? null : S.s1; S.s2 = S.s2 || { tags:{}, ok:false, tab:"a" }; S.s3 = S.s3 || {}; S.s4 = S.s4 || { pick:{}, chk:false };
  var A0 = C.s2.answers[C.s2.tagIdx];
  host.innerHTML = '<div class="hq">' +
    '<section class="hq-st"><h3 class="df-h">Station 1: Listen first</h3><p class="hq-q" id="hq-q1">“' + C.s1.q + '”</p><div class="q-actions"><button type="button" class="btn sm" id="hq-l1" hidden>Listen</button></div><p>Choose the best paraphrase.</p><div class="opts" id="hq-o1"></div><div id="hq-f1" aria-live="polite"></div></section>' +
    '<section class="hq-st"><h3 class="df-h">Station 2: The four moves, three ways</h3><p>Three model answers to the same question. First tag the four moves in “' + A0.t + '”; then compare the other two.</p><div id="hq-tab"></div><div id="hq-ans"></div></section>' +
    '<section class="hq-st"><h3 class="df-h">Station 3: “I don’t know”, done well</h3><p>An extension question you haven’t researched: “' + C.s3.q + '”</p><div class="hq-two"><div class="hq-r"><p class="df-dl">Response 1</p><p>“' + C.s3.r1 + '”</p><button type="button" class="btn ghost sm" data-pick="1" data-k="pk1">This one keeps ethos</button></div><div class="hq-r"><p class="df-dl">Response 2</p><p>“' + C.s3.r2 + '”</p><button type="button" class="btn ghost sm" data-pick="2" data-k="pk2">This one keeps ethos</button></div></div><div id="hq-f3" aria-live="polite"></div><div id="hq-why"></div></section>' +
    '<section class="hq-st"><h3 class="df-h">Station 4: Under pressure, the body speaks</h3><p>Match each stance to what the audience reads in it.</p><div class="hq-stances" id="hq-s4"></div><div class="q-actions"><button type="button" class="btn primary sm" id="hq-c4" data-k="c4">Check</button></div><div id="hq-f4" aria-live="polite"></div></section></div>';
  function opts(list, chosen, attr){
    var ri = MV.right(list);
    return list.map(function(o, i){ var c = "opt"; if (chosen === i) c += i === ri ? " right" : " wrong"; return '<button type="button" class="' + c + '" data-' + attr + '="' + i + '" data-k="' + attr + i + '"><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>"; }).join("");
  }
  function p1(){ MV.keepFocus($("#hq-o1"), function(){ $("#hq-o1").innerHTML = opts(C.s1.options, S.s1, "o1"); }); $("#hq-f1").innerHTML = S.s1 == null ? "" : MV.fbHTML(MV.ok(C.s1.options[S.s1]) ? "good" : "bad", C.s1.options[S.s1].why); }
  var tabRG = radios($("#hq-tab"), { label:"Answer", cls:"chips", options:C.s2.answers.map(function(a){ return { id:a.id, t:a.t }; }), value:S.s2.tab, onChange:function(v){ S.s2.tab = v; api.save(); p2(); } });
  function moveT(id){ return X.moves.filter(function(m){ return m.id === id; })[0].t; }
  function p2(){
    prep(); tabRG.set(S.s2.tab);
    var a = C.s2.answers.filter(function(x){ return x.id === S.s2.tab; })[0], tagging = a === A0 && !S.s2.ok, h = '<ol class="hq-parts">';
    a.parts.forEach(function(p, i){
      h += '<li class="hq-part' + (tagging ? "" : " hq-mv-" + p.m) + '"><p>' + p.t + "</p>" + (tagging ? '<div class="chips" role="radiogroup" aria-label="' + esc("Move for sentence " + (i + 1)) + '">' + X.moves.map(function(m){ var on = S.s2.tags[i] === m.id; return '<button type="button" class="chip df-mv-' + m.id + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-tg="' + i + "|" + m.id + '" data-k="tg' + i + m.id + '">' + m.t + "</button>"; }).join("") + "</div>" : '<span class="hq-tag">' + moveT(p.m) + "</span>") + "</li>";
    });
    h += "</ol>";
    if (tagging) h += '<div class="q-actions"><button type="button" class="btn primary sm" id="hq-c2" data-k="c2">Check my tags</button></div>' + (S.s2.msg ? MV.fbHTML("bad", "<strong>✗</strong> " + S.s2.msg) : "");
    else if (a === A0) h += MV.fbHTML("good", C.s2.ok);
    MV.keepFocus($("#hq-ans"), function(){ $("#hq-ans").innerHTML = h; });
  }
  function p3(){
    $$("[data-pick]", host).forEach(function(b){ var on = S.s3.pick === +b.dataset.pick; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); });
    $("#hq-f3").innerHTML = S.s3.pick ? MV.fbHTML(S.s3.pick === 2 ? "good" : "bad", S.s3.pick === 2 ? C.s3.pickOk : C.s3.pickBad) : "";
    MV.keepFocus($("#hq-why"), function(){ $("#hq-why").innerHTML = S.s3.pick === 2 ? '<p><strong>Why does it keep ethos?</strong></p><div class="opts">' + opts(C.s3.why, S.s3.why, "o3") + "</div>" + (S.s3.why == null ? "" : MV.fbHTML(MV.ok(C.s3.why[S.s3.why]) ? "good" : "bad", C.s3.why[S.s3.why].why)) : ""; });
  }
  var K4 = MV.ans(C.s4.key);
  function p4(){
    var h = C.s4.stances.map(function(st){
      var v = S.s4.pick[st.id], res = S.s4.chk && v ? (v === K4[st.id] ? " ✓" : " ✗") : "";
      return '<div class="hq-sc">' + stanceSVG(st.id) + '<p class="df-dl">' + st.t + '<span class="hq-res">' + res + (res ? '<span class="vh">' + (res === " ✓" ? " (right)" : " (not right)") + "</span>" : "") + '</span></p><div class="chips" role="radiogroup" aria-label="' + esc("What the audience reads in: " + st.t) + '">' +
        C.s4.reads.map(function(r){ var on = v === r.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-s4="' + st.id + "|" + r.id + '" data-k="s4' + st.id + r.id + '">' + r.t + "</button>"; }).join("") + "</div></div>";
    }).join("");
    MV.keepFocus($("#hq-s4"), function(){ $("#hq-s4").innerHTML = h; });
    if (S.s4.chk) { var all = C.s4.stances.every(function(st){ return S.s4.pick[st.id] === K4[st.id]; }); $("#hq-f4").innerHTML = MV.fbHTML(all ? "good" : "bad", (all ? "<strong>✓ All four read right.</strong> " : "<strong>✗ Not yet.</strong> Look again at the ones marked ✗: what would you think if a speaker stood like that? ") + '</p><p class="hq-tip"><strong>Tip:</strong> ' + C.s4.tip); }
    else $("#hq-f4").innerHTML = "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return; var d = b.dataset;
    if (b.id === "hq-l1") { var lb = b; if (lb.dataset.on) { stopAll(); return; } lb.dataset.on = "1"; lb.textContent = "Stop"; seq([{ t:MV.plain(C.s1.q) }], { rate:1.05, off:function(){ delete lb.dataset.on; lb.textContent = "Listen"; } }); return; }
    if (d.o1 != null) { S.s1 = +d.o1; api.save(); p1(); MV.focusFb($("#hq-f1").parentNode); return; }
    if (d.tg) { var a = d.tg.split("|"); S.s2.tags[+a[0]] = a[1]; S.s2.msg = ""; api.save(); p2(); return; }
    if (b.id === "hq-c2") { var ok = A0.parts.every(function(p, i){ return S.s2.tags[i] === p.m; }); S.s2.ok = ok; S.s2.msg = ok ? "" : (A0.parts.some(function(p, i){ return !S.s2.tags[i]; }) ? "Tag every sentence first. " : "") + C.s2.bad; api.save(); p2(); MV.focusFb($("#hq-ans")); return; }
    if (d.pick) { S.s3.pick = +d.pick; api.save(); p3(); MV.focusFb($("#hq-f3").parentNode); return; }
    if (d.o3 != null) { S.s3.why = +d.o3; api.save(); p3(); return; }
    if (d.s4) { var s = d.s4.split("|"); S.s4.pick[s[0]] = s[1]; S.s4.chk = false; api.save(); p4(); return; }
    if (b.id === "hq-c4") { S.s4.chk = true; api.save(); p4(); MV.focusFb($("#hq-f4").parentNode); return; }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest('[role="radio"]'); if (!b || !host.contains(b) || b.closest(".rg") || ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].indexOf(e.key) < 0) return;
    e.preventDefault(); var all = $$("button", b.parentNode), i = all.indexOf(b), n = all[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length]; n.click(); var f = $('[data-k="' + n.dataset.k + '"]', host); if (f) f.focus();
  });
  voiceReady(function(v){ $("#hq-l1").hidden = !v; });
  p1(); p2(); p3(); p4();
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 10; numbered sentences) ----------
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Transcript ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s defence</p><ol class=\"steps-list\">";
        p.steps.forEach(function(s, si){
          h += '<li><button type="button" class="sbtn' + (st.found && si === err ? " err" : "") + '" data-k="' + p.id + "s" + si + '" data-step="' + si + '"' + (st.found ? " disabled" : "") + '><span class="sn">Sentence ' + (si + 1) + "</span><span>" + s + (st.found && si === err ? '<span class="flag">First flaw</span>' : "") + "</span></button></li>";
        });
        h += "</ol>";
        if (!st.found) {
          h += '<div class="q-actions">' + MV.hintBtn(p.id + "hint", st.hint) + "</div>" + MV.hintsHTML(p.hints, st.hint);
          if (st.lastStep != null && st.lastStep !== err) h += MV.fbHTML("bad", (p.stepFb && p.stepFb[st.lastStep]) || ("Sentence " + (st.lastStep + 1) + " is fine. Keep checking."));
        } else {
          h += MV.fbHTML("good", "<strong>✓ You found it: sentence " + (err + 1) + ".</strong> Now choose the best fix.");
          var ri = MV.right(p.fixes);
          h += '<div class="opts" style="margin-top:12px">' + p.fixes.map(function(f, fi){
            var c = "opt"; if (st.fixed && fi === ri) c += " right"; else if (st.lastFix === fi && fi !== ri) c += " wrong";
            return '<button type="button" class="' + c + '" data-k="' + p.id + "f" + fi + '" data-fix="' + fi + '"' + (st.fixed ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + fi) + "</span><span>" + f.t + "</span></button>";
          }).join("") + "</div>";
          if (st.lastFix != null) { var f = p.fixes[st.lastFix], good = st.lastFix === ri; h += MV.fbHTML(good ? "good" : "bad", "<strong>" + (good ? "✓ That’s the fix." : "✗ Not quite. Try another fix.") + "</strong> " + (f.why || "")); }
        }
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-sp]"); if (!bx) return;
    var p = a.problems.filter(function(x){ return x.id === bx.dataset.sp; })[0], st = sst(p.id), err = MV.ans(p);
    if (b.dataset.act === "hint") st.hint = Math.min(3, st.hint + 1);
    else if (b.dataset.step != null) { var si = +b.dataset.step; st.lastStep = si; if (si === err) st.found = true; else st.stepTries++; }
    else if (b.dataset.fix != null) { var fi = +b.dataset.fix; st.lastFix = fi; st.fixTries++; if (fi === MV.right(p.fixes)) st.fixed = true; }
    MV.save(); paint();
    if (b.dataset.step != null || b.dataset.fix != null) MV.focusFb($('[data-sp="' + p.id + '"]', host));
  });
  paint();
  return {
    stats:function(){
      var solved = a.problems.filter(function(p){ var s = sst(p.id); return s.found && s.fixed; }).length;
      var clean = a.problems.filter(function(p){ var s = sst(p.id); return s.found && s.fixed && s.stepTries === 0 && s.fixTries === 1 && s.hint < 3; }).length;
      return { first:clean, total:a.problems.length, done:solved, line:(a.summary || "Spot the error") + ": " + solved + "/" + a.problems.length + " solved, " + clean + " without help or retries" };
    },
    missed:function(){ var g = []; a.problems.forEach(function(p){ var s = sst(p.id); if (s.stepTries > 0 || s.fixTries > 1 || s.hint >= 3) g = g.concat(MV.goalIdx(p.goal != null ? p.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Defence plan (reads the E15 coach; its own inputs are the closing line and four anticipated
// questions with E1 move tags) ----------
var CITE = /\((?:[A-Z][\w’'-]+(?:,? )?)?(?:\d+(?:[–-]\d+)?|ch\. \d+)\)/;
var TASK = (function(){
  var api = null, T = null, toks = [];
  function E(){ prep(); return ensure(EXS || ((MV.S.app.explore = MV.S.app.explore || {}))); }
  function qs(S){ S.q = S.q || []; for (var i = 0; i < 4; i++) S.q[i] = S.q[i] || { type:"", q:"", a:"", tags:{} }; return S.q; }
  function surname(a){ var w = String(a || "").trim().split(/\s+/); return w.length ? w[w.length - 1] : ""; }
  function claimOk(n){
    var re = /["“]([^"”]{3,})["”]/g, m;
    while ((m = re.exec(n))) { var after = n.slice(m.index + m[0].length, m.index + m[0].length + 40); if (CITE.test(after)) return true; }
    return false;
  }
  function roadmap(n){
    var w = MV.eng.norm(n).split(" "), sig = ["first", "second", "third", "finally", "next", "then"], k = 0;
    sig.forEach(function(s){ if (w.indexOf(s) >= 0) k++; });
    if (k >= 2) return true;
    for (var i = 0; i < w.length; i++) if (w[i] === "two" || w[i] === "three") for (var j = i + 1; j <= i + 3 && j < w.length; j++) if (["ways", "claims", "reasons", "steps"].indexOf(w[j]) >= 0) return true;
    return false;
  }
  function data(ts){
    var S = E(), A = ts || {}, Q = qs(A), segs = activeSegs(S);
    return { S:S, close:String(A.close || ""), Q:Q, segs:segs, total:total(S), explain:(function(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); })() };
  }
  function checks(d){
    var S = d.S, lim = S.limit * 60, th = S.my.thesis || "", tw = wc(th), title = MV.eng.norm(S.my.title), sn = MV.eng.norm(surname(S.my.author)), tn = " " + MV.eng.norm(th) + " ";
    var claims = d.segs.filter(function(s){ return s.claim; });
    var types = d.Q.filter(function(q){ return q.q.trim(); }).map(function(q){ return q.type; });
    return [
      d.total >= lim - 60 && d.total <= lim + 60 && d.segs.every(function(s){ return (+S.seg[s.id].s || 0) > 0; }),
      tw >= 20 && tw <= 60 && !!title && !!sn && tn.indexOf(" " + title + " ") >= 0 && tn.indexOf(" " + sn + " ") >= 0,
      roadmap(S.seg.thesis.n || ""),
      claims.length >= 2 && claims.length <= 3 && claims.every(function(s){ return claimOk(S.seg[s.id].n || ""); }),
      types.length === 4 && ["clar", "ev", "counter", "ext"].every(function(t){ return types.filter(function(x){ return x === t; }).length === 1; }),
      d.Q.every(function(q){ var n = wc(q.a); if (n < 30 || n > 90) return false; var mv = movesOf({ text:q.a, tags:q.tags }); return X.moves.every(function(m){ return mv[m.id]; }); }),
      wc(d.close) >= 8 && wc(d.close) <= 30,
      S.runs.some(function(r){ return r.s >= 240; }),
      X.review.every(function(_, i){ return S.rev[i] != null; }) && wc(S.next) >= 10,
      wc(d.explain) >= 40
    ];
  }
  function digest(){
    var el = $("#dt-dig"); if (!el || !api) return; var S = E(), lim = S.limit * 60, t = total(S);
    var h = '<dl class="read">' + MV.readoutHTML([
      ["Novel", (S.my.title.trim() ? "<i>" + esc(S.my.title) + "</i>" : "(no title yet)") + ", " + (S.my.author.trim() ? esc(S.my.author) : "(no author yet)")],
      ["Thesis", S.my.thesis.trim() ? esc(S.my.thesis) + " <span class='tiny muted'>(" + wc(S.my.thesis) + " words)</span>" : "(not written yet)"],
      ["Time", mmss(t) + " planned for a " + mmss(lim) + " limit (" + activeSegs(S).filter(function(s){ return s.claim; }).length + " claims)"],
      ["Rehearsals", S.runs.length ? S.runs.length + " logged, longest " + mmss(Math.max.apply(null, S.runs.map(function(r){ return r.s; }))) : "none yet"],
      ["Self-review", X.review.filter(function(_, i){ return S.rev[i] != null; }).length + " of 6 rated; next step " + (wc(S.next) ? wc(S.next) + " words" : "not written")]
    ]) + '</dl><details class="alg"><summary>Segments and cue notes</summary><ol class="dt-segs">' + activeSegs(S).map(function(s){ return "<li><strong>" + s.t + "</strong> (" + (+S.seg[s.id].s || 0) + " s): " + (String(S.seg[s.id].n || "").trim() ? esc(S.seg[s.id].n) : '<span class="muted">no cue notes</span>') + "</li>"; }).join("") + "</ol></details>" +
      '<p class="tiny"><a href="#explore" class="dt-go" data-mode="plan">Edit in Plan mode</a> · <a href="#explore" class="dt-go" data-mode="rehearse">Rehearse and self-review</a></p>';
    el.innerHTML = h;
  }
  function paintQ(i){
    var S = api.S, q = qs(S)[i], el = $("#dt-q" + i), n = wc(q.a);
    $(".dt-n", el).textContent = n + " word" + (n === 1 ? "" : "s") + " · aim for 30–90";
    if (!toks[i]) toks[i] = MV.eng.tokens($(".dt-tok", el), toksOf(q.a), { label:"Answer " + (i + 1) + ": select words to tag", marks:function(){ prep(); return tagMarks2(api.S.q[i]); }, onChange:function(){} });
    else { toks[i].setTokens(toksOf(q.a)); toks[i].paint(); }
  }
  function tagMarks2(q){ var out = [], n = toksOf(q.a).length; X.moves.forEach(function(m){ var w = (q.tags[m.id] || []).filter(function(j){ return j < n; }); if (w.length) out.push({ w:w, role:m.role, tag:m.t }); }); return out; }
  function models(){
    var el = $("#dt-models"); if (!el) return;
    var show = MV.taskState().found.length > 0 || checks(data(api.S)).every(Boolean);
    el.innerHTML = show ? '<details class="alg"><summary>Other ways to build it (three model plans, all valid)</summary>' + T.models.map(function(m){ return '<div class="dt-model"><h5>' + m.title + "</h5><p>" + m.plan + '</p><p class="tiny"><strong>Questions:</strong> ' + m.qs + "</p></div>"; }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); models(); }
  return {
    digest:digest,
    render:function(inp, pv, a){
      prep(); api = a; T = MV.C.task; var S = a.S; qs(S);
      inp.innerHTML = '<div class="dt"><h4 class="df-h">From your rehearsal coach</h4><div id="dt-dig"></div>' +
        '<div class="jq"><label for="dt-close">Closing line (8–30 words)</label><textarea id="dt-close" rows="2"></textarea><p class="tiny" id="dt-cn" aria-live="polite"></p></div>' +
        '<h4 class="df-h">Four anticipated questions (one of each kind)</h4>' +
        [0, 1, 2, 3].map(function(i){ return '<fieldset class="dt-q" id="dt-q' + i + '"><legend>Question ' + (i + 1) + '</legend><label class="tiny">Kind <select data-qt="' + i + '"><option value="">choose</option>' + X.types.map(function(t){ return '<option value="' + t.id + '">' + t.t + "</option>"; }).join("") + "</select></label>" +
          '<div class="jq"><label for="dt-qq' + i + '">The question</label><input class="txtin" type="text" id="dt-qq' + i + '" data-qq="' + i + '"></div>' +
          '<div class="jq"><label for="dt-qa' + i + '">Your answer</label><textarea id="dt-qa' + i + '" rows="3" data-qa="' + i + '"></textarea><p class="tiny dt-n" aria-live="polite"></p></div>' +
          '<p class="tiny muted">Tag the moves: select words, then press a move.</p><div class="dt-tok df-tok"></div><div class="q-actions">' + X.moves.map(function(m){ return '<button type="button" class="btn ghost sm df-mv df-mv-' + m.id + '" data-tm="' + i + "|" + m.id + '">' + m.t + "</button>"; }).join("") + '<button type="button" class="btn ghost sm" data-tc="' + i + '">Clear tags</button></div></fieldset>'; }).join("") + "</div>";
      pv.innerHTML = '<div id="dt-models"></div>';
      $("#dt-close").value = S.close || ""; $("#dt-cn").textContent = wc(S.close) + " words";
      S.q.forEach(function(q, i){ $('[data-qt="' + i + '"]').value = q.type; $("#dt-qq" + i).value = q.q; $("#dt-qa" + i).value = q.a; paintQ(i); });
      inp.addEventListener("input", function(e){
        var t = e.target, d = t.dataset;
        if (t.id === "dt-close") { S.close = t.value; $("#dt-cn").textContent = wc(t.value) + " words"; changed(); return; }
        if (d.qq != null) { S.q[+d.qq].q = t.value; changed(); return; }
        if (d.qa != null) { S.q[+d.qa].a = t.value; paintQ(+d.qa); changed(); return; }
      });
      inp.addEventListener("change", function(e){ var d = e.target.dataset; if (d.qt != null) { S.q[+d.qt].type = e.target.value; changed(); } });
      inp.addEventListener("click", function(e){
        var g = e.target.closest(".dt-go"); if (g) { var ES = E(); ES.mode = g.dataset.mode; MV.save(); if (EX) EX.paint(); return; }
        var b = e.target.closest("button"); if (!b) return; var d = b.dataset;
        if (d.tm) { var p = d.tm.split("|"), i = +p[0], q = S.q[i], sel = toks[i].get(); if (!sel.length) return; X.moves.forEach(function(m){ q.tags[m.id] = (q.tags[m.id] || []).filter(function(j){ return sel.indexOf(j) < 0; }); }); q.tags[p[1]] = (q.tags[p[1]] || []).concat(sel).sort(num); toks[i].clear(); toks[i].paint(); changed(); return; }
        if (d.tc != null) { S.q[+d.tc].tags = {}; toks[+d.tc].paint(); changed(); return; }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      var chk = $("#task-check"); if (chk) chk.addEventListener("click", function(){ setTimeout(models, 0); });
      digest(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(){ return true; },
    checks:checks,
    summary:function(ts){
      prep(); T = T || MV.C.task; var d = data(ts.app || {}), c = checks(d), n = c.filter(Boolean).length, S = d.S, L = [];
      L.push("Defence plan: " + (n === 10 ? "complete (checklist 10/10)" : "in progress (" + n + "/10)"));
      L.push("  Novel: " + (S.my.title || "(no title)") + ", " + (S.my.author || "(no author)") + ". Time limit " + mmss(S.limit * 60) + "; planned " + mmss(total(S)) + "; pace " + S.pace + " wpm.");
      L.push("  Thesis: " + (S.my.thesis.trim() || "(not written)"));
      activeSegs(S).forEach(function(s){ L.push("  " + MV.plain(s.t) + " (" + (+S.seg[s.id].s || 0) + " s): " + (String(S.seg[s.id].n || "").trim().replace(/\s+/g, " ") || "(no cue notes)")); });
      d.Q.forEach(function(q, i){
        var ty = X.types.filter(function(t){ return t.id === q.type; })[0], mv = movesOf({ text:q.a, tags:q.tags });
        L.push("  Question " + (i + 1) + " (" + (ty ? ty.t : "kind not chosen") + "): " + (q.q.trim() || "(not written)"));
        L.push("    Answer: " + (q.a.trim().replace(/\s+/g, " ") || "(not written)") + " [moves: " + X.moves.map(function(m){ return m.t.toLowerCase() + " " + (mv[m.id] ? "✓" : "○"); }).join(", ") + "]");
      });
      L.push("  Closing line: " + (d.close.trim() || "(not written)"));
      L.push("  Self-review: " + X.review.map(function(r, i){ return r + ": " + (S.rev[i] == null ? "not rated" : X.levels[S.rev[i]]); }).join("; "));
      L.push("  Next step: " + (String(S.next || "").trim() || "(not written)"));
      L.push("Rehearsals logged: " + S.runs.length + (S.runs.length ? " (longest " + mmss(Math.max.apply(null, S.runs.map(function(r){ return r.s; }))) + ")" : ""));
      return L;
    }
  };
})();

// ---------- Reflect extras: sample principles, trivium tag, commonplace book; Sentence to steal saves to the commonplace book ----------
function extras(){
  var Rf = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && Rf.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">Samples only. Always write your own.</p>" + Rf.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  MV.eng.triviumPicker();
  var cp = $("#df-cp"); if (cp) MV.eng.commonplace(cp, { lines:["I was benevolent and good; misery made me a fiend", "Beware; for I am fearless, and therefore powerful", "I am no bird; and no net ensnares me", "So we beat on, boats against the current, borne back ceaselessly into the past", "Gatsby believed in the green light"] });
  var steal = $('.mv-block[data-block="steal"]');
  if (steal && !$("#steal-save")) {
    var row = document.createElement("div"); row.className = "q-actions";
    row.innerHTML = '<button type="button" class="btn ghost sm" id="steal-save">Save my closing line to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || "").trim();
      $("#steal-st").textContent = t ? (MV.eng.saveLine(t, "My closing line, after Lincoln’s antithesis (Gettysburg Address, 1863)") ? "Saved to your commonplace book." : "") : "Write your closing line first.";
    });
  }
}

MV.module({
  hero:hero,
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ spot:spotProse },
  task:TASK,
  onShow:function(v){ stopAll(); if (EX) EX.stop(); if (v !== "start" && HR.stop) HR.stop(); if (v === "explore" && EX) EX.paint(); if (v === "final-check") { try { TASK.digest(); if (MV._taskUpdate) MV._taskUpdate(); } catch (e) {} } }
});
})();
