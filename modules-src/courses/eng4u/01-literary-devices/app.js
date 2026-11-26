// ENG4U 01 Literary Devices & Figurative Language: hero read-aloud ("The Eagle"), Device lens (Explore: E2 device lens,
// E1 annotation studio, E4-style effect meter and the "Make it fresh" rebuild), Make the figure (Part 3), the unseen passage,
// Spot the Error for prose, and the "A figure that earns its place" writing task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;

// ---------- @component radioGroup (copied from MDM4U 01 / MHF4U 25; no option needs to be checked) ----------
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

function spanText(toks, w){
  var s = (w || []).slice().sort(function(a, b){ return a - b; }), contig = s.every(function(v, k){ return !k || v === s[k - 1] + 1; });
  var t = function(i){ return toks[i] ? (toks[i].br ? "/" : toks[i].t) : ""; };
  if (s.length === 1 && toks[s[0]] && toks[s[0]].br) return "line break";
  if (contig) { var all = s.map(t); return all.length > 9 ? all.slice(0, 4).join(" ") + " … " + all.slice(-3).join(" ") : all.join(" "); }
  return s.map(t).join(" · ");
}
function stackStyle(roles){ return roles.length > 1 ? ' style="box-shadow:' + roles.map(function(r, k){ return "inset 0 -" + (3 * (k + 1)) + "px 0 var(--an-" + r + ")"; }).join(",") + '"' : ""; }

// ---------- @component E2 deviceLens — lens overlays on a tokenized passage (course plan E2) ----------
// deviceLens(host, {lenses:[{id, label, role}], label, empty}) -> {show(st), word(i)}
//   st = {toks: MV.eng.tokenize(lines, {breaks:true}), devices:[{id, lens, w:[token indices], label, tag, note}], on:{lensId:true},
//         focus:deviceId, pulse:[deviceIds] (pulse animation), fresh:[token indices] (fade-in), crosses:bool (faint grid of
//         crosses behind the text, static with reduced motion), onFocus(id)}
// Each device on an active lens gets its words highlighted in its role colour (stacked underlines where devices overlap),
// a text tag "Lens · device" after its last word (never colour alone) and a one-line effect note. The notes are buttons that
// choose the device the readout shows. word(i) marks token i as being read aloud (−1 clears).
var CROSSES = (function(){
  var g = "";
  for (var r = 0; r < 4; r++) {
    g += '<g class="e2-row" style="animation-delay:' + (r * 0.25) + 's">';
    for (var k = 0; k < 15; k++) { var x = 20 + 40 * k, y = 26 + 40 * r; g += '<path d="M' + x + " " + (y - 13) + "V" + (y + 13) + "M" + (x - 8) + " " + (y - 5) + "H" + (x + 8) + '"/>'; }
    g += "</g>";
  }
  return '<svg class="e2-cross" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.4">' + g + "</g></svg>";
})();
function deviceLens(host, o){
  var L = {}, st = null; o.lenses.forEach(function(l){ L[l.id] = l; });
  host.innerHTML = '<div class="e2"><div class="e2-text" role="group" aria-label="' + esc(o.label || "The line") + '"></div><ul class="e2-notes" aria-label="Devices the lenses show"></ul></div>';
  var box = $(".e2", host), tx = $(".e2-text", host), nt = $(".e2-notes", host);
  nt.addEventListener("click", function(e){ var b = e.target.closest("[data-dev]"); if (b && st && st.onFocus) st.onFocus(b.dataset.dev); });
  function show(s){
    st = s;
    var vis = s.devices.filter(function(d){ return s.on[d.lens]; }), info = s.toks.map(function(){ return { r:[], tags:[], pulse:false }; });
    vis.forEach(function(d){
      var last = -1, r = L[d.lens].role;
      d.w.forEach(function(i){ if (!info[i]) return; if (info[i].r.indexOf(r) < 0) info[i].r.push(r); if ((s.pulse || []).indexOf(d.id) >= 0) info[i].pulse = true; last = Math.max(last, i); });
      if (last >= 0) info[last].tags.push(d);
    });
    var h = "", line = null, first = true;
    s.toks.forEach(function(tk, i){
      if (tk.line !== line) { h += (line === null ? "" : "</span>") + '<span class="e2-line">'; line = tk.line; first = true; }
      var r = info[i].r, cls = "e2-w" + (r.length ? " an an-" + r[0] : "") + (info[i].pulse ? " e2-pulse" : "") + ((s.fresh || []).indexOf(i) >= 0 ? " e2-fresh" : "");
      if (tk.br) { if (r.length) h += ' <span class="' + cls + ' e2-br" data-ti="' + i + '"' + stackStyle(r) + '>↵<span class="vh"> (line break)</span></span>'; }
      else { h += (first ? "" : " ") + '<span class="' + cls + '" data-ti="' + i + '"' + stackStyle(r) + ">" + esc(tk.t) + "</span>"; first = false; }
      info[i].tags.forEach(function(d){ h += '<span class="an-tag an-' + L[d.lens].role + '">' + L[d.lens].label + " · " + d.tag + "</span>"; });
    });
    tx.innerHTML = (s.crosses ? CROSSES : "") + h + (line === null ? "" : "</span>");
    box.classList.toggle("e2-crosses", !!s.crosses);
    var had = nt.contains(document.activeElement) ? document.activeElement.dataset.dev : null;
    nt.innerHTML = vis.length ? vis.map(function(d){
      var role = L[d.lens].role, on = d.id === s.focus;
      return '<li><button type="button" class="an-note an-' + role + ' e2-note" data-dev="' + d.id + '" aria-pressed="' + on + '"><span class="an-tag an-' + role + '">' + L[d.lens].label + "</span><strong>" + d.label + "</strong>: " + d.tag + ". Effect: " + d.note + "</button></li>";
    }).join("") : '<li class="tiny muted e2-none">' + (o.empty || "Switch on a lens to see its devices.") + "</li>";
    if (had) { var nb = nt.querySelector('[data-dev="' + had + '"]'); if (nb) nb.focus({ preventScroll:true }); }
  }
  function word(i){ $$(".e2-w", tx).forEach(function(w){ w.classList.toggle("speaking", +w.dataset.ti === i); }); }
  return { show:show, word:word };
}

