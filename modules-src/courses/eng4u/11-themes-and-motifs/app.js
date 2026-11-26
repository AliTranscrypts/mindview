// ENG4U 11 Themes & Motifs: hero (a sketched Denmark, a stain spreading from "rotten", four motif threads), Motif tracker
// (Explore, E11 motif tracker: tag 20 Hamlet passages; Pattern charts; Thread builder), From topic to thematic statement
// (Part 3, E7 thesis forge variant + thread test), Unseen pattern (custom: toolkit MC + a structured sentence), Spot the
// Error (K13 spotProse) and the "Follow the thread" task (E6 paragraph builder + quote picker + E17 drafts).
// Texts: content.mjs (Globe Hamlet, Macbeth, Romeo and Juliet).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
var MIDS = ["dis", "poi", "act", "mor"];
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function EXC(){ return MV.C.explore; }
function corpus(){ return EXC().corpus; }
function card(id){ return byId(corpus(), id); }
function motif(id){ return byId(EXC().motifs, id); }
function linesOf(c){ return c.text.split(/\s+\/\s+/); }
function snip(c, n){ var w = c.text.split(/\s+/); return w.length > n ? w.slice(0, n).join(" ").replace(/[,;:.!?]+$/, "") + "…" : w.join(" "); }
function shortWho(c){ return c.who.split(" (")[0]; }
function capFirst(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function andList(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }

// ---------- @component radioGroup (copied from ENG4U 08; no option needs to be checked) ----------
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = false;
  function off(id){ return locked || !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; document.documentElement.classList.toggle("mt-novoice", !v); var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
// read chunks one after another: [[text, rate, wordOffset]]; onWord(globalWordIndex); returns a token whose .stop() cancels
function readChunks(chunks, onWord, onDone){
  var tok = { stopped:false, stop:function(){ tok.stopped = true; MV.eng.stop(); } }, i = 0;
  function next(){
    if (tok.stopped) return;
    if (i >= chunks.length || !VOICE) { if (onDone) onDone(); return; }
    var ch = chunks[i++];
    MV.eng.say(ch[0], { voice:VOICE, rate:ch[1] || 1, onWord:function(w){ if (!tok.stopped && onWord) onWord((ch[2] || 0) + w); }, onEnd:function(){ if (tok.stopped) return; setTimeout(next, 180); } });
  }
  next();
  return tok;
}

// ---------- hero: "Something is rotten…" over a sketched Denmark; a stain spreads; four motif threads find their acts ----------
var HR = { run:0 };
var JUT = "M148 250 C144 220 140 190 140 160 C140 130 143 112 150 102 C162 88 182 76 205 62 C198 78 190 92 186 106 C196 116 210 128 208 142 C204 152 192 154 188 166 C185 190 183 220 182 250 Z";
var FUN = "M206 196 C214 186 230 186 236 196 C240 208 232 220 220 222 C208 222 200 210 206 196 Z";
var ZEA = "M248 170 C262 160 280 160 290 170 C298 184 296 204 288 218 C278 232 260 236 250 226 C240 214 238 196 244 184 C244 178 246 174 248 170 Z";
var PH = [[12, 92, "start", 62, 112], [12, 172, "start", 62, 192], [408, 92, "end", 356, 112], [408, 146, "end", 356, 166]];
var ACTX = [140, 180, 220, 260, 300];
function heroSVG(H){
  var words = H.line.split(/\s+/), iR = -1;
  words.forEach(function(w, i){ if (iR < 0 && /^rotten/i.test(w)) iR = i; });
  var h = '<svg class="mt-hsvg" viewBox="0 0 420 300" role="img" aria-label="' + esc(H.aria) + '" focusable="false">';
  h += '<defs><clipPath id="mt-land"><path d="' + JUT + '"/><path d="' + FUN + '"/><path d="' + ZEA + '"/></clipPath></defs>';
  h += '<g class="mt-landg"><path d="' + JUT + '"/><path d="' + FUN + '"/><path d="' + ZEA + '"/></g>';
  h += '<defs><radialGradient id="mt-sg"><stop offset="0" class="mt-sg0"/><stop offset=".6" class="mt-sg1"/><stop offset="1" class="mt-sg2"/></radialGradient></defs>';
  h += '<g clip-path="url(#mt-land)"><circle class="mt-stain" cx="289" cy="167" r="0" fill="url(#mt-sg)"/></g>';
  h += '<text class="mt-hlab" x="166" y="152" text-anchor="middle">DENMARK</text>';
  h += '<circle class="mt-els" cx="289" cy="167" r="3"/><text class="mt-hlab2" x="282" y="158" text-anchor="end">Elsinore</text>';
  h += '<path class="mt-drip" pathLength="1" d="M150 38 L289 162"/>';
  h += '<text class="mt-hline" x="210" y="30" text-anchor="middle">' + words.map(function(w, i){ return '<tspan class="mt-hw' + (i === iR ? " mt-hrot" : "") + '" data-wi="' + i + '">' + esc(w) + "</tspan>"; }).join(" ") + "</text>";
  H.phrases.forEach(function(p, k){
    var P = PH[k], m = motif(p.m), ax = ACTX[p.act - 1];
    h += '<path class="mt-hthr mt-m-' + p.m + '" data-hth="' + k + '" pathLength="1" d="M' + P[3] + " " + P[4] + " C" + P[3] + " " + (P[4] + 110) + " " + ax + " 210 " + ax + ' 270"/>';
    h += '<g class="mt-hph mt-m-' + p.m + '" data-hph="' + k + '"><text class="mt-hpt" x="' + P[0] + '" y="' + P[1] + '" text-anchor="' + P[2] + '">“' + esc(p.t) + '”</text><text class="mt-hpm" x="' + P[0] + '" y="' + (P[1] + 14) + '" text-anchor="' + P[2] + '">' + esc(m.t) + "</text></g>";
  });
  h += '<text class="mt-hlab2" x="122" y="286" text-anchor="end">' + esc(H.act) + "</text>";
  ACTX.forEach(function(x, i){ h += '<g class="mt-hact" data-ha="' + (i + 1) + '"><circle cx="' + x + '" cy="282" r="10"/><text x="' + x + '" y="286" text-anchor="middle">' + (i + 1) + "</text></g>"; });
  return { svg:h + "</svg>", iR:iR, n:words.length };
}
function hero(){
  var H = MV.C.hero, host = $("#mt-hero"); if (!host) return;
  var g = heroSVG(H);
  host.innerHTML = '<div class="mt-hwrap">' + g.svg + '</div><p class="eng-cite mt-hcite">' + H.cite + '</p><p class="mt-hcap">' + H.caption + '</p>' +
    '<div class="mt-hctl"><button type="button" class="btn ghost sm" id="mt-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="mt-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="mt-hnote" hidden>' + H.noVoice + "</span></div>";
  var svg = $(".mt-hsvg", host), W = $$(".mt-hw", svg), stain = $(".mt-stain", svg), tok = null, stTw = null;
  // aim the drip at the word "rotten"
  try { var bb = W[g.iR].getBBox(), x = bb.x + bb.width / 2; $(".mt-drip", svg).setAttribute("d", "M" + x.toFixed(1) + " " + (bb.y + bb.height + 2).toFixed(1) + " C" + x.toFixed(1) + " 110 289 100 289 162"); } catch (e) {}
  function cls(sel, c, on){ $$(sel, svg).forEach(function(e){ e.classList.toggle(c, on); }); }
  function words(n, speak){ W.forEach(function(e, i){ e.classList.toggle("on", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); }
  function stainTo(r, ms){ if (stTw) stTw(); var r0 = +stain.getAttribute("r"); stTw = MV.tween({ dur:ms, step:function(t){ stain.setAttribute("r", (r0 + (r - r0) * t).toFixed(1)); }, done:function(){ stTw = null; } }); }
  function reset(){ host.classList.remove("done", "cap-on"); host.classList.add("anim"); words(-1); cls(".mt-hrot", "hot", false); cls(".mt-drip", "on", false); cls(".mt-hph", "on", false); cls(".mt-hthr", "on", false); cls(".mt-hact", "on", false); stain.setAttribute("r", "0"); }
  function finish(){
    if (stTw) { stTw(); stTw = null; }
    host.classList.remove("anim"); host.classList.add("done", "cap-on"); words(g.n - 1); cls(".mt-hrot", "hot", true); cls(".mt-drip", "on", true); cls(".mt-hph", "on", true); cls(".mt-hthr", "on", true);
    H.phrases.forEach(function(p){ var a = $('[data-ha="' + p.act + '"]', svg); if (a) a.classList.add("on"); });
    stain.setAttribute("r", "175"); btns();
  }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run, t = 300; MV.eng.stop(); reset();
    for (var i = 0; i < g.n; i++) (function(i){ at(me, t + i * 280, function(){ words(i, false); }); })(i);
    t += g.n * 280 + 200;
    at(me, t, function(){ cls(".mt-hrot", "hot", true); cls(".mt-drip", "on", true); stainTo(175, 1500); });
    t += 1500;
    H.phrases.forEach(function(p, k){ at(me, t + k * 600, function(){ var e = $('[data-hph="' + k + '"]', svg); if (e) e.classList.add("on"); }); });
    t += H.phrases.length * 600 + 200;
    at(me, t, function(){ cls(".mt-hthr", "on", true); H.phrases.forEach(function(p){ var a = $('[data-ha="' + p.act + '"]', svg); if (a) a.classList.add("on"); }); });
    at(me, t + 900, function(){ host.classList.add("cap-on"); });
    at(me, t + 1300, finish);
  }
  function listen(){
    var me = ++HR.run; if (tok) tok.stop();
    finish(); words(-1);
    tok = readChunks([["Something is", 0.85, 0], ["rotten", 0.6, 2], ["in the state of Denmark.", 0.85, 3]], function(w){ if (me === HR.run) words(w, true); }, function(){ if (me === HR.run) { words(g.n - 1); tok = null; } });
  }
  function btns(){ $("#mt-hlisten").hidden = !VOICE; $("#mt-hagain").hidden = MV.reduceMotion; $("#mt-hnote").hidden = !!VOICE; }
  $("#mt-hlisten").addEventListener("click", listen);
  $("#mt-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) { host.classList.add("mt-still"); finish(); } else animate();
  voiceReady(btns);
  HR.stop = function(){ if (tok) { tok.stop(); tok = null; } MV.eng.stop(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- @component E11 motifTracker — tag occurrences across a work (multi-tag chips per passage, checked against a key
// that lists accepted second tags); Pattern mode (stacked bars per act, a placement timeline, a speaker breakdown, key overlay);
// Thread mode (one motif's passages in an order the student builds, with "how has the image changed?" links). Course plan E11;
// reused by 16. Data: content.explore.{motifs, corpus:[{id, act, sc, ref, who, grp, text, moment, aim, why, answer:{p, also}}], scenes}.
function keyOf(c){ return MV.ans(c) || { p:"", also:[] }; }
function tagsOf(S, id){ return (S.tags && S.tags[id]) || []; }
function cardOK(S, c){ var t = tagsOf(S, c.id), k = keyOf(c); if (!t.length || has(t, "none") || !has(t, k.p)) return false; return t.every(function(m){ return m === k.p || has(k.also, m); }); }
function countsBy(S, useKey){
  var out = [0, 1, 2, 3, 4].map(function(){ return { dis:0, poi:0, act:0, mor:0 }; });
  corpus().forEach(function(c){ (useKey ? [keyOf(c).p] : tagsOf(S, c.id)).forEach(function(m){ if (out[c.act - 1][m] != null) out[c.act - 1][m]++; }); });
  return out;
}
function totals(arr){ var t = { dis:0, poi:0, act:0, mor:0 }; arr.forEach(function(a){ MIDS.forEach(function(m){ t[m] += a[m]; }); }); return t; }
function playPos(c){ return c.act * 100 + c.sc; }
function threadOf(S, m){ S.thread = S.thread || {}; return S.thread[m] || (S.thread[m] = []); }

var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, L = C.labels, RO = C.readout, CO = C.corpus;
  S.tags = S.tags || {}; S.res = S.res || {}; S.thread = S.thread || {}; S.links = S.links || {};
  S.mode = has(["tag", "pattern", "thread"], S.mode) ? S.mode : "tag";
  S.fAct = S.fAct || "all"; S.fWho = S.fWho || "all"; S.fMot = S.fMot || "all"; S.focus = has(MIDS, S.focus) ? S.focus : "dis";
  S.open = card(S.open) ? S.open : ""; S.case = S.case || { m:"", ids:[] }; S.turn = S.turn || "";
  var fx = {}, readTok = null, grow = null, lifted = null;

  host.innerHTML = '<div class="mt">' +
    '<div id="mt-mode" class="mt-modes"></div>' +
    '<div class="mt-filters" role="group" aria-label="' + esc(L.filters) + '"><div id="mt-fact"></div><div id="mt-fwho"></div><div id="mt-fmot"></div></div>' +
    '<div data-mv="graph" class="mt-graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<h4 class="mt-h" id="mt-strip-h">' + L.strip + '</h4><div class="mt-stripw" id="mt-stripw"><div class="mt-strip" id="mt-strip"></div></div>' +
      '<div class="mt-body"><div class="mt-main"><div id="mt-panel"></div>' +
        '<div id="mt-tag"><div class="q-actions"><button type="button" class="btn primary sm" id="mt-check" data-k="mtcheck">' + L.check + '</button><span class="tiny muted">' + L.checkHow + '</span></div><div id="mt-checkmsg" aria-live="polite"></div></div>' +
        '<div id="mt-pattern"><div id="mt-pfocus"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="mt-keyt" data-k="mtkey" aria-pressed="false">' + L.key + '</button><span class="tiny muted" id="mt-keynote"></span></div>' +
          '<div class="mt-charts"><figure class="mt-fig"><figcaption>' + L.bars + '</figcaption><div id="mt-bars"></div><div class="mt-legend" id="mt-legend"></div></figure>' +
          '<figure class="mt-fig mt-figw"><figcaption>' + L.timeline + '</figcaption><div id="mt-tl" class="mt-tlw"></div></figure>' +
          '<figure class="mt-fig"><figcaption id="mt-spk-h"></figcaption><div id="mt-spk" class="mt-spk"></div></figure></div>' +
          '<p class="mt-aha" id="mt-aha" hidden>' + C.aha + '</p>' +
          '<div class="mt-board" id="mt-case"><h4 class="mt-h">' + L.caseT + '</h4><p class="how">' + L.caseHow + '</p><div id="mt-cm"></div><div id="mt-cp" class="mt-chiplist" role="group" aria-label="' + esc(L.casePass) + '"></div><p class="tiny" id="mt-csum" aria-live="polite"></p></div></div>' +
        '<div id="mt-threadv"><div id="mt-tfocus"></div><div id="mt-tsup"></div><h4 class="mt-h">' + L.thread + '</h4><div id="mt-thr" class="mt-thr"></div><h4 class="mt-h">' + L.tray + '</h4><div id="mt-tray" class="mt-chiplist"></div><div id="mt-turn"></div></div>' +
      '</div><div class="mt-readbox"><p class="mt-read-h">Readout</p><dl class="read" id="mt-read" aria-live="polite"></dl></div></div>' +
    "</div></div>";

  var motOpts = C.motifs.map(function(m){ return { id:m.id, t:m.t, cls:"mt-m-" + m.id + " mt-rgm" }; });
  var modeR = radios($("#mt-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var fA = radios($("#mt-fact"), { label:L.act, cls:"chips", options:[{ id:"all", t:L.all }].concat([1, 2, 3, 4, 5].map(function(a){ return { id:String(a), t:String(a) }; })), value:S.fAct, onChange:function(v){ S.fAct = v; filt(); } });
  var fW = radios($("#mt-fwho"), { label:L.who, cls:"chips", options:C.groups, value:S.fWho, onChange:function(v){ S.fWho = v; filt(); } });
  var fM = radios($("#mt-fmot"), { label:L.motif, cls:"chips", options:[{ id:"all", t:L.all }].concat(C.motifs.map(function(m){ return { id:m.id, t:m.short }; })).concat([{ id:"untagged", t:L.untagged }]), value:S.fMot, onChange:function(v){ S.fMot = v; filt(); } });
  var pFocus = radios($("#mt-pfocus"), { label:L.focus, cls:"chips", options:motOpts, value:S.focus, onChange:function(v){ setFocus(v); } });
  var tFocus = radios($("#mt-tfocus"), { label:L.focus, cls:"chips", options:motOpts, value:S.focus, onChange:function(v){ setFocus(v); } });
  var caseR = radios($("#mt-cm"), { label:L.caseMotif, cls:"chips", options:motOpts, value:S.case.m, onChange:function(v){ S.case.m = v; api.save(); paintCase(); MV.changed(); } });
  var TURNS = MV.shuffle(C.turns.slice(), 11);
  radios($("#mt-turn"), { label:L.turn, aria:L.turn, cls:"chips mt-turns", options:TURNS.map(function(t){ return { id:t.id, t:t.t }; }), value:S.turn, onChange:function(v){ S.turn = v; api.save(); MV.changed(); } });

  function filt(){ api.save(); fx = {}; paintAll(); }
  function setFocus(v){ S.focus = v; pFocus.set(v); tFocus.set(v); api.save(); fx = {}; paintMode(); paintRead(); MV.changed(); }
  function setMode(v, quiet){ stopRead(); S.mode = v; modeR.set(v); api.save(); if (!quiet) fx = {}; paintAll(); if (v === "pattern" && !quiet) growBars(); MV.changed(); }
  function stopRead(){ if (readTok) { readTok.stop(); readTok = null; } }

  // ----- strip -----
  function visible(c){
    if (S.fAct !== "all" && String(c.act) !== S.fAct) return false;
    if (S.fWho !== "all" && c.grp !== S.fWho) return false;
    var t = fx.blank ? [] : tagsOf(S, c.id).filter(function(m){ return m !== "none"; });
    if (S.fMot === "untagged") return !t.length;
    if (S.fMot !== "all" && !has(t, S.fMot)) return false;
    return true;
  }
  function pills(t){ return t.map(function(m){ return m === "none" ? '<span class="mt-pill mt-pnone">' + C.none + "</span>" : '<span class="mt-pill mt-m-' + m + '">' + motif(m).t + "</span>"; }).join(""); }
  function cardBtn(c){
    var t = fx.blank ? [] : tagsOf(S, c.id), first = t.filter(function(m){ return m !== "none"; })[0], r = fx.blank ? null : S.res[c.id];
    var lab = c.id + ", " + c.ref + ", " + shortWho(c) + ": " + MV.plain(snip(c, 6)) + ". " + (t.length ? "Tagged " + t.map(function(m){ return m === "none" ? C.none : motif(m).t; }).join(", ") : "Not tagged") + (r === true ? ". Matches the key" : r === false ? ". Look again" : "");
    return '<button type="button" class="mt-card' + (first ? " mt-has mt-m-" + first : "") + (S.open === c.id ? " mt-open" : "") + (r === true ? " mt-ok" : r === false ? " mt-bad" : "") + '" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + (S.open === c.id) + '" aria-label="' + esc(lab) + '">' +
      '<span class="mt-cid">' + c.id + ' <span class="mt-cref">' + c.ref + "</span>" + (r === true ? '<span class="mt-mk" aria-hidden="true">✓</span>' : r === false ? '<span class="mt-mk bad" aria-hidden="true">✗</span>' : "") + "</span>" +
      '<span class="mt-csnip">“' + esc(snip(c, 6)) + "”</span>" + '<span class="mt-cwho">' + esc(shortWho(c)) + "</span>" +
      '<span class="mt-ctags">' + (t.length ? pills(t) : '<span class="mt-pill mt-pun">untagged</span>') + "</span></button>";
  }
  function paintStrip(){
    MV.keepFocus($("#mt-strip"), function(){
      $("#mt-strip").innerHTML = [1, 2, 3, 4, 5].map(function(a){
        if (S.fAct !== "all" && String(a) !== S.fAct) return "";
        var cs = CO.filter(function(c){ return c.act === a && visible(c); });
        return '<div class="mt-actcol"><p class="mt-acth">Act ' + a + '</p><div class="mt-cards">' + (cs.length ? cs.map(cardBtn).join("") : '<p class="tiny muted">' + L.nomatch + "</p>") + "</div></div>";
      }).join("");
    });
    $("#mt-strip").classList.toggle("one", S.fAct !== "all");
  }

  // ----- open card -----
  function paintPanel(){
    var c = card(S.open), el = $("#mt-panel");
    if (!c) { el.innerHTML = ""; return; }
    var t = tagsOf(S, c.id), who = fx.p3 && c.id === "C6" ? C.p3.swap : c.who, aim = fx.p3 && c.id === "C6" ? C.p3.after : c.aim;
    var txt = linesOf(c).map(function(l){ var e = esc(l); if (fx.p4 && c.id === "C3") e = e.replace(C.p4.from, '<del>' + C.p4.from + '</del> <ins>' + C.p4.to + "</ins>"); return e; }).join("<br>");
    MV.keepFocus(el, function(){
      el.innerHTML = '<div class="mt-pan mt-' + (t.filter(function(m){ return m !== "none"; })[0] ? "m-" + t.filter(function(m){ return m !== "none"; })[0] : "none") + '"><div class="mt-pan-h"><strong>' + c.id + "</strong> <span class=\"mt-cref\">" + "(<i>Hamlet</i> " + c.ref + ')</span><button type="button" class="btn ghost sm" data-act="close" data-k="pclose">' + L.close + "</button></div>" +
        '<p class="mt-pwho' + (fx.p3 ? " flash" : "") + '">Speaker: <strong>' + esc(who) + '</strong> · <span class="mt-aim">' + esc(aim) + "</span></p>" +
        '<p class="mt-pmom">' + c.moment + '</p><blockquote class="mt-ptext">' + txt + "</blockquote>" +
        '<p class="mt-pread">' + (VOICE ? '<button type="button" class="btn ghost sm" data-act="read" data-k="pread">' + (readTok ? L.stop : L.read) + "</button>" : '<span class="tiny muted">' + L.noVoice + "</span>") + "</p>" +
        '<p class="mt-lab" id="mt-chl">' + L.chipsFor + '</p><div class="mt-mchips" role="group" aria-labelledby="mt-chl">' +
        C.motifs.map(function(m){ var on = has(t, m.id); return '<button type="button" class="mt-mchip mt-m-' + m.id + '" data-tagm="' + m.id + '" data-k="tg' + m.id + '" aria-pressed="' + on + '"><span class="mt-box" aria-hidden="true">' + (on ? "✓" : "") + "</span>" + m.t + "</button>"; }).join("") +
        '<button type="button" class="mt-mchip mt-mnone" data-tagm="none" data-k="tgnone" aria-pressed="' + has(t, "none") + '"><span class="mt-box" aria-hidden="true">' + (has(t, "none") ? "✓" : "") + "</span>" + C.none + "</button></div></div>";
    });
  }
  function toggleTag(m){
    var c = card(S.open); if (!c) return;
    var t = tagsOf(S, c.id).slice();
    if (m === "none") t = has(t, "none") ? [] : ["none"];
    else { t = t.filter(function(x){ return x !== "none"; }); var i = t.indexOf(m); if (i >= 0) t.splice(i, 1); else t.push(m); }
    S.tags[c.id] = t; delete S.res[c.id];
    MIDS.forEach(function(x){ if (!has(t, x)) { var th = threadOf(S, x), j = th.indexOf(c.id); if (j >= 0) th.splice(j, 1); } });
    api.save(); paintStrip(); paintPanel(); paintMode(); paintRead(); fillH3(); MV.changed();
  }

  // ----- tag mode: check against the key -----
  function checkTags(){
    var n = 0, tagged = 0;
    CO.forEach(function(c){ if (tagsOf(S, c.id).length) { tagged++; S.res[c.id] = cardOK(S, c); if (S.res[c.id]) n++; } else delete S.res[c.id]; });
    S.checked = true; api.save();
    var msg = n === CO.length ? "<strong>✓ All 20 match the key.</strong> The key’s counts now show in the readout, and Pattern mode can overlay them." :
      "<strong>" + n + " of " + CO.length + " match the key.</strong> " + (tagged - n ? (tagged - n) + " tagged card" + (tagged - n === 1 ? "" : "s") + " marked ✗ need another look. " : "") + (CO.length - tagged ? (CO.length - tagged) + " still untagged. " : "") + "The key’s counts now show in the readout.";
    $("#mt-checkmsg").innerHTML = MV.fbHTML(n === CO.length ? "good" : "", msg);
    paintStrip(); paintMode(); paintRead();
  }

  // ----- pattern mode -----
  function barsSVG(){
    var stu = countsBy(S, false), key = countsBy(S, true), showKey = S.checked && S.keyOn, ser = fx.keyOnly ? [["k", key]] : showKey ? [["s", stu], ["k", key]] : [["s", stu]];
    var W = 340, B = 178, T = 14, Lx = 26, colW = (W - Lx - 6) / 5, maxT = 4;
    ser.forEach(function(s){ s[1].forEach(function(a){ maxT = Math.max(maxT, MIDS.reduce(function(n, m){ return n + a[m]; }, 0)); }); });
    var unit = (B - T) / maxT, step = maxT <= 8 ? 1 : maxT <= 16 ? 2 : 4, h = '<svg class="mt-bars" viewBox="0 0 ' + W + ' 214" role="img" focusable="false" aria-label="' + esc(barsDesc(ser)) + '">';
    for (var y = 0; y <= maxT; y += step) h += '<line class="mt-grid" x1="' + Lx + '" x2="' + W + '" y1="' + (B - y * unit).toFixed(1) + '" y2="' + (B - y * unit).toFixed(1) + '"/><text class="mt-ax" x="' + (Lx - 5) + '" y="' + (B - y * unit + 3.5).toFixed(1) + '" text-anchor="end">' + y + "</text>";
    for (var i = 0; i < 5; i++) {
      var x0 = Lx + i * colW, bw = ser.length === 2 ? colW * 0.34 : colW * 0.46;
      h += '<g class="mt-barg" data-a="' + i + '">';
      ser.forEach(function(s, si){
        var bx = ser.length === 2 ? x0 + colW * 0.12 + si * (bw + colW * 0.08) : x0 + (colW - bw) / 2, cum = 0;
        MIDS.forEach(function(m){
          var n = s[1][i][m]; if (!n) return;
          var yy = B - (cum + n) * unit, hh = n * unit;
          h += '<rect class="mt-seg mt-m-' + m + (s[0] === "k" ? " mt-kseg" : "") + '" x="' + bx.toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '"/>';
          if (hh >= 11) h += '<text class="mt-segn' + (s[0] === "k" ? " k" : "") + '" x="' + (bx + bw / 2).toFixed(1) + '" y="' + (yy + hh / 2 + 3.5).toFixed(1) + '" text-anchor="middle">' + n + "</text>";
          cum += n;
        });
        if (ser.length === 2 || fx.keyOnly) h += '<text class="mt-sub" x="' + (bx + bw / 2).toFixed(1) + '" y="' + (B + 11) + '" text-anchor="middle">' + (s[0] === "k" ? L.keyT : L.you) + "</text>";
      });
      h += '</g><text class="mt-ax mt-actl" x="' + (x0 + colW / 2).toFixed(1) + '" y="' + (B + (ser.length === 2 || fx.keyOnly ? 26 : 16)) + '" text-anchor="middle">Act ' + (i + 1) + "</text>";
    }
    return h + '<line class="mt-axis" x1="' + Lx + '" x2="' + W + '" y1="' + B + '" y2="' + B + '"/></svg>';
  }
  function barsDesc(ser){
    return ser.map(function(s){ return (s[0] === "k" ? "Key" : "Your tags") + ": " + s[1].map(function(a, i){ return "Act " + (i + 1) + " " + MIDS.map(function(m){ return motif(m).short + " " + a[m]; }).join(", "); }).join("; "); }).join(". ") + ".";
  }
  function growBars(){
    if (grow) { grow(); grow = null; }
    var gs = $$("#mt-bars .mt-barg"); if (!gs.length) return;
    function set(t){ gs.forEach(function(g, i){ var f = Math.max(0, Math.min(1, (t - i * 0.12) / 0.52)); g.setAttribute("transform", "translate(0 178) scale(1 " + f.toFixed(3) + ") translate(0 -178)"); }); }
    set(0);
    grow = MV.tween({ dur:1300, step:set, done:function(){ grow = null; } });
  }
  var TLW = 640, TL0 = 84, TL1 = 630;
  function tlX(c, offset){ var w = (TL1 - TL0) / 5; return TL0 + (c.act - 1) * w + w * ((c.sc - 0.5) / C.scenes[c.act - 1]) + offset; }
  function tlSVG(){
    var rows = { dis:30, poi:68, act:106, mor:144 }, w = (TL1 - TL0) / 5, h = '<svg class="mt-tl" viewBox="0 0 ' + TLW + ' 190" role="img" focusable="false" aria-label="' + esc(tlDesc()) + '">';
    for (var a = 0; a <= 5; a++) h += '<line class="mt-grid" x1="' + (TL0 + a * w).toFixed(1) + '" x2="' + (TL0 + a * w).toFixed(1) + '" y1="10" y2="162"/>';
    for (a = 0; a < 5; a++) h += '<text class="mt-ax" x="' + (TL0 + a * w + w / 2).toFixed(1) + '" y="180" text-anchor="middle">Act ' + (a + 1) + "</text>";
    MIDS.forEach(function(m){ h += '<line class="mt-rowl" x1="' + TL0 + '" x2="' + TL1 + '" y1="' + rows[m] + '" y2="' + rows[m] + '"/><text class="mt-rowt mt-m-' + m + '" x="' + (TL0 - 8) + '" y="' + (rows[m] + 4) + '" text-anchor="end">' + motif(m).short + "</text>"; });
    function place(list){ var grp = {}, out = []; list.forEach(function(x){ var k = x.m + x.c.act + "." + x.c.sc; (grp[k] = grp[k] || []).push(x); }); Object.keys(grp).forEach(function(k){ var g = grp[k]; g.forEach(function(x, i){ out.push({ c:x.c, m:x.m, i:i, x:tlX(x.c, (i - (g.length - 1) / 2) * 16) }); }); }); return out; }
    var showKey = ((S.checked && S.keyOn) || fx.keyOnly) && fx.p2 == null, keyList = [];
    CO.forEach(function(c){ var p = keyOf(c).p; if (showKey || (fx.p2 && p === "mor")) keyList.push({ c:c, m:p }); });
    place(keyList).forEach(function(d){ h += '<circle class="mt-kdot' + (fx.p2 && d.m === "mor" ? " mt-pop" : "") + '" cx="' + d.x.toFixed(1) + '" cy="' + rows[d.m] + '" r="9"/>'; });
    if (!fx.keyOnly) {
      var stu = [];
      CO.forEach(function(c){ tagsOf(S, c.id).forEach(function(m){ if (rows[m]) stu.push({ c:c, m:m }); }); });
      place(stu).forEach(function(d){ h += '<circle class="mt-dot mt-m-' + d.m + '" cx="' + d.x.toFixed(1) + '" cy="' + rows[d.m] + '" r="6"/><text class="mt-dotl" x="' + d.x.toFixed(1) + '" y="' + (d.i % 2 ? rows[d.m] + 19 : rows[d.m] - 10) + '" text-anchor="middle">' + d.c.id + "</text>"; });
    }
    return h + "</svg>";
  }
  function tlDesc(){
    return "Placement along the play. " + MIDS.map(function(m){ var ids = CO.filter(function(c){ return has(tagsOf(S, c.id), m); }).map(function(c){ return c.id + " (" + c.act + "." + c.sc + ")"; }); return motif(m).t + ": " + (ids.length ? ids.join(", ") : "none"); }).join("; ") + "." +
      (fx.p2 ? " Key mortality passages: C8 (2.2), C18 (5.1), C19 (5.1)." : "");
  }
  function speakers(m, useKey){
    var o = {}, order = [];
    CO.forEach(function(c){ var on = useKey ? keyOf(c).p === m : has(tagsOf(S, c.id), m); if (!on) return; var w = shortWho(c); if (!(w in o)) { o[w] = 0; order.push(w); } o[w]++; });
    order.sort(function(a, b){ return o[b] - o[a]; });
    return order.map(function(w){ return [w, o[w]]; });
  }
  function paintPattern(){
    var showKey = S.checked && S.keyOn;
    $("#mt-keyt").setAttribute("aria-pressed", String(!!showKey));
    $("#mt-keyt").disabled = !S.checked;
    $("#mt-keynote").textContent = S.checked ? "" : L.keyLocked;
    $("#mt-bars").innerHTML = barsSVG();
    $("#mt-legend").innerHTML = C.motifs.map(function(m){ return '<span class="mt-leg mt-m-' + m.id + '"><i aria-hidden="true"></i>' + m.t + "</span>"; }).join("") + (showKey || fx.keyOnly ? '<span class="mt-leg mt-legk"><i aria-hidden="true"></i>' + L.keyT + " (outlined)</span>" : "");
    $("#mt-tl").innerHTML = tlSVG();
    var sp = speakers(S.focus, !!fx.keyOnly), mx = sp.reduce(function(n, x){ return Math.max(n, x[1]); }, 1);
    $("#mt-spk-h").textContent = L.speakers + ": " + motif(S.focus).t;
    $("#mt-spk").innerHTML = sp.length ? sp.map(function(x){ return '<div class="mt-srow"><span class="mt-sname">' + esc(x[0]) + '</span><span class="mt-sbar"><i class="mt-m-' + S.focus + '" style="width:' + Math.round(x[1] / mx * 100) + '%"></i></span><span class="mt-sn">' + x[1] + "</span></div>"; }).join("") : '<p class="tiny muted">' + RO.none + "</p>";
    $("#mt-aha").hidden = !(S.checked || S.ahaSeen);
    paintCase();
  }
  function paintCase(){
    var el = $("#mt-cp"); if (!el) return;
    var ids = S.case.ids;
    MV.keepFocus(el, function(){
      el.innerHTML = CO.filter(function(c){ return visible(c) || has(ids, c.id); }).map(function(c){ var on = has(ids, c.id); return '<button type="button" class="chip mt-cchip' + (on ? " on" : "") + '" data-cs="' + c.id + '" data-k="cs' + c.id + '" aria-pressed="' + on + '"><strong>' + c.id + "</strong> " + esc(shortWho(c)) + ": “" + esc(snip(c, 5)) + "”</button>"; }).join("");
    });
    $("#mt-csum").textContent = ids.length ? "Chosen: " + ids.join(", ") + (S.case.m ? " · " + motif(S.case.m).t : "") : "";
  }

  // ----- thread mode -----
  function demoThread(){ return CO.filter(function(c){ return keyOf(c).p === "dis"; }).map(function(c){ return c.id; }); }
  function curThread(){ if (fx.p4 != null && S.focus === "dis" && !has(threadOf(S, "dis"), "C3")) return demoThread(); return threadOf(S, S.focus); }
  function linkKey(m, a, b){ return m + "|" + a + "|" + b; }
  function paintThread(){
    var m = S.focus, th = curThread(), demo = th !== threadOf(S, m), el = $("#mt-thr");
    $("#mt-tsup").innerHTML = m === "mor" ? '<p class="mt-support" role="note">' + C.support + "</p>" : "";
    MV.keepFocus(el, function(){
      if (!th.length) { el.innerHTML = '<p class="tiny muted">' + L.emptyThread + "</p>"; return; }
      var h = demo ? '<p class="tiny muted">The key’s Disease & decay thread, shown for this prediction.</p>' : "";
      th.forEach(function(id, i){
        var c = card(id), broken = fx.p4 === 1 && (id === "C3");
        if (i > 0) {
          var prev = th[i - 1], k = linkKey(m, prev, id), brk = fx.p4 === 1 && (id === "C3" || prev === "C3");
          h += '<div class="mt-tlink' + (brk ? " mt-broken" : "") + '"><span class="mt-arrow" aria-hidden="true">↓</span>' +
            (demo ? '<span class="tiny muted">' + prev + " → " + id + "</span>" : '<label class="vh" for="mt-l-' + prev + id + '">' + L.link + " (" + prev + " → " + id + ')</label><input type="text" class="txtin mt-linkin" id="mt-l-' + prev + id + '" data-link="' + k + '" autocomplete="off" placeholder="' + esc(L.link) + '" value="' + esc(S.links[k] || "") + '">') + "</div>";
        }
        h += '<div class="mt-ti mt-m-' + m + (broken ? " mt-broken" : "") + (lifted === id ? " mt-lift" : "") + '"><span class="mt-tn">' + (i + 1) + '</span><div class="mt-tc"><strong>' + id + '</strong> <span class="mt-cref">' + c.ref + "</span> · " + esc(shortWho(c)) + '<br><span class="mt-tt">“' + esc(c.text) + "”</span></div>" +
          (demo ? "" : '<span class="mt-tb"><button type="button" class="btn ghost sm" data-th="up" data-id="' + id + '" data-k="tu' + id + '"' + (i === 0 ? " disabled" : "") + ' aria-label="' + L.up + " " + id + '">↑</button><button type="button" class="btn ghost sm" data-th="down" data-id="' + id + '" data-k="td' + id + '"' + (i === th.length - 1 ? " disabled" : "") + ' aria-label="' + L.down + " " + id + '">↓</button><button type="button" class="btn ghost sm" data-th="rm" data-id="' + id + '" data-k="tr' + id + '" aria-label="' + L.remove + " " + id + '">✕</button></span>') + "</div>";
      });
      el.innerHTML = h;
    });
    lifted = null;
    var tray = CO.filter(function(c){ return has(tagsOf(S, c.id), m) && !has(threadOf(S, m), c.id); }).sort(function(a, b){ return playPos(a) - playPos(b); });
    MV.keepFocus($("#mt-tray"), function(){
      $("#mt-tray").innerHTML = tray.length ? tray.map(function(c){ return '<button type="button" class="chip mt-addc" data-th="add" data-id="' + c.id + '" data-k="ta' + c.id + '">+ ' + L.add + " <strong>" + c.id + "</strong> " + c.ref + "</button>"; }).join("") : '<p class="tiny muted">' + (CO.some(function(c){ return has(tagsOf(S, c.id), m); }) ? "Every passage tagged with this motif is in your thread." : L.emptyTray) + "</p>";
    });
    $("#mt-turn").hidden = m !== "poi";
  }
  function threadAct(kind, id){
    var th = threadOf(S, S.focus), i = th.indexOf(id);
    if (kind === "add" && i < 0) { th.push(id); lifted = MV.reduceMotion ? null : id; }
    if (kind === "rm" && i >= 0) th.splice(i, 1);
    if (kind === "up" && i > 0) { th.splice(i, 1); th.splice(i - 1, 0, id); }
    if (kind === "down" && i >= 0 && i < th.length - 1) { th.splice(i, 1); th.splice(i + 1, 0, id); }
    api.save(); paintThread(); paintRead(); MV.changed();
    if (kind === "add" || kind === "rm") { var f = $('#mt-tray [data-th="add"]') || $('#mt-thr [data-th="rm"]'); if (f && !host.contains(document.activeElement)) f.focus(); }
  }

  // ----- readout -----
  function busiest(m){
    var st = countsBy(S, false), mx = 0, acts = [];
    st.forEach(function(a, i){ if (a[m] > mx) { mx = a[m]; acts = [i + 1]; } else if (a[m] === mx && mx > 0) acts.push(i + 1); });
    return mx ? motif(m).t + ": " + (acts.length > 1 ? "Acts " + andList(acts.map(String)) : "Act " + acts[0]) : '<span class="muted">' + motif(m).t + ": " + RO.none + "</span>";
  }
  function paintRead(){
    var tagged = CO.filter(function(c){ return tagsOf(S, c.id).length; }).length, tot = totals(countsBy(S, false)), kt = totals(countsBy(S, true)), m = S.focus;
    var rows = [[RO.tagged, (fx.blank ? 0 : tagged) + " / " + CO.length]];
    rows.push([RO.counts, MIDS.map(function(x){ return motif(x).short + " " + (fx.blank ? 0 : tot[x]) + (S.checked ? ' <span class="muted">(key ' + kt[x] + ")</span>" : ""); }).join(" · ")]);
    rows.push([RO.busiest, busiest(m)]);
    var sp = speakers(m, false);
    rows.push([RO.speakers, sp.length ? sp.map(function(x){ return esc(x[0]) + " " + x[1]; }).join(" · ") : '<span class="muted">' + RO.none + "</span>"]);
    var th = curThread(), links = 0;
    for (var i = 1; i < th.length; i++) if ((S.links[linkKey(m, th[i - 1], th[i])] || "").trim()) links++;
    rows.push([RO.thread, fx.p4 === 1 ? "<strong>" + C.p4.broken + "</strong>" : motif(m).t + ": " + th.length + " passage" + (th.length === 1 ? "" : "s") + ", " + links + " link" + (links === 1 ? "" : "s") + " written"]);
    var c = card(S.open);
    if (c) rows.push([RO.open, c.id + " · " + esc(fx.p3 && c.id === "C6" ? C.p3.swap : shortWho(c)) + ' · <span class="' + (fx.p3 ? "flash" : "") + '">' + esc(fx.p3 && c.id === "C6" ? C.p3.after : c.aim) + "</span>"]);
    $("#mt-read").innerHTML = MV.readoutHTML(rows);
  }
  function paintMode(){
    ["tag", "pattern", "threadv"].forEach(function(k){ $("#mt-" + k).hidden = (k === "threadv" ? "thread" : k) !== S.mode; });
    if (S.mode === "pattern") paintPattern();
    if (S.mode === "thread") paintThread();
  }
  function paintAll(){ paintStrip(); paintPanel(); paintMode(); paintRead(); }

  // ----- read aloud (local voice) -----
  function readCard(){
    var c = card(S.open); if (!c || !VOICE) return;
    if (readTok) { stopRead(); paintPanel(); return; }
    readTok = readChunks(linesOf(c).map(function(l){ return [l, 0.85, 0]; }), null, function(){ readTok = null; paintPanel(); });
    paintPanel();
  }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var had = !!(fx.blank || fx.keyOnly || fx.p2 || fx.p3 || fx.p4 != null); fx = {};
    if (b.dataset.rg != null) { if (had) paintAll(); return; }
    if (b.dataset.card) { stopRead(); S.open = S.open === b.dataset.card ? "" : b.dataset.card; api.save(); paintStrip(); paintPanel(); if (had) paintMode(); paintRead(); var p = $("#mt-panel .mt-pan"); if (p && S.open && window.innerWidth < 700) p.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    if (b.dataset.tagm) { toggleTag(b.dataset.tagm); return; }
    if (b.dataset.act === "close") { stopRead(); var id = S.open; S.open = ""; api.save(); paintStrip(); paintPanel(); paintRead(); var cb = $('#mt-strip [data-card="' + id + '"]'); if (cb) cb.focus(); return; }
    if (b.dataset.act === "read") { readCard(); return; }
    if (b.id === "mt-check") { checkTags(); return; }
    if (b.id === "mt-keyt") { S.keyOn = !S.keyOn; api.save(); paintPattern(); paintRead(); return; }
    if (b.dataset.th) { threadAct(b.dataset.th, b.dataset.id); return; }
    if (b.dataset.cs) { var ids = S.case.ids, j = ids.indexOf(b.dataset.cs); if (j >= 0) ids.splice(j, 1); else ids.push(b.dataset.cs); api.save(); paintCase(); MV.changed(); return; }
    if (had) paintAll();
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset.link) return;
    S.links[t.dataset.link] = t.value; api.save(); paintRead();
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".mt-setup"); if (!b) return;
    var id = b.dataset.setup; fx = {};
    if (id === "tc1") { S.fAct = "all"; S.fWho = "all"; S.fMot = "all"; fA.set("all"); fW.set("all"); fM.set("all"); if (S.mode !== "tag") setMode("tag", true); else paintAll(); }
    if (id === "tc2") { S.focus = "poi"; pFocus.set("poi"); tFocus.set("poi"); setMode("thread", true); }
    if (id === "tc3") { setMode("pattern", true); }
    api.save();
    var t = $(id === "tc1" ? "#mt-strip-h" : id === "tc2" ? "#mt-tfocus" : "#mt-case"); if (t) t.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  // ----- TC1 worked solution: the first card that doesn't match yet -----
  function firstWrong(){ for (var i = 0; i < CO.length; i++) if (!cardOK(S, CO[i])) return CO[i]; return null; }
  function fillH3(){
    var c = firstWrong(), html = c ? "<strong>" + c.id + "</strong> (“" + esc(snip(c, 5)) + "”) is <strong>" + motif(keyOf(c).p).t + "</strong>" + (keyOf(c).also.length ? " (" + keyOf(c).also.map(function(m){ return motif(m).t; }).join(", ") + " is also accepted)" : "") + ": " + c.why : "Every card matches the key. Press <strong>Check challenge</strong>.";
    $$(".mt-h3").forEach(function(s){ if (s.dataset.h !== html) { s.dataset.h = html; s.innerHTML = html; } }); // innerHTML re-serializes "&": compare a stored copy
  }
  var chal = $("#chal"); if (chal && window.MutationObserver) new MutationObserver(fillH3).observe(chal, { childList:true, subtree:true });

  // ----- full corpus (Explore sheet below) -----
  var full = $("#mt-full");
  if (full) full.innerHTML = '<ol class="mt-fulll">' + CO.map(function(c){ return "<li><strong>" + c.id + "</strong> · " + esc(c.who) + ": “" + esc(c.text) + "” " + "(<i>Hamlet</i> " + c.ref + ")</li>"; }).join("") + "</ol>";

  paintAll();
  voiceReady(function(){ paintPanel(); });

  EX = {
    stop:function(){ stopRead(); },
    predict:{
      start:function(p){
        stopRead(); if (grow) { grow(); grow = null; } fx = {};
        if (p.id === "p1") { fx.blank = true; S.open = ""; setMode("tag", true); }
        if (p.id === "p2") { S.focus = "mor"; pFocus.set("mor"); tFocus.set("mor"); fx.p2 = 0; setMode("pattern", true); }
        if (p.id === "p3") { S.open = "C6"; paintAll(); }
        if (p.id === "p4") { S.open = "C3"; S.focus = "dis"; pFocus.set("dis"); tFocus.set("dis"); fx.p4 = 0; setMode("thread", true); }
        api.save(); paintAll();
      },
      run:function(p, done){
        if (p.id === "p1") {
          MV.wait(300, function(){ fx = { keyOnly:true }; S.ahaSeen = true; setMode("pattern", true); growBars(); MV.wait(1500, done); });
        } else if (p.id === "p2") {
          MV.wait(300, function(){ fx.p2 = 1; paintPattern(); MV.wait(1300, done); });
        } else if (p.id === "p3") {
          MV.wait(300, function(){ fx.p3 = true; paintPanel(); paintRead(); MV.wait(1400, done); });
        } else if (p.id === "p4") {
          MV.wait(300, function(){ fx.p4 = 1; paintPanel(); paintThread(); paintRead(); MV.wait(1500, done); });
        } else done();
      }
    },
    challenge:function(id, opt){
      var CL = C.challenges, ch = byId(CL, id);
      if (id === "tc1") {
        var un = CO.filter(function(c){ return !tagsOf(S, c.id).length; }).length;
        if (un) return { ok:false, msg:ch.msgs.untagged.replace("{n}", un) };
        var bad = CO.filter(function(c){ return !cardOK(S, c); });
        if (!bad.length) return { ok:true };
        var T = function(x){ return tagsOf(S, x); };
        if (T("C14").length === 1 && T("C14")[0] === "poi") return { ok:false, msg:ch.msgs.C14 };
        if (has(T("C13"), "mor")) return { ok:false, msg:ch.msgs.C13 };
        if (has(T("C16"), "poi")) return { ok:false, msg:ch.msgs.C16 };
        if (T("C10").length === 1 && T("C10")[0] === "act") return { ok:false, msg:ch.msgs.C10 };
        if (CO.some(function(c){ return has(T(c.id), "none"); })) return { ok:false, msg:ch.msgs.none };
        return { ok:false, msg:ch.general.replace("{n}", bad.length) };
      }
      if (id === "tc2") {
        var want = MV.ans(ch) || [], th = threadOf(S, "poi");
        var exact = th.length === want.length && th.every(function(x, i){ return x === want[i]; });
        var turnOK = MV.ok(byId(C.turns, S.turn));
        if (exact && turnOK) return { ok:true };
        if (!th.length) return { ok:false, msg:ch.general };
        if (!has(th, "C17")) return { ok:false, msg:ch.msgs.C17 };
        if (!has(th, "C10")) return { ok:false, msg:ch.msgs.C10 };
        var extra = th.filter(function(x){ return !has(want, x); });
        if (extra.length) return { ok:false, msg:ch.msgs.extra.replace("{ids}", andList(extra)) };
        if (th.length < want.length) return { ok:false, msg:ch.msgs.missing };
        if (!exact) return { ok:false, msg:ch.msgs.order };
        if (!S.turn) return { ok:false, msg:ch.msgs.noTurn };
        return { ok:false, msg:byId(C.turns, S.turn).fb };
      }
      if (id === "tc3") {
        var A = MV.ans(ch) || {}, cs = S.case;
        if (!cs.m || cs.ids.length !== 2) return { ok:false, msg:ch.msgs.choose };
        var ok3 = cs.m === A.m && A.ids.every(function(x){ return has(cs.ids, x); });
        if (ok3) { if (!opt || !opt.live) MV.banner("good", ch.banner); return { ok:true }; }
        if (cs.m === "act" && has(cs.ids, "C13")) return { ok:false, msg:ch.msgs.act };
        if (cs.m === "poi" && has(cs.ids, "C17")) return { ok:false, msg:ch.msgs.poi };
        if (cs.m === "dis" && (has(cs.ids, "C14") || has(cs.ids, "C15"))) return { ok:false, msg:ch.msgs.hamlet };
        return { ok:false, msg:ch.general };
      }
      return { ok:false };
    }
  };
  return EX;
}

// ---------- Part 3: From topic to thematic statement (Station 1 cards; Station 2 @component E7 thesisForge (statement form):
// topic + verb chips, "…that" text, evidence tray and rule-based live flags; Station 3 tests the statement against a thread) ----------
function forgeFlags(text, verb, evN, P){
  var F = P.s2, t = String(text || "").trim().replace(/[.!?]+$/, ""), low = t.toLowerCase().replace(/’/g, "'"), out = [];
  var full = "Hamlet " + (verb || "suggests") + " that " + t;
  if (!t || wc(full) < 8) out.push("short");
  if (F.commands.some(function(w){ w = w.replace(/’/g, "'"); return low === w || low.indexOf(w + " ") === 0; })) out.push("command");
  if (F.broad.some(function(w){ return new RegExp("(^|[^a-z])" + w + "([^a-z]|$)").test(low); })) out.push("broad");
  if (evN < 2) out.push("noEv");
  return out;
}
function part3(host, api){
  var P = api.content, S = api.S, F = P.s2, X = P.s3;
  S.rev = S.rev || {}; S.ev = Array.isArray(S.ev) ? S.ev : []; S.marks = S.marks || {};
  var CO = corpus(), EXS = function(){ return MV.S.app.explore || {}; };
  host.innerHTML = '<div class="mt-p3">' +
    '<section class="mt-st"><h4 class="mt-h">' + P.s1.title + '</h4><p class="how">' + P.s1.how + '</p><div class="mt-s1" id="mt-s1"></div></section>' +
    '<section class="mt-st"><h4 class="mt-h">' + F.title + '</h4><p class="how">' + F.how + '</p><div id="mt-ftop"></div><div id="mt-fverb"></div>' +
      '<p class="tiny muted" id="mt-fask" aria-live="polite"></p>' +
      '<div class="jq mt-frame"><label for="mt-ftext"><em>Hamlet</em> <span id="mt-fv">suggests</span> ' + F.textL + '</label><input type="text" class="txtin" id="mt-ftext" autocomplete="off" placeholder="' + esc(MV.plain(F.textPh)) + '"></div>' +
      '<p class="mt-fout" id="mt-fout" aria-live="polite"></p><ul class="mt-flags" id="mt-flags" aria-live="polite"></ul>' +
      '<p class="mt-lab">' + F.evL + '</p><div class="mt-chiplist" id="mt-fev" role="group" aria-label="' + esc(MV.plain(F.evL)) + '"></div></section>' +
    '<section class="mt-st"><h4 class="mt-h">' + X.title + '</h4><p class="how">' + X.how + '</p><p class="mt-fout" id="mt-s3st"></p><div id="mt-s3m"></div><p class="mt-lab">' + X.prompt + '</p><div id="mt-s3list"></div><div id="mt-s3msg" aria-live="polite"></div></section></div>';

  function paintS1(){
    MV.keepFocus($("#mt-s1"), function(){
      $("#mt-s1").innerHTML = P.s1.cards.map(function(c, i){ var on = !!S.rev[i]; return '<button type="button" class="mt-s1c' + (on ? " on" : "") + '" data-s1="' + i + '" data-k="s1' + i + '" aria-expanded="' + on + '"><span class="mt-s1t">' + c.t + "</span>" + (on ? '<span class="mt-s1k">' + c.kind + '</span><span class="mt-s1f">' + c.fb + "</span>" : '<span class="mt-s1k muted">Tap to label</span>') + "</button>"; }).join("");
    });
  }
  radios($("#mt-ftop"), { label:F.topicL, cls:"chips", options:F.topics.map(function(t){ return { id:t, t:t }; }), value:S.topic || "", onChange:function(v){ S.topic = v; api.save(); paintForge(); } });
  radios($("#mt-fverb"), { label:F.verbL, cls:"chips", options:F.verbs.map(function(t){ return { id:t, t:t }; }), value:S.verb || "suggests", onChange:function(v){ S.verb = v; api.save(); paintForge(); } });
  var ti = $("#mt-ftext"); ti.value = S.text || "";
  ti.addEventListener("input", function(){ S.text = ti.value; api.save(); paintForge(); });
  function statement(){ var t = String(S.text || "").trim().replace(/[.!?]+$/, ""); return t ? "<em>Hamlet</em> " + esc(S.verb || "suggests") + " that " + esc(t) + "." : ""; }
  function paintForge(){
    $("#mt-fv").textContent = S.verb || "suggests";
    $("#mt-fask").textContent = S.topic ? F.ask.replace("{topic}", S.topic) : "";
    var st = statement(), fl = forgeFlags(S.text, S.verb, S.ev.length, P);
    $("#mt-fout").innerHTML = st ? "<strong>Your statement:</strong> " + st : '<span class="muted">Finish the sentence and your statement assembles here.</span>';
    $("#mt-flags").innerHTML = !String(S.text || "").trim() && !S.ev.length ? "" : fl.length ? fl.map(function(k){ return '<li><span aria-hidden="true">⚑</span> ' + F.flags[k] + "</li>"; }).join("") : '<li class="ok"><span aria-hidden="true">✓</span> ' + F.flags.ok + "</li>";
    MV.keepFocus($("#mt-fev"), function(){
      $("#mt-fev").innerHTML = CO.map(function(c){ var on = has(S.ev, c.id); return '<button type="button" class="chip mt-cchip' + (on ? " on" : "") + '" data-ev="' + c.id + '" data-k="ev' + c.id + '" aria-pressed="' + on + '"><strong>' + c.id + "</strong> “" + esc(snip(c, 5)) + "”</button>"; }).join("");
    });
    paintS3();
  }
  var thR = null;
  function threads(){ var th = EXS().thread || {}; return th; }
  function paintS3(){
    var st = statement(), m = S.tm || (EXS().focus) || "dis";
    $("#mt-s3st").innerHTML = st ? "<strong>Your statement:</strong> " + st : '<span class="muted">' + X.noStatement + "</span>";
    if (!thR) thR = radios($("#mt-s3m"), { label:X.threadL, cls:"chips", options:EXC().motifs.map(function(x){ return { id:x.id, t:x.t, cls:"mt-m-" + x.id + " mt-rgm" }; }), value:m, onChange:function(v){ S.tm = v; api.save(); paintS3(); } });
    var ids = (threads()[m] || []).slice(), usingEv = false;
    if (!ids.length && S.ev.length) { ids = S.ev.slice().sort(function(a, b){ return playPos(card(a)) - playPos(card(b)); }); usingEv = true; }
    var mk = S.marks[usingEv ? "ev" : m] || (S.marks[usingEv ? "ev" : m] = {}), list = $("#mt-s3list");
    if (!ids.length) { list.innerHTML = '<p class="tiny muted">' + X.noPass + "</p>"; $("#mt-s3msg").innerHTML = ""; return; }
    list.innerHTML = (usingEv ? '<p class="tiny muted">' + X.useEv + "</p>" : "") + '<ol class="mt-s3l">' + ids.map(function(id){ var c = card(id); return '<li><p class="mt-s3t"><strong>' + id + "</strong> “" + esc(c.text) + "” (" + c.ref + ')</p><div data-s3="' + id + '"></div></li>'; }).join("") + "</ol>";
    ids.forEach(function(id){ radios($('[data-s3="' + id + '"]', list), { aria:"Mark " + id, cls:"chips", options:X.marks, value:mk[id] || "", onChange:function(v){ mk[id] = v; api.save(); msg(); } }); });
    function msg(){
      var vals = ids.map(function(id){ return mk[id] || ""; });
      $("#mt-s3msg").innerHTML = vals.indexOf("X") >= 0 ? MV.fbHTML("bad", X.revise) : vals.every(Boolean) && st ? MV.fbHTML("good", "<strong>✓</strong> " + X.holds) : "";
    }
    msg();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.s1 != null) { S.rev[b.dataset.s1] = !S.rev[b.dataset.s1]; api.save(); paintS1(); return; }
    if (b.dataset.ev) { var i = S.ev.indexOf(b.dataset.ev); if (i >= 0) S.ev.splice(i, 1); else S.ev.push(b.dataset.ev); api.save(); paintForge(); }
  });
  paintS1(); paintForge();

  // Sentence to steal: save the imitation to the commonplace book (with the master's line)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#mt-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="mt-steal-save">' + ST.save + '</button><span class="tiny muted" id="mt-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "mt-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#mt-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#mt-steal-st").textContent = "Saved your imitation to your commonplace book.";
    });
  }
  return { refresh:paintS3 };
}

// ---------- structure tests shared by B6 and the task ----------
// quotations: “…”, "…", ‘…’ (not apostrophes); returns [{a, b, inner}]
function quoteSpans(t){
  var s = String(t || ""), out = [], m, res = [/“([^”]+)”/g, /"([^"]+)"/g, /‘([^’]+?)’(?![A-Za-z])/g, /(?:^|[\s(\[—–-])'([^']+?)'(?=[\s.,;:!?)\]—–-]|$)/g];
  res.forEach(function(re){ while ((m = re.exec(s))) { var a = m.index + m[0].indexOf(m[1]) - 1; out.push({ a:a, b:a + m[1].length + 2, inner:m[1] }); } });
  return out.filter(function(q){ return wc(q.inner) >= 1; });
}
var CITE_RE = /\(\s*(?:[*_]?(?:Hamlet|Macbeth)[*_]?\s+)?([1-5])\.(\d+)\.(\d+)(?:\s*[–—-]\s*(\d+))?\s*\)/g;
function verbRE(v){
  var base = /ies$/.test(v) ? v.slice(0, -3) + "y" : /(ses|zes|xes|ches|shes)$/.test(v) ? v.slice(0, -2) : v.slice(0, -1);
  var f = /y$/.test(base) ? [base, base.slice(0, -1) + "ies", base.slice(0, -1) + "ied", base + "ing"] : /e$/.test(base) ? [base, base + "s", base + "d", base.slice(0, -1) + "ing"]
    : /cut$/.test(base) ? [base, base + "s", base + "ting"] : [base, base + "s", base + "es", base + "ed", base + "ing"];
  return new RegExp("\\b(" + f.join("|") + ")\\b", "i");
}
function hasVerb(t, list){ return (list || []).some(function(v){ return verbRE(v).test(String(t || "")); }); }

// ---------- Practice 2: Unseen pattern (toolkit MC for B1–B5 + a structured sentence for B6) ----------
function blood(host, api, a){
  var B = api.S, W = a.write; B.w = B.w || { text:"", tries:0, hint:0, solved:false, first:null, checked:false };
  host.innerHTML = '<div class="mt-pass"><p class="mt-lab">' + a.passagesTitle + '</p><ol class="mt-passl">' + a.passages.map(function(p){ return '<li><span class="mt-pk">(' + p.k + ")</span> “" + esc(p.text) + "” <span class=\"mt-cref\">(" + p.ref + ", " + esc(p.who) + ")</span></li>"; }).join("") + "</ol></div>" +
    '<div id="bl-mc"></div><div class="q mt-b6" id="bl-w"></div>';
  var sub = { id:a.id + "-mc", items:a.items, summary:a.summary, goal:a.goal };
  var mc = MV.activityTypes.mc($("#bl-mc", host), sub);
  function citeOK(t){ var re = new RegExp(CITE_RE.source, "g"), m; while ((m = re.exec(t))) { var ref = m[1] + "." + m[2] + "." + m[3] + (m[4] ? "–" + m[4] : ""); if (has(W.cites, ref)) return true; } return false; }
  function tests(t){ return { cite:citeOK(t), quote:quoteSpans(t).some(function(q){ return wc(q.inner) >= 2; }), verb:hasVerb(t, a.verbs) }; }
  var wbox = $("#bl-w", host);
  function paintW(){
    var x = B.w, h = '<div class="q-head"><span class="qn" aria-hidden="true">6</span><div class="q-prompt">' + W.prompt + "</div></div>";
    h += '<div class="jq"><label for="bl-ta">' + W.label + '</label><textarea id="bl-ta" rows="3"' + (x.solved ? " readonly" : "") + "></textarea></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="wcheck" data-k="b6chk">' + W.check + "</button>" + MV.hintBtn("b6hint", x.hint) + "</div>" + MV.hintsHTML(W.hints, x.hint);
    if (x.checked) {
      if (x.solved) h += MV.fbHTML("good", "<strong>✓ " + W.ok + "</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
      else if (x.last) h += MV.fbHTML("bad", "<strong>Not yet.</strong> " + ["cite", "quote", "verb"].filter(function(k){ return !x.last[k]; }).map(function(k){ return W.tips[k]; }).join(" "));
      h += '<details class="alg" open><summary>' + W.modelL + "</summary><p>" + W.model + "</p></details>";
    }
    MV.keepFocus(wbox, function(){ wbox.innerHTML = h; });
    var ta = $("#bl-ta", wbox); ta.value = x.text || "";
  }
  wbox.addEventListener("input", function(e){ if (e.target.id === "bl-ta") { B.w.text = e.target.value; MV.save(); } });
  wbox.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var x = B.w;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); MV.save(); paintW(); return; }
    if (b.dataset.act === "wcheck") {
      var r = tests(x.text); x.checked = true; x.last = r;
      if (r.cite && r.quote && r.verb) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
      MV.save(); paintW(); MV.focusFb(wbox);
    }
  });
  paintW();
  return {
    stats:function(){ var s = mc.stats(), f = s.first + (B.w.first ? 1 : 0), d = s.done + (B.w.solved ? 1 : 0), n = s.total + 1; return { first:f, total:n, done:d, line:a.summary + " (first try): " + f + "/" + n + (d < n ? " (unfinished)" : "") }; },
    missed:function(){ var g = mc.missed(); if (B.w.tries > 0 || B.w.hint >= 3) g = g.concat(MV.goalIdx(W.goal)); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 08; numbered sentences) ----------
// a: {id, student, summary, problems:[{id, goal, task, steps:[sentences], answer: index of first flawed sentence, stepFb:[…], fixes:[{t, ok, why}], hints:[3]}]}
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

// ---------- E17 draft compare (copied from ENG4U 08's draftWorkspace) ----------
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

// ---------- Performance task: Follow the thread (@component E6 paragraph builder with a quote picker + E17 drafts) ----------
function clean(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
function kwRE(w){ return new RegExp("(^|[^a-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(s|es|ed|d|ing|ting|ted|ous|y)?(?![a-z])", "i"); }
var taskChecks = {
  claim:function(d){
    var m = motif(d.motif); if (!m || !d.claim) return false;
    if (d.claim.toLowerCase().indexOf(m.t.toLowerCase()) >= 0) return true;
    return m.keys.concat(m.t.toLowerCase().split(/[^a-z]+/).filter(function(w){ return w.length > 2 && w !== "the"; })).some(function(w){ return kwRE(w).test(d.claim); });
  },
  acts:function(text){
    var acts = [], n = 0;
    quoteSpans(text).forEach(function(q){
      var rest = text.slice(q.b), re = new RegExp(CITE_RE.source), m = re.exec(rest);
      if (m && m.index <= 40) { n++; if (!has(acts, m[1])) acts.push(m[1]); }
    });
    return n >= 2 && acts.length >= 2;
  },
  analysis:function(d, T){ var filled = d.ev.filter(function(p){ return clean(p.e); }); return filled.length >= 2 && filled.every(function(p){ return wc(p.a) >= 20 && hasVerb(p.a, T.verbs); }); },
  link:function(link, T){ var l = clean(link), low = l.toLowerCase().replace(/’/g, "'"); if (wc(l) < 8) return false; if (T.commands.some(function(w){ w = w.replace(/’/g, "'"); return low === w || low.indexOf(w + " ") === 0; })) return false; return hasVerb(l, T.linkVerbs); },
  length:function(n, T){ return n >= T.min && n <= T.max; }
};
var task = (function(){
  var api = null, T = null, tok = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function pairs(S){ S.ev = Array.isArray(S.ev) && S.ev.length === 3 ? S.ev : [0, 1, 2].map(function(i){ return (S.ev && S.ev[i]) || { e:"", a:"" }; }); return S.ev; }
  function parts(S){ var out = [["claim", T.labels.claim, S.claim]]; pairs(S).forEach(function(p, k){ out.push(["ev", T.labels.ev + " " + (k + 1), p.e], ["an", T.labels.an + " " + (k + 1), p.a]); }); out.push(["link", "Link", S.link]); return out.filter(function(x){ return clean(x[2]); }); }
  function data(S){
    S = S || {}; if (!T) T = MV.C.task;
    var ev = [0, 1, 2].map(function(i){ var p = (Array.isArray(S.ev) && S.ev[i]) || {}; return { e:clean(p.e), a:clean(p.a) }; }), segs = [clean(S.claim)];
    ev.forEach(function(p){ segs.push(p.e, p.a); }); segs.push(clean(S.link));
    var text = segs.filter(Boolean).join(" ");
    return { motif:S.motif || "", claim:clean(S.claim), ev:ev, link:clean(S.link), text:text, n:wc(text), explain:explain() };
  }
  function checks(d){
    if (!T) T = MV.C.task;
    return [taskChecks.claim(d), taskChecks.acts(d.text), taskChecks.analysis(d, T), taskChecks.link(d.link, T), taskChecks.length(d.n, T)];
  }
  function slot(cls, id, tag, how, attrs, opt){ return '<div class="pb-slot mt-slot ' + cls + '"><label for="' + id + '"><span class="mt-ptag">' + tag + "</span>" + (opt ? ' <span class="muted">(' + T.labels.opt + ")</span>" : "") + ' <span class="tiny muted">' + how + '</span></label><textarea id="' + id + '" ' + attrs + "></textarea></div>"; }
  function counts(){ var d = data(api.S); $("#fl-count").textContent = d.n + " " + T.labels.words + " (" + T.min + "–" + T.max + ")"; }
  function preview(){
    var S = api.S, el = $("#fl-pv"); if (!el) return;
    var ps = parts(S);
    el.innerHTML = ps.length ? "<p>" + ps.map(function(x){ return '<span class="mt-pp mt-pp-' + x[0] + '"><span class="mt-pptag">' + esc(x[1]) + "</span>" + esc(clean(x[2])) + "</span>"; }).join(" ") + "</p>" : '<p class="tiny muted">Your paragraph appears here as you fill the slots, coloured by part: claim, evidence, analysis, link.</p>';
  }
  function models(){
    var el = $("#fl-models"); if (!el) return;
    if (checks(data(api.S)).every(Boolean)) api.S.unlocked = true;
    el.innerHTML = api.S.unlocked ? '<h4 class="mt-h">' + T.modelsLabel + "</h4>" + T.models.map(function(m){ return '<details class="alg mt-model"><summary>' + m.title + "</summary><p>" + m.text + "</p></details>"; }).join("") : "";
  }
  function drafts(){
    var S = api.S, D = S.drafts = Array.isArray(S.drafts) ? S.drafts : [], el = $("#fl-dlist");
    el.innerHTML = D.length ? '<p class="tiny">' + T.labels.drafts + ": " + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (S.cmp === i) + '">' + T.labels.cmp.replace("{n}", d.n) + "</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#fl-dcmp");
    if (S.cmp != null && D[S.cmp]) { var df = diffWords(D[S.cmp].t, data(S).text); cb.innerHTML = '<div class="mt-dcmp"><div><p class="tiny"><strong>Draft ' + D[S.cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
    else cb.innerHTML = "";
  }
  function all(){ api.save(); counts(); preview(); api.update(); models(); if (api.S.cmp != null) drafts(); }
  // quote picker
  function pickPaint(){
    var S = api.S, c = card(S.pick), host = $("#fl-toks");
    if (!c) { host.innerHTML = ""; $("#fl-addrow").hidden = true; return; }
    var toks = MV.eng.tokenize(linesOf(c));
    host.innerHTML = "<div></div>"; // a fresh element each time: MV.eng.tokens adds its listeners to the host it is given
    tok = MV.eng.tokens(host.firstChild, toks, { label:"Words of " + c.id + ": tap to choose" });
    $("#fl-addrow").hidden = false;
  }
  function pickedQuote(){
    var c = card(api.S.pick); if (!c || !tok) return null;
    var sel = tok.get(); if (!sel.length) return null;
    var toks = MV.eng.tokenize(linesOf(c)), a = Math.min.apply(null, sel), b = Math.max.apply(null, sel), out = "", line = toks[a].line;
    for (var i = a; i <= b; i++) { if (toks[i].line !== line) { out += " /"; line = toks[i].line; } out += (i > a ? " " : "") + toks[i].t; }
    out = out.replace(/^[“"‘(]+/, "").replace(/[,;:.]+$/, "");
    var r = c.ref.split("."), first = parseInt(r[2], 10), l0 = toks[a].line, l1 = toks[b].line;
    var cite = c.prose ? c.ref : r[0] + "." + r[1] + "." + (first + l0) + (l1 > l0 ? "–" + (first + l1) : "");
    return "“" + out + "” (" + cite + ")";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, lab = T.labels; pairs(S);
      inp.innerHTML = '<div class="mt-task"><div id="fl-motif"></div>' +
        slot("pb-claim mt-s-claim", "fl-claim", lab.claim, lab.claimHow, 'data-fl="claim" rows="2"') +
        '<details class="alg mt-picker" open><summary>' + lab.picker + '</summary><p class="tiny muted">' + lab.pickHow + '</p><label class="mt-lab" for="fl-pick">' + lab.pickSel + '</label><select id="fl-pick" class="mt-sel"><option value="">' + lab.pickNone + "</option>" +
          corpus().map(function(c){ return '<option value="' + c.id + '">' + c.id + " · " + c.ref + " · " + esc(shortWho(c)) + ": " + esc(MV.plain(snip(c, 5))) + "</option>"; }).join("") + '</select><div id="fl-toks" class="mt-toks"></div>' +
          '<div class="q-actions" id="fl-addrow" hidden><span class="tiny">' + lab.addTo + ":</span>" + [0, 1, 2].map(function(k){ return '<button type="button" class="btn ghost sm" data-qadd="' + k + '" data-k="qa' + k + '">' + (k + 1) + "</button>"; }).join("") + '<span class="tiny muted" id="fl-qmsg" aria-live="polite"></span></div></details>' +
        [0, 1, 2].map(function(k){ return '<div class="mt-pair">' + slot("pb-ev mt-s-ev", "fl-e" + k, lab.ev + " " + (k + 1), lab.evHow, 'data-fl="e" data-i="' + k + '" rows="2"', k === 2) + slot("pb-an mt-s-an", "fl-a" + k, lab.an + " " + (k + 1), lab.anHow, 'data-fl="a" data-i="' + k + '" rows="3"', k === 2) + "</div>"; }).join("") +
        slot("pb-link mt-s-link", "fl-link", lab.link, lab.linkHow, 'data-fl="link" rows="2"') +
        '<p class="tiny muted">' + lab.bank + '</p><div class="q-actions"><span class="tiny" id="fl-count" aria-live="polite"></span><button type="button" class="btn ghost sm" id="fl-dsave">' + lab.draft + '</button></div><div id="fl-dlist"></div><div id="fl-dcmp" aria-live="polite"></div></div>';
      pv.innerHTML = '<h4 class="mt-h" style="margin-top:0">' + lab.pv + '</h4><div id="fl-pv" class="mt-pv"></div><div id="fl-models"></div>';
      radios($("#fl-motif"), { label:lab.motif, cls:"chips", options:EXC().motifs.map(function(m){ return { id:m.id, t:m.t, cls:"mt-m-" + m.id + " mt-rgm" }; }), value:S.motif || "", onChange:function(v){ S.motif = v; all(); } });
      $("#fl-claim").value = S.claim || ""; $("#fl-link").value = S.link || "";
      S.ev.forEach(function(p, k){ $("#fl-e" + k).value = p.e || ""; $("#fl-a" + k).value = p.a || ""; });
      var sel = $("#fl-pick"); sel.value = S.pick || "";
      sel.addEventListener("change", function(){ S.pick = sel.value; a.save(); pickPaint(); });
      inp.addEventListener("input", function(e){
        var t = e.target, k = t.dataset.fl; if (!k) return;
        if (k === "claim") S.claim = t.value; else if (k === "link") S.link = t.value; else if (k === "e") S.ev[+t.dataset.i].e = t.value; else if (k === "a") S.ev[+t.dataset.i].a = t.value;
        all();
      });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b) return;
        if (b.dataset.qadd != null) {
          var q = pickedQuote(), k = +b.dataset.qadd, ta = $("#fl-e" + k);
          if (!q) { $("#fl-qmsg").textContent = "Tap some words in the passage first."; return; }
          ta.value = (ta.value.trim() ? ta.value.replace(/\s+$/, "") + " " : "") + q; S.ev[k].e = ta.value; $("#fl-qmsg").textContent = "Added to evidence " + (k + 1) + "."; if (tok) tok.clear(); all(); return;
        }
        if (b.id === "fl-dsave") { var D = S.drafts = Array.isArray(S.drafts) ? S.drafts : [], t = data(S).text; if (!t) return; var n = D.length ? D[D.length - 1].n + 1 : 1; D.push({ n:n, t:t }); while (D.length > 3) D.shift(); S.cmp = null; a.save(); drafts(); return; }
        if (b.dataset.dwc != null) { var i = +b.dataset.dwc; S.cmp = S.cmp === i ? null : i; a.save(); drafts(); }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      pickPaint(); counts(); preview(); models(); drafts();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text ? true : "Write your paragraph first."; },
    checks:checks,
    key:function(d){ return d.motif || "none"; }, label:function(k){ var m = motif(k); return m ? esc(m.t) : esc(k); }, text:function(k){ var m = motif(k); return m ? m.t : k; },
    summary:function(ts){
      if (!T) T = MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.filter(Boolean).length, m = motif(d.motif), L = [];
      L.push(T.summary + ": " + (met === r.length ? "complete (motif: " + m.t + "; " + d.n + " words)" : "not complete yet (checklist " + met + "/" + r.length + ")"));
      L.push("  Motif: " + (m ? m.t : "(not chosen)"));
      L.push("  Full paragraph (" + d.n + " words):");
      L.push("    " + (d.text || "(not written yet)"));
      L.push("  Teacher rubric (Ontario achievement chart, levels 1–4):");
      T.rubric.forEach(function(row){ L.push("    " + row[0] + ": 1 " + row[1] + " | 2 " + row[2] + " | 3 " + row[3] + " | 4 " + row[4]); });
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
  if (sheet && art && R.art.intro && !$("#mt-artintro")) { var p = document.createElement("p"); p.id = "mt-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#mt-artn")) {
    var n = document.createElement("p"); n.id = "mt-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, ""); }) });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ blood:blood, spot:spotProse },
  task:task,
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX && v !== "explore") EX.stop();
    if (v === "statement" && MV.P3 && MV.P3.refresh) MV.P3.refresh();
    if (v === "reflect") extras();
  }
});
})();
