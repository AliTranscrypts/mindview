// MCV4U 24 An Algorithm for Curve Sketching: hero (the checklist builds the graph of (x² + 3)/(x − 1)), Sketch assembler
// (Explore: feature layers, a 7-step checklist with Guided / Free / Sketch modes, V11 arrow and bend strips, the V14 sketch pad
// with Compare and an N23 per-interval match gauge), From clues to curve (Part 3: two possible sketches + a shift slider,
// marks from the graph of f′, equation ↔ sketch), Full sketches (Practice 2) and the Clue designer task.
(function(){
"use strict";
var $ = MV.$, $$ = MV.$$, css = MV.css, num = MV.num, MINUS = MV.MINUS;
var R3 = Math.sqrt(3), R7 = Math.sqrt(7), TOL = 0.15;
function m(s){ return MV.m(s); }
function r9(v){ v = Math.round(v * 1e9) / 1e9; return Object.is(v, -0) ? 0 : v; }
function near(a, b, t){ return Math.abs(a - b) <= (t == null ? 1e-9 : t); }
function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
function tpl(s, o){ return String(s).replace(/\{(\w+)\}/g, function(_, k){ return o[k] != null ? o[k] : "{" + k + "}"; }); }
function ui(px, w){ return (w || 600) + " " + (px || 13) + "px " + (css("--font-ui") || "sans-serif"); }
function nm(v){ return num(r9(v), 2); }
function sgn(v){ return v > 1e-9 ? 1 : v < -1e-9 ? -1 : 0; }
function midOf(a, b){ return !isFinite(a) ? (isFinite(b) ? b - 1 : 0) : !isFinite(b) ? a + 1 : (a + b) / 2; }
function srcN(v){ return String(r9(Math.round(v * 1e4) / 1e4)); }
var XL = [[2 / R3, "2/√3"], [R3, "√3"], [R7, "√7"], [1 / R3, "1/√3"], [2 / 3, "2/3"], [4 / 3, "4/3"], [1 / 3, "1/3"], [0.5, "1/2"]];
function xLab(v){
  if (!isFinite(v)) return v > 0 ? "∞" : MINUS + "∞";
  if (near(v, Math.round(v), 1e-9)) return nm(Math.round(v));
  for (var i = 0; i < XL.length; i++) if (near(Math.abs(v), XL[i][0], 1e-9)) return (v < 0 ? MINUS : "") + XL[i][1];
  return nm(v);
}
function yLab(v){ return near(v, Math.round(v), 1e-9) ? nm(Math.round(v)) : MV.frac(v, 30); }
function ptLab(x, y){ return "(" + xLab(x) + ", " + yLab(y) + ")"; }
function ivLab(a, b){ return "(" + xLab(a) + ", " + xLab(b) + ")"; }
function listOf(raw){ var s = String(raw == null ? "" : raw).trim().toLowerCase(); if (/^(none|no|no ones?|nothing|ø|∅|-|—)$/.test(s)) return []; return MV.parseList(s); }
function sameSet(a, b, tol){ if (a.length !== b.length) return false; var x = a.slice().sort(function(p, q){ return p - q; }), y = b.slice().sort(function(p, q){ return p - q; }); return x.every(function(v, i){ return near(v, y[i], tol); }); }

// ---------- shapes ----------
var SH = ["uU", "uN", "dU", "dN"], GL = { uU:"↗∪", uN:"↗∩", dU:"↘∪", dN:"↘∩" };
function dirOf(s){ return s ? (s.charAt(0) === "u" ? 1 : -1) : 0; }
function bendOf(s){ return s ? (s.charAt(1) === "U" ? 1 : -1) : 0; }
function incOf(s){ return dirOf(s) === bendOf(s); }   // the slope’s size grows with x on ↗∪ and ↘∩

// ---------- function models ----------
// keys: K(x, y, kind max|min|infl|flat|null, x-intercept, y-intercept, label position a|b|l|r|al|ar|bl|br)
function K(x, y, kind, xi, yi, pos){ return { x:x, y:y, kind:kind || null, xi:!!xi, yi:!!yi, pos:pos || "a" }; }
function poly(c){ return function(x){ var v = 0; for (var i = c.length - 1; i >= 0; i--) v = v * x + c[i]; return v; }; }
function ratio(N, D){ return function(x){ var d = D(x); return Math.abs(d) < 1e-12 ? NaN : N(x) / d; }; }
var MODELS = {
  S1:{ f:poly([7, 0, -8, 0, 1]), d1:function(x){ return 4 * x * (x - 2) * (x + 2); }, d2:function(x){ return 4 * (3 * x * x - 4); },
    view:{ xmin:-3.6, xmax:3.6, ymin:-12, ymax:16 }, crit:[-2, 0, 2], infl:[-2 / R3, 2 / R3], va:[], ea:null, sym:"even", yint:7, xint:[-R7, -1, 1, R7],
    keys:[K(-R7, 0, null, 1, 0, "bl"), K(-2, -9, "min", 0, 0, "b"), K(-2 / R3, -17 / 9, "infl", 0, 0, "bl"), K(-1, 0, null, 1, 0, "al"), K(0, 7, "max", 0, 1, "ar"),
      K(1, 0, null, 1, 0, "ar"), K(2 / R3, -17 / 9, "infl", 0, 0, "br"), K(2, -9, "min", 0, 0, "b"), K(R7, 0, null, 1, 0, "br")] },
  S2:{ f:ratio(function(x){ return x * x; }, function(x){ return x * x - 4; }), d1:function(x){ var d = x * x - 4; return -8 * x / (d * d); }, d2:function(x){ var d = x * x - 4; return 8 * (3 * x * x + 4) / (d * d * d); },
    view:{ xmin:-6, xmax:6, ymin:-5, ymax:6 }, crit:[0], infl:[], va:[-2, 2], ea:{ m:0, b:1 }, sym:"even", yint:0, xint:[0],
    keys:[K(0, 0, "max", 1, 1, "a")] },
  S3:{ f:ratio(function(x){ return x * x + 3; }, function(x){ return x - 1; }), d1:function(x){ return (x - 3) * (x + 1) / ((x - 1) * (x - 1)); }, d2:function(x){ return 8 / Math.pow(x - 1, 3); },
    view:{ xmin:-6, xmax:8, ymin:-10, ymax:14 }, crit:[-1, 3], infl:[], va:[1], ea:{ m:1, b:1 }, sym:"neither", yint:-3, xint:[],
    keys:[K(-1, -2, "max", 0, 0, "l"), K(0, -3, null, 0, 1, "br"), K(3, 6, "min", 0, 0, "b")] },
  S4:{ f:function(x){ return x * Math.pow(x - 4, 3); }, d1:function(x){ return 4 * (x - 1) * (x - 4) * (x - 4); }, d2:function(x){ return 12 * (x - 2) * (x - 4); },
    view:{ xmin:-0.75, xmax:5.5, ymin:-32, ymax:20 }, ys:1, crit:[1, 4], infl:[2, 4], va:[], ea:null, sym:"neither", yint:0, xint:[0, 4],
    keys:[K(0, 0, null, 1, 1, "al"), K(1, -27, "min", 0, 0, "b"), K(2, -16, "infl", 0, 0, "r"), K(4, 0, "flat", 1, 0, "al")] },
  K1:{ f:poly([0, 0, 0, -4, 3]), d1:function(x){ return 12 * x * x * (x - 1); }, d2:function(x){ return 12 * x * (3 * x - 2); },
    view:{ xmin:-1, xmax:1.75, ymin:-1.75, ymax:2.5 }, crit:[0, 1], infl:[0, 2 / 3], va:[], ea:null,
    keys:[K(0, 0, "flat", 1, 1, "al"), K(2 / 3, -16 / 27, "infl", 0, 0, "l"), K(1, -1, "min", 0, 0, "b"), K(4 / 3, 0, null, 1, 0, "ar")] },
  K2:{ f:ratio(function(x){ return x * x - 4; }, function(x){ return x * x - 1; }), d1:function(x){ var d = x * x - 1; return 6 * x / (d * d); }, d2:function(x){ var d = x * x - 1; return -6 * (3 * x * x + 1) / (d * d * d); },
    view:{ xmin:-5, xmax:5, ymin:-6, ymax:8 }, crit:[0], infl:[], va:[-1, 1], ea:{ m:0, b:1 },
    keys:[K(-2, 0, null, 1, 0, "al"), K(0, 4, "min", 0, 1, "b"), K(2, 0, null, 1, 0, "ar")] },
  K3:{ f:ratio(function(x){ return x * x - 2 * x + 4; }, function(x){ return x - 2; }), d1:function(x){ return 1 - 4 / ((x - 2) * (x - 2)); }, d2:function(x){ return 8 / Math.pow(x - 2, 3); },
    view:{ xmin:-5, xmax:9, ymin:-12, ymax:16 }, crit:[0, 4], infl:[], va:[2], ea:{ m:1, b:0 },
    keys:[K(0, -2, "max", 0, 1, "al"), K(4, 6, "min", 0, 0, "b")] },
  K4:{ f:ratio(function(x){ return x * x * x; }, function(x){ return x * x - 3; }), d1:function(x){ var d = x * x - 3; return x * x * (x * x - 9) / (d * d); }, d2:function(x){ var d = x * x - 3; return 6 * x * (x * x + 9) / (d * d * d); },
    view:{ xmin:-7, xmax:7, ymin:-12, ymax:12 }, crit:[-3, 0, 3], infl:[0], va:[-R3, R3], ea:{ m:1, b:0 },
    keys:[K(-3, -4.5, "max", 0, 0, "a"), K(0, 0, "flat", 1, 1, "ar"), K(3, 4.5, "min", 0, 0, "b")] },
  // Part 3, station 1: f′ < 0 left of 1, f′ > 0 right of 1, f″ > 0 (one possible f)
  ST1:{ f:function(x){ return (x - 1) * (x - 1) - 2; }, d1:function(x){ return x - 1; }, d2:function(){ return 1; },
    view:{ xmin:-3, xmax:5, ymin:-4, ymax:10 }, crit:[1], infl:[], va:[], ea:null, keys:[] }
};
// interval boundaries (critical numbers, inflection x-values, vertical asymptotes) and the intervals with their true shapes
function bounds(Mo){
  if (Mo._b) return Mo._b;
  var B = [];
  function add(x, k){ var e = B.filter(function(b){ return near(b.x, x, 1e-9); })[0]; if (!e) { e = { x:x }; B.push(e); } e[k] = true; }
  Mo.crit.forEach(function(x){ add(x, "crit"); }); Mo.infl.forEach(function(x){ add(x, "infl"); }); Mo.va.forEach(function(x){ add(x, "va"); });
  B.sort(function(a, b){ return a.x - b.x; });
  return (Mo._b = B);
}
function ivs(Mo){
  if (Mo._i) return Mo._i;
  var B = bounds(Mo), out = [];
  for (var j = 0; j <= B.length; j++) {
    var a = j ? B[j - 1].x : -Infinity, b = j < B.length ? B[j].x : Infinity, mid = midOf(a, b);
    out.push({ a:a, b:b, j:j, t:(Mo.d1(mid) > 0 ? "u" : "d") + (Mo.d2(mid) > 0 ? "U" : "N") });
  }
  return (Mo._i = out);
}
function trueCurves(Mo, V, o){
  var ed = [V.xmin].concat(Mo.va.filter(function(v){ return v > V.xmin && v < V.xmax; }), [V.xmax]), out = [], e = (V.xmax - V.xmin) * 1e-4;
  for (var i = 0; i + 1 < ed.length; i++) {
    var a = ed[i] + (i ? e : 0), b = ed[i + 1] - (i + 2 < ed.length ? e : 0);
    if (o.lo != null) a = Math.max(a, o.lo); if (o.hi != null) b = Math.min(b, o.hi);
    if (b > a) out.push({ f:Mo.f, color:o.color, width:o.width, alpha:o.alpha, dash:o.dash, domain:[a, b] });
  }
  return out;
}

// =====================================================================================================================
// Feature layers (hero and Explore): asymptotes and labelled key points (featAdd, scene keys), the domain band, the symmetry
// mirror line or 180° rotation mark and flat tangents (featAfter, drawn in the scene’s after()).
var POS = { a:[0, -14, "center"], b:[0, 15, "center"], l:[-9, 0, "right"], r:[9, 0, "left"], al:[-7, -13, "right"], ar:[7, -13, "left"], bl:[-7, 14, "right"], br:[7, 14, "left"] };
function eaLabel(ea){ return "y = " + (ea.m ? (ea.m === 1 ? "x" : nm(ea.m) + "x") + (ea.b ? (ea.b > 0 ? " + " : " " + MINUS + " ") + nm(Math.abs(ea.b)) : "") : nm(ea.b)); }
function featAdd(sc, Mo, L){
  if (L.asy) {
    Mo.va.forEach(function(v){ sc.asymptotes.push({ x:v, label:"x = " + xLab(v) }); });
    if (Mo.ea) sc.asymptotes.push(Mo.ea.m ? { m:Mo.ea.m, b:Mo.ea.b, label:eaLabel(Mo.ea) } : { y:Mo.ea.b, label:eaLabel(Mo.ea) });
  }
  var ink = css("--ink"), shown = [];
  Mo.keys.forEach(function(k){
    var w = [];
    if (L.d1 && (k.kind === "max" || k.kind === "min")) w.push(k.kind);
    if ((L.d1 || L.d2) && k.kind === "flat") w.push("flat");
    if (L.d2 && k.kind === "infl") w.push("infl.");
    if (!w.length && !(L.int && (k.xi || k.yi))) return;
    var P = POS[k.pos] || POS.a;
    shown.push(k);
    sc.points.push({ x:k.x, y:k.y, r:4.5, color:ink });
    sc.labels.push({ x:k.x, y:k.y, text:(w.length ? w.join(" ") + " " : "") + ptLab(k.x, k.y), dx:P[0], dy:P[1], align:P[2], bg:true, font:ui(12) });
  });
  return shown;
}
function featAfter(ctx, pl, Mo, L, o){
  var Y0 = pl.Y(0), ink = css("--ink"), ink2 = css("--ink-2");
  o = o || {};
  ctx.save();
  if (L.dom && Y0 > -4 && Y0 < pl.H + 4) {
    ctx.globalAlpha = 0.5; ctx.strokeStyle = css("--hi"); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, Y0); ctx.lineTo(pl.W, Y0); ctx.stroke(); ctx.globalAlpha = 1;
    Mo.va.forEach(function(x){ var X = pl.X(x); ctx.beginPath(); ctx.arc(X, Y0, 5, 0, 2 * Math.PI); ctx.fillStyle = css("--sheet"); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.stroke(); });
  }
  if (L.sym && Mo.sym === "even") {
    var X0 = pl.X(0), hh = o.mirror == null ? pl.H : pl.H * o.mirror;
    ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.setLineDash([10, 5]); ctx.beginPath(); ctx.moveTo(X0, 0); ctx.lineTo(X0, hh); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = ui(12); ctx.fillStyle = ink2; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("mirror line", X0 + 6, pl.H - 18);
  }
  if (L.sym && Mo.sym === "odd") {
    var OX = pl.X(0), OY = pl.Y(0);
    ctx.strokeStyle = ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(OX, OY, 18, -0.2, Math.PI * 0.95); ctx.stroke();
    ctx.fillStyle = ink2; ctx.beginPath(); ctx.moveTo(OX - 24, OY - 4); ctx.lineTo(OX - 12, OY - 4); ctx.lineTo(OX - 18, OY + 6); ctx.closePath(); ctx.fill();
    ctx.font = ui(12); ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("180°", OX + 20, OY - 10);
  }
  if (L.d1) Mo.keys.forEach(function(k){
    if (k.kind !== "flat") return;
    var X = pl.X(k.x), Y = pl.Y(k.y); ctx.strokeStyle = ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(X - 26, Y); ctx.lineTo(X + 26, Y); ctx.stroke();
  });
  ctx.restore();
}
function featText(Mo, L){
  var out = [];
  Mo.keys.forEach(function(k){
    var w = [];
    if (L.d1 && (k.kind === "max" || k.kind === "min")) w.push(k.kind === "max" ? "local max" : "local min");
    if ((L.d1 || L.d2) && k.kind === "flat") w.push("flat point of inflection");
    if (L.d2 && k.kind === "infl") w.push("point of inflection");
    if (L.int && k.xi) w.push("x-intercept"); if (L.int && k.yi) w.push("y-intercept");
    if (w.length) out.push(w.join(" and ") + " " + ptLab(k.x, k.y));
  });
  return out.join("; ");
}

// =====================================================================================================================
// @component V11 shapeStrips (adapted from MCV4U 20 slopeStrip) — two rows under a graph, on the graph’s x-scale: “f′” (pale
// --f3) with ↗ or ↘ on each interval and “f″” (pale --f4) with ∪ or ∩; boundaries at critical numbers and inflection x-values,
// dashed at vertical asymptotes. o = { d1, d2, upTo (sweep for reveals), empty:[text1, text2] }.
function stripRows(ctx, pl, Mo, top, h, o){
  var I = ivs(Mo), v = pl.v, W = pl.W, rh = h / 2, ink = css("--ink"), ink2 = css("--ink-2"), lim = o.upTo == null ? Infinity : o.upTo;
  ctx.save();
  ctx.fillStyle = css("--sheet"); ctx.fillRect(0, top, W, h);
  ctx.strokeStyle = css("--rule"); ctx.lineWidth = 1; ctx.strokeRect(0.5, top + 0.5, W - 1, h - 1);
  ctx.beginPath(); ctx.moveTo(0, Math.round(top + rh) + 0.5); ctx.lineTo(W, Math.round(top + rh) + 0.5); ctx.stroke();
  [["d1", 0, "--f3"], ["d2", 1, "--f4"]].forEach(function(r){
    var y = top + r[1] * rh;
    if (!o[r[0]]) {
      if (o.empty) { ctx.fillStyle = ink2; ctx.font = ui(12, 500); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(o.empty[r[1]], W / 2 + 12, y + rh / 2 + 1); }
      return;
    }
    I.forEach(function(iv){
      var a = Math.max(iv.a, v.xmin), b = Math.min(iv.b, v.xmax, lim); if (b <= a) return;
      var xa = pl.X(a), xb = pl.X(b), full = Math.min(iv.b, v.xmax) <= lim + 1e-9;
      ctx.globalAlpha = 0.16; ctx.fillStyle = css(r[2]); ctx.fillRect(xa, y + 1, xb - xa, rh - 1); ctx.globalAlpha = 1;
      if (full && xb - xa > 14) {
        ctx.fillStyle = ink; ctx.font = ui(r[1] ? 20 : 18, 700); ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(r[1] ? (iv.t.charAt(1) === "U" ? "∪" : "∩") : (iv.t.charAt(0) === "u" ? "↗" : "↘"), (xa + xb) / 2, y + rh / 2 + 1);
      }
    });
  });
  if (o.d1 || o.d2) bounds(Mo).forEach(function(bd){
    if (bd.x <= v.xmin || bd.x >= v.xmax || bd.x > lim) return;
    var X = Math.round(pl.X(bd.x)) + 0.5; ctx.strokeStyle = bd.va ? ink2 : ink; ctx.lineWidth = bd.va ? 1.2 : 1.5; ctx.setLineDash(bd.va ? [3, 3] : []);
    ctx.beginPath(); ctx.moveTo(X, top); ctx.lineTo(X, top + h); ctx.stroke(); ctx.setLineDash([]);
  });
  ctx.font = "italic 700 13px " + (css("--font-math") || "serif"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
  [["f′", 0, "--f3"], ["f″", 1, "--f4"]].forEach(function(r){ var y = top + r[1] * rh + rh / 2; ctx.fillStyle = css("--sheet"); ctx.fillRect(2, y - 8, 21, 16); ctx.fillStyle = css(r[2]); ctx.fillText(r[0], 5, y + 1); });
  ctx.restore();
}
function stripText(Mo, o){
  var I = ivs(Mo), w = { u:"rising", d:"falling", U:"concave up", N:"concave down" }, out = [];
  if (o.d1) out.push("Arrow strip from f′: " + I.map(function(iv){ return ivLab(iv.a, iv.b) + " " + w[iv.t.charAt(0)]; }).join(", ") + ".");
  if (o.d2) out.push("Bend strip from f″: " + I.map(function(iv){ return ivLab(iv.a, iv.b) + " " + w[iv.t.charAt(1)]; }).join(", ") + ".");
  return out.length ? out.join(" ") : "Arrow and bend strips, empty until the f′ and f″ steps are done.";
}
// ------------------------------------------------- end of V11 shapeStrips -------------------------------------------------------

// =====================================================================================================================
// @component V14 sketchPad (adapted from MCV4U 20 strokePad: free key points instead of joints, four shape chips per interval)
// — the student’s sketch of f: points (tap, drag, arrow keys, typed coordinates; one point per x) plus a shape for each interval
// between key x-values (radio groups ↗∪ ↗∩ ↘∪ ↘∩). skCurves draws it as a convexity-respecting curve: on each monotone run the
// slope’s size is piecewise linear (climbing on ↗∪/↘∩, falling on ↗∩/↘∪, zero at turning points and at flat critical points),
// integrated and scaled to pass through the points; tails head to vertical asymptotes (±∞), approach a horizontal or oblique
// asymptote, or continue the profile. Pieces whose points and shapes disagree are drawn as thin dashed links. Compare overlays
// the true curve and shows the N23-style gauge (gaugeHTML: shape match per interval, key points within 0.15).
//   sketchPad({ plot, ctl, pre, model(), state() -> {pts:[[x, y]], sh:{j:id}, cmp}, active(), lock(), compare:false, how,
//     onChange(), onCompare(on) }) -> { paint() };  skAdd(scene, model, state, view, o);  skPts(ctx, plot, state, o)
function skCurves(Mo, sk, V){
  var I = ivs(Mo), B = bounds(Mo), sh = (sk && sk.sh) || {}, out = [], xr = V.xmax - V.xmin, yr = V.ymax - V.ymin;
  var P = ((sk && sk.pts) || []).map(function(p){ return { x:p[0], y:p[1] }; })
    .filter(function(p){ return p.x > V.xmin && p.x < V.xmax && !Mo.va.some(function(v){ return near(v, p.x, 1e-6); }); }).sort(function(a, b){ return a.x - b.x; });
  // a boundary that isn’t an asymptote moves onto the nearest point within 0.3 (each point claimed by its nearest boundary)
  var Bx = B.map(function(b){ return b.x; });
  B.forEach(function(b, i){
    if (b.va) return;
    var best = null; P.forEach(function(p){ if (Math.abs(p.x - b.x) <= 0.3 && (!best || Math.abs(p.x - b.x) < Math.abs(best.x - b.x))) best = p; });
    if (best && !B.some(function(c, k){ return k !== i && !c.va && Math.abs(best.x - c.x) < Math.abs(best.x - b.x); })) Bx[i] = best.x;
  });
  for (var q = 1; q < Bx.length; q++) if (Bx[q] <= Bx[q - 1]) { Bx = B.map(function(b){ return b.x; }); break; }
  var vas = Mo.va.filter(function(v){ return v > V.xmin && v < V.xmax; }), ed = [V.xmin].concat(vas, [V.xmax]), eps = xr * 0.0015;
  for (var bi = 0; bi + 1 < ed.length; bi++) branch(ed[bi], ed[bi + 1], bi > 0, bi + 2 < ed.length);
  return out;

  function samp(f, from, to, dense, n){ var pts = []; n = n || 90; for (var i = 0; i <= n; i++) { var s = i / n, u = dense ? 1 - Math.pow(1 - s, 3) : s, x = from + (to - from) * u; pts.push([x, f(x)]); } return pts; }
  function branch(L0, R0, Lva, Rva){
    var L = Lva ? L0 + eps : L0, R = Rva ? R0 - eps : R0, pcs = [], k, j;
    for (j = 0; j < I.length; j++) {
      var a = j ? Bx[j - 1] : -Infinity, b = j < Bx.length ? Bx[j] : Infinity, pa = Math.max(a, L), pb = Math.min(b, R);
      if (pb - pa > 1e-9) pcs.push({ a:pa, b:pb, j:j, s:sh[j] || null });
    }
    if (!pcs.length) return;
    // slope-size profile, one monotone run at a time
    k = 0;
    while (k < pcs.length) {
      if (!pcs[k].s) { pcs[k].v0 = pcs[k].v1 = 1; k++; continue; }
      var e2 = k; while (e2 + 1 < pcs.length && pcs[e2 + 1].s && dirOf(pcs[e2 + 1].s) === dirOf(pcs[k].s)) e2++;
      var v = 0, vals = [0], qq;
      for (qq = k; qq <= e2; qq++) { v += incOf(pcs[qq].s) ? 1 : -1; vals.push(v); }
      var mn = Math.min.apply(null, vals); vals = vals.map(function(x){ return x - mn; });
      for (qq = 1; qq < vals.length - 1; qq++) if (vals[qq] === 0 && !B[pcs[k + qq - 1].j].crit) vals[qq] = 0.35;
      for (qq = k; qq <= e2; qq++) { pcs[qq].v0 = vals[qq - k]; pcs[qq].v1 = vals[qq - k + 1]; }
      k = e2 + 1;
    }
    var G0 = [0];
    pcs.forEach(function(pc, i){ G0.push(G0[i] + (pc.b - pc.a) * (pc.v0 + pc.v1) / 2); });
    function at(x){ for (var i = 0; i < pcs.length; i++) if (x <= pcs[i].b + 1e-12) return i; return pcs.length - 1; }
    function G(x){ var i = at(x), pc = pcs[i], w = pc.b - pc.a, t = clamp(x, pc.a, pc.b) - pc.a; return G0[i] + pc.v0 * t + (pc.v1 - pc.v0) * t * t / (2 * w); }
    function mag(x){ var pc = pcs[at(x)], w = pc.b - pc.a; return pc.v0 + (pc.v1 - pc.v0) * (clamp(x, pc.a, pc.b) - pc.a) / w; }
    function dirAt(x){ return dirOf(pcs[at(x)].s); }
    function oneDir(x1, x2){ var d = null; for (var i = 0; i < pcs.length; i++) { var pc = pcs[i]; if (pc.b <= x1 + 1e-9 || pc.a >= x2 - 1e-9) continue; if (!pc.s) return 0; var dd = dirOf(pc.s); if (d === null) d = dd; else if (dd !== d) return 0; } return d || 0; }
    function turning(p){ var a = dirAt(p.x - 1e-6), b = dirAt(p.x + 1e-6); return !!(a && b && a !== b); }
    var Kn = P.filter(function(p){ return p.x > L && p.x < R; }), sc = [];
    for (var i = 0; i + 1 < Kn.length; i++) {
      var A = Kn[i], Bk = Kn[i + 1], d = oneDir(A.x, Bk.x), dy = Bk.y - A.y, dG = G(Bk.x) - G(A.x);
      if (!d || sgn(dy) !== d || dG <= 1e-12) { out.push({ pts:[[A.x, A.y], [Bk.x, Bk.y]], bad:true }); sc.push(null); continue; }
      sc.push(dy / dG);
      out.push({ pts:(function(A, s){ return samp(function(x){ return A.y + s * (G(x) - G(A.x)); }, A.x, Bk.x, false, 60); })(A, dy / dG) });
    }
    if (!Kn.length) { noKnot(); return; }
    tail(Kn[0], -1, sc.length ? sc[0] : null);
    tail(Kn[Kn.length - 1], 1, sc.length ? sc[sc.length - 1] : null);

    function tail(p, side, s0){
      var list = pcs.filter(function(pc){ return side < 0 ? pc.a < p.x - 1e-9 : pc.b > p.x + 1e-9; }), lim = side < 0 ? L : R, dd = 0, ok = true;
      if (side < 0) list.reverse();
      for (var i = 0; i < list.length; i++) { var pd = dirOf(list[i].s); if (!pd || (dd && pd !== dd)) { lim = side < 0 ? list[i].b : list[i].a; ok = false; break; } dd = pd; }
      if (!dd || Math.abs(lim - p.x) < 1e-6) return;
      var f, dense = false, isVA = ok && (side < 0 ? Lva : Rva);
      if (isVA) {
        var va = side < 0 ? L0 : R0, u0 = Math.abs(va - p.x), sig = side * dd, c;
        dense = true;
        if (turning(p)) { c = 0.5 * yr * u0; f = function(x){ var u = Math.abs(va - x); return p.y + sig * c * (1 / u - 1 / u0 - (u0 - u) / (u0 * u0)); }; }
        else { var sl = s0 != null ? Math.abs(s0 * mag(p.x)) : 0; c = sl > 1e-9 ? sl * u0 * u0 : 0.15 * yr * u0; f = function(x){ var u = Math.abs(va - x); return p.y + sig * c * (1 / u - 1 / u0); }; }
      } else if (ok && Mo.ea) {
        var ea = Mo.ea, g = p.y - (ea.m * p.x + ea.b), tau = 0.12 * xr;
        if (turning(p) && ea.m) { var t2 = side > 0 ? g / ea.m : -g / ea.m; if (t2 > 0.05) tau = t2; }
        f = function(x){ return ea.m * x + ea.b + g * Math.exp(-Math.abs(x - p.x) / tau); };
      } else {
        var s = s0 != null ? Math.abs(s0) * dd : 0;
        if (!s) { var dGt = Math.abs(G(lim) - G(p.x)); s = dGt > 1e-9 ? 0.35 * yr / dGt * dd : 0; }
        f = function(x){ return p.y + s * (G(x) - G(p.x)); };
      }
      out.push({ pts:samp(f, p.x, lim, dense, 120) });
    }
    function noKnot(){
      if (!Mo.ea || Lva === Rva) return;
      var d0 = null;
      for (var i = 0; i < pcs.length; i++) { var pd = dirOf(pcs[i].s); if (!pd || (d0 && pd !== d0)) return; d0 = pd; }
      var va = Lva ? L0 : R0, sig = Lva ? -d0 : d0, kk = 0.1 * yr, ea = Mo.ea;
      out.push({ pts:samp(function(x){ return ea.m * x + ea.b + sig * kk / Math.abs(x - va); }, Lva ? R : L, Lva ? L : R, true, 140) });
    }
  }
}
function skAdd(sc, Mo, sk, V, o){
  o = o || {};
  var sh = o.shift || 0, solid = o.solid || (sk && sk.cmp);
  skCurves(Mo, sk, V).forEach(function(c){
    var pts = sh ? c.pts.map(function(q){ return [q[0], q[1] + sh]; }) : c.pts;
    if (c.bad) sc.curves.push({ pts:pts, color:css("--ink-2"), width:1.6, dash:[2, 6] });
    else sc.curves.push({ pts:pts, color:o.color || css("--pen"), width:o.width || 3, dash:solid ? null : [9, 6], alpha:o.alpha });
  });
}
function skPts(ctx, pl, sk, o){
  o = o || {};
  var v = pl.v, pen = css("--pen"), sh = o.shift || 0;
  ((sk && sk.pts) || []).forEach(function(p){
    var x = p[0], y = p[1] + sh, lab = "(" + nm(x) + ", " + nm(y) + ")";
    if (x >= v.xmin && x <= v.xmax && y >= v.ymin && y <= v.ymax) {
      pl.point({ x:x, y:y, r:5.5, color:o.color || pen });
      if (!o.noLabel && !(o.skip || []).some(function(k){ return near(k.x, x, TOL) && near(k.y, y, TOL); })) { var right = pl.X(x) > pl.W - 90; pl.label({ x:x, y:y, text:lab, dx:right ? -9 : 9, dy:y > (v.ymin + v.ymax) / 2 ? 16 : -15, align:right ? "right" : "left", bg:true, font:ui(12), color:o.color || pen }); }
      return;
    }
    var X = clamp(pl.X(x), 12, pl.W - 12), Y = clamp(pl.Y(y), 12, pl.H - 12), ang = Math.atan2(pl.Y(y) - Y, pl.X(x) - X);
    ctx.save(); ctx.fillStyle = pen; ctx.translate(X, Y); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-6, -7); ctx.lineTo(-6, 7); ctx.closePath(); ctx.fill(); ctx.restore();
    pl.label({ x:pl.xOf(X), y:pl.yOf(Y), text:lab + " off the graph", dx:X > pl.W / 2 ? -14 : 14, dy:Y > pl.H / 2 ? -14 : 14, align:X > pl.W / 2 ? "right" : "left", bg:true, font:ui(12) });
  });
}
function skKeysHit(Mo, sk){ return Mo.keys.filter(function(k){ return sk.pts.some(function(p){ return near(p[0], k.x, TOL) && near(p[1], k.y, TOL); }); }).length; }
function skExtra(Mo, sk){ return sk.pts.filter(function(p){ return !Mo.keys.some(function(k){ return near(p[0], k.x, TOL) && near(p[1], k.y, TOL); }); })[0] || null; }
function skShapesOk(Mo, sk){ return ivs(Mo).every(function(iv){ return sk.sh[iv.j] === iv.t; }); }
function skPerfect(Mo, sk){ return skKeysHit(Mo, sk) === Mo.keys.length && !skExtra(Mo, sk) && skShapesOk(Mo, sk); }
function gaugeHTML(Mo, sk){
  var L = MV.C.explore.sketch, I = ivs(Mo);
  return '<div class="cs-gauge" role="group" aria-label="' + MV.esc(MV.plain(L.gaugeHead)) + '"><p class="tiny"><strong>' + L.gaugeHead + '</strong></p><div class="cs-gcells">' + I.map(function(iv){
    var s = sk.sh[iv.j], ok = s === iv.t;
    return '<div class="cs-gc ' + (ok ? "good" : "bad") + '"><span class="cs-gciv">' + ivLab(iv.a, iv.b) + "</span><span>" + (s ? '<span aria-hidden="true">' + GL[s] + "</span> " : "") + (ok ? L.match : tpl(L.miss, { s:GL[iv.t] })) + "</span></div>";
  }).join("") + "</div>" + (Mo.keys.length ? '<p class="tiny cs-gpts">' + tpl(L.pts, { n:skKeysHit(Mo, sk), t:Mo.keys.length }) + "</p>" : "") + "</div>";
}
function sketchPad(o){
  var L = MV.C.explore.sketch, plot = o.plot, step = { x:0.25, y:0.25 }, inX = "", inY = "", msg = "";
  function Mo(){ return o.model(); }
  function sk(){ return o.state(); }
  function ys(){ return Mo().ys || 0.25; }
  function locked(){ return !!(o.lock && o.lock()); }
  function live(){ return !locked() && (!o.active || o.active()); }
  function snapXY(x, y){ var s = ys(); return [r9(Math.round(x / 0.25) * 0.25), r9(Math.round(y / s) * s)]; }
  function changed(){ sk().cmp = false; msg = ""; if (o.onChange) o.onChange(); }
  function put(x, y){
    var pts = sk().pts, at = -1;
    pts.forEach(function(p, i){ if (near(p[0], x, 1e-9)) at = i; });
    if (at >= 0) pts[at] = [x, y]; else if (pts.length < 12) pts.push([x, y]); else { msg = L.full; return false; }
    pts.sort(function(a, b){ return a[0] - b[0]; });
    return true;
  }
  MV.drag(plot, { step:step, big:4,
    handles:function(){ if (!live()) return []; var v = plot.v || Mo().view; return sk().pts.map(function(p, i){ return { id:"p" + i, x:clamp(p[0], v.xmin, v.xmax), y:clamp(p[1], v.ymin, v.ymax), label:"Your point (" + nm(p[0]) + ", " + nm(p[1]) + "). Arrow keys move it; Delete removes it." }; }); },
    snap:function(x, y){ return snapXY(x, y); },
    move:function(id, x, y){ var i = +id.slice(1), pts = sk().pts; if (!pts[i] || !live()) return; if (pts.some(function(p, k){ return k !== i && near(p[0], x, 1e-9); })) x = pts[i][0]; pts[i] = [x, clamp(y, -60, 60)]; changed(); },
    end:function(){ sk().pts.sort(function(a, b){ return a[0] - b[0]; }); if (o.onChange) o.onChange(); },
    key:function(id, e){ if (e.key !== "Delete" && e.key !== "Backspace") return false; var i = +id.slice(1); if (sk().pts[i] && live()) { sk().pts.splice(i, 1); changed(); } return true; } });
  plot.c.addEventListener("pointerdown", function(e){
    if (e.defaultPrevented || !plot.v || !live()) return;
    var r = plot.c.getBoundingClientRect(), q = snapXY(plot.xOf(e.clientX - r.left), plot.yOf(e.clientY - r.top));
    if (put(q[0], q[1])) changed(); else paint();
  });
  function addTyped(){
    var X = MV.parseNum(inX), Y = MV.parseNum(inY);
    if (!X || !Y || X.length !== 1 || Y.length !== 1) { msg = L.bad; paint(); return; }
    var x = r9(Math.round(X[0] * 1e4) / 1e4), y = r9(Math.round(Y[0] * 1e4) / 1e4);
    if (Math.abs(x) > 10 || Math.abs(y) > 60) { msg = L.far; paint(); return; }
    if (put(x, y)) { inX = ""; inY = ""; changed(); } else paint();
  }
  o.ctl.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !o.ctl.contains(b)) return;
    if (b.dataset.skdel != null) { if (live()) { sk().pts.splice(+b.dataset.skdel, 1); changed(); } return; }
    if (b.dataset.sk === "add") { if (live()) addTyped(); return; }
    if (b.dataset.sk === "clear") { if (live()) { var s = sk(); s.pts = []; s.sh = {}; changed(); } return; }
    if (b.dataset.sk === "cmp") { var s2 = sk(); s2.cmp = !s2.cmp; if (o.onCompare) o.onCompare(s2.cmp); if (o.onChange) o.onChange(); }
  });
  o.ctl.addEventListener("change", function(e){ var t = e.target; if (t.dataset && t.dataset.shj != null && live()) { sk().sh[t.dataset.shj] = t.value; changed(); } });
  o.ctl.addEventListener("input", function(e){ var t = e.target; if (t.dataset.ptx) inX = t.value; if (t.dataset.pty) inY = t.value; });
  o.ctl.addEventListener("keydown", function(e){ var t = e.target; if (e.key === "Enter" && (t.dataset.ptx || t.dataset.pty)) { e.preventDefault(); if (live()) addTyped(); } });
  function paint(){
    step.y = ys();
    var s = sk(), I = ivs(Mo()), pre = o.pre, lock = !live(), h = "";
    if (o.how !== false) h += '<p class="how">' + (o.how || L.how) + "</p>";
    if (!lock) h += '<div class="cs-ptin"><label class="cs-ptl">' + m("x") + ' <input class="numin cs-num" type="text" autocomplete="off" spellcheck="false" data-ptx="1" data-k="' + pre + 'px" aria-label="x-coordinate of a new point" value="' + MV.esc(inX) + '"></label>' +
      '<label class="cs-ptl">' + m("y") + ' <input class="numin cs-num" type="text" autocomplete="off" spellcheck="false" data-pty="1" data-k="' + pre + 'py" aria-label="y-coordinate of a new point" value="' + MV.esc(inY) + '"></label>' +
      '<button type="button" class="btn ghost sm" data-sk="add" data-k="' + pre + 'add">' + L.add + "</button></div>";
    if (msg) h += '<p class="cs-skmsg" role="status">' + msg + "</p>";
    h += '<div class="cs-ptlist" role="group" aria-label="Your points">' + (s.pts.length ? s.pts.map(function(p, i){
      var t = "(" + nm(p[0]) + ", " + nm(p[1]) + ")";
      return '<button type="button" class="chip cs-ptc" data-skdel="' + i + '" data-k="' + pre + "del" + i + '"' + (lock ? " disabled" : "") + ' aria-label="' + (lock ? "Point " : "Remove the point ") + t + '">' + t + (lock ? "" : ' <span aria-hidden="true">×</span>') + "</button>";
    }).join("") : '<span class="tiny muted">' + L.none + "</span>") + "</div>";
    h += '<p class="tiny cs-shh"><strong>' + L.shapesHead + '</strong></p><div class="cs-shrow">' + I.map(function(iv){
      return '<fieldset class="cs-shg"><legend>' + ivLab(iv.a, iv.b) + "</legend>" + SH.map(function(id){
        var on = s.sh[iv.j] === id;
        return '<label class="cs-shc' + (on ? " on" : "") + '"><input type="radio" name="' + pre + "sh" + iv.j + '" value="' + id + '" data-shj="' + iv.j + '" data-k="' + pre + "sh" + iv.j + id + '"' + (on ? " checked" : "") + (lock ? " disabled" : "") + '><span aria-hidden="true">' + GL[id] + '</span><span class="vh">' + L.words[id] + "</span></label>";
      }).join("") + "</fieldset>";
    }).join("") + "</div>";
    h += '<div class="q-actions">' + (o.compare === false ? "" : '<button type="button" class="btn ghost sm" data-sk="cmp" data-k="' + pre + 'cmp" aria-pressed="' + !!s.cmp + '">' + (s.cmp ? L.uncompare : L.compare) + "</button>") +
      (lock ? "" : '<button type="button" class="btn ghost sm" data-sk="clear" data-k="' + pre + 'clr">' + L.clear + "</button>") + "</div>";
    if (s.cmp && o.compare !== false) h += gaugeHTML(Mo(), s);
    MV.keepFocus(o.ctl, function(){ o.ctl.innerHTML = h; });
  }
  return { paint:paint };
}
// ------------------------------------------------- end of V14 sketchPad ---------------------------------------------------------

