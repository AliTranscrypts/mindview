// ENG4U 10 Soliloquy & Character: hero (3.1.56–60 with settling stress marks), Soliloquy studio (Explore: E3 scansion tapper,
// E1 lenses for pronouns / questions / imagery, E5 argument map, compare cards), Write a soliloquy (Part 3: E17 studio with a
// craft → meaning panel), Scan and interpret (★), Spot the Error (K13 prose), Score the soliloquy (E10 delivery score + note).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc, X = null;
function num(a, b){ return a - b; }
function cap(s){ s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function bare(s){ return String(s).replace(/·/g, ""); }
function key(t){ return String(t).toLowerCase().replace(/[’']/g, "").replace(/[^a-z]/g, ""); }
function wc(t){ return MV.eng.wordCount(t); }
function solById(id){ return X.sols.filter(function(s){ return s.id === id; })[0]; }

// ---------- @component radioGroup (copied from ENG4U 03; no option needs to be checked) ----------
function radios(host, o){
  var val = String(o.value == null ? "" : o.value);
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); }), tab = ids.indexOf(val) >= 0 ? val : ids[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '">' + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(b.dataset.rg) + d + ids.length) % ids.length;
    choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus();
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; } };
}

// ---------- @component E3 scansionTapper (adapted from ENG4U 03) — syllable chips; tap or Space to mark stress; checks against a key
// {req, opt, never, one (exactly one of), least (at least one of)}; names iambic metre, inversions, spondees and feminine endings ----------
var SC = (function(){
  var LEAD = /^[(“"‘\[]+/, TRAIL = /[.,;:!?)\]”"’—–]+$/, KN = { 3:"trimeter", 4:"tetrameter", 5:"pentameter", 6:"hexameter" };
  function parse(src){
    var words = [], syl = [];
    String(src).split(/\s+/).filter(Boolean).forEach(function(tk0){
      tk0.replace(/—(?=\S)/g, "—\u0001").split("\u0001").forEach(function(tok, gi){
        var lead = (tok.match(LEAD) || [""])[0], rest = tok.slice(lead.length), trail = (rest.match(TRAIL) || [""])[0], core = rest.slice(0, rest.length - trail.length);
        var w = { lead:lead, core:core.replace(/·/g, ""), trail:trail, syl:[], glue:gi > 0 };
        if (/[A-Za-z]/.test(core)) core.split("·").forEach(function(p, k, all){ w.syl.push(syl.length); syl.push({ t:p, w:words.length, last:k === all.length - 1 }); });
        else { w.lead = tok; w.core = ""; w.trail = ""; }
        words.push(w);
      });
    });
    return { words:words, syl:syl, n:syl.length, text:words.map(function(w, i){ return (i && !w.glue ? " " : "") + w.lead + w.core + w.trail; }).join("") };
  }
  function sn(P, i, has){ var s = P.syl[i - 1]; if (!s) return ""; return (has[i] ? s.t.toUpperCase() : s.t.toLowerCase()) + (s.last ? "" : "-"); }
  function metre(P, marks){
    var n = P.n, has = {}; (marks || []).forEach(function(i){ has[i] = 1; });
    var fem = n % 2 === 1 && !has[n], k = (fem ? n - 1 : n) / 2, feet = [], c = { iamb:0, trochee:0, spondee:0, pyrrhic:0 };
    if (!KN[k] || !marks.length) return { fit:false, text:"No regular pattern yet", vars:"—" };
    for (var i = 0; i < k; i++) { var a = 2 * i + 1, b = a + 1, t = has[a] ? (has[b] ? "spondee" : "trochee") : (has[b] ? "iamb" : "pyrrhic"); feet.push({ a:a, b:b, t:t, n:i + 1 }); c[t]++; }
    if (c.iamb < Math.ceil(k / 2)) return { fit:false, text:"Keep listening: no regular pattern yet", vars:"—" };
    var V = [];
    feet.filter(function(f){ return f.t === "trochee"; }).forEach(function(f){ V.push("Foot " + f.n + " inverted: " + sn(P, f.a, has) + " " + sn(P, f.b, has)); });
    for (var j = 1; j < n; j++) if (has[j] && has[j + 1] && !(has[j - 1])) { var run = [j]; for (var q = j + 1; has[q]; q++) run.push(q); V.push("Two stresses together (spondee): " + run.map(function(r){ return sn(P, r, has); }).join(" ")); }
    feet.filter(function(f){ return f.t === "pyrrhic"; }).forEach(function(f){ V.push("Light foot (pyrrhic): " + sn(P, f.a, has) + " " + sn(P, f.b, has)); });
    if (fem) V.push("Feminine ending: an extra light syllable (" + sn(P, n, has) + ")");
    return { fit:true, k:k, feet:feet, text:"Iambic " + KN[k] + (fem ? " with a feminine ending (extra light syllable)" : ""), vars:V.length ? V.join("; ") : "Regular: no variation", bars:feet.slice(1).map(function(f){ return f.a; }) };
  }
  function check(marks, K){
    var has = {}; marks.forEach(function(i){ has[i] = 1; });
    var missing = K.req.filter(function(i){ return !has[i]; }), extra = marks.filter(function(i){ return K.req.indexOf(i) < 0 && K.opt.indexOf(i) < 0; }).sort(num);
    var one = K.one ? K.one.filter(function(i){ return has[i]; }).length : 1, least = K.least ? K.least.filter(function(i){ return has[i]; }).length : 1;
    return { ok:!missing.length && !extra.length && one === 1 && least >= 1, missing:missing, extra:extra, both:!!K.one && one > 1, none:(!!K.one && !one) || !least };
  }
  return { parse:parse, metre:metre, check:check, sn:sn };
})();
function tapper(host, o){
  var pos = 0, gl = {};
  function paint(){
    var P = o.P, has = {}, bars = {}, h = "", f = host.contains(document.activeElement);
    o.get().forEach(function(i){ has[i] = 1; }); (o.feet ? o.feet() : []).forEach(function(i){ bars[i] = 1; });
    P.words.forEach(function(w, wi){
      h += (wi && !w.glue ? " " : "") + '<span class="sct-w">' + esc(w.lead);
      w.syl.forEach(function(si){
        var n = si + 1, on = !!has[n], cls = "sc-syl sct-b " + (on ? "sc-stress" : "sc-slack") + (gl[si] ? " sct-on" : "") + (si === P.n - 1 && o.last ? " " + o.last : "");
        if (bars[n]) h += '<span class="sct-bar" aria-hidden="true"></span>';
        h += o.ro ? '<span class="' + cls + '">' + esc(P.syl[si].t) + "</span>" : '<button type="button" class="' + cls + '" data-si="' + si + '" aria-pressed="' + on + '" tabindex="' + (si === pos ? 0 : -1) + '" aria-label="' + esc("syllable " + n + " of " + P.n + ", " + P.syl[si].t + ", " + (on ? "stressed" : "unstressed")) + '">' + esc(P.syl[si].t) + "</button>";
      });
      h += esc(w.trail) + "</span>";
    });
    host.innerHTML = '<div class="sct' + (o.ro ? " ro" : "") + '" role="group" aria-label="' + esc("Syllables: " + P.text) + '"><span class="sct-ws">' + h + "</span></div>";
    if (f) focus(pos);
  }
  function focus(si){ pos = Math.max(0, Math.min(o.P.n - 1, si)); $$("[data-si]", host).forEach(function(b){ b.tabIndex = +b.dataset.si === pos ? 0 : -1; }); var b = host.querySelector('[data-si="' + pos + '"]'); if (b) b.focus(); }
  if (!o.ro) {
    host.addEventListener("click", function(e){ var b = e.target.closest("[data-si]"); if (!b) return; pos = +b.dataset.si; o.toggle(pos + 1); paint(); focus(pos); });
    host.addEventListener("keydown", function(e){
      var b = e.target.closest("[data-si]"); if (!b) return; var si = +b.dataset.si;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); focus(si + (e.key === "ArrowRight" ? 1 : -1)); }
      else if (e.key === "Home" || e.key === "End") { e.preventDefault(); focus(e.key === "Home" ? 0 : o.P.n - 1); }
    });
  }
  paint();
  return { paint:paint, glow:function(list){ gl = {}; (list || []).forEach(function(i){ gl[i] = 1; }); $$(".sct-b", host).forEach(function(x, i){ x.classList.toggle("sct-on", !!gl[i]); }); } };
}
function keyFeedback(P, r, K, msgs){
  var nm = function(i){ return "syllable " + i + " (“" + esc(P.syl[i - 1].t) + "”)"; };
  if (r.ok) return null;
  if (msgs) {
    if (r.both) return msgs.both;
    if (r.extra.indexOf(11) >= 0) return msgs.e11;
    if (r.extra.indexOf(1) >= 0) return msgs.e1;
    return msgs.general;
  }
  var out = [];
  if (r.missing.length) out.push("Listen again for the beat on " + listAnd(r.missing.map(nm)) + ".");
  if (r.extra.length) out.push(cap(listAnd(r.extra.map(nm))) + (r.extra.length > 1 ? " usually fall" : " usually falls") + " light.");
  if (r.none && K.least) out.push("At least one of " + listAnd(K.least.map(nm)) + " carries a beat.");
  return out.join(" ") || MV.C.explore.challenges[0].msgs.general;
}

