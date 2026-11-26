// HFA4U 19 Food Security in Canada: hero (budget bar: income fills, rent and essentials cover it, $900 left beside a $1,000
// basket, the $100 gap glows), Household food security explorer (Explore, F10: Household view with budget waterfalls and an
// optional side-by-side compare, Policy view with a five-household status table; supports and shocks as switches; readout;
// the five components), Policy or charity? (Part 3: research cards with "Check it with data" model tables, a response sorter,
// a who-decides desk matcher), Reading the data (practice ★ set: model data table + tap answers) and "Write to the right desk"
// (task: chips + a letter with a live 7-line checklist). Plan wording lives in content.mjs; this file adds only control
// labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function listAnd(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
function money(v){ v = Math.round(v); return (v < 0 ? "−" : "") + "$" + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function signed(v){ v = Math.round(v); return (v > 0 ? "+" : v < 0 ? "−" : "") + "$" + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function pct(v){ return (Math.round(v * 10) / 10).toFixed(1) + "%"; }
function words(s){ return String(s || "").trim().split(/\s+/).filter(function(w){ return /[A-Za-z0-9À-ɏ$]/.test(w); }).length; }
function lin(t){ return t; }

// ---------- @component radioGroup (copied from HFA4U 12 / 09; per-option class, custom layout class, function labels) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host. The options array may be changed in place, then repaint().
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "fsc-chipset" : o.cls && o.cls !== "seg" ? "fsc-" + o.cls : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="fsc-rgw">' + (lab ? '<span class="fsc-rgl">' + lab + "</span>" : "") + '<span class="fsc-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
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

// ---------- @component switchBtn (copied from HFA4U 12 / 09) — an on/off switch (role="switch" button with a visible On/Off word) ----------
function switchHTML(key, label, on, data){
  return '<button type="button" role="switch" class="fsc-sw" aria-checked="' + !!on + '" data-k="' + key + '" ' + data + '><span class="fsc-swt" aria-hidden="true"><i></i></span><span class="fsc-swl">' + label + '</span><span class="fsc-swv" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- F10 household model (plan's exact calculation rules; values in content.explore) ----------
var SUP = ["P1", "P2", "P3", "P4", "P5"], SHK = ["S1", "S2", "S3"], TOG = SUP.concat(SHK);
var LEVEL = { secure:0, marginal:1, moderate:2, severe:3 };
function EXC(){ return MV.C.explore; }
function hhOf(id){ return byId(EXC().households, id); }
function togOf(id){ return byId(EXC().supports, id) || byId(EXC().shocks, id); }
function normOn(o){ var r = {}; TOG.forEach(function(k){ r[k] = !!(o && o[k]); }); return r; }
function r2(v){ return Math.round(v * 100) / 100; }
function calc(h, on){
  var P = {}; EXC().supports.concat(EXC().shocks).forEach(function(t){ P[t.id] = t; });
  var inc = h.inc + (on.P1 ? P.P1.amt : 0);
  var hou = h.hou - (on.P2 && h.renter ? P.P2.amt : 0) + (on.S2 && h.renter ? P.S2.amt : 0);
  var basket = h.basket * (on.S1 ? P.S1.factor : 1) + (on.S3 && h.north ? P.S3.amt : 0) - (on.P3 ? P.P3.amt * (h.kids || 0) : 0) - (on.P4 ? P.P4.amt : 0) - (on.P5 && h.north ? P.P5.amt : 0);
  return withGap({ inc:inc, hou:hou, ess:h.ess, left:r2(inc - hou - h.ess), basket:r2(basket) });
}
function withGap(v){ var g = r2(v.basket - v.left); return { inc:v.inc, hou:v.hou, ess:v.ess, left:v.left, basket:v.basket, gap:g, pct:v.basket > 0 ? g / v.basket * 100 : 0 }; }
function statusOf(r){ if (r.gap <= 0) return "secure"; return r.pct <= 15 + 1e-9 ? "marginal" : r.pct <= 40 + 1e-9 ? "moderate" : "severe"; }
// component rules (plan, exact); r may be the animated (displayed) values
function strained(h, on, r){
  r = r || calc(h, on); var out = [];
  if (h.north && on.S3) out.push("avail");
  if (r.gap > 0) out.push("access");
  if (r.gap > 0 && r.pct > 15 + 1e-9) out.push("adequacy");
  if (on.P4 && r.gap <= 0) { var o2 = normOn(on); o2.P4 = false; if (calc(h, o2).gap > 0) out.push("accept"); }
  // reading (plan readout example: H1 with nothing on shows only Accessibility; "one more price rise tips this household"):
  // sustainability is strained for a household that is food secure but has less than a 10% buffer
  if (r.gap <= 0 && r.left < 1.1 * r.basket - 1e-9) out.push("sustain");
  return out;
}
function stWord(st){ return EXC().status[st]; }
function stChip(st, hide){ return '<span class="fsc-st ' + st + '"' + (hide ? ' aria-hidden="true"' : "") + ">" + stWord(st) + "</span>"; }
function gapShort(r){ var g = Math.round(r.gap); return g > 0 ? money(g) + " short" : g === 0 ? "$0 (just covered)" : money(-g) + " spare"; }
function gapLong(r){ var g = Math.round(r.gap); return g > 0 ? "<strong>" + money(g) + " a month</strong> (" + pct(r.pct) + " of the basket)" : g === 0 ? "<strong>$0</strong> (the basket is just covered)" : "<strong>" + money(-g) + " spare</strong>"; }
function stSpoken(r){ var st = statusOf(r), g = Math.round(r.gap); return "Status: " + stWord(st).toLowerCase() + ", " + (g > 0 ? money(g) + " short, " + f1(r.pct) + " percent" : g === 0 ? "just covered" : money(-g) + " spare") + "."; }

// ---------- @component componentIcons — the five components of food security (20 × 20 stroke glyphs in currentColor) ----------
var CICON = {
  avail:'<path d="M3 4.5h14M3 10.5h14M3 16.5h14M4 4.5v12M16 4.5v12"/><path d="M6.5 10.5v-3h3v3M11 16.5v-3h3v3"/>',
  access:'<circle cx="10" cy="10" r="7.5"/><path d="M12.6 7.4c-.6-.9-1.5-1.2-2.6-1.2-1.4 0-2.6.8-2.6 1.9 0 2.7 5.2 1.4 5.2 4 0 1.1-1.2 1.9-2.6 1.9-1.1 0-2.1-.4-2.7-1.3M10 4.6v1.6M10 13.8v1.6"/>',
  adequacy:'<circle cx="10" cy="10" r="7.5"/><path d="M6.5 13.5c0-4 2.6-6.6 7-6.6 0 4.4-2.6 7-6.6 7M6.5 13.5l3.6-3.6"/>',
  accept:'<path d="M10 16.5s-6.2-3.7-6.2-8.2A3.3 3.3 0 0 1 10 6.4a3.3 3.3 0 0 1 6.2 1.9c0 4.5-6.2 8.2-6.2 8.2z"/>',
  sustain:'<path d="M16 9.5A6 6 0 1 1 13.8 5"/><path d="M14.5 2.3l-.5 3 3 .4"/>'
};
function cIcon(id){ return '<svg class="fsc-ci" viewBox="0 0 20 20" aria-hidden="true">' + CICON[id] + "</svg>"; }
function compWords(list){ return list.length ? EXC().comps.filter(function(c){ return list.indexOf(c.id) >= 0; }).map(function(c){ return c.t; }).join(", ") : "none"; }

// ---------- hero (storyboard: the income bar fills; rent and utilities slide in and cover part of it, other essentials cover
// more; $900 left for food beside the $1,000 basket bar; the $100 gap glows with "10% short every month").
// Reduced motion: final frame only. ----------
function hero(f){
  var host = $("#fsc-hero"); if (!host) return;
  var Hc = MV.C.hero, h = EXC().households[0], left = h.inc - h.hou - h.ess, gap = h.basket - left;
  var st = { inc:0, rent:0, ess:0, left:0, bas:0, gap:0, glow:0 };
  host.innerHTML = '<svg class="fsc-hsvg" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function T(x, y, s, cls, anchor, op){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "start") + '"' + (op != null && op < 1 ? ' opacity="' + f1(op) + '"' : "") + ">" + s + "</text>"; }
  function draw(){
    var nw = (host.getBoundingClientRect().width || 600) < 460, W = nw ? 340 : 600, x0 = 20, bw = W - 40, s = bw / h.inc, y = 38, bh = 44, by = nw ? 116 : 104, H = by + 96;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var o = '<defs><pattern id="fsc-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="fsc-hhb" width="8" height="8"/><line class="fsc-hhl" x1="0" y1="0" x2="0" y2="8"/></pattern></defs>';
    // income bar and its label
    o += '<rect class="fsc-hinc" x="' + x0 + '" y="' + y + '" width="' + f1(bw * st.inc) + '" height="' + bh + '" rx="4"/>';
    if (st.inc > 0) o += T(x0 + bw, y - 10, money(h.inc) + " income", "fsc-hl", "end", st.inc);
    // essentials (drawn first, so it slides in under the rent block), then rent and utilities
    var ex = x0 + left * s, ew = h.ess * s, rx = x0 + (h.inc - h.hou) * s, rw = h.hou * s;
    if (st.ess > 0) {
      var ex1 = lerp(W + 4, ex, st.ess);
      o += '<rect class="fsc-hcost" x="' + f1(ex1) + '" y="' + y + '" width="' + f1(ew) + '" height="' + bh + '"/>';
      if (nw) o += T(ex + ew / 2, y + bh + 18, "Other essentials " + money(h.ess), "fsc-hs", "middle", st.ess);
      else o += T(ex1 + ew / 2, y + 19, "Other essentials", "fsc-hs fsc-hon", "middle") + T(ex1 + ew / 2, y + 35, money(h.ess), "fsc-hs fsc-hon", "middle");
    }
    if (st.rent > 0) {
      var rx1 = lerp(W + 4, rx, st.rent);
      o += '<rect class="fsc-hcost" x="' + f1(rx1) + '" y="' + y + '" width="' + f1(rw) + '" height="' + bh + '"/>';
      o += T(rx1 + rw / 2, y + 19, "Rent and utilities", "fsc-hs fsc-hon", "middle") + T(rx1 + rw / 2, y + 35, money(h.hou), "fsc-hs fsc-hon", "middle");
    }
    if (st.left > 0) o += T(x0, y - 10, money(left) + " left for food", "fsc-hl", "start", st.left);
    // basket bar, the line at "left for food", the gap
    if (st.bas > 0) {
      o += '<rect class="fsc-hbas" x="' + x0 + '" y="' + by + '" width="' + f1(h.basket * s * st.bas) + '" height="40" rx="4"/>';
      o += T(x0 + h.basket * s + 10, by + 25, "Nutritious food basket " + money(h.basket), "fsc-hs", "start", st.bas);
      o += '<line class="fsc-hmark" x1="' + f1(ex) + '" y1="' + (y + bh + (nw ? 26 : 0)) + '" x2="' + f1(ex) + '" y2="' + (by + 46) + '" opacity="' + f1(st.bas) + '"/>';
    }
    if (st.gap > 0) {
      var gx = ex, gw = gap * s;
      o += '<rect class="fsc-hglow" x="' + f1(gx - 3) + '" y="' + (by - 3) + '" width="' + f1(gw + 6) + '" height="46" rx="5" opacity="' + f1(0.25 + 0.75 * st.glow) + '"/>';
      o += '<rect class="fsc-hgap" x="' + f1(gx) + '" y="' + by + '" width="' + f1(gw) + '" height="40" opacity="' + f1(st.gap) + '"/>';
      o += T(gx + gw / 2, by + 62, money(gap) + " gap", "fsc-hs", "middle", st.gap);
      o += T(x0, by + 88, "10% short every month", "fsc-hcap", "start", st.gap);
    }
    svg.innerHTML = o;
  }
  window.addEventListener("resize", draw);
  function cap(){ if (f.cap) f.cap.textContent = Hc.caption; }
  if (MV.reduceMotion) { st = { inc:1, rent:1, ess:1, left:1, bas:1, gap:1, glow:0 }; draw(); cap(); return; }
  draw();
  function tw(key, dur, next){ MV.tween({ dur:dur, step:function(t){ st[key] = t; draw(); }, done:next }); }
  MV.wait(300, function(){
    tw("inc", 900, function(){ tw("rent", 800, function(){ tw("ess", 700, function(){
      MV.tween({ dur:900, step:function(t){ st.left = t; st.bas = t; draw(); }, done:function(){
        tw("gap", 500, function(){
          MV.tween({ dur:1600, ease:lin, step:function(t){ st.glow = Math.sin(Math.PI * 2 * t) * Math.sin(Math.PI * 2 * t); draw(); }, done:function(){ st.glow = 0; draw(); cap(); } });
        });
      } });
    }); }); });
  });
}

// ---------- Explore: Household food security explorer (@component F10 householdExplorer — budget waterfalls with an optional
// compare panel, a five-household policy table, support and shock switches, readout, component chips) ----------
var FIELDS = ["inc", "hou", "ess", "left", "basket"];
function pick(r){ return { inc:r.inc, hou:r.hou, ess:r.ess, left:r.left, basket:r.basket }; }
function explore(host, api){
  var D = api.content, S = api.S, HH = D.households, R = D.rows;
  S.mode = S.mode === "policy" ? "policy" : "house";
  S.hh = hhOf(S.hh) ? S.hh : "H1";
  S.cmp = hhOf(S.cmp) && S.cmp !== S.hh ? S.cmp : "";
  S.on = normOn(S.on);
  S.last = S.last && (togOf(S.last.id) || S.last.id === "reset") ? S.last : null;
  var disp = {}, anim = null, pend = null, timers = [], fx = freshFx();
  function freshFx(){ return { lit:[], litRows:[], delta:null, build:null }; }
  function snap(){ HH.forEach(function(h){ disp[h.id] = pick(calc(h, S.on)); }); }
  snap();

  var A = D.about, sup = (MV.C.start.blocks || [])[0];
  host.innerHTML = '<div class="fsc-top"><div id="fsc-mode"></div><span class="hfa-model">' + D.modelTag + '</span></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="fsc-lab" id="fsc-lab" data-mv="graph">' +
      '<div class="fsc-pick" id="fsc-pick"><div id="fsc-hh"></div><div id="fsc-cmp"></div></div>' +
      '<div class="fsc-vis" id="fsc-vis"></div>' +
      '<div class="fsc-ctl"><div class="fsc-tg"><h4 class="fsc-h4">Supports</h4><div class="fsc-sws" id="fsc-sup" role="group" aria-label="Supports"></div></div>' +
        '<div class="fsc-tg"><h4 class="fsc-h4">Shocks</h4><div class="fsc-sws" id="fsc-shk" role="group" aria-label="Shocks"></div>' +
        '<div class="q-actions fsc-offw"><button type="button" class="btn ghost sm" id="fsc-off" data-k="fscoff">Switch everything off</button></div></div></div>' +
      '<div class="fsc-side"><h4 class="fsc-h4">Readout</h4><dl class="read fsc-read" id="fsc-read" aria-live="polite"></dl></div>' +
    "</div>" +
    '<details class="alg fsc-about" id="fsc-about"><summary>' + A.title + '</summary><div class="fsc-aboutw"><div><ul class="fsc-rules">' + A.rules.map(function(x){ return "<li>" + x + "</li>"; }).join("") + "</ul>" +
      '<p class="fsc-abt"><strong>' + A.compTitle + '</strong></p><ul class="fsc-rules">' + A.compRules.map(function(x){ return "<li>" + x + "</li>"; }).join("") + '</ul><p class="tiny muted">' + A.note + "</p></div>" +
      '<div><p class="fsc-abt"><strong>' + A.tableTitle + '</strong> <span class="hfa-model">Model data</span></p><div id="fsc-mtab"></div></div></div></details>' +
    (sup ? '<div class="fsc-sup">' + sup.html + "</div>" : "");

  // model data table (built from the data; matches the plan's table)
  (function(){
    var on0 = normOn({});
    $("#fsc-mtab").innerHTML = MV.tableHTML({ caption:"The five households, model data", head:["Household", "Income after tax, incl. benefits", "Housing", "Other essentials", "Left for food", "Nutritious food basket", "Gap", "Status"],
      rows:HH.map(function(h){ var r = calc(h, on0); return ["<strong>" + h.id + "</strong> " + h.t, money(h.inc), money(h.hou), money(h.ess), money(r.left), money(h.basket), r.gap > 0 ? money(r.gap) + " (" + pct(r.pct) + ")" : money(r.gap), stWord(statusOf(r))]; }) });
  })();

  // ===== controls =====
  var modeRG = radios($("#fsc-mode"), { label:"View", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; MV.banner("", ""); fx = freshFx(); api.save(); paintAll(); MV.changed(); } });
  var hhRG = radios($("#fsc-hh"), { label:"Household", cls:"chips", options:HH.map(function(h){ return { id:h.id, t:"<strong>" + h.id + "</strong> " + h.chip }; }), value:S.hh,
    onChange:function(v){ cancelAnim(); S.hh = v; if (S.cmp === v) S.cmp = ""; S.last = null; fx = freshFx(); cmpBuild(); api.save(); paintAll(); MV.changed(); } });
  var cmpOpts = [];
  function cmpBuild(){ cmpOpts.length = 0; cmpOpts.push({ id:"", t:"None" }); HH.forEach(function(h){ if (h.id !== S.hh) cmpOpts.push({ id:h.id, t:"<strong>" + h.id + "</strong> " + h.chip }); }); if (cmpRG) { cmpRG.set(S.cmp); cmpRG.repaint(); } }
  var cmpRG = null; cmpBuild();
  cmpRG = radios($("#fsc-cmp"), { label:"Compare with", cls:"chips", options:cmpOpts, value:S.cmp, onChange:function(v){ cancelAnim(); S.cmp = v; fx = freshFx(); api.save(); paintAll(); } });
  function swLabel(t){ return "<strong>" + t.id + " " + t.t + '</strong><small>' + t.eff + "</small>"; }
  $("#fsc-sup").innerHTML = D.supports.map(function(t){ return switchHTML("sw" + t.id, swLabel(t), S.on[t.id], 'data-tog="' + t.id + '"'); }).join("");
  $("#fsc-shk").innerHTML = D.shocks.map(function(t){ return switchHTML("sw" + t.id, swLabel(t), S.on[t.id], 'data-tog="' + t.id + '"'); }).join("");
  $(".fsc-ctl", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-tog]");
    if (b) { cancelAnim(); var id = b.dataset.tog; S.on[id] = !S.on[id]; S.last = { id:id, on:S.on[id] }; commit(); return; }
    if (e.target.closest("#fsc-off")) { cancelAnim(); if (!TOG.some(function(k){ return S.on[k]; })) return; S.on = normOn({}); S.last = { id:"reset" }; commit(); }
  });

  // ===== painting =====
  function lit(k){ return fx.lit.indexOf(k) >= 0; }
  function shown(){ return S.mode === "house" ? [S.hh].concat(S.cmp ? [S.cmp] : []) : HH.map(function(h){ return h.id; }); }
  function scaleMax(ids){ var m = 0; ids.forEach(function(id){ var h = hhOf(id); m = Math.max(m, h.inc + D.supports[0].amt); }); return m; }
  function panelHTML(h, max, two){
    var v = disp[h.id], r = withGap(v), st = statusOf(r), comps = strained(h, S.on, r);
    var rows = [
      { k:"inc", t:"Income after tax, incl. benefits", a:0, b:v.inc, cls:"money", val:money(v.inc) },
      { k:"hou", t:"Housing", a:v.inc - v.hou, b:v.inc, cls:"cost", val:"−" + money(v.hou) },
      { k:"ess", t:"Other essentials", a:v.left, b:v.inc - v.hou, cls:"cost", val:"−" + money(v.ess) },
      { k:"left", t:"Left for food", a:0, b:v.left, cls:"money", val:money(v.left) },
      { k:"bas", t:"Nutritious food basket", a:0, b:v.basket, cls:"basket", val:money(v.basket) }
    ];
    function P(x){ return f1(clamp(x / max * 100, 0, 100)); }
    var bld = fx.build, out = '<div class="fsc-panel' + (two ? " two" : "") + '" role="group" aria-label="' + esc("Budget for " + h.name) + '"><div class="fsc-ph"><h4 class="fsc-h4">' + h.id + " " + h.name + "</h4>" + (bld == null || bld >= 0.95 ? stChip(st) : "") + '</div><div class="fsc-wf">';
    rows.forEach(function(w, i){
      var rv = bld == null ? 1 : clamp((bld - i * 0.17) / 0.2, 0, 1), a = Math.max(0, w.a), b = Math.max(a, w.b), wid = (b - a) * rv;
      var extra = "";
      if (w.k === "bas" && (bld == null || bld >= 0.9)) {
        var lp = Math.max(0, v.left), g = r.gap, gOp = bld == null ? 1 : clamp((bld - 0.9) / 0.1, 0, 1);
        extra += '<i class="fsc-wm" style="left:' + P(lp) + '%"></i>';
        if (g > 0.5) extra += '<i class="fsc-wg' + (lit("gap") ? " glow" : "") + '" style="left:' + P(lp) + "%;width:" + P(g) + "%;opacity:" + f1(gOp) + '"></i>';
        else if (g < -0.5) extra += '<i class="fsc-wsp" style="left:' + P(v.basket) + "%;width:" + P(-g) + "%;opacity:" + f1(gOp) + '"></i>';
      }
      out += '<div class="fsc-wr ' + w.cls + (lit(w.k) ? " fsc-lit" : "") + '"' + (rv <= 0 ? ' style="visibility:hidden"' : "") + '><div class="fsc-wl"><span>' + w.t + "</span><b>" + w.val + '</b></div><div class="fsc-wt" aria-hidden="true"><i class="fsc-wb ' + w.cls + '" style="left:' + P(a) + "%;width:" + P(wid) + '%"></i>' + extra + "</div></div>";
    });
    out += "</div>";
    var showEnd = bld == null || bld >= 0.95;
    out += '<p class="fsc-gl' + (lit("gap") ? " fsc-lit" : "") + '"' + (showEnd ? "" : ' style="visibility:hidden"') + ">" + R.gap + ": " + gapLong(r) + "</p>";
    out += '<ul class="fsc-comps" aria-label="' + esc(R.comps + " for " + h.short) + '"' + (showEnd ? "" : ' style="visibility:hidden"') + ">" + D.comps.map(function(c){
      var on = comps.indexOf(c.id) >= 0;
      return '<li class="fsc-comp' + (on ? " on" : "") + '">' + cIcon(c.id) + "<span>" + c.t + "</span>" + (on ? '<b class="fsc-cs">strained</b>' : '<span class="vh">: not strained</span>') + "</li>";
    }).join("") + "</ul>";
    var msgs = D.comps.filter(function(c){ return comps.indexOf(c.id) >= 0; });
    if (msgs.length && showEnd) out += '<ul class="fsc-cmsg' + (lit("comps") ? " fsc-lit" : "") + '">' + msgs.map(function(c){ return "<li><strong>" + c.t + ":</strong> " + c.msg + "</li>"; }).join("") + "</ul>";
    return out + "</div>";
  }
  function policyHTML(){
    var h = '<div class="tbl-wrap fsc-ptw"><table class="fsc-ptab"><caption>All five households, with the switches on as policies <span class="hfa-model">Model data</span></caption><thead><tr><th scope="col">Household</th><th scope="col">' + R.gap + '</th><th scope="col">' + R.status + '</th><th scope="col">' + R.comps + "</th></tr></thead><tbody>";
    HH.forEach(function(hh){
      var r = withGap(disp[hh.id]), st = statusOf(r), comps = strained(hh, S.on, r), d = fx.delta && fx.delta[hh.id];
      var meter = '<span class="fsc-meter" aria-hidden="true"><i style="width:' + f1(r.gap > 0 ? clamp(r.pct / 60, 0, 1) * 100 : 0) + '%"></i></span>';
      h += '<tr class="' + (fx.litRows.indexOf(hh.id) >= 0 ? "fsc-lit" : "") + '"><th scope="row" data-label="Household"><strong>' + hh.id + "</strong> " + hh.chip + "</th>" +
        '<td data-label="' + R.gap + '">' + gapShort(r) + (r.gap > 0 ? " (" + pct(r.pct) + ")" : "") + (d ? ' <span class="fsc-delta">' + signed(d) + "</span>" : "") + meter + "</td>" +
        '<td data-label="' + R.status + '">' + stChip(st) + "</td>" +
        '<td data-label="' + R.comps + '">' + (comps.length ? '<span class="fsc-cl">' + D.comps.filter(function(c){ return comps.indexOf(c.id) >= 0; }).map(function(c){ return '<span class="fsc-ctag">' + cIcon(c.id) + c.t + "</span>"; }).join("") + "</span>" : '<span class="muted">none</span>') + "</td></tr>";
    });
    return h + "</tbody></table></div>";
  }
  function paintVis(){
    var vis = $("#fsc-vis");
    if (S.mode === "policy") { vis.innerHTML = policyHTML(); return; }
    var ids = shown(), max = scaleMax(ids);
    vis.innerHTML = '<div class="fsc-panels' + (ids.length > 1 ? " two" : "") + '">' + ids.map(function(id){ return panelHTML(hhOf(id), max, ids.length > 1); }).join("") + "</div>" +
      '<p class="tiny muted fsc-key"><span class="fsc-kk money"></span> money <span class="fsc-kk cost"></span> spent on housing and essentials <span class="fsc-kk basket"></span> food basket <span class="fsc-kk gap"></span> gap</p>';
  }
  function changedText(){
    var L = S.last; if (!L) return "—";
    if (L.id === "reset") return "All supports and shocks switched off.";
    var t = togOf(L.id), before = normOn(S.on); before[L.id] = !S.on[L.id];
    var head = "<strong>" + t.id + " " + t.t + "</strong> switched " + (S.on[L.id] ? "on" : "off") + ": ";
    if (S.mode === "policy") {
      var parts = HH.map(function(h){ var d = calc(h, S.on).gap - calc(h, before).gap; return Math.abs(d) > 0.5 ? signed(d) + " (" + h.short + ")" : null; }).filter(Boolean);
      return head + (parts.length ? "gaps change by " + listAnd(parts) + "." : "no household’s gap changes.");
    }
    var h = hhOf(S.hh), ra = calc(h, S.on), rb = calc(h, before), bits = [];
    if (Math.abs(ra.left - rb.left) > 0.5) bits.push("money left for food " + signed(ra.left - rb.left));
    if (Math.abs(ra.basket - rb.basket) > 0.5) bits.push("basket " + signed(ra.basket - rb.basket));
    if (!bits.length) return head + "no change for " + h.short + (t.who ? " (" + t.who + ")" : "") + ".";
    return head + bits.join(", ") + "; gap " + gapShort(rb) + " → " + gapShort(ra) + ".";
  }
  function row(k, dt, dd){ return '<div class="' + (lit(k) ? "fsc-lit" : "") + '"><dt>' + dt + "</dt><dd>" + dd + "</dd></div>"; }
  function paintRead(){
    var el = $("#fsc-read");
    if (S.mode === "policy") {
      var on = SUP.filter(function(k){ return S.on[k]; }), sec = HH.filter(function(h){ return calc(h, S.on).gap <= 0; }).length;
      el.innerHTML = row("policies", R.policies, "<strong>" + on.length + "</strong>" + (on.length ? " (" + on.join(", ") + ")" : "")) + row("secure", R.secure, "<strong>" + sec + " of 5</strong>") +
        row("shocks", "Shocks on", SHK.filter(function(k){ return S.on[k]; }).join(", ") || "none") + row("changed", R.changed, changedText());
      return;
    }
    var h = hhOf(S.hh), r = calc(h, S.on), st = statusOf(r), comps = strained(h, S.on, r);
    el.innerHTML = row("household", R.household, h.name) + row("left", R.left, money(r.left)) + row("bas", R.basket, money(r.basket)) + row("gap", R.gap, gapLong(r)) +
      row("status", R.status, stChip(st, true) + '<span class="vh">' + stSpoken(r) + "</span>") + row("comps", R.comps, compWords(comps)) + row("changed", R.changed, changedText());
  }
  function paintCtl(){
    $$("[data-tog]", host).forEach(function(b){ var on = !!S.on[b.dataset.tog]; b.setAttribute("aria-checked", on); b.querySelector(".fsc-swv").textContent = on ? "On" : "Off"; });
    $("#fsc-off").disabled = !TOG.some(function(k){ return S.on[k]; });
  }
  function paintAll(){
    modeRG.set(S.mode); hhRG.set(S.hh); if (cmpRG) cmpRG.set(S.cmp);
    $("#fsc-pick").hidden = S.mode !== "house";
    $("#fsc-lab").classList.toggle("policy", S.mode === "policy");
    paintCtl(); paintVis(); paintRead();
  }
  // ===== animation =====
  function animTo(dur, done){
    var from = {}, to = {};
    HH.forEach(function(h){ from[h.id] = pick(disp[h.id]); to[h.id] = pick(calc(h, S.on)); });
    anim = MV.tween({ dur:dur, step:function(t){ HH.forEach(function(h){ FIELDS.forEach(function(k){ disp[h.id][k] = lerp(from[h.id][k], to[h.id][k], t); }); }); paintVis(); },
      done:function(){ anim = null; HH.forEach(function(h){ disp[h.id] = to[h.id]; }); if (done) done(); } });
  }
  function commit(){ fx = freshFx(); api.save(); paintCtl(); paintRead(); MV.changed(); animTo(450, function(){ paintVis(); }); }
  function finish(){ anim = null; timers = []; fx.build = null; snap(); api.save(); paintAll(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){ if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = []; fx.build = null; snap(); if (pend) { var d = pend; pend = null; d(); } }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  paintAll();

  // ===== challenges (plan's exact tests and named wrong states) =====
  var CH = {}; D.challenges.forEach(function(c){ CH[c.id] = c; });
  function onSup(){ return SUP.filter(function(k){ return S.on[k]; }); }
  function challenge(id, opt){
    var M = CH[id].msgs, ps = onSup(), n = ps.length, r = { ok:false };
    if (id === "tc1") {
      var r1 = calc(hhOf("H1"), S.on);
      if (S.mode !== "house" || S.hh !== "H1") r.msg = M.view;
      else if (SHK.some(function(k){ return S.on[k]; })) r.msg = M.shocks;
      else if (!n) r.msg = M.none;
      else if (n > 1) r.msg = M.many;
      else if (r1.gap <= 0) r = { ok:true };
      else r.msg = ps[0] === "P4" ? M.hamper : M.north;
    } else if (id === "tc2") {
      var r2b = calc(hhOf("H2"), S.on), g = { gap:String(Math.round(r2b.gap)) };
      if (S.mode !== "house" || S.hh !== "H2") r.msg = M.view;
      else if (!S.on.S1) r.msg = M.s1;
      else if (r2b.gap <= 0 && n === 2) r = { ok:true };
      else if (r2b.gap <= 0) r.msg = M.three;
      else if (n === 1) r.msg = M.one;
      else if (n === 2 && S.on.P1 && S.on.P3) r.msg = fill(M.p1p3, g);
      else r.msg = fill(M.short, g);
    } else if (id === "tc3") {
      var short = D.households.filter(function(h){ return calc(h, S.on).gap > 0; }), key = ps.join(",");
      if (S.mode !== "policy") r.msg = M.view;
      else if (!S.on.S1 || !S.on.S2 || S.on.S3) r.msg = M.shocks;
      else if (!short.length && n === 4) r = { ok:true };
      else if (!short.length) r.msg = M.all;
      else if (key === "P1,P2,P5") r.msg = M.p125;
      else if (key === "P1,P2,P3,P4") r.msg = M.p1234;
      else r.msg = fill(M.short, { list:listAnd(short.map(function(h){ var q = calc(h, S.on); return h.short + " (" + money(q.gap) + ", " + stWord(statusOf(q)).toLowerCase() + ")"; })) });
      if (r.ok && opt && !opt.live) MV.banner("good", MV.plain(CH.tc3.banner));
    }
    return r;
  }

  // ===== predictions =====
  function gaps(){ var o = {}; HH.forEach(function(h){ o[h.id] = calc(h, S.on).gap; }); return o; }
  function stats(){ var o = {}; HH.forEach(function(h){ o[h.id] = statusOf(calc(h, S.on)); }); return o; }
  function flip(id, done){ S.on[id] = true; S.last = { id:id, on:true }; paintCtl(); animTo(1300, done); }
  return {
    predict:{
      start:function(p){
        cancelAnim(); fx = freshFx(); S.on = normOn({}); S.last = null;
        if (p.id === "p1") { S.mode = "house"; S.hh = "H1"; S.cmp = "H3"; }
        else if (p.id === "p2") { S.mode = "house"; S.hh = "H4"; S.cmp = ""; }
        else S.mode = "policy";
        cmpBuild(); snap(); api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") {
          fx.build = 0; paintVis();
          anim = MV.tween({ dur:3000, ease:lin, step:function(t){ fx.build = t; paintVis(); }, done:function(){ anim = null; fx.build = null; fx.lit = ["left", "bas", "gap"]; finish(); } });
        } else if (p.id === "p2") {
          later(400, function(){ flip("P4", function(){ fx.lit = ["bas", "gap", "status", "changed"]; finish(); }); });
        } else {
          var g0 = gaps(), s0 = stats();
          later(400, function(){ flip(p.id === "p3" ? "S1" : "P3", function(){
            var g1 = gaps(), s1 = stats(); fx.delta = {};
            HH.forEach(function(h){ fx.delta[h.id] = g1[h.id] - g0[h.id]; });
            fx.litRows = p.id === "p3" ? ["H5"] : HH.filter(function(h){ return s1[h.id] !== s0[h.id]; }).map(function(h){ return h.id; });
            fx.lit = ["changed", "secure"];
            finish();
          }); });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Policy or charity? (@component policyStations — research cards with "Check it with data" model tables,
// the toolkit sorter reused for responses, and a who-decides desk matcher whose table keys the task) ----------
function part3(host, api){
  var D = api.content, S = api.S, RS = D.research, SO = D.sort, DK = D.desk;
  S.st = byId(D.stations, S.st) ? S.st : "research";
  S.seen = S.seen || {}; S.desk = S.desk || {};
  host.innerHTML = '<div id="fsc-stn"></div><p class="tiny" id="fsc-stp" aria-live="polite"></p><div class="fsc-station" id="fsc-st-research"></div><div class="fsc-station" id="fsc-st-sort" hidden></div><div class="fsc-station" id="fsc-st-desk" hidden></div>';
  function deskOk(p){ var a = MV.ans(p) || []; return a.indexOf(S.desk[p.id]) >= 0; }
  function done(id){
    if (id === "research") return RS.cards.every(function(c){ return S.seen[c.id]; });
    if (id === "sort") { var st = (MV.S.sort || {})[SO.id] || {}, pl = st.placed || {}; return SO.items.every(function(it){ return pl[it.id]; }); }
    return !!S.deskChk && DK.policies.every(deskOk);
  }
  function stLabels(){ return D.stations.map(function(s){ return { id:s.id, t:s.t + (done(s.id) ? ' <span class="fsc-stok">✓<span class="vh"> finished</span></span>' : "") }; }); }
  var stOpts = stLabels();
  var stRG = radios($("#fsc-stn", host), { label:"Station", cls:"chips", options:stOpts, value:S.st, onChange:function(v){ S.st = v; api.save(); paintAll(); } });
  function stRepaint(){
    stLabels().forEach(function(x, i){ stOpts[i].t = x.t; }); stRG.repaint();
    $("#fsc-stp", host).textContent = "Stations finished: " + D.stations.filter(function(s){ return done(s.id); }).length + " of " + D.stations.length + ".";
  }

  // ===== Station 1: research cards + Check it with data =====
  function cmpHTML(c){
    var head = ["Household"].concat(c.tenure ? ["Housing"] : [], c.cols.map(function(col){ return col.t; }));
    return '<p class="tiny fsc-cmpt"><span class="hfa-model">Model data</span> from the explorer</p><div class="tbl-wrap"><table class="fsc-ctab"><thead><tr>' + head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" +
      c.hh.map(function(id){
        var h = hhOf(id);
        return '<tr><th scope="row"><strong>' + h.id + "</strong> " + h.chip + "</th>" + (c.tenure ? "<td>" + (h.renter ? "Renter" : "Owner") + "</td>" : "") +
          c.cols.map(function(col){ var r = calc(h, normOn(col.on)); return "<td>" + stChip(statusOf(r)) + " " + gapShort(r) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  var s1 = $("#fsc-st-research", host);
  s1.innerHTML = '<h4 class="fsc-h4">' + RS.title + "</h4><p>" + RS.ask + '</p><div class="fsc-rcards">' + RS.cards.map(function(c, i){
    return '<article class="fsc-rcard"><p class="fsc-rn">Finding ' + (i + 1) + '</p><p class="fsc-rt">' + c.t + '</p><details class="alg fsc-rd" data-rd="' + c.id + '"><summary>Check it with data<span class="fsc-seen" data-seen="' + c.id + '"></span></summary>' + cmpHTML(c.cmp) + '<p class="fsc-rtake"><strong>' + c.take + "</strong></p></details></article>";
  }).join("") + '</div><p class="tiny" id="fsc-rcount" aria-live="polite"></p>';
  function paintSeen(){
    RS.cards.forEach(function(c){ $('[data-seen="' + c.id + '"]', s1).innerHTML = S.seen[c.id] ? ' <span class="fsc-stok">✓</span><span class="vh"> checked</span>' : ""; });
    $("#fsc-rcount", s1).textContent = "Findings checked against the data: " + RS.cards.filter(function(c){ return S.seen[c.id]; }).length + " of " + RS.cards.length + ".";
  }
  s1.addEventListener("toggle", function(e){ var d = e.target; if (!d.dataset || !d.dataset.rd || !d.open) return; if (!S.seen[d.dataset.rd]) { S.seen[d.dataset.rd] = true; api.save(); paintSeen(); stRepaint(); } }, true);

  // ===== Station 2: sort the responses (the toolkit K12 sorter; not scored in the summary) =====
  var s2 = $("#fsc-st-sort", host);
  s2.innerHTML = '<h4 class="fsc-h4">' + SO.title + "</h4><p>" + SO.ask + '</p><div id="fsc-sorter"></div>';
  MV.activityTypes.sorter($("#fsc-sorter", s2), SO);
  s2.addEventListener("click", function(){ stRepaint(); });

  // ===== Station 3: who decides? =====
  var s3 = $("#fsc-st-desk", host);
  s3.innerHTML = '<h4 class="fsc-h4">' + DK.title + "</h4><p>" + DK.ask + '</p><div class="fsc-desks">' + DK.policies.map(function(p){
    return '<div class="fsc-desk" data-dp="' + p.id + '"><p class="fsc-dpt"><strong>' + p.t + '</strong> <span class="fsc-dmk" aria-hidden="true"></span></p><div id="fsc-d-' + p.id + '"></div><p class="tiny fsc-dfb"></p></div>';
  }).join("") + '</div><div class="q-actions"><button type="button" class="btn primary sm" id="fsc-dchk" data-k="fscdchk">Check my desks</button></div><div id="fsc-dfb" aria-live="polite"></div><div id="fsc-dkey"></div>';
  DK.policies.forEach(function(p){
    radios($("#fsc-d-" + p.id, s3), { aria:"Who decides: " + p.t, cls:"chips", options:DK.reps, value:S.desk[p.id] || "",
      onChange:function(v){ S.desk[p.id] = v; S.deskChk = false; api.save(); paintDesk(); stRepaint(); } });
  });
  function paintDesk(){
    var M = DK.msgs, chk = !!S.deskChk, all = DK.policies.every(function(p){ return S.desk[p.id]; });
    DK.policies.forEach(function(p){
      var box = $('[data-dp="' + p.id + '"]', s3), ok = deskOk(p), show = chk && all;
      box.classList.toggle("right", show && ok); box.classList.toggle("wrong", show && !ok);
      $(".fsc-dmk", box).textContent = show ? (ok ? "✓" : "✗") : "";
      $(".fsc-dfb", box).innerHTML = show ? (ok ? p.why : '<span class="vh">Wrong desk.</span>') : "";
    });
    var fb = $("#fsc-dfb", s3), off = DK.policies.filter(function(p){ return !deskOk(p); }).length;
    if (!chk) fb.innerHTML = "";
    else if (!all) fb.innerHTML = MV.fbHTML("", M.partial);
    else fb.innerHTML = !off ? MV.fbHTML("good", "<strong>✓ " + M.ok + "</strong>") : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + fill(M.off, { n:off === 1 ? "1 policy is" : off + " policies are" }));
    $("#fsc-dkey", s3).innerHTML = done("desk") ? '<h5 class="fsc-h5">' + DK.keyTitle + '</h5><div class="tbl-wrap"><table class="fsc-ctab"><thead><tr><th scope="col">Policy</th><th scope="col">Decided by</th></tr></thead><tbody>' +
      DK.policies.map(function(p){ return '<tr><th scope="row">' + p.t + "</th><td>" + p.desk + "</td></tr>"; }).join("") + "</tbody></table></div>" : "";
  }
  $("#fsc-dchk", s3).addEventListener("click", function(){ S.deskChk = true; api.save(); paintDesk(); stRepaint(); MV.focusFb($("#fsc-dfb", s3)); });

  function paintAll(){ stRG.set(S.st); stRepaint(); D.stations.forEach(function(s){ $("#fsc-st-" + s.id, host).hidden = s.id !== S.st; }); }
  paintSeen(); paintDesk(); paintAll();
}

// ---------- Practice 2: Reading the data (custom ★ set: a model data table once, then tap answers with the toolkit's
// practice multiple-choice look, retry mode and three levels of help) ----------
function dataSet(host, api, a){
  var S = api.S; S.items = S.items || {};
  function ist(id){ return S.items[id] || (S.items[id] = { tries:0, hint:0, solved:false, first:null }); }
  function q(it){ var c = {}; for (var k in it) c[k] = it[k]; c.prompt = it.prompt + (it.star ? ' <span class="tag">★' + (it.inquiry ? " Inquiry" : "") + "</span>" : ""); return c; }
  function paintQ(it, i){
    var box = host.querySelector('[data-mq="' + it.id + '"]'), x = ist(it.id);
    MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(q(it), x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:"D" + (i + 1), noConf:true }); });
  }
  host.innerHTML = '<div class="fsc-dtab"><p class="fsc-dtt"><span class="hfa-model">' + a.tableTag + "</span></p>" + MV.tableHTML({ head:a.head, rows:a.rows, caption:a.tableTag }) + "</div>" +
    '<p class="how">' + a.how + "</p>" + a.items.map(function(it){ return '<div class="q" data-mq="' + it.id + '"></div>'; }).join("");
  a.items.forEach(paintQ);
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-mq]"); if (!box) return;
    var it = byId(a.items, box.dataset.mq), i = a.items.indexOf(it), x = ist(it.id);
    if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (b.dataset.act === "hint") x.hint = Math.min(3, (x.hint || 0) + 1);
    else if (b.dataset.act === "check") {
      x.checked = true;
      if (MV.ok(it.options[x.choice])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    }
    api.save(); paintQ(it, i); if (b.dataset.act === "check") MV.focusFb(box);
  });
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Write to the right desk (@component letterDesk — policy, representative and household chips,
// 2–3 evidence chips, a letter box with a word count, an explorer check of the example, model letters once every line passes) ----------
var CITE = /\(\s*[A-Z][^()]*?,\s*(\d{4}[a-z]?|n\.\s?d\.)\s*\)/;
function norm(s){ return String(s || "").replace(/[’‘`]/g, "'").toLowerCase(); }
function escRe(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function hasTerm(text, term){ var t = norm(text), n = norm(term); return n.length <= 4 ? new RegExp("(^|[^a-z0-9])" + escRe(n) + "(?![a-z0-9])").test(t) : t.indexOf(n) >= 0; }
var task = (function(){
  var api = null, rg = {};
  function T(){ return MV.C.task; }
  function pol(id){ return byId(T().policies, id); }
  function rep(id){ return byId(T().reps, id); }
  function read(s){ s = s || (api && api.S) || {}; return { pol:pol(s.pol) ? s.pol : "", rep:rep(s.rep) ? s.rep : "", hh:hhOf(s.hh) ? s.hh : "",
    ev:(Array.isArray(s.ev) ? s.ev : []).filter(function(id){ return byId(T().evidence, id); }), text:String(s.text || "") }; }
  function exCheck(d){
    var p = pol(d.pol), h = hhOf(d.hh); if (!p || !h) return null;
    if (!p.sup) return { ok:false, none:true };
    if (p.hh.indexOf(d.hh) < 0) return { ok:false, notFor:true, p:p, h:h };
    var on1 = normOn({}); on1[p.sup] = true;
    var b = statusOf(calc(h, normOn({}))), a = statusOf(calc(h, on1));
    return { ok:LEVEL[a] < LEVEL[b], before:b, after:a, p:p, h:h, sup:togOf(p.sup) };
  }
  function checks(d){
    var p = pol(d.pol), research = d.ev.filter(function(id){ return byId(T().evidence, id).research; }).length, wc = words(d.text), t = norm(d.text), ex = exCheck(d);
    return [
      !!p && !!d.rep && (MV.ans(p) || []).indexOf(d.rep) >= 0,
      d.ev.length >= 2 && research >= 1,
      !!(ex && ex.ok),
      !!p && p.names.some(function(n){ return hasTerm(d.text, n); }),
      wc >= 120 && wc <= 220,
      CITE.test(d.text),
      wc > 0 && !T().banned.some(function(b){ return b === "lazy" ? /(^|[^a-z])lazy(?![a-z])/.test(t) : t.indexOf(norm(b)) >= 0; })
    ];
  }
  function keyOf(d){ return d.pol + "|" + d.rep; }
  function text(k){ var q = k.split("|"), p = pol(q[0]), r = rep(q[1]); return (p ? p.t : "?") + " → " + (r ? r.t : "?"); }
  function paint(){
    var d = read(), el = $("#fsc-tdesk"); if (!el) return;
    var p = pol(d.pol), r = rep(d.rep), h = hhOf(d.hh), ex = exCheck(d), wc = words(d.text);
    var exLine = !p || !h ? '<span class="muted">Choose a policy and a household.</span>' : ex.none ? T().noModelTip :
      ex.notFor ? "In the explorer, this policy applies to " + listAnd(p.hh.map(function(id){ return hhOf(id).short; })) + ", not " + h.short + "." :
      h.short.charAt(0).toUpperCase() + h.short.slice(1) + " with " + ex.sup.id + " " + ex.sup.t.toLowerCase() + " on (no shocks): " + stChip(ex.before) + " → " + stChip(ex.after) + (ex.ok ? " The status improves." : " The status doesn’t improve.");
    el.innerHTML = '<div class="fsc-tcard"><h4 class="fsc-h4">Your letter plan</h4><dl class="read">' +
      "<div><dt>Policy → desk</dt><dd>" + (p ? p.t : '<span class="muted">no policy yet</span>') + " → " + (r ? r.t : '<span class="muted">no representative yet</span>') + "</dd></div>" +
      "<div><dt>Explorer check</dt><dd>" + exLine + "</dd></div>" +
      "<div><dt>Evidence</dt><dd>" + (d.ev.length ? d.ev.map(function(id){ return id + ": " + byId(T().evidence, id).t; }).join("<br>") : '<span class="muted">none yet</span>') + "</dd></div>" +
      "<div><dt>Length</dt><dd>" + wc + " words (120–220)</dd></div></dl></div>";
    $("#fsc-wc").textContent = wc + " words (120–220)";
    var n = d.ev.length;
    $$("#fsc-tev [data-ev]").forEach(function(b){ var on = d.ev.indexOf(b.dataset.ev) >= 0; b.setAttribute("aria-pressed", on); b.disabled = !on && n >= 3; b.innerHTML = (on ? "✓ " : "+ ") + "<strong>" + b.dataset.ev + "</strong> " + byId(T().evidence, b.dataset.ev).t; });
    $("#fsc-tevn").textContent = n >= 3 ? "Three chosen: tap one to remove it before adding another." : n + " chosen.";
    var allOk = checks(d).every(Boolean), mh = $("#fsc-tmodels");
    mh.innerHTML = allOk ? '<details class="alg fsc-models"><summary>' + T().modelsTitle + "</summary>" + T().models.map(function(m){ return '<h5 class="fsc-h5">' + m.title + '</h5><p class="fsc-mletter">' + esc(m.text) + "</p>"; }).join("") + "</details>" : "";
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S, TK = T(); s.ev = Array.isArray(s.ev) ? s.ev : [];
      inp.innerHTML = '<div class="fsc-tin"><div id="fsc-tpol"></div><div id="fsc-trep"></div><div id="fsc-thh"></div>' +
        '<div class="fsc-rgw fsc-tevw"><span class="fsc-rgl">Evidence (choose 2–3)</span><div class="fsc-chipset multi" id="fsc-tev" role="group" aria-label="Evidence, choose 2 to 3">' +
          TK.evidence.map(function(e){ return '<button type="button" aria-pressed="false" data-ev="' + e.id + '" data-k="tev' + e.id + '"></button>'; }).join("") + '</div><p class="tiny muted" id="fsc-tevn" aria-live="polite"></p></div>' +
        '<div class="jq fsc-ljq"><label for="fsc-letter">' + TK.letterLabel + '</label><textarea id="fsc-letter" class="fsc-letter" placeholder="Dear …"></textarea><p class="tiny muted" id="fsc-wc" aria-live="polite"></p></div></div>';
      pv.innerHTML = '<div class="fsc-tpv"><div id="fsc-tdesk" aria-live="polite"></div><div id="fsc-tmodels"></div></div>';
      function upd(){ a.save(); paint(); a.update(); }
      rg.pol = radios($("#fsc-tpol"), { label:"Policy", cls:"chips", options:TK.policies.map(function(p){ return { id:p.id, t:p.t }; }), value:s.pol || "", onChange:function(v){ s.pol = v; upd(); } });
      rg.rep = radios($("#fsc-trep"), { label:"Representative", cls:"chips", options:TK.reps, value:s.rep || "", onChange:function(v){ s.rep = v; upd(); } });
      rg.hh = radios($("#fsc-thh"), { label:"Example household", cls:"chips", options:EXC().households.map(function(h){ return { id:h.id, t:"<strong>" + h.id + "</strong> " + h.chip }; }), value:s.hh || "", onChange:function(v){ s.hh = v; upd(); } });
      $("#fsc-tev").addEventListener("click", function(e){
        var b = e.target.closest("[data-ev]"); if (!b || b.disabled) return;
        var id = b.dataset.ev, k = s.ev.indexOf(id);
        if (k >= 0) s.ev.splice(k, 1); else if (s.ev.length < 3) s.ev.push(id);
        upd(); b.focus({ preventScroll:true });
      });
      var ta = $("#fsc-letter"); ta.value = s.text || "";
      ta.addEventListener("input", function(){ s.text = ta.value; upd(); });
      paint();
    },
    read:function(){ return read(); },
    valid:function(d){ return d.pol && d.rep && d.hh ? true : "Choose a policy, a representative and an example household first."; },
    checks:checks,
    tips:function(d, res){ var p = pol(d.pol); return T().checks.map(function(_, i){ return res[i] ? null : i === 2 && p && !p.sup ? T().noModelTip : T().tips[i]; }).filter(Boolean); },
    key:keyOf,
    label:function(k){ return esc(text(k)); },
    text:text,
    summary:function(ts){
      var f = ts.found || [], d = read(ts.app || {}), L = [T().summary + ": " + (f.length ? "solved (" + f.map(text).join("; ") + ")" : "not solved yet")];
      if (d.text.trim()) { L.push("  Letter:"); d.text.trim().split(/\r?\n/).forEach(function(l){ L.push("    " + l); }); }
      return L;
    }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ data:dataSet },
  task:task
});
})();
