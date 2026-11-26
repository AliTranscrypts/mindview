// HFA4U 06 Pregnancy & Lactation: hero (timeline storyboard), Nine months of nutrition (Explore: F6 life-stage timeline with a
// needs bar, F1 plate check with adequacy bars and no Calories, fridge sort; predictions; challenges), Myth or fact? (Part 3:
// F13-style claim cards with "Check it with data", fortification chart), matching-text fix, "Plan a prenatal day" task.
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function lcFirst(s){ return s.charAt(0).toLowerCase() + s.slice(1); }
function r2(v){ return Math.round(v * 100) / 100; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 03 / 02; adds a per-option class and a custom layout class) ----------
//   Segmented control, chip row or custom grid as a real radio group (arrow keys, roving tabindex). No option needs to be checked.
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips"|<custom → class pl-<custom>>, onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "pl-chipset" : o.cls && o.cls !== "seg" ? "pl-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="pl-rgw">' + (lab ? '<span class="pl-rgl">' + lab + "</span>" : "") + '<span class="pl-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
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

// ---------- small inline icons (stroke-only, currentColor; never the only signal) ----------
var ICO = {
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  heat:'<path d="M12 21c-4 0-6-3-6-6 0-4 4-6 4-10 3 2 3 5 3 6 1-1 2-2 2-4 2 2 3 5 3 8 0 3-2 6-6 6z"/>',
  plate:'<circle cx="12" cy="13" r="8"/><circle cx="12" cy="13" r="4.5"/><path d="M3 3v6M5 3v6M4 9v12"/>',
  stop:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  drop:'<path d="M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z"/>'
};
function ico(k, cls){ return '<svg class="pl-ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICO[k] + "</svg>"; }

// ---------- data helpers (content.explore) ----------
function EXC(){ return MV.C.explore; }
var PREG = { w14:1, t1:1, t2:1, t3:1 };
function stIdx(id){ var S = EXC().stages; for (var i = 0; i < S.length; i++) if (S[i].id === id) return i; return 0; }
function nutr(id){ return byId(EXC().nutrients, id); }
function pers(id){ return byId(EXC().personas, id) || EXC().personas[0]; }
function need(n, p, si){ var a = p.teen ? n.teen : n.adult; return a ? a[si] : null; }
function numTxt(n, v){ return n.id === "fluids" ? v.toFixed(1) : MV.num(v); }
function iuTxt(n, v){ return n.iu ? " (" + MV.num(v * n.iu) + " IU)" : ""; }
function amt(n, v){ return numTxt(n, v) + " " + n.unit + iuTxt(n, v); }
function energyTxt(sid){ return EXC().energy[sid]; }
function focusTxt(n, p, si){
  var sid = EXC().stages[si].id;
  if (n.words) return n.t + ": " + lcFirst(energyTxt(sid));
  if (n.none) return n.t + ": " + n.noneText;
  var b = need(n, p, 0), v = need(n, p, si);
  if (si === 0) return n.t + ": " + amt(n, b) + " (" + n.kind + ", age " + p.age + ", not pregnant)";
  if (v > b) return n.t + ": need rises from " + numTxt(n, b) + " to " + amt(n, v);
  if (v < b) return n.t + ": need falls from " + numTxt(n, b) + " to " + amt(n, v);
  return n.t + ": stays at " + amt(n, v);
}
function whyTxt(n, sid){ var w = n.why || {}; return w[sid] || (PREG[sid] ? w.preg : null) || w.all || w.preg || ""; }
function suppTxt(n, sid){ var s = EXC().supp; return (sid === "pre" ? s.pre : sid === "bf" ? s.bf : s.preg) + (n.id === "dha" ? " " + s.dha : ""); }
function colVar(n){ return n.col === "fat" ? "--nu-fat" : n.col === "water" ? "--nu-water" : n.col === "ink" ? "--ink-2" : "--nu-micro"; }

// ---------- plate check model (content.explore.plate; model data) ----------
function PC(){ return EXC().plate.cards; }
function caOf(c, teen){ return c.ca == null ? null : teen ? Math.floor(c.ca * 1000 / 1300 + 1e-9) : c.ca; }
function pctTxt(v){ return Math.round(v) + "%"; }
// adequacy bars: 0–200% track, dashed reference line at 100% (F1); rows [{t, v}]; dha: "yes" | "small" | ""
function adeqHTML(rows, dha){
  return '<div class="pl-abars">' + rows.map(function(r){
    var low = r.v < 100;
    return '<div class="pl-abar' + (low ? " low" : "") + '"><span class="pl-alab">' + r.t + '</span><span class="pl-atrack" aria-hidden="true"><span class="pl-afill" style="width:' + f1(clamp(r.v / 200, 0, 1) * 100) + '%"></span><span class="pl-aref"></span></span><span class="pl-aval">' + (r.v >= 200 ? "200%+" : pctTxt(r.v)) + (low ? " · below 100%" : " ✓") + "</span></div>";
  }).join("") +
  '<div class="pl-abar pl-dharow"><span class="pl-alab">DHA</span><span class="pl-dhas' + (dha === "yes" ? " on" : dha === "small" ? " half" : "") + '"><i aria-hidden="true"></i>' + (dha === "yes" ? "Source on the plate ✓" : dha === "small" ? "A small amount only (egg)" : "No source yet") + "</span></div>" +
  '<p class="tiny muted pl-akey">The dashed line marks 100% of the pregnancy RDA. No Calories are shown.</p></div>';
}
function tagsHTML(tags, av, ht){
  return (tags || []).map(function(t){ var a = av && /avoid/.test(t), h = ht && /heat/.test(t); return '<span class="pl-tag' + (a ? " av" : h ? " ht" : "") + '">' + (a ? ico("warn") : h ? ico("heat") : "") + t + "</span>"; }).join("");
}

// ---------- hero (storyboard: the timeline draws; neural tube marker at about 4 weeks with a folate pulse; iron grows over
// trimesters 2 and 3 as a blood band thickens; vitamin D and DHA rise in; the breastfeeding band appears with a water drop) ----------
var HX = { pre:16, t1:92, t2:200, t3:312, bf:422, end:504, nt:125, axis:198, bandTop:150 };
function heroIcon(kind, x, y, s, o){
  var p = { leaf:'<path d="M-11 9C-11-5-1-12 12-12 12 1 5 10-11 9z"/><path d="M-11 9L5-4"/>',
    drop:'<path d="M0-13C6-5 10 0 10 5A10 10 0 0 1-10 5C-10 0-6-5 0-13z"/>',
    sun:'<circle r="6.5"/><path d="M0-14v4M0 10v4M-14 0h4M10 0h4M-10-10l3 3M7 7l3 3M10-10l-3 3M-7 7l-3 3"/>',
    fish:'<path d="M-13 0C-7-8 5-8 9 0 5 8-7 8-13 0z"/><path d="M9 0l7-6v12z"/><circle cx="-6" cy="-1.5" r="1.3"/>' }[kind.shape];
  return '<g class="pl-hico ' + kind.cls + '" transform="translate(' + f1(x) + " " + f1(y) + ") scale(" + r2(s) + ')" style="opacity:' + r2(o) + '">' + p + "</g>";
}
function heroSVG(st){
  var X = HX, h = "", draw = st.draw, cx = lerp(X.pre, X.bf, draw);
  h += '<defs><clipPath id="pl-hclip"><rect x="0" y="0" width="' + f1(cx + (st.bf > 0 ? lerp(0, X.end - X.bf + 16, st.bf) : 0)) + '" height="250"/></clipPath></defs>';
  h += '<g clip-path="url(#pl-hclip)">';
  // trimester bands
  [[X.t1, X.t2, "Trimester 1"], [X.t2, X.t3, "Trimester 2"], [X.t3, X.bf, "Trimester 3"]].forEach(function(b){
    h += '<rect class="pl-hband" x="' + b[0] + '" y="' + X.bandTop + '" width="' + (b[1] - b[0]) + '" height="' + (X.axis - X.bandTop) + '"/><line class="pl-hsep" x1="' + b[0] + '" y1="' + X.bandTop + '" x2="' + b[0] + '" y2="' + (X.axis + 6) + '"/>' + svgT((b[0] + b[1]) / 2, X.axis + 20, b[2], "pl-hl");
  });
  h += svgT((X.pre + X.t1) / 2, X.axis + 20, "Before", "pl-hl");
  // blood band (iron) thickens over trimesters 2 and 3
  var bh = 2 + 15 * st.iron;
  if (st.iron > 0) h += '<rect class="pl-hblood" x="' + X.t2 + '" y="' + f1(X.axis - bh) + '" width="' + (X.bf - X.t2) + '" height="' + f1(bh) + '" rx="2"/>' + (st.iron > 0.5 ? svgT((X.t2 + X.t3) / 2, X.axis - bh - 5, "iron builds blood", "pl-hs", "middle", ' style="opacity:' + r2((st.iron - 0.5) * 2) + '"') : "");
  // breastfeeding band
  if (st.bf > 0) h += '<g style="opacity:' + r2(st.bf) + '"><rect class="pl-hbf" x="' + X.bf + '" y="' + X.bandTop + '" width="' + (X.end - X.bf) + '" height="' + (X.axis - X.bandTop) + '"/><line class="pl-hsep" x1="' + X.bf + '" y1="' + X.bandTop + '" x2="' + X.bf + '" y2="' + (X.axis + 6) + '"/>' + svgT((X.bf + X.end) / 2, X.axis + 20, "Breastfeeding", "pl-hl") + "</g>";
  h += '<line class="pl-haxis" x1="' + X.pre + '" y1="' + X.axis + '" x2="' + X.end + '" y2="' + X.axis + '"/>';
  h += "</g>";
  // neural tube marker at about 4 weeks
  if (st.nt > 0) {
    var no = Math.min(1, st.nt * 2);
    h += '<g style="opacity:' + r2(no) + '"><line class="pl-hnt" x1="' + X.nt + '" y1="' + (X.bandTop - 4) + '" x2="' + X.nt + '" y2="' + X.axis + '"/><circle class="pl-hntd" cx="' + X.nt + '" cy="' + (X.bandTop - 4) + '" r="5"/>' +
      svgT(X.nt + 8, X.bandTop - 10, "neural tube closes", "pl-hl", "start") + "</g>";
    var so = clamp((st.nt - 0.45) * 2.2, 0, 1);
    if (so > 0) h += svgT(X.nt - 30, X.axis + 42, "often before a pregnancy is known", "pl-hs", "start", ' style="opacity:' + r2(so) + '"');
  }
  // nutrient icons rising and falling above the timeline
  var pulse = st.rm ? 1 : 1 + 0.28 * Math.sin(clamp(st.nt, 0, 1) * Math.PI * 3) * (st.nt < 1 ? 1 : 0);
  var IC = [
    { k:{ shape:"leaf", cls:"micro" }, x:X.nt, t:"Folate", o:clamp(st.nt * 3, 0, 1), s:pulse, dy:0 },
    { k:{ shape:"sun", cls:"micro" }, x:228, t:"Vitamin D", o:clamp(st.iron * 2, 0, 1), s:1, dy:(1 - clamp(st.iron * 2, 0, 1)) * 14 },
    { k:{ shape:"drop", cls:"micro" }, x:316, t:"Iron", o:clamp(st.iron * 3, 0, 1), s:0.65 + 0.55 * st.iron, dy:0 },
    { k:{ shape:"fish", cls:"fat" }, x:392, t:"DHA", o:clamp(st.iron * 2 - 0.6, 0, 1), s:1, dy:(1 - clamp(st.iron * 2 - 0.6, 0, 1)) * 14 },
    { k:{ shape:"drop", cls:"water" }, x:463, t:"Fluids", o:st.bf, s:1, dy:(1 - st.bf) * 14 }
  ];
  IC.forEach(function(c){ if (c.o <= 0) return; h += heroIcon(c.k, c.x, 66 + c.dy, c.s, c.o) + svgT(c.x, 104 + c.dy, c.t, "pl-hl", "middle", ' style="opacity:' + r2(c.o) + '"'); });
  return h;
}
function hero(f){
  fixMatchText();
  var host = $("#pl-hero"); if (!host) return;
  var H = MV.C.hero, st = { draw:0, nt:0, iron:0, bf:0 };
  host.innerHTML = '<svg class="pl-hsvg" viewBox="0 36 520 214" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.textContent = H.caption; f.cap.classList.add("pl-cap"); } }
  if (MV.reduceMotion) { st = { draw:1, nt:1, iron:1, bf:1, rm:true }; draw(); cap(); return; }
  draw();
  MV.wait(400, function(){ MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ st.draw = t; draw(); }, done:function(){
    MV.tween({ dur:1500, ease:function(t){ return t; }, step:function(t){ st.nt = t; draw(); }, done:function(){
      MV.tween({ dur:1700, step:function(t){ st.iron = t; draw(); }, done:function(){
        MV.tween({ dur:1000, step:function(t){ st.bf = t; draw(); }, done:function(){ MV.wait(150, cap); } });
      } });
    } });
  } }); });
}

