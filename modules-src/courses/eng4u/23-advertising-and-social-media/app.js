// ENG4U 23 Advertising & Social Media Rhetoric: hero (Aristotle's modes become appeal chips that land on a practice ad),
// Rhetoric x-ray (Explore: E12 media deconstructor with appeal and technique tags, E4 word dial, audience lens, feed simulator),
// Disclosure (Part 3: tap-to-sort, real disclosure audit, chip rewrite, ethics ladder), Unseen campaign, Spot the Error (K13),
// and "Persuade, honestly" (E17 draft workspace + E1 tags on the student's own words). Texts and data in content.mjs.
// Class prefix rx- ("rhetoric x-ray"): ad blockers hide generic "ad-" class names, so this module never uses them.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
var ROLE = { ethos:"syntax", pathos:"figure", logos:"image", kairos:"sound", cta:"theme" };
var APN = { ethos:"Ethos", pathos:"Pathos", logos:"Logos", kairos:"Kairos", cta:"Call to action" };

// ---------- @component radioGroup (copied from ENG4U 09; no option needs to be checked) ----------
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

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
function readChunks(chunks, onChunk, onDone){
  var tok = { stopped:false, stop:function(){ tok.stopped = true; MV.eng.stop(); } }, i = 0;
  function next(){
    if (tok.stopped) return;
    if (i >= chunks.length || !VOICE) { if (onChunk) onChunk(-1); if (onDone) onDone(); return; }
    var k = i++; if (onChunk) onChunk(k);
    MV.eng.say(chunks[k], { voice:VOICE, onEnd:function(){ if (tok.stopped) return; setTimeout(next, /;\s*$/.test(chunks[k]) ? 300 : 120); } });
  }
  next();
  return tok;
}
function sayOnce(text){ if (VOICE) MV.eng.say(MV.plain(text), { voice:VOICE }); }

// ---------- @component E12 practice-model illustrations — simple flat original SVGs drawn from colour tokens ----------
function art(id){
  var s = '<svg class="rx-svg" viewBox="0 0 160 90" aria-hidden="true" focusable="false">';
  if (id === "A") s += '<rect class="k-sky" width="160" height="90"/><circle class="k-sun" cx="118" cy="40" r="13"/><rect class="k-lake" y="62" width="160" height="28"/><path class="k-rock" d="M0 70 L40 38 L62 50 L92 30 L128 64 L160 58 L160 90 L0 90Z"/><path class="k-ink" d="M90 30 l0 -9 m0 3 l-4 4 m4 -4 l4 3 m-4 2 l-3 6 m3 -6 l3 6" stroke-width="1.8" fill="none"/><circle class="k-inkf" cx="90" cy="19" r="2.2"/>';
  else if (id === "B") s += '<rect class="k-sky" width="160" height="90"/><rect class="k-rock" y="62" width="160" height="28"/><rect class="k-book" x="96" y="38" width="46" height="9" rx="1"/><rect class="k-book2" x="100" y="47" width="42" height="9" rx="1"/><rect class="k-book" x="94" y="56" width="50" height="7" rx="1"/><ellipse class="k-bowl" cx="44" cy="58" rx="24" ry="9"/><circle class="k-sun" cx="36" cy="52" r="4"/><circle class="k-lake" cx="47" cy="51" r="4"/><circle class="k-book2" cx="55" cy="54" r="3"/><rect class="k-bottle" x="72" y="34" width="14" height="28" rx="3"/><rect class="k-inkf" x="74" y="30" width="10" height="5" rx="1"/>';
  else if (id === "D") s += '<rect class="k-sky" width="160" height="90"/><circle class="k-sun" cx="136" cy="18" r="9"/><rect class="k-lake" y="66" width="160" height="24"/><path class="k-ink" d="M80 66 L80 46 M80 54 l-7 -6 M80 50 l7 -6" stroke-width="2" fill="none"/><circle class="k-leaf" cx="73" cy="47" r="4"/><circle class="k-leaf" cx="87" cy="43" r="4"/><circle class="k-leaf" cx="80" cy="41" r="4"/><circle class="k-inkf" cx="50" cy="30" r="6"/><rect class="k-book2" x="43" y="37" width="14" height="27" rx="4"/><circle class="k-inkf" cx="104" cy="44" r="4.5"/><rect class="k-book" x="99" y="49" width="10" height="16" rx="3"/>';
  else if (id === "E") s += '<rect class="k-grey" width="160" height="90"/><circle class="k-dog" cx="80" cy="50" r="20"/><path class="k-dog2" d="M62 36 l-6 20 l12 -8Z M98 36 l6 20 l-12 -8Z"/><circle class="k-inkf" cx="73" cy="47" r="2.4"/><circle class="k-inkf" cx="87" cy="47" r="2.4"/><ellipse class="k-inkf" cx="80" cy="56" rx="3.5" ry="2.5"/>' +
    [20, 44, 68, 92, 116, 140].map(function(x){ return '<rect class="k-fence" x="' + x + '" y="0" width="4" height="90"/>'; }).join("") + '<rect class="k-fence" y="20" width="160" height="3"/><rect class="k-fence" y="70" width="160" height="3"/>';
  else if (id === "F") s += '<rect class="k-dark" width="160" height="90"/><rect class="k-phone" x="62" y="10" width="36" height="70" rx="6"/><circle class="k-dark" cx="88" cy="20" r="5"/><circle class="k-sun" cx="88" cy="20" r="2"/>';
  else s += '<rect class="k-dark" width="160" height="90"/><rect class="k-bottle" x="68" y="22" width="24" height="46" rx="5"/><path class="k-sun" d="M74 40 h12 v10 h-12z"/>';
  return s + "</svg>";
}

