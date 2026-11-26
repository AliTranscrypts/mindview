// SCH4U 17 Lewis Diagrams: hero (carbonate built from its electron budget, then its resonance blend), Lewis builder
// (Explore: Build / Guided / Resonance modes, electron budget, octet counters, formal-charge badges), Choose the best
// structure (Part 3: formal-charge calculator, three-rules pairs, bond-length scales), Count and build (number entry plus
// a builder check), Which structure is best? (chips) and "One lone pair, room to spare" (task with a live Lewis diagram).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;
var MI = "−", D2R = Math.PI / 180;
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function r1(v){ return Math.round(v * 10) / 10; }
function lerp(a, b, t){ return a + (b - a) * t; }
function esc(s){ return MV.esc(s); }
function sum(a){ var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
function cp(o){ return JSON.parse(JSON.stringify(o)); }
function fact(n){ return n <= 1 ? 1 : n * fact(n - 1); }
function sgn(v){ return v > 0 ? "+" + v : v < 0 ? MI + (-v) : "0"; }
function n360(a){ return ((a % 360) + 360) % 360; }
// thirds and halves as vulgar fractions (bond orders 1⅓, formal charges −⅔)
function frac(v, plus){
  var neg = v < -1e-9, a = Math.abs(v), w = Math.floor(a + 1e-6), r = a - w, g = "";
  if (r < 1e-6) return v > 1e-9 && plus ? "+" + w : neg ? MI + w : String(w);
  g = Math.abs(r - 1 / 3) < 1e-6 ? "⅓" : Math.abs(r - 2 / 3) < 1e-6 ? "⅔" : Math.abs(r - 0.5) < 1e-6 ? "½" : "";
  return (neg ? MI : plus ? "+" : "") + (w ? w : "") + (g || MV.num(r, 2).slice(1));
}

// ---------- @component radioGroup (from MHF4U 25, via SCH4U 01–13) — segmented control or chip row as a real radio group (arrow keys,
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

// ---------- chemistry data ----------
// Valence electrons (the group's last digit), atomic numbers and periods are not in MV.chem.data (course plan §3 has no
// table of them); they are standard values, kept here. Electronegativities come from MV.chem.data.EN.
var VAL = { H:1, B:3, C:4, N:5, O:6, F:7, P:5, S:6, Cl:7, Xe:8 };
var ZN = { H:1, B:5, C:6, N:7, O:8, F:9, P:15, S:16, Cl:17, Xe:54 };
var PER = { H:1, B:2, C:2, N:2, O:2, F:2, P:3, S:3, Cl:3, Xe:5 };
var ENT = MV.chem.data.EN;
function atomC(el){ return el === "Xe" ? { fill:"var(--ink-2)", line:"none", ink:"var(--sheet)" } : MV.chem.atom(el); }   // Xe: a nonmetal, not cerulean
var SP = {
  h2o:{ f:"H2O", at:["H", "H", "O"], q:0, c:2 }, nh3:{ f:"NH3", at:["N", "H", "H", "H"], q:0, c:0 }, ch4:{ f:"CH4", at:["C", "H", "H", "H", "H"], q:0, c:0 },
  co2:{ f:"CO2", at:["C", "O", "O"], q:0, c:0 }, hcn:{ f:"HCN", at:["H", "C", "N"], q:0, c:1 }, ch2o:{ f:"CH2O", at:["C", "O", "H", "H"], q:0, c:0 },
  n2:{ f:"N2", at:["N", "N"], q:0, c:0 }, nh4:{ f:"NH4+", at:["N", "H", "H", "H", "H"], q:1, c:0 }, h3o:{ f:"H3O+", at:["H", "H", "H", "O"], q:1, c:3 },
  oh:{ f:"OH-", at:["O", "H"], q:-1, c:0 }, co3:{ f:"CO3^2-", at:["C", "O", "O", "O"], q:-2, c:0 }, no3:{ f:"NO3-", at:["N", "O", "O", "O"], q:-1, c:0 },
  no2:{ f:"NO2-", at:["N", "O", "O"], q:-1, c:0 }, o3:{ f:"O3", at:["O", "O", "O"], q:0, c:0 }, bf3:{ f:"BF3", at:["B", "F", "F", "F"], q:0, c:0 },
  pcl5:{ f:"PCl5", at:["P", "Cl", "Cl", "Cl", "Cl", "Cl"], q:0, c:0 }, sf4:{ f:"SF4", at:["S", "F", "F", "F", "F"], q:0, c:0 },
  sf6:{ f:"SF6", at:["S", "F", "F", "F", "F", "F", "F"], q:0, c:0 }, clf3:{ f:"ClF3", at:["Cl", "F", "F", "F"], q:0, c:0 },
  xef2:{ f:"XeF2", at:["Xe", "F", "F"], q:0, c:0 }, ocn:{ f:"OCN-", at:["O", "C", "N"], q:-1, c:1 }, n2o:{ f:"N2O", at:["N", "N", "O"], q:0, c:1 }
};
Object.keys(SP).forEach(function(k){ SP[k].id = k; SP[k].fh = MV.chem.f(SP[k].f); });
function fh(sp){ return sp.fh; }
function qTxt(q){ return q === 0 ? "" : (Math.abs(q) > 1 ? Math.abs(q) : "") + (q > 0 ? "+" : MI); }

// ---------- @component C1 lewisModel — a Lewis structure with one central atom: st = {c: centre index (−1 = not chosen),
// b: [bond order from the centre to each atom], lp: [lone pairs per atom], k: valence electrons counted (Guided)}.
// Budget, electrons per atom, formal charges, status, the guided solution (6 frames), best structure by formal charge,
// equivalent resonance structures and the blend.
function blank(sp){ var z = sp.at.map(function(){ return 0; }); return { c:-1, b:z.slice(), lp:z.slice(), k:false }; }
function fix(sp, st){
  var s = blank(sp), n = sp.at.length; if (!st || typeof st !== "object") return s;
  s.c = typeof st.c === "number" && st.c >= 0 && st.c < n ? Math.round(st.c) : -1;
  for (var i = 0; i < n; i++) {
    s.b[i] = s.c >= 0 && i !== s.c && st.b ? clamp(Math.round(+st.b[i] || 0), 0, 3) : 0;
    s.lp[i] = s.c >= 0 && sp.at[i] !== "H" && st.lp ? clamp(Math.round(+st.lp[i] || 0), 0, 4) : 0;
  }
  s.k = !!st.k; return s;
}
function total(sp){ return sum(sp.at.map(function(el){ return VAL[el]; })) - sp.q; }
function outer(sp, st){ var o = []; for (var i = 0; i < sp.at.length; i++) if (i !== st.c) o.push(i); return o; }
function bOn(st, i){ return i === st.c ? sum(st.b) : st.b[i]; }
function eOn(st, i){ return 2 * bOn(st, i) + 2 * st.lp[i]; }
function placed(st){ return 2 * sum(st.b) + 2 * sum(st.lp); }
function fc(sp, st, i){ return VAL[sp.at[i]] - 2 * st.lp[i] - bOn(st, i); }
function octInfo(sp, st, i){
  var el = sp.at[i], e = eOn(st, i), per = PER[el], o = { e:e, txt:el + " " + e, bad:"", short:false, exp:false, b6:false };
  if (st.c < 0) return o;
  if (el === "H") { if (e > 2) o.bad = o.txt = "H " + e + ": H holds only 2"; else if (e < 2) o.short = true; return o; }
  if (e > 8) {
    if (per === 2) o.bad = o.txt = el + " " + e + ": not possible for period 2";
    else if (i !== st.c) o.bad = o.txt = el + " " + e + ": only the central atom can expand";
    else if (e > 12) o.bad = o.txt = el + " " + e + ": more than 12, even for an expanded octet";
    else { o.exp = true; o.txt = el + " " + e + " (expanded octet, period " + per + ")"; }
  } else if (e < 8) { if (el === "B" && i === st.c && e === 6) o.b6 = true; else o.short = true; }
  return o;
}
function evalB(sp, st, hide){
  var T = total(sp), P = placed(st), oc = sp.at.map(function(_, i){ return octInfo(sp, st, i); }), r = { T:T, P:P, oc:oc, ok:false, code:"", msg:"" };
  function set(c, m){ r.code = c; r.msg = m; return r; }
  if (st.c < 0) return set("nocentre", "Choose the central atom: pick Make central, then tap an atom.");
  if (P > T && !hide) return set("over", P + " of " + T + ": too many electrons");
  var outs = outer(sp, st), unb = outs.filter(function(i){ return !st.b[i]; });
  if (unb.length) return set("unbonded", "Join every outer atom to the centre (" + unb.length + " still unbonded).");
  var ord = [st.c].concat(outs), bad = ord.filter(function(i){ return oc[i].bad; })[0];
  if (bad != null) return set("bad", oc[bad].bad);
  if (P < T && !hide) return set("left", (T - P) + " electrons left over");
  if (hide && P !== T) return set("count", "Count the valence electrons (step 1) to check your budget.");
  var sh = ord.filter(function(i){ return oc[i].short; })[0];
  if (sh != null) return set("short", sp.at[sh] + " has only " + oc[sh].e);
  r.ok = true; return set("ok", "Complete" + (ord.some(function(i){ return oc[i].b6; }) ? " (boron is content with 6)" : ""));
}
function score(sp, st){ var t = 0, pen = 0; sp.at.forEach(function(el, i){ var v = fc(sp, st, i); t += Math.abs(v); if (v < 0) pen += 4 - (ENT[el] || 2.5); }); return t * 100 + pen; }
function bestMulti(sp, s){
  var c = s.c, need = (8 - eOn(s, c)) / 2, cand = outer(sp, s).filter(function(i){ return /^(C|N|O|S)$/.test(sp.at[i]) && s.lp[i] > 0; }), best = null, bs = 1e9;
  if (need <= 0) return cp(s);
  (function rec(k, left, cur){
    if (k === cand.length) { if (left === 0) { var v = score(sp, cur); if (v < bs - 1e-9) { bs = v; best = cp(cur); } } return; }
    var i = cand[k];
    for (var x = Math.min(left, cur.lp[i], 3 - cur.b[i]); x >= 0; x--) { cur.b[i] += x; cur.lp[i] -= x; rec(k + 1, left - x, cur); cur.b[i] -= x; cur.lp[i] += x; }
  })(0, need, cp(s));
  return best || cp(s);
}
function solve(sp){
  var s = blank(sp), F = [cp(s)];
  s.k = true; F.push(cp(s));
  s.c = sp.c; F.push(cp(s));
  var outs = outer(sp, s); outs.forEach(function(i){ s.b[i] = 1; }); F.push(cp(s));
  var left = total(sp) - placed(s);
  outs.forEach(function(i){ if (sp.at[i] === "H") return; var k = clamp(Math.floor(left / 2), 0, 3); s.lp[i] = k; left -= 2 * k; }); F.push(cp(s));
  s.lp[s.c] += Math.max(0, Math.floor(left / 2)); F.push(cp(s));
  F.push(sp.at[s.c] === "B" ? cp(s) : bestMulti(sp, s));
  return F;
}
function finalOf(sp){ var F = solve(sp); return F[F.length - 1]; }
function stepsDone(sp, st){
  var d = [!!st.k], outs = st.c >= 0 ? outer(sp, st) : [];
  d[1] = st.c >= 0 && sp.at[st.c] === sp.at[sp.c];
  d[2] = d[1] && outs.every(function(i){ return st.b[i] >= 1; });
  d[3] = d[2] && outs.every(function(i){ return sp.at[i] === "H" || eOn(st, i) >= 8; });
  d[4] = d[3] && placed(st) === total(sp);
  d[5] = d[4] && evalB(sp, st).ok;
  return d;
}
function groups(sp, st){ var g = {}, order = []; outer(sp, st).forEach(function(i){ var el = sp.at[i]; if (!g[el]) { g[el] = []; order.push(el); } g[el].push(i); }); return order.map(function(el){ return g[el]; }); }
function stKey(st, i){ return st.b[i] + "," + st.lp[i]; }
function resCount(sp, st){
  var n = 1;
  groups(sp, st).forEach(function(ids){ var cnt = {}; ids.forEach(function(i){ var k = stKey(st, i); cnt[k] = (cnt[k] || 0) + 1; }); n *= fact(ids.length) / Object.keys(cnt).reduce(function(p, k){ return p * fact(cnt[k]); }, 1); });
  return Math.round(n);
}
// equivalent structures, the current one first (states of each element group permuted over its atoms)
function resList(sp, st){
  var out = [cp(st)], seen = {}, gs = groups(sp, st);
  function key(s){ return s.b.join("") + "|" + s.lp.join(""); }
  seen[key(st)] = 1;
  function perms(arr){ if (arr.length <= 1) return [arr]; var r = [], u = {}; arr.forEach(function(x, i){ if (u[x]) return; u[x] = 1; perms(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(function(p){ r.push([x].concat(p)); }); }); return r; }
  var combos = [cp(st)];
  gs.forEach(function(ids){
    var states = ids.map(function(i){ return stKey(st, i); }), P = perms(states), next = [];
    combos.forEach(function(base){ P.forEach(function(p){ var s = cp(base); ids.forEach(function(i, k){ var v = p[k].split(","); s.b[i] = +v[0]; s.lp[i] = +v[1]; }); next.push(s); }); });
    combos = next.slice(0, 24);
  });
  combos.forEach(function(s){ var k = key(s); if (!seen[k]) { seen[k] = 1; out.push(s); } });
  return out;
}
function blendOf(sp, st){
  var info = { atoms:{}, groups:[] };
  groups(sp, st).forEach(function(ids){
    var ks = {}; ids.forEach(function(i){ ks[stKey(st, i)] = 1; }); if (Object.keys(ks).length < 2) return;
    var ob = sum(ids.map(function(i){ return st.b[i]; })) / ids.length, of = sum(ids.map(function(i){ return fc(sp, st, i); })) / ids.length;
    ids.forEach(function(i){ info.atoms[i] = { o:ob, fc:of }; });
    info.groups.push({ el:sp.at[ids[0]], n:ids.length, o:ob, fc:of });
  });
  return info;
}

// ---------- @component C1 lewisView — SVG Lewis diagram: atom balls in the course colours with their letters, bond lines
// (single/double/triple; dashed partial bonds in a blend, labelled with the bond order), violet lone-pair dots (and a single
// unpaired dot), octet counters, formal-charge badges (ink on --hi-soft), ion brackets with the charge, highlight rings,
// glowing lone pairs and bonding-electron dots (formal-charge working), and flying electron pairs for animations.
// geo(sp, st, {W, H, rb, rad:[…]}) -> geometry; lewisSVG(sp, st, G, o) -> markup. Lone pairs and badges fill the widest gaps.
var ANG = { 1:[0], 2:[180, 0], 3:[-90, 180, 0], 4:[-90, 0, 90, 180], 5:[-90, -18, 54, 126, 198], 6:[-90, -30, 30, 90, 150, 210] };
var AR = 15;
function spread(occ, k){
  if (!k) return [];
  var out = [], i;
  if (!occ.length) { for (i = 0; i < k; i++) out.push(-90 + 360 * i / k); return out; }
  var s = occ.map(n360).sort(function(a, b){ return a - b; }), gaps = s.map(function(a, j){ return { a:a, z:(j < s.length - 1 ? s[j + 1] : s[0] + 360) - a, n:0 }; });
  for (i = 0; i < k; i++) { var g = gaps.slice().sort(function(p, q){ return q.z / (q.n + 1) - p.z / (p.n + 1) || q.z - p.z; })[0]; g.n++; }
  gaps.forEach(function(g){ for (var j = 1; j <= g.n; j++) out.push(g.a + g.z * j / (g.n + 1)); });
  return out;
}
function badgeDirs(occ){
  if (!occ.length) return [-45, -135];
  var s = occ.map(n360).sort(function(a, b){ return a - b; }), c = [];
  s.forEach(function(a, j){ var z = (j < s.length - 1 ? s[j + 1] : s[0] + 360) - a; if (z >= 150) { c.push({ d:a + z / 3, z:z / 2 }); c.push({ d:a + 2 * z / 3, z:z / 2 }); } else c.push({ d:a + z / 2, z:z }); });
  c.forEach(function(x){ x.s = x.z - 14 * Math.sin(x.d * D2R) + 4 * Math.cos(x.d * D2R); });
  c.sort(function(p, q){ return q.s - p.s; });
  return [c[0].d, c[1] ? c[1].d : c[0].d + 180];
}
function geo(sp, st, o){
  o = o || {};
  var W = o.W || 440, H = o.H || 300, rb = o.rb || 96, n = sp.at.length, cx = W / 2, cy = H / 2, P = [], i;
  if (st.c < 0) { var gap = Math.min(62, (W - 70) / Math.max(1, n - 1)); for (i = 0; i < n; i++) P[i] = { x:cx + (i - (n - 1) / 2) * gap, y:cy, th:-90 }; }
  else {
    var outs = outer(sp, st), A = ANG[outs.length] || [], sx = outs.length === 1 ? -rb / 2 : 0, sy = outs.length === 3 ? rb * 0.46 : 0;   // T shape: centred vertically
    P[st.c] = { x:cx + sx, y:cy + sy, th:0 };
    outs.forEach(function(j, k){ var a = A[k] * D2R; P[j] = { x:cx + sx + rb * Math.cos(a), y:cy + sy + rb * Math.sin(a), th:A[k] }; });
  }
  var atoms = sp.at.map(function(el, j){
    var p = P[j], occ = st.c < 0 ? [] : j === st.c ? outer(sp, st).map(function(k){ return P[k].th; }) : [p.th + 180];
    var nlp = st.c < 0 ? 0 : st.lp[j], rad = o.rad && o.rad[j] ? 1 : 0, dirs = spread(occ, nlp + rad);
    var bd = badgeDirs(occ.concat(dirs));
    return { el:el, x:p.x, y:p.y, th:p.th, lp:dirs.slice(0, nlp), rad:rad ? dirs[nlp] : null, octD:bd[0], fcD:bd[1] };
  });
  var bonds = [];
  if (st.c >= 0) outer(sp, st).forEach(function(j){ if (!st.b[j]) return; var A = atoms[st.c], B = atoms[j], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
    bonds.push({ i:j, o:st.b[j], ax:A.x, ay:A.y, bx:B.x, by:B.y, ux:dx / L, uy:dy / L, L:L, mx:(A.x + B.x) / 2, my:(A.y + B.y) / 2 }); });
  return { W:W, H:H, atoms:atoms, bonds:bonds };
}
function lpPos(a, d, r){ var u = Math.cos(d * D2R), v = Math.sin(d * D2R); r = r || AR + 8; return { x:a.x + u * r, y:a.y + v * r, ux:u, uy:v }; }
function opA(op){ return op != null && op < 0.99 ? ' opacity="' + r1(Math.max(0, op) * 100) / 100 + '"' : ""; }
function tx(x, y, s, o){ o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || "middle") + '" dominant-baseline="central" font-size="' + (o.fs || 13) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.c || "var(--ink)") + '"' + (o.halo ? ' stroke="var(--sheet)" stroke-width="4" paint-order="stroke" stroke-linejoin="round"' : "") + opA(o.op) + ">" + s + "</text>"; }
function ln(x1, y1, x2, y2, o){ o = o || {}; return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" stroke="' + (o.c || "var(--ink)") + '" stroke-width="' + (o.w || 2.4) + '" stroke-linecap="round"' + (o.d ? ' stroke-dasharray="' + o.d + '"' : "") + opA(o.op) + "/>"; }
function circ(x, y, r, fill, o){ o = o || {}; return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + fill + '"' + (o.s ? ' stroke="' + o.s + '" stroke-width="' + (o.sw || 1.5) + '"' : "") + opA(o.op) + "/>"; }
function dotPair(x, y, ux, uy, op, big){ var px = -uy * 4.4, py = ux * 4.4, r = big ? 3.4 : 2.8; return circ(x + px, y + py, r, "var(--e-pair)", { op:op }) + circ(x - px, y - py, r, "var(--e-pair)", { op:op }); }
function fcBadge(x, y, t, op){ var w = Math.max(17, t.length * 7.2 + 7); return '<rect x="' + r1(x - w / 2) + '" y="' + r1(y - 8.5) + '" width="' + r1(w) + '" height="17" rx="8.5" fill="var(--hi-soft)" stroke="var(--ink)" stroke-width="1.1"' + opA(op) + "/>" + tx(x, y + 0.5, t, { fs:11.5, w:700, op:op }); }
// o: {oct, fc, blend:info, op, bondOp, sel, selB, hl:{i, ph}, fcShow:{i:1}, fcTxt:{i:"…"}, fly:[{x, y}], br, flash:i, flashT}
function lewisSVG(sp, st, G, o){
  o = o || {};
  var h = "", A = G.atoms, op = o.op == null ? 1 : o.op, bl = o.blend || null, hl = o.hl || null;
  // highlight glows under everything
  if (hl && hl.ph >= 3) G.bonds.forEach(function(b){ if (b.i === hl.i || st.c === hl.i) h += ln(b.ax + b.ux * AR, b.ay + b.uy * AR, b.bx - b.ux * AR, b.by - b.uy * AR, { c:"var(--hi)", w:14 + 4 * b.o, op:0.55 }); });
  if (hl && hl.ph >= 2) A[hl.i].lp.forEach(function(d){ var p = lpPos(A[hl.i], d); h += circ(p.x, p.y, 9, "var(--hi)", { op:0.75 }); });
  // bonds
  G.bonds.forEach(function(b){
    var t = AR + 3, x1 = b.ax + b.ux * t, y1 = b.ay + b.uy * t, x2 = b.bx - b.ux * t, y2 = b.by - b.uy * t, px = -b.uy, py = b.ux, bo = (o.bondOp && o.bondOp[b.i] != null ? o.bondOp[b.i] : 1) * op;
    var lb = bl && bl.atoms[b.i];
    if (lb) {
      h += ln(x1 - px * 2.6, y1 - py * 2.6, x2 - px * 2.6, y2 - py * 2.6, { op:bo }) + ln(x1 + px * 2.6, y1 + py * 2.6, x2 + px * 2.6, y2 + py * 2.6, { d:"5 4", op:bo });
      var lx = b.mx + px * 15, ly = b.my + py * 15; if (Math.abs(b.uy) < 0.3) { lx = b.mx; ly = b.my - 14; }
      h += tx(lx, ly, frac(lb.o), { fs:12, w:700, halo:true, op:bo });
    } else {
      var offs = b.o === 1 ? [0] : b.o === 2 ? [-3.6, 3.6] : [-5.6, 0, 5.6];
      offs.forEach(function(k){ h += ln(x1 + px * k, y1 + py * k, x2 + px * k, y2 + py * k, { op:bo }); });
    }
    if (hl && hl.ph >= 3 && (b.i === hl.i || st.c === hl.i)) {
      var offs2 = b.o === 1 ? [0] : b.o === 2 ? [-3.6, 3.6] : [-5.6, 0, 5.6];
      offs2.forEach(function(k){ [-6, 6].forEach(function(s){ h += circ(b.mx + px * k * 1.9 + b.ux * s, b.my + py * k * 1.9 + b.uy * s, 3, "var(--e-pair)", { s:"var(--sheet)", sw:1 }); }); });
    }
  });
  // atoms
  A.forEach(function(a, i){
    var c = atomC(a.el), aop = (o.atomOp && o.atomOp[i] != null ? o.atomOp[i] : 1) * op;
    if (aop < 0.02) return;
    if ((o.sel === i) || (hl && hl.i === i && hl.ph >= 1)) h += circ(a.x, a.y, AR + 6, "none", { s:"var(--hi-ink)", sw:3 }) + circ(a.x, a.y, AR + 6, "var(--hi)", { op:0.45 });
    h += circ(a.x, a.y, AR, c.fill, { s:c.line !== "none" ? c.line : null, sw:1.6, op:aop }) + tx(a.x, a.y + 0.5, a.el, { fs:a.el.length > 1 ? 13 : 15, w:700, c:c.ink, op:aop });
    var lpop = aop * (o.lpOp && o.lpOp[i] != null ? o.lpOp[i] : 1);
    if (!(bl && bl.atoms[i])) a.lp.forEach(function(d){ var p = lpPos(a, d); h += dotPair(p.x, p.y, p.ux, p.uy, lpop, hl && hl.i === i && hl.ph >= 2); });
    if (a.rad != null) { var q = lpPos(a, a.rad); h += circ(q.x, q.y, 2.8, "var(--e-pair)", { op:aop }); }
  });
  // octet counters and formal-charge badges (ref: the state to read them from while pairs are in flight)
  var ref = o.ref || st, ext = [];
  A.forEach(function(a){ ext.push([a.x - AR - 4, a.y - AR - 4], [a.x + AR + 4, a.y + AR + 4]); a.lp.forEach(function(d){ var p = lpPos(a, d); ext.push([p.x - 8, p.y - 8], [p.x + 8, p.y + 8]); }); });
  if (o.oct && st.c >= 0) A.forEach(function(a, i){
    var e = eOn(ref, i), inf = octInfo(sp, ref, i), p = lpPos(a, a.octD, AR + 13), big = o.flash === i;
    var bad = inf.bad || inf.short;
    h += tx(p.x, p.y, String(e), { fs:big ? 15 : 12, w:bad || big ? 700 : 400, c:bad ? "var(--red)" : "var(--ink-2)", halo:true, op:op });
    ext.push([p.x - 8, p.y - 8], [p.x + 8, p.y + 8]);
  });
  A.forEach(function(a, i){
    var show = o.fc || (o.fcShow && o.fcShow[i]); if (!show || st.c < 0) return;
    var t = o.fcTxt && o.fcTxt[i] != null ? o.fcTxt[i] : bl && bl.atoms[i] ? frac(bl.atoms[i].fc, true) : sgn(fc(sp, ref, i)), p = lpPos(a, a.fcD, AR + 18);
    h += fcBadge(p.x, p.y, t, o.fcOp == null ? op : o.fcOp);
    ext.push([p.x - 14, p.y - 10], [p.x + 14, p.y + 10]);
  });
  (o.fly || []).forEach(function(f){ h += dotPair(f.x, f.y, f.ux == null ? 1 : f.ux, f.uy || 0, 1, true); });
  // ion brackets
  if (o.br && sp.q && st.c >= 0) {
    var x0 = 1e9, x1b = -1e9, y0 = 1e9, y1b = -1e9;
    ext.forEach(function(p){ x0 = Math.min(x0, p[0] - 5); x1b = Math.max(x1b, p[0] + 5); y0 = Math.min(y0, p[1] - 3); y1b = Math.max(y1b, p[1] + 3); });
    x0 = Math.max(4, x0); x1b = Math.min(G.W - 26, x1b); y0 = Math.max(4, y0); y1b = Math.min(G.H - 4, y1b);
    h += '<path d="M' + r1(x0 + 8) + " " + r1(y0) + " H" + r1(x0) + " V" + r1(y1b) + " H" + r1(x0 + 8) + " M" + r1(x1b - 8) + " " + r1(y0) + " H" + r1(x1b) + " V" + r1(y1b) + " H" + r1(x1b - 8) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.8"' + opA(op) + "/>";
    h += tx(x1b + 3, y0 + 6, qTxt(sp.q), { a:"start", fs:15, w:700, op:op });
  }
  return h;
}
function describe(sp, st, G, fcOn){
  if (st.c < 0) return fh(sp) ? MV.plain(fh(sp)) + ": atoms " + sp.at.join(", ") + " in a row; no central atom chosen yet." : "";
  var outs = outer(sp, st), BN = ["no bond", "single bond", "double bond", "triple bond"];
  return MV.plain(fh(sp)) + " Lewis diagram. Central " + sp.at[st.c] + " with " + st.lp[st.c] + " lone pair" + (st.lp[st.c] === 1 ? "" : "s") + ", " + eOn(st, st.c) + " electrons around it" + (fcOn ? ", formal charge " + sgn(fc(sp, st, st.c)) : "") + ". " +
    outs.map(function(i){ return sp.at[i] + ": " + BN[st.b[i]] + ", " + st.lp[i] + " lone pair" + (st.lp[i] === 1 ? "" : "s") + (fcOn ? ", formal charge " + sgn(fc(sp, st, i)) : ""); }).join("; ") + ".";
}
// a pair moving from an atom's lone pair (or a bond) to a bond (or a lone pair): before/after states, path endpoints
function pairPt(G, st, ref, near){
  if (ref.bond != null) { var b = G.bonds.filter(function(x){ return x.i === ref.bond; })[0]; if (b) return { x:b.mx, y:b.my, ux:-b.uy, uy:b.ux }; var a0 = G.atoms[ref.bond], c0 = G.atoms[st.c]; return { x:(a0.x + c0.x) / 2, y:(a0.y + c0.y) / 2, ux:1, uy:0 }; }
  var a = G.atoms[ref.lp], best = null, bd = 1e9;
  a.lp.forEach(function(d){ var p = lpPos(a, d), dd = near ? Math.hypot(p.x - near.x, p.y - near.y) : 0; if (dd < bd) { bd = dd; best = p; } });
  return best || { x:a.x, y:a.y - AR - 8, ux:1, uy:0 };
}
// legs for flying pairs; a lone-pair source is the pair nearest its destination bond. mid (= to) loses the pairs in flight.
function pairLegs(Ga, Gb, from, to, moves, mid){
  return moves.map(function(m){
    if (m.to.bond != null) mid.b[m.to.bond]--; else mid.lp[m.to.lp]--;
    var A, B;
    if (m.from.lp != null) { B = pairPt(Gb, to, m.to, null); A = pairPt(Ga, from, m.from, B); }
    else { A = pairPt(Ga, from, m.from, null); B = pairPt(Gb, to, m.to, A); }
    return { A:A, B:B };
  });
}
function flyAt(legs, t){ return legs.map(function(l){ var bow = Math.sin(Math.PI * t) * 14; return { x:lerp(l.A.x, l.B.x, t) - (l.B.y - l.A.y) / 60 * bow, y:lerp(l.A.y, l.B.y, t) + (l.B.x - l.A.x) / 60 * bow, ux:lerp(l.A.ux, l.B.ux, t), uy:lerp(l.A.uy, l.B.uy, t) }; }); }

// ---------- @component C1 lewisBuilder — the Explore centrepiece (also used, with no modes, in Practice). Species chips, mode
// (Build / Guided / Resonance), tools (Make central, Bond, Lone pair, Remove, Undo, Clear), "Show formal charges", an electron
// budget bar, the diagram with tappable atom and bond buttons (keyboard: Tab, B, L, Delete), a status line and readouts.
// builder(host, {S, save, species, modes, tools, steps, resHow, msgs, banner, onChange}) -> API used by predictions/challenges.
function builder(host, o){
  var S = o.S, msgs = o.msgs || {};
  if (!S.builds || typeof S.builds !== "object") S.builds = {};
  if (o.species.indexOf(S.sp) < 0) S.sp = o.species[0];
  if (!o.modes || ["build", "guided", "res"].indexOf(S.mode) < 0) S.mode = "build";
  if (["central", "bond", "lp", "remove"].indexOf(S.tool) < 0) S.tool = "central";
  S.fc = !!S.fc; S.blend = !!S.blend;
  var undo = {}, sel = null, selB = null, msg = "", busy = false, anim = null, playT = null, cntFb = "", flash = -1, fly = null, flyRef = null;
  var TOOLS = o.tools || [{ id:"central", t:"Make central" }, { id:"bond", t:"Bond" }, { id:"lp", t:"Lone pair" }, { id:"remove", t:"Remove" }];
  host.innerHTML = '<div class="lw-sp"></div>' + (o.modes ? '<div class="lw-mode"></div>' : "") +
    '<div class="lw-grid"><div class="lw-left"' + (o.banner ? ' data-mv="graph"' : "") + ">" + (o.banner ? '<p class="banner" data-mv="banner" aria-live="polite"></p>' : "") +
    '<div class="lw-bud"></div><div class="lw-stage"><svg class="lw-svg" viewBox="0 0 440 300" role="img" aria-label=""></svg><div class="lw-hits"></div></div>' +
    '<p class="lw-status" aria-live="polite"></p>' +
    '<div class="lw-tools"><div class="lw-tb"><div class="lw-tr"></div><span class="lw-btns"><button type="button" class="btn ghost sm" data-b="undo" data-k="lwundo">Undo</button><button type="button" class="btn ghost sm" data-b="clear" data-k="lwclear">Clear</button></span></div>' +
    '<div class="lw-rb"><p class="how lw-rhow">' + (o.resHow || "") + '</p><span class="lw-btns"><button type="button" class="btn primary sm" data-b="cycle" data-k="lwcycle">Show each structure</button><button type="button" class="btn ghost sm lw-tog" data-b="blend" data-k="lwblend" aria-pressed="false">Blend</button></span></div>' +
    '<div class="lw-tg"><button type="button" class="btn ghost sm lw-tog" data-b="fc" data-k="lwfc" aria-pressed="false">Show formal charges</button></div></div></div>' +
    '<div class="lw-right"><div class="lw-guide"></div><dl class="read lw-read" aria-live="polite"></dl></div></div>';
  var svg = $(".lw-svg", host), hits = $(".lw-hits", host), bud = $(".lw-bud", host), status = $(".lw-status", host), guide = $(".lw-guide", host), read = $(".lw-read", host), tools = $(".lw-tools", host);
  var RG = {};
  RG.sp = radios($(".lw-sp", host), { label:"Species", aria:"Species to build", cls:"chips lw-spc", options:o.species.map(function(id){ return { id:id, t:fh(SP[id]) }; }), value:S.sp,
    onChange:function(v){ stopPlay(); S.sp = v; sel = selB = null; msg = ""; cntFb = ""; save(); paint(); } });
  if (o.modes) RG.mode = radios($(".lw-mode", host), { label:"Mode", aria:"Builder mode", options:o.modes, value:S.mode, onChange:function(v){ stopPlay(); S.mode = v; sel = selB = null; msg = ""; save(); paint(); } });
  RG.tool = radios($(".lw-tr", host), { label:"Tool", aria:"Tool", options:TOOLS, value:S.tool, onChange:function(v){ S.tool = v; sel = selB = null; msg = ""; save(); paint(); } });
  function sp(){ return SP[S.sp]; }
  // the stored state object stays the same object while it is valid, so actions can edit it in place
  function st(){ var cur = S.builds[S.sp], f = fix(sp(), cur); if (!cur || JSON.stringify(f) !== JSON.stringify(cur)) S.builds[S.sp] = f; return S.builds[S.sp]; }
  function save(){ o.save(); }
  function hide(){ return S.mode === "guided" && !st().k; }
  function push(){ var u = undo[S.sp] = undo[S.sp] || []; u.push(cp(st())); if (u.length > 60) u.shift(); }
  function changed(m){ msg = m || ""; save(); paint(); if (o.onChange) o.onChange(); }
  // ----- actions -----
  function nm(i){ return sp().at[i]; }
  function atomAct(i, tool){
    if (busy) return;
    var s = st(), el = nm(i);
    if (S.mode === "res") { resAtom(i); return; }
    tool = tool || S.tool;
    if (tool === "central") {
      if (s.c === i) { msg = el + " is already the central atom."; paint(); return; }
      push(); var had = sum(s.b) > 0; s.c = i; s.b = s.b.map(function(){ return 0; });
      if (el === "H") s.lp[i] = 0;
      changed(el + " is now the central atom." + (had ? " Bonds cleared." : "")); return;
    }
    if (s.c < 0) { msg = "Choose the central atom first: pick Make central, then tap an atom."; paint(); return; }
    if (tool === "bond") {
      if (sel == null) { sel = i; msg = el + " chosen. Now tap a second atom."; paint(); return; }
      if (sel === i) { sel = null; msg = ""; paint(); return; }
      var a = sel, b = i; sel = null;
      if (a !== s.c && b !== s.c) { msg = "In this builder every bond joins the central atom to an outer atom."; paint(); return; }
      raise(a === s.c ? b : a); return;
    }
    if (tool === "lp") {
      if (el === "H") { msg = "H holds only 2 electrons: no lone pairs on H."; paint(); return; }
      if (s.lp[i] >= 4) { msg = "That’s as many lone pairs as one atom can hold here."; paint(); return; }
      push(); s.lp[i]++; changed("Lone pair added to " + el + "."); return;
    }
    if (tool === "remove") {
      if (s.lp[i] > 0) { push(); s.lp[i]--; changed("Lone pair removed from " + el + "."); return; }
      if (i !== s.c && s.b[i] > 0) { lower(i); return; }
      msg = i === s.c && sum(s.b) ? "Tap a bond to remove it." : "Nothing to remove on " + el + "."; paint();
    }
  }
  function raise(j){
    var s = st(), el = nm(j);
    if (el === "H" && s.b[j] >= 1) { msg = "H forms only one bond."; paint(); return; }
    if (nm(s.c) === "H" && sum(s.b) >= 1 && !s.b[j]) { msg = "H forms only one bond, so it can’t be the central atom of this species."; paint(); return; }
    if (s.b[j] >= 3) { msg = "A triple bond is the most two atoms can share."; paint(); return; }
    push(); s.b[j]++; changed(["", "Single", "Double", "Triple"][s.b[j]] + " bond: " + nm(s.c) + ["", "–", "=", "≡"][s.b[j]] + el + ".");
  }
  function lower(j){ var s = st(); push(); s.b[j]--; changed(s.b[j] ? "Bond lowered to " + ["", "single", "double"][s.b[j]] + "." : "Bond removed."); }
  function bondAct(j){
    if (busy) return;
    if (S.mode === "res") { var s0 = st(); if (s0.b[j] >= 2) { selB = j; sel = null; msg = "Now tap another bonded atom to move the " + (s0.b[j] === 2 ? "double" : "multiple") + " bond there."; } else msg = "Tap a double bond first."; paint(); return; }
    if (S.tool === "bond") raise(j); else if (S.tool === "remove") lower(j);
    else { msg = "Choose Bond to raise this bond, or Remove to lower it."; paint(); }
  }
  function resAtom(i){
    var s = st(), r = evalB(sp(), s);
    if (!r.ok) { msg = "Finish a complete structure first (Build mode), then move its double bond here."; paint(); return; }
    if (selB == null) { if (i !== s.c && s.b[i] >= 2) { selB = i; msg = "Now tap another bonded atom to move this double bond there."; } else msg = "Tap a double bond first."; paint(); return; }
    if (i === s.c) { msg = "Tap another outer atom bonded to the centre."; paint(); return; }
    if (i === selB) { selB = null; msg = ""; paint(); return; }
    if (s.lp[i] < 1 || s.b[i] >= 3) { msg = nm(i) + " has no lone pair to share."; paint(); return; }
    var from = selB; selB = null;
    var t = cp(s); t.b[from]--; t.lp[from]++; t.b[i]++; t.lp[i]--;
    push(); animMove(s, t, [{ from:{ bond:from }, to:{ lp:from } }, { from:{ lp:i }, to:{ bond:i } }], 650, function(){ changed("Double bond moved: " + (resCount(sp(), st()) > 1 ? "an equivalent structure." : "a different structure.")); });
  }
  // ----- animation -----
  function lock(b){ busy = b; Object.keys(RG).forEach(function(k){ RG[k].lock(b); }); paintTools(); paintHits(); paintGuide(); }
  function animMove(from, to, moves, dur, done){
    var Ga = geo(sp(), from), Gb = geo(sp(), to), mid = cp(to), legs = pairLegs(Ga, Gb, from, to, moves, mid);
    busy = true; lock(true);
    S.builds[S.sp] = mid; flyRef = fix(sp(), to); fly = legs.map(function(l){ return { x:l.A.x, y:l.A.y, ux:l.A.ux, uy:l.A.uy }; }); draw();
    anim = MV.tween({ dur:dur, step:function(t){ fly = flyAt(legs, t); draw(); },
      done:function(){ anim = null; fly = null; flyRef = null; S.builds[S.sp] = cp(to); busy = false; lock(false); save(); paint(); if (done) done(); } });
  }
  // ----- painting -----
  function draw(){
    var s = st(), G = geo(sp(), s), bl = S.mode === "res" && S.blend && evalB(sp(), s).ok && resCount(sp(), s) > 1 ? blendOf(sp(), s) : null;
    svg.innerHTML = lewisSVG(sp(), s, G, { oct:true, fc:S.fc, blend:bl, sel:S.mode === "res" ? (selB != null ? selB : null) : sel, br:true, fly:fly, ref:flyRef, flash:flash });
    svg.setAttribute("aria-label", describe(sp(), s, G, S.fc) + (bl ? " Blend view: " + bl.groups.map(function(g){ return "each " + sp().at[s.c] + "–" + g.el + " bond has bond order " + MV.plain(frac(g.o)); }).join("; ") + "." : ""));
    return G;
  }
  function paintHits(){
    var s = st(), G = geo(sp(), s), dis = busy ? " disabled" : "";
    MV.keepFocus(hits, function(){
      hits.innerHTML = G.atoms.map(function(a, i){
        var inf = octInfo(sp(), s, i), lab = a.el + (i === s.c ? ", central atom" : "") + (s.c >= 0 ? ", " + inf.e + " electrons" + (s.lp[i] ? ", " + s.lp[i] + " lone pair" + (s.lp[i] > 1 ? "s" : "") : "") + (S.fc ? ", formal charge " + sgn(fc(sp(), s, i)) : "") : "");
        return '<button type="button" class="lw-hit' + (sel === i || selB === i ? " on" : "") + '" data-at="' + i + '" data-k="lwa' + i + '" style="left:' + r1(a.x / G.W * 100) + "%;top:" + r1(a.y / G.H * 100) + '%" aria-label="' + esc(lab) + '"' + dis + "></button>";
      }).join("") + G.bonds.map(function(b){
        return '<button type="button" class="lw-hit lw-bhit' + (selB === b.i ? " on" : "") + '" data-bd="' + b.i + '" data-k="lwb' + b.i + '" style="left:' + r1(b.mx / G.W * 100) + "%;top:" + r1(b.my / G.H * 100) + '%" aria-label="' + esc(sp().at[s.c] + ["", "–", "=", "≡"][b.o] + sp().at[b.i] + " bond, " + ["", "single", "double", "triple"][b.o]) + '"' + dis + "></button>";
      }).join("");
    });
  }
  function budHTML(r){
    var s = st(), T = r.T, P = r.P, hid = hide(), cells = Math.max(T, P) / 2, h = "";
    for (var i = 0; i < cells; i++) h += '<span class="lw-cell' + (i < P / 2 ? " on" : "") + (i >= T / 2 ? " over" : "") + '"></span>';
    if (hid) { h = ""; for (var j = 0; j < Math.max(4, P / 2); j++) h += '<span class="lw-cell' + (j < P / 2 ? " on" : "") + ' unk"></span>'; }
    return '<p class="lw-bl"><strong>Electron budget:</strong> ' + (hid ? P + " used / ?" : P + " used / " + T + (P > T ? ' <span class="lw-bad">(' + (P - T) + " too many)</span>" : P < T ? " (" + (T - P) + " left)" : " (all placed)")) + '</p><div class="lw-cells" aria-hidden="true">' + h + "</div>";
  }
  function veText(){
    var p = sp(), cnt = {}, order = [];
    p.at.forEach(function(el){ if (!cnt[el]) { cnt[el] = 0; order.push(el); } cnt[el]++; });
    return total(p) + " = " + order.map(function(el){ return (cnt[el] > 1 ? cnt[el] + " × " : "") + el + " " + VAL[el]; }).join(" + ") + (p.q ? (p.q < 0 ? " + " : " " + MI + " ") + Math.abs(p.q) + " (for the " + Math.abs(p.q) + (p.q < 0 ? MI : "+") + " charge)" : "");
  }
  function lab(i){ var s = st(), el = nm(i); if (i === s.c || el === "H") return el; return el + "(" + ["", "–", "=", "≡"][s.b[i]] + ")"; }
  function paintRead(r){
    var s = st(), p = sp(), rows = [], hid = hide();
    rows.push(["Valence electrons", hid ? '<span class="muted">? Count them: step 1 of the checklist.</span>' : veText()]);
    rows.push(["Electrons placed", hid ? r.P + " of ?" : r.P + " of " + r.T + (r.P > r.T ? ": too many" : "")]);
    var ord = s.c >= 0 ? [s.c].concat(outer(p, s)) : p.at.map(function(_, i){ return i; });
    rows.push(["Octets", s.c < 0 ? '<span class="muted">choose a central atom first</span>' : ord.map(function(i){ var t = r.oc[i].txt; return r.oc[i].bad || r.oc[i].short ? "<strong>" + t + "</strong>" : t; }).join(" · ")]);
    if (s.c < 0) rows.push(["Formal charges", '<span class="muted">—</span>']);
    else if (!S.fc) rows.push(["Formal charges", '<span class="muted">Turn on Show formal charges.</span>']);
    else { var tot = sum(p.at.map(function(_, i){ return fc(p, s, i); })); rows.push(["Formal charges", ord.map(function(i){ return lab(i) + " " + sgn(fc(p, s, i)); }).join(" · ") + " · sum " + sgn(tot) + (tot === p.q ? " = charge" : " ≠ charge " + sgn(p.q))]); }
    rows.push(["Status", r.ok ? "<strong>" + r.msg + "</strong>" : r.msg]);
    if (S.mode === "res") {
      var n = r.ok ? resCount(p, s) : 0, bl = r.ok && n > 1 ? blendOf(p, s) : null;
      rows.push(["Resonance", !r.ok ? '<span class="muted">finish a complete structure first</span>' : n > 1 ? n + " equivalent structures" + (bl ? ": each " + nm(s.c) + "–" + bl.groups[0].el + " bond has bond order " + frac(bl.groups[0].o) : "") : "1 structure (no equivalent placements)"]);
    }
    read.innerHTML = MV.readoutHTML(rows);
  }
  function stepMsg(k){ var p = sp(), s = st(); if (k === 1 && s.c >= 0 && nm(s.c) !== p.at[p.c]) return nm(s.c) === "H" ? (msgs.m3 || "") : "Not " + nm(s.c) + ": the central atom is usually the least electronegative atom."; return ""; }
  function paintGuide(){
    if (S.mode !== "guided") { guide.innerHTML = ""; guide.hidden = true; return; }
    guide.hidden = false;
    var p = sp(), s = st(), d = stepsDone(p, s), next = d.indexOf(false), dis = busy ? " disabled" : "";
    MV.keepFocus(guide, function(){
      guide.innerHTML = '<h4 class="lw-h4">Guided checklist</h4><ol class="lw-steps">' + (o.steps || []).map(function(t, k){
        var cls = d[k] ? "done" : k === next ? "next" : "", extra = "";
        if (k === 0 && !d[0]) extra = '<span class="lw-cnt"><label for="lw-cnt-in">Total valence electrons</label><input id="lw-cnt-in" class="numin" type="text" inputmode="numeric" autocomplete="off" data-k="lwcin"' + dis + '><button type="button" class="btn primary sm" data-g="count" data-k="lwcchk"' + dis + ">Check count</button></span>" + (cntFb ? '<span class="lw-cfb">' + cntFb + "</span>" : "");
        else if (k === 0) extra = '<span class="lw-cfb">' + veText() + "</span>";
        var sm = stepMsg(k); if (sm && !d[k]) extra += '<span class="lw-cfb">' + sm + "</span>";
        return '<li class="' + cls + '"><span class="mk" aria-hidden="true">' + (d[k] ? "✓" : k === next ? "▶" : "○") + "</span><span>" + t + (d[k] ? '<span class="vh"> (done)</span>' : k === next ? '<span class="vh"> (next step)</span>' : "") + extra + "</span></li>";
      }).join("") + "</ol>" +
      '<div class="player"><button type="button" class="btn ghost sm" data-g="back" data-k="lwgback"' + (busy || !(undo[S.sp] || []).length ? " disabled" : "") + '>Back</button><button type="button" class="btn primary sm" data-g="step" data-k="lwgstep"' + (busy || next < 0 ? " disabled" : "") + '>Step</button>' +
      '<button type="button" class="btn ghost sm" data-g="play" data-k="lwgplay"' + ((busy && !playT) || next < 0 ? " disabled" : "") + ">" + (playT ? "Pause" : "Play") + '</button><span class="ctr" aria-live="polite">' + (next < 0 ? "All 6 steps done" : "Next: step " + (next + 1) + " of 6") + "</span></div>" +
      '<p class="tiny muted">Step does the next step for you; Back undoes it.</p>';
    });
  }
  function paintTools(){
    var res = S.mode === "res", s = st(), r = evalB(sp(), s), n = r.ok ? resCount(sp(), s) : 0;
    $(".lw-tb", tools).hidden = res; $(".lw-rb", tools).hidden = !res;
    $$("[data-b]", tools).forEach(function(b){ var k = b.dataset.b; b.disabled = busy || (k === "undo" && !(undo[S.sp] || []).length) || ((k === "cycle" || k === "blend") && n < 2); });
    $('[data-b="fc"]', tools).setAttribute("aria-pressed", S.fc); $('[data-b="blend"]', tools).setAttribute("aria-pressed", S.blend && n > 1);
  }
  function paint(){
    var s = st(), r = evalB(sp(), s, hide());
    host.classList.toggle("lw-resm", S.mode === "res");
    RG.sp.set(S.sp); if (RG.mode) RG.mode.set(S.mode); RG.tool.set(S.tool);
    draw(); paintHits();
    bud.innerHTML = budHTML(r);
    status.innerHTML = "<strong>Status:</strong> " + r.msg + (msg ? ' <span class="lw-msg">' + msg + "</span>" : "");
    paintRead(r); paintGuide(); paintTools();
  }
  // ----- guided -----
  function countFb(v){
    var p = sp(), T = total(p), raw = T + p.q, Z = sum(p.at.map(function(el){ return ZN[el]; }));
    if (v === T) return "";
    if (p.q && v === raw) return "Adjust for the charge. " + (msgs.m1 || "");
    if (p.q && v === raw + p.q) return "That adjusts the wrong way. " + (msgs.m1 || "");
    if (v === Z || v === Z - p.q) return msgs.m2 || "";
    return "Add each atom’s valence electrons, then adjust for any charge.";
  }
  function gStep(){
    var p = sp(), s = st(), d = stepsDone(p, s), k = d.indexOf(false); if (k < 0) return false;
    var F = solve(p); push(); S.builds[S.sp] = cp(F[k + 1]); cntFb = ""; changed("Step " + (k + 1) + " done."); return true;
  }
  function stopPlay(){ if (playT) { clearInterval(playT); playT = null; busy = false; lock(false); } }
  guide.addEventListener("click", function(e){
    var b = e.target.closest("[data-g]"); if (!b || b.disabled) return;
    var a = b.dataset.g;
    if (a === "count") { var v = MV.parseNum(($("#lw-cnt-in") || {}).value || ""); if (!v || v.length !== 1) { cntFb = "Enter one whole number."; paintGuide(); return; } var fb = countFb(v[0]); if (!fb) { push(); st().k = true; cntFb = ""; changed("✓ " + total(sp()) + " valence electrons: your budget."); } else { cntFb = "✗ " + v[0] + ": " + fb; paintGuide(); } return; }
    if (a === "back") { stopPlay(); doUndo(); return; }
    if (a === "step") { stopPlay(); gStep(); return; }
    if (a === "play") {
      if (playT) { stopPlay(); paintGuide(); return; }
      busy = true; lock(true); gStep(); busy = true; lock(true);
      playT = setInterval(function(){ busy = false; var more = gStep(); busy = true; lock(true); if (!more || stepsDone(sp(), st()).indexOf(false) < 0) { stopPlay(); paint(); } }, MV.reduceMotion ? 120 : 1000);
      paintGuide();
    }
  });
  guide.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.id === "lw-cnt-in") { var b = $('[data-g="count"]', guide); if (b) b.click(); } });
  function doUndo(){ var u = undo[S.sp] || []; if (!u.length) return; S.builds[S.sp] = u.pop(); sel = selB = null; changed("Undone."); }
  // ----- events -----
  hits.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.at != null) atomAct(+b.dataset.at); else if (b.dataset.bd != null) bondAct(+b.dataset.bd);
  });
  hits.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-at]"); if (!b || b.disabled || busy) return;
    var i = +b.dataset.at, k = e.key.toLowerCase();
    if (k === "b" && S.mode !== "res") { e.preventDefault(); S.tool = "bond"; sel = i; selB = null; msg = nm(i) + " chosen. Now choose a second atom (Tab to it, then Enter)."; save(); paint(); }
    else if (k === "l" && S.mode !== "res") { e.preventDefault(); atomAct(i, "lp"); }
    else if ((e.key === "Delete" || e.key === "Backspace") && S.mode !== "res") { e.preventDefault(); atomAct(i, "remove"); }
  });
  tools.addEventListener("click", function(e){
    var b = e.target.closest("[data-b]"); if (!b || b.disabled) return;
    var a = b.dataset.b;
    if (a === "undo") doUndo();
    else if (a === "clear") { push(); var k0 = st().k; S.builds[S.sp] = blank(sp()); S.builds[S.sp].k = k0; sel = selB = null; changed("Cleared."); }
    else if (a === "fc") { S.fc = !S.fc; save(); paint(); if (o.onChange) o.onChange(); }
    else if (a === "blend") { S.blend = !S.blend; save(); paint(); }
    else if (a === "cycle") cycle(null);
  });
  // step through the equivalent structures (each hop animates one moving pair)
  function hop(to, dur, done){
    var s = st(), p = sp(), diff = outer(p, s).filter(function(i){ return s.b[i] !== to.b[i]; });
    var up = diff.filter(function(i){ return to.b[i] > s.b[i]; }), dn = diff.filter(function(i){ return to.b[i] < s.b[i]; });
    if (up.length === 1 && dn.length === 1 && to.b[up[0]] - s.b[up[0]] === 1) animMove(s, to, [{ from:{ bond:dn[0] }, to:{ lp:dn[0] } }, { from:{ lp:up[0] }, to:{ bond:up[0] } }], dur, done);
    else { S.builds[S.sp] = cp(to); save(); paint(); MV.wait(dur, done); }
  }
  function cycle(done){
    var L = resList(sp(), st()); if (L.length < 2) { if (done) done(); return; }
    var was = S.blend; S.blend = false; lock(true); var k = 1;
    (function next(){
      var tgt = k < L.length ? L[k] : L[0];
      hop(tgt, 650, function(){
        k++; lock(true);
        if (k <= L.length) { MV.wait(450, next); return; }
        S.blend = was; lock(false); save(); paint(); msg = "Each structure shown in turn. The real species is one blend of all " + L.length + "."; paint(); if (done) done();
      });
    })();
  }
  paint();
  return {
    stateOf:function(id){ return fix(SP[id], S.builds[id]); },
    load:function(id, state, opt){ opt = opt || {}; stopPlay(); if (anim) { anim(); anim = null; } fly = null; flyRef = null; S.sp = id; S.builds[id] = fix(SP[id], state); if (opt.mode && o.modes) S.mode = opt.mode; if (opt.fc != null) S.fc = opt.fc; if (opt.blend != null) S.blend = opt.blend; if (opt.tool) S.tool = opt.tool; sel = selB = null; msg = opt.msg || ""; cntFb = ""; flash = -1; save(); paint(); },
    set:function(state, m){ S.builds[S.sp] = fix(sp(), state); msg = m || msg; save(); paint(); },
    get:function(){ return cp(st()); },
    sp:function(){ return S.sp; },
    lock:lock, paint:paint, move:animMove, cycle:cycle,
    msg:function(m){ msg = m; paint(); },
    flash:function(i){ flash = i; draw(); },
    opts:function(k, v){ S[k] = v; save(); paint(); },
    eval:function(){ return evalB(sp(), st()); },
    busy:function(){ return busy; }
  };
}

