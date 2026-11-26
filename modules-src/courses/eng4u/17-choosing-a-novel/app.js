// ENG4U 17 Choosing a Novel of Literary Merit: hero (four public-domain opening/closing lines on a shelf, read word by word, and
// an empty slot "Yours"), the Merit lens (Explore: fictional book cards, six 0–2 criterion sliders drawn as a hexagon radar with
// the evidence-based profile dashed, a shortlist, Compare mode and a Reading plan calculator with a calendar strip), the ISU
// proposal builder (Part 3, with a "Check it with craft" panel), Spot the Error (K13) and "My ISU proposal" (task: reads the
// Part 3 builder; craft statement). Texts and data in content.mjs.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function wc(s){ return MV.eng.wordCount(s || ""); }
function has(a, x){ return a.indexOf(x) >= 0; }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function sum(a){ return (a || []).reduce(function(s, x){ return s + x; }, 0); }
function intOf(v){ var s = String(v == null ? "" : v).trim(); if (!/^\d+(\.\d+)?$/.test(s)) return null; return +s; }

// ---------- @component radioGroup (copied from ENG4U 13; adds data-k keys so MV.keepFocus can restore focus) ----------
// radios(host, {label, aria, key, options:[{id, t}], value, cls:"seg"|"chips", disabled(id), onChange(id)}) -> {set, get, refresh}
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), key = o.key || "rg";
  function off(id){ return !!(o.disabled && o.disabled(id)); }
  function paint(){
    var f = host.contains(document.activeElement), ids = o.options.map(function(x){ return String(x.id); });
    var tab = ids.indexOf(val) >= 0 && !off(val) ? val : ids.filter(function(id){ return !off(id); })[0];
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var id = String(x.id), on = id === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (id === tab ? 0 : -1) + '" data-rg="' + esc(id) + '" data-k="' + key + esc(id) + '"' + (off(id) ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, refresh:paint };
}

// ---------- local voice (read-aloud never leaves the device) ----------
var VOICE = null, voiceCbs = [];
function voiceReady(fn){ if (fn) voiceCbs.push(fn); MV.eng.voice(function(v){ VOICE = v; var c = voiceCbs; voiceCbs = []; c.forEach(function(f){ try { f(v); } catch (e) { console.error(e); } }); }); }

// ---------- hero: four spines on a shelf; each book tilts forward as its line appears word by word; then the empty slot "Yours" ----------
var HR = { run:0, tok:null };
function hero(){
  var H = MV.C.hero, host = $("#cn-hero"); if (!host) return;
  host.innerHTML = '<div class="cn-hlines">' + H.lines.map(function(l, i){
      return '<p class="cn-hl" data-hl="' + i + '"><span class="cn-hq">“' + MV.eng.words(l.t).map(function(w){ return '<span class="cn-w">' + esc(w) + "</span>"; }).join(" ") + '”</span> <span class="cn-hc">(' + l.cite + ")</span></p>";
    }).join("") + "</div>" +
    '<div class="cn-shelf" aria-hidden="true">' + H.lines.map(function(l, i){ return '<span class="cn-spine cn-sp-' + l.role + '" data-sp="' + i + '"><span>' + esc(l.spine) + "</span></span>"; }).join("") +
    '<span class="cn-spine cn-yours"><span>' + esc(H.yours) + "</span></span></div>" +
    '<div class="cn-hctl"><button type="button" class="btn ghost sm" id="cn-hlisten" hidden>' + H.listen + '</button><button type="button" class="btn ghost sm" id="cn-hagain" hidden>' + H.watch + "</button></div>" +
    '<p class="cn-hself">' + H.readSelf + "</p>";
  var HL = $$(".cn-hl", host), SP = $$(".cn-spine[data-sp]", host), N = H.lines.length;
  function words(i){ return $$(".cn-w", HL[i]); }
  function showWords(i, k){ words(i).forEach(function(w, j){ w.classList.toggle("on", j <= k); }); }
  function tilt(i){ SP.forEach(function(s, j){ s.classList.toggle("tilt", j === i); if (j <= i && i >= 0) s.classList.add("read"); }); }
  function reset(){ host.classList.add("anim"); host.classList.remove("done"); HL.forEach(function(p, i){ p.classList.remove("lit", "speaking"); showWords(i, -1); }); SP.forEach(function(s){ s.classList.remove("tilt", "read"); }); }
  function finish(){ host.classList.remove("anim"); host.classList.add("done"); HL.forEach(function(p, i){ p.classList.add("lit"); p.classList.remove("speaking"); showWords(i, 999); }); SP.forEach(function(s){ s.classList.remove("tilt"); s.classList.add("read"); }); btns(); }
  function at(me, ms, fn){ setTimeout(function(){ if (me === HR.run) fn(); }, ms); }
  function animate(){
    var me = ++HR.run, t = 300; stopRead(); reset();
    H.lines.forEach(function(l, i){
      var n = words(i).length;
      at(me, t, function(){ tilt(i); HL[i].classList.add("lit", "speaking"); });
      for (var k = 0; k < n; k++) (function(k){ at(me, t + 250 + k * 190, function(){ showWords(i, k); }); })(k);
      t += 250 + n * 190 + 700;
      at(me, t - 200, function(){ HL[i].classList.remove("speaking"); });
    });
    at(me, t, function(){ tilt(-1); host.classList.add("done"); });
    at(me, t + 900, finish);
  }
  function stopRead(){ if (HR.tok) { HR.tok.stopped = true; MV.eng.stop(); HR.tok = null; } }
  function listen(){
    var me = ++HR.run, tok = { stopped:false }, i = 0; stopRead(); HR.tok = tok;
    if (MV.reduceMotion) finish(); else reset();
    function next(){
      if (tok.stopped || me !== HR.run) return;
      if (i >= N || !VOICE) { HR.tok = null; HL.forEach(function(p){ p.classList.remove("speaking"); }); tilt(-1); if (MV.reduceMotion) finish(); else { host.classList.add("done"); at(me, 900, finish); } return; }
      var k = i++; tilt(k); HL[k].classList.add("lit", "speaking"); if (!MV.reduceMotion) showWords(k, 0);
      MV.eng.say(H.lines[k].t, { voice:VOICE, rate:0.9, onWord:function(w){ if (!MV.reduceMotion && me === HR.run) showWords(k, w); },
        onEnd:function(){ if (tok.stopped) return; showWords(k, 999); HL[k].classList.remove("speaking"); setTimeout(next, 350); } });
    }
    next();
  }
  function btns(){ $("#cn-hlisten").hidden = !VOICE; $("#cn-hagain").hidden = MV.reduceMotion; }
  $("#cn-hlisten").addEventListener("click", listen);
  $("#cn-hagain").addEventListener("click", animate);
  if (MV.reduceMotion) finish(); else animate();
  voiceReady(btns);
  HR.stop = function(){ stopRead(); if (host.classList.contains("anim")) { HR.run++; finish(); } };
}

// ---------- book data helpers ----------
function C_EX(){ return MV.C.explore; }
function book(id){ return byId(C_EX().books, id); }
function keyOf(id){ var b = book(id); return b && b.novel ? MV.ans(b) : [0, 0, 0, 0, 0, 0]; }
function keyTotal(id){ var b = book(id); return b && b.novel ? sum(MV.ans(b)) : 0; }
function band(t){ var B = C_EX().bands; return t >= 9 ? B.strong : t >= 6 ? B.possible : B.no; }
function bookT(b){ return "<i>" + esc(b.t) + "</i>"; }

