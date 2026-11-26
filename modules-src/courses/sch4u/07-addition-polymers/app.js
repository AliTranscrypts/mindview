// SCH4U 07 Addition Polymers: hero (an initiator zips five ethenes into poly(ethene)), Polymer zipper (Explore: C1
// polymerChain with a C3-style Play / Step / Back zipper, a bracket tool, Build / Copolymer / Pack modes and a K21 density
// bar), Plastics and the planet (Part 3: resin-code sorter + float test, particle zoom of polyethene vs polyester in water,
// an S12-style claim builder), "Polymer reasoning" (number entry + chips), "Design a copolymer segment" task (six E/P
// position chips + the live chain).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, F = MV.chem.f;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function muted(t){ return '<span class="muted">' + t + "</span>"; }
function num(v){ return MV.num(v, 2); }
function LIN(t){ return t; }
function hl(t){ return '<strong class="ap-hl">' + t + "</strong>"; }
var M2 = "Only the two C=C carbons join the backbone. The CH₃ hangs off as a side group.";
var M4 = "No C=C, no addition polymer. Chloroethane has nothing to open.";

// ---------- module data (plan §4 and §6) ----------
// Rounded "Use these values" atomic masses. C is the course table's rounded value (MV.chem.data.Mr.C = 12.0). H 1 and
// Cl 35.5 are course table additions: the table's rounded list has neither (the plan uses them for 28, 42, 62.5, 104 g/mol).
var AM = { C:MV.chem.data.Mr.C, H:1, Cl:35.5 };
function mm(c, h, cl){ return c * AM.C + h * AM.H + (cl || 0) * AM.Cl; }
// Densities (g/cm³) and melting points (°C): the plan's approximate data, course table additions (plan §6 risk 1).
var PE = { lin:{ d:0.96, mp:135, ab:"HDPE", t:"linear" }, br:{ d:0.92, mp:110, ab:"LDPE", t:"branched" } };
var DENS = [["PP", 0.90, 5], ["LDPE", 0.92, 4], ["HDPE", 0.96, 2], ["PS", 1.05, 6], ["PET", 1.38, 1], ["PVC", 1.38, 3]];
var LIQ = [{ id:"water", t:"water", d:MV.chem.data["const"].dWater }, { id:"alc", t:"alcohol–water mix", d:0.94 }, { id:"salt", t:"salt solution", d:1.20 }];

// Monomers. g: groups on [carbon a, carbon b] as [up, down] (a saturated molecule adds an outer H); ct: condensed carbon texts.
var MONO = {
  ethene:{ nm:"ethene", f:"CH2=CH2", g:[["H", "H"], ["H", "H"]], ct:["CH₂", "CH₂"], c:2, h:4, poly:"poly(ethene)", common:"polyethylene" },
  propene:{ nm:"propene", f:"CH2=CHCH3", g:[["H", "H"], ["H", "CH3"]], ct:["CH₂", "CH(CH₃)"], c:3, h:6, poly:"poly(propene)", common:"polypropylene" },
  chloroethene:{ nm:"chloroethene", f:"CH2=CHCl", g:[["H", "H"], ["H", "Cl"]], ct:["CH₂", "CHCl"], c:2, h:3, cl:1, poly:"poly(chloroethene)", common:"polyvinyl chloride, PVC" },
  phenylethene:{ nm:"phenylethene", f:"CH2=CHC6H5", g:[["H", "H"], ["H", "C6H5"]], ct:["CH₂", "CH(C₆H₅)"], c:8, h:8, poly:"poly(phenylethene)", common:"polystyrene" },
  tetrafluoroethene:{ nm:"tetrafluoroethene", f:"CF2=CF2", g:[["F", "F"], ["F", "F"]], ct:["CF₂", "CF₂"], noM:true, poly:"poly(tetrafluoroethene)", common:"PTFE" },
  chloropropene:{ nm:"3-chloropropene", f:"CH2=CHCH2Cl", g:[["H", "H"], ["H", "CH2Cl"]], ct:["CH₂", "CH(CH₂Cl)"], c:3, h:5, cl:1, poly:"poly(3-chloropropene)" },
  chloroethane:{ nm:"chloroethane", f:"CH3CH2Cl", sat:true, g:[["H", "H", "H"], ["H", "Cl", "H"]], ct:["CH₃", "CH₂Cl"], c:2, h:5, cl:1 },
  ethane:{ nm:"ethane", f:"CH3CH3", sat:true, g:[["H", "H", "H"], ["H", "H", "H"]], ct:["CH₃", "CH₃"], c:2, h:6 }
};
Object.keys(MONO).forEach(function(k){ var m = MONO[k]; m.id = k; m.M = m.noM ? null : mm(m.c, m.h, m.cl); m.unit = "–" + m.ct[0] + "–" + m.ct[1] + "–"; });
var BUILD = ["ethene", "propene", "chloroethene", "phenylethene", "tetrafluoroethene"];
var MIX = BUILD.concat(["chloropropene", "chloroethane", "ethane"]);
function kOf(u){ for (var i = 0; i < u.length; i++) if (MONO[u[i]].sat) return i; return u.length; }
function monoTxt(id){ var m = MONO[id]; return m.nm + ", " + F(m.f) + " (" + (m.sat ? "no C=C" : m.M != null ? num(m.M) + " g/mol" : "molar mass not needed here") + ")"; }

// @component radioGroup (from MHF4U 25, via SCH4U 01–05) — segmented control or chip row as a real radio group (arrow keys,
// roving tabindex, lock); with no option chosen yet, the first option holds the tab stop.
// radios(host, {label, aria, options:[{id, t}], value, cls:"seg"|"chips", onChange(id), disabled}) -> {set(id), get(), lock(bool), paint()}
function radios(host, o){
  var val = o.value == null ? "" : String(o.value), locked = false;
  function off(id){ return o.disabled ? o.disabled(id) : ""; }
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val; }), first = true;
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x){ var on = String(x.id) === val, d = locked || !!off(x.id), tab = on || (!any && first && !d); if (!d) first = false; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (tab ? 0 : -1) + '" data-rg="' + esc(x.id) + '"' + (d ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function choose(id){ id = String(id); if (locked || off(id)) return; var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var ids = o.options.map(function(x){ return String(x.id); }), i = ids.indexOf(val); if (i < 0) i = d > 0 ? -1 : 0;
    for (var s = 0; s < ids.length; s++) { i = (i + d + ids.length) % ids.length; if (!off(ids[i])) { choose(ids[i]); return; } }
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; }, lock:function(b){ if (b !== locked) { locked = b; paint(); } }, paint:paint };
}

// ---------- SVG text helpers ----------
function tw(t, fs){
  var w = 0, prev = "";
  String(t).replace(/\d+|[\s\S]/g, function(s){
    if (/^\d/.test(s)) w += s.length * (/[A-Za-z)]$/.test(prev) ? 0.42 : 0.56) * fs;
    else w += (/[A-Z]/.test(s) ? 0.64 : /[a-z]/.test(s) ? 0.5 : /[()]/.test(s) ? 0.34 : s === " " ? 0.28 : 0.56) * fs;
    prev = s; return s;
  });
  return w;
}
// digits after a letter or ")" become subscripts
function tsp(t, fs){
  var out = "", base = 0, d = fs * 0.3, prev = "";
  String(t).replace(/\d+|[^\d]+/g, function(s){
    var sub = /^\d/.test(s) && /[A-Za-z)]$/.test(prev), dy = sub ? d - base : -base;
    base = sub ? d : 0;
    out += "<tspan" + (Math.abs(dy) > 0.01 ? ' dy="' + r1(dy) + '"' : "") + (sub ? ' font-size="' + r1(fs * 0.72) + '"' : "") + ">" + esc(s) + "</tspan>";
    prev = s; return s;
  });
  return out;
}
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function T(x, y, s, o){ o = o || {}; var fs = o.fs || 15; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + fs + '" font-weight="' + (o.w || 400) + '"' + (o.i ? ' font-style="italic"' : "") + ' fill="' + (o.c || "var(--ink)") + '"' + opA(o.op) + ">" + tsp(s, fs) + "</text>"; }
function Ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2.4) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function ball(x, y, el, op){
  var A = MV.chem.atom(el), r = el === "H" ? 9.5 : el === "C" ? 14 : 12.5, fs = el === "H" ? 12 : el.length > 1 ? 12 : 15;
  return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" fill="' + A.fill + '"' + (el === "H" ? ' stroke="' + A.line + '" stroke-width="1.6"' : "") + opA(op) + "/>" + T(x, y + 0.5, el, { fs:fs, w:700, c:A.ink, op:op });
}
function pill(x, y, t, fill, op){ var w = tw(t, 14) + 14; return '<rect x="' + r1(x - w / 2) + '" y="' + r1(y - 12) + '" width="' + r1(w) + '" height="24" rx="12" fill="' + (fill || "var(--at-c)") + '"' + opA(op) + "/>" + T(x, y + 0.5, t, { fs:14, w:700, c:"var(--sheet)", op:op }); }

