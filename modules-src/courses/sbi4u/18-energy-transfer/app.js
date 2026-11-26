// SBI4U 18 Energy Transfer: hero (glucose's 2870 kJ splits into an ATP stream and a heat stream; ATP powers a muscle and is
// recharged), Energy flow meter (S3 energy ledger with a flow-band display: Where it goes · ATP–ADP cycle · Coupling),
// "Energy beyond the cell" (body heat, trophic pyramid with number entry, engines vs cells), Energy arithmetic (custom N4),
// "Fuel a sprint" task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (SVG helpers from SBI4U 10 / 14) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function seg(k, a, b){ return clamp((k - a) / (b - a), 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "et-t", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i]; return null; }
function op(a, g){ return a >= 0.98 ? g : a <= 0.02 ? "" : '<g opacity="' + Math.round(a * 100) / 100 + '">' + g + "</g>"; }
function polyAt(pts, p){
  var segs = [], tot = 0, i;
  for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); tot += l; }
  if (!tot) return pts[0];
  var d = clamp(p, 0, 1) * tot;
  for (i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { var k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= segs[i]; }
  return pts[pts.length - 1];
}
function sgn(v){ var r = Math.round(v * 10) / 10; return (r > 0 ? "+" : "") + MV.num(r, 1); }
function kjS(v){ return MV.num(Math.round(v)) + " kJ"; }
var GLU = 2870, ATP_KJ = 30.5, FERM_REL = 200, POOL0 = 100, POOL_MAX = 200;
function pct(v){ return "≈ " + Math.round(v / GLU * 100) + "%"; }
// wavy line from (x, y) along the unit direction (ux, uy): length len, amplitude amp, period per; with an arrowhead at the end
function waveD(x, y, ux, uy, len, amp, per, ph){
  var d = "", n = Math.max(8, Math.round(len * 1.2)), px = -uy, py = ux, i;
  for (i = 0; i <= n; i++) { var s = len * i / n, o = amp * Math.sin(2 * Math.PI * s / per + (ph || 0)) * (1 - s / len * 0.6); d += (i ? " L" : "M") + f1(x + ux * s + px * o) + " " + f1(y + uy * s + py * o); }
  var ex = x + ux * (len + 5), ey = y + uy * (len + 5);
  return d + " M" + f1(ex - ux * 6 + px * 4) + " " + f1(ey - uy * 6 + py * 4) + " L" + f1(ex) + " " + f1(ey) + " L" + f1(ex - ux * 6 - px * 4) + " " + f1(ey - uy * 6 - py * 4);
}

// ---------- @component radioGroup (copied from SBI4U 14 / 08 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + x.id + '"' + (x.aria ? ' aria-label="' + MV.esc(x.aria) + '"' : "") + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
    if (f) { var b = host.querySelector('[data-rg="' + val + '"]') || host.querySelector("[data-rg]:not([disabled])"); if (b && !b.disabled) b.focus({ preventScroll:true }); }
  }
  function firstFree(){ for (var i = 0; i < o.options.length; i++) if (!o.options[i].dis) return i; return 0; }
  function choose(id){ id = String(id); var changed = id !== val; val = id; paint(); if (changed && o.onChange) o.onChange(val); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-rg]"); if (b && !b.disabled) choose(b.dataset.rg); });
  host.addEventListener("keydown", function(e){
    var b = e.target.closest("[data-rg]"); if (!b || off) return;
    var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0; if (!d) return;
    e.preventDefault(); e.stopPropagation();
    var ids = o.options.filter(function(x){ return !x.dis; }).map(function(x){ return String(x.id); }); if (!ids.length) return;
    var i = ids.indexOf(String(b.dataset.rg)); choose(ids[(i + d + ids.length) % ids.length]);
  });
  paint();
  return { set:function(id){ if (String(id) !== val) { val = String(id); paint(); } }, get:function(){ return val; },
    setOptions:function(list){ o.options = list; paint(); }, disable:function(b){ if (b !== off) { off = b; paint(); } } };
}
// @component stepper — − / + buttons around a live value (from SBI4U 14 / 10): stepper(host, {id, label, min, max, value, unit(v), onChange(v)}) -> {set(v), disable(b)}
function stepper(host, o){
  var v = o.value, off = false, nm = MV.plain(o.label);
  host.innerHTML = '<span class="rg-wrap"><span class="rg-lab" id="' + o.id + '-l">' + o.label + '</span><span class="et-stp" role="group" aria-labelledby="' + o.id + '-l">' +
    '<button type="button" class="et-stb" data-d="-1" data-k="' + o.id + 'm" aria-label="' + MV.esc("Decrease " + nm) + '">−</button><output id="' + o.id + '" aria-live="polite"></output>' +
    '<button type="button" class="et-stb" data-d="1" data-k="' + o.id + 'p" aria-label="' + MV.esc("Increase " + nm) + '">+</button></span></span>';
  var out = $("#" + o.id, host);
  function paint(){ out.textContent = o.unit ? o.unit(v) : v; $$("[data-d]", host).forEach(function(b){ b.disabled = off || (+b.dataset.d < 0 ? v <= o.min : v >= o.max); }); }
  host.addEventListener("click", function(e){ var b = e.target.closest("[data-d]"); if (!b || b.disabled) return; v = clamp(v + (+b.dataset.d), o.min, o.max); paint(); o.onChange(v); });
  paint();
  return { set:function(x){ v = x; paint(); }, disable:function(b){ off = b; paint(); } };
}
// range slider with output (from SBI4U 14): slider(host, {id, label, min, max, step, value, unit(v), short(v), onChange(v)}) -> {set(v), disable(b)}
function slider(host, o){
  host.innerHTML = '<label class="slider et-sl"><span class="slider-top"><span>' + o.label + '</span><output id="' + o.id + '-out" for="' + o.id + '"></output></span><input type="range" id="' + o.id + '" min="' + o.min + '" max="' + o.max + '" step="' + o.step + '" value="' + o.value + '"></label>';
  var inp = $("#" + o.id, host), out = $("#" + o.id + "-out", host);
  function show(v){ out.textContent = o.short ? o.short(v) : o.unit(v); inp.setAttribute("aria-valuetext", o.unit(v)); }
  inp.addEventListener("input", function(){ show(+inp.value); o.onChange(+inp.value); });
  show(o.value);
  return { set:function(v){ inp.value = v; show(v); }, disable:function(b){ inp.disabled = b; } };
}

