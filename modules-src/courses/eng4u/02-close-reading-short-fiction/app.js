// ENG4U 02 Close Reading of Short Fiction: hero read-aloud (first and last sentences, 23 paragraph bars), the reading (numbered
// paragraphs, local-voice read-aloud, first-read notes), Close-reading zoom (Explore: E9 structure map, E1 annotation studio,
// lenses, sentence grammar, word notes), Read it twice (Part 3), the unseen short-short story, Spot the Error for prose, and the
// "A paragraph that reads closely" task (E6 paragraph builder with an MLA paragraph-citation builder).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;

// ---------- @component radioGroup (copied from ENG4U 01 / MDM4U 01; no option needs to be checked) ----------
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
function stackStyle(roles){ return roles.length > 1 ? ' style="box-shadow:' + roles.map(function(r, k){ return "inset 0 -" + (3 * (k + 1)) + "px 0 var(--an-" + r + ")"; }).join(",") + '"' : ""; }
function wc(t){ return MV.eng.wordCount(t); }

// ---------- the story: paragraphs, sentences, word tokens. An em dash ends a token ("disease—of" → "disease—", "of"). ----------
function toksOf(text){
  var out = [];
  String(text).split(/\s+/).filter(Boolean).forEach(function(c, ci){
    c.replace(/—(?=\S)/g, "—\u0001").split("\u0001").forEach(function(t, k){ out.push({ t:t, n:MV.eng.norm(t), ci:ci, join:k > 0, line:0 }); });
  });
  return out;
}
function findIn(toks, text){
  var want = toksOf(MV.plain(text)).map(function(x){ return x.n; });
  for (var i = 0; i + want.length <= toks.length; i++) {
    var ok = true; for (var k = 0; k < want.length; k++) if (toks[i + k].n !== want[k]) { ok = false; break; }
    if (ok) return [i, i + want.length - 1];
  }
  return null;
}
function joinToks(toks, a, b){ var s = ""; for (var i = a; i <= b; i++) s += (i > a && !toks[i].join ? " " : "") + toks[i].t; return s; }
var ST = null;
function story(){
  if (ST) return ST;
  var src = MV.C.start.story;
  ST = { cite:src.cite, title:src.title, pars:src.pars.map(function(p, pi){
    var toks = [], sents = [];
    p.s.forEach(function(s){
      var t = MV.plain(s.t), tk = toksOf(t), base = toks.length, ci0 = base ? toks[base - 1].ci + 1 : 0, mc = {}, any = false;
      tk.forEach(function(x){ x.ci += ci0; toks.push(x); });
      [].concat(s.m === 1 ? t : s.m || []).forEach(function(m){ if (!m) return; var r = findIn(tk, m); if (r) { any = true; for (var i = r[0]; i <= r[1]; i++) mc[base + i] = 1; } });
      sents.push({ t:t, a:base, b:toks.length - 1, v:s.v || "nar", c:!!s.c, mc:mc, hasM:any });
    });
    var text = sents.map(function(s){ return s.t; }).join(" ");
    return { n:pi + 1, see:p.see || "lou", sents:sents, toks:toks, text:text, words:wc(text) };
  }) };
  return ST;
}
function sentOf(p, ti){ for (var k = 0; k < p.sents.length; k++) if (ti >= p.sents[k].a && ti <= p.sents[k].b) return k; return 0; }

// ---------- read aloud (local voices only, through MV.eng); one speaker at a time ----------
var VOICE = null, SPK = 0;
function voiceReady(fn){ MV.eng.voice(function(v){ VOICE = v; fn(v); }); }
function speak(text, o){
  var me = ++SPK;
  return MV.eng.say(text, { voice:VOICE, rate:o.rate || 1, onWord:function(k){ if (me === SPK && o.onWord) o.onWord(k); }, onEnd:function(){ if (o.onEnd) o.onEnd(me === SPK); } });
}
function chunkStarts(toks, a, b){ var s = []; for (var i = a; i <= b; i++) if (!toks[i].join && /[A-Za-z0-9À-ÿ]/.test(joinToks(toks, i, i))) s.push(i); return s; }

// ---------- hero: the first and last sentences, 23 paragraph bars between them, read aloud on request ----------
function markup(text, glows, g0){
  var cuts = {}, G = [], words = [], re = /\S+/g, m;
  cuts[0] = 1; cuts[text.length] = 1;
  glows.forEach(function(g, k){ var a = text.indexOf(g.g); if (a < 0) return; cuts[a] = 1; cuts[a + g.g.length] = 1; G.push({ a:a, b:a + g.g.length, tag:g.tag, id:g0 + k }); });
  while ((m = re.exec(text))) { words.push([m.index, m.index + m[0].length]); cuts[m.index] = 1; cuts[m.index + m[0].length] = 1; }
  G.forEach(function(g){ for (var w = 0; w < words.length; w++) if (g.a < words[w][1]) { g.wi = w; break; } });
  var pts = Object.keys(cuts).map(Number).sort(function(a, b){ return a - b; }), h = "", open = null;
  function close(){ h += '</span><span class="an-tag an-theme hh-tag" data-gt="' + open.id + '">' + open.tag + "</span>"; open = null; }
  for (var i = 0; i + 1 < pts.length; i++) {
    var a = pts[i], b = pts[i + 1], seg = text.slice(a, b), g = G.filter(function(x){ return a >= x.a && b <= x.b; })[0] || null;
    if (open && open !== g) close();
    if (g && open !== g) { h += '<span class="hh-g" data-g="' + g.id + '">'; open = g; }
    if (/^\s+$/.test(seg)) { h += seg; continue; }
    var wi = 0; for (var w = 0; w < words.length; w++) if (a >= words[w][0] && b <= words[w][1]) { wi = w; break; }
    h += '<span class="eng-w" data-wi="' + wi + '">' + esc(seg) + "</span>";
  }
  if (open) close();
  return { html:h, glows:G, n:words.length };
}
function hero(){
  var H = MV.C.hero, host = $("#hero-hour"); if (!host) return;
  var pars = story().pars, maxW = Math.max.apply(null, pars.map(function(p){ return p.words; }));
  var T1 = pars[H.first.par - 1].sents[0].t, T2 = pars[H.last.par - 1].sents[0].t, A = markup(T1, H.first.glow, 0), B = markup(T2, H.last.glow, A.glows.length);
  host.innerHTML = '<p class="hh-s" id="hh-s1">' + A.html + '</p><p class="hh-cite">(Chopin, par. ' + H.first.par + ")</p>" +
    '<div class="hh-mid"><div class="hh-bars" aria-hidden="true">' + pars.map(function(p){ return '<i style="width:' + Math.round(16 + 84 * p.words / maxW) + '%"></i>'; }).join("") + '</div><span class="hh-lab">' + H.hour + "</span></div>" +
    '<p class="hh-s" id="hh-s2">' + B.html + '</p><p class="hh-cite">(Chopin, par. ' + H.last.par + ")</p>" +
    '<svg class="hh-line" aria-hidden="true" focusable="false"><path d=""/></svg>' +
    '<div class="hh-ctrl"><button type="button" class="btn primary sm" id="hh-play" hidden>Play reading</button>' + (MV.reduceMotion ? "" : '<button type="button" class="btn ghost sm" id="hh-replay">Replay the animation</button>') +
    '<span class="tiny muted" id="hh-note" hidden>Read the two sentences aloud yourself.</span></div>';
  var W1 = $$("#hh-s1 .eng-w", host), W2 = $$("#hh-s2 .eng-w", host), bars = $$(".hh-bars i", host), run = 0, speech = null;
  function glow(id, on){ $$('[data-g="' + id + '"]', host).forEach(function(x){ x.classList.toggle("an", on); x.classList.toggle("an-theme", on); x.classList.toggle("on", on); }); $$('[data-gt="' + id + '"]', host).forEach(function(x){ x.classList.toggle("on", on); }); }
  function line(on){
    var svg = $(".hh-line", host), g1 = $('.hh-g[data-g="0"]', host), g2 = $('.hh-g[data-g="1"]', host);
    svg.classList.toggle("on", on); if (!g1 || !g2) return;
    var R = host.getBoundingClientRect(), a = g1.getBoundingClientRect(), b = g2.getBoundingClientRect();
    var x1 = a.left + a.width / 2 - R.left, y1 = a.bottom - R.top + 2, x2 = b.left + b.width / 2 - R.left, y2 = b.top - R.top - 2;
    svg.setAttribute("width", Math.round(R.width)); svg.setAttribute("height", Math.round(R.height));
    $("path", svg).setAttribute("d", "M" + x1.toFixed(1) + " " + y1.toFixed(1) + " C" + x1.toFixed(1) + " " + (y1 + 60).toFixed(1) + " " + x2.toFixed(1) + " " + (y2 - 60).toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1));
  }
  function reset(){ W1.concat(W2).forEach(function(w){ w.classList.add("hh-dim"); w.classList.remove("speaking"); }); A.glows.concat(B.glows).forEach(function(g){ glow(g.id, false); }); bars.forEach(function(b){ b.classList.remove("on"); }); $(".hh-lab", host).classList.remove("on"); line(false); }
  function lightTo(W, G, k){ W.forEach(function(w){ if (+w.dataset.wi <= k) w.classList.remove("hh-dim"); w.classList.toggle("speaking", +w.dataset.wi === k); }); G.forEach(function(g){ if (k >= g.wi) glow(g.id, true); }); }
  function finish(){ W1.concat(W2).forEach(function(w){ w.classList.remove("hh-dim", "speaking"); }); A.glows.concat(B.glows).forEach(function(g){ glow(g.id, true); }); bars.forEach(function(b){ b.classList.add("on"); }); $(".hh-lab", host).classList.add("on"); line(true); }
  function stackBars(me, step, then){ bars.forEach(function(b, i){ setTimeout(function(){ if (me === run) b.classList.add("on"); }, i * step); }); setTimeout(function(){ if (me !== run) return; $(".hh-lab", host).classList.add("on"); then(); }, bars.length * step + 200); }
  function animate(){
    var me = ++run, t = 300; reset();
    for (var k = 0; k < A.n; k++) (function(k){ setTimeout(function(){ if (me === run) lightTo(W1, A.glows, k); }, t); t += 140; })(k);
    setTimeout(function(){ if (me !== run) return; W1.forEach(function(w){ w.classList.remove("speaking"); });
      stackBars(me, 55, function(){
        var t2 = 0; for (var j = 0; j < B.n; j++) (function(j){ setTimeout(function(){ if (me === run) lightTo(W2, B.glows, j); }, t2); t2 += 160; })(j);
        setTimeout(function(){ if (me === run) finish(); }, t2 + 400);
      }); }, t + 300);
  }
  function play(){
    if (speech) { MV.eng.stop(); return; }
    var me = ++run, got = false; reset();
    $("#hh-play").textContent = "Stop";
    function done(){ speech = null; var b = $("#hh-play"); if (b) b.textContent = "Play reading"; }
    speech = speak(T1, { onWord:function(k){ got = true; if (me === run) lightTo(W1, A.glows, k); },
      onEnd:function(mine){
        if (!mine || me !== run) { done(); if (me === run) finish(); return; }
        W1.forEach(function(w){ w.classList.remove("hh-dim", "speaking"); }); A.glows.forEach(function(g){ glow(g.id, true); });
        stackBars(me, MV.reduceMotion ? 0 : 40, function(){
          speech = speak(T2, { onWord:function(k){ if (me === run) lightTo(W2, B.glows, k); }, onEnd:function(){ done(); if (me === run) finish(); } });
        });
      } });
    // some voices send no word boundaries: then light the words on a timer instead
    setTimeout(function(){ if (!got && speech && me === run && !MV.reduceMotion) { run++; animate(); } }, 900);
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.id === "hh-play") play(); else if (b.id === "hh-replay") { MV.eng.stop(); animate(); }
  });
  if (window.ResizeObserver) new ResizeObserver(function(){ if ($(".hh-line", host).classList.contains("on")) line(true); }).observe(host);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if ($(".hh-line", host).classList.contains("on")) line(true); });
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(function(v){ $("#hh-play").hidden = !v; $("#hh-note").hidden = !!v; });
}

