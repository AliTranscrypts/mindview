// HFA4U 23 Sustainable Agriculture & Food Waste: hero (100 apples along the chain, then the inverted recovery pyramid),
// Waste tracker (Explore, F9 food system map: Along the chain conveyor with stage bins and a Loss vs waste toggle, Rescue routes
// cart + pyramid with the model rescue rules, Sustainable field soil cross-section with index bars), Waste audit (Part 3: model
// household log sorter with building shares, date-label station, two-fix station, "Check it with data"), Practice 2 (custom
// number-entry and choice set) and the "Cafeteria waste plan" task (pick exactly three action chips; live cut and cost gauges).
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function sgn(v){ v = Math.round(v); return v > 0 ? "+" + v : v < 0 ? MV.MINUS + Math.abs(v) : "0"; }
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function kg(v){ var r = Math.round(v * 100) / 100; return r % 1 === 0 ? r.toFixed(1) : String(r); }
function svgT(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 17 / 12; per-option class, custom layout class, function labels, lock) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint, lock}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "fw-chipset" : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="fw-rgw">' + (lab ? '<span class="fw-rgl">' + lab + "</span>" : "") + '<span class="fw-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + (o.disabled ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b) && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || b.disabled) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint,
    lock:function(on){ o.disabled = !!on; paint(); } };
}

// ---------- @component switchBtn (copied from HFA4U 15 / 12) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="fw-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="fw-swt" aria-hidden="true"><i></i></span><span class="fw-swl">' + label + '</span><span class="fw-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}
function setSwitch(b, on){ if (!b) return; b.setAttribute("aria-checked", !!on); b.querySelector(".fw-swv").textContent = on ? "On" : "Off"; }

// ---------- models (plan's exact tables; content.explore) ----------
function EX(){ return MV.C.explore; }
function foodOf(id){ return byId(EX().foods, id) || EX().foods[0]; }
function chainNums(f){
  var loss = f.kg[0] + f.kg[1], waste = f.kg[2] + f.kg[3], mx = Math.max.apply(null, f.kg);
  var big = EX().stages.filter(function(s, i){ return f.kg[i] === mx; });
  return { loss:loss, waste:waste, mx:mx, big:big };
}
function FLD(){ return EX().field; }
function normPr(p){ var o = {}; FLD().practices.forEach(function(x){ o[x.id] = !!(p && p[x.id]); }); return o; }
function prOn(p){ return FLD().practices.filter(function(x){ return p[x.id]; }).map(function(x){ return x.id; }); }
function fieldVals(p){
  var b = FLD().base, v = { y:b.y, soil:b.soil, ero:b.ero, pest:b.pest };
  FLD().practices.forEach(function(x){ if (p[x.id]) { v.y += x.y; v.soil += x.soil; v.ero += x.ero; v.pest += x.pest; } });
  return v;
}
function soilLab(s){ var L = FLD().soilLabels; s = Math.round(s); return s <= -1 ? L.low : s === 0 ? L.mid : L.high; }
function eroLab(e){ var L = FLD().eroLabels; e = Math.round(e); return e >= 5 ? L.high : e >= 3 ? L.mid : L.low; }
function fieldLine(v){ return "Yield " + Math.round(v.y) + " · Soil: " + soilLab(v.soil) + " · Erosion: " + eroLab(v.ero) + " · Pesticide " + Math.round(v.pest); }
function destIds(){ return EX().dests.map(function(d){ return d.id; }); }
function allowedAt(it, dest){ return !(it.no && it.no[dest]); }

// ---------- hero (storyboard: 100 apples on a farm; a few drop at each stage into a "lost or wasted" pile; the pile tips into
// the inverted pyramid, the top tiers glow, an arrow at the bottom points to "landfill → methane"; final frame "Start at the top".
// Reduced motion: the final frame only) ----------
function hero(f){
  var host = $("#fw-hero"); if (!host) return;
  var H = MV.C.hero, capEl = f.cap, X = [90, 240, 390, 540], order = MV.shuffle(Array.from({ length:100 }, function(_, i){ return i; }), "fw-apples"), stageOf = new Array(100), pileIdx = new Array(100), n = 0;
  H.drops.forEach(function(d, s){ for (var k = 0; k < d; k++) { var a = order[n]; stageOf[a] = s; pileIdx[a] = n; n++; } });
  for (; n < 100; n++) stageOf[order[n]] = 4;
  var lost = H.drops.reduce(function(a, b){ return a + b; }, 0);
  host.innerHTML = '<svg class="fw-hsvg" id="fw-hsvg" viewBox="0 0 640 300" role="img" aria-label="' + esc(H.aria) + '"></svg>';
  var svg = $("#fw-hsvg");
  function pilePos(j){ return [190 + (j % 20) * 11, 286 - Math.floor(j / 20) * 11]; }
  function chainFrame(u, op){
    var h = '<g style="opacity:' + f1(op) + '">', seg = clamp(Math.floor(u * 4), 0, 3), w = clamp(u * 4 - seg, 0, 1), dropped = 0;
    h += '<line class="fw-hbelt" x1="30" y1="168" x2="610" y2="168"/>';
    X.forEach(function(x, s){ h += svgT(x, 24, H.stages[s], "fw-hst" + (s === seg && u < 1 ? " on" : "")); });
    var mv = u >= 1 ? 1 : MV.ease(clamp((w - 0.55) / 0.45, 0, 1)), bx = u >= 1 ? X[3] + 0 : lerp(X[seg], seg < 3 ? X[seg + 1] : X[3], seg < 3 ? mv : 0);
    for (var i = 0; i < 100; i++) {
      var ds = stageOf[i], gx = bx - 40.5 + (i % 10) * 9, gy = 70 + Math.floor(i / 10) * 9, x, y, p;
      if (ds < 4 && (ds < seg || u >= 1 || (ds === seg && w >= 0.5))) { p = pilePos(pileIdx[i]); x = p[0]; y = p[1]; dropped++; }
      else if (ds === seg) { var t = MV.ease(clamp(w / 0.5, 0, 1)), sx = X[seg] - 40.5 + (i % 10) * 9; p = pilePos(pileIdx[i]); x = lerp(sx, p[0], t); y = lerp(gy, p[1], t); if (t > 0.98) dropped++; }
      else { x = gx; y = gy; }
      h += '<circle class="fw-apple' + (ds < 4 && (ds < seg || u >= 1 || ds === seg) ? " lost" : "") + '" cx="' + f1(x) + '" cy="' + f1(y) + '" r="3.6"/>';
    }
    h += svgT(450, 284, H.pile + ": " + Math.min(dropped, lost), "fw-hpile", "start");
    return h + "</g>";
  }
  function pyrFrame(v, glow){
    var h = '<g class="fw-hpyr">', T = H.tiers, top = 38, th = 34, gap = 4;
    T.forEach(function(t, i){
      var op = clamp(v * 7 - i, 0, 1), w = 440 - i * 52, x = 320 - w / 2, y = top + i * (th + gap);
      h += '<g style="opacity:' + f1(op) + '"><rect class="fw-htier' + (glow && i < 2 ? " glow" : "") + '" x="' + f1(x) + '" y="' + y + '" width="' + w + '" height="' + th + '" rx="5"/>' + svgT(320, y + 22, (i + 1) + ". " + t, "fw-htt") + "</g>";
    });
    var ly = top + 5 * (th + gap), ao = clamp(v * 7 - 6, 0, 1);
    h += '<g style="opacity:' + f1(ao) + '"><path class="fw-harrow" d="M' + (320 + 95) + " " + (ly + 17) + "H" + 520 + '"/><path class="fw-harrowh" d="M' + 512 + " " + (ly + 11) + "L" + 522 + " " + (ly + 17) + "L" + 512 + " " + (ly + 23) + '"/>' + svgT(528, ly + 21, H.methane.split("→")[1].trim(), "fw-hmeth", "start") + "</g>";
    if (glow) h += svgT(320, 24, H.final + " ↓", "fw-hfin");
    return h + "</g>";
  }
  function draw(t){
    if (t >= 1) { svg.innerHTML = pyrFrame(1, true); return; }
    if (t < 0.62) svg.innerHTML = chainFrame(t / 0.62, 1);
    else { var v = (t - 0.62) / 0.38; svg.innerHTML = chainFrame(1, clamp(1 - v * 3, 0, 1)) + pyrFrame(clamp((v - 0.15) / 0.75, 0, 1), v > 0.9); }
  }
  if (MV.reduceMotion) { draw(1); if (capEl) capEl.textContent = H.final; return; }
  draw(0); if (capEl) capEl.textContent = "";
  MV.wait(400, function(){
    MV.tween({ dur:7600, ease:function(t){ return t; }, step:function(t){
      draw(t);
      if (capEl) { var s = t < 0.62 ? H.stages.slice(0, clamp(Math.floor(t / 0.62 * 4), 0, 3) + 1).join(" → ") : t < 0.97 ? "Food recovery hierarchy" : H.final; if (capEl.textContent !== s) capEl.textContent = s; }
    }, done:function(){ draw(1); if (capEl) capEl.textContent = H.final; } });
  });
}