// @component C1 polymerChain — addition-polymer chain drawing (SVG string). Monomers float in a staggered row with the C=C
// drawn as a double line. Zip progress z (0…n) opens each π bond in turn: it lifts off in violet (electrons) and settles as
// the new C–C link to the next monomer, which straightens into line, so the row closes into a backbone of single bonds.
// Groups hang from the backbone carbons in element colours (C ink; H white with --at-h-line; F, Cl teal; CH₃, C₆H₅, CH₂Cl as
// ink pills). A saturated molecule has no π bond: the zip stops in front of it. Rows wrap after perRow units. Bracket marks
// sit on bond slots k = 0…2n (slot k lies between backbone carbons k − 1 and k) and shade the carbons they hold.
//   PC.lay(units, o) -> {U, k, n, vb:[x, y, w, h], slot(k, side "L"|"R") -> [x, y]}    PC.svg(units, o) -> {html, vb, slot, k}
//   o: {perRow, z, minW, lead, bottom, initiator:t (hero), glowChain:t, glowSide:t, bracket:{L, R, op, n:true}}
var PC = (function(){
  var B = 46, ST = 17, HD = 35, ROWH = 158, X0 = 40, RS = 24, SATX = 52, TOP = 66, BOT = 84, TH = 0.52;
  function lay(units, o){
    o = o || {};
    var n = units.length, per = Math.max(1, o.perRow || n), k = kOf(units), i, xb = 0, P = [], U = [], rw = [], lead = o.lead || 0;
    var z = clamp(o.z == null ? k : o.z, 0, k), rows = Math.ceil(n / per);
    for (i = 0; i < n; i++) P[i] = i < k ? clamp(z - i, 0, 1) : 0;
    for (i = 0; i < n; i++) {
      var m = MONO[units[i]], r = Math.floor(i / per), xa = i % per === 0 ? X0 + lead + (m.sat ? SATX : 0) : xb + B + ((m.sat || MONO[units[i - 1]].sat) ? SATX : 0);
      xb = xa + B;
      var q = i >= k ? 0 : i === 0 ? P[0] : P[i - 1];
      U.push({ m:m, r:r, xa:xa, xb:xb, q:q, p:P[i], y:TOP + r * ROWH + ST * (i % 2 ? 1 : -1) * (1 - q), th:TH * (1 - q) });
      rw[r] = xb + X0 + (m.sat ? SATX : 0);
    }
    var W = Math.max.apply(null, rw.concat([o.minW || 0])), H = TOP + (rows - 1) * ROWH + (o.bottom || BOT);
    if (rows === 1 && W > rw[0]) { var dx = (W - rw[0]) / 2; U.forEach(function(u){ u.xa += dx; u.xb += dx; }); }
    function ry(r){ return TOP + r * ROWH; }
    function cx(j){ var u = U[j >> 1]; return { x:j & 1 ? u.xb : u.xa, r:u.r }; }
    function slot(kk, side){
      var nc = 2 * n; kk = clamp(kk, 0, nc);
      if (kk === 0) return [U[0].xa - B / 2, ry(U[0].r)];
      if (kk === nc) return [U[n - 1].xb + B / 2, ry(U[n - 1].r)];
      var a = cx(kk - 1), b = cx(kk);
      if (a.r === b.r) return [(a.x + b.x) / 2, ry(a.r)];
      return side === "R" ? [a.x + B / 2, ry(a.r)] : [b.x - B / 2, ry(b.r)];
    }
    return { U:U, k:k, n:n, vb:[0, 0, W, H], slot:slot, ry:ry, cx:cx };
  }
  function gpos(u, side, gi, g){
    var x = side < 0 ? u.xa : u.xb, y = u.y;
    if (gi === 2) return [x + side * HD, y];
    if (g.length > 2) return [x, y + (gi ? 1 : -1) * (HD + 6)];
    var s = Math.sin(u.th) * side, c = Math.cos(u.th);
    return [x + s * HD, y + (gi ? c : -c) * HD];
  }
  function eachGroup(u, fn){ [[-1, 0], [1, 1]].forEach(function(sc){ u.m.g[sc[1]].forEach(function(g, gi){ fn(sc[0], gi, g, gpos(u, sc[0], gi, g)); }); }); }
  function svg(units, o){
    o = o || {};
    var L = lay(units, o), U = L.U, k = L.k, s = "", br = o.bracket;
    if (o.glowChain > 0.01 && k) {
      var rowsSeen = {};
      U.forEach(function(u, i){ if (i >= k || rowsSeen[u.r]) return; rowsSeen[u.r] = 1; var last = u; for (var j = i; j < k && U[j].r === u.r; j++) last = U[j];
        s += '<rect x="' + r1(u.xa - 30) + '" y="' + r1(L.ry(u.r) - 60) + '" width="' + r1(last.xb - u.xa + 60) + '" height="128" rx="26" fill="var(--hi-soft)"' + opA(o.glowChain) + "/>"; });
    }
    if (br) for (var j = br.L; j < br.R; j++) { var c = L.cx(j); s += '<rect x="' + r1(c.x - B / 2) + '" y="' + r1(L.ry(c.r) - 47) + '" width="' + B + '" height="104" fill="var(--hi-soft)"' + opA(br.op) + "/>"; }
    if (o.glowSide > 0.01) U.forEach(function(u){ var g = u.m.g[1][1]; if (g.length > 2) { var p = gpos(u, 1, 1, g); s += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="27" fill="var(--hi)"' + opA(o.glowSide * 0.9) + "/>"; } });
    // bonds
    U.forEach(function(u, i){
      eachGroup(u, function(side, gi, g, p){ s += Ln(side < 0 ? u.xa : u.xb, u.y, p[0], p[1], { w:2 }); });
      if (u.m.sat) { s += Ln(u.xa, u.y, u.xb, u.y); return; }
      var p = u.p, d = 3.6 * (1 - p), nx = i + 1 < k && U[i + 1].r === u.r ? U[i + 1] : null;
      var end = nx ? [u.xb, u.y, nx.xa, nx.y] : [u.xb, u.y, u.xb + RS, u.y];
      s += Ln(u.xa, u.y + d, u.xb, u.y + d);
      if (p <= 0) s += Ln(u.xa, u.y - 3.6, u.xb, u.y - 3.6);
      else if (p >= 1) s += Ln(end[0], end[1], end[2], end[3]);
      else { var lift = -16 * Math.sin(Math.PI * p); s += Ln(lerp(u.xa, end[0], p), lerp(u.y - 3.6, end[1], p) + lift, lerp(u.xb, end[2], p), lerp(u.y - 3.6, end[3], p) + lift, { c:"var(--e-pair)", w:3.2 }); }
      if (i > 0 && i < k && U[i - 1].r !== u.r && U[i - 1].p > 0) s += Ln(u.xa - RS, u.y, u.xa, u.y, { op:U[i - 1].p });
    });
    if (k && U[0].p > 0) s += o.initiator != null ? Ln(U[0].xa - RS - 6, U[0].y, U[0].xa, U[0].y, { op:U[0].p }) : Ln(U[0].xa - RS, U[0].y, U[0].xa, U[0].y, { op:U[0].p });
    // atoms
    U.forEach(function(u){ eachGroup(u, function(side, gi, g, p){ s += g.length > 2 ? pill(p[0], p[1], g) : ball(p[0], p[1], g); }); });
    U.forEach(function(u){ s += ball(u.xa, u.y, "C") + ball(u.xb, u.y, "C"); });
    if (o.initiator != null && U.length) {
      var u0 = U[0], tx = u0.xa - RS - 42, ix = lerp(tx - 70, tx, o.initiator), iop = clamp(o.initiator * 3, 0, 1);
      s += pill(ix, u0.y, "initiator", "var(--ink-2)", iop) + '<circle cx="' + r1(ix + 42) + '" cy="' + r1(u0.y) + '" r="4.5" fill="var(--e-pair)"' + opA(iop * (1 - u0.p)) + "/>";
    }
    if (br) {
      var a = L.slot(br.L, "L"), b = L.slot(br.R, "R"), bo = { op:br.op };
      s += '<path d="M' + r1(a[0] + 9) + " " + r1(a[1] - 50) + " H" + r1(a[0]) + " V" + r1(a[1] + 60) + " H" + r1(a[0] + 9) + '" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linejoin="round"' + opA(bo.op) + "/>";
      s += '<path d="M' + r1(b[0] - 9) + " " + r1(b[1] - 50) + " H" + r1(b[0]) + " V" + r1(b[1] + 60) + " H" + r1(b[0] - 9) + '" fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linejoin="round"' + opA(bo.op) + "/>";
      if (br.n) s += T(b[0] + 12, b[1] + 60, "n", { fs:20, i:true, w:700, op:bo.op });
    }
    return { html:s, vb:L.vb, slot:L.slot, k:k, L:L };
  }
  return { lay:lay, svg:svg, B:B, X0:X0, minW:function(per){ return 2 * X0 + (2 * per - 1) * B; } };
})();
// perRow from the drawing width: keep atoms at three quarters of full size or more
function choosePer(W){ var u = (W / 0.74 - 34) / 92; return u >= 12 ? 12 : u >= 6 ? 6 : u >= 4 ? 4 : 3; }

// ---------- K21 densityBar + Pack view: polyethene chains side by side ----------
function packSVG(b, nCh, hideD){
  var W = nCh > 4 ? 660 : 420, sp = lerp(19, 44, b), top = 40, seg = 24, amp = 7, s = "", nV = Math.floor((W - 64) / seg), c, v, yMax = top + (nCh - 1) * 44;
  function pl(pts, w, op){ return '<polyline points="' + pts.map(function(p){ return r1(p[0]) + "," + r1(p[1]); }).join(" ") + '" fill="none" stroke="var(--ink)" stroke-width="' + w + '" stroke-linejoin="round" stroke-linecap="round"' + opA(op) + "/>"; }
  var y1 = top + (nCh - 1) * sp;
  s += '<rect x="14" y="' + r1(top - 22) + '" width="' + (W - 28) + '" height="' + r1(y1 - top + 44) + '" rx="10" fill="var(--hi-soft)" fill-opacity=".55" stroke="var(--ink-2)" stroke-width="1.6" stroke-dasharray="6 5"/>';
  s += T(W - 22, y1 + 34, b >= 0.5 ? "the same " + (nCh === 4 ? "four" : "six") + " chains take up more space" : "chains line up closely", { a:"end", fs:13, c:"var(--ink-2)" });
  for (c = 0; c < nCh; c++) {
    var yc = top + c * sp, pts = [];
    for (v = 0; v <= nV; v++) pts.push([32 + v * seg, yc + (v % 2 ? amp : -amp) + b * 5 * Math.sin(v * 0.7 + c * 1.9)]);
    s += pl(pts, 2.4);
    if (b > 0.01) for (v = 2 + (c % 3) * 2; v < nV - 2; v += 6) {
      var dir = c === 0 ? 1 : c === nCh - 1 ? -1 : (v + c) % 2 ? 1 : -1, x = pts[v][0], y = pts[v][1], L = b;
      s += pl([[x, y], [x + 9 * L, y + dir * 11 * L], [x + 2 * L, y + dir * 22 * L], [x + 11 * L, y + dir * 32 * L]], 2.2, clamp(b * 1.5, 0, 1));
    }
  }
  var yb = yMax + 62, xs = W > 500 ? 200 : 150, xe = W - 40, d0 = 0.85, d1 = 1.00;
  function X(d){ return xs + (d - d0) / (d1 - d0) * (xe - xs); }
  s += T(20, yb, "Density (g/cm³), data", { a:"start", fs:15, w:700 });
  [0.85, 0.90, 0.95, 1.00].forEach(function(d){ s += Ln(X(d), yb + 18, X(d), yb + 92, { c:"var(--rule)", w:1.4 }) + T(X(d), yb + 104, d.toFixed(2), { fs:13, c:"var(--ink-2)" }); });
  s += Ln(X(1), yb + 14, X(1), yb + 94, { c:"var(--ink-2)", w:2, d:"5 4" }) + T(X(1) - 4, yb + 12, "water", { fs:13, a:"end", c:"var(--ink-2)" });
  var cur = b >= 0.5 ? "br" : "lin";
  ["lin", "br"].forEach(function(id, i){
    var y = yb + 30 + i * 34, P = PE[id], on = id === cur;
    s += T(20, y, P.t + " (" + P.ab + ")", { a:"start", fs:14, w:on ? 700 : 400 });
    s += hideD ? '<rect x="' + xs + '" y="' + (y - 10) + '" width="' + r1(xe - xs) + '" height="20" fill="none" stroke="var(--rule)" stroke-width="1.5" stroke-dasharray="4 4"/>' + T(xs + 12, y, "?", { fs:15, w:700, a:"start" })
      : '<rect x="' + xs + '" y="' + (y - 10) + '" width="' + r1(X(P.d) - xs) + '" height="20" rx="3" fill="var(--pen)"' + (on ? "" : ' fill-opacity=".35"') + "/>" + T(X(P.d) + 6, y, P.d.toFixed(2), { fs:14, w:700, a:"start" });
  });
  return { html:s, vb:[0, 0, W, yb + 116] };
}

// ---------- hero: an initiator zips five ethenes into a chain ----------
var HCAP = ["Five ethene molecules, each with a C=C.", "An initiator starts the chain: the first C=C opens.", "The zip runs down the row: each C=C opens and its electrons form a new C–C bond to the next monomer.",
  "One repeating unit, –CH₂–CH₂–, repeated n times. Nothing was lost."];
function hero(){
  var svg = $("#ap-hx-svg"), cap = $("#ap-hx-cap"), ctr = $("#ap-hx-ctr"), rep = $("#ap-hx-replay");
  if (!svg) return;
  var U5 = ["ethene", "ethene", "ethene", "ethene", "ethene"], st = { ini:0, z:0, end:0 }, run = 0, lastW = 0;
  function per(){ return (svg.getBoundingClientRect().width || 440) < 400 ? 3 : 5; }
  function draw(){ var g = PC.svg(U5, { perRow:per(), z:st.z, lead:96, initiator:st.ini, glowChain:st.end, bracket:st.end > 0.01 ? { L:2, R:4, op:st.end, n:true } : null }); svg.setAttribute("viewBox", g.vb.join(" ")); svg.innerHTML = g.html; }
  function counter(k){ ctr.innerHTML = "Monomers in: <strong>" + k + "</strong> · Atoms lost: <strong>0</strong>"; }
  function play(){
    var id = ++run; rep.hidden = true; st = { ini:0, z:0, end:0 }; draw(); cap.textContent = HCAP[0]; counter(0);
    MV.wait(900, function(){
      if (id !== run) return; cap.textContent = HCAP[1];
      MV.tween({ dur:1100, step:function(t){ st.ini = t; draw(); }, done:function(){
        if (id !== run) return; cap.textContent = HCAP[2];
        MV.tween({ dur:4600, ease:LIN, step:function(t){ st.z = 5 * t; counter(Math.floor(st.z + 1e-6)); draw(); }, done:function(){
          if (id !== run) return; counter(5);
          MV.tween({ dur:900, step:function(t){ st.end = t; draw(); }, done:function(){ if (id !== run) return; cap.textContent = HCAP[3]; rep.hidden = false; } });
        } });
      } });
    });
  }
  if (MV.reduceMotion) { st = { ini:1, z:5, end:1 }; draw(); cap.textContent = HCAP[3]; counter(5); }
  else { rep.addEventListener("click", play); play(); }
  lastW = svg.getBoundingClientRect().width;
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = svg.getBoundingClientRect().width; if (w && Math.abs(w - lastW) > 20) { lastW = w; draw(); } }).observe(svg);
}

// ---------- Explore: Polymer zipper ----------
function explore(host, api){
  var S = api.S, C = api.content;
  if (["build", "co", "pack"].indexOf(S.mode) < 0) S.mode = "build";
  if (BUILD.indexOf(S.mono) < 0) S.mono = "ethene";
  S.n = clamp(Math.round(+S.n || 6), 2, 12); S.k1000 = !!S.k1000; S.shape = S.shape === "br" ? "br" : "lin";
  var co = S.co = S.co || {};
  co.set = (Array.isArray(co.set) ? co.set : []).filter(function(id){ return MIX.indexOf(id) >= 0; }).slice(0, 2);
  if (!co.set.length) co.set = ["ethene", "propene"];
  co.pos = Array.isArray(co.pos) ? co.pos : [];
  for (var i0 = 0; i0 < 12; i0++) if (co.pos[i0] !== 0 && co.pos[i0] !== 1) co.pos[i0] = co.set.length > 1 ? i0 % 2 : 0;
  if (co.set.length < 2) co.pos = co.pos.map(function(){ return 0; });
  S.L = Number.isInteger(S.L) ? S.L : 1; S.R = Number.isInteger(S.R) ? S.R : 4;
  var z = 0, busy = false, locked = false, tw = null, hide = {}, flash = "", note = "", glowSide = 0, ovN = 0, massT = null, pk = S.shape === "br" ? 1 : 0, pl = null, quiet = false, msg = "", per = 12, nCh = 6, geo = null, drag = null, lastW = 0;

  host.innerHTML = '<p class="how ap-how">' + C.how + '</p><div class="ap-modes"></div>' +
    '<div class="ap-view" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div class="ap-box"><svg class="ap-svg" role="img" aria-label=""></svg><div class="ap-hd"><button type="button" class="ap-hdl" data-h="L" data-k="aphl">[</button><button type="button" class="ap-hdl" data-h="R" data-k="aphr">]</button></div></div>' +
    '<p class="ap-cap" aria-live="polite"></p><div class="ap-zip"><button type="button" class="btn primary sm ap-go" data-k="apgo">Zip it</button><div class="ap-player"></div></div></div>' +
    '<div class="ap-grid"><div class="ap-ctrl"><div class="ap-mono"></div><div class="ap-co"></div><div class="ap-shape"></div><div class="ap-len"></div>' +
    '<label class="ap-k"><input type="checkbox" class="ap-kin"> ×1000: show a real-size chain in the readout</label><p class="ap-msg" aria-live="polite"></p>' + MV.usesHTML(C.uses) + "</div>" +
    '<div class="ap-right"><dl class="read ap-read" aria-live="polite"></dl></div></div>';
  var svg = $(".ap-svg", host), box = $(".ap-box", host), hd = $(".ap-hd", host), hL = $('[data-h="L"]', host), hR = $('[data-h="R"]', host), goBtn = $(".ap-go", host), kin = $(".ap-kin", host);
  kin.checked = S.k1000;
  var modeRG = radios($(".ap-modes", host), { label:"Mode", aria:"Zipper mode", options:C.modes, value:S.mode, onChange:function(v){ S.mode = v; reset(); } });
  var monoRG = radios($(".ap-mono", host), { label:"Monomer", aria:"Monomer", cls:"chips", options:BUILD.map(function(id){ return { id:id, t:MONO[id].nm }; }), value:S.mono, onChange:function(v){ S.mono = v; reset(); } });
  var shapeRG = radios($(".ap-shape", host), { label:"Chain shape (polyethene)", aria:"Chain shape", options:[{ id:"lin", t:"linear" }, { id:"br", t:"branched" }], value:S.shape,
    onChange:function(v){ S.shape = v; hide = {}; flash = ""; note = ""; api.save(); packTo(v === "br" ? 1 : 0); } });
  var sl = MV.sliders($(".ap-len", host), [{ id:"apn", label:"Chain length", min:2, max:12, step:1, value:S.n, fmt:function(v){ return v + " units"; } }],
    function(id, v){ S.n = v; reset(); });

  function units(){
    var n = S.n, u = [], m = S.mode === "pack" ? "ethene" : S.mono;
    if (S.mode === "co") return co.pos.slice(0, n).map(function(j){ return co.set[j] || co.set[0]; });
    for (var i = 0; i < n; i++) u.push(m);
    return u;
  }
  function full(){ return kOf(units()); }
  function zipped(){ return z >= full() - 1e-6; }
  function brOn(){ var u = units(); return S.mode !== "pack" && kOf(u) === u.length && zipped(); }
  function fixBr(){ S.R = clamp(S.R, 1, 2 * S.n); S.L = clamp(S.L, 0, S.R - 1); }
  function brInfo(u){
    var w = S.R - S.L, cts = [];
    for (var j = S.L; j < S.R; j++) cts.push(MONO[u[j >> 1]].ct[j & 1]);
    var txt = "–" + cts.join("–") + "–", inPh = S.L % 2 === 0;
    return { w:w, txt:txt, one:w === 2 && (inPh || txt === MONO[u[(S.L + 1) >> 1]].unit), inPh:inPh, id:u[inPh ? S.L >> 1 : (S.L + 1) >> 1] };
  }
  function setVis(){
    var md = S.mode;
    $(".ap-mono", host).hidden = md !== "build"; $(".ap-co", host).hidden = md !== "co"; $(".ap-shape", host).hidden = md !== "pack";
    $(".ap-zip", host).hidden = md === "pack"; $(".ap-k", host).hidden = md === "pack";
    host.classList.toggle("ap-packmode", md === "pack");
  }
  function lock(b){
    locked = b; [modeRG, monoRG, shapeRG].forEach(function(r){ r.lock(b); });
    var s = $("#sl-apn"); if (s) s.disabled = b; kin.disabled = b; goBtn.disabled = b || !full();
    paintCo(); placeHandles();
  }
  // drawing
  function describe(u){
    if (S.mode === "pack") return (nCh === 4 ? "Four" : "Six") + " polyethene chains drawn as zigzag lines, " + (pk >= 0.5 ? "branched: side branches keep the chains apart and leave gaps between them." : "linear: the chains line up closely with no gaps.") + " A density bar compares linear 0.96 and branched 0.92 g/cm³.";
    var k = kOf(u), j = Math.floor(z + 1e-6), m = MONO[u[0]], t;
    if (S.mode === "co") t = "A row of " + u.length + " monomers: " + u.map(function(id){ return MONO[id].nm; }).join(", ") + ". ";
    else t = "A row of " + u.length + " " + m.nm + " molecules. ";
    if (j < k) t += j + " of " + k + " monomers joined; the others still have their C=C. ";
    else if (k) t += "The C=C bonds have opened into a backbone of " + 2 * k + " carbons joined by single bonds" + (S.mode === "build" && m.g[1][1] !== m.g[0][1] ? ", with " + MV.plain(F(m.g[1][1])) + " on every second carbon" : "") + ". ";
    if (k < u.length) t += MONO[u[k]].nm + " has no C=C, so the chain stops in front of it. ";
    if (brOn()) { var bi = brInfo(u); t += "The bracket holds " + bi.w + " backbone carbon" + (bi.w > 1 ? "s" : "") + ": " + bi.txt + "."; }
    return t;
  }
  function draw(){
    var u = units(), g;
    if (S.mode === "pack") { g = packSVG(pk, nCh, hide.dens); geo = null; }
    else { g = PC.svg(u, { perRow:per, z:z, minW:PC.minW(per), bottom:104, glowSide:glowSide, bracket:brOn() ? { L:S.L, R:S.R } : null }); geo = g; }
    svg.setAttribute("viewBox", g.vb.join(" ")); svg.innerHTML = g.html; svg.setAttribute("aria-label", describe(u));
    placeHandles();
  }
  function pct(v){ return r1(v * 1000) / 10 + "%"; }
  function placeHandles(){
    var on = !!geo && brOn() && !busy;
    hL.hidden = hR.hidden = !on; if (!on) return;
    var a = geo.slot(S.L, "L"), b = geo.slot(S.R, "R"), vb = geo.vb, n2 = 2 * S.n;
    hL.style.left = pct((a[0] - vb[0]) / vb[2]); hL.style.top = pct((a[1] + 78 - vb[1]) / vb[3]);
    hR.style.left = pct((b[0] - vb[0]) / vb[2]); hR.style.top = pct((b[1] + 78 - vb[1]) / vb[3]);
    hL.disabled = hR.disabled = locked;
    hL.setAttribute("aria-label", "Left bracket mark, before backbone carbon " + (S.L + 1) + " of " + n2 + ". Arrow keys move it.");
    hR.setAttribute("aria-label", "Right bracket mark, after backbone carbon " + S.R + " of " + n2 + ". Arrow keys move it.");
  }
  function massTxt(u){
    var k = kOf(u), n = u.length, N = ovN || (S.k1000 ? n * 1000 : n), f = N / n, cnt = {}, ids = [], tot = 0;
    if (k < n) return muted("no chain past " + MONO[u[k]].nm + ": it has no C=C");
    u.forEach(function(id){ if (!cnt[id]) { cnt[id] = 0; ids.push(id); } cnt[id]++; });
    if (ids.some(function(id){ return MONO[id].M == null; })) return muted("tetrafluoroethene’s molar mass isn’t needed in this module");
    var parts = ids.map(function(id){ tot += cnt[id] * f * MONO[id].M; return num(cnt[id] * f) + " × " + num(MONO[id].M); });
    var v = massT != null ? Math.round(tot * massT * 10) / 10 : tot, out = num(v) + " g/mol";
    return (ids.length === 1 ? num(N) + " units × " + num(MONO[ids[0]].M) + " g/mol" : parts.join(" + ")) + " = " + (flash === "mass" ? hl(out) : "<strong>" + out + "</strong>");
  }
  function paintRead(){
    var u = units(), k = kOf(u), m = MONO[u[0]], md = S.mode, rows = [], mono, poly, unit, brt;
    if (md === "co") {
      mono = co.set.map(function(id, j){ return "<strong>" + "AB".charAt(j) + "</strong> = " + monoTxt(id); }).join("<br>");
      var sat = co.set.filter(function(id){ return MONO[id].sat; })[0];
      poly = sat ? muted("none past " + MONO[sat].nm + ": it has no C=C") : co.set.length === 1 ? m.poly + (m.common ? " (" + m.common + ")" : "") : "copolymer of " + MONO[co.set[0]].nm + " and " + MONO[co.set[1]].nm;
      var sec = u.slice(0, Math.min(k, 6)).map(function(id){ return MONO[id].ct.join("–"); });
      unit = co.set.length === 1 && !sat ? m.unit : sec.length ? "section: –" + sec.join("–") + "–" + (k > 6 ? "…" : "") : muted("no chain");
    } else {
      mono = monoTxt(m.id);
      poly = md === "pack" ? "poly(ethene): " + (pk >= 0.5 ? "branched chains, low-density (LDPE)" : "linear chains, high-density (HDPE)") : m.poly + " (" + m.common + ")";
      unit = m.unit;
    }
    if (hide.unit) unit = "?"; else if (flash === "unit") unit = hl(unit);
    rows.push(["Monomer", mono], ["Polymer name", poly], ["Repeating unit", unit]);
    if (md !== "pack") {
      if (!zipped()) brt = muted("zip the chain first");
      else if (k < u.length) brt = muted("no full chain to bracket");
      else { var bi = brInfo(u); brt = bi.one ? "✓ One " + (md === "co" && co.set.length > 1 ? "monomer unit" : "repeating unit") + ": " + bi.txt + (md === "co" && co.set.length > 1 ? " (from " + MONO[bi.id].nm + ")" : "")
        : bi.w === 2 ? "Two backbone carbons, but from two different monomers: " + bi.txt + ". Slide the bracket one carbon."
        : "Your bracket holds " + bi.w + " backbone carbon" + (bi.w > 1 ? "s" : "") + (bi.w <= 6 ? ": " + bi.txt : ""); }
      rows.push(["Bracket check", brt]);
    }
    rows.push(["Atoms lost", hide.atoms ? "?" : flash === "atoms" ? hl("0") : "0"]);
    rows.push(["Chain molar mass", hide.mass ? "?" : massTxt(u)]);
    if (md === "pack") {
      var cur = pk >= 0.5 ? "br" : "lin";
      var both = function(f, unitS){ return ["lin", "br"].map(function(id){ var t = PE[id].t + " " + f(PE[id]); return id === cur ? "<strong>" + t + "</strong>" : t; }).join(" · ") + unitS; };
      var dens = hide.dens ? "?" : both(function(P){ return P.d.toFixed(2); }, " g/cm³");
      rows.push(["Density (data, approximate)", flash === "dens" ? hl(dens) : dens], ["Melting point (data, approximate)", both(function(P){ return "≈ " + P.mp; }, " °C")]);
    }
    $(".ap-read", host).innerHTML = MV.readoutHTML(rows);
  }
  function paintCap(){
    var u = units(), k = kOf(u), j = Math.floor(z + 1e-6), n = u.length, t;
    if (S.mode === "pack") t = (nCh === 4 ? "Four" : "Six") + " polyethene chains, " + (pk >= 0.5 ? "branched" : "linear") + ". Densities are approximate data; real products vary.";
    else if (j < k || busy) t = "Monomers joined: <strong>" + Math.min(j, k) + "</strong> of " + k + (j < k && !busy ? ". Press <strong>Zip it</strong> or <strong>Step</strong>." : "");
    else {
      var N = ovN || (S.k1000 ? n * 1000 : n);
      t = (N > n ? "Drawn: " + n + " units · in the chain: <strong>" + num(N) + "</strong> units" : "Monomers in: <strong>" + k + "</strong>") + (hide.atoms ? "" : " · Atoms lost: <strong>0</strong>");
      if (k < n) t += ". " + MV.cap(MONO[u[k]].nm) + " has no C=C to open: the chain stops in front of it.";
    }
    $(".ap-cap", host).innerHTML = t + (note ? " " + note : "");
  }
  function paintCo(){
    var bx = $(".ap-co", host); if (S.mode !== "co") return;
    var n = S.n;
    MV.keepFocus(bx, function(){
      bx.innerHTML = '<p class="ap-lab">Monomers in the mix (choose up to two)</p><div class="ap-set" role="group" aria-label="Monomers in the mix">' + MIX.map(function(id){
        var j = co.set.indexOf(id);
        return '<button type="button" class="ap-mx" data-mx="' + id + '" data-k="mx' + id + '" aria-pressed="' + (j >= 0) + '"' + (locked ? " disabled" : "") + ">" + (j >= 0 ? '<b aria-hidden="true">' + "AB".charAt(j) + "</b> " : "") + MONO[id].nm + "</button>";
      }).join("") + '</div><p class="ap-lab">Positions (tap one to switch it)</p><div class="ap-pos" role="group" aria-label="Positions">' + co.pos.slice(0, n).map(function(j, i){
        var id = co.set[j] || co.set[0];
        return '<button type="button" class="ap-pb" data-ps="' + i + '" data-k="ps' + i + '" aria-label="Position ' + (i + 1) + ": " + esc(MONO[id].nm) + " (" + "AB".charAt(j) + ')"' + (locked ? " disabled" : "") + ">" + "AB".charAt(j) + "<small>" + (i + 1) + "</small></button>";
      }).join("") + "</div>";
    });
  }
  function paint(){
    setVis(); paintCo(); draw(); paintRead(); paintCap();
    $(".ap-msg", host).innerHTML = msg;
    goBtn.textContent = zipped() ? "Zip it again" : "Zip it"; goBtn.disabled = locked || !full();
    MV.changed();
  }
  // zipper
  function killPlayer(){ pl = null; $(".ap-player", host).innerHTML = ""; }
  function makePlayer(i){
    var bx = $(".ap-player", host), d = document.createElement("div"), k = full(); bx.innerHTML = ""; bx.appendChild(d);
    if (S.mode === "pack" || !k) { pl = null; return; }
    quiet = true;
    pl = MV.player(d, { count:k + 1, interval:900, label:function(j){ return "Monomers joined: " + j + " of " + k; }, render:function(j){ if (quiet || busy) return; stepTo(j); } });
    pl.go(i); quiet = false;
  }
  function stepTo(j){
    if (tw) { tw(); tw = null; }
    var from = z; flash = ""; note = "";
    tw = MV.tween({ dur:420, step:function(t){ z = lerp(from, j, t); draw(); }, done:function(){ tw = null; z = j; paint(); } });
  }
  function go(cb){
    var k = full();
    if (busy || S.mode === "pack" || !k) { if (cb) cb(); return; }
    if (tw) { tw(); tw = null; }
    busy = true; lock(true); killPlayer(); z = 0; flash = ""; draw(); paintCap(); paintRead();
    tw = MV.tween({ dur:Math.max(1000, 430 * k), ease:LIN, step:function(t){ z = t * k; draw(); paintCap(); }, done:function(){
      tw = null; z = k; busy = false; lock(false); makePlayer(k); paint(); if (cb) MV.wait(350, cb);
    } });
  }
  function packTo(target, cb){
    if (tw) { tw(); tw = null; }
    busy = true; lock(true); var from = pk;
    tw = MV.tween({ dur:1700, step:function(t){ pk = lerp(from, target, t); draw(); }, done:function(){ tw = null; pk = target; busy = false; lock(false); paint(); if (cb) cb(); } });
  }
  function reset(m){
    if (tw) { tw(); tw = null; }
    busy = false; if (locked) lock(false);
    fixBr(); hide = {}; flash = ""; note = ""; glowSide = 0; ovN = 0; massT = null; msg = m || ""; pk = S.shape === "br" ? 1 : 0;
    z = full(); api.save(); makePlayer(z); paint();
  }
  goBtn.addEventListener("click", function(){ msg = ""; note = ""; ovN = ovN && S.mode === "build" ? ovN : 0; go(); });
  kin.addEventListener("change", function(){ S.k1000 = kin.checked; ovN = 0; note = ""; api.save(); paint(); });
  // copolymer chips and positions
  $(".ap-co", host).addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || busy) return;
    if (b.dataset.mx) {
      var id = b.dataset.mx, j = co.set.indexOf(id), pos = [];
      if (j >= 0) { if (co.set.length === 1) { msg = "Keep at least one monomer in the mix."; $(".ap-msg", host).innerHTML = msg; return; } co.set.splice(j, 1); co.pos = co.pos.map(function(){ return 0; }); }
      else { co.set = co.set.length >= 2 ? [co.set[0], id] : co.set.concat([id]); for (var q = 0; q < 12; q++) pos.push(co.set.length > 1 ? q % 2 : 0); co.pos = pos; }
      reset(); return;
    }
    if (b.dataset.ps != null) {
      if (co.set.length < 2) { msg = "Add a second monomer to the mix to switch a position."; $(".ap-msg", host).innerHTML = msg; return; }
      var i = +b.dataset.ps; co.pos[i] = 1 - co.pos[i]; reset();
    }
  });
  // bracket tool: drag a mark, tap the chain, or use the arrow keys on a mark
  function svgPt(e){ var rc = svg.getBoundingClientRect(), vb = geo.vb; return [vb[0] + (e.clientX - rc.left) / rc.width * vb[2], vb[1] + (e.clientY - rc.top) / rc.height * vb[3]]; }
  function nearest(p, side, lo, hi){ var best = lo, bd = 1e9; for (var k = lo; k <= hi; k++) { var s = geo.slot(k, side), d = Math.hypot(s[0] - p[0], (s[1] - p[1]) * 0.7); if (d < bd) { bd = d; best = k; } } return best; }
  function moveMark(which, k){
    if (which === "L") S.L = clamp(k, 0, S.R - 1); else S.R = clamp(k, S.L + 1, 2 * S.n);
    draw(); paintRead(); MV.changed();
  }
  hd.addEventListener("pointerdown", function(e){ var b = e.target.closest(".ap-hdl"); if (!b || b.disabled || !geo) return; drag = b.dataset.h; try { b.setPointerCapture(e.pointerId); } catch (err) {} b.focus({ preventScroll:true }); e.preventDefault(); });
  hd.addEventListener("pointermove", function(e){
    if (!drag || !geo) return;
    var p = svgPt(e), k = drag === "L" ? nearest(p, "L", 0, S.R - 1) : nearest(p, "R", S.L + 1, 2 * S.n);
    if (k !== (drag === "L" ? S.L : S.R)) moveMark(drag, k);
  });
  function endDrag(){ if (!drag) return; drag = null; api.save(); paint(); }
  hd.addEventListener("pointerup", endDrag); hd.addEventListener("pointercancel", endDrag);
  hd.addEventListener("keydown", function(e){
    var b = e.target.closest(".ap-hdl"); if (!b || b.disabled) return;
    var w = b.dataset.h, cur = w === "L" ? S.L : S.R, k = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") k = cur - 1; else if (e.key === "ArrowRight" || e.key === "ArrowUp") k = cur + 1;
    else if (e.key === "Home") k = 0; else if (e.key === "End") k = 2 * S.n;
    if (k == null) return; e.preventDefault(); moveMark(w, k); api.save(); paint();
  });
  svg.addEventListener("click", function(e){
    if (!geo || !brOn() || busy || locked) return;
    var p = svgPt(e), k = nearest(p, "L", 0, 2 * S.n);
    if (Math.abs(k - S.L) <= Math.abs(k - S.R) && k < S.R) moveMark("L", k); else if (k > S.L) moveMark("R", k); else return;
    api.save(); paint();
  });
  function measure(){
    var W = Math.round(box.getBoundingClientRect().width) || 640, p2 = choosePer(W), c2 = W < 480 ? 4 : 6;
    if (p2 === per && c2 === nCh && Math.abs(W - lastW) < 2) return false;
    per = p2; nCh = c2; lastW = W; return true;
  }
  if (window.ResizeObserver) new ResizeObserver(function(){ if (measure()) draw(); }).observe(box);
  measure();

  // ---------- predictions ----------
  var hooks = {
    start:function(p){
      if (tw) { tw(); tw = null; } busy = false; if (locked) lock(false);
      S.k1000 = false; kin.checked = false; hide = {}; flash = ""; note = ""; glowSide = 0; ovN = 0; massT = null; msg = "";
      if (p.id === "p3") { S.mode = "pack"; S.shape = "lin"; pk = 0; hide.dens = true; }
      else {
        S.mode = "build"; S.mono = p.id === "p1" ? "ethene" : p.id === "p2" ? "propene" : "chloroethene"; S.n = p.id === "p1" ? 6 : p.id === "p2" ? 4 : 10;
        if (p.id === "p4") ovN = 100;
        hide[p.id === "p1" ? "atoms" : p.id === "p2" ? "unit" : "mass"] = true;
      }
      modeRG.set(S.mode); monoRG.set(S.mono); shapeRG.set(S.shape); sl.set("apn", S.n); fixBr(); api.save();
      z = 0; killPlayer(); paint();
    },
    run:function(p, done){
      if (p.id === "p3") { note = ""; packTo(1, function(){ S.shape = "br"; shapeRG.set("br"); hide.dens = false; flash = "dens"; note = "Gaps open up between the branched chains: 0.92 vs 0.96 g/cm³."; api.save(); paint(); MV.wait(250, done); }); return; }
      go(function(){
        if (p.id === "p1") { hide.atoms = false; flash = "atoms"; note = "No by-product: nothing else forms."; paint(); MV.wait(200, done); return; }
        busy = true; lock(true);
        if (p.id === "p2") tw = MV.tween({ dur:1000, step:function(t){ glowSide = t; draw(); }, done:function(){ tw = null; busy = false; lock(false); hide.unit = false; flash = "unit"; note = "The CH₃ hangs from every second backbone carbon."; paint(); MV.wait(200, done); } });
        else { hide.mass = false; massT = 0; tw = MV.tween({ dur:1100, step:function(t){ massT = t; paintRead(); }, done:function(){ tw = null; massT = null; busy = false; lock(false); flash = "mass"; note = "100 × 62.5 = 6250."; paint(); MV.wait(200, done); } }); }
      });
    }
  };
  // ---------- challenges ----------
  function chal(id){
    var u = units(), n = S.n, set = co.set.slice().sort().join();
    if (id === "tc3") {
      if (S.mode !== "co") return { ok:false, msg:"Switch to Copolymer mode, choose the monomer(s), then set each position." };
      if (co.set.some(function(x){ return MONO[x].sat; })) return { ok:false, msg:"Monomers need a C=C. " + M4 };
      if (co.set.indexOf("chloropropene") >= 0) return { ok:false, msg:"Split the backbone into two-carbon pieces; no piece has three backbone carbons." };
      if (set === "chloroethene") return { ok:false, msg:"Two units have no Cl: ethene." };
      if (set !== "chloroethene,ethene") return { ok:false, msg:"Those monomers don’t give this section. Cut the backbone every two carbons and look at what each piece carries." };
      if (n !== 4) return { ok:false, msg:"The section has 8 backbone carbons: that’s 4 units. Set the chain length to 4." };
      if (u.join() !== "chloroethene,ethene,chloroethene,ethene") return { ok:false, msg:"Right monomers. Now match the order, piece by piece: CH₂–CHCl, CH₂–CH₂, CH₂–CHCl, CH₂–CH₂." };
      return { ok:true };
    }
    if (S.mode === "pack") return { ok:false, msg:"Switch to Build mode: Pack mode only compares polyethene chains." };
    if (id === "tc1") {
      if (u.indexOf("tetrafluoroethene") >= 0) return { ok:false, msg:"That’s fluorine." };
      if (u.some(function(x){ return x !== "chloroethene"; })) return { ok:false, msg:"That polymer’s repeating unit has no chlorine. Which monomer has Cl?" };
    } else {
      if (S.k1000) return { ok:false, msg:"Switch off ×1000: the challenge asks for a 6-unit chain." };
      if (n === 9 && u.every(function(x){ return x === "ethene"; })) return { ok:false, msg:"252 g/mol, but the challenge asks for 6 units." };
      if (n !== 6 || u.some(function(x){ return x !== "propene"; })) {
        var k = kOf(u), tot = 0, noM = false; u.forEach(function(x){ if (MONO[x].M == null) noM = true; else tot += MONO[x].M; });
        if (k < u.length || noM) return { ok:false, msg:"That chain’s molar mass can’t be 252 g/mol here. 252 ÷ 6 = ?" };
        return { ok:false, msg:"That chain is " + num(tot) + " g/mol" + (n !== 6 ? ", with " + n + " units" : "") + ". The challenge asks for 6 units and 252 g/mol." };
      }
    }
    if (!zipped()) return { ok:false, msg:"Zip the chain first, then bracket one repeating unit." };
    var bi = brInfo(u);
    if (bi.one) return { ok:true };
    if (bi.w === 2) return { ok:false, msg:"Those are two backbone carbons from two different monomers. Slide the bracket one carbon so it holds " + MONO[u[0]].unit + "." };
    if (id === "tc2" && bi.w === 3) return { ok:false, msg:M2 };
    return { ok:false, msg:"One unit is two backbone carbons." };
  }
  reset();
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Plastics and the planet ----------
function ricon(n){ return '<svg class="ap-ric" viewBox="0 0 34 31" aria-hidden="true"><path d="M17 3 L31 28 H3 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><text x="17" y="20.5" text-anchor="middle" font-size="12.5" font-weight="700" fill="currentColor">' + n + "</text></svg>"; }
function floatSVG(liq, t){
  var W = 420, top = 70, bot = 236, s = "";
  s += '<rect x="14" y="' + top + '" width="392" height="' + (bot - top) + '" fill="var(--hi-soft)"/>' + Ln(14, top, 406, top, { c:"var(--ink-2)", w:2 });
  s += '<path d="M14 40 V' + (bot + 2) + " H406 V40" + '" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/>';
  s += T(406, bot + 18, liq.t + ", " + liq.d.toFixed(2) + " g/mL", { a:"end", fs:14, c:"var(--ink-2)" });
  DENS.forEach(function(r, i){
    var x = 48 + i * 65, fl = r[1] < liq.d, y = lerp(22, fl ? top - 2 : bot - 44 + (i % 2) * 8, t);
    s += '<rect x="' + (x - 27) + '" y="' + r1(y - 12) + '" width="54" height="24" rx="6" fill="var(--sheet)" stroke="var(--ink)" stroke-width="2"/>' + T(x, y + 0.5, r[0], { fs:13, w:700 });
  });
  return s;
}
function water(x, y, op){
  var s = "";
  [-1, 1].forEach(function(d){ s += Ln(x, y, x + d * 14, y + 10, { w:2, op:op }) + '<circle cx="' + r1(x + d * 14) + '" cy="' + r1(y + 10) + '" r="6.5" fill="var(--at-h)" stroke="var(--at-h-line)" stroke-width="1.4"' + opA(op) + "/>" + T(x + d * 14, y + 10.5, "H", { fs:8.5, w:700, c:"var(--at-h-ink)", op:op }); });
  return s + '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="9.5" fill="var(--at-o)"' + opA(op) + "/>" + T(x, y + 0.5, "O", { fs:11, w:700, c:"var(--sheet)", op:op });
}
function zoomSVG(kind, t){
  var yc = 108, s = '<rect x="1" y="1" width="318" height="206" rx="12" fill="var(--sheet)" stroke="var(--rule)" stroke-width="2"/>', N = 11, x0 = 24, dx = 27.2, i;
  var pes = kind === "pes", split = pes ? clamp((t - 0.55) / 0.3, 0, 1) : 0, sh = 13 * split, pts = [];
  for (i = 0; i < N; i++) pts.push([x0 + i * dx + (pes ? (i <= 5 ? -sh : sh) : 0), yc + (i % 2 ? 10 : -10)]);
  for (i = 0; i < N - 1; i++) { if (pes && i === 5) { if (split < 0.99) s += Ln(pts[5][0], pts[5][1], pts[6][0], pts[6][1], { w:2.6, op:1 - split, c:"var(--ink)" }); continue; } s += Ln(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], { w:2.6 }); }
  if (pes) {
    var c5 = pts[5], o6 = pts[6];
    s += '<rect x="' + r1(c5[0] - 26) + '" y="' + r1(c5[1] - 18) + '" width="' + r1(o6[0] - c5[0] + 52) + '" height="62" rx="12" fill="none" stroke="var(--hi-ink)" stroke-width="1.6" stroke-dasharray="4 3"' + opA(1 - split) + "/>" + T((c5[0] + o6[0]) / 2, c5[1] - 30, "ester link", { fs:12, c:"var(--ink-2)", op:1 - split });
    s += Ln(c5[0] - 3, c5[1], c5[0] - 3, c5[1] + 24, { w:2.4 }) + Ln(c5[0] + 3, c5[1], c5[0] + 3, c5[1] + 24, { w:2.4 }) + T(c5[0], c5[1] + 34, "O", { fs:16, w:700, c:"var(--at-o)" });
    s += '<circle cx="' + r1(o6[0]) + '" cy="' + r1(o6[1]) + '" r="9" fill="var(--sheet)"/>' + T(o6[0], o6[1], "O", { fs:16, w:700, c:"var(--at-o)" });
    if (split > 0.02) s += T(c5[0] + 18, c5[1] - 2, "OH", { fs:14, w:700, c:"var(--at-o)", op:split }) + T(o6[0] - 13, o6[1] + 1, "H", { fs:14, w:700, c:"var(--ink-2)", op:split });
  }
  // water molecules: [start x, start y, target x, target y]
  var W = [[40, 30, 70, 82], [150, 186, 120, 132], [260, 26, 230, 84], [300, 180, 270, 132]];
  if (pes) W[1] = [150, 190, (pts[5][0] + pts[6][0]) / 2, yc + 30];
  W.forEach(function(w, j){
    var attack = pes && j === 1, f = attack ? clamp(t / 0.55, 0, 1) : Math.sin(Math.PI * t), x = lerp(w[0], w[2], f), y = lerp(w[1], w[3], f), op = attack ? 1 - split : 1;
    if (op < 0.02) return;
    s += water(x, y, op);
  });
  return s;
}
// station 3: which evidence and reasons fit each action
var FIT = { bag:{ e:["persist", "stat"], r:["fewer", "litter"] }, refill:{ e:["persist", "stat"], r:["fewer", "litter"] }, sort:{ e:["density", "stat"], r:["sorted"] }, foam:{ e:["persist", "stat"], r:["fewer", "litter"] } };
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.sort = S.sort || {}; if (!LIQ.some(function(l){ return l.id === S.liq; })) S.liq = "water"; S.drop = !!S.drop; S.wet = !!S.wet; S.claim = S.claim || {};
  var sel = null, smsg = null, ft = S.drop ? 1 : 0, zt = S.wet ? 1 : 0, fbusy = false, zbusy = false, cmsg = null;
  host.innerHTML = '<div class="part ap-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="ap-sort"></div>' +
    '<details class="alg"><summary>Check it with data</summary><p>' + s1.data + "</p>" +
    MV.tableHTML({ head:["Code", "Plastic", "Density (g/cm³)"], rows:DENS.map(function(r){ return [String(r[2]), r[0], r[1].toFixed(2)]; }), caption:"Densities of common plastics (approximate data)" }) +
    '<div class="ap-liq"></div><div class="q-actions"><button type="button" class="btn primary sm" data-fl="drop" data-k="fldrop">Drop the flakes in</button></div>' +
    '<div class="ap-fbox"><svg class="ap-fsvg" viewBox="0 0 420 264" role="img" aria-label=""></svg></div><dl class="read ap-fread" aria-live="polite"></dl></details></div>' +
    '<div class="part ap-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="q-actions"><button type="button" class="btn primary sm" data-zw="go" data-k="zwgo">Add water</button></div>' +
    '<div class="ap-zgrid"><figure class="ap-zfig"><figcaption>Polyethene: every link is C–C</figcaption><svg class="ap-zsvg" data-z="pe" viewBox="0 0 320 208" role="img" aria-label=""></svg></figure>' +
    '<figure class="ap-zfig"><figcaption>A polyester: ester links (a preview of module 08)</figcaption><svg class="ap-zsvg" data-z="pes" viewBox="0 0 320 208" role="img" aria-label=""></svg></figure></div>' +
    '<p class="banner ap-zban" aria-live="polite"></p><dl class="read ap-zread" aria-live="polite"></dl></div>' +
    '<div class="part ap-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><div class="ap-cl-a"></div><div class="ap-cl-e"></div><div class="ap-cl-r"></div>' +
    '<p class="ap-claim" aria-live="polite"></p><div class="q-actions"><button type="button" class="btn primary sm" data-cl="check" data-k="clchk">Check my plan</button></div><div class="ap-clfb"></div><p class="tiny muted">' + s3.canada + "</p></div>";

  // station 1: sort by resin code
  var sortBox = $(".ap-sort", host);
  function item(id){ return s1.items.filter(function(x){ return x.id === id; })[0]; }
  function paintSort(){
    var left = s1.items.filter(function(it){ return !S.sort[it.id]; }), h = '<p class="how">Tap an item, then tap the box it belongs in.</p><div class="ap-tray" role="group" aria-label="Items to sort">';
    h += left.length ? left.map(function(it){ return '<button type="button" class="ap-tile" data-it="' + it.id + '" data-k="it' + it.id + '" aria-pressed="' + (sel === it.id) + '">' + ricon(it.code) + "<span><strong>" + it.ab + "</strong><small>" + it.thing + "</small></span></button>"; }).join("")
      : '<p class="sort-done">All sorted. Codes 2 to 6 are addition polymers: each is made from a monomer with a C=C.</p>';
    h += "</div>";
    if (smsg) h += MV.fbHTML(smsg.k, smsg.h);
    h += '<div class="ap-bins">' + s1.bins.map(function(b){
      var inside = s1.items.filter(function(it){ return S.sort[it.id] === b.id; });
      return '<button type="button" class="ap-bin" data-bin="' + b.id + '" data-k="bin' + b.id + '"><strong>' + b.label + "</strong><small>" + b.sub + '</small><span class="ap-in">' + inside.map(function(it){ return '<span class="ap-chipin">' + it.code + " " + it.ab + "</span>"; }).join("") + "</span></button>";
    }).join("") + "</div>";
    MV.keepFocus(sortBox, function(){ sortBox.innerHTML = h; });
  }
  sortBox.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.it) { sel = sel === b.dataset.it ? null : b.dataset.it; smsg = null; paintSort(); return; }
    if (b.dataset.bin) {
      if (!sel) { smsg = { k:"", h:"Tap an item first, then tap the box it belongs in." }; paintSort(); return; }
      var it = item(sel), ans = MV.ans(it);
      if (b.dataset.bin === ans) { S.sort[it.id] = ans; smsg = { k:"good", h:"<strong>✓ " + it.code + " " + it.ab + " (" + it.poly + ").</strong> " + it.why }; sel = null; api.save(); }
      else smsg = { k:"bad", h:"<strong>✗ Not that box.</strong> " + (ans === "add" ? s1.wrongAdd : it.why) + " Try another box." };
      paintSort(); MV.focusFb(sortBox);
    }
  });
  // float test
  var liqRG = radios($(".ap-liq", host), { label:"Liquid", aria:"Liquid for the float test", cls:"chips", options:LIQ.map(function(l){ return { id:l.id, t:l.t + " (" + l.d.toFixed(2) + " g/mL)" }; }), value:S.liq,
    onChange:function(v){ S.liq = v; S.drop = false; ft = 0; api.save(); paintFloat(); } });
  function liq(){ return LIQ.filter(function(l){ return l.id === S.liq; })[0]; }
  function paintFloat(){
    var L = liq(), sv = $(".ap-fsvg", host), fl = DENS.filter(function(r){ return r[1] < L.d; }).map(function(r){ return r[0]; }), sk = DENS.filter(function(r){ return r[1] >= L.d; }).map(function(r){ return r[0]; });
    sv.innerHTML = floatSVG(L, ft);
    sv.setAttribute("aria-label", "Float test in " + L.t + " of density " + L.d.toFixed(2) + " g/mL. " + (S.drop ? "Floating: " + fl.join(", ") + ". Sunk: " + sk.join(", ") + "." : "Six plastic flakes wait above the liquid: PP, LDPE, HDPE, PS, PET and PVC."));
    $(".ap-fread", host).innerHTML = MV.readoutHTML([["Float (less dense than the liquid)", S.drop ? fl.join(", ") || "none" : muted("drop the flakes in")], ["Sink (denser than the liquid)", S.drop ? sk.join(", ") || "none" : muted("drop the flakes in")]]);
    $('[data-fl="drop"]', host).disabled = fbusy;
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-fl]"); if (!b || fbusy) return;
    fbusy = true; liqRG.lock(true); S.drop = false; paintFloat();
    MV.tween({ dur:1500, step:function(t){ ft = t; $(".ap-fsvg", host).innerHTML = floatSVG(liq(), t); }, done:function(){ ft = 1; S.drop = true; fbusy = false; liqRG.lock(false); api.save(); paintFloat(); } });
  });
  // station 2: water vs the two chains
  function paintZoom(){
    $$(".ap-zsvg", host).forEach(function(sv){ var k = sv.dataset.z; sv.innerHTML = zoomSVG(k, zt);
      sv.setAttribute("aria-label", k === "pe" ? "A polyethene chain, a zigzag of C–C single bonds, with water molecules around it. " + (S.wet ? "The water molecules bounced off: no link was broken." : "")
        : "A polyester chain with one ester link, C(=O)–O, ringed. " + (S.wet ? "A water molecule attacked the ester link and split the chain into a –COOH end and an HO– end." : "")); });
    var ban = $(".ap-zban", host); ban.textContent = S.wet ? s2.banner : ""; ban.className = "banner ap-zban" + (S.wet ? " good" : "");
    $(".ap-zread", host).innerHTML = MV.readoutHTML([["Polyethene: links broken by water", S.wet ? "<strong>0</strong>: every link is C–C" : muted("press Add water")], ["Polyester: ester links broken", S.wet ? "<strong>1</strong>: hydrolysis splits the chain (module 08)" : muted("press Add water")]]);
    var b = $('[data-zw="go"]', host); b.disabled = zbusy; b.textContent = S.wet ? "Add water again" : "Add water";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-zw]"); if (!b || zbusy) return;
    zbusy = true; S.wet = false; zt = 0; paintZoom();
    MV.tween({ dur:2600, ease:LIN, step:function(t){ zt = t; $$(".ap-zsvg", host).forEach(function(sv){ sv.innerHTML = zoomSVG(sv.dataset.z, t); }); }, done:function(){ zt = 1; S.wet = true; zbusy = false; api.save(); paintZoom(); } });
  });
  // station 3: claim builder
  function rg(sel2, key, label, opts, cls){ return radios($(sel2, host), { label:label, aria:label, cls:cls, options:opts, value:S.claim[key] || "", onChange:function(v){ S.claim[key] = v; S.claim.ok = false; cmsg = null; api.save(); paintClaim(); } }); }
  rg(".ap-cl-a", "a", "Action", s3.actions, "chips");
  rg(".ap-cl-e", "e", "Evidence", s3.evidence, "chips ap-ev");
  rg(".ap-cl-r", "r", "Reason", s3.reasons, "chips");
  function txt(list, id){ var x = list.filter(function(o){ return o.id === id; })[0]; return x ? x.t : null; }
  function paintClaim(){
    var c = S.claim, a = txt(s3.actions, c.a), ev = txt(s3.evidence, c.e), rs = txt(s3.reasons, c.r), gap = '<span class="muted">___</span>';
    $(".ap-claim", host).innerHTML = "<strong>My plan:</strong> I will " + (a || gap) + ". <strong>Evidence:</strong> " + (ev || gap) + " <strong>This helps because of</strong> " + (rs || gap) + ".";
    var fb = $(".ap-clfb", host);
    fb.innerHTML = cmsg ? MV.fbHTML(cmsg.k, cmsg.h) : c.ok ? MV.fbHTML("good", "<strong>✓ Your plan holds together.</strong> The evidence supports the action, and the reason follows from it.") : "";
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-cl]"); if (!b) return;
    var c = S.claim, fit = FIT[c.a];
    if (!c.a || !c.e || !c.r) { cmsg = { k:"", h:"Choose an action, a piece of evidence and a reason first." }; paintClaim(); return; }
    if (fit.e.indexOf(c.e) < 0) cmsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (c.a === "sort" ? "Persistence explains why plastic lasts, not why sorting matters. Sorting works because each polymer has to reach its own stream: try the density-sorting fact or the waste figure." : "The density fact is about sorting plastics, not about how many are made or thrown away. Try the persistence fact or the waste figure.") };
    else if (fit.r.indexOf(c.r) < 0) cmsg = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (c.a === "sort" ? "Sorting doesn’t change how many items are made; it gets each one to the right recycling stream." : "This action means fewer items are made and thrown away; it isn’t about sorting.") };
    else { cmsg = null; c.ok = true; }
    api.save(); paintClaim(); MV.focusFb(fb2());
  });
  function fb2(){ return $(".ap-clfb", host).parentNode; }
  paintSort(); paintFloat(); paintZoom(); paintClaim();
}

