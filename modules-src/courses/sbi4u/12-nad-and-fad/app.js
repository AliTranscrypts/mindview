// SBI4U 12 NAD⁺ and FAD: hero (an electron taxi), Electron shuttle (Mode A: load/unload scene with an S2 load stepper and a
// mini electron transport chain; Mode B: carrier parking lot with an S3 ledger), "NAD⁺ vs NADP⁺" (molecule zoom, two-pool
// gauges, yeast data graph), "Carrier accounting" (N4 multi-box numbers), "Fill the carriers" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small SVG helpers (from SBI4U 09 / 06) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function lp(a, b, t){ return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function sm(t){ t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "nf-t", "text-anchor":anchor || null }, s); }
function op(v){ return v >= 0.99 ? null : f1(clamp(v, 0, 1) * 100) / 100; }
function opA(o){ var v = op(o == null ? 1 : o); return v == null ? "" : ' opacity="' + v + '"'; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function fracAt(pts, idx){ var tot = 0, upto = 0; for (var i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); tot += l; if (i <= idx) upto += l; } return tot ? upto / tot : 0; }
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function arrowPath(pts, cls){
  var a = pts[pts.length - 2], b = pts[pts.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return sv("polyline", { points:pts.map(function(p){ return f1(p[0]) + "," + f1(p[1]); }).join(" "), "class":cls }) + sv("path", { d:head(b[0], b[1], (b[0] - a[0]) / L, (b[1] - a[1]) / L, 6), "class":cls + " nf-ah" });
}
function hexPath(x, y, r){ var d = ""; for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }
function pentPath(x, y, r){ var d = ""; for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; d += (i ? "L" : "M") + f1(x + r * Math.cos(a)) + " " + f1(y + r * Math.sin(a)); } return d + "Z"; }

// carrier roles (course plan §3): NAD⁺/NADH teal, FAD/FADH₂ cerulean, e⁻ violet, H⁺ magenta, substrates brown
var COL = { nad:"var(--bio-nadh)", fad:"var(--bio-fadh)" };
var NAME = { nad:"NAD⁺", fad:"FAD", nadh:"NADH", fadh:"FADH₂" };
var LOADED = { nad:"nadh", fad:"fadh" }, EMPTY = { nadh:"nad", fadh:"fad" };
function cnt(list, c){ return list.filter(function(x){ return x.c === c; }).length; }

