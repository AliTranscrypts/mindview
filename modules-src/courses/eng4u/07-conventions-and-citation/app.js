// ENG4U 07 Conventions & Citation: hero (Austen's breath commas, read aloud), the quotation workshop (Explore: E6 quotation
// integrator, E8 citation builder, E5 "punctuation as music"), Punctuation changes meaning (Part 3: four stations with a
// literal-reading panel), Fix the citation, the editor's proofread, Spot the Error, "Errors I make", and "The editor's desk".
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(t){ return MV.eng.wordCount(t); }
function dec(s){ return String(s).replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, function(_, n){ return String.fromCharCode(+n); }); }
function cap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function range(a, b){ var r = []; for (var i = Math.min(a, b); i <= Math.max(a, b); i++) r.push(i); return r; }

// ---------- @component radioGroup (copied from ENG4U 04; no option needs to be checked) ----------
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, refresh:paint };
}

// ---------- local voice + @component E5 pausePlayer — read a sentence in parts with timed gaps (comma 150 ms, semicolon and
// colon 350 ms, dash 250 ms, period 600 ms); a "beat bar" shows each gap as a blank of matching length, voice or no voice ----------
var VOICE = null, PLAY = null;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; fn(v); }); }
function stopPlay(){ if (PLAY) { var p = PLAY; PLAY = null; p.stop(); } }
function play(parts, gaps, o){
  stopPlay(); o = o || {};
  var segs = o.bar ? $$(".bt-s", o.bar) : [], me = { live:true, t:0 };
  function mark(k){ segs.forEach(function(s, j){ s.classList.toggle("on", j === k); }); }
  function end(){ if (!me.live) return; me.live = false; if (PLAY === me) PLAY = null; clearTimeout(me.t); mark(-1); if (o.onEnd) o.onEnd(); }
  me.stop = function(){ MV.eng.stop(); end(); };
  function step(i){
    if (!me.live) return;
    if (i >= parts.length) { end(); return; }
    mark(i * 2);
    function next(){ if (!me.live) return; if (i < gaps.length) { mark(i * 2 + 1); if (o.onGap) o.onGap(i); me.t = setTimeout(function(){ step(i + 1); }, gaps[i]); } else step(i + 1); }
    if (VOICE && !o.silent) MV.eng.say(parts[i], { voice:VOICE, rate:o.rate || 1, onEnd:next });
    else me.t = setTimeout(next, MV.reduceMotion ? 0 : Math.max(450, wc(parts[i]) * 240 / (o.rate || 1)));
  }
  PLAY = me; step(0);
  return me;
}
function beatHTML(parts, gaps){
  var h = '<div class="bt" aria-hidden="true">';
  parts.forEach(function(p, i){ h += '<i class="bt-s bt-w" style="flex:' + Math.max(1, wc(p)) + ' 1 0"></i>'; if (i < gaps.length) h += '<i class="bt-s bt-g" style="flex:0 0 ' + Math.max(6, Math.round(gaps[i] / 10)) + 'px"></i>'; });
  return h + "</div>";
}
function noVoice(){ return VOICE ? "" : "No local voice on this device, so nothing is spoken: the beat bar shows the pauses. Read it aloud yourself."; }

// ---------- hero: Austen's sentence with its breath commas; 1813 above today ----------
function hero(){
  var H = MV.C.hero, host = $("#cv-hero"); if (!host) return null;
  var P = H.passage.split(", "), run = 0;
  host.innerHTML = '<div class="cvh-box"><p class="cvh-l cvh-old"><span class="cvh-yr">1813</span><span>' + P.map(function(p, i){ return '<span class="cvh-p" data-p="' + i + '">' + esc(p) + "</span>" + (i < P.length - 1 ? '<span class="cvh-c"><span class="cvh-cm">,</span><span class="an-tag an-sound cvh-tg">' + H.tags[0] + "</span></span> " : ""); }).join("") + "</span></p>" +
    '<p class="cvh-l cvh-new"><span class="cvh-yr">today</span><span>' + esc(P.join(" ")) + ' <span class="an-tag an-syntax">' + H.tags[1] + "</span></span></p>" +
    '<p class="cvh-cap">' + H.caption + '</p><p class="eng-cite">' + H.cite + "</p></div>" +
    '<div class="q-actions"><button type="button" class="btn sm" id="cvh-a">Listen: 1813</button><button type="button" class="btn sm" id="cvh-b">Listen: today</button><button type="button" class="btn ghost sm" id="cvh-r">Replay</button></div><p class="tiny muted" id="cvh-n"></p>';
  var box = $(".cvh-box", host), C = $$(".cvh-c", host), PS = $$(".cvh-p", host);
  function pulse(i){ var m = C[i].firstChild; m.classList.remove("pulse"); void m.offsetWidth; m.classList.add("pulse"); }
  function lit(k){ PS.forEach(function(p, i){ p.classList.toggle("on", i <= k); }); }
  function finish(){ box.classList.add("done"); lit(9); C.forEach(function(c){ c.classList.add("lift"); }); }
  function animate(){
    var me = ++run; stopPlay(); box.classList.remove("done"); C.forEach(function(c){ c.classList.remove("lift"); }); lit(-1);
    play(P.map(function(p, i){ return p + (i < P.length - 1 ? "," : ""); }), [450, 450], { silent:true, rate:1.3,
      onGap:function(i){ pulse(i); lit(i + 1); },
      onEnd:function(){ if (me !== run) return; lit(9); MV.wait(300, function(){ if (me === run) C.forEach(function(c){ c.classList.add("lift"); }); });
        MV.wait(1300, function(){ if (me === run) box.classList.add("done"); }); } });
    lit(0);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "cvh-r") { animate(); return; }
    run++; finish();
    var old = b.id === "cvh-a";
    play(old ? P.map(function(p, i){ return p + (i < P.length - 1 ? "," : ""); }) : [P.join(" ")], old ? [450, 450] : [], { onGap:pulse });
  });
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(function(){ $("#cvh-n").textContent = noVoice(); if (!VOICE) { $("#cvh-a").textContent = "Show the 1813 pauses"; $("#cvh-b").hidden = true; } });
  return { stop:stopPlay };
}

// ---------- @component E8 citationBuilder — MLA 9 Works Cited entries from the core elements: order (Move up / Move down), a form
// picker per element (name order, quotation marks or italics, "edited by", pp.), the punctuation after each, checked against the
// card's key (whitespace-normalized; italics are a flag, never typed). Reused by the task; course plan E8 (07, 18, 19). ----------
function wcEl(card, id){ return card.els.filter(function(e){ return e.id === id; })[0]; }
function wcOrd(card, st){ return st.order && st.order.length === card.els.length ? st.order : card.els.map(function(e){ return e.id; }); }
function wcIdx(card, e){ return MV.shuffle(e.forms.map(function(_, i){ return i; }), card.id + e.id); }
function wcForm(card, st, id){ var e = wcEl(card, id), k = st.form && st.form[id] != null ? +st.form[id] : wcIdx(card, e)[0]; return e.forms[k] || e.forms[0]; }
function wcPiece(f, p, html){ var t = html ? esc(f.t) : f.t; if (f.s === "q") return "“" + t + p + "”"; if (f.s === "i") return (html ? "<i>" + t + "</i>" : t) + p; return t + p; }
function wcEntry(card, st, html){ return wcOrd(card, st).map(function(id){ return wcPiece(wcForm(card, st, id), (st.p || {})[id] || "", html); }).join(" "); }
function wcOk(card, id, f){ var e = wcEl(card, id); return e.forms.indexOf(f) === MV.ans(card).f[id]; }
function wcKey(card, html){ var k = MV.ans(card); return k.order.map(function(id){ return wcPiece(wcEl(card, id).forms[k.f[id]], k.p[id], html); }).join(" "); }
function wcScore(card, st){
  var key = MV.ans(card), o = wcOrd(card, st), r = { n:o.length, ord:0, pu:0, fo:0, err:null };
  o.forEach(function(id, i){ if (key.order[i] === id) r.ord++; if (((st.p || {})[id] || "") === key.p[id]) r.pu++; var f = wcForm(card, st, id); if (wcOk(card, id, f)) r.fo++; else if (!r.err) r.err = f.e; });
  r.ok = r.ord === r.n && r.pu === r.n && r.fo === r.n; r.dateFirst = o.indexOf("date") >= 0 && o.indexOf("pub") >= 0 && o.indexOf("date") < o.indexOf("pub");
  r.line = "Elements in order " + r.ord + "/" + r.n + " · punctuation " + r.pu + "/" + r.n + " · forms " + r.fo + "/" + r.n;
  return r;
}
function factsHTML(c){ return '<div class="wc-facts">' + (c.fict ? '<p><span class="tag">practice source (fictional)</span></p>' : "") + c.facts + "</div>"; }
function wcLabel(f){ return f.s === "q" ? "“" + f.t + "” (quotation marks)" : f.s === "i" ? f.t + " (italics)" : f.s === "" ? f.t + " (plain)" : f.t; }
function wcUI(host, card, st, onChange){
  function paint(){
    var o = wcOrd(card, st);
    MV.keepFocus(host, function(){
      host.innerHTML = '<ol class="wcb">' + o.map(function(id, i){
        var e = wcEl(card, id), f = wcForm(card, st, id), p = (st.p || {})[id] || "", k = e.forms.indexOf(f);
        var fs = e.forms.length > 1 ? '<select class="cv-sel wcb-f" data-wf="' + id + '" data-k="wf' + card.id + id + '" aria-label="Form of the ' + esc(e.label) + '">' + wcIdx(card, e).map(function(j){ return '<option value="' + j + '"' + (j === k ? " selected" : "") + ">" + esc(wcLabel(e.forms[j])) + "</option>"; }).join("") + "</select>"
          : '<span class="wcb-v">' + wcPiece(f, "", true) + "</span>";
        return '<li class="wcb-r"><span class="wcb-l">' + e.label + "</span>" + fs + '<select class="cv-sel wcb-p" data-wp="' + id + '" data-k="wp' + card.id + id + '" aria-label="Punctuation after the ' + esc(e.label) + '">' + [["", "no mark"], [".", "."], [",", ","]].map(function(x){ return '<option value="' + x[0] + '"' + (x[0] === p ? " selected" : "") + ">" + x[1] + "</option>"; }).join("") + "</select>" +
          '<span class="wcb-mv"><button type="button" class="btn ghost sm" data-wu="' + id + '" data-k="wu' + card.id + id + '"' + (i ? "" : " disabled") + ' aria-label="Move ' + esc(e.label) + ' up">↑</button><button type="button" class="btn ghost sm" data-wd="' + id + '" data-k="wd' + card.id + id + '"' + (i < o.length - 1 ? "" : " disabled") + ' aria-label="Move ' + esc(e.label) + ' down">↓</button></span></li>';
      }).join("") + '</ol><p class="wcb-o"><span class="cv-ol">Your entry</span><span class="wc-e">' + wcEntry(card, st, true) + "</span></p>";
    });
  }
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset.wf) { st.form = st.form || {}; st.form[t.dataset.wf] = +t.value; }
    else if (t.dataset.wp) { st.p = st.p || {}; st.p[t.dataset.wp] = t.value; } else return;
    paint(); onChange();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-wu],[data-wd]"); if (!b || b.disabled) return;
    var id = b.dataset.wu || b.dataset.wd, o = wcOrd(card, st).slice(), i = o.indexOf(id), j = i + (b.dataset.wu ? -1 : 1);
    if (j < 0 || j >= o.length) return;
    o[i] = o[j]; o[j] = id; st.order = o; paint();
    var nb = host.querySelector('[data-k="' + (b.dataset.wu ? "wu" : "wd") + card.id + id + '"]');
    if (nb && nb.disabled) nb = host.querySelector('[data-k="' + (b.dataset.wu ? "wd" : "wu") + card.id + id + '"]');
    if (nb) nb.focus(); onChange();
  });
  paint();
  return { paint:paint };
}