// ---------- @component meritRadar — six-criterion hexagon (radar) chart in SVG: grid in --ink-2, profiles as polygons
// (student solid --pen, evidence-based dashed --ink-2, compare B in --f3); labels always in text ----------
var RW = 340, RH = 250, RCX = 170, RCY = 122, RR = 78;
function rpt(i, v){ var a = (-90 + 60 * i) * Math.PI / 180, r = RR * v / 2; return [RCX + r * Math.cos(a), RCY + r * Math.sin(a)]; }
function rpoly(vals){ return vals.map(function(v, i){ var p = rpt(i, v); return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
function radarSVG(profiles, o){
  o = o || {}; var CR = C_EX().crit, h = "";
  [1, 2].forEach(function(v){ h += '<polygon class="cn-rgrid" points="' + rpoly([v, v, v, v, v, v]) + '"/>'; });
  CR.forEach(function(c, i){ var p = rpt(i, 2); h += '<line class="cn-rspoke' + (o.hi === i ? " hi" : "") + '" x1="' + RCX + '" y1="' + RCY + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '"/>'; });
  profiles.forEach(function(pr){
    h += '<polygon class="cn-rp ' + pr.cls + '" points="' + rpoly(pr.v) + '"/>';
    if (pr.dots) pr.v.forEach(function(v, i){ var p = rpt(i, v); h += '<circle class="cn-rd ' + pr.cls + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.2"/>'; });
  });
  CR.forEach(function(c, i){
    var a = (-90 + 60 * i) * Math.PI / 180, x = RCX + (RR + 12) * Math.cos(a), y = RCY + (RR + 12) * Math.sin(a), anc = Math.abs(x - RCX) < 4 ? "middle" : x > RCX ? "start" : "end";
    var parts = c.t.split(" "), lines = parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : [c.t];
    if (i === 0) y -= 4 + (lines.length - 1) * 13; else if (i === 3) y += 12; else y += 4 - (lines.length - 1) * 6;
    h += '<text class="cn-rl' + (o.hi === i ? " hi" : "") + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anc + '">' + lines.map(function(l, k){ return '<tspan x="' + x.toFixed(1) + '"' + (k ? ' dy="13"' : "") + ">" + esc(l) + "</tspan>"; }).join("") + "</text>";
  });
  var lab = (o.aria || "Hexagon chart of the six merit criteria.") + " " + profiles.map(function(pr){ return pr.name + ": " + CR.map(function(c, i){ return c.t + " " + Math.round(pr.v[i]); }).join(", ") + "."; }).join(" ");
  return '<svg viewBox="0 0 ' + RW + " " + RH + '" role="img" aria-label="' + esc(lab) + '">' + h + "</svg>";
}

// ---------- Explore: the Merit lens ----------
var EX = null;
function explore(host, api){
  var C = api.content, S = api.S, BK = C.books, CR = C.crit, BD = C.bands, R = null;
  S.mode = has(["lens", "compare", "plan"], S.mode) ? S.mode : "lens"; S.card = book(S.card) ? S.card : "b1";
  S.sc = S.sc || {}; S.rev = S.rev || {}; S.star = Array.isArray(S.star) ? S.star.filter(function(id){ return !!book(id); }) : []; S.sales = S.sales || {};
  S.cmp = Array.isArray(S.cmp) ? S.cmp.filter(function(id){ return !!book(id); }).slice(0, 2) : ["b1", "b8"];
  S.plan = S.plan || { card:"b7", own:"", win:30, buf:6, spd:30, ppd:"", mpd:"" };
  S.just = S.just || "";
  var fx = {};
  host.innerHTML = '<div class="cn-ex"><div id="cn-mode"></div><p class="how" id="cn-how"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cn-main" id="cn-main" data-mv="graph"></div><div class="cn-readw"><dl class="read cn-read" id="cn-read" aria-live="polite"></dl></div></div>';
  var modeRG = radios($("#cn-mode", host), { label:"Mode", key:"md", options:C.modes, value:S.mode, onChange:function(v){ setMode(v); } });
  function setMode(v){ MV.eng.stop(); fx = {}; MV.banner("", ""); S.mode = v; modeRG.set(v); api.save(); paint(); MV.changed(); }
  function tc(id){ return byId(C.challenges, id); }
  function scores(id){ var a = S.sc[id]; if (!Array.isArray(a) || a.length !== 6) a = S.sc[id] = [1, 1, 1, 1, 1, 1]; return a; }
  function keyShown(id){ var k = keyOf(id).slice(); if (fx.whatIf && fx.whatIf.card === id) k[fx.whatIf.i] = fx.whatIf.v; return k; }

  // ----- cards -----
  function cardsRow(){
    return '<div class="cn-cards" role="group" aria-label="Book cards (the row scrolls sideways)">' + BK.map(function(b){
      var on = S.mode === "compare" ? has(S.cmp, b.id) : S.card === b.id, st = has(S.star, b.id), sl = S.mode === "compare" ? (S.cmp[0] === b.id ? "A" : S.cmp[1] === b.id ? "B" : "") : "";
      return '<button type="button" class="cn-bk' + (on ? " on" : "") + (sl ? " cmp" + sl : "") + '" data-card="' + b.id + '" data-k="bk' + b.id + '" aria-pressed="' + on + '">' +
        '<span class="cn-bn">' + b.n + (st ? ' <span aria-label="shortlisted">★</span>' : "") + (sl ? ' <span class="cn-sl-tag">' + sl + "</span>" : "") + '</span><span class="cn-bt">' + esc(b.t) + '</span><span class="cn-bm">' + esc(b.type) + " · " + b.pages + " pp.</span>" +
        (S.rev[b.id] || S.mode === "compare" ? '<span class="cn-btot">' + (b.novel ? keyTotal(b.id) + " / 12" : "not a novel") + "</span>" : "") + "</button>";
    }).join("") + "</div>";
  }
  function sayBtn(b){ return VOICE ? ' <button type="button" class="btn ghost sm" data-say="' + b.id + '" data-k="say' + b.id + '">Listen<span class="vh"> to the sample sentence of ' + esc(b.t) + "</span></button>" : ""; }
  function detailHTML(b){
    var st = has(S.star, b.id), so = !!S.sales[b.id];
    return '<article class="cn-book" aria-label="' + esc(b.n + ", " + b.t) + '"><h4><span class="cn-bn">' + b.n + "</span> " + bookT(b) + '</h4><p class="cn-meta">' + esc(b.type) + " · " + b.pages + " pages · <span class=\"tiny\">fictional, written for the course</span></p>" +
      "<p>" + esc(b.blurb) + '</p><blockquote class="cn-sample">“' + esc(b.sample) + "”" + sayBtn(b) + "</blockquote>" +
      '<p class="cn-crit"><strong>Critical attention:</strong> ' + esc(b.crit) + "</p>" +
      '<div class="q-actions"><button type="button" class="btn ghost sm" data-sales="' + b.id + '" data-k="sales' + b.id + '" aria-expanded="' + so + '">Sales and ratings</button>' +
      '<button type="button" class="btn ' + (st ? "primary" : "ghost") + ' sm" data-star="' + b.id + '" data-k="star' + b.id + '" aria-pressed="' + st + '">' + (st ? "★ Shortlisted" : "☆ Shortlist") + '<span class="vh"> ' + esc(b.t) + "</span></button></div>" +
      (so ? '<p class="cn-salesn"><strong>Sales:</strong> ' + esc(b.sales) + "</p>" : "") + "</article>";
  }

  // ----- Lens -----
  function lensHTML(){
    var b = book(S.card), rev = !!S.rev[b.id], sc = scores(b.id), sl;
    if (b.novel) sl = CR.map(function(c, i){
      return '<div class="cn-sl"><label for="cn-s' + i + '"><span class="cn-slt">' + c.t + '</span> <output id="cn-o' + i + '">' + sc[i] + '</output><span class="tiny muted"> / 2</span></label>' +
        '<input type="range" id="cn-s' + i + '" min="0" max="2" step="1" value="' + sc[i] + '" data-sl="' + i + '" data-k="sl' + i + '" aria-valuetext="' + esc(c.t + " " + sc[i] + " of 2") + '"></div>';
    }).join("") + '<div class="q-actions"><button type="button" class="btn primary sm" data-rev="' + b.id + '" data-k="rev"' + (rev ? " disabled" : "") + ">" + (rev ? "Evidence-based profile shown" : "Show evidence-based profile") + "</button></div>";
    else sl = '<p class="cn-nn"><strong>' + BD.notNovel + "</strong></p>";
    return cardsRow() + detailHTML(b) + '<div class="cn-lens"><div class="cn-rad" id="cn-rad"></div><div class="cn-sls" role="group" aria-label="Your scores, 0 to 2">' + sl +
      '<p class="cn-key tiny"><span class="cn-kyou" aria-hidden="true"></span> Your profile' + (rev ? ' <span class="cn-kkey" aria-hidden="true"></span> Evidence-based profile' : "") + '</p></div></div><p class="tiny muted">' + C.scoreNote + "</p>" +
      '<div class="cn-just"><label for="cn-just" class="cn-lab">Your one-sentence justification for ' + bookT(b) + ' <span class="tiny muted">(challenge 3)</span></label><textarea id="cn-just" rows="3" data-k="just"></textarea><p class="tiny muted" id="cn-justn" aria-live="polite"></p></div>';
  }
  function paintRadar(){
    var el = $("#cn-rad", host); if (!el) return;
    if (S.mode === "lens") {
      var b = book(S.card), pr = [{ v:b.novel ? scores(b.id) : [0, 0, 0, 0, 0, 0], cls:"you", name:"Your profile", dots:true }];
      if (S.rev[b.id] && b.novel) pr.push({ v:keyShown(b.id), cls:"key", name:"Evidence-based profile" });
      el.innerHTML = radarSVG(pr, { hi:fx.hi, aria:"Hexagon chart for " + b.n + ", " + b.t + "." });
    } else if (S.mode === "compare") {
      var A = book(S.cmp[0]), B2 = book(S.cmp[1]), pp = [];
      if (A) pp.push({ v:keyOf(A.id), cls:"ca", name:A.n + " " + A.t, dots:true });
      if (B2) pp.push({ v:keyOf(B2.id), cls:"cb", name:B2.n + " " + B2.t, dots:true });
      el.innerHTML = radarSVG(pp, { hi:fx.hi, aria:"Evidence-based profiles overlaid." });
      var pair = $("#cn-pair", host);
      if (pair) pair.innerHTML = [A, B2].map(function(b, k){ return b ? '<div class="cn-pone"><p class="cn-ptl"><span class="cn-sl-tag">' + (k ? "B" : "A") + "</span> " + b.n + " " + bookT(b) + ": <strong>" + (b.novel ? keyTotal(b.id) + " / 12" : "not a novel") + "</strong></p>" + radarSVG([{ v:keyOf(b.id), cls:k ? "cb" : "ca", name:b.n + " " + b.t, dots:true }], { hi:fx.hi, aria:"Evidence-based profile of " + b.n + "." }) + "</div>" : ""; }).join("");
    }
  }
  function paintJustN(){ var n = $("#cn-justn", host); if (n) { var k = wc(S.just); n.textContent = k + " word" + (k === 1 ? "" : "s") + " (45 or fewer)"; } }

  // ----- Compare -----
  function compareHTML(){
    var A = book(S.cmp[0]), B2 = book(S.cmp[1]);
    return cardsRow() + '<p class="tiny muted">Tap two cards. The newest choice replaces the older one when two are already chosen.</p>' +
      '<div class="cn-cmp"><div class="cn-rad cn-ov" id="cn-rad"></div><div class="cn-pair" id="cn-pair"></div></div>' +
      '<p class="cn-key tiny"><span class="cn-ka" aria-hidden="true"></span> A ' + (A ? A.n : "—") + ' <span class="cn-kb" aria-hidden="true"></span> B ' + (B2 ? B2.n : "—") + " (evidence-based profiles)</p>" +
      '<div class="cn-samples">' + [A, B2].map(function(b, k){ return b ? '<div class="cn-samp"><p class="cn-ptl"><span class="cn-sl-tag">' + (k ? "B" : "A") + "</span> " + b.n + " " + bookT(b) + '</p><blockquote class="cn-sample">“' + esc(b.sample) + "”" + sayBtn(b) + "</blockquote></div>" : '<div class="cn-samp"><p class="tiny muted">Choose a card.</p></div>'; }).join("") + "</div>";
  }

  // ----- Reading plan -----
  function P(){ return S.plan; }
  function planPages(){ var p = P(); if (p.card === "own") { var n = intOf(p.own); return n && n > 0 ? Math.round(n) : 0; } var b = book(p.card); return b ? b.pages : 0; }
  function rdays(){ return Math.max(0, P().win - P().buf); }
  function planHTML(){
    var p = P(), own = p.card === "own";
    return '<div class="cn-plan"><div class="cn-pf"><label for="cn-pbook" class="cn-lab">Book</label><select id="cn-pbook" data-k="pbook">' + BK.map(function(b){ return '<option value="' + b.id + '"' + (p.card === b.id ? " selected" : "") + ">" + b.n + " " + esc(b.t) + " (" + b.pages + " pages)</option>"; }).join("") +
      '<option value="own"' + (own ? " selected" : "") + ">" + C.own + "</option></select></div>" +
      '<div class="cn-pf"><label for="cn-ppages" class="cn-lab">Total pages</label><input id="cn-ppages" class="txtin cn-num" type="text" inputmode="numeric" autocomplete="off" value="' + (own ? esc(p.own) : planPages()) + '"' + (own ? "" : " disabled") + "></div>" +
      rng("win", "Window (days)", 7, 60, 1, p.win) + rng("buf", "Buffer days for notes and rereading", 0, 14, 1, p.buf) + rng("spd", "Reading speed (pages per hour)", 15, 60, 5, p.spd) +
      '<div class="cn-pin"><div class="cn-pf"><label for="cn-pppd" class="cn-lab">Your pages per day</label><input id="cn-pppd" class="txtin cn-num" type="text" inputmode="decimal" autocomplete="off" value="' + esc(p.ppd) + '"></div>' +
      '<div class="cn-pf"><label for="cn-pmpd" class="cn-lab">Your minutes per day</label><input id="cn-pmpd" class="txtin cn-num" type="text" inputmode="decimal" autocomplete="off" value="' + esc(p.mpd) + '"></div></div>' +
      '<div class="cn-calw"><div class="cn-cal" id="cn-cal" role="img"></div><p class="cn-calt" id="cn-calt"></p><p class="cn-key tiny"><span class="cn-krd" aria-hidden="true"></span> Reading day <span class="cn-kbf" aria-hidden="true"></span> Buffer day</p></div></div>';
  }
  function rng(k, lab, mn, mx, st, v){ return '<div class="cn-pf cn-rng"><label for="cn-p' + k + '" class="cn-lab">' + lab + ' <output id="cn-po' + k + '">' + v + '</output></label><input type="range" id="cn-p' + k + '" data-pr="' + k + '" min="' + mn + '" max="' + mx + '" step="' + st + '" value="' + v + '"></div>'; }
  function paintCal(){
    var el = $("#cn-cal", host); if (!el) return;
    var p = P(), rd = rdays(), h = "";
    for (var i = 0; i < p.win; i++) h += '<span class="cn-day ' + (i < rd ? "rd" : "bf") + '"></span>';
    el.innerHTML = h;
    var t = rd + " reading day" + (rd === 1 ? "" : "s") + ", " + p.buf + " buffer day" + (p.buf === 1 ? "" : "s");
    el.setAttribute("aria-label", "Calendar strip: " + t + ".");
    $("#cn-calt", host).textContent = t;
    ["win", "buf", "spd"].forEach(function(k){ var o = $("#cn-po" + k, host); if (o) o.textContent = p[k]; var r = $("#cn-p" + k, host); if (r && +r.value !== p[k]) r.value = p[k]; });
  }

  // ----- readouts -----
  function rowsHTML(rows){ return rows.map(function(r){ return '<div class="' + (r[2] || "") + '"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join(""); }
  function fmt(x){ return Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : (Math.round(x * 100) / 100).toString(); }
  function readout(){
    var fl = fx.flash || "";
    if (S.mode === "lens") {
      var b = book(S.card), rev = !!S.rev[b.id], sc = scores(b.id), k = keyShown(b.id), kt = sum(k), yt = sum(sc);
      var stars = S.star.map(function(id){ var x = book(id); return x.n + " " + bookT(x); }).join(", ") || "none starred yet";
      if (!b.novel) return rowsHTML([["Card", b.n + " " + bookT(b)], ["Your profile", "—"], ["Evidence-based profile", rev ? "not scored: not a novel" : "Press “Show evidence-based profile”."], ["Verdict", BD.notNovel], ["Shortlist", stars]]);
      var keyTxt = rev ? fmt(kt) + " / 12" + (fx.whatIf && fx.whatIf.card === b.id ? " (if every question were answered; was " + keyTotal(b.id) + ")" : "") + (fx.unchanged ? " (unchanged: sales aren’t one of the six)" : "") : "Press “Show evidence-based profile”.";
      var agree = rev ? sc.filter(function(v, i){ return v === k[i]; }).length + " of 6 criteria match" : "—";
      return rowsHTML([["Card", b.n + " " + bookT(b)], ["Your profile", yt + " / 12"], ["Evidence-based profile", keyTxt, fl === "key" ? "cn-flash" : ""], ["Agreement", agree],
        ["Verdict", rev ? band(kt) : "Your scores suggest: " + band(yt)], ["Shortlist", stars]]) + (rev ? '<p class="cn-aha">' + C.aha + "</p>" : "");
    }
    if (S.mode === "compare") {
      var A = book(S.cmp[0]), B2 = book(S.cmp[1]), rows = [];
      [A, B2].forEach(function(b, i){ rows.push([(i ? "B" : "A"), b ? b.n + " " + bookT(b) + ": " + (b.novel ? keyTotal(b.id) + " / 12 · " + band(keyTotal(b.id)) : BD.notNovel) : "Choose a card."]); });
      if (A && B2) {
        var ka = keyOf(A.id), kb = keyOf(B2.id), mx = 0; ka.forEach(function(v, i){ mx = Math.max(mx, Math.abs(v - kb[i])); });
        var gaps = CR.filter(function(c, i){ return mx > 0 && Math.abs(ka[i] - kb[i]) === mx; }).map(function(c){ var i = CR.indexOf(c); return c.t + ": " + ka[i] + " vs " + kb[i]; });
        rows.push(["Biggest gap", mx ? gaps.join(" · ") : "none: the profiles match"]);
        if (fx.hi != null) rows.push([CR[fx.hi].t, ka[fx.hi] + " vs " + kb[fx.hi], "cn-flash"]);
      }
      return rowsHTML(rows);
    }
    var p = P(), pg = planPages(), rd = rdays(), need = rd ? pg / rd : 0, ppd = intOf(p.ppd), mpd = intOf(p.mpd), rows2 = [];
    rows2.push(["Book", p.card === "own" ? C.own + (pg ? " (" + pg + " pages)" : " (type its pages)") : book(p.card).n + " " + bookT(book(p.card)) + " (" + pg + " pages)"]);
    rows2.push(["Reading days", "window − buffer = " + p.win + " − " + p.buf + " = " + rd]);
    rows2.push(["Pages per day needed", !pg || !rd ? "—" : pg + " ÷ " + rd + " = " + fmt(need) + (Math.abs(need - Math.round(need)) > 1e-9 ? ", so plan " + Math.ceil(need) : ""), fl === "need" ? "cn-flash" : ""]);
    rows2.push(["Reading plan check", ppd == null ? "Enter your pages per day." : fmt(ppd) + " pages/day × " + rd + " days = " + fmt(ppd * rd) + (ppd * rd >= pg ? " ≥ " + pg + " ✓" : " < " + pg + " ✗ (short by " + fmt(pg - ppd * rd) + ")")]);
    var basis = ppd != null ? ppd : Math.ceil(need), mins = basis / p.spd * 60;
    rows2.push(["Daily time", !basis ? "—" : "(" + fmt(basis) + " ÷ " + p.spd + ") × 60 = " + fmt(mins) + " min/day" + (ppd == null ? " (at the pages needed)" : "")]);
    rows2.push(["Your minutes per day", mpd == null ? "Enter your minutes per day." : fmt(mpd) + (ppd != null && Math.abs(mpd - mins) < 0.5 ? " ✓ matches" : ppd != null ? " ✗ at " + p.spd + " pages an hour, " + fmt(ppd) + " pages take " + fmt(mins) + " minutes" : "")]);
    return rowsHTML(rows2);
  }
  function paintRead(){ $("#cn-read", host).innerHTML = readout(); }

  function paint(){
    $("#cn-how", host).innerHTML = C.how[S.mode];
    var m = $("#cn-main", host), cs = $(".cn-cards", host), sx = cs ? cs.scrollLeft : 0;
    MV.keepFocus(m, function(){
      m.className = "cn-main cn-m-" + S.mode;
      m.innerHTML = S.mode === "lens" ? lensHTML() : S.mode === "compare" ? compareHTML() : planHTML();
    });
    cs = $(".cn-cards", host); if (cs) cs.scrollLeft = sx;
    var ta = $("#cn-just", host); if (ta) { ta.value = S.just; paintJustN(); }
    paintRadar(); paintCal(); paintRead();
  }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.closest("[data-rg]") || b.disabled) return;
    var d = b.dataset;
    if (d.card) {
      fx = {};
      if (S.mode === "compare") { if (has(S.cmp, d.card)) S.cmp = S.cmp.filter(function(x){ return x !== d.card; }); else { S.cmp.push(d.card); if (S.cmp.length > 2) S.cmp.shift(); } }
      else { S.card = d.card; MV.banner("", ""); }
      api.save(); paint(); MV.changed(); return;
    }
    if (d.sales) { S.sales[d.sales] = !S.sales[d.sales]; api.save(); paint(); return; }
    if (d.star) { var i = S.star.indexOf(d.star); if (i >= 0) S.star.splice(i, 1); else S.star.push(d.star); api.save(); paint(); MV.changed(); return; }
    if (d.rev) { S.rev[d.rev] = true; fx = {}; api.save(); paint(); MV.changed(); return; }
    if (d.say) { var bk = book(d.say); if (bk && VOICE) { MV.eng.stop(); MV.eng.say(bk.sample, { voice:VOICE, rate:0.9 }); } }
  });
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.sl != null) {
      var bk = book(S.card), sc = scores(bk.id), i = +t.dataset.sl, v = +t.value, up = v > sc[i];
      sc[i] = v; fx = {}; $("#cn-o" + i, host).textContent = v; t.setAttribute("aria-valuetext", CR[i].t + " " + v + " of 2");
      if (up && S.sales[bk.id]) MV.banner("", MV.plain(C.guard)); else MV.banner("", "");
      api.save(); paintRadar(); paintRead(); MV.changed(); return;
    }
    if (t.id === "cn-just") { S.just = t.value; paintJustN(); api.save(); MV.changed(); return; }
    if (t.dataset.pr) { P()[t.dataset.pr] = +t.value; if (P().buf >= P().win) { P().buf = Math.max(0, P().win - 1); } api.save(); paintCal(); paintRead(); MV.changed(); return; }
    if (t.id === "cn-ppages") { P().own = t.value; api.save(); paintRead(); return; }
    if (t.id === "cn-pppd") { P().ppd = t.value; api.save(); paintRead(); MV.changed(); return; }
    if (t.id === "cn-pmpd") { P().mpd = t.value; api.save(); paintRead(); MV.changed(); }
  });
  host.addEventListener("change", function(e){ if (e.target.id === "cn-pbook") { P().card = e.target.value; api.save(); paint(); MV.changed(); var s = $("#cn-pbook", host); if (s) s.focus(); } });
  // "Set it up" buttons in the challenge prompts
  document.addEventListener("click", function(e){
    var b = e.target.closest(".cn-setup"); if (!b) return;
    if (S.mode !== b.dataset.setup) setMode(b.dataset.setup);
    var g = $("#cn-main", host); if (g) g.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" });
  });
  voiceReady(function(){ if (S.mode !== "plan") paint(); });
  paint();

  EX = {
    stop:function(){ MV.eng.stop(); if (Object.keys(fx).length) { fx = {}; paint(); } },
    predict:{
      start:function(p){
        MV.eng.stop(); fx = {}; MV.banner("", ""); var st = p.start || {};
        S.mode = st.mode; modeRG.set(st.mode);
        if (st.mode === "lens") { S.card = st.card; if (p.id === "p2") S.sales[st.card] = false; }
        if (st.cmp) S.cmp = st.cmp.slice();
        if (st.mode === "plan") { P().card = st.card; P().win = st.win; P().buf = st.buf; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p1") {
          MV.wait(300, function(){ S.rev[S.card] = true; api.save(); paint();
            MV.wait(700, function(){ fx = { whatIf:{ card:S.card, i:2, v:2 }, hi:2, flash:"key" };
              MV.tween({ dur:1100, step:function(t){ if (!fx.whatIf) return; fx.whatIf.v = 2 - 2 * t; paintRadar(); paintRead(); }, done:function(){ if (fx.whatIf) { fx.whatIf.v = 0; paintRadar(); paintRead(); } MV.changed(); MV.wait(500, done); } }); }); });
        } else if (p.id === "p2") {
          MV.wait(300, function(){ S.sales[S.card] = true; S.rev[S.card] = true; api.save(); paint(); MV.banner("", MV.plain(C.guard));
            MV.wait(900, function(){ fx = { unchanged:true, flash:"key" }; paintRead(); MV.wait(700, done); }); });
        } else if (p.id === "p3") {
          var from = P().buf, to = 6;
          MV.tween({ dur:1400, step:function(t){ var v = Math.round(from + (to - from) * t); if (v !== P().buf) { P().buf = v; paintCal(); paintRead(); } },
            done:function(){ P().buf = to; fx = { flash:"need" }; api.save(); paintCal(); paintRead(); MV.changed(); MV.wait(500, done); } });
        } else if (p.id === "p4") {
          MV.wait(400, function(){ fx = { hi:1 }; paintRadar(); paintRead(); MV.wait(1200, done); });
        } else done();
      }
    },
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
  function tc1(){
    var c = tc("tc1"), M = c.msgs, A = MV.ans(c), s = S.star;
    if (!s.length) return { ok:false, msg:M.none };
    if (s.length === A.length && A.every(function(x){ return has(s, x); })) return { ok:true };
    if (has(s, "b4")) return { ok:false, msg:M.b4 };
    if (has(s, "b2") || has(s, "b8")) return { ok:false, msg:M.pop };
    if (has(s, "b6")) return { ok:false, msg:M.b6 };
    if (s.length !== 2) return { ok:false, msg:M.count.replace("{n}", s.length) };
    return { ok:false };
  }
  function tc2(){
    var c = tc("tc2"), M = c.msgs, A = MV.ans(c), ppd = intOf(P().ppd), mpd = intOf(P().mpd);
    if (ppd == null && mpd == null) return { ok:false, msg:M.none };
    if (ppd === A.ppd && mpd === A.mpd) return { ok:true };
    if (ppd === 12) return { ok:false, msg:M.p12 };
    if (ppd === 60) return { ok:false, msg:M.p60 };
    if (ppd === 15 && mpd === 15) return { ok:false, msg:M.m15 };
    return { ok:false };
  }
  function tc3(){
    var c = tc("tc3"), M = c.msgs, t = S.just || "", b = book(S.card);
    if (!t.trim()) return { ok:false, msg:M.none };
    if (!b.novel) return { ok:false, msg:M.notNovel };
    if (keyTotal(b.id) < c.minScore) return { ok:false, msg:M.weak };
    if (new RegExp(c.popRe, "i").test(t)) return { ok:false, msg:M.pop };
    var n = c.critRe.filter(function(r){ return new RegExp(r[1], "i").test(t); }).length;
    if (n < 2) return { ok:false, msg:M.one };
    if (!quoteFrom(t, [b.sample, b.blurb])) return { ok:false, msg:M.quote };
    if (wc(t) > c.maxWords) return { ok:false, msg:M.long };
    return { ok:true };
  }
  return EX;
}
// quotations in double (straight or curly) or single quotation marks; an apostrophe inside a word doesn't end a single-quoted span
function quoteSpans(t){
  var out = [], m, re = /[“"]([^“”"]+)[”"]/g, re2 = /(^|[\s(\[—–-])[‘']((?:[A-Za-z][’'][A-Za-z]|[^‘’'])+?)[’'](?=[\s.,;:!?)\]—–-]|$)/g;
  t = String(t || "").replace(/\s+/g, " ");
  while ((m = re.exec(t))) out.push(m[1]);
  while ((m = re2.exec(t))) out.push(m[2]);
  return out;
}
// true when a quoted span contains 4 or more consecutive words of one of the sources (case-insensitive, punctuation ignored)
function quoteFrom(t, sources){
  var N = MV.eng.norm;
  return quoteSpans(t).some(function(sp){
    var s = " " + N(sp) + " ";
    return sources.some(function(src){ var w = N(src).split(" ").filter(Boolean); for (var i = 0; i + 4 <= w.length; i++) if (s.indexOf(" " + w.slice(i, i + 4).join(" ") + " ") >= 0) return true; return false; });
  });
}

// ---------- Part 3: the ISU proposal builder (fields save to the device and feed the performance task) ----------
var P3S = null;
function propOf(S){
  S = S || {}; var p = S.prop || (S.prop = {});
  p.title = p.title || ""; p.author = p.author || ""; p.year = p.year || ""; p.type = p.type || "novel"; p.allow = !!p.allow;
  p.crits = Array.isArray(p.crits) ? p.crits.slice(0, 2) : []; p.ev = p.ev || {}; p.iq = p.iq || ""; p.lens = p.lens || "";
  p.pages = p.pages == null ? "" : p.pages; p.win = p.win == null ? "" : p.win; p.buf = p.buf == null ? "" : p.buf; p.ppd = p.ppd == null ? "" : p.ppd;
  return p;
}
function taskRefresh(){ if (MV._taskUpdate) MV._taskUpdate(); if (task.refresh) task.refresh(); }
function part3(host, api){
  var C = api.content, Bl = C.b, S = api.S, p = propOf(S), CR = MV.C.explore.crit; P3S = S;
  function inp(id, lab, v, o){ o = o || {}; return '<div class="cn-pf' + (o.cls ? " " + o.cls : "") + '"><label for="' + id + '" class="cn-lab">' + lab + '</label><input id="' + id + '" class="txtin' + (o.num ? " cn-num" : "") + '" type="text"' + (o.num ? ' inputmode="numeric"' : "") + ' autocomplete="off" data-f="' + o.f + '" value="' + esc(v) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + "></div>"; }
  host.innerHTML = '<div class="cn-p3">' +
    '<section class="cn-stn"><h3>' + Bl.details + '</h3><div class="cn-row3">' + inp("pr-title", Bl.title, p.title, { f:"title" }) + inp("pr-author", Bl.author, p.author, { f:"author" }) + inp("pr-year", Bl.year, p.year, { f:"year", num:true, cls:"cn-yr" }) + '</div><p class="cn-prev" id="pr-prev" aria-live="polite"></p></section>' +
    '<section class="cn-stn"><h3>' + Bl.type + '</h3><div id="pr-type"></div><label class="cn-chk"><input type="checkbox" id="pr-allow"' + (p.allow ? " checked" : "") + "> " + Bl.allow + '</label><p class="cn-st" id="pr-typest" aria-live="polite"></p></section>' +
    '<section class="cn-stn"><h3>' + Bl.why + '</h3><p class="how">' + Bl.whyHow + '</p><div id="pr-crits"></div><div id="pr-ev"></div></section>' +
    '<section class="cn-stn"><h3>' + Bl.iq + '</h3><p class="how">' + Bl.iqHow + '</p><div class="cn-pf"><label for="pr-iq" class="cn-lab">Your inquiry question</label><textarea id="pr-iq" rows="2" data-f="iq" placeholder="' + esc(Bl.iqPh) + '"></textarea></div><p class="cn-st" id="pr-iqst" aria-live="polite"></p>' +
    '<details class="alg cn-craft" open><summary>' + C.craft.title + '</summary><p>' + C.craft.prompt + '</p><p class="cn-iqshow" id="pr-iqshow"></p><p class="cn-st" id="pr-craftst" aria-live="polite"></p></details></section>' +
    '<section class="cn-stn"><h3>' + Bl.lens + '</h3><div id="pr-lens"></div></section>' +
    '<section class="cn-stn"><h3>' + Bl.plan + '</h3><p class="how">' + Bl.planHow + '</p><p class="q-actions"><button type="button" class="btn ghost sm" id="pr-copy">' + Bl.copy + '</button><span class="tiny muted" id="pr-copyst" aria-live="polite"></span></p>' +
    '<div class="cn-row4">' + inp("pr-pages", Bl.pages, p.pages, { f:"pages", num:true }) + inp("pr-win", Bl.win, p.win, { f:"win", num:true }) + inp("pr-buf", Bl.buf, p.buf, { f:"buf", num:true }) + inp("pr-ppd", Bl.ppd, p.ppd, { f:"ppd", num:true }) + '</div><p class="cn-st" id="pr-planst" aria-live="polite"></p></section>' +
    '<section class="cn-stn"><h3>' + Bl.teacher + '</h3><p class="cn-tnote">' + Bl.teacherNote + "</p></section></div>";
  $("#pr-iq", host).value = p.iq;
  var typeRG = radios($("#pr-type", host), { label:"", aria:"Type", key:"ty", options:Bl.types, value:p.type, onChange:function(v){ p.type = v; changed(); } });
  radios($("#pr-lens", host), { label:"", aria:"Possible lens", key:"le", cls:"chips", options:Bl.lenses, value:p.lens, onChange:function(v){ p.lens = v; changed(); } });
  void typeRG;
  function paintCrits(){
    var el = $("#pr-crits", host);
    MV.keepFocus(el, function(){ el.innerHTML = '<div class="chips" role="group" aria-label="Merit criteria (choose two)">' + CR.map(function(c){ var on = has(p.crits, c.id); return '<button type="button" class="chip' + (on ? " on" : "") + '" data-crit="' + c.id + '" data-k="cr' + c.id + '" aria-pressed="' + on + '">' + c.t + "</button>"; }).join("") + '</div><p class="tiny muted" id="pr-critst" aria-live="polite">' + p.crits.length + " of 2 chosen</p>"; });
    var ev = $("#pr-ev", host), keep = {};
    $$("textarea[data-ev]", ev).forEach(function(t){ keep[t.dataset.ev] = document.activeElement === t; });
    ev.innerHTML = p.crits.map(function(cid){ var c = byId(CR, cid); return '<div class="cn-pf"><label for="pr-ev-' + cid + '" class="cn-lab">Evidence for ' + c.t.toLowerCase() + '</label><textarea id="pr-ev-' + cid + '" rows="3" data-ev="' + cid + '" placeholder="' + esc(Bl.evPh) + '"></textarea><p class="tiny muted" data-evn="' + cid + '"></p></div>'; }).join("");
    p.crits.forEach(function(cid){ var t = $("#pr-ev-" + cid, ev); t.value = p.ev[cid] || ""; if (keep[cid]) t.focus(); });
    paintEvN();
  }
  function paintEvN(){
    p.crits.forEach(function(cid){ var n = $('[data-evn="' + cid + '"]', host); if (!n) return; var t = p.ev[cid] || "", k = wc(t), q = citedQuote(t);
      n.textContent = k + " words (at least 20) · " + (q ? "quotation with a page citation ✓" : "add a quotation and a page citation, e.g. (Shelley 58; ch. 5)"); });
  }
  function paintStatus(){
    $("#pr-prev", host).innerHTML = p.title.trim() ? "<i>" + esc(p.title.trim()) + "</i>" + (p.year.trim() ? " (" + esc(p.year.trim()) + ")" : "") + (p.author.trim() ? " by " + esc(p.author.trim()) : "") : '<span class="tiny muted">Your title appears here in italics.</span>';
    $("#pr-typest", host).innerHTML = p.type === "other" && !p.allow ? Bl.otherNo : "";
    var q = p.iq.trim(), r = iqChecks(q);
    $("#pr-iqst", host).innerHTML = !q ? "" : [r.open ? "✓ begins with a question word" : "○ begin with How, Why, To what extent or In what ways", r.mark ? "✓ ends with a question mark" : "○ end with a question mark", r.len ? "✓ " + r.n + " words (10–35)" : "○ " + r.n + " words (aim for 10–35)"].join(" · ");
    paintCraft();
    var pl = planCheck(p);
    $("#pr-planst", host).innerHTML = !pl.ready ? "" : "Reading days: " + pl.win + " − " + pl.buf + " = " + pl.rd + ". Check: " + pl.ppd + " × " + pl.rd + " = " + pl.ppd * pl.rd + (pl.cover ? " ≥ " + pl.pages + " ✓" : " < " + pl.pages + " ✗") + (pl.buf >= 3 ? " · buffer ✓" : " · ○ leave at least 3 buffer days");
  }
  function paintCraft(){
    var CW = C.craft, q = p.iq.trim(), show = $("#pr-iqshow", host), st = $("#pr-craftst", host);
    if (!q) { show.innerHTML = '<span class="tiny muted">' + CW.empty + "</span>"; st.textContent = ""; return; }
    var op = (q.match(/^(to what extent|in what ways|how|why)\b/i) || [""])[0], rest = q.slice(op.length), found = [];
    var html = (op ? '<mark class="cn-hop">' + esc(op) + "</mark>" : "") + rest.split(/(\s+)/).map(function(tok){
      var w = tok.toLowerCase().replace(/[^a-z’'-]/g, "").replace(/[’']s$/, "");
      if (has(CW.words, w)) { found.push(w); return '<mark class="cn-hcw">' + esc(tok) + "</mark>"; }
      if (has(CW.verbs, w)) return '<mark class="cn-hvb">' + esc(tok) + "</mark>";
      return esc(tok);
    }).join("");
    if (/point of view/i.test(q)) found.push("point of view");
    show.innerHTML = html;
    st.innerHTML = found.length ? CW.found.replace("{w}", "<strong>" + esc(found.filter(function(w, i){ return found.indexOf(w) === i; }).join(", ")) + "</strong>") : CW.none;
  }
  function changed(){ api.save(); paintStatus(); taskRefresh(); }
  host.addEventListener("input", function(e){
    var t = e.target;
    if (t.dataset.f) { p[t.dataset.f] = t.value; changed(); return; }
    if (t.dataset.ev) { p.ev[t.dataset.ev] = t.value; paintEvN(); changed(); return; }
  });
  host.addEventListener("change", function(e){ if (e.target.id === "pr-allow") { p.allow = e.target.checked; changed(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || !host.contains(b) || b.closest("[data-rg]")) return;
    if (b.dataset.crit) {
      var c = b.dataset.crit, i = p.crits.indexOf(c);
      if (i >= 0) p.crits.splice(i, 1);
      else if (p.crits.length < 2) p.crits.push(c);
      else { $("#pr-critst", host).textContent = "Two are chosen. Tap one to remove it first."; return; }
      paintCrits(); changed(); return;
    }
    if (b.id === "pr-copy") {
      var X = ((MV.S.app || {}).explore || {}).plan, st = $("#pr-copyst", host);
      if (!X) { st.textContent = Bl.noPlan; return; }
      var bk = X.card === "own" ? null : book(X.card), pg = bk ? bk.pages : intOf(X.own);
      p.pages = pg ? String(pg) : ""; p.win = String(X.win); p.buf = String(X.buf); p.ppd = X.ppd != null ? String(X.ppd) : "";
      ["pages", "win", "buf", "ppd"].forEach(function(k){ $("#pr-" + k, host).value = p[k]; });
      st.textContent = Bl.copied; changed();
    }
  });
  paintCrits(); paintStatus();

  // Sentence to steal: save the imitation to the commonplace book (with the master's line)
  var steal = $('.mv-block[data-block="steal"]'), ST = MV.C.part3.steal;
  if (steal && !$("#cn-steal-save")) {
    var row = document.createElement("div");
    row.innerHTML = '<div class="q-actions"><button type="button" class="btn ghost sm" id="cn-steal-save">' + ST.save + '</button><span class="tiny muted" id="cn-steal-st" aria-live="polite"></span></div>';
    steal.appendChild(row);
    row.addEventListener("click", function(e){
      if (e.target.id !== "cn-steal-save") return;
      var ta = $('textarea[data-w="steal"]', steal), t = ((ta && ta.value) || MV.S.writes.steal || "").trim();
      if (!t) { $("#cn-steal-st").textContent = "Write your imitation first."; return; }
      MV.eng.saveLine(t, "My imitation of " + ST.source + ": “" + ST.master + "”");
      $("#cn-steal-st").textContent = "Saved your imitation to your commonplace book.";
    });
  }
  return {};
}
// proposal structure tests (shared by Part 3 status lines and the task checklist)
function citedQuote(t){
  t = String(t || "").replace(/\s+/g, " ");
  return /[“"][^“”"]+[”"]\s*[,.;:]?\s*\([^()]*\d+[^()]*\)/.test(t) || /(^|[\s(\[—–-])[‘'](?:[A-Za-z][’'][A-Za-z]|[^‘’'])+?[’']\s*[,.;:]?\s*\([^()]*\d+[^()]*\)/.test(t);
}
function iqChecks(q){
  q = String(q || "").trim(); var n = wc(q);
  return { open:/^(how|why|to what extent|in what ways)\b/i.test(q), mark:/\?$/.test(q), len:n >= 10 && n <= 35, n:n };
}
function planCheck(p){
  var pages = intOf(p.pages), win = intOf(p.win), buf = intOf(p.buf), ppd = intOf(p.ppd);
  var ready = pages != null && win != null && buf != null && ppd != null, rd = ready ? win - buf : 0;
  return { ready:ready, pages:pages, win:win, buf:buf, ppd:ppd, rd:rd, cover:ready && rd > 0 && ppd * rd >= pages,
    ok:ready && pages > 0 && rd > 0 && rd + buf <= win && buf >= 3 && ppd * rd >= pages };
}

// ---------- Practice 3: @component K13 spotProse — Spot the Error for a paragraph (copied from ENG4U 13; numbered sentences) ----------
function spotProse(host, api, a){
  var B = api.S; B.p = B.p || {};
  function sst(id){ return B.p[id] || (B.p[id] = { stepTries:0, found:false, fixTries:0, fixed:false, hint:0 }); }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = a.problems.map(function(p, pi){
        var st = sst(p.id), err = MV.ans(p), h = '<div class="q' + (pi ? " part" : "") + '" data-sp="' + p.id + '" style="' + (pi < a.problems.length - 1 ? "" : "border-bottom:0") + '">';
        h += '<p class="task">Draft ' + (pi + 1) + ": " + p.task + '</p><p class="who">' + a.student + "’s proposal draft</p><ol class=\"steps-list\">";
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

// ---------- Performance task: My ISU proposal (reads the Part 3 builder + the craft statement; structure checks only) ----------
var task = (function(){
  var api = null, T = null;
  function explain(){ var e = $("#task-explain"); return e ? e.value : (MV.taskState().explain || ""); }
  function prop(){ return propOf(P3S || ((MV.S.app || {}).part3) || (MV.S.app ? (MV.S.app.part3 = {}) : {})); }
  function data(){ T = T || MV.C.task; return { p:prop(), explain:explain() }; }
  function critName(id){ var c = byId(MV.C.explore.crit, id); return c ? c.t : id; }
  function checks(d){
    T = T || MV.C.task; var p = d.p, iq = iqChecks(p.iq);
    var two = p.crits.length === 2 && p.crits[0] !== p.crits[1];
    return [!!p.title.trim() && !!p.author.trim() && /^\d{4}$/.test(p.year.trim()),
      p.type === "novel" || (p.type === "other" && p.allow),
      two,
      two && p.crits.every(function(c){ var t = p.ev[c] || ""; return wc(t) >= T.evMin && citedQuote(t); }),
      iq.open && iq.mark && iq.n >= T.iqMin && iq.n <= T.iqMax,
      planCheck(p).ok,
      wc(d.explain) >= T.craftMin];
  }
  function lensName(id){ var l = byId(MV.C.part3.b.lenses, id); return l ? l.t : ""; }
  function propLines(p){
    var pl = planCheck(p), L = [];
    L.push("Novel: " + (p.title.trim() || "(no title)") + (p.year.trim() ? " (" + p.year.trim() + ")" : "") + (p.author.trim() ? " by " + p.author.trim() : ""));
    L.push("Type: " + (p.type === "other" ? "Other" + (p.allow ? " (teacher has approved another type)" : "") : "Novel"));
    p.crits.forEach(function(c){ L.push(critName(c) + ": " + ((p.ev[c] || "").trim() || "(no evidence yet)")); });
    if (!p.crits.length) L.push("Merit reasons: (none chosen yet)");
    L.push("Inquiry question: " + (p.iq.trim() || "(not written yet)"));
    L.push("Possible lens: " + (lensName(p.lens) || "(not chosen)"));
    L.push("Reading plan: " + (pl.ready ? pl.pages + " pages; window " + pl.win + "; buffer " + pl.buf + "; " + pl.rd + " reading days × " + pl.ppd + " pages = " + pl.ppd * pl.rd + (pl.cover ? " ≥ " : " < ") + pl.pages : "(not complete)"));
    return L;
  }
  function paintPv(){
    if (!api) return; T = T || MV.C.task;
    var d = data(), el = $("#tk-prop");
    if (el) el.innerHTML = '<ul class="cn-glance">' + propLines(d.p).map(function(l){ var i = l.indexOf(": "); return "<li><strong>" + esc(l.slice(0, i)) + ":</strong> " + esc(l.slice(i + 2)) + "</li>"; }).join("") + "</ul>";
    var mh = $("#tk-models"); if (!mh) return;
    mh.innerHTML = MV.taskState().found.length ? '<details class="alg cn-models"><summary>' + T.labels.models + '</summary><p class="tiny muted">' + T.labels.modelsNote + "</p>" + T.models.map(function(m){
      return '<div class="cn-model"><h5>' + m.title + '</h5><p class="tiny">' + m.head + "</p>" + m.ev.map(function(e){ return "<p><strong>" + e[0] + ":</strong> " + e[1] + "</p>"; }).join("") +
        "<p><strong>Inquiry question:</strong> " + m.iq + "</p><p><strong>Lens:</strong> " + m.lens + "</p><p><strong>Plan:</strong> " + m.plan + "</p></div>";
    }).join("") + "</details>" : "";
  }
  return {
    refresh:function(){ paintPv(); },
    render:function(inp, pv, a){
      api = a; T = MV.C.task;
      inp.innerHTML = '<div class="cn-tk"><p class="cn-lab">' + T.labels.from + '</p><div id="tk-prop" aria-live="polite"></div><p><a class="btn ghost sm" href="#proposal">' + T.labels.edit + "</a></p></div>";
      pv.innerHTML = '<div id="tk-models"></div>';
      var ex = $("#task-explain"); if (ex) ex.addEventListener("input", function(){ a.update(); });
      var ck = $("#task-check"); if (ck) ck.addEventListener("click", function(){ setTimeout(paintPv, 0); });
      paintPv();
      extras();
    },
    read:function(){ return data(); },
    valid:function(d){ var p = d.p; return p.title.trim() || p.iq.trim() || p.crits.length || d.explain.trim() ? true : "Fill in your proposal in Part 3 first."; },
    checks:checks,
    key:function(d){ return d.p.title.trim() || "(untitled)"; }, label:function(k){ return "<i>" + esc(k) + "</i>"; }, text:function(k){ return k; },
    summary:function(ts){
      T = T || MV.C.task;
      var d = { p:prop(), explain:ts.explain || explain() }, r = checks(d), done = r.every(Boolean) && (ts.found || []).length > 0, L = [];
      L.push((T.summary || "My ISU proposal") + ": " + (done ? "submitted for approval (full proposal below)" : "not submitted yet"));
      if (!done) L.push("  Checklist: " + r.filter(Boolean).length + "/" + r.length + " lines met");
      propLines(d.p).forEach(function(l){ L.push("  " + l); });
      L.push("  Craft statement (" + wc(d.explain) + " words):");
      L.push("    " + (d.explain.trim() || "(not written yet)"));
      L.push("  " + MV.C.part3.b.teacherNote);
      L.push("  Teacher rubric (Ontario achievement chart, levels 1–4):");
      var RB = T.rubric; for (var c = 1; c < RB[0].length; c++) L.push("    " + RB[0][c] + ": " + RB.slice(1).map(function(row){ return row[0] + " " + row[c]; }).join("; "));
      return L;
    }
  };
})();

// ---------- Reflect extras (sample principles, word count, trivium tag, commonplace book) ----------
function extras(){
  var R = MV.C.reflect, sheet = $("#art-sheet"), art = $("#art");
  if (sheet && art && R.artSamples && !$("#art-samples")) {
    var d = document.createElement("details"); d.id = "art-samples"; d.className = "alg art-samples";
    d.innerHTML = "<summary>See two sample principles</summary><p class=\"tiny muted\">They show the form. Always write your own.</p>" + R.artSamples.map(function(s){ return '<p class="an-note an-theme"><strong>Principle:</strong> “' + s.p + "”<br><strong>Example:</strong> " + s.m + "</p>"; }).join("");
    sheet.insertBefore(d, art);
  }
  if (sheet && art && R.art.intro && !$("#cn-artintro")) { var p = document.createElement("p"); p.id = "cn-artintro"; p.innerHTML = R.art.intro; sheet.insertBefore(p, $("#art-samples") || art); }
  var ap = $("#art-p");
  if (ap && !$("#cn-artn")) {
    var n = document.createElement("p"); n.id = "cn-artn"; n.className = "tiny muted"; n.setAttribute("aria-live", "polite"); ap.parentNode.appendChild(n);
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
  summaryLines:function(){ var p = (MV.S.writes["art-principle"] || "").trim(); return p ? ["New principle: " + p] : []; },
  onShow:function(v){
    MV.eng.stop();
    if (v !== "start" && HR.stop) HR.stop();
    if (EX && v !== "explore") EX.stop();
    if (v === "reflect") extras();
    task.refresh();
  }
});
})();
