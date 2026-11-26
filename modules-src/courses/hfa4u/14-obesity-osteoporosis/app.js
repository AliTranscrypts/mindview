// HFA4U 14 Obesity, Osteoporosis & Other Diet-Related Issues: hero (ten cause cards link into a web, then a bone-mass curve),
// Many causes, many paths (Explore: F7 causes map with tap-to-place cards, a "Show links" web; BMI vs full picture persona
// panels; bone-bank model curve on the plot engine), Build bones (Part 3: F1 food-chip planner with adequacy bars and "Check it
// with data", fracture facts, weight-bias language audit), Bone and body data (custom practice) and "Build Rowan's bones"
// (task: F1/F2 chip counters, live panel, kitchen card). Plan wording lives in content.mjs; this file adds control labels only.
// Care note (course plan §2): personas only, words only; no weights, BMI numbers or calorie targets; nothing asks about the
// student's own body, weight or diet, and nothing the student does here leaves the device.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc, css = MV.css;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function svgT(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
// number typed by a student: units and spaces are ignored; null if not a single number
function gnum(s){ var t = String(s == null ? "" : s).replace(/mg|iu|years?|yrs?|age|%|\s/gi, ""); if (!t) return null; var r = MV.parseNum(t); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }

// ---------- @component radioGroup (copied from HFA4U 12 / 09; per-option class, function labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "ob-chipset" : o.cls && o.cls !== "seg" ? "ob-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="ob-rgw">' + (lab ? '<span class="ob-rgl">' + lab + "</span>" : "") + '<span class="ob-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- @component switchBtn (copied from HFA4U 12 / 09) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="ob-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="ob-swt" aria-hidden="true"><i></i></span><span class="ob-swl">' + label + '</span><span class="ob-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- @component F1 adequacyBars (adapted from HFA4U 03): amount against a reference line at the middle of a 0–200% track.
//   rows: [{t, v, ref, unit, note}] -> HTML. Micronutrient violet (course plan §4); the words carry the meaning, not the colour.
function adeqBars(rows, key){
  return '<div class="ob-abars">' + rows.map(function(r){
    var pct = r.ref ? r.v / r.ref * 100 : 0, low = pct < 100 - 1e-9;
    return '<div class="ob-abar' + (low ? " low" : "") + '"><span class="ob-alab">' + r.t + '</span><span class="ob-atrack" aria-hidden="true"><span class="ob-afill" style="width:' + f1(clamp(pct / 200, 0, 1) * 100) + '%"></span><span class="ob-aref"></span></span>' +
      '<span class="ob-aval"><strong>' + r.v + " " + r.unit + "</strong> · " + Math.round(pct) + "%" + (low ? " · below" : " · reaches it") + "</span></div>";
  }).join("") + '<p class="tiny muted ob-akey">' + key + "</p></div>";
}

// ---------- bone-bank model (plan "Model rules (exact)") ----------
function BONE(){ return MV.C.explore.bone; }
function lvl(hid, id){ var h = byId(BONE().habits, hid); return byId(h.levels, id) || h.levels[0]; }
function normBone(b){
  var B = BONE(), o = {}; b = b || {};
  B.habits.forEach(function(h){ o[h.id] = byId(h.levels, b[h.id]) ? b[h.id] : B.base[h.id]; });
  o.meno = b.meno === "on" ? "on" : "off";
  return o;
}
function peakOf(b){ var p = 100; BONE().habits.forEach(function(h){ p += lvl(h.id, b[h.id]).pts; }); return p; }
function boneIdx(a, P, meno){
  if (a <= 30) { var s = clamp(a / 30, 0, 1), sm = s * s * (3 - 2 * s); return P * (0.12 + 0.88 * sm); }   // rise drawn smoothly; only its peak is a rule
  if (a <= 40) return P;
  var v = P - 0.5 * (a - 40);
  if (meno && a > 50) v -= Math.min(a, 60) - 50;
  return v;
}
// first adult age (30+) with the index at 70 or below (exact, piecewise linear after 40)
function zoneEntry(P, meno){
  var Z = BONE().zone;
  if (P <= Z) return 30;
  var a = 40 + 2 * (P - Z);
  if (!meno || a <= 50) return a;
  var v50 = P - 5; a = 50 + (v50 - Z) / 1.5; if (a <= 60) return a;
  return 60 + 2 * (v50 - 15 - Z);
}
function entryText(a, cap){
  if (a >= 100 - 1e-9) return cap ? "Not before 100" : "not before 100";
  var r = Math.round(a);
  return (Math.abs(a - r) < 1e-6 ? "at age " + r : "at about age " + r);
}
var BSHORT = { ca:"calcium", vd:"vitamin D", act:"activity" };
function breakdown(b){
  var parts = BONE().habits.map(function(h){ var l = lvl(h.id, b[h.id]); if (!l.pts) return null; return (l.pts > 0 ? "+ " : MV.MINUS + " ") + Math.abs(l.pts) + " (" + (h.id === "smk" ? "smoking" : l.t + " " + BSHORT[h.id]) + ")"; }).filter(Boolean);
  return parts;
}

// ---------- support note at the top of Explore and the Final Check (Start and Reflect carry it as content blocks) ----------
function decorate(){
  ["explore", "final-check"].forEach(function(v){
    var sec = $('.view[data-view="' + v + '"]'), intro = sec && $(".intro", sec);
    if (intro && !$(".ob-sup", sec)) intro.insertAdjacentHTML("afterend", '<div class="ob-sup">' + MV.C.support + "</div>");
  });
}