// ---------- hero: Aristotle's three modes lift out as appeal chips and land on practice-model Text A; kairos arrives late ----------
var HR = { run:0, tok:null };
function hero(){
  var H = MV.C.hero, host = $("#rx-hero"); if (!host) return;
  function phraseHTML(p, i){
    var t = esc(p); H.chips.forEach(function(c){ if (c.p === i) t = t.replace(esc(c.phrase), '<span class="rx-hk an an-' + ROLE[c.ap] + '" data-hk="' + c.ap + '">' + esc(c.phrase) + '<span class="rx-lift an-tag an-' + ROLE[c.ap] + '">' + APN[c.ap] + "</span></span>"); });
    return '<span class="rx-ph" data-ph="' + i + '">' + t + "</span>";
  }
  function chip(ap, extra){ return '<span class="rx-land an-tag an-' + ROLE[ap] + '" data-land="' + ap + '">' + APN[ap] + (extra ? " <small>" + extra + "</small>" : "") + "</span>"; }
  host.innerHTML = '<blockquote class="rx-hp">' + H.passage.map(phraseHTML).join(" ") + '</blockquote><p class="eng-cite">' + H.cite + "</p>" +
    '<div class="rx-hcard" aria-hidden="true"><div class="rx-hbn">' + esc(H.banner) + chip("kairos", esc(H.late.note)) + '</div><div class="rx-himg">' + art("A") + chip("pathos") + '</div><p class="rx-hl">Go where the map runs out.</p>' +
    '<p class="rx-hb"><span>Tested on 400 km of Shield trail.' + chip("logos") + '</span> <span>9 out of 10 park staff we asked would wear them again.' + chip("ethos") + '</span></p><p class="rx-htag">Northwick. Made for the north in you.</p></div>' +
    '<p class="rx-hcap">' + H.caption + '</p><div class="rx-hctl"><button type="button" class="btn ghost sm" id="rx-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="rx-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="rx-hnote" hidden>' + H.noVoice + "</span></div>";
  var PH = $$(".rx-ph", host);
  function lit(n, speak){ PH.forEach(function(e, i){ e.classList.toggle("lit", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); }
  function reset(){ host.classList.remove("lift", "land", "late", "cap-on"); host.classList.add("anim"); lit(-1); }
  function finish(){ host.classList.remove("anim"); host.classList.add("lift", "land", "late", "cap-on"); lit(PH.length - 1); PH.forEach(function(e){ e.classList.remove("speaking"); }); btns(); }
  function at(me, ms, fn){ MV.wait(ms, function(){ if (me === HR.run) fn(); }); }
  function animate(){
    var me = ++HR.run; stopRead(); reset();
    PH.forEach(function(_, i){ at(me, 200 + i * 650, function(){ lit(i, true); }); });
    at(me, 2900, function(){ lit(PH.length - 1); host.classList.add("lift"); });
    at(me, 3700, function(){ host.classList.add("land"); });
    at(me, 4700, function(){ host.classList.add("late"); });
    at(me, 5400, finish);
  }
  function stopRead(){ if (HR.tok) { HR.tok.stop(); HR.tok = null; } }
  function listen(){
    var me = ++HR.run; stopRead();
    if (MV.reduceMotion) finish(); else reset();
    HR.tok = readChunks(H.passage, function(k){ if (me !== HR.run) return; if (k >= 0) lit(k, true); }, function(){ HR.tok = null; if (me === HR.run) finish(); });
  }
  function btns(){ $("#rx-hlisten").hidden = !VOICE; $("#rx-hagain").hidden = MV.reduceMotion; $("#rx-hnote").hidden = !!VOICE; }
  $("#rx-hlisten").addEventListener("click", listen);
  $("#rx-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ stopRead(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
  // Word story read-aloud (local voice only)
  var ws = $("#rx-ws-listen");
  if (ws) { voiceReady(function(){ ws.hidden = !VOICE; }); ws.addEventListener("click", function(){ var sh = ws.closest(".sheet") || ws.parentNode.parentNode; sayOnce(sh.textContent.replace(/Listen\s*$/, "")); }); }
}

// ---------- @component E12 mediaDeconstructor + E4 wordDial + audienceLens + feedSimulator (Explore: Rhetoric x-ray) ----------
var EX = null, EXS = null;
function feedScore(F, card, sig){
  var gated = card.gate && sig.age === card.gate, m = [];
  if (gated) return { score:0, m:[], gated:true };
  if (card.ages === "all") m.push({ t:"Age " + sig.age + " (broad targeting)", p:F.pts.age });
  else if (sig.age && has(card.ages, sig.age)) m.push({ t:"Age " + sig.age, p:F.pts.age });
  (sig.ints || []).forEach(function(i){ if (has(card.ints, i)) m.push({ t:"liked: " + i, p:F.pts.interest }); });
  if (sig.search && sig.search === card.search) m.push({ t:"searched “" + sig.search + "”", p:F.pts.search });
  if (sig.time && sig.time === card.time) m.push({ t:sig.time, p:F.pts.time });
  return { score:m.reduce(function(s, x){ return s + x.p; }, 0), m:m };
}
function feedRank(F, sig){
  var r = F.cards.map(function(c, i){ var s = feedScore(F, c, sig); return { c:c, i:i, score:s.score, m:s.m, gated:s.gated }; });
  return r.slice().sort(function(a, b){ return (b.score - a.score) || (a.i - b.i); });
}
function explore(host, api){
  var C = api.content, S = api.S; EXS = S;
  var T = C.texts, FD = C.feed, DL = C.dial, LN = C.lens;
  S.mode = S.mode || "xray"; S.text = S.text || "A"; S.tags = S.tags || {}; S.weak = S.weak || { el:"", reason:"" };
  S.dial = S.dial || { slot:"D", w:{} }; S.lens = S.lens || { text:"E", p:"ruth" };
  S.feed = S.feed || { age:"18–24", ints:[], search:"", time:"", why:"", notes:"" }; S.real = S.real || {};
  var sel = "", fx = {}, prevRank = null;
  function tx(id){ return byId(T, id); }
  function tagsOf(tid, eid){ var o = S.tags[tid] || (S.tags[tid] = {}); return o[eid] || (o[eid] = { ap:[], tech:[], note:"" }); }
  function peek(tid, eid){ return (S.tags[tid] || {})[eid] || null; }

  host.innerHTML = '<div class="rx-ex"><div id="rx-mode"></div><p class="how rx-how" id="rx-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="rx-real" class="rx-real"></div><div class="rx-main" id="rx-main"></div><dl class="read rx-read" id="rx-read" aria-live="polite"></dl><p class="vh" id="rx-sr" aria-live="polite"></p></div>';
  var modeRG = radios($("#rx-mode", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  function setMode(v){ stopFx(); MV.banner("", ""); S.mode = v; modeRG.set(v); sel = ""; api.save(); paint(); MV.changed(); }

  // ----- real-example slots (X-ray mode; unscored notes the teacher reads) -----
  // REAL-EXAMPLE SLOT: the teacher shares R-A to R-D as credited screenshots or clips; students record credits and notes here.
  (function(){
    var R = C.real, el = $("#rx-real", host);
    el.innerHTML = '<details class="alg rx-realbox"' + (S.realOpen === false ? "" : " open") + '><summary>' + R.title + '</summary><p class="tiny muted">' + R.intro + "</p>" + R.slots.map(function(s){
      var v = S.real[s.id] || {};
      return '<div class="rx-slot"><p><strong>' + s.t + '</strong><br><span class="tiny">What it must show: ' + s.crit + ".</span><br><span class=\"tiny\">Your task: " + s.task + '</span></p>' +
        '<label class="vh" for="rx-rc-' + s.id + '">' + s.t + ' credit</label><input id="rx-rc-' + s.id + '" class="txtin" type="text" autocomplete="off" data-real="' + s.id + ':credit" placeholder="' + esc(R.creditPh) + '" value="' + esc(v.credit || "") + '">' +
        '<label class="vh" for="rx-rn-' + s.id + '">' + s.t + ' notes</label><textarea id="rx-rn-' + s.id + '" class="rx-ta" rows="2" data-real="' + s.id + ':notes" placeholder="' + esc(R.notesPh) + '">' + esc(v.notes || "") + "</textarea></div>";
    }).join("") + '<label for="rx-hunt" class="tiny">' + R.hunt + '</label><textarea id="rx-hunt" class="rx-ta" rows="2" data-real="hunt">' + esc(S.real.hunt || "") + "</textarea></details>";
    el.addEventListener("input", function(e){ var k = e.target.dataset.real; if (!k) return; if (k === "hunt") S.real.hunt = e.target.value; else { var p = k.split(":"); S.real[p[0]] = S.real[p[0]] || {}; S.real[p[0]][p[1]] = e.target.value; } api.save(); });
    el.addEventListener("toggle", function(e){ if (e.target.classList.contains("rx-realbox")) { S.realOpen = e.target.open; api.save(); } }, true);
  })();

  // ----- X-ray -----
  function tagChips(t){
    if (!t) return "";
    return t.ap.map(function(a){ return '<span class="an-tag an-' + ROLE[a] + '">' + APN[a] + "</span>"; }).join("") + t.tech.map(function(k){ return '<span class="an-tag an-diction">' + byId(C.techniques, k).t + "</span>"; }).join("");
  }
  function elHTML(t, e, interactive){
    var demo = fx.p2 && t.id === "C", gone = demo && fx.p2 === 2 && e.id === "f5";
    var tg = demo ? (gone ? null : (C.demoC[e.id] || null)) : peek(t.id, e.id);
    var cls = "rx-el rx-" + e.kind + (sel === e.id ? " sel" : "") + (gone ? " gone" : "") + (S.weak.el === e.id && t.id === "A" ? " weak" : "");
    var inner = (e.kind === "image" ? '<span class="rx-pic">' + art(t.id) + "</span>" : "") + '<span class="rx-lab">' + e.lab + "</span>" +
      '<span class="rx-txt">' + (e.kind === "image" ? "<em>" + esc(e.t) + "</em>" : esc(e.t)) + "</span>" + (tg && (tg.ap.length || tg.tech.length) ? '<span class="rx-tags">' + tagChips(tg) + "</span>" : "") +
      (tg && tg.note && !demo ? '<span class="rx-note">“' + esc(tg.note) + "”</span>" : "");
    if (!interactive) return '<div class="' + cls + '">' + inner + "</div>";
    var al = e.lab + ": " + MV.plain(e.t) + (tg && (tg.ap.length || tg.tech.length) ? ". Tagged " + tg.ap.map(function(a){ return APN[a]; }).concat(tg.tech.map(function(k){ return byId(C.techniques, k).t; })).join(", ") : ". Not tagged");
    return '<button type="button" class="' + cls + '" data-el="' + e.id + '" data-k="el' + t.id + e.id + '" aria-pressed="' + (sel === e.id) + '" aria-label="' + esc(al) + '">' + inner + "</button>";
  }
  function cardHTML(t, interactive){
    var frames = t.els.filter(function(e){ return e.kind === "frame"; }), rest = t.els.filter(function(e){ return e.kind !== "frame"; });
    return '<div class="rx-card rx-t' + t.id + '"><p class="rx-cardh"><strong>Text ' + t.id + ". " + t.name + '</strong> <span class="tiny muted">' + t.form + "</span></p>" +
      (frames.length ? '<div class="rx-frames">' + frames.map(function(e){ return elHTML(t, e, interactive); }).join("") + "</div>" : "") +
      rest.map(function(e){ return elHTML(t, e, interactive); }).join("") + "</div>";
  }
  function paletteHTML(t){
    if (fx.p2) return '<div class="rx-urg"><span>' + C.urgency.label + '</span><span class="rx-bar" role="img" aria-label="Urgency ' + Math.round(fx.urg) + ' out of 5"><i style="width:' + (fx.urg / 5 * 100) + '%"></i></span><strong>' + Math.round(fx.urg) + "/5</strong></div>";
    var e = sel ? byId(t.els, sel) : null;
    if (!e) return '<div class="rx-pal"><p class="tiny muted">Tap an element of the text to tag it.</p></div>';
    var tg = tagsOf(t.id, e.id);
    var h = '<div class="rx-pal" role="group" aria-label="Tag palette"><p class="tiny"><strong>Selected:</strong> ' + e.lab + " · " + esc(MV.plain(e.t)).slice(0, 70) + '</p><div class="rx-chiprow">' +
      C.appeals.map(function(a){ var on = has(tg.ap, a.id); return '<button type="button" class="an-chip an-' + a.role + '" data-ap="' + a.id + '" data-k="ap' + a.id + '" aria-pressed="' + on + '"><i class="an-dot"></i>' + a.t + "</button>"; }).join("") + "</div>" +
      '<div class="rx-chiprow">' + C.techniques.map(function(k){ var on = has(tg.tech, k.id); return '<button type="button" class="an-chip an-diction" data-tech="' + k.id + '" data-k="tq' + k.id + '" aria-pressed="' + on + '"><i class="an-dot"></i>' + k.t + "</button>"; }).join("") + "</div>" +
      '<label class="vh" for="rx-note">Note</label><input id="rx-note" class="txtin" type="text" autocomplete="off" placeholder="' + esc(C.notePh) + '" value="' + esc(tg.note || "") + '">';
    if (t.id === "A") h += '<p><button type="button" class="btn ghost sm" data-weak="1" data-k="weak">' + C.weakMark + "</button></p>";
    return h + "</div>";
  }
  function weakHTML(){
    var e = S.weak.el ? byId(tx("A").els, S.weak.el) : null;
    return '<div class="rx-weak"><p class="rg-lab">' + C.weakLabel + '</p><p class="tiny">' + (e ? "Weak link: <strong>" + e.lab + "</strong> · " + esc(e.t) : C.weakNone) + '</p><div id="rx-wr"></div></div>';
  }
  function xrayHTML(){
    var t = tx(fx.p2 ? "C" : S.text);
    return '<p class="tiny muted">' + C.modelNote + '</p><div id="rx-tp"></div><div class="rx-xr">' + cardHTML(t, !fx.p2) + '<div class="rx-side">' + paletteHTML(t) + (t.id === "A" && !fx.p2 ? weakHTML() : "") + "</div></div>";
  }
  function counts(tid){
    var o = S.tags[tid] || {}, n = { ethos:0, pathos:0, logos:0, kairos:0 }, tech = [];
    var src = fx.p2 && tid === "C" ? C.demoC : o;
    Object.keys(src).forEach(function(k){ if (fx.p2 === 2 && tid === "C" && k === "f5") return; var t = src[k]; t.ap.forEach(function(a){ n[a]++; }); t.tech.forEach(function(x){ if (!has(tech, x)) tech.push(x); }); });
    return { n:n, tech:tech };
  }

  // ----- Word dial -----
  function dialVals(){ var sl = byId(DL.slots, S.dial.slot), w = S.dial.w[sl.id] || sl.opts[0].w; return { sl:sl, w:w, v:fx.tone || byId(sl.opts.map(function(o){ return { id:o.w, v:o.v }; }), w).v }; }
  function bars(v){ return '<div class="rx-tone">' + DL.dims.map(function(d, i){ return '<div class="rx-trow"><span>' + d + '</span><span class="rx-bar" role="img" aria-label="' + d + " " + Math.round(v[i]) + ' out of 5"><i style="width:' + (v[i] / 5 * 100) + '%"></i></span><strong>' + Math.round(v[i]) + "</strong></div>"; }).join("") + "</div>"; }
  function dialHTML(){
    var d = dialVals();
    return '<div id="rx-ds"></div><p class="rx-line">' + esc(d.sl.before) + '<mark class="rx-slotw">' + esc(d.w) + "</mark>" + esc(d.sl.after) + ' <span class="tiny muted">(' + d.sl.lab + ')</span></p><div id="rx-dw"></div>' + bars(d.v) +
      '<div class="rx-mini">' + cardHTML(tx(d.sl.text), false) + "</div>";
  }

  // ----- Audience lens -----
  function persona(pid, tid, face){
    var p = byId(LN.personas, pid), r = LN.resp[pid][tid];
    return '<div class="rx-pc' + (face ? " flip" : "") + '"><p class="rx-pn"><strong>' + p.n + '</strong> <span class="tiny">' + p.d + '</span></p><p class="rx-pr">' + (face ? r.dim + ": <strong>" + r.lv + "</strong><br><span class=\"tiny\">" + r.why + "</span>" : '<span class="tiny muted">Card face down</span>') + "</p></div>";
  }
  function lensHTML(){
    var t = S.lens.text, h = '<div id="rx-lt"></div><div id="rx-lp"></div><div class="rx-lens"><div class="rx-mini">' + cardHTML(tx(t), false) + '</div><div class="rx-pcs">';
    if (fx.p3) h += persona("ruth", t, fx.p3 === 2) + persona("dax", t, fx.p3 === 2);
    else h += persona(S.lens.p, t, true);
    return h + "</div></div>";
  }

  // ----- Feed simulator -----
  function sig(){ return S.feed; }
  function nSignals(){ var f = S.feed; return f.ints.length + (f.search ? 1 : 0) + (f.time ? 1 : 0); }
  function feedHTML(){
    var f = S.feed, R = feedRank(FD, f), top = R[0], tie = R[1] && R[1].score === top.score;
    var h = '<div id="rx-fa"></div><p class="rg-lab">Liked interests (up to 2)</p><div class="rx-chiprow" role="group" aria-label="Liked interests, up to 2">' + FD.interests.map(function(i){ return '<button type="button" class="chip rx-tg" data-int="' + i + '" data-k="in' + i + '" aria-pressed="' + has(f.ints, i) + '">' + i + "</button>"; }).join("") + "</div>" +
      '<div id="rx-fs"></div><div id="rx-ft"></div>';
    h += '<ol class="rx-feed' + (f.all ? " all" : "") + '" aria-label="Mock feed, ranked">' + R.map(function(r, k){
      var t = tx(r.c.id), up = prevRank && prevRank.indexOf(r.c.id) > k && !MV.reduceMotion;
      return '<li class="rx-fc' + (k === 0 ? " top" : "") + (up ? " up" : "") + '"><span class="rx-rk">' + (k + 1) + '.</span><span class="rx-fart">' + art(t.id) + '</span><span class="rx-fn"><strong>' + t.id + ". " + t.name + '</strong><span class="tiny">' + t.form + (r.gated ? " · age-gated" : "") + '</span></span><span class="rx-sc">' + r.score + "</span></li>";
    }).join("") + '</ol><button type="button" class="btn ghost sm rx-all" data-all="1" data-k="all">' + (f.all ? "Show top 3" : "Show all") + "</button>";
    h += '<div class="rx-why"><p class="rg-lab">Why am I seeing this? (top card: ' + top.c.id + ')</p><p>' + (top.m.length ? top.m.map(function(x){ return x.t + " (+" + x.p + ")"; }).join(", ") : "No signals matched.") + (tie ? " <em>Tie: shown in default order.</em>" : "") + "</p></div>";
    h += '<details class="alg"><summary>How the score works</summary>' + FD.rules + '<div class="tbl-wrap"><table class="topic-tbl"><thead><tr><th scope="col">Card</th><th scope="col">Age bands</th><th scope="col">Interests</th><th scope="col">Searches</th><th scope="col">Time of day</th></tr></thead><tbody>' +
      FD.rulesTable.map(function(r){ return "<tr>" + r.map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div></details>";
    h += '<div id="rx-fw"></div><p class="tiny muted">' + FD.followUp + '</p><label class="vh" for="rx-fnote">Your notes</label><textarea id="rx-fnote" class="rx-ta" rows="2" placeholder="' + esc(FD.followPh) + '">' + esc(f.notes || "") + "</textarea>";
    return h;
  }

  function readout(){
    var R = C.readout, rows = [];
    if (S.mode === "xray") {
      var tid = fx.p2 ? "C" : S.text, c = counts(tid);
      rows.push([R.ap, "Text " + tid + ": " + C.appeals.map(function(a){ return a.t + " " + c.n[a.id]; }).join(" · ")]);
      rows.push([R.tech, c.tech.length ? c.tech.map(function(k){ return byId(C.techniques, k).t; }).join(" · ") : "none yet"]);
    } else if (S.mode === "dial") { var d = dialVals(); rows.push([R.tone, DL.dims.map(function(x, i){ return x + " " + Math.round(d.v[i]); }).join(" · ")]); }
    else if (S.mode === "lens") {
      var ps = fx.p3 ? (fx.p3 === 2 ? ["ruth", "dax"] : []) : [S.lens.p];
      rows.push([R.resp, ps.length ? ps.map(function(p){ var r = LN.resp[p][S.lens.text]; return byId(LN.personas, p).n + ", Text " + S.lens.text + ": " + r.dim.toLowerCase() + " " + r.lv + ", “" + r.why + "”"; }).join("<br>") : "Cards face down."]);
    } else {
      var RK = feedRank(FD, S.feed);
      rows.push([R.rank, RK.map(function(r, k){ return (k + 1) + ". " + r.c.id + " (" + r.score + ")"; }).join(" · ")]);
      rows.push([R.why, RK[0].m.length ? RK[0].m.map(function(x){ return x.t + " (+" + x.p + ")"; }).join(", ") : "No signals matched; default order."]);
    }
    var h = MV.readoutHTML(rows);
    var ch = MV.S && MV.S.chal; if (ch && ch.tc1 && ch.tc1.solved && ch.tc3 && ch.tc3.solved) h += '<p class="rx-aha">' + C.aha + "</p>";
    return h;
  }
  function paint(){
    $("#rx-how", host).innerHTML = C.how[S.mode];
    $("#rx-real", host).hidden = S.mode !== "xray";
    var m = $("#rx-main", host);
    MV.keepFocus(m, function(){ m.className = "rx-main rx-m-" + S.mode; m.innerHTML = S.mode === "xray" ? xrayHTML() : S.mode === "dial" ? dialHTML() : S.mode === "lens" ? lensHTML() : feedHTML(); });
    if (S.mode === "xray" && !fx.p2) {
      radios($("#rx-tp", host), { label:"Text", cls:"chips", options:T.map(function(t){ return { id:t.id, t:t.id + " " + t.name.replace(/^@\S+ for /, "") }; }), value:S.text, onChange:function(v){ S.text = v; sel = ""; api.save(); paint(); MV.changed(); } });
      if (S.text === "A") radios($("#rx-wr", host), { label:"Why?", aria:"Why it undermines the logos", cls:"chips rx-stack", options:C.weakReasons.map(function(r){ return { id:r.id, t:r.t }; }), value:S.weak.reason, onChange:function(v){ S.weak.reason = v; api.save(); paintRead(); MV.changed(); } });
    }
    if (S.mode === "dial") {
      radios($("#rx-ds", host), { label:"Slot", cls:"chips", options:DL.slots.map(function(s){ return { id:s.id, t:s.lab }; }), value:S.dial.slot, onChange:function(v){ stopFx(); S.dial.slot = v; api.save(); paint(); MV.changed(); } });
      var sl = byId(DL.slots, S.dial.slot);
      radios($("#rx-dw", host), { label:"Word", cls:"chips", options:sl.opts.map(function(o){ return { id:o.w, t:o.w }; }), value:S.dial.w[sl.id] || sl.opts[0].w, onChange:function(v){ stopFx(); S.dial.w[sl.id] = v; api.save(); paint(); MV.changed(); } });
    }
    if (S.mode === "lens") {
      radios($("#rx-lt", host), { label:"Text", cls:"chips", options:LN.texts.map(function(id){ return { id:id, t:id + " " + tx(id).name }; }), value:S.lens.text, onChange:function(v){ stopFx(); S.lens.text = v; api.save(); paint(); MV.changed(); } });
      radios($("#rx-lp", host), { label:"Persona", cls:"chips", options:LN.personas.map(function(p){ return { id:p.id, t:p.n + " <small>(" + p.d + ")</small>" }; }), value:fx.p3 ? "" : S.lens.p, onChange:function(v){ stopFx(); S.lens.p = v; api.save(); paint(); MV.changed(); } });
    }
    if (S.mode === "feed") {
      var f = S.feed;
      radios($("#rx-fa", host), { label:"Persona’s age band", cls:"chips", options:FD.ages.map(function(a){ return { id:a, t:a }; }), value:f.age, onChange:function(v){ feedSet(function(){ f.age = v; }); } });
      radios($("#rx-fs", host), { label:"Recent search", cls:"chips", options:[{ id:"", t:"none" }].concat(FD.searches.map(function(s){ return { id:s, t:"“" + s + "”" }; })), value:f.search, onChange:function(v){ feedSet(function(){ f.search = v; }); } });
      radios($("#rx-ft", host), { label:"Time of day", cls:"chips", options:[{ id:"", t:"none" }].concat(FD.times.map(function(s){ return { id:s, t:s }; })), value:f.time, onChange:function(v){ feedSet(function(){ f.time = v; }); } });
      radios($("#rx-fw", host), { label:FD.whyLabel, cls:"chips rx-stack", options:FD.why.map(function(w){ return { id:w.id, t:w.t }; }), value:f.why, onChange:function(v){ f.why = v; api.save(); MV.changed(); } });
    }
    paintRead();
  }
  function paintRead(){ $("#rx-read", host).innerHTML = readout(); }
  function feedSet(fn){
    stopFx(); prevRank = feedRank(FD, S.feed).map(function(r){ return r.c.id; });
    var top0 = prevRank[0]; fn(); api.save(); paint(); prevRank = null;
    var R = feedRank(FD, S.feed); if (R[0].c.id !== top0) $("#rx-sr", host).textContent = "New top card: " + R[0].c.id + ", " + tx(R[0].c.id).name + ", score " + R[0].score + ".";
    MV.changed();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    if (b.dataset.el) { if (fx.p2) return; sel = sel === b.dataset.el ? "" : b.dataset.el; paint(); return; }
    if (b.dataset.ap || b.dataset.tech) {
      var t = tagsOf(S.text, sel), list = b.dataset.ap ? t.ap : t.tech, v = b.dataset.ap || b.dataset.tech, i = list.indexOf(v);
      if (i >= 0) list.splice(i, 1); else list.push(v);
      api.save(); paint(); MV.changed(); return;
    }
    if (b.dataset.weak) { if (!sel) return; S.weak.el = sel; api.save(); paint(); MV.changed(); return; }
    if (b.dataset.int) {
      var it = b.dataset.int;
      feedSet(function(){ var f = S.feed, k = f.ints.indexOf(it); if (k >= 0) f.ints.splice(k, 1); else { f.ints.push(it); while (f.ints.length > 2) f.ints.shift(); } });
      return;
    }
    if (b.dataset.all) { S.feed.all = !S.feed.all; api.save(); paint(); }
  });
  host.addEventListener("input", function(e){
    if (e.target.id === "rx-note" && sel) { tagsOf(S.text, sel).note = e.target.value; api.save(); return; }
    if (e.target.id === "rx-fnote") { S.feed.notes = e.target.value; api.save(); }
  });
  host.addEventListener("change", function(e){ if (e.target.id === "rx-note") paint(); });
  document.addEventListener("click", function(e){
    var b = e.target.closest(".rx-setup"); if (!b) return;
    var k = b.dataset.setup;
    if (k === "tc3") setMode("feed"); else { S.text = "A"; setMode("xray"); }
    var g = $("#rx-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  function stopFx(){ if (Object.keys(fx).length) { fx = {}; if (EX) EX.busy = false; } }
  paint();

  EX = {
    stop:function(){ if (Object.keys(fx).length) { stopFx(); paint(); } },
    predict:{
      start:function(p){
        stopFx(); var st = p.start || {}; S.mode = st.mode; modeRG.set(st.mode); sel = "";
        if (p.id === "p1") { S.dial.slot = "D"; S.dial.w.D = "We"; }
        if (p.id === "p2") { fx = { p2:1, urg:C.urgency.before }; }
        if (p.id === "p3") { S.lens.text = "E"; fx = { p3:1 }; }
        if (p.id === "p4") { S.feed.age = st.age; S.feed.ints = []; S.feed.search = ""; S.feed.time = ""; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p1") MV.wait(300, function(){
          var a = byId(DL.slots, "D").opts[0].v, b = byId(DL.slots, "D").opts[1].v; S.dial.w.D = "Banks"; fx = { tone:a.slice() }; paint();
          MV.tween({ dur:1300, step:function(t){ fx.tone = a.map(function(x, i){ return x + (b[i] - x) * t; }); var bs = $$(".rx-tone .rx-bar i", host), ns = $$(".rx-tone strong", host); fx.tone.forEach(function(v, i){ if (bs[i]) bs[i].style.width = (v / 5 * 100) + "%"; if (ns[i]) ns[i].textContent = Math.round(v); }); },
            done:function(){ fx = {}; api.save(); paint(); MV.changed(); MV.wait(200, done); } });
        });
        else if (p.id === "p2") MV.wait(300, function(){
          fx.p2 = 2; paint();
          MV.tween({ dur:1300, step:function(t){ fx.urg = C.urgency.before + (C.urgency.after - C.urgency.before) * t; var i = $(".rx-urg .rx-bar i", host), n = $(".rx-urg strong", host); if (i) i.style.width = (fx.urg / 5 * 100) + "%"; if (n) n.textContent = Math.round(fx.urg) + "/5"; },
            done:function(){ fx.urg = C.urgency.after; paint(); MV.wait(300, done); } });
        });
        else if (p.id === "p3") MV.wait(300, function(){ fx.p3 = 2; paint(); MV.wait(1200, done); });
        else if (p.id === "p4") MV.wait(300, function(){ feedSet(function(){ S.feed.search = "new phone"; }); MV.wait(1200, done); });
        else done();
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
  function msg(id, k){ return byId(C.challenges, id).msgs[k]; }
  function tc1(){
    var A = S.tags.A || {}, g = function(e){ return A[e] || { ap:[], tech:[] }; };
    if (has(g("small").ap, "logos")) return { ok:false, msg:msg("tc1", "small") };
    if (has(g("tag").ap, "kairos")) return { ok:false, msg:msg("tc1", "tagK") };
    if (has(g("head").ap, "logos")) return { ok:false, msg:msg("tc1", "headL") };
    var eth = has(g("body2").ap, "ethos"), pat = ["img", "head", "tag"].some(function(e){ return has(g(e).ap, "pathos"); }), log = ["body1", "body2"].some(function(e){ return has(g(e).ap, "logos"); });
    if (eth && pat && log) return { ok:true };
    var any = Object.keys(A).some(function(k){ return A[k].ap.length; });
    return { ok:false, msg:any ? undefined : msg("tc1", "missing") };
  }
  function tc2(){
    var w = S.weak, ok = byId(C.weakReasons, w.reason);
    if (!w.el || !w.reason) return { ok:false, msg:msg("tc2", "none") };
    if (w.el === "img") return { ok:false, msg:msg("tc2", "img") };
    if (w.reason === "tiny") return { ok:false, msg:msg("tc2", "tiny") };
    if (w.reason === "stats") return { ok:false, msg:msg("tc2", "stats") };
    if (w.el === "small" && ok && MV.ok(ok)) return { ok:true };
    return { ok:false };
  }
  function tc3(){
    var f = S.feed, n = nSignals();
    if (f.age !== "13–17") return { ok:false, msg:msg("tc3", "age") };
    if (n === 0) return { ok:false, msg:msg("tc3", "none") };
    var R = feedRank(FD, f), first = R[0].c.id === "B" && R[1].score < R[0].score;
    if (n > 1) return { ok:false, msg:first ? msg("tc3", "many") : undefined };
    if (f.ints[0] === "gaming") return { ok:false, msg:msg("tc3", "gaming") };
    if (f.ints[0] === "pets") return { ok:false, msg:msg("tc3", "pets") };
    if (!first) return { ok:false };
    var w = byId(FD.why, f.why || "");
    if (!w || !MV.ok(w)) return { ok:false, msg:msg("tc3", "why") };
    return { ok:true };
  }
  return EX;
}

// ---------- Part 3: Disclosure — @component tapSort (station 1), real disclosure audit, @component chipRewrite (station 2),
// @component ethicsLadder (station 3) ----------
var P3S = null;
function part3(host, api){
  var P = api.content, S = api.S; P3S = S;
  S.s1 = S.s1 || {}; S.audit = S.audit || {}; S.s2 = S.s2 || { seq:[] }; S.s3 = S.s3 || {};
  var A1 = P.s1, AU = P.audit, A2 = P.s2, A3 = P.s3;
  host.innerHTML = '<div class="rx-p3"><p class="rx-craft"><span class="an-tag an-theme">Craft → meaning</span> ' + P.craft + "</p>" +
    '<section class="rx-st"><h4 class="rx-h">' + A1.title + '</h4><p class="tiny muted">' + A1.how + '</p><div id="rx-s1"></div></section>' +
    '<section class="rx-st"><h4 class="rx-h">' + AU.title + '</h4><p class="tiny muted">' + AU.how + '</p><div id="rx-au"></div><p class="tiny" id="rx-aus" aria-live="polite"></p></section>' +
    '<section class="rx-st"><h4 class="rx-h">' + A2.title + '</h4><p class="tiny muted">' + A2.how + '</p><p class="rx-orig"><span class="tiny"><strong>Original caption:</strong></span> ' + esc(A2.original) + '</p><div id="rx-s2"></div></section>' +
    '<section class="rx-st"><h4 class="rx-h">' + A3.title + '</h4><p class="tiny muted">' + A3.how + '</p><ul class="rx-tests">' + A3.tests.map(function(t){ return "<li><strong>" + t[0] + ":</strong> " + t[1] + "</li>"; }).join("") + '</ul><div id="rx-s3"></div>' +
    '<p class="tiny muted">' + A3.debate + '</p><label for="rx-real3" class="tiny">' + A3.realLabel + '</label><textarea id="rx-real3" class="rx-ta" rows="2" placeholder="' + esc(A3.realPh) + '"></textarea></section></div>';

  // Station 1
  function s1(){
    var el = $("#rx-s1", host), n = 0;
    MV.keepFocus(el, function(){
      el.innerHTML = '<ul class="rx-sort">' + A1.cards.map(function(c){
        var st = S.s1[c.id] || {}, right = st.pick && st.pick === MV.ans(c); if (right) n++;
        return '<li class="' + (right ? "ok" : st.pick ? "no" : "") + '"><p>' + c.t + '</p><span class="rx-two">' + A1.boxes.map(function(b){ return '<button type="button" class="chip" data-s1="' + c.id + ":" + b.id + '" data-k="s1' + c.id + b.id + '" aria-pressed="' + (st.pick === b.id) + '"' + (right ? " disabled" : "") + ">" + b.t + "</button>"; }).join("") + "</span>" +
          (st.pick ? '<p class="fb ' + (right ? "good" : "bad") + '" role="status">' + (right ? "✓ " + c.fb : "✗ " + (MV.ans(c) === "must" ? A1.wrongMust : A1.wrongNo)) + "</p>" : "") + "</li>";
      }).join("") + '</ul><p class="tiny" aria-live="polite">Sorted correctly: ' + A1.cards.filter(function(c){ var st = S.s1[c.id] || {}; return st.pick === MV.ans(c); }).length + "/" + A1.cards.length + "</p>";
    });
  }
  // Audit
  (function(){
    var el = $("#rx-au", host);
    el.innerHTML = AU.posts.map(function(p, pi){
      return '<fieldset class="rx-aud"><legend>' + p + "</legend>" + AU.fields.map(function(f){ var id = "rx-a" + pi + f.id; return '<label for="' + id + '" class="tiny">' + f.t + '</label><input id="' + id + '" class="txtin" type="text" autocomplete="off" data-au="' + pi + ":" + f.id + '" value="' + esc(((S.audit[pi] || {})[f.id]) || "") + '">'; }).join("") + "</fieldset>";
    }).join("");
    el.addEventListener("input", function(e){ var k = e.target.dataset.au; if (!k) return; var p = k.split(":"); S.audit[p[0]] = S.audit[p[0]] || {}; S.audit[p[0]][p[1]] = e.target.value; api.save(); aus(); });
  })();
  function aus(){ var full = AU.posts.every(function(_, pi){ return AU.fields.every(function(f){ return String((S.audit[pi] || {})[f.id] || "").trim(); }); }); $("#rx-aus", host).textContent = full ? AU.done : AU.notYet; }
  // Station 2
  function capText(seq){ return seq.map(function(id){ return byId(A2.chips, id).t; }).join(" "); }
  function s2check(seq){
    var words = 0, disc = false, com = false, sp = false, thx = false;
    seq.forEach(function(id){ var c = byId(A2.chips, id); if (c.kind === "disc" && words < 10) disc = true; if (c.kind === "com") com = true; if (c.kind === "short") sp = true; if (c.kind === "thanks") thx = true; words += MV.eng.wordCount(c.t); });
    return { c:[disc, com, !sp], thx:thx, sp:sp };
  }
  function s2(){
    var el = $("#rx-s2", host), seq = S.s2.seq, k = s2check(seq), done = k.c.every(Boolean) && seq.some(function(id){ return byId(A2.chips, id).kind === "pitch"; });
    MV.keepFocus(el, function(){
      el.innerHTML = '<p class="rg-lab">Chips</p><div class="rx-chiprow rx-pool">' + A2.chips.filter(function(c){ return !has(seq, c.id); }).map(function(c){ return '<button type="button" class="chip" data-add="' + c.id + '" data-k="ad' + c.id + '">' + esc(c.t) + "</button>"; }).join("") + "</div>" +
        '<p class="rg-lab">Your caption</p><div class="rx-cap" role="group" aria-label="Your caption, in order">' + (seq.length ? seq.map(function(id, i){ return '<button type="button" class="chip on" data-rm="' + i + '" data-k="rm' + id + '" aria-label="' + esc(byId(A2.chips, id).t) + ', position ' + (i + 1) + ', tap to take out">' + esc(byId(A2.chips, id).t) + "</button>"; }).join("") : '<span class="tiny muted">Tap chips above to build the caption.</span>') + "</div>" +
        '<ul class="rx-checks">' + A2.checks.map(function(c, i){ return '<li class="' + (k.c[i] && seq.length ? "ok" : "") + '"><span aria-hidden="true">' + (k.c[i] && seq.length ? "✓" : "○") + "</span> " + c + "</li>"; }).join("") +
        (k.sp ? '<li class="flag"><span aria-hidden="true">⚑</span> ' + A2.flagSp + "</li>" : "") + (k.thx ? '<li class="flag"><span aria-hidden="true">⚑</span> ' + A2.flagThx + "</li>" : "") + "</ul>" +
        (done ? '<p class="fb good" role="status">' + A2.okMsg + '</p><div class="rx-bea"><div><p class="tiny"><strong>' + A2.before + "</strong>" + (VOICE ? ' <button type="button" class="linkbtn" data-say="b">Listen</button>' : "") + "</p><p>" + esc(A2.original) + '</p></div><div><p class="tiny"><strong>' + A2.after + "</strong>" + (VOICE ? ' <button type="button" class="linkbtn" data-say="a">Listen</button>' : "") + "</p><p>" + esc(capText(seq)) + '</p></div></div><p class="rx-craft"><span class="an-tag an-theme">Craft → meaning</span> ' + A2.meaning + "</p>" : "");
    });
    S.s2.done = done;
  }
  // Station 3
  function s3(){
    var el = $("#rx-s3", host);
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="rx-ladder" role="img" aria-label="' + esc("Ladder: " + A3.rungs.slice().reverse().map(function(r){ return r.t + ": " + A3.items.filter(function(it){ return S.s3[it.id] && S.s3[it.id].pick === r.id; }).map(function(it){ return MV.plain(it.t).split(":")[0]; }).join(", "); }).join("; ")) + '">' +
        A3.rungs.slice().reverse().map(function(r){ return '<div class="rx-rung"><span class="rx-rn">' + r.t + '</span><span class="rx-ron">' + A3.items.filter(function(it){ return S.s3[it.id] && S.s3[it.id].pick === r.id; }).map(function(it){ var good = S.s3[it.id].pick === MV.ans(it); return '<span class="rx-rchip' + (good ? "" : " bad") + '">' + (good ? "✓ " : "✗ ") + MV.plain(it.t).split(":")[0].replace(/ before.*| after.*/, function(m){ return m.indexOf("before") >= 0 ? " (before)" : " (after)"; }) + "</span>"; }).join("") + "</span></div>"; }).join("") + "</div>" +
        '<ul class="rx-sort">' + A3.items.map(function(it){
          var st = S.s3[it.id] || {}, right = st.pick && st.pick === MV.ans(it);
          return '<li class="' + (right ? "ok" : st.pick ? "no" : "") + '"><p>' + it.t + '</p><span class="rx-two">' + A3.rungs.map(function(r){ return '<button type="button" class="chip" data-s3="' + it.id + ":" + r.id + '" data-k="s3' + it.id + r.id + '" aria-pressed="' + (st.pick === r.id) + '"' + (right ? " disabled" : "") + ">" + r.t + "</button>"; }).join("") + "</span>" +
            (st.pick ? '<p class="fb ' + (right ? "good" : "bad") + '" role="status">' + (right ? "✓ " + it.fb : "✗ Not quite. " + it.wrong) + "</p>" : "") + "</li>";
        }).join("") + "</ul>";
    });
  }
  var r3 = $("#rx-real3", host); r3.value = S.real3 || ""; r3.addEventListener("input", function(){ S.real3 = r3.value; api.save(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.disabled) return;
    if (b.dataset.s1) { var p = b.dataset.s1.split(":"), st = S.s1[p[0]] || (S.s1[p[0]] = { tries:0 }); st.pick = p[1]; st.tries++; api.save(); s1(); return; }
    if (b.dataset.s3) { var q = b.dataset.s3.split(":"), s = S.s3[q[0]] || (S.s3[q[0]] = { tries:0 }); s.pick = q[1]; s.tries++; api.save(); s3(); return; }
    if (b.dataset.add) { S.s2.seq.push(b.dataset.add); api.save(); s2(); return; }
    if (b.dataset.rm != null) { S.s2.seq.splice(+b.dataset.rm, 1); api.save(); s2(); return; }
    if (b.dataset.say) { MV.eng.stop(); sayOnce(b.dataset.say === "b" ? A2.original : capText(S.s2.seq)); }
  });
  voiceReady(function(){ s2(); });
  s1(); aus(); s2(); s3();
  return {};
}

// ---------- Practice 2: @component unseenCampaign — tap-a-line tags, chips and a chip rewrite on one unseen script ----------
function unseen(host, api, a){
  var B = api.S; B.it = B.it || {};
  function st(id){ return B.it[id] || (B.it[id] = { tries:0, hint:0, done:false, pick:{} }); }
  function script(){ return '<div class="rx-script"><p class="tiny"><strong>' + a.scriptTitle + '</strong></p><p class="tiny muted">' + a.stage + "</p><p>" + a.lines.map(esc).join(" ") + '</p><p class="tiny muted">' + a.screen + "</p></div>"; }
  function itemHTML(it, ii){
    var s = st(it.id), h = '<div class="q' + (ii ? " part" : "") + '" data-ui="' + it.id + '"><p class="q-prompt">' + it.prompt + "</p>";
    if (it.kind === "tap") {
      var ans = MV.ans(it);
      h += '<ol class="rx-lines">' + a.lines.map(function(l, li){ var c = "opt" + (s.done && li === ans ? " right" : s.last === li && li !== ans ? " wrong" : ""); return '<li><button type="button" class="' + c + '" data-tap="' + li + '" data-k="' + it.id + "l" + li + '"' + (s.done ? " disabled" : "") + "><span>" + esc(l) + "</span></button></li>"; }).join("") + "</ol>";
      if (s.last != null) h += s.done ? MV.fbHTML("good", "✓ " + it.why) : MV.fbHTML("bad", "✗ Not quite. " + (it.wrong[s.last] || it.wrong.def));
    } else if (it.kind === "mc") {
      h += '<div class="opts">' + it.options.map(function(o, oi){ var c = "opt" + (s.done && MV.ok(o) ? " right" : s.last === oi && !MV.ok(o) ? " wrong" : ""); return '<button type="button" class="' + c + '" data-mc="' + oi + '" data-k="' + it.id + "o" + oi + '"' + (s.done ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + oi) + "</span><span>" + o.t + "</span></button>"; }).join("") + "</div>";
      if (s.last != null) { var o = it.options[s.last]; h += MV.fbHTML(MV.ok(o) ? "good" : "bad", (MV.ok(o) ? "✓ " : "✗ Not quite. ") + o.why); }
    } else {
      h += it.slots.map(function(sl){ return '<div class="rx-bslot"><p class="rg-lab">' + sl.t + '</p><div class="rx-chiprow" role="radiogroup" aria-label="' + esc(MV.plain(sl.t)) + '">' + sl.opts.map(function(op){ var on = s.pick[sl.id] === op.id; return '<button type="button" role="radio" class="chip" aria-checked="' + on + '" data-bs="' + sl.id + ":" + op.id + '" data-k="' + it.id + sl.id + op.id + '"' + (s.done ? " disabled" : "") + ">" + esc(op.t) + "</button>"; }).join("") + "</div></div>"; }).join("");
      if (!s.done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-bcheck="1" data-k="' + it.id + 'chk">Check</button></div>';
      if (s.last != null) h += s.done ? MV.fbHTML("good", it.okMsg) : MV.fbHTML("bad", "✗ Not quite. " + it.fb);
    }
    if (!s.done) h += '<div class="q-actions">' + MV.hintBtn(it.id + "hint", s.hint) + "</div>" + MV.hintsHTML(it.hints, s.hint);
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = script() + a.items.map(itemHTML).join(""); }); }
  function buildOK(it, s){ var k = MV.ans(it); return s.pick.open === k.open && s.pick.deny === k.deny && has(k.stock, s.pick.stock); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ui]"); if (!box) return;
    var it = byId(a.items, box.dataset.ui), s = st(it.id), checked = false;
    if (b.dataset.act === "hint") s.hint = Math.min(3, s.hint + 1);
    else if (b.dataset.tap != null) { s.last = +b.dataset.tap; s.tries++; s.done = s.last === MV.ans(it); checked = true; }
    else if (b.dataset.mc != null) { s.last = +b.dataset.mc; s.tries++; s.done = MV.ok(it.options[s.last]); checked = true; }
    else if (b.dataset.bs) { var p = b.dataset.bs.split(":"); s.pick[p[0]] = p[1]; }
    else if (b.dataset.bcheck) { if (it.slots.some(function(sl){ return !s.pick[sl.id]; })) return; s.last = 1; s.tries++; s.done = buildOK(it, s); checked = true; }
    MV.save(); paint();
    if (checked) MV.focusFb($('[data-ui="' + it.id + '"]', host));
  });
  paint();
  function first(it){ var s = st(it.id); return s.done && s.tries === 1 && s.hint < 3; }
  return {
    stats:function(){ var f = a.items.filter(first).length, d = a.items.filter(function(it){ return st(it.id).done; }).length; return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ if (!first(it) && st(it.id).tries) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 09; numbered sentences) ----------
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Analysis ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s analysis</p><ol class=\"steps-list\">";
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

// ---------- @component E17 draftWorkspace (copied from ENG4U 09) — a writing area with a live word count (target range),
// saved drafts (up to 3) and a side-by-side compare with the changes marked (course plan E17) ----------
function diffWords(a, b){
  var A = a.split(/\s+/).filter(Boolean), Bw = b.split(/\s+/).filter(Boolean), n = A.length, m = Bw.length, L = [];
  for (var i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
  for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) L[i][j] = A[i] === Bw[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  var left = [], right = []; i = 0; j = 0;
  while (i < n && j < m) { if (A[i] === Bw[j]) { left.push(esc(A[i])); right.push(esc(Bw[j])); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { left.push("<del>" + esc(A[i]) + "</del>"); i++; } else { right.push("<ins>" + esc(Bw[j]) + "</ins>"); j++; } }
  while (i < n) left.push("<del>" + esc(A[i++]) + "</del>");
  while (j < m) right.push("<ins>" + esc(Bw[j++]) + "</ins>");
  return [left.join(" "), right.join(" ")];
}
function draftWorkspace(host, o){
  var cmp = null;
  host.innerHTML = '<div class="rx-dw"><label for="dw-' + o.id + '" class="rx-lab2">' + o.label + '</label><textarea id="dw-' + o.id + '" class="rx-dw-ta" rows="7"></textarea>' +
    '<div class="q-actions"><span class="rx-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var D = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = D.length ? '<p class="tiny">Saved drafts: ' + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && D[cmp]) { var df = diffWords(D[cmp].t, ta.value); cb.innerHTML = '<div class="rx-bea"><div><p class="tiny"><strong>Draft ' + D[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
    else cb.innerHTML = "";
  }
  function changed(){ o.set(ta.value); count(); if (cmp != null) list(); if (o.onChange) o.onChange(); }
  ta.addEventListener("input", changed);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "dw-" + o.id + "-save") { var D = o.drafts(), t = ta.value.trim(); if (!t) return; var n = D.length ? D[D.length - 1].n + 1 : 1; D.push({ n:n, t:t }); while (D.length > 3) D.shift(); cmp = null; MV.save(); list(); return; }
    if (b.dataset.dwc != null) { var i = +b.dataset.dwc; cmp = cmp === i ? null : i; list(); }
  });
  count(); list();
  return { refresh:function(){ ta.value = o.get() || ""; count(); list(); }, ta:ta, changed:changed };
}

// ---------- Performance task: Persuade, honestly (E17 copy + E1 tags on the student's own words) ----------
var task = (function(){
  var api = null, T = null, dw = null, tk = null, selW = [];
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function toks(text){ return MV.eng.tokenize(String(text || "").replace(/\n+/g, " ")); }
  // keep each span on the same words after edits; drop spans whose words are gone
  function spans(S){
    var tt = toks(S.text).map(function(t){ return t.t; }), out = [];
    (S.spans || []).forEach(function(sp){
      var cur = tt.slice(sp.s, sp.s + sp.n).join(" ");
      if (cur === sp.t) { out.push(sp); return; }
      for (var i = 0; i + sp.n <= tt.length; i++) if (tt.slice(i, i + sp.n).join(" ") === sp.t) { out.push({ tag:sp.tag, s:i, n:sp.n, t:sp.t }); return; }
    });
    return out;
  }
  function data(S){
    S = S || {}; T = T || MV.C.task;
    var text = String(S.text || ""), sp = spans(S);
    var subj = byId(T.subjects, S.subject || ""), fmt = byId(T.formats, S.format || "");
    return { subject:S.subject || "", subjectT:subj ? (S.subject === "own" ? (String(S.own || "").trim() || subj.t) : subj.t) : "", format:S.format || "", formatT:fmt ? fmt.t : "",
      audience:String(S.audience || "").trim(), offer:String(S.offer || "").trim(), text:text, n:wc(text), spans:sp, explain:explain() };
  }
  function urgent(d){ var low = d.text.toLowerCase(); return T.urgency.some(function(w){ return new RegExp("(^|[^a-z])" + w + "([^a-z]|$)").test(low); }); }
  function checks(d){
    T = T || MV.C.task;
    var c1 = d.n >= T.min && d.n <= T.max;
    var ap = ["ethos", "pathos", "logos", "kairos"], byAp = {};
    d.spans.forEach(function(s){ if (has(ap, s.tag)) (byAp[s.tag] = byAp[s.tag] || []).push(s.s + ":" + s.n); });
    var keys = Object.keys(byAp), c2 = false;
    for (var i = 0; i < keys.length && !c2; i++) for (var j = i + 1; j < keys.length && !c2; j++) for (var k = j + 1; k < keys.length && !c2; k++)
      byAp[keys[i]].forEach(function(x){ byAp[keys[j]].forEach(function(y){ byAp[keys[k]].forEach(function(z){ if (x !== y && y !== z && x !== z) c2 = true; }); }); });
    var c3 = d.spans.some(function(s){ return s.tag === "logos" && /[0-9]/.test(s.t); });
    var c4 = d.spans.some(function(s){ return s.tag === "cta"; });
    var c5 = !urgent(d) || !!d.offer;
    var first10 = " " + MV.eng.words(d.text).slice(0, 10).join(" ").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ") + " ";
    var c6 = d.format !== "creator" || T.disclose.some(function(w){ return first10.indexOf(" " + w + " ") >= 0; });
    var c7 = !!d.audience && wc(d.explain) >= T.craftMin;
    return [c1, c2, c3, c4, c5, c6, c7];
  }
  function marks(){ return data(api.S).spans.map(function(s){ var r = []; for (var i = s.s; i < s.s + s.n; i++) r.push(i); return { w:r, role:ROLE[s.tag], tag:APN[s.tag] }; }); }
  function paintTags(){
    var S = api.S, d = data(S), lab = T.labels, list = $("#pt-list"), menu = $("#pt-menu");
    if (tk) { tk.setTokens(toks(S.text)); tk.paint(); }
    $("#pt-empty").hidden = !!d.text.trim();
    menu.innerHTML = selW.length ? '<span class="tiny">Tag the selected words:</span> ' + T.tags.map(function(t){ return '<button type="button" class="an-chip an-' + t.role + '" data-ptag="' + t.id + '"><i class="an-dot"></i>' + t.t + "</button>"; }).join("") : "";
    MV.keepFocus(list, function(){ list.innerHTML = d.spans.length ? '<ul class="rx-spl">' + d.spans.map(function(s, i){ return '<li><span class="an-tag an-' + ROLE[s.tag] + '">' + APN[s.tag] + "</span> “" + esc(s.t) + '” <button type="button" class="linkbtn" data-unspan="' + i + '" data-k="us' + s.s + s.tag + '">' + lab.clear + "</button></li>"; }).join("") + "</ul>" : ""; });
  }
  function paintPv(){
    var S = api.S, d = data(S), el = $("#pt-pv"); if (!el) return;
    var r = checks(d), urg = urgent(d);
    el.innerHTML = '<h4 class="rx-h" style="margin-top:0">Your copy at a glance</h4><ul class="rx-glance"><li><strong>Subject:</strong> ' + (d.subjectT ? esc(d.subjectT) : '<span class="muted">not chosen</span>') + "</li><li><strong>Format:</strong> " + (d.formatT || '<span class="muted">not chosen</span>') + "</li>" +
      "<li><strong>Words:</strong> " + d.n + " (aim for " + T.min + "–" + T.max + ")</li><li><strong>Tags:</strong> " + (d.spans.length ? d.spans.map(function(s){ return APN[s.tag]; }).join(", ") : '<span class="muted">none yet</span>') + "</li>" +
      "<li><strong>Urgency backed by a fact:</strong> " + (urg ? (d.offer ? "✓ " + esc(d.offer) : "an urgency word is used; add offer details") : T.labels.notNeeded) + "</li>" +
      "<li><strong>Disclosure up front:</strong> " + (d.format === "creator" ? (r[5] ? "✓ in the first 10 words" : "not yet in the first 10 words") : T.labels.notNeeded) + "</li></ul>";
    $("#pt-models").innerHTML = r.every(Boolean) ? '<details class="alg"><summary>' + T.modelsLabel + "</summary>" + T.models.map(function(m){ return '<div class="rx-model"><h5>' + m.title + "</h5><p>" + m.text + '</p><p class="tiny"><strong>Tags:</strong> ' + m.tags + '<br><strong>Offer details:</strong> ' + m.offer + "</p></div>"; }).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintTags(); paintPv(); }
  function keyText(k){ T = T || MV.C.task; var p = String(k).split("|"), s = byId(T.subjects, p[0]), f = byId(T.formats, p[1]); return (s ? MV.plain(s.t) : p[0]) + " · " + (f ? f.t : p[1]); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, lab = T.labels; S.spans = S.spans || []; S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      inp.innerHTML = '<div class="rx-pt"><div id="pt-sub"></div><p class="tiny muted" id="pt-ownn">' + T.ownNote + '</p><div class="jq" id="pt-ownw"><label for="pt-own">Your cause</label><input id="pt-own" class="txtin" type="text" autocomplete="off" placeholder="' + esc(T.ownPh) + '"></div>' +
        '<div id="pt-fmt"></div><div class="jq"><label for="pt-aud">' + lab.audience + '</label><input id="pt-aud" class="txtin" type="text" autocomplete="off" placeholder="' + esc(lab.audiencePh) + '"></div>' +
        '<div id="pt-draft"></div><div class="jq"><label for="pt-offer">' + lab.offer + '</label><input id="pt-offer" class="txtin" type="text" autocomplete="off" placeholder="' + esc(lab.offerPh) + '"></div>' +
        '<div class="rx-ptag"><p class="rx-lab2">' + lab.tag + '</p><p class="tiny muted">' + lab.tagHow + '</p><p class="tiny muted" id="pt-empty">' + lab.noWords + '</p><div id="pt-toks"></div><div id="pt-menu" class="rx-chiprow" aria-live="polite"></div><div id="pt-list"></div></div></div>';
      pv.innerHTML = '<div id="pt-pv" aria-live="polite"></div><div id="pt-models"></div>';
      radios($("#pt-sub"), { label:lab.subject, cls:"chips rx-stack", options:T.subjects, value:S.subject || "", onChange:function(v){ S.subject = v; ownVis(); changed(); } });
      radios($("#pt-fmt"), { label:lab.format, cls:"chips", options:T.formats, value:S.format || "", onChange:function(v){ S.format = v; changed(); } });
      function ownVis(){ $("#pt-ownw").hidden = S.subject !== "own"; $("#pt-ownn").hidden = S.subject !== "own"; }
      ownVis();
      [["#pt-own", "own"], ["#pt-aud", "audience"], ["#pt-offer", "offer"]].forEach(function(p){ var el = $(p[0]); el.value = S[p[1]] || ""; el.addEventListener("input", function(){ S[p[1]] = el.value; changed(); }); });
      dw = draftWorkspace($("#pt-draft"), { id:"copy", label:lab.copy + " (" + T.min + "–" + T.max + " words)", min:T.min, max:T.max, get:function(){ return S.text; }, set:function(v){ S.text = v; S.spans = spans(S); selW = []; if (tk) tk.clear(); }, drafts:function(){ return S.drafts; }, onChange:changed });
      tk = MV.eng.tokens($("#pt-toks"), toks(S.text), { label:"Your copy: tap words to select them", marks:marks, onChange:function(s){ selW = s; paintTags(); }, onKey:function(k){ if (k === "t") { var b = $("#pt-menu [data-ptag]"); if (b) b.focus(); } } });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !inp.contains(b)) return;
        if (b.dataset.ptag) {
          if (!selW.length) return;
          var lo = Math.min.apply(null, selW), hi = Math.max.apply(null, selW), tt = toks(S.text).map(function(t){ return t.t; });
          S.spans = spans(S).concat([{ tag:b.dataset.ptag, s:lo, n:hi - lo + 1, t:tt.slice(lo, hi + 1).join(" ") }]); selW = []; tk.clear(); changed(); return;
        }
        if (b.dataset.unspan != null) { var L = spans(S); L.splice(+b.dataset.unspan, 1); S.spans = L; changed(); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); paintPv(); });
      paintTags(); paintPv();
      extras();
    },
    read:function(){ T = T || MV.C.task; return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ if (!d.text.trim()) return "Write your copy first."; if (!d.subject || !d.format) return "Choose a subject and a format first."; return true; },
    checks:checks,
    key:function(d){ return d.subject + "|" + d.format; },
    label:function(k){ return esc(keyText(k)); },
    text:function(k){ return keyText(k); },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), L = [];
      L.push((T.summary || "Persuade, honestly") + ": " + (r.every(Boolean) ? "complete (" + d.formatT + ")" : "not complete yet (checklist " + r.filter(Boolean).length + "/" + r.length + ")"));
      L.push("  Subject: " + (MV.plain(d.subjectT) || "(not chosen)") + " · Format: " + (d.formatT || "(not chosen)"));
      L.push("  Audience: " + (d.audience || "(not written)"));
      L.push("  Copy: " + (d.text.trim() || "(not written yet)"));
      L.push("  Tags: " + (d.spans.length ? d.spans.map(function(s){ return APN[s.tag] + " (“" + s.t + "”)"; }).join("; ") : "(none)"));
      L.push("  Offer details: " + (d.offer || "(none)"));
      L.push("  Craft statement: " + (String(d.explain || "").trim() || "(not written yet)"));
      if ((ts.found || []).length) L.push("  Complete versions: " + ts.found.join("; "));
      return L;
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
  if (sheet && art && R.art.intro && !$("#rx-artintro")) { var p = document.createElement("p"); p.id = "rx-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#rx-artn")) {
    var n = document.createElement("p"); n.id = "rx-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, ""); }) });
}

function summaryLines(){
  var C = MV.C, app = (MV.S && MV.S.app) || {}, E = EXS || app.explore || {}, P = P3S || app.part3 || {}, L = [];
  var real = C.explore.real.slots.map(function(s){ var v = (E.real || {})[s.id] || {}; return v.credit || v.notes ? s.t.split(" ")[0] + " " + (v.credit ? "(" + v.credit + ")" : "") + (v.notes ? ": " + v.notes : "") : ""; }).filter(Boolean);
  var aud = C.part3.audit.posts.map(function(p, pi){ var v = (P.audit || {})[pi] || {}; return v.words || v.pos || v.clear ? p + ": “" + (v.words || "") + "”, " + (v.pos || "") + ", " + (v.clear || "") : ""; }).filter(Boolean);
  L.push("Real examples x-rayed: " + (real.length ? real.join("; ") : "(none recorded)") + "; disclosure audit: " + (aud.length ? aud.join("; ") : "(not filled in)"));
  if (E.real && E.real.hunt) L.push("Technique hunt (real examples): " + E.real.hunt);
  var s1 = C.part3.s1.cards, s1f = s1.filter(function(c){ var s = (P.s1 || {})[c.id]; return s && s.tries === 1 && s.pick === MV.ans(c); }).length;
  var s3 = C.part3.s3.items, s3f = s3.filter(function(c){ var s = (P.s3 || {})[c.id]; return s && s.tries === 1 && s.pick === MV.ans(c); }).length;
  L.push("Is it an ad? (first try): " + s1f + "/" + s1.length + " · Ethics ladder (first try): " + s3f + "/" + s3.length + " · Disclosure fix: " + (P.s2 && P.s2.done ? "complete" : "not yet"));
  if (P.real3) L.push("Real campaign on the ladder: " + P.real3);
  if (E.feed && E.feed.notes) L.push("Feed follow-up notes: " + E.feed.notes);
  return L;
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ unseen:unseen, spot:spotProse },
  task:task,
  summaryLines:summaryLines,
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX && v !== "explore") EX.stop();
    if (v === "reflect") extras();
  }
});
})();
