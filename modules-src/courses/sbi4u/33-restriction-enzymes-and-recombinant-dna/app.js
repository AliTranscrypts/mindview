// SBI4U 33 Restriction Enzymes and Recombinant DNA: hero (EcoRI cut → sticky ends → gene into an opened plasmid → ligase →
// recombinant plasmid), Cut-and-paste lab (S5 Mode A scan and cut; S9 Mode B build a recombinant plasmid with a plate model;
// Mode C orientation check on a mini-gel), Restriction maps (three stations), quick-fire custom practice, "One way round" (task).
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$;

// ---------- small helpers (from SBI4U 21) ----------
function f1(v){ return Math.round(v * 10) / 10; }
function at(a){ var s = ""; for (var k in a) if (a[k] != null) s += " " + k + '="' + (typeof a[k] === "number" ? f1(a[k]) : a[k]) + '"'; return s; }
function sv(t, a, inner){ return "<" + t + at(a) + (inner == null ? "/>" : ">" + inner + "</" + t + ">"); }
function lerp(a, b, t){ return a + (b - a) * t; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function lin(t){ return t; }
function ez(t){ return MV.ease ? MV.ease(clamp(t, 0, 1)) : clamp(t, 0, 1); }
function txt(x, y, s, cls, anchor){ return sv("text", { x:x, y:y, "class":cls || "rz-lab", "text-anchor":anchor && anchor !== "start" ? anchor : null }, s); }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
function sqH(s){ return '<span class="rz-sq">' + s + "</span>"; }
function svgW(vb, inner, cls, aria){ return '<svg viewBox="' + vb + '" class="rz-svg' + (cls ? " " + cls : "") + '"' + (aria ? ' role="img" aria-label="' + MV.esc(aria) + '"' : ' aria-hidden="true"') + ' focusable="false">' + inner + "</svg>"; }
var PAIR = { A:"T", T:"A", G:"C", C:"G" };
function comp(b){ return PAIR[b] || ""; }
var LZ = "<i>lacZ</i>";
function andList(a){ return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }

// ---------- @component radioGroup (copied from SBI4U 21 / 15 / MHF4U 25: options may be disabled with dis:true) ----------
// radios(host, {label, aria, options:[{id, t, dis}], value, cls:"seg"|"chips", onChange(id)}) -> {set(id), get(), setOptions(list), disable(b)}
function radios(host, o){
  var val = String(o.value), off = false;
  function paint(){
    var f = host.contains(document.activeElement), any = o.options.some(function(x){ return String(x.id) === val && !x.dis; });
    host.innerHTML = '<span class="rg-wrap">' + (o.label ? '<span class="rg-lab">' + o.label + "</span>" : "") + '<span class="rg ' + (o.cls || "seg") + '" role="radiogroup" aria-label="' + MV.esc(MV.plain(o.aria || o.label || "Options")) + '">' +
      o.options.map(function(x, i){ var on = String(x.id) === val, dis = x.dis || off, tab = on || (!any && i === firstFree()) ? 0 : -1; return '<button type="button" role="radio" aria-checked="' + on + '" tabindex="' + (dis ? -1 : tab) + '" data-rg="' + x.id + '" data-k="rg' + x.id + '"' + (dis ? " disabled" : "") + ">" + x.t + "</button>"; }).join("") + "</span></span>";
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

// ---------- enzymes, plasmids and donors (plan §4; all made up for teaching) ----------
// ENZ[name] = { site (5′ → 3′, palindromic), c: top-strand cut offset }. The bottom strand is cut at site.length − c.
var ENZ = { EcoRI:{ site:"GAATTC", c:1 }, BamHI:{ site:"GGATCC", c:1 }, HindIII:{ site:"AAGCTT", c:1 }, PstI:{ site:"CTGCAG", c:5 }, SmaI:{ site:"CCCGGG", c:3 } };
var ENAMES = ["EcoRI", "BamHI", "HindIII", "PstI", "SmaI"];
function cutTxt(e){ var s = ENZ[e].site, c = ENZ[e].c; return s.slice(0, c) + "↓" + s.slice(c); }
function endsOf(e){
  var s = ENZ[e].site, c = ENZ[e].c, b = s.length - c;
  if (c === b) return { blunt:true, ovh:"", txt:"Blunt (no overhang)" };
  if (c < b) return { ovh:s.slice(c, b), txt:"Sticky: 5′-" + s.slice(c, b) + " overhangs" };
  return { ovh:s.slice(b, c), txt:"Sticky: 3′ overhangs (" + s.slice(b, c) + ")" };
}
function sitesIn(seq, site){ var a = [], i = -1; while ((i = seq.indexOf(site, i + 1)) >= 0) a.push(i); return a; }
var PLAB = { size:5000, sites:{ EcoRI:[4500], SmaI:[4510], BamHI:[4520], PstI:[1500, 4530], HindIII:[4540] },
  feats:[{ from:1000, to:2000, k:"mk", t:"marker gene" }, { from:2800, to:3400, k:"ori", t:"origin" }, { from:4200, to:4800, k:"lac", t:"lacZ" }] };
var DONOR = { size:2000, gene:[800, 1130], sites:{ EcoRI:[700, 1250], BamHI:[1000], HindIII:[1600], PstI:[300], SmaI:[] } };
var GFPD = { size:3000, gene:[1000, 1720], sites:{ EcoRI:[950], BamHI:[1760], HindIII:[900, 1800], SmaI:[980, 1400], PstI:[1780] } };
// fragment sizes from cut positions: ring = differences + the wrap-around piece; line = add the two end pieces
function frags(len, cuts, ring){
  var c = cuts.slice().sort(function(a, b){ return a - b; }), out = [], i;
  if (!c.length || (ring && c.length === 1)) return [len];
  if (!ring) out.push(c[0]);
  for (i = 1; i < c.length; i++) out.push(c[i] - c[i - 1]);
  out.push(ring ? len - c[c.length - 1] + c[0] : len - c[c.length - 1]);
  return out;
}

// ---------- @component S1 ringMap — plasmid ring map (0 at the top, clockwise) with outlined feature arcs, a blue insert,
// labelled site ticks (close sites stack their labels), optional cut gaps and exploded fragment arcs ----------
// ringSVG({ size, cx, cy, r, feats:[{from, to, k:"mk"|"lac"|"ori", t}], ins:{ from, to, rev }, sites:[{ pos, t, hi }],
//   gaps:[pos], arcs:[{ from, to, cls, lab, off }], title, sub }) -> SVG markup
function ang(pos, size){ return pos / size * 2 * Math.PI - Math.PI / 2; }
function pt(cx, cy, r, a){ return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
function arcD(cx, cy, r, a0, a1){
  var d = a1 - a0, p0 = pt(cx, cy, r, a0);
  if (d >= 2 * Math.PI - 1e-3) { var m = pt(cx, cy, r, a0 + Math.PI); return "M" + f1(p0[0]) + " " + f1(p0[1]) + " A" + r + " " + r + " 0 1 1 " + f1(m[0]) + " " + f1(m[1]) + " A" + r + " " + r + " 0 1 1 " + f1(p0[0]) + " " + f1(p0[1]); }
  var p1 = pt(cx, cy, r, a1);
  return "M" + f1(p0[0]) + " " + f1(p0[1]) + " A" + r + " " + r + " 0 " + (d > Math.PI ? 1 : 0) + " 1 " + f1(p1[0]) + " " + f1(p1[1]);
}
function ringSVG(o){
  var N = o.size, cx = o.cx, cy = o.cy, r = o.r, h = "";
  (o.feats || []).forEach(function(f){
    var a0 = ang(f.from, N), a1 = ang(f.to, N), d = arcD(cx, cy, r, a0, a1), m = (a0 + a1) / 2, p = pt(cx, cy, r - 22, m);
    h += sv("path", { d:d, "class":"rz-f rz-f-" + f.k }) + sv("path", { d:d, "class":"rz-fin" });
    h += txt(p[0], p[1] + 4, f.k === "lac" ? "<tspan font-style=\"italic\">lacZ</tspan>" : f.t, "rz-sm rz-fl-" + f.k, "middle");
  });
  if (o.arcs) o.arcs.forEach(function(a){
    var a0 = ang(a.from, N), a1 = ang(a.to, N), m = (a0 + a1) / 2, off = a.off || 0, dx = off * Math.cos(m), dy = off * Math.sin(m);
    h += '<g transform="translate(' + f1(dx) + " " + f1(dy) + ')">' + sv("path", { d:arcD(cx, cy, r, a0 + 0.035, a1 - 0.035), "class":"rz-arc " + (a.cls || "") });
    if (a.lab) { var p = pt(cx, cy, r + (a.labR || 20), m); h += txt(p[0], p[1] + 4, a.lab, "rz-sm rz-b", "middle"); }
    h += "</g>";
  });
  else if (o.gaps && o.gaps.length) {
    var g = o.gaps.map(function(x){ return ang(x, N); }).sort(function(a, b){ return a - b; });
    g.forEach(function(a, i){ var b = i < g.length - 1 ? g[i + 1] : g[0] + 2 * Math.PI; h += sv("path", { d:arcD(cx, cy, r, a + 0.05, b - 0.05), "class":"rz-bb" }); });
  } else h += sv("circle", { cx:cx, cy:cy, r:r, "class":"rz-bb" });
  if (o.ins) {
    var i0 = ang(o.ins.from, N), i1 = ang(o.ins.to, N);
    h += sv("path", { d:arcD(cx, cy, r, i0, i1), "class":"rz-ins" });
    var ta = o.ins.rev ? i0 + 0.03 : i1 - 0.03, tb = o.ins.rev ? i0 + 0.16 : i1 - 0.16, tp = pt(cx, cy, r, ta), q1 = pt(cx, cy, r - 7, tb), q2 = pt(cx, cy, r + 7, tb);
    h += sv("path", { d:"M" + f1(tp[0]) + " " + f1(tp[1]) + " L" + f1(q1[0]) + " " + f1(q1[1]) + " L" + f1(q2[0]) + " " + f1(q2[1]) + " Z", "class":"rz-insh" });
  }
  var st = (o.sites || []).slice().sort(function(a, b){ return a.pos - b.pos; }), prev = -1e9, k = 0;
  st.forEach(function(s){
    k = s.pos - prev < N * 0.04 ? k + 1 : 0; prev = s.pos;
    var a = ang(s.pos, N), p0 = pt(cx, cy, r - 9, a), p1 = pt(cx, cy, r + 9, a), pl = pt(cx, cy, r + 15, a), c = Math.cos(a);
    h += sv("line", { x1:p0[0], y1:p0[1], x2:p1[0], y2:p1[1], "class":"rz-tick" + (s.hi ? " rz-tickhi" : "") });
    var lx = pl[0], ly = pl[1] + 4 + k * 13 * (Math.sin(a) < -0.3 ? -1 : 1);
    h += txt(lx, ly, s.t, "rz-sm" + (s.hi ? " rz-b" : ""), c > 0.25 ? "start" : c < -0.25 ? "end" : "middle");
  });
  if (o.title) h += txt(cx, cy - (o.sub ? 2 : -4), o.title, "rz-lab", "middle");
  if (o.sub) h += txt(cx, cy + 13, o.sub, "rz-sm", "middle");
  return h;
}

// ---------- @component miniGel (module 32's mini-gel, self-contained) — lanes of bands on a log scale (small fragments travel
// farther); ladder lane labelled on the left, sample bands labelled with their sizes; equal sizes run as one band (×2) ----------
// gelSVG({ lanes:[{ t, bands:[bp…], ladder }], h, hi:{ laneIndex:{ bp:true } } }) -> { svg, w, h, pos:[[{ s, x, y }]] }
var LADDER = [6000, 5000, 4000, 3000, 2000, 1500, 1000, 500, 250];
function gelY(s, top, H){ var a = Math.log(8000), b = Math.log(180); return top + (a - Math.log(s)) / (a - b) * H; }
function gelSVG(o){
  var lanes = o.lanes, LW = 50, G = 56, x0 = 50, top = 40, H = o.h || 180, W = x0 + lanes.length * (LW + G) - 8, h = "", pos = [];
  h += sv("rect", { x:x0 - 14, y:top - 16, width:W - x0 + 10, height:H + 34, rx:8, "class":"rz-gel" });
  h += txt(W - 2, top - 20, "− wells", "rz-xs", "end") + txt(W - 2, top + H + 30, "+", "rz-xs", "end");
  lanes.forEach(function(L, li){
    var lx = x0 + li * (LW + G), seen = {}, list = [];
    h += sv("rect", { x:lx, y:top - 11, width:LW, height:6, rx:1.5, "class":"rz-well" }) + txt(lx + LW / 2, top - 22, L.t, "rz-xs rz-b", "middle");
    L.bands.forEach(function(s){ seen[s] = (seen[s] || 0) + 1; });
    Object.keys(seen).map(Number).sort(function(a, b){ return b - a; }).forEach(function(s){
      var y = gelY(s, top, H), n = seen[s], hi = o.hi && o.hi[li] && o.hi[li][s];
      h += sv("rect", { x:lx + 3, y:y - (n > 1 ? 3 : 2), width:LW - 6, height:n > 1 ? 6 : 4, rx:2, "class":"rz-band" + (L.ladder ? " rz-lad" : "") + (hi ? " rz-bhi" : "") });
      h += L.ladder ? txt(lx - 4, y + 3.5, String(s), "rz-xs", "end") : txt(lx + LW + 4, y + 3.5, s + (n > 1 ? " ×" + n : ""), "rz-xs" + (hi ? " rz-b" : ""));
      list.push({ s:s, x:lx + LW / 2, y:y });
    });
    pos.push(list);
  });
  return { svg:h, w:W + 6, h:top + H + 36, pos:pos };
}
function gelBox(o, aria){ var g = gelSVG(o); return { html:svgW("0 0 " + f1(g.w) + " " + f1(g.h), g.svg, "rz-gelsvg", aria), g:g }; }
function bandsAria(lanes){ return "Gel: " + lanes.filter(function(L){ return !L.ladder; }).map(function(L){ return L.t + " lane, bands at " + andList(L.bands.slice().sort(function(a, b){ return b - a; }).map(String)) + " bp"; }).join("; ") + "."; }

// ---------- @component plateView — selection plate with X-gal: colonies as circles, each labelled "blue" or "white" in text ----------
var COLS = (function(){
  var r = MV.bio.rng("rz-plate"), a = [], tries = 0;
  while (a.length < 10 && tries++ < 4000) {
    var t = r() * 2 * Math.PI, d = Math.sqrt(r()) * 70, x = 110 + d * Math.cos(t), y = 104 + d * Math.sin(t);
    if (a.every(function(p){ return Math.hypot(p[0] - x, p[1] - y) > 36; })) a.push([x, y]);
  }
  return a;
})();
var WHITE = [1, 4, 7];
function plateSVG(kind, g, hiW){
  var h = sv("circle", { cx:110, cy:110, r:96, "class":"rz-dish" }) + sv("circle", { cx:110, cy:110, r:90, "class":"rz-agar" });
  if (kind === "none" && g > 0) h += txt(110, 114, "No colonies", "rz-lab", "middle");
  else if (kind && g > 0) COLS.forEach(function(p, i){
    var w = kind === "bw" && WHITE.indexOf(i) >= 0, rr = 9 * g;
    if (w && hiW) h += sv("circle", { cx:p[0], cy:p[1] - 4, r:rr + 5, "class":"rz-colhi" });
    h += sv("circle", { cx:p[0], cy:p[1] - 4, r:rr, "class":w ? "rz-colw" : "rz-colb" });
    if (g > 0.6) h += txt(p[0], p[1] + 15, w ? "white" : "blue", "rz-xs" + (w ? " rz-b" : ""), "middle");
  });
  if (hiW && kind === "bw" && g >= 1) h += txt(110, 226, "white = insert inside lacZ", "rz-sm rz-b", "middle");
  return h;
}

// ---------- hero: the EcoRI site lights up, is cut into sticky ends, a gene drops into an opened plasmid, ligase seals it ----------
function hero(f){
  var box = $("#rz-hero"); if (!box) return;
  var cap = f && f.cap, TOP = "AGTGAATTCCAG", X0 = 79, DX = 22, YT = 84, YB = 116;
  var CAPS = ["EcoRI finds GAATTC, which reads the same 5′ → 3′ on both strands.",
    "It cuts between G and A on each strand, leaving AATT sticky ends.",
    "A plasmid opened with EcoRI has the same ends, and the gene fragment fits the gap.",
    "The overhangs pair by hydrogen bonds; ligase seals the backbone.",
    "The ring closes: a recombinant plasmid."];
  function setCap(i){ if (cap && cap.textContent !== CAPS[i]) cap.textContent = CAPS[i]; }
  function duplex(slide, hl, cut, sep, op){
    var h = "", off = -280 * (1 - ez(slide)), s = 20 * ez(sep), i;
    function xT(i){ return X0 + i * DX + off + (i >= 4 ? s : -s); }
    function xB(i){ return X0 + i * DX + off + (i >= 8 ? s : -s); }
    for (i = 3; i <= 8; i++) if (hl > 0) { h += sv("rect", { x:xT(i) - 10, y:YT - 16, width:20, height:21, rx:3, "class":"rz-hl", opacity:f1(hl) }) + sv("rect", { x:xB(i) - 10, y:YB - 16, width:20, height:21, rx:3, "class":"rz-hl", opacity:f1(hl) }); }
    h += sv("line", { x1:xT(0) - 8, y1:YT - 22, x2:xT(3) + 8, y2:YT - 22, "class":"rz-bbl" }) + sv("line", { x1:xT(4) - 8, y1:YT - 22, x2:xT(11) + 8, y2:YT - 22, "class":"rz-bbl" });
    h += sv("line", { x1:xB(0) - 8, y1:YB + 9, x2:xB(7) + 8, y2:YB + 9, "class":"rz-bbl" }) + sv("line", { x1:xB(8) - 8, y1:YB + 9, x2:xB(11) + 8, y2:YB + 9, "class":"rz-bbl" });
    for (i = 0; i < 12; i++) {
      var pairOK = sep < 0.05 || (i >= 4) === (i >= 8);
      if (pairOK) h += sv("line", { x1:xT(i), y1:YT + 6, x2:xB(i), y2:YB - 18, "class":"rz-hb" });
      h += txt(xT(i), YT, TOP[i], "rz-bl" + (sep > 0.3 && i >= 4 && i <= 7 ? " rz-ovh" : ""), "middle") + txt(xB(i), YB, comp(TOP[i]), "rz-bl" + (sep > 0.3 && i >= 4 && i <= 7 ? " rz-ovh" : ""), "middle");
    }
    h += txt(xT(0) - 16, YT, "5′", "rz-end", "end") + txt(xT(11) + 16, YT, "3′", "rz-end") + txt(xB(0) - 16, YB, "3′", "rz-end", "end") + txt(xB(11) + 16, YB, "5′", "rz-end");
    if (cut > 0 && sep < 1) {
      var xa = X0 + 3.5 * DX + off, xb = X0 + 7.5 * DX + off, ym = (YT + YB) / 2 - 7;
      h += sv("path", { d:"M" + xa + " " + (YT - 30) + " L" + xa + " " + ym + " L" + xb + " " + ym + " L" + xb + " " + (YB + 16), "class":"rz-cutl", opacity:f1(cut * (1 - ez(sep))) });
    }
    if (sep > 0.5) { var o2 = f1((sep - 0.5) * 2); h += sv("g", { opacity:o2 }, txt((xT(4) + xT(7)) / 2, YT - 32, "sticky end: 5′-AATT", "rz-sm rz-b", "middle") + txt((xB(4) + xB(7)) / 2, YB + 30, "sticky end: 5′-AATT (read right to left)", "rz-sm rz-b", "middle")); }
    return op < 1 ? sv("g", { opacity:f1(op) }, h) : h;
  }
  function ring(k, drift, lig, close){
    var cx = 200, cy = 136, r = 74, g = 0.42, top = -Math.PI / 2, h = "", sL = lig > 0.3, sR = lig > 0.75, e = 0.05;
    h += sv("path", { d:arcD(cx, cy, r, top + g + (sR ? 0 : e), top - g + 2 * Math.PI - (sL ? 0 : e)), "class":"rz-bb" });
    h += txt(cx, cy + 4, close > 0 ? "" : "plasmid", "rz-sm", "middle");
    var dy = -70 * (1 - ez(drift));
    h += '<g transform="translate(0 ' + f1(dy) + ')">' + sv("path", { d:arcD(cx, cy, r, top - g + (sL ? 0 : e), top + g - (sR ? 0 : e)), "class":"rz-ins" }) + txt(cx, cy - r - 12, "gene", "rz-sm rz-b", "middle") + "</g>";
    if (drift >= 1 && lig < 1) [top - g, top + g].forEach(function(a, j){ var p0 = pt(cx, cy, r - 9, a), p1 = pt(cx, cy, r + 9, a); if (!(j ? sR : sL)) h += sv("line", { x1:p0[0], y1:p0[1], x2:p1[0], y2:p1[1], "class":"rz-hb" }); });
    if (lig > 0 && lig < 1) { var la = top - g - 0.3 + (2 * g + 0.6) * lig, lp = pt(cx, cy, r + 26, la); h += sv("rect", { x:lp[0] - 26, y:lp[1] - 11, width:52, height:20, rx:10, "class":"rz-tag" }) + txt(lp[0], lp[1] + 4, "ligase", "rz-sm rz-tagt", "middle"); }
    if (close > 0) h += sv("g", { opacity:f1(close) }, txt(cx, cy, "recombinant", "rz-lab", "middle") + txt(cx, cy + 15, "plasmid", "rz-lab", "middle"));
    return k < 1 ? sv("g", { opacity:f1(k) }, h) : h;
  }
  function draw(t){
    var h = "";
    if (t < 2.3) h = duplex(Math.min(1, t), clamp((t - 0.6) / 0.4, 0, 1), clamp(t - 1, 0, 1) * 3, clamp((t - 1.35) / 0.65, 0, 1), t > 2 ? 1 - (t - 2) / 0.3 : 1);
    if (t >= 2) h += ring(clamp((t - 2) / 0.3, 0, 1), clamp((t - 2.2) / 0.8, 0, 1), clamp(t - 3, 0, 1), clamp(t - 4, 0, 1));
    box.innerHTML = svgW("0 0 400 240", h, "rz-herosvg");
  }
  if (MV.reduceMotion) { draw(5); setCap(4); return; }
  var DUR = [1500, 1700, 1900, 2100, 1000], ph = 0;
  draw(0.01); setCap(0);
  function run(){
    if (ph > 4) { draw(5); setCap(4); return; }
    setCap(ph); var p = ph;
    MV.tween({ dur:DUR[p], ease:lin, step:function(k){ draw(p + Math.min(k, 0.999)); }, done:function(){ ph++; setTimeout(run, ph > 4 ? 100 : 400); } });
  }
  setTimeout(run, 700);
}

// ---------- Explore: Cut-and-paste lab ----------
// plate outcome (plan table): { kind:"bw"|"blue"|"none", why }
function outcome(pe, de, lig, W){
  if (pe === "none") return { kind:"blue", why:W.uncut };
  if (lig !== "on") return { kind:"none", why:W.ligOff };
  if (pe === "PstI") return { kind:"none", why:W.pst };
  if (!DONOR.sites[de].length) return { kind:"blue", why:W.noDonor };
  if (pe === "SmaI") return { kind:"blue", why:W.blunt };
  if (pe !== de) return { kind:"blue", why:W.noMatch.replace("{p}", endsOf(pe).ovh) };
  if (pe === "EcoRI") return { kind:"bw", why:W.bw, good:true };
  return { kind:"bw", why:pe === "BamHI" ? W.bam : W.hind };
}
function donorFrag(de){
  var s = DONOR.sites[de], g = DONOR.gene, inside = s.filter(function(x){ return x >= g[0] && x <= g[1]; });
  if (!s.length) return { txt:"Not cut: no " + de + " site in the donor", ok:false };
  if (inside.length) return { txt:"Gene cut in two (" + de + " site at " + inside.join(", ") + ")", ok:false, cut:true };
  var L = s.filter(function(x){ return x < g[0]; }), R = s.filter(function(x){ return x > g[1]; });
  var a = L.length ? Math.max.apply(null, L) : 0, b = R.length ? Math.min.apply(null, R) : DONOR.size;
  if (!L.length || !R.length) return { txt:a + "–" + b + " (" + (b - a) + " bp): cut on one side of the gene only, so the piece has one " + de + " end", ok:false, a:a, b:b };
  return { txt:a + "–" + b + " (" + (b - a) + " bp); gene complete: yes", ok:true, a:a, b:b };
}
var EXF = null;
var DEMO = [500, 2000, 3800];
function explore(host, api){
  var S = api.S, X = api.content, SEQ = X.seq, N = SEQ.length, NEAR = SEQ.indexOf(X.near), W = X.why;
  if (!S.mode) S.mode = "a";
  S.a = S.a || { enz:"HindIII", scan:false, cut:false, near:false };
  S.b = S.b || { pe:"none", de:"BamHI", lig:"off", step:0 };
  S.c = S.c || { ori:"fwd", enz:"BamHI" };
  var cutT = S.a.cut ? 1 : 0, demoT = 1, grow = S.b.step >= 3 ? 1 : 0, hiW = false, anim = null, busy = false, pend = null;
  var ENZOPT = ENAMES.map(function(e){ return { id:e, t:e + " " + sqH(cutTxt(e)) }; });
  host.innerHTML = '<div class="pg rz-pg"><div class="pg-graph" data-mv="graph"><div class="rz-row" id="rz-mode"></div><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div id="rz-view"></div><p class="rz-cap" id="rz-cap" aria-live="polite"></p></div>' +
    '<div class="pg-ctrl">' +
      '<div id="rz-ca"><div class="rz-row" id="rz-enz"></div><div class="rz-btns"><button type="button" class="btn primary sm" data-act="scan" data-k="ascan">Scan</button><button type="button" class="btn primary sm" data-act="cut" data-k="acut">Cut</button><button type="button" class="btn ghost sm" data-act="areset" data-k="areset">Reset</button></div>' +
        '<button type="button" class="btn ghost sm rz-nearb" data-act="near" data-k="anear" aria-pressed="false" hidden>Count GAATTG (27–32) as an EcoRI site</button></div>' +
      '<div id="rz-cb" hidden><ol class="rz-steps"><li><div id="rz-pe"></div></li><li><div id="rz-de"></div></li>' +
        '<li><button type="button" class="btn primary sm" data-act="mix" data-k="bmix">Mix</button></li><li><div id="rz-lig"></div></li>' +
        '<li><button type="button" class="btn primary sm" data-act="trans" data-k="btrans">Transform bacteria</button></li>' +
        '<li><button type="button" class="btn primary sm" data-act="plate" data-k="bplate">Plate on the selection plate with X-gal</button></li></ol>' +
        '<button type="button" class="btn ghost sm" data-act="breset" data-k="breset">Start over</button></div>' +
      '<div id="rz-cc" hidden><div class="rz-row" id="rz-ori"></div><div class="rz-row" id="rz-genz"></div></div>' +
      '<div id="rz-cd" hidden><p class="how">Prediction view: a 5000 bp ring plasmid with 3 EcoRI sites.</p></div>' +
      '<p class="tiny muted rz-note"><span class="bio-model">Model</span> ' + X.safety + "</p></div>" +
    '<div class="pg-read"><dl class="read" id="rz-read" aria-live="polite"></dl></div></div>';
  var view = $("#rz-view", host);
  function modeOpts(){ return [{ id:"a", t:"A: Scan and cut" }, { id:"b", t:"B: Build a plasmid" }, { id:"c", t:"C: Check a white colony", dis:!S.unlockC }]; }
  var modeR = radios($("#rz-mode", host), { label:"Mode", cls:"chips", options:modeOpts(), value:S.mode, onChange:function(m){ if (lock()) return; stop(); S.mode = m; hiW = false; changed(); } });
  var enzR = radios($("#rz-enz", host), { label:"Enzyme", cls:"chips", options:ENZOPT, value:S.a.enz, onChange:function(v){ if (lock()) return; S.a = { enz:v, scan:false, cut:false, near:false }; cutT = 0; changed(); } });
  var peR = radios($("#rz-pe", host), { label:"1. Enzyme for the plasmid", cls:"chips", options:[{ id:"none", t:"none" }].concat(ENAMES.map(function(e){ return { id:e, t:e }; })), value:S.b.pe, onChange:function(v){ if (lock()) return; S.b.pe = v; resetB(); } });
  var deR = radios($("#rz-de", host), { label:"2. Enzyme for the donor", cls:"chips", options:ENAMES.map(function(e){ return { id:e, t:e }; }), value:S.b.de, onChange:function(v){ if (lock()) return; S.b.de = v; resetB(); } });
  var ligR = radios($("#rz-lig", host), { label:"4. Ligase", options:[{ id:"on", t:"On" }, { id:"off", t:"Off" }], value:S.b.lig, onChange:function(v){ if (lock()) return; S.b.lig = v; S.b.step = Math.min(S.b.step, 1); grow = 0; hiW = false; changed(); } });
  var oriR = radios($("#rz-ori", host), { label:"Orientation", options:[{ id:"fwd", t:"Forward" }, { id:"rev", t:"Reversed" }], value:S.c.ori, onChange:function(v){ S.c.ori = v; changed(); } });
  var genzR = radios($("#rz-genz", host), { label:"Enzyme for the gel", cls:"chips", options:ENAMES.map(function(e){ return { id:e, t:e }; }), value:S.c.enz, onChange:function(v){ S.c.enz = v; changed(); } });
  function lock(){ return busy; }
  function resetB(){ S.b.step = 0; grow = 0; hiW = false; changed(); }
  function stop(){ if (anim && anim.cancel) anim.cancel(); anim = null; busy = false; if (pend) { var d = pend; pend = null; d(); } }

  // ---- Mode A: sequence S as a double strand ----
  var SX0 = 40, SDX = 15, YT = 54, YB = 80, GAP = 30;
  function aSites(){ return sitesIn(SEQ, ENZ[S.a.enz].site); }
  function seqView(){
    var E = ENZ[S.a.enz], st = aSites(), L = E.site.length, tc = st.map(function(i){ return i + E.c; }), bc = st.map(function(i){ return i + L - E.c; });
    var sep = ez(clamp((cutT - 0.35) / 0.65, 0, 1)) * GAP, Wd = SX0 * 2 + N * SDX + (st.length ? st.length * GAP : 0), h = "", i, k;
    function piece(cuts, j){ var n = 0; cuts.forEach(function(c){ if (j >= c) n++; }); return n; }
    function xT(j){ return SX0 + j * SDX + (cutT > 0 ? piece(tc, j) * sep : 0); }
    function xB(j){ return SX0 + j * SDX + (cutT > 0 ? piece(bc, j) * sep : 0); }
    var inSite = {}; if (S.a.scan) st.forEach(function(s){ for (k = 0; k < L; k++) inSite[s + k] = true; });
    for (i = 0; i <= N; i += 10) if (i < N) h += txt(xT(i), 22, String(i + 1), "rz-xs", "middle");
    if (NEAR >= 0 && S.a.scan) {
      var nx0 = xT(NEAR) - 8, nx1 = xT(NEAR + 5) + 8;
      h += sv("rect", { x:nx0, y:YT - 17, width:nx1 - nx0, height:YB - YT + 25, rx:4, "class":"rz-near" + (S.a.near && S.a.enz === "EcoRI" ? " on" : "") });
      h += txt((nx0 + nx1) / 2, YB + 24, "GAATTG: near-match", "rz-xs", "middle");
    }
    for (i = 0; i < N; i++) {
      var pt1 = cutT > 0 ? piece(tc, i) : 0, pb1 = cutT > 0 ? piece(bc, i) : 0, ov = cutT >= 1 && pt1 !== pb1;
      if (inSite[i]) h += sv("rect", { x:xT(i) - 7, y:YT - 14, width:14, height:19, rx:2, "class":"rz-hl" }) + sv("rect", { x:xB(i) - 7, y:YB - 14, width:14, height:19, rx:2, "class":"rz-hl" });
      if (!(cutT > 0.4 && pt1 !== pb1)) h += sv("line", { x1:xT(i), y1:YT + 5, x2:xB(i), y2:YB - 15, "class":"rz-hb" });
      h += txt(xT(i), YT, SEQ[i], "rz-bs" + (ov ? " rz-ovh" : ""), "middle") + txt(xB(i), YB, comp(SEQ[i]), "rz-bs" + (ov ? " rz-ovh" : ""), "middle");
    }
    // backbones, one per piece and strand
    function bbs(cuts, xf, y){ var b = [0].concat(cuts).concat([N]), s = ""; for (var p = 0; p < b.length - 1; p++) if (b[p + 1] > b[p]) s += sv("line", { x1:xf(b[p]) - 6, y1:y, x2:xf(b[p + 1] - 1) + 6, y2:y, "class":"rz-bbl" }); return s; }
    var tcs = cutT > 0 ? tc : [], bcs = cutT > 0 ? bc : [];
    h += bbs(tcs, xT, YT - 18) + bbs(bcs, xB, YB + 6);
    h += txt(xT(0) - 12, YT, "5′", "rz-end", "end") + txt(xT(N - 1) + 12, YT, "3′", "rz-end") + txt(xB(0) - 12, YB, "3′", "rz-end", "end") + txt(xB(N - 1) + 12, YB, "5′", "rz-end");
    if (cutT > 0 && cutT < 1) st.forEach(function(s, j){
      var xa = SX0 + (tc[j] - 0.5) * SDX, xb = SX0 + (bc[j] - 0.5) * SDX, ym = (YT + YB) / 2 - 6;
      h += sv("path", { d:"M" + xa + " " + (YT - 24) + " L" + xa + " " + ym + " L" + xb + " " + ym + " L" + xb + " " + (YB + 10), "class":"rz-cutl", opacity:f1(1 - ez(clamp((cutT - 0.35) / 0.65, 0, 1))) });
    });
    if (cutT >= 1) st.forEach(function(s, j){
      var en = endsOf(S.a.enz), xm = SX0 + (tc[j] + bc[j]) / 2 * SDX + (j + 0.5) * GAP - SDX / 2;
      h += txt(xm, YB + 38, en.blunt ? "blunt ends" : "sticky ends: " + en.ovh, "rz-xs rz-b", "middle");
    });
    return '<div class="rz-scroll" tabindex="0" role="region" aria-label="Sequence S (scrolls sideways)">' + svgW("0 0 " + Wd + " 126", h, "rz-seqsvg", seqAria(st)) + "</div>";
  }
  function seqAria(st){
    var e = S.a.enz, s = "Sequence S, 44 base pairs, double-stranded: top strand 5′ to 3′ " + SEQ.split("").join(" ") + ".";
    if (S.a.scan) s += " " + e + " sites highlighted: " + (st.length ? st.map(function(i){ return (i + 1) + " to " + (i + 6); }).join(", ") : "none") + ". The near-match GAATTG at 27 to 32 is not highlighted.";
    if (S.a.cut && st.length) s += " Cut into " + (st.length + 1) + " pieces with " + endsOf(e).txt.toLowerCase() + ".";
    return s;
  }
  // ---- P2 demo ring ----
  function demoView(){
    var t = ez(demoT), arcs = DEMO.map(function(p, i){ var q = i < DEMO.length - 1 ? DEMO[i + 1] : DEMO[0] + 5000; return { from:p, to:q, off:14 * t, cls:"rz-arcd", lab:t >= 1 ? (q - p) + " bp" : "" }; });
    var h = ringSVG({ size:5000, cx:150, cy:130, r:80, arcs:t > 0 ? arcs : null, sites:DEMO.map(function(p){ return { pos:p, t:"EcoRI", hi:true }; }), title:t >= 1 ? "3 pieces" : "5000 bp ring" });
    return svgW("0 0 300 260", h, "rz-ringsvg", "A ring plasmid with 3 EcoRI sites" + (t >= 1 ? ", cut into 3 pieces of 1500, 1800 and 1700 bp." : "."));
  }
  // ---- Mode B: build a recombinant plasmid ----
  function bView(){
    var b = S.b, mixed = b.step >= 1, oc = outcome(b.pe, b.de, b.lig, W), pS = b.pe === "none" ? [] : PLAB.sites[b.pe];
    var ring = ringSVG({ size:5000, cx:130, cy:122, r:76, feats:PLAB.feats, gaps:mixed && b.lig !== "on" ? pS : null,
      sites:pS.map(function(p){ return { pos:p, t:b.pe + " " + p, hi:true }; }), title:"pLAB", sub:"5000 bp" });
    var ringH = svgW("0 0 260 250", ring, "rz-ringsvg", "Plasmid pLAB, 5000 bp: marker gene 1000 to 2000, origin 2800 to 3400, lacZ 4200 to 4800 with the cloning sites at 4500 to 4540, and a second PstI site at 1500." + (pS.length ? " " + b.pe + " sites: " + pS.join(" and ") + "." : " Not cut."));
    // donor map
    var x = function(p){ return 20 + p / DONOR.size * 270; }, g = DONOR.gene, d = "", lab = [], ds = DONOR.sites[b.de];
    d += sv("line", { x1:x(0), y1:62, x2:x(2000), y2:62, "class":"rz-bbl rz-don" }) + sv("rect", { x:x(g[0]), y:55, width:x(g[1]) - x(g[0]), height:14, rx:3, "class":"rz-gene" });
    d += txt((x(g[0]) + x(g[1])) / 2, 92, "insulin coding sequence (from mRNA)", "rz-xs rz-b", "middle") + txt(x(0), 108, "0", "rz-xs", "middle") + txt(x(2000), 108, "2000 bp", "rz-xs", "end");
    ENAMES.forEach(function(e){ DONOR.sites[e].forEach(function(p){ lab.push({ p:p, e:e }); }); });
    lab.sort(function(a, c){ return a.p - c.p; }).forEach(function(s, i){
      var on = s.e === b.de, y = i % 2 ? 28 : 16;
      d += sv("line", { x1:x(s.p), y1:y + 4, x2:x(s.p), y2:72, "class":"rz-tick" + (on ? " rz-tickhi" : "") }) + txt(x(s.p), y, s.e + " " + s.p, "rz-xs" + (on ? " rz-b" : ""), "middle");
    });
    var fr = donorFrag(b.de);
    if (mixed && fr.a != null) d += sv("path", { d:"M" + x(fr.a) + " 76 L" + x(fr.a) + " 80 L" + x(fr.b) + " 80 L" + x(fr.b) + " 76", "class":"rz-brk" });
    var donH = svgW("0 0 310 114", d, "rz-donsvg", "Donor DNA, linear, 2000 bp: the insulin coding sequence from 800 to 1130. Sites: PstI 300, EcoRI 700, BamHI 1000, EcoRI 1250, HindIII 1600.");
    var plated = b.step >= 3, plH = svgW("0 0 220 232", plateSVG(plated ? oc.kind : null, plated ? grow : 0, hiW), "rz-platesvg", plated ? "Selection plate with X-gal: " + plateWords(oc.kind) + "." : "Empty selection plate with X-gal.");
    var stepTxt = ["Choose the enzymes, then press Mix.", "Mixed. Set the ligase, then transform the bacteria.", "Transformed. Plate the bacteria on the selection plate with X-gal.", "Plated: " + plateWords(oc.kind) + "."][b.step];
    return '<div class="rz-bgrid"><div class="rz-bcell">' + ringH + '</div><div class="rz-bcell"><p class="rz-h">Donor DNA (linear)</p>' + donH +
      '<p class="rz-h">Selection plate</p><div class="rz-platebox">' + plH + '<p class="tiny muted">' + X.model + "</p></div></div></div>" + '<p class="vh">' + stepTxt + "</p>";
  }
  function plateWords(k){ return k === "bw" ? "blue and white colonies" : k === "blue" ? "only blue colonies" : "no colonies"; }
  // ---- Mode C: check a white colony ----
  function recSites(e, rev){
    var out = [];
    PLAB.sites[e].forEach(function(p){ out.push(p < 4500 ? p : p === 4500 ? 4500 : p + 550); });
    if (e === "EcoRI") out.push(5050);
    if (e === "BamHI") out.push(rev ? 4750 : 4800);
    return out.sort(function(a, b){ return a - b; });
  }
  function cView(){
    var rev = S.c.ori === "rev", e = S.c.enz, st = recSites(e, rev), bands = frags(5550, st, true);
    var ring = ringSVG({ size:5550, cx:130, cy:122, r:76, feats:[{ from:1000, to:2000, k:"mk", t:"marker gene" }, { from:2800, to:3400, k:"ori", t:"origin" }, { from:4200, to:5350, k:"lac", t:"lacZ" }],
      ins:{ from:4500, to:5050, rev:rev }, sites:st.map(function(p){ return { pos:p, t:e + " " + p, hi:true }; }), title:"recombinant", sub:"5550 bp" });
    var lanes = [{ t:"ladder", bands:LADDER, ladder:true }, { t:"colony", bands:[320, 5230] }, { t:"model", bands:bands }];
    var gb = gelBox({ lanes:lanes }, "Mini-gel. Colony lane (BamHI): 320 and 5230 bp. Model lane (" + e + ", " + (rev ? "reversed" : "forward") + "): " + andList(bands.map(String)) + " bp.");
    return '<div class="rz-bgrid"><div class="rz-bcell">' + svgW("0 0 260 250", ring, "rz-ringsvg", "Recombinant plasmid, 5550 bp: pLAB with the 550 bp insulin fragment (blue) in the EcoRI site, pointing " + (rev ? "backwards" : "forwards") + ". " + e + " sites: " + st.join(", ") + ".") +
      '</div><div class="rz-bcell"><p class="rz-h">Mini-gel: the colony’s BamHI digest and the model’s ' + e + " digest</p>" + gb.html + "</div></div>";
  }

  // ---- readout ----
  function readRows(){
    if (S.mode === "a") {
      var st = aSites(), e = S.a.enz, n = st.length + (S.a.near && e === "EcoRI" ? 1 : 0);
      return [["Enzyme", e + " " + sqH(cutTxt(e))],
        ["Sites in S", S.a.scan ? st.length + (st.length ? " (at " + andList(st.map(function(i){ return (i + 1) + "–" + (i + 6); })) + ")" : "") : '<span class="muted">press Scan</span>'],
        ["Pieces", S.a.near && e === "EcoRI" ? "You counted " + n + " sites, which would give " + (n + 1) + " pieces. GAATTG isn’t GAATTC." : S.a.cut ? (st.length ? (st.length + 1) + " (a line cut " + st.length + " time" + (st.length > 1 ? "s" : "") + ")" : "1: nothing is cut") : '<span class="muted">press Cut</span>'],
        ["Ends", st.length ? endsOf(e).txt : "No cut"]];
    }
    if (S.mode === "demo") return [["Sites", "3 EcoRI sites on a ring"], ["Pieces", demoT >= 1 ? "3 (1500, 1800 and 1700 bp)" : "—"]];
    if (S.mode === "b") {
      var b = S.b, pS = b.pe === "none" ? [] : PLAB.sites[b.pe], oc = outcome(b.pe, b.de, b.lig, W), fr = donorFrag(b.de), pe = b.pe === "none" ? null : endsOf(b.pe), de = endsOf(b.de), plated = b.step >= 3;
      var match = !pe ? "— (plasmid not cut)" : !DONOR.sites[b.de].length ? "No donor ends: " + b.de + " doesn’t cut the donor" : b.pe === b.de ? "Yes: " + pe.ovh + " pairs with " + de.ovh :
        "No: " + (pe.blunt ? "blunt ends" : pe.ovh) + " can’t pair with " + (de.blunt ? "blunt ends" : de.ovh);
      return [["Plasmid: sites for this enzyme", !pe ? "Not cut" : pS.length + " (at " + andList(pS.map(String)) + (b.pe === "PstI" ? "): cuts inside the marker gene" : ", inside " + LZ + ")")],
        ["Plasmid ends", pe ? pe.txt : "—"], ["Donor: fragment with the gene", fr.txt], ["Ends match?", match],
        ["Ligase", b.lig === "on" ? "On: backbone sealed" : "Off: pieces held only by hydrogen bonds"],
        ["Plate", plated ? plateWords(oc.kind).replace(/^./, function(c){ return c.toUpperCase(); }) + ". " + oc.why : '<span class="muted">not plated yet</span>'],
        ["Recombinant colonies", plated ? (oc.kind === "bw" ? "White ones" + (oc.good ? "" : ", but the gene isn’t complete") : "None") : "—"]];
    }
    var rev = S.c.ori === "rev", st2 = recSites(S.c.enz, rev), bd = frags(5550, st2, true), m = S.c.enz === "BamHI" && rev;
    return [["Recombinant", "5000 + 550 = 5550 bp"], ["Orientation", rev ? "Reversed" : "Forward"], [S.c.enz + " sites", andList(st2.map(String))],
      ["Model bands", andList(bd.slice().sort(function(a, b){ return a - b; }).map(String)) + " bp"], ["Colony’s BamHI bands", "320 and 5230 bp"], ["Match?", m ? "Yes" : "No"]];
  }
  function capText(){
    if (S.mode === "a") return S.a.cut ? (aSites().length ? "Each cut leaves " + (endsOf(S.a.enz).blunt ? "blunt ends." : "single-stranded " + endsOf(S.a.enz).ovh + " overhangs (bold).") : "No " + S.a.enz + " site in S, so nothing is cut.") : S.a.scan ? "Sites are highlighted on both strands: the site reads the same 5′ → 3′ on each." : "Choose an enzyme, then press Scan.";
    if (S.mode === "demo") return demoT >= 1 ? "A circle cut 3 times gives 3 pieces." : "";
    if (S.mode === "b") return S.b.step >= 3 ? outcome(S.b.pe, S.b.de, S.b.lig, W).why : "Steps 1 to 6: choose, mix, set the ligase, transform, plate. The marker gene " + X.markerJob + ".";
    return "A white colony’s plasmid: pLAB + the 550 bp EcoRI fragment (700–1250) = 5550 bp. In the model the insert can go in either way round.";
  }
  function sync(){
    var m = S.mode;
    $("#rz-ca", host).hidden = m !== "a"; $("#rz-cb", host).hidden = m !== "b"; $("#rz-cc", host).hidden = m !== "c"; $("#rz-cd", host).hidden = m !== "demo";
    modeR.setOptions(modeOpts()); modeR.set(m === "demo" ? "" : m);
    enzR.set(S.a.enz); peR.set(S.b.pe); deR.set(S.b.de); ligR.set(S.b.lig); oriR.set(S.c.ori); genzR.set(S.c.enz);
    var st = S.b.step;
    ligR.disable(busy || st > 1); [peR, deR, enzR, modeR].forEach(function(r){ r.disable(busy); });
    $('[data-act="mix"]', host).disabled = busy || st !== 0; $('[data-act="trans"]', host).disabled = busy || st !== 1; $('[data-act="plate"]', host).disabled = busy || st !== 2;
    $$('[data-act="scan"], [data-act="cut"], [data-act="areset"], [data-act="breset"]', host).forEach(function(b){ b.disabled = busy; });
    var nb = $('[data-act="near"]', host); nb.hidden = !(S.a.enz === "EcoRI" && S.a.scan); nb.setAttribute("aria-pressed", String(!!S.a.near)); nb.disabled = busy;
  }
  function paint(){
    sync();
    view.innerHTML = S.mode === "a" ? seqView() : S.mode === "b" ? bView() : S.mode === "c" ? cView() : demoView();
    var c = capText(), ce = $("#rz-cap", host); if (ce.textContent !== MV.plain(c)) ce.innerHTML = c;
    $("#rz-read", host).innerHTML = MV.readoutHTML(readRows());
  }
  function changed(){ api.save(); paint(); MV.changed(); }
  function cutAnim(done){
    if (!aSites().length) { S.a.cut = true; cutT = 1; changed(); if (done) done(); return; }
    busy = true; S.a.scan = true; cutT = 0.01; paint();
    anim = MV.tween({ dur:1600, ease:lin, step:function(k){ cutT = Math.max(0.01, k); view.innerHTML = seqView(); }, done:function(){ anim = null; busy = false; cutT = 1; S.a.cut = true; changed(); if (done) done(); } });
  }
  function runB(done){
    busy = true; hiW = false; S.b.step = 0; grow = 0; paint();
    function fin(){ var oc = outcome(S.b.pe, S.b.de, S.b.lig, W); if (oc.kind === "bw" && !S.unlockC) S.unlockC = true; anim = null; busy = false; changed(); if (done) done(); }
    MV.wait(500, function(){ S.b.step = 1; paint(); MV.wait(650, function(){ S.b.step = 2; paint(); MV.wait(650, function(){
      S.b.step = 3; grow = 0.01; paint();
      anim = MV.tween({ dur:1300, ease:lin, step:function(k){ grow = Math.max(0.01, k); view.innerHTML = bView(); }, done:function(){ grow = 1; fin(); } });
    }); }); });
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("[data-act]"); if (!b || b.disabled || busy) return;
    var a = b.dataset.act;
    if (a === "scan") { S.a.scan = true; changed(); }
    else if (a === "cut") { if (S.a.cut) return; cutAnim(); }
    else if (a === "areset") { S.a.scan = false; S.a.cut = false; S.a.near = false; cutT = 0; changed(); }
    else if (a === "near") { S.a.near = !S.a.near; changed(); }
    else if (a === "mix") { S.b.step = 1; changed(); }
    else if (a === "trans") { S.b.step = 2; changed(); }
    else if (a === "plate") {
      S.b.step = 3; busy = true; grow = 0.01; paint();
      anim = MV.tween({ dur:1100, ease:lin, step:function(k){ grow = Math.max(0.01, k); view.innerHTML = bView(); }, done:function(){ grow = 1; anim = null; busy = false; if (outcome(S.b.pe, S.b.de, S.b.lig, W).kind === "bw") S.unlockC = true; changed(); } });
    }
    else if (a === "breset") resetB();
  });

  // ---- challenges (plan: exact tests and named wrong states) ----
  function chal(id){
    var C = byId(X.challenges, id), m = C.msgs;
    if (id === "tc1") {
      var e = S.a.enz;
      if (S.mode !== "a" || !S.a.cut) return { ok:false, msg:m.cut };
      if (e === "EcoRI") return S.a.near ? { ok:false, msg:m.near } : { ok:true };
      if (e === "BamHI" || e === "SmaI") return { ok:false, msg:m.one };
      return { ok:false, msg:m.none };
    }
    if (id === "tc2") {
      var bb = S.b;
      if (bb.pe === "EcoRI" && bb.de === "EcoRI" && bb.lig === "on") return { ok:true };
      if (bb.pe === "PstI") return { ok:false, msg:m.pst };
      if (bb.lig !== "on" && bb.pe !== "none") return { ok:false, msg:m.lig };
      if (bb.pe === "BamHI" && bb.de === "BamHI") return { ok:false, msg:m.bam };
      if (bb.pe === "EcoRI") return { ok:false, msg:m.ends };
      return { ok:false, msg:outcome(bb.pe, bb.de, bb.lig, W).why + " " + C.general };
    }
    if (id === "tc3") {
      if (S.mode !== "c") return { ok:false, msg:m.mode };
      if (S.c.enz === "EcoRI") return { ok:false, msg:m.eco };
      if (S.c.enz !== "BamHI") return { ok:false, msg:m.other };
      if (S.c.ori !== "rev") return { ok:false, msg:m.fwd };
      return { ok:true };
    }
    return { ok:false };
  }

  EXF = { show:function(v){ if (!v) stop(); else paint(); } };
  paint();
  return {
    predict:{
      start:function(p){
        stop(); hiW = false;
        if (p.id === "p1") { S.mode = "a"; S.a = { enz:"EcoRI", scan:true, cut:false, near:false }; cutT = 0; }
        else if (p.id === "p2") { S.mode = "demo"; demoT = 0; }
        else { S.mode = "b"; S.b = { pe:"EcoRI", de:p.id === "p3" ? "HindIII" : "EcoRI", lig:"on", step:0 }; grow = 0; }
        changed();
      },
      run:function(p, done){
        pend = done;
        function fin(){ var d = pend; pend = null; if (d) d(); }
        if (p.id === "p1") cutAnim(fin);
        else if (p.id === "p2") { busy = true; sync(); anim = MV.tween({ dur:1500, ease:lin, step:function(k){ demoT = k; view.innerHTML = demoView(); }, done:function(){ demoT = 1; anim = null; busy = false; changed(); fin(); } }); }
        else runB(function(){ if (p.id === "p4") { hiW = true; paint(); } fin(); });
      }
    },
    challenge:chal
  };
}

// ---------- Part 3: Restriction maps (three stations) ----------
function part3(host, api){
  var S = api.S, P = MV.C.part3;
  if (!S.cur) S.cur = "s1";
  if (!S.n) S.n = 3;
  if (!S.dg) S.dg = "E";
  S.m = S.m || {}; S.f3 = S.f3 || {};
  if (S.h3 == null) S.h3 = 600;
  var sel = null, fb = null;
  host.innerHTML = '<div class="rz-p3"><div class="rz-row" id="rz-nav"></div><div id="rz-st"></div></div>';
  radios($("#rz-nav", host), { label:"Station", cls:"chips", options:[{ id:"s1", t:"1. " + P.s1.t }, { id:"s2", t:"2. " + P.s2.t }, { id:"s3", t:"3. " + P.s3.t }], value:S.cur, onChange:function(v){ S.cur = v; sel = null; fb = null; api.save(); build(); } });
  var box = $("#rz-st", host);
  function fbH(){ return fb ? MV.fbHTML(fb.k, fb.h) : ""; }
  function build(){
    var s = P[S.cur];
    var h = '<h3 class="rz-sth">Station ' + S.cur.slice(1) + ": " + s.t + '</h3><p>' + s.text + "</p>";
    if (S.cur === "s1") h += '<div class="rz-sl"><label for="rz-n">Number of sites: <strong id="rz-nv"></strong></label><input type="range" id="rz-n" min="1" max="4" step="1" value="' + S.n + '"></div><div id="rz-s1f"></div><p class="rz-count" id="rz-cnt" aria-live="polite"></p><details class="alg"><summary>' + P.panel + '</summary><div id="rz-s1g"></div></details>';
    if (S.cur === "s2") h += '<div class="rz-row" id="rz-dg"></div><div class="rz-s2"><div class="rz-ovw" id="rz-s2r"></div><details class="alg" open><summary>' + P.panel + '</summary><div class="rz-ovw" id="rz-s2g"></div></details></div><div id="rz-fb" aria-live="polite"></div>';
    if (S.cur === "s3") h += '<div class="rz-s2"><div id="rz-s3r"></div><div><div class="rz-sl"><label for="rz-h3">HindIII site at <strong id="rz-h3v"></strong> bp</label><input type="range" id="rz-h3" min="100" max="4900" step="100" value="' + S.h3 + '"></div><button type="button" class="btn primary sm" data-act="s3check" data-k="s3chk">Check</button>' +
      '<details class="alg" open><summary>' + P.panel + '</summary><div id="rz-s3g"></div></details></div></div><div id="rz-fb" aria-live="polite"></div>';
    box.innerHTML = h;
    if (S.cur === "s2") radios($("#rz-dg", box), { label:"Digest", cls:"chips", options:[{ id:"E", t:"EcoRI" }, { id:"B", t:"BamHI" }, { id:"EB", t:"EcoRI + BamHI" }], value:S.dg, onChange:function(v){ S.dg = v; sel = null; fb = null; api.save(); paint(); } });
    paint();
  }
  // station 1
  function s1(){
    var n = S.n, cuts = P.s1.sites.slice(0, n), rf = frags(6000, cuts, true), lf = frags(6000, cuts, false);
    $("#rz-nv", box).textContent = n;
    var arcs = cuts.map(function(p, i){ var q = i < n - 1 ? cuts[i + 1] : cuts[0] + 6000; return { from:p, to:q, off:n > 1 ? 7 : 0, cls:"rz-arcd", lab:(q - p) + "" }; });
    var h = ringSVG({ size:6000, cx:110, cy:118, r:70, arcs:arcs, sites:cuts.map(function(p){ return { pos:p, t:"" }; }), title:"ring", sub:"6000 bp" });
    var x = function(p){ return 250 + p / 6000 * 250; }, b = [0].concat(cuts).concat([6000]);
    for (var i = 0; i < b.length - 1; i++) {
      var off = (i - n / 2) * 6, x0 = x(b[i]) + off + 2, x1 = x(b[i + 1]) + off - 2;
      h += sv("line", { x1:x0, y1:118, x2:x1, y2:118, "class":"rz-arcd rz-lin" }) + txt((x0 + x1) / 2, 106, String(b[i + 1] - b[i]), "rz-xs rz-b", "middle");
    }
    h += txt(375, 150, "line, 6000 bp", "rz-lab", "middle") + txt(x(0) - (n * 3), 136, "0", "rz-xs", "middle") + txt(x(6000) + n * 3, 136, "6000", "rz-xs", "middle");
    $("#rz-s1f", box).innerHTML = svgW("0 0 520 236", h, "rz-s1svg", "A 6000 bp ring and a 6000 bp line, each cut at " + n + " site" + (n > 1 ? "s" : "") + ". Ring pieces: " + andList(rf.map(String)) + " bp. Line pieces: " + andList(lf.map(String)) + " bp.");
    $("#rz-cnt", box).textContent = "ring: " + rf.length + " piece" + (rf.length > 1 ? "s" : "") + " · line: " + lf.length + " pieces";
    var lanes = [{ t:"ladder", bands:LADDER, ladder:true }, { t:"ring", bands:rf }, { t:"line", bands:lf }];
    $("#rz-s1g", box).innerHTML = gelBox({ lanes:lanes }, bandsAria(lanes)).html;
  }
  // station 2: tap an arc, then its band
  var CUTS2 = { E:[1000, 3500], B:[2000], EB:[1000, 2000, 3500] };
  var SITES2 = [{ pos:1000, t:"EcoRI 1000" }, { pos:2000, t:"BamHI 2000" }, { pos:3500, t:"EcoRI 3500" }];
  function arcs2(){ var c = CUTS2[S.dg]; return c.map(function(p, i){ var q = i < c.length - 1 ? c[i + 1] : c[0] + 6000; return { from:p, to:q, size:q - p, k:String.fromCharCode(97 + i) }; }); }
  function s2(){
    var A = arcs2(), M = S.m[S.dg] || (S.m[S.dg] = {}), cx = 130, cy = 125, r = 80;
    var h = ringSVG({ size:6000, cx:cx, cy:cy, r:r, arcs:A.map(function(a, i){ return { from:a.from, to:a.to, off:A.length > 1 ? 6 : 0, cls:"rz-arcd" + (sel === i ? " rz-arcsel" : "") + (M[i] ? " rz-arcok" : ""), lab:M[i] ? a.size + " bp" : "", labR:32 }; }),
      sites:SITES2.map(function(s){ return { pos:s.pos, t:s.t, hi:CUTS2[S.dg].indexOf(s.pos) >= 0 }; }), title:"pMAP", sub:"6000 bp" });
    var ov = A.map(function(a, i){
      var m = (ang(a.from, 6000) + ang(a.to, 6000)) / 2, p = pt(cx, cy, r + (A.length > 1 ? 6 : 0), m);
      return '<button type="button" class="rz-ob' + (sel === i ? " sel" : "") + (M[i] ? " ok" : "") + '" data-arc="' + i + '" data-k="arc' + S.dg + i + '" aria-pressed="' + (sel === i) + '" aria-label="' + MV.esc("Arc " + a.k + ", from " + a.from + " to " + (a.to % 6000 || 6000) + (a.to > 6000 ? " (round past 0)" : "") + (M[i] ? ", matched: " + a.size + " bp" : "")) + '" style="left:' + f1(p[0] / 260 * 100) + "%;top:" + f1(p[1] / 250 * 100) + '%">' + (M[i] ? "✓" : a.k) + "</button>";
    }).join("");
    MV.keepFocus($("#rz-s2r", box), function(){ $("#rz-s2r", box).innerHTML = svgW("0 0 260 250", h, "rz-ringsvg", "Plasmid pMAP, 6000 bp, with EcoRI sites at 1000 and 3500 and a BamHI site at 2000.") + '<div class="rz-ovl">' + ov + "</div>"; });
    var bands = A.map(function(a){ return a.size; }), lanes = [{ t:"ladder", bands:LADDER, ladder:true }, { t:{ E:"EcoRI", B:"BamHI", EB:"both" }[S.dg], bands:bands }], gb = gelBox({ lanes:lanes }, bandsAria(lanes));
    var bo = gb.g.pos[1].map(function(p){ var used = A.some(function(a, i){ return M[i] && a.size === p.s; });
      return '<button type="button" class="rz-ob rz-obb' + (used ? " ok" : "") + '" data-band="' + p.s + '" data-k="band' + S.dg + p.s + '" aria-label="' + MV.esc("Band at " + p.s + " bp" + (used ? ", matched" : "")) + '" style="left:' + f1(p.x / gb.g.w * 100) + "%;top:" + f1(p.y / gb.g.h * 100) + '%"></button>'; }).join("");
    MV.keepFocus($("#rz-s2g", box), function(){ $("#rz-s2g", box).innerHTML = gb.html + '<div class="rz-ovl">' + bo + "</div>"; });
    $("#rz-fb", box).innerHTML = fbH();
  }
  // station 3: work backwards
  function s3(){
    var p = S.h3, both = frags(5000, [0, p], true);
    $("#rz-h3v", box).textContent = p;
    var h = ringSVG({ size:5000, cx:130, cy:125, r:80, sites:[{ pos:0, t:"EcoRI 0", hi:true }, { pos:p, t:"HindIII " + p, hi:true }], title:"5000 bp", sub:"ring" });
    $("#rz-s3r", box).innerHTML = svgW("0 0 260 250", h, "rz-ringsvg", "A 5000 bp ring with EcoRI at 0 and your HindIII site at " + p + ".");
    var lanes = [{ t:"ladder", bands:LADDER, ladder:true }, { t:"data", bands:[1200, 3800] }, { t:"your map", bands:both }];
    $("#rz-s3g", box).innerHTML = gelBox({ lanes:lanes }, "Gel, EcoRI + HindIII. Data lane: 1200 and 3800 bp. Your map: " + andList(both.map(String)) + " bp.").html + '<p class="tiny muted">EcoRI alone and HindIII alone each give one 5000 bp band.</p>';
    $("#rz-fb", box).innerHTML = fbH();
  }
  function paint(){ if (S.cur === "s1") s1(); else if (S.cur === "s2") s2(); else s3(); MV.changed(); }
  box.addEventListener("input", function(e){
    if (e.target.id === "rz-n") { S.n = +e.target.value; api.save(); s1(); }
    if (e.target.id === "rz-h3") { S.h3 = +e.target.value; fb = null; api.save(); s3(); }
  });
  box.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.arc != null) { var i = +b.dataset.arc; if ((S.m[S.dg] || {})[i]) { fb = { k:"good", h:"Arc " + arcs2()[i].k + " is already matched." }; } else { sel = sel === i ? null : i; fb = null; } s2(); return; }
    if (b.dataset.band != null) {
      var sz = +b.dataset.band, A = arcs2(), M = S.m[S.dg];
      if (sel == null) { fb = { k:"", h:"Tap an arc first, then the band it makes." }; s2(); return; }
      var a = A[sel], span = a.from + " to " + (a.to > 6000 ? "6000 (= 0) and on to " + (a.to - 6000) : a.to);
      if (sz === a.size) {
        M[sel] = true; sel = null;
        var all = A.every(function(x, j){ return M[j]; });
        fb = { k:"good", h:"<strong>✓ Correct.</strong> Arc " + a.k + " runs from " + span + ": " + a.size + " bp." + (all ? " All matched: " + A.map(function(x){ return x.size; }).join(" + ") + " = 6000. <strong>" + P.s2.rule + "</strong>" : "") };
      } else fb = { k:"bad", h:"<strong>✗ Not quite.</strong> Arc " + a.k + " runs from " + span + ". How long is that piece?" + (a.size === 6000 ? " One cut opens the ring into a single line." : "") };
      api.save(); s2(); MV.focusFb($("#rz-fb", box)); return;
    }
    if (b.dataset.act === "s3check") {
      var p = S.h3;
      if (p === 1200 || p === 3800) { S.f3[p] = true; var both2 = S.f3[1200] && S.f3[3800]; fb = { k:"good", h:"<strong>✓ Correct.</strong> HindIII at " + p + " is 1200 bp from the EcoRI site" + (p === 3800 ? " the other way round" : "") + ". " + P.s3.good + (both2 ? " You found both placements." : " " + P.s3.more) }; }
      else { var bb = frags(5000, [0, p], true); fb = { k:"bad", h:"<strong>✗ Not quite.</strong> Your map gives " + andList(bb.map(String)) + " bp with both enzymes; the gel shows 1200 and 3800." }; }
      api.save(); s3(); MV.focusFb($("#rz-fb", box));
    }
  });
  build();
}