// ---------- Explore: Waste tracker (@component F9 foodSystemMap — Along the chain conveyor with stage bins, Rescue routes cart and
// inverted pyramid, Sustainable field soil cross-section with index bars; one readout panel for all three modes) ----------
function explore(host, api){
  var D = api.content, S = api.S, anim = null, sel = null, rmsg = null;
  var fx = { grow:null, lit:"", rule:-1, pass:-1, fv:null };
  S.mode = byId(D.modes, S.mode) ? S.mode : "chain";
  S.food = byId(D.foods, S.food) ? S.food : "lettuce";
  S.grp = !!S.grp; S.cmp = S.cmp === "loss" || S.cmp === "waste" ? S.cmp : "";
  S.place = S.place || {}; Object.keys(S.place).forEach(function(k){ if (!byId(D.items, k) || destIds().indexOf(S.place[k]) < 0) delete S.place[k]; });
  S.pr = normPr(S.pr);

  host.innerHTML = '<div id="fw-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="fw-lab" data-mv="graph"><div class="fw-main">' +
      '<section class="fw-pane" id="fw-chain"><div id="fw-food"></div><div class="fw-swrow">' + switchHTML("fwgrp", "<strong>" + D.groupLabel + "</strong>", S.grp, 'id="fw-grp"') + "</div>" +
        '<p class="tiny muted fw-cnote">' + D.chainNote + ' <span class="hfa-model">' + D.modelTag + "</span></p>" +
        '<div class="fw-conv" id="fw-conv" role="img"></div><div id="fw-cmp"></div></section>' +
      '<section class="fw-pane" id="fw-rescue"><details class="fw-rulesd" open><summary>' + D.rulesTitle + '</summary><ol class="fw-rules" id="fw-rules">' + D.rules.map(function(r, i){ return '<li data-rule="' + i + '">' + r + "</li>"; }).join("") + "</ol></details>" +
        '<div class="fw-cart"><h4 class="fw-h4">On the cart at closing <span class="hfa-model">' + D.modelTag + '</span></h4><p class="tiny muted">Tap an item, then tap a level of the pyramid.</p><div class="fw-cartin" id="fw-cartin" role="group" aria-label="Surplus items on the cart"></div></div>' +
        '<div class="fw-rmsg" id="fw-rmsg" aria-live="polite"></div><ol class="fw-pyr" id="fw-pyr" aria-label="Food recovery hierarchy, most preferred first"></ol>' +
        '<div class="q-actions"><button type="button" class="btn ghost sm" id="fw-rreset" data-k="fwrreset">Put everything back on the cart</button></div></section>' +
      '<section class="fw-pane" id="fw-field"><div class="fw-rgw fw-prw"><span class="fw-rgl" id="fw-prl">Practices</span><div class="fw-togs" id="fw-ftogs" role="group" aria-labelledby="fw-prl">' + D.field.practices.map(function(x){
          return '<label class="fw-tog"><input type="checkbox" data-pr="' + x.id + '" data-k="fwpr' + x.id + '"><span>' + x.t + "</span></label>";
        }).join("") + "</div></div>" +
        '<figure class="fw-fig"><svg class="fw-fsvg" id="fw-fsvg" viewBox="0 0 400 176" role="img"></svg><figcaption class="tiny" id="fw-fleg"></figcaption></figure>' +
        '<div class="fw-fbars" id="fw-fbars" aria-live="polite"></div><p class="tiny muted">' + D.field.note + " " + D.field.labelRules + "</p></section>" +
    '</div><div class="fw-side"><h4 class="fw-h4">Readout <span class="hfa-model">' + D.modelTag + '</span></h4><dl class="read fw-read" id="fw-read" aria-live="polite"></dl></div></div>' +
    '<details class="alg fw-tables"><summary>Model data tables</summary><div id="fw-tabs"></div></details>';

  var modeRG = radios($("#fw-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ userChange(); S.mode = v; MV.banner("", ""); commit(); } });
  var foodRG = radios($("#fw-food"), { label:"Food", cls:"chips", options:D.foods, value:S.food, onChange:function(v){ userChange(); S.food = v; S.cmp = ""; commit(); } });
  var cmpRG = radios($("#fw-cmp"), { label:D.cmpAsk, cls:"chips", options:D.cmp, value:S.cmp, onChange:function(v){ userChange(); S.cmp = v; commit(); } });
  $("#fw-grp").addEventListener("click", function(){ userChange(); S.grp = !S.grp; commit(); });
  $("#fw-ftogs").addEventListener("change", function(e){ var c = e.target.closest("[data-pr]"); if (!c) return; userChange(); S.pr[c.dataset.pr] = c.checked; commit(); });
  $("#fw-rreset").addEventListener("click", function(){ userChange(); S.place = {}; sel = null; rmsg = null; commit(); });
  $("#fw-rescue").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.item) { userChange(); sel = sel === b.dataset.item ? null : b.dataset.item; rmsg = null; paintRescue(); return; }
    if (b.dataset.dest) {
      userChange();
      if (!sel) { rmsg = { cls:"", h:"Tap an item on the cart first, then tap a level." }; paintRescue(); return; }
      place(sel, b.dataset.dest); sel = null; commit();
    }
  });

  // model tables (plan's data)
  (function(){
    var rows = D.foods.map(function(f){ var c = chainNums(f); return ["<strong>" + f.t + "</strong>"].concat(f.kg.map(String), [String(f.eaten), String(c.loss), String(c.waste)]); });
    var F = D.field, frows = [["Baseline", String(F.base.y), sgn(F.base.soil) + " (" + soilLab(F.base.soil) + ")", F.base.ero + " (" + eroLab(F.base.ero) + ")", String(F.base.pest)]].concat(F.practices.map(function(p){
      return ["+ " + p.t, sgn(p.y), sgn(p.soil), sgn(p.ero), sgn(p.pest) + (p.note ? " (" + p.note + ")" : "")];
    }));
    $("#fw-tabs").innerHTML = '<p class="tiny"><strong>Along the chain</strong> (kg per 100 kg produced) <span class="hfa-model">' + D.modelTag + "</span></p>" +
      MV.tableHTML({ head:["Food"].concat(D.stages.map(function(s){ return s.t; }), ["Eaten", "Lost before retail", "Wasted after"]), rows:rows, caption:"Along the chain, kg per 100 kg produced (model data)" }) +
      '<p class="tiny"><strong>Sustainable field</strong> (index values over a 4-year cycle; effects add) <span class="hfa-model">' + D.modelTag + "</span></p>" +
      MV.tableHTML({ head:["Practice", "Yield index", "Soil organic matter", "Erosion score", "Pesticide index"], rows:frows, caption:"Sustainable field, model index values" });
  })();

  // ===== rescue routes =====
  function place(id, dest){
    var it = byId(D.items, id); S.place[id] = dest;
    var ok = allowedAt(it, dest); fx.rule = dest === "people" ? 0 : dest === "animals" ? 1 : -1;
    rmsg = ok ? { cls:"good", h:"<strong>" + it.short + " → " + byId(D.dests, dest).t + ".</strong> " + D.allowed } : { cls:"bad", h:"<strong>✗ " + it.short + " → " + byId(D.dests, dest).t + ".</strong> " + it.no[dest] };
  }
  function nHigh(){ return D.items.filter(function(it){ return S.place[it.id] === MV.ans(it); }).length; }
  function paintRescue(){
    var box = $("#fw-rescue");
    MV.keepFocus(box, function(){
      var cart = D.items.filter(function(it){ return !S.place[it.id]; });
      $("#fw-cartin").innerHTML = cart.length ? cart.map(function(it){ return '<button type="button" class="fw-item" data-item="' + it.id + '" data-k="fwit' + it.id + '" aria-pressed="' + (sel === it.id) + '">' + it.t + "</button>"; }).join("") : '<p class="tiny muted">The cart is empty.</p>';
      var pyr = '<li class="fw-tier fw-t0"><span class="fw-tname"><strong>1. ' + D.prevent.t + "</strong><small>" + D.prevent.sub + "</small></span></li>";
      pyr += D.dests.map(function(d, i){
        var inside = D.items.filter(function(it){ return S.place[it.id] === d.id; });
        return '<li class="fw-tier fw-t' + (i + 1) + (fx.pass === i ? " fw-pass" : "") + '"><button type="button" class="fw-dest' + (sel ? " ready" : "") + '" data-dest="' + d.id + '" data-k="fwd' + d.id + '"><strong>' + (i + 2) + ". " + d.t + "</strong>" + (d.sub ? "<small>" + d.sub + "</small>" : "") + "</button>" +
          (inside.length ? '<span class="fw-in">' + inside.map(function(it){ var ok = allowedAt(it, d.id); return '<button type="button" class="fw-item sm' + (ok ? "" : " no") + '" data-item="' + it.id + '" data-k="fwit' + it.id + '" aria-pressed="' + (sel === it.id) + '">' + (ok ? "" : '<span aria-hidden="true">✗ </span><span class="vh">not allowed: </span>') + it.short + "</button>"; }).join("") + "</span>" : "") + "</li>";
      }).join("");
      $("#fw-pyr").innerHTML = pyr;
      $("#fw-rmsg").innerHTML = rmsg ? MV.fbHTML(rmsg.cls, rmsg.h) : (sel ? '<p class="tiny">Selected: <strong>' + byId(D.items, sel).t + "</strong>. Now tap a level.</p>" : "");
      $$("#fw-rules [data-rule]").forEach(function(li){ li.classList.toggle("fw-lit", +li.dataset.rule === fx.rule); });
    });
  }

  // ===== along the chain =====
  function bins(){
    var f = foodOf(S.food), c = chainNums(f), L;
    if (S.grp) L = [{ id:"loss", t:D.lossT, sub:D.lossSub, kg:c.loss, kind:"loss" }, { id:"waste", t:D.wasteT, sub:D.wasteSub, kg:c.waste, kind:"waste" }];
    else L = D.stages.map(function(s, i){ return { id:s.id, t:s.t, kg:f.kg[i], kind:s.kind, causes:s.causes }; });
    L.push({ id:"eaten", t:D.eatenT, kg:f.eaten, kind:"eaten" });
    return L;
  }
  var KW = { loss:"Loss", waste:"Waste", eaten:"Eaten" };
  function paintConv(){
    var B = bins(), g = fx.grow, f = foodOf(S.food);
    $("#fw-conv").innerHTML = '<ol class="fw-bins' + (S.grp ? " grp" : "") + '">' + B.map(function(b, i){
      var p = g == null ? 1 : clamp(g * B.length - i, 0, 1), v = b.kg * p;
      return '<li class="fw-bin fw-' + b.kind + (fx.lit === b.id ? " fw-lit" : "") + '"><span class="fw-bk">' + KW[b.kind] + '</span><span class="fw-bv"><b>' + Math.round(v) + "</b> kg</span>" +
        '<span class="fw-bt" aria-hidden="true"><i style="--v:' + (Math.round(clamp(v / 80, 0, 1) * 1000) / 1000) + '"></i></span><span class="fw-bl">' + b.t + (b.sub ? "<small>" + b.sub + "</small>" : "") + "</span>" +
        (b.causes ? '<span class="fw-tags">' + b.causes.map(function(c){ return "<span>" + c + "</span>"; }).join("") + "</span>" : "") + "</li>";
    }).join("") + "</ol>";
    $("#fw-conv").setAttribute("aria-label", f.t + ", kilograms per 100 kg produced (model data): " + B.map(function(b){ return b.t + " " + b.kg; }).join(", ") + ".");
  }

  // ===== sustainable field =====
  function paintField(){
    var v = fx.fv || fieldVals(S.pr), p = S.pr, svg = "", soilOp = clamp(0.22 + 0.16 * (v.soil + 3), 0.18, 0.9), top = 72, n = 16, dx = 380 / n, i;
    // soil band (darker = more organic matter), gullies cut into the surface (one per erosion point)
    svg += '<rect class="fw-soil" x="10" y="' + top + '" width="380" height="94" rx="4" style="fill-opacity:' + f1(soilOp * 100) / 100 + '"/>';
    var ge = Math.max(0, Math.round(v.ero));
    for (i = 0; i < ge; i++) { var gx = 22 + (i + 0.5) * (356 / Math.max(ge, 1)), gw = 9, gd = 16; svg += '<path class="fw-gully" d="M' + f1(gx - gw) + " " + top + "L" + f1(gx) + " " + (top + gd) + "L" + f1(gx + gw) + " " + top + 'Z"/>'; }
    svg += '<line class="fw-surf" x1="10" y1="' + top + '" x2="390" y2="' + top + '"/>';
    // crop plants: height follows the yield index; with summer fallow, one strip in four stays bare
    var hgt = 46 * clamp(v.y / 104, 0, 1);
    for (i = 0; i < n; i++) {
      var px = 10 + (i + 0.5) * dx, bare = p.fal && i % 4 === 3;
      if (bare) { svg += '<path class="fw-bare" d="M' + f1(px - 7) + " " + (top - 2) + "h14" + '"/>'; continue; }
      var alt = p.rot && i % 2 === 1, h = hgt * (alt ? 0.8 : 1);
      svg += '<path class="fw-stem" d="M' + f1(px) + " " + top + "v" + f1(-h) + '"/>' + (alt ? '<circle class="fw-leaf" cx="' + f1(px) + '" cy="' + f1(top - h) + '" r="4.5"/>' : '<path class="fw-leafp" d="M' + f1(px) + " " + f1(top - h * 0.55) + "l-6 -5M" + f1(px) + " " + f1(top - h * 0.75) + "l6 -5" + '"/>');
      if (p.ic && i % 2 === 0) svg += '<circle class="fw-ic" cx="' + f1(px + dx / 2) + '" cy="' + (top - 5) + '" r="3.2"/>';
    }
    if (p.cc) for (i = 0; i < n; i++) { var cx = 10 + i * dx + 3; svg += '<path class="fw-cover" d="M' + f1(cx) + " " + (top - 6) + "L" + f1(cx + 3) + " " + top + "L" + f1(cx + 6) + " " + (top - 6) + '"/>'; }
    if (p.nt) for (i = 0; i < n * 2; i++) { var sx = 12 + i * dx / 2; svg += '<path class="fw-stub" d="M' + f1(sx) + " " + (top - 1.5) + "l5 -2" + '"/>'; }
    svg += svgT(200, top + 52, "Soil organic matter: " + soilLab(v.soil) + " (" + sgn(v.soil) + ")", "fw-ftx");
    svg += svgT(200, top + 72, "Erosion: " + eroLab(v.ero) + " (" + Math.round(v.ero) + ")", "fw-ftx");
    $("#fw-fsvg").innerHTML = svg;
    var on = prOn(p).map(function(id){ var x = byId(D.field.practices, id); return x.short || x.t.toLowerCase(); });
    var desc = "Soil cross-section of the model field" + (on.length ? " with " + listAnd(on) : ", baseline (no practices)") + ". Soil organic matter " + soilLab(v.soil) + "; erosion " + eroLab(v.ero) + ", " + Math.round(v.ero) + " gullies; crop height follows yield " + Math.round(v.y) + (p.fal ? "; one strip in four is bare (fallow)" : "") + ".";
    $("#fw-fsvg").setAttribute("aria-label", desc);
    var leg = ["darker soil = more organic matter", "notches = gullies (erosion)"];
    if (p.rot) leg.push("two crops in turn (rotation)"); if (p.cc) leg.push("small V shapes = cover crop"); if (p.nt) leg.push("dashes = residue left by no-till"); if (p.ic) leg.push("dots = second crop (intercropping)"); if (p.fal) leg.push("bare strip = fallow year");
    $("#fw-fleg").textContent = cap(leg.join(" · ")) + ".";
    function bar(lab, val, pct, word, extra){ return '<div class="fw-g"><span class="fw-gl">' + lab + '</span><b class="fw-gv">' + val + (word ? ' <span class="fw-gw">' + word + "</span>" : "") + '</b><span class="fw-gt" aria-hidden="true"><i style="width:' + f1(clamp(pct, 0, 100)) + '%"></i></span>' + (extra ? '<span class="tiny muted fw-gx">' + extra + "</span>" : "") + "</div>"; }
    $("#fw-fbars").innerHTML = bar("Yield index", Math.round(v.y), v.y / 110 * 100) +
      bar("Soil organic matter", sgn(v.soil), (v.soil + 4) / 8 * 100, soilLab(v.soil)) +
      bar("Erosion score", Math.round(v.ero), v.ero / 10 * 100, eroLab(v.ero)) +
      bar("Pesticide index", Math.round(v.pest), v.pest / 120 * 100, "", p.nt ? "No-till: more herbicide." : "");
  }

  // ===== readout =====
  function paintRead(){
    var f = foodOf(S.food), c = chainNums(f), causes = c.big[0].causes.slice(0, 2).map(function(s){ return s.replace(/\s*\(.*\)$/, ""); });
    var rows = [["food", "Food", f.t], ["loss", "Lost before retail", c.loss + " kg (" + c.loss + "%)"], ["waste", "Wasted after", c.waste + " kg (" + c.waste + "%)"],
      ["big", "Biggest stage", c.big.map(function(s){ return s.t; }).join(" and ") + " (" + c.mx + ")"], ["causes", "Top causes", cap(causes.join(" · "))],
      ["routes", "Routes", nHigh() + " of " + D.items.length + " items at their highest allowed level"], ["field", "Field", fieldLine(fx.fv || fieldVals(S.pr))], ["data", "Data", D.modelTag]];
    $("#fw-read").innerHTML = rows.map(function(r){ return '<div data-row="' + r[0] + '"' + (fx.lit === r[0] ? ' class="fw-lit"' : "") + "><dt>" + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
  }
  function paint(){
    modeRG.set(S.mode); foodRG.set(S.food); cmpRG.set(S.cmp); setSwitch($("#fw-grp"), S.grp);
    $$("#fw-ftogs [data-pr]").forEach(function(c){ c.checked = !!S.pr[c.dataset.pr]; });
    $("#fw-chain").hidden = S.mode !== "chain"; $("#fw-rescue").hidden = S.mode !== "rescue"; $("#fw-field").hidden = S.mode !== "field";
    paintConv(); paintRescue(); paintField(); paintRead();
  }
  function commit(){ api.save(); paint(); MV.changed(); }
  paint();

  // ===== animation bookkeeping: any user input finishes a running reveal at once =====
  function runAnim(dur, step, end, done){
    var finished = false, c = null;
    function finish(){ if (finished) return; finished = true; anim = null; end(); api.save(); paint(); MV.changed(); if (done) done(); }
    anim = { cancel:function(){ if (c) c(); }, finish:finish };
    c = MV.tween({ dur:dur, ease:function(t){ return t; }, step:step, done:finish });
  }
  function userChange(){ if (anim) { var a = anim; anim = null; try { a.cancel(); } catch (e) {} a.finish(); } fx.lit = ""; fx.rule = -1; fx.pass = -1; fx.grow = null; fx.fv = null; }

  // ===== predictions =====
  function rise(id, dest, extra, done){
    var top = destIds().indexOf(dest), last = D.dests.length - 1;
    runAnim(1400, function(t){ var k = Math.round(lerp(last, top, MV.ease(t))); if (k !== fx.pass) { fx.pass = k; paintRescue(); } },
      function(){ fx.pass = -1; place(id, dest); sel = null; if (extra) extra(); }, done);
  }
  var predict = {
    start:function(p){
      userChange(); MV.banner("", ""); rmsg = null;
      if (p.id === "p1") { S.mode = "chain"; S.food = "lettuce"; S.grp = false; S.cmp = ""; }
      else if (p.id === "p2") { S.mode = "rescue"; delete S.place.bread; sel = "bread"; }
      else if (p.id === "p3") { S.mode = "rescue"; delete S.place.yogurt; sel = "yogurt"; }
      else { S.mode = "field"; S.pr = normPr({}); }
      commit();
    },
    run:function(p, done){
      if (p.id === "p1") { fx.grow = 0; runAnim(2600, function(t){ fx.grow = t; paintConv(); }, function(){ fx.grow = null; fx.lit = "home"; }, done); }
      else if (p.id === "p2") rise("bread", "people", null, done);
      else if (p.id === "p3") rise("yogurt", "people", function(){ fx.rule = 0; }, done);
      else {
        var a = fieldVals(S.pr), on = normPr(S.pr); on.fal = true; var b = fieldVals(on);
        S.pr.fal = true; $$("#fw-ftogs [data-pr]").forEach(function(c){ c.checked = !!S.pr[c.dataset.pr]; });
        runAnim(1500, function(t){ var e = MV.ease(t); fx.fv = { y:lerp(a.y, b.y, e), soil:lerp(a.soil, b.soil, e), ero:lerp(a.ero, b.ero, e), pest:lerp(a.pest, b.pest, e) }; paintField(); paintRead(); },
          function(){ fx.fv = null; fx.lit = "field"; }, done);
      }
    }
  };

  // ===== challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var c = byId(D.challenges, id), M = c.msgs;
    if (id === "tc1") {
      if (S.mode !== "chain") return { ok:false, msg:M.mode };
      if (S.food === "potatoes") return S.cmp === "loss" ? { ok:true } : { ok:false, msg:S.cmp === "waste" ? M.wrongChip : M.chip };
      return { ok:false, msg:M[S.food] };
    }
    if (id === "tc2") {
      if (S.mode !== "rescue") return { ok:false, msg:M.mode };
      var left = D.items.filter(function(it){ return !S.place[it.id]; }).length;
      if (left) return { ok:false, msg:fill(M.all, { n:left }) };
      var wrong = D.items.filter(function(it){ return S.place[it.id] !== MV.ans(it); });
      if (!wrong.length) return { ok:true };
      for (var i = 0; i < wrong.length; i++) { var k = wrong[i].id + "|" + S.place[wrong[i].id]; if (M[k]) return { ok:false, msg:M[k] }; }
      return { ok:false, msg:fill(M.other, { n:D.items.length - wrong.length, list:listAnd(wrong.map(function(it){ return it.short.toLowerCase(); })) }) };
    }
    if (id === "tc3") {
      if (S.mode !== "field") return { ok:false, msg:M.mode };
      var v = fieldVals(S.pr), on = prOn(S.pr), works = v.soil >= 1 && v.ero <= 2 && v.y >= 98;
      function same(set){ return on.length === set.length && set.every(function(x){ return S.pr[x]; }); }
      if (works && on.length === 3) return { ok:true };
      if (works) return { ok:false, msg:same(["rot", "cc", "nt", "ipm"]) ? M.ipm : M.more };
      if (S.pr.fal) return { ok:false, msg:M.fallow };
      if (same(["cc", "nt"])) return { ok:false, msg:M.ccnt };
      if (same(["rot", "ic", "cc"])) return { ok:false, msg:M.ricc };
      return { ok:false, msg:fill(M.other, { y:v.y, soil:sgn(v.soil), sl:soilLab(v.soil), ero:v.ero, el:eroLab(v.ero) }) };
    }
    return { ok:false };
  }
  return { predict:predict, challenge:challenge };
}