// ---------- hero: ten cause cards drift in and link into a web; the web moves left and a bone-mass curve draws ----------
// word slots on the ring (plan order → ring position, chosen so the long words sit at the sides)
var HSLOT = [0, 9, 4, 2, 3, 7, 8, 6, 5, 1];
var HLINKS = [[4, 2], [4, 5], [4, 7], [1, 2], [1, 9], [8, 2], [6, 5], [7, 5], [0, 9], [3, 2], [6, 8]];
function heroPos(i, k){
  var s = HSLOT[i], t = -Math.PI / 2 + Math.PI * 0.2 * (s + 0.5);
  var full = [180 + 128 * Math.cos(t), 124 + 90 * Math.sin(t)], fin = [i % 2 ? 128 : 50, 54 + i * 18];
  return [lerp(full[0], fin[0], k), lerp(full[1], fin[1], k)];
}
function heroFrame(t, rm){
  var H = MV.C.hero, W = H.words, h = "", mv = rm ? 1 : MV.ease(seg01(t, 0.5, 0.64)), fs = lerp(13, 10.5, mv), lt = rm ? 1 : seg01(t, 0.3, 0.46);
  var vis = W.map(function(_, i){ return rm ? 1 : seg01(t, 0.03 + i * 0.026, 0.1 + i * 0.026); });
  var P = W.map(function(_, i){ var p = heroPos(i, mv), d = (1 - MV.ease(vis[i])) * 26, a = i * 2.1; return [p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d]; });
  HLINKS.forEach(function(l){
    if (!lt) return; var a = P[l[0]], b = P[l[1]];
    h += '<line class="ob-hl" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(lerp(a[0], b[0], lt)) + '" y2="' + f1(lerp(a[1], b[1], lt)) + '"/>';
  });
  W.forEach(function(w, i){
    if (!vis[i]) return;
    var p = P[i], wd = w.length * fs * 0.56 + fs * 1.1, ht = fs * 1.6;
    h += '<g opacity="' + f1(vis[i]) + '"><rect class="ob-hw" x="' + f1(p[0] - wd / 2) + '" y="' + f1(p[1] - ht / 2) + '" width="' + f1(wd) + '" height="' + f1(ht) + '" rx="' + f1(ht / 2) + '"/>' +
      '<text class="ob-hwt" x="' + f1(p[0]) + '" y="' + f1(p[1] + fs * 0.36) + '" text-anchor="middle" style="font-size:' + f1(fs) + 'px">' + w + "</text></g>";
  });
  // bone-mass curve on the right
  var ax = rm ? 1 : seg01(t, 0.6, 0.66), cv = rm ? 1 : seg01(t, 0.64, 0.92);
  if (ax > 0) {
    var X = function(a){ return 196 + a * 1.56; }, Y = function(v){ return 218 - v * 1.2; };
    h += '<g opacity="' + f1(ax) + '"><path class="ob-hax" d="M196 84V218H352"/>' + svgT(352, 234, "age", "ob-hs", "end") + svgT(X(30), 234, "30", "ob-hs") + svgT(200, 78, "bone mass", "ob-hs", "start") + "</g>";
    if (cv > 0) {
      var pts = [], last = 100 * cv;
      for (var a = 0; a <= last + 1e-9; a += 2) pts.push(f1(X(a)) + " " + f1(Y(boneIdx(a, 100, false))));
      pts.push(f1(X(last)) + " " + f1(Y(boneIdx(last, 100, false))));
      h += '<path class="ob-hcurve" d="M' + pts.join("L") + '"/>';
      if (last >= 30) h += '<circle class="ob-hpk" cx="' + f1(X(30)) + '" cy="' + f1(Y(100)) + '" r="5"/>' + svgT(X(30) + 6, Y(100) + 18, "peak", "ob-hs b", "start");
    }
  }
  if (mv >= 1 && (rm || t >= 0.64)) h += svgT(90, 22, H.caps.web, "ob-hcap") + svgT(274, 22, H.caps.bone, "ob-hcap");
  return h;
}
function hero(f){
  decorate();
  var host = $("#ob-hero"); if (!host) return;
  var H = MV.C.hero, rm = MV.reduceMotion;
  host.innerHTML = '<svg class="ob-hsvg" viewBox="0 0 360 244" role="img" aria-label="' + esc(rm ? H.rmAria : H.aria) + '"></svg>' +
    (rm ? "" : '<div class="ob-hrow"><button type="button" class="btn ghost sm" id="ob-replay" disabled>Replay</button></div>');
  var svg = $("svg", host), cap = function(s){ if (f.cap && f.cap.textContent !== s) f.cap.textContent = s; };
  if (rm) { svg.innerHTML = heroFrame(1, true); cap(H.caps.web + " · " + H.caps.bone); return; }
  var btn = $("#ob-replay", host), stop = null;
  function play(){
    if (stop) stop(); btn.disabled = true;
    stop = MV.tween({ dur:9500, ease:function(t){ return t; }, step:function(t){ svg.innerHTML = heroFrame(t, false); cap(t < 0.56 ? H.caps.web : H.caps.bone); },
      done:function(){ stop = null; btn.disabled = false; } });
  }
  btn.addEventListener("click", play);
  svg.innerHTML = heroFrame(0, false); cap(H.caps.web);
  MV.wait(500, play);
}