// ---------- Explore: Nine months of nutrition (@component F6 lifeStageSwitcher + F1 plateCheck + fridgeSort) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = {}, anim = null, pend = null, fsel = null;
  D.challenges.forEach(function(c){ CH[c.id] = c; });
  var STG = D.stages, PL = D.plate;
  S.mode = ["timeline", "plate", "fridge"].indexOf(S.mode) >= 0 ? S.mode : "timeline";
  S.persona = byId(D.personas, S.persona) ? S.persona : "noura";
  S.stage = byId(STG, S.stage) ? S.stage : "pre";
  S.focus = byId(D.nutrients, S.focus) ? S.focus : "folate";
  S.plates = S.plates || {}; S.fridge = S.fridge || {};
  var fx = { pos:null, bar:null, hideE:false, hideF:false, lit:"" };

  host.innerHTML = '<div class="pl-lab"><div class="pl-main" data-mv="graph"><div id="pl-mode"></div><div id="pl-who"></div><p class="pl-pdesc tiny" id="pl-pdesc"></p>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p><div id="pl-m1"></div><div id="pl-m2"></div><div id="pl-m3"></div></div>' +
    '<div class="pl-side"><h4 class="pl-h4">Readout</h4><dl class="read" id="pl-read" aria-live="polite"></dl></div></div>';
  var modeRG = radios($("#pl-mode"), { label:"Mode", options:[{ id:"timeline", t:"Timeline" }, { id:"plate", t:"Plate check" }, { id:"fridge", t:"Fridge sort" }], value:S.mode,
    onChange:function(v){ cancelAnim(); S.mode = v; MV.banner("", ""); commit(); } });
  var whoRG = radios($("#pl-who"), { label:"Persona", cls:"chips", options:D.personas.map(function(p){ return { id:p.id, t:p.t }; }), value:S.persona,
    onChange:function(v){ cancelAnim(); S.persona = v; commit(); } });

  // ===== Timeline mode =====
  var m1 = $("#pl-m1");
  m1.innerHTML = '<div class="pl-tl" id="pl-tl"><div class="pl-bands" aria-hidden="true"><span class="pl-band">Before</span><span class="pl-band tri" style="grid-column:2 / 4">Trimester 1</span><span class="pl-band tri">Trimester 2</span><span class="pl-band tri">Trimester 3</span><span class="pl-band">After birth</span></div>' +
    '<div id="pl-stg"></div><div class="pl-track" aria-hidden="true"><span class="pl-head" id="pl-head"></span></div></div>' +
    '<p class="how">Use the arrow keys or tap a stage to move along the timeline. Then choose a nutrient to focus on.</p>' +
    '<div id="pl-focus"></div><div id="pl-needs" class="pl-needs"></div><p class="pl-mile" id="pl-mile" aria-live="polite"></p>';
  var stgRG = radios($("#pl-stg"), { label:"", aria:"Timeline stage", cls:"stages",
    options:STG.map(function(s, i){ return { id:s.id, t:'<span class="pl-sn" aria-hidden="true">' + (i + 1) + '</span><span class="pl-sl">' + s.short + '</span><span class="pl-sf">' + s.t + "</span>" + (s.id === "w14" ? '<span class="pl-ntm" aria-hidden="true"></span>' : "") }; }),
    value:S.stage, onChange:function(v){ cancelAnim(); S.stage = v; commit(); } });
  var focRG = radios($("#pl-focus"), { label:"Focus", cls:"chips", options:D.nutrients.map(function(n){ return { id:n.id, t:n.t, cls:"pl-f-" + n.col }; }), value:S.focus,
    onChange:function(v){ cancelAnim(); S.focus = v; commit(); } });
  function needsHTML(){
    var n = nutr(S.focus), p = pers(S.persona), si = stIdx(S.stage), st = STG[si], sid = st.id, col = colVar(n);
    var h = '<div class="pl-nbh"><strong>' + n.t + "</strong>";
    if (n.none) return h + '</div><div class="pl-none"><p>' + MV.cap(n.noneText) + '</p><p class="tiny muted">' + n.sources + ".</p></div>";
    if (n.words) {
      // VERIFY: shape only (no numbers): "a little more" drawn as a small extension of the usual bar.
      var ext = /^(t2|t3|bf)$/.test(sid) ? 14 : 0, hideE = fx.hideE;
      h += ' <span class="tiny muted">words only: no Calories</span></div>';
      h += '<div class="pl-bar"><span class="pl-bl">Usual (not pregnant)</span><span class="pl-bt"><i class="base" style="width:70%"></i></span><span class="pl-bv">usual</span></div>';
      h += '<div class="pl-bar now' + (fx.lit === "energy" ? " pl-lit" : "") + '"><span class="pl-bl">' + st.t + '</span><span class="pl-bt"><i style="width:' + (hideE ? 70 : 70 + ext) + "%;background:var(" + col + ')"></i></span><span class="pl-bv">' + (hideE ? "…" : ext ? "a little more" : sid === "pre" ? "usual" : "no extra") + "</span></div>";
      return h + '<p class="pl-chg' + (fx.lit === "energy" ? " pl-lit" : "") + '">' + (hideE ? "…" : esc(energyTxt(sid))) + "</p>";
    }
    var b = need(n, p, 0), v = fx.bar != null ? fx.bar : need(n, p, si), all = p.teen ? n.teen : n.adult, max = Math.max.apply(null, all) * 1.12;
    h += ' <span class="tiny muted">' + n.kind + ", " + n.unit + "</span></div>";
    h += '<div class="pl-bar"><span class="pl-bl">Usual (age ' + p.age + ', not pregnant)</span><span class="pl-bt"><i class="base" style="width:' + f1(b / max * 100) + '%"></i></span><span class="pl-bv">' + numTxt(n, b) + "</span></div>";
    h += '<div class="pl-bar now"><span class="pl-bl">' + st.t + '</span><span class="pl-bt"><i style="width:' + f1(v / max * 100) + "%;background:var(" + col + ')"></i></span><span class="pl-bv">' + (fx.hideF ? "…" : n.id === "fluids" ? v.toFixed(1) : MV.num(Math.round(v))) + "</span></div>";
    var ch = "";
    if (fx.hideF) ch = "…";
    else if (si === 0) ch = "This is the usual need for age " + p.age + ".";
    else { var r = Math.round((v / b - 1) * 20) * 5; ch = r > 0 ? "Up about " + r + "% from the usual need" : r < 0 ? "Down about " + (-r) + "% from the usual need" : "No change from the usual need"; }
    return h + '<p class="pl-chg' + (fx.lit === "chg" ? " pl-lit" : "") + '">' + ch + "</p>";
  }
  function paintTimeline(){
    stgRG.set(S.stage); focRG.set(S.focus);
    var si = stIdx(S.stage), pos = fx.pos != null ? fx.pos : si;
    $("#pl-stg").classList.toggle("nt", S.stage === "w14");
    $("#pl-head").style.left = f1((pos + 0.5) / STG.length * 100) + "%";
    $("#pl-needs").innerHTML = needsHTML();
    var mile = $("#pl-mile"); mile.innerHTML = '<strong>Milestone:</strong> ' + STG[si].milestone; mile.classList.toggle("pl-lit", fx.lit === "mile");
  }

  // ===== Plate check mode =====
  var m2 = $("#pl-m2");
  m2.innerHTML = '<p class="pl-ph" id="pl-ph"></p><p class="tiny muted">' + PL.label + ' <span class="hfa-model">Model data</span></p><p class="tiny pl-teen" id="pl-teen" hidden>' + PL.teenNote + "</p>" +
    '<div class="pl-pin" id="pl-pbars" aria-live="polite"></div><p class="pl-vc" id="pl-vc"></p>' +
    '<h5 class="pl-h5">On the plate</h5><ul class="pl-on" id="pl-on"></ul>' +
    '<h5 class="pl-h5">Food cards</h5><p class="how">Add cards with their buttons. Cards may be added more than once.</p><div class="pl-shelf" id="pl-shelf"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="pl-clear" data-k="plclear">Clear this plate</button></div>';
  function plateOf(pid){ var P = S.plates[pid] || (S.plates[pid] = { c:{}, heat:false }); P.c = P.c || {}; return P; }
  function items(pid){ var P = plateOf(pid), out = []; PC().forEach(function(c){ for (var i = 0; i < (P.c[c.id] || 0); i++) out.push(c); }); return out; }
  function counts(c, pid){ return !(c.ht && !plateOf(pid).heat) && c.f != null; }
  function totals(pid){
    var teen = pers(pid).teen, t = { f:0, fe:0, ca:0, d:0, dha:"" };
    items(pid).forEach(function(c){
      if (counts(c, pid)) { t.f += c.f; t.fe += c.fe; t.ca += caOf(c, teen); t.d += c.d; }
      if (c.dha === "yes") t.dha = "yes"; else if (c.dha === "small" && !t.dha) t.dha = "small";
    });
    return t;
  }
  function vitCNote(pid){ var it = items(pid); return it.some(function(c){ return c.ip; }) && !it.some(function(c){ return c.vc; }); }
  function persName(pid){ return pers(pid).t; }
  function paintPlate(){
    var pid = S.persona, p = pers(pid), P = plateOf(pid), t = totals(pid), si = stIdx(S.stage);
    $("#pl-ph").innerHTML = "<strong>" + p.t + "’s day</strong> · " + STG[si].t;
    $("#pl-teen").hidden = !p.teen;
    $("#pl-pbars").innerHTML = adeqHTML([{ t:"Folate", v:t.f }, { t:"Iron", v:t.fe }, { t:"Calcium", v:t.ca }, { t:"Vitamin D", v:t.d }], t.dha);
    $("#pl-vc").textContent = vitCNote(pid) ? PL.vitC : "";
    var on = $("#pl-on"), list = PC().filter(function(c){ return P.c[c.id]; });
    MV.keepFocus(on, function(){
      on.innerHTML = list.length ? list.map(function(c){
        return '<li><span class="pl-ont">' + c.t + (P.c[c.id] > 1 ? ' <strong class="pl-x">× ' + P.c[c.id] + "</strong>" : "") + "</span>" +
          '<span class="pl-onb"><button type="button" class="btn ghost sm" data-dec="' + c.id + '" data-k="dec' + c.id + '" aria-label="' + esc("Remove one: " + MV.plain(c.t)) + '">Remove</button>' +
          '<button type="button" class="btn ghost sm" data-add="' + c.id + '" data-k="inc' + c.id + '" aria-label="' + esc("Add another: " + MV.plain(c.t)) + '">+1</button></span>' +
          (c.ht ? '<label class="pl-heat"><input type="checkbox" data-heat="1"' + (P.heat ? " checked" : "") + "> Heated until steaming</label>" : "") + "</li>";
      }).join("") : '<li class="muted tiny">Nothing yet. Add food cards below.</li>';
    });
    var sh = $("#pl-shelf");
    MV.keepFocus(sh, function(){
      sh.innerHTML = PC().map(function(c){
        var vals = c.f == null ? "Not counted on the plate" : "Folate " + c.f + "% · Iron " + c.fe + "% · Calcium " + caOf(c, p.teen) + "% · Vitamin D " + c.d + "%" + (c.dha === "yes" ? " · DHA ✓" : c.dha === "small" ? " · DHA (small)" : "");
        return '<div class="pl-card"><div class="pl-cb"><strong>' + c.t + '</strong><span class="pl-tags">' + tagsHTML(c.tags, c.av, c.ht) + '</span><span class="pl-cv">' + vals + "</span></div>" +
          '<button type="button" class="btn ghost sm" data-add="' + c.id + '" data-k="add' + c.id + '" aria-label="' + esc("Add " + MV.plain(c.t) + " to " + p.t + "’s day") + '">Add' + (P.c[c.id] ? " (" + P.c[c.id] + ")" : "") + "</button></div>";
      }).join("");
    });
  }
  m2.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var P = plateOf(S.persona);
    if (b.dataset.add) { P.c[b.dataset.add] = Math.min(9, (P.c[b.dataset.add] || 0) + 1); commit(); return; }
    if (b.dataset.dec) { var k = b.dataset.dec; P.c[k] = Math.max(0, (P.c[k] || 0) - 1); if (!P.c[k]) delete P.c[k]; commit(); return; }
    if (b.id === "pl-clear") { P.c = {}; P.heat = false; commit(); }
  });
  m2.addEventListener("change", function(e){ if (e.target.dataset && e.target.dataset.heat) { plateOf(S.persona).heat = e.target.checked; commit(); } });

  // ===== Fridge sort mode =====
  var m3 = $("#pl-m3"), FR = D.fridge, BIC = { enjoy:"plate", cook:"heat", avoid:"stop" };
  m3.innerHTML = "<h5 class=\"pl-h5\">" + FR.title + '</h5><p class="how">Tap an item, then tap the bin it belongs in. To move an item, tap it in its bin, then tap another bin.</p>' +
    '<div class="pl-tray" role="group" aria-label="Items in the fridge" id="pl-tray"></div><p class="tiny" id="pl-fst" aria-live="polite"></p><div class="pl-bins" id="pl-bins"></div>' +
    '<div class="q-actions"><button type="button" class="btn ghost sm" id="pl-freset" data-k="plfreset">Put everything back in the fridge</button></div>';
  function itemBtn(it){ return '<button type="button" class="pl-fi" data-fi="' + it.id + '" data-k="fi' + it.id + '" aria-pressed="' + (fsel === it.id) + '">' + it.t + "</button>"; }
  function paintFridge(){
    var left = FR.items.filter(function(it){ return !S.fridge[it.id]; });
    var tray = $("#pl-tray"), bins = $("#pl-bins");
    MV.keepFocus(tray, function(){ tray.innerHTML = left.length ? left.map(itemBtn).join("") : '<p class="tiny muted">The fridge is empty: every item is in a bin.</p>'; });
    MV.keepFocus(bins, function(){
      bins.innerHTML = FR.bins.map(function(b){
        var inside = FR.items.filter(function(it){ return S.fridge[it.id] === b.id; });
        return '<div class="pl-bin pl-bin-' + b.id + '"><button type="button" class="pl-binb' + (fsel ? " ready" : "") + '" data-bin="' + b.id + '" data-k="bin' + b.id + '">' + ico(BIC[b.id]) + "<strong>" + b.t + "</strong>" + (fsel ? '<span class="tiny">Place here</span>' : "") + "</button>" +
          '<div class="pl-binin">' + (inside.length ? inside.map(itemBtn).join("") : '<span class="tiny muted">Empty</span>') + "</div></div>";
      }).join("");
    });
    var sel = byId(FR.items, fsel);
    $("#pl-fst").textContent = sel ? "Selected: " + MV.plain(sel.t) + ". Now tap a bin." : left.length ? left.length + " of " + FR.items.length + " items still in the fridge." : "All " + FR.items.length + " items are in bins. Check challenge 2 below.";
  }
  m3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.fi) { fsel = fsel === b.dataset.fi ? null : b.dataset.fi; paintFridge(); return; }
    if (b.dataset.bin) {
      if (!fsel) { $("#pl-fst").textContent = "Tap an item first, then tap the bin it belongs in."; return; }
      S.fridge[fsel] = b.dataset.bin; fsel = null; commit();
      var nx = $("#pl-tray [data-fi]"); if (nx) nx.focus({ preventScroll:true });
      return;
    }
    if (b.id === "pl-freset") { S.fridge = {}; fsel = null; commit(); }
  });

  // ===== readout =====
  function readPaint(){
    var n = nutr(S.focus), p = pers(S.persona), si = stIdx(S.stage), sid = STG[si].id;
    var rows = [
      ["Stage", STG[si].t],
      ["Milestone", STG[si].milestone],
      ["Focus nutrient", (fx.hideE && n.words) || fx.hideF ? "…" : focusTxt(n, p, si)],
      ["Why it matters now", (fx.hideE && n.words) ? "…" : whyTxt(n, sid)],
      ["Food sources", n.sources],
      ["Supplement note", suppTxt(n, sid)],
      ["Energy", fx.hideE ? "…" : energyTxt(sid)]
    ];
    if (S.mode === "plate") { var t = totals(S.persona); rows.push(["Plate (model data)", "Folate " + pctTxt(t.f) + " · Iron " + pctTxt(t.fe) + " · Calcium " + pctTxt(t.ca) + " · Vitamin D " + pctTxt(t.d)]); }
    if (S.mode === "fridge") rows.push(["Fridge", FR.items.filter(function(it){ return S.fridge[it.id]; }).length + " of " + FR.items.length + " items in bins"]);
    $("#pl-read").innerHTML = MV.readoutHTML(rows);
  }

  // ===== paint / commit =====
  function paint(){
    modeRG.set(S.mode); whoRG.set(S.persona);
    $("#pl-pdesc").textContent = pers(S.persona).t + ": " + pers(S.persona).desc;
    $("#pl-who").hidden = S.mode === "fridge"; $("#pl-pdesc").hidden = S.mode === "fridge";
    m1.hidden = S.mode !== "timeline"; m2.hidden = S.mode !== "plate"; m3.hidden = S.mode !== "fridge";
    if (S.mode === "timeline") paintTimeline(); else if (S.mode === "plate") { stickTop(); paintPlate(); } else paintFridge();
    readPaint();
  }
  function commit(){ fx.lit = ""; api.save(); paint(); MV.changed(); }
  function resetFx(){ fx.pos = null; fx.bar = null; fx.hideE = false; fx.hideF = false; }
  function finish(){ anim = null; resetFx(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } resetFx(); fx.lit = ""; if (pend) { var d = pend; pend = null; d(); } }
  paint();

  // ===== challenges (plan's exact tests and named wrong states) =====
  function animalList(list){ var seen = {}; return list.filter(function(c){ if (!c.an || seen[c.id]) return false; seen[c.id] = 1; return true; }).map(function(c){ return lcFirst(MV.plain(c.t)); }).join(", "); }
  function challenge(id, live){
    var C = CH[id], M = C.msgs;
    if (id === "tc1") {
      if (S.persona !== "noura") return { ok:false, msg:M.persona };
      var it = items("noura"), P = plateOf("noura");
      if (!it.length) return { ok:false, msg:M.empty };
      var has = function(k){ return it.some(function(c){ return c.id === k; }); };
      if (has("pate")) return { ok:false, msg:M.pate };
      if (has("deli") && !P.heat) return { ok:false, msg:M.deli };
      var av = it.filter(function(c){ return c.av; })[0]; if (av) return { ok:false, msg:av.why };
      var foods = it.filter(function(c){ return !c.sp; }).length, supp = it.some(function(c){ return c.sp; });
      if (foods < 3) return { ok:false, msg:supp ? M.multi : M.foods };
      var t = totals("noura");
      if (t.f < 100) return { ok:false, msg:fill(M.folate, { v:Math.round(t.f) }) };
      if (t.fe < 100) return { ok:false, msg:t.fe >= 80 ? M.ironClose : fill(M.iron, { v:Math.round(t.fe) }) };
      return { ok:true };
    }
    if (id === "tc2") {
      var F = S.fridge;
      if (F.ham === "enjoy") return { ok:false, msg:M.ham };
      if (F.sword === "enjoy") return { ok:false, msg:M.sword };
      if (F.wine === "cook") return { ok:false, msg:M.wine };
      var nl = FR.items.filter(function(x){ return !F[x.id]; }).length;
      if (nl) return { ok:false, msg:fill(M.unplaced, { n:nl }) };
      var k = FR.items.filter(function(x){ return F[x.id] === MV.ans(x); }).length;
      if (k < FR.items.length) return { ok:false, msg:fill(M.count, { k:k }) };
      return { ok:true };
    }
    if (id === "tc3") {
      if (S.persona !== "jess") return { ok:false, msg:M.persona };
      var jt = items("jess");
      if (!jt.length) return { ok:false, msg:M.empty };
      if (jt.some(function(c){ return c.id === "salmon"; })) return { ok:false, msg:M.salmon };
      if (jt.some(function(c){ return c.an; })) return { ok:false, msg:fill(M.animal, { list:animalList(jt) }) };
      if (!jt.some(function(c){ return c.dha === "yes"; })) return { ok:false, msg:M.dha };
      var tj = totals("jess");
      if (tj.f < 100) return { ok:false, msg:fill(M.folate, { v:Math.round(tj.f) }) };
      if (tj.fe < 100) return { ok:false, msg:fill(M.iron, { v:Math.round(tj.fe) }) };
      if (tj.ca < 100) return { ok:false, msg:M.calcium };
      if (!live && vitCNote("jess")) MV.banner("", PL.vitC);
      return { ok:true };
    }
    return { ok:false };
  }

  // ===== predictions (each glides the timeline, then reveals) =====
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function glide(to, after){
    anim = MV.tween({ dur:500 + to * 450, step:function(t){ fx.pos = t * to; S.stage = STG[Math.round(fx.pos)].id; paintTimeline(); readPaint(); },
      done:function(){ fx.pos = null; S.stage = STG[to].id; api.save(); after(); } });
  }
  return {
    predict:{
      start:function(p){
        cancelAnim(); S.mode = "timeline"; S.stage = "pre";
        if (p.id === "p1") S.focus = "folate";
        else if (p.id === "p2") { S.persona = "noura"; S.focus = "iron"; }
        else if (p.id === "p3") { S.persona = "noura"; S.focus = "calcium"; }
        else if (p.id === "p4") { S.focus = "energy"; fx.hideE = true; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done; reveal($("#pl-tl"));
        var n = nutr(S.focus), per = pers(S.persona);
        if (p.id === "p1") glide(1, function(){ fx.lit = "mile"; finish(); });
        else if (p.id === "p2") {
          var b0 = need(n, per, 0), b1 = need(n, per, 3);
          fx.bar = b0; fx.hideF = true;
          glide(3, function(){ fx.hideF = false; anim = MV.tween({ dur:1400, step:function(t){ fx.bar = lerp(b0, b1, t); paintTimeline(); }, done:function(){ fx.lit = "chg"; finish(); } }); });
        }
        else if (p.id === "p3") { fx.hideF = true; glide(3, function(){ fx.lit = "chg"; finish(); }); }
        else glide(2, function(){ fx.hideE = false; fx.lit = "energy"; finish(); });
      }
    },
    challenge:function(id, opt){ return challenge(id, !!(opt && opt.live)); }
  };
}
// phone: the plate-check bars stay pinned under the sticky header
function stickTop(){
  var h = document.querySelector("header.top"); if (!h) return;
  var top = parseFloat(getComputedStyle(h).top) || 0;
  document.documentElement.style.setProperty("--pl-top", Math.round(top + h.offsetHeight) + "px");
}
window.addEventListener("resize", function(){ stickTop(); });