// ---------- @component S3 energyLedger — flow-band (Sankey) form: one mole of glucose (2870 kJ) splits into heat, ATP and, for
// fermentation, energy still in the products. Band widths are proportional to kJ; every band carries its kJ and % in words.
// Horizontal layout (wide screens) or vertical (phones: glucose at the top, splitting downward). Heat: --ink-2 wavy texture;
// ATP: --bio-atp bands and tokens; glucose: --bio-carbon block; lactate: --bio-carbon outline. ----------
var FG = {
  h:{ W:560, H:320, b0:14, x0:94, L:224, lo:14, hi:306, HT:200, minC:56, gap:14, cols:7 },
  v:{ W:340, H:404, b0:8, x0:58, L:186, lo:10, hi:330, HT:170, minC:96, gap:12, cols:7 }
};
function flowVals(p){
  var cap = p.atp * ATP_KJ;
  return p.ferm ? { cap:cap, heat:FERM_REL - cap, left:GLU - FERM_REL, n:p.atp, ferm:1 } : { cap:cap, heat:GLU - cap, left:0, n:p.atp, ferm:0 };
}
function mixVals(a, b, t){ var o = {}; ["cap", "heat", "left", "n", "ferm"].forEach(function(k){ o[k] = lerp(a[k], b[k], t); }); return o; }
function flowGeom(V, vert){
  var g = vert ? FG.v : FG.h, s = g.HT / GLU, lf = clamp(V.ferm, 0, 1), half = g.minC / 2;
  var w = [Math.max(V.heat * s, 1.5), Math.max(V.cap * s, 2.5), Math.max(V.left * s, 0)];
  var vs = (g.lo + g.hi) / 2 - g.HT / 2, st = [], acc = vs;
  w.forEach(function(x){ st.push([acc, acc + x]); acc += x; });
  var c1 = g.lo + Math.max(w[0] / 2, half);
  var c2 = Math.max(c1 + w[0] / 2 + g.gap + w[1] / 2, c1 + g.minC);
  var c3 = Math.max(c2 + w[1] / 2 + g.gap * lf + w[2] / 2, c2 + g.minC * lf);
  var bot = Math.max(c2 + Math.max(w[1] / 2, half), lf > 0 ? c3 + Math.max(w[2] / 2, half * lf) : 0);
  var sh = Math.max(0, (g.hi - bot) / 2), c = [c1 + sh, c2 + sh, c3 + sh];
  return { g:g, w:w, st:st, c:c, en:c.map(function(cc, i){ return [cc - w[i] / 2, cc + w[i] / 2]; }), vs:vs, lf:lf };
}
function ribbonD(g, vert, s, e){
  var L = g.L, m = L * 0.5;
  function p(u, v){ var q = vert ? [v, g.x0 + u] : [g.x0 + u, v]; return f1(q[0]) + " " + f1(q[1]); }
  return "M" + p(0, s[0]) + " C" + p(m, s[0]) + " " + p(m, e[0]) + " " + p(L, e[0]) + " L" + p(L, e[1]) + " C" + p(m, e[1]) + " " + p(m, s[1]) + " " + p(0, s[1]) + " Z";
}
// token grid: up to 8 in a row; for bigger counts the width (6–8) that leaves the fewest gaps
function tokCols(n){ if (n <= 8) return Math.max(1, n); var best = 6, bl = 99; [6, 7, 8].forEach(function(c){ var l = Math.ceil(n / c) * c - n; if (l < bl) { bl = l; best = c; } }); return best; }
function tokSVG(x, y, full){ return full ? sv("circle", { cx:x, cy:y, r:4.6, "class":"et-tok" }) : sv("circle", { cx:x, cy:y, r:4.4, "class":"et-adp" }) + sv("circle", { cx:x + 6.5, cy:y - 5, r:1.9, "class":"et-pi" }); }
// flowSVG(V, {vert, grow 0…1, hi:"heat"|"atp"|"left"|null, id, ph}) -> svg markup
function flowSVG(V, o){
  var vert = !!o.vert, G = flowGeom(V, vert), g = G.g, h = "", k = o.grow == null ? 1 : o.grow, pid = "et-wv-" + o.id, cid = "et-cl-" + o.id;
  var defs = '<defs><pattern id="' + pid + '" width="14" height="10" patternUnits="userSpaceOnUse"' + (vert ? ' patternTransform="rotate(90)"' : "") + '><path d="M0 5 Q3.5 0.5 7 5 T14 5" class="et-wvp"/></pattern>' +
    '<clipPath id="' + cid + '"><rect x="0" y="0" ' + (vert ? 'width="' + g.W + '" height="' + f1(g.x0 + g.L * k + 1) + '"' : 'width="' + f1(g.x0 + g.L * k + 1) + '" height="' + g.H + '"') + "/></clipPath></defs>";
  var bx = vert ? { x:G.vs, y:g.b0, w:g.HT, h:g.x0 - g.b0 } : { x:g.b0, y:G.vs, w:g.x0 - g.b0, h:g.HT };
  h += sv("rect", { x:bx.x, y:bx.y, width:bx.w, height:bx.h, rx:6, "class":"et-glu" });
  if (vert) h += txt(bx.x + bx.w / 2, bx.y + bx.h / 2 + 5, "glucose · 2870 kJ", "et-gt", "middle");
  else h += txt(bx.x + bx.w / 2, bx.y + bx.h / 2 - 5, "glucose", "et-gt", "middle") + txt(bx.x + bx.w / 2, bx.y + bx.h / 2 + 14, "2870 kJ", "et-gt", "middle");
  var names = ["heat", "atp", "left"], rib = "";
  names.forEach(function(nm, i){
    if (i === 2 && V.left < 1) return;
    var d = ribbonD(g, vert, G.st[i], G.en[i]), r = nm === "heat" ? sv("path", { d:d, "class":"et-rib-heat" }) + sv("path", { d:d, fill:"url(#" + pid + ")", "class":"et-rib-wave" }) : sv("path", { d:d, "class":"et-rib-" + nm });
    rib += op(o.hi && o.hi !== nm ? 0.4 : 1, r);
  });
  h += '<g clip-path="url(#' + cid + ')">' + rib + "</g>";
  var hiI = o.hi ? names.indexOf(o.hi) : -1;
  if (hiI >= 0 && (hiI < 2 || V.left >= 1)) h += sv("path", { d:ribbonD(g, vert, G.st[hiI], G.en[hiI]), "class":"et-rib-hi" });
  // ends: heat waves, ATP tokens, labels (fade in at the end of a grow)
  var x1 = g.x0 + g.L, ends = "";
  function E(du, v){ return vert ? [v, x1 + du] : [x1 + du, v]; }
  function lines(arr, v, du, bold, a){
    var out = "", n = arr.length;
    arr.forEach(function(s, i){ var q = vert ? [v, x1 + du + i * 15] : [x1 + du, v + (i - (n - 1) / 2) * 15 + 4]; out += txt(q[0], q[1], s, i === 0 ? "et-fl et-lb" + (bold ? " on" : "") : "et-fl", vert ? "middle" : null); });
    return op(a == null ? 1 : a, out);
  }
  var hc = G.c[0], hw = G.w[0];
  [-1, 0, 1].forEach(function(j){ if (hw < 8 && j) return; var p0 = E(5, hc + j * Math.min(hw / 3, 10)); ends += sv("path", { d:waveD(p0[0], p0[1], vert ? 0 : 1, vert ? 1 : 0, 22, 3, 9, o.ph || 0), "class":"et-hw" }); });
  ends += lines(["heat", kjS(V.heat), pct(V.heat)], hc, vert ? 48 : 40, o.hi === "heat");
  var n = Math.max(0, Math.round(V.n)), cols = tokCols(n), rows = Math.ceil(n / cols), ac = G.c[1];
  for (var i = 0; i < n; i++) {
    var c = i % cols, r = Math.floor(i / cols);
    ends += vert ? tokSVG(ac - (cols - 1) * 6 + c * 12, x1 + 10 + r * 12, true) : tokSVG(x1 + 10 + c * 12, ac - (rows - 1) * 6 + r * 12, true);
  }
  ends += lines([n + " ATP", kjS(V.cap), pct(V.cap)], ac, vert ? 16 + rows * 12 + 8 : 10 + cols * 12 + 6, o.hi === "atp");
  if (V.left >= 1) ends += lines(["still in 2 lactate", "≈ " + kjS(V.left), pct(V.left)], G.c[2], vert ? 18 : 10, o.hi === "left", G.lf);
  h += op(seg(k, 0.82, 1), ends);
  return '<svg viewBox="0 0 ' + g.W + " " + g.H + '" class="et-flow' + (vert ? " vert" : "") + '" aria-hidden="true" focusable="false">' + defs + h + "</svg>";
}
function flowSay(p){
  var V = flowVals(p);
  if (p.ferm) return "Fermentation, 2 ATP: " + Math.round(V.cap) + " kilojoules captured, " + Math.round(V.heat) + " released as heat, about " + Math.round(V.left) + " still in 2 lactate; efficiency about " + Math.round(V.cap / GLU * 100) + " percent.";
  return p.atp + " ATP: " + Math.round(V.cap) + " kilojoules captured, " + Math.round(V.heat) + " released as heat, efficiency about " + Math.round(V.cap / GLU * 100) + " percent.";
}