// ---------- @component E1 annotationStudio — select words, tag them, check against a key (course plan E1) ----------
// annotationStudio(host, {toks, notes:[] (persisted; mutated in place), menu:{lensId:[device names]}, lenses:[{id, label, role}],
//   parts:[chip texts] | null (tenor / vehicle chips under Figure tags), label, onChange()}) -> {setToks(toks, notes, parts),
//   refresh(), focusMenu(), speaking(i)}
// A note is {w:[token indices], words:[token texts], lens, dev, tenor, vehicle, stale}. Words are chosen with MV.eng.tokens
// (tap, or arrow keys, Shift + arrows and Space; T jumps to the tag menu). Stale notes (the text changed under them) are
// listed but not drawn or checked.
// annotationStudio.check(notes, devices) -> {found:[{d, n}], missed:[d], extra:[n], misnamed:[{d, n}]}: a note matches a key
// device {lens, span:[[a, b], …], accept:[names]} when the lens agrees and its first and last words are each within one word
// of a key span's ends; the device name must be one the key accepts (otherwise it's "misnamed", counted as extra).
function annotationStudio(host, o){
  var L = {}; o.lenses.forEach(function(l){ L[l.id] = l; });
  var toks = o.toks, notes = o.notes, parts = o.parts, sel = [];
  host.innerHTML = '<div class="e1"><div class="e1-toks"></div><p class="tiny muted e1-help">Tap words to select them, or use the arrow keys, Shift + arrow keys and Space. Then press T or choose a tag.</p><div class="e1-menu" role="group" aria-label="Tag the selected words"></div><div class="e1-list"></div></div>';
  var tokHost = $(".e1-toks", host), menu = $(".e1-menu", host), list = $(".e1-list", host);
  function live(){ return notes.filter(function(n){ return !n.stale; }); }
  function marks(){ return live().map(function(n){ return { w:n.w, role:L[n.lens].role, tag:L[n.lens].label + " · " + n.dev }; }); }
  var tk = MV.eng.tokens(tokHost, toks, { label:o.label, marks:marks, onChange:function(s){ sel = s; paintMenu(); }, onKey:function(k){ if (k === "t") focusMenu(); } });
  function paintMenu(){
    if (!sel.length) { menu.innerHTML = '<p class="tiny muted" style="margin:0">Select words to tag them.</p>'; return; }
    MV.keepFocus(menu, function(){
      menu.innerHTML = '<p class="e1-selp"><strong>Selected:</strong> “' + esc(spanText(toks, sel)) + '” <button type="button" class="btn ghost sm" data-e1="clear" data-k="e1clear">Clear selection</button></p>' +
        o.lenses.filter(function(l){ return o.menu[l.id]; }).map(function(l){
          return '<div class="e1-grp"><span class="an-tag an-' + l.role + '">' + l.label + "</span>" + o.menu[l.id].map(function(d){ return '<button type="button" class="chip e1-dev an-' + l.role + '" data-e1tag="' + l.id + "|" + esc(d) + '" data-k="e1t' + l.id + d + '">' + d + "</button>"; }).join("") + "</div>";
        }).join("");
    });
  }
  function partsHTML(n, k){
    if (!parts || n.lens !== "figure" || n.stale) return "";
    return ["tenor", "vehicle"].map(function(p){
      return '<div class="e1-parts" role="group" aria-label="' + (p === "tenor" ? "Tenor" : "Vehicle") + '"><span class="e1-pl">' + (p === "tenor" ? "Tenor:" : "Vehicle:") + "</span>" + parts.map(function(x, j){ var on = n[p] === x; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-e1part="' + k + "|" + p + "|" + j + '" data-k="e1p' + k + p + j + '">' + esc(x) + "</button>"; }).join("") + "</div>";
    }).join("");
  }
  function paintList(){
    MV.keepFocus(list, function(){
      list.innerHTML = '<h4 class="e1-h">What you’ve marked</h4>' + (notes.length ? '<ul class="e1-ul">' + notes.map(function(n, k){
        var role = L[n.lens].role;
        return '<li class="an-note an-' + role + (n.stale ? " e1-stale" : "") + '"><span class="an-tag an-' + role + '">' + L[n.lens].label + " · " + esc(n.dev) + "</span>“" + esc(n.stale ? (n.words || []).join(" ") : spanText(toks, n.w)) + "”" +
          (n.stale ? ' <span class="tiny muted">Your text changed here. Remove this tag and tag the words again.</span>' : "") +
          ' <button type="button" class="linkbtn" data-e1rm="' + k + '" data-k="e1rm' + k + '">Remove</button>' + partsHTML(n, k) + "</li>";
      }).join("") + "</ul>" : '<p class="tiny muted" style="margin:0">Nothing yet.</p>');
    });
  }
  function focusMenu(){ var b = menu.querySelector(".e1-dev"); if (b) b.focus(); }
  function changed(){ tk.paint(); paintList(); if (o.onChange) o.onChange(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.e1 === "clear") { tk.clear(); sel = []; paintMenu(); tk.focus(0); return; }
    if (b.dataset.e1tag) {
      var p = b.dataset.e1tag.split("|"), w = sel.slice();
      notes.push({ w:w, words:w.map(function(i){ return toks[i].t; }), lens:p[0], dev:p[1] });
      var last = w[w.length - 1]; tk.clear(); sel = []; paintMenu(); changed(); tk.focus(last); return;
    }
    if (b.dataset.e1rm != null) { notes.splice(+b.dataset.e1rm, 1); changed(); var nb = list.querySelector("[data-e1rm]"); if (nb) nb.focus(); else tk.focus(0); return; }
    if (b.dataset.e1part) { var q = b.dataset.e1part.split("|"), n = notes[+q[0]], v = parts[+q[2]]; n[q[1]] = n[q[1]] === v ? null : v; paintList(); if (o.onChange) o.onChange(); }
  });
  paintMenu(); paintList();
  return {
    setToks:function(t, n, pa){ toks = t; if (n) notes = n; parts = pa === undefined ? parts : pa; sel = []; tk.setTokens(t); tk.clear(); paintMenu(); paintList(); },
    refresh:function(){ tk.paint(); paintMenu(); paintList(); }, focusMenu:focusMenu, speaking:function(i){ tk.speaking(i); }
  };
}
annotationStudio.check = function(notes, devices){
  function near(n, d){ var a = Math.min.apply(null, n.w), b = Math.max.apply(null, n.w); return d.span.some(function(sp){ return Math.abs(a - sp[0]) <= 1 && Math.abs(b - sp[1]) <= 1; }); }
  var used = {}, found = [], extra = [], close = [];
  notes.forEach(function(n){
    if (n.stale || !n.w.length) return;
    var c = devices.filter(function(d){ return !used[d.id] && d.lens === n.lens && near(n, d); });
    var ex = c.filter(function(d){ return d.accept.indexOf(n.dev) >= 0; })[0];
    if (ex) { used[ex.id] = 1; found.push({ d:ex, n:n }); } else { extra.push(n); if (c[0]) close.push({ d:c[0], n:n }); }
  });
  return { found:found, missed:devices.filter(function(d){ return !used[d.id]; }), extra:extra, misnamed:close.filter(function(m){ return !used[m.d.id]; }) };
};
// Re-anchor notes after the text under them changed: keep the same words at the same place, else the first place the same
// words appear with the same spacing, else mark the note stale (it comes back if the words return).
function reanchor(notes, toks){
  notes.forEach(function(n){
    var seq = n.words || [];
    if (seq.length && n.w.every(function(i, k){ return toks[i] && toks[i].t === seq[k]; })) { n.stale = false; return; }
    var off = n.w.map(function(i){ return i - n.w[0]; });
    for (var s = 0; s < toks.length; s++) if (off.every(function(d, k){ return toks[s + d] && toks[s + d].t === seq[k]; })) { n.w = off.map(function(d){ return s + d; }); n.stale = false; return; }
    n.stale = true;
  });
}

// ---------- read aloud (local voices only, through MV.eng) ----------
var VOICE = null;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; fn(v); }); }