// ---------- hero: carbonate from its electron budget to its resonance blend ----------
function hero(f){
  var svg = $("#lw-hx-svg"), cap = $("#lw-hx-cap"), rep = $("#lw-hx-replay"); if (!svg) return;
  var sp = SP.co3, F = solve(sp), fin = F[6], run = 0, tw = null;
  var s = { bar:0, st:blank(sp), aop:0, flash:false, fc:0, fly:null, blend:0, txt:"" };
  function draw(){
    var h = "", T = 24, bw = 360, x0 = 40, used = placed(s.st), shown = s.st.c < 0 ? s.bar : Math.max(0, T - used);
    h += tx(x0, 16, "Electron budget", { a:"start", fs:13, w:700 }) + tx(x0 + bw, 16, s.st.c < 0 ? Math.round(s.bar) + " valence electrons" : shown ? shown + " of 24 left to place" : "all 24 placed", { a:"end", fs:13, c:"var(--ink-2)" });
    for (var i = 0; i < 12; i++) { var on = s.st.c < 0 ? i < Math.round(s.bar / 2) : i < shown / 2; h += '<rect x="' + r1(x0 + i * bw / 12 + 1) + '" y="28" width="' + r1(bw / 12 - 3) + '" height="12" rx="3" fill="' + (on ? "var(--e-pair)" : "none") + '" stroke="var(--rule)" stroke-width="1.2"/>'; }
    var G = geo(sp, fin, { W:440, H:180 }), bl = s.blend > 0 ? blendOf(sp, fin) : null;
    h += '<g transform="translate(0,40)">';
    if (s.st.c >= 0 || s.aop > 0) {
      var st0 = s.st.c < 0 ? (function(){ var t = blank(sp); t.c = 0; return t; })() : s.st, G0 = geo(sp, st0, { W:440, H:180 });
      h += lewisSVG(sp, st0, G0, { op:s.blend > 0 ? 1 - s.blend : s.aop, fc:s.fc > 0, fcOp:s.fc * (1 - s.blend), br:s.aop > 0.5, fly:s.fly, ref:s.ref });
      if (s.flash) { var c = G0.atoms[0]; h += tx(c.x + 34, c.y + 30, s.flash, { a:"start", fs:15, w:700, c:"var(--red)", halo:true }); }
      if (bl) h += lewisSVG(sp, fin, G, { op:s.blend, fc:true, blend:bl, br:true });
    }
    h += "</g>";
    svg.innerHTML = h;
  }
  function final(){ s = { bar:24, st:cp(fin), aop:1, flash:"", fc:1, fly:null, blend:1 }; draw(); cap.textContent = "One blend: three identical C–O bonds, each bond order 1⅓, and −⅔ on each O."; rep.hidden = false; }
  function seq(list, id){
    var k = 0;
    (function next(){
      if (id !== run) return;
      if (k >= list.length) { rep.hidden = false; return; }
      var it = list[k++]; if (it.cap != null) cap.textContent = it.cap;
      if (it.at) it.at();
      tw = MV.tween({ dur:it.dur || 600, ease:it.lin ? function(t){ return t; } : null, step:function(t){ if (id !== run) return; if (it.step) it.step(t); draw(); }, done:function(){ tw = null; if (id !== run) return; if (it.end) it.end(); draw(); MV.wait(it.pause == null ? 250 : it.pause, next); } });
    })();
  }
  function moveLeg(from, to, moves){
    var Ga = geo(sp, from, { W:440, H:180 }), Gb = geo(sp, to, { W:440, H:180 }), mid = cp(to), legs = pairLegs(Ga, Gb, from, to, moves, mid);
    return { mid:mid, step:function(t){ s.st = mid; s.ref = to; s.fly = flyAt(legs, t); }, end:function(){ s.fly = null; s.ref = null; s.st = cp(to); } };
  }
  function play(){
    var id = ++run; if (tw) { tw(); tw = null; } rep.hidden = true;
    s = { bar:0, st:blank(sp), aop:0, flash:"", fc:0, fly:null, blend:0 };
    var list = [];
    list.push({ cap:"Count: C 4 + 3 × O 6 + 2 for the 2− charge = 24 valence electrons.", dur:1100, lin:true, step:function(t){ s.bar = 24 * t; } });
    list.push({ cap:"Skeleton: C in the centre, three O atoms around it.", dur:600, step:function(t){ s.aop = t; } });
    var st3 = cp(F[2]);
    [1, 2, 3].forEach(function(i){ list.push({ cap:"Single bonds join the atoms.", dur:260, pause:60, at:function(){ if (s.st.c < 0) s.st = cp(F[2]); }, end:function(){ st3.b[i] = 1; s.st = cp(st3); } }); });
    [1, 2, 3].forEach(function(i){ [0, 1, 2].forEach(function(){ list.push({ cap:"Lone pairs complete each O’s octet until the budget is empty.", dur:150, pause:40, end:function(){ st3.lp[i]++; s.st = cp(st3); } }); }); });
    list.push({ cap:"Carbon has only 6 electrons.", dur:900, at:function(){ s.flash = "6 electrons"; }, pause:400 });
    var after = cp(F[5]); after.b[1] = 2; after.lp[1] = 2;
    var mv = moveLeg(F[5], after, [{ from:{ lp:1 }, to:{ bond:1 } }]);
    list.push({ cap:"A lone pair from the top O swings in: C=O, and carbon has 8.", dur:900, at:function(){ s.flash = ""; }, step:mv.step, end:function(){ mv.end(); s.flash = "8"; }, pause:500 });
    list.push({ cap:"Formal charges: C 0, the double-bonded O 0, and −1 on each single-bonded O.", dur:500, at:function(){ s.flash = ""; }, step:function(t){ s.fc = t; }, pause:900 });
    var L = resList(sp, after);
    [1, 2].forEach(function(k){
      var a = L[k - 1], b = L[k], up = outer(sp, a).filter(function(i){ return b.b[i] > a.b[i]; })[0], dn = outer(sp, a).filter(function(i){ return b.b[i] < a.b[i]; })[0], m = null;
      list.push({ cap:"The double bond can sit on any of the three O atoms.", dur:700, at:function(){ m = moveLeg(a, b, [{ from:{ bond:dn }, to:{ lp:dn } }, { from:{ lp:up }, to:{ bond:up } }]); }, step:function(t){ m.step(t); }, end:function(){ m.end(); }, pause:500 });
    });
    list.push({ cap:"The three structures merge into one blend: three identical C–O bonds.", dur:1100, step:function(t){ s.blend = t; }, end:final, pause:0 });
    seq(list, id);
  }
  rep.addEventListener("click", function(){ if (MV.reduceMotion) final(); else play(); });
  if (MV.reduceMotion) final(); else play();
}

