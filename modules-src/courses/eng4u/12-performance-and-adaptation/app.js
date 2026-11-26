// ENG4U 12 Performance & Adaptation: hero (one line, three performances as waveform strips), Stage simulator (Explore:
// E10 top-down stage with E15 read-aloud at the chosen pace, volume and stress), Adaptation (Part 3: fidelity spectrum,
// setting ↔ argument board, cut or keep), Read it three ways (N6 matching with read-aloud), Spot the Error (K13 prose)
// and the "Director's promptbook" task (E10 stage preview + E17 draft workspace). Texts and data: content.mjs (Globe Hamlet).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function HC(ref){ return "(<i>Hamlet</i> " + ref + ")"; }
var RANK = { weak:0, possible:1, strong:2 }, LEVELS = ["weak", "possible", "strong"];

// ---------- @component radioGroup (copied from ENG4U 08; no option needs to be checked) ----------
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

// ---------- @component E15 readAloud — local voice only; a line spoken as parts with their own rate, volume and pitch
// (a stressed word slower and louder), silent gaps for pauses (‖); typographic fallback (bold = stress, ‖ = pause) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; document.documentElement.classList.toggle("pa-novoice", !v); var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
var SPK = { run:0 };
function spkStop(){ SPK.run++; MV.eng.stop(); }
// parts: [{t, rate, volume, pitch} | {gap:ms}]; o: {onPart(i), onDone()}. Never called without a tap.
function speakParts(parts, o){
  o = o || {}; spkStop(); var me = SPK.run, i = 0;
  function alive(){ return me === SPK.run; }
  function next(){
    if (!alive()) return;
    if (i >= parts.length) { if (o.onDone) o.onDone(); return; }
    var p = parts[i++]; if (o.onPart) o.onPart(i - 1);
    if (p.gap || !VOICE || !window.speechSynthesis) { setTimeout(next, p.gap || 300); return; }
    var u = new SpeechSynthesisUtterance(p.t), fin = false, guard = null;
    u.voice = VOICE; u.lang = VOICE.lang; u.rate = p.rate || 1; u.volume = p.volume == null ? 1 : p.volume; u.pitch = p.pitch || 1;
    function end(){ if (fin) return; fin = true; clearTimeout(guard); if (alive()) setTimeout(next, 40); }
    u.onend = end; u.onerror = end;
    guard = setTimeout(end, 2500 + wc(p.t) * 900 / (p.rate || 1));
    try { window.speechSynthesis.speak(u); } catch (e) { end(); }
  }
  setTimeout(next, 60);
}
function findWord(t, w){ var m = new RegExp("(^|[^A-Za-z’'])(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![A-Za-z’'])", "i").exec(t); return m ? m.index + m[1].length : -1; }
function rateOf(d){ return d.pace === "slow" ? 0.75 : d.pace === "urgent" ? 1.3 : 1; }
// d: {pace, vol, stress (a word), pauseB, pauseA, gap (ms for pauseB)}
function deliveryParts(text, d){
  d = d || {};
  var rate = rateOf(d), vol = d.vol === "whisper" ? 0.35 : d.vol === "shout" ? 1 : 0.85, pitch = d.vol === "shout" ? 1.15 : d.vol === "whisper" ? 0.9 : 1;
  var t = MV.plain(text).replace(/\s*\/\s*/g, " "), parts = [], k = d.stress ? findWord(t, d.stress) : -1;
  if (d.pauseB) parts.push({ gap:d.gap || 400 });
  if (k >= 0) {
    var e = k + d.stress.length, pre = t.slice(0, k).trim(), post = t.slice(e).trim();
    if (pre) parts.push({ t:pre, rate:rate, volume:vol, pitch:pitch });
    parts.push({ t:t.slice(k, e), rate:rate * 0.72, volume:Math.min(1, vol + 0.35), pitch:pitch * 1.08 });
    if (post) parts.push({ t:post, rate:rate, volume:vol, pitch:pitch });
  } else parts.push({ t:t, rate:rate, volume:vol, pitch:pitch });
  if (d.pauseA) parts.push({ gap:400 });
  return parts;
}
function deliveryHTML(text, d){
  d = d || {}; var k = d.stress ? findWord(text, d.stress) : -1, t = esc(text);
  if (k >= 0) t = esc(text.slice(0, k)) + '<strong class="pa-stress">' + esc(text.slice(k, k + d.stress.length)) + "</strong>" + esc(text.slice(k + d.stress.length));
  var pz = '<span class="pa-pause" role="img" aria-label="pause">‖</span>';
  return (d.pauseB ? pz + " " : "") + t + (d.pauseA ? " " + pz : "");
}
// a few words of how it’s said, for screen readers and the caption
function deliveryWords(d){
  var w = [];
  if (d.vol) w.push(d.vol === "whisper" ? "whispered" : "shouted");
  if (d.pace) w.push(d.pace === "slow" ? "slowly" : "urgently");
  if (d.stress) w.push("stress on “" + d.stress + "”");
  if (d.pauseB) w.push(d.gap ? "after a pause" : "with a hesitation");
  return w.join(", ");
}

// ---------- hero: one line, three performances ----------
var HR = { run:0 };
function waveSVG(kind){
  var n = kind === "light" ? 44 : kind === "heavy" ? 16 : 34, w = 300 / n, seed = kind === "light" ? 7 : 3, h = [];
  function rnd(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var i = 0; i < n; i++) {
    var y = kind === "light" ? 5 + rnd() * 15 : kind === "heavy" ? 16 + Math.sin((i + 0.5) / n * Math.PI) * 16 + rnd() * 4 : 5;
    h.push('<rect x="' + (i * w + w * 0.18).toFixed(1) + '" y="' + (20 - y / 2).toFixed(1) + '" width="' + (w * 0.64).toFixed(1) + '" height="' + y.toFixed(1) + '" rx="1" style="--d:' + (i / n).toFixed(3) + '"/>');
  }
  return '<svg class="pa-wave" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + h.join("") + "</svg>";
}
function hero(){
  var H = MV.C.hero, host = $("#pa-hero"); if (!host) return;
  var words = H.line.split(/\s+/), bw = H.bounce.split(" ");
  host.innerHTML = '<p class="pa-hl">' + words.map(function(w){ return "<span>" + esc(w) + "</span>"; }).join(" ") + '</p><p class="eng-cite">' + H.cite + "</p>" +
    '<div class="pa-strips">' + H.ways.map(function(w){
      return '<div class="pa-strip pa-w-' + w.id + '" data-way="' + w.id + '"><div class="pa-shead"><span class="pa-sname">' + w.t + '</span><button type="button" class="btn ghost sm pa-splay" data-way="' + w.id + '" hidden aria-label="' + esc(H.play + ": " + w.t) + '">▶ ' + H.play + "</button></div>" + waveSVG(w.id) +
        '<p class="pa-sw" aria-hidden="true">…' + bw.map(function(x, i){ return '<span class="pa-bw" style="--i:' + i + '">' + esc(x) + "</span>"; }).join(" ") + "</p></div>";
    }).join("") + "</div>" +
    '<p class="pa-hcap">' + H.caption + '</p><div class="pa-hctl"><button type="button" class="btn ghost sm" id="pa-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="pa-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="pa-hnote" hidden>' + H.noVoice + "</span></div>";
  var strips = $$(".pa-strip", host);
  function on(id){ strips.forEach(function(s){ if (s.dataset.way === id) { s.classList.remove("on"); void s.offsetWidth; s.classList.add("on", "seen"); } else s.classList.remove("on"); }); }
  function reset(){ host.classList.remove("done", "lineon", "cap-on"); strips.forEach(function(s){ s.classList.remove("on", "seen"); }); }
  function finish(){ host.classList.add("lineon", "cap-on", "done"); strips.forEach(function(s){ s.classList.add("seen"); s.classList.remove("on"); }); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run; spkStop(); reset();
    at(me, 150, function(){ host.classList.add("lineon"); });
    H.ways.forEach(function(w, i){ at(me, 900 + i * 2100, function(){ on(w.id); }); });
    at(me, 900 + 3 * 2100, function(){ host.classList.add("cap-on"); });
    at(me, 900 + 3 * 2100 + 700, finish);
  }
  function wayParts(w){ return [{ t:MV.plain(H.line), rate:w.rate, volume:w.volume, pitch:w.pitch }]; }
  function listenAll(){
    var me = ++HR.run, i = 0;
    if (MV.reduceMotion) finish(); else { reset(); host.classList.add("lineon"); }
    (function next(){
      if (me !== HR.run) return;
      if (i >= H.ways.length) { finish(); return; }
      var w = H.ways[i++]; if (!MV.reduceMotion) on(w.id);
      speakParts(wayParts(w), { onDone:function(){ if (me === HR.run) setTimeout(next, 350); } });
    })();
  }
  function btns(){ $("#pa-hlisten").hidden = !VOICE; $("#pa-hagain").hidden = MV.reduceMotion; $("#pa-hnote").hidden = !!VOICE; $$(".pa-splay", host).forEach(function(b){ b.hidden = !VOICE; }); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "pa-hlisten") listenAll();
    else if (b.id === "pa-hagain") animate();
    else if (b.dataset.way) { HR.run++; finish(); var w = byId(H.ways, b.dataset.way); if (!MV.reduceMotion) on(w.id); speakParts(wayParts(w)); }
  });
  if (MV.reduceMotion) { host.classList.add("rm"); finish(); } else animate();
  voiceReady(btns);
  HR.stop = function(){ spkStop(); if (!host.classList.contains("done")) { HR.run++; finish(); } };
}

