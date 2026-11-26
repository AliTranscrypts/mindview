// HFA4U 10 Eating Disorders: the support note everywhere (header button and dialog, top of every part, Reflect, results screen
// and the end of the summary), Settings (Sam's pronoun; the shorter "Media" path), hero (three circles), Explore
// "Understanding, not instructing" (influence map, myth-or-fact cards, supportive-conversation simulator with a qualitative
// trust meter and key moves, Riley's conversation to repair), Part 3 "Media, bodies and messages" (four text-only stations),
// journal opt-in, and the "Support card" task with its media-critique option.
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
// Course plan §2: no numbers attached to eating or bodies anywhere here; no body images (abstract circles, cards and bubbles).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function words(s){ return String(s || "").trim().split(/\s+/).filter(function(w){ return /[A-Za-z0-9À-ɏ]/.test(w); }).length; }
function arr(v){ return Array.isArray(v) ? v : []; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function lerp(a, b, t){ return a + (b - a) * t; }

// ---------- @component radioGroup (copied from HFA4U 06; "ed-" classes) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange}) -> {set, get}. Use a fresh host per call.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "seg" ? "seg" : "ed-chipset";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="ed-rgw">' + (o.label ? '<span class="ed-rgl">' + o.label + "</span>" : "") + '<span class="ed-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '">' + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; } };
}

// ---------- blocked-word check (task line 5 and Part 3 station 2; runs on the device only) ----------
var STEMS = { calorie:"calori(?:e|es)", kg:"kgs?", lb:"lbs?", pound:"pounds?", bmi:"bmis?", skinny:"skinn(?:y|ier|iest)", thin:"thin(?:ner|nest|ness)?",
  fat:"fat(?:s|ty|ter|test)?", overweight:"overweight", underweight:"underweight", slim:"slim(?:s|mer|mest|ming|med)?", diet:"diet(?:s|ing|ed|er|ers)?",
  clean:"clean(?:s|er|est|ing|ly)?", junk:"junk(?:y)?", guilt:"guilt(?:y|less)?", cheat:"cheat(?:s|ing|ed|er|ers)?", earn:"earn(?:s|ed|ing|t)?",
  burn:"burn(?:s|ed|ing|t)?", bad:"bad", naughty:"naught(?:y|ier|iest)", sinful:"sinful", lean:"lean(?:er|est)?", detox:"detox(?:es|ing|ed)?", toxic:"toxic" };
function blockRe(list){
  return list.map(function(w){
    var k = String(w).toLowerCase(), pat = STEMS[k] || k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:s|es|ed|ing)?";
    return { w:k, re:new RegExp("(^|[^a-zÀ-ɏ])(" + pat + ")(?![a-zÀ-ɏ])", "i") };
  });
}
function flagged(text, res){ var t = String(text || ""), out = []; res.forEach(function(r){ if (r.re.test(t) && out.indexOf(r.w) < 0) out.push(r.w); }); return out; }
var P3_EXTRA = ["bad", "naughty", "sinful", "lean", "detox", "toxic"];   // "and similar" (plan, station 2)

// ---------- settings: Sam's pronoun and the shorter path (teacher alternative path, plan build notes) ----------
function ED(){ var a = MV.S.app, e = a.ed || (a.ed = {}); if (!/^(they|she|he)$/.test(e.pron)) e.pron = "they"; return e; }
var PRON = { they:{ they:"they", them:"them", their:"their" }, she:{ they:"she", them:"her", their:"her" }, he:{ they:"he", them:"him", their:"his" } };
function pr(s){ var p = PRON[(MV.S && MV.S.app && MV.S.app.ed && MV.S.app.ed.pron) || "they"] || PRON.they; return String(s).replace(/\{(they|them|their)\}/g, function(m, k){ return p[k]; }); }
var ALT = false;
function altSaved(){ try { var d = JSON.parse(localStorage.getItem(MV.meta.storageKey) || "null"); return !!(d && d.app && d.app.ed && d.app.ed.alt); } catch (e) { return false; } }
// The path is read before the page shell is drawn: the shorter path drops Explore and Practice and keeps the Final Check's
// C and A questions (MV.views runs once, after the content loads and before the shell renders).
var baseViews = MV.views;
MV.views = function(){
  var v = baseViews(), C = MV.C;
  ALT = C.kind !== "review" && altSaved();
  if (ALT) {
    v.list = v.list.filter(function(x){ return x !== "explore" && x !== "practice"; });
    C.final.questions = C.final.questions.filter(function(q){ return q.cat === "C" || q.cat === "A"; });
    if (C.final.altIntro) C.final.intro = C.final.altIntro;
    C.explore.predictions = []; C.explore.challenges = [];
    C.practice.activities = [];
    if (C.hero.muted) C.hero.muted = C.hero.muted.replace("six parts", "four parts");
  }
  return v;
};
var baseSummary = MV.summaryText;
MV.summaryText = function(){ return baseSummary() + "\n\n" + MV.plain(MV.C.support); };   // plan: the support note ends the summary

function supHTML(cls){ return '<div class="hfa-support ed-sup' + (cls ? " " + cls : "") + '" role="note"><p>' + MV.C.support + "</p></div>"; }
var EXAPI = null;
function settings(){
  var host = $("#ed-settings"); if (!host) return;
  var X = MV.C.settings;
  host.innerHTML = "<p>" + X.intro + '</p><div id="ed-pron"></div><p class="ed-path-p">' + X.pathIntro + "</p>" +
    (ALT ? '<p class="fb" role="status">' + X.altNote + "</p>" : "") +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="ed-path">' + (ALT ? "Switch back to the full module" : "Switch to the shorter path") + '</button><span class="tiny muted">' + X.reload + "</span></div>";
  radios($("#ed-pron"), { label:"Sam’s pronouns", options:X.pron, value:ED().pron, onChange:function(v){ ED().pron = v; MV.save(); if (EXAPI) EXAPI.repaint(); } });
  $("#ed-path").addEventListener("click", function(){
    ED().alt = !ALT; MV.S.last = "start"; MV.save();
    try { history.replaceState(null, "", "#start"); } catch (e) {}
    location.reload();
  });
}
function decorate(){
  var C = MV.C, hb = $(".hd-btns");
  if (hb && !$("#ed-supbtn")) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn ghost sm ed-supbtn"; b.id = "ed-supbtn"; b.setAttribute("aria-haspopup", "dialog"); b.textContent = "Support";
    hb.insertBefore(b, hb.firstChild);
    var dlg = document.createElement("dialog");
    dlg.className = "ed-dlg"; dlg.id = "ed-dlg"; dlg.setAttribute("aria-labelledby", "ed-dlg-t");
    dlg.innerHTML = '<div class="ed-dlg-top"><h2 id="ed-dlg-t">Support</h2><button type="button" class="btn ghost sm" data-ed="close">Close</button></div>' + supHTML();
    $("#mv-root").appendChild(dlg);
    var close = function(){ if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); b.focus(); };
    b.addEventListener("click", function(){ if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
    dlg.addEventListener("click", function(e){ if (e.target === dlg || e.target.closest('[data-ed="close"]')) close(); });
  }
  // the note on the first screen of every part
  var st = $('.view[data-view="start"]'); if (st) st.insertAdjacentHTML("afterbegin", supHTML("top"));
  ["explore", C.part3.slug, "practice", "final-check"].forEach(function(v){
    var sec = $('.view[data-view="' + v + '"]'), intro = sec && $(".intro", sec);
    if (intro) intro.insertAdjacentHTML("afterend", supHTML("top"));
  });
  // Reflect: the journal note above the boxes; the opt-in toggle and the support note below them
  var j = $("#journal");
  if (j) {
    j.insertAdjacentHTML("beforebegin", '<p class="ed-jnote"><span class="hfa-private">Private</span> ' + C.reflect.journalNote + "</p>");
    j.insertAdjacentHTML("afterend", '<label class="ed-optin"><input type="checkbox" id="ed-addj"> ' + C.reflect.optIn + "</label>" + supHTML());
    var cb = $("#ed-addj"); cb.checked = !!ED().addJ;
    cb.addEventListener("change", function(){ ED().addJ = cb.checked; MV.save(); MV.paintSummary(); });
  }
  // results screen
  var sum = $("#summary"); if (sum) sum.insertAdjacentHTML("afterend", supHTML("res"));
  settings();
}

