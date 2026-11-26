// ENG4U 15 Indigenous Voices & Thomas King: hero (King's Truth line word by word over two border booths and a car, "Blackfoot."
// above the car, the four questions), Tellings switcher (Explore: Mode 1 four tellings with detail marks, Compare two, the Four
// Questions, a silence strip, readout and the TC3 silence map; Mode 2 an E2-style oral-storytelling lens with Johnson's "The Two
// Sisters" card; Mode 3 the student's own quotations), Reading responsibly (Part 3 stations 1–5, Station 6 behind ?station6=on),
// Specific or sweeping? (toolkit sorter), "The Corn Husker" (custom: poem + toolkit MC), Spot the Error (K13 spotProse) and
// "A reader's response, in my own voice" (E6 paragraph builder). Texts, slots and VERIFY notes: content.mjs.
// Teacher note: Station 6 ("who is an author speaking for?") is off by default; open the module with ?station6=on to show it.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function clean(s){ return String(s || "").replace(/\s+/g, " ").trim(); }
function EXC(){ return MV.C.explore; }
function EXS(){ return MV.S.app.explore || (MV.S.app.explore = {}); }

// ---------- @component radioGroup (copied from ENG4U 14; no option needs to be checked) ----------
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

// ---------- hero: King's line word by word; two booths and a car draw themselves; "Blackfoot." holds; the four questions ----------
var HR = { run:0 };
function heroSVG(H){
  var words = H.line.split(/\s+/), cut = 6, L1 = words.slice(0, cut), L2 = words.slice(cut);
  function tsp(list, off){ return list.map(function(w, i){ return '<tspan class="iv-hw" data-wi="' + (i + off) + '">' + esc(w) + "</tspan>"; }).join(" "); }
  var h = '<svg class="iv-hsvg" viewBox="0 0 420 300" role="img" aria-label="' + esc(H.aria) + '" focusable="false">';
  h += '<text class="iv-hline" x="210" y="30" text-anchor="middle">' + tsp(L1, 0) + '</text><text class="iv-hline" x="210" y="58" text-anchor="middle">' + tsp(L2, cut) + "</text>";
  var P = [
    ["road", "M8 232 H412 M96 246 H120 M150 246 H174 M204 246 H228 M258 246 H282 M312 246 H336"],
    ["boothL", "M22 232 V150 H74 V232 M14 150 L48 130 L82 150 M32 166 H64 V190 H32 Z M74 200 H96"],
    ["boothR", "M346 232 V150 H398 V232 M338 150 L372 130 L406 150 M356 166 H388 V190 H356 Z M324 200 H346"],
    ["car", "M158 226 V210 L176 210 L190 192 H236 L252 210 H266 V226 Z M194 208 L204 196 H230 L240 208 Z M176 226 a10 10 0 1 0 20 0 M228 226 a10 10 0 1 0 20 0"]
  ];
  P.forEach(function(p, k){ h += '<path class="iv-hd iv-hd-' + p[0] + '" data-hd="' + k + '" pathLength="1" d="' + p[1] + '"/>'; });
  h += '<text class="iv-hbf" x="212" y="176" text-anchor="middle">' + esc(H.word) + "</text>";
  var Q = H.questions, pos = [[112, 268], [318, 268], [112, 292], [318, 292]];
  Q.forEach(function(q, i){ h += '<text class="iv-hq" data-hq="' + i + '" x="' + pos[i][0] + '" y="' + pos[i][1] + '" text-anchor="middle">' + esc(q) + "</text>"; });
  return { svg:h + "</svg>", n:words.length, parts:P.length, nq:Q.length };
}
function hero(){
  var H = MV.C.hero, host = $("#iv-hero"); if (!host) return;
  var g = heroSVG(H);
  host.innerHTML = '<div class="iv-hwrap">' + g.svg + '</div><p class="eng-cite iv-hcite">' + H.cite + " · “" + esc(H.word) + "” " + H.wordCite + "</p>" +
    '<div class="iv-hctl"><button type="button" class="btn ghost sm" id="iv-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="iv-hagain" hidden>' + H.watch + '</button><span class="tiny muted" id="iv-hnote" hidden>' + H.noVoice + "</span></div>";
  var svg = $(".iv-hsvg", host), W = $$(".iv-hw", svg), tok = null;
  function words(n, speak){ W.forEach(function(e, i){ e.classList.toggle("on", i <= n); e.classList.toggle("speaking", !!speak && i === n); }); }
  function cls(sel, c, on){ $$(sel, svg).forEach(function(e){ e.classList.toggle(c, on); }); }
  function reset(){ host.classList.remove("done"); words(-1); cls(".iv-hd", "on", false); cls(".iv-hbf", "on", false); cls(".iv-hq", "on", false); }
  function finish(){ host.classList.add("done"); words(g.n - 1); cls(".iv-hd", "on", true); cls(".iv-hbf", "on", true); cls(".iv-hq", "on", true); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run, t = 300; MV.eng.stop(); reset();
    for (var i = 0; i < g.n; i++) (function(i){ at(me, t, function(){ words(i, false); }); t += 340; })(i);
    t += 300;
    for (var k = 0; k < g.parts; k++) (function(k){ at(me, t + k * 450, function(){ var e = $('[data-hd="' + k + '"]', svg); if (e) e.classList.add("on"); }); })(k);
    t += g.parts * 450 + 300;
    at(me, t, function(){ cls(".iv-hbf", "on", true); });
    t += 1400;
    for (var q = 0; q < g.nq; q++) (function(q){ at(me, t + q * 650, function(){ var e = $('[data-hq="' + q + '"]', svg); if (e) e.classList.add("on"); }); })(q);
    at(me, t + g.nq * 650 + 200, finish);
  }
  function listen(){
    var me = ++HR.run; if (tok) tok.stop();
    finish(); words(-1);
    tok = { stopped:false, stop:function(){ this.stopped = true; MV.eng.stop(); } };
    var tk = tok;
    MV.eng.say(H.line, { voice:VOICE, rate:0.85, onWord:function(k){ if (me === HR.run && !tk.stopped) words(k, true); }, onEnd:function(){ if (me === HR.run) words(g.n - 1); } });
  }
  function btns(){ $("#iv-hlisten").hidden = !VOICE; $("#iv-hagain").hidden = MV.reduceMotion; $("#iv-hnote").hidden = !!VOICE; }
  $("#iv-hlisten").addEventListener("click", listen);
  $("#iv-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) { host.classList.add("iv-still"); finish(); } else animate();
  voiceReady(btns);
  HR.stop = function(){ if (tok) { tok.stop(); tok = null; } MV.eng.stop(); if (!host.classList.contains("done")) { HR.run++; finish(); } };
}

// ---------- Explore: @component tellingsSwitcher — tellings by detail ID (E1 spans as focusable buttons), Compare two, the Four
// Questions, marks ("only here" teal / "left out elsewhere" magenta, with text tags), a silence strip and a readout ----------
var EX = null;
function allDetails(T){ var out = []; T.groups.forEach(function(g){ g.d.forEach(function(d){ out.push(d); }); }); return out; }
function evSet(T){ var s = {}; allDetails(T).forEach(function(d){ d.ev.forEach(function(e){ s[e] = 1; }); }); return s; }
function telOf(did){ var r = null; EXC().tellings.forEach(function(T){ allDetails(T).forEach(function(d){ if (d.id === did) r = T; }); }); return r; }
function detail(did){ var r = null; EXC().tellings.forEach(function(T){ allDetails(T).forEach(function(d){ if (d.id === did) r = d; }); }); return r; }

function explore(host, api){
  var C = api.content, S = api.S, FQ = C.fq, V = C.voice, MI = C.mine;
  S.mode = S.mode || "tell"; S.tel = S.tel || "son"; S.tel2 = S.tel2 || "i1"; S.cmp = !!S.cmp; S.sel = S.sel || "";
  S.mk = S.mk || {}; S.fq = S.fq || {}; S.tc3 = Array.isArray(S.tc3) ? S.tc3 : []; S.vt = S.vt || {}; S.lens = S.lens || {}; S.mine = Array.isArray(S.mine) ? S.mine : [];
  V.feats.forEach(function(f){ if (S.lens[f.id] == null) S.lens[f.id] = true; });
  var fx = {}, run = { n:0 }, speak = null;
  function T(id){ return byId(C.tellings, id); }
  function fq(id){ return S.fq[id] || (S.fq[id] = {}); }

  host.innerHTML = '<div class="iv-ex">' +
    '<details class="iv-copyd" id="iv-copyd"' + (S.copyClosed ? "" : " open") + '><summary>' + C.copy.title + '</summary><div id="iv-copy"></div></details>' +
    '<div id="iv-mode"></div><p class="how iv-how" id="iv-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="iv-main" data-mv="graph" id="iv-main"></div></div>';
  var modeRG = radios($("#iv-mode", host), { label:"Mode", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  $("#iv-copyd", host).addEventListener("toggle", function(){ S.copyClosed = !$("#iv-copyd", host).open; api.save(); });

  // ----- "Read in your copy" card: the six excerpt slots (EXCERPT SLOT when filled) -----
  (function(){
    var h = "<p>" + C.copy.text + "</p><p>" + C.copy.pageNote + '</p><ol class="iv-slots">' + C.slots.map(function(s, i){
      var body = s.paras && s.paras.length ? '<div class="eng-passage eng-prose iv-story">' + s.paras.map(function(p){ return "<p>" + esc(p.t) + "</p>"; }).join("") + "</div>" : "";
      return '<li><span class="iv-sn">X' + (i + 1) + "</span> <strong>" + s.name + "</strong> <span class='eng-cite'>(King " + s.pg + ")</span><br><span class='tiny'>" + s.where + "</span>" + body + "</li>";
    }).join("") + "</ol>";
    $("#iv-copy", host).innerHTML = h;
  })();

  function setMode(v){ stopFx(); MV.banner("", ""); S.mode = v; modeRG.set(v); api.save(); paint(); MV.changed(); }
  function stopFx(){ run.n++; if (speak) { speak = null; MV.eng.stop(); } fx = {}; }

  // ----- one telling as a panel of detail buttons -----
  function marked(did){ return S.mk[did] || ""; }
  function detailBtn(d, o){
    o = o || {};
    var m = marked(d.id), c = "iv-d";
    if (m === "only") c += " iv-only"; if (m === "away") c += " iv-away";
    if (S.sel === d.id) c += " iv-sel"; if (o.grey) c += " iv-grey"; if (o.glow) c += " iv-glow"; if (o.pulse) c += " iv-pulse"; if (o.dts) c += " iv-dts-on";
    var tag = m ? ' <span class="an-tag ' + (m === "only" ? "an-image" : "an-theme") + '">' + (m === "only" ? C.marks.onlyTag : C.marks.awayTag) + "</span>" : "";
    return '<button type="button" class="' + c + '" data-d="' + d.id + '" data-k="d' + (o.k || "") + d.id + '" aria-pressed="' + (S.sel === d.id) + '"><span class="iv-did">' + d.id + "</span> <span class='iv-dt'>" + d.t + "</span>" + tag + "</button>";
  }
  function telPanel(id, k){
    var t = T(id), h = '<section class="iv-tel" aria-label="' + esc(MV.plain(t.t)) + '"><h4 class="iv-h">' + t.t + ' <span class="tiny muted">' + t.sub + "</span></h4>";
    if (t.imagined) h += '<p class="iv-imag">' + C.imagined + "</p>";
    if (t.note) h += '<p class="tiny muted">' + t.note + "</p>";
    if (id === "son" && fx.align) {
      var row = function(a, b){ return "<tr><td>" + detailBtn(detail(a), { glow:true, k:k }) + "</td><td>" + detailBtn(detail(b), { glow:true, k:k + "b" }) + "</td></tr>"; };
      return h + '<div class="tbl-wrap"><table class="iv-align"><thead><tr><th scope="col">X2 · The first crossing</th><th scope="col">X3 · The second crossing</th></tr></thead><tbody>' + row("d2a", "d3a") + row("d2b", "d3b") + "</tbody></table></div></section>";
    }
    t.groups.forEach(function(g){
      var slot = g.slot ? byId(C.slots, g.slot) : null, idx = slot ? C.slots.indexOf(slot) + 1 : 0;
      h += '<div class="iv-grp' + (fx.alt && g.slot !== "x2" ? " iv-grey" : "") + '">' + (slot ? '<p class="iv-slot">X' + idx + " · " + slot.name + ' <span class="eng-cite">(King ' + slot.pg + ")</span></p>" : "");
      g.d.forEach(function(d){
        if (fx.alt && d.id === "d2b") { h += '<p class="iv-alt"><span class="iv-dt">' + C.p1.alt + '</span> <span class="iv-imag">' + C.imagined + "</span></p>"; return; }
        h += detailBtn(d, { grey:fx.alt && g.slot === "x2", glow:false, pulse:fx.p4 && d.id === "d2b", dts:fx.p4 && d.id === "i1b", k:k });
      });
      h += "</div>";
    });
    if (fx.alt && id === "son") h += '<p class="tiny iv-cap">' + C.p1.cap + "</p>";
    if (fx.p4 && id === "i1") h += '<p class="tiny iv-cap">' + C.p4.cap + "</p>";
    return h + "</section>";
  }

  // ----- silences, uniques, readout -----
  function awayEvs(exceptId){
    var out = {};
    Object.keys(S.mk).forEach(function(did){ if (S.mk[did] !== "away") return; var t = telOf(did), d = detail(did); if (!t || !d || t.id === exceptId) return; d.ev.forEach(function(e){ out[e] = 1; }); });
    return out;
  }
  function silences(id){ var mine = evSet(T(id)), aw = awayEvs(id); return Object.keys(aw).filter(function(e){ return !mine[e]; }); }
  function i1found(){ var s = silences("i1"); return (has(s, "self") ? 1 : 0) + (has(s, "wait") || has(s, "stars") ? 1 : 0); }
  function uniques(id){
    var others = {}; C.tellings.forEach(function(t){ if (t.id !== id) { var s = evSet(t); Object.keys(s).forEach(function(e){ others[e] = 1; }); } });
    return allDetails(T(id)).filter(function(d){ return d.ev.some(function(e){ return !others[e]; }); });
  }
  function stripHTML(id){
    var s = silences(id), h = '<div class="iv-strip" aria-live="polite"><p class="iv-lab">' + C.strip.title + (id === "i1" ? " · " + i1found() + " of 2" : "") + "</p>";
    h += s.length ? '<p class="tiny">' + C.strip.lead + '</p><ul class="iv-sil">' + s.map(function(e){ return '<li><span class="an-tag an-theme">left out</span> ' + C.ev[e] + "</li>"; }).join("") + "</ul>" : '<p class="tiny muted">' + C.strip.empty + "</p>";
    return h + "</div>";
  }
  function selHTML(key, id){
    var o = FQ[key], v = fq(id)[key] || "";
    return '<div class="iv-fqr"><label for="iv-fq-' + key + '">' + o.q + '</label><select class="txtin iv-sel" id="iv-fq-' + key + '" data-fq="' + key + '"><option value="">' + FQ.pick + "</option>" +
      o.opts.map(function(x){ return '<option value="' + x.id + '"' + (x.id === v ? " selected" : "") + ">" + x.t + "</option>"; }).join("") + "</select></div>";
  }
  function fqHTML(id){
    return '<details class="iv-fq" open><summary>' + FQ.title + ": " + T(id).t + '</summary><div class="iv-fqg">' + selHTML("who", id) + selHTML("to", id) + selHTML("auth", id) +
      '<div class="iv-fqr"><span class="iv-fql">' + FQ.left.q + '</span><span class="tiny">' + FQ.left.how + "</span></div></div></details>";
  }
  function readout(id){
    var t = T(id), f = fq(id), R = C.readout, rows = [];
    function conf(key, right, label){ var v = f[key]; if (!v) return label + ' <span class="tiny muted">(your choice: not set)</span>'; return (v === right ? "✓ " : "✗ ") + label + (v === right ? "" : ' <span class="tiny">(your choice: ' + esc(byId(FQ[key].opts, v).t) + ")</span>"); }
    rows.push([R.teller, conf("who", t.who, t.whoT)]);
    rows.push([R.listener, conf("to", t.to, t.toT)]);
    rows.push([R.auth, !f.auth ? '<span class="tiny muted">Choose it in the Four Questions.</span>' : f.auth === t.auth ? "✓ " + byId(FQ.auth.opts, t.auth).t : "✗ " + C.authNo]);
    if (t.holds) rows.push([R.holds, t.holds]);
    rows.push([R.sil, id === "i1" ? i1found() + " of 2 (challenge 3)" : String(silences(id).length)]);
    var u = uniques(id);
    rows.push([R.only, u.length ? u.map(function(d){ return d.id + " " + clean(MV.plain(d.t)).slice(0, 70) + (MV.plain(d.t).length > 70 ? "…" : ""); }).join("; ") : "none"]);
    return '<dl class="read iv-read" aria-live="polite">' + MV.readoutHTML(rows) + "</dl>";
  }
  function tc3HTML(){
    var X = C.tc3;
    return '<fieldset class="iv-tc3"><legend>' + X.title + '</legend><p class="tiny">' + X.how + "</p>" + X.opts.map(function(o){
      return '<label class="iv-chk"><input type="checkbox" data-tc3="' + o.id + '"' + (has(S.tc3, o.id) ? " checked" : "") + "> <span><strong>" + o.id + ".</strong> " + o.t + "</span></label>";
    }).join("") + "</fieldset>";
  }
  function ahaShown(){ return ["son", "i1", "i2", "mom"].every(function(id){ return fq(id).auth === T(id).auth; }) || (S.tc3.length === 2 && has(S.tc3, "A") && has(S.tc3, "B")); }

  // ----- Mode 1 -----
  function paintTell(m){
    var opts = C.tellings.map(function(t){ return { id:t.id, t:t.t }; });
    var h = '<div class="iv-chipsx" id="iv-telrg"></div><div class="iv-row"><button type="button" class="btn ghost sm" id="iv-cmp" aria-pressed="' + S.cmp + '">' + C.compare + "</button>" +
      '<button type="button" class="btn ghost sm" id="iv-listen" hidden>' + C.listen + '</button><span class="tiny muted" id="iv-novoice" hidden>' + C.noVoice + "</span></div>" +
      (S.cmp ? '<div class="iv-chipsx" id="iv-tel2rg"></div>' : "");
    var sd = S.sel ? detail(S.sel) : null;
    h += '<div class="iv-mk"><p class="tiny"><strong>' + C.marks.sel + "</strong> " + (sd ? sd.id + " · " + MV.plain(sd.t) : C.marks.none) + '</p><div class="iv-row">' +
      '<button type="button" class="btn ghost sm iv-mkb iv-mk-only" data-mk="only"' + (sd ? "" : " disabled") + ">" + C.marks.only + "</button>" +
      '<button type="button" class="btn ghost sm iv-mkb iv-mk-away" data-mk="away"' + (sd ? "" : " disabled") + ">" + C.marks.away + "</button>" +
      '<button type="button" class="btn ghost sm" data-mk="clear"' + (sd && marked(sd.id) ? "" : " disabled") + ">" + C.marks.clear + "</button></div></div>";
    h += '<div class="iv-cols' + (S.cmp ? " two" : "") + '"><div>' + telPanel(S.tel, "a") + stripHTML(S.tel) + "</div>" + (S.cmp ? "<div>" + telPanel(S.tel2, "b") + stripHTML(S.tel2) + "</div>" : "") + "</div>";
    h += fqHTML(S.tel) + readout(S.tel) + tc3HTML();
    if (ahaShown()) h += '<p class="an-note an-theme iv-aha">' + C.aha + "</p>";
    m.innerHTML = h;
    radios($("#iv-telrg", m), { label:"Telling", cls:"chips", options:opts, value:S.tel, onChange:function(v){ stopFx(); S.tel = v; if (S.tel2 === v) S.tel2 = C.tellings.filter(function(t){ return t.id !== v; })[0].id; api.save(); paint(); MV.changed(); } });
    if (S.cmp) radios($("#iv-tel2rg", m), { label:C.second, cls:"chips", options:opts, value:S.tel2, disabled:function(id){ return id === S.tel; }, onChange:function(v){ stopFx(); S.tel2 = v; api.save(); paint(); MV.changed(); } });
    voiceReady(function(){ var b = $("#iv-listen", host), n = $("#iv-novoice", host); if (b) b.hidden = !VOICE; if (n) n.hidden = !!VOICE; if (b) b.textContent = speak ? C.stop : C.listen; });
  }

  // ----- Mode 2: listening for the voice (E2-style lens) -----
  function paintVoice(m){
    var son = T("son"), ds = []; son.groups.forEach(function(g){ if (has(["x2", "x3", "x4"], g.slot)) g.d.forEach(function(d){ ds.push({ d:d, slot:g.slot }); }); });
    var h = '<div class="iv-lens" role="group" aria-label="' + V.lens + '"><span class="rg-lab">' + V.lens + "</span>" + V.feats.map(function(f){
      return '<button type="button" class="an-chip an-' + f.role + '" data-lens="' + f.id + '" aria-pressed="' + !!S.lens[f.id] + '"><i class="an-dot"></i>' + f.t + "</button>"; }).join("") + "</div>";
    h += '<div class="iv-row"><button type="button" class="btn ghost sm" id="iv-key" aria-pressed="' + !!S.showKey + '">' + (S.showKey ? V.hide : V.show) + "</button></div>";
    h += '<ul class="iv-vlist">' + ds.map(function(x){
      var d = x.d, tags = S.vt[d.id] || [], key = V.key[d.id] || [], glow = fx.under && has(key, "under");
      var shown = tags.filter(function(t){ return S.lens[t]; });
      return '<li class="iv-vcard' + (glow ? " iv-glow" : "") + '"><p class="iv-vt"><span class="iv-did">' + d.id + "</span> " + d.t + "</p>" +
        (shown.length ? '<p class="iv-vtags">' + shown.map(function(t){ var f = byId(V.feats, t); return '<span class="an-tag an-' + f.role + '">' + f.t + "</span>"; }).join(" ") + "</p>" : "") +
        '<div class="iv-ftg" role="group" aria-label="Tag ' + d.id + '">' + V.feats.map(function(f){ return '<button type="button" class="btn ghost sm iv-ft" data-vt="' + d.id + '|' + f.id + '" data-k="vt' + d.id + f.id + '" aria-pressed="' + has(tags, f.id) + '">' + f.t + "</button>"; }).join("") + "</div>" +
        ((S.showKey || glow) && key.length ? '<p class="tiny iv-key"><em>' + V.reading + ":</em> " + key.filter(function(k){ return S.showKey || k === "under"; }).map(function(k){ var f = byId(V.feats, k); return '<span class="an-tag an-' + f.role + '">' + f.t + "</span> " + V.notes[k]; }).join("; ") + "</p>" : "") + "</li>";
    }).join("") + "</ul>";
    var J = V.johnson, jt = esc(J.text);
    J.tags.forEach(function(g){ jt = jt.replace(esc(g.w), '<mark class="an an-' + g.role + '">' + esc(g.w) + '</mark><span class="an-tag an-' + g.role + '">' + g.t + "</span>"); });
    h += '<div class="iv-jcard"><p class="iv-lab">' + J.title + '</p><p class="iv-jt">“' + jt + '”</p><p class="eng-cite">' + J.cite + '</p><p class="tiny">' + J.note + '</p><button type="button" class="btn ghost sm" id="iv-jlisten" hidden>' + C.listen + "</button></div>";
    m.innerHTML = h;
    voiceReady(function(){ var b = $("#iv-jlisten", host); if (b) b.hidden = !VOICE; });
  }

  // ----- Mode 3: your reading -----
  var MINEOPT = {
    who:[{ id:"narr", t:"The son (the narrator)" }, { id:"mother", t:"The mother" }, { id:"guard", t:"A guard" }, { id:"other", t:"Another character" }],
    to:[{ id:"readers", t:"Readers of the story" }, { id:"guards", t:"The guards" }, { id:"son", t:"Her son" }, { id:"public", t:"The public" }]
  };
  function mineDone(e){ return clean(e.q) && /\d/.test(e.pg || "") && e.who && e.to && e.auth && clean(e.left); }
  function mSel(i, key, opts, v, lab){ return '<div class="iv-fqr"><label for="iv-m' + key + i + '">' + lab + '</label><select class="txtin iv-sel" id="iv-m' + key + i + '" data-mi="' + i + '" data-mk2="' + key + '"><option value="">' + FQ.pick + "</option>" + opts.map(function(x){ return '<option value="' + x.id + '"' + (x.id === v ? " selected" : "") + ">" + x.t + "</option>"; }).join("") + "</select></div>"; }
  function paintMine(m){
    var full = S.mine.length >= MI.max;
    var h = '<div class="iv-madd"><div class="jq"><label for="iv-mq">' + MI.quoteL + '</label><textarea class="txtin" id="iv-mq" maxlength="' + MI.maxChars + '" rows="2"' + (full ? " disabled" : "") + '></textarea></div>' +
      '<div class="iv-row"><label for="iv-mpg" class="tiny">' + MI.pageL + '</label><input type="text" class="txtin iv-pgin" id="iv-mpg" inputmode="numeric" maxlength="8" autocomplete="off"' + (full ? " disabled" : "") + '><button type="button" class="btn primary sm" id="iv-madd"' + (full ? " disabled" : "") + ">" + MI.add + '</button></div><p class="tiny" id="iv-mmsg" aria-live="polite">' + (full ? MI.full : "") + "</p></div>";
    h += S.mine.length ? '<ol class="iv-mlist">' + S.mine.map(function(e, i){
      return '<li class="iv-mitem"><p class="iv-mq">“' + esc(e.q) + '” <span class="eng-cite">(King ' + esc(e.pg) + ')</span></p><div class="iv-fqg">' +
        mSel(i, "who", MINEOPT.who, e.who, FQ.who.q) + mSel(i, "to", MINEOPT.to, e.to, FQ.to.q) + mSel(i, "auth", FQ.auth.opts, e.auth, FQ.auth.q) +
        '<div class="iv-fqr"><label for="iv-mleft' + i + '">' + MI.leftL + '</label><input type="text" class="txtin" id="iv-mleft' + i + '" data-mi="' + i + '" data-mk2="left" maxlength="120" autocomplete="off" value="' + esc(e.left || "") + '"></div></div>' +
        '<p class="tiny" data-mst="' + i + '">' + (mineDone(e) ? MI.done : MI.todo) + '</p><button type="button" class="btn ghost sm" data-mdel="' + i + '">' + MI.del + "</button></li>";
    }).join("") + "</ol>" : '<p class="tiny muted">' + MI.empty + "</p>";
    m.innerHTML = h;
  }

  function paint(){
    $("#iv-how", host).innerHTML = C.how[S.mode];
    var m = $("#iv-main", host);
    MV.keepFocus(m, function(){ if (S.mode === "voice") paintVoice(m); else if (S.mode === "mine") paintMine(m); else paintTell(m); });
  }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    var d = b.dataset;
    if (d.d) { stopFx(); S.sel = S.sel === d.d ? "" : d.d; api.save(); paint(); MV.changed(); return; }
    if (d.mk) { if (!S.sel) return; if (d.mk === "clear") delete S.mk[S.sel]; else S.mk[S.sel] = d.mk; api.save(); paint(); MV.changed(); return; }
    if (b.id === "iv-cmp") { stopFx(); S.cmp = !S.cmp; if (S.tel2 === S.tel) S.tel2 = C.tellings.filter(function(t){ return t.id !== S.tel; })[0].id; api.save(); paint(); MV.changed(); var c = $("#iv-cmp", host); if (c) c.focus(); return; }
    if (b.id === "iv-listen") {
      if (speak) { speak = null; MV.eng.stop(); b.textContent = C.listen; return; }
      if (!VOICE) return;
      var t = T(S.tel), text = allDetails(t).map(function(x){ return MV.plain(x.t); }).join(" ");
      var me = speak = {}; b.textContent = C.stop;
      MV.eng.say(text, { voice:VOICE, rate:0.95, onEnd:function(){ if (speak === me) { speak = null; var bb = $("#iv-listen", host); if (bb) bb.textContent = C.listen; } } });
      return;
    }
    if (b.id === "iv-jlisten") { if (VOICE) MV.eng.say(V.johnson.text, { voice:VOICE, rate:0.9 }); return; }
    if (d.lens) { S.lens[d.lens] = !S.lens[d.lens]; api.save(); paint(); return; }
    if (b.id === "iv-key") { S.showKey = !S.showKey; api.save(); paint(); return; }
    if (d.vt) { var p = d.vt.split("|"), L = S.vt[p[0]] || (S.vt[p[0]] = []); var i = L.indexOf(p[1]); if (i >= 0) L.splice(i, 1); else L.push(p[1]); api.save(); paint(); MV.changed(); return; }
    if (b.id === "iv-madd") {
      var q = clean($("#iv-mq", host).value), pg = clean($("#iv-mpg", host).value);
      if (!q || !/\d/.test(pg)) { $("#iv-mmsg", host).textContent = MI.need; return; }
      if (S.mine.length >= MI.max) return;
      S.mine.push({ q:q.slice(0, MI.maxChars), pg:pg }); api.save(); paint(); MV.changed(); var qa = $("#iv-mq", host); if (qa && !qa.disabled) qa.focus(); return;
    }
    if (d.mdel != null) { S.mine.splice(+d.mdel, 1); api.save(); paint(); MV.changed(); return; }
  });
  host.addEventListener("change", function(e){
    var t = e.target;
    if (t.dataset.fq) { fq(S.tel)[t.dataset.fq] = t.value; api.save(); paint(); MV.changed(); var s = $('[data-fq="' + t.dataset.fq + '"]', host); if (s) s.focus(); return; }
    if (t.dataset.tc3) { var L = S.tc3, i = L.indexOf(t.dataset.tc3); if (t.checked && i < 0) L.push(t.dataset.tc3); if (!t.checked && i >= 0) L.splice(i, 1); api.save(); MV.changed(); var aha = ahaShown(); if (aha !== !!$(".iv-aha", host)) { paint(); var c = $('[data-tc3="' + t.dataset.tc3 + '"]', host); if (c) c.focus(); } return; }
    if (t.dataset.mk2 && t.tagName === "SELECT") { var en = S.mine[+t.dataset.mi]; if (en) { en[t.dataset.mk2] = t.value; api.save(); var st = $('[data-mst="' + t.dataset.mi + '"]', host); if (st) st.textContent = mineDone(en) ? MI.done : MI.todo; MV.changed(); } }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.mk2 === "left") { var en = S.mine[+t.dataset.mi]; if (en) { en.left = t.value; api.save(); var st = $('[data-mst="' + t.dataset.mi + '"]', host); if (st) st.textContent = mineDone(en) ? MI.done : MI.todo; } }
  });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".iv-setup"); if (!b) return;
    e.stopPropagation(); stopFx();
    var k = b.dataset.setup; S.mode = "tell"; modeRG.set("tell");
    if (k === "tc1") { S.tel = "son"; S.cmp = false; }
    if (k === "tc3") { S.tel = "i1"; }
    api.save(); paint(); MV.changed();
    var g = $("#iv-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  }, true);

  paint();

  EX = {
    shown:function(){ paint(); },
    stop:function(){ if (Object.keys(fx).length || speak) { stopFx(); paint(); } MV.eng.stop(); },
    predict:{
      start:function(p){
        stopFx();
        if (p.id === "p3") { S.mode = "voice"; }
        else { S.mode = "tell"; S.cmp = p.id === "p4"; S.tel = p.id === "p4" ? "i1" : "son"; S.tel2 = "son"; if (p.id === "p1") S.sel = "d2b"; }
        modeRG.set(S.mode); api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        var me = ++run.n, finished = false;
        function end(){ if (finished) return; finished = true; done(); }
        function at(ms, fn){ MV.wait(ms, function(){ if (me === run.n) fn(); else end(); }); }
        if (p.id === "p1") at(300, function(){ fx = { alt:true }; paint(); at(2200, function(){ fx = {}; paint(); end(); }); });
        else if (p.id === "p2") at(300, function(){ fx = { align:true }; paint(); at(1600, end); });
        else if (p.id === "p3") at(300, function(){ fx = { under:true }; paint(); at(1400, end); });
        else if (p.id === "p4") at(300, function(){ fx = { p4:true }; paint(); at(1600, end); });
        else end();
      }
    },
    challenge:function(id, opt){
      var r = id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false };
      if (r.ok && id === "tc3" && opt && !opt.live) MV.banner("good", byId(C.challenges, "tc3").banner);
      return r;
    }
  };
  function msg(id, k){ return byId(C.challenges, id).msgs[k]; }
  function tc1(){
    if (!S.sel) return { ok:false, msg:msg("tc1", "none") };
    if (S.sel === "d2b") return { ok:true };
    if (S.sel === "d2a") return { ok:false, msg:msg("tc1", "d2a") };
    if (S.sel === "d3b") return { ok:false, msg:msg("tc1", "d3b") };
    if (S.sel === "x1a" || S.sel === "x1b") return { ok:false, msg:msg("tc1", "x1") };
    return { ok:false, msg:msg("tc1", "other") };
  }
  function tc2(){
    var A = {}; ["son", "i1", "i2", "mom"].forEach(function(id){ A[id] = fq(id).auth; });
    if (!A.son || !A.i1 || !A.i2 || !A.mom) return { ok:false, msg:msg("tc2", "unset") };
    if (A.mom === "witness") return { ok:false, msg:msg("tc2", "momWit") };
    if (A.i2 === "official") return { ok:false, msg:msg("tc2", "newsOff") };
    return { ok:A.son === "witness" && A.i1 === "official" && A.i2 === "media" && A.mom === "self" };
  }
  function tc3(){
    var L = S.tc3;
    if (L.some(function(x){ return has(["C", "D", "E", "F"], x); })) return { ok:false, msg:msg("tc3", "rec") };
    if (L.length < 2) return { ok:false, msg:msg("tc3", "few") };
    return { ok:has(L, "A") && has(L, "B") && L.length === 2 };
  }
  return EX;
}