// ---------- Explore: Many causes, many paths (@component F7 causesMap — tap-to-place cause cards in five domains with a
// "Show links" web; @component personaPanel — BMI category word vs a full health panel; @component boneBank — bone-mass
// model curve with youth-habit segmented controls, peak and zone-entry markers) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = D.challenges, CARDS = D.cards, DOMS = D.domains, PERS = D.personas, MEAS = D.measures;
  S.mode = byId(D.modes, S.mode) ? S.mode : "causes";
  S.place = S.place || {};
  Object.keys(S.place).forEach(function(k){ if (!byId(CARDS, k) || !byId(DOMS, S.place[k])) delete S.place[k]; });
  S.links = !!S.links;
  S.filter = ["all", "in", "higher"].indexOf(S.filter) >= 0 ? S.filter : "all";
  S.per = S.per === "" ? "" : byId(PERS, S.per) ? S.per : "jordan";
  S.bone = normBone(S.bone);
  var fx = { demo:null, lineT:1, mask:null, peak:null, ghost:null, xTo:null }, sel = null, busy = false, anim = null, pend = null;

  host.innerHTML = '<div id="ob-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ob-lab" data-mv="graph">' +
      '<fieldset class="ob-fs" id="ob-pa"></fieldset>' +
      '<fieldset class="ob-fs" id="ob-pb" hidden><legend class="vh">BMI vs full picture</legend><div id="ob-filt"></div><div id="ob-perw"></div><div id="ob-pcard" aria-live="polite"></div></fieldset>' +
      '<div id="ob-pc" hidden><div class="ob-bone"><div class="ob-plotcol"><div class="plot-wrap"><canvas class="plot wide" id="ob-plot" role="img" aria-label="Bone-mass index across a lifetime"></canvas></div><ul class="ob-leg" id="ob-leg"></ul></div>' +
        '<fieldset class="ob-fs ob-bctl" id="ob-bctl"><legend class="ob-h4">Youth habits</legend><div id="ob-habits"></div><div class="ob-meno" id="ob-meno"></div>' +
        '<p class="tiny ob-prule" id="ob-prule"></p><div class="q-actions"><button type="button" class="btn ghost sm" id="ob-breset" data-k="obbreset">Back to baseline</button></div></fieldset></div>' +
        '<details class="alg ob-about"><summary>About this model</summary><div style="margin-top:10px"><p><span class="hfa-model">Model data</span> ' + D.bone.note + '</p><ul class="ob-rules">' + D.bone.rules.map(function(r){ return "<li>" + r + "</li>"; }).join("") + "</ul></div></details></div>" +
      '<div class="ob-readw"><h4 class="ob-h4">Readout</h4><dl class="read ob-read" id="ob-read" aria-live="polite"></dl></div>' +
    "</div>";

  var modeRG = radios($("#ob-mode"), { label:"Mode", aria:"Explore mode", options:D.modes, value:S.mode, onChange:function(v){
    if (busy) { modeRG.set(S.mode); return; }
    endDemo(); fx.ghost = null; sel = null; S.mode = v; MV.banner("", ""); commit();
  } });

  // =============================== Mode A: causes map ===============================
  var pa = $("#ob-pa");
  function placeOf(id){ return fx.demo ? fx.demo[id] : S.place[id]; }
  function cardNo(c){ return CARDS.indexOf(c) + 1; }
  function linksShown(){ return D.links.filter(function(l){ return placeOf(l.a) && placeOf(l.b); }); }
  function lensOn(){ return fx.demo ? true : S.links; }
  function cardBtn(c){
    var on = sel === c.id;
    return '<button type="button" class="ob-card ' + (c.fixed ? "fixed" : "mod") + '" data-card="' + c.id + '" data-k="cd' + c.id + '" aria-pressed="' + on + '"' + (busy ? " disabled" : "") + '>' +
      '<span class="ob-cn">' + cardNo(c) + '</span><span class="ob-ct">' + c.t + '</span><span class="ob-ck">' + (c.fixed ? "non-modifiable" : "modifiable") + "</span></button>";
  }
  function selBar(){
    var c = byId(CARDS, sel), p = placeOf(sel);
    return '<div class="ob-selbar" role="group" aria-label="' + esc("Selected card: " + MV.plain(c.t)) + '"><p class="ob-selt">Selected: <strong>' + cardNo(c) + ". " + c.t + "</strong></p>" +
      '<div class="ob-selrow"><span class="ob-sell">Move to:</span>' + DOMS.map(function(d){ var on = p === d.id; return '<button type="button" class="btn sm ' + (on ? "primary" : "ghost") + '" data-move="' + d.id + '" data-k="mv' + d.id + '" aria-pressed="' + on + '">' + d.t + "</button>"; }).join("") +
      (p ? '<button type="button" class="btn ghost sm" data-move="" data-k="mvtray">Back to the tray</button>' : "") +
      '<button type="button" class="btn ghost sm" data-act="seldone" data-k="seldone">Done</button></div></div>';
  }
  // ring of ten nodes in a 420 × 276 box; the top and bottom nodes sit a little further out so their labels clear their neighbours
  var NODE = CARDS.map(function(_, i){ var t = -Math.PI / 2 + i * 2 * Math.PI / CARDS.length; return [210 + 140 * Math.cos(t), 140 + 108 * Math.sin(t) + (i === 0 ? -6 : i === 5 ? 6 : 0)]; });
  function webSVG(){
    var L = linksShown(), h = "", idx = {}; CARDS.forEach(function(c, i){ idx[c.id] = i; });
    L.forEach(function(l){
      var a = NODE[idx[l.a]], b = NODE[idx[l.b]], t = fx.lineT;
      h += '<line class="ob-link" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(lerp(a[0], b[0], t)) + '" y2="' + f1(lerp(a[1], b[1], t)) + '"/>';
    });
    CARDS.forEach(function(c, i){
      var p = NODE[i], on = !!placeOf(c.id), lab = (i + 1) + " " + c.short, w = lab.length * 7 + 18;
      h += '<g class="ob-node ' + (on ? (c.fixed ? "fixed" : "mod") : "off") + '"><rect x="' + f1(p[0] - w / 2) + '" y="' + f1(p[1] - 12) + '" width="' + f1(w) + '" height="24" rx="12"/>' + svgT(p[0], p[1] + 4.5, lab, "ob-nt") + "</g>";
    });
    return '<svg class="ob-websvg" viewBox="0 0 420 276" role="img" aria-label="' + esc("Links between causes: " + L.length + " links among " + CARDS.filter(function(c){ return placeOf(c.id); }).length + " placed cards. The list below names each link.") + '">' + h + "</svg>";
  }
  function paintA(){
    var un = CARDS.filter(function(c){ return !placeOf(c.id); }), L = linksShown();
    var h = (fx.demo && !busy ? '<div class="ob-demo" role="status"><p>Showing the reveal: every card in a domain, with its links. Your own map is saved underneath.</p><button type="button" class="btn sm primary" data-act="mymap" data-k="mymap">Back to my map</button></div>' : "") +
      '<p class="how">Tap a card, then choose its domain. Tap a placed card to move it.</p>' +
      '<div class="ob-tray" role="group" aria-label="Cards to place">' + (un.length ? un.map(cardBtn).join("") : '<p class="tiny muted">All 10 cards are placed.</p>') + "</div>" +
      (sel ? selBar() : "") +
      '<div class="ob-doms">' + DOMS.map(function(d){
        var ins = CARDS.filter(function(c){ return placeOf(c.id) === d.id; });
        return '<section class="ob-dom" aria-label="' + esc(d.t) + '"><h5>' + d.t + ' <span class="ob-dn">(' + ins.length + ")</span></h5>" + (ins.length ? ins.map(cardBtn).join("") : '<p class="tiny muted">No cards yet.</p>') + "</section>";
      }).join("") + "</div>" +
      '<p class="tiny muted ob-kkey">' + D.kindKey + "</p>" +
      '<div class="ob-lens">' + switchHTML("oblens", "<strong>Show links</strong>", lensOn(), 'data-act="lens"' + (busy ? " disabled" : "")) +
        '<button type="button" class="btn ghost sm" data-act="clear" data-k="obclear"' + (busy ? " disabled" : "") + ">Clear the map</button></div>";
    if (lensOn()) h += '<div class="ob-web">' + webSVG() + '<details class="ob-ldet"><summary>Read the links (' + L.length + ")</summary>" +
      (L.length ? '<ul class="ob-links">' + L.map(function(l){ return "<li><strong>" + byId(CARDS, l.a).t + "</strong> ↔ <strong>" + byId(CARDS, l.b).t + "</strong>: " + l.t + "</li>"; }).join("") + "</ul>" : '<p class="tiny muted">Place cards to see their links.</p>') + "</details></div>";
    MV.keepFocus(pa, function(){ pa.innerHTML = '<legend class="vh">Causes map</legend>' + h; });
  }
  function endDemo(){ if (fx.demo) { fx.demo = null; fx.lineT = 1; } }
  pa.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.act === "mymap") { endDemo(); sel = null; commit(); var t = $(".ob-tray button, .ob-dom button", pa); if (t) t.focus({ preventScroll:true }); return; }
    if (b.dataset.card) {
      if (fx.demo) { endDemo(); }
      sel = sel === b.dataset.card ? null : b.dataset.card; paintA();
      var m = pa.querySelector('[data-k="mv' + (placeOf(sel) || DOMS[0].id) + '"]'); if (m) m.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.move != null && sel) {
      endDemo();
      if (b.dataset.move) S.place[sel] = b.dataset.move; else delete S.place[sel];
      var k = sel; sel = null; commit();
      var nb = pa.querySelector('[data-k="cd' + k + '"]'); if (nb) nb.focus({ preventScroll:true });
      return;
    }
    if (b.dataset.act === "seldone") { var k2 = sel; sel = null; paintA(); var c2 = pa.querySelector('[data-k="cd' + k2 + '"]'); if (c2) c2.focus({ preventScroll:true }); return; }
    if (b.dataset.act === "lens") { if (fx.demo) { endDemo(); S.links = true; } else S.links = !S.links; commit(); return; }
    if (b.dataset.act === "clear") { endDemo(); S.place = {}; sel = null; commit(); return; }
  });

  // =============================== Mode B: BMI vs full picture ===============================
  var FILT = [{ id:"all", t:"All" }, { id:"in", t:"“in range”" }, { id:"higher", t:"“higher”" }];
  var filtRG = radios($("#ob-filt"), { label:"BMI category", aria:"Filter personas by BMI category", options:FILT, value:S.filter, onChange:function(v){
    if (busy) { filtRG.set(S.filter); return; }
    S.filter = v; var p = byId(PERS, S.per); if (p && !match(p)) S.per = ""; commit();
  } });
  function match(p){ return S.filter === "all" || (S.filter === "in" ? p.bmi === "in range" : p.bmi === "higher"); }
  var perRG = null, perKey = null;
  function buildPer(){
    var list = PERS.filter(match), key = S.filter;
    if (perRG && perKey === key) { perRG.set(S.per); return; }
    perKey = key; var w = $("#ob-perw"); w.innerHTML = "<div></div>";
    perRG = radios(w.firstChild, { label:"Persona", aria:"Choose a fictional persona", cls:"chips", value:S.per,
      options:list.map(function(p){ return { id:p.id, t:'<span class="ob-ini" aria-hidden="true">' + p.name.charAt(0) + '</span><span class="ob-pct"><span><strong>' + p.name + "</strong>, " + p.age + ", " + p.role + '</span><span class="ob-pbw">BMI category: “' + p.bmi + "”</span></span>" }; }),
      onChange:function(v){ if (busy) { perRG.set(S.per); return; } S.per = v; commit(); } });
  }
  function tagOf(p, m){
    var v = p[m.id];
    if (m.id === "fit") return v === "high" ? { c:"ok", t:"healthy range", x:"high" } : { c:"lvl", t:v, x:"" };
    return v === "concern" ? { c:"cn", t:"concern", x:"" } : { c:"ok", t:"healthy range", x:"" };
  }
  function concerns(p){ return MEAS.filter(function(m){ return p[m.id] === "concern"; }); }
  function paintB(){
    filtRG.set(S.filter); buildPer();
    var p = byId(PERS, S.per), box = $("#ob-pcard");
    if (!p) { box.innerHTML = '<p class="tiny muted ob-pnone">Choose a persona to see the two views side by side.</p>'; return; }
    var rows = MEAS.map(function(m, i){
      var hide = fx.mask != null && i >= fx.mask, tg = tagOf(p, m), lit = fx.mask != null && i === fx.mask - 1;
      return '<li class="' + (lit ? "ob-lit" : "") + '"><span class="ob-mt">' + m.t + "</span>" + (hide ? '<span class="ob-tag q">?<span class="vh"> (hidden until the reveal)</span></span>' :
        '<span class="ob-tag ' + tg.c + '">' + (tg.c === "cn" ? '<span aria-hidden="true">! </span>' : tg.c === "ok" ? '<span aria-hidden="true">● </span>' : "") + tg.t + (tg.x ? " (" + tg.x + ")" : "") + "</span>") + "</li>";
    }).join("");
    box.innerHTML = '<div class="ob-pcard"><div class="ob-phead"><span class="ob-ini big" aria-hidden="true">' + p.name.charAt(0) + '</span><div><p class="ob-pn">' + p.name + ", " + p.age + '</p><p class="tiny muted">' + p.role + " · fictional persona</p></div></div>" +
      '<div class="ob-pcols"><div class="ob-pbmi"><h5>What the BMI category says</h5><p class="ob-bword">“' + p.bmi + '”</p><p class="tiny muted">' + D.bmiNote + "</p></div>" +
      '<div class="ob-ppanel"><h5>What the full health panel shows</h5><ul class="ob-meas">' + rows + "</ul></div></div></div>";
  }

  // =============================== Mode C: bone bank ===============================
  var hab = {}, menoRG = null;
  $("#ob-habits").innerHTML = D.bone.habits.map(function(h){ return '<div id="ob-h-' + h.id + '"></div>'; }).join("");
  D.bone.habits.forEach(function(h){
    hab[h.id] = radios($("#ob-h-" + h.id), { label:h.t, aria:h.t, options:h.levels.map(function(l){ return { id:l.id, t:l.t }; }), value:S.bone[h.id],
      onChange:function(v){ if (busy) { hab[h.id].set(S.bone[h.id]); return; } S.bone[h.id] = v; fx.ghost = null; commit(); } });
  });
  menoRG = radios($("#ob-meno"), { label:D.bone.meno, aria:D.bone.meno, options:[{ id:"off", t:"off" }, { id:"on", t:"on" }], value:S.bone.meno,
    onChange:function(v){ if (busy) { menoRG.set(S.bone.meno); return; } S.bone.meno = v; fx.ghost = null; commit(); } });
  $("#ob-breset").addEventListener("click", function(){ if (busy) return; S.bone = normBone(D.bone.base); fx.ghost = null; commit(); });
  var plot = new MV.Plot($("#ob-plot"), { xmin:-9, xmax:104, ymin:-13, ymax:122 });
  function curP(){ return fx.peak != null ? fx.peak : peakOf(S.bone); }
  plot.render = function(){
    if ($("#ob-pc").hidden) return;
    var pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), ui = css("--font-ui") || "sans-serif", P = curP(), meno = S.bone.meno === "on", Z = D.bone.zone;
    var xTo = fx.xTo != null ? fx.xTo : 100, curves = [], points = [], labels = [], ent = zoneEntry(P, meno), g = fx.ghost;
    if (g) curves.push({ f:function(a){ return boneIdx(a, g.P, g.meno); }, color:ink2, width:2.4, dash:[7, 6], domain:[0, xTo] });
    curves.push({ f:function(a){ return boneIdx(a, P, meno); }, color:pen, width:3.2, domain:[0, xTo] });
    points.push({ x:30, y:P, r:5.5, color:pen, label:"peak " + Math.round(P) });
    if (fx.xTo == null) {
      if (ent < 100 - 1e-9) points.push({ x:ent, y:Z, r:5.5, open:true, color:ink, label:"zone at " + Math.round(ent), below:!!g });
      if (g) {
        var ge = zoneEntry(g.P, g.meno);
        labels.push({ x:66, y:boneIdx(66, g.P, g.meno), text:"toggle off", align:"center", dy:-15, color:ink2, bg:true, font:"600 12px " + ui });
        labels.push({ x:66, y:boneIdx(66, P, meno), text:"toggle on", align:"center", dy:17, color:pen, bg:true, font:"600 12px " + ui });
        if (ge >= 100 - 1e-9) points.push({ x:100, y:Z, r:4, color:ink2 });
      }
    }
    labels.push({ x:65, y:Z / 2, text:"fracture-risk zone (70 or below)", align:"center", color:ink2, font:"600 12px " + ui });
    plot.draw({ xTicks:{ step:10 }, yTicks:{ step:20 }, xLabel:"age", yLabel:"bone-mass index",
      regions:[{ f:function(){ return Z; }, g:function(){ return 0; }, x0:30, x1:100 }],
      curves:curves, points:points, labels:labels,
      describe:"Bone-mass index from age 0 to 100 (model data). Peak " + Math.round(P) + " at age 30, held until 40, then falling" + (meno ? ", faster from 50 to 60 with the menopause toggle on" : "") + ". The curve enters the fracture-risk zone (70 or below) " + entryText(ent) + "." + (g ? " A dashed comparison curve with the toggle off enters " + entryText(zoneEntry(g.P, g.meno)) + "." : "") });
  };
  function paintC(){
    D.bone.habits.forEach(function(h){ hab[h.id].set(S.bone[h.id]); }); menoRG.set(S.bone.meno);
    var P = curP();
    var bd = breakdown(S.bone);
    $("#ob-prule").innerHTML = "Peak index = " + (bd.length ? "100 " + bd.join(" ") + " = <strong>" + Math.round(peakOf(S.bone)) + "</strong>" : "<strong>100</strong> (baseline: no gains or losses)");
    $("#ob-leg").innerHTML = '<li><i class="ob-lk cur"></i>bone-mass index' + (fx.ghost ? " (toggle on)" : "") + "</li>" + (fx.ghost ? '<li><i class="ob-lk gh"></i>toggle off, same peak</li>' : "") +
      '<li><i class="ob-lk zn"></i>fracture-risk zone (index 70 or below)</li><li><span class="ob-lk pk"></span>peak at 30</li><li><span class="ob-lk en"></span>zone entry</li>';
    plot.render();
  }

  // =============================== readout ===============================
  function paintRead(){
    var rows = [];
    if (S.mode === "causes") {
      var placed = CARDS.filter(function(c){ return placeOf(c.id); }).length, doms = DOMS.filter(function(d){ return CARDS.some(function(c){ return placeOf(c.id) === d.id; }); }).length;
      rows = [["Cards placed", placed + " of " + CARDS.length + (fx.demo ? ' <span class="muted tiny">(reveal)</span>' : "")], ["Domains with at least one card", doms + " of " + DOMS.length],
        ["Links shown", lensOn() ? "<strong>" + linksShown().length + "</strong>" : '<span class="muted">off: turn on Show links</span>']];
    } else if (S.mode === "bmi") {
      var p = byId(PERS, S.per), cn = p ? concerns(p) : [], hid = fx.mask != null && fx.mask < MEAS.length;
      rows = [["Persona", p ? p.name : '<span class="muted">none chosen</span>'], ["BMI category says", p ? "“" + p.bmi + "”" : "—"],
        ["Full panel concerns", !p ? "—" : hid ? '<span class="muted">revealing…</span>' : cn.length + (cn.length ? " (" + listAnd(cn.map(function(m){ return m.t.toLowerCase(); })) + ")" : " (all in the healthy range)")]];
    } else {
      var P = curP(), meno = S.bone.meno === "on", e = zoneEntry(P, meno), g = fx.ghost;
      rows = [["Peak bone-mass index", '<strong class="ob-big">' + Math.round(P) + "</strong>"],
        ["Enters fracture-risk zone", fx.xTo != null ? '<span class="muted">drawing…</span>' : (g ? "toggle on: " : "") + "<strong>" + entryText(e, !g) + "</strong>" + (g ? "; toggle off: <strong>" + entryText(zoneEntry(g.P, g.meno)) + "</strong>" : "")]];
    }
    $("#ob-read").innerHTML = MV.readoutHTML(rows);
  }
  function paint(){
    modeRG.set(S.mode);
    $("#ob-pa").hidden = S.mode !== "causes"; $("#ob-pb").hidden = S.mode !== "bmi"; $("#ob-pc").hidden = S.mode !== "bone";
    if (S.mode === "causes") paintA(); else if (S.mode === "bmi") paintB(); else paintC();
    paintRead();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  function setBusy(v){ busy = v; ["#ob-pb", "#ob-bctl"].forEach(function(id){ $(id, host).disabled = v; }); $$("#ob-mode button").forEach(function(b){ b.disabled = v; }); }
  paint();

  // =============================== target challenges (plan's exact tests and named wrong states) ===============================
  function test(id, live){
    var c = byId(CH, id), m = c.msgs;
    if (id === "tc1") {
      var own = S.place, ok = CARDS.every(function(k){ return MV.ans(k).indexOf(own[k.id]) >= 0; });
      if (ok) return { ok:true };
      if (fx.demo && !live && !busy) { endDemo(); sel = null; commit(); return { ok:false, msg:m.demo }; }
      if (own.c2 === "care") return { ok:false, msg:m.c2care };
      if (own.c3 === "soc") return { ok:false, msg:m.c3soc };
      if (own.c10 === "bio") return { ok:false, msg:m.c10bio };
      var tray = CARDS.filter(function(k){ return !own[k.id]; }).length;
      if (tray) return { ok:false, msg:fill(m.tray, { n:tray }) };
      return { ok:false, msg:fill(m.general, { n:CARDS.filter(function(k){ return MV.ans(k).indexOf(own[k.id]) < 0; }).length }) };
    }
    if (id === "tc2") {
      if (S.mode !== "bmi") return { ok:false, msg:m.mode };
      if (!S.per) return { ok:false, msg:m.none };
      if (S.per === "morgan") return { ok:true };
      return { ok:false, msg:m[S.per] || m.none };
    }
    if (id === "tc3") {
      if (S.mode !== "bone") return { ok:false, msg:m.mode };
      if (S.bone.meno !== "on") return { ok:false, msg:m.meno };
      var P = peakOf(S.bone), e = zoneEntry(P, true);
      if (e >= 80 - 1e-9) { if (!live) api.banner("good", "✓ " + MV.plain(c.banner)); return { ok:true }; }
      if (S.bone.ca === "low") return { ok:false, msg:m.lowca };
      if (P === 95) return { ok:false, msg:m.p95 };
      return { ok:false, msg:fill(m.general, { p:P, age:entryText(e) }) };
    }
    return { ok:false };
  }

  // =============================== predictions ===============================
  function cancelAll(){ if (anim) { anim(); anim = null; } }
  function finish(){ anim = null; fx.peak = null; fx.xTo = null; if (fx.mask != null) fx.mask = null; setBusy(false); api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAll(); setBusy(true); sel = null; fx.ghost = null; fx.peak = null; fx.xTo = null; fx.mask = null;
        if (p.id === "p1") { S.mode = "causes"; fx.demo = {}; fx.lineT = 0; }
        else if (p.id === "p2") { endDemo(); S.mode = "bmi"; S.filter = "all"; S.per = "jordan"; fx.mask = 0; }
        else { endDemo(); S.mode = "bone"; S.bone = normBone(D.bone.base); }
        api.save(); paint();
      },
      run:function(p, done){
        pend = done;
        try {
          if (p.id === "p1") {
            reveal($(".ob-doms", pa));
            var n = 0;
            anim = MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){
              var want = t >= 1 ? CARDS.length : Math.floor(t * CARDS.length + 0.5);
              if (!fx.demo) return;
              if (want !== n) { while (n < want) { var c = CARDS[n++]; fx.demo[c.id] = MV.ans(c)[0]; } paintA(); paintRead(); }
            }, done:function(){
              reveal($(".ob-web", pa) || $(".ob-doms", pa));
              anim = MV.tween({ dur:1400, step:function(t){ fx.lineT = t; var w = $(".ob-websvg", pa); if (w) w.outerHTML = webSVG(); }, done:function(){ fx.lineT = 1; finish(); } });
            } });
            return;
          }
          if (p.id === "p2") {
            reveal($("#ob-pcard"));
            anim = MV.tween({ dur:2000, ease:function(t){ return t; }, step:function(t){ var k = t >= 1 ? MEAS.length : Math.min(MEAS.length, Math.floor(t * MEAS.length) + 1); if (k !== fx.mask) { fx.mask = k; paintB(); } }, done:function(){ fx.mask = MEAS.length; paintB(); MV.wait(400, finish); } });
            return;
          }
          if (p.id === "p3") {
            reveal($("#ob-plot"));
            var from = peakOf(S.bone); S.bone.act = "low"; var to = peakOf(S.bone); fx.peak = from; paintC(); paintRead();
            anim = MV.tween({ dur:1600, step:function(t){ fx.peak = lerp(from, to, t); paintC(); }, done:function(){ fx.peak = null; finish(); } });
            return;
          }
          if (p.id === "p4") {
            reveal($("#ob-plot"));
            fx.ghost = { P:peakOf(S.bone), meno:false }; S.bone.meno = "on"; fx.xTo = 50; paintC(); paintRead();
            anim = MV.tween({ dur:2400, ease:function(t){ return t; }, step:function(t){ fx.xTo = lerp(50, 100, t); paintC(); }, done:function(){ fx.xTo = null; finish(); } });
            return;
          }
          finish();
        } catch (e) { console.error(e); finish(); }
      }
    },
    challenge:function(id, opt){ return test(id, opt && opt.live); }
  };
}