// ---------- local voice + @component E5 pausePlayer (adapted from ENG4U 07) — speak a sequence of parts with gaps; stressed parts a
// little louder and higher; with no local voice, a timed run lights the same parts (reduced motion: no run) ----------
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
        var u = new SpeechSynthesisUtterance(it.t); u.voice = VOICE; u.lang = VOICE.lang; u.rate = (o.rate || 1) * (it.rate || 1); u.pitch = it.st ? 1.15 : 1; u.volume = it.st ? 1 : 0.8;
        var go = false; u.onstart = function(){ go = true; setTimeout(after, 700 + it.t.length * 110 / u.rate); }; u.onend = after; u.onerror = after; window.speechSynthesis.speak(u); setTimeout(function(){ if (!go) { o.silent = true; try { window.speechSynthesis.cancel(); } catch (e) {} after(); } }, 1500);
      } catch (e) { after(); }
    } else if (MV.reduceMotion) after();
    else setTimeout(after, it.dur || 260);
  }
  next();
  return { stop:function(){ stopAll(); end(false); } };
}
// one line, a word at a time; the words that hold a marked syllable are stressed
function lineItems(P, marks, glow){
  var out = [];
  P.words.forEach(function(w){
    if (!w.syl.length) return;
    var st = w.syl.some(function(si){ return marks.indexOf(si + 1) >= 0; });
    out.push({ t:w.lead + w.core + w.trail, st:st, rate:st ? 0.85 : 1.05, dur:w.syl.length * (st ? 300 : 220), gap:/[,;:.!?—]/.test(w.trail) ? 220 : 0, on:function(){ if (glow) glow(w.syl); } });
  });
  return out;
}

// ---------- hero: 3.1.56–60; accents and breves settle over the syllables, "-tion" wobbles, a wave under "sea of troubles" ----------
var HR = { run:0 };
function hero(){
  prep(); var H = MV.C.hero, host = $("#sq-hero"); if (!host) return;
  var PL = H.lines.map(function(l){ return SC.parse(l.t); });
  host.innerHTML = '<div class="sqh-lines" aria-hidden="true">' + PL.map(function(P, li){
    var M = H.lines[li].m, wv = H.lines[li].wave, h = '<div class="sqh-line"><span class="sqh-n">' + (56 + li) + "</span><span>";
    P.words.forEach(function(w, wi){
      h += (wi ? " " : "") + '<span class="sqh-w">' + esc(w.lead) + w.syl.map(function(si){
        var cls = "sc-syl sqh-s " + (M.indexOf(si + 1) >= 0 ? "sc-stress" : "sc-slack") + (li === 0 && si === P.n - 1 ? " sqh-wob" : "") + (wv && si + 1 >= wv[0] && si + 1 <= wv[1] ? " sqh-wv" : "");
        return '<span class="' + cls + '" data-li="' + li + '" data-si="' + si + '">' + esc(P.syl[si].t) + "</span>";
      }).join("") + esc(w.trail) + "</span>";
    });
    return h + "</span></div>";
  }).join("") + '</div><p class="vh">' + PL.map(function(P, li){ var has = {}; H.lines[li].m.forEach(function(i){ has[i] = 1; }); return P.syl.map(function(s, si){ return SC.sn(P, si + 1, has); }).join(" ").replace(/- /g, "-"); }).join(" / ") + "</p>" +
    '<p class="sqh-cap" id="sqh-cap">' + H.caption + '</p><p class="eng-cite">' + H.cite + '</p><div class="q-actions"><button type="button" class="btn ghost sm" id="sqh-go">' + H.watch + '</button><span class="tiny muted" id="sqh-note"></span></div>';
  var S = $$(".sqh-s", host);
  function reset(){ host.classList.add("sqh-anim"); host.classList.remove("sqh-done", "sqh-wave", "sqh-still"); S.forEach(function(x){ x.classList.remove("lit", "now"); }); $("#sqh-cap").classList.remove("on"); }
  function finish(){ host.classList.remove("sqh-anim", "sqh-wave"); host.classList.add("sqh-done"); S.forEach(function(x){ x.classList.add("lit"); x.classList.remove("now"); }); $("#sqh-cap").classList.add("on"); }
  function light(li, list){ S.forEach(function(x){ x.classList.remove("now"); }); list.forEach(function(si){ var x = host.querySelector('.sqh-s[data-li="' + li + '"][data-si="' + si + '"]'); if (x) x.classList.add("lit", "now"); }); }
  function play(){
    var me = ++HR.run; reset(); if (MV.reduceMotion) { finish(); if (!VOICE) return; }
    var items = [];
    PL.forEach(function(P, li){
      lineItems(P, H.lines[li].m, function(l){ if (me === HR.run && !MV.reduceMotion) light(li, l); }).forEach(function(it, k, all){
        it.rate = (it.rate || 1) * 0.85;
        if (li === 3 && k === all.length - 3) { var on0 = it.on; it.on = function(){ on0(); if (me === HR.run && !MV.reduceMotion) { host.classList.add("sqh-wave"); MV.wait(1400, function(){ host.classList.add("sqh-still"); }); } }; }
        if (k === all.length - 1) it.gap = 420;
        items.push(it);
      });
    });
    seq(items, { rate:0.9 }, function(){ if (me === HR.run) finish(); });
  }
  $("#sqh-go").addEventListener("click", play);
  voiceReady(function(v){ $("#sqh-go").textContent = v ? H.listen : H.watch; $("#sqh-note").textContent = v ? "" : H.noVoice; if (!v && MV.reduceMotion) $("#sqh-go").hidden = true; });
  if (MV.reduceMotion) finish(); else MV.wait(300, function(){ if (!HR.run) { HR.run++; var me = HR.run; reset(); var t = 0;
    PL.forEach(function(P, li){ P.syl.forEach(function(s, si){ (function(at){ setTimeout(function(){ if (me === HR.run) light(li, [si]); }, at); })(t); t += 70; }); t += 160; if (li === 2) (function(at){ setTimeout(function(){ if (me === HR.run) host.classList.add("sqh-wave"); }, at); })(t); });
    setTimeout(function(){ if (me === HR.run) host.classList.add("sqh-still"); }, t + 1200); setTimeout(function(){ if (me === HR.run) finish(); }, t + 1500); } });
  HR.stop = function(){ if (host.classList.contains("sqh-anim")) { HR.run++; stopAll(); finish(); } };
}

