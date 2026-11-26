// ENG4U 08 Elizabethan Context: hero (the ladder of creation and "What a piece of work is a man"), World of the play
// (Explore, E10 stage simulator: Globe cutaway with tappable zones and a daylight toggle, belief cards over the E1 line bank,
// two editions read aloud), Then and now (Part 3: paired lens cards and a sentence builder), Spot the Error (K13) and the
// "Program note" task (E17 draft workspace, quotation inserter, then/now sentence tags). Texts: content.mjs (Globe Hamlet).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

// ---------- @component radioGroup (copied from ENG4U 06; no option needs to be checked) ----------
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

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; document.documentElement.classList.toggle("ez-novoice", !v); var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
// read a list of chunks with a pause after each (400 ms at "!" and ","); returns a token whose .stop() cancels
function readChunks(chunks, onChunk, onDone){
  var tok = { stopped:false, stop:function(){ tok.stopped = true; MV.eng.stop(); } }, i = 0;
  function next(){
    if (tok.stopped) return;
    if (i >= chunks.length || !VOICE) { if (onChunk) onChunk(-1); if (onDone) onDone(); return; }
    var k = i++; if (onChunk) onChunk(k);
    MV.eng.say(chunks[k], { voice:VOICE, onEnd:function(){ if (tok.stopped) return; setTimeout(next, /[!,]\s*$/.test(chunks[k]) ? 400 : 120); } });
  }
  next();
  return tok;
}
function chunksOf(text){ return String(text).match(/[^!,?]+[!,?]?/g) || []; }

