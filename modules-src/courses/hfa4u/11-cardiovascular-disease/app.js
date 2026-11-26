// HFA4U 11 Cardiovascular Disease: hero (artery storyboard), Artery and heart model (Explore: F7 risk model with persona
// chips, stepped sliders, locked non-modifiable controls, readout and artery view; Inside the artery N13 step-through;
// eating-pattern presets with culture plates), Sodium sleuth (Part 3: F3 label lab stations), Sodium budget and evidence
// (custom practice) and "Heart-smart lunch" (task). Plan wording lives in content.mjs; this file adds control labels only.
// Care note: the model is for fictional personas; nothing here asks about the student's own health.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, esc = MV.esc;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function f1(v){ return String(Math.round(v * 10) / 10); }
function byId(list, id){ return (list || []).filter(function(x){ return x.id === id; })[0]; }
function lc(s){ return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
function seg01(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function T(x, y, s, cls, anchor){ return '<text class="' + cls + '" x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '">' + s + "</text>"; }
function P(q){ return f1(q[0]) + " " + f1(q[1]); }
function TB(x, y, s, cls, anchor){
  var w = s.length * 7 + 10, x0 = anchor === "start" ? x - 5 : anchor === "end" ? x - w + 5 : x - w / 2;
  return '<rect class="cv-lbg" x="' + f1(x0) + '" y="' + f1(y - 13) + '" width="' + f1(w) + '" height="18" rx="4"/>' + T(x, y, s, cls, anchor);
}
function ptsT(n){ return n + (n === 1 ? " pt" : " pts"); }
// number typed by a student: units (%, mg, points) and spaces are ignored; null if not a single number
function gnum(s){ var t = String(s == null ? "" : s).replace(/mg|%|points?|pts?|\s/gi, ""); if (!t) return null; var r = MV.parseNum(t); return r && r.length === 1 ? r[0] : null; }
var LOCK = '<svg class="cv-ico" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.2" y="7" width="9.6" height="6.8" rx="1.2"/><path d="M5.3 7V5.2a2.7 2.7 0 0 1 5.4 0V7"/></svg>';

// ---------- @component radioGroup (copied from HFA4U 07 / 04; adds "locked": the options stay focusable with aria-disabled,
//   and a click or arrow key calls onLocked(id) instead of changing the value) ----------
//   radios(host, {label, aria, options:[{id, t, cls}], value, cls:"seg"|"chips", locked, onChange, onLocked}) -> {set, get, lock, repaint}
//   Use a fresh host for every call: it adds its listeners to host.
function radios(host, o){
  var val = String(o.value == null ? "" : o.value), locked = !!o.locked;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; });
    host.innerHTML = '<span class="cv-rgw">' + (o.label ? '<span class="cv-rgl">' + o.label + "</span>" : "") + '<span class="cv-rg ' + (o.cls === "chips" ? "cv-chipset" : "seg") + (locked ? " locked" : "") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '"' + (locked ? ' aria-disabled="true"' : "") + ">" +
      o.options.map(function(x, i){ var on = String(x.id) === val; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (on || (!any && i === 0) ? 0 : -1) + '" data-rg="' + x.id + '"' + (locked ? ' aria-disabled="true"' : "") + (x.cls ? ' class="' + x.cls + '"' : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]"); if (b) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked) { if (o.onLocked) o.onLocked(id); return; } var ch = id !== val; val = id; paint(); if (ch && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), k = ids.indexOf(val);
    choose(ids[k < 0 ? (d > 0 ? 0 : ids.length - 1) : (k + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ id = String(id == null ? "" : id); if (id !== val) { val = id; paint(); } }, get:function(){ return val; },
    lock:function(v){ if (!!v !== locked) { locked = !!v; paint(); } }, repaint:paint };
}

// ---------- @component arteryView — lengthwise section of an artery (walls in --ink-2, blood dots in --pen, plaque, fibrous
//   cap, rupture, clot with platelets). artery({x, y, w, wall, lumen, p 0..1 plaque, crack 0..1, clot 0..1, flow px offset or
//   null, labels 0 none | 1 plaque and clot | 2 all}) -> SVG markup. Shared by the hero, the model and the P2 comparison. ----------
function bumpH(x, c, a, H){ var d = Math.abs(x - c); return d >= a ? 0 : H * 0.5 * (1 + Math.cos(Math.PI * d / a)); }
function surf(cx, ax, H, base, dir, n){ var q = []; for (var i = 0; i <= n; i++) { var x = cx - ax + 2 * ax * i / n; q.push([x, base + dir * bumpH(x, cx, ax, H)]); } return q; }
function artery(o){
  var x0 = o.x, y0 = o.y, W = o.w, wl = o.wall, L = o.lumen, yt = y0 + wl, yb = yt + L, p = clamp(o.p || 0, 0, 1);
  var c = x0 + W * 0.52, a = W * 0.2, Hb = L * 0.6 * p, ct = c + W * 0.04, at = a * 0.75, Ht = L * 0.22 * p;
  var crack = clamp(o.crack || 0, 0, 1), clot = clamp(o.clot || 0, 0, 1), lab = o.labels || 0, h = "";
  var peak = yb - Hb, topY = yt + bumpH(c, ct, at, Ht), crx = a * (0.3 + 0.35 * clot), blocked = clot >= 0.98;
  h += '<rect class="cv-lumen" x="' + f1(x0) + '" y="' + f1(yt) + '" width="' + f1(W) + '" height="' + f1(L) + '"/>';
  // blood (dots ride in three lanes and squeeze past plaque; after a full clot, only the upstream ones remain, standing still)
  if (o.flow != null) {
    // n evenly spaced dots per lane, so the wrap-around never doubles a dot up
    var r = o.r || Math.max(2.2, L / 18), span = W - 2 * r - 4, nd = Math.max(1, Math.floor(span / (r * 7.2))), sp = span / nd;
    [0.2, 0.5, 0.8].forEach(function(lf, li){
      for (var k = 0; k < nd; k++) {
        var x = x0 + r + 2 + (((k * sp + li * sp * 0.37 + o.flow) % span) + span) % span;
        if (blocked && x > c - crx - r) continue;
        var yT = yt + bumpH(x, ct, at, Ht) + r + 1.5, yB = yb - bumpH(x, c, a, Hb) - r - 1.5;
        if (yB < yT) continue;
        h += '<circle class="cv-blood" cx="' + f1(x) + '" cy="' + f1(yT + lf * (yB - yT)) + '" r="' + f1(r) + '"/>';
      }
    });
  }
  if (p > 0.004) {
    var sb = surf(c, a, Hb, yb, -1, 28), stp = surf(ct, at, Ht, yt, 1, 20);
    h += '<path class="cv-plq" d="M' + sb.map(P).join("L") + 'Z"/><path class="cv-plq" d="M' + stp.map(P).join("L") + 'Z"/>';
    if (p > 0.25) {
      var gap = crack * a * 0.2;
      if (!gap) h += '<path class="cv-cap" d="M' + sb.map(P).join("L") + '"/>';
      else {
        var lft = sb.filter(function(q){ return q[0] < c - gap; }), rgt = sb.filter(function(q){ return q[0] > c + gap; });
        h += '<path class="cv-cap" d="M' + lft.map(P).join("L") + '"/><path class="cv-cap" d="M' + rgt.map(P).join("L") + '"/>';
        var e1 = lft[lft.length - 1], e2 = rgt[0];
        h += '<path class="cv-crack" d="M' + P(e1) + "l" + f1(gap * 0.5) + " 4l-" + f1(gap * 0.2) + " 4M" + P(e2) + "l-" + f1(gap * 0.5) + " 5l" + f1(gap * 0.2) + ' 3"/>';
        for (var s = 0; s < 3; s++) h += '<circle class="cv-spill" cx="' + f1(c - 3 + s * 3.5) + '" cy="' + f1(peak - 2 - crack * (4 + s * 4)) + '" r="' + f1(1.4 + crack * 1.2) + '"/>';
      }
    }
    if (lab && Hb >= 14) h += T(c, yb - Hb * 0.3 + 3, "plaque", "cv-plab");
  }
  if (clot > 0) {
    var cyTop = peak - (peak - topY) * clot, cy = (peak + cyTop) / 2, ry = Math.max(2.5, (peak - cyTop) / 2 + 2), bl = [];
    for (var i = 0; i < 18; i++) { var an = i / 18 * Math.PI * 2, wob = 1 + 0.09 * Math.sin(i * 2.7); bl.push([c + Math.cos(an) * crx * wob, cy + Math.sin(an) * ry * wob]); }
    h += '<path class="cv-clot" d="M' + bl.map(P).join("L") + 'Z"/>';
    var m = clamp(clot * 1.5, 0, 1);
    for (var j = 0; j < 7; j++) {
      var an2 = j * 0.9, ex = c + Math.cos(an2) * crx * 0.65, ey = cy + Math.sin(an2) * ry * 0.6, sx = x0 + 14 + j * W * 0.035, sy = yt + L * (0.18 + 0.1 * j);
      h += '<circle class="cv-plt" cx="' + f1(lerp(sx, ex, m)) + '" cy="' + f1(lerp(sy, ey, m)) + '" r="' + f1(Math.max(1.6, L / 30)) + '"/>';
    }
    if (lab && clot >= 0.5) h += TB(c + crx + 6, cy + 4, "clot", "cv-t", "start");
  }
  h += '<rect class="cv-wall" x="' + f1(x0) + '" y="' + f1(y0) + '" width="' + f1(W) + '" height="' + f1(wl) + '" rx="3"/>';
  h += '<rect class="cv-wall" x="' + f1(x0) + '" y="' + f1(yb) + '" width="' + f1(W) + '" height="' + f1(wl) + '" rx="3"/>';
  if (lab >= 2) h += T(x0 + 2, y0 - 5, "artery wall", "cv-ts", "start") + T(x0 + W - 2, yb + wl + 13, "blood flow →", "cv-ts", "end");
  return h;
}

// ---------- hero: decades of plaque, a rupture and a clot; then a second artery with an eating pattern + activity ----------
var HDUR = 15000;
function heroFrame(t){
  var H = MV.C.hero, h = "", slide = MV.ease(seg01(t, 0.62, 0.68)), age;
  if (t < 0.62) age = 20 + 40 * seg01(t, 0.06, 0.4); else if (t < 0.68) age = 60 - 40 * seg01(t, 0.62, 0.68); else age = 20 + 40 * seg01(t, 0.68, 0.98);
  var yA = lerp(66, 18, slide);
  h += artery({ x:20, y:yA, w:320, wall:11, lumen:56, p:0.04 + 0.86 * seg01(t, 0.06, 0.4), crack:seg01(t, 0.4, 0.46), clot:seg01(t, 0.46, 0.54),
    flow:Math.min(t, 0.54) * HDUR * 0.035, labels:t < 0.62 ? 2 : 1 });
  if (slide > 0) {
    h += '<g opacity="' + f1(slide * 100) / 100 + '"><rect class="cv-hchipb" x="20" y="108" width="176" height="20" rx="10"/>' + T(108, 122, H.chipB, "cv-hchipt") +
      artery({ x:20, y:134, w:320, wall:11, lumen:56, p:0.04 + 0.24 * seg01(t, 0.68, 0.98), flow:Math.max(0, t - 0.62) * HDUR * 0.035, labels:1 }) + "</g>";
  }
  // decades timeline
  var tx = function(a){ return 50 + (a - 20) / 40 * 260; };
  h += '<path class="cv-tl" d="M50 228H310"/>';
  [20, 40, 60].forEach(function(a){ h += '<path class="cv-tl" d="M' + f1(tx(a)) + " 223v10" + '"/>' + T(tx(a), 248, "age " + a, "cv-ts"); });
  h += '<path class="cv-tlm" d="M' + f1(tx(age) - 6) + " 212h12l-6 9Z" + '"/>';
  return h;
}
function heroStill(){
  var H = MV.C.hero, h = "", fr = function(x, y, p, crack, clot){ return artery({ x:x, y:y, w:160, wall:9, lumen:46, p:p, crack:crack, clot:clot, flow:0, labels:1 }); };
  h += T(95, 14, "Age 20", "cv-t") + T(265, 14, "Age 60", "cv-t");
  h += fr(15, 24, 0.04, 0, 0) + fr(185, 24, 0.9, 1, 1);
  h += '<rect class="cv-hchipb" x="15" y="114" width="176" height="20" rx="10"/>' + T(103, 128, H.chipB, "cv-hchipt");
  h += fr(15, 142, 0.04, 0, 0) + fr(185, 142, 0.28, 0, 0);
  return h;
}
function hero(f){
  var host = $("#cv-hero"); if (!host) return;
  var H = MV.C.hero, rm = MV.reduceMotion;
  host.innerHTML = '<ul class="cv-hchips" aria-label="Key links">' + H.chips.map(function(c){ return '<li class="cv-hchip ' + c.id + '">' + c.t + "</li>"; }).join("") + "</ul>" +
    '<svg class="cv-hsvg" viewBox="0 0 360 ' + (rm ? 214 : 256) + '" role="img" aria-label="' + esc(rm ? H.rmAria : H.aria) + '"></svg>' +
    (rm ? "" : '<div class="cv-hrow"><button type="button" class="btn ghost sm" id="cv-replay" disabled>Replay</button></div>');
  var svg = $("svg", host), cap = function(s){ if (f.cap && f.cap.textContent !== s) f.cap.textContent = s; };
  if (rm) { svg.innerHTML = heroStill(); cap(H.caption); return; }
  var btn = $("#cv-replay", host), stop = null;
  function play(){
    if (stop) stop(); btn.disabled = true;
    svg.innerHTML = heroFrame(0); cap(H.caps.start);
    stop = MV.tween({ dur:HDUR, ease:function(t){ return t; }, step:function(t){
      svg.innerHTML = heroFrame(t);
      cap(t < 0.06 ? H.caps.start : t < 0.4 ? H.caps.grow : t < 0.68 ? H.caption : H.caps.second);
    }, done:function(){ stop = null; btn.disabled = false; } });
  }
  btn.addEventListener("click", play);
  svg.innerHTML = heroFrame(0); cap(H.caps.start);
  MV.wait(600, play);
}

// ---------- Inside the artery (N13 step-through): five schematic frames of one patch of wall ----------
function insideSVG(i, sub){
  var h = "", dome = i >= 2 ? 1 : 0, rup = i >= 3, clot = i === 4 ? clamp(sub == null ? 1 : sub, 0, 1) : 0;
  function domeY(x){ return 100 - bumpH(x, 180, 88, 48 * dome); }
  var surfQ = []; for (var k = 0; k <= 40; k++) { var x = 60 + k * 6; surfQ.push([x, domeY(x)]); }
  var LDLP = [[60, 40], [110, 70], [250, 34], [300, 78], [176, 92], [182, 112], [186, 132]];
  h += '<rect class="cv-lumen" x="0" y="14" width="360" height="92"/><rect class="cv-wsoft" x="0" y="100" width="360" height="86"/>';
  // blood dots (static), squeezed above the dome; gone downstream of a finished clot
  [0.22, 0.52, 0.82].forEach(function(lf, li){
    for (var n = 0; n < 15; n++) {
      var x = 10 + n * 24 + li * 8; if (x > 352) continue;
      if (clot >= 0.98 && x > 150) continue;
      var yT = 20, yB = domeY(x) - 6; if (yB - yT < 6) continue;
      var y = yT + lf * (yB - yT);
      if (i === 0 && LDLP.some(function(q){ return Math.abs(q[0] - x) < 13 && Math.abs(q[1] - y) < 13; })) continue;
      if (i === 0 && x < 92 && y < 34) continue;
      h += '<circle class="cv-blood" cx="' + f1(x) + '" cy="' + f1(y) + '" r="3.6"/>';
    }
  });
  // plaque core under the dome
  if (dome) h += '<path class="cv-plq" d="M' + surfQ.map(P).join("L") + "L300 100C260 156 100 156 60 100Z" + '"/>';
  // foam cells (immune cells full of cholesterol)
  if (i >= 1) [[150, 138], [204, 148], [178, 118]].slice(0, i === 1 ? 2 : 3).forEach(function(q){
    h += '<circle class="cv-foam" cx="' + q[0] + '" cy="' + q[1] + '" r="13"/>';
    for (var d = 0; d < 5; d++) h += '<circle class="cv-ldl" cx="' + f1(q[0] + Math.cos(d * 1.3) * 6.5) + '" cy="' + f1(q[1] + Math.sin(d * 1.3) * 6.5) + '" r="2.6"/>';
  });
  // the lining (with a damaged patch at first), then the fibrous cap
  var gapA = i === 0 ? [168, 192] : rup ? [172, 188] : null;
  var segL = surfQ.filter(function(q){ return !gapA || q[0] <= gapA[0]; }), segR = surfQ.filter(function(q){ return gapA && q[0] >= gapA[1]; });
  h += '<path class="cv-lining" d="M0 100H60L' + segL.map(P).join("L") + '"/>' + (gapA ? '<path class="cv-lining" d="M' + segR.map(P).join("L") + 'L360 100"/>' : "") + (gapA ? "" : '<path class="cv-lining" d="M300 100H360"/>');
  if (dome) {
    var capL = surfQ.filter(function(q){ return q[0] >= 96 && (!rup || q[0] <= 172); }), capR = rup ? surfQ.filter(function(q){ return q[0] >= 188 && q[0] <= 264; }) : [];
    h += '<path class="cv-cap" d="M' + capL.map(P).join("L") + '"/>' + (capR.length ? '<path class="cv-cap" d="M' + capR.map(P).join("L") + '"/>' : "");
  }
  if (i === 0) {
    LDLP.forEach(function(q){ h += '<circle class="cv-ldlp" cx="' + q[0] + '" cy="' + q[1] + '" r="5.5"/>'; });
    h += '<path class="cv-crack" d="M168 100l-3-5l4-3M192 100l3-5l-4-3"/>' + TB(60, 28, "LDL", "cv-t") + T(180, 168, "damaged lining", "cv-ts");
  }
  if (i === 1) h += T(250, 172, "foam cells", "cv-t", "start");
  if (i === 2) h += T(180, 92, "plaque", "cv-plab") + '<path class="cv-lead" d="M262 124L240 93"/>' + T(266, 130, "fibrous cap", "cv-t", "start");
  if (rup) for (var s = 0; s < 4; s++) h += '<circle class="cv-spill" cx="' + (174 + s * 4) + '" cy="' + (46 - s * 5) + '" r="2.4"/>';
  if (i === 3) h += TB(200, 34, "rupture", "cv-t", "start");
  if (clot > 0) {
    var top = 52 - 38 * clot, cy = (52 + top) / 2 + 2, ry = (52 - top) / 2 + 6, rx = 26 + 16 * clot, bl = [];
    for (var j = 0; j < 18; j++) { var an = j / 18 * Math.PI * 2, wob = 1 + 0.08 * Math.sin(j * 2.3); bl.push([180 + Math.cos(an) * rx * wob, cy + Math.sin(an) * ry * wob]); }
    h += '<path class="cv-clot" d="M' + bl.map(P).join("L") + 'Z"/>';
    for (var pl = 0; pl < 8; pl++) { var m = clamp(clot * 1.4, 0, 1); h += '<circle class="cv-plt" cx="' + f1(lerp(30 + pl * 12, 180 + Math.cos(pl) * rx * 0.6, m)) + '" cy="' + f1(lerp(30 + (pl % 3) * 16, cy + Math.sin(pl) * ry * 0.55, m)) + '" r="2.6"/>'; }
    if (clot >= 0.6) h += TB(180 + rx + 8, 32, "clot", "cv-t", "start") + TB(300, 84, "flow blocked", "cv-ts");
  }
  h += '<rect class="cv-wall" x="0" y="0" width="360" height="14"/><rect class="cv-wall" x="0" y="186" width="360" height="18"/>';
  return h;
}

// ---------- Explore: Artery and heart model (@component F7 riskModel — population teaching model for fictional personas) ----------
function explore(host, api){
  var D = api.content, S = api.S, CH = D.challenges;
  var MODK = ["na", "sf", "fi", "act", "smk"], NONK = ["age", "fam"], FK = MODK.concat(NONK);
  var P0 = {}; D.personas.forEach(function(p){ P0[p.id] = p.s; });
  if (!byId(D.modes, S.mode)) S.mode = "model";
  if (!P0[S.per]) S.per = "marlon";
  S.ps = S.ps || {}; D.personas.forEach(function(p){ var s = S.ps[p.id]; if (!s || FK.some(function(k){ return typeof s[k] !== "number"; })) S.ps[p.id] = clone(p.s); });
  S.step = clamp(S.step || 0, 0, D.steps.length - 1);
  var fx = { cmp:null, hl:null, tried:false, last:null }, busy = false, anim = null, artAnim = null, artP = null, pend = null, player = null;
  function st(){ return S.ps[S.per]; }
  function fac(k){ return byId(D.factors, k); }
  function score(s){
    var p = {}; FK.forEach(function(k){ p[k] = fac(k).pts[s[k]]; });
    p.eat = p.na + p.sf + p.fi; p.mod = p.eat + p.act + p.smk; p.non = p.age + p.fam; p.index = p.mod + p.non; p.bp = p.na + p.act; p.ldl = p.sf + p.fi;
    return p;
  }
  function band(list, v){ for (var i = 0; i < list.length; i++) if (v <= list[i].max) return { i:i, t:list[i].t }; return { i:list.length - 1, t:list[list.length - 1].t }; }
  function valT(k, i){ var f = fac(k); return f.fmt.replace("{v}", f.levels[i]); }
  var PV = [0.05, 0.32, 0.6, 0.86];
  var ARROW = { bp:["→", "↑", "↑↑"], ldl:["↓", "→", "↑"] };

  // ----- layout -----
  var about = '<details class="alg cv-about"><summary>About this model</summary><div class="tbl-wrap"><table class="vt cv-ptab"><caption class="vh">Points per factor</caption><thead><tr><th scope="col">Factor</th><th scope="col">0 points</th><th scope="col">1 point</th><th scope="col">2 points</th></tr></thead><tbody>' +
    D.factors.map(function(f){ return '<tr><th scope="row">' + (f.short || f.t) + "</th>" + [0, 1, 2].map(function(n){ var v = f.levels.filter(function(_, i){ return f.pts[i] === n; }); return "<td>" + (v.length ? v.join(", ") : "—") + "</td>"; }).join("") + "</tr>"; }).join("") +
    "</tbody></table></div><ul class=\"cv-rules\">" + D.rules.map(function(r){ return "<li>" + r + "</li>"; }).join("") + "</ul><p class=\"tiny muted\">" + D.reminder + "</p></details>";
  host.innerHTML = '<fieldset class="cv-fs cv-modes" id="cv-modes-fs"><legend class="vh">Model mode</legend><div id="cv-modes"></div></fieldset>' +
    '<div class="cv-lab">' +
      '<div class="cv-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
        '<div id="cv-mview"><div class="cv-art" id="cv-art"></div><div class="cv-ibar" id="cv-ibar" aria-hidden="true"></div><div class="cv-cmp" id="cv-cmp" hidden></div></div>' +
        '<div id="cv-iview" hidden><div class="cv-art" id="cv-isvg"></div><p class="cv-istep" id="cv-istep" aria-live="polite"></p><fieldset class="cv-fs" id="cv-pl-fs"><legend class="vh">Step through the five steps</legend><div id="cv-player"></div></fieldset></div>' +
      "</div>" +
      '<div class="cv-side">' +
        '<div id="cv-rside"><h4 class="cv-h4">Readout</h4><dl class="read cv-read" id="cv-read" aria-live="polite"></dl><button type="button" class="btn ghost sm cv-allbtn" id="cv-allbtn" aria-expanded="false" aria-controls="cv-read">Show all</button></div>' +
        '<div id="cv-iside" hidden><h4 class="cv-h4">Five steps</h4><ol class="cv-isteps" id="cv-isteps"></ol></div>' +
        '<p class="cv-remind" role="note"><span aria-hidden="true">ⓘ </span>' + D.reminder + "</p>" +
      "</div>" +
      '<fieldset class="cv-fs cv-ctrl" id="cv-ctrl"><legend class="vh">Model controls</legend>' +
        '<div class="cv-presets" id="cv-presets" hidden></div>' +
        '<div id="cv-per"></div><p class="cv-prof" id="cv-prof"></p>' +
        '<div class="cv-groups">' + D.groups.map(function(g){
          return '<div class="cv-g ' + g.id + '" role="group" aria-labelledby="cv-gh-' + g.id + '"><h5 class="cv-gh" id="cv-gh-' + g.id + '">' + (g.id === "non" ? LOCK : "") + g.t + ' <span class="cv-gtag">(' + g.tag + ")</span></h5>" +
            D.factors.filter(function(f){ return f.group === g.id; }).map(function(f){ return f.levels.length > 2 && f.group !== "non" ? sliderHTML(f) : '<div class="cv-rrow"><div id="cv-r-' + f.id + '"></div><span class="cv-pt" id="cv-rp-' + f.id + '"></span></div>'; }).join("") + "</div>";
        }).join("") + "</div>" +
        '<div class="cv-crow"><button type="button" class="btn ghost sm" id="cv-reset">Reset this persona</button><span class="cv-lockmsg" id="cv-lockmsg" aria-live="polite"></span></div>' +
      "</fieldset>" +
    "</div>" + about;
  function sliderHTML(f){
    return '<div class="cv-sl"><div class="cv-slt"><label for="cv-sl-' + f.id + '">' + f.t + (f.unit ? ' <span class="cv-u">(' + f.unit + ")</span>" : "") + '</label><output id="cv-so-' + f.id + '" for="cv-sl-' + f.id + '"></output></div>' +
      (f.sub ? '<p class="cv-sub">' + f.sub + "</p>" : "") +
      '<input type="range" class="cv-range" id="cv-sl-' + f.id + '" data-f="' + f.id + '" min="0" max="' + (f.levels.length - 1) + '" step="1" value="0">' +
      '<div class="cv-ticks" aria-hidden="true">' + f.levels.map(function(l){ return "<span>" + l + "</span>"; }).join("") + "</div></div>";
  }

  // ----- controls -----
  var modeRg = radios($("#cv-modes", host), { label:"Mode", options:D.modes, value:S.mode, cls:"seg", onChange:function(v){ if (busy) return; S.mode = v; fx.cmp = null; fx.hl = null; api.save(); paintAll(); } });
  var perRg = radios($("#cv-per", host), { label:"Persona", options:D.personas.map(function(p){ return { id:p.id, t:p.t }; }), value:S.per, cls:"chips",
    onChange:function(v){ if (busy) return; S.per = v; fx.cmp = null; fx.hl = null; fx.tried = false; $("#cv-lockmsg", host).textContent = ""; api.save(); paintAll(); } });
  var rg = {};
  ["smk", "age", "fam"].forEach(function(k){
    var f = fac(k);
    rg[k] = radios($("#cv-r-" + k, host), { label:f.short || f.t, aria:f.t, options:f.levels.map(function(l, i){ return { id:String(i), t:l }; }), value:"0", cls:"seg",
      onChange:function(v){ setVal(k, +v); },
      onLocked:function(){ lockMsg(k); } });
  });
  function lockMsg(k){
    if (busy) return;
    var tc2 = S.per === "agnieszka" && k === "age";
    if (tc2) fx.tried = true;
    $("#cv-lockmsg", host).innerHTML = LOCK + (tc2 ? byId(CH, "tc2").msgs.age : D.lockNote);
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.f; if (!k || busy) return; setVal(k, +e.target.value); });
  $("#cv-reset", host).addEventListener("click", function(){ if (busy) return; S.ps[S.per] = clone(P0[S.per]); fx.cmp = null; fx.hl = null; api.save(); paintAll(); });
  $("#cv-allbtn", host).addEventListener("click", function(){ S.all = !S.all; api.save(); paintRead(); });
  function setVal(k, v){
    var s = st(); if (s[k] === v) return;
    if (NONK.indexOf(k) >= 0 && S.per !== "free") { lockMsg(k); paintControls(); return; }
    s[k] = v; fx.cmp = null; fx.hl = null; api.save(); paintModel(true);
  }

  // ----- presets -----
  function presetMatch(s){ return D.presets.filter(function(pr){ return ["na", "sf", "fi"].every(function(k){ return pr.set[k] === s[k]; }); })[0]; }
  $("#cv-presets", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-pre]"); if (!b || busy) return;
    var pr = byId(D.presets, b.dataset.pre), s = st();
    ["na", "sf", "fi"].forEach(function(k){ s[k] = pr.set[k]; });
    S.preset = pr.id; fx.cmp = null; fx.hl = null; api.save(); paintModel(true);
  });
  function paintPresets(){
    var box = $("#cv-presets", host), s = st(), m = presetMatch(s), show = byId(D.presets, S.preset) || m || D.presets[0];
    MV.keepFocus(box, function(){
      box.innerHTML = '<h5 class="cv-gh">Eating-pattern presets</h5><div class="cv-prow" role="group" aria-label="Eating-pattern presets">' + D.presets.map(function(pr){
        return '<button type="button" class="cv-pbtn" data-pre="' + pr.id + '" data-k="pre' + pr.id + '" aria-pressed="' + (m === pr) + '">' + pr.t + "</button>";
      }).join("") + "</div>" +
        '<div class="cv-ppanel"><p><strong>' + show.t + ":</strong> " + show.foods + "</p>" +
        (show.plates ? "<p>" + D.flexible + '</p><ul class="cv-plates">' + show.plates.map(function(pl){ return "<li><strong>" + pl.t + ":</strong> " + pl.d + "</li>"; }).join("") + "</ul>" : "") +
        '<p class="tiny muted">Sets sodium ' + valT("na", show.set.na) + ", saturated fat " + valT("sf", show.set.sf) + ", fibre-rich foods: " + valT("fi", show.set.fi) + ".</p></div>";
    });
  }

  // ----- painting -----
  function paintControls(){
    var s = st(), pers = S.per !== "free";
    ["na", "sf", "fi", "act"].forEach(function(k){
      var el = $("#cv-sl-" + k, host); if (+el.value !== s[k]) el.value = s[k];
      el.setAttribute("aria-valuetext", valT(k, s[k]) + ", " + ptsT(fac(k).pts[s[k]]));
      $("#cv-so-" + k, host).innerHTML = valT(k, s[k]) + ' <span class="cv-pt">' + ptsT(fac(k).pts[s[k]]) + "</span>";
    });
    ["smk", "age", "fam"].forEach(function(k){
      rg[k].set(String(s[k])); rg[k].lock(NONK.indexOf(k) >= 0 && pers);
      $("#cv-rp-" + k, host).textContent = ptsT(fac(k).pts[s[k]]);
    });
    perRg.set(S.per); modeRg.set(S.mode);
    var g = $(".cv-g.non", host); g.classList.toggle("locked", pers);
    // Free mode restates the plan's M5 line: the model is for fictional personas, never a self-assessment
    $("#cv-prof", host).innerHTML = pers ? "Fictional persona · age band " + fac("age").levels[s.age] + " · family history of early heart disease: " + fac("fam").levels[s.fam]
      : "<strong>Free mode:</strong> every control is open. " + D.freeNote;
  }
  function paintRead(){
    var s = st(), p = score(s), bp = band(D.bands.bp, p.bp), ldl = band(D.bands.ldl, p.ldl), vw = band(D.bands.view, p.index);
    var rows = [
      ["index", "Index", '<strong class="cv-big">' + p.index + "</strong> <span class=\"muted\">of 13</span>"],
      ["mod", "Modifiable points", p.mod + ' <span class="muted tiny">(sodium + sat. fat + fibre + activity + smoking)</span>', 1],
      ["non", "Non-modifiable points", p.non + ' <span class="muted tiny">(age + family history)</span>', 1],
      ["bp", "Blood-pressure trend", '<span class="cv-arr" aria-hidden="true">' + ARROW.bp[bp.i] + "</span> " + bp.t + " (" + p.bp + ")"],
      ["ldl", "LDL trend", '<span class="cv-arr" aria-hidden="true">' + ARROW.ldl[ldl.i] + "</span> " + ldl.t + " (" + p.ldl + ")"],
      ["view", "Artery view", vw.t, 1]
    ];
    var last = fx.last, now = { index:p.index, mod:p.mod, non:p.non, bp:p.bp, ldl:p.ldl, view:vw.i };
    var el = $("#cv-read", host);
    el.classList.toggle("all", !!S.all);
    el.innerHTML = rows.map(function(r){ var ch = last && last[r[0]] !== now[r[0]]; return '<div class="' + (r[3] ? "cv-more" : "") + (ch ? " cv-chg" : "") + (fx.hl === r[0] ? " cv-hl" : "") + '" data-r="' + r[0] + '"><dt>' + r[1] + "</dt><dd>" + r[2] + "</dd></div>"; }).join("");
    fx.last = now;
    var b = $("#cv-allbtn", host); b.textContent = S.all ? "Show less" : "Show all"; b.setAttribute("aria-expanded", String(!!S.all));
    return { p:p, vw:vw };
  }
  function artSVG(pv, s, p, vw){
    return '<svg class="cv-asvg" viewBox="0 0 360 150" role="img" aria-label="' + esc("Artery view for " + (S.per === "free" ? "Free mode" : byId(D.personas, S.per).t) + ": " + vw.t + ". Index " + p.index + ".") + '">' + artery({ x:8, y:16, w:344, wall:14, lumen:88, p:pv, flow:0, labels:2 }) + "</svg>";
  }
  function paintArt(animate){
    var s = st(), p = score(s), vw = band(D.bands.view, p.index), to = PV[vw.i], box = $("#cv-art", host);
    if (artAnim) { artAnim(); artAnim = null; }
    var from = artP == null ? to : artP;
    if (!animate || Math.abs(from - to) < 1e-3) { artP = to; box.innerHTML = artSVG(to, s, p, vw); }
    else artAnim = MV.tween({ dur:500, step:function(t){ artP = lerp(from, to, t); box.innerHTML = artSVG(artP, s, p, vw); }, done:function(){ artAnim = null; artP = to; } });
    // index bar: non-modifiable floor first (hatched, --risk-fixed), then modifiable points (blue)
    var cells = ""; for (var i = 0; i < 13; i++) cells += '<span class="cv-cell' + (i < p.non ? " non" : i < p.index ? " mod" : "") + '"></span>';
    $("#cv-ibar", host).innerHTML = '<div class="cv-ibt"><span><strong>Index ' + p.index + "</strong> of 13</span>" + '<span class="cv-leg"><i class="cv-sw non"></i>non-modifiable ' + p.non + ' <i class="cv-sw mod"></i>modifiable ' + p.mod + "</span></div>" +
      '<div class="cv-cells">' + cells + '</div><div class="cv-bands">' + D.bands.view.map(function(b, i){ return '<span class="' + (i === vw.i ? "on" : "") + '">' + b.t + "</span>"; }).join("") + "</div>";
  }
  function paintCmp(k){
    var box = $("#cv-cmp", host);
    if (!fx.cmp) { box.hidden = true; box.innerHTML = ""; return; }
    var c = fx.cmp, a = score(c.a), b = score(c.b), va = band(D.bands.view, a.index), vb = band(D.bands.view, b.index), pb = lerp(PV[va.i], PV[vb.i], k), ib = Math.round(lerp(a.index, b.index, k));
    function panel(t, idx, pv, extra){ return '<div class="cv-cpan"><p class="cv-ct">' + t + '</p><svg viewBox="0 0 170 76" role="img" aria-label="' + esc(MV.plain(t) + ": index " + idx) + '">' + artery({ x:5, y:8, w:160, wall:8, lumen:46, p:pv, flow:0, labels:0 }) + '</svg><p class="cv-ci">Index <strong>' + idx + "</strong>" + (extra || "") + "</p></div>"; }
    box.hidden = false;
    box.innerHTML = '<p class="cv-ch">Same eating pattern, two settings</p><div class="cv-cpans">' + panel("20s, no family history", a.index, PV[va.i]) + panel("60s, family history", ib, pb, k >= 1 ? ' <span class="cv-plus">+' + (b.index - a.index) + "</span>" : "") + "</div>";
  }
  function paintInside(i, sub){
    $("#cv-isvg", host).innerHTML = '<svg class="cv-isvgel" viewBox="0 0 360 204" role="img" aria-label="' + esc("Inside the artery, step " + (i + 1) + ": " + MV.plain(D.steps[i])) + '">' + insideSVG(i, sub) + "</svg>";
    $("#cv-istep", host).innerHTML = "<strong>Step " + (i + 1) + ":</strong> " + D.steps[i];
    $("#cv-isteps", host).innerHTML = D.steps.map(function(t, k){ return '<li class="' + (k === i ? "on" : k < i ? "past" : "") + '"' + (k === i ? ' aria-current="step"' : "") + ">" + t + "</li>"; }).join("");
  }
  function paintModel(animate){ paintControls(); var r = paintRead(); paintArt(animate); paintCmp(1); if (S.mode === "presets") paintPresets(); api.changed(); return r; }
  function paintAll(){
    var ins = S.mode === "inside";
    $("#cv-mview", host).hidden = ins; $("#cv-rside", host).hidden = ins; $("#cv-ctrl", host).hidden = ins;
    $("#cv-iview", host).hidden = !ins; $("#cv-iside", host).hidden = !ins;
    $("#cv-presets", host).hidden = S.mode !== "presets";
    modeRg.set(S.mode);
    if (ins) paintInside(S.step, 1);
    paintModel(false);
  }
  function setBusy(v){ busy = v; ["#cv-ctrl", "#cv-modes-fs", "#cv-pl-fs"].forEach(function(id){ $(id, host).disabled = v; }); }

  // player (created once: MV.player adds listeners to its host)
  var saved = S.step;
  player = MV.player($("#cv-player", host), { count:D.steps.length, interval:2200, label:function(i){ return "Step " + (i + 1) + " of " + D.steps.length; },
    render:function(i){ S.step = i; api.save(); paintInside(i, 1); } });
  player.go(saved);
  paintAll();

  // ----- target challenges (plan's exact tests and named wrong states) -----
  function test(id, live){
    var c = byId(CH, id), m = c.msgs, s = st(), p = score(s), fmt = function(t){ return t.replace("{n}", p.index); };
    if (id === "tc1") {
      if (S.per !== "marlon") return { ok:false, msg:m.persona };
      var s0 = P0.marlon;
      if (s.act !== s0.act) return { ok:false, msg:m.activity };
      if (s.smk !== s0.smk) return { ok:false, msg:m.smoking };
      if (p.index <= 4) return { ok:true };
      return { ok:false, msg:p.index === 5 ? m.five : fmt(m.general) };
    }
    if (id === "tc2") {
      if (S.per !== "agnieszka") return { ok:false, msg:m.persona };
      if (p.index === 3) { if (!live) api.banner("good", "✓ " + MV.plain(c.why)); return { ok:true }; }
      if (!live && fx.tried) { fx.tried = false; return { ok:false, msg:m.age }; }
      return { ok:false, msg:p.index === 4 ? m.four : fmt(m.general) };
    }
    if (id === "tc3") {
      if (S.per !== "jordan") return { ok:false, msg:m.persona };
      var j0 = P0.jordan, ch = MODK.filter(function(k){ return s[k] !== j0[k]; });
      if (ch.length === 2 && p.index <= 3) return { ok:true };
      if (ch.length >= 3) return { ok:false, msg:p.index <= 3 ? m.three : fmt(m.general) };
      if (ch.length === 2) {
        if (ch.indexOf("na") >= 0) return { ok:false, msg:m.sodium };
        if (ch.indexOf("sf") >= 0 && fac("sf").levels[s.sf] === "14") return { ok:false, msg:m.sat14 };
        return { ok:false, msg:fmt(m.general) };
      }
      return { ok:false, msg:m.count.replace("{n}", ch.length) };
    }
    return { ok:false };
  }

  // ----- predictions -----
  function cancelAll(){ if (anim) { anim(); anim = null; } }
  function finish(){ anim = null; setBusy(false); var d = pend; pend = null; if (d) d(); }
  function reveal(el){ var r = el && el.getBoundingClientRect(); if (r && (r.top < 110 || r.bottom > window.innerHeight)) el.scrollIntoView({ block:"center", behavior:MV.reduceMotion ? "auto" : "smooth" }); }
  // step a factor through its levels one notch at a time (each notch redraws the model)
  function walk(k, to, dur, after){
    var s = st(), from = s[k], n = Math.abs(to - from), dir = to > from ? 1 : -1, done = 0;
    anim = MV.tween({ dur:dur, ease:function(t){ return t; }, step:function(t){
      var want = Math.min(n, Math.floor(t * n + 1e-9)); if (t >= 1) want = n;
      while (done < want) { done++; s[k] = from + dir * done; paintModel(true); }
    }, done:function(){ api.save(); after(); } });
  }
  return {
    predict:{
      start:function(p){
        cancelAll(); setBusy(true); fx.hl = null; fx.cmp = null; fx.last = null;
        if (p.id === "p4") { S.mode = "inside"; api.save(); paintAll(); player.go(2); return; }
        S.mode = "model"; S.per = p.persona; S.ps[p.persona] = clone(P0[p.persona]); api.save(); paintAll();
      },
      run:function(p, done){
        pend = done;
        try {
          if (p.id === "p1") { reveal($("#cv-read", host)); walk("na", 1, 1800, function(){ fx.hl = "bp"; fx.last = null; paintModel(false); finish(); }); return; }
          if (p.id === "p3") { reveal($("#cv-read", host)); walk("sf", 1, 1400, function(){ fx.hl = "ldl"; fx.last = null; paintModel(false); finish(); }); return; }
          if (p.id === "p2") {
            var s = st(); fx.cmp = { a:clone(s), b:Object.assign(clone(s), { age:2, fam:1 }) };
            paintCmp(0); reveal($("#cv-cmp", host));
            anim = MV.tween({ dur:2000, step:function(t){ paintCmp(t); }, done:function(){ paintCmp(1); finish(); } });
            return;
          }
          if (p.id === "p4") {
            reveal($("#cv-isvg", host));
            player.go(3);
            anim = MV.tween({ dur:2600, ease:function(t){ return t; }, step:function(t){ if (t >= 0.35) paintInside(4, seg01(t, 0.35, 1)); }, done:function(){ player.go(4); finish(); } });
            return;
          }
          finish();
        } catch (e) { console.error(e); finish(); }
      }
    },
    challenge:function(id, opt){ return test(id, opt && opt.live); }
  };
}

// ---------- Part 3: Sodium sleuth (@component F3 labelLab — tappable sodium lines with a %DV sort, a sodium-source bar with
//   "Check it with data", a swap lab with a live total, a potassium panel and a teacher slot for real labels) ----------
function part3(host, api){
  var D = api.content, S = api.S, DV = D.dv;
  S.sorted = S.sorted || {}; S.sw = S.sw || {}; S.q = S.q || {};
  var sel = null, msg1 = "";
  host.innerHTML = '<div class="cv-st" id="cv-st1"></div><div class="cv-st" id="cv-st2"></div><div class="cv-st" id="cv-st3"></div><div class="cv-st" id="cv-st4"></div>';
  function level(dv){ var l = MV.nutri.dvLevel(dv); return l === "a little" ? "little" : l === "a lot" ? "lot" : "between"; }
  function lvT(id){ return byId(D.st1.levels, id).t; }

  // Station 1: hidden sodium
  var A = D.st1, s1 = $("#cv-st1", host);
  s1.innerHTML = "<h3>" + A.title + "</h3><p>" + A.intro + '</p><div class="cv-labels" id="cv-labels"></div><p class="tiny muted"><span class="hfa-model">Model data</span> Only the sodium line of each label is shown.</p><div id="cv-s1fb" aria-live="polite"></div><div id="cv-s1done"></div>' +
    '<details class="alg cv-real"><summary>' + A.real.title + '</summary><p class="tiny" style="margin-top:10px">' + A.real.intro + '</p><div class="cv-rin"><label>Add a photo<input type="file" accept="image/*" id="cv-rimg"></label><label>Product and brand<input type="text" class="txtin" id="cv-rsrc" autocomplete="off"></label></div><figure class="cv-rfig" id="cv-rfig" hidden><img alt=""><figcaption id="cv-rcr"></figcaption></figure></details>';
  function paint1(){
    var box = $("#cv-labels", s1);
    MV.keepFocus(box, function(){
      box.innerHTML = A.labels.map(function(L){
        var done = S.sorted[L.id], on = sel === L.id;
        var h = '<div class="cv-lcard' + (done ? " done" : "") + '"><p class="cv-lname">' + L.t + "</p>" +
          '<table class="hfa-nft cv-nft"><caption>Nutrition Facts</caption><thead><tr><th scope="col">Per ' + L.serving + '</th><th scope="col">% Daily Value*</th></tr></thead><tbody>' +
          '<tr class="' + (on || done ? "hi" : "") + '"><th scope="row"><button type="button" class="cv-naline" data-nl="' + L.id + '" data-k="nl' + L.id + '" aria-pressed="' + on + '"' + (done ? " disabled" : "") + ">Sodium " + L.mg + " mg</button></th><td>" + L.dv + " %</td></tr>" +
          '</tbody><tfoot><tr><td colspan="2">*5% or less is a little, 15% or more is a lot</td></tr></tfoot></table>';
        if (done) h += '<p class="cv-lres"><span aria-hidden="true">✓ </span>' + L.dv + "%: <strong>" + lvT(done) + "</strong></p>";
        else if (on) h += '<div class="cv-lvl" role="group" aria-label="' + esc("Sort " + L.t) + '">' + A.levels.map(function(v){ return '<button type="button" class="chip" data-lv="' + v.id + '" data-k="lv' + L.id + v.id + '">' + v.t + "</button>"; }).join("") + "</div>";
        return h + "</div>";
      }).join("");
    });
    $("#cv-s1fb", s1).innerHTML = msg1;
    var n = A.labels.filter(function(L){ return S.sorted[L.id]; }).length;
    $("#cv-s1done", s1).innerHTML = n === A.labels.length ? '<div class="refresh"><p>' + A.done + "</p></div>" : '<p class="tiny muted">Sorted: ' + n + " of " + A.labels.length + "</p>";
  }
  s1.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.nl) { sel = sel === b.dataset.nl ? null : b.dataset.nl; msg1 = ""; paint1(); var c = s1.querySelector('[data-k="lv' + sel + 'little"]'); if (c) c.focus({ preventScroll:true }); return; }
    if (b.dataset.lv && sel) {
      var L = byId(A.labels, sel), want = level(L.dv);
      if (b.dataset.lv === want) { S.sorted[L.id] = want; msg1 = MV.fbHTML("good", "<strong>✓ " + L.t + ": " + L.dv + "% is " + lvT(want) + ".</strong> " + (want === "lot" ? "15% or more is a lot." : want === "little" ? "5% or less is a little." : "It’s above 5% and below 15%.")); sel = null; api.save(); paint1(); MV.focusFb(s1); }
      else { msg1 = MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + L.dv + "%: compare it with the guide. 5% or less is a little; 15% or more is a lot; anything else is between."); paint1(); }
    }
  });
  paint1();
  // teacher slot: photo shown in memory only; the source line saves on this device
  S.real = S.real || "";
  var rs = $("#cv-rsrc", s1); rs.value = S.real;
  function credit(){ $("#cv-rcr", s1).textContent = (S.real || "(add the product and brand)") + ". " + A.real.credit; }
  rs.addEventListener("input", function(){ S.real = rs.value; api.save(); credit(); });
  $("#cv-rimg", s1).addEventListener("change", function(e){
    var t = e.target; if (!t.files || !t.files[0] || !window.FileReader) return;
    var r = new FileReader();
    r.onload = function(){ var fig = $("#cv-rfig", s1), img = $("img", fig); img.src = r.result; img.alt = "Photo of a real label added by the teacher"; fig.hidden = false; credit(); };
    r.readAsDataURL(t.files[0]);
  });

  // Station 2: where sodium comes from
  var B = D.st2, s2 = $("#cv-st2", host);
  s2.innerHTML = "<h3>" + B.title + "</h3><p>" + B.intro + '</p><div id="cv-srcbar"></div><div class="q-actions"><button type="button" class="btn ghost sm" id="cv-shaker" aria-pressed="false">' + B.toggle + '</button></div><p class="tiny muted"><span class="hfa-model">Model data</span> Illustrative shares.</p>' +
    '<details class="alg" id="cv-cdata"><summary>Check it with data</summary><p style="margin-top:10px"><strong>' + B.question + '</strong></p><p class="cv-ql">Which bar shrinks?</p><div class="cv-qchips" id="cv-qchips"></div>' +
    '<div class="numrow"><label for="cv-qrem">' + B.remain.label + ':</label><input class="numin" id="cv-qrem" type="text" inputmode="decimal" autocomplete="off"><span class="m">' + B.remain.unit + '</span></div><div class="q-actions"><button type="button" class="btn primary sm" id="cv-qchk">Check</button></div><div id="cv-qfb" aria-live="polite"></div></details>';
  function paint2(){
    var off = !!S.shaker;
    $("#cv-srcbar", s2).innerHTML = '<div class="cv-sbar" role="img" aria-label="' + esc("Sources of sodium: " + B.sources.map(function(x){ return x.t + " " + (off && x.id === "home" ? 0 : x.pct) + "%"; }).join(", ")) + '">' +
      B.sources.map(function(x){ var w = off && x.id === "home" ? 0 : x.pct; return '<span class="cv-sseg ' + x.id + '" style="width:' + w + '%"></span>'; }).join("") + "</div>" +
      '<ul class="cv-sleg">' + B.sources.map(function(x){ var gone = off && x.id === "home"; return '<li class="' + (gone ? "gone" : "") + '"><i class="cv-sw2 ' + x.id + '"></i>' + x.t + ": <strong>" + (gone ? "0%" : x.pct + "%") + "</strong>" + (gone ? " (shaker off)" : "") + "</li>"; }).join("") + "</ul>";
    var t = $("#cv-shaker", s2); t.setAttribute("aria-pressed", String(off));
  }
  $("#cv-shaker", s2).addEventListener("click", function(){ S.shaker = !S.shaker; api.save(); paint2(); });
  var qrg = radios($("#cv-qchips", s2), { aria:"Which bar shrinks?", options:B.shrink.map(function(x, i){ return { id:String(i), t:x.t }; }), value:S.q.pick == null ? "" : String(S.q.pick), cls:"chips", onChange:function(v){ S.q.pick = +v; api.save(); } });
  var qrem = $("#cv-qrem", s2); qrem.value = S.q.rem || "";
  qrem.addEventListener("input", function(){ S.q.rem = qrem.value; api.save(); });
  qrem.addEventListener("keydown", function(e){ if (e.key === "Enter") $("#cv-qchk", s2).click(); });
  $("#cv-qchk", s2).addEventListener("click", function(){
    var fb = $("#cv-qfb", s2), v = gnum(S.q.rem), F = B.fb;
    if (S.q.pick == null || v == null) { fb.innerHTML = MV.fbHTML("", F.pick); return; }
    var barOk = MV.ok(B.shrink[S.q.pick]), numOk = Math.abs(v - MV.ans(B.remain)) < 0.01;
    fb.innerHTML = barOk && numOk ? MV.fbHTML("good", "<strong>✓</strong> " + F.right) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + (!barOk ? F.bar : F.num));
    MV.focusFb(fb);
  });
  paint2(); qrg.repaint();

  // Station 3: swap lab (the sodium bar is orange)
  var C = D.st3, s3 = $("#cv-st3", host), MAX = 3500;
  s3.innerHTML = "<h3>" + C.title + "</h3><p>" + C.intro + '</p><div class="cv-swaps" role="group" aria-label="Swaps" id="cv-swaps"></div><div class="cv-swl"><div class="tbl-wrap" id="cv-day"></div><div class="cv-tot" id="cv-tot" aria-live="polite"></div></div><p class="tiny muted"><span class="hfa-model">Model data</span> A model day; real foods vary.</p>';
  function paint3(){
    var sw = $("#cv-swaps", s3);
    MV.keepFocus(sw, function(){ sw.innerHTML = C.swaps.map(function(x){ var on = !!S.sw[x.id]; return '<button type="button" class="cv-swbtn" data-sw="' + x.id + '" data-k="sw' + x.id + '" aria-pressed="' + on + '"><span class="cv-swm" aria-hidden="true">' + (on ? "✓" : "⇄") + "</span>" + x.t + "</button>"; }).join(""); });
    var total = 0, rows = C.day.map(function(it){
      var x = it.swap && S.sw[it.swap] ? byId(C.swaps, it.swap) : null, mg = x ? x.mg : it.mg; total += mg;
      return "<tr" + (x ? ' class="cv-swd"' : "") + '><td><span class="cv-meal">' + it.meal + "</span>" + (x ? x.to + ' <span class="cv-swtag">swapped</span>' : it.t) + '</td><td class="num">' + mg + "</td></tr>";
    });
    $("#cv-day", s3).innerHTML = '<table class="vt cv-dtab"><caption class="vh">Model day</caption><thead><tr><th scope="col">Meal and food</th><th scope="col">Sodium (mg)</th></tr></thead><tbody>' + rows.join("") + '</tbody><tfoot><tr><th scope="row">Total</th><td class="num"><strong>' + total + "</strong></td></tr></tfoot></table>";
    var pct = Math.round(total / DV * 100);
    $("#cv-tot", s3).innerHTML = '<p class="cv-totn"><strong>' + total + " mg</strong> · " + pct + "% DV</p>" +
      '<div class="cv-tbar" role="img" aria-label="' + esc("Sodium for the day: " + total + " mg, " + pct + "% of the Daily Value of " + DV + " mg") + '"><span class="cv-tfill" style="width:' + f1(total / MAX * 100) + '%"></span><span class="cv-tdv" style="left:' + f1(DV / MAX * 100) + '%"></span></div>' +
      '<p class="tiny muted">The dashed line marks the Daily Value, ' + DV + " mg (100%).</p>";
  }
  s3.addEventListener("click", function(e){ var b = e.target.closest("[data-sw]"); if (!b) return; S.sw[b.dataset.sw] = !S.sw[b.dataset.sw]; api.save(); paint3(); });
  paint3();

  // Station 4: potassium partner
  var Q = D.st4;
  $("#cv-st4", host).innerHTML = "<h3>" + Q.title + "</h3>" + Q.html + '<ul class="cv-kfoods">' + Q.foods.map(function(t){ return "<li>" + t + "</li>"; }).join("") + '</ul><div class="hfa-support" role="note"><p>' + Q.note + "</p></div>";
}