// ---------- @component radioGroup (copied from SBI4U 09 / 06 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(bool)}
function radios(host, o){
  var val = o.value == null ? null : String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1, dis = x.dis || off; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length || off) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ var v = id == null ? null : String(id); if (v !== val) { val = v; paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// ---------- @component switchBtn (from SBI4U 09 cc-swb / HFA4U 09) — role="switch" button with a visible On/Off word ----------
function switchHTML(k, label, on, dis){
  return '<button type="button" class="nf-swb" role="switch" aria-checked="' + on + '" data-sw="' + k + '" data-k="nfsw' + k + '"' + (dis ? " disabled" : "") + '><span class="nf-swk" aria-hidden="true"></span><span>' + label + '</span><span class="nf-swst" aria-hidden="true">' + (on ? "On" : "Off") + "</span></button>";
}

// ---------- @component S2 electronShuttle scene — dehydrogenase + substrate, taxi carriers, solution tray and a mini
// electron transport chain (viewBox 520 × 352). The hero, Mode A and its step-through all draw with it. ----------
var VW = 520, VH = 352;
var SUBP = [104, 88], HP = [[92, 64], [116, 64]], HL = [[92, 40], [116, 40]];
var SPL = { e:[[160, 40], [186, 40]], h:[[160, 68], [186, 68]] };
var TP = [268, 108], LANE = 222, OFF = [VW + 50, LANE];
var SEAT = { e:[[TP[0] - 13, TP[1] - 6], [TP[0] + 13, TP[1] - 6]], h:[[TP[0] - 6, TP[1]], [TP[0] + 6, TP[1]]] };
var TRAY = [338, 124, 168, 62];
function traySlot(i){ i = clamp(i, 0, 13); return [TRAY[0] + 20 + (i % 7) * 21.5, TRAY[1] + 30 + Math.floor(i / 7) * 21]; }
var CX = { I:{ x:80, w:72, pump:true }, II:{ x:184, w:60 }, III:{ x:292, w:64, pump:true }, IV:{ x:404, w:64, pump:true } };
function pumpX(id){ var c = CX[id]; return c.x + c.w / 2 - 12; }
var Q = [238, 283], CYC = [348, 308], O2P = [474, 256];
var ROUTE = { I:[[80, 283], Q, [292, 283], CYC, [404, 283], [462, 262]], II:[[184, 283], Q, [292, 283], CYC, [404, 283], [462, 262]] };
var PUMPU = { I:{ I:0, III:fracAt(ROUTE.I, 2), IV:fracAt(ROUTE.I, 4) }, II:{ III:fracAt(ROUTE.II, 2), IV:fracAt(ROUTE.II, 4) } };

function eTok(p, o){ return o != null && o <= 0.02 ? "" : "<g" + opA(o) + ">" + sv("circle", { cx:p[0], cy:p[1], r:9, "class":"nf-e" }) + txt(p[0], p[1] + 3.8, "e⁻", "nf-tokt", "middle") + "</g>"; }
function hTok(p, o){ return o != null && o <= 0.02 ? "" : "<g" + opA(o) + ">" + sv("circle", { cx:p[0], cy:p[1], r:9, "class":"nf-h" }) + txt(p[0], p[1] + 3.8, "H⁺", "nf-tokt", "middle") + "</g>"; }
function hAtom(p, o){ return o != null && o <= 0.02 ? "" : "<g" + opA(o) + ">" + sv("circle", { cx:p[0], cy:p[1], r:9, "class":"nf-hat" }) + txt(p[0], p[1] + 4.2, "H", "nf-hatt", "middle") + "</g>"; }
function subPill(p, label){ var w = Math.max(60, label.length * 7.2 + 18); return sv("rect", { x:p[0] - w / 2, y:p[1] - 12, width:w, height:24, rx:12, "class":"nf-sub" }) + txt(p[0], p[1] + 4.6, label, "nf-subt", "middle"); }
// taxi centred on p: kind "nad" | "fad" (the role colour), fill 0 (outline, empty) … 1 (solid, loaded)
function taxiSVG(p, kind, fill, label, dx, o){
  var x = p[0] + (dx || 0), y = p[1], c = COL[kind], fv = f1(clamp(fill, 0, 1) * 100) / 100;
  var h = "<g" + opA(o) + ">";
  h += '<path class="nf-txb" style="stroke:' + c + ";fill:" + c + ";fill-opacity:" + fv + '" d="M' + f1(x - 33) + " " + f1(y - 10) + " H" + f1(x - 19) + " L" + f1(x - 12) + " " + f1(y - 22) + " H" + f1(x + 12) + " L" + f1(x + 19) + " " + f1(y - 10) + " H" + f1(x + 27) + " Q" + f1(x + 33) + " " + f1(y - 10) + " " + f1(x + 33) + " " + f1(y - 4) + " V" + f1(y + 9) + " H" + f1(x - 33) + ' Z"/>';
  h += sv("circle", { cx:x - 19, cy:y + 10, r:5.5, "class":"nf-wheel" }) + sv("circle", { cx:x + 19, cy:y + 10, r:5.5, "class":"nf-wheel" });
  h += '<text x="' + f1(x) + '" y="' + f1(y + 4.5) + '" text-anchor="middle" class="nf-txt" style="fill:' + (fv > 0.5 ? "var(--sheet)" : c) + '">' + label + "</text>";
  return h + "</g>";
}
function enzSVG(){ return '<path class="nf-enz" d="M40 122 C40 92 60 84 74 86 L88 104 L120 104 L134 86 C150 84 168 92 168 122 C168 160 142 178 104 178 C66 178 40 160 40 122 Z"/>'; }
// o: {sub, pill, prod, hAtoms, taxi:"nad"|"fad"|null, hSol, lit:"I"|"II"|null}
function baseSVG(o){
  var s = o.sub, h = "";
  h += sv("rect", { x:0, y:0, width:VW, height:VH, "class":"nf-bg" });
  h += txt(12, 20, s.stage, "nf-tb") + enzSVG() + txt(104, 196, s.enz, "nf-ts nf-halo", "middle");
  if (o.pill) h += subPill(SUBP, o.prod ? s.prod : s.n);
  if (o.hAtoms) h += hAtom(HP[0]) + hAtom(HP[1]);
  // solution tray
  h += sv("rect", { x:TRAY[0], y:TRAY[1], width:TRAY[2], height:TRAY[3], rx:10, "class":"nf-tray" }) + txt(TRAY[0] + 10, TRAY[1] + 15, "solution", "nf-ts");
  var n = Math.min(o.hSol || 0, 14);
  for (var i = 0; i < n; i++) h += hTok(traySlot(i));
  if ((o.hSol || 0) > 14) h += txt(TRAY[0] + TRAY[2] - 8, TRAY[1] + 15, "+" + (o.hSol - 14) + " more", "nf-ts", "end");
  // chain
  h += txt(12, 216, "electron transport chain", "nf-tb") + txt(135, 244, "matrix", "nf-ts", "middle");
  h += sv("rect", { x:6, y:268, width:VW - 12, height:30, rx:6, "class":"nf-mem" });
  h += txt(210, 346, "intermembrane space", "nf-ts", "middle");
  ["I", "II", "III", "IV"].forEach(function(id){
    var c = CX[id], tx = c.pump ? c.x - 8 : c.x, tall = id !== "II";
    h += sv("rect", { x:c.x - c.w / 2, y:tall ? 250 : 258, width:c.w, height:tall ? 64 : 50, rx:10, "class":"nf-cx" });
    if (id === "I" || id === "II") h += sv("rect", { x:c.x - 15, y:tall ? 250 : 258, width:30, height:7, rx:2, "class":"nf-door" });
    h += txt(tx, tall ? 276 : 280, "complex", "nf-cxs", "middle") + txt(tx, tall ? 296 : 299, id, "nf-cxl", "middle");
    if (c.pump) h += arrowPath([[pumpX(id), 236], [pumpX(id), 326]], "nf-pump0");
  });
  h += sv("circle", { cx:Q[0], cy:Q[1], r:10, "class":"nf-mob" }) + txt(Q[0], Q[1] + 4.2, "Q", "nf-cxs nf-b", "middle");
  h += sv("circle", { cx:CYC[0], cy:CYC[1], r:9, "class":"nf-mob" }) + txt(CYC[0], CYC[1] + 4, "c", "nf-cxs nf-b", "middle");
  h += sv("rect", { x:O2P[0] - 18, y:O2P[1] - 11, width:36, height:22, rx:11, "class":"nf-o2" }) + txt(O2P[0], O2P[1] + 4.4, "O₂", "nf-tokt", "middle");
  if (o.taxi) h += taxiSVG(TP, o.taxi, 0, NAME[o.taxi]);
  if (o.lit) h += pumpsSVG(litMap(o.lit, 2));
  return h;
}
function litMap(cx, u){ var m = {}, U = PUMPU[cx]; Object.keys(U).forEach(function(id){ m[id] = u < U[id] ? 0 : clamp((u - U[id]) / 0.14, 0.001, 1); }); return m; }
function pumpsSVG(m){
  var h = "";
  Object.keys(m).forEach(function(id){ if (!(m[id] > 0)) return; var x = pumpX(id); h += arrowPath([[x, 236], [x, 326]], "nf-pump") + hTok(lp([x, 238], [x, 334], sm(m[id]))); });
  return h;
}
// one loading reaction; c = {sub, car, ok, slot, driveIn, refill}; k 0 … 1
function loadOverlay(c, k){
  var s = c.sub, h = "", nad = c.car === "nad";
  h += subPill(SUBP, c.ok && k >= 0.3 ? s.prod : s.n);
  var i;
  if (c.ok) {
    var kl = sm(seg(k, 0, 0.16)), ks = sm(seg(k, 0.18, 0.34)), kh = sm(seg(k, 0.42, 0.66)), kr = sm(seg(k, 0.5, 0.86)), kf = seg(k, 0.64, 0.78), kd = sm(seg(k, 0.9, 1));
    if (k < 0.18) for (i = 0; i < 2; i++) h += hAtom(lp(HP[i], HL[i], kl));
    else if (k < 0.34) for (i = 0; i < 2; i++) h += hAtom(HL[i], 1 - ks) + eTok(lp(HL[i], SPL.e[i], ks), ks) + hTok(lp(HL[i], SPL.h[i], ks), ks);
    else {
      if (kh < 1) for (i = 0; i < 2; i++) h += eTok(lp(SPL.e[i], SEAT.e[i], kh));
      if (kh < 1) h += hTok(lp(SPL.h[0], SEAT.h[0], kh));
      if (nad) h += hTok(lp(SPL.h[1], traySlot(c.slot), kr));
      else if (kh < 1) h += hTok(lp(SPL.h[1], SEAT.h[1], kh));
    }
    var tp = TP;
    if (c.driveIn) tp = lp([VW + 50, TP[1]], TP, sm(seg(k, 0.12, 0.38)));
    if (kd > 0 && !c.stay) tp = lp(TP, [VW + 50, TP[1]], kd);
    h += taxiSVG(tp, c.car, kf, kf > 0.5 ? NAME[LOADED[c.car]] : NAME[c.car]);
    if (c.refill && k > 0.94) h += taxiSVG(TP, c.car, 0, NAME[c.car], 0, (k - 0.94) / 0.06);
  } else {
    var a1 = sm(seg(k, 0, 0.16)), a2 = sm(seg(k, 0.18, 0.32)), at1 = seg(k, 0.36, 0.52), ab = seg(k, 0.52, 0.7), aback = sm(seg(k, 0.72, 0.88)), adown = sm(seg(k, 0.88, 1));
    if (k < 0.18) for (i = 0; i < 2; i++) h += hAtom(lp(HP[i], HL[i], a1));
    else if (k < 0.34) for (i = 0; i < 2; i++) h += hAtom(HL[i], 1 - a2) + eTok(lp(HL[i], SPL.e[i], a2), a2) + hTok(lp(HL[i], SPL.h[i], a2), a2);
    else if (k < 0.72) { var f = k < 0.52 ? sm(at1) * 0.5 : 0.5 * (1 - sm(ab)); for (i = 0; i < 2; i++) h += eTok(lp(SPL.e[i], SEAT.e[i], f)) + hTok(lp(SPL.h[i], SEAT.h[i], f)); }
    else if (k < 0.88) for (i = 0; i < 2; i++) h += eTok(lp(SPL.e[i], HL[i], aback), 1 - aback) + hTok(lp(SPL.h[i], HL[i], aback), 1 - aback) + hAtom(HL[i], aback);
    else for (i = 0; i < 2; i++) h += hAtom(lp(HL[i], HP[i], adown));
    var dx = (k > 0.5 && k < 0.74) ? Math.sin((k - 0.5) * 80) * 4 : 0;
    h += taxiSVG(TP, c.car, 0, NAME[c.car], dx);
    if (k > 0.5 && k < 0.96) h += txt(TP[0], TP[1] - 32, "✗ wrong carrier", "nf-bad nf-halo", "middle");
  }
  return h;
}
// unloading one carrier at a complex; c = {c:"nadh"|"fadh", cx:"I"|"II", ok}; the taxi comes from the garage (right) and returns there
function unloadOverlay(c, k){
  var door = [CX[c.cx].x, LANE], h = "", kind = EMPTY[c.c];
  if (c.ok) {
    var kin = sm(seg(k, 0, 0.3)), ke = sm(seg(k, 0.3, 0.42)), kf = seg(k, 0.32, 0.42), kr = seg(k, 0.42, 0.88), kb = sm(seg(k, 0.56, 0.9));
    var tp = k < 0.56 ? lp(OFF, door, kin) : lp(door, OFF, kb);
    h += taxiSVG(tp, kind, 1 - kf, kf > 0.5 ? NAME[kind] : NAME[c.c]);
    var R = ROUTE[c.cx];
    if (k >= 0.3 && k < 0.42) h += eTok(lp([door[0] - 9, door[1]], [R[0][0] - 6, R[0][1]], ke)) + eTok(lp([door[0] + 9, door[1]], [R[0][0] + 6, R[0][1]], ke));
    else if (k >= 0.42 && kr < 1) h += eTok(polyAt(R, kr)) + eTok(polyAt(R, Math.max(0, kr - 0.045)));
    h += pumpsSVG(litMap(c.cx, k < 0.42 ? -1 : kr));
  } else {
    var kx = sm(seg(k, 0, 0.35)), kb2 = sm(seg(k, 0.62, 1));
    var tp2 = k < 0.62 ? lp(OFF, door, kx) : lp(door, OFF, kb2);
    var dx = (k > 0.36 && k < 0.6) ? Math.sin((k - 0.36) * 90) * 4 : 0;
    h += taxiSVG(tp2, kind, 1, NAME[c.c], dx);
    if (k > 0.36 && k < 0.94) h += txt(door[0], door[1] - 30, "✗ wrong door", "nf-bad nf-halo", "middle");
  }
  return h;
}

// ---------- Explore: Electron shuttle ----------
var EXP = null;
function explore(host, api){
  var C = api.content, S = api.S, FB = C.fb, SUBS = C.subs;
  var D0 = { mode:"a", a:{ sub:"s1", car:"nad", loads:[], n:0, wrong:0, lastWrong:null, hSol:0, last:null, unload:null, sel:null, prod:false },
    b:{ pool:30, o2:true, ferm:false, nadh:0, fadh:0, full:0, fermN:0, e:0, atp:0 }, tc2:"", seen:{} };
  Object.keys(D0).forEach(function(k){ if (S[k] === undefined) S[k] = JSON.parse(JSON.stringify(D0[k])); });
  function subBy(id){ return SUBS.filter(function(s){ return s.id === id; })[0]; }
  var capA = "", capB = "", more = false, engaged = false, stepI = 0, bannerMine = false;
  var A = { cancel:null, finish:null };
  function busy(){ return !!A.finish; }
  function runAnim(dur, step, done){
    var fin = false;
    function end(){ if (fin) return; fin = true; A.cancel = null; A.finish = null; step(1); if (done) done(); else syncCtrl(); }
    A.finish = end;
    A.cancel = MV.tween({ dur:dur, ease:lin, step:step, done:end });
    syncCtrl();
  }
  function stopAll(){ var n = 0; while (A.finish && n++ < 20) { if (A.cancel) A.cancel(); A.finish(); } }

  host.innerHTML = '<div class="nf-top" id="nf-mode"></div>' +
    '<div class="pg nf-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="nf-ga"><div class="nf-stage"><svg id="nf-svg" viewBox="0 0 ' + VW + " " + VH + '" role="img" focusable="false"></svg></div>' +
        '<p class="nf-legend tiny"><span><i class="nf-lk nf-lk-n" aria-hidden="true"></i>NAD⁺ / NADH</span><span><i class="nf-lk nf-lk-f" aria-hidden="true"></i>FAD / FADH₂</span><span>outline = empty, solid = loaded</span><span><i class="nf-ld nf-ld-e" aria-hidden="true"></i>e⁻</span><span><i class="nf-ld nf-ld-h" aria-hidden="true"></i>H⁺</span><span><i class="nf-ld nf-ld-s" aria-hidden="true"></i>substrate</span></p>' +
        '<p class="nf-cap" id="nf-capa" aria-live="polite"></p></div>' +
      '<div id="nf-gb" hidden><div class="nf-lot" id="nf-lot" role="img"></div><p class="nf-strip" id="nf-strip" aria-live="polite"></p><div class="nf-ebar" id="nf-ebar"></div>' +
        '<p class="nf-cap" id="nf-capb" aria-live="polite"></p></div></div>' +
    '<div class="pg-ctrl"><div id="nf-ca">' +
        '<div class="nf-subs" id="nf-sub"></div><div id="nf-car"></div>' +
        '<div class="q-actions nf-acts"><button type="button" class="btn primary sm" id="nf-load" data-k="nfload">Load</button><span class="nf-sep" aria-hidden="true"></span>' +
        '<button type="button" class="btn ghost sm" data-un="I" data-k="nfunI">Complex I</button><button type="button" class="btn ghost sm" data-un="II" data-k="nfunII">Complex II</button>' +
        '<button type="button" class="btn ghost sm" id="nf-reseta" data-k="nfreseta">Reset</button></div><p class="tiny muted nf-unl">Unload stations: complex I accepts NADH, complex II accepts FADH₂.</p><div class="nf-garage" id="nf-garage"></div></div>' +
      '<div id="nf-cb" hidden><label class="slider nf-sl"><span class="slider-top"><span>NAD⁺ pool</span><output id="nf-pool-out" for="nf-pool"></output></span><input type="range" id="nf-pool" min="10" max="40" step="10"></label>' +
        '<p class="tiny muted nf-fadn">FAD fixed at 10 (bound to enzymes).</p><div class="nf-sws" id="nf-sws"></div>' +
        '<div class="q-actions"><button type="button" class="btn primary sm" id="nf-proc" data-k="nfproc" aria-describedby="nf-why">Process one glucose</button><button type="button" class="btn ghost sm" id="nf-resetb" data-k="nfresetb">Reset</button></div>' +
        '<p class="tiny nf-why" id="nf-why" aria-live="polite"></p></div></div>' +
    '<div class="pg-read"><div id="nf-read"></div><button type="button" class="btn ghost sm nf-morebtn" id="nf-more" aria-expanded="false" data-k="nfmore">More readouts</button>' +
      '<div class="nf-stp" id="nf-stp" hidden><p class="nf-stph"><strong>Step through the last load</strong> <span class="tiny muted" id="nf-stpw"></span></p><ol class="nf-stl" id="nf-stl"></ol><div id="nf-pl"></div></div>' +
      '<div class="nf-tc2" id="nf-tc2" hidden><label for="nf-tc2in"><strong>Challenge 2:</strong> electrons that reach O₂ in total</label><input class="numin" id="nf-tc2in" type="text" inputmode="numeric" autocomplete="off"></div>' +
      '<p class="tiny muted nf-note"><span class="bio-model">Model</span> ' + C.modelNote + '</p><p class="nf-aha" id="nf-aha" hidden><strong>The big idea:</strong> ' + C.aha + "</p></div></div>";
  var svg = $("#nf-svg", host);

  var modeR = radios($("#nf-mode", host), { label:"Mode", options:[{ id:"a", t:C.modes.a }, { id:"b", t:C.modes.b }], value:S.mode, onChange:function(v){ stopAll(); engaged = false; S.mode = v; api.save(); paint(); MV.changed(); } });
  var subR = radios($("#nf-sub", host), { label:"Substrate", cls:"chips", options:SUBS.map(function(s){ return { id:s.id, t:s.id.toUpperCase() + " " + s.n }; }), value:S.a.sub,
    onChange:function(v){ S.a.sub = v; S.a.prod = false; engaged = false; var s = subBy(v); capA = s.id.toUpperCase() + ": " + s.n + " → " + s.prod + " (" + s.stage.toLowerCase() + "), on " + s.enz + "."; api.save(); paint(); } });
  var carR = radios($("#nf-car", host), { label:"Carrier", cls:"chips", options:[{ id:"nad", t:"NAD⁺" }, { id:"fad", t:"FAD" }], value:S.a.car,
    onChange:function(v){ S.a.car = v; S.a.prod = false; engaged = false; capA = "Carrier: an empty " + NAME[v] + " taxi waits for its electrons."; api.save(); paint(); } });

  // ---- Mode A ----
  function valueA(){ return 3 * cnt(S.a.loads, "nadh") + 2 * cnt(S.a.loads, "fadh"); }
  function loadEq(sid, car){ var s = subBy(sid); return car === "nad" ? s.n + " + NAD⁺ → " + s.prod + " + NADH + H⁺" : s.n + " + FAD → " + s.prod + " + FADH₂"; }
  function resetA(){ var a = S.a; a.loads = []; a.n = 0; a.wrong = 0; a.lastWrong = null; a.hSol = 0; a.last = null; a.unload = null; a.sel = null; a.prod = false; }
  function staticA(){
    return baseSVG({ sub:subBy(S.a.sub), pill:true, prod:S.a.prod, hAtoms:!S.a.prod, taxi:S.a.car, hSol:S.a.hSol, lit:S.a.unload ? S.a.unload.cx : null });
  }
  function drawLoad(ctx, k){
    svg.innerHTML = baseSVG({ sub:ctx.sub, pill:false, hAtoms:false, taxi:null, hSol:S.a.hSol - (ctx.ok && ctx.car === "nad" ? 1 : 0), lit:null }) + loadOverlay(ctx, k);
  }
  function drawUnload(ctx, k){
    svg.innerHTML = baseSVG({ sub:subBy(S.a.sub), pill:true, prod:S.a.prod, hAtoms:!S.a.prod, taxi:S.a.car, hSol:S.a.hSol, lit:null }) + unloadOverlay(ctx, k);
  }
  function ariaA(){
    var a = S.a, s = subBy(a.sub), n = cnt(a.loads, "nadh"), f = cnt(a.loads, "fadh");
    return "Load and unload. " + a.sub.toUpperCase() + ": " + (a.prod ? s.prod + " (the product of the last load)" : s.n) + " on " + s.enz + " (" + s.stage + "). " +
      (a.car ? "An empty " + NAME[a.car] + " taxi waits beside it. " : "No carrier chosen. ") + "Loaded carriers: " + n + " NADH and " + f + " FADH₂. " +
      a.hSol + " H⁺ released to the solution. " + (a.unload ? "Last unload: " + NAME[a.unload.c] + " at complex " + a.unload.cx + "; " + (a.unload.cx === "I" ? "3 proton pumps (I, III and IV)" : "2 proton pumps (III and IV)") + " lit." : "No carrier unloaded yet.");
  }
  function doLoad(done){
    var a = S.a, s = subBy(a.sub), car = a.car;
    engaged = false;
    if (!car) { capA = "Choose a carrier first: NAD⁺ or FAD."; paint(); if (done) done(); return; }
    if (a.loads.length >= 12) { capA = "✗ " + FB.full; paint(); if (done) done(); return; }
    var ok = MV.ans(s) === car;
    if (ok) { a.loads.push({ c:LOADED[car], s:s.id }); a.n++; if (car === "nad") a.hSol++; a.last = { sub:s.id, car:car }; a.prod = true; a.sel = a.loads.length - 1; capA = "✓ Loaded: " + loadEq(s.id, car) + "."; }
    else { a.wrong++; a.lastWrong = car; a.prod = false; capA = "✗ " + (car === "nad" ? FB.wrongS2 : FB.wrongFad); }
    api.save(); MV.changed();
    var ctx = { sub:s, car:car, ok:ok, slot:a.hSol - 1, refill:true };
    paintSteps(ok ? car : null);
    $("#nf-capa", host).textContent = ok ? "Loading…" : "Watch…";
    runAnim(ok ? 2900 : 2100, function(k){ drawLoad(ctx, k); if (ok) stepHi(k < 0.18 ? 0 : k < 0.36 ? 1 : k < 0.8 ? 2 : 3); }, function(){ paint(); if (done) done(); });
  }
  function doUnload(cx, done){
    var a = S.a;
    engaged = false;
    if (!a.loads.length) { capA = FB.pickFirst; paint(); if (done) done(); return; }
    var i = a.sel != null && a.sel < a.loads.length ? a.sel : a.loads.length - 1, item = a.loads[i];
    var ok = (item.c === "nadh" && cx === "I") || (item.c === "fadh" && cx === "II");
    if (ok) {
      a.loads.splice(i, 1); a.unload = { c:item.c, cx:cx }; a.sel = a.loads.length ? a.loads.length - 1 : null;
      S.seen["un" + cx] = true;
      capA = "✓ " + NAME[item.c] + " unloaded at complex " + cx + ": its 2 electrons pass " + (cx === "I" ? "3 proton pumps (I, III and IV)" : "2 proton pumps (III and IV)") + " on their way to O₂. The empty " + NAME[EMPTY[item.c]] + " goes back for more.";
    } else capA = "✗ " + (item.c === "nadh" ? FB.nadhToII : FB.fadhToI);
    api.save(); MV.changed();
    var ctx = { c:item.c, cx:cx, ok:ok };
    $("#nf-capa", host).textContent = "Driving to complex " + cx + "…";
    runAnim(ok ? 3100 : 2200, function(k){ drawUnload(ctx, k); }, function(){ paint(); if (done) done(); });
  }
  // S2 step-through of the last load (MV.player on its own host)
  function paintSteps(car){
    var L = S.a.last, c = car || (L && L.car);
    $("#nf-stp", host).hidden = !c;
    if (!c) return;
    $("#nf-stl", host).innerHTML = C.steps[c].map(function(t, i){ return '<li data-sti="' + i + '">' + t + "</li>"; }).join("");
    $("#nf-stpw", host).textContent = L ? "(" + loadEq(L.sub, L.car) + ")" : "";
  }
  function stepHi(i){ $$("#nf-stl li", host).forEach(function(li){ li.classList.toggle("on", +li.dataset.sti === i); }); }
  var PH = [0.17, 0.35, 0.8, 0.88], plReady = false;
  var plHost = $("#nf-pl", host);
  plHost.addEventListener("click", function(e){ if (e.target.closest("[data-pl]") && S.a.last && !busy()) engaged = true; }, true);
  var player = MV.player(plHost, { count:4, interval:1700, label:function(i){ return "Step " + (i + 1) + " of 4"; },
    render:function(i){ stepI = i; if (!plReady || !engaged || busy() || !S.a.last) return; var L = S.a.last; drawLoad({ sub:subBy(L.sub), car:L.car, ok:true, slot:S.a.hSol - 1 }, PH[i]); stepHi(i); $("#nf-capa", host).textContent = "Step " + (i + 1) + ": " + MV.plain(C.steps[L.car][i]); } });
  plReady = true;
  function paintGarage(){
    var a = S.a, g = $("#nf-garage", host), dis = busy();
    MV.keepFocus(g, function(){
      g.innerHTML = '<p class="nf-gh"><strong>Loaded carriers</strong> <span class="tiny muted">' + (a.loads.length ? "Tap one, then a complex to unload it." : "None yet: load one first.") + "</span></p>" +
        (a.loads.length ? '<div class="nf-gl" role="group" aria-label="Loaded carriers">' + a.loads.map(function(x, i){ var on = i === a.sel; return '<button type="button" class="nf-gcar nf-gc-' + x.c + '" data-gi="' + i + '" data-k="nfg' + i + '" aria-pressed="' + on + '"' + (dis ? " disabled" : "") + '><span class="nf-mini" aria-hidden="true"></span>' + NAME[x.c] + ' <span class="tiny">(' + subBy(x.s).n + ")</span></button>"; }).join("") + "</div>" : "");
    });
  }
  $("#nf-garage", host).addEventListener("click", function(e){ var b = e.target.closest("[data-gi]"); if (!b || b.disabled) return; S.a.sel = +b.dataset.gi; api.save(); paintGarage(); });
  $("#nf-ca", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy()) return;
    if (b.id === "nf-load") doLoad();
    else if (b.dataset.un) doUnload(b.dataset.un);
    else if (b.id === "nf-reseta") { engaged = false; resetA(); capA = "Reset: no carriers loaded, no wrong tries, and the solution tray is empty."; api.save(); paint(); MV.changed(); }
  });

  // ---- Mode B ----
  function freeNad(){ return S.b.pool - S.b.nadh; }
  function stalled(){ var b = S.b; if (b.o2) return false; return b.ferm ? freeNad() < 2 : (freeNad() < 10 || 10 - b.fadh < 2); }
  function status(){ var b = S.b; if (stalled()) return "Stalled: no NAD⁺"; if (!b.o2 && b.ferm) return "Running on fermentation (2 ATP per glucose)"; return "Running"; }
  function resetB(){ var b = S.b; b.nadh = 0; b.fadh = 0; b.full = 0; b.fermN = 0; b.e = 0; b.atp = 0; }
  function lotHTML(nadh, fadh){
    var b = S.b, h = '<div class="nf-lotg"><p class="nf-loth"><span>NAD⁺ pool</span> <span class="tiny muted">' + b.pool + ' carriers</span></p><div class="nf-cars" aria-hidden="true">';
    for (var i = 0; i < b.pool; i++) h += '<i class="nf-car nf-cn' + (i < nadh ? " on" : "") + '"></i>';
    h += '</div></div><div class="nf-lotg"><p class="nf-loth"><span>FAD</span> <span class="tiny muted">10, bound to enzymes</span></p><div class="nf-cars" aria-hidden="true">';
    for (var j = 0; j < 10; j++) h += '<i class="nf-car nf-cf' + (j < fadh ? " on" : "") + '"></i>';
    return h + "</div></div>";
  }
  function ebarHTML(e){
    var w = clamp(e / 240, 0, 1) * 100;
    return '<div class="nf-eb"><span class="nf-ebl">Electrons delivered to O₂</span><span class="nf-ebt" aria-hidden="true"><i style="width:' + f1(w) + '%"></i></span><b>' + Math.round(e) + "</b></div>" +
      '<p class="tiny muted nf-ebn">Each tick = one glucose fully oxidized (24 e⁻).' + (e > 240 ? " The bar is full: more than 10 glucose." : "") + "</p>";
  }
  function showB(nadh, fadh, e){
    var b = S.b, lot = $("#nf-lot", host);
    lot.innerHTML = lotHTML(nadh, fadh);
    lot.setAttribute("aria-label", "Parking lot of carriers: " + b.pool + " NAD⁺ carriers, " + nadh + " of them loaded as NADH; 10 FAD, " + fadh + " loaded as FADH₂. Outline = empty, solid = loaded.");
    $("#nf-strip", host).innerHTML = "Free NAD⁺ <b>" + (b.pool - nadh) + "</b> · NADH <b>" + nadh + "</b> · Free FAD <b>" + (10 - fadh) + "</b> · FADH₂ <b>" + fadh + "</b>";
    $("#nf-ebar", host).innerHTML = ebarHTML(e);
  }
  function stallBanner(){
    if (S.mode === "b" && stalled()) { MV.banner("bad", C.stall); bannerMine = true; S.seen.stall = true; }
    else if (bannerMine) { MV.banner("", ""); bannerMine = false; }
  }
  function processB(done){
    var b = S.b;
    if (stalled()) { stallFlash(done); return; }
    var from = { nadh:b.nadh, fadh:b.fadh, e:b.e }, kind;
    if (b.o2) { b.full++; b.e += 24; b.atp += 34; kind = "o2"; S.seen.chain = true; capB = "Glucose " + (b.full + b.fermN) + ": glycolysis, pyruvate oxidation and the Krebs cycle load 10 NADH and 2 FADH₂; the chain unloads all 12, so 24 electrons reach O₂."; }
    else if (b.ferm) { b.fermN++; kind = "ferm"; capB = "Glucose " + (b.full + b.fermN) + ": glycolysis only. It loads 2 NADH, and turning pyruvate into lactate unloads them again at once."; }
    else { b.nadh += 10; b.fadh += 2; b.full++; kind = "off"; capB = "Glucose " + (b.full + b.fermN) + ": 10 NADH and 2 FADH₂ loaded. With no O₂, nothing unloads them."; }
    api.save(); MV.changed();
    $("#nf-capb", host).innerHTML = MV.bio.tok("glucose", "--bio-carbon") + " Processing…";
    runAnim(kind === "off" ? 1500 : kind === "ferm" ? 1500 : 2600, function(k){
      var kf = seg(k, 0, 0.45), ku = seg(k, 0.55, 1);
      if (kind === "off") showB(from.nadh + Math.round(10 * seg(k, 0, 0.8)), from.fadh + Math.round(2 * seg(k, 0.6, 1)), from.e);
      else if (kind === "ferm") showB(from.nadh + Math.round(2 * kf) - Math.round(2 * ku), from.fadh, from.e);
      else showB(Math.round(10 * kf * (1 - ku)), Math.round(2 * seg(k, 0.25, 0.45) * (1 - ku)), from.e + 24 * ku);
    }, function(){ paint(); if (done) done(); });
  }
  function stallFlash(done){
    S.seen.stall = true; api.save();
    capB = C.stall + (S.b.ferm ? " " + C.stallFerm : " With no O₂, every NADH stays loaded, so glycolysis has no NAD⁺ to accept electrons.");
    MV.banner("bad", C.stall); bannerMine = true;
    var cap = $("#nf-capb", host);
    runAnim(900, function(k){ cap.innerHTML = MV.bio.tok("glucose", "--bio-carbon") + (k < 1 ? " arrives… no free NAD⁺." : ""); }, function(){ paint(); if (done) done(); });
  }
  function setO2(on){
    var b = S.b; b.o2 = on; if (on) b.ferm = false;
    if (on && (b.nadh || b.fadh)) {
      var from = { nadh:b.nadh, fadh:b.fadh, e:b.e }, add = 2 * (b.nadh + b.fadh);
      capB = "O₂ on: the chain unloads " + b.nadh + " NADH and " + b.fadh + " FADH₂, so " + add + " electrons reach O₂.";
      b.e += add; b.atp += 3 * b.nadh + 2 * b.fadh; b.nadh = 0; b.fadh = 0; S.seen.chain = true;
      api.save(); MV.changed();
      runAnim(1500, function(k){ showB(Math.round(from.nadh * (1 - k)), Math.round(from.fadh * (1 - k)), from.e + add * k); }, function(){ paint(); });
      return;
    }
    capB = on ? "O₂ on: the chain will unload every carrier after each glucose." : "O₂ off: loaded carriers can no longer unload at the chain.";
    api.save(); paint(); MV.changed();
  }
  var pool = $("#nf-pool", host), poolOut = $("#nf-pool-out", host);
  function poolShow(){ pool.value = S.b.pool; poolOut.textContent = S.b.pool + " NAD⁺"; pool.setAttribute("aria-valuetext", S.b.pool + " NAD⁺ carriers"); }
  pool.addEventListener("input", function(){ if (busy()) { pool.value = S.b.pool; return; } S.b.pool = +pool.value; resetB(); capB = "Pool set to " + S.b.pool + " NAD⁺: the run starts again."; api.save(); paint(); MV.changed(); });
  $("#nf-sws", host).addEventListener("click", function(e){
    var b = e.target.closest("[data-sw]"); if (!b || b.disabled || busy()) return;
    if (b.dataset.sw === "o2") setO2(!S.b.o2);
    else { S.b.ferm = !S.b.ferm; capB = S.b.ferm ? "Fermentation on: only glycolysis runs, and lactate formation unloads its NADH." : "Fermentation off."; if (S.b.ferm && stalled()) capB += " " + C.stallFerm; api.save(); paint(); MV.changed(); }
  });
  $("#nf-cb", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy()) return;
    if (b.id === "nf-proc") processB();
    else if (b.id === "nf-resetb") { resetB(); capB = "Reset: every carrier is empty and the counters are back to 0."; api.save(); paint(); MV.changed(); }
  });
  var tc2 = $("#nf-tc2in", host);
  tc2.value = S.tc2 || "";
  tc2.addEventListener("input", function(){ S.tc2 = tc2.value; api.save(); MV.changed(); });

  // ---- readouts, controls, paint ----
  function rows(){
    var r, a = S.a, b = S.b;
    if (S.mode === "a") {
      var n = cnt(a.loads, "nadh"), f = cnt(a.loads, "fadh");
      r = [["Last load", a.last ? loadEq(a.last.sub, a.last.car) : "none yet"],
        ["Loaded now", n + " NADH, " + f + " FADH₂"],
        ["ATP value of loaded carriers (textbook)", '<span class="nf-atp">' + valueA() + "</span>"],
        ["Loading reactions since Reset", String(a.n)],
        ["H⁺ released to the solution", String(a.hSol)],
        ["Last unload", a.unload ? NAME[a.unload.c] + " at complex " + a.unload.cx + ": " + (a.unload.cx === "I" ? "3 proton pumps" : "2 proton pumps") : "none yet"]];
    } else {
      r = [["Glucose fully processed", String(b.full)],
        ["Glucose through glycolysis only (fermentation)", String(b.fermN)],
        ["Free NAD⁺ / NADH", freeNad() + " / " + b.nadh],
        ["Free FAD / FADH₂", (10 - b.fadh) + " / " + b.fadh],
        ["Electrons delivered to O₂", String(b.e)],
        ["ATP value of carriers unloaded (textbook)", '<span class="nf-atp">' + b.atp + "</span>"],
        ["Status", status()]];
    }
    return r;
  }
  function paintRead(){
    var r = rows(), box = $("#nf-read", host);
    box.innerHTML = '<dl class="read nf-read' + (more ? "" : " nf-col") + '" aria-live="polite">' + r.map(function(x, i){ return "<div" + (i >= 4 ? ' class="nf-more"' : "") + "><dt>" + x[0] + "</dt><dd>" + x[1] + "</dd></div>"; }).join("") + "</dl>";
    var mb = $("#nf-more", host); mb.setAttribute("aria-expanded", String(more)); mb.textContent = more ? "Fewer readouts" : "More readouts";
    $("#nf-aha", host).hidden = !(S.seen.stall && S.seen.chain && (S.seen.unI || S.seen.unII));
  }
  $("#nf-more", host).addEventListener("click", function(){ more = !more; paintRead(); });
  function syncCtrl(){
    var bz = busy(), a = S.a, b = S.b;
    modeR.disable(bz); subR.disable(bz); carR.disable(bz);
    $("#nf-load", host).disabled = bz || !a.car;
    $$("[data-un]", host).forEach(function(x){ x.disabled = bz || !a.loads.length; });
    $("#nf-reseta", host).disabled = bz;
    $$(".nf-gcar", host).forEach(function(x){ x.disabled = bz; });
    var st = stalled();
    $("#nf-proc", host).disabled = bz || st; $("#nf-resetb", host).disabled = bz; pool.disabled = bz;
    $$("[data-sw]", host).forEach(function(x){ x.disabled = bz || (x.dataset.sw === "ferm" && b.o2); });
    $("#nf-why", host).textContent = st ? "Process one glucose is off: " + (b.ferm ? "no free NAD⁺ for glycolysis. Turn O₂ on or press Reset." : "no free NAD⁺ to accept electrons. Turn O₂ on, try fermentation, or press Reset.") : "";
  }
  function paintSw(){
    var box = $("#nf-sws", host);
    MV.keepFocus(box, function(){ box.innerHTML = switchHTML("o2", "O₂", S.b.o2, false) + switchHTML("ferm", "Fermentation (preview)", S.b.ferm && !S.b.o2, S.b.o2) + (S.b.o2 ? '<span class="tiny muted">Fermentation works only when O₂ is off.</span>' : ""); });
  }
  function paint(){
    var a = S.a, b = S.b;
    modeR.set(S.mode); subR.set(a.sub); carR.set(a.car);
    $("#nf-ga", host).hidden = S.mode !== "a"; $("#nf-gb", host).hidden = S.mode !== "b";
    $("#nf-ca", host).hidden = S.mode !== "a"; $("#nf-cb", host).hidden = S.mode !== "b"; $("#nf-tc2", host).hidden = S.mode !== "b";
    if (S.mode === "a") {
      if (!engaged) svg.innerHTML = staticA();
      svg.setAttribute("aria-label", ariaA());
      $("#nf-capa", host).textContent = capA || "Choose a substrate and a carrier, then press Load. Unload loaded carriers at complex I or II.";
      paintGarage(); paintSteps(null);
      if (!engaged) stepHi(-1);
    } else {
      showB(b.nadh, b.fadh, b.e); poolShow(); paintSw(); $("#nf-stp", host).hidden = true;
      $("#nf-capb", host).textContent = capB || "Press Process one glucose. Then try it with O₂ off.";
    }
    stallBanner(); paintRead(); syncCtrl();
  }
  EXP = { paint:paint };
  paint();

  function chal(id){
    var a = S.a, n = cnt(a.loads, "nadh"), f = cnt(a.loads, "fadh");
    if (id === "tc1") {
      if (n === 1 && f === 1 && !a.wrong) return { ok:true };
      if (a.wrong) return { ok:false, msg:(a.lastWrong === "fad" ? FB.wrongFad : FB.wrongS2) + " A wrong carrier was tried in this challenge: press Reset under Load and unload, then load again." };
      if (n >= 2) return { ok:false, msg:"You need one of each: which substrate loads FAD?" };
      if (!n && !f) return { ok:false, msg:"Load a carrier first: choose a substrate and a carrier in Load and unload, then press Load." };
      return { ok:false, msg:"Load exactly one NADH and one FADH₂. You have " + n + " NADH and " + f + " FADH₂." };
    }
    if (id === "tc2") {
      var raw = String(S.tc2 || "").trim(), v = raw ? MV.parseNum(raw.replace(/\s/g, "")) : null, x = v && v.length === 1 ? v[0] : null;
      if (x == null) return { ok:false, msg:"Type your count in the Challenge 2 box under the Shuttle run readout first." };
      if (x === 72) return { ok:true };
      if (x === 30) return { ok:false, msg:"Count FADH₂ too, and 2 electrons per carrier." };
      if (x === 60) return { ok:false, msg:"Add the 6 FADH₂: 12 more electrons." };
      if (x === 24) return { ok:false, msg:"That’s one glucose." };
      return { ok:false, msg:"Count every carrier the chain unloads, at 2 electrons each." };
    }
    if (id === "tc3") {
      var val = 3 * n + 2 * f;
      if (n === 4 && f === 1) return { ok:true };
      if (val === 14) return { ok:false, msg:"14 ATP, but " + (n + f) + " loads. NADH is worth more: use more of it." };
      if (n === 4 && f === 2) return { ok:false, msg:"4 NADH + 2 FADH₂ = 16 ATP. Over by 2." };
      if (n === 5 && f === 0) return { ok:false, msg:"5 NADH = 15 ATP. Odd totals need an FADH₂ swap." };
      if (!n && !f) return { ok:false, msg:"Load carriers in Load and unload first." };
      return { ok:false, msg:"Those carriers are worth " + val + " ATP (" + n + " NADH × 3 + " + f + " FADH₂ × 2). You need exactly 14." };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stopAll(); engaged = false; var s = p.start;
        S.mode = s.mode;
        if (s.mode === "a") {
          resetA(); if (s.sub) S.a.sub = s.sub;
          S.a.car = s.car || (s.loaded ? "nad" : null);
          if (s.loaded) { S.a.loads = [{ c:"nadh", s:"s1" }, { c:"fadh", s:"s2" }]; S.a.n = 2; S.a.sel = 0; }
          capA = s.loaded ? "One NADH (from malate) and one FADH₂ (from succinate) are loaded." : "";
        } else { S.b.pool = s.pool; S.b.o2 = s.o2; S.b.ferm = s.ferm; resetB(); capB = "NAD⁺ pool " + s.pool + ", O₂ off."; }
        api.save(); paint(); MV.changed();
      },
      run:function(p, done){
        if (p.id === "p1") doLoad(done);
        else if (p.id === "p2") processB(function(){ processB(function(){ stallFlash(done); }); });
        else if (p.id === "p3") { S.a.car = "fad"; capA = "Trying FAD on succinate…"; api.save(); paint(); MV.wait(450, function(){ doLoad(done); }); }
        else if (p.id === "p4") {
          S.a.sel = 0;
          doUnload("I", function(){ S.a.sel = 0; MV.wait(350, function(){ doUnload("II", function(){ capA = "NADH’s electrons lit 3 pumps (I, III and IV); FADH₂’s lit only 2 (III and IV). Same 2 electrons, one pump fewer."; paint(); done(); }); }); });
        } else done();
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: NAD⁺ vs NADP⁺ ----------
// @component molZoom — "Zoom to the molecules": dinucleotide schematics (NAD⁺, NADP⁺, FAD) with the electron-accepting ring
// highlighted; "Add 2 H" animates 2 e⁻ + H⁺ onto the ring (viewBox 200 × 300).
function molSVG(id, k, rel){
  var X = 64, h = "", fad = id === "fad", roleC = fad ? "nf-ring-f" : "nf-ring-n";
  // ring(s)
  if (fad) { [-36.4, 0, 36.4].forEach(function(dx){ h += sv("path", { d:hexPath(X + dx, 52, 21), "class":"nf-ring " + roleC }); }); h += txt(130, 84, "flavin ring", "nf-ms", "start"); }
  else { h += sv("path", { d:hexPath(X, 52, 24), "class":"nf-ring " + roleC }) + txt(X, 57, k >= 1 ? "N" : "N⁺", "nf-mt", "middle") + txt(94, 70, "nicotinamide", "nf-ms") + txt(94, 83, "ring", "nf-ms"); }
  // backbone
  h += sv("line", { x1:X, y1:fad ? 73 : 76, x2:X, y2:93, "class":"nf-bond" });
  if (fad) h += sv("polyline", { points:"64,93 74,101 54,111 74,121 64,128", "class":"nf-bond nf-ribitol" }) + txt(84, 114, "ribitol", "nf-ms");
  else h += sv("path", { d:pentPath(X, 109, 15), "class":"nf-sug" }) + txt(86, 113, "ribose", "nf-ms");
  h += sv("line", { x1:X, y1:fad ? 128 : 124, x2:X, y2:134, "class":"nf-bond" });
  h += sv("circle", { cx:X, cy:146, r:12, "class":"nf-p" }) + txt(X, 150.5, "P", "nf-mt", "middle");
  h += sv("line", { x1:X, y1:158, x2:X, y2:164, "class":"nf-bond" });
  h += sv("path", { d:"M8 161 H190", "class":"nf-div" }) + txt(190, 156, "nucleotide 1 ↑", "nf-ms", "end") + txt(190, 174, "nucleotide 2 ↓", "nf-ms", "end");
  h += sv("circle", { cx:X, cy:176, r:12, "class":"nf-p" }) + txt(X, 180.5, "P", "nf-mt", "middle");
  h += sv("line", { x1:X, y1:188, x2:X, y2:197, "class":"nf-bond" });
  h += sv("path", { d:pentPath(X, 212, 15), "class":"nf-sug" }) + (id === "nadp" ? txt(44, 216, "ribose", "nf-ms", "end") : txt(86, 216, "ribose", "nf-ms"));
  h += sv("line", { x1:X, y1:226, x2:X, y2:241, "class":"nf-bond" });
  h += sv("path", { d:hexPath(X, 258, 17), "class":"nf-ad" }) + sv("path", { d:pentPath(X + 25, 258, 11), "class":"nf-ad" }) + txt(104, 280, "adenine", "nf-ms");
  if (id === "nadp") h += sv("line", { x1:X + 14, y1:208, x2:X + 46, y2:228, "class":"nf-bond" }) + sv("circle", { cx:X + 56, cy:232, r:11, "class":"nf-p" }) + txt(X + 56, 236.5, "P", "nf-mt", "middle") + sv("circle", { cx:X + 56, cy:232, r:18, "class":"nf-xp" }) + txt(144, 208, "extra", "nf-ms nf-b") + txt(144, 221, "phosphate", "nf-ms nf-b");
  // tokens: from the top right onto the ring
  if (k > 0) {
    var src = [196, -12], E = fad ? [[52, 14], [76, 14]] : [[26, 40], [26, 64]], H = fad ? [[28, 14], [100, 14]] : [[100, 30]];
    var kk = sm(k);
    E.forEach(function(p){ h += eTok(lp(src, p, kk), Math.min(1, k * 3)); });
    H.forEach(function(p){ h += hTok(lp(src, p, kk), Math.min(1, k * 3)); });
    if (!fad && rel > 0) h += hTok(lp([140, 10], [168, 24], sm(rel)), Math.min(1, rel * 3)) + (rel >= 1 ? txt(168, 46, "released", "nf-ms", "middle") : "");
  }
  return h;
}
// @component poolGauges — two carrier pools as fill gauges (loaded share), with a "usual level" marker and event buttons
// @component S7 dataStation — yeast glycolysis rate vs time (MV.Plot, model curves) with a time scrubber and a reveal
function rate1(t){ return t <= 0 ? 100 : 70 + 30 * Math.exp(-1.2 * t); }
function rate2(t){ return t <= 0 ? 100 : t >= 3 ? 0 : 100 * Math.pow(1 - t / 3, 2); }
function part3(host, api){
  var C = api.content, S = api.S, S1 = C.s1, S2 = C.s2, S3 = C.s3;
  S.mol = S.mol || {}; S.g = S.g || { nad:0.2, nadp:0.8 }; if (S.t == null) S.t = 0;
  var REST = { nad:0.2, nadp:0.8 };
  host.innerHTML = '<div class="nf-p3">' +
    '<div class="nf-st1"><h3>' + S1.title + '</h3><details class="alg" open><summary>' + S1.panel + "</summary><p>" + S1.intro + '</p><div class="nf-mols">' +
      S1.mols.map(function(m){ return '<section class="nf-mol" data-mol="' + m.id + '" aria-labelledby="nf-mh-' + m.id + '"><h4 id="nf-mh-' + m.id + '"><span class="nf-mname">' + m.name + '</span> <span class="tiny muted">' + m.full + '</span></h4><div class="nf-mstage"><svg viewBox="0 0 200 300" role="img" focusable="false" id="nf-ms-' + m.id + '"></svg></div><p class="nf-vit">Made from <strong>' + m.vit + '</strong></p><div class="q-actions" id="nf-mb-' + m.id + '"></div><p class="nf-mcap tiny" id="nf-mc-' + m.id + '" aria-live="polite"></p></section>'; }).join("") +
      '</div><p class="tiny muted">' + S1.cap0 + "</p></details></div>" +
    '<div class="nf-st2 part"><h3>' + S2.title + "</h3><p>" + S2.intro + '</p><div class="nf-gauges">' + ["nad", "nadp"].map(function(id){ var G = S2[id]; return '<div class="nf-gauge" data-g="' + id + '"><h4>' + G.name + ' <span class="tiny muted">' + G.role + '</span> <span class="nf-gdir" id="nf-gd-' + id + '" aria-hidden="true"></span></h4><div class="nf-gt" id="nf-gt-' + id + '" role="img"></div><p class="nf-gv" id="nf-gv-' + id + '"></p><p class="tiny muted">' + G.note + "</p></div>"; }).join("") + "</div>" +
      '<div class="nf-evs" role="group" aria-label="Events">' + S2.events.map(function(e){ return '<button type="button" class="btn ghost sm" data-ev="' + e.id + '" data-k="nfev' + e.id + '">' + e.t + "</button>"; }).join("") + '</div><p class="nf-gcap" id="nf-gcap" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn ghost sm" id="nf-greset" data-k="nfgreset">Reset the gauges</button></div></div>' +
    '<div class="nf-st3 part"><h3>' + S3.title + '</h3><details class="alg" open><summary>' + S3.panel + "</summary><p>" + S3.intro + '</p><div class="plot-wrap"><canvas class="plot wide" id="nf-s3c" role="img"></canvas></div>' +
      '<p class="tiny muted nf-s3leg"><span class="nf-key nf-key-1" aria-hidden="true"></span> strain 1 (can ferment), solid line · <span class="nf-key nf-key-2" aria-hidden="true"></span> strain 2 (can’t ferment), dashes · <span class="bio-model">Model data</span></p>' +
      '<label class="slider nf-sl"><span class="slider-top"><span>Time after O₂ is cut off</span><output id="nf-t-out" for="nf-t"></output></span><input type="range" id="nf-t" min="0" max="10" step="1"></label>' +
      '<p class="nf-tread" id="nf-tread" aria-live="polite"></p><p><strong>' + S3.ask + '</strong></p><div class="q-actions" id="nf-revb"></div><div id="nf-rev" aria-live="polite"></div></details></div></div>';

  // Station 1
  var anims = {};
  function molState(id){ return !!S.mol[id]; }
  function paintMol(id, k, rel){
    var m = S1.mols.filter(function(x){ return x.id === id; })[0], on = molState(id), svg = $("#nf-ms-" + id, host);
    svg.innerHTML = molSVG(id, k == null ? (on ? 1 : 0) : k, rel == null ? (on ? 1 : 0) : rel);
    svg.setAttribute("aria-label", (on ? m.loaded : m.name) + " schematic: two nucleotides joined. " + (id === "fad" ? "The flavin ring (highlighted) accepts the electrons; ribitol, two phosphates, ribose and adenine follow." : "The nicotinamide ring (highlighted) accepts the electrons; then ribose, two phosphates, ribose and adenine.") + (id === "nadp" ? " An extra phosphate on the second ribose is circled." : "") + (on ? " Loaded: two electrons and " + (id === "fad" ? "two H⁺" : "one H⁺") + " sit on the ring" + (id === "fad" ? "." : "; one H⁺ has been released.") : " Empty."));
    var mc = $("#nf-mc-" + id, host); mc.textContent = on ? MV.plain(m.cap) : "";
    $(".nf-mname", $('[data-mol="' + id + '"]', host)).textContent = on ? m.loaded : m.name;
  }
  function molBtn(id){ var bx = $("#nf-mb-" + id, host), on = molState(id); MV.keepFocus(bx, function(){ bx.innerHTML = '<button type="button" class="btn ghost sm" data-mt="' + id + '" data-k="nfmt' + id + '" aria-pressed="' + on + '"' + (anims[id] ? " disabled" : "") + ">" + (on ? "Remove 2 H" : "Add 2 H") + "</button>"; }); }
  S1.mols.forEach(function(m){ paintMol(m.id); molBtn(m.id); });
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-mt]"); if (!b || b.disabled) return;
    var id = b.dataset.mt, on = !molState(id); S.mol[id] = on; api.save();
    if (on) { anims[id] = MV.tween({ dur:1300, ease:lin, step:function(k){ paintMol(id, seg(k, 0, 0.7), seg(k, 0.7, 1)); }, done:function(){ anims[id] = null; paintMol(id); molBtn(id); } }); }
    else paintMol(id);
    molBtn(id);
  });

  // Station 2
  var gAnim = null, lastEv = null;
  function paintGauge(id, v){
    var pct = Math.round(v * 100), loadedN = id === "nad" ? "NADH" : "NADPH", emptyN = id === "nad" ? "NAD⁺" : "NADP⁺";
    var gt = $("#nf-gt-" + id, host);
    gt.innerHTML = '<i class="nf-gfill" style="width:' + f1(v * 100) + '%"></i><b class="nf-gmark" style="left:' + f1(REST[id] * 100) + '%"></b>';
    gt.setAttribute("aria-label", S2[id].name + " gauge: " + pct + "% loaded as " + loadedN + ", " + (100 - pct) + "% empty as " + emptyN + ". The cell usually keeps it near " + Math.round(REST[id] * 100) + "% loaded.");
    $("#nf-gv-" + id, host).innerHTML = "<strong>" + loadedN + "</strong> (loaded) " + pct + "% · <strong>" + emptyN + "</strong> (empty) " + (100 - pct) + '% <span class="tiny muted">(▾ usual level)</span>';
  }
  function paintGauges(){ paintGauge("nad", S.g.nad); paintGauge("nadp", S.g.nadp); }
  paintGauges();
  $("#nf-gcap", host).textContent = S2.cap0;
  function evBtns(dis){ $$("[data-ev]", host).forEach(function(b){ b.disabled = dis; }); $("#nf-greset", host).disabled = dis; }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-ev]"), r = e.target.closest("#nf-greset");
    if (r && !r.disabled) { S.g = { nad:REST.nad, nadp:REST.nadp }; api.save(); paintGauges(); $("#nf-gcap", host).textContent = S2.cap0; ["nad", "nadp"].forEach(function(id){ $("#nf-gd-" + id, host).textContent = ""; }); return; }
    if (!b || b.disabled) return;
    var ev = S2.events.filter(function(x){ return x.id === b.dataset.ev; })[0], id = ev.pool, from = S.g[id], to = clamp(from + ev.dir * 0.25, 0.05, 0.95);
    S.g[id] = to; api.save(); lastEv = ev;
    $("#nf-gd-" + id, host).textContent = ev.dir > 0 ? "▲ filling" : "▼ emptying";
    $("#nf-gd-" + (id === "nad" ? "nadp" : "nad"), host).textContent = "";
    $("#nf-gcap", host).innerHTML = ev.cap + " (" + S2[id].name + " gauge " + (ev.dir > 0 ? "fills" : "empties") + "; the other gauge doesn’t move.)";
    evBtns(true);
    gAnim = MV.tween({ dur:900, ease:MV.ease, step:function(k){ paintGauge(id, lerp(from, to, k)); }, done:function(){ gAnim = null; paintGauge(id, to); evBtns(false); } });
  });

  // Station 3
  var cv = $("#nf-s3c", host), plot = new MV.Plot(cv, { xmin:0, xmax:12, ymin:0, ymax:115 });
  var tIn = $("#nf-t", host);
  // plot x = minutes + 2: two minutes with O₂ on the left, O₂ cut off at x = 2
  plot.render = function(){
    var css = MV.css, pen = css("--pen"), ink = css("--ink"), ink2 = css("--ink-2"), t = S.t, X = t + 2;
    plot.draw({ view:{ xmin:0, xmax:12, ymin:0, ymax:115 }, xTicks:{ step:2, fmt:function(v){ return (v - 2) + " min"; } }, yTicks:{ step:20, fmt:function(v){ return v === 100 ? "" : String(v); } }, yLabel:S3.yLabel,
      segments:[{ x1:2, y1:0, x2:2, y2:112, color:ink2, width:1.5, dash:[6, 5] }, { x1:X, y1:0, x2:X, y2:112, color:ink2, width:1.4 }],
      curves:[{ f:function(x){ return rate1(x - 2); }, color:pen, width:3 }, { f:function(x){ return rate2(x - 2); }, color:ink, width:3, dash:[12, 7] }],
      points:[{ x:X, y:rate1(t), r:5.5, color:pen }, { x:X, y:rate2(t), r:5, color:ink }],
      labels:[{ x:1, y:100, text:"100% with O₂", color:ink2, align:"center", dy:-14, bg:true }, { x:2, y:10, text:"O₂ cut off", color:ink2, align:"left", dx:6, bg:true }, { x:11.8, y:rate1(9.8), text:"strain 1", color:ink, align:"right", dy:-14, bg:true }, { x:3.5, y:rate2(1.5), text:"strain 2", color:ink, align:"left", dx:10, bg:true }],
      describe:"Model data. Glycolysis rate against time after O₂ is cut off at 0 min. Both strains start at 100%. Strain 1 (can ferment, solid line) dips and then holds steady at about 70%. Strain 2 (can’t ferment, dashes) falls to 0 within 3 minutes. Marker at " + t + " min: strain 1 " + Math.round(rate1(t)) + "%, strain 2 " + Math.round(rate2(t)) + "%." });
  };
  function tShow(){
    var t = S.t, r1 = Math.round(rate1(t)), r2 = Math.round(rate2(t));
    tIn.value = t; $("#nf-t-out", host).textContent = t + " min";
    tIn.setAttribute("aria-valuetext", t + " minutes: strain 1 " + r1 + "%, strain 2 " + r2 + "%");
    $("#nf-tread", host).innerHTML = "At " + t + " min: <strong>strain 1</strong> " + r1 + "% · <strong>strain 2</strong> " + r2 + "%" + (t >= 3 ? " (strain 2 has stopped)" : "");
    plot.render();
  }
  tIn.addEventListener("input", function(){ S.t = +tIn.value; api.save(); tShow(); });
  tShow();
  function paintRev(){
    var rb = $("#nf-revb", host);
    MV.keepFocus(rb, function(){ rb.innerHTML = S.rev ? "" : '<button type="button" class="btn ghost sm" id="nf-revbtn" data-k="nfrev">Think first, then show the explanation</button>'; });
    $("#nf-rev", host).innerHTML = S.rev ? MV.fbHTML("good", "<strong>Explanation.</strong> " + S3.reveal) : "";
  }
  host.addEventListener("click", function(e){ if (e.target.closest("#nf-revbtn")) { S.rev = true; api.save(); paintRev(); MV.focusFb($("#nf-rev", host)); } });
  paintRev();
}

