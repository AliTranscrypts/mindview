// HFA4U 22 Climate Change & Food Systems: hero (food chain → gas puffs → thermometer → loop back to a cracked, then flooded
// field), Emissions along the chain (Explore: F9 food system map in three modes — Chain view stage bars, Canada impacts map
// with level icons, Farm plan card tray with two meters), Plate footprints (Part 3: meal builder with "Add serving" counters
// and the cafeteria dish table), Footprint reasoning (custom ★ practice set: number entry, a menu chip + number, choices)
// and "Three-day cafeteria menu" (task: 3 dish chips, live tray totals).
// Plan wording lives in content.mjs; this file adds only control labels and layout text.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
var MINUS = "−";
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function f1(v){ return String(Math.round(v * 10) / 10); }
function d1(v){ return (Math.round(v * 10) / 10).toFixed(1); }
function byId(list, id){ for (var i = 0; i < (list || []).length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function fill(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : ""; }); }
function pct(v){ return v === 0 ? "0%" : (v < 0 ? MINUS + Math.abs(v) : "+" + v) + "%"; }
function arrowKeys(e){ return (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; }
function svgT(x, y, s, cls, anchor, extra){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '"' + (extra || "") + ">" + s + "</text>"; }

// ---------- @component radioGroup (copied from HFA4U 16 / 12; "cfs-" classes; options may carry an inline style `st`) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", onChange}) -> {set, get, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), kind = o.cls === "chips" ? "cfs-chipset" : "seg";
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), lab = typeof o.label === "function" ? o.label() : o.label;
    host.innerHTML = '<span class="cfs-rgw">' + (lab ? '<span class="cfs-rgl">' + lab + "</span>" : "") + '<span class="cfs-rg ' + kind + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || lab || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && host.contains(b)) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); });
    var k = ids.indexOf(val); choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : clamp(k + d, 0, ids.length - 1)]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; }, repaint:paint };
}

// ---------- model data helpers (content.explore tables) ----------
function EX(){ return MV.C.explore; }
function food(id){ return byId(EX().foods, id); }
function stageT(i){ return EX().stages[i].t; }
var TR = 4;   // index of the transport stage
function share(fd){ return Math.round(fd.s[TR] / fd.total * 100); }
function largest(fd){ var m = Math.max.apply(null, fd.s), out = []; fd.s.forEach(function(v, i){ if (Math.abs(v - m) < 1e-9) out.push(stageT(i) + " (" + d1(v) + ")"); }); return out.join(" and "); }
function niceMax(v){ var L = [0.5, 1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 60, 80, 100]; for (var i = 0; i < L.length; i++) if (L[i] >= v - 1e-9) return L[i]; return v; }
function region(id){ return byId(EX().regions, id); }
function warmT(w){ var x = byId(EX().warming, w); return x ? x.t : ""; }
function levels(r, w){ return r.north ? null : r.lv[w]; }
function risksText(r, w){
  if (r.north) return "Sea-ice season: shorter (" + r.ice[w] + ") · Country-food access risk: " + r.access[w] + " · Store-food cost risk: " + r.cost[w];
  var L = levels(r, w); return EX().risks.map(function(k, i){ return k.short + ": " + L[i]; }).join(" · ");
}
function planSum(ids){ var e = 0, r = 0; ids.forEach(function(id){ var c = byId(EX().cards, id); if (c) { e += c.e; r += c.r; } }); return { e:e, r:r }; }