// ---------- hero: the checklist ticks and each step adds its feature; then the curve draws ----------
function hero(f){
  var cv = f.canvas; if (!cv) return;
  var Mo = MODELS.S3, V = { xmin:-6, xmax:8, ymin:-15, ymax:14 }, p = new MV.Plot(cv, V), st = { s:0, k:0 }, list = $$("#cs-hlist li"), caps = (MV.C.hero && MV.C.hero.caps) || [];
  function lay(){ return { dom:st.s >= 1, int:st.s >= 2, sym:st.s >= 3, asy:st.s >= 4, d1:st.s >= 5, d2:st.s >= 6 }; }
  function draw(){
    var L = lay(), sc = { view:V, xLabel:"x", yLabel:"y", asymptotes:[], curves:[], points:[], labels:[] };
    featAdd(sc, Mo, L);
    if (st.s >= 7) trueCurves(Mo, V, { color:css("--pen"), width:3, hi:V.xmin + st.k * (V.xmax - V.xmin) }).forEach(function(c){ sc.curves.push(c); });
    sc.describe = "Axes for f(x) = (x² + 3)/(x − 1). " + (st.s ? ["Domain: every x except 1", "y-intercept (0, −3)", "no symmetry", "vertical asymptote x = 1 and oblique asymptote y = x + 1", "f′: rising, falling, falling, rising, with a max at (−1, −2) and a min at (3, 6)", "f″: concave down, down, up, up", "the curve"].slice(0, Math.min(st.s, 7)).join("; ") + "." : "Empty so far.");
    sc.after = function(ctx, pl){
      featAfter(ctx, pl, Mo, L);
      if (L.sym) { ctx.save(); ctx.font = ui(13, 700); var t = "no symmetry", w = ctx.measureText(t).width; ctx.fillStyle = css("--sheet"); ctx.fillRect(pl.W - w - 18, 6, w + 12, 22); ctx.strokeStyle = css("--rule"); ctx.strokeRect(pl.W - w - 18 + 0.5, 6.5, w + 12, 22); ctx.fillStyle = css("--ink-2"); ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(t, pl.W - w - 12, 17); ctx.restore(); }
      var top = pl.Y(-11); stripRows(ctx, pl, Mo, top, pl.H - top - 1, { d1:L.d1, d2:L.d2 });
    };
    p.draw(sc);
    list.forEach(function(li, i){ li.classList.toggle("on", i < st.s); li.classList.toggle("cur", i === st.s - 1 && st.s < 7); });
    if (f.cap) f.cap.innerHTML = caps[Math.min(st.s, caps.length - 1)] || "";
  }
  p.render = draw;
  if (MV.reduceMotion) { st.s = 7; st.k = 1; draw(); list.forEach(function(li){ li.classList.remove("cur"); }); return; }
  draw();
  (function next(){
    MV.wait(st.s ? 950 : 600, function(){
      st.s++;
      if (st.s < 7) { draw(); next(); return; }
      MV.tween({ dur:1800, ease:function(k){ return k; }, step:function(k){ st.k = k; draw(); }, done:function(){ st.k = 1; draw(); } });
    });
  })();
}