// ---------- Part 3: Reading responsibly (station cards with scenario judgements and craft → meaning panels) ----------
function part3(host, api){
  var P = api.content, S = api.S;
  S.s1 = S.s1 || {}; S.s4 = S.s4 || {};
  var six = /[?&]station6=on\b/.test(location.search);
  function chipFb(st, id){ var c = byId(st.chips, id); return c ? MV.fbHTML(c.best ? "good" : "bad", (c.best ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + c.fb) : ""; }
  var h = '<p class="iv-support"><strong>Support note.</strong> ' + P.support + "</p>";
  h += '<div class="iv-st"><h4 class="iv-h">' + P.s1.title + '</h4><p class="how">' + P.s1.how + "</p>" + P.s1.items.map(function(it){ return '<div class="iv-s1i"><p class="iv-s1t">' + it.t + '</p><div data-s1="' + it.id + '"></div><div data-s1fb="' + it.id + '" aria-live="polite"></div></div>'; }).join("") + "</div>";
  h += '<div class="iv-st"><h4 class="iv-h">' + P.s2.title + '</h4><div class="iv-card">' + P.s2.card + '</div><p class="iv-panel"><strong>Craft → meaning.</strong> ' + P.s2.q + '</p><div id="iv-s2"></div><div id="iv-s2fb" aria-live="polite"></div></div>';
  h += '<div class="iv-st"><h4 class="iv-h">' + P.s3.title + '</h4><div class="iv-card">' + P.s3.card + '</div><p class="iv-panel">' + P.s3.q + '</p><div id="iv-s3"></div><div id="iv-s3fb" aria-live="polite"></div></div>';
  h += '<div class="iv-st"><h4 class="iv-h">' + P.s4.title + '</h4><p class="how">' + P.s4.how + "</p>" + P.s4.items.map(function(it, i){ return '<div class="iv-s4i"><p class="iv-s1t"><strong>' + (i + 1) + ".</strong> " + it.t + '</p><div data-s4="' + it.id + '"></div><div data-s4fb="' + it.id + '" aria-live="polite"></div></div>'; }).join("") + "</div>";
  h += '<div class="iv-st"><h4 class="iv-h">' + P.s5.title + '</h4><p class="iv-support tiny">' + P.support + '</p><div class="iv-card">' + P.s5.card + '</div><div class="jq"><label for="iv-s5">' + P.s5.q + '</label><textarea class="txtin" id="iv-s5" rows="3" maxlength="600"></textarea><p class="tiny muted">' + P.s5.label + "</p></div></div>";
  if (six) h += '<div class="iv-st"><h4 class="iv-h">' + P.s6.title + '</h4><div class="iv-card">' + P.s6.card + "</div></div>";
  host.innerHTML = h;
  P.s1.items.forEach(function(it){
    function fb(){
      var v = S.s1[it.id], el = $('[data-s1fb="' + it.id + '"]', host); if (!v) { el.innerHTML = ""; return; }
      var ans = MV.ans(it), ok = v === ans, t;
      if (ans === "spec") t = ok ? "<strong>✓</strong> " + P.s1.good : "<strong>✗ Not quite.</strong> " + P.s1.wrongSpec;
      else t = (ok ? "<strong>✓</strong> " + P.s1.sweepOk : "<strong>✗ Not quite.</strong> " + P.s1.wrongSweep) + " <em>" + it.better + "</em>";
      el.innerHTML = MV.fbHTML(ok ? "good" : "bad", t);
    }
    radios($('[data-s1="' + it.id + '"]', host), { cls:"chips", aria:"Sort this sentence", options:P.s1.bins, value:S.s1[it.id] || "", onChange:function(v){ S.s1[it.id] = v; api.save(); fb(); } });
    fb();
  });
  [["s2", P.s2], ["s3", P.s3]].forEach(function(x){
    var k = x[0], st = x[1];
    function fb(){ $("#iv-" + k + "fb", host).innerHTML = S[k] ? chipFb(st, S[k]) : ""; }
    radios($("#iv-" + k, host), { cls:"chips", aria:MV.plain(st.q), options:st.chips.map(function(c){ return { id:c.id, t:c.t }; }), value:S[k] || "", onChange:function(v){ S[k] = v; api.save(); fb(); } });
    fb();
  });
  P.s4.items.forEach(function(it){
    function fb(){ var v = S.s4[it.id], el = $('[data-s4fb="' + it.id + '"]', host); if (!v) { el.innerHTML = ""; return; } var ok = v === MV.ans(it); el.innerHTML = MV.fbHTML(ok ? "good" : "bad", (ok ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + it.why); }
    radios($('[data-s4="' + it.id + '"]', host), { cls:"chips", aria:"Respectful, or takes what isn’t theirs?", options:P.s4.opts, value:S.s4[it.id] || "", onChange:function(v){ S.s4[it.id] = v; api.save(); fb(); } });
    fb();
  });
  var s5 = $("#iv-s5", host); s5.value = S.s5 || ""; s5.addEventListener("input", function(){ S.s5 = s5.value; api.save(); });

  // Sentence to steal: save the imitation to the commonplace book (with the master's line)
  var steal = $('.mv-block[data-block="steal"]'), ST = P.steal;
  if (steal && !$("#iv-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="iv-steal-save">' + ST.save + '</button><span class="tiny muted" id="iv-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "iv-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#iv-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#iv-steal-st").textContent = "Saved your imitation to your notebook’s commonplace book.";
    });
  }
  return {};
}