// ---------- hero: three circles slide together, the overlap glows, four support cards appear, caption ----------
var HC = [{ x:138, y:94, dx:-62, dy:-14, cls:"bio", lx:-24, ly:-18 }, { x:222, y:94, dx:62, dy:-14, cls:"mind", lx:24, ly:-18 }, { x:180, y:166, dx:0, dy:58, cls:"world", lx:0, ly:38 }];
function heroSVG(H, t, g){
  var h = "";
  HC.forEach(function(c, i){
    var x = lerp(c.x + c.dx, c.x, t), y = lerp(c.y + c.dy, c.y, t);
    h += '<g class="ed-hc ' + c.cls + '" style="opacity:' + f1(0.35 + 0.65 * t) + '"><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="64"/><text x="' + f1(x + c.lx) + '" y="' + f1(y + c.ly) + '" text-anchor="middle">' + H.circles[i] + "</text></g>";
  });
  if (g > 0) h += '<g style="opacity:' + f1(g) + '"><circle class="ed-hglow" cx="180" cy="118" r="30"/><rect class="ed-hpill" x="133" y="107" width="94" height="23" rx="11.5"/><text class="ed-hpt" x="180" y="122.5" text-anchor="middle">' + H.overlap + "</text></g>";
  return h;
}
function hero(f){
  decorate();
  var host = $("#ed-hero"); if (!host) return;
  var H = MV.C.hero;
  host.innerHTML = '<svg class="ed-hsvg" viewBox="0 0 360 240" role="img" aria-label="' + esc(H.aria) + '"></svg><div class="ed-hcards" aria-hidden="true">' +
    H.cards.map(function(c, i){ return '<span class="ed-hcard" data-hc="' + i + '">' + c + "</span>"; }).join("") + "</div>";
  var svg = $("svg", host), cards = $$(".ed-hcard", host);
  function draw(t, g){ svg.innerHTML = heroSVG(H, t, g); }
  function cap(){ if (f.cap) { f.cap.textContent = H.caption; f.cap.classList.add("ed-cap"); } }
  if (MV.reduceMotion) { draw(1, 1); cards.forEach(function(c){ c.classList.add("on"); }); cap(); return; }
  draw(0, 0);
  MV.wait(300, function(){ MV.tween({ dur:1300, step:function(t){ draw(t, 0); }, done:function(){
    MV.tween({ dur:700, step:function(t){ draw(1, t); }, done:function(){
      var k = 0;
      (function next(){ if (k < cards.length) { cards[k++].classList.add("on"); MV.wait(420, next); } else MV.wait(200, cap); })();
    } });
  } }); });
}