// ---------- ATP–ADP cycle: pool gauge (K-style meter, model units 0–200) and the cycle loop (rates as arrow widths) ----------
function gaugeSVG(pool, trend){
  var cx = 120, cy = 130, R = 82, h = "", a0 = Math.PI, ang = Math.PI - clamp(pool / POOL_MAX, 0, 1) * Math.PI;
  function pt(an, r){ return [cx + r * Math.cos(an), cy - r * Math.sin(an)]; }
  var s = pt(a0, R), e = pt(0, R), f = pt(ang, R);
  h += sv("path", { d:"M" + f1(s[0]) + " " + f1(s[1]) + " A" + R + " " + R + " 0 0 1 " + f1(e[0]) + " " + f1(e[1]), "class":"et-gtr" });
  if (pool > 0.5) h += sv("path", { d:"M" + f1(s[0]) + " " + f1(s[1]) + " A" + R + " " + R + " 0 0 1 " + f1(f[0]) + " " + f1(f[1]), "class":"et-gfill" });
  [0, 50, 100, 150, 200].forEach(function(v){ var an = Math.PI - v / POOL_MAX * Math.PI, p1 = pt(an, R + 9), p2 = pt(an, R + 2), pl = v === 0 ? [cx - R, cy + 18] : v === POOL_MAX ? [cx + R, cy + 18] : pt(an, R + 19); h += sv("line", { x1:p1[0], y1:p1[1], x2:p2[0], y2:p2[1], "class":"et-gtk" }) + txt(pl[0], pl[1] + 4, String(v), "et-gtl", "middle"); });
  var nd = pt(ang, R - 14);
  h += sv("line", { x1:cx, y1:cy, x2:nd[0], y2:nd[1], "class":"et-gnd" }) + sv("circle", { cx:cx, cy:cy, r:6, "class":"et-gpv" });
  h += txt(cx, 14, "ATP pool (model units)", "et-gcap", "middle") + txt(cx, cy + 26, Math.round(pool) + " units · " + trend, "et-gval", "middle");
  return '<svg viewBox="0 0 240 164" aria-hidden="true" focusable="false">' + h + "</svg>";
}
var LOOP = { atp:[64, 112], adp:[256, 112], top:[[86, 88], [120, 40], [200, 40], [234, 88]], bot:[[234, 136], [200, 184], [120, 184], [86, 136]] };
function bez(P, t){ var u = 1 - t; return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; }
function headSVG(P, cls){
  var dx = P[3][0] - P[2][0], dy = P[3][1] - P[2][1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, x = P[3][0] + ux * 4, y = P[3][1] + uy * 4;
  return sv("path", { d:"M" + f1(x - ux * 10 - uy * 6) + " " + f1(y - uy * 10 + ux * 6) + " L" + f1(x) + " " + f1(y) + " L" + f1(x - ux * 10 + uy * 6) + " " + f1(y - uy * 10 - ux * 6), "class":cls });
}
function bezD(P){ return "M" + P[0].join(" ") + " C" + P[1].join(" ") + " " + P[2].join(" ") + " " + P[3].join(" "); }
function loopSVG(o){
  // o = {demand, aer, fer, t (s, for moving tokens), musK 0…1}
  var h = "", sup = o.aer + o.fer, wT = 2 + o.demand / 150 * 9, wB = 2 + sup / 150 * 9;
  h += sv("path", { d:bezD(LOOP.top), "class":"et-lpw", style:"stroke-width:" + f1(wT) });
  h += sv("path", { d:bezD(LOOP.bot), "class":"et-lpr", style:"stroke-width:" + f1(Math.max(wB, 1.5)) + (sup ? "" : ";stroke-dasharray:4 5") });
  h += headSVG(LOOP.top, "et-lph") + headSVG(LOOP.bot, "et-lph et-lphb");
  // muscle glyph at the top of the loop
  var mk = 1 - 0.12 * (o.musK || 0);
  h += '<g transform="translate(160 30) scale(' + f1(mk * 100) / 100 + ' 1)">' + sv("ellipse", { cx:0, cy:0, rx:34, ry:13, "class":"et-mus" }) + [-18, -6, 6, 18].map(function(x){ return sv("line", { x1:x, y1:-9, x2:x, y2:9, "class":"et-musl" }); }).join("") + "</g>";
  h += txt(160, 80, "cell work spends", "et-lt", "middle") + txt(160, 95, o.demand + " ATP-units/s", "et-lv", "middle");
  h += txt(160, 136, "catabolism recharges", "et-lt", "middle") + txt(160, 151, sup + " ATP-units/s", "et-lv", "middle");
  // nodes
  h += sv("circle", { cx:LOOP.atp[0], cy:LOOP.atp[1], r:27, "class":"et-natp" }) + txt(LOOP.atp[0], LOOP.atp[1] + 5, "ATP", "et-nt", "middle");
  h += sv("circle", { cx:LOOP.adp[0], cy:LOOP.adp[1], r:27, "class":"et-nadp" }) + txt(LOOP.adp[0], LOOP.adp[1] - 2, "ADP", "et-nt2", "middle") + txt(LOOP.adp[0], LOOP.adp[1] + 13, "+ Pᵢ", "et-nt2", "middle");
  // glucose inputs
  h += sv("path", { d:"M100 212 L124 186", "class":"et-lin" + (o.aer ? "" : " off") }) + sv("path", { d:"M220 212 L196 186", "class":"et-lin" + (o.fer ? "" : " off") });
  h += txt(92, 228, "aerobic " + o.aer, "et-lg", "middle") + txt(228, 228, "fermentation " + o.fer, "et-lg", "middle");
  // moving tokens while the clock runs
  if (o.t > 0) {
    var nT = Math.max(1, Math.round(o.demand / 30)), nB = Math.round(sup / 30);
    for (var i = 0; i < nT; i++) { var q = bez(LOOP.top, ((o.t * o.demand / 160) + i / nT) % 1); h += tokSVG(q[0], q[1], true); }
    for (var j = 0; j < nB; j++) { var r2 = bez(LOOP.bot, ((o.t * sup / 160) + j / nB) % 1); h += tokSVG(r2[0], r2[1], false); }
  }
  return '<svg viewBox="0 0 320 236" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function glu(v){ return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : "≈ " + MV.num(v, 1); }
function trendOf(net){ return net === 0 ? "Steady" : net < 0 ? "Falling by " + (-net) + " per second" : "Rising by " + net + " per second"; }

// ---------- coupling: ΔG bars (waterfall, from SBI4U 10): reaction, ATP, net. Scale −100 … +60 kJ/mol ----------
function barsHTML(dg, n, nd){
  var lo = -100, hi = 60, atp = -ATP_KJ * nd, net = dg + atp;
  function P(v){ return (clamp(v, lo, hi) - lo) / (hi - lo) * 100; }
  function bar(name, a, b, cls, val){ var x0 = Math.min(P(a), P(b)), w = Math.abs(P(b) - P(a)); return '<div class="et-brow"><span class="et-bl">' + name + '</span><span class="et-bt"><i class="et-bz" style="left:' + f1(P(0)) + '%"></i>' + (w > 0.05 ? '<i class="et-bf ' + cls + '" style="left:' + f1(x0) + "%;width:" + f1(Math.max(w, 0.5)) + '%"></i>' : "") + '</span><span class="et-bv">' + val + "</span></div>"; }
  return '<div class="et-bars">' + bar("Reaction", 0, dg, "et-bpen", sgn(dg)) + bar(n + " ATP", dg, dg + atp, "et-batp", sgn(-ATP_KJ * n)) + bar("Coupled ΔG", 0, net, "et-bnet", sgn(dg - ATP_KJ * n)) +
    '<p class="tiny muted et-bsc">ΔG in kJ/mol. The thin line marks 0: bars to the left of it are downhill.</p></div>';
}
function coupledText(dg, n){
  var net = dg - ATP_KJ * n;
  if (!n) return sgn(dg) + " kJ/mol: " + (net < 0 ? "runs" : "doesn’t run");
  return sgn(dg) + " − " + MV.num(ATP_KJ * n, 1) + " = " + sgn(net) + " kJ/mol: " + (net < 0 ? "runs" : "doesn’t run");
}

// ---------- Explore: Energy flow meter ----------
function explore(host, api){
  var C = api.content, S = api.S;
  var D = { mode:"where", path:"36", act:"rest", aer:50, fer:0, card:"A", n:0 };
  Object.keys(D).forEach(function(k){ if (S[k] === undefined) S[k] = D[k]; });
  if (!byId(C.paths, S.path)) S.path = "36";
  if (!byId(C.acts, S.act)) S.act = "rest";
  if (!byId(C.rxCards, S.card)) S.card = "A";
  S.aer = clamp(Math.round(+S.aer / 10) * 10, 0, 120); S.fer = clamp(Math.round(+S.fer / 10) * 10, 0, 60); S.n = clamp(+S.n | 0, 0, 3);
  var disp = flowVals(byId(C.paths, S.path)), grow = 1, hi = null, ph = 0, nd = S.n, cyc = { t:0, ran:false }, musK = 0;
  var anim = null, runAnim = null, pend = null, what = "", vert = null, readSig = "";
  host.innerHTML = '<div class="pg et-pg"><div class="pg-graph" data-mv="graph"><p class="banner" data-mv="banner" aria-live="polite"></p>' +
    '<div id="et-ga" class="et-flowbox" role="img" aria-label="Energy flow"></div>' +
    '<div id="et-gb" hidden><div class="et-cyc"><div class="et-gauge" id="et-gauge" role="img" aria-label="ATP pool gauge"></div><div class="et-loop" id="et-loop" role="img" aria-label="ATP–ADP cycle"></div></div><p class="et-ctr" id="et-ctr"></p></div>' +
    '<div id="et-gc" hidden></div>' +
    '<p class="et-cap" id="et-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl"><div id="et-mode"></div>' +
      '<div class="et-panel" id="et-ca"><div id="et-path"></div></div>' +
      '<div class="et-panel" id="et-cb"><div id="et-act"></div><div id="et-aer"></div><div id="et-fer"></div><div class="q-actions et-runrow"><button type="button" class="btn primary sm" id="et-run" data-k="etrun">Run 1 minute</button><button type="button" class="btn ghost sm" id="et-reset" data-k="etreset">Reset the clock</button></div></div>' +
      '<div class="et-panel" id="et-cc"><div id="et-card"></div><div id="et-n"></div></div></div>' +
    '<div class="pg-read"><dl class="read et-read" id="et-read" aria-live="polite"></dl><p class="tiny muted et-note"><span class="bio-model">Model</span> ' + C.modelNote + "</p></div></div>";
  var ga = $("#et-ga", host), runBtn = $("#et-run", host);
  var modeR = radios($("#et-mode", host), { label:"Mode", options:[{ id:"where", t:"Where it goes" }, { id:"cycle", t:"ATP–ADP cycle" }, { id:"couple", t:"Coupling" }], value:S.mode, onChange:function(v){ change({ mode:v }); } });
  var pathR = radios($("#et-path", host), { label:"Pathway", aria:"Pathway", cls:"chips et-pathc", options:C.paths.map(function(p){ return { id:p.id, t:"<b>" + p.t + "</b><small>" + p.sub + "</small>" }; }), value:S.path, onChange:function(v){ change({ path:v }); } });
  var actR = radios($("#et-act", host), { label:"Activity", options:C.acts.map(function(a){ return { id:a.id, t:a.t + " <small>(" + a.demand + ")</small>", aria:a.t + ", demand " + a.demand + " ATP-units per second" }; }), value:S.act, onChange:function(v){ change({ act:v }); } });
  var aerS = slider($("#et-aer", host), { id:"et-aers", label:"Aerobic supply", min:0, max:120, step:10, value:S.aer, short:function(v){ return v + "/s"; }, unit:function(v){ return v + " ATP-units per second (maximum 120)"; }, onChange:function(v){ change({ aer:v }); } });
  var ferS = slider($("#et-fer", host), { id:"et-fers", label:"Fermentation supply", min:0, max:60, step:10, value:S.fer, short:function(v){ return v + "/s"; }, unit:function(v){ return v + " ATP-units per second"; }, onChange:function(v){ change({ fer:v }); } });
  var cardR = radios($("#et-card", host), { label:"Reaction card", aria:"Reaction card", cls:"chips et-cardc", options:C.rxCards.map(function(c){ return { id:c.id, t:"<b>" + c.id + "</b> " + c.t + " <span class=\"et-dg\">(" + sgn(c.dg) + " kJ/mol)</span>" }; }), value:S.card, onChange:function(v){ change({ card:v }); } });
  var nSt = stepper($("#et-n", host), { id:"et-ns", label:"ATP hydrolyses coupled", min:0, max:3, value:S.n, unit:function(v){ return String(v); }, onChange:function(v){ change({ n:v }); } });

  function path(){ return byId(C.paths, S.path); }
  function demand(){ return byId(C.acts, S.act).demand; }
  function net(){ return S.aer + S.fer - demand(); }
  function card(){ return byId(C.rxCards, S.card); }
  function poolAt(t){ return clamp(POOL0 + net() * t, 0, POOL_MAX); }
  // ---- painting ----
  function paintFlow(){
    if (S.mode !== "where") return;
    var w = ga.clientWidth; if (!w) return;
    vert = w < 470;
    ga.innerHTML = flowSVG(disp, { vert:vert, grow:grow, hi:hi, id:"ex", ph:ph });
    ga.setAttribute("aria-label", "Energy flow, bands drawn to scale. " + flowSay(path()));
  }
  function paintCycle(){
    if (S.mode !== "cycle") return;
    var n = net(), pool = poolAt(cyc.t), tr = cyc.t > 0 && (pool <= 0 || pool >= POOL_MAX) ? (pool <= 0 ? "empty" : "full") : trendOf(n).toLowerCase();
    $("#et-gauge", host).innerHTML = gaugeSVG(pool, tr);
    $("#et-gauge", host).setAttribute("aria-label", "ATP pool gauge: " + Math.round(pool) + " of " + POOL_MAX + " model units, " + tr + ".");
    $("#et-loop", host).innerHTML = loopSVG({ demand:demand(), aer:S.aer, fer:S.fer, t:cyc.t, musK:musK });
    $("#et-loop", host).setAttribute("aria-label", "ATP–ADP cycle: cell work spends " + demand() + " ATP-units per second; catabolism recharges " + (S.aer + S.fer) + " (aerobic " + S.aer + ", fermentation " + S.fer + ").");
    $("#et-ctr", host).innerHTML = "<span>Time: <b>" + Math.round(cyc.t) + " s</b></span><span>ATP-units remade: <b>" + MV.num(Math.round((S.aer + S.fer) * cyc.t)) + "</b></span>";
  }
  function paintCouple(){
    if (S.mode !== "couple") return;
    var c = card(), ok = c.dg - ATP_KJ * S.n < 0;
    $("#et-gc", host).innerHTML = '<div class="et-couple"><p class="et-cc"><b>' + c.id + "</b> " + c.t + ": ΔG = " + sgn(c.dg) + " kJ/mol, coupled with " + S.n + " ATP hydrolys" + (S.n === 1 ? "is" : "es") + "</p>" +
      '<div role="img" aria-label="' + MV.esc("ΔG bars: reaction " + sgn(c.dg) + ", " + S.n + " ATP " + sgn(-ATP_KJ * S.n) + ", coupled " + sgn(c.dg - ATP_KJ * S.n) + " kilojoules per mole") + '">' + barsHTML(c.dg, S.n, nd) + "</div>" +
      '<p class="et-verdict ' + (ok ? "go" : "no") + '">' + (ok ? "✓ " : "✗ ") + coupledText(c.dg, S.n) + "</p></div>";
  }
  function rows(){
    var p = path(), V = flowVals(p), R = [];
    if (S.mode === "where") {
      R.push(["Energy available", p.ferm ? "2870 kJ in glucose; 200 kJ released by fermentation" : "2870 kJ per mole of glucose"]);
      R.push(["Captured in ATP", p.atp + " × 30.5 = " + kjS(V.cap)]);
      R.push(["Released as heat", (p.ferm ? "200 − " + Math.round(V.cap) : "2870 − " + Math.round(V.cap)) + " = " + kjS(V.heat)]);
      R.push(["Still in products", p.ferm ? "≈ 2670 kJ in 2 lactate" : "0 kJ (CO₂ and H₂O hold no usable energy)"]);
      R.push(["Efficiency", Math.round(V.cap) + " ÷ 2870 ≈ " + Math.round(V.cap / GLU * 100) + "%"]);
    } else if (S.mode === "cycle") {
      var a = byId(C.acts, S.act);
      R.push(["Demand (cell work)", a.t + ": " + a.demand + " ATP-units per second"]);
      R.push(["Supply (recharging)", "aerobic " + S.aer + " + fermentation " + S.fer + " = " + (S.aer + S.fer) + " ATP-units per second"]);
      R.push(["ATP pool", trendOf(net())]);
      R.push(["Glucose used per second", glu(S.aer / 36) + " aerobic + " + glu(S.fer / 2) + " fermented"]);
    } else {
      var c = card();
      R.push(["Reaction", "<b>" + c.id + "</b> " + c.t + ": " + sgn(c.dg) + " kJ/mol (uphill)"]);
      R.push(["ATP coupled", S.n ? S.n + " × (−30.5) = " + sgn(-ATP_KJ * S.n) + " kJ/mol" : "none"]);
      R.push(["Coupled ΔG", coupledText(c.dg, S.n)]);
    }
    return R;
  }
  function paintRead(){ var h = MV.readoutHTML(rows()); if (h !== readSig) { readSig = h; $("#et-read", host).innerHTML = h; } }
  function capDefault(){
    if (S.mode === "where") return path().ferm ? "Fermentation leaves most of the energy behind: ≈ 2670 kJ is still in the lactate. Only 200 kJ is released at all." : "Bands are drawn to scale. Most of the energy becomes heat; ATP captures " + pct(flowVals(path()).cap) + ".";
    if (S.mode === "cycle") return "ATP is recycled constantly. Set the supply, then press Run 1 minute to watch the small pool.";
    return "Add ATP hydrolyses until the coupled ΔG is negative. Then the uphill reaction runs.";
  }
  function paintCap(){ $("#et-cap", host).innerHTML = what || capDefault(); }
  function sync(){
    modeR.set(S.mode); pathR.set(S.path); actR.set(S.act); aerS.set(S.aer); ferS.set(S.fer); cardR.set(S.card); nSt.set(S.n);
    var m = S.mode;
    ga.hidden = m !== "where"; $("#et-gb", host).hidden = m !== "cycle"; $("#et-gc", host).hidden = m !== "couple";
    $("#et-ca", host).hidden = m !== "where"; $("#et-cb", host).hidden = m !== "cycle"; $("#et-cc", host).hidden = m !== "couple";
  }
  function paintAll(){ sync(); paintFlow(); paintCycle(); paintCouple(); paintRead(); paintCap(); }
  function stop(){
    if (anim) { anim(); anim = null; }
    if (runAnim) { runAnim(); runAnim = null; }
    runBtn.disabled = false; musK = 0;
    if (pend) { var d = pend; pend = null; d(); }
  }
  function change(patch){
    stop();
    var oldPath = S.path, oldN = S.n;
    Object.keys(patch).forEach(function(k){ S[k] = patch[k]; });
    if (patch.aer !== undefined || patch.fer !== undefined || patch.act !== undefined) { cyc.t = 0; cyc.ran = false; }
    grow = 1; hi = null; what = ""; api.banner("", "");
    api.save(); paintAll(); MV.changed();
    if (patch.path && patch.path !== oldPath) tweenFlow(flowVals(byId(C.paths, oldPath)), flowVals(path()), 900, null);
    else disp = flowVals(path());
    if (patch.n !== undefined && patch.n !== oldN) tweenN(oldN, S.n, 600, null);
    else nd = S.n;
    if (patch.path || patch.mode) paintFlow();
  }
  function tweenFlow(a, b, dur, done){
    if (anim) { anim(); anim = null; }
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(t){ disp = mixVals(a, b, t); paintFlow(); }, done:function(){ anim = null; disp = b; paintFlow(); if (done) done(); } });
  }
  function tweenN(a, b, dur, done){
    if (anim) { anim(); anim = null; }
    anim = MV.tween({ dur:dur, ease:MV.ease, step:function(t){ nd = lerp(a, b, t); paintCouple(); }, done:function(){ anim = null; nd = b; paintCouple(); if (done) done(); } });
  }
  function runMsg(){
    var n = net(), sup = S.aer + S.fer;
    if (n === 0) return "Steady: the pool held while " + MV.num(sup * 60) + " ATP-units were remade this minute.";
    if (n < 0) return "The pool fell by " + (-n) + " per second and ran out after " + Math.round(POOL0 / -n) + " s: the muscle can’t keep this pace.";
    return "The pool rose by " + n + " per second and was full after " + Math.round((POOL_MAX - POOL0) / n) + " s: extra glucose is being burned.";
  }
  function runMinute(done){
    stop();
    cyc.t = 0; cyc.ran = false; runBtn.disabled = true; what = "Running…"; paintCap(); api.banner("", "");
    runAnim = MV.tween({ dur:4200, ease:lin, step:function(k){ cyc.t = 60 * k; musK = 0.5 + 0.5 * Math.sin(cyc.t * 3); paintCycle(); },
      done:function(){ runAnim = null; cyc.t = 60; cyc.ran = true; musK = 0; runBtn.disabled = false; what = runMsg(); paintCycle(); paintCap(); if (done) done(); } });
  }
  runBtn.addEventListener("click", function(){ if (!runBtn.disabled) runMinute(null); });
  $("#et-reset", host).addEventListener("click", function(){ stop(); cyc.t = 0; cyc.ran = false; what = ""; paintCycle(); paintCap(); });
  if (window.ResizeObserver) new ResizeObserver(function(){ var w = ga.clientWidth; if (w && (w < 470) !== vert) paintFlow(); }).observe(ga);
  paintAll();
  EXF = { show:function(on){ if (on) paintFlow(); } };

  function chal(id){
    var c = byId(C.challenges, id), N = c.named || {};
    if (id === "tc1") {
      if (S.mode !== "where") return { ok:false, msg:N.mode };
      if (S.path === "32") return { ok:true };
      return { ok:false, msg:flowVals(path()).cap > 1000 ? N.over : N.under };
    }
    if (id === "tc2") {
      if (S.mode !== "couple") return { ok:false, msg:N.mode };
      if (S.card !== "C") return { ok:false, msg:N.card };
      if (S.n === 2) return { ok:true };
      return { ok:false, msg:S.n === 1 ? N.n1 : S.n === 3 ? N.n3 : N.n0 };
    }
    if (id === "tc3") {
      if (S.mode !== "cycle") return { ok:false, msg:N.mode };
      if (S.act !== "sprint") return { ok:false, msg:N.act };
      var n = net();
      if (n === 0 && S.aer === 120) return { ok:true };
      if (n < 0) return { ok:false, msg:N.falls.replace("{n}", String(-n)) };
      if (n > 0) return { ok:false, msg:N.rises };
      return { ok:false, msg:N.steady };
    }
    return { ok:false };
  }
  return {
    predict:{
      start:function(p){
        stop(); var s = p.start;
        S.mode = s.mode;
        if (s.path) S.path = s.path;
        if (s.act) { S.act = s.act; S.aer = s.aer; S.fer = s.fer; }
        cyc.t = 0; cyc.ran = false; hi = null; what = ""; disp = flowVals(path());
        grow = p.act === "atp" ? 0 : 1;
        api.save(); paintAll(); MV.changed();
      },
      run:function(p, done){
        pend = null;
        function fin(){ var d = pend; pend = null; if (d) MV.wait(400, d); }
        if (p.act === "run") { runMinute(function(){ what = runMsg(); paintCap(); fin(); }); pend = done; return; }
        pend = done;
        if (p.act === "atp") {
          anim = MV.tween({ dur:1900, ease:lin, step:function(t){ grow = t; paintFlow(); }, done:function(){ anim = null; grow = 1; hi = "atp"; paintFlow(); what = "1098 of 2870 kJ (≈ 38%) is captured in 36 ATP."; paintCap(); fin(); } });
          return;
        }
        if (p.act === "heat") {
          anim = MV.tween({ dur:1800, ease:lin, step:function(t){ hi = "heat"; ph = -t * 12; paintFlow(); }, done:function(){ anim = null; hi = "heat"; ph = 0; paintFlow(); what = "The heat stream: 1772 kJ (≈ 62%) is released as heat."; paintCap(); fin(); } });
          return;
        }
        if (p.act === "ferm") {
          var a = flowVals(path()); S.path = "ferm"; api.save(); sync(); paintRead(); MV.changed();
          tweenFlow(a, flowVals(path()), 2100, function(){ hi = "left"; paintFlow(); what = "≈ 2670 kJ is still in 2 lactate. Only 200 kJ was released: 61 kJ into ATP, 139 kJ as heat."; paintCap(); fin(); });
          return;
        }
        fin();
      }
    },
    challenge:chal
  };
}
var EXF = null;

