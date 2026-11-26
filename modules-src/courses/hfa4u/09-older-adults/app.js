// HFA4U 09 Older Adult Nutrition: hero (balance storyboard), The ageing body explorer (Explore: F6 life-stage switcher with an
// age dial and situation switches, a seven-card systems wheel, and the F1/F2 meal planner with a 30-item pool and a flags strip;
// predictions; challenges), Design for an older adult (Part 3: texture, nutrient-density and budget stations with "Check it
// with data", kitchen card) and "A good day for…" (task: the same planner for a chosen persona, plus a kitchen-card dish).
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function money(v){ return "$" + (Math.round(v * 100) / 100).toFixed(2); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 06; per-option class, custom layout class, function labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips"|<custom → class oa-<custom>>, onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "oa-chipset" : o.cls && o.cls !== "seg" ? "oa-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="oa-rgw">' + (lab ? '<span class="oa-rgl">' + lab + "</span>" : "") + '<span class="oa-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
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

// ---------- @component switchBtn — an on/off switch (role="switch" button with a visible On/Off word; colour never alone) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="oa-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="oa-swt" aria-hidden="true"><i></i></span><span class="oa-swl">' + label + '</span><span class="oa-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// small inline icons (stroke-only, currentColor; never the only signal)
var ICO = {
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  ok:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  tooth:'<path d="M7 3c-3 0-4 3-3 7 1 3 1.5 6 2.5 10 .5 1.5 2 1.5 2.5 0l1.5-5h3l1.5 5c.5 1.5 2 1.5 2.5 0 1-4 1.5-7 2.5-10 1-4 0-7-3-7-2 0-3 1-5 1S9 3 7 3z"/>',
  leaf:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19l9-9"/>',
  b12:'<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/>',
  dumb:'<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>',
  bone:'<path d="M7 5a2.5 2.5 0 0 0-4 3 2.5 2.5 0 0 0 3 4l6 6a2.5 2.5 0 0 0 4 3 2.5 2.5 0 0 0 3-4 2.5 2.5 0 0 0-3-3l-6-6a2.5 2.5 0 0 0-3-3z"/>',
  drop:'<path d="M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z"/>',
  people:'<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c0-3.5 2.5-6 5-6s5 2.5 5 6M11 20c0-3.5 2.5-6 5-6s5 2.5 5 6"/>'
};
var SYSICO = { mouth:"tooth", taste:"leaf", stomach:"b12", muscles:"dumb", bones:"bone", kidneys:"drop", mood:"people" };
function ico(k, cls){ return '<svg class="oa-ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICO[k] + "</svg>"; }

// ---------- data helpers (content.explore; Health Canada DRI values from the plan, VERIFY in content.mjs) ----------
function EX(){ return MV.C.explore; }
function pers(id){ return byId(EX().personas, id) || EX().personas[0]; }
function food(id){ return byId(EX().pool, id); }
function vitD(a){ return a >= 71 ? 20 : 15; }
function vitDtxt(a){ var v = vitD(a); return v + " µg (" + v * 40 + " IU) per day (" + (a >= 71 ? "age 71+" : a >= 51 ? "ages 51–70" : "ages 31–50") + ")"; }
// VERIFY: calcium 1000 mg at age 50 (31–50 group) is a module-supplied value; the plan gives the 51+ values.
function calc(a, sex){ if (a <= 50) return 1000; if (sex === "f") return 1200; return a >= 71 ? 1200 : 1000; }
function calcTxt(a, sex){
  if (sex) return calc(a, sex) + " mg per day (" + (sex === "f" ? (a <= 50 ? "women 31–50" : "women 51+") : (a <= 50 ? "men 31–50" : a >= 71 ? "men 71+" : "men 51–70")) + ")";
  return "Women " + calc(a, "f") + " mg · men " + calc(a, "m") + " mg per day (" + (a <= 50 ? "ages 31–50" : a >= 71 ? "age 71+" : "ages 51–70") + ")";
}
// VERIFY: qualitative energy bands (no numbers): about the same to 55, a little lower 60–70, usually lower from 75.
function band(a){ return a <= 55 ? "same" : a <= 70 ? "little" : "lower"; }
function plateScale(a){ return { same:1, little:0.86, lower:0.72 }[band(a)]; }
// schematic thirst-signal level (bar only, never shown as a number)
function thirstLvl(a){ return a <= 60 ? 1 : clamp(1 - (a - 60) * 0.018, 0.4, 1); }
function readRows(ctx){
  var X = EX(), R = X.rows, a = ctx.age, T = ctx.tog;
  var fl = X.toggles.filter(function(t){ return T[t.id]; }).map(function(t){ return X.flags[t.id]; });
  return [
    ctx.persona ? ["who", "Persona", "<strong>" + ctx.persona.t + "</strong>, " + ctx.persona.age] : ["who", "Age", "<strong>" + a + "</strong> years"],
    ["energy", R.energy.t, R.energy[band(a)]],
    ["vitd", R.vitd.t, vitDtxt(a)],
    ["supp", R.supp.t, R.supp.txt],   // plan: shown at age 50 and over (the dial starts at 50; every persona is over 50)
    ["calcium", R.calcium.t, calcTxt(a, ctx.sex)],
    ["b12", R.b12.t, T.med ? R.b12.med : R.b12.base],
    ["protein", R.protein.t, R.protein.txt],
    ["thirst", R.thirst.t, a >= 65 ? R.thirst.weak : R.thirst.usual],
    ["flags", R.flags.t, fl.length ? '<ul class="oa-flagl">' + fl.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>" : X.flags.none]
  ];
}
function readHTML(rows, lit){ return rows.map(function(r){ return '<div class="' + (lit.indexOf(r[0]) >= 0 ? "oa-lit" : "") + '" data-row="' + r[0] + '"><dt>' + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join(""); }
function sysReasons(a, T){
  var R = EX().reasons;
  return {
    mouth:T.chew ? [R.chew] : [],
    taste:(a >= 70 ? [R.taste70] : []).concat(T.med ? [R.med] : []),
    stomach:[R.b12].concat(T.med ? [R.med] : []),
    muscles:a >= 75 ? [R.musc75] : a >= 60 ? [R.musc60] : [],
    bones:[R.bone50].concat(a >= 71 ? [R.bone71] : [], T.winter ? [R.winter] : []),
    kidneys:a >= 65 ? [R.thirst65] : [],
    mood:(T.alone ? [R.alone] : []).concat(T.income ? [R.income] : [])
  };
}

// ---------- plan evaluation (shared by the Explore planner, the challenges and the task) ----------
function blankPlan(){ return { b:[], l:[], s1:[], d:[], s2:[], supp:false }; }
function normPlan(P){
  var out = blankPlan(); P = P || {};
  EX().slots.forEach(function(sl){ out[sl.id] = (Array.isArray(P[sl.id]) ? P[sl.id] : []).filter(function(id){ return food(id); }).slice(0, 4); });
  out.supp = !!P.supp; return out;
}
function clonePlan(P){ return normPlan(JSON.parse(JSON.stringify(P || {}))); }
function evalPlan(P, per){
  var SL = EX().slots, by = {}, all = [];
  SL.forEach(function(sl){ var it = (P[sl.id] || []).map(food).filter(Boolean); by[sl.id] = it; all = all.concat(it); });
  var r = { by:by, all:all, prot:{}, ca:0, dFood:0, b12:0, b12df:0, fl:0, cost:0, simple:0, notSoft:[], meatFish:[], eggs:false };
  SL.forEach(function(sl){ if (sl.meal) r.prot[sl.id] = by[sl.id].some(function(x){ return x.p; }); });
  r.protAll = SL.filter(function(sl){ return sl.meal; }).every(function(sl){ return r.prot[sl.id]; });
  all.forEach(function(x){
    if (x.ca) r.ca++; r.dFood += x.d; if (x.b12) r.b12++; if (x.b12 === "dairy" || x.b12 === "fortified") r.b12df++;
    if (x.fl) r.fl++; r.cost += x.cost; if (x.simple) r.simple++; if (x.tex !== "soft") r.notSoft.push(x); if (x.meat || x.fish) r.meatFish.push(x); if (x.egg) r.eggs = true;
  });
  r.cost = Math.round(r.cost * 100) / 100;
  r.rda = vitD(per.age); r.need = r.rda - 10; r.supp = !!P.supp; r.dTot = r.dFood + (r.supp ? 10 : 0); r.dOk = r.supp && r.dFood >= r.need;
  return r;
}
// task line 5 / persona fit (plan's exact tests)
function fits(r, pid){
  if (pid === "ruth") return r.all.length > 0 && !r.notSoft.length;
  if (pid === "gurdeep") return r.all.length > 0 && !r.meatFish.length && !r.eggs && r.b12df >= 3;
  return r.all.length > 0 && r.cost <= EX().budget + 1e-9 && r.simple >= 3;
}
function uniq(list){ var seen = {}; return list.filter(function(x){ if (seen[x.id]) return false; seen[x.id] = 1; return true; }); }

// ---------- @component F2 dayPlanner — five meal slots, the 30-item food pool (tag chips, "ticks n of 5 boxes"), texture and
// diet filters, "Add to <slot>" buttons, a vitamin D supplement switch, a flags strip (protein at meals, calcium, vitamin D,
// B12, fluids, texture, cost) and a cost bar. Shared by Explore (Meal planner) and the task. Model data; no Calories. ----------
//   dayPlanner({key, hosts:{day, flags, pool}, plan(), persona(), ui (persisted {slot, tex, diet}), fx() -> {lit:[], mark}, changed(), save()})
function texTag(x){ return '<span class="oa-tag oa-tex-' + x.tex + '">' + (x.tex === "hard" ? ico("warn") + "hard to chew" : x.tex) + "</span>"; }
function tagsOf(x){
  var t = [texTag(x)];
  if (x.p) t.push('<span class="oa-tag oa-tp">protein</span>');
  if (x.ca) t.push('<span class="oa-tag oa-tm">calcium-rich' + (x.caNote ? " (" + x.caNote + ")" : "") + "</span>");
  if (x.d) t.push('<span class="oa-tag oa-tm">vitamin D ' + x.d + " µg</span>");
  if (x.b12) t.push('<span class="oa-tag oa-tm">B12: ' + x.b12 + "</span>");
  if (x.fl) t.push('<span class="oa-tag oa-tw">fluid-rich</span>');
  if (!x.meat && !x.fish) t.push('<span class="oa-tag">' + (x.egg ? "vegetarian" : "lacto-vegetarian") + "</span>");
  if (x.halal) t.push('<span class="oa-tag">halal option</span>');
  if (x.simple) t.push('<span class="oa-tag">no-cook or simple</span>');
  if (x.takeout) t.push('<span class="oa-tag">takeout</span>');
  t.push('<span class="oa-tag oa-tcost">' + money(x.cost) + "</span>");
  return t.join("");
}
function ticks(x){ return [x.p, x.ca, x.d > 0, !!x.b12, x.fl].filter(Boolean).length; }
function dayPlanner(o){
  var X = EX(), SL = X.slots, ui = o.ui, H = o.hosts, msg = "", rg = {};
  ui.slot = byId(SL, ui.slot) ? ui.slot : "b"; ui.tex = ui.tex === "soft" ? "soft" : "any"; ui.diet = /^(veg|lacto)$/.test(ui.diet) ? ui.diet : "any";
  function slotT(id){ return byId(SL, id).t; }
  if (H.pool) {
    H.pool.innerHTML = '<h5 class="oa-h5">Food pool <span class="hfa-model">Model data</span></h5><p class="tiny muted oa-pnote">' + X.modelNote + " “Ticks” counts the boxes each food ticks: protein, calcium, vitamin D, B12, fluid.</p>" +
      '<div data-rgs></div><div data-rgt></div><div data-rgd></div><p class="oa-mini" data-mini aria-live="polite"></p><div class="oa-pool" data-pool role="group" aria-label="Food pool"></div>';
    rg.slot = radios($("[data-rgs]", H.pool), { label:"Add to", cls:"chips", options:SL.map(function(s){ return { id:s.id, t:s.t }; }), value:ui.slot, onChange:function(v){ ui.slot = v; msg = ""; o.save(); paint(); } });
    rg.tex = radios($("[data-rgt]", H.pool), { label:"Texture", cls:"chips", options:[{ id:"any", t:"Any texture" }, { id:"soft", t:"Soft only" }], value:ui.tex, onChange:function(v){ ui.tex = v; o.save(); paint(); } });
    rg.diet = radios($("[data-rgd]", H.pool), { label:"Diet", cls:"chips", options:[{ id:"any", t:"Any" }, { id:"veg", t:"Vegetarian" }, { id:"lacto", t:"Lacto-vegetarian" }], value:ui.diet, onChange:function(v){ ui.diet = v; o.save(); paint(); } });
    H.pool.addEventListener("click", function(e){
      var b = e.target.closest("[data-add]"); if (!b || b.disabled) return;
      var P = o.plan(), list = P[ui.slot], x = food(b.dataset.add);
      if (list.length >= 4) { msg = slotT(ui.slot) + " already has 4 foods. Remove one, or choose another slot."; paint(); return; }
      list.push(x.id); msg = "Added " + MV.plain(x.t) + " to " + lc(slotT(ui.slot)) + ".";
      o.changed();
    });
  }
  if (H.day) H.day.addEventListener("click", function(e){
    var b = e.target.closest("[data-rm]"); if (!b) return;
    var q = b.dataset.rm.split("|"), list = o.plan()[q[0]]; list.splice(+q[1], 1); msg = "";
    o.changed();
    var nb = H.day.querySelector('[data-slot="' + q[0] + '"] [data-rm]') || H.day.querySelector("[data-rm]"); if (nb) nb.focus({ preventScroll:true });
  });
  if (H.flags) H.flags.addEventListener("click", function(e){ var b = e.target.closest("[data-supp]"); if (!b) return; var P = o.plan(); P.supp = !P.supp; o.changed(); });
  function show(x){
    if (ui.tex === "soft" && x.tex !== "soft") return false;
    if (ui.diet === "veg" && (x.meat || x.fish)) return false;
    if (ui.diet === "lacto" && (x.meat || x.fish || x.egg)) return false;
    return true;
  }
  function flagsHTML(r, per, lit){
    function li(key, ok, html){ return '<li class="' + (ok ? "yes" : "no") + (lit.indexOf(key) >= 0 ? " oa-lit" : "") + '" data-fl="' + key + '"><span class="oa-mk" aria-hidden="true">' + (ok ? "✓" : "○") + "</span><span>" + html + '<span class="vh">' + (ok ? " (met)" : " (not met)") + "</span></span></li>"; }
    var meals = SL.filter(function(s){ return s.meal; }), gd = per.id === "gurdeep";
    var h = '<ul class="oa-fl">';
    h += li("prot", r.protAll, "Protein at every meal <small>(" + meals.map(function(s){ return lc(s.t) + " " + (r.prot[s.id] ? "✓" : "○"); }).join(", ") + ")</small>");
    h += li("ca", r.ca >= 3, "Calcium-rich items: <strong>" + r.ca + "</strong> <small>(3 or more)</small>");
    h += li("vitd", r.dOk, "Vitamin D: food <strong>" + r.dFood + " µg</strong>" + (r.supp ? " + supplement 10 µg = <strong>" + r.dTot + " µg</strong>" : ", supplement note off") + " <small>(RDA " + r.rda + " µg)</small>");
    h += li("b12", (gd ? r.b12df : r.b12) >= 3, "B12 sources" + (gd ? " (dairy or fortified)" : "") + ": <strong>" + (gd ? r.b12df : r.b12) + "</strong> <small>(3 or more)</small>");
    h += li("fl", r.fl >= 4, "Fluid-rich items: <strong>" + r.fl + "</strong> <small>(4 or more)</small>");
    var ns = uniq(r.notSoft);
    h += li("tex", r.all.length > 0 && !ns.length, r.all.length ? (ns.length ? "Texture: not soft: " + ns.map(function(x){ return lc(MV.plain(x.t)); }).join(", ") : "Texture: all soft") : "Texture: no foods yet");
    if (gd) { var bad = uniq(r.meatFish.concat(r.all.filter(function(x){ return x.egg; }))); h += li("diet", r.all.length > 0 && !bad.length, bad.length ? "Lacto-vegetarian: remove " + bad.map(function(x){ return lc(MV.plain(x.t)); }).join(", ") : "Lacto-vegetarian: no meat, fish or eggs"); }
    if (per.id === "harold") h += li("simple", r.simple >= 3, "No-cook or simple items: <strong>" + r.simple + "</strong> <small>(3 or more)</small>");
    return h + "</ul>";
  }
  function costHTML(r, per){
    var max = 12, hb = per.id === "harold", B = X.budget, over = hb && r.cost > B + 1e-9;
    return '<div class="oa-cost' + (over ? " over" : "") + '"><p class="oa-costt">Day cost (model): <strong>' + money(r.cost) + "</strong>" + (hb ? " of Harold’s " + money(B) + " budget" + (over ? " · over by " + money(r.cost - B) : " ✓") : "") + "</p>" +
      '<span class="oa-cbar" aria-hidden="true"><i style="width:' + f1(clamp(r.cost / max, 0, 1) * 100) + '%"></i>' + (hb ? '<b style="left:' + f1(B / max * 100) + '%"></b>' : "") + "</span></div>";
  }
  function paint(){
    var P = o.plan(), per = o.persona(), r = evalPlan(P, per), F = o.fx ? o.fx() : {}, lit = F.lit || [], mk = F.mark || null;
    if (H.day) MV.keepFocus(H.day, function(){
      H.day.innerHTML = '<div class="oa-day">' + SL.map(function(sl){
        var it = r.by[sl.id];
        return '<div class="oa-slot' + (sl.id === ui.slot ? " cur" : "") + '" data-slot="' + sl.id + '"><div class="oa-slh"><strong>' + sl.t + "</strong>" + (sl.meal ? '<span class="tiny ' + (r.prot[sl.id] ? "oa-pok" : "muted") + '">' + (r.prot[sl.id] ? "protein ✓" : "needs protein") + "</span>" : "") + "</div>" +
          (it.length ? '<ul class="oa-sli">' + it.map(function(x, i){
            var m = mk && mk.slot === sl.id && mk.id === x.id;
            return '<li class="' + (m ? "oa-mkd" : "") + '"><span class="oa-sln">' + x.t + (x.tex !== "soft" ? " " + texTag(x) : "") + '</span><button type="button" class="oa-rm" data-rm="' + sl.id + "|" + i + '" data-k="' + o.key + "rm" + sl.id + i + '" aria-label="' + esc("Remove " + MV.plain(x.t) + " from " + lc(sl.t)) + '">×</button></li>';
          }).join("") + "</ul>" : '<p class="tiny muted oa-sle">Empty</p>') + "</div>";
      }).join("") + "</div>";
    });
    if (H.flags) MV.keepFocus(H.flags, function(){
      H.flags.innerHTML = '<div class="oa-supw">' + switchHTML(o.key + "supp", X.supplement, P.supp, 'data-supp="1"') + "</div>" +
        '<div class="oa-flw" aria-live="polite"><p class="oa-flt">What this day meets <span class="hfa-model">Model data</span></p>' + flagsHTML(r, per, lit) + costHTML(r, per) + "</div>";
    });
    if (H.pool) {
      rg.slot.set(ui.slot); rg.tex.set(ui.tex); rg.diet.set(ui.diet);
      var full = P[ui.slot].length >= 4;
      $("[data-mini]", H.pool).innerHTML = "Adding to <strong>" + slotT(ui.slot) + "</strong> (" + P[ui.slot].length + " of 4 foods) · day cost " + money(r.cost) + (msg ? '<span class="oa-msg"> ' + esc(msg) + "</span>" : "");
      var pool = $("[data-pool]", H.pool), list = X.pool.filter(show);
      MV.keepFocus(pool, function(){
        pool.innerHTML = list.length ? list.map(function(x){
          var n = ticks(x);
          return '<div class="oa-fi"><div class="oa-fib"><span class="oa-fin">' + x.t + '</span><span class="oa-tags">' + tagsOf(x) + '</span><span class="tiny oa-ticks">Ticks ' + n + " of 5 boxes</span></div>" +
            '<button type="button" class="btn ghost sm" data-add="' + x.id + '" data-k="' + o.key + "add" + x.id + '"' + (full ? " disabled" : "") + ' aria-label="' + esc("Add " + MV.plain(x.t) + " to " + lc(slotT(ui.slot))) + '">Add to ' + lc(slotT(ui.slot)) + "</button></div>";
        }).join("") : '<p class="tiny muted">No foods match these filters.</p>';
      });
    }
  }
  return { paint:paint };
}

// ---------- hero (storyboard: the age dial turns 50 → 85; the energy weight shrinks; the vitamin D, calcium, B12 and protein
// weights stay the same or grow, so the balance tips toward nutrients; a plate slides in; caption) ----------
function heroSVG(st){
  var a = st.age, u = (a - 50) / 35, se = lerp(1, 0.72, u), dS = a >= 71 ? 1.3 : 1, pS = lerp(1, 1.15, u);
  var th = ((1 - se) * 24 + (dS - 1) * 6) * Math.PI / 180, h = "";
  // age dial
  var cx = 70, cy = 74, R = 42;
  function pt(age, r){ var p = Math.PI + (age - 50) / 35 * Math.PI; return [cx + r * Math.cos(p), cy + r * Math.sin(p)]; }
  h += '<path class="oa-hdial" d="M' + (cx - R) + " " + cy + "A" + R + " " + R + " 0 0 1 " + (cx + R) + " " + cy + '"/>';
  [50, 60, 70, 80].forEach(function(t){ var p = pt(t, R - 5), q = pt(t, R + 5), l = pt(t, R + 15); h += '<line class="oa-htick" x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"/>' + svgT(l[0], l[1] + 4, t, "oa-hs"); });
  var n = pt(a, R - 9);
  h += '<line class="oa-hneedle" x1="' + cx + '" y1="' + cy + '" x2="' + f1(n[0]) + '" y2="' + f1(n[1]) + '"/><circle class="oa-hhub" cx="' + cx + '" cy="' + cy + '" r="4"/>' + svgT(cx, cy + 22, "Age " + Math.round(a), "oa-hl");
  // balance
  var px = 320, py = 76, L = 140, c = Math.cos(th), s = Math.sin(th), lx = px - L * c, ly = py - L * s, rx = px + L * c, ry = py + L * s;
  h += '<rect class="oa-hbase" x="' + (px - 40) + '" y="246" width="80" height="8" rx="3"/><line class="oa-hpost" x1="' + px + '" y1="' + (py + 14) + '" x2="' + px + '" y2="246"/>' +
    '<path class="oa-hfulc" d="M' + (px - 11) + " " + (py + 16) + "L" + (px + 11) + " " + (py + 16) + "L" + px + " " + py + 'Z"/>';
  h += '<line class="oa-hbeam" x1="' + f1(lx) + '" y1="' + f1(ly) + '" x2="' + f1(rx) + '" y2="' + f1(ry) + '"/><circle class="oa-hhub" cx="' + px + '" cy="' + py + '" r="5"/>';
  function pan(x, y, w){ return '<line class="oa-hstr" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x - w + 6) + '" y2="' + f1(y + 46) + '"/><line class="oa-hstr" x1="' + f1(x) + '" y1="' + f1(y) + '" x2="' + f1(x + w - 6) + '" y2="' + f1(y + 46) + '"/>' +
    '<path class="oa-hpan" d="M' + f1(x - w) + " " + f1(y + 46) + "H" + f1(x + w) + "Q" + f1(x) + " " + f1(y + 66) + " " + f1(x - w) + " " + f1(y + 46) + 'Z"/>'; }
  h += pan(lx, ly, 48) + pan(rx, ry, 56);
  var ew = 58 * se, eh = 40 * se;
  h += '<rect class="oa-hen" x="' + f1(lx - ew / 2) + '" y="' + f1(ly + 46 - eh) + '" width="' + f1(ew) + '" height="' + f1(eh) + '" rx="4"/>' + svgT(lx, ly + 46 - eh / 2 + 4.5, "Energy", "oa-hw");
  var W = [["D", dS, "oa-hnu"], ["Ca", 1, "oa-hnu"], ["B12", 1, "oa-hnu"], ["P", pS, "oa-hpr"]], x0 = rx - 52;
  W.forEach(function(w, i){ var hh = 30 * w[1], x = x0 + i * 26.5; h += '<rect class="' + w[2] + '" x="' + f1(x) + '" y="' + f1(ry + 46 - hh) + '" width="24" height="' + f1(hh) + '" rx="3"/>' + svgT(x + 12, ry + 46 - hh / 2 + 4, w[0], "oa-hw"); });
  h += svgT(lx, ly + 86, "Energy needed", "oa-hl") + svgT(rx, ry + 86, "Nutrients needed", "oa-hl") + svgT(536, ry + 103, "D vitamin D · Ca calcium", "oa-hs", "end") + svgT(536, ry + 119, "B12 vitamin B12 · P protein", "oa-hs", "end");
  // plate
  if (st.plate > 0) {
    var X = lerp(-90, 92, st.plate), Y = 222;
    h += '<g transform="translate(' + f1(X) + " " + Y + ')"><circle class="oa-hrim" r="44"/><circle class="oa-hin" r="34"/>' +
      '<circle class="oa-hsoup" cx="-11" cy="-6" r="16"/><circle class="oa-hsoupd" cx="-15" cy="-9" r="2"/><circle class="oa-hsoupd" cx="-6" cy="-3" r="2"/><circle class="oa-hsoupd" cx="-12" cy="0" r="2"/>' +
      '<path class="oa-horange" d="M2 20a9 9 0 0 1 18 0z"/><path class="oa-horange" d="M-14 22a8 8 0 0 1 16 0z"/>' +
      '<path class="oa-hmilk" d="M14 -28h14l-2 30h-10z"/></g>';
    h += '<g style="opacity:' + f1(clamp(st.plate * 2 - 1, 0, 1)) + '">' + svgT(X + 54, 206, "lentil soup", "oa-hs", "start") + svgT(X + 54, 223, "fortified milk", "oa-hs", "start") + svgT(X + 54, 240, "orange slices", "oa-hs", "start") + "</g>";
  }
  return h;
}
function hero(f){
  var host = $("#oa-hero"); if (!host) return;
  var Hc = MV.C.hero, st = { age:50, plate:0 };
  host.innerHTML = '<svg class="oa-hsvg" viewBox="0 0 540 266" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.textContent = Hc.caption; f.cap.classList.add("oa-cap"); } }
  if (MV.reduceMotion) { st = { age:85, plate:1 }; draw(); cap(); return; }
  draw();
  MV.wait(500, function(){ MV.tween({ dur:2800, ease:function(t){ return t; }, step:function(t){ st.age = 50 + 35 * t; draw(); }, done:function(){
    MV.tween({ dur:1000, step:function(t){ st.plate = t; draw(); }, done:function(){ MV.wait(200, cap); } });
  } }); });
}

// ---------- Explore: The ageing body explorer (@component F6 lifeStageSwitcher — age dial + situation switches + DRI readout;
// @component systemsWheel — seven schematic system cards in a ring (a list on phones), glow on change, two-line explanations;
// the Meal planner uses F2 dayPlanner above) ----------
function explore(host, api){
  var D = api.content, S = api.S, SYS = D.systems, TG = D.toggles, anim = null, pend = null, prevSig = null;
  S.mode = S.mode === "planner" ? "planner" : "wheel";
  S.age = clamp(Math.round((+S.age || 50) / 5) * 5, 50, 90);
  S.tog = S.tog || {}; TG.forEach(function(t){ S.tog[t.id] = !!S.tog[t.id]; });
  S.open = byId(SYS, S.open) ? S.open : "";
  S.persona = byId(D.personas, S.persona) ? S.persona : "ruth";
  S.ui = S.ui || {};
  S.plans = S.plans || {};
  D.personas.forEach(function(p){ S.plans[p.id] = S.plans[p.id] ? normPlan(S.plans[p.id]) : normPlan(D.current[p.id]); });
  var fx = { lit:[], plit:[], mark:null, thirst:null, chg:{} };

  host.innerHTML = '<div class="oa-lab"><div class="oa-main" data-mv="graph"><div id="oa-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="oa-pw"><div class="oa-agerow"><label for="oa-age">Age dial</label><input type="range" id="oa-age" min="50" max="90" step="5" data-k="oaage"><output id="oa-agev" for="oa-age"></output></div>' +
    '<div class="oa-togs" id="oa-togs" role="group" aria-label="Life situations"></div>' +
    '<div class="oa-ring" id="oa-ring"><svg class="oa-spokes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg><div class="oa-hub" id="oa-hub"></div></div>' +
    '<p class="tiny oa-chk" id="oa-chk"></p><div class="oa-detail" id="oa-detail" aria-live="polite"></div></div>' +
    '<div id="oa-pp" hidden><div id="oa-who"></div><p class="oa-pdesc tiny" id="oa-pdesc"></p><div class="q-actions oa-pact"><button type="button" class="btn ghost sm" id="oa-load" data-k="oaload">Reset to Ruth’s current day</button><button type="button" class="btn ghost sm" id="oa-clear" data-k="oaclear">Clear this day</button></div>' +
    '<div id="oa-pday"></div><div id="oa-pflags"></div><div id="oa-ppool"></div></div></div>' +
    '<div class="oa-side"><h4 class="oa-h4">Readout</h4><dl class="read" id="oa-read" aria-live="polite"></dl></div></div>';

  var modeRG = radios($("#oa-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; MV.banner("", ""); commit(); } });
  var whoRG = radios($("#oa-who"), { label:"Persona", cls:"chips", options:D.personas.map(function(p){ return { id:p.id, t:p.t }; }), value:S.persona, onChange:function(v){ cancelAnim(); S.persona = v; commit(); } });

  // ===== Systems wheel =====
  var age = $("#oa-age"), ring = $("#oa-ring"), n = SYS.length;
  ring.insertAdjacentHTML("beforeend", SYS.map(function(c, i){
    var t = -Math.PI / 2 + i * 2 * Math.PI / n, x = 50 + 37 * Math.cos(t), y = 50 + 40 * Math.sin(t);
    return '<button type="button" class="oa-card" data-sys="' + c.id + '" data-k="sys' + c.id + '" aria-pressed="false" style="left:' + f1(x) + "%;top:" + f1(y) + '%">' +
      '<span class="oa-cth"><span class="oa-cn">' + (i + 1) + "</span>" + ico(SYSICO[c.id]) + '<span class="oa-ct">' + c.t + '</span></span><span class="oa-cs"></span></button>';
  }).join(""));
  $(".oa-spokes", ring).innerHTML = SYS.map(function(c, i){ var t = -Math.PI / 2 + i * 2 * Math.PI / n; return '<line x1="50" y1="50" x2="' + f1(50 + 37 * Math.cos(t)) + '" y2="' + f1(50 + 40 * Math.sin(t)) + '"/>'; }).join("");
  $("#oa-togs").innerHTML = TG.map(function(t){ return switchHTML("tog" + t.id, t.t, S.tog[t.id], 'data-tog="' + t.id + '"'); }).join("");
  age.addEventListener("input", function(){ cancelAnim(); S.age = clamp(Math.round(+age.value / 5) * 5, 50, 90); commit(); });
  $("#oa-togs").addEventListener("click", function(e){ var b = e.target.closest("[data-tog]"); if (!b) return; cancelAnim(); S.tog[b.dataset.tog] = !S.tog[b.dataset.tog]; commit(); });
  ring.addEventListener("click", function(e){ var b = e.target.closest("[data-sys]"); if (!b) return; cancelAnim(); S.open = S.open === b.dataset.sys ? "" : b.dataset.sys; commit(); });
  function sigs(){ var R = sysReasons(S.age, S.tog), o = {}; SYS.forEach(function(c){ o[c.id] = R[c.id].join("|"); }); return o; }
  function thirstHTML(){
    var B = D.thirstBars, lv = fx.thirst != null ? fx.thirst : thirstLvl(S.age), w = lv >= 0.97 ? "strong" : lv >= 0.8 ? "a little weaker" : "weaker";
    return '<div class="oa-tb"><p class="oa-tbt"><strong>' + B.title + '</strong> <span class="tiny muted">' + B.note + "</span></p>" +
      '<div class="oa-bar' + (fx.lit.indexOf("tbar") >= 0 ? " oa-lit" : "") + '"><span class="oa-bl">' + B.signal + '</span><span class="oa-bt"><i class="sig" style="width:' + f1(lv * 90) + '%"></i></span><span class="oa-bv">' + w + "</span></div>" +
      '<div class="oa-bar"><span class="oa-bl">' + B.need + '</span><span class="oa-bt"><i class="need" style="width:90%"></i></span><span class="oa-bv">the same</span></div></div>';
  }
  function paintWheel(){
    age.value = S.age; age.setAttribute("aria-valuetext", S.age + " years"); $("#oa-agev").textContent = S.age + " years";
    $$("#oa-togs [data-tog]").forEach(function(b){ var on = !!S.tog[b.dataset.tog]; b.setAttribute("aria-checked", on); b.querySelector(".oa-swv").textContent = on ? "On" : "Off"; });
    var R = sysReasons(S.age, S.tog), sg = sigs();
    // "Changed" marks only the cards the latest change touched (opening a card keeps the marks)
    if (prevSig) { var now = Date.now(), ch = {}, any = false; SYS.forEach(function(c){ if (sg[c.id] !== prevSig[c.id]) { ch[c.id] = now; any = true; } }); if (any) fx.chg = ch; }
    prevSig = sg;
    SYS.forEach(function(c){
      var b = $('[data-sys="' + c.id + '"]', ring), on = R[c.id].length > 0, chg = !!fx.chg[c.id];
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(S.open === c.id));
      b.querySelector(".oa-cs").innerHTML = (chg ? '<span class="oa-new">Changed</span> ' : "") + (on ? R[c.id].join(" · ") : "No change flagged");
      if (chg && b._chg !== fx.chg[c.id]) { b._chg = fx.chg[c.id]; b.classList.remove("oa-glow"); void b.offsetWidth; b.classList.add("oa-glow"); }
      if (!chg) { b.classList.remove("oa-glow"); b._chg = null; }
      b.classList.toggle("oa-chg", chg);
    });
    var sc = plateScale(S.age);
    $("#oa-hub").innerHTML = '<svg class="oa-hplate" viewBox="-50 -50 100 100" aria-hidden="true"><circle class="oa-hp0" r="44"/><circle class="oa-hp1" r="' + f1(40 * sc) + '"/><circle class="oa-hp2" r="' + f1(26 * sc) + '"/></svg>' +
      '<span class="oa-hage">' + S.age + '</span><span class="oa-hlab">' + D.hub.plate + ": " + lc(D.rows.energy[band(S.age)]) + "</span>";
    $("#oa-chk").innerHTML = "<strong>" + D.hub.list + "</strong>: " + D.hub.same + ".";
    var c = byId(SYS, S.open), det = $("#oa-detail");
    if (!c) { det.innerHTML = '<p class="tiny muted">Tap a card to read what changes and how food can respond.</p>'; return; }
    det.innerHTML = '<h5 class="oa-h5">' + ico(SYSICO[c.id]) + " " + c.t + "</h5>" +
      '<p class="oa-now"><strong>Now (age ' + S.age + "):</strong> " + (R[c.id].length ? R[c.id].join(" · ") : "No change flagged at this age or with these situations.") + "</p>" +
      "<p><strong>What changes:</strong> " + c.what + "</p><p><strong>Food response:</strong> " + c.food + "</p>" + (c.id === "kidneys" ? thirstHTML() : "");
  }

  // ===== Meal planner =====
  function planOf(pid){ return S.plans[pid]; }
  var planner = dayPlanner({ key:"ex", hosts:{ day:$("#oa-pday"), flags:$("#oa-pflags"), pool:$("#oa-ppool") }, ui:S.ui,
    plan:function(){ return planOf(S.persona); }, persona:function(){ return pers(S.persona); },
    fx:function(){ return { lit:fx.plit, mark:fx.mark }; }, changed:function(){ cancelAnim(); commit(); }, save:api.save });
  $("#oa-load").addEventListener("click", function(){ cancelAnim(); S.plans.ruth = normPlan(D.current.ruth); commit(); });
  $("#oa-clear").addEventListener("click", function(){ cancelAnim(); var s = S.plans[S.persona].supp; S.plans[S.persona] = blankPlan(); S.plans[S.persona].supp = s; commit(); });
  function paintPlanner(){
    whoRG.set(S.persona);
    var p = pers(S.persona);
    $("#oa-pdesc").innerHTML = "<strong>" + p.t + ":</strong> " + p.desc + ".";
    $("#oa-load").hidden = S.persona !== "ruth";
    planner.paint();
  }

  // ===== readout =====
  function readPaint(){
    var ctx = S.mode === "planner" ? (function(){ var p = pers(S.persona), T = {}; p.sit.forEach(function(k){ T[k] = true; }); return { age:p.age, sex:p.sex, tog:T, persona:p }; })() : { age:S.age, sex:null, tog:S.tog, persona:null };
    $("#oa-read").innerHTML = readHTML(readRows(ctx), fx.lit);
  }
  function paint(){
    modeRG.set(S.mode);
    $("#oa-pw").hidden = S.mode !== "wheel"; $("#oa-pp").hidden = S.mode !== "planner";
    if (S.mode === "wheel") paintWheel(); else { stickTop(); paintPlanner(); }
    readPaint();
  }
  function commit(){ fx.lit = []; fx.plit = []; fx.mark = null; api.save(); paint(); MV.changed(); }
  function finish(){ anim = null; fx.thirst = null; api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } fx.thirst = null; if (pend) { var d = pend; pend = null; d(); } }
  paint();

  // ===== challenges (plan's exact tests and named wrong states; each checks its persona's plan) =====
  var CH = {}; D.challenges.forEach(function(c){ CH[c.id] = c; });
  function challenge(id){
    var M = CH[id].msgs;
    if (id === "tc1") {
      var lu = S.plans.ruth.l.map(food);
      if (!lu.length) return { ok:false, msg:M.empty };
      if (lu.some(function(x){ return x.tex === "hard"; })) return { ok:false, msg:M.hard };
      var mod = lu.filter(function(x){ return x.tex !== "soft"; })[0]; if (mod) return { ok:false, msg:fill(M.moderate, { item:MV.plain(mod.t) }) };
      if (!lu.some(function(x){ return x.p; })) return { ok:false, msg:M.protein };
      if (!lu.some(function(x){ return x.ca; })) return { ok:false, msg:M.calcium };
      return { ok:true };
    }
    if (id === "tc2") {
      var r = evalPlan(S.plans.ruth, pers("ruth"));
      if (!r.supp) return { ok:false, msg:M.supp };
      if (r.dFood >= 10) return { ok:true };
      return { ok:false, msg:r.dFood === 9 ? M.nine : fill(M.low, { v:r.dFood }) };
    }
    if (id === "tc3") {
      var g = evalPlan(S.plans.gurdeep, pers("gurdeep"));
      if (!g.all.length) return { ok:false, msg:M.empty };
      if (g.eggs) return { ok:false, msg:M.eggs };
      if (g.meatFish.length) return { ok:false, msg:fill(M.meat, { list:listAnd(uniq(g.meatFish).map(function(x){ return lc(MV.plain(x.t)); })) }) };
      if (g.b12df < 3) return { ok:false, msg:M.b12 };
      if (!g.protAll) return { ok:false, msg:M.protein };
      if (g.fl < 4) return { ok:false, msg:fill(M.fluids, { n:g.fl, s:g.fl === 1 ? "" : "s" }) };
      return { ok:true };
    }
    return { ok:false };
  }

  // ===== predictions =====
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx.lit = []; fx.plit = []; fx.mark = null;
        if (p.id === "p1") { S.mode = "wheel"; S.age = 50; }
        else if (p.id === "p2") { S.mode = "wheel"; S.age = 80; TG.forEach(function(t){ S.tog[t.id] = false; }); }
        else if (p.id === "p3") { S.mode = "planner"; S.persona = "ruth"; S.plans.ruth = normPlan(D.current.ruth); S.ui.slot = "d"; fx.mark = { slot:"d", id:"steak" }; }
        else if (p.id === "p4") { S.mode = "wheel"; S.age = 75; S.open = "kidneys"; fx.thirst = thirstLvl(50); }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal($("#oa-ring"));
          var last = 50;
          anim = MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){ var a = 50 + Math.round(t * 6) * 5; if (a !== last) { last = a; S.age = a; if (a >= 75) fx.lit = ["vitd"]; paintWheel(); readPaint(); } },
            done:function(){ S.age = 80; fx.lit = ["energy", "vitd"]; finish(); } });
        } else if (p.id === "p2") {
          reveal($("#oa-ring"));
          var t1 = MV.wait(700, function(){ S.tog.alone = true; S.open = "mood"; fx.lit = ["flags"]; api.save(); paint();
            var t2 = MV.wait(900, function(){ anim = null; finish(); }); anim = function(){ clearTimeout(t2); }; });
          anim = function(){ clearTimeout(t1); };
        } else if (p.id === "p3") {
          reveal($("#oa-pday"));
          var t3 = MV.wait(900, function(){
            var d = S.plans.ruth.d, k = d.indexOf("steak"); if (k >= 0) d[k] = "lsoup"; else d.unshift("lsoup");
            fx.mark = { slot:"d", id:"lsoup" }; fx.plit = ["tex", "prot"]; api.save(); paint();
            var t4 = MV.wait(700, function(){ anim = null; finish(); }); anim = function(){ clearTimeout(t4); };
          });
          anim = function(){ clearTimeout(t3); };
        } else {
          reveal($("#oa-detail"));
          var a0 = thirstLvl(50), a1 = thirstLvl(75);
          anim = MV.tween({ dur:1600, step:function(t){ fx.thirst = lerp(a0, a1, t); paintWheel(); }, done:function(){ fx.lit = ["thirst", "tbar"]; finish(); } });
        }
      }
    },
    challenge:function(id){ return challenge(id); }
  };
}
// phone: the planner's sticky bits stay under the sticky header
function stickTop(){
  var h = document.querySelector("header.top"); if (!h) return;
  var top = parseFloat(getComputedStyle(h).top) || 0;
  document.documentElement.style.setProperty("--oa-top", Math.round(top + h.offsetHeight) + "px");
}
window.addEventListener("resize", function(){ stickTop(); });