// ---------- Explore: Lewis builder ----------
function explore(host, api){
  var C = api.content, S = api.S;
  host.innerHTML = '<p class="how lw-how">' + C.how + '</p><div class="lw-ex"></div>';
  var B = builder($(".lw-ex", host), { S:S, save:api.save, species:C.species, modes:C.modes, tools:C.tools, steps:C.steps, resHow:C.resHow, msgs:C.msgs, banner:true, onChange:function(){ MV.changed(); } });
  var hooks = {
    start:function(p){
      if (p.id === "p1") B.load("co2", { c:0, b:[0, 1, 1], lp:[0, 3, 3], k:true }, { mode:"build", fc:false, msg:"All 16 electrons placed." });
      else if (p.id === "p2") B.load("nh4", { c:-1, k:false }, { mode:"guided", fc:false, msg:"The counting step." });
      else if (p.id === "p3") B.load("no3", finalOf(SP.no3), { mode:"res", fc:true, blend:false, msg:"One structure showing." });
      else B.load("sf6", { c:0, k:true }, { mode:"build", fc:false, msg:"Sulfur in the centre; six F atoms to join." });
      B.lock(true);
    },
    run:function(p, done){
      function end(m){ B.lock(false); B.msg(m || ""); MV.changed(); done(); }
      if (p.id === "p1") {
        var a = B.get(), t = cp(a); t.b = [0, 2, 2]; t.lp = [0, 2, 2];
        B.move(a, t, [{ from:{ lp:1 }, to:{ bond:1 } }, { from:{ lp:2 }, to:{ bond:2 } }], 1000, function(){ end("O=C=O: every octet shows 8, and all 16 electrons are still used."); });
        return;
      }
      if (p.id === "p2") {
        var s = B.get(); s.k = true; B.set(s, "Budget: 5 + 4 − 1 = 8."); B.lock(true);
        var k = 0;
        MV.wait(900, function(){
          s.c = 0; B.set(s); B.lock(true);
          (function nb(){
            if (k >= 4) { B.opts("fc", true); B.lock(true); MV.wait(500, function(){ end("Four N–H bonds use all 8 electrons, and N carries a +1 formal charge."); }); return; }
            k++; s.b[k] = 1; B.set(s, "N–H bond " + k + " of 4."); B.lock(true); MV.wait(420, nb);
          })();
        });
        return;
      }
      if (p.id === "p3") {
        B.lock(false); B.cycle(function(){ B.opts("blend", true); B.lock(true); MV.wait(700, function(){ end("Blend: three identical N–O bonds, bond order 1⅓ each."); }); });
        return;
      }
      var s4 = B.get(), j = 0;
      (function nb4(){
        if (j >= 6) { B.flash(0); MV.wait(900, function(){ B.flash(-1); end("S 12: an expanded octet. Sulfur is in period 3."); }); return; }
        j++; s4.b[j] = 1; s4.lp[j] = 3; B.set(s4, "S–F bond " + j + " of 6."); B.lock(true); MV.wait(300, nb4);
      })();
    }
  };
  function notYet(r){ return r.ok ? "That’s a complete structure, but not the one this challenge asks for. Turn on Show formal charges and compare." : "Not finished: " + r.msg + "."; }
  function chal(id){
    var c = C.challenges.filter(function(x){ return x.id === id; })[0], sp = SP[c.sp], st = B.stateOf(c.sp), m = C.msgs, r = evalB(sp, st);
    if (st.c < 0) return { ok:false, msg:"Choose " + fh(sp) + " in the species picker, pick Make central and tap the central atom, then build." };
    var ce = sp.at[st.c];
    if (id === "tc1") {
      if (ce === "O") return { ok:false, msg:m.tc1.ocentre };
      if (ce === "H") return { ok:false, msg:m.m3 };
      if (st.b[2] === 1 && st.b[3] === 1 && st.lp[0] === 0 && st.b[1] === 1 && st.lp[1] === 3) return { ok:false, msg:m.tc1.single };
      if (st.b[2] === 1 && st.b[3] === 1 && st.lp[0] === 0 && st.b[1] === 2 && st.lp[1] === 2) return { ok:true };
      return { ok:false, msg:notYet(r) };
    }
    if (id === "tc2") {
      if (ce !== "C") return { ok:false, msg:m.tc3.centre };
      if (placed(st) === 22) return { ok:false, msg:m.tc2.e22 };
      if (eOn(st, 0) > 8) return { ok:false, msg:m.tc2.twoDouble };
      var o2 = [1, 2, 3].filter(function(i){ return st.b[i] === 2 && st.lp[i] === 2; }).length, o1 = [1, 2, 3].filter(function(i){ return st.b[i] === 1 && st.lp[i] === 3; }).length;
      if (o2 === 1 && o1 === 2 && st.lp[0] === 0) return { ok:true };
      return { ok:false, msg:notYet(r) };
    }
    if (ce !== "C") return { ok:false, msg:m.tc3.centre };
    if (st.lp[1] === 0) {
      if (st.b[0] === 1 && st.lp[0] === 3 && st.b[2] === 3 && st.lp[2] === 1) return { ok:true };
      if (st.b[0] === 2 && st.lp[0] === 2 && st.b[2] === 2 && st.lp[2] === 2) return { ok:false, msg:m.tc3.oddN };
      if (st.b[0] === 3 && st.lp[0] === 1 && st.b[2] === 1 && st.lp[2] === 3) return { ok:false, msg:m.tc3.tripleO };
    }
    return { ok:false, msg:notYet(r) };
  }
  return { predict:hooks, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: Choose the best structure ----------
var S2 = {
  co2:{ a:{ c:0, b:[0, 2, 2], lp:[0, 2, 2] }, b:{ c:0, b:[0, 3, 1], lp:[0, 1, 3] } },
  n2o:{ a:{ c:1, b:[3, 0, 1], lp:[1, 0, 3] }, b:{ c:1, b:[2, 0, 2], lp:[2, 0, 2] } },
  ocn:{ a:{ c:1, b:[1, 0, 3], lp:[3, 0, 1] }, b:{ c:1, b:[2, 0, 2], lp:[2, 0, 2] } }
};
function atomName(sp, st, i){
  var el = sp.at[i], same = sp.at.filter(function(x){ return x === el; }).length > 1;
  if (i === st.c) return same ? "the central " + el : el;
  if (!same || el === "H") return el;
  return el + " (" + ["", "single", "double", "triple"][st.b[i]] + "-bonded)";
}
// formal charges added left to right as drawn (top to bottom for ties)
function fcSum(sp, st){
  var G = geo(sp, st), ids = sp.at.map(function(_, i){ return i; }).sort(function(p, q){ return G.atoms[p].x - G.atoms[q].x || G.atoms[p].y - G.atoms[q].y; }), v = ids.map(function(i){ return fc(sp, st, i); });
  return v.map(function(x, k){ return k ? (x < 0 ? " − " + (-x) : " + " + x) : sgn(x); }).join("") + " = " + sgn(sum(v));
}
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3;
  S.s1 = S.s1 && typeof S.s1 === "object" ? S.s1 : {}; if (s1.list.indexOf(S.s1.sp) < 0) S.s1.sp = s1.list[0]; S.s1.done = S.s1.done || {};
  S.s2 = S.s2 && typeof S.s2 === "object" ? S.s2 : {}; S.s3 = S.s3 && typeof S.s3 === "object" ? S.s3 : {};
  host.innerHTML = '<div class="part lw-st"><h3>' + s1.title + "</h3><p>" + s1.intro + '</p><div class="lw-s1sp"></div><div class="lw-s1grid"><div class="lw-stage lw-s1stage"><svg class="lw-svg" viewBox="0 0 440 300" role="img" aria-label=""></svg><div class="lw-hits"></div></div>' +
    '<div class="lw-s1out"><p class="lw-work" aria-live="polite"></p><p class="lw-sum"></p></div></div></div>' +
    '<div class="part lw-st"><h3>' + s2.title + "</h3><p>" + s2.intro + '</p><div class="lw-pairs"></div></div>' +
    '<div class="part lw-st"><h3>' + s3.title + "</h3><p>" + s3.intro + '</p><details class="alg" open><summary>Check it with data: bond lengths</summary>' + MV.tableHTML({ head:s3.table.head, rows:s3.table.rows, caption:"Approximate bond lengths" }) + '<p class="tiny muted">' + s3.tableNote + "</p></details>" +
    '<p class="lw-ask">' + s3.ask + '</p><div class="lw-scales"></div></div>';
  // ----- Station 1: formal-charge calculator -----
  var stg = $(".lw-s1stage", host), sv = $("svg", stg), hb = $(".lw-hits", stg), work = $(".lw-work", host), sumP = $(".lw-sum", host), cur = null, tws = [];
  var R1 = radios($(".lw-s1sp", host), { label:"Structure", aria:"Finished structure", cls:"chips", options:s1.list.map(function(id){ return { id:id, t:fh(SP[id]) }; }), value:S.s1.sp, onChange:function(v){ clearT(); S.s1.sp = v; S.s1.done = {}; cur = null; api.save(); paint1(); } });
  function clearT(){ tws.forEach(clearTimeout); tws = []; }
  function paint1(){
    var sp = SP[S.s1.sp], st = finalOf(sp), G = geo(sp, st), shown = {};
    Object.keys(S.s1.done).forEach(function(k){ shown[k] = 1; });
    sv.innerHTML = lewisSVG(sp, st, G, { fcShow:shown, br:true, hl:cur });
    sv.setAttribute("aria-label", describe(sp, st, G, false) + " Formal charges found so far: " + (Object.keys(shown).length ? Object.keys(shown).map(function(i){ return atomName(sp, st, +i) + " " + sgn(fc(sp, st, +i)); }).join(", ") : "none") + ".");
    MV.keepFocus(hb, function(){ hb.innerHTML = G.atoms.map(function(a, i){ return '<button type="button" class="lw-hit' + (cur && cur.i === i ? " on" : "") + '" data-s1="' + i + '" data-k="s1a' + i + '" style="left:' + r1(a.x / G.W * 100) + "%;top:" + r1(a.y / G.H * 100) + '%" aria-label="' + esc("Work out the formal charge on " + atomName(sp, st, i)) + '"></button>'; }).join(""); });
    var n = Object.keys(shown).length;
    sumP.innerHTML = n < sp.at.length ? '<span class="muted">Formal charges found: ' + n + " of " + sp.at.length + ". Tap every atom to check the sum.</span>" :
      "<strong>Sum:</strong> " + fcSum(sp, st) + ", the " + (sp.q ? "ion’s" : "molecule’s") + " charge ✓. The formal charges always add up to the species’ charge.";
    if (!cur) work.innerHTML = '<span class="muted">Tap an atom in ' + fh(sp) + " to see its formal charge worked out.</span>";
  }
  function calc(i){
    clearT();
    var sp = SP[S.s1.sp], st = finalOf(sp), V = VAL[sp.at[i]], L = 2 * st.lp[i], Bn = 2 * bOn(st, i), v = fc(sp, st, i);
    var parts = ["<strong>" + atomName(sp, st, i) + "</strong> in " + fh(sp) + ": valence " + V, " − lone-pair electrons " + L, " − bonding electrons " + Bn + " ÷ 2", " = <strong>" + sgn(v) + "</strong>."];
    function show(ph){ cur = { i:i, ph:ph }; if (ph >= 4) S.s1.done[i] = 1; work.innerHTML = parts.slice(0, ph).join("") + (ph < 4 ? '<span class="muted"> …</span>' : ""); api.save(); paint1(); }
    if (MV.reduceMotion) { show(4); cur = { i:i, ph:3 }; paint1(); work.innerHTML = parts.join(""); return; }
    [1, 2, 3, 4].forEach(function(ph, k){ tws.push(setTimeout(function(){ show(ph); if (ph === 4) { cur = { i:i, ph:3 }; paint1(); work.innerHTML = parts.join(""); } }, k * 750)); });
  }
  hb.addEventListener("click", function(e){ var b = e.target.closest("[data-s1]"); if (b) calc(+b.dataset.s1); });
  paint1();
  // ----- Station 2: the three rules -----
  var pairsH = $(".lw-pairs", host), RR = {};
  pairsH.innerHTML = s2.pairs.map(function(p){
    return '<div class="lw-pair" data-pr="' + p.id + '"><h4 class="lw-h4">' + p.title + '</h4><div class="lw-cands" role="radiogroup" aria-label="Candidate structures"></div><div class="lw-rules"></div>' +
      '<div class="q-actions"><button type="button" class="btn primary sm" data-pc="' + p.id + '" data-k="pc' + p.id + '">Check</button></div><div class="lw-pfb"></div><p class="lw-r3"></p></div>';
  }).join("");
  s2.pairs.forEach(function(p){
    var x = S.s2[p.id] = S.s2[p.id] || {}, box = $('[data-pr="' + p.id + '"]', pairsH), sp = SP[p.sp];
    RR[p.id] = radios($(".lw-rules", box), { label:"Rule that decides", aria:"Rule that decides", cls:"chips lw-rlist", options:s2.rules, value:x.rule || "", onChange:function(v){ x.rule = v; x.res = null; api.save(); paintPair(p); } });
    var r3 = p.show.map(function(k){ var st = fix(sp, S2[p.id][k]); return p.labels[k] + ": " + fcSum(sp, st) + " ✓"; }).join(" · ");
    $(".lw-r3", box).innerHTML = '<span class="tiny"><strong>Rule 3, checked automatically:</strong> ' + r3 + ". Both add up to the " + (sp.q ? "ion’s" : "molecule’s") + " charge.</span>";
    paintPair(p);
  });
  function paintPair(p){
    var x = S.s2[p.id], box = $('[data-pr="' + p.id + '"]', pairsH), sp = SP[p.sp], cands = $(".lw-cands", box);
    MV.keepFocus(cands, function(){
      cands.innerHTML = p.show.map(function(k, j){
        var st = fix(sp, S2[p.id][k]), G = geo(sp, st, { W:400, H:150, rb:88 }), on = x.pick === k;
        return '<button type="button" role="radio" class="lw-cand' + (on ? " on" : "") + '" aria-checked="' + on + '" tabindex="' + (on || (!x.pick && j === 0) ? 0 : -1) + '" data-cd="' + k + '" data-k="cd' + p.id + k + '"' + (x.solved ? " disabled" : "") + '><svg viewBox="0 0 400 150" class="lw-svg" aria-hidden="true">' + lewisSVG(sp, st, G, { fc:true, br:true }) + '</svg><span class="lw-clab">' + p.labels[k] + '</span><span class="vh">: formal charges ' + sp.at.map(function(_, i){ return atomName(sp, st, i) + " " + sgn(fc(sp, st, i)); }).join(", ") + "</span></button>";
      }).join("");
    });
    RR[p.id].lock(!!x.solved);
    $("[data-pc]", box).disabled = !!x.solved;
    var fb = $(".lw-pfb", box), r = x.res;
    fb.innerHTML = !r ? "" : r.ok ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + p.right) : MV.fbHTML(r.soft ? "" : "bad", (r.soft ? "" : "<strong>✗ Not quite.</strong> ") + r.msg);
  }
  pairsH.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.dataset.rg != null) return;
    var box = b.closest("[data-pr]"); if (!box) return;
    var p = s2.pairs.filter(function(q){ return q.id === box.dataset.pr; })[0], x = S.s2[p.id];
    if (b.dataset.cd) { x.pick = b.dataset.cd; x.res = null; api.save(); paintPair(p); return; }
    if (b.dataset.pc) {
      var ans = MV.ans(p);
      if (!x.pick || !x.rule) x.res = { soft:true, msg:"Tap a structure and choose a rule first." };
      else if (x.pick !== ans.best) x.res = { msg:p.wrongPick };
      else if (x.rule === "r3") x.res = { msg:s2.r3note };
      else if (x.rule !== ans.rule) x.res = { msg:p.wrongRule };
      else { x.res = { ok:true }; x.solved = true; }
      api.save(); paintPair(p); MV.focusFb(box);
    }
  });
  pairsH.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-cd]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = $$("[data-cd]", b.parentNode), i = all.indexOf ? all.indexOf(b) : Array.prototype.indexOf.call(all, b), nx = all[(i + d + all.length) % all.length]; nx.click(); var f = b.closest("[data-pr]").querySelector('[data-cd="' + nx.dataset.cd + '"]'); if (f) f.focus();
  });
  // ----- Station 3: bond lengths on a single–double scale -----
  var scH = $(".lw-scales", host), LO = 110, HI = 155, X0 = 40, X1 = 500;
  function px(v){ return X0 + (v - LO) / (HI - LO) * (X1 - X0); }
  scH.innerHTML = s3.scales.map(function(c){ return '<div class="lw-scale" data-sc="' + c.id + '"><p class="lw-sq"><strong>' + c.bond + ":</strong> place the marker at the measured length of " + c.what + '.</p><div class="lw-track"><svg viewBox="0 0 540 110" class="lw-svg" aria-hidden="true"></svg><button type="button" class="lw-mark" role="slider" aria-valuemin="' + LO + '" aria-valuemax="' + HI + '" data-k="mk' + c.id + '"></button></div>' +
    '<div class="q-actions"><button type="button" class="btn primary sm" data-scc="' + c.id + '" data-k="scc' + c.id + '">Check</button></div><div class="lw-scfb"></div></div>'; }).join("");
  function paintScale(c){
    var x = S.s3[c.id] = S.s3[c.id] || { v:152 }, box = $('[data-sc="' + c.id + '"]', scH), h = "", v = clamp(Math.round(+x.v || 152), LO, HI); x.v = v;
    h += ln(X0, 60, X1, 60, { c:"var(--plot-axis)", w:2 });
    for (var t = LO; t <= HI; t += 5) h += ln(px(t), 56, px(t), 64, { c:"var(--plot-axis)", w:1.4 }) + tx(px(t), 78, String(t), { fs:11, c:"var(--ink-2)" });
    h += tx(X1 + 16, 78, "pm", { a:"start", fs:11, c:"var(--ink-2)" });
    [[c.dbl, c.bond.replace("–", "=") + " (double) " + c.dbl], [c.single, c.bond + " (single) " + c.single]].forEach(function(m){ h += ln(px(m[0]), 40, px(m[0]), 66, { c:"var(--ink)", w:2.4 }) + tx(px(m[0]), 30, m[1], { fs:12, w:700, halo:true }); });
    if (x.done) h += '<rect x="' + r1(px(c.dbl)) + '" y="52" width="' + r1(px(c.single) - px(c.dbl)) + '" height="16" fill="var(--hi-soft)"/>' + tx(px(c.measured), 98, "blend: bond order ≈ " + c.order, { fs:12, w:700, halo:true });
    h += '<path d="M' + r1(px(v)) + " 66 l-8 -14 h16 z\" fill=\"var(--e-pair)\"/>" + ln(px(v), 46, px(v), 66, { c:"var(--e-pair)", w:2.4 });
    $("svg", box).innerHTML = h;
    var mk = $(".lw-mark", box); mk.style.left = r1(px(v) / 540 * 100) + "%"; mk.setAttribute("aria-valuenow", v); mk.setAttribute("aria-valuetext", v + " pm"); mk.setAttribute("aria-label", "Marker for " + MV.plain(c.what) + ": " + v + " pm"); mk.disabled = !!x.done;
    $("[data-scc]", box).disabled = !!x.done;
    var fb = $(".lw-scfb", box);
    fb.innerHTML = x.done ? MV.fbHTML("good", "<strong>✓ " + c.measured + " pm.</strong> " + c.done) : x.msg ? MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + x.msg) : "";
  }
  s3.scales.forEach(paintScale);
  function scOf(el){ var box = el.closest("[data-sc]"); return box ? s3.scales.filter(function(c){ return c.id === box.dataset.sc; })[0] : null; }
  function setV(c, v){ var x = S.s3[c.id]; x.v = clamp(Math.round(v), LO, HI); x.msg = ""; api.save(); paintScale(c); }
  var dragC = null;
  scH.addEventListener("pointerdown", function(e){
    var tr = e.target.closest(".lw-track"); if (!tr) return; var c = scOf(tr); if (!c || S.s3[c.id].done) return;
    dragC = { c:c, r:tr.getBoundingClientRect() }; e.preventDefault(); try { tr.setPointerCapture(e.pointerId); } catch (er) {}
    move(e); var mk = $(".lw-mark", tr); if (mk) mk.focus({ preventScroll:true });
  });
  function move(e){ if (!dragC) return; var r = dragC.r, f = (e.clientX - r.left) / r.width * 540; setV(dragC.c, LO + (f - X0) / (X1 - X0) * (HI - LO)); }
  scH.addEventListener("pointermove", move);
  scH.addEventListener("pointerup", function(){ dragC = null; }); scH.addEventListener("pointercancel", function(){ dragC = null; });
  scH.addEventListener("keydown", function(e){
    var mk = e.target.closest(".lw-mark"); if (!mk) return; var c = scOf(mk), x = S.s3[c.id], d = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") d = -1; else if (e.key === "ArrowRight" || e.key === "ArrowUp") d = 1; else if (e.key === "PageDown") d = -5; else if (e.key === "PageUp") d = 5;
    if (e.key === "Home") { e.preventDefault(); setV(c, LO); return; } if (e.key === "End") { e.preventDefault(); setV(c, HI); return; }
    if (!d) return; e.preventDefault(); setV(c, x.v + d * (e.shiftKey ? 5 : 1)); $(".lw-mark", mk.closest("[data-sc]")).focus({ preventScroll:true });
  });
  scH.addEventListener("click", function(e){
    var b = e.target.closest("[data-scc]"); if (!b || b.disabled) return; var c = scOf(b), x = S.s3[c.id];
    if (Math.abs(x.v - c.measured) <= 1) { x.done = true; x.v = c.measured; x.msg = ""; } else x.msg = s3.wrong;
    api.save(); paintScale(c); MV.focusFb(b.closest("[data-sc]"));
  });
}