// ---------- Explore: Sketch assembler ----------
var STEPS = ["dom", "int", "sym", "asy", "d1", "d2", "sk"], READ = { dom:"domain", int:"ints", sym:"sym", asy:"asym", d1:"d1", d2:"d2" };
function colsAt(xs){ xs = xs.slice().sort(function(a, b){ return a - b; }).filter(function(v, i, A){ return !i || !near(v, A[i - 1], 1e-9); }); var b = [-Infinity].concat(xs, [Infinity]), out = []; for (var i = 0; i + 1 < b.length; i++) out.push({ a:b[i], b:b[i + 1], k:String(i) }); return out; }
function signTable(kind, cols, vals, bad, rowLab, lock){
  return '<div class="tbl-wrap cs-scw"><table class="vt cs-sct"><caption class="vh">Sign chart to fill in</caption><thead><tr><th scope="col">' + m("x") + "</th>" +
    cols.map(function(c){ return '<th scope="col">' + ivLab(c.a, c.b) + "</th>"; }).join("") + '</tr></thead><tbody><tr><th scope="row">' + rowLab + "</th>" + cols.map(function(c){
      var g = vals[c.k], b = bad[kind + "|" + c.k];
      return "<td" + (b ? ' class="cs-bad"' : "") + ">" + (b ? '<span class="cs-x" aria-hidden="true">✗</span><span class="vh">wrong: </span>' : "") +
        '<button type="button" class="cs-cell" data-cell="' + kind + "|" + c.k + '" data-k="c' + kind + c.k + '"' + (lock ? " disabled" : "") + ' aria-label="Sign on ' + ivLab(c.a, c.b) + ": " + (g === "+" ? "plus" : g === "-" ? "minus" : "not chosen") + '">' + (g === "+" ? "+" : g === "-" ? MINUS : "?") + "</button></td>";
    }).join("") + "</tr></tbody></table></div>";
}
function explore(host, api){
  var S = api.S, C = api.content, FN = {}, CH = {}, ST = {}, flash = null, sfb = null, sbad = {}, anim = null, hl = null, viewStep = null;
  C.fns.forEach(function(f){ FN[f.id] = f; });
  C.challenges.forEach(function(c){ CH[c.id] = c; });
  C.steps.forEach(function(s, i){ ST[s.id] = s; s.n = i + 1; });
  if (!FN[S.fn]) S.fn = "S1";
  if (["guided", "free", "sketch"].indexOf(S.mode) < 0) S.mode = "guided";
  S.d = S.d && typeof S.d === "object" ? S.d : {};
  if (!S.st || typeof S.st !== "object") S.st = { guided:true, free:true, sketch:false };
  function D(id){
    id = id || S.fn;
    var d = S.d[id];
    if (!d || !d.done) d = S.d[id] = { done:{}, cur:"dom", pick:{}, inp:{}, sg1:{}, sg2:{}, ph:0 };
    if (!d.sk || !Array.isArray(d.sk.pts)) d.sk = { pts:[], sh:{}, cmp:false };
    d.sk.sh = d.sk.sh || {}; d.pick = d.pick || {}; d.inp = d.inp || {}; d.sg1 = d.sg1 || {}; d.sg2 = d.sg2 || {};
    return d;
  }
  function Mo(){ return MODELS[S.fn]; }
  function curStep(){ var d = D(); if (S.mode === "guided") { for (var i = 0; i < STEPS.length; i++) if (!d.done[STEPS[i]]) return STEPS[i]; return "sk"; } return STEPS.indexOf(d.cur) >= 0 ? d.cur : "dom"; }
  function shownStep(){ var d = D(); return S.mode === "guided" && viewStep && d.done[viewStep] ? viewStep : curStep(); }
  function skOn(){ return S.mode !== "guided" || curStep() === "sk"; }
  function showTrue(){ return !!S.st[S.mode]; }
  function layers(){ var d = D(); return { dom:!!d.done.dom, int:!!d.done.int, sym:!!d.done.sym, asy:!!d.done.asy, d1:!!d.done.d1, d2:!!d.done.d2 }; }
  function q(s){ return $(s, host); }
  host.innerHTML = '<div class="cs-ex">' +
    '<div class="cs-top"><div class="chips cs-fns" id="cs-fn" role="group" aria-label="Choose a function"></div><div class="cs-ctl"><div id="cs-mode"></div>' +
      '<label class="cs-tog"><input type="checkbox" id="cs-true" data-k="cstrue"> ' + C.showTrue + '</label></div><p class="tiny muted cs-how" id="cs-how"></p></div>' +
    '<div class="cs-stepsbox" id="cs-stepsbox"><div class="cs-sbar" id="cs-sbar" role="group" aria-label="Checklist"></div><div class="cs-stepq" id="cs-stepq"></div></div>' +
    '<div class="cs-main" data-mv="graph"><p class="eq-cap cs-eq" id="cs-eq" aria-live="polite"></p><p class="banner" data-mv="banner" aria-live="polite"></p>' +
      '<div class="plot-wrap"><canvas class="plot cs-g" id="cs-g" role="img" aria-label="Graph"></canvas></div>' +
      '<div class="plot-wrap"><canvas class="plot cs-strip" id="cs-strip" role="img" aria-label="Arrow and bend strips"></canvas></div>' +
      '<p class="tiny muted cs-key">' + C.key + '</p><p class="tiny muted" id="cs-sklock" hidden>' + C.skLocked + '</p><div class="cs-sk" id="cs-sk"></div></div>' +
    '<dl class="read cs-read" id="cs-read" aria-live="polite"></dl></div>';
  var plot = new MV.Plot(q("#cs-g"), Mo().view), strip = new MV.Plot(q("#cs-strip"), { xmin:0, xmax:1, ymin:0, ymax:1 });
  var pad = sketchPad({ plot:plot, ctl:q("#cs-sk"), pre:"ex", model:Mo, state:function(){ return D().sk; }, active:skOn, lock:function(){ return !!anim; },
    onChange:function(){ hl = null; var d = D(); if (d.sk.cmp && skPerfect(Mo(), d.sk)) d.done.sk = 1; api.save(); paintSteps(); paintRead(); paintSk(); render(); MV.changed(); } });

  // ---- drawing ----
  function render(){
    var M = Mo(), d = D(), V = M.view, L = layers(), ink = css("--ink"), sc = { view:V, xLabel:"x", yLabel:"y", asymptotes:[], curves:[], points:[], labels:[] };
    var shown = featAdd(sc, M, L);
    var rng = V.xmax - V.xmin, sweep = anim ? V.xmin + anim.k * rng : null;
    if (anim && anim.id === "p1") {
      trueCurves(M, V, { color:ink, width:2.4, lo:0 }).forEach(function(c){ sc.curves.push(c); });
      trueCurves(M, V, { color:ink, width:2.4, lo:-anim.k * Math.abs(V.xmin), hi:0 }).forEach(function(c){ sc.curves.push(c); });
    } else if (anim && (anim.id === "p3" || anim.id === "p4")) trueCurves(M, V, { color:ink, width:2.4, hi:sweep }).forEach(function(c){ sc.curves.push(c); });
    else if (!anim && (showTrue() || d.sk.cmp || hl === "p1" || hl === "p3" || hl === "p4")) trueCurves(M, V, { color:ink, width:2.2 }).forEach(function(c){ sc.curves.push(c); });
    skAdd(sc, M, d.sk, V);
    sc.describe = describe();
    sc.after = function(ctx, pl){
      featAfter(ctx, pl, M, L, { mirror:anim && anim.id === "p1" ? anim.k : null });
      if ((hl === "p4" || (anim && anim.id === "p4" && anim.k > 0.9)) && S.fn === "S4") { var X = pl.X(4), Y = pl.Y(0); ctx.save(); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 6; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(X - 40, Y); ctx.lineTo(X + 40, Y); ctx.stroke(); ctx.restore(); pl.label({ x:4, y:0, text:"flat tangent at (4, 0)", dx:-10, dy:-30, align:"right", bg:true, font:ui(12) }); }
      skPts(ctx, pl, d.sk, { skip:shown });
    };
    plot.draw(sc);
    var up = anim && (anim.id === "p2" || anim.id === "p4") ? sweep : null;
    strip.draw({ view:{ xmin:V.xmin, xmax:V.xmax, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:stripText(M, L), after:function(ctx, pl){
      stripRows(ctx, pl, M, 0, pl.H, { d1:L.d1, d2:L.d2, upTo:up, empty:[C.strip.e1, C.strip.e2] }); } });
  }
  plot.render = render; strip.render = render;
  function describe(){
    var M = Mo(), d = D(), f = FN[S.fn], L = layers(), parts = ["Graph of " + MV.plain(f.eq) + "."], R = f.read, I = ivs(M), w = C.sketch.words;
    if (L.dom) parts.push("Domain: " + MV.plain(R.domain) + ".");
    if (L.sym) parts.push("Symmetry: " + MV.plain(R.sym) + ".");
    if (L.asy) parts.push("Asymptotes: " + MV.plain(R.asym) + ".");
    var ft = featText(M, L); if (ft) parts.push("Marked: " + ft + ".");
    if (showTrue() || d.sk.cmp) parts.push("The true graph is shown.");
    parts.push(d.sk.pts.length ? "Your points: " + d.sk.pts.map(function(p){ return "(" + nm(p[0]) + ", " + nm(p[1]) + ")"; }).join(", ") + "." : "No points placed.");
    parts.push("Your shapes: " + I.map(function(iv){ return ivLab(iv.a, iv.b) + " " + (d.sk.sh[iv.j] ? MV.plain(w[d.sk.sh[iv.j]]) : "not chosen"); }).join("; ") + ".");
    return parts.join(" ");
  }
  // ---- panels ----
  function paintTop(){
    var d = D(), f = FN[S.fn];
    MV.keepFocus(q("#cs-fn"), function(){ q("#cs-fn").innerHTML = C.fns.map(function(o){ var on = o.id === S.fn; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-fn="' + o.id + '" data-k="fn' + o.id + '" aria-pressed="' + on + '"' + (anim ? " disabled" : "") + ">" + o.chip + "</button>"; }).join(""); });
    MV.keepFocus(q("#cs-mode"), function(){ q("#cs-mode").innerHTML = '<span class="seg" role="group" aria-label="Mode">' + C.modes.map(function(o){ return '<button type="button" data-mode="' + o.id + '" data-k="md' + o.id + '" aria-pressed="' + (S.mode === o.id) + '"' + (anim ? " disabled" : "") + ">" + o.t + "</button>"; }).join("") + "</span>"; });
    q("#cs-true").checked = showTrue(); q("#cs-true").disabled = !!anim;
    q("#cs-how").innerHTML = C.modeHow[S.mode];
    q("#cs-stepsbox").hidden = S.mode === "sketch";
    q("#cs-eq").innerHTML = f.eq + (d.done.sym ? ' <span class="cs-badge">' + C.badge[Mo().sym] + "</span>" : "");
  }
  function paintSk(){ var on = skOn(); q("#cs-sk").hidden = !on; q("#cs-sklock").hidden = on; pad.paint(); }
  function paintRead(){
    var d = D(), R = C.rows, rd = FN[S.fn].read, dash = '<span class="muted">—</span>';
    q("#cs-read").innerHTML = MV.readoutHTML([[R.domain, d.done.dom ? rd.domain : dash], [R.ints, d.done.int ? rd.ints : dash], [R.sym, d.done.sym ? rd.sym : dash], [R.asym, d.done.asy ? rd.asym : dash],
      [R.d1, d.done.d1 ? rd.d1 : dash], [R.d2, d.done.d2 ? rd.d2 : dash], [R.keys, d.done.d1 && d.done.d2 ? rd.keys : dash], [R.shapes, (d.done.d1 && d.done.d2) || d.sk.cmp ? rd.shapes : dash]]);
  }
  function inRow(k, lab){ return '<div class="numrow cs-inrow"><label for="cs-in' + k + '">' + lab + '</label><input class="numin cs-num" id="cs-in' + k + '" data-in="' + k + '" data-k="in' + k + '" type="text" autocomplete="off" spellcheck="false" value="' + MV.esc(D().inp[k] || "") + '"></div>'; }
  function paintSteps(){
    if (S.mode === "sketch") return;
    var d = D(), cur = curStep(), sid = shownStep(), lab = C.labels;
    MV.keepFocus(q("#cs-sbar"), function(){ q("#cs-sbar").innerHTML = C.steps.map(function(s){
      var dn = !!d.done[s.id], lock = S.mode === "guided" && !dn && s.id !== cur, on = s.id === sid;
      return '<button type="button" class="cs-sb' + (on ? " on" : "") + (dn ? " done" : "") + '" data-step="' + s.id + '" data-k="sb' + s.id + '" aria-pressed="' + on + '"' + (lock || anim ? " disabled" : "") + '><span class="cs-sbn" aria-hidden="true">' + (dn ? "✓" : s.n) + "</span><span>" + s.t + "</span>" + (dn ? '<span class="vh"> (done)</span>' : lock ? '<span class="vh"> (locked)</span>' : "") + "</button>";
    }).join(""); });
    var f = FN[S.fn], s = ST[sid], h = (flash ? MV.fbHTML("good", flash) : "") + '<p class="cs-sq"><strong>' + s.n + ". " + s.t + ":</strong> " + s.q + "</p>";
    if (sid === "sk") { if (d.done.sk) h += MV.fbHTML("good", C.stepMsg.skDone); }
    else if (d.done[sid]) h += MV.fbHTML("good", "<strong>✓</strong> " + f.read[READ[sid]]);
    else {
      if (sid === "dom" || sid === "asy") h += '<div class="opts cs-opts">' + f[sid].map(function(o, i){ var on = d.pick[sid] === i; return '<button type="button" class="opt' + (on ? " picked" : "") + '" data-pick="' + i + '" data-k="pk' + sid + i + '" aria-pressed="' + on + '"><span>' + o.t + "</span></button>"; }).join("") + "</div>";
      if (sid === "sym") h += '<div class="chips" role="group" aria-label="Symmetry">' + ["even", "odd", "neither"].map(function(k, i){ var on = d.pick.sym === k; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-sym="' + k + '" data-k="sy' + k + '" aria-pressed="' + on + '">' + lab.sym[i] + "</button>"; }).join("") + "</div>";
      if (sid === "int") h += inRow("y", lab.y) + inRow("x", lab.x);
      if (sid === "d1") h += '<p class="cs-fd">' + f.d1 + "</p>" + (d.ph ? '<p class="tiny">' + lab.sg1 + "</p>" + signTable("sg1", colsAt(Mo().crit.concat(Mo().va)), d.sg1, sbad, "Sign of " + m("f′(x)")) : inRow("crit", lab.crit));
      if (sid === "d2") h += '<p class="cs-fd">' + f.d2 + '</p><p class="tiny">' + lab.sg2 + "</p>" + signTable("sg2", colsAt(Mo().infl.concat(Mo().va)), d.sg2, sbad, "Sign of " + m("f″(x)")) + inRow("infl", lab.infl);
      h += '<div class="q-actions"><button type="button" class="btn primary sm" data-act="stepchk" data-k="stchk"' + (anim ? " disabled" : "") + ">" + lab.check + "</button></div>";
      if (sfb) h += MV.fbHTML(sfb.good ? "good" : "bad", sfb.html);
    }
    MV.keepFocus(q("#cs-stepq"), function(){ q("#cs-stepq").innerHTML = h; });
  }
  function paintAll(){ paintTop(); paintSteps(); paintSk(); paintRead(); render(); MV.changed(); }
  // ---- checking a step ----
  function checkStep(){
    var sid = shownStep(), d = D(), f = FN[S.fn], M = Mo(), MS = C.stepMsg, i, raw;
    function err(t){ sfb = { good:false, html:t }; }
    function bad(t){ sfb = { good:false, html:"<strong>✗ Not quite.</strong> " + t }; }
    function ok(){ d.done[sid] = 1; sfb = null; sbad = {}; flash = MS.ok; viewStep = null; hl = null; }
    function cells(kind, cols, sign){
      var vals = d[kind], wrong = false; sbad = {};
      if (cols.some(function(c){ return !vals[c.k]; })) return MS.cells;
      cols.forEach(function(c){ var s = sign(midOf(c.a, c.b)) > 0 ? "+" : "-"; if (vals[c.k] !== s) { sbad[kind + "|" + c.k] = 1; wrong = true; } });
      return wrong ? false : true;
    }
    flash = null;
    if (sid === "dom" || sid === "asy") { i = d.pick[sid]; if (i == null) err(MS.pick); else if (MV.ok(f[sid][i])) ok(); else bad(f[sid][i].why); }
    else if (sid === "sym") { if (!d.pick.sym) err(MS.pick); else if (d.pick.sym === M.sym) ok(); else bad(f.fb.sym); }
    else if (sid === "int") {
      var ys = String(d.inp.y || "").trim(), xs = String(d.inp.x || "").trim();
      if (!ys || !xs) err(MS.blank);
      else {
        var yv = MV.parseNum(ys), xv = listOf(xs);
        if (!yv || yv.length !== 1 || !xv) err(MS.bad);
        else {
          var ms = [];
          if (!near(yv[0], M.yint, 0.006)) ms.push(f.fb.y);
          if (!sameSet(xv, M.xint, 0.006)) ms.push(f.fb.x7 && xv.some(function(v){ return near(Math.abs(v), 7, 1e-6); }) ? f.fb.x7 : f.fb.x);
          if (ms.length) bad(ms.join(" ")); else ok();
        }
      }
    }
    else if (sid === "d1" && !d.ph) {
      raw = String(d.inp.crit || "").trim(); var cv = listOf(raw);
      if (!raw) err(MS.blank);
      else if (!cv) err(MS.bad);
      else if (cv.some(function(v){ return M.va.some(function(a){ return near(a, v, 0.006); }); })) bad(MS.va);
      else {
        var ex = cv.filter(function(v){ return !M.crit.some(function(c){ return near(c, v, 0.006); }); });
        if (ex.length) bad(tpl(MS.critExtra, { x:m("x = " + srcN(ex[0])) }));
        else if (!sameSet(uniqN(cv), M.crit, 0.006)) bad(MS.critMiss);
        else { d.ph = 1; sfb = { good:true, html:"<strong>✓ Right.</strong> " + f.fb.crit }; }
      }
    }
    else if (sid === "d1") { var r1 = cells("sg1", colsAt(M.crit.concat(M.va)), M.d1); if (typeof r1 === "string") err(r1); else if (!r1) bad(S.fn === "S4" ? f.fb.sg1 : MS.cellBad + " " + f.fb.sg1); else ok(); }
    else if (sid === "d2") {
      var r2 = cells("sg2", colsAt(M.infl.concat(M.va)), M.d2);
      raw = String(d.inp.infl || "").trim(); var iv = listOf(raw);
      if (typeof r2 === "string") err(r2);
      else if (!r2) bad(MS.cellBad + " " + f.fb.sg2);
      else if (!raw) err(MS.blank);
      else if (!iv) err(MS.bad);
      else if (iv.some(function(v){ return M.va.some(function(a){ return near(a, v, 0.006); }); })) bad(MS.va);
      else if (f.fb.infl1 && iv.some(function(v){ return near(v, 1, 0.006); })) bad(f.fb.infl1);
      else if (!sameSet(uniqN(iv), M.infl, 0.006)) bad(MS.inflBad + " " + f.fb.infl);
      else ok();
    }
    api.save(); paintAll();
    MV.focusFb(q("#cs-stepq"));
  }
  function uniqN(a){ return a.slice().sort(function(p, r){ return p - r; }).filter(function(v, i, A){ return !i || !near(v, A[i - 1], 1e-6); }); }
  // ---- events ----
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || anim || b.closest("#cs-sk")) return;
    var d = D();
    if (b.dataset.fn) { if (b.dataset.fn !== S.fn) { S.fn = b.dataset.fn; sfb = null; sbad = {}; flash = null; viewStep = null; hl = null; } api.save(); paintAll(); return; }
    if (b.dataset.mode) { S.mode = b.dataset.mode; sfb = null; flash = null; viewStep = null; hl = null; api.save(); paintAll(); return; }
    if (b.dataset.step) {
      var id = b.dataset.step; sfb = null; flash = null; sbad = {};
      if (S.mode === "guided") viewStep = d.done[id] && id !== curStep() ? id : null; else d.cur = id;
      api.save(); paintSteps(); paintSk(); return;
    }
    if (b.dataset.pick != null) { d.pick[shownStep()] = +b.dataset.pick; sfb = null; flash = null; api.save(); paintSteps(); return; }
    if (b.dataset.sym) { d.pick.sym = b.dataset.sym; sfb = null; flash = null; api.save(); paintSteps(); return; }
    if (b.dataset.cell) { var pr = b.dataset.cell.split("|"), vals = d[pr[0]]; vals[pr[1]] = vals[pr[1]] === "+" ? "-" : "+"; delete sbad[b.dataset.cell]; sfb = null; flash = null; api.save(); paintSteps(); return; }
    if (b.dataset.act === "stepchk") checkStep();
  });
  host.addEventListener("input", function(e){ var k = e.target.dataset && e.target.dataset.in; if (k) { D().inp[k] = e.target.value; api.save(); } });
  host.addEventListener("keydown", function(e){ if (e.key === "Enter" && e.target.dataset && e.target.dataset.in) { e.preventDefault(); if (!anim) checkStep(); } });
  q("#cs-true").addEventListener("change", function(e){ S.st[S.mode] = e.target.checked; hl = null; api.save(); render(); });
  paintAll();

  // ---- predictions ----
  var pred = {
    start:function(p){ S.fn = p.fn; sfb = null; flash = null; viewStep = null; hl = null; anim = { id:p.id, k:0 }; api.save(); paintAll(); },
    run:function(p, done){
      var d = D(p.fn);
      if (p.id === "p1") d.done.sym = 1;
      if (p.id === "p2") { d.done.asy = 1; d.done.d1 = 1; d.ph = 1; }
      if (p.id === "p4") { d.done.d1 = 1; d.ph = 1; }
      if (!anim) anim = { id:p.id, k:0 };
      api.save(); paintAll();
      MV.tween({ dur:2400, ease:function(k){ return k; }, step:function(k){ if (anim) { anim.k = k; render(); } }, done:function(){ anim = null; hl = p.id; paintAll(); done(); } });
    }
  };
  // ---- target challenges ----
  function chal(id){
    var c = CH[id], G = C.cmsg, M = MODELS[c.fn], d = D(c.fn), sk = d.sk, sh = sk.sh, I = ivs(M), ms = c.msgs, r;
    if (S.fn !== c.fn) return { ok:false, msg:tpl(G.fn, { fn:FN[c.fn].chip }) };
    function has(x, y){ return sk.pts.some(function(p){ return near(p[0], x, TOL) && near(p[1], y, TOL); }); }
    function need(list){ return list.every(function(q2){ return has(q2[0], q2[1]); }) ? null : G.miss; }
    function extra(){ var e = skExtra(M, sk); return e ? tpl(G.extra, { pt:"(" + nm(e[0]) + ", " + nm(e[1]) + ")" }) : null; }
    function shapes(){ var j; for (j = 0; j < I.length; j++) if (!sh[j]) return G.unset; for (j = 0; j < I.length; j++) if (sh[j] !== I[j].t) return tpl(G.shape, { iv:ivLab(I[j].a, I[j].b) }); return null; }
    if (id === "tc1") {
      if (sk.pts.some(function(p){ return near(Math.abs(p[0]), 7, TOL) && near(p[1], 0, TOL); })) return { ok:false, msg:ms.i7 };
      r = need([[0, 7], [-2, -9], [2, -9], [-1, 0], [1, 0], [-R7, 0], [R7, 0]]) || extra() || (sh[1] && sh[1] === sh[2] ? ms.one : null) || shapes();
    } else if (id === "tc2") {
      r = sh[1] === "dU" ? ms.a : sh[2] === "uU" ? ms.b : shapes();
    } else {
      if (sh[2] && sh[3] && dirOf(sh[2]) !== dirOf(sh[3])) r = ms.flat;
      else if (sh[1] === "uN") r = ms.b12;
      else if (sh[0] && sh[1] && bendOf(sh[0]) !== bendOf(sh[1])) r = ms.i1;
      else r = need([[1, -27], [2, -16], [4, 0], [0, 0]]) || extra() || shapes();
    }
    return r ? { ok:false, msg:r } : { ok:true };
  }
  return { predict:pred, challenge:function(id){ return chal(id); } };
}

// ---------- Part 3: From clues to curve ----------
var S3MAP = { P:"c", Q:"a", R:"d", S:"b" };
var S3F = {
  a:{ f:function(x){ return x * x * x - 3 * x * x; }, view:{ xmin:-2, xmax:4, ymin:-6, ymax:4 } },
  b:{ f:function(x){ return -x * x * x + 3 * x; }, view:{ xmin:-3, xmax:3, ymin:-4, ymax:4 } },
  c:{ f:function(x){ return (x * x - 1) * (x * x - 1); }, view:{ xmin:-2.2, xmax:2.2, ymin:-1, ymax:4 } },
  d:{ f:function(x){ return x / (x * x + 1); }, view:{ xmin:-6, xmax:6, ymin:-1, ymax:1 } }
};
function part3(host, api){
  var S = api.S, C = api.content, s1 = C.s1, s2 = C.s2, s3 = C.s3, fb1 = null, fb2 = null, fb3 = null, sel3 = null;
  S.s1 = S.s1 && Array.isArray(S.s1.sk) ? S.s1 : { tab:0, sk:[{ pts:[], sh:{} }, { pts:[], sh:{} }], ok:[false, false], shift:0 };
  S.s1.sk.forEach(function(k){ k.pts = Array.isArray(k.pts) ? k.pts : []; k.sh = k.sh || {}; });
  S.s1.ok = Array.isArray(S.s1.ok) ? S.s1.ok : [false, false]; S.s1.tab = S.s1.tab ? 1 : 0; S.s1.shift = +S.s1.shift || 0;
  S.s2 = S.s2 && S.s2.marks ? S.s2 : { mk:0, marks:{}, solved:false, origin:false };
  S.s3 = S.s3 && S.s3.done ? S.s3 : { done:{} };
  host.innerHTML =
    '<div class="part cs-st" id="cs-st1"><h3>' + s1.title + '</h3><p class="cs-cluep" id="cs-clues"><strong>Clues:</strong> ' + s1.clues + "</p><p>" + s1.text + '</p><div class="cs-tabs" id="cs-s1tabs"></div>' +
      '<div class="plot-wrap"><canvas class="plot wide" id="cs-s1g" role="img" aria-label="Sketch pad"></canvas></div><div id="cs-s1ctl"></div>' +
      '<div class="q-actions" id="cs-s1act"></div><div id="cs-s1fb" aria-live="polite"></div>' +
      '<div class="cs-shift" id="cs-s1shift" hidden><p><strong>' + s1.shiftHead + '</strong></p><label class="slider"><span class="slider-top"><span>' + s1.shift + '</span><output id="cs-s1out"></output></span>' +
      '<input type="range" id="cs-s1sl" min="-6" max="6" step="0.5" style="accent-color:var(--ink)" aria-label="Vertical shift, from −6 to 6"></label><p class="cs-shmsg" id="cs-s1msg" aria-live="polite"></p></div></div>' +
    '<div class="part cs-st" id="cs-st2"><h3>' + s2.title + "</h3><p>" + s2.text + '</p><div class="plot-wrap"><canvas class="plot wide" id="cs-s2d" role="img" aria-label="Graph of f′(x) = (x + 1)(x − 2)"></canvas></div>' +
      '<p class="tiny cs-s2lab"><strong>Strip for ' + m("f") + '</strong></p><div class="plot-wrap"><canvas class="plot cs-s2strip" id="cs-s2s" role="img" aria-label="Strip for f"></canvas></div>' +
      '<p class="how">' + s2.how + '</p><div id="cs-s2ctl"></div><div id="cs-s2fb" aria-live="polite"></div><div id="cs-s2done"></div></div>' +
    '<div class="part cs-st" id="cs-st3"><h3>' + s3.title + "</h3><p>" + s3.text + '</p><div class="cs-m3"><div class="cs-eqs" id="cs-s3eq" role="group" aria-label="Equations"></div>' +
      '<div class="cs-sks" role="group" aria-label="Sketches">' + Object.keys(S3MAP).map(function(k){ return '<button type="button" class="cs-skb" data-s3sk="' + k + '" data-k="s3' + k + '"><canvas class="plot" id="cs-s3c' + k + '" role="img" aria-label="' + MV.esc(s3.sketchName + " " + k) + '"></canvas><span class="cs-skn" id="cs-s3n' + k + '"></span></button>'; }).join("") +
      '</div></div><div id="cs-s3fb" aria-live="polite"></div></div>';
  // ---- Station 1 ----
  var M1 = MODELS.ST1, g1 = new MV.Plot($("#cs-s1g"), M1.view);
  function bothOk(){ return S.s1.ok[0] && S.s1.ok[1]; }
  function sk1(){ return S.s1.sk[S.s1.tab]; }
  var pad1 = sketchPad({ plot:g1, ctl:$("#cs-s1ctl"), pre:"s1", model:function(){ return M1; }, state:sk1, compare:false, lock:function(){ return !!S.s1.ok[S.s1.tab]; },
    onChange:function(){ fb1 = null; api.save(); paint1(); } });
  function draw1(){
    var V = M1.view, sc = { view:V, xLabel:"x", yLabel:"y", curves:[], points:[], labels:[] }, both = bothOk(), sh = both ? S.s1.shift : 0, other = S.s1.sk[1 - S.s1.tab];
    if (both) skAdd(sc, M1, other, V, { color:css("--ink-2"), width:2, solid:true });
    skAdd(sc, M1, sk1(), V, { solid:true, shift:sh });
    sc.describe = "Sketch pad for station 1. " + (sk1().pts.length ? "Points: " + sk1().pts.map(function(p){ return "(" + nm(p[0]) + ", " + nm(p[1] + sh) + ")"; }).join(", ") + "." : "No points yet.") + " Shapes: (−∞, 1) " + (sk1().sh[0] ? MV.plain(MV.C.explore.sketch.words[sk1().sh[0]]) : "not chosen") + "; (1, ∞) " + (sk1().sh[1] ? MV.plain(MV.C.explore.sketch.words[sk1().sh[1]]) : "not chosen") + "." + (both ? " Shifted by " + nm(sh) + "; the other sketch is drawn in grey." : "");
    sc.after = function(ctx, pl){ if (both) skPts(ctx, pl, other, { color:css("--ink-2"), noLabel:true }); skPts(ctx, pl, sk1(), { shift:sh }); };
    g1.draw(sc);
  }
  g1.render = draw1;
  function judge1(i){
    var sk = S.s1.sk[i], F = s1.fb, P = sk.pts.slice().sort(function(a, b){ return a[0] - b[0]; }), mi = -1;
    P.forEach(function(p, k){ if (near(p[0], 1, TOL) && near(p[1], -2, TOL)) mi = k; });
    if (mi < 0) return F.min;
    if (P.length < 2) return F.more;
    if (!sk.sh[0] || !sk.sh[1]) return F.unset;
    if (sk.sh[0] !== "dU") return F.left;
    if (sk.sh[1] !== "uU") return F.right;
    var sl = [];
    for (var k = 0; k + 1 < P.length; k++) sl.push((P[k + 1][1] - P[k][1]) / (P[k + 1][0] - P[k][0]));
    for (k = 0; k < sl.length; k++) if ((k < mi && sl[k] >= 0) || (k >= mi && sl[k] <= 0)) return F.dir;
    for (k = 1; k < sl.length; k++) if (sl[k] <= sl[k - 1] + 1e-9) return F.bend;
    var o = S.s1.sk[1 - i];
    if (S.s1.ok[1 - i] && o.pts.length === P.length && o.pts.slice().sort(function(a, b){ return a[0] - b[0]; }).every(function(p, k2){ return near(p[0], P[k2][0]) && near(p[1], P[k2][1]); })) return F.same;
    return null;
  }
  function paint1(){
    MV.keepFocus($("#cs-s1tabs"), function(){ $("#cs-s1tabs").innerHTML = '<span class="seg" role="group" aria-label="Sketches">' + s1.tabs.map(function(t, i){ return '<button type="button" data-s1tab="' + i + '" data-k="s1tab' + i + '" aria-pressed="' + (S.s1.tab === i) + '"' + (i === 1 && !S.s1.ok[0] && !S.s1.ok[1] ? " disabled" : "") + ">" + t + (S.s1.ok[i] ? " ✓" : "") + "</button>"; }).join("") + "</span>"; });
    pad1.paint();
    MV.keepFocus($("#cs-s1act"), function(){ $("#cs-s1act").innerHTML = S.s1.ok[S.s1.tab] ? "" : '<button type="button" class="btn primary sm" data-s1="check" data-k="s1chk">' + s1.check + "</button>"; });
    var ok = S.s1.ok, both = bothOk();
    $("#cs-s1fb").innerHTML = fb1 ? MV.fbHTML(fb1.good ? "good" : "bad", fb1.html) : ok[S.s1.tab] ? MV.fbHTML("good", both ? s1.fb.ok2 : s1.fb.ok1) : "";
    $("#cs-s1shift").hidden = !both;
    var c1 = $(".cs-clue1", host); if (c1) c1.classList.toggle("off", both);
    if (both) { $("#cs-s1sl").value = S.s1.shift; $("#cs-s1out").textContent = (S.s1.shift > 0 ? "+" : "") + nm(S.s1.shift); $("#cs-s1msg").textContent = S.s1.shift ? MV.plain(s1.shiftMsg) : ""; }
    draw1();
  }
  $("#cs-st1").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || b.closest("#cs-s1ctl")) return;
    if (b.dataset.s1tab != null) { S.s1.tab = +b.dataset.s1tab; fb1 = null; api.save(); paint1(); return; }
    if (b.dataset.s1 === "check") {
      var i = S.s1.tab, r = judge1(i);
      if (r) fb1 = { good:false, html:"<strong>✗ Not yet.</strong> " + r };
      else { S.s1.ok[i] = true; fb1 = { good:true, html:bothOk() ? s1.fb.ok2 : s1.fb.ok1 }; if (!S.s1.ok[1 - i]) S.s1.tab = 1 - i; }
      api.save(); paint1(); MV.focusFb($("#cs-st1"));
    }
  });
  $("#cs-s1sl").addEventListener("input", function(e){ S.s1.shift = +e.target.value; api.save(); paint1(); });
  paint1();
  // ---- Station 2 ----
  var V2 = { xmin:-3, xmax:4, ymin:-3.5, ymax:8 }, gd = new MV.Plot($("#cs-s2d"), V2), gs = new MV.Plot($("#cs-s2s"), { xmin:-3, xmax:4, ymin:0, ymax:1 }), gf = null, ok2 = false;
  var FD = function(x){ return (x + 1) * (x - 2); }, FF = function(x){ return x * x * x / 3 - x * x / 2 - 2 * x; }, MW = { max:"max", min:"min", infl:"infl." };
  function draw2(){
    var ink = css("--ink"), f3 = css("--f3");
    gd.draw({ view:V2, xLabel:"x", yLabel:"f′(x)", curves:[{ f:FD, color:f3, width:2.6 }], points:[{ x:-1, y:0, r:5, open:true, color:ink }, { x:2, y:0, r:5, open:true, color:ink }, { x:0.5, y:-2.25, r:5, color:f3 }],
      labels:[{ x:0.5, y:-2.25, text:"vertex (1/2, −9/4)", dx:10, dy:14, align:"left", bg:true, font:ui(12) }],
      describe:"Graph of f′(x) = (x + 1)(x − 2): a parabola opening up, crossing the x-axis at −1 and 2, with its vertex at (1/2, −9/4)." });
    gs.draw({ view:{ xmin:-3, xmax:4, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:"Strip for f from −3 to 4. " + marksText() + (S.s2.solved ? "" : " Marker at x = " + nm(S.s2.mk) + "."), after:function(ctx, pl){
      var y = pl.H * 0.45; ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(pl.W, y); ctx.stroke();
      ctx.font = ui(11); ctx.fillStyle = css("--ink-2"); ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var t = -3; t <= 4; t++) { var X = pl.X(t); ctx.beginPath(); ctx.moveTo(X, y - 5); ctx.lineTo(X, y + 5); ctx.stroke(); if (t > -3 && t < 4) ctx.fillText(nm(t), X, y + 8); }
      Object.keys(S.s2.marks).forEach(function(k){ var x = +k, X = pl.X(x); ctx.fillStyle = css("--pen"); ctx.beginPath(); ctx.arc(X, y, 6, 0, 2 * Math.PI); ctx.fill(); ctx.font = ui(12, 700); ctx.fillStyle = ink; ctx.textBaseline = "bottom"; ctx.fillText(MW[S.s2.marks[k]], X, y - 9); ctx.textBaseline = "top"; });
      if (!S.s2.solved) { var MX = pl.X(S.s2.mk); ctx.strokeStyle = css("--hi"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(MX, 2); ctx.lineTo(MX, pl.H - 2); ctx.stroke(); }
      ctx.restore(); } });
    if (gf) {
      var org = S.s2.origin;
      gf.draw({ view:{ xmin:-3, xmax:4, ymin:-5, ymax:3 }, xLabel:"x", yLabel:"f(x)", curves:[{ f:FF, color:css("--pen"), width:3 }],
        points:[{ x:-1, y:7 / 6, r:5, color:ink }, { x:2, y:-10 / 3, r:5, color:ink }, { x:0.5, y:-13 / 12, r:5, color:ink }, { x:0, y:0, r:org ? 6 : 4.5, color:ink, ring:org }],
        labels:[{ x:-1, y:7 / 6, text:"max (−1, 7/6)", dx:0, dy:-15, align:"center", bg:true, font:ui(12) }, { x:2, y:-10 / 3, text:"min (2, −10/3)", dx:0, dy:16, align:"center", bg:true, font:ui(12) }, { x:0.5, y:-13 / 12, text:"infl. (1/2, −13/12)", dx:9, dy:4, align:"left", bg:true, font:ui(12) }].concat(org ? [{ x:0, y:0, text:"(0, 0)", dx:-9, dy:-13, align:"right", bg:true, font:ui(12) }] : []),
        describe:"Graph of f(x) = x³/3 − x²/2 − 2x: a local max at (−1, 7/6), a point of inflection at (1/2, −13/12) and a local min at (2, −10/3)" + (org ? "; it passes through (0, 0)." : ".") });
    }
  }
  gd.render = draw2; gs.render = draw2;
  function marksText(){ var ks = Object.keys(S.s2.marks).map(Number).sort(function(a, b){ return a - b; }); return ks.length ? "Marks: " + ks.map(function(x){ return MW[S.s2.marks[String(x)]] + " at " + nm(x); }).join(", ") + "." : "No marks yet."; }
  function judge2(){
    var mk = S.s2.marks, F = s2.fb, ent = Object.keys(mk).map(function(k){ return [+k, mk[k]]; }), cnt = { max:0, min:0, infl:0 };
    ent.forEach(function(e2){ cnt[e2[1]]++; });
    function at(x){ return mk[String(x)]; }
    if (at(-1) === "infl" || at(2) === "infl") return F.zeroInfl;
    if (at(0.5) === "max" || at(0.5) === "min") return F.vertexExt;
    if (at(2) === "max" && at(-1) === "min") return F.swap;
    if (cnt.max !== 1 || cnt.min !== 1 || cnt.infl !== 1) return F.missing;
    return at(-1) === "max" && at(2) === "min" && at(0.5) === "infl" ? null : F.wrong;
  }
  function paint2(){
    var h = "";
    if (!S.s2.solved) {
      var cur = S.s2.marks[String(S.s2.mk)];
      h = '<div class="cs-mkrow"><span class="tiny" style="font-weight:700">Marker</span><button type="button" class="btn ghost sm cs-pm" data-s2="mm" data-k="s2mm" aria-label="Move the marker left">' + MINUS + '</button><output class="cs-mkout" aria-live="polite">' + m("x = " + srcN(S.s2.mk)) + '</output><button type="button" class="btn ghost sm cs-pm" data-s2="mp" data-k="s2mp" aria-label="Move the marker right">+</button></div>' +
        '<div class="q-actions cs-marks">' + ["max", "min", "infl"].map(function(t){ return '<button type="button" class="btn ghost sm" data-s2mark="' + t + '" data-k="s2m' + t + '" aria-pressed="' + (cur === t) + '">' + s2.marks[t] + "</button>"; }).join("") + "</div>" +
        '<div class="q-actions"><button type="button" class="btn primary sm" data-s2="check" data-k="s2chk">' + s2.check + "</button></div>";
    }
    MV.keepFocus($("#cs-s2ctl"), function(){ $("#cs-s2ctl").innerHTML = h; });
    $("#cs-s2fb").innerHTML = S.s2.solved ? MV.fbHTML("good", s2.fb.done) : fb2 ? MV.fbHTML("bad", "<strong>✗ Not yet.</strong> " + fb2) : "";
    if (S.s2.solved && !ok2) {
      ok2 = true;
      $("#cs-s2done").innerHTML = '<div class="plot-wrap"><canvas class="plot wide" id="cs-s2f" role="img" aria-label="Graph of f"></canvas></div><details class="alg"><summary>Check it with algebra</summary><div class="alg-lines">' + s2.algLines.map(function(l){ return "<div>" + l + "</div>"; }).join("") + "</div></details>" +
        '<div class="q-actions"><button type="button" class="btn ghost sm" data-s2="origin" data-k="s2org">' + s2.origin + '</button></div><div id="cs-s2org" aria-live="polite"></div>';
      gf = new MV.Plot($("#cs-s2f"), { xmin:-3, xmax:4, ymin:-5, ymax:3 }); gf.render = draw2;
    }
    if (ok2) $("#cs-s2org").innerHTML = S.s2.origin ? MV.fbHTML("good", s2.originYes) : "";
    draw2();
  }
  $("#cs-st2").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s2 === "origin") { S.s2.origin = true; api.save(); paint2(); return; }
    if (S.s2.solved) return;
    if (b.dataset.s2 === "mm" || b.dataset.s2 === "mp") { S.s2.mk = clamp(r9(S.s2.mk + (b.dataset.s2 === "mp" ? 0.5 : -0.5)), -3, 4); api.save(); paint2(); return; }
    if (b.dataset.s2mark) { var k = String(S.s2.mk); if (S.s2.marks[k] === b.dataset.s2mark) delete S.s2.marks[k]; else S.s2.marks[k] = b.dataset.s2mark; fb2 = null; api.save(); paint2(); return; }
    if (b.dataset.s2 === "check") { var r = judge2(); if (r) fb2 = r; else { S.s2.solved = true; fb2 = null; } api.save(); paint2(); MV.focusFb($("#cs-st2")); }
  });
  $("#cs-s2s").addEventListener("pointerdown", function(e){ if (S.s2.solved || !gs.v) return; var r = gs.c.getBoundingClientRect(); S.s2.mk = clamp(Math.round(gs.xOf(e.clientX - r.left) * 2) / 2, -3, 4); api.save(); paint2(); });
  paint2();
  // ---- Station 3 ----
  var EQ = {}; s3.eqs.forEach(function(q2){ EQ[q2.id] = q2; });
  var P3 = {};
  Object.keys(S3MAP).forEach(function(k){
    var F = S3F[S3MAP[k]], pl = new MV.Plot($("#cs-s3c" + k), F.view);
    pl.render = function(){ pl.draw({ view:F.view, curves:[{ f:F.f, color:css("--pen"), width:2.6 }], ticks:false, describe:s3.sketchName + " " + k + ": " + MV.plain(EQ[S3MAP[k]].desc) + "." }); };
    P3[k] = pl;
  });
  function paint3(){
    var done = S.s3.done, used = {};
    Object.keys(done).forEach(function(e2){ used[done[e2]] = e2; });
    MV.keepFocus($("#cs-s3eq"), function(){ $("#cs-s3eq").innerHTML = s3.eqs.map(function(q2){ var dn = !!done[q2.id], on = sel3 === q2.id; return '<button type="button" class="mitem' + (dn ? " done" : "") + '" data-s3eq="' + q2.id + '" data-k="s3e' + q2.id + '" aria-pressed="' + on + '"' + (dn ? " disabled" : "") + ">" + (dn ? '<span class="pair-n">✓ ' + done[q2.id] + "</span>" : "") + "<span>" + q2.t + "</span></button>"; }).join(""); });
    Object.keys(S3MAP).forEach(function(k){
      var b = $('[data-s3sk="' + k + '"]', host), e2 = used[k];
      b.disabled = !!e2; b.classList.toggle("done", !!e2);
      b.setAttribute("aria-label", s3.sketchName + " " + k + ": " + MV.plain(EQ[S3MAP[k]].desc) + (e2 ? ". Matched with " + MV.plain(EQ[e2].t) : ""));
      $("#cs-s3n" + k).innerHTML = s3.sketchName + " " + k + (e2 ? ": " + EQ[e2].t : "");
    });
    var all = s3.eqs.every(function(q2){ return done[q2.id]; });
    $("#cs-s3fb").innerHTML = fb3 ? MV.fbHTML(fb3.good ? "good" : "bad", fb3.html) + (all ? MV.fbHTML("good", s3.done) : "") : all ? MV.fbHTML("good", s3.done) : "";
  }
  $("#cs-st3").addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.s3eq) { sel3 = sel3 === b.dataset.s3eq ? null : b.dataset.s3eq; fb3 = null; paint3(); return; }
    if (b.dataset.s3sk) {
      if (!sel3) { fb3 = { good:false, html:"Tap an equation first, then its sketch." }; paint3(); return; }
      var q2 = EQ[sel3];
      if (S3MAP[b.dataset.s3sk] === sel3) { S.s3.done[sel3] = b.dataset.s3sk; fb3 = { good:true, html:tpl(s3.right, { clue:q2.clue }) }; sel3 = null; api.save(); }
      else fb3 = { good:false, html:"<strong>✗</strong> " + tpl(s3.wrong, { clue:q2.t + ": " + q2.clue }) };
      paint3(); MV.focusFb($("#cs-st3"));
    }
  });
  paint3();
  return {};
}