// ---------- Explore: Understanding, not instructing ----------
// @component ed influenceMap (tap-to-place cards with type tags and a three-circle risk mix) + mythCards (flip cards with a
// reliable source type) + conversationSim (branching dialogue, 6 turns × 4 choices, qualitative trust meter, key moves,
// safety step; Riley's conversation to repair from a bank)
function explore(host, api){
  var D = api.content, S = api.S, T = D.talk;
  S.mode = byId(D.modes, S.mode) ? S.mode : "map";
  S.map = S.map || {}; S.map.place = S.map.place || {}; S.map.tag = S.map.tag || {};
  S.myth = S.myth || {}; S.myth.i = clamp(+S.myth.i || 0, 0, D.myths.length - 1); S.myth.ans = S.myth.ans || {};
  S.talk = S.talk || {}; S.talk.path = arr(S.talk.path).slice(0, T.turns.length); S.talk.sub = S.talk.sub === "repair" ? "repair" : "talk";
  S.rep = S.rep || {}; S.rep.slot = S.rep.slot || {};
  var sel = null, pick = null, busy = false, holdFront = null, repAct = null, repMsg = null, lastRead = "";

  host.innerHTML = '<div id="ed-modes" class="ed-modes"></div><div class="ed-pg"><div class="ed-stage" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p><div id="ed-stage"></div></div>' +
    '<aside class="ed-read" aria-label="Readout"><h4 class="ed-h4">Readout</h4><dl class="read" id="ed-read" aria-live="polite"></dl></aside></div>';
  var stage = $("#ed-stage");
  var modeRG = radios($("#ed-modes"), { label:"Mode", aria:"Explore mode", cls:"seg", options:D.modes, value:S.mode, onChange:function(v){
    if (busy) { modeRG.set(S.mode); return; }
    S.mode = v; sel = null; api.save(); paint();
  } });

  // ----- influence map -----
  function card(id){ return byId(D.map.cards, id); }
  function ty(id){ return byId(D.map.types, id); }
  function mapRight(){ return D.map.cards.filter(function(c){ return S.map.place[c.id] === MV.ans(c); }).length; }
  function typeCounts(){ var n = { bio:0, mind:0, world:0 }; D.map.cards.forEach(function(c){ var t = S.map.tag[c.id]; if (S.map.place[c.id] && n[t] != null) n[t]++; }); return n; }
  function riskLit(){ var lit = {}; D.map.cards.forEach(function(c){ var t = S.map.tag[c.id]; if (S.map.place[c.id] === "risk" && t) lit[t] = 1; }); return lit; }
  function msgOn(){ var l = riskLit(); return !!(l.bio && l.mind && l.world); }
  function vennSVG(lit){
    var C = [["bio", 82, 46], ["mind", 122, 46], ["world", 102, 80]];
    return '<svg class="ed-venn-svg" viewBox="40 6 124 112" aria-hidden="true">' + C.map(function(c){
      var t = ty(c[0]); return '<g class="ed-vc ' + c[0] + (lit[c[0]] ? " lit" : "") + '"><circle cx="' + c[1] + '" cy="' + c[2] + '" r="32"/><text x="' + (c[1] + (c[0] === "bio" ? -10 : c[0] === "mind" ? 10 : 0)) + '" y="' + (c[2] + (c[0] === "world" ? 16 : -8)) + '" text-anchor="middle">' + t.t + "</text></g>";
    }).join("") + "</svg>";
  }
  function cardBtn(c){
    var t = S.map.tag[c.id], tt = t ? ty(t) : null;
    return '<button type="button" class="ed-card' + (tt ? " ty-" + t : "") + '" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + (sel === c.id) + '"' + (busy ? " disabled" : "") + "><span>" + c.t + "</span>" +
      (tt ? '<span class="ed-ttag">' + tt.t + "</span>" : '<span class="ed-ttag none">no type yet</span>') + "</button>";
  }
  function selBar(){
    var c = card(sel), p = S.map.place[sel], t = S.map.tag[sel];
    return '<div class="ed-selbar" role="group" aria-label="' + esc("Selected card: " + MV.plain(c.t)) + '"><p class="ed-selt">Selected: <strong>' + c.t + "</strong></p>" +
      '<div class="ed-selrow"><span class="ed-sell">Move to:</span>' + D.map.cols.map(function(col){ var on = p === col.id; return '<button type="button" class="btn sm ' + (on ? "primary" : "ghost") + '" data-move="' + col.id + '" data-k="mv' + col.id + '" aria-pressed="' + on + '">' + col.t + "</button>"; }).join("") +
      (p ? '<button type="button" class="btn ghost sm" data-move="" data-k="mvtray">Back to the tray</button>' : "") + "</div>" +
      '<div class="ed-selrow"><span class="ed-sell">Type:</span>' + D.map.types.map(function(x){ var on = t === x.id; return '<button type="button" class="chip ty-' + x.id + (on ? " on" : "") + '" data-tag="' + x.id + '" data-k="tg' + x.id + '" aria-pressed="' + on + '">' + x.t + "</button>"; }).join("") +
      '<button type="button" class="btn ghost sm ed-seldone" data-act="seldone" data-k="seldone">Done</button></div></div>';
  }
  function mapHTML(){
    var un = D.map.cards.filter(function(c){ return !S.map.place[c.id]; }), lit = riskLit();
    var h = '<div class="ed-venn">' + vennSVG(lit) + '<div class="ed-vtxt"><p class="tiny ed-vleg">Risk column has: ' + D.map.types.map(function(x){ return (lit[x.id] ? "✓ " : "○ ") + x.t; }).join(" · ") + "</p>" +
      '<p class="ed-vmsg">' + (msgOn() ? "<strong>" + D.map.message + "</strong>" : '<span class="muted">The circles light up as the risk column gets a card tagged with each type.</span>') + "</p></div></div>";
    h += '<p class="how">Tap a card, then choose where it goes and tag its type.</p>';
    h += '<div class="ed-tray" role="group" aria-label="Cards to place">' + (un.length ? un.map(cardBtn).join("") : '<p class="tiny muted">All 12 cards are placed.</p>') + "</div>";
    if (sel) h += selBar();
    h += '<div class="ed-cols">' + D.map.cols.map(function(col){
      var ins = D.map.cards.filter(function(c){ return S.map.place[c.id] === col.id; });
      return '<section class="ed-col ' + col.id + '" aria-label="' + esc(col.t) + '"><h5>' + col.t + ' <span class="tiny muted">(' + ins.length + ")</span></h5>" + (ins.length ? ins.map(cardBtn).join("") : '<p class="tiny muted">No cards yet.</p>') + "</section>";
    }).join("") + "</div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="mapclear" data-k="mapclear"' + (busy ? " disabled" : "") + ">Clear the map</button></div>";
    return h;
  }

  // ----- myth or fact -----
  function mythScore(){ return D.myths.filter(function(m){ var a = S.myth.ans[m.id]; return a && a.first; }).length; }
  function vLabel(v){ return v === "myth" ? "Myth" : v === "fact" ? "Fact" : v; }
  function mythHTML(){
    var L = D.myths, i = S.myth.i, m = L[i], a = S.myth.ans[m.id], back = a && holdFront !== m.id;
    var h = '<div class="ed-mtop"><span class="tiny muted">Statement ' + (i + 1) + " of " + L.length + '</span><span class="dots" aria-hidden="true">' + L.map(function(x, k){ return '<span class="dot' + (S.myth.ans[x.id] ? " done" : "") + (k === i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="ed-mcard' + (back ? " back" : "") + '" id="ed-mcard">';
    if (!back) h += '<p class="ed-mq">' + m.t + '</p><div class="q-actions"><button type="button" class="btn" data-mf="myth" data-k="mfm"' + (a || busy ? " disabled" : "") + '>Myth</button><button type="button" class="btn" data-mf="fact" data-k="mff"' + (a || busy ? " disabled" : "") + ">Fact</button></div>";
    else {
      var ans = MV.ans(m), you = a.pt ? "Your prediction: " + a.pt : "You said: " + vLabel(a.choice);
      h += '<p class="ed-verdict">' + vLabel(ans) + '</p><p class="tiny ed-mq2">' + m.t + "</p><p><strong>" + m.flip + "</strong> " + m.fix + '</p><p class="tiny muted">Reliable source type: ' + m.src + "</p>" +
        MV.fbHTML(a.first ? "good" : "bad", (a.first ? "✓ " : "✗ ") + you + (a.first ? " (first try)." : "."));
    }
    h += "</div>";
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="mprev" data-k="mprev"' + (i === 0 || busy ? " disabled" : "") + '>Previous</button><button type="button" class="btn ' + (a ? "primary" : "ghost") + ' sm" data-act="mnext" data-k="mnext"' + (i === L.length - 1 || busy ? " disabled" : "") + ">Next statement</button></div>";
    return h;
  }
  function flip(m, after){
    holdFront = m.id; paint();
    var el = $("#ed-mcard");
    MV.tween({ dur:240, step:function(t){ if (el) el.style.transform = "scaleX(" + f1(1 - t * 0.98) + ")"; }, done:function(){
      holdFront = null; paint(); var e2 = $("#ed-mcard");
      MV.tween({ dur:240, step:function(t){ if (e2) e2.style.transform = "scaleX(" + f1(0.02 + t * 0.98) + ")"; }, done:function(){ if (e2) e2.style.transform = ""; if (after) after(); } });
    } });
  }

  // ----- supportive conversation -----
  function turnAns(k){ return MV.ans(T.turns[k]) || {}; }
  function eff(k, cid){ return turnAns(k)[cid] || {}; }
  function bestId(k){ var A = turnAns(k), t = T.turns[k]; for (var i = 0; i < t.says.length; i++) { var e = A[t.says[i].id]; if (e && e.tr === "L" && (e.i || e.ls || e.ad || e.pro || e.ok)) return t.says[i].id; } return t.says[0].id; }
  function bestPath(n){ var p = []; for (var k = 0; k < n; k++) p.push(bestId(k)); return p; }
  function convo(path){
    var r = { n:path.length, i:false, ls:false, pro:false, ad:false, fb:false, sec:false, self:false, tr:null, t2:true, t6:true, badTurn:-1 };
    path.forEach(function(cid, k){
      var e = eff(k, cid);
      ["i", "ls", "pro", "ad", "fb", "sec", "self"].forEach(function(f){ if (e[f]) r[f] = true; });
      r.tr = e.tr || null;
      if (k === 1 && !e.ok) r.t2 = false;
      if (k === 5 && !e.ok) r.t6 = false;
      if (e.tr !== "L" && r.badTurn < 0) r.badTurn = k;
    });
    return r;
  }
  function trustT(id){ var x = byId(T.trust, id); return x ? x.t : ""; }
  function order(t){ return MV.shuffle(t.says, "ed-" + t.id); }
  function wide(){ return !window.matchMedia || window.matchMedia("(min-width: 700px)").matches; }
  function sayText(k, cid){ var s = byId(T.turns[k].says, cid); return s ? pr(s.t) : ""; }
  function replyText(k, cid){ var s = byId(T.turns[k].says, cid); return s ? pr(s.reply) : ""; }
  function meterHTML(tr){
    return '<div class="ed-meter" role="group" aria-label="Trust meter"><span class="ed-ml">Sam feels:</span>' + T.trust.map(function(x){ var on = tr === x.id; return '<span class="ed-mseg ' + x.id + (on ? " on" : "") + '">' + (on ? '<span aria-hidden="true">◆ </span>' : "") + x.t + (on ? '<span class="vh"> (now)</span>' : "") + "</span>"; }).join("") + "</div>";
  }
  function exchange(k, cid){
    var e = eff(k, cid);
    return '<p class="ed-line you"><span class="ed-who">You</span><span class="ed-lt">' + sayText(k, cid) + '</span></p><p class="ed-line sam"><span class="ed-who">' + (k === 5 ? "Note" : "Sam") + '</span><span class="ed-lt">' + replyText(k, cid) + ' <span class="ed-feel">(Sam feels: ' + trustT(e.tr) + ")</span></span></p>";
  }
  function convoHTML(){
    var P = S.talk.path, n = P.length, r = convo(P), h = '<p class="ed-scen">' + pr(T.scenario) + "</p>";
    if (n > 1) h += '<details class="ed-hist"' + (wide() ? " open" : "") + "><summary>Conversation so far (" + (n - 1) + " earlier turn" + (n - 1 > 1 ? "s" : "") + ')</summary><ol class="ed-histl">' +
      P.slice(0, -1).map(function(cid, k){ return '<li><p class="ed-tn">Turn ' + (k + 1) + ": " + T.turns[k].t + "</p>" + exchange(k, cid) + "</li>"; }).join("") + "</ol></details>";
    if (n) h += '<div class="ed-last" aria-live="polite"><p class="ed-tn">Turn ' + n + ": " + T.turns[n - 1].t + "</p>" + exchange(n - 1, P[n - 1]) + "</div>";
    if (n < T.turns.length) {
      var t = T.turns[n], ord = order(t);
      h += '<div class="ed-turn"><p class="ed-tn">Turn ' + (n + 1) + " of " + T.turns.length + ": " + t.t + '</p><p class="ed-sit">' + pr(t.situation) + "</p>" +
        '<div class="ed-says" role="radiogroup" aria-label="Your response">' + ord.map(function(s, k){
          var on = pick === s.id;
          return '<button type="button" role="radio" class="ed-say" aria-checked="' + on + '" tabindex="' + (on || (!pick && k === 0) ? 0 : -1) + '" data-say="' + s.id + '" data-k="say' + t.id + s.id + '"' + (busy ? " disabled" : "") + '><span class="ed-rdot" aria-hidden="true"></span><span>' + pr(s.t) + "</span></button>";
        }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" data-act="say" data-k="sayit"' + (!pick || busy ? " disabled" : "") + ">Say it</button></div></div>";
    } else h += '<p class="fb" role="status">The conversation is complete. Check the key moves in the readout, or start again.</p>';
    h += meterHTML(r.tr);
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-act="undo" data-k="undo"' + (!n || busy ? " disabled" : "") + '>Undo last turn</button><button type="button" class="btn ghost sm" data-act="restart" data-k="restart"' + (!n || busy ? " disabled" : "") + ">Start again</button></div>";
    return h;
  }
  // ----- Riley's conversation (TC3) -----
  var R = T.repair;
  function bank(id){ return byId(R.bank, id); }
  function badTurns(){ return R.turns.filter(function(t){ return t.bad; }); }
  function firstEmpty(after){ var L = badTurns(), start = after ? L.map(function(t){ return t.id; }).indexOf(after) + 1 : 0; for (var i = 0; i < L.length; i++) { var t = L[(start + i) % L.length]; if (!S.rep.slot[t.id]) return t.id; } return null; }
  function repairHTML(){
    var act = repAct || firstEmpty();
    var h = '<p class="ed-scen">' + R.intro + '</p><ol class="ed-rep">' + R.turns.map(function(t){
      var k = S.rep.slot[t.id], it = k ? bank(k) : null, on = t.bad && act === t.id;
      var x = '<li class="ed-rt' + (on ? " act" : "") + '"><p class="ed-tn">Turn ' + t.n + '</p><p class="ed-line sam"><span class="ed-who">Sam</span><span class="ed-lt">' + pr(t.sam) + "</span></p>";
      if (t.bad) {
        x += '<p class="ed-line old"><span class="ed-who">Riley</span><span class="ed-lt"><s>' + t.bad + '</s><span class="vh"> (unhelpful)</span></span></p><p class="ed-line new"><span class="ed-who">Instead</span><span class="ed-lt">' + (it ? it.t : '<span class="muted">not replaced yet</span>') + "</span></p>" +
          '<div class="q-actions"><button type="button" class="btn sm ' + (on ? "primary" : "ghost") + '" data-rslot="' + t.id + '" data-k="rs' + t.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + ">" + (on ? "Choosing for turn " + t.n : "Replace turn " + t.n) + "</button>" +
          (it ? '<button type="button" class="btn ghost sm" data-rclear="' + t.id + '" data-k="rc' + t.id + '">Clear</button>' : "") + "</div>";
      } else x += '<p class="ed-line you"><span class="ed-who">Riley</span><span class="ed-lt">' + t.keep + "</span></p>";
      return x + "</li>";
    }).join("") + "</ol>";
    if (repMsg) h += MV.fbHTML("", repMsg);
    h += '<h5 class="ed-h5">Response bank</h5><div class="ed-bank" role="group" aria-label="Response bank">' + MV.shuffle(R.bank, "ed-bank").map(function(b){ return '<button type="button" class="ed-bk" data-bank="' + b.id + '" data-k="bk' + b.id + '"' + (busy ? " disabled" : "") + ">" + b.t + "</button>"; }).join("") + "</div>";
    return h;
  }
  function talkHTML(){
    var h = '<div class="ed-sub" role="group" aria-label="Conversation tool">' + [["talk", "Your conversation"], ["repair", "Repair a conversation"]].map(function(x){
      var on = S.talk.sub === x[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-sub="' + x[0] + '" data-k="sub' + x[0] + '"' + (busy ? " disabled" : "") + ">" + x[1] + "</button>";
    }).join("") + "</div>";
    return h + (S.talk.sub === "repair" ? repairHTML() : convoHTML());
  }

  // ----- readout -----
  function paintRead(){
    var tc = typeCounts(), r = convo(S.talk.path), mv = T.moves;
    var moves = '<ul class="ed-mvs">' + mv.map(function(m){ var on = m.id === "nofb" ? (r.n > 0 && !r.fb) : r[m.id]; return '<li class="' + (on ? "on" : "") + '"><span aria-hidden="true">' + (on ? "✓" : "○") + "</span> " + m.t + '<span class="vh">' + (on ? " (done)" : " (not yet)") + "</span></li>"; }).join("") + "</ul>";
    var h = MV.readoutHTML([
      ["Influence map: placed correctly", mapRight() + " of " + D.map.cards.length],
      ["Influence map: by type", D.map.types.map(function(x){ return x.t + " " + tc[x.id]; }).join(" · ")],
      ["Influence map: message", msgOn() ? D.map.message : '<span class="muted">appears when the risk column has all three types</span>'],
      ["Myth or fact: score", mythScore() + " of " + D.myths.length + " first try"],
      ["Conversation: trust meter", "Sam feels: " + (r.tr ? "<strong>" + trustT(r.tr) + "</strong>" : '<span class="muted">no turns yet</span>')],
      ["Conversation: key moves made", moves],
      ["Conversation: safety step", "A trusted adult knows: <strong>" + (r.ad ? "yes" : "not yet") + "</strong>"]
    ]);
    if (h !== lastRead) { lastRead = h; $("#ed-read").innerHTML = h; }
  }
  function paint(){
    MV.keepFocus(stage, function(){ stage.innerHTML = S.mode === "map" ? mapHTML() : S.mode === "myth" ? mythHTML() : talkHTML(); });
    paintRead();
  }
  function commit(){ api.save(); paint(); MV.changed(); }

  // ----- events -----
  stage.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy || !stage.contains(b)) return;
    var d = b.dataset, act = d.act;
    if (d.card) { sel = sel === d.card ? null : d.card; paint(); var bar = $(".ed-selbar", stage); if (bar && bar.scrollIntoView) bar.scrollIntoView({ block:"nearest", behavior:MV.reduceMotion ? "auto" : "smooth" }); return; }
    if (d.move != null && sel) { if (d.move) S.map.place[sel] = d.move; else delete S.map.place[sel]; commit(); return; }
    if (d.tag && sel) { if (S.map.tag[sel] === d.tag) delete S.map.tag[sel]; else S.map.tag[sel] = d.tag; commit(); return; }
    if (act === "seldone") { var was = sel; sel = null; paint(); var nb = $('[data-card="' + was + '"]', stage); if (nb) nb.focus({ preventScroll:true }); return; }
    if (act === "mapclear") { if (!confirm("Clear every card from the map?")) return; S.map.place = {}; S.map.tag = {}; sel = null; commit(); return; }
    if (d.mf) {
      var m = D.myths[S.myth.i]; if (S.myth.ans[m.id]) return;
      S.myth.ans[m.id] = { choice:d.mf, first:d.mf === MV.ans(m) }; api.save(); MV.changed();
      busy = true; flip(m, function(){ busy = false; paint(); var nx = $('[data-act="mnext"]', stage); if (nx && !nx.disabled) nx.focus({ preventScroll:true }); });
      return;
    }
    if (act === "mprev" || act === "mnext") { S.myth.i = clamp(S.myth.i + (act === "mnext" ? 1 : -1), 0, D.myths.length - 1); api.save(); paint(); return; }
    if (d.say) { pick = d.say; paint(); return; }
    if (act === "say" && pick) { S.talk.path.push(pick); pick = null; commit(); return; }
    if (act === "undo") { S.talk.path.pop(); pick = null; commit(); return; }
    if (act === "restart") { S.talk.path = []; pick = null; commit(); return; }
    if (d.sub) { S.talk.sub = d.sub; repMsg = null; commit(); return; }
    if (d.rslot) { repAct = d.rslot; repMsg = null; paint(); return; }
    if (d.rclear) { delete S.rep.slot[d.rclear]; repAct = d.rclear; repMsg = null; commit(); return; }
    if (d.bank) {
      var tgt = repAct || firstEmpty();
      if (!tgt) { repMsg = "All three turns have a replacement. Choose a turn to change it, then choose from the bank."; paint(); return; }
      S.rep.slot[tgt] = d.bank; repAct = firstEmpty(tgt); repMsg = null; commit(); return;
    }
  });
  stage.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-say]"); if (!b || busy) return;
    var dd = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowUp" || e.key === "ArrowLeft") ? -1 : 0; if (!dd) return;
    e.preventDefault(); var all = $$("[data-say]", stage), k = all.indexOf(b), nb = all[(k + dd + all.length) % all.length];
    pick = nb.dataset.say; paint(); var f = $('[data-say="' + pick + '"]', stage); if (f) f.focus({ preventScroll:true });
  });

  // ----- challenges -----
  function chal(id){ return byId(MV.C.explore.challenges, id) || byId(D.challenges || [], id) || { msgs:{} }; }
  function tc1(){
    var M = chal("tc1").msgs, P = S.map.place;
    if (P.support === "risk") return { ok:false, msg:M.support };
    if (P.diet === "protect") return { ok:false, msg:M.diet };
    if (P.meals === "risk") return { ok:false, msg:M.meals };
    var un = D.map.cards.filter(function(c){ return !P[c.id]; }).length;
    if (un) return { ok:false, msg:fill(M.unplaced, { n:un }) };
    var k = mapRight();
    return k === D.map.cards.length ? { ok:true } : { ok:false, msg:fill(M.count, { k:k }) };
  }
  function tc2(){
    var M = chal("tc2").msgs, r = convo(S.talk.path);
    if (r.fb) return { ok:false, msg:M.fb };
    if (r.n < T.turns.length) return { ok:false, msg:fill(M.unfinished, { n:r.n + 1 }) };
    if (r.sec && !r.ad) return { ok:false, msg:M.sec };
    if (!r.i) return { ok:false, msg:M.i };
    if (!r.t2) return { ok:false, msg:M.t2 };
    if (!r.ls) return { ok:false, msg:M.ls };
    if (!r.ad) return { ok:false, msg:M.ad };
    if (!r.pro) return { ok:false, msg:M.pro };
    if (!r.t6) return { ok:false, msg:M.self };
    if (r.badTurn >= 0) return { ok:false, msg:[M.i, M.t2, M.ls, M.ad, M.pro, M.self][r.badTurn] };
    return { ok:true };
  }
  function tc3(){
    var M = chal("tc3").msgs, L = badTurns();
    for (var i = 0; i < L.length; i++) if (!S.rep.slot[L[i].id]) return { ok:false, msg:fill(M.empty, { n:L[i].n }) };
    for (var j = 0; j < L.length; j++) {
      var t = L[j], k = S.rep.slot[t.id];
      if (MV.ans(bank(k)) !== t.id) return { ok:false, msg:"Turn " + t.n + ": " + (M[k] || M[t.id]) };
    }
    return { ok:true };
  }

  // ----- predictions -----
  function predict(){
    return {
      start:function(p){
        busy = true; sel = null; pick = null;
        S.mode = p.mode; modeRG.set(p.mode);
        if (p.id === "p1") { S.map.place = {}; S.map.tag = {}; }
        if (p.mode === "myth") S.myth.i = 0;
        if (p.mode === "talk") { S.talk.sub = "talk"; S.talk.path = bestPath(p.turn || 0); }
        api.save(); paint();
      },
      run:function(p, done){
        var fin = function(){ busy = false; api.save(); paint(); MV.changed(); done(); };
        if (p.id === "p1") {
          var L = D.map.sample.slice(), k = 0;
          (function step(){
            if (k >= L.length) { MV.wait(500, fin); return; }
            var c = card(L[k++]); S.map.place[c.id] = "risk"; S.map.tag[c.id] = c.kt; paint(); MV.wait(650, step);
          })();
          return;
        }
        if (p.id === "p2") {
          var m = D.myths[0], ps = MV.S.preds[p.id] || {};
          if (!S.myth.ans[m.id]) {
            var o = p.options[ps.choice] || {}, txt = MV.plain(o.t || "");
            S.myth.ans[m.id] = { choice:/^myth$/i.test(txt) ? "myth" : /^fact$/i.test(txt) ? "fact" : "", pt:txt, first:!!ps.correct };
          }
          flip(m, fin);
          return;
        }
        var k2 = p.turn || 0, best = bestId(k2);
        pick = best; paint();
        MV.wait(800, function(){ S.talk.path = bestPath(k2).concat([best]); pick = null; paint(); MV.wait(800, fin); });
      }
    };
  }

  paint();
  EXAPI = { repaint:paint };
  return {
    predict:predict(),
    challenge:function(id){ return id === "tc1" ? tc1() : id === "tc2" ? tc2() : id === "tc3" ? tc3() : { ok:false }; }
  };
}