// ---------- Practice 2: "The Corn Husker" (line-numbered poem, period-language note, toolkit MC for R1–R6) ----------
function husker(host, api, a){
  host.innerHTML = '<div id="iv-poem"></div><p class="iv-period tiny">' + a.period + '</p><div id="iv-rmc"></div>';
  MV.eng.passage($("#iv-poem", host), a.poem, { kind:"poem", cite:a.cite });
  var mc = MV.activityTypes.mc($("#iv-rmc", host), { id:a.id + "-mc", items:a.items, summary:a.summary, goal:a.goal });
  return { stats:mc.stats, missed:mc.missed };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 14; numbered sentences) ----------
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
      var cl = a.problems.filter(function(p){ var s = sst(p.id); return s.found && s.fixed && s.stepTries === 0 && s.fixTries === 1 && s.hint < 3; }).length;
      return { first:cl, total:a.problems.length, done:solved, line:(a.summary || "Spot the error") + ": " + solved + "/" + a.problems.length + " solved, " + cl + " without help or retries" };
    },
    missed:function(){ var g = []; a.problems.forEach(function(p){ var s = sst(p.id); if (s.stepTries > 0 || s.fixTries > 1 || s.hint >= 3) g = g.concat(MV.goalIdx(p.goal != null ? p.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: A reader's response, in my own voice (@component E6 paragraph builder: claim / evidence / analysis /
// link, a free-form view, quotations pulled from Explore's "Your reading", the self-check toggle, and the plan's seven tests) ----------
function quoteSpans(t){
  var s = String(t || ""), out = [], m, res = [/“([^”]+)”/g, /"([^"]+)"/g, /‘([^’]+?)’(?![A-Za-z])/g, /(?:^|[\s(\[—–-])'([^']+?)'(?=[\s.,;:!?)\]—–-]|$)/g];
  res.forEach(function(re){ while ((m = re.exec(s))) { var a = m.index + m[0].indexOf(m[1]) - 1; out.push({ a:a, b:a + m[1].length + 2, inner:m[1] }); } });
  return out.filter(function(q){ return clean(q.inner).length > 0; });
}
function wordRE(w){ return new RegExp("(^|[^A-Za-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+") + "(?![A-Za-z])", "i"); }
var PAREN_D = /\([^()]*\d[^()]*\)/g;
var taskChecks = {
  names:function(claim, title, author){ var c = clean(claim).toLowerCase(), t = clean(title).toLowerCase(), au = clean(author); return !!c && !!t && !!au && c.indexOf(t) >= 0 && wordRE(au).test(claim); },
  persp:function(text, T){ return T.persp.some(function(w){ return new RegExp("(^|[^A-Za-z])" + w.replace(/ /g, "\\s+"), "i").test(text || ""); }); },
  quoted:function(text){ return quoteSpans(text).some(function(q){ var rest = text.slice(q.b), re = new RegExp(PAREN_D.source), m = re.exec(rest); return !!m && m.index <= 20; }); },
  after:function(text){ var re = new RegExp(PAREN_D.source, "g"), m, last = -1; while ((m = re.exec(text))) last = m.index + m[0].length; return last >= 0 && wc(text.slice(last)) >= 40; },
  noSweep:function(text, T){ var s = clean(text).toLowerCase(); return !T.sweep.some(function(p){ return s.indexOf(p.toLowerCase()) >= 0; }); },
  length:function(n, T){ return n >= T.min && n <= T.max; }
};
function firstSentence(t){ var s = clean(t), m = s.match(/^[\s\S]*?[.!?]["”’)]*(?=\s+["“‘(]?[A-Z0-9]|\s*$)/); return m ? m[0] : s; }
var task = (function(){
  var api = null, T = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function data(S){
    S = S || {}; if (!T) T = MV.C.task;
    var free = S.mode === "free", segs = [clean(S.claim), clean(S.ev), clean(S.an), clean(S.link)];
    var text = free ? clean(S.free) : segs.filter(Boolean).join(" ");
    var claim = free ? firstSentence(S.free) : clean(S.claim);
    return { mode:free ? "free" : "build", title:S.title == null ? T.defaults.title : S.title, author:S.author == null ? T.defaults.author : S.author, focus:S.focus || "", claim:claim, text:text, n:wc(text), self:!!S.self, explain:explain() };
  }
  function checks(d){
    if (!T) T = MV.C.task;
    return [taskChecks.names(d.claim, d.title, d.author), taskChecks.persp(d.text, T), taskChecks.quoted(d.text), taskChecks.after(d.text), taskChecks.noSweep(d.text, T), d.self, taskChecks.length(d.n, T)];
  }
  function slot(cls, id, tag, how, attrs, opt){ return '<div class="iv-slot2 ' + cls + '"><label for="' + id + '"><span class="iv-ptag">' + tag + "</span>" + (opt ? ' <span class="muted">(' + T.labels.opt + ")</span>" : "") + ' <span class="tiny muted">' + how + '</span></label><textarea class="txtin" id="' + id + '" ' + attrs + "></textarea></div>"; }
  function counts(){ var d = data(api.S); $("#iv-tcount").textContent = d.n + " " + T.labels.words + " (" + T.min + "–" + T.max + ")"; }
  function preview(){
    var S = api.S, el = $("#iv-tpv"); if (!el) return;
    if (S.mode === "free") { el.innerHTML = clean(S.free) ? "<p>" + esc(clean(S.free)) + "</p>" : '<p class="tiny muted">Your paragraph appears here.</p>'; return; }
    var ps = [["claim", T.labels.claim, S.claim], ["ev", T.labels.ev, S.ev], ["an", T.labels.an, S.an], ["link", T.labels.link, S.link]].filter(function(x){ return clean(x[2]); });
    el.innerHTML = ps.length ? "<p>" + ps.map(function(x){ return '<span class="iv-pp iv-pp-' + x[0] + '"><span class="iv-pptag">' + esc(x[1]) + "</span>" + esc(clean(x[2])) + "</span>"; }).join(" ") + "</p>" : '<p class="tiny muted">Your paragraph appears here as you fill the slots, coloured by part: claim, evidence, analysis, link.</p>';
  }
  function models(){
    var el = $("#iv-tmodels"); if (!el) return;
    if (checks(data(api.S)).every(Boolean)) api.S.unlocked = true;
    el.innerHTML = api.S.unlocked ? '<h4 class="iv-h">' + T.modelsLabel + '</h4><p class="tiny muted">' + T.modelsNote + "</p>" + T.models.map(function(m){ return '<details class="alg iv-model"><summary>' + m.title + "</summary><p>" + m.text + "</p></details>"; }).join("") +
      "<details class='alg iv-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Category</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
      T.rubric.map(function(r){ return "<tr>" + r.map(function(c){ return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div></details>" : "";
  }
  function pullHTML(){
    var M = (EXS().mine || []).filter(function(e){ return clean(e.q); }), lab = T.labels;
    if (!M.length) return '<p class="tiny muted">' + lab.pullNone + "</p>";
    return '<p class="tiny">' + lab.pull + "</p><ul class='iv-pull'>" + M.map(function(e, i){ return "<li><span>“" + esc(e.q) + "” (" + esc(clean(T.defaults.author)) + " " + esc(e.pg) + ')</span> <button type="button" class="btn ghost sm" data-pull="' + i + '">' + lab.pullBtn + "</button></li>"; }).join("") + "</ul>";
  }
  function all(){ api.save(); counts(); preview(); api.update(); models(); }
  return {
    render:function(inp, pv, a){
      api = a; T = MV.C.task; var S = a.S, lab = T.labels; S.mode = S.mode === "free" ? "free" : "build";
      if (S.title == null) S.title = T.defaults.title; if (S.author == null) S.author = T.defaults.author;
      inp.innerHTML = '<div class="iv-task"><h4 class="iv-h">' + lab.setup + '</h4><div class="iv-setupf"><div class="jq"><label for="iv-ttitle">' + lab.title + '</label><input type="text" class="txtin" id="iv-ttitle" data-tf="title" maxlength="80" autocomplete="off"></div><div class="jq"><label for="iv-tauth">' + lab.author + '</label><input type="text" class="txtin" id="iv-tauth" data-tf="author" maxlength="60" autocomplete="off"></div></div>' +
        '<div id="iv-tfocus"></div><div id="iv-tmode"></div><div id="iv-tbuild">' +
        slot("iv-s-claim", "iv-tclaim", lab.claim, lab.claimHow, 'data-tf="claim" rows="2"') +
        slot("iv-s-ev", "iv-tev", lab.ev, lab.evHow, 'data-tf="ev" rows="2"') + '<div id="iv-tpull"></div>' +
        slot("iv-s-an", "iv-tan", lab.an, lab.anHow, 'data-tf="an" rows="4"') +
        slot("iv-s-link", "iv-tlink", lab.link, lab.linkHow, 'data-tf="link" rows="2"') + "</div>" +
        '<div id="iv-tfree"><div class="jq"><label for="iv-tfreet">' + lab.freeL + '</label><textarea class="txtin iv-big" id="iv-tfreet" data-tf="free" rows="9"></textarea><p class="tiny muted">' + lab.freeHow + "</p></div></div>" +
        '<p class="tiny" id="iv-tcount" aria-live="polite"></p><label class="iv-self"><input type="checkbox" id="iv-tself"> <span>' + lab.self + "</span></label></div>";
      pv.innerHTML = '<h4 class="iv-h" style="margin-top:0">' + lab.pv + '</h4><div id="iv-tpv" class="iv-pv"></div><div id="iv-tmodels"></div>';
      $("#iv-ttitle").value = S.title; $("#iv-tauth").value = S.author;
      $("#iv-tclaim").value = S.claim || ""; $("#iv-tev").value = S.ev || ""; $("#iv-tan").value = S.an || ""; $("#iv-tlink").value = S.link || ""; $("#iv-tfreet").value = S.free || "";
      $("#iv-tself").checked = !!S.self;
      $("#iv-tpull").innerHTML = pullHTML();
      radios($("#iv-tfocus"), { label:lab.focus, cls:"chips", options:T.focus, value:S.focus || "", onChange:function(v){ S.focus = v; all(); } });
      function show(){ $("#iv-tbuild").hidden = S.mode === "free"; $("#iv-tfree").hidden = S.mode !== "free"; }
      radios($("#iv-tmode"), { label:lab.write, cls:"seg", options:[{ id:"build", t:lab.build }, { id:"free", t:lab.free }], value:S.mode,
        onChange:function(v){ S.mode = v; if (v === "free" && !clean(S.free)) { S.free = [S.claim, S.ev, S.an, S.link].map(clean).filter(Boolean).join(" "); $("#iv-tfreet").value = S.free; } show(); all(); } });
      show();
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tf; if (!k) return; S[k] = e.target.value; all(); });
      $("#iv-tself").addEventListener("change", function(){ S.self = $("#iv-tself").checked; all(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-pull]"); if (!b) return;
        var M = (EXS().mine || []).filter(function(x){ return clean(x.q); }), q = M[+b.dataset.pull]; if (!q) return;
        var add = "“" + clean(q.q) + "” (" + clean(S.author || T.defaults.author) + " " + clean(q.pg) + ")";
        S.ev = clean(S.ev) ? clean(S.ev) + " " + add : add; $("#iv-tev").value = S.ev; all(); $("#iv-tev").focus();
      });
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      counts(); preview(); models();
    },
    refresh:function(){ if (api) { var p = $("#iv-tpull"); if (p) p.innerHTML = pullHTML(); all(); } },
    read:function(){ return data(api ? api.S : MV.taskState().app); },
    valid:function(d){ return d.text ? true : "Write your paragraph first."; },
    checks:checks,
    key:function(d){ return d.focus || "paragraph"; },
    label:function(k){ var f = byId(MV.C.task.focus, k); return f ? esc(f.t) : "a paragraph"; },
    text:function(k){ var f = byId(MV.C.task.focus, k); return f ? f.t : "a paragraph"; },
    summary:function(ts){
      if (!T) T = MV.C.task;
      var S = ts.app || {}, d = data(S), r = checks(d), met = r.filter(Boolean).length, L = [], f = byId(T.focus, d.focus);
      L.push(T.summary + ": " + (met === r.length ? "complete (" + d.n + " words)" : "not complete yet (checklist " + met + "/" + r.length + ")"));
      L.push("  Text: “" + clean(d.title) + "” by " + clean(d.author) + "; angle: " + (f ? f.t : "(not chosen)") + "; written with the " + (d.mode === "free" ? "free-form box" : "paragraph builder") + "; own-voice self-check: " + (d.self ? "on" : "off"));
      L.push("  Full paragraph (" + d.n + " words):");
      L.push("    " + (d.text || "(not written yet)"));
      L.push("  Craft statement: " + (clean(ts.explain || d.explain) || "(not written yet)"));
      L.push("  Teacher rubric (Ontario achievement chart, levels 1–4):");
      T.rubric.forEach(function(row){ L.push("    " + MV.plain(row[0]) + ": 1 " + row[1] + " | 2 " + row[2] + " | 3 " + row[3] + " | 4 " + MV.plain(row[4])); });
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
  if (ap && !$("#iv-artn")) {
    ap.maxLength = R.principleMax;
    var n = document.createElement("p"); n.id = "iv-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
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
  activities:{ husker:husker, spot:spotProse },
  task:task,
  summaryLines:function(){
    var P = MV.S.app.part3 || {}, s5 = clean(P.s5), M = (EXS().mine || []).filter(function(e){ return clean(e.q); });
    return ["Reading responsibly, Station 5 (unscored): " + (s5 || "(not answered)"), "Explore, Your reading: " + M.length + " quotation" + (M.length === 1 ? "" : "s") + " from my copy"];
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