// ---------- Practice 2: Carrier accounting (N4 number entry with one to three boxes; adapted from SBI4U 09 probs) ----------
function accounting(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(it){ var x = S.items[it.id] || (S.items[it.id] = { vals:[], tries:0, hint:0, solved:false, first:null }); while (x.vals.length < it.labels.length) x.vals.push(""); return x; }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z₂⁺].*$/, "").replace(/\s/g, ""); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function near(v, t){ return Math.abs(v - t) < 1e-6; }
  host.innerHTML = '<p class="how">Type each answer, then press Check. Problems with more than one box need every box filled.</p>' + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it), box = host.querySelector('[data-li="' + it.id + '"]');
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="nf-boxes">' + it.labels.map(function(l, k){ var id = "nf-ac-" + it.id + k; return '<div class="numrow"><label for="' + id + '">' + l + ':</label><input class="numin" id="' + id + '" data-lin="' + it.id + '" data-ix="' + k + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.vals[k]) + '"' + (x.solved ? " disabled" : "") + "></div>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(item(id)).vals[+e.target.dataset.ix] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = item(box.dataset.li), x = ist(it);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    var vs = x.vals.map(parseVal);
    if (vs.some(function(v){ return v == null; })) { msgs[it.id] = it.labels.length > 1 ? "Enter a number in every box." : "Enter a number, such as 12."; paintItem(it); return; }
    var ans = MV.ans(it), ok = vs.every(function(v, k){ return near(v, ans[k]); });
    if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
    else {
      x.tries++;
      var named = (it.wrong || []).filter(function(w){ return w.match ? w.match.every(function(m, k){ return near(vs[k], m); }) : w.any != null ? vs.some(function(v){ return near(v, w.any); }) : false; })[0];
      msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : (it.general || "Check your working.")) + " Try again.";
    }
    api.save(); paintItem(it); MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Fill the carriers ----------
