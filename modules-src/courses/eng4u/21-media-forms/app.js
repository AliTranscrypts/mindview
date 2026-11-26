// ENG4U 21 Media Forms & Conventions: hero (two lines inside nested media frames, four form panels, local read-aloud),
// Media deconstructor (Explore: E12 layers / tag and check / remix on the Larchmere practice model; real-example slots),
// Same story, four forms (Part 3: capability grid, content ↔ form board, key concepts), Unseen storyboard (custom: toolkit MC
// items + a written U6), and the "Convention map" task (E12 tag mode + E6 paragraph builder). Data: content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function norm(s){ return MV.eng.norm(MV.plain(String(s || ""))); }

// ---------- @component radioGroup (copied from ENG4U 12; no option needs to be checked) ----------
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
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) { e.stopPropagation(); choose(b.dataset.rg); } });
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

// ---------- tags and layers (shared by Explore and the task) ----------
var TAG = {}, LAY = {};
function initTags(){
  if (Object.keys(TAG).length) return;
  var E = MV.C.explore;
  E.tagGroups.forEach(function(g){ g.tags.forEach(function(t){ TAG[t.id] = { id:t.id, t:t.t, lay:t.lay, g:g.id }; }); });
  E.layers.forEach(function(l){ LAY[l.id] = l; });
}
function exclOf(id){ var E = MV.C.explore.excl; for (var i = 0; i < E.length; i++) if (has(E[i], id)) return E[i]; return null; }
function toggleTag(list, id){
  list = (list || []).slice();
  if (has(list, id)) return list.filter(function(x){ return x !== id; });
  var ex = exclOf(id); if (ex) list = list.filter(function(x){ return !has(ex, x); });
  list.push(id); return list;
}
function tagPill(id){ var t = TAG[id], l = LAY[t.lay]; return '<span class="an-tag ' + l.cls + ' mf-pill">' + l.t + " · " + esc(t.t) + "</span>"; }
function layersOf(tags){ var s = {}; (tags || []).forEach(function(id){ if (TAG[id]) s[TAG[id].lay] = 1; }); return Object.keys(s); }
// @component E12 tag menu — technique tags grouped by kind; toggle buttons (aria-pressed); one per exclusive set
function tagMenuHTML(placed, pre){
  return '<div class="mf-menu">' + MV.C.explore.tagGroups.map(function(g){
    return '<div class="mf-mg" role="group" aria-label="' + esc(g.t) + '"><span class="mf-mgl">' + g.t + "</span>" + g.tags.map(function(t){
      var on = has(placed || [], t.id), l = LAY[t.lay];
      return '<button type="button" class="mf-tagb ' + l.cls + (on ? " on" : "") + '" aria-pressed="' + on + '" data-k="' + pre + t.id + '" data-tag="' + t.id + '">' + esc(t.t) + "</button>";
    }).join("") + "</div>";
  }).join("") + "</div>";
}

// ---------- local voice (read-aloud; no text leaves the device) ----------
var VOICE = null, voiceState = 0, voiceCbs = [];
function voiceReady(fn){
  if (voiceState === 2) { if (fn) fn(VOICE); return; }
  if (fn) voiceCbs.push(fn);
  if (voiceState === 1) return;
  voiceState = 1;
  MV.eng.voice(function(v){ VOICE = v; voiceState = 2; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); });
}

// ---------- Hero: two lines on a dark stage; pull back through phone, magazine, cinema; four form panels ----------
var HR = { run:0, stop:null, say:null };
function panelArt(id){
  if (id === "trailer") return '<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><rect class="mf-pa-o" x="2" y="4" width="56" height="32" rx="3"/><rect class="mf-pa-f" x="2" y="4" width="56" height="5"/><rect class="mf-pa-f" x="2" y="31" width="56" height="5"/><path class="mf-pa-k" d="M25 13 L37 20 L25 27 Z"/></svg>';
  if (id === "podcast") { var r = "", hs = [6, 14, 22, 10, 28, 18, 8, 24, 12, 20, 6]; hs.forEach(function(h, i){ r += '<rect class="mf-pa-k" x="' + (4 + i * 5) + '" y="' + (20 - h / 2) + '" width="3" height="' + h + '" rx="1"/>'; }); return '<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false">' + r + "</svg>"; }
  if (id === "cover") return '<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><rect class="mf-pa-o" x="16" y="1" width="28" height="38" rx="1"/><rect class="mf-pa-k" x="19" y="4" width="22" height="5"/><rect class="mf-pa-f" x="19" y="12" width="22" height="16"/><rect class="mf-pa-k" x="19" y="31" width="16" height="3"/></svg>';
  return '<svg viewBox="0 0 60 40" aria-hidden="true" focusable="false"><rect class="mf-pa-o" x="20" y="1" width="20" height="38" rx="4"/><circle class="mf-pa-k" cx="30" cy="16" r="4"/><rect class="mf-pa-f" x="23" y="27" width="14" height="2"/><rect class="mf-pa-f" x="23" y="31" width="10" height="2"/></svg>';
}
function hero(){
  var H = MV.C.hero, host = $("#mf-hero"); if (!host) return;
  var wi = 0, lineHTML = H.lines.map(function(l){ return l.split(/\s+/).map(function(w){ return '<span class="eng-w" data-wi="' + (wi++) + '">' + esc(w) + "</span>"; }).join(" "); }).join("<br>");
  host.innerHTML = '<div class="mf-hstage"><div class="mf-fr mf-fr-c"><span class="mf-frl">' + H.frames[0] + '</span><div class="mf-fr mf-fr-m"><span class="mf-frl">' + H.frames[1] + '</span><div class="mf-fr mf-fr-p"><span class="mf-frl">' + H.frames[2] + '</span>' +
    '<div class="mf-dark"><span class="mf-spot" aria-hidden="true"></span><p class="mf-hl">' + lineHTML + "</p></div></div></div></div></div>" +
    '<p class="eng-cite">' + H.cite + "</p>" +
    '<div class="mf-panels">' + H.panels.map(function(p, i){ return '<div class="mf-panel" style="--i:' + i + '">' + panelArt(p.id) + "<span>" + p.t + "</span></div>"; }).join("") + "</div>" +
    '<p class="mf-hcap">' + H.caption + '</p><div class="mf-hctl"><button type="button" class="btn ghost sm" id="mf-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="mf-hagain" hidden>' + H.watch + "</button></div>";
  var words = $$(".eng-w", host), nW = words.length, iStage = 4, iPlayers = nW - 1;
  words.forEach(function(w, i){ if (/^stage/i.test(w.textContent)) iStage = i; });
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function reset(){ host.classList.remove("s1", "s2", "s3", "s4", "done"); words.forEach(function(w){ w.classList.remove("speaking", "lit"); }); }
  function finish(){ host.classList.add("s1", "s2", "s3", "s4", "done"); words.forEach(function(w){ w.classList.remove("speaking"); w.classList.add("lit"); }); btns(); }
  function light(i){ words.forEach(function(w, k){ w.classList.toggle("speaking", k === i); if (k <= i) w.classList.add("lit"); }); if (i >= iStage) host.classList.add("s2"); if (i >= iPlayers) host.classList.add("s3"); }
  function animate(){
    var me = ++HR.run; MV.eng.stop(); reset();
    at(me, 100, function(){ host.classList.add("s1"); });
    for (var i = 0; i < nW; i++) (function(i){ at(me, 500 + i * 260, function(){ light(i); }); })(i);
    at(me, 500 + nW * 260 + 900, function(){ host.classList.add("s4"); });
    at(me, 500 + nW * 260 + 1600, finish);
  }
  function listen(){
    if (!VOICE) return;
    var me = ++HR.run; reset(); host.classList.add("s1");
    HR.say = MV.eng.say(MV.plain(H.lines.join(" ")), { voice:VOICE, rate:0.9, onWord:function(i){ if (me === HR.run) light(i); }, onEnd:function(){ if (me === HR.run) finish(); } });
  }
  function btns(){ var l = $("#mf-hlisten"), g = $("#mf-hagain"); if (l) l.hidden = !VOICE; if (g) g.hidden = MV.reduceMotion; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "mf-hlisten") listen(); else if (b.id === "mf-hagain") animate();
  });
  if (MV.reduceMotion) { host.classList.add("rm"); finish(); } else animate();
  voiceReady(btns);
  HR.stop = function(){ MV.eng.stop(); if (!host.classList.contains("done")) { HR.run++; finish(); } };
}