// ---------- hero: "The Eagle", read with the words lighting up (storyboard in the plan) ----------
function hero(){
  var H = MV.C.hero, host = $("#hero-poem"); if (!host) return;
  var LZ = MV.C.explore.lenses;
  host.innerHTML = '<div id="hp-text"></div><div class="hp-ctrl"><button type="button" class="btn primary sm" id="hp-play" hidden>Play reading</button><button type="button" class="btn ghost sm" id="hp-slow" aria-pressed="false" hidden>Slow</button>' +
    (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="hp-replay">Replay the animation</button>') + '<span class="tiny muted" id="hp-note" hidden>Read the line aloud yourself.</span></div>' +
    '<div class="hp-lenses" id="hp-lenses" role="group" aria-label="The five lenses you will use">' + LZ.map(function(l){ return '<span class="an-chip an-' + l.role + '"><i class="an-dot" aria-hidden="true"></i>' + l.label + "</span>"; }).join("") + "</div>";
  MV.eng.passage($("#hp-text"), H.poem, { words:true, cite:H.cite });
  var W = $$("#hp-text .eng-w"), run = 0, slow = false, speech = null;
  function tagAfter(i, role, label){ var t = document.createElement("span"); t.className = "an-tag an-" + role + " hp-tag"; t.textContent = label; W[i].after(t); return t; }
  var tags = { s:tagAfter(H.sound[H.sound.length - 1], "sound", "Sound · /k/") }; H.figure.forEach(function(i){ tags["f" + i] = tagAfter(i, "figure", "Figure"); });
  function reset(){ W.forEach(function(w){ w.classList.add("hp-dim"); w.classList.remove("an", "an-sound", "an-figure", "hp-pulse", "hp-fall", "speaking"); }); Object.keys(tags).forEach(function(k){ tags[k].classList.remove("on"); }); $("#hp-lenses").classList.remove("on"); }
  function light(k, animate){
    var w = W[k]; if (!w) return; w.classList.remove("hp-dim");
    if (H.sound.indexOf(k) >= 0) { w.classList.add("an", "an-sound"); if (animate) w.classList.add("hp-pulse"); if (k === H.sound[H.sound.length - 1]) tags.s.classList.add("on"); }
    if (H.figure.indexOf(k) >= 0) { w.classList.add("an", "an-figure"); tags["f" + k].classList.add("on"); }
    if (k === H.fall && animate) w.classList.add("hp-fall");
  }
  function finish(){ W.forEach(function(w, k){ light(k, false); w.classList.remove("speaking"); }); $("#hp-lenses").classList.add("on"); }
  function animate(rate){
    var me = ++run, t = 400; reset();
    W.forEach(function(w, k){
      var lineEnd = /[;,.]$/.test(w.textContent);
      setTimeout(function(){ if (me === run) light(k, true); }, t / rate);
      t += (190 + 18 * w.textContent.length) + (lineEnd ? 240 : 0) + (k === 20 ? 450 : 0);
    });
    setTimeout(function(){ if (me === run) finish(); }, (t + 300) / rate);
  }
  function play(){
    if (speech) { MV.eng.stop(); return; }
    var me = ++run, got = false, lastK = -1; reset();
    var text = H.poem.filter(function(l){ return l.trim(); }).join(" ");
    $("#hp-play").textContent = "Stop";
    speech = MV.eng.say(text, { voice:VOICE, rate:slow ? 0.7 : 1,
      onWord:function(k){ got = true; if (me !== run) return; for (var j = lastK + 1; j <= k; j++) light(j, !MV.reduceMotion); lastK = Math.max(lastK, k); W.forEach(function(w, j){ w.classList.toggle("speaking", j === k); }); },
      onEnd:function(){ speech = null; $("#hp-play").textContent = "Play reading"; if (me === run) finish(); } });
    // some voices send no word boundaries: then light the words on a timer at the same pace
    setTimeout(function(){ if (!got && speech && me === run && !MV.reduceMotion) { run++; animate(slow ? 0.7 : 1); } }, 900);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "hp-play") play();
    else if (b.id === "hp-slow") { slow = !slow; b.setAttribute("aria-pressed", slow); }
    else if (b.id === "hp-replay") { MV.eng.stop(); animate(1); }
  });
  if (MV.reduceMotion) finish(); else animate(1);
  voiceReady(function(v){ $("#hp-play").hidden = !v; $("#hp-slow").hidden = !v; $("#hp-note").hidden = !!v; });
}