// ---------- Practice 1 and 2: quick-fire items (N7 chips, N4 number entry with order-free lists, S5 sequence entry) ----------
function quick(host, api, a){
  var S = api.S; S.items = S.items || {};
  var msgs = {};
  function ist(id){ return S.items[id] || (S.items[id] = { val:{}, tries:0, hint:0, solved:false, first:false, pick:null }); }
  host.innerHTML = a.items.map(function(it){ return '<div class="q" data-qi="' + it.id + '"></div>'; }).join("");
  function nums(s){ return (String(s || "").replace(/[\u2009\u202f](?=\d{3}\b)/g, "").match(/\d+(?:\.\d+)?/g) || []).map(Number); }
  function same(v, ans){ var A = [].concat(ans).slice().sort(function(x, y){ return x - y; }), V = v.slice().sort(function(x, y){ return x - y; }); return A.length === V.length && A.every(function(x, i){ return Math.abs(x - V[i]) < 1e-6; }); }
  function clean(s){ return String(s || "").toUpperCase().replace(/[^ATGCU]/g, ""); }
  function field(it, pid, label, unit, isList, x){
    var id = "qf-" + it.id + (pid || ""), v = x.val[pid || "v"] || "";
    return '<div class="numrow"><label for="' + id + '">' + label + '</label><input class="numin' + (isList ? " rz-listin" : "") + '" id="' + id + '" data-qf="' + it.id + '" data-p="' + (pid || "v") + '" type="text"' + (isList ? "" : ' inputmode="decimal"') + ' autocomplete="off" value="' + MV.esc(v) + '"' + (x.solved ? " disabled" : "") + '><span class="rz-unit">' + (unit || "") + "</span></div>";
  }
  function paintItem(it){
    var i = a.items.indexOf(it), x = ist(it.id), bx = $('[data-qi="' + it.id + '"]', host);
    var h = '<div class="q-head"><span class="qn" aria-hidden="true">' + (i + 1) + '</span><div class="q-prompt">' + it.prompt + "</div>" + (it.star ? '<span class="tag">★</span>' : "") + "</div>";
    if (it.kind === "chips") h += '<div class="chips rz-chips" role="group" aria-label="Choices">' + it.choices.map(function(c, j){ var on = x.pick === j; return '<button type="button" class="chip' + (on ? (x.solved ? " good" : " bad") : "") + '" data-ch="' + j + '" data-k="' + it.id + "ch" + j + '" aria-pressed="' + on + '"' + (x.solved ? " disabled" : "") + ">" + c.t + "</button>"; }).join("") + "</div>";
    else if (it.kind === "seq") h += '<div class="numrow"><label for="qf-' + it.id + '">Overhang:</label><input class="numin rz-seqin" id="qf-' + it.id + '" data-qf="' + it.id + '" data-p="v" type="text" autocapitalize="characters" spellcheck="false" autocomplete="off" value="' + MV.esc(x.val.v || "") + '"' + (x.solved ? " disabled" : "") + "></div>";
    else if (it.parts) h += it.parts.map(function(p){ return field(it, p.id, p.label + ":", p.unit, Array.isArray(MV.ans(p)), x); }).join("");
    else h += field(it, "", "Your answer:", it.unit, Array.isArray(MV.ans(it)), x);
    if (!x.solved) h += '<div class="q-actions">' + (it.kind === "chips" ? "" : '<button type="button" class="btn primary sm" data-act="check" data-k="' + it.id + 'chk">Check</button>') + (it.hints ? MV.hintBtn(it.id + "hint", x.hint) : "") + "</div>" + (it.hints ? MV.hintsHTML(it.hints, x.hint) : "");
    if (x.solved) h += MV.fbHTML("good", "<strong>✓ Correct" + (it.display ? ": " + it.display : "") + ".</strong> " + (msgs[it.id] || "") + (x.first ? "" : ' <span class="muted">(not first try)</span>'));
    else if (msgs[it.id]) h += MV.fbHTML("bad", msgs[it.id]);
    MV.keepFocus(bx, function(){ bx.innerHTML = h; });
  }
  function grade(it, x){
    if (it.kind === "seq") {
      var v = clean(String(x.val.v || "").replace(/[35]\s*['′’]/g, ""));
      if (!v) return { empty:"Type the overhang’s bases, such as AATT." };
      if (v === MV.ans(it)) return { ok:true };
      var w = (it.wrong || []).filter(function(w){ return w.match === v; })[0];
      return { fb:w ? w.fb : "The overhang is the single-stranded stretch between the two staggered cuts." };
    }
    var parts = it.parts || [{ id:"v", answer:MV.ans(it), wrong:it.wrong }], bad = null;
    for (var k = 0; k < parts.length; k++) {
      var p = parts[k], ans = it.parts ? MV.ans(p) : MV.ans(it), n = nums(x.val[p.id] || "");
      if (!n.length) return { empty:"Enter a number" + (Array.isArray(ans) ? " for each fragment, separated by commas." : ", such as 2.") };
      if (!same(n, ans) && !bad) { var w2 = (p.wrong || []).filter(function(w){ return same(n, w.match); })[0]; bad = { fb:w2 ? w2.fb : (Array.isArray(ans) && n.length !== ans.length ? "Check how many fragments there are." : "Check your working.") }; }
    }
    return bad || { ok:true };
  }
  host.addEventListener("input", function(e){ var id = e.target.dataset && e.target.dataset.qf; if (!id) return; ist(id).val[e.target.dataset.p] = e.target.value; api.save(); });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.qf) { var b = host.querySelector('[data-k="' + e.target.dataset.qf + 'chk"]'); if (b) b.click(); } });
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    var bx = b.closest("[data-qi]"); if (!bx) return;
    var it = byId(a.items, bx.dataset.qi), x = ist(it.id);
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paintItem(it); return; }
    var r;
    if (b.dataset.ch != null) { var c = it.choices[+b.dataset.ch]; x.pick = +b.dataset.ch; r = MV.ok(c) ? { ok:true, fb:c.fb } : { fb:c.fb }; }
    else if (b.dataset.act === "check") { r = grade(it, x); if (r.empty) { msgs[it.id] = r.empty; paintItem(it); MV.focusFb(bx); return; } }
    else return;
    if (r.ok) { x.solved = true; x.first = x.tries === 0 && x.hint < 3; msgs[it.id] = r.fb || ""; }
    else { x.tries++; msgs[it.id] = "<strong>✗ Not quite.</strong> " + r.fb + " Try again."; }
    api.save(); paintItem(it); MV.focusFb(bx); MV.changed();
  });
  a.items.forEach(paintItem);
  return {
    stats:function(){ var f = 0, d = 0; a.items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.solved && x.first) f++; }); return { first:f, total:a.items.length, done:d, line:a.summary + " (first try): " + f + "/" + a.items.length + (d < a.items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; a.items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: One way round (two enzyme chips; pLAB ring and GFP donor maps light up the chosen sites) ----------
var task = (function(){
  var api = null;
  function st(){ var s = api.S; if (s.e1 == null) { s.e1 = ""; s.e2 = ""; } return s; }
  function read(){ return api ? { e1:st().e1, e2:st().e2 } : { e1:"", e2:"" }; }
  function draw(){
    var d = read(), pv = $("#rz-tpv"); if (!pv) return;
    var ch = [d.e1, d.e2].filter(function(e, i, arr){ return e && arr.indexOf(e) === i; }), sites = [];
    ch.forEach(function(e){ PLAB.sites[e].forEach(function(p){ sites.push({ pos:p, t:e + " " + p, hi:true }); }); });
    var ring = ringSVG({ size:5000, cx:130, cy:122, r:74, feats:PLAB.feats, sites:sites, title:"pLAB", sub:"5000 bp" });
    var x = function(p){ return 16 + p / GFPD.size * 280; }, g = GFPD.gene, h = "", all = [];
    h += sv("line", { x1:x(0), y1:70, x2:x(3000), y2:70, "class":"rz-bbl rz-don" }) + sv("rect", { x:x(g[0]), y:63, width:x(g[1]) - x(g[0]), height:14, rx:3, "class":"rz-gene" });
    h += txt((x(g[0]) + x(g[1])) / 2, 98, "GFP gene (1000–1720)", "rz-xs rz-b", "middle") + txt(x(0), 114, "0", "rz-xs", "middle") + txt(x(3000), 114, "3000 bp", "rz-xs", "end");
    ch.forEach(function(e){ GFPD.sites[e].forEach(function(p){ all.push({ p:p, e:e }); }); });
    all.sort(function(a, b){ return a.p - b.p; }).forEach(function(s, i){ var y = [14, 28, 42][i % 3], bad = s.p > g[0] && s.p < g[1];
      h += sv("line", { x1:x(s.p), y1:y + 4, x2:x(s.p), y2:80, "class":"rz-tick rz-tickhi" + (bad ? " rz-tickbad" : "") }) + txt(x(s.p), y, s.e + " " + s.p + (bad ? " ✗" : ""), "rz-xs rz-b", "middle"); });
    pv.innerHTML = '<p class="rz-h">pLAB (sites of your enzymes)</p>' + svgW("0 0 260 250", ring, "rz-ringsvg", "pLAB with " + (sites.length ? "sites: " + sites.map(function(s){ return s.t; }).join(", ") : "no enzyme chosen") + ".") +
      '<p class="rz-h">GFP donor (linear, 3000 bp)</p>' + svgW("0 0 312 120", h, "rz-donsvg", "GFP donor, 3000 bp, gene 1000 to 1720. " + (all.length ? "Sites of your enzymes: " + all.map(function(s){ return s.e + " " + s.p; }).join(", ") : "No enzyme chosen") + ".");
  }
  return {
    render:function(inp, pv, a){
      api = a; st();
      inp.innerHTML = '<div class="rz-row" id="rz-t1"></div><div class="rz-row" id="rz-t2"></div><div class="rz-maps tiny"><p><strong>pLAB map:</strong> EcoRI 4500, SmaI 4510, BamHI 4520, PstI 4530 and 1500 (inside the marker gene), HindIII 4540; ' + LZ + " 4200–4800.</p><p><strong>GFP donor map</strong> (linear, 3000 bp; GFP gene 1000–1720): EcoRI 950; BamHI 1760; HindIII 900 and 1800; SmaI 980 and 1400; PstI 1780.</p></div>";
      pv.innerHTML = '<div class="rz-tpv" id="rz-tpv"></div>';
      var opts = ENAMES.map(function(e){ return { id:e, t:e }; });
      radios($("#rz-t1", inp), { label:"Enzyme 1", cls:"chips", options:opts, value:st().e1, onChange:function(v){ st().e1 = v; a.save(); draw(); a.update(); } });
      radios($("#rz-t2", inp), { label:"Enzyme 2", cls:"chips", options:opts, value:st().e2, onChange:function(v){ st().e2 = v; a.save(); draw(); a.update(); } });
      draw();
    },
    read:read,
    valid:function(d){ return d.e1 && d.e2 ? true : "Choose Enzyme 1 and Enzyme 2 first."; },
    checks:function(d){
      if (!ENZ[d.e1] || !ENZ[d.e2]) return [false, false, false, false];
      var E = [d.e1, d.e2], g = GFPD.gene;
      var l1 = E.every(function(e){ var s = PLAB.sites[e]; return s.length === 1 && s[0] >= 4200 && s[0] <= 4800; });
      var ds = [].concat(GFPD.sites[d.e1], GFPD.sites[d.e2]);
      var l2 = !ds.some(function(p){ return p >= g[0] && p <= g[1]; });
      var l3 = ds.some(function(p){ return p < g[0]; }) && ds.some(function(p){ return p > g[1]; });
      return [l1, l2, l3, d.e1 !== d.e2];
    },
    key:function(d){ return [d.e1, d.e2].sort(function(a, b){ return ENAMES.indexOf(a) - ENAMES.indexOf(b); }).join(" + "); },
    label:function(k){ return k; },
    text:function(k){ return k; }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ cuts:quick, maps:quick },
  task:task,
  onShow:function(v){ if (EXF) EXF.show(v === "explore"); }
});
})();
