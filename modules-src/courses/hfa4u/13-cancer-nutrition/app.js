// HFA4U 13 Cancer & Nutrition: hero (evidence-ladder storyboard), Evidence ladder (Explore: F13 ladder with tap-to-place claim
// cards, a risk translator with a 100-person icon array, a study designer; predictions; challenges), Headline vs study (Part 3:
// F13 claim checker with word-chip tapping, a teacher slot and a treatment panel), the risk arithmetic and critique set (custom
// practice), the "Fix the headline" task, and the support note (header dialog and after the journal).
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
// Module rules: risk numbers are model values for groups of people, never a personal estimate; kind language, no blame.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function r2(v){ return Math.round(v * 100) / 100; }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); }
function arr(v){ return Array.isArray(v) ? v : []; }
function intIn(v, lo, hi, d){ v = +v; return (isFinite(v) && Math.round(v) === v && v >= lo && v <= hi) ? v : d; }
function sgn(v, dp){ return (v > 0 ? "+" : v < 0 ? MV.MINUS : "") + MV.num(Math.abs(v), dp == null ? 2 : dp); }
function pct(v){ return sgn(v, 0) + "%"; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "start") + '"' + (extra || "") + ">" + s + "</text>"; }
function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }

// ---------- @component radioGroup (copied from HFA4U 06; "cn-" classes) ----------
//   Segmented control or chip row as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange}) -> {set, get}. Use a fresh host per call.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "seg" ? "seg" : "cn-chipset";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="cn-rgw">' + (o.label ? '<span class="cn-rgl">' + o.label + "</span>" : "") + '<span class="cn-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
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

// ---------- support note: a "Support" header button with a dialog, and the note after the journal (plan Reflect) ----------
// (pattern from HFA4U 10's header dialog)
function supHTML(id){ return '<div class="hfa-support cn-sup"' + (id ? ' id="' + id + '"' : "") + ' role="note"><p>' + MV.C.support + "</p><p>" + MV.C.advice + "</p></div>"; }
function decorate(){
  var hb = $(".hd-btns");
  if (hb && !$("#cn-supbtn")) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn ghost sm cn-supbtn"; b.id = "cn-supbtn"; b.setAttribute("aria-haspopup", "dialog"); b.textContent = "Support";
    hb.insertBefore(b, hb.firstChild);
    var dlg = document.createElement("dialog");
    dlg.className = "cn-dlg"; dlg.id = "cn-dlg"; dlg.setAttribute("aria-labelledby", "cn-dlg-t");
    dlg.innerHTML = '<div class="cn-dlg-top"><h2 id="cn-dlg-t">Support</h2><button type="button" class="btn ghost sm" data-cn="close">Close</button></div>' + supHTML();
    $("#mv-root").appendChild(dlg);
    var close = function(){ if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); b.focus(); };
    b.addEventListener("click", function(){ if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
    dlg.addEventListener("click", function(e){ if (e.target === dlg || e.target.closest('[data-cn="close"]')) close(); });
  }
  var j = $("#journal"); if (j && !$("#cn-jsup")) j.insertAdjacentHTML("afterend", supHTML("cn-jsup"));
}

// ---------- hero: the berry-powder card climbs to rung 2 ("Lab study only"); the processed-meat card climbs to rung 5 ----------
var HX = { w:440, h:300, r0:24, r1:78, lab:92, cx:268, cw:164, ch:42 };
function rungY(r){ return 270 - (r - 1) * 56; }
function heroSVG(st, H){
  var h = "", R = MV.C.explore.rungs;
  h += '<line class="cn-hrail" x1="' + HX.r0 + '" y1="12" x2="' + HX.r0 + '" y2="292"/><line class="cn-hrail" x1="' + HX.r1 + '" y1="12" x2="' + HX.r1 + '" y2="292"/>';
  R.forEach(function(r){
    var y = rungY(r.n), on = st.lit.indexOf(r.n) >= 0;
    h += '<line class="cn-hrung" x1="' + HX.r0 + '" y1="' + y + '" x2="' + HX.r1 + '" y2="' + y + '"/>';
    h += svgT(HX.lab, y + 5, '<tspan class="cn-hn">' + r.n + "</tspan>  " + r.t, "cn-hl" + (on ? " on" : ""));
  });
  H.cards.forEach(function(c, i){
    var s = st.c[i]; if (!s || s.o <= 0) return;
    var y = s.y, x = HX.cx;
    h += '<g style="opacity:' + r2(s.o) + '"><path class="cn-hptr" d="M' + x + " " + f1(y - 7) + "L" + (x - 9) + " " + f1(y) + "L" + x + " " + f1(y + 7) + 'Z"/>' +
      '<rect class="cn-hcard" x="' + x + '" y="' + f1(y - HX.ch / 2) + '" width="' + HX.cw + '" height="' + HX.ch + '" rx="6"/>' +
      svgT(x + 10, y - 3, c.lines[0], "cn-hct") + svgT(x + 10, y + 13, c.lines[1], "cn-hct") + "</g>";
    if (s.stamp > 0) {
      var sw = c.stamp.length * 6.9 + 18, sy = y + HX.ch / 2 + 13, sx = x + HX.cw / 2;
      h += '<g class="cn-hstamp" transform="translate(' + f1(sx) + " " + f1(sy) + ') rotate(-4)" style="opacity:' + r2(s.stamp) + '"><rect x="' + f1(-sw / 2) + '" y="-10" width="' + f1(sw) + '" height="20" rx="3"/>' + svgT(0, 4.5, c.stamp, "cn-hst", "middle") + "</g>";
    }
  });
  return h;
}
function hero(f){
  decorate();
  var host = $("#cn-hero"); if (!host) return;
  var H = MV.C.hero;
  host.innerHTML = '<svg class="cn-hsvg" viewBox="0 0 ' + HX.w + " " + HX.h + '" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild, st = { c:[{ y:rungY(1), o:1, stamp:0 }, { y:rungY(1), o:0, stamp:0 }], lit:[1] };
  function draw(){ svg.innerHTML = heroSVG(st, H); }
  function cap(){ if (f.cap) { f.cap.textContent = H.caption; f.cap.classList.add("cn-cap"); } }
  var c1 = H.cards[0], c2 = H.cards[1];
  if (MV.reduceMotion) { st = { c:[{ y:rungY(c1.to), o:1, stamp:1 }, { y:rungY(c2.to), o:1, stamp:1 }], lit:[c1.to, c2.to] }; draw(); cap(); return; }
  draw();
  function climb(i, to, dur, next){
    MV.tween({ dur:dur, step:function(t){ var r = lerp(1, to, t); st.c[i].y = rungY(r); st.lit = [st.c[0] && i === 1 ? c1.to : -1, Math.round(r)]; draw(); }, done:next });
  }
  MV.wait(700, function(){
    climb(0, c1.to, 1100, function(){
      st.lit = [c1.to];
      MV.tween({ dur:420, step:function(t){ st.c[0].stamp = t; draw(); }, done:function(){
        MV.wait(500, function(){
          MV.tween({ dur:350, step:function(t){ st.c[1].o = t; draw(); }, done:function(){
            climb(1, c2.to, 2300, function(){
              st.lit = [c1.to, c2.to];
              MV.tween({ dur:420, step:function(t){ st.c[1].stamp = t; draw(); }, done:function(){ MV.wait(200, cap); } });
            });
          } });
        });
      } });
    });
  });
}