// ---------- Part 3: Waste audit (@component auditStations — model household log sorter with building reason shares, a date-label
// station with a meaning per label, a two-fix station with before/after bars, and "Check it with data") ----------
function part3(host, api){
  var D = api.content, S = api.S, LG = D.log, LB = D.labels, FX = D.fixes;
  S.st = byId(D.stations, S.st) ? S.st : D.stations[0].id;
  S.log = S.log || {}; S.lab = S.lab || { pick:{}, checked:false }; S.lab.pick = S.lab.pick || {};
  S.fix = Array.isArray(S.fix) ? S.fix.filter(function(id){ return byId(FX.list, id); }).slice(0, 2) : [];
  var sel = null, lmsg = null, fmsg = null;
  host.innerHTML = '<div id="fw-stn"></div><div class="fw-st" id="fw-s1"></div><div class="fw-st" id="fw-s2"></div><div class="fw-st" id="fw-s3"></div>' +
    '<details class="alg fw-data"><summary>' + D.data.title + "</summary>" + D.data.rows.map(function(r){ return '<p><strong>' + r.t + ".</strong> " + r.h + ' <span class="fw-cite">' + r.cite + "</span></p>"; }).join("") + '<p class="tiny">' + D.data.note + "</p></details>";
  var stRG = radios($("#fw-stn"), { label:"Station", cls:"chips", options:D.stations, value:S.st, onChange:function(v){ S.st = v; api.save(); show(); } });
  function show(){ stRG.set(S.st); D.stations.forEach(function(s){ $("#fw-" + s.id).hidden = s.id !== S.st; }); }

  // ----- station 1: the week's log -----
  function binKg(b, src){ return LG.items.filter(function(it){ return (src || S.log)[it.id] === b; }).reduce(function(a, it){ return a + it.kg; }, 0); }
  function allLog(){ return LG.items.every(function(it){ return S.log[it.id] === MV.ans(it); }); }
  function paint1(){
    var box = $("#fw-s1"), left = LG.items.filter(function(it){ return !S.log[it.id]; }), placedKg = LG.items.reduce(function(a, it){ return a + (S.log[it.id] ? it.kg : 0); }, 0);
    MV.keepFocus(box, function(){
      var h = '<h4 class="fw-h4">The model household’s week <span class="hfa-model">Model data</span></h4><p class="how">' + LG.ask + "</p>";
      h += '<div class="fw-tray" role="group" aria-label="Wasted items to sort">' + (left.length ? left.map(function(it){
        return '<button type="button" class="fw-logit" data-lg="' + it.id + '" data-k="fwlg' + it.id + '" aria-pressed="' + (sel === it.id) + '"><span>' + it.t + '</span><small><b>' + kg(it.kg) + " kg</b> · " + it.reason + "</small></button>";
      }).join("") : '<p class="tiny muted">Every item is sorted.</p>') + "</div>";
      if (lmsg) h += MV.fbHTML(lmsg.cls, lmsg.h);
      h += '<div class="fw-rbins">' + LG.bins.map(function(b){
        var k = binKg(b.id), pct = Math.round(k / LG.total * 100), inside = LG.items.filter(function(it){ return S.log[it.id] === b.id; });
        return '<button type="button" class="fw-rbin' + (sel ? " ready" : "") + '" data-rb="' + b.id + '" data-k="fwrb' + b.id + '"><span class="fw-rbh"><strong>' + b.t + "</strong><span>" + kg(k) + " kg (" + pct + '%)</span></span><span class="fw-gt" aria-hidden="true"><i style="width:' + pct + '%"></i></span>' +
          (inside.length ? '<span class="fw-rbin-in">' + inside.map(function(it){ return "<span>" + it.t + " (" + kg(it.kg) + " kg)</span>"; }).join("") + "</span>" : "") + "</button>";
      }).join("") + "</div>";
      h += '<p class="tiny fw-tot" aria-live="polite">Sorted: ' + kg(placedKg) + " kg of the week’s " + kg(LG.total) + " kg total.</p>";
      if (S.log.g7) h += '<div class="hfa-support fw-chick" role="note"><p>' + LG.chicken + "</p></div>";
      if (allLog()) h += MV.fbHTML("good", "<strong>✓ " + LG.done + "</strong>");
      box.innerHTML = h;
    });
  }
  $("#fw-s1").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.lg) { sel = sel === b.dataset.lg ? null : b.dataset.lg; lmsg = null; paint1(); return; }
    if (b.dataset.rb) {
      if (!sel) { lmsg = { cls:"", h:"Tap an item first, then tap its reason bin." }; paint1(); return; }
      var it = byId(LG.items, sel);
      if (b.dataset.rb === MV.ans(it)) { S.log[it.id] = b.dataset.rb; lmsg = { cls:"good", h:"<strong>✓ " + it.t + "</strong>: " + kg(it.kg) + " kg." }; sel = null; api.save(); }
      else lmsg = { cls:"bad", h:"<strong>✗ Not that bin.</strong> " + LG.wrong };
      paint1(); paint3(); MV.focusFb($("#fw-s1"));
    }
  });

  // ----- station 2: date labels -----
  var labRG = {};
  (function(){
    var box = $("#fw-s2");
    box.innerHTML = '<h4 class="fw-h4">Read the date labels</h4><p class="how">' + LB.ask + '</p><div class="fw-labs">' + LB.items.map(function(it){
      return '<div class="fw-lab1"><p class="fw-ltag"><span class="fw-stamp">' + it.t + "</span>" + (it.on ? ' <span class="tiny muted">' + it.on + "</span>" : "") + '</p><div id="fw-lp-' + it.id + '"></div><div class="fw-lfb" id="fw-lf-' + it.id + '"></div></div>';
    }).join("") + '</div><div class="q-actions" id="fw-lchkw"><button type="button" class="btn primary sm" id="fw-lchk" data-k="fwlchk">Check the labels</button></div><div id="fw-lfb"></div>';
    LB.items.forEach(function(it){
      labRG[it.id] = radios($("#fw-lp-" + it.id), { aria:"Meaning of " + it.t, cls:"chips", options:LB.meanings, value:S.lab.pick[it.id] || "", onChange:function(v){ S.lab.pick[it.id] = v; S.lab.checked = false; api.save(); paint2(); } });
    });
    $("#fw-lchk").addEventListener("click", function(){
      if (!LB.items.every(function(it){ return S.lab.pick[it.id]; })) { S.lab.checked = false; $("#fw-lfb").innerHTML = MV.fbHTML("", "Choose a meaning for every label first."); MV.focusFb($("#fw-s2")); return; }
      S.lab.checked = true; api.save(); paint2(); MV.focusFb($("#fw-s2"));
    });
  })();
  function labOk(it){ return S.lab.pick[it.id] === MV.ans(it); }
  function paint2(){
    var all = S.lab.checked && LB.items.every(labOk);
    LB.items.forEach(function(it){
      labRG[it.id].lock(all);
      $("#fw-lf-" + it.id).innerHTML = S.lab.checked ? (labOk(it) ? '<p class="tiny fw-okl">✓ Right.</p>' : '<p class="tiny fw-nol">✗ ' + it.fb + "</p>") : "";
    });
    $("#fw-lchkw").hidden = all;
    $("#fw-lfb").innerHTML = S.lab.checked ? (all ? MV.fbHTML("good", "<strong>✓ " + LB.done + "</strong>") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> Change the labels marked ✗, then check again.")) : "";
  }

  // ----- station 3: two fixes -----
  function after(){
    var keep = {}; LG.bins.forEach(function(b){ keep[b.id] = 1; });
    S.fix.forEach(function(id){ var f = byId(FX.list, id); keep[f.target] *= f.keep; });
    var o = {}; LG.bins.forEach(function(b){ var base = LG.items.filter(function(it){ return MV.ans(it) === b.id; }).reduce(function(a, it){ return a + it.kg; }, 0); o[b.id] = { before:base, after:base * keep[b.id] }; });
    return o;
  }
  function paint3(){
    var box = $("#fw-s3"), A = after(), tb = 0, ta = 0;
    LG.bins.forEach(function(b){ tb += A[b.id].before; ta += A[b.id].after; });
    MV.keepFocus(box, function(){
      var h = '<h4 class="fw-h4">Choose two fixes <span class="hfa-model">Model data</span></h4><p class="how">' + FX.ask + '</p><div class="fw-chipset" role="group" aria-label="Fixes (choose two)">' + FX.list.map(function(f){
        var on = S.fix.indexOf(f.id) >= 0; return '<button type="button" data-fx="' + f.id + '" data-k="fwfx' + f.id + '" aria-pressed="' + on + '">' + f.t + "</button>";
      }).join("") + '</div><p class="tiny muted">' + FX.effect + "</p>";
      h += '<div class="fw-fx" aria-live="polite"><p class="fw-fxt"><strong>Model week: ' + kg(tb) + " kg → " + kg(ta) + " kg</strong></p>" + LG.bins.map(function(b){
        var x = A[b.id]; return '<div class="fw-fxr"><span class="fw-fxl">' + b.t + '</span><span class="fw-fxb" aria-hidden="true"><i class="was" style="width:' + f1(x.before / 1 * 100) + '%"></i><i class="now" style="width:' + f1(x.after / 1 * 100) + '%"></i></span><span class="fw-fxv">' + kg(x.before) + (Math.abs(x.after - x.before) > 1e-9 ? " → " + kg(x.after) : "") + " kg</span></div>";
      }).join("") + '<p class="tiny muted">Light bar: before; dark bar: after the fixes.</p></div>';
      if (fmsg) h += MV.fbHTML("", fmsg);
      else if (S.fix.length === 2) {
        var tg = S.fix.map(function(id){ return byId(FX.list, id).target; });
        h += tg[0] === tg[1] ? MV.fbHTML("bad", FX.same) : (tg.indexOf("forgot") >= 0 && tg.indexOf("date") >= 0) ? MV.fbHTML("good", "<strong>✓ " + FX.good + "</strong>") : MV.fbHTML("bad", FX.off);
      }
      box.innerHTML = h;
    });
  }
  $("#fw-s3").addEventListener("click", function(e){
    var b = e.target.closest("[data-fx]"); if (!b) return;
    var id = b.dataset.fx, k = S.fix.indexOf(id); fmsg = null;
    if (k >= 0) S.fix.splice(k, 1); else if (S.fix.length >= 2) fmsg = "Choose only two. Tap a chosen fix to remove it first."; else S.fix.push(id);
    api.save(); paint3();
  });
  paint1(); paint2(); paint3(); show();
}

