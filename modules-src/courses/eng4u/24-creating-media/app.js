// ENG4U 24 Creating an Original Media Text: hero (Coleridge's sentence → four tiles → poster grid, storyboard strip, podcast
// waveform), Media studio (Explore: E14 media builder with brief builder, fit-scored form chooser, poster grid, podcast blocks,
// storyboard panels and social posts, live readouts), Test with an audience (Part 3: question bank, tester log with a
// message-match check, revisions with a Craft → meaning panel), Spot the Error (K13), "Make it" (the same studio, asset list,
// revision notes, producer's statement) and the capstone preface to My Art of Language (E16 book view). Texts in content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function uniq(a){ return a.filter(function(x, i){ return a.indexOf(x) === i; }); }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function XC(){ return MV.C.explore; }
function tx(s){ return String(s == null ? "" : s); }

// ---------- @component radioGroup (copied from ENG4U 09; no option needs to be checked) ----------
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), key}) -> {set, get, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kp = o.key || "";
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 ? val : ids[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '"' + (kp ? ' data-k="' + kp + esc(id) + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector('[tabindex="0"]'); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) { e.stopPropagation(); choose(b.dataset.rg); } });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.map(function(x){ return String(x.id); }), i = (ids.indexOf(b.dataset.rg) + d + ids.length) % ids.length;
    choose(ids[i]); var nb = host.querySelector('[data-rg="' + ids[i] + '"]'); if (nb) nb.focus();
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, refresh:paint };
}

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }
function sayAll(list, done){ var i = 0; (function next(){ if (!VOICE || i >= list.length) { if (done) done(); return; } MV.eng.say(list[i++], { voice:VOICE, onEnd:function(){ setTimeout(next, 350); } }); })(); }