// ---------- @component E12 mediaDeconstructor — layers, tag and check, remix on a storyboard / cue sheet / cover / post ----------
var EX = null;
function textOf(id){ var E = MV.C.explore; return byId(E.practice, id) || byId(E.real, id); }
function isReal(id){ return /^R/.test(id); }
// element layers for overlays: layers of the key and accepted tags (never names the technique)
function elLayers(el){ return layersOf((el.key || []).concat(el.also || [])); }
function elMatches(el, placed){
  placed = placed || [];
  var okSet = (el.key || []).concat(el.also || []);
  return el.key.every(function(k){ return has(placed, k); }) && placed.every(function(p){ return has(okSet, p); });
}
function audState(A){
  var R = MV.C.explore.audience.rows, ch = 0, teen = 0, biz = 0;
  R.forEach(function(r){ var o = byId(r.options, A[r.id]) || r.options[0]; if (o.id !== "def") ch++; if (o.p === "teen") teen++; if (o.p === "biz") biz++; });
  return { ch:ch, teen:teen, biz:biz };
}
function explore(host, api){
  initTags();
  var C = api.content, S = api.S, P = C.practice, RM = C.remix, AU = C.audience;
  S.mode = has(["layers", "tag", "remix"], S.mode) ? S.mode : "layers";
  S.text = textOf(S.text) ? S.text : "R1";
  S.tags = S.tags || {}; S.remix = S.remix || {}; S.aud = S.aud || {}; S.real = S.real || {}; S.rcred = S.rcred || {}; S.checked = S.checked || {};
  S.on = S.on || { image:true, words:false, sound:false, edit:false, design:false };
  Object.keys(RM).forEach(function(k){ if (!byId(RM[k].options, S.remix[k])) S.remix[k] = RM[k].options[0].id; });
  if (!byId(RM.c5.options, S.remix.c5)) S.remix.c5 = "on";
  AU.rows.forEach(function(r){ if (!byId(r.options, S.aud[r.id])) S.aud[r.id] = "def"; });
  var fx = { lock:false, flash:"", stop:null, bedOn:null }, lastPrac = "T1";

  host.innerHTML = '<div class="mf">' +
    '<div class="mf-toprow"><div id="mf-mode"></div></div><p class="how" id="mf-how"></p>' +
    '<div class="mf-texts"><div id="mf-treal"></div><div id="mf-tprac"></div></div>' +
    '<div class="mf-layers" id="mf-layers" role="group" aria-label="Layers"></div>' +
    '<div class="mf-body"><div class="mf-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="mf-head" id="mf-head"></div><div class="mf-canvas" id="mf-canvas"></div>' +
      '<div class="mf-tagbox" id="mf-tagbox"></div><div id="mf-checkrow"></div><div id="mf-aud"></div></div>' +
    '<div class="mf-side"><div class="mf-readbox"><p class="mf-read-h">Readout</p><dl class="read" id="mf-read" aria-live="polite"></dl><div id="mf-stop"></div><p class="mf-aha">' + C.aha + "</p></div></div></div>" +
    '<details class="alg mf-worked"><summary>' + C.workedTitle + "</summary>" + C.worked.map(function(w){ return '<p class="mf-wk"><strong>' + w.t + "</strong><br>" + w.d + "</p>"; }).join("") + "</details></div>";

  var modeR = radios($("#mf-mode"), { label:"Mode", options:C.modes, value:S.mode, disabled:function(){ return fx.lock; }, onChange:function(v){ setMode(v); } });
  var realR = radios($("#mf-treal"), { label:C.realLabel, cls:"chips", options:C.real.map(function(r){ return { id:r.id, t:r.chip }; }), value:isReal(S.text) ? S.text : "",
    disabled:function(){ return fx.lock || S.mode !== "layers"; }, onChange:function(v){ setText(v); } });
  var pracR = radios($("#mf-tprac"), { label:C.practiceLabel, cls:"chips", options:P.map(function(t){ return { id:t.id, t:t.chip }; }), value:isReal(S.text) ? "" : S.text,
    disabled:function(){ return fx.lock; }, onChange:function(v){ setText(v); } });

  function setMode(v){
    S.mode = v; if (v !== "layers" && isReal(S.text)) { S.text = lastPrac; S.sel = null; }
    api.save(); syncRadios(); paint(); MV.changed();
  }
  function setText(v){ S.text = v; if (!isReal(v)) lastPrac = v; S.sel = null; api.save(); syncRadios(); paint(); MV.changed(); }
  function syncRadios(){ modeR.set(S.mode); realR.set(isReal(S.text) ? S.text : ""); pracR.set(isReal(S.text) ? "" : S.text); realR.refresh(); pracR.refresh(); modeR.refresh(); }
  function key(t, e){ return t + ":" + e; }
  function placed(t, e){ return S.tags[key(t, e)] || []; }
  function realEls(t){ return S.real[t] || (S.real[t] = []); }
  function curEls(){ var T = textOf(S.text); return isReal(S.text) ? realEls(S.text) : T.els; }
  function selEl(){ var L = curEls(); for (var i = 0; i < L.length; i++) if (L[i].id === S.sel) return L[i]; return null; }
  function elPic(T, el){
    if (T.id === "T1" && el.id === "F6") return byId(RM.F6.options, S.remix.F6).pic;
    if (T.id === "T4" && el.id === "s2") return byId(RM.s2.options, S.remix.s2).pic;
    if (T.id === "T3" && el.id === "m2") { var f = byId(AU.rows[0].options, S.aud.focal); if (f.id !== "def") return f.t; }
    if (T.id === "T3" && el.id === "m3") { var l = byId(AU.rows[1].options, S.aud.line); return l.t; }
    return el.pic;
  }
  function overlay(tags, lays){
    var h = "";
    MV.C.explore.layers.forEach(function(l){
      if (!S.on[l.id] || !has(lays, l.id)) return;
      var mine = (tags || []).filter(function(id){ return TAG[id] && TAG[id].lay === l.id; });
      h += '<span class="an-tag ' + l.cls + ' mf-pill">' + l.t + (mine.length ? " · " + mine.map(function(id){ return esc(TAG[id].t); }).join(", ") : "") + "</span>";
    });
    return h ? '<span class="mf-ov">' + h + "</span>" : "";
  }
  function elBtn(T, el, cls){
    var tags = placed(T.id, el.id), lays = elLayers(el).concat(layersOf(tags)), chk = S.mode === "tag" && S.checked[T.id], mark = "";
    if (chk && chk[el.id] != null) mark = '<span class="mf-mark ' + (chk[el.id] ? "ok" : "no") + '">' + (chk[el.id] ? "✓ matches" : "✗ check") + "</span>";
    var lit = S.on && lays.some(function(l){ return S.on[l]; });
    var bed = T.id === "T2" && el.id === "c5" ? (S.remix.c5 === "off" ? " mf-off" : "") : "";
    return '<button type="button" class="mf-el ' + (cls || "") + bed + (S.sel === el.id ? " sel" : "") + (lit ? " lit" : "") + (fx.flash === el.id ? " flash" : "") + '" data-el="' + el.id + '" data-k="el' + T.id + el.id + '" aria-pressed="' + (S.sel === el.id) + '">' +
      '<span class="mf-ref">' + el.ref + "</span>" + mark + '<span class="mf-pic">' + (T.id === "T2" && el.id === "c5" && S.remix.c5 === "off" ? "(No music bed: the host speaks over silence)" : elPic(T, el)) + "</span>" +
      (el.snd && T.kind !== "cover" && T.kind !== "post" ? '<span class="mf-snd">' + el.snd + "</span>" : "") + overlay(tags, lays) + "</button>";
  }
  function paintCanvas(){
    var T = textOf(S.text), h = "", cv = $("#mf-canvas");
    if (isReal(S.text)) {
      var R = T, cr = S.rcred[R.id] || {}, filled = R.credit && R.credit.title;
      h += '<div class="mf-slot"><p class="tiny">' + C.realNote + "</p><p><strong>Selection criteria:</strong> " + R.criteria + "</p><p><strong>Your task:</strong> " + R.task + "</p>" +
        (R.desc ? '<div class="mf-desc">' + R.desc + "</div>" : "") +
        '<div class="mf-cred">' + ["title", "maker", "outlet", "date"].map(function(f){ var v = filled ? (R.credit[f] || "") : (cr[f] || ""); return '<label class="mf-fl"><span>' + C.realCredit[f] + '</span><input type="text" data-cred="' + f + '" value="' + esc(v) + '"' + (filled ? " readonly" : "") + "></label>"; }).join("") + "</div>" +
        '<div class="mf-add"><label class="mf-fl mf-grow"><span>' + C.realAdd + '</span><input type="text" id="mf-addin" placeholder="' + esc(C.realAddPh) + '"></label><button type="button" class="btn ghost sm" id="mf-addb">' + C.realAdd + "</button></div></div>";
      var L = realEls(R.id);
      h += '<div class="mf-reallist">' + (L.length ? L.map(function(el){ var tags = el.tags || [];
        return '<button type="button" class="mf-el' + (S.sel === el.id ? " sel" : "") + '" data-el="' + el.id + '" data-k="rel' + el.id + '" aria-pressed="' + (S.sel === el.id) + '"><span class="mf-ref">' + esc(el.label) + '</span><span class="mf-pic">' + (tags.length ? tags.map(tagPill).join(" ") : '<span class="muted">no tags yet</span>') + "</span>" + (el.note ? '<span class="mf-snd">' + esc(el.note) + "</span>" : "") + "</button>"; }).join("") : '<p class="tiny muted">No elements yet. Add a moment, a frame or a part of the page, then tag it.</p>') + "</div>";
    } else if (T.kind === "trailer") {
      h += '<div class="mf-board">' + T.els.map(function(el){ return elBtn(T, el, "mf-frame"); }).join("") + "</div>";
    } else if (T.kind === "podcast") {
      h += '<div class="mf-cues">' + T.els.map(function(el){ return elBtn(T, el, "mf-cue"); }).join("") + "</div>";
    } else if (T.kind === "cover") {
      var typ = S.aud.type === "teen" ? " mf-hand" : "", col = S.aud.colour === "teen" ? " mf-neon" : "", big = S.remix.m3 === "across" ? " mf-across" : "";
      h += '<div class="mf-cover' + typ + col + big + '">' + (S.aud.colour === "teen" ? '<span class="mf-neonlab">neon accents</span>' : "") + T.els.map(function(el){ return elBtn(T, el, "mf-c-" + el.id); }).join("") + "</div>";
    } else {
      h += '<div class="mf-phone"><p class="mf-handle">' + T.title + "</p>" + T.els.map(function(el){ return elBtn(T, el, "mf-p-" + el.id); }).join("") + "</div>";
    }
    MV.keepFocus(cv, function(){ cv.innerHTML = h; });
  }
  function paintTagbox(){
    var T = textOf(S.text), el = selEl(), box = $("#mf-tagbox"), h = "";
    if (!el) h = '<p class="tiny muted">' + (isReal(S.text) ? "Add an element, then tap it to tag it and write your maker’s note." : "Tap an element to " + (S.mode === "remix" ? "remix it." : "tag it.")) + "</p>";
    else if (S.mode === "remix") {
      var rk = remixKey(T, el);
      if (!rk) h = '<p class="tiny muted">No remix for this element. Try frame F6 (T1), the music bed at 0:15 (T2), the main cover line (T3) or the caption’s first line (T4).</p>';
      else h = '<div id="mf-rmx"></div>';
    } else {
      if (isReal(S.text)) h += '<p class="mf-lab">' + esc(el.label) + '</p>';
      else h += '<p class="mf-lab">' + el.ref + "</p>" + (S.mode === "layers" ? '<p class="an-note an-theme mf-maker"><strong>Maker’s note:</strong> ' + el.note + "</p>" : "");
      h += tagMenuHTML(isReal(S.text) ? el.tags : placed(T.id, el.id), "t");
      if (isReal(S.text)) h += '<label class="mf-fl mf-grow"><span>Your maker’s note</span><textarea id="mf-note" rows="2" placeholder="' + esc(C.realNotePh) + '">' + esc(el.note || "") + '</textarea></label><button type="button" class="btn ghost sm" id="mf-delel">Remove this element</button>';
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (el && S.mode === "remix") { var rk2 = remixKey(T, el); if (rk2) radios($("#mf-rmx"), { label:RM[rk2].label, cls:"chips", options:RM[rk2].options, value:S.remix[rk2], disabled:function(){ return fx.lock; }, onChange:function(v){ S.remix[rk2] = v; api.save(); paint(); MV.changed(); } }); }
    if ($("#mf-note")) $("#mf-note").addEventListener("input", function(e){ el.note = e.target.value; api.save(); paintRead(); });
  }
  function remixKey(T, el){ var k = { "T1:F6":"F6", "T2:c5":"c5", "T3:m3":"m3", "T4:s2":"s2" }[T.id + ":" + el.id]; return k || ""; }
  function paintCheck(){
    var box = $("#mf-checkrow"), T = textOf(S.text);
    if (S.mode !== "tag" || isReal(S.text)) { box.innerHTML = ""; return; }
    var chk = S.checked[T.id], h = '<div class="q-actions"><button type="button" class="btn primary sm" id="mf-check">Check my tags</button></div>';
    if (chk) {
      var n = T.els.filter(function(e){ return chk[e.id]; }).length, bad = T.els.filter(function(e){ return !chk[e.id]; });
      h += MV.fbHTML(n === T.els.length ? "good" : "bad", (n === T.els.length ? "<strong>✓ Every element matches the key.</strong>" : "<strong>" + n + " of " + T.els.length + " elements match the key.</strong> Check " + bad.map(function(e){ return e.ref; }).join(", ") + ": an element needs its main convention, and no tag the key rules out."));
    }
    box.innerHTML = h;
  }
  function paintAud(){
    var box = $("#mf-aud");
    if (S.mode !== "remix" || S.text !== "T3") { box.innerHTML = ""; return; }
    var st = audState(S.aud);
    box.innerHTML = '<div class="mf-audbox"><p class="mf-lab">' + AU.label + '</p><p class="tiny muted">' + AU.how + "</p>" + AU.rows.map(function(r){ return '<div data-aud="' + r.id + '"></div>'; }).join("") +
      '<p class="mf-audst" aria-live="polite">' + AU.changes + ": <strong>" + st.ch + "</strong> of 3 · " + AU.teen + ": <strong>" + st.teen + "</strong> · " + AU.biz + ": <strong>" + st.biz + "</strong></p></div>";
    AU.rows.forEach(function(r){ radios($('[data-aud="' + r.id + '"]', box), { label:r.t, cls:"chips", options:r.options, value:S.aud[r.id], disabled:function(){ return fx.lock; }, onChange:function(v){ S.aud[r.id] = v; api.save(); paint(); MV.changed(); } }); });
  }
  function audRead(){ var st = audState(S.aud), R = AU.reads; if (!st.ch) return R.adult; if (st.biz && !st.teen) return R.biz; if (st.teen >= 3 && !st.biz) return R.teen; return R.mixed; }
  function paintRead(){
    var T = textOf(S.text), el = selEl(), RD = C.readout, rows = [];
    rows.push([RD.form, T.form]);
    if (!isReal(S.text)) {
      rows.push([RD.purpose, T.purpose]);
      var aud = S.text === "T3" ? audRead() : T.aud;
      rows.push([RD.aud, aud + (S.text === "T3" && audState(S.aud).ch ? "" : '<span class="mf-evs">' + T.ev.map(function(x){ return '<span class="mf-ev">' + x + "</span>"; }).join("") + "</span>")]);
      var tags = el ? placed(T.id, el.id) : [];
      rows.push([RD.sel, el ? el.ref + (tags.length ? ": " + tags.map(function(id){ return esc(TAG[id].t); }).join(", ") : "") : '<span class="muted">none yet</span>']);
      var rk = el ? remixKey(T, el) : "", sug = el ? (rk ? byId(RM[rk].options, S.remix[rk]).sug : el.sug) : "";
      if (S.mode === "tag") sug = el ? "Tag it, then check it against the key." : "";
      rows.push([RD.sug, sug || '<span class="muted">select an element</span>']);
      var nT = T.els.filter(function(e){ return placed(T.id, e.id).length; }).length;
      rows.push([RD.tags, nT + " of " + T.els.length + " key elements tagged"]);
      rows.push([RD.kc, '<span class="mf-kc">' + (el ? el.kc : "All media are constructions") + "</span>"]);
    } else {
      var L = realEls(T.id), all = [], lays = {};
      L.forEach(function(x){ (x.tags || []).forEach(function(id){ all.push(id); lays[TAG[id].lay] = 1; }); });
      rows.push([RD.sel, el ? esc(el.label) + ((el.tags || []).length ? ": " + el.tags.map(function(id){ return esc(TAG[id].t); }).join(", ") : "") : '<span class="muted">none yet</span>']);
      rows.push([RD.sug, el ? (el.note ? esc(el.note) : '<span class="muted">write your maker’s note</span>') : '<span class="muted">select an element</span>']);
      rows.push([RD.tags, all.length + " tag" + (all.length === 1 ? "" : "s") + " across " + Object.keys(lays).length + " layer" + (Object.keys(lays).length === 1 ? "" : "s")]);
      var cr = T.credit && T.credit.title ? T.credit : (S.rcred[T.id] || {});
      rows.push([RD.credit, cr.title ? MV.plain(T.form).split(" (")[0] + ", <em>" + esc(cr.title) + "</em>, " + esc(cr.maker || "[maker]") + (cr.outlet ? ", " + esc(cr.outlet) : "") + ", " + esc(cr.date || "[date]") : '<span class="muted">fill in the credit: title, maker, outlet, date</span>']);
      rows.push([RD.kc, '<span class="mf-kc">All media are constructions</span>']);
    }
    $("#mf-read").innerHTML = MV.readoutHTML(rows);
    var sb = $("#mf-stop");
    if (S.text === "T4") {
      var v = fx.stop != null ? fx.stop : byId(RM.s2.options, S.remix.s2).stop;
      sb.innerHTML = '<p class="mf-lab">' + C.stopLabel + '</p><div class="mf-bar" role="img" aria-label="' + esc("Thumb-stop model: " + Math.round(v) + " out of 100") + '"><span style="width:' + v + '%"></span></div><p class="tiny muted">' + Math.round(v) + " / 100 · " + C.stopNote + "</p>";
    } else sb.innerHTML = "";
  }
  function paintLayers(){
    var box = $("#mf-layers");
    MV.keepFocus(box, function(){
      box.innerHTML = '<span class="rg-lab">Layers</span>' + C.layers.map(function(l){ var on = !!S.on[l.id]; return '<button type="button" class="an-chip ' + l.cls + '" aria-pressed="' + on + '" data-k="lay' + l.id + '" data-lay="' + l.id + '" title="' + esc(l.d) + '"><i class="an-dot"></i>' + l.t + "</button>"; }).join("");
    });
  }
  function paint(){
    var T = textOf(S.text);
    $("#mf-how").innerHTML = C.modeHow[S.mode];
    $("#mf-head").innerHTML = isReal(S.text) ? "<p><strong>" + T.chip + "</strong>: " + T.form + "</p>" : '<p class="mf-th">' + T.head + "</p>" + '<details class="mf-lm"><summary>About the Larchmere set</summary><p class="tiny">' + C.larchmere + "</p></details>";
    paintLayers(); paintCanvas(); paintTagbox(); paintCheck(); paintAud(); paintRead();
  }
  // events
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.lay) { S.on[b.dataset.lay] = !S.on[b.dataset.lay]; api.save(); paintLayers(); paintCanvas(); return; }
    if (fx.lock) return;
    if (b.dataset.el) { S.sel = S.sel === b.dataset.el ? null : b.dataset.el; api.save(); paintCanvas(); paintTagbox(); paintRead(); return; }
    if (b.dataset.tag) {
      var T = textOf(S.text), el = selEl(); if (!el) return;
      if (isReal(S.text)) el.tags = toggleTag(el.tags, b.dataset.tag);
      else { S.tags[key(T.id, el.id)] = toggleTag(placed(T.id, el.id), b.dataset.tag); delete S.checked[T.id]; }
      api.save(); paintCanvas(); paintTagbox(); paintCheck(); paintRead(); MV.changed(); return;
    }
    if (b.id === "mf-check") {
      var T2 = textOf(S.text), r = {}; T2.els.forEach(function(x){ r[x.id] = elMatches(x, placed(T2.id, x.id)); });
      S.checked[T2.id] = r; api.save(); paintCanvas(); paintCheck(); MV.focusFb($("#mf-checkrow")); return;
    }
    if (b.id === "mf-addb") {
      var inp = $("#mf-addin"), v = (inp.value || "").trim(); if (!v) { inp.focus(); return; }
      var L = realEls(S.text), id = "x" + Date.now().toString(36); L.push({ id:id, label:v.slice(0, 80), tags:[], note:"" }); S.sel = id;
      api.save(); paint(); MV.changed(); return;
    }
    if (b.id === "mf-delel") { S.real[S.text] = realEls(S.text).filter(function(x){ return x.id !== S.sel; }); S.sel = null; api.save(); paint(); MV.changed(); return; }
  });
  host.addEventListener("input", function(e){
    var f = e.target.dataset && e.target.dataset.cred; if (!f) return;
    var c = S.rcred[S.text] || (S.rcred[S.text] = {}); c[f] = e.target.value; api.save(); paintRead();
  });
  host.addEventListener("keydown", function(e){ if (e.target.id === "mf-addin" && e.key === "Enter") { e.preventDefault(); $("#mf-addb").click(); } });
  document.addEventListener("click", function(e){
    var b = e.target.closest(".mf-setup"); if (!b || fx.lock) return;
    var id = b.dataset.setup, set = { tc1:["tag", "T1", "F1"], tc2:["tag", "T2", "c1"], tc3:["remix", "T3", "m2"] }[id]; if (!set) return;
    S.mode = set[0]; S.text = set[1]; lastPrac = set[1]; S.sel = set[2]; api.save(); syncRadios(); paint(); MV.changed();
    var t = $(".mf-body", host); if (t) t.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });
  if (!isReal(S.text)) lastPrac = S.text;
  paint();

  function lockAll(b){ fx.lock = b; modeR.refresh(); realR.refresh(); pracR.refresh(); }
  EX = {
    stop:function(){},
    predict:{
      start:function(p){
        var s = p.start; fx = { lock:false, flash:"", stop:null };
        S.mode = s.mode; S.text = s.text; lastPrac = s.text; S.sel = s.el;
        if (p.id === "p1") S.remix.F6 = "montage";
        if (p.id === "p2") S.remix.c5 = "on";
        if (p.id === "p3") { S.remix.m3 = "bottom"; AU.rows.forEach(function(r){ S.aud[r.id] = "def"; }); }
        if (p.id === "p4") S.remix.s2 = "cancel";
        lockAll(true); api.save(); syncRadios(); paint();
      },
      run:function(p, done){
        var fin = false;
        function finish(){ if (fin) return; fin = true; fx.flash = ""; fx.stop = null; lockAll(false); paint(); MV.changed(); done(); }
        function step(k, v){ S.remix[k] = v; fx.flash = S.sel; api.save(); paint(); }
        setTimeout(finish, 20000); // a safety net: the prediction always finishes
        if (p.id === "p1") {
          MV.wait(500, function(){ step("F6", "lantern");
            MV.wait(2200, function(){ step("F6", "lake"); MV.wait(1600, finish); }); });
        } else if (p.id === "p2") {
          MV.wait(1200, function(){ step("c5", "off"); MV.wait(1800, finish); });
        } else if (p.id === "p3") {
          MV.wait(600, function(){ step("m3", "across"); MV.wait(1800, finish); });
        } else if (p.id === "p4") {
          MV.wait(500, function(){
            S.remix.s2 = "forty"; fx.flash = "s2"; fx.stop = 31; api.save(); paint();
            MV.tween({ dur:1400, step:function(t){ fx.stop = 31 + (78 - 31) * t; paintRead(); }, done:function(){ fx.stop = null; MV.wait(900, finish); } });
          });
        } else finish();
      }
    },
    challenge:function(id, opt){
      var c = byId(C.challenges, id), m = c.msgs, K = MV.ans(c);
      if (id === "tc1" || id === "tc2") {
        var t = id === "tc1" ? "T1" : "T2", ex = id === "tc1" ? MV.C.explore.excl[0] : MV.C.explore.excl[2], ids = Object.keys(K), got = {};
        ids.forEach(function(e){ got[e] = placed(t, e).filter(function(x){ return has(ex, x); })[0] || ""; });
        if (ids.some(function(e){ return !got[e]; })) return { ok:false, msg:m.missing };
        if (id === "tc1") {
          if (got.F1 === "ls") return { ok:false, msg:m.F1 };
          if (got.F3 === "ecu") return { ok:false, msg:m.F3 };
          if (got.F4 === "cu") return { ok:false, msg:m.F4 };
        } else {
          if (got.c2 === "nondieg") return { ok:false, msg:m.c2 };
          if (got.c4 === "dieg") return { ok:false, msg:m.c4 };
        }
        return ids.every(function(e){ return got[e] === K[e]; }) ? { ok:true } : { ok:false, msg:c.general };
      }
      if (id === "tc3") {
        var st = audState(S.aud);
        if (st.biz) return { ok:false, msg:m.biz };
        if (st.ch > 3) return { ok:false, msg:m.over };
        if (st.teen >= 3) { if (!opt || !opt.live) MV.banner("good", MV.plain(c.banner)); return { ok:true }; }
        if (st.teen === 2) return { ok:false, msg:m.two };
        return { ok:false, msg:c.general };
      }
      return { ok:false };
    }
  };
  return EX;
}