// @component stageCounter — glycolysis / pyruvate oxidation / Krebs cycle columns with carbon tokens and NADH / FADH₂ chips
var task = (function(){
  var api = null, T = null, K = ["g", "p", "k"];
  function read(){ var s = api ? api.S : {}; return { g:s.g == null ? 1 : s.g, p:s.p == null ? 0 : s.p, k:s.k == null ? 0 : s.k }; }
  function nadh(d){ return 2 * d.g + d.p + 3 * d.k; }
  function checks(d){ return [d.p <= 2 * d.g && d.k <= d.p, nadh(d) === 12, d.k >= 1]; }
  function chip(x, y, cls){ return sv("rect", { x:x, y:y, width:17, height:10, rx:3, "class":cls }); }
  function chips(n, x0, y0, cls){ var h = ""; for (var i = 0; i < n; i++) h += chip(x0 + (i % 6) * 22, y0 + Math.floor(i / 6) * 15, cls); return h; }
  function draw(){
    var d = read(), pv = $("#nf-tpv"); if (!pv) return;
    var h = sv("rect", { x:0, y:0, width:520, height:250, rx:10, "class":"nf-tbg" }), i;
    var cols = [[10, "Glycolysis"], [180, "Pyruvate oxidation"], [350, "Krebs cycle"]];
    cols.forEach(function(c, j){ h += sv("rect", { x:c[0], y:8, width:160, height:234, rx:8, "class":"nf-tcol" }) + txt(c[0] + 80, 28, c[1], "nf-tb", "middle"); if (j) h += arrowPath([[c[0] - 9, 70], [c[0] - 1, 70]], "nf-tarr"); });
    // glycolysis: g glucose → 2g pyruvate
    for (i = 0; i < d.g; i++) h += sv("path", { d:hexPath(32 + i * 26, 52, 10), "class":"nf-tglu" });
    h += txt(140, 56, "×" + d.g, "nf-ts", "end");
    for (i = 0; i < 2 * d.g; i++) h += sv("circle", { cx:26 + i * 17, cy:84, r:6.5, "class":"nf-tpyr" });
    h += txt(90, 106, 2 * d.g + " pyruvate made", "nf-ts", "middle");
    // pyruvate oxidation: p pyruvate → p acetyl-CoA
    var okP = d.p <= 2 * d.g;
    for (i = 0; i < d.p; i++) h += sv("circle", { cx:196 + i * 17, cy:52, r:6.5, "class":i < 2 * d.g ? "nf-tpyr" : "nf-tmiss" });
    for (i = 0; i < d.p; i++) h += sv("rect", { x:191 + i * 17, y:78, width:11, height:11, rx:2, "class":i < 2 * d.g ? "nf-tace" : "nf-tmiss" });
    h += txt(260, 106, okP ? d.p + " acetyl-CoA made" : "✗ only " + 2 * d.g + " pyruvate", okP ? "nf-ts" : "nf-ts nf-badt", "middle");
    // Krebs: k turns
    var okK = d.k <= d.p;
    for (i = 0; i < d.k; i++) { var cx = 368 + i * 17; h += sv("circle", { cx:cx, cy:58, r:6.5, "class":i < d.p ? "nf-tturn" : "nf-tmiss" }) + sv("path", { d:head(cx + 6.5, 58, 0, 1, 3.2), "class":"nf-tturn-h" }); }
    h += txt(430, 106, okK ? d.k + " turn" + (d.k === 1 ? "" : "s") : "✗ only " + d.p + " acetyl-CoA", okK ? "nf-ts" : "nf-ts nf-badt", "middle");
    // NADH / FADH₂ chips
    h += txt(18, 128, "+" + 2 * d.g + " NADH", "nf-ts") + chips(2 * d.g, 18, 136, "nf-tn");
    h += txt(188, 128, "+" + d.p + " NADH", "nf-ts") + chips(d.p, 188, 136, "nf-tn");
    h += txt(358, 128, "+" + 3 * d.k + " NADH", "nf-ts") + chips(3 * d.k, 358, 136, "nf-tn");
    h += txt(358, 214, "+" + d.k + " FADH₂", "nf-ts") + chips(d.k, 358, 220, "nf-tf");
    pv.innerHTML = h;
    pv.setAttribute("aria-label", "Stage diagram. Glycolysis: " + d.g + " glucose make " + 2 * d.g + " pyruvate and " + 2 * d.g + " NADH. Pyruvate oxidation: " + d.p + " pyruvate oxidized" + (okP ? "" : " (only " + 2 * d.g + " exist)") + ", " + d.p + " NADH. Krebs cycle: " + d.k + " turns" + (okK ? "" : " (only " + d.p + " acetyl-CoA)") + ", " + 3 * d.k + " NADH and " + d.k + " FADH₂. Total: " + nadh(d) + " NADH, " + d.k + " FADH₂.");
    $("#nf-ttot").innerHTML = "NADH: <b>" + nadh(d) + "</b> <span class=\"tiny muted\">(2 × " + d.g + " + " + d.p + " + 3 × " + d.k + ")</span> · FADH₂: <b>" + d.k + "</b>";
  }
  function lab(k){ var p = k.split("-"); return "<i>g</i> = " + p[0] + ", <i>p</i> = " + p[1] + ", <i>k</i> = " + p[2]; }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content;
      inp.innerHTML = '<div class="nf-tin">' + K.map(function(k){ var I = T.inputs[k]; return '<label class="slider nf-sl"><span class="slider-top"><span>' + I.label + " (<i>" + I.sym + '</i>)</span><output id="nf-to-' + k + '" for="nf-ti-' + k + '"></output></span><input type="range" id="nf-ti-' + k + '" data-ti="' + k + '" min="' + I.min + '" max="' + I.max + '" step="1"></label>'; }).join("") + "</div>";
      pv.innerHTML = '<div class="nf-tpvw"><h4>Your plan</h4><svg id="nf-tpv" viewBox="0 0 520 250" role="img" focusable="false"></svg><p class="nf-ttot" id="nf-ttot" aria-live="polite"></p><p class="tiny muted nf-tleg"><i class="nf-tk nf-tk-n" aria-hidden="true"></i>NADH · <i class="nf-tk nf-tk-f" aria-hidden="true"></i>FADH₂ · brown: glucose, pyruvate, acetyl-CoA · dashed: not possible</p></div>';
      function show(){ var d = read(); K.forEach(function(k){ var el = $("#nf-ti-" + k); el.value = d[k]; $("#nf-to-" + k).textContent = String(d[k]); el.setAttribute("aria-valuetext", T.inputs[k].label + ": " + d[k]); }); draw(); }
      inp.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.ti; if (!k) return; a.S[k] = +e.target.value; a.save(); show(); a.update(); });
      show();
      var chk = $("#task-check");
      if (chk) chk.addEventListener("click", function(){ setTimeout(function(){
        var g = $("#task-fb .fb.good"); if (!g || MV.taskState().found.length < 3) return;
        var ps = g.querySelectorAll("p"); if (ps[1] && T.more) ps[1].innerHTML = ps[1].innerHTML.replace(T.more, "You’ve found all three answers.");
      }, 0); });
    },
    read:read,
    valid:function(){ return true; },
    checks:checks,
    key:function(d){ return d.g + "-" + d.p + "-" + d.k; },
    label:lab,
    text:function(k){ var p = k.split("-"); return "g = " + p[0] + ", p = " + p[1] + ", k = " + p[2]; }
  };
})();