// Works Cited cards derived from an encoded template (same element ids, forms and key): swap the author, title, kind and pages.
function derive(tpl, id, label, from, to){
  var c = JSON.parse(JSON.stringify(tpl)), one = !/–/.test(to.pages);
  function sw(s){
    s = String(s).replace("pp. " + from.pages, (one ? "p. " : "pp. ") + to.pages).replace("pages " + from.pages, (one ? "page " : "pages ") + to.pages).split(from.pages).join(to.pages);
    return s.split(from.author).join(to.author).split(from.first).join(to.first).split(from.title).join(to.title).replace("The " + from.kind + " ", "The " + to.kind + " ");
  }
  c.id = id; c.label = label; c.facts = sw(c.facts); c.els.forEach(function(e){ e.forms.forEach(function(f){ f.t = sw(f.t); }); });
  return c;
}
function textBy(id){ return MV.C.task.texts.filter(function(x){ return x.id === id; })[0]; }
function cards(){
  var T = MV.C.task, W = MV.C.explore.wc;
  if (!T.cards) {
    var A = W.cards[0], fb = textBy("brill"), fh = textBy("hour"); T.cards = [];
    T.texts.forEach(function(t){
      T.cards.push(derive(A, t.id + "-anth", "Anthology", fb, t));
      var s = derive(T.screen, t.id + "-screen", "On screen", fh, t);
      if (t.id === "oz") s.facts = s.facts.replace("numbered paragraphs", "numbered lines");
      if (t.id === "bacon") s.facts = s.facts.replace("with numbered paragraphs", "as one paragraph without numbers");
      T.cards.push(s);
    });
    W.cards.splice(1, 0, derive(A, "b", "(b) A poem in the anthology", fb, textBy("oz")));
  }
  return T.cards;
}

// ---------- in-text citation helpers (MLA 9; course plan §4 and plan §5 patterns) ----------
function citeHTML(c){ return esc(c).replace(/\b(Hamlet|Ham\.)(?= \d)/, "<em>$1</em>"); }
function norm(c){ return String(c || "").replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")").trim(); }

