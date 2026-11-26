// ENG4U 14 Alice Munro & the Canadian Short Story: hero (the opening sentence word by word over a farm line drawing), Time-shift
// mapper (Explore: Reading room "Read in your copy" card + Works Cited builder; Mode 1 habit/event lanes with "Read the shape", the
// lane line and an E9 tension line; Mode 2 two-voices lens on the plan's quotations and the student's own lines, plus the night
// stories (TC3); Mode 3 the farm's two worlds with a narrator line; Mode 4 the student's map), The short story in Canada (Part 3:
// shelf, two openings, Southern Ontario Gothic lens), Two worlds (toolkit sorter + reflection), The fair ribbon (custom), Spot the
// Error (K13 spotProse) and "Map and argue" (map + E6 paragraph builder). Texts and slots: content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function clean(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
function EXC(){ return MV.C.explore; }
function MOM(){ return EXC().moments; }
function mom(id){ return byId(MOM(), id); }
function EXS(){ return MV.S.app.explore || (MV.S.app.explore = {}); }

// ---------- @component radioGroup (copied from ENG4U 11; no option needs to be checked) ----------
// radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", disabled(id) -> bool, onChange(id)}) -> {set, get, lock, refresh}
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
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled && host.contains(b)) { e.stopPropagation(); choose(b.dataset.rg); } });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(b.dataset.rg);
    for (var k = 0; k < ids.length; k++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus(); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, refresh:paint };
}

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
// read chunks one after another: [[text, rate, wordOffset]]; onWord(globalWordIndex); returns a token whose .stop() cancels
function readChunks(chunks, onWord, onDone){
  var tok = { stopped:false, stop:function(){ tok.stopped = true; MV.eng.stop(); } }, i = 0;
  function next(){
    if (tok.stopped) return;
    if (i >= chunks.length || !VOICE) { if (onDone) onDone(); return; }
    var ch = chunks[i++];
    MV.eng.say(ch[0], { voice:VOICE, rate:ch[1] || 1, onWord:function(w){ if (!tok.stopped && onWord) onWord((ch[2] || 0) + w); }, onEnd:function(){ if (tok.stopped) return; setTimeout(next, ch[3] || 180); } });
  }
  next();
  return tok;
}

