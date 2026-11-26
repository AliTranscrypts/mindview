// SBI4U 05 Noncyclic Electron Flow: hero (an electron's run up the Z), The Z-scheme climb (S2 Z-scheme stepper with an
// S4 membrane view), Cyclic vs noncyclic (cyclic loop, Emerson data with a molecule zoom, S3 ATP budget bars), ordering and
// electron accounting (Practice), "Feed the Calvin cycle" (task).
(function(){
"use strict";
var $ = MV.$;

// ---------- small SVG helpers (from SBI4U 03) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "nz-lab", "text-anchor":anchor || null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!segs.length) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
// photons: wavy arrows in ink (course plan §3)
function wavy(x1, y1, x2, y2){
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, n = Math.max(2, Math.round(L / 2)), d = "";
  for (var i = 0; i <= n; i++) { var s = L * i / n, o = 3 * Math.sin(s / 8 * 2 * Math.PI) * Math.min(1, (L - s) / 7); d += (i ? "L" : "M") + f1(x1 + ux * s - uy * o) + " " + f1(y1 + uy * s + ux * o); }
  return d;
}
function head(x, y, ux, uy, s){ s = s || 6; return "M" + f1(x - ux * s - uy * s * 0.6) + " " + f1(y - uy * s + ux * s * 0.6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * s + uy * s * 0.6) + " " + f1(y - uy * s - ux * s * 0.6); }
function photonSVG(x1, y1, x2, y2, cls){ var L = Math.hypot(x2 - x1, y2 - y1) || 1; return L < 2 ? "" : sv("path", { d:wavy(x1, y1, x2, y2) + " " + head(x2, y2, (x2 - x1) / L, (y2 - y1) / L), "class":cls || "nz-photon" }); }
// arrow from a to b, shortened by ra at the start and rb at the end
function arrow(a, b, ra, rb, cls, noHead){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  var x1 = a[0] + ux * ra, y1 = a[1] + uy * ra, x2 = b[0] - ux * rb, y2 = b[1] - uy * rb;
  return sv("path", { d:"M" + f1(x1) + " " + f1(y1) + " L" + f1(x2) + " " + f1(y2), "class":cls }) + (noHead ? "" : sv("path", { d:head(x2, y2, ux, uy, 6), "class":cls + " nz-ah" }));
}
function pill(x, y, label, cls, w, op){
  w = w || Math.max(24, label.length * 7 + 10);
  return '<g' + (op != null && op < 1 ? ' opacity="' + f1(op * 100) / 100 + '"' : "") + ">" + sv("rect", { x:x - w / 2, y:y - 8.5, width:w, height:17, rx:8.5, "class":cls }) + txt(x, y + 4, label, "nz-tokt", "middle") + "</g>";
}

// ---------- @component radioGroup (copied from SBI4U 03 / 01 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list)}
function radios(host, o){
  var val = String(o.value);
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (x.dis ? -1 : tab) + '" data-rg="' + x.id + '"' + (x.dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, setOptions:function(list){ o.options = list; paint(); } };
}

// ---------- @component S2 zScheme — Z-scheme pathway stepper (course plan S2, adapted for module 05; module 06 can reuse the model):
// a deterministic carrier state machine (zNew / zFire / zSettle / zJam: each carrier empty or full, NADP⁺ reductase holds 2),
// an energy-diagram renderer (zSVG) and timed movers (toAnim / frame) shared with the S4 membrane view, the hero, Part 3's
// cyclic loop and the task preview. ----------
var NODES = ["h2o", "p680", "p680x", "pq", "b6f", "pc", "p700", "p700x", "fd", "fnr", "nadp"];
var SLOT = { p680:1, pq:1, b6f:1, pc:1, p700:1, fd:1, fnr:1 };
// energy diagram, viewBox 480 × 320 (electron energy rises upward); lp1/lp2 are the corners of the cyclic return path
var ZP = { h2o:[46, 290], p680:[96, 262], p680x:[96, 64], pq:[150, 110], b6f:[200, 148], pc:[250, 186], p700:[300, 216], p700x:[300, 30], fd:[350, 72], fnr:[400, 110], nadp:[452, 148], lp1:[350, 12], lp2:[150, 12] };
var ZR = { h2o:17, p680:13, p680x:0, pq:13, b6f:13, pc:13, p700:13, p700x:0, fd:13, fnr:13, nadp:20 };
// membrane view, viewBox 720 × 300: stroma on top, membrane 112–168, lumen below
var MP = { h2o:[100, 252], p680:[100, 162], p680x:[100, 120], pq:[186, 140], b6f:[262, 140], pc:[338, 214], p700:[440, 162], p700x:[440, 120], fd:[520, 82], fnr:[588, 72], nadp:[664, 40] };
var LOOP = ["p700", "p700x", "fd", "lp1", "lp2", "pq", "b6f", "pc", "p700"];
// animation windows (fractions of one flash) for each kind of move
var PH = { main:[0.06, 0.56], join:[0.46, 0.62], refill:[0.56, 0.8], shift:[0.7, 0.95], water:[0.52, 0.82], water2:[0.82, 0.82] };
var DEF_SET = { water:"on", nadp:"plenty", inh:"none" };

function seg(a, b){ var i = NODES.indexOf(a), j = NODES.indexOf(b); return NODES.slice(i, j + 1); }
function pts(keys, map){ return keys.map(function(k){ return map[k]; }); }
function fracAt(keys, key, map){
  var p = pts(keys, map), idx = keys.indexOf(key), tot = 0, upto = 0;
  for (var i = 1; i < p.length; i++) { var l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); tot += l; if (i <= idx) upto += l; }
  return tot ? upto / tot : 0;
}
function zNew(){ return { p680:1, pq:0, b6f:0, pc:0, p700:1, fd:0, fnr:0, steps:0, flA:0, flB:0, phA:0, phB:0, lost:0, eF:0, nadph:0, h2o:0, o2:0, hp:0, haloA:"", haloB:"", msg:"" }; }
function pcCap(set){ return set.inh === "pc" ? 0 : 1; }
// dark steps after any event: electrons move into empty carriers downstream; P680⁺ refills from water; 2 e⁻ at FNR + NADP⁺ → NADPH
function zSettle(z, set, raw){
  function mv(from, to, ph){ if (raw) raw.moves.push({ from:from, to:to, ph:ph }); }
  function pop(kind, at, ph){ if (raw) raw.pops.push({ kind:kind, at:at, ph:ph }); }
  for (var guard = 0; guard < 24; guard++) {
    var ch = false;
    if (!z.p700 && z.pc) { z.pc = 0; z.p700 = 1; mv("pc", "p700", "refill"); ch = true; }
    if (pcCap(set) && !z.pc && z.b6f) { z.b6f = 0; z.pc = 1; mv("b6f", "pc", "shift"); ch = true; }
    if (!z.b6f && z.pq) { z.pq = 0; z.b6f = 1; z.hp++; mv("pq", "b6f", "shift"); pop("h", "b6f", "shift"); ch = true; }
    if (z.fd && z.fnr < 2) { z.fd = 0; z.fnr++; z.eF++; mv("fd", "fnr", "shift"); ch = true; }
    if (z.fnr >= 2 && set.nadp === "plenty") { z.fnr = 0; z.nadph++; mv("fnr", "nadp", "join"); mv("fnr", "nadp", "join"); if (raw) raw.nadph++; ch = true; }
    if (!z.p680 && set.water === "on" && set.inh !== "dcmu") {
      z.p680 = 1; z.steps++; z.hp++; mv("h2o", "p680", "water"); pop("h", "h2o", "water");
      if (z.steps >= 4) { z.steps = 0; z.o2++; z.h2o += 2; pop("o2", "h2o", "water2"); }
      ch = true;
    }
    if (!ch) break;
  }
}
// one flash of Lamp A (680 nm, PSII) or Lamp B (700 nm, PSI) -> raw event {moves, pops, nadph, lost, halo}
function zFire(z, set, lamp){
  var raw = { lamp:lamp, moves:[], pops:[], nadph:0, lost:false, halo:"" };
  function lose(node, msg){ z.lost++; raw.lost = true; raw.halo = node; if (node === "p680") z.haloA = msg; else z.haloB = msg; z.msg = msg; }
  if (lamp === "A") {
    z.flA++;
    if (set.inh === "dcmu") { lose("p680", "PSII is excited, but DCMU blocks the way to plastoquinone: the energy is lost as fluorescence."); return raw; }
    if (!z.p680) { lose("p680", "P680⁺ is waiting for an electron: with the water off, it can’t be refilled."); return raw; }
    if (z.pq) { lose("p680", "Plastoquinone is full, so P680 can’t pass its electron on: the energy is lost as fluorescence."); return raw; }
    z.p680 = 0; z.phA++; z.haloA = "";
    var dest = "pq";
    if (!z.b6f) { dest = "b6f"; z.hp++; raw.pops.push({ kind:"h", at:"b6f", ph:"main" }); if (pcCap(set) && !z.pc) { dest = "pc"; if (!z.p700) dest = "p700"; } }
    z[dest] = 1;
    raw.moves.push({ from:"p680", to:dest, ph:"main" });
    z.msg = { pq:"Light lifted an electron from P680; it stopped at plastoquinone, because the carriers ahead are full.",
      b6f:"Light lifted an electron from P680; it stopped at cytochrome b₆f (1 H⁺ pumped into the lumen).",
      pc:"Light lifted an electron from P680; it slid through plastoquinone and b₆f (1 H⁺ pumped) to plastocyanin, where it waits.",
      p700:"Light lifted an electron from P680; it slid all the way to P700 and refilled it (1 H⁺ pumped at b₆f)." }[dest];
    if (set.water === "on") z.msg += " P680⁺ took a replacement electron from water (1 H⁺ released).";
    else z.msg += " With the water off, P680⁺ stays empty.";
  } else {
    z.flB++;
    if (!z.p700) { lose("p700", "P700 is waiting for an electron from PSII."); return raw; }
    if (z.fd) { lose("p700", "Ferredoxin is full: the energy is lost as heat and fluorescence."); return raw; }
    z.p700 = 0; z.phB++; z.haloB = "";
    var d;
    if (z.fnr < 2) {
      z.fnr++; z.eF++; d = "fnr";
      if (z.fnr === 2 && set.nadp === "plenty") { z.fnr = 0; z.nadph++; raw.nadph++; d = "nadp"; raw.moves.push({ from:"fnr", to:"nadp", ph:"join" }); }
    } else { z.fd = 1; d = "fd"; }
    raw.moves.unshift({ from:"p700", to:d, ph:"main" });
    z.msg = d === "nadp" ? "Light lifted an electron from P700 through ferredoxin to NADP⁺ reductase: 2 electrons + H⁺ from the stroma + NADP⁺ made NADPH." :
      d === "fnr" ? "Light lifted an electron from P700 through ferredoxin to NADP⁺ reductase, which waits for a second one." :
      "Light lifted an electron from P700, but it stopped at ferredoxin: NADP⁺ reductase is full, with no NADP⁺ to reduce.";
  }
  var hadP700 = z.p700;
  zSettle(z, set, raw);
  if (lamp === "B") z.msg += !z.p700 ? " P700 is waiting for an electron from PSII." : !hadP700 ? " P700 took the waiting electron from plastocyanin." : "";
  return raw;
}
function zJam(z, set){
  if (set.inh === "dcmu") return "Blocked between PSII and plastoquinone (DCMU): PSII’s energy is lost as fluorescence";
  if (set.nadp !== "plenty" && z.fd) return "Electrons backing up at ferredoxin: no NADP⁺";
  if (set.inh === "pc" && z.b6f) return "Electrons backing up at cytochrome b₆f: no plastocyanin";
  if (set.water !== "on" && !z.p680) return "P680 is waiting for an electron: no water to split";
  if (z.pq && z.b6f && z.pc && z.p700) return "Electrons backing up at plastocyanin: PSI isn’t sending them on";
  if (!z.p700 && z.haloB) return "P700 is waiting for an electron from PSII";
  return "";
}
// raw model event -> timed animation {flash, moves:[{path, t0, t1, to}], pops:[{kind, at, t0}], nadphT}
function toAnim(raw){
  var ev = { flash:raw.lamp, halo:raw.halo, moves:[], pops:[], nadphT:raw.nadph ? PH.join[1] : null }, main = null;
  raw.moves.forEach(function(m){
    var w = PH[m.ph], path = seg(m.from, m.to);
    if (m.ph === "main") main = path;
    ev.moves.push({ path:path, t0:w[0], t1:w[1], to:SLOT[m.to] ? m.to : null });
  });
  raw.pops.forEach(function(p){
    var w = PH[p.ph], t0 = w[1];
    if (p.ph === "main" && main) t0 = w[0] + (w[1] - w[0]) * fracAt(main, "b6f", ZP);
    else if (p.ph === "water") t0 = w[0];
    ev.pops.push({ kind:p.kind, at:p.at, t0:t0 });
  });
  return ev;
}
// what is in flight at time t (0–1) of an animated event
function frame(ev, t){
  var r = { movers:[], pops:[], hide:{}, glowA:0, glowB:0, photonA:-1, photonB:-1, nadph:false, pulse:"" };
  if (!ev) return r;
  (ev.moves || []).forEach(function(m){
    if (t >= m.t1) return;
    if (m.to) r.hide[m.to] = (r.hide[m.to] || 0) + 1;
    r.movers.push({ path:m.path, k:clamp((t - m.t0) / (m.t1 - m.t0), 0, 1) });
  });
  (ev.pops || []).forEach(function(p){ var k = (t - p.t0) / 0.3; if (k >= 0 && k <= 1) r.pops.push({ kind:p.kind, at:p.at, k:k }); });
  var g = t < 0.32 ? 1 - t / 0.32 : 0, ph = t < 0.34 ? clamp(t / 0.16, 0, 1) : -1;
  if (ev.flash === "A") { r.glowA = g; r.photonA = ph; } else if (ev.flash === "B") { r.glowB = g; r.photonB = ph; }
  if (ev.halo && t < 0.6) r.pulse = ev.halo;
  if (ev.nadphT != null && t >= ev.nadphT) r.nadph = true;
  return r;
}
// shared overlay: electrons (static minus in-flight), movers, pops
function eDot(x, y, r){ return sv("circle", { cx:x, cy:y, r:r || 6.2, "class":"nz-e" }); }
function overlay(o, map){
  var fr = o.fr, c = o.cnt, h = "";
  Object.keys(SLOT).forEach(function(k){
    var n = (c[k] || 0) - (fr.hide[k] || 0), p = map[k]; if (!p || n <= 0) return;
    if (n === 1) h += eDot(p[0], p[1]); else h += eDot(p[0] - 5, p[1], 5) + eDot(p[0] + 5, p[1], 5);
  });
  fr.pops.forEach(function(pp){
    var p = map[pp.at]; if (!p) return; var k = pp.k, op = 1 - Math.max(0, k - 0.6) / 0.4;
    if (pp.kind === "h") h += o.mem ? pill(p[0] + 4 * k, p[1] + (pp.at === "b6f" ? 70 : 26) * k, "H⁺", "nz-tok-h", 26, op) : pill(p[0] + 16 * k, p[1] + 26 * k, "H⁺", "nz-tok-h", 26, op);
    else if (pp.kind === "o2") h += o.mem ? pill(p[0] - 50 * k, p[1] - 14 * k, "O₂", "nz-tok-o", 28, op) : pill(p[0], p[1] - 14 - 44 * k, "O₂", "nz-tok-o", 28, op);
  });
  fr.movers.forEach(function(m){ var q = polyAt(pts(m.path, map), m.k); h += eDot(q[0], q[1]); });
  return h;
}
function lampSVG(x, y, letter, nm, on, glow){
  var h = "";
  if (glow > 0) h += sv("circle", { cx:x, cy:y, r:12 + 8 * glow, "class":"nz-glow", opacity:f1(glow * 80) / 100 });
  if (on) h += sv("path", { d:"M" + (x - 15) + " " + (y - 9) + " l-5 -3 M" + (x + 15) + " " + (y - 9) + " l5 -3 M" + x + " " + (y - 15) + " v-5", "class":"nz-rays" });
  h += sv("circle", { cx:x, cy:y, r:10, "class":"nz-lamp" + (on || glow > 0.05 ? " on" : "") }) + sv("rect", { x:x - 5, y:y + 9, width:10, height:7, rx:1.5, "class":"nz-lbase" });
  return h + txt(x, y + 4, letter, "nz-lampt", "middle") + txt(x, y + 30, nm, "nz-sub", "middle") + (on ? txt(x, y + 42, "on", "nz-sub", "middle") : "");
}
function blockSVG(x, y){ return '<g class="nz-block">' + sv("circle", { cx:x, cy:y, r:8 }) + sv("rect", { x:x - 5, y:y - 1.6, width:10, height:3.2, rx:1 }) + "</g>"; }
function haloSVG(p, label, pulse, lx, ly, anchor){
  return sv("circle", { cx:p[0], cy:p[1], r:pulse ? 20 : 18, "class":"nz-halo" }) + txt(lx, ly, label, "nz-halo-t", anchor || "start");
}
// energy diagram. o: {cnt, steps, set, fr, lampA, lampB ("off"|"on"), haloA, haloB, loop, loopOn, nums, noLamps}
function zSVG(o){
  var M = ZP, fr = o.fr, set = o.set || DEF_SET, h = "";
  h += sv("path", { d:"M16 312 V20", "class":"nz-axis" }) + sv("path", { d:head(16, 14, 0, -1, 6), "class":"nz-axis nz-ah" });
  h += '<text class="nz-sub" transform="translate(9 168) rotate(-90)" text-anchor="middle">electron energy</text>';
  if (o.loop) {
    h += sv("path", { d:"M350 59 V12 H150 V93", "class":"nz-loop" + (o.loopOn ? " on" : "") }) + sv("path", { d:head(150, 95, 0, 1, 6), "class":"nz-loop nz-ah" + (o.loopOn ? " on" : "") });
    h += txt(158, 27, "cyclic return", "nz-sub");
  }
  // the Z
  h += arrow(M.h2o, M.p680, ZR.h2o, ZR.p680, "nz-thin");
  h += arrow(M.p680, M.p680x, ZR.p680, 0, "nz-up");
  [["p680x", "pq"], ["pq", "b6f"], ["b6f", "pc"], ["pc", "p700"]].forEach(function(s){ h += arrow(M[s[0]], M[s[1]], ZR[s[0]], ZR[s[1]], "nz-line"); });
  h += arrow(M.p700, M.p700x, ZR.p700, 0, "nz-up");
  [["p700x", "fd"], ["fd", "fnr"], ["fnr", "nadp"]].forEach(function(s){ h += arrow(M[s[0]], M[s[1]], ZR[s[0]], ZR[s[1]], "nz-line"); });
  // excited levels
  [["p680x", "P680*"], ["p700x", "P700*"]].forEach(function(l){ var p = M[l[0]]; h += sv("path", { d:"M" + (p[0] - 14) + " " + p[1] + " H" + (p[0] + 14), "class":"nz-lvl" }) + txt(p[0] - 18, p[1] + 4, l[1], "nz-sub", "end"); });
  // carriers
  var miss = set.inh === "pc";
  ["p680", "pq", "b6f", "pc", "p700", "fd", "fnr"].forEach(function(k){ var p = M[k]; h += sv("rect", { x:p[0] - 11, y:p[1] - 11, width:22, height:22, rx:5, "class":"nz-node" + (k === "pc" && miss ? " miss" : "") }); });
  var LB = { p680:["P680", "PSII"], pq:["PQ"], b6f:["b₆f"], pc:["PC", miss ? "missing" : ""], p700:["P700", "PSI"], fd:["Fd"], fnr:["FNR"] };
  Object.keys(LB).forEach(function(k){ var p = M[k]; h += txt(p[0] + 16, p[1] + 5, LB[k][0]) + (LB[k][1] ? txt(p[0] + 16, p[1] + 18, LB[k][1], "nz-sub") : ""); });
  // water and NADP⁺
  h += pill(M.h2o[0], M.h2o[1], "H₂O", "nz-tok-o", 38);
  for (var i = 0; i < 4; i++) h += sv("circle", { cx:M.h2o[0] - 15 + i * 10, cy:M.h2o[1] + 18, r:3.2, "class":"nz-pip" + (i < (o.steps || 0) ? " on" : "") });
  var np = M.nadp;
  if (set.nadp !== "plenty") h += sv("rect", { x:np[0] - 25, y:np[1] - 11, width:50, height:22, rx:11, "class":"nz-node miss" }) + txt(np[0], np[1] + 4, "NADP⁺", "nz-sub", "middle") + txt(np[0], np[1] + 26, "used up", "nz-halo-t", "middle");
  else if (fr.nadph) h += pill(np[0], np[1], "NADPH", "nz-tok-n", 52);
  else h += sv("rect", { x:np[0] - 25, y:np[1] - 11, width:50, height:22, rx:11, "class":"nz-node" }) + txt(np[0], np[1] + 4, "NADP⁺", "nz-lab nz-lab-s", "middle");
  // lamps and photons
  if (!o.noLamps) {
    h += lampSVG(44, 166, "A", "680 nm", o.lampA === "on", fr.glowA) + lampSVG(252, 70, "B", "700 nm", o.lampB === "on", fr.glowB);
    if (fr.photonA >= 0) h += photonSVG(58, 166, lerp(58, 88, fr.photonA), 166);
    if (fr.photonB >= 0) h += photonSVG(265, 74, lerp(265, 291, fr.photonB), lerp(74, 98, fr.photonB));
  }
  if (fr.glowA > 0) h += sv("circle", { cx:M.p680[0], cy:M.p680[1], r:16, "class":"nz-glow", opacity:f1(fr.glowA * 70) / 100 });
  if (fr.glowB > 0) h += sv("circle", { cx:M.p700[0], cy:M.p700[1], r:16, "class":"nz-glow", opacity:f1(fr.glowB * 70) / 100 });
  // inhibitors
  if (set.inh === "dcmu") h += blockSVG(123, 87) + txt(111, 91, "DCMU", "nz-blockt", "end");
  if (miss) h += blockSVG(225, 167);
  // halos (fluorescence, labelled in text)
  if (o.haloA) h += haloSVG(M.p680, "fluorescence", fr.pulse === "p680", 116, 241);
  if (o.haloB) h += haloSVG(M.p700, "energy lost", fr.pulse === "p700", 318, 250);
  h += overlay(o, M);
  if (o.nums) {
    [[112, 190, 1], [176, 146, 2], [318, 128, 3], [420, 80, 4], [74, 266, 5]].forEach(function(n){ h += '<g class="nz-num">' + sv("circle", { cx:n[0], cy:n[1], r:9 }) + txt(n[0], n[1] + 4, String(n[2]), "nz-numt", "middle") + "</g>"; });
  }
  return h;
}

// ---------- @component S4 membraneSim — thylakoid membrane cross-section (course plan S4; modules 06, 12, 16 and 17 reuse it):
// stroma / membrane / lumen bands, complexes at fixed x, carrier seats with electron dots, H⁺ dots that pile up in the lumen
// (seeded positions, so the picture is the same on every device), movers along the same node paths as the Z diagram. ----------
var HDOTS = (function(){
  var r = MV.bio.rng("nz-lumen-h"), out = [], n = 0;
  while (out.length < 72 && n++ < 2000) {
    var x = r.range(14, 706), y = r.range(200, 286);
    if ((x > 64 && x < 140 && y > 236) || (x > 318 && x < 360 && y < 234) || (x > 600 && y > 270) || (x < 120 && y > 278)) continue;
    if (out.some(function(p){ return Math.hypot(p[0] - x, p[1] - y) < 13; })) continue;
    out.push([x, y]);
  }
  return out;
})();
function memSVG(o){
  var M = MP, fr = o.fr, set = o.set || DEF_SET, h = "", miss = set.inh === "pc";
  h += sv("rect", { x:0, y:0, width:720, height:112, "class":"nz-stroma" }) + sv("rect", { x:0, y:112, width:720, height:56, "class":"nz-core" }) + sv("rect", { x:0, y:168, width:720, height:132, "class":"nz-lumen" });
  h += sv("path", { d:"M0 112 H720 M0 168 H720", "class":"nz-mline" });
  h += txt(10, 18, "stroma", "nz-sub") + txt(712, 145, "thylakoid membrane", "nz-sub", "end") + txt(10, 293, "thylakoid lumen", "nz-sub");
  // H⁺ that has been added to the lumen
  var nh = Math.min(o.hp || 0, HDOTS.length);
  for (var i = 0; i < nh; i++) h += sv("circle", { cx:HDOTS[i][0], cy:HDOTS[i][1], r:3.4, "class":"nz-hdot" });
  h += txt(712, 293, "H⁺ added to the lumen: " + (o.hp || 0) + (o.hp > HDOTS.length ? " (dots show " + HDOTS.length + ")" : ""), "nz-sub", "end");
  // complexes
  h += sv("rect", { x:52, y:90, width:96, height:104, rx:18, "class":"nz-cx" }) + txt(62, 105, "PSII", "nz-lab nz-lab-s");
  h += sv("rect", { x:226, y:92, width:72, height:100, rx:16, "class":"nz-cx" }) + txt(234, 107, "b₆f", "nz-lab nz-lab-s");
  h += sv("rect", { x:392, y:90, width:96, height:104, rx:18, "class":"nz-cx" }) + txt(402, 105, "PSI", "nz-lab nz-lab-s");
  h += sv("rect", { x:560, y:55, width:56, height:34, rx:12, "class":"nz-cx" }) + txt(588, 50, "FNR", "nz-lab nz-lab-s", "middle");
  // the electron route (faint) through the seats
  var route = ["p680", "p680x", "pq", "b6f", "pc", "p700", "p700x", "fd", "fnr", "nadp"];
  for (var j = 1; j < route.length; j++) h += arrow(M[route[j - 1]], M[route[j]], j === 1 || j === 6 ? 7 : 12, route[j] === "nadp" ? 30 : route[j] === "p680x" || route[j] === "p700x" ? 7 : 12, "nz-route");
  // mobile carriers as boxes
  [["pq", "PQ", 0, 24], ["pc", "PC", 0, 26], ["fd", "Fd", 0, 26]].forEach(function(c){ var p = M[c[0]]; h += sv("rect", { x:p[0] - 11, y:p[1] - 11, width:22, height:22, rx:5, "class":"nz-node" + (c[0] === "pc" && miss ? " miss" : "") }) + txt(p[0] + c[2], p[1] + c[3], c[1] + (c[0] === "pc" && miss ? " missing" : ""), "nz-lab nz-lab-s", "middle"); });
  // reaction centre seats
  [["p680", "P680"], ["p700", "P700"]].forEach(function(c){ var p = M[c[0]]; h += sv("circle", { cx:p[0], cy:p[1], r:10, "class":"nz-seat" }) + txt(p[0] + 15, p[1] + 4, c[1], "nz-sub"); });
  [["p680x"], ["p700x"]].forEach(function(c){ var p = M[c[0]]; h += sv("path", { d:"M" + (p[0] - 12) + " " + p[1] + " H" + (p[0] + 12), "class":"nz-lvl" }); });
  h += sv("circle", { cx:M.b6f[0], cy:M.b6f[1], r:10, "class":"nz-seat" }) + sv("circle", { cx:M.fnr[0], cy:M.fnr[1], r:12, "class":"nz-seat" });
  // water, NADP⁺
  h += pill(M.h2o[0], M.h2o[1], "H₂O", "nz-tok-o", 38);
  for (var s = 0; s < 4; s++) h += sv("circle", { cx:M.h2o[0] - 15 + s * 10, cy:M.h2o[1] + 18, r:3.2, "class":"nz-pip" + (s < (o.steps || 0) ? " on" : "") });
  var np = M.nadp;
  if (set.nadp !== "plenty") h += sv("rect", { x:np[0] - 28, y:np[1] - 11, width:56, height:22, rx:11, "class":"nz-node miss" }) + txt(np[0], np[1] + 4, "NADP⁺", "nz-sub", "middle") + txt(np[0], np[1] + 26, "used up", "nz-halo-t", "middle");
  else if (fr.nadph) h += pill(np[0], np[1], "NADPH", "nz-tok-n", 56);
  else h += sv("rect", { x:np[0] - 28, y:np[1] - 11, width:56, height:22, rx:11, "class":"nz-node" }) + txt(np[0], np[1] + 4, "NADP⁺", "nz-lab nz-lab-s", "middle");
  // lamps and photons
  h += lampSVG(36, 36, "A", "680 nm", o.lampA === "on", fr.glowA) + lampSVG(376, 36, "B", "700 nm", o.lampB === "on", fr.glowB);
  if (fr.photonA >= 0) h += photonSVG(50, 44, lerp(50, 90, fr.photonA), lerp(44, 100, fr.photonA));
  if (fr.photonB >= 0) h += photonSVG(390, 44, lerp(390, 430, fr.photonB), lerp(44, 100, fr.photonB));
  if (fr.glowA > 0) h += sv("circle", { cx:M.p680[0], cy:M.p680[1], r:15, "class":"nz-glow", opacity:f1(fr.glowA * 70) / 100 });
  if (fr.glowB > 0) h += sv("circle", { cx:M.p700[0], cy:M.p700[1], r:15, "class":"nz-glow", opacity:f1(fr.glowB * 70) / 100 });
  if (set.inh === "dcmu") h += blockSVG(143, 130) + txt(143, 104, "DCMU", "nz-blockt", "middle");
  if (miss) h += blockSVG(300, 177);
  if (o.haloA) h += haloSVG(M.p680, "fluorescence", fr.pulse === "p680", 100, 210, "middle");
  if (o.haloB) h += haloSVG(M.p700, "energy lost", fr.pulse === "p700", 440, 210, "middle");
  h += overlay({ cnt:o.cnt, fr:fr, mem:true }, M);
  return h;
}

// ---------- Explore: The Z-scheme climb ----------
var EXP = null, P3 = null;
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { view:"z", set:{ water:"on", nadp:"plenty", inh:"none" }, z:zNew(), path:[], tc3:{ nadph:"", photons:"", h2o:"", hplus:"" } };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  var z0 = zNew(); Object.keys(z0).forEach(function(k){ if (S.z[k] === undefined) S.z[k] = z0[k]; });
  var cont = { A:false, B:false }, alt = 0, tick = null, shown = false, busy = false, anim = null, cur = null, curT = 1, lastRead = 0, lastSave = 0, timers = [], readSig = "";
  var PATH = [6, 2, 8, 0, 4, 1, 7, 3, 5].map(function(i){ return C.pathParts[i]; });     // shown out of the answer order
  var PN = {}; C.pathParts.forEach(function(p){ PN[p[0]] = p[1]; });
  host.innerHTML = '<div class="pg nz-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="nz-stage" id="nz-zbox"><svg id="nz-z" viewBox="0 0 480 320" role="img" focusable="false"></svg></div>' +
    '<div class="nz-mscroll" id="nz-mbox" hidden><div class="nz-stage nz-stage-m"><svg id="nz-m" viewBox="0 0 720 300" role="img" focusable="false"></svg></div></div>' +
    '<p class="nz-cap" id="nz-cap" aria-live="polite"></p>' +
    '<p class="nz-legend tiny"><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" class="nz-e"/></svg>electron</span><span><i class="bio-sw" style="background:var(--bio-h)"></i>H⁺</span><span><i class="bio-sw" style="background:var(--bio-nadh)"></i>NADPH</span><span><i class="bio-sw" style="background:var(--bio-o2)"></i>O₂ and H₂O</span><span><svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" class="nz-halo"/></svg>energy lost (fluorescence)</span><span><svg viewBox="0 0 18 18" aria-hidden="true"><g class="nz-block"><circle cx="9" cy="9" r="8"/><rect x="4" y="7.4" width="10" height="3.2" rx="1"/></g></svg>block</span></p>' +
    '<p class="nz-legend tiny nz-abbr">' + C.legendAbbr + "</p>" +
    '<div class="nz-path" id="nz-path"></div></div>' +
    '<div class="pg-ctrl"><fieldset class="nz-fs" id="nz-fs"><legend class="vh">Z-scheme controls</legend>' +
      '<div class="nz-row" id="nz-view"></div>' +
      lampRow("A", "680 nm", "mostly PSII") + lampRow("B", "700 nm", "mostly PSI") +
      '<div class="nz-row" id="nz-water"></div><div class="nz-row" id="nz-nadp"></div><div class="nz-row" id="nz-inh"></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="nz-reset" data-k="nzreset">Reset</button><span class="tiny muted">Empties every carrier (P700 keeps one electron) and turns the lamps off.</span></div>' +
      '<div class="nz-tc3"><h4>' + C.tc3Title + "</h4>" + C.tc3Boxes.map(function(b){ return '<div class="numrow"><label for="nz-b-' + b[0] + '">' + b[1] + ':</label><input class="numin" id="nz-b-' + b[0] + '" data-tc3="' + b[0] + '" type="text" inputmode="numeric" autocomplete="off"></div>'; }).join("") + "</div>" +
    '</fieldset></div><div class="pg-read"><dl class="read" id="nz-read" aria-live="polite"></dl></div></div>' +
    '<details class="alg nz-model"><summary>' + C.modelTitle + '</summary><ul class="nz-rules">' + C.modelRules.map(function(r){ return "<li>" + r + "</li>"; }).join("") + '</ul><p class="tiny muted"><span class="bio-model">Model</span> ' + C.modelNote + "</p></details>";
  function lampRow(L, nm, sub){
    return '<div class="nz-lamprow"><span class="nz-lamplab"><strong>Lamp ' + L + "</strong> · " + nm + ' <span class="muted">(' + sub + ')</span></span><span class="nz-btns"><button type="button" class="btn primary sm" data-fl="' + L + '" data-k="nzf' + L + '">Flash</button><button type="button" class="btn ghost sm nz-cont" data-ct="' + L + '" aria-pressed="false" data-k="nzc' + L + '">Continuous</button></span></div>';
  }
  var viewR = radios($("#nz-view"), { label:"View", options:[{ id:"z", t:"Energy diagram" }, { id:"m", t:"Membrane view" }], value:S.view, onChange:function(v){ S.view = v; api.save(); draw(); syncCtrl(); } });
  var waterR = radios($("#nz-water"), { label:"Water", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.set.water, onChange:function(v){ setSetting("water", v); } });
  var nadpR = radios($("#nz-nadp"), { label:"NADP⁺ supply", options:[{ id:"plenty", t:"Plenty" }, { id:"used", t:"Used up" }], value:S.set.nadp, onChange:function(v){ setSetting("nadp", v); } });
  var inhR = radios($("#nz-inh"), { label:"Inhibitor", cls:"chips", options:[{ id:"none", t:"None" }, { id:"dcmu", t:"DCMU (blocks PSII → plastoquinone)" }, { id:"pc", t:"Plastocyanin missing" }], value:S.set.inh, onChange:function(v){ setSetting("inh", v); } });
  $("#nz-fs").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.fl) flash(b.dataset.fl, false);
    else if (b.dataset.ct) { var L = b.dataset.ct; cont[L] = !cont[L]; if (cont.A && cont.B) alt = 0; syncCtrl(); ensureTick(); draw(); }
    else if (b.id === "nz-reset") { stopCont(); hardReset(); after(false); draw(); paintCap(); }
  });
  $("#nz-fs").addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.tc3; if (!k) return; S.tc3[k] = e.target.value; api.save(); MV.changed(); });
  C.tc3Boxes.forEach(function(b){ $("#nz-b-" + b[0]).value = S.tc3[b[0]] || ""; });
  $("#nz-path").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.pp) { if (S.path.indexOf(b.dataset.pp) < 0 && S.path.length < 9) S.path.push(b.dataset.pp); }
    else if (b.dataset.pt === "undo") S.path.pop(); else if (b.dataset.pt === "clear") S.path = [];
    api.save(); paintPath(); MV.changed();
  });

  function setSetting(k, v){
    S.set[k] = v; S.z.haloA = ""; S.z.haloB = "";
    zSettle(S.z, S.set, null);
    S.z.msg = k === "water" ? "Water " + (v === "on" ? "on: P680⁺ can be refilled." : "off: P680 can’t be refilled once it sends an electron.") :
      k === "nadp" ? (v === "plenty" ? "NADP⁺ supply: plenty." : "NADP⁺ is used up: there is no final acceptor.") :
      v === "dcmu" ? "DCMU added: it blocks the link from PSII to plastoquinone." : v === "pc" ? "Plastocyanin removed: nothing links b₆f to PSI." : "No inhibitor.";
    after(false); draw(); paintCap();
  }
  function hardReset(){ if (anim) { anim(); anim = null; } cur = null; curT = 1; S.z = zNew(); }
  function stopCont(){ cont.A = false; cont.B = false; ensureTick(); syncCtrl(); }
  function ensureTick(){
    var want = (cont.A || cont.B) && shown;
    if (want && !tick) tick = setInterval(onTick, 250);
    else if (!want && tick) { clearInterval(tick); tick = null; after(false); }
  }
  function onTick(){ var L = cont.A && cont.B ? (alt++ % 2 ? "B" : "A") : cont.A ? "A" : "B"; flash(L, true); }
  function flash(L, fast){
    var raw = zFire(S.z, S.set, L);
    play(toAnim(raw), fast ? 210 : 1150);
    after(fast); if (!fast) paintCap();
  }
  function play(ev, dur){
    if (anim) { anim(); anim = null; }
    cur = ev; curT = 0;
    anim = MV.tween({ dur:dur, ease:lin, step:function(t){ curT = t; draw(); }, done:function(){ anim = null; curT = 1; draw(); } });
  }
  function after(fast){
    var now = Date.now();
    if (!fast || now - lastRead > 400) { lastRead = now; paintRead(); if (fast) paintCap(); MV.changed(); }
    if (!fast || now - lastSave > 1000) { lastSave = now; api.save(); }
  }
  function syncCtrl(){
    viewR.set(S.view); waterR.set(S.set.water); nadpR.set(S.set.nadp); inhR.set(S.set.inh);
    $("#nz-zbox").hidden = S.view !== "z"; $("#nz-mbox").hidden = S.view !== "m";
    ["A", "B"].forEach(function(L){ var b = $('[data-ct="' + L + '"]', host); b.setAttribute("aria-pressed", String(cont[L])); b.textContent = cont[L] ? "Continuous: on" : "Continuous"; });
    $("#nz-fs").disabled = busy;
  }
  function status(){
    var z = S.z, jam = zJam(z, S.set), at = Object.keys(SLOT).filter(function(k){ return z[k]; }).map(function(k){ return { p680:"P680", pq:"plastoquinone", b6f:"cytochrome b₆f", pc:"plastocyanin", p700:"P700", fd:"ferredoxin", fnr:"NADP⁺ reductase" + (z.fnr === 2 ? " (2)" : "") }[k]; });
    return "NADPH " + z.nadph + ", O₂ " + z.o2 + ", H⁺ in lumen " + z.hp + ". " + (jam ? "Electron flow is stopped: " + jam + "." : (cont.A || cont.B) ? "Electron flow is running." : "Electron flow is ready.") + " Electrons at: " + (at.length ? at.join(", ") : "none") + ".";
  }
  function draw(){
    var z = S.z, fr = frame(cur, curT);
    var o = { cnt:z, steps:z.steps, hp:z.hp, set:S.set, fr:fr, lampA:cont.A ? "on" : "off", lampB:cont.B ? "on" : "off", haloA:!!z.haloA, haloB:!!z.haloB };
    if (S.view === "z") { var sz = $("#nz-z"); sz.innerHTML = zSVG(o); sz.setAttribute("aria-label", "Z-scheme energy diagram. " + status()); }
    else { var sm = $("#nz-m"); sm.innerHTML = memSVG(o); sm.setAttribute("aria-label", "Thylakoid membrane view: PSII, plastoquinone and b₆f in the membrane, plastocyanin in the lumen, PSI in the membrane, ferredoxin and NADP⁺ reductase on the stroma side. " + status()); }
  }
  function paintRead(){
    var z = S.z, jam = zJam(z, S.set);
    var rows = [["Flashes so far (A / B)", z.flA + " / " + z.flB],
      ["Photons absorbed (PSII / PSI)", z.phA + " / " + z.phB],
      ["Electrons delivered to NADP⁺ reductase", String(z.eF)],
      ["NADPH made", "<strong>" + z.nadph + "</strong>"],
      ["H₂O split / O₂ released", z.h2o + " / " + z.o2],
      ["H⁺ added to the lumen", String(z.hp)],
      ["Where the jam is", jam ? '<mark class="nz-hl">' + jam + "</mark>" : "none"],
      ["Energy lost (fluorescence and heat)", z.lost + " photon" + (z.lost === 1 ? "" : "s")]];
    var sig = JSON.stringify(rows); if (sig !== readSig) { readSig = sig; $("#nz-read").innerHTML = MV.readoutHTML(rows); }
  }
  function paintCap(){ $("#nz-cap").textContent = S.z.msg || "Press Flash on a lamp, or turn on Continuous, and follow the electrons."; }
  function paintPath(){
    var n = S.path.length;
    MV.keepFocus($("#nz-path"), function(){
      $("#nz-path").innerHTML = '<p class="nz-pi">' + C.pathIntro + '</p><div class="nz-pchips" role="group" aria-label="Carriers to add to the electron path">' + PATH.map(function(p){ var used = S.path.indexOf(p[0]) >= 0; return '<button type="button" class="nz-pchip" data-pp="' + p[0] + '" data-k="pp' + p[0] + '"' + (used ? " disabled" : "") + ">" + p[1] + "</button>"; }).join("") + "</div>" +
        '<p class="nz-trail"><span class="nz-trail-l">Electron path:</span> ' + (n ? S.path.map(function(id, i){ return (i ? '<span aria-hidden="true"> → </span><span class="vh">, then </span>' : "") + "<strong>" + PN[id] + "</strong>"; }).join("") : '<span class="muted">none yet</span>') + "</p>" +
        '<span class="nz-pbtns"><button type="button" class="btn ghost sm" data-pt="undo" data-k="ptundo"' + (n ? "" : " disabled") + '>Undo</button><button type="button" class="btn ghost sm" data-pt="clear" data-k="ptclear"' + (n ? "" : " disabled") + ">Clear</button></span>";
    });
  }
  // prediction runs
  function later(ms, fn){ timers.push(setTimeout(fn, ms)); }
  function clearRun(){ timers.forEach(clearTimeout); timers = []; }
  function burst(n){ for (var i = 0; i < n; i++) onTick(); }
  function setBusy(b){ busy = b; syncCtrl(); }

  syncCtrl(); draw(); paintRead(); paintCap(); paintPath();

  var WANT = ["h2o", "psii", "pq", "b6f", "pc", "psi", "fd", "fnr", "nadp"];
  function chal(id, opt){
    var live = opt && opt.live;
    if (id === "tc1") {
      var p = S.path;
      if (live) return { ok:false };
      if (p.length === 9 && WANT.every(function(k, i){ return p[i] === k; })) return { ok:true };
      if (!p.length) return { ok:false, msg:"Tap the carrier chips under the diagram first, in order, starting from where the electrons come from." };
      var ix = function(k){ return p.indexOf(k); };
      if (ix("psi") >= 0 && (ix("psii") < 0 || ix("psi") < ix("psii"))) return { ok:false, msg:"The numbers are the order of discovery; electrons go through PSII first." };
      if (ix("pc") >= 0 && (ix("pq") < 0 || ix("pc") < ix("pq"))) return { ok:false, msg:"Plastoquinone leaves PSII; plastocyanin delivers to PSI." };
      if (ix("fd") >= 0 && (ix("psi") < 0 || ix("fd") < ix("psi"))) return { ok:false, msg:"Ferredoxin collects electrons <strong>from</strong> PSI." };
      if (p.length < 9) return { ok:false };
      return { ok:false, msg:"Not this order yet. Start with water and follow the Z, carrier by carrier." };
    }
    if (id === "tc2") {
      var z = S.z, s = S.set;
      if (s.inh !== "none" || s.nadp !== "plenty" || s.water !== "on") return { ok:false, msg:"Set Water On, NADP⁺ supply Plenty and Inhibitor None, then press Reset and try again." };
      if (z.flA + z.flB === 0) return { ok:false, msg:"Press Reset, then use the Flash buttons and watch the NADPH count." };
      if (z.nadph === 3 && z.flA === 5 && z.flB === 6) return { ok:true };
      if (z.nadph === 3) return { ok:false, msg:"It works, but some flashes weren’t needed. (You used " + z.flA + " A-flashes and " + z.flB + " B-flashes.) Press Reset and try with fewer." };
      if (z.flB === 0) return { ok:false, msg:"Electrons pile up at plastocyanin; PSI has to be excited too." };
      if (z.flA === 3 && z.flB === 3) return { ok:false, msg:"That delivers only 3 electrons: 1 NADPH." };
      if (z.nadph > 3) return { ok:false, msg:"That’s " + z.nadph + " NADPH, more than 3. Press Reset and stop at exactly 3." };
      return { ok:false, msg:"NADPH is " + z.nadph + " so far, after " + z.flA + " A-flash" + (z.flA === 1 ? "" : "es") + " and " + z.flB + " B-flash" + (z.flB === 1 ? "" : "es") + ". 3 NADPH need 6 electrons at NADP⁺ reductase." };
    }
    if (id === "tc3") {
      if (live) return { ok:false };
      var want = { nadph:6, photons:24, h2o:6, hplus:24 }, named = { nadph:[3, "4 electrons per O₂ make 2 NADPH, not 1."], photons:[12, "Each electron needs 2 photons."], h2o:[3, "2 H₂O per O₂."], hplus:[12, "1 H⁺ from water <strong>and</strong> 1 pumped at b₆f, per electron."] };
      var vals = {}, blank = false;
      C.tc3Boxes.forEach(function(b){ var raw = String(S.tc3[b[0]] || "").trim(), v = raw ? MV.parseNum(raw) : null; if (!v || v.length !== 1 || !isFinite(v[0])) blank = true; else vals[b[0]] = v[0]; });
      if (blank) return { ok:false, msg:"Fill in all four counter boxes (under the controls) with whole numbers." };
      var bad = C.tc3Boxes.filter(function(b){ return Math.abs(vals[b[0]] - want[b[0]]) > 1e-9; });
      if (!bad.length) return { ok:true };
      return { ok:false, msg:bad.map(function(b){ var nm = named[b[0]]; return "<strong>" + b[1] + ":</strong> " + (Math.abs(vals[b[0]] - nm[0]) < 1e-9 ? nm[1] : "not " + MV.num(vals[b[0]]) + ". Start from the electrons: how many does 3 O₂ take?"); }).join(" ") };
    }
    return { ok:false };
  }
  EXP = { show:function(on){ shown = on; ensureTick(); if (!on && anim) { anim(); anim = null; curT = 1; draw(); } } };
  return {
    predict:{
      start:function(p){
        clearRun(); cont.A = false; cont.B = false; hardReset(); S.set = { water:"on", nadp:"plenty", inh:"none" };
        S.z.msg = p.start.run === "p1" ? "Reset. Lamp A is off; Lamp B will flash three times." : p.start.run === "p4" ? "Reset. Watch the NADPH count." : "Reset. Both lamps on Continuous.";
        if (p.start.run === "p2" || p.start.run === "p3") { cont.A = true; cont.B = true; alt = 0; }
        setBusy(true); ensureTick(); draw(); paintRead(); paintCap(); MV.changed();
      },
      run:function(p, done){
        var r = p.start.run;
        var fin = function(){ clearRun(); setBusy(false); after(false); draw(); paintCap(); done(); };
        if (MV.reduceMotion) {
          if (r === "p1") { flash("B"); flash("B"); flash("B"); }
          else if (r === "p4") { flash("A"); flash("B"); flash("A"); flash("B"); }
          else if (r === "p2") { burst(8); setSetting("inh", "dcmu"); syncCtrl(); burst(12); }
          else { burst(6); setSetting("nadp", "used"); syncCtrl(); burst(24); }
          fin(); return;
        }
        if (r === "p1") { later(0, function(){ flash("B"); }); later(1400, function(){ flash("B"); }); later(2800, function(){ flash("B"); }); later(4100, fin); }
        else if (r === "p4") { [0, 1300, 2600, 3900].forEach(function(ms, i){ later(ms, function(){ flash(i % 2 ? "B" : "A"); }); }); later(5200, fin); }
        else if (r === "p2") { later(1300, function(){ setSetting("inh", "dcmu"); syncCtrl(); }); later(4300, fin); }
        else { later(1300, function(){ setSetting("nadp", "used"); syncCtrl(); }); later(6600, fin); }
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Cyclic vs noncyclic ----------
function part3(host, api){
  var C = api.content, S = api.S;
  var c0 = { route:"cyc", p700:1, fnr:0, flB:0, ph:0, trips:0, hp:0, eF:0, lost:0, msg:"" };
  S.c = S.c || {}; Object.keys(c0).forEach(function(k){ if (S.c[k] === undefined) S.c[k] = c0[k]; });
  S.s2 = S.s2 || { vals:{}, done:{}, tries:{}, light:"both", concl:{ choice:null, checked:false, solved:false, tries:0 } };
  if (S.trips == null) S.trips = 0;
  var cont = false, tick = null, shown = false, anim = null, cur = null, curT = 1, readSig = "", msgs = {};
  var s1 = C.s1, s2 = C.s2, s3 = C.s3;
  host.innerHTML = '<div class="nz-p3">' +
    '<div class="nz-st"><h3>' + s1.title + "</h3><p>" + s1.how + '</p><div class="pg nz-pg"><div class="pg-graph"><p class="banner" id="nz-c-ban" aria-live="polite"></p><div class="nz-stage"><svg id="nz-c" viewBox="0 0 480 320" role="img" focusable="false"></svg></div><p class="nz-cap" id="nz-c-cap" aria-live="polite"></p></div>' +
      '<div class="pg-ctrl"><div class="nz-row" id="nz-c-route"></div><div class="nz-lamprow"><span class="nz-lamplab"><strong>Lamp B</strong> · 700 nm <span class="muted">(PSI only; Lamp A stays off)</span></span><span class="nz-btns"><button type="button" class="btn primary sm" id="nz-c-fl" data-k="nzcfl">Flash</button><button type="button" class="btn ghost sm nz-cont" id="nz-c-ct" aria-pressed="false" data-k="nzcct">Continuous</button></span></div>' +
      '<div class="q-actions"><button type="button" class="btn ghost sm" id="nz-c-reset" data-k="nzcrs">Reset</button></div></div>' +
      '<div class="pg-read"><dl class="read" id="nz-c-read" aria-live="polite"></dl></div></div></div>' +
    '<details class="alg nz-s2" open><summary>' + s2.title + "</summary><p>" + s2.how + '</p><div class="tbl-wrap nz-tblw"><table class="nz-tbl"><thead><tr>' + s2.head.map(function(x){ return '<th scope="col">' + x + "</th>"; }).join("") + "</tr></thead><tbody>" + s2.rows.map(function(r){ return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") + '</tbody></table></div><p class="tiny"><span class="bio-model">Model data</span></p>' +
      '<div id="nz-s2-boxes"></div><div class="q nz-concl" id="nz-s2-concl"></div>' +
      '<div class="nz-zoom"><h4>' + s2.zoomTitle + '</h4><div class="nz-row" id="nz-zl"></div><div class="nz-stage nz-stage-zoom"><svg id="nz-zsvg" viewBox="0 0 420 200" role="img" focusable="false"></svg></div><p id="nz-ztxt" aria-live="polite"></p><p class="tiny muted"><span class="bio-model">Model</span> ' + s2.zoomNote + "</p></div></details>" +
    '<div class="nz-st"><h3>' + s3.title + "</h3><p>" + s3.how + '</p><div class="nz-s3ctl"><span class="nz-s3fix">Noncyclic electrons: <strong>4</strong></span><div class="nz-stepper"><span class="nz-step-l" id="nz-tr-l">Cyclic trips</span><button type="button" class="btn ghost sm" data-tr="-1" data-k="nztrm" aria-label="One fewer cyclic trip">−</button><output id="nz-tr-out" aria-labelledby="nz-tr-l"></output><button type="button" class="btn ghost sm" data-tr="1" data-k="nztrp" aria-label="One more cyclic trip">+</button></div></div>' +
      '<div class="nz-bars" id="nz-s3bars"></div><p class="nz-s3msg" id="nz-s3msg" role="status"></p><p class="tiny muted">' + s3.note + "</p></div></div>";

  // Station 1: the cyclic route
  var routeR = radios($("#nz-c-route", host), { label:"Route", options:[{ id:"non", t:"Noncyclic (one way)" }, { id:"cyc", t:"Cyclic (loop back)" }], value:S.c.route, onChange:function(v){ resetC(); S.c.route = v; S.c.msg = v === "cyc" ? "Cyclic route: ferredoxin hands electrons back to plastoquinone." : "Noncyclic route: electrons go on to NADP⁺ reductase."; api.save(); paintC(); } });
  function resetC(){ if (anim) { anim(); anim = null; } cur = null; curT = 1; var r = S.c.route; S.c = JSON.parse(JSON.stringify(c0)); S.c.route = r; }
  function ensureTick(){ var want = cont && shown; if (want && !tick) tick = setInterval(function(){ flashC(true); }, 250); else if (!want && tick) { clearInterval(tick); tick = null; api.save(); paintC(); } }
  function flashC(fast){
    var c = S.c, ev = { flash:"B", moves:[], pops:[] };
    c.flB++;
    if (!c.p700) { c.lost++; c.msg = s1.stall; ev.halo = "p700"; }
    else if (c.route === "cyc") {
      c.ph++; c.trips++; c.hp++;
      ev.moves.push({ path:LOOP, t0:0.05, t1:0.95, to:"p700" });
      ev.pops.push({ kind:"h", at:"b6f", t0:0.05 + 0.9 * fracAt(LOOP, "b6f", ZP) });
      c.msg = "One trip: P700 → ferredoxin → plastoquinone → b₆f (1 H⁺ pumped) → plastocyanin → back to P700.";
    } else {
      c.ph++; c.p700 = 0; c.fnr++; c.eF++;
      ev.moves.push({ path:seg("p700", "fnr"), t0:0.06, t1:0.6, to:"fnr" });
      c.msg = "One electron went on to NADP⁺ reductase. " + s1.stall;
    }
    if (anim) { anim(); anim = null; }
    cur = ev; curT = 0;
    anim = MV.tween({ dur:fast ? 220 : 1500, ease:lin, step:function(t){ curT = t; drawC(); }, done:function(){ anim = null; curT = 1; drawC(); } });
    if (!fast || c.flB % 2 === 0) { paintRead(); $("#nz-c-cap", host).textContent = c.msg; }
    if (!fast) api.save();
  }
  function drawC(){
    var c = S.c, svg = $("#nz-c", host);
    svg.innerHTML = zSVG({ cnt:{ p680:1, p700:c.p700, fnr:c.fnr }, steps:0, set:DEF_SET, fr:frame(cur, curT), lampA:"off", lampB:cont ? "on" : "off", haloB:!c.p700 && c.lost > 0, loop:true, loopOn:c.route === "cyc" });
    svg.setAttribute("aria-label", "Z-scheme with a cyclic return path from ferredoxin to plastoquinone" + (c.route === "cyc" ? " (in use)" : " (not in use)") + ". Cyclic trips " + c.trips + ", H⁺ pumped " + c.hp + ", NADPH 0, O₂ 0." + (c.p700 ? "" : " P700 is waiting for an electron from PSII."));
  }
  function paintRead(){
    var c = S.c, rows = [["Route", c.route === "cyc" ? "Cyclic: PSI → ferredoxin → plastoquinone → b₆f → plastocyanin → PSI" : "Noncyclic (one way, toward NADP⁺)"],
      ["Photons absorbed (PSI)", String(c.ph)], ["Cyclic trips", String(c.trips)], ["H⁺ pumped into the lumen", "<strong>" + c.hp + "</strong>"],
      ["NADPH made", "<strong>0</strong>"], ["O₂ released", "<strong>0</strong>"], ["Energy lost (heat and fluorescence)", c.lost + " photon" + (c.lost === 1 ? "" : "s")]];
    var sig = JSON.stringify(rows); if (sig !== readSig) { readSig = sig; $("#nz-c-read", host).innerHTML = MV.readoutHTML(rows); }
    var ban = $("#nz-c-ban", host);
    if (c.route === "cyc" && c.trips > 0) { ban.textContent = s1.banner; } else if (c.route === "non" && c.lost > 0) { ban.textContent = s1.stall; } else ban.textContent = "";
  }
  function paintC(){
    routeR.set(S.c.route);
    var b = $("#nz-c-ct", host); b.setAttribute("aria-pressed", String(cont)); b.textContent = cont ? "Continuous: on" : "Continuous";
    $("#nz-c-cap", host).textContent = S.c.msg || "Press Flash, or turn on Continuous, and watch the counters.";
    drawC(); paintRead();
  }
  $("#nz-c-fl", host).addEventListener("click", function(){ flashC(false); });
  $("#nz-c-ct", host).addEventListener("click", function(){ cont = !cont; ensureTick(); paintC(); });
  $("#nz-c-reset", host).addEventListener("click", function(){ cont = false; ensureTick(); resetC(); S.c.msg = ""; api.save(); paintC(); });

  // Station 2: Emerson data, conclusion, zoom
  var st2 = S.s2;
  function paintBoxes(){
    var box = $("#nz-s2-boxes", host);
    MV.keepFocus(box, function(){
      box.innerHTML = s2.boxes.map(function(b){
        var done = !!st2.done[b.id], h = '<div class="nz-s2b"><div class="numrow"><label for="nz-s2-' + b.id + '">' + b.label + ':</label><input class="numin" id="nz-s2-' + b.id + '" data-s2="' + b.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(st2.vals[b.id] || "") + '"' + (done ? " disabled" : "") + ">" + (done ? "" : '<button type="button" class="btn primary sm" data-s2chk="' + b.id + '" data-k="nzs2' + b.id + '">Check</button>') + "</div>";
        if (done) h += MV.fbHTML("good", "<strong>✓ Correct: " + MV.num(MV.ans(b)) + ".</strong>" + (b.id === "extra" ? " Together the lights beat the sum by 6." : " 10 + 4 = 14."));
        else if (msgs[b.id]) h += MV.fbHTML("bad", msgs[b.id]);
        return h + "</div>";
      }).join("");
    });
  }
  function paintConcl(){
    var q = { id:"nzc", prompt:s2.concl.prompt, options:s2.concl.options }, box = $("#nz-s2-concl", host), x = st2.concl;
    MV.keepFocus(box, function(){ box.innerHTML = MV.mcHTML(q, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, noConf:true }); });
  }
  var lightR = radios($("#nz-zl", host), { label:"Light", cls:"chips", options:[{ id:"red", t:"650 nm (red)" }, { id:"far", t:"710 nm (far red)" }, { id:"both", t:"Both together" }], value:st2.light, onChange:function(v){ st2.light = v; api.save(); paintZoom(); } });
  var EXC = { red:[1, 0.5], far:[0.2, 1], both:[1, 1] };
  function paintZoom(){
    var L = st2.light, e = EXC[L], rate = Math.round(20 * Math.min(e[0], e[1])), h = "";
    var lamps = L === "both" ? [[150, "650 nm"], [270, "710 nm"]] : [[210, L === "red" ? "650 nm" : "710 nm"]];
    lamps.forEach(function(l){ h += sv("circle", { cx:l[0], cy:20, r:9, "class":"nz-lamp on" }) + sv("rect", { x:l[0] - 4.5, y:28, width:9, height:6, rx:1.5, "class":"nz-lbase" }) + txt(l[0] + 14, 24, l[1], "nz-sub"); });
    [[0, 110], [1, 310]].forEach(function(ps){
      var ex = e[ps[0]], x = ps[1];
      h += sv("rect", { x:x - 56, y:66, width:112, height:56, rx:14, "class":"nz-glow", opacity:f1(ex * 60) / 100 });
      h += sv("rect", { x:x - 50, y:72, width:100, height:44, rx:12, "class":"nz-cx" }) + txt(x, 92, ps[0] ? "PSI" : "PSII", "nz-lab", "middle") + txt(x, 108, ps[0] ? "P700" : "P680", "nz-sub", "middle");
      lamps.forEach(function(l){
        var w = L === "both" ? (l[1] === "650 nm" ? (ps[0] ? 0.5 : 1) : (ps[0] ? 1 : 0.2)) : ex;
        if (L === "both" && ((l[1] === "650 nm" && ps[0]) || (l[1] === "710 nm" && !ps[0]))) return;
        h += sv("g", { opacity:f1((0.25 + 0.75 * w) * 100) / 100 }, photonSVG(l[0], 36, x + (x < 210 ? 10 : -10), 64, "nz-photon" + (w < 0.5 ? " thin" : "")));
      });
      h += sv("rect", { x:x - 50, y:132, width:100, height:9, rx:4.5, "class":"nz-bart" }) + sv("rect", { x:x - 50, y:132, width:100 * ex, height:9, rx:4.5, "class":"nz-barf" }) + txt(x, 156, "excited: " + Math.round(ex * 100) + "%", "nz-sub", "middle");
    });
    h += arrow([160, 94], [260, 94], 0, 0, "nz-line") + txt(210, 86, "electrons", "nz-sub", "middle");
    h += pill(26, 94, "H₂O", "nz-tok-o", 38) + arrow([45, 94], [60, 94], 0, 0, "nz-thin") + arrow([360, 94], [380, 94], 0, 0, "nz-line") + pill(400, 94, "NADPH", "nz-tok-n", 40);
    h += txt(210, 188, "O₂ rate: " + rate + " (model units)", "nz-lab", "middle");
    var svg = $("#nz-zsvg", host); svg.innerHTML = h;
    svg.setAttribute("aria-label", (L === "both" ? "Red and far-red light together" : L === "red" ? "Red light, 650 nm" : "Far-red light, 710 nm") + ": PSII " + Math.round(e[0] * 100) + "% excited, PSI " + Math.round(e[1] * 100) + "% excited. O₂ rate " + rate + ".");
    $("#nz-ztxt", host).innerHTML = s2.zoom[L];
  }
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.s2; if (!k) return; st2.vals[k] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.s2) { var b = $('[data-s2chk="' + e.target.dataset.s2 + '"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s2chk) {
      var bx = byId(s2.boxes, b.dataset.s2chk), raw = String(st2.vals[bx.id] || "").trim(), v = raw ? MV.parseNum(raw) : null;
      if (!v || v.length !== 1 || !isFinite(v[0])) msgs[bx.id] = "Enter a number, such as 12.";
      else if (Math.abs(v[0] - MV.ans(bx)) < 1e-9) { st2.done[bx.id] = true; msgs[bx.id] = null; }
      else { st2.tries[bx.id] = (st2.tries[bx.id] || 0) + 1; var w = (bx.wrong || []).filter(function(x){ return Math.abs(x.match - v[0]) < 1e-9; })[0]; msgs[bx.id] = "<strong>✗ Not quite.</strong> " + (w ? w.fb : "Read the three rates in the table again.") + " Try again."; }
      api.save(); paintBoxes(); MV.focusFb($("#nz-s2-boxes", host)); return;
    }
    var cq = b.closest("#nz-s2-concl");
    if (cq) {
      var x = st2.concl;
      if (b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
      else if (b.dataset.act === "check" && x.choice != null) { x.checked = true; if (MV.ok(s2.concl.options[x.choice])) x.solved = true; else x.tries++; }
      else return;
      api.save(); paintConcl(); if (b.dataset.act === "check") MV.focusFb(cq);
      return;
    }
    if (b.dataset.tr) { S.trips = clamp(S.trips + +b.dataset.tr, 0, 8); api.save(); paintS3(); }
  });

  // Station 3: @component S3 energyLedger (bars variant) — ATP, NADPH and H⁺ bars against what the Calvin cycle needs
  function bar(lab, val, max, need, cls, valTxt, needTxt){
    return '<div class="nz-bar"><span class="nz-bar-l">' + lab + '</span><span class="nz-bar-t" aria-hidden="true"><i class="' + cls + '" style="width:' + f1(clamp(val / max, 0, 1) * 100) + '%"></i>' + (need != null ? '<b class="nz-need" style="left:' + f1(need / max * 100) + '%"></b>' : "") + '</span><span class="nz-bar-v">' + valTxt + (needTxt ? ' <span class="muted">' + needTxt + "</span>" : "") + "</span></div>";
  }
  function paintS3(){
    var n = S.trips, hp = 8 + n, atp = Math.floor(hp / 4), rem = hp % 4;
    $("#nz-tr-out", host).textContent = String(n);
    $$('[data-tr="-1"]').forEach(function(b){ b.disabled = n <= 0; }); $$('[data-tr="1"]').forEach(function(b){ b.disabled = n >= 8; });
    $("#nz-s3bars", host).innerHTML = bar("NADPH", 2, 4, 2, "nz-f-n", "2", "(needs 2)") +
      bar("H⁺ in the lumen", hp, 16, 12, "nz-f-h", "8 + " + n + " = " + hp, "(3 ATP need 12)") +
      bar("ATP", hp / 4, 4, 3, "nz-f-a", atp + " ATP" + (rem ? " + " + rem + " of 4 H⁺ toward the next" : ""), "(needs 3)");
    var m = $("#nz-s3msg", host);
    if (atp < 3) m.innerHTML = "ATP " + atp + " of 3: short by " + (3 - atp) + ". " + (12 - hp) + " more H⁺ needed.";
    else if (n === 4) m.innerHTML = "<strong>✓ " + s3.done + "</strong>";
    else if (atp === 3) m.innerHTML = "Enough ATP. The extra " + (n - 4) + " H⁺ start a 4th ATP that one CO₂ doesn’t need: 4 trips is the fewest.";
    else m.innerHTML = "That’s " + atp + " ATP: one more than one CO₂ needs. 4 trips is the fewest that reaches 3.";
  }
  function $$(sel){ return Array.prototype.slice.call(host.querySelectorAll(sel)); }

  paintC(); paintBoxes(); paintConcl(); paintZoom(); paintS3();
  P3 = { show:function(on){ shown = on; ensureTick(); if (!on && anim) { anim(); anim = null; curT = 1; drawC(); } } };
}

// ---------- Practice 1: put the steps in order (N5 ordering, adapted from the toolkit: rule-based named wrong orders) ----------
function orderAct(host, api, a){
  var st = api.S; st.seq = st.seq || {};
  var sel = {}, msgs = {};
  function sq(s){ var x = st.seq[s.id]; if (!x) x = st.seq[s.id] = { order:(s.start || MV.shuffle(s.steps.map(function(_, i){ return i; }), MV.meta.id + s.id)).slice(), tries:0, hint:0, solved:false, first:null }; return x; }
  function isRight(ord){ return ord.every(function(v, i){ return v === i; }); }
  function ruleHit(s, ord){ var pos = {}; ord.forEach(function(v, i){ pos[v] = i; }); return (s.rules || []).filter(function(r){ return r.then.some(function(j){ return r.first.some(function(i){ return pos[j] < pos[i]; }); }); })[0]; }
  function paint(){
    MV.keepFocus(host, function(){
      host.innerHTML = '<p class="how">' + a.how + "</p>" + a.sequences.map(function(s, si){
        var x = sq(s), h = '<div class="q' + (si ? " part" : "") + '" data-seq="' + s.id + '" style="border-bottom:0"><p class="task">Sequence ' + (si + 1) + ": " + s.prompt + "</p>";
        h += '<ol class="olist">' + x.order.map(function(stepI, pos){
          var isSel = sel[s.id] === pos && !x.solved, cls = "ostep" + (x.solved ? " good" : (msgs[s.id] && msgs[s.id].pos === pos ? " bad" : ""));
          return '<li><button type="button" class="' + cls + '" aria-pressed="' + isSel + '" data-k="' + s.id + "p" + stepI + '" data-pos="' + pos + '"' + (x.solved ? " disabled" : "") + '><span class="sn">' + (pos + 1) + ".</span><span>" + s.steps[stepI] + "</span></button>" +
            (isSel ? '<span class="omoves"><button type="button" class="btn ghost" data-mv="up" data-k="' + s.id + 'up"' + (pos === 0 ? " disabled" : "") + '>Move up</button><button type="button" class="btn ghost" data-mv="down" data-k="' + s.id + 'down"' + (pos === x.order.length - 1 ? " disabled" : "") + ">Move down</button></span>" : "") + "</li>";
        }).join("") + "</ol>";
        if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + s.id + 'chk">Check the order</button>' + MV.hintBtn(s.id + "hint", x.hint) + "</div>" + MV.hintsHTML(s.hints, x.hint);
        if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ That order works.</strong> ' + (s.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
        else if (msgs[s.id]) h += '<div class="fb bad" role="status"><p><strong>✗ Not yet.</strong> ' + msgs[s.id].html + "</p></div>";
        return h + "</div>";
      }).join("");
    });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-seq]"); if (!box) return;
    var s = byId(a.sequences, box.dataset.seq), x = sq(s);
    if (b.dataset.pos != null) { var p = +b.dataset.pos; sel[s.id] = sel[s.id] === p ? null : p; paint(); return; }
    if (b.dataset.mv) {
      var i = sel[s.id], j = b.dataset.mv === "up" ? i - 1 : i + 1; if (i == null || j < 0 || j >= x.order.length) return;
      var t = x.order[i]; x.order[i] = x.order[j]; x.order[j] = t; sel[s.id] = j; msgs[s.id] = null; api.save(); paint();
      var nb = host.querySelector('[data-seq="' + s.id + '"] [data-mv="' + b.dataset.mv + '"]'); if (nb && !nb.disabled) nb.focus(); else { var sb = host.querySelector('[data-seq="' + s.id + '"] [data-pos="' + j + '"]'); if (sb) sb.focus(); }
      return;
    }
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (isRight(x.order)) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[s.id] = null; sel[s.id] = null; }
      else {
        x.tries++;
        var rule = ruleHit(s, x.order), pos = 0; while (pos < x.order.length && x.order[pos] === pos) pos++;
        msgs[s.id] = { pos:pos, html:rule ? rule.fb + " Step " + (pos + 1) + " is out of place." : "Step " + (pos + 1) + " is out of place. Ask what has to happen before it can be done." };
      }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-seq="' + s.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.sequences.forEach(function(s){ var x = sq(s); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.sequences.length, done:d, line:a.summary + " (first try): " + f + "/" + a.sequences.length + (d < a.sequences.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.sequences.forEach(function(s){ var x = sq(s); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(s.goal != null ? s.goal : a.goal)); }); return g; }
  };
}

// ---------- Practice 2: electron accounting and inhibitors (N4 number entry, N7 choice and select-all; adapted from SBI4U 03 puzzles) ----------
function accounting(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:{}, choice:null, tries:0, hint:0, solved:false, first:null, checked:false }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function parseVal(raw){ var s = String(raw == null ? "" : raw).trim().replace(/[a-zA-Z].*$/, "").replace(/\s/g, ""); var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function headHTML(it, i){ return '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + MV.usesHTML(it.use) + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>"; }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), box = $('[data-li="' + it.id + '"]', host), h;
    if (it.kind === "mc") h = MV.mcHTML(it, x, { mode:"retry", locked:x.solved, showFb:x.choice != null && x.checked, num:i + 1, noConf:true, topicLabel:it.star ? "★" : "" });
    else if (it.kind === "sel") {
      h = headHTML(it, i) + '<div class="opts" role="group" aria-label="Options (select all that apply)">' + it.options.map(function(o, oi){
        var on = !!x.pick[oi], c = "opt sa-opt";
        if (x.checked) { var good = MV.ok(o); if (on && good) c += " right"; else if (on && !good) c += " wrong"; else if (!on && good && x.solved) c += " right"; }
        return '<button type="button" class="' + c + '" role="checkbox" aria-checked="' + on + '" data-k="' + it.id + "o" + oi + '" data-oi="' + oi + '"' + (x.solved ? " disabled" : "") + '><span class="opt-mark" aria-hidden="true">' + (on ? "☑" : "☐") + "</span><span>" + o.t + "</span></button>";
      }).join("") + "</div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.checked) {
        var lines = it.options.map(function(o, oi){ var on = !!x.pick[oi], good = MV.ok(o); if (on && !good) return "<p>✗ " + o.t + ": " + (o.why || "") + "</p>"; if (!on && good && !x.solved) return "<p>○ One more option belongs in your selection.</p>"; return ""; }).filter(Boolean);
        var uniq = lines.filter(function(l, k){ return lines.indexOf(l) === k; });
        h += x.solved ? '<div class="fb good" role="status"><p><strong>✓ Correct.</strong> ' + it.fb + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>" : '<div class="fb bad" role="status"><p><strong>✗ Not quite.</strong> ' + it.fb + " Try again.</p>" + uniq.join("") + "</div>";
      }
    } else {
      h = headHTML(it, i) + '<div class="numrow"><label for="li-' + it.id + '">Your answer:</label><input class="numin" id="li-' + it.id + '" data-lin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="nz-unit">' + it.unit + "</span></div>";
      if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
      if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
      else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    }
    MV.keepFocus(box, function(){ box.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = $('[data-k="' + e.target.dataset.lin + 'chk"]', host); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var box = b.closest("[data-li]"); if (!box) return;
    var it = byId(a.items, box.dataset.li), x = ist(it.id);
    if (b.dataset.act === "hint") x.hint = Math.min(3, x.hint + 1);
    else if (it.kind === "mc" && b.dataset.i != null) { x.choice = +b.dataset.i; x.checked = false; }
    else if (it.kind === "sel" && b.dataset.oi != null) { var oi = +b.dataset.oi; x.pick[oi] = !x.pick[oi]; x.checked = false; }
    else if (b.dataset.act === "check") {
      var ok = false;
      if (it.kind === "mc") { if (x.choice == null) return; x.checked = true; ok = MV.ok(it.options[x.choice]); }
      else if (it.kind === "sel") { x.checked = true; ok = it.options.every(function(o, oi){ return !!x.pick[oi] === MV.ok(o); }); }
      else {
        var v = parseVal(x.val), an = MV.ans(it);
        if (v == null) { msgs[it.id] = "Enter a whole number, such as 12."; paintItem(it); return; }
        ok = Math.abs(v - an) < 1e-9;
        if (!ok) { var named = (it.wrong || []).filter(function(w){ return Math.abs(v - w.match) < 1e-9; })[0]; msgs[it.id] = "<strong>✗ Not quite.</strong> " + (named ? named.fb : "Count electrons first: 2 photons per electron, 2 electrons per NADPH, 4 electrons per O₂.") + " Try again."; }
        else msgs[it.id] = null;
      }
      if (ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; } else x.tries++;
    } else return;
    api.save(); paintItem(it); if (b.dataset.act === "check") MV.focusFb(box);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Feed the Calvin cycle (P noncyclic pairs, C cyclic trips; live Z with a loop and S3 bars) ----------
var task = (function(){
  var api = null;
  function get(){ var s = api ? api.S : {}; return { P:s.P == null ? 0 : s.P, C:s.C == null ? 0 : s.C }; }
  function counts(d){ var hp = 4 * d.P + d.C; return { nadph:d.P, hp:hp, atp:Math.floor(hp / 4), photons:4 * d.P + d.C, o2:d.P / 2 }; }
  function bar(lab, val, max, mark, cls, v, note){
    return '<div class="nz-bar"><span class="nz-bar-l">' + lab + '</span><span class="nz-bar-t" aria-hidden="true"><i class="' + cls + '" style="width:' + f1(clamp(val / max, 0, 1) * 100) + '%"></i>' + (mark != null ? '<b class="nz-need" style="left:' + f1(mark / max * 100) + '%"></b>' : "") + '</span><span class="nz-bar-v">' + v + (note ? ' <span class="muted">' + note + "</span>" : "") + "</span></div>";
  }
  function draw(){
    if (!api) return;
    var d = get(), k = counts(d), svg = $("#nz-tz");
    $("#nz-tP").value = d.P; $("#nz-tC").value = d.C; $("#nz-tP-o").textContent = d.P; $("#nz-tC-o").textContent = d.C;
    $("#nz-tP").setAttribute("aria-valuetext", d.P + " noncyclic electron pairs"); $("#nz-tC").setAttribute("aria-valuetext", d.C + " cyclic trips");
    if (svg) {
      var h = zSVG({ cnt:{ p680:1, p700:1 }, steps:0, set:DEF_SET, fr:frame(null, 1), lampA:d.P ? "on" : "off", lampB:d.P || d.C ? "on" : "off", loop:true, loopOn:d.C > 0, noLamps:false });
      h += '<g class="nz-tlab">' + pill(150, 196, "× " + d.P + " pairs", "nz-tok-k", 70) + pill(262, 12, "× " + d.C + " trips", "nz-tok-k", 66) + "</g>";
      svg.innerHTML = h;
      svg.setAttribute("aria-label", "Z-scheme with the cyclic loop. Noncyclic electron pairs: " + d.P + "; cyclic trips: " + d.C + ". NADPH " + k.nadph + ", ATP " + k.atp + ", O₂ " + MV.num(k.o2) + ", photons " + k.photons + ".");
    }
    $("#nz-tbars").innerHTML = bar("NADPH", k.nadph, 8, 4, "nz-f-n", String(k.nadph), "(needs exactly 4)") +
      bar("ATP", k.hp / 4, 12, 6, "nz-f-a", k.atp + " ATP" + (k.hp % 4 ? " + " + (k.hp % 4) + " of 4 H⁺" : ""), "(H⁺ = " + k.hp + "; needs at least 6)") +
      bar("O₂", k.o2, 4, null, "nz-f-o", MV.num(k.o2), "") +
      bar("Photons", k.photons, 48, 26, "nz-f-p", String(k.photons), "(budget 26)");
  }
  function set(which, v){ api.S[which] = clamp(Math.round(v), 0, which === "P" ? 8 : 16); api.save(); draw(); api.update(); }
  return {
    render:function(inp, pv, a){
      api = a;
      if (api.S.P == null) api.S.P = 0; if (api.S.C == null) api.S.C = 0;
      inp.innerHTML = '<div class="nz-tin">' + [["P", "Noncyclic electron pairs <i>P</i>", 8], ["C", "Cyclic trips <i>C</i>", 16]].map(function(r){
        return '<div class="nz-trow"><label for="nz-t' + r[0] + '">' + r[1] + ': <output id="nz-t' + r[0] + '-o"></output></label><div class="nz-tctl"><button type="button" class="btn ghost sm" data-td="' + r[0] + '" data-dv="-1" data-k="nzt' + r[0] + 'm" aria-label="Decrease ' + r[0] + '">−</button><input type="range" id="nz-t' + r[0] + '" min="0" max="' + r[2] + '" step="1"><button type="button" class="btn ghost sm" data-td="' + r[0] + '" data-dv="1" data-k="nzt' + r[0] + 'p" aria-label="Increase ' + r[0] + '">+</button></div></div>';
      }).join("") + "</div>";
      pv.innerHTML = '<div class="nz-stage"><svg id="nz-tz" viewBox="0 0 480 320" role="img" focusable="false"></svg></div><div class="nz-bars" id="nz-tbars"></div>';
      inp.addEventListener("input", function(e){ if (e.target.id === "nz-tP") set("P", +e.target.value); else if (e.target.id === "nz-tC") set("C", +e.target.value); });
      inp.addEventListener("click", function(e){ var b = e.target.closest("[data-td]"); if (!b) return; var w = b.dataset.td; set(w, get()[w] + +b.dataset.dv); });
      draw();
    },
    read:function(){ return get(); },
    valid:function(){ return true; },
    checks:function(d){ var k = counts(d); return [d.P === 4, k.atp >= 6, k.photons <= 26]; },
    key:function(d){ return d.P + "," + d.C; },
    label:function(k){ var p = k.split(","); return "(" + p[0] + ", " + p[1] + ")"; },
    text:function(k){ var p = k.split(","); return "P = " + p[0] + ", C = " + p[1]; }
  };
})();

// ---------- hero: one electron up the Z (storyboard: P680 flash, downhill with H⁺ at b₆f, P700 flash, NADP⁺ → NADPH; water → O₂) ----------
function hero(f){
  var box = $("#nz-hero"); if (!box) return;
  var cap = f && f.cap;
  box.innerHTML = '<svg viewBox="0 0 480 320" aria-hidden="true" focusable="false"></svg>';
  var svg = $("svg", box);
  var FINAL = "The Z-scheme. 1: light lifts an electron at PSII. 2: it falls through PQ, b₆f (H⁺ pumped into the lumen) and PC. 3: light lifts it again at PSI. 4: ferredoxin and NADP⁺ reductase make NADPH. 5: water replaces PSII’s electrons, and every four release one O₂.";
  function paint(st, ev, t, nums){ svg.innerHTML = zSVG({ cnt:st, steps:st.steps, set:DEF_SET, fr:frame(ev, t), lampA:"off", lampB:"off", nums:nums }); }
  function setCap(s){ if (cap) cap.textContent = s; }
  var st = { p680:1, p700:0, fnr:0, steps:0 };
  if (MV.reduceMotion) { paint({ p680:1, p700:1, fnr:0, steps:0 }, { nadphT:0 }, 1, true); setCap(FINAL); return; }
  // each run: A flash lifts the electron P680 → P700; water refills P680; B flash lifts it P700 → FNR (→ NADP⁺ on the 2nd)
  function runA(slow, done){
    var p = seg("p680", "p700"), ev = { flash:"A", moves:[{ path:p, t0:0.08, t1:0.7, to:"p700" }, { path:["h2o", "p680"], t0:0.62, t1:0.9, to:"p680" }],
      pops:[{ kind:"h", at:"b6f", t0:0.08 + 0.62 * fracAt(p, "b6f", ZP) }, { kind:"h", at:"h2o", t0:0.66 }] };
    st.p700 = 1; st.steps++; if (st.steps === 4) ev.pops.push({ kind:"o2", at:"h2o", t0:0.88 });
    MV.tween({ dur:slow ? 3600 : 1400, ease:lin, step:function(t){ paint(st, ev, t); }, done:function(){ if (st.steps === 4) st.steps = 0; done(); } });
  }
  function runB(slow, done){
    var two = st.fnr === 1, ev = { flash:"B", moves:[{ path:two ? seg("p700", "nadp") : seg("p700", "fnr"), t0:0.08, t1:0.75, to:two ? null : "fnr" }], pops:[], nadphT:two ? 0.78 : null };
    if (two) ev.moves.push({ path:["fnr", "nadp"], t0:0.66, t1:0.78, to:null });
    st.p700 = 0; st.fnr = two ? 0 : 1;
    MV.tween({ dur:slow ? 2600 : 1300, ease:lin, step:function(t){ paint(st, ev, t); }, done:done });
  }
  paint(st, null, 1);
  setCap("A violet electron sits at P680, in photosystem II.");
  MV.wait(1400, function(){
    setCap("A flash of light lifts it up the first stroke of the Z. It slides down through PQ, b₆f (an H⁺ pops into the lumen) and PC to P700. Water refills P680.");
    runA(true, function(){
      setCap("A second flash at P700 lifts it to the top, and it slides through ferredoxin to NADP⁺ reductase, which waits for a partner electron.");
      runB(true, function(){
        setCap("A second electron makes the same climb, and NADP⁺ turns teal: NADPH.");
        runA(false, function(){ runB(false, function(){
          setCap("Each electron PSII loses is replaced from water. After four, 2 H₂O have been split and an O₂ bubble floats away.");
          runA(false, function(){ runB(false, function(){ runA(false, function(){ runB(false, function(){
            MV.wait(1200, function(){ paint({ p680:1, p700:1, fnr:0, steps:0 }, { nadphT:0 }, 1, true); setCap(FINAL); });
          }); }); }); });
        }); });
      });
    });
  });
}

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ steps:orderAct, accounting:accounting },
  task:task,
  onShow:function(v){ if (EXP) EXP.show(v === "explore"); if (P3) P3.show(v === "cyclic"); }
});
})();