// ---------- Practice 2: Sodium budget and evidence (custom: number entry N4 with one or two boxes, and choice chips) ----------
function budget(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ var x = S.items[it.id] || (S.items[it.id] = { pick:null, vals:[], tries:0, hint:0, solved:false, first:null }); x.vals = x.vals || []; return x; }
  function order(it){ var n = it.chips.length, idx = []; for (var i = 0; i < n; i++) idx.push(i); return it.fixedOrder ? idx : MV.shuffle(idx, "cv-" + it.id); }
  function qHTML(it, i){
    var x = ist(it), h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">B' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★' + (it.inquiry ? " Investigation" : "") + "</span>" : "") + "</div>";
    if (it.kind === "num") h += it.fields.map(function(f, k){ return '<div class="numrow"><label for="cvb-' + it.id + k + '">' + f.label + ':</label><input class="numin" id="cvb-' + it.id + k + '" data-bn="' + it.id + '" data-bk="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(x.vals[k] || "") + '"' + (x.solved ? " disabled" : "") + '><span class="m">' + f.unit + "</span></div>"; }).join("");
    else h += '<div class="cv-bchips" role="radiogroup" aria-label="Choices">' + order(it).map(function(ci){
      var c = it.chips[ci], on = x.pick === ci, good = x.solved && MV.ok(c);
      return '<button type="button" class="cv-bchip' + (good ? " right" : "") + '" role="radio" aria-checked="' + on + '" data-ci="' + ci + '" data-k="' + it.id + "c" + ci + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>";
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
      if (v.some(function(q){ return q == null; })) return { skip:true, msg:it.fields.length > 1 ? "Enter a number in each box." : "Enter a number, such as 25 or 12.5." };
      var ans = MV.ans(it);
      if (v.every(function(q, k){ return Math.abs(q - ans[k]) < 0.01; })) return { ok:true };
      var w = (it.wrong || []).filter(function(q){ return q.match.every(function(m, k){ return Math.abs(v[k] - m) < 0.3; }); })[0];
      return { msg:NQ + (w ? w.fb : it.wrongDefault) + " Try again." };
    }
    if (x.pick == null) return { skip:true, msg:"Tap a choice first." };
    var c = it.chips[x.pick];
    return MV.ok(c) ? { ok:true } : { msg:NQ + (c.fb || it.fb || "") + " Try again." };
  }
  host.addEventListener("input", function(e){ var t = e.target; if (!t.dataset || !t.dataset.bn) return; var it = byId(a.items, t.dataset.bn); ist(it).vals[+t.dataset.bk] = t.value; msgs[it.id] = null; api.save(); });
  host.addEventListener("keydown", function(e){
    var t = e.target;
    if (e.key === "Enter" && t.dataset && t.dataset.bn) { var b = host.querySelector('[data-k="' + t.dataset.bn + 'chk"]'); if (b) b.click(); return; }
    var c = t.closest && t.closest("[data-ci]"); if (!c) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var sibs = $$("[data-ci]", c.parentNode), k = sibs.indexOf(c), nb = sibs[(k + d + sibs.length) % sibs.length]; if (nb) { nb.focus(); nb.click(); }
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

// ---------- Performance task: Heart-smart lunch (one main, one side, one drink; live panel and checklist) ----------
var task = (function(){
  var api = null, rg = {};
  function TK(){ return MV.C.task; }
  function row(id){ return byId(TK().rows, id); }
  function item(rid, id){ return id ? byId(row(rid).items, id) : null; }
  function read(){ var s = (api && api.S) || {}; return { m:item("m", s.m) ? s.m : "", s:item("s", s.s) ? s.s : "", d:item("d", s.d) ? s.d : "" }; }
  function full(d){ return !!(d.m && d.s && d.d); }
  function tot(d){
    var t = { na:0, sf:0, fi:0, veg:false };
    [["m", d.m], ["s", d.s], ["d", d.d]].forEach(function(q){ var it = item(q[0], q[1]); if (it) { t.na += it.na; t.sf += it.sf; t.fi += it.fi; if (it.veg) t.veg = true; } });
    return t;
  }
  function checks(d){ var t = tot(d), L = TK().limits, dr = item("d", d.d); return [full(d) && t.na <= L.na, full(d) && t.sf <= L.sf, t.fi >= L.fi, t.veg, !!dr && !dr.sugar]; }
  function keyOf(d){ return d.m + "+" + d.s + "+" + d.d; }
  function names(k){ var p = k.split("+"); return [item("m", p[0]), item("s", p[1]), item("d", p[2])].map(function(it, i){ return i ? lc(it.t) : it.t; }); }
  function optT(it){
    return '<span class="cv-mn">' + it.t + '</span><span class="cv-mv">sodium ' + it.na + " mg · sat. fat " + it.sf + " g · fibre " + it.fi + " g" + (it.veg ? " · whole veg/fruit" : "") + (it.sugar ? " · added sugar" : "") + (it.note ? " (" + it.note + ")" : "") + "</span>";
  }
  function bar(label, v, max, lim, cls, unit, kind){
    var ok = kind === "max" ? v <= lim : v >= lim;
    return '<div class="cv-lbar"><p class="cv-lbt"><span>' + label + "</span><strong>" + v + " " + unit + "</strong></p>" +
      '<div class="cv-ltrack"><span class="cv-lfill ' + cls + '" style="width:' + f1(clamp(v / max, 0, 1) * 100) + '%"></span><span class="cv-lmark" style="left:' + f1(lim / max * 100) + '%"></span></div>' +
      '<p class="tiny muted">' + (kind === "max" ? "at most " : "at least ") + lim + " " + unit + (ok ? "" : "") + "</p></div>";
  }
  function paint(){
    var d = read(), pv = $("#cv-tkpv"); if (!pv) return;
    ["m", "s", "d"].forEach(function(k){ rg[k].set(d[k]); });
    var t = tot(d), L = TK().limits, pct = Math.round(t.na / MV.C.part3.dv * 100), chosen = [item("m", d.m), item("s", d.s), item("d", d.d)].filter(Boolean);
    pv.innerHTML = '<h4 class="cv-h4">Marlon’s lunch</h4><p class="cv-tray">' + (chosen.length ? chosen.map(function(it){ return it.t; }).join(" + ") : "Nothing chosen yet.") + "</p>" +
      bar("Sodium", t.na, 1400, L.na, "na", "mg", "max").replace("</strong>", " (" + pct + "% DV)</strong>") +
      bar("Saturated fat", t.sf, 10, L.sf, "sf", "g", "max") + bar("Fibre", t.fi, 14, L.fi, "fi", "g", "min") +
      '<p class="cv-vegl">Whole vegetable or fruit: <strong>' + (t.veg ? "yes" : "no") + "</strong></p>" +
      '<p class="tiny muted"><span class="hfa-model">Model values</span> Half the sodium DV is ' + L.na + " mg.</p>";
  }
  return {
    render:function(inp, pv, a){
      api = a; var s = a.S;
      inp.innerHTML = '<div class="cv-tin">' + TK().rows.map(function(r){ return '<div id="cv-tk-' + r.id + '"></div>'; }).join("") + "</div>";
      TK().rows.forEach(function(r){
        rg[r.id] = radios($("#cv-tk-" + r.id), { label:r.t, aria:r.t, cls:"chips", options:r.items.map(function(it){ return { id:it.id, t:optT(it) }; }), value:s[r.id] || "",
          onChange:function(v){ s[r.id] = v; a.save(); paint(); a.update(); } });
      });
      pv.innerHTML = '<div id="cv-tkpv" class="cv-tkpv" aria-live="polite"></div>';
      paint();
      // the plan's message after two different answers (the toolkit frame's own message comes after three)
      $("#task-check").addEventListener("click", function(){
        setTimeout(function(){
          var ts = MV.taskState(), g = $("#task-fb .fb.good");
          if (ts.found.length >= 2 && g && !g.querySelector(".cv-after2")) g.insertAdjacentHTML("beforeend", '<p class="cv-after2">' + TK().after2 + "</p>");
        }, 0);
      });
    },
    read:read,
    valid:function(d){ return full(d) ? true : "Choose one main, one side and one drink."; },
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
  activities:{ budget:budget },
  task:task
});
})();