// ---------- Explore: Device lens (E2 + E1 + effect meter) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, R = C.rebuild, CARD = {}, LZ = C.lenses;
  C.cards.forEach(function(c){ CARD[c.id] = c; });
  S.card = CARD[S.card] ? S.card : "L1"; S.mode = ["lens", "hunt", "meter"].indexOf(S.mode) >= 0 ? S.mode : "lens";
  S.lenses = S.lenses || { figure:true }; S.swap = S.swap || {}; S.agree = S.agree || {}; S.hunt = S.hunt || {}; S.res = S.res || {}; S.tc2 = S.tc2 || {}; S.focus = S.focus || {};
  var fx = { pulse:[], fresh:[], crosses:false }, bars = null, tweenStop = null, speech = null, slow = false, studio = null, studioCard = null;
  host.innerHTML = '<div class="dl">' +
    '<div class="dl-gal" id="dl-gal" role="group" aria-label="Line gallery: choose a line"></div>' +
    '<div class="dl-top"><div id="dl-mode"></div><div class="dl-play"><button type="button" class="btn sm" id="dl-play" hidden>Play reading</button><button type="button" class="btn ghost sm" id="dl-slow" aria-pressed="false" hidden>Slow</button><span class="tiny muted" id="dl-vnote" hidden>Read the line aloud yourself.</span></div></div>' +
    '<div class="dl-lenses" id="dl-lenses" role="group" aria-label="Lenses: switch each on or off"></div>' +
    '<div class="dl-body"><div class="dl-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><p class="dl-cite" id="dl-cite"></p>' +
      '<div id="dl-lens"></div>' +
      '<div id="dl-hunt"><div id="dl-hunt-st"></div><div class="q-actions"><button type="button" class="btn primary sm" id="dl-check">Check my annotations</button><button type="button" class="btn ghost sm" id="dl-clear">Clear my tags on this line</button></div><div id="dl-hunt-res" aria-live="polite"></div></div>' +
      '<div id="dl-meter"></div><div id="dl-under"></div></div>' +
    '<div class="dl-read"><p class="dl-read-h">Readout</p><dl class="read" id="dl-read" aria-live="polite"></dl></div></div>' +
    '<div id="dl-rebuild" class="dl-rebuild"></div></div>';
  var lensView = deviceLens($("#dl-lens"), { lenses:LZ, label:"The line, with lens overlays" });
  var modeRG = radios($("#dl-mode"), { label:"Mode", options:[{ id:"lens", t:"Lens" }, { id:"hunt", t:"Hunt" }, { id:"meter", t:"Effect meter" }], value:S.mode, onChange:function(v){ setMode(v); } });
  var LENS = {}; LZ.forEach(function(l){ LENS[l.id] = l; });

  function card(){ return CARD[S.card]; }
  function liked(){ return S.card === "L3" && S.like; }
  function lines(){ return liked() ? card().like.lines : card().lines; }
  function devs(){ return liked() ? card().like.devices : card().devices; }
  function toks(){ return MV.eng.tokenize(lines(), { breaks:true }); }
  function huntToks(){ return MV.eng.tokenize(card().lines, { breaks:true }); }
  function visible(){ return devs().filter(function(d){ return S.lenses[d.lens]; }); }
  function focusDev(){
    if (S.mode === "meter") return devs().filter(function(d){ return d.lens === "figure"; })[0] || null;
    var v = visible(), f = S.focus[S.card];
    return v.filter(function(d){ return d.id === f; })[0] || v[0] || null;
  }
  function shortLine(c){ var w = c.lines.join(" / ").split(" "); return w.length > 6 ? w.slice(0, 5).join(" ") + " …" : w.join(" "); }

  function paintGallery(){
    MV.keepFocus($("#dl-gal"), function(){
      $("#dl-gal").innerHTML = C.cards.map(function(c){ var on = c.id === S.card; return '<button type="button" class="dl-card" data-card="' + c.id + '" data-k="dlc' + c.id + '" aria-pressed="' + on + '"><span class="dl-card-n">' + c.id + '</span><span class="dl-card-t">' + esc(c.lines.join(" / ")) + '</span><span class="dl-card-a">' + c.author + "</span></button>"; }).join("");
    });
  }
  function paintLenses(){
    var el = $("#dl-lenses");
    if (S.mode === "hunt") { el.innerHTML = '<p class="tiny muted" style="margin:0">The lenses are hidden while you hunt. Find the devices yourself, then check.</p>'; return; }
    if (S.mode === "meter") { el.innerHTML = ""; return; }
    MV.keepFocus(el, function(){
      el.innerHTML = LZ.map(function(l){ var on = !!S.lenses[l.id]; return '<button type="button" class="an-chip an-' + l.role + '" data-lens="' + l.id + '" data-k="dll' + l.id + '" aria-pressed="' + on + '"><i class="an-dot" aria-hidden="true"></i>' + l.label + "</button>"; }).join("");
    });
  }
  function paintRead(){
    var c = card(), rows = [["Line", c.cite]];
    if (S.mode === "hunt") {
      rows.push(["Lenses on", "hidden while you hunt"]);
      var r = S.res[S.card]; rows.push(["Hunt score", r ? r.text : "Not checked yet"]);
    } else {
      if (S.mode === "lens") { var on = LZ.filter(function(l){ return S.lenses[l.id]; }).map(function(l){ return l.label; }); rows.push(["Lenses on", on.length ? on.join(", ") : "none"]); }
      var d = focusDev();
      if (S.mode === "meter" && c.swap && S.swap[c.id]) rows.push(["Device", "none: the literal swap"], ["Effect note", "The facts stay; the figure’s picture and feeling are gone."]);
      else if (S.mode === "meter" && !c.swap) rows.push(["Device", "—"]);
      else if (d) {
        rows.push(["Device", d.tag]);
        if (d.tenor) rows.push(["Tenor → vehicle", d.tenor + " → " + d.vehicle], ["Ground (shared qualities)", d.ground]);
        rows.push(["Effect note", d.readEffect || d.note]);
      } else rows.push(["Device", "Switch on a lens to see a device."]);
    }
    $("#dl-read").innerHTML = MV.readoutHTML(rows);
  }
  function paintLens(){
    lensView.show({ toks:toks(), devices:devs(), on:S.lenses, focus:(focusDev() || {}).id, pulse:fx.pulse, fresh:fx.fresh, crosses:S.card === "L6" && !!S.lenses.structure,
      onFocus:function(id){ S.focus[S.card] = id; api.save(); paintLens(); paintRead(); } });
  }
  function huntResult(){
    var c = card(), notes = S.hunt[c.id] || [], r = annotationStudio.check(notes, c.devices), lt = huntToks(), out = [];
    r.found.forEach(function(f){ out.push('<p class="ok">✓ Found: ' + LENS[f.d.lens].label + " · " + f.d.tag + " (“" + f.d.label + "”)" + (f.n.lens === "figure" && c.parts && (f.n.tenor || f.n.vehicle) ? (f.n.tenor === f.d.tenor && f.n.vehicle === f.d.vehicle ? " Tenor and vehicle: ✓" : " Check your tenor and vehicle chips.") : "") + "</p>"); });
    r.misnamed.forEach(function(m){ out.push("<p>◐ “" + esc(spanText(lt, m.n.w)) + "”: right words, but check the device name (you tagged it " + esc(m.n.dev) + ").</p>"); });
    r.extra.filter(function(n){ return !r.misnamed.some(function(m){ return m.n === n; }); }).forEach(function(n){ out.push("<p>✗ Extra: “" + esc(spanText(lt, n.w)) + "” (" + LENS[n.lens].label + " · " + esc(n.dev) + ") isn’t in the key.</p>"); });
    r.missed.forEach(function(d){ if (!r.misnamed.some(function(m){ return m.d === d; })) out.push("<p>○ Still hidden: a " + LENS[d.lens].label + " device.</p>"); });
    var text = r.found.length + " of " + c.devices.length + " found" + (r.extra.length ? " · " + r.extra.length + " extra" : "");
    return { text:text, html:'<div class="fb' + (r.found.length === c.devices.length && !r.extra.length ? " good" : "") + ' dl-res"><p><strong>Hunt score: ' + text + ".</strong></p>" + out.join("") + (r.found.length === c.devices.length ? "<p>Switch to Lens mode to compare with the key’s effect notes.</p>" : "") + "</div>" };
  }
  function paintHunt(){
    var c = card(), notes = S.hunt[c.id] || (S.hunt[c.id] = []);
    if (!studio) studio = annotationStudio($("#dl-hunt-st"), { toks:huntToks(), notes:notes, menu:C.menu, lenses:LZ, parts:c.parts, label:"The line: tap words to select them",
      onChange:function(){ S.res[S.card] = null; $("#dl-hunt-res").innerHTML = ""; api.save(); paintRead(); MV.changed(); } });
    else if (studioCard !== c.id) studio.setToks(huntToks(), notes, c.parts);
    studioCard = c.id;
    $("#dl-hunt-res").innerHTML = S.res[c.id] ? huntResult().html : "";
  }
  function barsHTML(v, other, sw){
    return ["Vividness", "Feeling", "Surprise"].map(function(k, i){
      return '<div class="em-row"><span class="em-lab">' + k + '</span><span class="em-track" aria-hidden="true"><i style="width:' + (v[i] / 5 * 100) + '%"></i><b class="em-ghost" style="left:' + (other[i] / 5 * 100) + '%"></b></span><span class="em-v">' + Math.round(v[i]) + ' / 5 <span class="tiny muted">(' + (sw ? "original" : "literal swap") + ": " + other[i] + ")</span></span></div>";
    }).join("");
  }
  function paintMeter(){
    var c = card(), el = $("#dl-meter");
    if (!c.swap) {
      el.innerHTML = "<p>The Effect meter has a literal swap for four lines. Choose one:</p><div class=\"chips\">" + ["L2", "L3", "L4", "L5"].map(function(id){ return '<button type="button" class="chip" data-card="' + id + '">' + id + ": " + esc(shortLine(CARD[id])) + "</button>"; }).join("") + "</div>";
      return;
    }
    var sw = !!S.swap[c.id], v = bars || c.rate[sw ? 1 : 0];
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="em-pair"><p class="em-line' + (sw ? " em-off" : " em-cur") + '"><span class="em-k">Original' + (sw ? "" : " (showing)") + "</span>" + esc(c.lines.join(" / ")) + '</p><p class="em-line' + (sw ? " em-cur" : " em-off") + '"><span class="em-k">Literal swap' + (sw ? " (showing)" : "") + "</span>" + esc(c.swap) + "</p></div>" +
        '<div class="q-actions"><button type="button" class="btn sm" id="em-swap" data-k="emswap" aria-pressed="' + sw + '">' + (sw ? "Back to the original" : "Literal swap") + "</button></div>" +
        '<div class="em-bars" id="em-bars">' + barsHTML(v, c.rate[sw ? 0 : 1], sw) + "</div>" +
        '<p class="tiny muted em-note">' + C.meterNote + '</p><div id="em-agree"></div><p class="em-aha">' + C.aha + "</p>";
    });
    radios($("#em-agree"), { aria:"Do you agree with these ratings?", cls:"chips", options:[{ id:"agree", t:"Agree" }, { id:"disagree", t:"Disagree" }, { id:"unsure", t:"Not sure" }], value:S.agree[c.id] || "",
      onChange:function(v){ S.agree[c.id] = v; api.save(); } });
  }
  function swapTo(on, done){
    var c = card(); if (!c.swap) { if (done) done(); return; }
    var from = (bars || c.rate[S.swap[c.id] ? 1 : 0]).slice(), to = c.rate[on ? 1 : 0];
    S.swap[c.id] = on; api.save(); if (tweenStop) tweenStop();
    paintMeter(); paintRead();
    tweenStop = MV.tween({ dur:900, step:function(t){ bars = from.map(function(f, i){ return f + (to[i] - f) * t; }); var el = $("#em-bars"); if (el) el.innerHTML = barsHTML(bars, c.rate[on ? 0 : 1], on); },
      done:function(){ bars = null; tweenStop = null; paintMeter(); if (done) done(); } });
  }
  function fxState(){
    var v = R.verbs.filter(function(x){ return x.t === S.tc2.verb; })[0], h = R.vehicles.filter(function(x){ return x.id === S.tc2.veh; })[0];
    var sent = !v && !h ? R.literal : "The traffic " + (v ? v.t : "moved") + (h ? (S.tc2.form === "appos" ? ", a " + h.noun + " of cars." : " like " + h.t + ".") : " slowly.");
    var viv = Math.min(5, (h ? h.viv : 1) + (v ? v.viv : 0));
    var fit = !v || !h ? "choose a verb and a vehicle" : (!v.slow || h.fit === "fast") ? R.fitText.fast : R.fitText[h.fit];
    return { v:v, h:h, sent:sent, viv:viv, fit:fit };
  }
  function paintRebuild(){
    var el = $("#dl-rebuild");
    if (!el.firstChild) {
      el.innerHTML = '<h4 class="fx-h">Make it fresh: rebuild a literal sentence</h4><p>Start from “' + esc(R.literal) + '” Choose a verb and a vehicle.</p><div id="fx-verb"></div><div id="fx-veh"></div><div id="fx-form"></div>' +
        '<p class="fx-out" id="fx-out" aria-live="polite"></p><div class="em-bars" id="fx-bars"></div><dl class="read fx-read" id="fx-read" aria-live="polite"></dl><p class="tiny muted">' + C.meterNote + "</p>";
      radios($("#fx-verb"), { label:"Verb", cls:"chips", options:R.verbs.map(function(x){ return { id:x.t, t:x.t }; }), value:S.tc2.verb || "", onChange:function(v){ S.tc2.verb = v; fxChanged(); } });
      radios($("#fx-veh"), { label:"Vehicle", cls:"chips", options:R.vehicles.map(function(x){ return { id:x.id, t:x.t }; }), value:S.tc2.veh || "", onChange:function(v){ S.tc2.veh = v; fxChanged(); } });
      radios($("#fx-form"), { label:"Shape", cls:"chips", options:[{ id:"like", t:"… like [vehicle]" }, { id:"appos", t:"…, a [vehicle] of cars" }], value:S.tc2.form || "like", onChange:function(v){ S.tc2.form = v; fxChanged(); } });
    }
    var f = fxState();
    $("#fx-out").textContent = f.sent;
    $("#fx-bars").innerHTML = '<div class="em-row"><span class="em-lab">Vividness</span><span class="em-track" aria-hidden="true"><i style="width:' + (f.viv / 5 * 100) + '%"></i></span><span class="em-v">' + f.viv + " / 5</span></div>";
    $("#fx-read").innerHTML = MV.readoutHTML([["Fit", f.fit]]);
  }
  function fxChanged(){ api.save(); paintRebuild(); MV.changed(); }
  function paintUnder(){
    var el = $("#dl-under");
    el.innerHTML = S.mode === "lens" && liked() ? '<div class="q-actions"><button type="button" class="btn ghost sm" id="dl-unlike">Back to Shakespeare’s line</button></div>' : "";
  }
  function paint(){
    paintGallery(); paintLenses();
    $("#dl-cite").innerHTML = card().cite + (liked() ? ' <span class="tag">changed: “like” added</span>' : "");
    $("#dl-lens").hidden = S.mode !== "lens"; $("#dl-hunt").hidden = S.mode !== "hunt"; $("#dl-meter").hidden = S.mode !== "meter"; $("#dl-rebuild").hidden = S.mode !== "meter";
    if (S.mode === "lens") paintLens();
    if (S.mode === "hunt") paintHunt();
    if (S.mode === "meter") { paintMeter(); paintRebuild(); }
    paintUnder(); paintRead(); MV.changed();
  }
  function stopAll(){ MV.eng.stop(); if (tweenStop) { tweenStop(); tweenStop = null; } bars = null; }
  function selectCard(id){ if (!CARD[id]) return; stopAll(); S.card = id; S.like = false; fx = { pulse:[], fresh:[], crosses:false }; api.save(); paint(); }
  function setMode(v){ stopAll(); S.mode = v; modeRG.set(v); fx.pulse = []; fx.fresh = []; api.save(); paint(); }

  // read aloud
  function play(){
    if (speech) { MV.eng.stop(); return; }
    var c = card(), sw = S.mode === "meter" && c.swap && S.swap[c.id], tk = S.mode === "hunt" ? huntToks() : toks(), wmap = [];
    tk.forEach(function(t, i){ if (!t.br && /[A-Za-z0-9]/.test(t.t)) wmap.push(i); });
    var text = sw ? c.swap : tk.filter(function(t){ return !t.br; }).map(function(t){ return t.t; }).join(" ");
    $("#dl-play").textContent = "Stop";
    speech = MV.eng.say(text, { voice:VOICE, rate:slow ? 0.7 : 1,
      onWord:function(k){ var i = sw ? -1 : wmap[k]; if (S.mode === "lens") lensView.word(i); else if (S.mode === "hunt" && studio) studio.speaking(i); },
      onEnd:function(){ speech = null; var b = $("#dl-play"); if (b) b.textContent = "Play reading"; lensView.word(-1); if (studio) studio.speaking(-1); } });
  }
  voiceReady(function(v){ $("#dl-play").hidden = !v; $("#dl-slow").hidden = !v; $("#dl-vnote").hidden = !!v; });

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.card) { selectCard(b.dataset.card); var nb = $('#dl-gal [data-card="' + S.card + '"]'); if (nb && b.closest("#dl-gal")) nb.focus(); return; }
    if (b.dataset.lens) { S.lenses[b.dataset.lens] = !S.lenses[b.dataset.lens]; fx.pulse = []; fx.fresh = []; api.save(); paint(); return; }
    if (b.id === "dl-play") { play(); return; }
    if (b.id === "dl-slow") { slow = !slow; b.setAttribute("aria-pressed", slow); return; }
    if (b.id === "em-swap") { swapTo(!S.swap[card().id]); return; }
    if (b.id === "dl-unlike") { S.like = false; fx.fresh = []; api.save(); paint(); return; }
    if (b.id === "dl-check") { var r = huntResult(); S.res[S.card] = { text:r.text }; api.save(); $("#dl-hunt-res").innerHTML = r.html; paintRead(); MV.focusFb($("#dl-hunt-res")); return; }
    if (b.id === "dl-clear") { var n = S.hunt[S.card]; if (n) n.length = 0; S.res[S.card] = null; api.save(); studio.setToks(huntToks(), n, card().parts); $("#dl-hunt-res").innerHTML = ""; paintRead(); MV.changed(); return; }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    var id = b.dataset.setup;
    if (id === "tc1") { selectCard("L5"); setMode("hunt"); } else if (id === "tc2") setMode("meter"); else if (id === "tc3") { selectCard("L7"); setMode("hunt"); }
    var tgt = id === "tc2" ? $("#dl-rebuild") : $("#ex-app");
    tgt.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc2" ? $("#fx-verb [tabindex='0']") : $("#dl-hunt-st .eng-tok[tabindex='0']"); if (f) f.focus({ preventScroll:true });
  });

  // ---------- target challenges ----------
  function tc1(){
    var fig = (S.hunt.L5 || []).filter(function(x){ return x.lens === "figure" && !x.stale; });
    function core(x){ var a = Math.min.apply(null, x.w), b = Math.max.apply(null, x.w); return a >= 0 && a <= 4 && b >= 4 && b <= 6 && b > a; }
    var met = fig.filter(function(x){ return x.dev === "metaphor" && core(x); })[0];
    if (!met) {
      if (fig.some(function(x){ return x.dev === "simile"; })) return { ok:false, msg:"There’s no “like” or “as”. Dickinson says hope <em>is</em> the thing with feathers." };
      if (fig.some(function(x){ return x.dev === "personification" && x.w.indexOf(9) >= 0; })) return { ok:false, msg:"“Perches” extends the bird metaphor. Tag the main figure first." };
      if (fig.some(function(x){ return x.dev === "implied metaphor" && core(x); })) return { ok:false, msg:"Dickinson states this figure outright: hope <em>is</em> the thing with feathers. Tag it Figure · metaphor." };
      if (fig.some(function(x){ return x.dev === "metaphor"; })) return { ok:false, msg:"Your metaphor tag doesn’t cover the figure. Select from “thing” to “feathers” (or from “Hope”) and tag that." };
      return { ok:false, msg:"In Hunt mode on L5, select the metaphor’s words and tag them Figure · metaphor." };
    }
    if (!met.tenor || !met.vehicle) return { ok:false, msg:"Now name the parts: under your metaphor tag in “What you’ve marked”, choose a tenor and a vehicle." };
    if (met.tenor === "a bird" && met.vehicle === "hope") return { ok:false, msg:"The tenor is what’s being described (hope). The vehicle carries the qualities (the bird)." };
    if (met.tenor !== "hope" || met.vehicle !== "a bird") return { ok:false, msg:"Check your parts. The tenor is what the line is about; the vehicle is what it’s pictured as." };
    return { ok:true };
  }
  function tc2(){
    var f = fxState();
    if (!f.v || !f.h) return { ok:false, msg:"Choose a verb and a vehicle in the rebuild panel (Effect meter mode)." };
    if (f.h.id === "snail") return { ok:false, msg:"It fits, but it’s a cliché. Readers have met “a snail’s pace” too often to see it." };
    if (f.h.id === "lightning") return { ok:false, msg:"Lightning is fast. The figure fights the meaning." };
    if (!f.v.slow) return { ok:false, msg:"“Raced” is fast. The figure fights the meaning." };
    if (f.h.id === "river") return { ok:false, msg:"A river can be slow or fast. Pick a vehicle that’s slow by nature." };
    return f.viv >= 4 && f.fit === R.fitText.slow ? { ok:true } : { ok:false, msg:"Check Vividness and Fit in the rebuild panel." };
  }
  function tc3(){
    var n = (S.hunt.L7 || []).filter(function(x){ return x.lens === "sound" && x.dev === "alliteration" && !x.stale; });
    if (!n.length) return { ok:false, msg:"In Hunt mode on L7, select the words that begin with a /w/ sound and tag them Sound · alliteration." };
    var set = {}; n.forEach(function(x){ x.w.forEach(function(i){ set[i] = 1; }); });
    var got = Object.keys(set).map(Number), want = [0, 5, 8, 10];
    if (set[4]) return { ok:false, msg:"“Dreary” rhymes with “weary” (internal rhyme) but begins with /d/." };
    if (set[1] || set[3] || set[7]) return { ok:false, msg:"Listen to the first sound of each word, not the letter." };
    if (!set[0] && got.length === 3 && want.slice(1).every(function(i){ return set[i]; })) return { ok:false, msg:"Say “Once” aloud. What sound does it start with?" };
    if (got.some(function(i){ return want.indexOf(i) < 0; })) return { ok:false, msg:"Tag only the words that begin with a /w/ sound. Say each one aloud." };
    if (!set[0]) return { ok:false, msg:"Say “Once” aloud. What sound does it start with?" };
    if (want.some(function(i){ return !set[i]; })) return { ok:false, msg:"Some /w/ words are still untagged. Read the line aloud slowly." };
    return { ok:true };
  }

  paint();
  EX = { stop:stopAll };
  return {
    predict:{
      start:function(p){
        stopAll(); fx = { pulse:[], fresh:[], crosses:false };
        if (p.id === "p1") { S.card = "L2"; S.mode = "meter"; S.swap.L2 = false; }
        else if (p.id === "p2") { S.card = "L1"; S.mode = "lens"; S.lenses = {}; }
        else if (p.id === "p3") { S.card = "L3"; S.mode = "lens"; S.like = false; S.lenses = { figure:true }; S.focus.L3 = "L3f"; }
        else if (p.id === "p4") { S.card = "L6"; S.mode = "lens"; S.lenses = {}; }
        if (p.id !== "p3") S.like = false;
        modeRG.set(S.mode); api.save(); paint();
      },
      run:function(p, done){
        if (p.id === "p1") { swapTo(true, function(){ MV.wait(300, done); }); return; }
        if (p.id === "p2") { S.lenses.sound = true; fx.pulse = ["L1s"]; S.focus.L1 = "L1s"; api.save(); paint(); MV.wait(1500, function(){ fx.pulse = []; paint(); done(); }); return; }
        if (p.id === "p3") { S.like = true; fx.fresh = CARD.L3.like.fresh; S.focus.L3 = "L3fl"; api.save(); paint(); MV.wait(1300, function(){ fx.fresh = []; paint(); done(); }); return; }
        if (p.id === "p4") { S.lenses.structure = true; S.focus.L6 = "L6t"; api.save(); paint(); MV.wait(1600, done); return; }
        done();
      }
    },
    challenge:function(id, opt){
      var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false };
      if (id === "tc3" && r.ok && !(opt && opt.live)) { var c = C.challenges.filter(function(x){ return x.id === "tc3"; })[0]; MV.banner("good", MV.plain(c.why)); }
      return r;
    }
  };
}