// ---------- Practice 1: Count and build (two number entries per species, plus a builder check) ----------
function countAct(host, api, a){
  var S = api.S; S.items = S.items || {}; S.b = S.b || {};
  var msgs = {}, ids = a.items.map(function(it){ return it.sp; });
  function ist(id){ return S.items[id] || (S.items[id] = { ve:"", lp:"", tries:0, hint:0, solved:false, first:null, built:false }); }
  host.innerHTML = '<p class="how">' + a.how + '</p><div class="lw-cl"></div><div class="lw-pb part"><h4 class="lw-h4">Builder check</h4><p class="how">Build the species, then compare the central atom’s lone pairs with your answer. Use <strong>Show formal charges</strong> to check that they add up to the charge.</p><div class="lw-pbb"></div></div>';
  var list = $(".lw-cl", host);
  var B = builder($(".lw-pbb", host), { S:S.b, save:api.save, species:ids, modes:null, onChange:onBuild });
  function one(s){ var v = MV.parseNum(String(s || "").trim()); return v && v.length === 1 && isFinite(v[0]) ? v[0] : null; }
  function onBuild(){
    var changed = false;
    a.items.forEach(function(it){ var x = ist(it.id), sp = SP[it.sp], st = B.stateOf(it.sp), r = evalB(sp, st);
      if (x.solved && !x.built && r.ok && sp.at[st.c] === sp.at[sp.c] && st.lp[st.c] === MV.ans(it)[1]) { x.built = true; changed = true; } });
    if (changed) { api.save(); paint(); }
  }
  function itemHTML(it, i){
    var x = ist(it.id), sp = SP[it.sp], ans = MV.ans(it), dis = x.solved ? " disabled" : "", h = '<div class="q" data-ci="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt"><strong>' + fh(sp) + "</strong>" + (it.note ? ' <span class="muted">' + it.note + "</span>" : "") + "</div></div>";
    h += '<div class="lw-nums"><label class="numrow"><span>' + a.labels.ve + '</span><input class="numin" data-cin="' + it.id + '" data-part="ve" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.ve) + '"' + dis + '></label><label class="numrow"><span>' + a.labels.lp + " (" + sp.at[sp.c] + ')</span><input class="numin" data-cin="' + it.id + '" data-part="lp" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="' + esc(x.lp) + '"' + dis + "></label></div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + '<button type="button" class="btn ghost sm" data-act="build" data-k="' + it.id + 'bld">Build it</button></div>' + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + ans[0] + " valence electrons; " + (ans[1] ? ans[1] + " lone pair" + (ans[1] > 1 ? "s" : "") : "no lone pairs") + " on " + sp.at[sp.c] + ".</strong>" + (x.first ? "" : ' <span class="muted">(not first try)</span>') +
      ' <span class="lw-built">' + (x.built ? "✓ Confirmed in the builder." : '<button type="button" class="btn ghost sm" data-act="build" data-k="' + it.id + 'bld">Build it to confirm</button>') + "</span>");
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(list, function(){ list.innerHTML = a.items.map(itemHTML).join(""); }); }
  function item(id){ return a.items.filter(function(x){ return x.id === id; })[0]; }
  list.addEventListener("input", function(e){ var d = e.target.dataset; if (!d || !d.cin) return; ist(d.cin)[d.part] = e.target.value; api.save(); });
  list.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.cin) { var b = list.querySelector('[data-k="' + e.target.dataset.cin + 'chk"]'); if (b) b.click(); } });
  list.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-ci]"); if (!bx) return;
    var it = item(bx.dataset.ci), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.act === "build") { var s0 = B.stateOf(it.sp); B.load(it.sp, s0, { msg:"Build " + MV.plain(fh(SP[it.sp])) + "." }); var pb = $(".lw-pb", host); pb.scrollIntoView({ block:"start", behavior:MV.reduceMotion ? "auto" : "smooth" }); var f = $(".lw-pbb [data-rg][aria-checked=true]", host); if (f) f.focus({ preventScroll:true }); return; }
    if (b.dataset.act === "check") {
      var ve = one(x.ve), lp = one(x.lp), ans = MV.ans(it);
      if (ve == null || lp == null) { msgs[it.id] = { t:"Enter a whole number in each box.", soft:true }; paint(); return; }
      if (ve === ans[0] && lp === ans[1]) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; }
      else {
        x.tries++;
        var w = it.wrong || [], t = [];
        if (ve !== ans[0]) { var nv = w.filter(function(z){ return z.ve === ve; })[0]; t.push("Valence electrons: " + (nv ? nv.fb : a.general.ve)); }
        else t.push("Valence electrons ✓.");
        if (lp !== ans[1]) { var nl = w.filter(function(z){ return z.lp === lp; })[0]; t.push("Lone pairs: " + (nl ? nl.fb : it.lpfb || a.general.lp)); }
        msgs[it.id] = { t:t.join(" ") };
      }
      api.save(); paint(); MV.focusFb(list.querySelector('[data-ci="' + it.id + '"]'));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Practice 2: Which structure is best? (chips, from SCH4U 13's reasonAct chips) ----------
function bestAct(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { pick:null, tries:0, hint:0, solved:false, first:null }); }
  function itemHTML(it, i){
    var x = ist(it.id), dis = x.solved ? " disabled" : "", h = '<div class="q" data-bi="' + it.id + '"><div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="chips lw-chiplist" role="radiogroup" aria-label="Choices">' + it.options.map(function(o, k){ var on = x.pick === k; return '<button type="button" role="radio" class="chip' + (on ? " on" : "") + '" aria-checked="' + on + '" data-op="' + k + '" data-k="' + it.id + "o" + k + '"' + dis + ">" + o.t + "</button>"; }).join("") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + MV.hintBtn(it.id + "hint", x.hint) + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct: " + it.options[x.pick].t + ".</strong> " + (it.options[x.pick].why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += msgs[it.id].soft ? MV.fbHTML("", msgs[it.id].t) : MV.fbHTML("bad", "<strong>✗ Not quite.</strong> " + msgs[it.id].t + " Try again.");
    return h + "</div>";
  }
  function paint(){ MV.keepFocus(host, function(){ host.innerHTML = '<p class="how">' + a.how + "</p>" + a.items.map(itemHTML).join(""); }); }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-bi]"); if (!bx) return;
    var it = a.items.filter(function(q){ return q.id === bx.dataset.bi; })[0], x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.op != null) { x.pick = +b.dataset.op; msgs[it.id] = null; api.save(); paint(); return; }
    if (b.dataset.act === "check") {
      if (x.pick == null) { msgs[it.id] = { t:"Choose an answer first.", soft:true }; paint(); return; }
      if (MV.ok(it.options[x.pick])) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = null; } else { x.tries++; msgs[it.id] = { t:it.options[x.pick].why }; }
      api.save(); paint(); MV.focusFb(host.querySelector('[data-bi="' + it.id + '"]'));
    }
  });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-op]"); if (!b) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); var all = Array.prototype.slice.call(b.parentNode.querySelectorAll("[data-op]")), nx = all[(all.indexOf(b) + d + all.length) % all.length]; nx.click();
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal)); }); return g; }
  };
}