// ---------- Practice 2: Waste math and judgement (@component decisionSet, adapted from HFA4U 15 — custom ★ set: N4 number entry
// (with a ratio form "a : b"), single-choice items with per-option feedback; first try = right on the first check without the
// worked solution) ----------
function numIn(raw){ var r = MV.parseNum(String(raw == null ? "" : raw).replace(/%|kg|times|×/gi, "").trim()); return r && r.length === 1 && isFinite(r[0]) ? r[0] : null; }
function ratioIn(raw){
  var s = String(raw == null ? "" : raw).replace(/times|×/gi, "").trim(); if (!s) return null;
  var m = s.split(/\s*(?::|∶|\bto\b)\s*/i);
  if (m.length === 2) { var a = numIn(m[0]), b = numIn(m[1]); return a != null && b ? a / b : null; }
  return numIn(s);
}
function mathSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ return S.items[it.id] || (S.items[it.id] = { val:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  function qHTML(it, i){
    var x = ist(it), dis = x.solved ? " disabled" : "", num = it.kind === "num" || it.kind === "ratio";
    var h = '<div class="q" data-ti="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">S' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>" : "") + "</div>";
    if (num) h += '<div class="fw-numrow"><label for="fwm-' + it.id + '">' + it.label + ':</label><input class="numin short" id="fwm-' + it.id + '" data-tn="' + it.id + '" data-k="' + it.id + 'in" type="text" inputmode="' + (it.kind === "ratio" ? "text" : "decimal") + '" autocomplete="off"' + (it.placeholder ? ' placeholder="' + esc(it.placeholder) + '"' : "") + ' value="' + esc(x.val || "") + '"' + dis + ">" + (it.unit ? "<span>" + it.unit + "</span>" : "") + "</div>";
    else {
      var ord = MV.shuffle(it.options.map(function(_, k){ return k; }), "fw-" + it.id);
      h += '<div class="opts" role="radiogroup" aria-label="Answer choices">' + ord.map(function(k){ var on = x.pick === k; return '<button type="button" class="opt" role="radio" aria-checked="' + on + '" data-oi="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + it.options[k].t + "</button>"; }).join("") + "</div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + (num ? it.why : (it.options[x.pick].why || it.why)) + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].skip ? "" : "bad", msgs[it.id].h);
    return h + "</div>";
  }
  host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(qHTML).join("");
  function repaint(it){
    var box = host.querySelector('[data-ti="' + it.id + '"]'), act = document.activeElement, k = act && box.contains(act) && act.dataset ? act.dataset.k : null;
    var div = document.createElement("div"); div.innerHTML = qHTML(it, a.items.indexOf(it)); var nb = div.firstChild; box.parentNode.replaceChild(nb, box);
    if (k) { var f = nb.querySelector('[data-k="' + k + '"]'); if (f && !f.disabled) f.focus({ preventScroll:true }); }
    return nb;
  }
  function judge(it, x){
    var NQ = "<strong>✗ Not quite.</strong> ";
    if (it.kind === "num" || it.kind === "ratio") {
      var v = it.kind === "ratio" ? ratioIn(x.val) : numIn(x.val);
      if (v == null) return { skip:true, msg:it.kind === "ratio" ? "Enter a ratio such as 3 : 2, or a number." : "Enter a number in the box, such as 12." };
      if (Math.abs(v - MV.ans(it)) < 1e-6) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return Math.abs(v - q.match) < 1e-6; })[0];
      return { msg:NQ + (w ? w.fb : it.wrongDefault) + " Try again." };
    }
    if (x.pick == null) return { skip:true, msg:"Choose an answer." };
    var o = it.options[x.pick];
    if (MV.ok(o)) return { ok:true };
    return { msg:NQ + o.why + " Try again." };
  }
  host.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.tn) return; ist(byId(a.items, d.tn)).val = e.target.value; msgs[d.tn] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.tn) { e.preventDefault(); var b = host.querySelector('[data-k="' + e.target.dataset.tn + 'chk"]'); if (b) b.click(); return; }
    var c = e.target.closest && e.target.closest("[data-oi]"), d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!c || !d) return;
    e.preventDefault(); var sib = $$("[data-oi]", c.parentNode), k = sib.indexOf(c), nb = sib[(k + d + sib.length) % sib.length]; if (nb && !nb.disabled) { nb.focus(); nb.click(); }
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ti]"); if (!box) return;
    var it = byId(a.items, box.dataset.ti), x = ist(it);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (b.dataset.oi != null) { x.pick = +b.dataset.oi; msgs[it.id] = null; }
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