// ---------- Part 3: Build bones (@component F1 foodChipPlanner — food chips with a running total and adequacy bars, a
// "Check it with data" panel; fracture facts; @component languageAudit — verdict chips, then a rewrite from chips) ----------
function part3(host, api){
  var D = api.content, S = api.S, A = D.st1, F = A.foods;
  S.pick = S.pick || {}; S.hide = !!S.hide; S.sort = ["table", "ca", "vd"].indexOf(S.sort) >= 0 ? S.sort : "table"; S.audit = S.audit || {};
  host.innerHTML = '<div class="ob-st" id="ob-st1"></div><div class="ob-st" id="ob-st2"></div><div class="ob-st" id="ob-st3"></div>';

  // ----- Station 1 -----
  var s1 = $("#ob-st1", host);
  s1.innerHTML = "<h3>" + A.title + "</h3><p>" + A.intro + '</p><div class="ob-s1tools"><div id="ob-s1hide"></div><div id="ob-s1sort"></div></div>' +
    '<div class="ob-foods" id="ob-foods" role="group" aria-label="Foods (tap to add or remove one serving)"></div><p class="tiny muted"><span class="hfa-model">Model data</span> ' + A.label + "</p>" +
    '<div class="ob-tot" id="ob-tot" aria-live="polite"></div>' +
    '<details class="alg"><summary>Check it with data</summary><div style="margin-top:10px">' + A.data + "</div></details>";
  function hidden(f){ return S.hide && (f.dairy || f.fish); }
  function foodBtn(f){
    var on = !!S.pick[f.id], gone = hidden(f);
    return '<button type="button" class="ob-food' + (f.veg ? " veg" : "") + '" data-food="' + f.id + '" data-k="fd' + f.id + '" aria-pressed="' + on + '"' + (gone ? " disabled" : "") + ">" +
      '<span class="ob-fmark" aria-hidden="true">' + (on ? "✓" : "+") + '</span><span class="ob-fn">' + f.t + ' <span class="ob-fs">' + f.serving + "</span></span>" +
      '<span class="ob-fv">Calcium <strong>' + f.ca + " mg</strong> · Vitamin D <strong>" + f.vd + " IU</strong></span>" + (f.note ? '<span class="ob-ftag' + (f.veg ? " veg" : "") + '">' + f.note + "</span>" : "") +
      (gone ? '<span class="vh"> (hidden: dairy or fish)</span>' : "") + "</button>";
  }
  function paint1(){
    var box = $("#ob-foods", s1), list = F.slice();
    if (S.sort === "ca") list.sort(function(a, b){ return b.ca - a.ca || F.indexOf(a) - F.indexOf(b); });
    if (S.sort === "vd") list.sort(function(a, b){ return b.vd - a.vd || F.indexOf(a) - F.indexOf(b); });
    MV.keepFocus(box, function(){ box.innerHTML = list.map(foodBtn).join(""); });
    var got = F.filter(function(f){ return S.pick[f.id] && !hidden(f); }), ca = 0, vd = 0;
    got.forEach(function(f){ ca += f.ca; vd += f.vd; });
    $("#ob-tot", s1).innerHTML = '<p class="ob-tray"><strong>Model day:</strong> ' + (got.length ? got.map(function(f){ return f.t; }).join(" + ") : "nothing yet. Tap a food to add a serving.") + "</p>" +
      adeqBars([{ t:"Calcium", v:ca, ref:A.refs.ca, unit:"mg" }, { t:"Vitamin D", v:vd, ref:A.refs.vd, unit:"IU" }],
        "The line marks the RDA for ages 14–18: calcium " + A.refs.ca + " mg, vitamin D " + A.refs.vd + " IU.");
  }
  $("#ob-s1hide", s1).innerHTML = switchHTML("obhide", A.hide, S.hide, 'data-act="hide"');
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.act === "hide") { S.hide = !S.hide; b.setAttribute("aria-checked", String(S.hide)); $(".ob-swv", b).textContent = S.hide ? "On" : "Off"; api.save(); paint1(); return; }
    if (b.dataset.food) { S.pick[b.dataset.food] = !S.pick[b.dataset.food]; api.save(); paint1(); }
  });
  radios($("#ob-s1sort", s1), { label:"Order", aria:"Order the foods", options:[{ id:"table", t:"table order" }, { id:"ca", t:"most calcium" }, { id:"vd", t:"most vitamin D" }], value:S.sort,
    onChange:function(v){ S.sort = v; api.save(); paint1(); } });
  paint1();

  // ----- Station 2 -----
  $("#ob-st2", host).innerHTML = "<h3>" + D.st2.title + "</h3>" + D.st2.html;

  // ----- Station 3 -----
  var C = D.st3, s3 = $("#ob-st3", host), msg = {};
  function ast(id){ return S.audit[id] || (S.audit[id] = { v:null, r:null, done:false }); }
  function rw(id){ return byId(C.rewrites, id); }
  function sentHTML(s, i){
    var a = ast(s.id), ans = MV.ans(s), h = '<li class="ob-sent' + (a.done ? " done" : "") + '" data-s="' + s.id + '"><p class="ob-stx"><span class="ob-sno">' + (i + 1) + "</span>" + (a.done && ans.r ? "<s>" + s.t + '</s><span class="vh"> (rewritten)</span>' : s.t) + "</p>";
    if (a.done) h += '<p class="ob-sres"><span aria-hidden="true">✓ </span>' + (ans.r ? "Rewritten: " + rw(ans.r).t : "Respectful as written.") + "</p>";
    else {
      h += '<div class="ob-vrow" role="group" aria-label="' + esc("Verdict for sentence " + (i + 1)) + '">' +
        [["respect", "Respectful"], ["rewrite", "Needs rewriting"]].map(function(v){ var on = a.v === v[0]; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-v="' + v[0] + '" data-k="v' + s.id + v[0] + '" aria-pressed="' + on + '"' + (a.v === "rewrite" && ans.v === "rewrite" ? " disabled" : "") + ">" + v[1] + "</button>"; }).join("") + "</div>";
      if (a.v === "rewrite" && ans.v === "rewrite") h += '<p class="ob-rq">Choose the rewrite:</p><div class="ob-rrow" role="group" aria-label="' + esc("Rewrites for sentence " + (i + 1)) + '">' +
        MV.shuffle(C.rewrites, "ob-rw" + s.id).map(function(r){ return '<button type="button" class="ob-rw" data-r="' + r.id + '" data-k="r' + s.id + r.id + '">' + r.t + "</button>"; }).join("") + "</div>";
    }
    if (msg[s.id]) h += MV.fbHTML(msg[s.id].k, msg[s.id].h);
    return h + "</li>";
  }
  function paint3(){
    var box = $("#ob-aud", s3), n = C.sentences.filter(function(s){ return ast(s.id).done; }).length;
    MV.keepFocus(box, function(){ box.innerHTML = C.sentences.map(sentHTML).join(""); });
    $("#ob-audn", s3).textContent = "Audited: " + n + " of " + C.sentences.length + (n === C.sentences.length ? ". Three sentences were respectful; three needed rewriting." : "");
  }
  s3.innerHTML = "<h3>" + C.title + "</h3><p>" + C.intro + '</p><ol class="ob-aud" id="ob-aud"></ol><p class="tiny muted" id="ob-audn" aria-live="polite"></p>';
  s3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var li = b.closest("[data-s]"); if (!li) return;
    var s = byId(C.sentences, li.dataset.s), a = ast(s.id), ans = MV.ans(s);
    if (b.dataset.v) {
      a.v = b.dataset.v;
      if (a.v !== ans.v) msg[s.id] = { k:"bad", h:"<strong>✗</strong> " + (ans.v === "rewrite" ? C.fb.notRespect : C.fb.notRewrite) };
      else if (ans.v === "respect") { a.done = true; msg[s.id] = { k:"good", h:"<strong>✓</strong> " + C.fb.respect }; }
      else msg[s.id] = { k:"good", h:"<strong>✓</strong> " + C.fb.rewrite };
    } else if (b.dataset.r) {
      if (b.dataset.r === ans.r) { a.r = b.dataset.r; a.done = true; msg[s.id] = { k:"good", h:"<strong>✓</strong> " + C.fb.rightR }; }
      else msg[s.id] = { k:"bad", h:"<strong>✗</strong> " + C.fb.wrongR };
    }
    api.save(); paint3(); MV.focusFb(s3.querySelector('[data-s="' + s.id + '"]'));
  });
  paint3();
}