// ---------- Practice 2: Polymer reasoning (number entry + chips; from SCH4U 01's formulasAct) ----------
function reasonAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), h = '<div class="q" data-ri="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "num") h += '<div class="numrow ap-numrow"><label for="ri-' + it.id + '">Your answer:</label><input class="numin" id="ri-' + it.id + '" data-rin="' + it.id + '" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(x.val) + '"' + (x.solved ? " disabled" : "") + '><span class="ap-unit">' + it.unit + "</span></div>";
    else h += '<div class="chips" role="radiogroup" aria-label="Choices" style="margin-top:10px">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + (x.solved ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + (it.kind === "chips" ? it.options[x.pick].t : it.display) + ".</strong> " + (it.kind === "chips" ? it.options[x.pick].why || "" : "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id] + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = MV.usesHTML(a.uses) + '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  function near(v, w){ return Math.abs(v - w) <= Math.abs(w) * 0.01 + 1e-9; }
  function judge(it, x){
    if (it.kind === "num") {
      var s = String(x.val || "").replace(/(g\s*\/\s*mol|units?|g|%)\s*$/i, "").replace(/\s+/g, ""), v = MV.parseNum(s);
      if (!v || v.length !== 1) return { bad:"Enter one number (you can leave off the unit)." };
      if (near(v[0], MV.ans(it))) return { ok:true };
      var w = (it.wrong || []).filter(function(z){ return near(v[0], z.match); })[0];
      return { fb:w ? w.fb : it.fb };
    }
    if (x.pick == null) return { bad:"Choose an answer first." };
    return MV.ok(it.options[x.pick]) ? { ok:true } : { fb:it.options[x.pick].why };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.rin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.rin) { var b = host.querySelector('[data-k="' + e.target.dataset.rin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ri]"); if (!bx) return;
    var it = item(bx.dataset.ri), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      var r = judge(it, x);
      if (r.bad) { msgs[it.id] = r.bad; paint(); return; }
      if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = r.fb; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-ri="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: Design a copolymer segment ----------
var task = (function(){
  var S = null, api = null, lastW = 0;
  function read(){ var p = S && Array.isArray(S.pos) ? S.pos : []; return { pos:[0, 1, 2, 3, 4, 5].map(function(i){ return p[i] === "P" ? "P" : "E"; }) }; }
  function stats(d){ var nP = d.pos.filter(function(c){ return c === "P"; }).length, adj = []; for (var i = 1; i < 6; i++) if (d.pos[i] === "P" && d.pos[i - 1] === "P") adj.push(i); return { nP:nP, nE:6 - nP, M:MONO.ethene.M * (6 - nP) + MONO.propene.M * nP, adj:adj }; }
  function paint(){
    var d = read(), s = stats(d), inp = $("#ap-tkpos"), sv = $("#ap-tksvg");
    MV.keepFocus(inp, function(){ inp.innerHTML = d.pos.map(function(c, i){ return '<button type="button" class="ap-tp' + (c === "P" ? " p" : "") + '" data-tp="' + i + '" data-k="tp' + i + '" aria-label="Position ' + (i + 1) + ": " + (c === "P" ? "propene (P)" : "ethene (E)") + '. Tap to switch.">' + c + "<small>" + (i + 1) + "</small></button>"; }).join(""); });
    var W = Math.round(sv.getBoundingClientRect().width) || 420, per = W < 430 ? 3 : 6; lastW = W;
    var g = PC.svg(d.pos.map(function(c){ return c === "P" ? "propene" : "ethene"; }), { perRow:per, minW:PC.minW(per), bottom:70 });
    sv.setAttribute("viewBox", g.vb.join(" ")); sv.innerHTML = g.html;
    sv.setAttribute("aria-label", "Your segment: " + d.pos.join(" ") + ". A backbone of 12 carbons" + (s.nP ? " with a CH₃ on the second carbon of each propene unit" : "") + ".");
    $("#ap-tkread").innerHTML = MV.readoutHTML([["Units", "6: " + s.nE + " E, " + s.nP + " P"], ["Molar mass", s.nE + " × 28 + " + s.nP + " × 42 = <strong>" + num(s.M) + " g/mol</strong>"],
      ["P next to P", s.adj.length ? "positions " + s.adj.map(function(i){ return i + " and " + (i + 1); }).join("; ") : "none"]]);
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; if (!Array.isArray(S.pos)) S.pos = ["E", "E", "E", "E", "E", "E"];
      inp.innerHTML = '<p class="ap-lab">Positions 1 to 6 (tap to switch between E and P)</p><div class="ap-tkpos" id="ap-tkpos" role="group" aria-label="Segment positions"></div>';
      pv.innerHTML = '<h4 class="ap-h4">Your segment</h4><div class="ap-tkbox"><svg class="ap-svg" id="ap-tksvg" role="img" aria-label=""></svg></div><dl class="read" id="ap-tkread" aria-live="polite"></dl>';
      $("#ap-tkpos").addEventListener("click", function(e){ var b = e.target.closest("[data-tp]"); if (!b) return; var i = +b.dataset.tp, p = read().pos; p[i] = p[i] === "P" ? "E" : "P"; S.pos = p; api.save(); paint(); api.update(); });
      var chk = $("#task-check"), C = MV.C.task;
      if (chk && C.after4) chk.addEventListener("click", function(){ setTimeout(function(){ var ts = MV.taskState(), fb = $("#task-fb .fb.good"); if (fb && ts.found.length >= 4 && !fb.querySelector(".ap-after4")) fb.insertAdjacentHTML("beforeend", '<p class="ap-after4">' + C.after4 + "</p>"); }, 0); });
      if (window.ResizeObserver) new ResizeObserver(function(){ var w = Math.round($("#ap-tksvg").getBoundingClientRect().width); if (w && Math.abs(w - lastW) > 20) paint(); }).observe(pv);
      paint();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ var s = stats(d); return [d.pos.length === 6, s.M === 210, s.nP > 0 && s.nE > 0, !s.adj.length]; },
    tips:function(d, res){
      var C = MV.C.task.tips, out = [];
      function add(i){ if (out.indexOf(C[i]) < 0) out.push(C[i]); }
      if (!res[1]) { add(0); add(1); }
      if (!res[2]) add(1);
      if (!res[3]) { add(2); add(3); }
      return out;
    },
    key:function(d){ return d.pos.join(""); }, label:function(k){ return k; }, text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ reason:reasonAct },
  task:task
});
})();