// ---------- Practice 2: Full sketches (V14 sketch pad, one item at a time) ----------
function fullAct(host, api, a){
  var S = api.S, items = a.items, MS = a.msgs, fb = {};
  S.it = S.it && typeof S.it === "object" ? S.it : {}; S.cur = clamp(+S.cur || 0, 0, items.length - 1);
  function ist(id){ var x = S.it[id]; if (!x || !x.sk || !Array.isArray(x.sk.pts)) x = S.it[id] = { sk:{ pts:[], sh:{}, cmp:false }, tries:0, hint:0, solved:false, first:null, peek:false }; x.sk.sh = x.sk.sh || {}; return x; }
  function cur(){ return items[S.cur]; }
  function Mo(){ return MODELS[cur().model]; }
  host.innerHTML = (a.how ? '<p class="how">' + a.how + "</p>" : "") + ('<div class="cs-knav" role="group" aria-label="Choose a sketch"></div><div class="q cs-kq"><div class="q-head"><span class="qn cs-kn" aria-hidden="true"></span><div class="q-prompt cs-kp"></div><span class="tag cs-kstar" hidden>★</span></div>' +
    '<div class="plot-wrap"><canvas class="plot cs-kg" role="img" aria-label="Sketch pad"></canvas></div><div class="cs-kctl"></div><div class="q-actions cs-kact"></div><div class="cs-kh"></div><div class="cs-kfb" aria-live="polite"></div>' +
    '<div class="q-actions cs-kpn"></div></div>');
  function el(s){ return $(s, host); }
  var plot = new MV.Plot(el(".cs-kg"), Mo().view);
  var pad = sketchPad({ plot:plot, ctl:el(".cs-kctl"), pre:"k", how:false, model:Mo, state:function(){ return ist(cur().id).sk; }, lock:function(){ return ist(cur().id).solved; },
    onCompare:function(on){ var x = ist(cur().id); if (on && !x.solved && !x.peek) { x.peek = true; fb[cur().id] = { good:false, html:MS.peek }; } },
    onChange:function(){ api.save(); paint(); } });
  function draw(){
    var it = cur(), x = ist(it.id), M = Mo(), V = M.view, all = x.solved || x.sk.cmp, sc = { view:V, xLabel:"x", yLabel:"y", asymptotes:[], curves:[], points:[], labels:[] };
    if (all) { featAdd(sc, M, { asy:true, int:true, d1:true, d2:true }); trueCurves(M, V, { color:css("--ink"), width:2.2 }).forEach(function(c){ sc.curves.push(c); }); }
    skAdd(sc, M, x.sk, V, { solid:all });
    sc.describe = "Sketch pad for " + MV.plain(it.f) + ". " + (x.sk.pts.length ? "Your points: " + x.sk.pts.map(function(p){ return "(" + nm(p[0]) + ", " + nm(p[1]) + ")"; }).join(", ") + "." : "No points yet.") +
      " Your shapes: " + ivs(M).map(function(iv){ return ivLab(iv.a, iv.b) + " " + (x.sk.sh[iv.j] ? MV.plain(MV.C.explore.sketch.words[x.sk.sh[iv.j]]) : "not chosen"); }).join("; ") + "." + (all ? " The true graph and its key points are shown." : "");
    sc.after = function(ctx, pl){ skPts(ctx, pl, x.sk, { skip:all ? M.keys : [] }); };
    plot.draw(sc);
  }
  plot.render = draw;
  function judge(it, x){
    var M = MODELS[it.model], sk = x.sk, sh = sk.sh, I = ivs(M), N = it.named || {}, e, j;
    if (it.id === "k3" && sk.pts.some(function(p){ return near(p[1], 0, TOL); })) return N.xint;
    if (it.id === "k1" && sh[1] === "dU") return N.shape1dU;
    if (it.id === "k2" && dirOf(sh[1]) === 1) return N.shape1u;
    if (it.id === "k4" && dirOf(sh[3]) === 1) return N.shape3u;
    if (skKeysHit(M, sk) < M.keys.length) return MS.miss;
    if ((e = skExtra(M, sk))) return tpl(MS.extra, { pt:"(" + nm(e[0]) + ", " + nm(e[1]) + ")" });
    for (j = 0; j < I.length; j++) if (!sh[j]) return MS.unset;
    for (j = 0; j < I.length; j++) if (sh[j] !== I[j].t) return tpl(MS.shape, { iv:ivLab(I[j].a, I[j].b) });
    return null;
  }
  function paint(){
    var it = cur(), x = ist(it.id);
    MV.keepFocus(el(".cs-knav"), function(){ el(".cs-knav").innerHTML = items.map(function(q2, i){ var xx = ist(q2.id), on = i === S.cur; return '<button type="button" class="chip' + (on ? " on" : "") + '" data-kgo="' + i + '" data-k="kgo' + i + '" aria-pressed="' + on + '">Sketch ' + (i + 1) + (q2.star ? " ★" : "") + (xx.solved ? " ✓" : "") + "</button>"; }).join(""); });
    el(".cs-kn").textContent = S.cur + 1; el(".cs-kp").innerHTML = it.f; el(".cs-kstar").hidden = !it.star;
    pad.paint();
    MV.keepFocus(el(".cs-kact"), function(){ el(".cs-kact").innerHTML = x.solved ? "" : '<button type="button" class="btn primary sm" data-kact="check" data-k="kchk">Check</button>' + MV.hintBtn("kh" + it.id, x.hint); });
    el(".cs-kh").innerHTML = x.solved ? "" : MV.hintsHTML(it.hints, x.hint);
    var f = fb[it.id];
    el(".cs-kfb").innerHTML = x.solved ? MV.fbHTML("good", "<strong>✓ Correct.</strong> " + it.solved + (x.first ? "" : ' <span class="muted">(not first try)</span>')) : f ? MV.fbHTML(f.good ? "good" : "bad", f.html) : "";
    MV.keepFocus(el(".cs-kpn"), function(){ el(".cs-kpn").innerHTML = '<button type="button" class="btn ghost sm" data-kgo="' + (S.cur - 1) + '" data-k="kprev"' + (S.cur === 0 ? " disabled" : "") + '>Previous sketch</button><button type="button" class="btn ' + (x.solved ? "primary" : "ghost") + ' sm" data-kgo="' + (S.cur + 1) + '" data-k="knext"' + (S.cur === items.length - 1 ? " disabled" : "") + ">Next sketch</button>"; });
    draw();
  }
  host.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b || b.disabled || !host.contains(b) || b.closest(".cs-kctl")) return;
    if (b.dataset.kgo != null) { S.cur = clamp(+b.dataset.kgo, 0, items.length - 1); api.save(); paint(); return; }
    var it = cur(), x = ist(it.id); if (x.solved) return;
    if (b.dataset.act === "hint") { x.hint = Math.min(3, x.hint + 1); api.save(); paint(); return; }
    if (b.dataset.kact === "check") {
      var r = judge(it, x);
      if (r) { x.tries++; fb[it.id] = { good:false, html:"<strong>✗ Not quite.</strong> " + r + " Try again." }; }
      else { x.solved = true; x.first = x.tries === 0 && x.hint < 3 && !x.peek; x.sk.cmp = true; fb[it.id] = null; }
      api.save(); paint(); MV.focusFb(el(".cs-kq"));
    }
  });
  paint();
  return {
    stats:function(){ var f = 0, d = 0; items.forEach(function(it){ var x = ist(it.id); if (x.solved) d++; if (x.first) f++; }); return { first:f, total:items.length, done:d, line:(a.summary || a.title) + " (first try): " + f + "/" + items.length + (d < items.length ? " (unfinished)" : "") }; },
    missed:function(){ var g = []; items.forEach(function(it){ var x = ist(it.id); if (x.tries > 0 || x.hint >= 3 || x.peek) g = g.concat(MV.goalIdx(it.goal != null ? it.goal : a.goal)); }); return g; }
  };
}