// ---------- Part 3: Myth or fact? (@component F13 claimCards — one claim at a time, verdict, "Check it with data") ----------
function ntdSVG(I){
  var x0 = 58, x1 = 450, y0 = 30, y1 = 178, n = I.years.length, bw = (x1 - x0) / n, max = 1.12, h = "";
  h += '<line class="pl-ntax" x1="' + x0 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '"/><line class="pl-ntax" x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '"/>';
  I.years.forEach(function(yr, i){
    var x = x0 + i * bw, bh = I.rate[i] / max * (y1 - y0);
    h += '<rect class="pl-ntbar' + (yr >= 1998 ? " after" : "") + '" x="' + f1(x + bw * 0.17) + '" y="' + f1(y1 - bh) + '" width="' + f1(bw * 0.66) + '" height="' + f1(bh) + '"/>';
    h += svgT(x + bw / 2, y1 + 17, "’" + String(yr).slice(2), "pl-ntyr");
  });
  var xm = x0 + 5 * bw;
  h += '<line class="pl-ntline" x1="' + f1(xm) + '" y1="' + (y0 - 14) + '" x2="' + f1(xm) + '" y2="' + y1 + '"/>' + svgT(xm + 6, y0 - 4, "1998: folic acid added to flour", "pl-ntlab", "start");
  h += svgT(x0 + 2.5 * bw, y0 + 6, "Before", "pl-ntlab") + svgT(x0 + 8 * bw, y0 + 30, "After", "pl-ntlab");
  h += svgT(18, (y0 + y1) / 2, "Defect rate (model data)", "pl-ntyl", "middle", ' transform="rotate(-90 18 ' + f1((y0 + y1) / 2) + ')"');
  h += svgT((x0 + x1) / 2, y1 + 36, "Year (1993–2002)", "pl-ntyr");
  return h;
}
function part3(host, api){
  var D = api.content, S = api.S, CL = D.claims, I = D.inquiry, VD = D.verdicts;
  S.i = clamp(S.i | 0, 0, CL.length - 1); S.v = S.v || {}; S.inq = S.inq || {};
  host.innerHTML = '<div class="pl-cls" id="pl-cls"></div><div class="pl-inq" id="pl-inq" hidden></div>';
  var box = $("#pl-cls", host), iq = $("#pl-inq", host);
  function ansOf(c){ var a = String(MV.ans(c)); return { v:a.split("-")[0], mostly:/mostly/.test(a) }; }
  function phrase(a){ return a.v === "myth" ? (a.mostly ? "it’s mostly a myth" : "it’s a myth") : a.v === "fact" ? "it’s a fact" : "it depends"; }
  function paintClaim(){
    var c = CL[S.i], ch = S.v[c.id], a = ansOf(c), done = CL.filter(function(x){ return S.v[x.id]; }).length;
    var right = CL.filter(function(x){ return S.v[x.id] && S.v[x.id] === ansOf(x).v; }).length;
    var h = '<div class="pl-clt"><span class="tiny muted">Claim ' + (S.i + 1) + " of " + CL.length + '</span><span class="dots" aria-hidden="true">' + CL.map(function(x, i){ return '<span class="dot' + (S.v[x.id] ? " done" : "") + (i === S.i ? " cur" : "") + '"></span>'; }).join("") + "</span></div>";
    h += '<blockquote class="pl-claim"><p>' + c.t + "</p></blockquote>";
    h += '<div class="pl-vds" role="group" aria-label="Your verdict">' + VD.map(function(v){
      var cls = "pl-vd" + (ch === v.id ? " on" : "") + (ch && v.id === a.v ? " right" : "") + (ch && ch === v.id && v.id !== a.v ? " wrong" : "");
      return '<button type="button" class="' + cls + '" data-vd="' + v.id + '" data-k="vd' + v.id + '" aria-pressed="' + (ch === v.id) + '"' + (ch ? " disabled" : "") + ">" + v.t + "</button>";
    }).join("") + "</div>";
    if (ch) {
      var good = ch === a.v;
      h += '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p><strong>' + (good ? "✓ Right: " : "✗ Not quite: ") + phrase(a) + ".</strong>" + (c.core ? " " + c.core : "") + "</p></div>";
      h += '<details class="alg pl-data"><summary>Check it with data</summary><p class="pl-src"><span class="tag">Source</span> ' + c.src + "</p><p>" + c.data + "</p></details>";
      if (c.id === "c2") h += '<p class="tiny pl-goinq">Then read the fortification chart below the claim cards.</p>';
    } else h += '<p class="tiny muted">Choose a verdict to unlock <strong>Check it with data</strong>.</p>';
    h += '<div class="q-actions"><button type="button" class="btn ghost sm" data-nav="-1" data-k="clprev"' + (S.i === 0 ? " disabled" : "") + '>Previous claim</button><button type="button" class="btn ' + (ch ? "primary" : "ghost") + ' sm" data-nav="1" data-k="clnext"' + (S.i === CL.length - 1 ? " disabled" : "") + ">Next claim</button></div>";
    h += '<p class="tiny muted">Claims checked: ' + done + " of " + CL.length + (done ? " · right on your verdict: " + right : "") + "</p>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
    paintInq();
  }
  function paintInq(){
    iq.hidden = !S.v.c2; if (iq.hidden) return;
    var st = S.inq, ri = MV.right(I.choices), done = st.last === ri;
    var fb = "";
    if (st.last != null) { var c = I.choices[st.last], good = st.last === ri; fb = '<div class="fb ' + (good ? "good" : "bad") + '" role="status"><p>' + (/^(Right|Not quite)/.test(MV.plain(c.fb)) ? "<strong>" + (good ? "✓ " : "✗ ") + "</strong>" : "") + c.fb + "</p></div>"; }
    var h = "<h4>" + I.title + ' <span class="hfa-model">' + I.tag + "</span></h4>" +
      '<svg class="pl-ntsvg" viewBox="0 0 460 222" role="img" aria-label="Bar chart, model data with an illustrative shape: the rate of neural tube defects stays about level from 1993 to 1997, then falls after 1998, when folic acid was added to white flour and enriched pasta, and stays at a lower level to 2002.">' + ntdSVG(I) + "</svg>" +
      '<p class="pl-iqp"><strong>' + I.prompt + "</strong></p>" +
      '<div class="pl-iqc" role="group" aria-label="Choices">' + I.choices.map(function(c, i){ return '<button type="button" class="chip' + (st.last === i ? " on" : "") + '" aria-pressed="' + (st.last === i) + '" data-iq="' + i + '" data-k="iq' + i + '"' + (done ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>" + fb;
    MV.keepFocus(iq, function(){ iq.innerHTML = h; });
  }
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.vd) { S.v[CL[S.i].id] = b.dataset.vd; api.save(); paintClaim(); MV.focusFb(box); return; }
    if (b.dataset.nav) { S.i = clamp(S.i + (+b.dataset.nav), 0, CL.length - 1); api.save(); paintClaim(); var f = box.querySelector('[data-k="vd' + VD[0].id + '"]:not([disabled])') || box.querySelector('[data-k="clnext"]:not([disabled])') || box.querySelector('[data-k="clprev"]'); if (f) f.focus({ preventScroll:true }); }
  });
  iq.addEventListener("click", function(e){
    var b = e.target.closest("[data-iq]"); if (!b || b.disabled) return;
    var st = S.inq, ri = MV.right(I.choices); st.tries = (st.tries || 0) + 1; st.last = +b.dataset.iq;
    if (st.first == null && st.last === ri) st.first = st.tries === 1;
    api.save(); paintInq(); MV.focusFb(iq);
  });
  paintClaim();
}