// ---------- Performance task: One lone pair, room to spare (AFn designer with a live Lewis diagram) ----------
var task = (function(){
  var S = null, api = null, T = null, R = {};
  function read(){ return { c:S && S.c || "", n:S && S.n ? +S.n : 0, q:S && S.q != null && S.q !== "" ? +S.q : null }; }
  function info(d){
    var V = VAL[d.c], tot = V + 7 * d.n - d.q, lpe = V - d.n - d.q, around = 2 * d.n + Math.max(0, lpe);
    return { V:V, tot:tot, lpe:lpe, around:around, even:tot % 2 === 0, one:lpe === 2, more:lpe >= 0 && around > 8, rule:lpe >= 0 && PER[d.c] >= 3 && around <= 12 };
  }
  function formula(d){ return d.c + "F" + (d.n > 1 ? d.n : "") + (d.q > 0 ? "+" : d.q < 0 ? "-" : ""); }
  function spOf(d){ var at = [d.c]; for (var i = 0; i < d.n; i++) at.push("F"); return { at:at, q:d.q, c:0, fh:MV.chem.f(formula(d)) }; }
  function paint(){
    var d = read(), sv = $("#lw-tksvg"), capE = $("#lw-tkcap"); if (!sv) return;
    if (!d.c || !d.n || d.q == null) { sv.innerHTML = tx(220, 150, "Choose a central atom, a number of F atoms and a charge.", { fs:14, c:"var(--ink-2)" }); sv.setAttribute("aria-label", "No design yet."); capE.innerHTML = ""; return; }
    var I = info(d), sp = spOf(d), st = blank(sp); st.c = 0;
    for (var i = 1; i <= d.n; i++) { st.b[i] = 1; st.lp[i] = 3; }
    st.lp[0] = Math.max(0, Math.floor(I.lpe / 2));
    var rad = []; rad[0] = I.lpe > 0 && I.lpe % 2 ? 1 : 0;
    var G = geo(sp, st, { rad:rad });
    sv.innerHTML = lewisSVG(sp, st, G, { oct:false, br:true }) + (function(){ var a = G.atoms[0], p = lpPos(a, a.octD, AR + 13); return tx(p.x, p.y, String(I.around), { fs:13, w:700, c:I.around > 12 || (I.around > 8 && PER[d.c] < 3) ? "var(--red)" : "var(--ink-2)", halo:true }); })();
    var pairs = Math.floor(Math.max(0, I.lpe) / 2), lone = I.lpe > 0 && I.lpe % 2 ? " and one unpaired electron" : "";
    sv.setAttribute("aria-label", MV.plain(sp.fh) + ": " + d.c + " in the centre bonded to " + d.n + " F atom" + (d.n > 1 ? "s" : "") + ", each F with three lone pairs; " + (I.lpe < 0 ? "not enough electrons for the bonds" : pairs + " lone pair" + (pairs === 1 ? "" : "s") + lone + " on " + d.c + "; " + I.around + " electrons around " + d.c) + ".");
    var qv = d.q ? (d.q < 0 ? " + " + (-d.q) : " − " + d.q) : "";
    var h = "<strong>" + sp.fh + ":</strong> " + d.c + " " + I.V + " + " + d.n + " × F 7" + qv + " = <strong>" + I.tot + "</strong> valence electrons" + (I.even ? "" : " (odd)") + ". ";
    if (I.lpe < 0) h += d.n + " bonds need " + d.n + " electrons from " + d.c + ", but it has only " + (I.V - d.q) + " to share: this design can’t be drawn.";
    else h += d.n + " bond" + (d.n > 1 ? "s use " : " uses ") + 2 * d.n + " and the F lone pairs use " + 6 * d.n + ", leaving " + I.lpe + " on " + d.c + ": " + (pairs ? pairs + " lone pair" + (pairs > 1 ? "s" : "") : "no lone pairs") + lone + ". <strong>" + I.around + "</strong> electrons around " + d.c + (I.around > 8 ? (PER[d.c] >= 3 ? " (expanded octet, period " + PER[d.c] + ")" : ": not possible for period 2") : "") + ".";
    capE.innerHTML = h;
  }
  return {
    render:function(inp, pv, a){
      api = a; S = a.S; T = MV.C.task;
      var CS = T.inputs.centres; if (CS.indexOf(S.c) < 0) S.c = ""; if (!(S.n >= 1 && S.n <= 6)) S.n = ""; if ([-1, 0, 1].indexOf(S.q) < 0) S.q = "";
      inp.innerHTML = '<div class="lw-tq lw-tc"></div><div class="lw-tq lw-tn"></div><div class="lw-tq lw-tqq"></div>';
      R.c = radios($(".lw-tc", inp), { label:T.inputs.centre, aria:T.inputs.centre, cls:"chips", options:CS.map(function(el){ return { id:el, t:el }; }), value:S.c, onChange:function(v){ S.c = v; api.save(); paint(); api.update(); } });
      R.n = radios($(".lw-tn", inp), { label:T.inputs.n, aria:T.inputs.n, cls:"chips", options:[1, 2, 3, 4, 5, 6].map(function(v){ return { id:String(v), t:String(v) }; }), value:S.n === "" ? "" : String(S.n), onChange:function(v){ S.n = +v; api.save(); paint(); api.update(); } });
      R.q = radios($(".lw-tqq", inp), { label:T.inputs.q, aria:T.inputs.q, cls:"chips", options:[{ id:"-1", t:MI + "1" }, { id:"0", t:"0" }, { id:"1", t:"+1" }], value:S.q === "" ? "" : String(S.q), onChange:function(v){ S.q = +v; api.save(); paint(); api.update(); } });
      pv.innerHTML = '<h4 class="lw-h4">Live Lewis diagram</h4><div class="lw-box"><svg class="lw-svg" id="lw-tksvg" viewBox="0 0 440 300" role="img" aria-label=""></svg></div><p class="lw-tcap" id="lw-tkcap" aria-live="polite"></p>';
      paint();
    },
    read:read,
    valid:function(d){ return d.c && d.n && d.q != null ? true : "Choose a central atom, a number of F atoms and a charge first."; },
    checks:function(d){ if (!d.c || !d.n || d.q == null) return [false, false, false, false]; var I = info(d); return [I.even, I.one, I.more, I.rule]; },
    key:function(d){ return d.c + "|" + d.n + "|" + d.q; },
    label:function(k){ var p = k.split("|"); return MV.chem.f(formula({ c:p[0], n:+p[1], q:+p[2] })); },
    text:function(k){ return MV.plain(this.label(k)); }
  };
})();

MV.module({
  hero:hero,
  explore:function(host, api){ return explore(host, api); },
  part3:part3,
  activities:{ count:countAct, best:bestAct },
  task:task
});
})();