// ---------- Part 3: Make the figure (three stations) ----------
function cap(s){ s = String(s || "").trim(); return s.charAt(0).toUpperCase() + s.slice(1); }
function clicheHit(text, list){ var t = " " + MV.eng.norm(text) + " "; for (var i = 0; i < list.length; i++) if (t.indexOf(" " + MV.eng.norm(list[i]) + " ") >= 0) return list[i]; return null; }
function part3(host, api){
  var P = api.content.make, S = api.S;
  S.kill = S.kill || {};
  host.innerHTML = '<div class="mk">' +
    '<section class="mk-st" aria-labelledby="mk-h1"><h3 id="mk-h1">Station 1: Metaphor machine</h3><p class="how">Pick a tenor, pick or type a vehicle, then say what they share.</p>' +
      '<div id="mk-tenor"></div><div class="mk-own" id="mk-tenor-ow" hidden><label for="mk-tenor-own">Your own tenor</label><input id="mk-tenor-own" class="txtin" type="text" autocomplete="off"></div>' +
      '<div id="mk-veh"></div><div class="mk-own" id="mk-veh-ow" hidden><label for="mk-veh-own">Your own vehicle</label><input id="mk-veh-own" class="txtin" type="text" autocomplete="off"></div>' +
      '<p class="mk-out" id="mk-out" aria-live="polite"></p>' +
      '<div class="jq"><label for="mk-ground">Ground: what do they share? (At least 3 words.)</label><input id="mk-ground" class="txtin" type="text" autocomplete="off"></div>' +
      '<div class="mk-why"><h4>Why it works</h4>' +
        '<div class="mk-test"><p><strong>Fit</strong> <span id="mk-fit-s"></span></p><div id="mk-fit"></div></div>' +
        '<div class="mk-test"><p><strong>Freshness</strong> <span id="mk-fresh" aria-live="polite"></span></p></div>' +
        '<div class="mk-test"><p><strong>Extension</strong> <label for="mk-ext" id="mk-ext-q"></label></p><input id="mk-ext" class="txtin" type="text" autocomplete="off"><p class="tiny muted" style="margin:4px 0 0">Example: “' + P.extendEx + '”</p></div>' +
      "</div></section>" +
    '<section class="mk-st" aria-labelledby="mk-h2"><h3 id="mk-h2">Station 2: One figure, three forms</h3><p class="how">Your metaphor becomes a simile and a personification. Choose a human verb for the personification.</p>' +
      '<div id="mk-verb"></div><div class="mk-own" id="mk-verb-ow" hidden><label for="mk-verb-own">Your own human verb</label><input id="mk-verb-own" class="txtin" type="text" autocomplete="off"></div>' +
      '<div class="mk-forms" id="mk-forms" aria-live="polite"></div>' +
      '<details class="alg"><summary>Check it with the text</summary><div class="mk-text">' + P.text.map(function(t){ return '<p><span class="tag">' + t.form + "</span> " + t.card + ": " + t.line + " " + t.cite + ' <span class="muted">' + t.note + "</span></p>"; }).join("") + "</div></details></section>" +
    '<section class="mk-st" aria-labelledby="mk-h3"><h3 id="mk-h3">Station 3: Kill the cliché</h3><p class="how">Write a fresh replacement for each cliché that fits the scene. There’s no single right answer, but you must change the vehicle.</p>' +
      P.kill.map(function(k){ return '<div class="mk-kill"><p><strong>“' + k.cliche + "”</strong> · Scene: " + k.scene + '</p><label class="vh" for="mk-' + k.id + '">Your fresh replacement for “' + k.cliche + '” in ' + k.scene + '</label><input id="mk-' + k.id + '" data-kill="' + k.id + '" class="txtin" type="text" autocomplete="off" placeholder="Your fresh figure"><p class="mk-flag tiny" id="mk-' + k.id + '-s" aria-live="polite"></p></div>'; }).join("") +
    "</section></div>";
  var ownT = "own", tenorOpts = P.tenors.map(function(t){ return { id:t, t:t }; }).concat([{ id:ownT, t:"<em>your own</em>" }]);
  radios($("#mk-tenor"), { label:"Tenor", cls:"chips", options:tenorOpts, value:S.tenor || "", onChange:function(v){ S.tenor = v; upd(); } });
  radios($("#mk-veh"), { label:"Vehicle", cls:"chips", options:P.vehicles.map(function(t){ return { id:t, t:t }; }).concat([{ id:ownT, t:"<em>type your own</em>" }]), value:S.veh || "", onChange:function(v){ S.veh = v; upd(); } });
  radios($("#mk-verb"), { label:"Human verb", cls:"chips", options:P.verbs.map(function(t){ return { id:t, t:t }; }).concat([{ id:ownT, t:"<em>your own</em>" }]), value:S.verb || "", onChange:function(v){ S.verb = v; upd(); } });
  radios($("#mk-fit"), { aria:"Fit: does the ground make sense?", cls:"chips", options:[{ id:"yes", t:"Yes, the ground makes sense" }, { id:"no", t:"Not yet" }], value:S.fit || "", onChange:function(v){ S.fit = v; upd(); } });
  [["mk-tenor-own", "tenorOwn"], ["mk-veh-own", "vehOwn"], ["mk-ground", "ground"], ["mk-ext", "ext"], ["mk-verb-own", "verbOwn"]].forEach(function(p){ $("#" + p[0]).value = S[p[1]] || ""; });
  P.kill.forEach(function(k){ $("#mk-" + k.id).value = S.kill[k.id] || ""; });
  host.addEventListener("input", function(e){
    var t = e.target, map = { "mk-tenor-own":"tenorOwn", "mk-veh-own":"vehOwn", "mk-ground":"ground", "mk-ext":"ext", "mk-verb-own":"verbOwn" };
    if (map[t.id]) S[map[t.id]] = t.value; else if (t.dataset.kill) S.kill[t.dataset.kill] = t.value; else return;
    upd();
  });
  function tenor(){ return S.tenor === ownT ? (S.tenorOwn || "").trim() : (S.tenor || ""); }
  function veh(){ return S.veh === ownT ? (S.vehOwn || "").trim() : (S.veh || ""); }
  function verb(){ return S.verb === ownT ? (S.verbOwn || "").trim() : (S.verb || ""); }
  function upd(){
    api.save();
    $("#mk-tenor-ow").hidden = S.tenor !== ownT; $("#mk-veh-ow").hidden = S.veh !== ownT; $("#mk-verb-ow").hidden = S.verb !== ownT;
    var T = tenor(), V = veh(), sent = T && V ? cap(T) + " is " + V + "." : "";
    $("#mk-out").textContent = sent || "Choose a tenor and a vehicle: the machine writes “X is Y.”";
    var gw = MV.eng.wordCount(S.ground);
    $("#mk-fit-s").innerHTML = gw >= 3 ? '<span class="tiny">Ground: ' + gw + " words. Read it against your figure: does it make sense?</span>" : '<span class="tiny muted">Write at least 3 words in the Ground box, then decide.</span>';
    var hit = sent ? clicheHit(sent + " " + (S.ext || ""), P.cliches) : null;
    $("#mk-fresh").innerHTML = !sent ? '<span class="tiny muted">Waiting for your figure.</span>' : hit ? '<span class="mk-warn">⚠ “' + esc(hit) + "” is on the cliché list. " + P.clicheMsg + "</span>" : '<span class="mk-okay">✓ None of the 40 common clichés found.</span>';
    $("#mk-ext-q").textContent = T && V ? "If " + T + " is " + V + ", what else follows?" : "If [tenor] is [vehicle], what else follows?";
    var vb = verb();
    $("#mk-forms").innerHTML = P.forms.map(function(f){
      var line = !T ? "" : f.id === "metaphor" ? (V ? cap(T) + " is " + V + "." : "") : f.id === "simile" ? (V ? cap(T) + " is like " + V + "." : "") : (vb ? cap(T) + " " + vb + "." : "");
      return '<div class="mk-form"><span class="tag">' + f.label + '</span><p class="mk-fl">' + (line ? esc(line) : '<span class="muted tiny">' + (f.id === "personification" ? "Choose a tenor and a human verb." : "Choose a tenor and a vehicle.") + "</span>") + '</p><p class="tiny muted" style="margin:0">' + f.note + "</p></div>";
    }).join("");
    P.kill.forEach(function(k){
      var v = (S.kill[k.id] || "").trim(), el = $("#mk-" + k.id + "-s"), words = MV.eng.norm(v).split(" ");
      if (!v) { el.innerHTML = ""; return; }
      var kept = k.avoid.filter(function(a){ return words.indexOf(a) >= 0; })[0], c2 = clicheHit(v, P.cliches);
      el.innerHTML = kept ? '<span class="mk-warn">⚠ Change the vehicle: your line still uses “' + esc(kept) + "”.</span>" : c2 ? '<span class="mk-warn">⚠ “' + esc(c2) + "” is on the cliché list. " + P.clicheMsg + "</span>" : '<span class="mk-okay">✓ A new vehicle. Does it fit the scene?</span>';
    });
  }
  upd();
  // Sentence to steal: save the imitation to the commonplace book on request
  var steal = $('.mv-block[data-block="steal"]');
  if (steal) {
    var row = document.createElement("div"); row.className = "q-actions";
    row.innerHTML = '<button type="button" class="btn ghost sm" id="steal-save">Save my imitation to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || "").trim();
      $("#steal-st").textContent = t ? (MV.eng.saveLine(t, "My imitation of Sandburg, “Fog”") ? "Saved to your commonplace book." : "") : "Write your imitation first.";
    });
  }
}