// ---------- Part 3: Same story, four forms (real slot, capability grid, content ↔ form board, key concepts) ----------
function part3(host, api){
  var C = api.content, S = api.S, ST = C.stations, F = ST.forms, S1 = ST.s1, S2 = ST.s2, S3 = ST.s3, SL = ST.slot;
  S.grid = S.grid || {}; S.m2 = S.m2 || {}; S.s3 = S.s3 || {}; S.slot = S.slot || {};
  var sel2 = null, msg2 = null;
  host.innerHTML = '<div class="mf-p3">' +
    '<section class="mf-st" aria-labelledby="mf-sl-h"><h3 id="mf-sl-h">' + SL.title + '</h3><p class="how">' + SL.how + "</p>" + (SL.desc ? '<div class="mf-desc">' + SL.desc + (SL.credit ? '<p class="eng-cite">' + SL.credit + "</p>" : "") + "</div>" : '<p class="tiny muted">' + SL.empty + "</p>") +
      '<div class="mf-slotgrid">' + F.map(function(f){ return '<label class="mf-fl"><span>' + f.t + '</span><textarea rows="2" data-slot="' + f.id + '" placeholder="' + esc(SL.ph) + '">' + esc(S.slot[f.id] || "") + "</textarea></label>"; }).join("") + "</div></section>" +
    '<section class="mf-st" aria-labelledby="mf-s1h"><h3 id="mf-s1h">' + S1.title + '</h3><p class="how">' + S1.how + '</p><div id="mf-s1"></div></section>' +
    '<section class="mf-st" aria-labelledby="mf-s2h"><h3 id="mf-s2h">' + S2.title + '</h3><p class="how">' + S2.how + '</p><div id="mf-s2"></div></section>' +
    '<section class="mf-st" aria-labelledby="mf-s3h"><h3 id="mf-s3h">' + S3.title + '</h3><div class="mf-reading">' + S3.reading + '</div><p class="how">' + S3.how + '</p><div id="mf-s3"></div></section></div>';
  var h1 = $("#mf-s1"), h2 = $("#mf-s2"), h3 = $("#mf-s3");
  host.addEventListener("input", function(e){ var f = e.target.dataset && e.target.dataset.slot; if (f) { S.slot[f] = e.target.value; api.save(); } });

  // station 1
  function cell(r, j){ return (S.grid[r.id] || [])[j] || ""; }
  function paint1(){
    var chk = !!S.gridChecked, all = true;
    MV.keepFocus(h1, function(){
      var h = '<div class="tbl-wrap mf-gridwrap"><table class="topic-tbl mf-grid"><thead><tr><th scope="col">Capability</th>' + F.map(function(f){ return '<th scope="col">' + f.t + "</th>"; }).join("") + "</tr></thead><tbody>";
      S1.rows.forEach(function(r){
        var K = MV.ans(r);
        h += '<tr><th scope="row">' + r.t + "</th>" + F.map(function(f, j){
          var v = cell(r, j), good = v === K[j]; if (!good) all = false;
          return "<td>" + '<button type="button" class="mf-cell' + (chk ? (good ? " ok" : " no") : "") + '" data-cell="' + r.id + "|" + j + '" data-k="g' + r.id + j + '" aria-label="' + esc(r.t + ", " + f.t + ": " + (v ? MV.plain(S1.labels[v]) : "not set") + ". Tap to change.") + '">' + (v ? S1.labels[v] : S1.labels.blank) + "</button>" +
            (chk ? '<span class="mf-cwhy">' + (good ? "✓ " : "✗ ") + r.why[j] + "</span>" : "") + "</td>";
        }).join("") + "</tr>";
      });
      h += '</tbody></table></div><div class="q-actions"><button type="button" class="btn primary sm" id="mf-gchk">' + S1.check + '</button><button type="button" class="btn ghost sm" id="mf-greset">' + S1.reset + "</button></div>";
      if (chk) h += MV.fbHTML(all ? "good" : "bad", all ? "<strong>✓</strong> " + S1.done : "<strong>✗ Not yet.</strong> Read the explanation in each ✗ cell, change it, and check again.");
      h1.innerHTML = h;
    });
  }
  h1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.cell) {
      var p = b.dataset.cell.split("|"), r = byId(S1.rows, p[0]), j = +p[1], g = S.grid[r.id] || (S.grid[r.id] = ["", "", "", ""]), cur = g[j], i = r.opts.indexOf(cur);
      g[j] = r.opts[(i + 1) % r.opts.length]; S.gridChecked = false; api.save(); paint1(); return;
    }
    if (b.id === "mf-gchk") { S.gridChecked = true; S.gridTries = (S.gridTries || 0) + 1; api.save(); paint1(); MV.focusFb(h1); return; }
    if (b.id === "mf-greset") { S.grid = {}; S.gridChecked = false; api.save(); paint1(); }
  });

  // station 2
  function formT(id){ return byId(F, id).t; }
  function paint2(){
    var K = MV.ans(S2);
    MV.keepFocus(h2, function(){
      var h = '<div class="mf-s2"><div class="mf-s2c" role="group" aria-label="Kinds of content">' + S2.items.map(function(it){
        var done = S.m2[it.id] === K[it.id];
        return '<button type="button" class="mf-s2i' + (sel2 === it.id ? " sel" : "") + (done ? " done" : "") + '" data-s2i="' + it.id + '" data-k="s2i' + it.id + '" aria-pressed="' + (sel2 === it.id) + '"' + (done ? " disabled" : "") + ">" + it.t + (done ? ' <span class="mf-s2f">→ ' + formT(K[it.id]) + "</span>" : "") + "</button>";
      }).join("") + '</div><div class="mf-s2forms" role="group" aria-label="Forms">' + F.map(function(f){ return '<button type="button" class="btn ghost sm mf-s2b" data-s2f="' + f.id + '" data-k="s2f' + f.id + '"' + (sel2 ? "" : " disabled") + ">" + f.t + "</button>"; }).join("") + "</div></div>";
      if (msg2) h += MV.fbHTML(msg2.k, msg2.h);
      var done = S2.items.filter(function(it){ return S.m2[it.id] === K[it.id]; });
      if (done.length) h += '<ul class="mf-s2done">' + done.map(function(it){ return "<li><strong>" + it.t + " → " + formT(K[it.id]) + ":</strong> “" + S2.why[it.id] + "”</li>"; }).join("") + "</ul>";
      h2.innerHTML = h;
    });
  }
  h2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s2i) { sel2 = sel2 === b.dataset.s2i ? null : b.dataset.s2i; msg2 = null; paint2(); return; }
    if (b.dataset.s2f && sel2) {
      var K = MV.ans(S2), f = b.dataset.s2f, it = byId(S2.items, sel2);
      S.m2tries = S.m2tries || {}; S.m2tries[sel2] = (S.m2tries[sel2] || 0) + 1;
      if (K[sel2] === f) { S.m2[sel2] = f; msg2 = { k:"good", h:"<strong>✓ " + it.t + " → " + formT(f) + ".</strong> " + S2.why[sel2] }; sel2 = null; }
      else msg2 = { k:"bad", h:"<strong>✗ Not the best fit.</strong> " + (S2.partial[sel2 + "|" + f] || S2.wrong) };
      api.save(); paint2(); paint3(); MV.focusFb(h2);
    }
  });

  // station 3
  function paint3(){
    var K2 = MV.ans(S2), K3 = MV.ans(S3), done = S2.items.filter(function(it){ return S.m2[it.id] === K2[it.id]; });
    if (!done.length) { h3.innerHTML = '<p class="tiny muted">Match at least one kind of content to its form in Station 2 first.</p>'; return; }
    h3.innerHTML = done.map(function(it){ return '<div class="mf-s3row" data-s3="' + it.id + '"><p class="mf-lab">' + it.t + " → " + formT(K2[it.id]) + '</p><div class="mf-s3rg"></div><div class="mf-s3fb" aria-live="polite"></div></div>'; }).join("");
    done.forEach(function(it){
      var row = $('[data-s3="' + it.id + '"]', h3);
      function fb(){ var v = S.s3[it.id], box = $(".mf-s3fb", row); if (!v) { box.innerHTML = ""; return; } box.innerHTML = MV.fbHTML(v === K3[it.id] ? "good" : "bad", v === K3[it.id] ? "<strong>✓ Right.</strong> " + S3.why[it.id] : "<strong>✗ Not the best fit.</strong> " + S3.fb[v]); }
      radios($(".mf-s3rg", row), { label:"Key concept", cls:"chips", options:S3.concepts, value:S.s3[it.id] || "", onChange:function(v){ S.s3[it.id] = v; api.save(); fb(); } });
      fb();
    });
  }
  paint1(); paint2(); paint3();

  // Sentence to steal: save the imitation to the commonplace book
  var steal = $('.mv-block[data-block="steal"]'), STL = MV.C.part3.steal;
  if (steal && !$("#mf-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="mf-steal-save">' + STL.save + '</button><span class="tiny muted" id="mf-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "mf-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#mf-steal-st").textContent = "Write your definition first."; return; }
      MV.eng.saveLine(t, "My imitation of " + STL.source + ": “" + STL.master + "”");
      $("#mf-steal-st").textContent = "Saved to your commonplace book.";
    });
  }
  return {};
}