// ---------- Performance task: Clue designer ----------
function cubicModel(b, c, d){
  var f = function(x){ return ((x + b) * x + c) * x + d; }, d1 = function(x){ return (3 * x + 2 * b) * x + c; }, d2 = function(x){ return 6 * x + 2 * b; };
  var Dd = 4 * b * b - 12 * c, crit = [], keys = [], xi = -b / 3;
  if (Dd > 0) { var r = Math.sqrt(Dd); crit = [(-2 * b - r) / 6, (-2 * b + r) / 6]; keys.push(K(crit[0], f(crit[0]), "max", 0, 0, "a"), K(crit[1], f(crit[1]), "min", 0, 0, "b")); }
  else if (Dd === 0) crit = [xi];
  keys.push(K(xi, f(xi), Dd === 0 ? "flat" : "infl", 0, 0, "r"));
  var xs = crit.concat([xi, -1]), lo = Math.min.apply(null, xs) - 2, hi = Math.max.apply(null, xs) + 2;
  if (hi - lo < 8) { var c0 = (lo + hi) / 2; lo = c0 - 4; hi = c0 + 4; }
  var yl = 0, yh = 0; keys.forEach(function(k){ yl = Math.min(yl, k.y); yh = Math.max(yh, k.y); }); yl = Math.min(yl, f(-1)); yh = Math.max(yh, f(-1));
  var pad = Math.max(4, (yh - yl) * 0.3);
  return { f:f, d1:d1, d2:d2, crit:crit, infl:[xi], va:[], ea:null, keys:keys, view:{ xmin:lo, xmax:hi, ymin:yl - pad, ymax:yh + pad } };
}
var task = (function(){
  var api, pG, pS, NAMES = ["b", "c", "d"];
  function gi(k){ var s = api ? api.S : {}, raw = String(s[k] == null ? "" : s[k]).trim().replace(/−/g, "-"), v = Number(raw); return raw !== "" && Number.isInteger(v) ? v : null; }
  function read(){ var b = gi("b"), c = gi("c"), d = gi("d"); return { b:b, c:c, d:d, ok:[b, c, d].every(function(v){ return v !== null && v >= -12 && v <= 12; }) }; }
  function disc(b, c, d){ return 18 * b * c * d - 4 * b * b * b * d + b * b * c * c - 4 * c * c * c - 27 * d * d; }
  function checks(D){ if (!D.ok) return [false, false, false, false]; var b = D.b, c = D.c, d = D.d; return [3 - 2 * b + c === 0 && -6 + 2 * b < 0, 6 + 2 * b === 0, disc(b, c, d) > 0, -1 + b - c + d > 12]; }
  function src(D){ var s = "x^3"; [[D.b, "x^2"], [D.c, "x"], [D.d, ""]].forEach(function(t){ if (!t[0]) return; s += (t[0] < 0 ? " - " : " + ") + (Math.abs(t[0]) === 1 && t[1] ? "" : Math.abs(t[0])) + t[1]; }); return s; }
  function draw(){
    var D = read();
    if (!D.ok) { pG.draw({ view:{ xmin:-5, xmax:5, ymin:-10, ymax:10 }, describe:"Enter b, c and d to see the cubic." }); pS.draw({ view:{ xmin:-5, xmax:5, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:"Arrow and bend strips: enter b, c and d first." }); return; }
    var M = cubicModel(D.b, D.c, D.d), V = M.view, sc = { view:V, xLabel:"x", yLabel:"y", asymptotes:[], curves:[{ f:M.f, color:css("--pen"), width:3 }], points:[], labels:[], bands:[] };
    featAdd(sc, M, { d1:true, d2:true });
    sc.describe = "Graph of f(x) = " + MV.plain(m(src(D))) + ". " + (featText(M, { d1:true, d2:true }) || "") + ". The dashed line is x = −1.";
    sc.after = function(ctx, pl){ var X = pl.X(-1); ctx.save(); ctx.strokeStyle = css("--ink-2"); ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, pl.H); ctx.stroke(); ctx.restore(); pl.label({ x:-1, y:V.ymax, text:"x = −1", dx:5, dy:12, align:"left", bg:true, font:ui(12) }); };
    pG.draw(sc);
    pS.draw({ view:{ xmin:V.xmin, xmax:V.xmax, ymin:0, ymax:1 }, grid:false, axes:false, ticks:false, describe:stripText(M, { d1:true, d2:true }), after:function(ctx, pl){ stripRows(ctx, pl, M, 0, pl.H, { d1:true, d2:true }); } });
  }
  function update(){ draw(); var D = read(), el = $("#cs-tnow"); if (el) el.innerHTML = D.ok ? m("f(x) = " + src(D)) : MV.C.task.inputs.none; }
  function stepper(k, v){
    return '<div class="cs-tstep"><label for="cs-t' + k + '"><span class="m"><i>' + k + '</i></span> <span class="tiny muted">' + MV.C.task.inputs.range + "</span></label>" +
      '<button type="button" class="btn ghost sm" data-tst="' + k + '" data-dir="-1" data-k="ts' + k + 'm" aria-label="Decrease ' + k + '">' + MINUS + "</button>" +
      '<input class="numin short cs-tin" id="cs-t' + k + '" data-tk="' + k + '" type="number" min="-12" max="12" step="1" autocomplete="off" value="' + MV.esc(v) + '">' +
      '<button type="button" class="btn ghost sm" data-tst="' + k + '" data-dir="1" data-k="ts' + k + 'p" aria-label="Increase ' + k + '">+</button></div>';
  }
  return {
    render:function(inp, pv, A){
      api = A; if (A.S.b == null) { A.S.b = "0"; A.S.c = "0"; A.S.d = "0"; }
      inp.innerHTML = NAMES.map(function(k){ return stepper(k, A.S[k]); }).join("") + '<p class="cs-tnow" id="cs-tnow" aria-live="polite"></p>';
      pv.innerHTML = '<div class="plot-wrap"><canvas class="plot" id="cs-tg" role="img" aria-label="Your cubic"></canvas></div><div class="plot-wrap"><canvas class="plot cs-strip" id="cs-ts" role="img" aria-label="Arrow and bend strips"></canvas></div>';
      pG = new MV.Plot($("#cs-tg"), { xmin:-5, xmax:5, ymin:-10, ymax:10 }); pS = new MV.Plot($("#cs-ts"), { xmin:-5, xmax:5, ymin:0, ymax:1 });
      pG.render = draw; pS.render = draw;
      inp.addEventListener("input", function(e){ var k = e.target.dataset.tk; if (!k) return; A.S[k] = e.target.value; A.save(); update(); A.update(); });
      inp.addEventListener("click", function(e){
        var b = e.target.closest("button"); if (!b || !b.dataset.tst) return;
        var k = b.dataset.tst, c = parseInt(String(A.S[k]).replace(/−/g, "-"), 10); if (!isFinite(c)) c = 0;
        A.S[k] = String(clamp(c + +b.dataset.dir, -12, 12)); $("#cs-t" + k).value = A.S[k]; A.save(); update(); A.update();
      });
      update();
    },
    read:read,
    valid:function(D){ return D.ok ? true : MV.C.task.inputs.none; },
    checks:checks,
    key:function(D){ return D.b + "|" + D.c + "|" + D.d; },
    label:function(k){ var s = k.split("|"); return m("b = " + s[0] + ", c = " + s[1] + ", d = " + s[2]); },
    text:function(k){ var s = k.split("|"); return "b = " + s[0].replace("-", MINUS) + ", c = " + s[1].replace("-", MINUS) + ", d = " + s[2].replace("-", MINUS); }
  };
})();

MV.module({
  hero:hero,
  explore:explore,
  part3:part3,
  activities:{ full:fullAct },
  task:task
});
})();