// ---------- Part 3: Energy beyond the cell (stations: body heat; trophic pyramid with number entry in a "Check it with data" panel;
// engines vs cells) ----------
function personSVG(){
  var h = sv("circle", { cx:60, cy:30, r:15, "class":"et-pp" }) + sv("path", { d:"M38 118 L38 70 C38 56 46 50 60 50 C74 50 82 56 82 70 L82 118 M46 118 L46 160 M74 118 L74 160 M38 72 L28 112 M82 72 L92 112", "class":"et-pl" });
  [[20, 60], [100, 60], [16, 104], [104, 104]].forEach(function(p, i){ h += sv("path", { d:waveD(p[0], p[1], i % 2 ? 0.55 : -0.55, -0.83, 22, 2.6, 8, 0), "class":"et-hw" }); });
  h += txt(60, 182, "≈ 100 W of heat", "et-pt", "middle");
  return '<svg viewBox="0 0 120 190" aria-hidden="true" focusable="false">' + h + "</svg>";
}
function chipQ(el, key, chips, aria, S, save){
  function paint(){
    var pick = S.ch[key], h = '<div class="chips et-chips" role="group" aria-label="' + MV.esc(aria) + '">' + chips.map(function(c, i){ return '<button type="button" class="chip' + (pick === i ? " on" : "") + '" aria-pressed="' + (pick === i) + '" data-ci="' + i + '" data-k="' + key + i + '">' + c.t + "</button>"; }).join("") + "</div>";
    if (pick != null && chips[pick]) { var c = chips[pick], good = MV.ok(c); h += MV.fbHTML(good ? "good" : "bad", "<strong>" + (good ? "✓ Correct." : "✗ Not quite.") + "</strong> " + c.fb + (good ? "" : " Try another answer.")); }
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  el.addEventListener("click", function(e){ var b = e.target.closest("[data-ci]"); if (!b) return; S.ch[key] = +b.dataset.ci; save(); paint(); });
  paint();
}
function parseVal(raw){
  var s = String(raw == null ? "" : raw).replace(/(\d)[\s  ](?=\d{3}\b)/g, "$1").replace(/,(?=\d{3}\b)/g, "").replace(/,/g, ".").replace(/[−–]/g, "-").replace(/[^0-9.\-\/]+/g, " ").trim().split(/\s+/)[0] || "";
  var v = s ? MV.parseNum(s) : null; return v && v.length === 1 && isFinite(v[0]) ? v[0] : null;
}
function part3(host, api){
  var P = api.content, S = api.S; S.ch = S.ch || {}; S.lv = S.lv || {};
  var L = P.st2.levels, msgs = {};
  host.innerHTML = '<div class="et-p3">' +
    '<section class="et-st" aria-labelledby="et-h1"><h3 id="et-h1">' + P.st1.title + '</h3><div class="et-row"><div class="et-person" role="img" aria-label="A person at rest, with heat waves rising from the body: about 100 watts.">' + personSVG() + "</div>" +
      '<div class="et-side"><p>' + P.st1.text + '</p><div id="et-c1"></div><p class="tiny muted">' + P.st1.link + "</p></div></div></section>" +
    '<section class="et-st" aria-labelledby="et-h2"><h3 id="et-h2">' + P.st2.title + '</h3><details class="alg et-data" open><summary>Check it with data</summary>' +
      '<p class="how">' + P.st2.how + '</p><div class="et-pyr" id="et-pyr"></div><p class="tiny muted et-pyrn">Pyramid not to scale.</p>' +
      "<p>" + P.st2.text + '</p><p class="et-qq"><strong>' + P.st2.question + '</strong></p><div id="et-c2"></div></details></section>' +
    '<section class="et-st" aria-labelledby="et-h3"><h3 id="et-h3">' + P.st3.title + '</h3><div class="et-eff" id="et-eff"></div><p class="et-qq"><strong>' + P.st3.question + '</strong></p><div id="et-c3"></div></section></div>';
  function save(){ api.save(); }
  chipQ($("#et-c1", host), "c1", P.st1.chips, "Where does the body heat come from?", S, save);
  chipQ($("#et-c2", host), "c2", P.st2.chips, P.st2.question, S, save);
  chipQ($("#et-c3", host), "c3", P.st3.chips, P.st3.question, S, save);
  // ---- Station 2: the pyramid, filled from the bottom up ----
  var pyr = $("#et-pyr", host);
  function val(i){ return i === 0 ? L[0].kj : MV.ans(L[i]); }
  function lst(id){ return S.lv[id] || (S.lv[id] = { v:"", done:false, tries:0 }); }
  function nextI(){ for (var i = 1; i < L.length; i++) if (!lst(L[i].id).done) return i; return L.length; }
  function paintPyr(){
    var nx = nextI(), h = "";
    for (var i = L.length - 1; i >= 0; i--) {
      var lv = L[i], x = i ? lst(lv.id) : { done:true }, w = 100 - i * 22, body;
      if (x.done) body = '<span class="et-lvv">' + MV.num(val(i)) + " kJ</span>";
      else if (i === nx) body = '<span class="et-lvin"><label class="vh" for="et-lv' + i + '">' + lv.t + ' energy in kJ</label><input class="numin short" id="et-lv' + i + '" data-lv="' + i + '" type="text" inputmode="decimal" autocomplete="off" value="' + MV.esc(x.v || "") + '"><span>kJ</span><button type="button" class="btn primary sm" data-lchk="' + i + '" data-k="lchk' + i + '">Check</button></span>';
      else body = '<span class="et-lvq">? kJ</span>';
      if (i && msgs[i]) h += MV.fbHTML(msgs[i].k, msgs[i].h);
      h += '<div class="et-lvl' + (x.done ? " done" : i === nx ? " cur" : "") + '"><div class="et-lvb" style="width:' + w + '%"><span class="et-lvn">' + lv.t + "</span>" + body + "</div></div>";
      if (i) h += '<div class="et-lva"><span aria-hidden="true">↑</span> ≈ 10% passes up <span class="et-lvh"><svg viewBox="0 0 34 14" aria-hidden="true"><path d="' + waveD(2, 7, 1, 0, 22, 2.4, 8, 0) + '" class="et-hw"/></svg>the rest: heat</span></div>';
    }
    if (nx >= L.length) h += MV.fbHTML("good", "<strong>✓ All levels filled.</strong> 20 000 → 2000 → 200 → 20 kJ: the top carnivores get about 0.1% of what the plants captured.".replace("20 000", MV.num(20000)));
    MV.keepFocus(pyr, function(){ pyr.innerHTML = h; });
  }
  pyr.addEventListener("input", function(e){ var i = e.target.dataset && e.target.dataset.lv; if (i == null) return; lst(L[+i].id).v = e.target.value; save(); });
  pyr.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lv != null) { var b = pyr.querySelector('[data-lchk="' + e.target.dataset.lv + '"]'); if (b) b.click(); } });
  pyr.addEventListener("click", function(e){
    var b = e.target.closest("[data-lchk]"); if (!b) return;
    var i = +b.dataset.lchk, x = lst(L[i].id), v = parseVal(x.v), below = val(i - 1), want = val(i);
    if (v == null) { msgs[i] = { k:"bad", h:"Enter a number of kilojoules, such as 500." }; paintPyr(); return; }
    if (Math.abs(v - want) < 1e-6) { x.done = true; msgs[i] = null; if (i + 1 < L.length) msgs[i + 1] = null; save(); paintPyr(); var nb = pyr.querySelector("[data-lv]"); if (nb) nb.focus({ preventScroll:true }); return; }
    x.tries++; save();
    msgs[i] = { k:"bad", h:"<strong>✗ Not quite.</strong> " + (Math.abs(v - below * 0.9) < 1e-6 ? P.st2.wrongMore : P.st2.wrongOther) };
    paintPyr(); MV.focusFb(pyr);
  });
  paintPyr();
  // ---- Station 3: efficiency bars ----
  $("#et-eff", host).innerHTML = '<div class="et-effg" role="table" aria-label="Efficiency of cells and engines">' + P.st3.rows.map(function(r){
    var solid = r.lo, range = r.hi - r.lo;
    return '<div class="et-er" role="row"><span class="et-el" role="rowheader">' + r.t + '</span><span class="et-et" role="cell" aria-hidden="true"><i class="et-ef" style="width:' + solid + '%"></i>' + (range ? '<i class="et-efr" style="left:' + solid + "%;width:" + range + '%"></i>' : "") + '</span><span class="et-ev" role="cell">' + r.v + "</span></div>";
  }).join("") + '<p class="tiny muted et-escale">Bars show the share of the fuel’s energy that ends up as useful work (out of 100%). The rest is released as heat.</p></div>';
  return {};
}