// ---------- Practice 2: Unseen storyboard — toolkit MC items (U1–U5) + a written sentence (U6) checked for structure ----------
function hasConvention(t){
  initTags();
  var n = " " + norm(t) + " ", words = Object.keys(TAG).map(function(k){ return TAG[k].t.replace(/\s*\(.*\)/, ""); }).concat(["shot", "angle", "close up", "music", "sound", "cut", "cuts", "voice over", "chime", "colour", "lighting", "slow motion", "zoom", "narration", "text", "slogan", "logo", "headline", "tagline"]);
  return words.some(function(w){ return n.indexOf(" " + norm(w) + " ") >= 0 || n.indexOf(" " + norm(w) + "s ") >= 0; });
}
function hasVerb(t){ var V = MV.C.task.verbs, ws = norm(t).split(" "); return ws.some(function(w){ return V.some(function(v){ return w.indexOf(v) === 0; }); }); }
function storyboard(host, api, a){
  var st = api.S, W = a.write; st.u6 = st.u6 || { text:"", tries:0, hint:0, passed:false, first:false };
  var u = st.u6;
  host.innerHTML = '<div class="tbl-wrap"><table class="topic-tbl mf-sb"><thead><tr><th scope="col">Frame</th><th scope="col">Picture</th><th scope="col">Sound and text</th></tr></thead><tbody>' +
    a.frames.map(function(f){ return '<tr><th scope="row">' + f[0] + "</th><td>" + f[1] + "</td><td>" + f[2] + "</td></tr>"; }).join("") + "</tbody></table></div>" +
    '<div id="mf-sbmc"></div><div class="q mf-u6" id="mf-u6"></div>';
  var mc = MV.activityTypes.mc($("#mf-sbmc"), { id:a.id, items:a.items, goal:a.goal, how:"" });
  var box = $("#mf-u6");
  function verdict(t){ var n = wc(t); if (n < W.min || n > W.max) return W.len; if (!hasConvention(t)) return W.noConv; if (!hasVerb(t)) return W.bad; return ""; }
  function paint(){
    MV.keepFocus(box, function(){
      var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (a.items.length + 1) + '</span><div class="q-prompt">' + W.prompt + (W.credit ? '<p class="eng-cite">' + W.credit + "</p>" : "") + "</div></div>" +
        '<label class="mf-fl mf-grow"><span>' + W.label + '</span><textarea id="mf-u6t" rows="3"' + (u.passed ? " readonly" : "") + ">" + esc(u.text) + '</textarea></label><p class="tiny muted" id="mf-u6n">' + wc(u.text) + " words</p>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-k="u6c" data-act="u6check"' + (u.passed ? " disabled" : "") + ">" + W.check + "</button>" + MV.hintBtn("u6hint", u.hint) + "</div>" + MV.hintsHTML(W.hints, u.hint);
      if (u.msg != null) h += MV.fbHTML(u.passed ? "good" : "bad", u.passed ? "<strong>✓ Structure check passed.</strong> " + W.good : "<strong>✗ Not yet.</strong> " + u.msg);
      box.innerHTML = h;
    });
  }
  box.addEventListener("input", function(e){ if (e.target.id === "mf-u6t") { u.text = e.target.value; $("#mf-u6n").textContent = wc(u.text) + " words"; MV.save(); } });
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.act === "hint") { u.hint = Math.min(3, u.hint + 1); MV.save(); paint(); return; }
    if (b.dataset.act === "u6check") {
      var v = verdict(u.text);
      if (!v) { u.passed = true; u.first = u.tries === 0 && u.hint < 3; u.msg = ""; } else { u.tries++; u.msg = v; }
      MV.save(); paint(); MV.focusFb(box); MV.changed();
    }
  });
  paint();
  return {
    stats:function(){ var s = mc.stats(), f = s.first + (u.first ? 1 : 0), d = s.done + (u.passed ? 1 : 0), n = a.items.length + 1; return { first:f, total:n, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + n + (d < n ? " (unfinished)" : "") }; },
    missed:function(){ var g = mc.missed(); if (u.tries > 0 || u.hint >= 3) g = g.concat(MV.goalIdx(W.goal)); return g; }
  };
}