// ---------- hero: "My father was a fox farmer." word by word; a farm line drawing builds beneath it ----------
var HR = { run:0 };
function heroSVG(H){
  var words = H.line.split(/\s+/), iF = -1;
  words.forEach(function(w, i){ if (iF < 0 && w.toLowerCase().indexOf(H.lit) === 0) iF = i; });
  var h = '<svg class="mu-hsvg" viewBox="0 0 420 300" role="img" aria-label="' + esc(H.aria) + '" focusable="false">';
  h += '<text class="mu-hline" x="210" y="44" text-anchor="middle">' + words.map(function(w, i){ return '<tspan class="mu-hw' + (i === iF ? " mu-hfa" : "") + '" data-wi="' + i + '">' + esc(w) + "</tspan>"; }).join(" ") + "</text>";
  // the drawing: pens, barn, field, house with a steamed kitchen window (each piece draws itself)
  var P = [
    ["pens", "M18 252 V196 H150 V252 M40 196 V252 M62 196 V252 M84 196 V252 M106 196 V252 M128 196 V252 M18 214 H150 M18 233 H150"],
    ["barn", "M160 252 V168 L202 132 L244 168 V252 M186 252 V206 H218 V252 M186 206 L218 252 M218 206 L186 252 M196 158 H208 V170 H196 Z"],
    ["field", "M250 252 C262 242 276 242 288 252 M252 238 C264 230 276 230 286 238 M256 226 C266 220 276 220 284 226"],
    ["house", "M296 252 V176 L348 140 L400 176 V252 M316 252 V214 H336 V252"],
    ["window", "M350 194 H386 V230 H350 Z M368 194 V230 M350 212 H386"],
    ["steam", "M356 228 C352 220 360 216 356 208 M366 228 C362 220 370 216 366 208 M376 228 C372 220 380 216 376 208"]
  ];
  h += '<path class="mu-hground" d="M8 252 H412"/>';
  P.forEach(function(p, k){ h += '<path class="mu-hd mu-hd-' + p[0] + '" data-hd="' + k + '" pathLength="1" d="' + p[1] + '"/>'; });
  h += '<text class="mu-hq" x="210" y="286" text-anchor="middle">' + esc(H.question) + "</text>";
  return { svg:h + "</svg>", iF:iF, n:words.length, parts:P.length };
}
function hero(){
  var H = MV.C.hero, host = $("#mu-hero"); if (!host) return;
  var g = heroSVG(H);
  host.innerHTML = '<div class="mu-hwrap">' + g.svg + '</div><p class="eng-cite mu-hcite">' + H.cite + '</p><p class="mu-hcap">' + H.caption + '</p>' +
    '<div class="mu-hctl"><button type="button" class="btn ghost sm" id="mu-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="mu-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="mu-hnote" hidden>' + H.noVoice + "</span></div>";
  var svg = $(".mu-hsvg", host), W = $$(".mu-hw", svg), tok = null;
  function words(n, speak){ W.forEach(function(e, i){ e.classList.toggle("on", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); }
  function cls(sel, c, on){ $$(sel, svg).forEach(function(e){ e.classList.toggle(c, on); }); }
  function reset(){ host.classList.remove("done", "cap-on"); host.classList.add("anim"); words(-1); cls(".mu-hd", "on", false); cls(".mu-hfa", "lit", false); cls(".mu-hq", "on", false); }
  function finish(){ host.classList.remove("anim"); host.classList.add("done", "cap-on"); words(g.n - 1); cls(".mu-hd", "on", true); cls(".mu-hq", "on", true); cls(".mu-hfa", "lit", true); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run, t = 300; MV.eng.stop(); reset();
    for (var i = 0; i < g.n; i++) (function(i){ at(me, t, function(){ words(i, false); if (i === g.iF) cls(".mu-hfa", "lit", true); }); t += i === g.iF ? 900 : 380; })(i);
    t += 300;
    for (var k = 0; k < g.parts; k++) (function(k){ at(me, t + k * 420, function(){ var e = $('[data-hd="' + k + '"]', svg); if (e) e.classList.add("on"); }); })(k);
    t += g.parts * 420 + 300;
    at(me, t, function(){ cls(".mu-hq", "on", true); });
    at(me, t + 900, function(){ host.classList.add("cap-on"); });
    at(me, t + 1300, finish);
  }
  function listen(){
    var me = ++HR.run; if (tok) tok.stop();
    finish(); words(-1);
    var w = H.line.split(/\s+/);
    tok = readChunks([[w.slice(0, g.iF + 1).join(" "), 0.85, 0, 450], [w.slice(g.iF + 1).join(" "), 0.85, g.iF + 1]], function(k){ if (me === HR.run) words(k, true); }, function(){ if (me === HR.run) { words(g.n - 1); tok = null; } });
  }
  function btns(){ $("#mu-hlisten").hidden = !VOICE; $("#mu-hagain").hidden = MV.reduceMotion; $("#mu-hnote").hidden = !!VOICE; }
  $("#mu-hlisten").addEventListener("click", listen);
  $("#mu-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) { host.classList.add("mu-still"); finish(); } else animate();
  voiceReady(btns);
  HR.stop = function(){ if (tok) { tok.stop(); tok = null; } MV.eng.stop(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- @component E8 citationBuilder (edition form) — the class edition's publisher, year and page range build a live MLA 9
// Works Cited entry from the plan's credit-line template; blanks show the template's placeholders. Values stay on the device. ----------
function creditLine(R, ed, html){
  var B = R.creditBlank, out = R.credit;
  ["publisher", "year", "range"].forEach(function(k){ var v = clean(ed[k]) || clean(R.edition[k]); out = out.replace("{" + k + "}", v ? (html ? esc(v) : v) : B[k]); });
  if (!html) out = MV.plain(out);
  return out;
}

// ---------- @component mapBuilder — "Your map" (plan Mode 4): up to N short quotations with a page and three tags (time, world,
// voice); a list with edit/delete and a map that builds itself (worlds × time, numbered chips coloured by voice, each with a text
// tag). Shared by Explore and the task; entries live in MV.S.app.explore.map. ----------
function mapBuilder(host, o){
  var X = EXC().map, f = { q:"", pg:"", time:"", world:"", voice:"", edit:-1 }, uid = o.uid || "mp";
  function arr(){ var S = EXS(); if (!Array.isArray(S.map)) S.map = []; return S.map; }
  function lab(list, id){ var x = byId(list, id); return x ? x.t : "—"; }
  function mapHTML(){
    var A = arr();
    if (!A.length) return '<p class="tiny muted">' + X.empty + "</p>";
    var h = '<div class="mu-mgrid" role="table" aria-label="' + esc(X.built) + '"><div role="row" class="mu-mrow"><span role="columnheader" class="mu-mh"></span>' + X.worlds.map(function(w){ return '<span role="columnheader" class="mu-mh">' + w.t + "</span>"; }).join("") + "</div>";
    X.times.forEach(function(t){
      h += '<div role="row" class="mu-mrow"><span role="rowheader" class="mu-mh">' + t.t + "</span>" + X.worlds.map(function(w){
        var inn = A.map(function(e, i){ return { e:e, i:i }; }).filter(function(x){ return x.e.time === t.id && x.e.world === w.id; });
        return '<span role="cell" class="mu-mcell">' + inn.map(function(x){ return '<span class="mu-mchip an an-' + (x.e.voice === "adult" ? "theme" : "image") + '" title="' + esc(x.e.q) + '">' + (x.i + 1) + ' <span class="an-tag an-' + (x.e.voice === "adult" ? "theme" : "image") + '">' + (x.e.voice === "adult" ? "adult" : "child") + "</span></span>"; }).join("") + "</span>";
      }).join("") + "</div>";
    });
    return h + "</div>";
  }
  function listHTML(){
    var A = arr();
    return A.length ? '<ol class="mu-mlist">' + A.map(function(e, i){
      return '<li><span class="mu-mq">“' + esc(e.q) + "” (p. " + esc(e.pg) + ')</span> <span class="tiny muted">' + lab(X.times, e.time) + " · " + lab(X.worlds, e.world) + " · " + lab(X.voices, e.voice) + '</span> <span class="mu-mact"><button type="button" class="linkbtn" data-medit="' + i + '" data-k="' + uid + "e" + i + '">' + X.edit + '</button> <button type="button" class="linkbtn" data-mdel="' + i + '" data-k="' + uid + "d" + i + '">' + X.del + "</button></span></li>";
    }).join("") + "</ol>" : "";
  }
  function paint(){
    var A = arr(), full = A.length >= X.max && f.edit < 0;
    MV.keepFocus(host, function(){
      host.innerHTML = '<div class="mu-mform">' + (full ? '<p class="tiny">' + X.full + "</p>" :
        '<div class="jq"><label for="' + uid + '-q">' + X.quoteL + '</label><textarea id="' + uid + '-q" data-mf="q" maxlength="' + X.maxChars + '" rows="2"></textarea><span class="tiny muted" id="' + uid + '-n" aria-live="polite"></span></div>' +
        '<div class="mu-mrowf"><label class="mu-pgl" for="' + uid + '-pg">' + X.pageL + '</label><input type="text" class="txtin mu-pgin" id="' + uid + '-pg" data-mf="pg" inputmode="numeric" maxlength="12" autocomplete="off"></div>' +
        '<div id="' + uid + '-t"></div><div id="' + uid + '-w"></div><div id="' + uid + '-v"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-madd="1" data-k="' + uid + 'add">' + (f.edit >= 0 ? X.save : X.add) + "</button>" + (f.edit >= 0 ? '<button type="button" class="btn ghost sm" data-mcancel="1" data-k="' + uid + 'cn">' + X.cancel + "</button>" : "") + '<span class="tiny" id="' + uid + '-msg" aria-live="polite"></span></div>') + "</div>" +
        '<p class="mu-lab">' + X.built + " (" + A.length + "/" + X.max + ")</p>" + mapHTML() + listHTML();
    });
    if (!full) {
      $("#" + uid + "-q", host).value = f.q; $("#" + uid + "-pg", host).value = f.pg; count();
      radios($("#" + uid + "-t", host), { label:X.timeL, cls:"chips", options:X.times, value:f.time, onChange:function(v){ f.time = v; } });
      radios($("#" + uid + "-w", host), { label:X.worldL, cls:"chips", options:X.worlds, value:f.world, onChange:function(v){ f.world = v; } });
      radios($("#" + uid + "-v", host), { label:X.voiceL, cls:"chips", options:X.voices, value:f.voice, onChange:function(v){ f.voice = v; } });
    }
  }
  function count(){ var n = $("#" + uid + "-n", host); if (n) n.textContent = f.q.length + "/" + X.maxChars; }
  host.addEventListener("input", function(e){ var k = e.target.dataset.mf; if (!k) return; f[k] = e.target.value; if (k === "q") count(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var A = arr();
    if (b.dataset.madd) {
      var q = clean(f.q).slice(0, X.maxChars), pg = clean(f.pg);
      if (!q || !pg || !f.time || !f.world || !f.voice) { $("#" + uid + "-msg", host).textContent = X.need; return; }
      var ent = { q:q, pg:pg, time:f.time, world:f.world, voice:f.voice };
      if (f.edit >= 0) A[f.edit] = ent; else if (A.length < X.max) A.push(ent);
      f = { q:"", pg:"", time:"", world:"", voice:"", edit:-1 }; MV.save(); paint(); if (o.onChange) o.onChange();
      var q2 = $("#" + uid + "-q", host); if (q2) q2.focus();
      return;
    }
    if (b.dataset.mcancel) { f = { q:"", pg:"", time:"", world:"", voice:"", edit:-1 }; paint(); return; }
    if (b.dataset.medit != null) { var i = +b.dataset.medit, x = A[i]; f = { q:x.q, pg:x.pg, time:x.time, world:x.world, voice:x.voice, edit:i }; paint(); var t = $("#" + uid + "-q", host); if (t) t.focus(); return; }
    if (b.dataset.mdel != null) { A.splice(+b.dataset.mdel, 1); if (f.edit >= 0) f.edit = -1; MV.save(); paint(); if (o.onChange) o.onChange(); }
  });
  paint();
  return { paint:paint };
}

// ---------- @component E9 structureMap (time-shift form) — moment cards placed in time lanes (Habit · A stretch of time · Event:
// tap a card, then a lane; ↑/↓ move the selected card); "Read the shape" lays the cards out in telling order with the lane line;
// a tension line from fixed per-card values above the telling order; the farm's worlds with a narrator line (Mode 3).
// Course plan E9 (02, 09, 14, 16). Data: content.explore.{moments, lanes, worlds}. ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, L = C.labels, R = C.reading, V = C.voice, N = C.night;
  S.mode = S.mode || "time"; S.lane = S.lane || {}; S.world = S.world || {}; S.vm = S.vm || {}; S.own = Array.isArray(S.own) ? S.own : [];
  S.pages = S.pages || {}; S.ed = S.ed || {}; if (S.lens == null) S.lens = true; if (!Array.isArray(S.night)) S.night = ["s2", "s1"];
  if (!Array.isArray(S.map)) S.map = [];
  var sel = "", fx = {}, act = { pid:"", sel:[] }, tokHosts = {}, run = { n:0 };
  var LANES = C.lanes.map(function(l){ return l.id; });

  // ----- order, tension, placements (fx.model shows the plan's reading without touching the student's work) -----
  function order(){ var o = MOM().map(function(m){ return m.id; }); if (fx.swap) { var a = o.indexOf("m7"), b = o.indexOf("m8"); o[a] = "m8"; o[b] = "m7"; } return o; }
  function ten(id){ var o = order(); if (id === "m8" && o.indexOf("m7") > o.indexOf("m8")) return 2; return mom(id).ten; }
  function laneOf(id){ return fx.model ? mom(id).time : S.lane[id]; }
  function worldOf(id){ return fx.model ? mom(id).world : S.world[id]; }
  function peak(){ var o = order(); return o.reduce(function(m, id){ return ten(id) > ten(m) ? id : m; }, o[0]); }

  host.innerHTML = '<div class="mu-ex">' +
    '<section class="mu-rr" aria-labelledby="mu-rrh"><p class="mu-cnote"><strong>Content note.</strong> ' + C.contentNote + '</p><details class="mu-rrd" id="mu-rrd"' + (S.rrClosed ? "" : " open") + '><summary id="mu-rrh">' + R.title + '</summary><div id="mu-rrbody"></div></details></section>' +
    '<div id="mu-mode"></div><p class="how mu-how" id="mu-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="mu-main" data-mv="graph" id="mu-main"></div><dl class="read mu-read" id="mu-read" aria-live="polite"></dl></div>';
  var modeRG = radios($("#mu-mode", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  $("#mu-rrd", host).addEventListener("toggle", function(){ S.rrClosed = !$("#mu-rrd", host).open; api.save(); });

  // ----- Reading room (EXCERPT SLOT when filled; otherwise "Read in your copy") -----
  function paintRR(){
    var b = $("#mu-rrbody", host), h = "";
    if (R.paras && R.paras.length) {
      h += '<div class="eng-passage eng-prose mu-story">' + R.paras.map(function(p, i){ var pg = p.pg && (i === 0 || p.pg !== R.paras[i - 1].pg) ? '<span class="mu-pgm">p. ' + esc(p.pg) + "</span>" : ""; return "<p>" + pg + esc(p.t) + "</p>"; }).join("") + "</div>";
    } else {
      h += '<div class="mu-copy"><h4 class="mu-h">' + R.copyTitle + "</h4><p>" + R.copy + "</p>" + (C.pageNote ? "<p>" + R.pageNote + "</p>" : "") +
        '<p class="tiny">' + R.pagesFound + '</p><ul class="mu-pages">' + R.lines.map(function(l){ return '<li><span class="mu-pq">“' + esc(l.t) + '”</span> <label class="tiny" for="mu-pg-' + l.k + '">p.</label> <input type="text" class="txtin mu-pgin" id="mu-pg-' + l.k + '" data-pgk="' + l.k + '" inputmode="numeric" maxlength="8" autocomplete="off"></li>'; }).join("") + "</ul></div>";
    }
    h += '<div class="mu-ed"><h4 class="mu-h">' + R.edTitle + '</h4><p class="tiny muted">' + R.edHow + '</p><div class="mu-edf">' + R.edFields.map(function(f){ return '<div class="jq"><label for="mu-ed-' + f.k + '">' + f.t + '</label><input type="text" class="txtin" id="mu-ed-' + f.k + '" data-edk="' + f.k + '" maxlength="80" autocomplete="off" placeholder="' + esc(f.ph) + '"></div>'; }).join("") + '</div><p class="mu-wc eng-cite" id="mu-wc" aria-live="polite"></p></div>';
    b.innerHTML = h;
    $$("[data-pgk]", b).forEach(function(i){ i.value = S.pages[i.dataset.pgk] || ""; });
    $$("[data-edk]", b).forEach(function(i){ i.value = S.ed[i.dataset.edk] || ""; });
    $("#mu-wc", b).innerHTML = creditLine(R, S.ed, true);
  }
  $("#mu-rrbody", host).addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.pgk) { S.pages[t.dataset.pgk] = t.value; api.save(); }
    if (t.dataset.edk) { S.ed[t.dataset.edk] = t.value; api.save(); $("#mu-wc", host).innerHTML = creditLine(R, S.ed, true); }
  });

  function setMode(v){ stopFx(); MV.banner("", ""); S.mode = v; modeRG.set(v); sel = ""; api.save(); paint(); MV.changed(); }

  // ----- the tension line above the telling order (Modes 1 and 3) -----
  function tensionHTML(tapTurn){
    var o = order(), n = o.length, pts = [], peakId = peak(), cut = fx.p2 ? o.indexOf("m8") : -1;
    o.forEach(function(id, i){ pts.push({ id:id, x:(i + 0.5) * 30, y:52 - ten(id) * 9.4, faded:cut >= 0 && i > cut }); });
    var d = "", df = "";
    pts.forEach(function(p, i){ if (!p.faded) d += (d ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " "; else df += (df ? "L" : "M" + pts[i - 1].x.toFixed(1) + " " + pts[i - 1].y.toFixed(1) + " L") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " "; });
    if (cut >= 0) d += "L" + (pts[cut].x + 12).toFixed(1) + " 52 L" + (n * 30).toFixed(1) + " 52";
    var g = '<line class="mu-tax" x1="0" y1="52" x2="' + (n * 30) + '" y2="52"/>' + (df ? '<path class="mu-tline faded" d="' + df + '"/>' : "") + '<path class="mu-tline' + (cut >= 0 ? " drop" : "") + '" d="' + d + '"/>';
    pts.forEach(function(p){ g += '<circle class="mu-tdot' + (p.id === peakId && !p.faded ? " peak" : "") + (p.faded ? " faded" : "") + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (p.id === peakId ? 4.2 : 3) + '"/>'; });
    var desc = cut >= 0 ? "Tension line: low through the habits, rising at m7 to the gate (m8), then dropping to nothing; the cards after the gate fade." :
      "Tension line in telling order: low and flat from " + o[0] + " to m6, rising at m7 and peaking at " + peakId + (fx.swap ? " (m7 now comes after m8, so the gate loses force)" : "") + ", then falling to the end.";
    var h = '<div class="mu-tens"><div class="mu-tlab"><span>' + L.tension + '</span></div><div class="mu-tarea"><svg class="mu-tsvg" viewBox="0 0 ' + (n * 30) + ' 56" preserveAspectRatio="none" role="img" aria-label="' + esc(desc) + '">' + g + "</svg>" +
      '<div class="mu-tstrip" role="group" aria-label="' + esc(L.tellingOrder + (tapTurn ? ". " + L.turnHow : "")) + '">' + o.map(function(id, i){
        var on = S.turn === id, f = cut >= 0 && i > cut;
        return '<button type="button" class="mu-tb' + (on ? " turn" : "") + (f ? " faded" : "") + (fx.hi === id ? " hi" : "") + '" data-turn="' + id + '" data-k="tb' + id + '" aria-pressed="' + on + '" aria-label="' + esc(id + ": " + mom(id).short + (on ? ", marked as the turn" : "")) + '">' + id + "</button>";
      }).join("") + "</div></div></div>";
    return '<p class="mu-lab">' + L.tellingOrder + ' <span class="tiny muted">' + L.turnHow + "</span></p>" + h + (fx.cap ? '<p class="mu-cap" aria-live="polite">' + fx.cap + "</p>" : "");
  }

  // rows × telling order, one chip per placed card, and a line through them in telling order (the lane line / the narrator line)
  var WROWS = ["F", "G", "M", "O"].map(function(id){ var w = byId(C.worlds, id); return { id:id, short:w.short.charAt(0).toUpperCase() + w.short.slice(1), t:w.t }; });
  function gridChart(rows, rowOf, name, kind, cut){
    var o = order(), pts = [], cells = "";
    rows.forEach(function(rw, r){
      o.forEach(function(id, c){
        var m = mom(id), here = rowOf(id) === rw.id, f = cut >= 0 && c > cut;
        if (here && !f) pts.push({ c:c, r:r });
        cells += '<span class="mu-scell' + (r ? "" : " top") + '" style="grid-row:' + (r + 1) + ";grid-column:" + (c + 1) + '">' + (here ? '<button type="button" class="mu-schip' + (sel === id ? " sel" : "") + (fx.hi === id ? " hi" : "") + (f ? " faded" : "") + ((id === "m7" || id === "m8") && fx.swap ? " swapped" : "") + '" data-card="' + id + '" data-k="' + kind + id + '" aria-pressed="' + (sel === id) + '" aria-label="' + esc(id + ": " + m.short + ", " + rw.short) + '">' + id + "</button>" : "") + "</span>";
      });
    });
    var d = pts.map(function(p, i){ return (i ? "L" : "M") + ((p.c + 0.5) * 10) + " " + ((p.r + 0.5) * 10); }).join(" ");
    var placed = o.filter(function(id, c){ return rowOf(id) && !(cut >= 0 && c > cut); });
    var desc = placed.length ? name + " in telling order: " + placed.map(function(id){ return id + " " + byId(rows, rowOf(id)).short.toLowerCase(); }).join(", ") + (cut >= 0 ? "; it stops at the gate." : ".") : name + ": no cards placed yet.";
    return '<div class="mu-shape mu-sh-' + kind + '"><div class="mu-slabs" style="grid-template-rows:repeat(' + rows.length + ',1fr)">' + rows.map(function(rw){ return "<span>" + rw.short + "</span>"; }).join("") + '</div><div class="mu-sgrid" style="grid-template-rows:repeat(' + rows.length + ',' + (kind === "narr" ? 36 : 44) + 'px)">' + cells +
      '<svg class="mu-sline" viewBox="0 0 100 ' + (rows.length * 10) + '" preserveAspectRatio="none" role="img" aria-label="' + esc(desc) + '"><path d="' + d + '"/></svg></div></div>';
  }

  // ----- Mode 1: Habit and event -----
  function cardBtn(m, where){
    var cls = "mu-card" + (sel === m.id ? " sel" : "") + (fx.hi === m.id ? " hi" : "") + (fx.p2 && order().indexOf(m.id) > order().indexOf("m8") ? " faded" : "");
    return '<button type="button" class="' + cls + '" data-card="' + m.id + '" data-k="c' + m.id + '" aria-pressed="' + (sel === m.id) + '"><span class="mu-cid">' + m.id + '</span><span class="mu-ct">' + m.t + "</span></button>";
  }
  function selBar(kind){
    if (!sel) return "";
    var m = mom(sel), placed = kind === "time" ? !!S.lane[sel] : !!S.world[sel];
    var h = '<div class="sel-bar mu-selbar"><span><strong>' + L.selected + ":</strong> " + m.id + " · " + m.short + "</span>";
    if (kind === "time") h += '<span class="mu-mv"><span class="tiny">' + L.moveTo + ":</span>" + C.lanes.map(function(l){ return '<button type="button" class="btn ghost sm" data-lane="' + l.id + '" data-k="ml' + l.id + '">' + l.short + "</button>"; }).join("") + "</span>";
    if (placed) h += '<button type="button" class="btn ghost sm" data-off="' + kind + '" data-k="off">' + L.takeOff + "</button>";
    return h + "</div>";
  }
  function timeHTML(){
    var tray = MOM().filter(function(m){ return !laneOf(m.id); }), o = order(), shape = S.shape || fx.shape;
    var h = '<div class="mu-tray" role="group" aria-label="' + esc(L.tray) + '">' + (tray.length ? tray.map(function(m){ return cardBtn(m, "t"); }).join("") : '<span class="tiny muted">' + L.allPlaced + "</span>") + "</div>";
    h += selBar("time");
    h += '<p class="mu-lab">' + L.strip + "</p>";
    if (!shape) {
      h += '<div class="mu-lanes">' + C.lanes.map(function(l){
        var inside = o.filter(function(id){ return laneOf(id) === l.id; }).map(mom);
        return '<div class="mu-lane"><button type="button" class="mu-lanebtn' + (sel ? " ready" : "") + '" data-lane="' + l.id + '" data-k="ln' + l.id + '">' + l.t + ' <span class="tiny">(' + inside.length + ")</span></button><div class=\"mu-lin\">" + inside.map(function(m){ return cardBtn(m, "l"); }).join("") + "</div></div>";
      }).join("") + "</div>";
    } else {
      h += gridChart(C.lanes, laneOf, L.laneLine, "lane", -1);
      h += '<ol class="mu-legend tiny">' + o.map(function(id){ return "<li><strong>" + id + "</strong> " + mom(id).short + "</li>"; }).join("") + "</ol>";
    }
    h += '<div class="q-actions"><button type="button" class="btn ' + (shape ? "ghost" : "primary") + ' sm" data-shape="1" data-k="shape">' + (shape ? L.unshape : L.shape) + "</button></div>";
    return h + tensionHTML(true);
  }

  // ----- Mode 3: Two worlds -----
  function worldsHTML(){
    var tray = MOM().filter(function(m){ return !worldOf(m.id); }), o = order(), cut = fx.p2 ? o.indexOf("m8") : -1;
    var h = "";
    if (fx.p1) {
      var on2 = fx.p1 === 2;
      h += '<div class="mu-tone" aria-live="polite"><p class="mu-toneq">Her father: “' + (on2 ? "She’s <del>only</del> a girl." : "She’s <mark class='an an-theme'>only</mark> a girl.") + '”</p><p class="mu-tonev"><span class="tiny muted">' + L.tone + ":</span> <strong>" + (on2 ? C.p1.after : C.p1.before) + "</strong></p></div>";
    }
    h += '<div class="mu-tray" role="group" aria-label="' + esc(L.tray) + '">' + (tray.length ? tray.map(function(m){ return cardBtn(m, "t"); }).join("") : '<span class="tiny muted">' + L.allPlaced + "</span>") + "</div>";
    h += selBar("worlds");
    h += '<div class="mu-farm" id="mu-farm" role="group" aria-label="' + esc(L.farm) + '">' + C.worlds.map(function(w){
      var inside = o.filter(function(id){ return worldOf(id) === w.id; });
      return '<div class="mu-zone mu-z-' + w.id + '"><button type="button" class="mu-zbtn' + (sel ? " ready" : "") + '" data-world="' + w.id + '" data-k="z' + w.id + '">' + zoneIcon(w.id) + "<strong>" + w.t + '</strong><small>' + w.sub + ' <span class="tiny">(' + inside.length + ")</span></small></button>" +
        '<div class="mu-zin">' + inside.map(function(id){ var m = mom(id), f = cut >= 0 && o.indexOf(id) > cut; return '<button type="button" class="mu-wchip' + (sel === id ? " sel" : "") + (fx.hi === id ? " hi" : "") + (f ? " faded" : "") + '" data-card="' + id + '" data-wchip="' + o.indexOf(id) + '" data-k="c' + id + '" aria-pressed="' + (sel === id) + '"><span class="mu-wn">' + id + "</span> " + m.short + "</button>"; }).join("") + "</div></div>";
    }).join("") + "</div>";
    var steps = o.filter(function(id){ return worldOf(id) && !(cut >= 0 && o.indexOf(id) > cut); });
    h += '<p class="mu-lab">' + L.narrLine + "</p>" + gridChart(WROWS, worldOf, L.narrLine, "narr", cut);
    h += '<p class="mu-steps tiny">' + (steps.length ? steps.map(function(id, i){ return (i + 1) + ". <strong>" + id + "</strong> " + worldName(id); }).join(" → ") : "Place cards on the farm to draw the narrator line.") + "</p>";
    return h + tensionHTML(false);
  }
  function zoneIcon(id){
    var P = { F:"M3 30 V14 L14 5 L25 14 V30 M9 30 V20 H19 V30 M28 30 V20 H44 V30 M32 20 V30 M36 20 V30 M40 20 V30", G:"M4 30 V8 M40 30 V8 M4 12 H40 M4 20 H40 M4 28 H40 M4 12 L40 28",
      M:"M4 30 V14 L22 4 L40 14 V30 M14 18 H30 V28 H14 Z M22 18 V28 M14 23 H30", O:"M6 30 V12 H38 V30 M10 22 H34 M10 16 C16 12 22 12 28 16 M30 8 C32 5 34 5 36 8" };
    return '<svg class="mu-zicon" viewBox="0 0 44 32" aria-hidden="true" focusable="false"><path d="' + P[id] + '"/></svg>';
  }
  function worldName(id){ var w = worldOf(id); if (!w) return "—"; if (w === "M" && mom(id).table) return "the family table"; return byId(C.worlds, w).t; }
  function shortWorld(id){ var w = worldOf(id); if (!w) return "—"; if (w === "M" && mom(id).table) return "family table"; return byId(C.worlds, w).short; }


  // ----- Mode 2: Two voices (E1 lens marks on the plan's quotations, the teacher's slot text and the student's own lines) -----
  function passages(){
    var P = [{ id:"pre", kind:"pre", text:C.q.girl, cite:C.cite.girl }, { id:"qopen", kind:"q", text:C.q.open, cite:C.cite.open }, { id:"qonly", kind:"q", text:C.q.only + ".", cite:C.cite.only }];
    (R.paras || []).forEach(function(p, i){ P.push({ id:"rr" + i, kind:"slot", text:p.t, cite:p.pg ? "(Munro " + p.pg + ")" : "" }); });
    S.own.forEach(function(o, i){ P.push({ id:"own" + o.id, kind:"own", text:o.t, cite:o.pg ? "(Munro " + o.pg + ")" : "", oi:i }); });
    return P;
  }
  function tagDef(id){ return byId(V.tags, id); }
  function marksFor(p){
    var out = [];
    if (p.kind === "pre" && S.lens) out.push({ w:MV.eng.tokenize(p.text).map(function(_, i){ return i; }), role:"theme", tag:"adult · pre-marked" });
    (S.vm[p.id] || []).forEach(function(m){ var t = tagDef(m.tag); if (!t) return; if ((m.tag === "child" || m.tag === "adult") && !S.lens) return; out.push({ w:m.w, role:t.role, tag:t.tag }); });
    return out;
  }
  function voiceHTML(){
    var h = '<div class="mu-vbar"><button type="button" class="an-chip an-theme" data-lens="1" data-k="lens" aria-pressed="' + !!S.lens + '"><i class="an-dot"></i>' + V.lens + "</button>" +
      '<span class="mu-vtags" role="group" aria-label="Tag the selected words">' + V.tags.map(function(t){ return '<button type="button" class="an-chip an-' + t.role + '" data-vtag="' + t.id + '" data-k="vt' + t.id + '"><i class="an-dot"></i>' + t.t + "</button>"; }).join("") + "</span>" +
      '<span class="q-actions mu-vacts"><button type="button" class="btn ghost sm" data-vclear="1" data-k="vclear">' + V.clearMark + '</button><button type="button" class="btn ghost sm" data-vsave="1" data-k="vsave">' + R.saveLine + '</button><span class="tiny" id="mu-vmsg" aria-live="polite"></span></span></div>';
    var P = passages();
    h += '<h4 class="mu-h">' + V.preTitle + "</h4>" + pasHTML(P[0]);
    if (fx.p3) h += '<p class="mu-cap">' + V.p3cap + "</p>";
    h += '<h4 class="mu-h">' + V.quotesTitle + "</h4>" + pasHTML(P[1]) + pasHTML(P[2]);
    var slot = P.filter(function(p){ return p.kind === "slot"; });
    if (slot.length) h += '<h4 class="mu-h">' + R.title + "</h4>" + slot.map(pasHTML).join("");
    h += '<h4 class="mu-h">' + V.ownTitle + '</h4><p class="tiny muted">' + V.ownHow + "</p>" + P.filter(function(p){ return p.kind === "own"; }).map(pasHTML).join("") +
      '<div class="mu-own"><textarea id="mu-ownt" maxlength="300" rows="2" aria-label="' + esc(V.ownTitle) + '"></textarea><label class="tiny" for="mu-ownp">' + V.ownPage + '</label><input type="text" class="txtin mu-pgin" id="mu-ownp" inputmode="numeric" maxlength="8" autocomplete="off"><button type="button" class="btn ghost sm" data-ownadd="1" data-k="ownadd">' + V.ownAdd + "</button></div>";
    h += nightHTML();
    return h;
  }
  function pasHTML(p){
    return '<div class="mu-pas mu-pk-' + p.kind + (p.kind === "pre" && fx.p3 ? " mu-grey" : "") + '"><div class="mu-ptoks" data-pid="' + p.id + '"></div><p class="eng-cite">' + esc(p.cite) +
      (p.kind === "own" ? ' <button type="button" class="linkbtn" data-ownrm="' + p.oi + '" data-k="ownrm' + p.oi + '">' + V.remove + "</button>" : "") + "</p></div>";
  }
  function mountTokens(){
    tokHosts = {};
    passages().forEach(function(p){
      var el = $('[data-pid="' + p.id + '"]', host); if (!el) return;
      var toks = MV.eng.tokenize(p.text);
      el.innerHTML = "<div></div>";
      tokHosts[p.id] = { p:p, toks:toks, t:MV.eng.tokens(el.firstChild, toks, { label:"Words: tap to select", marks:function(){ return marksFor(p); },
        onChange:function(s){ if (s.length && act.pid !== p.id) { var old = tokHosts[act.pid]; if (old) old.t.clear(); } act = { pid:p.id, sel:s }; var m = $("#mu-vmsg", host); if (m) m.textContent = s.length ? s.length + " word" + (s.length > 1 ? "s" : "") + " selected" : ""; },
        onKey:function(){ /* T: the tag buttons are the tag menu */ var b = $("[data-vtag]", host); if (b) b.focus(); } }) };
      if (act.pid === p.id && act.sel.length) tokHosts[p.id].t.set(act.sel);
    });
  }
  var GROUPS = { child:"v", adult:"v", habit:"t", event:"t", father:"w", mother:"w" };
  function applyTag(tag){
    var msg = $("#mu-vmsg", host);
    if (!act.pid || !act.sel.length) { if (msg) msg.textContent = "Tap some words first."; return; }
    var list = S.vm[act.pid] = S.vm[act.pid] || [];
    S.vm[act.pid] = list.filter(function(m){ return !(GROUPS[m.tag] === GROUPS[tag] && m.w.some(function(i){ return has(act.sel, i); })); });
    S.vm[act.pid].push({ w:act.sel.slice(), tag:tag });
    if ((tag === "child" || tag === "adult") && !S.lens) S.lens = true;
    api.save(); var keep = act.pid; act = { pid:"", sel:[] }; paint(); MV.changed();
    var m2 = $("#mu-vmsg", host); if (m2) m2.textContent = "Tagged: " + tagDef(tag).tag + ".";
    var th = tokHosts[keep]; if (th) th.t.focus(0);
  }
  function clearTags(){
    if (!act.pid || !act.sel.length) return;
    S.vm[act.pid] = (S.vm[act.pid] || []).filter(function(m){ return !m.w.some(function(i){ return has(act.sel, i); }); });
    api.save(); act = { pid:"", sel:[] }; paint(); MV.changed();
  }
  function adultCount(){ var n = 0; Object.keys(S.vm).forEach(function(k){ (S.vm[k] || []).forEach(function(m){ if (m.tag === "adult") n++; }); }); return n; }

  // ----- the night stories (TC3) -----
  function nightHTML(){
    var h = '<section class="mu-night"><h4 class="mu-h">' + N.title + "</h4>";
    var sl = N.slots || {}, filled = (sl.early && sl.early.length) || (sl.later && sl.later.length);
    if (filled) h += '<div class="eng-passage eng-prose">' + [].concat(sl.early || [], sl.later || []).map(function(p){ return "<p>" + (p.pg ? '<span class="mu-pgm">p. ' + esc(p.pg) + "</span>" : "") + esc(p.t) + "</p>"; }).join("") + "</div>";
    else h += '<div class="mu-copy mu-copy-sm"><p class="tiny"><strong>' + R.copyTitle + ".</strong> " + N.copy + "</p></div>";
    h += '<p class="mu-lab">' + N.orderL + '</p><ol class="mu-norder">' + S.night.map(function(id, i){
      var c = byId(N.cards, id);
      return '<li class="mu-ncard"><span class="mu-nid">' + c.id + '</span><span class="mu-nt">' + c.t + '</span><span class="mu-nmv"><button type="button" class="btn ghost sm" data-nup="' + i + '" data-k="nu' + id + '"' + (i ? "" : " disabled") + ' aria-label="' + esc(N.up + ": " + c.id) + '">↑</button><button type="button" class="btn ghost sm" data-ndn="' + i + '" data-k="nd' + id + '"' + (i < S.night.length - 1 ? "" : " disabled") + ' aria-label="' + esc(N.down + ": " + c.id) + '">↓</button></span></li>';
    }).join("") + '</ol><div id="mu-nchips"></div></section>';
    return h;
  }

  // ----- Mode 4: Your map -----
  var mapUI = null;

  // ----- readout -----
  function readout(){
    var Rd = C.readout, o = order(), rows = [];
    var cnt = { H:0, S:0, E:0 }; o.forEach(function(id){ var l = laneOf(id); if (l) cnt[l]++; });
    rows.push([Rd.counts, cnt.H + " habit · " + cnt.S + " stretch · " + cnt.E + " event"]);
    var lastHS = -1; o.forEach(function(id, i){ var l = laneOf(id); if (l === "H" || l === "S") lastHS = i; });
    var brk = null; if (lastHS >= 0) for (var i = lastHS + 1; i < o.length; i++) if (laneOf(o[i]) === "E") { brk = o[i]; break; }
    rows.push([Rd.breaks, brk ? brk + ": " + mom(brk).short : (lastHS < 0 ? "Place habit cards to find the pattern." : "No event after the habit run yet.")]);
    var pk = peak(); rows.push([Rd.turn, pk + ": " + mom(pk).short + (S.turn ? ' <span class="tiny muted">(you marked ' + S.turn + ")</span>" : "")]);
    var first = o[0], last = o[o.length - 1];
    rows.push([Rd.path, shortWorld(first) + " → " + shortWorld(pk) + " → " + shortWorld(last)]);
    rows.push([Rd.adult, "1 pre-marked + " + adultCount() + " of yours"]);
    var h = MV.readoutHTML(rows);
    if ((S.shape || fx.shape) && !fx.model && tc1().ok) h += '<p class="mu-aha">' + C.aha + "</p>";
    return h;
  }
  function paintRead(){ $("#mu-read", host).innerHTML = readout(); }

  function paint(){
    $("#mu-how", host).innerHTML = C.how[S.mode];
    var m = $("#mu-main", host);
    MV.keepFocus(m, function(){ m.className = "mu-main mu-m-" + S.mode; m.innerHTML = S.mode === "time" ? timeHTML() : S.mode === "worlds" ? worldsHTML() : S.mode === "voice" ? voiceHTML() : '<div id="mu-map"></div>'; });
    if (S.mode === "voice") {
      mountTokens();
      radios($("#mu-nchips", host), { label:N.chipL, cls:"chips mu-nch", options:N.chips, value:S.nchip || "", onChange:function(v){ S.nchip = v; api.save(); MV.changed(); } });
    }
    if (S.mode === "map") mapUI = mapBuilder($("#mu-map", host), { uid:"xm", onChange:function(){ paintRead(); MV.changed(); } });
    paintRead();
  }

  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    var d = b.dataset;
    if (d.card) { stopFx(true); sel = sel === d.card ? "" : d.card; paint(); return; }
    if (d.lane) { if (!sel) { MV.banner("", "Tap a moment card first, then tap a lane."); return; } stopFx(); S.lane[sel] = d.lane; api.save(); var s0 = sel; sel = ""; paint(); MV.changed(); if (b.classList.contains("mu-lanebtn")) focusCard(s0); return; }
    if (d.world) { if (!sel) { MV.banner("", "Tap a moment card first, then tap the part of the farm where it belongs."); return; } stopFx(); S.world[sel] = d.world; sel = ""; api.save(); paint(); MV.changed(); return; }
    if (d.off) { if (d.off === "time") delete S.lane[sel]; else delete S.world[sel]; sel = ""; api.save(); paint(); MV.changed(); return; }
    if (d.shape) { stopFx(); S.shape = !S.shape; api.save(); paint(); MV.changed(); return; }
    if (d.turn) { stopFx(true); S.turn = S.turn === d.turn ? "" : d.turn; api.save(); paint(); MV.changed(); return; }
    if (d.lens) { stopFx(); S.lens = !S.lens; api.save(); paint(); return; }
    if (d.vtag) { stopFx(); applyTag(d.vtag); return; }
    if (d.vclear) { clearTags(); return; }
    if (d.vsave) {
      var th = tokHosts[act.pid], msg = $("#mu-vmsg", host);
      if (!th || !act.sel.length) { if (msg) msg.textContent = "Tap some words first."; return; }
      var a0 = Math.min.apply(null, act.sel), b0 = Math.max.apply(null, act.sel), line = th.toks.slice(a0, b0 + 1).map(function(t){ return t.t; }).join(" ");
      MV.eng.saveLine(line, "", "Munro, “Boys and Girls”" + (th.p.cite ? " " + th.p.cite : ""));
      if (msg) msg.textContent = "Saved to your commonplace book.";
      return;
    }
    if (d.ownadd) {
      var t = clean($("#mu-ownt", host).value).slice(0, 300), pg = clean($("#mu-ownp", host).value);
      if (!t) { $("#mu-vmsg", host).textContent = "Type a line from your copy first."; return; }
      S.ownN = (S.ownN || 0) + 1; S.own.push({ id:S.ownN, t:t, pg:pg }); api.save(); paint(); return;
    }
    if (d.ownrm != null) { var o = S.own.splice(+d.ownrm, 1)[0]; if (o) delete S.vm["own" + o.id]; api.save(); paint(); MV.changed(); return; }
    if (d.nup != null || d.ndn != null) {
      var i = +(d.nup != null ? d.nup : d.ndn), j = i + (d.nup != null ? -1 : 1), id = S.night[i];
      if (j < 0 || j >= S.night.length) return;
      S.night[i] = S.night[j]; S.night[j] = id; api.save(); paint(); MV.changed();
      var nb = $('[data-k="' + (d.nup != null ? "nu" : "nd") + id + '"]', host); if (nb && nb.disabled) nb = $('[data-k="' + (d.nup != null ? "nd" : "nu") + id + '"]', host); if (nb) nb.focus();
    }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-card]"); if (!b || S.mode !== "time") return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    var id = b.dataset.card; if (sel !== id) return;
    e.preventDefault(); stopFx();
    var cur = LANES.indexOf(S.lane[id]), nxt = cur < 0 ? (e.key === "ArrowDown" ? 0 : LANES.length - 1) : Math.max(0, Math.min(LANES.length - 1, cur + (e.key === "ArrowDown" ? 1 : -1)));
    S.lane[id] = LANES[nxt]; api.save(); paint(); MV.changed(); focusCard(id);
  });
  function focusCard(id){ var c = $('[data-card="' + id + '"]', host); if (c) c.focus({ preventScroll:true }); }
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".mu-setup"); if (!b) return;
    e.stopPropagation();
    if (S.mode !== b.dataset.setup) setMode(b.dataset.setup);
    var g = $("#mu-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }, true);

  function stopFx(keepSel){ run.n++; MV.eng.stop(); if (Object.keys(fx).length) { fx = {}; if (!keepSel) sel = ""; } }
  paintRR(); paint();

  EX = {
    shown:function(){ paint(); },
    stop:function(){ if (Object.keys(fx).length) { stopFx(); paint(); } MV.eng.stop(); },
    predict:{
      start:function(p){
        stopFx(); sel = ""; var mode = { p1:"worlds", p2:"worlds", p3:"voice", p4:"time" }[p.id];
        S.mode = mode; modeRG.set(mode);
        fx = p.id === "p1" ? { model:true, hi:"m10", p1:1 } : p.id === "p2" ? { model:true, hi:"m8" } : p.id === "p3" ? { p3:false } : { model:true, shape:true, hi:"m8" };
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        var me = ++run.n, finished = false;
        function end(){ if (finished) return; finished = true; done(); }
        function at(ms, fn){ MV.wait(ms, function(){ if (me === run.n) fn(); else end(); }); }
        if (p.id === "p1") {
          var said = 0;
          function step2(){ if (me !== run.n) return end(); fx.p1 = 2; paint(); if (VOICE && !MV.reduceMotion) { MV.eng.say(C.p1.without, { voice:VOICE, rate:0.85, onEnd:function(){ at(300, end); } }); MV.wait(6000, end); } else at(1200, end); }
          if (VOICE && !MV.reduceMotion) { MV.eng.say(C.p1.with, { voice:VOICE, rate:0.85, onEnd:function(){ if (!said++) at(250, step2); } }); MV.wait(5000, function(){ if (!said++) step2(); }); }
          else at(900, step2);
        } else if (p.id === "p2") at(300, function(){ fx.p2 = true; paint(); at(1400, end); });
        else if (p.id === "p3") at(300, function(){ fx.p3 = true; paint(); at(1400, end); });
        else if (p.id === "p4") at(300, function(){ fx.swap = true; paint(); at(700, function(){ fx.cap = C.p4.caption; paint(); at(900, end); }); });
        else end();
      }
    },
    challenge:function(id, opt){
      var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false };
      if (r.ok && id === "tc3" && opt && !opt.live) MV.banner("good", byId(C.challenges, "tc3").why);
      return r;
    }
  };
  function msg(id, k){ return byId(C.challenges, id).msgs[k]; }
  function tc1(){
    var P = S.lane, ids = ["m1", "m2", "m3", "m4", "m5", "m7", "m8", "m9"];
    if (ids.some(function(id){ return !P[id]; })) return { ok:false, msg:msg("tc1", "unplaced") };
    if (P.m1 === "E") return { ok:false, msg:msg("tc1", "m1") };
    if (P.m5 === "H") return { ok:false, msg:msg("tc1", "m5") };
    if (P.m2 === "E") return { ok:false, msg:msg("tc1", "m2") };
    var st = ids.filter(function(id){ return P[id] === "S"; });
    if (st.length) return { ok:false, msg:msg("tc1", "stretch").replace("{ids}", st.join(", ")) };
    var ok = ["m1", "m2", "m3", "m4"].every(function(id){ return P[id] === "H"; }) && ["m5", "m7", "m8", "m9"].every(function(id){ return P[id] === "E"; });
    return { ok:ok };
  }
  function tc2(){
    if (!S.turn) return { ok:false, msg:msg("tc2", "none") };
    if (S.turn === "m8") return { ok:true };
    var k = msg("tc2", S.turn); return k ? { ok:false, msg:k } : { ok:false };
  }
  function tc3(){
    var first = S.night[0] === "s1";
    if (!first) return { ok:false, msg:msg("tc3", "order") };
    if (!S.nchip) return { ok:false, msg:msg("tc3", "none") };
    if (S.nchip === "c1") return { ok:true };
    var k = msg("tc3", S.nchip); return k ? { ok:false, msg:k } : { ok:false };
  }
  return EX;
}

// ---------- Part 3: The short story in Canada (shelf; two openings with a craft → meaning panel; the Southern Ontario Gothic lens) ----------
function part3(host, api){
  var P = api.content, S = api.S, A = P.s1, B = P.s2, G = P.s3;
  S.book = S.book || ""; S.feat = S.feat || {}; S.rate = S.rate || {}; S.why = S.why || {};
  var pick = "";
  var CH = []; B.features.forEach(function(f){ CH.push({ id:f.id + ":L", f:f, t:f.L }); CH.push({ id:f.id + ":M", f:f, t:f.M }); });
  CH = MV.shuffle(CH, "mu-s2");
  host.innerHTML = '<div class="mu-p3">' +
    '<section class="mu-st"><h4 class="mu-h">' + A.title + '</h4><p class="how">' + A.how + '</p><div class="mu-shelf" role="group" aria-label="Book spines">' + A.books.map(function(b){
      return '<button type="button" class="mu-spine mu-sp-' + b.id + '" data-book="' + b.id + '" data-k="bk' + b.id + '" aria-pressed="false"><span class="mu-spa">' + b.au + '</span><span class="mu-spt">' + b.t + "</span>" + (b.yr ? '<span class="mu-spy">' + b.yr + "</span>" : "") + "</button>";
    }).join("") + '</div><div id="mu-book" class="mu-book" aria-live="polite"></div><p class="tiny muted mu-note">' + A.note + "</p></section>" +
    '<section class="mu-st"><h4 class="mu-h">' + B.title + '</h4><p class="how">' + B.how + '</p><div class="mu-open2"><blockquote class="mu-oq"><p>“' + B.leacock.text + '”</p><p class="eng-cite">' + B.leacock.cite + '</p></blockquote><blockquote class="mu-oq"><p>“' + B.munro.text + '”</p><p class="eng-cite">' + B.munro.cite + "</p></blockquote></div>" +
      '<div id="mu-s2"></div></section>' +
    '<section class="mu-st"><h4 class="mu-h">' + G.title + '</h4><p class="how">' + G.how + '</p><div id="mu-s3"></div></section></div>';
  function paintBook(){
    $$("[data-book]", host).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.book === S.book); });
    var b = byId(A.books, S.book), el = $("#mu-book", host);
    el.innerHTML = b ? '<p><strong>' + b.au + "</strong>, " + b.t + (b.yr ? " (" + b.yr + ")" : "") + "</p><p>" + b.stance + "</p>" + (b.note ? '<p class="tiny">' + b.note + "</p>" : "") : '<p class="tiny muted">Tap a spine.</p>';
  }
  function placed(){ return CH.filter(function(c){ return S.feat[c.id]; }); }
  function paintS2(){
    var el = $("#mu-s2", host), pool = CH.filter(function(c){ return !S.feat[c.id]; }), all = !pool.length;
    var h = '<div class="mu-fpool" role="group" aria-label="Features to place">' + (pool.length ? pool.map(function(c){ return '<button type="button" class="chip mu-fchip' + (pick === c.id ? " on" : "") + '" data-fc="' + c.id + '" data-k="fc' + c.id.replace(":", "") + '" aria-pressed="' + (pick === c.id) + '"><span class="tiny muted">' + c.f.t + ":</span> " + c.t + "</button>"; }).join("") : '<span class="tiny muted">Every feature is placed.</span>') + "</div>";
    h += '<div class="tbl-wrap"><table class="mu-ftab"><thead><tr><th scope="col">Feature</th><th scope="col"><button type="button" class="btn ghost sm mu-colbtn" data-col="L" data-k="colL">' + B.leacock.who + '</button></th><th scope="col"><button type="button" class="btn ghost sm mu-colbtn" data-col="M" data-k="colM">' + B.munro.who + "</button></th></tr></thead><tbody>" +
      B.features.map(function(f){
        function cell(col){ return CH.filter(function(c){ return c.f.id === f.id && S.feat[c.id] === col; }).map(function(c){ return '<button type="button" class="chip mu-fin" data-fback="' + c.id + '" data-k="fb' + c.id.replace(":", "") + '" aria-label="' + esc(c.t + ": tap to take it back") + '">' + c.t + "</button>"; }).join(" "); }
        return "<tr><th scope=\"row\">" + f.t + "</th><td>" + cell("L") + "</td><td>" + cell("M") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    if (all) h += '<div class="mu-panel"><h5>' + B.panelTitle + "</h5><p>" + B.panel + '</p><details class="alg"><summary>' + B.reading + '</summary><div class="tbl-wrap"><table class="mu-ftab"><thead><tr><th scope="col">Feature</th><th scope="col">Leacock</th><th scope="col">Munro</th></tr></thead><tbody>' +
      B.features.map(function(f){ return "<tr><th scope=\"row\">" + f.t + "</th><td>" + f.L + "</td><td>" + f.M + "</td></tr>"; }).join("") + "</tbody></table></div></details></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function kindsOf(t){
    var low = " " + String(t || "").toLowerCase().replace(/[^a-z’' ]+/g, " ") + " ", out = [];
    Object.keys(G.kinds).forEach(function(k){ if (G.kinds[k].some(function(w){ return low.indexOf(" " + w + " ") >= 0; })) out.push(k); });
    return out;
  }
  function paintS3(){
    var el = $("#mu-s3", host), on = !!S.lens, n = G.details.filter(function(d){ return S.rate[d.id]; }).length;
    var h = '<div class="mu-glens"><button type="button" class="an-chip an-theme" data-glens="1" data-k="glens" aria-pressed="' + on + '"><i class="an-dot"></i>' + G.lens + "</button></div>" +
      '<div class="mu-gfig' + (on ? " dark" : "") + '">' + gothicSVG(on) + "</div>";
    h += '<ol class="mu-glist">' + G.details.map(function(d, i){
      var r = S.rate[d.id] || "", ks = kindsOf(S.why[d.id]), fb = "";
      if (ks.length) fb = '<p class="mu-gfb good">' + G.good.replace("{kinds}", ks.join(" and ").replace("confinement", "confinement")) + "</p>";
      else if (r === "set") fb = '<p class="mu-gfb">' + G.neutral + "</p>";
      return '<li class="mu-gd' + (on ? " lift" : "") + '"><p><span class="mu-gn">' + (i + 1) + "</span> " + d.t + '</p><div class="mu-grate" data-gr="' + d.id + '"></div><div class="mu-gwhy"><label for="mu-gw-' + d.id + '" class="tiny">' + G.whyL + '</label><input type="text" class="txtin" id="mu-gw-' + d.id + '" data-gw="' + d.id + '" maxlength="160" autocomplete="off"></div><div class="mu-gfbw" id="mu-gfb-' + d.id + '" aria-live="polite">' + fb + "</div></li>";
    }).join("") + "</ol>";
    h += n === G.details.length ? '<div class="mu-panel"><h5>' + G.noteTitle + "</h5><p>" + G.note + "</p></div>" : '<p class="tiny muted">' + G.after + "</p>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
    G.details.forEach(function(d){
      radios($('[data-gr="' + d.id + '"]', el), { cls:"chips", aria:"Your rating: " + d.t, options:G.rates, value:S.rate[d.id] || "", onChange:function(v){ S.rate[d.id] = v; api.save(); paintS3(); var nb = $('[data-gr="' + d.id + '"] [data-rg="' + v + '"]', host); if (nb) nb.focus(); } });
      $("#mu-gw-" + d.id, el).value = S.why[d.id] || "";
    });
  }
  function gothicSVG(on){
    var spots = [[60, 128], [112, 92], [150, 118], [232, 88], [186, 116]];
    var g = '<svg class="mu-gsvg" viewBox="0 0 300 150" role="img" aria-label="' + esc(on ? "The farm sketch darkens; five numbered details lift out: the cellar under the house, the horses in the barn, the gun behind the barn, the steaming kitchen, and the gate." : "A sketch of the farm: the house with its cellar and kitchen, the barn, and the gate to the field.") + '">' +
      '<path class="mu-gl" d="M10 130 H290"/><path class="mu-gl" d="M20 130 V70 L60 45 L100 70 V130 M30 112 H90"/><path class="mu-gl" d="M215 130 V78 L240 58 L265 78 V130 M224 96 H240 V112 H224 Z"/>' +
      '<path class="mu-gl" d="M105 130 V80 L135 58 L165 80 V130 M122 130 V102 H148 V130"/><path class="mu-gl" d="M176 130 V104 M196 130 V104 M176 110 H196 M176 122 H196"/>';
    spots.forEach(function(s, i){ g += '<g class="mu-gspot' + (on ? " on" : "") + '"><circle cx="' + s[0] + '" cy="' + s[1] + '" r="9"/><text x="' + s[0] + '" y="' + (s[1] + 4) + '" text-anchor="middle">' + (i + 1) + "</text></g>"; });
    return g + "</svg>";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b)) return;
    var d = b.dataset;
    if (d.book) { S.book = d.book; api.save(); paintBook(); return; }
    if (d.fc) { pick = pick === d.fc ? "" : d.fc; paintS2(); return; }
    if (d.col) { if (!pick) { var p0 = $("#mu-s2 .mu-fpool", host); if (p0 && !$(".mu-s2msg", host)) p0.insertAdjacentHTML("afterend", '<p class="tiny mu-s2msg">Tap a feature first, then tap a column.</p>'); return; } S.feat[pick] = d.col; pick = ""; api.save(); paintS2(); return; }
    if (d.fback) { delete S.feat[d.fback]; api.save(); paintS2(); return; }
    if (d.glens) { S.lens = !S.lens; api.save(); paintS3(); return; }
  });
  host.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset.gw) return;
    S.why[t.dataset.gw] = t.value; api.save();
    var id = t.dataset.gw, ks = kindsOf(t.value), r = S.rate[id] || "", el = $("#mu-gfb-" + id, host);
    el.innerHTML = ks.length ? '<p class="mu-gfb good">' + G.good.replace("{kinds}", ks.join(" and ")) + "</p>" : r === "set" ? '<p class="mu-gfb">' + G.neutral + "</p>" : "";
  });
  paintBook(); paintS2(); paintS3();

  // Sentence to steal: save the imitation to the commonplace book (with the master's line)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#mu-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="mu-steal-save">' + ST.save + '</button><span class="tiny muted" id="mu-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "mu-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#mu-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#mu-steal-st").textContent = "Saved your imitation to your notebook’s commonplace book.";
    });
  }
  return {};
}