// ---------- Practice 2: Bone and body data (custom: number entry N4 and choice chips; first-try scoring) ----------
function dataAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ var x = S.items[it.id] || (S.items[it.id] = { pick:null, vals:[], tries:0, hint:0, solved:false, first:null }); x.vals = x.vals || []; return x; }
  function order(it){ var idx = it.chips.map(function(_, i){ return i; }); return it.fixedOrder ? idx : MV.shuffle(idx, "ob-" + it.id); }
  function qHTML(it, i){
    var x = ist(it), h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">B' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Investigation" : "") + "</span>" : "") + "</div>";
    if (it.kind === "num") h += it.fields.map(function(f, k){ return '<div class="numrow"><label for="obb-' + it.id + k + '">' + f.label + ':</label><input class="numin" id="obb-' + it.id + k + '" data-bn="' + it.id + '" data-bk="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.vals[k] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + f.unit + "</span></div>"; }).join("");
    else h += '<div class="ob-bchips" role="radiogroup" aria-label="Choices">' + order(it).map(function(ci, k){
      var c = it.chips[ci], on = x.pick === ci, good = x.solved && on;
      return '<button type="button" class="ob-bchip' + (good ? " right" : "") + '" role="radio" aria-checked="' + on + '" tabindex="' + (on || (x.pick == null && k === 0) ? 0 : -1) + '" data-ci="' + ci + '" data-k="' + it.id + "c" + ci + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
    }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct' + (it.display ? ": " + it.display : "") + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].skip ? "" : "bad") + '" role="status"><p>' + msgs[it.id].h + "</p></div>";
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(qHTML).join("");
  function repaint(it){
    var box = host.querySelector('[data-bi="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ";
    if (it.kind === "num") {
      var v = it.fields.map(function(_, k){ return gnum(x.vals[k]); });
      if (v.some(function(q){ return q == null; })) return { skip:true, msg:"Enter a number, such as 250 or 75." };
      var ans = MV.ans(it);
      if (v.every(function(q, k){ return Math.abs(q - ans[k]) < 0.01; })) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return q.match.every(function(m, k){ return Math.abs(v[k] - m) < 0.01; }); })[0];
      return { msg:NQ + (w ? w.fb : it.wrongDefault) + " Try again." };
    }
    if (x.pick == null) return { skip:true, msg:"Tap a choice first." };
    var c = it.chips[x.pick];
    return MV.ok(c) ? { ok:true } : { msg:NQ + [c.fb, it.fb].filter(Boolean).join(" ") + " Try again." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bn) return; var it = byId(a.items, t.dataset.bn); ist(it).vals[+t.dataset.bk] = t.value; msgs[it.id] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (e.key === "Enter" && t.dataset && t.dataset.bn) { var b = host.querySelector('[data-k="' + t.dataset.bn + 'chk"]'); if (b) b.click(); return; }
    var c = t.closest && t.closest("[data-ci]"); if (!c) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var sibs = $$("[data-ci]", c.parentNode), k = sibs.indexOf(c), nb = sibs[(k + d + sibs.length) % sibs.length]; if (nb) { nb.click(); var nn = host.querySelector('[data-k="' + nb.dataset.k + '"]'); if (nn) nn.focus(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-bi]"); if (!box) return;
    var it = byId(a.items, box.dataset.bi), x = ist(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.ci != null) { x.pick = +b.dataset.ci; msgs[it.id] = null; }
    else if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else { if (!r.skip) x.tries++; msgs[it.id] = { h:r.msg, skip:!!r.skip }; }
      api.save(); MV.focusFb(repaint(it)); return;
    }
    api.save(); repaint(it);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Build Rowan's bones (@component F1/F2 chipCounters — − / + counters 0–2 per food, live totals
// with adequacy bars, checklist; kitchen card download) ----------
var task = (function(){
  var api = null;
  function TK(){ return MV.C.task; }
  function foods(){ return MV.C.part3.st1.foods; }
  function read(){ var s = (api && api.S) || {}, n = s.n || {}, d = {}; foods().forEach(function(f){ d[f.id] = clamp(Math.round(+n[f.id] || 0), 0, TK().limits.max); }); return d; }
  function tot(d){ var t = { ca:0, vd:0, n:0 }; foods().forEach(function(f){ t.ca += f.ca * d[f.id]; t.vd += f.vd * d[f.id]; t.n += d[f.id]; }); return t; }
  function checks(d){
    var t = tot(d), L = TK().limits, bad = foods().some(function(f){ return (f.dairy || f.fish) && d[f.id] > 0; }), veg = foods().some(function(f){ return f.veg && d[f.id] >= 1; });
    return [t.ca >= L.ca, t.vd >= L.vd, !bad, t.n <= L.servings, veg];
  }
  function keyOf(d){ return foods().filter(function(f){ return d[f.id] > 0; }).map(function(f){ return f.id + ":" + d[f.id]; }).join(","); }
  function textOf(k){ return k.split(",").map(function(p){ var q = p.split(":"), f = byId(foods(), q[0]); return q[1] + " " + (f ? f.short : q[0]); }).join(" + "); }
  function paint(){
    var d = read(), pv = $("#ob-tkpv"); if (!pv) return;
    foods().forEach(function(f){
      var v = d[f.id];
      $("#ob-tkv-" + f.id).textContent = v;
      $('[data-k="tkm' + f.id + '"]').disabled = v <= 0;
      $('[data-k="tkp' + f.id + '"]').disabled = v >= TK().limits.max;
      $('[data-tkr="' + f.id + '"]').classList.toggle("on", v > 0);
    });
    var t = tot(d), L = TK().limits, chosen = foods().filter(function(f){ return d[f.id] > 0; });
    pv.innerHTML = '<h4 class="ob-h4">Rowan’s day</h4><p class="ob-tray">' + (chosen.length ? chosen.map(function(f){ return d[f.id] + " × " + f.t.toLowerCase(); }).join(" + ") : "Nothing chosen yet.") + "</p>" +
      '<dl class="read ob-tkread">' + MV.readoutHTML([["Calcium total", "<strong>" + t.ca + " mg</strong>"], ["Vitamin D total", "<strong>" + t.vd + " IU</strong>"], ["Servings", "<strong>" + t.n + "</strong> of at most " + L.servings]]) + "</dl>" +
      adeqBars([{ t:"Calcium", v:t.ca, ref:L.ca, unit:"mg" }, { t:"Vitamin D", v:t.vd, ref:L.vd, unit:"IU" }], "The line marks the task’s condition: " + L.ca + " mg calcium and " + L.vd + " IU vitamin D from food.");
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S; s.n = s.n || {};
      inp.innerHTML = '<div class="ob-tkin" role="group" aria-label="Servings of each food">' + foods().map(function(f){
        return '<div class="ob-tkr' + (f.veg ? " veg" : "") + '" data-tkr="' + f.id + '"><span class="ob-tkn"><strong>' + f.t + '</strong> <span class="ob-fs">' + f.serving + "</span>" +
          '<span class="ob-tkd">' + f.ca + " mg · " + f.vd + " IU" + (f.note ? ' · <span class="ob-ftag' + (f.veg ? " veg" : "") + '">' + f.note + "</span>" : "") + "</span></span>" +
          '<span class="ob-ctr"><button type="button" class="btn ghost sm ob-cb" data-tk="' + f.id + '" data-d="-1" data-k="tkm' + f.id + '" aria-label="' + esc("One fewer serving of " + f.t) + '">' + MV.MINUS + "</button>" +
          '<output class="ob-tkv" id="ob-tkv-' + f.id + '" aria-live="polite" aria-label="' + esc(f.t + " servings") + '">0</output>' +
          '<button type="button" class="btn ghost sm ob-cb" data-tk="' + f.id + '" data-d="1" data-k="tkp' + f.id + '" aria-label="' + esc("One more serving of " + f.t) + '">+</button></span></div>';
      }).join("") + "</div>";
      inp.addEventListener("click", function(e){
        var b = e.target.closest("[data-tk]"); if (!b || b.disabled) return;
        var id = b.dataset.tk, v = clamp((+s.n[id] || 0) + +b.dataset.d, 0, TK().limits.max); s.n[id] = v; a.save(); paint(); a.update();
        if (b.disabled) { var o = inp.querySelector('[data-k="' + (b.dataset.d === "1" ? "tkm" : "tkp") + id + '"]'); if (o) o.focus({ preventScroll:true }); }
      });
      var K = TK().kitchen;
      pv.innerHTML = '<div id="ob-tkpv" class="ob-tkpv" aria-live="polite"></div><div class="ob-kc"><h4 class="ob-h4">Kitchen card: ' + K.title + '</h4><p class="tiny">' + K.intro + "</p>" +
        '<p class="tiny muted">' + K.lines.filter(function(l){ return /^- /.test(l); }).slice(0, 7).map(function(l){ return l.replace(/^- /, ""); }).join(", ") + '…</p><div id="ob-kcbtn"></div></div>';
      MV.kitchenCardButton($("#ob-kcbtn", pv), { title:K.title, lines:K.lines, label:"Save the kitchen card" });
      paint();
    },
    read:read,
    valid:function(d){ return tot(d).n > 0 ? true : "Add at least one serving first."; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(textOf(k)); },
    text:textOf
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ data:dataAct },
  task:task
});
})();