// ---------- passages as word tokens (em dashes between words split them) ----------
function tokLines(lines){
  var out = [];
  lines.forEach(function(l, li){ bare(l).split(/\s+/).forEach(function(w){ if (w) w.replace(/—(?=\S)/g, "—\u0001").split("\u0001").forEach(function(p){ out.push({ t:p, line:li, k:key(p) }); }); }); });
  return out;
}
function findSeq(T, phrase){
  var P = phrase.split(/\s+/).map(key).filter(Boolean), hits = [];
  for (var i = 0; i < T.length; i++) { var j = 0, k = i, w = []; while (j < P.length && k < T.length) { if (!T[k].k) { k++; continue; } if (T[k].k !== P[j]) break; w.push(k); j++; k++; } if (j === P.length) hits.push(w); }
  return hits;
}
var TOK = {}, END = {};
function prep(){
  if (X) return; X = MV.C.explore;
  X.sols.forEach(function(s){
  var T = TOK[s.id] = tokLines(s.lines), e = T.length - 1;
  if (s.end) for (var i = 0; i < T.length; i++) if (T[i].line === s.end - s.start && /^action/.test(T[i].k)) { e = i; break; }
  END[s.id] = e;
  });
}
function pronClass(t){ var w = t.t.toLowerCase().replace(/^[^a-z’']+|[^a-z’']+$/g, "").replace(/'/g, "’"); return X.pron.i.indexOf(w) >= 0 ? "i" : X.pron.we.indexOf(w) >= 0 ? "we" : X.pron.he.indexOf(w) >= 0 ? "he" : null; }
function questions(T, end){
  var out = [], st = 0;
  for (var i = 0; i <= end; i++) { var t = T[i].t; if (/\?/.test(t)) { out.push({ a:st, b:i }); } if (/[.!?;:]['’”]?$|[.!?;:]—$/.test(t)) st = i + 1; }
  return out;
}

// ---------- Explore: Soliloquy studio ----------
var EX = null, EXS = null;
function explore(host, api){
  prep(); var S = api.S, KEY = {}, PS = {}, fx = {}, playing = null;
  EXS = S;
  X.keys.forEach(function(k){ KEY[k.id] = { k:MV.ans(k), name:k.name }; });
  X.sols.forEach(function(s){ PS[s.id] = s.lines.map(SC.parse); });
  var STATE = MV.ans(X.stateKey);
  S.mode = ["scan", "track", "map", "compare"].indexOf(S.mode) >= 0 ? S.mode : "scan"; S.sol = solById(S.sol) ? S.sol : "s31";
  S.open = S.open || {}; S.marks = S.marks || {}; S.chk = S.chk || {}; S.lens = S.lens || {}; S.tsel = S.tsel || {}; S.state = S.state || {};
  if (!Array.isArray(S.order) || S.order.length !== 6) S.order = X.jumble.slice();
  host.innerHTML = '<div class="sq">' +
    '<div class="sq-top"><div id="sq-mode"></div><div id="sq-sol"></div></div>' +
    '<div class="sq-body"><div class="sq-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="sq-scan"></div><div id="sq-track"></div><div id="sq-map"></div><div id="sq-cmp"></div><p class="eng-cite">' + X.credit + "</p></div>" +
    '<div class="sq-read"><p class="sq-rh">Readout</p><dl class="read" id="sq-read" aria-live="polite"></dl><p class="sq-aha">' + X.aha + "</p></div></div></div>";
  var modeRG = radios($("#sq-mode"), { label:"Mode", options:X.modes, value:S.mode, onChange:function(v){ stopPlay(); S.mode = v; api.save(); paint(); } });
  var solRG = radios($("#sq-sol"), { label:"Soliloquy", cls:"chips", options:X.sols.map(function(s){ return { id:s.id, t:s.label }; }), value:S.sol, onChange:function(v){ stopPlay(); S.sol = v; api.save(); paint(); } });
  function sol(){ return solById(S.sol); }
  function marks(sid, li){ var m = S.marks[sid] || (S.marks[sid] = {}); return m[li] || (m[li] = []); }
  function openLi(){ var o = S.open[S.sol]; return o == null ? -1 : o; }
  function stopPlay(){ if (playing) { playing.stop(); playing = null; } }

  // ----- Scan -----
  var tap = null;
  function paintScan(){
    var s = sol(), P = PS[s.id], oi = openLi(), h = '<p class="how">' + X.scanHow + '</p><ol class="sq-lines">';
    s.lines.forEach(function(l, li){
      var k = KEY[s.id + ":" + li];
      if (li === oi) h += '<li class="sq-open"><span class="sq-n">' + (s.start + li) + '</span><div><div id="sq-tap"' + (fx.arc ? ' class="sq-arc"' : "") + '></div><div id="sq-lctl"></div></div></li>';
      else h += '<li><span class="sq-n">' + (s.start + li) + '</span><button type="button" class="sq-ln" data-ln="' + li + '" data-k="ln' + li + '">' + esc(P[li].text) + (k ? ' <span class="tag">key</span>' : "") + "</button></li>";
    });
    MV.keepFocus($("#sq-scan"), function(){ $("#sq-scan").innerHTML = h + "</ol>"; });
    if (oi >= 0) {
      tap = tapper($("#sq-tap"), { P:P[oi], get:function(){ return marks(s.id, oi); }, feet:function(){ var m = SC.metre(P[oi], marks(s.id, oi)); return m.fit ? m.bars : []; }, last:fx.arc ? "sq-hang" : "",
        toggle:function(n){ stopPlay(); var m = marks(s.id, oi), k = m.indexOf(n); if (k < 0) m.push(n); else m.splice(k, 1); m.sort(num); S.chk[s.id + ":" + oi] = null; api.save(); paintLctl(); paintRead(); MV.changed(); } });
      paintLctl();
    } else tap = null;
  }
  function paintLctl(){
    var s = sol(), oi = openLi(), id = s.id + ":" + oi, k = KEY[id], r = S.chk[id], el = $("#sq-lctl"); if (!el) return;
    var h = '<div class="q-actions">' + (k ? '<button type="button" class="btn primary sm" data-act="lcheck" data-k="lcheck">Check</button>' : "") +
      '<button type="button" class="btn sm" data-act="listen" data-k="listen">' + (playing ? "Stop" : "Listen") + '</button><button type="button" class="btn ghost sm" data-act="lclear" data-k="lclear">Clear marks</button><button type="button" class="btn ghost sm" data-act="lclose" data-k="lclose">Close line</button></div>';
    if (!VOICE) h += '<p class="tiny muted">' + X.noVoice + "</p>";
    if (id === "s31:1") h += '<p class="tiny muted">' + X.whether + "</p>";
    if (!k) h += '<p class="tiny muted">' + X.noKey + "</p>";
    if (r) h += MV.fbHTML(r.ok ? "good" : "bad", r.ok ? "<strong>✓ This matches the key.</strong> " + (k.k.opt.length ? "The key accepts " + listAnd(k.k.opt.map(function(i){ return "syllable " + i; })) + (k.k.one ? ": exactly one of them stressed." : k.k.least ? ": at least one of them stressed." : " either way.") : "") : "<strong>✗ Not yet.</strong> " + r.msg);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function lineCheck(){
    var s = sol(), oi = openLi(), id = s.id + ":" + oi, k = KEY[id], P = PS[s.id][oi], r = SC.check(marks(s.id, oi), k.k);
    S.chk[id] = { ok:r.ok, msg:r.ok ? "" : keyFeedback(P, r, k.k, id === "s31:0" ? X.challenges[0].msgs : null) }; api.save(); paintLctl(); paintRead(); MV.focusFb($("#sq-lctl"));
  }
  function listen(){
    if (playing) { stopPlay(); paintLctl(); return; }
    var s = sol(), oi = openLi(), P = PS[s.id][oi], m = marks(s.id, oi);
    playing = seq(lineItems(P, m, function(l){ if (tap) tap.glow(l); }), {}, function(){ playing = null; if (tap) tap.glow(null); paintLctl(); });
    paintLctl();
  }

  // ----- Track (E1 lenses) -----
  var tk = null, tkSol = null;
  function lensMarks(sid, opt){
    var T = TOK[sid], e = END[sid], out = [], L = opt || S.lens;
    if (L.pron) T.forEach(function(t, i){ var c = pronClass(t); if (c && (fx.pronUpto == null || (c === "we" && i <= fx.pronUpto))) out.push({ w:[i], role:"syntax", tag:c === "i" ? "I" : c === "we" ? "we" : "he/who/they" }); });
    if (L.ques) questions(T, T.length - 1).forEach(function(q){ var w = []; for (var i = q.a; i <= q.b; i++) w.push(i); out.push({ w:w, role:"syntax", tag:"Question" }); });
    if (L.img) { var C = X.imagery[sid] || {}; Object.keys(C).forEach(function(c){ C[c].forEach(function(ph){ findSeq(T, ph).forEach(function(w){ out.push({ w:w, role:"image", tag:"Imagery · " + X.clusters[c] }); }); }); }); }
    void e; return out;
  }
  function paintTrack(){
    var s = sol(), el = $("#sq-track");
    if (!el.firstChild || tkSol !== s.id) {
      el.innerHTML = '<div class="sq-lenses" role="group" aria-label="Lenses: switch each on or off"></div><p class="tiny muted">Tap words to mark them (for the challenge); Shift + tap marks a run. Lenses add highlights with tags.</p>' +
        '<div class="sq-trk" style="counter-reset:ln ' + (s.start - 1) + '"></div><div class="q-actions"><button type="button" class="btn ghost sm" data-act="none" data-k="none"></button><button type="button" class="btn ghost sm" data-act="tclear" data-k="tclear">Clear my marks</button><span class="tiny" id="sq-tsel" aria-live="polite"></span></div>';
      tk = MV.eng.tokens($(".sq-trk", el), TOK[s.id], { label:"The soliloquy: tap words to mark them", marks:function(){ return lensMarks(S.sol); },
        onChange:function(sel){ S.tsel[S.sol] = sel; if (sel.length) S.none = false; api.save(); paintTsel(); paintRead(); MV.changed(); } });
      tk.set(S.tsel[s.id] || []); tkSol = s.id;
    }
    $(".sq-lenses", el).innerHTML = X.lenses.map(function(l){ var on = !!S.lens[l.id]; return '<button type="button" class="an-chip an-' + l.role + '" data-lens="' + l.id + '" data-k="lens' + l.id + '" aria-pressed="' + on + '"><i class="an-dot"></i>' + l.label + "</button>"; }).join("");
    tk.paint(); paintTsel();
  }
  function paintTsel(){
    var b = $('#sq-track [data-act="none"]'); if (!b) return;
    var on = S.sol === "s31" && !!S.none; b.textContent = on ? "None found ✓" : "None found"; b.setAttribute("aria-pressed", on); b.hidden = S.sol !== "s31";
    var n = (S.tsel[S.sol] || []).length; $("#sq-tsel").textContent = n ? n + " word" + (n > 1 ? "s" : "") + " marked" : on ? "You found none." : "";
  }

  // ----- Map (E5 argument path) -----
  function hingeToks(){ return TOK.s31.filter(function(t){ return t.line < X.hinge; }); }
  function turnInfo(){
    if (S.turn == null) return null;
    var t = TOK.s31[S.turn]; if (!t) return null;
    var lineToks = TOK.s31.filter(function(x){ return x.line === 9; }), pos = lineToks.indexOf(t);
    return { t:t, rub:t.line === 9 && pos >= 5, question:t.line === 0 && t.k === "question" };
  }
  function paintMap(){
    var el = $("#sq-map"), C = X.cards, bentAt = fx.bent ? S.order.indexOf(2) : -1, ti = turnInfo();
    var h = '<p class="how">Put the six moves of 3.1 in order with Move up and Move down. Then tap the word in the speech where the argument turns.</p><ol class="sq-path' + (fx.bent ? " bent" : "") + '">';
    S.order.forEach(function(ci, p){
      var c = C[ci], hl = fx.hl && fx.hl.indexOf(c.id) >= 0;
      h += '<li class="sq-card' + (hl ? " hl" : "") + (bentAt >= 0 && p >= bentAt ? " off" : "") + (p === bentAt ? " elbow" : "") + '"><span class="sq-ct">' + c.t + ' <span class="tiny muted">(' + c.ref + ')</span></span><span class="sq-mv"><button type="button" class="btn ghost sm" data-up="' + p + '" data-k="up' + c.id + '"' + (p ? "" : " disabled") + ' aria-label="Move up: ' + esc(MV.plain(c.t)) + '">Move up</button><button type="button" class="btn ghost sm" data-dn="' + p + '" data-k="dn' + c.id + '"' + (p < 5 ? "" : " disabled") + ' aria-label="Move down: ' + esc(MV.plain(c.t)) + '">Move down</button></span></li>';
    });
    h += '</ol><p class="sq-hh"><strong>The speech, 3.1.56–66:</strong> tap the word where the argument turns.</p><div class="sq-hinge" role="group" aria-label="Words of 3.1.56 to 66: tap the turning word">';
    var line = -1;
    hingeToks().forEach(function(t){
      var i = TOK.s31.indexOf(t);
      if (t.line !== line) { h += (line < 0 ? "" : "</div>") + '<div class="sq-hl"><span class="sq-n">' + (56 + t.line) + "</span>"; line = t.line; }
      var on = S.turn === i, glow = fx.rub && t.line === 9 && /^rub/.test(t.k);
      h += '<button type="button" class="sq-hw' + (glow ? " glow" : "") + '" data-hw="' + i + '" data-k="hw' + i + '" aria-pressed="' + on + '">' + esc(t.t) + "</button>";
    });
    h += "</div></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    void ti;
  }

  // ----- Compare -----
  function paintCmp(){
    var el = $("#sq-cmp"), h = '<p class="how">Read each opening and closing. Choose the state of mind that best fits each soliloquy.</p><div class="sq-cards">';
    X.sols.forEach(function(s){
      var P = PS[s.id], v = S.state[s.id], hl = fx.cmp === s.id;
      h += '<div class="sq-cc' + (hl ? " hl" : "") + '"><h4>' + s.label + '</h4><p class="sq-q"><span class="tiny muted">Opens</span> “' + esc(P[0].text.replace(/[,;:]$/, "")) + "”</p><p class=\"sq-q\"><span class=\"tiny muted\">Closes</span> “" +
        (s.id === "s44" && fx.vow ? esc(s.close).replace("thoughts", '<mark class="an an-syntax">thoughts</mark>') : esc(s.close)) + "”</p>" +
        (s.id === "s44" && fx.vow ? '<p class="sq-vow"><span class="chip on">thought</span><span class="chip sq-grey">deed</span></p>' : "") +
        '<div class="chips sq-st" role="radiogroup" aria-label="' + esc("State of mind for " + MV.plain(s.label)) + '">' + X.states.map(function(o){ var on = v === o.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" data-st="' + s.id + "|" + o.id + '" data-k="st' + s.id + o.id + '">' + o.t + "</button>"; }).join("") + "</div></div>";
    });
    MV.keepFocus(el, function(){ el.innerHTML = h + "</div>"; });
  }

  // ----- readout -----
  function paintRead(){
    var s = sol(), R = [];
    if (S.mode === "scan") {
      var oi = openLi();
      if (oi < 0) R.push(["Line", "Tap a line to open it."]);
      else {
        var P = PS[s.id][oi], m = marks(s.id, oi), id = s.id + ":" + oi, k = KEY[id], r = S.chk[id], mt = SC.metre(P, m);
        R.push(["Line", "“" + esc(P.text) + "” (" + s.act + "." + (s.start + oi) + ")"], ["Syllables", String(P.n)], ["Your stresses", m.length + " marked"]);
        if (k) {
          var okc = r && r.ok;
          R.push(["Pattern", okc ? mt.text : "Shown after a correct Check"]);
          if (okc && k.k.one) R.push(["Variation", m.indexOf(7) >= 0 ? "Foot 4 inverted: THAT is (stress on “that”)" : "Regular: that IS"]);
          else R.push(["Variation", okc ? esc(mt.vars) : "—"]);
        } else R.push(["Your marks read as", mt.text], ["Variation", esc(mt.vars)]);
      }
    } else if (S.mode === "track") {
      var T = TOK[s.id], e = END[s.id], c = { i:0, we:0, he:0 };
      T.forEach(function(t, i){ if (i <= e) { var p = pronClass(t); if (p && (fx.pronUpto == null || i <= fx.pronUpto)) c[p]++; } });
      R.push(["Pronouns" + (s.end ? " (3.1, up to “the name of action”)" : ""), "I/me/my: " + c.i + " · we/us/our: " + c.we + " · he/who/they: " + c.he]);
      R.push(["Questions", questions(T, T.length - 1).length + " in this text (counts depend on the edition’s punctuation)"]);
      var sel = S.tsel[s.id] || [];
      R.push(["You’ve marked", sel.length ? esc(sel.map(function(i){ return T[i].t; }).join(" · ")) : (s.id === "s31" && S.none ? "None found" : "nothing yet")]);
    } else if (S.mode === "map") {
      var ti = turnInfo(), ord = S.order.every(function(v, i){ return v === i; });
      R.push(["Order", ord ? "In the speech’s order" : "Not yet in order"]);
      R.push(["Turn", !ti ? "Tap a word in the speech" : ti.rub ? "“rub”: the argument changes direction here" : "“" + esc(ti.t.t) + "”: your choice"]);
    } else {
      var have = X.sols.every(function(x){ return S.state[x.id]; });
      R.push(["State of mind", have ? X.sols.map(function(x){ return x.act + " " + X.states.filter(function(o){ return o.id === S.state[x.id]; })[0].t; }).join(" → ") : "Choose a chip for each soliloquy"]);
      if (have) R.push(["The arc", X.sols.every(function(x){ return S.state[x.id] === STATE[x.id]; }) ? "✓ " + X.arcLine : "Compare your chain with the closing lines: what does each speech end by doing?"]);
    }
    $("#sq-read").innerHTML = MV.readoutHTML(R);
  }

  function paint(){
    modeRG.set(S.mode); solRG.set(S.sol);
    $("#sq-sol").hidden = S.mode === "map" || S.mode === "compare";
    ["scan", "track", "map", "cmp"].forEach(function(m){ $("#sq-" + m).hidden = (m === "cmp" ? "compare" : m) !== S.mode; });
    if (S.mode === "scan") paintScan(); else if (S.mode === "track") paintTrack(); else if (S.mode === "map") paintMap(); else paintCmp();
    paintRead(); MV.changed();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    var d = b.dataset;
    if (d.ln != null) { stopPlay(); S.open[S.sol] = +d.ln; fx.arc = false; api.save(); paintScan(); paintRead(); var f = $("#sq-tap [tabindex='0']"); if (f) f.focus(); return; }
    if (d.act === "lcheck") { lineCheck(); return; }
    if (d.act === "listen") { listen(); return; }
    if (d.act === "lclear") { stopPlay(); var m = marks(S.sol, openLi()); m.length = 0; S.chk[S.sol + ":" + openLi()] = null; api.save(); paintScan(); paintRead(); MV.changed(); return; }
    if (d.act === "lclose") { stopPlay(); var was = openLi(); S.open[S.sol] = -1; api.save(); paintScan(); paintRead(); var lb = $('#sq-scan [data-ln="' + was + '"]'); if (lb) lb.focus(); return; }
    if (d.lens) { S.lens[d.lens] = !S.lens[d.lens]; api.save(); paintTrack(); paintRead(); return; }
    if (d.act === "none") { S.none = !S.none; if (S.none) { S.tsel.s31 = []; if (tk) tk.set([]); } api.save(); paintTsel(); paintRead(); MV.changed(); return; }
    if (d.act === "tclear") { S.tsel[S.sol] = []; if (tk) tk.set([]); api.save(); paintTsel(); paintRead(); MV.changed(); return; }
    if (d.up != null || d.dn != null) { var p = +(d.up != null ? d.up : d.dn), q = d.up != null ? p - 1 : p + 1, o = S.order, t = o[p]; o[p] = o[q]; o[q] = t; api.save(); paintMap(); paintRead(); MV.changed(); var nb = $('#sq-map [data-k="' + d.k + '"]'); if (nb && !nb.disabled) nb.focus(); return; }
    if (d.hw != null) { S.turn = S.turn === +d.hw ? null : +d.hw; api.save(); paintMap(); paintRead(); MV.changed(); return; }
    if (d.st) { var a = d.st.split("|"); S.state[a[0]] = a[1]; api.save(); paintCmp(); paintRead(); return; }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest(".sq-st [role=radio]"); if (!b || ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].indexOf(e.key) < 0) return;
    e.preventDefault(); var all = $$("button", b.parentNode), i = all.indexOf(b), n = all[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length]; n.click(); var f = $('[data-k="' + n.dataset.k + '"]'); if (f) f.focus();
  });
  document.addEventListener("click", function(e){
    var b = e.target.closest(".sq-setup"); if (!b) return;
    var id = b.dataset.setup; stopPlay(); fx = {};
    if (id === "tc1") { S.mode = "scan"; S.sol = "s31"; S.open.s31 = 0; }
    else if (id === "tc2") { S.mode = "track"; S.sol = "s31"; }
    else { S.mode = "map"; }
    api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc1" ? $("#sq-tap [tabindex='0']") : id === "tc2" ? $("#sq-track .eng-tok[tabindex='0']") : $("#sq-map [data-dn]");
    if (f) f.focus({ preventScroll:true });
  });
  voiceReady(function(){ if (S.mode === "scan") paintLctl(); });

  // the pronoun lens switching itself on, one "we/us" at a time (Explore opening and P2)
  function pronounRun(o, done){
    var T = TOK.s31, list = []; S.mode = "track"; S.sol = "s31";
    T.forEach(function(t, i){ if (i <= END.s31 && pronClass(t) === "we") list.push(i); });
    if (MV.reduceMotion) { fx.pronUpto = null; if (!o.fade) S.lens.pron = true; api.save(); paint(); done(); return; }
    fx.pronUpto = -1; S.lens.pron = true; paint();
    var k = 0;
    (function step(){
      if (k >= list.length) { fx.pronUpto = null; if (o.fade) MV.wait(900, function(){ S.lens.pron = false; api.save(); paintTrack(); paintRead(); done(); }); else { api.save(); paintTrack(); paintRead(); done(); } return; }
      fx.pronUpto = list[k++]; tk.paint(); paintRead(); MV.wait(420, step);
    })();
  }
  EX = {
    stop:function(){ stopPlay(); },
    intro:function(){
      if (S.intro) return; S.intro = true; S.lens = {}; api.save();
      pronounRun({ fade:true }, function(){ MV.banner("", X.introBanner); });
    }
  };

  function tc1(){
    var m = marks("s31", 0), r = SC.check(m, KEY["s31:0"].k), M = X.challenges[0].msgs;
    if (r.ok) return { ok:true };
    if (!m.length) return { ok:false, msg:M.general };
    return { ok:false, msg:keyFeedback(PS.s31[0], r, KEY["s31:0"].k, M) };
  }
  function tc2(live){
    var M = X.challenges[1].msgs, T = TOK.s31, sel = S.tsel.s31 || [];
    if (sel.some(function(i){ return pronClass(T[i]) === "we"; })) return { ok:false, msg:M.we };
    if (sel.some(function(i){ return i > END.s31 && T[i].k === "my"; })) return { ok:false, msg:M.my };
    if (sel.length) return { ok:false, msg:M.other };
    if (!S.none) return { ok:false, msg:M.none };
    if (!live) MV.banner("good", X.challenges[1].why);
    return { ok:true };
  }
  function tc3(){
    var M = X.challenges[2].msgs, o = S.order, ti = turnInfo();
    if (!o.every(function(v, i){ return v === i; })) return { ok:false, msg:o[0] === 5 ? M.c6 : o.indexOf(2) < o.indexOf(1) ? M.c32 : M.order };
    if (!ti) return { ok:false, msg:M.noturn };
    if (ti.question) return { ok:false, msg:M.question };
    if (!ti.rub) return { ok:false, msg:M.word };
    return { ok:true };
  }
  paint();
  return {
    predict:{
      start:function(p){
        stopPlay(); fx = {};
        if (p.id === "p1") { S.mode = "scan"; S.sol = "s31"; S.open.s31 = 0; }
        else if (p.id === "p2") { S.mode = "track"; S.sol = "s31"; S.lens = {}; }
        else if (p.id === "p3") { S.mode = "map"; fx.hl = ["m2", "m3"]; }
        else { S.mode = "compare"; fx.cmp = "s44"; }
        api.save(); paint();
      },
      run:function(p, done){
        if (p.id === "p1") {
          var m = marks("s31", 0); fx.arc = !MV.reduceMotion; paintScan();
          playing = seq(lineItems(PS.s31[0], m.length ? m : [2, 4, 6, 8, 10], function(l){ if (tap) tap.glow(l); }), {}, function(){ playing = null; if (tap) tap.glow(null); paintLctl(); MV.wait(600, done); });
          paintLctl(); return;
        }
        if (p.id === "p2") { pronounRun({}, done); return; }
        if (p.id === "p3") { fx.bent = true; fx.rub = true; paintMap(); MV.wait(1500, done); return; }
        fx.vow = true; paintCmp(); MV.wait(1500, done);
      }
    },
    challenge:function(id, opt){ var live = opt && opt.live; return id === "tc1" ? tc1() : id === "tc2" ? tc2(live) : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: Write a soliloquy — @component E17 soliloquyStudio (speaker, four shape slots, devices tagged to lines,
// an optional syllable counter, and a craft → meaning panel) ----------
function sylCount(w){
  w = String(w).toLowerCase().replace(/[^a-z]/g, ""); if (!w) return 0; if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  var m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1;
}
function lineSyl(l){ return l.split(/\s+/).reduce(function(t, w){ return t + sylCount(w); }, 0); }
var P3 = null;
function part3(host, api){
  var C = MV.C.part3.studio, S = api.S;
  S.slots = S.slots || {}; S.dev = S.dev || {}; S.speaker = S.speaker || "";
  host.innerHTML = '<div class="sq-p3"><div id="p3-sp"></div><div id="p3-par" class="refresh" hidden><p>' + C.parody + "</p></div>" +
    '<h3 class="sq-h">Shape it</h3><p class="tiny muted">One line of verse per line. Aim for ' + C.lines[0] + "–" + C.lines[1] + " lines in all.</p>" +
    C.slots.map(function(s, i){ return '<div class="jq"><label for="p3-' + s.id + '">' + (i + 1) + ". " + s.t + '</label><p class="tiny muted" id="p3-' + s.id + '-h">' + s.p + '</p><textarea id="p3-' + s.id + '" data-slot="' + s.id + '" rows="3" aria-describedby="p3-' + s.id + '-h"></textarea></div>'; }).join("") +
    '<details class="alg" id="p3-meter"><summary>Optional: syllable counter (pentameter is 10 or 11)</summary><ol class="sq-meter" id="p3-m"></ol></details>' +
    '<h3 class="sq-h">Devices</h3><p class="tiny muted">Choose at least ' + C.minDev + ", then tag the line where each appears.</p><div class=\"chips\" id=\"p3-dev\" role=\"group\" aria-label=\"Devices\"></div>" +
    '<div class="sq-craft"><h3 class="sq-h">Craft → meaning</h3><p class="tiny muted">For each device you tagged, one sentence: “I used ___ to show ___.”</p><div id="p3-cm"></div></div><ul class="checks" id="p3-st" aria-live="polite"></ul></div>';
  radios($("#p3-sp"), { label:"Speaker", cls:"chips", options:C.speakers, value:S.speaker, onChange:function(v){ S.speaker = v; api.save(); paint(); } });
  C.slots.forEach(function(s){ $("#p3-" + s.id).value = S.slots[s.id] || ""; });
  function lines(){ var out = []; C.slots.forEach(function(s){ String(S.slots[s.id] || "").split(/\n/).forEach(function(l){ if (l.trim()) out.push(l.trim()); }); }); return out; }
  function paintDev(){
    var L = lines();
    MV.keepFocus($("#p3-dev"), function(){ $("#p3-dev").innerHTML = C.devices.map(function(d, i){ var on = !!S.dev[i]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-dv="' + i + '" data-k="dv' + i + '">' + d + "</button>"; }).join(""); });
    var h = "";
    C.devices.forEach(function(d, i){
      var x = S.dev[i]; if (!x) return;
      h += '<div class="sq-cmrow"><p><strong>' + d + '</strong> <label class="tiny">in line <select data-dl="' + i + '" aria-label="' + esc("Line where you used " + d) + '"><option value="">choose</option>' + L.map(function(_, k){ return '<option value="' + (k + 1) + '"' + (x.line === k + 1 ? " selected" : "") + ">" + (k + 1) + "</option>"; }).join("") + "</select></label></p>" +
        '<p class="sq-cms"><span>I used</span><input class="txtin" type="text" data-cu="' + i + '" aria-label="I used…" value="' + esc(x.used == null ? d.replace(/ \(.*\)$/, "") : x.used) + '"><span>to show</span><input class="txtin" type="text" data-cs="' + i + '" aria-label="to show…" value="' + esc(x.show || "") + '"></p></div>';
    });
    $("#p3-cm").innerHTML = h || '<p class="tiny muted">Choose devices above.</p>';
  }
  function status(){
    var L = lines(), D = C.devices.map(function(_, i){ return S.dev[i]; }).filter(Boolean), tagged = D.filter(function(x){ return x.line && x.line <= L.length; }).length;
    $("#p3-m").innerHTML = L.length ? L.map(function(l){ var n = lineSyl(l); return "<li>" + esc(l) + ' <span class="tag">' + n + " syllables" + (n === 10 || n === 11 ? " · " + C.metreNote : "") + "</span></li>"; }).join("") : '<li class="muted">Write some lines first.</li>';
    var R = [[!!S.speaker, "Speaker chosen"], [L.length >= C.lines[0] && L.length <= C.lines[1], "Lines: " + L.length + " (aim for " + C.lines[0] + "–" + C.lines[1] + ")"], [C.slots.every(function(s){ return String(S.slots[s.id] || "").trim(); }), "All four parts of the shape written"],
      [tagged >= C.minDev, "Devices tagged to a line: " + tagged + " (at least " + C.minDev + ")"], [D.length > 0 && D.every(function(x){ return String(x.show || "").trim(); }), "A craft → meaning sentence for each device"]];
    $("#p3-st").innerHTML = R.map(function(r){ return '<li class="' + (r[0] ? "yes" : "no") + '"><span class="mk" aria-hidden="true">' + (r[0] ? "✓" : "○") + "</span><span>" + r[1] + "</span></li>"; }).join("");
  }
  function paint(){ $("#p3-par").hidden = S.speaker !== "parody"; paintDev(); status(); }
  host.addEventListener("input", function(e){
    var t = e.target, d = t.dataset;
    if (d.slot) { S.slots[d.slot] = t.value; api.save(); status(); clearTimeout(P3.tm); P3.tm = setTimeout(paintDev, 600); }
    else if (d.cu != null) { S.dev[d.cu].used = t.value; api.save(); }
    else if (d.cs != null) { S.dev[d.cs].show = t.value; api.save(); status(); }
  });
  host.addEventListener("change", function(e){ var d = e.target.dataset; if (d.dl != null) { S.dev[d.dl].line = +e.target.value || null; api.save(); status(); } });
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-dv]"); if (!b) return; var i = +b.dataset.dv; if (S.dev[i]) delete S.dev[i]; else S.dev[i] = { line:null, show:"" }; api.save(); paint(); });
  P3 = { S:S, lines:lines, tm:0 };
  paint();
}
function p3Summary(){
  if (!P3) return [];
  var C = MV.C.part3.studio, S = P3.S, L = P3.lines(); if (!L.length) return ["Soliloquy (Part 3): not written"];
  var sp = C.speakers.filter(function(s){ return s.id === S.speaker; })[0], out = ["Soliloquy (Part 3): " + (sp ? MV.plain(sp.t) : "speaker not chosen")];
  L.forEach(function(l, i){ out.push("    " + (i + 1) + "  " + l); });
  C.devices.forEach(function(d, i){ var x = S.dev[i]; if (x) out.push("  " + d + (x.line ? " (line " + x.line + ")" : "") + (String(x.show || "").trim() ? ": I used " + (x.used == null ? d : x.used) + " to show " + x.show.trim() : "")); });
  return out;
}

// ---------- Practice 2: Scan and interpret (E3 tapper, then an effect question) ----------
function scanAct(host, api, a){
  prep();
  var B = api.S, KEYS = {}; B.it = B.it || {};
  MV.C.explore.keys.forEach(function(k){ KEYS[k.id] = MV.ans(k); });
  function st(id){ return B.it[id] || (B.it[id] = { tries:0, hint:0, marks:[], scanned:false, solved:false, first:null }); }
  function K(it){ return it.key ? KEYS[it.key] : MV.ans(it); }
  function hints(it){ if (it.hints) return it.hints; var k = K(it); return ["Say the line aloud and tap the beat.", "Little words (to, the, of, and) are usually light; let your voice lean on the syllables that matter.", "Stressed: " + listAnd(k.req.map(String)) + (k.opt.length ? " (" + listAnd(k.opt.map(String)) + (k.one ? ": exactly one of them" : k.least ? ": at least one" : ": either way") + ")" : "") + "."]; }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(function(it){ return '<div class="q sq-si" data-vi="' + it.id + '"></div>'; }).join("");
  var taps = {};
  function box(it){ return host.querySelector('[data-vi="' + it.id + '"]'); }
  function paint(it){
    var el = box(it), x = st(it.id), i = a.items.indexOf(it), P = SC.parse(it.line);
    if (!taps[it.id]) {
      el.innerHTML = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt"><strong>(a) Scan</strong> ' + (it.unseen ? '<span class="tag">★ unseen</span> ' : "") + '<span class="tiny muted">' + it.cite + '</span></div></div><div class="sq-stap"></div><div class="sq-sa"></div><div class="sq-sb"></div>';
      taps[it.id] = tapper($(".sq-stap", el), { P:P, get:function(){ return x.marks; }, feet:function(){ return x.scanned ? SC.metre(P, x.marks).bars : []; }, toggle:function(n){ if (x.scanned) return; var k = x.marks.indexOf(n); if (k < 0) x.marks.push(n); else x.marks.splice(k, 1); x.marks.sort(num); x.msg = null; api.save(); paint(it); } });
    }
    var h = "";
    if (!x.scanned) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="scan" data-k="' + it.id + 'chk">Check scan</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(hints(it), x.hint) + (x.msg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg + " Try again.") : "");
    else h += MV.fbHTML("good", "<strong>✓ Scanned.</strong> " + esc(SC.metre(P, x.marks).text) + ". " + esc(SC.metre(P, x.marks).vars) + ".");
    MV.keepFocus($(".sq-sa", el), function(){ $(".sq-sa", el).innerHTML = h; });
    if (x.scanned) MV.keepFocus($(".sq-sb", el), function(){ $(".sq-sb", el).innerHTML = MV.mcHTML({ id:it.id + "e", prompt:"<strong>(b)</strong> What does this line’s rhythm do?", options:it.effects }, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true }); });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-vi]"); if (!el) return;
    var it = a.items.filter(function(q){ return q.id === el.dataset.vi; })[0], x = st(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.act === "scan") { var r = SC.check(x.marks, K(it)); if (r.ok) { x.scanned = true; x.msg = null; } else { x.tries++; x.msg = keyFeedback(SC.parse(it.line), r, K(it), null); } }
    else if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "check") { x.checked = true; if (MV.ok(it.effects[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++; }
    else return;
    api.save(); paint(it);
    if (b.dataset.act === "scan" || b.dataset.act === "check") MV.focusFb(el);
  });
  a.items.forEach(paint);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = st(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = st(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(a.goal)); }); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 03; numbered sentences) ----------
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

// ---------- Performance task: Score the soliloquy — @component E10 deliveryScore (delivery choices on an excerpt: a pause ‖ in a
// gap, an underline on a leaned-on word, a pace marker → / ← in a gap; marks stored as positions, rendered as plain text) ----------
function sentences(t){
  var s = String(t || "").replace(/\s+/g, " ").trim(); if (!s) return [];
  var out = [], re = /[.!?]+[”’"')\]]*\s+(?=[“"‘']?[A-Z])/g, last = 0, m;
  while ((m = re.exec(s))) { var end = m.index + m[0].length; out.push(s.slice(last, end).trim()); last = end; }
  if (last < s.length) out.push(s.slice(last).trim());
  return out.filter(Boolean);
}
var task = (function(){
  var api = null, T = null, sel = null, ta = null;
  function exc(id){ return T.excerpts.filter(function(x){ return x.id === id; })[0]; }
  function exToks(E){
    var s = solById(E.sol), L = s.lines.slice(E.from, E.to + 1), toks = tokLines(L);
    if (E.cut) { var last = -1; toks.forEach(function(t, i){ if (t.line === L.length - 1 && t.t === E.cut && last < 0) last = i; }); if (last >= 0) toks = toks.slice(0, last + 1); }
    toks.forEach(function(t){ t.n = s.start + E.from + t.line; });
    return toks;
  }
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; var E = exc(S.ex), M = E ? (S.m && S.m[E.id]) || {} : {}, toks = E ? exToks(E) : [], note = String(S.note || ""), ss = sentences(note), keys = ss.map(MV.eng.norm);
    var pace = Object.keys(M.f || {}).filter(function(k){ return M.f[k]; });
    return { E:E, toks:toks, p:(M.p || []).filter(function(i){ return i < toks.length; }), e:(M.e || []).filter(function(i){ return i < toks.length; }), f:M.f || {}, pace:pace.length, note:note, n:wc(note), sents:ss, keys:keys,
      tags:(S.tags || []).filter(function(k){ return keys.indexOf(k) >= 0; }), explain:explain() };
  }
  function quotesCited(d){
    if (!d.E) return 0;
    var hay = " " + MV.eng.norm(d.toks.map(function(t){ return t.t; }).join(" ")) + " ", sc = d.E.ref.split(".").slice(0, 2).join("."), n = 0, re = /[“"]([^”"]+)[”"]\s*\(([^()]*?)(\d+)\.(\d+)\.\d+[^()]*\)/g, m;
    while ((m = re.exec(d.note))) { var q = MV.eng.norm(m[1].replace(/\//g, " ")); if (q.split(" ").length >= 2 && hay.indexOf(" " + q + " ") >= 0 && m[3] + "." + m[4] === sc) n++; }
    return n;
  }
  function checks(d){ return [!!d.E, d.p.length >= 4, d.e.length >= 6, d.pace >= 1, d.n >= T.min && d.n <= T.max, quotesCited(d) >= 2, d.tags.length >= 1]; }
  function plainScore(d){
    var out = "", line = -1;
    d.toks.forEach(function(t, i){
      if (t.line !== line) { out += line < 0 ? "" : " / "; line = t.line; } else out += " ";
      out += d.e.indexOf(i) >= 0 ? "_" + t.t + "_" : t.t;
      if (d.p.indexOf(i) >= 0) out += " ‖"; if (d.f[i] === "f") out += " →"; if (d.f[i] === "s") out += " ←";
    });
    return out;
  }
  function paintScore(){
    var S = api.S, d = data(S), el = $("#ds-x");
    if (!d.E) { el.innerHTML = '<p class="tiny muted">Choose an excerpt to score.</p>'; return; }
    var h = '<div class="ds-txt" role="group" aria-label="' + esc("Excerpt " + d.E.id + ": words and the gaps between them") + '">', line = -1, q = sel && sel.a != null ? [Math.min(sel.a, sel.b), Math.max(sel.a, sel.b)] : null;
    d.toks.forEach(function(t, i){
      if (t.line !== line) { h += (line < 0 ? "" : "</div>") + '<div class="ds-l"><span class="sq-n">' + t.n + "</span>"; line = t.line; }
      var em = d.e.indexOf(i) >= 0, inq = q && i >= q[0] && i <= q[1], pa = d.p.indexOf(i) >= 0, f = d.f[i];
      h += '<button type="button" class="ds-w' + (em ? " em" : "") + (inq ? " q" : "") + '" data-dw="' + i + '" tabindex="-1" aria-label="' + esc(t.t + (em ? " (stressed)" : "") + (inq ? ", in quotation" : "")) + '">' + esc(t.t) + "</button>" +
        '<button type="button" class="ds-g' + (pa || f ? " on" : "") + '" data-dg="' + i + '" tabindex="-1" aria-label="' + esc("gap after " + t.t + (pa ? ", pause" : "") + (f === "f" ? ", faster" : f === "s" ? ", slower" : "")) + '">' + (pa ? "‖" : "") + (f === "f" ? "→" : f === "s" ? "←" : "") + "</button>";
    });
    el.innerHTML = h + "</div></div>";
    var all = $$("[data-dw],[data-dg]", el), k = Math.min(api.cur || 0, all.length - 1); if (all[k]) all[k].tabIndex = 0;
  }
  function paintBar(){
    var S = api.S, d = data(S), el = $("#ds-bar");
    var h = '<span class="tiny">' + d.p.length + " pauses · " + d.e.length + " leaned-on words · " + d.pace + " pace change" + (d.pace === 1 ? "" : "s") + "</span>";
    if (S.tool === "quote" && sel && sel.a != null) h += ' <button type="button" class="btn sm" id="ds-ins">Insert quotation</button>';
    if (S.tool === "quote") h += ' <span class="tiny muted">' + (sel && sel.a != null ? (sel.b === sel.a ? "Tap the last word of the quotation, or insert one word." : "") : "Tap the first word of a quotation.") + "</span>";
    el.innerHTML = h;
  }
  function insert(){
    var d = data(api.S), a = Math.min(sel.a, sel.b), b = Math.max(sel.a, sel.b), W = d.toks.slice(a, b + 1), txt = "", line = W[0].line;
    W.forEach(function(t, k){ txt += (k ? (t.line !== line ? " / " : " ") : "") + t.t; line = t.line; });
    txt = txt.replace(/[,;:.!?—]+$/, "");
    var n1 = W[0].n, n2 = W[W.length - 1].n, ref = "(Hamlet " + d.E.ref.split(".").slice(0, 2).join(".") + "." + n1 + (n2 > n1 ? "–" + n2 : "") + ")";
    var s = ta.selectionStart != null ? ta.selectionStart : ta.value.length, e2 = ta.selectionEnd != null ? ta.selectionEnd : s, v = ta.value, pre = v.slice(0, s), lead = pre && !/\s$/.test(pre) ? " " : "";
    ta.value = pre + lead + "“" + txt + "” " + ref + v.slice(e2); var pos = (pre + lead + "“" + txt + "” " + ref).length;
    try { ta.focus(); ta.setSelectionRange(pos, pos); } catch (err) {}
    sel = null; noteChanged(); paintScore(); paintBar();
  }
  function paintTags(){
    var S = api.S, d = data(S), el = $("#ds-tags");
    MV.keepFocus(el, function(){
      el.innerHTML = d.sents.length ? '<ol class="ds-tl">' + d.sents.map(function(s, i){ var on = d.tags.indexOf(d.keys[i]) >= 0; return '<li><span>' + esc(s) + '</span><button type="button" class="chip' + (on ? " on" : "") + '" data-tg="' + i + '" data-k="tg' + i + '" aria-pressed="' + on + '">Character</button></li>'; }).join("") + "</ol>" : '<p class="tiny muted">Your sentences appear here once you write the note.</p>';
    });
  }
  function count(){ var n = wc(ta.value); $("#ds-n").innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + T.min + "–" + T.max; }
  function models(){
    var el = $("#ds-models"); if (!el) return;
    el.innerHTML = checks(data(api.S)).every(Boolean) ? '<details class="alg"><summary>Three model scores (all valid, all different)</summary>' + T.models.map(function(m){ return '<div class="sq-model"><h5>' + m.title + '</h5><p class="tiny"><strong>Score:</strong> ' + m.score + "</p><p>" + m.note + "</p></div>"; }).join("") + "</details>" : "";
  }
  function noteChanged(){ api.S.note = ta.value; count(); paintTags(); api.save(); api.update(); models(); }
  function changed(){ api.save(); api.update(); paintScore(); paintBar(); models(); }
  function mark(kind, i){
    var S = api.S, E = S.ex, M = S.m[E] || (S.m[E] = { p:[], e:[], f:{} });
    if (kind === "pause" || kind === "emph") { var arr = kind === "pause" ? M.p : M.e, k = arr.indexOf(i); if (k < 0) arr.push(i); else arr.splice(k, 1); arr.sort(num); }
    else { var v = kind === "fast" ? "f" : "s"; if (M.f[i] === v) delete M.f[i]; else M.f[i] = v; }
  }
  return {
    render:function(inp, pv, a){
      prep(); api = a; T = MV.C.task; var S = a.S; S.m = S.m || {}; S.tags = S.tags || []; S.tool = S.tool || "pause";
      inp.innerHTML = '<div class="ds"><div id="ds-ex"></div><div id="ds-tool"></div><p class="how">' + T.how + '</p><div id="ds-x"></div><div class="q-actions" id="ds-bar" aria-live="polite"></div>' +
        '<div class="q-actions"><button type="button" class="btn sm" id="ds-play">Listen</button><span class="tiny muted" id="ds-vn"></span></div>' +
        '<div class="jq"><label for="ds-note">Director’s note (' + T.min + "–" + T.max + ' words)</label><textarea id="ds-note" rows="9"></textarea><p class="tiny" id="ds-n" aria-live="polite"></p></div></div>';
      pv.innerHTML = '<h4 style="margin-top:0">Tag the “character” sentence</h4><p class="tiny muted">Mark the sentence that says what your choices show about Hamlet.</p><div id="ds-tags"></div><div id="ds-models"></div>';
      radios($("#ds-ex"), { label:"Excerpt", cls:"chips", options:T.excerpts.map(function(x){ return { id:x.id, t:x.id + " (" + x.ref + ")" }; }), value:S.ex || "", onChange:function(v){ S.ex = v; sel = null; a.cur = 0; changed(); } });
      radios($("#ds-tool"), { label:"Mark tool", cls:"chips", options:T.tools, value:S.tool, onChange:function(v){ S.tool = v; sel = null; a.save(); paintScore(); paintBar(); } });
      ta = $("#ds-note"); ta.value = S.note || ""; count();
      ta.addEventListener("input", noteChanged);
      var x = $("#ds-x");
      x.addEventListener("click", function(e){
        var b = e.target.closest("[data-dw],[data-dg]"); if (!b || !S.ex) return;
        var i = +(b.dataset.dw != null ? b.dataset.dw : b.dataset.dg), isW = b.dataset.dw != null, t = S.tool, all = $$("[data-dw],[data-dg]", x);
        a.cur = all.indexOf(b);
        if (t === "quote") { if (!isW) return; if (!sel || sel.a == null || sel.b !== sel.a) sel = { a:i, b:i }; else sel.b = i; paintScore(); paintBar(); }
        else { mark(t === "emph" ? "emph" : t, i); changed(); }
        var nb = $$("[data-dw],[data-dg]", x)[a.cur]; if (nb) { nb.tabIndex = 0; nb.focus(); }
      });
      x.addEventListener("keydown", function(e){
        var b = e.target.closest("[data-dw],[data-dg]"); if (!b) return; var all = $$("[data-dw],[data-dg]", x), i = all.indexOf(b), d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!d) return; e.preventDefault(); var j = Math.max(0, Math.min(all.length - 1, i + d)); b.tabIndex = -1; all[j].tabIndex = 0; all[j].focus(); a.cur = j;
      });
      inp.addEventListener("click", function(e){
        if (e.target.id === "ds-ins") { insert(); return; }
        if (e.target.id === "ds-play") {
          var b = e.target; if (b.dataset.on) { stopAll(); return; }
          var d = data(S); if (!d.E) return;
          var parts = [], cur = { t:[], rate:1 }, rate = 1;
          d.toks.forEach(function(tk, i){ cur.t.push(tk.t); var p = d.p.indexOf(i) >= 0, f = d.f[i]; if (p || f || i === d.toks.length - 1) { parts.push({ t:cur.t.join(" "), rate:rate, gap:p ? 650 : 60, dur:cur.t.length * 240 / rate }); if (f) rate = f === "f" ? 1.25 : 0.75; cur = { t:[] }; } });
          var segs = parts.slice(); b.dataset.on = "1"; b.textContent = "Stop";
          seq(segs, { off:function(){ delete b.dataset.on; b.textContent = "Listen"; } });
        }
      });
      pv.addEventListener("click", function(e){ var b = e.target.closest("[data-tg]"); if (!b) return; var d = data(S), k = d.keys[+b.dataset.tg], j = S.tags.indexOf(k); if (j < 0) S.tags.push(k); else S.tags.splice(j, 1); paintTags(); a.save(); a.update(); models(); });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      voiceReady(function(v){ $("#ds-vn").textContent = v ? "Reads the excerpt with your pauses and pace changes." : "No local voice here: read it aloud yourself, with your pauses."; if (!v) $("#ds-play").hidden = true; });
      paintScore(); paintBar(); paintTags(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.E ? true : T.tips[0]; },
    checks:checks,
    summary:function(ts){
      prep(); T = T || MV.C.task; var d = data(ts.app || {}), ok = checks(d).every(Boolean), L = [];
      L.push(T.summary + ": " + (ok ? "complete (" + d.E.id + ", " + d.E.ref + ": " + d.p.length + " pauses, " + d.e.length + " leaned-on words, " + d.pace + " pace change" + (d.pace === 1 ? "" : "s") + "; note " + d.n + " words)" : "not complete"));
      if (d.E) L.push("  Scored excerpt (‖ pause, _word_ leaned on, → faster, ← slower): " + plainScore(d));
      L.push("  Director’s note: " + (d.note.trim() ? d.note.trim().replace(/\s+/g, " ") : "(not written yet)"));
      d.tags.forEach(function(k){ L.push("  Tagged “character”: " + d.sents[d.keys.indexOf(k)]); });
      return L;
    }
  };
})();

// ---------- Reflect: @component E15 rehearsalRecorder — optional local recording kept in memory for this session only
// (never saved or sent), playback, and a self-review checklist; plus sample principles, trivium tag, commonplace book ----------
function recorder(host){
  var R = EXS ? (EXS.rec = EXS.rec || {}) : {}, ok = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder), mr = null, url = null;
  var TK = ["pauses where I meant them", "stress on my chosen words", "pace changed once"];
  host.innerHTML = (ok ? '<div class="q-actions"><button type="button" class="btn sm" id="rec-go">Start recording</button><button type="button" class="btn ghost sm" id="rec-pl" disabled>Play back</button><span class="tiny muted" id="rec-st" aria-live="polite"></span></div>'
    : '<p class="tiny muted">Recording isn’t available in this browser. Read an excerpt aloud and tick what you hear.</p>') +
    '<div class="chips" role="group" aria-label="Self-review">' + TK.map(function(t, i){ return '<button type="button" class="chip' + (R[i] ? " on" : "") + '" aria-pressed="' + !!R[i] + '" data-rt="' + i + '">' + t + "</button>"; }).join("") + "</div>";
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.rt != null) { var i = +b.dataset.rt; R[i] = !R[i]; b.setAttribute("aria-pressed", !!R[i]); b.classList.toggle("on", !!R[i]); MV.save(); return; }
    if (b.id === "rec-pl" && url) { new Audio(url).play(); return; }
    if (b.id !== "rec-go") return;
    if (mr && mr.state === "recording") { mr.stop(); return; }
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(stream){
      var chunks = []; mr = new MediaRecorder(stream);
      mr.ondataavailable = function(ev){ chunks.push(ev.data); };
      mr.onstop = function(){ stream.getTracks().forEach(function(t){ t.stop(); }); if (url) URL.revokeObjectURL(url); url = URL.createObjectURL(new Blob(chunks, { type:mr.mimeType || "audio/webm" })); $("#rec-pl").disabled = false; b.textContent = "Record again"; $("#rec-st").textContent = "Recorded (kept in memory only)."; };
      mr.start(); b.textContent = "Stop recording"; $("#rec-st").textContent = "Recording…";
    }).catch(function(){ $("#rec-st").textContent = "The microphone isn’t available. Read aloud and tick what you hear."; });
  });
}
function extras(){
  var Rf = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && Rf.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">Samples only. Always write your own.</p>" + Rf.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  MV.eng.triviumPicker();
  var cp = $("#sq-cp"); if (cp) MV.eng.commonplace(cp, { lines:Rf.art.examples });
  var rc = $("#sq-rec"); if (rc) recorder(rc);
  var steal = $('.mv-block[data-block="steal"]');
  if (steal && !$("#steal-save")) {
    var row = document.createElement("div"); row.className = "q-actions";
    row.innerHTML = '<button type="button" class="btn ghost sm" id="steal-save">Save my imitation to my Ars notebook</button><span class="tiny muted" id="steal-st" aria-live="polite"></span>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || "").trim();
      $("#steal-st").textContent = t ? (MV.eng.saveLine(t, "My imitation of “Thus conscience does make cowards of us all” (Hamlet 3.1.83)") ? "Saved to your Ars notebook." : "") : "Write your imitation first.";
    });
  }
}

MV.module({
  hero:hero,
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ scan:scanAct, spot:spotProse },
  task:task,
  summaryLines:p3Summary,
  onShow:function(v){ stopAll(); if (EX) EX.stop(); if (v !== "start" && HR.stop) HR.stop(); if (v === "explore" && EX) EX.intro(); }
});
})();