// ---------- Practice 1: Two worlds (toolkit K12 sorter + a one-line reflection after sorting) ----------
function worlds(host, api, a){
  host.innerHTML = '<div id="mu-wsort"></div><div class="jq mu-wref" id="mu-wref" hidden><p class="tiny muted">' + a.reflect.after + '</p><label for="mu-wrt">' + a.reflect.q + '</label><input type="text" class="txtin" id="mu-wrt" maxlength="200" autocomplete="off"><p class="tiny muted">' + a.reflect.label + "</p></div>";
  var sub = MV.activityTypes.sorter($("#mu-wsort", host), a);
  var inp = $("#mu-wrt", host); inp.value = api.S.reflect || "";
  function check(){ var s = sub.stats(); $("#mu-wref", host).hidden = s.done < s.total; }
  host.addEventListener("click", function(){ setTimeout(check, 0); });
  inp.addEventListener("input", function(){ api.S.reflect = inp.value; api.save(); });
  check();
  return { stats:sub.stats, missed:sub.missed };
}

// ---------- Practice 2: The fair ribbon (R1 paragraph chips, R2 ordering, R3–R6 toolkit MC) ----------
function ribbon(host, api, a){
  var B = api.S; B.r1 = B.r1 || { tries:0, hint:0, solved:false, first:null, last:null }; B.r2 = B.r2 || { tries:0, hint:0, solved:false, first:null, order:a.r2.start.slice(), fb:null };
  var IDS = ["F1", "F2", "F3", "F4", "F5"];
  host.innerHTML = '<p class="tiny">' + a.why + '</p><div class="mu-rib"><p class="mu-lab">' + a.passageTitle + '</p><div class="eng-passage eng-prose">' + a.passage.map(function(p, i){ return '<p><span class="eng-ln">F' + (i + 1) + "</span>" + esc(p) + "</p>"; }).join("") + "</div></div>" +
    '<div class="q" id="mu-r1"></div><div class="q" id="mu-r2"></div><div id="mu-rmc"></div><div id="mu-rcon" aria-live="polite"></div>';
  function paintR1(){
    var x = B.r1, R = a.r1, el = $("#mu-r1", host), ans = MV.ans(R);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">1</span><div class="q-prompt">' + R.prompt + '</div></div><div class="chips" role="group" aria-label="Paragraphs">' + IDS.map(function(id){
      var c = "chip"; if (x.solved && id === ans) c += " on"; else if (x.last === id && !x.solved) c += " mu-wrongc";
      return '<button type="button" class="' + c + '" data-r1="' + id + '" data-k="r1' + id + '"' + (x.solved ? " disabled" : "") + ">" + id + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions">' + MV.hintBtn("r1hint", x.hint) + "</div>" + MV.hintsHTML(R.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + R.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (x.last) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + ((R.wrong && R.wrong[x.last]) || R.wrongDefault) + " Try again.");
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function r2ok(o){
    var i1 = o.indexOf("F1"), i5 = o.indexOf("F5");
    return o[0] === "F2" && Math.min(i1, i5) === 3 && o.indexOf("F4") < 3 && o.indexOf("F3") < 3;
  }
  function paintR2(){
    var x = B.r2, R = a.r2, el = $("#mu-r2", host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">2</span><div class="q-prompt">' + R.prompt + '</div></div><ol class="mu-rord">' + x.order.map(function(id, i){
      var t = a.passage[+id.slice(1) - 1], snip = t.split(/\s+/).slice(0, 7).join(" ") + "…";
      return '<li><span class="mu-nid">' + id + '</span><span class="mu-nt">' + esc(snip) + '</span><span class="mu-nmv"><button type="button" class="btn ghost sm" data-rup="' + i + '" data-k="ru' + id + '"' + (i && !x.solved ? "" : " disabled") + ' aria-label="Move ' + id + ' up">↑</button><button type="button" class="btn ghost sm" data-rdn="' + i + '" data-k="rd' + id + '"' + (i < 4 && !x.solved ? "" : " disabled") + ' aria-label="Move ' + id + ' down">↓</button></span></li>';
    }).join("") + "</ol>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-r2chk="1" data-k="r2chk">Check</button>' + MV.hintBtn("r2hint", x.hint) + "</div>" + MV.hintsHTML(R.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + R.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (x.fb) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.fb);
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  var mc = MV.activityTypes.mc($("#mu-rmc", host), { id:a.id + "-mc", items:a.items, summary:a.summary, goal:a.goal });
  function mcSt(){ return (MV.S.act[a.id + "-mc"] || {}).items || {}; }
  function paintCon(){ var r6 = mcSt().r6; $("#mu-rcon", host).innerHTML = r6 && r6.solved ? '<p class="an-note an-theme mu-con">' + a.connection + "</p>" : ""; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if ($("#mu-r1", host).contains(b)) {
      var x = B.r1;
      if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
      else if (b.dataset.r1) { x.last = b.dataset.r1; if (b.dataset.r1 === MV.ans(a.r1)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++; }
      MV.save(); paintR1(); if (b.dataset.r1) MV.focusFb($("#mu-r1", host)); return;
    }
    if ($("#mu-r2", host).contains(b)) {
      var y = B.r2;
      if (b.dataset.act === "hint") y.hint = Math.min(3, y.hint + 1);
      else if (b.dataset.rup != null || b.dataset.rdn != null) {
        var i = +(b.dataset.rup != null ? b.dataset.rup : b.dataset.rdn), j = i + (b.dataset.rup != null ? -1 : 1), id = y.order[i];
        y.order[i] = y.order[j]; y.order[j] = id; y.fb = null; MV.save(); paintR2();
        var nb = $('[data-k="' + (b.dataset.rup != null ? "ru" : "rd") + id + '"]', host); if (nb && nb.disabled) nb = $('[data-k="' + (b.dataset.rup != null ? "rd" : "ru") + id + '"]', host); if (nb) nb.focus();
        return;
      }
      else if (b.dataset.r2chk) {
        if (r2ok(y.order)) { y.solved = true; y.first = y.tries === 0 && y.hint < 3; y.fb = null; }
        else { y.tries++; y.fb = y.order[0] === "F1" ? a.r2.first : a.r2.other; }
      }
      MV.save(); paintR2(); if (b.dataset.r2chk) MV.focusFb($("#mu-r2", host)); return;
    }
    setTimeout(paintCon, 0);
  });
  paintR1(); paintR2(); paintCon();
  return {
    stats:function(){
      var s = mc.stats(), f = s.first + (B.r1.first ? 1 : 0) + (B.r2.first ? 1 : 0), d = s.done + (B.r1.solved ? 1 : 0) + (B.r2.solved ? 1 : 0), n = s.total + 2;
      return { first:f, total:n, done:d, line:a.summary + " (first try): " + f + "/" + n + (d < n ? " (unfinished)" : "") };
    },
    missed:function(){ var g = mc.missed(); if (B.r1.tries > 0 || B.r1.hint >= 3) g = g.concat(MV.goalIdx(a.r1.goal)); if (B.r2.tries > 0 || B.r2.hint >= 3) g = g.concat(MV.goalIdx(a.r2.goal)); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 11; numbered sentences) ----------
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

// ---------- Performance task: Map and argue (the map + @component E6 paragraph builder: claim / evidence / analysis / link,
// a free-form view, and the plan's seven structure tests) ----------
// quotations: “…”, "…", ‘…’, '…' (not apostrophes); returns [{a, b, inner}]
function quoteSpans(t){
  var s = String(t || ""), out = [], m, res = [/“([^”]+)”/g, /"([^"]+)"/g, /‘([^’]+?)’(?![A-Za-z])/g, /(?:^|[\s(\[—–-])'([^']+?)'(?=[\s.,;:!?)\]—–-]|$)/g];
  res.forEach(function(re){ while ((m = re.exec(s))) { var a = m.index + m[0].indexOf(m[1]) - 1; out.push({ a:a, b:a + m[1].length + 2, inner:m[1] }); } });
  return out.filter(function(q){ return clean(q.inner).length > 0; });
}
function wordRE(w){ return new RegExp("(^|[^A-Za-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+") + "(?![A-Za-z])", "i"); }
var PAREN_D = /\([^()]*\d[^()]*\)/g;
var taskChecks = {
  mapEntries:function(M){ return (M || []).filter(function(e){ return clean(e.q) && /\d/.test(e.pg || ""); }).length; },
  map5:function(M){ return taskChecks.mapEntries(M) >= 5; },
  bothTimes:function(M){ M = M || []; return M.some(function(e){ return e.time === "H"; }) && M.some(function(e){ return e.time === "E"; }); },
  names:function(claim, title, author){ var c = clean(claim).toLowerCase(), t = clean(title).toLowerCase(), au = clean(author); return !!c && !!t && !!au && c.indexOf(t) >= 0 && wordRE(au).test(claim); },
  howWhy:function(claim, T){ return T.craft.some(function(w){ return new RegExp("(^|[^A-Za-z])" + w.replace(/ /g, "\\s+"), "i").test(claim || ""); }) && T.whySig.some(function(w){ return wordRE(w).test(claim || ""); }); },
  quoted:function(text){ return quoteSpans(text).some(function(q){ var rest = text.slice(q.b), re = new RegExp(PAREN_D.source), m = re.exec(rest); return !!m && m.index <= 20; }); },
  after:function(text){ var re = new RegExp(PAREN_D.source, "g"), m, last = -1; while ((m = re.exec(text))) last = m.index + m[0].length; return last >= 0 && wc(text.slice(last)) >= 40; },
  length:function(n, T){ return n >= T.min && n <= T.max; }
};
function firstSentence(t){ var s = clean(t), m = s.match(/^[\s\S]*?[.!?]["”’)]*(?=\s+["“‘(]?[A-Z0-9]|\s*$)/); return m ? m[0] : s; }
var task = (function(){
  var api = null, T = null, mapUI = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; if (!T) T = MV.C.task;
    var free = S.mode === "free", segs = [clean(S.claim), clean(S.ev), clean(S.an), clean(S.link)];
    var text = free ? clean(S.free) : segs.filter(Boolean).join(" ");
    var claim = free ? firstSentence(S.free) : clean(S.claim);
    var M = EXS().map || [];
    return { mode:free ? "free" : "build", title:S.title == null ? T.defaults.title : S.title, author:S.author == null ? T.defaults.author : S.author, focus:S.focus || "", claim:claim, text:text, n:wc(text), map:M, include:!!S.include, explain:explain() };
  }
  function checks(d){
    if (!T) T = MV.C.task;
    return [taskChecks.map5(d.map), taskChecks.bothTimes(d.map), taskChecks.names(d.claim, d.title, d.author), taskChecks.howWhy(d.claim, T), taskChecks.quoted(d.text), taskChecks.after(d.text), taskChecks.length(d.n, T)];
  }
  function slot(cls, id, tag, how, attrs, opt){ return '<div class="mu-slot ' + cls + '"><label for="' + id + '"><span class="mu-ptag">' + tag + "</span>" + (opt ? ' <span class="muted">(' + T.labels.opt + ")</span>" : "") + ' <span class="tiny muted">' + how + '</span></label><textarea id="' + id + '" ' + attrs + "></textarea></div>"; }
  function counts(){ var d = data(api.S); $("#mu-tcount").textContent = d.n + " " + T.labels.words + " (" + T.min + "–" + T.max + ")"; }
  function preview(){
    var S = api.S, el = $("#mu-tpv"); if (!el) return;
    if (S.mode === "free") { el.innerHTML = clean(S.free) ? "<p>" + esc(clean(S.free)) + "</p>" : '<p class="tiny muted">Your paragraph appears here.</p>'; return; }
    var ps = [["claim", T.labels.claim, S.claim], ["ev", T.labels.ev, S.ev], ["an", T.labels.an, S.an], ["link", T.labels.link, S.link]].filter(function(x){ return clean(x[2]); });
    el.innerHTML = ps.length ? "<p>" + ps.map(function(x){ return '<span class="mu-pp mu-pp-' + x[0] + '"><span class="mu-pptag">' + esc(x[1]) + "</span>" + esc(clean(x[2])) + "</span>"; }).join(" ") + "</p>" : '<p class="tiny muted">Your paragraph appears here as you fill the slots, coloured by part: claim, evidence, analysis, link.</p>';
  }
  function models(){
    var el = $("#mu-tmodels"); if (!el) return;
    if (checks(data(api.S)).every(Boolean)) api.S.unlocked = true;
    el.innerHTML = api.S.unlocked ? '<h4 class="mu-h">' + T.modelsLabel + '</h4><p class="tiny muted">' + T.modelsNote + "</p>" + T.models.map(function(m){ return '<details class="alg mu-model"><summary>' + m.title + "</summary><p>" + m.text + "</p></details>"; }).join("") : "";
  }
  function all(){ api.save(); counts(); preview(); api.update(); models(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, lab = T.labels; S.mode = S.mode === "free" ? "free" : "build";
      if (S.title == null) S.title = T.defaults.title; if (S.author == null) S.author = T.defaults.author;
      inp.innerHTML = '<div class="mu-task"><h4 class="mu-h">' + lab.setup + '</h4><div class="mu-setupf"><div class="jq"><label for="mu-ttitle">' + lab.title + '</label><input type="text" class="txtin" id="mu-ttitle" data-tf="title" maxlength="80" autocomplete="off"></div><div class="jq"><label for="mu-tauth">' + lab.author + '</label><input type="text" class="txtin" id="mu-tauth" data-tf="author" maxlength="60" autocomplete="off"></div></div>' +
        '<div id="mu-tfocus"></div>' +
        '<details class="alg mu-tmap" open><summary>' + lab.map + '</summary><div id="mu-tmapb"></div><label class="mu-incl"><input type="checkbox" id="mu-tincl"> ' + lab.include + "</label></details>" +
        '<div id="mu-tmode"></div><div id="mu-tbuild">' +
        slot("mu-s-claim", "mu-tclaim", lab.claim, lab.claimHow, 'data-tf="claim" rows="2"') +
        slot("mu-s-ev", "mu-tev", lab.ev, lab.evHow, 'data-tf="ev" rows="2"') +
        slot("mu-s-an", "mu-tan", lab.an, lab.anHow, 'data-tf="an" rows="4"') +
        slot("mu-s-link", "mu-tlink", lab.link, lab.linkHow, 'data-tf="link" rows="2"') + "</div>" +
        '<div id="mu-tfree"><div class="jq"><label for="mu-tfreet">' + lab.freeL + '</label><textarea id="mu-tfreet" class="mu-big" data-tf="free" rows="9"></textarea><p class="tiny muted">' + lab.freeHow + "</p></div></div>" +
        '<p class="tiny" id="mu-tcount" aria-live="polite"></p></div>';
      pv.innerHTML = '<h4 class="mu-h" style="margin-top:0">' + lab.pv + '</h4><div id="mu-tpv" class="mu-pv"></div><div id="mu-tmodels"></div>';
      $("#mu-ttitle").value = S.title; $("#mu-tauth").value = S.author;
      $("#mu-tclaim").value = S.claim || ""; $("#mu-tev").value = S.ev || ""; $("#mu-tan").value = S.an || ""; $("#mu-tlink").value = S.link || ""; $("#mu-tfreet").value = S.free || "";
      $("#mu-tincl").checked = !!S.include;
      radios($("#mu-tfocus"), { label:lab.focus, cls:"chips", options:T.focus, value:S.focus || "", onChange:function(v){ S.focus = v; all(); } });
      function show(){ $("#mu-tbuild").hidden = S.mode === "free"; $("#mu-tfree").hidden = S.mode !== "free"; }
      radios($("#mu-tmode"), { label:lab.write, cls:"seg", options:[{ id:"build", t:lab.build }, { id:"free", t:lab.free }], value:S.mode,
        onChange:function(v){ S.mode = v; if (v === "free" && !clean(S.free)) { S.free = [S.claim, S.ev, S.an, S.link].map(clean).filter(Boolean).join(" "); $("#mu-tfreet").value = S.free; } show(); all(); } });
      show();
      mapUI = mapBuilder($("#mu-tmapb"), { uid:"tm", onChange:function(){ all(); } });
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tf; if (!k) return; S[k] = e.target.value; all(); });
      $("#mu-tincl").addEventListener("change", function(){ S.include = $("#mu-tincl").checked; all(); });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      counts(); preview(); models();
    },
    refresh:function(){ if (mapUI) mapUI.paint(); if (api) all(); },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text ? true : "Write your paragraph first."; },
    checks:checks,
    key:function(d){ return d.focus || "paragraph"; },
    label:function(k){ var f = byId(MV.C.task.focus, k); return f ? esc(f.t) : "a paragraph"; },
    text:function(k){ var f = byId(MV.C.task.focus, k); return f ? f.t : "a paragraph"; },
    summary:function(ts){
      if (!T) T = MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.filter(Boolean).length, L = [], nM = taskChecks.mapEntries(d.map), f = byId(T.focus, d.focus);
      L.push(T.summary + ": " + (met === r.length ? "complete (map with " + nM + " moments; paragraph " + d.n + " words)" : "not complete yet (checklist " + met + "/" + r.length + ")"));
      L.push("  Story: “" + clean(d.title) + "” by " + clean(d.author) + "; choice argued: " + (f ? f.t : "(not chosen)") + "; written with the " + (d.mode === "free" ? "free-form box" : "paragraph builder"));
      L.push("  Full paragraph (" + d.n + " words):");
      L.push("    " + (d.text || "(not written yet)"));
      var X = EXC().map;
      if (d.include && d.map.length) {
        L.push("  Map (" + d.map.length + " moments):");
        d.map.forEach(function(e, i){ L.push("    " + (i + 1) + ". “" + e.q + "” (p. " + e.pg + ") · " + byId(X.times, e.time).t + " · " + byId(X.worlds, e.world).t + " · " + byId(X.voices, e.voice).t); });
      } else L.push("  Map: " + d.map.length + " moments (quotations not included in this summary)");
      L.push("  Teacher rubric (Ontario achievement chart, levels 1–4):");
      T.rubric.forEach(function(row){ L.push("    " + row[0] + ": 1 " + row[1] + " | 2 " + row[2] + " | 3 " + row[3] + " | 4 " + row[4]); });
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, the 140-character principle, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">Examples only. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "” <span class=\"tiny muted\">(" + s.tag + ")</span></p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  var ap = $("#art-p");
  if (ap && !$("#mu-artn")) {
    ap.maxLength = R.principleMax;
    var n = document.createElement("p"); n.id = "mu-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ n.textContent = ap.value.length + "/" + R.principleMax + " characters"; };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"); if (cp && !cp.childNodes.length) MV.eng.commonplace(cp, { lines:R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, "").replace(/^“|”$/g, ""); }) });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ worlds:worlds, ribbon:ribbon, spot:spotProse },
  task:task,
  summaryLines:function(){
    var a = MV.C.practice.activities.filter(function(x){ return x.id === "worlds"; })[0], s = (MV.S.act.worlds || {}).reflect;
    return [a.title + ", where the gate belongs (unscored): " + (clean(s) || "(not answered)")];
  },
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX) { if (v === "explore") EX.shown(); else EX.stop(); }
    if (v === "final-check" && task.refresh) task.refresh();
    if (v === "reflect") extras();
  }
});
})();
