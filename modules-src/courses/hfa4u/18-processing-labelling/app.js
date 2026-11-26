// HFA4U 18 Food Processing & Labelling: hero (a cereal box turns to its side panel; the Nutrition Facts table lights up row by
// row; the ingredient list scrolls up; the "High in sugars" symbol fades in), Label lab (Explore: F3 labelLab with three modes:
// Read the label, Compare, Symbol designer), Claim check (Part 3: claim bins, functional-food evaluator, NOVA sort and policy
// timeline, kitchen card), Label detective (custom practice: N4 number entry with a choice) and "Label-smart snack" (task).
// Plan wording lives in content.mjs; this file adds control labels only.
// Safety: Calories appear only as label information; no food is called good or bad.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function arrowKeys(e){ return (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; }
// number typed by a student: units (%, g, mg, Calories) and spaces are ignored; null if not a single number
function gnum(s){ var t = String(s == null ? "" : s).replace(/calories|cal|mg|g|%|\s/gi, ""); if (!t) return null; var r = MV.parseNum(t); return r && r.length === 1 ? r[0] : null; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "start") + '"' + (extra || "") + ">" + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 16 / 12; "pl-" classes; options may be a function so a repaint rebuilds
//   the labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}] | fn, value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "pl-chipset" : "seg";
  function opts(){ return typeof o.options === "function" ? o.options() : o.options; }
  function paint(){
    var f = host.contains(document.activeElement), L = opts(), any = L.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="pl-rgw">' + (o.label ? '<span class="pl-rgl">' + o.label + "</span>" : "") + '<span class="pl-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      L.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var ids = opts().map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- @component switchBtn (copied from HFA4U 14 / 12) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="pl-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="pl-swt" aria-hidden="true"><i></i></span><span class="pl-swl">' + label + '</span><span class="pl-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- model helpers (content.explore tables) ----------
function EX(){ return MV.C.explore; }
function prod(id){ return byId(EX().products, id); }
var DVK = { sat:"sat", sug:"sug", fib:"fib", na:"na", fat:"fat" };
function dvOf(k){ return EX().dv[DVK[k] || k]; }
function pExact(k, amt){ return amt / dvOf(k) * 100; }
function pRound(k, amt){ return Math.round(pExact(k, amt) + 1e-9); }
function levelOf(r){ return r <= 5 ? "little" : r >= 15 ? "lot" : "between"; }
// front-of-package test on the exact amount (plan TC1: 340 mg passes, 345 mg shows the symbol)
function atFop(k, amt){ return amt * 100 >= EX().fop * dvOf(k) - 1e-9; }
function symList(v){ return ["sat", "sug", "na"].filter(function(k){ return atFop(k, v[k]); }); }
function symText(list){ return list.length ? "High in " + listAnd(list.map(function(k){ return EX().nutr[k]; })) : EX().symNone; }
function fibClaim(f){ var c = EX().fibreClaims.filter(function(x){ return f >= x.min - 1e-9; })[0]; return c ? c.t : EX().claimNone; }
function calOf(v){ return 9 * ((v.sat || 0) + (v.unsat || 0)) + 4 * ((v.sug || 0) + (v.oc || 0)) + 4 * (v.prot || 0); }
function gtxt(v){ return f1(v); }
function vals(p){ var o = {}; ["sat", "unsat", "sug", "oc", "fib", "prot", "na"].forEach(function(k){ if (p[k] != null) o[k] = p[k]; }); return o; }
// "%DV" text: whole number as on labels; the exact value is added when rounding hides which side of 15% it is on (the
// symbol test, plan TC1)
function dvTxt(k, amt){
  var e = pExact(k, amt), r = Math.round(e + 1e-9), s = r + "%";
  if ((r >= 15) !== (e >= 15 - 1e-9)) s += " (" + f1(e) + "%)";
  return s;
}
function lvT(k){ return EX().levels[k]; }

// ---------- @component F3 labelLab — Nutrition Facts table (white card in both themes, as real labels are) with optional
//   tappable rows, %DV tags ("a little" / "a lot") and row highlights. nftHTML({serving, v, cal, tap, sel, hi:{k:1}, tags,
//   hideDv:{k:1}, dvOverride:{k:"text"}, title}) -> HTML. Rows: Calories, Fat, Saturated + Trans, Carbohydrate, Fibre, Sugars,
//   Protein, Sodium (a row is left out when its value is missing). ----------
function nftRows(v, cal){
  var R = [{ k:"cal", t:"Calories " + Math.round(cal), cls:"cal" }];
  if (v.unsat != null) R.push({ k:"fat", t:"Fat " + gtxt(v.sat + v.unsat) + " g", amt:v.sat + v.unsat });
  R.push({ k:"sat", t:"Saturated " + gtxt(v.sat) + " g<br>+ Trans 0 g", amt:v.sat, cls:v.unsat != null ? "sub" : "" });
  var hasCarb = v.oc != null;
  if (hasCarb) R.push({ k:"carb", t:"Carbohydrate " + gtxt(v.sug + v.oc) + " g" });
  R.push({ k:"fib", t:"Fibre " + gtxt(v.fib) + " g", amt:v.fib, cls:hasCarb ? "sub" : "" });
  R.push({ k:"sug", t:"Sugars " + gtxt(v.sug) + " g", amt:v.sug, cls:hasCarb ? "sub" : "" });
  if (v.prot != null) R.push({ k:"prot", t:"Protein " + gtxt(v.prot) + " g" });
  R.push({ k:"na", t:"Sodium " + Math.round(v.na) + " mg", amt:v.na });
  return R;
}
function tagHTML(r){ var l = levelOf(r); return l === "between" ? "" : '<span class="pl-tag ' + l + '">' + lvT(l) + "</span>"; }
function nftHTML(o){
  var v = o.v, rows = nftRows(v, o.cal != null ? o.cal : calOf(v)), hi = o.hi || {}, hd = o.hideDv || {}, ov = o.dvOverride || {};
  function lab(k, t, extra){ return o.tap ? '<button type="button" class="pl-rb" data-row="' + k + '" data-k="row' + k + '" aria-pressed="' + (o.sel === k) + '"' + (extra || "") + ">" + t + "</button>" : t; }
  var body = rows.map(function(R){
    var dv = "";
    if (R.amt != null && R.k !== "cal") {
      if (hd[R.k]) dv = '<span class="pl-dvq">…</span>';
      else { var r = pRound(R.k, R.amt); dv = (o.tags && !(o.noTags && o.noTags[R.k]) ? tagHTML(r) : "") + (ov[R.k] || r + " %"); }
    }
    var cls = [R.cls || "", hi[R.k] ? "hi" : "", o.sel === R.k ? "sel" : ""].join(" ").trim();
    return "<tr" + (cls ? ' class="' + cls + '"' : "") + '><th scope="row">' + lab(R.k, R.t) + "</th><td>" + dv + "</td></tr>";
  }).join("");
  return '<div class="pl-card' + (o.cls ? " " + o.cls : "") + '">' + (o.title ? '<p class="pl-ct">' + o.title + "</p>" : "") +
    '<table class="pl-nft"><caption>Nutrition Facts</caption><thead><tr' + (hi.serving || o.sel === "serving" ? ' class="hi"' : "") + '><th scope="col">' + lab("serving", "Per " + o.serving) + '</th><th scope="col">' + lab("dv", "% Daily Value*") + "</th></tr></thead><tbody>" + body +
    '</tbody><tfoot><tr><td colspan="2">*5% or less is <strong>a little</strong>, 15% or more is <strong>a lot</strong></td></tr></tfoot></table></div>';
}

// ---------- @component fopSymbol — a schematic "High in" magnifying-glass symbol (black on white in both themes; words carry
//   the meaning). fopHTML(list, {hidden, alpha}) ----------
var MAG = '<svg class="pl-mag" viewBox="0 0 40 40" aria-hidden="true"><circle cx="16" cy="16" r="10.5"/><path d="M24 24l10 10"/></svg>';
function fopHTML(list, o){
  o = o || {};
  if (o.hidden) return '<div class="pl-fop q" role="img" aria-label="Front-of-package symbol: not shown yet"><span class="pl-fq">?</span></div>';
  if (!list.length) return '<div class="pl-fop none" role="img" aria-label="Front-of-package symbol: none"><span>No “High in” symbol</span></div>';
  return '<div class="pl-fop" role="img" aria-label="' + esc("Front-of-package symbol: " + symText(list)) + '"' + (o.alpha != null ? ' style="opacity:' + f1(o.alpha) + '"' : "") + ">" + MAG +
    '<span class="pl-fw"><span class="pl-fh">High in</span>' + list.map(function(k){ return '<span class="pl-fn">' + ({ sat:"Sat fat", sug:"Sugars", na:"Sodium" })[k] + "</span>"; }).join("") + "</span></div>";
}

// ---------- hero: a cereal box turns to its side panel (dimetric box; faces are affine-mapped local drawings) ----------
var HB = { W:360, V:452, H:380, FW:170, SW:270, e:0.18, phi:58 };
function heroSVG(st){
  var B = MV.C.hero.box, ph = st.rot * HB.phi * Math.PI / 180, c = Math.cos(ph), s = Math.sin(ph);
  var fe = [HB.FW * c, HB.FW * s * HB.e], se = [HB.SW * s, -HB.SW * c * HB.e];
  var top = -HB.H + Math.min(0, se[1], fe[1] + se[1]), bot = Math.max(0, fe[1], fe[1] + se[1]);
  var x0 = (HB.W - (fe[0] + se[0])) / 2, y0 = (HB.V - (bot - top)) / 2 - top, yT = y0 - HB.H;
  function pt(p){ return f1(p[0]) + "," + f1(p[1]); }
  var T0 = [x0, yT], T1 = [x0 + fe[0], yT + fe[1]], T2 = [T1[0] + se[0], T1[1] + se[1]], T3 = [x0 + se[0], yT + se[1]];
  var h = '<polygon class="pl-btop" points="' + [T0, T1, T2, T3].map(pt).join(" ") + '"/>';
  // front face
  if (fe[0] > 1) {
    h += '<g transform="matrix(' + [fe[0] / HB.FW, fe[1] / HB.FW, 0, 1, x0, yT].map(f1).join(" ") + ')">' +
      '<rect class="pl-bfront" x="0" y="0" width="' + HB.FW + '" height="' + HB.H + '"/>' +
      svgT(HB.FW / 2, 46, B.name, "pl-hname", "middle") + svgT(HB.FW / 2, 66, "whole grain cereal", "pl-hsub", "middle");
    // a bowl of rings
    h += '<path class="pl-bowl" d="M28 262h114c-4 34-28 52-57 52s-53-18-57-52z"/>';
    [[52, 250], [74, 244], [96, 250], [118, 246], [62, 232], [86, 230], [108, 234]].forEach(function(q){ h += '<circle class="pl-ring" cx="' + q[0] + '" cy="' + q[1] + '" r="8"/>'; });
    // the front-of-package symbol (fades in)
    if (st.sym > 0) h += '<g style="opacity:' + f1(st.sym) + '"><rect class="pl-hfop" x="24" y="92" width="122" height="84" rx="4"/>' +
      '<circle class="pl-hmag" cx="52" cy="122" r="14"/><path class="pl-hmag" d="M62 132l14 14"/>' +
      svgT(84, 120, "High in", "pl-hfh") + svgT(84, 148, "Sugars", "pl-hfn") + "</g>";
    h += "</g>";
  }
  // side panel
  if (se[0] > 1) {
    h += '<g transform="matrix(' + [se[0] / HB.SW, se[1] / HB.SW, 0, 1, x0 + fe[0], yT + fe[1]].map(f1).join(" ") + ')">' +
      '<rect class="pl-bside" x="0" y="0" width="' + HB.SW + '" height="' + HB.H + '"/>' +
      '<rect class="pl-hcard' + (st.glow > 0 ? " glow" : "") + '" x="12" y="12" width="246" height="282"/>' +
      svgT(22, 40, "Nutrition Facts", "pl-htitle");
    if (st.serve > 0) h += '<rect class="pl-hhi" x="16" y="47" width="238" height="19" style="opacity:' + f1(st.serve) + '"/>';
    h += svgT(22, 61, B.serving, "pl-hrow") + '<path class="pl-hl" d="M18 69H252"/>' + svgT(248, 84, "% Daily Value*", "pl-hdvh", "end") + '<path class="pl-hl thick" d="M18 90H252"/>';
    var y = 108, lit = 0;
    B.rows.forEach(function(r){
      var isLit = r.dv != null && lit < st.lit; if (r.dv != null) lit++;
      if (isLit) h += '<rect class="pl-hhi" x="16" y="' + (y - 14) + '" width="238" height="' + (r.two ? 34 : 19) + '"/>';
      h += svgT(r.sub ? 34 : 22, y, (r.cal ? "" : "<tspan class=\"pl-hb\">" + r.t + "</tspan> ") + (r.cal ? '<tspan class="pl-hb">' + r.t + " " + r.v + "</tspan>" : r.v), r.cal ? "pl-hcal" : "pl-hrow");
      if (r.two) { y += 15; h += svgT(34, y, r.two, "pl-hrow"); }
      if (r.dv != null) {
        h += svgT(248, y - (r.two ? 7 : 0), r.dv + " %", "pl-hdv", "end");
        if (isLit && st.tags) {
          var l = levelOf(r.dv);
          if (l !== "between") { var w = l === "lot" ? 38 : 48; h += '<rect class="pl-htag ' + l + '" x="' + (206 - w) + '" y="' + (y - (r.two ? 7 : 0) - 12) + '" width="' + w + '" height="16" rx="8"/>' + svgT(206 - w / 2, y - (r.two ? 7 : 0), lvT(l), "pl-htagt", "middle"); }
        }
      }
      h += '<path class="pl-hl' + (r.cal ? " thick" : "") + '" d="M18 ' + (y + 6) + 'H252"/>';
      y += r.cal ? 22 : 21;
    });
    h += svgT(22, 284, "*5% or less is a little, 15% or more is a lot", "pl-hfoot" + (st.pulse > 0 ? " on" : ""), "start", st.pulse > 0 ? ' style="opacity:' + f1(1 - 0.55 * Math.sin(st.pulse * Math.PI * 2) * Math.sin(st.pulse * Math.PI)) + '"' : "");
    // ingredient list window (scrolls up)
    h += '<clipPath id="pl-hclip"><rect x="12" y="302" width="246" height="72"/></clipPath><rect class="pl-hcard" x="12" y="302" width="246" height="72"/><g clip-path="url(#pl-hclip)">';
    B.ingredients.forEach(function(t, i){ h += svgT(20, 318 + i * 13.5 + (1 - st.scroll) * 74, i === 0 ? '<tspan class="pl-hb">' + t.replace("Ingredients:", "Ingredients:</tspan>") : t, "pl-hing"); });
    h += "</g></g>";
  }
  h += '<polygon class="pl-bedge" points="' + [T0, T1, T2, T3].map(pt).join(" ") + '"/>';
  return h;
}
function hero(f){
  var host = $("#pl-hero"); if (!host) return;
  var Hc = MV.C.hero, nDv = Hc.box.rows.filter(function(r){ return r.dv != null; }).length;
  var st = { rot:0, serve:0, lit:0, tags:true, sym:0, scroll:0, pulse:0, glow:0 };
  host.innerHTML = '<svg class="pl-hsvg" viewBox="0 0 ' + HB.W + " " + HB.V + '" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.textContent = Hc.caption; f.cap.classList.add("pl-cap"); } }
  if (MV.reduceMotion) { st.rot = 1; st.serve = 1; st.lit = nDv; st.sym = 1; st.scroll = 1; draw(); cap(); return; }
  draw();
  MV.wait(300, function(){
    MV.tween({ dur:1800, step:function(t){ st.rot = t; draw(); }, done:function(){
      MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){ st.scroll = t; draw(); } });
      MV.tween({ dur:500, step:function(t){ st.serve = t; draw(); }, done:function(){
        var k = 0;
        (function next(){
          if (k >= nDv) {
            MV.tween({ dur:700, step:function(t){ st.sym = t; draw(); }, done:function(){
              MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ st.pulse = t; draw(); }, done:function(){ st.pulse = 0; draw(); cap(); } });
            } });
            return;
          }
          k++; st.lit = k; draw(); MV.wait(420, next);
        })();
      } });
    } });
  });
}

