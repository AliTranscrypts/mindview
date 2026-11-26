// HFA4U 24 Food Aid & the SDGs: hero (a map of fictional Ruvara: a slow ship and a cash phone head for a full town market and
// empty villages; cash feeds the town but finds nothing to buy in the villages; a truck of food bought in the region reaches
// them), Aid designer (Explore, F9: situation radio group, seven aid toggles (up to 3), arrival lanes, a scene card, live
// readout from the plan's fixed model table; Design, Compare and See the model modes), Evaluate a response (Part 3, F12 frame:
// case timeline, decision labels, criteria rubric with evidence, "Check it with data" price graph), Reading progress on
// SDG 2 (practice ★ set: model data table with tap answers and N4 number entry) and "Two places, one plan" (task: structured
// choices + a justification with a live 6-line checklist). Plan wording lives in content.mjs; this file adds only control
// labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function words(s){ return String(s || "").trim().split(/\s+/).filter(function(w){ return /[A-Za-z0-9À-ɏ]/.test(w); }).length; }
function wk(n){ return n + (n === 1 ? " week" : " weeks"); }
function lin(t){ return t; }
function cap1(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ---------- @component radioGroup (copied from HFA4U 19 / 12; per-option class, custom layout class, function labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "fai-chipset" : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="fai-rgw">' + (lab ? '<span class="fai-rgl">' + lab + "</span>" : "") + '<span class="fai-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- @component aidIcons — the seven aid kinds (24 × 24 stroke glyphs in currentColor) ----------
var ICON = {
  ship:'<path d="M3 15h18l-2.6 4.5H5.6z"/><path d="M7 15v-4h9v4M11 11V4.5l5 3-5 1.2"/>',
  truck:'<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
  phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10.5 18.5h3M12 7v6M10 8.2c0-.8.9-1.2 2-1.2s2 .5 2 1.3c0 1.8-4 1-4 2.8 0 .8.9 1.3 2 1.3s2-.4 2-1.2"/>',
  voucher:'<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M15 7.5v2M15 11v2M15 14.5v2"/>',
  bowl:'<path d="M3 11.5h18a9 7 0 0 1-18 0z"/><path d="M9 4c-1 1.5 1 2.5 0 4.5M14 4c-1 1.5 1 2.5 0 4.5"/>',
  water:'<path d="M12 3c3.5 4.5 6 7.5 6 10.5a6 6 0 0 1-12 0C6 10.5 8.5 7.5 12 3z"/><path d="M9 14.5a3 3 0 0 0 3 3"/>',
  seed:'<path d="M12 21v-9M12 12c0-4-3-6.5-7-6.5 0 4 3 6.5 7 6.5zM12 14.5c0-3 2.5-5.5 6.5-5.5 0 3-2.5 5.5-6.5 5.5z"/><path d="M7 21h10"/>'
};
function icon(k, cls){ return '<svg class="fai-ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + "</svg>"; }
function iconG(k, x, y, s, cls){ return '<g class="' + cls + '" transform="translate(' + f1(x - 12 * s) + " " + f1(y - 12 * s) + ") scale(" + s + ')">' + ICON[k] + "</g>"; }

// ---------- @component F9 marketStall — a market icon with sacks (full), meals (fed) or nothing (empty); --ink outlines ----------
function stallSVG(x, y, k, full, fedT, op){
  var o = '<g class="fai-stall" transform="translate(' + f1(x) + " " + f1(y) + ") scale(" + k + ')"' + (op != null && op < 1 ? ' opacity="' + f1(op) + '"' : "") + ">";
  o += '<path class="fai-sroof" d="M-32 -22L-26 -38H26L32 -22Z"/><path class="fai-sline" d="M-13 -38L-16 -22M0 -38V-22M13 -38L16 -22"/><rect class="fai-sbody" x="-28" y="-22" width="56" height="26"/>';
  if (full) {
    var sk = 1 - (fedT || 0), ml = fedT || 0;
    if (sk > 0.01) o += '<g opacity="' + f1(sk) + '">' + [-16, 0, 16].map(function(dx){ return '<path class="fai-sack" d="M' + (dx - 6) + ' -22q0 -10 6 -12q6 2 6 12z"/>'; }).join("") + "</g>";
    if (ml > 0.01) o += '<g opacity="' + f1(ml) + '">' + [-16, 0, 16].map(function(dx){ return '<path class="fai-meal" d="M' + (dx - 7) + ' -27h14a7 6 0 0 1 -14 0z"/><path class="fai-steam" d="M' + (dx - 2) + " -31q-2 -3 0 -6M" + (dx + 3) + ' -31q-2 -3 0 -6"/>'; }).join("") + "</g>";
  }
  return o + "</g>";
}

// ---------- the plan's model (values in content.explore.options; package rules from the readout table) ----------
function EX(){ return MV.C.explore; }
function opt(id){ return byId(EX().options, id); }
var RANK = { reach:{ no:0, partly:1, yes:2 }, nut:{ little:0, some:1, strong:2 }, res:{ low:0, medium:1, high:2 } };
function best(cs, k){ var b = null; cs.forEach(function(x){ if (b == null || RANK[k][x.c[k]] > RANK[k][b]) b = x.c[k]; }); return b; }
function pkgStats(pkg, sit){
  if (!pkg || !pkg.length) return null;
  var cs = pkg.map(function(id){ return { id:id, c:opt(id)[sit] }; });
  var hurt = cs.filter(function(x){ return x.c.mk === "hurts"; });
  return {
    fast:Math.min.apply(null, cs.map(function(x){ return x.c.w; })),
    reach:cs.some(function(x){ return x.c.reach === "yes"; }) ? "yes" : cs.some(function(x){ return x.c.reach === "partly"; }) ? "partly" : "no",
    mk:hurt.length ? "hurts" : cs.some(function(x){ return x.c.mk === "helps"; }) ? "helps" : "neutral",
    mkWhy:hurt.length ? hurt[0].c.mkT.replace(/^Hurts\s*/, "") : "",
    nut:best(cs, "nut"), res:best(cs, "res"),
    dig:pkg.indexOf("A3") >= 0 || pkg.indexOf("A4") >= 0 ? "high" : "standard",
    warns:hurt.map(function(x){ return x.id + " in " + sit + ": " + x.c.warn; })
  };
}
function mkTag(mk){ return '<span class="fai-mk ' + mk + '">' + EX().levels.mk[mk] + "</span>"; }
var ROWS = ["fast", "reach", "mk", "nut", "res", "dig", "warn"];
function rowVal(k, st){
  var LV = EX().levels;
  if (!st) return '<span class="muted">—</span>';
  if (k === "fast") return "<strong>" + wk(st.fast) + "</strong>";
  if (k === "reach") return "<strong>" + LV.reach[st.reach] + "</strong>";
  if (k === "mk") return mkTag(st.mk) + (st.mkWhy ? " " + st.mkWhy : "");
  if (k === "nut") return "<strong>" + LV.nut[st.nut] + "</strong>";
  if (k === "res") return "<strong>" + LV.res[st.res] + "</strong>";
  if (k === "dig") return "<strong>" + (st.dig === "high" ? "High" : "Standard") + "</strong>" + (st.dig === "high" ? " (families choose)" : "");
  return st.warns.length ? st.warns.map(function(w){ return '<span class="fai-warn"><span aria-hidden="true">⚠</span> ' + w + "</span>"; }).join("") : "—";
}
function reachSym(r){ return r === "yes" ? "✓" : r === "partly" ? "◐" : "✗"; }

// ---------- hero (storyboard: the map of Ruvara appears; a slow ship "16 weeks" and a phone "cash: 1 week" head out; cash
// reaches the town market, where the sacks become meals, and stops at the villages: "no food to buy"; a truck "bought in the
// region" reaches the villages; caption). Reduced motion: final frame only. ----------
function hero(f){
  var host = $("#fai-hero"); if (!host) return;
  var Hc = MV.C.hero, st = { map:0, go:0, fed:0, truck:0, cap:0 };
  host.innerHTML = '<svg class="fai-hsvg" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function lay(nw){
    return nw ? { W:360, H:440, sea:40, town:[124, 258], v1:[272, 136], v2:[292, 300], phone:[86, 62], ship:[20, 398], truck:[344, 410], cap:[20, 430], lab:"start" }
      : { W:600, H:300, sea:64, town:[215, 186], v1:[470, 96], v2:[512, 212], phone:[150, 52], ship:[32, 262], truck:[590, 286], cap:[96, 292], lab:"start" };
  }
  function T(x, y, s, cls, anchor, op){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "start") + '"' + (op != null && op < 1 ? ' opacity="' + f1(op) + '"' : "") + ">" + s + "</text>"; }
  function P(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
  function seg(a, b, cls, head){ return '<line class="' + cls + '" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"' + (head ? ' marker-end="url(#' + head + ')"' : "") + "/>"; }
  function road(a, b){ var p1 = P(a, b, 0.44), p2 = P(a, b, 0.58), m = P(a, b, 0.51); return seg(a, p1, "fai-hroad") + seg(p2, b, "fai-hroad") + '<path class="fai-hbreak" d="M' + f1(m[0] - 6) + " " + f1(m[1] - 6) + "l12 12M" + f1(m[0] + 6) + " " + f1(m[1] - 6) + 'l-12 12"/>'; }
  function draw(){
    var nw = (host.getBoundingClientRect().width || 600) < 460, L = lay(nw), W = L.W, H = L.H;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var o = '<defs><marker id="fai-ahc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fai-hahc" d="M0 0L10 5L0 10z"/></marker>' +
      '<marker id="fai-aht" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fai-haht" d="M0 0L10 5L0 10z"/></marker></defs>';
    o += '<g opacity="' + f1(st.map) + '">';
    // sea strip, land label, roads with the washout, markets
    o += '<rect class="fai-hsea" x="0" y="0" width="' + L.sea + '" height="' + H + '"/>';
    for (var wy = 30; wy < H - 10; wy += 46) o += '<path class="fai-hwave" d="M' + (L.sea / 2 - 12) + " " + wy + "q6 -5 12 0t12 0" + '"/>';
    o += T(L.sea + 12, 22, "Ruvara (fictional)", "fai-hl");
    var tTop = [L.town[0] + 30, L.town[1] - 16], v1b = [L.v1[0] - 30, L.v1[1] - 6], v2b = [L.v2[0] - 32, L.v2[1] - 10];
    o += road(tTop, v1b) + road(tTop, v2b);
    var mid = P(tTop, v2b, 0.51);
    o += T(mid[0] + (nw ? -8 : 10), mid[1] + (nw ? 26 : 22), "road washed out", "fai-hs", nw ? "middle" : "start");
    o += stallSVG(L.town[0], L.town[1], 1, true, st.fed) + T(L.town[0], L.town[1] + 22, "Town market", "fai-hs", "middle");
    o += stallSVG(L.v1[0], L.v1[1], 0.8, false) + stallSVG(L.v2[0], L.v2[1], 0.8, false) + T(L.v2[0], L.v2[1] + 20, "Villages (empty shops)", "fai-hs", "middle");
    o += "</g>";
    // the ship (slow) and the cash (phone) head out
    if (st.go > 0) {
      var tgt = [L.town[0] - 30, L.town[1] - 6];
      o += seg(L.ship, tgt, "fai-hroute ship");
      var sp = P(L.ship, tgt, 0.22 * st.go);
      o += iconG("ship", sp[0], sp[1] - 4, 1.4, "fai-hico ship") + T(sp[0] + (nw ? 6 : 22), sp[1] - (nw ? 26 : 4), "16 weeks", "fai-hl", "start", st.go);
      o += iconG("phone", L.phone[0], L.phone[1], 1.3, "fai-hico cash") + T(L.phone[0] + 20, L.phone[1] + (nw ? -18 : 5), "cash: 1 week", "fai-hl", "start", st.go);
      var c0 = [L.phone[0] + 10, L.phone[1] + 18], cT = [L.town[0] - 6, L.town[1] - 46], cV = [L.v1[0] - 40, L.v1[1] - 30];
      o += seg(c0, P(c0, cT, st.go), "fai-hcash", st.go > 0.98 ? "fai-ahc" : "");
      o += seg([c0[0] + 10, c0[1] - 6], P([c0[0] + 10, c0[1] - 6], cV, st.go), "fai-hcash", st.go > 0.98 ? "fai-ahc" : "");
    }
    if (st.fed > 0) o += T(L.v1[0], L.v1[1] - 48, "✗ no food to buy", "fai-hl fai-hon", "middle", st.fed) + T(L.town[0], L.town[1] - 54, "families’ meals", "fai-hs fai-hon", "middle", st.fed);
    // the truck of food bought in the region
    if (st.truck > 0) {
      var tEnd = [L.v2[0] + 26, L.v2[1] + 4], tp = P(L.truck, tEnd, st.truck);
      o += seg(L.truck, P(L.truck, tEnd, st.truck), "fai-htruck", st.truck > 0.98 ? "fai-aht" : "");
      o += iconG("truck", tp[0], tp[1] - 12, 1.3, "fai-hico truck");
      o += T(nw ? W - 8 : L.truck[0] - 8, nw ? L.truck[1] - 50 : L.truck[1] - 18, "bought in the region", "fai-hl", "end", st.truck);
    }
    if (st.cap > 0) o += T(L.cap[0], L.cap[1], Hc.caption, "fai-hcap", "start", st.cap);
    svg.innerHTML = o;
  }
  window.addEventListener("resize", draw);
  function cap(){ if (f.cap) f.cap.textContent = Hc.caption; }
  if (MV.reduceMotion) { st = { map:1, go:1, fed:1, truck:1, cap:1 }; draw(); cap(); return; }
  draw();
  function tw(key, dur, next){ MV.tween({ dur:dur, step:function(t){ st[key] = t; draw(); }, done:next }); }
  MV.wait(250, function(){ tw("map", 600, function(){ tw("go", 1500, function(){ tw("fed", 800, function(){ tw("truck", 1300, function(){ tw("cap", 500, cap); }); }); }); }); });
}

// ---------- Explore: Aid designer (@component F9 aidDesigner — situation radio group, aid toggles (up to 3, a fourth replaces
// the oldest), arrival lanes, scene card, live readout, Design / Compare / See the model) ----------
function explore(host, api){
  var D = api.content, S = api.S, R = D.rows, M = D.msgs;
  var IDS = D.options.map(function(o){ return o.id; });
  function cleanPkg(p){ var out = []; (Array.isArray(p) ? p : []).forEach(function(id){ if (IDS.indexOf(id) >= 0 && out.indexOf(id) < 0 && out.length < 3) out.push(id); }); return out; }
  S.mode = byId(D.modes, S.mode) ? S.mode : "design";
  S.sit = byId(D.sits, S.sit) ? S.sit : "S1";
  S.pkg = cleanPkg(S.pkg); S.pkg2 = cleanPkg(S.pkg2);
  S.edit = S.edit === "2" ? "2" : "1";
  S.spend = !!S.spend;
  var fx = fresh(), anim = null, pend = null, timers = [], msg = "";
  function fresh(){ return { lit:[], clock:null, spendT:null }; }

  host.innerHTML = '<div class="fai-top"><div id="fai-mode"></div><span class="hfa-model">' + D.modelTag + '</span></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="fai-lab" data-mv="graph">' +
      '<div class="fai-main"><div id="fai-sit"></div><div class="fai-vis" id="fai-vis"></div></div>' +
      '<div class="fai-side"><h4 class="fai-h4">Readout</h4><div id="fai-read" aria-live="polite"></div></div>' +
      '<div class="fai-ctl"><div id="fai-edit"></div><h4 class="fai-h4" id="fai-oh">Kinds of aid (up to 3)</h4><div class="fai-opts" id="fai-opts" role="group" aria-labelledby="fai-oh">' +
        D.options.map(function(o){ return '<button type="button" class="fai-opt" aria-pressed="false" data-opt="' + o.id + '" data-k="opt' + o.id + '">' + icon(o.icon, "c" + o.id) + '<span class="fai-ot"><strong>' + o.id + " " + o.t + "</strong><small>" + o.sub + '</small></span><span class="fai-on" aria-hidden="true"></span></button>'; }).join("") +
        '</div><p class="tiny fai-msg" id="fai-msg" aria-live="polite"></p>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="fai-chk" data-k="faichk">Check package</button><button type="button" class="btn ghost sm" id="fai-reset" data-k="faireset">Reset</button></div>' +
        '<div id="fai-fb" tabindex="-1"></div></div>' +
    "</div>" +
    '<p class="tiny muted fai-note"><span class="hfa-model">' + D.modelTag + "</span> " + D.modelNote + "</p>";

  var modeRG = radios($("#fai-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; fx = fresh(); fbClear(); msg = ""; commit(); } });
  var sitRG = radios($("#fai-sit"), { label:"Situation", aria:"Season and situation", cls:"chips", options:D.sits.map(function(s){ return { id:s.id, t:"<strong>" + s.id + "</strong> " + s.t }; }), value:S.sit,
    onChange:function(v){ cancelAnim(); S.sit = v; fx = fresh(); fbClear(); msg = ""; commit(); } });
  var editRG = radios($("#fai-edit"), { label:"Edit", aria:"Package to edit", options:[{ id:"1", t:"Package 1" }, { id:"2", t:"Package 2" }], value:S.edit,
    onChange:function(v){ S.edit = v; fbClear(); msg = ""; api.save(); paintOpts(); } });

  function curPkg(){ return S.mode === "compare" && S.edit === "2" ? S.pkg2 : S.pkg; }
  $("#fai-opts").addEventListener("click", function(e){
    var b = e.target.closest("[data-opt]"); if (!b) return;
    cancelAnim();
    var id = b.dataset.opt, p = curPkg(), k = p.indexOf(id);
    if (k >= 0) { p.splice(k, 1); msg = ""; }
    else {
      msg = "";
      if (p.length >= 3) { var old = p.shift(); msg = fill(M.replaced, { old:old + " " + opt(old).short, "new":id + " " + opt(id).short }); }
      p.push(id);
    }
    fx = fresh(); fbClear(); commit();
  });
  $("#fai-reset").addEventListener("click", function(){ cancelAnim(); S.pkg.length = 0; S.pkg2.length = 0; fx = fresh(); msg = ""; fbClear(); commit(); });
  $("#fai-chk").addEventListener("click", function(){
    cancelAnim(); var p = curPkg(), fb = $("#fai-fb");
    if (!p.length) { fb.innerHTML = MV.fbHTML("", M.empty); MV.focusFb(fb); return; }
    fbClear();
    runClock(2200, function(){ fb.innerHTML = checkHTML(p); MV.focusFb(fb); });
  });

  // ===== painting =====
  function lit(k){ return fx.lit.indexOf(k) >= 0; }
  function fbClear(){ var fb = $("#fai-fb"); if (fb) fb.innerHTML = ""; }
  function sceneHTML(){
    var s = S.sit, o = '<svg class="fai-ssvg" viewBox="0 0 150 70" aria-hidden="true">' + stallSVG(42, 58, 0.85, s !== "S2", 0);
    if (s === "S1") o += '<path class="fai-stag" d="M86 14h34l8 9-8 9H86z"/><text class="fai-sst" x="104" y="27" text-anchor="middle">$ ↑</text>';
    if (s === "S2") o += '<path class="fai-hroad" d="M82 50h20M116 50h30"/><path class="fai-hbreak" d="M104 44l10 12M114 44l-10 12"/><path class="fai-hwave" d="M84 64q6 -5 12 0t12 0t12 0t12 0t12 0"/>';
    if (s === "S3") o += '<path class="fai-scloud" d="M92 26a8 8 0 0 1 8-10 10 10 0 0 1 18 2 7 7 0 0 1 2 14H96a6 6 0 0 1-4-6z"/><path class="fai-srain" d="M100 38l-3 7M110 38l-3 7M120 38l-3 7"/>' +
      [96, 112, 128].map(function(x){ return '<path class="fai-ssprout" d="M' + x + " 66v-8M" + x + " 60c0-3-2-5-5-5 0 3 2 5 5 5zM" + x + ' 61c0-3 2-5 5-5 0 3-2 5-5 5z"/>'; }).join("");
    o += "</svg>";
    var si = byId(D.sits, s);
    return '<div class="fai-scene">' + o + "<p><strong>" + s + " " + si.t + ".</strong> " + D.scenes[s] + "</p></div>";
  }
  function arrivals(p){
    return p.map(function(id){
      var o = opt(id), c = o[S.sit], n = o.short;
      if (c.reach === "yes") return n + " reaches families in " + wk(c.w) + ".";
      var m = /\(([^)]*)\)/.exec(c.reachT);
      if (c.reach === "partly") return n + " arrives in " + wk(c.w) + " but reaches only some people now" + (m ? " (" + m[1] + ")" : "") + ".";
      return c.mk === "hurts" ? n + " arrives in " + wk(c.w) + ", but there’s nothing to buy." : n + " arrives in " + wk(c.w) + " but doesn’t feed people now.";
    }).join(" ");
  }
  function laneBlock(p, title){
    var clock = fx.clock == null ? 16 : fx.clock, h = '<div class="fai-tlw">' + (title ? '<h4 class="fai-h4">' + title + "</h4>" : "");
    if (!p.length) return h + '<p class="tiny muted fai-empty">Choose up to three kinds of aid to see how fast each reaches families.</p></div>';
    h += '<ul class="fai-lanes" aria-label="' + esc("Weeks to reach families" + (title ? ", " + title : "")) + '">';
    p.forEach(function(id){
      var o = opt(id), c = o[S.sit], arrived = clock >= c.w - 1e-6, wpc = clamp(Math.min(clock, c.w) / 16, 0, 1) * 100;
      h += '<li class="fai-lane"><span class="fai-ll">' + icon(o.icon, "c" + id) + "<span><strong>" + id + "</strong> " + o.short + ' <span class="fai-lw">' + wk(c.w) + "</span></span></span>" +
        '<span class="fai-lt" aria-hidden="true"><i class="fai-lb c' + id + '" style="width:' + f1(wpc) + '%"></i></span>' +
        '<span class="fai-ls">' + (arrived ? '<span class="fai-rch">' + reachSym(c.reach) + " Reaches now: " + c.reachT + "</span>" + (c.mk === "hurts" ? " " + mkTag("hurts") : "") : '<span class="muted">on its way…</span>') + "</span></li>";
    });
    h += '</ul><div class="fai-axis" aria-hidden="true">' + [0, 4, 8, 12, 16].map(function(t){ return '<span style="left:' + (t / 16 * 100) + '%">' + t + "</span>"; }).join("") + '</div><p class="tiny muted fai-axl">Weeks to reach families</p>';
    if (fx.clock == null) h += '<p class="tiny fai-arr">' + arrivals(p) + "</p>";
    return h + "</div>";
  }
  function spendHTML(){
    var sp = D.spend; if (!S.spend || S.pkg.indexOf("A3") < 0 || S.mode !== "design") return "";
    var t = fx.spendT == null ? 1 : fx.spendT;
    return '<div class="fai-spend' + (lit("spend") ? " fai-lit" : "") + '"><p class="fai-h5"><strong>' + sp.title + '</strong> <span class="hfa-model">' + sp.tag + '</span></p><div class="fai-sbar" aria-hidden="true">' +
      sp.parts.map(function(x, i){ return '<i class="s' + i + '" style="width:' + f1(x.v * t) + '%"></i>'; }).join("") + '</div><ul class="fai-slist">' +
      sp.parts.map(function(x, i){ return '<li><span class="fai-sk s' + i + '" aria-hidden="true"></span>' + x.t + " " + x.v + "%</li>"; }).join("") + "</ul></div>";
  }
  function modelHTML(){
    var si = byId(D.sits, S.sit), L = D.levels;
    return '<p class="fai-h5"><strong>The model for ' + S.sit + ": " + si.t + '</strong> <span class="hfa-model">' + D.modelTag + "</span></p>" +
      '<div class="tbl-wrap"><table class="fai-mtab"><caption class="vh">Teaching model for ' + esc(si.t) + '</caption><thead><tr><th scope="col">Option</th><th scope="col">Weeks to reach families</th><th scope="col">Effect on local farmers and shops</th><th scope="col">Reaches the hungry now?</th><th scope="col">Child nutrition</th><th scope="col">Long-term resilience</th><th scope="col">Why</th></tr></thead><tbody>' +
      D.options.map(function(o){
        var c = o[S.sit], inP = S.pkg.indexOf(o.id) >= 0 || (S.mode === "compare" && S.pkg2.indexOf(o.id) >= 0);
        return '<tr class="' + (inP ? "fai-inp" : "") + '"><th scope="row" data-label="Option"><strong>' + o.id + "</strong> " + o.short + (inP ? ' <span class="tag">chosen</span>' : "") + "</th>" +
          '<td data-label="Weeks">' + c.w + '</td><td data-label="Local farmers and shops">' + (c.mk === "hurts" ? mkTag("hurts") + " " + c.mkT.replace(/^Hurts\s*/, "") : c.mkT) + "</td>" +
          '<td data-label="Reaches the hungry now?">' + reachSym(c.reach) + " " + c.reachT + '</td><td data-label="Child nutrition">' + L.nut[c.nut] + '</td><td data-label="Long-term resilience">' + L.res[c.res] + '</td><td data-label="Why" class="fai-why">' + c.why + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<p class="tiny">Change the situation to see its rows. The ratings are built on these findings: ' + D.modelFindings.join(" ") + "</p>";
  }
  function paintVis(){
    var v = $("#fai-vis");
    if (S.mode === "model") { v.innerHTML = modelHTML(); return; }
    var h = sceneHTML();
    if (S.mode === "compare") h += '<div class="fai-cmp">' + laneBlock(S.pkg, "Package 1") + laneBlock(S.pkg2, "Package 2") + "</div>";
    else h += laneBlock(S.pkg, "") + spendHTML();
    v.innerHTML = h;
  }
  function paintRead(){
    var el = $("#fai-read");
    if (S.mode === "compare") {
      var a = pkgStats(S.pkg, S.sit), b = pkgStats(S.pkg2, S.sit);
      el.innerHTML = '<div class="tbl-wrap"><table class="fai-rtab"><caption class="vh">Package 1 and Package 2 compared</caption><thead><tr><th scope="col"></th><th scope="col">Package 1</th><th scope="col">Package 2</th></tr></thead><tbody>' +
        ROWS.map(function(k){
          var va = rowVal(k, a), vb = rowVal(k, b), diff = (a || b) && MV.plain(va) !== MV.plain(vb);
          return '<tr class="' + (diff ? "fai-diff" : "") + '"><th scope="row">' + R[k] + (diff ? ' <span class="fai-dm" aria-hidden="true">≠</span><span class="vh"> (differs)</span>' : "") + "</th><td>" + va + "</td><td>" + vb + "</td></tr>";
        }).join("") + "</tbody></table></div>";
      return;
    }
    var st = pkgStats(S.pkg, S.sit);
    el.innerHTML = '<dl class="read fai-read">' + ROWS.map(function(k){ return '<div class="' + (lit(k) ? "fai-lit" : "") + '"><dt>' + R[k] + "</dt><dd>" + rowVal(k, st) + "</dd></div>"; }).join("") + "</dl>" +
      '<p class="tiny muted">Package: ' + (S.pkg.length ? S.pkg.map(function(id){ return id + " " + opt(id).short; }).join(" + ") : "none yet") + " · " + S.sit + "</p>";
  }
  function paintOpts(){
    var p = curPkg();
    $$("[data-opt]", host).forEach(function(b){ var on = p.indexOf(b.dataset.opt) >= 0; b.setAttribute("aria-pressed", on); b.querySelector(".fai-on").textContent = on ? "✓" : ""; });
    $("#fai-edit").hidden = S.mode !== "compare";
    $("#fai-msg").textContent = msg;
  }
  function paintAll(){ modeRG.set(S.mode); sitRG.set(S.sit); editRG.set(S.edit); paintOpts(); paintVis(); paintRead(); }
  function commit(){ api.save(); paintAll(); MV.changed(); }
  function checkHTML(p){
    var st = pkgStats(p, S.sit), issues = [], good = [], L = D.levels;
    if (st.reach === "no") issues.push(M.nofeed); else good.push(R.reach.toLowerCase() + ": " + L.reach[st.reach]);
    st.warns.forEach(function(w){ issues.push("⚠ " + w + "."); });
    if (st.mk !== "hurts") good.push(R.mk.toLowerCase() + ": " + L.mk[st.mk]);
    if (st.nut !== "strong") issues.push(fill(M.nutWeak, { nut:L.nut[st.nut] })); else good.push(R.nut.toLowerCase() + ": Strong");
    if (st.res === "low") issues.push(M.resLow); else good.push(R.res.toLowerCase() + ": " + L.res[st.res]);
    var head = "<p><strong>" + p.map(function(id){ return id + " " + opt(id).short; }).join(" + ") + " in " + S.sit + ":</strong> fastest arrival " + wk(st.fast) + ".</p>";
    if (!issues.length && st.reach === "yes") return MV.fbHTML("good", head + "<p>" + M.allGood + "</p>");
    return MV.fbHTML("", head + (good.length ? "<p>" + fill(M.good, { list:good.join("; ") }) + "</p>" : "") + (issues.length ? '<ul class="fai-iss">' + issues.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>" : ""));
  }

  // ===== animation =====
  function runClock(dur, done){
    fx.clock = 0; paintVis();
    anim = MV.tween({ dur:dur, ease:lin, step:function(t){ fx.clock = 16 * t; paintVis(); }, done:function(){ anim = null; fx.clock = null; paintVis(); if (done) done(); } });
  }
  function finish(){ anim = null; timers = []; fx.clock = null; fx.spendT = null; api.save(); paintAll(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = []; fx.clock = null; fx.spendT = null; if (pend) { var d = pend; pend = null; d(); } }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  paintAll();

  // ===== challenges (plan's exact tests and named wrong states; they read only the sit + package 1) =====
  var CH = {}; D.challenges.forEach(function(c){ CH[c.id] = c; });
  function challenge(id){
    var M2 = CH[id].msgs, P = S.pkg, n = P.length, r = { ok:false };
    function has(x){ return P.indexOf(x) >= 0; }
    if (id === "tc1") {
      if (S.sit !== "S1") r.msg = M2.sit;
      else if (!n) r.msg = M2.none;
      else if (has("A1")) r.msg = M2.a1;
      else if (has("A3") || has("A4")) r = { ok:true };
      else if (n === 1 && has("A2")) r.msg = M2.a2;
      else if (n === 1 && has("A5")) r.msg = M2.a5;
      else r.msg = M2.other;
    } else if (id === "tc2") {
      if (S.sit !== "S2") r.msg = M2.sit;
      else if (!n) r.msg = M2.none;
      else if (has("A3") || has("A4")) r.msg = M2.cash;
      else if (!has("A2") && has("A1")) r.msg = M2.a1;
      else if (!has("A2")) r.msg = M2.other;
      else if (!has("A5")) r.msg = M2.a5;
      else r = { ok:true };
    } else if (id === "tc3") {
      if (S.sit !== "S3") r.msg = M2.sit;
      else if (n !== 3) r.msg = M2.count;
      else if (has("A1")) r.msg = M2.a1;
      else if (!has("A2") && !has("A3") && !has("A4")) r.msg = M2.nofeed;
      else if (!has("A5")) r.msg = M2.nostrong;
      else if (!has("A6") && !has("A7")) r.msg = M2.nores;
      else r = { ok:true };
    }
    return r;
  }

  // ===== predictions =====
  function addAll(ids){ ids.forEach(function(id){ if (S.pkg.indexOf(id) < 0) { if (S.pkg.length >= 3) S.pkg.shift(); S.pkg.push(id); } }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx = fresh(); msg = ""; fbClear();
        S.mode = "design"; S.edit = "1"; S.sit = p.start.sit; S.pkg = p.start.pkg.slice();
        if (p.id === "p2") S.spend = false;
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p2") {
          S.spend = true; fx.spendT = 0; paintVis();
          later(300, function(){ anim = MV.tween({ dur:1400, step:function(t){ fx.spendT = t; paintVis(); }, done:function(){ fx.lit = ["spend"]; finish(); } }); });
          return;
        }
        later(300, function(){
          addAll(p.add); api.save(); paintOpts(); paintRead();
          fx.clock = 0; paintVis();
          anim = MV.tween({ dur:p.id === "p1" ? 3200 : 2000, ease:lin, step:function(t){ fx.clock = 16 * t; paintVis(); },
            done:function(){ fx.lit = p.id === "p1" ? ["fast"] : p.id === "p3" ? ["reach", "mk"] : ["nut"]; finish(); } });
        });
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Evaluate a response (@component F12 evaluateStations — case timeline; decision labels with reason chips;
// a six-criterion rubric with an evidence chip per score; "Check it with data" price table and graph) ----------
function priceSVG(P){
  var W = 340, H = 196, x0 = 40, x1 = W - 18, yb = 160, yt = 20, max = 90, n = P.rows.length;
  function X(i){ return x0 + i * (x1 - x0) / (n - 1); }
  function Y(v){ return yb - v / max * (yb - yt); }
  var aria = "Line graph, model data: town grain price " + P.rows.map(function(r){ return r.v + " in " + r.m; }).join(", ") + ". The normal price is " + P.normal + "; September’s " + P.rows[3].v + " is below it.";
  var o = '<svg class="fai-psvg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">';
  [0, 20, 40, 60, 80].forEach(function(v){ o += '<line class="fai-pgrid" x1="' + x0 + '" x2="' + x1 + '" y1="' + f1(Y(v)) + '" y2="' + f1(Y(v)) + '"/><text class="fai-pax" x="' + (x0 - 6) + '" y="' + f1(Y(v) + 4) + '" text-anchor="end">' + v + "</text>"; });
  o += '<line class="fai-pnorm" x1="' + x0 + '" x2="' + x1 + '" y1="' + f1(Y(P.normal)) + '" y2="' + f1(Y(P.normal)) + '"/><text class="fai-pnl" x="' + (x1 - 2) + '" y="' + f1(Y(P.normal) - 5) + '" text-anchor="end">normal ' + P.normal + "</text>";
  o += '<polyline class="fai-pline" points="' + P.rows.map(function(r, i){ return f1(X(i)) + "," + f1(Y(r.v)); }).join(" ") + '"/>';
  P.rows.forEach(function(r, i){
    var low = r.v < P.normal;
    o += '<circle class="fai-ppt' + (low ? " low" : "") + '" cx="' + f1(X(i)) + '" cy="' + f1(Y(r.v)) + '" r="' + (low ? 6 : 4) + '"/>' +
      '<text class="fai-pv" x="' + f1(X(i)) + '" y="' + f1(low ? Y(r.v) + 20 : Y(r.v) - 9) + '" text-anchor="middle">' + r.v + "</text>" +
      '<text class="fai-pax" x="' + f1(X(i)) + '" y="' + (yb + 18) + '" text-anchor="middle">' + r.m + "</text>";
  });
  return o + '<text class="fai-pax" x="' + f1(X(3)) + '" y="' + (yb + 32) + '" text-anchor="middle">harvest + imported grain</text></svg>';
}
function part3(host, api){
  var D = api.content, S = api.S;
  S.st = byId(D.stations, S.st) ? S.st : "timeline";
  S.tl = S.tl || {}; S.rb = S.rb || {};
  host.innerHTML = '<div class="fai-case"><p class="fai-ctag"><span class="hfa-model">' + D.caseTag + '</span></p><h4 class="fai-h4">' + D.caseTitle + '</h4><ol class="fai-tline">' +
      D.timeline.map(function(c, i){ return '<li class="fai-tc"><span class="fai-tn" aria-hidden="true">' + (i + 1) + '</span><span class="fai-tw">' + c.when + '</span><span class="fai-tt">' + c.t + "</span></li>"; }).join("") + "</ol></div>" +
    '<div id="fai-stn"></div><p class="tiny" id="fai-stp" aria-live="polite"></p>' +
    D.stations.map(function(s, i){ return '<div class="fai-station" id="fai-st-' + s.id + '"' + (i ? " hidden" : "") + "></div>"; }).join("");
  function decOk(d){ var x = S.tl[d.id] || {}; return x.v === MV.ans(d) && x.r != null && x.r !== "" && MV.ok(d.reasons[+x.r]); }
  function rbOk(c){ var x = S.rb[c.id] || {}, e = byId(D.evidence, x.e); return !!(e && e.crit.indexOf(c.id) >= 0); }
  function pxOk(){ return S.px != null && S.px !== "" && MV.ok(D.prices.choices[+S.px]); }
  function done(id){
    if (id === "timeline") return !!S.tlChk && D.decisions.every(decOk);
    if (id === "rubric") return !!S.rbChk && D.criteria.every(function(c){ var x = S.rb[c.id] || {}; return x.s && rbOk(c); });
    return pxOk();
  }
  function stLabels(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="fai-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  var stRG = radios($("#fai-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#fai-stp", host).textContent = "Stations finished: " + D.stations.filter(function(s){ return done(s.id); }).length + " of " + D.stations.length + ".";
  }

  // ===== Station 1: label each decision, with a reason =====
  var s1 = $("#fai-st-timeline", host), TM = D.timelineMsgs;
  s1.innerHTML = '<p>Tap a label for each decision in the case, then choose the reason that fits.</p><div class="fai-decs">' + D.decisions.map(function(d){
    var c = byId(D.timeline, d.card);
    return '<div class="fai-dec" data-dec="' + d.id + '"><p class="fai-dct"><span class="fai-tn" aria-hidden="true">' + (D.timeline.indexOf(c) + 1) + "</span> " + c.t + ' <span class="fai-dmk" aria-hidden="true"></span></p><div id="fai-dv-' + d.id + '"></div><div id="fai-dr-' + d.id + '"></div><p class="tiny fai-dfb"></p></div>';
  }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" id="fai-tlchk" data-k="faitlchk">Check my labels</button></div><div id="fai-tlfb" aria-live="polite"></div>';
  D.decisions.forEach(function(d, di){
    var c = byId(D.timeline, d.card), x = S.tl[d.id] || (S.tl[d.id] = {});
    radios($("#fai-dv-" + d.id, s1), { label:"Label", aria:"Label for: " + MV.plain(c.t), cls:"chips", options:D.verdicts, value:x.v || "",
      onChange:function(v){ x.v = v; S.tlChk = false; api.save(); paintTl(); stRepaint(); } });
    var order = MV.shuffle(d.reasons.map(function(_, i){ return i; }), 2400 + di) || d.reasons.map(function(_, i){ return i; });
    radios($("#fai-dr-" + d.id, s1), { label:"Reason", aria:"Reason for: " + MV.plain(c.t), cls:"chips", options:order.map(function(i){ return { id:String(i), t:d.reasons[i].t }; }), value:x.r != null ? x.r : "",
      onChange:function(v){ x.r = v; S.tlChk = false; api.save(); paintTl(); stRepaint(); } });
  });
  function paintTl(){
    var chk = !!S.tlChk, all = D.decisions.every(function(d){ var x = S.tl[d.id] || {}; return x.v && x.r != null && x.r !== ""; });
    D.decisions.forEach(function(d){
      var box = $('[data-dec="' + d.id + '"]', s1), ok = decOk(d), show = chk && all, x = S.tl[d.id] || {};
      box.classList.toggle("right", show && ok); box.classList.toggle("wrong", show && !ok);
      $(".fai-dmk", box).textContent = show ? (ok ? "✓" : "✗") : "";
      // module-written per-decision lines when wrong
      $(".fai-dfb", box).innerHTML = !show ? "" : ok ? d.fb : x.v !== MV.ans(d) ? '<span class="vh">Not right yet. </span>Check the label: does this decision fit what Ruvara needed at that moment?' : '<span class="vh">Not right yet. </span>The label is right; choose the reason that matches the case.';
    });
    var fb = $("#fai-tlfb", s1), off = D.decisions.filter(function(d){ return !decOk(d); }).length;
    fb.innerHTML = !chk ? "" : !all ? MV.fbHTML("", TM.partial) : !off ? MV.fbHTML("good", "<strong>✓ " + TM.ok + "</strong>") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fill(TM.off, { n:off === 1 ? "1 decision is" : off + " decisions are" }));
  }
  $("#fai-tlchk", s1).addEventListener("click", function(){ S.tlChk = true; api.save(); paintTl(); stRepaint(); MV.focusFb($("#fai-tlfb", s1)); });

  // ===== Station 2: the criteria rubric =====
  var s2 = $("#fai-st-rubric", host), RM = D.rubricMsgs;
  s2.innerHTML = '<p>Score the overall response from 1 (weak) to 4 (strong) on each criterion, and choose one piece of evidence from the case for each score.</p><div class="fai-rub">' + D.criteria.map(function(c){
    return '<div class="fai-crit" data-cr="' + c.id + '"><p class="fai-crt"><strong>' + c.t + ":</strong> " + c.q + ' <span class="fai-dmk" aria-hidden="true"></span></p><div id="fai-cs-' + c.id + '"></div>' +
      '<label class="fai-evl" for="fai-ce-' + c.id + '">Evidence</label><select class="fai-sel" id="fai-ce-' + c.id + '" data-ce="' + c.id + '"><option value="">Choose evidence…</option>' +
      D.evidence.map(function(e){ return '<option value="' + e.id + '">' + e.t + "</option>"; }).join("") + '</select><p class="tiny fai-dfb"></p></div>';
  }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" id="fai-rbchk" data-k="fairbchk">Check my evidence</button></div><div id="fai-rbfb" aria-live="polite"></div>';
  D.criteria.forEach(function(c){
    var x = S.rb[c.id] || (S.rb[c.id] = {});
    radios($("#fai-cs-" + c.id, s2), { label:"Score", aria:"Score for " + c.t, options:[1, 2, 3, 4].map(function(v){ return { id:String(v), t:String(v) }; }), value:x.s || "",
      onChange:function(v){ x.s = v; S.rbChk = false; api.save(); paintRb(); stRepaint(); } });
    var sel = $("#fai-ce-" + c.id, s2); sel.value = x.e || "";
    sel.addEventListener("change", function(){ x.e = sel.value; S.rbChk = false; api.save(); paintRb(); stRepaint(); });
  });
  function critName(id){ var c = byId(D.criteria, id); return c ? c.t.toLowerCase() : id; }
  function paintRb(){
    var chk = !!S.rbChk, all = D.criteria.every(function(c){ var x = S.rb[c.id] || {}; return x.s && x.e; });
    D.criteria.forEach(function(c){
      var box = $('[data-cr="' + c.id + '"]', s2), ok = rbOk(c), show = chk && all, e = byId(D.evidence, (S.rb[c.id] || {}).e);
      box.classList.toggle("right", show && ok); box.classList.toggle("wrong", show && !ok);
      $(".fai-dmk", box).textContent = show ? (ok ? "✓" : "✗") : "";
      $(".fai-dfb", box).innerHTML = !show || !e ? "" : ok ? fill(RM.match, { crit:c.t.toLowerCase() }) : fill(RM.off, { about:e.crit.map(critName).join(" and "), crit:c.t.toLowerCase() });
    });
    var fb = $("#fai-rbfb", s2), off = D.criteria.filter(function(c){ return !rbOk(c); }).length, tot = 0;
    D.criteria.forEach(function(c){ tot += +((S.rb[c.id] || {}).s || 0); });
    fb.innerHTML = !chk ? "" : !all ? MV.fbHTML("", RM.partial) : MV.fbHTML(off ? "bad" : "good", (off ? "<strong>✗ " + off + " of 6 evidence chips don’t match their criterion yet (marked ✗).</strong> " : "<strong>✓ Every score rests on evidence about its criterion.</strong> ") + fill(RM.total, { n:tot }));
  }
  $("#fai-rbchk", s2).addEventListener("click", function(){ S.rbChk = true; api.save(); paintRb(); stRepaint(); MV.focusFb($("#fai-rbfb", s2)); });

  // ===== Station 3: Check it with data =====
  var s3 = $("#fai-st-data", host), P = D.prices;
  s3.innerHTML = '<p class="fai-h5"><strong>Check it with data:</strong> ' + P.title + ' <span class="hfa-model">' + P.tag + '</span></p><div class="fai-pgw"><div>' +
    MV.tableHTML({ caption:P.title + " (model data)", head:["Month", "Price"], rows:P.rows.map(function(r){ return [r.m, String(r.v) + (r.note ? " (" + r.note + ")" : "")]; }) }) + "</div><div>" + priceSVG(P) + "</div></div>" +
    '<p class="fai-pask"><strong>' + P.ask + '</strong></p><div id="fai-pch"></div><div id="fai-pfb" aria-live="polite"></div>';
  radios($("#fai-pch", s3), { aria:P.ask, cls:"chips", options:P.choices.map(function(ch, i){ return { id:String(i), t:ch.t }; }), value:S.px != null ? S.px : "",
    onChange:function(v){ S.px = v; api.save(); paintPx(); stRepaint(); } });
  function paintPx(){
    var fb = $("#fai-pfb", s3); if (S.px == null || S.px === "") { fb.innerHTML = ""; return; }
    var ch = P.choices[+S.px], ok = MV.ok(ch);
    fb.innerHTML = MV.fbHTML(ok ? "good" : "bad", "<strong>" + (ok ? "✓ Right." : "✗ Not quite.") + "</strong> " + ch.fb);
  }

  function paintAll(){ stRG.set(S.st); stRepaint(); D.stations.forEach(function(s){ $("#fai-st-" + s.id, host).hidden = s.id !== S.st; }); }
  paintTl(); paintRb(); paintPx(); paintAll();
}

// ---------- Practice 2: Reading progress on SDG 2 (custom ★ set: a model data table once, then tap answers with the toolkit's
// practice multiple-choice look and N4 number entries (±0.05), retry mode and three levels of help) ----------
function sdgSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null, val:"" }); }
  function q(it){ var c = {}; for (var k in it) c[k] = it[k]; c.prompt = it.prompt + (it.star ? ' <span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>" : ""); return c; }
  function numHTML(it, i, x){
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">D' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>" +
      '<div class="numrow"><label for="fai-n-' + it.id + '">' + it.label + '</label><input class="numin" id="fai-n-' + it.id + '" data-nin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.val || "") + '"' + (x.solved ? " disabled" : "") + ">" + (it.unit ? '<span class="fai-unit">' + it.unit + "</span>" : "") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + it.why + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    return h;
  }
  function paintQ(it, i){
    var box = host.querySelector('[data-mq="' + it.id + '"]'), x = ist(it.id);
    MV.keepFocus(box, function(){ box.innerHTML = it.kind === "num" ? numHTML(it, i, x) : MV.mcHTML(q(it), x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:"D" + (i + 1), noConf:true }); });
  }
  function judge(it, raw){
    var vals = MV.parseNum(String(raw || "").replace(/[%a-zA-Z\s]/g, ""));
    if (!vals || vals.length !== 1) return { bad:true };
    var v = vals[0], ans = MV.ans(it);
    if (Math.abs(v - ans) <= it.tol + 1e-9) return { ok:true };
    var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) < 0.01; })[0];
    return { ok:false, fb:named ? named.fb : null };
  }
  host.innerHTML = '<div class="fai-dtab"><p class="fai-dtt"><span class="hfa-model">' + a.tableTag + "</span></p>" + MV.tableHTML({ head:a.head, rows:a.rows, caption:a.tableCaption + " (model data)" }) + "</div>" +
    '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q" data-mq="' + it.id + '"></div>'; }).join("");
  a.items.forEach(paintQ);
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.nin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.nin) { var b = host.querySelector('[data-k="' + e.target.dataset.nin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-mq]"); if (!box) return;
    var it = byId(a.items, box.dataset.mq), i = a.items.indexOf(it), x = ist(it.id);
    if (it.kind === "num") {
      if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
      else if (b.dataset.act === "check") {
        var r = judge(it, x.val);
        if (r.bad) msgs[it.id] = "Enter a number, such as 0.5 or 12.";
        else if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
        else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (r.fb || "Check your working and try again."); }
      } else return;
    } else {
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
      else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
      else if (b.dataset.act === "check") {
        x.checked = true;
        if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
      }
    }
    api.save(); paintQ(it, i); if (b.dataset.act === "check") MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Two places, one plan (@component twoPlacePlanner — per-place and per-phase choices that read the
// aid designer's model, a nutrition add-on, two SDG 2 target chips, a justification with word and criteria-word counts) ----------
var CRIT_RE = [/local\s+markets?/, /dignity|dignified/, /resilien(ce|t)/, /target(ing|ed)\b/, /dependen(cy|ce|t)/];
var task = (function(){
  var api = null;
  function T(){ return MV.C.task; }
  function read(s){
    s = s || (api && api.S) || {};
    var tg = (Array.isArray(s.tg) ? s.tg : []).filter(function(id){ return byId(T().targets, id); });
    return { town:T().town.indexOf(s.town) >= 0 ? s.town : "", vil:T().villages.indexOf(s.vil) >= 0 ? s.vil : "", nut:s.nut === "yes" || s.nut === "no" ? s.nut : "",
      p2:T().phase2.indexOf(s.p2) >= 0 ? s.p2 : "", tg:tg.slice(0, 2), text:String(s.text || "") };
  }
  function critUsed(text){ var t = String(text || "").toLowerCase(); return T().words.filter(function(_, i){ return CRIT_RE[i].test(t); }); }
  function checks(d){
    var wc = words(d.text), tg = d.tg;
    return [
      d.town === "A3" || d.town === "A4",
      d.vil === "A2",
      d.nut === "yes",
      d.p2 === "A6" || d.p2 === "A7",
      tg.length === 2 && tg.some(function(x){ return x === "2.1" || x === "2.2"; }) && tg.some(function(x){ return x === "2.3" || x === "2.4"; }),
      wc >= 80 && wc <= 200 && critUsed(d.text).length >= 2
    ];
  }
  function keyOf(d){ return [d.town, d.vil, d.nut, d.p2, d.tg.slice().sort().join("+")].join("|"); }
  function text(k){ var q = k.split("|"); return "Town " + q[0] + ", villages " + q[1] + ", nutrition " + q[2] + ", recovery " + q[3] + ", targets " + q[4].split("+").join(" + "); }
  function optLabel(id){ var o = opt(id); return "<strong>" + id + "</strong> " + o.short; }
  function line(id, sit, keys){
    if (!id) return '<span class="muted">not chosen yet</span>';
    var o = opt(id), c = o[sit], L = EX().levels, bits = [];
    keys.forEach(function(k){
      if (k === "w") bits.push(wk(c.w));
      if (k === "reach") bits.push("reaches now: " + c.reachT);
      if (k === "mk") bits.push("local farmers and shops: " + (c.mk === "hurts" ? mkTag("hurts") + " " + c.mkT.replace(/^Hurts\s*/, "") : c.mkT));
      if (k === "res") bits.push("resilience: " + L.res[c.res]);
    });
    return optLabel(id) + ' <span class="tiny">(' + sit + " model: " + bits.join("; ") + ")</span>";
  }
  function paint(){
    var d = read(), el = $("#fai-tplan"); if (!el) return;
    var wc = words(d.text), used = critUsed(d.text);
    el.innerHTML = '<div class="fai-tcard"><h4 class="fai-h4">Your plan for Ruvara</h4><dl class="read">' +
      "<div><dt>Phase 1, town</dt><dd>" + line(d.town, "S1", ["w", "reach", "mk"]) + "</dd></div>" +
      "<div><dt>Phase 1, villages</dt><dd>" + line(d.vil, "S2", ["w", "reach", "mk"]) + "</dd></div>" +
      "<div><dt>Nutrition add-on (A5)</dt><dd>" + (d.nut ? (d.nut === "yes" ? "Yes: children under 5 and pregnant or breastfeeding people" : "No") : '<span class="muted">not chosen yet</span>') + "</dd></div>" +
      "<div><dt>Phase 2, recovery</dt><dd>" + line(d.p2, "S3", ["mk", "res"]) + "</dd></div>" +
      "<div><dt>SDG 2 targets</dt><dd>" + (d.tg.length ? d.tg.map(function(id){ return byId(T().targets, id).t; }).join("<br>") : '<span class="muted">none yet</span>') + "</dd></div>" +
      "<div><dt>Justification</dt><dd>" + wc + " words (80–200); criteria words: " + (used.length ? used.join(", ") : "none yet") + "</dd></div></dl></div>";
    $("#fai-wc").textContent = wc + " words (80–200) · criteria words used: " + used.length;
    $$("#fai-ttg [data-tg]").forEach(function(b){ var on = d.tg.indexOf(b.dataset.tg) >= 0; b.setAttribute("aria-pressed", on); b.disabled = !on && d.tg.length >= 2; b.innerHTML = (on ? "✓ " : "+ ") + byId(T().targets, b.dataset.tg).t; });
    $("#fai-ttgn").textContent = d.tg.length >= 2 ? "Two chosen: tap one to remove it before adding another." : d.tg.length + " of 2 chosen.";
    var mh = $("#fai-tmodels");
    mh.innerHTML = checks(d).every(Boolean) ? '<details class="alg fai-models"><summary>' + T().modelsTitle + "</summary>" + T().models.map(function(m){ return '<h5 class="fai-h5">' + m.title + '</h5><p class="fai-mtext">' + m.text + "</p>"; }).join("") + "</details>" : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S, TK = T(); s.tg = Array.isArray(s.tg) ? s.tg : [];
      function aidOpts(list){ return list.map(function(id){ return { id:id, t:optLabel(id) }; }); }
      inp.innerHTML = '<div class="fai-tin"><div id="fai-ttown"></div><div id="fai-tvil"></div><div id="fai-tnut"></div><div id="fai-tp2"></div>' +
        '<div class="fai-rgw fai-ttgw"><span class="fai-rgl">SDG 2 targets this plan serves (choose 2)</span><div class="fai-chipset multi" id="fai-ttg" role="group" aria-label="SDG 2 targets, choose 2">' +
          TK.targets.map(function(t){ return '<button type="button" aria-pressed="false" data-tg="' + t.id + '" data-k="ttg' + t.id.replace(".", "") + '"></button>'; }).join("") + '</div><p class="tiny muted" id="fai-ttgn" aria-live="polite"></p></div>' +
        '<div class="jq fai-tjq"><label for="fai-just">' + TK.justLabel + '</label><textarea id="fai-just" class="fai-just"></textarea><p class="tiny muted" id="fai-wc" aria-live="polite"></p></div></div>';
      pv.innerHTML = '<div class="fai-tpv"><div id="fai-tplan" aria-live="polite"></div><div id="fai-tmodels"></div></div>';
      function upd(){ a.save(); paint(); a.update(); }
      radios($("#fai-ttown"), { label:"Phase 1, town (markets working, prices high)", aria:"Phase 1, town", cls:"chips", options:aidOpts(TK.town), value:s.town || "", onChange:function(v){ s.town = v; upd(); } });
      radios($("#fai-tvil"), { label:"Phase 1, villages (shops empty, road washed out)", aria:"Phase 1, villages", cls:"chips", options:aidOpts(TK.villages), value:s.vil || "", onChange:function(v){ s.vil = v; upd(); } });
      radios($("#fai-tnut"), { label:"Phase 1, nutrition add-on (A5)", aria:"Phase 1, nutrition add-on", cls:"chips", options:[{ id:"yes", t:"Yes" }, { id:"no", t:"No" }], value:s.nut || "", onChange:function(v){ s.nut = v; upd(); } });
      radios($("#fai-tp2"), { label:"Phase 2 (recovery, after the rains)", aria:"Phase 2, recovery", cls:"chips", options:aidOpts(TK.phase2), value:s.p2 || "", onChange:function(v){ s.p2 = v; upd(); } });
      $("#fai-ttg").addEventListener("click", function(e){
        var b = e.target.closest("[data-tg]"); if (!b || b.disabled) return;
        var id = b.dataset.tg, k = s.tg.indexOf(id);
        if (k >= 0) s.tg.splice(k, 1); else if (s.tg.length < 2) s.tg.push(id);
        upd(); b.focus({ preventScroll:true });
      });
      var ta = $("#fai-just"); ta.value = s.text || "";
      ta.addEventListener("input", function(){ s.text = ta.value; upd(); });
      paint();
    },
    read:function(){ return read(); },
    valid:function(d){ return d.town && d.vil && d.nut && d.p2 && d.tg.length === 2 ? true : "Choose help for the town, the villages, the nutrition add-on and the recovery phase, and two SDG 2 targets first."; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(text(k)); },
    text:text,
    summary:function(ts){
      var f = ts.found || [], d = read(ts.app || {}), L = [T().summary + ": " + (f.length ? "solved (" + f.map(text).join("; ") + ")" : "not solved yet")];
      if (d.text.trim()) { L.push("  Justification:"); d.text.trim().split(/\r?\n/).forEach(function(l){ L.push("    " + l); }); }
      return L;
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ sdg:sdgSet },
  task:task
});
})();
