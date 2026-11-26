// ENG4U course helpers (toolkit/courses/eng4u.js). The assembler adds this file to every ENG4U module, after the core.
// Colour roles and classes are in eng4u.css (--an-sound, --an-figure, .an, .an-tag, .eng-tok …).
// Usage:
//   MV.eng.words(text) -> ["My", "grandmother's", …]   whitespace-separated words; a token with no letter or digit (an em dash,
//        a lone "/") is not a word.  MV.eng.wordCount(text).  MV.eng.lines(text) -> non-empty trimmed lines.
//   MV.eng.hasWord(text, "like") -> true when the whole word appears (any case).   MV.eng.norm(text) -> "lower case words
//        with punctuation and apostrophes removed" (for list matching, e.g. a cliché list).
//   MV.eng.tokenize(textOrLines, {breaks:true}) -> [{t:"clasps", line:0}, …, {t:"/", line:0, br:true}, …]
//        One token per whitespace-separated word (punctuation stays attached; a lone dash is its own token). Lines come from
//        "\n", from " / " (poetry quoted in running text) or from an array of lines. breaks:true adds a selectable line-break
//        token at the end of each line but the last (so "enjambment" can be marked).
//   MV.eng.mlaInText({author, page} | {author, par} | {author, lines:"4–5"} | {lines:"4–5"} | {title:"Hamlet", ref:"3.1.56–60"})
//        -> "(Chopin 352)" | "(Chopin, par. 9)" | "(Shelley, lines 4–5)" | "(4–5)" | "(<i>Hamlet</i> 3.1.56–60)"   (MLA 9)
//      MV.eng.isMLA(str) -> true if str contains a parenthetical citation in one of those shapes (structure check only).
//   MV.eng.passage(host, lines, {kind:"poem"|"prose", start:1, every:1, cite:"credit html", words:false})
//        line-numbered verse (a "" line is a stanza gap) or numbered prose paragraphs; words:true wraps each word in
//        <span class="eng-w" data-wi="k"> (k counts words across the passage) for read-aloud highlighting. Returns the element.
//   MV.eng.tokens(host, toks, {label, marks(), onChange(sel), onKey(key, sel), readOnly})  word-chip selector (E1's input)
//        -> {get(), set(indices), clear(), paint(), focus(i), setTokens(toks), speaking(i)}
//        Native buttons with a roving tab stop. Tap a word to add or remove it; Shift+tap selects a range.
//        Keys: ←/→ move, Shift+←/→ extend the selection, Space/Enter add or remove, Home/End, Esc clears, T calls onKey("t").
//        The site blocks native text selection for students, so ENG4U modules select words with this instead.
//        marks() -> [{w:[token indices], role:"sound"|"image"|"figure"|"syntax"|"diction"|"theme", tag:"Sound · alliteration"}]:
//        marked words get stacked role underlines and the tag text follows the last word of each mark.
//   MV.eng.voice(cb)   cb(voice | null): a LOCAL speech voice (voice.localService === true, English, en-CA first); null when
//        there is none, so no text ever leaves the device. Show "Read the line aloud yourself." in that case.
//   MV.eng.say(text, {voice, rate:1 | 0.7, onWord(wordIndex), onEnd()}) -> {stop()}   never call it without a tap (no autoplay).
//        onWord fires with the index of the word (as MV.eng.words counts them) being spoken.   MV.eng.stop().
//   MV.eng.saveLine(line, note, source)   adds a line to the commonplace book (shared record eng4u-art-v1, field commonplace).
//   MV.eng.commonplace(host, {lines:[plain text], source:"01. Literary Devices…"})   chips of today's lines (or type one),
//        a note box and a Save button; lists what this module has saved.
//   MV.eng.triviumPicker()   adds "Trivium tag: Grammar · Logic · Rhetoric" to the Reflect "My Art of Language" sheet and keeps
//        the choice in the shared record (default: the module's trivium). Call it once from a hook that runs at start.
(function(){
"use strict";
var MV = window.MV; if (!MV) return;
var esc = function(s){ return MV.esc(s); };

function words(text){ return String(text || "").split(/\s+/).filter(function(w){ return /[A-Za-z0-9À-ÿ]/.test(w); }); }
function lines(text){ return String(text || "").split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean); }
function hasWord(text, w){ return new RegExp("(^|[^A-Za-z’'])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z’'])", "i").test(String(text || "")); }
function norm(text){ return String(text || "").toLowerCase().replace(/[’'`]/g, "").replace(/[^a-z0-9à-ÿ]+/g, " ").trim(); }
function splitLines(src){
  if (Array.isArray(src)) return src;
  var s = String(src || "");
  return s.indexOf("\n") >= 0 ? s.split(/\r?\n/) : s.split(/\s+\/\s+/);
}
function tokenize(src, o){
  o = o || {};
  var L = splitLines(src).map(function(l){ return String(l).trim(); }).filter(function(l){ return l.length; }), out = [];
  L.forEach(function(l, li){
    l.split(/\s+/).forEach(function(w){ if (w) out.push({ t:w, line:li }); });
    if (o.breaks && li < L.length - 1) out.push({ t:"/", line:li, br:true });
  });
  return out;
}

// ---------- MLA 9 in-text citations ----------
function mlaInText(c){
  c = c || {};
  if (c.title) return "(<i>" + c.title + "</i> " + c.ref + ")";
  if (c.par != null) return "(" + c.author + ", par. " + c.par + ")";
  if (c.lines != null) return "(" + (c.author ? c.author + ", " : "") + (c.author ? (/[–-]/.test(String(c.lines)) ? "lines " : "line ") : "") + c.lines + ")";
  return "(" + c.author + (c.page != null ? " " + c.page : "") + ")";
}
function isMLA(s){
  var t = MV.plain ? MV.plain(String(s || "")) : String(s || "");
  return /\(\s*[A-Z][A-Za-z’'.\- ]*(\s\d+(–\d+)?|,\s*(par\.|lines?)\s*\d+(–\d+)?)\s*\)/.test(t) || /\(\s*[A-Z][^()]*\s\d+\.\d+\.\d+(–\d+)?\s*\)/.test(t);
}

// ---------- passages ----------
function passage(host, L, o){
  o = o || {};
  var n = (o.start || 1) - 1, every = o.every || 1, wi = 0, prose = o.kind === "prose";
  function wrap(text){ return o.words ? String(text).split(/(\s+)/).map(function(p){ return /^\s+$/.test(p) || !p ? p : '<span class="eng-w" data-wi="' + (wi++) + '">' + p + "</span>"; }).join("") : text; }
  var h = prose ? '<div class="eng-passage eng-prose">' + L.map(function(p, i){ return '<p><span class="eng-ln">par. ' + (i + (o.start || 1)) + "</span>" + wrap(p) + "</p>"; }).join("") + "</div>"
    : '<div class="eng-passage"><ol class="eng-poem">' + L.map(function(l){
        if (!String(l).trim()) return '<li class="eng-gap" aria-hidden="true"></li>';
        n++; return '<li><span class="eng-ln" aria-hidden="true">' + (n % every === 0 || n === 1 ? n : "") + "</span><span>" + wrap(l) + "</span></li>";
      }).join("") + "</ol></div>";
  if (o.cite) h += '<p class="eng-cite">' + o.cite + "</p>";
  host.innerHTML = h;
  return host.firstChild;
}

// ---------- word-chip selector ----------
function tokens(host, toks, o){
  o = o || {};
  var sel = [], cur = 0, anchor = null, spk = -1;
  function S(){ return sel.slice().sort(function(a, b){ return a - b; }); }
  function paint(){
    var had = host.contains(document.activeElement), marks = o.marks ? o.marks() : [], info = toks.map(function(){ return { r:[], tags:[], names:[] }; });
    marks.forEach(function(m){ var last = -1; m.w.forEach(function(i){ if (info[i]) { if (info[i].r.indexOf(m.role) < 0) info[i].r.push(m.role); info[i].names.push(MV.plain(m.tag)); last = Math.max(last, i); } }); if (last >= 0) info[last].tags.push(m); });
    if (cur >= toks.length) cur = Math.max(0, toks.length - 1);
    var h = "", line = null;
    toks.forEach(function(tk, i){
      if (tk.line !== line) { h += (line === null ? "" : "</div>") + '<div class="eng-tl">'; line = tk.line; }
      var on = sel.indexOf(i) >= 0, r = info[i].r;
      var st = r.length ? ' style="box-shadow:' + r.map(function(role, k){ return "inset 0 -" + (3 * (k + 1)) + "px 0 var(--an-" + role + ")"; }).join(",") + '"' : "";
      var lab = (tk.br ? "line break" : tk.t) + (info[i].names.length ? ", marked " + info[i].names.join("; ") : "");
      h += '<button type="button" class="eng-tok' + (tk.br ? " eng-br" : "") + (r.length ? " an an-" + r[0] : "") + (i === spk ? " speaking" : "") + '" data-ti="' + i + '" aria-pressed="' + on + '" tabindex="' + (i === cur ? 0 : -1) + '" aria-label="' + esc(lab) + '"' + st + (o.readOnly ? " disabled" : "") + ">" + (tk.br ? "↵" : esc(tk.t)) + "</button>";
      info[i].tags.forEach(function(m){ h += '<span class="an-tag an-' + m.role + '">' + m.tag + "</span>"; });
    });
    host.innerHTML = '<div class="eng-toks" role="group" aria-label="' + esc(o.label || "Words: tap to select") + '">' + h + (toks.length ? "</div>" : "") + "</div>";
    if (had) focus(cur);
  }
  function focus(i){ cur = Math.max(0, Math.min(toks.length - 1, i)); var b = host.querySelector('[data-ti="' + cur + '"]'); if (b) { MV.$$("[data-ti]", host).forEach(function(x){ x.tabIndex = -1; }); b.tabIndex = 0; b.focus({ preventScroll:false }); } }
  function changed(){ paint(); if (o.onChange) o.onChange(S()); }
  function range(a, b){ var r = []; for (var k = Math.min(a, b); k <= Math.max(a, b); k++) r.push(k); return r; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ti]"); if (!b || b.disabled) return;
    var i = +b.dataset.ti; cur = i;
    if (e.shiftKey && anchor != null) sel = range(anchor, i);
    else { var k = sel.indexOf(i); if (k < 0) sel.push(i); else sel.splice(k, 1); anchor = i; }
    changed(); focus(i);
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-ti]"); if (!b) return;
    var i = +b.dataset.ti, k = e.key, d = (k === "ArrowRight" || k === "ArrowDown") ? 1 : (k === "ArrowLeft" || k === "ArrowUp") ? -1 : 0;
    if (d) {
      e.preventDefault(); var j = Math.max(0, Math.min(toks.length - 1, i + d));
      if (e.shiftKey) { if (anchor == null || sel.indexOf(anchor) < 0) anchor = i; sel = range(anchor, j); cur = j; changed(); }
      focus(j); return;
    }
    if (k === "Home" || k === "End") { e.preventDefault(); focus(k === "Home" ? 0 : toks.length - 1); return; }
    if (k === "Escape") { if (sel.length) { e.preventDefault(); sel = []; anchor = null; changed(); } return; }
    if ((k === "t" || k === "T") && !e.ctrlKey && !e.metaKey && !e.altKey) { if (o.onKey) { e.preventDefault(); o.onKey("t", S()); } return; }
  });
  paint();
  return {
    get:S, set:function(a){ sel = (a || []).slice(); anchor = sel.length ? sel[0] : null; paint(); }, clear:function(){ sel = []; anchor = null; paint(); },
    paint:paint, focus:focus, setTokens:function(t){ toks = t; sel = sel.filter(function(i){ return i < t.length; }); paint(); },
    speaking:function(i){ spk = i; MV.$$("[data-ti]", host).forEach(function(x){ x.classList.toggle("speaking", +x.dataset.ti === i); }); }
  };
}

// ---------- read aloud: local voices only ----------
var VOICE, voiceDone = false, voiceWait = [];
function voice(cb){
  if (voiceDone) { cb(VOICE); return; }
  voiceWait.push(cb);
  if (voiceWait.length > 1) return;
  var ss = window.speechSynthesis, finished = false;
  function finish(v){ if (finished) return; finished = true; VOICE = v || null; voiceDone = true; var w = voiceWait; voiceWait = []; w.forEach(function(f){ try { f(VOICE); } catch (e) { console.error(e); } }); }
  function pick(){
    var vs = []; try { vs = ss.getVoices() || []; } catch (e) {}
    var loc = vs.filter(function(v){ return v.localService === true && /^en/i.test(v.lang || ""); });
    var best = loc.filter(function(v){ return /en[-_]CA/i.test(v.lang); })[0] || loc.filter(function(v){ return v.default; })[0] || loc[0];
    return { any:vs.length > 0, v:best || null };
  }
  if (!ss || !window.SpeechSynthesisUtterance) { finish(null); return; }
  var r = pick(); if (r.any) { finish(r.v); return; }
  try { ss.addEventListener("voiceschanged", function(){ var q = pick(); if (q.any) finish(q.v); }); } catch (e) {}
  setTimeout(function(){ finish(pick().v); }, 1500);
}
var CURU = null;
function stop(){ try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {} if (CURU && CURU._end) { var f = CURU._end; CURU._end = null; f(); } CURU = null; }
function say(text, o){
  o = o || {};
  stop();
  if (!o.voice || !window.speechSynthesis) { if (o.onEnd) o.onEnd(); return { stop:function(){} }; }
  var u = new SpeechSynthesisUtterance(text), starts = [], re = /\S+/g, m;
  while ((m = re.exec(text))) if (/[A-Za-z0-9À-ÿ]/.test(m[0])) starts.push(m.index);
  u.voice = o.voice; u.lang = o.voice.lang; u.rate = o.rate || 1;
  u.onboundary = function(e){ if (e.name && e.name !== "word") return; var k = 0; while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k++; if (o.onWord) o.onWord(k); };
  var ended = false; function end(){ if (ended) return; ended = true; if (CURU === u) CURU = null; if (o.onEnd) o.onEnd(); }
  u._end = end; u.onend = end; u.onerror = end;
  CURU = u; window.speechSynthesis.speak(u);
  return { stop:stop };
}

// ---------- commonplace book and trivium tag (shared record eng4u-art-v1) ----------
function saveLine(line, note, source){
  if (!MV.artRead) return false;
  var rec = MV.artRead(); rec.commonplace = rec.commonplace || [];
  rec.commonplace.push({ line:String(line).trim(), note:String(note || "").trim(), source:source || (MV.meta ? MV.meta.nn + ". " + MV.plain(MV.C.title) : ""), module:MV.meta ? MV.meta.id : "", saved:new Date().toISOString() });
  MV.artWrite(rec); return true;
}
function commonplace(host, o){
  o = o || {};
  function mine(){ var rec = MV.artRead ? MV.artRead() : {}; return (rec.commonplace || []).filter(function(c){ return MV.meta && c.module === MV.meta.id; }); }
  host.innerHTML = '<div class="chips" role="group" aria-label="Today’s lines">' + (o.lines || []).map(function(l, i){ return '<button type="button" class="chip" data-cpl="' + i + '" aria-pressed="false">' + esc(l) + "</button>"; }).join("") + "</div>" +
    '<div class="jq"><label for="cp-line">The line</label><textarea id="cp-line" class="cp-line" style="min-height:56px"></textarea></div>' +
    '<div class="jq"><label for="cp-note">Why it stayed with you</label><textarea id="cp-note" style="min-height:64px"></textarea></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" id="cp-save">Save to my commonplace book</button><span class="tiny muted" id="cp-status" aria-live="polite"></span></div><div id="cp-list"></div>';
  function list(){ var m = mine(); MV.$("#cp-list", host).innerHTML = m.length ? '<p class="tiny muted" style="margin:12px 0 4px">Saved from this module:</p>' + m.map(function(c){ return '<p class="an-note" style="margin:0 0 6px">“' + esc(c.line) + "”" + (c.note ? ' <span class="muted">(' + esc(c.note) + ")</span>" : "") + "</p>"; }).join("") : ""; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.cpl != null) { MV.$("#cp-line", host).value = o.lines[+b.dataset.cpl]; MV.$$("[data-cpl]", host).forEach(function(x){ x.setAttribute("aria-pressed", x === b); x.classList.toggle("on", x === b); }); }
    if (b.id === "cp-save") {
      var line = MV.$("#cp-line", host).value.trim(), st = MV.$("#cp-status", host);
      if (!line) { st.textContent = "Choose or type a line first."; return; }
      saveLine(line, MV.$("#cp-note", host).value, o.source); st.textContent = "Saved to your commonplace book."; list();
    }
  });
  list();
}
function triviumPicker(){
  var sheet = MV.$("#art-sheet"); if (!sheet || MV.$("#art-triv")) return;
  var w = MV.S.writes, def = (MV.meta.trivium || "").split(/,\s*/)[0] || "Grammar";
  var box = document.createElement("div"); box.className = "jq"; box.id = "art-triv";
  function paint(){
    var v = w["art-trivium"] || "";
    box.innerHTML = '<span style="display:block;font-weight:700;margin-bottom:6px" id="art-triv-l">Trivium tag</span><div class="chips" role="group" aria-labelledby="art-triv-l">' + ["Grammar", "Logic", "Rhetoric"].map(function(t){ var on = (v || def) === t; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-triv="' + t + '">' + t + "</button>"; }).join("") + "</div>";
  }
  function apply(){ var rec = MV.artRead(); if (rec.principles && rec.principles[MV.meta.id] && w["art-trivium"]) { rec.principles[MV.meta.id].trivium = w["art-trivium"]; MV.artWrite(rec); } }
  box.addEventListener("click", function(e){ var b = e.target.closest("[data-triv]"); if (!b) return; w["art-trivium"] = b.dataset.triv; MV.save(); apply(); paint(); var nb = box.querySelector('[data-triv="' + b.dataset.triv + '"]'); if (nb) nb.focus(); });
  // the toolkit rewrites the record 400 ms after each keystroke (with the module's trivium); put the student's tag back after it
  sheet.addEventListener("input", function(){ setTimeout(apply, 520); });
  sheet.addEventListener("click", function(e){ if (e.target.closest("[data-artx]")) setTimeout(apply, 30); });
  sheet.appendChild(box); paint();
}

MV.eng = { words:words, wordCount:function(t){ return words(t).length; }, lines:lines, hasWord:hasWord, norm:norm, tokenize:tokenize,
  mlaInText:mlaInText, isMLA:isMLA, passage:passage, tokens:tokens, voice:voice, say:say, stop:stop,
  saveLine:saveLine, commonplace:commonplace, triviumPicker:triviumPicker };
})();