// ---------- Start: the reading (numbered paragraphs, read aloud paragraph by paragraph) ----------
function reading(){
  var host = $("#story-app"); if (!host) return;
  var S = story(), playing = false, cur = -1;
  host.innerHTML = '<div class="rd-ctrl"><button type="button" class="btn sm" id="rd-play" hidden>Read aloud</button><label class="rd-from" id="rd-froml" hidden>from paragraph <select id="rd-from" class="cz-sel">' +
    S.pars.map(function(p){ return '<option value="' + (p.n - 1) + '">' + p.n + "</option>"; }).join("") + '</select></label><span class="tiny muted" id="rd-note" hidden>Read it aloud yourself, or silently, slowly.</span></div><div id="rd-text" class="rd-text"></div>';
  MV.eng.passage($("#rd-text"), S.pars.map(function(p){ return esc(p.text); }), { kind:"prose", words:true, cite:esc(S.cite) });
  var P = $$("#rd-text .eng-prose p");
  function mark(i, k){ P.forEach(function(p, j){ p.classList.toggle("rd-cur", j === i); }); $$("#rd-text .eng-w.speaking").forEach(function(w){ w.classList.remove("speaking"); }); if (i >= 0 && k >= 0) { var w = $$(".eng-w", P[i])[k]; if (w) w.classList.add("speaking"); } }
  function stopUI(){ playing = false; cur = -1; mark(-1, -1); $("#rd-play").textContent = "Read aloud"; }
  function par(i){
    cur = i; mark(i, -1);
    if (P[i] && P[i].scrollIntoView) { var r = P[i].getBoundingClientRect(); if (r.top < 80 || r.bottom > window.innerHeight) P[i].scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
    speak(S.pars[i].text, { onWord:function(k){ mark(i, k); }, onEnd:function(mine){ if (mine && playing && i + 1 < S.pars.length) par(i + 1); else stopUI(); } });
  }
  host.addEventListener("click", function(e){
    if (e.target.id !== "rd-play") return;
    if (playing) { playing = false; MV.eng.stop(); stopUI(); return; }
    playing = true; e.target.textContent = "Stop"; par(+$("#rd-from").value || 0);
  });
  voiceReady(function(v){ $("#rd-play").hidden = !v; $("#rd-froml").hidden = !v; $("#rd-note").hidden = !!v; });
  return { stop:function(){ if (playing) { playing = false; MV.eng.stop(); stopUI(); } } };
}
var RD = null;

// ---------- @component E9 structureMap — story structure map (course plan E9: tension graph / Freytag; reused by 09, 14, 16) ----------
// structureMap(host, {units:[{n, words}], max:5, label, hourLabel, onSelect(i), onChange(i, v)}) -> {set(st), hour(on, done), focus(i)}
//   st = {vals:[0..max | null per unit], model:[…] | null, showModel, sel:index, edit:bool, marks:{index:role}}
// One bar per unit (height ∝ length; bars are buttons that call onSelect), a 0–max graph above them, the student's points and an
// optional dashed model curve (labelled, never scored). Edit mode: press and drag across the graph to sketch; each point is a
// slider (↑/↓ or 0–5 change it, ←/→ move to the neighbour, Home/End = 0 / max). hour(true) merges the bars into one strip with
// the hour label (P1 reveal; CSS transition, instant with reduced motion). Wide graphs scroll sideways inside .e9-scroll on phones.
function structureMap(host, o){
  var n = o.units.length, max = o.max || 5, st = { vals:[], model:null, showModel:false, sel:-1, edit:false, marks:{} }, drag = false;
  var maxW = Math.max.apply(null, o.units.map(function(u){ return u.words; }));
  var grid = ""; for (var v = 0; v <= max; v++) grid += '<line x1="0" x2="' + (n * 10) + '" y1="' + (100 - v * 100 / max) + '" y2="' + (100 - v * 100 / max) + '"/>';
  host.innerHTML = '<div class="e9-scroll"><div class="e9">' +
    '<div class="e9-row"><div class="e9-y" aria-hidden="true">' + Array.apply(null, { length:max + 1 }).map(function(_, k){ return '<span style="bottom:' + ((max - k) / max * 100) + '%">' + (max - k) + "</span>"; }).join("") + "</div>" +
      '<div class="e9-area"><div class="e9-in"><div class="e9-band" aria-hidden="true"></div><svg class="e9-svg" viewBox="0 0 ' + (n * 10) + ' 100" preserveAspectRatio="none" aria-hidden="true" focusable="false"><g class="e9-grid">' + grid + '</g><path class="e9-model" d=""/><path class="e9-line" d=""/></svg><div class="e9-pts"></div></div></div></div>' +
    '<div class="e9-row"><span class="e9-yl" aria-hidden="true">par.</span><div class="e9-strip" role="group" aria-label="' + esc(o.label || "Paragraphs") + '">' + o.units.map(function(u, i){
      return '<button type="button" class="e9-bar" data-bar="' + i + '" aria-pressed="false" aria-label="Paragraph ' + u.n + ", " + u.words + ' words"><i style="height:' + Math.round(14 + 86 * u.words / maxW) + '%"></i><span>' + u.n + "</span></button>"; }).join("") + "</div></div>" +
    '<div class="e9-row"><span></span><div class="e9-hour" aria-hidden="true"><span>' + (o.hourLabel || "") + "</span></div></div></div></div>" +
    '<p class="tiny muted e9-swipe">Swipe sideways to see all ' + n + " paragraphs.</p>" +
    '<p class="e9-legend tiny"></p>';
  var area = $(".e9-in", host), pts = $(".e9-pts", host), strip = $(".e9-strip", host);
  function X(i){ return ((i + 0.5) / n * 100) + "%"; }
  function path(vals){ var d = "", pen = false; vals.forEach(function(v, i){ if (v == null) { pen = false; return; } d += (pen ? "L" : "M") + (i * 10 + 5) + " " + (100 - v * 100 / max) + " "; pen = true; }); return d.trim(); }
  function paint(){
    var had = pts.contains(document.activeElement) ? +document.activeElement.dataset.pt : -1;
    $(".e9-line", host).setAttribute("d", path(st.vals));
    $(".e9-model", host).setAttribute("d", st.showModel && st.model ? path(st.model) : "");
    pts.innerHTML = o.units.map(function(u, i){
      var v = st.vals[i], set = v != null;
      if (st.edit) return '<button type="button" class="e9-pt' + (set ? "" : " unset") + '" data-pt="' + i + '" role="slider" aria-label="Tension, paragraph ' + u.n + '" aria-valuemin="0" aria-valuemax="' + max + '"' + (set ? ' aria-valuenow="' + v + '"' : "") +
        ' aria-valuetext="' + (set ? v + " of " + max : "not placed yet") + '" tabindex="' + ((had >= 0 ? had : Math.max(0, st.sel)) === i ? 0 : -1) + '" style="left:' + X(i) + ";bottom:" + ((set ? v : 0) / max * 100) + '%"></button>';
      return set ? '<span class="e9-dot" style="left:' + X(i) + ";bottom:" + (v / max * 100) + '%"></span>' : "";
    }).join("");
    area.classList.toggle("edit", st.edit);
    var band = $(".e9-band", host); band.style.display = st.sel >= 0 ? "" : "none"; band.style.left = (st.sel / n * 100) + "%"; band.style.width = (100 / n) + "%";
    $$(".e9-bar", strip).forEach(function(b, i){ var on = i === st.sel, r = st.marks[i]; b.setAttribute("aria-pressed", on); b.className = "e9-bar" + (r ? " an-" + r + " marked" : ""); });
    var placed = st.vals.filter(function(v){ return v != null; }).length;
    $(".e9-legend", host).innerHTML = '<span class="e9-key e9-key-you" aria-hidden="true"></span> Your points (' + placed + " of " + n + " placed)" + (st.showModel && st.model ? ' <span class="e9-key e9-key-model" aria-hidden="true"></span> ' + esc(o.modelLabel || "Model") : "");
    if (had >= 0 && st.edit) focus(had);
  }
  function focus(i){ var b = pts.querySelector('[data-pt="' + i + '"]'); if (b) { $$(".e9-pt", pts).forEach(function(x){ x.tabIndex = -1; }); b.tabIndex = 0; b.focus({ preventScroll:true }); } }
  function setV(i, v){ i = Math.max(0, Math.min(n - 1, i)); v = Math.max(0, Math.min(max, v)); if (st.vals[i] !== v && o.onChange) o.onChange(i, v); }
  function fromEvent(e){ var r = area.getBoundingClientRect(); if (r.width < 10) return; var i = Math.floor((e.clientX - r.left) / r.width * n), v = Math.round((1 - (e.clientY - r.top) / r.height) * max); setV(i, v); focus(Math.max(0, Math.min(n - 1, i))); }
  area.addEventListener("pointerdown", function(e){ if (!st.edit) return; drag = true; try { area.setPointerCapture(e.pointerId); } catch (err) {} e.preventDefault(); fromEvent(e); });
  area.addEventListener("pointermove", function(e){ if (drag) fromEvent(e); });
  area.addEventListener("pointerup", function(){ drag = false; }); area.addEventListener("pointercancel", function(){ drag = false; });
  pts.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-pt]"); if (!b) return;
    var i = +b.dataset.pt, v = st.vals[i], k = e.key;
    if (k === "ArrowUp" || k === "PageUp") setV(i, v == null ? 1 : v + 1);
    else if (k === "ArrowDown" || k === "PageDown") setV(i, v == null ? 0 : v - 1);
    else if (k === "Home") setV(i, 0); else if (k === "End") setV(i, max);
    else if (/^[0-9]$/.test(k) && +k <= max) setV(i, +k);
    else if (k === "ArrowRight" || k === "ArrowLeft") { var j = Math.max(0, Math.min(n - 1, i + (k === "ArrowRight" ? 1 : -1))); if (o.onSelect) o.onSelect(j); focus(j); }
    else return;
    e.preventDefault();
  });
  strip.addEventListener("click", function(e){ var b = e.target.closest("[data-bar]"); if (b && o.onSelect) o.onSelect(+b.dataset.bar); });
  return {
    set:function(s){ Object.keys(s).forEach(function(k){ st[k] = s[k]; }); st.vals = (st.vals || []).slice(); paint(); },
    hour:function(on, done){ var was = strip.classList.contains("hour"); strip.classList.toggle("hour", !!on); $(".e9-hour", host).classList.toggle("on", !!on); if (done) MV.wait(on && !was ? 1300 : 50, done); },
    focus:focus
  };
}