// ---------- Explore: Label lab (@component F3 labelLab — three modes) ----------
function explore(host, api){
  var D = api.content, S = api.S, M = D.msgs, anim = null, pend = null, timers = [];
  S.mode = byId(D.modes, S.mode) ? S.mode : "read";
  S.basis = S.basis === "g30" ? "g30" : "serving";
  S.dp = D.designProducts.indexOf(S.dp) >= 0 ? S.dp : "soup";
  S.v = S.v || {};
  D.designProducts.forEach(function(id){ var d = vals(prod(id)), s = S.v[id]; if (!s || D.sliders.some(function(x){ return typeof s[x.id] !== "number"; })) S.v[id] = d; else s.prot = d.prot; });
  S.row = S.row || null;
  var fx = { noTags:null, lit:-1, hi:{}, t30:null, hiCmp:{}, hideNa:false, naPct:null, hideSym:false, symA:null, bars:S.bars ? 1 : null, ingHi:{} };

  var I = D.info;
  host.innerHTML = '<fieldset class="pl-fs" id="pl-fs"><legend class="vh">Label lab controls</legend><div id="pl-mode"></div>' +
    '<p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="pl-lab" data-mv="graph"><div class="pl-main" id="pl-main"></div><div class="pl-side" id="pl-side"></div></div></fieldset>' +
    '<details class="alg pl-info"><summary>' + I.title + ' <span class="hfa-model">Model data</span></summary><ul class="pl-infol"><li>' + [I.dvLine, I.fopLine, I.fullLine, I.fibreLine, I.roundLine, I.calLine].join("</li><li>") + "</li></ul></details>";
  var modeRG = radios($("#pl-mode", host), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; api.save(); paintAll(); MV.changed(); } });

  // ----- state readers -----
  function dvals(){ return S.v[S.dp]; }
  function curVals(){ return S.mode === "design" ? dvals() : vals(prod("granola")); }
  function curCal(){ return S.mode === "design" ? calOf(dvals()) : prod("granola").cal; }
  function curServing(){ return S.mode === "design" ? prod(S.dp).serving : prod("granola").serving; }

  // ----- readout -----
  function readHTML(){
    var L = D.readLabels;
    if (S.mode === "compare") {
      var A = prod("cerealA"), Bp = prod("cerealB"), g = S.basis === "g30";
      var b = function(k){ return g ? Bp[k] * 30 / Bp.grams : Bp[k]; };
      var more = function(k){ var a = A[k], bb = b(k), tol = k === "na" || k === "cal" ? 0.5 : 0.05; return Math.abs(a - bb) < tol ? "equal" : a > bb ? A.short : Bp.short; };
      var less = function(k){ var m = more(k); return m === "equal" ? "equal" : m === A.short ? Bp.short : A.short; };
      return [["Serving sizes", A.short + " " + A.serving + " · " + Bp.short + " " + Bp.serving], ["Comparing", g ? "the same amount: 30 g each" : "the servings as printed"],
        ["More fibre", more("fib")], ["Less sodium", less("na")], ["Sugars", more("sug") === "equal" ? "equal" : "more in " + more("sug")], ["Calories", more("cal") === "equal" ? "equal" : "more in " + more("cal")]]
        .map(function(r){ return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
    }
    var v = curVals(), sym = symList(v), rows = [
      ["serving", L.serving, curServing()],
      ["cal", L.cal, String(Math.round(curCal()))],
      ["sat", L.sat, gtxt(v.sat) + " g · " + dvTxt("sat", v.sat) + " · " + lvT(levelOf(pRound("sat", v.sat)))],
      ["sug", L.sug, gtxt(v.sug) + " g · " + dvTxt("sug", v.sug) + " · " + lvT(levelOf(pRound("sug", v.sug)))],
      ["fib", L.fib, gtxt(v.fib) + " g · " + dvTxt("fib", v.fib) + " · " + lvT(levelOf(pRound("fib", v.fib)))],
      ["na", L.na, (fx.hideNa ? "… mg" : Math.round(v.na) + " mg · " + dvTxt("na", v.na) + " · " + lvT(levelOf(pRound("na", v.na))))],
      ["sym", L.sym, fx.hideSym ? "…" : symText(sym)],
      ["claim", L.claim, fibClaim(v.fib)]
    ];
    return rows.map(function(r){ return '<div data-r="' + r[0] + '"' + (fx.hi[r[0]] ? ' class="pl-rhi"' : "") + "><dt>" + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
  }

  // ----- Read the label -----
  function ingHTML(sel){
    var ing = D.ingredients;
    var h = '<div class="pl-card pl-ingc"><p class="pl-ingt"><strong>Ingredients:</strong> ' + ing.map(function(x, i){
      var on = sel === "ing:" + x.id;
      return '<button type="button" class="pl-ib' + (fx.ingHi[x.id] ? " hi" : "") + '" data-ing="' + x.id + '" data-k="ing' + x.id + '" aria-pressed="' + on + '">' + (i ? x.t : x.t.charAt(0).toUpperCase() + x.t.slice(1)) + "</button>" + (i < ing.length - 1 ? ", " : ".");
    }).join("") + '</p><p class="pl-ingt"><button type="button" class="pl-ib" data-al="contains" data-k="alc" aria-pressed="' + (sel === "al:contains") + '">' + D.contains + '</button> <button type="button" class="pl-ib" data-al="may" data-k="alm" aria-pressed="' + (sel === "al:may") + '">' + D.mayContain + "</button></p></div>";
    if (fx.bars != null) {
      var max = Math.max.apply(null, ing.map(function(x){ return x.w; })), n = ing.length;
      h += '<div class="pl-bars" role="img" aria-label="' + esc(D.barTitle + ", model data, longest first: " + ing.map(function(x){ return x.t; }).join(", ")) + '"><p class="pl-bt">' + D.barTitle + ' <span class="hfa-model">Model data</span></p>' + ing.map(function(x, i){
        var t = clamp(fx.bars * (n + 2) / 3 - i / 3, 0, 1);
        return '<div class="pl-bar' + (x.group ? " grp" : "") + (i === 0 ? " top" : "") + '"><span class="pl-bl">' + (i + 1) + ". " + x.t + '</span><span class="pl-btr"><span class="pl-bf" style="width:' + f1(Math.max(x.w / max * 100, 1.5) * t) + '%"></span></span></div>';
      }).join("") + "</div>";
    }
    return h;
  }
  function meaningHTML(){
    var r = S.row, R = D.rowMean, v = vals(prod("granola"));
    if (!r) return '<p class="muted">' + D.tapHint + "</p>";
    if (r.indexOf("ing:") === 0) { var x = byId(D.ingredients, r.slice(4)), i = D.ingredients.indexOf(x); return "<p><strong>" + x.t.charAt(0).toUpperCase() + x.t.slice(1) + "</strong> (ingredient " + (i + 1) + " of " + D.ingredients.length + ")</p><p>" + x.mean + "</p>"; }
    if (r === "al:contains") return "<p><strong>" + D.contains + "</strong></p><p>" + D.allergenMean.contains + "</p>";
    if (r === "al:may") return "<p><strong>" + D.mayContain + "</strong></p><p>" + D.allergenMean.may + "</p>";
    var row = nftRows(v, prod("granola").cal).filter(function(q){ return q.k === r; })[0];
    var head = r === "serving" ? "Per " + prod("granola").serving : r === "dv" ? "% Daily Value" : MV.plain(row.t.replace("<br>", " "));
    var extra = "";
    if (row && row.amt != null) { var p = pRound(r, row.amt), l = levelOf(p); extra = '<p class="pl-mdv"><strong>' + p + "%: " + lvT(l) + "</strong>" + (l === "lot" ? " (15% or more)" : l === "little" ? " (5% or less)" : " (between 5% and 15%)") + "</p>"; }
    return "<p><strong>" + head + "</strong></p>" + extra + "<p>" + R[r] + "</p>";
  }

  // ----- Compare -----
  function cmpVals(p, t){ var g = p.grams, k = 30 / g; return { cal:lerp(p.cal, p.cal * k, t), sat:lerp(p.sat, p.sat * k, t), sug:lerp(p.sug, p.sug * k, t), fib:lerp(p.fib, p.fib * k, t), na:lerp(p.na, p.na * k, t) }; }
  function cmpHTML(){
    var A = prod("cerealA"), B = prod("cerealB"), t = fx.t30 != null ? fx.t30 : (S.basis === "g30" ? 1 : 0);
    var a = cmpVals(A, t), b = cmpVals(B, t), amtB = Math.round(lerp(B.grams, 30, t));
    var rows = [["cal", "Calories", function(x){ return String(Math.round(x)); }, 0.5], ["sat", "Saturated + trans fat", function(x){ return f1(x) + " g"; }, 0.05], ["sug", "Sugars", function(x){ return f1(x) + " g"; }, 0.05], ["fib", "Fibre", function(x){ return f1(x) + " g"; }, 0.05], ["na", "Sodium", function(x){ return Math.round(x) + " mg"; }, 0.5]];
    return '<div class="tbl-wrap"><table class="pl-ctab"><caption>' + (t >= 1 ? "Per 30 g" : t <= 0 ? "Per serving shown" : "Scaling to 30 g…") + ' <span class="hfa-model">Model data</span></caption><thead><tr><th scope="col">Nutrient</th><th scope="col">' + A.t + " (" + A.grams + ' g)</th><th scope="col">' + B.t + " (" + amtB + ' g)</th><th scope="col">More in</th></tr></thead><tbody>' +
      rows.map(function(r){
        var va = r[2](a[r[0]]), vb = r[2](b[r[0]]), na = parseFloat(va), nb = parseFloat(vb), w = Math.abs(na - nb) < r[3] ? "Equal" : na > nb ? A.short : B.short;
        return '<tr class="' + (fx.hiCmp[r[0]] ? "hi" : "") + '"><th scope="row">' + r[1] + "</th><td" + (w === A.short ? ' class="pl-more"' : "") + ">" + va + "</td><td" + (w === B.short ? ' class="pl-more"' : "") + ">" + vb + "</td><td>" + w + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      (t <= 0 ? '<p class="pl-warn"><span aria-hidden="true">⚠ </span>The servings differ: ' + A.grams + " g vs " + B.grams + " g.</p>" : "");
  }

  // ----- Symbol designer -----
  function sliderHTML(d){
    return '<div class="pl-sl ' + d.role + '"><div class="pl-slt"><label for="pl-sl-' + d.id + '">' + d.t + '</label><output id="pl-so-' + d.id + '" for="pl-sl-' + d.id + '"></output></div>' +
      '<input type="range" class="pl-range" id="pl-sl-' + d.id + '" data-sl="' + d.id + '" min="' + d.min + '" max="' + d.max + '" step="' + d.step + '" value="' + dvals()[d.id] + '"></div>';
  }
  function slOut(d){
    var v = dvals()[d.id], t = (d.id === "na" ? Math.round(v) + " mg" : gtxt(v) + " g");
    if (d.id === "sat" || d.id === "sug" || d.id === "fib" || d.id === "na") t += " · " + (d.id === "na" && fx.hideNa ? "…" : dvTxt(d.id, v));
    return t;
  }
  function paintSliders(){
    D.sliders.forEach(function(d){
      var el = $("#pl-sl-" + d.id, host); if (!el) return;
      if (+el.value !== dvals()[d.id]) el.value = dvals()[d.id];
      var t = slOut(d); $("#pl-so-" + d.id, host).textContent = t; el.setAttribute("aria-valuetext", t);
    });
  }

  // ----- painting -----
  var prodRG = null, basisRG = null;
  function paintAll(){
    modeRG.set(S.mode);
    var main = $("#pl-main", host), side = $("#pl-side", host);
    $(".pl-lab", host).className = "pl-lab " + S.mode;
    if (S.mode === "read") {
      main.innerHTML = '<div id="pl-nftw"></div><div id="pl-ingw"></div><p class="tiny muted"><span class="hfa-model">Model data</span> A simplified label for a model ' + prod("granola").short + ".</p>";
      side.innerHTML = '<div class="pl-mean" id="pl-mean" aria-live="polite"></div><h4 class="pl-h4">Readout</h4><dl class="read pl-read" id="pl-read" aria-live="polite"></dl>';
    } else if (S.mode === "compare") {
      main.innerHTML = '<div id="pl-basis"></div><div id="pl-cmp" aria-live="polite"></div><p class="pl-symt pl-asp">As printed on the boxes</p><div class="pl-two">' + ["cerealA", "cerealB"].map(function(id){ var p = prod(id); return nftHTML({ title:p.t, serving:p.serving, v:vals(p), cal:p.cal, cls:"pl-sm2" }); }).join("") + "</div>";
      side.innerHTML = '<h4 class="pl-h4">Readout</h4><dl class="read pl-read" id="pl-read" aria-live="polite"></dl>';
      basisRG = radios($("#pl-basis", host), { label:"Compare", options:D.bases, value:S.basis, onChange:function(v){ cancelAnim(); S.basis = v; api.save(); paintLive(); MV.changed(); } });
    } else {
      main.innerHTML = '<div id="pl-prod"></div><div class="pl-dz"><div id="pl-nftw"></div><div class="pl-symw"><p class="pl-symt">Front of package</p><div id="pl-sym" aria-live="polite"></div></div></div><button type="button" class="btn ghost sm" id="pl-reset" data-k="plreset">Reset this product</button>';
      side.innerHTML = '<fieldset class="pl-sls"><legend class="pl-h4">Nutrients per serving</legend>' + D.sliders.map(sliderHTML).join("") + '<p class="tiny muted">Arrow keys move one step; hold Shift for five.</p></fieldset><h4 class="pl-h4">Readout</h4><dl class="read pl-read" id="pl-read" aria-live="polite"></dl>';
      prodRG = radios($("#pl-prod", host), { label:"Product", cls:"chips", options:D.designProducts.map(function(id){ return { id:id, t:prod(id).t }; }), value:S.dp,
        onChange:function(v){ cancelAnim(); S.dp = v; api.save(); paintSliders(); paintLive(); MV.changed(); } });
      $("#pl-reset", host).addEventListener("click", function(){ cancelAnim(); S.v[S.dp] = vals(prod(S.dp)); api.save(); paintSliders(); paintLive(); MV.changed(); });
      paintSliders();
    }
    paintLive();
  }
  function paintLive(){
    var rd = $("#pl-read", host);
    if (S.mode === "read") {
      var g = prod("granola"), w = $("#pl-nftw", host);
      MV.keepFocus(w, function(){
        var hi = {}; Object.keys(fx.hi).forEach(function(k){ hi[k] = 1; });
        var noT = null, ov = {};
        if (fx.noTags) { noT = {}; ["fat", "sat", "fib", "sug", "na"].forEach(function(k){ noT[k] = 1; }); }
        if (fx.lit >= 0) { noT = {}; var order = ["fat", "sat", "fib", "sug", "na"]; order.forEach(function(k, i){ if (i >= fx.lit) noT[k] = 1; else hi[k] = 1; }); }
        w.innerHTML = nftHTML({ serving:g.serving, v:vals(g), cal:g.cal, tap:true, sel:S.row, hi:hi, tags:true, noTags:noT, dvOverride:ov });
      });
      var iw = $("#pl-ingw", host); MV.keepFocus(iw, function(){ iw.innerHTML = ingHTML(S.row); });
      $("#pl-mean", host).innerHTML = meaningHTML();
    } else if (S.mode === "compare") {
      if (basisRG) basisRG.set(S.basis);
      $("#pl-cmp", host).innerHTML = cmpHTML();
    } else {
      if (prodRG) prodRG.set(S.dp);
      var v = dvals(), hd = fx.hideNa ? { na:1 } : null, ov2 = {};
      if (fx.naPct != null) { ov2.na = Math.round(fx.naPct) + " %"; hd = null; }
      var nw = $("#pl-nftw", host);
      nw.innerHTML = nftHTML({ serving:prod(S.dp).serving, v:v, cal:calOf(v), tags:true, hideDv:hd, dvOverride:ov2, hi:fx.hi, noTags:fx.naPct != null ? { na:1 } : null, cls:"pl-live" });
      $("#pl-sym", host).innerHTML = fopHTML(symList(v), { hidden:fx.hideSym, alpha:fx.symA });
      paintSliders();
    }
    if (rd) rd.innerHTML = readHTML();
  }

  // ----- events -----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b)) return;
    if (b.dataset.row) { S.row = S.row === b.dataset.row ? null : b.dataset.row; api.save(); paintLive(); return; }
    if (b.dataset.ing) { var k = "ing:" + b.dataset.ing; S.row = S.row === k ? null : k; api.save(); paintLive(); return; }
    if (b.dataset.al) { var a = "al:" + b.dataset.al; S.row = S.row === a ? null : a; api.save(); paintLive(); }
  });
  host.addEventListener("input", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id) return;
    cancelAnim(); dvals()[id] = +e.target.value; api.save(); paintLive(); MV.changed();
  });
  // Shift + arrow keys: five steps at a time (plan: keyboard)
  host.addEventListener("keydown", function(e){
    var id = e.target.dataset && e.target.dataset.sl; if (!id || !e.shiftKey) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowUp") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowDown") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var def = byId(D.sliders, id), nv = clamp(Math.round((dvals()[id] + d * 5 * def.step) / def.step) * def.step, def.min, def.max);
    e.target.value = nv; cancelAnim(); dvals()[id] = +f1(nv); api.save(); paintLive(); MV.changed();
  });

  // ----- animation plumbing -----
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  function clearFx(){ fx.noTags = null; fx.lit = -1; fx.hi = {}; fx.t30 = null; fx.hiCmp = {}; fx.hideNa = false; fx.naPct = null; fx.hideSym = false; fx.symA = null; fx.ingHi = {}; fx.bars = S.bars ? 1 : null; }
  function busy(v){ $("#pl-fs", host).disabled = v; }
  function cancelAnim(){
    if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = [];
    var hadFx = fx.noTags || fx.lit >= 0 || fx.t30 != null || fx.hideNa || fx.hideSym || fx.naPct != null || fx.symA != null;
    clearFx(); busy(false);
    if (pend) { var d = pend; pend = null; d(); }
    return hadFx;
  }
  function finish(){ anim = null; timers = []; busy(false); api.save(); paintLive(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function reveal(el){ var b = el && el.getBoundingClientRect(); if (b && b.height && (b.top < 110 || b.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  paintAll();

  // ===== target challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var v = S.v, r = { ok:false };
    if (id === "tc1") {
      if (S.mode !== "design" || S.dp !== "soup") return { ok:false, msg:M.pickSoup };
      var na = v.soup.na;
      if (na === 340) return { ok:true };
      if (na === 345) return { ok:false, msg:M.na345 };
      if (na < 340) return { ok:false, msg:M.naUnder };
      return { ok:false, msg:fill(M.naOver, { v:na, p:f1(pExact("na", na)) }) };
    }
    if (id === "tc2") {
      if (S.mode !== "design" || S.dp !== "snack") return { ok:false, msg:M.pickSnack };
      var fb = v.snack.fib;
      if (fb >= 2 - 1e-9 && fb < 4 - 1e-9) return { ok:true };
      return { ok:false, msg:fb < 2 ? M.fibLow : M.fibHigh };
    }
    if (id === "tc3") {
      if (S.mode !== "design" || S.dp !== "granola") return { ok:false, msg:M.pickGranola };
      var g = v.granola, cal = calOf(g);
      if (g.na !== 120) return { ok:false, msg:M.keepNa };
      if (g.sat >= 3 - 1e-9) return { ok:false, msg:fill(M.sat, { v:gtxt(g.sat), p:f1(pExact("sat", g.sat)) }) };
      if (g.sug >= 15) return { ok:false, msg:g.sug === 15 ? M.sug15 : fill(M.sugOver, { v:g.sug }) };
      if (cal < 170) return { ok:false, msg:M.calLow };
      if (cal > 190) return { ok:false, msg:M.calHigh };
      return { ok:true };
    }
    return r;
  }

  // ===== predictions =====
  return {
    predict:{
      start:function(p){
        cancelAnim(); busy(true);
        if (p.id === "p1") { S.mode = "read"; S.row = null; fx.noTags = true; }
        else if (p.id === "p2") { S.mode = "compare"; S.basis = "serving"; }
        else if (p.id === "p3") { S.mode = "design"; S.dp = "soup"; S.v.soup = vals(prod("soup")); fx.hideNa = true; fx.hideSym = true; }
        else if (p.id === "p4") { S.mode = "read"; S.row = null; fx.bars = null; }
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          reveal($("#pl-nftw", host));
          fx.noTags = null; fx.lit = 0; paintLive();
          var step = function(){ fx.lit++; paintLive(); if (fx.lit < 5) later(380, step); else later(350, function(){ fx.lit = -1; fx.hi = { sug:1 }; S.row = "sug"; paintLive(); later(250, finish); }); };
          later(350, step);
        } else if (p.id === "p2") {
          reveal($("#pl-cmp", host));
          later(300, function(){
            S.basis = "g30"; if (basisRG) basisRG.set("g30"); fx.t30 = 0;
            anim = MV.tween({ dur:1600, step:function(t){ fx.t30 = t; paintLive(); }, done:function(){ anim = null; fx.t30 = null; fx.hiCmp = { fib:1, na:1 }; finish(); } });
          });
        } else if (p.id === "p3") {
          reveal($("#pl-nftw", host));
          fx.hideNa = false; fx.naPct = 0; fx.hi = { na:1 }; paintLive();
          var tgt = pExact("na", S.v.soup.na);
          anim = MV.tween({ dur:1300, ease:function(t){ return t; }, step:function(t){ fx.naPct = tgt * t; paintLive(); }, done:function(){
            fx.naPct = null; fx.hideSym = false; fx.symA = 0; fx.hi = { na:1, sym:1 }; paintLive(); reveal($("#pl-sym", host));
            anim = MV.tween({ dur:700, step:function(t){ fx.symA = t; paintLive(); }, done:function(){ anim = null; fx.symA = null; finish(); } });
          } });
        } else {
          reveal($("#pl-ingw", host));
          fx.ingHi = { oats:1, sugars:1 }; fx.bars = 0; paintLive();
          anim = MV.tween({ dur:1800, ease:function(t){ return t; }, step:function(t){ fx.bars = t; paintLive(); }, done:function(){ anim = null; S.bars = true; fx.bars = 1; S.row = "ing:oats"; finish(); } });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Claim check (@component claimStations — claim bins with "Check it with data", a functional-food
//   evaluator (F13 claimCards style: ratings vs a model verdict), a NOVA sort with a critique card, a policy timeline with
//   research links, and a kitchen card) ----------
function frac(n, d){
  var w = Math.floor(n / d), r = n - w * d;
  function g(a, b){ return b ? g(b, a % b) : a; }
  var k = g(r, d); r /= k; var dd = d / k;
  return (w ? String(w) : "") + (r ? (w ? " " : "") + r + "/" + dd : "") || "0";
}
function part3(host, api){
  var D = api.content, S = api.S, DC = D.decode, FN = D.func, PR = D.process, KC = D.kitchen;
  S.st = byId(D.stations, S.st) ? S.st : "decode";
  S.dec = S.dec || { placed:{}, tries:{} };
  S.fn = S.fn || {}; FN.cards.forEach(function(c){ S.fn[c.id] = S.fn[c.id] || {}; });
  S.nv = S.nv || { placed:{}, tries:{} };
  S.tl = S.tl || { y:{}, r:{} };
  S.kc = S.kc || {}; S.kc.n = [1, 2, 4].indexOf(+S.kc.n) >= 0 ? +S.kc.n : 1; S.kc.liq = S.kc.liq === "soy" ? "soy" : "milk"; S.kc.gf = !!S.kc.gf;
  var sel = { dec:null, nv:null, tl:null }, msg = { dec:null, nv:null, tl:null };
  host.innerHTML = '<div id="pl-stn"></div><p class="tiny" id="pl-stp" aria-live="polite"></p>' + D.stations.map(function(s){ return '<div class="pl-st" id="pl-st-' + s.id + '" hidden></div>'; }).join("");
  function done(id){
    if (id === "decode") return DC.chips.every(function(c){ return !!S.dec.placed[c.id]; });
    if (id === "func") return FN.cards.every(function(c){ var s = S.fn[c.id]; return s.claim && s.ev && s.cost; });
    if (id === "process") return PR.foods.every(function(f){ return !!S.nv.placed[f.id]; }) && PR.events.every(function(ev){ return S.tl.y[ev.id] && S.tl.r[ev.id]; });
    return !!S.kc.saved;
  }
  var stOpts = function(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="pl-stok">✓<span class="vh"> finished</span></span>' : "") }; }); };
  var stRG = radios($("#pl-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){ stRG.repaint(); $("#pl-stp", host).textContent = "Stations finished: " + D.stations.filter(function(s){ return done(s.id); }).length + " of " + D.stations.length + "."; }

  // ===== Station 1: decode the claim =====
  var s1 = $("#pl-st-decode", host);
  function binT(id){ var b = byId(DC.bins, id); return b ? b.t : ""; }
  function refT(c){ return c.ref ? DC.refs[c.ref] : DC.refs.none; }
  s1.innerHTML = '<h4 class="pl-h4">' + DC.title + "</h4><p>" + DC.ask + '</p><div id="pl-dtray"></div><div id="pl-dfb" aria-live="polite"></div><div class="pl-bins" id="pl-dbins"></div>' +
    '<details class="alg pl-data"><summary>' + DC.msgs.data + '</summary><dl class="pl-defs">' + DC.chips.map(function(c){ return "<dt>" + c.t + "</dt><dd><p>" + c.def + '</p><p class="tiny muted">Source: ' + refT(c) + "</p></dd>"; }).join("") + "</dl></details>";
  function paintDec(){
    var tray = $("#pl-dtray", s1), left = DC.chips.filter(function(c){ return !S.dec.placed[c.id]; });
    MV.keepFocus(tray, function(){
      tray.innerHTML = left.length ? '<div class="pl-tray" role="group" aria-label="Claims to sort">' + left.map(function(c){ return '<button type="button" class="pl-tile" data-dc="' + c.id + '" data-k="dc' + c.id + '" aria-pressed="' + (sel.dec === c.id) + '">' + c.t + "</button>"; }).join("") + "</div>" : "";
    });
    var bins = $("#pl-dbins", s1);
    MV.keepFocus(bins, function(){
      bins.innerHTML = DC.bins.map(function(b){
        var inside = DC.chips.filter(function(c){ return S.dec.placed[c.id] === b.id; });
        return '<button type="button" class="pl-bin' + (sel.dec ? " ready" : "") + '" data-db="' + b.id + '" data-k="db' + b.id + '"><strong>' + b.t + '</strong><span class="pl-binin">' + inside.map(function(c){ return '<span class="pl-chipin">' + c.t + "</span>"; }).join("") + "</span></button>";
      }).join("");
    });
    $("#pl-dfb", s1).innerHTML = done("decode") ? MV.fbHTML("good", "<strong>✓ " + DC.msgs.done + "</strong>") + (msg.dec && msg.dec.kind === "good" ? msg.dec.html : "") : msg.dec ? msg.dec.html : "";
  }
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.dc) { sel.dec = sel.dec === b.dataset.dc ? null : b.dataset.dc; msg.dec = null; paintDec(); return; }
    if (b.dataset.db) {
      if (!sel.dec) { msg.dec = { kind:"", html:MV.fbHTML("", DC.msgs.pick) }; paintDec(); return; }
      var c = byId(DC.chips, sel.dec);
      if (b.dataset.db === MV.ans(c)) {
        S.dec.placed[c.id] = b.dataset.db; sel.dec = null;
        msg.dec = { kind:"good", html:MV.fbHTML("good", "<strong>✓ " + c.t + ": " + lc(binT(b.dataset.db)) + ".</strong> " + c.def + ' <span class="tiny muted">Source: ' + refT(c) + "</span>") };
      } else { S.dec.tries[c.id] = (S.dec.tries[c.id] || 0) + 1; msg.dec = { kind:"bad", html:MV.fbHTML("bad", "<strong>✗ Not that bin.</strong> " + c.wrong + " Try another bin.") }; }
      api.save(); paintDec(); stRepaint(); MV.focusFb($("#pl-dfb", s1));
    }
  });

  // ===== Station 2: functional food evaluator =====
  var s2 = $("#pl-st-func", host);
  s2.innerHTML = '<h4 class="pl-h4">' + FN.title + "</h4><p>" + FN.ask + '</p><p class="tiny muted">' + FN.note + '</p><div class="pl-fcards">' + FN.cards.map(function(c, i){
    return '<article class="pl-fcard" data-fc="' + c.id + '"><h5 class="pl-h5"><span class="pl-pn">' + (i + 1) + "</span> " + c.t + ' <span class="hfa-model">Practice model</span></h5>' +
      '<p class="pl-cost"><span>Cost per serving: <strong>' + c.cost + "</strong></span><span>" + c.alt + ": <strong>" + c.altCost + '</strong></span> <span class="hfa-model">Model data</span></p>' +
      FN.rows.map(function(r){ return '<div id="pl-fr-' + c.id + r.id + '"></div>'; }).join("") +
      '<div class="pl-ben"><label for="pl-fb-' + c.id + '">' + FN.benefit + '</label><input type="text" class="txtin" id="pl-fb-' + c.id + '" data-ben="' + c.id + '" autocomplete="off"></div><div class="pl-fv" aria-live="polite"></div></article>';
  }).join("") + '</div><div id="pl-fdone" aria-live="polite"></div>';
  function optT(r, id){ var o = byId(byId(FN.rows, r).opts, id); return o ? o.t : ""; }
  function paintCard(c){
    var s = S.fn[c.id], box = $('[data-fc="' + c.id + '"] .pl-fv', s2), ans = MV.ans(c);
    if (!(s.claim && s.ev && s.cost)) { box.innerHTML = '<p class="tiny muted">' + FN.msgs.fill + "</p>"; return; }
    var diff = FN.rows.filter(function(r){ return s[r.id] !== ans[r.id]; });
    box.innerHTML = '<div class="refresh pl-verd"><p><strong>' + FN.msgs.verdict + ":</strong> " + c.verdict + '</p><p class="tiny">Approved claim: ' + lc(optT("claim", ans.claim)) + " · evidence: " + lc(optT("ev", ans.ev)) + " · cost: " + lc(optT("cost", ans.cost)) + "</p>" +
      (diff.length ? '<p class="tiny">' + fill(FN.msgs.differ, { n:diff.length === 1 ? "one row" : diff.length + " rows", list:diff.map(function(r){ return lc(r.t.replace("?", "")); }).join("; ") }) + "</p>" : '<p class="tiny"><span aria-hidden="true">✓ </span>' + FN.msgs.match + "</p>") + "</div>";
  }
  FN.cards.forEach(function(c){
    FN.rows.forEach(function(r){
      radios($("#pl-fr-" + c.id + r.id, s2), { label:r.t, cls:"chips", options:r.opts, value:S.fn[c.id][r.id] || "",
        onChange:function(v){ S.fn[c.id][r.id] = v; api.save(); paintCard(c); paintFn(); stRepaint(); } });
    });
    var inp = $("#pl-fb-" + c.id, s2); inp.value = S.fn[c.id].note || "";
    inp.addEventListener("input", function(){ S.fn[c.id].note = inp.value; api.save(); });
    paintCard(c);
  });
  function paintFn(){ $("#pl-fdone", s2).innerHTML = done("func") ? MV.fbHTML("good", "<strong>✓ " + FN.msgs.done + "</strong>") : ""; }

  // ===== Station 3: processing spectrum and policy timeline =====
  var s3 = $("#pl-st-process", host);
  function grpT(id){ var g = byId(PR.groups, id); return g ? g.t : ""; }
  function yrT(id){ var y = byId(PR.years, id); return y ? y.t : ""; }
  s3.innerHTML = '<h4 class="pl-h4">' + PR.title + "</h4><p><strong>" + PR.sortAsk + '</strong></p><div id="pl-ntray"></div><div id="pl-nfb" aria-live="polite"></div><div class="pl-bins four" id="pl-nbins"></div><div id="pl-crit"></div>' +
    '<p class="pl-tlask"><strong>' + PR.tlAsk + '</strong></p><div id="pl-etray"></div><div id="pl-tfb" aria-live="polite"></div><ol class="pl-tl" id="pl-tl"></ol><div id="pl-tdone" aria-live="polite"></div>';
  function paintNova(){
    var tray = $("#pl-ntray", s3), left = PR.foods.filter(function(f){ return !S.nv.placed[f.id]; });
    MV.keepFocus(tray, function(){ tray.innerHTML = left.length ? '<div class="pl-tray" role="group" aria-label="Foods to sort">' + left.map(function(f){ return '<button type="button" class="pl-tile" data-nf="' + f.id + '" data-k="nf' + f.id + '" aria-pressed="' + (sel.nv === f.id) + '">' + f.t + "</button>"; }).join("") + "</div>" : ""; });
    var bins = $("#pl-nbins", s3);
    MV.keepFocus(bins, function(){
      bins.innerHTML = PR.groups.map(function(g, i){
        var inside = PR.foods.filter(function(f){ return S.nv.placed[f.id] === g.id; });
        return '<button type="button" class="pl-bin nova n' + (i + 1) + (sel.nv ? " ready" : "") + '" data-ng="' + g.id + '" data-k="ng' + g.id + '"><strong><span class="pl-gn">' + (i + 1) + "</span> " + g.t + '</strong><small>' + g.sub + '</small><span class="pl-binin">' + inside.map(function(f){ return '<span class="pl-chipin">' + f.t + "</span>"; }).join("") + "</span></button>";
      }).join("");
    });
    var allIn = PR.foods.every(function(f){ return !!S.nv.placed[f.id]; });
    $("#pl-nfb", s3).innerHTML = msg.nv ? msg.nv : "";
    $("#pl-crit", s3).innerHTML = allIn ? MV.fbHTML("good", "<strong>✓ " + PR.msgs.sortDone + "</strong>") + '<div class="refresh pl-crit"><h4>' + PR.critique.title + "</h4><p>" + PR.critique.html + "</p></div>" : "";
  }
  function paintTl(){
    var tray = $("#pl-etray", s3), left = PR.events.filter(function(ev){ return !S.tl.y[ev.id]; });
    MV.keepFocus(tray, function(){ tray.innerHTML = left.length ? '<div class="pl-tray" role="group" aria-label="Events to place">' + left.map(function(ev){ return '<button type="button" class="pl-tile" data-te="' + ev.id + '" data-k="te' + ev.id + '" aria-pressed="' + (sel.tl === ev.id) + '">' + ev.t + "</button>"; }).join("") + "</div>" : ""; });
    var tl = $("#pl-tl", s3);
    MV.keepFocus(tl, function(){
      tl.innerHTML = PR.years.map(function(y){
        var ev = PR.events.filter(function(x){ return S.tl.y[x.id] === y.id; })[0];
        var h = '<li class="pl-tli' + (ev ? " full" : "") + '"><span class="pl-yr">' + y.t + "</span>";
        if (!ev) h += '<button type="button" class="pl-slot' + (sel.tl ? " ready" : "") + '" data-ty="' + y.id + '" data-k="ty' + y.id + '">Place an event here</button>';
        else {
          var ra = MV.ans(ev).r, got = S.tl.r[ev.id];
          h += '<div class="pl-tev"><p class="pl-tevt"><strong>' + ev.t + "</strong></p>";
          if (got) h += '<p class="pl-tr"><span aria-hidden="true">✓ </span>' + PR.msgs.link + " <strong>" + byId(PR.research, got).t + "</strong>. " + ev.why + "</p>";
          else h += '<p class="pl-rgl">' + PR.msgs.link + '</p><div class="pl-chipset" role="group" aria-label="' + esc("Research behind: " + ev.t) + '">' + PR.research.map(function(r){ return '<button type="button" data-tr="' + r.id + '" data-tev="' + ev.id + '" data-k="tr' + ev.id + r.id + '">' + r.t + "</button>"; }).join("") + "</div>";
          void ra;
          h += "</div>";
        }
        return h + "</li>";
      }).join("");
    });
    $("#pl-tfb", s3).innerHTML = msg.tl || "";
    var all = PR.events.every(function(ev){ return S.tl.y[ev.id] && S.tl.r[ev.id]; });
    $("#pl-tdone", s3).innerHTML = all ? MV.fbHTML("good", "<strong>✓ " + PR.msgs.tlDone + "</strong>") : "";
  }
  s3.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.nf) { sel.nv = sel.nv === b.dataset.nf ? null : b.dataset.nf; msg.nv = null; paintNova(); return; }
    if (b.dataset.ng) {
      if (!sel.nv) { msg.nv = MV.fbHTML("", PR.msgs.pickFood); paintNova(); return; }
      var f = byId(PR.foods, sel.nv), ans = MV.ans(f);
      if (b.dataset.ng === ans) { S.nv.placed[f.id] = ans; sel.nv = null; msg.nv = MV.fbHTML("good", "<strong>✓ " + f.t + ": " + lc(grpT(ans)) + ".</strong> " + PR.why[ans]); }
      else { S.nv.tries[f.id] = (S.nv.tries[f.id] || 0) + 1; msg.nv = MV.fbHTML("bad", "<strong>✗ Not that group.</strong> " + PR.binFb[b.dataset.ng] + " Try another group."); }
      api.save(); paintNova(); stRepaint(); MV.focusFb($("#pl-nfb", s3)); return;
    }
    if (b.dataset.te) { sel.tl = sel.tl === b.dataset.te ? null : b.dataset.te; msg.tl = null; paintTl(); return; }
    if (b.dataset.ty) {
      if (!sel.tl) { msg.tl = MV.fbHTML("", PR.msgs.pickEvent); paintTl(); return; }
      var ev = byId(PR.events, sel.tl);
      if (b.dataset.ty === MV.ans(ev).y) { S.tl.y[ev.id] = b.dataset.ty; sel.tl = null; msg.tl = MV.fbHTML("good", "<strong>✓ " + yrT(b.dataset.ty) + ": " + lc(ev.t) + ".</strong> Now link it to the research behind it."); }
      else msg.tl = MV.fbHTML("bad", "<strong>✗ " + PR.msgs.yearWrong + "</strong>");
      api.save(); paintTl(); stRepaint(); MV.focusFb($("#pl-tfb", s3)); return;
    }
    if (b.dataset.tr) {
      var e2 = byId(PR.events, b.dataset.tev);
      if (b.dataset.tr === MV.ans(e2).r) { S.tl.r[e2.id] = b.dataset.tr; msg.tl = MV.fbHTML("good", "<strong>✓ " + byId(PR.research, b.dataset.tr).t + ".</strong> " + e2.why); }
      else msg.tl = MV.fbHTML("bad", "<strong>✗ " + PR.msgs.researchWrong + "</strong> (" + e2.t + ")");
      api.save(); paintTl(); stRepaint(); MV.focusFb($("#pl-tfb", s3));
    }
  });

  // ===== Station 4: kitchen card =====
  var s4 = $("#pl-st-kitchen", host);
  s4.innerHTML = '<h4 class="pl-h4">' + KC.title + ": " + KC.dish + "</h4><p>" + KC.ask + '</p><div class="pl-kl"><div class="pl-kctl"><div id="pl-kn"></div><div id="pl-kliq"></div><div id="pl-kgf"></div></div><div class="pl-kcard" id="pl-kcard" aria-live="polite"></div></div><div id="pl-kbtn"></div>';
  radios($("#pl-kn", s4), { label:"Servings", options:KC.servings.map(function(n){ return { id:String(n), t:String(n) }; }), value:String(S.kc.n), onChange:function(v){ S.kc.n = +v; api.save(); paintKc(); } });
  radios($("#pl-kliq", s4), { label:"Liquid", cls:"chips", options:KC.liquids, value:S.kc.liq, onChange:function(v){ S.kc.liq = v; api.save(); paintKc(); } });
  var gfHost = $("#pl-kgf", s4);
  function paintGf(){ MV.keepFocus(gfHost, function(){ gfHost.innerHTML = switchHTML("kgf", KC.gf, S.kc.gf, 'data-gf="1"'); }); }
  gfHost.addEventListener("click", function(e){ if (!e.target.closest("[data-gf]")) return; S.kc.gf = !S.kc.gf; api.save(); paintGf(); paintKc(); });
  function liqT(){ var l = byId(KC.liquids, S.kc.liq); return l ? lc(l.t) : "milk"; }
  function qty(m){
    var n = m.n * S.kc.n, d = m.d, q = frac(n, d), big = n / d > 1 + 1e-9;
    return q + " " + (m.u === "cup" && big ? "cups" : m.u);
  }
  function kcData(){
    var oats = S.kc.gf ? "rolled oats labelled gluten-free" : "rolled oats";
    return {
      measure:KC.measure.map(function(m){ return qty(m) + " " + (m.t === "rolled oats" ? oats : m.t.replace("{liquid}", liqT())); }),
      method:KC.method.map(function(t){ return t.replace("{liquid}", liqT()); }),
      notes:KC.notes, safety:KC.safety, prepare:KC.prepare
    };
  }
  function paintKc(){
    var k = kcData();
    $("#pl-kcard", s4).innerHTML = '<p class="pl-kct">' + KC.dish + ' <span class="tiny muted">(' + S.kc.n + (S.kc.n === 1 ? " serving" : " servings") + ")</span></p>" +
      "<h5>Measure</h5><ul>" + k.measure.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ul><h5>Method</h5><ol>" + k.method.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ol>" +
      "<h5>Allergen and substitution notes</h5><ul>" + k.notes.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ul><h5>Food safety</h5><p>" + k.safety + "</p><p class=\"tiny\">" + k.prepare + "</p>";
  }
  MV.kitchenCardButton($("#pl-kbtn", s4), { title:function(){ return KC.dish + " (" + S.kc.n + (S.kc.n === 1 ? " serving" : " servings") + ")"; }, lines:function(){
    var k = kcData(); S.kc.saved = true; api.save(); setTimeout(stRepaint, 0);
    return ["## Measure"].concat(k.measure.map(function(t){ return "- " + t; }), ["## Method"], k.method.map(function(t, i){ return "- " + (i + 1) + ". " + t; }), ["## Allergen and substitution notes"], k.notes.map(function(t){ return "- " + t; }), ["## Food safety", "- " + k.safety, "", k.prepare]);
  } });

  function paintAll(){ stRG.set(S.st); stRepaint(); D.stations.forEach(function(s){ $("#pl-st-" + s.id, host).hidden = s.id !== S.st; }); }
  paintDec(); paintFn(); paintNova(); paintTl(); paintGf(); paintKc(); paintAll();
}

// ---------- Practice 1: Label detective (custom: N4 number entry with one or two boxes and an optional chip choice; adapted
//   from HFA4U 11's sodium budget) ----------
function detective(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ var x = S.items[it.id] || (S.items[it.id] = { pick:null, vals:[], tries:0, hint:0, solved:false, first:null }); x.vals = x.vals || []; return x; }
  function qHTML(it, i){
    var x = ist(it), h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">L' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div></div>";
    h += it.fields.map(function(f, k){ return '<div class="numrow"><label for="pld-' + it.id + k + '">' + f.label + ':</label><input class="numin" id="pld-' + it.id + k + '" data-bn="' + it.id + '" data-bk="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.vals[k] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + f.unit + "</span></div>"; }).join("");
    if (it.chips) h += '<div class="pl-lchips"><span class="pl-rgl">' + it.chipLabel + '</span><span class="pl-chipset" role="radiogroup" aria-label="' + esc(it.chipLabel) + '">' + it.chips.map(function(c, ci){
      var on = x.pick === c.id;
      return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!x.pick && ci === 0) ? 0 : -1) + '" data-ci="' + c.id + '" data-k="' + it.id + "c" + c.id + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
    }).join("") + "</span></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb ' + (msgs[it.id].skip ? "" : "bad") + '" role="status"><p>' + msgs[it.id].h + "</p></div>";
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + MV.usesHTML(a.use) + a.items.map(qHTML).join("");
  function repaint(it){
    var box = host.querySelector('[data-bi="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ", ans = MV.ans(it), v = it.fields.map(function(_, k){ return gnum(x.vals[k]); });
    if (v.some(function(q){ return q == null; })) return { skip:true, msg:it.fields.length > 1 ? "Enter a number in each box." : "Enter a number, such as 25 or 6.5." };
    if (it.chips && !x.pick) return { skip:true, msg:"Choose a little, in between or a lot too." };
    var numOk = v.every(function(q, k){ var r = ans.nums[k]; return q >= r[0] - 1e-9 && q <= r[1] + 1e-9; });
    if (numOk && (!it.chips || x.pick === ans.chip)) return { ok:true };
    if (!numOk) {
      var w = (it.wrong || []).filter(function(q){ return q.match.every(function(m, k){ return Math.abs(v[k] - m) < 0.05; }); })[0];
      return { msg:NQ + (w ? w.fb : it.fb) + " Try again." };
    }
    return { msg:NQ + it.chipFb + " Try again." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bn) return; var it = byId(a.items, t.dataset.bn); ist(it).vals[+t.dataset.bk] = t.value; msgs[it.id] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (e.key === "Enter" && t.dataset && t.dataset.bn) { var b = host.querySelector('[data-k="' + t.dataset.bn + 'chk"]'); if (b) b.click(); return; }
    var c = t.closest && t.closest("[data-ci]"); if (!c) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var sibs = $$("[data-ci]", c.parentNode), k = sibs.indexOf(c), nb = sibs[(k + d + sibs.length) % sibs.length]; if (nb) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-bi]"); if (!box) return;
    var it = byId(a.items, box.dataset.bi), x = ist(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.ci != null) { x.pick = b.dataset.ci; msgs[it.id] = null; }
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

// ---------- Performance task: Label-smart snack (@component snackChips — 11 ingredient chips, pick exactly 3; live Nutrition
//   Facts preview with %DV tags, the front-of-package symbol, the fibre claim, an allergen line and a kitchen card) ----------
var task = (function(){
  var api = null;
  function TK(){ return MV.C.task; }
  function ing(id){ return byId(TK().ingredients, id); }
  function order(ids){ var I = TK().ingredients.map(function(x){ return x.id; }); return ids.slice().sort(function(a, b){ return I.indexOf(a) - I.indexOf(b); }); }
  function read(){ var s = (api && api.S) || {}; return { ids:(Array.isArray(s.ids) ? s.ids : []).filter(ing).slice(0, 3) }; }
  function tot(ids){
    var t = { cal:0, sat:0, sug:0, na:0, fib:0, fn:[], vf:[], al:[], cold:false };
    ids.forEach(function(id){ var x = ing(id); ["cal", "sat", "sug", "na", "fib"].forEach(function(k){ t[k] += x[k]; }); if (x.fn) t.fn.push(x); if (x.vf) t.vf.push(x); if (x.al && t.al.indexOf(x.al) < 0) t.al.push(x.al); if (x.cold) t.cold = true; });
    ["sat", "sug", "fib"].forEach(function(k){ t[k] = Math.round(t[k] * 10) / 10; });
    return t;
  }
  function checks(d){ var t = tot(d.ids), L = TK().limits, full = d.ids.length === 3; return [full && t.sat < L.sat && t.sug < L.sug && t.na < L.na, t.fib >= L.fib, t.fn.length > 0, full && t.cal >= L.calLo && t.cal <= L.calHi, t.vf.length > 0]; }
  function keyOf(d){ return order(d.ids).join("+"); }
  function names(k){ return k.split("+").map(function(id, i){ var x = ing(id); return x ? (i ? lc(x.t) : x.t) : id; }); }
  function sym(t){ var L = TK().limits; return [t.sat >= L.sat ? "sat" : "", t.sug >= L.sug ? "sug" : "", t.na >= L.na ? "na" : ""].filter(Boolean); }
  function chipT(x){ return '<span class="pl-sn">' + x.t + ' <span class="pl-sp">(' + x.portion + ")</span></span>" + '<span class="pl-sv">' + x.cal + " Cal · sat. fat " + x.sat + " g · sugars " + x.sug + " g · sodium " + x.na + " mg · fibre " + x.fib + " g" + (x.fn ? " · functional" : "") + (x.vf ? " · fruit" : "") + "</span>"; }
  function cardLines(ids){
    var C = TK().card, t = tot(ids), out = ["## Measure"];
    order(ids).forEach(function(id){ var x = ing(id); out.push("- " + x.portion + " " + lc(x.t)); });
    out.push("## Method", "- " + C.noCook);
    if (ids.indexOf("oats") >= 0) out.push("- " + C.toast);
    out.push("## Allergen notes");
    if (t.al.length) t.al.forEach(function(a){ out.push("- " + C.subs[a]); }); else out.push("- No peanut, tree nut or milk ingredients.");
    if (t.cold) out.push("## Storage", "- " + C.cold);
    out.push("## Label check (model values)", "- " + t.cal + " Calories · saturated fat " + t.sat + " g · sugars " + t.sug + " g · sodium " + t.na + " mg · fibre " + t.fib + " g", "", C.prepare);
    return out;
  }
  function paint(){
    var d = read(), pv = $("#pl-tkpv"); if (!pv) return;
    var chips = $("#pl-tkc");
    MV.keepFocus(chips, function(){
      chips.innerHTML = '<p class="pl-rgl">Ingredients (' + d.ids.length + ' of 3) <span class="hfa-model">Model data</span></p><div class="pl-snacks" role="group" aria-label="Ingredients">' + TK().ingredients.map(function(x){
        var on = d.ids.indexOf(x.id) >= 0;
        return '<button type="button" class="pl-snack" data-sn="' + x.id + '" data-k="sn' + x.id + '" aria-pressed="' + on + '"><span class="pl-sm" aria-hidden="true">' + (on ? "✓" : "+") + "</span>" + chipT(x) + "</button>";
      }).join("") + '</div><div class="pl-brow"><button type="button" class="btn ghost sm" data-snclear="1" data-k="snclr"' + (d.ids.length ? "" : " disabled") + '>Clear snack</button><span class="tiny" id="pl-snmsg" aria-live="polite"></span></div>';
    });
    var t = tot(d.ids), s = sym(t), L = TK().limits, v = { sat:t.sat, sug:t.sug, fib:t.fib, na:t.na };
    var names0 = order(d.ids).map(function(id){ return ing(id).t; });
    pv.innerHTML = '<p class="pl-tray2"><strong>Your snack:</strong> ' + (names0.length ? names0.join(" + ") : "nothing chosen yet") + "</p>" +
      '<div class="pl-dz">' + nftHTML({ serving:"snack (" + d.ids.length + " of 3 ingredients)", v:v, cal:t.cal, tags:true, cls:"pl-live" }) + '<div class="pl-symw"><p class="pl-symt">Front of package</p>' + (d.ids.length === 3 ? fopHTML(s) : fopHTML([], { hidden:true })) + "</div></div>" +
      '<dl class="read pl-read pl-tkread"><div><dt>Fibre claim</dt><dd>' + (t.fib >= L.fib ? fibClaim(t.fib) : "None (under 2 g)") + "</dd></div>" +
      "<div><dt>Functional ingredient</dt><dd>" + (t.fn.length ? t.fn.map(function(x){ return lc(x.t) + " (" + x.fn + ")"; }).join("; ") : "none yet") + "</dd></div>" +
      "<div><dt>Vegetable or fruit</dt><dd>" + (t.vf.length ? t.vf.map(function(x){ return lc(x.t); }).join(", ") : "none yet") + "</dd></div>" +
      "<div><dt>Allergens</dt><dd>" + (t.al.length ? "contains " + listAnd(t.al) : "no peanut, tree nut or milk") + "</dd></div></dl>" +
      '<p class="tiny muted"><span class="hfa-model">Model data</span> Totals from rounded model values per portion; the symbol uses the model 15% rule.</p><div id="pl-tkkc"></div>';
    var kh = $("#pl-tkkc");
    if (d.ids.length === 3) MV.kitchenCardButton(kh, { title:"Label-smart snack: " + names(keyOf(d)).join(" + "), lines:function(){ return cardLines(read().ids); } });
    else kh.innerHTML = '<p class="tiny muted">Choose 3 ingredients to make a kitchen card.</p>';
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.ids = read().ids;
      inp.innerHTML = '<div class="pl-tin" id="pl-tkc"></div>';
      pv.innerHTML = '<div class="pl-tpv" id="pl-tkpv" aria-live="polite"></div>';
      $("#pl-tkc").addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || b.disabled) return;
        var ids = read().ids.slice(), m = "";
        if (b.dataset.snclear) ids = [];
        else if (b.dataset.sn) {
          var k = ids.indexOf(b.dataset.sn);
          if (k >= 0) ids.splice(k, 1); else if (ids.length >= 3) m = "Your snack already has 3 ingredients. Tap one to remove it first."; else ids.push(b.dataset.sn);
        } else return;
        a.S.ids = ids; a.save(); paint(); a.update();
        if (m) $("#pl-snmsg").textContent = m;
        if (b.dataset.snclear) { var f = $("#pl-tkc [data-sn]"); if (f) f.focus({ preventScroll:true }); }
      });
      paint();
    },
    read:read,
    valid:function(d){ return d.ids.length === 3 ? true : fill(TK().validMsg, { n:d.ids.length }); },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(names(k).join(" + ")); },
    text:function(k){ return names(k).join(" + "); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ detective:detective },
  task:task
});
})();