// ---------- Practice 2: unseen passage (passage + the toolkit's practice multiple choice) ----------
function unseen(host, api, a){
  host.innerHTML = '<div class="un-pass"></div><div class="un-q"></div>';
  MV.eng.passage($(".un-pass", host), a.passage, { kind:"prose", cite:a.cite });
  return MV.activityTypes.mc($(".un-q", host), a);
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (numbered sentences; toolkit K13 logic) ----------
// a: {id, student, how, summary, problems:[{id, goal, task, steps:[sentences], answer: index of first flawed sentence,
//      stepFb:[…], fixes:[{t, ok, why}], hints:[3]}]}
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

// ---------- Performance task: "A figure that earns its place" (writing area + E1 tagging on the student's own text) ----------
var task = (function(){
  var api = null, studio = null, T = null;
  var LZ = [{ id:"figure", label:"Figure", role:"figure" }, { id:"sound", label:"Sound", role:"sound" }];
  function toksOf(text){ return MV.eng.tokenize(String(text || "").replace(/\r/g, ""), { breaks:false }); }
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; var tk = toksOf(S.text);
    return { form:S.form || "poem", subject:S.subject || "", subjectOwn:S.subjectOwn || "", text:S.text || "", before:S.before || "", toks:tk,
      notes:(S.notes || []).filter(function(n){ return !n.stale; }), explain:explain() };
  }
  function ws(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
  function checks(d){
    var nW = MV.eng.wordCount(d.text), nL = MV.eng.lines(d.text).length;
    var len = d.form === "prose" ? nW >= 30 && nW <= 90 : nL >= 3 && nL <= 6;
    var fig = d.notes.some(function(n){ return n.lens === "figure"; });
    var sim = d.notes.filter(function(n){ return n.lens === "figure" && n.dev === "simile"; }).every(function(n){ var t = spanText(d.toks, n.w); return MV.eng.hasWord(t, "like") || MV.eng.hasWord(t, "as"); });
    var snd = d.notes.filter(function(n){ return n.lens === "sound"; });
    var sound = snd.length >= 1 && snd.filter(function(n){ return n.dev === "alliteration"; }).every(function(n){ return n.w.length >= 2; });
    var before = MV.eng.wordCount(d.before) >= 8 && ws(d.before) !== ws(d.text);
    var terms = (T || MV.C.task).terms.filter(function(t){ return new RegExp("\\b" + t + (t === "image" ? "(s|ry)?" : t === "literal" ? "(ly)?" : "s?") + "\\b", "i").test(d.explain); }).length;
    var craft = MV.eng.wordCount(d.explain) >= 40 && terms >= 2;
    return [!!d.text.trim() && len, fig, !!d.text.trim() && sim, sound, before, craft];
  }
  function counts(){
    var S = api.S, nW = MV.eng.wordCount(S.text), nL = MV.eng.lines(S.text).length;
    $("#pt-count").textContent = nL + " line" + (nL === 1 ? "" : "s") + " · " + nW + " word" + (nW === 1 ? "" : "s") + (S.form === "prose" ? " (prose snapshot: 30–90 words)" : " (poem: 3–6 lines)");
    $("#pt-bcount").textContent = MV.eng.wordCount(S.before) + " words (at least 8)";
  }
  function models(){
    var el = $("#pt-models"); if (!el) return;
    var ok = checks(data(api.S)).every(Boolean);
    el.innerHTML = ok ? '<div class="fb good"><p><strong>✓ ' + T.success + "</strong></p></div>" + T.models.map(function(m){
      return '<details class="alg pt-model"><summary>' + m.title + '</summary><div class="pt-mtext">' + m.text.map(function(l){ return "<p>" + l + "</p>"; }).join("") + "</div><p><strong>Tags:</strong> " + m.tags + "</p><p><strong>Before:</strong> " + m.before + "</p><p><strong>Craft statement:</strong> " + m.craft + "</p></details>";
    }).join("") : "";
  }
  function retag(){ var S = api.S, tk = toksOf(S.text); reanchor(S.notes, tk); studio.setToks(tk, S.notes, null); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; S.notes = S.notes || []; S.form = S.form || "poem";
      inp.innerHTML = '<div id="pt-form"></div><div id="pt-subj"></div><div class="mk-own" id="pt-subj-ow" hidden><label for="pt-subj-own">Your own subject</label><input id="pt-subj-own" class="txtin" type="text" autocomplete="off"></div>' +
        '<div class="jq"><label for="pt-text">Your piece</label><textarea id="pt-text" class="pt-text" spellcheck="true"></textarea><div class="tiny muted" id="pt-count" aria-live="polite"></div></div>' +
        '<div class="jq"><label for="pt-before">“Before”: the plain, literal version</label><textarea id="pt-before" style="min-height:70px"></textarea><div class="tiny muted" id="pt-bcount" aria-live="polite"></div></div>';
      pv.innerHTML = '<h4 style="margin-top:0">Tag your devices</h4><p class="tiny muted">Tap words in your piece, then choose a tag. Tag at least one figure and one sound device.</p><div id="pt-studio"></div><div id="pt-models"></div>';
      radios($("#pt-form"), { label:"Form", cls:"chips", options:T.forms, value:S.form, onChange:function(v){ S.form = v; a.save(); counts(); a.update(); models(); } });
      radios($("#pt-subj"), { label:"Subject", cls:"chips", options:T.subjects.map(function(s){ return { id:s, t:s }; }).concat([{ id:"own", t:"<em>your own</em>" }]), value:S.subject || "",
        onChange:function(v){ S.subject = v; $("#pt-subj-ow").hidden = v !== "own"; a.save(); } });
      $("#pt-subj-ow").hidden = S.subject !== "own";
      $("#pt-text").value = S.text || ""; $("#pt-before").value = S.before || ""; $("#pt-subj-own").value = S.subjectOwn || "";
      reanchor(S.notes, toksOf(S.text));
      studio = annotationStudio($("#pt-studio"), { toks:toksOf(S.text), notes:S.notes, menu:T.menu, lenses:LZ, parts:null, label:"Your piece: tap words to select them",
        onChange:function(){ a.save(); a.update(); models(); MV.paintSummary(); } });
      var timer = null;
      inp.addEventListener("input", function(e){
        var t = e.target;
        if (t.id === "pt-text") { S.text = t.value; clearTimeout(timer); timer = setTimeout(retag, 350); }
        else if (t.id === "pt-before") S.before = t.value;
        else if (t.id === "pt-subj-own") S.subjectOwn = t.value;
        else return;
        a.save(); counts(); a.update(); models();
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); models(); });
      counts(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text.trim() ? true : "Write your piece first."; },
    checks:checks,
    summary:function(ts){
      var S = ts.app || {}, d = data(S), ok = checks(d).every(Boolean), Tk = MV.C.task, L = [];
      var form = (Tk.forms.filter(function(f){ return f.id === d.form; })[0] || {}).t || d.form, subj = d.subject === "own" ? (d.subjectOwn || "your own") : (d.subject || "not chosen");
      L.push(Tk.summary + ": " + (ok ? "complete" : "not complete yet"));
      L.push("  Form: " + form + "; subject: " + subj);
      L.push("  The piece:"); (MV.eng.lines(d.text).length ? d.text.replace(/\r/g, "").split("\n").filter(function(l){ return l.trim(); }) : ["(not written yet)"]).forEach(function(l){ L.push("    " + l.trim()); });
      L.push("  Tags: " + (d.notes.length ? d.notes.map(function(n){ return "“" + spanText(d.toks, n.w) + "” (" + (n.lens === "figure" ? "Figure" : "Sound") + ": " + n.dev + ")"; }).join("; ") : "none"));
      L.push("  Before (literal version): " + (d.before.trim() || "(not written yet)"));
      return L;
    }
  };
})();

// ---------- Reflect extras: sample principles, trivium tag, commonplace book ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) { var d = document.createElement("div"); d.id = "art-samples"; d.className = "art-samples"; d.innerHTML = R.artSamples; sheet.insertBefore(d, art); }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp) MV.eng.commonplace(cp, { lines:R.commonplaceLines.map(MV.plain) });
}

MV.module({
  hero:hero,
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ unseen:unseen, spot:spotProse },
  task:task,
  onShow:function(){ MV.eng.stop(); if (EX) EX.stop(); }
});
})();