// ---------- Part 3: Media, bodies and messages (@component F12 whoBenefits flow chart + CER; caption tagger; rewrite with a
// blocked-word check; feed habits) ----------
function part3(host, api){
  var D = api.content, S = api.S;
  S.s1 = S.s1 || {}; S.s1.tag = S.s1.tag || {}; S.s1.tries = S.s1.tries || {};
  S.s2 = S.s2 || {}; S.s2.txt = S.s2.txt || {}; S.s2.show = S.s2.show || {};
  S.s3 = S.s3 || {}; S.s3.place = S.s3.place || {}; S.s3.tries = S.s3.tries || 0;
  var BL = blockRe(MV.C.task.blocked.concat(P3_EXTRA)), lastIn = null, s3sel = null, s3msg = null;
  host.innerHTML = '<div class="ed-st" id="ed-s1"></div><details class="alg ed-data"><summary>Check it with data</summary>' + D.data + "</details>" +
    '<div class="part ed-st" id="ed-s2"></div><div class="part ed-st" id="ed-s3"></div><div class="part ed-st" id="ed-s4"></div>';

  function s1(){
    var X = D.s1, n = X.captions.filter(function(c){ return S.s1.tag[c.id] === MV.ans(c); }).length, h = $("#ed-s1");
    MV.keepFocus(h, function(){
      h.innerHTML = "<h3>" + X.title + '</h3><p class="how">' + X.how + '</p><div class="ed-caps">' + X.captions.map(function(c){
        var t = S.s1.tag[c.id], good = !!t && t === MV.ans(c);
        return '<div class="ed-cap"><p class="ed-capt">' + c.t + '</p><div class="ed-capb" role="group" aria-label="' + esc("Tag " + MV.plain(c.t)) + '">' + X.tags.map(function(tg){
          var on = t === tg.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-s1="' + c.id + "|" + tg.id + '" data-k="s1' + c.id + tg.id + '"' + (good ? " disabled" : "") + ">" + tg.t + "</button>";
        }).join("") + "</div>" + (t ? MV.fbHTML(good ? "good" : "bad", good ? "<strong>✓ Correct.</strong> " + c.why : "<strong>✗ Not quite.</strong> Look again: does it put rules, guilt or worth on food or bodies, respect every body, or describe food plainly?") : "") + "</div>";
      }).join("") + '</div><p class="tiny muted" aria-live="polite">' + n + " of " + X.captions.length + " tagged correctly.</p>";
    });
  }
  function s2(){
    var X = D.s2;
    $("#ed-s2").innerHTML = "<h3>" + X.title + '</h3><p class="how">' + X.how + '</p><div class="ed-wbank" role="group" aria-label="Word bank">' +
      X.bank.map(function(w){ return '<button type="button" class="chip" data-wb="' + w + '" data-k="wb' + w + '">' + w + "</button>"; }).join("") + "</div>" +
      X.captions.map(function(c){
        return '<div class="ed-rw"><label for="ed-' + c.id + '"><span class="tiny muted">Rewrite:</span> ' + c.t + '</label><input type="text" class="txtin" id="ed-' + c.id + '" data-rw="' + c.id + '" autocomplete="off" maxlength="140">' +
          '<p class="tiny ed-rwst" id="ed-' + c.id + '-st" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn ghost sm" data-sample="' + c.id + '" data-k="sm' + c.id + '">' + (S.s2.show[c.id] ? "Hide the sample" : "Show a sample rewrite") + "</button></div>" +
          '<p class="tiny muted ed-sample" id="ed-' + c.id + '-sm"' + (S.s2.show[c.id] ? "" : " hidden") + ">Sample: " + c.sample + "</p></div>";
      }).join("");
    X.captions.forEach(function(c){ var i = $("#ed-" + c.id); i.value = S.s2.txt[c.id] || ""; s2st(c.id); });
  }
  function s2st(id){
    var v = S.s2.txt[id] || "", el = $("#ed-" + id + "-st"); if (!el) return;
    if (!v.trim()) { el.textContent = ""; el.className = "tiny ed-rwst"; return; }
    var f = flagged(v, BL);
    el.className = "tiny ed-rwst " + (f.length ? "bad" : "good");
    el.innerHTML = f.length ? "✗ " + fill(D.s2.flagged, { w:esc(f.join(", ")) }) : D.s2.clear;
  }
  function s3(){
    var X = D.s3, P = S.s3.place, used = {}, h = $("#ed-s3");
    Object.keys(P).forEach(function(k){ used[P[k]] = 1; });
    var slots = X.steps.filter(function(s){ return s.slot; }), done = slots.every(function(s){ return P[s.id] === MV.ans(s); });
    MV.keepFocus(h, function(){
      var x = "<h3>" + X.title + '</h3><p class="how">' + X.how + '</p><div class="ed-labs" role="group" aria-label="Labels">' + X.labels.map(function(l){
        var on = s3sel === l.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-lab="' + l.id + '" data-k="lb' + l.id + '"' + (used[l.id] ? " disabled" : "") + ">" + l.t + "</button>";
      }).join("") + "</div>";
      if (s3msg) x += MV.fbHTML(s3msg.k, s3msg.h);
      x += '<ol class="ed-flow">' + X.steps.map(function(s){
        var p = P[s.id], lab = p ? byId(X.labels, p) : null;
        return '<li class="ed-fstep"><span class="ed-fbox">' + s.t + "</span>" + (s.slot ? (lab ? '<span class="ed-fslot done">✓ ' + lab.t + "</span>" :
          '<button type="button" class="ed-fslot" data-fslot="' + s.id + '" data-k="fs' + s.id + '">' + (s3sel ? "Place “" + byId(X.labels, s3sel).t + "” here" : "Label?") + "</button>") : '<span class="ed-fnote">' + s.note + "</span>") + "</li>";
      }).join("") + '</ol><p class="ed-floop"><span aria-hidden="true">↺ </span>' + X.loop + "</p>";
      if (done) x += '<div class="ed-cer"><h4 class="ed-h4">Claim, evidence, reasoning</h4>' + X.cer.map(function(r){ return "<p><strong>" + r[0] + ":</strong> " + r[1] + "</p>"; }).join("") + "</div>";
      h.innerHTML = x;
    });
  }
  function s4(){
    var X = D.s4;
    $("#ed-s4").innerHTML = "<h3>" + X.title + '</h3><p class="how">' + X.how + '</p><div class="ed-feed">' + X.tips.map(function(t){ return '<details class="ed-tip"><summary>' + t.t + "</summary><p>" + t.why + "</p></details>"; }).join("") + "</div>";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var d = b.dataset;
    if (d.s1) { var q = d.s1.split("|"); if (S.s1.tag[q[0]] !== q[1]) { S.s1.tag[q[0]] = q[1]; if (q[1] !== MV.ans(byId(D.s1.captions, q[0]))) S.s1.tries[q[0]] = (S.s1.tries[q[0]] || 0) + 1; } api.save(); s1(); return; }
    if (d.wb) {
      var inp = lastIn || $("#ed-" + D.s2.captions[0].id); if (!inp) return;
      inp.value = (inp.value.trim() ? inp.value.replace(/\s*$/, " ") : "") + d.wb; S.s2.txt[inp.dataset.rw] = inp.value; api.save(); s2st(inp.dataset.rw);
      return;
    }
    if (d.sample) { S.s2.show[d.sample] = !S.s2.show[d.sample]; api.save(); var sm = $("#ed-" + d.sample + "-sm"); sm.hidden = !S.s2.show[d.sample]; b.textContent = S.s2.show[d.sample] ? "Hide the sample" : "Show a sample rewrite"; return; }
    if (d.lab) { s3sel = s3sel === d.lab ? null : d.lab; s3msg = null; s3(); return; }
    if (d.fslot) {
      if (!s3sel) { s3msg = { k:"", h:"Tap a label first, then tap the step it belongs to." }; s3(); return; }
      var stp = byId(D.s3.steps, d.fslot), lab = byId(D.s3.labels, s3sel);
      if (MV.ans(stp) === s3sel) { S.s3.place[stp.id] = s3sel; s3msg = { k:"good", h:"<strong>✓ " + lab.t + ".</strong> " + stp.why }; s3sel = null; }
      else { S.s3.tries++; s3msg = { k:"bad", h:"<strong>✗ Not there.</strong> Ask what that step runs on, or what it produces. Try another step for “" + lab.t + "”." }; }
      api.save(); s3(); MV.focusFb($("#ed-s3"));
    }
  });
  host.addEventListener("focusin", function(e){ if (e.target.dataset && e.target.dataset.rw) lastIn = e.target; });
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.rw) return; S.s2.txt[t.dataset.rw] = t.value; api.save(); s2st(t.dataset.rw); });
  s1(); s2(); s3(); s4();
  return {};
}