// ---------- @component E6 quotationIntegrator + Explore: the quotation workshop (Integrate · Works Cited · Punctuation as music) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, SRC = {}, MU = C.music, W = C.wc, tk = null, anim = {}, RUN = 0, lastTap = null, TKC = {};
  cards();
  C.sources.forEach(function(s){ SRC[s.id] = s; });
  if (["int", "wc", "mus"].indexOf(S.mode) < 0) S.mode = "int";
  if (!SRC[S.src]) S.src = "oz";
  S.sub = S.sub || {}; S.q = S.q || {}; S.wc = S.wc || {}; S.mk = S.mk || {};
  if (S.lead == null) S.lead = ""; S.lb = S.lb || "none"; S.fmt = S.fmt || "inline"; S.per = S.per || "before"; S.tool = S.tool === "adj" ? "adj" : "cut";
  S.card = S.card || "a"; if (!S.list || S.list.length !== 5) S.list = W.list.start.slice(); if (S.hang == null) S.hang = true;
  S.ms = S.ms || "s2"; if (!S.seenMus && S.mk.s2 == null) S.mk.s2 = "colon";

  host.innerHTML = '<div class="cv"><div id="cv-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p><div class="cv-body" data-mv="graph"><div class="cv-main" id="cv-main"></div>' +
    '<aside class="cv-side"><h4 class="cv-rh">Readout</h4><dl class="read" id="cv-read" aria-live="polite"></dl></aside></div><p class="cv-aha">' + C.aha + "</p></div>";
  var modeRG = radios($("#cv-mode"), { label:"Mode", options:[{ id:"int", t:"Integrate" }, { id:"wc", t:"Works Cited" }, { id:"mus", t:"Punctuation as music" }], value:S.mode, onChange:function(v){ RUN++; setMode(v); } });
  function setMode(v){ stopPlay(); S.mode = v; modeRG.set(v); api.save(); paint(); }
  function paint(){ if (S.mode === "int") paintInt(); else if (S.mode === "wc") paintWC(); else paintMus(); read(); MV.changed(); }
  function changed(){ RUN++; api.save(); update(); }
  function update(){ if (S.mode === "int") { paintQS(); paintSent(); } read(); MV.changed(); }

  // ----- Integrate -----
  function src(){ return SRC[S.src]; }
  function sub(id){ var s = SRC[id || S.src]; if (s.type === "poetry") return "all"; if (s.type === "drama") return S.sub.ham || "h3"; return String(S.sub[s.id] || s.start); }
  function unit(id, k){
    var s = SRC[id || S.src]; k = k || sub(id);
    if (s.type === "poetry") return { lines:s.lines, start:s.start };
    if (s.type === "drama") { var p = s.passages.filter(function(x){ return x.id === k; })[0]; return { lines:p.lines, start:p.start, ref:p.ref }; }
    return { lines:[s.pars[+k - s.start]], start:+k, par:true };
  }
  function toks(id, k){ var key = (id || S.src) + ":" + (k || sub(id)); return TKC[key] || (TKC[key] = MV.eng.tokenize(unit(id, k).lines.map(dec))); }
  function qs(id, k){ var key = (id || S.src) + ":" + (k || sub(id)); return S.q[key] || (S.q[key] = { a:-1, b:-1, cut:{}, adj:{}, cite:"" }); }
  function leadOpts(){ return C.leads.map(function(l, i){ return { id:"l" + i, t:l.replace("{a}", src().author) }; }).concat([{ id:"none", t:"none (embedded)" }]); }
  function leadVal(){ var o = leadOpts().filter(function(x){ return x.id !== "none" && x.t === S.lead; })[0]; return o ? o.id : (S.lead ? "" : "none"); }
  function bracket(orig, rep){
    var o = dec(orig), m = o.match(/^([“"‘(]*)(.*?)([,;:.!?”"’)]*)$/), core = m[2];
    rep = String(rep).trim();
    if (rep.toLowerCase() === core.toLowerCase() && rep.slice(1) === core.slice(1)) return "[" + rep.charAt(0) + "]" + rep.slice(1) + m[3];
    return "[" + rep + "]" + m[3];
  }
  function paintInt(){
    var s = src(), u = unit();
    $("#cv-main").innerHTML = '<div id="cv-src"></div><div id="cv-sub"></div><div class="cv-text' + (u.par ? "" : " cv-verse") + '"><div id="cv-toks"></div><p class="eng-cite">' + s.cite + "</p></div>" +
      '<p class="tiny muted cv-tip">Tap the first word of your quotation, then the last (or Shift + arrows from a focused word). Tap again to start over.</p><div class="cv-qs" id="cv-qs"></div>' +
      '<div class="cv-ctl"><div id="cv-lead"></div><div class="cv-leadin"><label class="tiny" for="cv-leadt">Or type a signal phrase</label><input id="cv-leadt" class="txtin" type="text" autocomplete="off"></div>' +
      (s.type !== "prose" ? '<div id="cv-lb"></div>' : "") + '<div id="cv-fmt"></div><p class="tiny cv-sug" id="cv-sug" aria-live="polite"></p>' +
      '<div class="cv-cite"><label for="cv-ct">Citation</label><input id="cv-ct" class="txtin" type="text" autocomplete="off" spellcheck="false"><button type="button" class="btn ghost sm" id="cv-prop"></button></div><div id="cv-per"></div></div>' +
      '<div class="cv-out"><p class="cv-ol">Your sentence</p><div id="cv-sent" class="cv-sent" aria-live="polite"></div><button type="button" class="linkbtn" id="cv-showcut" hidden></button><p class="cv-orig" id="cv-orig" hidden></p></div>';
    radios($("#cv-src"), { label:"Source", cls:"chips", options:C.sources.map(function(x){ return { id:x.id, t:x.label }; }), value:S.src, onChange:function(v){ RUN++; S.src = v; api.save(); paint(); } });
    if (s.type === "drama") radios($("#cv-sub"), { label:"Passage", cls:"chips", options:s.passages.map(function(p){ return { id:p.id, t:p.ref + "." + p.start + "–" + (p.start + p.lines.length - 1) + " (" + p.who + ")" }; }), value:sub(), onChange:function(v){ RUN++; S.sub.ham = v; api.save(); paint(); } });
    else if (u.par && !s.one) $("#cv-sub").innerHTML = '<label class="cv-parl">Paragraph <select id="cv-par" class="cv-sel">' + s.pars.map(function(_, i){ var n = i + s.start; return '<option value="' + n + '"' + (String(n) === sub() ? " selected" : "") + ">par. " + n + "</option>"; }).join("") + "</select></label>";
    var box = $("#cv-toks"); box.innerHTML = "<div></div>";
    if (!u.par) box.style.counterReset = "cvln " + (u.start - 1);
    else box.setAttribute("data-par", s.one ? "" : "par. " + u.start);
    box.addEventListener("click", function(e){ var b = e.target.closest("[data-ti]"); lastTap = b ? { i:+b.dataset.ti, shift:e.shiftKey } : null; }, true);
    tk = MV.eng.tokens(box.firstChild, toks(), { label:"Source words: tap the first and last words of your quotation", onChange:onSel });
    var x = qs(); if (x.a >= 0) tk.set(range(x.a, x.b));
    radios($("#cv-lead"), { label:"Signal phrase", cls:"chips", options:leadOpts(), value:leadVal(), onChange:function(v){ S.lead = v === "none" ? "" : leadOpts().filter(function(o){ return o.id === v; })[0].t; $("#cv-leadt").value = S.lead; changed(); } });
    $("#cv-leadt").value = S.lead;
    if (s.type !== "prose") radios($("#cv-lb"), { label:"Line breaks", cls:"chips", options:C.breaks, value:S.lb, onChange:function(v){ S.lb = v; changed(); } });
    radios($("#cv-fmt"), { label:"Format", options:[{ id:"inline", t:"Inline" }, { id:"block", t:"Block" }], value:S.fmt, onChange:function(v){ S.fmt = v; changed(); } });
    radios($("#cv-per"), { label:"Period", options:[{ id:"after", t:"after the citation" }, { id:"before", t:"before the citation" }], value:S.per, onChange:function(v){ S.per = v; changed(); } });
    $("#cv-ct").value = qs().cite;
    paintQS(); paintSent();
  }
  function onSel(sel){
    var x = qs(), was = x.a < 0 ? [] : range(x.a, x.b), a = -1, b = -1, t = lastTap; lastTap = null;
    if (!sel.length) { a = b = -1; }
    else if (t && !t.shift) { if (was.length === 1 && t.i !== was[0]) { a = Math.min(was[0], t.i); b = Math.max(was[0], t.i); } else a = b = t.i; }
    else { a = sel[0]; b = sel[sel.length - 1]; }
    x.a = a; x.b = b;
    Object.keys(x.cut).forEach(function(i){ if (+i <= a || +i >= b) delete x.cut[i]; });
    Object.keys(x.adj).forEach(function(i){ if (+i < a || +i > b) delete x.adj[i]; });
    if (S.adjAt != null && (S.adjAt < a || S.adjAt > b)) S.adjAt = null;
    var want = a < 0 ? [] : range(a, b);
    if (want.join() !== sel.join()) tk.set(want);
    changed();
  }
  function paintQS(){
    var x = qs(), el = $("#cv-qs"); if (!el) return;
    if (x.a < 0) { el.innerHTML = ""; return; }
    var T = toks();
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="cv-qsh"><span class="rg-lab">Trim your quotation: tap a word to</span><span id="cv-tool"></span></div><div class="cv-qw" role="group" aria-label="Your quotation’s words">' + range(x.a, x.b).map(function(i){
        var c = !!x.cut[i], ad = x.adj[i] != null, on = S.tool === "cut" ? c : S.adjAt === i;
        return '<button type="button" class="cv-w' + (c ? " cut" : "") + (ad ? " adj" : "") + '" data-qw="' + i + '" data-k="qw' + i + '" aria-pressed="' + on + '"' + (i === x.a || i === x.b ? ' data-edge="1"' : "") + ">" + esc(ad ? bracket(T[i].t, x.adj[i]) : dec(T[i].t)) + "</button>";
      }).join("") + "</div>" +
      (S.tool === "adj" && S.adjAt != null ? '<div class="cv-adj"><label for="cv-adjin">Replace “' + esc(dec(T[S.adjAt].t).replace(/[^A-Za-z’'-]/g, "")) + '” with</label><input id="cv-adjin" class="txtin" type="text" autocomplete="off" value="' + esc(x.adj[S.adjAt] || "") + '"><button type="button" class="btn sm" id="cv-adjok">Apply [ ]</button><button type="button" class="btn ghost sm" id="cv-adjno">Undo</button></div>' : "") +
      '<p class="tiny muted">' + (S.tool === "cut" ? "Cut words inside the quotation: an ellipsis ( . . . ) goes in automatically. To trim the start or end, change your selection instead." : "Adjust a word (a pronoun or verb form): your change goes in [square brackets].") + "</p>";
    });
    radios($("#cv-tool"), { cls:"seg", aria:"Trim tool", options:[{ id:"cut", t:"Cut it" }, { id:"adj", t:"Adjust it" }], value:S.tool, onChange:function(v){ S.tool = v; S.adjAt = null; api.save(); paintQS(); var f = $('#cv-tool [aria-checked="true"]'); if (f) f.focus(); } });
  }
  function compose(){
    var x = qs(), T = toks(), s = src();
    if (x.a < 0) return null;
    var idx = []; for (var i = x.a; i <= x.b; i++) if (!x.cut[i]) idx.push(i);
    var block = S.fmt === "block", P = [], r = { ell:0, br:0, sl:0, nb:0, nl:T[x.b].line - T[x.a].line + 1, words:idx.length };
    idx.forEach(function(i, k){
      var o = T[i].t, w = x.adj[i] != null ? bracket(o, x.adj[i]) : dec(o);
      if (x.adj[i] != null) r.br++;
      if (k === 0 && /^[“"]/.test(o)) w = w.replace(/^[“"]/, "");
      if (k === idx.length - 1 && /[”"]$/.test(o)) w = w.replace(/[”"]$/, "");
      w = w.replace(/“/g, "‘").replace(/”/g, "’");
      if (k) {
        var pv = idx[k - 1], nl = T[i].line !== T[pv].line;
        if (i - pv > 1) { r.ell++; P.push({ k:"ell" }); }
        if (nl) { r.nb++; var lb = block ? "nl" : S.lb; if (lb === "slash") r.sl++; if (lb === "comma") { var lw = P[P.length - 1]; if (lw.k === "w") lw.t = lw.t.replace(/[,;:]+$/, ""); } P.push({ k:lb }); }
        else if (i - pv === 1) P.push({ k:"sp" });
      }
      P.push({ k:"w", t:w, adj:x.adj[i] != null });
    });
    var last = P[P.length - 1];
    if (S.per === "after") last.t = last.t.replace(/[,;:.—–-]+$/, "");
    else if (block) { if (!/[.!?]$/.test(last.t)) last.t = last.t.replace(/[,;:—–-]+$/, "") + "."; }
    else last.t = last.t.replace(/[,;:.!?—–-]+$/, "") + ".";
    r.parts = P; r.bang = /[!?]$/.test(dec(T[x.b].t).replace(/[”"]$/, ""));
    return r;
  }
  function sentHTML(c, tags){
    var lead = cap(S.lead.trim()), cite = norm(qs().cite), block = S.fmt === "block";
    var q = c.parts.map(function(p){
      if (p.k === "w") return p.adj ? '<span class="cv-brk">' + esc(p.t) + "</span>" : esc(p.t);
      if (p.k === "ell") return ' <span class="cv-el">. . .</span> ';
      if (p.k === "slash") return ' <span class="cv-sl' + (tags && anim.slash ? " drop" : "") + '">/' + (tags && anim.slash ? '<span class="an-tag an-syntax cv-tg">line break</span>' : "") + "</span> ";
      if (p.k === "nl") return "<br>";
      if (p.k === "comma") return ", ";
      return " ";
    }).join("");
    var ci = cite ? ' <span class="cv-ci' + (tags && anim.cite ? " slide" : "") + '">' + citeHTML(cite) + "</span>" : "";
    var pe = S.per === "after" ? '<span class="cv-pe' + (tags && anim.hop ? " hop" : "") + '">.' + (tags && anim.hop ? '<span class="an-tag an-syntax cv-tg">MLA: period last</span>' : "") + "</span>" : "";
    if (block) return (lead ? "<p>" + esc(lead) + "</p>" : "") + '<div class="cv-blk">' + q + ci + pe + "</div>";
    return "<p>" + (lead ? esc(lead) + " " : "") + "“" + q + "”" + ci + pe + "</p>";
  }
  function sentText(){ var c = compose(); return c ? MV.plain(sentHTML(c, false)) : ""; }
  function paintSent(){
    var el = $("#cv-sent"); if (!el) return;
    var c = compose(), x = qs(), T = toks();
    el.innerHTML = c ? sentHTML(c, true) : '<p class="muted">Select words in the source to start your sentence.</p>';
    var p = proposal(); $("#cv-prop").textContent = p ? "Use " + p : "Use the proposed citation"; $("#cv-prop").disabled = !p;
    var cuts = c && Object.keys(x.cut).length, sb = $("#cv-showcut"), og = $("#cv-orig");
    sb.hidden = !cuts; sb.textContent = S.showCut ? "Hide what I cut" : "Show what I cut"; sb.setAttribute("aria-expanded", String(!!S.showCut));
    og.hidden = !(cuts && S.showCut);
    if (cuts) {
      var s0 = x.a, s1 = x.b; while (s0 > 0 && !/[.!?][”"’]?$/.test(T[s0 - 1].t)) s0--; while (s1 < T.length - 1 && !/[.!?][”"’]?$/.test(T[s1].t)) s1++;
      og.innerHTML = '<span class="cv-ol">The source sentence: words you cut or left out are grey</span>' + range(s0, s1).map(function(i){ var w = esc(dec(T[i].t)); return x.cut[i] || i < x.a || i > x.b ? '<s class="cv-gone' + (x.cut[i] ? " cut" : "") + (anim.cut ? " show" : "") + '">' + w + "</s>" : w; }).join(" ");
    }
    var lines = c ? (src().type === "prose" ? Math.max(1, Math.ceil(c.words / 11)) : c.nl) : 0, long = src().type === "prose" ? lines > 4 : lines > 3;
    $("#cv-sug").textContent = c && long && S.fmt !== "block" ? "Suggestion: this is long enough for a block quotation. Your choice." : "";
  }
  function nums(){ var x = qs(), T = toks(), u = unit(); if (x.a < 0) return null; return { a:u.start + T[x.a].line, b:u.start + T[x.b].line, ref:u.ref }; }
  function rng(n){ return n.a === n.b ? String(n.a) : n.a + "–" + n.b; }
  function proposal(){
    var s = src(), n = nums(); if (!n) return "";
    if (s.type === "drama") return "(Hamlet " + n.ref + "." + rng(n) + ")";
    return MV.eng.mlaInText(s.type === "poetry" ? { author:s.author, lines:rng(n) } : s.one ? { author:s.author } : { author:s.author, par:n.a });
  }
  function named(){ return new RegExp("\\b" + (src().type === "drama" ? "Hamlet" : src().author) + "\\b").test(S.lead); }
  function citeCheck(){
    var s = src(), n = nums(), c = norm(qs().cite), hy = /\d-\d/.test(c), cc = c.replace(/(\d)-(\d)/g, "$1–$2"), au = s.author, m, R;
    if (!n) return { ok:false, t:"Select a quotation first." };
    if (!c) return named() && s.one ? { ok:true, t:"none: Bacon is named in your sentence ✓" } : { ok:false, t:"No citation yet. Use the proposed one or type your own." };
    function res(ok, t){ return { ok:ok, t:(ok ? norm(c) + " ✓ MLA" : "✗ " + t) + (ok && hy ? " (" + MV.C.task.hyphen + ")" : "") }; }
    if (s.type === "poetry") {
      if (!(m = cc.match(/^\((?:([A-Z][a-z]+),? )?(lines?) ?(\d+)(?:–(\d+))?\)$/))) {
        if (/^\((?:[A-Z][a-z]+ )?\d/.test(cc)) return res(false, "For poetry, MLA cites lines, and the first citation says “lines”: (lines " + rng(n) + ").");
        return res(false, "Poetry citation pattern: (Shelley, lines 10–11), or (lines 10–11) when your sentence names Shelley.");
      }
      if (+m[3] !== n.a || +(m[4] || m[3]) !== n.b) return res(false, "The numbers don’t match your quotation: lines " + rng(n) + ".");
      if (m[1] && m[1] !== au) return res(false, "This poem is by " + au + ".");
      if (m[1] && named()) return res(false, au + " is named in your signal phrase, so cite just the lines: (lines " + rng(n) + ").");
      if (!m[1] && !named()) return res(false, "Your sentence doesn’t name " + au + ", so the citation must: (" + au + ", lines " + rng(n) + ").");
      if (!/,/.test(cc) && m[1]) return res(false, "Put a comma after the author: (" + au + ", lines " + rng(n) + ").");
      return res(true);
    }
    if (s.type === "drama") {
      if (!(m = cc.match(/^\((?:(Hamlet|Ham\.) )?(\d)\.(\d)\.(\d+)(?:–(\d+))?\)$/))) return res(false, "MLA uses periods: act.scene.line, after the italicized title: (Hamlet " + n.ref + "." + rng(n) + ").");
      if (m[2] + "." + m[3] !== n.ref || +m[4] !== n.a || +(m[5] || m[4]) !== n.b) return res(false, "The numbers don’t match your quotation: " + n.ref + "." + rng(n) + ".");
      if (!m[1] && !named()) return res(false, "Your sentence doesn’t name the play, so start with its title: (Hamlet " + n.ref + "." + rng(n) + ").");
      return res(true);
    }
    if (s.one) {
      if (cc === "(Bacon)") return res(true);
      if (/\(Bacon,? \d/.test(cc)) return res(false, "You’re quoting the on-screen essay (one paragraph, no page numbers), so cite the author only. Use page numbers only when citing the printed anthology.");
      return res(false, "Cite the on-screen essay by author only: (Bacon).");
    }
    if (!(m = cc.match(/^\((?:([A-Z][a-z]+),? )?pars?\. (\d+)(?:–(\d+))?\)$/))) {
      if (/^\([A-Z][a-z]+ \d/.test(cc)) return res(false, "On-screen paragraphs aren’t pages. Write “par.” after a comma: (" + au + ", par. " + n.a + ").");
      return res(false, "On-screen prose pattern: (" + au + ", par. " + n.a + ").");
    }
    if (+m[2] !== n.a) return res(false, "Your quotation is from paragraph " + n.a + ".");
    if (m[1] && m[1] !== au) return res(false, "This story is by " + au + ".");
    if (!m[1] && !named()) return res(false, "Your sentence doesn’t name " + au + ", so the citation must: (" + au + ", par. " + n.a + ").");
    if (m[1] && !/,/.test(cc)) return res(false, "Put a comma after the author: (" + au + ", par. " + n.a + ").");
    return res(true);
  }
  // meaning check: pre-scored for Bacon's "Read not to … but to weigh and consider" (the not / nor / nor governors must stay with
  // the words they negate; brackets may only change a letter's case). Other trims: "Check: does it still mean what the source meant?"
  function baconR(){ var T = toks("bacon"); for (var i = 0; i < T.length - 1; i++) if (T[i].t === "Read" && T[i + 1].t === "not") return i; return -1; }
  function meaning(){
    var x = qs(), s = src(), T = toks();
    var ch = Object.keys(x.cut).length + Object.keys(x.adj).length;
    if (x.a < 0 || !ch) return "none";
    if (s.id !== "bacon") return "check";
    var r = baconR(); if (x.b < r || x.a > r + 23) return "check";
    function kept(i){ return i >= x.a && i <= x.b && !x.cut[i]; }
    function caseOnly(i){ return x.adj[i] == null || String(x.adj[i]).trim().toLowerCase() === dec(T[i].t).replace(/[^A-Za-z]/g, "").toLowerCase(); }
    for (var j = r; j <= r + 23; j++) if (kept(j) && !caseOnly(j)) return "bracket";
    var G = [[r + 1, [r + 3, r + 5]], [r + 6, [r + 8, r + 10, r + 12]], [r + 13, [r + 15, r + 16, r + 18]]], bad = false;
    G.forEach(function(g){ if (g[1].some(kept) && !kept(g[0])) bad = true; });
    return bad ? "cut" : "kept";
  }
  function intRows(){
    var s = src(), c = compose(), R = [];
    R.push(["Source type", s.type === "poetry" ? "Poetry (numbered lines)" : s.type === "drama" ? "Drama in verse (act.scene.line)" : s.one ? "Prose (one paragraph, no numbers)" : "Prose (numbered paragraphs)"]);
    if (!c) { R.push(["Quotation", "Select a span of the text."]); return R; }
    var verse = s.type !== "prose", n = verse ? c.nl : Math.max(1, Math.ceil(c.words / 11)), long = verse ? n > 3 : n > 4;
    R.push(["Quotation length", (verse ? n + " line" + (n > 1 ? "s" : "") + " of " + (s.type === "drama" ? "verse" : "poetry") : "≈ " + n + " typed line" + (n > 1 ? "s" : "") + " of prose") + ": " + S.fmt + (long ? (S.fmt === "block" ? " ✓" : " · Consider a block quotation") : (S.fmt === "block" ? " · short enough to stay inline" : ""))]);
    if (verse) R.push(["Line breaks", S.fmt === "block" ? "kept as lines (block) ✓" : !c.nb ? "one line: no slash needed ✓" : c.sl === c.nb ? c.sl + " slash" + (c.sl > 1 ? "es" : "") + " ( / ) ✓" : c.sl + " slashes for " + c.nb + " line break" + (c.nb > 1 ? "s" : "") + " ✗"]);
    var m = meaning();
    R.push(["Changes to the source", c.ell + (c.ell === 1 ? " ellipsis" : " ellipses") + " · " + c.br + " bracket" + (c.br === 1 ? "" : "s") + " · " + (m === "none" ? "no changes" : m === "kept" ? "meaning check: kept ✓" : m === "check" ? "Check: does it still mean what the source meant?" : "meaning check: twisted ✗")]);
    R.push(["Citation", citeCheck().t]);
    R.push(["Sentence ends", S.fmt === "block" ? (S.per === "before" ? "Period before the citation ✓ (block quotation)" : "Period after the citation ✗ (a block puts it before)") : (S.per === "after" ? "Period after the citation ✓" : "Period inside the quotation marks ✗ (MLA: period last)")]);
    return R;
  }

  // ----- Works Cited -----
  function card(id){ return W.cards.filter(function(c){ return c.id === (id || S.card); })[0]; }
  function cst(id){ return S.wc[id] || (S.wc[id] = {}); }
  var KEYS = null;
  function listOK(){ var a = MV.ans(W.list); return S.list.filter(function(id, i){ return a[i] === id; }).length; }
  function paintWC(){
    var list = S.card === "list";
    $("#cv-main").innerHTML = '<div id="wc-cards"></div>' + (list ? '<div id="wc-list"></div>' : factsHTML(card()) + '<p class="tiny muted">' + W.intro + '</p><p class="wc-tpl"><span class="cv-ol">Template</span>' + W.template + '</p><div id="wc-b"></div>');
    radios($("#wc-cards"), { label:"Source card", cls:"chips", options:W.cards.map(function(c){ return { id:c.id, t:c.label.replace(/^(\(\w\)).*$/, "$1") }; }).concat([{ id:"list", t:"Works Cited list" }]), value:S.card, onChange:function(v){ RUN++; S.card = v; api.save(); paint(); } });
    if (list) paintList(); else wcUI($("#wc-b"), card(), cst(S.card), function(){ changed(); });
  }
  function paintList(){
    KEYS = KEYS || {}; W.cards.forEach(function(c){ if (!KEYS[c.id]) KEYS[c.id] = wcKey(c, true); });
    var el = $("#wc-list");
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="tiny muted">Put the five entries in alphabetical order (by their first word, ignoring quotation marks), with hanging indents.</p><div id="wc-hang"></div><ol class="wcl' + (S.hang ? " hang" : "") + '">' + S.list.map(function(id, i){
        return '<li><span class="wc-e">' + KEYS[id] + '</span><span class="wcb-mv"><button type="button" class="btn ghost sm" data-lu="' + id + '" data-k="lu' + id + '"' + (i ? "" : " disabled") + ' aria-label="Move up">↑</button><button type="button" class="btn ghost sm" data-ld="' + id + '" data-k="ld' + id + '"' + (i < 4 ? "" : " disabled") + ' aria-label="Move down">↓</button></span></li>';
      }).join("") + "</ol>";
    });
    radios($("#wc-hang"), { label:"Hanging indent", options:[{ id:"on", t:"Show" }, { id:"off", t:"Hide" }], value:S.hang ? "on" : "off", onChange:function(v){ S.hang = v === "on"; api.save(); paintList(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-lu],[data-ld]"); if (!b || b.disabled) return;
    var id = b.dataset.lu || b.dataset.ld, L = S.list, i = L.indexOf(id), j = i + (b.dataset.lu ? -1 : 1); if (j < 0 || j > 4) return;
    L[i] = L[j]; L[j] = id; paintList(); var nb = $('[data-k="' + (b.dataset.lu ? "lu" : "ld") + id + '"]'); if (nb && nb.disabled) nb = $('[data-k="' + (b.dataset.lu ? "ld" : "lu") + id + '"]'); if (nb) nb.focus(); changed();
  });
  function wcRows(){
    if (S.card === "list") { var k = listOK(); return [["Works Cited list", (k === 5 ? "Alphabetical order ✓" : k + " of 5 entries in place") + " · hanging indent " + (S.hang ? "shown" : "hidden")]]; }
    var c = card(), sc = wcScore(c, cst(c.id));
    return [["Source", MV.plain(c.label)], ["Works Cited", sc.line + (sc.ok ? " ✓ exact" : "")]];
  }

  // ----- Punctuation as music (E5) -----
  function ms(){ return MU.sents.filter(function(s){ return s.id === S.ms; })[0]; }
  function mark(id){ return MU.marks.filter(function(m){ return m.id === id; })[0]; }
  function musParts(s, m){
    var ch = { comma:",", semicolon:";", colon:":", dash:"—", period:".", but:"," }[m], b = m === "period" ? cap(s.b) : s.b;
    if (m === "but") return { parts:[s.a + ",", "but " + b], gaps:[mark(m).ms] };
    return { parts:[s.a + ch, b], gaps:[mark(m).ms] };
  }
  function paintMus(){
    $("#cv-main").innerHTML = '<div id="mu-s"></div><p class="mu-line" id="mu-line" aria-live="polite"></p><div id="mu-m"></div><div class="q-actions"><button type="button" class="btn sm" id="mu-play">Listen</button></div><div id="mu-beat"></div><p class="tiny muted" id="mu-vn"></p>';
    radios($("#mu-s"), { label:"Sentence", cls:"chips", options:MU.sents.map(function(s, i){ return { id:s.id, t:"Sentence " + (i + 1) }; }), value:S.ms, onChange:function(v){ stopPlay(); S.ms = v; changed(); paintMus(); } });
    radios($("#mu-m"), { label:"The slot", cls:"chips", aria:"Choose a mark for the slot", options:MU.marks, value:S.mk[S.ms] || "", onChange:function(v){ stopPlay(); S.mk[S.ms] = v; changed(); paintMusLine(); } });
    paintMusLine();
    voiceReady(function(){ var b = $("#mu-play"); if (b) b.textContent = VOICE ? "Listen" : "Play the pauses"; var n = $("#mu-vn"); if (n) n.textContent = noVoice(); });
    if (!S.seenMus) { S.seenMus = true; api.save(); anim.pulse = 1; paintMusLine(); MV.wait(1600, function(){ anim.pulse = 0; }); }
  }
  function paintMusLine(){
    var s = ms(), m = S.mk[s.id], el = $("#mu-line"); if (!el) return;
    if (!m) { el.innerHTML = esc(s.a) + ' <span class="mu-slot empty">___</span> ' + esc(s.b); $("#mu-beat").innerHTML = ""; $("#mu-play").disabled = true; return; }
    var P = musParts(s, m), ch = P.parts[0].slice(-1), b2 = P.parts[1];
    el.innerHTML = esc(s.a) + '<span class="mu-slot' + (anim.pulse ? " pulse" : "") + '">' + esc(ch) + "</span>" + (m === "dash" ? "" : " ") + esc(b2);
    $("#mu-beat").innerHTML = beatHTML(P.parts, P.gaps) + '<p class="tiny muted">Pause at the slot: ' + P.gaps[0] + " ms (" + mark(m).t + ")</p>";
    $("#mu-play").disabled = false;
  }
  function playMus(breathless, done){
    var s = ms(), m = S.mk[s.id]; if (!m) { if (done) done(); return; }
    var P = musParts(s, m), btn = $("#mu-play");
    if (btn) btn.textContent = "Stop";
    play(P.parts, breathless ? [40] : P.gaps, { bar:$("#mu-beat"), rate:breathless ? 1.25 : 1,
      onGap:function(){ var sl = $(".mu-slot"); if (sl) { sl.classList.remove("pulse"); void sl.offsetWidth; sl.classList.add("pulse"); } },
      onEnd:function(){ var b = $("#mu-play"); if (b) b.textContent = VOICE ? "Listen" : "Play the pauses"; if (done) done(); } });
  }
  function musRows(){
    var s = ms(), m = S.mk[s.id];
    if (!m) return [["Music", "Choose a mark for the slot."]];
    var f = s.fx[m]; return [["Music", f[0] + " Conventional " + (f[1] ? "✓" : "✗")]];
  }
  host.addEventListener("click", function(e){ if (e.target.id === "mu-play") { if (PLAY) stopPlay(); else playMus(false); } });

  // ----- shared events (Integrate) -----
  host.addEventListener("change", function(e){ if (e.target.id === "cv-par") { RUN++; S.sub[S.src] = e.target.value; api.save(); paint(); } });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.id === "cv-leadt") { S.lead = t.value; changed(); $$("#cv-lead [data-rg]").forEach(function(b){ b.setAttribute("aria-checked", String(b.dataset.rg === leadVal())); }); }
    else if (t.id === "cv-ct") { qs().cite = t.value; changed(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = qs();
    if (b.id === "cv-prop") { x.cite = proposal(); $("#cv-ct").value = x.cite; anim = { cite:1 }; changed(); anim = {}; }
    else if (b.id === "cv-showcut") { S.showCut = !S.showCut; changed(); }
    else if (b.dataset.qw) {
      var i = +b.dataset.qw;
      if (S.tool === "cut") { if (i === x.a || i === x.b) { $("#cv-sug").textContent = "To trim the start or end, change your selection instead."; return; } if (x.cut[i]) delete x.cut[i]; else x.cut[i] = 1; changed(); }
      else { S.adjAt = S.adjAt === i ? null : i; api.save(); paintQS(); var inp = $("#cv-adjin"); if (inp) inp.focus(); }
    }
    else if (b.id === "cv-adjok") { var v = $("#cv-adjin").value.trim(); if (v && S.adjAt != null) { x.adj[S.adjAt] = v; delete x.cut[S.adjAt]; } S.adjAt = null; changed(); }
    else if (b.id === "cv-adjno") { if (S.adjAt != null) delete x.adj[S.adjAt]; S.adjAt = null; changed(); }
  });

  function read(){ $("#cv-read").innerHTML = MV.readoutHTML(S.mode === "int" ? intRows() : S.mode === "wc" ? wcRows() : musRows()); }

  // ----- presets (predictions, challenge set-ups, the first-visit storyboard) -----
  function spanOf(id, k, from, to){ var T = toks(id, k), a = -1, b = -1; T.forEach(function(t, i){ if (from(t, i, T) && a < 0) a = i; if (to(t, i, T)) b = i; }); return [a, b]; }
  function setQ(id, k, ab, extra){ var x = qs(id, k); x.a = ab[0]; x.b = ab[1]; x.cut = (extra && extra.cut) || {}; x.adj = {}; x.cite = (extra && extra.cite) || ""; }
  function ozBoast(){ S.mode = "int"; S.src = "oz"; setQ("oz", "all", spanOf("oz", "all", function(t){ return t.line === 9; }, function(t){ return t.line === 10; })); S.adjAt = null; }
  function baconTwist(lead, cite, per){
    S.mode = "int"; S.src = "bacon"; var r = baconR(), cut = {}; [r + 6, r + 7, r + 8].forEach(function(i){ cut[i] = 1; });
    setQ("bacon", "1", [r + 2, r + 12], { cut:cut, cite:cite }); S.lead = lead; S.per = per; S.fmt = "inline"; S.showCut = false; S.tool = "cut"; S.adjAt = null;
  }
  var PRE = {
    p1:function(){ ozBoast(); S.lb = "none"; S.fmt = "inline"; S.per = "after"; S.lead = ""; },
    p2:function(){ baconTwist("Bacon tells us to read", "", "before"); },
    p3:function(){ S.mode = "mus"; S.ms = "s1"; S.mk.s1 = ""; S.seenMus = true; },
    p4:function(){ S.mode = "int"; S.src = "brill"; S.sub.brill = "9"; setQ("brill", "9", spanOf("brill", "9", function(t){ return t.t === "exactly"; }, function(t, i, T){ return i > 0 && T[i - 3] && T[i - 3].t === "exactly"; }), { cite:"(Mansfield, par. 9)" });
      S.lead = "Miss Brill decides the scene is"; S.fmt = "inline"; S.per = "before"; S.adjAt = null; }
  };
  function go(fn){ RUN++; stopPlay(); anim = {}; fn(); modeRG.set(S.mode); api.save(); paint(); }
  function reveal(id, done){
    var me = ++RUN;
    function end(){ if (me === RUN) anim = {}; api.save(); done(); }
    if (id === "p3") { S.mk.s1 = "comma"; anim = { pulse:1 }; paint(); if (MV.reduceMotion) end(); else { playMus(true, end); MV.wait(7000, end); } return; }
    if (id === "p1") { S.lb = "slash"; anim = { slash:1 }; }
    else if (id === "p2") { S.showCut = true; anim = { cut:1 }; }
    else if (id === "p4") { S.per = "after"; anim = { hop:1 }; }
    paint(); MV.wait(1500, end);
  }
  function story(){
    if (S.seen) return; S.seen = true;
    go(function(){ ozBoast(); S.lb = "none"; S.fmt = "inline"; S.per = "before"; S.lead = ""; });
    var me = RUN;
    MV.wait(900, function(){ if (me !== RUN) return; S.lb = "slash"; anim = { slash:1 }; paint(); me = RUN;
      MV.wait(1500, function(){ if (me !== RUN) return; qs().cite = proposal(); anim = { cite:1 }; paint(); var ct = $("#cv-ct"); if (ct) ct.value = qs().cite; me = RUN;
        MV.wait(1200, function(){ if (me !== RUN) return; S.per = "after"; anim = { hop:1 }; paint(); api.save(); me = RUN; MV.wait(1600, function(){ if (me === RUN) anim = {}; }); }); }); });
  }
  document.addEventListener("click", function(e){
    var b = e.target.closest(".cv-setup"); if (!b) return;
    var id = b.dataset.setup;
    go(function(){
      if (id === "tc1") { S.mode = "int"; S.src = "oz"; setQ("oz", "all", [-1, -1]); }
      else if (id === "tc2") { S.mode = "wc"; S.card = "a"; }
      else baconTwist("Bacon tells readers to read", "(Bacon)", "after");
    });
    var g = $("#ex-app"); if (g && g.scrollIntoView) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  // ----- target challenges (exact tests from the plan; named wrong states first) -----
  function tc1(){
    var s = src(), c = compose(), n = nums();
    if (S.mode !== "int" || s.id !== "oz") return "Choose “Ozymandias” in Integrate mode.";
    if (!c) return "Select lines 10–11 in the poem.";
    if (n.a !== 10 || n.b !== 11) return "The quotation must span exactly lines 10–11.";
    if (S.fmt === "block") return "Two lines fit inline; block format is for more than three.";
    if (c.sl !== 1 || c.nb !== 1) return "Show where the line breaks. " + MV.C.explore.m7;
    if (wc(S.lead) < 2) return "Add a signal phrase: choose a chip or type at least two words.";
    var ck = citeCheck(); if (!ck.ok) return ck.t.replace(/^✗ /, "");
    if (S.per !== "after") return MV.C.explore.m1;
    if (c.bang && !/!”/.test(sentText())) return "The quotation’s own exclamation mark stays inside the quotation marks.";
    return true;
  }
  function tc2(){
    var c = card("a"), sc = wcScore(c, cst("a")), F = W.fb;
    if (S.mode !== "wc" || S.card !== "a") return "Open Works Cited and card (a), the story in the anthology.";
    if (sc.ok) return true;
    var o = wcOrd(c, cst("a")), err = {}; o.forEach(function(id){ var f = wcForm(c, cst("a"), id); if (!wcOk(c, id, f)) err[f.e] = 1; });
    var p = cst("a").p || {};
    if (err.name) return F.name; if (err.tital) return F.tital; if (err.edcap) return F.edcap; if (err.pg || err.bare) return F.pg;
    if (sc.dateFirst) return F.order; if (err.titlq) return F.titlq; if (err.plain) return F.plain;
    return F.general + " (" + sc.line + ")";
  }
  function tc3(){
    var s = src(), c = compose(), x = qs(), m = meaning(), r = baconR();
    if (S.mode !== "int" || s.id !== "bacon") return "Choose “Of Studies” in Integrate mode (Set it up loads the student’s version).";
    if (!c) return "Select the words you want to quote from Bacon’s sentence.";
    if (m === "bracket") return "Brackets may clarify; they may not reverse the meaning. " + MV.C.explore.m3;
    if (m === "cut") return "Still twisted. " + MV.C.explore.m3;
    var keptAll = true; for (var i = r + 19; i <= r + 23; i++) if (i < x.a || i > x.b || x.cut[i]) keptAll = false;
    if (x.b < r || x.a > r + 23 || !keptAll) return "Keep Bacon’s advice in the quotation: “but to weigh and consider”.";
    var n = 0; for (var j = r; j <= r + 23; j++) if (j >= x.a && j <= x.b && !x.cut[j]) n++;
    if (n >= 24) return "Shorten it: cut words with an ellipsis, or quote less.";
    if (S.fmt === "block") return "A short quotation stays inline.";
    if (wc(S.lead) < 2) return "Add a signal phrase: choose a chip or type at least two words.";
    var ck = citeCheck(); if (!ck.ok) return ck.t.replace(/^✗ /, ""); if (norm(x.cite) !== "(Bacon)") return "Cite the on-screen essay by author only: (Bacon).";
    if (S.per !== "after") return MV.C.explore.m1;
    return true;
  }
  paint();
  EX = {
    predict:{ start:function(p){ go(PRE[p.id]); }, run:function(p, done){ reveal(p.id, done); } },
    challenge:function(id){ var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : tc3(); return r === true ? { ok:true } : { ok:false, msg:r }; },
    story:story, stop:stopPlay, sentText:sentText
  };
  return EX;
}

// ---------- Part 3: Punctuation changes meaning — four stations with a literal-reading panel (text + a simple icon) ----------
// icons draw in currentColor (ink) with an image-role accent, so they follow the theme; the text always carries the meaning
function person(x, y, c){ return '<g class="' + (c || "") + '"><circle cx="' + x + '" cy="' + y + '" r="6"/><path d="M' + (x - 9) + " " + (y + 25) + "q9-19 18 0z\"/></g>"; }
function txt(x, y, t, c){ return '<text x="' + x + '" y="' + y + '" text-anchor="middle"' + (c ? ' class="' + c + '"' : "") + ">" + t + "</text>"; }
function arrow(x1, x2, y){ var d = x2 > x1 ? -6 : 6; return '<path class="ic-ln" d="M' + x1 + " " + y + "H" + x2 + "m" + d + " -5l" + (-d) + " 5l" + d + ' 5"/>'; }
var IC = {
  "class":function(on){ var s = ""; for (var i = 0; i < 6; i++) { var x = 15 + i * 26, rd = on || i % 2 === 0; s += person(x, 12, rd ? "" : "ic-dim") + (rd ? '<rect class="ic-a" x="' + (x - 6) + '" y="42" width="12" height="9" rx="1.5"/>' : ""); } return s + txt(80, 62, on ? "all of them read it" : "only the readers", "ic-s"); },
  ray:function(on){ return on ? '<rect x="18" y="8" width="22" height="40" rx="4" fill="none" class="ic-ln"/><circle cx="29" cy="42" r="2"/>' + arrow(48, 100, 28) + person(120, 14) + txt(120, 60, "Ray") + txt(74, 20, "call me!", "ic-s")
    : '<rect x="35" y="6" width="90" height="48" rx="6" fill="none" class="ic-ln"/><rect class="ic-a" x="35" y="6" width="90" height="14" rx="6"/>' + txt(80, 17, "MY NAME IS", "ic-s ic-inv") + txt(80, 44, "Ray", "ic-b"); },
  court:function(on){ var a = on ? arrow(118, 44, 22) : arrow(42, 116, 22); return person(28, 10) + person(132, 10) + txt(28, 60, "judge", "ic-s") + txt(132, 60, "witness", "ic-s") + a + txt(80, 40, "“lying!”", "ic-s"); },
  gym:function(good){ return '<rect x="122" y="6" width="32" height="46" rx="2" fill="none" class="ic-ln"/>' + txt(138, 62, "gym", "ic-s") + (good ? person(60, 12) + '<path class="ic-a" d="M92 26c-6-10 8-14 10-6 6-6 14 2 8 8 6 4-2 12-8 8-4 6-14 2-10-4z"/>' + txt(60, 62, "I walk in", "ic-s") + txt(100, 50, "smell", "ic-s")
    : '<path class="ic-a" d="M40 24c-8-14 10-20 14-8 8-8 20 2 12 10 8 6-2 16-10 10-6 8-20 2-16-6z"/><path class="ic-ln" d="M46 38l-6 14M60 38l6 14"/>' + arrow(78, 112, 30) + txt(56, 62, "a walking smell?", "ic-s")); },
  tests:function(good){ var s = ""; for (var i = 0; i < 5; i++) { var x = 8 + i * 30, pass = !good || i === 2; s += '<rect x="' + x + '" y="6" width="24" height="32" rx="2" fill="none" class="ic-ln"/>' + txt(x + 12, 29, pass ? "✓" : "✗", "ic-b"); } return s + txt(80, 56, good ? "failed most of them" : "nearly failed, but passed them all", "ic-s"); }
};
function icon(name, on, label){ return '<svg class="lit-svg" viewBox="0 0 160 66" role="img" aria-label="' + esc(label) + '">' + IC[name](on) + "</svg>"; }
function litHTML(name, on, text){ return '<div class="lit">' + icon(name, on, text) + '<p class="lit-t"><span class="lit-h">Literal reading</span>' + text + "</p></div>"; }

var P3 = null;
function part3(host, api){
  var C = api.content, S = api.S, ST = C.stations;
  S.st = ST.some(function(x){ return x.id === S.st; }) ? S.st : "st1";
  S.g = S.g || {}; S.s2 = S.s2 || ""; S.m = S.m || {}; S.d4 = S.d4 || "dash";
  host.innerHTML = '<div class="pm"><div id="pm-tabs"></div><div class="pm-st" id="pm-st"></div></div>';
  radios($("#pm-tabs"), { cls:"chips", aria:"Stations", options:ST.map(function(x, i){ return { id:x.id, t:(i + 1) + ". " + x.label }; }), value:S.st, onChange:function(v){ stopPlay(); S.st = v; api.save(); paint(); } });
  function st(){ return ST.filter(function(x){ return x.id === S.st; })[0]; }
  function paint(){
    var s = st(), el = $("#pm-st"), h = '<p class="muted">' + s.intro + "</p>";
    if (s.id === "st1") h += s.sents.map(function(r){ return '<div class="pm-r" data-r="' + r.id + '"></div>'; }).join("");
    if (s.id === "st2") h += '<p class="pm-s" id="pm-s2"></p><div id="pm-o2"></div><div id="pm-r2"></div><div class="pm-tw"><h4>' + s.twist.q + '</h4><p class="steal-line">' + s.twist.text + '</p><p class="eng-cite">' + s.twist.cite + '</p><div class="q-actions"><button type="button" class="btn sm" data-tw="err">Error</button><button type="button" class="btn sm" data-tw="art">Art</button></div><div id="pm-twa"></div></div>';
    if (s.id === "st3") h += s.pairs.map(function(p){ return '<div class="pm-r" data-m="' + p.id + '"></div>'; }).join("") + '<div class="pm-mc">' + s.masters + "</div>";
    if (s.id === "st4") h += '<div id="pm-t4"></div><div class="pm-poem" id="pm-p4"></div><p class="eng-cite">' + s.cite + '</p><div class="q-actions"><button type="button" class="btn sm" id="pm-l4">Listen</button></div><div id="pm-b4"></div><p class="tiny muted">' + s.note + '</p><p class="tiny muted" id="pm-v4"></p>';
    el.innerHTML = h;
    if (s.id === "st1") s.sents.forEach(paintR);
    if (s.id === "st2") { radios($("#pm-o2"), { label:"Join with", cls:"chips", options:s.opts, value:S.s2, onChange:function(v){ stopPlay(); S.s2 = v; api.save(); paint2(); } }); paint2(); if (S.tw) tw(S.tw); }
    if (s.id === "st3") s.pairs.forEach(paintM);
    if (s.id === "st4") { radios($("#pm-t4"), { label:"Marks", options:[{ id:"dash", t:"Dashes (her manuscript)" }, { id:"comma", t:"Commas" }], value:S.d4, onChange:function(v){ stopPlay(); S.d4 = v; api.save(); paint4(); } }); paint4(); }
    voiceReady(function(){ ["#pm-v4", "#pm-v2"].forEach(function(q){ var n = $(q); if (n) n.textContent = noVoice(); }); $$(".pm-play").concat([$("#pm-l4")]).forEach(function(b){ if (b) b.textContent = VOICE ? "Listen" : "Play the pauses"; }); });
  }
  function paintR(r){
    var box = $('[data-r="' + r.id + '"]'), on = S.g[r.id] || r.gaps.map(function(){ return false; }), n = on.filter(Boolean).length, s1 = st();
    var h = '<p class="pm-s">' + r.w.map(function(w, i){ var gi = r.gaps.indexOf(i); return esc(w) + (gi >= 0 ? '<button type="button" class="pm-g' + (on[gi] ? " on" : "") + '" data-g="' + r.id + "|" + gi + '" data-k="g' + r.id + gi + '" aria-pressed="' + on[gi] + '" aria-label="Comma after “' + esc(w) + '”">' + (on[gi] ? "," : "") + "</button>" : ""); }).join(" ").replace(/ <button/g, "<button") + "</p>";
    var all = n === r.gaps.length, none = n === 0;
    h += none ? litHTML(r.icon, false, r.without) : all ? litHTML(r.icon, true, r.with) : '<div class="lit"><p class="lit-t"><span class="lit-h">Literal reading</span>' + s1.half + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  function paint2(){
    var s = st(), o = s.opts.filter(function(x){ return x.id === S.s2; })[0];
    $("#pm-s2").innerHTML = o ? esc(o.s) : esc(s.a) + ' <span class="mu-slot empty">___</span> ' + esc(s.b);
    if (!o) { $("#pm-r2").innerHTML = ""; return; }
    var k = o.s.indexOf("news") + 4, parts = [o.s.slice(0, k + 1), o.s.slice(k + 1).trim()];
    $("#pm-r2").innerHTML = '<div class="lit"><p class="lit-t"><span class="lit-h">' + (o.bad ? "✗ " : "✓ ") + cap(o.fx) + "</span>" + o.note + '</p></div><div class="q-actions"><button type="button" class="btn sm pm-play" id="pm-l2">Listen</button></div><div id="pm-b2">' + beatHTML(parts, [o.ms]) + '</div><p class="tiny muted" id="pm-v2">' + noVoice() + "</p>";
    $("#pm-l2").textContent = VOICE ? "Listen" : "Play the pauses";
    $("#pm-l2")._parts = [parts, [o.ms]];
  }
  function tw(k){ S.tw = k; api.save(); var s = st(); $("#pm-twa").innerHTML = MV.fbHTML("", "<strong>" + (k === "art" ? "Art, by design." : "By today’s rules, yes; but look again.") + "</strong> " + s.twist.expl); $$("[data-tw]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.tw === k)); }); }
  function paintM(p){
    var box = $('[data-m="' + p.id + '"]'), good = !!S.m[p.id];
    MV.keepFocus(box, function(){ box.innerHTML = '<div id="pm-mt' + p.id + '"></div><p class="pm-s">' + esc(good ? p.good : p.bad) + "</p>" + litHTML(p.icon, good, good ? p.goodRead : p.badRead); });
    radios($("#pm-mt" + p.id), { options:[{ id:"0", t:p.badT }, { id:"1", t:p.goodT }], value:good ? "1" : "0", aria:"Version", onChange:function(v){ S.m[p.id] = v === "1"; api.save(); paintM(p); } });
  }
  function paint4(){
    var s = st(), L = s[S.d4];
    $("#pm-p4").innerHTML = '<ol class="eng-poem">' + L.map(function(l, i){ return '<li><span class="eng-ln" aria-hidden="true">' + (i + 1) + "</span><span>" + esc(l).replace(/ ([–,])$/, ' <b class="mu-slot">$1</b>').replace(/,$/, '<b class="mu-slot">,</b>') + "</span></li>"; }).join("") + "</ol>";
    var g = L.slice(0, -1).map(function(){ return S.d4 === "dash" ? 450 : 300; });
    $("#pm-b4").innerHTML = beatHTML(L, g) + '<p class="tiny muted">Pause after each line: ' + g[0] + " ms (" + (S.d4 === "dash" ? "dash 250 ms with an abrupt cut, plus the line’s end" : "comma 150 ms, plus the line’s end") + ")</p>";
    $("#pm-l4")._parts = [L, g];
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.g) { var k = b.dataset.g.split("|"), r = st().sents.filter(function(x){ return x.id === k[0]; })[0], on = S.g[r.id] || (S.g[r.id] = r.gaps.map(function(){ return false; })); on[+k[1]] = !on[+k[1]]; api.save(); paintR(r); return; }
    if (b.dataset.tw) { tw(b.dataset.tw); return; }
    if (b._parts) {
      if (PLAY) { stopPlay(); return; }
      var bar = b.id === "pm-l4" ? $("#pm-b4") : $("#pm-b2"), lab = b.textContent; b.textContent = "Stop";
      play(b._parts[0], b._parts[1], { bar:bar, onGap:function(i){ var sl = $$("#pm-p4 .mu-slot")[i]; if (sl) { sl.classList.remove("pulse"); void sl.offsetWidth; sl.classList.add("pulse"); } }, onEnd:function(){ b.textContent = lab; } });
    }
  });
  paint();
  stealExtras(C);
  P3 = { stop:stopPlay };
  return P3;
}
// Sentence to steal: the reason box, the structural checks and "Save to my commonplace book"
function stealExtras(C){
  var blk = $('.mv-block[data-block="steal"]'); if (!blk || $("#steal-why")) return;
  var w = MV.S.writes, d = document.createElement("div");
  d.innerHTML = '<div class="jq"><label for="steal-why">' + C.reasonLabel + '</label><textarea id="steal-why"></textarea></div><ul class="checks" id="steal-ck"></ul><div class="q-actions"><button type="button" class="btn ghost sm" id="steal-save">Save to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span></div>';
  blk.appendChild(d);
  $("#steal-why").value = w["steal-why"] || "";
  function ck(){
    var im = (w.steal || ""), n = (im.match(/(?:^|[,;—–]\s*)["“]?it was the\b/gi) || []).length, r = [n >= 4, wc(w["steal-why"] || "") >= 12];
    $("#steal-ck").innerHTML = C.stealChecks.map(function(l, i){ return '<li class="' + (r[i] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[i] ? "✓" : "○") + "</span><span>" + l + '<span class="vh">' + (r[i] ? " (met)" : " (not met)") + "</span></span></li>"; }).join("");
    return r[0] && r[1];
  }
  blk.addEventListener("input", function(e){ if (e.target.id === "steal-why") { w["steal-why"] = e.target.value; MV.save(); } ck(); });
  $("#steal-save").addEventListener("click", function(){
    var ok = ck(), im = (w.steal || "").trim();
    $("#steal-st").textContent = !ok ? "Finish both checks first." : MV.eng.saveLine("Mine: " + im + " (after Dickens: “It was the best of times, it was the worst of times…”)", (w["steal-why"] || "").trim(), "07. Conventions and citation: Sentence to steal") ? "Saved to your commonplace book." : "";
  });
  ck();
}

// ---------- Practice 2: the editor's proofread (★; 8 errors to fix, 3 spots to leave alone; first-try per decision) ----------
function proof(host, api, a){
  var S = api.S; S.d = S.d || {};
  var SP = a.para.filter(function(x){ return typeof x === "object"; });
  function st(id){ return S.d[id] || (S.d[id] = { tries:0, hint:0, done:false, first:null }); }
  function sp(id){ return SP.filter(function(x){ return x.id === id; })[0]; }
  function choices(x){ return [{ k:"leave", t:"Leave it" }].concat(MV.shuffle(x.menu.map(function(f, i){ return { k:"f" + i, t:"Change to: " + f.t, f:f }; }), x.id)); }
  function right(x, k){ var ans = MV.ans(x); return k === "leave" ? ans === "leave" : ans !== "leave" && ans.indexOf(+k.slice(1)) >= 0; }
  function h3(x){ var ans = MV.ans(x); return ans === "leave" ? "Leave it. " + x.fixFb.replace(/ Leave it\.$/, "") : "Fix it: “" + x.menu[ans[0]].t + "”. " + x.leaveFb; }
  function shown(x){ var s = st(x.id); return s.done && s.pick !== "leave" ? x.menu[+s.pick.slice(1)].t : x.t; }
  function count(){ var f = 0, l = 0, n = 0; SP.forEach(function(x){ var s = st(x.id); if (s.done) { n++; if (s.pick === "leave") l++; else f++; } }); return { f:f, l:l, n:n }; }
  function paint(){
    var cur = S.cur ? sp(S.cur) : null, c = count();
    var h = '<p class="how">' + a.how + '</p><p class="pf-para">' + a.para.map(function(x){
      if (typeof x === "string") return x;
      var s = st(x.id);
      return '<button type="button" class="pf-s' + (x.t.length < 4 ? " pf-x" : "") + (s.done ? " done" : "") + (S.cur === x.id ? " cur" : "") + '" data-sp="' + x.id + '" data-k="pf' + x.id + '" aria-pressed="' + (S.cur === x.id) + '">' + shown(x) + (s.done ? '<span class="vh"> (' + (s.pick === "leave" ? "left alone" : "fixed") + ")</span>" : "") + "</button>";
    }).join("") + "</p>";
    h += '<p class="tiny" aria-live="polite">Decisions made: ' + c.n + " of " + SP.length + " · fixed " + c.f + " · left alone " + c.l + "</p>";
    if (c.n === SP.length) h += MV.fbHTML("good", "<strong>✓ " + a.done + "</strong>");
    if (cur) {
      var s = st(cur.id);
      h += '<div class="pf-dec"><p><strong>Spot:</strong> “' + cur.t + "”</p>";
      if (!s.done) h += '<div class="chips" role="group" aria-label="Your decision">' + choices(cur).map(function(o){ return '<button type="button" class="chip' + (s.last === o.k ? " on" : "") + '" data-ch="' + o.k + '" data-k="ch' + cur.id + o.k + '">' + o.t + "</button>"; }).join("") + "</div>" +
        '<div class="q-actions">' + MV.hintBtn("h" + cur.id, s.hint) + "</div>" + MV.hintsHTML([a.h1, cur.h2, h3(cur)], s.hint);
      if (s.last) {
        var ok = right(cur, s.last), f = s.last === "leave" ? null : cur.menu[+s.last.slice(1)];
        h += MV.fbHTML(ok ? "good" : "bad", ok ? (s.last === "leave" ? "<strong>✓ Wisely left alone.</strong> " + cur.fixFb.replace(/ Leave it\.$/, "") : "<strong>✓ Fixed.</strong> " + cur.h2)
          : "<strong>✗ Not quite.</strong> " + (s.last === "leave" ? cur.leaveFb : (MV.ans(cur) === "leave" ? cur.fixFb : f.why)) + " Try again.");
      }
      h += "</div>";
    } else if (c.n < SP.length) h += '<p class="tiny muted">Tap an underlined spot in the paragraph to decide about it.</p>';
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.sp) { S.cur = b.dataset.sp; api.save(); paint(); var d = $(".pf-dec", host); if (d) { var c0 = d.querySelector("button"); if (c0) c0.focus({ preventScroll:true }); } return; }
    var x = S.cur ? sp(S.cur) : null; if (!x) return; var s = st(x.id);
    if (b.dataset.act === "hint") { s.hint = Math.min(3, s.hint + 1); }
    else if (b.dataset.ch) { if (s.done) return; s.last = b.dataset.ch; if (right(x, s.last)) { s.done = true; s.pick = s.last; s.first = s.tries === 0 && s.hint < 3; } else s.tries++; }
    else return;
    api.save(); paint(); if (b.dataset.ch) MV.focusFb($(".pf-dec", host));
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; SP.forEach(function(x){ var s = st(x.id); if (s.done) d++; if (s.first) f++; }); return { first:f, total:SP.length, done:d, line:a.summary + " (first try): " + f + "/" + SP.length + (d < SP.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; SP.forEach(function(x){ var s = st(x.id); if (s.tries > 0 || s.hint >= 3) g = g.concat(MV.goalIdx(x.goal)); }); return g; }
  };
}

// ---------- Practice 3: Spot the Error (toolkit K13) with prose labels: "Sentence n", "Hollis’s paragraph" ----------
function spotProse(host, api, a){
  var r = MV.activityTypes.spot(host, a);
  function fix(){ $$(".sn, .who, .task, .fb strong", host).forEach(function(n){ var t = n.textContent, u = t.replace(/^Step (\d)/, "Sentence $1").replace(/’s solution$/, "’s paragraph").replace(/^Problem (\d)/, "Paragraph $1").replace(/: step (\d)/, ": sentence $1"); if (u !== t) n.textContent = u; }); }
  new MutationObserver(fix).observe(host, { childList:true }); fix();
  return r;
}

// ---------- "Errors I make" (AS): every missed Practice item adds its error type; ranked by count, with a strategy for each ----------
function errors(){
  var A = MV.S.act || {}, cnt = {}, acts = {};
  MV.C.practice.activities.forEach(function(a){ acts[a.id] = a; });
  function add(t){ cnt[t] = (cnt[t] || 0) + 1; }
  var fx = (A.fix || {}).items || {}; acts.fix.items.forEach(function(it){ var x = fx[it.id]; if (x && (x.tries > 0 || x.hint >= 3)) add(it.err); });
  var pd = (A.proof || {}).d || {}; acts.proof.para.forEach(function(x){ var s = typeof x === "object" && pd[x.id]; if (s && (s.tries > 0 || s.hint >= 3)) add(x.err); });
  var sp = MV.S.spot || {}; acts.spot.problems.forEach(function(p){ var s = sp[p.id]; if (s && (s.stepTries > 0 || s.fixTries > 1 || s.hint >= 3)) add(p.err); });
  return Object.keys(cnt).map(function(t){ return { t:t, n:cnt[t] }; }).sort(function(a, b){ return b.n - a.n; });
}
function paintErrors(){
  var el = $("#cv-errs"); if (!el) return;
  var R = MV.C.reflect, L = errors();
  el.innerHTML = L.length ? '<ol class="cv-errs">' + L.map(function(e){ var fam = R.errMap[e.t] || "Missing words"; return "<li><strong>" + e.t + "</strong> × " + e.n + '<br><span class="tiny"><span class="muted">Strategy (' + fam.toLowerCase() + "):</span> " + R.errFamilies[fam] + "</span></li>"; }).join("") + "</ol>"
    : '<p class="tiny muted">Nothing yet. Missed Practice items will appear here.</p>';
}

// ---------- Performance task "The editor's desk": paragraph box, purposeful mark, E8 Works Cited builder, three proofreading passes ----------
// Exact structural tests (plan §5): quotations = double-quoted spans with ≥ 3 words; sentences split outside quotations and
// parentheses (abbreviations and spaced ellipses don't end a sentence); citation patterns by text and context.
function qSpans(t){ var out = [], re = /“([^”]*)”|"([^"]*)"/g, m; while ((m = re.exec(t))) out.push({ s:m.index, e:m.index + m[0].length - 1, inner:m[1] != null ? m[1] : m[2] }); return out; }
function sentences(t){
  var out = [], st = 0, inQ = false, par = 0;
  function endAt(i){
    var j = i + 1; while (j < t.length && /[”"’)]/.test(t[j])) j++;
    if (j < t.length && !/\s/.test(t[j])) return -1;
    var k = j; while (k < t.length && /\s/.test(t[k])) k++;
    if (k < t.length && !/[A-Z“"‘]/.test(t[k])) return -1;
    return j;
  }
  for (var i = 0; i < t.length; i++) {
    var c = t[i], closing = false;
    if (c === "“") inQ = true; else if (c === "”") { inQ = false; closing = true; } else if (c === '"') { closing = inQ; inQ = !inQ; }
    else if (c === "(") par++; else if (c === ")") par = Math.max(0, par - 1);
    var cand = closing ? /[.!?]/.test(t[i - 1] || "") : (!inQ && !par && /[.!?]/.test(c));
    if (!cand) continue;
    if (!closing && c === ".") { var pre = t.slice(st, i); if (/(?:^|[\s(])(?:Mrs|Mr|Ms|Dr|St|pars?|pp?|vol|no)$/i.test(pre) || t[i + 1] === " " && t[i + 2] === "." || t[i - 1] === " " && t[i - 2] === ".") continue; }
    var j = endAt(closing ? i : i); if (j < 0) continue;
    if (closing && /^\s*\(/.test(t.slice(i + 1))) continue;
    out.push(t.slice(st, j)); while (j < t.length && /\s/.test(t[j])) j++; st = j; i = j - 1;
  }
  if (t.slice(st).trim()) out.push(t.slice(st));
  return out;
}
function outsideQ(t){ return t.replace(/“[^”]*”|"[^"]*"/g, " "); }
function citeOK(c, tid, ctx, first, au){
  c = norm(c).replace(/(\d)-(\d)/g, "$1–$2"); var r = "\\d+(?:–\\d+)?";
  if (tid === "oz") return new RegExp("^\\((?:Shelley, )?lines? " + r + "\\)$").test(c) || (!first && new RegExp("^\\(" + r + "\\)$").test(c));
  if (ctx === "screen") return tid === "bacon" ? c === "(Bacon)" : new RegExp("^\\((?:" + au + ", )?pars?\\. " + r + "\\)$").test(c);
  return new RegExp("^\\((?:" + au + " )?" + r + "\\)$").test(c);
}
function analyse(text, tid, ctx){
  var T = MV.C.task, tx = T.texts.filter(function(x){ return x.id === tid; })[0], au = tx ? tx.author : "", t = String(text || "").replace(/\r/g, "");
  var r = { words:wc(t), c2:false, c3:false, c4:false, c5:tid !== "oz", hy:/\(\D*\d+-\d+\)/.test(t) };
  var Q = qSpans(t).filter(function(q){ return wc(q.inner) >= 3; });
  if (!Q.length || !tid) return r;
  var ok2 = true, first = true;
  sentences(t).forEach(function(s){
    var q = qSpans(s).filter(function(x){ return wc(x.inner) >= 3; }); if (!q.length) return;
    var m = s.slice(q[q.length - 1].e + 1).match(/\([^()]*\)/);
    if (!m) { if (!(tid === "bacon" && ctx === "screen" && /\bBacon\b/.test(outsideQ(s)))) ok2 = false; return; }
    if (!citeOK(m[0], tid, ctx, first, au)) ok2 = false; first = false;
  });
  r.c2 = ok2;
  var bad3 = false, re = /([.,])\s*[”"]\s*\(/g, m3;
  while ((m3 = re.exec(t))) if (!(m3[1] === "." && /\. \.\s*$/.test(t.slice(Math.max(0, m3.index - 4), m3.index)))) bad3 = true;
  var re2 = /[”"]\s*\([^()]*\)/g; while ((m3 = re2.exec(t))) { var after = t.slice(m3.index + m3[0].length); if (/^\s*$/.test(after) || /^\s+[A-Z“"]/.test(after)) bad3 = true; }
  r.c3 = !bad3;
  r.c4 = Q.some(function(q){ return /\. \. \./.test(q.inner) || /\[[^\]]+\]/.test(q.inner); });
  if (tid === "oz") {
    var pairs = 0, ok5 = true;
    Q.forEach(function(q){ var m = t.slice(q.e + 1).match(/^\s*\((?:Shelley, )?(?:lines? )?(\d+)(?:[–-](\d+))?\)/); if (!m) return; pairs++; var span = (m[2] ? +m[2] : +m[1]) - +m[1]; if ((q.inner.match(/ \/ /g) || []).length !== span) ok5 = false; });
    r.c5 = pairs > 0 && ok5;
  }
  return r;
}
function marksIn(t){
  var out = [], s = String(t || ""), inQ = false, par = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    if (c === "“") inQ = true; else if (c === "”") inQ = false; else if (c === '"') inQ = !inQ; else if (c === "(") par++; else if (c === ")") par = Math.max(0, par - 1);
    if (inQ || par || !/[;:—–]/.test(c)) continue;
    if (c === "–" && /\d/.test(s[i - 1] || "") && /\d/.test(s[i + 1] || "")) continue;
    out.push({ ch:c, at:i, ctx:s.slice(Math.max(0, i - 22), i + 1).replace(/^\S*\s/, "…") + s.slice(i + 1, i + 20).replace(/\s\S*$/, "") + "…" });
  }
  return out;
}
var task = (function(){
  var api = null, T = null, ui = null;
  function card(S){ return cards().filter(function(c){ return c.id === S.text + "-" + S.ctx; })[0]; }
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){ S = S || {}; return { text:S.text || "", ctx:S.ctx || "", para:S.para || "", mark:S.mark, note:S.note || "", passes:S.passes || {}, wc:S.wc || {}, explain:explain() }; }
  function checks(d){
    T = T || MV.C.task;
    var A = analyse(d.para, d.text, d.ctx), M = marksIn(d.para), mk = d.mark != null && M[d.mark.k] && M[d.mark.k].ch === d.mark.ch, c = d.text && d.ctx ? card(d) : null;
    return [A.words >= 100 && A.words <= 180, A.c2, A.c3, A.c4, A.c5, !!mk && wc(d.note) >= 5, !!c && wcScore(c, d.wc[c.id] || {}).ok,
      T.passes.every(function(_, i){ return !!d.passes[i]; }), wc(d.explain) >= 40];
  }
  function all(){ api.save(); paintBits(); api.update(); models(); MV.paintSummary(); }
  function paintBits(){
    var S = api.S, d = data(S), A = analyse(d.para, d.text, d.ctx);
    $("#ed-count").textContent = A.words + " words (100–180)";
    $("#ed-note").textContent = A.hy ? T.hyphen : "";
    var M = marksIn(d.para);
    if (S.mark && !(M[S.mark.k] && M[S.mark.k].ch === S.mark.ch)) S.mark = null;
    MV.keepFocus($("#ed-marks"), function(){
      $("#ed-marks").innerHTML = M.length ? '<div class="chips" role="group" aria-label="Semicolons, colons and dashes in your paragraph (outside quotations)">' + M.map(function(m, k){ var on = S.mark && S.mark.k === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + !!on + '" data-mk="' + k + '" data-k="mk' + k + '"><b>' + esc(m.ch) + "</b> " + esc(m.ctx) + "</button>"; }).join("") + "</div>"
        : '<p class="tiny muted">No semicolon, colon or dash outside quotation marks yet.</p>';
    });
    var c = d.text && d.ctx ? card(d) : null;
    $("#ed-pv").innerHTML = '<h4 style="margin-top:0">Your paragraph</h4>' + (d.para.trim() ? "<p class=\"ed-p\">" + esc(d.para) + "</p>" : '<p class="tiny muted">Your paragraph appears here.</p>') +
      '<h4>Works Cited</h4>' + (c ? '<p class="wc-e hang">' + wcEntry(c, d.wc[c.id] || {}, true) + "</p>" : '<p class="tiny muted">Choose a text and a context.</p>');
  }
  function paintSrc(){
    var S = api.S, el = $("#ed-src"), c = S.text && S.ctx ? card(S) : null;
    if (!S.text) { el.innerHTML = '<p class="tiny muted">Choose a text to see it here.</p>'; $("#ed-card").innerHTML = ""; $("#ed-wc").innerHTML = ""; return; }
    var src = MV.C.explore.sources.filter(function(x){ return x.id === S.text; })[0], tx = T.texts.filter(function(x){ return x.id === S.text; })[0];
    var box = document.createElement("div");
    if (src.one) box.innerHTML = '<div class="eng-passage eng-prose"><p>' + src.pars[0] + '</p></div><p class="eng-cite">' + src.cite + "</p>";
    else MV.eng.passage(box, src.lines || src.pars, { kind:src.lines ? "poem" : "prose", start:src.start, cite:src.cite });
    el.innerHTML = (S.ctx === "anth" ? '<p class="tiny"><strong>Printed course anthology:</strong> ' + MV.plain(tx.t) + " is on " + (/–/.test(tx.pages) ? "pages " : "page ") + tx.pages + ". " + (S.text === "oz" ? "Poetry is still cited by line." : "Cite a page in that range: (" + tx.author + " " + tx.pages.split("–")[0] + ").") + "</p>" : "") + box.innerHTML;
    if (!c) { $("#ed-card").innerHTML = '<p class="tiny muted">Choose a citation context to see the source card.</p>'; $("#ed-wc").innerHTML = ""; return; }
    $("#ed-card").innerHTML = factsHTML(c);
    S.wc = S.wc || {}; var st = S.wc[c.id] || (S.wc[c.id] = {});
    var h = $("#ed-wc"), fresh = document.createElement("div"); h.innerHTML = ""; h.appendChild(fresh);
    ui = wcUI(fresh, c, st, all);
  }
  function models(){
    var el = $("#ed-models"); if (!el) return;
    var ok = checks(data(api.S)).every(Boolean);
    el.innerHTML = ok ? T.models.map(function(m){ var c = cards().filter(function(x){ return x.id === m.wc; })[0];
      return '<details class="alg"><summary>' + m.title + '</summary><p>' + m.para + '</p><p class="tiny"><strong>Purposeful mark:</strong> ' + m.mark + '</p><p class="tiny"><strong>Works Cited:</strong></p><p class="wc-e hang">' + wcKey(c, true) + '</p><p class="tiny"><strong>Craft statement:</strong> ' + m.craft + "</p></details>"; }).join("") : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; S.passes = S.passes || {};
      inp.innerHTML = '<div id="ed-text"></div><div id="ed-ctx"></div><details class="alg ed-srcbox"><summary>The text, as numbered on screen</summary><div id="ed-src"></div></details>' +
        '<div class="jq"><label for="ed-para">Your paragraph</label><textarea id="ed-para" class="ed-para"></textarea><p class="tiny muted" id="ed-count" aria-live="polite"></p><p class="tiny" id="ed-note"></p></div>' +
        '<div class="jq"><span class="ed-h" id="ed-mh">Purposeful mark: choose one semicolon, colon or dash you used on purpose</span><div id="ed-marks"></div><label for="ed-mnote" class="tiny">Why you chose it</label><textarea id="ed-mnote" style="min-height:60px"></textarea></div>' +
        '<div class="jq"><span class="ed-h">Works Cited (MLA 9)</span><div id="ed-card"></div><div id="ed-wc"></div></div>' +
        '<fieldset class="ed-pass"><legend>Proofreading passes</legend>' + T.passes.map(function(p, i){ return '<label class="ed-pl"><input type="checkbox" data-pass="' + i + '"> ' + p + ' <span class="tiny muted" data-pt="' + i + '"></span></label>'; }).join("") + "</fieldset>";
      pv.innerHTML = '<div id="ed-pv"></div><div id="ed-models"></div>';
      radios($("#ed-text"), { label:"Text", cls:"chips", options:T.texts, value:S.text || "", onChange:function(v){ S.text = v; paintSrc(); all(); } });
      radios($("#ed-ctx"), { label:"Citation context", cls:"chips", options:T.contexts, value:S.ctx || "", onChange:function(v){ S.ctx = v; paintSrc(); all(); } });
      $("#ed-para").value = S.para || ""; $("#ed-mnote").value = S.note || "";
      $$("[data-pass]", inp).forEach(function(c){ var i = +c.dataset.pass; c.checked = !!S.passes[i]; $('[data-pt="' + i + '"]', inp).textContent = S.passes[i] ? "done " + new Date(S.passes[i]).toLocaleTimeString("en-CA", { hour:"2-digit", minute:"2-digit" }) : ""; });
      inp.addEventListener("input", function(e){ var t = e.target; if (t.id === "ed-para") { S.para = t.value; all(); } else if (t.id === "ed-mnote") { S.note = t.value; all(); } });
      inp.addEventListener("change", function(e){ var t = e.target; if (t.dataset.pass == null) return; var i = +t.dataset.pass; S.passes[i] = t.checked ? new Date().toISOString() : null; $('[data-pt="' + i + '"]', inp).textContent = t.checked ? "done " + new Date().toLocaleTimeString("en-CA", { hour:"2-digit", minute:"2-digit" }) : ""; all(); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-mk]"); if (!b) return; var M = marksIn(S.para), k = +b.dataset.mk; S.mark = S.mark && S.mark.k === k ? null : { k:k, ch:M[k].ch }; all(); });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); models(); });
      paintSrc(); paintBits(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text && d.ctx ? true : "Choose a text and a citation context first."; },
    checks:checks,
    tips:function(d, res){ return T.tips.filter(function(_, i){ return !res[i]; }); },
    key:function(d){ return d.text + "-" + d.ctx; },
    label:function(k){ var p = k.split("-"); T = T || MV.C.task; return T.texts.filter(function(x){ return x.id === p[0]; })[0].t + " (" + (p[1] === "anth" ? "anthology" : "on screen") + ")"; },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), n = checks(d).filter(Boolean).length, L = [], c = d.text && d.ctx ? card(d) : null, M = marksIn(d.para);
      L.push(T.summary + ": " + (n === 9 ? "complete" : "in progress") + " (checklist " + n + "/9)");
      if (d.text) L.push("  Text: " + MV.plain(T.texts.filter(function(x){ return x.id === d.text; })[0].t) + (d.ctx ? "; citation context: " + MV.plain(T.contexts.filter(function(x){ return x.id === d.ctx; })[0].t) : ""));
      L.push("  Paragraph: " + (d.para.trim() ? d.para.trim().replace(/\s+/g, " ") : "(not written yet)"));
      L.push("  Purposeful mark: " + (d.mark && M[d.mark.k] ? "“" + d.mark.ch + "” (" + M[d.mark.k].ctx + ")" : "(none chosen)") + (d.note.trim() ? ": " + d.note.trim() : ""));
      L.push("  Works Cited: " + (c ? wcEntry(c, d.wc[c.id] || {}, false) : "(not built yet)"));
      return L;
    }
  };
})();

// ---------- Reflect extras: sample principles, principle word count, trivium tag, commonplace book, Errors I make ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) { var d = document.createElement("div"); d.id = "art-samples"; d.innerHTML = R.artSamples; sheet.insertBefore(d, art); }
  var p = $("#art-p");
  if (p && !$("#art-pw")) { var n = document.createElement("p"); n.className = "tiny muted"; n.id = "art-pw"; n.setAttribute("aria-live", "polite"); p.parentNode.appendChild(n);
    var f = function(){ var k = wc(p.value); n.textContent = "Principle: " + k + " word" + (k === 1 ? "" : "s") + (k >= 6 ? " ✓" : " (write at least 6)"); }; p.addEventListener("input", f); f(); }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp) { MV.eng.commonplace(cp, { lines:R.commonplaceLines }); var lab = $('label[for="cp-note"]', cp); if (lab && R.cpNote) lab.textContent = R.cpNote; }
  paintErrors();
}

var HERO = null;
MV.module({
  hero:function(){ var F = MV.C.practice.activities[0]; F.items.forEach(function(it){ it.hints[0] = F.h1; }); HERO = hero(); },
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ proof:proof, spot:spotProse },
  task:task,
  summaryLines:function(){ var L = errors(); return ["Errors I make: " + (L.length ? L.slice(0, 3).map(function(e){ return e.t + " (" + e.n + ")"; }).join("; ") : "none recorded")]; },
  onShow:function(v){ stopPlay(); if (v === "explore" && EX) EX.story(); if (v === "reflect") paintErrors(); }
});
})();