// ---------- @component E1 annotationStudio — select words, tag them with a lens, check against a key (course plan E1) ----------
// Adapted from ENG4U 01: tags are lenses only (no device menu). annotationStudio(host, {toks, notes:[] (persisted; mutated in
// place), lenses:[{id, label, role}], label, extra(note) -> html | "" (chips under a note, e.g. reasons), onExtra(note, value),
// onChange()}) -> {setToks(toks, notes), refresh(), speaking(i)}. A note is {w:[token indices], words:[texts], lens, …}.
// annotationStudio.check(notes, key, also) -> {found:[{d, n}], also:[{d, n}], misnamed:[{d, n}], extra:[n], missed:[d]}: a note
// matches a key item {lens, a, b} when the lens agrees and its first and last words are each within one word of the item's ends.
function annotationStudio(host, o){
  var L = {}; o.lenses.forEach(function(l){ L[l.id] = l; });
  var toks = o.toks, notes = o.notes, sel = [];
  host.innerHTML = '<div class="e1"><div class="e1-toks"></div><p class="tiny muted e1-help">Tap words to select them, or use the arrow keys, Shift + arrow keys and Space. Then press T or choose a lens.</p><div class="e1-menu" role="group" aria-label="Tag the selected words"></div><div class="e1-list"></div></div>';
  var tokHost = $(".e1-toks", host), menu = $(".e1-menu", host), list = $(".e1-list", host);
  function marks(){ return notes.map(function(n){ return { w:n.w, role:L[n.lens].role, tag:L[n.lens].label }; }); }
  var tk = MV.eng.tokens(tokHost, toks, { label:o.label, marks:marks, onChange:function(s){ sel = s; paintMenu(); }, onKey:function(k){ if (k === "t") { var b = menu.querySelector(".e1-dev"); if (b) b.focus(); } } });
  function paintMenu(){
    if (!sel.length) { menu.innerHTML = '<p class="tiny muted" style="margin:0">Select words to tag them.</p>'; return; }
    MV.keepFocus(menu, function(){
      menu.innerHTML = '<p class="e1-selp"><strong>Selected:</strong> “' + esc(joinToks(toks, Math.min.apply(null, sel), Math.max.apply(null, sel))) + '” <button type="button" class="btn ghost sm" data-e1="clear" data-k="e1clear">Clear selection</button></p><div class="e1-grp">' +
        o.lenses.map(function(l){ return '<button type="button" class="chip e1-dev an-' + l.role + '" data-e1tag="' + l.id + '" data-k="e1t' + l.id + '"><i class="an-dot" aria-hidden="true"></i> ' + l.label + "</button>"; }).join("") + "</div>";
    });
  }
  function paintList(){
    MV.keepFocus(list, function(){
      list.innerHTML = '<h4 class="e1-h">What you’ve marked</h4>' + (notes.length ? '<ul class="e1-ul">' + notes.map(function(n, k){
        var role = L[n.lens].role, a = Math.min.apply(null, n.w), b = Math.max.apply(null, n.w);
        return '<li class="an-note an-' + role + '"><span class="an-tag an-' + role + '">' + L[n.lens].label + "</span>“" + esc(joinToks(toks, a, b)) + '” <button type="button" class="linkbtn" data-e1rm="' + k + '" data-k="e1rm' + k + '">Remove</button>' + (o.extra ? o.extra(n, k) : "") + "</li>";
      }).join("") + "</ul>" : '<p class="tiny muted" style="margin:0">Nothing yet.</p>');
    });
  }
  function changed(){ tk.paint(); paintList(); if (o.onChange) o.onChange(); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.e1 === "clear") { tk.clear(); sel = []; paintMenu(); tk.focus(0); return; }
    if (b.dataset.e1tag) {
      var w = sel.slice(), a = Math.min.apply(null, w), z = Math.max.apply(null, w), span = []; for (var i = a; i <= z; i++) span.push(i);
      notes.push({ w:span, words:span.map(function(i){ return toks[i].t; }), lens:b.dataset.e1tag });
      tk.clear(); sel = []; paintMenu(); changed(); tk.focus(z); return;
    }
    if (b.dataset.e1rm != null) { notes.splice(+b.dataset.e1rm, 1); changed(); var nb = list.querySelector("[data-e1rm]"); if (nb) nb.focus(); else tk.focus(0); return; }
    if (b.dataset.e1x != null && o.onExtra) { var q = b.dataset.e1x.split("|"); o.onExtra(notes[+q[0]], q[1]); paintList(); if (o.onChange) o.onChange(); }
  });
  paintMenu(); paintList();
  return {
    setToks:function(t, n){ toks = t; if (n) notes = n; sel = []; tk.setTokens(t); tk.clear(); paintMenu(); paintList(); },
    refresh:function(){ tk.paint(); paintMenu(); paintList(); }, speaking:function(i){ tk.speaking(i); }
  };
}
annotationStudio.near = function(n, d){ var a = Math.min.apply(null, n.w), b = Math.max.apply(null, n.w); return Math.abs(a - d.a) <= 1 && Math.abs(b - d.b) <= 1; };
annotationStudio.overlap = function(n, d){ var a = Math.min.apply(null, n.w), b = Math.max.apply(null, n.w); return a <= d.b && b >= d.a; };
annotationStudio.check = function(notes, key, also){
  var used = {}, found = [], al = [], extra = [], mis = [];
  notes.forEach(function(n){
    if (!n.w || !n.w.length) return;
    var k = key.filter(function(d){ return !used[d.id] && d.lens === n.lens && annotationStudio.near(n, d); })[0];
    if (k) { used[k.id] = 1; found.push({ d:k, n:n }); return; }
    var x = (also || []).filter(function(d){ return !used[d.id] && d.lens === n.lens && annotationStudio.near(n, d); })[0];
    if (x) { used[x.id] = 1; al.push({ d:x, n:n }); return; }
    var c = key.concat(also || []).filter(function(d){ return !used[d.id] && annotationStudio.near(n, d); })[0];
    if (c) mis.push({ d:c, n:n }); else extra.push(n);
  });
  return { found:found, also:al, misnamed:mis, extra:extra, missed:key.filter(function(d){ return !used[d.id]; }) };
};

