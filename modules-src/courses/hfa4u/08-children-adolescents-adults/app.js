// HFA4U 08 Children, Adolescents & Adults: hero (calcium and iron RDA bars by age), Life-stage switcher (Explore: F6 needs
// curve, F1 plate check with eating times and the optional private "My day", drink shelf with Kwasi's drinks, and the TC3
// cafeteria menu inside its challenge card), Teen food realities (Part 3: four stations), the "Read the data" chart, the
// matching-text fix and "Fuel Kwasi's game day" (task: day planner + kitchen card). Plan wording lives in content.mjs; this
// file adds control labels and layout text only.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function r3(v){ return Math.round(v * 1000) / 1000; }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function listJoin(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 06; options may be a function so a repaint rebuilds the labels) ----------
//   Segmented control, chip row or custom layout as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t, cls}] | function, value, cls:"seg"|"chips"|<custom → class ty-<custom>>, onChange})
//   -> {set, get, repaint}. Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "ty-chipset" : o.cls && o.cls !== "seg" ? "ty-" + o.cls : "seg";
  function opts(){ return typeof o.options === "function" ? o.options() : o.options; }
  function paint(){
    var O = opts(), f = host.contains(document.activeElement), any = O.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="ty-rgw">' + (lab ? '<span class="ty-rgl">' + lab + "</span>" : "") + '<span class="ty-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      O.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (x.aria ? ' aria-label="' + esc(x.aria) + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = opts().map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- small inline icons (stroke-only, currentColor; never the only signal) ----------
var ICO = {
  caf:'<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2"/><path d="M8 3c0 2 2 2 2 4M12 3c0 2 2 2 2 4"/>',
  sug:'<path d="M5 9l7-4 7 4v7l-7 4-7-4z"/><path d="M5 9l7 4 7-4M12 13v7"/>',
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  school:'<path d="M3 21V10l9-6 9 6v11z"/><path d="M9 21v-6h6v6"/><path d="M12 4V1h4"/>',
  ff:'<path d="M4 10h16l-2 11H6z"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  conv:'<path d="M3 9l2-5h14l2 5"/><path d="M4 9v12h16V9"/><path d="M3 9h18"/><path d="M10 21v-6h4v6"/>',
  groc:'<path d="M3 4h3l2 11h11l2-8H7"/><circle cx="9" cy="19" r="1.6"/><circle cx="18" cy="19" r="1.6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
function ico(k, cls){ return '<svg class="ty-ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICO[k] + "</svg>"; }

// a tiny Canada's Food Guide plate (sections fill when present; always paired with words)
function miniPlate(has, cls){
  return '<svg class="ty-mplate' + (cls ? " " + cls : "") + '" viewBox="0 0 48 44" aria-hidden="true"><circle class="ty-mprim" cx="22" cy="22" r="20.5"/>' +
    '<path class="ty-mp vf' + (has.vf ? " on" : "") + '" d="M22 4A18 18 0 0 0 22 40Z"/><path class="ty-mp wg' + (has.wg ? " on" : "") + '" d="M22 22V4A18 18 0 0 1 40 22Z"/><path class="ty-mp pf' + (has.pf ? " on" : "") + '" d="M22 22H40A18 18 0 0 1 22 40Z"/></svg>';
}

// ---------- hero (storyboard: calcium bars rise one after another, the teen bars tallest under a "bone-building years"
// bracket; the display then switches to iron: the 14–18 bar splits into female 15 and male 11 with a "menstruation" note.
// The 19–50 bar splits too (18 and 8), since one value would be wrong there. Reduced motion: both charts side by side.) ----------
var HV = { ca:[1000, 1300, 1300, 1000], cmax:1400, fe:[[10], [8], [15, 11], [18, 8]], fmax:20, y0:222, H:156, ages:["4–8", "9–13", "14–18", "19–50"] };
function heroSVG(st){
  var y0 = HV.y0, H = HV.H, h = "";
  h += '<defs><pattern id="ty-hh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="ty-hhb" width="6" height="6"/><line class="ty-hhl" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>';
  // calcium panel: full width first, then it moves to the left half
  var cx0 = lerp(70, 14, st.mv), cx1 = lerp(450, 252, st.mv), gw = (cx1 - cx0) / 4, bw = Math.min(46, gw * 0.56);
  h += svgT((cx0 + cx1) / 2, 18, "Calcium (mg a day)", "ty-hl");
  h += '<line class="ty-hax" x1="' + f1(cx0) + '" y1="' + y0 + '" x2="' + f1(cx1) + '" y2="' + y0 + '"/>';
  HV.ca.forEach(function(v, i){
    var p = clamp((st.ca - i * 0.2) / 0.4, 0, 1), bh = v / HV.cmax * H * p, cx = cx0 + gw * (i + 0.5);
    if (bh > 0) h += '<rect class="ty-hbar' + (i === 1 || i === 2 ? " teen" : "") + '" x="' + f1(cx - bw / 2) + '" y="' + f1(y0 - bh) + '" width="' + f1(bw) + '" height="' + f1(bh) + '" rx="2"/>';
    if (p > 0) h += svgT(cx, y0 - bh - 6, MV.num(v), "ty-hv", "middle", ' style="opacity:' + f1(p) + '"');
    h += svgT(cx, y0 + 18, HV.ages[i], "ty-ha");
  });
  if (st.br > 0) {
    var xa = cx0 + gw * 1.5 - bw / 2 - 3, xb = cx0 + gw * 2.5 + bw / 2 + 3;
    h += '<g style="opacity:' + f1(st.br) + '"><path class="ty-hbr" d="M' + f1(xa) + " 56V48H" + f1(xb) + 'V56"/>' + svgT((xa + xb) / 2, 41, MV.C.explore.bracket, "ty-hn") + "</g>";
  }
  h += svgT((cx0 + cx1) / 2, 258, "age (years)", "ty-hs");
  // iron panel (appears as the calcium panel moves over)
  if (st.mv > 0) {
    var ix0 = 278, ix1 = 508, ig = (ix1 - ix0) / 4, iw = Math.min(46, ig * 0.56), sp = st.sp;
    h += '<g style="opacity:' + f1(st.mv) + '">' + svgT((ix0 + ix1) / 2, 18, "Iron (mg a day)", "ty-hl");
    h += '<line class="ty-hax" x1="' + ix0 + '" y1="' + y0 + '" x2="' + ix1 + '" y2="' + y0 + '"/>';
    HV.fe.forEach(function(vals, i){
      var p = clamp((st.fe - i * 0.2) / 0.4, 0, 1), cx = ix0 + ig * (i + 0.5);
      h += svgT(cx, y0 + 18, HV.ages[i], "ty-ha");
      if (p <= 0) return;
      if (vals.length === 1) {
        var bh = vals[0] / HV.fmax * H * p;
        h += '<rect class="ty-hbar" x="' + f1(cx - iw / 2) + '" y="' + f1(y0 - bh) + '" width="' + f1(iw) + '" height="' + f1(bh) + '" rx="2"/>' + svgT(cx, y0 - bh - 6, vals[0], "ty-hv", "middle", ' style="opacity:' + f1(p) + '"');
        return;
      }
      var hM = vals[1] / HV.fmax * H * p, hF = lerp(hM, vals[0] / HV.fmax * H * p, sp), w = lerp(iw, iw / 2 - 1, sp);
      var xF = cx - iw / 2 - sp * 3, xM = cx + lerp(-iw / 2, 1, sp) + sp * 3;
      h += '<rect class="ty-hbar m" x="' + f1(xM) + '" y="' + f1(y0 - hM) + '" width="' + f1(w) + '" height="' + f1(hM) + '" rx="2"/>';
      h += '<rect class="ty-hbar" x="' + f1(xF) + '" y="' + f1(y0 - hF) + '" width="' + f1(w) + '" height="' + f1(hF) + '" rx="2"/>';
      if (sp > 0.5) {
        var o = ' style="opacity:' + f1((sp - 0.5) * 2) + '"';
        h += svgT(xF + w / 2, y0 - 6, "F", "ty-hfl", "middle", o) + svgT(xM + w / 2, y0 - 6, "M", "ty-hml", "middle", o);
        h += svgT(xF + w / 2, y0 - hF - 6, vals[0], "ty-hv", "middle", o) + svgT(xM + w / 2, y0 - hM - 6, vals[1], "ty-hv", "middle", o);
        if (i === 2) h += '<g' + o + '><line class="ty-hld" x1="' + f1(xF + w / 2) + '" y1="50" x2="' + f1(xF + w / 2) + '" y2="' + f1(y0 - hF - 22) + '"/>' + svgT(xF + w / 2, 44, "menstruation", "ty-hn") + "</g>";
      }
    });
    h += svgT((ix0 + ix1) / 2, 258, "age (years) · F female, M male", "ty-hs") + "</g>";
  }
  return h;
}
function hero(f){
  fixMatchText(); dataChart();
  var host = $("#ty-hero"); if (!host) return;
  var Hc = MV.C.hero, st = { ca:0, br:0, mv:0, fe:0, sp:0 };
  host.innerHTML = '<svg class="ty-hsvg" viewBox="0 0 520 266" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.textContent = Hc.caption; f.cap.classList.add("ty-cap"); } }
  if (MV.reduceMotion) { st = { ca:1, br:1, mv:1, fe:1, sp:1 }; draw(); cap(); return; }
  draw();
  MV.wait(350, function(){ MV.tween({ dur:2000, ease:function(t){ return t; }, step:function(t){ st.ca = t; draw(); }, done:function(){
    MV.tween({ dur:500, step:function(t){ st.br = t; draw(); }, done:function(){
      MV.wait(900, function(){ MV.tween({ dur:900, step:function(t){ st.mv = t; draw(); }, done:function(){
        MV.tween({ dur:1300, ease:function(t){ return t; }, step:function(t){ st.fe = t; draw(); }, done:function(){
          MV.tween({ dur:1000, step:function(t){ st.sp = t; draw(); }, done:function(){ MV.wait(150, cap); } });
        } });
      } }); });
    } });
  } }); });
}

// ---------- Explore: Life-stage switcher (@component F6 lifeStageSwitcher + F1 plateCheck + drinkShelf + cafeteriaMenu) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = {}, anim = null, pend = null;
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  var NU = D.nutrients, ST = D.stages, PL = D.plate, DR = D.drinks, MN = D.menu, X = PL.self;
  function emptyDay(){ var d = {}; PL.times.forEach(function(t){ d[t.id] = []; }); return d; }
  function normDay(d){ var o = emptyDay(); if (d) PL.times.forEach(function(t){ o[t.id] = (Array.isArray(d[t.id]) ? d[t.id] : []).filter(function(id){ return byId(PL.cards, id); }); }); return o; }
  S.mode = ["needs", "plate", "drinks"].indexOf(S.mode) >= 0 ? S.mode : "needs";
  S.nut = byId(NU, S.nut) ? S.nut : "ca";
  S.sex = S.sex === "m" ? "m" : "f";
  S.stage = byId(ST, S.stage) ? S.stage : "s14";
  S.who = byId(D.personas, S.who) ? S.who : "lin";
  S.time = byId(PL.times, S.time) ? S.time : "b";
  S.days = S.days || {}; D.personas.forEach(function(p){ S.days[p.id] = normDay(S.days[p.id]); });
  S.drink = byId(DR.list, S.drink) ? S.drink : "water";
  S.mom = byId(DR.moments, S.mom) ? S.mom : "b";
  S.kw = S.kw || {}; DR.moments.forEach(function(m){ if (S.kw[m.id] && !byId(DR.list, S.kw[m.id])) delete S.kw[m.id]; });
  S.menu = S.menu || {}; S.menu.sw = S.menu.sw || {};
  // "My day": memory only (never saved, scored or summarized)
  var SELF = { on:false, sel:false, day:emptyDay() };
  var fx = { grow:null, split:0, splitHide:false, lit:"", caf:null, glow:"" };

  host.innerHTML = '<div class="ty-lab"><div class="ty-main" data-mv="graph"><div id="ty-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="ty-m1"></div><div id="ty-m2"></div><div id="ty-m3"></div></div>' +
    '<div class="ty-side"><h4 class="ty-h4">Readout</h4><dl class="read" id="ty-read" aria-live="polite"></dl></div></div>';
  var modeRG = radios($("#ty-mode"), { label:"Mode", options:[{ id:"needs", t:"Needs curve" }, { id:"plate", t:"Plate check" }, { id:"drinks", t:"Drink shelf" }], value:S.mode,
    onChange:function(v){ cancelAnim(); S.mode = v; MV.banner("", ""); commit(); } });

  // ===== DRI helpers =====
  function nutr(id){ return byId(NU, id || S.nut); }
  function si(id){ for (var i = 0; i < ST.length; i++) if (ST[i].id === id) return i; return 2; }
  function need(n, sex, i){ return (sex === "m" ? n.m : n.f)[i]; }
  function unitTxt(n, v){ return MV.num(v) + " " + n.unit + (n.ug ? " (" + MV.num(v / 40) + " µg)" : ""); }
  function whyTxt(n, sex, i){ var w = (sex === "m" && n.why.m) ? n.why.m : n.why.f; return w[i]; }
  function dri(sex, stage){ var i = si(stage), o = {}; ["ca", "fe", "vd", "fib"].forEach(function(k){ o[k] = need(nutr(k), sex, i); }); return o; }

  // ===== Mode 1: needs curve =====
  var m1 = $("#ty-m1");
  m1.innerHTML = '<div id="ty-nut"></div><div id="ty-sex"></div><p class="tiny muted ty-dri">' + D.driNote + "</p>" +
    '<p class="how">Tap a bar (or use the arrow keys) to choose a life stage.</p><div class="ty-curvew" id="ty-cw"><p class="ty-cunit tiny" id="ty-cunit"></p><div class="ty-bb" id="ty-bb" aria-hidden="true"><span><b>' + D.bracket + '</b></span></div><div id="ty-curve"></div></div>' +
    '<p class="ty-why" id="ty-why" aria-live="polite"></p>';
  var nutRG = radios($("#ty-nut"), { label:"Nutrient", cls:"chips", options:NU.map(function(n){ return { id:n.id, t:n.t, cls:"ty-f-" + n.col }; }), value:S.nut,
    onChange:function(v){ cancelAnim(); S.nut = v; commit(); } });
  var sexRG = radios($("#ty-sex"), { label:"DRI table", options:[{ id:"f", t:"Female" }, { id:"m", t:"Male" }], value:S.sex,
    onChange:function(v){ cancelAnim(); S.sex = v; commit(); } });
  function colOpts(){
    var n = nutr(), max = Math.max.apply(null, n.f.concat(n.m)) * 1.12;
    return ST.map(function(s, i){
      var g = fx.grow ? fx.grow[i] : 1, v = need(n, S.sex, i), split = (fx.split > 0 || fx.splitHide) && i === 2, track, val;
      if (split) {
        var vF = n.f[i], vM = n.m[i], mid = (vF + vM) / 2, t = fx.split;
        track = '<span class="ty-cfill ty-c-' + n.col + ' sf" style="--v:' + r3(lerp(mid, vF, t) / max) + '"><b class="ty-fl">F</b></span><span class="ty-cfill ty-c-' + n.col + ' sm" style="--v:' + r3(lerp(mid, vM, t) / max) + '"><b class="ty-fl">M</b></span>';
        val = t < 1 ? "…" : "F " + MV.num(vF) + " · M " + MV.num(vM);
      } else {
        track = '<span class="ty-cfill ty-c-' + n.col + (S.sex === "m" ? " m" : "") + '" style="--v:' + r3(v / max * g) + '"></span>';
        val = fx.grow && g < 1 ? (g > 0 ? "" : "…") : MV.num(v);
      }
      return { id:s.id, t:'<span class="ty-cv">' + val + '</span><span class="ty-ct">' + track + '</span><span class="ty-cl">' + s.t + "</span>",
        cls:"ty-col" + (split ? " sp" : "") + (n.id === "ca" && (i === 1 || i === 2) ? " bb" : "") + (fx.lit === "bb" && (i === 1 || i === 2) ? " ty-lit" : "") + (fx.lit === "split" && i === 2 ? " ty-lit" : ""),
        aria:s.t + ": " + (split ? (fx.split < 1 ? "hidden until the reveal" : "female " + unitTxt(n, n.f[i]) + ", male " + unitTxt(n, n.m[i])) : (fx.grow && g < 1 ? "hidden until the reveal" : unitTxt(n, v))) };
    });
  }
  var curveRG = radios($("#ty-curve"), { label:"", aria:"Life stage (age in years)", cls:"curve", options:colOpts, value:S.stage,
    onChange:function(v){ cancelAnim(); S.stage = v; commit(); } });
  function paintNeeds(){
    nutRG.set(S.nut); sexRG.set(S.sex); curveRG.set(S.stage); curveRG.repaint();
    var n = nutr(), i = si(S.stage);
    var bb = $("#ty-bb"); bb.hidden = n.id !== "ca"; bb.classList.toggle("ty-lit", fx.lit === "bb");
    $("#ty-cunit").textContent = n.t + ": " + (n.kind === "AI" ? "AI (no RDA is set)" : "RDA") + " in " + n.unit + " a day, " + (S.sex === "m" ? "male" : "female") + " table" + (n.ug ? " (600 IU = 15 µg)" : "");
    $("#ty-why").innerHTML = (fx.splitHide && i === 2) ? "<strong>Why it changes:</strong> …" : "<strong>Why it changes at " + ST[i].t + " (" + (S.sex === "m" ? "male" : "female") + " table):</strong> " + whyTxt(n, S.sex, i);
  }

  // ===== Mode 2: plate check (F1) =====
  var m2 = $("#ty-m2");
  m2.innerHTML = '<div id="ty-who"></div><p class="ty-pdesc tiny" id="ty-pdesc"></p><div id="ty-self"></div>' +
    '<div id="ty-pbody"><p class="tiny muted">' + PL.label + ' <span class="hfa-model">Model data</span></p>' +
    '<div class="ty-pbars" id="ty-pbars" aria-live="polite"></div><p class="ty-vc" id="ty-vc"></p>' +
    '<h5 class="ty-h5">The day</h5><div class="ty-day" id="ty-day"></div>' +
    '<h5 class="ty-h5">Food cards</h5><div id="ty-time"></div><div class="ty-shelfc" id="ty-cards"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="ty-clear" data-k="tyclear">Clear this day</button></div></div>';
  var whoRG = radios($("#ty-who"), { label:"Persona", cls:"chips", options:D.personas.map(function(p){ return { id:p.id, t:p.t + ", " + p.age }; }).concat([{ id:"self", t:X.name, cls:"ty-selfchip" }]),
    value:S.who, onChange:function(v){ cancelAnim(); if (v === "self") { SELF.sel = true; } else { SELF.sel = false; S.who = v; } commit(); } });
  var timeRG = radios($("#ty-time"), { label:"Add to", cls:"chips", options:PL.times, value:S.time, onChange:function(v){ S.time = v; api.save(); paintPlate(); } });
  function curWho(){ return SELF.sel ? "self" : S.who; }
  function dayOf(who){ return who === "self" ? SELF.day : S.days[who]; }
  function whoDri(who){ if (who === "self") return dri(S.sex, "s14"); var p = byId(D.personas, who); return dri(p.sex, p.stage); }
  function cardPct(c, r){ return { ca:c.ca * 13 / r.ca * 100, fe:c.fe * 0.15 / r.fe * 100, d:c.d / r.vd * 100, fib:c.fib / r.fib * 100 }; }
  function totals(who){
    var r = whoDri(who), t = { ca:0, fe:0, d:0, fib:0 }, day = dayOf(who);
    PL.times.forEach(function(tm){ day[tm.id].forEach(function(id){ var p = cardPct(byId(PL.cards, id), r); t.ca += p.ca; t.fe += p.fe; t.d += p.d; t.fib += p.fib; }); });
    Object.keys(t).forEach(function(k){ t[k] = r3(t[k]); });
    return t;
  }
  function pctTxt(v){ return Math.round(v) + "%"; }
  function adeqHTML(t){
    var rows = [["Calcium", t.ca, "micro"], ["Iron", t.fe, "micro"], ["Vitamin D", t.d, "micro"], ["Fibre", t.fib, "carb"]];
    return '<div class="ty-abars">' + rows.map(function(r){
      var low = r[1] < 100;
      return '<div class="ty-abar' + (low ? " low" : "") + '"><span class="ty-alab">' + r[0] + '</span><span class="ty-atrack" aria-hidden="true"><span class="ty-afill ty-c-' + r[2] + '" style="width:' + f1(clamp(r[1] / 200, 0, 1) * 100) + '%"></span><span class="ty-aref"></span></span><span class="ty-aval">' + (r[1] >= 200 ? "200%+" : pctTxt(r[1])) + (low ? " · below 100%" : " ✓") + "</span></div>";
    }).join("") + '<p class="tiny muted ty-akey">The dashed line marks 100% of the DRI. No Calories are shown.</p></div>';
  }
  // notes: tea with plant iron at the same eating time; or plant iron on the day but never with a vitamin C food
  function pairNote(day){
    var ip = false, paired = false, tea = false;
    PL.times.forEach(function(tm){
      var cs = day[tm.id].map(function(id){ return byId(PL.cards, id); });
      if (cs.some(function(c){ return c.ip; })) { ip = true; if (cs.some(function(c){ return c.vc; })) paired = true; if (cs.some(function(c){ return c.tea; })) tea = true; }
    });
    return tea ? PL.teaNote + " " + PL.vitC : ip && !paired ? PL.vitC : "";
  }
  function tagHTML(c){ return (c.tags || []).map(function(t){ return '<span class="ty-tag' + (t === "tea" ? " tea" : "") + '">' + t + "</span>"; }).join(""); }
  function paintPlate(){
    var who = curWho(), self = who === "self";
    whoRG.set(who);
    var p = byId(D.personas, who);
    $("#ty-pdesc").textContent = self ? "" : p.t + ": " + p.desc; $("#ty-pdesc").hidden = self;
    var gate = $("#ty-self");
    gate.hidden = !self;
    if (self) {
      gate.innerHTML = '<p class="ty-priv"><span class="hfa-private">Optional and private</span> ' + X.privacy + "</p>" +
        (SELF.on ? '<p class="tiny">' + X.intro + ' <strong>Table now: ' + (S.sex === "m" ? "male" : "female") + '.</strong></p><div id="ty-sx2"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="ty-sstop" data-k="tysstop">' + X.stop + "</button></div>"
          : '<div class="q-actions"><button type="button" class="btn primary sm" id="ty-sgo" data-k="tysgo">' + X.start + "</button></div>");
      if (SELF.on) radios($("#ty-sx2"), { label:"DRI table", options:[{ id:"f", t:"Female" }, { id:"m", t:"Male" }], value:S.sex, onChange:function(v){ S.sex = v; api.save(); paintPlate(); readPaint(); } });
    }
    $("#ty-pbody").hidden = self && !SELF.on;
    if (self && !SELF.on) return;
    timeRG.set(S.time);
    var day = dayOf(who), r = whoDri(who), t = totals(who), cur = byId(PL.times, S.time);
    $("#ty-pbars").innerHTML = adeqHTML(t);
    $("#ty-vc").textContent = pairNote(day);
    var dh = $("#ty-day");
    MV.keepFocus(dh, function(){
      dh.innerHTML = PL.times.map(function(tm){
        var cs = day[tm.id];
        return '<div class="ty-slot' + (tm.id === S.time ? " cur" : "") + '"><strong>' + tm.t + "</strong>" + (cs.length ? '<ul class="ty-slc">' + cs.map(function(id){ var c = byId(PL.cards, id); return "<li><span>" + c.t + '</span><button type="button" class="ty-rm" data-rm="' + tm.id + "|" + id + '" data-k="rm' + tm.id + id + '" aria-label="' + esc("Remove " + MV.plain(c.t) + " from " + lc(tm.t)) + '">×</button></li>'; }).join("") + "</ul>" : ' <span class="tiny muted">empty</span>') + "</div>";
      }).join("");
    });
    var sh = $("#ty-cards");
    MV.keepFocus(sh, function(){
      sh.innerHTML = PL.cards.map(function(c){
        var q = cardPct(c, r), inCur = day[S.time].indexOf(c.id) >= 0, full = day[S.time].length >= 4;
        var vals = "Calcium " + pctTxt(q.ca) + " · Iron " + pctTxt(q.fe) + " · Vitamin D " + pctTxt(q.d) + " · Fibre " + pctTxt(q.fib);
        return '<div class="ty-card"><div class="ty-cb"><strong>' + c.t + '</strong><span class="ty-tags">' + tagHTML(c) + '</span><span class="ty-cvals">' + vals + "</span></div>" +
          '<button type="button" class="btn ghost sm" data-add="' + c.id + '" data-k="add' + c.id + '"' + (inCur || (full && !inCur) ? " disabled" : "") + ' aria-label="' + esc((inCur ? "Already in " : "Add to ") + lc(cur.t) + ": " + MV.plain(c.t)) + '">' + (inCur ? "In " + lc(cur.t) : "Add to " + lc(cur.t)) + "</button></div>";
      }).join("") + (day[S.time].length >= 4 ? '<p class="tiny ty-full">' + cur.t + " has 4 cards. Remove one, or choose another eating time.</p>" : "");
    });
  }
  m2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var who = curWho();
    if (b.id === "ty-sgo") { SELF.on = true; paintPlate(); readPaint(); var f = $("#ty-cards [data-add]"); if (f) f.focus({ preventScroll:true }); return; }
    if (b.id === "ty-sstop") { SELF.on = false; SELF.day = emptyDay(); paintPlate(); readPaint(); var g = $("#ty-sgo"); if (g) g.focus(); return; }
    var day = dayOf(who);
    if (b.dataset.add) { var L = day[S.time]; if (L.indexOf(b.dataset.add) < 0 && L.length < 4) L.push(b.dataset.add); return changedPlate(who); }
    if (b.dataset.rm) { var q = b.dataset.rm.split("|"), M = day[q[0]], k = M.indexOf(q[1]); if (k >= 0) M.splice(k, 1); changedPlate(who); var nb = $("#ty-day [data-rm]"); if (nb && !document.activeElement.closest("#ty-day")) nb.focus({ preventScroll:true }); return; }
    if (b.id === "ty-clear") { if (who === "self") SELF.day = emptyDay(); else S.days[who] = emptyDay(); changedPlate(who); }
  });
  function changedPlate(who){ if (who === "self") { paintPlate(); readPaint(); return; } commit(); }

  // ===== Mode 3: drink shelf =====
  var m3 = $("#ty-m3");
  m3.innerHTML = '<p class="tiny muted">' + DR.label + ' <span class="hfa-model">Model data</span> Caffeine per container ' + ico("caf") + ", sugar in teaspoons " + ico("sug") + ' (about 4 g each).</p>' +
    '<div class="ty-shelfw" id="ty-shelfw"><div class="ty-shelf" id="ty-shelf" role="group" aria-label="Drink shelf"></div></div>' +
    '<h5 class="ty-h5">' + DR.kwasi + '</h5><div id="ty-mom"></div><ol class="ty-moms" id="ty-moms"></ol><p class="tiny ty-ktot" id="ty-ktot" aria-live="polite"></p>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="ty-kclear" data-k="tykclear">Clear Kwasi’s drinks</button></div>';
  var momRG = radios($("#ty-mom"), { label:"Add to", cls:"chips", options:DR.moments, value:S.mom, onChange:function(v){ S.mom = v; api.save(); paintDrinks(); } });
  var CMAX = 160, TMAX = 13;
  function drink(id){ return byId(DR.list, id); }
  function paintDrinks(){
    momRG.set(S.mom);
    var sh = $("#ty-shelf"), mom = byId(DR.moments, S.mom);
    MV.keepFocus(sh, function(){
      sh.innerHTML = DR.list.map(function(d){
        var cf = fx.caf ? fx.caf[d.id] : 1, hidden = fx.caf && cf === 0, dim = fx.lit === "es" && d.id !== "energy" && d.id !== "sports";
        var cls = "ty-dk" + (S.drink === d.id ? " sel" : "") + (fx.glow === d.id ? " ty-glow" : "") + (dim ? " dim" : "") + ((fx.lit === "es" && (d.id === "energy" || d.id === "sports")) ? " ty-lit" : "");
        var inMom = S.kw[S.mom] === d.id;
        return '<div class="' + cls + '" data-dk="' + d.id + '"><button type="button" class="ty-dsel" data-dsel="' + d.id + '" data-k="ds' + d.id + '" aria-pressed="' + (S.drink === d.id) + '"><strong>' + d.t + "</strong><small>" + d.size + "</small></button>" +
          '<div class="ty-dbar"><span class="ty-dl">' + ico("caf") + 'Caffeine</span><span class="ty-dt"><i class="caf" style="width:' + f1(d.caf / CMAX * 100 * (fx.caf ? cf : 1)) + '%"></i></span><span class="ty-dv">' + (hidden ? "…" : d.caf + " mg") + "</span></div>" +
          '<div class="ty-dbar"><span class="ty-dl">' + ico("sug") + 'Sugar</span><span class="ty-dt"><i class="sug" style="width:' + f1(d.tsp / TMAX * 100) + '%"></i></span><span class="ty-dv">' + d.tsp + " tsp</span></div>" +
          (d.tspNote ? '<p class="ty-dnote tiny">Sugar: ' + d.tspNote + "</p>" : "") +
          '<p class="ty-dn' + (fx.lit === "sports" && d.id === "sports" ? " ty-lit" : "") + '">' + d.note + "</p>" +
          '<button type="button" class="btn ghost sm ty-dadd" data-dadd="' + d.id + '" data-k="da' + d.id + '"' + (inMom ? " disabled" : "") + ' aria-label="' + esc((inMom ? "Already chosen for " : "Choose for ") + lc(mom.t) + ": " + d.t) + '">' + (inMom ? "Chosen for " + lc(mom.t) : "Add to " + lc(mom.t)) + "</button></div>";
      }).join("");
    });
    var ml = $("#ty-moms"), tc = 0, tt = 0;
    MV.keepFocus(ml, function(){
      ml.innerHTML = DR.moments.map(function(m){
        var d = drink(S.kw[m.id]); if (d) { tc += d.caf; tt += d.tsp; }
        return '<li class="' + (m.id === S.mom ? "cur" : "") + '"><strong>' + m.t + ":</strong> " + (d ? d.t + ' <button type="button" class="ty-rm" data-krm="' + m.id + '" data-k="krm' + m.id + '" aria-label="' + esc("Remove " + d.t + " from " + lc(m.t)) + '">×</button>' : '<span class="muted">not chosen</span>') + "</li>";
      }).join("");
    });
    $("#ty-ktot").textContent = "Kwasi’s day so far: caffeine " + tc + " mg · sugar " + tt + " tsp (model values).";
  }
  m3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.dsel) { S.drink = b.dataset.dsel; return commit(); }
    if (b.dataset.dadd) { S.drink = b.dataset.dadd; S.kw[S.mom] = b.dataset.dadd; var nx = DR.moments.filter(function(m){ return !S.kw[m.id]; })[0]; if (nx) S.mom = nx.id; return commit(); }
    if (b.dataset.krm) { delete S.kw[b.dataset.krm]; S.mom = b.dataset.krm; return commit(); }
    if (b.id === "ty-kclear") { S.kw = {}; S.mom = "b"; commit(); }
  });

  // ===== readout =====
  function readPaint(){
    var rows = [];
    if (S.mode === "needs") {
      var n = nutr(), i = si(S.stage), hideS = fx.splitHide && i === 2, sp = fx.split >= 1 && i === 2, gh = fx.grow && fx.grow[i] < 1;
      rows.push(["Life stage", ST[i].t]);
      rows.push([n.kind === "AI" ? "AI (no RDA set)" : "RDA", hideS || gh ? "…" : sp ? "Female " + unitTxt(n, n.f[i]) + " · male " + unitTxt(n, n.m[i]) + " a day" : unitTxt(n, need(n, S.sex, i)) + " a day (" + (S.sex === "m" ? "male" : "female") + " table)"]);
      rows.push(["Why it changes", hideS ? "…" : sp ? n.why.f[i] + " (female) · " + n.why.m[i] + " (male)" : whyTxt(n, S.sex, i)]);
      rows.push(["Food sources", n.sources]);
      rows.push(["Tip", n.tip]);
    } else if (S.mode === "plate") {
      var who = curWho();
      if (who === "self" && !SELF.on) rows.push(["My day", "Not started (optional)"]);
      else {
        var p = byId(D.personas, who), r = whoDri(who), t = totals(who), ix = who === "self" ? 2 : si(p.stage);
        rows.push(["Persona", who === "self" ? "My day (private)" : p.t + ", " + p.age]);
        rows.push(["Life stage", ST[ix].t + " (" + ((who === "self" ? S.sex : p.sex) === "m" ? "male" : "female") + " table)"]);
        rows.push(["DRIs used", "Calcium " + r.ca + " mg · iron " + r.fe + " mg · vitamin D " + r.vd + " IU · fibre " + r.fib + " g (AI)"]);
        rows.push(["The day (model data)", "Calcium " + pctTxt(t.ca) + " · iron " + pctTxt(t.fe) + " · vitamin D " + pctTxt(t.d) + " · fibre " + pctTxt(t.fib)]);
      }
    } else {
      var d = drink(S.drink), hid = fx.caf && fx.caf[d.id] === 0;
      rows.push(["Drink", d.t + " (" + d.size + ")"]);
      rows.push(["Caffeine", hid ? "…" : d.caf + " mg"]);
      rows.push(["Sugar", d.tsp + " tsp (about " + d.tsp * 4 + " g)" + (d.tspNote ? ", " + d.tspNote : "")]);
      rows.push(["Note", d.note]);
      var n2 = DR.moments.filter(function(m){ return S.kw[m.id]; }).length;
      rows.push(["Kwasi’s drinks", n2 + " of " + DR.moments.length + " moments chosen"]);
    }
    $("#ty-read").innerHTML = MV.readoutHTML(rows);
  }

  // ===== paint / commit =====
  function paint(){
    modeRG.set(S.mode);
    m1.hidden = S.mode !== "needs"; m2.hidden = S.mode !== "plate"; m3.hidden = S.mode !== "drinks";
    if (S.mode === "needs") paintNeeds(); else if (S.mode === "plate") paintPlate(); else paintDrinks();
    readPaint();
  }
  function resetFx(){ fx.grow = null; fx.split = 0; fx.splitHide = false; fx.lit = ""; fx.caf = null; fx.glow = ""; }
  function commit(){ resetFx(); api.save(); paint(); MV.changed(); }
  function finish(){ anim = null; fx.grow = null; fx.splitHide = false; paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } resetFx(); if (pend) { var d = pend; pend = null; d(); } }
  paint();

  // ===== TC3: the cafeteria menu (lives inside its challenge card; re-added whenever the toolkit repaints the cards) =====
  var chal = $("#chal");
  function solved(id){ return !!(MV.S.chal && MV.S.chal[id] && MV.S.chal[id].solved); }
  function menuNow(){ return MN.items.map(function(it){ var s = S.menu.sw[it.id]; return s != null ? { id:it.id, t:MN.swaps[s], cat:"most", swapped:true, was:it.t } : { id:it.id, t:it.t, cat:it.cat }; }); }
  function counts(){ var c = { most:0, less:0, np:0 }; menuNow().forEach(function(x){ c[x.cat]++; }); return c; }
  function catT(id){ return byId(MN.cats, id).t; }
  var menuMsg = "";
  function menuHTML(){
    var done = solved("tc3"), dis = done ? " disabled" : "", n = Object.keys(S.menu.sw).length, c = counts();
    var h = '<p class="how">' + CH.tc3.how + '</p><p class="tiny muted">' + MN.note + ' <span class="hfa-model">Model data</span></p><h5 class="ty-h5">' + MN.title + "</h5>";
    h += '<ul class="ty-menu">' + menuNow().map(function(x){
      return '<li class="ty-mi ' + x.cat + (x.swapped ? " sw" : "") + '"><span class="ty-mt">' + x.t + (x.swapped ? ' <span class="tiny muted">(swapped in for ' + lc(x.was) + ")</span>" : "") + '</span><span class="ty-mcat ' + x.cat + '">' + (x.cat === "np" ? ico("warn") : "") + catT(x.cat) + "</span>" +
        (x.swapped ? '<button type="button" class="btn ghost sm" data-mu="' + x.id + '" data-k="mu' + x.id + '"' + dis + ' aria-label="' + esc("Undo the swap for " + x.was) + '">Undo</button>'
          : '<button type="button" class="btn ghost sm" data-ms="' + x.id + '" data-k="ms' + x.id + '"' + (done || n >= 2 ? " disabled" : "") + ' aria-label="' + esc("Swap out " + MV.plain(x.t)) + '">Swap out</button>') + "</li>";
    }).join("") + "</ul>";
    var ORD = { most:0, less:1, np:2 };
    h += '<div class="ty-tally" aria-hidden="true">' + menuNow().sort(function(a, b){ return ORD[a.cat] - ORD[b.cat]; }).map(function(x){ return '<span class="ty-tc ' + x.cat + '">' + (x.cat === "most" ? "M" : x.cat === "less" ? "L" : "N") + "</span>"; }).join("") + '<i class="ty-t80"></i></div>';
    h += '<p class="tiny ty-tline" aria-live="polite">Sell Most <strong>' + c.most + "/10 (" + c.most * 10 + "%)</strong> · Sell Less <strong>" + c.less + "/10 (" + c.less * 10 + "%)</strong> · Not Permitted <strong>" + c.np + "/10</strong> · swaps " + n + " of 2" + (menuMsg ? '<br><span class="ty-cxmsg">' + menuMsg + "</span>" : "") + "</p>";
    return h;
  }
  function stamp(){ return JSON.stringify(S.menu.sw) + menuMsg + (solved("tc3") ? "|s" : ""); }
  function inject(){
    var card = chal && chal.querySelector('[data-c="tc3"]'); if (!card) return;
    var box = card.querySelector(".ty-cx"); if (box && box.dataset.v === stamp()) return;
    if (!box) { box = document.createElement("div"); box.className = "ty-cx"; var head = card.querySelector(".q-head"); card.insertBefore(box, head ? head.nextSibling : card.firstChild); }
    box.dataset.v = stamp();
    MV.keepFocus(box, function(){ box.innerHTML = menuHTML(); });
  }
  if (chal) {
    new MutationObserver(inject).observe(chal, { childList:true });
    chal.addEventListener("click", function(e){
      var b = e.target.closest("[data-ms],[data-mu]"); if (!b) return;
      e.stopImmediatePropagation();   // the toolkit's card handler would look up a button this repaint is about to replace
      if (b.disabled) return;
      menuMsg = "";
      if (b.dataset.ms) {
        if (Object.keys(S.menu.sw).length >= 2) menuMsg = CH.tc3.msgs.full;
        else { var used = Object.keys(S.menu.sw).map(function(k){ return S.menu.sw[k]; }), k = 0; while (used.indexOf(k) >= 0) k++; S.menu.sw[b.dataset.ms] = k; }
      } else delete S.menu.sw[b.dataset.mu];
      api.save(); inject(); MV.liveChallenges();
      var f = chal.querySelector('[data-c="tc3"] [data-k="' + (b.dataset.ms ? "mu" + b.dataset.ms : "ms" + b.dataset.mu) + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true });
    });
  }

  // ===== challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var C = CH[id], M = C.msgs;
    if (id === "tc1") {
      var day = S.days.lin, all = [];
      PL.times.forEach(function(tm){ all = all.concat(day[tm.id]); });
      if (!all.length) return { ok:false, msg:(S.who !== "lin" || SELF.sel) ? M.persona : M.empty };
      var per = PL.times.map(function(tm){ return day[tm.id].map(function(x){ return byId(PL.cards, x); }); });
      if (per.some(function(cs){ return cs.some(function(c){ return c.ip; }) && cs.some(function(c){ return c.tea; }); })) return { ok:false, msg:M.tea };
      var calT = per.filter(function(cs){ return cs.some(function(c){ return c.cal; }); }).length;
      if (calT === 1) return { ok:false, msg:M.spread };
      var t = totals("lin");
      if (t.ca < 100) return { ok:false, msg:fill(M.calcium, { v:Math.floor(t.ca) }) };
      if (calT < 2) return { ok:false, msg:M.spread };
      if (t.fe < 100) return { ok:false, msg:t.fe >= 80 ? M.close : fill(M.iron, { v:Math.floor(t.fe) }) };
      if (!per.some(function(cs){ return cs.some(function(c){ return c.ip; }) && cs.some(function(c){ return c.vc; }); })) return { ok:false, msg:M.pair };
      return { ok:true };
    }
    if (id === "tc2") {
      var K = S.kw, miss = DR.moments.filter(function(m){ return !K[m.id]; });
      if (miss.length) return { ok:false, msg:fill(M.empty, { list:listJoin(miss.map(function(m){ return lc(m.t); })) }) };
      var ds = DR.moments.map(function(m){ return { m:m.id, d:drink(K[m.id]) }; });
      if (ds.some(function(x){ return x.d.id === "energy"; })) return { ok:false, msg:M.energy };
      if (ds.some(function(x){ return x.d.id === "sports" && x.m !== "p"; })) return { ok:false, msg:M.sports };
      var ev = drink(K.e); if (ev.caf > 0) return { ok:false, msg:M.evening + (ev.id === "chocmilk" ? M.choc : "") };
      if (ds.filter(function(x){ return x.d.id === "cola" || x.d.id === "icedtea"; }).length > 1) return { ok:false, msg:M.sweet };
      if (ds.filter(function(x){ return x.d.id === "water"; }).length < 2) return { ok:false, msg:M.water };
      return { ok:true };
    }
    if (id === "tc3") {
      var n = Object.keys(S.menu.sw).length, c = counts();
      if (n !== 2) return { ok:false, msg:fill(M.count, { n:n }) };
      if (c.np > 0) return { ok:false, msg:M.np };
      if (c.less > 2 || c.most < 8) return { ok:false, msg:fill(M.less, { n:c.less, p:c.less * 10 }) };
      return { ok:true };
    }
    return { ok:false };
  }

  // ===== predictions =====
  function reveal(el){ if (!el) return; var r = el.getBoundingClientRect(); if (r.top < 110 || r.bottom > window.innerHeight) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function shelfTo(id){ var c = $('#ty-shelf [data-dk="' + id + '"]'), w = $("#ty-shelfw"); if (c && w) w.scrollLeft = Math.max(0, c.offsetLeft - (w.clientWidth - c.offsetWidth) / 2); }
  return {
    predict:{
      start:function(p){
        cancelAnim();
        if (p.id === "p1") { S.mode = "needs"; S.nut = "ca"; fx.grow = [0, 0, 0, 0]; }
        else if (p.id === "p2") { S.mode = "needs"; S.nut = "fe"; S.stage = "s14"; fx.split = 0; fx.splitHide = true; }
        else if (p.id === "p3") { S.mode = "drinks"; S.drink = "water"; }
        else { S.mode = "drinks"; S.drink = "energy"; fx.caf = {}; DR.list.forEach(function(d){ fx.caf[d.id] = 0; }); }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal($("#ty-cw"));
          anim = MV.tween({ dur:2200, ease:function(t){ return t; }, step:function(t){ fx.grow = [0, 1, 2, 3].map(function(i){ return clamp((t - i * 0.2) / 0.4, 0, 1); }); paintNeeds(); },
            done:function(){ S.stage = "s9"; api.save(); fx.lit = "bb"; finish(); } });
        } else if (p.id === "p2") {
          reveal($("#ty-cw"));
          anim = MV.tween({ dur:1400, step:function(t){ fx.split = t; paintNeeds(); }, done:function(){ fx.split = 1; fx.lit = "split"; finish(); } });
        } else if (p.id === "p3") {
          reveal($("#ty-shelfw")); shelfTo("water");
          var tm = MV.wait(700, function(){ fx.glow = "water"; paintDrinks(); shelfTo("sports");
            tm = MV.wait(900, function(){ fx.lit = "sports"; paintDrinks(); shelfTo("water"); finish(); }); });
          anim = function(){ clearTimeout(tm); };
        } else {
          reveal($("#ty-shelfw")); shelfTo("energy");
          anim = MV.tween({ dur:1500, step:function(t){ DR.list.forEach(function(d){ fx.caf[d.id] = t; }); paintDrinks(); readPaint(); },
            done:function(){ fx.caf = null; fx.lit = "es"; finish(); shelfTo("energy"); } });
        }
      }
    },
    challenge:function(id){ return challenge(id); }
  };
}