// ---------- @component E10 stageSimulator (top-down form) — an SVG stage with lettered tokens, props, sight-lines and
// setting backdrops; tokens glide (CSS transform) and jump with reduced motion. viewA / viewB turn choices into positions. ----------
var TOKS = { A:["C", "P", "O", "H"], B:["P", "Q", "H", "G"] };
var SPY = { screen:{ C:[183, 61], P:[217, 61], c:[200, 61] }, balcony:{ C:[170, 25], P:[230, 25], c:[200, 25] }, arras:{ C:[52, 142], P:[52, 190], c:[52, 166] } };
var HIDE = { arras:{ p:[200, 61], thrust:[200, 104] }, screen:{ p:[350, 155], thrust:[300, 155] } };
var OPOS = [200, 168], HPOS = [264, 160], QPOS = [168, 168], HBPOS = [250, 160], GPOS = [306, 78];
function wavy(x1, y1, x2, y2, cls){
  var n = 9, d = "M" + x1 + " " + y1, vert = x1 === x2;
  for (var i = 1; i <= n; i++) { var t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, o = (i % 2 ? 5 : -5); d += " Q" + (vert ? x1 + o : x - (x2 - x1) / n / 2) + " " + (vert ? y - (y2 - y1) / n / 2 : y1 + o) + " " + x + " " + y; }
  return '<path class="' + cls + '" d="' + d + '"/>';
}
function lbl(x, y, t, cls, anchor){ return '<text class="pa-lbl' + (cls ? " " + cls : "") + '" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '">' + esc(t) + "</text>"; }
function seg(a, b, cls){ return '<line class="' + cls + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; }
// a line from a toward b, stopping r short of each end (so it leaves the token circles)
function sight(a, b, cls, r1, r2){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1, u = [dx / L, dy / L], s = r1 == null ? 15 : r1, e = r2 == null ? 15 : r2;
  return seg([+(a[0] + u[0] * s).toFixed(1), +(a[1] + u[1] * s).toFixed(1)], [+(b[0] - u[0] * e).toFixed(1), +(b[1] - u[1] * e).toFixed(1)], cls);
}
function arrowTo(a, b, len, cls){ var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1; return seg([a[0] + dx / L * 16, a[1] + dy / L * 16], [a[0] + dx / L * (16 + len), a[1] + dy / L * (16 + len)], cls + '" marker-end="url(#pa-arr)'); }
function backdrop(pid){
  var h = "";
  if (pid === "globe") {
    h += seg([26, 70], [26, 250], "pa-aud") + seg([374, 70], [374, 250], "pa-aud") + '<text class="pa-lbl pa-audl" transform="translate(16 160) rotate(-90)" text-anchor="middle">audience</text><text class="pa-lbl pa-audl" transform="translate(386 160) rotate(90)" text-anchor="middle">audience</text>';
    h += '<circle class="pa-pillar" cx="112" cy="118" r="6"/><circle class="pa-pillar" cx="288" cy="118" r="6"/><rect class="pa-door" x="84" y="37" width="30" height="7"/><rect class="pa-door" x="286" y="37" width="30" height="7"/>';
    h += '<circle class="pa-sun" cx="378" cy="16" r="8"/>' + lbl(364, 20, "daylight", "", "end");
  } else if (pid === "olivier") {
    h += '<rect class="pa-shade" x="40" y="40" width="320" height="210"/>';
    for (var i = 0; i < 6; i++) h += seg([300 + i * 9, 44 + i * 11], [356, 44 + i * 11], "pa-stair");
    h += lbl(356, 118, "stairway", "", "end") + lbl(48, 246, "black and white", "", "start");
  } else if (pid === "palace") {
    for (var k = 0; k < 5; k++) { var x = 62 + k * 58; h += '<rect class="pa-mirror" x="' + x + '" y="42" width="40" height="14" rx="2"/>' + seg([x + 6, 54], [x + 16, 44], "pa-glint") + seg([x + 18, 54], [x + 26, 46], "pa-glint"); }
    h += lbl(48, 246, "mirrored hall", "", "start");
  } else if (pid === "corporate") {
    for (var g = 0; g < 8; g++) h += seg([40 + g * 40, 40], [40 + g * 40, 250], "pa-glass");
    h += seg([40, 120], [360, 120], "pa-glass") + seg([40, 190], [360, 190], "pa-glass");
    [[90, 44], [270, 44], [330, 110]].forEach(function(p){ h += '<rect class="pa-screen" x="' + p[0] + '" y="' + p[1] + '" width="26" height="15" rx="2"/>'; });
    h += lbl(48, 246, "glass and screens", "", "start");
  } else if (pid === "surveillance") {
    [[46, 46, 1], [354, 46, -1]].forEach(function(c){ h += '<polygon class="pa-cone" points="' + c[0] + "," + c[1] + " " + (c[0] + c[2] * 150) + ",250 " + (c[0] + c[2] * 260) + ',250"/><rect class="pa-cam" x="' + (c[0] - 7) + '" y="' + (c[1] - 5) + '" width="14" height="10" rx="2"/>'; });
    h += lbl(200, 246, "security cameras", "");
  }
  return h;
}
function stageSkel(sc, pid){
  var h = '<defs><marker id="pa-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="pa-arrh" d="M0 0L10 5L0 10z"/></marker></defs>';
  h += '<rect class="pa-floor" x="40" y="40" width="320" height="210" rx="4"/>' + lbl(46, 33, "upstage", "pa-dir", "start") + seg([40, 262], [360, 262], "pa-aud") + lbl(200, 284, "AUDIENCE", "pa-audl");
  h += '<g class="pa-bd">' + backdrop(pid) + '</g><g class="pa-props"></g><g class="pa-lines"></g><g class="pa-toks">' +
    TOKS[sc].map(function(k){ return '<g class="pa-tok pa-t' + k + '" data-tok="' + k + '"><circle r="13"/><text y="5" text-anchor="middle">' + k + "</text></g>"; }).join("") + '</g><g class="pa-fx"></g>';
  return h;
}
function stageSet(svg, v, snap){
  if (snap) svg.classList.add("pa-snap");
  $(".pa-props", svg).innerHTML = v.props || ""; $(".pa-lines", svg).innerHTML = v.lines || ""; $(".pa-fx", svg).innerHTML = v.fx || "";
  $$(".pa-tok", svg).forEach(function(g){
    var k = g.dataset.tok, p = v.toks[k];
    if (!p) { g.style.display = "none"; return; }
    g.style.display = ""; g.style.transform = "translate(" + p[0] + "px," + p[1] + "px)";
    g.setAttribute("class", "pa-tok pa-t" + k + (p[2] ? " " + p[2] : ""));
  });
  svg.setAttribute("aria-label", v.desc);
  if (snap) { void svg.getBoundingClientRect(); svg.classList.remove("pa-snap"); }
}
// Scene A. ph: −2 before the scene, −1 the whole staging at rest, 0–6 the key line being played (3.5 = the push).
function viewA(st, ph, o){
  o = o || {};
  var C = MV.C.explore, cue = ph === -1 ? 99 : ph, sp = SPY[st.spy] || SPY.screen, T = {}, props = "", lines = "", d = [];
  if (st.spy === "screen") props += seg([163, 80], [237, 80], "pa-prop") + lbl(200, 94, "screen", "pa-plbl");
  else if (st.spy === "balcony") props += '<rect class="pa-balc" x="132" y="10" width="136" height="28" rx="3"/>' + lbl(276, 22, "balcony", "pa-plbl", "start") + lbl(276, 33, "(above)", "pa-plbl", "start");
  else props += wavy(72, 112, 72, 222, "pa-arras") + lbl(80, 236, "arras", "pa-plbl", "start");
  T.C = [sp.C[0], sp.C[1], "pa-spy"]; T.P = [sp.P[0], sp.P[1], "pa-spy"];
  var Op = OPOS.slice(), Hp = HPOS.slice();
  if (ph === -2) Hp = [394, 160];
  if (cue >= 3 && st.contact === "grip") Hp = [228, 164];
  if (cue >= 3 && st.contact === "embrace") Hp = [224, 160];
  if (cue >= 3.5 && st.contact === "embrace") Op = [172, 190];
  T.H = Hp.concat("pa-lead"); T.O = Op;
  if (st.contact === "grip" && cue >= 3) lines += lbl(Hp[0] - 12, Hp[1] - 20, "grips wrist", "pa-nlbl");
  if (st.contact === "embrace" && cue >= 3.5) lines += arrowTo([Hp[0] - 6, Hp[1] + 2], Op, 18, "pa-push") + lbl(Op[0] - 2, Op[1] + 30, "pushed away", "pa-nlbl");
  var sees = st.aware === "knows" ? ph !== -2 : st.aware === "notices" && cue >= 5;
  if (sees) lines += sight(Hp, sp.c, "pa-sight" + (ph === 5 ? " pa-flash" : ""), 15, 12);
  if (!o.noGlance && cue >= 6) {
    if (st.oph === "glance") lines += arrowTo(Op, sp.c, 26, "pa-glance");
    else if (st.oph === "straight") lines += arrowTo(Op, Hp, 18, "pa-glance");
    else lines += arrowTo(Op, [Op[0], Op[1] + 60], 14, "pa-glance") + lbl(Op[0] + 20, Op[1] + 34, "looks down", "pa-nlbl", "start");
  }
  if (ph === -1 && !o.noVoiceTag) lines += lbl(Hp[0] + 4, Hp[1] + 31, (st.vol === "shout" ? "SHOUT" : "whisper") + " · " + st.pace, "pa-nlbl");
  d.push("Top-down stage, audience at the bottom. Claudius and Polonius hide " + (byId(C.sim.A[0].options, st.spy) || {}).t + ".");
  d.push(ph === -2 ? "Hamlet is about to enter from the right." : "Hamlet stands " + (st.contact === "none" || cue < 3 ? "a few steps from" : "close to") + " Ophelia, centre stage.");
  if (st.contact !== "none" && cue >= 3) d.push(st.contact === "grip" ? "He grips her wrist." : "He embraces her, then pushes her away.");
  if (sees) d.push("A dotted sight-line runs from Hamlet to the hiding place: he " + (st.aware === "knows" ? "knows he is watched" : "notices the spies") + ".");
  if (!o.noGlance && cue >= 6) d.push(st.oph === "glance" ? "Ophelia glances toward the hiding place." : st.oph === "straight" ? "Ophelia looks straight at Hamlet." : "Ophelia looks down.");
  return { toks:T, props:props, lines:lines, desc:d.join(" ") };
}
// Scene B. ph: −2 before (Polonius not yet hidden), −1 at rest, 0 hide, 1 thrust, 2 “Is it the king?”, 3 Ghost, 4 “Alas, he’s mad!”
function viewB(st, ph){
  var cue = ph === -1 ? 99 : ph, hd = HIDE[st.hide] || HIDE.arras, T = {}, props = "", lines = "", fx = "", d = [];
  if (st.hide === "screen") props += '<polyline class="pa-prop" points="330,112 322,130 330,148 322,166 330,184 322,200"/>' + lbl(334, 214, "folding screen", "pa-plbl", "end");
  else props += wavy(146, 82, 254, 82, "pa-arras") + lbl(262, 86, "arras", "pa-plbl", "start");
  var Hp = HBPOS.slice(), rest = ph === -1;
  T.Q = QPOS.slice();
  T.P = ph === -2 ? [236, 120, "pa-spy"] : [hd.p[0], hd.p[1], "pa-spy" + (!rest && cue >= 1 ? " pa-fallen" : "")];
  if (!rest && (cue === 1 || cue === 2)) Hp = hd.thrust.slice();
  T.H = Hp.concat("pa-lead");
  if (!rest && (cue === 1 || cue === 2)) lines += seg([Hp[0], Hp[1]], [hd.p[0] + (hd.p[0] - Hp[0]) * 0.2, hd.p[1] + (hd.p[1] - Hp[1]) * 0.2], "pa-rapier");
  if (rest) {
    lines += sight(Hp, hd.p, "pa-thr", 15, 16) + lbl((Hp[0] + hd.p[0]) / 2 + (st.hide === "screen" ? 0 : -8), (Hp[1] + hd.p[1]) / 2 + (st.hide === "screen" ? -10 : 4), "thrust: " + (st.thrust === "pause" ? "after a pause" : "instant"), "pa-nlbl", st.hide === "screen" ? "middle" : "end");
    if (st.belief === "knows") lines += lbl(Hp[0], Hp[1] + 30, "knows it’s Polonius", "pa-nlbl");
    else if (st.belief === "hopes") lines += lbl(Hp[0], Hp[1] + 30, "“Is it the king?”", "pa-nlbl");
    else lines += lbl(Hp[0], Hp[1] + 30, "doesn’t care who", "pa-nlbl");
  }
  if (cue >= 3) {
    if (st.ghost === "none") { fx += '<circle class="pa-glow" cx="' + GPOS[0] + '" cy="' + GPOS[1] + '" r="24"/>' + lbl(GPOS[0], GPOS[1] + 5, "♪", "pa-note") + lbl(GPOS[0], GPOS[1] - 29, "light and sound", "pa-nlbl"); T.G = null; lines += sight(Hp, GPOS, "pa-sight" + (ph === 3 ? " pa-flash" : ""), 15, 24); }
    else { T.G = GPOS.concat(st.ghost === "aud" ? "pa-ghost pa-ghost-aud" : "pa-ghost"); lines += sight(Hp, GPOS, "pa-sight" + (ph === 3 ? " pa-flash" : ""), 15, 15); if (st.ghost === "all") lines += sight(T.Q, GPOS, "pa-sight", 15, 15); }
    if (st.ghost === "aud") lines += lbl(GPOS[0], GPOS[1] - 21, "seen by Hamlet and us", "pa-nlbl");
  } else T.G = null;
  if (cue >= 4 && st.ghost !== "all") lines += arrowTo(T.Q, Hp, 18, "pa-glance");
  d.push("Top-down stage, audience at the bottom. Gertrude stands centre left, Hamlet centre right.");
  d.push(ph === -2 ? "Polonius is about to hide." : "Polonius hides " + (st.hide === "screen" ? "behind a folding screen at the side" : "behind the arras, centre") + (!rest && cue >= 1 ? "; Hamlet’s thrust has killed him" : "") + ".");
  if (cue >= 3) d.push(st.ghost === "aud" ? "The Ghost stands upstage right, seen by Hamlet and the audience, not by Gertrude." : st.ghost === "all" ? "The Ghost stands upstage right, seen by everyone." : "Upstage right there is only a light and a sound.");
  return { toks:T, props:props, lines:lines, fx:fx, desc:d.join(" ") };
}

// ---------- the simulator’s rules ----------
function choiceList(sc, st){
  return MV.C.explore.sim[sc].map(function(c){ var o = byId(c.options, st[c.id]) || c.options[0]; return { c:c, o:o, label:c.label, t:o.t, r:o.r || c.r, why:o.why || c.why }; });
}
function lowest(list){ if (!list.length) return null; var lo = 2; list.forEach(function(x){ lo = Math.min(lo, RANK[x.r]); }); return lo; }
function attitude(st){
  if (st.aware === "knows") return "cold";
  if (st.aware === "notices") { if (st.vol === "whisper") return st.contact === "grip" ? "anguished" : "protective"; return st.contact === "none" ? "testing" : "cruel"; }
  if (st.vol === "whisper" || st.contact === "none") return "anguished";
  return "cruel";
}
// support meter: list = [{label, t, r, why}]
function meterHTML(list, o){
  o = o || {};
  var M = MV.C.explore.meter, lo = lowest(list);
  if (lo == null) return '<div class="pa-meter"><p class="pa-mh">' + M.title + ': <span class="muted">' + (o.empty || "") + "</span></p></div>";
  var cur = LEVELS[lo], lows = list.filter(function(x){ return RANK[x.r] === lo; });
  var h = '<div class="pa-meter' + (o.drop ? " pa-drop" : "") + '" data-lvl="' + cur + '"><p class="pa-mh">' + M.title + ": <strong>" + M[cur] + "</strong></p>" +
    '<div class="pa-mbar" aria-hidden="true">' + LEVELS.map(function(n, i){ return '<span class="pa-seg pa-' + n + (i <= lo ? " on" : "") + '">' + M[n] + "</span>"; }).join("") + "</div>";
  h += '<p class="pa-mlow">' + (lo === 2 ? M.allStrong : M.lowest + ": " + lows.slice(0, lo === 0 ? 3 : 1).map(function(x){ return "<strong>" + x.label + ": " + x.t + "</strong>. " + x.why; }).join(" ")) + "</p>";
  if (o.full) h += '<ul class="pa-rlist">' + list.map(function(x){ return '<li><span class="pa-rt pa-' + x.r + '">' + M[x.r] + "</span> " + x.label + ": " + x.t + ' <span class="muted">' + x.why + "</span></li>"; }).join("") + "</ul>";
  return h + "</div>";
}

// ---------- Explore: Stage simulator ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, SIM = C.sim;
  function fill(o, sc){ o = o || {}; SIM[sc].forEach(function(c){ if (!byId(c.options, o[c.id])) o[c.id] = C.defaults[sc][c.id]; }); return o; }
  S.mode = has(["block", "audience", "settings"], S.mode) ? S.mode : "block";
  S.scene = S.scene === "B" ? "B" : "A";
  S.A = fill(S.A, "A"); S.B = fill(S.B, "B");
  S.preset = byId(C.presets, S.preset) ? S.preset : "";
  S.slots = S.slots || {};
  var fx = {}, play = { busy:false, run:0 }, rg = {}, lastFocus = null, skelKey = "", phone = window.matchMedia && window.matchMedia("(max-width:560px)").matches;

  host.innerHTML = '<div class="pa">' +
    '<div class="pa-toprow"><div id="pa-mode"></div><div id="pa-scene"></div></div><p class="how" id="pa-how"></p>' +
    '<div class="pa-body"><div class="pa-main" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<p class="pa-snote" id="pa-snote"></p>' +
      '<div class="pa-stagewrap"><svg class="pa-stage" id="pa-stage" viewBox="0 0 400 296" role="img" aria-label="" focusable="false"></svg></div>' +
      '<p class="pa-legend" id="pa-legend"></p>' +
      '<div class="pa-now" id="pa-now" aria-live="polite"></div>' +
      '<div class="pa-presets" id="pa-presets"><div id="pa-prg"></div><div class="pa-pcard" id="pa-pcard"></div></div>' +
      '<div class="pa-ctrls" id="pa-ctrls"></div>' +
    '</div><div class="pa-side"><div class="pa-readbox"><p class="pa-read-h">Readout</p><dl class="read" id="pa-read" aria-live="polite"></dl><p class="pa-believe" id="pa-believe" aria-live="polite"></p>' +
      '<div id="pa-meter" aria-live="polite"></div><p class="tiny muted pa-modelnote">' + C.model + "</p>" +
      '<div class="pa-playrow"><button type="button" class="btn primary sm" id="pa-play">▶ Play the key lines</button><button type="button" class="btn ghost sm" id="pa-stop" hidden>Stop</button></div>' +
      '<p class="tiny muted pa-vnote" id="pa-vnote" hidden>' + C.noVoice + '</p><p class="pa-aha">' + C.aha + "</p></div></div></div>" +
    '<div class="pa-board" id="pa-slots"></div></div>';

  var svg = $("#pa-stage");
  var modeR = radios($("#pa-mode"), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  var sceneR = radios($("#pa-scene"), { label:"Scene", options:C.scenes, value:S.scene, onChange:function(v){ setScene(v); MV.changed(); } });
  var presetR = radios($("#pa-prg"), { label:"Setting", cls:"chips", options:C.presets.map(function(p){ return { id:p.id, t:p.t }; }), value:S.preset, onChange:function(v){ stopPlay(); fx.hideSetting = false; S.preset = v; api.save(); paint(); } });

  function setMode(v){ stopPlay(); S.mode = v; modeR.set(v); api.save(); paint(); }
  function setScene(v){ stopPlay(); S.scene = v; sceneR.set(v); api.save(); buildCtrls(); paint(); }
  function buildCtrls(){
    var sc = S.scene, groups = [];
    SIM[sc].forEach(function(c){ var g = groups.filter(function(x){ return x.t === c.group; })[0]; if (!g) { g = { t:c.group, cs:[] }; groups.push(g); } g.cs.push(c); });
    $("#pa-ctrls").innerHTML = groups.map(function(g, gi){ return '<details class="pa-grp"' + (!phone || gi === 0 ? " open" : "") + "><summary>" + g.t + "</summary>" + g.cs.map(function(c){ return '<div class="pa-ctl" data-ctl="' + c.id + '"></div>'; }).join("") + "</details>"; }).join("");
    rg = {};
    SIM[sc].forEach(function(c){
      rg[c.id] = radios($('[data-ctl="' + c.id + '"]', host), { label:c.label, cls:"chips", options:c.options, value:S[sc][c.id], onChange:function(v){ stopPlay(); fx = {}; S[sc][c.id] = v; api.save(); paint(); MV.changed(); } });
    });
    var N = C.names, L = sc === "A" ? ["H", "O", "C", "P"] : ["H", "Q", "P", "G"];
    $("#pa-legend").innerHTML = L.map(function(k){ return '<span class="pa-key"><span class="pa-kt" aria-hidden="true">' + k + "</span> " + N[k] + "</span>"; }).join("") + '<span class="pa-key"><span class="pa-kline" aria-hidden="true"></span> sight-line</span>';
  }
  function lockCtrls(b){ Object.keys(rg).forEach(function(k){ rg[k].lock(b); }); sceneR.lock(b); modeR.lock(b); presetR.lock(b); }

  // ----- paint -----
  function paintStage(){
    var sc = S.scene, key = sc + "|" + S.preset;
    if (key !== skelKey) { svg.innerHTML = stageSkel(sc, S.preset); skelKey = key; stageSet(svg, sc === "A" ? viewA(S.A, -1) : viewB(S.B, -1), true); }
    else stageSet(svg, sc === "A" ? viewA(S.A, -1) : viewB(S.B, -1));
  }
  function paintRead(){
    var sc = S.scene, st = S[sc], R = C.readout, rows = [], list = choiceList(sc, st), lo = lowest(list), full = S.mode === "audience", pr = byId(C.presets, S.preset);
    if (sc === "A") {
      var att = attitude(st), foc = C.focus[st.stress], flash = lastFocus != null && lastFocus !== foc; lastFocus = foc;
      if (full) rows.push([R.spies, C.yes]);
      rows.push([R.att, C.attitudes[att]]);
      if (full) rows.push([R.oph, C.ophelia[st.oph]]);
      if (S.mode !== "settings") rows.push([R.focus, '<span class="' + (flash ? "pa-flashv" : "") + '">' + foc + "</span>"]);
      rows.push([R.support, C.meter[LEVELS[lo]]]);
      if (S.mode !== "settings") rows.push([R.tension, st.aware === "notices" || st.vol === "shout" ? "High" : "Medium"]);
    } else {
      if (full) rows.push([R.hidden, C.yesB]);
      rows.push([R.kill, C.killing[st.thrust] + ", " + C.killing[st.belief]]);
      if (S.mode !== "settings") rows.push([R.ghost, C.ghostReads[st.ghost]]);
      if (full) rows.push([R.gert, C.gertrudeSees[st.ghost]]);
      rows.push([R.support, C.meter[LEVELS[lo]]]);
      if (S.mode !== "settings") rows.push([R.tension, st.thrust === "instant" ? "High" : "Medium"]);
    }
    if (S.mode === "settings" && !fx.hideSetting) rows.push([R.setting, pr ? '<span class="' + (fx.flashSetting ? "pa-flashv" : "") + '">' + pr.e + "</span>" : '<span class="muted">' + C.presetNone + "</span>"]);
    $("#pa-read").innerHTML = MV.readoutHTML(rows);
    var B = C.believes;
    $("#pa-believe").innerHTML = full ? "<strong>" + R.believes + ":</strong> " + (sc === "A" ? B.A[st.aware] + " " + B.treat + C.attShort[attitude(st)].toLowerCase() + B.she + C.ophelia[st.oph].toLowerCase() + "." : B.B[st.belief] + " " + B.ghost[st.ghost]) : "";
    $("#pa-meter").innerHTML = meterHTML(list, { full:full, drop:fx.drop });
  }
  function paintSlots(){
    var box = $("#pa-slots"), SL = C.slots; box.hidden = S.scene !== "A"; if (box.hidden) return;
    MV.keepFocus(box, function(){
      box.innerHTML = '<h4 class="pa-h">' + SL.title + '</h4><p class="how">' + SL.how + '</p><div class="pa-slotgrid">' + ["s1", "s2"].map(function(id){
        var x = S.slots[id], h = '<div class="pa-slot" data-slot="' + id + '"><p class="pa-slh">' + SL[id] + "</p>";
        if (x) { var lst = choiceList("A", x.st), lo = lowest(lst); h += '<p class="pa-slsum">Reads as <strong>' + C.attShort[attitude(x.st)] + "</strong> · support: <strong>" + C.meter[LEVELS[lo]] + '</strong></p><p class="tiny muted">' + lst.filter(function(y){ return y.c.id !== "spy" && y.c.id !== "oph"; }).map(function(y){ return y.t; }).join(" · ") + "</p>"; }
        else h += '<p class="tiny muted">' + SL.empty + "</p>";
        h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-save="' + id + '" data-k="sv' + id + '">' + SL.save + "</button>" + (x ? '<button type="button" class="btn ghost sm" data-load="' + id + '" data-k="ld' + id + '">' + SL.load + "</button>" : "") + "</div>";
        h += '<div class="pa-ev" data-evh="' + id + '"></div>';
        return h + "</div>";
      }).join("") + "</div>";
    });
    ["s1", "s2"].forEach(function(id){
      var x = S.slots[id];
      radios($('[data-evh="' + id + '"]', box), { label:SL.evidence, cls:"chips pa-evl", options:C.evidence.map(function(e){ return { id:e.id, t:"“" + e.t + "” " + HC(e.ref) }; }), value:x ? x.ev : "", disabled:function(){ return !x; },
        onChange:function(v){ S.slots[id].ev = v; api.save(); MV.changed(); } });
    });
  }
  function paintPresets(){
    $("#pa-presets").hidden = S.mode !== "settings";
    var pr = byId(C.presets, S.preset);
    $("#pa-pcard").innerHTML = pr ? "<p><strong>" + pr.t + ":</strong> " + pr.d + "</p>" : '<p class="muted">' + C.presetNone + "</p>";
  }
  function paint(){
    $("#pa-how").innerHTML = C.modeHow[S.mode];
    $("#pa-snote").innerHTML = C.sceneNote[S.scene];
    paintStage(); paintRead(); paintPresets(); paintSlots(); paintPlay();
  }
  function paintPlay(){ $("#pa-play").disabled = play.busy || !!fx.lock; $("#pa-stop").hidden = !play.busy; $("#pa-vnote").hidden = !!VOICE; }

  // ----- the key lines -----
  function delivery(sc, st, ln){
    var d = {};
    if (sc === "A") {
      if (ln.who === "H") d.pace = st.pace;
      if (ln.cue === "nunnery") { d.vol = st.vol; d.stress = (byId(SIM.A.filter(function(c){ return c.id === "stress"; })[0].options, st.stress) || {}).t; }
      if (ln.cue === "home" && (st.aware === "notices" || st.oph === "glance")) d.pauseB = true;
    } else if (ln.cue === "thrust" && st.thrust === "pause") { d.pauseB = true; d.gap = 1300; }
    return d;
  }
  function showNow(ln, d){
    if (!ln) { $("#pa-now").innerHTML = ""; return; }
    var dw = deliveryWords(d || {});
    $("#pa-now").innerHTML = '<p><span class="pa-who">' + C.names[ln.who] + "</span> " + (ln.silent ? '<em class="muted">' + ln.t + "</em>" : "“" + deliveryHTML(ln.t, d || {}) + "”" + (ln.ref ? ' <span class="eng-cite">' + HC(ln.ref) + "</span>" : "")) +
      (dw && !ln.silent ? ' <span class="tiny muted">(' + dw + ")</span>" : "") + "</p>" + (!VOICE && !ln.silent ? '<p class="tiny muted">Read it aloud yourself.</p>' : "");
  }
  function sayLine(ln, d, cb){
    if (ln.silent || !VOICE) { MV.wait((ln.silent ? 1100 : Math.max(1200, wc(ln.t) * 380 / rateOf(d))) + (d.pauseB ? (d.gap || 400) : 0), cb); return; }
    speakParts(deliveryParts(ln.t, d), { onDone:cb });
  }
  function view(sc, ph){ return sc === "A" ? viewA(S.A, ph) : viewB(S.B, ph); }
  function startPlay(){
    if (play.busy) return;
    var me = ++play.run, sc = S.scene, st = S[sc], L = C.play[sc], i = 0;
    play.busy = true; spkStop(); MV.banner("", ""); paintPlay();
    stageSet(svg, view(sc, -2), true);
    function alive(){ return me === play.run; }
    function next(){
      if (!alive()) return;
      if (i >= L.length) { play.busy = false; stageSet(svg, view(sc, -1)); paintPlay(); return; }
      var k = i++, ln = L[k], d = delivery(sc, st, ln);
      showNow(ln, d);
      var go = function(){ stageSet(svg, view(sc, k)); if (sc === "A" && ln.cue === "nunnery" && st.contact === "embrace") MV.wait(750, function(){ if (alive()) stageSet(svg, viewA(S.A, 3.5)); }); };
      if (d.pauseB && d.gap) MV.wait(d.gap, function(){ if (alive()) go(); }); else go();
      sayLine(ln, d, function(){ if (alive()) MV.wait(300, next); });
    }
    MV.wait(350, next);
  }
  function stopPlay(){ if (!play.busy) return; play.run++; play.busy = false; spkStop(); paintStage(); paintPlay(); }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.id === "pa-play") { startPlay(); return; }
    if (b.id === "pa-stop") { stopPlay(); var p = $("#pa-play"); if (p) p.focus(); return; }
    if (b.dataset.save) { var id = b.dataset.save, old = S.slots[id]; S.slots[id] = { st:JSON.parse(JSON.stringify(S.A)), ev:old ? old.ev : "" }; api.save(); paintSlots(); MV.changed(); return; }
    if (b.dataset.load) { var x = S.slots[b.dataset.load]; if (!x) return; stopPlay(); S.A = fill(JSON.parse(JSON.stringify(x.st)), "A"); api.save(); if (S.scene !== "A") setScene("A"); else { buildCtrls(); paint(); } MV.changed(); return; }
  });
  document.addEventListener("click", function(e){
    var b = e.target.closest(".pa-setup"); if (!b || fx.lock) return;
    var id = b.dataset.setup, sc = id === "tc2" ? "B" : "A";
    stopPlay(); if (S.mode === "settings") setMode("block");
    if (S.scene !== sc) setScene(sc);
    MV.changed();
    var t = id === "tc3" ? $("#pa-slots") : $(".pa-stagewrap", host); if (t) t.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });

  buildCtrls(); paint(); showNow(null);
  voiceReady(function(){ paintPlay(); });

  // ----- predictions -----
  function lineBy(sc, cue){ return C.play[sc].filter(function(l){ return l.cue === cue; })[0]; }
  EX = {
    stop:function(){ stopPlay(); },
    predict:{
      start:function(p){
        stopPlay(); fx = {}; var s = p.start || {};
        S.mode = s.mode; modeR.set(s.mode);
        if (s.scene && s.scene !== S.scene) { S.scene = s.scene; sceneR.set(s.scene); buildCtrls(); }
        if (p.id === "p1") { S.A.stress = "nunnery"; rg.stress.set("nunnery"); }
        if (p.id === "p2") { S.A.aware = "never"; rg.aware.set("never"); }
        if (p.id === "p3") { S.B.thrust = "instant"; S.B.belief = "hopes"; S.B.ghost = "aud"; S.B.hide = "arras"; ["thrust", "belief", "ghost", "hide"].forEach(function(k){ rg[k].set(S.B[k]); }); }
        if (p.id === "p4") { S.preset = "corporate"; presetR.set("corporate"); fx.hideSetting = true; }
        lastFocus = null; fx.lock = true; lockCtrls(true); api.save(); paint(); showNow(null);
      },
      run:function(p, done){
        var me = ++play.run, fin = false;
        function finish(){ if (fin) return; fin = true; fx.lock = false; fx.drop = false; lockCtrls(false); paint(); MV.changed(); done(); }
        function alive(){ return me === play.run && !fin; }
        setTimeout(finish, 25000); // a safety net: the prediction always finishes
        if (p.id === "p1") {
          var ln = lineBy("A", "nunnery"), d1 = delivery("A", S.A, ln);
          stageSet(svg, viewA(S.A, 3)); showNow(ln, d1);
          sayLine(ln, d1, function(){
            if (!alive()) return;
            S.A.stress = "thee"; rg.stress.set("thee"); api.save(); paintRead();
            var d2 = delivery("A", S.A, ln); showNow(ln, d2);
            sayLine(ln, d2, function(){ if (alive()) MV.wait(500, finish); });
          });
        } else if (p.id === "p2") {
          S.A.aware = "notices"; rg.aware.set("notices"); api.save(); paintRead();
          var lf = lineBy("A", "father"), lh = lineBy("A", "home");
          stageSet(svg, viewA(S.A, 5)); showNow(lf, delivery("A", S.A, lf));
          sayLine(lf, delivery("A", S.A, lf), function(){
            if (!alive()) return;
            var dh = delivery("A", S.A, lh); stageSet(svg, viewA(S.A, 6)); showNow(lh, dh);
            sayLine(lh, dh, function(){ if (alive()) MV.wait(500, finish); });
          });
        } else if (p.id === "p3") {
          S.B.thrust = "pause"; rg.thrust.set("pause"); api.save(); fx.drop = true; paintRead();
          var lr = lineBy("B", "thrust"), dr = delivery("B", S.B, lr);
          stageSet(svg, viewB(S.B, 0)); showNow(lr, dr);
          MV.wait(dr.gap, function(){ if (alive()) stageSet(svg, viewB(S.B, 1)); });
          sayLine(lr, dr, function(){ if (alive()) MV.wait(700, finish); });
        } else if (p.id === "p4") {
          var lp = { who:"H", t:p.line, ref:p.ref };
          showNow(lp, {});
          sayLine(lp, {}, function(){ if (!alive()) return; fx.hideSetting = false; fx.flashSetting = true; paintRead(); fx.flashSetting = false; MV.wait(900, finish); });
        } else finish();
      }
    },
    challenge:function(id, opt){
      var c = byId(C.challenges, id), m = c.msgs;
      if (id === "tc1") {
        var a = S.A;
        if (a.aware === "knows") return { ok:false, msg:m.knows };
        if (a.aware === "never") return { ok:false, msg:m.never };
        return lowest(choiceList("A", a)) >= 1 ? { ok:true } : { ok:false, msg:c.general };
      }
      if (id === "tc2") {
        var b = S.B;
        if (b.belief === "knows") return { ok:false, msg:m.knows };
        if (b.thrust === "pause") return { ok:false, msg:m.pause };
        if (b.ghost === "all") return { ok:false, msg:m.all };
        if (b.belief !== "hopes") return { ok:false, msg:c.general };
        return lowest(choiceList("B", b)) >= 1 ? { ok:true } : { ok:false, msg:c.general };
      }
      if (id === "tc3") {
        var K = MV.ans(c), s1 = S.slots.s1, s2 = S.slots.s2;
        if (!s1 || !s2) return { ok:false, msg:m.empty };
        if (s1.ev === "e5" || s2.ev === "e5") return { ok:false, msg:m.once };
        if (s1.ev === "e4") return { ok:false, msg:m.knavesCruel };
        var a2 = attitude(s2.st), a1 = attitude(s1.st);
        if (a2 !== "protective") {
          if (s2.st.aware === "knows") return { ok:false, msg:m.weak };
          if (s2.st.vol === "shout") return { ok:false, msg:m.shout };
          if (s2.st.aware === "never") return { ok:false, msg:m.unaware };
          return { ok:false, msg:m.notProt };
        }
        if (a1 !== "cruel") return { ok:false, msg:s1.st.aware === "knows" ? m.weak : m.notCruel };
        if (lowest(choiceList("A", s1.st)) < 1 || lowest(choiceList("A", s2.st)) < 1) return { ok:false, msg:m.weak };
        if (!s1.ev || !s2.ev) return { ok:false, msg:m.noLine };
        if (!has(K.s1, s1.ev)) return { ok:false, msg:m.lineCruel };
        if (!has(K.s2, s2.ev)) return { ok:false, msg:m.lineProt };
        if (!opt || !opt.live) MV.banner("good", c.banner);
        return { ok:true };
      }
      return { ok:false };
    }
  };
  return EX;
}