// ---------- Explore: Close-reading zoom (E9 structure map + E1 annotation studio + lenses) ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, PARS = story().pars, LZ = C.lenses, LENS = {}, FIG = C.figure, N = PARS.length;
  LZ.forEach(function(l){ LENS[l.id] = l; });
  var ALL_L = LZ.concat([FIG]), AL = {}; ALL_L.forEach(function(l){ AL[l.id] = l; });
  function chipOf(lens){ return lens === FIG.id ? FIG.lens : lens; }
  function resolve(list, pre){ var out = []; list.forEach(function(k, i){ var p = PARS[k.par - 1], r = p && findIn(p.toks, k.span); var l = AL[k.lens] || {}; if (r) out.push({ id:pre + i, par:k.par, lens:k.lens, a:r[0], b:r[1], span:k.span, note:k.note, answer:k.answer, role:l.role, label:l.label }); }); return out; }
  var KEY = resolve(C.key, "k"), ALSO = resolve(C.also, "x"), IRONY = KEY.filter(function(k){ return k.lens === "irony"; });
  var T1 = resolve(C.tc1.items, "t1-"), T1P = resolve([C.tc1.peddler], "pd")[0], T1S = resolve([C.tc1.song], "sg")[0];
  var T3 = resolve(C.tc3.items.map(function(x){ return { par:x.par, span:x.span, lens:"irony", answer:MV.ans(x) }; }), "t3-"), T3A = resolve([C.tc3.armchair], "ac")[0];
  var REASONS = MV.shuffle(C.tc3.reasons, "tc3-reasons");
  // state
  S.mode = ["zoom", "annotate", "tension"].indexOf(S.mode) >= 0 ? S.mode : "zoom";
  S.lvl = S.lvl >= 0 && S.lvl <= 3 ? +S.lvl : 0; S.par = S.par >= 1 && S.par <= N ? +S.par : 1; S.sent = S.sent >= 0 ? +S.sent : 0; S.word = S.word >= 0 ? +S.word : 0;
  S.lenses = S.lenses || { irony:true }; S.notes = S.notes || {}; S.res = S.res || {}; S.sel = S.sel || []; S.model = !!S.model;
  if (!Array.isArray(S.tension) || S.tension.length !== N) S.tension = PARS.map(function(){ return null; });
  var fx = fresh(), speech = null, studio = null, studioPar = 0;
  function fresh(){ return { title:false, hour:false, pulse:[], range:null, card:false, flash:false }; }

  host.innerHTML = '<div class="cz">' +
    '<div class="cz-top"><div id="cz-mode"></div><div class="cz-play"><button type="button" class="btn sm" id="cz-play" hidden>Read aloud</button><span class="tiny muted" id="cz-vnote" hidden>Read it aloud yourself.</span></div></div>' +
    '<div class="cz-zoom" id="cz-zoom"><label class="cz-zl" for="cz-range">Zoom</label><div class="cz-zr"><input type="range" id="cz-range" min="0" max="3" step="1" aria-describedby="cz-zhelp"><div class="cz-stops">' +
      C.levels.map(function(l, i){ return '<button type="button" class="cz-stop" data-lvl="' + i + '" data-k="czl' + i + '" aria-pressed="false">' + l.label + "</button>"; }).join("") + '</div></div><span class="vh" id="cz-zhelp">Arrow keys move between Story, Paragraph, Sentence and Word.</span></div>' +
    '<div class="cz-pick" id="cz-pick"><label class="cz-pl">Paragraph <select id="cz-par" class="cz-sel">' + PARS.map(function(p){ return '<option value="' + p.n + '">' + p.n + "</option>"; }).join("") + '</select></label><label class="cz-pl" id="cz-sl">Sentence <select id="cz-sent" class="cz-sel"></select></label></div>' +
    '<div class="cz-lenses" id="cz-lenses" role="group" aria-label="Lenses: switch each on or off"></div>' +
    '<div class="cz-body"><div class="cz-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><p class="cz-q" id="cz-q"></p>' +
      '<div id="cz-map"><p class="cz-title"><span id="cz-ti">“' + esc(story().title) + '”</span></p><div id="cz-e9"></div><div class="q-actions" id="cz-mapbtns"></div><p class="tiny muted" id="cz-maphelp"></p><div id="cz-mapnotes"></div></div>' +
      '<div id="cz-text"></div>' +
      '<div id="cz-ann"><div id="cz-studio"></div><div class="q-actions"><button type="button" class="btn primary sm" id="cz-check">Check my annotations</button><button type="button" class="btn ghost sm" id="cz-clear">Clear my tags on this paragraph</button></div><div id="cz-res" aria-live="polite"></div></div>' +
      '<div id="cz-word"></div></div>' +
    '<details class="cz-readbox" id="cz-readbox"><summary>Show reading notes</summary><p class="cz-rh">Reading notes</p><dl class="read" id="cz-read" aria-live="polite"></dl></details></div>' +
    '<p class="cz-aha">' + C.aha + "</p></div>";
  $("#cz-readbox").open = !(window.matchMedia && window.matchMedia("(max-width:820px)").matches);
  var modeRG = radios($("#cz-mode"), { label:"Mode", options:[{ id:"zoom", t:"Zoom" }, { id:"annotate", t:"Annotate" }, { id:"tension", t:"Tension graph" }], value:S.mode, onChange:function(v){ setMode(v); } });
  var map = structureMap($("#cz-e9"), { units:PARS.map(function(p){ return { n:p.n, words:p.words }; }), max:5, label:"Paragraphs: tap one to choose it", hourLabel:"≈ one hour", modelLabel:C.modelLabel,
    onSelect:function(i){ S.par = i + 1; S.sent = 0; api.save(); paint(); },
    onChange:function(i, v){ S.tension[i] = v; S.par = i + 1; api.save(); paint(); } });
  var wordRG = null;

  function P(){ return PARS[S.par - 1]; }
  function sent(){ var p = P(); if (S.sent >= p.sents.length) S.sent = 0; return p.sents[S.sent]; }
  function lvl(){ return S.mode === "tension" ? 0 : S.mode === "annotate" ? 1 : S.lvl; }
  function vis(fn){ return KEY.filter(function(it){ return S.lenses[chipOf(it.lens)] && (!fn || fn(it)); }); }
  function anyLens(){ return LZ.some(function(l){ return S.lenses[l.id]; }); }
  function notesOf(par){ return S.notes[par] || (S.notes[par] = []); }
  function word(){ var W = C.words; if (S.word >= W.length) S.word = 0; return W[S.word]; }
  function wordTok(w){ var p = PARS[w.par - 1], n = MV.eng.norm(w.w); for (var i = 0; i < p.toks.length; i++) if (p.toks[i].n === n) return i; return 0; }

  function runHTML(p, a, b, o){
    o = o || {};
    var info = {};
    (o.items || []).forEach(function(it){
      var lo = Math.max(it.a, a), hi = Math.min(it.b, b); if (lo > hi) return;
      for (var i = lo; i <= hi; i++) { var x = info[i] || (info[i] = { r:[], tags:[] }); if (x.r.indexOf(it.role) < 0) x.r.push(it.role); if ((o.pulse || []).indexOf(it.id) >= 0) x.pulse = true; }
      info[hi].tags.push(it);
    });
    function key(i){ return (info[i] ? info[i].r.join() : "") + "|" + (o.under && o.under[i] ? 1 : ""); }
    var h = "";
    for (var i = a; i <= b; i++) {
      var x = info[i], px = info[i - 1], cls = "cz-w" + (x && x.r.length ? " an an-" + x.r[0] : "") + (x && x.pulse ? " cz-pulse" : "") + (o.under && o.under[i] ? " cz-mc" : "") + (o.hot === i ? " cz-hot" : "");
      var sp = i > a && !p.toks[i].join ? " " : "", ky = key(i), inside = sp && ky !== "|" && ky === key(i - 1) && !(px && px.tags.length) && !(x && x.pulse);
      h += (inside ? "" : sp) + '<span class="' + cls + '" data-ti="' + i + '"' + (x ? stackStyle(x.r) : "") + ">" + (inside ? sp : "") + esc(p.toks[i].t) + "</span>";
      if (x) x.tags.forEach(function(it){ h += '<span class="an-tag an-' + it.role + '">' + it.label + "</span>"; });
    }
    return h;
  }
  function notesHTML(items, open){
    if (!items.length) return '<p class="tiny muted cz-none">' + (anyLens() ? "No lens finds here. Try another paragraph or lens." : "Switch on a lens to see what a careful reader notices.") + "</p>";
    return '<ul class="cz-notes" aria-label="What the lenses show">' + items.map(function(it){
      return '<li class="an-note an-' + it.role + '"><span class="an-tag an-' + it.role + '">' + it.label + "</span>“" + esc(MV.plain(it.span)) + '” <span class="muted">(par. ' + it.par + ")</span>: " + it.note +
        (open ? ' <button type="button" class="linkbtn" data-open="' + it.par + '" data-k="czo' + it.id + '">Open paragraph ' + it.par + "</button>" : "") + "</li>";
    }).join("") + "</ul>";
  }
  var STOP = " the a an and of to in her she he it was that with as for on at by his him had be is not but there this from were would which who have its they them what did ";
  function devices(sents){
    var out = [], all = sents.map(function(s){ return s.t; }).join(" ");
    var sh = sents.filter(function(s){ return wc(s.t) <= 6; }).length, lg = sents.filter(function(s){ return wc(s.t) >= 30; }).length;
    if (sh) out.push(sh > 1 ? "short sentences" : "short sentence");
    if (lg) out.push(lg > 1 ? "long sentences" : "long sentence");
    [[/—/, "dash"], [/;/, "semicolon"], [/:/, "colon"], [/!/, "exclamation"], [/\?/, "question"], [/[“”]/, "quotation marks"]].forEach(function(r){ if (r[0].test(all)) out.push(r[1]); });
    var cnt = {}; toksOf(all).forEach(function(t){ if (t.n.length >= 3 && STOP.indexOf(" " + t.n + " ") < 0) cnt[t.n] = (cnt[t.n] || 0) + 1; });
    var rep = Object.keys(cnt).filter(function(k){ return cnt[k] >= 3; }); if (rep.length) out.push("repetition (“" + rep[0] + "”)");
    return out.length ? out.join("; ") : "none of the usual markers";
  }
  var SHORTV = { nar:"narrator", rep:"reported thought", fid:"free indirect", dia:"dialogue" };
  function voicesOf(sents){ var v = []; sents.forEach(function(s){ if (v.indexOf(s.v) < 0) v.push(s.v); }); return v.map(function(x){ return SHORTV[x]; }).join(" · "); }
  function shapeHTML(s){
    var n = wc(s.t), idx = Object.keys(s.mc).map(Number).sort(function(a, b){ return a - b; }), first = idx.length ? idx[0] - s.a : -1, cover = idx.length / (s.b - s.a + 1), sh;
    if (s.v === "dia") sh = s.hasM ? "Dialogue in quotation marks, with a speech tag." : "Spoken words in quotation marks.";
    else if (!s.hasM) sh = "A fragment: no main clause. It reads like a thought, not a report.";
    else if (s.c) sh = "Compound: two main clauses, balanced " + (/;/.test(s.t) ? "around a semicolon." : "by “and”.");
    else if (cover >= 0.8) sh = "Simple and direct: the main clause is almost the whole sentence.";
    else if (first >= 3) sh = "Delayed: an opening phrase holds back the main clause.";
    else sh = "Loose: the main clause comes first, and details trail after it.";
    return "<strong>Shape:</strong> " + sh + ' <span class="muted">(' + n + " words" + (n <= 6 ? ", short" : n >= 30 ? ", long" : "") + ")</span>" + (s.hasM ? ' <span class="cz-mckey"><span class="cz-mc">underlined</span>: the main clause</span>' : "");
  }

  // annotation helpers
  function live(par){ return notesOf(par).filter(function(n){ return n.w && n.w.length; }); }
  function ironyFound(){ var c = 0; IRONY.forEach(function(d){ if (live(d.par).some(function(n){ return n.lens === "irony" && annotationStudio.near(n, d); })) c++; }); return c; }
  function annResult(par){
    var p = PARS[par - 1], key = KEY.filter(function(k){ return k.par === par; }), also = ALSO.filter(function(k){ return k.par === par; }), r = annotationStudio.check(live(par), key, also), out = [];
    function span(n){ return esc(joinToks(p.toks, Math.min.apply(null, n.w), Math.max.apply(null, n.w))); }
    r.found.forEach(function(f){ out.push("<p>✓ Found: " + f.d.label + " · “" + esc(MV.plain(f.d.span)) + "”. " + f.d.note + ".</p>"); });
    r.also.forEach(function(f){ out.push("<p>✓ Also a good find: " + f.d.label + " · “" + esc(MV.plain(f.d.span)) + "”. " + f.d.note + ".</p>"); });
    r.misnamed.forEach(function(m){ out.push("<p>◐ “" + span(m.n) + "”: right words, but check the lens (you tagged it " + AL[m.n.lens].label + ").</p>"); });
    r.extra.forEach(function(n){ out.push("<p>✗ “" + span(n) + "” (" + AL[n.lens].label + ") isn’t in this key. Can you defend it with a reason?</p>"); });
    r.missed.forEach(function(d){ if (!r.misnamed.some(function(m){ return m.d === d; })) out.push("<p>○ Still hidden: a " + d.label + " find.</p>"); });
    var all = key.length && r.found.length === key.length && !r.extra.length;
    var head = key.length ? "Key finds: " + r.found.length + " of " + key.length + (r.also.length ? " · " + r.also.length + " more good find" + (r.also.length > 1 ? "s" : "") : "") + (r.extra.length ? " · " + r.extra.length + " not in the key" : "")
      : "This paragraph has no items in the lens key." + (r.also.length ? " You found " + r.also.length + " other good find" + (r.also.length > 1 ? "s" : "") + "." : " Your tags are your own reading.");
    return '<div class="fb' + (all ? " good" : "") + ' cz-resb"><p><strong>' + head + "</strong></p>" + out.join("") + (all ? "<p>Switch to Zoom mode and turn on the lenses to compare notes.</p>" : "") + "</div>";
  }
  function reasonExtra(n, k){
    if (n.lens !== "irony" || S.par > 4) return "";
    return '<div class="e1-parts" role="group" aria-label="Reason for this irony tag"><span class="e1-pl">Reason:</span>' + REASONS.map(function(r){ var on = n.reason === r.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-e1x="' + k + "|" + r.id + '" data-k="e1x' + k + r.id + '">' + r.t + "</button>"; }).join("") + "</div>";
  }

  // painting
  function paintLenses(){
    var el = $("#cz-lenses");
    if (S.mode === "annotate") { el.innerHTML = '<p class="tiny muted" style="margin:0">The lenses are hidden while you annotate. Tag what you notice, then check.</p>'; return; }
    if (S.mode === "tension") { el.innerHTML = ""; return; }
    MV.keepFocus(el, function(){
      el.innerHTML = LZ.map(function(l){ var on = !!S.lenses[l.id]; return '<button type="button" class="an-chip an-' + l.role + '" data-lens="' + l.id + '" data-k="czl' + l.id + '" aria-pressed="' + on + '"><i class="an-dot" aria-hidden="true"></i>' + l.label + "</button>"; }).join("") +
        (S.lenses.imagery ? '<span class="tiny muted cz-fignote">The Imagery lens also shows figures (violet, tagged Figure).</span>' : "");
    });
  }
  function paintMap(){
    var marks = {}; vis().forEach(function(it){ if (marks[it.par - 1] == null) marks[it.par - 1] = it.role; });
    var ti = $("#cz-ti"); ti.className = fx.title ? "an an-syntax" : ""; $("#cz-map .cz-ttag") && $("#cz-map .cz-ttag").remove();
    if (fx.title) ti.insertAdjacentHTML("afterend", '<span class="an-tag an-syntax cz-ttag">Structure · title</span>');
    map.set({ vals:S.tension, model:C.model, showModel:S.model, sel:S.par - 1, edit:S.mode === "tension", marks:S.mode === "tension" ? {} : marks });
    map.hour(fx.hour);
    MV.keepFocus($("#cz-mapbtns"), function(){
      $("#cz-mapbtns").innerHTML = '<button type="button" class="btn ghost sm" id="cz-model" data-k="czmodel" aria-pressed="' + S.model + '">' + (S.model ? "Hide" : "Show") + " one careful reading</button>" +
        (S.mode === "tension" ? '<button type="button" class="btn ghost sm" id="cz-tclear" data-k="cztclear">Clear my points</button>' : '<button type="button" class="btn sm" data-open="' + S.par + '" data-k="czopen">Open paragraph ' + S.par + "</button>");
    });
    $("#cz-maphelp").textContent = S.mode === "tension" ? "Drag across the graph, or use a point’s keys (↑/↓ change it, ←/→ move along), to show how intense Louise’s inner state is in each paragraph, from 0 to 5. Your points are for you; they’re never scored."
      : "Each bar is one paragraph; its height shows the paragraph’s length. Tap a bar to choose a paragraph." + (S.model ? " The dashed line is one careful reading of Louise’s inner tension, not an answer." : "");
    MV.keepFocus($("#cz-mapnotes"), function(){ $("#cz-mapnotes").innerHTML = S.mode === "tension" ? "" : notesHTML(vis(), true); });
  }
  function paintText(){
    var el = $("#cz-text"), L = lvl(), p = P(), h;
    if (L === 1) {
      var r = fx.range || [S.par, S.par]; h = '<div class="cz-pass">';
      for (var n = r[0]; n <= r[1]; n++) { var q = PARS[n - 1]; h += '<p class="cz-par"><span class="eng-ln">par. ' + n + "</span>" + runHTML(q, 0, q.toks.length - 1, { items:vis(function(it){ return it.par === n; }), pulse:fx.pulse }) + "</p>"; }
      h += "</div>" + notesHTML(vis(function(it){ return it.par >= r[0] && it.par <= r[1]; }));
    } else {
      var s = sent(), id = S.par + "-" + S.sent, on = S.sel.indexOf(id) >= 0;
      h = '<p class="cz-sent">' + runHTML(p, s.a, s.b, { items:vis(function(it){ return it.par === S.par; }), under:s.mc, pulse:fx.pulse }) + "</p>" +
        '<p class="cz-cite">(Chopin, par. ' + S.par + ") · sentence " + (S.sent + 1) + " of " + p.sents.length + "</p>" + '<p class="cz-shape">' + shapeHTML(s) + "</p>" +
        '<div class="q-actions cz-selrow"><button type="button" class="btn sm" id="cz-select" data-k="czsel" aria-pressed="' + on + '">' + (on ? "✓ Selected (tap to remove)" : "Select this sentence") + "</button>" +
        (S.sel.length ? '<span class="tiny">Your selection: ' + S.sel.map(function(x){ var a = x.split("-"); return "par. " + a[0] + ", sentence " + (+a[1] + 1); }).join(" · ") + '</span> <button type="button" class="linkbtn" id="cz-selclear" data-k="czselclr">Clear selection</button>' : "") + "</div>" +
        (fx.card ? '<div class="cz-card" role="group" aria-label="Dramatic irony"><div><h4>' + C.ironyCard.left + "</h4><p>" + C.ironyCard.doctors + "</p></div><div><h4>" + C.ironyCard.right + "</h4><p>" + C.ironyCard.reader + "</p></div></div>" : "") +
        notesHTML(vis(function(it){ return it.par === S.par && it.a <= s.b && it.b >= s.a; }));
    }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  function paintAnn(){
    var p = P(), notes = notesOf(S.par);
    if (!studio) studio = annotationStudio($("#cz-studio"), { toks:p.toks, notes:notes, lenses:ALL_L, label:"Paragraph " + S.par + ": tap words to select them", extra:reasonExtra,
      onExtra:function(n, v){ n.reason = n.reason === v ? null : v; api.save(); },
      onChange:function(){ S.res[S.par] = false; $("#cz-res").innerHTML = ""; api.save(); paintRead(); MV.changed(); } });
    else if (studioPar !== S.par) studio.setToks(p.toks, notes);
    studioPar = S.par;
    $("#cz-res").innerHTML = S.res[S.par] ? annResult(S.par) : "";
  }
  function paintWord(){
    var W = C.words, w = word(), p = PARS[w.par - 1], ti = wordTok(w), s = p.sents[sentOf(p, ti)];
    if (!wordRG) {
      $("#cz-word").innerHTML = '<div id="cz-wchips"></div><div id="cz-wcard" aria-live="polite"></div>';
      wordRG = radios($("#cz-wchips"), { label:"Word", aria:"Choose a word", cls:"chips", options:W.map(function(x, i){ return { id:i, t:esc(x.w) + ' <small class="muted">par. ' + x.par + "</small>" }; }), value:S.word,
        onChange:function(v){ S.word = +v; S.par = W[S.word].par; fx = fresh(); api.save(); paint(); } });
    } else wordRG.set(S.word);
    $("#cz-wcard").innerHTML = '<div class="cz-wc"><p class="cz-wbig">' + esc(w.w) + '</p><dl class="cz-wdl"><div><dt>Denotation</dt><dd>' + w.den + "</dd></div><div><dt>Connotation</dt><dd>" + w.con + '</dd></div></dl><div class="cz-why"><h4>Why this word?</h4><p>' + w.why + "</p></div>" +
      '<p class="cz-wsent">' + runHTML(p, s.a, s.b, { items:vis(function(it){ return it.par === w.par; }), hot:ti }) + ' <span class="eng-cite">(Chopin, par. ' + w.par + ")</span></p></div>";
  }
  function paintRead(){
    var L = lvl(), p = P(), rows = [], s = L === 2 ? sent() : null, w = L === 3 ? word() : null;
    if (w) { var wp = PARS[w.par - 1]; s = wp.sents[sentOf(wp, wordTok(w))]; p = wp; }
    var zl = S.mode === "tension" ? "Story · tension graph" : L === 0 ? "Story · 23 paragraphs" : L === 1 ? (fx.range && fx.range[1] > fx.range[0] ? "Paragraph · paragraphs " + fx.range[0] + "–" + fx.range[1] : "Paragraph " + S.par) + (S.mode === "annotate" ? " (Annotate)" : "")
      : L === 2 ? "Sentence · paragraph " + S.par : "Word · “" + esc(w.w) + "” (paragraph " + w.par + ")";
    rows.push(["Zoom level", zl], ["This level asks", "“" + C.levels[L].q + "”"], ["Who is seeing?", L === 0 ? C.seeing.story : C.seeing[p.see]]);
    var whose = L === 0 ? "mostly the narrator; Louise’s own voice rises in pars. 9–19" : L === 1 ? voicesOf(fx.range ? PARS.slice(fx.range[0] - 1, fx.range[1]).reduce(function(a, q){ return a.concat(q.sents); }, []) : p.sents) : C.voices[s.v];
    rows.push(["Whose words?", '<span class="' + (fx.flash ? "cz-flash" : "") + '">' + whose + "</span>"]);
    rows.push(["Devices tagged", L === 0 ? "—" : L === 1 ? devices(p.sents) : devices([s])]);
    rows.push(["Irony flags found", ironyFound() + " of " + IRONY.length + (S.mode === "annotate" ? "" : " (tagged in Annotate mode)")]);
    if (S.mode === "tension") { var v = S.tension[S.par - 1]; rows.push(["Your tension point here", "paragraph " + S.par + ": " + (v == null ? "not placed yet" : v + " of 5")]); }
    $("#cz-read").innerHTML = MV.readoutHTML(rows);
  }
  function paint(){
    var L = lvl();
    modeRG.set(S.mode);
    $("#cz-zoom").hidden = S.mode !== "zoom";
    var rg = $("#cz-range"); rg.value = S.lvl; rg.setAttribute("aria-valuetext", C.levels[S.lvl].label);
    $$(".cz-stop", host).forEach(function(b){ b.setAttribute("aria-pressed", +b.dataset.lvl === S.lvl); });
    $("#cz-pick").hidden = S.mode === "zoom" && L === 3;
    $("#cz-par").value = String(S.par);
    var sl = $("#cz-sl"); sl.hidden = !(S.mode === "zoom" && L === 2);
    if (!sl.hidden) { var ss = $("#cz-sent"); ss.innerHTML = P().sents.map(function(x, i){ return '<option value="' + i + '">' + (i + 1) + " of " + P().sents.length + "</option>"; }).join(""); sent(); ss.value = String(S.sent); }
    paintLenses();
    $("#cz-q").innerHTML = '<span class="cz-ql">' + C.levels[L].label + " level asks:</span> " + C.levels[L].q;
    $("#cz-map").hidden = L !== 0; $("#cz-text").hidden = !(S.mode === "zoom" && (L === 1 || L === 2)); $("#cz-ann").hidden = S.mode !== "annotate"; $("#cz-word").hidden = !(S.mode === "zoom" && L === 3);
    if (L === 0) paintMap(); else map.hour(false);
    if (!$("#cz-text").hidden) paintText();
    if (S.mode === "annotate") paintAnn();
    if (!$("#cz-word").hidden) paintWord();
    paintRead(); MV.changed();
  }
  function stopAll(){ if (speech) MV.eng.stop(); speech = null; }
  function setMode(v){ stopAll(); S.mode = v; fx = fresh(); api.save(); paint(); }
  function setLvl(v){ stopAll(); S.lvl = Math.max(0, Math.min(3, v)); fx = fresh(); if (S.lvl === 3) S.par = word().par; api.save(); paint(); }
  function setPar(n){ stopAll(); S.par = Math.max(1, Math.min(N, n)); S.sent = 0; fx = fresh(); api.save(); paint(); }

  // read aloud: the paragraph (Story, Paragraph, Annotate) or the sentence (Sentence, Word)
  function play(){
    if (speech) { MV.eng.stop(); return; }
    var L = lvl(), p = P(), a = 0, b = p.toks.length - 1, w = null;
    if (S.mode === "zoom" && L === 2) { var s = sent(); a = s.a; b = s.b; }
    if (S.mode === "zoom" && L === 3) { w = word(); p = PARS[w.par - 1]; var s2 = p.sents[sentOf(p, wordTok(w))]; a = s2.a; b = s2.b; }
    var starts = chunkStarts(p.toks, a, b), btn = $("#cz-play");
    function hi(i){ var box = S.mode === "annotate" ? null : $(L === 3 ? "#cz-wcard" : "#cz-text"); if (S.mode === "annotate") { if (studio) studio.speaking(i); return; } if (box) $$("[data-ti]", box).forEach(function(x){ x.classList.toggle("speaking", +x.dataset.ti === i); }); }
    btn.textContent = "Stop";
    speech = speak(joinToks(p.toks, a, b), { onWord:function(k){ hi(starts[k]); }, onEnd:function(){ speech = null; var bb = $("#cz-play"); if (bb) bb.textContent = "Read aloud"; hi(-1); } });
  }
  voiceReady(function(v){ $("#cz-play").hidden = !v; $("#cz-vnote").hidden = !!v; });

  $("#cz-range").addEventListener("input", function(e){ setLvl(+e.target.value); });
  $("#cz-par").addEventListener("change", function(e){ setPar(+e.target.value); });
  $("#cz-sent").addEventListener("change", function(e){ stopAll(); S.sent = +e.target.value; fx = fresh(); api.save(); paint(); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.lvl != null) { setLvl(+b.dataset.lvl); var nb = $('.cz-stop[data-lvl="' + S.lvl + '"]', host); if (nb) nb.focus(); return; }
    if (b.dataset.lens) { S.lenses[b.dataset.lens] = !S.lenses[b.dataset.lens]; fx.pulse = []; fx.card = false; api.save(); paint(); return; }
    if (b.dataset.open) { S.mode = "zoom"; S.lvl = 1; setPar(+b.dataset.open); var t = $("#cz-text"); if (t) t.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    if (b.id === "cz-play") { play(); return; }
    if (b.id === "cz-model") { S.model = !S.model; api.save(); paint(); return; }
    if (b.id === "cz-tclear") { S.tension = PARS.map(function(){ return null; }); api.save(); paint(); return; }
    if (b.id === "cz-select") { var id = S.par + "-" + S.sent, k = S.sel.indexOf(id); if (k < 0) S.sel.push(id); else S.sel.splice(k, 1); api.save(); paint(); return; }
    if (b.id === "cz-selclear") { S.sel = []; api.save(); paint(); var sb = $("#cz-select"); if (sb) sb.focus(); return; }
    if (b.id === "cz-check") { S.res[S.par] = true; api.save(); $("#cz-res").innerHTML = annResult(S.par); paintRead(); MV.focusFb($("#cz-res")); return; }
    if (b.id === "cz-clear") { notesOf(S.par).length = 0; S.res[S.par] = false; api.save(); if (studio) studio.setToks(P().toks, notesOf(S.par)); $("#cz-res").innerHTML = ""; paintRead(); MV.changed(); return; }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest("[data-setup]"); if (!b) return;
    var id = b.dataset.setup; stopAll(); fx = fresh();
    if (id === "tc1") { S.mode = "annotate"; S.par = 5; } else if (id === "tc2") { S.mode = "zoom"; S.lvl = 2; S.par = 12; S.sent = 0; } else if (id === "tc3") { S.mode = "annotate"; S.par = 1; }
    api.save(); paint();
    $("#ex-app").scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
    var f = id === "tc2" ? $("#cz-sent") : $("#cz-studio .eng-tok[tabindex='0']"); if (f) f.focus({ preventScroll:true });
  });

  // ---------- target challenges ----------
  function tc1(){
    var notes = live(5).concat(live(6)), img = notes.filter(function(n){ return n.lens === "imagery"; });
    function inPar(d){ return (d.par === 5 ? live(5) : live(6)); }
    var met = T1.filter(function(d){ return inPar(d).some(function(n){ return n.lens === "imagery" && annotationStudio.near(n, d); }); }).length;
    if (met >= 3) return { ok:true };
    if (T1P && live(5).some(function(n){ return annotationStudio.overlap(n, T1P); })) return { ok:false, msg:C.tc1.peddler.msg };
    if (T1S && live(5).some(function(n){ return annotationStudio.overlap(n, T1S); })) return { ok:false, msg:C.tc1.song.msg };
    if (T1.some(function(d){ return inPar(d).some(function(n){ return n.lens !== "imagery" && annotationStudio.near(n, d); }); })) return { ok:false, msg:"You’ve found a renewal image, but tag it with the Imagery lens." };
    if (T1.some(function(d){ return inPar(d).some(function(n){ return n.lens === "imagery" && annotationStudio.overlap(n, d) && !annotationStudio.near(n, d); }); })) return { ok:false, msg:"One of your Imagery tags covers only part of an image (or too much). Select the whole image; you can be off by one word." };
    if (!img.length) return { ok:false, msg:"In Annotate mode, on paragraphs 5 and 6, select an image of renewal and tag it Imagery." };
    return { ok:false, msg:"You have " + met + " of 3 renewal images. Keep looking in paragraphs 5 and 6." };
  }
  function tc2(){
    var sel = S.sel, A = MV.ans(C.challenges.filter(function(c){ return c.id === "tc2"; })[0]) || [];
    if (!sel.length) return { ok:false, msg:"In Sentence zoom, open a sentence in paragraphs 12–16 and press Select this sentence." };
    if (sel.every(function(x){ return A.indexOf(x) >= 0; })) return { ok:true };
    var W = C.tc2.wrong; for (var k = 0; k < sel.length; k++) if (W[sel[k]]) return { ok:false, msg:W[sel[k]] };
    if (sel.some(function(x){ var n = +x.split("-")[0]; return n < 12 || n > 16; })) return { ok:false, msg:"Stay in paragraphs 12–16 for this challenge. Remove the other sentences from your selection." };
    if (sel.some(function(x){ var a = x.split("-"); return PARS[+a[0] - 1].sents[+a[1]].v === "fid"; })) return { ok:false, msg:"That sentence carries her thoughts too, but its long, formal phrasing still sounds like the narrator. Look for the short questions or exclamations where her own voice takes over most completely." };
    return { ok:false, msg:"Look for questions or exclamations not inside quotation marks: Louise’s voice inside the narrator’s grammar." };
  }
  function tc3(){
    var notes = [1, 2, 3, 4].reduce(function(a, n){ return a.concat(live(n).map(function(x){ return { n:x, par:n }; })); }, []).filter(function(x){ return x.n.lens === "irony"; });
    var good = 0, mis = false, noReason = false;
    T3.forEach(function(d){
      var hit = notes.filter(function(x){ return x.par === d.par && annotationStudio.near(x.n, d); });
      if (!hit.length) return;
      if (hit.some(function(x){ return x.n.reason === d.answer; })) good++; else if (hit.some(function(x){ return x.n.reason; })) mis = true; else noReason = true;
    });
    if (good >= 2) return { ok:true };
    if (T3A && notes.some(function(x){ return x.par === 4 && annotationStudio.overlap(x.n, T3A); })) return { ok:false, msg:C.tc3.armchair.msg };
    if (mis) return { ok:false, msg:C.tc3.mismatch };
    if (noReason) return { ok:false, msg:"Now choose a reason for each Irony tag: the chips under it in “What you’ve marked”." };
    return { ok:false, msg:"Tag two details in paragraphs 1–3 with the Irony lens" + (good ? " (you have one with its reason)" : "") + ", then choose the reason for each." };
  }

  paint();
  EX = { stop:stopAll };
  return {
    predict:{
      start:function(p){
        stopAll(); fx = fresh(); S.mode = "zoom";
        if (p.id === "p1") { S.lvl = 0; fx.title = true; }
        else if (p.id === "p2") { S.lvl = 1; S.par = 5; fx.range = [5, 6]; S.lenses.imagery = false; }
        else if (p.id === "p3") { S.lvl = 2; S.par = 11; S.sent = 1; S.lenses = { pov:true }; }
        else if (p.id === "p4") { S.lvl = 2; S.par = 23; S.sent = 0; S.lenses.irony = false; }
        api.save(); paint();
      },
      run:function(p, done){
        if (p.id === "p1") { fx.hour = true; map.hour(true, function(){ MV.wait(300, done); }); return; }
        if (p.id === "p2") { S.lenses.imagery = true; fx.pulse = KEY.filter(function(k){ return k.lens === "imagery" && (k.par === 5 || k.par === 6); }).map(function(k){ return k.id; }); api.save(); paint();
          MV.wait(1600, function(){ fx.pulse = []; paint(); done(); }); return; }
        if (p.id === "p3") { fx.flash = true; paint(); MV.wait(900, function(){ S.par = 15; S.sent = 2; api.save(); paint(); MV.wait(1400, done); }); return; }
        if (p.id === "p4") { S.lenses.irony = true; fx.card = true; fx.pulse = KEY.filter(function(k){ return k.par === 23; }).map(function(k){ return k.id; }); api.save(); paint();
          MV.wait(1500, function(){ fx.pulse = []; paint(); done(); }); return; }
        done();
      }
    },
    challenge:function(id, opt){
      var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false };
      if (id === "tc3" && r.ok && !(opt && opt.live)) MV.banner("good", MV.plain(C.challenges.filter(function(x){ return x.id === "tc3"; })[0].why));
      return r;
    }
  };
}

// ---------- Part 3: Read it twice (three stations) ----------
var P3 = null;
function part3(host, api){
  var R = api.content.reread, S = api.S, PARS = story().pars;
  S.cards = S.cards || {}; S.spot = S.spot || ""; S.pat = S.pat || {};
  function sentWith(par, q){ var p = PARS[par - 1], r = findIn(p.toks, q); return r ? p.sents[sentOf(p, r[0])].t : p.text; }
  function marked(t, q){ var i = t.indexOf(q); return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark class="rr-mark">' + esc(q) + "</mark>" + esc(t.slice(i + q.length)); }
  var house = '<svg class="rr-plan" viewBox="0 0 400 270" role="img" aria-label="Schematic of the Mallard house: upstairs, Louise’s room with the open window and armchair, a closed door with Josephine kneeling outside; stairs down to the ground floor and the front door." focusable="false">' +
    '<g fill="none" stroke="var(--ink-2)" stroke-width="2" stroke-linejoin="round">' +
      '<polyline points="12,34 200,6 388,34"/><rect x="20" y="34" width="360" height="226"/><line x1="20" y1="146" x2="380" y2="146"/>' +
      '<line x1="226" y1="34" x2="226" y2="80"/><line x1="226" y1="128" x2="226" y2="146"/><line x1="226" y1="80" x2="226" y2="128" stroke="var(--ink)" stroke-width="5"/>' +
      '<line x1="380" y1="58" x2="380" y2="112" stroke="var(--sheet)" stroke-width="4"/><line x1="374" y1="58" x2="386" y2="58"/><line x1="374" y1="112" x2="386" y2="112"/><line x1="380" y1="58" x2="366" y2="66" stroke-dasharray="3 3"/>' +
      '<rect x="322" y="96" width="34" height="30" rx="6"/><line x1="322" y1="106" x2="356" y2="106"/>' +
      '<circle cx="208" cy="112" r="6"/><path d="M208 118 L208 132 M200 140 L208 132 L216 140"/>' +
      '<polyline points="196,146 196,162 180,162 180,178 164,178 164,194 148,194 148,210 132,210 132,226 116,226 116,242 100,242 100,260"/>' +
      '<line x1="20" y1="196" x2="20" y2="258" stroke="var(--ink)" stroke-width="5"/><circle cx="34" cy="228" r="3"/>' +
    '</g><g fill="var(--ink-2)" font-size="12" font-family="var(--font-ui)"><text x="30" y="54">Upstairs</text><text x="30" y="166">Downstairs</text><text x="244" y="140">Louise’s room</text><text x="96" y="100">Landing</text></g></svg>';
  host.innerHTML = '<div class="rr">' +
    '<section class="rr-st" aria-labelledby="rr-h1"><h3 id="rr-h1">Station 1: Then and now</h3><p class="how">Your first-read notes are on the left. On the right are six details a second read changes. For each, say whether you noticed it the first time, and write one line: “Now I think…”. Nothing here is scored.</p>' +
      '<div class="rr-two"><div class="rr-then"><h4>Your first read</h4><div id="rr-notes"></div></div><div class="rr-now"><h4>Second read</h4><div id="rr-cards"></div></div></div>' +
      '<details class="alg"><summary>Check it with the text</summary><div class="rr-text">' + R.details.map(function(d){ return '<p><span class="an-tag an-theme">par. ' + d.par + "</span> " + marked(sentWith(d.par, d.q), d.q) + ' <span class="eng-cite">(Chopin, par. ' + d.par + ")</span></p>"; }).join("") + "</div></details></section>" +
    '<section class="rr-st" aria-labelledby="rr-h2"><h3 id="rr-h2">Station 2: Windows and doors</h3><p class="how">Tap each place in the house to see its quotation. Then build a sentence about the pattern.</p>' +
      '<div class="rr-house"><div class="rr-planw">' + house + R.house.map(function(x){ return '<button type="button" class="rr-hot rr-hot-' + x.id + '" data-hot="' + x.id + '" data-k="rrh' + x.id + '" aria-pressed="false">' + x.label + "</button>"; }).join("") + '</div><div class="rr-quote" id="rr-quote" aria-live="polite"></div></div>' +
      '<h4 class="rr-pq">' + R.pattern.q + '</h4><div id="rr-pw"></div><div id="rr-pd"></div><p class="rr-sent" id="rr-psent" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn primary sm" id="rr-pcheck">Check my sentence</button></div><div id="rr-pfb"></div></section>' +
    '<section class="rr-st" aria-labelledby="rr-h3"><h3 id="rr-h3">Station 3: Her world</h3><p class="how">Three short context cards. Read them, then reread paragraph 14.</p><div class="rr-world">' +
      R.world.cards.map(function(c){ return '<div class="rr-wc"><h4>' + c.title + "</h4><p>" + c.text + '</p><p class="tiny muted rr-ver">' + R.world.verify + "</p></div>"; }).join("") + "</div>" +
      '<p class="rr-p14">' + esc(PARS[13].text) + ' <span class="eng-cite">(Chopin, par. 14)</span></p>' +
      '<div class="jq"><label for="rr-world">' + R.world.prompt + '</label><textarea id="rr-world"></textarea><div class="saved" id="rr-world-s" aria-live="polite"></div></div></section></div>';
  function paintNotes(){ var t = (MV.S.writes.firstRead || "").trim(); $("#rr-notes").innerHTML = t ? '<div class="rr-fr">' + esc(t).replace(/\n/g, "<br>") + "</div>" : '<p class="tiny muted">You haven’t written first-read notes yet. They’re in Start, under the story. Write what you remember of your first reading there, then come back.</p>'; }
  $("#rr-cards").innerHTML = R.details.map(function(d){ return '<div class="rr-card" data-card="' + d.id + '"><p class="rr-q"><span class="an-tag an-theme">Second read</span> “' + esc(MV.plain(d.q)) + '” <span class="muted">(par. ' + d.par + ')</span></p><div class="rr-seen" id="rr-seen-' + d.id + '"></div><label class="vh" for="rr-now-' + d.id + '">Now I think… (about ' + esc(MV.plain(d.label)) + ')</label><input class="txtin" type="text" id="rr-now-' + d.id + '" data-now="' + d.id + '" placeholder="Now I think…" autocomplete="off"></div>'; }).join("");
  R.details.forEach(function(d){
    var st = S.cards[d.id] || (S.cards[d.id] = {});
    radios($("#rr-seen-" + d.id), { aria:"About " + MV.plain(d.label), cls:"chips", options:R.seen, value:st.seen || "", onChange:function(v){ st.seen = v; api.save(); } });
    $("#rr-now-" + d.id).value = st.now || "";
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.now) { (S.cards[t.dataset.now] || (S.cards[t.dataset.now] = {})).now = t.value; api.save(); }
    else if (t.id === "rr-world") { S.world = t.value; api.save(); $("#rr-world-s").textContent = "Saved"; }
  });
  $("#rr-world").value = S.world || "";
  function paintSpot(){
    $$(".rr-hot", host).forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.hot === S.spot); });
    var x = R.house.filter(function(h){ return h.id === S.spot; })[0];
    $("#rr-quote").innerHTML = x ? "<h4>" + x.label + ' <span class="muted tiny">(' + x.pars + ")</span></h4>" + x.quotes.map(function(q){ return '<p class="rr-qq">“' + esc(MV.plain(q.q)) + '” <span class="eng-cite">(Chopin, par. ' + q.par + ")</span></p>"; }).join("") : '<p class="tiny muted">Tap a place in the house.</p>';
  }
  var Pt = R.pattern;
  function patSentence(){
    var w = Pt.windows.filter(function(x){ return x.id === S.pat.w; })[0], d = Pt.doors.filter(function(x){ return x.id === S.pat.d; })[0];
    $("#rr-psent").innerHTML = Pt.a + " <strong>" + (w ? w.t : "___") + "</strong>, " + Pt.b + " <strong>" + (d ? d.t : "___") + "</strong>.";
  }
  radios($("#rr-pw"), { label:"Window", cls:"chips", options:Pt.windows, value:S.pat.w || "", onChange:function(v){ S.pat.w = v; S.pat.fb = null; api.save(); patSentence(); $("#rr-pfb").innerHTML = ""; } });
  radios($("#rr-pd"), { label:"Doors", cls:"chips", options:Pt.doors, value:S.pat.d || "", onChange:function(v){ S.pat.d = v; S.pat.fb = null; api.save(); patSentence(); $("#rr-pfb").innerHTML = ""; } });
  function patCheck(){
    var w = Pt.windows.filter(function(x){ return x.id === S.pat.w; })[0], d = Pt.doors.filter(function(x){ return x.id === S.pat.d; })[0];
    if (!w || !d) return MV.fbHTML("", "Choose a phrase for each blank first.");
    if ((MV.ans(Pt) || []).indexOf(w.id + "|" + d.id) >= 0) return MV.fbHTML("good", "<strong>✓ Right.</strong> " + Pt.right);
    return MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + [w.fb, d.fb].filter(Boolean).join(" ") + " Try another phrase.");
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.hot) { S.spot = b.dataset.hot; api.save(); paintSpot(); return; }
    if (b.id === "rr-pcheck") { S.pat.fb = true; api.save(); $("#rr-pfb").innerHTML = patCheck(); MV.focusFb($("#rr-pfb")); }
  });
  paintNotes(); paintSpot(); patSentence(); if (S.pat.fb) $("#rr-pfb").innerHTML = patCheck();
  // Sentence to steal: save the imitation to the commonplace book on request
  var steal = $('.mv-block[data-block="steal"]');
  if (steal) {
    var row = document.createElement("div"); row.className = "q-actions";
    row.innerHTML = '<button type="button" class="btn ghost sm" id="steal-save">Save my imitation to my commonplace book</button><span class="tiny muted" id="steal-st" aria-live="polite"></span>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "steal-save") return;
      var t = (MV.S.writes.steal || "").trim();
      $("#steal-st").textContent = t ? (MV.eng.saveLine(t, "My imitation of Chopin, “The Story of an Hour”, par. 14") ? "Saved to your commonplace book." : "") : "Write your imitation first.";
    });
  }
  P3 = { refresh:paintNotes };
  return P3;
}