// ---------- Performance task: Support card (@component supportCardBuilder — vetted banks, ordered key moves, contacts,
// free text with an on-device blocked-word check; option B media critique) ----------
var task = (function(){
  var api = null, CK_A = null, CK_B = null, BL = null, rgAud = null;
  function T(){ return MV.C.task; }
  function caps(){ return MV.C.part3.s1.captions; }
  function norm(s){
    s = s || {};
    s.opt = s.opt === "critique" ? "critique" : "card";
    ["title", "aud", "ownM", "ownF", "helpS", "msg"].forEach(function(k){ s[k] = typeof s[k] === "string" ? s[k] : ""; });
    s.what = arr(s.what); s.pairs = arr(s.pairs); s.contacts = arr(s.contacts); s.inc = s.inc || {};
    var ids = T().moves.map(function(m){ return m.id; });
    if (!Array.isArray(s.order) || s.order.length !== ids.length || ids.some(function(id){ return s.order.indexOf(id) < 0; })) s.order = MV.shuffle(ids, "ed-moves");
    s.crit = s.crit || {}; s.crit.caps = arr(s.crit.caps); s.crit.tech = s.crit.tech || {}; s.crit.rw = s.crit.rw || {}; s.crit.para = typeof s.crit.para === "string" ? s.crit.para : "";
    return s;
  }
  function st(){ return norm(api.S); }
  function read(){ var s = api ? st() : norm({}); return JSON.parse(JSON.stringify(s)); }
  function movesIn(d){ return d.order.filter(function(id){ return d.inc[id]; }); }
  function ownPair(d){ return words(d.ownM) > 0 && words(d.ownF) > 0; }
  // Line 5 reads every free-text field. Text that names or quotes what's being corrected (the own-words myth; the "who benefits"
  // paragraph, which has to name diet products) is checked for digits and body-size words only; everything else against the full list.
  function freeText(d){ return d.opt === "critique" ? d.crit.caps.map(function(id){ return d.crit.rw[id] || ""; }).join("\n") : [d.title, d.ownF, d.helpS, d.msg].join("\n"); }
  function quoteText(d){ return d.opt === "critique" ? d.crit.para : d.ownM; }
  function line5(d){
    var t = freeText(d), q = quoteText(d), full = BL || blockRe(T().blocked), body = blockRe(T().blockedBody || []);
    var w = flagged(t, full); flagged(q, body).forEach(function(x){ if (w.indexOf(x) < 0) w.push(x); });
    return { digit:/\d/.test(t + "\n" + q), words:w };
  }
  function hasLine(d){ return d.contacts.some(function(id){ var c = byId(T().contacts, id); return c && c.line; }); }
  function checks(d){
    var f = line5(d), contacts = d.contacts.length >= 2 && hasLine(d), clean = !f.digit && !f.words.length;
    if (d.opt === "critique") {
      var C = d.crit, diet = C.caps.filter(function(id){ var c = byId(caps(), id); return c && MV.ans(c) === "diet"; });
      return [
        C.caps.length === 3 && diet.length === 3 && C.caps.every(function(id){ return !!C.tech[id]; }),
        C.caps.length === 3 && C.caps.every(function(id){ return words(C.rw[id]) >= 3; }),
        T().benefitWords.some(function(w){ return new RegExp("\\b" + w, "i").test(C.para); }),
        contacts, clean,
        words(C.para) >= 40 && words(C.para) <= 100
      ];
    }
    var mv = movesIn(d);
    return [
      d.what.length >= 2,
      d.pairs.length >= 1 && d.pairs.length + (ownPair(d) ? 1 : 0) >= 2,
      mv.length >= 4 && mv.indexOf("ma") >= 0,
      contacts, clean,
      words(d.msg) >= 40 && words(d.msg) <= 100
    ];
  }
  function tips(d, res){
    var out = [], X = T(), crit = d.opt === "critique";
    res.forEach(function(ok, i){
      if (ok) return;
      if (i === 4) { var f = line5(d); out.push(f.words.length ? fill(X.tips[4], { w:"<strong>" + esc(f.words[0]) + "</strong>" }) : X.numTip); return; }
      out.push(crit && i < 3 ? X.tipsB[i] : X.tips[i]);
    });
    return out;
  }
  function valid(d){
    if (d.opt === "critique") return d.crit.caps.length ? true : "Choose three captions from Part 3 first.";
    if (!d.title.trim()) return "Give your card a title first.";
    if (!d.aud) return "Choose an audience first.";
    return true;
  }
  function audT(id){ var a = byId(T().audiences, id); return a ? MV.plain(a.t) : ""; }
  // plain-text lines of the card (summary and download)
  function cardLines(s){
    var X = T(), L = [];
    if (s.opt === "critique") {
      L.push("Media critique (option B)");
      s.crit.caps.forEach(function(id){ var c = byId(caps(), id), tq = byId(X.techniques, s.crit.tech[id]); if (!c) return; L.push("- " + MV.plain(c.t) + (tq ? " (" + MV.plain(tq.t) + ")" : "")); if ((s.crit.rw[id] || "").trim()) L.push("  Rewrite: " + s.crit.rw[id].trim()); });
      if (s.crit.para.trim()) L.push("Who benefits: " + s.crit.para.trim());
    } else {
      L.push("Title: " + (s.title.trim() || "(no title yet)") + (s.aud ? " (" + audT(s.aud) + ")" : ""));
      if (s.what.length) { L.push("What it is:"); s.what.forEach(function(id){ var w = byId(X.whatBank, id); if (w) L.push("- " + MV.plain(w.t)); }); }
      var pairs = s.pairs.map(function(id){ return byId(X.mythBank, id); }).filter(Boolean);
      if (pairs.length || ownPair(s)) { L.push("Myths and facts:"); pairs.forEach(function(p){ L.push("- Myth: " + MV.plain(p.myth) + " Fact: " + MV.plain(p.fact)); }); if (ownPair(s)) L.push("- Myth: " + s.ownM.trim() + " Fact: " + s.ownF.trim()); }
      var mv = movesIn(s);
      if (mv.length) { L.push("How to help:"); mv.forEach(function(id, i){ L.push("  " + (i + 1) + ". " + MV.plain(byId(X.moves, id).t)); }); }
      if (s.helpS.trim()) L.push("  " + s.helpS.trim());
    }
    if (s.contacts.length) { L.push("Where to get help:"); s.contacts.forEach(function(id){ var c = byId(X.contacts, id); if (c) L.push("- " + MV.plain(c.t) + (c.detail ? ": " + MV.plain(c.detail) : "")); }); }
    if (s.opt !== "critique" && s.msg.trim()) L.push("A message from us: " + s.msg.trim());
    return L;
  }
  function previewHTML(s){
    var X = T(), h = "";
    if (s.opt === "critique") {
      h += "<h5>Media critique</h5>" + (s.crit.caps.length ? "<ul>" + s.crit.caps.map(function(id){ var c = byId(caps(), id), tq = byId(X.techniques, s.crit.tech[id]); return c ? "<li><strong>" + c.t + "</strong>" + (tq ? ' <span class="ed-tq">' + tq.t + "</span>" : "") + ((s.crit.rw[id] || "").trim() ? "<br>Rewrite: " + esc(s.crit.rw[id].trim()) : "") + "</li>" : ""; }).join("") + "</ul>" : '<p class="muted">Choose three captions.</p>');
      h += "<h5>Who benefits</h5>" + (s.crit.para.trim() ? "<p>" + esc(s.crit.para.trim()) + "</p>" : '<p class="muted">Your paragraph appears here.</p>');
    } else {
      h += '<p class="ed-sct">' + (s.title.trim() ? esc(s.title.trim()) : '<span class="muted">Your title</span>') + "</p>" + (s.aud ? '<p class="tiny muted">For ' + esc(audT(s.aud)) + "</p>" : "");
      h += "<h5>What it is</h5>" + (s.what.length ? "<ul>" + s.what.map(function(id){ var w = byId(X.whatBank, id); return w ? "<li>" + w.t + "</li>" : ""; }).join("") + "</ul>" : '<p class="muted">Choose two or three statements.</p>');
      var pairs = s.pairs.map(function(id){ return byId(X.mythBank, id); }).filter(Boolean);
      h += "<h5>Myths and facts</h5>" + (pairs.length || ownPair(s) ? "<ul>" + pairs.map(function(p){ return "<li><strong>Myth:</strong> " + p.myth + " <strong>Fact:</strong> " + p.fact + "</li>"; }).join("") + (ownPair(s) ? "<li><strong>Myth:</strong> " + esc(s.ownM.trim()) + " <strong>Fact:</strong> " + esc(s.ownF.trim()) + "</li>" : "") + "</ul>" : '<p class="muted">Choose two pairs.</p>');
      var mv = movesIn(s);
      h += "<h5>How to help</h5>" + (mv.length ? "<ol>" + mv.map(function(id){ return "<li>" + byId(X.moves, id).t + "</li>"; }).join("") + "</ol>" : '<p class="muted">Include the key moves.</p>') + (s.helpS.trim() ? "<p>" + esc(s.helpS.trim()) + "</p>" : "");
    }
    h += "<h5>Where to get help</h5>" + (s.contacts.length ? "<ul>" + s.contacts.map(function(id){ var c = byId(X.contacts, id); return c ? "<li><strong>" + c.t + "</strong>" + (c.detail ? ": " + c.detail : "") + "</li>" : ""; }).join("") + "</ul>" : '<p class="muted">Choose contacts.</p>');
    if (s.opt !== "critique") h += "<h5>A message from us</h5>" + (s.msg.trim() ? "<p>" + esc(s.msg.trim()) + "</p>" : '<p class="muted">Your message appears here.</p>');
    return h;
  }
  function setChecks(){ var c = T().checks, L = st().opt === "critique" ? CK_B : CK_A; c.length = 0; L.forEach(function(x){ c.push(x); }); }
  function movesHTML(s){
    var X = T();
    return s.order.map(function(id, i){
      var m = byId(X.moves, id), t = MV.plain(m.t);
      return '<li class="ed-mvrow"><label class="ed-ck"><input type="checkbox" data-inc="' + id + '"' + (s.inc[id] ? " checked" : "") + "> <span>" + m.t + '</span></label><span class="ed-mvb"><button type="button" class="btn ghost sm" data-up="' + id + '" data-k="up' + id + '" aria-label="' + esc("Move up: " + t) + '"' + (i === 0 ? " disabled" : "") + '>↑</button><button type="button" class="btn ghost sm" data-dn="' + id + '" data-k="dn' + id + '" aria-label="' + esc("Move down: " + t) + '"' + (i === s.order.length - 1 ? " disabled" : "") + ">↓</button></span></li>";
    }).join("");
  }
  function capDetailHTML(s){
    var X = T();
    return s.crit.caps.map(function(id){
      var c = byId(caps(), id); if (!c) return "";
      return '<div class="ed-capd"><p class="ed-capt">' + c.t + '</p><div class="ed-capb" role="group" aria-label="' + esc("What " + MV.plain(c.t) + " does") + '">' + X.techniques.map(function(tq){
        var on = s.crit.tech[id] === tq.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-tech="' + id + "|" + tq.id + '" data-k="tq' + id + tq.id + '">' + tq.t + "</button>";
      }).join("") + '</div><label class="ed-lab" for="tk-rw-' + id + '">Your rewrite</label><input type="text" class="txtin" id="tk-rw-' + id + '" data-crw="' + id + '" maxlength="140"></div>';
    }).join("");
  }
  function show(){ var crit = st().opt === "critique"; $("#tk-card").hidden = crit; $("#tk-card2").hidden = crit; $("#tk-crit").hidden = !crit; }
  function paintCapD(){
    var s = st(), host = $("#tk-capd");
    MV.keepFocus(host, function(){ host.innerHTML = capDetailHTML(s); });
    s.crit.caps.forEach(function(id){ var i = $("#tk-rw-" + id); if (i) i.value = s.crit.rw[id] || ""; });
  }
  function paint(){
    var s = st();
    $$("[data-what]").forEach(function(i){ i.checked = s.what.indexOf(i.dataset.what) >= 0; i.disabled = !i.checked && s.what.length >= 3; });
    $$("[data-pair]").forEach(function(i){ i.checked = s.pairs.indexOf(i.dataset.pair) >= 0; i.disabled = !i.checked && s.pairs.length >= 2; });
    $$("[data-contact]").forEach(function(i){ i.checked = s.contacts.indexOf(i.dataset.contact) >= 0; });
    $$("[data-cap]").forEach(function(i){ i.checked = s.crit.caps.indexOf(i.dataset.cap) >= 0; i.disabled = !i.checked && s.crit.caps.length >= 3; });
    $("#tk-msgn").textContent = words(s.msg) + " words (40–100)";
    $("#tk-paran").textContent = words(s.crit.para) + " words (40–100)";
    var f = line5(s);
    $("#tk-flag").innerHTML = f.words.length ? "Flagged: <strong>" + esc(f.words.join(", ")) + "</strong>. Try describing feelings, people and help instead." : f.digit ? T().numTip : "";
    $("#tk-pv").innerHTML = previewHTML(s);
  }
  function changed(){ api.save(); paint(); api.update(); MV.paintSummary(); }
  function toggle(list, id, on, max){ var k = list.indexOf(id); if (on && k < 0 && (!max || list.length < max)) list.push(id); if (!on && k >= 0) list.splice(k, 1); }
  return {
    render:function(inp, pv, a){
      api = a; var s = st(), X = T();
      CK_A = X.checks.slice(); CK_B = X.checksB.slice(); BL = blockRe(X.blocked); setChecks();
      var ck = function(attr, id, html){ return '<label class="ed-ck"><input type="checkbox" ' + attr + '="' + id + '"> <span>' + html + "</span></label>"; };
      inp.innerHTML = '<div class="ed-tk"><div id="tk-opt"></div>' +
        '<div id="tk-card">' +
          '<div class="ed-fs"><label class="ed-lab" for="tk-title">Title</label><input type="text" class="txtin" id="tk-title" data-f="title" maxlength="80"></div>' +
          '<div class="ed-fs" id="tk-aud"></div>' +
          '<fieldset class="ed-fs"><legend>What it is <span class="tiny muted">(choose 2–3)</span></legend><div class="ed-checks">' + X.whatBank.map(function(w){ return ck("data-what", w.id, w.t); }).join("") + "</div></fieldset>" +
          '<fieldset class="ed-fs"><legend>Myth and fact <span class="tiny muted">(choose 2 pairs, plus one in your own words)</span></legend><div class="ed-checks">' + X.mythBank.map(function(p){ return ck("data-pair", p.id, "<strong>Myth:</strong> " + p.myth + " <strong>Fact:</strong> " + p.fact); }).join("") + "</div>" +
            '<label class="ed-lab" for="tk-ownm">Your own myth</label><input type="text" class="txtin" id="tk-ownm" data-f="ownM" maxlength="160"><label class="ed-lab" for="tk-ownf">Your own fact</label><input type="text" class="txtin" id="tk-ownf" data-f="ownF" maxlength="200"></fieldset>' +
          '<fieldset class="ed-fs"><legend>How to help <span class="tiny muted">(put the five key moves in order; include at least four)</span></legend><ol class="ed-moves" id="tk-moves"></ol>' +
            '<label class="ed-lab" for="tk-helps">Add a sentence <span class="tiny muted">(optional)</span></label><input type="text" class="txtin" id="tk-helps" data-f="helpS" maxlength="200"></fieldset>' +
        "</div>" +
        '<div id="tk-crit">' + X.statementB +
          '<fieldset class="ed-fs"><legend>Choose three captions from Part 3</legend><div class="ed-checks">' + caps().map(function(c){ return ck("data-cap", c.id, c.t); }).join("") + '</div></fieldset><div id="tk-capd"></div>' +
          '<div class="ed-fs"><label class="ed-lab" for="tk-para">Who benefits? <span class="tiny muted">(40–100 words)</span></label><textarea id="tk-para" data-cf="para"></textarea><p class="tiny muted" id="tk-paran" aria-live="polite"></p></div>' +
        "</div>" +
        '<fieldset class="ed-fs"><legend>Where to get help <span class="tiny muted">(choose at least two, with a helpline)</span></legend><div class="ed-checks">' + X.contacts.map(function(c){ return ck("data-contact", c.id, "<strong>" + c.t + "</strong>" + (c.detail ? " <span class=\"tiny muted\">" + c.detail + "</span>" : "") + (c.line ? ' <span class="ed-tq">helpline</span>' : "")); }).join("") + "</div></fieldset>" +
        '<div id="tk-card2"><div class="ed-fs"><label class="ed-lab" for="tk-msg">A message from us <span class="tiny muted">(40–100 words)</span></label><textarea id="tk-msg" data-f="msg"></textarea><p class="tiny muted" id="tk-msgn" aria-live="polite"></p></div></div>' +
        '<p class="tiny ed-flag" id="tk-flag" aria-live="polite"></p></div>';
      pv.innerHTML = '<div class="ed-tpv"><h4 class="ed-h4">Preview</h4><div class="ed-scard" id="tk-pv"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="tk-save">Save the card as a text file</button><span class="tiny muted" id="tk-saved" aria-live="polite"></span></div></div>';
      radios($("#tk-opt"), { label:"Task", options:X.options, value:s.opt, onChange:function(v){ st().opt = v; setChecks(); show(); changed(); } });
      rgAud = radios($("#tk-aud"), { label:"Audience", options:X.audiences, value:s.aud, onChange:function(v){ st().aud = v; changed(); } });
      $("#tk-moves").innerHTML = movesHTML(s);
      ["title", "ownM", "ownF", "helpS", "msg"].forEach(function(k){ var el = $('[data-f="' + k + '"]', inp); if (el) el.value = s[k]; });
      $("#tk-para").value = s.crit.para;
      paintCapD();
      inp.addEventListener("input", function(e){
        var t = e.target, x = st(), d = t.dataset || {};
        if (d.f) { x[d.f] = t.value; changed(); }
        else if (d.cf) { x.crit.para = t.value; changed(); }
        else if (d.crw) { x.crit.rw[d.crw] = t.value; changed(); }
      });
      inp.addEventListener("change", function(e){
        var t = e.target, x = st(), d = t.dataset || {};
        if (d.what) { toggle(x.what, d.what, t.checked, 3); changed(); }
        else if (d.pair) { toggle(x.pairs, d.pair, t.checked, 2); changed(); }
        else if (d.contact) { toggle(x.contacts, d.contact, t.checked); changed(); }
        else if (d.inc) { if (t.checked) x.inc[d.inc] = true; else delete x.inc[d.inc]; changed(); }
        else if (d.cap) { toggle(x.crit.caps, d.cap, t.checked, 3); paintCapD(); changed(); }
      });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        var x = st(), d = b.dataset;
        if (d.up || d.dn) {
          var id = d.up || d.dn, k = x.order.indexOf(id), j = k + (d.up ? -1 : 1);
          if (j < 0 || j >= x.order.length) return;
          x.order.splice(k, 1); x.order.splice(j, 0, id);
          var mh = $("#tk-moves"); MV.keepFocus(mh, function(){ mh.innerHTML = movesHTML(x); });
          var f = $('[data-k="' + (d.up ? "up" : "dn") + id + '"]', mh); if (!f || f.disabled) { f = $('[data-k="' + (d.up ? "dn" : "up") + id + '"]', mh); if (f) f.focus({ preventScroll:true }); }
          changed(); return;
        }
        if (d.tech) {
          var q = d.tech.split("|"); x.crit.tech[q[0]] = q[1];
          $$("[data-tech]", $("#tk-capd")).forEach(function(bb){ if (bb.dataset.tech.split("|")[0] !== q[0]) return; var on = bb.dataset.tech === d.tech; bb.classList.toggle("on", on); bb.setAttribute("aria-pressed", String(on)); });
          changed();
        }
      });
      $("#tk-save").addEventListener("click", function(){
        var ok = MV.download("support-card.txt", ["SUPPORT CARD"].concat(cardLines(st()), ["", MV.plain(MV.C.support), ""]).join("\n"));
        $("#tk-saved").textContent = ok ? "Saved as a text file." : "Saving didn’t work in this browser.";
      });
      show(); paint();
    },
    read:read,
    valid:valid,
    checks:checks,
    tips:tips,
    key:function(d){ return d.opt === "critique" ? "critique|" + d.crit.caps.slice().sort().join(",") : "card|" + d.title.trim().replace(/\|/g, "/"); },
    label:function(k){ var q = k.split("|"); return q[0] === "critique" ? "a media critique" : "“" + esc(q.slice(1).join("|")) + "”"; },
    text:function(k){ var q = k.split("|"); return q[0] === "critique" ? "media critique" : q.slice(1).join("|"); },
    summary:function(ts){
      var s = norm(JSON.parse(JSON.stringify(ts.app || {}))), done = (ts.found || []).length > 0;
      var L = [(s.opt === "critique" ? "Support card (option B, media critique): " : "Support card: ") + (done ? "complete" : "not complete")];
      cardLines(s).forEach(function(l){ L.push("  " + l); });
      return L;
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  summaryLines:function(){
    var L = [];
    if (ALT) L.push("Path: the shorter path (Media and a short Final Check)");
    if (MV.S.app.ed && MV.S.app.ed.addJ) {
      var J = MV.C.reflect.journal, any = J.filter(function(j){ return (MV.S.journal[j.id] || "").trim(); });
      L.push(""); L.push("Journal (added by choice):");
      if (!any.length) L.push("  (no entries yet)");
      any.forEach(function(j){ L.push("  " + MV.plain(j.q)); L.push("    " + MV.S.journal[j.id].trim()); });
    }
    return L;
  }
});
})();
