// ENG4U 04 From Paraphrase to Analysis: hero read-aloud (lines 12–14 on sand, a ladder rising), Ladder of reading (Explore:
// E6 paragraph builder in a ladder layout with Sort, Climb, Line by line and Build modes, a voices overlay, "So what?" and rule
// readouts), Upgrade the sentence (Part 3: E4 verb dial, "how" and "so what" slots, rung meter, Zoom to the words), the rung sort,
// the unseen prose climb, Spot the Error for prose, and the "Climb the ladder" task (five-slot E6 builder, quotation integrator,
// E8 MLA line citations).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(t){ return MV.eng.wordCount(t); }

// ---------- @component radioGroup (copied from ENG4U 02 / 01; no option needs to be checked) ----------
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// ---------- @component E7 analysisRules — exact-quotation test, craft terms, analysis-verb bank, significance clauses ----------
// (course plan E7 checker rules; used by the Explore readouts, TC3 and the task checklist). Lists come from content
// (explore.lists, explore.build.sig); each listed word maps to a regex family here so inflected forms count.
var AR = (function(){
  var CRAFT = { irony:"iron(?:y|ies|ic|ical|ically)", juxtaposition:"juxtapos(?:ition|itions|e|es|ed|ing)", alliteration:"alliterat(?:ion|ions|ive|ing)",
    imagery:"(?:imagery|images?)", diction:"diction", frame:"(?:frames?|framed|framing)", enjambment:"enjamb(?:ment|ments|ed)", caesura:"caesura[es]?",
    metaphor:"metaphor(?:s|ic|ical|ically)?", personification:"personif(?:ication|ications|ies|ied|y|ying)", tone:"tones?", structure:"structur(?:e|es|al|ally)", simile:"similes?" };
  var STRONG = { undercuts:"undercut(?:s|ting)?", juxtaposes:"juxtapos(?:e|es|ed|ing)", reframes:"refram(?:e|es|ed|ing)", intensifies:"intensif(?:y|ies|ied|ying)",
    implies:"impl(?:y|ies|ied|ying)", exposes:"expos(?:e|es|ed|ing)", complicates:"complicat(?:e|es|ed|ing)", foreshadows:"foreshadow(?:s|ed|ing)?", suggests:"suggest(?:s|ed|ing)?" };
  var VAGUE = { shows:"show(?:s|ed|ing|n)?", says:"(?:say|says|said|saying)", "is about":"(?:is|are|was|were) about", "talks about":"talk(?:s|ed|ing)? about" };
  var SIGWIDE = /\b(?:which|that) (?:suggests?|implies|imply|reveals?|means)\b|\bso that\b|\bso the\b|\b(?:suggesting|implying|revealing|exposing)\b|\bmatters because\b/i;
  function L(){ return MV.C.explore.lists; }
  function nq(s){ return String(s).replace(/[“”„"]/g, '"').replace(/[‘’`]/g, "'").replace(/\s*(?:—|–|--)\s*/g, " — ").replace(/\s+/g, " ").trim().toLowerCase(); }
  function poemText(lines){
    var Ls = lines.filter(function(l){ return String(l).trim(); }).map(function(l){ return nq(MV.plain(l)).replace(/"/g, ""); });
    return { slash:" " + Ls.join(" / ") + " ", flat:" " + Ls.join(" ") + " ", n:Ls.length };
  }
  function quotes(text){
    var t = MV.plain(String(text || "")), out = [], m, re = /“([^”“]*)”|"([^"]*)"/g;
    while ((m = re.exec(t))) out.push({ inner:m[1] != null ? m[1] : m[2], at:m.index });
    var re2 = /(^|[\s(\[—–\/])[‘']((?:[^‘’'\n]|['’](?=[A-Za-z]))+)[’'](?![A-Za-z])/g;
    while ((m = re2.exec(t))) out.push({ inner:m[2], at:m.index + m[1].length });
    return out.filter(function(q){ return wc(q.inner) > 0; });
  }
  function clean(inner){ return nq(inner).replace(/"/g, "").replace(/^[\s,.;:!?…'—]+|[\s,.;:!?…'—]+$/g, ""); }
  function inPoem(inner, P){
    var q = clean(inner); if (!q) return false;
    function has(hay){ var i = hay.indexOf(q); while (i >= 0) { var b = hay.charAt(i - 1), c = hay.charAt(i + q.length); if (!/[a-z0-9']/.test(b) && !/[a-z0-9']/.test(c)) return true; i = hay.indexOf(q, i + 1); } return false; }
    return has(P.slash) || has(P.flat);
  }
  function family(map, list, t){ var s = MV.plain(String(t || "")), out = []; list.forEach(function(w){ var re = map[w] ? new RegExp("\\b" + map[w] + "\\b", "i") : null, m = re && s.match(re); if (m) out.push(m[0]); }); return out; }
  function crafts(t){ return family(CRAFT, L().craft, t); }
  function verbs(t){ return { strong:family(STRONG, L().strong, t), vague:family(VAGUE, L().vague, t) }; }
  function clauseFrom(s, i){ var rest = s.slice(i), e = rest.search(/[.!?](?:\s|$)/); return (e >= 0 ? rest.slice(0, e) : rest).trim(); }
  function sigWide(t){ var s = MV.plain(String(t || "")), m = s.match(SIGWIDE); return m ? clauseFrom(s, m.index) : null; }
  function sigTC3(t){
    var s = MV.plain(String(t || "")), best = null;
    MV.C.explore.build.sig.forEach(function(k){ var m = s.match(new RegExp("\\b" + k + "\\b", "i")); if (m && (!best || m.index < best.i)) best = { k:k, i:m.index }; });
    return best ? clauseFrom(s, best.i) : null;
  }
  function personal(t){ return /^\s*I\b|\b(?:I think|I like|I love|I found|I feel|I hate|I enjoyed|makes me)\b/.test(MV.plain(String(t || ""))); }
  function tc3(t, P){
    var B = MV.C.explore.build, Q = quotes(t), good = Q.filter(function(q){ var n = wc(q.inner); return n >= B.qmin && n <= B.qmax && inPoem(q.inner, P); }), bad = Q.filter(function(q){ return !inPoem(q.inner, P); });
    var cr = crafts(t), v = verbs(t), sg = sigTC3(t), n = wc(t);
    return { tests:[good.length > 0, cr.length > 0, v.strong.length > 0, !!sg, n >= B.wmin && n <= B.wmax], Q:Q, good:good, bad:bad, cr:cr, v:v, sg:sg, n:n };
  }
  // rung of a built sentence: 0 paraphrase, 1 observation, 2 interpretation, 3 analysis; "resp" for a personal response; -1 empty
  function rungOf(r, t){
    if (!r.n) return -1;
    if (r.tests.every(Boolean)) return 3;
    if (r.tests[0] && (r.tests[2] || r.tests[3])) return 2;
    if (r.tests[0] || r.tests[1]) return 1;
    return personal(t) ? "resp" : 0;
  }
  return { nq:nq, poemText:poemText, quotes:quotes, inPoem:inPoem, crafts:crafts, verbs:verbs, sigWide:sigWide, sigTC3:sigTC3, personal:personal, tc3:tc3, rungOf:rungOf };
})();

// ---------- read aloud (local voices only, through MV.eng); one speaker at a time ----------
var VOICE = null, SPK = 0;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; fn(v); }); }
function speak(text, o){
  var me = ++SPK;
  return MV.eng.say(text, { voice:VOICE, rate:o.rate || 1, onWord:function(k){ if (me === SPK && o.onWord) o.onWord(k); }, onEnd:function(){ if (o.onEnd) o.onEnd(me === SPK); } });
}
function wordSpans(line, start, extra){
  var k = start;
  var h = String(line).split(/(\s+)/).map(function(p){
    if (!p || /^\s+$/.test(p)) return p;
    if (!/[A-Za-z0-9]/.test(p)) return esc(p);
    var x = extra ? extra(p, k) : null;
    return '<span class="eng-w' + (x && x.cls ? " " + x.cls : "") + '" data-wi="' + (k++) + '">' + (x && x.html ? x.html : esc(p)) + "</span>";
  }).join("");
  return { html:h, next:k };
}
function marked(t, q){ var i = t.indexOf(q); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark class="lr-mark">' + esc(q) + "</mark>" + esc(t.slice(i + q.length)); }

// ---------- hero: lines 12–14 on a field of sand; the ladder rises; local-voice reading on request ----------
function hero(){
  var H = MV.C.hero, host = $("#hero-lh"); if (!host) return;
  var POEM = MV.C.start.poem.lines, L = H.lines.map(function(n){ return n === 14 ? H.lastLine : POEM[n - 1]; });
  var GL = {}; H.glow.forEach(function(g){ GL[g.w] = g.c; });
  var k0 = 0, stopWord = -1, n12 = 0;
  var linesHTML = L.map(function(l, i){
    var r = wordSpans(l, k0, function(p, k){
      var bare = p.replace(/[^A-Za-z]/g, "").toLowerCase();
      if (GL[bare]) return { cls:"lh-g", html:'<b class="lh-al">' + esc(p.charAt(0)) + "</b>" + esc(p.slice(1)) };
      if (bare === "remains") { stopWord = k; return { html:esc(p.replace(/\.$/, "")) + '<span class="lh-stop">.</span>' }; }
      return null;
    });
    k0 = r.next; if (i === 0) n12 = r.next;
    return '<p class="lh-line"><span class="lh-n" aria-hidden="true">' + H.lines[i] + "</span><span>" + r.html + "</span></p>";
  }).join("");
  host.innerHTML = '<div class="lh-wrap"><div class="lh-sand" id="lh-sand">' + linesHTML + '<p class="lh-cite">' + H.cite + ' <span class="an-tag an-sound lh-altag">Sound · <i>b</i> and <i>l</i></span></p></div>' +
    '<ol class="lh-lad" aria-label="The ladder of reading, from the bottom rung up">' + H.rungs.map(function(r, i){ return '<li class="lh-r" data-r="' + i + '"><span class="lh-rn" aria-hidden="true">' + (i + 1) + "</span>" + r + "</li>"; }).join("") + "</ol></div>" +
    '<div class="lh-ctrl"><button type="button" class="btn primary sm" id="lh-listen" hidden>Listen</button><button type="button" class="btn ghost sm" id="lh-replay" hidden>Replay</button><span class="tiny muted" id="lh-note" hidden>Read the three lines aloud yourself, slowly.</span></div>';
  var W = $$(".lh-sand .eng-w", host), sand = $("#lh-sand"), R = $$(".lh-r", host), run = 0, speech = null, total = W.length, endLabel = false;
  function reset(){ W.forEach(function(w){ w.classList.add("lh-dim"); w.classList.remove("speaking", "on"); }); sand.classList.remove("wide"); $(".lh-stop", host).classList.remove("on"); R.forEach(function(r){ r.classList.remove("up", "lit"); }); $(".lh-altag", host).classList.remove("on"); }
  function light(k){
    W.forEach(function(w){ var i = +w.dataset.wi; if (i <= k) { w.classList.remove("lh-dim"); if (w.classList.contains("lh-g")) w.classList.add("on"); } w.classList.toggle("speaking", i === k); });
    if (k === stopWord) { sand.classList.add("wide"); var s = $(".lh-stop", host); s.classList.add("on"); MV.wait(1300, function(){ s.classList.remove("on"); }); }
    if (k >= total - 1) $(".lh-altag", host).classList.add("on");
  }
  function ladder(me, then){ R.forEach(function(r, i){ MV.wait(i * 320, function(){ if (me === run) r.classList.add("up"); }); }); MV.wait(R.length * 320 + 250, function(){ if (me !== run) return; R[0].classList.add("lit"); then(); }); }
  function finish(){ W.forEach(function(w){ w.classList.remove("lh-dim", "speaking"); if (w.classList.contains("lh-g")) w.classList.add("on"); }); sand.classList.add("wide"); $(".lh-altag", host).classList.add("on"); R.forEach(function(r){ r.classList.add("up"); }); R[0].classList.add("lit"); ui(); }
  function ui(){ endLabel = true; var b = $("#lh-listen"); if (b && !speech) b.textContent = "Listen again"; }
  function animate(){
    var me = ++run, t = 300; reset();
    for (var k = 0; k < total; k++) (function(k){ setTimeout(function(){ if (me === run) light(k); }, t); t += k < n12 ? 230 : 380; if (k === stopWord) t += 800; if (k === n12 - 1) t += 400; })(k);
    setTimeout(function(){ if (me !== run) return; W.forEach(function(w){ w.classList.remove("speaking"); }); ladder(me, finish); }, t + 300);
  }
  function play(){
    if (speech) { MV.eng.stop(); return; }
    var me = ++run, got = false; reset();
    $("#lh-listen").textContent = "Stop";
    function done(){ speech = null; var b = $("#lh-listen"); if (b) b.textContent = endLabel ? "Listen again" : "Listen"; }
    speech = speak(L[0], { rate:0.9, onWord:function(k){ got = true; if (me === run) light(k); },
      onEnd:function(mine){
        if (!mine || me !== run) { done(); if (me === run) finish(); return; }
        light(n12 - 1); W.forEach(function(w){ w.classList.remove("speaking"); });
        MV.wait(900, function(){
          if (me !== run) { done(); return; }
          speech = speak(L[1] + " " + L[2], { rate:0.7, onWord:function(k){ if (me === run) light(n12 + k); },
            onEnd:function(){ done(); if (me === run) { W.forEach(function(w){ w.classList.remove("speaking"); }); ladder(me, finish); } } });
        });
      } });
    // some voices send no word boundaries: then light the words on a timer instead
    setTimeout(function(){ if (!got && speech && me === run && !MV.reduceMotion) { run++; animate(); } }, 900);
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; if (b.id === "lh-listen") play(); else if (b.id === "lh-replay") { MV.eng.stop(); animate(); } });
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(function(v){ $("#lh-listen").hidden = !v; $("#lh-listen").textContent = endLabel ? "Listen again" : "Listen"; $("#lh-note").hidden = !!v; $("#lh-replay").hidden = !!v || MV.reduceMotion; });
  return { stop:function(){ if (speech) MV.eng.stop(); } };
}
var HERO = null;

// ---------- @component E6 ladderBuilder — the E6 paragraph builder in a ladder layout (Sort, Climb, Line by line, Build),
// with a voices overlay on the text panel, "So what?" verdicts and rule readouts (course plan E6/E7; reused by later modules) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, R = C.rungs, RID = {}, POEM = MV.C.start.poem.lines, PT = AR.poemText(POEM), CL = C.climb, LINES = C.lines, B = C.build, VO = C.voices;
  R.forEach(function(r){ RID[r.id] = r; }); RID.resp = C.tray;
  var ORDER = ["ana", "int", "obs", "para"], CARDS = MV.shuffle(C.cards, "lr-cards"), CR = {}; CL.rungs.forEach(function(r){ CR[r.id] = r; });
  S.mode = ["sort", "climb", "line", "build"].indexOf(S.mode) >= 0 ? S.mode : "sort";
  S.voices = !!S.voices; S.sort = S.sort || {}; S.climb = S.climb || {}; S.lines = S.lines || {}; S.line = S.line >= 1 && S.line <= LINES.length ? +S.line : 1; S.built = S.built || "";
  S.cstep = CR[S.cstep] ? S.cstep : "obs"; S.cfocus = S.cfocus || "para";
  var fx = {}, armed = false, msg = "", speech = null, chips = null, chipSel = [];

  host.innerHTML = '<div class="lr">' +
    '<div class="lr-top"><div id="lr-mode"></div><div class="lr-tools"><button type="button" class="an-chip an-theme" id="lr-voices" aria-pressed="false"><i class="an-dot" aria-hidden="true"></i>Voices overlay</button>' +
      '<button type="button" class="btn sm" id="lr-play" hidden>Read the poem aloud</button><span class="tiny muted" id="lr-vnote" hidden>Read the poem aloud yourself.</span></div></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="lr-body" data-mv="graph"><details class="lr-text" id="lr-text" open><summary>“' + esc(MV.C.start.poem.title) + '”</summary><div id="lr-poem"></div><div class="lr-legend" id="lr-legend"></div><p class="eng-cite">' + MV.C.start.poem.cite + "</p></details>" +
      '<div class="lr-work"><div id="lr-stage"></div><div class="lr-focus" id="lr-focus"></div><div class="lr-readbox"><h4 class="lr-rh">Readout</h4><dl class="read" id="lr-read" aria-live="polite"></dl></div></div></div>' +
    '<p class="lr-aha">' + C.aha + "</p></div>";
  if (window.matchMedia && window.matchMedia("(max-width:560px)").matches && S.mode === "build") $("#lr-text").open = false;
  var stage = $("#lr-stage");
  var modeRG = radios($("#lr-mode"), { label:"Mode", options:[{ id:"sort", t:"Sort" }, { id:"climb", t:"Climb" }, { id:"line", t:"Line by line" }, { id:"build", t:"Build" }], value:S.mode, onChange:function(v){ setMode(v); } });

  // ----- the poem panel (rendered once; effects toggle classes so CSS transitions can run) -----
  (function(){
    var k = 0;
    $("#lr-poem").innerHTML = '<ol class="lr-poem">' + POEM.map(function(l, i){
      var n = i + 1, r = wordSpans(l, k, function(p){ return n === 11 && /despair/.test(p) ? { cls:"lr-despair" } : null; }); k = r.next;
      var tag = n === 1 ? VO[0] : n === 2 ? VO[1] : n === 10 ? VO[2] : null;
      return '<li class="lr-l vo-' + voiceOf(n) + '" data-l="' + n + '"><span class="lr-bands" aria-hidden="true"><i class="vb vb-i' + (n === 1 ? " on" : "") + '"></i><i class="vb vb-trav' + (n >= 2 ? " on" : "") + '"></i><i class="vb vb-insc' + (n >= 10 && n <= 11 ? " on" : "") + '"></i></span>' +
        '<span class="eng-ln">' + n + '</span><span class="lr-lt">' + r.html + (tag ? ' <span class="an-tag lr-vtag vt-' + tag.id + '">' + tag.label + "</span>" : "") + "</span></li>";
    }).join("") + "</ol>";
    $("#lr-legend").innerHTML = VO.map(function(v){ return '<span class="lr-lg vt-' + v.id + '"><i class="vb vb-' + v.id + ' on" aria-hidden="true"></i>' + v.label + ' <span class="muted">(' + v.note + ")</span></span>"; }).join("");
  })();
  function voiceOf(n){ return n === 1 ? "i" : (n >= 10 && n <= 11 ? "insc" : "trav"); }
  function voiceName(n){ var id = voiceOf(n); return VO.filter(function(v){ return v.id === id; })[0].label; }
  function paintPoem(){
    var ol = $(".lr-poem", host), lv = fx.voStage != null ? fx.voStage : (S.voices ? 3 : 0);
    ol.classList.toggle("vo-on", lv > 0); [1, 2, 3].forEach(function(i){ ol.classList.toggle("vo-" + i, lv >= i); });
    ol.classList.toggle("dsp-proud", fx.despair === "proud"); ol.classList.toggle("dsp-hollow", fx.despair === "hollow");
    $$(".lr-l", ol).forEach(function(li){
      var n = +li.dataset.l, hl = fx.hl && n >= fx.hl[0] && n <= fx.hl[1];
      li.classList.toggle("hl", !!hl || (S.mode === "line" && n === S.line));
      li.classList.toggle("p1-apart", !!fx.apart && n === 12); li.classList.toggle("p1-join", !!fx.joined && (n === 11 || n === 12));
    });
    $("#lr-legend").hidden = !(lv > 0);
    var vb = $("#lr-voices"); vb.setAttribute("aria-pressed", String(S.voices));
  }

  // ----- sentence features and readout rows -----
  function sentence(){
    if (S.mode === "sort") { var c = C.cards.filter(function(x){ return x.id === S.ssel; })[0]; return c ? { kind:"card", t:c.t, craft:c.craft, meaning:c.meaning, sw:c.sw || null, card:c } : null; }
    if (S.mode === "climb") {
      if (fx.demo && S.cfocus === fx.demo.rung) return { kind:"demo", t:fx.demo.t, rung:fx.demo.rung, built:true };
      if (S.cfocus === "para") return { kind:"climb", t:CL.start, rung:"para", sw:null };
      var r = CR[S.cfocus], o = r && r.opts.filter(function(x){ return x.id === S.climb[r.id]; })[0];
      return o ? { kind:"climb", t:o.t, rung:r.id, craft:o.craft, meaning:o.meaning, opt:o } : null;
    }
    if (S.mode === "line") return { kind:"line", t:paraText(S.line, false), rung:"para", sw:null, meaning:lineMeaning(S.line) };
    return S.built.trim() ? { kind:"built", t:S.built, built:true } : null;
  }
  function realMeaning(m){ return m && !/^none/.test(MV.plain(m)) ? m : null; }
  function swOf(o){ if (o.sw !== undefined) return o.sw; return o.built ? AR.sigTC3(o.t) : AR.sigWide(o.t); }
  function rowsFor(o){
    var p = MV.plain(o.t), Q = AR.quotes(p), good = Q.filter(function(q){ return AR.inPoem(q.inner, PT); }), bad = Q.filter(function(q){ return !AR.inPoem(q.inner, PT); });
    var rung;
    if (o.kind === "card") { var tc = MV.S.chal.tc1 || {}, pl = S.sort[o.card.id]; rung = (tc.solved || tc.hint >= 3) ? RID[MV.ans(o.card)].label + ' <span class="muted">(from the card key)</span>' : pl ? "On your ladder: " + RID[pl].label + ' <span class="muted">(the key shows once the sort challenge is met)</span>' : "Not placed yet"; }
    else if (o.kind === "climb") rung = o.rung === "para" ? "Paraphrase (the bottom rung)" : "Placed on the " + RID[o.rung].label + " rung";
    else if (o.kind === "line") rung = "Paraphrase (line " + S.line + ")";
    else { var r3 = AR.tc3(o.t, PT), ru = AR.rungOf(r3, o.t); rung = ru === "resp" ? "Personal response (off the ladder)" : ru < 0 ? "—" : R[ru].label + ' <span class="muted">(from the five tests)</span>'; }
    var q = good.length ? "Yes: " + good.slice(0, 2).map(function(x){ return "“" + esc(x.inner.trim()) + "”"; }).join(", ") : bad.length ? "Not in the poem: “" + esc(bad[0].inner.trim()) + "”" : "No";
    var cr = o.craft || (function(){ var c = AR.crafts(p); return c.length ? c.join("; ") : "None named"; })();
    var sw = swOf(o), mean = o.kind === "built" || o.kind === "demo" ? (sw ? esc(sw.replace(/^(which|so|suggesting|implying|revealing)\s+(that\s+)?/i, "")) : "—") : (realMeaning(o.meaning) || (o.meaning ? o.meaning : "—"));
    var v = AR.verbs(p), vb = v.strong.length ? "Strong: <em>" + esc(v.strong[0]) + "</em>" + (v.vague.length ? " (also vague: <em>" + esc(v.vague[0]) + "</em>)" : "") : v.vague.length ? "Vague: <em>" + esc(v.vague[0]) + "</em>" : "None from the bank";
    return [["Rung", rung], ["Quotation present", q], ["Craft named", cr], ["Meaning claimed", mean], ["“So what?” answered", sw ? "Yes" : "No"], ["Verb strength", vb]];
  }
  function voicesRow(){
    if (!S.voices) return ["Voices (overlay)", "Overlay off: turn it on to see who speaks"];
    return ["Voices (overlay)", "3: " + VO.map(function(v){ return v.label; }).join(", ") + (S.mode === "line" ? "; line " + S.line + ": " + voiceName(S.line) : "")];
  }
  function verdict(o){
    var sw = swOf(o), N = C.nudge;
    if (sw) return MV.fbHTML("good", "<strong>✓ Yes.</strong> It says why the detail matters: “" + esc(sw) + "”.");
    var p = MV.plain(o.t), nud;
    if (o.kind === "line") nud = N.line;
    else if (o.built || o.kind === "demo") nud = N.built;
    else if (AR.personal(p)) nud = N.resp;
    else if (realMeaning(o.meaning) || AR.verbs(p).strong.length) nud = N.int;
    else if (AR.quotes(p).length || AR.crafts(p).length || o.craft) nud = N.obs;
    else nud = N.para;
    return MV.fbHTML("bad", "<strong>No “so what” yet.</strong> " + nud);
  }
  function paintRead(){
    var o = sentence(), key = o ? o.kind + "|" + MV.plain(o.t) : "";
    if (fx.swKey !== key) fx.swv = "";
    MV.keepFocus($("#lr-focus"), function(){
      $("#lr-focus").innerHTML = o ? '<p class="lr-fl">' + (o.kind === "built" ? "Your sentence" : o.kind === "line" ? "Your paraphrase of line " + S.line : o.kind === "demo" ? "A student’s sentence" : "Selected sentence") + "</p>" +
        (o.kind === "built" ? "" : '<p class="lr-fs">' + o.t + "</p>") + '<div class="q-actions"><button type="button" class="btn sm lr-sw" id="lr-sowhat" data-k="lrsw">So what?</button></div><div id="lr-swv">' + (fx.swv || "") + "</div>"
        : '<p class="tiny muted lr-fl">' + (S.mode === "sort" ? "Tap a card to see its readout." : S.mode === "climb" ? "Choose a sentence, or tap a rung, to see its readout." : "Write a sentence in the builder to see its readout.") + "</p>";
    });
    var rows = o ? rowsFor(o) : [["Rung", "—"], ["Quotation present", "—"], ["Craft named", "—"], ["Meaning claimed", "—"], ["“So what?” answered", "—"], ["Verb strength", "—"]];
    rows.push(voicesRow());
    $("#lr-read").innerHTML = MV.readoutHTML(rows);
  }

  // ----- Sort -----
  function cardBtn(c){ var on = S.ssel === c.id; return '<button type="button" class="lr-card' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-card="' + c.id + '" data-k="cd' + c.id + '">' + c.t + "</button>"; }
  function rungBlock(id, inner, opts){
    var r = RID[id];
    return '<div class="lr-rung rg-' + id + (opts && opts.lit ? " lit" : "") + '"><button type="button" class="lr-rb" data-' + (opts && opts.attr || "rung") + '="' + id + '" data-k="rb' + id + '"' + (opts && opts.pressed != null ? ' aria-pressed="' + opts.pressed + '"' : "") + '><span class="lr-rl">' + r.label + "</span><small>" + r.q + "</small></button>" +
      '<div class="lr-in">' + inner + "</div></div>";
  }
  function paintSort(){
    var un = CARDS.filter(function(c){ return !S.sort[c.id]; });
    var h = '<p class="how">Tap a card, then tap a rung (or the response tray). Tap a placed card to move it.' + (armed && S.ssel ? ' <strong class="lr-armed">Now tap a rung.</strong>' : "") + "</p>" +
      '<div class="lr-sortw"><div class="lr-ladder" role="group" aria-label="The ladder of reading: rungs, top to bottom">' + ORDER.map(function(id){ return rungBlock(id, CARDS.filter(function(c){ return S.sort[c.id] === id; }).map(cardBtn).join("")); }).join("") + "</div>" +
      '<div class="lr-trayw">' + rungBlock("resp", CARDS.filter(function(c){ return S.sort[c.id] === "resp"; }).map(cardBtn).join("")) + "</div></div>" +
      '<h4 class="lr-ch">Cards to sort</h4><div class="lr-cards" role="group" aria-label="Cards to sort">' + (un.length ? un.map(cardBtn).join("") : '<p class="tiny muted">All 8 cards are on the ladder or in the tray.</p>') + "</div>" +
      (S.ssel && S.sort[S.ssel] ? '<div class="q-actions"><button type="button" class="btn ghost sm" data-rung="" data-k="rbback">Back to the cards</button></div>' : "") +
      (msg ? '<p class="tiny lr-msg" role="status">' + msg + "</p>" : "");
    MV.keepFocus(stage, function(){ stage.innerHTML = h; });
  }
  // ----- Climb -----
  function paintClimb(){
    var h = '<p class="how">Start on the bottom rung. On each rung, choose the best next sentence; tap a rung to change its sentence.</p><div class="lr-ladder climb" role="group" aria-label="Climb: rungs, top to bottom">' + ORDER.map(function(id){
      var inner, chosen = null;
      if (id === "para") inner = '<button type="button" class="lr-cs on" data-cfocus="para" data-k="cfpara" aria-pressed="' + (S.cfocus === "para") + '">' + CL.start + "</button>";
      else {
        var r = CR[id], demo = fx.demo && fx.demo.rung === id;
        chosen = r.opts.filter(function(x){ return x.id === S.climb[id]; })[0];
        inner = demo ? '<button type="button" class="lr-cs on demo" data-cfocus="' + id + '" data-k="cf' + id + '" aria-pressed="true"><span class="lr-typed">' + fx.demo.t + "</span></button>"
          : chosen ? '<button type="button" class="lr-cs on" data-cfocus="' + id + '" data-k="cf' + id + '" aria-pressed="' + (S.cfocus === id) + '"><span class="lr-oid">' + optLabel(r, chosen) + "</span> " + chosen.t + "</button>" : '<span class="tiny muted">Not chosen yet</span>';
      }
      return rungBlock(id, inner, { attr:"crung", lit:id === "para" || !!chosen || (fx.demo && fx.demo.rung === id), pressed:id === "para" ? null : S.cstep === id });
    }).join("") + "</div>";
    var r = CR[S.cstep];
    h += '<div class="lr-choices"><h4 class="lr-ch">Choose the best ' + RID[r.id].label.toLowerCase() + '</h4><div role="radiogroup" aria-label="Sentences for the ' + RID[r.id].label + ' rung">' + r.opts.map(function(o){
      var on = S.climb[r.id] === o.id;
      return '<button type="button" role="radio" aria-checked="' + on + '" class="lr-opt' + (on ? " on" : "") + '" data-copt="' + o.id + '" data-k="co' + o.id + '"><span class="lr-oid">' + optLabel(r, o) + "</span><span>" + o.t + "</span></button>";
    }).join("") + "</div></div>";
    if (fx.alt) h += '<p class="tiny lr-msg" role="status">' + fx.alt + "</p>";
    MV.keepFocus(stage, function(){ stage.innerHTML = h; });
  }
  function optLabel(r, o){ return { obs:"O", int:"I", ana:"A" }[r.id] + (r.opts.indexOf(o) + 1); }
  // ----- Line by line -----
  function slots(n){ return LINES[n - 1].p.filter(function(x){ return typeof x === "object"; }); }
  function choice(n){ var ss = slots(n), ch = S.lines[n]; if (!Array.isArray(ch) || ch.length !== ss.length) ch = S.lines[n] = ss.map(function(){ return -1; }); return ch; }
  function paraText(n, html){
    var ch = choice(n), k = 0, out = "";
    LINES[n - 1].p.forEach(function(x){
      var piece;
      if (typeof x === "string") piece = x;
      else { var c = ch[k], o = c >= 0 ? x.opts[c] : null; piece = html ? '<span class="lr-sv' + (o ? " f-" + o.f : " orig") + (fx.flash === n ? " flash" : "") + '">' + (o ? o.t : x.o) + "</span>" : (o ? o.t : x.o); k++; }
      var pl = MV.plain(piece);
      out += (out && !/^[,.;:!?)”]/.test(pl) && !/[(“]$/.test(MV.plain(out)) ? " " : "") + piece;
    });
    var s = html ? out : MV.plain(out);
    return html ? s : s.charAt(0).toUpperCase() + s.slice(1);
  }
  function lineMeaning(n){
    var L = LINES[n - 1], ch = choice(n), m = L.m || null;
    slots(n).forEach(function(x, k){ if (ch[k] >= 0 && x.opts[ch[k]].m) m = x.opts[ch[k]].m; });
    return m;
  }
  function fidelity(n){
    var ch = choice(n), ss = slots(n), rank = { faithful:0, loses:1, adds:2 }, w = "faithful";
    if (ch.some(function(c){ return c < 0; })) return null;
    ch.forEach(function(c, k){ var f = ss[k].opts[c].f; if (rank[f] > rank[w]) w = f; });
    return w;
  }
  function paintLine(){
    var n = S.line, ss = slots(n), ch = choice(n), f = fidelity(n), done = LINES.filter(function(L){ return fidelity(L.n) === "faithful"; }).length;
    var h = '<div class="lr-lnav"><button type="button" class="btn ghost sm" data-lnav="-1" data-k="lnp"' + (n <= 1 ? " disabled" : "") + '>‹ Previous line</button><label class="lr-lsel">Line <select id="lr-lsel" class="lr-sel">' +
      LINES.map(function(L){ return '<option value="' + L.n + '"' + (L.n === n ? " selected" : "") + ">" + L.n + "</option>"; }).join("") + "</select> of " + LINES.length + '</label><button type="button" class="btn ghost sm" data-lnav="1" data-k="lnn"' + (n >= LINES.length ? " disabled" : "") + ">Next line ›</button></div>" +
      '<p class="lr-orig"><span class="lr-ol">Line ' + n + ' <span class="muted">(' + voiceName(n) + ")</span></span>" + esc(POEM[n - 1]) + "</p>" +
      '<p class="lr-para"><span class="lr-ol">Your paraphrase</span><span id="lr-ptext">' + paraText(n, true) + "</span></p>" +
      '<div class="lr-slots">' + ss.map(function(x, k){
        return '<div class="lr-slot"><span class="lr-sl">Swap “' + x.o + '” for:</span><span class="chips" role="group" aria-label="Choices for ' + esc(MV.plain(x.o)) + '">' + MV.shuffle(x.opts.map(function(o, i){ return i; }), "ln" + n + "-" + k).map(function(i){
          var on = ch[k] === i; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-slot="' + k + '" data-opt="' + i + '" data-k="ls' + n + "-" + k + "-" + i + '">' + x.opts[i].t + "</button>";
        }).join("") + "</span></div>";
      }).join("") + "</div>" +
      '<div class="lr-fid" aria-live="polite"><span class="lr-ol">Fidelity</span>' + (f ? '<span class="lr-ftag f-' + f + '">' + C.fid[f] + "</span>" + ss.map(function(x, k){ var o = x.opts[ch[k]]; return o.fb ? ' <span class="lr-ffb">' + o.fb + "</span>" : ""; }).join("") : '<span class="tiny muted">Choose a word for ' + (ss.length > 1 ? "each slot" : "the slot") + " to see how faithful your paraphrase is.</span>") + "</div>" +
      '<p class="tiny muted">Lines paraphrased faithfully: ' + done + " of " + LINES.length + "</p>" +
      '<details class="alg lr-whole"><summary>Read your whole paraphrase</summary><ol class="lr-wp">' + LINES.map(function(L){ return "<li>" + paraText(L.n, true) + "</li>"; }).join("") + "</ol></details>";
    MV.keepFocus(stage, function(){ stage.innerHTML = h; });
  }
  // ----- Build -----
  function buildHTML(){
    return '<p class="how">Write one analysis sentence about “Ozymandias”. Tap words in the poem below to quote them exactly. The rung meter and the five tests update as you type.</p>' +
      '<div class="jq lr-bq"><label for="lr-bt">Your analysis sentence</label><textarea id="lr-bt" class="lr-bt" spellcheck="true"></textarea><p class="tiny" id="lr-bcount" aria-live="polite"></p></div>' +
      '<details class="alg lr-qp" open><summary>Quote from the poem</summary><p class="tiny muted">Tap the first and last word you want (or Shift + tap for a range), then insert. The quotation goes in at your cursor.</p><div id="lr-chips"></div><p class="lr-qsel" id="lr-qsel" aria-live="polite"></p>' +
        '<div class="q-actions"><button type="button" class="btn sm" id="lr-qins" disabled>Insert the quotation</button><button type="button" class="btn ghost sm" id="lr-qclr">Clear selection</button></div></details>' +
      '<div class="lr-meter" id="lr-meter"></div><ul class="checks lr-tests" id="lr-tests"></ul><div id="lr-bdone"></div>';
  }
  var TOK = null;
  function tokens(){
    if (TOK) return TOK;
    TOK = [];
    MV.eng.tokenize(POEM).forEach(function(t){ var parts = t.t.replace(/—(?=\S)/g, "—\u0001").split("\u0001"); parts.forEach(function(p, k){ TOK.push({ t:p, line:t.line, join:k > 0 }); }); });
    return TOK;
  }
  function quoteOf(sel){
    if (!sel.length) return null;
    var T = tokens(), a = Math.min.apply(null, sel), b = Math.max.apply(null, sel), s = "";
    for (var i = a; i <= b; i++) s += (i > a ? (T[i].line !== T[i - 1].line ? " / " : T[i].join ? "" : " ") : "") + T[i].t;
    s = s.replace(/[“”"]/g, "").replace(/^[\s,.;:—]+|[\s,.;:—]+$/g, "");
    return { q:s, l1:T[a].line + 1, l2:T[b].line + 1 };
  }
  function paintChips(){
    var q = quoteOf(chipSel); $("#lr-qsel").innerHTML = q ? "Selected: “" + esc(q.q) + "” " + '<span class="muted">(' + (q.l1 === q.l2 ? "line " + q.l1 : "lines " + q.l1 + "–" + q.l2) + ", " + wc(q.q) + " words)</span>" : '<span class="tiny muted">No words selected.</span>';
    $("#lr-qins").disabled = !q;
  }
  function updBuild(){
    var t = S.built, r = AR.tc3(t, PT), ru = AR.rungOf(r, t), n = r.n;
    $("#lr-bcount").textContent = n + " word" + (n === 1 ? "" : "s") + " (25–60)";
    $("#lr-tests").innerHTML = B.tests.map(function(lab, i){ var ok = r.tests[i]; return '<li class="' + (ok ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (ok ? "✓" : "○") + "</span><span>" + lab + '<span class="vh">' + (ok ? " (met)" : " (not met)") + "</span></span></li>"; }).join("");
    var lvl = typeof ru === "number" ? ru : -1;
    $("#lr-meter").innerHTML = '<span class="lr-ml">Rung meter</span><ol class="lr-mr" aria-hidden="true">' + [0, 1, 2, 3].map(function(i){ return '<li class="rg-' + R[i].id + (i <= lvl ? " on" : "") + '">' + R[i].label + "</li>"; }).join("") + '</ol><span class="lr-mv">' +
      (ru === "resp" ? "Personal response: off the ladder" : lvl < 0 ? "Not on the ladder yet" : R[lvl].label + (lvl === 3 ? ": all five tests pass" : "")) + "</span>";
    var tc = MV.S.chal.tc3 || {};
    $("#lr-bdone").innerHTML = tc.solved ? '<div class="fb good"><p>' + B.save + '</p><div class="q-actions"><button type="button" class="btn sm" id="lr-bsave">Save my sentence to my commonplace book</button><span class="tiny muted" id="lr-bsst" aria-live="polite"></span></div></div>' +
      '<details class="alg"><summary>Three more climbs to compare</summary>' + B.examples.map(function(x){
        var e = AR.tc3(x, PT), k = e.tests.filter(Boolean).length, miss = B.tests.filter(function(_, i){ return !e.tests[i]; }).map(function(l){ return MV.plain(l).split(" (")[0].toLowerCase(); });
        return '<p class="lr-ex">' + x + ' <span class="tiny muted">(' + (k === 5 ? "passes all five tests" : "passes " + k + " of 5 tests; missing: " + miss.join("; ") + (e.tests[2] ? "" : ". Its verb says how, but it isn’t one of the bank’s verbs")) + ")</span></p>"; }).join("") + "</details>" : "";
  }
  function paintBuild(){
    if (stage.dataset.mode !== "build") {
      stage.innerHTML = buildHTML(); stage.dataset.mode = "build";
      $("#lr-bt").value = S.built; chipSel = [];
      chips = MV.eng.tokens($("#lr-chips"), tokens(), { label:"The poem’s words: tap to select a quotation", onChange:function(s){ chipSel = s; paintChips(); } });
      paintChips();
    }
    updBuild();
  }
  function insertQuote(){
    var q = quoteOf(chipSel), ta = $("#lr-bt"); if (!q || !ta) return;
    var v = ta.value, pos = ta.selectionStart == null ? v.length : ta.selectionStart, end = ta.selectionEnd == null ? pos : ta.selectionEnd;
    if (document.activeElement !== ta && pos === 0 && v) pos = end = v.length;
    var pre = v.slice(0, pos), ins = (pre && !/[\s(“]$/.test(pre) ? " " : "") + "“" + q.q + "”";
    ta.value = pre + ins + v.slice(end); S.built = ta.value; api.save();
    ta.focus(); ta.setSelectionRange(pos + ins.length, pos + ins.length);
    chips.clear(); chipSel = []; paintChips(); updBuild(); paintRead(); MV.changed();
  }

  function paintStage(){
    if (S.mode !== "build") stage.dataset.mode = S.mode;
    if (S.mode === "sort") paintSort(); else if (S.mode === "climb") paintClimb(); else if (S.mode === "line") paintLine(); else paintBuild();
  }
  function paint(){ modeRG.set(S.mode); host.querySelector(".lr").dataset.mode = S.mode; paintStage(); paintPoem(); paintRead(); MV.changed(); }
  function stopAll(){ if (speech) MV.eng.stop(); speech = null; }
  function setMode(v){ stopAll(); S.mode = v; fx = {}; msg = ""; armed = false; MV.banner("", ""); api.save(); paint(); }

  // ----- read the poem aloud -----
  function play(){
    if (speech) { MV.eng.stop(); return; }
    var btn = $("#lr-play"), P = $$("#lr-poem .eng-w");
    function hi(k){ P.forEach(function(w){ w.classList.toggle("speaking", +w.dataset.wi === k); }); }
    btn.textContent = "Stop";
    speech = speak(POEM.join(" "), { rate:0.9, onWord:hi, onEnd:function(){ speech = null; var b = $("#lr-play"); if (b) b.textContent = "Read the poem aloud"; hi(-1); } });
  }
  voiceReady(function(v){ $("#lr-play").hidden = !v; $("#lr-vnote").hidden = !!v; });

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest("#lr-mode")) return;
    if (b.id === "lr-voices") { S.voices = !S.voices; fx.voStage = null; api.save(); paintPoem(); paintRead(); return; }
    if (b.id === "lr-play") { play(); return; }
    if (b.id === "lr-sowhat") { var o = sentence(); if (o) { fx.swKey = o.kind + "|" + MV.plain(o.t); fx.swv = verdict(o); $("#lr-swv").innerHTML = fx.swv; MV.focusFb($("#lr-focus")); } return; }
    // sort
    if (b.dataset.card) { S.ssel = b.dataset.card; armed = true; msg = ""; api.save(); paintSort(); paintRead(); return; }
    if (b.dataset.rung != null) {
      if (!S.ssel || !armed) { msg = b.dataset.rung ? "Tap a card first, then tap a rung." : ""; paintSort(); return; }
      if (b.dataset.rung) S.sort[S.ssel] = b.dataset.rung; else delete S.sort[S.ssel];
      msg = b.dataset.rung ? "Placed on " + RID[b.dataset.rung].label + "." : "Back in the cards."; armed = false; api.save(); paintSort(); paintRead(); MV.changed(); return;
    }
    // climb
    if (b.dataset.crung) { if (b.dataset.crung !== "para") { S.cstep = b.dataset.crung; if (S.climb[S.cstep]) S.cfocus = S.cstep; } else S.cfocus = "para"; fx.demo = null; api.save(); paintClimb(); paintRead(); return; }
    if (b.dataset.cfocus) { S.cfocus = b.dataset.cfocus; if (CR[S.cfocus]) S.cstep = S.cfocus; fx.demo = null; api.save(); paintClimb(); paintRead(); return; }
    if (b.dataset.copt) {
      S.climb[S.cstep] = b.dataset.copt; S.cfocus = S.cstep; fx = {};
      var next = ["obs", "int", "ana"].filter(function(id){ return !S.climb[id]; })[0]; if (next) S.cstep = next;
      api.save(); paintClimb(); paintRead(); MV.changed(); return;
    }
    // line by line
    if (b.dataset.lnav) { S.line = Math.max(1, Math.min(LINES.length, S.line + (+b.dataset.lnav))); fx = {}; api.save(); paintLine(); paintPoem(); paintRead(); return; }
    if (b.dataset.slot != null) { var ch = choice(S.line), k = +b.dataset.slot, i = +b.dataset.opt; ch[k] = ch[k] === i ? -1 : i; fx = {}; api.save(); paintLine(); paintRead(); return; }
    // build
    if (b.id === "lr-qins") { insertQuote(); return; }
    if (b.id === "lr-qclr") { if (chips) chips.clear(); chipSel = []; paintChips(); return; }
    if (b.id === "lr-bsave") { var t = S.built.trim(); $("#lr-bsst").textContent = t && MV.eng.saveLine(t, "My analysis sentence about “Ozymandias” (Explore, Build)") ? "Saved to your commonplace book." : "Write your sentence first."; return; }
  });
  host.addEventListener("change", function(e){ if (e.target.id === "lr-lsel") { S.line = +e.target.value; fx = {}; api.save(); paintLine(); paintPoem(); paintRead(); var s = $("#lr-lsel"); if (s) s.focus(); } });
  host.addEventListener("input", function(e){ if (e.target.id === "lr-bt") { S.built = e.target.value; api.save(); updBuild(); paintRead(); MV.changed(); } });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    var id = b.dataset.setup; stopAll(); fx = {};
    if (id === "tc1") S.mode = "sort";
    else if (id === "tc2") { S.mode = "climb"; S.cstep = ["obs", "int", "ana"].filter(function(r){ return !S.climb[r]; })[0] || "obs"; }
    else if (id === "tc3") S.mode = "build";
    api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc3" ? $("#lr-bt") : id === "tc2" ? $(".lr-opt", stage) : $(".lr-card", stage); if (f) f.focus({ preventScroll:true });
  });

  // ----- target challenges -----
  function tc1(){
    var T = C.tc1, ans = {}; C.cards.forEach(function(c){ ans[c.id] = MV.ans(c); });
    var placed = C.cards.filter(function(c){ return S.sort[c.id]; });
    if (placed.length === C.cards.length && C.cards.every(function(c){ return S.sort[c.id] === ans[c.id]; })) return { ok:true };
    function on(kind, rung){ return C.cards.some(function(c){ return ans[c.id] === kind && S.sort[c.id] === rung; }); }
    if (on("para", "ana")) return { ok:false, msg:T.paraOnAna };
    if (on("resp", "int")) return { ok:false, msg:T.respOnInt };
    if (on("obs", "int")) return { ok:false, msg:T.obsOnInt };
    if (placed.length < C.cards.length) return { ok:false, msg:"Place all " + C.cards.length + " cards first: " + (C.cards.length - placed.length) + " still to sort." };
    var wrong = C.cards.filter(function(c){ return S.sort[c.id] !== ans[c.id]; }).length;
    return { ok:false, msg:wrong + (wrong > 1 ? " cards are" : " card is") + " on the wrong rung. " + T.general };
  }
  function tc2(){
    var miss = CL.rungs.filter(function(r){ return !S.climb[r.id]; });
    if (miss.length) return { ok:false, msg:"Choose a sentence on every rung first (still to choose: " + miss.map(function(r){ return RID[r.id].label; }).join(", ") + ")." };
    var alt = null;
    for (var i = 0; i < CL.rungs.length; i++) {
      var r = CL.rungs[i], c = S.climb[r.id];
      if (c === MV.ans(r)) continue;
      if (r.accept && r.accept[c]) { alt = r.accept[c]; continue; }
      return { ok:false, msg:(r.wrong && r.wrong[c]) || CL.general };
    }
    return { ok:true, alt:alt };
  }
  function tc3(){
    var r = AR.tc3(S.built, PT);
    if (!r.n) return { ok:false, msg:"Write your sentence in Build mode first." };
    if (r.tests.every(Boolean)) return { ok:true };
    if (!r.tests[0]) {
      if (r.bad.length) return { ok:false, msg:B.wrongQuote };
      if (r.Q.length) return { ok:false, msg:"Quote 2–8 words: your quotation has " + wc(r.Q[0].inner) + "." };
      return { ok:false, msg:"Quote 2–8 exact words from the poem, in quotation marks." };
    }
    if (!r.tests[1]) return { ok:false, msg:"Name the craft: juxtaposition, alliteration, irony, frame, imagery, diction…" };
    if (!r.tests[2]) return { ok:false, msg:r.v.vague.length ? B.wrongVerb : "Use a strong verb from the bank: undercuts, juxtaposes, reframes, intensifies, implies…" };
    if (!r.tests[3]) return { ok:false, msg:B.wrongSig };
    return { ok:false, msg:"Make it 25–60 words (it has " + r.n + ")." };
  }

  paint();
  EX = { stop:stopAll };
  return {
    predict:{
      start:function(p){
        stopAll(); fx = {}; msg = "";
        if (p.id === "p1") { S.mode = "climb"; fx.hl = [10, 12]; fx.apart = true; fx.despair = "proud"; }
        else if (p.id === "p2") { S.voices = false; fx.voStage = 0; }
        else if (p.id === "p3") { S.mode = "line"; S.line = 5; choice(5)[0] = -1; }
        else if (p.id === "p4") { S.mode = "climb"; fx.demo = { rung:"obs", t:C.p4.before }; fx.hl = [13, 14]; S.cfocus = "obs"; }
        api.save(); paint();
      },
      run:function(p, done){
        if (p.id === "p1") { fx.apart = false; fx.joined = true; fx.despair = "hollow"; paintPoem(); MV.wait(1800, done); return; }
        if (p.id === "p2") { S.voices = true; api.save(); [1, 2, 3].forEach(function(i){ MV.wait(i * 450, function(){ fx.voStage = i; paintPoem(); }); }); MV.wait(1700, function(){ fx.voStage = null; paintPoem(); paintRead(); done(); }); return; }
        if (p.id === "p3") {
          var x = slots(5)[0], i = x.opts.map(function(o){ return MV.plain(o.t); }).indexOf("an expression of authority");
          choice(5)[0] = i; fx.flash = 5; api.save(); paintLine(); paintRead();
          MV.wait(1600, function(){ fx.flash = null; done(); }); return;
        }
        if (p.id === "p4") {
          var a = MV.plain(C.p4.before), z = C.p4.after, extra = MV.plain(z).slice(a.length - 1);
          MV.tween({ dur:1600, step:function(t){ fx.demo.t = esc(a.slice(0, -1) + extra.slice(0, Math.round(extra.length * t))); var s = $(".lr-typed", stage); if (s) s.innerHTML = fx.demo.t; },
            done:function(){ fx.demo.t = z; paintClimb(); paintRead(); MV.wait(400, done); } });
          return;
        }
        done();
      }
    },
    challenge:function(id, opt){
      var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false };
      if (!(opt && opt.live)) {
        if (id === "tc2" && r.ok && r.alt) { MV.banner("good", "✓ Accepted. " + MV.plain(r.alt)); fx.alt = "✓ Accepted with a nudge: " + r.alt; if (S.mode === "climb") paintClimb(); }
        if (r.ok && (id === "tc1" || id === "tc3")) MV.wait(30, function(){ if (S.mode === "build") updBuild(); paintRead(); });
      }
      return r;
    }
  };
}

// ---------- Part 3: Upgrade the sentence — @component E4 verbDial (a range "dial" from vague to strong) + slot chips + rung meter ----------
var P3 = null;
function part3(host, api){
  var U = api.content.upgrade, SS = U.sentences, S = api.S, POEM = MV.C.start.poem.lines;
  S.cur = S.cur >= 0 && S.cur < SS.length ? +S.cur : 0; S.s = S.s || {};
  function st(s){ var x = S.s[s.id] || (S.s[s.id] = { d:0, h:-1, w:-1, last:null }); if (x.d >= s.dial.length) x.d = 0; return x; }
  function good(s, x){ return { d:MV.ok(s.dial[x.d]), h:x.h >= 0 && MV.ok(s.how[x.h]), w:x.w >= 0 && MV.ok(s.sw[x.w]) }; }
  function count(s){ var g = good(s, st(s)); return (g.d ? 1 : 0) + (g.h ? 1 : 0) + (g.w ? 1 : 0); }
  function tabLabel(i){ return "Sentence " + (i + 1) + (count(SS[i]) === 3 ? " ✓" : ""); }
  var tabOpts = SS.map(function(s, i){ return { id:i, t:tabLabel(i) }; });
  host.innerHTML = '<div class="up"><div class="up-top"><div id="up-tabs"></div><p class="tiny muted" id="up-count" aria-live="polite"></p></div><div class="up-card" id="up-card"></div></div>';
  var tabs = radios($("#up-tabs"), { cls:"chips", aria:"Choose a sentence to upgrade", options:tabOpts, value:S.cur, onChange:function(v){ S.cur = +v; api.save(); build(); } });
  function compose(s, x, html){
    var d = s.dial[x.d].t, h = x.h >= 0 ? s.how[x.h].t : "", w = x.w >= 0 ? s.sw[x.w].t : "";
    var out = html ? '<span class="up-p up-pd">' + d + "</span>" : d;
    if (h) out += (/^\(/.test(MV.plain(h)) ? " " : ", ") + (html ? '<span class="up-p up-ph">' + h + "</span>" : h);
    if (w) out += ", " + (html ? '<span class="up-p up-pw">' + w + "</span>" : w);
    if (!/[.!?][”’"]?$/.test(MV.plain(out))) out += ".";
    return out;
  }
  function chipsHTML(s, key, list, sel){
    return '<div class="chips" role="group" aria-label="' + esc(U.tools[key === "h" ? "how" : "sw"]) + '">' + MV.shuffle(list.map(function(o, i){ return i; }), s.id + key).map(function(i){
      var on = sel === i; return '<button type="button" class="chip up-chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-up="' + key + '" data-i="' + i + '" data-k="up' + s.id + key + i + '">' + list[i].t + "</button>";
    }).join("") + "</div>";
  }
  function build(){
    var s = SS[S.cur], x = st(s);
    $("#up-card").innerHTML = '<p class="up-weak"><span class="up-wl">Weak sentence ' + (S.cur + 1) + "</span> “" + s.weak + '” <span class="tag">Starts as: ' + s.start + "</span></p>" +
      '<div class="up-tools"><div class="up-tool up-t-d"><label class="up-tl" for="up-dial">' + U.tools.dial + '</label><div class="up-dw"><span class="tiny muted">vague</span><input type="range" id="up-dial" min="0" max="' + (s.dial.length - 1) + '" step="1"><span class="tiny muted">strong</span></div><p class="up-dv" id="up-dv" aria-live="polite"></p></div>' +
        '<div class="up-tool up-t-h"><span class="up-tl">' + U.tools.how + ": add the craft</span>" + '<div id="up-how"></div></div>' +
        '<div class="up-tool up-t-w"><span class="up-tl">' + U.tools.sw + ": add significance</span>" + '<div id="up-sw"></div></div></div>' +
      '<p class="up-sent" id="up-sent" aria-live="polite"></p><div class="up-meter" id="up-meter"></div><div id="up-fb"></div>' +
      '<details class="alg up-zoom" open><summary>Zoom to the words</summary><p class="tiny muted">The exact words this upgrade relies on, in the poem.</p>' + s.zoom.map(function(z){ return '<p class="up-z"><span class="up-zl">line ' + z[0] + "</span>" + marked(POEM[z[0] - 1], z[1]) + "</p>"; }).join("") + "</details>";
    var dial = $("#up-dial"); dial.value = x.d;
    update(false);
  }
  function update(withFb){
    var s = SS[S.cur], x = st(s), g = good(s, x), k = count(s), dial = $("#up-dial");
    var strong = g.d;
    dial.setAttribute("aria-valuetext", MV.plain(s.dial[x.d].t) + (strong ? ", strong" : ", vague"));
    $("#up-dv").innerHTML = '<span class="up-vt ' + (strong ? "on" : "") + '">' + (strong ? "Says how" : "Vague") + "</span> " + s.dial[x.d].t;
    MV.keepFocus($("#up-how"), function(){ $("#up-how").innerHTML = chipsHTML(s, "h", s.how, x.h); });
    MV.keepFocus($("#up-sw"), function(){ $("#up-sw").innerHTML = chipsHTML(s, "w", s.sw, x.w); });
    $("#up-sent").innerHTML = '<span class="up-sl">Your sentence</span>' + compose(s, x, true);
    var labels = [s.start, "1 upgrade", "2 upgrades", "Analysis"];
    $("#up-meter").innerHTML = '<span class="up-ml">Rung meter</span><ol class="up-mr">' + labels.map(function(l, i){ return '<li class="' + (i <= k ? "on" : "") + '"><span class="vh">' + (i <= k ? "reached: " : "not yet: ") + "</span>" + l + "</li>"; }).join("") + "</ol>" +
      '<p class="up-mt">Tools used well: verb ' + (g.d ? "✓" : "○") + " · how " + (g.h ? "✓" : "○") + " · so what " + (g.w ? "✓" : "○") + "</p>";
    var fb = "";
    if (x.last) {
      var o = x.last === "d" ? s.dial[x.d] : x.last === "h" ? (x.h >= 0 ? s.how[x.h] : null) : (x.w >= 0 ? s.sw[x.w] : null);
      if (o) fb = MV.fbHTML(MV.ok(o) ? "good" : "bad", "<strong>" + (MV.ok(o) ? "✓" : "✗") + "</strong> " + o.fb);
    }
    if (k === 3) fb += MV.fbHTML("good", "<strong>✓ A full climb.</strong> This sentence is now analysis: a precise verb, the craft, and the “so what”.");
    $("#up-fb").innerHTML = fb;
    tabOpts.forEach(function(o, i){ o.t = tabLabel(i); }); tabs.refresh();
    var n = SS.filter(function(z){ return count(z) === 3; }).length;
    $("#up-count").textContent = "Upgraded to analysis: " + n + " of " + SS.length;
    if (withFb) MV.focusFb($("#up-fb"));
  }
  host.addEventListener("input", function(e){ if (e.target.id === "up-dial") { var s = SS[S.cur], x = st(s); x.d = +e.target.value; x.last = "d"; api.save(); update(false); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-up]"); if (!b) return;
    var s = SS[S.cur], x = st(s), i = +b.dataset.i, key = b.dataset.up;
    x[key] = x[key] === i ? -1 : i; x.last = key; api.save(); update(false);
  });
  build();
  // Sentence to steal: save the imitation to the commonplace book on request
  var steal = $('.mv-block[data-block="steal"]');
  if (steal && !$("#steal-save")) {
    var row = document.createElement("div"); row.className = "q-actions";
    row.innerHTML = '<button type="button" class="btn ghost sm" id="steal-save">Save my imitation to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || "").trim();
      $("#steal-st").textContent = t ? (MV.eng.saveLine(t, "My imitation of Shelley, A Defence of Poetry") ? "Saved to your commonplace book." : "") : "Write your imitation first.";
    });
  }
  P3 = { refresh:function(){ build(); } };
  return P3;
}

// ---------- Practice 1: rung sort (the stanza + the toolkit's tap-to-sort) ----------
function rungSort(host, api, a){
  host.innerHTML = '<div class="rs-pass"></div><div class="rs-sort"></div>';
  MV.eng.passage($(".rs-pass", host), a.passage, { kind:"poem", cite:a.cite });
  return MV.activityTypes.sorter($(".rs-sort", host), a);
}

// ---------- Practice 2: unseen prose (passage + the toolkit's practice multiple choice + select-all) ----------
function unseen(host, api, a){
  host.innerHTML = '<div class="un-pass"></div><div class="un-q"></div><div class="un-s"></div>';
  MV.eng.passage($(".un-pass", host), a.passage, { kind:"prose", cite:a.cite });
  var m = MV.activityTypes.mc($(".un-q", host), a);
  var sa = { id:a.id, goal:a.goal, how:"Select every option that applies, then press Check.", items:[a.select] };
  var s = MV.activityTypes.selectall($(".un-s", host), sa);
  return {
    stats:function(){ var x = m.stats(), y = s.stats(), f = x.first + y.first, t = x.total + y.total, d = x.done + y.done; return { first:f, total:t, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + t + (d < t ? " (unfinished)" : "") }; },
    missed:function(){ return m.missed().concat(s.missed()); }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 02; numbered sentences) ----------
// a: {id, student, summary, problems:[{id, goal, task, steps:[sentences], answer: index of first flawed sentence, stepFb:[…],
//      fixes:[{t, ok, why}], hints:[3]}]}
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Paragraph ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s paragraph</p><ol class=\"steps-list\">";
        p.steps.forEach(function(s, si){
          h += '<li><button type="button" class="sbtn' + (st.found && si === err ? " err" : "") + '" data-k="' + p.id + "s" + si + '" data-step="' + si + '"' + (st.found ? " disabled" : "") + '><span class="sn">Sentence ' + (si + 1) + "</span><span>" + s + (st.found && si === err ? '<span class="flag">First mistake</span>' : "") + "</span></button></li>";
        });
        h += "</ol>";
        if (!st.found) {
          h += '<div class="q-actions">' + MV.hintBtn(p.id + "hint", st.hint) + "</div>" + MV.hintsHTML(p.hints, st.hint);
          if (st.lastStep != null && st.lastStep !== err) h += '<div class="fb bad" role="status"><p>' + ((p.stepFb && p.stepFb[st.lastStep]) || ("Sentence " + (st.lastStep + 1) + " is fine. Keep checking.")) + "</p></div>";
        } else {
          h += '<div class="fb good" role="status"><p><strong>✓ You found it: sentence ' + (err + 1) + ".</strong> Now choose the best fix.</p></div>";
          var ri = MV.right(p.fixes);
          h += '<div class="opts" style="margin-top:12px">' + p.fixes.map(function(f, fi){
            var c = "opt"; if (st.fixed && fi === ri) c += " right"; else if (st.lastFix === fi && fi !== ri) c += " wrong";
            return '<button type="button" class="' + c + '" data-k="' + p.id + "f" + fi + '" data-fix="' + fi + '"' + (st.fixed ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + fi) + "</span><span>" + f.t + "</span></button>";
          }).join("") + "</div>";
          if (st.lastFix != null) { var f = p.fixes[st.lastFix], good = st.lastFix === ri; h += '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p><strong>' + (good ? "✓ That’s the fix." : "✗ Not quite. Try another fix.") + "</strong> " + (f.why || "") + "</p></div>"; }
        }
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-sp]"); if (!box) return;
    var p = a.problems.filter(function(x){ return x.id === box.dataset.sp; })[0], st = sst(p.id), err = MV.ans(p);
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

// ---------- Performance task "Climb the ladder": five-slot E6 builder + quotation integrator + @component E8 lineCitation ----------
// cite.tests(text, nLines) -> true when text holds (Author, line n) | (Author, lines n–m) | (line n) | (lines n–m) | (n) | (n–m), n, m in range.
var cite = {
  RES:[/\(\s*[A-Z][A-Za-z’'.\- ]*,\s*lines?\s+(\d+)(?:\s*[–-]\s*(\d+))?\s*\)/g, /\(\s*lines?\s+(\d+)(?:\s*[–-]\s*(\d+))?\s*\)/g, /\(\s*(\d+)(?:\s*[–-]\s*(\d+))?\s*\)/g],
  tests:function(t, n){
    var s = MV.plain(String(t || "")), ok = false;
    cite.RES.forEach(function(re0){ var re = new RegExp(re0.source, "g"), m; while ((m = re.exec(s))) { var a = +m[1], b = m[2] ? +m[2] : a; if (a >= 1 && b >= a && b <= n) ok = true; } });
    return ok;
  },
  text:function(author, a, b, named){ var r = b && b > a ? a + "–" + b : String(a); return "(" + (named ? author + ", " : "") + (b && b > a ? "lines " : "line ") + r + ")"; }
};
var task = (function(){
  var api = null, T = null, tk = null, sel = [], speech = null, SIGRE = null;
  function poem(id){ return T.poems.filter(function(p){ return p.id === id; })[0] || T.poems[0]; }
  function nLines(p){ return p.lines.filter(function(l){ return String(l).trim(); }).length; }
  function clean(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){ S = S || {}; var d = { poem:S.poem || "", explain:explain() }; T.slots.forEach(function(s){ d[s.id] = clean(S[s.id]); }); return d; }
  function sig(t){
    if (!SIGRE) SIGRE = new RegExp("\\b(?:" + T.significance.map(function(k){
      var m = { suggests:"suggest(?:s|ed|ing)?", implies:"impl(?:y|ies|ied|ying)", reveals:"reveal(?:s|ed|ing)?", warns:"warn(?:s|ed|ing)?", argues:"argu(?:e|es|ed|ing)" };
      return m[k] || k.replace(/\s+/g, "\\s+");
    }).join("|") + ")\\b", "i");
    return SIGRE.test(MV.plain(t));
  }
  function checks(d){
    T = T || MV.C.task;
    var P = poem(d.poem), PT = AR.poemText(P.lines), n = nLines(P), total = 0;
    var c1 = T.slots.every(function(s){ var w = wc(d[s.id]); total += w; return w >= 8; });
    var c2 = !!d.poem && AR.quotes(d.obs).some(function(q){ var k = wc(q.inner); return k >= 1 && k <= 8 && AR.inPoem(q.inner, PT); });
    var c3 = AR.crafts(d.ana).length > 0, c4 = AR.verbs(d.ana).strong.length > 0, c5 = cite.tests(d.ana, n), c6 = sig(d.sw), c7 = total >= 80 && total <= 180;
    return [c1, c2, c3, c4, c5, c6, c7];
  }
  function total(d){ return T.slots.reduce(function(a, s){ return a + wc(d[s.id]); }, 0); }
  function counts(){ var d = data(api.S); $("#ct-count").textContent = total(d) + " words in all (80–180) · " + T.slots.map(function(s){ return s.label + " " + wc(d[s.id]); }).join(" · "); }
  function preview(){
    var d = data(api.S), el = $("#ct-pv"); if (!el) return;
    var parts = T.slots.filter(function(s){ return d[s.id]; });
    el.innerHTML = parts.length ? "<p>" + parts.map(function(s){ return '<span class="ct-p rg-' + s.id + '"><span class="ct-ptag">' + s.label + "</span>" + esc(d[s.id]) + "</span>"; }).join(" ") + "</p>" : '<p class="tiny muted">Your climb appears here as you write, one rung at a time.</p>';
  }
  function models(){
    var el = $("#ct-models"); if (!el) return;
    var ok = checks(data(api.S)).every(Boolean);
    el.innerHTML = ok ? '<div class="fb good"><p><strong>✓ ' + T.success + "</strong></p></div>" + T.models.map(function(m){
      return '<details class="alg ct-model"><summary>' + m.title + "</summary>" + m.parts.map(function(t, i){ var s = T.slots[i]; return '<p class="ct-mp"><span class="ct-ptag rg-' + s.id + '">' + s.label + "</span> " + t + "</p>"; }).join("") + "</details>";
    }).join("") : "";
  }
  function all(){ api.save(); counts(); preview(); api.update(); models(); MV.paintSummary(); }
  function paintPoem(){
    var S = api.S, P = poem(S.poem), el = $("#ct-poem");
    if (!S.poem) { el.innerHTML = '<p class="tiny muted">Choose a poem to see it here.</p>'; $("#ct-integ").hidden = true; return; }
    $("#ct-integ").hidden = false;
    MV.eng.passage(el, P.lines, { kind:"poem", cite:P.cite, words:true });
    sel = [];
    tk = MV.eng.tokens($("#ct-toks"), MV.eng.tokenize(P.lines), { label:"The poem’s words: tap to select a quotation", onChange:function(s){ sel = s; paintSel(); } });
    $("#ct-a").innerHTML = '<option value="">—</option>' + Array.apply(null, { length:nLines(P) }).map(function(_, i){ return '<option value="' + (i + 1) + '">' + (i + 1) + "</option>"; }).join("");
    $("#ct-b").innerHTML = '<option value="">none</option>' + Array.apply(null, { length:nLines(P) }).map(function(_, i){ return '<option value="' + (i + 1) + '">' + (i + 1) + "</option>"; }).join("");
    $("#ct-au-l").textContent = "name " + P.author;
    paintSel();
  }
  function selQuote(){
    if (!sel.length) return null;
    var P = poem(api.S.poem), T2 = MV.eng.tokenize(P.lines), a = Math.min.apply(null, sel), b = Math.max.apply(null, sel), s = "";
    for (var i = a; i <= b; i++) s += (i > a ? (T2[i].line !== T2[i - 1].line ? " / " : " ") : "") + T2[i].t;
    return { q:s.replace(/[“”"]/g, "").replace(/^[\s,.;:—]+|[\s,.;:—]+$/g, ""), l1:T2[a].line + 1, l2:T2[b].line + 1 };
  }
  function citeText(){ var P = poem(api.S.poem), a = +$("#ct-a").value, b = +$("#ct-b").value; return a ? cite.text(P.author, a, b, $("#ct-au").checked) : ""; }
  function paintSel(){
    var q = selQuote();
    $("#ct-qsel").innerHTML = q ? "Selected: “" + esc(q.q) + '” <span class="muted">(' + wc(q.q) + " word" + (wc(q.q) === 1 ? "" : "s") + ")</span>" : '<span class="tiny muted">No words selected.</span>';
    if (q) { $("#ct-a").value = String(q.l1); $("#ct-b").value = q.l2 > q.l1 ? String(q.l2) : ""; }
    $("#ct-qins").disabled = !q;
    var c = citeText(); $("#ct-cins").textContent = c ? "Insert " + c : "Insert a citation"; $("#ct-cins").disabled = !c;
  }
  function insert(text, kind){
    var S = api.S, id = S.target === "ana" ? "ana" : "obs", ta = $("#ct-" + id); if (!ta) return;
    var v = ta.value, pos = ta.selectionEnd == null || document.activeElement !== ta ? v.length : ta.selectionEnd;
    if (kind === "cite" && pos === v.length && /[.!?]\s*$/.test(v)) pos = v.replace(/\s+$/, "").length - 1;
    var pre = v.slice(0, pos), ins = (pre && !/[\s(“]$/.test(pre) ? " " : "") + text;
    ta.value = pre + ins + v.slice(pos); S[id] = ta.value; ta.focus(); ta.setSelectionRange(pos + ins.length, pos + ins.length); all();
  }
  function read(){
    var S = api.S, P = poem(S.poem), btn = $("#ct-read"), W = $$("#ct-poem .eng-w");
    if (speech) { MV.eng.stop(); return; }
    function hi(k){ W.forEach(function(w){ w.classList.toggle("speaking", +w.dataset.wi === k); }); }
    btn.textContent = "Stop";
    speech = speak(P.lines.filter(function(l){ return String(l).trim(); }).join(" "), { rate:0.85, onWord:hi, onEnd:function(){ speech = null; var b = $("#ct-read"); if (b) b.textContent = "Read the poem aloud"; hi(-1); } });
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; S.target = S.target === "ana" ? "ana" : "obs";
      inp.innerHTML = '<div id="ct-pick"></div><div class="ct-pw"><div id="ct-poem"></div><div class="q-actions"><button type="button" class="btn sm" id="ct-read" hidden>Read the poem aloud</button><span class="tiny muted" id="ct-rnote" hidden>Read the poem aloud yourself.</span></div></div>' +
        '<details class="alg ct-integ" id="ct-integ" open><summary>Quotation integrator and MLA citation builder</summary><p class="tiny muted">Tap the words you want to quote (Shift + tap for a range). The citation fills in from your selection.</p><div id="ct-toks"></div><p id="ct-qsel" aria-live="polite"></p>' +
          '<div id="ct-tgt"></div><div class="ct-cite" role="group" aria-label="MLA line citation"><label class="pb-chk"><input type="checkbox" id="ct-au" checked> <span id="ct-au-l">name the author</span></label><label>line <select id="ct-a" class="lr-sel"></select></label><label>to <select id="ct-b" class="lr-sel"></select></label></div>' +
          '<div class="q-actions"><button type="button" class="btn sm" id="ct-qins" disabled>Insert the quotation</button><button type="button" class="btn ghost sm" id="ct-cins" disabled>Insert a citation</button></div></details>' +
        T.slots.map(function(s){ return '<div class="pb-slot ct-slot rg-' + s.id + '"><label for="ct-' + s.id + '"><span class="pb-tag">' + s.label + "</span> " + s.help + '</label><textarea id="ct-' + s.id + '" data-ct="' + s.id + '"></textarea></div>'; }).join("") +
        '<p class="tiny muted" id="ct-count" aria-live="polite"></p>';
      pv.innerHTML = '<h4 style="margin-top:0">Your climb</h4><div id="ct-pv" class="pb-pv"></div><div id="ct-models"></div>';
      radios($("#ct-pick"), { label:"Poem", aria:"Choose a poem", cls:"chips", options:T.poems.map(function(p){ return { id:p.id, t:p.author + ", “" + p.title + "”" }; }), value:S.poem || "", onChange:function(v){ S.poem = v; paintPoem(); all(); } });
      radios($("#ct-tgt"), { label:"Insert into", cls:"seg", options:[{ id:"obs", t:"Observation" }, { id:"ana", t:"Analysis" }], value:S.target, onChange:function(v){ S.target = v; api.save(); } });
      T.slots.forEach(function(s){ $("#ct-" + s.id).value = S[s.id] || ""; });
      inp.addEventListener("input", function(e){
        var t = e.target, id = t.dataset.ct; if (!id) return;
        var v = t.value, nv = v.replace(/(\d)-(?=\d)/g, "$1–");
        if (nv !== v) { var p0 = t.selectionStart, p1 = t.selectionEnd; t.value = nv; t.setSelectionRange(p0, p1); v = nv; }
        S[id] = v; all();
      });
      inp.addEventListener("focusin", function(e){ var id = e.target.dataset && e.target.dataset.ct; if (id === "obs" || id === "ana") { S.target = id; var b = $('#ct-tgt [data-rg="' + id + '"]'); if (b && b.getAttribute("aria-checked") !== "true") { $$("#ct-tgt [data-rg]").forEach(function(x){ x.setAttribute("aria-checked", String(x.dataset.rg === id)); x.tabIndex = x.dataset.rg === id ? 0 : -1; }); } } });
      inp.addEventListener("change", function(e){ if (e.target.id === "ct-a" || e.target.id === "ct-b" || e.target.id === "ct-au") { var c = citeText(); $("#ct-cins").textContent = c ? "Insert " + c : "Insert a citation"; $("#ct-cins").disabled = !c; } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.id === "ct-read") { read(); return; }
        if (b.id === "ct-qins") { var q = selQuote(); if (q) { insert("“" + q.q + "”", "quote"); if (tk) tk.clear(); sel = []; paintSel(); } return; }
        if (b.id === "ct-cins") { var c = citeText(); if (c) insert(c, "cite"); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ api.update(); models(); });
      voiceReady(function(v){ $("#ct-read").hidden = !v; $("#ct-rnote").hidden = !!v; });
      paintPoem(); counts(); preview(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.poem ? true : "Choose a poem first."; },
    checks:checks,
    tips:function(d, res){ return T.tips.filter(function(_, i){ return !res[i]; }); },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), L = [], P = S.poem ? poem(S.poem) : null;
      L.push(T.summary + ": " + (ts.found && ts.found.length && P ? "submitted (" + MV.plain(P.full) + ")" : "not submitted yet"));
      T.slots.forEach(function(s){ L.push("  " + s.label + ": " + (d[s.id] || "(not written yet)")); });
      L.push("  (" + total(d) + " words)");
      return L;
    },
    stop:function(){ if (speech) MV.eng.stop(); }
  };
})();

// ---------- Reflect extras: sample principles, trivium tag, commonplace book ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) { var d = document.createElement("div"); d.id = "art-samples"; d.innerHTML = R.artSamples; sheet.insertBefore(d, art); }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp) { MV.eng.commonplace(cp, { lines:R.commonplaceLines }); var lab = $('label[for="cp-note"]', cp); if (lab && R.cpNote) lab.textContent = R.cpNote; }
}

MV.module({
  hero:function(){ HERO = hero(); },
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ rungs:rungSort, unseen:unseen, spot:spotProse },
  task:task,
  onShow:function(v){ MV.eng.stop(); if (EX) EX.stop(); if (HERO) HERO.stop(); task.stop(); }
});
})();