// ---------- Practice 2: Energy arithmetic (custom N4: plain numbers, signed ΔG and a ratio; adapted from SBI4U 10's calc) ----------
function parseMixed(t){
  t = String(t).replace(/⅓/g, " 1/3").replace(/⅔/g, " 2/3").replace(/½/g, " 1/2").replace(/¼/g, " 1/4").replace(/¾/g, " 3/4").trim();
  var m = /^(\d+(?:\.\d+)?)\s+(\d+)\s*\/\s*(\d+)$/.exec(t);
  if (m) return +m[1] + (+m[2]) / (+m[3]);
  return parseVal(t);
}
function parseRatio(raw){
  var s = String(raw == null ? "" : raw).replace(/[−–]/g, "-").trim(); if (!s) return null;
  var parts = s.split(/:|∶|\bto\b/i); if (parts.length > 2) return null;
  var vals = parts.map(parseMixed); if (vals.some(function(v){ return v == null; })) return null;
  if (vals.length === 1) return vals[0];
  return vals[1] ? vals[0] / vals[1] : null;
}
function hasSign(raw){ return /^\s*[+\-−–]/.test(String(raw == null ? "" : raw)); }
function arith(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {}, SIGN = "Include the sign: + for uphill (endergonic), − for downhill (exergonic).";
  function ist(id){ return S.items[id] || (S.items[id] = { val:"", tries:0, hint:0, solved:false, first:null }); }
  host.innerHTML = '<p class="how">Type your answer, then press Check. Write ΔG values with a + or − sign; write a ratio like 9 : 2.</p>' + MV.usesHTML(a.use) + a.items.map(function(it){ return '<div class="q" data-li="' + it.id + '"></div>'; }).join("");
  function near(v, t, tol){ return Math.abs(v - t) <= (tol || 1e-6 * Math.max(1, Math.abs(t))); }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), el = host.querySelector('[data-li="' + it.id + '"]'), id = "et-li-" + it.id;
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    h += '<div class="numrow"><label for="' + id + '">' + (it.label ? it.label + ":" : "Your answer:") + '</label><input class="numin" id="' + id + '" data-lin="' + it.id + '" type="text" inputmode="' + (it.kind === "num" ? "decimal" : "text") + '" autocomplete="off" value="' + MV.esc(x.val) + '"' + (x.solved ? " disabled" : "") + ">" + (it.kind !== "ratio" && it.unit ? '<span class="et-unit">' + it.unit + "</span>" : "") + "</div>";
    if (!x.solved) h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>' + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + MV.hintsHTML(it.hints, x.hint);
    if (x.solved) h += '<div class="fb good" role="status"><p><strong>✓ Correct: ' + it.display + ".</strong> " + (it.why || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>') + "</p></div>";
    else if (msgs[it.id]) h += '<div class="fb bad" role="status"><p>' + msgs[it.id] + "</p></div>";
    MV.keepFocus(el, function(){ el.innerHTML = h; });
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.lin; if (!id) return; ist(id).val = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.lin) { var b = host.querySelector('[data-k="' + e.target.dataset.lin + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var el = b.closest("[data-li]"); if (!el) return;
    var it = byId(a.items, el.dataset.li), x = ist(it.id), ans = MV.ans(it), v, ok;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    if (b.dataset.act !== "check") return;
    v = it.kind === "ratio" ? parseRatio(x.val) : parseVal(x.val);
    if (v == null) { msgs[it.id] = it.kind === "ratio" ? "Enter a ratio such as 9 : 2, or a single number." : it.kind === "dg" ? "Enter a ΔG value with its sign, such as +12 or −7.5." : "Enter a number, such as 61 or 2.5."; paintItem(it); return; }
    if (it.kind === "dg" && v !== 0 && !hasSign(x.val)) { msgs[it.id] = SIGN; paintItem(it); return; }
    ok = near(v, ans, it.tol);
    if (!ok) {
      var w = (it.wrong || []).filter(function(q){ return near(v, q.match, it.tol || 0.06); })[0];
      var fb = w ? w.fb : it.unit === "%" && near(v, ans / 100, 0.002) ? "That’s the fraction captured. Multiply by 100 for the percentage." : it.general || "Check your working and try again.";
      msgs[it.id] = "<strong>✗ Not quite.</strong> " + fb + (/Try again\.?$/.test(fb) ? "" : " Try again.");
      x.tries++;
    } else { msgs[it.id] = null; x.solved = true; x.first = x.tries === 0 && x.hint < 3; }
    api.save(); paintItem(it); MV.focusFb(el);
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Fuel a sprint ----------
var task = (function(){
  var api = null, T = null;
  function st(){ var s = api.S; if (s.a == null) s.a = 1; if (s.f == null) s.f = 0; return s; }
  function read(){ if (!api) return { a:1, f:0 }; var s = st(); return { a:+s.a, f:+s.f }; }
  function parse(k){ var m = /a(\d+)-f(\d+)/.exec(k) || [0, 0, 0]; return { a:+m[1], f:+m[2] }; }
  function atpOf(d){ return 36 * d.a + 2 * d.f; }
  function text(d){ return "a = " + d.a + ", f = " + d.f + " (" + atpOf(d) + " ATP)"; }
  function preview(){
    var d = read(), el = $("#et-tg"); if (!el) return;
    var atp = atpOf(d), o2 = 6 * d.a, g = d.a + d.f, heat = 1772 * d.a + 139 * d.f, left = 2670 * d.f;
    function bar(lab, parts, max, mark, markLab, val){
      return '<div class="et-grow"><span class="et-gl">' + lab + '</span><span class="et-gt2">' + parts.map(function(p){ return '<i class="' + p[1] + '" style="width:' + f1(p[0] / max * 100) + '%"></i>'; }).join("") +
        '<b class="et-gm" style="left:' + f1(mark / max * 100) + '%"></b></span><b class="et-gv">' + val + '</b><span class="et-gml">' + markLab + "</span></div>";
    }
    el.innerHTML = '<div class="et-tbars" role="img" aria-label="' + MV.esc("ATP made " + atp + " (need at least 80); glucose used " + g + " moles (limit 6); O₂ used " + o2 + " moles (limit 18).") + '">' +
      bar("ATP made", [[36 * d.a, "et-ga1"], [2 * d.f, "et-ga2"]], 170, 80, "need ≥ 80", atp) +
      bar("Glucose", [[d.a, "et-gg1"], [d.f, "et-gg2"]], 14, 6, "limit 6", g) +
      bar("O₂ used", [[o2, "et-go"]], 26, 18, "limit 18", o2) +
      '<p class="tiny et-glg"><span><span class="et-sw et-ga1"></span> aerobic</span><span><span class="et-sw et-ga2"></span> fermented</span><span>tick marks show each limit</span></p></div>' +
      '<dl class="read et-tread">' + MV.readoutHTML([["ATP made", "36 × " + d.a + " + 2 × " + d.f + " = " + atp], ["O₂ used", "6 × " + d.a + " = " + o2 + (o2 === 1 ? " mole" : " moles")], ["Glucose used", d.a + " + " + d.f + " = " + g + (g === 1 ? " mole" : " moles")],
        ["Heat released", "≈ " + kjS(heat)], ["Energy left in lactate", d.f ? "≈ " + kjS(left) + " (in " + 2 * d.f + " lactate)" : "0 kJ (no fermentation)"]]) + "</dl>";
  }
  return {
    render:function(inp, pv, a){
      api = a; T = a.content; var s = st();
      inp.innerHTML = '<div class="et-tin"><div id="et-tsa"></div><div id="et-tsf"></div></div>';
      function upd(){ a.save(); preview(); a.update(); }
      stepper($("#et-tsa"), { id:"et-ta", label:T.inputs.a, min:0, max:4, value:s.a, unit:function(v){ return String(v); }, onChange:function(v){ s.a = v; upd(); } });
      stepper($("#et-tsf"), { id:"et-tf", label:T.inputs.f, min:0, max:10, value:s.f, unit:function(v){ return String(v); }, onChange:function(v){ s.f = v; upd(); } });
      pv.innerHTML = '<div class="et-tpv"><h4>Your sprint fuel</h4><div id="et-tg" aria-live="polite"></div><p class="tiny muted"><span class="bio-model">Model</span> ' + T.previewNote + "</p></div>";
      preview();
    },
    read:read,
    valid:function(){ return true; },
    checks:function(d){ return [atpOf(d) >= 80, d.a + d.f <= 6, 6 * d.a <= 18, d.f >= 1]; },
    tips:function(d, r){
      var out = [];
      if (!r[0]) { out.push(T.tips[0]); if (d.a <= 2) out.push(T.tips[1]); }
      if (!r[2] && out.indexOf(T.tips[1]) < 0) out.push(T.tips[1]);
      if (!r[1]) out.push(T.tips[2]);
      if (!r[3]) out.push(T.tip4);
      return out;
    },
    key:function(d){ return "a" + d.a + "-f" + d.f; },
    label:function(k){ return MV.esc(text(parse(k))); },
    text:function(k){ return text(parse(k)); }
  };
})();

// ---------- hero: the 2870 kJ block splits (Sankey) into a heat stream rising off the top and an ATP stream into 36 tokens;
// tokens power a muscle (→ ADP + Pᵢ) and are recharged from the glucose stream. Reduced motion: final frame. ----------
var HB = { x0:14, x1:78, y0:150, HT:140 };
function heroSVG(o){
  // o = {grow 0…1, lab 0…1, cyc 0…1 (cycle path shown), toks:[{p, leg:"a"|"b"}], musK, ph}
  var s = HB.HT / GLU, wH = 1772 * s, h = "", yH = HB.y0 + wH, yB = HB.y0 + HB.HT, gx = HB.x1 + (340 - HB.x1) * o.grow, heatTop = 250 - 232 * o.grow;
  // reveal: a sweep to the right (both bands), and for the heat band a sweep upward as well (nested clips = intersection)
  var defs = '<defs><pattern id="et-wv-hero" width="14" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 5 Q3.5 0.5 7 5 T14 5" class="et-wvp"/></pattern>' +
    '<clipPath id="et-hc1"><rect x="0" y="0" width="' + f1(gx) + '" height="350"/></clipPath><clipPath id="et-hc2"><rect x="0" y="' + f1(heatTop) + '" width="460" height="350"/></clipPath></defs>';
  var heatD = "M" + HB.x1 + " " + HB.y0 + " C130 " + HB.y0 + " 150 125 150 70 L236.4 70 C236.4 170 170 " + f1(yH) + " " + HB.x1 + " " + f1(yH) + " Z";
  var atpD = "M" + HB.x1 + " " + f1(yH) + " C160 " + f1(yH) + " 160 253.2 240 253.2 L240 306.8 C160 306.8 160 " + f1(yB) + " " + HB.x1 + " " + f1(yB) + " Z";
  h += sv("rect", { x:HB.x0, y:HB.y0, width:HB.x1 - HB.x0, height:HB.HT, rx:6, "class":"et-glu" });
  h += txt((HB.x0 + HB.x1) / 2, HB.y0 + 62, "glucose", "et-gt et-gts", "middle") + txt((HB.x0 + HB.x1) / 2, HB.y0 + 80, "2870 kJ", "et-gt", "middle");
  h += '<g clip-path="url(#et-hc1)">' + sv("path", { d:atpD, "class":"et-rib-atp" }) + '<g clip-path="url(#et-hc2)">' + sv("path", { d:heatD, "class":"et-rib-heat" }) + sv("path", { d:heatD, fill:"url(#et-wv-hero)", "class":"et-rib-wave" }) + "</g></g>";
  // labels, heat waves, tokens
  var la = o.lab, lab = "";
  [165, 193, 221].forEach(function(x){ lab += sv("path", { d:waveD(x, 64, 0, -1, 28, 3, 9, o.ph || 0), "class":"et-hw" }); });
  lab += txt(246, 44, "heat", "et-fl et-lb") + txt(246, 60, "1772 kJ", "et-fl");
  lab += txt(280, 224, "36 ATP", "et-fl et-lb", "middle") + txt(280, 239, "1098 kJ", "et-fl", "middle");
  h += op(la, lab);
  var out = (o.toks || []).length, stack = "";
  for (var i = 0; i < 36 - out; i++) stack += tokSVG(250 + (i % 6) * 12, 250 + Math.floor(i / 6) * 12, true);
  h += op(seg(o.grow, 0.7, 1), stack);
  // muscle + cycle path
  if (o.cyc > 0) {
    var mk = 1 - 0.14 * (o.musK || 0), cyc = "";
    cyc += '<g transform="translate(384 270) scale(' + f1(mk * 100) / 100 + ' 1)">' + sv("ellipse", { cx:0, cy:0, rx:40, ry:17, "class":"et-mus" }) + [-22, -8, 8, 22].map(function(x){ return sv("line", { x1:x, y1:-12, x2:x, y2:12, "class":"et-musl" }); }).join("") + "</g>";
    cyc += txt(384, 238, "muscle work", "et-fl et-lb", "middle") + txt(384, 253, "ATP → ADP + Pᵢ", "et-fl", "middle");
    cyc += sv("path", { d:"M320 270 L338 270", "class":"et-cyp" }) + sv("path", { d:"M332 264 L340 270 L332 276", "class":"et-cyh" });
    cyc += sv("path", { d:"M384 290 L384 328 L96 328 L96 304", "class":"et-cyp et-cyd" }) + sv("path", { d:"M90 312 L96 302 L102 312", "class":"et-cyh" });
    cyc += txt(240, 344, "recharged from the glucose stream", "et-fl", "middle");
    h += op(o.cyc, cyc);
    (o.toks || []).forEach(function(t){
      var q, full;
      if (t.leg === "a") { q = polyAt([[318, 270], [352, 272]], t.p); full = true; }
      else { q = polyAt([[384, 292], [384, 328], [96, 328], [96, 296], [180, 292], [244, 292]], t.p); full = t.p > 0.707; }
      h += tokSVG(q[0], q[1], full);
    });
  }
  return '<svg viewBox="0 0 460 350" class="et-hsvg" aria-hidden="true" focusable="false">' + defs + h + "</svg>";
}
function hero(f){
  var box = $("#et-hero"); if (!box) return;
  var cap = f && f.cap;
  var CAPS = ["A mole of glucose holds about 2870 kJ.", "Oxidizing it splits the energy: some into ATP, the rest released as heat.", "About 1098 kJ is captured in 36 ATP; about 1772 kJ leaves as heat.",
    "ATP powers the muscle and becomes ADP + Pᵢ…", "…and is recharged from the glucose stream: the ATP–ADP cycle.", "2870 kJ = 1098 kJ in ATP + 1772 kJ of heat. ATP is spent and remade constantly."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function draw(o){ box.innerHTML = heroSVG(o); }
  var FINAL = { grow:1, lab:1, cyc:1, toks:[{ leg:"b", p:0.45 }, { leg:"b", p:0.85 }], musK:0 };
  if (MV.reduceMotion) { draw(FINAL); setCap(5); return; }
  var N = 6, TA = 0.7, TB = 2.2, STAG = 0.85;   // tokens, seconds on leg a and leg b, stagger
  function frame(T){
    var o = { grow:0, lab:0, cyc:0, toks:[], musK:0, ph:-T * 4 };
    if (T < 0.9) setCap(0);
    o.grow = ez(seg(T, 0.9, 2.8));
    if (T >= 0.9 && T < 3.2) setCap(1);
    o.lab = seg(T, 2.8, 3.4); if (T >= 3.2 && T < 4.4) setCap(2);
    o.cyc = seg(T, 4.0, 4.5);
    var c0 = 4.4;
    if (T >= c0) {
      setCap(T < c0 + 3.4 ? 3 : 4);
      for (var i = 0; i < N; i++) {
        var t = T - c0 - i * STAG;
        if (t < 0 || t > TA + TB) continue;
        if (t <= TA) { o.toks.push({ leg:"a", p:t / TA }); if (t > TA * 0.75) o.musK = Math.max(o.musK, seg(t, TA * 0.75, TA)); }
        else { o.toks.push({ leg:"b", p:(t - TA) / TB }); o.musK = Math.max(o.musK, 1 - seg(t, TA, TA + 0.4)); }
      }
    }
    draw(o);
  }
  var END = 4.4 + (N - 1) * STAG + TA + TB + 0.4;
  frame(0);
  MV.tween({ dur:END * 1000, ease:lin, step:function(k){ frame(k * END); }, done:function(){ draw(FINAL); setCap(5); } });
}
function ez(k){ return MV.ease(clamp(k, 0, 1)); }

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ arith:arith },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