// ---------- @component personArray — 100-person icon array (10 × 10): baseline cases --ink-2, extra cases orange with a "+",
// cases avoided blue dashed with a "−"; partial people are filled in proportion (model values) ----------
var PERSON = '<circle cx="15" cy="8.2" r="5.4"/><path d="M6.3 31.5V24a8.7 8.7 0 0 1 17.4 0v7.5z"/>';
function personArray(B, N){
  var h = '<defs><g id="cn-pp">' + PERSON + "</g></defs>", clip = 0;
  function use(cls, x, y, cp){ return '<use href="#cn-pp" x="' + x + '" y="' + y + '" class="cn-i ' + cls + '"' + (cp ? ' clip-path="url(#' + cp + ')"' : "") + "/>"; }
  function part(cls, x, y, a, b){
    if (b - a <= 0.001) return "";
    if (a <= 0.001 && b >= 0.999) return use(cls, x, y);
    var id = "cn-cl" + (clip++);
    return '<clipPath id="' + id + '"><rect x="' + f1(x + a * 30) + '" y="' + y + '" width="' + f1((b - a) * 30) + '" height="33"/></clipPath>' + use(cls, x, y, id);
  }
  for (var i = 0; i < 100; i++) {
    var x = (i % 10) * 30, y = Math.floor(i / 10) * 33;
    var bp = clamp(B - i, 0, 1), np = clamp(N - i, 0, 1);
    h += use("o", x, y);
    if (N >= B) {
      h += part("b", x, y, 0, bp);
      if (np > bp) { h += part("x", x, y, bp, np); if (np - bp >= 0.5) h += '<path class="cn-mk" transform="translate(' + x + " " + y + ')" d="M15 21.2v7M11.5 24.7h7"/>'; }
    } else {
      h += part("b", x, y, 0, np);
      if (bp > np) { h += part("f", x, y, np, bp); if (bp - np >= 0.5) h += '<path class="cn-mk f" transform="translate(' + x + " " + y + ')" d="M11.5 24.7h7"/>'; }
    }
  }
  return h;
}
function legendHTML(){
  function ic(cls, mk){ return '<svg class="cn-lgi" viewBox="0 0 30 33" aria-hidden="true">' + '<g class="cn-i ' + cls + '">' + PERSON + "</g>" + (mk || "") + "</svg>"; }
  return '<span class="cn-lg">' + ic("b") + " Would develop it anyway (baseline)</span>" +
    '<span class="cn-lg">' + ic("x", '<path class="cn-mk" d="M15 21.2v7M11.5 24.7h7"/>') + " Extra cases (+)</span>" +
    '<span class="cn-lg">' + ic("f", '<path class="cn-mk f" d="M11.5 24.7h7"/>') + " Cases avoided (−)</span>" +
    '<span class="cn-lg">' + ic("o") + " Doesn’t develop it</span>";
}
// "Out of N people like this, about K more would develop it." with the smallest N that makes K whole (model values)
function plainSentence(A, preset){
  var more = A > 0 ? "more" : "fewer", a = Math.abs(A);
  if (a < 1e-9) return "No change.";
  if (preset) return "Out of 100 people like this, about " + Math.max(1, Math.round(a)) + " " + more + " would develop it.";
  var Ns = [100, 200, 250, 400, 500, 1000];
  for (var i = 0; i < Ns.length; i++) { var k = a * Ns[i] / 100; if (Math.abs(k - Math.round(k)) < 1e-6) return "Out of " + MV.num(Ns[i]) + " people like this, about " + Math.round(k) + " " + more + " would develop it."; }
  return "Out of 100 people like this, about " + MV.num(a, 2) + " " + more + " would develop it.";
}