// ---------- Performance task: Convention map (E12 tag mode + @component E6 paragraph builder, media references) ----------
var task = (function(){
  var api = null, T = null;
  function practiceT(id){ return byId(MV.C.explore.practice, id); }
  function data(S){
    S = S || {}; T = T || MV.C.task; initTags();
    var pr = practiceT(S.text), real = S.text === "real", cr = S.cred || {}, tagged = [];
    if (pr) pr.els.forEach(function(el){ var tg = (S.tags || {})[pr.id + ":" + el.id] || []; if (tg.length) tagged.push({ label:MV.plain(el.ref), tags:tg }); });
    if (real) (S.rels || []).forEach(function(el){ if ((el.tags || []).length) tagged.push({ label:el.label, tags:el.tags }); });
    var lays = {}; tagged.forEach(function(x){ x.tags.forEach(function(id){ if (TAG[id]) lays[TAG[id].lay] = 1; }); });
    var para = String(S.para || ""), claim = String((S.slots || {}).claim || "").trim();
    if (!claim) { var m1 = para.trim().match(/^[\s\S]*?[.!?](?=\s|$)/); claim = m1 ? m1[0] : para.trim(); }
    return { text:S.text || "", pr:pr, real:real, title:pr ? MV.plain(pr.title) : (cr.title || "").trim(), maker:pr ? "Larchmere practice model" : (cr.maker || "").trim(), platform:(cr.platform || "").trim(), date:pr ? "practice model" : (cr.date || "").trim(),
      tagged:tagged, nLay:Object.keys(lays).length, claim:claim, para:para, n:wc(para), explain:(MV.taskState().explain || "") };
  }
  function refs(t){
    var s = String(t || ""), n = 0;
    n += (s.match(/frame\s+F\d/gi) || []).length + (s.match(/\bR\d\b/g) || []).length + (s.match(/\b\d{1,2}:\d\d\b/g) || []).length;
    var lw = s.toLowerCase(); T.refWords.forEach(function(w){ var i = 0; while ((i = lw.indexOf(w, i)) >= 0) { n++; i += w.length; } });
    return n;
  }
  function concept(t){ var n = " " + norm(t) + " "; return T.concepts.some(function(c){ return n.indexOf(" " + norm(c)) >= 0; }); }
  function checks(d){
    T = T || MV.C.task;
    return [!!d.pr || (d.real && !!d.title && !!d.maker && /\b\d{4}\b/.test(d.date)),
      d.tagged.length >= 4 && d.nLay >= 2,
      !!d.title && norm(d.claim).indexOf(norm(d.title)) >= 0 && hasVerb(d.claim),
      refs(d.para) >= 2,
      concept(d.para),
      d.n >= T.min && d.n <= T.max];
  }
  function paintMap(){
    var S = api.S, box = $("#cm-map"), L = T.labels, pr = practiceT(S.text), real = S.text === "real";
    S.tags = S.tags || {}; S.rels = S.rels || [];
    if (!pr && !real) { box.innerHTML = '<p class="tiny muted">Choose a text first.</p>'; return; }
    var els = pr ? pr.els.map(function(el){ return { id:el.id, label:el.ref, sub:el.pic, tags:S.tags[pr.id + ":" + el.id] || [] }; }) : S.rels.map(function(el){ return { id:el.id, label:esc(el.label), sub:"", tags:el.tags || [] }; });
    var sel = null; els.forEach(function(e){ if (e.id === S.msel) sel = e; });
    MV.keepFocus(box, function(){
      box.innerHTML = '<p class="mf-lab">' + L.map + "</p>" + (real ? '<div class="mf-add"><label class="mf-fl mf-grow"><span>' + L.add + '</span><input type="text" id="cm-addin" placeholder="' + esc(L.addPh) + '"></label><button type="button" class="btn ghost sm" id="cm-addb">' + L.add + "</button></div>" : "") +
        '<div class="mf-mlist">' + els.map(function(e){ return '<button type="button" class="mf-el mf-mini' + (S.msel === e.id ? " sel" : "") + '" data-mel="' + e.id + '" data-k="cm' + e.id + '" aria-pressed="' + (S.msel === e.id) + '"><span class="mf-ref">' + e.label + "</span>" + (e.sub ? '<span class="mf-snd">' + e.sub + "</span>" : "") + (e.tags.length ? '<span class="mf-ov">' + e.tags.map(tagPill).join(" ") + "</span>" : "") + "</button>"; }).join("") + "</div>" +
        (sel ? '<div class="mf-tagbox"><p class="mf-lab">' + sel.label + "</p>" + tagMenuHTML(sel.tags, "c") + (real ? '<button type="button" class="btn ghost sm" id="cm-del">Remove this element</button>' : "") + "</div>" : '<p class="tiny muted">Tap an element to tag it.</p>');
    });
  }
  function paintCred(){
    var S = api.S, box = $("#cm-cred"), L = T.labels, c = S.cred || (S.cred = {});
    if (S.text !== "real") { box.innerHTML = ""; return; }
    box.innerHTML = '<p class="mf-lab">' + L.credit + '</p><div class="mf-cred">' + [["title", L.title], ["maker", L.maker], ["platform", L.platform], ["date", L.date], ["link", L.link]].map(function(f){ return '<label class="mf-fl"><span>' + f[1] + '</span><input type="text" data-cmc="' + f[0] + '" value="' + esc(c[f[0]] || "") + '"></label>'; }).join("") + "</div>";
  }
  function paintPv(){
    var S = api.S, d = data(S), L = T.labels, el = $("#cm-pv"); if (!el) return;
    el.innerHTML = '<h4 class="mf-h">' + L.glance + '</h4><ul class="mf-glance"><li><strong>Text:</strong> ' + (d.title ? "<em>" + esc(d.title) + "</em>" + (d.maker ? ", " + esc(d.maker) : "") + (d.date ? ", " + esc(d.date) : "") : '<span class="muted">not chosen</span>') + "</li>" +
      "<li><strong>Elements tagged:</strong> " + d.tagged.length + " across " + d.nLay + " layer" + (d.nLay === 1 ? "" : "s") + " (at least 4, across 2)</li>" +
      (d.tagged.length ? "<li>" + d.tagged.map(function(x){ return esc(x.label) + ": " + x.tags.map(function(id){ return esc(TAG[id].t); }).join(", "); }).join("; ") + "</li>" : "") +
      "<li><strong>Specific moments referenced:</strong> " + refs(d.para) + " (at least 2)</li><li><strong>Words:</strong> " + d.n + " (aim for " + T.min + "–" + T.max + ")</li></ul>";
    var ok = checks(d).every(Boolean);
    if (ok && !S.modelsSeen) { S.modelsSeen = true; api.save(); }
    $("#cm-models").innerHTML = S.modelsSeen ? '<details class="alg"><summary>' + T.modelsLabel + '</summary><p class="tiny muted">' + T.modelsNote + "</p>" + T.models.map(function(m){ return '<div class="mf-model"><h5>' + m.title + ' <span class="tiny muted">(' + wc(MV.plain(m.text)) + " words)</span></h5><p>" + m.text + "</p></div>"; }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintPv(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; initTags(); var S = a.S, L = T.labels;
      S.slots = S.slots || {};
      inp.innerHTML = '<div class="mf-cm"><div id="cm-text"></div><div id="cm-cred"></div><div id="cm-map" class="mf-cmmap"></div>' +
        '<div class="mf-pb"><p class="mf-lab">' + L.slots + "</p>" + ["claim", "evidence", "analysis", "link2"].map(function(k){ return '<label class="mf-fl mf-grow mf-slot-' + k + '"><span>' + L[k] + '</span><textarea rows="2" data-cms="' + k + '" placeholder="' + esc(MV.plain(T.slotPh[k])) + '">' + esc(S.slots[k] || "") + "</textarea></label>"; }).join("") +
        '<button type="button" class="btn ghost sm" id="cm-join">' + L.join + "</button></div>" +
        '<label class="mf-fl mf-grow"><span>' + L.para + '</span><textarea id="cm-para" rows="9">' + esc(S.para || "") + '</textarea></label><p class="tiny muted" id="cm-n" aria-live="polite"></p></div>';
      pv.innerHTML = '<div id="cm-pv" aria-live="polite"></div><div id="cm-models"></div>';
      var opts = MV.C.explore.practice.map(function(t){ return { id:t.id, t:t.chip }; }).concat([{ id:"real", t:L.real }]);
      radios($("#cm-text"), { label:L.text, cls:"chips", options:opts, value:S.text || "", onChange:function(v){ S.text = v; S.msel = null; paintCred(); paintMap(); changed(); } });
      function count(){ var n = wc(S.para); $("#cm-n").textContent = n + " words (aim for " + T.min + "–" + T.max + ")"; }
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.dataset.cmc) { S.cred = S.cred || {}; S.cred[t.dataset.cmc] = t.value; changed(); return; }
        if (t.dataset.cms) { S.slots[t.dataset.cms] = t.value; changed(); return; }
        if (t.id === "cm-para") { S.para = t.value; count(); changed(); }
      });
      inp.addEventListener("keydown", function(e){ if (e.target.id === "cm-addin" && e.key === "Enter") { e.preventDefault(); $("#cm-addb").click(); } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !inp.contains(b)) return;
        if (b.dataset.mel) { S.msel = S.msel === b.dataset.mel ? null : b.dataset.mel; api.save(); paintMap(); return; }
        if (b.dataset.tag) {
          var pr = practiceT(S.text);
          if (pr) { var k = pr.id + ":" + S.msel; S.tags[k] = toggleTag(S.tags[k], b.dataset.tag); }
          else S.rels.forEach(function(x){ if (x.id === S.msel) x.tags = toggleTag(x.tags, b.dataset.tag); });
          paintMap(); changed(); return;
        }
        if (b.id === "cm-addb") { var inEl = $("#cm-addin"), v = (inEl.value || "").trim(); if (!v) { inEl.focus(); return; } var id = "x" + Date.now().toString(36); S.rels.push({ id:id, label:v.slice(0, 80), tags:[] }); S.msel = id; paintMap(); changed(); return; }
        if (b.id === "cm-del") { S.rels = S.rels.filter(function(x){ return x.id !== S.msel; }); S.msel = null; paintMap(); changed(); return; }
        if (b.id === "cm-join") {
          var parts = ["claim", "evidence", "analysis", "link2"].map(function(k){ return (S.slots[k] || "").trim(); }).filter(Boolean); if (!parts.length) return;
          var j = parts.join(" "), ta = $("#cm-para"); S.para = (S.para || "").trim() ? S.para.replace(/\s*$/, "") + " " + j : j; ta.value = S.para; count(); changed();
        }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      paintCred(); paintMap(); count(); paintPv();
      extras();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return !d.text ? "Choose a text first." : d.para.trim() ? true : "Write your paragraph first."; },
    checks:checks,
    key:function(d){ return (d.title || d.text) + " · " + d.n + " words"; }, label:function(k){ return esc(k); }, text:function(k){ return k; },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.every(Boolean), out = [];
      out.push((T.summary || "Convention map") + ": " + (met ? "complete (" + d.title + ", " + d.n + " words)" : "not complete (checklist " + r.filter(Boolean).length + "/" + r.length + ")"));
      out.push("  Text analysed: " + (d.title || "(not chosen)") + ", " + (d.maker || "(maker or outlet)") + ", " + (d.date || "(date)") + (d.platform ? " (" + d.platform + ")" : ""));
      if (d.real && (S.cred || {}).link) out.push("  Screenshot note or link: " + S.cred.link);
      out.push("  Conventions mapped: " + (d.tagged.length ? d.tagged.map(function(x){ return x.label + " (" + x.tags.map(function(id){ return TAG[id].t; }).join(", ") + ")"; }).join("; ") : "(none yet)"));
      out.push("  Paragraph (for your teacher, " + d.n + " words):");
      out.push("    " + (d.para.trim() || "(not written yet)"));
      return out;
    }
  };
})();

// ---------- Reflect extras (sample principles, word count, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">They show the form. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  if (sheet && art && R.art.intro && !$("#mf-artintro")) { var p = document.createElement("p"); p.id = "mf-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#mf-artn")) {
    var n = document.createElement("p"); n.id = "mf-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app");
  if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.cpLines });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ story:storyboard },
  task:task,
  summaryLines:function(){
    var p = (MV.S.writes["art-principle"] || "").trim(), T = MV.C.task, L = ["New principle: " + (p || "(not written yet)"), "", "Teacher rubric for the convention map (Ontario achievement chart, levels 1–4):"];
    T.rubric.forEach(function(r){ L.push("  " + r[0] + ": L1 " + r[1] + " · L2 " + r[2] + " · L3 " + r[3] + " · L4 " + r[4]); });
    return L;
  },
  onShow:function(v){
    if (v !== "start" && HR.stop) HR.stop();
    if (v === "reflect") extras();
  }
});
})();