// ---------- Practice 1: the plan's catch-all mismatch line already ends "then try another match." (the toolkit adds
// "Try another partner.", which would repeat it) ----------
function fixMatchText(){
  var h = document.getElementById("act-match"); if (!h || h._plObs) return; h._plObs = true;
  var fx = function(){ $$(".fb.bad p", h).forEach(function(p){ var last = p.lastChild; if (last && last.nodeType === 3 && /try another match\. Try another partner\.$/.test(last.nodeValue)) last.nodeValue = last.nodeValue.replace(/ Try another partner\.$/, ""); }); };
  new MutationObserver(fx).observe(h, { childList:true, subtree:true }); fx();
}

// ---------- Performance task: Plan a prenatal day (@component dayPlanner — 5 slots, card library with flags, a mini Food Guide
// plate per meal, nutrient-adequacy bars; no Calories) ----------
var task = (function(){
  var api = null, rg = {};
  function T(){ return MV.C.task; }
  function card(id){ return byId(T().library, id); }
  function SL(){ return T().slots; }
  function st(){ var s = api.S; s.slots = s.slots || {}; SL().forEach(function(sl){ s.slots[sl.id] = Array.isArray(s.slots[sl.id]) ? s.slots[sl.id] : []; }); s.slot = byId(SL(), s.slot) ? s.slot : "b"; s.grp = byId(T().groups, s.grp) ? s.grp : "vf"; return s; }
  function read(){ var s = api ? st() : { slots:{} }, d = { multi:!!s.multi, slots:{} }; SL().forEach(function(sl){ d.slots[sl.id] = (s.slots[sl.id] || []).slice(); }); return d; }
  function cardsIn(d, sid){ return (d.slots[sid] || []).map(card).filter(Boolean); }
  function foods(list){ return list.filter(function(c){ return !c.sp; }).length; }
  function checks(d){
    var per = SL().map(function(sl){ return cardsIn(d, sl.id); }), all = [].concat.apply([], per);
    return [
      d.multi,
      all.filter(function(c){ return c.ir; }).length >= 2 && per.some(function(cs){ return cs.some(function(c){ return c.ip; }) && cs.some(function(c){ return c.vc; }); }),
      per.filter(function(cs){ return cs.some(function(c){ return c.cal; }); }).length >= 2,
      all.some(function(c){ return c.dha; }),
      !all.some(function(c){ return c.av; }),
      per.filter(function(cs){ return cs.some(function(c){ return c.vf; }); }).length >= 3,
      !all.some(function(c){ return c.nh; })
    ];
  }
  function valid(d){
    var miss = SL().filter(function(sl){ return /^(b|l|d)$/.test(sl.id) && !(d.slots[sl.id] || []).length; });
    return miss.length ? "Add at least one card to " + miss.map(function(sl){ return sl.t.toLowerCase(); }).join(", ").replace(/, ([^,]*)$/, " and $1") + "." : true;
  }
  function keyOf(d){ return (d.multi ? "m" : "-") + "|" + SL().map(function(sl){ return sl.id + ":" + (d.slots[sl.id] || []).slice().sort().join(","); }).join("|"); }
  function fromKey(k){ var p = k.split("|"), d = { multi:p[0] === "m", slots:{} }; p.slice(1).forEach(function(x){ var q = x.split(":"); d.slots[q[0]] = q[1] ? q[1].split(",") : []; }); return d; }
  function planText(k){
    var d = fromKey(k);
    return SL().filter(function(sl){ return (d.slots[sl.id] || []).length; }).map(function(sl){ return sl.t + ": " + cardsIn(d, sl.id).map(function(c){ return MV.plain(c.t); }).join(", "); }).join(" · ") + (d.multi ? " · prenatal multivitamin" : "");
  }
  function tags(c){
    var t = [];
    if (c.ir) t.push(c.ip ? "iron-rich plant" : "iron-rich");
    if (c.vc) t.push("vitamin C");
    if (c.cal) t.push("calcium");
    if (c.dha) t.push(c.sp ? "DHA" : "low-mercury fish: DHA");
    if (c.vf && c.g !== "vf") t.push("vegetables or fruit");
    if (c.av) t.push("avoid");
    if (c.nh) t.push("not halal");
    return t;
  }
  function tagHTML(c){ return tags(c).map(function(t){ var a = t === "avoid", n = t === "not halal"; return '<span class="pl-tag' + (a ? " av" : n ? " nh" : "") + '">' + (a ? ico("warn") : "") + t + "</span>"; }).join(""); }
  function plateSVG(cs){
    var has = function(k){ return cs.some(function(c){ return c.plate.indexOf(k) >= 0; }); };
    return '<svg class="pl-mplate" viewBox="0 0 48 44" aria-hidden="true"><circle class="pl-mprim" cx="22" cy="22" r="20.5"/>' +
      '<path class="pl-mp vf' + (has("vf") ? " on" : "") + '" d="M22 4A18 18 0 0 0 22 40Z"/><path class="pl-mp wg' + (has("wg") ? " on" : "") + '" d="M22 22V4A18 18 0 0 1 40 22Z"/><path class="pl-mp pf' + (has("pf") ? " on" : "") + '" d="M22 22H40A18 18 0 0 1 22 40Z"/>' +
      (has("dr") ? '<path class="pl-mcup" d="M42 26h5l-1 12h-3z"/>' : "") + "</svg>";
  }
  function plateLine(cs){
    var has = function(k){ return cs.some(function(c){ return c.plate.indexOf(k) >= 0; }); };
    return "Vegetables and fruits " + (has("vf") ? "✓" : "–") + " · whole grains " + (has("wg") ? "✓" : "–") + " · protein foods " + (has("pf") ? "✓" : "–");
  }
  function totals(d){
    var t = { f:0, fe:0, ca:0, d:0, dha:"" }, all = [].concat.apply([], SL().map(function(sl){ return cardsIn(d, sl.id); }));
    if (d.multi) { var m = byId(MV.C.explore.plate.cards, "multi"); t.f += m.f; t.fe += m.fe; t.ca += m.ca; t.d += m.d; }
    all.forEach(function(c){ if (c.f != null) { t.f += c.f; t.fe += c.fe; t.ca += c.ca; t.d += c.d; } if (c.dha) t.dha = "yes"; else if (c.id === "egg" && !t.dha) t.dha = "small"; });
    return t;
  }
  function paint(){
    if (!$("#tk-day")) return;
    var s = st(), d = read(), cur = byId(SL(), s.slot), full = foods(cardsIn(d, s.slot)) >= 3;
    rg.slot.set(s.slot); rg.grp.set(s.grp); $("#tk-multi").checked = !!s.multi;
    var lib = $("#tk-lib");
    MV.keepFocus(lib, function(){
      lib.innerHTML = T().library.filter(function(c){ return c.g === s.grp; }).map(function(c){
        var inSlot = d.slots[s.slot].indexOf(c.id) >= 0, dis = inSlot || (full && !c.sp);
        return '<button type="button" class="pl-lc" data-lc="' + c.id + '" data-k="lc' + c.id + '"' + (dis ? " disabled" : "") + ' aria-label="' + esc(MV.plain(c.t) + (tags(c).length ? " (" + tags(c).join(", ") + ")" : "") + ": " + (inSlot ? "already in " : "add to ") + cur.t.toLowerCase()) + '">' +
          '<span class="pl-lct">' + c.t + '</span><span class="pl-tags">' + tagHTML(c) + '</span><span class="pl-lca" aria-hidden="true">' + (inSlot ? "In " + cur.t.toLowerCase() : "Add to " + cur.t.toLowerCase()) + "</span></button>";
      }).join("");
    });
    $("#tk-full").textContent = full ? cur.t + " has 3 food cards. Remove one, or choose another slot." : "";
    var day = $("#tk-day");
    MV.keepFocus(day, function(){
      day.innerHTML = SL().map(function(sl){
        var cs = cardsIn(d, sl.id);
        return '<div class="pl-slot' + (sl.id === s.slot ? " cur" : "") + '"><div class="pl-slh">' + plateSVG(cs) + "<strong>" + sl.t + "</strong></div>" +
          (cs.length ? '<ul class="pl-slc">' + cs.map(function(c, i){ return "<li><span>" + c.t + (c.av || c.nh ? ' <span class="pl-tags">' + tagHTML({ av:c.av, nh:c.nh, plate:[] }) + "</span>" : "") + '</span><button type="button" class="pl-rm" data-rm="' + sl.id + "|" + i + '" data-k="rm' + sl.id + c.id + '" aria-label="' + esc("Remove " + MV.plain(c.t) + " from " + sl.t.toLowerCase()) + '">×</button></li>'; }).join("") + "</ul>" : '<p class="tiny muted pl-sle">Empty</p>') +
          '<p class="tiny pl-pline">' + plateLine(cs) + "</p></div>";
      }).join("");
    });
    var t = totals(d);
    $("#tk-bars").innerHTML = adeqHTML([{ t:"Folate", v:t.f }, { t:"Iron", v:t.fe }, { t:"Calcium", v:t.ca }, { t:"Vitamin D", v:t.d }], t.dha);
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = st();
      inp.innerHTML = '<div class="pl-tin"><label class="pl-tog"><input type="checkbox" id="tk-multi"> Prenatal multivitamin (0.4 mg folic acid, 16 mg iron), every day</label>' +
        '<div id="tk-slot"></div><div id="tk-grp"></div><p class="tiny pl-full" id="tk-full" aria-live="polite"></p><div class="pl-lib" id="tk-lib" role="group" aria-label="Food cards"></div></div>';
      pv.innerHTML = '<div class="pl-tpv"><h4 class="pl-h4">Noura’s day</h4><div class="pl-day" id="tk-day"></div><h5 class="pl-h5">Nutrients for the day <span class="hfa-model">Model data</span></h5><div id="tk-bars" aria-live="polite"></div></div>';
      function upd(){ a.save(); paint(); a.update(); }
      rg.slot = radios($("#tk-slot"), { label:"Add to", cls:"chips", options:SL().map(function(sl){ return { id:sl.id, t:sl.t }; }), value:s.slot, onChange:function(v){ st().slot = v; a.save(); paint(); } });
      rg.grp = radios($("#tk-grp"), { label:"Show", cls:"chips", options:T().groups.map(function(g){ return { id:g.id, t:g.t }; }), value:s.grp, onChange:function(v){ st().grp = v; a.save(); paint(); } });
      $("#tk-multi").addEventListener("change", function(e){ st().multi = e.target.checked; upd(); });
      $("#tk-lib").addEventListener("click", function(e){
        var b = e.target.closest("[data-lc]"); if (!b || b.disabled) return;
        var x = st(), list = x.slots[x.slot], c = card(b.dataset.lc);
        if (list.indexOf(c.id) >= 0 || (!c.sp && foods(list.map(card)) >= 3)) return;
        list.push(c.id); upd();
      });
      $("#tk-day").addEventListener("click", function(e){
        var b = e.target.closest("[data-rm]"); if (!b) return;
        var q = b.dataset.rm.split("|"), list = st().slots[q[0]]; list.splice(+q[1], 1); upd();
        var nb = $("#tk-day [data-rm]"); if (nb) nb.focus({ preventScroll:true });
      });
      paint();
    },
    read:read,
    valid:valid,
    checks:function(d){ return checks(d); },
    key:keyOf,
    label:function(k){ return esc(planText(k)); },
    text:planText
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  task:task,
  onShow:function(v){ fixMatchText(); if (v === "explore") stickTop(); }
});
})();