// ---------- Explore: Evidence ladder (@component F13 evidenceLadder — tap-to-place claim cards on five rungs, prediction
// spotlight; risk translator; study designer) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = {}, anim = null, pend = null, sel = null, lastRung = null, trTw = null, msg = "";
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  var R = D.rungs, CARDS = D.cards, T = D.translator, DG = D.designer;
  function rungN(n){ for (var i = 0; i < R.length; i++) if (R[i].n === n) return R[i]; return null; }
  var IDX5 = T.base.indexOf(T.preset.base), IDX20 = T.chg.indexOf(20);
  S.mode = byId(D.modes, S.mode) ? S.mode : "ladder";
  S.place = S.place && typeof S.place === "object" ? S.place : {};
  CARDS.forEach(function(c){ if (S.place[c.id] != null) S.place[c.id] = intIn(S.place[c.id], 1, 5, null); if (S.place[c.id] == null) delete S.place[c.id]; });
  S.b = intIn(S.b, 0, T.base.length - 1, IDX5); S.c = intIn(S.c, 0, T.chg.length - 1, IDX20); S.preset = !!S.preset;
  S.d = S.d && typeof S.d === "object" ? S.d : {};
  DG.rows.forEach(function(r){ if (!byId(r.options, S.d[r.id])) delete S.d[r.id]; });
  var fx = { spot:null, bars:0, others:0, climb:null, hide:false, nShow:null };

  host.innerHTML = '<div class="cn-lab"><div class="cn-main" data-mv="graph"><div id="cn-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="cn-m1"></div><div id="cn-m2"></div><div id="cn-m3"></div></div>' +
    '<div class="cn-side"><h4 class="cn-h4">Readout</h4><dl class="read" id="cn-read" aria-live="polite"></dl></div></div>';
  var modeRG = radios($("#cn-mode", host), { label:"Mode", cls:"seg", options:D.modes, value:S.mode,
    onChange:function(v){ cancelAnim(); fx.spot = null; S.mode = v; MV.banner("", ""); commit(); } });

  // ===== Mode 1: Ladder =====
  var m1 = $("#cn-m1", host);
  m1.innerHTML = '<p class="how">Tap a claim card, then tap the rung its evidence reaches. To move a card, tap it on the ladder, then tap another rung.</p>' +
    '<div class="cn-spot" id="cn-spot" hidden></div>' +
    '<h5 class="cn-h5">Claim cards</h5><div class="cn-tray" id="cn-tray" role="group" aria-label="Claim cards to place"></div><p class="tiny cn-lst" id="cn-lst" aria-live="polite"></p>' +
    '<div class="cn-ladder" id="cn-ladder" role="group" aria-label="Evidence ladder, rung 5 at the top"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="cn-lreset" data-k="lreset">Put every card back in the tray</button></div>';
  function rungOf(c){ if (fx.climb && fx.climb.id === c.id) return fx.climb.rung || null; return S.place[c.id] || null; }
  function cardHTML(c, opt){
    opt = opt || {};
    var on = !opt.still && sel === c.id, lit = fx.climb && fx.climb.id === c.id && !opt.still;
    var stamp = (c.id === "c5" && S.surprise && !fx.climb && rungOf(c) === 4) || (opt.still && opt.stamp);
    var inner = '<span class="cn-ct">' + c.t + '</span><span class="cn-cn">' + c.note + "</span>" + (c.fict ? '<span class="cn-cf">' + c.fict + "</span>" : "") +
      (opt.tag ? '<span class="cn-ctag">' + opt.tag + "</span>" : "") + (stamp ? '<span class="cn-stamp">' + D.surprise + "</span>" : "");
    if (opt.still) return '<div class="cn-card still">' + inner + "</div>";
    return '<button type="button" class="cn-card' + (on ? " on" : "") + (lit ? " cn-lit" : "") + '" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + on + '">' + inner + "</button>";
  }
  function spotHTML(){
    var h = '<p class="cn-spt"><span class="tag">Prediction spotlight</span></p>', c6 = byId(CARDS, "c6");
    if (fx.spot === "p1") {
      h += '<div class="cn-spc">' + cardHTML(c6, { still:true, tag:"Group 1 · rung 5" }) + cardHTML(D.tobacco, { still:true, tag:"Group 1 · rung 5" }) + "</div>";
      if (fx.bars > 0) {
        var C = D.compare, max = Math.max.apply(null, C.rows.map(function(r){ return r.v; }));
        h += '<div class="cn-cmp"><p class="cn-cmpt"><strong>' + C.title + '</strong> <span class="hfa-model">' + C.tag + "</span></p>" + C.rows.map(function(r){
          return '<div class="cn-cmpr"><span class="cn-cmpl">' + r.t + '</span><span class="cn-cmpb" aria-hidden="true"><i style="width:' + f1(clamp(r.v / max, 0.015, 1) * fx.bars * 100) + '%"></i><b class="cn-cmp1"></b></span><span class="cn-cmpv"' + (fx.bars < 1 ? ' style="opacity:' + r2(fx.bars) + '"' : "") + ">" + r.label + "</span></div>";
        }).join("") + '<p class="tiny muted cn-cmpn">' + C.note + "</p></div>";
      }
    } else if (fx.spot === "p3") {
      var c8 = byId(CARDS, "c8"), O = D.others;
      h += '<div class="cn-spc">' + cardHTML(c8, { still:true }) + "</div>";
      if (fx.others > 0) h += '<div class="cn-oth"><p><strong>' + O.title + '</strong></p><ul class="cn-othl">' + O.items.slice(0, fx.others).map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>" + (fx.others >= O.items.length ? '<p class="tiny">' + O.note + "</p>" : "") + "</div>";
    } else if (fx.spot === "p4") {
      var c5 = byId(CARDS, "c5"), done = !fx.climb && S.surprise;
      h += '<div class="cn-spc">' + cardHTML(c5, { still:true, stamp:done }) + "</div>";
      h += '<p class="tiny">' + (fx.climb ? (fx.climb.rung ? "Climbing: rung " + fx.climb.rung + " of 5…" : "Watch the card on the ladder.") : "On the ladder: rung 4, Randomized trial.") + "</p>";
    }
    return h;
  }
  function paintSpot(){ var sp = $("#cn-spot", m1); sp.hidden = !fx.spot; if (fx.spot) sp.innerHTML = spotHTML(); }
  function paintLadder(){
    paintSpot();
    var tray = $("#cn-tray", m1), lad = $("#cn-ladder", m1);
    var left = CARDS.filter(function(c){ return !rungOf(c); });
    MV.keepFocus(tray, function(){ tray.innerHTML = left.length ? left.map(function(c){ return cardHTML(c); }).join("") : '<p class="tiny muted">Every card is on the ladder.</p>'; });
    MV.keepFocus(lad, function(){
      lad.innerHTML = R.slice().reverse().map(function(r){
        var on = CARDS.filter(function(c){ return rungOf(c) === r.n; }), lit = fx.climb && fx.climb.rung === r.n;
        var lab = "Rung " + r.n + ": " + MV.plain(r.t) + (on.length ? ", " + on.length + " card" + (on.length > 1 ? "s" : "") : ", empty") + (sel ? ". Place the selected card here" : "");
        return '<div class="cn-rung' + (lit ? " cn-lit" : "") + '"><span class="cn-rail" aria-hidden="true"></span><div class="cn-rbody">' +
          '<button type="button" class="cn-rb' + (sel ? " ready" : "") + '" data-rung="' + r.n + '" data-k="rg' + r.n + '" aria-label="' + esc(lab) + '"><span class="cn-rn" aria-hidden="true">' + r.n + '</span><span class="cn-rt">' + r.t + "</span>" + (sel ? '<span class="cn-ph" aria-hidden="true">Place here</span>' : "") + "</button>" +
          '<div class="cn-rcards">' + on.map(function(c){ return cardHTML(c); }).join("") + "</div></div></div>";
      }).join("");
    });
    var sc = byId(CARDS, sel);
    $("#cn-lst", m1).textContent = msg || (sc ? "Selected: " + MV.plain(sc.t) + ". Now tap a rung." : left.length ? left.length + " of " + CARDS.length + " cards still in the tray." : "All " + CARDS.length + " cards are on the ladder. Check challenge 1 below.");
  }
  m1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.card || b.dataset.rung || b.id === "cn-lreset") { if (anim) cancelAnim(); fx.spot = null; }
    msg = "";
    if (b.dataset.card) { sel = sel === b.dataset.card ? null : b.dataset.card; api.save(); paintLadder(); readPaint(); return; }
    if (b.dataset.rung) {
      var n = +b.dataset.rung; lastRung = n;
      if (!sel) { msg = "Tap a card first, then tap the rung its evidence reaches."; paintLadder(); readPaint(); return; }
      S.place[sel] = n; sel = null; commit();
      var nx = $("#cn-tray [data-card]", m1); if (nx) nx.focus({ preventScroll:true });
      return;
    }
    if (b.id === "cn-lreset") { S.place = {}; S.surprise = false; sel = null; lastRung = null; commit(); }
  });

  // ===== Mode 2: Risk translator =====
  var m2 = $("#cn-m2", host);
  m2.innerHTML = '<p class="tiny muted cn-trn">Lifetime risk per 100 people like this <span class="hfa-model">' + T.tag + "</span></p>" +
    '<div class="cn-sl" id="cn-sl"></div>' +
    '<figure class="cn-ia"><svg class="cn-ias" id="cn-ias" viewBox="0 0 300 330" role="img" aria-label=""></svg><figcaption class="cn-leg">' + legendHTML() + "</figcaption></figure>";
  function bVal(){ return T.base[S.b]; }
  function cVal(){ return S.preset ? T.preset.chg : T.chg[S.c]; }
  function newRisk(){ return Math.round(bVal() * (100 + cVal())) / 100; }
  function absChg(){ return Math.round(bVal() * cVal()) / 100; }
  function cTxt(i){ return S.preset ? "+" + T.preset.chg + "% (" + T.preset.shown + ")" : pct(T.chg[i]); }
  var sl = MV.sliders($("#cn-sl", m2), [
    { id:"b", label:T.baseLabel, min:0, max:T.base.length - 1, step:1, value:S.b, fmt:function(i){ return T.base[i] + " in 100"; } },
    { id:"c", label:T.chgLabel, min:0, max:T.chg.length - 1, step:1, value:S.c, fmt:cTxt }
  ], function(id, v){
    if (anim) cancelAnim();
    var from = fx.nShow != null ? fx.nShow : newRisk();
    if (id === "b") S.b = v; else { S.c = v; S.preset = false; sl.set("c", v); }
    var to = newRisk();
    if (trTw) trTw();
    fx.nShow = from;
    trTw = MV.tween({ dur:320, step:function(t){ fx.nShow = lerp(from, to, t); paintIA(); }, done:function(){ trTw = null; fx.nShow = null; paintIA(); } });
    commit();
  });
  function aria(){ $$("input[data-sl]", m2).forEach(function(el){ var id = el.dataset.sl; el.setAttribute("aria-valuetext", id === "b" ? T.base[S.b] + " in 100" : cTxt(S.c)); }); }
  function riskWords(B, N){
    var d = r2(N - B);
    return "100 people. " + MV.num(B, 2) + " would develop it anyway (the baseline). " + (d > 0 ? MV.num(d, 2) + " more would develop it with the change (extra cases)." : d < 0 ? MV.num(-d, 2) + " fewer would develop it with the change (cases avoided)." : "");
  }
  function paintIA(){
    var B = bVal(), N = fx.hide ? (fx.nShow != null ? fx.nShow : B) : (fx.nShow != null ? fx.nShow : newRisk());
    var svg = $("#cn-ias", m2); svg.innerHTML = personArray(B, N);
    svg.setAttribute("aria-label", fx.hide ? "100 people. " + B + " would develop it anyway (the baseline). The change is hidden until the reveal." : riskWords(B, newRisk()));
  }
  function paintRisk(){ sl.set("b", S.b); sl.set("c", S.c); aria(); paintIA(); }

  // ===== Mode 3: Study designer =====
  var m3 = $("#cn-m3", host), drg = {};
  m3.innerHTML = '<p class="cn-claim"><span class="tag">Claim to test</span> ' + DG.claim + "</p>" + DG.rows.map(function(r){ return '<div class="cn-dgr" id="cn-dg-' + r.id + '"></div>'; }).join("") +
    '<div class="cn-dsum" id="cn-dsum"></div>';
  DG.rows.forEach(function(r){
    drg[r.id] = radios($("#cn-dg-" + r.id, m3), { label:r.t, cls:"chips", options:r.options, value:S.d[r.id] || "",
      onChange:function(v){ S.d[r.id] = v; commit(); } });
  });
  function paintDesign(){
    DG.rows.forEach(function(r){ drg[r.id].set(S.d[r.id] || ""); });
    $("#cn-dsum", m3).innerHTML = '<h5 class="cn-h5">Your study</h5><ul class="cn-dsl">' + DG.rows.map(function(r){
      var o = byId(r.options, S.d[r.id]);
      return "<li><strong>" + r.t + ":</strong> " + (o ? o.does : '<span class="muted">not chosen yet</span>') + "</li>";
    }).join("") + "</ul>";
  }

  // ===== readout =====
  function readPaint(){
    var rows = [];
    if (S.mode === "ladder") {
      var placed = CARDS.filter(function(c){ return S.place[c.id]; }).length, sc = byId(CARDS, sel), rr = rungN(lastRung) || rungN(sc && S.place[sc.id]);
      rows.push(["Cards placed", placed + " of " + CARDS.length]);
      rows.push(["Selected card", sc ? sc.t + " <span class=\"muted\">(" + sc.note + ")</span>" : "None"]);
      rows.push([rr ? "Rung " + rr.n + ": " + rr.t : "Rung", rr ? "What it can show: " + rr.show : "Tap a rung to see what that kind of evidence can show."]);
    } else if (S.mode === "risk") {
      var hide = fx.hide, N = newRisk(), A = absChg();
      rows.push(["Baseline", bVal() + " in 100"]);
      rows.push(["Relative change", cTxt(S.c)]);
      rows.push(["New risk", hide ? "…" : (S.preset ? "about " + Math.round(N) + " in 100 (" + MV.num(N, 2) + ")" : MV.num(N, 2) + " in 100")]);
      rows.push(["Absolute change", hide ? "…" : (S.preset ? "about " + sgn(Math.round(A), 0) + " in 100 (" + sgn(A) + ")" : sgn(A) + " in 100")]);
      rows.push(["In plain language", hide ? "…" : "“" + plainSentence(A, S.preset) + "”"]);
    } else {
      var dz = byId(DG.rows[0].options, S.d.design), made = DG.rows.filter(function(r){ return S.d[r.id]; }).length;
      rows.push(["Claim", DG.claim]);
      rows.push(["This design reaches", dz ? "Rung " + dz.rung + ": " + rungN(dz.rung).t : "Choose a design"]);
      rows.push(["Choices made", made + " of " + DG.rows.length]);
    }
    $("#cn-read", host).innerHTML = MV.readoutHTML(rows);
  }

  // ===== paint / commit =====
  var m = { ladder:m1, risk:m2, design:m3 };
  function paint(){
    modeRG.set(S.mode);
    Object.keys(m).forEach(function(k){ m[k].hidden = S.mode !== k; });
    if (S.mode === "ladder") paintLadder(); else if (S.mode === "risk") paintRisk(); else paintDesign();
    readPaint();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function finish(){ anim = null; fx.climb = null; fx.hide = false; fx.nShow = null; paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){
    if (anim) { anim(); anim = null; }
    if (fx.climb) { S.place.c5 = 4; S.surprise = true; fx.climb = null; }
    fx.hide = false; fx.nShow = null; if (fx.spot === "p1") fx.bars = 1; if (fx.spot === "p3") fx.others = D.others.items.length;
    if (pend) { var d = pend; pend = null; d(); }
  }
  paint();

  // ===== challenges (plan's exact tests and named wrong states) =====
  function challenge(id, live){
    var M = CH[id].msgs;
    if (id === "tc1") {
      var P = S.place;
      if (P.c4 === 5) return { ok:false, msg:M.c4r5 };
      if (P.c5 === 3) return { ok:false, msg:M.c5r3 };
      if (P.c2 === 4 || P.c3 === 4) return { ok:false, msg:M.c23r4 };
      var n = CARDS.filter(function(c){ return !P[c.id]; }).length;
      if (n) return { ok:false, msg:fill(M.unplaced, { n:n }) };
      var k = CARDS.filter(function(c){ return P[c.id] === MV.ans(c); }).length;
      if (k < CARDS.length) return { ok:false, msg:fill(M.count, { k:k }) };
      return { ok:true };
    }
    if (id === "tc2") {
      if (S.preset) return { ok:false, msg:M.preset };
      var b = bVal(), c = cVal(), a = absChg();
      if (b === 2 && c === 50) return { ok:false, msg:M.b2c50 };
      if (b === 10 && c === 40) return { ok:false, msg:M.b10c40 };
      if (Math.abs(a - 2) < 1e-9) { if (!live) MV.banner("good", CH.tc2.banner); return { ok:true }; }
      if (Math.abs(a + 2) < 1e-9) return { ok:false, msg:M.minus };
      return { ok:false, msg:fill(M.other, { v:sgn(a) }) };
    }
    if (id === "tc3") {
      var d = S.d;
      if (d.comp === "self") return { ok:false, msg:M.self };
      if (d.out === "after") return { ok:false, msg:M.after };
      if (d.len === "2") return { ok:false, msg:M.short };
      if (DG.rows.some(function(r){ return !d[r.id]; })) return { ok:false, msg:M.unset };
      if (d.design !== "rct") return { ok:false, msg:M.design };
      if (d.comp !== "plac") return { ok:false, msg:M.comp };
      if (d.blind !== "both") return { ok:false, msg:M.blind };
      return { ok:true };   // outcome chosen in advance and 8, 12 or 24 weeks (the three accepted states)
    }
    return { ok:false };
  }

  // ===== predictions =====
  return {
    predict:{
      start:function(p){
        cancelAnim(); sel = null; msg = ""; fx.bars = 0; fx.others = 0;
        if (p.id === "p2") {
          S.mode = "risk"; fx.spot = null; S.b = IDX5; S.c = IDX20; S.preset = true; fx.hide = true; fx.nShow = T.preset.base;
          if (trTw) { trTw(); trTw = null; }
        } else {
          S.mode = "ladder"; fx.spot = p.id;
          if (p.id === "p4") fx.climb = { id:"c5", rung:0 };
        }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") { reveal($("#cn-spot", m1)); anim = MV.tween({ dur:1500, step:function(t){ fx.bars = t; paintSpot(); }, done:finish }); }
        else if (p.id === "p2") {
          reveal($("#cn-ias", m2));
          var B = T.preset.base, N = newRisk();
          anim = MV.tween({ dur:1300, step:function(t){ fx.nShow = lerp(B, N, t); paintIA(); }, done:finish });
        }
        else if (p.id === "p3") {
          reveal($("#cn-spot", m1)); var L = D.others.items.length;
          anim = MV.tween({ dur:1600, ease:function(t){ return t; }, step:function(t){ var k = t >= 1 ? L : Math.min(L, Math.floor(t * L) + 1); if (k !== fx.others) { fx.others = k; paintSpot(); } }, done:finish });
        }
        else {
          reveal($("#cn-ladder", m1));
          anim = MV.tween({ dur:2000, ease:function(t){ return t; }, step:function(t){ var r = t >= 1 ? 4 : Math.min(4, Math.floor(t * 4) + 1); if (fx.climb && r !== fx.climb.rung) { fx.climb.rung = r; paintLadder(); } },
            done:function(){ S.place.c5 = 4; S.surprise = true; api.save(); finish(); } });
        }
      }
    },
    challenge:function(id, opt){ return challenge(id, !!(opt && opt.live)); }
  };
}