// ---------- small drawings: built-in icons (original, course-owned) and storyboard sketches ----------
var ICONS = {
  book:'<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>',
  phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  megaphone:'<path d="M3 10v4h4l7 5V5L7 10z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  people:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.5 1-4.5 3-4.5s3 2 3 4.5"/>',
  heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'
};
function icon(id, cls){ return ICONS[id] ? '<svg class="cm-ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[id] + "</svg>" : ""; }
function fig(cx, top, h){ // stick figure: head at top, height h
  var r = h * 0.11, neck = top + 2 * r, hip = top + h * 0.58, sh = neck + h * 0.08;
  return '<circle cx="' + cx + '" cy="' + (top + r) + '" r="' + r + '"/><path d="M' + cx + " " + neck + "V" + hip + "M" + cx + " " + hip + "L" + (cx - h * 0.16) + " " + (top + h) + "M" + cx + " " + hip + "L" + (cx + h * 0.16) + " " + (top + h) +
    "M" + (cx - h * 0.2) + " " + (sh + h * 0.18) + "L" + cx + " " + sh + "L" + (cx + h * 0.2) + " " + (sh + h * 0.18) + '"/>';
}
function sketch(x){
  var s = x.shot, g = "", v = tx(x.vis).toLowerCase();
  if (s === "el") g = '<path class="cm-sk-l" d="M0 66H160"/>' + fig(80, 50, 15) + '<path class="cm-sk-l" d="M20 66l18-20 14 20M112 66l16-14 14 14"/>';
  else if (s === "l") g = '<path class="cm-sk-l" d="M0 82H160"/>' + fig(72, 22, 58) + (/table|kitchen/.test(v) ? '<path class="cm-sk-l" d="M92 56h46M98 56v26M132 56v26"/>' : "");
  else if (s === "m") g = fig(80, 10, 150);
  else if (s === "cu") g = '<circle cx="80" cy="50" r="30"/><circle cx="70" cy="45" r="3"/><circle cx="90" cy="45" r="3"/><path d="M70 62q10 6 20 0M56 90q24-14 48 0"/>';
  else if (s === "ecu") g = /thumb|share|phone/.test(v) ? '<rect class="cm-sk-btn" x="44" y="44" width="72" height="26" rx="6"/><text class="cm-sk-t" x="80" y="62">Share</text><path d="M96 90V48q0-12 12-12t12 12v42"/>' : '<path d="M30 45q50-36 100 0q-50 36-100 0z"/><circle cx="80" cy="45" r="12"/><circle class="cm-sk-f" cx="80" cy="45" r="5"/>';
  else g = '<text class="cm-sk-t" x="80" y="50">Choose a shot</text>';
  var tag = (x.angle === "low" ? "LOW ANGLE " : x.angle === "high" ? "HIGH ANGLE " : "") + (x.move === "pan" ? "PAN →" : x.move === "zoom" ? "ZOOM" : "");
  return '<svg class="cm-sk" viewBox="0 0 160 90" aria-hidden="true" focusable="false"><rect class="cm-sk-fr" x="1" y="1" width="158" height="88" rx="3"/>' + g + (tag ? '<text class="cm-sk-tag" x="6" y="12">' + tag + "</text>" : "") + "</svg>";
}

// ---------- the media project (shared by Explore and the performance task) ----------
var SZ = { S:1, M:2, L:3 }, CN = { low:1, high:2 };
function blankPanel(){ return { shot:"", angle:"eye", move:"static", dur:4, vis:"", audio:"", text:"", km:false }; }
function blankProj(){
  var p = { brief:{ topic:"", own:"", purpose:"", age:"", belief:"", habit:"", msg:"", action:"" }, form:"", why:"",
    poster:{ headline:{ cell:0, size:"L", con:"high", text:"" }, visual:{ cell:0, size:"M", con:"high", icon:"", text:"", photo:false }, body:{ cell:0, size:"S", con:"low", text:"" }, cta:{ cell:0, size:"M", con:"high", text:"" }, logo:{ cell:0, size:"S", con:"low", text:"" } },
    podcast:{}, podKm:{}, psa:[], social:[] };
  XC().blocks.forEach(function(b){ p.podcast[b.id] = ""; });
  for (var i = 0; i < 6; i++) p.psa.push(blankPanel());
  for (i = 0; i < 3; i++) p.social.push({ cap:"", alt:"", tags:"", time:"", km:false });
  return p;
}
function normProj(p){
  var b = blankProj();
  ["brief", "poster", "podcast", "podKm"].forEach(function(k){ p[k] = p[k] || b[k]; });
  Object.keys(b.brief).forEach(function(k){ if (p.brief[k] == null) p.brief[k] = ""; });
  Object.keys(b.poster).forEach(function(k){ p.poster[k] = Object.assign(b.poster[k], p.poster[k] || {}); });
  if (!Array.isArray(p.psa) || !p.psa.length) p.psa = b.psa;
  if (!Array.isArray(p.social) || p.social.length !== 3) p.social = b.social;
  if (p.form == null) p.form = ""; if (p.why == null) p.why = "";
  return p;
}
var NORMED = false;
function proj(){ var S = MV.S.app.explore || (MV.S.app.explore = {}); if (!S.proj) S.proj = blankProj(); if (!NORMED) { normProj(S.proj); NORMED = true; } return S.proj; }
function stem(w){ return w.length > 4 ? w.replace(/(ing|ed|ly|es|s)$/, "") : w; }
function cwords(s){ var stop = XC().stop; return MV.eng.norm(s).split(" ").filter(function(w){ return w && !has(stop, w); }).map(stem); }
function sharedWords(a, b){ var A = uniq(cwords(a)), B = uniq(cwords(b)); return A.filter(function(x){ return has(B, x); }); }
function label(list, id){ var x = byId(list, id); return x ? x.t : ""; }
function audienceText(p){ var b = p.brief; return (label(XC().ages, b.age) + " " + b.belief).trim(); }
function topicText(p){ var b = p.brief; return b.topic === "own" ? b.own.trim() : label(XC().topics, b.topic); }

function briefCheck(p){
  var b = p.brief, X = XC(), miss = [], nm = wc(b.msg), nb = wc(b.belief), nrm = MV.eng.norm(b.belief);
  var blocked = has(X.blocked, nrm.replace(/^(all the|all|the)\s+/, ""));
  var crowd = blocked || (nb < 5 && nrm.split(" ").some(function(w){ return has(X.blocked, w); }));
  if (!b.age) miss.push("age range");
  if (nb < 5 || blocked) miss.push("a belief or feeling (5+ words)");
  if (!b.habit) miss.push("media habit");
  if (!b.purpose) miss.push("purpose");
  if (nm < 1 || nm > 12) miss.push("key message (1–12 words)");
  if (!b.action.trim()) miss.push("action");
  return { ok:!miss.length, miss:miss, nm:nm, blocked:blocked, crowd:crowd };
}
function fitScores(p){
  var X = XC(), F = X.fit, b = p.brief, s = [0, 0, 0, 0], na = wc(b.action);
  function add(a){ for (var i = 0; i < 4; i++) s[i] += a[i]; }
  if (b.habit && F.habit[b.habit]) add(F.habit[b.habit]);
  if (b.purpose === "inform" && /\b(how|why)\b/i.test(b.msg)) add(F.complex);
  if (na >= 1 && na <= 10) add(F.quick);
  if (b.purpose === "inspire" || b.purpose === "provoke") add(F.inspire);
  var list = X.forms.map(function(f, i){ return { id:f.id, t:f.t, short:f.short, score:s[i], i:i }; });
  var ranked = list.slice().sort(function(a, c){ return (c.score - a.score) || (a.i - c.i); });
  return { list:list, ranked:ranked, top:ranked[0].score };
}
function cellsOf(e){ if (!e || !e.cell) return []; if (e.size !== "L") return [e.cell]; return (e.cell - 1) % 3 < 2 ? [e.cell, e.cell + 1] : [e.cell - 1, e.cell]; }
function rowOf(c){ return Math.floor((c - 1) / 3); }
function posterInfo(p){
  var X = XC(), P = p.poster, placed = X.els.filter(function(e){ return P[e.id].cell; });
  var hier = placed.slice().sort(function(a, b){ var A = P[a.id], B = P[b.id]; return (SZ[B.size] - SZ[A.size]) || (CN[B.con] - CN[A.con]) || (cellsOf(A)[0] - cellsOf(B)[0]); });
  var z = !!(P.headline.cell && rowOf(P.headline.cell) === 0 && P.cta.cell && rowOf(P.cta.cell) === 2);
  return { placed:placed, hier:hier, z:z };
}
function podInfo(p){
  var X = XC(), words = 0, sents = 0, sign = 0;
  X.blocks.forEach(function(b){
    if (b.id === "music") return;
    var t = tx(p.podcast[b.id]), n = wc(t); words += n; if (!n) return;
    t.split(/[.!?…]+[”"’')\]]*(?:\s+|$)/).forEach(function(s){ if (wc(s)) sents++; });
    MV.eng.norm(t).split(" ").forEach(function(w){ if (has(X.signposts, w)) sign++; });
  });
  return { words:words, sents:sents, avg:sents ? Math.round(words / sents) : 0, sign:sign, secs:Math.round(words / 150 * 60) };
}
function fmtTime(s){ var m = Math.floor(s / 60), r = s % 60; return (m ? m + " min " : "") + r + " s"; }
function psaInfo(p){ var t = 0, ty = {}; p.psa.forEach(function(x){ t += (+x.dur || 0); if (x.shot) ty[x.shot] = 1; }); return { n:p.psa.length, total:t, variety:Object.keys(ty).length }; }
function hashtags(s){ return uniq((tx(s).toLowerCase().match(/#[a-z0-9_À-ÿ]+/g) || [])); }
function kmPlaces(p, f){
  var X = XC(), out = [];
  if (f === "poster") X.els.forEach(function(e){ var el = p.poster[e.id]; if (el.km && el.cell) out.push({ key:"c" + cellsOf(el)[0], t:e.t }); });
  if (f === "podcast") X.blocks.forEach(function(b){ if (p.podKm[b.id]) out.push({ key:b.id, t:b.t }); });
  if (f === "psa") p.psa.forEach(function(x, i){ if (x.km) out.push({ key:"p" + i, t:"Panel " + (i + 1) + (x.text.trim() ? ", on-screen text" : x.audio.trim() ? ", audio" : "") }); });
  if (f === "social") p.social.forEach(function(x, i){ if (x.km) out.push({ key:"s" + i, t:X.posts[i].t }); });
  return out;
}
function formBuilt(p, f){
  if (f === "poster") { var P = p.poster, hw = wc(P.headline.text);
    return !!(P.headline.cell && hw >= 1 && hw <= 8 && P.cta.cell && P.cta.text.trim() && P.visual.cell && (P.visual.icon || P.visual.photo || P.visual.text.trim()) && wc(P.body.text) <= 25 && P.logo.cell && P.logo.text.trim()); }
  if (f === "podcast") { var B = p.podcast, segs = ["s1", "s2", "s3"].filter(function(k){ return wc(B[k]); }).length, n = podInfo(p).words; return wc(B.cold) > 0 && segs >= 3 && wc(B.sign) > 0 && n >= 300 && n <= 600; }
  if (f === "psa") { var L = p.psa, I = psaInfo(p), last = L[L.length - 1]; return L.length >= 6 && L.length <= 10 && (I.total === 30 || I.total === 60) && I.variety >= 3 && !!last && !!(last.text.trim() || last.audio.trim()); }
  if (f === "social") { var S = p.social; if (S.length !== 3) return false;
    var each = S.every(function(x){ return x.cap.trim() && x.cap.length <= 280 && wc(x.alt) >= 10; }), sets = S.map(function(x){ return hashtags(x.tags + " " + x.cap); });
    return each && sets[0].some(function(h){ return has(sets[1], h) && has(sets[2], h); }); }
  return false;
}
function panelSentence(x, i){
  var X = XC();
  return "Panel " + (i + 1) + ": " + (x.shot ? label(X.shots, x.shot).toLowerCase() + " shot" : "no shot chosen") + ", " + label(X.angles, x.angle).toLowerCase() + ", " + label(X.moves, x.move).toLowerCase() + ", " + (x.dur || 0) + " s." +
    (x.vis.trim() ? " Visual: " + x.vis.trim() + "." : "") + (x.audio.trim() ? " Audio: " + x.audio.trim() + "." : "") + (x.text.trim() ? " On-screen text: " + x.text.trim() + "." : "") + (x.km ? " (key message)" : "");
}
function parts(p, f){
  var X = XC();
  if (f === "poster") return X.els.map(function(e){ var el = p.poster[e.id], body = e.id === "visual" ? [el.photo ? "own photo" : el.icon ? "icon: " + el.icon : "", el.text.trim()].filter(Boolean).join(", ") : el.text.trim();
    return { id:"poster:" + e.id, t:e.t, text:el.cell ? (body ? "“" + body + "” " : "") + "(cell " + cellsOf(el).join("–") + ", " + el.size + ", " + el.con + " contrast" + (el.km ? ", key message" : "") + ")" : "(not placed)" }; });
  if (f === "podcast") return X.blocks.map(function(b){ return { id:"podcast:" + b.id, t:b.t, text:tx(p.podcast[b.id]).trim() + (p.podKm[b.id] ? " (key message)" : "") }; });
  if (f === "psa") return p.psa.map(function(x, i){ return { id:"psa:" + i, t:"Panel " + (i + 1), text:panelSentence(x, i).replace(/^Panel \d+: /, "") }; });
  if (f === "social") return p.social.map(function(x, i){ return { id:"social:" + i, t:X.posts[i].t, text:"Caption: " + x.cap.trim() + " · Alt text: " + x.alt.trim() + " · Hashtags: " + x.tags.trim() + " · Posting time: " + x.time.trim() + (x.km ? " (key message)" : "") }; });
  return [];
}

// ---------- own photo for the poster: kept on this device (IndexedDB), 2 MB at most, never uploaded ----------
var PHOTO = null;
function idb(fn){ try { var r = indexedDB.open("mv-eng4u-24-photos", 1); r.onupgradeneeded = function(){ r.result.createObjectStore("photos"); }; r.onsuccess = function(){ try { fn(r.result); } catch (e) {} }; r.onerror = function(){}; } catch (e) {} }
function photoLoad(cb){ idb(function(db){ var q = db.transaction("photos").objectStore("photos").get("poster"); q.onsuccess = function(){ PHOTO = q.result || null; if (cb) cb(); }; }); }
function photoSave(v){ idb(function(db){ var t = db.transaction("photos", "readwrite"); if (v) t.objectStore("photos").put(v, "poster"); else t.objectStore("photos").delete("poster"); }); }

// ---------- @component E14 mediaBuilder — brief builder, form chooser with a transparent fit score, four builders (poster grid,
// podcast blocks, storyboard panels, social posts) and live readouts. Explore and the task each mount one on the same project;
// Explore can also show a sample ("demo") project for the predictions without touching the student's work. ----------
// studio(host, {pre, task, onChange}) -> {paint, startDemo(id), runDemo(id, done), exitDemo, setup(kind), stopFx}
function studio(host, o){
  var X = XC(), pre = o.pre, demo = null, fx = {}, sel = "headline", focusCell = 1;
  function P(){ return demo || proj(); }
  function S(){ return MV.S.app.explore; }
  function openForm(){ if (o.task) return P().form; if (demo) return demo._open; return S().open || P().form || "poster"; }
  function id(s){ return pre + "-" + s; }
  function el(s){ return $("#" + id(s), host); }
  function save(){ if (!demo) MV.save(); }

  host.innerHTML = '<div class="cm-studio">' + (o.task ? "" : '<div class="cm-demo" id="' + id("demo") + '" hidden></div><p class="banner" data-mv="banner" aria-live="polite"></p>') +
    '<div class="cm-main"><section class="cm-sec" id="' + id("brief") + '"></section>' +
    '<section class="cm-sec"><h4 class="cm-h">Form</h4><p class="tiny muted">Ranked by the fit score from your brief.</p><div id="' + id("forms") + '"></div>' +
    '<div class="jq cm-whyw" id="' + id("whyw") + '" hidden><label for="' + id("why") + '">This isn’t the top-ranked form. In one sentence, why does it fit your audience?</label><input id="' + id("why") + '" class="txtin" type="text" autocomplete="off" data-why="1"></div>' +
    '<details class="alg"><summary>How the fit score works</summary>' + X.fitHow + "</details></section>" +
    '<section class="cm-sec" data-mv="graph"><h4 class="cm-h">Builder</h4><div id="' + id("tabs") + '"></div><div id="' + id("build") + '"></div></section></div>' +
    '<aside class="cm-side"><h4 class="cm-h">Readouts</h4><dl class="read cm-read" id="' + id("read") + '" aria-live="polite"></dl>' + (o.task ? '<div class="cm-conv" id="' + id("conv") + '"></div>' : "") +
    '<details class="alg"><summary>How the readouts work</summary>' + X.readHow + "</details></aside></div>";

  // ----- brief -----
  function paintBrief(){
    var b = P().brief, box = el("brief");
    function inp(f, lab, ph, cnt){ return '<div class="jq"><label for="' + id("b-" + f) + '">' + lab + '</label><input id="' + id("b-" + f) + '" class="txtin" type="text" autocomplete="off" data-bf="' + f + '" data-k="' + pre + "bf" + f + '" value="' + esc(b[f]) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + ">" + (cnt ? '<span class="tiny muted" data-count="' + f + '" aria-live="polite"></span>' : "") + "</div>"; }
    box.innerHTML = '<h4 class="cm-h">Brief</h4><div id="' + id("tp") + '" class="cm-row"></div><div id="' + id("ownw") + '"' + (b.topic === "own" ? "" : " hidden") + ">" + inp("own", "Your topic", "") + "</div>" +
      '<div id="' + id("pu") + '" class="cm-row"></div><fieldset class="cm-persona"><legend>Audience persona</legend><div id="' + id("ag") + '" class="cm-row"></div>' +
      inp("belief", "One belief or feeling they have (at least 5 words)", "e.g. want to make friends but feel shy about joining clubs", true) + '<div id="' + id("hb") + '" class="cm-row"></div></fieldset>' +
      inp("msg", "Key message (1–12 words)", "the one sentence they should carry away", true) + inp("action", "Desired action", "begin with a verb, e.g. Sign up at the library desk by June 30", false);
    function rg(k, f, lab, list){ radios(el(k), { label:lab, cls:"chips", options:list, value:b[f], key:pre + f, onChange:function(v){ P().brief[f] = v; if (f === "topic") el("ownw").hidden = v !== "own"; save(); live(); } }); }
    rg("tp", "topic", "Topic", X.topics); rg("pu", "purpose", "Purpose", X.purposes); rg("ag", "age", "Age range", X.ages); rg("hb", "habit", "Media habit", X.habits);
  }
  // ----- form chooser -----
  function paintForms(){
    var p = P(), F = fitScores(p), box = el("forms"), maxS = 7;
    MV.keepFocus(box, function(){
      box.innerHTML = '<div class="cm-forms" role="group" aria-label="Choose a form">' + F.ranked.map(function(f){
        var on = p.form === f.id, top = f.score === F.top && F.top > 0;
        return '<button type="button" class="cm-form' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-form="' + f.id + '" data-k="' + pre + "fm" + f.id + '"><span class="cm-fn">' + f.t + (top ? ' <span class="cm-top">Top fit</span>' : "") + "</span>" +
          '<span class="cm-meter" aria-hidden="true"><i style="width:' + Math.round(f.score / maxS * 100) + '%"></i></span><span class="cm-fs">' + f.score + " point" + (f.score === 1 ? "" : "s") + "</span></button>";
      }).join("") + "</div>";
    });
    var notTop = !!p.form && byId(F.list, p.form).score < F.top;
    el("whyw").hidden = !notTop;
  }
  // ----- builders -----
  function paintTabs(){
    var t = el("tabs"); if (o.task) { t.innerHTML = ""; return; }
    radios(t, { label:"Open builder", options:X.forms.map(function(f){ return { id:f.id, t:f.short }; }), value:openForm(), key:pre + "tab", onChange:function(v){ if (demo) demo._open = v; else { S().open = v; save(); } fx = {}; paintBuild(); live(); } });
  }
  function paintBuild(){
    var box = el("build"), f = openForm();
    MV.keepFocus(box, function(){ box.innerHTML = !f ? '<p class="muted">Choose a form above to open its builder.</p>' : f === "poster" ? posterHTML() : f === "podcast" ? podHTML() : f === "psa" ? psaHTML() : socHTML(); });
    if (f === "poster") { paintGrid(); posterCtl(); }
  }
  // poster
  function posterHTML(){ return '<div class="cm-pb"><div class="cm-pgw"><div id="' + id("pgrid") + '"></div><p class="tiny muted">Choose an element, then tap a cell (or move with the arrow keys and press Enter).</p></div><div class="cm-pctl"><div id="' + id("pel") + '"></div><div id="' + id("pedit") + '"></div></div></div><p class="cm-note" id="' + id("m4") + '" hidden></p>'; }
  function elContent(eid, e){
    if (eid === "visual") return e.photo && PHOTO && !demo ? '<img class="cm-photo" src="' + PHOTO + '" alt="">' : (e.icon ? icon(e.icon) : '<span class="cm-ph">Visual</span>') + (e.text.trim() ? '<span class="cm-vt">' + esc(e.text) + "</span>" : "");
    var lab = byId(X.els, eid).t; return e.text.trim() ? esc(e.text) : '<span class="cm-ph">' + lab + "</span>";
  }
  function pt(c){ return [((c - 1) % 3) * 100 + 50, rowOf(c) * 100 + 50]; }
  function paintGrid(){
    var g = el("pgrid"); if (!g) return;
    var p = P(), PO = p.poster, info = posterInfo(p), selT = byId(X.els, sel).t, h = '<div class="cm-poster' + (fx.draw && !MV.reduceMotion ? " cm-drawn" : "") + '" role="group" aria-label="Poster grid, three by three cells">';
    for (var c = 1; c <= 9; c++) {
      var here = X.els.filter(function(e){ return has(cellsOf(PO[e.id]), c); }).map(function(e){ return e.t; });
      h += '<button type="button" class="cm-cell" style="grid-row:' + (rowOf(c) + 1) + ";grid-column:" + ((c - 1) % 3 + 1) + '" data-cell="' + c + '" data-k="' + pre + "c" + c + '" tabindex="' + (c === focusCell ? 0 : -1) + '" aria-label="Cell ' + c + ": " + (here.length ? esc(here.join(", ")) : "empty") + ". Place the " + esc(selT.toLowerCase()) + ' here."><span class="cm-cn" aria-hidden="true">' + c + "</span></button>";
    }
    X.els.forEach(function(e){ var x = PO[e.id]; if (!x.cell) return; var cs = cellsOf(x);
      h += '<div class="cm-el cm-e-' + e.id + " s" + x.size + " c" + x.con + (sel === e.id ? " sel" : "") + '" style="grid-row:' + (rowOf(cs[0]) + 1) + ";grid-column:" + ((cs[0] - 1) % 3 + 1) + " / span " + cs.length + '" aria-hidden="true">' + elContent(e.id, x) + "</div>"; });
    var pts = info.z ? [1, 3, 5, 7, 9].map(pt) : info.hier.map(function(e){ return pt(cellsOf(PO[e.id])[0]); });
    if (pts.length > 1) h += '<svg class="cm-eye' + (info.z ? " z" : "") + '" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true" focusable="false"><polyline pathLength="100" points="' + pts.map(function(q){ return q.join(","); }).join(" ") + '"/></svg>';
    MV.keepFocus(g, function(){ g.innerHTML = h + "</div>"; });
    if (fx.draw && !MV.reduceMotion) { var pl = $(".cm-eye polyline", g); if (pl) { pl.getBoundingClientRect(); requestAnimationFrame(function(){ requestAnimationFrame(function(){ var poster = $(".cm-poster", g); if (poster) poster.classList.remove("cm-drawn"); }); }); } }
    var m4 = el("m4"); if (m4) { var V = PO.visual, words = MV.eng.norm(PO.headline.text + " " + PO.body.text).split(" "); m4.hidden = !(V.cell && V.icon && has(words, V.icon)); m4.textContent = X.notes.m4; }
  }
  function posterCtl(){
    radios(el("pel"), { label:"Element", cls:"chips", options:X.els, value:sel, key:pre + "pel", onChange:function(v){ sel = v; paintGrid(); paintEdit(); } });
    paintEdit();
  }
  function paintEdit(){
    var box = el("pedit"), e = P().poster[sel], lab = byId(X.els, sel).t;
    var tl = { headline:"Headline text (8 words or fewer)", body:"Body text (25 words or fewer)", cta:"Call to action", logo:"Logo or credit line", visual:"Describe the visual (optional)" }[sel];
    var h = '<div class="cm-pe"><p class="cm-pe-h"><strong>' + lab + "</strong> · " + (e.cell ? "in cell " + cellsOf(e).join("–") : "not on the poster yet") + "</p>" +
      '<div id="' + id("psz") + '"></div><div id="' + id("pcn") + '"></div>';
    if (sel === "visual") h += '<div class="cm-icons" role="group" aria-label="Built-in icons">' + X.icons.map(function(ic){ return '<button type="button" class="cm-icb" data-icon="' + ic.id + '" data-k="' + pre + "ic" + ic.id + '" aria-pressed="' + (e.icon === ic.id && !e.photo) + '" aria-label="' + ic.t + ' icon">' + icon(ic.id) + "</button>"; }).join("") + "</div>" +
      (demo ? "" : '<div class="jq cm-photo-in"><label for="' + id("photo") + '">Or use your own photo (kept on this device, 2 MB at most)</label><input id="' + id("photo") + '" type="file" accept="image/*" data-photo="1">' + (e.photo ? ' <button type="button" class="btn ghost sm" data-unphoto="1">Remove my photo</button>' : "") + '<span class="tiny muted" id="' + id("photost") + '" aria-live="polite"></span></div>');
    h += '<div class="jq"><label for="' + id("pt") + '">' + tl + '</label><input id="' + id("pt") + '" class="txtin" type="text" autocomplete="off" data-pt="1" data-k="' + pre + "pt" + sel + '" value="' + esc(e.text) + '"><span class="tiny muted" data-count="pt"></span></div>' +
      '<label class="cm-km"><input type="checkbox" data-km="poster:' + sel + '" data-k="' + pre + "km" + sel + '"' + (e.km ? " checked" : "") + "> Key message here</label> " +
      (e.cell ? '<button type="button" class="btn ghost sm" data-unplace="1" data-k="' + pre + 'unpl">Take it off the poster</button>' : "") + "</div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    radios(el("psz"), { label:"Size", options:[{ id:"S", t:"S" }, { id:"M", t:"M" }, { id:"L", t:"L" }], value:e.size, key:pre + "sz", onChange:function(v){ P().poster[sel].size = v; save(); paintGrid(); live(); } });
    radios(el("pcn"), { label:"Contrast", options:[{ id:"low", t:"low" }, { id:"high", t:"high" }], value:e.con, key:pre + "cn", onChange:function(v){ P().poster[sel].con = v; save(); paintGrid(); live(); } });
  }
  // podcast
  function podHTML(){
    var p = P();
    return '<p class="cm-note">' + X.notes.ear + '</p><div class="cm-pod">' + X.blocks.map(function(b){
      return '<details class="cm-blk" open><summary>' + b.t + '</summary><label class="vh" for="' + id("pd-" + b.id) + '">' + b.t + '</label><textarea id="' + id("pd-" + b.id) + '" class="cm-ta" rows="' + (b.seg ? 4 : 2) + '" data-pod="' + b.id + '" data-k="' + pre + "pd" + b.id + '">' + esc(p.podcast[b.id]) + "</textarea>" +
        '<label class="cm-km"><input type="checkbox" data-km="podcast:' + b.id + '" data-k="' + pre + "kmp" + b.id + '"' + (p.podKm[b.id] ? " checked" : "") + "> Key message here</label></details>";
    }).join("") + '</div><p class="q-actions"><button type="button" class="btn ghost sm" data-podsay="1"' + (VOICE ? "" : " hidden") + ">Read my script aloud</button>" + (fx.p2 ? '<button type="button" class="btn ghost sm" data-p2say="1"' + (VOICE ? "" : " hidden") + ">Hear both versions</button>" : "") +
      '<button type="button" class="btn ghost sm" data-saystop="1"' + (VOICE ? "" : " hidden") + '>Stop</button><span class="tiny muted"' + (VOICE ? " hidden" : "") + ">No local voice on this device: read your script aloud yourself.</span></p>";
  }
  // storyboard
  function opts(list, v){ return list.map(function(x){ return '<option value="' + x.id + '"' + (x.id === v ? " selected" : "") + ">" + x.t + "</option>"; }).join(""); }
  function psaHTML(){
    var L = P().psa;
    return '<p class="cm-note">' + X.notes.m6 + '</p><ol class="cm-panels">' + L.map(function(x, i){
      var k = pre + "p" + i;
      return '<li class="cm-panel' + (fx.p3 && i === 4 ? " hl" : "") + '"><div role="group" aria-label="' + esc(panelSentence(x, i)) + '"><div class="cm-ph-row"><strong>Panel ' + (i + 1) + '</strong><span class="cm-pbtns">' +
        '<button type="button" class="btn ghost sm" data-pmv="' + i + ':-1" data-k="' + k + 'up"' + (i ? "" : " disabled") + ">Move up</button>" +
        '<button type="button" class="btn ghost sm" data-pmv="' + i + ':1" data-k="' + k + 'dn"' + (i < L.length - 1 ? "" : " disabled") + ">Move down</button>" +
        '<button type="button" class="btn ghost sm" data-prm="' + i + '" data-k="' + k + 'rm"' + (L.length > 6 ? "" : " disabled") + ">Remove</button></span></div>" +
        '<div class="cm-pbody"><div class="cm-skw">' + sketch(x) + "</div><div class=\"cm-pf\">" +
        '<label>Shot <select data-ps="' + i + ':shot" data-k="' + k + 'shot"><option value="">Choose…</option>' + opts(X.shots, x.shot) + "</select></label>" +
        '<label>Angle <select data-ps="' + i + ':angle" data-k="' + k + 'angle">' + opts(X.angles, x.angle) + "</select></label>" +
        '<label>Movement <select data-ps="' + i + ':move" data-k="' + k + 'move">' + opts(X.moves, x.move) + "</select></label>" +
        '<label>Duration (s) <input type="number" min="1" max="10" step="1" inputmode="numeric" class="cm-num" data-pf="' + i + ':dur" data-k="' + k + 'dur" value="' + esc(x.dur) + '"></label>' +
        '<label class="cm-wide">Visual <input type="text" class="txtin" autocomplete="off" data-pf="' + i + ':vis" data-k="' + k + 'vis" value="' + esc(x.vis) + '"></label>' +
        '<label class="cm-wide">Audio (dialogue, music, sound effect) <input type="text" class="txtin" autocomplete="off" data-pf="' + i + ':audio" data-k="' + k + 'au" value="' + esc(x.audio) + '"></label>' +
        '<label class="cm-wide">On-screen text <input type="text" class="txtin" autocomplete="off" data-pf="' + i + ':text" data-k="' + k + 'tx" value="' + esc(x.text) + '"></label>' +
        '<label class="cm-km"><input type="checkbox" data-km="psa:' + i + '" data-k="' + k + 'km"' + (x.km ? " checked" : "") + "> Key message here</label></div></div>" +
        (fx.p3 === 2 && i === 4 ? '<p class="cm-margin">' + X.notes.p3 + "</p>" : "") + "</div></li>";
    }).join("") + '</ol><p class="q-actions"><button type="button" class="btn ghost sm" data-padd="1" data-k="' + pre + 'padd"' + (L.length < 10 ? "" : " disabled") + '>Add a panel</button><span class="tiny muted">6–10 panels</span></p>';
  }
  // social
  function socHTML(){
    var L = P().social;
    return '<div class="cm-posts">' + L.map(function(x, i){
      var k = pre + "s" + i;
      return '<article class="cm-post"><h5>' + X.posts[i].t + "</h5>" +
        '<div class="jq"><label for="' + id("sc" + i) + '">Caption (280 characters or fewer)</label><textarea id="' + id("sc" + i) + '" class="cm-ta" rows="3" data-so="' + i + ':cap" data-k="' + k + 'cap">' + esc(x.cap) + '</textarea><span class="tiny muted" data-count="cap' + i + '"></span></div>' +
        '<div class="jq"><label for="' + id("sa" + i) + '">Alt text</label><textarea id="' + id("sa" + i) + '" class="cm-ta" rows="2" data-so="' + i + ':alt" data-k="' + k + 'alt">' + esc(x.alt) + '</textarea><span class="tiny muted" data-count="alt' + i + '"></span></div>' +
        '<div class="jq"><label for="' + id("sh" + i) + '">Hashtags</label><input id="' + id("sh" + i) + '" class="txtin" type="text" autocomplete="off" data-so="' + i + ':tags" data-k="' + k + 'tags" value="' + esc(x.tags) + '"></div>' +
        '<div class="jq"><label for="' + id("st" + i) + '">Posting time</label><input id="' + id("st" + i) + '" class="txtin" type="text" autocomplete="off" placeholder="e.g. Wed 12:15 p.m." data-so="' + i + ':time" data-k="' + k + 'time" value="' + esc(x.time) + '"></div>' +
        '<label class="cm-km"><input type="checkbox" data-km="social:' + i + '" data-k="' + k + 'km"' + (x.km ? " checked" : "") + "> Key message here</label></article>";
    }).join("") + "</div>";
  }
  // ----- readouts -----
  function readout(){
    var p = P(), R = X.readout, rows = [], bc = briefCheck(p), F = fitScores(p), f = openForm();
    rows.push([R.brief, bc.ok ? "Complete: audience, purpose, " + bc.nm + "-word message, action" : "Missing: " + bc.miss.join(", ")]);
    rows.push([R.fit, F.ranked.map(function(x){ return x.short + " " + x.score; }).join(" · ") + (p.form ? '<br><span class="tiny">Your form: ' + byId(X.forms, p.form).t + (byId(F.list, p.form).score < F.top ? (p.why.trim() ? " (justified)" : " (not top-ranked: say why above)") : "") + "</span>" : "")]);
    if (f === "poster") {
      var I = posterInfo(p), PO = p.poster;
      rows.push([R.hier, I.hier.length ? '<ol class="cm-hl">' + I.hier.map(function(e, k){ var x = PO[e.id]; return "<li>" + (k + 1) + ". " + e.t + (k === 0 ? " (" + x.size + ", " + x.con + ")" : "") + "</li>"; }).join("") + "</ol>" : "Place elements on the grid."]);
      rows.push([R.path, I.z ? "Z-pattern: top-left → top-right → centre → bottom" : I.placed.length ? "Scattered" : "—"]);
    } else if (f === "podcast") {
      var Q = podInfo(p); rows.push([R.run, fmtTime(Q.secs) + " (" + Q.words + " words at 150 wpm)"]); rows.push([R.listen, "Average sentence: " + Q.avg + " words · Signposts: " + Q.sign]);
    } else if (f === "psa") {
      var Z = psaInfo(p); rows.push([R.total, Z.total + " s across " + Z.n + " panels"]); rows.push([R.variety, Z.variety + " different shot type" + (Z.variety === 1 ? "" : "s")]);
    } else if (f === "social") {
      rows.push([R.acc, "Alt text: " + p.social.filter(function(x){ return wc(x.alt); }).length + " of 3 posts · Captions: n/a"]);
    }
    if (f) { var K = kmPlaces(p, f); rows.push([R.km, K.length ? K.map(function(k){ return k.t; }).join("; ") : "Not tagged yet: tick “Key message here” where it appears."]); }
    var h = MV.readoutHTML(rows);
    if (!o.task && bc.ok && p.form) h += '<p class="cm-aha">' + X.aha + "</p>";
    return h;
  }
  function counters(){
    var p = P(), b = p.brief;
    $$("[data-count]", host).forEach(function(s){
      var k = s.dataset.count, n;
      if (k === "belief") { n = wc(b.belief); s.textContent = n + " word" + (n === 1 ? "" : "s") + (n >= 5 ? " ✓" : " (at least 5)"); }
      else if (k === "msg") { n = wc(b.msg); s.textContent = n + " word" + (n === 1 ? "" : "s") + (n >= 1 && n <= 12 ? " ✓" : n > 12 ? " (cut to 12 or fewer)" : ""); }
      else if (k === "pt") { n = wc(p.poster[sel].text); var mx = sel === "headline" ? 8 : sel === "body" ? 25 : 0; s.textContent = mx ? n + " of " + mx + " words" + (n > mx ? " (too many)" : "") : ""; }
      else if (/^cap\d/.test(k)) { var c = p.social[+k.slice(3)].cap.length; s.textContent = c + " of 280 characters" + (c > 280 ? " (too long)" : ""); }
      else if (/^alt\d/.test(k)) { n = wc(p.social[+k.slice(3)].alt); s.textContent = n + " word" + (n === 1 ? "" : "s"); }
    });
  }
  function convBox(){
    var c = el("conv"); if (!c) return; var f = P().form, T = MV.C.task.conv[f];
    c.innerHTML = T ? '<p class="cm-conv-h"><strong>Conventions for your ' + esc(T.name.toLowerCase()) + "</strong></p><p class=\"tiny\">" + T.need + "</p>" : '<p class="tiny muted">Choose a form to see its conventions.</p>';
  }
  function live(){
    counters(); paintForms();
    var r = el("read"); if (r) r.innerHTML = readout();
    if (openForm() === "poster" && el("pgrid")) paintGrid();
    convBox();
    if (!demo && o.onChange) o.onChange();
  }
  function paint(){
    var d = el("demo");
    if (d) { d.hidden = !demo; d.innerHTML = demo ? '<p><strong>Sample project for this prediction.</strong> Your own project is safe and comes back when you press the button.</p><button type="button" class="btn primary sm" data-exitdemo="1">Back to my project</button>' : ""; }
    paintBrief(); el("why").value = P().why || ""; paintTabs(); paintBuild(); live();
  }

  // ----- events -----
  host.addEventListener("input", function(e){
    var t = e.target, p = P(), d = t.dataset;
    if (d.bf) { p.brief[d.bf] = t.value; }
    else if (d.why) { p.why = t.value; }
    else if (d.pt) { p.poster[sel].text = t.value; }
    else if (d.pod) { p.podcast[d.pod] = t.value; }
    else if (d.pf) { var q = d.pf.split(":"), x = p.psa[+q[0]]; if (!x) return; if (q[1] === "dur") { var v = parseInt(t.value, 10); x.dur = isNaN(v) ? "" : v; } else x[q[1]] = t.value; var g = t.closest("[role=group]"); if (g) g.setAttribute("aria-label", panelSentence(x, +q[0])); }
    else if (d.so) { var r = d.so.split(":"); p.social[+r[0]][r[1]] = t.value; }
    else return;
    save(); live(); MV.changed();
  });
  host.addEventListener("change", function(e){
    var t = e.target, p = P(), d = t.dataset;
    if (d.km) { var k = d.km.split(":"); if (k[0] === "poster") p.poster[k[1]].km = t.checked; else if (k[0] === "podcast") p.podKm[k[1]] = t.checked; else if (k[0] === "psa") p.psa[+k[1]].km = t.checked; else p.social[+k[1]].km = t.checked; save(); live(); MV.changed(); return; }
    if (d.ps) { var q = d.ps.split(":"); p.psa[+q[0]][q[1]] = t.value; save(); paintBuild(); live(); MV.changed(); return; }
    if (d.photo) {
      var f = t.files && t.files[0], st = el("photost"); if (!f) return;
      if (f.size > 2 * 1024 * 1024) { if (st) st.textContent = "That photo is over 2 MB. Choose a smaller one."; t.value = ""; return; }
      var fr = new FileReader(); fr.onload = function(){ PHOTO = fr.result; photoSave(PHOTO); var V = proj().poster.visual; V.photo = true; save(); paintGrid(); paintEdit(); live(); var s2 = el("photost"); if (s2) s2.textContent = "Photo added. It stays on this device."; };
      fr.readAsDataURL(f);
    }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.disabled) return;
    var p = P(), d = b.dataset;
    if (d.exitdemo) { exitDemo(); return; }
    if (d.form) { p.form = d.form; if (!o.task && !demo) S().open = d.form; else if (demo) demo._open = d.form; save(); paintForms(); paintTabs(); paintBuild(); live(); MV.changed(); return; }
    if (d.cell) { var c = +d.cell; focusCell = c; p.poster[sel].cell = c; save(); paintGrid(); paintEdit(); live(); MV.changed(); return; }
    if (d.icon) { p.poster.visual.icon = d.icon; p.poster.visual.photo = false; save(); paintGrid(); paintEdit(); live(); return; }
    if (d.unphoto) { p.poster.visual.photo = false; PHOTO = null; photoSave(null); save(); paintGrid(); paintEdit(); live(); return; }
    if (d.unplace) { p.poster[sel].cell = 0; save(); paintGrid(); paintEdit(); live(); MV.changed(); return; }
    if (d.pmv) { var m = d.pmv.split(":"), i = +m[0], j = i + (+m[1]); if (j < 0 || j >= p.psa.length) return; var tmp = p.psa[i]; p.psa[i] = p.psa[j]; p.psa[j] = tmp; save(); paintBuild(); var nb = $('[data-k="' + pre + "p" + j + (+m[1] < 0 ? "up" : "dn") + '"]', host); if (nb && !nb.disabled) nb.focus(); else { nb = $('[data-k="' + pre + "p" + j + 'shot"]', host); if (nb) nb.focus(); } live(); MV.changed(); return; }
    if (d.prm) { if (p.psa.length <= 6) return; p.psa.splice(+d.prm, 1); save(); paintBuild(); live(); MV.changed(); return; }
    if (d.padd) { if (p.psa.length >= 10) return; p.psa.push(blankPanel()); save(); paintBuild(); live(); MV.changed(); var na = $('[data-k="' + pre + "p" + (p.psa.length - 1) + 'shot"]', host); if (na) na.focus(); return; }
    if (d.podsay) { MV.eng.stop(); sayAll(X.blocks.filter(function(k){ return k.id !== "music" && wc(p.podcast[k.id]); }).map(function(k){ return p.podcast[k.id]; })); return; }
    if (d.p2say) { MV.eng.stop(); sayAll([X.demos.p2.podcast.s1, X.demos.p2after]); return; }
    if (d.saystop) { MV.eng.stop(); return; }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest && e.target.closest("[data-cell]"); if (!b) return;
    var c = +b.dataset.cell, col = (c - 1) % 3, row = rowOf(c), n = c;
    if (e.key === "ArrowRight" && col < 2) n = c + 1; else if (e.key === "ArrowLeft" && col > 0) n = c - 1; else if (e.key === "ArrowDown" && row < 2) n = c + 3; else if (e.key === "ArrowUp" && row > 0) n = c - 3; else return;
    e.preventDefault(); focusCell = n;
    $$("[data-cell]", host).forEach(function(x){ x.tabIndex = +x.dataset.cell === n ? 0 : -1; });
    var nb = $('[data-cell="' + n + '"]', host); if (nb) nb.focus();
  });

  // ----- demos for the predictions -----
  function startDemo(pid){
    var D = X.demos[pid], p = blankProj();
    if (D.brief) Object.assign(p.brief, D.brief);
    if (D.poster) Object.keys(D.poster).forEach(function(k){ Object.assign(p.poster[k], D.poster[k]); });
    if (D.podcast) Object.assign(p.podcast, D.podcast);
    if (D.psa) p.psa = clone(D.psa);
    if (D.social) p.social = clone(D.social).map(function(x){ x.km = false; return x; });
    p._open = D.open; p.form = D.open; demo = p; fx = {}; if (pid === "p3") fx.p3 = 1;
    if (D.open === "poster") sel = "headline";
    paint();
  }
  function runDemo(pid, done){
    var me = demo;
    function alive(){ return demo && demo === me; }
    function step(ms, fn){ MV.wait(ms, function(){ if (!alive()) { done(); return; } fn(); }); }
    if (!alive()) { done(); return; }
    if (pid === "p1") step(300, function(){ var Q = demo.poster, h = Q.headline.cell; Q.headline.cell = Q.cta.cell; Q.cta.cell = h; fx.draw = true; paintGrid(); paintEdit(); live(); step(1700, function(){ fx.draw = false; done(); }); });
    else if (pid === "p2") step(300, function(){ demo.podcast.s1 = X.demos.p2after; fx.p2 = true; paintBuild(); live(); var r = el("read"); if (r) { r.classList.add("cm-flash"); MV.wait(900, function(){ r.classList.remove("cm-flash"); }); } step(1200, done); });
    else if (pid === "p3") step(300, function(){ Object.assign(demo.psa[4], X.demos.p3after); fx.p3 = 2; paintBuild(); live(); step(1500, done); });
    else if (pid === "p4") { var k = 0; (function next(){ step(k ? 450 : 300, function(){ demo.social[k].alt = X.demos.p4alt[k]; k++; paintBuild(); live(); if (k < 3) next(); else step(700, done); }); })(); }
    else done();
  }
  function exitDemo(){ if (!demo) return; demo = null; fx = {}; paint(); MV.banner("", ""); }
  function setup(kind){
    exitDemo();
    if (kind !== "brief") { S().open = kind; save(); paintTabs(); paintBuild(); live(); }
    var t = kind === "brief" ? el("brief") : $("[data-mv=graph]", host); if (t) t.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }
  paint();
  return { paint:function(){ if (!demo) paint(); }, startDemo:startDemo, runDemo:runDemo, exitDemo:exitDemo, setup:setup, stopFx:function(){ MV.eng.stop(); } };
}

// ---------- hero: Coleridge's sentence → four tiles that shuffle and return → poster grid, storyboard strip, waveform ----------
var HR = { run:0 };
function hero(){
  var H = MV.C.hero, host = $("#cm-hero"); if (!host) return;
  var W = H.quote.split(" "), lift = W.length - 7;   // "the best words in the best order."
  var bars = ""; for (var i = 0; i < 46; i++) { var hh = 6 + Math.round(Math.abs(Math.sin(i * 1.7) * 18 + Math.sin(i * 0.45) * 10)); bars += '<rect x="' + (i * 6.5 + 2) + '" y="' + (40 - hh / 2) + '" width="4" height="' + hh + '" rx="2"/>'; }
  var strip = ["el", "l", "m", "cu", "ecu", "m"].map(function(s){ return '<span class="cm-sf">' + sketch({ shot:s, vis:s === "ecu" ? "thumb" : "" }) + "</span>"; }).join("");
  host.innerHTML = '<blockquote class="cm-hq">' + W.map(function(w, k){ return '<span class="cm-w' + (k >= lift ? " cm-lw" : "") + '" data-w="' + k + '">' + esc(w) + "</span>"; }).join(" ") + '</blockquote><p class="eng-cite">' + H.cite + "</p>" +
    '<div class="cm-stage" aria-hidden="true"><div class="cm-tiles">' + H.tiles.map(function(t, k){ return '<span class="cm-tile" data-t="' + k + '">' + esc(t) + "</span>"; }).join("") + "</div>" +
    '<div class="cm-media"><div class="cm-m cm-mp"><span class="cm-mp-h">Headline</span>' + icon("star", "cm-mp-i") + '<span class="cm-mp-c">Call to action</span></div><div class="cm-m cm-ms">' + strip + '</div>' +
    '<div class="cm-m cm-mw"><svg viewBox="0 0 300 80" focusable="false"><g class="cm-wb">' + bars + '</g><path class="cm-wo" d="M2 6h62"/><text class="cm-wt" x="4" y="76">COLD OPEN</text></svg></div></div></div>' +
    '<p class="cm-hcap">' + H.caption + '</p><div class="cm-hctl"><button type="button" class="btn ghost sm" id="cm-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="cm-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="cm-hnote" hidden>' + H.noVoice + "</span></div>";
  var WS = $$(".cm-w", host), TL = $$(".cm-tile", host), WMAP = []; W.forEach(function(w, k){ if (/[A-Za-z0-9]/.test(w)) WMAP.push(k); });
  function lit(n){ WS.forEach(function(e, k){ e.classList.toggle("lit", k <= n); e.classList.toggle("speaking", k === n); }); }
  function phase(c){ host.className = "cm-hero " + c; }
  function shuffle(on){
    if (!on || MV.reduceMotion) { TL.forEach(function(t){ t.style.transform = ""; }); return; }
    var order = [2, 0, 3, 1], xs = TL.map(function(t){ return t.offsetLeft; }), ws = TL.map(function(t){ return t.offsetWidth; }), gap = 8, x0 = Math.min.apply(null, xs), x = x0, target = [];
    order.forEach(function(k){ target[k] = x; x += ws[k] + gap; });
    TL.forEach(function(t, k){ t.style.transform = "translateX(" + (target[k] - xs[k]) + "px)"; });
  }
  function finish(){ HR.run++; shuffle(false); lit(W.length - 1); WS.forEach(function(e){ e.classList.remove("speaking"); }); phase("p-final"); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function after(me, t0){
    at(me, t0, function(){ phase("p-lift"); });
    at(me, t0 + 500, function(){ phase("p-tiles"); });
    at(me, t0 + 1200, function(){ shuffle(true); });
    at(me, t0 + 2100, function(){ shuffle(false); });
    at(me, t0 + 2900, function(){ phase("p-poster"); });
    at(me, t0 + 3800, function(){ phase("p-strip"); });
    at(me, t0 + 4700, function(){ phase("p-wave"); });
    at(me, t0 + 5700, finish);
  }
  function animate(){ MV.eng.stop(); var me = ++HR.run; phase("p-words"); lit(-1); W.forEach(function(_, k){ at(me, 150 + k * 85, function(){ lit(k); }); }); after(me, 150 + W.length * 85 + 200); }
  function listen(){
    MV.eng.stop(); var me = ++HR.run; phase(MV.reduceMotion ? "p-final" : "p-words"); lit(-1);
    MV.eng.say(H.quote, { voice:VOICE, onWord:function(k){ if (me === HR.run && WMAP[k] != null) lit(WMAP[k]); }, onEnd:function(){ if (me !== HR.run) return; lit(W.length - 1); if (MV.reduceMotion) finish(); else after(me, 200); } });
  }
  function btns(){ $("#cm-hlisten").hidden = !VOICE; $("#cm-hagain").hidden = !!MV.reduceMotion; $("#cm-hnote").hidden = !!VOICE; }
  $("#cm-hlisten").addEventListener("click", listen);
  $("#cm-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ if (!host.classList.contains("p-final")) finish(); };
}
function wordStory(){
  var b = $("#cm-ws-say"), n = $("#cm-ws-note"); if (!b) return;
  voiceReady(function(){ b.hidden = !VOICE; n.hidden = !!VOICE; });
  b.addEventListener("click", function(){ var blk = b.closest(".mv-block"); MV.eng.stop(); sayAll($$("p", blk).filter(function(p){ return !p.classList.contains("q-actions"); }).map(function(p){ return p.textContent; })); });
}

// ---------- Explore ----------
var EX = null, XS = null;
function explore(host, api){
  var S = api.S; S.proj = normProj(S.proj || blankProj()); NORMED = true; S.open = S.open || "";
  XS = studio(host, { pre:"x", onChange:function(){} });
  photoLoad(function(){ if (proj().poster.visual.photo) XS.paint(); });
  document.addEventListener("click", function(e){ var b = e.target.closest(".cm-setup"); if (b) XS.setup(b.dataset.setup); });
  function msg(id, k){ return byId(api.content.challenges, id).msgs[k]; }
  function tc1(p){
    var c = briefCheck(p);
    if (c.crowd) return { ok:false, msg:msg("tc1", "everyone") };
    if (c.nm > 12) return { ok:false, msg:msg("tc1", "long") };
    if (!p.brief.action.trim()) return { ok:false, msg:msg("tc1", "action") };
    return c.ok ? { ok:true } : { ok:false };
  }
  function tc2(p){
    var Q = p.poster, h = Q.headline, v = Q.visual, c = Q.cta, l = Q.logo, b = Q.body;
    if (!h.cell || !v.cell || !c.cell || !l.cell) return { ok:false, msg:msg("tc2", "unplaced") };
    if (rowOf(h.cell) === 1) return { ok:false, msg:msg("tc2", "mid") };
    if (rowOf(c.cell) === 0) return { ok:false, msg:msg("tc2", "top") };
    if (SZ[l.size] >= SZ[h.size]) return { ok:false, msg:msg("tc2", "logo") };
    var ok = rowOf(h.cell) === 0 && h.size === "L" && has(cellsOf(v), 5) && rowOf(c.cell) === 2 && (c.size === "M" || c.size === "L") &&
      rowOf(l.cell) === 2 && !cellsOf(l).some(function(x){ return has(cellsOf(c), x); }) && (!b.cell || b.size === "S");
    return { ok:ok };
  }
  function tc3(p){
    var L = p.psa, I = psaInfo(p);
    if (L.length !== 6) return { ok:false, msg:msg("tc3", "six") };
    if (L.some(function(x){ return !x.shot; })) return { ok:false, msg:msg("tc3", "shot") };
    if (L.some(function(x){ var d = +x.dur; return x.dur === "" || !(d >= 1 && d <= 8 && Math.round(d) === d); })) return { ok:false, msg:msg("tc3", "dur") };
    if (I.total === 29 || I.total === 31) return { ok:false, msg:msg("tc3", "off") };
    if (I.total !== 30) return { ok:false, msg:msg("tc3", "sum").replace("{t}", I.total + " s") };
    if (I.variety < 3) return { ok:false, msg:msg("tc3", "variety") };
    for (var i = 1; i < 6; i++) if (L[i].shot === L[i - 1].shot) return { ok:false, msg:msg("tc3", "repeat") };
    if (!has(["cu", "ecu"], L[3].shot) && !has(["cu", "ecu"], L[4].shot)) return { ok:false, msg:msg("tc3", "turn") };
    var last = L[5]; if (!(last.km && (last.text.trim() || last.audio.trim()))) return { ok:false, msg:msg("tc3", "end") };
    return { ok:true };
  }
  EX = {
    shown:function(){ XS.paint(); },
    stop:function(){ XS.stopFx(); },
    predict:{ start:function(p){ XS.startDemo(p.id); }, run:function(p, done){ XS.runDemo(p.id, done); } },
    challenge:function(id, o){ if (!(o && o.live)) XS.exitDemo(); var p = proj(); return id === "tc1" ? tc1(p) : id === "tc2" ? tc2(p) : id === "tc3" ? tc3(p) : { ok:false }; }
  };
  return EX;
}

// ---------- Part 3: Test with an audience — question bank, tester log with a message-match check, revisions with evidence
// and a Craft → meaning panel (before/after with the tester quotation). ----------
var P3 = null;
function p3S(){ var S = MV.S.app.part3 || (MV.S.app.part3 = {}); S.q = S.q || {}; S.testers = Array.isArray(S.testers) ? S.testers : []; S.rev = Array.isArray(S.rev) && S.rev.length === 2 ? S.rev : [{ ev:"", part:"", note:"" }, { ev:"", part:"", note:"" }]; S.re = S.re || { t:"", sum:"" }; return S; }
function qText(kind){ var S = p3S(), Q = S.q[kind] || {}, C = MV.C.part3; if (Q.pick === "own") return tx(Q.own).trim() || "(your own question)"; var b = byId(C.bank[kind], Q.pick || ""); return b ? b.t : ""; }
function matchOf(sum){ var k = proj().brief.msg; if (!tx(sum).trim() || !tx(k).trim()) return null; return sharedWords(sum, k).length >= 2; }
function evidenceList(){
  var S = p3S(), out = [];
  S.testers.forEach(function(t, i){ var who = t.name.trim() || (S.self ? "Me, after 24 hours" : "Tester " + (i + 1)); MV.C.part3.kinds.forEach(function(k){ var a = tx(t.a && t.a[k.id]).trim(); if (a) out.push({ id:i + ":" + k.id, t:who + " (" + k.id + "): “" + a + "”" }); }); });
  return out;
}
function revs(){ var S = p3S(), E = evidenceList(); return S.rev.map(function(r){ var e = byId(E, r.ev); return { note:tx(r.note), ev:e ? e.t : "", part:r.part }; }); }
function part3(host, api){
  var C = api.content, S = p3S();
  host.innerHTML = '<div class="cm-p3"><section class="cm-st" id="cm-s1"></section><section class="cm-st" id="cm-s2"></section><section class="cm-st" id="cm-s3"></section></div>';
  function s1(){
    var box = $("#cm-s1", host);
    box.innerHTML = "<p>" + C.s1 + "</p>" + C.kinds.map(function(k){
      var Q = S.q[k.id] || {}, w = Q.pick && Q.pick !== "own" ? byId(C.bank[k.id], Q.pick) : null;
      return '<div class="cm-qk"><div id="cm-q-' + k.id + '"></div><div class="jq" ' + (Q.pick === "own" ? "" : "hidden ") + 'id="cm-qo-' + k.id + '"><label for="cm-qown-' + k.id + '">Your own ' + k.t.toLowerCase() + '</label><input id="cm-qown-' + k.id + '" class="txtin" type="text" autocomplete="off" data-qown="' + k.id + '" value="' + esc(Q.own || "") + '"></div>' +
        (w && w.weak ? '<p class="cm-flag" role="status"><span aria-hidden="true">⚑</span> ' + w.weak + (k.id === "purpose" ? " " + XC().notes.m7 : "") + "</p>" : "") + "</div>";
    }).join("");
    C.kinds.forEach(function(k){
      radios($("#cm-q-" + k.id, box), { label:k.t, cls:"chips", options:C.bank[k.id].concat([{ id:"own", t:"Write my own" }]), value:(S.q[k.id] || {}).pick || "", key:"q" + k.id, onChange:function(v){ S.q[k.id] = S.q[k.id] || {}; S.q[k.id].pick = v; api.save(); s1(); s2(); var f = $('#cm-q-' + k.id + ' [data-rg="' + v + '"]', box); if (f) f.focus(); } });
    });
  }
  function testerHTML(t, i){
    var who = S.self ? "Me, after 24 hours" : "Tester " + (i + 1), m = matchOf(t.a.purpose);
    return '<div class="cm-tester"><div class="cm-th"><strong>' + who + "</strong>" + (S.self ? "" : ' <label class="cm-tn">First name (optional) <input type="text" class="txtin" autocomplete="off" data-tname="' + i + '" data-k="tn' + i + '" value="' + esc(t.name) + '"></label>') +
      (S.self || S.testers.length <= 3 ? "" : '<button type="button" class="btn ghost sm" data-trm="' + i + '" data-k="trm' + i + '">Remove</button>') + "</div>" +
      C.kinds.map(function(k){ return '<div class="jq"><label for="cm-ta-' + i + k.id + '">' + esc(qText(k.id) || k.t) + (k.id === "purpose" ? ' <span class="tiny muted">(their one-sentence summary)</span>' : "") + '</label><input id="cm-ta-' + i + k.id + '" class="txtin" type="text" autocomplete="off" data-tans="' + i + ":" + k.id + '" data-k="ta' + i + k.id + '" value="' + esc(t.a[k.id] || "") + '"></div>'; }).join("") +
      '<p class="cm-match" data-match="' + i + '">' + matchHTML(m) + "</p></div>";
  }
  function matchHTML(m){ return m == null ? '<span class="muted">Message match: waiting for a summary' + (proj().brief.msg.trim() ? "" : " (write your key message in the Media studio first)") + "</span>" : m ? '<span class="cm-yes">✓ Match</span>' : '<span class="cm-no">✗ Miss</span>'; }
  function s2(){
    var box = $("#cm-s2", host);
    if (!S.testers.length) { for (var i = 0; i < 3; i++) S.testers.push({ name:"", a:{} }); }
    S.testers.forEach(function(t){ t.a = t.a || {}; t.name = t.name || ""; });
    MV.keepFocus(box, function(){
      box.innerHTML = "<p>" + C.s2 + '</p><p class="tiny muted">' + C.matchHow + '</p><label class="cm-self"><input type="checkbox" data-self="1"' + (S.self ? " checked" : "") + "> " + C.self + "</label>" +
        '<div class="cm-testers">' + (S.self ? testerHTML(S.testers[0], 0) : S.testers.map(testerHTML).join("")) + "</div>" +
        (S.self || S.testers.length >= 5 ? "" : '<p><button type="button" class="btn ghost sm" data-tadd="1" data-k="tadd">Add a tester</button> <span class="tiny muted">3–5 testers</span></p>') +
        '<div class="cm-tally" id="cm-tally" aria-live="polite"></div>';
    });
    tally();
  }
  function tally(){
    var el = $("#cm-tally", host); if (!el) return;
    var L = S.self ? S.testers.slice(0, 1) : S.testers, n = L.filter(function(t){ return tx(t.a.purpose).trim(); }).length, miss = L.filter(function(t){ return matchOf(t.a.purpose) === false; });
    el.innerHTML = "<p><strong>Message match:</strong> " + (n ? (n - miss.length) + " match, " + miss.length + " miss, out of " + n + " summar" + (n === 1 ? "y" : "ies") : "no summaries yet") + "</p>" +
      (miss.length ? '<p class="tiny">Most common miss: ' + miss.map(function(t){ return "“" + esc(t.a.purpose) + "”"; }).join(" · ") + "</p>" : "") + '<p class="tiny muted">' + C.caveat + "</p>";
  }
  function s3(){
    var box = $("#cm-s3", host), p = proj(), f = p.form, E = evidenceList(), PL = f ? parts(p, f) : [];
    var h = "<p>" + C.s3 + "</p>";
    if (!f) h += '<p class="muted">Choose a form and build your text in the Media studio first.</p>';
    else {
      h += '<p class="q-actions"><button type="button" class="btn ghost sm" data-snap="1" data-k="snap">' + (S.before ? "Replace my “before” copy with the text as it is now" : "Save a “before” copy of my text") + "</button>" + (S.before ? '<span class="tiny muted">“Before” copy saved (' + esc(byId(MV.C.explore.forms, S.before.form).short) + ").</span>" : "") + "</p>";
      h += S.rev.map(function(r, i){
        return '<div class="cm-rev"><h5>Revision ' + (i + 1) + '</h5><div class="jq"><label for="cm-rev-ev' + i + '">The logged response it answers</label><select id="cm-rev-ev' + i + '" data-rev="' + i + ':ev" data-k="rev' + i + 'ev"><option value="">Choose a response…</option>' + E.map(function(e){ return '<option value="' + esc(e.id) + '"' + (r.ev === e.id ? " selected" : "") + ">" + esc(e.t) + "</option>"; }).join("") + "</select></div>" +
          '<div class="jq"><label for="cm-rev-pt' + i + '">The part you changed</label><select id="cm-rev-pt' + i + '" data-rev="' + i + ':part" data-k="rev' + i + 'pt"><option value="">Choose a part…</option>' + PL.map(function(x){ return '<option value="' + x.id + '"' + (r.part === x.id ? " selected" : "") + ">" + esc(x.t) + "</option>"; }).join("") + "</select></div>" +
          '<div class="jq"><label for="cm-rev-n' + i + '">Revision note: what you changed, and why (15 words or more)</label><textarea id="cm-rev-n' + i + '" class="cm-ta" rows="2" data-revn="' + i + '">' + esc(r.note) + '</textarea><span class="tiny muted" data-revc="' + i + '"></span></div></div>';
      }).join("");
      h += '<div class="cm-craft" id="cm-craft" aria-live="polite"></div>';
      h += '<div class="cm-retest"><p>' + C.retest + '</p><div class="cm-row" id="cm-ret"></div><div class="jq"><label for="cm-resum">New one-sentence summary</label><input id="cm-resum" class="txtin" type="text" autocomplete="off" data-resum="1" value="' + esc(S.re.sum) + '"></div><p class="cm-match" id="cm-rematch"></p></div>';
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    if (f) {
      var opts = S.testers.map(function(t, i){ return { id:String(i), t:t.name.trim() || (S.self ? "Me" : "Tester " + (i + 1)) }; });
      radios($("#cm-ret", box), { label:"Tester", cls:"chips", options:opts, value:S.re.t, key:"ret", onChange:function(v){ S.re.t = v; api.save(); reMatch(); } });
      craft(); revCounts(); reMatch();
    }
  }
  function reMatch(){ var e = $("#cm-rematch", host); if (e) e.innerHTML = S.re.t !== "" && tx(S.re.sum).trim() ? matchHTML(matchOf(S.re.sum)) : ""; }
  function revCounts(){ $$("[data-revc]", host).forEach(function(s){ var n = wc(S.rev[+s.dataset.revc].note); s.textContent = n + " word" + (n === 1 ? "" : "s") + (n >= 15 ? " ✓" : " (15 or more)"); }); }
  function craft(){
    var el = $("#cm-craft", host); if (!el) return;
    var p = proj(), E = evidenceList(), cur = {}; parts(p, p.form).forEach(function(x){ cur[x.id] = x; });
    var rows = S.rev.map(function(r, i){
      if (!r.part) return "";
      var before = S.before && S.before.parts[r.part], now = cur[r.part], ev = byId(E, r.ev);
      if (!now) return "";
      var df = before != null ? diffWords(before, now.text) : null;
      return '<div class="cm-cm"><p class="cm-cm-q"><strong>Revision ' + (i + 1) + ", " + esc(now.t) + ":</strong> " + (ev ? esc(ev.t) : '<span class="muted">no logged response linked yet</span>') + "</p>" +
        (df ? '<div class="cm-cmp"><div><p class="tiny"><strong>Before</strong> (removed words struck through)</p><p>' + (df[0] || "<em>empty</em>") + '</p></div><div><p class="tiny"><strong>After</strong> (new words underlined)</p><p>' + (df[1] || "<em>empty</em>") + "</p></div></div>" : '<p class="tiny muted">Save a “before” copy first to see the change side by side.</p>') + "</div>";
    }).join("");
    el.innerHTML = rows ? "<h5>" + C.craft + "</h5>" + rows : "";
  }
  host.addEventListener("input", function(e){
    var t = e.target, d = t.dataset;
    if (d.qown) { S.q[d.qown] = S.q[d.qown] || {}; S.q[d.qown].own = t.value; api.save(); return; }
    if (d.tname != null) { S.testers[+d.tname].name = t.value; api.save(); return; }
    if (d.tans) { var q = d.tans.split(":"), T = S.testers[+q[0]]; T.a[q[1]] = t.value; api.save(); if (q[1] === "purpose") { var m = $('[data-match="' + q[0] + '"]', host); if (m) m.innerHTML = matchHTML(matchOf(t.value)); tally(); } return; }
    if (d.revn != null) { S.rev[+d.revn].note = t.value; api.save(); revCounts(); return; }
    if (d.resum) { S.re.sum = t.value; api.save(); reMatch(); }
  });
  host.addEventListener("change", function(e){
    var t = e.target, d = t.dataset;
    if (d.tans || d.tname != null) { s3(); return; }
    if (d.self) { S.self = t.checked; if (S.self && !S.testers.length) S.testers.push({ name:"", a:{} }); api.save(); s2(); s3(); return; }
    if (d.rev) { var q = d.rev.split(":"); S.rev[+q[0]][q[1]] = t.value; api.save(); craft(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.disabled) return;
    var d = b.dataset;
    if (d.tadd) { if (S.testers.length < 5) S.testers.push({ name:"", a:{} }); api.save(); s2(); s3(); return; }
    if (d.trm != null) { if (S.testers.length > 3) S.testers.splice(+d.trm, 1); api.save(); s2(); s3(); return; }
    if (d.snap) { var p = proj(), m = {}; parts(p, p.form).forEach(function(x){ m[x.id] = x.text; }); S.before = { form:p.form, parts:m }; api.save(); s3(); }
  });
  s1(); s2(); s3();
  P3 = { refresh:function(){ s1(); s2(); s3(); } };
  return P3;
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 09; numbered sentences) ----------
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Plan ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s plan</p><ol class=\"steps-list\">";
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

// ---------- word diff (from the E17 draftWorkspace, ENG4U 09) ----------
function diffWords(a, b){
  var A = tx(a).split(/\s+/).filter(Boolean), Bw = tx(b).split(/\s+/).filter(Boolean), n = A.length, m = Bw.length, L = [];
  for (var i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
  for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) L[i][j] = A[i] === Bw[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  var left = [], right = []; i = 0; j = 0;
  while (i < n && j < m) { if (A[i] === Bw[j]) { left.push(esc(A[i])); right.push(esc(Bw[j])); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { left.push("<del>" + esc(A[i]) + "</del>"); i++; } else { right.push("<ins>" + esc(Bw[j]) + "</ins>"); j++; } }
  while (i < n) left.push("<del>" + esc(A[i++]) + "</del>");
  while (j < m) right.push("<ins>" + esc(Bw[j++]) + "</ins>");
  return [left.join(" "), right.join(" ")];
}

// ---------- Performance task: Make it ----------
var TS = null;
var task = (function(){
  var api = null, T = null;
  function TA(){ return api ? api.S : MV.taskState().app; }
  function explainText(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function convCount(text, f){
    var L = MV.C.task.conv[f].list, t = " " + MV.eng.norm(tx(text).replace(/-/g, " ")) + " ";
    var hit = L.filter(function(c){ return t.indexOf(" " + MV.eng.norm(c.replace(/-/g, " ")) + " ") >= 0; });
    hit = hit.filter(function(c){ return !hit.some(function(o){ return o !== c && o.indexOf(c) >= 0; }); });
    return hit.length;
  }
  function data(){ var a = TA(); a.assets = Array.isArray(a.assets) ? a.assets : []; var p = proj(); return { p:p, form:p.form, assets:a.assets, revs:revs(), explain:explainText() }; }
  function checks(d){
    T = T || MV.C.task;
    var p = d.p, f = d.form, km = f ? kmPlaces(p, f) : [];
    var c4 = d.assets.every(function(x){ return x.src && (x.src === "mine" || (x.lic && tx(x.credit).trim())); });
    var n = wc(d.explain), c6 = n >= 120 && n <= 250 && sharedWords(d.explain, audienceText(p)).length >= 2 && !!f && convCount(d.explain, f) >= 2;
    return [briefCheck(p).ok, !!f && formBuilt(p, f), uniq(km.map(function(k){ return k.key; })).length >= 2, c4, d.revs.filter(function(r){ return wc(r.note) >= 15; }).length >= 2, c6];
  }
  function paintAssets(){
    var a = TA(), host = $("#t-assets"); if (!host) return; a.assets = Array.isArray(a.assets) ? a.assets : [];
    MV.keepFocus(host, function(){
      host.innerHTML = (a.assets.length ? a.assets.map(function(x, i){
        return '<div class="cm-asset" data-ai="' + i + '"><div class="jq"><label for="t-an' + i + '">Asset ' + (i + 1) + ': what is it?</label><input id="t-an' + i + '" class="txtin" type="text" autocomplete="off" data-as="' + i + ':name" value="' + esc(x.name || "") + '"></div>' +
          '<div id="t-ak' + i + '"></div><div id="t-as' + i + '"></div>' + (x.src && x.src !== "mine" ? '<div id="t-al' + i + '"></div><div class="jq"><label for="t-ac' + i + '">Credit line</label><input id="t-ac' + i + '" class="txtin" type="text" autocomplete="off" data-as="' + i + ':credit" placeholder="e.g. “Rain on a Roof” by A. Maker, CC BY 4.0" value="' + esc(x.credit || "") + '"></div>' : "") +
          '<button type="button" class="btn ghost sm" data-arm="' + i + '" data-k="arm' + i + '">Remove this asset</button></div>';
      }).join("") : '<p class="tiny muted">No assets listed.</p>') + '<button type="button" class="btn ghost sm" data-aadd="1" data-k="aadd">' + T.labels.addAsset + "</button>";
    });
    a.assets.forEach(function(x, i){
      radios($("#t-ak" + i), { label:"Kind", cls:"chips", options:T.kinds, value:x.kind || "", key:"ak" + i, onChange:function(v){ x.kind = v; api.save(); api.update(); } });
      radios($("#t-as" + i), { label:"Source", cls:"chips", options:T.sources, value:x.src || "", key:"as" + i, onChange:function(v){ x.src = v; api.save(); paintAssets(); api.update(); paintPv(); } });
      if ($("#t-al" + i)) radios($("#t-al" + i), { label:"Licence", cls:"chips", options:T.licences, value:x.lic || "", key:"al" + i, onChange:function(v){ x.lic = v; api.save(); api.update(); paintPv(); } });
    });
  }
  function paintRevs(){
    var host = $("#t-revs"); if (!host) return; var S = p3S(), R = revs();
    MV.keepFocus(host, function(){
      host.innerHTML = S.rev.map(function(r, i){ return '<div class="jq"><label for="t-rv' + i + '">Revision note ' + (i + 1) + "</label>" + (R[i].ev ? '<p class="tiny">Evidence: ' + esc(R[i].ev) + "</p>" : '<p class="tiny muted">No logged response linked yet (link one in Part 3).</p>') + '<textarea id="t-rv' + i + '" class="cm-ta" rows="2" data-trv="' + i + '">' + esc(r.note) + "</textarea></div>"; }).join("") +
        '<p><button type="button" class="btn ghost sm" data-totest="1">' + T.labels.toTest + "</button></p>";
    });
  }
  function paintPv(){
    var el = $("#t-pv"); if (!el) return;
    var d = data(), p = d.p, f = d.form, R = d.revs, bc = briefCheck(p), K = f ? kmPlaces(p, f) : [];
    el.innerHTML = '<h4 class="cm-h">' + T.labels.glance + '</h4><ul class="cm-glance"><li><strong>Brief:</strong> ' + (bc.ok ? esc(briefLine(p)) : '<span class="muted">missing ' + esc(bc.miss.join(", ")) + "</span>") + "</li>" +
      "<li><strong>Form:</strong> " + (f ? esc(byId(MV.C.explore.forms, f).t) + (formBuilt(p, f) ? " ✓ built to its conventions" : "") : '<span class="muted">not chosen</span>') + "</li>" +
      "<li><strong>Key message tags:</strong> " + (K.length ? esc(K.map(function(k){ return k.t; }).join("; ")) : '<span class="muted">none yet</span>') + "</li>" +
      "<li><strong>Assets:</strong> " + (d.assets.length ? d.assets.length + " listed" : "none listed") + "</li>" +
      "<li><strong>Revision notes:</strong> " + R.filter(function(r){ return wc(r.note) >= 15; }).length + " of 2 ready</li><li><strong>Producer’s statement:</strong> " + wc(d.explain) + " words (120–250)</li></ul>";
    var ok = checks(d).every(Boolean);
    $("#t-models").innerHTML = ok ? '<details class="alg"><summary>' + T.modelsLabel + "</summary>" + T.models.map(function(m){ return '<div class="cm-model">' + m + "</div>"; }).join("") + "</details>" : "";
  }
  function changed(){ if (!api) return; api.update(); paintPv(); }
  function briefLine(p){ var b = p.brief; return [audienceText(p) + (b.habit ? ", who " + label(XC().habits, b.habit) : ""), label(XC().purposes, b.purpose), "“" + b.msg.trim() + "”", b.action.trim()].join(" · "); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var lab = T.labels;
      inp.innerHTML = '<h4 class="cm-h">' + lab.brief + '</h4><div id="t-studio"></div><h4 class="cm-h">' + lab.assets + '</h4><p class="tiny muted">' + lab.assetsHow + '</p><div id="t-assets"></div><h4 class="cm-h">' + lab.revs + '</h4><p class="tiny muted">' + lab.revsHow + '</p><div id="t-revs"></div>';
      pv.innerHTML = '<div id="t-pv" aria-live="polite"></div><div id="t-models"></div>';
      TS = studio($("#t-studio"), { pre:"t", task:true, onChange:changed });
      paintAssets(); paintRevs(); paintPv();
      inp.addEventListener("input", function(e){
        var t = e.target, d = t.dataset;
        if (d.as) { var q = d.as.split(":"), x = TA().assets[+q[0]]; if (x) { x[q[1]] = t.value; api.save(); changed(); } }
        if (d.trv != null) { p3S().rev[+d.trv].note = t.value; api.save(); changed(); }
      });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !inp.contains(b)) return;
        if (b.dataset.aadd) { TA().assets.push({ name:"", kind:"", src:"", lic:"", credit:"" }); api.save(); paintAssets(); changed(); var n = $("#t-an" + (TA().assets.length - 1)); if (n) n.focus(); }
        if (b.dataset.arm != null) { TA().assets.splice(+b.dataset.arm, 1); api.save(); paintAssets(); changed(); }
        if (b.dataset.totest) MV.show("test");
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", changed);
      extras();
    },
    refresh:function(){ if (TS) TS.paint(); paintAssets(); paintRevs(); if (api) { api.update(); paintPv(); } },
    read:function(){ T = T || MV.C.task; return data(); },
    valid:function(d){ return d.form ? true : "Choose a form in your brief first."; },
    checks:checks,
    key:function(d){ return d.form || "none"; }, label:function(k){ var c = MV.C.task.conv[k]; return c ? esc(c.name) : esc(k); }, text:function(k){ var c = MV.C.task.conv[k]; return c ? c.name : k; },
    summary:function(ts){
      T = T || MV.C.task;
      var d = data(), r = checks(d), met = r.filter(Boolean).length, L = [], p = d.p, f = d.form, F = fitScores(p), S = p3S();
      L.push((T.summary || "Make it") + ": " + (met === r.length ? "complete (" + T.conv[f].name + ")" : "not complete yet (checklist " + met + "/" + r.length + ")"));
      L.push("  Brief: " + (briefCheck(p).ok ? briefLine(p) : "(incomplete) " + briefLine(p)) + (topicText(p) ? " · topic: " + topicText(p) : ""));
      if (f) {
        L.push("  Form: " + T.conv[f].name + " (fit " + byId(F.list, f).score + "; " + F.ranked.map(function(x){ return x.short + " " + x.score; }).join(" · ") + ")" + (p.why.trim() ? "; why this form: " + p.why.trim() : ""));
        L.push("  Media text:");
        parts(p, f).forEach(function(x){ L.push("    " + x.t + ": " + (x.text || "(empty)")); });
        var K = kmPlaces(p, f); L.push("  Key message appears: " + (K.length ? K.map(function(k){ return k.t; }).join("; ") : "(not tagged)"));
      } else L.push("  Media text: (no form chosen)");
      L.push("  Assets: " + (d.assets.length ? d.assets.map(function(x){ return (x.name || "(unnamed)") + " [" + (label(T.sources, x.src) || "unmarked") + (x.src && x.src !== "mine" ? ", " + (label(T.licences, x.lic) || "no licence") + ", credit: " + (tx(x.credit).trim() || "none") : "") + "]"; }).join("; ") : "none listed"));
      L.push("  Testing: " + (S.self ? "self-test after 24 hours" : "in class with " + S.testers.filter(function(t){ return tx((t.a || {}).purpose).trim(); }).length + " tester(s)"));
      L.push("  Revision notes: " + d.revs.map(function(x, i){ return (i + 1) + ") " + (x.note.trim() || "(not written)") + (x.ev ? " [evidence: " + x.ev + "]" : ""); }).join(" "));
      if ((ts.found || []).length > 1) L.push("  Forms completed: " + ts.found.map(function(k){ return MV.C.task.conv[k] ? MV.C.task.conv[k].name : k; }).join("; "));
      return L;
    }
  };
})();

// ---------- Reflect: sample principles, commonplace book, and the capstone — @component E16 artBook: My Art of Language as a
// book (principles grouped by trivium, then the commonplace book) with a preface written here and kept at the front ----------
function artWords(s){ return MV.eng.norm(s).split(" ").filter(Boolean); }
function prefChecks(text){
  var n = wc(text), rec = MV.artRead(), P = rec.principles || {}, tw = " " + artWords(text).join(" ") + " ", quoted = false;
  Object.keys(P).forEach(function(k){ var w = artWords(P[k].principle || ""); for (var i = 0; i + 3 <= w.length && !quoted; i++) if (tw.indexOf(" " + w.slice(i, i + 3).join(" ") + " ") >= 0) quoted = true; });
  var will = tx(text).split(/(?<=[.!?])\s+/).some(function(s){ return /^[“"‘']?(I will|I’ll|I'll)\b/.test(s.trim()); });
  return [n >= 120 && n <= 200, quoted, will];
}
function bookText(){
  var rec = MV.artRead(), L = ["My Art of Language", ""];
  if (rec.preface && tx(rec.preface.text).trim()) { L.push("Preface"); L.push(rec.preface.text.trim()); L.push(""); }
  bookGroups(rec).forEach(function(g){ L.push(g.t); g.items.forEach(function(x){ L.push("  " + (x.nn ? x.nn + ". " : "") + MV.plain(x.title || "")); L.push("    Principle: " + tx(x.principle).trim()); if (tx(x.example).trim()) L.push("    Master’s example: " + x.example.trim()); if (tx(x.imitation).trim()) L.push("    Imitation: " + x.imitation.trim()); }); L.push(""); });
  var cp = rec.commonplace || []; if (cp.length) { L.push("Commonplace book"); cp.forEach(function(c){ L.push("  “" + c.line + "”" + (c.note ? " (" + c.note + ")" : "") + (c.source ? " — " + c.source : "")); }); }
  return L.join("\n");
}
function bookGroups(rec){
  var P = rec.principles || {}, G = [{ t:"Grammar", items:[] }, { t:"Logic", items:[] }, { t:"Rhetoric", items:[] }, { t:"Other", items:[] }];
  Object.keys(P).map(function(k){ return P[k]; }).filter(function(x){ return tx(x.principle).trim(); }).sort(function(a, b){ return String(a.nn || "").localeCompare(String(b.nn || "")); }).forEach(function(x){
    var t = tx(x.trivium).split(/,\s*/)[0], g = byId(G.map(function(g){ return { id:g.t, g:g }; }), t); (g ? g.g : G[3]).items.push(x);
  });
  return G.filter(function(g){ return g.items.length; });
}
function paintBook(){
  var el = $("#cm-book"); if (!el) return;
  var B = MV.C.reflect.book, rec = MV.artRead(), G = bookGroups(rec), cp = rec.commonplace || [], np = G.reduce(function(s, g){ return s + g.items.length; }, 0);
  $("#cm-few").hidden = np >= 3;
  var h = '<header class="cm-bk-h"><p class="cm-bk-t">My Art of Language</p>' + (MV.S.name ? '<p class="tiny">' + esc(MV.S.name) + "</p>" : "") + "</header>";
  if (rec.preface && tx(rec.preface.text).trim()) h += '<section class="cm-bk-s cm-bk-pref"><h5>Preface</h5><p>' + esc(rec.preface.text.trim()) + "</p></section>";
  h += G.length ? G.map(function(g){ return '<section class="cm-bk-s"><h5>' + g.t + "</h5>" + g.items.map(function(x){ return '<div class="cm-bk-e"><p class="tiny muted">' + esc((x.nn ? x.nn + ". " : "") + MV.plain(x.title || "")) + '</p><p><strong>Principle:</strong> ' + esc(x.principle) + "</p>" + (tx(x.example).trim() ? "<p><strong>Master’s example:</strong> " + esc(x.example) + "</p>" : "") + (tx(x.imitation).trim() ? "<p><strong>Imitation:</strong> " + esc(x.imitation) + "</p>" : "") + "</div>"; }).join("") + "</section>"; }).join("") : '<p class="muted">' + B.empty + "</p>";
  h += '<section class="cm-bk-s"><h5>Commonplace book</h5>' + (cp.length ? '<ul class="cm-bk-cp">' + cp.map(function(c){ return "<li>“" + esc(c.line) + "”" + (c.note ? ' <span class="muted">(' + esc(c.note) + ")</span>" : "") + (c.source ? ' <span class="tiny muted">' + esc(c.source) + "</span>" : "") + "</li>"; }).join("") + "</ul>" : '<p class="tiny muted">No lines saved yet.</p>') + "</section>";
  el.innerHTML = h;
}
function prefPaint(){
  var t = $("#cm-preface"); if (!t) return; var c = prefChecks(t.value), B = MV.C.reflect.book, n = wc(t.value);
  $("#cm-pref-n").textContent = n + " word" + (n === 1 ? "" : "s") + " (120–200)";
  $("#cm-pref-checks").innerHTML = B.checks.map(function(x, i){ return '<li class="' + (c[i] ? "ok" : "") + '"><span aria-hidden="true">' + (c[i] ? "✓" : "○") + "</span> " + x + "</li>"; }).join("");
}
function bookSheet(){
  var art = $("#art-sheet"); if (!art) return;
  if ($("#cm-book-sheet")) { paintBook(); prefPaint(); return; }
  var B = MV.C.reflect.book, sh = document.createElement("div"); sh.className = "sheet"; sh.id = "cm-book-sheet";
  sh.innerHTML = "<h3>" + B.title + "</h3><p>" + B.intro + '</p><p class="cm-few" id="cm-few" hidden>' + B.few + '</p><div class="cm-book' + (MV.reduceMotion ? "" : " cm-open") + '" id="cm-book"></div>' +
    '<div class="cm-pref"><p>' + B.prompt + "</p><ul>" + B.questions.map(function(q){ return "<li>" + q + "</li>"; }).join("") + '</ul><div class="jq"><label for="cm-preface">Your preface</label><textarea id="cm-preface" rows="9"></textarea><p class="tiny" id="cm-pref-n" aria-live="polite"></p><ul class="cm-checks" id="cm-pref-checks" aria-live="polite"></ul><div class="saved" id="cm-pref-saved" aria-live="polite"></div></div></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="cm-book-copy">Copy my Art of Language</button><button type="button" class="btn ghost sm" id="cm-book-dl">Save it as a file</button><span class="tiny muted" id="cm-book-st" aria-live="polite"></span></div><p class="cm-closing">' + B.closing + "</p>";
  art.parentNode.insertBefore(sh, art.nextSibling);
  var t = $("#cm-preface"), timer = null; t.value = MV.S.writes["cm-preface"] || "";
  t.addEventListener("input", function(){
    MV.S.writes["cm-preface"] = t.value; prefPaint(); clearTimeout(timer);
    timer = setTimeout(function(){ MV.save(); var rec = MV.artRead(); rec.preface = { text:t.value, updated:new Date().toISOString(), module:MV.meta.id }; MV.artWrite(rec); paintBook(); $("#cm-pref-saved").textContent = "Saved at the front of My Art of Language"; }, 400);
  });
  $("#cm-book-copy").addEventListener("click", function(){
    var st = $("#cm-book-st"), txt = bookText();
    try { navigator.clipboard.writeText(txt).then(function(){ st.textContent = "Copied."; }, function(){ st.textContent = "Copying isn’t available here. Use Save it as a file."; }); } catch (e) { st.textContent = "Copying isn’t available here. Use Save it as a file."; }
  });
  $("#cm-book-dl").addEventListener("click", function(){
    try { var u = URL.createObjectURL(new Blob([bookText()], { type:"text/plain" })), a = document.createElement("a"); a.href = u; a.download = "my-art-of-language.txt"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 1000); $("#cm-book-st").textContent = "Saved as my-art-of-language.txt."; } catch (e) { $("#cm-book-st").textContent = "Saving isn’t available in this browser."; }
  });
  $("#art").addEventListener("input", function(){ setTimeout(paintBook, 550); });
  paintBook(); prefPaint();
}
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">They show the form. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Master’s example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  var ap = $("#art-p");
  if (ap && !$("#cm-artn")) {
    var n = document.createElement("p"); n.id = "cm-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
    var upd = function(){ var k = wc(ap.value); n.textContent = k + " word" + (k === 1 ? "" : "s") + (k >= R.principleMin ? " ✓" : " (write at least " + R.principleMin + ")"); };
    ap.addEventListener("input", upd); upd();
  }
  MV.eng.triviumPicker();
  var cp = $("#cp-app");
  if (cp && !cp.childNodes.length) {
    var own = R.art.examples.map(function(x){ return MV.plain(x).replace(/\s*\([^()]*\)\s*$/, ""); }), rec = MV.artRead();
    var prev = uniq((rec.commonplace || []).filter(function(c){ return c.module !== MV.meta.id; }).map(function(c){ return c.line; })).slice(-10);
    MV.eng.commonplace(cp, { lines:own.concat(prev.filter(function(l){ return !has(own, l); })) });
  }
  var st = $("#w-steal");
  if (st && !$("#cm-steal-save")) {
    var p = document.createElement("p"); p.className = "q-actions";
    p.innerHTML = '<button type="button" class="btn ghost sm" id="cm-steal-save">Save my imitation to my commonplace book</button><span class="tiny muted" id="cm-steal-st" aria-live="polite"></span>';
    st.parentNode.appendChild(p);
    $("#cm-steal-save").addEventListener("click", function(){ var v = st.value.trim(), s = $("#cm-steal-st"); if (!v) { s.textContent = "Write your imitation first."; return; } MV.eng.saveLine(v, "Sentence to steal, after Strunk"); s.textContent = "Saved to your commonplace book."; });
  }
  bookSheet();
}

MV.module({
  hero:function(){ hero(); wordStory(); },
  explore:explore,
  part3:part3,
  activities:{ spot:spotProse },
  task:task,
  summaryLines:function(){
    var t = tx(MV.S.writes["cm-preface"]).trim(), st = tx(MV.S.writes.steal).trim();
    return (st ? ["Sentence to steal (after Strunk): " + st] : []).concat(["Preface to My Art of Language: " + (t || "(not written yet)")]);
  },
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX) { if (v === "explore") EX.shown(); else EX.stop(); }
    if (v === "test" && P3) P3.refresh();
    if (v === "final-check") task.refresh();
    if (v === "reflect" || v === "test") extras();
  }
});
})();