// ---------- hero: an electron taxi (storyboard: malate on its dehydrogenase; 2 H → 2 e⁻ + 2 H⁺; NAD⁺ taxi loads 2 e⁻ + 1 H⁺;
// the second H⁺ drifts away; the taxi drives to complex I, unloads and returns empty) ----------
function hero(f){
  var box = $("#nf-hero"); if (!box) return;
  var cap = f && f.cap, lastCap = -1, sub = MV.C.explore.subs[0];
  box.innerHTML = '<svg viewBox="0 0 ' + VW + " " + VH + '" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var CAPS = [
    "Malate sits on its dehydrogenase. The enzyme removes 2 H atoms.",
    "Each H splits into an electron (e⁻) and a proton (H⁺). An empty NAD⁺ taxi drives in.",
    "NAD⁺ takes both electrons and one H⁺: now it’s NADH. The second H⁺ drifts into the solution.",
    "NADH drives to complex I, drops its electrons and returns empty, as NAD⁺, ready for another load."];
  function setCap(i){ if (cap && i !== lastCap) { cap.textContent = CAPS[i]; lastCap = i; } }
  var ctx = { sub:sub, car:"nad", ok:true, slot:0, driveIn:true, stay:true };
  function frame(T){
    var h;
    if (T < 0.58) { var kl = T / 0.58 * 0.88; h = baseSVG({ sub:sub, pill:false, hAtoms:false, taxi:null, hSol:0, lit:null }) + loadOverlay(ctx, kl); setCap(kl < 0.17 ? 0 : kl < 0.5 ? 1 : 2); }
    else {
      var u = (T - 0.58) / 0.42, door = [CX.I.x, LANE], path = [TP, [TP[0], LANE], door];
      var kin = sm(seg(u, 0, 0.3)), ke = sm(seg(u, 0.3, 0.42)), kf = seg(u, 0.32, 0.42), kr = seg(u, 0.42, 0.88), kb = sm(seg(u, 0.56, 0.92));
      var tp = u < 0.56 ? polyAt(path, kin) : polyAt(path.slice().reverse(), kb);
      h = baseSVG({ sub:sub, pill:true, prod:true, hAtoms:false, taxi:null, hSol:1, lit:null });
      h += taxiSVG(tp, "nad", 1 - kf, kf > 0.5 ? "NAD⁺" : "NADH");
      var R = ROUTE.I;
      if (u >= 0.3 && u < 0.42) h += eTok(lp([door[0] - 9, door[1]], [R[0][0] - 6, R[0][1]], ke)) + eTok(lp([door[0] + 9, door[1]], [R[0][0] + 6, R[0][1]], ke));
      else if (u >= 0.42 && kr < 1) h += eTok(polyAt(R, kr)) + eTok(polyAt(R, Math.max(0, kr - 0.045)));
      h += pumpsSVG(litMap("I", u < 0.42 ? -1 : kr));
      setCap(3);
    }
    svg.innerHTML = h;
  }
  if (MV.reduceMotion) { svg.innerHTML = baseSVG({ sub:sub, pill:false, hAtoms:false, taxi:null, hSol:0, lit:null }) + loadOverlay(ctx, 0.88); setCap(2); return; }
  frame(0);
  MV.tween({ dur:12000, ease:lin, step:frame, done:function(){ frame(1); } });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ accounting:accounting },
  task:task
});
})();