// ---------- icons (24 × 24, stroke in currentColor; the word always sits beside the icon) ----------
var ICON = {
  drought:'<circle cx="12" cy="7" r="3.2"/><path d="M12 1.5v1.6M12 11v1.4M6.5 7H5M19 7h-1.5M8.2 3.2l1 1M15.8 3.2l-1 1"/><path d="M2 17h20M7 17l2 2.5-2 2.5M14 17l-1.5 2.5L15 22"/>',
  flood:'<path d="M2 9c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 4-2 5 0M2 14c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 4-2 5 0M2 19c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 4-2 5 0"/>',
  season:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 15.5h8M13.5 13l2.5 2.5-2.5 2.5"/>',
  pests:'<ellipse cx="12" cy="14" rx="4.2" ry="6"/><circle cx="12" cy="6.5" r="2.4"/><path d="M12 8v12M7.8 11l-4-2M7.8 14.5H3.5M7.8 18l-4 2M16.2 11l4-2M16.2 14.5h4.3M16.2 18l4 2M10.5 4.5 9 2M13.5 4.5 15 2"/>',
  ice:'<path d="M12 2v20M3.4 7l17.2 10M3.4 17 20.6 7M9.5 3.5 12 6l2.5-2.5M9.5 20.5 12 18l2.5 2.5"/>',
  access:'<path d="M3 15h14l4-4M5 15l-2 4h16M8 15V9h6v6"/><circle cx="11" cy="6" r="2"/>',
  cost:'<circle cx="12" cy="12" r="9.5"/><path d="M15 8.5c-.8-1-1.8-1.5-3-1.5-1.9 0-3 1-3 2.4 0 3.2 6 1.8 6 5 0 1.4-1.2 2.6-3.1 2.6-1.3 0-2.4-.5-3.2-1.5M12 5v2M12 17v2"/>'
};
function icon(k){ return '<svg class="cfs-ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + "</svg>"; }
var LV = { Low:1, Medium:2, High:3 };
function pips(v){ var n = LV[v]; if (!n) return ""; var h = '<span class="cfs-pips" aria-hidden="true">'; for (var i = 1; i <= 3; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>'; return h + "</span>"; }

// ---------- hero (storyboard: the chain appears; labelled puffs rise and drift into a thermometer that rises; an arrow loops
// back to the field, which cracks and then floods; final frame: the loop with "cause" and "victim" labels).
// Reduced motion: the final frame only. ----------
var HX = [40, 125, 210, 295, 380], HY = 232, HG = ["N₂O", "CH₄", "CO₂", "CO₂", "CH₄"], HL = ["Field", "Barn", "Truck", "Store", "Kitchen"];
function stageArt(i, x, y){
  if (i === 0) return '<path class="cfs-hs" d="M' + (x - 34) + " " + (y + 14) + "H" + (x + 34) + '"/>' + [-20, 0, 20].map(function(d){ var X = x + d; return '<path class="cfs-hs" d="M' + X + " " + (y + 14) + "V" + (y - 6) + "M" + X + " " + (y + 2) + "c-6-1-8-5-8-10 5 1 8 4 8 10zm0-4c6-1 8-5 8-10-5 1-8 4-8 10z" + '"/>'; }).join("");
  if (i === 1) return '<path class="cfs-hs" d="M' + (x - 26) + " " + (y + 14) + "V" + (y - 8) + "L" + x + " " + (y - 26) + "L" + (x + 26) + " " + (y - 8) + "V" + (y + 14) + "Z" + "M" + (x - 9) + " " + (y + 14) + "V" + (y - 2) + "H" + (x + 9) + "V" + (y + 14) + "M" + (x - 9) + " " + (y - 2) + "L" + (x + 9) + " " + (y + 14) + "M" + (x + 9) + " " + (y - 2) + "L" + (x - 9) + " " + (y + 14) + '"/>';
  if (i === 2) return '<path class="cfs-hs" d="M' + (x - 32) + " " + (y + 8) + "V" + (y - 16) + "H" + (x + 6) + "V" + (y + 8) + "ZM" + (x + 6) + " " + (y - 8) + "H" + (x + 22) + "L" + (x + 32) + " " + (y + 2) + "V" + (y + 8) + "H" + (x + 6) + '"/><circle class="cfs-hs" cx="' + (x - 20) + '" cy="' + (y + 12) + '" r="5"/><circle class="cfs-hs" cx="' + (x + 20) + '" cy="' + (y + 12) + '" r="5"/>';
  if (i === 3) return '<path class="cfs-hs" d="M' + (x - 28) + " " + (y + 14) + "V" + (y - 10) + "H" + (x + 28) + "V" + (y + 14) + "ZM" + (x - 32) + " " + (y - 10) + "L" + (x - 26) + " " + (y - 24) + "H" + (x + 26) + "L" + (x + 32) + " " + (y - 10) + "M" + (x - 8) + " " + (y + 14) + "V" + (y) + "H" + (x + 8) + "V" + (y + 14) + '"/>';
  return '<path class="cfs-hs" d="M' + (x - 24) + " " + (y - 6) + "H" + (x + 24) + "V" + (y + 6) + "Q" + (x + 24) + " " + (y + 16) + " " + (x + 14) + " " + (y + 16) + "H" + (x - 14) + "Q" + (x - 24) + " " + (y + 16) + " " + (x - 24) + " " + (y + 6) + "ZM" + (x - 30) + " " + (y - 6) + "H" + (x + 30) + "M" + (x - 6) + " " + (y - 14) + "q2-4 0-8M" + (x + 6) + " " + (y - 14) + "q2-4 0-8" + '"/>';
}
function heroSVG(st){
  var h = "", TX = 478;
  HX.forEach(function(x, i){ h += '<g style="opacity:' + f1(clamp(st.chain * 5 - i, 0, 1)) + '">' + stageArt(i, x, HY) + svgT(x, HY + 44, HL[i], "cfs-hl") + "</g>"; });
  if (st.chain >= 1) for (var i = 0; i < 4; i++) h += '<path class="cfs-hch" d="M' + (HX[i] + 36) + " " + HY + "H" + (HX[i + 1] - 36) + '"/>';
  // field overlays: cracks (drought), then water (flood)
  if (st.crack > 0) h += '<path class="cfs-hcrack" style="opacity:' + f1(st.crack) + '" d="M14 ' + (HY + 18) + "l8 6-5 6 7 4M40 " + (HY + 18) + "l-5 7 6 5-3 5M62 " + (HY + 18) + 'l6 6-4 7"/>';
  if (st.flood > 0) h += '<path class="cfs-hflood" style="opacity:' + f1(st.flood) + '" d="M6 ' + (HY + 8) + "q8-6 16 0t16 0 16 0 16 0M6 " + (HY + 18) + 'q8-6 16 0t16 0 16 0 16 0"/>';
  // thermometer
  var top = 40, bot = 160, lvl = lerp(bot - 18, top + 8, st.therm);
  h += '<rect class="cfs-hth" x="' + (TX - 9) + '" y="' + top + '" width="18" height="' + (bot - top) + '" rx="9"/><circle class="cfs-hth" cx="' + TX + '" cy="' + (bot + 10) + '" r="15"/>' +
    '<rect class="cfs-hthf" x="' + (TX - 4.5) + '" y="' + f1(lvl) + '" width="9" height="' + f1(bot + 4 - lvl) + '"/><circle class="cfs-hthf" cx="' + TX + '" cy="' + (bot + 10) + '" r="10"/>' +
    svgT(TX, 26, "warming", "cfs-hl");
  // puffs
  HX.forEach(function(x, i){
    var p = clamp(st.puff * 1.6 - i * 0.15, 0, 1); if (p <= 0) return;
    var y0 = HY - 34, y1 = 118, px = lerp(x, x, p), py = lerp(y0, y1, p);
    var dr = clamp(st.drift * 1.4 - (4 - i) * 0.1, 0, 1);
    px = lerp(px, TX - 2, dr); py = lerp(py, 70, dr);
    var op = (1 - dr) * Math.min(1, p * 2);
    if (op <= 0.02) return;
    h += '<g style="opacity:' + f1(op) + '"><circle class="cfs-hpuff" cx="' + f1(px) + '" cy="' + f1(py) + '" r="21"/>' + svgT(px, py + 5, HG[i], "cfs-hg") + "</g>";
  });
  // loop arrow from the thermometer back down to the field
  if (st.loop > 0) {
    h += '<path class="cfs-hloop" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:' + f1(1 - st.loop) + '" d="M' + TX + " " + (bot + 26) + "C" + TX + " 330 " + HX[0] + " 334 " + HX[0] + ' 262"/>';
    if (st.loop >= 1) h += '<path class="cfs-hhead" d="M' + (HX[0] - 8) + " 274L" + HX[0] + " 260L" + (HX[0] + 8) + ' 274"/>';
  }
  if (st.lab > 0) h += '<g style="opacity:' + f1(st.lab) + '">' + svgT(250, 96, "cause: emissions rise", "cfs-hcause") + svgT(262, 322, "victim: drought, then flood", "cfs-hcause") + "</g>";
  return h;
}
function hero(f){
  var host = $("#cfs-hero"); if (!host) return;
  var Hc = MV.C.hero, st = { chain:0, puff:0, drift:0, therm:0, loop:0, crack:0, flood:0, lab:0 };
  host.innerHTML = '<svg class="cfs-hsvg" viewBox="0 0 520 336" role="img" aria-label="' + esc(Hc.aria) + '"></svg>';
  var svg = host.firstChild;
  function draw(){ svg.innerHTML = heroSVG(st); }
  function cap(){ if (f.cap) { f.cap.textContent = Hc.caption; f.cap.classList.add("cfs-cap"); } }
  function finalFrame(){ st = { chain:1, puff:1, drift:0, therm:1, loop:1, crack:1, flood:1, lab:1 }; draw(); cap(); }
  if (MV.reduceMotion) { finalFrame(); return; }
  draw();
  function tw(dur, key, next){ MV.tween({ dur:dur, step:function(t){ st[key] = t; draw(); }, done:function(){ MV.wait(150, next); } }); }
  MV.wait(250, function(){
    tw(900, "chain", function(){ tw(1300, "puff", function(){ MV.tween({ dur:1300, step:function(t){ st.drift = t; st.therm = t; draw(); }, done:function(){
      tw(1100, "loop", function(){ tw(600, "crack", function(){ MV.tween({ dur:700, step:function(t){ st.crack = 1 - t; st.flood = t; draw(); }, done:function(){
        st.drift = 0; st.puff = 0; MV.tween({ dur:700, step:function(t){ st.puff = t; st.lab = t; st.crack = t; draw(); }, done:cap });
      } }); }); });
    } }); }); });
  });
}

// ---------- Explore: Emissions along the chain (@component F9 foodSystemMap — Chain view stage bars (--sys-emis brown bars on
// --sys-stage ink tracks, value labels), Canada impacts (schematic map + risk cards with icons and level words), Farm plan
// (8 action cards, a tray of 3, an emissions meter in blue --pen and a resilience meter in cerulean --p-t, numbers always
// shown). Colour is never alone. ----------
// fx: {grow (0..1, stage bars build left to right), hot (stage index that glows), hideTot, prev (warming for "was" badges)}
function chainBlockHTML(fd, max, fx, D, opts){
  var g = fx.grow == null ? 1 : fx.grow, n = fd.s.length;
  var h = '<div class="cfs-cb"><h4 class="cfs-h4">' + fd.t + ' <span class="hfa-model">Model data</span></h4><ul class="cfs-bars" aria-label="' + esc(MV.plain(fd.t) + ": emissions by stage, kg CO₂e per kg") + '">';
  fd.s.forEach(function(v, i){
    var gi = clamp(g * n - i, 0, 1), w = v / max * 100 * gi, hot = fx.hot === i;
    h += '<li class="cfs-bar' + (hot ? " hot" : "") + (i === TR ? " tr" : "") + '"><span class="cfs-bl">' + stageT(i) + '</span><span class="cfs-bt"><i style="width:' + f1(w) + '%"></i></span><span class="cfs-bv">' + (gi > 0 ? d1(v) : "…") + "</span></li>";
  });
  h += "</ul>";
  var tot = !(fx.hideTot && g < 1);
  h += '<p class="cfs-tot"><strong>Total: ' + (tot ? d1(fd.total) : "…") + "</strong> kg CO₂e per kg</p>";
  if (tot && !opts.noCap) {
    h += '<p class="cfs-capt">Transport: ' + share(fd) + "%" + (fd.id === "berries" ? ' <span class="cfs-air">' + D.airCaption + "</span>" : "") + "</p>";
    if (fx.hot != null && fx.hotNote) h += '<p class="cfs-capt">' + fx.hotNote + "</p>";
  }
  return h + "</div>";
}
function chainHTML(S, fx, D){
  var fd = food(S.food), cmp = S.cmp && S.cmp !== S.food ? food(S.cmp) : null, max = niceMax(Math.max.apply(null, fd.s.concat(cmp ? cmp.s : [])));
  var h = '<p class="tiny muted cfs-scale">kg CO₂e per kg of food · bar scale 0 to ' + f1(max) + (cmp ? " (shared by both foods)" : "") + "</p>";
  h += '<div class="cfs-cbs' + (cmp ? " two" : "") + '">' + chainBlockHTML(fd, max, fx, D, {}) + (cmp ? chainBlockHTML(cmp, max, fx, D, {}) : "") + "</div>";
  if (/^tom/.test(fd.id) || cmp) h += '<p class="tiny cfs-note">' + D.chainNote + "</p>";
  return h;
}
function tableAllHTML(D){
  return '<details class="alg cfs-all"><summary>Model data table: all ten foods</summary>' + MV.tableHTML({ caption:"kg CO₂e per kg of food (model data)",
    head:["Food"].concat(D.stages.map(function(s){ return s.t; }), ["Total", "Main gas"]),
    rows:D.foods.map(function(x){ return [x.t].concat(x.s.map(d1), ["<strong>" + d1(x.total) + "</strong>", x.gas]); }) }) + "</details>";
}
// Canada impacts map: a schematic outline (from HFA4U 16's F9 map regions) with four markers
var CGEO = [
  "M30 118L28 78L58 60L96 66L128 46L170 54L204 36L246 46L280 30L318 40L352 22L392 32L428 16L468 28L506 20L540 34L566 56L582 84L580 118Z",
  "M32 126H130V262H96L70 246L50 222L38 196L28 162Z", "M138 126H318V262H138Z",
  "M326 126H476V230L456 242L428 246L408 258L396 280L380 300L364 296L356 276L340 266L326 262Z",
  "M484 150L536 136L578 150L580 226L556 256L508 262L486 244Z"
];
var CMK = { fraser:[64, 238, "start"], prairies:[228, 196, "middle"], ontario:[372, 284, "start"], nunavut:[400, 74, "middle"] };
function impactMapSVG(S){
  var h = CGEO.map(function(d){ return '<path class="cfs-reg" d="' + d + '"/>'; }).join("");
  EX().regions.forEach(function(r){
    var m = CMK[r.id], on = S.region === r.id, lx = m[2] === "start" ? m[0] + 16 : m[0], ly = m[2] === "start" ? m[1] + 5 : m[1] - 18;
    h += '<circle class="cfs-mk' + (on ? " on" : "") + '" cx="' + m[0] + '" cy="' + m[1] + '" r="' + (on ? 11 : 7) + '"/>' + svgT(lx, ly, r.t, "cfs-mlab" + (on ? " on" : ""), m[2]);
  });
  return h;
}
function impactCardsHTML(S, fx){
  var r = region(S.region), w = S.warm, D = EX(), prev = fx.prev;
  if (r.north) return '<div class="cfs-risks">' + D.north.map(function(k){
    var v = r[k.id][w], pv = prev ? r[k.id][prev] : null, ch = pv != null && pv !== v;
    return '<div class="cfs-risk' + (ch ? " ch" : "") + '">' + icon(k.id) + '<span class="cfs-rt">' + k.t + '<span class="tiny muted">' + k.sub + '</span></span><span class="cfs-rv">' + (k.id === "ice" ? "Shorter: " + v : v + pips(v)) + (ch ? '<span class="cfs-was">was ' + pv + "</span>" : "") + "</span></div>";
  }).join("") + "</div>";
  var L = levels(r, w), P = prev ? levels(r, prev) : null;
  return '<div class="cfs-risks">' + D.risks.map(function(k, i){
    var ch = P && P[i] !== L[i];
    return '<div class="cfs-risk' + (ch ? " ch" : "") + '">' + icon(k.id) + '<span class="cfs-rt">' + k.t + '</span><span class="cfs-rv">' + L[i] + pips(L[i]) + (ch ? '<span class="cfs-was">was ' + P[i] + "</span>" : "") + "</span></div>";
  }).join("") + "</div>";
}
function meterHTML(cls, label, val, txt, lo, hi, ends){
  var z = (0 - lo) / (hi - lo) * 100, x = (val - lo) / (hi - lo) * 100, a = Math.min(z, x), w = Math.abs(x - z);
  return '<div class="cfs-meter ' + cls + '"><p class="cfs-ml"><strong>' + label + ":</strong> " + txt + '</p><div class="cfs-mt" aria-hidden="true"><i class="z" style="left:' + f1(z) + '%"></i><b style="left:' + f1(a) + "%;width:" + f1(w) + '%"></b></div><p class="cfs-mx tiny muted" aria-hidden="true"><span>' + ends[0] + "</span><span>" + ends[1] + "</span><span>" + ends[2] + "</span></p></div>";
}
function explore(host, api){
  var D = api.content, S = api.S, anim = null, pend = null, timers = [], fx = {}, buildStop = null;
  S.mode = byId(D.modes, S.mode) ? S.mode : "chain";
  S.food = food(S.food) ? S.food : "beef";
  S.cmp = food(S.cmp) ? S.cmp : "";
  S.claim = S.claim === S.food ? S.claim : "";
  S.region = region(S.region) ? S.region : "prairies";
  S.warm = byId(D.warming, S.warm) ? S.warm : "1";
  S.cards = (Array.isArray(S.cards) ? S.cards : []).filter(function(id){ return byId(D.cards, id); }).slice(0, 3);

  host.innerHTML = '<div id="cfs-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="cfs-lab" data-mv="graph"><div class="cfs-main">' +
      '<div id="cfs-pchain"><div id="cfs-chain" aria-live="polite"></div>' + tableAllHTML(D) + "</div>" +
      '<div id="cfs-pimp" hidden><div class="cfs-cmapw"><svg class="cfs-cmap" id="cfs-cmap" viewBox="0 0 600 310" role="img" aria-label="Map"></svg></div><h4 class="cfs-h4" id="cfs-imph"></h4><div id="cfs-imp" aria-live="polite"></div></div>' +
      '<div id="cfs-pfarm" hidden><h4 class="cfs-h4">' + D.farmTitle + ' <span class="hfa-model">Model data</span></h4><div class="cfs-cards" role="group" aria-label="Farm action cards, choose up to 3">' +
        D.cards.map(function(c){ return '<button type="button" class="cfs-card" data-card="' + c.id + '" data-k="fc' + c.id + '" aria-pressed="false"><span class="cfs-cl">' + c.id + '</span><span class="cfs-ct">' + c.t + '</span><span class="cfs-ce">Emissions ' + pct(c.e) + " · Resilience " + (c.r ? "+" + c.r : "0") + " · " + c.type + "</span></button>"; }).join("") +
      '</div><p class="tiny cfs-fmsg" id="cfs-fmsg" aria-live="polite"></p><div id="cfs-meters" aria-live="polite"></div></div>' +
    '</div><div class="cfs-side"><div id="cfs-cchain"><div id="cfs-food"></div><button type="button" class="cfs-half" id="cfs-half" aria-pressed="false" data-k="half"></button></div>' +
      '<div id="cfs-cimp" hidden><div id="cfs-reg"></div><div id="cfs-warm"></div></div>' +
      '<div id="cfs-cfarm" hidden><p class="cfs-rgl" id="cfs-tray"></p><button type="button" class="btn ghost sm" id="cfs-clear" data-k="fclr">Clear tray</button></div>' +
      '<div class="cfs-readw"><h4 class="cfs-h4">Readout</h4><dl class="read" id="cfs-read" aria-live="polite"></dl></div></div></div>';

  var modeRG = radios($("#cfs-mode"), { label:"Mode", options:D.modes, value:S.mode, onChange:function(v){ cancelAnim(); S.mode = v; commit(); } });
  var foodRG = radios($("#cfs-food"), { label:"Food", cls:"chips", options:D.foods, value:S.food, onChange:function(v){ cancelAnim(); S.food = v; S.cmp = ""; S.claim = ""; commit(); build(); } });
  var regRG = radios($("#cfs-reg"), { label:"Region", cls:"chips", options:D.regions, value:S.region, onChange:function(v){ cancelAnim(); S.region = v; commit(); } });
  var warmRG = radios($("#cfs-warm"), { label:"Warming", aria:"Warming (model scenarios)", options:D.warming, value:S.warm, onChange:function(v){ cancelAnim(); S.warm = v; commit(); } });
  var fmsg = "";
  $("#cfs-half").addEventListener("click", function(){ cancelAnim(); S.claim = S.claim === S.food ? "" : S.food; commit(); });
  $("#cfs-pfarm").addEventListener("click", function(e){
    var b = e.target.closest("[data-card]"); if (!b) return;
    cancelAnim(); var id = b.dataset.card, k = S.cards.indexOf(id);
    if (k >= 0) { S.cards.splice(k, 1); fmsg = ""; }
    else if (S.cards.length >= 3) fmsg = D.msgs.full;
    else { S.cards.push(id); fmsg = ""; }
    commit();
  });
  $("#cfs-clear").addEventListener("click", function(){ cancelAnim(); S.cards = []; fmsg = ""; commit(); });

  function readRows(){
    var R = D.readLabels, rows = [];
    if (S.mode === "chain") {
      var fd = food(S.food);
      rows.push([R.food, fd.t], [R.total, d1(fd.total) + " kg CO₂e per kg"], [R.largest, largest(fd)], [R.share, share(fd) + "%"], [R.gas, fd.gas]);
      if (S.cmp && S.cmp !== S.food) { var c = food(S.cmp); rows.push(["Compared with", c.t + ": " + d1(c.total) + " kg CO₂e per kg, transport " + share(c) + "%"]); }
    } else if (S.mode === "impacts") {
      var r = region(S.region);
      rows.push([R.region, r.t + ", " + warmT(S.warm)], [R.risks, risksText(r, S.warm)]);
    } else {
      var p = planSum(S.cards);
      rows.push([R.plan, "Emissions " + pct(p.e) + " · Resilience " + p.r + (S.cards.length ? " (cards " + S.cards.slice().sort().join(", ") + ")" : " (no cards yet)")]);
    }
    rows.push([R.data, D.dataLine]);
    return MV.readoutHTML(rows);
  }
  function paintChain(){ $("#cfs-chain").innerHTML = chainHTML(S, fx, D); }
  function paintImp(){
    var r = region(S.region);
    $("#cfs-cmap").innerHTML = impactMapSVG(S);
    $("#cfs-cmap").setAttribute("aria-label", "Schematic map of Canada with four model regions: Prairies, Southern Ontario, Fraser Valley (BC) and Nunavut. Selected: " + r.t + ".");
    $("#cfs-imph").innerHTML = r.t + ", " + warmT(S.warm) + ' <span class="hfa-model">Model levels</span>';
    $("#cfs-imp").innerHTML = impactCardsHTML(S, fx);
  }
  function paintFarm(){
    $$(".cfs-card", host).forEach(function(b){ var on = S.cards.indexOf(b.dataset.card) >= 0; b.setAttribute("aria-pressed", on); b.classList.toggle("on", on); });
    var p = planSum(S.cards);
    $("#cfs-meters").innerHTML = meterHTML("em", "Emissions change", p.e, pct(p.e), -40, 10, [pct(-40), "0%", pct(10)]) + meterHTML("rs", "Resilience", p.r, String(p.r), 0, 8, ["0", "", "8"]);
    $("#cfs-fmsg").textContent = fmsg;
    $("#cfs-tray").textContent = "Tray: " + S.cards.length + " of 3" + (S.cards.length ? " (" + S.cards.slice().sort().join(", ") + ")" : "");
    $("#cfs-clear").disabled = !S.cards.length;
  }
  function paint(){
    var m = S.mode;
    modeRG.set(m); foodRG.set(S.food); regRG.set(S.region); warmRG.set(S.warm);
    $("#cfs-pchain").hidden = m !== "chain"; $("#cfs-cchain").hidden = m !== "chain";
    $("#cfs-pimp").hidden = m !== "impacts"; $("#cfs-cimp").hidden = m !== "impacts";
    $("#cfs-pfarm").hidden = m !== "farm"; $("#cfs-cfarm").hidden = m !== "farm";
    var hb = $("#cfs-half"), on = S.claim === S.food;
    hb.setAttribute("aria-pressed", on); hb.innerHTML = '<span aria-hidden="true">' + (on ? "✓" : "?") + "</span> " + D.halfChip + (on ? '<span class="vh"> (confirmed for ' + esc(MV.plain(food(S.food).t)) + ")</span>" : "");
    if (m === "chain") paintChain(); else if (m === "impacts") paintImp(); else paintFarm();
    $("#cfs-read").innerHTML = readRows();
  }
  function commit(){ fx = {}; api.save(); paint(); MV.changed(); }
  // cosmetic: stage bars build left to right when a food is chosen (reduced motion: full height at once)
  function build(){
    if (MV.reduceMotion) return;
    if (buildStop) buildStop();
    fx.grow = 0;
    buildStop = MV.tween({ dur:700, ease:function(t){ return t; }, step:function(t){ fx.grow = t; paintChain(); }, done:function(){ buildStop = null; fx.grow = 1; paintChain(); } });
  }
  function later(ms, fn){ timers.push(MV.wait(ms, fn)); }
  function finish(){ anim = null; timers = []; api.save(); paint(); MV.changed(); var d = pend; pend = null; if (d) d(); }
  function cancelAnim(){
    if (anim) { anim(); anim = null; } timers.forEach(clearTimeout); timers = [];
    if (buildStop) { buildStop(); buildStop = null; }
    fx = {};
    if (pend) { var d = pend; pend = null; d(); }
  }
  paint();

  // ===== target challenges (plan's exact tests and named wrong states) =====
  function challenge(id){
    var M = D.msgs, r = { ok:false };
    if (id === "tc1") {
      if (S.mode !== "chain") r.msg = M.tc1Mode;
      else if (S.food === "berries") { if (S.claim === "berries") r = { ok:true }; else r.msg = M.tc1Chip; }
      else if (S.food === "tomField") r.msg = M.tc1Field;
      else if (S.food === "bananas") r.msg = M.tc1Bananas;
      else if (S.food === "beef") r.msg = M.tc1Beef;
      else r.msg = fill(M.tc1Other, { p:share(food(S.food)) });
    } else if (id === "tc2") {
      var rg = region(S.region);
      if (S.mode !== "impacts") r.msg = M.tc2Mode;
      else if (S.region === "fraser" && S.warm === "3") r = { ok:true };
      else if (S.region === "prairies" && S.warm === "3") r.msg = M.tc2Prairies;
      else if (S.region === "ontario" && S.warm === "3") r.msg = M.tc2Ontario;
      else if (S.region === "fraser" && S.warm === "2") r.msg = M.tc2Fraser2;
      else if (rg.north) r.msg = M.tc2North;
      else { var L = levels(rg, S.warm); r.msg = fill(M.tc2Other, { d:L[0], f:L[1] }); }
    } else if (id === "tc3") {
      var ids = S.cards.slice().sort().join(""), p = planSum(S.cards);
      if (S.cards.length !== 3) r.msg = fill(M.tc3Count, { n:S.cards.length });
      else if (p.e <= -25 && p.r >= 3) r = { ok:true };
      else if (ids === "abd") r.msg = M.tc3abd;
      else if (ids === "bfg") r.msg = M.tc3bfg;
      else if (ids === "ade") r.msg = M.tc3ade;
      else r.msg = fill(M.tc3Other, { e:pct(p.e), r:p.r });
    }
    return r;
  }

  // ===== predictions =====
  function reveal(el){ var b = el && el.getBoundingClientRect(); if (b && b.height && (b.top < 110 || b.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  function glow(i, note, done){
    fx.hot = i; fx.hotNote = note; paintChain();
    var n = 0, step = function(){ n++; fx.hot = n % 2 ? null : i; paintChain(); if (n < 4) later(260, step); else { fx.hot = i; paintChain(); later(500, done); } };
    if (MV.reduceMotion) later(0, done); else later(260, step);
  }
  return {
    predict:{
      start:function(p){
        cancelAnim();
        if (p.id === "p1") { S.mode = "chain"; S.food = "beef"; S.cmp = ""; S.claim = ""; }
        else if (p.id === "p2") { S.mode = "chain"; S.food = "tomGh"; S.cmp = "tomField"; S.claim = ""; fx.grow = 0; fx.hideTot = true; }
        else if (p.id === "p3") { S.mode = "chain"; S.food = "rice"; S.cmp = ""; S.claim = ""; fx.grow = 0; fx.hideTot = true; }
        else if (p.id === "p4") { S.mode = "impacts"; S.region = "prairies"; S.warm = "1"; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        pend = done;
        if (p.id === "p1") { reveal($("#cfs-chain")); later(300, function(){ glow(1, "Farm: " + d1(food("beef").s[1]) + " of " + d1(food("beef").total) + " (methane from cattle)", function(){ fx.hold = 1; finish(); }); }); }
        else if (p.id === "p2" || p.id === "p3") {
          reveal($("#cfs-chain"));
          later(300, function(){
            fx.grow = 0; fx.hideTot = true;
            anim = MV.tween({ dur:1400, ease:function(t){ return t; }, step:function(t){ fx.grow = t; paintChain(); }, done:function(){
              anim = null; fx.grow = 1; fx.hideTot = false; paintChain();
              if (p.id === "p3") glow(1, "Farm " + d1(food("rice").s[1]) + " (methane)", finish); else later(600, finish);
            } });
          });
        } else {
          reveal($("#cfs-imp"));
          later(400, function(){
            fx.prev = "1"; S.warm = "2"; paint();
            later(MV.reduceMotion ? 0 : 900, function(){ S.warm = "3"; paint(); later(MV.reduceMotion ? 0 : 1600, finish); });
          });
        }
      }
    },
    challenge:challenge
  };
}

// ---------- Part 3: Plate footprints (@component mealBuilder — "Add serving" / "Remove" counters (0–4 each), a live plate
// list, total and stacked footprint bar; the cafeteria dish table in a scrolling box; the respectful-framing note) ----------
function part3(host, api){
  var D = api.content, S = api.S;
  S.plate = S.plate && typeof S.plate === "object" ? S.plate : {};
  D.servings.forEach(function(s){ S.plate[s.id] = clamp(+S.plate[s.id] || 0, 0, 4); });
  host.innerHTML = '<div class="cfs-p3"><div class="cfs-mb"><h4 class="cfs-h4">' + D.builderTitle + ' <span class="hfa-model">Model data</span></h4><p>' + D.builderAsk + '</p><ul class="cfs-srv" id="cfs-srv"></ul></div>' +
    '<div class="cfs-plate" id="cfs-plate" aria-live="polite"></div></div>' +
    '<h4 class="cfs-h4 cfs-dt">' + D.dishTitle + ' <span class="hfa-model">Model data</span></h4>' +
    MV.tableHTML({ caption:"Cafeteria dishes (model data)", head:["#", "Dish", "Tradition", "Footprint (kg CO₂e)", "Cost", "Protein"],
      rows:D.dishes.map(function(x){ return [x.id, x.t, x.trad, d1(x.f), "$" + x.cost, x.p + " g"]; }) }) +
    '<div class="cfs-frame" role="note"><p><strong>Foods, not people.</strong> ' + D.framing + "</p></div>";
  function total(){ var t = 0; D.servings.forEach(function(s){ t += s.v * S.plate[s.id]; }); return Math.round(t * 10) / 10; }
  function paintList(){
    var el = $("#cfs-srv", host);
    MV.keepFocus(el, function(){
      el.innerHTML = D.servings.map(function(s){
        var n = S.plate[s.id];
        return '<li><span class="cfs-st">' + s.t + ' <span class="tiny muted">' + d1(s.v) + ' kg CO₂e</span></span><span class="cfs-sc"><button type="button" class="cfs-pm" data-rm="' + s.id + '" data-k="rm' + s.id + '"' + (n ? "" : " disabled") + ' aria-label="Remove a serving of ' + esc(MV.plain(s.t)) + '">' + MINUS + '</button><span class="cfs-n" aria-label="' + n + ' on the plate">' + n + '</span><button type="button" class="cfs-pm add" data-add="' + s.id + '" data-k="ad' + s.id + '"' + (n >= 4 ? " disabled" : "") + ' aria-label="Add serving: ' + esc(MV.plain(s.t)) + '">+ <span class="cfs-adt">Add serving</span></button></span></li>';
      }).join("");
    });
  }
  function paintPlate(){
    var on = D.servings.filter(function(s){ return S.plate[s.id] > 0; }), t = total(), max = Math.max(2, t);
    var h = '<h4 class="cfs-h4">Your plate</h4>';
    if (!on.length) h += '<p class="tiny muted">The plate is empty. Add a serving.</p>';
    else {
      h += '<ul class="cfs-pl">' + on.map(function(s){ var n = S.plate[s.id]; return "<li>" + s.t + (n > 1 ? " × " + n : "") + ' <span class="muted">' + d1(s.v * n) + "</span></li>"; }).join("") + "</ul>";
      h += '<div class="cfs-stack" role="img" aria-label="' + esc("Plate footprint " + d1(t) + " kg CO₂e: " + on.map(function(s){ return MV.plain(s.t) + " " + d1(s.v * S.plate[s.id]); }).join(", ")) + '">' +
        on.map(function(s, i){ return '<i class="k' + (i % 4) + '" style="width:' + f1(s.v * S.plate[s.id] / max * 100) + '%"></i>'; }).join("") + "</div>";
    }
    h += '<p class="cfs-ptot">Plate footprint: <strong>' + d1(t) + " kg CO₂e</strong></p>" + (on.length ? '<button type="button" class="btn ghost sm" data-clear="1" data-k="pclr">Clear plate</button>' : "");
    var el = $("#cfs-plate", host); MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.add) S.plate[b.dataset.add] = Math.min(4, S.plate[b.dataset.add] + 1);
    else if (b.dataset.rm) S.plate[b.dataset.rm] = Math.max(0, S.plate[b.dataset.rm] - 1);
    else if (b.dataset.clear) { D.servings.forEach(function(s){ S.plate[s.id] = 0; }); var f = host.querySelector("[data-add]"); api.save(); paintList(); paintPlate(); if (f) f.focus({ preventScroll:true }); return; }
    else return;
    api.save(); paintList(); paintPlate();
  });
  paintList(); paintPlate();
}

// ---------- Practice 2: Footprint reasoning (custom ★ set: number entry, a menu chip + number, choice chips; first-try
// scoring, three levels of help) ----------
function numIn(s){
  s = String(s == null ? "" : s).replace(/[%\s]|kg|CO₂e|times/gi, "").replace(/−/g, "-");
  if (!s) return null;
  var v = MV.parseNum ? MV.parseNum(s) : parseFloat(s);
  if (v == null || !isFinite(v)) { v = parseFloat(s); if (!isFinite(v)) return null; }
  return v;
}
function reason(host, api, a){
  var S = api.S; S.items = S.items && typeof S.items === "object" ? S.items : {};
  var msgs = {};
  function ist(id){ var x = S.items[id] || (S.items[id] = { v:"", menu:"", pick:"", tries:0, hint:0, solved:false, first:null }); return x; }
  function itemHTML(it){
    var x = ist(it.id), dis = x.solved ? " disabled" : "";
    var h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + it.n + '</span><div class="q-prompt">' + it.prompt + "</div>" +
      (it.star ? '<span class="tags"><span class="tag">★</span>' + (it.inquiry ? '<span class="tag">Inquiry</span>' : "") + "</span>" : "") + "</div>";
    if (it.kind === "menu") {
      h += '<div class="cfs-chipset cfs-mchips" role="radiogroup" aria-label="Which menu is smaller?">' + it.menus.map(function(m, i){
        var on = x.menu === m.id; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!x.menu && i === 0) ? 0 : -1) + '" data-menu="' + m.id + '" data-k="mn' + it.id + m.id + '"' + dis + ">" + m.t + "</button>"; }).join("") + "</div>";
    }
    if (it.kind === "num" || it.kind === "menu") {
      h += '<div class="numrow"><label for="ri-' + it.id + '">' + it.label + '</label><input class="numin short" id="ri-' + it.id + '" data-rin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.v || "") + '"' + dis + '><span class="cfs-unit">' + it.unit + "</span></div>";
    } else {
      h += '<div class="cfs-chipset cfs-mcs" role="radiogroup" aria-label="Answers">' + it.options.map(function(o, i){
        var on = x.pick === String(i); return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!x.pick && i === 0) ? 0 : -1) + '" data-pick="' + i + '" data-k="pk' + it.id + i + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    }
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.why + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML(msgs[it.id].kind == null ? "bad" : msgs[it.id].kind, msgs[it.id].html);
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + a.items.map(itemHTML).join(""); }); }
  function solve(it, x){ x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
  function miss(it, x, html){ x.tries++; msgs[it.id] = { html:"<strong>✗ Not quite.</strong> " + html }; }
  function named(list, v){ var w = (list || []).filter(function(w){ return Math.abs(w.match - v) < 1e-9; })[0]; return w ? w.fb : null; }
  function check(it){
    var x = ist(it.id), A = MV.ans(it);
    if (it.kind === "num") {
      var v = numIn(x.v);
      if (v == null) { msgs[it.id] = { kind:"", html:"Enter a number, such as 2.5." }; return; }
      if (Math.abs(v - A) < 1e-9) solve(it, x); else miss(it, x, named(it.wrong, v) || it.general);
    } else if (it.kind === "menu") {
      var n = numIn(x.v);
      if (!x.menu || n == null) { msgs[it.id] = { kind:"", html:"Choose a menu and enter a number." }; return; }
      if (x.menu !== A.menu) miss(it, x, it.wrongMenu);
      else if (Math.abs(n - A.by) < 1e-9) solve(it, x);
      else miss(it, x, it.general);
    } else {
      if (x.pick === "") { msgs[it.id] = { kind:"", html:"Choose an answer first." }; return; }
      var o = it.options[+x.pick];
      if (MV.ok(o)) solve(it, x); else miss(it, x, o.why + " Try again.");
    }
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.rin; if (!k) return; ist(k).v = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){
    var k = e.key === "Enter" && e.target.dataset && e.target.dataset.rin;
    if (k) { var b = host.querySelector('[data-k="' + k + 'chk"]'); if (b) { e.preventDefault(); b.click(); } return; }
    var c = e.target.closest && e.target.closest("[data-pick],[data-menu]"); if (!c) return;
    var d = arrowKeys(e); if (!d) return;
    e.preventDefault(); var sib = $$("button", c.parentNode), i = sib.indexOf(c), nb = sib[clamp(i + d, 0, sib.length - 1)]; if (nb && !nb.disabled) nb.click();
  });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-ri]"); if (!box) return;
    var it = byId(a.items, box.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.menu) { x.menu = b.dataset.menu; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.pick != null) { x.pick = b.dataset.pick; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") { var bx = host.querySelector('[data-ri="' + it.id + '"] input'); if (bx) x.v = bx.value; check(it); api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]')); }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Three-day cafeteria menu (@component dishTray — 8 dish chips, up to 3 on the tray, live totals
// for footprint, cost and protein, protein groups named in words) ----------
var task = (function(){
  var api = null, msg = "";
  function P3(){ return MV.C.part3; }
  function TK(){ return MV.C.task; }
  function dish(id){ return byId(P3().dishes, id); }
  function read(s){ s = s || (api && api.S) || {}; var ids = (Array.isArray(s.dishes) ? s.dishes : []).filter(dish); return { dishes:ids.slice(0, 3).sort(function(a, b){ return +a - +b; }) }; }
  function tot(d){ var f = 0, c = 0, p = 0; d.dishes.forEach(function(id){ var x = dish(id); f += x.f; c += x.cost; p += x.p; }); return { f:Math.round(f * 10) / 10, c:c, p:p }; }
  function checks(d){
    var t = tot(d), grp = d.dishes.map(function(id){ return dish(id).grp; });
    return [d.dishes.length > 0 && t.f <= 3.0 + 1e-9, d.dishes.length > 0 && t.c <= 10, t.p >= 60, grp.indexOf("animal") >= 0 && grp.indexOf("plant") >= 0, d.dishes.length === 3];
  }
  function keyOf(d){ return d.dishes.join(","); }
  function text(k){ return k.split(",").map(function(id){ var x = dish(id); return x ? MV.plain(x.t) : id; }).join(" + "); }
  function grpT(g){ return g === "animal" ? "animal protein" : "plant protein"; }
  function paint(){
    var d = read(), el = $("#cfs-tkpv"), ch = $("#cfs-tkc"); if (!el) return;
    MV.keepFocus(ch, function(){
      ch.innerHTML = '<p class="cfs-rgl">Dishes (' + d.dishes.length + ' of 3)</p><div class="cfs-chipset cfs-dchips" role="group" aria-label="Dishes, choose 3">' + P3().dishes.map(function(x){
        var on = d.dishes.indexOf(x.id) >= 0;
        return '<button type="button" data-dish="' + x.id + '" data-k="td' + x.id + '" aria-pressed="' + on + '"><span aria-hidden="true">' + (on ? "✓" : "+") + "</span> " + x.id + ". " + x.t + ' <span class="cfs-dm">' + d1(x.f) + " kg · $" + x.cost + " · " + x.p + " g · " + grpT(x.grp) + "</span></button>";
      }).join("") + '</div><p class="tiny" aria-live="polite">' + msg + "</p>";
    });
    var t = tot(d);
    el.innerHTML = '<div class="cfs-tray"><h4 class="cfs-h4">Tray <span class="hfa-model">Model data</span></h4>' + (d.dishes.length ? '<div class="tbl-wrap"><table class="cfs-ttab"><thead><tr><th scope="col">Dish</th><th scope="col">Footprint</th><th scope="col">Cost</th><th scope="col">Protein</th><th scope="col">Group</th></tr></thead><tbody>' +
      d.dishes.map(function(id){ var x = dish(id); return '<tr><th scope="row">' + x.t + ' <span class="tiny muted">(' + x.trad + ")</span></th><td>" + d1(x.f) + " kg</td><td>$" + x.cost + "</td><td>" + x.p + " g</td><td>" + grpT(x.grp) + "</td></tr>"; }).join("") +
      '</tbody><tfoot><tr><th scope="row">Total</th><td><strong>' + d1(t.f) + " kg CO₂e</strong></td><td><strong>$" + t.c + "</strong></td><td><strong>" + t.p + " g</strong></td><td></td></tr></tfoot></table></div>" : '<p class="tiny muted">The tray is empty. Tap dish chips to add them.</p>') + "</div>";
  }
  return {
    render:function(inp, pv, a){
      api = a; a.S.dishes = read(a.S).dishes;
      inp.innerHTML = '<div id="cfs-tkc"></div>';
      pv.innerHTML = '<div id="cfs-tkpv" aria-live="polite"></div>';
      $("#cfs-tkc").addEventListener("click", function(e){
        var b = e.target.closest("[data-dish]"); if (!b) return;
        var ids = read().dishes.slice(), id = b.dataset.dish, k = ids.indexOf(id);
        if (k >= 0) { ids.splice(k, 1); msg = ""; } else if (ids.length >= 3) msg = "The tray holds 3 dishes. Tap a chosen dish to remove it first."; else { ids.push(id); msg = ""; }
        a.S.dishes = ids; a.save(); paint(); a.update();
      });
      paint();
    },
    read:function(){ return read(); },
    valid:function(d){ return d.dishes.length ? true : TK().validMsg; },
    checks:checks,
    key:keyOf,
    label:function(k){ return esc(text(k)); },
    text:text
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ reason:reason },
  task:task
});
})();