// ---------- Part 3: Adaptation (fidelity spectrum, setting ↔ argument, cut or keep) ----------
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.stations.s1, S2 = C.stations.s2, S3 = C.stations.s3;
  S.ord = Array.isArray(S.ord) && S.ord.length === 5 ? S.ord : [null, null, null, null, null];
  S.s1 = S.s1 || {}; S.m2 = S.m2 || {}; S.s3 = S.s3 || {};
  var sel1 = null, msg1 = null, sel2 = null, msg2 = null;
  // arguments in a shuffled order, with at most one level with its setting
  var ARGS = (function(){ var K = MV.ans(S2), best = S2.args, bn = 99; for (var t = 0; t < 12; t++) { var r = MV.shuffle(S2.args, MV.meta.id + "s2" + t), n = 0; S2.settings.forEach(function(x, i){ if (K[x.id] === r[i].id) n++; }); if (n < bn) { best = r; bn = n; } if (n <= 1) break; } return best; })();
  host.innerHTML = '<div class="pa-p3">' +
    '<section class="pa-st" aria-labelledby="pa-st1h"><h3 id="pa-st1h">' + S1.title + '</h3><p class="how">' + S1.how + '</p><div id="pa-s1"></div></section>' +
    '<section class="pa-st" aria-labelledby="pa-st2h"><h3 id="pa-st2h">' + S2.title + '</h3><p class="how">' + S2.how + '</p><div id="pa-s2"></div></section>' +
    '<section class="pa-st" aria-labelledby="pa-st3h"><h3 id="pa-st3h">' + S3.title + '</h3><p class="pa-s3p">' + S3.prompt + '</p><div id="pa-s3"></div></section></div>';
  var h1 = $("#pa-s1"), h2 = $("#pa-s2"), h3 = $("#pa-s3");

  // station 1
  function card(id){ return byId(S1.cards, id); }
  function paint1(){
    MV.keepFocus(h1, function(){
      var un = S1.cards.filter(function(c){ return !has(S.ord, c.id); }), done = !!S.s1.done;
      var h = '<div class="pa-tray" role="group" aria-label="Adaptation cards to place">' + (un.length ? un.map(function(c){ return '<button type="button" class="pa-card" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + (sel1 === c.id) + '"' + (done ? " disabled" : "") + "><strong>" + c.t + "</strong><small>" + c.d + "</small></button>"; }).join("") : '<p class="tiny muted">All five cards are on the line.</p>') + "</div>";
      h += '<div class="pa-spec"><p class="pa-end pa-end0">◀ ' + S1.ends[0] + '</p><ol class="pa-line" aria-label="The spectrum, from close to the text to loose retelling">' + S.ord.map(function(id, i){
        var c = card(id);
        return '<li><button type="button" class="pa-pos' + (c ? " full" : "") + (sel1 ? " ready" : "") + '" data-pos="' + i + '" data-k="ps' + i + '"' + (done ? " disabled" : "") + ' aria-label="' + esc("Place " + (i + 1) + " of 5" + (c ? ": " + MV.plain(c.t) : ", empty")) + '"><span class="pa-pn" aria-hidden="true">' + (i + 1) + "</span>" + (c ? "<span>" + c.t + "</span>" : '<span class="muted">empty</span>') + "</button></li>";
      }).join("") + '</ol><p class="pa-end pa-end1">' + S1.ends[1] + " ▶</p></div>";
      if (!done) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="s1check" data-k="s1chk">' + S1.check + '</button><button type="button" class="btn ghost sm" data-act="s1reset" data-k="s1rst">' + S1.reset + "</button></div>";
      if (msg1) h += MV.fbHTML(msg1.k, msg1.h);
      if (done) {
        h += '<div class="pa-loose"><p>' + S1.prompt + '</p><div id="pa-lrg"></div><div class="jq"><label for="pa-ls">' + S1.sentence + '</label><textarea id="pa-ls" class="pa-ls" rows="3"></textarea><div class="saved" id="pa-ls-saved" aria-live="polite"></div></div></div>';
      }
      h1.innerHTML = h;
    });
    if (S.s1.done) {
      radios($("#pa-lrg"), { label:"Loose card", cls:"chips", options:S1.loose.map(function(id){ return { id:id, t:card(id).t }; }), value:S.s1.loose || "", onChange:function(v){ S.s1.loose = v; api.save(); } });
      var ta = $("#pa-ls"), tm = null; ta.value = S.s1.text || "";
      ta.addEventListener("input", function(){ S.s1.text = ta.value; clearTimeout(tm); tm = setTimeout(function(){ api.save(); $("#pa-ls-saved").textContent = "Saved"; }, 400); });
    }
  }
  h1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !h1.contains(b) || b.closest("#pa-lrg")) return;
    if (b.dataset.card) { sel1 = sel1 === b.dataset.card ? null : b.dataset.card; msg1 = null; paint1(); return; }
    if (b.dataset.pos != null) {
      var i = +b.dataset.pos, cur = S.ord[i];
      if (sel1) { var from = S.ord.indexOf(sel1); if (from >= 0) S.ord[from] = cur; S.ord[i] = sel1; sel1 = null; }
      else if (cur) { S.ord[i] = null; sel1 = cur; }
      msg1 = null; api.save(); paint1(); return;
    }
    if (b.dataset.act === "s1reset") { S.ord = [null, null, null, null, null]; sel1 = null; msg1 = null; api.save(); paint1(); return; }
    if (b.dataset.act === "s1check") {
      if (S.ord.some(function(x){ return !x; })) { msg1 = { k:"bad", h:"<strong>✗ Not yet.</strong> " + S1.fb.place }; paint1(); MV.focusFb(h1); return; }
      var K = MV.ans(S1), bad = -1;
      for (var k = 0; k < 5; k++) if (!has(K[k], S.ord[k])) { bad = k; break; }
      S.s1.tries = (S.s1.tries || 0) + 1;
      if (bad < 0) { S.s1.done = true; msg1 = { k:"good", h:"<strong>✓ " + S1.done + "</strong>" }; }
      else msg1 = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (bad === 0 ? S1.fb.full : bad === 1 ? S1.fb.modern : bad === 2 ? S1.fb.relocated : S1.fb.loose) + " Move a card and check again." };
      api.save(); paint1(); MV.focusFb(h1);
    }
  });

  // station 2
  function paint2(){
    var K = MV.ans(S2), doneA = {};
    Object.keys(S.m2).forEach(function(k){ doneA[S.m2[k]] = k; });
    var all = S2.settings.every(function(s){ return S.m2[s.id]; });
    MV.keepFocus(h2, function(){
      var h = "";
      if (msg2) h += MV.fbHTML(msg2.k, msg2.h);
      if (all) h += '<p class="sort-done">All five settings matched.</p>';
      h += '<div class="match"><div class="match-col" role="group" aria-label="Settings"><h4>Setting</h4>' + S2.settings.map(function(s, i){
        var d = !!S.m2[s.id]; return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-set="' + s.id + '" data-k="st' + s.id + '" aria-pressed="' + (sel2 === s.id) + '"' + (d ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + (i + 1) + "</span>" : "") + "<span>" + s.t + "</span></button>";
      }).join("") + '</div><div class="match-col" role="group" aria-label="Arguments"><h4>Argument</h4>' + ARGS.map(function(a){
        var who = doneA[a.id], n = who ? S2.settings.indexOf(byId(S2.settings, who)) + 1 : 0;
        return '<button type="button" class="mitem' + (who ? " done" : "") + '" data-arg="' + a.id + '" data-k="ar' + a.id + '"' + (who ? " disabled" : "") + ">" + (who ? '<span class="pair-n">✓ ' + n + "</span>" : "") + "<span>" + a.t + "</span></button>";
      }).join("") + "</div></div>";
      h2.innerHTML = h;
    });
    void K;
  }
  h2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.set) { sel2 = sel2 === b.dataset.set ? null : b.dataset.set; msg2 = null; paint2(); return; }
    if (b.dataset.arg) {
      if (!sel2) { msg2 = { k:"", h:"Tap a setting first, then tap the argument it makes." }; paint2(); return; }
      var K = MV.ans(S2);
      if (K[sel2] === b.dataset.arg) { S.m2[sel2] = b.dataset.arg; msg2 = { k:"good", h:"<strong>✓ Matched.</strong> " + S2.why[sel2] }; sel2 = null; api.save(); }
      else msg2 = { k:"bad", h:"<strong>✗ Not a match.</strong> " + S2.wrong };
      paint2(); MV.focusFb(h2);
    }
  });

  // station 3
  function paint3(){
    var ri = MV.right(S3.options), pick = S.s3.pick, solved = pick === ri;
    MV.keepFocus(h3, function(){
      var h = '<div class="opts" role="radiogroup" aria-label="Predict what is lost">' + S3.options.map(function(o, i){
        var c = "opt" + (pick === i ? (i === ri ? " right" : " wrong") : "") + (solved && i === ri ? " right" : "");
        return '<button type="button" class="' + c + '" role="radio" aria-checked="' + (pick === i) + '" data-o3="' + i + '" data-k="o3' + i + '"' + (solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span><span>" + o.t + "</span></button>";
      }).join("") + "</div>";
      if (pick != null) h += MV.fbHTML(solved ? "good" : "bad", (solved ? "<strong>✓ Correct.</strong> " : "<strong>✗ Not quite.</strong> ") + (S3.options[pick].why || "") + (solved ? "" : " Try again."));
      if (solved) h += '<p class="pa-then">' + S3.then + "</p>";
      h3.innerHTML = h;
    });
  }
  h3.addEventListener("click", function(e){ var b = e.target.closest("[data-o3]"); if (!b || b.disabled) return; S.s3.pick = +b.dataset.o3; S.s3.tries = (S.s3.tries || 0) + 1; api.save(); paint3(); MV.focusFb(h3); });

  paint1(); paint2(); paint3();

  // Sentence to steal: save the imitation to the notebook (commonplace entry)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#pa-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="pa-steal-save">' + ST.save + '</button><span class="tiny muted" id="pa-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "pa-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#pa-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#pa-steal-st").textContent = "Saved your imitation to your Art of Language notebook (commonplace book).";
    });
  }
  return {};
}