// ---------- hero: the ladder of creation; man's rung rises at "angel… god", then crumbles to dust ----------
var HR = { run:0 };
function ladderSVG(R, dust){
  var ys = [34, 80, 126, 172, 218], h = '<svg class="ez-ladder" viewBox="0 0 160 272" aria-hidden="true" focusable="false">';
  h += '<line class="ez-rail" x1="26" y1="8" x2="26" y2="236"/><line class="ez-rail" x1="134" y1="8" x2="134" y2="236"/>';
  h += '<line class="ez-gap" x1="26" y1="126" x2="134" y2="126"/>';
  R.forEach(function(r, i){ h += '<g class="ez-rung ez-r-' + r.id + '"><line x1="26" y1="' + ys[i] + '" x2="134" y2="' + ys[i] + '"/><text x="80" y="' + (ys[i] - 8) + '" text-anchor="middle">' + esc(r.t) + "</text></g>"; });
  var pts = [[52, 250], [60, 246], [67, 251], [74, 244], [80, 249], [86, 243], [92, 250], [99, 245], [106, 251], [70, 253], [84, 254], [96, 254], [62, 254], [78, 241]];
  h += '<g class="ez-dust">' + pts.map(function(p){ return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.2"/>'; }).join("") + '<text x="80" y="268" text-anchor="middle">' + esc(dust) + "</text></g>";
  return h + "</svg>";
}
function hero(){
  var H = MV.C.hero, host = $("#ez-hero"); if (!host) return;
  var words = H.passage.split(/\s+/), iAngel = -1, iDust = -1;
  words.forEach(function(w, i){ if (iAngel < 0 && /^angel/i.test(w)) iAngel = i; if (/^dust/i.test(w)) iDust = i; });
  host.innerHTML = '<div class="ez-hgrid">' + ladderSVG(H.rungs, H.dust) + '<div><p class="ez-hp">' + words.map(function(w, i){ return '<span class="eng-w" data-wi="' + i + '">' + esc(w) + "</span>"; }).join(" ") +
    '</p><p class="eng-cite">' + H.cite + '</p></div></div><p class="ez-hcap">' + H.caption + '</p><div class="ez-hctl"><button type="button" class="btn ghost sm" id="ez-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="ez-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="ez-hnote" hidden>' + H.noVoice + "</span></div>";
  var W = $$(".eng-w", host);
  function lit(n, speak){ W.forEach(function(e, i){ e.classList.toggle("lit", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); }
  function step(n, speak){ lit(n, speak); if (n >= iAngel) host.classList.add("rise"); if (n >= iDust) host.classList.add("crumble"); }
  function reset(){ host.classList.remove("rise", "crumble", "done", "cap-on"); host.classList.add("anim"); lit(-1); }
  function finish(){ host.classList.remove("anim"); host.classList.add("rise", "crumble", "done", "cap-on"); lit(words.length - 1); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run, t0 = 300, dt = 55; MV.eng.stop(); reset();
    words.forEach(function(_, i){ at(me, t0 + i * dt, function(){ step(i, true); }); });
    at(me, t0 + words.length * dt + 400, function(){ lit(words.length - 1); host.classList.add("cap-on"); });
    at(me, t0 + words.length * dt + 1300, finish);
  }
  function listen(){
    var me = ++HR.run;
    if (MV.reduceMotion) finish(); else reset();
    MV.eng.say(H.passage, { voice:VOICE, onWord:function(w){ if (me !== HR.run || MV.reduceMotion) return; step(w, true); }, onEnd:function(){ if (me !== HR.run) return; finish(); } });
  }
  function btns(){ $("#ez-hlisten").hidden = !VOICE; $("#ez-hagain").hidden = MV.reduceMotion; $("#ez-hnote").hidden = !!VOICE; }
  $("#ez-hlisten").addEventListener("click", listen);
  $("#ez-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ MV.eng.stop(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- @component E10 stageSimulator (Globe cutaway form) — schematic playhouse SVG with zone buttons laid over it
// (a numbered list under 640 px), daylight / lights-down states, ghost "not at the Globe" items and a voice from below ----------
var ZPOS = { yard:[50, 90], galleries:[13.5, 50], stage:[29, 66], trap:[50, 79], tiring:[50, 52], upper:[50, 31], heavens:[50, 20.5] };
function globeSVG(G){
  var h = '<svg class="ez-svg" viewBox="0 0 480 320" role="img" aria-label="" focusable="false">';
  h += '<rect class="ez-sky" x="0" y="0" width="480" height="320"/>';
  h += '<g class="ez-sun"><circle cx="448" cy="22" r="13"/><text x="428" y="27" text-anchor="end">2 p.m.</text></g>';
  // yard with groundlings
  h += '<g class="ez-zg ez-zg-yard"><rect class="ez-fill" x="8" y="262" width="464" height="50" rx="4"/>';
  for (var i = 0; i < 17; i++) { var x = 40 + i * 24 + (i % 2 ? 6 : 0), y = 281 + (i % 3) * 7; h += '<circle class="ez-head" cx="' + x + '" cy="' + y + '" r="5"/>'; }
  h += "</g>";
  // galleries, left and right, three tiers under thatch
  h += '<g class="ez-zg ez-zg-galleries">';
  [14, 370].forEach(function(x0){
    h += '<polygon class="ez-roof" points="' + (x0 - 8) + ',72 ' + (x0 + 48) + ',46 ' + (x0 + 104) + ',72"/><rect class="ez-fill" x="' + x0 + '" y="72" width="96" height="190"/>';
    [135, 198].forEach(function(y){ h += '<line class="ez-tier" x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + 96) + '" y2="' + y + '"/>'; });
    [100, 163, 226].forEach(function(y){ for (var k = 0; k < 4; k++) h += '<circle class="ez-head" cx="' + (x0 + 16 + k * 21) + '" cy="' + y + '" r="4.5"/>'; });
  });
  h += "</g>";
  // tiring house: two doors and a curtained middle
  h += '<g class="ez-zg ez-zg-tiring"><rect class="ez-fill" x="150" y="116" width="180" height="86"/><rect class="ez-door" x="162" y="150" width="26" height="52" rx="10"/><rect class="ez-door" x="292" y="150" width="26" height="52" rx="10"/>' +
    '<rect class="ez-curtain" x="208" y="140" width="64" height="62"/><path class="ez-fold" d="M220 140v62M232 140v62M244 140v62M256 140v62"/></g>';
  // upper gallery: balcony with musicians
  h += '<g class="ez-zg ez-zg-upper"><rect class="ez-fill" x="150" y="86" width="180" height="30"/><line class="ez-tier" x1="150" y1="108" x2="330" y2="108"/>';
  [180, 210, 240, 270, 300].forEach(function(x){ h += '<circle class="ez-head" cx="' + x + '" cy="99" r="4.5"/>'; });
  h += "</g>";
  // heavens: painted canopy on two pillars
  h += '<g class="ez-zg ez-zg-heavens"><polygon class="ez-fill" points="126,56 354,56 340,80 140,80"/>';
  [[170, 66], [205, 71], [240, 65], [275, 71], [310, 66]].forEach(function(p){ h += '<path class="ez-star" d="M' + p[0] + " " + (p[1] - 4) + "l1.4 2.8 3 .4-2.2 2.1.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.1 3-.4z\"/>"; });
  h += "</g>";
  h += '<line class="ez-pillar" x1="168" y1="80" x2="168" y2="201"/><line class="ez-pillar" x1="312" y1="80" x2="312" y2="201"/>';
  // stage (thrust platform) and the trapdoor with the under-stage cut away
  h += '<g class="ez-zg ez-zg-stage"><polygon class="ez-fill" points="150,201 330,201 372,215 108,215"/><rect class="ez-fill" x="108" y="215" width="264" height="22"/></g>';
  h += '<g class="ez-zg ez-zg-trap"><polygon class="ez-door ez-trapdoor" points="225,204 255,204 258,212 222,212"/><rect class="ez-under" x="172" y="237" width="136" height="24"/><text class="ez-ul" x="240" y="253" text-anchor="middle">under-stage</text></g>';
  // the things the Globe did not have (shown by prediction 1)
  h += '<g class="ez-ghost"><line x1="150" y1="30" x2="330" y2="30"/>' + [170, 205, 240, 275, 310].map(function(x){ return '<circle cx="' + x + '" cy="37" r="5"/>'; }).join("") +
    '<text x="240" y="21" text-anchor="middle">' + esc(G.light) + ": " + esc(G.not) + "</text>" +
    '<rect x="196" y="122" width="88" height="16" rx="3"/><text x="240" y="134" text-anchor="middle">' + esc(G.back) + ": " + esc(G.not) + "</text></g>";
  // lights down: a dark house with one spotlight
  h += '<rect class="ez-night" x="0" y="0" width="480" height="320"/><polygon class="ez-spot" points="230,0 250,0 352,214 128,214"/>';
  // the voice from below
  h += '<text class="ez-swear" x="240" y="256" text-anchor="middle">“Swear!”</text>';
  // number badges (shown when the zones become a list)
  G.zones.forEach(function(z, i){ var p = ZPOS[z.id], x = p[0] * 4.8, y = p[1] * 3.2; h += '<g class="ez-badge"><circle cx="' + x + '" cy="' + y + '" r="10"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + (i + 1) + "</text></g>"; });
  return h + "</svg>";
}

// ---------- Explore: World of the play ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S;
  var ZONES = C.zones, BANK = C.bank, BEL = C.beliefs, Z = {}, BK = {};
  ZONES.forEach(function(z){ Z[z.id] = z; }); BANK.forEach(function(b){ BK[b.id] = b; });
  // zones in DOM order: yard to the heavens
  var ZORDER = ["yard", "galleries", "stage", "trap", "tiring", "upper", "heavens"].map(function(id){ return Z[id]; });
  S.mode = ["globe", "beliefs", "editions"].indexOf(S.mode) >= 0 ? S.mode : "globe";
  S.light = S.light === "dark" ? "dark" : "day";
  S.zone = Z[S.zone] ? S.zone : ""; S.belief = byId(BEL, S.belief) ? S.belief : ""; S.ed = S.ed === "a" || S.ed === "b" ? S.ed : "";
  S.place = S.place || {}; S.msel = S.msel || ""; S.ev = Array.isArray(S.ev) ? S.ev : []; S.cb = Array.isArray(S.cb) ? S.cb : []; S.cl = S.cl || ""; S.cc = S.cc || "";
  var fx = {}, readTok = null, opening = { run:0 }, CH = C.caseChips, lastFrost = null;

  host.innerHTML = '<div class="ez">' +
    '<div id="ez-mode" class="ez-modes"></div>' +
    '<div class="ez-body"><div class="ez-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="ez-globe"><div id="ez-light" class="ez-lightrow"></div>' +
        '<div class="ez-gwrap"><div class="ez-fig" id="ez-fig">' + globeSVG({ zones:ZORDER, light:C.ghosts.light, back:C.ghosts.back, not:C.ghosts.not }) +
          '<p class="ez-capt" id="ez-capt" aria-hidden="true">' + C.opening.caption + '</p><div class="ez-zones" id="ez-zones" role="group" aria-label="Globe zones: tap one"></div></div>' +
        '<div class="ez-text" id="ez-text"></div></div>' +
        '<div class="ez-board" id="ez-b-stage"><h4 class="ez-h">' + C.boards.stage + '</h4><p class="how">' + C.boards.stageHow + '</p><div id="ez-moms" class="ez-moms" role="group" aria-label="Moments to stage"></div></div>' +
        '<div class="ez-orow"><button type="button" class="btn ghost sm" id="ez-replay">' + C.opening.replay + "</button></div></div>" +
      '<div id="ez-beliefs"><div id="ez-bcards" class="ez-bcards"></div><p class="ez-bwhat" id="ez-bwhat" aria-live="polite"></p><h4 class="ez-h">Line bank</h4><ol class="ez-bank" id="ez-bank"></ol>' +
        '<div class="ez-board" id="ez-b-ev"><h4 class="ez-h">' + C.boards.evidence + '</h4><p class="how">' + C.boards.evidenceHow + '</p><div id="ez-ev" class="ez-chiplist" role="group" aria-label="Lines: tap to choose"></div></div>' +
        '<div class="ez-board" id="ez-b-case"><h4 class="ez-h">' + C.boards.hcase + '</h4><p class="how">' + C.boards.hcaseHow + '</p><div id="ez-cb"></div><div id="ez-cl"></div><div id="ez-cc"></div><p class="ez-casesum" id="ez-casesum" aria-live="polite"></p></div></div>' +
      '<div id="ez-editions"><p class="how">' + C.editions.intro + '</p><div class="ez-eds" id="ez-eds"></div></div>' +
    '</div><div class="ez-readbox"><p class="ez-read-h">Readout</p><dl class="read" id="ez-read" aria-live="polite"></dl><p class="ez-aha">' + C.aha + "</p></div></div></div>";

  var fig = $("#ez-fig"), svg = $(".ez-svg", fig);
  var modeR = radios($("#ez-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var lightRG = radios($("#ez-light"), { label:"Daylight", options:C.daylight, value:S.light, onChange:function(v){ stopFx(); S.light = v; api.save(); paint(); } });
  function goMode(v){ if (S.mode !== v) { stopRead(); S.mode = v; } modeR.set(v); }
  var beliefRG = radios($("#ez-bcards"), { label:"Belief cards", cls:"ez-bc", options:BEL.map(function(b){ return { id:b.id, t:b.t }; }), value:S.belief, onChange:function(v){ stopFx(); S.belief = v; api.save(); paint(); MV.changed(); } });
  var clRG = radios($("#ez-cl"), { label:CH.labels.lines, cls:"chips", options:CH.lines, value:S.cl, onChange:function(v){ S.cl = v; api.save(); paintCase(); MV.changed(); } });
  var ccRG = radios($("#ez-cc"), { label:CH.labels.cons, cls:"chips", options:CH.cons, value:S.cc, onChange:function(v){ S.cc = v; api.save(); paintCase(); MV.changed(); } });

  function setMode(v){ stopFx(); stopRead(); S.mode = v; api.save(); paint(); MV.changed(); }
  function stopFx(){ fx = {}; opening.run++; MV.banner("", ""); }
  function stopRead(){ if (readTok) { readTok.stop(); readTok = null; } $$(".ez-rs.speaking", host).forEach(function(e){ e.classList.remove("speaking"); }); }

  // ----- which bank lines are lit -----
  function litLines(){
    if (S.mode === "globe") return S.zone ? Z[S.zone].lines.slice() : [];
    if (S.mode === "editions") return ["L8"];
    if (!S.belief) return [];
    var all = BANK.filter(function(b){ return has(b.beliefs, S.belief); }).map(function(b){ return b.id; });
    if (fx.p3 === 0) return [];
    if (fx.p3 === 1) return ["L3"];
    if (fx.p3 === 2) return ["L3", "L6"];
    return all;
  }

  // ----- the Globe -----
  function paintGlobe(){
    fig.classList.toggle("dark", S.light === "dark");
    fig.classList.toggle("ghosts", !!fx.p1);
    fig.classList.toggle("swear", !!fx.swear);
    fig.setAttribute("data-zone", S.zone || "");
    fig.classList.toggle("pulse-trap", fx.pulse === "trap");
    svg.setAttribute("aria-label", "Cutaway of the Globe playhouse" + (S.light === "dark" ? ", shown as a modern theatre with the lights down and one spotlight on the stage" : " at 2 p.m., open to the sky, the stage in daylight") +
      ": the yard in front, galleries on both sides, the stage with its trapdoor and the under-stage below, the tiring house behind, the upper gallery above it and the painted heavens on two pillars over the stage." + (S.zone ? " Selected: " + MV.plain(Z[S.zone].t) + "." : "") + (fx.p1 ? " Lighting rig and painted backdrop: not at the Globe." : ""));
    MV.keepFocus($("#ez-zones"), function(){
      $("#ez-zones").innerHTML = ZORDER.map(function(z, i){
        var p = ZPOS[z.id], placed = C.moments.filter(function(m){ return S.place[m.id] === z.id; }).map(function(m){ return m.id; });
        return '<button type="button" class="ez-z' + (fx.pulse === z.id ? " pulse" : "") + (S.msel ? " target" : "") + '" data-z="' + z.id + '" data-k="z' + z.id + '" aria-pressed="' + (S.zone === z.id) + '" style="left:' + p[0] + "%;top:" + p[1] + '%"' +
          ' aria-label="' + esc((i + 1) + ". " + MV.plain(z.t) + (placed.length ? ", moments placed here: " + placed.join(", ") : "")) + '"><span class="ez-zn" aria-hidden="true">' + (i + 1) + '</span><span class="ez-zt">' + z.t + "</span>" +
          (placed.length ? '<span class="ez-zm" aria-hidden="true">' + placed.join(" ") + "</span>" : "") + "</button>";
      }).join("");
    });
    paintText();
    MV.keepFocus($("#ez-moms"), function(){
      $("#ez-moms").innerHTML = C.moments.map(function(m){
        var z = S.place[m.id];
        return '<button type="button" class="ez-mom" data-m="' + m.id + '" data-k="m' + m.id + '" aria-pressed="' + (S.msel === m.id) + '"><span>' + m.t + "</span>" + (z ? '<span class="ez-mz">→ ' + Z[z].t + "</span>" : '<span class="ez-mz muted">not placed</span>') + "</button>";
      }).join("") + (Object.keys(S.place).length ? '<button type="button" class="linkbtn" data-m="clear" data-k="mclear">Clear the moments</button>' : "") +
      (S.msel ? '<p class="tiny ez-msel" role="status">Now tap a zone on the Globe for moment (' + S.msel + ").</p>" : "");
    });
  }
  function paintText(){
    var O = C.opening, frost = S.light === "day" && !fx.nofrost, el = $("#ez-text");
    if (fx.typing) return; // the storyboard is typing L1
    var zc = "";
    if (S.zone) { var z = Z[S.zone]; zc = '<div class="ez-zcard"><p class="ez-zh">' + z.t + '</p><p><strong>What it was:</strong> ' + z.what + '</p><p><strong>Where <em>Hamlet</em> uses it:</strong> ' + z.use + "</p></div>"; }
    var fresh = frost && lastFrost === false; lastFrost = frost;
    el.innerHTML = '<p class="ez-scene">' + O.scene + "</p>" + l1HTML(frost, -1, fresh) + '<p class="eng-cite">' + O.cite + '</p><p class="ez-note">' + (S.light === "day" ? O.day : O.dark) + "</p>" + zc;
  }
  // L1 pieces; n = characters to show (−1 = all)
  function l1Pieces(){
    var O = C.opening, P = [];
    O.speeches.forEach(function(sp, si){
      P.push({ who:sp.who });
      sp.l.forEach(function(l, li){
        var m = l.indexOf("’tis bitter cold,");
        if (m > 0) { P.push({ t:l.slice(0, m) }); P.push({ t:"’tis bitter cold,", frost:true }); P.push({ t:l.slice(m + 17) }); }
        else P.push({ t:l });
        if (li < sp.l.length - 1) P.push({ br:true });
      });
      if (si < O.speeches.length - 1) P.push({ end:true });
    });
    return P;
  }
  function l1HTML(frost, n, fresh){
    var P = l1Pieces(), left = n < 0 ? 1e9 : n, h = '<div class="ez-l1"><p>';
    P.forEach(function(p){
      if (p.who) { h += '<span class="ez-who">' + p.who + "</span> "; return; }
      if (p.br) { h += "<br>"; return; }
      if (p.end) { h += "</p><p>"; return; }
      var t = p.t.slice(0, Math.max(0, left)); left -= p.t.length;
      if (p.frost) h += '<span class="ez-frost' + (frost && n < 0 ? " on" + (fresh ? " fresh" : "") : "") + '">' + esc(t) + "</span>" + (frost && n < 0 ? '<span class="an-tag ez-cold">' + C.opening.cold + "</span>" : "");
      else h += esc(t);
    });
    return h + "</p></div>";
  }
  function l1Len(){ return l1Pieces().reduce(function(s, p){ return s + (p.t ? p.t.length : 0); }, 0); }

  // the opening storyboard (4 s): sun, caption, L1 types across, frost; final frame + banner with reduced motion
  function runOpening(){
    var me = ++opening.run, O = C.opening;
    stopRead();
    goMode("globe");
    if (S.light !== "day") { S.light = "day"; lightRG.set("day"); }
    fx = {}; S.zone = ""; api.save(); paint();
    var cap = $("#ez-capt");
    if (MV.reduceMotion) { cap.classList.add("on"); MV.banner("", O.banner); return; }
    MV.banner("", ""); cap.classList.remove("on");
    fx.typing = true; var el = $("#ez-text"), total = l1Len();
    el.innerHTML = '<p class="ez-scene">' + O.scene + "</p>" + l1HTML(false, 0);
    function at(ms, fn){ setTimeout(function(){ if (me === opening.run) fn(); }, ms); }
    at(500, function(){ cap.classList.add("on"); });
    var t0 = 900, per = 1700 / total;
    for (var c = 4; c <= total + 4; c += 4) (function(c){ at(t0 + c * per, function(){ el.innerHTML = '<p class="ez-scene">' + O.scene + "</p>" + l1HTML(false, c); }); })(c);
    at(t0 + 1800, function(){ fx.typing = false; lastFrost = false; paintText(); });
    at(3600, function(){ MV.banner("", O.banner); });
  }

  // ----- beliefs and the line bank -----
  function bankHTML(lit, full){
    return BANK.map(function(b){
      var on = has(lit, b.id), tags = '<span class="ez-tags">' + (on ? '<span class="an-tag an-theme">Theme · ' + b.tags + "</span>" : '<span class="tiny muted">' + b.tags + "</span>") + "</span>";
      return '<li class="ez-bl' + (on ? " on" : "") + '"><span class="ez-bid">' + b.id + '</span><span class="ez-btext">' + (on ? '<mark class="an an-theme">' + b.text + "</mark>" : b.text) + ' <span class="ez-bref">(' + b.ref + ")</span>" + (full ? ' <span class="tiny muted">Scene ' + b.scene + "</span>" : "") + "</span>" + tags + "</li>";
    }).join("");
  }
  function paintBeliefs(){
    var b = byId(BEL, S.belief);
    $("#ez-bwhat").innerHTML = b ? "<strong>" + b.t + ":</strong> " + b.what : '<span class="muted">Tap a belief card to light its lines.</span>';
    $("#ez-bank").innerHTML = bankHTML(litLines());
    MV.keepFocus($("#ez-ev"), function(){
      $("#ez-ev").innerHTML = C.evidence.map(function(e){ var on = has(S.ev, e.id); return '<button type="button" class="ez-tog" data-ev="' + e.id + '" data-k="ev' + e.id + '" aria-pressed="' + on + '"><span class="ez-box" aria-hidden="true">' + (on ? "☑" : "☐") + "</span>" + e.t + "</button>"; }).join("");
    });
    paintCase();
  }
  function paintCase(){
    var host2 = $("#ez-cb");
    MV.keepFocus(host2, function(){
      host2.innerHTML = '<span class="rg-wrap"><span class="rg-lab">' + CH.labels.beliefs + '</span><span class="ez-chiplist" role="group" aria-label="Beliefs: choose one or more">' + CH.beliefs.map(function(c){ var on = has(S.cb, c.id); return '<button type="button" class="ez-tog" data-cbk="' + c.id + '" data-k="cb' + c.id + '" aria-pressed="' + on + '"><span class="ez-box" aria-hidden="true">' + (on ? "☑" : "☐") + "</span>" + c.t + "</button>"; }).join("") + "</span></span>";
    });
    var bl = CH.beliefs.filter(function(c){ return has(S.cb, c.id); }).map(function(c){ return c.t; }), ln = byId(CH.lines, S.cl), cn = byId(CH.cons, S.cc);
    $("#ez-casesum").innerHTML = (bl.length || ln || cn) ? "<strong>Hamlet’s case:</strong> " + (bl.length ? bl.join(" + ") : "[belief]") + " → " + (ln ? ln.t : "[line]") + " → " + (cn ? cn.t : "[consequence]") : "";
  }

  // ----- two editions -----
  function paintEditions(){
    var E = C.editions, k = 0;
    MV.keepFocus($("#ez-eds"), function(){
      $("#ez-eds").innerHTML = ["a", "b"].map(function(id){
        var ed = E[id], on = S.ed === id, br = on || fx.p4;
        var body = ed.segs.map(function(sg){
          var ch = chunksOf(sg[0]).map(function(c){ return '<span class="ez-rs" data-rs="' + id + (k++) + '">' + esc(c) + "</span>"; }).join("");
          return sg[1] ? '<span class="ez-grp' + (br ? " on" : "") + '">' + ch + (br ? '<span class="ez-glab">' + esc(sg[1]) + "</span>" : "") + "</span>" : ch;
        }).join("");
        k = 0;
        return '<div class="ez-ed' + (on ? " on" : "") + '"><div class="ez-edh"><strong>' + ed.t + '</strong><button type="button" class="btn sm' + (on ? " primary" : " ghost") + '" data-ed="' + id + '" data-k="ed' + id + '" aria-pressed="' + on + '">' + (VOICE ? E.listen + ": " + ed.t : E.choose + " " + ed.t) + '</button></div><p class="ez-edtext">' + body + "</p>" +
          (VOICE ? "" : '<p class="tiny muted">' + E.noVoice + "</p>") + "</div>";
      }).join("");
    });
  }
  function readEdition(id){
    stopRead();
    var segs = C.editions[id].segs.map(function(s){ return s[0]; }).join(""), chunks = chunksOf(segs).map(function(c){ return c.trim(); }).filter(Boolean);
    readTok = readChunks(chunks, function(k){ $$(".ez-rs", $("#ez-eds")).forEach(function(e){ e.classList.toggle("speaking", e.dataset.rs === id + k); }); }, function(){ readTok = null; });
  }

  // ----- readout -----
  function paintRead(){
    var RO = C.readout, rows = [], lit = litLines();
    if (S.mode === "globe") {
      var z = Z[S.zone];
      rows.push([RO.zone, z ? (z.short || z.t) : '<span class="muted">Tap a zone</span>']);
      rows.push([RO.used, z ? z.used : "—"]);
    } else if (S.mode === "beliefs") {
      var b = byId(BEL, S.belief), sc = [];
      lit.forEach(function(id){ var s = BK[id].scene; if (!has(sc, s)) sc.push(s); });
      sc.sort(function(x, y){ var a = x.split("."), b = y.split("."); return (+a[0] - +b[0]) || (+a[1] - +b[1]); });
      rows.push([RO.belief, b ? b.t : '<span class="muted">Tap a belief card</span>']);
      rows.push([RO.used, sc.length ? sc.join(", ") : "—"]);
    } else rows.push([RO.used, C.editions.used]);
    rows.push([RO.lit, lit.length + " of " + BANK.length + (lit.length ? " (" + lit.join(", ") + ")" : "")]);
    if (S.mode === "beliefs") { var b2 = byId(BEL, S.belief); rows.push([RO.hear, b2 ? b2.hear : "—"]); }
    if (S.mode === "editions") rows.push([RO.change, S.ed ? C.editions[S.ed].change : '<span class="muted">Choose an edition</span>']);
    $("#ez-read").innerHTML = MV.readoutHTML(rows);
  }

  function paint(){
    ["globe", "beliefs", "editions"].forEach(function(m){ $("#ez-" + m).hidden = S.mode !== m; });
    if (S.mode === "globe") paintGlobe();
    if (S.mode === "beliefs") paintBeliefs();
    if (S.mode === "editions") paintEditions();
    paintRead();
  }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.z) {
      var z = b.dataset.z; stopFx();
      if (S.msel) { S.place[S.msel] = z; S.msel = ""; S.zone = z; }
      else S.zone = S.zone === z ? "" : z;
      api.save(); paint(); MV.changed(); return;
    }
    if (b.dataset.m) {
      if (b.dataset.m === "clear") { S.place = {}; S.msel = ""; }
      else S.msel = S.msel === b.dataset.m ? "" : b.dataset.m;
      api.save(); paint(); MV.changed();
      if (b.dataset.m === "clear") { var f = $("#ez-moms .ez-mom"); if (f) f.focus(); }
      return;
    }
    if (b.dataset.ev) { var i = S.ev.indexOf(b.dataset.ev); if (i >= 0) S.ev.splice(i, 1); else S.ev.push(b.dataset.ev); api.save(); paintBeliefs(); paintRead(); MV.changed(); return; }
    if (b.dataset.cbk) { var j = S.cb.indexOf(b.dataset.cbk); if (j >= 0) S.cb.splice(j, 1); else S.cb.push(b.dataset.cbk); api.save(); paintCase(); MV.changed(); return; }
    if (b.dataset.ed) { var id = b.dataset.ed; fx = {}; S.ed = id; api.save(); paintEditions(); paintRead(); if (VOICE) readEdition(id); return; }
    if (b.id === "ez-replay") { runOpening(); return; }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".ez-setup"); if (!b) return;
    var id = b.dataset.setup, mode = id === "tc1" ? "globe" : "beliefs", target = id === "tc1" ? "#ez-b-stage" : id === "tc2" ? "#ez-b-ev" : "#ez-b-case";
    if (S.mode !== mode) { goMode(mode); stopFx(); api.save(); paint(); MV.changed(); }
    var t = $(target); if (t) t.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  // ----- full line bank (Explore sheet below) -----
  var full = $("#ez-bankfull"); if (full) full.innerHTML = '<ol class="ez-bank ez-bankfull">' + bankHTML([], true) + "</ol>";

  paint();
  voiceReady(function(){ if (S.mode === "editions") paintEditions(); });

  EX = {
    shown:function(){ if (!S.seenOpen) { S.seenOpen = true; api.save(); runOpening(); } },
    stop:function(){ stopRead(); if (fx.typing) { opening.run++; fx.typing = false; paintText(); } },
    predict:{
      start:function(p){
        stopRead(); opening.run++; var st = p.start || {};
        goMode(st.mode || "globe");
        fx = {};
        if (p.id === "p1") { S.light = "day"; lightRG.set("day"); S.zone = ""; fx.nofrost = true; }
        if (p.id === "p2") { S.zone = ""; S.msel = ""; fx.pulse = "trap"; }
        if (p.id === "p3") { S.belief = "ghosts"; beliefRG.set("ghosts"); fx.p3 = 0; }
        if (p.id === "p4") { S.ed = ""; }
        api.save(); paint();
      },
      run:function(p, done){
        if (p.id === "p1") {
          MV.wait(300, function(){ fx.nofrost = false; fx.p1 = true; lastFrost = false; paint(); MV.wait(1300, done); });
        } else if (p.id === "p2") {
          MV.wait(200, function(){ fx.swear = true; paint(); if (VOICE) MV.eng.say("Swear!", { voice:VOICE, rate:0.7 }); MV.wait(1700, function(){ fx.pulse = ""; S.zone = "trap"; api.save(); paint(); done(); }); });
        } else if (p.id === "p3") {
          MV.wait(300, function(){ fx.p3 = 1; paint(); MV.wait(900, function(){ fx.p3 = 2; paint(); MV.wait(900, function(){ fx.p3 = null; paint(); done(); }); }); });
        } else if (p.id === "p4") {
          MV.wait(300, function(){
            fx.p4 = true; paint();
            if (VOICE) { var a = "in action how like an angel! in apprehension how like a god!", b = "in action, how like an angel in apprehension, how like a god!"; stopRead(); readTok = readChunks(chunksOf(a).concat(chunksOf(b)).map(function(c){ return c.trim(); }), null, function(){ readTok = null; }); }
            MV.wait(1900, done);
          });
        } else done();
      }
    },
    challenge:function(id, opt){
      var CL = C.challenges, c = byId(CL, id);
      if (id === "tc1") {
        var A = MV.ans(c), P = S.place;
        if (!C.moments.every(function(m){ return !!P[m.id]; })) return { ok:false, msg:c.msgs.place };
        var good = C.moments.every(function(m){ return has(A[m.id], P[m.id]); });
        if (good) return { ok:true };
        if (P.c === "tiring") return { ok:false, msg:c.msgs.c_tiring };
        if (P.e === "galleries") return { ok:false, msg:c.msgs.e_galleries };
        if (P.b === "trap") return { ok:false, msg:c.msgs.b_trap };
        return { ok:false, msg:c.general };
      }
      if (id === "tc2") {
        var right = C.evidence.filter(function(e){ return MV.ok(e); }).map(function(e){ return e.id; });
        var exact = S.ev.length === right.length && right.every(function(r){ return has(S.ev, r); });
        if (exact) return { ok:true };
        if (has(S.ev, "L6")) return { ok:false, msg:c.msgs.L6 };
        if (has(S.ev, "rem")) return { ok:false, msg:c.msgs.rem };
        return { ok:false, msg:c.general };
      }
      if (id === "tc3") {
        if (!S.cb.length || !S.cl || !S.cc) return { ok:false, msg:c.msgs.choose };
        var okB = CH.beliefs.filter(function(x){ return MV.ok(x); }).map(function(x){ return x.id; });
        var chosenOk = S.cb.filter(function(x){ return has(okB, x); }), chosenBad = S.cb.filter(function(x){ return !has(okB, x); });
        var lineOk = MV.ok(byId(CH.lines, S.cl)), consOk = MV.ok(byId(CH.cons, S.cc));
        if (chosenOk.length === okB.length && !chosenBad.length && lineOk && consOk) {
          if (!opt || !opt.live) MV.banner("good", c.banner);
          return { ok:true };
        }
        if (chosenOk.length === 1 && !chosenBad.length) return { ok:false, msg:c.msgs.oneBelief };
        if (S.cl === "L2") return { ok:false, msg:c.msgs.L2 };
        if (S.cc === "pol") return { ok:false, msg:c.msgs.pol };
        return { ok:false, msg:c.general };
      }
      return { ok:false };
    }
  };
  return EX;
}

// ---------- Part 3: Then and now (paired lens cards + a sentence builder) ----------
function part3(host, api){
  var C = api.content, S = api.S, M = C.moments, L = C.lens, B = C.builder;
  S.mom = byId(M, S.mom) ? S.mom : M[0].id; S.zoom = S.zoom || {}; S.sb = S.sb || {};
  host.innerHTML = '<div class="ez-p3"><div id="ez-p3mom"></div><div class="ez-lens" id="ez-lens" aria-live="polite"></div>' +
    '<div class="ez-builder"><h4 class="ez-h">' + B.title + '</h4><p class="how">' + B.how + '</p>' +
      '<div id="ez-sb-then"></div><div id="ez-sb-mom"></div><div id="ez-sb-now"></div>' +
      '<div class="jq"><label for="ez-sb-end">' + B.endLabel + '</label><input id="ez-sb-end" class="txtin" type="text" autocomplete="off" placeholder="' + esc(MV.plain(B.endPh)) + '"><p class="tiny muted" id="ez-sb-n" aria-live="polite"></p></div>' +
      '<div class="ez-sbout" id="ez-sb-out" aria-live="polite"></div></div></div>';
  radios($("#ez-p3mom"), { label:"Moment", cls:"chips", options:M.map(function(m){ return { id:m.id, t:m.t + " (" + m.scene + ")" }; }), value:S.mom, onChange:function(v){ S.mom = v; api.save(); paintLens(); } });
  function opts(list){ return list.map(function(t, i){ return { id:String(i), t:t }; }); }
  radios($("#ez-sb-then"), { label:"Then card", cls:"chips", options:opts(B.thenChips), value:S.sb.then, onChange:function(v){ S.sb.then = v; api.save(); paintOut(); } });
  radios($("#ez-sb-mom"), { label:"Moment", cls:"chips", options:opts(B.momChips), value:S.sb.mom, onChange:function(v){ S.sb.mom = v; api.save(); paintOut(); } });
  radios($("#ez-sb-now"), { label:"Now card", cls:"chips", options:opts(B.nowChips), value:S.sb.now, onChange:function(v){ S.sb.now = v; api.save(); paintOut(); } });
  var end = $("#ez-sb-end"); end.value = S.sb.end || "";
  end.addEventListener("input", function(){ S.sb.end = end.value; api.save(); paintOut(); });

  function card(m, kind){
    var q = m[kind + "Q"], z = !!S.zoom[m.id + kind];
    return '<article class="ez-card ez-' + kind + '"><p class="ez-lab"><span class="ez-lensmark" aria-hidden="true">' + (kind === "then" ? "◐" : "◑") + "</span>" + L[kind] + ' <span class="muted">· ' + L[kind + "Sub"] + "</span></p>" +
      '<p class="ez-ctext">' + m[kind] + '</p><button type="button" class="linkbtn" data-zoom="' + m.id + kind + '" data-k="zm' + m.id + kind + '" aria-expanded="' + z + '">' + (z ? L.unzoom : L.zoom) + "</button>" +
      (z ? '<blockquote class="ez-zq"><p>' + esc(q.who) + ": “" + q.q + "”</p><p class=\"eng-cite\">(<i>Hamlet</i> " + q.ref + ")</p></blockquote>" : "") + "</article>";
  }
  function paintLens(){
    var m = byId(M, S.mom);
    MV.keepFocus($("#ez-lens"), function(){ $("#ez-lens").innerHTML = '<p class="ez-mt"><strong>' + m.t + "</strong> (" + m.scene + ")</p>" + '<div class="ez-cards">' + card(m, "then") + card(m, "now") + "</div>"; });
  }
  function paintOut(){
    var sb = S.sb, F = B.frame, n = wc(sb.end), endOk = n >= 8 && n <= 25;
    function slot(v, list, name){ return v != null && v !== "" && list[+v] ? '<span class="ez-slot on">' + list[+v] + "</span>" : '<span class="ez-slot">[' + name + "]</span>"; }
    var endTxt = (sb.end || "").trim().replace(/[.!?]+$/, "");
    var sent = F[0] + slot(sb.then, B.thenChips, B.slots.then) + F[1] + slot(sb.mom, B.momChips, B.slots.mom) + F[2] + slot(sb.now, B.nowChips, B.slots.now) + F[3] + (endTxt ? '<span class="ez-slot on">' + esc(endTxt) + "</span>." : '<span class="ez-slot">[' + B.slots.end + "]</span>");
    var all = sb.then != null && sb.then !== "" && sb.mom != null && sb.mom !== "" && sb.now != null && sb.now !== "";
    var same = all && sb.then === sb.mom && sb.mom === sb.now;
    $("#ez-sb-n").textContent = n + " word" + (n === 1 ? "" : "s") + (endOk ? " ✓" : " (aim for 8–25)");
    $("#ez-sb-out").innerHTML = '<p class="ez-sent">' + sent + "</p>" + (all ? '<p class="tiny">' + (same ? B.same : B.mixed) + "</p>" : "") + (all && endOk ? '<p class="tiny">' + B.done + "</p>" : "");
  }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-zoom]"); if (!b) return; S.zoom[b.dataset.zoom] = !S.zoom[b.dataset.zoom]; api.save(); paintLens(); });
  paintLens(); paintOut();

  // Sentence to steal: "Save it to my Art of Language notebook" (as a commonplace entry: the master's line and the imitation)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#ez-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="ez-steal-save">' + ST.save + '</button><span class="tiny muted" id="ez-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "ez-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#ez-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#ez-steal-st").textContent = "Saved your imitation to your Art of Language notebook (commonplace book).";
    });
  }
  return {};
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 06; numbered sentences) ----------
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

// ---------- @component E17 draftWorkspace (copied from ENG4U 06) — a writing area with a live word count (target range),
// saved drafts (up to 3) and a side-by-side compare with the changes marked (course plan E17) ----------
// draftWorkspace(host, {id, label, min, max, get(), set(v), drafts() -> [{n, t}], onChange()}) -> {refresh(), ta}
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
  host.innerHTML = '<div class="ez-dw"><label for="dw-' + o.id + '" class="ez-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="ez-dw-ta" rows="10"></textarea>' +
    '<div class="q-actions"><span class="ez-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var D = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = D.length ? '<p class="tiny ez-dw-l">Saved drafts: ' + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && D[cmp]) { var df = diffWords(D[cmp].t, ta.value); cb.innerHTML = '<div class="ez-dw-cmp"><div><p class="tiny"><strong>Draft ' + D[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
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

// ---------- program-note checks (structure only) ----------
function sentences(t){
  var s = String(t || "").replace(/\s+/g, " ").trim(); if (!s) return [];
  var out = [], re = /[.!?]+[”’"')\]]*\s+(?=[“"‘']?[A-Z])/g, last = 0, m;
  while ((m = re.exec(s))) { var end = m.index + m[0].length; out.push(s.slice(last, end).trim()); last = end; }
  if (last < s.length) out.push(s.slice(last).trim());
  return out.filter(Boolean);
}
function skey(s){ return MV.eng.norm(s); }
function quotes(t){
  var s = String(t || ""), out = [], m, res = [/“([^”]+)”/g, /"([^"]+)"/g, /‘([^’]+?)’(?![A-Za-z])/g, /(?:^|[\s(\[—–-])'([^']+?)'(?=[\s.,;:!?)\]—–-]|$)/g];
  res.forEach(function(re){ while ((m = re.exec(s))) out.push(m[1]); });
  return out;
}
function quoteFromScene(t, scene, bank){
  if (!scene) return false;
  var lines = bank.filter(function(b){ return b.scene === scene; }).map(function(b){ return " " + MV.eng.norm(MV.plain(b.text)) + " "; });
  return quotes(t).some(function(q){ var n = MV.eng.norm(q); return n.split(" ").length >= 3 && lines.some(function(l){ return l.indexOf(" " + n + " ") >= 0; }); });
}
function citeFor(t, scene){
  if (!scene) return false;
  var re = /\(\s*[*_]?Hamlet[*_]?\s+(\d+)\.(\d+)\.(\d+)(?:\s*[–—-]\s*\d+)?\s*\)/g, m, sc = scene.split(".");
  while ((m = re.exec(String(t || "")))) if (m[1] === sc[0] && m[2] === sc[1]) return true;
  return false;
}

// ---------- Performance task: Program note ----------
var task = (function(){
  var api = null, T = null, BANK = null, dw = null, rgB = null, rgS = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; var text = String(S.text || ""), ss = sentences(text), keys = ss.map(skey);
    var thenI = S.tThen ? keys.indexOf(S.tThen) : -1, nowI = S.tNow ? keys.indexOf(S.tNow) : -1;
    return { belief:S.belief || "", scene:S.scene || "", text:text, n:wc(text), sents:ss, keys:keys, thenI:thenI, nowI:nowI,
      longest:ss.reduce(function(mx, x){ return Math.max(mx, wc(x)); }, 0), explain:explain() };
  }
  function checks(d){
    return [!!d.belief, !!d.scene, quoteFromScene(d.text, d.scene, BANK || MV.C.explore.bank), citeFor(d.text, d.scene),
      d.thenI >= 0 && d.nowI >= 0 && d.thenI !== d.nowI, d.n >= T.min && d.n <= T.max, d.n > 0 && d.longest <= T.maxSentence];
  }
  function paintIns(){
    var S = api.S, host = $("#pn-ins"), lab = T.labels;
    var lines = BANK.filter(function(b){ return b.scene === S.scene; });
    host.innerHTML = '<p class="ez-lab">' + lab.ins + '</p><p class="tiny muted">' + (S.scene ? lab.insHow : lab.insNone) + "</p>" + (lines.length ? '<div class="ez-inslist">' + lines.map(function(b){
      var parts = b.ins || [{ t:MV.plain(b.text).replace(/^“|”$/g, ""), ref:b.ref }];
      return parts.map(function(p, k){ return '<button type="button" class="ez-insb" data-ins="' + b.id + ":" + k + '"><span class="ez-bid">' + b.id + "</span> “" + esc(p.t) + "” <span class=\"ez-bref\">(" + p.ref + ")</span></button>"; }).join("");
    }).join("") + "</div>" : "");
  }
  function insertAt(txt){
    var ta = dw.ta, s = ta.selectionStart != null ? ta.selectionStart : ta.value.length, e2 = ta.selectionEnd != null ? ta.selectionEnd : s, v = ta.value;
    var pre = v.slice(0, s), post = v.slice(e2), lead = pre && !/\s$/.test(pre) ? " " : "";
    ta.value = pre + lead + txt + post; var pos = (pre + lead + txt).length;
    try { ta.focus(); ta.setSelectionRange(pos, pos); } catch (err) {}
    dw.changed();
  }
  function paintTags(){
    var S = api.S, d = data(S), lab = T.labels, host = $("#pn-tags");
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="ez-lab">' + lab.tag + '</p><p class="tiny muted">' + lab.tagHow + "</p>" + (d.sents.length ? '<ol class="ez-tagl">' + d.sents.map(function(s, i){
        var n = wc(s), isT = i === d.thenI, isN = i === d.nowI;
        return '<li class="' + (isT ? "t" : isN ? "n" : "") + '"><span class="ez-tagtext">' + esc(s) + ' <span class="tiny ' + (n > T.maxSentence ? "ez-long" : "muted") + '">(' + n + " words" + (n > T.maxSentence ? ", " + lab.long : "") + ')</span></span><span class="ez-tagbtns">' +
          '<button type="button" class="ez-tagb" data-tag="then" data-si="' + i + '" data-k="tt' + i + '" aria-pressed="' + isT + '">' + lab.then + "</button>" +
          '<button type="button" class="ez-tagb" data-tag="now" data-si="' + i + '" data-k="tn' + i + '" aria-pressed="' + isN + '">' + lab.now + "</button></span></li>";
      }).join("") + "</ol>" : '<p class="tiny muted">' + lab.noSent + "</p>");
    });
  }
  function modelHTML(md){
    return '<div class="ez-model"><h5>' + md.title + "</h5><p>" + md.s.map(function(x){ return x[0] + (x[1] ? ' <span class="ez-mtag ez-mtag-' + x[1] + '">[' + x[1] + "]</span>" : ""); }).join(" ") + "</p></div>";
  }
  function paintPv(){
    var S = api.S, d = data(S), el = $("#pn-pv"); if (!el) return;
    el.innerHTML = '<h4 class="ez-h" style="margin-top:0">Your note at a glance</h4><ul class="ez-glance"><li><strong>Belief:</strong> ' + (d.belief ? esc(d.belief) : '<span class="muted">not chosen</span>') + "</li><li><strong>Scene:</strong> " + (d.scene || '<span class="muted">not chosen</span>') + "</li>" +
      "<li><strong>Words:</strong> " + d.n + " (aim for " + T.min + "–" + T.max + ")</li><li><strong>Sentences:</strong> " + d.sents.length + (d.sents.length ? " · longest " + d.longest + " words" : "") + "</li>" +
      "<li><strong>Then:</strong> " + (d.thenI >= 0 ? esc(d.sents[d.thenI]) : '<span class="muted">not tagged</span>') + "</li><li><strong>Now:</strong> " + (d.nowI >= 0 ? esc(d.sents[d.nowI]) : '<span class="muted">not tagged</span>') + "</li></ul>";
    var ok = checks(d).every(Boolean);
    $("#pn-models").innerHTML = ok ? '<details class="alg"><summary>' + T.modelsLabel + '</summary><p class="tiny muted">' + T.modelsNote + "</p>" + T.models.map(modelHTML).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintTags(); paintPv(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; BANK = MV.C.explore.bank; var S = a.S, lab = T.labels;
      inp.innerHTML = '<div class="ez-pn"><div id="pn-belief" class="ez-ctrow"></div><div id="pn-scene" class="ez-ctrow"></div><div id="pn-ins" class="ez-ins"></div><div id="pn-draft"></div><div id="pn-tags" class="ez-tags-host"></div></div>';
      pv.innerHTML = '<div id="pn-pv" aria-live="polite"></div><div id="pn-models"></div>';
      rgB = radios($("#pn-belief"), { label:lab.belief, cls:"chips", options:T.beliefs.map(function(b){ return { id:b, t:b }; }), value:S.belief || "", onChange:function(v){ S.belief = v; changed(); } });
      rgS = radios($("#pn-scene"), { label:lab.scene, cls:"chips", options:T.scenes.map(function(s){ return { id:s, t:s }; }), value:S.scene || "", onChange:function(v){ S.scene = v; paintIns(); changed(); } });
      S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      dw = draftWorkspace($("#pn-draft"), { id:"note", label:lab.draft + " (" + T.min + "–" + T.max + " words)", min:T.min, max:T.max, get:function(){ return S.text; }, set:function(v){ S.text = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      paintIns();
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !inp.contains(b)) return;
        if (b.dataset.ins) {
          var p = b.dataset.ins.split(":"), bk = byId(BANK, p[0]), parts = bk.ins || [{ t:MV.plain(bk.text).replace(/^“|”$/g, ""), ref:bk.ref }], part = parts[+p[1]];
          var q = part.t.replace(/[.,;:]+$/, "");
          insertAt("“" + q + "” (Hamlet " + part.ref + ")");
          return;
        }
        if (b.dataset.tag) {
          var d = data(S), k = d.keys[+b.dataset.si];
          if (b.dataset.tag === "then") { S.tThen = S.tThen === k ? "" : k; if (S.tNow === k) S.tNow = ""; }
          else { S.tNow = S.tNow === k ? "" : k; if (S.tThen === k) S.tThen = ""; }
          changed();
        }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      $("#task-check").addEventListener("click", function(){ setTimeout(paintPv, 0); });
      paintTags(); paintPv();
      extras();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text.trim() ? true : "Write your program note first."; },
    checks:checks,
    key:function(d){ return d.belief + " · " + d.scene; }, label:function(k){ return esc(k); }, text:function(k){ return k; },
    summary:function(ts){
      if (!T) { T = MV.C.task; BANK = MV.C.explore.bank; }
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.filter(Boolean).length, L = [];
      L.push((T.summary || "Program note") + ": " + (met === r.length ? "complete (" + d.belief + ", " + d.scene + ", " + d.n + " words)" : "not complete (checklist " + met + "/" + r.length + ")"));
      L.push("  Belief: " + (d.belief || "(not chosen)"));
      L.push("  Scene: " + (d.scene || "(not chosen)"));
      L.push("  Then sentence: " + (d.thenI >= 0 ? d.sents[d.thenI] : "(not tagged)"));
      L.push("  Now sentence: " + (d.nowI >= 0 ? d.sents[d.nowI] : "(not tagged)"));
      L.push("  Full text (" + d.n + " words):");
      L.push("    " + (d.text.trim() || "(not written yet)"));
      if ((ts.found || []).length) L.push("  Complete notes: " + ts.found.join("; "));
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
  if (sheet && art && R.art.intro && !$("#ez-artintro")) { var p = document.createElement("p"); p.id = "ez-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#ez-artn")) {
    var n = document.createElement("p"); n.id = "ez-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
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
  activities:{ spot:spotProse },
  task:task,
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX) { if (v === "explore") EX.shown(); else EX.stop(); }
    if (v === "reflect") extras();
  }
});
})();