// ---------- Practice 2: unseen short-short story (passage + the toolkit's practice multiple choice) ----------
function unseen(host, api, a){
  host.innerHTML = '<div class="un-pass"></div><div class="un-q"></div>';
  MV.eng.passage($(".un-pass", host), a.passage, { kind:"prose", cite:a.cite });
  return MV.activityTypes.mc($(".un-q", host), a);
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 01; numbered sentences) ----------
// a: {id, student, summary, problems:[{id, goal, task, steps:[sentences], answer: index of first flawed sentence, stepFb:[…],
//      fixes:[{t, ok, why}], hints:[3]}]}
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

// ---------- @component E6 paragraphBuilder — claim / evidence / analysis / link slots in the paragraph-part colours, an MLA
// paragraph-citation builder per evidence slot, a free-form mode, and the structure tests of the checklist (course plan E6) ----------
// para.tests(text, {link, explain, verbs}) -> [title+author, ≥2 cited quotations, quotations introduced, ≥2 analysis verbs,
//   150–250 words, "so what" ≥ 12 words, craft statement ≥ 40 words]. Quotations: "…" or “…”; the title "The Story of an Hour" is
//   not counted as a quotation; a quotation is ≥ 2 words. Citations: (Chopin, par. 5) / (par. 5) / (pars. 5–6), hyphen or en dash.
var para = {
  QRE:/["“]([^"“”]*)["”]/g,
  CITE:/\((?:Chopin, )?pars?\. \d+(?:[–-]\d+)?\)/,
  quotes:function(t){ var out = [], m, re = new RegExp(para.QRE.source, "g"); while ((m = re.exec(t))) out.push({ a:m.index, b:m.index + m[0].length, inner:m[1] }); return out; },
  isTitle:function(q){ return /^\s*the story of an hour[,.]?\s*$/i.test(q.inner); },
  mask:function(t){
    var s = t.replace(/\b(Mrs|Mr|Dr|St|pars?)\./g, function(x){ return x.slice(0, -1) + "_"; });
    s = s.replace(/["“][^"“”]*["”]/g, function(x){ var inner = x.slice(1, -1), last = /[.!?]$/.test(inner) ? inner.slice(-1) : ""; return x[0] + inner.slice(0, inner.length - last.length).replace(/[.!?]/g, "_") + last + x.slice(-1); });
    return s.replace(/\([^()]*\)/g, function(x){ return x.replace(/[.!?]/g, "_"); });
  },
  ends:function(t){ var m = para.mask(t), out = [0], re = /[.!?]["”’)]*\s+(?=["“‘(]?[A-Z])|[.!?]\s+/g, x; while ((x = re.exec(m))) out.push(x.index + x[0].length); return out; },
  before:function(t, q, ends){ var s = 0; ends.forEach(function(e){ if (e <= q.a) s = e; }); return wc(t.slice(s, q.a)); },
  lastSentence:function(t){ var e = para.ends(t); return t.slice(e[e.length - 1]).trim(); },
  verbRE:function(v){
    var base = /ies$/.test(v) ? v.slice(0, -3) + "y" : /oes$/.test(v) ? v.slice(0, -2) : /(se|me|te)s$/.test(v) ? v.slice(0, -1) : v.slice(0, -1);
    var f = /y$/.test(base) ? [base, base.slice(0, -1) + "ies", base.slice(0, -1) + "ied", base + "ing"] : /e$/.test(base) ? [base, base + "s", base + "d", base.slice(0, -1) + "ing"]
      : /cut$/.test(base) ? [base, base + "s", base + "ting"] : /o$/.test(base) ? [base, base + "es", base + "ed", base + "ing"] : [base, base + "s", base + "ed", base + "ing"];
    return new RegExp("\\b(" + f.join("|") + ")\\b", "i");
  },
  tests:function(t, o){
    t = String(t || ""); var Q = para.quotes(t).filter(function(q){ return !para.isTitle(q) && wc(q.inner) >= 2; }), ends = para.ends(t);
    var c1 = /["“]\s*The Story of an Hour[,.]?\s*["”]/i.test(t) && /\bChopin\b/.test(t);
    var c2 = Q.filter(function(q){ var m = t.slice(q.b).match(para.CITE); return !!m && m.index <= 30; }).length >= 2;
    var c3 = Q.length > 0 && Q.every(function(q){ return para.before(t, q, ends) >= 3; });
    var c4 = (o.verbs || []).filter(function(v){ return para.verbRE(v).test(t); }).length >= 2;
    var n = wc(t), c5 = n >= 150 && n <= 250;
    var c6 = wc(o.link != null ? o.link : para.lastSentence(t)) >= 12;
    var c7 = wc(o.explain) >= 40;
    return [c1, c2, c3, c4, c5, c6, c7];
  }
};
var task = (function(){
  var api = null, T = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function clean(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
  function pairs(S){ return S.ev && S.ev.length >= 2 ? S.ev : [{ e:"", a:"" }, { e:"", a:"" }]; }
  function parts(S){ var out = [["claim", "Claim", S.claim]]; pairs(S).forEach(function(p, k){ out.push(["ev", "Evidence " + (k + 1), p.e], ["an", "Analysis " + (k + 1), p.a]); }); out.push(["link", "Link", S.link]); return out.filter(function(x){ return clean(x[2]); }); }
  function data(S){
    S = S || {}; var free = S.mode === "free", text = free ? clean(S.free) : parts(S).map(function(x){ return clean(x[2]); }).join(" ");
    return { mode:free ? "free" : "build", text:text, link:free ? null : clean(S.link), explain:explain(), focus:S.focus || "", own:S.own || "" };
  }
  function checks(d){ return para.tests(d.text, { link:d.link, explain:d.explain, verbs:(T || MV.C.task).verbs }); }
  function cite(k){ var a = $('[data-mla-a="' + k + '"]'), b = $('[data-mla-b="' + k + '"]'), au = $('[data-mla-au="' + k + '"]'); if (!a) return ""; var to = b && b.value && +b.value > +a.value ? +b.value : 0; return "(" + (au && au.checked ? "Chopin, " : "") + (to ? "pars. " + a.value + "–" + to : "par. " + a.value) + ")"; }
  function slot(cls, id, tag, label, attrs){ return '<div class="pb-slot ' + cls + '"><label for="' + id + '"><span class="pb-tag">' + tag + "</span> " + label + '</label><textarea id="' + id + '" ' + attrs + "></textarea></div>"; }
  function buildHTML(S){
    var P = pairs(S), opts = story().pars.map(function(p){ return '<option value="' + p.n + '">' + p.n + "</option>"; }).join("");
    return slot("pb-claim", "pb-claim", "Claim", "What does your pattern, technique or detail do? Name the story and Chopin.", 'data-pb="claim"') +
      P.map(function(p, k){
        return '<div class="pb-pair">' + slot("pb-ev", "pb-e" + k, "Evidence " + (k + 1), "Introduce a quotation in your own words, quote it exactly, then cite it.", 'data-pb="e" data-i="' + k + '"') +
          '<div class="pb-mla" role="group" aria-label="MLA citation builder for evidence ' + (k + 1) + '"><label>par. <select class="cz-sel" data-mla-a="' + k + '">' + opts + '</select></label><label>to <select class="cz-sel" data-mla-b="' + k + '"><option value="">none</option>' + opts + "</select></label>" +
            '<label class="pb-chk"><input type="checkbox" data-mla-au="' + k + '"' + (k === 0 ? " checked" : "") + "> name Chopin</label>" + '<button type="button" class="btn ghost sm" data-mla="' + k + '" data-k="pbm' + k + '">Insert (Chopin, par. 1)</button></div>' +
          slot("pb-an", "pb-a" + k, "Analysis " + (k + 1), "What do the words do? Use an analysis verb.", 'data-pb="a" data-i="' + k + '"') + "</div>";
      }).join("") +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-pbadd="1" data-k="pbadd"' + (P.length >= 4 ? " disabled" : "") + '>Add evidence and analysis</button><button type="button" class="btn ghost sm" data-pbrm="1" data-k="pbrm"' + (P.length <= 2 ? " disabled" : "") + ">Remove the last pair</button></div>" +
      slot("pb-link", "pb-link", "Link", "So what? What does the pattern reveal about Louise, or about her world?", 'data-pb="link"');
  }
  function fill(S){
    var P = pairs(S); $("#pb-claim").value = S.claim || ""; $("#pb-link").value = S.link || "";
    P.forEach(function(p, k){ $("#pb-e" + k).value = p.e || ""; $("#pb-a" + k).value = p.a || ""; });
    $$("[data-mla]").forEach(function(b){ b.textContent = "Insert " + cite(b.dataset.mla); });
  }
  function counts(){
    var d = data(api.S), n = wc(d.text), q = para.quotes(d.text).filter(function(x){ return !para.isTitle(x) && wc(x.inner) >= 2; }).length;
    $("#pb-count").textContent = n + " word" + (n === 1 ? "" : "s") + " (150–250) · " + q + " quotation" + (q === 1 ? "" : "s");
  }
  function preview(){
    var S = api.S, el = $("#pb-pv"); if (!el) return;
    if (S.mode === "free") { el.innerHTML = clean(S.free) ? "<p>" + esc(clean(S.free)) + "</p>" : '<p class="tiny muted">Your paragraph appears here.</p>'; return; }
    var ps = parts(S);
    el.innerHTML = ps.length ? "<p>" + ps.map(function(x){ return '<span class="pb-p pb-p-' + x[0] + '"><span class="pb-ptag">' + x[1] + "</span>" + esc(clean(x[2])) + "</span>"; }).join(" ") + "</p>" : '<p class="tiny muted">Your paragraph appears here as you fill the slots, coloured by part: claim, evidence, analysis, link.</p>';
  }
  function models(){
    var el = $("#pt-models"); if (!el) return;
    var ok = checks(data(api.S)).every(Boolean);
    el.innerHTML = ok ? '<div class="fb good"><p><strong>✓ ' + T.success + "</strong></p></div>" + T.models.map(function(m){ return '<details class="alg pt-model"><summary>' + m.title + '</summary><p class="pt-mtext">' + m.text + "</p></details>"; }).join("") : "";
  }
  function focusPaint(){ var f = T.focus.filter(function(x){ return x.id === api.S.focus; })[0]; $("#pb-look").innerHTML = f ? f.look : "Optional: choose a starting point."; $("#pb-own-w").hidden = api.S.focus !== "own"; }
  function all(){ api.save(); counts(); preview(); api.update(); models(); MV.paintSummary(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S; S.mode = S.mode === "free" ? "free" : "build"; S.ev = pairs(S);
      inp.innerHTML = '<div id="pb-focus"></div><p class="tiny muted" id="pb-look"></p><div class="mk-own" id="pb-own-w" hidden><label for="pb-own">Your own focus</label><input id="pb-own" class="txtin" type="text" autocomplete="off"></div>' +
        '<div id="pb-mode"></div><div id="pb-build"></div><div id="pb-free"><div class="jq"><label for="pb-freet">Your paragraph (free-form)</label><textarea id="pb-freet" class="pb-big" data-pb="free"></textarea><p class="tiny muted">Free-form keeps its own text; the builder’s slots stay as they were.</p></div></div><p class="tiny muted" id="pb-count" aria-live="polite"></p>';
      pv.innerHTML = '<h4 style="margin-top:0">Your paragraph</h4><div id="pb-pv" class="pb-pv"></div><div id="pt-models"></div>';
      radios($("#pb-focus"), { label:"Focus", aria:"Focus: optional starting points", cls:"chips", options:T.focus, value:S.focus || "", onChange:function(v){ S.focus = v; focusPaint(); all(); } });
      radios($("#pb-mode"), { label:"Write with", cls:"seg", options:[{ id:"build", t:"Paragraph builder" }, { id:"free", t:"Free-form" }], value:S.mode,
        onChange:function(v){ S.mode = v; if (v === "free" && !clean(S.free)) { S.free = parts(S).map(function(x){ return clean(x[2]); }).join(" "); $("#pb-freet").value = S.free; } show(); all(); } });
      function show(){ $("#pb-build").hidden = S.mode === "free"; $("#pb-free").hidden = S.mode !== "free"; }
      function build(){ $("#pb-build").innerHTML = buildHTML(S); fill(S); }
      build(); show(); focusPaint();
      $("#pb-freet").value = S.free || ""; $("#pb-own").value = S.own || "";
      inp.addEventListener("input", function(e){
        var t = e.target, kind = t.dataset.pb;
        if (t.id === "pb-own") { S.own = t.value; all(); return; }
        if (!kind) return;
        var v = t.value, nv = v.replace(/(pars?\.\s*\d+)-(?=\d)/g, "$1–");
        if (nv !== v) { var p0 = t.selectionStart, p1 = t.selectionEnd; t.value = nv; t.setSelectionRange(p0, p1); v = nv; }
        if (kind === "claim") S.claim = v; else if (kind === "link") S.link = v; else if (kind === "free") S.free = v;
        else if (kind === "e") S.ev[+t.dataset.i].e = v; else if (kind === "a") S.ev[+t.dataset.i].a = v;
        all();
      });
      inp.addEventListener("change", function(e){ if (e.target.closest(".pb-mla")) $$("[data-mla]").forEach(function(b){ b.textContent = "Insert " + cite(b.dataset.mla); }); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        if (b.dataset.pbadd) { S.ev.push({ e:"", a:"" }); build(); all(); var f = $("#pb-e" + (S.ev.length - 1)); if (f) f.focus(); return; }
        if (b.dataset.pbrm) { if (S.ev.length > 2) S.ev.pop(); build(); all(); var g = $('[data-pbadd]'); if (g) g.focus(); return; }
        if (b.dataset.mla != null) {
          var k = +b.dataset.mla, ta = $("#pb-e" + k), c = cite(k), v = ta.value, pos = ta.selectionEnd == null ? v.length : ta.selectionEnd;
          if (pos === v.length && /[.!?]\s*$/.test(v)) pos = v.replace(/\s+$/, "").length - 1;
          var pre = v.slice(0, pos), ins = (pre && !/\s$/.test(pre) ? " " : "") + c;
          ta.value = pre + ins + v.slice(pos); S.ev[k].e = ta.value; ta.focus(); ta.setSelectionRange(pos + ins.length, pos + ins.length); all();
        }
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ api.update(); models(); });
      counts(); preview(); models();
    },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text ? true : "Write your paragraph first."; },
    checks:checks,
    summary:function(ts){
      var S = ts.app || {}, d = data(S), ok = checks(d).every(Boolean), Tk = MV.C.task, L = [];
      var f = Tk.focus.filter(function(x){ return x.id === d.focus; })[0];
      L.push(Tk.summary + ": " + (ok ? "complete" : "not complete yet"));
      L.push("  Focus: " + (f ? (d.focus === "own" ? (clean(d.own) || "my own") : MV.plain(f.t)) : "not chosen") + "; written with the " + (d.mode === "free" ? "free-form box" : "paragraph builder"));
      L.push("  The paragraph (" + wc(d.text) + " words):");
      L.push("    " + (d.text || "(not written yet)"));
      return L;
    }
  };
})();

// ---------- Reflect extras: sample principles, trivium tag, commonplace book, first-read notes and Station 3 back ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) { var d = document.createElement("div"); d.id = "art-samples"; d.className = "art-samples"; d.innerHTML = R.artSamples; sheet.insertBefore(d, art); }
  MV.eng.triviumPicker();
  var cp = $("#cp-app"), P = story().pars; if (cp) MV.eng.commonplace(cp, { lines:R.commonplaceLines.map(function(r){ return P[r[0] - 1].sents[r[1]].t + " (Chopin, par. " + r[0] + ")"; }) });
}
function paintBack(){
  var el = $("#rf-back"); if (!el) return;
  var fr = (MV.S.writes.firstRead || "").trim(), p3 = MV.S.app.part3 || {}, w = (p3.world || "").trim(), cards = p3.cards || {}, D = MV.C.part3.reread.details;
  var lines = D.filter(function(d){ return cards[d.id] && (cards[d.id].now || "").trim(); }).map(function(d){ return "<li>" + d.label + ": " + esc(cards[d.id].now.trim()) + "</li>"; });
  el.innerHTML = '<div class="rf-b"><h4>Your first-read notes</h4>' + (fr ? "<p>" + esc(fr).replace(/\n/g, "<br>") + "</p>" : '<p class="tiny muted">Not written yet (Start, under the story).</p>') + "</div>" +
    (lines.length ? '<div class="rf-b"><h4>Your second-read lines (“Now I think…”)</h4><ul>' + lines.join("") + "</ul></div>" : "") +
    '<div class="rf-b"><h4>Her world: your answer</h4>' + (w ? "<p>" + esc(w).replace(/\n/g, "<br>") + "</p>" : '<p class="tiny muted">Not written yet (Read it twice, Station 3).</p>') + "</div>";
}

MV.module({
  hero:function(f){
    // the Art of Language example chips are story sentences (content keeps references); initArt runs after this hook
    var A = MV.C.reflect.art, P = story().pars; if (A && A.exampleRefs) A.examples = A.exampleRefs.map(function(r){ return r[1].map(function(k){ return P[r[0] - 1].sents[k].t; }).join(" ") + " (Chopin, par. " + r[0] + ")"; });
    hero(); RD = reading();
  },
  explore:function(host, api){ var r = explore(host, api); try { extras(); } catch (e) { console.error(e); } return r; },
  part3:part3,
  activities:{ unseen:unseen, spot:spotProse },
  task:task,
  onShow:function(v){ MV.eng.stop(); if (EX) EX.stop(); if (RD) RD.stop(); if (v === "reread" && P3) P3.refresh(); if (v === "reflect") paintBack(); }
});
})();