// ---------- Performance task: Cafeteria waste plan (@component actionChips — eight action chips, pick exactly three; live cut and
// cost gauges with goal marks; the chosen plan as a list) ----------
var task = (function(){
  var api = null;
  function T(){ return MV.C.task; }
  function chip(id){ return byId(T().chips, id); }
  function read(){ var s = (api && api.S) || {}; return { pick:(Array.isArray(s.pick) ? s.pick : []).filter(function(id){ return chip(id); }).slice().sort() }; }
  function sums(d){ return d.pick.reduce(function(o, id){ var c = chip(id); o.cut += c.cut; o.cost += c.cost; return o; }, { cut:0, cost:0 }); }
  function checks(d){
    var s = sums(d), has = function(L){ return d.pick.some(function(id){ return L.indexOf(id) >= 0; }); };
    return [s.cut >= 22, s.cost <= 20, has(["a", "b", "c"]), has(["d", "e", "f", "g"]), !has(["g"]), d.pick.length === 3];
  }
  function setText(k){ return "{" + k.split("").join(", ") + "}"; }
  function paint(){
    var pv = $("#fw-tpv"), inp = $("#fw-tin"); if (!pv || !inp) return;
    var d = read(), s = sums(d);
    MV.keepFocus(inp, function(){
      inp.innerHTML = '<div class="fw-tchips" role="group" aria-label="Actions (choose exactly three)">' + T().chips.map(function(c){
        var on = d.pick.indexOf(c.id) >= 0;
        return '<button type="button" class="fw-tchip" data-tc="' + c.id + '" data-k="fwtc' + c.id + '" aria-pressed="' + on + '"><span class="fw-tcl">' + c.id + '</span><span class="fw-tct"><strong>' + c.t + "</strong><small>Cuts " + c.cut + " kg · $" + c.cost + " · " + c.type + "</small></span></button>";
      }).join("") + '</div><p class="tiny muted">Chosen: ' + d.pick.length + " of 3.</p>";
    });
    function g(lab, val, unit, goal, dir, scale){
      var ok = dir === "min" ? val >= goal : val <= goal;
      return '<div class="fw-g"><span class="fw-gl">' + lab + ' <span class="fw-gg">(goal ' + (dir === "min" ? "≥ " : "≤ ") + (unit === "$" ? "$" + goal : goal + " " + unit) + ')</span></span><b class="fw-gv">' + (unit === "$" ? "$" + val : val + " " + unit) + ' <span class="fw-gok">' + (ok ? "✓" : "○") + '<span class="vh">' + (ok ? " goal met" : " goal not met") + "</span></span></b>" +
        '<span class="fw-gt" aria-hidden="true"><i style="width:' + f1(clamp(val / scale * 100, 0, 100)) + '%"></i><span class="fw-gm" style="left:' + f1(goal / scale * 100) + '%"></span></span></div>';
    }
    pv.innerHTML = '<h4 class="fw-h4">Your plan <span class="hfa-model">Model data</span></h4><div class="fw-tg" aria-live="polite">' + g("Landfill cut", s.cut, "kg a week", 22, "min", 40) + g("Cost", s.cost, "$", 20, "max", 40) + "</div>" +
      (d.pick.length ? '<ul class="fw-tlist">' + d.pick.map(function(id){ var c = chip(id); return "<li><strong>" + id + ".</strong> " + c.t + ' <span class="tiny muted">(' + c.type + ")</span></li>"; }).join("") + "</ul>" : '<p class="tiny muted">No actions chosen yet.</p>');
  }
  return {
    render:function(inp, pv, a){
      api = a; if (!Array.isArray(api.S.pick)) api.S.pick = [];
      inp.innerHTML = '<div id="fw-tin"></div>'; pv.innerHTML = '<div class="fw-tpv" id="fw-tpv"></div>';
      $("#fw-tin").addEventListener("click", function(e){
        var b = e.target.closest("[data-tc]"); if (!b) return;
        var P = api.S.pick, k = P.indexOf(b.dataset.tc); if (k >= 0) P.splice(k, 1); else P.push(b.dataset.tc);
        api.save(); paint(); api.update();
      });
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    tips:function(d, r){
      var tp = T().tips, out = [];
      if (!r[5]) out.push(tp[4]);
      if (!r[4]) out.push(tp[2]);
      if (!r[0]) out.push(d.pick.indexOf("h") >= 0 ? tp[3] : tp[1]);
      if (!r[1] || !r[2]) out.push(tp[0]);
      if (!r[3] && r[2]) out.push(tp[1]);
      return out.filter(function(x, i){ return out.indexOf(x) === i; });
    },
    key:function(d){ return d.pick.join(""); },
    label:function(k){ return "<strong>" + setText(k) + "</strong>"; },
    text:function(k){ return setText(k); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ math:mathSet },
  task:task
});
})();
