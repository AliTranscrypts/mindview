// Boot: app.js registers its hooks with MV.module({...}); the page then calls MV.start().
(function(){
"use strict";
var MV = window.MV, $ = MV.$;
MV.APP = {};
MV.module = function(hooks){ MV.APP = hooks || {}; };

// Standard centrepiece layout from the reference (graph + caption + banner left, controls under it, readout right).
// MV.pgLayout(host, {shape:"square"|"wide"|"nl", aria:"…"}) -> {graph, cap, banner, canvas, ctrl, read}
MV.pgLayout = function(host, o){
  o = o || {};
  host.innerHTML = '<div class="pg"><div class="pg-graph" data-mv="graph"><div class="eq-cap" aria-live="polite"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="plot-wrap"><canvas class="plot' + (o.shape ? " " + o.shape : "") + '" role="img" aria-label="' + MV.esc(o.aria || "Graph") + '"></canvas></div></div>' +
    '<div class="pg-ctrl"></div><div class="pg-read"><dl class="read" aria-live="polite"></dl></div></div>';
  return { graph:$(".pg-graph", host), cap:$(".eq-cap", host), banner:$(".banner", host), canvas:$("canvas", host), ctrl:$(".pg-ctrl", host), read:$("dl.read", host) };
};
// Readout rows: [[label, html], ...] -> <div><dt>…</dt><dd>…</dd></div>
MV.readoutHTML = function(rows){ return rows.map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join(""); };

var SKIP = { id:1, skill:1, cat:1, type:1, slug:1, topic:1, store:1, _a:1, _k:1, _n:1, ver:1, answer:1, icon:1 };
function mdWalk(o, key){
  if (typeof o === "string") return SKIP[key] ? o : MV.md(o);
  if (Array.isArray(o)) return o.map(function(x){ return mdWalk(x, key); });
  if (o && typeof o === "object") { var r = {}; Object.keys(o).forEach(function(k){ r[k] = mdWalk(o[k], k); }); return r; }
  return o;
}
MV.mdWalk = mdWalk;
function safe(name, fn){ try { fn(); } catch (e) { console.error("[" + name + "]", e); } }

MV.start = function(){
  var P = window.MV_PAYLOAD;
  MV.meta = P.meta; MV.course = P.course; MV.salt = P.salt;
  MV.C = mdWalk(P.content);
  MV.V = MV.views();
  MV.S = MV.loadState(MV.meta.storageKey);
  var A = MV.APP, C = MV.C;
  document.title = MV.plain(C.title) + ": " + MV.meta.code + " Learning Module";
  MV.renderShell();
  MV.watchPageNav();
  MV.paintThemeBtn();
  $("#theme-btn").addEventListener("click", function(){ MV.toggleTheme(); MV.redrawAll(); });
  MV.testStorage();
  MV.initRouter();
  safe("goals", MV.initGoals);
  safe("warm-up", MV.initWarm);
  safe("writes", MV.initWrites);
  if (A.hero && $("#hero-plot")) safe("hero", function(){ A.hero({ canvas:$("#hero-plot"), cap:$("#hero-cap"), fig:$(".hero-fig") }); });
  else if (A.hero && $(".hero-fig")) safe("hero", function(){ A.hero({ canvas:null, cap:$("#hero-cap"), fig:$(".hero-fig") }); });
  if (C.kind === "review") {
    if (A.connect) safe("connect", function(){ MV.CN = A.connect($("#connect-app"), { S:(MV.S.app.connect = MV.S.app.connect || {}), save:MV.save, changed:MV.changed, content:C.connect }) || {}; });
    safe("connect activities", function(){ MV.initActivities((C.connect || {}).activities); });
    safe("mixed practice", function(){ MV.initActivities((C.mixed || {}).activities); });
  } else {
    safe("explore", function(){
      var host = $("#ex-app");
      MV.EX = A.explore ? (A.explore(host, { S:(MV.S.app.explore = MV.S.app.explore || {}), save:MV.save, changed:MV.changed, banner:MV.banner, content:C.explore }) || {}) : {};
      if (!$("[data-mv=banner]", host)) { var b = document.createElement("p"); b.className = "banner"; b.id = "ex-banner"; b.setAttribute("aria-live", "polite"); host.parentNode.insertBefore(b, host); }
    });
    safe("predictions", MV.initPredictions);
    safe("challenges", MV.initChallenges);
    if (A.part3) safe("part 3", function(){ MV.P3 = A.part3($("#p3-app"), { S:(MV.S.app.part3 = MV.S.app.part3 || {}), save:MV.save, changed:MV.changed, content:C.part3 }) || {}; });
    safe("quick check", MV.initQuickCheck);
    safe("practice", function(){ MV.initActivities((C.practice || {}).activities); });
  }
  safe("journal", MV.initJournal);
  safe("art", MV.initArt);
  safe("final", MV.initFinal);
  safe("task", MV.initTask);
  safe("summary", MV.initSummary);
  safe("cards", MV.initCards);
  safe("reset", MV.initReset);
  var startView = location.hash.slice(1);
  MV.show(MV.V.list.indexOf(startView) >= 0 ? startView : (MV.S.last || "start"), false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(MV.redrawAll);
  if (window.matchMedia) { var mq = window.matchMedia("(prefers-color-scheme: dark)"); if (mq.addEventListener) mq.addEventListener("change", function(){ MV.paintThemeBtn(); MV.redrawAll(); }); }
  new MutationObserver(MV.redrawAll).observe(document.documentElement, { attributes:true, attributeFilter:["data-theme", "class"] });
  MV.save();
};
})();