// ---------- Part 3: Design for an older adult (@component designStations — texture swaps, nutrient-density pairs with a
// "Check it with data" table, a budget day with a cost bar; plus the kitchen card) ----------
function texPlate(lev){
  var h = '<circle class="oa-tp0" r="46"/><circle class="oa-tp1" r="38"/>';
  if (lev === "reg") {
    h += '<path class="oa-tpr" d="M-31-6c-4-14 12-24 25-16 8 5 8 17 0 22-9 7-22 6-25-6z"/><rect class="oa-tpr2" x="-8" y="-24" width="5" height="12" rx="2" transform="rotate(30)"/>';
    h += '<ellipse class="oa-tvf" cx="14" cy="-20" rx="10" ry="5" transform="rotate(-25 14 -20)"/><ellipse class="oa-tvf" cx="24" cy="-6" rx="9" ry="5" transform="rotate(40 24 -6)"/><ellipse class="oa-tvf" cx="10" cy="-6" rx="8" ry="4" transform="rotate(10 10 -6)"/>';
    h += '<rect class="oa-tgr" x="-14" y="10" width="34" height="18" rx="6"/><path class="oa-tln" d="M-8 14l6 10M2 14l6 10M12 14l4 7"/>';
  } else if (lev === "soft") {
    h += '<ellipse class="oa-tsauce" cx="-14" cy="-6" rx="20" ry="14"/>';
    [[-24, -12], [-14, -14], [-20, -2], [-10, -4], [-4, -12]].forEach(function(p){ h += '<rect class="oa-tpr" x="' + p[0] + '" y="' + p[1] + '" width="8" height="8" rx="2"/>'; });
    [[10, -20], [20, -14], [14, -8], [24, -4], [8, -2]].forEach(function(p){ h += '<rect class="oa-tvf" x="' + p[0] + '" y="' + p[1] + '" width="7" height="7" rx="2"/>'; });
    h += '<rect class="oa-tgr" x="-10" y="12" width="22" height="16" rx="4"/>';
  } else {
    h += '<ellipse class="oa-tsauce" cx="-14" cy="-6" rx="21" ry="15"/>';
    for (var i = 0; i < 16; i++) h += '<circle class="oa-tpr" cx="' + f1(-14 + 13 * Math.cos(i * 2.4) * (0.4 + (i % 4) / 5)) + '" cy="' + f1(-6 + 9 * Math.sin(i * 2.4) * (0.4 + (i % 4) / 5)) + '" r="2"/>';
    h += '<ellipse class="oa-tvf" cx="17" cy="-10" rx="13" ry="9"/><circle class="oa-tsoup" cx="2" cy="20" r="13"/>';
    for (var j = 0; j < 6; j++) h += '<circle class="oa-tgr" cx="' + f1(2 + 7 * Math.cos(j)) + '" cy="' + f1(20 + 6 * Math.sin(j)) + '" r="2.2"/>';
  }
  return h;
}
function part3(host, api){
  var D = api.content, S = api.S, TX = D.texture, DN = D.density, BU = D.budget;
  S.st = byId(D.stations, S.st) ? S.st : "tex";
  S.lev = byId(TX.levels, S.lev) ? S.lev : "reg";
  S.tex = S.tex || {}; S.pairs = S.pairs || {}; S.bud = S.bud || {};
  BU.slots.forEach(function(sl){ if (!byId(sl.opts, S.bud[sl.id])) S.bud[sl.id] = "cur"; });
  host.innerHTML = '<div id="oa-stn"></div><p class="tiny" id="oa-stp" aria-live="polite"></p>' +
    '<div class="oa-st" id="oa-st-tex"></div><div class="oa-st" id="oa-st-dense" hidden></div><div class="oa-st" id="oa-st-budget" hidden></div>' +
    '<div class="oa-kcw"><h4 class="oa-h4">Kitchen card: ' + D.kitchen.title + '</h4><p class="tiny muted">Printing is turned off on this site, so the card saves as a text file.</p><div id="oa-kc"></div><details class="oa-kprev"><summary>Preview the kitchen card</summary><div id="oa-kcp"></div></details></div>';
  function texDone(){ return TX.parts.every(function(p){ var s = p.swaps[S.tex[p.id]]; return s && MV.ok(s); }); }
  function denseDone(){ return DN.pairs.every(function(p){ var s = p.items[S.pairs[p.id]]; return s && MV.ok(s); }); }
  function budEval(){
    var r = { cost:0, skip:[], noP:[], ca:0, vf:0 };
    BU.slots.forEach(function(sl){ var o = byId(sl.opts, S.bud[sl.id]); r.cost += o.cost; if (o.skip) r.skip.push(sl); else if (sl.meal && !o.p) r.noP.push(sl); if (o.ca) r.ca++; if (o.vf) r.vf++; });
    r.cost = Math.round(r.cost * 100) / 100; r.ok = !r.skip.length && !r.noP.length && r.cost <= BU.limit + 1e-9; return r;
  }
  function done(id){ return id === "tex" ? texDone() : id === "dense" ? denseDone() : budEval().ok; }
  // station chips show ✓ once a station is finished (radios re-reads the option labels on repaint)
  function stLabels(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="oa-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  var stRG = radios($("#oa-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    var nd = D.stations.filter(function(s){ return done(s.id); }).length;
    $("#oa-stp", host).textContent = "Stations finished: " + nd + " of " + D.stations.length + ".";
  }

  // ===== Station 1: texture =====
  var s1 = $("#oa-st-tex", host);
  s1.innerHTML = "<h4 class=\"oa-h4\">" + TX.title + '</h4><p>The same dinner: <strong>' + TX.dinner + '</strong>, in three textures.</p><div id="oa-lev"></div><div class="oa-levs" id="oa-levs"></div>' +
    '<div class="hfa-support oa-iddsi" role="note"><p>' + TX.note + "</p></div><p class=\"oa-ask\"><strong>" + TX.ask + '</strong></p><div class="oa-parts" id="oa-parts"></div><dl class="read oa-tread" id="oa-tread" aria-live="polite"></dl><div id="oa-tfb" aria-live="polite"></div>';
  var levRG = radios($("#oa-lev", s1), { label:"See it as", cls:"chips", options:TX.levels.map(function(l){ return { id:l.id, t:l.t }; }), value:S.lev, onChange:function(v){ S.lev = v; api.save(); paintTex(); } });
  $("#oa-parts", s1).innerHTML = TX.parts.map(function(p){ return '<div class="oa-part" data-part="' + p.id + '"><div id="oa-sw-' + p.id + '"></div><div class="oa-pfb" aria-live="polite"></div></div>'; }).join("");
  var swRG = {};
  TX.parts.forEach(function(p){
    swRG[p.id] = radios($("#oa-sw-" + p.id, s1), { label:p.t + " →", cls:"chips", aria:p.t + ": swap", options:p.swaps.map(function(s, i){ return { id:String(i), t:s.t }; }), value:S.tex[p.id] != null ? String(S.tex[p.id]) : "",
      onChange:function(v){ S.tex[p.id] = +v; api.save(); paintTex(); stRepaint(); } });
  });
  function paintTex(){
    levRG.set(S.lev);
    $("#oa-levs", s1).innerHTML = TX.levels.map(function(l){ var on = l.id === S.lev; return '<figure class="oa-lv' + (on ? " on" : "") + '"><svg viewBox="-50 -50 100 100" role="img" aria-label="' + esc(l.t + ": " + l.d) + '">' + texPlate(l.id) + "</svg><figcaption><strong>" + l.t + "</strong><span>" + l.d + "</span></figcaption></figure>"; }).join("");
    TX.parts.forEach(function(p){
      var s = p.swaps[S.tex[p.id]], box = $('[data-part="' + p.id + '"] .oa-pfb', s1);
      if (s == null) { box.innerHTML = ""; return; }
      var good = MV.ok(s);
      box.innerHTML = MV.fbHTML(good ? "good" : "bad", (good ? "<strong>✓</strong> " : "<strong>✗ Not quite.</strong> ") + s.fb);
    });
    function kept(id){ var p = byId(TX.parts, id), s = p.swaps[S.tex[id]]; return s == null ? "choose a swap" : MV.ok(s) ? "yes" : "no"; }
    var ok = texDone();
    $("#oa-tread", s1).innerHTML = MV.readoutHTML([["Protein kept", kept("chicken")], ["Vegetables kept", kept("salad")], ["Whole grain kept", kept("bread")], ["Every part soft", ok ? "yes" : "not yet"]]);
    $("#oa-tfb", s1).innerHTML = ok ? MV.fbHTML("good", "<strong>✓ " + TX.done + "</strong>") : "";
  }

  // ===== Station 2: nutrient density =====
  var s2 = $("#oa-st-dense", host);
  s2.innerHTML = "<h4 class=\"oa-h4\">" + DN.title + "</h4><p><strong>" + DN.ask + '</strong></p><div class="oa-pairs" id="oa-pairs"></div><div id="oa-dfb" aria-live="polite"></div>' +
    '<details class="alg oa-data" id="oa-ddata"><summary>Check it with data: nutrients per serving</summary><div id="oa-dtab"></div></details>';
  function paintDense(){
    var box = $("#oa-pairs", s2);
    MV.keepFocus(box, function(){
      box.innerHTML = DN.pairs.map(function(p, pi){
        var ch = S.pairs[p.id], sel = p.items[ch];
        return '<div class="oa-pair" data-pair="' + p.id + '"><p class="oa-pq">Pair ' + (pi + 1) + '</p><div class="oa-pbtns" role="group" aria-label="' + esc("Pair " + (pi + 1) + ": choose the more nutrient-dense food") + '">' + p.items.map(function(it, i){
          var on = ch === i, cls = "oa-pb" + (on ? (MV.ok(it) ? " right" : " wrong") : "");
          return '<button type="button" class="' + cls + '" data-pi="' + p.id + '" data-i="' + i + '" data-k="pb' + p.id + i + '" aria-pressed="' + on + '">' + it.t + "</button>";
        }).join('<span class="oa-vs" aria-hidden="true">or</span>') + "</div>" +
        (sel ? MV.fbHTML(MV.ok(sel) ? "good" : "bad", MV.ok(sel) ? "<strong>✓ Right.</strong> " + p.fb : "<strong>✗ Not quite.</strong> " + p.bad) : "") + "</div>";
      }).join("");
    });
    $("#oa-dfb", s2).innerHTML = denseDone() ? MV.fbHTML("good", "<strong>✓ " + DN.done + "</strong>") : "";
    var rows = [];
    DN.pairs.forEach(function(p){ p.items.forEach(function(it, i){ rows.push("<tr" + (i === 1 ? ' class="oa-pend"' : "") + '><th scope="row">' + it.t + "</th>" + it.v.map(function(v){ return "<td>" + v + "</td>"; }).join("") + "</tr>"); }); });
    $("#oa-dtab", s2).innerHTML = '<div class="tbl-wrap"><table class="oa-tbl"><thead><tr><th scope="col">Per serving</th>' + DN.heads.map(function(h){ return '<th scope="col">' + h + "</th>"; }).join("") + "</tr></thead><tbody>" + rows.join("") + '</tbody></table></div><p class="tiny muted">' + DN.label + ' <span class="hfa-model">Model data</span></p>';
  }
  s2.addEventListener("click", function(e){ var b = e.target.closest("[data-pi]"); if (!b) return; S.pairs[b.dataset.pi] = +b.dataset.i; api.save(); paintDense(); stRepaint(); MV.focusFb(b.closest(".oa-pair")); });

  // ===== Station 3: budget =====
  var s3 = $("#oa-st-budget", host);
  s3.innerHTML = "<h4 class=\"oa-h4\">" + BU.title + "</h4><p><strong>" + BU.ask + '</strong></p><div class="oa-bpin" id="oa-bpin" aria-live="polite"></div><div class="oa-bslots" id="oa-bslots"></div><div id="oa-bfb" aria-live="polite"></div>' +
    '<details class="alg oa-data"><summary>Check it with data: cost of each part of the day</summary><div id="oa-btab"></div></details><div class="hfa-support oa-bnote" role="note"><p>' + BU.note + "</p></div>";
  var budRG = {};
  $("#oa-bslots", s3).innerHTML = BU.slots.map(function(sl){ return '<div class="oa-bslot" id="oa-bs-' + sl.id + '"></div>'; }).join("");
  BU.slots.forEach(function(sl){
    budRG[sl.id] = radios($("#oa-bs-" + sl.id, s3), { label:sl.t, cls:"chips", options:sl.opts.map(function(o){ return { id:o.id, t:o.t + ' <span class="oa-bc">' + money(o.cost) + (o.cur ? " · current" : "") + "</span>" }; }), value:S.bud[sl.id],
      onChange:function(v){ S.bud[sl.id] = v; api.save(); paintBud(); stRepaint(); } });
  });
  function paintBud(){
    var r = budEval(), max = 12, over = r.cost > BU.limit + 1e-9;
    $("#oa-bpin", s3).innerHTML = '<div class="oa-cost' + (over ? " over" : "") + '"><p class="oa-costt">Harold’s day (model): <strong>' + money(r.cost) + "</strong> of " + money(BU.limit) + (over ? " · over by " + money(r.cost - BU.limit) : " ✓ within budget") + "</p>" +
      '<span class="oa-cbar" aria-hidden="true"><i style="width:' + f1(clamp(r.cost / max, 0, 1) * 100) + '%"></i><b style="left:' + f1(BU.limit / max * 100) + '%"></b></span>' +
      '<p class="tiny oa-bsum">Protein at every meal: ' + (r.noP.length || r.skip.some(function(s){ return s.meal; }) ? "○ not yet" : "✓") + " · calcium-rich parts: " + r.ca + " · vegetables or fruit: " + r.vf + "</p></div>";
    var M = BU.msgs, msg;
    if (r.skip.length) msg = MV.fbHTML("bad", "<strong>✗</strong> " + M.skip);
    else if (r.noP.length) msg = MV.fbHTML("bad", "<strong>✗</strong> " + fill(M.protein, { meal:r.noP[0].t }));
    else if (over) msg = MV.fbHTML("bad", "<strong>✗</strong> " + fill(M.over, { v:money(r.cost - BU.limit) }));
    else msg = MV.fbHTML("good", "<strong>✓ " + M.done + "</strong>");
    $("#oa-bfb", s3).innerHTML = msg;
    $("#oa-btab", s3).innerHTML = '<div class="tbl-wrap"><table class="oa-tbl"><thead><tr><th scope="col">Part of the day</th><th scope="col">Current</th><th scope="col">Your plan</th></tr></thead><tbody>' +
      BU.slots.map(function(sl){ var c = byId(sl.opts, "cur"), o = byId(sl.opts, S.bud[sl.id]); return '<tr><th scope="row">' + sl.t + "</th><td>" + c.t + " (" + money(c.cost) + ")</td><td>" + o.t + " (" + money(o.cost) + ")</td></tr>"; }).join("") +
      '<tr><th scope="row">Total</th><td>' + money(BU.slots.reduce(function(s, sl){ return s + byId(sl.opts, "cur").cost; }, 0)) + "</td><td>" + money(r.cost) + '</td></tr></tbody></table></div><p class="tiny muted">Model costs for learning; real prices vary. <span class="hfa-model">Model data</span></p>';
  }

  // ===== kitchen card =====
  var K = D.kitchen;
  MV.kitchenCardButton($("#oa-kc", host), { title:K.title, file:K.file, lines:K.lines, label:K.label });
  $("#oa-kcp", host).innerHTML = kcPreview(K.lines);

  function paintAll(){
    stRG.set(S.st); stRepaint();
    D.stations.forEach(function(s){ $("#oa-st-" + s.id, host).hidden = s.id !== S.st; });
    if (S.st === "budget") stickTop();
  }
  paintTex(); paintDense(); paintBud(); paintAll();
}
function kcPreview(lines){
  return '<div class="oa-kcard">' + lines.map(function(l){ return /^##\s*/.test(l) ? "<h5>" + l.replace(/^##\s*/, "") + "</h5>" : /^-\s+/.test(l) ? '<p class="b">• ' + l.replace(/^-\s+/, "") + "</p>" : l ? "<p>" + l + "</p>" : ""; }).join("") + "</div>";
}

// ---------- Performance task: A good day for… (F2 dayPlanner for a chosen persona; kitchen-card dish chooser) ----------
var task = (function(){
  var api = null, pl = null, rgP = null, rgD = null;
  function TK(){ return MV.C.task; }
  function dish(id){ return byId(TK().dishes, id); }
  function dishLines(d){
    if (d.from !== "part3") return d.lines;
    // the Part 3 card, plus knife safety for the task's card (module-written line)
    var L = MV.C.part3.kitchen.lines.slice(), k = L.indexOf("## Safety");
    L.splice(k + 2, 0, "- Knife safety: curl your fingertips when chopping the onion and carrots.");
    return L;
  }
  function st(){
    var s = api.S; s.persona = byId(EX().personas, s.persona) ? s.persona : "ruth";
    s.plans = s.plans || {}; EX().personas.forEach(function(p){ s.plans[p.id] = normPlan(s.plans[p.id]); });
    s.ui = s.ui || {}; s.dish = dish(s.dish) ? s.dish : ""; return s;
  }
  function read(){ if (!api) return { pid:"ruth", plan:blankPlan(), dish:"" }; var s = st(); return { pid:s.persona, plan:clonePlan(s.plans[s.persona]), dish:s.dish }; }
  function checks(d){ var r = evalPlan(d.plan, pers(d.pid)); return [r.protAll, r.ca >= 3, r.dOk, r.fl >= 4, fits(r, d.pid), !!d.dish]; }
  function valid(d){ var miss = EX().slots.filter(function(sl){ return !(d.plan[sl.id] || []).length; }); return miss.length ? "Fill all five slots first: add food to " + listAnd(miss.map(function(sl){ return lc(sl.t); })) + "." : true; }
  function key(d){ return d.pid + "~" + (d.plan.supp ? "s" : "-") + "~" + EX().slots.map(function(sl){ return sl.id + ":" + d.plan[sl.id].slice().sort().join(","); }).join(";") + "~" + d.dish; }
  function fromKey(k){
    var p = k.split("~"), plan = blankPlan(); plan.supp = p[1] === "s";
    (p[2] || "").split(";").forEach(function(x){ var q = x.split(":"); if (plan[q[0]]) plan[q[0]] = q[1] ? q[1].split(",").filter(food) : []; });
    return { pid:p[0], plan:plan, dish:p[3] || "" };
  }
  function planText(k){
    var q = fromKey(k), per = pers(q.pid);
    return per.t + ": " + EX().slots.map(function(sl){ return sl.t + ": " + q.plan[sl.id].map(function(id){ return MV.plain(food(id).t); }).join(", "); }).join("; ") +
      (q.plan.supp ? "; vitamin D supplement note on" : "") + (dish(q.dish) ? "; kitchen card: " + MV.plain(dish(q.dish).t) : "");
  }
  function label(k){ var q = fromKey(k), n = EX().slots.reduce(function(s, sl){ return s + q.plan[sl.id].length; }, 0); return "<strong>" + pers(q.pid).t + "</strong> (" + n + " foods" + (dish(q.dish) ? ", " + lc(MV.plain(dish(q.dish).t)) : "") + ")"; }
  function tips(d, res){
    var T = TK();
    return T.checks.map(function(_, i){ return res[i] ? null : i === 4 ? T.tips5[d.pid] : T.tips[i]; }).filter(Boolean);
  }
  function paintDish(){
    var s = st(), d = dish(s.dish), box = $("#tk-kc"), pv = $("#tk-kcp");
    rgD.set(s.dish);
    if (!d) { box.innerHTML = '<p class="tiny muted">Choose a dish to make its kitchen card.</p>'; pv.innerHTML = ""; $("#tk-kcd").hidden = true; return; }
    var per = pers(s.persona);
    MV.kitchenCardButton(box, { title:function(){ return d.t + " (planned for " + per.t + ")"; }, lines:function(){ return dishLines(d); }, label:"Save the kitchen card" });
    $("#tk-kcd").hidden = false; pv.innerHTML = kcPreview(dishLines(d));
  }
  function paint(){ var s = st(); rgP.set(s.persona); var p = pers(s.persona); $("#tk-pdesc").innerHTML = "<strong>" + p.t + ":</strong> " + p.desc + "."; pl.paint(); paintDish(); }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="oa-tin"><div id="tk-who"></div><p class="tiny oa-pdesc" id="tk-pdesc"></p><div id="tk-day"></div><div id="tk-flags"></div><div id="tk-pool"></div></div>';
      pv.innerHTML = '<div class="oa-tpv"><h4 class="oa-h4">Kitchen card</h4><div id="tk-dish"></div><div id="tk-kc"></div><details class="oa-kprev" id="tk-kcd" hidden><summary>Preview the kitchen card</summary><div id="tk-kcp"></div></details>' +
        '<details class="oa-rules"><summary>What each checklist line tests</summary><p class="tiny">' + TK().rules + "</p></details></div>";
      function upd(){ a.save(); paint(); a.update(); }
      rgP = radios($("#tk-who"), { label:"Persona", cls:"chips", options:EX().personas.map(function(p){ return { id:p.id, t:p.t }; }), value:s.persona, onChange:function(v){ st().persona = v; upd(); } });
      rgD = radios($("#tk-dish"), { label:"Dish", cls:"chips", aria:"Kitchen-card dish", options:TK().dishes.map(function(d){ return { id:d.id, t:d.t }; }), value:s.dish, onChange:function(v){ st().dish = v; upd(); } });
      pl = dayPlanner({ key:"tk", hosts:{ day:$("#tk-day"), flags:$("#tk-flags"), pool:$("#tk-pool") }, ui:s.ui,
        plan:function(){ var x = st(); return x.plans[x.persona]; }, persona:function(){ return pers(st().persona); },
        fx:function(){ return {}; }, changed:upd, save:a.save });
      paint();
    },
    read:read, valid:valid, checks:checks, tips:tips, key:key,
    label:label, text:planText,
    summary:function(ts){
      var T = TK(), found = (ts.found || []).map(fromKey), names = [];
      found.forEach(function(q){ var n = pers(q.pid).t; if (names.indexOf(n) < 0) names.push(n); });
      return [T.summary + ": " + (found.length ? "solved (" + names.join(", ") + ")" : "not solved yet")].concat((ts.found || []).map(function(k){ return "  " + planText(k); }));
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ if (v === "explore" || v === "design") stickTop(); }
});
})();