// ---------- Part 3: Teen food realities (@component realityStations — four stations: a quick-breakfast box with plate data,
// a food-environment map with labelled pins, supportive-step scenarios, and a 15-minute meal planner with a kitchen card) ----------
// map: schematic streets in a 100 × 70 box; pins in % of the box (pin centre)
var MAP = { school:[40, 50], ff1:[24, 28], ff2:[58, 24], ff3:[20, 76], ff4:[58, 80], conv:[57, 52], groc:[88, 22] };   // 32 % of the width = 500 m
function mapSVG(){
  var s = '<svg class="ty-msvg" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">';
  [12, 35, 58].forEach(function(y){ s += '<line class="ty-st" x1="0" y1="' + y + '" x2="100" y2="' + y + '"/>'; });
  [8, 30, 50, 75].forEach(function(x){ s += '<line class="ty-st" x1="' + x + '" y1="0" x2="' + x + '" y2="70"/>'; });
  s += "</svg>";
  return s;
}
function part3(host, api){
  var D = api.content, S = api.S, ST = D.stations, s1 = ST[0], s2 = ST[1], s3 = ST[2], s4 = ST[3];
  S.box = Array.isArray(S.box) ? S.box.filter(function(id){ return byId(s1.ideas, id); }) : [];
  S.pin = byId(s2.pins, S.pin) ? S.pin : ""; S.seen = S.seen || {};
  S.sc = S.sc || {};
  S.mp = S.mp || {}; S.mp.who = S.mp.who === "kwasi" ? "kwasi" : "lin";
  host.innerHTML = ST.map(function(s){ return '<div class="part ty-sta" id="ty-' + s.id + '"><h3>' + s.t + "</h3><p>" + s.intro + '</p><div class="ty-sbody"></div></div>'; }).join("");
  function body(s){ return $("#ty-" + s.id + " .ty-sbody", host); }
  var SEC = s1.sections;
  function secList(pl){ return pl.map(function(k){ return SEC[k]; }); }
  function hasOf(pl){ var h = {}; pl.forEach(function(k){ h[k] = 1; }); return h; }

  // ----- station 1: the 5-minute morning -----
  var b1 = body(s1);
  b1.innerHTML = '<div class="ty-ideas" role="group" aria-label="Quick breakfast ideas"></div><div class="ty-box"><h4 class="ty-h4">' + ico("clock") + s1.box + '</h4><ul class="ty-boxl" aria-live="polite"></ul></div>' +
    '<details class="alg ty-data"><summary>Check it with data</summary><div class="ty-d1"></div></details>';
  function paint1(){
    var ideas = $(".ty-ideas", b1), list = $(".ty-boxl", b1);
    MV.keepFocus(ideas, function(){ ideas.innerHTML = s1.ideas.map(function(it){ var on = S.box.indexOf(it.id) >= 0; return '<button type="button" class="ty-idea' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-idea="' + it.id + '" data-k="id' + it.id + '"><span>' + it.t + '</span><small>' + (on ? "In the box · tap to take out" : "Add to the box") + "</small></button>"; }).join(""); });
    list.innerHTML = S.box.length ? S.box.map(function(id){ var it = byId(s1.ideas, id); return "<li>" + miniPlate(hasOf(it.plate)) + "<span>" + it.t + "</span></li>"; }).join("") : '<li class="tiny muted">Empty: tap ideas above to add them.</li>';
    $(".ty-d1", b1).innerHTML = S.box.length ? '<div class="tbl-wrap"><table class="ty-tbl"><caption class="vh">Food Guide plate sections for each breakfast in the box</caption><thead><tr><th scope="col">Breakfast</th>' + ["vf", "wg", "pf"].map(function(k){ return '<th scope="col">' + SEC[k] + "</th>"; }).join("") + "</tr></thead><tbody>" +
      S.box.map(function(id){ var it = byId(s1.ideas, id); return '<tr><th scope="row">' + it.t + "</th>" + ["vf", "wg", "pf"].map(function(k){ return "<td>" + (it.plate.indexOf(k) >= 0 ? "✓ yes" : "–") + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div><p>" + s1.data + "</p>"
      : '<p class="tiny muted">Add ideas to the box first.</p>';
  }
  b1.addEventListener("click", function(e){ var b = e.target.closest("[data-idea]"); if (!b) return; var k = S.box.indexOf(b.dataset.idea); if (k >= 0) S.box.splice(k, 1); else S.box.push(b.dataset.idea); api.save(); paint1(); });
  paint1();

  // ----- station 2: the food environment (model map; streets --ink-2, labelled pins) -----
  var b2 = body(s2), PI = { school:"school", ff:"ff", conv:"conv", groc:"groc" };
  b2.innerHTML = '<div class="ty-mapw"><div class="ty-map">' + mapSVG() + '<span class="ty-r500" style="left:' + MAP.school[0] + "%;top:" + MAP.school[1] + '%" aria-hidden="true"><span class="ty-r500l">500 m</span></span>' +
    s2.pins.map(function(p){ var xy = MAP[p.id]; return '<button type="button" class="ty-pin ' + p.kind + '" style="left:' + xy[0] + "%;top:" + xy[1] + '%" data-pin="' + p.id + '" data-k="pin' + p.id + '" aria-pressed="false" aria-label="' + esc(p.t) + '">' + ico(PI[p.kind]) + '<span class="ty-pl" aria-hidden="true">' + p.short + "</span></button>"; }).join("") +
    '</div><p class="tiny muted ty-mapnote">' + s2.lunch + ' <span class="hfa-model">Model map</span> Tap a place.</p></div><div class="ty-pinfo" aria-live="polite"></div>' +
    '<dl class="ty-terms">' + s2.terms.map(function(t){ return "<div><dt>" + t.t + "</dt><dd>" + t.d + "</dd></div>"; }).join("") + '</dl><p class="ty-fair">' + s2.fair + "</p>" +
    '<details class="alg ty-data"><summary>Check it with data</summary><p>' + s2.data + "</p></details>";
  function paint2(){
    $$("[data-pin]", b2).forEach(function(b){ var on = b.dataset.pin === S.pin; b.setAttribute("aria-pressed", String(on)); b.classList.toggle("on", on); b.classList.toggle("seen", !!S.seen[b.dataset.pin]); });
    var p = byId(s2.pins, S.pin), n = Object.keys(S.seen).length, box = $(".ty-pinfo", b2);
    if (!p) { box.innerHTML = '<p class="tiny muted">Tap a place on the map to see its distance, price and time.</p>'; return; }
    box.innerHTML = '<div class="ty-pcard"><h4 class="ty-h4">' + ico(PI[p.kind]) + p.t + "</h4>" + (p.info ? "<p>" + p.info + "</p>" : '<dl class="read">' + MV.readoutHTML([["Distance", p.dist + " (" + p.walk + ")"], ["Price", p.price + " (model)"], ["Time", p.time]]) + "</dl>") +
      '<p class="tiny muted">Places checked: ' + n + " of " + s2.pins.length + "</p></div>";
  }
  b2.addEventListener("click", function(e){ var b = e.target.closest("[data-pin]"); if (!b) return; S.pin = b.dataset.pin; S.seen[S.pin] = 1; api.save(); paint2(); });
  paint2();

  // ----- station 3: stress, schedules and pressure -----
  var b3 = body(s3);
  function paint3(){
    MV.keepFocus(b3, function(){
      b3.innerHTML = s3.scen.map(function(x, i){
        var st = S.sc[x.id] || {}, ri = MV.right(x.opts), done = st.last === ri, fb = "";
        if (st.last != null) { var c = x.opts[st.last], good = st.last === ri; fb = MV.fbHTML(good ? "good" : "bad", "<strong>" + (good ? "✓ A supportive step." : "✗ Not the most supportive step.") + "</strong> " + c.fb + (good ? "" : " Try another.")); }
        return '<div class="ty-scen" data-sc="' + x.id + '"><p class="ty-who"><span class="ty-sn">' + (i + 1) + "</span> <strong>" + x.who + "</strong></p><p>" + x.t + '</p><div class="ty-scc" role="group" aria-label="Next steps">' +
          x.opts.map(function(o, k){ return '<button type="button" class="chip' + (st.last === k ? " on" : "") + '" aria-pressed="' + (st.last === k) + '" data-so="' + k + '" data-k="so' + x.id + k + '"' + (done ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>" + fb + "</div>";
      }).join("") + D.support;
    });
  }
  b3.addEventListener("click", function(e){
    var b = e.target.closest("[data-so]"); if (!b || b.disabled) return;
    var box = b.closest("[data-sc]"), x = byId(s3.scen, box.dataset.sc), st = S.sc[x.id] || (S.sc[x.id] = { tries:0 });
    st.tries++; st.last = +b.dataset.so; api.save(); paint3(); MV.focusFb($('[data-sc="' + x.id + '"]', b3));
  });
  paint3();

  // ----- station 4: plan a 15-minute meal (C1.4) -----
  var b4 = body(s4), rgs = {};
  b4.innerHTML = '<div id="ty-mpw"></div>' + s4.parts.map(function(pt){ return '<div id="ty-mp-' + pt.id + '"></div>'; }).join("") + '<div class="ty-meal" id="ty-meal" aria-live="polite"></div><div id="ty-mkc"></div><p class="tiny">' + s4.link + "</p>";
  function partOpts(pt){ return pt.byWho ? pt.byWho[S.mp.who] : pt.opts; }
  function pick(pt){ var o = partOpts(pt); return byId(o, S.mp[pt.id + (pt.byWho ? "_" + S.mp.who : "")]); }
  rgs.who = radios($("#ty-mpw", b4), { label:"Plan for", cls:"chips", options:s4.who, value:S.mp.who, onChange:function(v){ S.mp.who = v; api.save(); rgs.flav.repaint(); rgs.flav.set(S.mp["flav_" + v] || ""); paint4(); } });
  s4.parts.forEach(function(pt){
    rgs[pt.id] = radios($("#ty-mp-" + pt.id, b4), { label:pt.t, cls:"chips", options:function(){ return partOpts(pt).map(function(o){ return { id:o.id, t:o.t + ' <small class="ty-min">' + o.min + " min</small>" }; }); },
      value:S.mp[pt.id + (pt.byWho ? "_" + S.mp.who : "")] || "", onChange:function(v){ S.mp[pt.id + (pt.byWho ? "_" + S.mp.who : "")] = v; api.save(); paint4(); } });
  });
  function mealParts(){ return s4.parts.map(function(pt){ return { pt:pt, o:pick(pt) }; }); }
  function paint4(){
    var mp = mealParts(), got = mp.filter(function(x){ return x.o; }), min = got.reduce(function(a, x){ return a + x.o.min; }, 0), has = {};
    got.forEach(function(x){ if (x.o.plate) has[x.o.plate] = 1; });
    var who = byId(s4.who, S.mp.who).t;
    var h = '<div class="ty-mealc">' + miniPlate(has, "lg") + "<div><h4 class=\"ty-h4\">" + who + "’s 15-minute meal</h4>" +
      '<ul class="ty-ml">' + mp.map(function(x){ return "<li><strong>" + x.pt.t + ":</strong> " + (x.o ? x.o.t + " (" + x.o.min + " min)" : '<span class="muted">not chosen</span>') + "</li>"; }).join("") + "</ul>" +
      '<p class="tiny">Plate sections: ' + (["vf", "wg", "pf"].filter(function(k){ return has[k]; }).map(function(k){ return SEC[k]; }).join(", ") || "none yet") + "</p>" +
      '<p class="ty-mtime' + (min > 15 ? " over" : "") + '">' + ico("clock") + "About <strong>" + min + " minutes</strong>" + (min > 15 ? ". " + s4.over : got.length === mp.length ? ": ready in 15 minutes or less." : "") + '</p><p class="tiny muted">' + s4.timeNote + "</p></div></div>";
    $("#ty-meal", b4).innerHTML = h;
  }
  function cardLines(){
    var mp = mealParts(), got = mp.filter(function(x){ return x.o; });
    return ["## Before you start", "- Wash your hands.", "- Check allergies."].concat(["## Prepare"], got.length ? got.map(function(x){ return "- " + x.pt.t + ": " + MV.plain(x.o.t) + " (about " + x.o.min + " min)"; }) : ["- Choose a base, a protein, vegetables and a flavour first."],
      ["## Safety", "- Use a clean cutting board for vegetables.", "- Refrigerate leftovers within 2 hours.", "## Reflect", "- Which Food Guide plate sections does this meal cover?"]);
  }
  MV.kitchenCardButton($("#ty-mkc", b4), { title:function(){ return byId(s4.who, S.mp.who).t + "’s 15-minute meal"; }, lines:cardLines, label:"Save my meal as a kitchen card" });
  paint4();
}

// ---------- Practice 2: the model data panel above "Read the data" (HTML bars: female solid, male hatched; letters and values) ----------
function dataChart(){
  var a = byId(MV.C.practice.activities, "data"), host = document.getElementById("act-data");
  if (!a || !host || document.getElementById("ty-dchart")) return;
  var C = a.chart;
  var rows = C.groups.map(function(g, i){
    return '<div class="ty-dgr"><span class="ty-dga">' + g + '</span><span class="ty-dgb"><span class="ty-dgl"><b>F</b><span class="ty-dgt"><i class="f" style="width:' + C.f[i] + '%"></i></span><span class="ty-dgv">' + C.f[i] + "%</span></span>" +
      '<span class="ty-dgl"><b>M</b><span class="ty-dgt"><i class="m" style="width:' + C.m[i] + '%"></i></span><span class="ty-dgv">' + C.m[i] + "%</span></span></span></div>";
  }).join("");
  var desc = C.title + ". " + C.groups.map(function(g, i){ return g + ": female " + C.f[i] + "%, male " + C.m[i] + "%"; }).join("; ") + ".";
  host.insertAdjacentHTML("beforebegin", '<figure class="ty-dchart" id="ty-dchart"><figcaption><strong>' + C.title + '</strong> <span class="hfa-model">' + C.tag + '</span></figcaption><div class="ty-dg" role="img" aria-label="' + esc(desc) + '">' + rows +
    '</div><p class="tiny muted">Bars show the share below the EAR (0–100%). F female (solid), M male (striped). Age in years.</p></figure>');
}

// ---------- Practice 1: the plan's catch-all mismatch line already ends "then try another match." (the toolkit adds
// "Try another partner.", which would repeat it) ----------
function fixMatchText(){
  var h = document.getElementById("act-match"); if (!h || h._tyObs) return; h._tyObs = true;
  var fx = function(){ $$(".fb.bad p", h).forEach(function(p){ var last = p.lastChild; if (last && last.nodeType === 3 && /try another match\. Try another partner\.$/.test(last.nodeValue)) last.nodeValue = last.nodeValue.replace(/ Try another partner\.$/, ""); }); };
  new MutationObserver(fx).observe(h, { childList:true, subtree:true }); fx();
}

// ---------- Performance task: Fuel Kwasi's game day (@component dayPlanner — 6 slots, 1–3 cards each, card library with flags,
// slot tags; the plan's exact tests; kitchen card) ----------
var task = (function(){
  var api = null, slotRG = null, grpRG = null, tmsg = "";
  function T(){ return MV.C.task; }
  function card(id){ return byId(T().library, id); }
  function SL(){ return T().slots; }
  function st(){
    var s = api.S; s.slots = s.slots || {};
    SL().forEach(function(sl){ s.slots[sl.id] = (Array.isArray(s.slots[sl.id]) ? s.slots[sl.id] : []).filter(function(id){ var c = card(id); return c && (sl.id !== "g" || c.dr); }).slice(0, 3); });
    if (!byId(SL(), s.cur)) s.cur = "b";
    if (!byId(T().groups, s.grp)) s.grp = "fam";
    return s;
  }
  function read(){ var s = (api && api.S) ? st() : { slots:{} }, d = {}; SL().forEach(function(sl){ d[sl.id] = (s.slots[sl.id] || []).slice(); }); return d; }
  function cs(d, sid){ return (d[sid] || []).map(card).filter(Boolean); }
  function any(list, f){ return list.some(function(c){ return c[f]; }); }
  function checks(d){
    var b = cs(d, "b"), pg = cs(d, "pg"), g = cs(d, "g"), dn = cs(d, "d"), per = SL().map(function(sl){ return cs(d, sl.id); }), all = [].concat.apply([], per);
    return [
      any(b, "p") && b.some(function(c){ return c.gr || c.vf; }),
      any(pg, "ce") && !any(pg, "hv"),
      g.length > 0 && g.every(function(c){ return c.wa || c.sp; }),
      any(dn, "p") && any(dn, "cd") && any(dn, "vf"),
      per.filter(function(x){ return any(x, "ca"); }).length >= 2,
      !any(all, "en"),
      per.filter(function(x){ return any(x, "vf"); }).length >= 3
    ];
  }
  function valid(d){ var miss = SL().filter(function(sl){ return !(d[sl.id] || []).length; }); return miss.length ? "Add at least one card to " + listJoin(miss.map(function(sl){ return lc(sl.t); })) + "." : true; }
  function key(d){ return SL().map(function(sl){ return sl.id + ":" + (d[sl.id] || []).slice().sort().join(","); }).join("|"); }
  function fromKey(k){ var d = {}; k.split("|").forEach(function(x){ var q = x.split(":"); d[q[0]] = q[1] ? q[1].split(",") : []; }); return d; }
  function slotT(id){ var s = byId(SL(), id); return s ? s.t : id; }
  function text(k){ var d = fromKey(k); return SL().map(function(sl){ return slotT(sl.id) + ": " + cs(d, sl.id).map(function(c){ return lc(c.t); }).join(" + "); }).join(" · "); }
  function label(k){ var d = fromKey(k); return SL().map(function(sl){ return cs(d, sl.id).map(function(c){ return c.t; }).join(" + "); }).join(" · "); }
  function tags(c){ var TG = T().tags, t = []; ["p", "gr", "ce", "cd", "ca", "vf", "hv"].forEach(function(k){ if (c[k]) t.push(TG[k]); }); return t; }
  function tagHTML(c){ return tags(c).map(function(t){ return '<span class="ty-tag' + (t === T().tags.hv ? " hv" : "") + '">' + (t === T().tags.hv ? ico("warn") : "") + t + "</span>"; }).join(""); }
  function paint(){
    var s = st(), inp = $("#tk-lib"); if (!inp) return;
    slotRG.set(s.cur); grpRG.set(s.grp);
    var list = s.slots[s.cur], curT = slotT(s.cur), drinkOnly = s.cur === "g";
    MV.keepFocus(inp, function(){
      inp.innerHTML = T().groups.filter(function(g){ return g.id === s.grp; }).map(function(g){
        return '<div class="ty-lib" role="group" aria-label="' + esc(g.t) + '">' + T().library.filter(function(c){ return c.g === g.id; }).map(function(c){
          var on = list.indexOf(c.id) >= 0, dis = !on && ((drinkOnly && !c.dr) || list.length >= 3);
          return '<button type="button" class="ty-lc' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-lc="' + c.id + '" data-k="lc' + c.id + '"' + (dis ? " disabled" : "") + ' aria-label="' + esc(c.t + (tags(c).length ? " (" + tags(c).join(", ") + ")" : "") + ": " + (on ? "in " + lc(curT) + ", tap to take out" : "add to " + lc(curT))) + '">' +
            '<span class="ty-lct">' + c.t + '</span><span class="ty-tags">' + tagHTML(c) + "</span></button>";
        }).join("") + "</div>";
      }).join("") + (tmsg ? '<p class="ty-cxmsg" role="status">' + tmsg + "</p>" : "") + (drinkOnly ? '<p class="tiny muted">The game drink takes drinks only.</p>' : "");
    });
    var pv = $("#tk-day");
    MV.keepFocus(pv, function(){
      pv.innerHTML = SL().map(function(sl){
        var c2 = s.slots[sl.id].map(card);
        return '<div class="ty-tslot' + (sl.id === s.cur ? " cur" : "") + '"><strong>' + sl.t + "</strong>" + (c2.length ? '<ul class="ty-slc">' + c2.map(function(c){ return "<li><span>" + c.t + (c.en || c.hv ? ' <span class="ty-tags">' + (c.en ? '<span class="ty-tag hv">' + ico("warn") + "energy drink</span>" : "") + (c.hv ? tagHTML({ hv:true }) : "") + "</span>" : "") + '</span><button type="button" class="ty-rm" data-trm="' + sl.id + "|" + c.id + '" data-k="trm' + sl.id + c.id + '" aria-label="' + esc("Remove " + c.t + " from " + lc(sl.t)) + '">×</button></li>'; }).join("") + "</ul>" : ' <span class="tiny muted">empty</span>') + "</div>";
      }).join("");
    });
  }
  function upd(){ api.save(); paint(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<p class="how">' + T().how + '</p><div id="tk-slot"></div><div id="tk-grp"></div><div id="tk-lib"></div>';
      pv.innerHTML = '<div class="ty-tpv"><h4 class="ty-h4">Kwasi’s Saturday</h4><div class="ty-tday" id="tk-day"></div><div class="ty-kc"><p><strong>Kitchen card:</strong> ' + T().kitchen.title + '</p><div id="tk-kc"></div></div></div>';
      slotRG = radios($("#tk-slot"), { label:"Slot", cls:"chips", options:SL(), value:s.cur, onChange:function(v){ var x = st(); x.cur = v; if (v === "g") x.grp = "drk"; tmsg = ""; a.save(); paint(); } });
      grpRG = radios($("#tk-grp"), { label:"Show", cls:"chips", options:T().groups, value:s.grp, onChange:function(v){ st().grp = v; a.save(); paint(); } });
      $("#tk-lib").addEventListener("click", function(e){
        var b = e.target.closest("[data-lc]"); if (!b || b.disabled) return;
        var x = st(), L = x.slots[x.cur], k = L.indexOf(b.dataset.lc); tmsg = "";
        if (k >= 0) L.splice(k, 1); else if (L.length >= 3) tmsg = "Each slot takes 1–3 cards. Take one out first."; else L.push(b.dataset.lc);
        upd();
      });
      $("#tk-day").addEventListener("click", function(e){
        var b = e.target.closest("[data-trm]"); if (!b) return;
        var q = b.dataset.trm.split("|"), L = st().slots[q[0]], k = L.indexOf(q[1]); if (k >= 0) L.splice(k, 1); upd();
        var nb = $("#tk-day [data-trm]"); if (nb) nb.focus({ preventScroll:true });
      });
      MV.kitchenCardButton($("#tk-kc"), { title:T().kitchen.title, lines:T().kitchen.lines, label:T().kitchen.label });
      paint();
    },
    read:read, valid:valid, checks:checks, key:key,
    label:function(k){ return esc(label(k)); },
    text:text
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(){ fixMatchText(); dataChart(); }
});
})();