// ---------- Part 3: Headline vs study (@component F13 claimChecker — headline word chips vs a study summary, "Check it with
// data", fix-it boxes; a teacher slot; a treatment panel) ----------
function words(s){ return String(s || "").trim().split(/\s+/).filter(Boolean); }
function part3(host, api){
  var D = api.content, S = api.S, P = D.pairs, msgs = {}, timers = {};
  S.st = byId(D.stations, S.st) ? S.st : "s1"; S.i = intIn(S.i, 0, P.length - 1, 0);
  S.sel = S.sel && typeof S.sel === "object" ? S.sel : {}; S.ok = S.ok || {}; S.fix = S.fix || {}; S.s2 = S.s2 || {}; S.s2sel = arr(S.s2sel);
  host.innerHTML = '<div id="cn-st"></div><div class="cn-stn" id="cn-s1"></div><div class="cn-stn" id="cn-s2"></div><div class="cn-stn" id="cn-s3"></div>';
  radios($("#cn-st", host), { label:"Station", cls:"chips", options:D.stations, value:S.st, onChange:function(v){ S.st = v; api.save(); show(); } });
  var s1 = $("#cn-s1", host), s2 = $("#cn-s2", host), s3 = $("#cn-s3", host);
  function show(){ s1.hidden = S.st !== "s1"; s2.hidden = S.st !== "s2"; s3.hidden = S.st !== "s3"; }

  // ----- Station 1: three pairs -----
  function paintS1(){
    var p = P[S.i], sel = arr(S.sel[p.id]), solved = !!S.ok[p.id], ans = MV.ans(p), req = solved ? ans.req.concat(ans.opt) : [];
    var h = '<div class="cn-pt"><span class="tiny muted">Pair ' + (S.i + 1) + " of " + P.length + '</span><span class="dots" aria-hidden="true">' + P.map(function(x, i){ return '<span class="dot' + (S.ok[x.id] ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<div class="cn-pair"><div class="cn-hl"><p class="cn-hlh"><span class="hfa-model">' + D.tag + '</span> Headline</p><p class="cn-hlw" role="group" aria-label="Headline words: tap the ones that overstate the study">' +
      p.words.map(function(w, i){ var on = sel.indexOf(i) >= 0, over = solved && req.indexOf(i) >= 0;
        return '<button type="button" class="cn-w' + (on ? " on" : "") + (over ? " over" : "") + '" data-w="' + i + '" data-k="w' + p.id + i + '" aria-pressed="' + on + '"' + (solved ? " disabled" : "") + ">" + w + (over ? '<span class="vh"> (overstated)</span>' : "") + "</button>"; }).join("") + "</p></div>" +
      '<div class="cn-study"><p class="cn-hlh">What the study did <span class="tag">' + p.design + "</span></p><p>" + p.study + "</p></div></div>";
    if (!solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="p3chk">Check my words</button><button type="button" class="btn ghost sm" data-act="clear" data-k="p3clr">Clear</button></div>';
    if (msgs[p.id]) h += MV.fbHTML(msgs[p.id].good ? "good" : "bad", msgs[p.id].html);
    else if (solved) h += MV.fbHTML("good", "<strong>✓ Found.</strong> " + p.good);
    if (solved) {
      h += '<details class="alg cn-data"><summary>Check it with data</summary><p>' + p.data + "</p></details>";
      h += '<div class="jq cn-fixq"><label for="cn-fix-' + p.id + '">Fix it: rewrite the headline so it matches the study</label><textarea id="cn-fix-' + p.id + '" data-fix="' + p.id + '"></textarea><div class="saved" id="cn-fix-' + p.id + '-saved" aria-live="polite"></div></div>';
      h += '<details class="cn-sample"><summary>Compare with a sample fix</summary><p>“' + p.sample + "”</p></details>";
    }
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-nav="-1" data-k="p3prev"' + (S.i === 0 ? " disabled" : "") + '>Previous pair</button><button type="button" class="btn ' + (solved ? "primary" : "ghost") + ' sm" data-nav="1" data-k="p3next"' + (S.i === P.length - 1 ? " disabled" : "") + ">Next pair</button></div>";
    MV.keepFocus(s1, function(){ s1.innerHTML = h; });
    var ta = $("textarea[data-fix]", s1); if (ta) ta.value = S.fix[p.id] || "";
  }
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var p = P[S.i], sel = arr(S.sel[p.id]);
    if (b.dataset.w != null) {
      var i = +b.dataset.w, k = sel.indexOf(i);
      if (k >= 0) sel.splice(k, 1); else sel.push(i);
      S.sel[p.id] = sel; msgs[p.id] = null; api.save(); paintS1(); return;
    }
    if (b.dataset.act === "clear") { S.sel[p.id] = []; msgs[p.id] = null; api.save(); paintS1(); return; }
    if (b.dataset.act === "check") {
      var ans = MV.ans(p), req = ans.req, opt = ans.opt || [];
      var extra = sel.filter(function(x){ return req.indexOf(x) < 0 && opt.indexOf(x) < 0; });
      var missing = req.filter(function(x){ return sel.indexOf(x) < 0; });
      if (!sel.length) msgs[p.id] = { html:"Tap at least one word in the headline first." };
      else if (extra.length) msgs[p.id] = { html:"<strong>✗ Not quite.</strong> “" + p.words[extra[0]] + "” matches the study; it doesn’t overstate it. Untap it and look again." };
      else if (missing.length) msgs[p.id] = { html:"<strong>✗ Not yet.</strong> " + ((ans.miss && ans.miss[missing[0]]) || "There’s still an overstated word. Compare each word with what the study did.") };
      else { S.ok[p.id] = true; msgs[p.id] = null; }
      api.save(); paintS1(); MV.focusFb(s1); return;
    }
    if (b.dataset.nav) {
      S.i = clamp(S.i + (+b.dataset.nav), 0, P.length - 1); api.save(); paintS1();
      var f = s1.querySelector("[data-w]:not([disabled])") || s1.querySelector('[data-k="p3next"]:not([disabled])') || s1.querySelector('[data-k="p3prev"]'); if (f) f.focus({ preventScroll:true });
    }
  });
  s1.addEventListener("input", function(e){
    var t = e.target; if (!t.dataset || !t.dataset.fix) return;
    var id = t.dataset.fix; S.fix[id] = t.value; clearTimeout(timers[id]);
    timers[id] = setTimeout(function(){ api.save(); var s = document.getElementById("cn-fix-" + id + "-saved"); if (s) s.textContent = "Saved"; }, 400);
  });

  // ----- Station 2: a real example (teacher slot; unscored) -----
  var S2 = D.station2;
  s2.innerHTML = "<p>" + S2.intro + "</p>" +
    '<div class="cn-s2f"><label class="cn-fl" for="cn-s2hl">Headline (exactly as published)</label><input type="text" class="txtin" id="cn-s2hl" data-s2="hl" autocomplete="off">' +
    '<label class="cn-fl" for="cn-s2cr">Credit: outlet and date</label><input type="text" class="txtin" id="cn-s2cr" data-s2="credit" autocomplete="off">' +
    '<label class="cn-fl" for="cn-s2st">What the study actually did</label><textarea id="cn-s2st" data-s2="study"></textarea></div>' +
    '<p class="cn-fl">Tap the words that overstate the study</p><p class="cn-hlw cn-s2w" id="cn-s2w" role="group" aria-label="Headline words"></p>' +
    '<label class="cn-fl" for="cn-s2fx">Your fixed headline</label><textarea id="cn-s2fx" data-s2="fix"></textarea><div class="saved" id="cn-s2-saved" aria-live="polite"></div>' +
    '<p class="tiny muted">' + S2.note + "</p>";
  $$("[data-s2]", s2).forEach(function(el){ el.value = S.s2[el.dataset.s2] || ""; });
  function paintS2w(){
    var w = words(S.s2.hl), host2 = $("#cn-s2w", s2);
    MV.keepFocus(host2, function(){
      host2.innerHTML = w.length ? w.map(function(x, i){ var on = S.s2sel.indexOf(i) >= 0; return '<button type="button" class="cn-w' + (on ? " on" : "") + '" data-w2="' + i + '" data-k="w2' + i + '" aria-pressed="' + on + '">' + esc(x) + "</button>"; }).join("") : '<span class="tiny muted">Type the headline above to make word chips.</span>';
    });
  }
  s2.addEventListener("input", function(e){
    var k = e.target.dataset && e.target.dataset.s2; if (!k) return;
    S.s2[k] = e.target.value;
    if (k === "hl") { S.s2sel = []; paintS2w(); }
    clearTimeout(timers.s2); timers.s2 = setTimeout(function(){ api.save(); $("#cn-s2-saved", s2).textContent = "Saved"; }, 400);
  });
  s2.addEventListener("click", function(e){
    var b = e.target.closest("[data-w2]"); if (!b) return;
    var i = +b.dataset.w2, k = S.s2sel.indexOf(i); if (k >= 0) S.s2sel.splice(k, 1); else S.s2sel.push(i);
    S.s2sel.sort(function(a, c){ return a - c; }); api.save(); paintS2w();
  });

  // ----- Station 3: nutrition during treatment -----
  var S3 = D.station3;
  s3.innerHTML = '<div class="hfa-support" role="note"><p>' + S3.skip + "</p></div>" +
    '<h4 class="cn-h4 cn-s3h">How treatment can affect eating</h4><p class="how">Open each effect to see what can help.</p><div class="cn-fx">' +
    S3.effects.map(function(x){ return '<details class="cn-fxd"><summary>' + x.t + "</summary><p>" + x.help + "</p></details>"; }).join("") + "</div>" +
    '<h4 class="cn-h4 cn-s3h">Why needs can rise</h4><div class="cn-needs">' + S3.needs + "</div>" +
    '<div class="cn-cq" id="cn-cq"></div>';
  function paintS3q(){
    var q = S3.q, host3 = $("#cn-cq", s3), ri = MV.right(q.choices), last = S.s3;
    var h = '<p class="cn-cqp"><strong>' + q.prompt + '</strong></p><div class="chips" role="group" aria-label="Choices">' + q.choices.map(function(c, i){
      return '<button type="button" class="chip' + (last === i ? " on" : "") + '" aria-pressed="' + (last === i) + '" data-q3="' + i + '" data-k="q3' + i + '"' + (last === ri ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    if (last != null && q.choices[last]) h += MV.fbHTML(last === ri ? "good" : "bad", (last === ri ? "<strong>✓</strong> " : "<strong>✗</strong> ") + q.choices[last].fb);
    MV.keepFocus(host3, function(){ host3.innerHTML = h; });
  }
  s3.addEventListener("click", function(e){ var b = e.target.closest("[data-q3]"); if (!b || b.disabled) return; S.s3 = +b.dataset.q3; api.save(); paintS3q(); MV.focusFb($("#cn-cq", s3)); });

  paintS1(); paintS2w(); paintS3q(); show();
}
function s2Lines(){
  var s = (MV.S.app && MV.S.app.part3) || {}, x = s.s2 || {}, hl = (x.hl || "").trim();
  var head = "Headline vs study, station 2 (real example, for your teacher): ";
  if (!hl) return [head + "not done"];
  var w = words(hl), picked = arr(s.s2sel).map(function(i){ return w[i]; }).filter(Boolean);
  return [head.replace(/: $/, ":"), "  Headline: “" + hl + "”" + ((x.credit || "").trim() ? " (" + x.credit.trim() + ")" : ""),
    "  What the study did: " + ((x.study || "").trim() || "not written"),
    "  Overstated words: " + (picked.length ? picked.join(", ") : "none tapped"),
    "  Fixed headline: " + ((x.fix || "").trim() || "not written")];
}

// ---------- Practice 2: Risk arithmetic and study critique (custom: number entry, one-tap choice, two numbers, choose two) ----------
function numIn(raw){
  var s = String(raw == null ? "" : raw).replace(/−/g, "-").replace(/,/g, "").trim();
  var m = s.match(/^\+?\s*(-?\d+(?:\.\d+)?)\s*(%|in\s*100|per\s*100|out\s+of\s+100)?\s*$/i);
  return m ? parseFloat(m[1]) : null;
}
function riskAct(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { v:{}, pick:[], tries:0, hint:0, solved:false, first:null }); x.v = x.v || {}; x.pick = arr(x.pick); return x; }
  function optT(it, id){ var o = byId(it.options, id); return o ? o.t : id; }
  function solvedLine(it, x){
    var A = MV.ans(it);
    if (it.kind === "num") return "<strong>✓ Correct: " + A + " " + it.unit + ".</strong> " + it.why;
    if (it.kind === "num2") return "<strong>✓ Correct: " + sgn(A.rel, 0) + "% relative; " + sgn(A.abs, 0) + " in 100 absolute.</strong> " + it.why;
    if (it.kind === "pick1") { var o = byId(it.options, x.last); return "<strong>✓ Correct: " + (o ? o.t : "") + ".</strong> " + (o ? o.why : ""); }
    return "<strong>✓ Correct.</strong> " + x.pick.map(function(id){ var o = byId(it.options, id); return o.t + ": " + o.why; }).join(" ") + " " + (it.general || "");
  }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" +
      (it.star ? '<span class="tags"><span class="tag">★</span>' + (it.inquiry ? '<span class="tag">Inquiry</span>' : "") + "</span>" : "") + "</div>";
    var dis = x.solved ? " disabled" : "";
    if (it.kind === "num") {
      h += '<div class="numrow"><label for="ri-' + it.id + '">' + it.label + '</label><input class="numin short" id="ri-' + it.id + '" data-rin="' + it.id + '|main" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.v.main || "") + '"' + dis + '><span class="cn-unit">' + it.unit + "</span></div>";
    } else if (it.kind === "num2") {
      h += it.fields.map(function(f){ return '<div class="numrow"><label for="ri-' + it.id + f.id + '">' + f.label + '</label><input class="numin short" id="ri-' + it.id + f.id + '" data-rin="' + it.id + "|" + f.id + '" type="text" inputmode="text" autocomplete="off" value="' + esc(x.v[f.id] || "") + '"' + dis + '><span class="cn-unit">' + f.unit + "</span></div>"; }).join("") +
        '<p class="tiny muted">Use + for an increase, for example +3.</p>';
    } else if (it.kind === "pick1") {
      h += '<p class="how">Tap one confounder.</p><div class="chips cn-pick" role="group" aria-label="Possible confounders">' + it.options.map(function(o){
        var on = x.last === o.id; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-rp="' + it.id + "|" + o.id + '" data-k="rp' + it.id + o.id + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    } else {
      h += '<p class="how">Choose two, then press Check.</p><div class="chips cn-pick" role="group" aria-label="Problems (choose two)">' + it.options.map(function(o){
        var on = x.pick.indexOf(o.id) >= 0; return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-rt="' + it.id + "|" + o.id + '" data-k="rt' + it.id + o.id + '"' + dis + ">" + (on ? "☑ " : "☐ ") + o.t + "</button>"; }).join("") + "</div>";
    }
    if (!x.solved) h += '<div class="q-actions">' + (it.kind === "pick1" ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", solvedLine(it, x) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].kind || "bad", msgs[it.id].html);
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(itemHTML).join(""); }); }
  function solve(it, x){ x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
  function miss(it, x, html){ x.tries++; msgs[it.id] = { html:"<strong>✗ Not quite.</strong> " + html }; }
  function named(list, v){ var w = arr(list).filter(function(w){ return Math.abs(w.match - v) < 1e-9; })[0]; return w ? w.fb : null; }
  function check(it){
    var x = ist(it.id), A = MV.ans(it);
    if (it.kind === "num") {
      var v = numIn(x.v.main);
      if (v == null) { msgs[it.id] = { kind:"", html:"Enter a number, such as 12." }; return; }
      if (Math.abs(v - A) < 1e-9) solve(it, x); else miss(it, x, named(it.wrong, v) || it.general);
    } else if (it.kind === "num2") {
      var rel = numIn(x.v.rel), ab = numIn(x.v.abs);
      if (rel == null || ab == null) { msgs[it.id] = { kind:"", html:"Enter both numbers, such as +10 and +1." }; return; }
      if (Math.abs(rel - A.rel) < 1e-9 && Math.abs(ab - A.abs) < 1e-9) solve(it, x);
      else miss(it, x, (Math.abs(rel - A.rel) > 1e-9 && named(it.wrongRel, rel)) || it.general);
    } else if (it.kind === "pick2") {
      if (x.pick.length !== 2) { msgs[it.id] = { kind:"", html:"Choose exactly two problems, then press Check." }; return; }
      var bad = x.pick.filter(function(id){ return A.indexOf(id) < 0; });
      if (!bad.length) solve(it, x);
      else miss(it, x, bad.map(function(id){ var o = byId(it.options, id); return "“" + o.t + "”: " + o.why; }).join(" ") + " Try another choice.");
    }
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.rin; if (!k) return; var q = k.split("|"); ist(q[0]).v[q[1]] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ var k = e.key === "Enter" && e.target.dataset && e.target.dataset.rin; if (!k) return; var b = host.querySelector('[data-k="' + k.split("|")[0] + 'chk"]'); if (b) { e.preventDefault(); b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ri]"); if (!box) return;
    var it = byId(a.items, box.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.rp) {
      var id = b.dataset.rp.split("|")[1], A = MV.ans(it), o = byId(it.options, id); x.last = id;
      if (A.indexOf(id) >= 0) solve(it, x); else miss(it, x, o.why + " " + it.wrongLead);
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]')); return;
    }
    if (b.dataset.rt) {
      var t = b.dataset.rt.split("|")[1], k = x.pick.indexOf(t);
      if (k >= 0) x.pick.splice(k, 1); else if (x.pick.length < 2) x.pick.push(t); else { msgs[it.id] = { kind:"", html:"You’ve chosen two. Untap one to change your choice." }; paint(); return; }
      msgs[it.id] = null; api.save(); paint(); return;
    }
    if (b.dataset.act === "check") { check(it); api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]')); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Fix the headline (@component headlineBuilder — three chip slots, live preview with smoothed
// grammar, the plan's four exact checks) ----------
var task = (function(){
  var api = null, rg = {};
  function T(){ return MV.C.task; }
  function slot(id){ return byId(T().slots, id); }
  function st(){ var s = api.S; T().slots.forEach(function(sl){ if (!byId(sl.options, s[sl.id])) s[sl.id] = ""; }); return s; }
  function read(){ var s = api ? st() : {}; return { v:s.v || "", n:s.n || "", s:s.s || "" }; }
  function checks(d){
    return [d.v === "linked" || d.v === "may", d.n === "abs" || d.n === "rel", d.s === "obs" || d.s === "obstri",
      d.v !== "prevents" && d.v !== "cures" && d.n !== "miracle" && d.s !== "proven"];
  }
  function valid(d){ return d.v && d.n && d.s ? true : "Choose a chip in every slot first."; }
  function chipT(sid, id){ var o = byId(slot(sid).options, id); return o ? MV.plain(o.t) : ""; }
  // the preview smooths the grammar for display (plan)
  function headline(d){
    var V = { linked:"is linked to lower cancer risk", may:"may be linked to lower cancer risk", prevents:"prevents cancer", cures:"cures cancer" }[d.v] || "[verb] cancer risk";
    var N = { abs:"(about 3 in 100 people instead of 4)", rel:"(a 25% lower relative risk: about 3 in 100 instead of 4)", r75:"(a 75% lower risk)", miracle:"(a miracle drop)" }[d.n] || "[number]";
    var St = { obs:"in one observational study", obstri:"in one observational study; trials are needed", proven:"— proven by science", lab:"in a lab dish" }[d.s] || "[study]";
    return "Daily Sunleaf tea " + V + " " + N + " " + St + ".";
  }
  function raw(d){
    return esc(T().template).replace("[verb]", d.v ? "<b>" + esc(chipT("v", d.v)) + "</b>" : "<i>[verb]</i>").replace("[number]", d.n ? "<b>" + esc(chipT("n", d.n)) + "</b>" : "<i>[number]</i>").replace("[study]", d.s ? "<b>" + esc(chipT("s", d.s)) + "</b>" : "<i>[study]</i>");
  }
  function keyOf(d){ return d.v + "|" + d.n + "|" + d.s; }
  function fromKey(k){ var p = String(k).split("|"); return { v:p[0], n:p[1], s:p[2] }; }
  function paint(){
    if (!$("#tk-news")) return;
    var d = read(), full = d.v && d.n && d.s;
    $("#tk-news").textContent = full ? headline(d) : "Choose a chip in each slot to build the headline.";
    $("#tk-news").classList.toggle("muted", !full);
    $("#tk-raw").innerHTML = "Your chips: " + raw(d);
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="cn-tin">' + T().slots.map(function(sl){ return '<div id="tk-' + sl.id + '" class="cn-tslot"></div>'; }).join("") + "</div>";
      pv.innerHTML = '<div class="cn-tpv"><h4 class="cn-h4">Preview</h4><p class="cn-newsh"><span class="hfa-model">Practice model</span> Headline</p><p class="cn-news" id="tk-news" aria-live="polite"></p><p class="tiny cn-raw" id="tk-raw"></p></div>';
      T().slots.forEach(function(sl){
        rg[sl.id] = radios($("#tk-" + sl.id), { label:sl.t, cls:"chips", options:sl.options, value:s[sl.id], onChange:function(v){ st()[sl.id] = v; a.save(); paint(); a.update(); } });
      });
      // the plan's after-two-answers prompt (the toolkit's own message comes after three)
      var btn = $("#task-check");
      if (btn) btn.addEventListener("click", function(){
        setTimeout(function(){
          var fb = $("#task-fb .fb.good"), ts = MV.taskState();
          if (fb && ts.found.length >= 2 && !$(".cn-after2", fb)) fb.insertAdjacentHTML("beforeend", '<p class="cn-after2"><strong>' + T().after2 + "</strong></p>");
        }, 0);
      });
      paint();
    },
    read:read,
    valid:valid,
    checks:function(d){ return checks(d); },
    key:keyOf,
    label:function(k){ return "“" + esc(headline(fromKey(k))) + "”"; },
    text:function(k){ return headline(fromKey(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ risk:riskAct },
  task:task,
  summaryLines:s2Lines,
  onShow:function(){ decorate(); }
});
})();