// ---------- Practice 1: Read it three ways — @component N6 matching with a play button per card (E15 read-aloud) ----------
function matchOrder(a){
  var K = MV.ans(a) || {}, best = a.right, bestN = 1e9;
  for (var t = 0; t < 12; t++) {
    var r = MV.shuffle(a.right, MV.meta.id + a.id + (t ? "#" + t : "")), n = 0;
    a.left.forEach(function(L, i){ if (r[i] && K[L.id] === r[i].id) n++; });
    if (n < bestN) { best = r; bestN = n; }
    if (n <= 1) break;
  }
  return best;
}
function threeWays(host, api, a){
  var st = api.S; st.done = st.done || {}; st.tries = st.tries || {}; st.hints = st.hints || {};
  var sel = null, msg = null, right = matchOrder(a), playing = null;
  function hintsFor(L){ var K = MV.ans(a), r = byId(a.right, K[L.id]); return [a.hints[0], a.hints[1], "Match: " + r.t + ". " + a.why[L.id]]; }
  function stats(){
    var first = 0, done = 0, missed = [];
    a.left.forEach(function(L){ var bad = (st.tries[L.id] || 0) > 0 || (st.hints[L.id] || 0) >= 3; if (st.done[L.id]) { done++; if (!bad) first++; } if (bad) missed.push(L); });
    return { first:first, done:done, total:a.left.length, missed:missed };
  }
  function paint(){
    var K = MV.ans(a), s = stats(), doneR = {};
    a.left.forEach(function(L, i){ if (st.done[L.id]) doneR[K[L.id]] = i + 1; });
    var h = '<p class="how">Tap ▶ to hear a card. Tap a card, then tap the meaning it produces.</p>' + (VOICE ? "" : '<p class="tiny muted">' + a.noVoice + "</p>");
    if (sel) { var L = byId(a.left, sel), lv = st.hints[sel] || 0; h += '<div class="sel-bar"><span>Selected: ' + L.t + "</span>" + MV.hintBtn("mh" + a.id, lv) + "</div>" + MV.hintsHTML(hintsFor(L), lv); }
    if (msg) h += MV.fbHTML(msg.k, msg.h);
    if (s.done === s.total) h += '<p class="sort-done" style="margin-top:10px">All matched! You got ' + s.first + " of " + s.total + " right on the first try, without the worked solution.</p>";
    h += '<div class="match"><div class="match-col" role="group" aria-label="' + esc(a.leftTitle) + '"><h4>' + a.leftTitle + "</h4>" + a.left.map(function(L, i){
      var d = st.done[L.id];
      return '<div class="pa-lrow">' + (VOICE ? '<button type="button" class="btn ghost sm pa-lplay" data-play="' + L.id + '" data-k="pl' + L.id + '" aria-label="' + esc(a.play + " card " + (i + 1)) + '"' + (playing === L.id ? ' aria-pressed="true"' : "") + ">▶</button>" : "") +
        '<button type="button" class="mitem' + (d ? " done" : "") + '" data-l="' + L.id + '" data-k="ml' + L.id + '" aria-pressed="' + (sel === L.id) + '"' + (d ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + (i + 1) + "</span>" : '<span class="pa-cn" aria-hidden="true">' + (i + 1) + "</span>") + "<span>" + L.t + "</span></button></div>";
    }).join("") + '</div><div class="match-col" role="group" aria-label="' + esc(a.rightTitle) + '"><h4>' + a.rightTitle + "</h4>" + right.map(function(R){
      var d = doneR[R.id];
      return '<button type="button" class="mitem' + (d ? " done" : "") + '" data-r="' + R.id + '" data-k="mr' + R.id + '"' + (d ? " disabled" : "") + ">" + (d ? '<span class="pair-n">✓ ' + d + "</span>" : "") + "<span>" + R.t + "</span></button>";
    }).join("") + "</div></div>";
    MV.keepFocus(host, function(){ host.innerHTML = h; });
  }
  function playCard(L){
    playing = L.id; paint();
    var parts = [];
    L.say.forEach(function(p){
      if (p[0] === "‖") { parts.push({ gap:450 }); return; }
      parts.push(p[1] ? { t:p[0], rate:0.7, volume:1, pitch:1.1 } : { t:p[0], rate:1, volume:0.8, pitch:1 });
    });
    speakParts(parts, { onDone:function(){ playing = null; paint(); } });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.play) { playCard(byId(a.left, b.dataset.play)); return; }
    if (b.dataset.l) { sel = sel === b.dataset.l ? null : b.dataset.l; msg = null; paint(); return; }
    if (b.dataset.act === "hint" && sel) { st.hints[sel] = Math.min(3, (st.hints[sel] || 0) + 1); api.save(); paint(); return; }
    if (b.dataset.r) {
      if (!sel) { msg = { k:"", h:"Tap a card on the left first, then tap its meaning." }; paint(); return; }
      var K = MV.ans(a), L = byId(a.left, sel);
      if (K[sel] === b.dataset.r) { st.done[sel] = true; msg = { k:"good", h:"<strong>✓ Matched.</strong> " + a.why[sel] }; sel = null; api.save(); paint(); MV.focusFb(host); }
      else { st.tries[sel] = (st.tries[sel] || 0) + 1; msg = { k:"bad", h:"<strong>✗ Not a match.</strong> " + ((a.wrong && a.wrong[sel + "|" + b.dataset.r]) || a.wrongDefault) }; api.save(); paint(); MV.focusFb(host); }
      void L;
    }
  });
  paint();
  voiceReady(function(){ paint(); });
  return {
    stats:function(){ var s = stats(); return { first:s.first, total:s.total, done:s.done, line:(a.summary || a.title) + " (first try): " + s.first + "/" + s.total + (s.done < s.total ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; stats().missed.forEach(function(){ g = g.concat(MV.goalIdx(a.goal)); }); return g; }
  };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 08; numbered sentences) ----------
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

// ---------- @component E17 draftWorkspace (copied from ENG4U 08) — a writing area with a live word count (target range),
// saved drafts (up to 3) and a side-by-side compare with the changes marked ----------
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
  host.innerHTML = '<div class="pa-dw"><label for="dw-' + o.id + '" class="pa-lab">' + o.label + '</label><textarea id="dw-' + o.id + '" class="pa-dw-ta" rows="10"></textarea>' +
    '<div class="q-actions"><span class="pa-dw-n" id="dw-' + o.id + '-n" aria-live="polite"></span><button type="button" class="btn ghost sm" id="dw-' + o.id + '-save">Save as a draft</button></div><div id="dw-' + o.id + '-list"></div><div id="dw-' + o.id + '-cmp" aria-live="polite"></div></div>';
  var ta = $("#dw-" + o.id, host); ta.value = o.get() || "";
  function count(){
    var n = wc(ta.value), msg = n < o.min ? (o.min - n) + " to go" : n > o.max ? (n - o.max) + " over" : "in range";
    $("#dw-" + o.id + "-n", host).innerHTML = "<strong>" + n + " word" + (n === 1 ? "" : "s") + "</strong> · aim for " + o.min + "–" + o.max + " (" + msg + ")";
  }
  function list(){
    var D = o.drafts(), el = $("#dw-" + o.id + "-list", host);
    el.innerHTML = D.length ? '<p class="tiny pa-dw-l">Saved drafts: ' + D.map(function(d, i){ return '<button type="button" class="linkbtn" data-dwc="' + i + '" aria-pressed="' + (cmp === i) + '">Compare draft ' + d.n + " with now</button>"; }).join(" · ") + "</p>" : "";
    var cb = $("#dw-" + o.id + "-cmp", host);
    if (cmp != null && D[cmp]) { var df = diffWords(D[cmp].t, ta.value); cb.innerHTML = '<div class="pa-dw-cmp"><div><p class="tiny"><strong>Draft ' + D[cmp].n + '</strong> (removed words struck through)</p><p>' + df[0] + '</p></div><div><p class="tiny"><strong>Now</strong> (new words underlined)</p><p>' + df[1] + "</p></div></div>"; }
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

// ---------- promptbook checks (structure only) ----------
// quotations with their positions; a quotation inside another one is dropped
function quotesAt(t){
  var s = String(t || ""), out = [], m, res = [/“([^”]+)”/g, /"([^"\n]+)"/g, /‘([^’]+?)’(?![A-Za-z])/g, /(?:^|[\s(\[—–-])'([^'\n]+?)'(?=[\s.,;:!?)\]—–-]|$)/g];
  res.forEach(function(re){ while ((m = re.exec(s))) { var end = m.index + m[0].length, start = end - m[1].length - 2; out.push({ q:m[1], s:start, e:end }); } });
  return out.filter(function(x){ return !out.some(function(y){ return y !== x && y.s <= x.s && y.e >= x.e && (y.e - y.s) > (x.e - x.s); }); });
}
function citedQuotes(t, scene, win){
  if (!scene) return 0;
  var sc = scene.split(".")[1], s = String(t || "");
  var re = new RegExp("^[\\s\\S]{0," + win + "}?\\(\\s*(?:[*_]?Hamlet[*_]?\\s+)?3\\." + sc + "\\.\\d+(?:\\s*[–—-]\\s*\\d+)?\\s*\\)");
  return quotesAt(s).filter(function(q){ return re.test(s.slice(q.e)); }).length;
}

// ---------- Performance task: Director’s promptbook ----------
var task = (function(){
  var api = null, T = null, dw = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function words(line){ var seen = {}; return MV.plain(line).replace(/\s*\/\s*/g, " ").split(/\s+/).map(function(w){ return w.replace(/^[“"‘'(]+|[.,;:!?”"’')]+$/g, ""); }).filter(function(w){ var k = w.toLowerCase(); if (!w || seen[k]) return false; seen[k] = 1; return true; }); }
  function data(S){
    S = S || {}; T = T || MV.C.task;
    var sc = T.moments[S.scene] ? S.scene : "", M = sc ? T.moments[sc] : [], mm = (S.m && S.m[sc]) || {}, text = String(S.text || "");
    var mom = M.map(function(m){
      var x = mm[m.id] || {}, b = byId(m.blocking, x.b), dl = byId(T.delivery, x.d), w = x.d === "stress" ? (x.w || "") : "";
      return { m:m, b:b, d:dl, w:w, staged:!!(b && dl && (x.d !== "stress" || w)) };
    });
    var rated = mom.filter(function(x){ return x.b; }).map(function(x){ return { label:MV.plain(x.m.t), t:x.b.t, r:x.b.r, why:x.b.why }; });
    return { scene:sc, mom:mom, rated:rated, lo:lowest(rated), effect:byId(T.effects, S.effect), hide:S.hide || "", text:text, n:wc(text), explain:explain() };
  }
  function checks(d){
    return [d.mom.length === 3 && d.mom.every(function(x){ return x.staged; }),
      d.lo != null && d.lo >= 1,
      citedQuotes(d.text, d.scene, T.quoteWin) >= 2,
      !!d.effect && MV.eng.hasWord(d.text, d.effect.key),
      d.n >= T.min && d.n <= T.max];
  }
  function stageState(d){
    var b = {}; d.mom.forEach(function(x){ b[x.m.id] = x.b ? x.b.id : ""; });
    if (d.scene === "3.1") return { sc:"A", st:{ spy:d.hide || "screen", aware:b.m1 === "eye" ? "knows" : b.m2 === "turn" ? "notices" : "never", oph:"straight", vol:"whisper", pace:"slow", stress:"nunnery", contact:b.m3 || "none" } };
    return { sc:"B", st:{ hide:b.m1 === "screen" ? "screen" : "arras", belief:b.m1 === "seen" ? "knows" : "hopes", thrust:b.m2 || "instant", ghost:b.m3 || "aud" } };
  }
  function paintMoms(){
    var S = api.S, sc = S.scene, host = $("#pb-moms"), L = T.labels;
    $("#pb-hide").innerHTML = ""; $("#pb-hide").hidden = !(sc && T.hides[sc]);
    if (sc && T.hides[sc]) radios($("#pb-hide"), { label:T.hides[sc].label, cls:"chips", options:T.hides[sc].options, value:S.hide || "", onChange:function(v){ S.hide = v; changed(); } });
    if (!sc) { host.innerHTML = '<p class="tiny muted">Choose a scene to see its three key moments.</p>'; return; }
    S.m = S.m || {}; S.m[sc] = S.m[sc] || {};
    host.innerHTML = T.moments[sc].map(function(m, i){ return '<div class="pa-mom" data-mom="' + m.id + '"><p class="pa-momh"><span class="pa-pn" aria-hidden="true">' + (i + 1) + "</span>Moment " + (i + 1) + ": " + m.t + '</p><p class="pa-momline">' + (m.line ? "“" + esc(m.line) + "” " + HC(m.ref) : '<em class="muted">' + m.note + "</em>") + '</p><div class="pa-mb"></div><div class="pa-md"></div><div class="pa-mw"></div></div>'; }).join("");
    T.moments[sc].forEach(function(m){
      var box = $('[data-mom="' + m.id + '"]', host), x = S.m[sc][m.id] || (S.m[sc][m.id] = {});
      radios($(".pa-mb", box), { label:L.blocking, cls:"chips", options:m.blocking, value:x.b || "", onChange:function(v){ x.b = v; changed(); } });
      radios($(".pa-md", box), { label:m.deliveryLabel || L.delivery, cls:"chips", options:T.delivery.filter(function(o){ return !(m.noStress && o.id === "stress"); }), value:x.d || "", onChange:function(v){ x.d = v; paintWord(box, m, x); changed(); } });
      paintWord(box, m, x);
    });
  }
  function paintWord(box, m, x){
    var h = $(".pa-mw", box);
    if (x.d !== "stress") { h.innerHTML = ""; return; }
    radios(h, { label:T.labels.stressWord, cls:"chips", options:words(m.line || "").map(function(w){ return { id:w, t:esc(w) }; }), value:x.w || "", onChange:function(v){ x.w = v; changed(); } });
  }
  function paintIns(){
    var S = api.S, host = $("#pb-ins"), sc = S.scene;
    if (!sc) { host.innerHTML = ""; return; }
    var L = MV.C.explore.play[sc === "3.1" ? "A" : "B"].filter(function(l){ return l.ref; });
    host.innerHTML = '<p class="pa-lab">Insert a quotation</p><p class="tiny muted">Tap a line to put it, with its citation, where your cursor is in the note.</p><div class="pa-inslist">' + L.map(function(l, i){ return '<button type="button" class="pa-insb" data-ins="' + i + '">“' + esc(l.t) + '” <span class="pa-ref">(' + l.ref + ")</span></button>"; }).join("") + "</div>";
  }
  function insertAt(txt){
    var ta = dw.ta, s = ta.selectionStart != null ? ta.selectionStart : ta.value.length, e2 = ta.selectionEnd != null ? ta.selectionEnd : s, v = ta.value;
    var pre = v.slice(0, s), post = v.slice(e2), lead = pre && !/\s$/.test(pre) ? " " : "";
    ta.value = pre + lead + txt + post; var pos = (pre + lead + txt).length;
    try { ta.focus(); ta.setSelectionRange(pos, pos); } catch (err) {}
    dw.changed();
  }
  function modelHTML(md){ return '<div class="pa-model"><h5>' + md.title + " <span class=\"tiny muted\">(" + wc(MV.plain(md.text)) + " words)</span></h5><p>" + md.text + "</p></div>"; }
  function paintPv(){
    var S = api.S, d = data(S), L = T.labels, el = $("#pb-pv"); if (!el) return;
    var svg = $("#pb-stage");
    if (d.scene) {
      var ss = stageState(d), key = ss.sc + "|";
      if (svg.dataset.key !== key) { svg.innerHTML = stageSkel(ss.sc, ""); svg.dataset.key = key; }
      var v = ss.sc === "A" ? viewA(ss.st, -1, { noGlance:true, noVoiceTag:true }) : viewB(ss.st, -1);
      stageSet(svg, v, true); svg.parentNode.hidden = false;
    } else svg.parentNode.hidden = true;
    $("#pb-meter").innerHTML = meterHTML(d.rated, { empty:"choose blocking for each moment to rate it" });
    el.innerHTML = '<h4 class="pa-h" style="margin-top:0">' + L.glance + "</h4><ul class=\"pa-glance\"><li><strong>" + L.scene + ":</strong> " + (d.scene || '<span class="muted">not chosen</span>') + "</li>" +
      d.mom.map(function(x, i){ return "<li><strong>Moment " + (i + 1) + ":</strong> " + (x.b ? x.b.t : '<span class="muted">no blocking</span>') + "; " + (x.d ? x.d.t.toLowerCase() + (x.d.id === "stress" ? (x.w ? " “" + esc(x.w) + "”" : " (choose the word)") : "") : '<span class="muted">no delivery</span>') + "</li>"; }).join("") +
      "<li><strong>" + L.effect + ":</strong> " + (d.effect ? d.effect.t : '<span class="muted">not chosen</span>') + "</li><li><strong>Words:</strong> " + d.n + " (aim for " + T.min + "–" + T.max + ")</li><li><strong>Cited quotations from the scene:</strong> " + citedQuotes(d.text, d.scene, T.quoteWin) + " (at least 2)</li></ul>";
    var ok = checks(d).every(Boolean);
    if (ok && !S.modelsSeen) { S.modelsSeen = true; api.save(); }
    $("#pb-models").innerHTML = S.modelsSeen ? '<details class="alg"><summary>' + T.modelsLabel + '</summary><p class="tiny muted">' + T.modelsNote + "</p>" + T.models.map(modelHTML).join("") + "</details>" : "";
  }
  function changed(){ api.save(); api.update(); paintPv(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, L = T.labels;
      inp.innerHTML = '<div class="pa-pb"><div id="pb-scene"></div><div id="pb-hide"></div><div id="pb-moms" class="pa-moms"></div><div id="pb-effect"></div><div id="pb-ins" class="pa-ins"></div><div id="pb-draft"></div></div>';
      pv.innerHTML = '<div class="pa-pvstage"><svg class="pa-stage pa-mini" id="pb-stage" viewBox="0 0 400 296" role="img" aria-label="" focusable="false"></svg></div><div id="pb-meter" aria-live="polite"></div><div id="pb-pv" aria-live="polite"></div><div id="pb-models"></div>';
      radios($("#pb-scene"), { label:L.scene, cls:"chips", options:T.scenes, value:S.scene || "", onChange:function(v){ S.scene = v; paintMoms(); paintIns(); changed(); } });
      radios($("#pb-effect"), { label:L.effect, cls:"chips", options:T.effects.map(function(e){ return { id:e.id, t:e.t }; }), value:S.effect || "", onChange:function(v){ S.effect = v; changed(); } });
      S.drafts = Array.isArray(S.drafts) ? S.drafts : [];
      dw = draftWorkspace($("#pb-draft"), { id:"note", label:L.note + " (" + T.min + "–" + T.max + " words)", min:T.min, max:T.max, get:function(){ return S.text; }, set:function(v){ S.text = v; }, drafts:function(){ return S.drafts; }, onChange:changed });
      paintMoms(); paintIns();
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-ins]"); if (!b || !inp.contains(b)) return;
        var sc = S.scene, l = MV.C.explore.play[sc === "3.1" ? "A" : "B"].filter(function(x){ return x.ref; })[+b.dataset.ins];
        insertAt("“" + MV.plain(l.t).replace(/[.,;:]+$/, "") + "” (" + l.ref + ")");
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      paintPv();
      extras();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return !d.scene ? "Choose a scene first." : d.text.trim() ? true : "Write your director’s note first."; },
    checks:checks,
    key:function(d){ return d.scene + " · " + (d.effect ? d.effect.t : ""); }, label:function(k){ return esc(k); }, text:function(k){ return k; },
    summary:function(ts){
      T = T || MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.every(Boolean), out = [];
      out.push((T.summary || "Director’s promptbook") + ": " + (met ? "complete (scene " + d.scene + "; effect: " + d.effect.t + "; " + d.n + " words)" : "not complete yet (checklist " + r.filter(Boolean).length + "/" + r.length + ")"));
      if (d.scene && T.hides[d.scene]) { var hd = byId(T.hides[d.scene].options, d.hide); out.push("  " + T.hides[d.scene].label + ": " + (hd ? hd.t : "(not chosen)")); }
      d.mom.forEach(function(x, i){ out.push("  Moment " + (i + 1) + " (" + MV.plain(x.m.t) + "): blocking: " + (x.b ? x.b.t : "(not chosen)") + "; delivery: " + (x.d ? x.d.t.toLowerCase() + (x.d.id === "stress" ? " “" + (x.w || "?") + "”" : "") : "(not chosen)")); });
      if (d.lo != null) out.push("  Support meter: " + MV.C.explore.meter[LEVELS[d.lo]]);
      out.push("  Intended audience effect: " + (d.effect ? d.effect.t : "(not chosen)"));
      out.push("  Director’s note (" + d.n + " words):");
      out.push("    " + (d.text.trim() || "(not written yet)"));
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
  if (sheet && art && R.art.intro && !$("#pa-artintro")) { var p = document.createElement("p"); p.id = "pa-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#pa-artn")) {
    var n = document.createElement("p"); n.id = "pa-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app");
  if (cp && !cp.childNodes.length) {
    MV.eng.commonplace(cp, { lines:R.cpLines });
    var nl = $('label[for="cp-note"]', cp); if (nl) nl.textContent = "How you’d say it";
  }
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ three:threeWays, spot:spotProse },
  task:task,
  summaryLines:function(){
    var p = (MV.S.writes["art-principle"] || "").trim(), T = MV.C.task, L = ["New principle: " + (p || "(not written yet)"), "", "Teacher rubric for the director’s promptbook (Ontario achievement chart, levels 1–4):"];
    T.rubric.forEach(function(r){ L.push("  " + r[0] + ": L1 " + r[1] + " · L2 " + r[2] + " · L3 " + r[3] + " · L4 " + r[4]); });
    return L;
  },
  onShow:function(v){
    spkStop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX && v !== "explore") EX.stop();
    if (v === "reflect") extras();
  }
});
})();
